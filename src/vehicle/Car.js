// Vehicle model: four wheels on a sprung body (heave / pitch / roll, Chassis.js) with load-sensitive tyres of
// different sizes front and rear, a limited-slip diff, aero (downforce / drag / slipstream), modular damage and
// tyre wear. The yaw and lateral motion is planar. Frame: +x forward, lateral LEFT positive, yaw rate LEFT positive.
// Heading th: forward = (cos th, sin th) in world XZ. The player's form on the day (car.form, career/Morale.js) is
// the only driver term in the physics, and a gentle one: confidence a quarter of a per cent of grip at the extremes
// and a little brake force, racecraft how much downforce is lost in the dirty air behind another car.
import { TyreSet } from './Tyres.js';
import { CH, tyreCap, fitGrip, roadHeight } from './Chassis.js';
import { neutralForm } from '../career/Morale.js';
import { PERF_GAIN } from '../race/Roster.js';
import { TERRAIN } from '../world/Terrain.js';

// Figures of a current (2022-25 regulations) F1 car: 798 kg minimum mass, 3.6 m wheelbase, 2.0 m wide, 5.66 m long,
// 45.5 % of the mass on the front axle (the rules ask for at least 44.5 %), 44 % of the downforce: the aero balance
// sits a little behind the weight, so the faster the corner the more the rear has in hand (lifting at 280 km/h, the
// drag alone is a 0.5-1 g stop that takes load off the rear: the car has to stay planted through that).
// Grip comes out of the tyres (Chassis.js): about 5.5 g laterally at 290 km/h (Copse), 2.3 g at 100 km/h, and a
// 5 g stop on the tyres plus about 1 g of drag from top speed.
export const CAR = {
  mass: 798, Izz: 1150, lf: 1.96, lr: 1.64, wheelbase: 3.6, halfWidth: 1.0, halfLength: 2.83, cgH: 0.3,
  powerKW: 745, ersKW: 160, cdA: 1.35, clA: 4.5, aeroFrontShare: 0.44, rho: 1.18,
  brakeMax: 41000, brakeBias: 0.58, rolling: 300,
  gearTop: [68, 104, 140, 176, 212, 248, 290, 348].map((k) => k / 3.6), maxRpm: 12000, idleRpm: 4000,
};
// the whole car's effective friction / downforce (aLat ~ muBase (g + dfm v^2)): what the speed profile and the AI plan with
{ const f = fitGrip(CAR); CAR.muBase = f.mu; CAR.dfm = f.dfm; }
// wheel corners [x forward, y left] FL FR RL RR
const WX = [CAR.lf, CAR.lf, -CAR.lr, -CAR.lr], WY = [CH.tf / 2, -CH.tf / 2, CH.tr / 2, -CH.tr / 2];
const WK = [CH.kF, CH.kF, CH.kR, CH.kR], WC = [CH.cF, CH.cF, CH.cR, CH.cR];
const FS = [CAR.mass * 9.81 * CAR.lr / CAR.wheelbase / 2, 0, CAR.mass * 9.81 * CAR.lf / CAR.wheelbase / 2, 0]; FS[1] = FS[0]; FS[3] = FS[2];   // static corner loads
/** surface codes from Track.surface(): grip multiplier and rolling resistance (m/s^2 = a + b v) of each */
export const SURFACE = { ROAD: 0, KERB: 1, PAVED: 2, GRASS: 3, GRAVEL: 4 };
const SURF_GRIP = [1.0, 0.93, 0.82, 0.55, 0.5];     // paved run-off: grippy but dirty; grass: slippery; gravel: loose
const SURF_DRAG_A = [0, 0, 0, 0.6, 2.5], SURF_DRAG_B = [0, 0, 0, 0.02, 0.09];   // a gravel trap stops a car at about 1 g from speed
const G = 9.81;
/** normal impact speed (m/s) at the barrier above which the car is launched (about 85 km/h straight into it) */
export const LAUNCH_WALL = 32;
const _v2 = [0, 0], _t2 = [0, 0, 0], _t3 = [0, 0, 0];
// ---- rigid body of a wrecked car
const REST_H = 0.48;                       // height of the body centre above the ground when on its wheels
const INERTIA = [450, 1150, 1100];         // roll (about x, forward), yaw (y), pitch (z), kg m^2
/** contact points in the body frame (x forward, y up, z right): the four wheels first, then the tub and wings */
const RB_POINTS = [
  [1.8, -0.48, -0.85], [1.8, -0.48, 0.85], [-1.8, -0.48, -0.85], [-1.8, -0.48, 0.85],   // FL FR RL RR
  [2.7, -0.38, -0.95], [2.7, -0.38, 0.95], [-2.5, -0.38, -0.95], [-2.5, -0.38, 0.95],   // floor / wing corners
  [1.5, 0.12, -0.75], [1.5, 0.12, 0.75], [-1.6, 0.3, -0.7], [-1.6, 0.3, 0.7],           // sidepod and engine cover shoulders
  [-0.2, 0.49, 0], [2.95, -0.25, 0], [-2.4, 0.42, 0],                                    // roll hoop, nose tip, rear wing top
  [-1.2, 0.36, 0], [-2.3, 0.0, 0],                                                       // engine cover, gearbox / crash structure
];
const RB_REAR_WING = 14;
/** the same points for the front half of a car torn in two: the rear ones moved onto the torn face (x = -0.65) */
const RB_SPLIT = RB_POINTS.map((p, k) => (k >= 4 && p[0] < -0.9 ? [-0.65, Math.max(-0.38, Math.min(0.45, p[1])), Math.sign(p[2]) * Math.min(0.75, Math.abs(p[2]))] : p));
const BAR_H = [0, 0.85, 1.3, 4.2];          // barrier height by type (none, Armco, tyre wall, concrete wall + debris fence)
/**
 * Crash pulses: how long a hit takes (s) - what turns a velocity change into g. A concrete wall stops the car in
 * ~45 ms, Armco gives (~70 ms), a tyre wall absorbs (~100 ms); two cars' crash structures crush (~60 ms); the ground
 * in a roll ~50 ms, gravel ~90 ms. Calibrated on Grosjean's Bahrain 2020 crash (~50 m/s into Armco: 67 g).
 */
export const PULSE = { wall: 0.045, armco: 0.07, tyres: 0.1, building: 0.04, car: 0.06, ground: 0.05, gravel: 0.09 };
const BAR_KIND = ['ground', 'armco', 'tyres', 'wall'];
/**
 * g at which a car can be torn in two: from 60 g (15 %), more often than not from ~75 g. (Grosjean's car split at
 * 67 g; drivers walk away from 20-40 g hits most weekends - a T-bone at 120 km/h is ~34 g here, a 150 km/h glancing
 * wall hit ~22 g, a head-on one ~65 g.)
 */
export const SPLIT_G = 60;
/** rotate (x, y, z) by the unit quaternion q -> out */
function rot(q, x, y, z, out) {
  const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  const tx = 2 * (qy * z - qz * y), ty = 2 * (qz * x - qx * z), tz = 2 * (qx * y - qy * x);
  out[0] = x + qw * tx + (qy * tz - qz * ty); out[1] = y + qw * ty + (qz * tx - qx * tz); out[2] = z + qw * tz + (qx * ty - qy * tx);
  return out;
}
function rotInv(q, x, y, z, out) { _qc[0] = -q[0]; _qc[1] = -q[1]; _qc[2] = -q[2]; _qc[3] = q[3]; return rot(_qc, x, y, z, out); }
const _qc = [0, 0, 0, 1];
/** body-frame collision probe points [forward, left] (module constant: the physics step allocates nothing) */
const CORNERS = [[2.83, 0.95], [2.83, -0.95], [-2.83, 0.95], [-2.83, -0.95], [0, 1.0], [0, -1.0]];
/** the driver's form for every car but the player's (and the player's when none was given): every multiplier 1 */
const NF = Object.freeze(neutralForm());

let _id = 0;

export class Car {
  constructor(track, opts = {}) {
    this.id = _id++;
    this.track = track;
    this.name = opts.name || 'Driver';
    this.short = opts.short || 'DRV';
    this.team = opts.team || 'Team';
    this.color = opts.color || '#ffffff';
    this.isPlayer = !!opts.isPlayer;
    this.perf = 1 + ((opts.perf ?? 1.0) - 1) * PERF_GAIN;   // car performance index (power/aero scale, ~0.98..1.0): the team's, amplified (Roster PERF_GAIN)
    this.rating = opts.rating ?? 0.85;       // driver rating 0..1 (AI)
    this.number = opts.number || 0;

    // pose / motion
    this.x = 0; this.z = 0; this.th = 0;
    this.vLong = 0; this.vLat = 0; this.r = 0;
    this.ax = 0; this.ay = 0;                // body accelerations (m/s^2)
    this.steer = 0; this.throttle = 0; this.brake = 0; this.handbrake = 0; this.ers = 0;
    this.gear = 1; this.rpm = CAR.idleRpm;
    this.ersEnergy = 1;

    // track state
    this.trackIdx = 0; this.s = 0; this.d = 0; this.prevS = 0;
    this.lap = 0; this.lapDist = 0; this.totalDist = 0;
    this.lapTimes = []; this.lapStart = 0; this.bestLap = Infinity; this.currentLapTime = 0;
    this.sector = 0; this.sectors = [0, 0, 0];
    this.offTrack = false; this.onKerb = false; this.surf = 0; this.surfGrip = 1;
    this.slipstream = 0; this.dirtyAir = 0;
    // chassis: body heave (m, up), pitch (rad, nose up), roll (rad, left side up) and their rates; per wheel FL FR RL
    // RR the surface, the road height it is following, spring deflection and rate, vertical load
    this.hv = 0; this.hvd = 0; this.pt = 0; this.ptd = 0; this.rl = 0; this.rld = 0;
    this.wh = { surf: new Uint8Array(4), u: new Float32Array(4), def: new Float32Array(4), defd: new Float32Array(4), fz: Float32Array.from(FS), fx: new Float32Array(4), fy: new Float32Array(4), sat: new Float32Array(4), cap: new Float32Array(4), lift: new Float32Array(4), dw: new Float32Array(4) };

    // damage
    this.dmg = { fwL: 0, fwR: 0, rw: 0, susp: 0, eng: 0 };
    this.suspSide = 1; this.engTemp = 0.3;
    this.retired = false; this.retireReason = '';
    this.dmgCooldown = 0;
    this.lastImpact = 0;

    // tyres
    this.tyres = new TyreSet(opts.compound || 'SOFT', opts.raceLaps || 5, track.length);
    this.raceLaps = opts.raceLaps || 5;
    this.slip = 0;

    // flags
    this.ghost = 0;                 // seconds of collision-free ghost mode
    this.stoppedTime = 0;
    this.inPit = false; this.pitRequested = false; this.pitStops = 0;
    this.pit = null; this.manualPit = false; this.pitLane = false; this.pitLimiter = false; this.pitU = 0; this.pitLat = 0; this.pitI = 0; this.pitEntered = false; this.pitExited = false;
    this.held = false;              // grid hold (engine revving allowed, no motion)
    this.penalties = 0;             // seconds
    this.penaltyServed = 0;
    this.jumpStart = false;
    this.finished = false; this.finishTime = 0;
    this.assists = opts.assists || { tc: true, abs: true };
    this.wetness = 0;
    this.hist = [];                 // recent lateral offsets for AI
    // big accidents: airborne rigid body (height y of the body above its resting height, pitch / roll and their
    // rates, world velocity), then a wreck at rest
    this.air = false; this.wreck = false; this.y = 0; this.vy = 0; this.pitch = 0; this.roll = 0; this.wp = 0; this.wr = 0; this.wvx = 0; this.wvz = 0;
    this.events = [];               // impacts for the renderer (debris, mangling)
    this.p = null; this.v = null; this.q = null; this.w = null; this.wheelsOn = [true, true, true, true];   // rigid body (big accidents only)
    this.cleared = false;           // a stopped retired car the marshals have removed
  }

  // --------------------------------------------------------------------------
  placeOnTrack(s, d, speed = 0) {
    const f = this.track.sample(s, d);
    this.x = f.x; this.z = f.z; this.th = Math.atan2(f.tz, f.tx);
    this.vLong = speed; this.vLat = 0; this.r = 0; this.s = f.s; this.prevS = f.s; this.d = d;
    this.trackIdx = this.track.idxAtS(s);
    this.gear = speed > 1 ? this.gearFor(speed) : 1;
    this.hv = this.hvd = this.pt = this.ptd = this.rl = this.rld = 0; this.wh.u.fill(0);
  }
  gearFor(v) { let g = 1; while (g < 8 && v > CAR.gearTop[g - 1] * 0.97) g++; return g; }

  get speed() { return Math.hypot(this.vLong, this.vLat); }
  get speedKmh() { return this.speed * 3.6; }
  get fx() { return Math.cos(this.th); }
  get fz() { return Math.sin(this.th); }
  worldVel() { const c = Math.cos(this.th), s = Math.sin(this.th); return [this.vLong * c + this.vLat * s, this.vLong * s - this.vLat * c]; }

  // damage-derived multipliers
  aeroFront() { return Math.max(0.1, 1 - 0.45 * this.dmg.fwL - 0.45 * this.dmg.fwR); }
  aeroRear() { return Math.max(0.0, 1 - this.dmg.rw); }
  enginePower() { return this.perf * (this.puLoss ? 0.93 : 1) * (1 - 0.35 * this.dmg.eng) * (1 - 0.3 * Math.max(0, this.engTemp - 0.8)) * (1 + 0.12 * (this.band || 0)); }
  damageTotal() { const d = this.dmg; return Math.min(1, (d.fwL + d.fwR) * 0.25 + d.rw * 0.3 + d.susp * 0.4 + d.eng * 0.3); }

  /**
   * Apply crash damage. bx forward / by left position of the impact in body frame, vImp normal speed (m/s).
   * The rear wing sits high and behind the crash structure: only a solid rear hit damages it, a tap or a side
   * impact does not (losing it ends a race, so it takes a real accident).
   */
  applyImpact(bx, by, vImp, zone = null) {
    if (this.dmgCooldown > 0 || this.ghost > 0) return 0;
    // (a touch under ~7 km/h into the bodywork leaves no mark; it takes a big hit to wreck a car outright)
    const sev = Math.max(0, Math.min(1, (vImp - 2) / 26));
    if (sev <= 0) return 0;
    const d = this.dmg;
    // a car-to-car touch knows what it touched: a wheel takes it in the suspension (a bent track rod pulls the car
    // to one side), a sidepod shrugs off a rub, a wing loses its endplate
    if (zone === 'wheel') { d.susp += sev * 0.6; this.suspSide = by >= 0 ? 1 : -1; if (bx < 0 && sev > 0.5) d.rw += (sev - 0.5) * 0.4; }
    else if (zone === 'side') { d.susp += Math.max(0, sev - 0.15) * 0.6; this.suspSide = by >= 0 ? 1 : -1; if (sev > 0.6) d.eng += (sev - 0.6) * 0.5; }
    else if (zone === 'wing') { if (by > 0) d.fwL += sev * 1.5; else d.fwR += sev * 1.5; }
    else if (bx > 1.2) {
      if (by > 0.25) d.fwL += sev * 1.3; else if (by < -0.25) d.fwR += sev * 1.3; else { d.fwL += sev * 0.8; d.fwR += sev * 0.8; }
      if (sev > 0.45) { d.susp += (sev - 0.45) * 1.4; d.eng += (sev - 0.45) * 0.7; this.suspSide = by >= 0 ? 1 : -1; }
    } else if (bx < -1.2) {
      d.rw += Math.max(0, sev - 0.3) * 0.9; d.eng += sev * 0.35; if (sev > 0.6) d.susp += (sev - 0.6);
    } else {
      d.susp += sev * 0.7; this.suspSide = by >= 0 ? 1 : -1;
      if (by > 0) d.fwL += sev * 0.35; else d.fwR += sev * 0.35;
      if (sev > 0.75) d.rw += (sev - 0.75) * 0.5;
    }
    for (const k in d) d[k] = Math.min(1, d[k]);
    this.dmgCooldown = 0.4; this.lastImpact = sev;
    if (d.susp >= 0.97 && !this.retired) { this.retired = true; this.retireReason = 'Terminal suspension damage'; }
    return sev;
  }

  // ---- rigid-body helpers (world frame x/z; body frame: x forward, y left) -------------------------------
  /** world velocity of the body point at world (px, pz) -> out[0], out[1] */
  velAt(px, pz, out) {
    const c = Math.cos(this.th), s = Math.sin(this.th);
    const rx = (px - this.x) * c + (pz - this.z) * s, ry = (px - this.x) * s - (pz - this.z) * c;
    const bx = this.vLong - this.r * ry, by = this.vLat + this.r * rx;
    out[0] = bx * c + by * s; out[1] = bx * s - by * c; return out;
  }
  /** inverse effective mass of the body at world point (px, pz) along the world direction (nx, nz) */
  invMassAt(px, pz, nx, nz, izzK = 1) {
    const c = Math.cos(this.th), s = Math.sin(this.th);
    const rx = (px - this.x) * c + (pz - this.z) * s, ry = (px - this.x) * s - (pz - this.z) * c;
    const nbx = nx * c + nz * s, nby = nx * s - nz * c, rn = rx * nby - ry * nbx;
    return 1 / CAR.mass + rn * rn / (CAR.Izz * izzK);
  }
  /** apply the world impulse (jx, jz) at the world point (px, pz) */
  impulseAt(px, pz, jx, jz, izzK = 1) {
    const c = Math.cos(this.th), s = Math.sin(this.th);
    const rx = (px - this.x) * c + (pz - this.z) * s, ry = (px - this.x) * s - (pz - this.z) * c;
    const jbx = jx * c + jz * s, jby = jx * s - jz * c;
    this.vLong += jbx / CAR.mass; this.vLat += jby / CAR.mass; this.r += (rx * jby - ry * jbx) / (CAR.Izz * izzK);
  }
  /** a wheel struck at (bx forward, by left) in the body frame bounces off the road for a moment (0..1) */
  bounceWheel(bx, by, amount) { const k = (bx > 0 ? 0 : 2) + (by > 0 ? 0 : 1); this.wh.lift[k] = Math.min(1, Math.max(this.wh.lift[k], amount)); }

  // ---- contacts in 3D, whichever state the car is in (on its wheels, or a tumbling / resting rigid body) -------
  get rigid() { return this.air || this.wreck; }
  /** the two spheres (radius 1.05 m) along the body that stand for the car in car-to-car contact -> out[0..5] */
  bodySpheres(out) {
    if (this.rigid && this.q) {
      const f = rot(this.q, 1, 0, 0, _t3), p = this.p;
      out[0] = p[0] + f[0] * 1.45; out[1] = p[1] + f[1] * 1.45; out[2] = p[2] + f[2] * 1.45;
      out[3] = p[0] - f[0] * 1.45; out[4] = p[1] - f[1] * 1.45; out[5] = p[2] - f[2] * 1.45;
    } else {
      const c = Math.cos(this.th), s = Math.sin(this.th), y = REST_H + (this.hv || 0);
      out[0] = this.x + c * 1.45; out[1] = y; out[2] = this.z + s * 1.45;
      out[3] = this.x - c * 1.45; out[4] = y; out[5] = this.z - s * 1.45;
    }
    return out;
  }
  /** world velocity (x, y, z) of the body point at world (px, py, pz) */
  pointVel3(px, py, pz, out) {
    if (this.rigid && this.q) {
      const v = this.v, w = this.w, rx = px - this.p[0], ry = py - this.p[1], rz = pz - this.p[2];
      out[0] = v[0] + w[1] * rz - w[2] * ry; out[1] = v[1] + w[2] * rx - w[0] * rz; out[2] = v[2] + w[0] * ry - w[1] * rx;
    } else { this.velAt(px, pz, _v2); out[0] = _v2[0]; out[1] = 0; out[2] = _v2[1]; }
    return out;
  }
  /** inverse effective mass at a world point along the world direction n (a car on its wheels does not move vertically) */
  invMass3(px, py, pz, nx, ny, nz) {
    if (this.rigid && this.q) return this._rbK(px - this.p[0], py - this.p[1], pz - this.p[2], nx, ny, nz);
    const h = Math.hypot(nx, nz); if (h < 1e-6) return 0;
    return this.invMassAt(px, pz, nx / h, nz / h) * h * h;
  }
  /** apply the world impulse j at a world point; a wreck at rest that is hit comes alive again */
  impulse3(px, py, pz, jx, jy, jz) {
    if (this.rigid && this.q) {
      if (this.wreck) { this.wreck = false; this.air = true; this.restT = 0; }
      this._rbApply(px - this.p[0], py - this.p[1], pz - this.p[2], jx, jy, jz);
    } else this.impulseAt(px, pz, jx, jz);
  }

  /**
   * A crash pulse: the velocity change dv (m/s) the hit gave the car over tau seconds (PULSE). Records the g, the
   * car's peak g and (with gLog set, the tests) every pulse over 3 g; returns the g.
   */
  pulse(dv, tau, kind) {
    const g = dv / (tau * 9.81);
    if (g > (this.peakG || 0)) { this.peakG = g; this.peakDv = dv; }   // (and the speed lost in that hit: the severity, main.js crashSeverity)
    // what a pulse does to the car itself: from 15 g the suspension (a 55 g hit leaves nothing of it), from 25 g the
    // engine and gearbox - whatever the car hit, on its wheels or in the air
    const d = this.dmg;
    if (g > 15) { d.susp = Math.min(1, d.susp + (g - 15) / 40); if (!this.air) this.suspSide = this.suspSide || 1; }
    if (g > 25) d.eng = Math.min(1, d.eng + (g - 25) / 60);
    if (!this.air && !this.retired && d.susp >= 0.97) { this.retired = true; this.retireReason = 'Accident damage'; }
    this.lastG = g; this.pulseG = Math.max(this.pulseG || 0, g);   // (the hardest since the replay last looked: race/Replay.js)
    if (g >= 6 && this.crashLog) { this.crashLog.push({ g, kind, x: this.x, z: this.z }); if (this.crashLog.length > 16) this.crashLog.shift(); }   // (the player's: CrashCam)
    if (this.gLog && g >= 3) this.gLog.push({ t: this._clock || 0, kind, g: +g.toFixed(1), dv: +dv.toFixed(1), air: this.air });
    return g;
  }
  /** an impact the renderer turns into debris (headless runs never read it: the queue is capped) */
  emit(kind, x, z, sev) {
    if (this.events.length > 12) this.events.shift();
    const [vx, vz] = this.air ? [this.wvx, this.wvz] : this.worldVel();
    this.events.push({ kind, x, z, sev, vx, vz });
  }

  // ---- big accidents: a 3D rigid body ------------------------------------------------------------------------
  // Body frame as the mesh: x forward, y up, z to the right. State: centre p, velocity v, orientation q (x, y, z, w),
  // angular velocity w (world frame). No scripted motion: every flight, roll and slide comes out of the impulse that
  // started it, gravity, and contact impulses with friction at the body's contact points (wheels, the corners of the
  // tub, nose, roll hoop, rear wing) against the ground and the barriers.

  /** world position (out) of the body point (lx, ly, lz) */
  _rbPoint(lx, ly, lz, out) { rot(this.q, lx, ly, lz, out); out[0] += this.p[0]; out[1] += this.p[1]; out[2] += this.p[2]; return out; }
  /** inverse world inertia applied to (x, y, z) -> out */
  _invI(x, y, z, out) { rotInv(this.q, x, y, z, out); out[0] /= INERTIA[0]; out[1] /= INERTIA[1]; out[2] /= INERTIA[2]; return rot(this.q, out[0], out[1], out[2], out); }
  /** effective inverse mass for an impulse along n at offset r (world) from the centre */
  _rbK(rx, ry, rz, nx, ny, nz) {
    const t = this._invI(ry * nz - rz * ny, rz * nx - rx * nz, rx * ny - ry * nx, _t3);
    const bx = t[1] * rz - t[2] * ry, by = t[2] * rx - t[0] * rz, bz = t[0] * ry - t[1] * rx;
    return 1 / CAR.mass + bx * nx + by * ny + bz * nz;
  }
  /** apply the world impulse j at offset r from the centre */
  _rbApply(rx, ry, rz, jx, jy, jz) {
    const v = this.v, w = this.w, M = CAR.mass; v[0] += jx / M; v[1] += jy / M; v[2] += jz / M;
    const t = this._invI(ry * jz - rz * jy, rz * jx - rx * jz, rx * jy - ry * jx, _t3); w[0] += t[0]; w[1] += t[1]; w[2] += t[2];
  }

  /**
   * A big accident. The car becomes a free rigid body carrying its current motion, and receives the impulse of the
   * hit (world J at the world contact point P): a wheel climbing a barrier or another car's tyre gets a vertical
   * impulse at that wheel, and where it lands relative to the centre of mass decides the flight - nose up, barrel
   * roll, a flat spin along the wall. Parts near the impact come off.
   */
  launch(Px, Py, Pz, dx, dy, dz) {
    if (this.air || this.wreck) return;
    const [wx, wz] = this.worldVel(), a = -this.th;
    this.p = [this.x, REST_H + this.y, this.z]; this.v = [wx, this.vy || 0, wz];
    this.q = [0, Math.sin(a / 2), 0, Math.cos(a / 2)]; this.w = [0, this.r, 0]; this.restT = 0;
    this.air = true; this.wheelsOn = [true, true, true, true]; this._flew = true;
    this.flightTop = this.flightBase = this.p[1]; this.flipped = false;   // (how high it flies, whether it goes over: _settle)
    // (dx, dy, dz): the velocity change the hit gives the contact point; the impulse that does it is dv / K
    const dv = Math.hypot(dx, dy, dz) || 1e-6, ux = dx / dv, uy = dy / dv, uz = dz / dv, rx = Px - this.p[0], ry = Py - this.p[1], rz = Pz - this.p[2];
    const J = dv / this._rbK(rx, ry, rz, ux, uy, uz), Jx = ux * J, Jy = uy * J, Jz = uz * J;
    this.hardest = Math.max(this.hardest || 0, dv);   // (the hardest hit this car has taken: injuries, RaceDirector)
    this._rbApply(rx, ry, rz, Jx, Jy, Jz);
    // (nothing decided yet: no retirement, no damage by rule - the flight, the landing and the hits along the way decide
    //  whether the car drives on, see _airStep)
    this.throttle = 0; this.brake = 0; this.ers = 0; this.drs = false;
    if (this.crashLog) this.crashLog.push({ g: 0, kind: 'launch', x: this.x, z: this.z });
    this.emit('launch', Px, Pz, 1);
    this._breakNear(Px, Py, Pz, dv, true);
  }
  /**
   * Torn in two behind the survival cell (the hardest hits): engine, gearbox, rear wheels and wing go their own way
   * (CarMesh.split -> world/Chunks.js); the tub carries on as this body. Mostly it catches fire.
   */
  splitApart() {
    if (this.split || !this.air) return; this.split = true;
    this.wheelsOn[2] = this.wheelsOn[3] = false; this.dmg.rw = 1; this.dmg.eng = 1;
    this.retired = true; this.retireReason = 'Accident';
    this.emit('split', this.x, this.z, 1);
    if (Math.random() < 0.7) this.emit('fire', this.x, this.z, 1);
  }
  /** parts within reach of a hit of strength dv (m/s) come off: wheels, front wing, rear wing */
  _breakNear(px, py, pz, dv, first = false) {
    const q = _t2;
    for (let k = 0; k < 4; k++) {
      if (!this.wheelsOn[k]) continue;
      const [lx, ly, lz] = RB_POINTS[k]; this._rbPoint(lx, ly, lz, q);
      const dist = Math.hypot(q[0] - px, q[1] - py, q[2] - pz);
      if ((dist < 1.2 && dv > 9 && Math.random() < 0.35) || (first && dist < 1.6 && Math.random() < Math.min(0.5, dv / 20))) { this.wheelsOn[k] = false; this.emit('wheel' + k, q[0], q[2], 1); }
    }
    const d = this.dmg;
    this._rbPoint(2.9, -0.3, 0, q); if (d.fwL < 1 && (Math.hypot(q[0] - px, q[1] - py, q[2] - pz) < 2 || first)) { d.fwL = 1; d.fwR = 1; }
    this._rbPoint(-2.4, 0.42, 0, q); if (d.rw < 0.85 && Math.hypot(q[0] - px, q[1] - py, q[2] - pz) < 1.6 && dv > 3) d.rw = 1;
  }

  /** one step of the free body: gravity, drag, contacts with the ground and the barriers, then rest detection */
  _airStep(dt, world) {
    const p = this.p, v = this.v, w = this.w, q = this.q, M = CAR.mass, tr = this.track;
    this._clock = (this._clock || 0) + dt;
    // gravity, bluff-body drag on the tumbling car, a little angular damping (air, bodywork scraping)
    v[1] -= 9.81 * dt;
    const sp = Math.hypot(v[0], v[1], v[2]), kd = 0.5 * CAR.rho * 1.6 * sp / M * dt;
    v[0] -= v[0] * kd; v[1] -= v[1] * kd; v[2] -= v[2] * kd;
    const wd = Math.max(0, 1 - 0.15 * dt); w[0] *= wd; w[1] *= wd; w[2] *= wd;
    p[0] += v[0] * dt; p[1] += v[1] * dt; p[2] += v[2] * dt;
    // orientation: q += dt/2 * (w, 0) q
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], h = 0.5 * dt;
    q[0] += h * (w[0] * qw + w[1] * qz - w[2] * qy); q[1] += h * (w[1] * qw + w[2] * qx - w[0] * qz);
    q[2] += h * (w[2] * qw + w[0] * qy - w[1] * qx); q[3] -= h * (w[0] * qx + w[1] * qy + w[2] * qz);
    const ql = Math.hypot(q[0], q[1], q[2], q[3]); q[0] /= ql; q[1] /= ql; q[2] /= ql; q[3] /= ql;
    // where on the circuit the body is (the surface decides the friction; the barrier frame comes from here)
    const tq = tr.nearest(p[0], p[2], this.trackIdx, this._q || (this._q = {}));
    this.trackIdx = tq.i; this.s = tq.s; this.d = tq.d;
    const i = tq.i, loose = tr.surface(i, tq.d) >= 3;
    const wallL = tr.barL[i] ? tr.wallL[i] : Infinity, wallR = tr.barR[i] ? tr.wallR[i] : Infinity;
    const hL = tr.barrierHeight(i, 1), hR = tr.barrierHeight(i, -1);   // (as tall as what is drawn: a concrete wall and a catch fence 4 m+, a tyre wall 1.3, Armco 0.85)
    const nxT = tr.nx[i], nzT = tr.nz[i], pxT = tr.px[i], pzT = tr.pz[i];
    // (the body's centre beyond a barrier: it has gone over it, and lands on the far side - held out, not pulled back)
    const dcC = (p[0] - pxT) * nxT + (p[2] - pzT) * nzT, outC = Math.abs(dcC) > (dcC > 0 ? wallL : wallR);
    let lift = 0, hard = 0, hx = 0, hy = 0, hz = 0;
    const v0x = v[0], v0y = v[1], v0z = v[2]; let hitKind = loose ? 'gravel' : 'ground';   // (the step's contact pulse)
    const c = _t2;
    const PTS = this.split ? RB_SPLIT : RB_POINTS;
    for (let k = 0; k < PTS.length; k++) {
      if (k < 4 && !this.wheelsOn[k]) continue;                       // only parts still on the car touch anything
      if (k === RB_REAR_WING && this.dmg.rw >= 0.85) continue;
      const pt = PTS[k]; this._rbPoint(pt[0], pt[1], pt[2], c);       // (torn in two: the back half is a body of its own)
      const rx = c[0] - p[0], ry = c[1] - p[1], rz = c[2] - p[2];
      // ---- ground
      if (c[1] < 0) {
        lift = Math.max(lift, -c[1]);
        const vy = v[1] + (w[2] * rx - w[0] * rz);                  // vertical velocity of the point (v + w x r)
        if (vy < 0) {
          const e = vy < -3 ? 0.3 : 0, j = -(1 + e) * vy / this._rbK(rx, ry, rz, 0, 1, 0);
          this._rbApply(rx, ry, rz, 0, j, 0);
          if (-vy > hard) { hard = -vy; hx = c[0]; hy = c[1]; hz = c[2]; }
          // Coulomb friction against the sliding: a wheel rolls on (low), the tub scrapes, gravel and grass dig in
          const tvx = v[0] + (w[1] * rz - w[2] * ry), tvz = v[2] + (w[0] * ry - w[1] * rx), tv = Math.hypot(tvx, tvz);
          if (tv > 1e-4) {
            const mu = (k < 4 ? 0.55 : 0.8) * (loose ? 1.4 : 1), ux = -tvx / tv, uz = -tvz / tv;   // a wreck's wheels are bent and braked by wreckage
            const jt = Math.min(mu * j, tv / this._rbK(rx, ry, rz, ux, 0, uz));
            this._rbApply(rx, ry, rz, ux * jt, 0, uz * jt);
          }
        }
      }
      // ---- buildings and grandstands: solid, like a concrete wall
      const O = world?.obstacles, oh = this._oh || (this._oh = {});
      if (O && O.hit(c[0], c[2], c[1], oh)) {
        p[0] += oh.nx * oh.pen; p[2] += oh.nz * oh.pen;
        const vn = (v[0] + (w[1] * rz - w[2] * ry)) * oh.nx + (v[2] + (w[0] * ry - w[1] * rx)) * oh.nz;
        if (vn < 0) { const j = -1.2 * vn / this._rbK(rx, ry, rz, oh.nx, 0, oh.nz); this._rbApply(rx, ry, rz, oh.nx * j, 0, oh.nz * j); if (-vn > hard) { hard = -vn; hx = c[0]; hy = c[1]; hz = c[2]; } hitKind = 'building'; }
      }
      // ---- barriers (vertical, as tall as their type): the same impulse against the barrier's normal
      {
        const dc = (c[0] - pxT) * nxT + (c[2] - pzT) * nzT, side = dc > 0 ? 1 : -1, wall = side > 0 ? wallL : wallR;
        const through = outC ? Math.sign(dc) === Math.sign(dcC) && Math.abs(dc) < wall : Math.abs(dc) > wall;
        if (c[1] < (side > 0 ? hL : hR) && through) {
          const sg = outC ? -1 : 1, nx = -nxT * side * sg, nz = -nzT * side * sg, pen = outC ? wall - Math.abs(dc) : Math.abs(dc) - wall;
          p[0] += nx * pen; p[2] += nz * pen;
          const vn = (v[0] + (w[1] * rz - w[2] * ry)) * nx + (v[2] + (w[0] * ry - w[1] * rx)) * nz;
          if (vn < 0) {
            const j = -1.2 * vn / this._rbK(rx, ry, rz, nx, 0, nz);
            this._rbApply(rx, ry, rz, nx * j, 0, nz * j);
            if (-vn > hard) { hard = -vn; hx = c[0]; hy = c[1]; hz = c[2]; }
            hitKind = BAR_KIND[side > 0 ? tr.barL[i] : tr.barR[i]] || 'wall';
          }
        }
      }
    }
    if (lift > 0) p[1] += lift * 0.8;                               // push out of the ground (keeps contacts stable)
    if (hard > 4) { this.emit('hit', hx, hz, Math.min(1, hard / 12)); this._breakNear(hx, hy, hz, hard); }
    // the flight: how high, and whether it has been over (on its side or its roof)
    this.flightTop = Math.max(this.flightTop ?? p[1], p[1]);
    if (1 - 2 * (q[0] * q[0] + q[2] * q[2]) < 0.25) this.flipped = true;
    // the step's crash pulse (a velocity change of over 1 m/s in one step is an impact, not scraping along): the g it
    // means, the damage it does to the car, and the hardest ones tear it in two
    const dvC = Math.hypot(v[0] - v0x, v[1] - v0y, v[2] - v0z);
    if (dvC > 1) {
      const g = this.pulse(dvC, PULSE[hitKind], hitKind);
      if (!this.split && g > SPLIT_G && Math.random() < Math.min(0.8, 0.15 + (g - SPLIT_G) / 40)) this.splitApart();
    }
    // legacy pose for everything else (minimap, cameras, standings)
    const f = rot(q, 1, 0, 0, _t3);
    this.x = p[0]; this.z = p[2]; this.y = p[1] - REST_H; this.th = Math.atan2(f[2], f[0]);
    this.wvx = v[0]; this.wvz = v[2]; this.vy = v[1]; this.r = w[1];
    const cs = Math.cos(this.th), sn = Math.sin(this.th);
    this.vLong = v[0] * cs + v[2] * sn; this.vLat = v[0] * sn - v[2] * cs;
    // at rest: wherever and however it ended up (on its wheels, its side, its roof, against a barrier)
    if (Math.hypot(v[0], v[1], v[2]) < 0.35 && Math.hypot(w[0], w[1], w[2]) < 0.35) this.restT += dt; else this.restT = 0;
    if (this.restT > 0.6) this._settle();
  }
  /**
   * The car has come to rest after a big accident. On its wheels - all four still on, the suspension still in one
   * piece, the car in one piece - it drives on (damaged); otherwise that is the end of its race, for the reason the
   * crash gave it. Nothing here is decided by rule beforehand.
   */
  _settle() {
    const v = this.v, w = this.w, up = rot(this.q, 0, 1, 0, _t3)[1];
    v[0] = v[1] = v[2] = 0; w[0] = w[1] = w[2] = 0; this.vLong = 0; this.vLat = 0; this.r = 0; this.vy = 0; this.air = false;
    const wheels = this.wheelsOn.every(Boolean), d = this.dmg;
    // (a car that flew - its body more than a metre up - or went over on its side or roof does not drive on, whatever it
    //  lands on: the floor, the suspension and the driver have all taken it)
    const flew = (this.flightTop ?? 0) - (this.flightBase ?? 0) > 1.0 || this.flipped;
    if (up > 0.8 && wheels && !this.split && !flew && d.susp < 0.9 && !this.retired) {
      // back on its wheels: a car again (x, z and heading from the body; the springs settle it)
      this.x = this.p[0]; this.z = this.p[2]; this.y = 0; this.hv = this.hvd = this.pt = this.ptd = this.rl = this.rld = 0;
      this.p = null; this.q = null; this.v = null; this.w = null; this.wreck = false; this.gear = 1; this.stoppedTime = 0;
      this.emit('landed', this.x, this.z, 0);
      return;
    }
    this.wreck = true;
    if (!this.retired) {
      this.retired = true; this.throttle = 0; this.brake = 0; this.ers = 0;
      this.retireReason = this.split ? 'Accident' : up < 0.2 ? 'Accident (upside down)' : !wheels ? 'Accident (wheel torn off)' : this.flipped ? 'Accident (rolled)' : flew ? 'Accident (launched)' : 'Accident (suspension)';
    }
    this.emit('mangle', this.x, this.z, 1);
  }

  repair(depth) {
    if (depth === 'wing' || depth === 'full') { this.dmg.fwL = 0; this.dmg.fwR = 0; }
    if (depth === 'full') { this.dmg.susp = 0; this.dmg.rw = 0; this.dmg.eng = Math.min(this.dmg.eng, 0.3); this.engTemp = 0.3; }
  }
  fitTyres(compound) { this.tyres = new TyreSet(compound, this.raceLaps, this.track.length); this.tyres.wearMul = this.wearMul || 1; this.tyres.temp = 0.3; this.punct = null; this.punctP = 0; this.punctShred = false; }

  // --------------------------------------------------------------------------
  /** Fixed-step physics. */
  step(dt, world) {
    const T = CAR; const m = T.mass;
    this.dmgCooldown = Math.max(0, this.dmgCooldown - dt);
    if (this.ghost > 0) this.ghost -= dt;
    if (this.wreck) return;                                       // at rest after a big accident
    if (this.air) { this._airStep(dt, world); return; }
    if (this.retired) { this.throttle = 0; this.brake = 0.4; }
    if (this.engineDead) { this.throttle = 0; this.ers = 0; }   // (a failure: no drive - Failures.js)

    const v = this.vLong, absV = Math.abs(v), spd = this.speed;
    const tyre = this.tyres;
    const wet = this.wetness;

    // ---- aero
    const q = 0.5 * T.rho * spd * spd;
    const ss = this.slipstream;
    // (the player's form - FORM.grip, .pBrake, .follow; the AI's form works through its driving, AIDriver.js)
    const F = (this.isPlayer && this.form) || NF;
    // sideways the floor and wings stall: a car at 30 degrees of yaw keeps ~3/4 of its downforce, one travelling
    // sideways or backwards almost none, and it is a far bigger brick in the air (spins slide a long way, on light tyres)
    // (in the dirty air behind another car: up to 22 % gone, a little less for a driver who places the car well)
    const yawA = Math.atan2(Math.abs(this.vLat), this.vLong), cy = Math.cos(Math.min(Math.PI / 2, yawA));
    const df = q * T.clA * this.perf * (1 - 0.22 * ss * F.follow) * (yawA < Math.PI / 2 ? cy * cy : 0.05);
    const dfF = df * T.aeroFrontShare * this.aeroFront();
    const dfR = df * (1 - T.aeroFrontShare) * this.aeroRear() * (this.drs ? 0.8 : 1);   // (DRS open: the flap stalls the rear wing)
    const sy = Math.sin(Math.min(Math.PI / 2, yawA));
    const dragCoef = T.cdA * (1 + 0.15 * (this.dmg.fwL + this.dmg.fwR) + 0.1 * this.dmg.rw) * (1 - 0.38 * ss) * (1 + 1.2 * sy * sy) * (this.drs ? 0.82 - (this.drsGain || 0) : 1) * (1 - 0.07 * (this.band || 0));   // (drsGain: a developed DRS, career tech tree)
    const L = T.wheelbase, W = this.wh, Fz = W.fz, fx = W.fx, fy = W.fy, sat = W.sat;

    // ---- the road under each wheel (from last step's track position): what it is and how high it is. A wheel
    //      follows a step (the kerb's edge) over the tyre's envelopment time, not instantly.
    const tr = this.track, ti = this.trackIdx, c0 = Math.cos(this.th), s0 = Math.sin(this.th);
    const tpx = tr.px[ti], tpz = tr.pz[ti], tnx = tr.nx[ti], tnz = tr.nz[ti], ttx = tr.tx[ti], ttz = tr.tz[ti];
    const fEnv = Math.min(1, dt / CH.envTau);
    let dragA = 0, dragB = 0, kerb = false;
    for (let k = 0; k < 4; k++) {
      const wx = this.x + WX[k] * c0 + WY[k] * s0 - tpx, wz = this.z + WX[k] * s0 - WY[k] * c0 - tpz;
      const dW = wx * tnx + wz * tnz, sW = this.s + wx * ttx + wz * ttz;
      W.dw[k] = dW;   // (the stewards read it: all four wheels over the white line is a track-limits strike)
      const sf = this.pitLane ? 0 : tr.surface(ti, dW);
      W.surf[k] = sf; if (sf === 1) kerb = true;
      W.u[k] += ((sf ? roadHeight(tr, ti, dW, sW, sf) : 0) - W.u[k]) * fEnv;
      dragA += SURF_DRAG_A[sf] * 0.25; dragB += SURF_DRAG_B[sf] * 0.25;   // grass and gravel drag the car down, wheel by wheel
    }
    this.onKerb = kerb;
    // drag and rolling resistance oppose the motion, whichever way the car is travelling (a car sliding sideways
    // through gravel is dragged down sideways)
    const Fdrag = q * dragCoef + (T.rolling + m * (dragA + dragB * spd)) * Math.min(1, spd);

    // ---- sprung body: each corner's spring, damper and anti-roll bar against the road under its wheel. The loads
    //      the tyres get are these forces: weight transfer takes the time the body takes to pitch and roll, a kerb
    //      loads one wheel and can throw it off the ground. (Semi-implicit Euler: stable at 120 Hz for ~4-6 Hz modes.)
    for (let k = 0; k < 4; k++) {
      W.def[k] = W.u[k] - (this.hv + WX[k] * this.pt + WY[k] * this.rl);
      W.defd[k] = -(this.hvd + WX[k] * this.ptd + WY[k] * this.rld);
    }
    let sumF = 0, momP = 0, momR = 0;
    for (let k = 0; k < 4; k++) {
      const bar = (k < 2 ? CH.arbF : CH.arbR) * (W.def[k] - W.def[k ^ 1]);
      Fz[k] = Math.max(0, FS[k] + WK[k] * W.def[k] + WC[k] * W.defd[k] + bar);
      sumF += Fz[k]; momP += WX[k] * Fz[k]; momR += WY[k] * Fz[k];
    }
    if (this.held) { this.hvd *= 0.9; this.ptd *= 0.9; this.rld *= 0.9; }
    this.hvd += ((sumF - m * G - dfF - dfR) / m) * dt;
    this.ptd += ((momP - dfF * T.lf + dfR * T.lr + m * this.ax * T.cgH) / CH.Ipitch) * dt;   // braking: nose down
    this.rld += ((momR + m * this.ay * T.cgH) / CH.Iroll) * dt;                              // turning left: rolls onto the right wheels
    this.hv += this.hvd * dt; this.pt += this.ptd * dt; this.rl += this.rld * dt;

    // ---- tyres: each one's grip from its own load (load-sensitive, the rears a third wider) and its own surface
    const wetSurface = 1 - 0.1 * wet;
    let grip = tyre.grip(wet) * wetSurface * (1 - 0.22 * this.dmg.susp);
    if (this.perf) grip *= 0.985 + 0.015 * this.perf;
    if (this.band) grip *= 1 + 0.012 * this.band;   // (speed banding: RaceDirector.speedBands)
    if (this.aiGrip) grip *= this.aiGrip;   // (an AI car at a circuit that gives it more: AIDriver)
    grip *= F.grip;   // (confidence: the last fraction of the tyre a driver dares to use)
    const gripFW = 1 - 0.06 * (this.dmg.fwL + this.dmg.fwR);

    // ---- steering
    const dMax = Math.max(0.055, 0.38 * (1 - spd / 118));
    const bias = this.dmg.susp * 0.06 * this.suspSide;
    const delta = this.steer * dMax + bias;

    // ---- each tyre in its own frame: the contact patch's velocity (body velocity + yaw rate x wheel position, turned
    //      by the steering on the fronts) in any direction - forwards, sideways, backwards. A car that spins keeps its
    //      tyres working against the slide the whole way round instead of switching to a parking-speed model.
    const inst = tyre.instability(), wobble = inst > 0 ? 1 - 0.12 * inst * (0.5 + 0.5 * Math.sin(world.time * 17 + this.id)) : 1;   // worn / cold tyre twitchiness
    const cd = Math.cos(delta), sd = Math.sin(delta);
    // spinning: travelling more than ~35 degrees off the car's axis (or backwards). Then a driver is on the brakes with
    // both feet and the wheels lock: a locked tyre slides with the same friction every way, so the car carries on
    // rotating and sliding as one body instead of being steered straight by four rolling tyres.
    // (once it has gone, it stays gone until it is nearly straight again or has slowed right down: the car swings and
    //  rotates on the sliding tyres instead of being caught the moment it points within 35 degrees of its path)
    const beta = Math.abs(Math.atan2(this.vLat, this.vLong));
    this.spinning = spd > 4 && (beta > 0.6 || (this.spinning && spd > 9 && (beta > 0.15 || Math.abs(this.r) > 0.8)))
      && !(this.gear === 0 && this.vLong < 0 && spd < 11);   // (reversing on purpose is not a spin)
    const locked = this.spinning && (this.brake > 0.3 || this.handbrake > 0);
    const P = T.powerKW * 1000 * this.enginePower() + (this.ers > 0 && !this.puLoss && this.ersEnergy > 0 && this.throttle > 0.3 ? T.ersKW * 1000 * (this.ersMul || 1) : 0);
    const vP = Math.max(9, absV);
    let Fdrive = this.throttle * Math.min(P / vP, 22000) * (this.gear === 0 ? -0.35 : 1);
    if (this.rpm >= T.maxRpm * 1.01 && this.gear === 8) Fdrive = Math.min(Fdrive, Fdrag);
    if (this.gear === 0 && v < -9) Fdrive = 0;                  // reverse is limited to ~32 km/h
    const Fbrake = this.brake * T.brakeMax * (this.brakeMul || 1) * (this.brakeFail ? 0.33 : 1) * F.pBrake;   // (pBrake: a confident driver's stamp on the pedal)
    let aF = 0, aR = 0;
    const vxs = W.vx || (W.vx = new Float32Array(4));
    for (let k = 0; k < 4; k++) {
      // (a wheel that was just struck by another car's wheel bounces and skips: most of its grip is gone for a moment)
      if (W.lift[k] > 0) W.lift[k] = Math.max(0, W.lift[k] - dt / 0.22);
      // (a punctured tyre has little grip left; shredded to the rim, less still)
      const front = k < 2, cap = tyreCap(Fz[k], front) * grip * SURF_GRIP[W.surf[k]] * (front ? gripFW : 1) * (1 - 0.65 * W.lift[k]) * (this.punct === k ? (this.punctShred ? 0.22 : 0.38 - 0.1 * (this.punctP || 0)) : 1);
      sat[k] = W.cap[k] = cap;   // (sat: the capacity for now, the saturation below)
      const bx = this.vLong - this.r * WY[k], by = this.vLat + this.r * WX[k];
      const vx = front ? bx * cd + by * sd : bx, vy = front ? by * cd - bx * sd : by;
      vxs[k] = vx;
      if (locked) {   // sliding: friction against the patch's motion, ~62 % of the peak (a locked tyre skates on its melted surface)
        const vv = Math.hypot(vx, vy) || 1, f = 0.62 * cap;
        fx[k] = -f * vx / vv; fy[k] = -f * vy / vv;
        if (front) aF += 0.5 * Math.atan2(vy, Math.abs(vx)); else aR += 0.5 * Math.atan2(vy, Math.abs(vx));
        continue;
      }
      // (slip angles below walking pace are meaningless: a few cm/s of drift on a crawling car must not read as a
      //  big slip angle and have traction control cut the drive off the line - hence the 3 m/s floor)
      const a = Math.atan2(vy, Math.max(3, Math.abs(vx)));
      if (front) aF += a * 0.5; else aR += a * 0.5;
      // the force curve past its peak falls toward sliding friction (~70 % of the peak at 90 degrees of slip)
      const fall = 1 - 0.2 * Math.min(1, Math.max(0, (Math.abs(a) - 0.25) / 0.75));
      fy[k] = -cap * Math.sin(1.35 * Math.atan((front ? CH.bF : CH.bR) * a)) * fall * (front ? 1 : wobble);
      // brakes oppose the wheel's own rolling direction
      const sg = Math.sign(vx || v || 1);
      fx[k] = front ? -Fbrake * T.brakeBias * 0.5 * sg : -Fbrake * (1 - T.brakeBias) * 0.5 * sg - this.handbrake * 12500 * sg;
    }

    // ---- the drive on the rear through a limited-slip diff
    const room = (k) => Math.sqrt(Math.max(0, sat[k] * sat[k] - fy[k] * fy[k]));   // what the tyre has left after the cornering
    if (!locked) {
      let d2 = Fdrive * 0.5, d3 = Fdrive * 0.5;
      if (Fdrive > 0) { const e2 = Math.max(0, d2 - room(2)), e3 = Math.max(0, d3 - room(3)); d2 += CH.lsdLock * e3; d3 += CH.lsdLock * e2; }   // the loaded wheel takes over part of what the light one cannot
      fx[2] += d2; fx[3] += d3;
      if (spd < 0.3 && this.throttle < 0.02) { const f = Math.min(1, spd / 0.3); for (let k = 0; k < 4; k++) fx[k] *= f; }
      // assists (limit longitudinal use of each tyre's friction circle)
      if (this.assists.abs && this.brake > 0) for (let k = 0; k < 4; k++) { if (k >= 2 && this.handbrake) continue; const c = 0.93 * room(k); fx[k] = Math.max(-c, Math.min(c, fx[k])); }
      if (this.assists.tc && Fdrive > 0) for (let k = 2; k < 4; k++) fx[k] = Math.min(fx[k], 0.9 * room(k));
    }
    // friction circle per tyre (inline: no allocations at 120 Hz x 23 cars)
    // (an axle's saturation is what its tyres are asked for over what they can give, force-weighted: a nearly
    //  unloaded inside wheel that is "over its limit" by a few newtons is not a sliding axle)
    let dF = 0, cF = 0, dR = 0, cR = 0;
    for (let k = 0; k < 4; k++) {
      const cap = sat[k], t = Math.hypot(fx[k], fy[k]);
      if (k < 2) { dF += t; cF += cap; } else { dR += t; cR += cap; }
      if (t > cap) { const f = cap / (t || 1); fx[k] *= f; fy[k] *= f; }
      sat[k] = cap > 1 ? t / cap : 0;
    }
    const satF = Math.max(1, dF / Math.max(1, cF)), satR = Math.max(1, dR / Math.max(1, cR));
    this.slip = Math.max(0, satF - 1) + Math.max(0, satR - 1) + Math.min(1.5, (Math.abs(aF) + Math.abs(aR)) * 3);
    this.satF = satF; this.satR = satR; this.slipF = aF; this.slipR = aR;

    // ---- body forces and yaw moment (a tyre pushing forward on the left yaws the car right)
    const iv = spd > 1e-3 ? 1 / spd : 0;
    let Fx = -Fdrag * this.vLong * iv, Fy = -Fdrag * this.vLat * iv, Mz = 0;
    for (let k = 0; k < 4; k++) {
      const bx = k < 2 ? fx[k] * cd - fy[k] * sd : fx[k], by = k < 2 ? fy[k] * cd + fx[k] * sd : fy[k];
      Fx += bx; Fy += by; Mz += by * WX[k] - bx * WY[k];
    }

    this.ax = Fx / m; this.ay = Fy / m;
    let dvLong = this.ax + this.r * this.vLat;
    let dvLat = this.ay - this.r * this.vLong;
    // (on a circuit that is not flat, gravity along the slope: slower up the hill to Turn 1, quicker down it - the body
    //  feels none of it, ax / ay stay the tyres' and the air's - world/Terrain.js)
    if (TERRAIN.on) { const g = TERRAIN.grad(this.x, this.z, this._grad || (this._grad = [0, 0])), c = Math.cos(this.th), s = Math.sin(this.th); dvLong -= G * (g[0] * c + g[1] * s); dvLat -= G * (g[0] * s - g[1] * c); }
    // (a little yaw damping from the air and the floor; next to none in a spin, which winds down through the tyres)
    let dr = Mz / T.Izz - this.r * (this.spinning ? 0.06 : 0.35);

    this.vLong += dvLong * dt; this.vLat += dvLat * dt; this.r += dr * dt;
    // parking speeds only (by the car's total speed - a car sliding sideways at 150 km/h has no forward speed but is
    // not parking): blend toward the kinematic rolling motion, which keeps a car crawling or reversing out of the
    // gravel stable where slip angles mean nothing
    const spdNow = Math.hypot(this.vLong, this.vLat);
    if (spdNow < 3) {
      const w = 1 - spdNow / 3, rKin = this.vLong * Math.tan(delta) / L;
      this.r = this.r * (1 - w) + rKin * w; this.vLat *= 1 - 0.6 * w;
    }
    if (this.held) { this.vLong = 0; this.vLat = 0; this.r = 0; }
    if (spdNow < 0.3 && this.throttle < 0.01 && this.brake > 0) { this.vLong = 0; this.vLat = 0; this.r *= 0.5; }

    // integrate pose
    this.th -= this.r * dt;
    const c = Math.cos(this.th), s = Math.sin(this.th);
    this.x += (this.vLong * c + this.vLat * s) * dt;
    this.z += (this.vLong * s - this.vLat * c) * dt;

    // ---- gearbox / rpm (auto)
    const g = Math.max(1, this.gear); const vTop = CAR.gearTop[g - 1];
    this.rpm = Math.max(T.idleRpm, Math.min(T.maxRpm * 1.02, (absV / vTop) * T.maxRpm));
    if (absV < 1) this.rpm = T.idleRpm + this.throttle * (T.maxRpm - T.idleRpm) * 0.9;
    if (this.gear !== 0) {                                        // reverse (gear 0) is never auto-shifted
      if (this.rpm > T.maxRpm * 0.985 && g < 8) this.gear++;
      else if (this.rpm < T.maxRpm * 0.58 && g > 1) this.gear--;
      if (absV < 0.5 && this.throttle < 0.05 && this.brake > 0.3) this.gear = 1;
    } else this.rpm = T.idleRpm + Math.min(1, absV / 9) * 3000 + this.throttle * 1500;

    // ERS: deployed only on demand (+160 kW, 24 s of a full battery); harvested under braking (a full battery from
    // ~13 s of it) and a little when lifting and coasting - enough for roughly 20-25 s of deployment a lap
    this.ersDeploying = this.ers > 0 && this.ersEnergy > 0 && this.throttle > 0.3;
    this.ersHarvesting = !this.ersDeploying && (this.brake > 0.3 || (this.throttle < 0.3 && spd > 20));
    if (this.ersDeploying) this.ersEnergy = Math.max(0, this.ersEnergy - dt / (24 * (this.ersCap || 1)));
    else if (this.brake > 0.3) this.ersEnergy = Math.min(1, this.ersEnergy + dt / 13);
    else if (this.ersHarvesting) this.ersEnergy = Math.min(1, this.ersEnergy + dt / 55);

    // ---- engine thermal: following closely in dirty air heats the car up (about 40 s right on a gearbox to get hot);
    //      hot, it is derated (up to 6 % less power, enginePower) and cools in clean air; only staying at the very
    //      top of the range does lasting damage, and slowly
    const heat = (this.dirtyAir > 0.3 ? 0.018 * this.dirtyAir : -0.04) + (this.throttle * 0.004) + this.dmg.eng * 0.01;
    this.engTemp = Math.max(0.2, Math.min(1, this.engTemp + heat * dt));
    if (this.engTemp > 0.95) this.dmg.eng = Math.min(1, this.dmg.eng + 0.003 * dt);

    // ---- tyres
    const latG = Math.abs(this.ay) / G, lonG = Math.abs(this.ax) / G;
    this.tyres.update(spd * dt, this.slip, latG * 0.5 + lonG * 0.3, wet, dt);

    // ---- track relation
    this.prevS = this.s;
    const q2 = this.track.nearest(this.x, this.z, this.trackIdx, this._q || (this._q = {}));
    this.trackIdx = q2.i; this.s = q2.s; this.d = q2.d;
    if (this.manualPit) this._pitLane();
    this.surf = this.pitLane ? 0 : this.track.surface(this.trackIdx, this.d);
    this.surfGrip = SURF_GRIP[this.surf];
    this.offTrack = this.surf >= 2;   // (by the car's centre; onKerb is any wheel on a kerb)

    // lap progress (forward crossing of s=0)
    let ds = this.s - this.prevS; const Lt = this.track.length;
    if (ds > Lt / 2) ds -= Lt; if (ds < -Lt / 2) ds += Lt;
    if (!isFinite(ds)) ds = 0;   // (never let one bad sample poison the lap count)
    this.lapDist += ds;
    this.totalDist = this.lap * Lt + this.s;
    if (this.prevS > Lt * 0.5 && this.s < Lt * 0.5 && ds > 0 && !this.inPit) {
      const full = this.lapDist >= Lt * 0.95;
      this.lapDist = this.s;
      world.onLine?.(this, full);
    } else if (this.lapDist < -50) this.lapDist = -50;

    // barrier collisions
    if (this.ghost <= 0 && !this.inPit) { this._barriers(world); if (world.obstacles && !this.pitLane) this._obstacles(world); }
    // sliding sideways into gravel, grass or over a kerb's edge: the car can trip and roll
    if (!this.air && !this.wreck && !this.inPit && !this.pitLane && this.ghost <= 0) this._trip(world);

    // stopped timer for reset prompt
    if (spd < 1 / 3.6 && !this.held && world.racing) this.stoppedTime += dt; else this.stoppedTime = 0;
  }

  /** Physical pit lane (player): lateral position in the pit corridor, automatic 80 km/h limiter. */
  _pitLane() {
    const P = this.pit; if (!P) { this.pitLane = false; return; }
    const q = P.nearest(this.x, this.z, this._pq || (this._pq = {}));
    // inside the lane: between the garage wall and the lane's track-side edge (which is clipped to the kerb until the pit wall starts)
    const g = -P.trackSide * q.lat;   // + toward the garages
    const inLane = g > -P.laneEdge[q.i] && g < P.halfWidth + 1.2 && q.u > P.divergeU - 4 && q.u < P.mergeU + 4 && !P.overlapsTrack[q.i];
    if (inLane && !this.pitLane) this.pitEntered = true;          // edge: entered the lane this step
    if (!inLane && this.pitLane) this.pitExited = true;
    this.pitLane = inLane; this.pitU = q.u; this.pitLat = q.lat; this.pitI = q.i;
    // the limiter engages automatically between the two speed lines (the entry and exit roads are driven at speed)
    this.pitLimiter = inLane && q.u >= P.limitFrom && q.u <= P.limitTo;
    if (this.pitLimiter && this.vLong > P.limiter) this.vLong = P.limiter;
  }

  _barriers(world) {
    const tr = this.track;
    let nx, nz, px, pz, boL, boR;   // wall distance on the left / right of the centreline (Infinity = open)
    if (this.pitLane) {                                             // pit-lane walls: garage wall + the pit wall once it exists
      const P = this.pit, ps = P.samples, i = this.pitI; nx = ps.nx[i]; nz = ps.nz[i]; px = ps.px[i]; pz = ps.pz[i];
      const garage = P.halfWidth + 0.7, wall = P.wallIn[i];
      boL = P.trackSide > 0 ? wall : garage; boR = P.trackSide > 0 ? garage : wall;
    } else {
      // where a barrier stands (pushed back on the outside of corners; a permanent circuit has none along most of the lap)
      const i = this.trackIdx; nx = tr.nx[i]; nz = tr.nz[i]; px = tr.px[i]; pz = tr.pz[i];
      boL = tr.barL[i] ? tr.wallL[i] : Infinity; boR = tr.barR[i] ? tr.wallR[i] : Infinity;
      // pit side: the barrier doubles as pit wall (open where the lane branches / rejoins) - and only where there IS a
      // barrier: on a permanent circuit most of the lap has none on that side either
      if (this.pit) { const w = this.pit.wallD[i], bar = this.pit.sideSign > 0 ? tr.barL[i] : tr.barR[i]; const v = isNaN(w) || !bar ? Infinity : w; if (this.pit.sideSign > 0) boL = v; else boR = v; }
    }
    const c = Math.cos(this.th), s = Math.sin(this.th);
    // a car whose centre is already beyond a barrier (it went over it) stays on that side: the barrier holds it out
    const dc0 = (this.x - px) * nx + (this.z - pz) * nz, out0 = Math.abs(dc0) > (dc0 > 0 ? boL : boR);
    let maxPen = 0, hitBx = 0, hitBy = 0, hitSide = 0;
    for (let k = 0; k < CORNERS.length; k++) {
      const bx = CORNERS[k][0], by = CORNERS[k][1];
      const wx = this.x + bx * c + by * s, wz = this.z + bx * s - by * c;   // left = (sin, -cos)
      const dc = (wx - px) * nx + (wz - pz) * nz, wall = dc > 0 ? boL : boR;
      const pen = out0 ? (Math.sign(dc) === Math.sign(dc0) ? wall - Math.abs(dc) : -1) : Math.abs(dc) - wall;
      if (pen > maxPen && isFinite(pen)) { maxPen = pen; hitBx = bx; hitBy = by; hitSide = Math.sign(dc) * (out0 ? -1 : 1); }
    }
    if (hitSide === 0) return;
    this.x -= nx * maxPen * hitSide; this.z -= nz * maxPen * hitSide;
    // Rigid-body impulse at the corner that touches the wall: a glancing hit slides the car along the barrier, a
    // corner-first hit spins it (most of the energy goes into rotation, as in a real accident)
    const cx = this.x + hitBx * c + hitBy * s, cz = this.z + hitBx * s - hitBy * c;
    const wnx = -nx * hitSide, wnz = -nz * hitSide;                  // contact normal: from the wall into the car
    const v = this.velAt(cx, cz, _v2); const vn = v[0] * wnx + v[1] * wnz;
    if (vn >= 0) return;
    const into = -vn, e = into > 8 ? 0.12 : 0.25;
    this.hardest = Math.max(this.hardest || 0, into);
    const j = (1 + e) * into / this.invMassAt(cx, cz, wnx, wnz);
    const tx = -wnz, tz = wnx, vt = v[0] * tx + v[1] * tz;               // Coulomb friction along the barrier
    const jt = Math.max(-0.35 * j, Math.min(0.35 * j, -vt / this.invMassAt(cx, cz, tx, tz)));
    this.impulseAt(cx, cz, j * wnx + jt * tx, j * wnz + jt * tz);
    const bk = this.pitLane ? 'wall' : BAR_KIND[dc0 > 0 ? tr.barL[this.trackIdx] : tr.barR[this.trackIdx]] || 'wall';
    const gHit = this.pulse(Math.hypot(j, jt) / CAR.mass, PULSE[bk], bk);
    const sev = this.applyImpact(hitBx, hitBy, into);
    if (sev > 0) { world.onImpact?.(this, sev, 'wall'); this.emit('hit', cx, cz, sev); }
    // A heavy hit wrecks the car. The harder it is, the likelier the corner digs in and the car vaults off the barrier
    // (1-2 m up, about a second in the air, part of a roll); otherwise it is torn up and spun along the wall.
    // The wheel nearest the contact climbs the barrier: its hub is kicked up (and a little off the wall) by an amount
    // that grows with the impact speed. Everything after that is the rigid body's own physics.
    if (into > LAUNCH_WALL && !this.inPit) {
      const k = into - LAUNCH_WALL, fly = Math.random() < Math.min(0.6, 0.15 + k / 25);
      const wx = this.x + Math.sign(hitBx || 1) * 1.8 * c + Math.sign(hitBy || 1) * 0.85 * s, wz = this.z + Math.sign(hitBx || 1) * 1.8 * s - Math.sign(hitBy || 1) * 0.85 * c;
      // (a vault off the wall is a 6-14 m/s kick at the wheel: up to ~2 m, mostly a roll)
      const up = fly ? Math.min(14, 6 + k * 0.4 + Math.random() * 4) : into * (0.06 + Math.random() * 0.08);
      this.launch(wx, 0.36, wz, wnx * into * 0.1, up, wnz * into * 0.1);
      if (gHit > SPLIT_G && Math.random() < Math.min(0.8, 0.15 + (gHit - SPLIT_G) / 40)) this.splitApart();
      else if (gHit > 35 && Math.random() < 0.25) this.emit('fire', cx, cz, 0.8);
    }
  }

  /**
   * Buildings and grandstands (world/Obstacles.js): a corner of the car inside one is pushed out through its nearest
   * face and the car takes the hit as from a concrete wall - the same impulse, damage, pulse and (hard enough) launch.
   */
  _obstacles(world) {
    const O = world.obstacles, c = Math.cos(this.th), s = Math.sin(this.th), h = this._oh || (this._oh = {});
    let pen = 0, nx = 0, nz = 0, hb = 0, hy = 0;
    for (const [bx, by] of CORNERS) { const wx = this.x + bx * c + by * s, wz = this.z + bx * s - by * c; if (O.hit(wx, wz, 0.3, h) && h.pen > pen) { pen = h.pen; nx = h.nx; nz = h.nz; hb = bx; hy = by; } }
    if (!pen) return;
    this.x += nx * pen; this.z += nz * pen;
    const cx = this.x + hb * c + hy * s, cz = this.z + hb * s - hy * c, v = this.velAt(cx, cz, _v2), vn = v[0] * nx + v[1] * nz;
    if (vn >= 0) return;
    const into = -vn, j = (1 + (into > 8 ? 0.12 : 0.25)) * into / this.invMassAt(cx, cz, nx, nz);
    const tx = -nz, tz = nx, vt = v[0] * tx + v[1] * tz, jt = Math.max(-0.35 * j, Math.min(0.35 * j, -vt / this.invMassAt(cx, cz, tx, tz)));
    this.impulseAt(cx, cz, j * nx + jt * tx, j * nz + jt * tz);
    const g = this.pulse(Math.hypot(j, jt) / CAR.mass, PULSE.building, 'building');
    const sev = this.applyImpact(hb, hy, into); if (sev > 0) { world.onImpact?.(this, sev, 'wall'); this.emit('hit', cx, cz, sev); }
    if (into > LAUNCH_WALL) { this.launch(cx, 0.36, cz, nx * into * 0.1, into * (0.06 + Math.random() * 0.08), nz * into * 0.1); if (g > SPLIT_G && Math.random() < Math.min(0.8, 0.15 + (g - SPLIT_G) / 40)) this.splitApart(); }
  }
  /**
   * A car sliding sideways (more than ~40 km/h of it) whose leading wheels run off the asphalt into gravel or grass,
   * or hit a kerb's edge, can dig them in: the leading edge stops at ground level while the body carries on, and the
   * car rolls over that edge - a barrel roll, bounces, maybe onto its roof (the rigid body does the rest). Gravel
   * digs in most, grass less, a kerb least; the faster the slide, the likelier.
   */
  _trip(world) {
    const W = this.wh, prev = W.prev || (W.prev = Uint8Array.from(W.surf));
    const vl = this.vLat, sideways = Math.abs(vl), lead = vl > 0 ? 0 : 1;   // sliding left: the left wheels (FL, RL) lead
    let dig = 0;
    if (sideways > 20 && this.speed > 14) for (const k of [lead, lead + 2]) {
      const now = W.surf[k], was = prev[k];
      if (now !== was) dig = Math.max(dig, now === 4 ? 1 : now === 3 && was < 3 ? 0.3 : now === 1 && was === 0 ? 0.15 : 0);
    }
    prev.set(W.surf);
    // (from ~80 km/h sideways into gravel, and even then rarely; grass and kerbs much less: a car that runs a little wide
    //  and slides a bit is not rolled)
    if (!dig || Math.random() > dig * Math.min(0.5, Math.max(0, (sideways - 22) / 30))) return;
    const c = Math.cos(this.th), s = Math.sin(this.th), sg = vl > 0 ? 1 : -1;   // left = (s, -c) in the world
    const px = this.x + sg * 0.95 * s, pz = this.z - sg * 0.95 * c, k = sideways * (0.5 + Math.random() * 0.35);
    this.launch(px, 0.02, pz, -sg * s * k, 1.5 + Math.random() * 2.5 + sideways * 0.05, sg * c * k);
    world.onImpact?.(this, 1, 'trip');
  }

  /** Reset onto the racing line at the current s (+10 m), 50 km/h, 2 s ghost. Damage persists. */
  resetToTrack(racingLine, ahead = 10) {
    const s = this.track.wrapS(this.s + ahead);
    const d = racingLine ? racingLine.offsetAt(s) : 0;
    this.air = false; this.wreck = false; this.y = 0; this.vy = 0; this.pitch = 0; this.roll = 0; this.wp = 0; this.wr = 0;
    this.resets = (this.resets || 0) + 1;   // (telemetry marks the lap as not clean)
    this.placeOnTrack(s, d, 50 / 3.6);
    this.ghost = 3; this.stoppedTime = 0; this.gear = 2;
  }
}
