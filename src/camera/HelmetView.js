// The view from inside the helmet (the helmet camera: your own cockpit view, the broadcast's driver's-eye shot).
// Two things, both real geometry in the scene rather than a picture laid over it:
//   1. The car round the lens, whole. The world is drawn with the game's ordinary near plane (30 cm: nearer, the
//      painted lines far down the road flicker in the depth buffer) - which cut the halo, the cockpit's rim, the wheel
//      and the driver's arms open wherever they came inside it. So the car the camera sits in is drawn a second
//      time, on top, with a near plane of 3 cm (its own layer; the first pass's shadow map kept), and the driver's
//      own head is taken out of it.
//   2. The helmet itself, fixed to the lens: the lining round the eye-port (out of focus - its edge is soft) and the
//      visor's glass. Both are lit by what is really there. The lining by the light that comes in through the port:
//      the sun when it stands in front of the visor, the sky's and the ground's own light. The glass by the
//      environment map the whole scene is lit with (the haze of the visor: the light in front of it, scattered - and
//      the sheen where it curves away), by the sun (its halo, and the streaks it draws along the glass's scratches
//      and dust) - gone when the sun is behind a grandstand or a bridge, or behind the driver - and by the visor's
//      own coating, which tints the road and turns colour toward the curve.
import * as THREE from 'three';
import { RAIN_GLSL } from './LensRain.js';

export const HELMET_LAYER = 7;
const AZ = 59 * Math.PI / 180, EL_T = 31 * Math.PI / 180, EL_B = 31 * Math.PI / 180, NPOW = 2.9;   // the eye-port, as the eye sees it
const HEAD_Z = 0.07, VISOR_R = 0.135;   // the head's centre behind the eye, the visor's radius about it

/** a point of the eye-port's edge (t round it), scaled out by s from the middle -> [azimuth, elevation] */
function edge(t, s) {
  const c = Math.cos(t), sn = Math.sin(t), x = Math.sign(c) * Math.pow(Math.abs(c), 2 / NPOW), y = Math.sign(sn) * Math.pow(Math.abs(sn), 2 / NPOW);
  return [AZ * x * s, (y > 0 ? EL_T : EL_B) * y * s];
}
const dirOf = (az, el, out) => out.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));

/** the lining round the eye-port: rings from just inside its edge (clear) out past the edge of sight (black) */
function liningGeo() {
  const N = 96, RINGS = [[0.84, 0, 1.7], [0.92, 0.8, 1.5], [1.0, 1, 1.0], [1.22, 1, 0.6], [1.7, 1, 0.34], [2.5, 1, 0.2]];
  const pos = [], nor = [], shade = [], idx = [], d = new THREE.Vector3(), n = new THREE.Vector3(), mid = new THREE.Vector3(0, 0, -1);
  for (let k = 0; k < RINGS.length; k++) {
    const [s, a, sh] = RINGS[k];
    for (let i = 0; i <= N; i++) {
      const t = i / N * Math.PI * 2; let [az, el] = edge(t, s); az = Math.max(-2.9, Math.min(2.9, az)); el = Math.max(-1.45, Math.min(1.45, el));
      dirOf(az, el, d); const r = 0.066 + 0.03 * Math.min(1, (az / AZ) ** 2) - (k > 3 ? 0.012 * (k - 3) : 0);
      pos.push(d.x * r, d.y * r, d.z * r);
      // (it faces the eye, turned a little toward the middle of the port near its edge: the padding's rounded lip)
      n.copy(d).multiplyScalar(-1).addScaledVector(mid, k < 3 ? 0.55 : 0.15).normalize(); nor.push(n.x, n.y, n.z);
      shade.push(sh, a);
    }
  }
  for (let k = 0; k < RINGS.length - 1; k++) for (let i = 0; i < N; i++) { const a = k * (N + 1) + i, b = a + N + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('aShade', new THREE.Float32BufferAttribute(shade, 2)); g.setIndex(idx);
  return g;
}
/** the visor's glass: the part of a sphere about the head that the eye-port shows (a little more) */
function glassGeo() {
  const NU = 56, NV = 28, pos = [], nor = [], uv = [], idx = [], d = new THREE.Vector3();
  for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
    const u = i / NU * 2 - 1, v = j / NV * 2 - 1, az = u * AZ * 1.12, el = v * (v > 0 ? EL_T : EL_B) * 1.15; dirOf(az, el, d);
    // (the ray from the eye out to the sphere about the head's centre, HEAD_Z behind it)
    const b = d.z * HEAD_Z, t = -b + Math.sqrt(b * b - (HEAD_Z * HEAD_Z - VISOR_R * VISOR_R)), x = d.x * t, y = d.y * t, z = d.z * t;
    pos.push(x, y, z); nor.push(-x / VISOR_R, -y / VISOR_R, (HEAD_Z - z) / VISOR_R); uv.push(u, v);
  }
  for (let j = 0; j < NV; j++) for (let i = 0; i < NU; i++) { const a = j * (NU + 1) + i, b = a + NU + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}

const VERT = /* glsl */`
attribute vec2 aShade; varying vec3 vN; varying vec3 vP; varying vec2 vS; varying vec2 vUv;
void main() { vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position, 1.0); vP = mv.xyz; vS = aShade; vUv = uv; gl_Position = projectionMatrix * mv; }`;
const LINING_FRAG = /* glsl */`
uniform vec3 uSunV; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGround; uniform float uVis;
varying vec3 vN; varying vec3 vP; varying vec2 vS;
void main() {
  vec3 n = normalize(vN);
  // (only the light that comes in through the eye-port: the sun when it stands in front of the visor)
  float through = smoothstep(-0.05, 0.5, -uSunV.z), nl = max(dot(n, uSunV), 0.0);
  vec3 amb = mix(uGround, uSky, 0.5 + 0.5 * n.y);
  vec3 col = vec3(0.03, 0.03, 0.034) * (amb * 1.1 + uSunCol * uVis * through * (0.08 + 0.9 * nl)) * vS.x;
  gl_FragColor = vec4(col, vS.y);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
const TINT_FRAG = /* glsl */`
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
void main() {
  float e = 1.0 - clamp(dot(-normalize(vP), normalize(vN)), 0.0, 1.0);
  vec3 irid = 0.5 + 0.5 * cos(6.2831853 * (e * 1.7 + vec3(0.0, 0.33, 0.67)) + 2.1);
  vec3 tint = vec3(0.90, 0.93, 0.95);                                              // a lightly smoked visor
  tint *= mix(vec3(1.0), 0.72 + 0.4 * irid, smoothstep(0.06, 0.5, e) * 0.6);       // its coating: colour toward the curve
  tint *= 1.0 - 0.3 * smoothstep(0.45, 1.0, vUv.y);                                // the darker band along its top
  gl_FragColor = vec4(tint, 1.0);
}`;
const GLASS_FRAG = /* glsl */`
uniform sampler2D envMap; uniform float uEnvI; uniform mat3 uToWorld; uniform vec3 uSunV; uniform vec3 uSunCol; uniform vec3 uSky; uniform float uVis; uniform float uWet;
varying vec3 vN; varying vec3 vP; varying vec2 vUv;
#include <cube_uv_reflection_fragment>
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
vec3 envAt(vec3 dirWorld, float rough) {
  #ifdef ENVMAP_TYPE_CUBE_UV
    return textureCubeUV(envMap, dirWorld, rough).rgb * uEnvI;
  #else
    return uSky;
  #endif
}
void main() {
  vec3 v = normalize(vP), n = normalize(vN);
  float e = 1.0 - clamp(dot(-v, n), 0.0, 1.0), fres = 0.04 + 0.96 * pow(e, 4.0);
  // the dust on the glass and its fine scratches (they run across it, from wiping): seen only in the light
  float dust = 0.55 * noise(vUv * vec2(9.0, 6.0)) + 0.3 * noise(vUv * vec2(31.0, 23.0)) + 0.15 * noise(vUv * vec2(14.0, 150.0));
  // the visor's haze: the light in front of it, scattered through it; its sheen where it curves away
  vec3 veil = envAt(uToWorld * v, 0.9) * (0.035 + 0.035 * dust);
  vec3 sheen = envAt(uToWorld * reflect(v, n), 0.3) * fres * 0.7;
  // the sun: a halo round where it stands, a streak along the scratches, a shorter one down the glass
  float front = smoothstep(-0.25, 0.3, -uSunV.z), sd = max(dot(v, uSunV), 0.0);
  vec2 a = vec2(atan(v.x, -v.z), asin(clamp(v.y, -1.0, 1.0))), s = vec2(atan(uSunV.x, max(-uSunV.z, 0.05)), asin(clamp(uSunV.y, -1.0, 1.0))), dA = a - s;
  float halo = 0.04 * pow(sd, 4.0) + 0.18 * pow(sd, 30.0) + 0.7 * pow(sd, 300.0);
  float streak = 0.2 * exp(-dA.y * dA.y / 0.0011) * exp(-dA.x * dA.x / 0.45) + 0.05 * exp(-dA.x * dA.x / 0.002) * exp(-dA.y * dA.y / 0.1);
  vec3 sun = uSunCol * uVis * front * (halo + streak) * (0.65 + 0.7 * dust);
  // (rain: the water on the glass lifts the haze)
  gl_FragColor = vec4(veil * (1.0 + 1.5 * uWet) + sheen + sun, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const RAIN_FRAG = /* glsl */`
uniform sampler2D tScene; uniform float uTime; uniform float uAmount; uniform float uSeed; uniform float uFlow; uniform vec2 uRes; uniform vec2 uDir;
varying vec2 vUv;
${RAIN_GLSL}
void main() {
  // (the drops are on the glass - where they are on it - and what they bend is the picture behind them)
  vec2 q = vUv * vec2(1.55, 0.82), p = vec2(q.x * -uDir.y + q.y * uDir.x, -(q.x * uDir.x + q.y * uDir.y));
  vec4 d = lensDrops(tScene, gl_FragCoord.xy / uRes, p * 0.8, uTime, uAmount, uSeed, uFlow); if (d.a <= 0.002) discard;
  gl_FragColor = d;
}`;

export class HelmetView {
  constructor(scene) {
    this.scene = scene; this.mesh = null; this.scanT = 0; this.vis = 1; this.visT = 0; this.visWant = 1; this.envH = null;
    const rig = this.rig = new THREE.Group(); rig.name = 'helmet-view'; rig.visible = false; scene.add(rig);
    const U = this.U = { uSunV: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color(1, 1, 1) }, uSky: { value: new THREE.Color(0.3, 0.4, 0.6) }, uGround: { value: new THREE.Color(0.1, 0.1, 0.1) },
      uVis: { value: 1 }, uWet: { value: 0 }, uEnvI: { value: 1 }, uToWorld: { value: new THREE.Matrix3() }, envMap: { value: null } };
    const common = { depthTest: false, depthWrite: false, transparent: true, fog: false, side: THREE.DoubleSide };
    const glass = glassGeo();
    this.tint = new THREE.Mesh(glass, new THREE.ShaderMaterial({ ...common, uniforms: {}, vertexShader: VERT, fragmentShader: TINT_FRAG, blending: THREE.MultiplyBlending, toneMapped: false })); this.tint.renderOrder = 9000;
    this.glassMat = new THREE.ShaderMaterial({ ...common, uniforms: U, vertexShader: VERT, fragmentShader: GLASS_FRAG, blending: THREE.AdditiveBlending });
    this.glass = new THREE.Mesh(glass, this.glassMat); this.glass.renderOrder = 9001;
    // (rain on the glass: camera/LensRain.js's drops, on the visor's own surface, under its tint)
    this.RU = { tScene: { value: null }, uTime: { value: 0 }, uAmount: { value: 0 }, uSeed: { value: 0 }, uFlow: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uDir: { value: new THREE.Vector2(0, -1) } };
    this.rain = new THREE.Mesh(glass, new THREE.ShaderMaterial({ ...common, uniforms: this.RU, vertexShader: VERT, fragmentShader: RAIN_FRAG, toneMapped: false })); this.rain.renderOrder = 8990; this.rain.visible = false; this.rainSrc = null;
    this.lining = new THREE.Mesh(liningGeo(), new THREE.ShaderMaterial({ ...common, uniforms: U, vertexShader: VERT, fragmentShader: LINING_FRAG })); this.lining.renderOrder = 9002;
    for (const m of [this.rain, this.tint, this.glass, this.lining]) { m.frustumCulled = false; m.layers.set(HELMET_LAYER); rig.add(m); }
    this._m4 = new THREE.Matrix4(); this._v = new THREE.Vector3();
  }
  get on() { return !!this.mesh; }
  _tag(on) {
    const m = this.mesh; if (!m) return;
    m.group.traverse((o) => { if (on) o.layers.enable(HELMET_LAYER); else o.layers.disable(HELMET_LAYER); });
    if (on) this.scene.traverse((o) => { if (o.isLight) o.layers.enable(HELMET_LAYER); });
  }
  /**
   * The driver's arms as his own eyes have them: the model's shoulders sit a hand below the lens and close beside it (right
   * for a camera outside the car), so each sleeve filled a third of the picture. From inside the helmet they start
   * where the chin bar hides them - lower and wider, down in the tub - and come up to the wheel as forearms and gloves.
   */
  _shoulders(mesh, on) {
    for (const A of mesh.arms || []) { if (on && !A.sh0) { A.sh0 = A.sh.clone(); A.sh.set(A.sh0.x + 0.05, A.sh0.y - 0.17, A.sh0.z * 1.3); } else if (!on && A.sh0) { A.sh.copy(A.sh0); A.sh0 = null; } }
    try { mesh._arms?.(mesh.wheelSteer ? mesh.wheelSteer.rotation.x : 0); } catch (e) { /* as they are */ }
  }
  /** the car whose driver's eyes these are (its model: vehicle/CarMesh.js), or null: no helmet view */
  attach(mesh, keepHead = false) {   // (keepHead: the head stays out of the car let go - the camera is still in it, another way)
    if (mesh === this.mesh) return;
    if (this.mesh) { this._tag(false); if (this.mesh.helmet && !keepHead) this.mesh.helmet.visible = true; this._shoulders(this.mesh, false); }
    this.mesh = mesh || null; this.rig.visible = !!mesh; this.scanT = 0;
    if (mesh) { this._tag(true); this.vis = this.visWant; this._shoulders(mesh, true); }
  }
  /**
   * Before the picture is drawn: the helmet where the camera is, the light as it is now.
   * o: { sunDir (world, toward the sun), sun, hemi (the scene's lights), wet 0..1, sunClear(x, y, z, dir) -> is the sun in
   *      sight from there, shake: [x, y] metres (the helmet moving on the head),
 *      rain: { src (a LensRain: its copy of the picture, its clock and amount), dir: [x, y], flow } | null }
   */
  sync(camera, dt, o = {}) {
    const m = this.mesh; if (!m) return;
    if (m.helmet && m.helmet.visible) m.helmet.visible = false;   // (the driver's own head: the lens is inside it)
    // (parts the car has gained since - a tyre coming apart, pieces - and lights lit since: on the layer too)
    this.scanT -= dt; if (this.scanT <= 0) { this.scanT = 2; this._tag(true); }
    camera.updateMatrixWorld(); const rig = this.rig; rig.position.copy(camera.position); rig.quaternion.copy(camera.quaternion);
    if (o.shake) { this._v.set(o.shake[0], o.shake[1], 0).applyQuaternion(camera.quaternion); rig.position.add(this._v); }
    rig.updateMatrixWorld(true);
    const U = this.U, sd = o.sunDir;
    if (sd) U.uSunV.value.copy(sd).transformDirection(camera.matrixWorldInverse);
    if (o.sun) U.uSunCol.value.copy(o.sun.color).multiplyScalar(o.sun.visible === false ? 0 : o.sun.intensity);
    if (o.hemi) { U.uSky.value.copy(o.hemi.color).multiplyScalar(o.hemi.intensity); U.uGround.value.copy(o.hemi.groundColor).multiplyScalar(o.hemi.intensity); }
    U.uWet.value = o.wet || 0; U.uToWorld.value.setFromMatrix4(camera.matrixWorld);
    const rn = o.rain && o.rain.src.amount > 0.02 ? o.rain : null; this.rainSrc = rn ? rn.src : null; this.rain.visible = !!rn;
    if (rn) { const RU = this.RU, L = rn.src; RU.uTime.value = L.time; RU.uAmount.value = L.amount; RU.uSeed.value = L.seed % 977; RU.uFlow.value = rn.flow; RU.uDir.value.set(rn.dir[0], rn.dir[1]); }
    // (is the sun in sight? asked a few times a second, eased: into a grandstand's shadow the glare dies away)
    this.visT -= dt; if (this.visT <= 0 && sd) { this.visT = 0.22; this.visWant = sd.y < 0.02 ? 0.25 : o.sunClear ? (o.sunClear(camera.position.x, camera.position.y, camera.position.z, sd) ? 1 : 0) : 1; }
    this.vis += (this.visWant - this.vis) * Math.min(1, dt * 5); U.uVis.value = this.vis;
    // the scene's own environment map (how its reflections are packed: three's PMREM, the sizes its shaders are told)
    const env = this.scene.environment && this.scene.environment.mapping === THREE.CubeUVReflectionMapping ? this.scene.environment : null, h = env ? env.image.height : null;
    U.envMap.value = env; U.uEnvI.value = this.scene.environmentIntensity ?? 1;
    if (h !== this.envH) {
      this.envH = h; const D = this.glassMat.defines = {};
      if (h) { const maxMip = Math.log2(h) - 2; D.ENVMAP_TYPE_CUBE_UV = ''; D.CUBEUV_TEXEL_WIDTH = 1 / (3 * Math.max(Math.pow(2, maxMip), 7 * 16)); D.CUBEUV_TEXEL_HEIGHT = 1 / h; D.CUBEUV_MAX_MIP = `${maxMip}.0`; }
      this.glassMat.needsUpdate = true;
    }
  }
  /** after the world: the car round the lens and the helmet, from 3 cm (call only when the plain picture was just drawn) */
  render(renderer, camera) {
    if (!this.mesh) return;
    if (this.rainSrc) { const L = this.rainSrc; this.RU.tScene.value = L.tex; this.RU.uRes.value.copy(L.size); this.rain.visible = !!L.tex; }
    const scene = this.scene, near = camera.near, far = camera.far, mask = camera.layers.mask, bg = scene.background, ac = renderer.autoClear, su = renderer.shadowMap.autoUpdate;
    camera.near = 0.03; camera.far = 60; camera.updateProjectionMatrix(); camera.layers.set(HELMET_LAYER);
    scene.background = null; renderer.autoClear = false; renderer.shadowMap.autoUpdate = false;
    try { renderer.clearDepth(); renderer.render(scene, camera); }
    finally { camera.near = near; camera.far = far; camera.layers.mask = mask; camera.updateProjectionMatrix(); scene.background = bg; renderer.autoClear = ac; renderer.shadowMap.autoUpdate = su; }
  }
}
