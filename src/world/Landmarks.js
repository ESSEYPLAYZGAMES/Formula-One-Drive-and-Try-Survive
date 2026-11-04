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
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: { value: 0 }, uDay: { value: 0 }, uFeed: { value: null }, uHasFeed: { value: 0 }, uShow: { value: null }, uBcast: { value: null }, uHasBcast: { value: 0 }, uShowBg: { value: new THREE.Color(0xf7b21c) }, uGrid: { value: 3 }, uTwoSided: { value: 1 }, uFace: { value: new THREE.Vector3(1, 0, 0) }, uRight: { value: new THREE.Vector3(0, 0, -1) }, uGround: { value: -0.43 }, uForce: { value: -1 } }]), fog: true,
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
      uniform float uTime, uDay, uHasFeed, uHasBcast, uGrid, uTwoSided, uGround, uForce; uniform sampler2D uFeed, uShow, uBcast; uniform vec3 uShowBg, uFace, uRight; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
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
      // F1 stream, as at the 2024 race: one big screen - the world feed's onboard across the face, a timing tower down
      // each side, the caption low on the picture (the graphics: uBcast, SphereShow.js BroadcastOverlay). It is laid on
      // the shell by longitude and latitude, as the Sphere's own content is, so it bends with it: straight across the
      // middle, its top edge pulled in toward the crown, the sides wrapping round out of sight. The frame spans
      // 86 degrees either side of the face and from 10 degrees below the equator (the shell meets the plaza at 25) to
      // 65 above, a dark band under it and a red-gold ribbon over its top; the far side carries the same screen, read
      // the right way round from there.
      vec3 broadcast(vec2 uv, float t){
        vec3 n = normalize(vP);
        float az = atan(dot(n, uRight), dot(n, uFace));        // 0 = facing the track
        if (az > 1.5707963) az -= 3.1415927; else if (az < -1.5707963) az += 3.1415927;
        float el = asin(clamp(n.y, -1.0, 1.0));
        const float A = 1.50, E0 = -0.17, E1 = 1.13;
        float u = az / (2.0 * A) + 0.5, v = (el - E0) / (E1 - E0);
        vec3 dark = vec3(0.012, 0.012, 0.022);
        if (v > 1.0) {   // over the screen: the ribbon, then the dark crown
          float k = (el - E1) / 0.07;
          if (k < 1.0) return mix(vec3(1.0, 0.08, 0.04), vec3(1.0, 0.72, 0.08), k) * (0.8 + 0.2 * sin(az * 30.0 - t * 2.0));
          return dark;
        }
        if (v < 0.0 || abs(az) > A) return dark;
        vec3 col = dark;
        vec2 pic = vec2((u - 0.14) / 0.72, (v - 0.06) / 0.84);
        if (pic.x > 0.0 && pic.x < 1.0 && pic.y > 0.0 && pic.y < 1.0) col = uHasFeed > 0.5 ? texture2D(uFeed, pic).rgb * 0.72 : vec3(0.05);
        if (uHasBcast > 0.5) { vec4 o = texture2D(uBcast, vec2(u, v)); col = mix(col, o.rgb * 0.62, o.a); }
        return col;
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
        else if (m == 5 || m == 8 || m == 9 || m == 10 || m == 11 || m == 12 || m == 13) c = canvasShow();
        else if (m == 6) c = broadcast(uv, t);
        else if (m == 7) c = clouds(uv, t);
        return c;
      }
      // show order (must match SPHERE_SEQUENCE in SphereShow.js): eyeball, planet, smiley, basketball, sign, lava, helmet, sponsor, broadcast, marquee, clouds, gp, off
      int modeAt(int k){
        if (k == 0) return 0; if (k == 1) return 1; if (k == 2) return 5; if (k == 3) return 2; if (k == 4) return 8;
        if (k == 5) return 3; if (k == 6) return 9; if (k == 7) return 12; if (k == 8) return 6; if (k == 9) return 10; if (k == 10) return 7; if (k == 11) return 13; return 4;
      }
      void main(){
        vec2 uv = sph();
        float cyc = mod(uTime, 312.0);   // (13 shows x 24 s: SPHERE_SEQUENCE)
        int k = int(floor(cyc / 24.0));
        float tin = cyc - float(k) * 24.0;
        float blend = smoothstep(21.0, 24.0, tin);
        int m = modeAt(k), mn = modeAt((k >= 12) ? 0 : k + 1);
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

// 7/8 Wynn + Encore: the two bronze curved slabs (the user's photo from the circuit: bronze-gold glass, a bright line
// along every other floor, warm rooms lit at random, a dark crown band with the name in white script at one end). Each
// tower's curve is fitted to its footprint (a least-squares circle through the face's points): Wynn's footprint is the
// tower itself - a 23 m crescent, concave to the west, to the Strip; Encore's tower stands on the curved north-east edge
// of its footprint, 25 m deep, the rest of the footprint its podium.
function wynnFacade(H, seed) {
  // (one 24 m bay of the curve, the full height: the glass's colour, and what glows at night)
  const W = 512, Hp = 4096, px = Hp / H, mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = Hp; return c; };
  const cc = mk(), ce = mk(), x = cc.getContext('2d'), e = ce.getContext('2d'), Y = (m) => Hp - m * px;
  let sd = seed; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#7a4f26'); g.addColorStop(0.5, '#a8743c'); g.addColorStop(1, '#7a4f26'); x.fillStyle = g; x.fillRect(0, 0, W, Hp);
  e.fillStyle = '#2a1606'; e.fillRect(0, 0, W, Hp);   // (the bronze glass at night: a dull amber, the city's light in it)
  const FL = 3.6, CROWN = 13, cols = 16, cw = W / cols;
  for (let y = 4, fl = 0; y + FL <= H - CROWN; y += FL, fl++) {
    for (let k = 0; k < cols; k++) {   // (the rooms: lit warm, dimmer, or dark behind the bronze)
      const r = rnd(), y0 = Y(y + FL - 0.3), hh = (FL - 0.9) * px;
      x.fillStyle = `rgba(60,34,14,${0.25 + rnd() * 0.25})`; x.fillRect(k * cw + 2, y0, cw - 4, hh);
      e.fillStyle = r < 0.34 ? (rnd() < 0.7 ? '#e8913c' : '#f5c27a') : r < 0.5 ? '#4a2a10' : '#1e1004'; e.fillRect(k * cw + 2, y0, cw - 4, hh);
    }
    // (the floor's spandrel: bronze, and the white line of light along every other one)
    x.fillStyle = '#c99a5a'; x.fillRect(0, Y(y + 0.6), W, 0.6 * px);
    if (fl % 2 === 1) { e.fillStyle = '#fff6e8'; e.fillRect(0, Y(y + 0.45), W, 0.3 * px); x.fillStyle = '#f2e6d0'; x.fillRect(0, Y(y + 0.45), W, 0.3 * px); }
  }
  for (let k = 0; k <= cols; k++) { x.fillStyle = 'rgba(40,24,10,0.5)'; x.fillRect(k * cw - 1, Y(H - CROWN), 2, (H - CROWN) * px); }   // (mullions)
  // the crown: dark glass over the plant floors, a thin bronze cap
  x.fillStyle = '#1c140e'; x.fillRect(0, 0, W, CROWN * px); e.fillStyle = '#080503'; e.fillRect(0, 0, W, CROWN * px);
  x.fillStyle = '#b07c40'; x.fillRect(0, 0, W, 0.8 * px); e.fillStyle = '#6a4a20'; e.fillRect(0, 0, W, 0.8 * px);
  // the base: the porte-cochere's glow
  e.fillStyle = '#ffcf8a'; e.fillRect(0, Y(4), W, 4 * px); x.fillStyle = '#d8b07a'; x.fillRect(0, Y(4), W, 4 * px);
  const t = new THREE.CanvasTexture(cc), te = new THREE.CanvasTexture(ce);
  for (const tt of [t, te]) { tt.wrapS = THREE.RepeatWrapping; tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8; }
  return [t, te];
}
/** the name at the top: white script, lit */
function scriptSignTexture(name) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 320; const x = c.getContext('2d');
  x.clearRect(0, 0, 1024, 320); x.fillStyle = '#ffffff'; x.shadowColor = '#fff2dc'; x.shadowBlur = 16;
  x.lineWidth = 7; x.strokeStyle = '#ffffff'; x.font = 'italic 700 230px "Brush Script MT", "Segoe Script", "Lucida Handwriting", "Apple Chancery", cursive'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.strokeText(name, 512, 150); x.fillText(name, 512, 150);
  x.fillRect(560, 250, 360, 7);   // (the flourish under it)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** a least-squares circle through points [[x, z]] -> { cx, cz, r } */
function fitCircle(pts) {
  let s = [0, 0, 0, 0, 0, 0, 0, 0, 0], v = [0, 0, 0];
  for (const [x, z] of pts) { const q = [x, z, 1], w = -(x * x + z * z); for (let i = 0; i < 3; i++) { v[i] += q[i] * w; for (let j = 0; j < 3; j++) s[i * 3 + j] += q[i] * q[j]; } }
  const det = (m) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]), D = det(s);
  const sol = [0, 1, 2].map((k) => { const m = s.slice(); for (let i = 0; i < 3; i++) m[i * 3 + k] = v[i]; return det(m) / D; });
  const cx = -sol[0] / 2, cz = -sol[1] / 2; return { cx, cz, r: Math.sqrt(Math.max(1, cx * cx + cz * cz - sol[2])) };
}
/** a curved tower about centre (cx, cz): faces at rIn (concave) and rOut, angles aLo..aHi, H tall, its name on both faces */
function curvedTower(o) {
  const { cx, cz, rIn, rOut, aLo, aHi, H, name, seed } = o, g = new THREE.Group(); g.position.set(cx, 0, cz);
  const [tex, texE] = wynnFacade(H, seed), mat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: texE, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.25, metalness: 0.55 });
  g.add(new THREE.Mesh(curvedWall(rIn, aLo, aHi, 0, H, H, true), mat), new THREE.Mesh(curvedWall(rOut, aLo, aHi, 0, H, H, false), mat));
  // the ends: dark bronze fins, a little proud of the faces
  const fin = std(0x2a1c10, { roughness: 0.5, metalness: 0.6, emissive: 0x120a04 });
  for (const a of [aLo, aHi]) { const d = rOut - rIn + 2, f = new THREE.BoxGeometry(d, H + 1.5, 2.4); f.rotateY(-a); f.translate(Math.cos(a) * (rIn + rOut) / 2, (H + 1.5) / 2, Math.sin(a) * (rIn + rOut) / 2); g.add(new THREE.Mesh(f, fin)); }
  // the roof and its parapet
  const rf = new THREE.RingGeometry(rIn, rOut, 64, 1, -aHi, aHi - aLo); rf.rotateX(-Math.PI / 2); rf.translate(0, H, 0); g.add(new THREE.Mesh(rf, std(0x2a2622, { roughness: 0.8, side: THREE.DoubleSide })));
  // the name: in the crown band at one end of each face, lit white
  const sign = new THREE.MeshBasicMaterial({ map: scriptSignTexture(name), transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true }), w = Math.min(64, (aHi - aLo) * rIn * 0.3);
  // (at the end that is the left one seen from in front of that face: from the concave side a rising angle runs to the
  //  right, from the convex side to the left)
  for (const [r, out] of [[rIn - 1.2, false], [rOut + 1.2, true]]) {
    const a = aLo + (aHi - aLo) * (out ? 0.84 : 0.16), p = new THREE.PlaneGeometry(w, w * 0.31);
    p.rotateY(-a + (out ? Math.PI / 2 : -Math.PI / 2)); p.translate(Math.cos(a) * r, H - 6.8, Math.sin(a) * r); const m = new THREE.Mesh(p, sign); m.renderOrder = 4; g.add(m);
  }
  return g;
}
function towerAngles(cx, cz, pts) {
  const m = Math.atan2(pts.reduce((a, p) => a + (p[1] - cz), 0), pts.reduce((a, p) => a + (p[0] - cx), 0));
  let lo = Infinity, hi = -Infinity; for (const [x, z] of pts) { let a = Math.atan2(z - cz, x - cx) - m; a = Math.atan2(Math.sin(a), Math.cos(a)); lo = Math.min(lo, a); hi = Math.max(hi, a); }
  return [m + lo, m + hi];
}
def('wynn', /^wynn las vegas$/i, (fps, ctx) => {
  // (the footprint is the crescent itself: its long axis and length, how far its middle line bows from the line between
  //  its ends - the radius from that sagitta, the centre on the concave side - and its depth across the middle)
  const ring = fps[0].b.rings[0]; let mx = 0, mz = 0; for (const [x, z] of ring) { mx += x; mz += z; } mx /= ring.length; mz /= ring.length;
  let sxx = 0, szz = 0, sxz = 0; for (const [x, z] of ring) { const dx = x - mx, dz = z - mz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
  const th = 0.5 * Math.atan2(2 * sxz, sxx - szz), dA = [Math.cos(th), Math.sin(th)], nA = [-dA[1], dA[0]];
  const P = ring.map(([x, z]) => [(x - mx) * dA[0] + (z - mz) * dA[1], (x - mx) * nA[0] + (z - mz) * nA[1]]);
  const aMin = Math.min(...P.map((p) => p[0])), aMax = Math.max(...P.map((p) => p[0])), L = aMax - aMin, aMid = (aMin + aMax) / 2;
  const mid = P.filter((p) => Math.abs(p[0] - aMid) < 0.15 * L), ends = P.filter((p) => p[0] < aMin + 0.08 * L || p[0] > aMax - 0.08 * L);
  const avg = (q) => q.reduce((acc, p) => acc + p[1], 0) / Math.max(1, q.length), bm = avg(mid), be = avg(ends), sag = bm - be;
  const T = Math.max(16, Math.max(...mid.map((p) => p[1])) - Math.min(...mid.map((p) => p[1])));
  const R = Math.min(800, L * L / (8 * Math.max(3, Math.abs(sag))) + Math.abs(sag) / 2), sg = Math.sign(sag) || 1;
  const cb = bm - sg * R, cx = mx + dA[0] * aMid + nA[0] * cb, cz = mz + dA[1] * aMid + nA[1] * cb;
  const am = Math.atan2(nA[1] * sg, nA[0] * sg), half = Math.asin(Math.min(0.95, (L / 2) / R));
  console.info(`[world] Wynn: the crescent on a ${R.toFixed(0)} m curve, ${L.toFixed(0)} m across, ${T.toFixed(0)} m deep`);
  const out = new THREE.Group(); out.add(curvedTower({ cx, cz, rIn: R - T / 2, rOut: R + T / 2, aLo: am - half, aHi: am + half, H: 187, name: 'Wynn', seed: 21 })); return out;
});
def('encore', /^encore$/i, (fps, ctx) => {
  const fp = fps[0], ring = fp.b.rings[0], out = new THREE.Group();
  // (the tower's face: the footprint's long curved north-east edge - the run of its points that bows evenly)
  const face = ring.filter(([x, z]) => x > -316 && x < -195 && z < -2210 && z > -2320);
  const p = podium(fp, 14, std(0x3a2f26, { roughness: 0.6, emissive: 0x1a1208 })); if (p) out.add(p);
  if (face.length >= 6) {
    const c = fitCircle(face), [aLo, aHi] = towerAngles(c.cx, c.cz, face);
    console.info(`[world] Encore: the face on a ${c.r.toFixed(0)} m curve, ${((aHi - aLo) * c.r).toFixed(0)} m long`);
    out.add(curvedTower({ cx: c.cx, cz: c.cz, rIn: c.r, rOut: c.r + 25, aLo, aHi, H: 192, name: 'Encore', seed: 33 }));
  }
  return out;
});

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

// 15 High Roller (the LINQ; the user's photos, its builders' figures): a 520 ft (158 m) wheel, 550 ft (168 m) to its top,
// on one white tubular rim; 28 spherical glass cabins (6.9 m) outside the rim on their brackets; cable spokes laced
// from the hub's two flanges like a bicycle wheel's; the hub cantilevered from one side on an A-frame of two legs
// leaning together and a third leg behind them. At night the steel is floodlit white from below, a strip of LEDs runs
// round the rim in a soft, slowly drifting tint, the cabins glow from inside. It turns once in 30 minutes.
def('highroller', /high roller/i, (fps, ctx) => {
  const a = ctx.anchor('highroller', fps); const g = new THREE.Group(); const R = 79, hubY = 88.5, CAB = 3.45;
  const steel = std(0xeef0f4, { roughness: 0.35, metalness: 0.55, emissive: 0x9aa0b4, emissiveIntensity: 0.32 });   // (white, floodlit)
  const rotor = new THREE.Group(); rotor.position.y = hubY; rotor.userData.animated = true;   // (never merged: it turns)
  rotor.add(new THREE.Mesh(new THREE.TorusGeometry(R, 1.15, 10, 180), steel));
  const led = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform float uTime; varying vec3 vP; void main(){ float a = atan(vP.y, vP.x), w = 0.5 + 0.5 * sin(a * 2.0 - uTime * 0.12);
      vec3 c = mix(vec3(1.0, 0.86, 0.95), vec3(0.86, 0.84, 1.0), w); gl_FragColor = vec4(c * 1.35, 1.0); }` });   // (a near-white, pink to lilac and back, slowly)
  rotor.add(new THREE.Mesh(new THREE.TorusGeometry(R - 1.25, 0.32, 6, 180), led));
  // the hub and its two flanges; the cable spokes laced from them, tangent and crossing, to the rim
  { const hub = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 13, 24), steel); hub.rotation.x = Math.PI / 2; rotor.add(hub);
    for (const zz of [-5.5, 5.5]) { const fl = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 0.9, 32), steel); fl.rotation.x = Math.PI / 2; fl.position.z = zz; rotor.add(fl); }
    const cab = []; const NS = 56;
    for (const zz of [-5.5, 5.5]) for (let k = 0; k < NS; k++) { const ah = k * 2 * Math.PI / NS, ar = ah + (k % 2 ? 0.22 : -0.22); cab.push(Math.cos(ah) * 6.2, Math.sin(ah) * 6.2, zz, Math.cos(ar) * (R - 0.8), Math.sin(ar) * (R - 0.8), 0); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(cab, 3)); rotor.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xd8dce6, transparent: true, opacity: 0.85 }))); }
  // the cabins: glass spheres outside the rim, a steel ring round each one's waist, the bracket holding it to the rim
  { const glassM = new THREE.MeshStandardMaterial({ color: 0x9fb4c8, roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.55, emissive: 0xffe6f2, emissiveIntensity: 0.45 });
    const cg = [], rg = [], bg = [];
    for (let k = 0; k < 28; k++) {
      const an = k * 2 * Math.PI / 28, cx2 = Math.cos(an) * (R + CAB + 1.4), cy2 = Math.sin(an) * (R + CAB + 1.4);
      const sp = new THREE.SphereGeometry(CAB, 18, 12); sp.translate(cx2, cy2, 0); cg.push(sp);
      const rr = new THREE.TorusGeometry(CAB + 0.15, 0.18, 6, 32); rr.rotateX(Math.PI / 2); rr.translate(cx2, cy2, 0); rg.push(rr);
      for (const zz of [-1.6, 1.6]) { const br = new THREE.CylinderGeometry(0.28, 0.28, 2.2, 6); br.rotateZ(an - Math.PI / 2); br.translate(Math.cos(an) * (R + 1.2), Math.sin(an) * (R + 1.2), zz); bg.push(br); }
    }
    rotor.add(new THREE.Mesh(mergeGeometries(cg), glassM)); rotor.add(new THREE.Mesh(mergeGeometries([...rg, ...bg]), steel)); }
  const wheel = new THREE.Group(); wheel.add(rotor); wheel.rotation.y = Math.PI / 2; g.add(wheel);   // (its plane north-south, facing the Strip)
  // the legs, all on one side: the A-frame of two leaning together to the hub's end, the third behind them
  const legMat = steel, axle = new THREE.Vector3(7.5, hubY, 0);   // (wheel local z -> group x after the turn)
  for (const zL of [-34, 34]) g.add(strut(new THREE.Vector3(26, 0, zL), axle, 1.5, legMat));
  g.add(strut(new THREE.Vector3(62, 0, 0), axle, 1.3, legMat));
  for (const [x, z] of [[26, -34], [26, 34], [62, 0]]) g.add(box(7, 3, 7, std(0x9a9aa2), x, 0, z));   // (their footings)
  g.add(cyl(2.2, 2.2, 6, steel, 7.5, hubY - 3, 0, 16));   // (the axle's end, where the legs meet)
  // the boarding building under it: glass and white, lit
  g.add(box(46, 11, 30, win(0xdfe2ea, 0xe8f0ff, { litProb: 0.8, cellW: 4, cellH: 3.6 }), -6, 0, 0));
  ctx.anims.push((t, dt) => { rotor.rotation.z += dt * 0.0035; led.uniforms.uTime.value = t; });
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

// 17 Lake Bellagio and its fountains. The lake as it lies (OSM has no outline for it): between the Strip's sidewalk, 12 m
// past the circuit's barrier, and the shore the Bellagio's own buildings make - its casino's east front running
// south-west from the corner at Flamingo Road to the hotel - from that corner to the hotel's drive; its shore lit by a
// row of lamps on the balustrade. The fountains as the show runs them: the long line of shooters down the Strip side and
// the rings out in the lake, rising and falling in waves (one instanced mesh, the heights in its vertex shader), lit
// white-gold.
def('lakebellagio', /lake bellagio|bellagio fountains/i, (fps, ctx) => {
  const tr = ctx.track, g = new THREE.Group(), base = ctx.geo.buildings.find((b) => b.name === 'Bellagio' && b.rings[0]);
  const a = ctx.anchor('lakebellagio', fps), q0 = tr.nearest(a.x, a.z), f = {};
  const inRing = (x, z, r) => { let k = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const xi = r[i][0], zi = r[i][1], xj = r[j][0], zj = r[j][1]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) k = !k; } return k; };
  const side = Math.sign(q0.d) || -1;   // (the lake's side of the Strip)
  // the shore, every 4 m of the Strip: its east edge on the sidewalk line, its west where the Bellagio's buildings begin
  const sA = q0.s - 190, sB = q0.s + 70, E = [], Wp = [];
  for (let s = sA; s <= sB; s += 4) {
    const i = tr.idxAtS(s), e = tr.wallAt(i, side) + 12; let d = e + 6;
    while (d < e + 230 && !(base && inRing(...(() => { tr.sample(s, side * d, f); return [f.x, f.z]; })(), base.rings[0]))) d += 2;
    const t = (s - sA) / (sB - sA), taper = Math.min(1, Math.sin(Math.PI * Math.min(1, t * 1.15)) * 1.6);   // (round ends)
    const w = Math.max(8, (d - 5 - e) * taper);
    tr.sample(s, side * e, f); E.push([f.x, f.z]); tr.sample(s, side * (e + w), f); Wp.push([f.x, f.z]);
  }
  const shoreRing = [...E, ...Wp.reverse()];
  for (const b of ctx.geo.buildings) { if (!b.rings[0] || ctx.claimed.has(b.id)) continue; const c = b.rings[0].reduce((acc, p) => [acc[0] + p[0] / b.rings[0].length, acc[1] + p[1] / b.rings[0].length], [0, 0]); if (inRing(c[0], c[1], shoreRing) && b.name !== 'Bellagio') ctx.claimed.add(b.id); }   // (nothing built in the water)
  const shp = new THREE.Shape(shoreRing.map(([x, z]) => new THREE.Vector2(x, -z)));
  const water = new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshStandardMaterial({ color: 0x0f2e57, roughness: 0.06, metalness: 0.65, envMapIntensity: 1.6, emissive: 0x071a33, emissiveIntensity: 0.6 }));
  water.rotation.x = -Math.PI / 2; water.position.y = -0.35; g.add(water);
  // the balustrade round it, lamps along it
  const rail = [], lampG = [];
  for (let k = 0; k < shoreRing.length; k++) {
    const p = shoreRing[k], q = shoreRing[(k + 1) % shoreRing.length], L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (L < 0.5) continue;
    const bx = new THREE.BoxGeometry(L, 1.0, 0.45); bx.rotateY(Math.atan2(-(q[1] - p[1]), q[0] - p[0])); bx.translate((p[0] + q[0]) / 2, 0.5, (p[1] + q[1]) / 2); rail.push(bx);
    if (k % 3 === 0) { const lb = new THREE.BoxGeometry(0.35, 0.5, 0.35); lb.translate(p[0], 1.35, p[1]); lampG.push(lb); const pole = new THREE.BoxGeometry(0.12, 1.2, 0.12); pole.translate(p[0], 0.6, p[1]); rail.push(pole); }
  }
  g.add(new THREE.Mesh(mergeGeometries(rail), std(0xd9cdb4, { roughness: 0.8 })));
  g.add(new THREE.Mesh(mergeGeometries(lampG), glow(0xffd9a0, 2.4)));
  // the fountains, as the show sets them out (the aerials; the view from the Strip): the great semicircle out in the
  // middle of the lake, its ends toward the Strip; an inner arc; the tall cluster at its heart; and along the outer arc
  // the arching jets thrown in toward the middle. Each jet is water in motion - particles streaming up the beam,
  // bursting into a spray head at the top and falling back as mist, a soft cloud at its foot - and the show lifts and
  // drops them in waves. One point cloud, all of it in the shader.
  let cx = 0, cz = 0; for (const [x, z] of shoreRing) { cx += x; cz += z; } cx /= shoreRing.length; cz /= shoreRing.length;
  tr.sample(q0.s, 0, f); const toHotel = [cx - f.x, cz - f.z], tl = Math.hypot(...toHotel); toHotel[0] /= tl; toHotel[1] /= tl;
  const along = [-toHotel[1], toHotel[0]];
  const C = [cx - toHotel[0] * 8, cz - toHotel[1] * 8];   // (the arc's centre, a little toward the Strip)
  const R = 62, jets = [];   // [x, z, phase, height, kind (0 beam, 1 arch), dirX, dirZ, reach]
  const inLake = (x, z) => inRing(x, z, shoreRing);
  const onArc = (r, a) => [C[0] + (toHotel[0] * Math.cos(a) + along[0] * Math.sin(a)) * r, C[1] + (toHotel[1] * Math.cos(a) + along[1] * Math.sin(a)) * r];
  for (let a = -Math.PI / 2; a <= Math.PI / 2 + 1e-6; a += Math.PI / 64) { const [x, z] = onArc(R, a); if (inLake(x, z)) jets.push([x, z, a * 3.0, 34 + 10 * Math.cos(a * 2), 0, 0, 0, 0]); }
  for (let a = -Math.PI / 2; a <= Math.PI / 2 + 1e-6; a += Math.PI / 30) { const [x, z] = onArc(R * 0.56, a); if (inLake(x, z)) jets.push([x, z, a * 2.2 + 1.7, 24, 0, 0, 0, 0]); }
  for (let k = 0; k < 7; k++) { const [x, z] = onArc(k ? 7 : 0, k * Math.PI * 2 / 6); if (inLake(x, z)) jets.push([x, z, 3.3 + k * 0.4, 72, 0, 0, 0, 0]); }   // (the heart: the tall ones)
  for (let a = -Math.PI / 2 + 0.05; a <= Math.PI / 2 - 0.05; a += Math.PI / 22) { const [x, z] = onArc(R + 3, a), [ix, iz] = onArc(R * 0.62, a), dx = ix - x, dz = iz - z, L = Math.hypot(dx, dz); if (inLake(x, z)) jets.push([x, z, a * 4 + 0.5, 13, 1, dx / L, dz / L, L * 0.75]); }
  const PER = 110, N = jets.length * PER, pos = new Float32Array(N * 3), aJ = new Float32Array(N * 4), aK = new Float32Array(N * 4);
  let k2 = 0; let sd2 = 3; const rr = () => ((sd2 = (sd2 * 16807) % 2147483647) / 2147483647);
  for (const [x, z, ph, h, kind, dx, dz, reach] of jets) for (let p = 0; p < PER; p++, k2++) {
    pos[k2 * 3] = x; pos[k2 * 3 + 1] = 0; pos[k2 * 3 + 2] = z;
    aJ.set([ph, h, kind, reach], k2 * 4); aK.set([(p + 0.5 * rr()) / PER, rr(), dx, dz], k2 * 4);
  }
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); fg.setAttribute('aJ', new THREE.BufferAttribute(aJ, 4)); fg.setAttribute('aK', new THREE.BufferAttribute(aK, 4));
  const fm = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScale: { value: 900 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute vec4 aJ; attribute vec4 aK; uniform float uTime, uScale; varying float vA;
      void main(){
        float ph = aJ.x, H = aJ.y, kind = aJ.z, reach = aJ.w, r1 = aK.x, r2 = aK.y;
        float show = 0.18 + 0.82 * pow(0.5 + 0.5 * sin(uTime * 0.55 - ph), 2.0);          // (the wave the show sends round)
        float t = fract(r1 + uTime * 0.6);                                  // (the water moving up the beam)
        vec3 p = position; float sz; float a = 0.0; float ang = r2 * 6.2832;
        if (kind < 0.5) {
          float h = H * show, top = 0.86;
          if (t < top) { float u = t / top; p.y += h * u; p.xz += vec2(cos(ang), sin(ang)) * (0.12 + 0.9 * u * u * u) * (h / 40.0); sz = 0.35 + 1.3 * u * u; a = 0.34 + 0.26 * u; }
          else { float u = (t - top) / (1.0 - top); p.y += h * (1.0 - 0.35 * u * u); p.xz += vec2(cos(ang), sin(ang)) * (1.2 + 4.5 * u) * (h / 40.0); sz = 1.2 + 2.4 * u; a = 0.2 * (1.0 - u); }   // (the spray head, bursting, falling)
          if (r2 < 0.06) { p.y = 0.6 + r1 * 3.0; p.xz += vec2(cos(ang), sin(ang)) * (2.0 + 3.0 * r2) * show; sz = 5.0; a = 0.08 * show; }   // (the mist at its foot)
        } else {
          vec2 dir = aK.zw; float h = H * show, L = reach * (0.6 + 0.4 * show);
          p.xz += dir * L * t + vec2(cos(ang), sin(ang)) * 0.25 * t; p.y += 4.0 * h * t * (1.0 - t); sz = 0.8 + 1.8 * t; a = 0.36 * (1.0 - 0.6 * t);
        }
        vA = a; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(sz * uScale / max(1.0, -mv.z), 1.0, 90.0);
      }`,
    fragmentShader: `varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard; float s = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vec3(1.0, 0.86, 0.58) * vA * s, vA * s); }`,   // (lit gold from the nozzles' lamps, as at night)
  });
  const fountains = new THREE.Points(fg, fm); fountains.frustumCulled = false; fountains.userData.animated = true; fountains.renderOrder = 5; g.add(fountains);
  // (each beam's core: a narrow glowing column, turned to the camera, as tall as the show has it)
  { const beams = jets.filter((j) => !j[4]), cg = new THREE.PlaneGeometry(1, 1); cg.translate(0, 0.5, 0);
    const bm = new THREE.ShaderMaterial({ uniforms: fm.uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      vertexShader: `attribute vec2 aB; uniform float uTime; varying vec2 vUv;
        void main(){ float show = 0.18 + 0.82 * pow(0.5 + 0.5 * sin(uTime * 0.55 - aB.x), 2.0), h = aB.y * show * 0.9;
          vec4 base = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vec3 right = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]));
          vec3 wp = base.xyz + right * position.x * (0.45 + 0.5 * position.y) * (h / 30.0 + 0.4) + vec3(0.0, position.y * h, 0.0); vUv = vec2(position.x + 0.5, position.y);
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`,
      fragmentShader: `varying vec2 vUv; void main(){ float a = (1.0 - abs(vUv.x - 0.5) * 2.0) * (0.55 - 0.4 * vUv.y) * smoothstep(1.0, 0.85, vUv.y); gl_FragColor = vec4(vec3(1.0, 0.88, 0.62) * a, a); }` });
    const im = new THREE.InstancedMesh(cg, bm, beams.length), M = new THREE.Matrix4(), aB = new Float32Array(beams.length * 2);
    beams.forEach(([x, z, ph, h], k) => { M.makeTranslation(x, -0.2, z); im.setMatrixAt(k, M); aB[k * 2] = ph; aB[k * 2 + 1] = h; });
    cg.setAttribute('aB', new THREE.InstancedBufferAttribute(aB, 2)); im.frustumCulled = false; im.userData.animated = true; im.renderOrder = 5; g.add(im); }
  ctx.anims.push((t) => { fm.uniforms.uTime.value = t; });
  // (the nozzles' lamps under the water: a soft glow on the surface round each jet)
  { const lampDisc = []; for (const [x, z, , , kind] of jets) { if (kind) continue; const dg = new THREE.CircleGeometry(1.6, 8); dg.rotateX(-Math.PI / 2); dg.translate(x, -0.28, z); lampDisc.push(dg); }
    g.add(new THREE.Mesh(mergeGeometries(lampDisc), new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }))); }
  g.userData.shore = shoreRing; g.userData.keep = true;   // (laid to the shore: never shifted)
  return g;
});

// 18 Bellagio, from the lake (the user's photos: the front from the water; the aerial over the lake): one gently curved
// front, concave to the lake, ~36 floors - a base of tall arched openings, then floors of paired windows in bays between
// pilasters, white string courses every few floors, the top two floors an arcade of tall arched windows under the
// cornice, a copper-green hip roof; its wings stepping forward at either end; at its middle the raised centre bay and the
// crown on it - a drum ringed with columns, the BELLAGIO plaque, the ribbed dome and its lantern. Cream by day, its
// windows and cornices warm at night. The facade one texture, drawn floor by floor, wrapped round the curve.
function bellagioSignTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 192; const x = c.getContext('2d');
  x.clearRect(0, 0, 1024, 192); x.fillStyle = '#ffd98a'; x.shadowColor = '#ffb030'; x.shadowBlur = 18;
  x.font = '600 132px Georgia, "Times New Roman", serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('B E L L A G I O', 512, 100);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function bellagioFacade(H) {
  // (four bays, 6 m each, the full height: colour, and the glow of what is lit at night)
  const W = 1024, Hp = 4096, px = Hp / H, mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = Hp; return c; };
  const cc = mk(), ce = mk(), x = cc.getContext('2d'), e = ce.getContext('2d'), bay = W / 4, Y = (m) => Hp - m * px;
  let sd = 9; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
  x.fillStyle = '#e5cfa2'; x.fillRect(0, 0, W, Hp); e.fillStyle = '#4a3920'; e.fillRect(0, 0, W, Hp);   // (the night: the front floodlit warm from below)
  const band = (m0, m1, col, glow) => { x.fillStyle = col; x.fillRect(0, Y(m1), W, (m1 - m0) * px); if (glow) { e.fillStyle = glow; e.fillRect(0, Y(m1), W, (m1 - m0) * px); } };
  // the base: three floors of tall arches
  for (let b = 0; b < 4; b++) { const cx = b * bay + bay / 2, w = bay * 0.55, top = Y(11.5), bot = Y(0.4);
    x.fillStyle = '#2a2018'; x.fillRect(cx - w / 2, top + w / 2, w, bot - top - w / 2); x.beginPath(); x.arc(cx, top + w / 2, w / 2, Math.PI, 0); x.fill();
    e.fillStyle = '#ffc98a'; e.fillRect(cx - w / 2 + 4, top + w / 2, w - 8, bot - top - w / 2); e.beginPath(); e.arc(cx, top + w / 2, w / 2 - 4, Math.PI, 0); e.fill(); }
  band(12.0, 13.2, '#f6ecd6', '#3a2a14');
  // the floors: paired windows per bay between pilasters, a string course every fifth floor
  const FL = 3.4, f0 = 13.2, fTop = H - 11;
  for (let y = f0, fl = 0; y + FL <= fTop; y += FL, fl++) {
    if (fl % 5 === 4) { band(y + FL - 0.5, y + FL, '#f8f0de', '#2a1e10'); }
    for (let b = 0; b < 4; b++) for (const o of [0.27, 0.73]) {
      const cx = b * bay + bay * o, w = bay * 0.26, y0 = Y(y + FL * 0.82), hh = FL * 0.62 * px;
      x.fillStyle = '#3a3a40'; x.fillRect(cx - w / 2, y0, w, hh);
      const lit = rnd(); e.fillStyle = lit < 0.78 ? (rnd() < 0.8 ? '#ffd29a' : '#fff2d8') : lit < 0.88 ? '#8a6a44' : '#1a140c'; e.fillRect(cx - w / 2 + 2, y0 + 2, w - 4, hh - 4);
      x.fillStyle = '#f2e4c4'; x.fillRect(cx - w / 2 - 3, y0 + hh, w + 6, 5); e.fillStyle = '#6a5230'; e.fillRect(cx - w / 2 - 3, y0 + hh, w + 6, 5);   // (its sill)
    }
    for (let b = 0; b <= 4; b++) { x.fillStyle = '#ead7ae'; x.fillRect(b * bay - 6, Y(y + FL), 12, FL * px); }   // (the pilasters)
  }
  // the top: two floors of tall arched windows, the cornice over them lit
  band(fTop, fTop + 0.8, '#f8f0de', '#4a3418');
  for (let b = 0; b < 4; b++) for (const o of [0.27, 0.73]) { const cx = b * bay + bay * o, w = bay * 0.3, top = Y(H - 2.6), bot = Y(fTop + 1.2);
    x.fillStyle = '#2e2a28'; x.fillRect(cx - w / 2, top + w / 2, w, bot - top - w / 2); x.beginPath(); x.arc(cx, top + w / 2, w / 2, Math.PI, 0); x.fill();
    e.fillStyle = '#ffd9a0'; e.fillRect(cx - w / 2 + 3, top + w / 2, w - 6, bot - top - w / 2); e.beginPath(); e.arc(cx, top + w / 2, w / 2 - 3, Math.PI, 0); e.fill(); }
  band(H - 2.2, H, '#fbf3e2', '#c08a40');
  const t = new THREE.CanvasTexture(cc), te = new THREE.CanvasTexture(ce);
  for (const tt of [t, te]) { tt.wrapS = THREE.RepeatWrapping; tt.colorSpace = THREE.SRGBColorSpace; tt.anisotropy = 8; }
  return [t, te];
}
/** a curved wall: radius r, angles a0..a1 (about the y axis, 0 along +x), y0..y1; facing in (toward the centre) or out;
 *  u = arc length / 24 m (the four-bay repeat), v = y / H */
function curvedWall(r, a0, a1, y0, y1, H, inward) {
  const segs = Math.max(4, Math.ceil(Math.abs(a1 - a0) * r / 6)), pos = [], uv = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const a = a0 + (a1 - a0) * i / segs, x = Math.cos(a) * r, z = Math.sin(a) * r, u = (a - a0) * r / 24;
    pos.push(x, y0, z, x, y1, z); uv.push(u, y0 / H, u, y1 / H);
    if (i) { const k = i * 2; if (inward) idx.push(k - 2, k, k - 1, k - 1, k, k + 1); else idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function bellagioGrounds(fp, ctx) {
  const g = new THREE.Group(), ring = fp.b.rings[0], tr = ctx.track;
  const inR = (x, z) => { let k = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const xi = ring[i][0], zi = ring[i][1], xj = ring[j][0], zj = ring[j][1]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) k = !k; } return k; };
  // the paving: travertine, its joints, a shade lighter along the walks
  const pc = document.createElement('canvas'); pc.width = pc.height = 256; const x = pc.getContext('2d');
  x.fillStyle = '#cdbf9f'; x.fillRect(0, 0, 256, 256); x.strokeStyle = 'rgba(120,105,80,0.5)'; x.lineWidth = 2;
  for (let k = 0; k <= 256; k += 32) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, 256); x.moveTo(0, k); x.lineTo(256, k); x.stroke(); }
  for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(${150 + Math.random() * 60},${135 + Math.random() * 50},${110 + Math.random() * 40},0.25)`; x.fillRect(Math.random() * 256, Math.random() * 256, 3, 3); }
  const pt = new THREE.CanvasTexture(pc); pt.wrapS = pt.wrapT = THREE.RepeatWrapping; pt.colorSpace = THREE.SRGBColorSpace;
  const shp = new THREE.Shape(ring.map(([px, pz]) => new THREE.Vector2(px, -pz)));
  const pg = new THREE.ShapeGeometry(shp); pg.rotateX(-Math.PI / 2); pg.translate(0, 0.06, 0);
  { const uv = pg.attributes.uv, P = pg.attributes.position; for (let i = 0; i < P.count; i++) uv.setXY(i, P.getX(i) / 8, P.getZ(i) / 8); }
  g.add(new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ map: pt, roughness: 0.85, color: 0x9a9080, emissive: 0x3a2e1c, emissiveIntensity: 0.2 })));
  // the lakefront villas: along the edges of the ground that face the lake (toward the Strip), set 8 m in from the shore
  const toTrack = ctx.toTrack(fp.info.c), villaG = [], roofG = [], domes = [], wallMats = [win(0xe8d2a6, 0xffcf90, { litProb: 0.6, cellW: 3.6, cellH: 3.6 }), win(0xd9b88a, 0xffcf90, { litProb: 0.6, cellW: 3.6, cellH: 3.6 }), win(0xe2b9a6, 0xffcf90, { litProb: 0.6, cellW: 3.6, cellH: 3.6 })];
  let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let placed = 0; const taken = [];
  for (let i = 0; i < ring.length; i++) {
    const [ax, az] = ring[i], [bx, bz] = ring[(i + 1) % ring.length], L = Math.hypot(bx - ax, bz - az); if (L < 10) continue;
    const tx = (bx - ax) / L, tz = (bz - az) / L; let nx = tz, nz = -tx; const mxp = (ax + bx) / 2, mzp = (az + bz) / 2; if (inR(mxp + nx * 2, mzp + nz * 2)) { nx = -nx; nz = -nz; }   // (outward)
    if (nx * toTrack[0] + nz * toTrack[1] < 0.35) continue;   // (only the edges facing the lake)
    for (let u = 7; u < L - 7; u += 15 + rnd() * 6) {
      const w = 11 + rnd() * 6, d = 9 + rnd() * 4, h = 7 + rnd() * 6, cx = ax + tx * u - nx * (8 + d / 2), cz = az + tz * u - nz * (8 + d / 2);
      if (!inR(cx, cz) || taken.some(([qx, qz]) => Math.hypot(qx - cx, qz - cz) < 13)) continue;
      const ang = Math.atan2(-tz, tx), m = wallMats[placed % 3]; taken.push([cx, cz]);
      const bw = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); bw.position.set(cx, h / 2, cz); bw.rotation.y = ang; g.add(bw);
      const hip = new THREE.ConeGeometry(Math.hypot(w, d) / 2 * 1.02, 3.2, 4, 1); hip.rotateY(Math.PI / 4); hip.scale(w / Math.hypot(w, d) * 1.41, 1, d / Math.hypot(w, d) * 1.41); hip.rotateY(ang); hip.translate(cx, h + 1.6, cz); roofG.push(hip);
      if (rnd() < 0.25) { const dm = new THREE.SphereGeometry(2.4, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2); dm.translate(cx, h + 3.1, cz); domes.push(dm); }
      placed++;
    }
  }
  if (roofG.length) g.add(new THREE.Mesh(mergeGeometries(roofG.map((r) => r.toNonIndexed())), std(0xa85a38, { roughness: 0.85, emissive: 0x2a1006, emissiveIntensity: 0.5 })));
  if (domes.length) g.add(new THREE.Mesh(mergeGeometries(domes), std(0xd9b866, { metalness: 0.5, roughness: 0.4, emissive: 0x6a4a14, emissiveIntensity: 0.7 })));
  // the gardens: trees in clumps over the ground, never on the villas
  const trunks = [], crowns = [];
  for (let k = 0; k < 160; k++) {
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const [px, pz] of ring) { x0 = Math.min(x0, px); x1 = Math.max(x1, px); z0 = Math.min(z0, pz); z1 = Math.max(z1, pz); }
    const tx2 = x0 + (x1 - x0) * rnd(), tz2 = z0 + (z1 - z0) * rnd(); if (!inR(tx2, tz2) || taken.some(([qx, qz]) => Math.hypot(qx - tx2, qz - tz2) < 10)) continue;
    const ht = 4 + rnd() * 5, tg = new THREE.CylinderGeometry(0.18, 0.25, ht * 0.5, 5); tg.translate(tx2, ht * 0.25, tz2); trunks.push(tg);
    const cr = new THREE.IcosahedronGeometry(1.6 + rnd() * 1.6, 0); cr.scale(1, 0.8, 1); cr.translate(tx2, ht * 0.62, tz2); crowns.push(cr);
  }
  if (trunks.length) { g.add(new THREE.Mesh(mergeGeometries(trunks), std(0x5a4632))); g.add(new THREE.Mesh(mergeGeometries(crowns.map((c) => c.toNonIndexed())), std(0x2f5a2c, { roughness: 0.9, emissive: 0x0a1608, emissiveIntensity: 0.5 }))); }
  g.userData.keep = true;
  return g;
}
def('bellagio', /^bellagio las vegas$|^bellagio$/i, (fps, ctx) => {
  const out = new THREE.Group();
  for (const fp of fps) {
    if (/las vegas/i.test(fp.b.name)) {
      // (the curve read off the footprint: its long axis and length, and how far its middle bows from the line between its
      //  ends - the radius from that sagitta, the centre on the concave side; the front 20 m deep on it)
      const ring = fp.b.rings[0]; let mx = 0, mz = 0; for (const [x, z] of ring) { mx += x; mz += z; } mx /= ring.length; mz /= ring.length;
      let sxx = 0, szz = 0, sxz = 0; for (const [x, z] of ring) { const dx = x - mx, dz = z - mz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
      const th = 0.5 * Math.atan2(2 * sxz, sxx - szz), dA = [Math.cos(th), Math.sin(th)], nA = [-dA[1], dA[0]];
      const P = ring.map(([x, z]) => [(x - mx) * dA[0] + (z - mz) * dA[1], (x - mx) * nA[0] + (z - mz) * nA[1]]);
      const aMin = Math.min(...P.map((p) => p[0])), aMax = Math.max(...P.map((p) => p[0])), L = aMax - aMin, aMid = (aMin + aMax) / 2;
      const mean = (f) => { const q = P.filter(f); return q.reduce((acc, p) => acc + p[1], 0) / Math.max(1, q.length); };
      const bm = mean((p) => Math.abs(p[0] - aMid) < 0.15 * L), be = mean((p) => p[0] < aMin + 0.12 * L || p[0] > aMax - 0.12 * L), sag = bm - be;
      const Rf = Math.min(600, L * L / (8 * Math.max(4, Math.abs(sag))) + Math.abs(sag) / 2), sg = Math.sign(sag) || 1;
      const cb = bm - sg * Rf, Cx = mx + dA[0] * aMid + nA[0] * cb, Cz = mz + dA[1] * aMid + nA[1] * cb;
      const am = Math.atan2(nA[1] * sg, nA[0] * sg), aHi = Math.asin(Math.min(0.95, (L / 2) / Rf)), aLo = -aHi;
      const g = new THREE.Group(), H = 128, half = Math.min(0.9, (aHi - aLo) / 2 * 0.86), rIn = Rf - 10, rOut = Rf + 10, Hc = H + 8;
      console.info(`[world] Bellagio: the front on a ${Rf.toFixed(0)} m curve, ${(2 * Rf * Math.sin(half)).toFixed(0)} m across, bowing ${sag.toFixed(0)} m`);
      const [tex, texE] = bellagioFacade(H), [texC, texCE] = bellagioFacade(Hc);
      const facade = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: texE, emissive: 0xffffff, emissiveIntensity: 1.0, roughness: 0.75 });
      const facadeC = new THREE.MeshStandardMaterial({ map: texC, emissiveMap: texCE, emissive: 0xffffff, emissiveIntensity: 1.0, roughness: 0.75 });
      const cream = std(0xe8d4a8, { roughness: 0.8, emissive: 0x3a2a12, emissiveIntensity: 0.4 }), copper = std(0x5f7d72, { roughness: 0.6, metalness: 0.35, emissive: 0x0a1410, emissiveIntensity: 0.6 });
      const cornice = glow(0xffd29a, 1.4);
      // the main front and its back, either side of the raised centre bay
      const cHalf = 0.075;
      for (const [a0, a1] of [[-half, -cHalf], [cHalf, half]]) { g.add(new THREE.Mesh(curvedWall(rIn, a0, a1, 0, H, H, true), facade)); g.add(new THREE.Mesh(curvedWall(rOut, a0, a1, 0, H, H, false), facade)); }
      g.add(new THREE.Mesh(curvedWall(rIn - 2.5, -cHalf, cHalf, 0, Hc, Hc, true), facadeC)); g.add(new THREE.Mesh(curvedWall(rOut, -cHalf, cHalf, 0, Hc, Hc, false), facadeC));
      for (const a of [-cHalf, cHalf]) { const g2 = new THREE.PlaneGeometry(2.5, Hc); g2.rotateY(-a + Math.PI / 2); g2.translate(Math.cos(a) * (rIn - 1.25), Hc / 2, Math.sin(a) * (rIn - 1.25)); g.add(new THREE.Mesh(g2, cream)); }
      // the roof: a hip of copper over the curve, the parapet and its lit cornice
      { const segs = 60, pos = [], idx = [];
        for (let i = 0; i <= segs; i++) { const a = -half + 2 * half * i / segs, c = Math.cos(a), s2 = Math.sin(a), rm = (rIn + rOut) / 2; pos.push(c * rIn, H, s2 * rIn, c * rm, H + 7, s2 * rm, c * rOut, H, s2 * rOut); if (i) { const k = i * 3; idx.push(k - 3, k, k - 2, k - 2, k, k + 1, k - 2, k + 1, k - 1, k - 1, k + 1, k + 2); } }
        const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); rg.setIndex(idx); rg.computeVertexNormals(); const roof = new THREE.Mesh(rg, copper); roof.material.side = THREE.DoubleSide; g.add(roof); }
      g.add(arcSlab(rIn - 0.6, rIn + 0.6, 2 * half, 1.1, cream, H)); g.add(arcSlab(rIn - 0.8, rIn - 0.5, 2 * half, 0.4, cornice, H - 2.4));
      // the wings: forward at each end, the same front, their own hips
      for (const sgn of [1, -1]) {
        const a = sgn * half, wx = Math.cos(a) * (rIn + 4), wz = Math.sin(a) * (rIn + 4), wg = new THREE.Group(), WH = H - 14;
        const [tw, twe] = bellagioFacade(WH), wm = new THREE.MeshStandardMaterial({ map: tw, emissiveMap: twe, emissive: 0xffffff, emissiveIntensity: 1.0, roughness: 0.75 });
        for (const [px, pz, ry, w] of [[-14, 0, Math.PI / 2, 26], [14, 0, -Math.PI / 2, 26], [0, 13, 0, 28], [0, -13, Math.PI, 28]]) { const pl = new THREE.PlaneGeometry(w, WH); const uv = pl.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * w / 24); pl.rotateY(ry); pl.translate(px, WH / 2, pz); wg.add(new THREE.Mesh(pl, wm)); }
        { const hip = new THREE.ConeGeometry(19.5, 8, 4, 1); hip.rotateY(Math.PI / 4); hip.scale(1, 1, 0.93); hip.translate(0, WH + 4, 0); wg.add(new THREE.Mesh(hip, copper)); }
        wg.add(box(28.6, 0.5, 26.6, cornice, 0, WH - 0.3));
        wg.position.set(wx, 0, wz); wg.rotation.y = -a + sgn * 0.35; g.add(wg);
      }
      // the crown on the centre bay: a drum ringed with columns, the plaque, the ribbed dome, the lantern
      const cx = (rIn + rOut) / 2 - 3, cy = Hc;
      g.add(box(16, 3, 16, cream, cx, cy)); g.add(box(16.6, 0.5, 16.6, cornice, cx, cy + 3));
      g.add(cyl(6.2, 6.2, 9, glow(0xffd29a, 1.1), cx, cy + 3.5, 0, 24));   // (its lit core)
      { const cols = []; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, c2 = new THREE.CylinderGeometry(0.45, 0.5, 9, 8); c2.translate(cx + Math.cos(a) * 7, cy + 3.5 + 4.5, Math.sin(a) * 7); cols.push(c2); } g.add(new THREE.Mesh(mergeGeometries(cols), cream)); }
      g.add(cyl(7.8, 7.8, 1.4, cream, cx, cy + 12.5, 0, 32));
      { const dome = new THREE.Mesh(new THREE.SphereGeometry(7.4, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), std(0xd9b866, { metalness: 0.5, roughness: 0.4, emissive: 0x8a6420, emissiveIntensity: 0.9 })); dome.position.set(cx, cy + 13.9, 0); dome.scale.y = 0.9; g.add(dome);
        const ribs = []; for (let k = 0; k < 16; k++) { const rb = new THREE.TorusGeometry(7.45, 0.12, 4, 24, Math.PI / 2); rb.rotateY(k * Math.PI / 8); rb.scale(1, 0.9, 1); rb.translate(cx, cy + 13.9, 0); ribs.push(rb); } g.add(new THREE.Mesh(mergeGeometries(ribs), cream)); }
      g.add(cyl(1.6, 1.6, 3.2, glow(0xffe0a8, 2.0), cx, cy + 20.4, 0, 16)); g.add(cyl(2.0, 1.4, 0.6, cream, cx, cy + 23.6, 0, 16));
      { const ld = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), std(0xd9b866, { metalness: 0.5, roughness: 0.4, emissive: 0x8a6420, emissiveIntensity: 0.9 })); ld.position.set(cx, cy + 24.2, 0); g.add(ld); }
      g.add(cyl(0.12, 0.2, 3, cream, cx, cy + 25.6, 0, 6));
      { const sign = new THREE.Mesh(new THREE.PlaneGeometry(11, 2.2), new THREE.MeshBasicMaterial({ map: bellagioSignTexture(), transparent: true, depthWrite: false, fog: false })); sign.rotation.y = -Math.PI / 2; sign.position.set(cx - 7.9, cy + 11, 0); g.add(sign);
        g.add(box(0.4, 2.6, 12, std(0x2a2620), cx - 7.75, cy + 9.6, 0)); }
      g.position.set(Cx, 0, Cz); g.rotation.y = -am; out.add(g);   // (local +x: from the curve's centre out through the front's middle)
    } else {
      // the rest of the Bellagio's ground (OSM draws it all as one 'building'; the aerial shows what it is): paved walkways
      // and forecourts, garden beds and their trees, and only a few low buildings - the row of lakefront villas along the
      // lake's west shore, terracotta hips over cream, ochre and rose walls, arched windows lit warm, a domed turret or two
      out.add(bellagioGrounds(fp, ctx));
    }
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

// 20 Eiffel Tower - the half-scale replica at Paris Las Vegas: 540 ft (165 m), welded steel with false rivets, the
// observation deck at 460 ft (140 m), the restaurant on the first level ~11 floors up (Wikipedia; Caesars; the
// builders). Built to the Paris original's own geometry, halved: four separate square lattice legs on a 62.5 m base,
// curving in to the first platform (35.3 m square, 28.8 m up) and meeting at the second (20.5 m, 57.9 m), the four great
// arches between them under the first; one tapering shaft from there to the deck, the lantern and the mast above it.
// Bronze-brown, lit warm gold at night, the galleries lit.
function latticeTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d');
  x.clearRect(0, 0, 128, 128); x.strokeStyle = '#ffffff'; x.lineWidth = 5;
  x.beginPath(); x.moveTo(0, 0); x.lineTo(128, 128); x.moveTo(128, 0); x.lineTo(0, 128); x.stroke();
  x.lineWidth = 3; x.beginPath(); x.moveTo(0, 64); x.lineTo(128, 64); x.moveTo(64, 0); x.lineTo(64, 128); x.stroke();
  x.lineWidth = 8; x.strokeRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
}
function galleryTexture(lit) {   // the first level's glazed gallery: bronze piers, arched windows (the restaurant, lit)
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#5a3a22'; x.fillRect(0, 0, 512, 128);
  for (let k = 0; k < 8; k++) { const wx = k * 64 + 10; x.fillStyle = lit ? '#ffcf86' : '#1a1410'; x.fillRect(wx, 30, 44, 80); x.beginPath(); x.arc(wx + 22, 30, 22, Math.PI, 0); x.fill(); }
  x.fillStyle = '#7a5434'; x.fillRect(0, 0, 512, 14); x.fillRect(0, 116, 512, 12);
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
def('eiffel', /^eiffel tower$/i, (fps, ctx) => {
  const fp = fps[0], g = new THREE.Group(), V = (x, y, z) => new THREE.Vector3(x, y, z);
  const steel = std(0x7b5233, { roughness: 0.6, metalness: 0.55, emissive: 0x6a3a14, emissiveIntensity: 0.75 });
  const lattice = new THREE.MeshStandardMaterial({ color: 0x7b5233, map: latticeTexture(), alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.5, emissive: 0x6a3a14, emissiveIntensity: 0.75 });
  // the outer corner's half-width up the tower (the original's 125 m base, 70.7 m first, 41 m second and 16.5 m third
  // platforms, halved), monotone between them; each leg's own square section, 12.5 m at its foot to 5.1 m at the second
  // platform, where the four meet
  const YP = [0, 9, 18, 28.8, 43, 57.9], HP = [31.25, 26.0, 21.4, 17.67, 13.6, 10.24], SP = [12.5, 10.5, 8.6, 7.0, 5.9, 5.12];
  const interp = (A, y) => { if (y <= YP[0]) return A[0]; for (let k = 1; k < YP.length; k++) if (y <= YP[k]) { const t = (y - YP[k - 1]) / (YP[k] - YP[k - 1]), e = t * t * (3 - 2 * t); return A[k - 1] + (A[k] - A[k - 1]) * (0.5 * t + 0.5 * e); } return A[A.length - 1]; };
  const hw = (y) => (y <= 57.9 ? interp(HP, y) : y <= 138 ? 10.24 - (y - 57.9) * (6.12 / 80.1) : 4.12 - (y - 138) * 0.13);
  const sz = (y) => interp(SP, y);
  const geos = [], lat = [];
  const rod = (a, b, r) => { const m = strut(a, b, r, steel); m.updateMatrix(); geos.push(m.geometry.clone().applyMatrix4(m.matrix)); };
  const panel = (a, b, c2, d, w, h) => {   // a lattice quad a-b (bottom) c-d (top), tiled ~2.5 m
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute([...a.toArray(), ...b.toArray(), ...c2.toArray(), ...a.toArray(), ...c2.toArray(), ...d.toArray()], 3));
    const u = Math.max(1, w / 2.5), v = Math.max(1, h / 2.5); geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, u, 0, u, v, 0, 0, u, v, 0, v], 2)); geo.computeVertexNormals(); lat.push(geo);
  };
  const Q = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  // ---- the four legs, foot to second platform
  const LY = [0, 4.5, 9, 13.5, 18, 23, 28.8, 33.5, 38.5, 43, 48, 53, 57.9];
  for (const [sx, sz2] of Q) {
    const cor = (y) => { const H = hw(y), S = sz(y); return [V(sx * H, y, sz2 * H), V(sx * H, y, sz2 * (H - S)), V(sx * (H - S), y, sz2 * (H - S)), V(sx * (H - S), y, sz2 * H)]; };
    for (let k = 0; k < LY.length - 1; k++) {
      const A = cor(LY[k]), B = cor(LY[k + 1]), r = 0.42 - 0.025 * k, h = LY[k + 1] - LY[k];
      for (let c = 0; c < 4; c++) { rod(A[c], B[c], r); rod(B[c], B[(c + 1) % 4], r * 0.55); rod(A[c], B[(c + 1) % 4], r * 0.38); rod(A[(c + 1) % 4], B[c], r * 0.38); panel(A[c], A[(c + 1) % 4], B[(c + 1) % 4], B[c], A[c].distanceTo(A[(c + 1) % 4]), h); }
    }
  }
  // ---- the great arches under the first platform, one in each face, leg to leg: a lattice girder (two curved booms and
  //      the diagonals between them) springing from the legs' inner edges 8 m up and touching the platform at its crown
  for (const [axis, sgn] of [['x', 1], ['z', -1], ['x', -1], ['z', 1]]) {   // (each face: its plane x = +-H or z = +-H)
    const N = 22, P = (t, drop) => {
      const th = Math.PI * t, y = 8 + (27.4 - drop - 8) * Math.sin(th), H = hw(y), w = Math.cos(th) * (H - sz(y)), o = sgn * (H - 0.4);
      return axis === 'x' ? V(o, y, w) : V(w, y, o);
    };
    for (let k = 0; k < N; k++) {
      const a1 = P(k / N, 0), b1 = P((k + 1) / N, 0), a2 = P(k / N, 1.6), b2 = P((k + 1) / N, 1.6);
      rod(a1, b1, 0.32); rod(a2, b2, 0.26); rod(a1, b2, 0.14); rod(a2, b1, 0.14);
    }
  }
  // ---- the shaft, second platform to the deck, then its top to the lantern
  const UY = [57.9, 66, 75, 85, 96, 108, 120, 130, 138, 144];
  for (let k = 0; k < UY.length - 1; k++) {
    const H0 = hw(UY[k]), H1 = hw(UY[k + 1]), h = UY[k + 1] - UY[k], r = 0.34 - 0.025 * k;
    for (let c = 0; c < 4; c++) {
      const [ax, az] = Q[c], [bx, bz] = Q[(c + 1) % 4];
      const a0 = V(ax * H0, UY[k], az * H0), b0 = V(bx * H0, UY[k], bz * H0), a1 = V(ax * H1, UY[k + 1], az * H1), b1 = V(bx * H1, UY[k + 1], bz * H1);
      rod(a0, a1, r); rod(a1, b1, r * 0.55); rod(a0, b1, r * 0.38); rod(b0, a1, r * 0.38); panel(a0, b0, b1, a1, 2 * H0, h);
    }
  }
  g.add(new THREE.Mesh(mergeGeometries(geos), steel)); g.add(new THREE.Mesh(mergeGeometries(lat), lattice));
  // ---- the platforms: the first's deck and its glazed gallery all round (the restaurant), the second's, the deck at the
  //      top with its lit cabin
  const deckMat = std(0x5e3d24, { roughness: 0.7, emissive: 0x2a1608, emissiveIntensity: 0.6 });
  const galTex = galleryTexture(true); galTex.repeat.set(4, 1);
  const galMat = new THREE.MeshStandardMaterial({ map: galTex, emissive: 0xffffff, emissiveMap: galTex, emissiveIntensity: 0.9, roughness: 0.6, side: THREE.DoubleSide });
  const ring = (y, half, th, mat) => { for (const [w, d, x, z] of [[half * 2, 1.2, 0, half - 0.6], [half * 2, 1.2, 0, -half + 0.6], [1.2, half * 2, half - 0.6, 0], [1.2, half * 2, -half + 0.6, 0]]) g.add(box(w, th, d, mat, x, y, z)); };
  const band = (y0, y1, half) => { for (let f = 0; f < 4; f++) { const pl = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, y1 - y0), galMat); const a = f * Math.PI / 2; pl.position.set(Math.sin(a) * half, (y0 + y1) / 2, Math.cos(a) * half); pl.rotation.y = a; g.add(pl); } };
  g.add(box(35.3, 1.1, 35.3, deckMat, 0, 28.3)); band(29.4, 33.0, 17.9); ring(33.0, 18.1, 0.6, deckMat);
  g.add(box(20.5, 0.9, 20.5, deckMat, 0, 57.5)); band(58.4, 60.4, 10.4); ring(60.4, 10.6, 0.4, deckMat);
  g.add(box(8.6, 0.8, 8.6, deckMat, 0, 137.6)); band(138.4, 142.2, 4.0); g.add(box(8.4, 0.5, 8.4, deckMat, 0, 142.2));
  // ---- the lantern, the cupola, the mast and its beacon
  g.add(cyl(2.4, 2.9, 3.2, steel, 0, 144, 0, 12)); g.add(cyl(2.6, 2.6, 0.9, glow(0xffd9a0, 2.2), 0, 145.2, 0, 12));
  { const dome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), steel); dome.position.y = 147.2; g.add(dome); }
  g.add(cyl(0.18, 0.32, 15.5, steel, 0, 149, 0, 8)); g.add(cyl(0.5, 0.5, 1.0, glow(0xff2a20, 4), 0, 164, 0, 10));
  return place(g, fp.info.c, fp.info.angle);
});

// The Montgolfier balloon sign (Paris Las Vegas, 1999; Federal Heath): 180 ft (54.9 m) to the top, the balloon 72 ft
// (22 m) across on a space-frame floor, a skin decorated to the first passenger balloon of the Montgolfier brothers (the
// Aerostat Reveillon, 1783: royal blue and gold) and outlined in more than a mile of neon, over a gondola that carries
// the digital sign. The balloon's shape is the Reveillon's: a round crown swelling out over a long tapering skirt to the
// open neck, the gondola hung under it.
function montgolfierTexture() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const x = c.getContext('2d'), W = 2048, H = 1024;
  const gold = '#e8b84a', gold2 = '#b88a2a', blue = '#1d3f9e';
  x.fillStyle = blue; x.fillRect(0, 0, W, H);
  const bandY = (v) => H * (1 - v);   // (v up the profile, 0 at the neck: the canvas's top is the crown)
  const band = (v0, v1, col) => { x.fillStyle = col; x.fillRect(0, bandY(v1), W, bandY(v0) - bandY(v1)); };
  const star = (cx, cy, r) => { x.beginPath(); for (let j = 0; j < 16; j++) { const a = j * Math.PI / 8, rr = j % 2 ? r * 0.45 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); };
  const G = 16, gw = W / G;
  // the crown: gold rays from the top
  for (let k = 0; k < G; k++) { x.fillStyle = k % 2 ? gold : gold2; x.beginPath(); x.moveTo(k * gw + gw / 2, 0); x.lineTo(k * gw + gw * 0.15, bandY(0.9)); x.lineTo(k * gw + gw * 0.85, bandY(0.9)); x.closePath(); x.fill(); }
  // the upper band: the signs of the zodiac in gold medallions on a gold-edged band
  band(0.76, 0.84, '#173482'); x.fillStyle = gold; x.fillRect(0, bandY(0.84), W, 10); x.fillRect(0, bandY(0.76) - 10, W, 10);
  for (let k = 0; k < G; k++) { const cx = k * gw + gw / 2, cy = (bandY(0.84) + bandY(0.76)) / 2; x.strokeStyle = gold; x.lineWidth = 6; x.beginPath(); x.arc(cx, cy, 30, 0, 6.283); x.stroke(); x.fillStyle = gold; star(cx, cy, 18); }
  // the body: the royal cipher and the sun in alternate gores
  for (let k = 0; k < G; k++) {
    const cx = k * gw + gw / 2, cy = (bandY(0.74) + bandY(0.52)) / 2; x.fillStyle = gold;
    if (k % 2) { star(cx, cy, 46); x.fillStyle = '#f6d27a'; x.beginPath(); x.arc(cx, cy, 22, 0, 6.283); x.fill(); }
    else { x.font = 'italic bold 92px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LL', cx, cy); }
  }
  // the waist: a red band edged in gold, fleurs-de-lis along it
  band(0.46, 0.52, '#b4182a'); x.fillStyle = gold; x.fillRect(0, bandY(0.52), W, 9); x.fillRect(0, bandY(0.46) - 9, W, 9);
  const fleur = (cx, cy, r) => { x.beginPath(); x.moveTo(cx, cy - r); x.quadraticCurveTo(cx + r * 0.5, cy - r * 0.2, cx, cy + r * 0.3); x.quadraticCurveTo(cx - r * 0.5, cy - r * 0.2, cx, cy - r); x.fill();
    for (const d of [-1, 1]) { x.beginPath(); x.moveTo(cx, cy + r * 0.1); x.quadraticCurveTo(cx + d * r, cy - r * 0.6, cx + d * r * 0.8, cy + r * 0.5); x.quadraticCurveTo(cx + d * r * 0.4, cy + r * 0.2, cx, cy + r * 0.3); x.fill(); }
    x.fillRect(cx - r * 0.6, cy + r * 0.3, r * 1.2, r * 0.18); };
  for (let k = 0; k < G * 2; k++) fleur(k * gw / 2 + gw / 4, (bandY(0.52) + bandY(0.46)) / 2, 20);
  // the skirt: gold garlands swagged from gore to gore, eagles low down
  x.strokeStyle = gold; x.lineWidth = 12;
  for (let k = 0; k < G; k++) { x.beginPath(); x.moveTo(k * gw, bandY(0.42)); x.quadraticCurveTo(k * gw + gw / 2, bandY(0.32), (k + 1) * gw, bandY(0.42)); x.stroke(); }
  for (let k = 0; k < G; k++) { const cx = k * gw + gw / 2, cy = bandY(0.2); x.fillStyle = gold; x.beginPath(); x.moveTo(cx, cy - 26); x.lineTo(cx - 44, cy - 6); x.lineTo(cx - 12, cy + 4); x.lineTo(cx, cy + 30); x.lineTo(cx + 12, cy + 4); x.lineTo(cx + 44, cy - 6); x.closePath(); x.fill(); }
  // the neck's band, and the gores' seams
  band(0, 0.08, gold2); x.fillStyle = gold; for (let k = 0; k <= G; k++) x.fillRect(k * gw - 3, 0, 6, H);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function montgolfier(ctx) {
  const g = new THREE.Group();
  // the balloon: 22 m across, its top at 54.9 m; the profile (radius, height) of the Reveillon's shape
  const prof = [[3.6, 33], [4.3, 34.6], [6.2, 37], [8.3, 39.6], [9.8, 42], [10.7, 44.2], [10.98, 45.6], [10.6, 48.4], [9.4, 51], [7.2, 53.1], [4.2, 54.4], [0.01, 54.9]];
  const pts = prof.map(([r, y]) => new THREE.Vector2(r, y));
  const tex = montgolfierTexture();
  const skin = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.55, roughness: 0.75, side: THREE.DoubleSide });
  g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 64), skin));
  // its neon: gold tubes down the 16 seams and round the bands
  const neon = glow(0xffcf5a, 3.2), tubes = [], curve = new THREE.CatmullRomCurve3(prof.map(([r, y]) => new THREE.Vector3(r * 1.006, y, 0)));
  for (let k = 0; k < 16; k++) { const tg = new THREE.TubeGeometry(curve, 48, 0.09, 5, false); tg.rotateY((k / 16) * Math.PI * 2); tubes.push(tg); }
  for (const v of [0.08, 0.46, 0.52, 0.76, 0.84]) {   // (the band edges, at the profile's height for that fraction)
    const i = v * (prof.length - 1), i0 = Math.floor(i), f = i - i0, r = prof[i0][0] + (prof[Math.min(prof.length - 1, i0 + 1)][0] - prof[i0][0]) * f, y = prof[i0][1] + (prof[Math.min(prof.length - 1, i0 + 1)][1] - prof[i0][1]) * f;
    const tg = new THREE.TorusGeometry(r * 1.008, 0.1, 5, 64); tg.rotateX(Math.PI / 2); tg.translate(0, y, 0); tubes.push(tg);
  }
  g.add(new THREE.Mesh(mergeGeometries(tubes.map((t) => t.toNonIndexed())), neon));
  // the neck's ring and the rigging down to the gondola
  { const ring = new THREE.TorusGeometry(3.7, 0.25, 6, 32); ring.rotateX(Math.PI / 2); ring.translate(0, 33, 0); g.add(new THREE.Mesh(ring, std(0xc9a040, { metalness: 0.6, roughness: 0.4 }))); }
  const rope = std(0xd8c49a, { roughness: 0.8 });
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, top = new THREE.Vector3(Math.cos(a) * 3.6, 33, Math.sin(a) * 3.6), bot = new THREE.Vector3(Math.cos(a) * 6.4, 31.2, Math.sin(a) * 6.4); g.add(strut(bot, top, 0.07, rope)); }
  // the gondola: the digital sign, a screen on each of its four sides between gilded rails, on the space-frame floor
  const GW = 13, G0 = 24.6, G1 = 31.2, gilt = std(0xc9a040, { metalness: 0.7, roughness: 0.35, emissive: 0x3a2808, emissiveIntensity: 0.6 });
  g.add(box(GW + 0.8, 0.7, GW + 0.8, gilt, 0, G0 - 0.7)); g.add(box(GW + 0.8, 0.6, GW + 0.8, gilt, 0, G1));
  g.add(box(GW - 0.4, G1 - G0, GW - 0.4, std(0x1a1c24), 0, G0));
  const marquee = new THREE.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d');
    const bg = x.createLinearGradient(0, 0, 0, 512); bg.addColorStop(0, '#0d1236'); bg.addColorStop(1, '#1d2a6e'); x.fillStyle = bg; x.fillRect(0, 0, 1024, 512);
    x.strokeStyle = '#e8b84a'; x.lineWidth = 14; x.strokeRect(14, 14, 996, 484); x.lineWidth = 4; x.strokeRect(34, 34, 956, 444);
    x.fillStyle = '#ffffff'; x.font = 'italic 700 230px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Paris', 512, 220);
    x.fillStyle = '#e8b84a'; x.font = '700 64px Georgia, serif'; x.fillText('L A S   V E G A S', 512, 400);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })() });
  for (let k = 0; k < 4; k++) {   // (the digital sign: the resort's name on each face)
    const a = k * Math.PI / 2, sc = new THREE.Mesh(new THREE.PlaneGeometry(GW - 1, G1 - G0 - 0.6), marquee);
    sc.position.set(Math.sin(a) * (GW / 2 - 0.15), (G0 + G1) / 2, Math.cos(a) * (GW / 2 - 0.15)); sc.rotation.y = a; g.add(sc);
  }
  // the space frame under it on its column, and the base on the plaza
  g.add(frustum(GW, GW * 0.55, 3.2, std(0x8a8f99, { metalness: 0.5, roughness: 0.5 }), G0 - 3.9));
  g.add(cyl(2.2, 2.8, G0 - 3.9 - 3.2, std(0xd9cdb4, { roughness: 0.7 }), 0, 3.2, 0, 16));
  g.add(box(11, 3.2, 11, std(0xcfc2a6, { roughness: 0.8 }), 0, 0)); g.add(box(11.4, 0.4, 11.4, glow(0xffd28a, 1.4), 0, 3.1));
  return g;
}

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
      out.add(place(montgolfier(ctx), fp.info.c, fp.info.angle || 0));
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
    anims, timeUniforms, geo, track, pit, claimed,
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
