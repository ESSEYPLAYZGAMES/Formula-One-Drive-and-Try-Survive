// The TV helicopter: one aircraft with its own place, speed and weight, chasing a car - for the broadcast
// (camera/TVDirector.js) and the replay theatre (ui/Theatre.js).
// It is not fixed to the car. It flies toward a place some ninety metres short of the car along the line from where it
// is - so it comes at the car from wherever it happens to be, never swung round to "behind and left" - at up to about
// 280 km/h with a helicopter's acceleration: on a straight the car pulls away and the lens goes long; into the braking
// zone and through the slow corners it catches up, cuts the corner and drifts past. A car standing still is circled
// slowly. Where something stands between it and the car it climbs and comes in closer over it, and goes back out and
// down when it has had a clear view for a while: one long shot - it never jumps to another place.
import * as THREE from 'three';

const VMAX = 78, AMAX = 16, R0 = 90, H0 = 62, LEAD = 1.2;   // (LEAD: it flies for where the car will be in a moment - a pilot who knows the circuit)
/** where it may begin, relative to the car: [bearing off its heading (rad: PI = straight behind), metres away, metres up] */
const START = [[2.6, R0, H0], [-2.6, R0, H0], [2.1, R0, H0], [-2.1, R0, H0], [3.14, 70, H0 + 22], [2.6, 50, 110], [-2.6, 50, 110], [3.14, 15, 170]];
let starts = 0;

export class HeliCam {
  constructor() { this.p = new THREE.Vector3(); this.v = new THREE.Vector3(); this.on = false; this.up = 0; this.close = 0; this.chk = 0; this.see = true; this.clearT = 0; this.blockT = 0; this.ux = 1; this.uz = 0; this.t = 0; }
  /** flying, and within r metres of (x, z): a new subject there is the same flight carried on */
  near(x, z, r = 320) { return this.on && Math.hypot(this.p.x - x, this.p.z - z) < r; }
  stop() { this.on = false; }
  /**
   * Begin a flight on a car. car: { x, y (the ground under it), z, th, vx, vz }; o: { clear(px, py, pz, tx, ty, tz) -> a
   * clear line of sight, ground(x, z) -> height }. The first place with a view of it: behind it to one side (the side
   * taken in turn), behind it higher, nearly overhead.
   */
  start(car, o = {}) {
    const c = Math.cos(car.th), s = Math.sin(car.th), flip = (starts++ & 1) ? -1 : 1; let at = null;
    for (const [a0, r, h] of START) {
      const a = a0 * flip, dx = Math.cos(a) * r, dz = Math.sin(a) * r, x = car.x + c * dx - s * dz, z = car.z + s * dx + c * dz, y = Math.max(car.y + h, (o.ground ? o.ground(x, z) : 0) + 35);
      at = [x, y, z, h, r]; if (!o.clear || o.clear(x, y, z, car.x, car.y + 1, car.z)) break;
    }
    this.p.set(at[0], at[1], at[2]);
    const sp = Math.hypot(car.vx, car.vz), k = 0.85 * (sp > VMAX ? VMAX / sp : 1); this.v.set(car.vx * k, 0, car.vz * k);
    this.up = Math.max(0, at[3] - H0); this.close = Math.max(0, Math.min(1, (R0 - at[4]) / (R0 - 18)));
    const d = Math.hypot(car.x - at[0], car.z - at[2]) || 1; this.ux = (car.x - at[0]) / d; this.uz = (car.z - at[2]) / d;
    this.on = true; this.chk = 0; this.see = true; this.clearT = 0; this.blockT = 0; this.t = 0;
  }
  /** dt seconds of flight after the car (o: as start's, and overhead: the car is in the pit lane - from nearly over it) */
  update(dt, car, o = {}) {
    if (!this.on) this.start(car, o);
    if (!(dt > 0)) return;
    const n = Math.max(1, Math.min(8, Math.ceil(dt / 0.05))), h = dt / n;
    for (let i = 0; i < n; i++) this._step(h, car, o);
  }
  _step(dt, car, o) {
    const p = this.p, v = this.v; this.t += dt;
    const dx = car.x - p.x, dz = car.z - p.z, dist = Math.hypot(dx, dz);
    // (the line it comes in along turns with where the car goes - slowly, and not at all right over the car)
    if (dist > 30) { const k = Math.min(1, dt * 4); let ux = this.ux + (dx / dist - this.ux) * k, uz = this.uz + (dz / dist - this.uz) * k; const l = Math.hypot(ux, uz) || 1; this.ux = ux / l; this.uz = uz / l; }
    // ---- can it see the car? looked at a few times a second
    this.chk -= dt; if (this.chk <= 0) { this.chk = 0.3; this.see = !o.clear || o.clear(p.x, p.y, p.z, car.x, car.y + 1, car.z); }
    // (something in the way: up, and in closer over the car; a clear view for a while: back out and down, gently)
    if (!this.see) { this.blockT += dt; this.clearT = 0; this.up = Math.min(125, this.up + 32 * dt); this.close = Math.min(1, this.close + 0.55 * dt); }
    else { this.blockT = 0; this.clearT += dt; if (o.overhead) { this.close = Math.min(1, this.close + 0.5 * dt); this.up = Math.min(Math.max(this.up, 70), this.up + 25 * dt); } else if (this.clearT > 3) { this.up = Math.max(0, this.up - 5 * dt); this.close = Math.max(0, this.close - 0.07 * dt); } }
    // ---- the place to be: R short of the car along that line; toward it no faster than it can stop for it
    const R = R0 + (18 - R0) * this.close, sp = Math.hypot(car.vx, car.vz);
    const ex = car.x + car.vx * LEAD - this.ux * R - p.x, ez = car.z + car.vz * LEAD - this.uz * R - p.z, e = Math.hypot(ex, ez) || 1e-6, ve = Math.min(0.75 * e, Math.sqrt(1.3 * AMAX * e));
    let wx = ex / e * ve + car.vx * 0.8, wz = ez / e * ve + car.vz * 0.8;
    // (a car standing still: a slow circle round it)
    const still = 1 - Math.min(1, sp / 12); wx += -this.uz * 9 * still; wz += this.ux * 9 * still;
    // (as fast as it flies - a little more when the car is far down a straight, so it is never lost)
    const vmax = VMAX + Math.max(0, Math.min(40, (dist - 120) * 0.35)), wl = Math.hypot(wx, wz); if (wl > vmax) { wx *= vmax / wl; wz *= vmax / wl; }
    let ax = (wx - v.x) / 0.8, az = (wz - v.z) / 0.8; const al = Math.hypot(ax, az); if (al > AMAX) { ax *= AMAX / al; az *= AMAX / al; }
    v.x += ax * dt; v.z += az * dt; p.x += v.x * dt; p.z += v.z * dt;
    // ---- its height: over the car's ground, never low over its own; a slow breath of drift
    const gy = o.ground ? o.ground(p.x, p.z) : 0, want = Math.max(car.y + H0 + this.up + 0.22 * Math.max(0, dist - 100), gy + 35) + Math.sin(this.t * 0.37) * 1.3;   // (the further off, the higher: it looks down the road at the car, not along it)
    p.y += (want - p.y) * Math.min(1, dt * 0.9);
  }
  /** the long lens for the car at (x, y, z): tighter the further off it is (degrees) */
  fov(x, y, z) { const d = Math.hypot(this.p.x - x, this.p.y - y, this.p.z - z); return Math.max(6, Math.min(34, THREE.MathUtils.radToDeg(2 * Math.atan(21 / Math.max(30, d))))); }
}
