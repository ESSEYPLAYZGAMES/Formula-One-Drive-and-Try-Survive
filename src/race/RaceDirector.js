// Race director: grid/lights/start protocol, fixed-step world simulation, car-car
// collisions, slipstream, pit lane autopilot + stops, laps/penalties/classification.
import { AIDriver } from '../ai/AIDriver.js';
import { gridLayout } from '../track/TrackBuilder.js';
import { CAR, PULSE, SPLIT_G } from '../vehicle/Car.js';
import { Telemetry } from './Telemetry.js';
import { Stewards } from './Stewards.js';
import { SafetyCar } from './SafetyCar.js';
import { RaceRadio } from './Radio.js';
import { DRS } from './DRS.js';
import { Failures } from './Failures.js';
import { Flashback } from './Flashback.js';
import { ReplayBuffer } from './Replay.js';
import { Sectors, Passes } from './Sectors.js';
import { neutralForm } from '../career/Morale.js';
import { setTyreLap, lapLoss, outLapLoss, cliffLaps, RATE_NOM } from '../vehicle/Tyres.js';

const SUB = 1 / 120;
/** a driver's form when the car carries none (career/Morale.js FORM: every multiplier 1, every addition 0) */
const NF = Object.freeze(neutralForm());
/** timed laps each car gets in qualifying (the best counts) */
const Q_LAPS = 2;
/** closing speed (m/s, ~72 km/h) above which a car running into the back of another may climb its rear wheel and take off */
const LAUNCH_CAR = 26;
// ---- car-to-car contact ------------------------------------------------------------------------------------------
const HLF = 3.0, HLR = 2.3, HW = 0.95;   // the car's outline about its centre of mass: to the nose, to the rear wing, half its width (m) - the 2026 car model's
/** how high above the road each zone of a car is touched (m): where its dent goes (Car.crushFlat) */
const ZONE_H = { wing: 0.15, nose: 0.3, side: 0.42, rear: 0.5 };
/** points of a car's outline that can touch another car, body frame [forward, left] (from the centre of mass) */
const PROBES = [
  [1.85, 0.95], [1.85, -0.95], [-1.55, 0.94], [-1.55, -0.94],        // the four wheels (outer tyre walls)
  [3.05, 0], [2.95, 0.88], [2.95, -0.88],                             // nose, front wing corners (endplates)
  [-2.3, 0], [-2.25, 0.55], [-2.25, -0.55],                           // gearbox / rear crash structure, rear wing corners
  [0.5, 0.72], [0.5, -0.72], [-0.6, 0.68], [-0.6, -0.68],             // sidepods
];
/** what part of a car is at body point (x forward, y left) */
function zoneAt(x, y) {
  if (((x > 1.45 && x < 2.25) || (x > -1.95 && x < -1.15)) && Math.abs(y) > 0.66) return 'wheel';
  if (x >= 2.25) return Math.abs(y) > 0.5 ? 'wing' : 'nose';
  if (x <= -1.95) return 'rear';
  return 'side';
}
/**
 * The deepest of car q's probe points inside car p's outline -> best { pen, nx, nz (unit, from the first car of the
 * pair toward the second), px, pz (the contact point) }. sg = 1: p is the pair's first car, -1: its second.
 */
function contact(p, cp, sp, q, cq, sq, best, sg) {
  best = best || { pen: 0 };
  for (const [bx, by] of PROBES) {
    const wx = q.x + bx * cq + by * sq, wz = q.z + bx * sq - by * cq;
    const dx = wx - p.x, dz = wz - p.z, lx = dx * cp + dz * sp, ly = dx * sp - dz * cp;
    if (lx >= HLF || lx <= -HLR || Math.abs(ly) >= HW) continue;
    const penX = lx > 0 ? HLF - lx : HLR + lx, penY = HW - Math.abs(ly);
    let fx, fy, pen;
    if (penY < penX) { fx = 0; fy = Math.sign(ly) || 1; pen = penY; } else { fx = Math.sign(lx) || 1; fy = 0; pen = penX; }
    if (pen <= best.pen) continue;
    // the face's outward normal in the world (from p toward q), flipped to point from the pair's first car to its second
    const nx = (fx * cp + fy * sp) * sg, nz = (fx * sp - fy * cp) * sg;
    best.pen = pen; best.nx = nx; best.nz = nz; best.px = wx; best.pz = wz;
  }
  return best;
}
/**
 * What a touch does, by what touched what. Wheels are the dangerous part: two tyres rubbing interlock and kick each
 * other off the road, a front wing clipping a rear wheel loses its endplate and bounces the wheel; a nose into a
 * sidepod at an angle (a T-bone) is a proper hit for both; sidepod against sidepod is a rub, a nudge and a bit of
 * paint. K < 1: the impulse turns the car more (a point hit), K > 1 less (spread over the bodywork).
 */
function touch(zA, zB, into, slide, angled) {
  const is = (p, q) => (zA === p && zB === q) || (zA === q && zB === p);
  const front = (z) => z === 'nose' || z === 'wing';
  const r = { kind: 'body', K: 1.4, e: 0.25, mu: 0.3, dmgA: 0.5, dmgB: 0.5, liftA: 0, liftB: 0 };
  // how hard a wheel is kicked off the road: a brush (under ~4 km/h of closing) does nothing, ~20 km/h is most of it
  const L = Math.min(0.85, Math.max(0, (into + 0.15 * slide - 1.0) / 4.5));
  if (zA === 'wheel' && zB === 'wheel') Object.assign(r, { kind: 'wheels', K: 1.0, e: 0.45, mu: 0.7, dmgA: 0.45, dmgB: 0.45, liftA: L, liftB: L });
  else if (is('wheel', 'side')) Object.assign(r, { kind: 'wheel-side', K: 1.15, e: 0.3, mu: 0.35, dmgA: 0.35, dmgB: 0.35, liftA: zA === 'wheel' ? 0.6 * L : 0, liftB: zB === 'wheel' ? 0.6 * L : 0 });
  else if ((front(zA) && zB === 'wheel') || (front(zB) && zA === 'wheel')) Object.assign(r, { kind: 'clip', K: 1.1, e: 0.3, mu: 0.45, dmgA: zA === 'wheel' ? 0.3 : 0.9, dmgB: zB === 'wheel' ? 0.3 : 0.9, liftA: zA === 'wheel' ? 0.55 * L : 0, liftB: zB === 'wheel' ? 0.55 * L : 0 });
  else if (angled && ((front(zA) && zB === 'side') || (front(zB) && zA === 'side'))) Object.assign(r, { kind: 'tbone', K: 1.15, e: 0.2, mu: 0.4, dmgA: 1.0, dmgB: 1.0 });
  else if (zA === 'side' && zB === 'side') Object.assign(r, { kind: 'rub', K: 2.6, e: 0.1, mu: 0.12, dmgA: 0.22, dmgB: 0.22 });
  else if ((front(zA) && zB === 'rear') || (front(zB) && zA === 'rear')) Object.assign(r, { kind: 'rear', dmgA: 0.6, dmgB: 0.6 });
  return r;
}

export class RaceDirector {
  /**
   * @param o { track, line, profile, pit, cars, player, hud, audio, settings:{mode:'race'|'quali'|'tt', lapsTotal, aggression, wetness, gridOrder}, onFinish, onPitDone }
   */
  constructor(o) {
    Object.assign(this, o);
    const s = this.settings;
    this.mode = s.mode; this.lapsTotal = s.lapsTotal; this.practice = !!s.practice;   // (practice: a qualifying session with no lap limit, ended when you like)
    this.time = 0; this.stateT = 0; this.acc = 0; this.subCount = 0;
    this.state = this.mode === 'race' ? 'grid' : 'racing';
    this.qualiStarted = false; this.qualiDone = false;
    this.positions = [...this.cars];
    // (the lap the tyres' seconds of wear are measured on - vehicle/Tyres.js: the speed profile's lap, a touch slower as
    //  the AI drives it)
    this.lapT = null;
    if (this.profile && this.track) { let t = 0; const n = this.track.n, ds = this.track.ds; for (let i = 0; i < n; i++) t += ds / Math.max(5, this.profile[i] || 5); this.lapT = t * 1.03; setTyreLap(this.lapT); }
    this.sectors = new Sectors(this);   // (live sector times: purple / green / yellow)
    this.passes = new Passes(this);     // (on-track overtakes: c.overtakes)
    this.finishOrder = []; this.leaderFinished = false; this.leaderFinishTime = 0; this.endTimer = -1; this.done = false;
    this.pitStates = new Map();
    this.engineer = o.engineer || null; this.reportedIdx = null; this.pendingIdx = null; this.pendingT = 0; this.retiredSeen = new Set(); this.boxWarned = false;
    if (this.pit) for (const c of this.cars) { c.pit = this.pit; c.manualPit = true; }   // every car drives the pit lane for real
    this.lightsOn = 0; this.holdTime = 0; this.lightsOutAt = Infinity; this.lightsHideT = -1;
    for (const c of this.cars) { c.wetness = s.wetness; c.lapStart = 0; c.lap = 0; c.lapTimes = []; c.bestLap = Infinity; }
    this.world = {
      cars: this.cars, time: 0, racing: this.mode !== 'race', lapsTotal: this.lapsTotal, wetness: s.wetness,
      onLine: (c, full) => this.onLine(c, full), onImpact: (c, sev, type) => this.onImpact(c, sev, type),
      onAIError: (c, type, zone) => this.onAIError(c, type, zone),
      pit: this.pit || null,   // (the AI brakes for the pit lane's speed limit line before it gets there)
      // (what a stop costs here - the lane at the limiter against the same stretch at racing speed, the stop and the
      //  slowing and the getting going - and the reference lap: the AI's undercut sums, AIDriver)
      lapT: this.lapT, pitLoss: this.pit && this.lapT ? Math.max(12, this.pit.samples.length / this.pit.limiter - this.pit.samples.length / (this.track.length / this.lapT) + 2.4 + 2.2) : 22,
      obstacles: o.obstacles || null,   // buildings and grandstands the cars can hit (world/Obstacles.js)
    };
    this.ai = this.cars.filter((c) => !c.isPlayer).map((c) => new AIDriver(c, this.line, this.profile, this.track, { aggression: s.aggression * (c.aggrMul || 1), skill: s.skill ?? 1 }));
    // pit lane: distance at which the pit lane passes the start/finish line
    if (this.pit) {
      let bi = 0, bd = Infinity; const ps = this.pit.samples;
      for (let i = 0; i < ps.n; i++) { const d = (ps.px[i] - this.track.px[0]) ** 2 + (ps.pz[i] - this.track.pz[0]) ** 2; if (d < bd) { bd = d; bi = i; } }
      this.pit.sfU = ps.s[bi];
    }
    this.setup();
    // penalties (races only): strictness from the menu, 0 = none
    this.stewards = new Stewards(this, this.mode === 'race' ? (s.stewards ?? 50) : 0);
    // race control: yellow flags, VSC, the safety car (races only, unless switched off in the menu)
    // (qualifying: no neutralisations - a red flag would line everyone up on the grid)
    this.sc = new SafetyCar(this, s.safetyCar !== false && this.mode === 'race'); this.world.sc = this.sc; this.simCars = null;
    // timing loops (real time gaps) and the engineer's briefings, five a lap
    this.radio = new RaceRadio(this); this.world.gap = (a, b) => this.radio.gap(a, b);
    this.drs = new DRS(this);
    this.failures = new Failures(this, s.failures !== false);   // breakdowns and punctures
    // flashbacks: the last 15 s, rewindable (menu: off / unlimited - unlimited in every race unless switched off)
    this.flashback = new Flashback(this, s.flashbacks === 'off' ? 0 : Infinity);   // (races only: in qualifying and time trial there is nobody to be within a second of)
    // the last 12 s of every car's pose: a hurt driver's accident is cut from it for the news after the race
    this.replay = this.mode === 'race' ? new ReplayBuffer(this.cars) : null;
    // every AI car's race plan (standard / early / long / gamble), and the starting tyres that go with it
    if (this.mode === 'race') for (const a of this.ai) if (a.planRace(this.world, a.car.gridPos || 1, this.cars.length)) this.onPitDone?.(a.car);
    // lap telemetry: the player at 30 Hz, every AI car at 10 Hz (reference laps)
    this.telemetry = new Telemetry({ track: this.track, line: this.line, profile: this.profile, cars: this.cars, player: this.player, mode: this.mode,
      settings: { mode: s.mode, laps: s.lapsTotal, wetness: s.wetness, skill: s.skill, aggression: s.aggression } });
  }

  setup() {
    const tr = this.track;
    if (this.mode === 'race') {
      const zone = tr.cornerZones.find((z) => z.sA > 30 && z.sA < 600) || tr.cornerZones[0];
      this.poleSide = zone ? zone.dir || 1 : 1;
      const order = this.settings.gridOrder || this.cars;
      this.slots = gridLayout(tr, order.length, this.poleSide);
      order.forEach((c, i) => { c.placeOnTrack(this.slots[i].s, this.slots[i].d, 0); c.held = true; c.gridSlot = this.slots[i]; c.gridPos = i + 1; c.lapDist = -(14 + 8 * i); c.tyres.temp = c.tyres.spec.start ?? 0.7; c.tyres.work = 0.45; });   // (the tyres as the formation lap left them: a soft near its window, a hard well short of it)
      for (const a of this.ai) a.reaction = Infinity;
      this.hud?.msg('FORMATION COMPLETE', '', 3);
    } else {
      // a flying start on a straight (never thrown into a corner), at the speed the straight carries
      const s0 = this.flyingStart(), v0 = this.profileAt(s0) * 0.9, L = tr.length;
      const place = (c, s, v) => { s = tr.wrapS(s); c.placeOnTrack(s, this.line.offsetAt(s), v); c.held = false; c.lapStart = -1; let ld = s - L; if (ld < -L + 1) ld += L; c.lapDist = ld; c.qLaps = 0; c.tyres.temp = 0.85; c.tyres.lifeMeters = Math.max(c.tyres.lifeMeters, 7 * L * c.tyres.spec.life); };   // (tyres warm from the out-lap; a qualifying set lasts its laps, whatever the race distance)
      const p = this.player || this.cars[0]; place(p, s0, v0);
      // qualifying: every car out on its own flying laps at once, spread round the lap behind you (a few seconds apart)
      const others = this.cars.filter((c) => c !== p).sort(() => Math.random() - 0.5);
      let back = 0;
      for (const c of others) { back += 150 + Math.random() * 70; const s = s0 - back; place(c, s, this.profileAt(s) * 0.92); }
      this.qualiSpread = back;
      if (this.mode === 'quali') {
        const lap = this.estimateLap();
        this.qualiLimit = this.practice ? 1500 : ((back + (Q_LAPS + 0.3) * L) / (L / lap)) * 1.3 + 25;   // (the session's clock: the last car's out-lap and its timed laps, with room; practice: 25 minutes)
        this.hud?.msg(this.practice ? 'FREE PRACTICE · as many laps as you like · Esc → END SESSION when you are done' : `QUALIFYING · ${Q_LAPS} flying laps · cross the line to start`, '', 5);
      }
    }
  }
  /**
   * A new qualifying run after a flying lap: the car as it would come out of the garage between runs - repaired, on a
   * new set of the same tyres (warm, a qualifying set's life), the battery charged. Nothing of the last lap carries over.
   */
  freshRun(c) {
    const comp = c.tyres.compound, L = this.track.length;
    c.repair('full'); c.dmg.eng = 0; c.fitTyres(comp); c.tyres.temp = 0.85; c.tyres.lifeMeters = Math.max(c.tyres.lifeMeters, 7 * L * c.tyres.spec.life);
    c.ersEnergy = 1; c.brakeFail = false; c.puLoss = false; c.pitRequested = false; if (c.ai) c.ai.pitPlan = null; this.onPitDone?.(c);
  }
  /**
   * A life lost: the race is cancelled - the red flag, and no restart. Every car is brought slowly into the pit lane
   * and left at its garage (the player drives theirs back).
   */
  cancelRace() {
    if (this.cancelled || this.done) return; this.cancelled = true;
    this._order = this.positions.slice();   // (the order stands as it was at the red flag: nobody gains a place on the drive in)
    this.sc.cancel?.();
    for (const c of this.cars) if (!c.isPlayer && !c.retired && !c.finished) { c.pitRequested = true; if (c.ai) c.ai.pitPlan = { compound: c.tyres.compound, repair: 'none' }; }
  }
  /** the speed profile's speed at s */
  profileAt(s) { const tr = this.track; return this.profile[Math.round(tr.wrapS(s) / tr.ds) % tr.n]; }
  /**
   * Where a flying lap starts: the nearest point before the line with a clear straight ahead of it (no corner and no
   * braking for one within ~350 m), so a car is never dropped into or just before a corner
   */
  flyingStart() {
    const tr = this.track, n = tr.n, ds = tr.ds, clear = Math.round(350 / ds);
    const ok = (i) => { for (let k = -Math.round(40 / ds); k <= clear; k++) if (tr.inCornerZone(((i + k) % n + n) % n)) return false; return true; };
    for (let back = 250; back < tr.length * 0.6; back += 10) { const i = ((Math.round(-back / ds)) % n + n) % n; if (ok(i)) return tr.wrapS(-back); }
    return tr.wrapS(-320);
  }
  /**
   * Your run is over (qualifying laps done, the chequered flag, retired): the car is driven home by the AI and the
   * session carries on round you - watch it, or simulate the rest (main.js)
   */
  handOver() {
    const p = this.player; if (!p || p.autopilot) return;
    p.autopilot = true; p.steer = 0; p.handbrake = 0; p.ers = 0;
    if (!p.retired) this.ai.push(new AIDriver(p, this.line, this.profile, this.track, { aggression: this.settings.aggression * 0.7, skill: 0.97 }));
    this.onPlayerDone?.(p);
  }

  // --------------------------------------------------------------------------
  update(dt, input) {
    if (this.done) return;
    this.time += dt; this.stateT += dt; this.world.time = this.time;
    this.stateMachine(dt);
    // player controls (already smoothed per frame)
    const p = this.player;
    if (p && !p.inPit && !p.retired && !p.autopilot && !p.pitAuto) {
      p.steer = input.steer; p.handbrake = input.handbrake; p.ers = input.ers;
      if (input.drsTap && this.mode === 'race') this.drs.press(p);
      if (p.gear === 0) {
        // reverse: S drives backwards, W brakes; W at a standstill re-engages first gear
        p.throttle = input.brake; p.brake = input.throttle;
        if (p.speed < 0.6 && input.throttle > 0.3 && input.brake < 0.1) { p.gear = 1; p.throttle = input.throttle; p.brake = 0; }
      } else {
        p.throttle = input.throttle; p.brake = input.brake;
        // hold the brake for half a second at a standstill to select reverse
        if (p.speed < 0.6 && input.brake > 0.5 && input.throttle < 0.1 && !p.held && this.world.racing) { p.revHold = (p.revHold || 0) + dt; if (p.revHold > 0.5) { p.gear = 0; p.revHold = 0; } }
        else p.revHold = 0;
      }
      if (p.held) { p.brake = 1; }
    }
    // fixed-step simulation
    this.acc = Math.min(this.acc + dt, 0.12);
    while (this.acc >= SUB) {
      this.acc -= SUB; this.subCount++; this.simNow = this.time - this.acc;   // (the moment of this substep: lap times to the substep, not the frame)
      if (this.subCount % 4 === 0) this.slipstream();
      if (this.subCount % 2 === 0) { for (const a of this.ai) a.update(1 / 60, this.world); this.sc.driver?.update(1 / 60, this.world); p?.pitAuto?.update(1 / 60, this.world); }
      for (const c of this.cars) {
        if (c.parkMove || c.parked) continue;   // (a recovered wreck: on the crane or set down, no longer simulated)
        if (c.inPit) this.pitStep(c, SUB);
        else {
          c.step(SUB, this.world);
          if (c.pitRequested && !c.retired && !c.manualPit) this.checkPitEntry(c);
        }
      }
      if (this.sc.car) this.sc.car.step(SUB, this.world);   // (the safety car: not one of the race's cars, on the same road)
      this.collisions();
      if (this.state === 'lights') this.jumpStarts();
    }
    this.replay?.record(dt, this.time);
    if (this.replay) for (const c of this.cars) if (c._clipAt != null && this.time >= c._clipAt) { c._clipAt = null; c.injuryClip = this.replay.clip(c); }
    // (the run to Turn 1 from a standing start: over once a car is past the first corner's apex, or after 25 s)
    if (this.world.racing) { const t1 = this._t1 ?? (this._t1 = (this.track.def.corners || []).find((k) => k.s != null)?.s ?? 300); for (const c of this.cars) if (c.startRun && (c.lapDist > t1 || this.time - this.world.raceStart > 25)) c.startRun = false; }
    this.rank();
    this.sectors.update(); this.passes.update(); this.blueFlags(dt);
    this.speedBands(dt);
    this.failures.update(dt);
    this.injuries();
    this.stewards.update(dt);
    this.sc.update(dt);
    this.radio.update();
    if (this.mode === 'race') this.drs.update();
    this.telemetry.update(this.time);
    this.marshals(dt);
    if (this.pit) for (const c of this.cars) if (c.manualPit) this.pitUpdate(c, dt);
    this.events(dt);
    this.engineer?.update(dt, this.time, this.player ? this.player.lap : 0);
    // reset prompt / retirement / end conditions
    if (p) {
      // no resets: a car beached off the road (stopped 12 s+, trying) can be retired - hold R
      const beached = p.stoppedTime >= 12 && !p.inPit && !p.pitLane && !p.finished && !p.retired && Math.abs(p.d) > this.track.edgeAt(p.trackIdx, Math.sign(p.d) || 1) + 1;   // (past the edge on its own side)
      this.hud?.showReset(beached);
      if (beached && !p.autopilot && input.retireHold > 1.2) { p.retired = true; p.retireReason = 'Beached'; }
      if (p.retired && this.endTimer < 0 && !p.autopilot && this.mode !== 'tt') { this.endTimer = p.air || p.wreck ? 7 : 4; this.hud?.msg(`RETIRED · ${p.retireReason}`, 'bad', 4); }
    }
    // (your run over: after a moment the car is handed over and the session goes on - it ends when every car is done)
    if (this.endTimer > 0) { this.endTimer -= dt; if (this.endTimer <= 0) { this.endTimer = -1; if (p && !p.autopilot) this.handOver(); else this.finish(); } }
    if (this.flashback.uses > 0 && !this.done && !this.cancelled) this.flashback.record(dt);   // (cancelled: the moments before the accident stay rewindable - main.js uncancel)
    if (this.mode === 'race' && !this.cancelled && this.leaderFinished && this.endTimer < 0 && (this.cars.every((c) => c.finished || c.retired) || this.time - this.leaderFinishTime > 150)) this.finish();
    if (this.mode === 'quali' && this.endTimer < 0 && (this.cars.every((c) => c.qualiDone || c.retired) || this.time > this.qualiLimit)) this.finish();
  }

  stateMachine(dt) {
    switch (this.state) {
      case 'grid':
        if (this.stateT > 3.5) { this.state = 'lights'; this.stateT = 0; this.hud?.showLights(true); this.hud?.setLights(0); for (const c of this.cars) c.held = false; }
        break;
      case 'lights': {
        const n = Math.min(5, Math.floor(this.stateT));
        if (n !== this.lightsOn) { this.lightsOn = n; this.hud?.setLights(n); this.audio?.beep(660, 0.1, 0.2); }
        if (n === 5 && this.holdTime === 0) {
          this.holdTime = 0.8 + Math.random() * 1.7; this.lightsOutAt = 5 + this.holdTime;
          // occasional AI jump start (launches during the hold; nerves make it likelier: FORM.jump, composure)
          for (const a of this.ai) if (Math.random() < 0.012 * this.settings.aggression * (a.car.form || NF).jump) { a.reaction = this.holdTime - Math.random() * 0.4; a.jumped = true; }
        }
        if (this.stateT >= this.lightsOutAt) {
          this.state = 'racing'; this.stateT = 0; this.world.racing = true; this.world.raceStart = this.time; this.hud?.setLights(0); this.lightsHideT = 1.2;
          this.hud?.msg('LIGHTS OUT!', 'good', 1.6); this.audio?.beep(1200, 0.25, 0.3);
          this.engineer?.say('Lights out. Clean first lap, look after the tyres, they are cold.', 2);
          for (const c of this.cars) { c.lapStart = this.time; c.startRun = true; }   // (to Turn 1 on even terms: Car.step, speedBands)
          // every driver launches with a human reaction time (~0.15-0.3 s); tier/rating does not slow the getaway, focus
          // moves it by a few hundredths either way (FORM.react)
          for (const a of this.ai) if (!a.jumped) a.reaction = Math.max(0.1, 0.14 + Math.random() * 0.12 + (1 - a.car.rating) * 0.04 + (a.car.form || NF).react);
        }
        break;
      }
      case 'racing':
        if (this.lightsHideT > 0) { this.lightsHideT -= dt; if (this.lightsHideT <= 0) this.hud?.showLights(false); }
        break;
    }
  }

  jumpStarts() {
    for (const c of this.cars) {
      if (c.jumpStart || !c.gridSlot) continue;
      let ds = c.s - c.gridSlot.s; const L = this.track.length; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
      if (ds > 1.5 && c.throttle > 0.05) { c.jumpStart = true; this.stewards.jumpStart(c); }
    }
  }

  // --------------------------------------------------------------------------
  slipstream() {
    const L = this.track.length;
    for (const c of this.cars) {
      let best = 0;
      for (const o of this.cars) {
        if (o === c || o.inPit || o.retired) continue;
        let ds = o.s - c.s; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
        if (ds <= 3 || ds > 50) continue;
        const dd = Math.abs(o.d - c.d); if (dd > 3.5) continue;
        const f = (1 - ds / 50) * (1 - dd / 3.5); if (f > best) best = f;
      }
      c.slipstream = best; c.dirtyAir = best;
    }
  }

  collisions() {
    const cars = this.simCars || this.cars, n = cars.length, va = this._va || (this._va = [0, 0]), vb = this._vb || (this._vb = [0, 0]);
    // (a car that has stopped for good is still solid until the marshals have moved it: no ghosts on the racing line)
    const skip = (c) => c.inPit || c.ghost > 0 || c.air || c.wreck || c.hiddenAway || (c.retired && (c.cleared || c.parked || c.parkMove));
    for (let i = 0; i < n; i++) {
      const a = cars[i]; if (skip(a)) continue;
      for (let j = i + 1; j < n; j++) {
        const b = cars[j]; if (skip(b)) continue;
        const dx = b.x - a.x, dz = b.z - a.z; if (Math.abs(dx) > 7 || Math.abs(dz) > 7) continue;
        // the car's outline (a 5.66 x 2.0 m box) against the other car's probe points (wheels, wing corners, nose,
        // sidepods, rear): the deepest one decides where the two touch and what of each car touched
        const ca = Math.cos(a.th), sa = Math.sin(a.th), cb = Math.cos(b.th), sb = Math.sin(b.th);
        const best = contact(a, ca, sa, b, cb, sb, null, 1); contact(b, cb, sb, a, ca, sa, best, -1);
        if (!best.pen) continue;
        const { pen, nx, nz } = best;
        a.x -= nx * pen / 2; a.z -= nz * pen / 2; b.x += nx * pen / 2; b.z += nz * pen / 2;
        const cpx = best.px, cpz = best.pz;
        a.velAt(cpx, cpz, va); b.velAt(cpx, cpz, vb);
        const rvn = (vb[0] - va[0]) * nx + (vb[1] - va[1]) * nz;    // relative normal velocity (b wrt a), < 0: closing
        if (rvn >= 0) continue;
        const tx = -nz, tz = nx, rvt = (vb[0] - va[0]) * tx + (vb[1] - va[1]) * tz;
        // contact point in each body frame, and what of each car it is
        const la = [(cpx - a.x) * ca + (cpz - a.z) * sa, (cpx - a.x) * sa - (cpz - a.z) * ca];
        const lb = [(cpx - b.x) * cb + (cpz - b.z) * sb, (cpx - b.x) * sb - (cpz - b.z) * cb];
        const zA = zoneAt(la[0], la[1]), zB = zoneAt(lb[0], lb[1]);
        const hit = touch(zA, zB, -rvn, Math.abs(rvt), Math.abs(Math.sin(a.th - b.th)) > 0.6);
        a.hardest = Math.max(a.hardest || 0, -rvn); b.hardest = Math.max(b.hardest || 0, -rvn);
        this.stewards.contact(a, b, hit.kind, zA, zB, nx, nz, -rvn);
        const K = hit.K, e = hit.e, jn = -(1 + e) * rvn / (a.invMassAt(cpx, cpz, nx, nz, K) + b.invMassAt(cpx, cpz, nx, nz, K));
        const jt = Math.max(-hit.mu * jn, Math.min(hit.mu * jn, -rvt / (a.invMassAt(cpx, cpz, tx, tz, K) + b.invMassAt(cpx, cpz, tx, tz, K))));
        const jx = jn * nx + jt * tx, jz = jn * nz + jt * tz;
        // a struck wheel bounces and skips: on a car at the limit in a fast corner that is the whole rear axle gone for
        // a moment - Copse 2021 from a front wheel against a rear wheel, no pit manoeuvre needed
        if (hit.liftA > 0) a.bounceWheel(la[0], la[1], hit.liftA);
        if (hit.liftB > 0) b.bounceWheel(lb[0], lb[1], hit.liftB);
        // a struck wheel can puncture (a front wing's endplate, another car's wheel) - 3 % of the touches, more the harder
        // (with the 6 % the 2022-25 car had, an AI field's opening laps on the 2026 car saw two and a half times the
        //  punctures they did on the old one)
        if (-rvn > 3 && this.mode === 'race') for (const [car, z, l] of [[a, zA, la], [b, zB, lb]]) if (z === 'wheel' && Math.random() < Math.min(0.15, 0.03 + (-rvn - 3) * 0.01)) this.failures.puncture(car, (l[0] > 0 ? 0 : 2) + (l[1] > 0 ? 0 : 1), 'contact');
        // wheel over wheel: a car that runs into the back of another at speed climbs its rear tyre and takes off. Judged
        // on the two cars' own speeds (before the contact) along the hitter's heading - a spinning car's corner speed is
        // not a closing speed - and only when both point roughly the same way
        const aHitsB = la[0] > 1.2 && lb[0] < -1.2, bHitsA = lb[0] > 1.2 && la[0] < -1.2;
        let flyer = aHitsB ? a : bHitsA ? b : null, closing = 0;
        if (flyer && Math.cos(a.th - b.th) > 0.8) {
          const other = flyer === a ? b : a, fc = Math.cos(flyer.th), fs = Math.sin(flyer.th);
          const [fvx, fvz] = flyer.worldVel(), [ovx, ovz] = other.worldVel();
          closing = (fvx - ovx) * fc + (fvz - ovz) * fs;
        }
        a.impulseAt(cpx, cpz, -jx, -jz, K); b.impulseAt(cpx, cpz, jx, jz, K);
        const gA = a.pulse(Math.hypot(jn, jt) / CAR.mass, PULSE.car, 'car'), gB = b.pulse(Math.hypot(jn, jt) / CAR.mass, PULSE.car, 'car');
        const sA = a.applyImpact(la[0], la[1], -rvn * hit.dmgA, zA), sB = b.applyImpact(lb[0], lb[1], -rvn * hit.dmgB, zB);
        // (the bodywork that touched is crushed - pushed in along the contact, a against n, b with it; a tyre is not)
        if (zA !== 'wheel' && sA > 0) a.crushFlat(la[0], la[1], ZONE_H[zA] ?? 0.35, -nx, -nz, -rvn * hit.dmgA);
        if (zB !== 'wheel' && sB > 0) b.crushFlat(lb[0], lb[1], ZONE_H[zB] ?? 0.35, nx, nz, -rvn * hit.dmgB);
        if (a.isPlayer || b.isPlayer) this.onContact?.(a, b, -rvn);
        // a T-bone at speed: the nose rides up the other car's sidepod and the hitter takes off
        if (hit.kind === 'tbone' && -rvn > 22 && Math.random() < Math.min(0.5, (-rvn - 22) / 14)) {
          const nose = zA === 'nose' || zA === 'wing' ? a : b, fc = Math.cos(nose.th), fs = Math.sin(nose.th);
          // (a kick of 5-12 m/s at the front wheel: up to ~1.5 m in the air, mostly rotation - real airborne
          //  accidents are a couple of metres high, not ten)
          nose.launch(nose.x + 1.8 * fc, 0.36, nose.z + 1.8 * fs, 0, Math.min(12, 5 + (-rvn - 22) * 0.3 + Math.random() * 3), 0);
          this.onImpact(nose, 1, 'car');
        }
        // a T-bone hard enough (by the g it puts through the struck car) tears it in two
        const struckG = zA === 'side' ? gA : gB;
        if (hit.kind === 'tbone' && struckG > SPLIT_G && Math.random() < Math.min(0.8, 0.15 + (struckG - SPLIT_G) / 40)) {
          const struck = zA === 'side' ? a : b, sg = struck === a ? -1 : 1;
          struck.launch(cpx, 0.4, cpz, sg * nx * -rvn * 0.3, 2 + Math.random() * 3, sg * nz * -rvn * 0.3); struck.splitApart();
          this.onImpact(struck, 1, 'car');
        }
        this._other = `${b.short}:${b.speedKmh | 0}:${b.ghost > 0 ? 'G' : ''}${b.retired ? 'R' : ''}`; if (sA > 0) { this.onImpact(a, sA, 'car'); a.emit('hit', cpx, cpz, sA); }
        this._other = `${a.short}:${a.speedKmh | 0}:${a.ghost > 0 ? 'G' : ''}${a.retired ? 'R' : ''}`; if (sB > 0) { this.onImpact(b, sB, 'car'); b.emit('hit', cpx, cpz, sB); }
        this._other = null;
        if (flyer && closing > LAUNCH_CAR && Math.random() < Math.min(0.8, 0.2 + (closing - LAUNCH_CAR) / 15)) {
          // the flyer's front wheel on the contact side rides up the other car's rear tyre
          const fl = flyer === a ? la : lb, fc = Math.cos(flyer.th), fs = Math.sin(flyer.th), sd = Math.sign(fl[1] || 1);
          const wx = flyer.x + 1.8 * fc + sd * 0.85 * fs, wz = flyer.z + 1.8 * fs - sd * 0.85 * fc;
          flyer.launch(wx, 0.36, wz, 0, Math.min(14, 6 + (closing - LAUNCH_CAR) * 0.4 + Math.random() * 4), 0);   // (up to ~2 m)
          this.onImpact(flyer, 1, 'car');
        }
      }
    }
    this.wreckContacts();
  }

  /**
   * A tumbling or wrecked car keeps its body: it hits other cars (on their wheels or tumbling too) and is hit by
   * them. Each car is two 1.05 m spheres along its body in 3D (a car flying over another misses it), and the contact
   * is the same impulse with restitution and friction as everywhere else, applied to the rigid body at the contact
   * point (so a hit on a wreck's nose spins it) and to a car on its wheels in the plane. A car hit hard enough by a
   * tumbling chassis is torn up and launched itself.
   */
  wreckContacts() {
    const cars = this.simCars || this.cars, n = cars.length;
    const SA = this._sa || (this._sa = new Float64Array(6)), SB = this._sb || (this._sb = new Float64Array(6));
    const VA = this._v3a || (this._v3a = [0, 0, 0]), VB = this._v3b || (this._v3b = [0, 0, 0]);
    const out = (c) => c.cleared || c.inPit || c.ghost > 0;
    for (let i = 0; i < n; i++) {
      const a = cars[i]; if (out(a)) continue;
      for (let j = i + 1; j < n; j++) {
        const b = cars[j]; if (out(b) || !(a.rigid || b.rigid)) continue;
        if (Math.abs(b.x - a.x) > 8 || Math.abs(b.z - a.z) > 8) continue;
        a.bodySpheres(SA); b.bodySpheres(SB);
        let best = null;
        for (let p = 0; p < 6; p += 3) for (let q = 0; q < 6; q += 3) {
          const dx = SB[q] - SA[p], dy = SB[q + 1] - SA[p + 1], dz = SB[q + 2] - SA[p + 2], dist = Math.hypot(dx, dy, dz), pen = 2.1 - dist;
          if (pen > 0 && (!best || pen > best.pen)) best = { pen, nx: dx / (dist || 1), ny: dy / (dist || 1), nz: dz / (dist || 1), cx: (SA[p] + SB[q]) / 2, cy: (SA[p + 1] + SB[q + 1]) / 2, cz: (SA[p + 2] + SB[q + 2]) / 2 };
        }
        if (!best) continue;
        const { pen, nx, ny, nz, cx, cy, cz } = best;
        // push apart (a car on its wheels only in the plane)
        const sep = (c, sg) => { if (c.rigid) { c.p[0] += sg * nx * pen / 2; c.p[1] += Math.max(0, sg * ny) * pen / 2; c.p[2] += sg * nz * pen / 2; } else { c.x += sg * nx * pen / 2; c.z += sg * nz * pen / 2; } };   // (never pushed into the ground)
        sep(a, -1); sep(b, 1);
        a.pointVel3(cx, cy, cz, VA); b.pointVel3(cx, cy, cz, VB);
        const rvx = VB[0] - VA[0], rvy = VB[1] - VA[1], rvz = VB[2] - VA[2], rvn = rvx * nx + rvy * ny + rvz * nz;
        if (rvn >= 0) continue;
        const K = a.invMass3(cx, cy, cz, nx, ny, nz) + b.invMass3(cx, cy, cz, nx, ny, nz); if (K <= 0) continue;
        // (no bounce when one lands on the other from above: a car coming down on another stops on it, it is not
        //  sprung back into the air)
        const jn = -(Math.abs(ny) > 0.5 ? 1.0 : 1.25) * rvn / K;
        // friction along the sliding direction at the contact (bodywork on bodywork)
        let tx = rvx - rvn * nx, ty = rvy - rvn * ny, tz = rvz - rvn * nz; const tl = Math.hypot(tx, ty, tz);
        let jt = 0; if (tl > 1e-3) { tx /= tl; ty /= tl; tz /= tl; const Kt = a.invMass3(cx, cy, cz, tx, ty, tz) + b.invMass3(cx, cy, cz, tx, ty, tz); if (Kt > 0) jt = Math.min(0.5 * jn, tl / Kt); }
        const jx = jn * nx - jt * tx, jy = jn * ny - jt * ty, jz = jn * nz - jt * tz;
        a.impulse3(cx, cy, cz, -jx, -jy, -jz); b.impulse3(cx, cy, cz, jx, jy, jz);
        for (const c of [a, b]) c.pulse(Math.hypot(jn, jt) / CAR.mass, PULSE.car, 'car');
        // damage: a car on its wheels takes it like any hit; a tumbling one loses whatever is near the contact
        const into = -rvn;
        for (const [c, o] of [[a, b], [b, a]]) {
          const sg = c === a ? -1 : 1;
          if (c.rigid) { c.crushWorld(cx, cy, cz, sg * nx, sg * ny, sg * nz, into); if (into > 4) c._breakNear(cx, cy, cz, into); continue; }
          const ca = Math.cos(c.th), sa = Math.sin(c.th), lx = (cx - c.x) * ca + (cz - c.z) * sa, ly = (cx - c.x) * sa - (cz - c.z) * ca;
          this._other = `${o.short}:wreck`; const sev = c.applyImpact(lx, ly, into * 0.6);
          if (sev > 0) c.crushWorld(cx, cy, cz, sg * nx, sg * ny, sg * nz, into * 0.6);
          if (sev > 0) { this.onImpact(c, sev, 'car'); c.emit('hit', cx, cz, sev); }
          this._other = null;
          // collected by a flying chassis: torn up and thrown too
          if (into > LAUNCH_CAR && o.air && Math.random() < Math.min(0.6, 0.2 + (into - LAUNCH_CAR) / 20)) {
            const sg = c === b ? 1 : -1;
            c.launch(cx, Math.max(0.2, cy), cz, sg * nx * into * 0.25, Math.min(10, 3 + (into - LAUNCH_CAR) * 0.2 + Math.random() * 4), sg * nz * into * 0.25);
            this.onImpact(c, 1, 'car');
          }
        }
      }
    }
  }

  /**
   * Marshals: a stopped retired car (or the wreck of one) on or beside the racing surface is recovered - a little
   * slower while the safety car is still on its way - and moved, not deleted: it is lifted and set down off the road
   * (over the wall on a street circuit, out on the grass or gravel on a permanent one) and stays there for the rest
   * of the race, no longer in anyone's way. One far off the road is left where it is.
   */
  marshals(dt) {
    const tr = this.track;
    for (const c of this.cars) {
      if (c.parkMove) { this.parkStep(c, dt); continue; }
      // qualifying: a car that stops - crashed, beached, stalled - is out of the session and gone in moments (back to
      // its garage: nobody's flying lap runs past a parked car)
      if (this.mode === 'quali' && !c.isPlayer && !c.hiddenAway) {
        if (c.qualiDone && (c.pitLaneState === 'stop' || this.time - (c._doneAt ?? this.time) > 200)) { c.cleared = true; c.parked = true; c.hiddenAway = true; c.held = true; c.x = c.z = -1e5; continue; }   // (in: back in the garage)
        if (!c.retired && !c.inPit && !c.pitLane && c.speed < 1 && (c.stoppedTime || 0) > 5) { c.retired = true; c.retireReason = 'Stopped on track'; }
        if (c.retired && !c.air && c.speed < 1) { c.clearT = (c.clearT || 0) + dt; if (c.clearT > 2.5) { c.cleared = true; c.parked = true; c.hiddenAway = true; c.x = c.z = -1e5; } }
        continue;
      }
      if (!c.retired || c.cleared || c.air || c.speed > 0.5 || c.isPlayer) continue;
      c.clearT = (c.clearT || 0) + dt;
      if (c.pitLane && this.pit) { if (c.clearT > 4 && this.pushToGarage(c)) continue; }   // (in the pit lane: the crews)
      const hw = tr.edgeAt(c.trackIdx, Math.sign(c.d) || 1), onRoad = Math.abs(c.d) < hw + 3, near = Math.abs(c.d) < hw + 14;   // (the edge on its own side: Austin's road is 30 m wide on a corner's outside)
      if (!near) { if (c.clearT > 20) c.cleared = true; continue; }   // (already well out of the way: it stays put)
      if (c.clearT > (onRoad ? 25 : 35)) this.parkWreck(c);   // (recovery takes a while: the yellow flags, the safety car)
    }
  }
  parkWreck(c) {
    // (the road's edge on that side: a road widened on a corner's outside - Austin's Turn 1, 29.5 m from the centreline -
    //  would otherwise have its wreck set down on the racing surface, 9-13 m past the base width)
    const tr = this.track, side = Math.sign(c.d) || 1, hw = tr.edgeAt(c.trackIdx, side), wall = tr.wallAt(c.trackIdx, side);
    const barrier = (side > 0 ? tr.barL : tr.barR)[c.trackIdx];
    // inside the barrier when there is room (a permanent circuit's verge), else craned over it
    const dT = !barrier || wall - hw > 14 ? Math.min(wall - 3, hw + 9 + Math.random() * 4) : wall + 3.5;
    const f = tr.sample(c.s, side * dT);
    c.cleared = true;   // no longer an obstacle (collisions, the AI's traffic, the safety car's incident)
    const x0 = c.rigid && c.p ? c.p[0] : c.x, z0 = c.rigid && c.p ? c.p[2] : c.z;
    c.parkMove = { t: 0, x0, z0, x1: f.x, z1: f.z, y0: c.rigid && c.p ? c.p[1] : 0 };
  }
  /** a car stopped for good in the pit lane: the crews push it into the nearest garage, out of the lane (false: not beside the garages) */
  pushToGarage(c) {
    const P = this.pit, ps = P.samples, q = P.nearest(c.x, c.z, {}), i = Math.max(0, Math.min(ps.n - 1, Math.round(q.u / ps.ds)));
    if (i < P.wallStartI + 4 || i > P.wallEndI - 4 || c.rigid) return false;
    const lat = -P.trackSide * (P.halfWidth + 4.2);   // (inside the pit building, parallel to the lane)
    c.cleared = true;
    c.parkMove = { t: 0, x0: c.x, z0: c.z, x1: ps.px[i] + ps.nx[i] * lat, z1: ps.pz[i] + ps.nz[i] * lat, y0: 0, push: true, th0: c.th, th1: Math.atan2(ps.tz[i], ps.tx[i]) };
    return true;
  }
  /** the crane: up, across, down (over ~5 s); or pushed along the ground (into a garage, over ~6 s) */
  parkStep(c, dt) {
    const M = c.parkMove; M.t += dt; const T = M.push ? 6 : 5, u = Math.min(1, M.t / T), e = u * u * (3 - 2 * u);
    const lift = M.push ? 0 : Math.sin(Math.PI * u) * 2.2;
    const x = M.x0 + (M.x1 - M.x0) * e, z = M.z0 + (M.z1 - M.z0) * e;
    c.x = x; c.z = z; c.vLong = c.vLat = c.r = 0;
    if (M.th1 != null) { let dth = M.th1 - M.th0; dth = Math.atan2(Math.sin(dth), Math.cos(dth)); c.th = M.th0 + dth * e; }
    if (c.rigid && c.p) { c.p[0] = x; c.p[2] = z; c.p[1] = M.y0 + lift; if (c.v) c.v.fill(0); if (c.w) c.w.fill(0); }
    else c.hv = lift;
    if (u >= 1) { c.parkMove = null; c.parked = true; if (!c.rigid) c.hv = 0; }
  }

  /**
   * The big accidents: once a car wrecked or put out by an accident has come to rest, is its driver hurt? He is taken
   * to the medical centre (in a championship with a round still to come he is stood down for it, nothing worse). By
   * the hardest hit he took; a car torn in two nine times in ten.
   */
  injuries() {
    if (this.mode !== 'race') return;
    for (const c of this.cars) {
      if (c._injChecked || !c.retired || !(c.wreck || c.split || (c.air && c.speed < 1) || (/^Accident/.test(c.retireReason) && c.speed < 1))) continue;
      if (c.air && !c.split) continue;   // (still tumbling: wait for it to stop)
      c._injChecked = true;
      // (by the hardest pulse the driver took - most heavy shunts end with a walk to the medical centre and a clean bill:
      //  almost never below 25 g, ~3 % at 30 g, ~13 % at 45 g, ~1 in 5 at Silverstone 2021's 51 g, ~45 % at 60 g, two in
      //  three at Bahrain 2020's 67 g; a car torn in two more often than not)
      const g = c.peakG || 0, p = g < 25 && !c.split ? 0 : Math.max(c.split ? 0.6 : 0, 1 / (1 + Math.exp(-(g - 62) / 9)));
      if (Math.random() >= p) continue;
      // (the replay of it is cut a moment later for a car torn in two - checked at once, still flying: its halves'
      //  flight belongs in it)
      c.injured = true; c.injuryClip = null; c._clipAt = this.time + (c.split ? 3.5 : 0);
      const last = c.name.split(' ').pop();
      if (c.isPlayer) { this.engineer?.say("Are you OK? Talk to me... OK, stay in the car, the medical car is coming to you.", 3); this.hud?.msg('MEDICAL CAR DEPLOYED', 'bad', 4); }
      else if (this.engineer && this.player) this.engineer.say(`Big one for ${last}. He's out of the car, but he's going to the medical centre for checks.`, 2);
    }
  }

  /**
   * Speed banding: the further a car is behind the leader, the more power (up to +12 %), the less drag (up to -7 %)
   * and the more grip (up to +1.2 %) it has. The curve rises steeply over the first seconds and is full from ~5 s back,
   * so the leader never gets to cruise on a cushion and the field stays within about half a minute - but it fades out
   * again as a car closes in (nothing inside 0.4 s), so second place is pushed up to the leader's gearbox, not towed
   * past it: the quicker cars still come to the front, the leading pack fights for it.
   */
  speedBands(dt) {
    this._bandT = (this._bandT || 0) - dt; if (this._bandT > 0) return; this._bandT = 0.5;
    const lead = this.positions.find((c) => !c.retired), on = this.mode === 'race' && this.world.racing;
    for (const c of this.cars) {
      if (!on || !lead || c === lead || c.retired || c.startRun) { c.band = 0; continue; }
      let g = this.radio.gap(c, lead); if (g == null) g = (this.progress(lead) - this.progress(c)) / Math.max(30, lead.speed);
      c.band = g <= 0.4 ? 0 : Math.min(1, Math.pow((g - 0.4) / 4.6, 0.6));
    }
  }
  /**
   * Red flag: the race is suspended (SafetyCar sends the field round slowly first). Every wreck is recovered, the
   * debris and fires cleared, the field lined up on the grid in race order with fresh tyres and repairs (the player
   * picks tyres in the pit menu), and the race restarts with a standing start. Laps done so far stand.
   */
  redFlagRestart() {
    const lead = this.positions.find((c) => !c.retired);
    for (const c of this.cars) if (c.retired && !c.parked && !c.isPlayer) { if (!c.parkMove) this.parkWreck(c); c.parkMove.t = 1e9; this.parkStep(c, 0); }
    this.onRedFlag?.();
    const order = (this._order || this.positions).filter((c) => !c.retired && !c.finished); this._order = null;   // (in the order at the red flag)
    this.slots = gridLayout(this.track, order.length, this.poleSide);
    order.forEach((c, i) => {
      const a = c.ai;
      c.inPit = false; c.pitLane = false; c.pitLaneState = null; c.pitRequested = false; c.pitPlan = null; c.held = true;
      c.placeOnTrack(this.slots[i].s, this.slots[i].d, 0); c.gridSlot = this.slots[i]; c.lapDist = -(14 + 8 * i); c.jumpStart = false;
      c.repair('full'); c.drs = false; c.drsAvail = null; c.ersEnergy = 1; c.ghost = 0; c._owes = null; c._unlap = false; c._scGreen = true; c.engTemp = 0.3;
      if (a) {
        a.reaction = Infinity; a.rj = null; a.spun = false; a.defend = null; a.error = null; a.pitPlan = null; a.planner.best.n = 0; a.planner.best.spec = null;
        const left = this.lapsTotal - c.lap, soft = left <= 4, comp = this.settings.wetness > 0.6 ? 'WET' : this.settings.wetness > 0.3 ? 'INTER' : soft ? 'SOFT' : left <= 9 ? 'MEDIUM' : 'HARD';
        c.fitTyres(comp); c.tyres.temp = c.tyres.spec.start ?? 0.7; this.onPitDone?.(c);
      }
    });
    const p = this.player;
    if (p && !p.retired && this.hud?.openPit) this.hud.openPit(p, (plan) => { p.fitTyres(plan.compound); p.tyres.temp = p.tyres.spec.start ?? 0.7; this.onPitDone?.(p); });
    for (const z of this.drs.zones) z.last.clear();
    this.drs.fromLap = (lead ? lead.lap : 0) + 2;
    this.state = 'grid'; this.stateT = 0; this.world.racing = false; this.lightsOn = 0; this.holdTime = 0; this.lightsOutAt = Infinity;
    this.hud?.msg('RACE RESUMES · STANDING START', 'warn', 4);
    this.engineer?.say('We restart from the grid. New tyres are on, the car is repaired. Good start now.', 3);
  }

  /** wrapped distance from s=a to s=b along the lap (b ahead: positive) */
  planDs(a, b) { const L = this.track.length; let x = b - a; if (x > L / 2) x -= L; if (x < -L / 2) x += L; return x; }
  /** how far a car has raced (laps and lap distance) */
  progress(c) { return c.lap * this.track.length + c.lapDist; }

  rank() {
    if (this.mode === 'quali') { this.positions.sort((a, b) => a.bestLap - b.bestLap || (a.retired ? 1 : 0) - (b.retired ? 1 : 0)); return; }
    // (under a red flag the order is frozen where it stood when it came out - SafetyCar.redFlag, cancelRace: the field
    //  is slowing, some cars stopped, and nobody gains or loses a place by it; a car that retires meanwhile drops back)
    if (this._order) { const o = this._order; this.positions.sort((a, b) => (a.retired ? 1 : 0) - (b.retired ? 1 : 0) || o.indexOf(a) - o.indexOf(b)); return; }
    const fo = this.finishOrder;
    this.positions.sort((a, b) => {
      const ra = a.retired ? 1 : 0, rb = b.retired ? 1 : 0; if (ra !== rb) return ra - rb;
      // finished cars: by laps, then by finishing time with the time penalties they did not serve in the pits
      if (a.finished && b.finished) return a.lap !== b.lap ? b.lap - a.lap : a.finishTime - b.finishTime;
      const fa = a.finished ? fo.indexOf(a) : Infinity, fb = b.finished ? fo.indexOf(b) : Infinity;
      if (fa !== fb) return fa - fb;
      // (by laps and lap distance: continuous across the line from the grid - a standing start or a red-flag restart -
      //  where the track position jumps from the end of the lap to its start)
      return this.progress(b) - this.progress(a);
    });
  }

  // --------------------------------------------------------------------------
  onLine(c, full) {
    if (c.isSC) return;
    if (this.mode === 'quali') {
      if (c.qualiDone || c.retired) return;
      if (c.lapStart < 0) { c.lapStart = this.crossTime(c); if (c.isPlayer && !c.autopilot) { this.qualiStarted = true; this.hud?.msg('LAP STARTED', 'good', 1.5); } return; }
      const now = this.crossTime(c), t = now - c.lapStart; c.lapTimes.push(t); c.lapStart = now; c.qLaps++;
      const best = t < c.bestLap; if (best) c.bestLap = t;
      if (!this.practice && c.qLaps >= Q_LAPS) {
        c.qualiDone = true; c.coolDown = true; c._doneAt = this.time;
        // (its session over: an in-lap to its garage - solid, like any car on track - and gone once it is in: marshals)
        if (!c.isPlayer) { c.pitRequested = true; c.pitPlan = { compound: c.tyres.compound, repair: 'none' }; }
      }
      else this.freshRun(c);
      if (c.isPlayer && !c.autopilot) {
        this.rank(); const pos = this.positions.indexOf(c) + 1;
        this.hud?.msg(`LAP ${fmt(t)}${best ? ` · P${pos}` : ''}${this.practice ? '' : c.qualiDone ? '\nSESSION DONE FOR YOU' : '\nONE MORE LAP · F: END THE SESSION (THE REST SIMULATED)'}`, best ? 'good' : '', 3);
        if (c.qualiDone) this.endTimer = 2.5;
      }
      return;
    }
    if (this.mode === 'tt') {
      if (c.lapStart < 0) { c.lapStart = this.time; return; }
      const t = this.time - c.lapStart; c.lapTimes.push(t); c.lap++; c.lapStart = this.time;
      if (t < c.bestLap) { c.bestLap = t; this.hud?.msg(`BEST LAP ${fmt(t)}`, 'good', 2.5); } else this.hud?.msg(`LAP ${fmt(t)}`, '', 2);
      return;
    }
    if (!this.world.racing || !full || this.cancelled) return;   // (a cancelled race: nothing counts any more)
    const now = this.crossTime(c), t = now - c.lapStart; c.lapTimes.push(t); if (t < c.bestLap) c.bestLap = t; c.lapStart = now; c.lap++;
    this.sc.onLine(c);
    if (c.isPlayer && !c.finished) this.hud?.msg(`LAP ${fmt(t)}${c.lap + 1 === this.lapsTotal ? '\nFINAL LAP' : ''}`, '', 2.2);
    if (c.isPlayer && !c.finished && this.engineer) {
      const pos = this.positions, i = pos.indexOf(c); const ahead = pos[i - 1], behind = pos[i + 1];
      // (time gaps from the timing loops; the gaps during the lap are the briefings' job, Radio.js)
      const gap = (a, b) => { const g = this.radio.gap(b, a); return g != null ? Math.abs(g) : Math.abs(a.totalDist - b.totalDist) / Math.max(12, (a.speed + b.speed) / 2); };
      // (8 laps or more: at least one stop is mandatory - reminded with two laps to go if it is still owed)
      if (this.lapsTotal >= 8 && !c.pitStops && c.lap + 2 === this.lapsTotal) this.engineer.say('Box this lap or next. We still owe the mandatory stop.', 3);
      if (c.lap + 1 === this.lapsTotal) this.engineer.say(`Final lap. ${ahead ? `${ahead.short} is ${gap(ahead, c).toFixed(1)} ahead` : 'You are leading'}${behind ? `, ${behind.short} ${gap(c, behind).toFixed(1)} behind` : ''}. Bring it home.`, 3);
    }
    if (!c.finished && (c.lap >= this.lapsTotal || this.leaderFinished)) {
      // (8 laps or more and never stopped: the mandatory stop missed - 30 s added at the flag)
      if (this.mode === 'race' && this.lapsTotal >= 8 && !c.pitStops && !c.retired) this.stewards.award(c, 30, 'missed mandatory pit stop');
      c.finished = true; c.finishTime = this.time + c.penalties; this.finishOrder.push(c);
      if (!this.leaderFinished) { this.leaderFinished = true; this.leaderFinishTime = this.time; }
      if (c.isPlayer && !c.autopilot) { this.hud?.msg('CHEQUERED FLAG', 'good', 4); this.endTimer = 3; this.postRaceRadio(c); }
    }
  }

  /**
   * Over the line: the engineer's call - the result as the pit wall would say it (a win, a podium, points, a hard
   * day), where it came from (the grid), the fastest lap, the team-mate, a penalty still to come off it, then the
   * cool-down lap. Quiet and careful when someone was hurt in the race.
   */
  postRaceRadio(c) {
    const E = this.engineer; if (!E) return;
    const pick = (a) => a[Math.floor(Math.random() * a.length)], last = (x) => x.name.split(' ').pop();
    const pos = this.finishOrder.indexOf(c) + 1, grid = c.gridPos || pos, gain = grid - pos;
    const fastest = this.cars.reduce((b, x) => (x.bestLap < (b ? b.bestLap : Infinity) ? x : b), null) === c;
    const tm = this.cars.find((x) => x !== c && x.team === c.team), hurt = this.cars.filter((x) => x !== c && x.injured);
    const from = gain >= 3 ? ` From P${grid} on the grid!` : '';
    let main;
    if (hurt.length) main = `P${pos}. Bring it in slowly, no celebrating on the radio. We're waiting for news on ${hurt.map(last).join(' and ')}, we'll tell you the moment we hear anything.`;
    else if (pos === 1) main = pick([`P1! You've won it!${from} Get in there, what a drive!`, `Yes! Race winner! P1!${from} Unbelievable job, absolutely unbelievable.`, `That's the win! P1!${from} Fantastic, mate, fantastic.`]);
    else if (pos <= 3) main = pick([`P${pos}, that's a podium!${from} Great drive, really great drive.`, `Podium! P${pos}.${from} Lovely job today, the whole team is buzzing.`]);
    else if (pos <= 10) main = pick([`P${pos}, good points today.`, `That's P${pos}. Solid job, those points matter.`, `P${pos}, in the points. Good work.`]) + (gain > 0 ? ` Up ${gain} from the grid.` : gain < -2 ? ' We lost some places today, we will look at why.' : '');
    else main = pick([`P${pos}. Not the day we wanted. We'll go through it together.`, `P${pos}, chequered flag. Tough one. Thanks for keeping at it.`, `P${pos}. We were short today, that's on us as much as you.`]) + (gain > 2 ? ` Still, up ${gain} from where we started.` : '');
    E.say(main, 3);
    const more = [];
    if (fastest && !hurt.length) more.push(pick(['And the fastest lap as well.', 'Fastest lap too, nice.']));
    if (c.penalties > 0) more.push(`There's a ${Math.round(c.penalties)} second penalty still to come off that.`);
    if (tm) { const ti = this.finishOrder.indexOf(tm); if (tm.retired) more.push(`${last(tm)} didn't make it to the end.`); else if (ti >= 0 && ti < pos - 1) more.push(`${last(tm)} finished P${ti + 1}.`); else if (!hurt.length) more.push(`Ahead of ${last(tm)} as well.`); }
    more.push(hurt.length ? 'Cool-down lap, take it easy. Box at the end of the lap.' : pos <= 3 ? 'Cool-down lap, then park it behind your board in parc fermé.' : 'Cool-down lap now, bring it back to parc fermé.');
    E.say(more.join(' '), 3, 7);   // (after the first call has been heard)
  }

  /** when car c crossed the line just now: the substep's time, less the distance it has gone past the line */
  crossTime(c) { const past = c.s < this.track.length / 2 ? c.s : 0; return (this.simNow ?? this.time) - Math.min(0.05, past / Math.max(10, Math.abs(c.speed))); }

  onImpact(c, sev, type) {
    (this.impactLog || (this.impactLog = [])).length < 4000 && this.impactLog.push([+this.time.toFixed(1), c.short, type, +sev.toFixed(2), Math.round(c.s), Math.round(c.speedKmh), +c.d.toFixed(1), this._other || '', c.ghost > 0 ? 'G' : '']);
    // Montreal's Wall of Champions (Track.pinWall): a car that touches it out of the last chicane has kissed it (once a
    // race, the first time; the career keeps the season it happened in - the trophy for winning the title anyway)
    if (type === 'wall' && !c.wocKiss && this.mode === 'race') { const pin = this.track.pinAt?.(c.s, c.d); if (pin?.name === 'Wall of Champions') { c.wocKiss = { lap: c.lap, sev: +sev.toFixed(2), t: +this.time.toFixed(1) }; if (c.isPlayer) this.hud?.msg('WALL OF CHAMPIONS', sev > 0.25 ? 'bad' : 'warn', 2.4); } }
    if (!c.isPlayer) { if (this.player && Math.hypot(c.x - this.player.x, c.z - this.player.z) < 60) this.audio?.impact(sev * 0.5); return; }
    this.audio?.impact(sev);
    if (sev > 0.12) {
      const d = c.dmg; const worst = Object.entries(d).sort((a, b) => b[1] - a[1])[0];
      const names = { fwL: 'FRONT WING (L)', fwR: 'FRONT WING (R)', rw: 'REAR WING', susp: 'SUSPENSION', eng: 'ENGINE' };
      this.hud?.msg(`${names[worst[0]]} DAMAGE`, worst[1] > 0.6 ? 'bad' : 'warn', 2);
      if (sev > 0.25 && this.engineer) {
        const adv = { fwL: 'We can change the wing at the stop, press P to box.', fwR: 'We can change the wing at the stop, press P to box.', rw: 'Rear downforce is down, be careful in the fast stuff.', susp: 'The car will pull to one side, box for repairs if it gets worse.', eng: 'Engine is hurt, avoid running in dirty air.' };
        this.engineer.say(`${names[worst[0]].charAt(0) + names[worst[0]].slice(1).toLowerCase()} damage. ${adv[worst[0]]}`, 3);
      }
    }
  }
  /**
   * An AI driver's mistake (AIDriver.rollError: 'wide' | 'lockup' | 'snap' | 'scrape'). A rival within three places of
   * you who came into the race low on form (FORM.label SHAKY: short of confidence, TENSE: feeling the pressure) gets a
   * word from the pit wall - at most once every three laps per car, and never on a day someone has been hurt.
   */
  onAIError(c, type, zone) {
    c._errs = (c._errs || 0) + 1;
    const p = this.player, E = this.engineer, F = c.form;
    if (!E || !p || !F || c.isPlayer || this.mode !== 'race' || !this.world.racing || this.cancelled || p.autopilot || p.retired || p.finished) return;
    if ((F.label !== 'SHAKY' && F.label !== 'TENSE') || (c._rattled != null && c.lap - c._rattled < 3)) return;
    const pos = this.positions, me = pos.indexOf(p), them = pos.indexOf(c);
    if (me < 0 || them < 0 || Math.abs(me - them) > 3) return;
    for (const x of this.cars) if (x.injured) return;   // (someone hurt today: nobody's nerves are a talking point)
    c._rattled = c.lap;
    const pick = (a) => a[Math.floor(Math.random() * a.length)], L = c.name.split(' ').pop(), ahead = them < me, at = ahead ? ' there' : ' behind you';
    const what = type === 'lockup' ? (c._errs > 1 ? `${L} has locked up again` : `${L} locked up${at}`) : type === 'wide' ? `${L} ran wide${at}` : type === 'snap' ? `${L} nearly lost the rear${at}` : type === 'scrape' ? `${L} brushed the wall${at}` : `${L} made a mistake${at}`;
    const why = F.label === 'SHAKY' ? pick(["he's short of confidence today", "his confidence is low this weekend"]) : pick(["he's rattled", "he's feeling the pressure"]);
    const then = ahead ? pick(['keep the pressure on.', 'stay close and the chance will come.']) : pick(['just hit your marks.', 'keep it clean and the gap will come.']);
    E.say(`${what} - ${why}, ${then}`, 1);
  }

  // --------------------------------------------------------------------------
  // the physical pit lane, for every car alike: drive in (the limiter engages at the speed-limit line), stop in your
  // box, the crew works (tyres, repairs, and any time penalty is served first), drive out (limiter off at the exit
  // line). The player drives it; an AI car drives it with AIDriver.pitDrive. Messages and radio only for the player.
  pitUpdate(p, dt) {
    const P = this.pit, me = p.isPlayer, E = me ? this.engineer : null, hud = me ? this.hud : null; if (!P) return;
    const box = P.boxFor(p.boxIdx ?? p.number + p.id);
    if (p.pitEntered) {
      p.pitEntered = false; p.pitLaneState = 'in'; p.boxWarned = false; p.missedBox = false;
      if (me) p.pitRequested = false;   // (the AI keeps its request until it has stopped: it is what it drives to)
      else if (p.pitRequested) this.radio?.pitCall(p);   // (a rival near you boxing: the engineer says what it means)
      const toLine = P.limitFrom - p.pitU;
      hud?.msg(toLine > 15 ? `PIT ENTRY · SPEED LIMIT IN ${toLine.toFixed(0)} m` : 'PIT LANE · LIMITER ON', 'warn', 2);
      E?.say(`${toLine > 15 ? 'Brake for the speed line.' : 'Limiter on.'} Your box is ${(box.u - p.pitU).toFixed(0)} metres ahead on the ${P.trackSide > 0 ? 'right' : 'left'}, stop in the box.`, 3);
    }
    // the speed lines (the limiter itself is automatic, Car._pitLane)
    if (me && p.pitLimiter !== !!p._limWas) {
      if (p.pitLimiter && p.pitU > P.limitFrom + 2) hud?.msg('LIMITER ON', 'warn', 1.5);
      else if (!p.pitLimiter && p.pitLane && p.pitU >= P.limitTo) { hud?.msg('LIMITER OFF · PIT EXIT', 'good', 1.5); E?.say('Limiter off, push to the blend line, watch for traffic.', 2); }
      p._limWas = p.pitLimiter;
    }
    if (p.pitExited) { p.pitExited = false; if (p.pitLaneState) { p.pitLaneState = null; hud?.msg('REJOIN', 'good', 1.2); } }
    if (!p.pitLane) { if (p.pitAuto) { p.pitAuto = null; p._pull = null; } return; }
    // (driven in for you and missed anyway - stopped beside the box, pushed off it: the car is yours again at once, on
    //  down the lane - never an AI driving you on toward the exit with the stop given up)
    if (me && p.pitAuto?.missed && p.pitLaneState === 'in') { p.pitAuto = null; p._pull = null; p.steer = 0; hud?.msg('MISSED YOUR BOX · YOUR CAR', 'bad', 2.5); }
    if (p.pitLaneState === 'in') {
      // yours: from the speed-limit line the car is driven to the box for you (pitTakeover); you time the pull-in (pullIn)
      if (me && !p.pitAuto && !p.autopilot && p.pitU >= P.limitFrom - 1 && p.pitU < box.u - 12) this.pitTakeover(p, box);
      if (me && p._pull && !p._pull.done && (p.pitU - p._pull.at) / Math.max(4, p.speed) > 0.6) this.pullIn(p, true);
      const ahead = box.u - p.pitU;
      if (!p.boxWarned && ahead < 45 && ahead > 0) { p.boxWarned = true; hud?.msg('BOX AHEAD', 'warn', 1.5); }
      const inBox = Math.abs(ahead) < 7.5 && Math.abs(p.pitLat - box.lat) < 3.2;   // anywhere on the painted box (8.8 m long) counts
      if (inBox && p.speed < 0.4 && (me || p.pitRequested)) {
        let plan = p.pitPlan || p.ai?.pitPlan || { compound: p.tyres.compound, repair: 'none' };
        // (an AI car's repairs are what it needs now it is in the box, not what it needed when the stop was called: a stop
        //  called for tyres under the safety car, the car damaged in the incident, came straight back in for a wing)
        if (!me || !p.pitPlan) { const R = ['none', 'wing', 'full'], need = p.dmg.rw > 0.35 || p.dmg.susp > 0.55 ? 'full' : p.dmg.fwL > 0.3 || p.dmg.fwR > 0.3 ? 'wing' : 'none'; if (R.indexOf(need) > R.indexOf(plan.repair)) plan = { ...plan, repair: need }; }
        p.held = true; p.pitLaneState = 'stop'; p.pitStopT = this.stopTime(p, plan) + p.penalties + (me && p._pull ? p._pull.pen : 0); p._stopServe = p.penalties; p.penaltyServed += p.penalties; p.penalties = 0; p.pitPlanActive = plan; p._stopAt = this.time; p._stopDur = p.pitStopT; p._stopPlan = plan;   // (_stop*: the crew's choreography, world/PitCrew.js)
        hud?.msg(`STOP · ${p.pitStopT.toFixed(1)}s${p._slowStop ? '\nSLOW STOP' : ''}`, p._slowStop ? 'bad' : 'warn', p.pitStopT);
        if (p._slowStop) E?.say('Slow stop, sorry, problem on the rear left.', 3);
        else if (me && p._pull && p._pull.pen > 0.3) E?.say(p._pull.result === 'EARLY' ? 'Bit early on the turn-in there, the boys had to reposition.' : 'Late on the turn-in, we lose a little in the box.', 2);
      } else if (ahead < -10 && !p.missedBox) { p.missedBox = true; hud?.msg('MISSED YOUR BOX', 'bad', 2); E?.say('You missed the box, we will go again next lap.', 3); }
    } else if (p.pitLaneState === 'stop') {
      if (this.cancelled) { p.held = true; return; }   // (the race is over: the car stays at its garage)
      p.pitStopT -= dt;
      if (p.pitStopT <= 0) {
        const plan = p.pitPlanActive; p.fitTyres(plan.compound); p.repair(plan.repair); p.pitStops++; p.held = false; p.pitLaneState = 'out'; p.pitPlan = null; p.missedBox = false; p._pitDoneT = this.time;
        if (p.pitAuto) { p.pitAuto = null; p._pull = null; p._releasedAt = this.time; }   // (the green light: the car is yours again)
        p.pitRequested = false; if (p.ai) p.ai.pitPlan = null;
        const still = this.noteStop(p, this.time - p._stopAt, plan, p._stopServe);
        this.onPitDone?.(p); hud?.msg(`GO GO GO · ${still.toFixed(1)}s`, 'good', 1.5);
        E?.say(`Go go go. ${still.toFixed(1)} second stop${still < 2.6 && plan.repair === 'none' && !p._stopServe ? ', great work from the boys' : p._slowStop ? ', sorry about that' : ''}. Limiter stays on until the pit exit line.`, 3);
      }
    }
  }
  /**
   * Your stop: from the speed-limit line the car is driven to your box by the AI (AIDriver.pitDrive) - you only time
   * the pull-in (pullIn: Space / Enter / pad A), and the car is yours again the moment the pit light goes green.
   * The turn-in point is 18 m before the box (a late, steep turn-in, past the neighbours' box).
   */
  pitTakeover(p, box) {
    p.pitAuto = new AIDriver(p, this.line, this.profile, this.track, { aggression: 0.4, skill: 1 }); p.pitAuto.boxing = true;
    p.pitRequested = true; p.steer = 0; p.handbrake = 0; p.ers = 0;
    p._pull = { at: box.u - 18, done: false, pen: 0, result: null };   // (the turn-in: AIDriver._laneLat's S starts 18 m before the box)
    this.hud?.msg('PIT LANE · AI DRIVING\nPRESS SPACE TO PULL IN', 'warn', 2.5);
    this.engineer?.say('Limiter on, we have the car. Call the turn-in for the box.', 2);
  }
  /**
   * The pull-in timed: off by more than 0.12 s (at the speed you are doing; a little more or less with your composure,
   * FORM.pitWin) and the crew lose time repositioning - up to a second or so at half a second out; never pressed, the
   * AI turns in late. -> { result, pen, et }
   */
  pullIn(p, missed = false) {
    const P = p._pull; if (!P || P.done) return null;
    const et = (p.pitU - P.at) / Math.max(4, p.speed), a = Math.abs(et), w = 0.12 * (p.form?.pitWin || 1);
    P.done = true; P.et = et;
    if (missed) { P.result = 'MISSED'; P.pen = 1.2; }
    else { P.pen = a <= w ? 0 : Math.min(1.15, 0.15 + (a - w) * 2.6); P.result = a <= w ? 'PERFECT' : et < 0 ? 'EARLY' : 'LATE'; }
    P.pen = Math.round(P.pen * 10) / 10;
    return P;
  }
  /**
   * Blue flags: a car a lap up closing on you (within ~150 m behind on the road) - the marshals wave blue (Marshals.js)
   * and you are told to let it through, once per car. Not under a safety car or yellow (the field is neutralised) and
   * not in the pit lane. this.blue = { car, gap } while it is shown.
   */
  blueFlags(dt) {
    const p = this.player; this.blue = null;
    if (p && !p.autopilot && this.mode === 'race' && this.world.racing && !p.retired && !p.finished && !p.inPit && !p.pitLane && this.sc.phase === 'green') {
      const L = this.track.length, mine = this.progress(p);
      for (const o of this.cars) {
        if (o === p || o.retired || o.inPit || o.pitLane || o.finished) continue;
        const behind = L - (this.progress(o) - mine);   // (how far it is behind you on the road, if it is about a lap up)
        if (behind > 0 && behind < 150 && (!this.blue || behind < this.blue.gap)) this.blue = { car: o, gap: behind };
      }
    }
    if (this.blue) {
      this._blueGone = 0;
      const o = this.blue.car;
      if (this._blueCar !== o) {
        this._blueCar = o; this.hud?.msg(`BLUE FLAG\nLET ${o.short} THROUGH`, 'blue', 3);
        this.engineer?.say(`Blue flags. ${o.name.split(' ').pop()} is coming through to lap you, let the car by and don't fight it.`, 3);
      }
    } else if (this._blueCar && (this._blueGone = (this._blueGone || 0) + dt) > 6) this._blueCar = null;
  }

  /**
   * Every stop's stationary time, for the fastest pit stop of the race (the results' facts). A stop that served a
   * penalty or changed a wing is not a crew's time; returns the time.
   */
  noteStop(c, t, plan, served) {
    (this.stops || (this.stops = [])).push({ c, t, lap: c.lap + 1, clean: !served && (!plan || plan.repair === 'none') });
    return t;
  }
  /**
   * Stationary time: a tyre change is 2.0-2.6 s (the crew, not the car), about one stop in thirty a wheel gun or a
   * cross-threaded nut costs 2.5-6 s more; a front wing change adds 6 s, a bigger repair 10 s.
   */
  stopTime(c, plan) {
    c._slowStop = Math.random() < 0.035;
    const rep = plan.repair === 'wing' ? 6.0 : plan.repair === 'full' ? 10.0 : 0;
    return (2.0 + Math.random() * Math.random() * 0.6) * (c.pitMul || 1) + rep + (c._slowStop ? 2.5 + Math.random() * 3.5 : 0);   // (pitMul: the team's crew, career/Career.js)
  }

  /** real race events for the engineer: position changes (held for 2 s to ignore side-by-side flicker), retirements near you */
  events(dt) {
    const E = this.engineer, p = this.player; if (!E || !p || this.mode !== 'race' || !this.world.racing) return;
    const pos = this.positions; const myIdx = pos.indexOf(p); const last = (c) => c.name.split(' ').pop();
    if (this.reportedIdx == null) { this.reportedIdx = myIdx; this.pendingIdx = myIdx; }
    if (myIdx !== this.pendingIdx) { this.pendingIdx = myIdx; this.pendingT = 0; } else this.pendingT += dt;
    if (myIdx !== this.reportedIdx && this.pendingT > 2 && this.time - (this.world.raceStart || 0) > 6) {
      const gained = myIdx < this.reportedIdx; const other = gained ? pos[myIdx + 1] : pos[myIdx - 1];
      if (other && !p.pitLane && !p.inPit) {
        if (other.inPit || other.pitLane) E.say(`${last(other)} has boxed, that puts you P${myIdx + 1}.`, 1);
        else if (other.retired) E.say(`${last(other)} is out, you're up to P${myIdx + 1}.`, 2);
        else E.say(gained ? `Good move on ${last(other)}, you're P${myIdx + 1}. Keep it clean.` : `${last(other)} is through on you, P${myIdx + 1}. Stay with him.`, 2);
      }
      this.reportedIdx = myIdx;
    }
    for (const c of this.cars) if (c.retired && !this.retiredSeen.has(c) && c !== p) { this.retiredSeen.add(c); const ci = pos.indexOf(c); if (Math.abs(ci - myIdx) <= 4 || ci === 0) E.say(`${last(c)} has retired. ${c.retireReason || 'Damage.'}`, 2); }
  }

  // --------------------------------------------------------------------------
  // pit lane
  requestPit(c, plan) {
    if (c.inPit || c.finished) return false;
    if (c.pitLane && c.pitLaneState === 'in') { c.pitRequested = true; if (plan) c.pitPlan = plan; return true; }   // (in the lane on the way to the box: P picks the tyres, it never calls the stop off)
    c.pitRequested = !c.pitRequested; if (plan) c.pitPlan = plan;
    return c.pitRequested;
  }
  checkPitEntry(c) {
    const L = this.track.length; let ds = this.pit.entryS - c.s; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L;
    if (ds > -2 && ds < 70 && c.speed > 3) this.enterPit(c);
  }
  enterPit(c) {
    const ai = this.ai.find((a) => a.car === c);
    const plan = c.pitPlan || ai?.pitPlan || { compound: c.tyres.compound, repair: (c.dmg.fwL > 0.3 || c.dmg.fwR > 0.3) ? 'wing' : 'none' };
    const P = this.pit; const boxIdx = Math.abs(c.boxIdx ?? c.number + c.id) % P.boxes.length; const box = P.boxes[boxIdx];
    c.inPit = true; c.pitRequested = false; c.held = false;
    this.pitStates.set(c, { u: 0, v: c.speed, phase: 'in', box: boxIdx, boxU: P.samples.s[box.i], stopT: 0, plan, ex: c.x - P.samples.px[0], ez: c.z - P.samples.pz[0], lane: 0, sfDone: false });
    if (c.isPlayer) this.hud?.msg('PIT LANE · LIMITER ON', 'warn', 2);
    else if (this.engineer && this.player) { const ci = this.positions.indexOf(c), mi = this.positions.indexOf(this.player); if (Math.abs(ci - mi) <= 3) this.engineer.say(`${c.name.split(' ').pop()} is boxing from P${ci + 1}${plan.compound ? ' for ' + plan.compound.toLowerCase() + 's' : ''}.`, 2); }
  }
  pitStep(c, dt) {
    const st = this.pitStates.get(c), P = this.pit, ps = P.samples, lim = P.limiter;
    const approach = (v, target, acc, dec) => v < target ? Math.min(target, v + acc * dt) : Math.max(target, v - dec * dt);
    // the speed limit holds between the same two lines as for the player (where the lane leaves the track and where
    // it rejoins it): down to the limiter by the first one, braking hard for it like a driver would
    const zoneIn = P.limitFrom, zoneOut = P.mergeU + 4;
    if (st.phase === 'in') {
      st.v = approach(st.v, lim, 6, 25);
      st.v = Math.min(st.v, Math.sqrt(lim * lim + 2 * 25 * Math.max(0, zoneIn - st.u)));
      // a double stack: the team-mate still in the box (or on the way to it, ahead) - wait behind it, a car's length
      // and a bit short of the box, and move up when it has gone (one crew, one car at a time)
      const queued = this.boxBusy(c, st), rem = st.boxU - st.u - (queued ? 7.5 : 0); const vAllow = Math.sqrt(Math.max(0, 2 * 6.5 * rem));
      st.v = Math.min(st.v, vAllow);
      if (queued) { if (rem < 0.4) st.v = 0; }
      else if (rem < 0.4 || (rem < 3 && st.v < 0.3)) {
        st.phase = 'stop'; st.v = 0;
        st.stopT = this.stopTime(c, st.plan) + c.penalties; st.serve = c.penalties; st.at = this.time; c.penaltyServed += c.penalties; c.penalties = 0;
        c._stopAt = this.time; c._stopDur = st.stopT; c._stopPlan = st.plan; c._stopServe = st.serve;
        if (c.isPlayer) this.hud?.msg(`STOP · ${st.stopT.toFixed(1)}s`, 'warn', st.stopT);
      }
    } else if (st.phase === 'stop') {
      st.stopT -= dt;
      if (st.stopT <= 0) { c.fitTyres(st.plan.compound); c.repair(st.plan.repair); c.pitStops++; st.phase = 'out'; const still = this.noteStop(c, this.time - st.at, st.plan, st.serve); this.onPitDone?.(c); if (c.isPlayer) this.hud?.msg(`GO GO GO · ${still.toFixed(1)}s`, 'good', 1.5); }
    } else {
      // out: on the limiter to the exit line, then back onto the circuit where the lane meets it, at speed
      st.v = approach(st.v, lim, 7, 9);
      if (st.u >= Math.min(ps.length - 1, zoneOut)) { this.exitPit(c, st.v); return; }
    }
    st.u += st.v * dt;
    // lane: fast lane, drifting to the garage side around the box
    const nearBox = Math.max(0, 1 - Math.abs(st.u - st.boxU) / 30); st.lane += ((-P.trackSide) * (P.halfWidth - 2.4) * nearBox - st.lane) * Math.min(1, dt * 3);
    const uu = Math.min(ps.length - 0.01, st.u) / ps.ds; const i0 = Math.min(ps.n - 2, Math.floor(uu)), f = uu - i0;
    const lerp = (a) => a[i0] + (a[i0 + 1] - a[i0]) * f;
    const blend = Math.max(0, 1 - st.u / 45);
    c.x = lerp(ps.px) + lerp(ps.nx) * st.lane + st.ex * blend; c.z = lerp(ps.pz) + lerp(ps.nz) * st.lane + st.ez * blend;
    c.th = Math.atan2(lerp(ps.tz), lerp(ps.tx)); c.vLong = st.v; c.vLat = 0; c.r = 0; c.throttle = st.phase === 'stop' ? 0 : 0.3; c.brake = st.phase === 'stop' ? 1 : 0;
    c.rpm = 5000 + st.v * 90; c.gear = st.v > 1 ? 2 : 1;
    const q = this.track.nearest(c.x, c.z, c.trackIdx, c._q || (c._q = {})); c.trackIdx = q.i; c.s = q.s; c.d = q.d; c.totalDist = c.lap * this.track.length + c.s;
    if (!st.sfDone && st.u >= P.sfU) { st.sfDone = true; c.inPit = false; this.onLine(c, true); c.inPit = true; }
    c.tyres.temp = Math.max(c.tyres.temp - dt * 0.02, 0.25);
  }
  /** another car at this one's box (a team-mate stopped there, still pulling away from it, or ahead on the way in to it) */
  boxBusy(c, st) {
    const P = this.pit, mine = st.box ?? Math.abs(c.boxIdx ?? c.number + c.id) % P.boxes.length;
    for (const [o, s2] of this.pitStates) {
      if (o === c || (s2.box ?? Math.abs(o.boxIdx ?? o.number + o.id) % P.boxes.length) !== mine) continue;
      if (s2.phase === 'stop' || (s2.phase === 'out' && s2.u < st.boxU + 6) || (s2.phase === 'in' && s2.u > st.u)) return true;
    }
    // (the player, driving into the box by hand)
    for (const o of this.cars) if (o !== c && o.manualPit && o.pitLane && o.pitLaneState === 'stop' && Math.abs(o.boxIdx ?? o.number + o.id) % P.boxes.length === mine) return true;
    return false;
  }
  exitPit(c, v = null) {
    const P = this.pit, st = this.pitStates.get(c); this.pitStates.delete(c); c.inPit = false;
    // where the car is on the lane now (at the exit line), onto the circuit's edge on that side
    const ps = P.samples, i = st ? Math.min(ps.n - 1, Math.round(st.u / ps.ds)) : ps.n - 1;
    const q = this.track.nearest(ps.px[i], ps.pz[i]);
    const d = Math.sign(q.d || 1) * Math.min(this.track.edgeAt(q.i, Math.sign(q.d || 1)) - 1.6, Math.abs(q.d));
    c.placeOnTrack(q.s + 2, d, v ?? P.limiter); c.ghost = 1.5; c.lapDist = c.s; c.gear = c.gearFor(v ?? P.limiter);
    if (c.isPlayer) this.hud?.msg('REJOIN · LIMITER OFF', 'good', 1.5);
  }

  /**
   * The rest of the session in a moment (F) - not the physics run fast, but a race model run from where every car is
   * now: each car's pace from the laps it has actually done today (the field's calibrated to the conditions, the car
   * and the driver for anyone without one), lap by lap with its tyres wearing and a stop when they are done, traffic
   * (a faster car stuck behind unless it has the pace or the DRS to pass, blue flags for the lapped), mistakes, the odd
   * retirement and safety car; the flag falls on the leader and everyone finishes on their next crossing. Qualifying:
   * the laps each car still has, with their mistakes.
   */
  simulateRest() {
    if (this.done) return;
    if (this.practice) { this.finish(); return; }   // (practice: nothing to simulate - the times are what they are)
    const L = this.track.length, wet = this.settings.wetness || 0, rnd = Math.random;
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 1.63;
    const model = this.estimateLap() / (0.4 + 0.6 * (this.settings.skill ?? 1));
    const modelOf = (c) => model * (1 + (1 - c.rating) * 0.012 + (1 - c.perf) * 0.45) + wet * 8;
    const own = (c) => { const ts = (c.lapTimes || []).filter((x) => isFinite(x) && x > model * 0.85 && x < model * 1.4); return ts.length ? Math.min(...ts) : null; };
    const ratios = this.cars.map((c) => { const o = own(c); return o ? o / modelOf(c) : null; }).filter(Boolean).sort((a, b) => a - b);
    const k = ratios.length ? ratios[ratios.length >> 1] : 1;
    const base = (c) => { const o = own(c), m = modelOf(c) * k; return o ? 0.6 * o + 0.4 * m : m; };   // a clean, flat-out lap
    if (this.mode === 'quali') {
      for (const c of this.cars) {
        if (c.qualiDone || c.retired) continue;
        for (let i = Q_LAPS - (c.qLaps || 0); i > 0; i--) {
          const r = rnd();
          if (r < 0.012) { c.retired = true; c.retireReason = 'Accident'; break; }   // (into the wall on a flying lap)
          const lt = base(c) * (1 + gauss() * 0.0018) + (r < 0.1 ? 0.4 + rnd() * 2.5 : 0);   // (one lap in ten with a mistake in it)
          c.lapTimes.push(lt); if (lt < c.bestLap) c.bestLap = lt; c.qLaps = (c.qLaps || 0) + 1;
        }
        c.qualiDone = true;
      }
      this.time = Math.max(this.time, this.qualiLimit || 0); this.finish(); return;
    }
    // ---- the race
    const N = this.lapsTotal, TS = Object.getPrototypeOf(this.cars[0].tyres).constructor;
    const S = this.positions.filter((c) => !c.retired && !c.finished).map((c) => {
      const b = base(c) * 1.012, into = Math.max(0, Math.min(L, c.lapDist || 0));   // (a race lap: fuel and tyres, a touch off a flying one)
      return { c, b, at: this.time + ((L - into) / L) * b * (c.speed < 5 ? 1.4 : 1), laps: c.lap + 1, w: c.tyres.wear, life: c.tyres.lifeMeters / L, comp: c.tyres.compound, stops: 0, lt: b, times: [], out: null };
    });
    const pitLoss = this.world.pitLoss || 21.4, finishers = [];
    let Tw = Infinity, sc = 0, guard = 0;
    while (S.some((s) => !s.done && !s.out) && guard++ < 400) {
      // the crossing each car is at: the flag falls on the first to complete the distance, everyone after it is done
      for (const s of S) if (!s.done && !s.out && s.laps >= N) Tw = Math.min(Tw, s.at);
      for (const s of S) if (!s.done && !s.out && s.at >= Tw) { s.done = true; finishers.push(s); }
      const run = S.filter((s) => !s.done && !s.out).sort((a, b) => a.at - b.at);   // (the order on the road)
      if (!run.length) break;
      const crash = [];
      for (const s of run) {
        const c = s.c, perLap = (RATE_NOM * 1.05 / s.life) * (c.wearMul || 1), left = N - s.laps, rl = c.raceLaps || N;
        // the lap: pace, tyres (vehicle/Tyres.js: the seconds a set loses as it wears, the cliff), a mistake now and then
        let lt = s.b * (1 + gauss() * 0.0025) + lapLoss(s.comp, s.w, rl) + (s.cold ? outLapLoss(s.comp, s.b) : 0); s.cold = false;
        const r = rnd();
        if (r < 0.0012 * (c.relMul || 1)) { s.out = 'Mechanical'; continue; }
        if (r < 0.0012 * (c.relMul || 1) + 0.0015 * (1 + 2 * wet)) { s.out = 'Accident'; crash.push(s); continue; }
        if (rnd() < 0.012 * (1 + 1.5 * wet)) lt += 3 + rnd() * 7;   // (a spin, a trip across the run-off)
        s.w += perLap;
        // (a stop only when it pays: what the worn set would cost over the laps left against the stop, a fresh set - the
        //  softest that reaches the flag - and its cold out-lap)
        const nx = wet > 0.5 ? 'WET' : wet > 0.2 ? 'INTER' : ['SOFT', 'MEDIUM', 'HARD'].find((k) => cliffLaps(k, rl) >= left - 0.3) || 'HARD';
        const nLife = new TS(nx, rl, L).lifeMeters / L, nPer = (RATE_NOM * 1.05 / nLife) * (c.wearMul || 1);
        let stay = 0, fresh = pitLoss + outLapLoss(nx, s.b); for (let j = 1; j <= left; j++) { stay += lapLoss(s.comp, s.w + j * perLap, rl); fresh += lapLoss(nx, (j - 0.5) * nPer, rl); }
        if (left >= 1 && fresh < stay) {   // (the tyres are done: a stop for a fresh set)
          s.comp = nx; s.life = nLife; s.w = 0; s.stops++; s.cold = true; lt += pitLoss * (0.85 + 0.15 * (c.pitMul || 1));
        }
        s.lt = lt; s.raw = s.at + lt + (sc ? 26 : 0);
      }
      // traffic: through the order on the road, a car that would catch the one ahead is held up unless it can pass
      const go = run.filter((s) => !s.out); let prev = null;
      for (const s of go) {
        if (prev && s.laps === prev.laps && s.raw < prev.at2 + 0.25) {
          const quicker = prev.lt - s.lt, drs = this.drs && rnd() < 0.3;
          if (!(quicker > 0.5 + rnd() * 0.6 || drs)) s.raw = prev.at2 + 0.25 + rnd() * 0.35;
        }
        s.at2 = s.raw; prev = s.at2 >= (prev?.at2 ?? -Infinity) ? s : prev;
      }
      // a safety car: after a crash, now and then otherwise - the field closes up behind it
      if (sc) sc--;
      if (!sc && (crash.length ? rnd() < 0.7 : rnd() < 0.008)) {
        sc = 2; const g = go.slice().sort((a, b) => a.at2 - b.at2); g.forEach((s, i) => { if (i) s.at2 = Math.max(s.at2, g[0].at2 + i * 0.8); });
      }
      for (const s of go) { s.times.push(s.at2 - s.at); s.at = s.at2; s.laps++; }
    }
    // ---- the result onto the cars
    // (8 laps or more: the mandatory stop - a car that has not stopped makes it, its time in the pit lane added)
    if (this.lapsTotal >= 8) for (const s of finishers) if (!s.stops && !s.c.pitStops) { s.forcedStop = true; s.at += 21 + rnd() * 3; }
    finishers.sort((a, b) => a.at - b.at);
    for (const s of S) {
      const c = s.c;
      for (const x of s.times) { c.lapTimes.push(x); if (x < c.bestLap && x > model * 0.85) c.bestLap = x; }
      c.pitStops += s.stops + (s.forcedStop ? 1 : 0); if (s.stops) { c.fitTyres(s.comp); this.onPitDone?.(c); }
      if (s.out) { c.retired = true; c.retireReason = s.out; c.lap = s.laps; c.cleared = true; continue; }
    }
    for (const s of finishers) { const c = s.c; c.lap = s.laps; c.finished = true; c.finishTime = s.at + c.penalties; this.finishOrder.push(c); this.time = Math.max(this.time, s.at); }
    if (finishers.length && !this.leaderFinished) { this.leaderFinished = true; this.leaderFinishTime = finishers[0].at; }
    this.finish();
  }

  // --------------------------------------------------------------------------
  finish() {
    if (this.done) return; this.done = true;
    this.onFinish?.(this.classification());
  }
  classification() {
    this.rank();
    const rows = []; const leader = this.positions[0]; const L = this.track.length;
    this.positions.forEach((c, i) => {
      let gap;
      if (c.retired) gap = `DNF · ${c.retireReason || 'damage'}`;
      else if (i === 0) gap = fmt(c.finished ? c.finishTime : this.time);
      else if (c.finished && leader.finished) { const lapsDown = leader.lap - c.lap; gap = lapsDown > 0 ? `+${lapsDown} lap${lapsDown > 1 ? 's' : ''}` : `+${(c.finishTime - leader.finishTime).toFixed(3)}`; }
      else { const lapsDown = leader.lap - c.lap; gap = lapsDown > 0 ? `+${lapsDown} lap${lapsDown > 1 ? 's' : ''} (est)` : `+${(Math.abs(leader.totalDist - c.totalDist) / Math.max(20, c.speed || 50)).toFixed(1)}s (est)`; }
      // (penPts / ppLog: the superlicence points the stewards gave this car today, for the career to put on the licence)
      rows.push({ pos: i + 1, car: c, name: c.name, team: c.team, color: c.color, gap, best: fmt(c.bestLap), stops: c.pitStops, me: c.isPlayer, penalties: c.penalties + c.penaltyServed, penPts: c.penPts || 0, ppLog: c.ppLog || [] });
    });
    return rows;
  }

  /**
   * Expected clean AI lap: the speed profile driven with the real power / drag balance (the profile's own traction
   * pass ignores drag, which hardly matters on a street circuit but costs seconds where every straight follows a fast
   * corner). Calibrated against headless solo AI laps.
   */
  estimateLap() {
    const tr = this.track, p = this.profile, n = tr.n, ds = tr.ds;
    const P = (CAR.powerKW + CAR.ersKW) * 1000, drag = 0.5 * CAR.rho * CAR.cdA;
    let v = p[0], t = 0;
    for (let c = 0; c < 2 * n; c++) {   // first lap settles the speed at the line, second lap is timed
      const a = Math.min(P / (CAR.mass * Math.max(8, v)), 14) - (drag * v * v + CAR.rolling) / CAR.mass;
      v = Math.min(p[(c + 1) % n], Math.sqrt(Math.max(64, v * v + 2 * a * ds)));
      if (c >= n) t += ds / v;
    }
    return t;
  }
}

function fmt(t) { if (!isFinite(t) || t <= 0) return '--'; const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(3).padStart(6, '0')}`; }
