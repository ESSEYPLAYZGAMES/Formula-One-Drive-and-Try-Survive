// The AI's tactical planner. About ten times a second each AI car lays out a handful of candidate paths over the
// next 120-300 m - the racing line, lanes beside it, a move to one side that rejoins the line after the corner,
// staying where it is - and drives each one in its head: the speed it can carry along that exact path (its own
// grip, tyres and damage, braking into corners, power out of them) and where every other car will be when it gets
// there. A lane with a slower car in it means following that car; a lane that runs into a car alongside is ruled
// out. The cheapest path wins (time over the horizon, plus racecraft: defending, giving a lapping car room, holding
// the grid lane off the start). Overtakes, following, side-by-side racing and avoiding wrecks all come out of that
// one comparison instead of separate rules.
//
// Paths are lateral offsets d(s) from the centreline (left +) at nodes DS metres apart, written as an offset e(s)
// from the racing line. Everything is allocation-free after construction (22 cars x 10 plans a second). The player's
// form (car.form, career/Morale.js) is read live: good racecraft earns a little more room from a car alongside.
import { CAR } from '../vehicle/Car.js';

const G = 9.81;
export const DS = 5;                 // node spacing (m)
export const NMAX = 64;              // nodes per path (up to 315 m)
const DRAG_M = 0.5 * CAR.rho * CAR.cdA / CAR.mass, BRAKE_A = CAR.brakeMax / CAR.mass, VMAX = 99;
const PRED_DT = 0.1, PRED_N = 60;    // other cars' predicted positions: every 0.1 s for 6 s

export class Path {
  constructor() {
    this.d = new Float32Array(NMAX); this.e = new Float32Array(NMAX); this.k = new Float32Array(NMAX); this.x = new Float32Array(NMAX); this.z = new Float32Array(NMAX);
    this.vl = new Float32Array(NMAX); this.cap = new Float32Array(NMAX); this.v = new Float32Array(NMAX); this.t = new Float32Array(NMAX);
    this.vm = new Float32Array(NMAX);   // the most it may do at each node (corner, caps, braking for what follows): what the pedals aim at
    this.n = 0; this.s0 = 0; this.time0 = 0; this.spec = null; this.cost = 0; this.follow = null; this.blocked = 0; this.pass = 0;
  }
  copyFrom(p) {
    this.d.set(p.d); this.e.set(p.e); this.k.set(p.k); this.v.set(p.v); this.t.set(p.t); this.vm.set(p.vm);
    this.n = p.n; this.s0 = p.s0; this.time0 = p.time0; this.spec = p.spec; this.cost = p.cost; this.follow = p.follow; this.blocked = p.blocked; this.pass = p.pass;
  }
}

/** a candidate: offset k from the racing line held to holdTo (absolute s, Infinity: the whole horizon), then rejoining
 *  the line over 60 m; or (abs) staying at the absolute lateral position dAbs */
const spec = (type, k, holdTo, dAbs = 0) => ({ type, k, holdTo, dAbs });
const LANES = [-5.5, -3.5, -1.8, 0, 1.8, 3.5, 5.5];
const HOLDS = [Infinity, 90];
const smooth = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));

export class Planner {
  constructor(driver) {
    this.drv = driver; this.track = driver.track; this.line = driver.line;
    this.best = new Path(); this.cand = new Path(); this.prev = null;
    // other cars' predicted (s offset from my position, d) per 0.1 s
    this.others = []; for (let i = 0; i < 24; i++) this.others.push({ car: null, s: new Float32Array(PRED_N), d: new Float32Array(PRED_N), v: new Float32Array(PRED_N), ahead0: false, s0: 0, lapping: false, behindFast: false });
    this.nOthers = 0;
    // the sign that makes a geometric curvature agree with the track's (left turn positive)
    const tr = this.track; if (tr._kSign) { this.kSign = tr._kSign; return; }
    let agree = 0; const f = {}, p = [];
    for (let i = 0; i < tr.n; i += Math.max(1, Math.round(20 / tr.ds))) {
      p.length = 0; for (let k = -1; k <= 1; k++) { tr.sample(tr.s[i] + k * 10, 0, f); p.push(f.x, f.z); }
      const cross = (p[2] - p[0]) * (p[5] - p[3]) - (p[3] - p[1]) * (p[4] - p[2]); agree += cross * tr.curv[i];
    }
    this.kSign = tr._kSign = agree < 0 ? -1 : 1;
  }

  // ---- geometry ---------------------------------------------------------------------------------------------------
  /** wrapped distance from a to b along the lap (b ahead: positive) */
  ds(a, b) { const L = this.track.length; let x = b - a; if (x > L / 2) x -= L; if (x < -L / 2) x += L; return x; }

  /** target offset from the line of a candidate at absolute s (x metres ahead of the car) */
  laneE(sp, s, x, dl) {
    if (sp.type === 'abs') return sp.dAbs - dl;
    // (a switchback: one side of the car ahead into the corner, across behind it from 20 m before the apex to 40 m
    //  after, the other side out of it)
    if (sp.type === 'switch') { const past = this.ds(sp.holdTo, s); return sp.k + (sp.k2 - sp.k) * smooth((past + 20) / 60); }
    if (sp.holdTo === Infinity) return sp.k;
    const past = this.ds(sp.holdTo, s);   // metres past the end of the hold
    return past <= 0 ? sp.k : sp.k * (1 - smooth(past / 60));
  }

  /**
   * Lay out a candidate path from the car's position and heading: the lane's target offset, reached from where the
   * car is now along a Hermite blend that is as long as a gentle lateral move at this speed needs.
   */
  build(P, sp, ctx) {
    const n = ctx.n, m = ctx.m, N = this.node;
    P.n = n; P.s0 = ctx.s0; P.spec = sp; P.follow = null; P.blocked = 0;
    const s0 = ctx.s0, ek0 = this.laneE(sp, s0, 0, N.dl[0]);
    const E0 = ctx.e0 - ek0, E1 = ctx.e1;   // error to the lane, and its slope
    const Lt = Math.max(15, Math.min(220, ctx.v * Math.sqrt(6 * Math.abs(E0) / 5) + 4 * ctx.v * Math.abs(E1)));
    for (let i = 0; i < n; i++) {
      const x = i * DS, dl = N.dl[i];
      let e = this.laneE(sp, s0 + x, x, dl);
      if (x < Lt) { const u = x / Lt, h00 = (1 - u) * (1 - u) * (1 + 2 * u), h10 = u * (1 - u) * (1 - u); e += E0 * h00 + E1 * Lt * h10; }
      const d = Math.max(-m - N.wdR[i], Math.min(m + N.wd[i], dl + e));
      P.d[i] = d; P.e[i] = d - dl;
    }
    // curvature of the driven path: the racing line's own (exactly what the speed profile was built on) plus what the
    // lane changes about it, measured from the geometry of both (the circle through the points 10 m either side)
    const X = P.x, Z = P.z, LK = this.lineK;
    for (let i = 0; i < n; i++) { X[i] = N.cx[i] + N.nx[i] * P.d[i]; Z[i] = N.cz[i] + N.nz[i] * P.d[i]; }
    this.circle(X, Z, n, P.vl);
    for (let i = 0; i < n; i++) P.vl[i] = N.lk[i] + (P.vl[i] - LK[i]);
    for (let i = 0; i < n; i++) P.k[i] = (P.vl[Math.max(0, i - 1)] + 2 * P.vl[i] + P.vl[Math.min(n - 1, i + 1)]) / 4;
    P.cap.fill(Math.min(VMAX, ctx.vCap ?? VMAX), 0, n);   // (a race-control speed cap: VSC, safety car)
    // boxing: at the pit limiter (80 km/h) by the speed-limit line
    if (ctx.pitDist != null) for (let i = 0; i < n; i++) if (i * DS >= ctx.pitDist - 2) P.cap[i] = Math.min(P.cap[i], ctx.pitCapV ?? 22.2);
  }
  /** signed curvature (left +) of a polyline at each node, through the nodes two either side */
  circle(X, Z, n, out) {
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, Math.min(n - 5, i - 2)), b = a + 2, c = a + 4;
      const abx = X[b] - X[a], abz = Z[b] - Z[a], bcx = X[c] - X[b], bcz = Z[c] - Z[b], acx = X[c] - X[a], acz = Z[c] - Z[a];
      out[i] = this.kSign * 2 * (abx * bcz - abz * bcx) / (Math.hypot(abx, abz) * Math.hypot(bcx, bcz) * Math.hypot(acx, acz) || 1);
    }
  }
  /**
   * What every candidate of this plan shares, once per plan: the centreline and its normal under each node, the
   * racing line's offset and curvature there, and the racing line's own geometric curvature
   */
  lineGeometry(ctx) {
    const tr = this.track, line = this.line, n = ctx.n, f = this._f || (this._f = {});
    const N = this.node || (this.node = { cx: new Float32Array(NMAX), cz: new Float32Array(NMAX), nx: new Float32Array(NMAX), nz: new Float32Array(NMAX), dl: new Float32Array(NMAX), lk: new Float32Array(NMAX), wd: new Float32Array(NMAX), wdR: new Float32Array(NMAX) });
    const X = this._lx || (this._lx = new Float32Array(NMAX)), Z = this._lz || (this._lz = new Float32Array(NMAX));
    this.lineK = this.lineK || new Float32Array(NMAX);
    // the circuit's calibration under each node (ai/Calibration.js: corner speed and braking commitment, 1 = physics)
    const cV = this.calV || (this.calV = new Float32Array(NMAX)), cB = this.calB || (this.calB = new Float32Array(NMAX)), aV = tr.aiV, aB = tr.aiB;
    for (let i = 0; i < n; i++) {
      const s = ctx.s0 + i * DS; tr.sample(s, 0, f);
      const ci = tr.idxAtS(s), w = ctx.calW ?? 1;   // (calW: AIDriver - a calibration fitted solo, eased off in the pack)
      cV[i] = !aV ? 1 : w === 1 ? aV[ci] : 1 + (aV[ci] - 1) * w; cB[i] = !aB ? 1 : w === 1 ? aB[ci] : 1 + (aB[ci] - 1) * w;
      N.cx[i] = f.x; N.cz[i] = f.z; const idx = tr.idxAtS(s); N.nx[i] = f.nx; N.nz[i] = f.nz;
      N.dl[i] = line.offsetAt(s); N.lk[i] = line.lineCurv[idx]; N.wd[i] = tr.hwL ? tr.hwL[idx] - tr.halfWidth : 0; N.wdR[i] = tr.hwR ? tr.hwR[idx] - tr.halfWidth : 0;   // (how much wider the road is there, left and right)
      X[i] = f.x + N.nx[i] * N.dl[i]; Z[i] = f.z + N.nz[i] * N.dl[i];
    }
    this.circle(X, Z, n, this.lineK);
  }

  // ---- speed along a path -----------------------------------------------------------------------------------------
  /** grip-limited speed for path curvature k with this car's grip state */
  cornerV(k, g) {
    const den = Math.abs(k) - g.mu * g.dfm;
    return den > 1e-6 ? Math.min(VMAX, Math.sqrt(g.mu * G / den)) : VMAX;
  }
  /** braking available at speed v while cornering at curvature k (friction circle, the rear axle's trail-brake limit, drag) */
  brakeA(v, k, g, cal = 1) {
    const aMax = Math.min(BRAKE_A, g.mu * (G + g.dfm * v * v)) * g.brake * cal;
    const aLat = v * v * Math.abs(k), circle = Math.sqrt(Math.max(0.12 * aMax * aMax, aMax * aMax - aLat * aLat));
    const ax = this.line.grip.axle; if (!ax) return circle + DRAG_M * v * v;
    const load = Math.min(1, 2 * aLat / (g.mu * (G + g.dfm * v * v)));
    if (load <= 0) return circle + DRAG_M * v * v;
    // the rear axle at 80 % of its grip with the cornering it does (RacingLine.rearBrakeLimit, solved in closed form:
    // (rearBrake a)^2 + (rearStatic aLat)^2 = (M (fz - transfer a))^2 is a quadratic in a)
    const M = 0.8 * g.mu, fz = ax.rearStatic * G + ax.dfRear * v * v / CAR.mass, tr = ax.transfer, rb = ax.rearBrake, rl = ax.rearStatic * aLat;
    const A = rb * rb - M * M * tr * tr, B = 2 * M * M * fz * tr, C = rl * rl - M * M * fz * fz, disc = B * B - 4 * A * C;
    const rear = C >= 0 ? 0 : disc > 0 ? (-B + Math.sqrt(disc)) / (2 * A) : 0;
    return circle + (Math.min(circle, rear) - circle) * load + DRAG_M * v * v;
  }
  /** the drive the rear tyres can take on top of the cornering (rear axle share of what the friction circle leaves) */
  tractionA(v, k, g) {
    const aMax = g.mu * (G + g.dfm * v * v), aLat = v * v * Math.abs(k);
    return 0.72 * Math.sqrt(Math.max(0.12 * aMax * aMax, aMax * aMax - aLat * aLat));
  }
  accelA(v, k, g) {
    const P = (CAR.powerKW + (g.ers ? CAR.ersKW : 0)) * 1000 * g.power;
    return Math.min(P / (CAR.mass * Math.max(8, v)) - DRAG_M * v * v - CAR.rolling / CAR.mass, this.tractionA(v, k, g));
  }
  /**
   * The speed this car can carry along path P: the corner limit at every node (and any cap, e.g. a car it has to
   * follow), braking back from each one, accelerating from its speed now; then the time at every node.
   */
  speeds(P, ctx) {
    const n = P.n, g = ctx.grip, v = P.v, vb = P.vm;
    // the most it may do at every node: the corner, any cap, and braking in time for what comes after
    const cV = this.calV, cB = this.calB;
    for (let i = 0; i < n; i++) vb[i] = Math.min(P.cap[i], this.cornerV(P.k[i], g) * g.scale * cV[i]);
    vb[n - 1] = Math.min(vb[n - 1], ctx.vEnd);
    for (let i = n - 2; i >= 0; i--) { const b = Math.sqrt(vb[i + 1] * vb[i + 1] + 2 * this.brakeA(vb[i + 1], P.k[i + 1], g, cB[i + 1]) * DS); if (b < vb[i]) vb[i] = b; }
    // ... and out of a corner no faster than the tyres can put the power down while still cornering (the throttle is
    // fed in, not floored at the apex); on a straight that limit is far above the engine's, so it stays flat out there
    for (let i = 0; i < n - 1; i++) { const a = this.tractionA(vb[i], P.k[i], g), u = Math.sqrt(vb[i] * vb[i] + 2 * a * DS); if (u < vb[i + 1]) vb[i + 1] = u; }
    // what it will do: from its speed now, accelerating toward that, or braking as hard as it can if it is too fast
    v[0] = Math.max(0.5, ctx.v);
    for (let i = 0; i < n - 1; i++) {
      const up = Math.sqrt(v[i] * v[i] + 2 * Math.max(0, this.accelA(v[i], P.k[i], g)) * DS);
      const down = Math.sqrt(Math.max(0.25, v[i] * v[i] - 2 * this.brakeA(v[i], P.k[i], g, cB[i]) * DS));
      v[i + 1] = Math.min(up, Math.max(down, vb[i + 1]));
    }
    P.t[0] = 0; for (let i = 1; i < n; i++) P.t[i] = P.t[i - 1] + DS / Math.max(0.5, (v[i - 1] + v[i]) / 2);
  }

  // ---- other cars -------------------------------------------------------------------------------------------------
  /**
   * Where every car near me will be over the next 6 s, as (distance ahead of my position now, lateral offset). An AI
   * car is predicted by its own plan (what it means to do, as a driver reads a rival's line); the player and anything
   * spinning or wrecked by its motion now - braking cars keep braking, launching cars keep launching.
   */
  predictOthers(world, ctx) {
    const me = this.drv.car, tr = this.track, H = ctx.n * DS;
    let k = 0;
    for (const o of world.cars) {
      if (o === me || o.cleared || o.inPit || o.pitLane) continue;
      const g0 = this.ds(me.s, o.s);
      if (g0 < -40 || g0 > H + 80) continue;
      const oi = o.trackIdx ?? 0, eL = tr.edgeAt(oi, 1), eR = tr.edgeAt(oi, -1);   // (the road's edge on each side: a corner widened on its outside only - Austin - is no wider on its inside)
      if (o.d > eL + 25 || o.d < -eR - 25) continue;   // far off the road
      const R = this.others[k++]; if (k >= this.others.length) break;
      R.car = o; R.s0 = g0; R.ahead0 = g0 > 2.5;
      const L = tr.length;
      R.lapping = g0 < 0 && (o.lap * L + o.lapDist) - (me.lap * L + me.lapDist) > L / 2 && !o.retired;   // a car a lap up, behind me: blue flags
      const P = o.ai && o.ai.planner && o.ai.planner.best, still = o.retired && o.speed < 1;
      R.planned = !!(P && P.n > 2 && !o.spinning && !o.rigid && !still && world.time - P.time0 < 0.4);
      // (the player racing - a car it cannot read, the one its racecraft is about; never a car out of control, nor an AI
      //  car between plans: rejoining after a spin, pulling over)
      R.human = !R.planned && o.isPlayer && !o.spinning && !o.rigid && !still && !o.retired && !o.air && !o.wreck && o.speed > 5;
      const hb = R.human ? ctx.bold || 0 : 0;
      if (R.planned) {
        const dt0 = world.time - P.time0, off = this.ds(me.s, P.s0);
        let j = 0;
        for (let q = 0; q < PRED_N; q++) {
          const t = q * PRED_DT + dt0;
          while (j < P.n - 2 && P.t[j + 1] < t) j++;
          if (t >= P.t[P.n - 1]) { const x = (P.n - 1) * DS + (t - P.t[P.n - 1]) * P.v[P.n - 1]; R.s[q] = off + x; R.d[q] = P.d[P.n - 1]; R.v[q] = P.v[P.n - 1]; continue; }
          const f = (t - P.t[j]) / Math.max(1e-3, P.t[j + 1] - P.t[j]);
          R.s[q] = off + (j + f) * DS; R.d[q] = P.d[j] + (P.d[j + 1] - P.d[j]) * f; R.v[q] = P.v[j] + (P.v[j + 1] - P.v[j]) * f;
        }
      } else {
        // its motion now: speed along the track, braking or accelerating, drifting sideways for half a second
        let va, vd;
        if (o.rigid && o.v) { const i = o.trackIdx; va = o.v[0] * tr.tx[i] + o.v[2] * tr.tz[i]; vd = o.v[0] * tr.nx[i] + o.v[2] * tr.nz[i]; }
        else if (still) { va = 0; vd = 0; }
        else { const [wx, wz] = o.worldVel(), i = o.trackIdx; va = wx * tr.tx[i] + wz * tr.tz[i]; vd = wx * tr.nx[i] + wz * tr.nz[i]; }
        // (racecraft, ctx.bold: its sideways motion read through 0.4 s, and a driver's small corrections - under 0.6 m/s -
        //  are not a move; read raw, a twitch of the wheel swept its predicted path across the lane being attacked in)
        if (hb) {
          if (o._vdT !== world.time) { const k = o._vdT == null ? 1 : Math.min(1, Math.max(0, world.time - o._vdT) / 0.4); o._vdS = o._vdS == null ? vd : o._vdS + (vd - o._vdS) * k; o._vdT = world.time; }
          vd = Math.abs(o._vdS) < 0.6 ? 0 : o._vdS - Math.sign(o._vdS) * 0.6;
        }
        const acc = o.rigid || still || o.spinning ? -6 : Math.max(-45, Math.min(12, o.ax || 0));
        // (it keeps its distance from the racing line, but never leaves the road for it: a car on the edge stays there)
        // (... held to the road's edges where it will be, each side's own - not the wider side's, and not where it is now: a car
        //  following the line out onto a widened corner's outside goes out there)
        const e0 = o.d - this.line.offsetAt(o.s), follows = !o.rigid && !still && !o.spinning, onRoad = o.d < eL + 0.3 && o.d > -eR - 0.3;
        // (racecraft, ctx.bold: a player clearly ahead turns in - from the corner on, its distance from the racing line
        //  closes over 1.2 s: held at it, a car swinging across to the apex was read as staying out of the way)
        const turnIn = hb && follows && g0 > 3;
        let s = g0, v = va, tz = -1;
        for (let q = 0; q < PRED_N; q++) {
          const t = q * PRED_DT;
          R.s[q] = s; R.v[q] = v;
          let eq = e0;
          if (turnIn) { if (tz < 0 && tr.inCornerZone(tr.idxAtS(me.s + s))) tz = t; if (tz >= 0) eq = e0 * Math.max(0, 1 - (t - tz) / 1.2); }
          let dq = follows ? this.line.offsetAt(me.s + s) + eq + vd * Math.min(t, 0.5) : o.d + vd * Math.min(t, 1.0);
          if (follows && onRoad) { const qi = tr.idxAtS(me.s + s); dq = Math.max(-tr.edgeAt(qi, -1) - 0.3, Math.min(tr.edgeAt(qi, 1) + 0.3, dq)); }
          R.d[q] = dq;
          // (braking: down to the corner it is braking for, not on to a standstill - read on for 1.5 s, a car braking for a
          //  slow corner was predicted to stop dead in the road, and every lane behind it was a wall: ctx.bold)
          const a = t < 1.5 ? acc : 0, vFloor = hb && follows && a < 0 ? 0.85 * this.drv.profile[tr.idxAtS(me.s + s)] : 0;
          v = Math.max(0, Math.min(v, Math.max(vFloor, v + a * PRED_DT))); s += v * PRED_DT;
        }
      }
      // a car whose intentions it cannot read (the player, a car out of control) gets more room, the more so the
      // faster it is closing on it - and the player a little more again for good racecraft, a little less for poor
      // (FORM.respect, career/Morale.js: the room a car alongside leaves you; traffic() scales it by ctx.unreadRoom)
      // (racecraft, ctx.bold: less of it - 0.3 m and up to 0.6 m more closing - for a driver who means to pass)
      const clos = Math.min(1, Math.max(0, me.speed - o.speed) / 20), bd = Math.min(1, hb);
      R.extra = R.planned ? 0 : ((0.5 + clos) * (1 - bd) + (0.3 + 0.6 * clos) * bd) * (o.isPlayer ? (o.form?.respect || 1) : 1);
      R.side0 = o.d - me.d;   // (how far beside me it is now: side by side, or nose to tail)
      R.braking = o.rigid ? 0 : Math.min(8, Math.max(0, -(o.ax || 0)) * 0.15);
    }
    this.nOthers = k;
    for (let r = 0; r < k; r++) { const R = this.others[r]; let lo = Infinity, hi = -Infinity; for (let q = 0; q < PRED_N; q++) { const s = R.s[q]; if (s < lo) lo = s; if (s > hi) hi = s; } R.sMin = lo; R.sMax = hi; }
  }

  /**
   * Run path P against the predicted traffic. A car ahead in the lane: P gets capped to that car's speed from a
   * following gap before the point it would be caught, and is re-planned (twice at most). Running into a car that is
   * alongside, or into the path of a car a lap up that is about to lap me: a penalty that rules the lane out.
   */
  traffic(P, ctx) {
    const n = P.n, W = ctx.width, Lc = 5.9;
    for (let iter = 0; iter < 3; iter++) {
      this.speeds(P, ctx);
      let conflict = null;
      for (let r = 0; r < this.nOthers && !conflict; r++) {
        const R = this.others[r];
        if (R.s0 < -Lc && !R.lapping) continue;   // a car behind me sorts itself out (unless it is lapping me)
        if (R.sMin > (n - 1) * DS + Lc || R.sMax < -Lc) continue;   // never near the path in the next 6 s
        for (let i = 1; i < n; i++) {
          const t = P.t[i]; if (t > (PRED_N - 1) * PRED_DT) break;
          const q = t / PRED_DT, q0 = Math.floor(q), f = q - q0;
          const so = R.s[q0] + (R.s[q0 + 1] - R.s[q0]) * f, dd = Math.abs(R.d[q0] + (R.d[q0 + 1] - R.d[q0]) * f - P.d[i]);
          const gs = so - i * DS;
          if (R.lapping) { if (t < 3 && gs > -12 && gs < Lc && dd < W + 0.6) { P.blocked += 0.6 * (1 - t / 3); break; } continue; }
          // a car ahead in the lane is in the way from a following gap behind it (longer while it is braking hard: a
          // braking pack concertinas); one alongside from overlapping it
          // (no overtaking - yellow flags, safety car: a running car ahead is followed wherever it is on the road)
          // (... unless it owes me the place: then it is letting me by)
          // (and the safety car only for the leader: anyone else behind it is waved by)
          const queue = ctx.noPass && R.ahead0 && !R.car.retired && !R.car.spinning && !R.car.rigid && R.car.speed > 6 && R.car._owes !== this.drv.car && (!R.car.isSC || ctx.queueSC);
          // (a feud - you said something on the grid: it leaves you far less room and sits on your gearbox)
          const fk = R.car === ctx.feud ? ctx.feudK : 0, Wr = W * (1 - 0.72 * fk), xr = fk ? 0 : R.extra * (ctx.unreadRoom ?? 1), gp = (ctx.gap + R.braking) * (1 - 0.8 * fk);
          if (gs > -Lc && gs < (R.ahead0 ? gp : Lc) && (queue || dd < Wr + xr)) {
            // racecraft (ctx.bold) against a car it cannot read (the player). In a corner, as between two AI cars: on
            // the inside of it where we meet and level with it there (my nose at least to its middle), the corner is
            // mine and it is expected to leave the room (as the rules say) - anywhere else in a corner it is its
            // corner. On a straight: side by side already - my front wheels up to its rear ones, a car's width between
            // us - it is expected to keep to its side: the line squeezes, it is not given up. A meeting with a car ahead
            // more than 2 s off is a guess (it is read as tracing the racing line, and in a corner that sweeps across
            // every lane): the gap is gone for, at a cost, and dealt with if it really closes; one alongside further off
            // than 1.2 s costs less the further
            if (ctx.bold && R.human && !queue) {
              const z = this.track.inCornerZone(this.track.idxAtS(P.s0 + i * DS));
              if (z && z.dir) {
                if (t > 0.3 && gs < 0.5 * Lc && (P.d[i] - (R.d[q0] + (R.d[q0 + 1] - R.d[q0]) * f)) * z.dir > 0.8) { P.blocked += 0.15 * Math.min(1, ctx.bold); break; }
              } else if (t > 0.6 && R.s0 > -Lc && R.s0 < 0.85 * Lc && Math.abs(R.side0) > 1.7) { P.blocked += 0.15 * Math.min(1, ctx.bold); break; }
              if (R.ahead0 && t > 2) { P.blocked += 0.25 * Math.max(0.3, 1 - (t - 2) / 4); break; }
              if (!R.ahead0 && t > 1.2) { conflict = { R, i, gs, t, vo: R.v[q0], soft: Math.max(0.25, 1 - (t - 1.2) / 3) }; break; }
            }
            // racecraft (ctx.boldAI) against another AI car, read by its plan: where we meet in a corner, me on the
            // inside of it and level with it there - my nose at least to its middle - the corner is mine, and it is
            // expected to leave the room (its own plan reads mine the same way: it is the one outside, and gives way)
            if (ctx.boldAI && R.planned && !queue && t > 0.3 && t < 3 && gs < 0.5 * Lc) {
              const z = this.track.inCornerZone(this.track.idxAtS(P.s0 + i * DS));
              if (z && z.dir && (P.d[i] - (R.d[q0] + (R.d[q0 + 1] - R.d[q0]) * f)) * z.dir > 0.8) { P.blocked += 0.2 * Math.min(1, ctx.boldAI); break; }
            }
            conflict = { R, i, gs, t, vo: R.v[q0] }; break;
          }
        }
      }
      if (!conflict) return;
      const { R, i } = conflict;
      if (R.ahead0) {
        // follow it: from just before the catch-up point no faster than it goes - and slower while inside the
        // following gap, until the gap is back
        P.follow = R.car;
        const back = Math.ceil(4 / DS), from = Math.max(0, i - back), short = Math.max(0, ctx.gap - conflict.gs);
        let capped = false;
        for (let j = from; j < n; j++) {
          const tj = Math.min((PRED_N - 1) * PRED_DT, P.t[j]), qj = Math.floor(tj / PRED_DT);
          const lim = Math.max(0, R.v[qj] * 0.995 - 0.5 - 0.5 * short);
          if (lim < P.cap[j]) { P.cap[j] = lim; capped = true; }
        }
        if (!capped) { P.blocked += 1.5; return; }
      } else {
        // alongside (or about to be): moving into it is not an option
        P.blocked += conflict.t < 1.2 ? 6 : 2.5 * (conflict.soft ?? 1);
        return;
      }
    }
    P.blocked += 0.5;   // (still running into the car ahead after three tries: a poor option)
  }

  // ---- the plan ---------------------------------------------------------------------------------------------------
  /**
   * Choose a path: build every candidate, plan its speed through the traffic, cost it, keep the cheapest. The cost is
   * the time over the horizon plus the time it would lose after it (arriving slower), lane changes (small, and more
   * for changing the mind), running off the racing line (marbles, dirty air), and the racecraft terms in ctx.
   */
  plan(world, ctx) {
    const drv = this.drv, prevSpec = this.best.spec;
    this.predictOthers(world, ctx);
    this.lineGeometry(ctx);
    const busy = this.nOthers > 0 && this.anyNear(ctx);
    const specs = this._specs || (this._specs = []); specs.length = 0;
    specs.push(spec('lane', 0, Infinity));
    // (racecraft: a car close ahead or alongside to race - the moves a driver makes on it; kb how much it means it:
    //  ctx.bold on the player, ctx.boldAI on another AI car)
    const rival = busy ? this.rivalNear(ctx) : null, kb = rival ? Math.min(1.2, rival.human ? ctx.bold : ctx.boldAI) : 0;
    if (busy || Math.abs(ctx.e0) > 1.2 || ctx.forceLane) {
      // (a move that rejoins the line after the corner only for the bigger offsets: a small one is the same as holding)
      for (const k of LANES) for (const h of HOLDS) if (h === Infinity ? true : Math.abs(k) >= 3) specs.push(spec('lane', k, h === Infinity ? Infinity : ctx.s0 + h));
      specs.push(spec('abs', 0, Infinity, drv.car.d));
      if (rival) {
        // the lunge: the attacking lanes again, braked for later (a driver going for the gap commits to the stop)
        for (const k of [-3.5, -1.8, 1.8, 3.5]) specs.push(Object.assign(spec('lane', k, Infinity), { late: true }));
        // the switchback: wide of it into the next corner, across behind it at the apex, up the inside out of it
        const apex = this.nextApex(ctx);
        if (apex != null) for (const [k1, k2] of [[3.5, -2.5], [-3.5, 2.5], [1.8, -2.5], [-1.8, 2.5]]) specs.push({ type: 'switch', k: k1, holdTo: apex, k2 });
      }
    }
    if (prevSpec && prevSpec.type === 'lane' && (prevSpec.holdTo === Infinity || this.ds(ctx.s0, prevSpec.holdTo) > 0)) specs.push(prevSpec);
    else if (prevSpec && prevSpec.type === 'switch' && this.ds(ctx.s0, prevSpec.holdTo + 40) > 0) specs.push(prevSpec);
    else if (prevSpec && prevSpec.type === 'abs') specs.push(prevSpec);
    let bestCost = Infinity; const P = this.cand, B = this.best, g = ctx.grip, brake0 = g.brake;
    const committed = rival && prevSpec && this.prevPass > 0;   // (it was going for a place: it does not give it up for a hair)
    // (racing: in a braking zone - the plan shedding speed over the next 50 m - a change of line costs, the more the
    //  further across and the harder the stop: the move is made before the braking point, as the rules say, and a
    //  swerve under braking loads the rear, which takes the brakes away - the car went into the corner 70 km/h fast)
    const brakeZone = rival && B.n > 10 ? Math.min(1, Math.max(0, (B.v[0] - B.v[10]) / 15)) : 0;
    for (const sp of specs) {
      if (sp.late) g.brake = brake0 * (1 + 0.04 * kb);
      this.build(P, sp, ctx);
      this.traffic(P, ctx);
      g.brake = brake0;
      const n = P.n, vEnd = Math.max(1, P.v[n - 1]);
      let cost = P.t[n - 1] + 25 / vEnd + P.blocked;
      // (racecraft: the place is worth more than the time over these 6 s - a path that gets past the car ahead, or
      //  alongside it, is worth having; a late stop carries its risk; leaving a move that is on costs)
      P.pass = rival ? this.passValue(P, ctx) : 0;
      if (rival) { cost -= 0.35 * P.pass; if (sp.late) cost += 0.04; if (committed && sp !== prevSpec) cost += 0.18 * kb; }
      let off = 0; for (let i = 0; i < n; i += 2) off += Math.abs(P.e[i]); cost += 0.0015 * off;
      // changing its mind costs: a little for any change, more the further the new lane is from the one it was in
      // (lateral position compared at the first node past the transition: a held position and a lane are comparable)
      if (sp !== prevSpec && prevSpec) {
        const dd8 = Math.abs(P.d[Math.min(n - 1, 8)] - (this.prevD8 ?? P.d[Math.min(n - 1, 8)]));
        cost += (0.03 + 0.02 * dd8) * (1 + 2 * (ctx.lap1 || 0)) + 0.15 * dd8 * brakeZone;
      }
      cost += ctx.racecraft ? ctx.racecraft(P, this) : 0;
      if (cost < bestCost) { bestCost = cost; P.cost = cost; P.time0 = world.time; B.copyFrom(P); }
    }
    // where the chosen path will be 40 m on (the reference the next plan's lane changes are measured against)
    this.prevD8 = this.at(B.d, ctx.s0 + 40 + ctx.v * 0.1) ?? B.d[Math.min(B.n - 1, 8)];
    this.prevPass = B.pass || 0;
    return B;
  }
  /** a car to race with the moves: the player (ctx.bold) or another AI car read by its plan (ctx.boldAI), ahead within
   *  60 m or alongside, running (not lapping me, not the safety car) */
  rivalNear(ctx) {
    for (let r = 0; r < this.nOthers; r++) {
      const R = this.others[r], o = R.car;
      if (this.rivalK(R, ctx) > 0 && R.s0 > -6 && R.s0 < 60) return R;
    }
    return null;
  }
  /** how much a car is raced with the moves (rivalNear): 0 for one that is not */
  rivalK(R, ctx) {
    const o = R.car;
    if (R.lapping || o.isSC || o.retired || o.speed <= 15) return 0;
    return Math.min(1.2, R.human ? ctx.bold || 0 : R.planned ? ctx.boldAI || 0 : 0);
  }
  /** the middle of the next corner 40 m or more ahead, inside the horizon less 60 m (absolute s), or null */
  nextApex(ctx) {
    const tr = this.track, H = ctx.n * DS;
    for (let x = 40; x < H - 60; x += 10) {
      const z = tr.inCornerZone(tr.idxAtS(ctx.s0 + x)); if (!z) continue;
      const mid = z.sA + this.ds(z.sA, z.sB) / 2, ahead = this.ds(ctx.s0, mid);
      return ahead > 30 && ahead < H - 50 ? tr.wrapS(mid) : null;
    }
    return null;
  }
  /**
   * How far path P gets on the cars it races with the moves (rivalNear) just ahead, counted in cars (each by how much
   * it is raced - rivalK): past one by the end of the time it is predicted for (6 s, or the path's end) - 1; alongside
   * it - a part of one, the more of it the further up. Only beside
   * it: where the path draws level, a car's width off it (a path through it - traffic() lets one run on into a car more
   * than 2 s off - gets nothing, nor a part of it closer than that)
   */
  passValue(P, ctx) {
    const n = P.n, tEnd = Math.min(P.t[n - 1], (PRED_N - 1) * PRED_DT), Lc = 5.9, W = ctx.width;
    let i = 1; while (i < n - 1 && P.t[i] < tEnd) i++;
    const f = Math.max(0, Math.min(1, (tEnd - P.t[i - 1]) / Math.max(1e-3, P.t[i] - P.t[i - 1]))), xMe = (i - 1 + f) * DS, q = Math.min(PRED_N - 1, Math.round(tEnd / PRED_DT));
    let v = 0;
    for (let r = 0; r < this.nOthers; r++) {
      const R = this.others[r], w = this.rivalK(R, ctx);
      if (!w || !R.ahead0 || R.s0 > 60) continue;
      const lead = xMe - R.s[q];
      if (lead <= -Lc) continue;
      let dd = Infinity;
      for (let j = 1; j <= i; j++) {
        const tq = Math.min(P.t[j], tEnd) / PRED_DT, q0 = Math.min(PRED_N - 2, Math.floor(tq)), fq = tq - q0;
        const gs = R.s[q0] + (R.s[q0 + 1] - R.s[q0]) * fq - j * DS;
        if (gs > -Lc && gs < Lc) dd = Math.min(dd, Math.abs(R.d[q0] + (R.d[q0 + 1] - R.d[q0]) * fq - P.d[j]));
      }
      const side = dd === Infinity ? 1 : Math.max(0, Math.min(1, (dd - 0.6 * W) / (0.4 * W)));
      v += w * side * (lead > 2 ? 1 : 0.5 * (lead + Lc) / (Lc + 2));
    }
    return v;
  }
  anyNear(ctx) {
    for (let r = 0; r < this.nOthers; r++) { const R = this.others[r]; if (R.s0 > -12 && R.s0 < ctx.n * DS + 40) return true; }
    return false;
  }

  // ---- reading the plan -------------------------------------------------------------------------------------------
  /** a node array of the chosen path at absolute s (clamped to the path; null beyond it) */
  at(arr, s) {
    const B = this.best; if (!B.n) return null;
    const x = this.ds(B.s0, s) / DS; if (x < 0) return arr[0]; if (x >= B.n - 1) return null;
    const i = Math.floor(x), f = x - i; return arr[i] + (arr[i + 1] - arr[i]) * f;
  }
}
