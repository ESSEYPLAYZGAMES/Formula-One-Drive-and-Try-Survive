// Fire, smoke and the marshals' extinguishers. Two particle systems - flames (additive) and smoke / extinguisher
// powder (alpha-blended) - two draw calls for every fire on the circuit. An emitter follows a point on a car (or on
// the half of one): an engine blow-up trails white smoke, a fire throws flames and black smoke; once the car has
// stopped the marshals arrive (8-16 s) and put it out in a cloud of white powder.
import * as THREE from 'three';

const VS = `attribute float size; attribute float alpha; attribute vec3 color; uniform float uScale; varying float vA; varying vec3 vC;
void main() { vA = alpha; vC = color; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(512.0, size * uScale / max(0.1, -mv.z)); gl_Position = projectionMatrix * mv; }`;
const FS = `varying float vA; varying vec3 vC;
void main() { vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; gl_FragColor = vec4(vC, vA * smoothstep(0.5, 0.1, r)); }`;

class Pool {
  constructor(n, blending, uniforms) {
    this.n = n; this.next = 0; this.live = 0;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 3); this.col = new Float32Array(n * 3); this.size = new Float32Array(n); this.alpha = new Float32Array(n);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.g = g;
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms, vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, blending }));
    this.points.frustumCulled = false; this.points.visible = false; this.points.renderOrder = 5;
    // per particle: velocity, age, life, start / end size, start alpha, start / end colour, buoyancy
    this.v = new Float32Array(n * 3); this.age = new Float32Array(n).fill(1); this.life = new Float32Array(n).fill(1);
    this.s0 = new Float32Array(n); this.s1 = new Float32Array(n); this.a0 = new Float32Array(n); this.c0 = new Float32Array(n * 3); this.c1 = new Float32Array(n * 3); this.up = new Float32Array(n);
  }
  spawn(x, y, z, vx, vy, vz, life, s0, s1, a0, c0, c1, up) {
    const i = this.next; this.next = (this.next + 1) % this.n;
    this.pos.set([x, y, z], i * 3); this.v.set([vx, vy, vz], i * 3);
    this.age[i] = 0; this.life[i] = life; this.s0[i] = s0; this.s1[i] = s1; this.a0[i] = a0; this.up[i] = up;
    this.c0.set(c0, i * 3); this.c1.set(c1, i * 3);
  }
  update(dt) {
    let live = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.age[i] >= this.life[i]) { if (this.alpha[i] !== 0) { this.alpha[i] = 0; this.size[i] = 0; } continue; }
      live++;
      this.age[i] += dt; const t = Math.min(1, this.age[i] / this.life[i]), k = i * 3;
      this.v[k + 1] += this.up[i] * dt; const dr = Math.max(0, 1 - 0.9 * dt);
      this.v[k] *= dr; this.v[k + 2] *= dr;
      this.pos[k] += this.v[k] * dt + 0.6 * dt; this.pos[k + 1] += this.v[k + 1] * dt; this.pos[k + 2] += this.v[k + 2] * dt + 0.25 * dt;   // (a light breeze)
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.alpha[i] = this.a0[i] * (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85);
      for (let c = 0; c < 3; c++) this.col[k + c] = this.c0[k + c] + (this.c1[k + c] - this.c0[k + c]) * t;
    }
    this.live = live; this.points.visible = live > 0;
    if (live || this._dirty) { for (const a of ['position', 'color', 'size', 'alpha']) this.g.attributes[a].needsUpdate = true; this._dirty = live > 0; }
  }
  clear() { this.age.fill(1); this.alpha.fill(0); this.size.fill(0); this._dirty = true; this.points.visible = false; }
}

const FLAME_A = [1.0, 0.85, 0.35], FLAME_B = [0.9, 0.18, 0.02];
const BLACK_A = [0.12, 0.11, 0.1], BLACK_B = [0.32, 0.31, 0.3];
const WHITE_A = [0.82, 0.82, 0.82], WHITE_B = [0.62, 0.62, 0.64];
const POWDER = [0.97, 0.97, 0.97];
const SPARK_A = [1.0, 0.97, 0.85], SPARK_B = [1.0, 0.45, 0.08];
const SPARK_HOT = [1.0, 1.0, 0.96], GLOW_A = [1.0, 0.8, 0.45], GLOW_B = [1.0, 0.42, 0.1];
const _p = new THREE.Vector3();

export class Fire {
  constructor(scene) {
    this.u = { uScale: { value: 600 } };
    // (flames and sparks share a pool: a bare rim's stream alone is a few hundred)
    this.flames = new Pool(1600, THREE.AdditiveBlending, this.u); this.smoke = new Pool(1400, THREE.NormalBlending, this.u);
    scene.add(this.flames.points, this.smoke.points);
    this.emitters = [];
  }
  /**
   * A fire or smoke source. at(out) writes the source's world position into the Vector3 out (false: gone);
   * kind 'fire' | 'smoke' (white, an engine) | 'puff' (a short white burst); stopped() says whether its car is at rest
   * (the marshals come for a stopped fire).
   */
  add(at, kind, k = 1, stopped = () => true) {
    const e = { at, kind, k, stopped, t: 0, still: 0, out: false, marshal: 8 + Math.random() * 8, life: kind === 'smoke' ? 25 + Math.random() * 15 : kind === 'puff' ? 1.2 : Infinity };
    this.emitters.push(e); return e;
  }
  get burning() { return this.emitters.some((e) => e.kind === 'fire' && !e.out); }
  update(dt, camera, height) {
    if (dt <= 0) return;
    this.u.uScale.value = height / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    for (const e of this.emitters) {
      if (this.paused && !e.replay) continue;   // (a replay on the news: the fires of the wreck as it is now held back; the replay's own burn)
      e.t += dt;
      if (!e.at(_p)) { e.dead = true; continue; }
      if (e.kind === 'fire') {
        // the marshals: once the car has been still for a while they put it out (powder, the flames die over 4 s)
        e.still = e.stopped() ? e.still + dt : 0;
        if (!e.out && e.still > e.marshal) e.out = true;
        if (e.out) { e.k -= dt / 4; this.emit(e, dt, 'powder', 1); }
        if (e.k <= 0) { e.dead = true; continue; }
        this.emit(e, dt, 'fire', e.k);
      } else {
        if (e.t > e.life) { e.k -= dt / 3; if (e.k <= 0) { e.dead = true; continue; } }
        this.emit(e, dt, e.kind, e.k);
      }
    }
    this.emitters = this.emitters.filter((e) => !e.dead);
    this.flames.update(dt); this.smoke.update(dt);
  }
  emit(e, dt, kind, k) {
    const r = () => Math.random() - 0.5, x = _p.x, y = _p.y, z = _p.z;
    const n = (rate) => { e.acc = (e.acc || 0) + rate * dt; const m = Math.floor(e.acc); e.acc -= m; return m; };
    if (kind === 'fire') {
      for (let i = n(110 * k); i > 0; i--) this.flames.spawn(x + r() * 1.2, y + Math.random() * 0.3, z + r() * 1.2, r() * 1.2, 2 + Math.random() * 2.5, r() * 1.2, 0.45 + Math.random() * 0.45, 0.9, 0.3, 0.75, FLAME_A, FLAME_B, 2.5);
      if (Math.random() < 30 * k * dt) this.smoke.spawn(x + r(), y + 1.2, z + r(), r() * 0.8, 2.5 + Math.random(), r() * 0.8, 4 + Math.random() * 3, 1.2, 6.5, 0.55, BLACK_A, BLACK_B, 0.4);
    } else if (kind === 'smoke') {
      if (Math.random() < 45 * k * dt) this.smoke.spawn(x + r() * 0.5, y + 0.2, z + r() * 0.5, r() * 0.6, 1.2 + Math.random(), r() * 0.6, 3 + Math.random() * 2, 0.6, 5, 0.5, WHITE_A, WHITE_B, 0.3);
    } else if (kind === 'puff') {
      for (let i = n(60 * k); i > 0; i--) this.smoke.spawn(x + r(), y + 0.1, z + r(), r() * 3, 0.5 + Math.random(), r() * 3, 1.5 + Math.random(), 0.8, 3, 0.45, BLACK_B, WHITE_B, 0.2);
    } else if (kind === 'powder') {
      if (Math.random() < 40 * dt) this.smoke.spawn(x + r() * 2, y + 0.3, z + r() * 2, r() * 2.5, 0.8 + Math.random(), r() * 2.5, 2 + Math.random() * 1.5, 1.5, 4.5, 0.6, POWDER, WHITE_A, 0.1);
    }
  }
  /** a shower of sparks from an impact (white-hot, falling, gone in a moment) */
  sparks(x, y, z, n = 30, vx = 0, vz = 0) {
    const r = () => Math.random() - 0.5;
    for (let i = 0; i < n; i++) this.flames.spawn(x + r() * 0.6, y + Math.random() * 0.4, z + r() * 0.6, vx * 0.4 + r() * 14, 1 + Math.random() * 6, vz * 0.4 + r() * 14, 0.25 + Math.random() * 0.45, 0.16, 0.05, 1, SPARK_A, SPARK_B, -9);
  }
  /**
   * Metal grinding the road (a wheel down to its rim): a stream of sparks trailing the car - the faster it goes, the
   * more of them and the further and higher they fly - and a hot glow where the rim meets the road. k is the
   * intensity (1: a bare rim, white-hot and bigger; less while some rubber is still left on it); src keeps the
   * stream's running count between frames.
   */
  grind(x, y, z, vx, vz, speed, k, dt, src) {
    if (speed < 3 || k <= 0 || dt <= 0) return;
    const r = () => Math.random() - 0.5, sp = Math.min(1, speed / 70), hot = k > 0.6;
    src.acc = (src.acc || 0) + dt * k * (20 + speed * 3.2);   // (a bare rim at 250 km/h: ~240 a second)
    const m = Math.min(40, Math.floor(src.acc)); src.acc -= Math.floor(src.acc);
    if (Math.random() < dt * 40 * k) this.flames.spawn(x, y + 0.04, z, vx, 0, vz, 0.07, 0.35 + 0.3 * k * (0.5 + sp), 0.25, 0.55 * k, GLOW_A, GLOW_B, 0);
    for (let i = 0; i < m; i++) {
      // they leave the contact patch with part of the car's speed (the car outruns them: they trail behind it)
      const px = x + r() * 0.2, py = y + Math.random() * 0.05, pz = z + r() * 0.2;
      if (Math.random() < 0.6) {
        // most die within a car length: the dense, bright spray right at the wheel
        const f = 0.6 + Math.random() * 0.35, s = 1.5 + 4 * sp;
        this.flames.spawn(px, py, pz, vx * f + r() * s, 0.3 + Math.random() * (1 + 2 * sp), vz * f + r() * s, 0.05 + Math.random() * 0.12, hot ? 0.13 : 0.09, 0.05, 1, hot ? SPARK_HOT : SPARK_A, SPARK_B, -9);
        continue;
      }
      // the rest fly off and fall behind, each drawn as a short streak: points strung ~5 cm apart along the path it
      // has just flown (four for a white-hot one)
      const f = 0.25 + Math.random() * 0.5, spread = 2 + 9 * sp;
      const svx = vx * f + r() * spread, svy = 0.5 + Math.random() * (1.2 + 3.8 * sp), svz = vz * f + r() * spread, life = 0.15 + Math.random() * (0.2 + 0.4 * sp);
      const step = 0.05 / (Math.hypot(svx, svy, svz) || 1);   // (seconds back along its path, per point)
      for (let j = 0, n = hot ? 4 : 2; j < n; j++) {
        this.flames.spawn(px - svx * step * j, py - svy * step * j, pz - svz * step * j, svx, svy, svz, life, (hot ? 0.11 : 0.08) * (1 - 0.15 * j), 0.03, 1 - 0.2 * j, hot ? SPARK_HOT : SPARK_A, SPARK_B, -9);
      }
    }
  }
  clear() { this.emitters = []; this.flames.clear(); this.smoke.clear(); }
}
