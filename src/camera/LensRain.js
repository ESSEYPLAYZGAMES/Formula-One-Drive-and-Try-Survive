// Rain on the glass in front of a camera: a broadcast camera's lens, the helmet's visor (camera/HelmetView.js).
// Drawn in the picture itself, after the world: the finished frame is copied to a texture and every drop is a small
// lens on it - the scene behind it bent and turned over inside the drop, a glint on its shoulder, a dark foot. Beads
// that sit where they landed, grow and are gone; runners that go where the water is pushed (down a camera that stands
// still, up and back over an onboard's lens and a visor at speed), each leaving a beaded tail.
// Every camera has its own drops (a seed: the same trackside camera has the same ones when the director comes back to
// it) and they are the drops of the frame being drawn: a cut changes them with the picture, not a moment after (they
// used to be HTML laid over the picture, looked at five times a second, faded in over a second).
import * as THREE from 'three';

/** GLSL: lensWater(p, t, amount, seed, flowSpeed) -> the water's height at p (p.y up the flow: runners go toward -y) */
export const RAIN_GLSL = /* glsl */`
float rh11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
vec3 rh23(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yzz) * q.zyx); }
float rBeads(vec2 p, float scale, float t, float amount, float seed) {
  vec2 g = p * scale, id = floor(g), f = fract(g) - 0.5; vec3 r = rh23(id + seed);
  float life = fract(t * (0.025 + 0.05 * r.x) + r.z);
  float rad = (0.09 + 0.24 * r.x * r.x) * smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.8, 1.0, life));
  vec2 c = (r.xz - 0.5) * 0.52; f.y *= 0.88;
  return step(r.y, amount) * smoothstep(rad, rad * 0.3, length(f - c));
}
float rRunners(vec2 p, float scale, float t, float amount, float seed) {
  float gx = p.x * scale, col = floor(gx), sp = 0.45 + 0.9 * rh11(col + seed);
  float gy = p.y * scale * 0.2 + t * sp + 10.0 * rh11(col * 7.31 + seed);
  vec3 r = rh23(vec2(col, floor(gy)) + seed + 3.17); if (r.y > amount) return 0.0;
  float fx = fract(gx) - 0.5, fy = fract(gy);
  float x = (r.x - 0.5) * 0.46 + 0.07 * sin(gy * 5.0 + r.z * 6.2831);
  float dx = fx - x, dy = (fy - 0.16) * 5.0;
  float head = smoothstep(0.30, 0.04, length(vec2(dx, dy * (dy < 0.0 ? 1.0 : 0.7))));
  float tail = smoothstep(0.085, 0.01, abs(dx)) * smoothstep(0.16, 0.24, fy) * (1.0 - smoothstep(0.3, 0.95, fy)) * (0.3 + 0.25 * sin(fy * 44.0 + r.z * 9.0));
  return max(head, max(tail, 0.0));
}
float lensWater(vec2 p, float t, float amount, float seed, float flow) {
  float a = clamp(amount, 0.0, 1.0);
  // (at speed the beads are blown off sooner: fewer of them, more of the water running)
  float beads = max(rBeads(p, 9.0, t, a * 0.55 / (1.0 + flow), seed), rBeads(p + 3.7, 21.0, t * 1.6, a * 0.7 / (1.0 + 0.5 * flow), seed + 11.0));
  float run = max(rRunners(p, 11.0, t * (0.35 + flow), a * 0.5, seed + 23.0), rRunners(p * 1.7 + 1.3, 11.0, t * (0.5 + 1.3 * flow), a * 0.4, seed + 41.0));
  return max(beads, run);
}
/** the picture seen through the water at p (screen uv suv): rgb, and how much of it is water */
vec4 lensDrops(sampler2D scene, vec2 suv, vec2 p, float t, float amount, float seed, float flow) {
  float h = lensWater(p, t, amount, seed, flow); if (h <= 0.001) return vec4(0.0);
  const float E = 0.004;
  vec2 g = (vec2(lensWater(p + vec2(E, 0.0), t, amount, seed, flow), lensWater(p + vec2(0.0, E), t, amount, seed, flow)) - h) / E;
  vec2 off = -g * 0.0006; float ol = length(off); if (ol > 0.035) off *= 0.035 / ol;
  // (a drop is a short lens: what is behind it, bent toward its middle and a little out of focus)
  vec3 c = texture2D(scene, clamp(suv + off, 0.001, 0.999)).rgb * 0.4 + 0.15 * (texture2D(scene, clamp(suv + off + vec2(0.004, 0.0), 0.001, 0.999)).rgb + texture2D(scene, clamp(suv + off - vec2(0.004, 0.0), 0.001, 0.999)).rgb
    + texture2D(scene, clamp(suv + off + vec2(0.0, 0.005), 0.001, 0.999)).rgb + texture2D(scene, clamp(suv + off - vec2(0.0, 0.005), 0.001, 0.999)).rgb);
  vec3 n = normalize(vec3(-g * 0.02, 1.0));
  float glint = pow(max(dot(n, normalize(vec3(-0.45, 0.6, 0.66))), 0.0), 26.0), foot = smoothstep(0.0, 0.35, h) * (1.0 - smoothstep(0.35, 0.9, h)) * max(0.0, -n.y);
  // (water is clear: what is behind it a little brighter, the unbent picture still in it, a faint dark foot, a glint)
  c = mix(c, texture2D(scene, suv).rgb, 0.3) * (1.14 - 0.14 * foot) + vec3(0.03) + vec3(0.5) * glint * smoothstep(0.2, 0.6, h);
  return vec4(c, smoothstep(0.03, 0.2, h) * 0.9);
}`;

const VERT = /* glsl */`varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const FRAG = /* glsl */`
uniform sampler2D tScene; uniform float uTime; uniform float uAmount; uniform float uSeed; uniform float uFlow; uniform float uAspect; uniform vec2 uDir;
varying vec2 vUv;
${RAIN_GLSL}
void main() {
  // (the water goes along uDir on the screen: the drops' own frame has that as its -y)
  vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0), p = vec2(q.x * -uDir.y + q.y * uDir.x, -(q.x * uDir.x + q.y * uDir.y));
  vec4 d = lensDrops(tScene, vUv, p, uTime, uAmount, uSeed, uFlow); if (d.a <= 0.002) discard;
  gl_FragColor = d;
}`;

export class LensRain {
  constructor() {
    this.tex = null; this.size = new THREE.Vector2(); this._s = new THREE.Vector2(); this.time = 0; this.amount = 0; this.seed = -1; this.grabbed = false;
    this.U = { tScene: { value: null }, uTime: { value: 0 }, uAmount: { value: 0 }, uSeed: { value: 0 }, uFlow: { value: 0 }, uAspect: { value: 16 / 9 }, uDir: { value: new THREE.Vector2(0, -1) } };
    this.scene = new THREE.Scene(); this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: this.U, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
    quad.frustumCulled = false; this.scene.add(quad);
  }
  /**
   * A frame's water: how hard it rains on this glass now (0..1), which glass (seed: a new one has the water of a glass
   * that has stood in that rain - at once), dt of the race. -> the amount on the glass
   */
  step(dt, rain, seed) {
    if (seed !== this.seed) { this.seed = seed; this.amount = rain; }
    else this.amount += (rain - this.amount) * Math.min(1, dt * (rain > this.amount ? 0.9 : 0.22));   // (wet in a moment, dry in a while)
    this.time += dt; return this.amount;
  }
  /** the picture as drawn so far, kept for the drops to look through (call when there is water, after the world is drawn) */
  grab(renderer) {
    renderer.getDrawingBufferSize(this._s); const w = Math.max(2, Math.floor(this._s.x)), h = Math.max(2, Math.floor(this._s.y));
    if (!this.tex || this.size.x !== w || this.size.y !== h) { this.tex?.dispose(); this.tex = new THREE.FramebufferTexture(w, h); this.tex.minFilter = THREE.LinearFilter; this.tex.magFilter = THREE.LinearFilter; this.size.set(w, h); }
    renderer.copyFramebufferToTexture(this.tex); this.U.tScene.value = this.tex; this.grabbed = true;
  }
  /** the drops on a camera's lens, over the whole picture. dir: where the water goes on the screen ([0, -1]: down); flow: how hard it is pushed (0 a camera standing, 1+ an onboard at speed) */
  draw(renderer, dir, flow) {
    if (!this.grabbed || this.amount < 0.02) return;
    const U = this.U; U.uTime.value = this.time; U.uAmount.value = this.amount; U.uSeed.value = this.seed % 977; U.uFlow.value = flow; U.uAspect.value = this.size.x / this.size.y; U.uDir.value.set(dir[0], dir[1]);
    const ac = renderer.autoClear, su = renderer.shadowMap.autoUpdate; renderer.autoClear = false; renderer.shadowMap.autoUpdate = false;
    try { renderer.render(this.scene, this.cam); } finally { renderer.autoClear = ac; renderer.shadowMap.autoUpdate = su; }
  }
}
