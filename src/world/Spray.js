// Spray: the plume of water a car throws up behind it on a wet track - the thicker the water and the faster the car,
// the bigger the cloud. One pool of soft points (one draw call) for the whole field; only the cars near the camera
// throw any. The water under each car is its own (race/Weather.js wetAt): a car on the drying line throws a wisp, one
// off it through the wet a wall of it - which is the view a car following through a wet patch gets.
import * as THREE from 'three';

const VS = `attribute float size; attribute float alpha; uniform float uScale; varying float vA;
void main() { vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(380.0, size * uScale / max(0.1, -mv.z)); gl_Position = projectionMatrix * mv; }`;
const FS = `uniform vec3 uColor; varying float vA;
void main() { vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.0, r)); }`;

export class Spray {
  constructor(scene, n = 2600) {
    this.n = n; this.next = 0;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 3); this.size = new Float32Array(n); this.alpha = new Float32Array(n);
    this.v = new Float32Array(n * 3); this.age = new Float32Array(n).fill(9); this.life = new Float32Array(n).fill(1); this.a0 = new Float32Array(n); this.s1 = new Float32Array(n);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.g = g; this.u = { uScale: { value: 600 }, uColor: { value: new THREE.Color(0.78, 0.8, 0.84) } };
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: this.u, vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false }));
    this.points.frustumCulled = false; this.points.visible = false; this.points.renderOrder = 4; this.points.name = 'spray';
    scene.add(this.points); this.acc = new Map();
  }
  setNight(night) { this.u.uColor.value.setRGB(night ? 0.5 : 0.8, night ? 0.52 : 0.82, night ? 0.58 : 0.86); }
  /** the spray behind every car near `cam` for this frame (dt s); heightPx: the canvas's height (point sizes) */
  update(dt, cars, cam, heightPx) {
    this.u.uScale.value = heightPx * 0.9;
    if (dt > 0 && cars) for (const c of cars) {
      if (c.retired || c.inPit || c.parked) continue;
      const w = c.wetness || 0, v = c.speed || 0; if (w < 0.12 || v < 18) continue;
      const dx = c.x - cam.x, dz = c.z - cam.z; if (dx * dx + dz * dz > 330 * 330) continue;
      const rate = 95 * Math.min(1, (w - 0.08) * 1.6) * Math.min(1.4, v / 70);
      let k = (this.acc.get(c) || 0) + rate * dt; const fx = Math.cos(c.th), fz = Math.sin(c.th);
      for (; k >= 1; k--) {
        const side = Math.random() < 0.5 ? -1 : 1, back = 2.0 + Math.random() * 0.6, lat = side * (0.7 + Math.random() * 0.25);
        const x = c.x - fx * back - fz * lat, z = c.z - fz * back + fx * lat;
        this.spawn(x, 0.35 + Math.random() * 0.2, z, fx * v * 0.35 + (Math.random() - 0.5) * 3 - fz * side * 1.5, 1.2 + Math.random() * 1.6, fz * v * 0.35 + (Math.random() - 0.5) * 3 + fx * side * 1.5,
          0.7 + Math.random() * 0.5, 2.6 + 2.6 * w + Math.random() * 1.5, (0.16 + 0.22 * Math.min(1, w)) * (0.7 + 0.3 * Math.random()));
      }
      this.acc.set(c, k);
    }
    let live = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.age[i] >= this.life[i]) { if (this.alpha[i] !== 0) { this.alpha[i] = 0; this.size[i] = 0; } continue; }
      live++; this.age[i] += dt; const t = Math.min(1, this.age[i] / this.life[i]), j = i * 3, dr = Math.max(0, 1 - 2.2 * dt);
      this.v[j] *= dr; this.v[j + 2] *= dr; this.v[j + 1] -= 1.2 * dt;
      this.pos[j] += this.v[j] * dt; this.pos[j + 1] = Math.max(0.2, this.pos[j + 1] + this.v[j + 1] * dt); this.pos[j + 2] += this.v[j + 2] * dt;
      this.size[i] = 0.7 + (this.s1[i] - 0.7) * Math.sqrt(t); this.alpha[i] = this.a0[i] * (t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88);
    }
    this.points.visible = live > 0;
    if (live || this._dirty) { for (const a of ['position', 'size', 'alpha']) this.g.attributes[a].needsUpdate = true; this._dirty = live > 0; }
  }
  spawn(x, y, z, vx, vy, vz, life, s1, a0) {
    const i = this.next, j = i * 3; this.next = (this.next + 1) % this.n;
    this.pos[j] = x; this.pos[j + 1] = y; this.pos[j + 2] = z; this.v[j] = vx; this.v[j + 1] = vy; this.v[j + 2] = vz;
    this.age[i] = 0; this.life[i] = life; this.s1[i] = s1; this.a0[i] = a0;
  }
  clear() { this.age.fill(9); this.alpha.fill(0); this.size.fill(0); this._dirty = true; this.points.visible = false; this.acc.clear(); }
}
