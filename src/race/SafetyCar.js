// Race control: yellow flags, the Virtual Safety Car and the Safety Car, run like the real thing.
//
//  * An incident (a retired car stopped on or beside the track) first brings out the yellow flags: for a few seconds
//    the race goes on everywhere except in the double-yellow zone before the incident (slow down, no overtaking) - the
//    last seconds of racing before the field is neutralised are still racing.
//  * Then race control decides: a car beside the track is a Virtual Safety Car (everyone holds a delta speed, no
//    overtaking), a car on the racing surface (or more than one) is a Safety Car.
//  * The Safety Car is a real car, there all race: parked at the end of the pit lane (in the working lane past the
//    last garage, facing the exit, lights off), out of the way of anyone leaving the pits. On the call it pulls away at
//    once, orange lights flashing, and joins the circuit wherever the leader is - it never waits for it. It holds a
//    steady, slow pace ahead of whatever comes up behind it: a car that is not the leader gets the green lights and is
//    waved by (it goes past and on at speed to catch the back of the pack); that repeats until the leader is the first
//    car behind it - then orange again, and nobody passes it.
//  * From the call every car runs the Safety Car delta (about a third slower than a racing lap; a car far off the back
//    of the queue a little quicker) until it has caught the queue, then it simply follows the car ahead: the delta is
//    quicker than the queue, so the field closes up into one line behind the safety car. No overtaking (a place taken
//    has to be given back) - except a car in trouble (damaged, a puncture, off the road), which may be passed. Under the safety car a stop costs far less: the AI takes the cheap stop when its tyres want
//    it (and the gamblers were waiting for it).
//  * Once the leader is picked up and the track is clear: "LAPPED CARS MAY NOW OVERTAKE" - lapped cars in the queue go
//    by it and the safety car and on, at speed, round to the back of the queue.
//  * Once the wreck is recovered, the lapped cars are back and the field is one queue (or it has been out long enough):
//    "SAFETY CAR IN THIS LAP". The lights go out, the car peels into the pit lane at the end of the lap and parks at
//    the exit again, ready for the next one; the leader sets the pace and picks the moment to go - and nobody may
//    overtake until they have crossed the control line.
// The player gets the same rules (delta on the dash, no overtaking, waved by / lapped cars excepted) and the same
// penalties. (A circuit with no pit lane: the safety car joins just ahead of the leader and leaves at the line.)
import { Car, CAR } from '../vehicle/Car.js';
import { AIDriver, AI_TUNE, laneSpeeds } from '../ai/AIDriver.js';

const YELLOW_T = [5, 9];          // seconds of yellow flags before race control neutralises the race (random in range)
const SC_MIN = 45;                // the safety car stays out at least this long (s from the call) ...
const SC_MAX = 240;               // ... and once it has the leader, at most this long waiting for the queue to form ...
const SC_ABS = 420;               // ... and never longer than this from the call, whatever happens (once the track is clear)
const QUEUE_GAP = 60;             // (m) one queue: each car within this of the one ahead (about a car's gap at the pace, with room)
const VSC_MIN = 22, VSC_END = 8;
const CLEAR_T = 3;                // seconds an incident must stay clear before it counts as clear (a stopped car shunted by the next one moves for a moment)
const RAMP = 8;                   // seconds over which the delta speed comes in after the call
const RED_T = 4;                  // seconds after the red flag (the board, the radio) before the race is suspended and every car is on the grid - no lap round at a crawl in which some cars stopped and others raced on
const RED = { scale: 0.5, vCap: 38 };
// the paces: scale = of the cornering speeds, vCap = top speed (m/s). The queue is slower than the delta, the delta
// slower than the catch-up pace: a car on its own always closes on the line ahead of it.
const SC_PACE = { scale: 0.5, vCap: 39, brake: 0.5 };   // the safety car with the leader behind it (~140 km/h on the straights, braking gently: no accordion behind it)
const HOLD = { scale: 0.46, vCap: 35, brake: 0.5 };     // ... and before that: a steady pace the cars it waves by can pass at, and the leader catch
const WAIT = { scale: 0.38, vCap: 28, brake: 0.5 };     // ... with nobody close behind it yet: slower still, the field closes on it
const DELTA = { scale: 0.75, vCap: 64 };       // the safety car delta (about a third slower than a racing lap)
const CATCHUP = { scale: 0.88, vCap: 74 };     // a car far (CATCH_GAP m) off the back of the car ahead
const CATCH_GAP = 150;
const WAVED = { scale: 0.92, vCap: 80 };        // waved by, or a lapped car let go: at speed (safely) round to the back of the queue
const VSC = { scale: 0.68, vCap: 55 };         // the virtual safety car delta, for everyone

export class SafetyCar {
  constructor(director, enabled = true) {
    this.d = director; this.enabled = enabled && director.mode === 'race';
    this.phase = 'green'; this.t = 0;
    this.incident = null;             // { s, cars: Set, onRoad }
    // body: the safety car itself, there all race (parked at the pit exit, or out on the circuit); car: the same car
    // while it is out - driven, simulated with the field, in world.cars - else null
    this.body = null; this.car = null; this.driver = null; this.parked = false; this.laneMode = null; this.lights = 'off';
    this.scanT = 0; this.passT = 0; this.order = new Map();
    this.count = { sc: 0, vsc: 0 };
    this.playerDelta = 0; this.deltaWarned = false;
    this.log = [];
  }
  note(text) { this.log.push([+this.d.time.toFixed(1), text]); }
  get active() { return this.phase !== 'green'; }
  /** (tests, balancing: the paces) */
  get paces() { return { sc: SC_PACE, hold: HOLD, wait: WAIT, delta: DELTA, catchup: CATCHUP, waved: WAVED, vsc: VSC }; }
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
    const d = this.d; if (!this.enabled) return;
    if (!this.body && d.pit) this.makeBody();   // (parked at the pit exit from the start)
    if (!d.world.racing || d.done) { this.lights = this.car ? this.lightState() : 'off'; return; }
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
          // (a car on the road, more than one car, or a car that has crashed within seven metres of it - it wants a crane,
          //  marshals at the road's edge: the safety car. A car that simply stopped clear of the road - an engine, a
          //  gearbox - or a wreck deep in a run-off: the virtual one)
          if (this.incident.onRoad || this.incident.cars.size > 1 || [...this.incident.cars].some((c) => (c.wreck || /accident|damage|crash|rolled|upside/i.test(c.retireReason || '')) && Math.abs(c.d) < d.track.edgeAt(c.trackIdx, Math.sign(c.d) || 1) + 7)) this.deploySC(); else this.deployVSC();
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
        const leader = this.leader(), finalLap = leader && leader.lap + 1 >= d.lapsTotal;
        const onRoad = this.car && !this.laneMode && !this.car.pitLane;
        const toPit = onRoad ? this.ds(this.car.s, d.pit ? d.pit.entryS : 0) : 0;
        const clear = this.clear();
        // (the lapped cars let go are past the safety car and back at the end of the queue - "a safe distance away")
        const unlapping = d.cars.some((c) => !c.retired && (c._unlap || (c._waved && c._lappedRun)));
        const tPicked = this.picked ? d.time - this.pickedT : 0;
        const ready = this.picked && this.unlapCalled && !unlapping && this.t > SC_MIN && (this.bunched() || tPicked > SC_MAX);
        if (onRoad && (finalLap || (clear && (ready || this.t > SC_ABS) && toPit > 700 && toPit < 0.6 * L))) {
          this.phase = 'scIn'; this.t = 0;
          const q = this.queueStats(); this.note(`SC in this lap: queue ${q.n}/${q.run} over ${Math.round(q.spread)} m${finalLap ? ' (final lap)' : ''}`);
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
        if (c.pitLane || (P && this.laneMode === 'in') || (!P && to < 30)) this.startRestart();
        break;
      }
      case 'restart': {
        const running = d.cars.filter((c) => !c.retired && !c.finished && !c.pitLane && c.speed > 3);
        if (running.every((c) => c._scGreen) || this.t > 120) { this.phase = 'green'; this.t = 0; }
        break;
      }
    }
    if (this.car) this.driveCar(dt);
    this.lights = this.car ? this.lightState() : 'off';
    if (this.restricted()) { this.passT -= dt; if (this.passT <= 0) { this.passT = 0.25; this.checkPasses(); } } else this.order.clear();
    this.playerRules(dt);
  }

  /**
   * The light bar, for the renderer: 'amber' (flashing: leading the field, or on its way out to it), 'green' (waving
   * the car behind it by - that car is not the leader), 'off' (parked, "in this lap", on its way back in)
   */
  lightState() {
    if (!this.car || this.parked || this.phase !== 'sc') return 'off';
    if (!this.picked && !this.laneMode && !this.car.pitLane && this.behind && this.behindX < 300 && this.behind !== this.leader()) return 'green';
    return 'amber';
  }

  /** the safety car's own driving: its AIDriver at 60 Hz (the race director steps its physics with everyone else) */
  driveCar(dt) {
    const c = this.car, d = this.d, P = d.pit;
    c.dmg.fwL = c.dmg.fwR = c.dmg.rw = c.dmg.susp = c.dmg.eng = 0;   // (bodywork rubs off it, nothing breaks)
    c.retired = false; c.engTemp = 0.3;
    if (c._wasLane && !c.pitLane) c.pitLaneState = null;   // (out of the pit lane: on the circuit now)
    c._wasLane = c.pitLane;
    const onRoad = !c.pitLane && !this.laneMode;
    // the first running car behind it (the one it is holding up - or waving by)
    let first = null, fx = Infinity;
    if (onRoad) for (const o of d.cars) { if (o.retired || o.pitLane || o.inPit || o.finished || o.speed < 5) continue; const x = this.ds(o.s, c.s); if (x > 0 && x < fx) { fx = x; first = o; } }
    this.behind = first; this.behindX = fx;
    if (onRoad && !this._outSaid && this.phase === 'sc') {
      this._outSaid = true; const lead = this.leader();
      this.note(`SC on track ahead of ${first ? first.short : '-'} (${Math.round(fx)} m back), leader ${lead ? lead.short : '-'} ${lead ? Math.round(this.ds(lead.s, c.s)) : '-'} m behind it`);
    }
    // the leader picked up: the first running car behind the safety car (within 400 m) is the leader. Until then the
    // ones in between get the green lights
    if (!this.picked && onRoad && this.phase === 'sc') {
      const lead = this.leader();
      // (a car told to go by that will not - the player sitting behind it - is not allowed to hold up the pickup for ever)
      const stuck = first && first.isPlayer && first !== lead && (this._waveT = (this._waveT || 0) + dt) > 25;
      if (lead && fx < 400 && (first === lead || (stuck && this.ds(lead.s, c.s) < 600))) {
        this.picked = true; this.pickedT = d.time;
        this.note(`picked up ${lead.short} (${Math.round(d.time - this.deployT)} s after the call)`);
        if (lead.isPlayer) d.engineer?.say('Safety car is right ahead of you now. Hold station behind it.', 2);
      } else if (first && first !== lead && fx < 120 && first.isPlayer && !this._toldWave) {
        this._toldWave = true; d.engineer?.say('Safety car is showing green for us, we are not the leader. Overtake it and catch the back of the pack.', 2);
      }
    }
    // going by it: waved by (before the pickup), or a lapped car let go - both on at speed to the back of the queue
    for (const o of d.cars) {
      if (o.retired || o.pitLane || o.inPit || o.finished || !onRoad) { o._scX = null; continue; }
      const x = d.planDs(c.s, o.s), prev = o._scX; o._scX = x;
      if (prev == null || !(prev < 0 && x >= 0 && prev > -80 && x < 80)) continue;
      if (o._unlap) { o._unlap = false; o._waved = true; o._lappedRun = true; this.note(`${o.short} unlapped itself past the SC`); }
      else if (this.phase === 'sc' && !this.picked && !o._waved) {
        o._waved = true; this.note(`waved by ${o.short}`);
        if (o.isPlayer) d.engineer?.say('Good, now go and catch the back of the pack. Safely, and no overtaking anyone else.', 2);
      }
    }
    // with the pack again: within 120 m of a car ahead that is itself in the queue (or the end of the neutralisation)
    for (const o of d.cars) if (o._waved) {
      const a = this.nextAhead(o);
      if (o.retired || o.pitLane || !this.restricted() || this.phase === 'restart' || (a && a.x < 120 && !a.o._waved && !a.o._unlap)) {
        if (!o.retired && this.restricted()) this.note(`${o.short} back with the pack`);
        o._waved = false; o._lappedRun = false;
      }
    }
    // lapped cars may overtake (once, a while after the pickup, with the track clear): the lapped cars in the queue
    // go round it
    if (this.picked && !this.unlapCalled && this.phase === 'sc' && d.time - this.pickedT > 10 && this.clear()) {
      this.unlapCalled = true;
      const lead = this.leader(); let n = 0;
      if (lead) {
        const bl = this.ds(lead.s, c.s);
        for (const o of d.cars) {
          if (o === lead || o.retired || o.pitLane || o.inPit || o.finished || o._waved || o.speed < 5) continue;
          const behindSC = this.ds(o.s, c.s);
          // (lapped: a lap more behind the leader in the race than it is on the road)
          if (behindSC < 2500 && d.progress(lead) - d.progress(o) > behindSC - bl + d.track.length / 2) { o._unlap = true; n++; }
        }
      }
      this.note(`lapped cars may overtake: ${n}`);
      if (n) this.say('LAPPED CARS MAY NOW OVERTAKE', 'warn', 3, d.player?._unlap ? 'Lapped cars may overtake, that includes us. Go past the queue and the safety car and round to the back.' : null, 2);
    }
    for (const o of d.cars) if (o._unlap && (o.retired || o.pitLane || o.inPit)) o._unlap = false;
    if (!P) { if (this.phase === 'restart' || this.phase === 'green') this.removeCar(); return; }
    // (somehow out on the circuit with nothing to do - it missed the pit entry: in next time round)
    if (this.phase !== 'sc' && this.phase !== 'scIn' && !this.laneMode) c.pitRequested = true;
  }
  /** the nearest running car ahead of c on the road: { o, x } or null */
  nextAhead(c) {
    const d = this.d; let best = null, bx = Infinity;
    for (const o of d.cars) { if (o === c || o.retired || o.pitLane || o.inPit || o.cleared || o.finished || o.speed < 5) continue; const x = this.ds(c.s, o.s); if (x > 0 && x < bx) { bx = x; best = o; } }
    return best ? { o: best, x: bx } : null;
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
  /**
   * The line behind the safety car: { n: cars in it (each within QUEUE_GAP m of the one ahead), run: cars staying out,
   * spread: m from the safety car to the last car in it }
   */
  queueStats(gap = QUEUE_GAP) {
    // (the cars staying out: not those in the pit lane or on their way into it)
    const sc = this.car, run = this.d.cars.filter((c) => !c.retired && !c.finished && !c.pitLane && !c.inPit && !c.pitRequested && c.speed > 5);
    if (!sc || sc.pitLane) return { n: 0, run: run.length, spread: 0 };
    const behind = run.map((c) => this.ds(c.s, sc.s)).sort((a, b) => a - b);
    let n = 0, prev = 0; for (const x of behind) { if (x - prev > gap) break; n++; prev = x; }
    return { n, run: run.length, spread: prev };
  }
  /** the field has closed up: the line of cars behind the safety car holds 85 % of them */
  bunched() {
    if (!this.car) return true;
    const q = this.queueStats(); return q.n >= Math.ceil(0.85 * q.run);
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
    this.phase = 'sc'; this.t = 0; this.count.sc++; this.playerDelta = 0; this.deltaWarned = false; this.deployT = d.time;
    this.say('SAFETY CAR DEPLOYED', 'warn', 4, 'Safety car, safety car. Stay above the delta, no overtaking. We will look at boxing.');
    this.picked = false; this.unlapCalled = false; this._outSaid = false; this._toldWave = false; this._waveT = 0; this.behind = null; this.behindX = Infinity;
    for (const c of d.cars) { c._waved = false; c._lappedRun = false; c._unlap = false; c._scX = null; }
    if (this.car) {
      // (still rolling back down the pit lane from the last one: straight back out)
      this.car.pitRequested = false;
      if (this.laneMode === 'in') { this.laneMode = 'out'; this.note('SC back out of the pit lane'); }
      else this._outSaid = !this.car.pitLane && !this.laneMode;
      return;
    }
    // it leaves at once, from where it is parked at the end of the pit lane - wherever the leader is
    if (this.body) this.launch(); else this.spawnCar();
  }
  /** where the pit lane meets the circuit again (track s) */
  exitS() {
    const P = this.d.pit; if (!P) return null;
    if (this._exitS == null) { const ps = P.samples, iM = Math.min(ps.n - 1, Math.round(P.mergeU / ps.ds)); this._exitS = this.d.track.nearest(ps.px[iM], ps.pz[iM]).s; }
    return this._exitS;
  }
  newCar() {
    const d = this.d;
    const c = new Car(d.track, { name: 'Safety Car', short: 'SC', team: 'FIA', color: '#c9ccd2', perf: 1, rating: 1, number: 0, compound: 'MEDIUM', raceLaps: d.lapsTotal, assists: { tc: true, abs: true } });
    c.isSC = true; c.lap = -100; c.lapDist = 0;
    c.launch = () => {}; c.applyImpact = () => 0;   // (a tank: it is nudged, never wrecked)
    return c;
  }
  /**
   * Its bay: the end of the pit lane, in the working lane on the garage side past the last garage (clear of the car
   * pulling out of that box) and short of the exit line - beside the fast lane, not in it.
   */
  parkSpot() {
    if (this.spot) return this.spot;
    const P = this.d.pit, ps = P.samples;
    let b1 = -Infinity; for (const b of P.boxes) b1 = Math.max(b1, ps.s[b.i]);
    let u = Math.max(b1 + 30, Math.min(P.limitTo - 12, P.mergeU - 30));
    u = Math.min(u, P.mergeU - 20, ps.length - 2);
    const i = Math.max(0, Math.min(ps.n - 1, Math.round(u / ps.ds))), gs = -P.trackSide;
    const lat = gs * Math.max(2.4, Math.min(3.4, (P.garageW ? P.garageW[i] : P.halfWidth + 0.7) - 2.1));
    return (this.spot = { u: ps.s[i], i, lat, x: ps.px[i] + ps.nx[i] * lat, z: ps.pz[i] + ps.nz[i] * lat, th: Math.atan2(ps.tz[i], ps.tx[i]) });
  }
  makeBody() { this.body = this.newCar(); this.parkBody(); this.note(`SC parked at the pit exit (lane ${Math.round(this.spot.u)} m of ${Math.round(this.d.pit.length)})`); }
  /** set down in its bay: stopped, lights off, out of the simulation (nothing drives through it there) */
  parkBody() {
    const c = this.body, d = this.d, P = d.pit, K = this.parkSpot(), tr = d.track;
    c.x = K.x; c.z = K.z; c.th = K.th; c.vLong = c.vLat = c.r = 0; c.steer = 0; c.throttle = 0; c.brake = 1; c.ers = 0; c.gear = 1;
    c.hv = c.hvd = c.pt = c.ptd = c.rl = c.rld = 0; c.wh.u.fill(0);
    const q = tr.nearest(c.x, c.z); c.trackIdx = q.i; c.s = q.s; c.prevS = q.s; c.d = q.d;
    c.pit = P; c.manualPit = true; c.pitLaneState = 'out'; c.pitLane = true; c._wasLane = true; c.pitRequested = false; c.pitU = K.u;
    for (const k in c.dmg) if (typeof c.dmg[k] === 'number') c.dmg[k] = 0;
    c.retired = false; c.removed = false;
    this.parked = true; this.laneMode = null; this.lights = 'off';
  }
  /** away from its bay with the lights on: into the simulation, driven */
  launch() {
    const d = this.d, c = this.body; this.parkBody();
    this.parked = false; this.laneMode = 'out'; c.brake = 0;
    c.lapDist = 0; c.lapStart = d.time; c.ghost = 0;
    this.car = c; this.makeDriver();
    this.note('SC leaves the pit lane');
  }
  makeDriver() {
    const d = this.d, c = this.car;
    this.driver = new AIDriver(c, d.line, d.profile, d.track, { aggression: 0.3, skill: 1 });
    this.driver.reaction = 0; this.driver.isSC = true;
    this.driver.pitDrive = (dt, world) => this.laneDrive(dt, world);   // (its own way down the pit lane: from its bay and back to it)
    d.simCars = [...d.cars, c]; d.world.cars = d.simCars;
  }
  /** (no pit lane) it joins 170 m ahead of the leader */
  spawnCar() {
    const d = this.d, tr = d.track, lead = this.leader(); if (!lead) return;
    const c = this.newCar();
    let s = lead.s + 170;
    for (let k = 0; k < 12; k++) { if (d.cars.some((o) => !o.retired && Math.abs(d.planDs(s, o.s)) < 18)) s += 25; else break; }
    c.placeOnTrack(tr.wrapS(s), d.line.offsetAt(s), Math.min(lead.speed, SC_PACE.vCap));
    c.lapDist = 0; c.lapStart = d.time; c.ghost = 0;
    this.note('SC out (no pit lane: ahead of the leader)');
    this.car = c; this.makeDriver();
  }
  /** off the circuit: back in its bay at the pit exit (or, with no pit lane, gone) */
  removeCar() {
    if (!this.car) return;
    const c = this.car; this.car = null; this.driver = null;
    this.d.simCars = null; this.d.world.cars = this.d.cars;
    if (c === this.body) this.parkBody(); else c.removed = true;
  }
  /**
   * Down the pit lane (the SC's AIDriver.pitDrive): out of its bay, across into the lane and away to the exit line on
   * the limiter - waiting for a car coming down the lane right behind it - or, coming in, down the lane and into its
   * bay. False when it is not in the lane business (the planner drives).
   */
  laneDrive(dt, world) {
    const c = this.car, d = this.d, P = d.pit, drv = this.driver; if (!c || !P || !drv) return false;
    if (!this.laneMode && c.pitRequested) { const to = drv.planner.ds(c.s, P.entryS); if (to < 2 && to > -(P.divergeU + 30)) { this.laneMode = 'in'; this.note('SC into the pit lane'); } }
    if (!this.laneMode) { drv.inPitMode = false; return false; }
    const q = P.nearest(c.x, c.z, this._lq || (this._lq = {})), u = Math.max(0, q.u), v = c.speed, K = this.parkSpot(), ps = P.samples, T = AI_TUNE;
    if (this.laneMode === 'out' && !c.pitLane && u > P.mergeU - 2) { this.laneMode = null; drv.inPitMode = false; drv.planT = 0; c.pitLaneState = null; return false; }   // (on the circuit: the planner drives)
    drv.inPitMode = true;
    const sm = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
    const out = this.laneMode === 'out';
    const latAt = (uu) => out ? (uu <= K.u ? K.lat : K.lat * (1 - sm((uu - K.u) / 32))) : (uu >= K.u - 4 ? K.lat : K.lat * sm((uu - (K.u - 38)) / 32));
    const look = Math.max(6, Math.min(22, 0.35 * v + 5)), uA = Math.min(ps.length - 1, u + look), j = Math.min(ps.n - 1, Math.round(uA / ps.ds)), latT = latAt(uA);
    const tx = ps.px[j] + ps.nx[j] * latT, tz = ps.pz[j] + ps.nz[j] * latT;
    const dx = tx - c.x, dz = tz - c.z, cth = Math.cos(c.th), sth = Math.sin(c.th);
    const fwd = dx * cth + dz * sth, lft = dx * sth - dz * cth, Ld = Math.hypot(dx, dz) || 1;
    const dMax = Math.max(0.055, 0.38 * (1 - v / 118));
    let steer = Math.atan(2 * 3.6 * Math.sin(Math.atan2(lft, fwd)) / Ld) / dMax;
    steer += Math.atan2(c.vLat - c.r * CAR.lr, Math.max(3, Math.abs(c.vLong))) * T.csGain * 0.8;
    c.steer += (Math.max(-1, Math.min(1, steer)) - c.steer) * Math.min(1, dt * T.steerRate);
    const iu = Math.max(0, Math.min(ps.n - 1, Math.round(u / ps.ds))), S = laneSpeeds(P);
    let vT = u < P.limitFrom ? S.vIn[iu] : u <= P.limitTo ? P.limiter : S.vOut[iu];
    if (out && u < K.u + 25) {
      vT = Math.min(vT, 8 + Math.max(0, u - K.u) * 0.8);   // (out of the bay gently, then up to the limiter)
      // (a car coming down the lane right behind it: let it by first)
      if (v < 4 && u < K.u + 6) for (const o of world.cars) {
        if (o === c || !o.pitLane || o.held || o.speed < 4) continue;
        const qo = P.nearest(o.x, o.z, this._lo || (this._lo = {})); if (qo.u < u && qo.u > u - 45) { vT = 0; break; }
      }
    }
    if (!out) {
      vT = Math.min(vT, Math.sqrt(Math.max(0, 2 * 3 * (K.u - u - 0.3))));
      if ((K.u - u < 1 && v < 0.8) || u > K.u + 4) { this.removeCar(); this.note('SC parked at the pit exit'); c.throttle = 0; c.brake = 1; return true; }
    }
    // a car ahead in the lane: follow it
    for (const o of world.cars) {
      if (o === c || o.cleared || !(o.pitLane || o.ai?.inPitMode)) continue;
      const qo = P.nearest(o.x, o.z, this._lo || (this._lo = {})), gap = qo.u - u;
      if (gap <= 0 || gap > 150 || ((o.held || gap < 30) && Math.abs(qo.lat - latAt(qo.u)) > 2.6)) continue;
      vT = Math.min(vT, Math.sqrt(Math.max(0, o.speed * o.speed + 2 * 8 * (gap - 9))));
    }
    const err = vT - v;
    if (err > 0.3) { c.throttle = Math.min(1, 0.2 + err / 4); c.brake = 0; }
    else if (err < -0.3) { c.throttle = 0; c.brake = Math.min(1, -err / 4 + 0.15); }
    else { c.throttle = v > 1 ? 0.25 : 0; c.brake = vT < 0.3 ? 1 : 0; }
    c.ers = 0;
    return true;
  }
  startRestart() {
    const d = this.d; if (!d.pit) this.removeCar();   // (with a pit lane it carries on down it to its bay)
    this.phase = 'restart'; this.t = 0;
    this._greenSaid = false;
    this.goDist = 120 + Math.random() * 380;   // where the leader goes: somewhere in the last few hundred metres
    for (const c of d.cars) { c._scGreen = false; c._waved = false; c._lappedRun = false; c._unlap = false; }
    this.note('SC in: restart');
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
    // (the safety car: steady before the pickup - the cars it waves by pass it, the leader catches it - then the queue's pace)
    if (c.isSC) { const P = !this.picked && this.phase === 'sc' ? (this.behindX < 300 ? HOLD : WAIT) : SC_PACE; return { scale: P.scale, vCap: P.vCap, brake: P.brake, noPass: true, gap: 0, sc: true }; }   // (it never overtakes anyone)
    if (c._unlap) return { scale: WAVED.scale, vCap: WAVED.vCap, brake: 0.9, noPass: false, gap: 0 };   // (lapped cars may overtake)
    switch (ph) {
      case 'red': return { scale: RED.scale, vCap: RED.vCap, brake: 0.6, noPass: true, gap: 14 };
      case 'yellow': return this.inYellowZone(c) ? { scale: 0.85, vCap: null, noPass: true, gap: 0 } : null;
      // (a queue brakes early and gently - planned at 60 % of the brakes, the rest kept in hand for the car in front:
      //  a line of twenty cars that each brake late concertinas into the slow corners)
      // The delta comes in over RAMP seconds after the call (the whole field standing on the brakes at once is a
      // pile-up, not a neutralisation).
      case 'vsc': case 'vscEnd': { const k = this.ramp(); return { scale: 1 - (1 - VSC.scale) * k, vCap: 96 - (96 - VSC.vCap) * k, brake: 1 - 0.4 * k, noPass: true, gap: 14 * k }; }
      case 'sc': case 'scIn': {
        // the delta - or, far off the back of the queue, the catch-up pace; waved by (or a lapped car let go): at speed to
        // the back of the queue. Only the leader queues behind the safety car: anyone else is waved by it
        // (a car in trouble just ahead - damaged, a puncture, off the road - may be passed: a line stuck behind a car
        //  limping round at half the pace is no queue)
        const k = this.ramp(), R = c._waved ? WAVED : this.gapAhead(c) > CATCH_GAP ? CATCHUP : DELTA, queueSC = c === this.leader();
        const a = this.nextAhead(c), noPass = !(a && a.x < 120 && this.trouble(a.o));
        return { scale: 1 - (1 - R.scale) * k, vCap: 96 - (96 - R.vCap) * k, brake: 1 - 0.4 * k, noPass, gap: (15 + (ph === 'scIn' ? 4 : 0)) * k, queueSC };
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
  /** a car in trouble (it may be passed under the safety car): damaged, a puncture, off the road, spinning, stopped */
  trouble(o) {
    const m = o.dmg, slow = 0.09 * ((m.fwL || 0) + (m.fwR || 0)) + 0.3 * (m.rw || 0) + 0.15 * (m.susp || 0);
    return slow > 0.1 || o.punct != null || o.offTrack || o.spinning || o.engineDead || !!o.ai?.rj || o.speed < 3;
  }
  /** distance (m) to the next running car ahead on the road (or the safety car) */
  gapAhead(c) {
    const d = this.d; let best = Infinity;
    for (const o of d.simCars || d.cars) { if (o === c || o.retired || o.pitLane || o.inPit || o.cleared || o.speed < 5) continue; const x = d.planDs(c.s, o.s); if (x > 0 && x < best) best = x; }
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
    if (passer._waved || this.trouble(passed)) return false;   // (waved by, going round to the queue; a car in trouble)
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
    if (!p || p.retired || p.finished || p.pitLane || p.inPit || p._unlap || p._waved) return;   // (lapped cars let go, cars waved by: on at speed to the back of the queue)
    const ph = this.phase, vsc = ph === 'vsc' || ph === 'vscEnd', sc = ph === 'sc' || ph === 'scIn';
    if (ph === 'red') return;   // (a red flag: just bring it round slowly)
    if (!vsc && !sc) return;
    // in the queue (within 120 m of the car ahead on the road, or of the safety car): the queue sets the pace
    if (sc) {
      let near = this.car && d.planDs(p.s, this.car.s) > 0 && d.planDs(p.s, this.car.s) < 120;
      if (!near) for (const o of d.cars) { if (o === p || o.retired || o.pitLane) continue; const x = d.planDs(p.s, o.s); if (x > 0 && x < 120) { near = true; break; } }
      if (near) { this.playerDelta = Math.min(1, this.playerDelta + dt * 0.5); this.deltaShown = true; return; }
    }
    const R = vsc ? VSC : this.gapAhead(p) > CATCH_GAP ? CATCHUP : DELTA;   // (far off the back of the queue: the catch-up pace)
    const k = this.ramp(), vRef = Math.max(15, Math.min(96 - (96 - R.vCap) * k, d.profile[p.trackIdx] * (1 - (1 - R.scale) * k)));
    // delta (s): + is slower than the reference (fine), - faster
    this.playerDelta += dt * (1 - p.speed / vRef);
    this.playerDelta = Math.min(1.5, this.playerDelta); this.deltaShown = true;
    if (this.playerDelta < -0.6 && !this.deltaWarned) { this.deltaWarned = true; d.hud?.msg(`${vsc ? 'VSC' : 'SC'} DELTA · SLOW DOWN`, 'bad', 2); d.engineer?.say('Watch the delta, you are under it. Slow down.', 3); }
    if (this.playerDelta < -2.2) { d.stewards.award(p, 5, `not respecting the ${vsc ? 'VSC' : 'safety car'} delta`); this.playerDelta = 0.5; this.deltaWarned = false; }
  }
}
