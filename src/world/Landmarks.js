// Landmark Intercept Engine: matches feature.properties.name against 25 mandatory
// overrides and replaces the generic extrusion with bespoke procedural geometry/shaders.
// Landmarks absent from the OSM export are placed from the track definition's geo anchors.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { footprintInfo, ringCentroid } from '../core/GeoLoader.js';
import { makeWindowMaterial, extrudeFootprint } from './Buildings.js';
import { corridorSigned } from '../track/TrackBuilder.js';

/**
 * Returns a copy of the ring that lies entirely outside the racing corridor: first slides it away from the
 * nearest track point (up to 40 m), then shrinks it toward its centroid until every edge point clears the
 * corridor by `margin` metres.
 */
export function fitRingOutsideCorridor(ring, track, pit, margin = 3) {
  const worst = (r) => { let w = Infinity; for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4)); for (let k = 0; k <= n; k++) { const t = k / n; w = Math.min(w, corridorSigned(track, pit, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, margin)); } } return w; };
  const c = ringCentroid(ring);
  const q = track.nearest(c[0], c[1]); const f = track.sample(q.s);
  let ax = c[0] - f.x, az = c[1] - f.z; const al = Math.hypot(ax, az) || 1; ax /= al; az /= al;   // away from the track
  let best = ring, bestW = worst(ring);
  for (let shift = 0; shift <= 40 && bestW < 0; shift += 5) {
    const r = ring.map((p) => [p[0] + ax * shift, p[1] + az * shift]); const w = worst(r);
    if (w > bestW) { bestW = w; best = r; }
  }
  const cc = ringCentroid(best);
  for (let s = 0.97; s >= 0.45 && bestW < 0; s -= 0.03) {
    const r = best.map((p) => [cc[0] + (p[0] - cc[0]) * s, cc[1] + (p[1] - cc[1]) * s]); const w = worst(r);
    if (w >= 0) { best = r; bestW = w; }
  }
  return best;
}

// ---------------------------------------------------------------------------
// material + geometry helpers
// ---------------------------------------------------------------------------
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, ...o });
const glass = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.12, metalness: 0.9, envMapIntensity: 1.3, ...o });
const glow = (color, i = 1.8) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: new THREE.Color(color), emissiveIntensity: i, roughness: 0.5 });
const win = (base, lit, extra = {}) => makeWindowMaterial({ base, lit, ...extra });

function box(w, h, d, mat, x = 0, y = 0, z = 0, ry = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.rotation.y = ry; return m; }
function cyl(rt, rb, h, mat, x = 0, y = 0, z = 0, seg = 24) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y + h / 2, z); return m; }
function strut(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a); const l = d.length();
  const g = new THREE.CylinderGeometry(r, r, l, 6); g.translate(0, l / 2, 0);
  const m = new THREE.Mesh(g, mat); m.position.copy(a); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return m;
}
/** Annular sector slab centred on +x (concave side faces -x), base at y. */
function arcSlab(rIn, rOut, theta, h, mat, y = 0) {
  const s = new THREE.Shape();
  s.absarc(0, 0, rOut, -theta / 2, theta / 2, false);
  s.absarc(0, 0, rIn, theta / 2, -theta / 2, true);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 24 });
  g.rotateX(-Math.PI / 2); g.translate(-(rIn + rOut) / 2, y, 0);
  const m = new THREE.Mesh(g, mat); return m;
}
function stepped(tiers, mat, x = 0, z = 0) { const grp = new THREE.Group(); let y = 0; for (const t of tiers) { grp.add(box(t.w, t.h, t.d, mat, x, y, z)); y += t.h; } return grp; }
function yTower(len, wid, h, mat) { const g = new THREE.Group(); for (let k = 0; k < 3; k++) { const a = k * 2 * Math.PI / 3; g.add(box(len, h, wid, mat, Math.cos(a) * len / 2, 0, -Math.sin(a) * len / 2, a)); } g.add(cyl(wid * 0.8, wid * 0.8, h + 2, mat, 0, 0, 0, 12)); return g; }
function frustum(wBottom, wTop, h, mat, y = 0) { const m = new THREE.Mesh(new THREE.CylinderGeometry(wTop / Math.SQRT2, wBottom / Math.SQRT2, h, 4), mat); m.rotation.y = Math.PI / 4; m.position.y = y + h / 2; return m; }
function podium(fp, h, mat) { const g = extrudeFootprint(fp.b.rings, h); if (!g) return null; g.computeVertexNormals(); return new THREE.Mesh(g, mat); }
function place(obj, c, angle) { obj.position.set(c[0], 0, c[1]); obj.rotation.y = -angle; return obj; }
const rotYForLocalX = (dx, dz) => Math.atan2(-dz, dx);

function archTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = '#d9c6a0'; ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#5a4a30';
  for (let i = 0; i < 4; i++) { const x = 32 + i * 64; ctx.beginPath(); ctx.moveTo(x - 16, 118); ctx.lineTo(x - 16, 60); ctx.arc(x, 60, 16, Math.PI, 0); ctx.lineTo(x + 16, 118); ctx.fill(); }
  ctx.fillStyle = '#bfae88'; ctx.fillRect(0, 0, 256, 10); ctx.fillRect(0, 118, 256, 10);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------------------
// animated shaders
// ---------------------------------------------------------------------------
/**
 * Sphere exosphere shader. Cycles through show content every 24 s with a 3 s crossfade:
 * 0 giant eyeball, 1 rotating Earth-like planet, 2 glowing basketball, 3 swirling lava, 4 "off" (dark matte geodesic mesh).
 * uDay dims the show in daylight (it still runs, just less luminous).
 */
function sphereShader() {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uDay: { value: 0 }, uFeed: { value: null }, uHasFeed: { value: 0 }, uShow: { value: null }, uShowBg: { value: new THREE.Color(0xf7b21c) }, uGrid: { value: 3 }, uTwoSided: { value: 1 }, uFace: { value: new THREE.Vector3(1, 0, 0) }, uRight: { value: new THREE.Vector3(0, 0, -1) }, uGround: { value: -0.43 }, uForce: { value: -1 } }]), fog: true,
    vertexShader: `#include <common>
      #include <fog_pars_vertex>
      varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      void main(){
        vUv = uv; vN = normalize(normalMatrix * normal); vP = position;
        vec4 mvPosition = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `#include <common>
      #include <fog_pars_fragment>
      uniform float uTime, uDay, uHasFeed, uGrid, uTwoSided, uGround, uForce; uniform sampler2D uFeed, uShow; uniform vec3 uShowBg, uFace, uRight; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
      float hash(vec2 p); float noise(vec2 p); float fbm(vec2 p);   // defined further down
      // uFace points from the Sphere's centre to the nearest point of the circuit; uRight is screen-right for a
      // viewer standing there. Content is drawn so it reads correctly (not mirrored) from the track.
      float faceDot(){ return dot(normalize(vP), uFace); }
      // The Sphere is not a full ball: it sits in the ground, so only the shell above uGround (normal.y at ground
      // level) is visible. Every show's vertical axis is stretched over that visible part (0 = ground, 1 = top),
      // so nothing is drawn below the plaza.
      float vis(float ny){ return clamp((ny - uGround) / (1.0 - uGround), 0.0, 1.0); }
      // canvas-drawn shows (emoji, helmet emoji, neon sign). Two-sided shows repeat the artwork on the far side;
      // one-sided shows (the emoji) keep a flat background there. Edge pixels of the canvas extend over the poles.
      vec3 canvasShow(){
        vec3 n = normalize(vP); float d = dot(n, uFace); float r = dot(n, uRight);
        float vy = mix(0.02, 0.98, vis(n.y));
        if (uTwoSided > 3.5) {
          // four-sided: the artwork repeats in each 90-degree quadrant around the Sphere (cylindrical wrap)
          float az = atan(r, d);
          float u = fract(az / 1.5707963 + 0.5);
          return texture2D(uShow, vec2(u, vy)).rgb * 0.62;
        }
        vec3 front = texture2D(uShow, vec2(clamp(r * 0.62 + 0.5, 0.0, 1.0), vy)).rgb;
        vec3 back = uTwoSided > 0.5 ? texture2D(uShow, vec2(clamp(-r * 0.62 + 0.5, 0.0, 1.0), vy)).rgb : uShowBg;
        return mix(back, front, smoothstep(-0.1, 0.1, d)) * 0.62;   // canvas art is pre-lit: tame the night boost
      }
      // daytime-sky show: deep blue with drifting cumulus and a sprinkle of stars (like the Sphere's cloud loop)
      vec3 clouds(vec2 uv, float t){
        vec2 p = vec2(uv.x + t * 0.008, uv.y);
        float base = fbm(p * vec2(7.0, 3.5));
        float detail = fbm(p * vec2(18.0, 9.0) + 3.0);
        float cl = smoothstep(0.46, 0.6, base * 0.7 + detail * 0.45);
        vec3 sky = mix(vec3(0.01, 0.12, 0.55), vec3(0.1, 0.42, 0.95), uv.y);          // deeper blue for contrast
        vec3 cloud = mix(vec3(0.35, 0.42, 0.62), vec3(1.05), smoothstep(0.45, 0.85, detail));   // shadowed undersides, bright tops
        vec3 c = mix(sky, cloud, cl);
        float st = step(0.996, hash(floor(uv * 260.0))) * (1.0 - cl);
        return c + st * 0.9;
      }
      // F1 stream: the camera wall wraps all the way around the Sphere (the 3x3 atlas repeats twice around the
      // circumference, tile rows follow latitude) with a red broadcast bar over the top cap
      // F1 stream: a band of 2 x 2 camera tiles wraps the Sphere (the 2 x 2 atlas repeats twice around, so every
      // side sees two feeds side by side) with dark blank space above and below and wide black gutters between the
      // tiles, like the real broadcast wrap; a red glow caps the top
      vec3 broadcast(vec2 uv, float t){
        vec3 n = normalize(vP);
        float az = atan(dot(n, uRight), dot(n, uFace));        // 0 = facing the track
        float u = fract(az / 6.2831853 + 0.5 + 1.0 / 8.0);      // 4 tile columns around, centred on the track-facing side
        float vy = vis(n.y);
        float v = (vy - 0.14) / 0.56;                            // the band: 14 % .. 70 % of the visible height
        vec3 blank = vec3(0.02, 0.005, 0.01) + vec3(0.6, 0.03, 0.05) * smoothstep(0.72, 1.0, vy) * (0.5 + 0.5 * sin(uv.x * 40.0 + t * 0.4));
        if (v < 0.0 || v > 1.0) return blank * 0.75;
        vec2 g = vec2(fract(u * 2.0), v);
        vec2 lc = fract(g * uGrid);
        float gutter = 0.06;
        if (lc.x < gutter || lc.x > 1.0 - gutter || lc.y < gutter || lc.y > 1.0 - gutter) return vec3(0.02) * 0.75;   // black gutters
        vec2 inner = (lc - gutter) / (1.0 - 2.0 * gutter);                    // the tile's picture fills the cell inside the gutter
        vec2 tex = (floor(g * uGrid) + inner) / uGrid;
        vec3 col = uHasFeed > 0.5 ? texture2D(uFeed, tex).rgb : vec3(0.05);
        float tag = step(0.92, inner.y) * step(inner.x, 0.2);                  // red channel tag per tile
        col = mix(col, vec3(0.85, 0.02, 0.02), tag);
        return col * 0.75;
      }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }
      // equal-area-ish coordinates on the sphere so patterns don't pinch at the poles
      vec2 sph(){ vec3 n = normalize(vP); return vec2(atan(n.z, n.x) / 6.2831853 + 0.5, n.y * 0.5 + 0.5); }
      vec3 eyeball(vec2 uv, float t){
        // the eye is drawn around the direction facing the Strip (-x); it darts around every few seconds
        vec3 n = normalize(vP);
        vec3 look = normalize(uFace + vec3(0.0, 0.15 * sin(t * 0.7), 0.0) + uRight * 0.35 * sin(t * 0.43));   // the eye watches the track
        float a = acos(clamp(dot(n, look), -1.0, 1.0));
        float veins = fbm(uv * 30.0 + t * 0.05);
        vec3 sclera = mix(vec3(0.72, 0.7, 0.66), vec3(0.8, 0.22, 0.22), smoothstep(0.5, 0.9, veins) * 0.7);
        float irisR = 0.62, pupilR = 0.22 + 0.06 * sin(t * 0.9);
        float ang = atan(n.z - look.z, n.y - look.y);
        float streaks = 0.5 + 0.5 * sin(ang * 40.0 + fbm(vec2(ang * 3.0, a * 8.0)) * 6.0);
        vec3 iris = mix(vec3(0.05, 0.35, 0.65), vec3(0.2, 0.75, 0.55), streaks) * (0.7 + 0.6 * smoothstep(irisR, pupilR, a));
        vec3 c = sclera;
        c = mix(c, iris, smoothstep(irisR + 0.03, irisR - 0.03, a));
        c = mix(c, vec3(0.01), smoothstep(pupilR + 0.02, pupilR - 0.02, a));
        c += vec3(1.0) * smoothstep(0.1, 0.0, length(vec2(a - 0.32, ang - 2.2)) ) * 0.8;   // specular glint
        return c;
      }
      vec3 planet(vec2 uv, float t){
        vec2 p = vec2(uv.x + t * 0.012, uv.y);
        float h = fbm(p * vec2(6.0, 3.0));
        float land = smoothstep(0.5, 0.56, h);
        vec3 ocean = mix(vec3(0.02, 0.12, 0.4), vec3(0.05, 0.3, 0.7), smoothstep(0.3, 0.5, h));
        vec3 ground = mix(vec3(0.15, 0.45, 0.12), vec3(0.55, 0.45, 0.25), smoothstep(0.56, 0.75, h));
        ground = mix(ground, vec3(0.9), smoothstep(0.86, 0.95, abs(uv.y - 0.5) * 2.0));       // polar ice
        vec3 c = mix(ocean, ground, land);
        float cl = fbm(vec2(uv.x + t * 0.03, uv.y) * vec2(9.0, 5.0) + 40.0);
        c = mix(c, vec3(1.0), smoothstep(0.55, 0.75, cl) * 0.85);
        return c;
      }
      vec3 basketball(vec2 uv, float t){
        vec3 n = normalize(vP);
        float pebble = noise(uv * 260.0) * 0.5 + noise(uv * 90.0) * 0.25;
        vec3 c = vec3(1.0, 0.42, 0.04) * (0.75 + pebble);                 // vivid Spalding orange with deep pebbling
        float seam = min(min(abs(n.y), abs(n.x)), min(abs(n.z), min(abs(n.x*0.7071 - n.z*0.7071), abs(n.x*0.7071 + n.z*0.7071))));
        c = mix(vec3(0.02), c, smoothstep(0.02, 0.045, seam));
        return c;
      }
      vec3 lava(vec2 uv, float t){
        vec2 p = uv * vec2(8.0, 4.0);
        vec2 q = vec2(fbm(p + t * 0.08), fbm(p + vec2(5.2, 1.3) - t * 0.06));
        float v = fbm(p + 3.0 * q + t * 0.05);
        vec3 c = mix(vec3(0.02, 0.0, 0.0), vec3(0.75, 0.08, 0.0), smoothstep(0.25, 0.55, v));
        c = mix(c, vec3(1.0, 0.55, 0.05), smoothstep(0.55, 0.72, v));
        c = mix(c, vec3(1.0, 0.95, 0.6), smoothstep(0.75, 0.9, v));
        return c;
      }
      vec3 geodesic(vec2 uv){
        // dark matte metallic mesh: triangular lattice lines
        vec2 p = uv * vec2(90.0, 45.0);
        vec2 f1 = abs(fract(p) - 0.5), f2 = abs(fract(p + vec2(0.5, 0.0)) - 0.5);
        float l = min(min(f1.x, f1.y), min(abs(fract(p.x + p.y) - 0.5), abs(fract(p.x - p.y) - 0.5)));
        float line = smoothstep(0.06, 0.02, l);
        return mix(vec3(0.07, 0.075, 0.085), vec3(0.22, 0.23, 0.26), line) * (0.6 + 0.4 * noise(uv * 400.0));
      }
      vec3 show(int m, vec2 uv, float t){
        vec3 c = geodesic(uv);
        if (m == 0) c = eyeball(uv, t);
        else if (m == 1) c = planet(uv, t);
        else if (m == 2) c = basketball(uv, t);
        else if (m == 3) c = lava(uv, t);
        else if (m == 5 || m == 8 || m == 9 || m == 10 || m == 11) c = canvasShow();
        else if (m == 6) c = broadcast(uv, t);
        else if (m == 7) c = clouds(uv, t);
        return c;
      }
      // show order (must match SPHERE_SEQUENCE in SphereShow.js): eyeball, planet, smiley, basketball, sign, lava, helmet, broadcast, marquee, clouds, off
      int modeAt(int k){
        if (k == 0) return 0; if (k == 1) return 1; if (k == 2) return 5; if (k == 3) return 2; if (k == 4) return 8;
        if (k == 5) return 3; if (k == 6) return 9; if (k == 7) return 6; if (k == 8) return 10; if (k == 9) return 7; return 4;
      }
      void main(){
        vec2 uv = sph();
        float cyc = mod(uTime, 264.0);
        int k = int(floor(cyc / 24.0));
        float tin = cyc - float(k) * 24.0;
        float blend = smoothstep(21.0, 24.0, tin);
        int m = modeAt(k), mn = modeAt((k >= 10) ? 0 : k + 1);
        if (uForce >= 0.0) { m = int(uForce + 0.5); mn = m; blend = 0.0; }   // a forced show (the race-end winner tribute)
        vec3 a = show(m, uv, uTime); vec3 b = a;
        if (blend > 0.001) b = show(mn, uv, uTime);   // the second show is only evaluated during the 3 s crossfade
        vec3 col = mix(a, b, blend);
        bool offA = (m == 4), offB = (mn == 4);
        float lit = mix(offA ? 0.0 : 1.0, offB ? 0.0 : 1.0, blend);   // no glow while the mesh is showing
        float rim = pow(1.0 - abs(dot(vN, vec3(0.0, 0.0, 1.0))), 2.5);
        float lum = mix(1.9 + rim * 0.9, 0.95 + rim * 0.2, uDay);
        col = col * mix(0.35 + 0.65 * uDay, lum, lit);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  });
}
function rgbRimShader() {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; varying vec2 vUv;
      vec3 hsv(float h){ vec3 k = vec3(1.0, 2.0/3.0, 1.0/3.0); vec3 p = abs(fract(vec3(h) + k) * 6.0 - 3.0); return clamp(p - 1.0, 0.0, 1.0); }
      void main(){ float pulse = 0.7 + 0.3 * sin(uTime * 3.0 + vUv.x * 40.0); vec3 c = hsv(fract(vUv.x * 3.0 + uTime * 0.15)) * pulse * 2.2; gl_FragColor = vec4(c, 1.0); }`,
  });
}
function videoWallShader(seed) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uSeed: { value: seed } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime, uSeed; varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
      void main(){
        float t = floor(uTime * 0.8);
        vec2 g = floor(vUv * vec2(6.0, 3.0));
        vec3 a = vec3(hash(g + t), hash(g + t + 1.7), hash(g + t + 3.1));
        float scan = 0.85 + 0.15 * sin(vUv.y * 300.0 + uTime * 10.0);
        float band = smoothstep(0.0, 0.05, abs(fract(vUv.x * 2.0 - uTime * 0.3) - 0.5));
        vec3 c = mix(a, vec3(1.0, 0.2, 0.6), 0.25 * (1.0 - band)) * scan * 1.8;
        gl_FragColor = vec4(c, 1.0); }`,
  });
}

// ---------------------------------------------------------------------------
// the 25 overrides
// ---------------------------------------------------------------------------
const L = [];
const def = (key, re, build) => L.push({ key, re, build });

// 1 Grand Prix Plaza / Paddock
def('grandprix', /grand prix plaza|paddock/i, (fps, ctx) => {
  // Built from the real parcel outline (the F1 HQ wraps around T1-T2), then shifted away from the circuit and
  // shrunk toward its centroid until no part of the outline is inside the racing corridor. It can never cross the track.
  const fp = fps[0]; const H = 24;
  const ring = fitRingOutsideCorridor(fp.b.rings[0], ctx.track, ctx.pit, 4);
  const g = new THREE.Group(); g.userData.keep = true; g.userData.ring = ring;   // already fitted: the generic clearance pass must not tear it apart
  const body = new THREE.Mesh(extrudeFootprint([ring], H), std(0xf2f2f4, { roughness: 0.35, metalness: 0.1 })); body.geometry.computeVertexNormals(); g.add(body);
  const c = ringCentroid(ring);
  const grown = ring.map((p) => [c[0] + (p[0] - c[0]) * 1.006, c[1] + (p[1] - c[1]) * 1.006]);
  for (const y of [5, 11, 17]) { const band = new THREE.Mesh(extrudeFootprint([grown], 2.6, y), glass(0x06080c, { roughness: 0.08 })); band.geometry.computeVertexNormals(); g.add(band); }
  // high-intensity red LED outline along the roofline + a lower accent line, following the parcel edges
  const led = glow(0xff1e1e, 3.2);
  const outline = (y, size) => { for (let i = 0; i < grown.length; i++) { const a = grown[i], b = grown[(i + 1) % grown.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l < 0.5) continue; g.add(box(l + size, size, size, led, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, -Math.atan2(b[1] - a[1], b[0] - a[0]))); } };
  outline(H - 0.2, 0.35); outline(3.6, 0.25);
  // garage doors along the edge that faces the pit lane
  const near = ctx.nearestTrackPoint(c); let best = null, bd = Infinity;
  for (let i = 0; i < ring.length; i++) { const a = ring[i], b = ring[(i + 1) % ring.length]; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; const d = (m[0] - near.x) ** 2 + (m[1] - near.z) ** 2; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > 40 && d < bd) { bd = d; best = [a, b]; } }
  if (best) { const [a, b] = best; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = Math.floor(l / 13.5); const ux = (b[0] - a[0]) / l, uz = (b[1] - a[1]) / l; const ang = -Math.atan2(uz, ux);
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; g.add(box(9, 4.2, 0.3, glow(0x9fb8ff, 0.5), a[0] + ux * l * t, 0, a[1] + uz * l * t, ang)); } }
  return g;
});

// 2 Topgolf
def('topgolf', /topgolf/i, (fps, ctx) => {
  const a = ctx.anchor('topgolf', fps); const g = new THREE.Group();
  g.add(box(70, 22, 60, win(0x23262e, 0xbfe3ff, { litProb: 0.6, cellW: 6, cellH: 4 })));
  g.add(box(70.4, 1.2, 60.4, glow(0x22c3ff, 2.2), 0, 21.5));
  const pyl = std(0x666c78, { roughness: 0.5, metalness: 0.6 }); const netMat = new THREE.MeshBasicMaterial({ color: 0x9aa7bb, wireframe: true, transparent: true, opacity: 0.35 });
  const pts = [[45, -70], [95, -95], [150, -60], [150, 60], [95, 95], [45, 70]];
  for (let i = 0; i < pts.length; i++) {
    const [x, z] = pts[i]; g.add(cyl(0.6, 0.9, 50, pyl, x, 0, z, 8));
    const [x2, z2] = pts[(i + 1) % pts.length]; if (i === pts.length - 1) continue;
    const len = Math.hypot(x2 - x, z2 - z); const net = new THREE.Mesh(new THREE.PlaneGeometry(len, 50, Math.round(len / 6), 8), netMat);
    net.position.set((x + x2) / 2, 25, (z + z2) / 2); net.rotation.y = -Math.atan2(z2 - z, x2 - x); g.add(net);
    const head = box(3, 0.8, 1, glow(0xfff2d0, 3), x, 49, z, -Math.atan2(-z, 45 - x)); g.add(head);
  }
  return place(g, [a.x, a.z], a.rot);
});

// 3 Sphere
def('sphere', /^sphere$/i, (fps, ctx) => {
  // 157 m wide / 112 m tall: a sphere of r = 78.5 with its centre 33.5 m above the plaza (the OSM footprint centroid)
  const fp = fps[0]; const g = new THREE.Group(); g.userData.keep = true;   // geo-exact: never displaced by the clearance pass
  const m = new THREE.Mesh(new THREE.SphereGeometry(78.5, 128, 80), sphereShader()); m.position.y = 112 - 78.5; g.add(m);
  m.material.uniforms.uGround.value = -(112 - 78.5) / 78.5;   // the shell is buried below this normal.y: shows are laid out on the visible part only
  m.material.userData.timeSkip = true; ctx.timeUniforms.push(m.material.uniforms.uDay); ctx.sphere = m;
  ctx.anims.push((t) => { m.material.uniforms.uTime.value = t; });
  // flat urban plaza with a ring of walkways + the support plinth
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(150, 64), std(0x3a3c42, { roughness: 0.95 })); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.02; g.add(plaza);
  const walk = new THREE.Mesh(new THREE.RingGeometry(84, 92, 64), std(0x8a8c90, { roughness: 0.9 })); walk.rotation.x = -Math.PI / 2; walk.position.y = 0.04; g.add(walk);
  g.add(cyl(34, 38, 10, std(0x1b1d22, { roughness: 0.6, metalness: 0.3 }), 0, 0, 0, 32));
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.add(cyl(0.3, 0.3, 9, glow(0xfff2d0, 1.2), Math.cos(a) * 100, 0, Math.sin(a) * 100, 6)); }
  return place(g, fp.info.c, 0);
});

// 4 The Venetian
def('venetian', /^the venetian las vegas$|^venetian tower$|^venezia tower$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0xd9c39a, 0xffd2a0, { cool: 0xffe2b8, litProb: 0.5, cellW: 3.6, cellH: 3.4 });
  for (const fp of fps) {
    if (/tower/i.test(fp.b.name)) {
      const H = /venezia/i.test(fp.b.name) ? 99 : 145; const l = Math.min(fp.info.length, 120), w = Math.min(fp.info.width, 45);
      const g = stepped([{ w: l, d: w, h: H * 0.6 }, { w: l * 0.86, d: w * 0.86, h: H * 0.26 }, { w: l * 0.7, d: w * 0.7, h: H * 0.14 }], mat);
      g.add(box(l + 3, 2.5, w + 3, glow(0xffc27a, 1.1)));                // 3000K flood wash at the base
      g.add(box(l * 0.7 + 1, 1.2, w * 0.7 + 1, glow(0xffd8a8, 1.4), 0, H));
      out.add(place(g, fp.info.c, fp.info.angle));
    } else { const p = podium(fp, 22, mat); if (p) out.add(p); }
  }
  return out;
});

// 5 Campanile
def('campanile', /campanile/i, (fps, ctx) => {
  const fp = fps[0]; const g = new THREE.Group(); const brick = std(0x8b4a3a, { roughness: 0.85 });
  g.add(box(12, 98, 12, win(0x8b4a3a, 0xffd9a0, { litProb: 0.25, cellW: 3, cellH: 6 })));
  for (const [x, z] of [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]]) g.add(box(1.6, 10, 1.6, brick, x, 98, z));
  g.add(box(13, 1.2, 13, brick, 0, 108));
  g.add(box(9, 8, 9, glow(0xffe0a0, 1.2), 0, 99.5));  // lit belfry interior
  const roof = new THREE.Mesh(new THREE.ConeGeometry(9.5, 12, 4), std(0x4f9a7a, { roughness: 0.5, metalness: 0.3 })); roof.position.y = 109.2 + 6; roof.rotation.y = Math.PI / 4; g.add(roof);
  g.add(cyl(0.15, 0.6, 9, glow(0xffd700, 2.5), 0, 121));
  return place(g, fp.info.c, fp.info.angle);
});

// 6 The Palazzo
def('palazzo', /^palazzo tower$|^the palazzo$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0xe6d6b8, 0xffe6c0, { litProb: 0.45, cellW: 3.5, cellH: 3.5, mullion: 0xc9a227 });
  for (const fp of fps) {
    if (/tower/i.test(fp.b.name)) {
      const H = 196; const r = Math.max(22, Math.min(fp.info.length, fp.info.width) * 0.52); const g = new THREE.Group();
      let y = 0; for (const [k, hf] of [[1, 0.6], [0.88, 0.26], [0.76, 0.14]]) { const c = cyl(r * k, r * k, H * hf, mat, 0, y, 0, 8); c.rotation.y = Math.PI / 8; g.add(c); y += H * hf; }
      g.add(cyl(r * 0.76 + 0.5, r * 0.76 + 0.5, 1.5, glow(0xffe0b0, 1.5), 0, H, 0, 8));
      out.add(place(g, fp.info.c, fp.info.angle));
    } else { const p = podium(fp, 24, mat); if (p) out.add(p); }
  }
  return out;
});

// 7/8 Wynn + Encore (bronze crescents)
function crescent(fp, ctx, H, color) {
  const g = new THREE.Group(); const rIn = 105, rOut = 124, th = 1.25;
  g.add(arcSlab(rIn, rOut, th, H, glass(color, { roughness: 0.1, metalness: 0.95, emissive: 0x1a1008, emissiveIntensity: 0.6 })));
  g.add(arcSlab(rIn - 0.5, rOut + 0.5, th, 2.5, glow(0xffffff, 2.4), H));
  const tt = ctx.toTrack(fp.info.c); g.rotation.y = rotYForLocalX(-tt[0], -tt[1]);
  const out = new THREE.Group(); g.position.set(fp.info.c[0], 0, fp.info.c[1]); out.add(g);
  const p = podium(fp, 16, std(0x3a2f26, { roughness: 0.6 })); if (p) out.add(p);
  return out;
}
def('wynn', /^wynn las vegas$/i, (fps, ctx) => crescent(fps[0], ctx, 187, 0x7a5a30));
def('encore', /^encore$/i, (fps, ctx) => crescent(fps[0], ctx, 192, 0x7a5a30));

// 9 Treasure Island
def('treasureisland', /^treasure island hotel and casino$/i, (fps, ctx) => {
  const fp = fps[0]; const out = new THREE.Group();
  const g = yTower(52, 18, 102, win(0xb8674a, 0xffd0a0, { litProb: 0.5 })); out.add(place(g, fp.info.c, fp.info.angle));
  const p = podium(fp, 14, std(0x9a5a48)); if (p) out.add(p);
  return out;
});

// 10 The Mirage / Hard Rock
def('mirage', /^hard rock las vegas$|^the mirage$/i, (fps, ctx) => {
  const fp = fps[0]; const out = new THREE.Group();
  const tt = ctx.toTrack(fp.info.c); const back = [fp.info.c[0] - tt[0] * 70, fp.info.c[1] - tt[1] * 70];
  out.add(place(yTower(55, 20, 100, win(0xd8d0c0, 0xffd27a, { litProb: 0.45 })), back, fp.info.angle));
  out.add(place(box(Math.min(fp.info.length, 160), 6, Math.min(fp.info.width, 90), std(0x3a3a40)), fp.info.c, fp.info.angle)); // flat entrance apron
  return out;
});

// 11 Caesars Palace (tower cluster)
def('caesars', /^caesars palace$|^(augustus|octavius|palace|julius|forum) tower( extension)?$|^nobu hotel at caesars palace$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0xe9e2d2, 0xfff0d0, { litProb: 0.42, cellW: 3.2, cellH: 3.4 }); const trim = std(0xf2ece0, { roughness: 0.5 });
  const heights = { augustus: 111, octavius: 107, palace: 135, julius: 52, 'julius tower extension': 45, forum: 71, nobu: 40 };
  for (const fp of fps) {
    const nm = fp.b.name.toLowerCase();
    if (nm === 'caesars palace') { const p = podium(fp, 18, mat); if (p) out.add(p); continue; }
    const k = Object.keys(heights).find((h) => nm.startsWith(h)) || 'palace'; const H = heights[nm] || heights[k];
    const l = Math.max(25, Math.min(fp.info.length, 90)), w = Math.max(18, Math.min(fp.info.width, 40));
    const g = new THREE.Group(); g.add(box(l, H, w, mat));
    g.add(box(l + 1.5, 2.2, w + 1.5, trim, 0, H));   // cornice
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.01, w * 0.75, 6, 4), trim); ped.rotation.y = Math.PI / 4; ped.scale.x = l / w; ped.position.y = H + 2.2 + 3; g.add(ped);
    g.add(box(l + 2, 1.5, w + 2, glow(0xffe6b0, 0.9)));
    out.add(place(g, fp.info.c, fp.info.angle));
  }
  return out;
});

// 12 Colosseum
def('colosseum', /colosseum/i, (fps, ctx) => {
  const a = ctx.anchor('colosseum', fps); const g = new THREE.Group(); const tex = archTexture();
  let y = 0; for (const [r, h, rep] of [[46, 14, 24], [44, 12, 22], [42, 9, 20]]) {
    const t = tex.clone(); t.repeat.set(rep, 1); t.needsUpdate = true;
    const m = cyl(r, r, h, std(0xd9c6a0, { map: t, roughness: 0.8 }), 0, y, 0, 48); g.add(m); y += h;
  }
  g.add(cyl(41, 41, 1, glow(0xffd9a0, 1.2), 0, 35, 0, 48));
  return place(g, [a.x, a.z], a.rot);
});

// 13 Harrah's
def('harrahs', /^harrah's$|^harrah's (las vegas|hotel)/i, (fps, ctx) => {
  const a = ctx.anchor('harrahs', fps); const g = new THREE.Group(); const mat = win(0x4a4f5a, 0xffd9a0, { litProb: 0.4 });
  g.add(box(72, 105, 22, mat, 0, 0, 0), box(52, 105, 22, mat, 10, 0, 34));
  const mag = glow(0xff2fb0, 2.4), pur = glow(0x8a2be2, 2.4);
  const corners = [[-36, -11, mag], [36, -11, pur], [-36, 11, pur], [36, 11, mag], [-16, 23, mag], [36, 23, pur], [-16, 45, pur], [36, 45, mag]];
  for (const [x, z, m] of corners) g.add(box(0.7, 105, 0.7, m, x, 0, z));
  return place(g, [a.x, a.z], a.rot);
});

// 14 The LINQ
def('linq', /^the linq hotel/i, (fps, ctx) => {
  const fp = fps.reduce((a, b) => (a.info.area > b.info.area ? a : b)); const g = new THREE.Group();
  const l = Math.min(fp.info.length, 130), w = Math.min(fp.info.width, 60); const mat = win(0x3a3d46, 0xfff0d0, { litProb: 0.45 });
  g.add(stepped([{ w: l, d: w, h: 26 }, { w: l * 0.8, d: w * 0.85, h: 24 }, { w: l * 0.6, d: w * 0.7, h: 15 }], mat));
  const geos = []; const floors = 18;
  for (let i = 0; i < floors; i++) {
    const y = 4 + i * 3.4; const tier = y < 26 ? [l, w] : y < 50 ? [l * 0.8, w * 0.85] : [l * 0.6, w * 0.7];
    const b = new THREE.BoxGeometry(tier[0] + 0.6, 0.25, tier[1] + 0.6); b.translate(0, y, 0);
    const c = new THREE.Color().setHSL(i / floors, 1, 0.55); const n = b.getAttribute('position').count; const col = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) { col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b; }
    b.setAttribute('color', new THREE.BufferAttribute(col, 3)); geos.push(b);
  }
  g.add(new THREE.Mesh(mergeGeometries(geos), new THREE.MeshBasicMaterial({ vertexColors: true })));
  const out = new THREE.Group(); out.add(place(g, fp.info.c, fp.info.angle));
  for (const o of fps) if (o !== fp) { const p = podium(o, 17, mat); if (p) out.add(p); }
  return out;
});

// 15 High Roller
def('highroller', /high roller/i, (fps, ctx) => {
  const a = ctx.anchor('highroller', fps); const g = new THREE.Group(); const R = 75, hubY = 93;
  const steel = std(0xd8d8de, { roughness: 0.4, metalness: 0.7 });
  const rotor = new THREE.Group(); rotor.position.y = hubY; rotor.userData.animated = true;   // (never merged: it turns)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 1.6, 8, 128), rgbRimShader()); rotor.add(rim);
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(R - 3, 0.5, 6, 96), steel); rotor.add(rim2);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 8, 16), steel); hub.rotation.x = Math.PI / 2; rotor.add(hub);
  const spokeGeos = []; const podGeo = new THREE.SphereGeometry(3.2, 14, 10); const pods = [];
  for (let k = 0; k < 28; k++) {
    const an = k * 2 * Math.PI / 28; const x = Math.cos(an) * R, y = Math.sin(an) * R;
    const sg = new THREE.CylinderGeometry(0.22, 0.22, R - 3, 5); sg.translate(0, (R - 3) / 2, 0); sg.rotateZ(an - Math.PI / 2); spokeGeos.push(sg);
    const pg = podGeo.clone(); pg.translate(x, y, 0); pods.push(pg);
  }
  rotor.add(new THREE.Mesh(mergeGeometries(spokeGeos), steel));
  rotor.add(new THREE.Mesh(mergeGeometries(pods), std(0xf4f4ff, { emissive: 0xfff0d0, emissiveIntensity: 0.9, roughness: 0.3 })));
  const wheel = new THREE.Group(); wheel.add(rotor); wheel.rotation.y = Math.PI / 2; // plane spans north-south, faces the Strip
  g.add(wheel);
  const legMat = std(0xb8b8c0, { roughness: 0.5, metalness: 0.6 });
  for (const [x, z] of [[-9, -34], [9, -34], [-9, 34], [9, 34]]) g.add(strut(new THREE.Vector3(x * 2.4, 0, z), new THREE.Vector3(x * 0.6, hubY, 0), 1.6, legMat));
  g.add(box(30, 6, 90, std(0x2a2d35), 0, 0, 0));
  ctx.anims.push((t, dt) => { rotor.rotation.z += dt * 0.0035; rim.material.uniforms.uTime.value = t; });
  return place(g, [a.x, a.z], a.rot);
});

// 16 Flamingo
def('flamingo', /^flamingo las vegas$/i, (fps, ctx) => {
  const fp = fps[0]; const g = new THREE.Group(); const mat = win(0xe8e0d0, 0xffb0e0, { cool: 0xff7fd0, litProb: 0.45 }); const pink = glow(0xff2f8f, 2.6);
  const l = Math.min(fp.info.length, 90);
  g.add(box(l, 85, 22, mat), box(l * 0.7, 85, 22, mat, 12, 0, 20, 0.6));
  for (const [x, z] of [[-l / 2, -11], [l / 2, -11], [-l / 2, 11], [l / 2, 11]]) g.add(box(0.8, 85, 0.8, pink, x, 0, z));
  for (const y of [20, 42, 64, 84.5]) g.add(box(l + 1, 0.5, 23, pink, 0, y));
  const out = new THREE.Group(); out.add(place(g, fp.info.c, fp.info.angle)); const p = podium(fp, 14, std(0xd08aa0)); if (p) out.add(p);
  return out;
});

// 17 Lake Bellagio
def('lakebellagio', /lake bellagio|bellagio fountains/i, (fps, ctx) => {
  const a = ctx.anchor('lakebellagio', fps); const g = new THREE.Group();
  const shp = new THREE.Shape(); shp.absellipse(0, 0, 125, 62, 0, Math.PI * 2, false, 0);
  const water = new THREE.Mesh(new THREE.ShapeGeometry(shp, 48), new THREE.MeshStandardMaterial({ color: 0x14407a, roughness: 0.05, metalness: 0.6, envMapIntensity: 1.6 }));
  water.rotation.x = -Math.PI / 2; water.position.y = -0.5; g.add(water);
  const rimS = new THREE.Shape(); rimS.absellipse(0, 0, 129, 66, 0, Math.PI * 2, false, 0); rimS.holes.push(new THREE.Path().absellipse(0, 0, 125, 62, 0, Math.PI * 2, true, 0));
  const rim = new THREE.Mesh(new THREE.ShapeGeometry(rimS, 48), std(0x6a6a70)); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.0; g.add(rim);
  const jets = [];
  for (let i = 0; i < 14; i++) { const j = cyl(0.6, 1.2, 20, glow(0xdfefff, 1.6), -90 + i * 14, -0.5, Math.sin(i * 1.3) * 12, 6); j.userData.phase = i * 0.7; j.userData.animated = true; g.add(j); jets.push(j); }
  ctx.anims.push((t) => { for (const j of jets) { const s = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + j.userData.phase)); j.scale.y = s; j.position.y = -0.5 + 10 * s; } });
  return place(g, [a.x, a.z], a.rot);
});

// 18 Bellagio
def('bellagio', /^bellagio las vegas$|^bellagio$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0xd8b98a, 0xffe0b0, { litProb: 0.48, cellW: 3.4, cellH: 3.3 });
  for (const fp of fps) {
    if (/las vegas/i.test(fp.b.name)) {
      const g = new THREE.Group(); const H = 151;
      g.add(arcSlab(96, 118, 1.35, H, mat));
      g.add(arcSlab(94, 120, 1.35, 6, std(0x2f5d3a, { roughness: 0.6 }), H));
      const wingMat = mat; const rM = 107, half = 1.35 / 2;
      for (const sgn of [1, -1]) { const w = box(22, 120, 40, wingMat, Math.cos(half) * rM - rM - 12, 0, sgn * Math.sin(half) * rM, sgn * 0.5); g.add(w); g.add(box(23, 5, 41, std(0x2f5d3a), w.position.x, 120, w.position.z, sgn * 0.5)); }
      const tt = ctx.toTrack(fp.info.c); g.rotation.y = rotYForLocalX(-tt[0], -tt[1]); g.position.set(fp.info.c[0], 0, fp.info.c[1]); out.add(g);
    } else { const p = podium(fp, 20, mat); if (p) out.add(p); }
  }
  return out;
});

// 19 Horseshoe
def('horseshoe', /^horseshoe las vegas/i, (fps, ctx) => {
  const fp = fps[0]; const g = new THREE.Group(); const mat = win(0xb7b2a8, 0xffe8c0, { litProb: 0.4, cellW: 3.2, cellH: 3.3 });
  g.add(box(78, 86, 20, mat, 0, 0, -22), box(78, 86, 20, mat, 0, 0, 22));
  g.add(box(78, 1.5, 20, glow(0xffb020, 2), 0, 86, -22), box(78, 1.5, 20, glow(0xffb020, 2), 0, 86, 22));
  const tt = ctx.toTrack(fp.info.c); g.rotation.y = rotYForLocalX(tt[0], tt[1]); // long axis perpendicular to the Strip
  g.position.set(fp.info.c[0], 0, fp.info.c[1]); return g;
});

// 20 Eiffel Tower
def('eiffel', /^eiffel tower$/i, (fps, ctx) => {
  const fp = fps[0]; const g = new THREE.Group(); const H = 165; const steel = std(0x9a7b4f, { roughness: 0.55, metalness: 0.6, emissive: 0x3a2610, emissiveIntensity: 0.8 });
  const wAt = (y) => 31 * Math.pow(1 - y / H, 1.6) + 1.2;
  const levels = [0, 30, 57, 90, 120, 150]; const geos = [];
  const add = (a, b, r) => { const m = strut(a, b, r, steel); m.updateMatrix(); const gg = m.geometry.clone().applyMatrix4(m.matrix); geos.push(gg); };
  const corner = (y, sx, sz) => new THREE.Vector3(sx * wAt(y), y, sz * wAt(y));
  const S = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  for (let li = 0; li < levels.length - 1; li++) {
    const y0 = levels[li], y1 = levels[li + 1]; const r = 1.6 - li * 0.22;
    for (let k = 0; k < 4; k++) {
      const [sx, sz] = S[k], [sx2, sz2] = S[(k + 1) % 4];
      add(corner(y0, sx, sz), corner(y1, sx, sz), r);                                 // leg segment
      add(corner(y1, sx, sz), corner(y1, sx2, sz2), r * 0.5);                          // horizontal at top of segment
      add(corner(y0, sx, sz), corner(y1, sx2, sz2), r * 0.35); add(corner(y0, sx2, sz2), corner(y1, sx, sz), r * 0.35); // X bracing
      const ym = (y0 + y1) / 2; add(corner(ym, sx, sz), corner(ym, sx2, sz2), r * 0.3);
    }
  }
  g.add(new THREE.Mesh(mergeGeometries(geos), steel));
  for (const y of [57, 120]) g.add(box(wAt(y) * 2 + 6, 3, wAt(y) * 2 + 6, std(0x6a5535, { roughness: 0.6 }), 0, y - 1.5));
  g.add(box(wAt(57) * 2 + 6.2, 0.6, wAt(57) * 2 + 6.2, glow(0xffd9a0, 1.5), 0, 58.5));
  g.add(box(11, 7, 11, glow(0xfff0c0, 2.2), 0, 150));
  g.add(cyl(0.3, 1.4, 15, steel, 0, 157)); g.add(cyl(0.6, 0.6, 1.2, glow(0xff3030, 4), 0, 172));
  return place(g, fp.info.c, fp.info.angle);
});

// 21 Paris Las Vegas + Arc de Triomphe + balloon
def('paris', /^paris las vegas$|^le boulevard at paris$|^arc de triomphe$|^paris balloon$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0xe0d8c8, 0xffe4b8, { litProb: 0.45, cellW: 3.2, cellH: 3.3 });
  for (const fp of fps) {
    const nm = fp.b.name.toLowerCase();
    if (nm.startsWith('le boulevard')) {
      const g = new THREE.Group(); const l = Math.min(fp.info.length, 130), w = Math.min(fp.info.width, 45);
      g.add(box(l, 105, w, mat)); g.add(frustum(Math.max(l, w) + 2, Math.max(l, w) * 0.85, 9, std(0x3b4658, { roughness: 0.5, metalness: 0.4 }), 105));
      g.children[1].scale.set(1, 1, w / Math.max(l, w)); g.add(box(l + 1, 0.8, w + 1, glow(0xffd080, 1.6), 0, 104.6));
      out.add(place(g, fp.info.c, fp.info.angle));
    } else if (nm === 'arc de triomphe') {
      const s = new THREE.Shape(); s.moveTo(-11, 0); s.lineTo(11, 0); s.lineTo(11, 20); s.lineTo(-11, 20); s.lineTo(-11, 0);
      const hole = new THREE.Path(); hole.moveTo(-4.5, 0); hole.lineTo(4.5, 0); hole.lineTo(4.5, 9); hole.absarc(0, 9, 4.5, 0, Math.PI, false); hole.lineTo(-4.5, 0); s.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(s, { depth: 10, bevelEnabled: false, curveSegments: 12 }); geo.translate(0, 0, -5);
      const arc = new THREE.Mesh(geo, std(0xd8cdb8, { roughness: 0.8 })); const g = new THREE.Group(); g.add(arc); g.add(box(23, 0.5, 11, glow(0xffe0a0, 1.5), 0, 19.6));
      out.add(place(g, fp.info.c, fp.info.angle + Math.PI / 2));
    } else if (nm === 'paris balloon') {
      const g = new THREE.Group(); g.add(cyl(0.6, 0.9, 30, std(0x555a66), 0, 0, 0, 8));
      const bal = new THREE.Mesh(new THREE.SphereGeometry(12, 24, 16), std(0xf0f0f0, { emissive: 0x6070ff, emissiveIntensity: 0.6 })); bal.position.y = 46; g.add(bal);
      g.add(new THREE.Mesh(new THREE.TorusGeometry(12.2, 0.8, 8, 40), glow(0x3355ff, 2.5))).position.y = 46; g.children[2].rotation.x = Math.PI / 2;
      g.add(box(6, 3, 6, std(0x6a4a2a), 0, 30));
      out.add(place(g, fp.info.c, 0));
    } else { const p = podium(fp, 18, mat); if (p) out.add(p); }
  }
  return out;
});

// 22 Cosmopolitan
def('cosmopolitan', /^the cosmopolitan/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0x2a2d33, 0x9fc4ff, { cool: 0xcfe0ff, lit: 0xa8c8ff, litProb: 0.5, cellW: 3.2, cellH: 3.4 });
  for (const fp of fps) {
    if (/tower/i.test(fp.b.name)) {
      const g = new THREE.Group(); const l = Math.max(60, Math.min(fp.info.length, 110)), w = Math.min(Math.max(fp.info.width, 16), 22);
      g.add(box(l, 184, w, mat));
      g.add(box(l * 0.9, 9, 0.9, glow(0xff30c0, 2.6), 0, 184, -w / 2 + 2), box(l * 0.9, 9, 0.9, glow(0xff30c0, 2.6), 0, 184, w / 2 - 2));
      g.add(box(0.9, 184, w + 0.6, glow(0x7fb0ff, 1.2), l / 2, 0, 0));
      out.add(place(g, fp.info.c, fp.info.angle));
    } else { const p = podium(fp, 25, mat); if (p) out.add(p); }
  }
  return out;
});

// 23 Planet Hollywood + Miracle Mile screens
def('planethollywood', /^planet hollywood resort|^miracle mile shops$|^ph live$/i, (fps, ctx) => {
  const out = new THREE.Group(); const mat = win(0x3a3d45, 0xfff0d8, { litProb: 0.45 });
  for (const fp of fps) {
    const nm = fp.b.name.toLowerCase();
    if (nm.startsWith('planet hollywood')) {
      const g = new THREE.Group(); g.add(arcSlab(62, 86, 1.2, 120, mat)); g.add(arcSlab(61, 87, 1.2, 2, glow(0xff9040, 2), 120));
      const tt = ctx.toTrack(fp.info.c); g.rotation.y = rotYForLocalX(-tt[0], -tt[1]); g.position.set(fp.info.c[0], 0, fp.info.c[1]); out.add(g);
    } else if (nm === 'miracle mile shops') {
      const p = podium(fp, 20, std(0x2c2f38, { roughness: 0.6 })); if (p) out.add(p);
      // trackside video screens on the face nearest the Strip
      const near = ctx.nearestTrackPoint(fp.info.c); const dx = near.x - fp.info.c[0], dz = near.z - fp.info.c[1]; const dist = Math.hypot(dx, dz) || 1;
      const ux = dx / dist, uz = dz / dist; const faceD = Math.max(20, dist - 22);
      for (let k = -1; k <= 1; k++) {
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(34, 15), videoWallShader(k * 3.7 + 1));
        const px = -uz, pz = ux; sc.position.set(fp.info.c[0] + ux * faceD + px * k * 40, 11, fp.info.c[1] + uz * faceD + pz * k * 40);
        sc.rotation.y = Math.atan2(ux, uz); out.add(sc); ctx.anims.push((t) => { sc.material.uniforms.uTime.value = t; });
      }
    } else { const p = podium(fp, 20, std(0x24262e)); if (p) out.add(p); }
  }
  return out;
});

// 24 The Cromwell
def('cromwell', /^the cromwell$/i, (fps, ctx) => {
  const a = ctx.anchor('cromwell', fps); const g = new THREE.Group(); const mat = win(0x2a2a2e, 0xffd9a0, { litProb: 0.35, cellW: 3.2, cellH: 3.2 });
  g.add(box(62, 35, 50, mat)); const crim = glow(0xdc143c, 2.6);
  for (let i = -3; i <= 3; i++) g.add(box(0.5, 0.5, 52, crim, i * 9, 35.2, 0));
  for (let j = -2; j <= 2; j++) g.add(box(64, 0.5, 0.5, crim, 0, 35.2, j * 11));
  for (const [x, z] of [[-31, -25], [31, -25], [-31, 25], [31, 25]]) g.add(box(0.6, 35, 0.6, crim, x, 0, z));
  return place(g, [a.x, a.z], a.rot);
});

// 25 Elara
def('elara', /^elara/i, (fps, ctx) => {
  const fp = fps[0]; const g = new THREE.Group();
  g.add(arcSlab(72, 94, 1.05, 171, glass(0x8a2a2a, { roughness: 0.08, metalness: 0.95, emissive: 0x2a0608, emissiveIntensity: 0.8, envMapIntensity: 1.5 })));
  g.add(arcSlab(71, 95, 1.05, 1.5, glow(0xff9a8a, 1.6), 171));
  const tt = ctx.toTrack(fp.info.c); g.rotation.y = rotYForLocalX(-tt[0], -tt[1]); g.position.set(fp.info.c[0], 0, fp.info.c[1]);
  return g;
});

// ---------------------------------------------------------------------------
// engine
// ---------------------------------------------------------------------------
export function buildLandmarks(geo, track, trackDef, pit = null) {
  const group = new THREE.Group(); group.name = 'landmarks';
  const anims = [];
  const timeUniforms = [];
  const claimed = new Set();
  const report = [];
  const ctx = {
    anims, timeUniforms, geo, track, pit,
    toTrack(c) { const q = track.nearest(c[0], c[1]); const f = track.sample(q.s); const dx = f.x - c[0], dz = f.z - c[1]; const l = Math.hypot(dx, dz) || 1; return [dx / l, dz / l]; },
    nearestTrackPoint(c) { const q = track.nearest(c[0], c[1]); return track.sample(q.s); },
    anchor(key, fps) {
      if (fps.length) return { x: fps[0].info.c[0], z: fps[0].info.c[1], rot: fps[0].info.angle };
      const a = trackDef.landmarkAnchors[key]; const [x, z] = geo.proj.toXZ(a.ll[0], a.ll[1]); return { x, z, rot: a.rot || 0 };
    },
  };
  for (const lm of (trackDef.landmarkSet === 'lasvegas' ? L : [])) {   // the 25 overrides belong to Las Vegas only
    const fps = [];
    for (const b of geo.buildings) {
      if (!b.name || claimed.has(b.id) || !lm.re.test(b.name)) continue;
      fps.push({ b, info: footprintInfo(b.rings[0]) }); claimed.add(b.id);
    }
    const needsAnchor = fps.length === 0;
    if (needsAnchor && !trackDef.landmarkAnchors[lm.key]) { report.push({ key: lm.key, status: 'missing' }); continue; }
    try {
      const obj = lm.build(fps, ctx);
      if (obj) { obj.name = `lm:${lm.key}`; group.add(obj); }
      report.push({ key: lm.key, status: needsAnchor ? 'anchor' : 'footprint', features: fps.map((f) => f.b.name) });
    } catch (e) { console.error('landmark failed', lm.key, e); report.push({ key: lm.key, status: 'error', error: String(e) }); }
  }
  return { group, anims, timeUniforms, claimed, report, sphere: ctx.sphere || null };
}

/**
 * Draw-call pass: within each landmark, every static mesh that shares a material (and attribute layout) with
 * another is baked into one merged mesh in the landmark's local space. Animated parts (userData.animated on the
 * object or an ancestor), `keep` parts, hidden parts and multi-material meshes are left alone. Run this AFTER the
 * corridor clearance pass so the baked transforms include any shifts.
 */
export function mergeStaticParts(root) {
  let before = 0, after = 0; const inv = new THREE.Matrix4(), rel = new THREE.Matrix4();
  for (const lm of root.children) {
    lm.updateMatrixWorld(true); inv.copy(lm.matrixWorld).invert();
    const buckets = new Map();
    lm.traverse((o) => {
      if (!o.isMesh || o === lm || !o.visible || Array.isArray(o.material) || o.userData.keep) return;
      let p = o; while (p && p !== lm) { if (p.userData.animated || p.userData.keep) return; p = p.parent; }
      const g = o.geometry; if (!g.attributes.position) return;
      const sig = o.material.uuid + '|' + Object.keys(g.attributes).sort().join(',');
      if (!buckets.has(sig)) buckets.set(sig, []); buckets.get(sig).push(o);
    });
    for (const list of buckets.values()) {
      if (list.length < 2) continue;
      const geos = list.map((o) => { const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); return g.applyMatrix4(rel.multiplyMatrices(inv, o.matrixWorld)); });
      const merged = mergeGeometries(geos, false); if (!merged) continue;
      const m = new THREE.Mesh(merged, list[0].material); m.name = list[0].name; m.userData.merged = list.length; lm.add(m);
      for (const o of list) o.parent.remove(o);
      before += list.length; after++;
    }
  }
  return { before, after };
}

/**
 * Corridor clearance pass: every placed landmark part whose world bounding box intrudes into the racing
 * corridor (barriers + margin, and the pit lane) is pushed away along the local track normal until clear.
 * Objects flagged userData.keep (the geo-exact Sphere) are left in place. Returns the names that moved.
 */
export function clearLandmarksFromTrack(group, track, pit) {
  const box = new THREE.Box3(); const moved = [];
  const halfT = track.barrierOffset + 2.5, halfP = pit ? pit.halfWidth + 4 : 0;
  for (const lm of group.children) {
    if (lm.userData.keep) continue;
    for (const obj of lm.children) {
      if (obj.userData.keep) continue;
      for (let iter = 0; iter < 5; iter++) {
        obj.updateWorldMatrix(true, true); box.setFromObject(obj);
        if (box.isEmpty()) break;
        let worst = 0, wn = null, wx = 0, wz = 0;
        const test = (px, pz, nx, nz, half) => {
          if (px < box.min.x - half || px > box.max.x + half || pz < box.min.z - half || pz > box.max.z + half) return;
          const dx = Math.max(box.min.x - px, 0, px - box.max.x), dz = Math.max(box.min.z - pz, 0, pz - box.max.z);
          const pen = half - Math.hypot(dx, dz);
          if (pen > worst) { worst = pen; wn = [nx, nz]; wx = px; wz = pz; }
        };
        for (let i = 0; i < track.n; i += 2) test(track.px[i], track.pz[i], track.nx[i], track.nz[i], halfT);
        if (pit) { const ps = pit.samples; for (let i = 0; i < ps.n; i += 2) test(ps.px[i], ps.pz[i], ps.nx[i], ps.nz[i], halfP); }
        if (worst <= 0.01) break;
        const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
        const side = Math.sign((cx - wx) * wn[0] + (cz - wz) * wn[1]) || 1;
        // move in the parent's frame (landmark groups are only rotated about Y, so world XZ deltas apply directly)
        const parentRot = lm.rotation.y;
        const dxw = wn[0] * side * (worst + 0.5), dzw = wn[1] * side * (worst + 0.5);
        obj.position.x += dxw * Math.cos(parentRot) - dzw * Math.sin(parentRot);
        obj.position.z += dxw * Math.sin(parentRot) + dzw * Math.cos(parentRot);
        if (iter === 0) moved.push(lm.name);
      }
    }
  }
  return moved;
}
