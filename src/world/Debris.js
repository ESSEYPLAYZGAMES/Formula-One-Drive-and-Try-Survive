// Crash debris: carbon shards, wing elements, endplates and whole wheels. Every kind is one InstancedMesh with a
// fixed pool (the oldest piece is recycled when a pool is full), so a multi-car pile-up costs five draw calls.
// Pieces fly, bounce and slide on the ground, then lie still: a resting piece is no longer updated at all.
// Small carbon shards are swept away soon after they settle (they shrink out over half a second), a few stay for
// minutes; the big parts (wing planes, endplates, rear wings, wheels) mostly stay for good - but not on the racing
// surface: once one has lain there a while the marshals drag it off to the verge (Debris.sweep, set by the game).
import * as THREE from 'three';
import { TERRAIN } from './Terrain.js';
// (the pieces fly and settle on the flat plan; drawn on the ground's height where the circuit is not flat - world/Terrain.js)
const _lp = new THREE.Vector3(), onGround = (p) => (TERRAIN.on ? _lp.set(p.x, p.y + TERRAIN.at(p.x, p.z), p.z) : p);

const G = 9.81;
const KINDS = {
  // life: seconds a piece lasts (plus up to half again, at random); keep: share that stays keepLife seconds instead
  // (big: a part the marshals drag off the racing surface rather than leave to be swept)
  shard: { max: 320, life: 7, keep: 0.12, keepLife: 300, geo: () => new THREE.BoxGeometry(0.22, 0.025, 0.14), half: 0.015 },
  plate: { max: 40, life: 25, keep: 0.85, keepLife: Infinity, big: true, geo: () => new THREE.BoxGeometry(0.5, 0.035, 1.7), half: 0.02 },     // front wing main plane
  endplate: { max: 48, life: 18, keep: 0.5, keepLife: Infinity, big: true, geo: () => new THREE.BoxGeometry(0.8, 0.26, 0.025), half: 0.015 },
  rearwing: { max: 24, life: 30, keep: 0.9, keepLife: Infinity, big: true, geo: () => new THREE.BoxGeometry(0.45, 0.04, 0.95), half: 0.025 },
  strip: { max: 60, life: 3, keep: 0.08, keepLife: 90, geo: () => new THREE.BoxGeometry(0.24, 0.008, 0.035), half: 0.004 },   // a strip of tread
  tyre: { max: 32, life: 40, keep: 1, keepLife: Infinity, big: true, geo: () => { const g = new THREE.CylinderGeometry(0.36, 0.36, 0.36, 18); g.rotateX(Math.PI / 2); return g; }, half: 0.18 },
};
const SWEEP_AFTER = 14, SWEEP_T = 2.5;   // a big part lies on the road this long before the marshals drag it off, over this long
const FADE = 0.5;   // seconds a piece takes to shrink away
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 1, 1), _sf = new THREE.Vector3(), _hide = new THREE.Vector3(0, 0, 0), _ax = new THREE.Vector3(), _c = new THREE.Color();

class Pool {
  constructor(spec, mat) {
    this.spec = spec; this.mesh = new THREE.InstancedMesh(spec.geo(), mat, spec.max);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.mesh.frustumCulled = false; this.mesh.count = spec.max;
    for (let i = 0; i < spec.max; i++) { this.mesh.setColorAt(i, _c.set(0x111111)); _m.compose(_hide, _q.identity(), _hide); this.mesh.setMatrixAt(i, _m); }
    this.items = []; for (let i = 0; i < spec.max; i++) this.items.push({ on: false, sleep: true, age: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), q: new THREE.Quaternion(), w: new THREE.Vector3() });
    this.next = 0; this.dirty = false; this.mesh.visible = false;
  }
  spawn(x, y, z, vx, vy, vz, color, spin) {
    const k = this.next; this.next = (this.next + 1) % this.spec.max;   // ring buffer: the oldest piece makes way
    const it = this.items[k]; it.on = true; it.sleep = false; it.age = 0; it.swept = false; it.drag = null;
    const sp = this.spec; it.ttl = Math.random() < sp.keep ? sp.keepLife : sp.life * (1 + 0.5 * Math.random());
    it.p.set(x, Math.max(y, this.spec.half), z); it.v.set(vx, vy, vz);
    it.q.setFromEuler(new THREE.Euler(Math.random() * 6.3, Math.random() * 6.3, Math.random() * 6.3));
    it.w.set((Math.random() - 0.5) * spin, (Math.random() - 0.5) * spin, (Math.random() - 0.5) * spin);
    this.mesh.setColorAt(k, _c.set(color)); this.mesh.instanceColor.needsUpdate = true; this.dirty = true; this.mesh.visible = true;
  }
  update(dt, sweep) {
    const half = this.spec.half; let live = 0;
    for (let k = 0; k < this.items.length; k++) {
      const it = this.items[k]; if (!it.on) continue;
      live++;
      it.age += dt;
      if (it.age > it.ttl) { it.on = false; _m.compose(_hide, _q.identity(), _hide); this.mesh.setMatrixAt(k, _m); this.dirty = true; continue; }
      const fading = it.age > it.ttl - FADE;   // swept away: shrink out (a resting piece is woken for this half second only)
      if (fading) _sf.setScalar(Math.max(0.01, (it.ttl - it.age) / FADE));
      // a big part at rest on the racing surface: dragged off to the verge (and left there)
      if (it.sleep && this.spec.big && sweep && !it.swept && it.age > SWEEP_AFTER) {
        it.swept = true; const to = sweep(it.p.x, it.p.z);
        if (to) it.drag = { t: 0, x0: it.p.x, z0: it.p.z, x1: to[0], z1: to[1] };
      }
      if (it.drag) {
        const D = it.drag; D.t += dt; const u = Math.min(1, D.t / SWEEP_T), e = u * u * (3 - 2 * u);
        it.p.x = D.x0 + (D.x1 - D.x0) * e; it.p.z = D.z0 + (D.z1 - D.z0) * e;
        this.mesh.setMatrixAt(k, _m.compose(onGround(it.p), it.q, _s)); this.dirty = true;
        if (u >= 1) it.drag = null;
        continue;
      }
      if (it.sleep) { if (fading) { this.mesh.setMatrixAt(k, _m.compose(onGround(it.p), it.q, _sf)); this.dirty = true; } continue; }
      it.v.y -= G * dt; it.p.addScaledVector(it.v, dt);
      const wl = it.w.length(); if (wl > 1e-3) { _q.setFromAxisAngle(_ax.copy(it.w).divideScalar(wl), wl * dt); it.q.premultiply(_q); }
      if (it.p.y < half) {                                    // hits the ground: bounce, scrub speed, slow the spin
        it.p.y = half;
        if (it.v.y < 0) it.v.y = -it.v.y * 0.3;
        it.v.x *= 0.72; it.v.z *= 0.72; it.w.multiplyScalar(0.6);
        if (it.v.y < 0.4 && it.v.x * it.v.x + it.v.z * it.v.z < 0.08) {
          // at rest: lie flat on the ground at whatever heading it ended up with, and stop updating
          it.sleep = true; it.v.set(0, 0, 0); it.w.set(0, 0, 0);
          const e = new THREE.Euler().setFromQuaternion(it.q, 'YXZ'); it.q.setFromEuler(new THREE.Euler(0, e.y, 0, 'YXZ'));
        }
      }
      this.mesh.setMatrixAt(k, _m.compose(onGround(it.p), it.q, fading ? _sf : _s)); this.dirty = true;
    }
    if (this.dirty) { this.mesh.instanceMatrix.needsUpdate = true; this.dirty = false; }
    this.mesh.visible = live > 0;   // an empty pool costs no draw call
  }
  clear() {
    for (let k = 0; k < this.items.length; k++) { this.items[k].on = false; _m.compose(_hide, _q.identity(), _hide); this.mesh.setMatrixAt(k, _m); }
    this.mesh.instanceMatrix.needsUpdate = true; this.next = 0; this.mesh.visible = false;
  }
}

export class Debris {
  constructor(scene) {
    this.group = new THREE.Group(); this.group.name = 'debris'; scene.add(this.group);
    const carbon = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.3 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    this.pools = {}; this.sweep = null;
    for (const k in KINDS) { this.pools[k] = new Pool(KINDS[k], k === 'tyre' ? rubber : carbon); this.group.add(this.pools[k].mesh); }
  }
  /** one piece of a car: kind = plate | endplate | rearwing | tyre, thrown with the car's velocity plus a kick */
  part(kind, x, y, z, vx, vz, color, kick = 6) {
    const a = Math.random() * Math.PI * 2, k = kick * (0.4 + Math.random() * 0.6);
    this.pools[kind].spawn(x, y, z, vx * 0.85 + Math.cos(a) * k, 1.5 + Math.random() * kick * 0.6, vz * 0.85 + Math.sin(a) * k, color, kind === 'tyre' ? 10 : 14);
  }
  /** a spray of carbon shards from an impact point: n pieces, mostly carbon black, some in the livery */
  burst(x, z, vx, vz, n, livery) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, k = 2 + Math.random() * 7;
      this.pools.shard.spawn(x, 0.3 + Math.random() * 0.4, z, vx * 0.7 + Math.cos(a) * k, 1 + Math.random() * 4, vz * 0.7 + Math.sin(a) * k, Math.random() < 0.3 ? livery : 0x16171b, 25);
    }
  }
  /** sweep(x, z) -> [x, z] at the side of the road for a part lying on the racing surface, or null where it can stay */
  update(dt) { if (dt > 0) for (const k in this.pools) this.pools[k].update(Math.min(dt, 0.05), this.sweep); }
  clear() { for (const k in this.pools) this.pools[k].clear(); }
}
