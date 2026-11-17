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
  constructor(scene, n = 9000) {
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
  /**
   * posOf(c) -> { x, z, th, v } | null: where the car is drawn and how fast it goes there, if not where it is - a
   * replay poses its models from the record while the race is held: the spray came off the held cars, not the ones on
   * the screen
   */
  update(dt, cars, cam, heightPx, posOf = null) {
    this.u.uScale.value = heightPx * 0.9;
    if (dt > 0 && cars) for (const c of cars) {
      if (c.retired || c.inPit || c.parked) continue;
      const P = posOf ? posOf(c) : null; if (posOf && !P) continue;
      const cx = P ? P.x : c.x, cz = P ? P.z : c.z, th = P ? P.th : c.th;
      const w = c.wetness || 0, v = P ? P.v : c.speed || 0; if (w < 0.12 || v < 14) continue;
      const dx = cx - cam.x, dz = cz - cam.z; if (dx * dx + dz * dz > 380 * 380) continue;
      // (a wall of it, as it is: a car in the wet at speed throws a cloud the height of a house that hangs on the road
      //  behind it for seconds - the car following sees almost nothing. Three parts: the rooster tails off the rear
      //  tyres, the plume rising behind the diffuser, and the mist it leaves hanging over the road)
      const ww = Math.min(1, (w - 0.08) * 1.5), rate = 300 * ww * Math.min(1.5, v / 60);
      let k = (this.acc.get(c) || 0) + rate * dt; const fx = Math.cos(th), fz = Math.sin(th);
      for (; k >= 1; k--) {
        const side = Math.random() < 0.5 ? -1 : 1, back = 2.0 + Math.random() * 0.6, lat = side * (0.7 + Math.random() * 0.25);
        const x = cx - fx * back - fz * lat, z = cz - fz * back + fx * lat;
        const kind = Math.random();
        if (kind < 0.55) this.spawn(x, 0.35 + Math.random() * 0.2, z, fx * v * 0.4 + (Math.random() - 0.5) * 4 - fz * side * 2, 1.6 + Math.random() * 2.4, fz * v * 0.4 + (Math.random() - 0.5) * 4 + fx * side * 2,
          1.1 + Math.random() * 0.8, 3.5 + 5 * w + Math.random() * 2, Math.min(0.6, (0.24 + 0.36 * w) * (0.7 + 0.3 * Math.random())));   // (the plume)
        else if (kind < 0.8) this.spawn(x, 0.25, z, fx * v * 0.55 + (Math.random() - 0.5) * 2 - fz * side * 3.5, 0.8 + Math.random(), fz * v * 0.55 + (Math.random() - 0.5) * 2 + fx * side * 3.5,
          0.6 + Math.random() * 0.4, 1.6 + 1.6 * w, Math.min(0.7, 0.3 + 0.35 * w));   // (the rooster tails: low, quick, dense)
        else this.spawn(x - fx * 3, 0.8 + Math.random() * 1.2, z - fz * 3, fx * v * 0.2 + (Math.random() - 0.5) * 2, 0.5 + Math.random() * 0.8, fz * v * 0.2 + (Math.random() - 0.5) * 2,
          3 + Math.random() * 2.5, 9 + 7 * w + Math.random() * 4, (0.07 + 0.09 * w) * (0.7 + 0.3 * Math.random()));   // (the mist left hanging over the road)
      }
      this.acc.set(c, k);
    }
    let live = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.age[i] >= this.life[i]) { if (this.alpha[i] !== 0) { this.alpha[i] = 0; this.size[i] = 0; } continue; }
      live++; this.age[i] += dt; const t = Math.min(1, this.age[i] / this.life[i]), j = i * 3, dr = Math.max(0, 1 - 2.2 * dt);
      this.v[j] *= dr; this.v[j + 2] *= dr; this.v[j + 1] = this.v[j + 1] * Math.max(0, 1 - 1.4 * dt) - 0.35 * dt;   // (fine water: it hangs, it barely falls)
      this.pos[j] += this.v[j] * dt; this.pos[j + 1] = Math.max(0.2, this.pos[j + 1] + this.v[j + 1] * dt); this.pos[j + 2] += this.v[j + 2] * dt;
      this.size[i] = 0.7 + (this.s1[i] - 0.7) * Math.sqrt(t); this.alpha[i] = this.a0[i] * (t < 0.08 ? t / 0.08 : Math.pow(1 - (t - 0.08) / 0.92, 1.4));
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
