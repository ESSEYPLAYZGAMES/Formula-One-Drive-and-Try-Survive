// The safety car: the Aston Martin Vantage (vehicle/SafetyCarModel.js) - its wheels roll with the distance it covers and
// the fronts steer with its turning (Ackermann: the inside wheel more), the body leans in corners and dips under braking,
// the roof light bar flashes amber (green when it waves cars by / releases the field) and the tail lights brighten under
// braking. Three levels of detail by distance. (Before the model is in, or without it: a simple box car.)
import * as THREE from 'three';
import { TERRAIN } from '../world/Terrain.js';
import { scModel, loadSCModel } from './SafetyCarModel.js';

if (typeof document !== 'undefined') loadSCModel();   // (at start-up: in long before any safety car is out)

const box = (w, h, d, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
const LOD_AT = [0, 22, 75];   // (metres from the camera: level 0, 1, 2)

export class SafetyCarMesh {
  constructor() {
    const g = this.group = new THREE.Group(); g.name = 'safety-car';
    this.own = [];   // (what dispose() frees: the model's geometry is shared)
    // lamps: the outer pair amber, flashing alternately; the inner pair green
    this.amber = new THREE.MeshStandardMaterial({ color: 0x8a4200, emissive: 0xff5a00, emissiveIntensity: 0, roughness: 0.15 });
    this.amberB = this.amber.clone();
    this.greenLamp = new THREE.MeshStandardMaterial({ color: 0x0c5a26, emissive: 0x00ff40, emissiveIntensity: 0, roughness: 0.15 });
    this.own.push(this.amber, this.amberB, this.greenLamp);
    const M = scModel();
    if (M) this.buildModel(M); else this.buildBoxes();
    // blob shadow
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.3), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; g.add(sh); this.own.push(sh.geometry, sh.material);
    this.spin = 0; this.t = 0; this.steer = 0; this.roll = 0; this.pitch = 0; this.brake = 0;
    this.prev = null;
  }

  buildModel(M) {
    this.tail = M.mats.light_red ? M.mats.light_red.clone() : null; if (this.tail) this.own.push(this.tail);
    const OVR = { lampL: this.amber, lampR: this.amberB, lampC: this.greenLamp };
    const partLOD = (name) => {
      const P = M.parts[name], lod = new THREE.LOD();
      P.lv.forEach((L, i) => {
        const grp = new THREE.Group();
        for (const c of L) {
          const mat = OVR[name] || (name === 'tail' && this.tail && !c.flat ? this.tail : (c.flat ? M.flat : M.mats)[c.mat]);
          const m = new THREE.Mesh(c.geo, mat); m.matrixAutoUpdate = false; grp.add(m);
        }
        lod.addLevel(grp, LOD_AT[i], 2);
      });
      return lod;
    };
    // the body (with the lamps and tail lights) leans about a point between the axles at hub height
    this.body = new THREE.Group(); this.body.position.set(0, M.hubs[0][1], 0); this.group.add(this.body);
    for (const n of ['body', 'lampL', 'lampR', 'lampC', 'tail']) if (M.parts[n]) { const o = partLOD(n); o.position.y = -M.hubs[0][1]; this.body.add(o); }
    // wheels: a steering pivot at the hub, the rolling wheel inside it
    this.wheels = []; this.steers = [];
    ['wFL', 'wFR', 'wRL', 'wRR'].forEach((n, i) => {
      const s = new THREE.Group(); s.position.set(...M.parts[n].pivot); this.group.add(s);
      const w = partLOD(n); s.add(w); this.wheels.push(w); this.steers.push(i < 2 ? s : null);
    });
    this.R = M.radius; this.base = M.hubs[0][0] - M.hubs[2][0]; this.track = M.hubs[1][2] - M.hubs[0][2];
  }

  buildBoxes() {
    const g = this.boxes = new THREE.Group(); this.group.add(g);
    const silver = new THREE.MeshStandardMaterial({ color: 0x0d4d32, metalness: 0.35, roughness: 0.32 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x15181d, metalness: 0.3, roughness: 0.1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1b1f, roughness: 0.8 });
    this.body = new THREE.Group(); g.add(this.body);
    this.body.add(new THREE.Mesh(box(4.5, 0.62, 1.95, 0, 0.55, 0), silver), new THREE.Mesh(box(1.7, 0.44, 1.62, -0.45, 1.05, 0), glass),
      new THREE.Mesh(box(0.22, 0.09, 1.1, -0.6, 1.3, 0), dark));
    this.body.add(new THREE.Mesh(box(0.2, 0.1, 0.3, -0.6, 1.37, -0.4), this.amber), new THREE.Mesh(box(0.2, 0.1, 0.3, -0.6, 1.37, 0.4), this.amberB),
      new THREE.Mesh(box(0.2, 0.1, 0.3, -0.6, 1.37, 0), this.greenLamp));
    const wg = new THREE.CylinderGeometry(0.35, 0.35, 0.27, 16); wg.rotateX(Math.PI / 2);
    this.wheels = []; this.steers = [];
    for (const [x, z] of [[1.35, -0.81], [1.35, 0.81], [-1.35, -0.81], [-1.35, 0.81]]) {
      const s = new THREE.Group(); s.position.set(x, 0.35, z); g.add(s); const w = new THREE.Mesh(wg, dark); s.add(w);
      this.wheels.push(w); this.steers.push(x > 0 ? s : null);
    }
    this.R = 0.35; this.base = 2.7; this.track = 1.62;
    this.boxOwn = [wg, silver, glass, dark]; g.traverse((o) => { if (o.isMesh && o.geometry !== wg) this.boxOwn.push(o.geometry); });
  }

  /** follow the car; lights: 'amber' (out on track), 'green' (waving cars by / releasing the field), 'off' */
  update(car, dt, lights = 'amber') {
    this.t += dt;
    if (this.boxes && scModel()) {   // (the model came in after this was made: swap the box car for it)
      for (const o of this.boxOwn) o.dispose();
      this.group.remove(this.boxes); this.boxes = null; this.boxOwn = [];
      this.buildModel(scModel());
    }
    let gy = 0, gp = 0;   // (on a circuit that is not flat: world/Terrain.js)
    if (TERRAIN.on) { const g = TERRAIN.grad(car.x, car.z); gy = TERRAIN.at(car.x, car.z); gp = Math.atan(g[0] * Math.cos(car.th) + g[1] * Math.sin(car.th)); }
    this.group.position.set(car.x, gy, car.z); this.group.rotation.set(0, -car.th, gp, 'YZX');
    // speed and yaw rate from its motion (whatever drives it)
    const v = Number.isFinite(car.vLong) ? car.vLong : 0;
    let yawRate = 0, acc = 0;
    if (this.prev && dt > 1e-4) {
      let dth = car.th - this.prev.th; dth = Math.atan2(Math.sin(dth), Math.cos(dth));
      if (Math.hypot(car.x - this.prev.x, car.z - this.prev.z) < 30) { yawRate = dth / dt; acc = (v - this.prev.v) / dt; }
    }
    this.prev = { th: car.th, x: car.x, z: car.z, v };
    // wheels roll with the distance covered
    this.spin += v / this.R * dt; this.spin %= Math.PI * 2;
    for (const w of this.wheels) w.rotation.z = -this.spin;
    // the fronts steer: the bicycle model's angle (th grows turning right), smoothed; held when it stops
    const k = 1 - Math.exp(-dt * 8);
    if (Math.abs(v) > 0.5) { const want = Math.max(-0.6, Math.min(0.6, Math.atan(this.base * yawRate / v))); this.steer += (want - this.steer) * k; }
    const R = Math.abs(this.steer) > 1e-3 ? this.base / Math.tan(Math.abs(this.steer)) : 1e9, sgn = Math.sign(this.steer);
    this.steers.forEach((s, i) => {
      if (!s) return;
      const inside = (i === 1) === (sgn > 0);   // (turning right: the right wheel is the inside one)
      s.rotation.y = -sgn * Math.atan(this.base / Math.max(0.5, R + (inside ? -1 : 1) * this.track / 2));
    });
    // the body leans out of a corner and dips under braking / squats under power
    const lat = v * yawRate, kb = 1 - Math.exp(-dt * 5);
    this.roll += (Math.max(-0.045, Math.min(0.045, -lat * 0.0035)) - this.roll) * kb;
    this.pitch += (Math.max(-0.025, Math.min(0.02, acc * 0.0028)) - this.pitch) * kb;
    this.body.rotation.set(this.roll, 0, this.pitch);
    this.brake += ((acc < -1.2 ? 1 : 0) - this.brake) * (1 - Math.exp(-dt * 12));
    if (this.tail) this.tail.emissiveIntensity = 0.6 + 2.4 * this.brake;
    // the light bar
    const on = lights === 'amber', flash = Math.floor(this.t * 4) % 2;
    this.amber.emissiveIntensity = on ? (flash ? 2.6 : 0.05) : 0;
    this.amberB.emissiveIntensity = on ? (flash ? 0.05 : 2.6) : 0;
    this.greenLamp.emissiveIntensity = lights === 'green' ? (Math.floor(this.t * 3) % 2 ? 2.4 : 0.5) : 0;
  }
  dispose() { for (const o of [...this.own, ...(this.boxOwn || [])]) o.dispose(); this.own = []; this.boxOwn = []; }
}
