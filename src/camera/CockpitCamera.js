// Cockpit camera at driver eye level with head-bob, lateral-G tilt and speed FOV warp; chase/TV modes as extras.
import * as THREE from 'three';

/**
 * The T-cam pod on top of the airbox (CarMesh: 0.18 m behind the car's centre, top of the car at 0.97 m). Forward and
 * rear views both come from it. 1.1 m up keeps the helmet ~0.45 m from the lens, clear of the 0.3 m near plane.
 */
export const TCAM_X = -0.13, TCAM_Y = 1.21;   // (just over the camera pod on the airbox: vehicle/CarModel.js)

export class CockpitCamera {
  constructor(camera) {
    this.cam = camera;
    this.mode = 'cockpit';
    this.t = 0;
    this.roll = 0; this.shiftY = 0; this.shiftZ = 0;
    this.baseFov = 74;
    this._pos = new THREE.Vector3(); this._look = new THREE.Vector3(); this._up = new THREE.Vector3(0, 1, 0);
    this._chase = new THREE.Vector3(); this._tgt = new THREE.Vector3();   // scratch: no per-frame allocations
    // driver's head: lookIn is the request (-1 full left .. +1 full right, Q / E or the right stick), look follows it
    // smoothly; back (C held) cuts straight to the rear view
    this.lookIn = 0; this.look = 0; this.back = false;
  }
  toggle() { const order = ['cockpit', 'tcam', 'chase', 'tv']; this.mode = order[(order.indexOf(this.mode) + 1) % order.length]; }

  /**
   * Look back (C), cut in instantly, a different view per camera:
   *  cockpit - the driver's view back: just above his helmet, looking over the engine cover at the cars behind;
   *  T-cam   - the rear-facing T-cam on the airbox (as in the broadcast), low over the rear wing;
   *  chase   - the reverse chase: out in front of the car at chase distance, looking back at it and the pack;
   *  TV      - the trackside camera behind the car instead of the one ahead.
   */
  _rear(car, c, s, v, track) {
    let fov = 72;
    if (this.mode === 'cockpit') {
      this.cam.position.set(car.x + 1.3 * c, 1.25, car.z + 1.3 * s);
      this.cam.lookAt(car.x - 30 * c, 0.5, car.z - 30 * s);
    } else if (this.mode === 'tcam') {
      // the same pod as the forward T-cam, just facing the other way (no jump in position when C is pressed)
      this.cam.position.set(car.x + TCAM_X * c, TCAM_Y, car.z + TCAM_X * s);
      this.cam.lookAt(car.x - 25 * c, 0.55, car.z - 25 * s); fov = 66;
    } else if (this.mode === 'chase') {
      const ahead = 8.5 + v * 0.03;
      this.cam.position.set(car.x + c * ahead, 2.6 + v * 0.006, car.z + s * ahead);
      this.cam.lookAt(car.x - c * 6, 0.9, car.z - s * 6); fov = 62;
    } else {
      const seg = Math.floor(car.s / 220) - 1, sc = seg * 220 + 110, f = track.sample(sc, track.wallAt(track.idxAtS(sc), 1) + 6);
      this.cam.position.set(f.x, 9, f.z); this.cam.lookAt(car.x, 0.8, car.z);
      fov = Math.max(12, Math.min(60, 1800 / Math.max(20, Math.hypot(car.x - f.x, car.z - f.z))));
    }
    this.cam.up.set(0, 1, 0);
    if (this.cam.fov !== fov) { this.cam.fov = fov; this.cam.updateProjectionMatrix(); }
  }

  update(car, dt, track) {
    this.t += dt;
    this.look += (this.lookIn - this.look) * Math.min(1, dt * 7);
    if (Math.abs(this.look) < 1e-3 && this.lookIn === 0) this.look = 0;
    // a big accident: the onboard cameras would tumble with the car, so the director cuts to a chase shot from the
    // direction the car was travelling when it went, off to one side and up a little, following the wreck to rest
    if (car.air || car.wreck) {
      if (!this._crash) {
        const [vx, vz] = car.air ? [car.wvx, car.wvz] : [Math.cos(car.th), Math.sin(car.th)]; const l = Math.hypot(vx, vz) || 1;
        this._crash = { dx: vx / l, dz: vz / l, side: Math.random() < 0.5 ? 1 : -1 };
        this.cam.position.set(car.x - this._crash.dx * 22, 5, car.z - this._crash.dz * 22);
      }
      const k = this._crash;
      this._chase.set(car.x - k.dx * 13 + k.dz * 8 * k.side, 3.8, car.z - k.dz * 13 - k.dx * 8 * k.side);
      this.cam.position.lerp(this._chase, Math.min(1, dt * 7)); this.cam.up.set(0, 1, 0);
      this._tgt.set(car.x, 0.6 + car.y, car.z); this.cam.lookAt(this._tgt);
      if (Math.abs(this.cam.fov - 50) > 0.05) { this.cam.fov += (50 - this.cam.fov) * Math.min(1, dt * 3); this.cam.updateProjectionMatrix(); }
      return;
    }
    this._crash = null;
    const c = Math.cos(car.th), s = Math.sin(car.th);
    const left = [s, -c];
    const v = car.speed;
    const latG = car.ay / 9.81;
    if (this.back) { this._rear(car, c, s, v, track); this._wasBack = true; return; }
    // released: the chase camera cuts straight back to its place behind the car (no swoop across from the front)
    if (this._wasBack) { this._wasBack = false; if (this.mode === 'chase') { const b = 8.5 + v * 0.03, a = car.th + this.look * 1.4; this._chase.set(car.x - Math.cos(a) * b, 2.6 + v * 0.006, car.z - Math.sin(a) * b); } }
    // looking to the side: the head turns up to 80 degrees and moves out and up past the halo and the sidepod
    const look = this.mode === 'tv' ? 0 : this.look, lookYaw0 = look * 1.4, side = -look;   // side: + = toward the left
    // the chassis under the camera: heave, pitch and roll of the sprung body (kerbs, bumps, braking, cornering)
    const bodyY = (ex, ey) => (car.hv || 0) + ex * (car.pt || 0) + ey * (car.rl || 0);
    if (this.mode === 'cockpit') {
      // head bob: low-frequency sway grows with speed; the body's own motion carries the kerbs and the bumps, and the
      // driver's head shakes on top of it (the buzz of a kerb's ridges is faster than a frame)
      const sway = 0.006 * Math.min(1, v / 80);
      const rumble = (car.onKerb ? 0.005 : car.offTrack ? 0.008 : 0) * Math.min(1, v / 40);
      const bobY = Math.sin(this.t * 9.3) * sway + (Math.random() - 0.5) * rumble + bodyY(0.25, 0) * 1.4;
      const bobZ = Math.sin(this.t * 6.1) * sway * 0.6 + (Math.random() - 0.5) * rumble * 0.5;
      // lateral g: head/camera lean into the outside of the corner, roll opposite
      const targetShift = -latG * 0.035, targetRoll = latG * 0.028;
      this.shiftZ += (targetShift - this.shiftZ) * Math.min(1, dt * 6);
      this.roll += (targetRoll - this.roll) * Math.min(1, dt * 6);
      // the driver's eyes: 0.77 m off the ground, under the halo ring at 0.86 m (the car is 0.97 m tall at the roll hoop)
      const al = Math.abs(look);
      const eyeX = 0.25 - 0.1 * al, eyeY = 0.77 + 0.2 * al + bobY - Math.min(0.03, Math.max(-0.03, -car.ax * 0.003)), eyeZ = this.shiftZ + bobZ + side * 0.55;
      this._pos.set(car.x + eyeX * c + eyeZ * left[0], eyeY, car.z + eyeX * s + eyeZ * left[1]);
      // look slightly into the steering direction (and wherever the driver turns his head)
      const lookYaw = car.steer * 0.12 * (1 - al) - lookYaw0;
      const lx = Math.cos(car.th - lookYaw), lz = Math.sin(car.th - lookYaw);
      this._look.set(this._pos.x + lx * 30, 0.55 + bobY * 0.3 + 30 * (car.pt || 0) * 1.4, this._pos.z + lz * 30);   // nose dives under braking
      const rl = this.roll * (1 - al) - (car.rl || 0) * 1.4;
      this._up.set(Math.sin(rl) * left[0], Math.cos(rl), Math.sin(rl) * left[1]);
      this.cam.position.copy(this._pos); this.cam.up.copy(this._up); this.cam.lookAt(this._look);
      // speed FOV warp
      const fov = this.baseFov + 15 * Math.min(1, v / 95) + car.slipstream * 2;
      if (Math.abs(this.cam.fov - fov) > 0.05) { this.cam.fov += (fov - this.cam.fov) * Math.min(1, dt * 4); this.cam.updateProjectionMatrix(); }
    } else if (this.mode === 'tcam') {
      // broadcast T-cam: on top of the airbox, looking over the driver's helmet
      // bolted to the airbox: it moves exactly as the body does, plus a fine buzz from the engine and the kerbs
      const rumble = (car.onKerb ? 0.003 : car.offTrack ? 0.006 : 0.0008) * Math.min(1, v / 40);
      const bobY = (Math.random() - 0.5) * rumble + bodyY(TCAM_X, 0);
      const al = Math.abs(look);
      this._pos.set(car.x + TCAM_X * c + side * 0.4 * left[0], TCAM_Y + 0.15 * al + bobY, car.z + TCAM_X * s + side * 0.4 * left[1]);
      const lookYaw = car.steer * 0.05 * (1 - al) - lookYaw0; const lx = Math.cos(car.th - lookYaw), lz = Math.sin(car.th - lookYaw);
      this._look.set(this._pos.x + lx * 25, 0.45 + 25 * (car.pt || 0), this._pos.z + lz * 25);
      this.roll += (latG * 0.004 - this.roll) * Math.min(1, dt * 6);
      const rl = this.roll - (car.rl || 0);
      this._up.set(Math.sin(rl) * left[0], Math.cos(rl), Math.sin(rl) * left[1]);
      this.cam.position.copy(this._pos); this.cam.up.copy(this._up); this.cam.lookAt(this._look);
      const fov = 68 + 8 * Math.min(1, v / 95);
      if (Math.abs(this.cam.fov - fov) > 0.05) { this.cam.fov += (fov - this.cam.fov) * Math.min(1, dt * 4); this.cam.updateProjectionMatrix(); }
    } else if (this.mode === 'chase') {
      // the whole rig swings round the car toward the side being looked at
      const back = 8.5 + v * 0.03, a = car.th + lookYaw0, ca = Math.cos(a), sa = Math.sin(a);
      const target = this._tgt.set(car.x - ca * back, 2.6 + v * 0.006, car.z - sa * back);
      this._chase.lerp(target, Math.min(1, dt * 5)); this.cam.position.copy(this._chase);
      this.cam.up.set(0, 1, 0); this.cam.lookAt(car.x + ca * 6, 0.9, car.z + sa * 6);
      if (this.cam.fov !== 62) { this.cam.fov = 62; this.cam.updateProjectionMatrix(); }
    } else {
      // TV camera: static positions along the barriers every 220 m
      const seg = Math.floor(car.s / 220); const sc = seg * 220 + 110; const f = track.sample(sc, track.wallAt(track.idxAtS(sc), 1) + 6);
      this.cam.position.set(f.x, 9, f.z); this.cam.up.set(0, 1, 0); this.cam.lookAt(car.x, 0.8, car.z);
      const dist = Math.hypot(car.x - f.x, car.z - f.z); const fov = Math.max(12, Math.min(60, 1800 / Math.max(20, dist)));
      this.cam.fov += (fov - this.cam.fov) * Math.min(1, dt * 3); this.cam.updateProjectionMatrix();
    }
  }
}
