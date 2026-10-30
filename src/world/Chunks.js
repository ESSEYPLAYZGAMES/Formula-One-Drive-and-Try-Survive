// The other half of a car torn in two, and every piece that breaks off a car (a wing, a wheel, the nose, a sidepod's
// panel - vehicle/CarMesh.js): a free rigid body (box contact points, gravity, drag, friction against the ground,
// barriers where they stand) carrying its meshes. It tumbles, bounces and slides to rest, and stays there. (The car
// records each one's flight: a flashback or a replay puts it back where it was - CarMesh._record, _resume.) It flies in the
// world as drawn - on a circuit that is not flat, from the car's own height - and meets the ground where the ground is
// (world/Terrain.js), the barriers and buildings at their heights over it.
import * as THREE from 'three';
import { TERRAIN } from './Terrain.js';

const G = 9.81;
const _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _w = new THREE.Vector3(), _r = new THREE.Vector3(), _j = new THREE.Vector3(), _ax = new THREE.Vector3();
const BAR_H = [0, 0.85, 1.3, 4.2];

export class Chunks {
  constructor(scene) { this.scene = scene; this.list = []; this.track = null; }
  /**
   * @param root THREE.Object3D placed at the body's centre (world), holding its meshes
   * @param v world velocity (m/s), w angular velocity (rad/s, world), half extents [hx, hy, hz] (m), mass (kg)
   * @returns the body (v, w: THREE.Vector3s; done: at rest)
   */
  add(root, v, w, half, mass = 260) {
    this.scene.add(root);
    const [hx, hy, hz] = half;
    const pts = []; for (const x of [-hx, hx]) for (const y of [-hy, hy]) for (const z of [-hz, hz]) pts.push(new THREE.Vector3(x, y, z));
    // (a box's inertia, as one scalar: good enough for a tumbling half-car)
    const I = mass * (hx * hx + hy * hy + hz * hz) / 3;
    const c = { root, v: new THREE.Vector3(...v), w: new THREE.Vector3(...w), pts, mass, I, rest: 0, done: false, hy };
    this.list.push(c); return c;
  }
  /** take one body out (a flashback: it has not broken off yet) */
  remove(c) { const i = this.list.indexOf(c); if (i >= 0) this.list.splice(i, 1); this.scene.remove(c.root); }
  update(dt) {
    if (dt <= 0) return;
    const tr = this.track, n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n;
    for (const c of this.list) {
      if (c.done) continue;
      for (let s = 0; s < n; s++) this.step(c, h, tr);
    }
  }
  step(c, dt, tr) {
    const o = c.root, v = c.v, w = c.w;
    v.y -= G * dt; v.multiplyScalar(Math.max(0, 1 - 0.02 * v.length() * dt)); w.multiplyScalar(Math.max(0, 1 - 0.3 * dt));
    o.position.addScaledVector(v, dt);
    const wl = w.length(); if (wl > 1e-4) { _q.setFromAxisAngle(_ax.copy(w).divideScalar(wl), wl * dt); o.quaternion.premultiply(_q); }
    // the barrier frame at this point of the circuit
    let wallL = Infinity, wallR = Infinity, hL = 0, hR = 0, nx = 0, nz = 0, px = 0, pz = 0;
    if (tr) {
      const q = tr.nearest(o.position.x, o.position.z, c.ti ?? -1, c.tq || (c.tq = {})); c.ti = q.i;
      const i = q.i; nx = tr.nx[i]; nz = tr.nz[i]; px = tr.px[i]; pz = tr.pz[i];
      wallL = tr.barL[i] ? tr.wallL[i] : Infinity; wallR = tr.barR[i] ? tr.wallR[i] : Infinity; hL = tr.barrierHeight(i, 1); hR = tr.barrierHeight(i, -1);
    }
    const dcC = (o.position.x - px) * nx + (o.position.z - pz) * nz, outC = Math.abs(dcC) > (dcC > 0 ? wallL : wallR);
    let lift = 0;
    for (const lp of c.pts) {
      _r.copy(lp).applyQuaternion(o.quaternion);
      const gy = TERRAIN.on ? TERRAIN.at(o.position.x + _r.x, o.position.z + _r.z) : 0, wy = o.position.y + _r.y - gy;   // (wy: over the ground there)
      // ---- ground
      if (wy < 0) {
        lift = Math.max(lift, -wy);
        _v.copy(w).cross(_r).add(v);   // point velocity
        if (_v.y < 0) {
          const k = 1 / c.mass + (_r.x * _r.x + _r.z * _r.z) / c.I;
          const jn = -(1 + (_v.y < -3 ? 0.25 : 0)) * _v.y / k;
          // friction: scraping bodywork
          const tl = Math.hypot(_v.x, _v.z), jt = tl > 1e-3 ? Math.min(0.75 * jn, tl / (1 / c.mass + (_r.lengthSq()) / c.I)) : 0;
          _j.set(tl > 1e-3 ? -_v.x / tl * jt : 0, jn, tl > 1e-3 ? -_v.z / tl * jt : 0);
          v.addScaledVector(_j, 1 / c.mass); w.add(_w.copy(_r).cross(_j).divideScalar(c.I));
        }
      }
      // ---- buildings and grandstands
      if (this.obstacles && this.obstacles.hit(o.position.x + _r.x, o.position.z + _r.z, wy, this._oh || (this._oh = {}))) {
        const h = this._oh; o.position.x += h.nx * h.pen; o.position.z += h.nz * h.pen;
        _v.copy(w).cross(_r).add(v); const vn = _v.x * h.nx + _v.z * h.nz;
        if (vn < 0) { const jn = -1.2 * vn / (1 / c.mass + _r.lengthSq() / c.I); _j.set(h.nx * jn, 0, h.nz * jn); v.addScaledVector(_j, 1 / c.mass); w.add(_w.copy(_r).cross(_j).divideScalar(c.I)); }
      }
      // ---- barriers (from the side the half is on)
      if (tr) {
        const wx = o.position.x + _r.x, wz = o.position.z + _r.z, dc = (wx - px) * nx + (wz - pz) * nz, side = dc > 0 ? 1 : -1, wall = side > 0 ? wallL : wallR;
        const through = outC ? Math.sign(dc) === Math.sign(dcC) && Math.abs(dc) < wall : Math.abs(dc) > wall;
        if (through && wy < (side > 0 ? hL : hR)) {
          const sg = outC ? -1 : 1, bx = -nx * side * sg, bz = -nz * side * sg, pen = outC ? wall - Math.abs(dc) : Math.abs(dc) - wall;
          o.position.x += bx * pen; o.position.z += bz * pen;
          _v.copy(w).cross(_r).add(v); const vn = _v.x * bx + _v.z * bz;
          if (vn < 0) { const jn = -1.2 * vn / (1 / c.mass + _r.lengthSq() / c.I); _j.set(bx * jn, 0, bz * jn); v.addScaledVector(_j, 1 / c.mass); w.add(_w.copy(_r).cross(_j).divideScalar(c.I)); }
        }
      }
    }
    if (lift > 0) o.position.y += lift * 0.8;
    if (v.length() < 0.3 && w.length() < 0.3) c.rest += dt; else c.rest = 0;
    if (c.rest > 0.8) c.done = true;
  }
  clear() {
    for (const c of this.list) { this.scene.remove(c.root); c.root.traverse((m) => { if (m.isMesh && m.userData.ownGeo) m.geometry.dispose(); }); }
    this.list = [];
  }
}
