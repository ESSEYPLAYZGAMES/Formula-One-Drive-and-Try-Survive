// The crash camera: when the player's car has a big accident, the game stops being a chase-cam and becomes a director.
//
//  * Trigger: the car is thrown into the air, or a hit of CRASH_G or more.
//  * Time: the race drops to 0.15x and eases back to 0.6x while the car is still going (each new big impact dips it
//    again) - the camera, the screen effects and the sound run in real time, so the slow motion stays crisp.
//  * The shot: exterior and low, placed AHEAD of the car's momentum so the wreck tumbles toward the lens, aimed at
//    its centre of mass leaned toward the impact, a Dutch tilt, the field of view squeezed from 80 to 50 degrees.
//    A new cut when the car gets too close, goes past or gets too far; the line of sight is checked against the
//    buildings and stands (and the camera kept inside the walls) so nothing ever blocks or clips the view.
//  * Aftertouch: steering nudges the tumbling car sideways (a little, ~3 m/s at most).
//  * Resolution: once the car is below 1 m/s and hardly rotating for 0.5 s (race time), the crash is over - a last
//    chord, a flash - and either the car drives on (control back) or the camera circles the wreck slowly.
import * as THREE from 'three';

export const CRASH_G = 30;
const _v = new THREE.Vector3(), _t = new THREE.Vector3(), _d = new THREE.Vector3(), _s = new THREE.Vector3();

export class CrashCam {
  /** @param o { camera, track, obstacles, fx: { onImpact(g), onResolve(car), onTick() } } */
  constructor(o) { this.o = o; this.camera = o.camera; this.fx = o.fx; this.on = false; }
  // (read through: the circuit is loaded after the camera is made, and changes)
  get track() { return this.o.track; }
  get obstacles() { return this.o.obstacles; }

  /** the car's centre and velocity, on its wheels or tumbling */
  state(car) {
    if (car.p && (car.air || car.wreck)) { _v.set(car.p[0], car.p[1], car.p[2]); _d.set(car.v ? car.v[0] : 0, car.v ? car.v[1] : 0, car.v ? car.v[2] : 0); }
    else { const [vx, vz] = car.worldVel(); _v.set(car.x, 0.55 + (car.hv || 0), car.z); _d.set(vx, 0, vz); }
    return { p: _v, v: _d };
  }
  start(car, g) {
    this.on = true; this.resolved = false; this.car = car; this.t = 0; this.still = 0; this.peak = g; this.hits = 1;
    this.scale = 0.15; this.dip = 0; this.fov = 80; this.dutch = (Math.random() < 0.5 ? -1 : 1) * (0.1 + Math.random() * 0.1);
    this.shake = 0.5; this.shakeDir = new THREE.Vector3(Math.random() - 0.5, 0.4, Math.random() - 0.5).normalize(); this.blur = 1; this.sat = 1.7;
    this.nudge = 0; this.tickT = 0; this.calm = 0; this.cut(car);
  }
  /** a new shot: ahead of where the car is going, low, a little to one side, clear of buildings and walls */
  cut(car) {
    const { p, v } = this.state(car), sp = Math.hypot(v.x, v.z);
    _t.set(v.x, 0, v.z); if (sp < 2) _t.set(Math.cos(car.th), 0, Math.sin(car.th)); _t.normalize();
    // (well ahead and to one side: the wreck comes at the lens and tumbles past it, not into it)
    const side = Math.random() < 0.5 ? -1 : 1, D = Math.max(12, Math.min(42, 10 + sp * 0.55));
    _s.set(-_t.z * side, 0, _t.x * side);
    const cam = p.clone().addScaledVector(_t, D).addScaledVector(_s, 5 + Math.random() * 4); cam.y = 0.9 + Math.random() * 0.8;
    this.pos = this.clear(p, cam);
  }
  /** pull the camera in along the line to the target until nothing stands in between, and keep it inside the walls */
  clear(target, cam) {
    const tr = this.track, O = this.obstacles, h = {};
    for (let k = 0; k < 8; k++) {
      let blocked = false;
      for (let i = 1; i <= 8 && !blocked; i++) { const f = i / 8, x = target.x + (cam.x - target.x) * f, z = target.z + (cam.z - target.z) * f, y = target.y + (cam.y - target.y) * f; if (O && O.hit(x, z, y, h)) blocked = true; }
      const q = tr.nearest(cam.x, cam.z), side = Math.sign(q.d) || 1, wall = tr.barrierHeight?.(q.i, side) > 2 ? tr.wallAt(q.i, side) - 1.2 : Infinity;
      if (Math.abs(q.d) > wall) blocked = true;
      if (!blocked) break;
      cam.lerp(target, 0.25); cam.y = Math.max(cam.y, 0.8);
    }
    return cam;
  }
  /** a hit during the crash: the director's reactions (time dips, the shake, the blur pulse) */
  impact(g) {
    if (!this.on) return;
    this.hits++; this.peak = Math.max(this.peak, g);
    if (g >= 15 && !this.resolved && this.t < 4) this.dip = Math.max(this.dip, 0.5);   // (impact time: only while the crash is young)
    this.shake = Math.max(this.shake, Math.min(0.6, g / 60)); this.shakeDir.set(Math.random() - 0.5, 0.5, Math.random() - 0.5).normalize();
    this.blur = Math.max(this.blur, Math.min(1, g / 40)); this.sat = Math.max(this.sat, 1.25 + Math.min(0.5, g / 80));
  }
  /** the race's time scale now */
  get timeScale() {
    if (!this.on) return 1;
    if (this.resolved) return Math.min(1, 0.6 + this.endT * 1.2);
    if (this.dip > 0) return 0.25;
    if (this.t < 1.2) return 0.15;
    // (once it has stopped tumbling and is only sliding, back toward real time: nobody wants a slow-motion skid)
    // (and never more than ~6 s of slow motion in all: the drama is the first seconds)
    return Math.min(1, Math.max(Math.min(0.6, 0.15 + (this.t - 1.2) * 0.3) + this.calm * 0.6, this.t > 4 ? 0.6 + (this.t - 4) * 0.2 : 0));
  }
  /** aftertouch: the steering nudges the wreck sideways (in the camera's screen sense: left is left) */
  aftertouch(steer, simDt) {
    const car = this.car; if (!this.on || this.resolved || !steer || this.nudge > 3) return;
    const dv = steer * 4 * simDt; this.nudge += Math.abs(dv);
    const f = new THREE.Vector3(); this.camera.getWorldDirection(f); const r = new THREE.Vector3(-f.z, 0, f.x).normalize();   // screen right
    if (car.p && car.v) { car.v[0] -= r.x * dv; car.v[2] -= r.z * dv; }
    else { const c = Math.cos(car.th), s = Math.sin(car.th); const wx = -r.x * dv, wz = -r.z * dv; car.vLong += wx * c + wz * s; car.vLat += wx * s - wz * c; }
  }
  /** every frame (real time dt, race time simDt): the shot, the effects, the resolution */
  update(dt, simDt) {
    const car = this.car, cam = this.camera; this.t += dt; this.dip = Math.max(0, this.dip - dt);
    const { p, v } = this.state(car), sp = v.length(), w = car.w ? Math.hypot(car.w[0], car.w[1], car.w[2]) : Math.abs(car.r || 0);
    this.calm = w < 1.5 && this.t > 1.5 ? (this.calm || 0) + dt : 0;
    // resolution: still for 0.5 s of race time
    if (!this.resolved) {
      this.still = sp < 1 && w < 1 ? this.still + simDt : 0;
      if (this.still > 0.5) { this.resolved = true; this.endT = 0; this.orbit = Math.atan2(cam.position.z - p.z, cam.position.x - p.x); this.fx.onResolve?.(car, this); }
      this.tickT -= dt; if (this.tickT <= 0) { this.tickT = 0.085; this.fx.onTick?.(); }
    } else this.endT += dt;
    // the shot
    if (this.resolved) {
      // a slow circle round the wreck
      this.orbit += dt * 0.22; const R = 9;
      this.pos.set(p.x + Math.cos(this.orbit) * R, 2.8, p.z + Math.sin(this.orbit) * R); this.pos = this.clear(p, this.pos);
    } else {
      const toCam = _s.copy(this.pos).sub(p), dist = toCam.length(), ahead = toCam.x * v.x + toCam.z * v.z;
      if (dist < 4.5 || dist > 60 || (sp > 3 && ahead < 0 && dist > 9)) this.cut(car);
    }
    cam.position.copy(this.pos);
    // aimed at the centre, leaned a little toward where it is going (the impact vector)
    _t.copy(p).addScaledVector(v, 0.06); _t.y = Math.max(0.3, _t.y);
    cam.up.set(0, 1, 0); cam.lookAt(_t);
    cam.rotateZ(this.resolved ? this.dutch * Math.max(0, 1 - this.endT) : this.dutch);
    // field of view: squeezed from 80 to 50 over the first half second
    this.fov += (50 - this.fov) * Math.min(1, dt * 6); if (Math.abs(cam.fov - this.fov) > 0.05) { cam.fov = this.fov; cam.updateProjectionMatrix(); }
    // the shake: a decaying jolt along the impact direction
    if (this.shake > 0.001) { const s = this.shake * (Math.random() - 0.3); cam.position.addScaledVector(this.shakeDir, s); this.shake *= Math.exp(-dt * 7); }
    this.blur *= Math.exp(-dt * 6); this.sat = 1 + (this.sat - 1) * Math.exp(-dt * (this.resolved ? 3 : 1.2));
  }
  stop() { this.on = false; this.resolved = false; this.blur = 0; this.sat = 1; }
}
