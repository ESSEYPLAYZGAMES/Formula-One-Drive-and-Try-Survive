// AI driver. The planner (Planner.js) chooses a path and the speed along it about ten times a second, from candidate
// lanes driven through the predicted traffic; this file drives that plan - steering onto the path (pure pursuit with a
// slip-angle feed-forward and countersteer), pedals onto its speed within what the tyres actually have left (trail
// braking, traction) - and carries the race around it: racecraft costs (defend once into a braking zone, hold the
// grid lane off the start), the driver's personality and mistakes, spins and recovery, and pit strategy. The driver's
// form on the day (car.form, career/Morale.js) nudges all of it a little: commitment and braking (confidence), how
// often a mistake comes (focus), the room and the gaps left in a fight and how often a move is defended (racecraft),
// and how much a car on the gearbox or a feud gets to it (composure). The numbers are tiny on purpose: the whole
// field's rating spread is only ~0.5 % of corner speed.
import { COMPOUNDS } from '../vehicle/Tyres.js';
import { CAR } from '../vehicle/Car.js';
import { Planner, DS, NMAX } from './Planner.js';
import { neutralForm } from '../career/Morale.js';
import { zoneCal } from './Calibration.js';

const G = 9.81;
const BEACHED_T = 30;   // seconds an AI car tries to get itself out (off the road, not getting anywhere) before it retires
const BRAKE_A = CAR.brakeMax / CAR.mass;
const REAR_AERO = ((1 - CAR.aeroFrontShare) / (CAR.lf / CAR.wheelbase)) / (CAR.aeroFrontShare / (CAR.lr / CAR.wheelbase));   // rear vs front axle downforce per unit of static load
/** a corner zone taken at speed (centreline radius over 55 m): a sweeper, not a braking zone */
const isFast = (z) => !!z && z.maxCurv < 1 / 55;
/** slip angle at which the tyre curve of Car.step gives the fraction x of its peak force */
const tyreSlip = (x) => Math.tan(Math.asin(Math.max(-0.96, Math.min(0.96, x))) / 1.35) / 19;
const rnd = () => Math.random();
/** a driver's form when the car carries none (quick tests, the safety car): every multiplier 1, every addition 0 */
const NF = Object.freeze(neutralForm());
/**
 * The speeds a car may drive the pit lane at, per lane sample (cached on the lane): on the entry road the bends and
 * braking to the 80 km/h speed line (vIn), on the exit road from the line onward only the bends (vOut). Lateral 2 g,
 * braking 2 g: well inside the car, there are walls on both sides.
 */
function laneSpeeds(P) {
  if (P._speeds) return P._speeds;
  const ps = P.samples, n = ps.n, LAT = 20, BRK = 20, lim = P.limiter;
  const vc = new Float32Array(n), vIn = new Float32Array(n), vOut = new Float32Array(n);
  for (let i = 0; i < n; i++) { let k = 0; for (let j = Math.max(0, i - 3); j <= Math.min(n - 1, i + 3); j++) k = Math.max(k, Math.abs(ps.curv[j])); vc[i] = Math.min(90, Math.sqrt(LAT / Math.max(1e-4, k))); }
  const iL = Math.max(0, Math.min(n - 1, Math.round(P.limitFrom / ps.ds)));
  vIn.fill(lim); for (let i = iL - 1; i >= 0; i--) vIn[i] = Math.min(vc[i], Math.sqrt(vIn[i + 1] ** 2 + 2 * BRK * ps.ds));
  vOut[n - 1] = vc[n - 1]; for (let i = n - 2; i >= 0; i--) vOut[i] = Math.min(vc[i], Math.sqrt(vOut[i + 1] ** 2 + 2 * BRK * ps.ds));
  return (P._speeds = { vIn, vOut });
}

/** Runtime-tunable AI constants (exposed on window.__F1.AI_TUNE for live balancing). */
export const AI_TUNE = {
  // ---- driving the plan (the controller tuned against the car's physics)
  lookK: 0.42, lookBase: 6, lookMin: 8, lookMax: 42,     // pure-pursuit lookahead
  csGain: 1.6, steerRate: 12,                            // countersteer, steering slew
  ffFrom: 35, ffBlend: 25,                               // slip-angle feed-forward fades in between 35 and 60 m/s
  trailK: 0.85, trailMin: 0.18, trailSlip: 3.0,          // trail braking: pressure off with steering lock and rear slip
  edgeGuard: 1, satLift: 1, slipLift: 8, guardBrakeV: 45,
  // ---- the driver
  vScaleBase: 0.972, vScaleK: 0.028,                     // cornering commitment by rating
  aBBase: 0.88, aBK: 0.09,                               // braking commitment by rating
  errBase: 0.011,                                        // mistakes (per corner, scaled by rating, tyres, pressure)
  // ---- the planner
  planHz: 10,                                            // re-plans a second
  edgeMargin: 1.2,                                       // the car's centre stays this far inside the white line (m)
  widthBase: 2.22, widthCaution: 0.3,                    // centre-to-centre room it leaves a car alongside (+ caution)
  gapBase: 6.5, gapK: 0.12,                              // following gap, centre to centre (m, + s of speed)
  defendGap: 0.5,                                        // a car behind within this many seconds, closing, is an attacker
  laneHoldT: 5,                                          // seconds off the start it keeps its grid lane
};

export class AIDriver {
  constructor(car, line, profile, track, opts = {}) {
    this.car = car; this.line = line; this.profile = profile; this.track = track;
    car.ai = this;
    // (the circuit's AI grip: what lets the field match a quick human there - a driver on the edges of the road and over
    //  every kerb - with the same margin to the limit the AI keeps everywhere, tracks.js def.aiGrip; the car's physics
    //  has it too, so it is a better-gripping car, not a braver driver)
    car.aiGrip = car.isPlayer ? 1 : (track?.def?.aiGrip ?? 1);
    this.aggression = opts.aggression ?? 1.0;
    this.skill = opts.skill ?? 1.0;              // difficulty: scales cornering commitment (menu slider), 0.94 .. 1.02
    this.reaction = 0;                           // seconds until the AI reacts at the start (race director sets Infinity on the grid)
    this.error = null;                           // active human error { type, t, dur }
    this.lastZone = null; this.pressure = 0;
    this.waitT = 0; this.stuckT = 0; this.spun = false;
    this.pitPlan = null;
    this.planner = new Planner(this);
    this.planT = Math.random() / AI_TUNE.planHz;  // (staggered: the field does not all plan on the same step)
    this.defend = null;                          // { side, untilS, attacker } once committed to a defensive move
    this.defendCool = 0;
    this.ctx = { s0: 0, v: 0, e0: 0, e1: 0, n: 0, m: 0, grip: null, vEnd: 0, width: 0, gap: 0, forceLane: false, racecraft: null };
    this.g = { mu: 1, dfm: 0, scale: 1, brake: 1, power: 1, ers: false };
    this.gripState();
  }
  /** commitment: by driver rating and difficulty (and a hair of confidence, FORM.pace); a car with a broken rear wing is nursed back to the pits */
  get vScale() { return (AI_TUNE.vScaleBase + AI_TUNE.vScaleK * this.car.rating) * this.skill * (1 - 0.25 * Math.min(1, this.car.dmg.rw / 0.6)) * (this.car.form || NF).pace * (1 + 0.012 * (this.car.band || 0)); }
  get state() { return this.defend ? 'defend' : this.planner.best.follow ? 'follow' : this.planner.best.spec && this.planner.best.spec.k ? 'lane' : 'race'; }

  // ---- what this car can do now ----------------------------------------------------------------------------------
  /**
   * This car's friction and downforce relative to what the speed profile assumed (warm fresh softs, clean air, no
   * damage). In a downforce-limited corner the limit speed follows grip almost one for one: cold or hard tyres, worn
   * ones past the cliff, dirty air or a lost wing turn a "flat" sweeper into a real corner.
   */
  gripState() {
    const c = this.car, P = this.line.grip, T = AI_TUNE;
    const muR = (c.tyres.grip(c.wetness) / COMPOUNDS.SOFT.grip) * (1 - 0.12 * c.tyres.instability()) * (c.offTrack ? c.surfGrip : 1) * (1 - 0.1 * c.wetness) * (1 - 0.22 * c.dmg.susp) * (1 - 0.06 * (c.dmg.fwL + c.dmg.fwR)) * (c.aiGrip || 1);
    const rearLtd = c.aeroRear() < c.aeroFront() - 0.05;   // a damaged rear wing makes the car rear-limited: drive it well inside
    const dfR = c.perf * (1 - 0.22 * c.slipstream) * Math.min(c.aeroFront(), c.aeroRear()) * (rearLtd ? 0.65 : 1);
    const g = this.g;
    g.mu = P.mu * muR; g.dfm = P.dfm * dfR; g.scale = this.vScale;
    g.brake = (T.aBBase + T.aBK * c.rating) * (0.6 + 0.4 * this.skill) * (1 - 0.5 * c.dmg.rw) * (c.form || NF).brake;   // (a confident driver brakes a touch later: FORM.brake)
    g.power = c.enginePower(); g.ers = c.ersEnergy > 0.05;
    this._muPhys = CAR.muBase * muR; this._dfm = P.dfm * dfR;   // the car's real limit (the plan keeps a margin under it)
  }
  /** tyre braking (m/s^2, whole car) that keeps the rear tyres at `margin` of their grip with the cornering they do now */
  rearLimit(margin) {
    const W = this.car.wh; let room = 0;
    for (let k = 2; k < 4; k++) { const cap = margin * W.cap[k] * 0.9; room += Math.sqrt(Math.max(0, cap * cap - W.fy[k] * W.fy[k])); }
    return room / (1 - CAR.brakeBias) / CAR.mass;
  }
  gripFactor() {
    const c = this.car;
    const g = c.tyres.grip(c.wetness) / COMPOUNDS.SOFT.grip * (1 - 0.12 * c.tyres.instability());
    const dmg = 1 - 0.18 * (c.dmg.fwL + c.dmg.fwR) * 0.5 - 0.3 * c.dmg.rw - 0.15 * c.dmg.susp;
    return Math.sqrt(Math.max(0.2, g * dmg * (c.offTrack ? Math.min(0.75, c.surfGrip) : 1) * (1 - 0.13 * c.slipstream) * (1 - 0.12 * c.wetness)));
  }
  nextCorner(within) {
    const tr = this.track; const s0 = this.car.s;
    for (let d = 0; d < within; d += 10) { const z = tr.inCornerZone(tr.idxAtS(s0 + d)); if (z) return z; }
    return null;
  }

  // ---- planning -------------------------------------------------------------------------------------------------
  replan(world) {
    const c = this.car, tr = this.track, line = this.line, T = AI_TUNE, ctx = this.ctx, v = c.speed, F = c.form || NF;
    this.gripState();
    // race control (yellow flags, VSC, safety car): a slower pace, a speed cap, no overtaking, a longer gap
    const rule = world.sc?.rules(c) || null; this.rule = rule;
    if (rule) { this.g.scale *= rule.scale; if (rule.brake) this.g.brake *= rule.brake; }
    if (c.punct != null) { this.g.scale *= c.punctShred ? 0.6 : 0.72; this.g.brake *= 0.7; }   // (nursing a puncture to the pits)
    ctx.vCap = rule?.vCap ?? null; ctx.noPass = !!rule?.noPass; ctx.queueSC = !!rule?.queueSC;
    // a place taken when it was not allowed: lift and let that car back by (it is still close behind)
    const owed = c._owes;
    if (owed && !owed.retired) { const x = this.planner.ds(owed.s, c.s); if (x > -3 && x < 400) ctx.vCap = Math.min(ctx.vCap ?? 99, Math.max(8, x < 80 ? owed.speed * 0.8 - 2 : owed.speed * 0.93)); }
    const H = Math.max(120, Math.min(300, 80 + v * 2.6));
    ctx.n = Math.min(NMAX, Math.round(H / DS) + 1);
    ctx.s0 = c.s; ctx.v = v; ctx.e0 = c.d - line.offsetAt(c.s);
    // the car's heading against the track: the slope its path leaves with
    const [wx, wz] = c.worldVel(), i = c.trackIdx;
    const va = wx * tr.tx[i] + wz * tr.tz[i], vd = wx * tr.nx[i] + wz * tr.nz[i];
    const lineSlope = (line.offsetAt(c.s + 5) - line.offsetAt(c.s - 5)) / 10;
    ctx.e1 = Math.max(-0.5, Math.min(0.5, vd / Math.max(5, va) - lineSlope));
    ctx.m = tr.halfWidth - (tr.def.aiEdgeMargin ?? T.edgeMargin);   // (a circuit where the kerbs are part of the lap lets the car's centre wider: Montreal)
    ctx.grip = this.g;
    const sEnd = c.s + (ctx.n - 1) * DS;
    ctx.vEnd = Math.min(ctx.vCap ?? 99, this.profile[tr.idxAtS(sEnd)] * this.gripFactor() * this.g.scale);
    // off the start: the field launches in its grid lanes and holds them to the first corner, and the first lap is
    // driven with a little more room around the others (the race is not won in Turn 3 of lap 1, it is lost there)
    const sinceStart = world.raceStart != null ? world.time - world.raceStart : 1e9;
    const lap1 = sinceStart < 40 ? Math.max(0.15, 0.5 - 0.3 * this.aggression) : 0;   // (less for a ruthless driver, never none)
    // (racecraft: a sharp driver leaves the room a car alongside needs and no more, a hesitant one a little extra -
    //  FORM.width, inside the floor)
    ctx.width = Math.max(2.15, (T.widthBase + T.widthCaution * (1 - this.aggression) + 0.4 * lap1) * F.width);
    ctx.unreadRoom = Math.max(0.4, 1.15 - 0.5 * this.aggression);   // how much of the extra room a car it cannot read gets
    // (running hot from following in dirty air: drop back a few car lengths to cool it, as a driver is told to; the
    //  following gap itself by racecraft - a sharp driver sits a little closer, FORM.gap - before race control's minimum)
    ctx.gap = (T.gapBase + v * T.gapK * (1 - 0.3 * this.aggression)) * (1 + 0.3 * lap1) * F.gap + 25 * Math.max(0, c.engTemp - 0.75);
    if (rule && rule.gap) ctx.gap = Math.max(ctx.gap, rule.gap + 0.15 * v);
    ctx.lap1 = lap1;
    this._hold = sinceStart < T.laneHoldT && c.gridSlot ? Math.max(-ctx.m, Math.min(ctx.m, c.gridSlot.d)) : null;
    ctx.forceLane = this._hold != null || !!this.defend;
    // boxing this lap: braking for the pit entry like any corner - to the speed the entry road allows at its first
    // metre (its bends, and the speed line beyond them: laneSpeeds); from there pitDrive drives it
    ctx.pitDist = null; ctx.pitCapV = null; this._pitD = null;
    if (c.pitRequested && world.pit) {
      const P = world.pit, toStart = this.planner.ds(c.s, P.entryS), toLine = toStart;
      if (toLine > 0 && toLine < 600) { ctx.pitDist = toLine; ctx.pitCapV = laneSpeeds(P).vIn[0]; }
      // be on the side of the track where the lane leaves it (P.trackD: the lane's distance from the centreline, unsigned;
      // P.sideSign: the side it lies on, left +)
      if (toStart > 0 && toStart < 400) {
        const iD = Math.min(P.samples.n - 1, Math.round(P.divergeU / P.samples.ds));
        this._pitTo = toStart + P.divergeU * 0.5; this._pitD = Math.max(-ctx.m, Math.min(ctx.m, P.sideSign * P.trackD[iD])); ctx.forceLane = true;
      }
    }
    // a feud (ui/GridWalk.js: what you said to this driver, or what they heard): this race, you get no room, a car on your
    // gearbox, every door shut - and, now and then when alongside, it leans on you (racecraftCost); a driver short on
    // composure flares up more often (FORM.flare)
    const fk = c.feud || 0, me = fk > 0 ? (this._me || (this._me = world.cars.find((o) => o.isPlayer))) : null;
    ctx.feud = me && !me.retired && !me.inPit && !me.pitLane ? me : null; ctx.feudK = fk; this._feudD = null;
    if (ctx.feud) {
      const ds = this.planner.ds(c.s, me.s);
      if ((this._fT = (this._fT || 0) - 0.1) <= 0) { this._fT = 2 + rnd() * 2.5; this._fOn = rnd() < (0.35 + 0.55 * fk) * F.flare; }
      if (this._fOn && ds > -9 && ds < 10 && Math.abs(me.d - c.d) < 4) this._feudD = me.d;
    }
    this.decideDefence(world);
    ctx.racecraft = this._racecraft || (this._racecraft = (P) => this.racecraftCost(P));
    this.planner.plan(world, ctx);
  }

  /**
   * Defending: a car behind within a second and closing, a braking zone ahead - one move to the inside, made before
   * the braking point and held into the corner. Never a second move, never in a fast sweeper, and not every time
   * (the more aggressive the driver, the more often).
   */
  decideDefence(world) {
    const c = this.car, tr = this.track, T = AI_TUNE, P = this.planner;
    if (this.isSC || this.rule) { this.defend = null; return; }   // (nothing to defend behind the safety car)
    if (this.defend) {
      const past = P.ds(this.defend.untilS, c.s);
      if (past > 0 || this.defend.attacker.retired || this.defend.attacker.inPit) { this.defend = null; this.defendCool = 8; }
      return;
    }
    if (this.defendCool > 0 || !world.racing || world.time - (world.raceStart ?? -1e9) < 8) return;
    let att = null;
    for (let r = 0; r < P.nOthers; r++) {
      const R = P.others[r], o = R.car;
      if (R.s0 >= -2 || R.lapping || o.retired || o.spinning || o.rigid || o === c._owes) continue;   // (never against a car it owes a place)
      // close enough to try it: within half a second and closing, or right on the gearbox
      const gapT = -R.s0 / Math.max(10, o.speed);
      if ((gapT < T.defendGap && o.speed > c.speed + 1.5) || gapT < 0.25) { att = o; break; }
    }
    if (!att) return;
    let zone = null, dist = 0;
    for (let d = 40; d < 260; d += 10) { const z = tr.inCornerZone(tr.idxAtS(c.s + d)); if (z) { zone = z; dist = d; break; } }
    if (!zone || isFast(zone) || dist < (att.isPlayer && c.feud > 0.4 ? 30 : 60)) return;   // (too late to move once in the braking zone - later still against someone it has a feud with)
    // (racecraft: a sharp driver covers the inside a little more often, FORM.defend; a feud: it always shuts the door on you)
    if (rnd() > 0.32 + 0.4 * this.aggression + (c.form || NF).defend + (att.isPlayer ? 0.6 * (c.feud || 0) : 0)) { this.defendCool = 5; return; }
    this.defend = { side: zone.dir, untilS: zone.sA + 15, attacker: att };
    this.defences = (this.defences || 0) + 1;
  }

  /** racecraft on top of lap time: the grid lane off the start, the inside covered once a defensive move is made */
  racecraftCost(P) {
    let cost = 0; const n = P.n;
    if (this._hold != null) {
      // the run to the first corner in the grid lane (released as the corner nears)
      for (let i = 0; i < n; i++) { const z = this.track.inCornerZone(this.track.idxAtS(P.s0 + i * DS)); if (z) break; cost += 0.004 * Math.abs(P.d[i] - this._hold); }
    }
    if (this.defend) {
      const want = this.defend.side * (this.track.halfWidth - 2.7), until = this.planner.ds(P.s0, this.defend.untilS);
      for (let i = 0; i < n && i * DS < until; i++) cost += 0.012 * Math.max(0, (want - P.d[i]) * this.defend.side);
    }
    // boxing: lined up on the pit side for the last 250 m before the lane's first metre
    if (this._pitD != null) for (let i = 0; i < n && i * DS < this._pitTo; i++) if (this._pitTo - i * DS < 250) cost += 0.02 * Math.abs(P.d[i] - this._pitD);
    if (this._feudD != null) for (let i = 0; i < n && i * DS < 30; i++) cost += 0.035 * (this.car.feud || 0) * Math.abs(P.d[i] - this._feudD);   // (leaning on you)
    return cost;
  }

  // ---- driving --------------------------------------------------------------------------------------------------
  update(dt, world) {
    const c = this.car, tr = this.track, T = AI_TUNE;
    if (c.retired) { c.throttle = 0; c.brake = 0.5; c.steer = 0; return; }
    if (c.inPit) { this.planT = 0; return; }
    // a failure: no drive (or no brakes, once it has found out) - off the racing line and stop at the side
    if (c.engineDead || (c.brakeFail && (this._bf = (this._bf || 0) + dt) > 3)) { this.pullOver(dt); return; }
    if (c.held || this.reaction > 0) {   // grid: rev the engine, no throttle before reacting to the lights
      this.reaction -= dt;
      c.throttle = c.held ? 0.3 + 0.2 * Math.sin(world.time * 6 + c.id) : 0; c.brake = c.held ? 0 : 1; c.steer = 0;
      this.planT = 0;
      return;
    }
    const v = c.speed;
    // in the pit lane and on its entry road the lane is the reference, not the circuit: the entry road bends away from
    // the track (a car driving it right looks "spun" against the circuit), and a rejoin would aim the car at the
    // circuit through the pit wall. pitDrive turns round a car that has been turned round there.
    const laneBiz = c.manualPit && world.pit && (c.pitLane || (c.pitLaneState && c.pitLaneState !== 'out') || this.inPitMode);
    if (laneBiz) { this.spun = false; this.rj = null; }
    else {
      // facing the wrong way (spun), or stuck (against a barrier, in the gravel): the driver gets itself going again -
      // no reset, no ghosting (rejoin)
      const fwdDot0 = c.fx * tr.tx[c.trackIdx] + c.fz * tr.tz[c.trackIdx];
      if (fwdDot0 < 0) this.spun = true;
      if (this.spun && fwdDot0 >= 0 && v > 3) this.spun = false;     // spun all the way round and still rolling: carry on
      if (this.spun && !this.rj) {
        if (v > 4) { c.throttle = 0; c.brake = 1; c.ers = 0; c.steer *= 0.9; return; }   // (let it come to a stop first)
        this.startRejoin();
      }
    }
    if (this.rj) { this.rejoin(dt, world); return; }
    if (this.defendCool > 0) this.defendCool -= dt;
    // boxing: from just before the pit entry to the exit line it drives the pit lane itself
    if (this.pitDrive(dt, world)) { this.strategy(world); return; }
    // ---- the plan, ~10 times a second
    this.planT -= dt;
    if (this.planT <= 0) { this.planT += 1 / T.planHz; if (this.planT < 0) this.planT = 1 / T.planHz; this.replan(world); }
    const P = this.planner, B = P.best;

    // ---- mistakes: rolled once per corner
    const zone = tr.inCornerZone(c.trackIdx);
    if (zone && zone !== this.lastZone) this.rollError(zone, world);
    this.lastZone = zone;
    this.pressure = 0;
    for (let r = 0; r < P.nOthers; r++) { const R = P.others[r]; if (R.s0 < 0 && R.s0 > -25) this.pressure = Math.max(this.pressure, 1 + R.s0 / 25); }

    // ---- steering: pure pursuit to a point on the planned path
    const spinning = Math.abs(c.r) > 1.4 && v > 6;
    const tight = (zone && zone.maxCurv > 1 / 60) || this.nextCorner(40)?.maxCurv > 1 / 60;
    const look = Math.min(T.lookMax, Math.max(T.lookMin, T.lookK * v + T.lookBase));
    const sA = c.s + look;
    let dT = P.at(B.d, sA); if (dT == null) dT = this.line.offsetAt(sA);
    // (a wall kiss: on the pinned wall's stretch only, the car runs out to a hand's width of it)
    const kiss = this.error?.type === 'scrape' && this.error.wall && tr.pinAt?.(c.s + 8, this.error.side) ? this.error.side : 0;
    if (kiss) dT = kiss * (tr.wallAt(c.trackIdx, kiss) - 0.95);
    else if (this.error && this.error.type === 'scrape' && !this.error.wall && zone) dT = -zone.dir * (tr.halfWidth + 0.6);
    // (a feud, alongside you: it squeezes you - steers onto your line and leans on you; the stewards may have a view)
    if (this._feudD != null && this._me) { const me = this._me, ds = P.ds(c.s, me.s); if (ds > -8 && ds < 8) dT += (me.d - dT) * Math.min(1, 0.95 * (c.feud || 0)); }
    const lim = kiss ? tr.wallAt(c.trackIdx, kiss) - 0.9 : tr.halfWidth - 0.9 + (this.error?.type === 'scrape' && !this.error.wall ? 2 : 0);
    dT = Math.max(-lim, Math.min(lim, dT));
    const f = tr.sample(sA, dT, this._f || (this._f = {}));
    const dx = f.x - c.x, dz = f.z - c.z, cth = Math.cos(c.th), sth = Math.sin(c.th);
    const fwd = dx * cth + dz * sth, lft = dx * sth - dz * cth, Ld = Math.hypot(dx, dz) || 1;
    const delta = Math.atan(2 * 3.6 * Math.sin(Math.atan2(lft, fwd)) / Ld);
    const dMax = Math.max(0.055, 0.38 * (1 - v / 118));
    // slip-angle feed-forward: pure pursuit gives the kinematic angle only; in a fast loaded corner the steady-state
    // steer is L*k + aF - aR, so the expected slip angles for the path's curvature are fed forward
    let ff = 0;
    const wFF = Math.min(1, (v - T.ffFrom) / T.ffBlend);
    let kl = P.at(B.k, c.s + 0.12 * v); if (kl == null) kl = this.line.lineCurv[tr.idxAtS(c.s + 0.12 * v)];
    if (wFF > 0) {
      const ay = v * v * kl, axl = this.line.grip.axle, shift = axl.transfer * c.ax;
      const gF = Math.max(3, G + this._dfm * v * v - shift / (1 - axl.rearStatic)), gR = Math.max(3, G + REAR_AERO * this._dfm * v * v + shift / axl.rearStatic);
      const aF = tyreSlip(ay / (this._muPhys * gF)), aR = tyreSlip(ay / (this._muPhys * gR));
      const cs = T.csGain * (0.6 + 0.4 * c.rating) * dMax;
      ff = wFF * (aF - aR * (1 - 2 * CAR.wheelbase / Ld - cs) - 2 * CAR.wheelbase * CAR.lr / Ld * kl);
    }
    let steer = (delta + ff) / dMax;
    const slipR = Math.atan2(c.vLat - c.r * CAR.lr, Math.max(3, Math.abs(c.vLong)));
    steer += slipR * T.csGain * (0.6 + 0.4 * c.rating);   // countersteer when the rear steps out
    if (this.error && this.error.type === 'snap' && this.error.t < 0.4) steer += this.error.sign * 0.4;
    c.steer += (Math.max(-1, Math.min(1, steer)) - c.steer) * Math.min(1, dt * T.steerRate);

    // ---- speed: the most the plan allows a moment ahead (the plan is up to 0.1 s old): flat out below it, braking
    //      onto it when above
    let vT = P.at(B.vm, c.s + v * 0.06 + 1);
    if (vT == null) vT = Math.min(this.ctx.vCap ?? 99, this.profile[tr.idxAtS(c.s)] * this.gripFactor() * this.g.scale);
    if (this.error && this.error.type === 'lockup') vT *= 1.07;
    if (this.error && this.error.type === 'wide') vT *= 1.035;
    // a car right in front, closing hard (between two plans): don't run into it
    const ahead = this.closestAhead();
    if (ahead) {
      const { o, gap } = ahead, room = gap - 6.0 - 0.08 * v;   // (a car length and a bit, more with speed)
      const vo = o.rigid || (o.retired && o.speed < 1) ? 0 : o.speed;
      vT = Math.min(vT, room > 0 ? Math.sqrt(vo * vo + 2 * 0.7 * BRAKE_A * room) : Math.max(0, vo + room * 2));
    }
    // track-edge guard (drifting out near the edge) and understeer guard: lift
    const dDot = (c.d - (this.prevD ?? c.d)) / dt; this.prevD = c.d;
    let lift = false;
    const guardV = v < T.guardBrakeV ? 1 : 1e3;   // fast corners: lift only
    const flat = vT > 90 && Math.abs(kl) < 0.004;
    // (only running wide of the plan near the edge: the plan itself uses the whole road)
    let dPlan = P.at(B.d, c.s); if (dPlan == null) dPlan = this.line.offsetAt(c.s);
    const wide = (c.d - dPlan) * Math.sign(c.d) > 0.8;
    if (T.edgeGuard && !flat && wide && Math.abs(c.d) > tr.halfWidth - 1.6 && Math.sign(dDot) === Math.sign(c.d) && Math.abs(dDot) > 0.6) { vT = Math.min(vT, v * 0.94 * guardV); lift = true; }
    if (T.satLift && (c.satF || 0) > 1.04 && v > 15) { vT = Math.min(vT, v * 0.97 * guardV); lift = true; }
    if (c.offTrack) vT = Math.min(vT, 32);
    if (spinning) vT = 0;

    // ---- pedals
    const err = vT - v;
    if (err > 0.4) { c.throttle = Math.min(1, 0.25 + err / 3.5); c.brake = 0; }
    else if (err < -0.4) {
      c.brake = Math.min(1, -err / 3.5 + 0.1); c.throttle = 0;
      // trail braking: full pressure only in a straight line; ease off with steering lock and as the rear rotates
      const trail = Math.max(T.trailMin, 1 - T.trailK * Math.abs(c.steer)) * Math.max(0.2, 1 - T.trailSlip * Math.max(0, Math.abs(c.slipR || 0) - 0.06));
      c.brake = Math.min(c.brake, trail);
      // what the rear tyres have left after the cornering: a loaded corner is entered on a trailing brake (with the
      // rear at its limit that is no brake at all - the lift and the drag slow the car, the pedal would spin it)
      if (v > 12) {
        const load = Math.min(1, 2 * Math.abs(c.ay) / (this._muPhys * (G + this._dfm * v * v)));
        c.brake = Math.min(c.brake, 1 + (this.rearLimit(0.88) * CAR.mass / CAR.brakeMax - 1) * load);
      }
      if (this.error?.type === 'lockup' && this.error.t < 0.9) c.brake = 1;
    } else { c.throttle = 0.35; c.brake = 0; }
    if (T.slipLift > 0 && v > 10) c.throttle *= Math.max(0.15, Math.min(1, 1 - (Math.abs(c.slipR || 0) - 0.05) * T.slipLift));
    if (lift) c.throttle = Math.min(c.throttle, 0.1);
    if (this.error && this.error.type === 'snap' && this.error.t < 0.4) c.throttle = Math.max(c.throttle, 0.7);
    // ERS, managed over the lap: deployed on the straights from 270 km/h (where the battery runs out at the end of a
    // straight, not on the way out of every corner), and from lower down only to attack or defend a place on a
    // straight while there is charge to spare
    let fighting = !!this.defend;
    if (!fighting && B.follow) { const g = P.ds(c.s, B.follow.s); fighting = g > 0 && g < 30; }
    const straight = Math.abs(kl) < 0.004;
    c.ers = c.throttle > 0.9 && (straight || Math.abs(kl) < 0.008) && ((v > 45 && c.ersEnergy > 0.12) || (flat && c.ersEnergy > 0.02) || (fighting && v > 25 && c.ersEnergy > 0.04)) ? 1 : 0;

    if (this.error) { this.error.t += dt; if (this.error.t > this.error.dur) this.error = null; }
    // stuck against a barrier or in the gravel: stationary for 1.5 s - get itself out
    if (v < 0.5 && world.racing && !c.held) this.stuckT += dt; else this.stuckT = 0;
    if (this.stuckT >= 1.5) this.startRejoin();
    this.strategy(world);
  }

  /**
   * The pit lane, driven like the player drives it: from 150 m before the lane leaves the track the car aims down the
   * lane instead of the racing line, brakes to the 80 km/h limit by the speed-limit line (the car's own limiter holds
   * it there), runs the fast lane, slows into its box and stops on it (the race director holds it while the crew
   * works), then drives out on the limiter and hands back to the planner at the exit line. Cars ahead in the lane are
   * followed. Returns false when the car is not in the pit-lane business.
   */
  pitDrive(dt, world) {
    const c = this.car, P = world.pit; if (!P || !c.manualPit) { this.inPitMode = false; return false; }
    const L = this.track.length, toStart = this.planner.ds(c.s, P.entryS);
    // (the run-up is the planner's: it lines the car up on the pit side and brakes for the speed-limit line like a
    //  corner; this takes over at the lane's first metre, on to the speed-limit line where the car counts as in the lane)
    const approaching = c.pitRequested && !c.pitLaneState && toStart > -(P.divergeU + 30) && toStart < 2;
    const inLane = c.pitLane || (c.pitLaneState && c.pitLaneState !== 'out');
    if (!approaching && !inLane && !(this.inPitMode && c.pitLaneState === 'out')) { this.inPitMode = false; this.missed = false; this.laneTurn = null; return false; }
    const q = P.nearest(c.x, c.z, this._pq || (this._pq = {}));
    if (c.pitLaneState === 'out' && !c.pitLane && q.u > P.mergeU - 2) { this.inPitMode = false; this.planT = 0; return false; }   // out: the planner takes over
    this.inPitMode = true;
    const ps = P.samples, lim = P.limiter, v = c.speed, T = AI_TUNE;
    const box = P.boxFor(c.boxIdx ?? c.number + c.id), u = Math.max(0, q.u);
    // past the box, or stopped beside it but not in it (pushed wide by a car in the next box): missed - on down the
    // lane and round again next lap (the request stands), never stopped for good
    if (c.pitRequested && c.pitLaneState === 'in' && !this.missed) {
      this._boxWait = v < 0.4 && Math.abs(box.u - u) < 8 ? (this._boxWait || 0) + dt : 0;
      if (u > box.u + 6 || this._boxWait > 2.5) this.missed = true;
    }
    const stopping = c.pitRequested && c.pitLaneState !== 'out' && !this.missed;
    // turned round in the lane (a spin at the entry, a tap): it stops and the crew push it round to face down the
    // lane (in the pit lane a car is not reversed under its own power)
    const iL = Math.max(0, Math.min(ps.n - 1, Math.round(u / ps.ds)));
    let off = c.th - Math.atan2(ps.tz[iL], ps.tx[iL]); off = Math.atan2(Math.sin(off), Math.cos(off));
    if (!this.laneTurn && Math.abs(off) > 1.2 && v < 6) this.laneTurn = { t: 0 };
    if (this.laneTurn) {
      const LT = this.laneTurn; LT.t += dt; c.throttle = 0; c.ers = 0; c.steer = 0;
      if (v > 0.3 && LT.t < 3) { c.brake = 1; return true; }   // (to a stop first)
      c.brake = 1; c.vLong = 0; c.vLat = 0; c.r = 0;
      if (LT.t > 1.5) { const turn = Math.min(Math.abs(off), 0.9 * dt); c.th -= Math.sign(off) * turn; }   // (the crew arrive, then push)
      if (Math.abs(off) < 0.08) { this.laneTurn = null; c.brake = 0; }
      return true;
    }
    // where in the lane: the fast lane, easing over to the box's lateral position for the last 35 m before it
    const nearBox = stopping ? Math.max(0, Math.min(1, 1 - (box.u - u - 8) / 35)) : 0;
    const look = Math.max(7, Math.min(25, 0.35 * v + 6)), uA = Math.min(ps.length - 1, u + look);
    const nb = stopping ? Math.max(0, Math.min(1, 1 - (box.u - uA - 8) / 35)) : 0;
    const latT = box.lat * (u > box.u + 4 ? 0 : nb);
    const j = Math.min(ps.n - 1, Math.round(uA / ps.ds));
    const tx = ps.px[j] + ps.nx[j] * latT, tz = ps.pz[j] + ps.nz[j] * latT;
    const dx = tx - c.x, dz = tz - c.z, cth = Math.cos(c.th), sth = Math.sin(c.th);
    const fwd = dx * cth + dz * sth, lft = dx * sth - dz * cth, Ld = Math.hypot(dx, dz) || 1;
    const dMax = Math.max(0.055, 0.38 * (1 - v / 118));
    let steer = Math.atan(2 * 3.6 * Math.sin(Math.atan2(lft, fwd)) / Ld) / dMax;
    steer += Math.atan2(c.vLat - c.r * CAR.lr, Math.max(3, Math.abs(c.vLong))) * T.csGain * 0.8;
    c.steer += (Math.max(-1, Math.min(1, steer)) - c.steer) * Math.min(1, dt * T.steerRate);
    // speed: the entry road at speed (its bends) and down to the limiter by the speed line, the limiter to the exit line
    // (into the box on a gentle stop), then the exit road at speed again
    const iu = Math.max(0, Math.min(ps.n - 1, Math.round(u / ps.ds))), S = laneSpeeds(P);
    let vT = u < P.limitFrom ? S.vIn[iu] : u <= P.limitTo ? lim : S.vOut[iu];
    if (stopping && c.pitLaneState === 'in') vT = Math.min(vT, Math.sqrt(Math.max(0, 2 * 5 * (box.u - u - 0.5))));
    // a car ahead in the lane (stopped in its box, or slower): braking in time for it from the entry road's speeds, a
    // car length and a half behind it (one stopped in its own box beside the fast lane is passed)
    // (and a car still on the lane's run-in, driven by its own pitDrive, not yet counted as in the lane: under a safety
    //  car half the field dives in at once, and the queue forms before the speed line - Montreal's lane leaves 110 m early)
    for (const o of world.cars) {
      if (o === c || o.cleared || !(o.pitLane || o.ai?.inPitMode)) continue;
      const qo = P.nearest(o.x, o.z, this._po || (this._po = {})), gap = qo.u - u;
      if (gap <= 0 || gap > 150 || (o.held && Math.abs(qo.lat - latT) > 2.6) || (gap < 30 && Math.abs(qo.lat - q.lat) > 2.6)) continue;
      vT = Math.min(vT, Math.sqrt(Math.max(0, o.speed * o.speed + 2 * 12 * (gap - 9))));
    }
    const err = vT - v;
    if (err > 0.3) { c.throttle = Math.min(1, 0.2 + err / 4); c.brake = 0; }
    else if (err < -0.3) { c.throttle = 0; c.brake = Math.min(1, -err / 4 + 0.15); }
    else { c.throttle = v > 1 ? 0.25 : 0; c.brake = vT < 0.3 ? 1 : 0; }
    c.ers = 0;
    return true;
  }

  /** the nearest car ahead whose body is in my planned path (centre-to-centre gap), within 30 m */
  closestAhead() {
    const P = this.planner, c = this.car; let best = null;
    for (let r = 0; r < P.nOthers; r++) {
      const R = P.others[r], o = R.car, gap = P.ds(c.s, o.s);
      if (gap <= 0 || gap > 30 || (best && gap > best.gap)) continue;
      let dp = P.at(P.best.d, o.s); if (dp == null) dp = c.d;
      if (Math.abs(o.d - dp) < 2.2) best = { o, gap };
    }
    return best;
  }

  /** a car that can't go on: to the edge of the road (the run-off beyond it if there is one) and stop there */
  pullOver(dt) {
    const c = this.car, tr = this.track, hw = tr.halfWidth, side = Math.sign(c.d - this.line.offsetAt(c.s)) || Math.sign(c.d) || 1;
    const room = tr.wallAt(c.trackIdx, side), dT = side * Math.min(room - 2, hw + 6);
    const f = tr.sample(c.s + Math.max(25, c.speed * 1.6), dT, this._fp || (this._fp = {}));
    const dx = f.x - c.x, dz = f.z - c.z, cth = Math.cos(c.th), sth = Math.sin(c.th);
    const ang = Math.atan2(dx * sth - dz * cth, dx * cth + dz * sth), dMax = Math.max(0.055, 0.38 * (1 - c.speed / 118));
    c.steer += (Math.max(-1, Math.min(1, ang / dMax)) - c.steer) * Math.min(1, dt * 6);
    c.throttle = 0; c.ers = 0; c.drs = false;
    c.brake = Math.abs(c.d) > hw + 1.5 || c.speed < 8 ? 0.8 : 0.15;
    if (c.brakeFail && c.speed < 0.8) { c.retired = true; c.retireReason = 'Brakes'; }
  }
  startRejoin() {
    this.rj = { phase: 'go', t: 0, total: 0, stuck: 0, lastX: this.car.x, lastZ: this.car.z, prog: 0 };
    this.error = null; this.defend = null; this.planner.best.n = 0; this.planner.best.spec = null;
  }
  /**
   * Back onto the track under its own power: aim at the edge of the road 35 m further on; facing away from it, a
   * three-point turn (reverse on opposite lock, then forward on full lock); across the gravel or grass at a crawl (full
   * throttle from a standstill to find traction); waiting at the edge for a gap in the traffic before driving onto the
   * road. Done once it is on the road, pointing the right way and moving. Getting nowhere for BEACHED_T seconds off the
   * road: beached, out of the race.
   */
  rejoin(dt, world) {
    const c = this.car, tr = this.track, R = this.rj, v = c.speed, hw = tr.halfWidth;
    R.t += dt; R.total += dt;
    const side = Math.sign(c.d) || 1, onRoad = Math.abs(c.d) < hw - 0.5;
    const f = tr.sample(c.s + 35, side * Math.min(Math.abs(c.d), hw - 2.5), this._fr || (this._fr = {}));
    // bearing to the target in the car's frame, left + (the car's left is (sin th, -cos th))
    const dx = f.x - c.x, dz = f.z - c.z, cth = Math.cos(c.th), sth = Math.sin(c.th);
    const err = Math.atan2(dx * sth - dz * cth, dx * cth + dz * sth);
    const fwdDot = c.fx * tr.tx[c.trackIdx] + c.fz * tr.tz[c.trackIdx];
    // done: on the road, the right way round and going
    if (onRoad && fwdDot > 0.9 && v > 5 && c.gear !== 0) { this.rj = null; this.spun = false; this.stuckT = 0; this.planT = 0; return; }
    // progress check (beached?)
    const moved = Math.hypot(c.x - R.lastX, c.z - R.lastZ); if (moved > 3) { R.lastX = c.x; R.lastZ = c.z; R.stuck = 0; } else R.stuck += dt;
    if (R.stuck > BEACHED_T && !onRoad) { c.retired = true; c.retireReason = Math.abs(c.d) > hw + 3 ? 'Beached in the gravel' : 'Stuck'; c.throttle = 0; c.brake = 1; this.rj = null; return; }
    // the phases of a three-point turn
    // (each half of the turn runs long enough to swing the car round: forward on full lock ~3.5 s, back ~2.5 s)
    if (R.phase === 'go' && Math.abs(err) > 1.9 && v < 3 && (R.first ?? true)) { R.phase = 'reverse'; R.t = 0; }
    if (R.phase === 'go' && Math.abs(err) > 1.2 && R.t > 3.5 && v < 4) { R.phase = 'reverse'; R.t = 0; }
    if (R.phase === 'go' && R.t > 1.5 && v < 0.4) { R.phase = 'reverse'; R.t = 0; }   // (nose against something: back out)
    if (R.phase === 'reverse' && (R.t > 2.5 || Math.abs(err) < 0.9 || (R.t > 1.2 && v < 0.2))) { R.phase = 'go'; R.t = 0; R.first = false; }
    c.ers = 0; c.drs = false;
    if (R.phase === 'reverse') {
      if (c.gear !== 0) { if (v > 0.5) { c.throttle = 0; c.brake = 1; return; } c.gear = 0; }
      c.steer = -Math.sign(err) || 1; c.throttle = 0.55; c.brake = 0;   // (reversing on the opposite lock swings the nose round)
      return;
    }
    if (c.gear === 0) { if (v > 0.5) { c.throttle = 0; c.brake = 1; return; } c.gear = 1; }
    c.steer += (Math.max(-1, Math.min(1, err * 2.2)) - c.steer) * Math.min(1, dt * 8);
    // a gap in the traffic before going onto the road (a car coming within ~4 s, on this side of the road)
    let wait = false;
    if (!onRoad || fwdDot < 0.8) for (const o of world.cars) {
      if (o === c || o.retired || o.pitLane || o.isSC || o.speed < 15) continue;
      const x = this.planner.ds(o.s, c.s);
      if (x > 0 && x < o.speed * 4 && Math.abs(c.d) < hw + 6) { wait = true; break; }
    }
    const loose = c.surf >= 3, vT = wait && Math.abs(c.d) < hw + 4 ? 0 : loose ? 9 : onRoad ? 18 : 12;
    if (v < vT - 0.5) { c.throttle = v < 1.5 && loose ? 1 : 0.45; c.brake = 0; } else if (v > vT + 1) { c.throttle = 0; c.brake = 0.6; } else { c.throttle = 0.2; c.brake = 0; }
  }

  /** back on the racing line a little further on (ghosted for 3 s), the damage stays (no longer used in races) */
  recover() {
    this.car.resetToTrack(this.line, 30); this.waitT = 0; this.stuckT = 0; this.spun = false;
    this.error = null; this.defend = null; this.planT = 0; this.planner.best.n = 0; this.planner.best.spec = null;
  }

  rollError(zone, world) {
    const c = this.car;
    if (this.error || c.speed < 15 || this.isSC || this.rule) return;   // (nobody makes a mistake at safety-car pace)
    const cold = c.tyres.temp < 0.5 ? 1.8 : 1;
    const worn = 1 + 2.2 * c.tyres.wear + 4 * c.tyres.instability();
    // (the driver's form: focus sets how often, composure how much a car on the gearbox gets to him - FORM.err and
    //  FORM.pressure; the cap stays the cap)
    const F = c.form || NF;
    const zc = zoneCal(this.track, zone);   // (the circuit's calibration: some corners invite more mistakes, ai/Calibration.js)
    const p = Math.min(0.08, AI_TUNE.errBase * (1 - c.rating) * 4 * worn * (1 + 1.6 * this.pressure * F.pressure) * cold * (0.6 + 0.4 * this.aggression) * (1 + 0.6 * ((zone.runoff || 0) / 16)) * F.err * (zc?.err ?? 1));   // braking mistakes happen where the run-off invites them
    if (rnd() > p) return;
    const tight = zone.maxCurv > 1 / 45, r = rnd();
    // mostly lock-ups (they run wide into the run-off, no spin); the bigger the run-off, the more of them; snaps are
    // rare and mild; a fast sweeper has no big stop to lock up in: the mistake there is carrying too much speed
    const runoff = zone.runoff || 0, lockBias = runoff >= 16 ? 0.85 : runoff >= 10 ? 0.72 : 0.55;
    if (zone.maxCurv < 1 / 55) this.error = { type: 'wide', t: 0, dur: 1.2 };
    else if (zone.turn === 14 && this.track.def.id === 'lasvegas' && this.pressure > 0.4 && r > 0.9 && tight) this.error = { type: 'scrape', t: 0, dur: 1.4 };
    // a wall right off the exit kerb (Montreal's Wall of Champions): the mistake there is using a little too much of it
    else if (zc?.scrape && r < zc.scrape && (this.track.pins || []).some((p) => p.side === -zone.dir)) this.error = { type: 'scrape', t: 0, dur: 4, wall: true, side: -zone.dir };
    else if (r < lockBias) this.error = { type: 'lockup', t: 0, dur: 1.3 + 0.3 * (runoff / 16) };
    else this.error = { type: 'snap', t: 0, dur: 0.7, sign: -zone.dir };
    world.onAIError?.(c, this.error.type, zone);
  }

  /**
   * The race plan, made on the grid (RaceDirector): how long the first stint runs and how the car reacts to the others.
   *  - standard: stops near the cliff (62-68 % wear), covers a rival's undercut some of the time;
   *  - early: the undercut - softs to start, stops at about half wear, usually covers rivals;
   *  - long: the overcut - starts on mediums or hards, runs to the cliff (70-74 %), ignores rivals' stops;
   *  - gamble (mostly the back of the grid): hards and the longest first stint, waiting for a safety car to stop
   *    under - which it takes at once, whatever its tyres; without one it stops at the cliff.
   * After every stop the plan is made again for the next stint. Returns true when it changed the starting tyres.
   */
  planRace(world, gridPos, n) {
    const c = this.car, back = gridPos > n * 0.6;
    const pick = (opts) => { let x = rnd() * opts.reduce((a, o) => a + o[1], 0); for (const o of opts) { x -= o[1]; if (x <= 0) return o[0]; } return opts[0][0]; };
    this.setStrat(back ? pick([['gamble', 0.4], ['long', 0.2], ['early', 0.2], ['standard', 0.2]]) : pick([['standard', 0.45], ['early', 0.3], ['long', 0.25]]));
    if (c.wetness >= 0.2 || world.lapsTotal < 3) return false;
    const type = this.strat.type, comp = type === 'early' ? 'SOFT' : type === 'long' ? (rnd() < 0.5 ? 'MEDIUM' : 'HARD') : type === 'gamble' ? (rnd() < 0.7 ? 'HARD' : 'MEDIUM') : c.tyres.compound;
    if (comp === c.tyres.compound) return false;
    c.fitTyres(comp); c.tyres.temp = 0.35;
    return true;
  }
  setStrat(type) {
    const r = rnd();
    this.strat = { type, wear: { early: 0.46 + 0.08 * r, standard: 0.62 + 0.06 * r, long: 0.7 + 0.04 * r, gamble: 0.74 }[type],
      cover: { early: 0.65, standard: 0.3 + 0.3 * this.aggression, long: 0.05, gamble: 0 }[type] };
  }
  /** a rival just ahead or behind (within 2.5 s) has turned into the pit lane: cover the undercut, or stay out */
  watchRivals(world) {
    const c = this.car, S = this.strat; this._inLane = this._inLane || new Set();
    for (const o of world.cars) {
      if (o === c || o.isSC) continue;
      if (!o.pitLane) { this._inLane.delete(o); continue; }
      if (this._inLane.has(o)) continue;
      this._inLane.add(o);
      const g = world.gap?.(c, o);
      if (g == null || Math.abs(g) > 2.5 || c.tyres.wear < 0.3 || rnd() > S.cover) continue;
      this.coverOf = o; return true;
    }
    return false;
  }

  strategy(world) {
    const c = this.car;
    if (c.pitRequested || c.inPit || !world.racing || this.isSC) return;
    const lapsLeft = world.lapsTotal - c.lap;
    if (lapsLeft < 1.2) return;
    const t = c.tyres;
    if (!this.strat) this.setStrat('standard');
    // a new stint: a new plan (the gamble and the undercut were for the first stint; now the tyres just have to last)
    if (this._stratStops !== c.pitStops) { this._stratStops = c.pitStops; if (c.pitStops > 0) this.setStrat(rnd() < 0.25 ? 'long' : 'standard'); }
    const S = this.strat;
    // a cheap stop under the safety car / VSC: the field is slow, a stop costs half as much - any car whose tyres are
    // past their best (or that has not stopped yet in a long race) takes it; the gamblers were waiting for exactly this
    const cheap = world.sc?.cheapStop && lapsLeft >= 2 && (t.wear > (S.type === 'gamble' ? 0.08 : S.type === 'long' ? 0.25 : 0.32) || (world.lapsTotal >= 13 && c.pitStops === 0 && t.wear > 0.2));
    // a rival's stop (checked twice a second)
    this._rivalT = (this._rivalT || 0) - 1 / 60;
    let cover = false;
    if (this._rivalT <= 0) { this._rivalT = 0.5; cover = lapsLeft >= 2 && this.watchRivals(world); }
    const wetMismatch = (c.wetness > 0.45 && (t.compound !== 'INTER' && t.compound !== 'WET')) || (c.wetness < 0.15 && (t.compound === 'INTER' || t.compound === 'WET'));
    // the pit entry comes once a lap: if the tyres would go over the cliff (70 % wear) before the one after this,
    // box at this one - a lap on worn-out tyres costs far more than the stop. The wear of the last full lap says how
    // fast this set is going (a team watches exactly that)
    if (c.lap !== this._wLap) { if (this._wLap != null && this._wTyres === t) this._wPerLap = t.wear - this._wStart; this._wLap = c.lap; this._wStart = t.wear; this._wTyres = t; }
    // (the plan's wear target instead of the cliff: an early stopper boxes at half wear, a gambler at the cliff)
    const toPit = 1 - c.s / this.track.length, cliffSoon = this._wPerLap > 0 && this._wTyres === t && t.wear + this._wPerLap * (toPit + 1) > S.wear;
    // (with two laps or less to go a stop for tyres never pays back - unless they are truly finished)
    const wornOut = (cliffSoon || t.wear > S.wear + 0.05) && (lapsLeft >= 2.5 || t.wear > 0.85);
    // (a front wing that has lost real downforce is changed: a lap understeering on it costs more than the stop)
    const damaged = (c.dmg.fwL + c.dmg.fwR) > 0.45 || c.dmg.rw > 0.35 || c.dmg.susp > 0.55;
    // (8 laps or more: one stop is mandatory - in a short race it is made whatever the wear, and never left too late)
    const mustStop = world.lapsTotal >= 8 && c.pitStops === 0 && lapsLeft <= Math.ceil(world.lapsTotal * (S.type === 'gamble' ? 0.3 : 0.45)) && (t.wear > 0.45 || world.lapsTotal < 13 || lapsLeft <= 2.5) && lapsLeft >= 0.6;
    if (wornOut || damaged || wetMismatch || mustStop || cheap || cover) {
      this.pitReason = cheap ? 'cheap' : cover ? 'cover' : damaged ? 'damage' : wetMismatch ? 'weather' : 'tyres';
      c.pitRequested = true;
      const laps = lapsLeft, L = this.track.length;
      let comp = 'HARD';
      if (c.wetness > 0.6) comp = 'WET'; else if (c.wetness > 0.3) comp = 'INTER';
      else { const softLife = new (Object.getPrototypeOf(t).constructor)('SOFT', c.raceLaps, L).lifeMeters / L; if (laps <= softLife * 0.95) comp = 'SOFT'; else if (laps <= softLife * 1.65 * 0.95) comp = 'MEDIUM'; }
      this.pitPlan = { compound: comp, repair: damaged ? ((c.dmg.rw > 0.35 || c.dmg.susp > 0.55) ? 'full' : 'wing') : 'none' };
    }
  }
}
