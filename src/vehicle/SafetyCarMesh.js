// The safety car: a silver front-engined GT (about 4.7 x 1.95 x 1.3 m) in safety-car livery - green / white stripe,
// a roof light bar flashing amber (and green when the field is released) and its own blob shadow. One group, ~10
// draw calls; it only exists while the safety car is out.
import * as THREE from 'three';
import { TERRAIN } from '../world/Terrain.js';

const box = (w, h, d, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };

export class SafetyCarMesh {
  constructor() {
    const g = this.group = new THREE.Group(); g.name = 'safety-car';
    // (not too metallic: with no environment map a mirror-like silver renders black under the night floodlights)
    const silver = new THREE.MeshStandardMaterial({ color: 0xd4d7dc, metalness: 0.35, roughness: 0.32, emissive: 0x23252a });
    const glass = new THREE.MeshStandardMaterial({ color: 0x15181d, metalness: 0.3, roughness: 0.1 });
    const green = new THREE.MeshStandardMaterial({ color: 0x0b8f5a, roughness: 0.5 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1b1f, roughness: 0.8 });
    // body: long bonnet, cabin set back, short tail (x forward, y up, z right)
    const body = new THREE.Mesh(box(4.7, 0.62, 1.95, 0, 0.55, 0), silver);
    const bonnet = new THREE.Mesh(box(1.7, 0.16, 1.8, 1.35, 0.92, 0), silver);
    const cabin = new THREE.Mesh(box(1.9, 0.44, 1.62, -0.45, 1.08, 0), glass);
    const roof = new THREE.Mesh(box(1.4, 0.06, 1.58, -0.5, 1.32, 0), silver);
    const stripe = new THREE.Mesh(box(4.72, 0.1, 0.5, 0, 0.72, 0), green);   // the green band over the length of the car
    const splitter = new THREE.Mesh(box(0.25, 0.08, 1.9, 2.3, 0.28, 0), dark);
    g.add(body, bonnet, cabin, roof, stripe, splitter);
    // light bar on the roof: amber lamps either side, green in the middle
    this.amber = new THREE.MeshStandardMaterial({ color: 0x402800, emissive: 0xffa200, emissiveIntensity: 0 });
    this.greenLamp = new THREE.MeshStandardMaterial({ color: 0x003818, emissive: 0x20ff80, emissiveIntensity: 0 });
    g.add(new THREE.Mesh(box(0.22, 0.09, 1.3, -0.5, 1.4, 0), dark));
    this.lampL = new THREE.Mesh(box(0.2, 0.1, 0.38, -0.5, 1.46, -0.42), this.amber);
    this.lampR = new THREE.Mesh(box(0.2, 0.1, 0.38, -0.5, 1.46, 0.42), this.amber);
    this.lampC = new THREE.Mesh(box(0.2, 0.1, 0.3, -0.5, 1.46, 0), this.greenLamp);
    g.add(this.lampL, this.lampR, this.lampC);
    // headlights, tail lights
    const head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6dd, emissiveIntensity: 1.2 });
    const tail = new THREE.MeshStandardMaterial({ color: 0x300000, emissive: 0xff1a1a, emissiveIntensity: 1.5 });
    g.add(new THREE.Mesh(box(0.05, 0.1, 0.42, 2.36, 0.72, -0.62), head), new THREE.Mesh(box(0.05, 0.1, 0.42, 2.36, 0.72, 0.62), head));
    g.add(new THREE.Mesh(box(0.05, 0.08, 0.5, -2.36, 0.78, -0.6), tail), new THREE.Mesh(box(0.05, 0.08, 0.5, -2.36, 0.78, 0.6), tail));
    // wheels
    const wg = new THREE.CylinderGeometry(0.34, 0.34, 0.27, 16); wg.rotateX(Math.PI / 2);
    this.wheels = [];
    for (const [x, z] of [[1.45, 0.86], [1.45, -0.86], [-1.45, 0.86], [-1.45, -0.86]]) { const w = new THREE.Mesh(wg, dark); w.position.set(x, 0.34, z); g.add(w); this.wheels.push(w); }
    // blob shadow
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.4), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; g.add(sh);
    this.spin = 0; this.t = 0;
  }
  /** follow the car; lights: 'amber' (out on track), 'green' (releasing the field), 'off' */
  update(car, dt, lights = 'amber') {
    this.t += dt;
    let gy = 0, gp = 0;   // (on a circuit that is not flat: world/Terrain.js)
    if (TERRAIN.on) { const g = TERRAIN.grad(car.x, car.z); gy = TERRAIN.at(car.x, car.z); gp = Math.atan(g[0] * Math.cos(car.th) + g[1] * Math.sin(car.th)); }
    this.group.position.set(car.x, gy, car.z); this.group.rotation.set(0, -car.th, gp, 'YZX');
    this.spin += car.vLong / 0.34 * dt; for (const w of this.wheels) w.rotation.z = -this.spin;
    const on = lights === 'amber', flash = Math.floor(this.t * 4) % 2;
    this.amber.emissiveIntensity = on ? (flash ? 3 : 0.2) : 0;
    this.lampL.material = this.lampR.material = this.amber;
    this.lampL.visible = !on || flash === 1; this.lampR.visible = !on || flash === 0;
    this.greenLamp.emissiveIntensity = lights === 'green' ? 2.5 : 0;
  }
  dispose() { this.group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); }
}
