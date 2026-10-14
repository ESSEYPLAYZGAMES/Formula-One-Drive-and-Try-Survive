// Fireworks over the Strip when the Las Vegas Grand Prix is won, as at the real race: shells fired from beyond the
// barriers along the start/finish straight, bursting 60-140 m up - peonies, rings, gold willows that hang and fall -
// for about 25 s from the moment the winner crosses the line. One Points draw call (additive, unfogged, not tone
// mapped: they are light), a fixed pool of particles, nothing allocated per frame.
import * as THREE from 'three';

const MAX = 6000, G = 9.81;
const PALETTE = [[1, 0.25, 0.3], [0.3, 0.6, 1], [1, 0.85, 0.35], [0.4, 1, 0.55], [1, 0.45, 0.95], [1, 1, 1], [1, 0.55, 0.15]];

export class Fireworks {
  constructor(scene) {
    this.scene = scene;
    this.p = new Float32Array(MAX * 3); this.v = new Float32Array(MAX * 3); this.c0 = new Float32Array(MAX * 3); this.c = new Float32Array(MAX * 3);
    this.life = new Float32Array(MAX); this.max = new Float32Array(MAX); this.kind = new Uint8Array(MAX);   // kind: 0 free, 1 shell, 2 star, 3 willow
    this.shellH = new Float32Array(MAX); this.shellType = new Uint8Array(MAX); this.next = 0; this.live = 0;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.p, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.c, 3).setUsage(THREE.DynamicDrawUsage));
    // (each star a soft round glow, not a square)
    const cv = document.createElement('canvas'); cv.width = cv.height = 32; const x = cv.getContext('2d'), gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    this.sprite = new THREE.CanvasTexture(cv);
    this.mat = new THREE.PointsMaterial({ size: 6, map: this.sprite, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false; this.points.visible = false; this.points.renderOrder = 5;
    scene.add(this.points);
    this.show = null;   // { t, until, at: [{x, z}], audio, cam }
  }
  dispose() { this.scene.remove(this.points); this.points.geometry.dispose(); this.mat.dispose(); this.sprite.dispose(); }

  _alloc() { for (let k = 0; k < MAX; k++) { const i = (this.next + k) % MAX; if (!this.kind[i]) { this.next = (i + 1) % MAX; return i; } } return -1; }
  _emit(kind, x, y, z, vx, vy, vz, r, g, b, life) {
    const i = this._alloc(); if (i < 0) return -1;
    const j = i * 3; this.p[j] = x; this.p[j + 1] = y; this.p[j + 2] = z; this.v[j] = vx; this.v[j + 1] = vy; this.v[j + 2] = vz;
    this.c0[j] = r; this.c0[j + 1] = g; this.c0[j + 2] = b; this.kind[i] = kind; this.life[i] = life; this.max[i] = life; this.live++;
    return i;
  }

  /** start the show: sites [{x, z}] to fire from, for `secs` */
  start(sites, secs = 25, audio = null) { this.show = { t: 0, until: secs, sites, audio, wait: 0.2 }; this.points.visible = true; }

  /** fire one shell from (x, z) to burst at height h */
  launch(x, z, h, type = (Math.random() * 3) | 0) {
    const i = this._emit(1, x, 3, z, (Math.random() - 0.5) * 3, Math.sqrt(2 * G * h), (Math.random() - 0.5) * 3, 1, 0.75, 0.4, 10);
    if (i >= 0) this.shellType[i] = type;
  }
  _burst(x, y, z, type) {
    const col = PALETTE[(Math.random() * PALETTE.length) | 0], col2 = PALETTE[(Math.random() * PALETTE.length) | 0];
    const n = type === 2 ? 160 : 200, speed = type === 2 ? 18 : 27 + Math.random() * 8;
    // a ring: in a tilted plane; a peony: a sphere; a willow: slow gold stars that hang and fall
    const ax = Math.random() - 0.5, az = Math.random() - 0.5;
    for (let k = 0; k < n; k++) {
      let dx, dy, dz;
      if (type === 1) { const a = (k / n) * Math.PI * 2; dx = Math.cos(a); dy = Math.sin(a) * ax; dz = Math.sin(a) * (1 - Math.abs(ax)) + Math.cos(a) * az; }
      else { const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u); dx = r * Math.cos(a); dy = u; dz = r * Math.sin(a); }
      const l = Math.hypot(dx, dy, dz) || 1, sp = speed * (0.85 + Math.random() * 0.3), c = type === 2 ? [1, 0.72, 0.3] : k % 4 ? col : col2;
      this._emit(type === 2 ? 3 : 2, x, y, z, dx / l * sp, dy / l * sp, dz / l * sp, c[0], c[1], c[2], type === 2 ? 3.2 + Math.random() : 1.6 + Math.random() * 0.8);
    }
  }

  update(dt, camera) {
    if (!this.points.visible) return;
    const S = this.show;
    if (S) {
      S.t += dt; S.wait -= dt;
      if (S.t < S.until && S.wait <= 0) {
        // a volley: one to three shells from the sites, the finale (the last 4 s) faster
        const fin = S.t > S.until - 4, n = fin ? 3 : 1 + ((Math.random() * 2) | 0);
        for (let k = 0; k < n; k++) { const s = S.sites[(Math.random() * S.sites.length) | 0]; this.launch(s.x + (Math.random() - 0.5) * 30, s.z + (Math.random() - 0.5) * 30, 60 + Math.random() * 80); }
        S.wait = fin ? 0.18 : 0.45 + Math.random() * 0.6;
      }
    }
    const p = this.p, v = this.v, c = this.c, c0 = this.c0, cam = camera?.position;
    for (let i = 0; i < MAX; i++) {
      const kd = this.kind[i]; if (!kd) continue;
      const j = i * 3;
      if (kd === 1) {
        // a shell climbing on its trail; bursts at the top of its arc
        v[j + 1] -= G * dt; p[j] += v[j] * dt; p[j + 1] += v[j + 1] * dt; p[j + 2] += v[j + 2] * dt;
        c[j] = 1; c[j + 1] = 0.7; c[j + 2] = 0.35;
        if (v[j + 1] <= 0) {
          this.kind[i] = 0; this.live--; c[j] = c[j + 1] = c[j + 2] = 0;
          this._burst(p[j], p[j + 1], p[j + 2], this.shellType[i]);
          if (S?.audio && cam) S.audio.firework?.(Math.hypot(p[j] - cam.x, p[j + 1] - cam.y, p[j + 2] - cam.z));
        }
        continue;
      }
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.kind[i] = 0; this.live--; c[j] = c[j + 1] = c[j + 2] = 0; p[j + 1] = -1000; continue; }
      const drag = kd === 3 ? 1.6 : 1.1, k = Math.max(0, 1 - drag * dt);
      v[j] *= k; v[j + 1] = v[j + 1] * k - G * (kd === 3 ? 0.55 : 0.35) * dt; v[j + 2] *= k;
      p[j] += v[j] * dt; p[j + 1] += v[j + 1] * dt; p[j + 2] += v[j + 2] * dt;
      // bright at the burst, fading out (with a twinkle as it dies)
      const f = this.life[i] / this.max[i], tw = f < 0.3 ? (Math.random() < 0.5 ? 1 : 0.35) : 1, a = Math.min(1, f * 1.6) * tw * 1.8;
      c[j] = c0[j] * a; c[j + 1] = c0[j + 1] * a; c[j + 2] = c0[j + 2] * a;
    }
    this.points.geometry.attributes.position.needsUpdate = true; this.points.geometry.attributes.color.needsUpdate = true;
    if (S && S.t >= S.until && !this.live) { this.show = null; this.points.visible = false; }
  }
}
