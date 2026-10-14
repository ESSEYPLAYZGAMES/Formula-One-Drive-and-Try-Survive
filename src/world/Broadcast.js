// Live "world feed": a grid of camera views (driver onboards, trackside, pit lane, helicopter) rendered
// round-robin into a render-target atlas that the Sphere projects in its F1 stream mode.
import * as THREE from 'three';

export class Broadcast {
  /**
   * Double-buffered: tiles are rendered into `work`, then copied into `shown`, which is what the Sphere samples.
   * That lets the Sphere itself be one of the feeds (it is filmed showing the previous frame's atlas) without a
   * render target ever sampling itself.
   */
  constructor(size = 512, grid = 2, perFrame = 1) {
    this.size = size; this.grid = grid; this.perFrame = perFrame;
    const opts = { depthBuffer: true, samples: 0 };
    this.work = new THREE.WebGLRenderTarget(size, size, opts); this.shown = new THREE.WebGLRenderTarget(size, size, { depthBuffer: false });
    this.work.texture.colorSpace = THREE.SRGBColorSpace; this.shown.texture.colorSpace = THREE.SRGBColorSpace;
    this.cams = Array.from({ length: grid * grid }, () => new THREE.PerspectiveCamera(58, 1, 0.5, 4000));
    this.slot = 0;
    // blit quad (work -> shown)
    this.blitScene = new THREE.Scene(); this.blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.blitScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.work.texture })));
  }
  get texture() { return this.shown.texture; }
  dispose() { this.work.dispose(); this.shown.dispose(); for (const o of this.blitScene.children) { o.geometry.dispose(); o.material.dispose(); } }
  /** allocate + clear both targets now: the Sphere samples `shown` from the first frame, long before the stream is rendered */
  init(renderer) {
    const prev = renderer.getRenderTarget();
    for (const rt of [this.work, this.shown]) { renderer.setRenderTarget(rt); renderer.setClearColor(0x050505, 1); renderer.clear(); }
    renderer.setRenderTarget(prev);
  }

  /**
   * Renders `perFrame` tiles per call into the work atlas, then copies the atlas to the shown one.
   * @param poses array of functions (camera) => void that pose the camera (cycled if shorter than the grid)
   * @param hide objects hidden while rendering the tiles
   */
  update(renderer, scene, poses, hide = []) {
    if (!poses.length) return;
    for (const o of hide) o.visible = false;
    const prevTarget = renderer.getRenderTarget();
    const n = this.grid * this.grid, tile = this.size / this.grid;
    for (let k = 0; k < this.perFrame; k++) {
      const i = this.slot; this.slot = (this.slot + 1) % n;
      const cam = this.cams[i]; poses[i % poses.length](cam); cam.updateMatrixWorld();
      const x = (i % this.grid) * tile, y = Math.floor(i / this.grid) * tile;
      this.work.viewport.set(x, y, tile, tile); this.work.scissor.set(x, y, tile, tile); this.work.scissorTest = true;
      renderer.setRenderTarget(this.work);
      renderer.render(scene, cam);
    }
    for (const o of hide) o.visible = true;
    // copy the whole atlas into the buffer the Sphere reads (fog / tone mapping do not apply to the blit quad)
    const fog = scene.fog; const tm = renderer.toneMapping; renderer.toneMapping = THREE.NoToneMapping;
    renderer.setRenderTarget(this.shown); renderer.render(this.blitScene, this.blitCam);
    renderer.toneMapping = tm; renderer.setRenderTarget(prevTarget);
  }
}

/** Camera pose helpers shared by the Sphere feed and TV cameras. */
export const POSES = {
  /** broadcast T-cam on a car */
  onboard: (car) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th);
    cam.position.set(car.x - 0.18 * c, 1.1, car.z - 0.18 * s);   // the T-cam pod (CockpitCamera TCAM_X / TCAM_Y)
    cam.up.set(0, 1, 0); cam.lookAt(car.x + c * 25, 0.45, car.z + s * 25); cam.fov = 66; cam.updateProjectionMatrix();
  },
  /** nose camera: mounted on the nose tip just above the front wing, looking down the road */
  nose: (car) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th);
    cam.position.set(car.x + 2.6 * c, 0.42, car.z + 2.6 * s);
    cam.up.set(0, 1, 0); cam.lookAt(car.x + c * 40, 0.5, car.z + s * 40); cam.fov = 74; cam.updateProjectionMatrix();
  },
  /** visor / helmet camera: the driver's eye line, a touch of head movement with steering */
  visor: (car) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th);
    cam.position.set(car.x + 0.25 * c, 0.77, car.z + 0.25 * s);
    const yaw = car.th - car.steer * 0.18;
    cam.up.set(0, 1, 0); cam.lookAt(cam.position.x + Math.cos(yaw) * 30, 0.55, cam.position.z + Math.sin(yaw) * 30); cam.fov = 78; cam.updateProjectionMatrix();
  },
  /** roll-hoop side camera: looks across the sidepod at the front wheel and the track edge */
  sidepod: (car, side = 1) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th); const lx = s, lz = -c;   // left vector
    cam.position.set(car.x - 0.4 * c + lx * side * 0.55, 0.9, car.z - 0.4 * s + lz * side * 0.55);
    cam.up.set(0, 1, 0); cam.lookAt(car.x + 2.2 * c + lx * side * 6, 0.3, car.z + 2.2 * s + lz * side * 6); cam.fov = 70; cam.updateProjectionMatrix();
  },
  /** low rear-facing onboard (the "rear wing" camera) */
  rearward: (car) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th);
    cam.position.set(car.x - 2.05 * c, 0.95, car.z - 2.05 * s);
    cam.up.set(0, 1, 0); cam.lookAt(car.x - c * 30, 0.6, car.z - s * 30); cam.fov = 70; cam.updateProjectionMatrix();
  },
  /** static trackside camera at arc length s that pans to follow the nearest car (or looks down the track) */
  trackside: (track, s, side, cars) => (cam) => {
    const f = track.sample(s, side * (track.wallAt(track.idxAtS(s), side) + 4));
    cam.position.set(f.x, 4.5, f.z); cam.up.set(0, 1, 0);
    let best = null, bd = 260;
    for (const c of cars || []) { const L = track.length; let ds = c.s - s; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L; if (Math.abs(ds) < bd) { bd = Math.abs(ds); best = c; } }
    if (best) { cam.lookAt(best.x, 0.7, best.z); cam.fov = Math.max(14, Math.min(50, 900 / Math.max(25, Math.hypot(best.x - f.x, best.z - f.z)))); }
    else { const a = track.sample(s + 120, 0); cam.lookAt(a.x, 1.5, a.z); cam.fov = 40; }
    cam.updateProjectionMatrix();
  },
  /** helicopter shot above and behind a car */
  heli: (car) => (cam) => {
    const c = Math.cos(car.th), s = Math.sin(car.th);
    cam.position.set(car.x - c * 60 - s * 35, 45, car.z - s * 60 + c * 35);
    cam.up.set(0, 1, 0); cam.lookAt(car.x + c * 20, 0, car.z + s * 20); cam.fov = 38; cam.updateProjectionMatrix();
  },
  /** pit-lane camera looking along the pit boxes */
  pitlane: (pit) => (cam) => {
    const ps = pit.samples, i = Math.floor(ps.n * 0.3), j = Math.floor(ps.n * 0.75);
    cam.position.set(ps.px[i] + ps.nx[i] * -pit.trackSide * 3, 3.2, ps.pz[i] + ps.nz[i] * -pit.trackSide * 3);
    cam.up.set(0, 1, 0); cam.lookAt(ps.px[j], 1, ps.pz[j]); cam.fov = 44; cam.updateProjectionMatrix();
  },
  /** static beauty shot of a landmark */
  landmark: (center, radius, height, az) => (cam) => {
    cam.position.set(center.x + Math.cos(az) * radius, height, center.z + Math.sin(az) * radius);
    cam.up.set(0, 1, 0); cam.lookAt(center.x, height * 0.6, center.z); cam.fov = 46; cam.updateProjectionMatrix();
  },
};
