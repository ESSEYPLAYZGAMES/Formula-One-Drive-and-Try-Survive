// Crash replays. A rolling record of every car's pose (the last 12 s, 20 times a second, as its mesh is drawn), the
// hardest crash pulse it took in each twentieth of a second (Car.pulse: the physics' own g, not a guess from the
// motion) and whether it had been torn in two. When a driver is hurt (RaceDirector.injuries) the stretch around the
// accident is cut from it - from ~2.5 s before the hardest impact to the car at rest - with the cars that were near
// it, for the news broadcast after the race (ui/NewsBroadcast.js).
import * as THREE from 'three';

const HZ = 20, KEEP = 12, NEAR = 70;
const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3();

/** the pose car c's mesh is drawn at (as CarMesh.update sets it): position, quaternion -> out[o .. o + 6] */
export function carPose(c, out, o) {
  if ((c.air || c.wreck) && c.q && c.p) {
    _q.set(c.q[0], c.q[1], c.q[2], c.q[3]); _v.set(0, 0.48, 0).applyQuaternion(_q);   // (the body turns about its centre)
    out[o] = c.p[0] - _v.x; out[o + 1] = c.p[1] - _v.y; out[o + 2] = c.p[2] - _v.z;
  } else {
    _e.set(c.rl || 0, -c.th, c.pt || 0, 'YZX'); _q.setFromEuler(_e);
    out[o] = c.x; out[o + 1] = c.hv || 0; out[o + 2] = c.z;
  }
  out[o + 3] = _q.x; out[o + 4] = _q.y; out[o + 5] = _q.z; out[o + 6] = _q.w;
}

export class ReplayBuffer {
  constructor(cars) { this.cars = cars; this.frames = []; this.acc = 0; }
  record(dt, time) {
    const F = this.frames;
    while (F.length && F[F.length - 1].t > time + 1e-6) F.pop();   // (after a flashback: what was rewound never happened)
    this.acc += dt; if (this.acc < 1 / HZ) return; this.acc %= 1 / HZ;
    const n = this.cars.length, f = new Float32Array(n * 7), g = new Float32Array(n), split = new Uint8Array(n);
    for (let i = 0; i < n; i++) { const c = this.cars[i]; carPose(c, f, i * 7); g[i] = c.pulseG || 0; c.pulseG = 0; split[i] = c.split ? 1 : 0; }
    F.push({ t: time, f, g, split }); if (F.length > HZ * KEEP) F.shift();
  }
  /**
   * Car c's accident -> { hz, t0 (race time of the first frame), cars, focus (its index in cars), impact: { k, x, z },
   * frames: [Float32Array poses], pulses: [Float32Array g per car], splitK: [first frame torn in two, or -1] }:
   * from ~2.5 s before its hardest impact to now, with every car that came within 70 m of it meanwhile.
   */
  clip(c) {
    const i = this.cars.indexOf(c), F = this.frames; if (i < 0 || F.length < 10) return null;
    const P = (k, j) => F[k].f.subarray(j * 7, j * 7 + 3);
    // the hardest impact: the biggest crash pulse; with none on record, the biggest loss of speed between two frames
    let bk = -1, bg = 5;
    for (let k = 1; k < F.length; k++) if (F[k].g[i] > bg) { bg = F[k].g[i]; bk = k; }
    if (bk < 0) {
      const step = (k) => { const a = P(k - 1, i), b = P(k, i); return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); };
      let best = -1; bk = F.length - 1;
      for (let k = 2; k < F.length; k++) { const dv = step(k - 1) - step(k); if (dv > best) { best = dv; bk = k; } }
    }
    // (from 2.5 s before it - and for a car torn in two, from at least 2 s before it split)
    const ks = F.findIndex((fr) => fr.split[i]);
    const k0 = Math.max(0, Math.min(bk - Math.round(2.5 * HZ), ks >= 0 ? ks - 2 * HZ : Infinity));
    const near = [];
    for (let j = 0; j < this.cars.length; j++) {
      if (j === i) { near.push(j); continue; }
      for (let k = k0; k < F.length; k += 2) { const a = P(k, i), b = P(k, j); if ((a[0] - b[0]) ** 2 + (a[2] - b[2]) ** 2 < NEAR * NEAR) { near.push(j); break; } }
    }
    const span = F.slice(k0);
    const frames = span.map((fr) => { const out = new Float32Array(near.length * 7); near.forEach((j, n) => out.set(fr.f.subarray(j * 7, j * 7 + 7), n * 7)); return out; });
    const pulses = span.map((fr) => Float32Array.from(near, (j) => fr.g[j]));
    const splitK = near.map((j) => span.findIndex((fr) => fr.split[j]));
    const ip = P(bk, i);
    return { hz: HZ, t0: span[0].t, cars: near.map((j) => this.cars[j]), focus: near.indexOf(i), impact: { k: bk - k0, x: ip[0], z: ip[2] }, frames, pulses, splitK };
  }
}
