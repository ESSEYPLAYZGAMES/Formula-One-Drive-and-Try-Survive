// Race control: yellow flags, the Virtual Safety Car and the Safety Car, run like the real thing.
//
//  * An incident (a retired car stopped on or beside the track) first brings out the yellow flags: for a few seconds
//    the race goes on everywhere except in the double-yellow zone before the incident (slow down, no overtaking) - the
//    last seconds of racing before the field is neutralised are still racing.
//  * Then race control decides: a car beside the track is a Virtual Safety Car (everyone holds a delta speed, no
//    overtaking), a car on the racing surface (or more than one) is a Safety Car.
//  * The Safety Car is a real car on the track, driven by its own AIDriver. It leaves from the pit exit, released by
//    race control as the leader comes up to it (about 14 s away), so it slots in just ahead; with the leader only just
//    past the exit it goes at once and chases it down at speed, passing whatever is in between - until the leader is
//    the first car behind it. Until then the field runs to the delta. Only the
//    leader queues behind it: anyone else that finds itself behind it is waved by. The field closes up at the delta
//    speed and follows in a line, no overtaking (a place taken has to be given back); a car far off the back of the
//    queue (250 m+) runs a faster catch-up pace to rejoin it. Once the leader is picked up: "LAPPED CARS MAY NOW
//    OVERTAKE" - lapped cars in the queue go by it and the safety car and round to the back. Under the safety car a
//    stop costs far less: the AI takes the cheap stop when its tyres want it (and the gamblers were waiting for it).
//  * Once the wreck is recovered and the field is bunched: "SAFETY CAR IN THIS LAP". The lights go out, the car peels
//    into the pit lane at the end of the lap, the leader sets the pace and picks the moment to go - and nobody may
//    overtake until they have crossed the control line.
// The player gets the same rules (delta on the dash, no overtaking) and the same penalties.
import { Car } from '../vehicle/Car.js';
import { AIDriver } from '../ai/AIDriver.js';

const YELLOW_T = [5, 9];          // seconds of yellow flags before race control neutralises the race (random in range)
const SC_MIN = 50, SC_MAX = 170;  // the safety car stays out at least / at most this long (s) once the incident is clear
const VSC_MIN = 22, VSC_END = 8;
const CLEAR_T = 3;                // seconds an incident must stay clear before it counts as clear (a stopped car shunted by the next one moves for a moment)
const RAMP = 8;                   // seconds over which the delta speed comes in after the call
const RED_T = 4;                  // seconds after the red flag (the board, the radio) before the race is suspended and every car is on the grid - no lap round at a crawl in which some cars stopped and others raced on
const RED = { scale: 0.5, vCap: 38 };
const SC_PACE = { scale: 0.7, vCap: 52, brake: 0.5 };   // the safety car itself (~185 km/h on the straights, braking gently: no accordion behind it)
const DELTA = { scale: 0.76, vCap: 62 };       // the field catching up under the safety car
const VSC = { scale: 0.68, vCap: 55 };         // the virtual safety car delta, for everyone
const CHASE = { scale: 1.0, vCap: 85, brake: 1 };   // the safety car catching the leader from behind
const HOLD = { scale: 0.6, vCap: 45, brake: 0.5 };     // ... or waiting for it to come round
const CATCHUP = { scale: 0.88, vCap: 72 };      // a car far off the back of the queue
const UNLAP = { scale: 0.86, vCap: 70 };        // a lapped car going round the queue

export class SafetyCar {
  constructor(director, enabled = true) {
    this.d = director; this.enabled = enabled && director.mode === 'race';
    this.phase = 'green'; this.t = 0;
    this.incident = null;             // { s, cars: Set, onRoad }
    this.car = null; this.driver = null;
    this.scanT = 0; this.passT = 0; this.order = new Map();
    this.count = { sc: 0, vsc: 0 };
    this.playerDelta = 0; this.deltaWarned = false;
    this.log = [];
  }
  get active() { return this.phase !== 'green'; }
  /** what the scorebug and HUD show */
  hudState() {
    if (this.phase === 'green') return null;
    const label = { yellow: 'YELLOW FLAG', sc: 'SAFETY CAR', scIn: 'SC IN THIS LAP', vsc: 'VIRTUAL SAFETY CAR', vscEnd: 'VSC ENDING', restart: 'GREEN AT THE LINE', red: 'RED FLAG' }[this.phase];
    return { phase: this.phase, label, delta: this.deltaShown ? this.playerDelta : null };
  }
  say(text, kind, t, radio, prio = 3) {
    this.d.hud?.msg(text, kind, t);
    if (radio) this.d.engineer?.say(radio, prio);
    this.log.push([+this.d.time.toFixed(1), text.split('\n')[0]]);
  }

  // ---- every frame ------------------------------------------------------------------------------------------------
  update(dt) {
    const d = this.d; if (!this.enabled || !d.world.racing || d.done) return;
    this.t += dt;
    this.scanT -= dt; if (this.scanT <= 0) { this.scanT = 0.5; this.scan(); }
    this.clearT = this.incidentLive() ? 0 : (this.clearT || 0) + dt;
    const L = d.track.length;
    switch (this.phase) {
      case 'red':
        if (d.cancelled) break;   // (a race cancelled after a life lost: the red flag stays, nobody restarts)
        if (this.t > RED_T) { this.phase = 'green'; this.t = 0; this.incident = null; this.removeCar(); d.redFlagRestart(); }
        break;
      case 'yellow':
        if (this.t > this.yellowT) {
          if (this.incident.onRoad || this.incident.cars.size > 1) this.deploySC(); else this.deployVSC();
        } else if (this.clear()) { this.phase = 'green'; this.t = 0; this.say('GREEN FLAG · TRACK CLEAR', 'good', 2); }
        break;
      case 'vsc':
        if (this.incident.onRoad) { this.deploySC(); break; }   // (it got worse: a car on the road)
        if (this.t > VSC_MIN && this.clear()) { this.phase = 'vscEnd'; this.t = 0; this.say('VSC ENDING', 'warn', 3, 'VSC ending, VSC ending. Get ready, it goes green any moment.'); }
        break;
      case 'vscEnd':
        if (this.t > VSC_END) { this.phase = 'green'; this.t = 0; this.say('GREEN FLAG', 'good', 2.5, 'Green, green, green. Push now.'); }
        break;
      case 'sc': {
        if (this.waiting) this.release();
        const leader = this.leader(), finalLap = leader && leader.lap + 1 >= d.lapsTotal;
        const toPit = this.car ? this.ds(this.car.s, d.pit ? d.pit.entryS : 0) : 0;
        const clear = this.clear();
        const unlapping = d.cars.some((c) => c._unlap);
        if (finalLap || (clear && this.picked && !unlapping && this.t > SC_MIN && (this.bunched() || this.t > SC_MAX) && toPit > 700 && toPit < 0.6 * L)) {
          this.phase = 'scIn'; this.t = 0;
          this.say('SAFETY CAR IN THIS LAP', 'warn', 4, finalLap ? 'Safety car in this lap, we finish behind it. Hold position to the line.' : 'Safety car in this lap. Get the tyres warm, the leader controls the restart.');
        }
        break;
      }
      case 'scIn': {
        const c = this.car;
        if (!c) { this.startRestart(); break; }
        // into the pit lane at the end of the lap (on a circuit with no pit lane: off at the line)
        const P = d.pit, to = P ? this.ds(c.s, P.entryS) : this.ds(c.s, 0);
        if (P && to < 450) c.pitRequested = true;
        if (c.pitLane || (!P && to < 30)) this.startRestart();
        break;
      }
      case 'restart': {
        const running = d.cars.filter((c) => !c.retired && !c.finished && !c.pitLane && c.speed > 3);
        if (running.every((c) => c._scGreen) || this.t > 120) { this.phase = 'green'; this.t = 0; }
        break;
      }
    }
    if (this.car) this.driveCar(dt);
    if (this.restricted()) { this.passT -= dt; if (this.passT <= 0) { this.passT = 0.25; this.checkPasses(); } } else this.order.clear();
    this.playerRules(dt);
  }

  /** the safety car's own driving: its AIDriver at 60 Hz (the race director steps its physics with everyone else) */
  driveCar(dt) {
    const c = this.car, d = this.d;
    c.dmg.fwL = c.dmg.fwR = c.dmg.rw = c.dmg.susp = c.dmg.eng = 0;   // (bodywork rubs off it, nothing breaks)
    c.retired = false; c.engTemp = 0.3;
    if (c._wasLane && !c.pitLane) c.pitLaneState = null;   // (out of the pit lane: on the circuit now)
    c._wasLane = c.pitLane;
    // the leader picked up: the first running car behind the safety car (within 400 m) is the leader. Until then it
    // chases a leader that is ahead of it, and waits (slowly) for one that is behind
    if (!this.picked && !c.pitLane && this.phase === 'sc') {
      const lead = this.leader(); let first = null, fx = Infinity;
      if (lead) { const x = d.planDs(c.s, lead.s); this.mode = x > 0 && x < 0.6 * d.track.length ? 'chase' : 'hold'; }
      for (const o of d.cars) { if (o.retired || o.pitLane || o.inPit || o.speed < 5) continue; const x = this.ds(o.s, c.s); if (x > 0 && x < fx) { fx = x; first = o; } }
      if (lead && first === lead && fx < 400) {
        this.picked = true; this.pickedT = d.time;
        this.log.push([+d.time.toFixed(1), `picked up ${lead.short}`]);
        if (lead.isPlayer) d.engineer?.say('Safety car is right ahead of you now. Hold station behind it.', 2);
      }
    }
    // lapped cars may overtake (once, a while after the pickup): the lapped cars in the queue go round it
    if (this.picked && !this.unlapCalled && this.phase === 'sc' && d.time - this.pickedT > 20) {
      this.unlapCalled = true;
      const lead = this.leader(), L = d.track.length; let n = 0;
      if (lead) for (const o of d.cars) {
        if (o.retired || o.pitLane || o.inPit || o.finished) continue;
        const behindSC = this.ds(o.s, c.s);
        if (d.progress(lead) - d.progress(o) > L - 500 && behindSC < 2500) { o._unlap = true; n++; }
      }
      if (n) this.say('LAPPED CARS MAY NOW OVERTAKE', 'warn', 3, d.player?._unlap ? 'Lapped cars may overtake, that includes us. Go past the queue and the safety car and round to the back.' : null, 2);
    }
    // a lapped car is done once it is past the safety car; the catch-up pace brings it round to the back
    for (const o of d.cars) if (o._unlap) { const x = d.planDs(c.s, o.s); if ((x > 40 && x < 1500) || o.retired || o.pitLane) o._unlap = false; }
    // gone (into the pit lane, or recovered somewhere off the road after a spin): off the circuit
    if (this.phase === 'restart' || (c.pitLane && this.phase !== 'sc')) this.removeCar();
  }

  // ---- incidents --------------------------------------------------------------------------------------------------
  /** a stopped, retired car on or near the racing surface (not yet recovered); this and onRoad measure from the road's
   *  edge on the car's own side (Austin's corners are widened on their outside only) */
  blocking(c) { return c.retired && !c.cleared && !c.air && c.speed < 3 && Math.abs(c.d) < this.d.track.edgeAt(c.trackIdx, Math.sign(c.d) || 1) + 14 && !c.inPit && !c.pitLane; }
  onRoad(c) { return Math.abs(c.d) < this.d.track.edgeAt(c.trackIdx, Math.sign(c.d) || 1) + 2.5; }
  incidentLive() { return this.incident && [...this.incident.cars].some((c) => this.blocking(c)); }
  /** the incident has stayed clear for CLEAR_T seconds */
  clear() { return !this.incidentLive() && (this.clearT || 0) > CLEAR_T; }
  /**
   * Red flag: a car torn in two, three or more cars stopped on the circuit in one accident - the race is suspended
   * (not on the final lap: that finishes under the safety car).
   */
  /** a life lost: the red flag, and the race is over - no restart (RaceDirector.cancelRace) */
  cancel() {
    const d = this.d; if (this.phase !== 'red') { this.removeCar(); this.phase = 'red'; this.t = 0; this.neutralT = d.time - RAMP; this.redCount = (this.redCount || 0) + 1; }
  }
  redFlag(why) {
    const d = this.d, lead = this.leader();
    if (this.phase === 'red' || (lead && lead.lap + 1 >= d.lapsTotal)) return false;
    this.removeCar(); this.phase = 'red'; this.t = 0; this.neutralT = d.time - RAMP; this.redCount = (this.redCount || 0) + 1;
    d.rank(); d._order = d.positions.slice();   // (the order frozen at the flag: RaceDirector.rank, redFlagRestart)
    this.say(`RED FLAG\n${why}`, 'bad', 5, 'Red flag, red flag. Slow down, the race is suspended.', 3);
    return true;
  }
  scan() {
    const d = this.d;
    if (this.phase !== 'red' && !this._redLock) {
      // (red flags only for what the safety car cannot cover: a car torn in two lying on the road, or four or more cars
      //  stopped on it in one accident - everything else is a safety car; only a life lost cancels the race)
      const split = d.cars.find((c) => c.split && !c._redSeen && c.speed < 1);
      if (split) { split._redSeen = true; if (this.onRoad(split) && this.redFlag(`${split.short} · MAJOR ACCIDENT`)) return; }
      if (this.incident && this.incident.onRoad && this.incident.cars.size >= 4 && !this.incident.red) { this.incident.red = true; if (this.redFlag('MULTIPLE CARS STOPPED')) return; }
    }
    for (const c of d.cars) {
      // (a car already flagged counts again once the flags are green: the incident went clear - shunted, rolling -
      //  and it has stopped on the road again)
      if (!this.blocking(c) || (c._scSeen && this.phase !== 'green')) continue;
      c._scSeen = true;
      if (!this.incident || this.phase === 'green') this.incident = { s: c.s, cars: new Set(), onRoad: false };
      this.incident.cars.add(c); if (this.onRoad(c)) this.incident.onRoad = true;
      if (this.phase === 'green') {
        this.phase = 'yellow'; this.t = 0; this.yellowT = YELLOW_T[0] + Math.random() * (YELLOW_T[1] - YELLOW_T[0]);
        const tr = d.track, z = tr.inCornerZone(c.trackIdx) || tr.inCornerZone(tr.idxAtS(c.s + 80));
        this.say(`YELLOW FLAG${z && z.name ? ' · ' + z.name.toUpperCase() : ''}\n${c.short} STOPPED`, 'warn', 3, `Yellow flag, ${c.name.split(' ').pop()} has stopped${this.onRoad(c) ? ' on track' : ''}. No overtaking in the yellow zone.`, 2);
      }
    }
  }
  /** the field has closed up: the line of cars behind the safety car (each within 150 m of the one ahead) holds 85 % of them */
  bunched() {
    const sc = this.car; if (!sc) return true;
    const run = this.d.cars.filter((c) => !c.retired && !c.finished && !c.pitLane && !c.inPit && c.speed > 5);
    const behind = run.map((c) => this.ds(c.s, sc.s)).sort((a, b) => a - b);
    let n = 0, prev = 0; for (const x of behind) { if (x - prev > 150) break; n++; prev = x; }
    return n >= Math.ceil(0.85 * run.length);
  }
  /** the race leader on the road (not in the pit lane) */
  leader() { return this.d.positions.find((c) => !c.retired && !c.finished && !c.pitLane && !c.inPit && c.speed > 5) || null; }
  ds(a, b) { return this.d.planDs(a, b) < 0 ? this.d.planDs(a, b) + this.d.track.length : this.d.planDs(a, b); }

  deployVSC() {
    this.phase = 'vsc'; this.t = 0; this.count.vsc++; this.playerDelta = 0; this.deltaWarned = false; this.neutralT = this.d.time;
    this.say('VIRTUAL SAFETY CAR', 'warn', 4, 'VSC, VSC. Stay above the delta on the dash, no overtaking.');
  }
  deploySC() {
    const d = this.d; if (this.phase !== 'vsc') this.neutralT = d.time;   // (a VSC upgraded to the safety car is already slowed)
    this.phase = 'sc'; this.t = 0; this.count.sc++; this.playerDelta = 0; this.deltaWarned = false;
    this.say('SAFETY CAR DEPLOYED', 'warn', 4, 'Safety car, safety car. Stay above the delta, no overtaking. We will look at boxing.');
    this.picked = false; this.unlapCalled = false; this.waiting = false;
    if (this.car) return;
    // at once (no pit lane, or the leader just went by the pit exit: chase it), or held at the exit until it comes round
    const lead = this.leader(), ex = this.exitS();
    if (ex == null || !lead) { this.spawnCar(); return; }
    const past = d.planDs(ex, lead.s);
    if (past > 0 && past < 500) this.spawnCar(); else { this.waiting = true; this.log.push([+d.time.toFixed(1), 'SC waiting at the pit exit']); }
  }
  /** where the pit lane meets the circuit again (track s) */
  exitS() {
    const P = this.d.pit; if (!P) return null;
    if (this._exitS == null) { const ps = P.samples, iM = Math.min(ps.n - 1, Math.round(P.mergeU / ps.ds)); this._exitS = this.d.track.nearest(ps.px[iM], ps.pz[iM]).s; }
    return this._exitS;
  }
  /** held at the pit exit: released when the leader is ~14 s from it (or after 2.5 min, whatever happens) */
  release() {
    const d = this.d, lead = this.leader(), ex = this.exitS(); if (!lead || ex == null) return;
    const to = this.ds(lead.s, ex);
    if (to / Math.max(20, lead.speed) < 14 || this.t > 150) { this.waiting = false; this.spawnCar(); }
  }
  /**
   * The safety car leaves from the pit exit (just past the exit speed line). Where the leader is decides its pace
   * until it has picked it up: already past the pit exit (within 60 % of a lap) - CHASE it; still to come - HOLD.
   */
  spawnCar() {
    const d = this.d, tr = d.track, lead = this.leader(); if (!lead) return;
    const c = new Car(tr, { name: 'Safety Car', short: 'SC', team: 'FIA', color: '#c9ccd2', perf: 1, rating: 1, number: 0, compound: 'MEDIUM', raceLaps: d.lapsTotal, assists: { tc: true, abs: true } });
    c.isSC = true; c.lap = -100; c.lapDist = 0;
    c.launch = () => {}; c.applyImpact = () => 0;   // (a tank: it is nudged, never wrecked)
    const P = d.pit;
    if (P) {
      // on the pit lane's exit road, pointing down it, from a standstill
      const ps = P.samples, i = Math.max(0, Math.min(ps.n - 2, Math.round((P.limitTo + 12) / ps.ds)));
      c.x = ps.px[i]; c.z = ps.pz[i]; c.th = Math.atan2(ps.tz[i], ps.tx[i]); c.vLong = 0; c.vLat = 0; c.r = 0;
      const q = tr.nearest(c.x, c.z); c.trackIdx = q.i; c.s = q.s; c.prevS = q.s; c.d = q.d;
      c.pit = P; c.manualPit = true; c.pitLaneState = 'out'; c.pitLane = true; c._wasLane = true;
      const past = d.planDs(this.exitS(), lead.s);   // + : the leader has gone by the pit exit
      this.mode = past > 0 && past < 0.6 * tr.length ? 'chase' : 'hold';
    } else {
      // (no pit lane: it joins 170 m ahead of the leader)
      let s = lead.s + 170;
      for (let k = 0; k < 12; k++) { if (d.cars.some((o) => !o.retired && Math.abs(d.planDs(s, o.s)) < 18)) s += 25; else break; }
      c.placeOnTrack(tr.wrapS(s), d.line.offsetAt(s), Math.min(lead.speed, SC_PACE.vCap));
      this.mode = 'hold';
    }
    c.lapDist = 0; c.lapStart = d.time; c.ghost = 0;
    this.log.push([+d.time.toFixed(1), `SC out (${this.mode})`]);
    this.car = c;
    this.driver = new AIDriver(c, d.line, d.profile, tr, { aggression: 0.3, skill: 1 });
    this.driver.reaction = 0; this.driver.isSC = true;
    d.simCars = [...d.cars, c]; d.world.cars = d.simCars;
  }
  removeCar() {
    if (!this.car) return;
    this.car.removed = true; this.car = null; this.driver = null;
    this.d.simCars = null; this.d.world.cars = this.d.cars;
  }
  startRestart() {
    const d = this.d; this.removeCar();
    this.phase = 'restart'; this.t = 0;
    this._greenSaid = false;
    this.goDist = 120 + Math.random() * 380;   // where the leader goes: somewhere in the last few hundred metres
    for (const c of d.cars) c._scGreen = false;
    this.say('SAFETY CAR IN\nNO OVERTAKING UNTIL THE LINE', 'warn', 3);
  }
  /** the car leading the restart: the first on the road that has not crossed the line and is not heading into the pits */
  restartLead() {
    if (this._rlT === this.d.time) return this._rl;
    this._rlT = this.d.time;
    return (this._rl = this.d.positions.find((c) => !c.retired && !c.finished && !c.pitLane && !c.pitRequested && !c._scGreen && c.speed > 5) || null);
  }
  /** a car crossed the control line */
  onLine(c) {
    if (this.phase !== 'restart' || c._scGreen) return;
    c._scGreen = true;
    if (!this._greenSaid) { this._greenSaid = true; this.say('GREEN FLAG', 'good', 2.5, c.isPlayer ? null : 'Green flag, green flag. Go.'); }
  }

  // ---- the rules --------------------------------------------------------------------------------------------------
  restricted() { return this.phase !== 'green'; }
  /** 0 -> 1 over the first RAMP seconds of a VSC / safety car */
  ramp() { return Math.min(1, Math.max(0, (this.d.time - (this.neutralT ?? -1e9)) / RAMP)); }
  /** in the double-yellow zone: from 350 m before the incident to 60 m past it */
  inYellowZone(c) { if (!this.incident) return false; const x = this.d.planDs(c.s, this.incident.s); return x > -60 && x < 350; }
  /**
   * What an AI car may do now: { scale (of its cornering speeds), vCap (m/s), noPass, gap (following, m) } or null
   * (racing). The safety car itself drives at its own pace.
   */
  rules(c) {
    const ph = this.phase;
    if (c.isSC) { const P = !this.picked && this.phase === 'sc' ? (this.mode === 'chase' ? CHASE : HOLD) : SC_PACE; return { scale: P.scale, vCap: P.vCap, brake: P.brake, noPass: false, gap: 0, sc: true }; }
    if (c._unlap) return { scale: UNLAP.scale, vCap: UNLAP.vCap, brake: 0.9, noPass: false, gap: 0 };   // (lapped cars may overtake)
    switch (ph) {
      case 'red': return { scale: RED.scale, vCap: RED.vCap, brake: 0.6, noPass: true, gap: 14 };
      case 'yellow': return this.inYellowZone(c) ? { scale: 0.85, vCap: null, noPass: true, gap: 0 } : null;
      // (a queue brakes early and gently - planned at 60 % of the brakes, the rest kept in hand for the car in front:
      //  a line of twenty cars that each brake late concertinas into the slow corners)
      // The delta comes in over RAMP seconds after the call (the whole field standing on the brakes at once is a
      // pile-up, not a neutralisation).
      case 'vsc': case 'vscEnd': { const k = this.ramp(); return { scale: 1 - (1 - VSC.scale) * k, vCap: 96 - (96 - VSC.vCap) * k, brake: 1 - 0.4 * k, noPass: true, gap: 14 * k }; }
      case 'sc': case 'scIn': {
        // the delta - or, far off the back of the queue, the catch-up pace; only the leader queues behind the safety car
        const k = this.ramp(), R = this.gapAhead(c) > 250 ? CATCHUP : DELTA, queueSC = c === this.leader();
        return { scale: 1 - (1 - R.scale) * k, vCap: 96 - (96 - R.vCap) * k, brake: 1 - 0.4 * k, noPass: true, gap: (15 + (ph === 'scIn' ? 4 : 0)) * k, queueSC };
      }
      case 'restart': {
        if (c._scGreen) return null;
        // (the leader on the road - not one peeling into the pits - holds the pace until it picks its moment)
        if (c === this.restartLead() && this.ds(c.s, 0) > this.goDist) return { scale: SC_PACE.scale, vCap: SC_PACE.vCap - 2, noPass: true, gap: 0 };
        return { scale: 1, vCap: null, noPass: true, gap: 0 };
      }
    }
    return null;
  }
  /** distance (m) to the next running car ahead on the road (or the safety car) */
  gapAhead(c) {
    const d = this.d; let best = Infinity;
    for (const o of d.simCars || d.cars) { if (o === c || o.retired || o.pitLane || o.inPit || o.cleared) continue; const x = d.planDs(c.s, o.s); if (x > 0 && x < best) best = x; }
    return best;
  }
  /** a stop now is a cheap one (the field is running slowly) */
  get cheapStop() { return this.phase === 'sc' || this.phase === 'vsc'; }

  /** overtaking while it is not allowed: two running cars that swapped places on the road (the stewards handle it) */
  checkPasses() {
    const d = this.d, cars = d.cars, seen = new Set();
    const ok = (c) => !c.retired && !c.finished && !c.pitLane && !c.inPit && !c.spinning && c.speed > 8 && !c.air;
    for (let i = 0; i < cars.length; i++) {
      const a = cars[i]; if (!ok(a)) continue;
      for (let j = i + 1; j < cars.length; j++) {
        const b = cars[j]; if (!ok(b)) continue;
        const x = d.planDs(a.s, b.s); if (Math.abs(x) > 40) continue;
        const key = a.id * 1000 + b.id; seen.add(key);
        const prev = this.order.get(key), now = Math.sign(x);
        this.order.set(key, now);
        if (prev == null || prev === now || now === 0) continue;
        const passer = now < 0 ? a : b, passed = now < 0 ? b : a;   // (x < 0: b is behind a now - a went by)
        if (passed._owes === passer || passer._unlap) continue;   // (a place being given back; a lapped car unlapping itself)
        if (!this.passBanned(passer, passed)) continue;
        d.stewards.scPass(passer, passed);
      }
    }
    for (const k of this.order.keys()) if (!seen.has(k)) this.order.delete(k);
  }
  passBanned(passer, passed) {
    switch (this.phase) {
      case 'yellow': return this.inYellowZone(passer) && this.inYellowZone(passed);
      case 'restart': return !passer._scGreen && !passed._scGreen;
      default: return true;
    }
  }

  /**
   * The player under the (virtual) safety car: the dash delta. Running faster than the delta speed (a car that is
   * not yet in the queue behind the safety car, or anyone under the VSC) eats into the delta; below zero for long is
   * a penalty. Gaining time back by driving slower is allowed, up to a margin.
   */
  playerRules(dt) {
    const d = this.d, p = d.player; this.deltaShown = false;
    if (!p || p.retired || p.finished || p.pitLane || p.inPit || p._unlap) return;
    const ph = this.phase, vsc = ph === 'vsc' || ph === 'vscEnd', sc = ph === 'sc' || ph === 'scIn';
    if (ph === 'red') return;   // (a red flag: just bring it round slowly)
    if (!vsc && !sc) return;
    // in the queue (within 120 m of the car ahead on the road, or of the safety car): the queue sets the pace
    if (sc) {
      let near = this.car && d.planDs(p.s, this.car.s) > 0 && d.planDs(p.s, this.car.s) < 120;
      if (!near) for (const o of d.cars) { if (o === p || o.retired || o.pitLane) continue; const x = d.planDs(p.s, o.s); if (x > 0 && x < 120) { near = true; break; } }
      if (near) { this.playerDelta = Math.min(1, this.playerDelta + dt * 0.5); this.deltaShown = true; return; }
    }
    const R = vsc ? VSC : this.gapAhead(p) > 250 ? CATCHUP : DELTA, tr = d.track;   // (far off the back of the queue: the catch-up pace)
    const k = this.ramp(), vRef = Math.max(15, Math.min(96 - (96 - R.vCap) * k, d.profile[p.trackIdx] * (1 - (1 - R.scale) * k)));
    // delta (s): + is slower than the reference (fine), - faster
    this.playerDelta += dt * (1 - p.speed / vRef);
    this.playerDelta = Math.min(1.5, this.playerDelta); this.deltaShown = true;
    if (this.playerDelta < -0.6 && !this.deltaWarned) { this.deltaWarned = true; d.hud?.msg(`${vsc ? 'VSC' : 'SC'} DELTA · SLOW DOWN`, 'bad', 2); d.engineer?.say('Watch the delta, you are under it. Slow down.', 3); }
    if (this.playerDelta < -2.2) { d.stewards.award(p, 5, `not respecting the ${vsc ? 'VSC' : 'safety car'} delta`); this.playerDelta = 0.5; this.deltaWarned = false; }
  }
}
