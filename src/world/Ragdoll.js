// A crew member hit by a car: a ragdoll. Fifteen points - the pelvis, the chest (the neck's base), the head, the
// shoulders, elbows and hands, the hips, knees and ankles - held at their lengths by sticks (and the torso braced into a
// box, the head on the shoulders), under gravity, on the ground, and against the cars: each car the shape it is (a
// height over its footprint - the front wing low, the nose rising, the wheels, the cockpit and the halo, the sidepods,
// the engine cover, the rear wing), in its own frame, moving. A body met by the nose at speed is swept off its feet,
// lands on the car, slides and tumbles over it and off the back. Verlet at 240 Hz; asleep once it lies still (a car
// over it wakes it). The pose goes to the person's skeleton (world/PersonRig.js) bone by bone: the torso's frame from
// the pelvis, the chest and the hips' or shoulders' line, each limb turned from its bind pose's direction to its points'.
import * as THREE from 'three';

const PN = ['pelvis', 'chest', 'head', 'shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'thL', 'knL', 'anL', 'thR', 'knR', 'anR'];
const I = Object.fromEntries(PN.map((k, i) => [k, i]));
const RAD = [0.13, 0.14, 0.12, 0.07, 0.05, 0.05, 0.07, 0.05, 0.05, 0.09, 0.07, 0.06, 0.09, 0.07, 0.06];
const INV = [1 / 3, 1 / 3, 1 / 1.2, 1, 1 / 0.6, 1 / 0.4, 1, 1 / 0.6, 1 / 0.4, 1 / 1.5, 1, 1 / 0.6, 1 / 1.5, 1, 1 / 0.6];
// [a, b, stiffness]: the bones, then the torso braced (shoulders to hips, crossways) and the head kept on the shoulders
const STICKS = [
  ['pelvis', 'chest', 1], ['chest', 'head', 1], ['chest', 'shL', 1], ['chest', 'shR', 1], ['shL', 'shR', 1],
  ['shL', 'elL', 1], ['elL', 'haL', 1], ['shR', 'elR', 1], ['elR', 'haR', 1],
  ['pelvis', 'thL', 1], ['pelvis', 'thR', 1], ['thL', 'thR', 1], ['thL', 'knL', 1], ['knL', 'anL', 1], ['thR', 'knR', 1], ['knR', 'anR', 1],
  ['shL', 'thL', 1], ['shR', 'thR', 1], ['shL', 'thR', 1], ['shR', 'thL', 1], ['chest', 'thL', 1], ['chest', 'thR', 1],
  ['head', 'shL', 0.5], ['head', 'shR', 0.5], ['head', 'pelvis', 0.3],
].map(([a, b, k]) => [I[a], I[b], k]);
// joints that do not fold right up: [a, b, share of the straight length it can close to]
const MINS = [['thL', 'anL', 0.45], ['thR', 'anR', 0.45], ['shL', 'haL', 0.3], ['shR', 'haR', 0.3]].map(([a, b, k]) => [I[a], I[b], k]);
const H = 1 / 240, G = 9.81;

/** the car's height (m) over its footprint at (x forward from its centre of mass, z across) - 0 off it */
export function carTop(x, z) {
  const a = Math.abs(z);
  if (x > 3.12 || x < -2.62 || a > 1.0) return 0;
  if (x > 2.35) return a < 0.98 ? 0.28 : 0;                                        // the front wing
  if (x > 1.45) {
    if (a > 0.56 && x > 1.49 && x < 2.22) return 0.73;                             // the front wheels
    return a < 0.3 ? 0.32 + (2.35 - x) * 0.25 : a < 0.56 ? 0.36 : 0;                // the nose (rising), the wishbones
  }
  if (x > -1.18) { if (a < 0.42) return x > -0.45 && x < 0.75 ? 0.95 : 0.74; return a < 0.86 ? (x > 1.0 ? 0.5 : 0.63) : 0; }   // the cockpit, the halo; the sidepods
  if (x > -1.95) { if (a > 0.54 && a < 0.98) return 0.74; return a < 0.3 ? 0.86 : a < 0.54 ? 0.55 : 0; }   // the rear wheels; the engine cover
  return a < 0.52 ? 0.95 : 0;                                                      // the rear wing
}
/** the same, for a ball of radius r centred at (x, z) */
export function carTopR(x, z, r) { const q = r * 0.7; return Math.max(carTop(x, z), carTop(x + q, z), carTop(x - q, z), carTop(x, z + q), carTop(x, z - q)); }

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3(), _n = new THREE.Vector3(), _v = new THREE.Vector3();
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _qi = new THREE.Quaternion();

export class Ragdoll {
  /** rig: a PersonRig (its bones b and bind-pose joints W) */
  constructor(rig) {
    this.rig = rig; this.p = PN.map(() => new THREE.Vector3()); this.o = PN.map(() => new THREE.Vector3()); this.last = PN.map(() => new THREE.Vector3());
    this.L = []; this.still = 0; this.asleep = false;
    const W = rig.W, n = (a, b) => b.clone().sub(a).normalize();
    // the bind pose's directions (bones in it have no turn of their own: the arms are out at 40 degrees in the mesh)
    this.rest = {
      head: n(W.neck, W.head.clone().add(new THREE.Vector3(0, 0.12, 0))),
      shL: n(W.shL, W.elL), elL: n(W.elL, W.haL), shR: n(W.shR, W.elR), elR: n(W.elR, W.haR),
      thL: n(W.thL, W.knL), knL: n(W.knL, W.anL), thR: n(W.thR, W.knR), knR: n(W.knR, W.anR),
    };
    this.Q = {}; for (const k of ['hips', 'spine', 'chest', 'neck', 'shL', 'elL', 'shR', 'elR', 'thL', 'knL', 'thR', 'knR']) this.Q[k] = new THREE.Quaternion();
  }
  /** from the person as they stand now (the rig posed and placed); v: an initial velocity */
  start(v = null) {
    const b = this.rig.b, mesh = this.rig.mesh; mesh.updateMatrixWorld(true);
    const at = { pelvis: b.hips, chest: b.neck, shL: b.shL, elL: b.elL, haL: b.haL, shR: b.shR, elR: b.elR, haR: b.haR, thL: b.thL, knL: b.knL, anL: b.anL, thR: b.thR, knR: b.knR, anR: b.anR };
    PN.forEach((k, i) => { if (k === 'head') b.head.localToWorld(this.p[i].set(0, 0.12, 0)); else at[k].getWorldPosition(this.p[i]); this.o[i].copy(this.p[i]); if (v) this.o[i].addScaledVector(v, -H); this.last[i].copy(this.p[i]); });
    this.L = STICKS.map(([a, c]) => this.p[a].distanceTo(this.p[c]));
    this.M = MINS.map(([a, c, k]) => {
      const via = a === I.thL ? I.knL : a === I.thR ? I.knR : a === I.shL ? I.elL : I.elR;
      return k * (this.p[a].distanceTo(this.p[via]) + this.p[via].distanceTo(this.p[c]));
    });
    this.still = 0; this.asleep = false;
    // (the mesh at the world's origin from now on: the bones carry the whole of it)
    mesh.position.set(0, 0, 0); mesh.rotation.set(0, 0, 0); mesh.updateMatrixWorld(true);
  }
  /** does any of the cars (see step) overlap it now */
  touched(cars) {
    for (const c of cars) for (let i = 0; i < PN.length; i += 2) { const p = this.p[i], dx = p.x - c.x, dz = p.z - c.z, co = Math.cos(c.th), sn = Math.sin(c.th); const lx = dx * co + dz * sn, lz = -dx * sn + dz * co; if (Math.abs(lx) < 3.4 && Math.abs(lz) < 1.3 && p.y - RAD[i] < carTopR(lx, lz, RAD[i])) return true; }
    return false;
  }
  /**
   * dt: the frame's time; cars: [{ x, z, px, pz (where it was a frame ago), th, vx, vz }] near it.
   * -> true while it moves
   */
  step(dt, cars) {
    if (dt <= 0) return !this.asleep;
    if (this.asleep) { if (!this.touched(cars)) return false; this.asleep = false; this.still = 0; }
    const n = Math.max(1, Math.min(12, Math.round(dt / H))), h = dt / n, P = this.p, O = this.o;
    for (let s = 0; s < n; s++) {
      const f = (s + 1) / n;
      for (let i = 0; i < P.length; i++) { _v.subVectors(P[i], O[i]).multiplyScalar(0.999); O[i].copy(P[i]); P[i].add(_v); P[i].y -= G * h * h; }
      for (let it = 0; it < 6; it++) {
        STICKS.forEach(([a, c, k], j) => this._stick(a, c, this.L[j], k, false));
        MINS.forEach(([a, c], j) => this._stick(a, c, this.M[j], 1, true));
      }
      for (let i = 0; i < P.length; i++) { this._cars(i, cars, f, h); this._ground(i, h); }
      STICKS.forEach(([a, c, k], j) => this._stick(a, c, this.L[j], k, false));
    }
    // asleep after lying still a while
    let mv = 0; for (let i = 0; i < P.length; i++) { mv = Math.max(mv, P[i].distanceTo(this.last[i])); this.last[i].copy(P[i]); }
    this.still = mv < 0.004 ? this.still + dt : 0; if (this.still > 1.2) this.asleep = true;
    return true;
  }
  _stick(a, c, L, k, min) {
    const P = this.p, d = _a.subVectors(P[c], P[a]), len = d.length() || 1e-6;
    if (min && len >= L) return;
    const wa = INV[a], wc = INV[c], diff = ((len - L) / len) * k / (wa + wc);
    P[a].addScaledVector(d, diff * wa); P[c].addScaledVector(d, -diff * wc);
  }
  _ground(i, h) {
    const p = this.p[i], o = this.o[i], r = RAD[i];
    if (p.y >= r) return;
    const vx = (p.x - o.x) / h, vy = (p.y - o.y) / h, vz = (p.z - o.z) / h;
    p.y = r;
    // (a little bounce; friction on the tarmac - a body slides to a stop within a few metres)
    const sp = Math.hypot(vx, vz), k = sp > 1e-6 ? Math.max(0, sp - 8.5 * h) / sp : 0, ny = vy < 0 ? -vy * 0.15 : vy;
    o.set(p.x - vx * k * h, p.y - ny * h, p.z - vz * k * h);
  }
  _cars(i, cars, f, h) {
    const p = this.p[i], o = this.o[i], r = RAD[i];
    for (const c of cars) {
      const cx = c.px + (c.x - c.px) * f, cz = c.pz + (c.z - c.pz) * f, co = Math.cos(c.th), sn = Math.sin(c.th);
      const dx = p.x - cx, dz = p.z - cz, lx = dx * co + dz * sn, lz = -dx * sn + dz * co;
      if (Math.abs(lx) > 3.5 || Math.abs(lz) > 1.3 || p.y > 1.3) continue;
      const top = carTopR(lx, lz, r); if (top <= 0 || p.y - r >= top) continue;
      // in: out by the shortest way - up onto it, off its front or back, off its side (each found by walking out
      // over the shape at this height)
      const y0 = p.y - r, clear = (x, z) => carTopR(x, z, r) <= y0;
      let best = top - y0, ax = 0, ay = 1, az = 0;
      { let x = lx; while (x < 3.6 && !clear(x, lz)) x += 0.04; if (x - lx < best) { best = x - lx; ax = 1; ay = 0; az = 0; } }
      { let x = lx; while (x > -3.1 && !clear(x, lz)) x -= 0.04; if (lx - x < best) { best = lx - x; ax = -1; ay = 0; az = 0; } }
      { const sg = Math.sign(lz) || 1; let z = lz; while (Math.abs(z) < 1.4 && !clear(lx, z)) z += sg * 0.04; if (Math.abs(z - lz) < best) { best = Math.abs(z - lz); ax = 0; ay = 0; az = sg; } }
      // (off its front, outward too - the nose is pointed, the wing's endplates swept: a body met off its centreline is
      //  knocked aside, out of its way, not shoved on ahead of it)
      if (ax > 0) { az = 0.7 * Math.max(-1, Math.min(1, lz / 0.45)); const l = Math.hypot(ax, az); ax /= l; az /= l; }
      // (world normal: the car's forward is (cos, sin), its across (-sin, cos))
      _n.set(ax * co - az * sn, ay, ax * sn + az * co);
      _v.subVectors(p, o).divideScalar(h);
      p.addScaledVector(_n, best);
      // the velocity: off the car as it is moving - what was going into it taken away (a little bounce), and dragged
      // along its surface by friction
      const rvx = _v.x - c.vx, rvy = _v.y, rvz = _v.z - c.vz, vn = rvx * _n.x + rvy * _n.y + rvz * _n.z;
      let ux = rvx, uy = rvy, uz = rvz;
      if (vn < 0) { ux -= _n.x * vn * 1.2; uy -= _n.y * vn * 1.2; uz -= _n.z * vn * 1.2; }
      // (Coulomb: the drag no more than half of how hard it is pressed on - a body thrown onto the car slides back
      //  along it and off, rather than riding away on it)
      const un = ux * _n.x + uy * _n.y + uz * _n.z, tx = ux - _n.x * un, ty = uy - _n.y * un, tz = uz - _n.z * un, tl = Math.hypot(tx, ty, tz);
      const kf = tl > 1e-6 ? Math.min(1, 0.5 * ((vn < 0 ? -vn * 1.2 : 0) + G * h) / tl) : 0;
      ux -= tx * kf; uy -= ty * kf; uz -= tz * kf;
      o.set(p.x - (ux + c.vx) * h, p.y - uy * h, p.z - (uz + c.vz) * h);
    }
  }
  /** the points to the skeleton */
  write() {
    const P = this.p, b = this.rig.b, R = this.rest, Q = this.Q;
    const frame = (q, up, l) => { _b.copy(l).addScaledVector(up, -l.dot(up)).normalize(); _c.crossVectors(up, _b); _m.makeBasis(_c, up, _b); q.setFromRotationMatrix(_m); };
    _a.subVectors(P[I.chest], P[I.pelvis]).normalize(); const up = _d.copy(_a);
    frame(Q.hips, up, _v.subVectors(P[I.thL], P[I.thR]));
    frame(Q.chest, up, _v.subVectors(P[I.shL], P[I.shR]));
    Q.spine.copy(Q.hips).slerp(Q.chest, 0.5);
    const limb = (q, parent, rest, a, c) => { _v.copy(rest).applyQuaternion(parent); _a.subVectors(P[c], P[a]).normalize(); q.setFromUnitVectors(_v, _a).multiply(parent); };
    limb(Q.neck, Q.chest, R.head, I.chest, I.head);
    limb(Q.shL, Q.chest, R.shL, I.shL, I.elL); limb(Q.elL, Q.shL, R.elL, I.elL, I.haL);
    limb(Q.shR, Q.chest, R.shR, I.shR, I.elR); limb(Q.elR, Q.shR, R.elR, I.elR, I.haR);
    limb(Q.thL, Q.hips, R.thL, I.thL, I.knL); limb(Q.knL, Q.thL, R.knL, I.knL, I.anL);
    limb(Q.thR, Q.hips, R.thR, I.thR, I.knR); limb(Q.knR, Q.thR, R.knR, I.knR, I.anR);
    const local = (bone, parent, world) => { if (parent) bone.quaternion.copy(_qi.copy(parent).invert()).multiply(world); else bone.quaternion.copy(world); };
    b.hips.position.copy(P[I.pelvis]); local(b.hips, null, Q.hips);
    local(b.spine, Q.hips, Q.spine); local(b.chest, Q.spine, Q.chest); local(b.neck, Q.chest, Q.neck); b.head.quaternion.identity();
    local(b.shL, Q.chest, Q.shL); local(b.elL, Q.shL, Q.elL); b.haL.quaternion.identity();
    local(b.shR, Q.chest, Q.shR); local(b.elR, Q.shR, Q.elR); b.haR.quaternion.identity();
    local(b.thL, Q.hips, Q.thL); local(b.knL, Q.thL, Q.knL); b.anL.quaternion.identity();
    local(b.thR, Q.hips, Q.thR); local(b.knR, Q.thR, Q.knR); b.anR.quaternion.identity();
    void _q; void _q2;
  }
}
