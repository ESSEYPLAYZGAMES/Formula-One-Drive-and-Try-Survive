// Procedural F1 car, modelled on the 2026 cars (the Audi R26 blueprint: the slim nose sitting on the front wing's
// mainplane, the four-element front wing, the halo, the deep-undercut sidepods and the ramp down to the gearbox, the
// two-element rear wing on its pylons, the beam wing and the diffuser) at the dimensions the physics uses: a 3.6 m
// wheelbase, 2.0 m across the tyres, 720 mm tyres on 18 inch rims, a 0.97 m roll hoop. Forward = +x, y up, z to the
// right; the ground is y = 0, the body frame's origin sits CG_X behind the group's (the physics' centre of gravity).
//
// Detail by distance, the car's states (detail(cam, zoom): the distances scale with the lens, so a long lens brings
// the detail in with the car):
//   ULTRA  (< 14 m)  everything, and the cockpit's own: the steering wheel, its display, the driver's gloves
//   HIGH   (< 38 m)  every surface finely tessellated, and the fine work: wishbones, push / pull and track rods, drive
//                    shafts, brake ducts and their winglets, the floor's fences and edge wing, the diffuser's strakes, the
//                    sidepods' cooling louvres, the wing flaps' brackets and the endplates' strakes, the tyres' lettering
//   MED    (< 95 m)  the same parts coarsely tessellated, no fine work (the far states are baked from these)
//   FAR    (< 260 m) ONE baked vertex-coloured mesh and its blob shadow (2 draw calls), baked again when the car loses
//                    a wing or a wheel, is crumpled or changes tyres
//   MIN    (beyond)  a ~200-triangle silhouette and its shadow
// Every part's geometry is built once and shared by the whole field: a car only has its own paint (and its wheels'
// compound decals, number and helmet).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COMPOUNDS } from './Tyres.js';
import { helmetTexture } from '../world/HelmetDesigns.js';
import { TERRAIN } from '../world/Terrain.js';

const carbon = new THREE.MeshStandardMaterial({ color: 0x16171b, roughness: 0.34, metalness: 0.3 });
const carbonMatte = new THREE.MeshStandardMaterial({ color: 0x0e0f12, roughness: 0.85, metalness: 0.1 });
const metal = new THREE.MeshStandardMaterial({ color: 0xa4a9b1, roughness: 0.28, metalness: 0.9 });
const rubber = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0x2a2c31, roughness: 0.35, metalness: 0.85 });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }); shadowMat.userData.glow = false;
// (the blob shadow's soft edge: a rounded rectangle blurred out to the plane's edges)
if (typeof document !== 'undefined') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 128); x.filter = 'blur(10px)'; x.fillStyle = '#fff'; x.beginPath(); x.roundRect(30, 26, 196, 76, 30); x.fill();
  shadowMat.alphaMap = new THREE.CanvasTexture(c);
}
const visorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.12, metalness: 0.9 });
/** the car's states by distance from the camera (m, at the default lens) */
const D_ULTRA = 14, D_HIGH = 38, LOD_FAR = 95, LOD_MIN = 260;
let DEBRIS = null;
/** the scene's debris system (world/Debris.js): broken parts and shards are thrown into it */
export function setDebris(d) { DEBRIS = d; }
let FIRE = null, CHUNKS = null;
/** the fire / smoke particles (world/Fire.js) and the free halves of split cars (world/Chunks.js) */
export function setFire(f) { FIRE = f; }
export function setChunks(c) { CHUNKS = c; }
const SPLIT_X = -0.62;   // body frame: where a car tears in two - behind the survival cell, ahead of the engine
const _sv = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _m4b = new THREE.Matrix4();
/**
 * Cut a geometry by the plane x = X (its own frame): [front (x >= X), back] as two new non-indexed geometries, every
 * triangle that crosses the plane clipped along it (all attributes interpolated), so the tear is a clean edge.
 */
function cutGeometry(geo, X) {
  const g = geo.index ? geo.toNonIndexed() : geo, names = Object.keys(g.attributes), atts = names.map((n) => g.attributes[n]);
  const sizes = atts.map((a) => a.itemSize), stride = sizes.reduce((a, b) => a + b, 0), posOff = sizes.slice(0, names.indexOf('position')).reduce((a, b) => a + b, 0);
  const vert = (i) => { const v = new Float32Array(stride); let o = 0; atts.forEach((a, k) => { for (let j = 0; j < sizes[k]; j++) v[o + j] = a.array[i * sizes[k] + j]; o += sizes[k]; }); return v; };
  const lerp = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
  const F = [], B = [], n = g.attributes.position.count / 3;
  for (let t = 0; t < n; t++) {
    const V = [vert(t * 3), vert(t * 3 + 1), vert(t * 3 + 2)], d = V.map((v) => v[posOff] - X), inF = d.map((x) => x >= 0), nF = inF.filter(Boolean).length;
    if (nF === 3) { F.push(...V); continue; } if (nF === 0) { B.push(...V); continue; }
    const lone = inF.findIndex((f) => f === (nF === 1)), i1 = (lone + 1) % 3, i2 = (lone + 2) % 3;
    const Q1 = lerp(V[lone], V[i1], d[lone] / (d[lone] - d[i1])), Q2 = lerp(V[lone], V[i2], d[lone] / (d[lone] - d[i2]));
    const L = nF === 1 ? F : B, O = nF === 1 ? B : F;
    L.push(V[lone], Q1, Q2); O.push(Q1, V[i1], V[i2], Q1, V[i2], Q2);
  }
  const build = (list) => {
    const ng = new THREE.BufferGeometry(); let o = 0;
    atts.forEach((a, k) => { const sz = sizes[k], arr = new Float32Array(list.length * sz); list.forEach((v, j) => { for (let q = 0; q < sz; q++) arr[j * sz + q] = v[o + q]; }); ng.setAttribute(names[k], new THREE.BufferAttribute(arr, sz)); o += sz; });
    ng.computeBoundingSphere(); return ng;
  };
  return [F.length ? build(F) : null, B.length ? build(B) : null];
}
const _wp = new THREE.Vector3(), _gr = [0, 0];

// Real dimensions: 720 mm tyres on 18 inch rims, 305 mm wide at the front and 405 mm at the rear, 2.0 m over the
// tyres, 3.6 m wheelbase, 5.66 m long, 0.97 m tall, rear wing top at 0.95 m.
const TYRE_WF = 0.305, TYRE_WR = 0.405, HUB_ZF = 1.0 - TYRE_WF / 2, HUB_ZR = 1.0 - TYRE_WR / 2;
const FRONT_AXLE = 1.8, REAR_AXLE = -1.8, CG_X = 0.16, R_TYRE = 0.36, R_RIM = 0.2286, HUB_Y = 0.36;

// ---- the wrecked-tyre and bare-rim parts (a puncture coming apart): shared
const rimF = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WF + 0.02, 20); rimF.rotateX(Math.PI / 2);
const rimR = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WR + 0.02, 20); rimR.rotateX(Math.PI / 2);
const helmetGeo = new THREE.SphereGeometry(0.145, 28, 20), helmetFar = new THREE.SphereGeometry(0.145, 8, 5), visorBandGeo = new THREE.SphereGeometry(0.13, 16, 8, -0.75, 1.5, 1.15, 0.5);
const shadowGeo = new THREE.PlaneGeometry(5.6, 2.3); shadowGeo.rotateX(-Math.PI / 2); shadowGeo.translate(0, 0.01, 0);
const wheelMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0.3 });
// a wheel with its tyre gone: bare machined metal (a touch of its own light so it reads silver at night too)
const bareRimMat = new THREE.MeshStandardMaterial({ color: 0xe4e7ec, roughness: 0.3, metalness: 0.45, emissive: 0x50545b, emissiveIntensity: 0.55 });
// a tyre coming apart: the rim's flanges, the torn band of carcass left on it, a strip of tread hinged at one end
const flangeGeo = new THREE.TorusGeometry(0.232, 0.014, 6, 28);
const carcassGeo = new THREE.TorusGeometry(0.243, 0.028, 6, 24, Math.PI * 1.3);
const tatterGeo = new THREE.BoxGeometry(0.42, 0.02, 1); tatterGeo.translate(0.21, 0, 0);
// where the tread has peeled away: the carcass's cords showing through, a pale band on the tyre
const cordGeo = new THREE.TorusGeometry(0.352, 0.02, 4, 24, Math.PI * 0.8);
const cordMat = new THREE.MeshStandardMaterial({ color: 0x8a8074, roughness: 0.95 });
const farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.3 });   // the far and min states of every car
const swMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.2 });   // the steering wheel (plate, grips, gloves)
/** a copy of a geometry in one vertex colour (for merging differently coloured parts into one mesh) */
function painted(src, hex) {
  const g = src.index ? src.toNonIndexed() : src.clone(), c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
}
const SHARED_GEO = new Set([rimF, rimR, helmetGeo, helmetFar, visorBandGeo, shadowGeo, flangeGeo, carcassGeo, tatterGeo, cordGeo]);
const SHARED_MAT = new Set([carbon, carbonMatte, metal, rubber, rimMat, shadowMat, visorMat, wheelMat, farMat, bareRimMat, cordMat, swMat]);

// ---------------------------------------------------------------------------------------------------------------------
// Geometry tools
// ---------------------------------------------------------------------------------------------------------------------
const _ga = new THREE.Vector3(), _gb = new THREE.Vector3(), _gc = new THREE.Vector3(), _gn = new THREE.Vector3();
/**
 * A geometry from positions, uvs and triangles [a, b, c, ox, oy, oz]: each wound so that its face points along the hint
 * (ox, oy, oz) - outward - whichever way round it was listed. Smooth normals (shared vertices).
 */
function geoFrom(pos, uv, tris) {
  const idx = [];
  for (const [a, b, c, ox, oy, oz] of tris) {
    _ga.fromArray(pos, a * 3); _gb.fromArray(pos, b * 3).sub(_ga); _gc.fromArray(pos, c * 3).sub(_ga); _gn.crossVectors(_gb, _gc);
    if (_gn.x * ox + _gn.y * oy + _gn.z * oz < 0) idx.push(a, c, b); else idx.push(a, b, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
/** an indexed geometry's triangles turned to face away from axis(p) -> the nearest point on its axis (lathes, tubes) */
function faceOut(g, axis) {
  const p = g.attributes.position, ix = g.index.array, a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Vector3(), o = new THREE.Vector3();
  for (let t = 0; t < ix.length; t += 3) {
    a.fromBufferAttribute(p, ix[t]); b.fromBufferAttribute(p, ix[t + 1]); c.fromBufferAttribute(p, ix[t + 2]);
    m.copy(a).add(b).add(c).multiplyScalar(1 / 3); axis(m, o);
    n.subVectors(b, a).cross(c.sub(a)); if (n.dot(o.sub(m).negate()) < 0) { const k = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = k; }
  }
  g.index.needsUpdate = true; g.computeVertexNormals(); return g;
}
/** monotone cubic (Fritsch-Carlson) through (xs ascending, ys): smooth, and no overshoot at a step */
function pchip(xs, ys) {
  const n = xs.length, h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) { if (d[i - 1] * d[i] <= 0) m[i] = 0; else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); } }
  return (x) => {
    let i = 0; while (i < n - 2 && x > xs[i + 1]) i++;
    const t = Math.max(0, Math.min(1, (x - xs[i]) / h[i])), t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
  };
}
/**
 * Cross-sections along x from key sections { x, yb, yt, w, zc, nt, nb } (bottom, top, half width, centre, the
 * superellipse's exponents on the upper and lower halves), smoothly between them every `step` m (every key kept: a
 * step - the cockpit's edge - lands where it is drawn)
 */
function sections(keys, step) {
  const K = [...keys].sort((a, b) => a.x - b.x), xs = K.map((k) => k.x), F = {};
  for (const p of ['yb', 'yt', 'w', 'zc', 'nt', 'nb', 'sk', 'tp']) F[p] = pchip(xs, K.map((k) => k[p] ?? (p === 'zc' || p === 'sk' || p === 'tp' ? 0 : 2.4)));
  const at = (x) => { const yb = F.yb(x), yt = F.yt(x); return { x, yc: (yb + yt) / 2, ht: (yt - yb) / 2, hb: (yt - yb) / 2, w: F.w(x), zc: F.zc(x), nt: F.nt(x), nb: F.nb(x), sk: F.sk(x), tp: F.tp(x) }; };
  const out = [];
  for (let i = 0; i < K.length; i++) {
    out.push(at(K[i].x));
    if (i < K.length - 1) { const parts = Math.max(1, Math.ceil((K[i + 1].x - K[i].x) / step - 0.01)); for (let q = 1; q < parts; q++) out.push(at(K[i].x + (K[i + 1].x - K[i].x) * q / parts)); }
  }
  return out;
}
/**
 * A body lofted through cross-sections S (in order along x): a superellipse round each (zc, yc), w across, ht up and
 * hb down, exponent nt on the upper half and nb on the lower (2: an ellipse; higher: squarer, a crisp shoulder; under 2:
 * pointed), narrowed toward the top by tp (a fraction of w; negative: toward the bottom), its lower half drawn sideways
 * by sk at the bottom (a sidepod's undercut); `seg` points round; either end closed or open.
 */
function loft(S, seg, { cap0 = true, cap1 = true } = {}) {
  const pos = [], uv = [], tris = [], n = S.length;
  S.forEach((s, j) => {
    for (let k = 0; k < seg; k++) {
      const t = (k / seg) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), up = sn >= 0, e = 2 / (up ? s.nt : s.nb);
      const Y = Math.sign(sn) * Math.abs(sn) ** e;   // (-1 bottom .. 1 top: tp narrows the top, a negative tp the bottom)
      pos.push(s.x, s.yc + (up ? s.ht : s.hb) * Y, s.zc + s.w * (1 - (s.tp || 0) * Y) * Math.sign(c) * Math.abs(c) ** e + (up ? 0 : (s.sk || 0) * Math.abs(sn) ** e));
      uv.push(k / seg, j / (n - 1));
    }
  });
  const C = S.map((s) => [s.x, s.yc, s.zc]);
  for (let j = 0; j < n - 1; j++) for (let k = 0; k < seg; k++) {
    const a = j * seg + k, b = j * seg + (k + 1) % seg, c = a + seg, d = b + seg;
    const ox = (pos[a * 3] + pos[d * 3]) / 2 - (C[j][0] + C[j + 1][0]) / 2, oy = (pos[a * 3 + 1] + pos[d * 3 + 1]) / 2 - (C[j][1] + C[j + 1][1]) / 2, oz = (pos[a * 3 + 2] + pos[d * 3 + 2]) / 2 - (C[j][2] + C[j + 1][2]) / 2;
    tris.push([a, b, c, ox, oy, oz], [b, d, c, ox, oy, oz]);
  }
  const cap = (j, o) => { const ci = pos.length / 3; pos.push(...C[j]); uv.push(0.5, j ? 1 : 0); for (let k = 0; k < seg; k++) tris.push([ci, j * seg + k, j * seg + (k + 1) % seg, ...o]); };
  if (cap0) cap(0, [C[0][0] - C[1][0], C[0][1] - C[1][1], C[0][2] - C[1][2]]);
  if (cap1) cap(n - 1, [C[n - 1][0] - C[n - 2][0], C[n - 1][1] - C[n - 2][1], C[n - 1][2] - C[n - 2][2]]);
  return geoFrom(pos, uv, tris);
}
/**
 * A wing element: an aerofoil swept along z from z0 to z1 through `st` stations, f(z) -> { x, y (its leading edge), c
 * (chord), a (angle: the trailing edge raised by a radians) }; the section `np` points a side (cosine-spaced: the nose
 * round, the tail sharp), thickness t of the chord, camber m (negative: the suction side underneath - downforce).
 */
function wing(z0, z1, st, np, f, { t = 0.09, m = -0.05 } = {}) {
  const pos = [], uv = [], tris = [], ring = 2 * np, mid = [];
  for (let j = 0; j <= st; j++) {
    const z = z0 + (z1 - z0) * j / st, P = f(z), ca = Math.cos(P.a), sa = Math.sin(P.a);
    for (let k = 0; k < ring; k++) {
      const upper = k < np, i = upper ? np - k : k - np, u = (1 - Math.cos(Math.PI * i / np)) / 2;   // TE -> top -> LE -> bottom -> TE
      const yt = 5 * t * (0.2969 * Math.sqrt(u) - 0.126 * u - 0.3516 * u * u + 0.2843 * u ** 3 - 0.1036 * u ** 4), yc = m * 4 * u * (1 - u);
      const X = -u * P.c, Y = (yc + (upper ? yt : -yt)) * P.c;
      pos.push(P.x + X * ca + Y * sa, P.y - X * sa + Y * ca, z); uv.push(k / ring, j / st);
    }
    mid.push([P.x - 0.5 * P.c * ca, P.y + 0.5 * P.c * sa, z]);
  }
  // (every quad wound the same way round: the way that faces out at the top of the section at mid-chord - a thin
  //  section's chord line is no centre to test each quad against, near the trailing edge it lies alongside the surface)
  const k0 = np >> 1, a0 = k0, b0 = k0 + 1, c0 = a0 + ring;
  _ga.fromArray(pos, a0 * 3); _gb.fromArray(pos, b0 * 3).sub(_ga); _gc.fromArray(pos, c0 * 3).sub(_ga); _gn.crossVectors(_gb, _gc);
  const ref = [(pos[a0 * 3] + pos[b0 * 3]) / 2 - mid[0][0], (pos[a0 * 3 + 1] + pos[b0 * 3 + 1]) / 2 - mid[0][1], 0], keep = _gn.x * ref[0] + _gn.y * ref[1] >= 0;
  for (let j = 0; j < st; j++) for (let k = 0; k < ring; k++) {
    const a = j * ring + k, b = j * ring + (k + 1) % ring, c = a + ring, d = b + ring;
    _ga.fromArray(pos, a * 3); _gb.fromArray(pos, b * 3).sub(_ga); _gc.fromArray(pos, c * 3).sub(_ga); _gn.crossVectors(_gb, _gc);
    const o = keep ? [_gn.x, _gn.y, _gn.z] : [-_gn.x, -_gn.y, -_gn.z];
    tris.push([a, b, c, ...o], [b, d, c, ...o]);
  }
  for (const [j, sz] of [[0, Math.sign(z0 - z1)], [st, Math.sign(z1 - z0)]]) {
    const ci = pos.length / 3; pos.push(...mid[j]); uv.push(0.5, 0.5);
    for (let k = 0; k < ring; k++) tris.push([ci, j * ring + k, j * ring + (k + 1) % ring, 0, 0, sz]);
  }
  return geoFrom(pos, uv, tris);
}
/**
 * A rod from a to b (arrays), elliptical: rx across its run in the direction nearest the airflow (x), rz the other way -
 * the streamlined section of a wishbone; `seg` sides
 */
function rod(a, b, rx, rz = rx, seg = 8) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), ax = B.clone().sub(A), len = ax.length(); ax.normalize();
  const u = new THREE.Vector3(1, 0, 0).addScaledVector(ax, -ax.x); if (u.lengthSq() < 1e-6) u.set(0, 1, 0).addScaledVector(ax, -ax.y); u.normalize();
  const v = new THREE.Vector3().crossVectors(ax, u);
  const g = new THREE.CylinderGeometry(1, 1, 1, seg, 1, false); g.translate(0, 0.5, 0);
  g.applyMatrix4(new THREE.Matrix4().makeBasis(u.multiplyScalar(rx), ax.multiplyScalar(len), v.multiplyScalar(rz)).setPosition(A));
  return g;
}
/** a flat plate: the outline [[x, y], ...] (in the x-y plane), t thick, centred on z */
function plate(outline, t, z) {
  const s = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 4 }); g.translate(0, 0, z - t / 2); return g;
}
/** a plate lying flat: the outline [[x, z], ...] in plan, from y0 down by t */
function slab(outline, t, y0) {
  const s = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, z)));
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 4 }); g.rotateX(Math.PI / 2); g.translate(0, y0, 0);   // (shape y -> z, depth -> down)
  return g;
}
/** box geometry placed in car space (rotation about z first, then about x, then translation) */
function bxg(w, h, d, x, y, z, rz = 0, rx = 0) { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); if (rx) g.rotateX(rx); g.translate(x, y, z); return g; }
/** a tube along points (arrays) */
function tube(pts, r, segs, radial, closed = false) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), closed, 'centripetal'), segs, r, radial, closed); }
/** the livery's two tones: the team colour above a waterline, a deeper shade of it below (vertex colours, x the paint) */
function toned(g) {
  const p = g.attributes.position, n = p.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), y = p.getY(i), wl = x > 1.4 ? 0.3 - (Math.min(x, 3.1) - 1.4) * 0.07 : 0.3, k = Math.max(0, Math.min(1, (y - wl + 0.015) / 0.03));
    const v = 0.5 + 0.5 * k; a[i * 3] = a[i * 3 + 1] = a[i * 3 + 2] = v;
  }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
}
/** parts merged per material: { material key: [geometries] } -> { key: one geometry } (each its own non-indexed copy) */
function mergeSet(set) {
  const out = {};
  for (const [k, list] of Object.entries(set)) {
    if (!list.length) continue;
    const gs = list.map((g) => { let x = g.index ? g.toNonIndexed() : g; if (k === 'livery' && !x.attributes.color) x = toned(x); if (k !== 'livery' && x.attributes.color) x.deleteAttribute('color'); return x; });
    out[k] = mergeGeometries(gs); out[k].computeBoundingSphere(); SHARED_GEO.add(out[k]);
  }
  return out;
}
const mirror = (σ, list) => list.map(([x, y, z]) => [x, y, σ * z]);

// ---------------------------------------------------------------------------------------------------------------------
// The car's parts, at two tessellations (hi / lo): built once, shared by every car
// ---------------------------------------------------------------------------------------------------------------------
// the tub, nose and engine cover: the nose's tip on the mainplane, up to the cockpit's cowl, down between the cockpit's
// side walls to the driver's shoulders, up over the headrest into the engine cover and its ramp to the gearbox and the
// crash structure (rain light at its tip)
const BODY_KEYS = [
  { x: 3.04, yb: 0.12, yt: 0.165, w: 0.045, nt: 2.6, nb: 3 },
  { x: 2.9, yb: 0.11, yt: 0.195, w: 0.075, nt: 3.2, nb: 4.5 },
  { x: 2.6, yb: 0.115, yt: 0.245, w: 0.1, nt: 3.6, nb: 5, tp: 0.1 },
  { x: 2.2, yb: 0.13, yt: 0.315, w: 0.125, nt: 4, nb: 5, tp: 0.14 },
  { x: 1.8, yb: 0.14, yt: 0.395, w: 0.15, nt: 4.2, nb: 5, tp: 0.16 },
  { x: 1.35, yb: 0.12, yt: 0.49, w: 0.195, nt: 4.5, nb: 5, tp: 0.17 },
  { x: 1.0, yb: 0.1, yt: 0.57, w: 0.235, nt: 4.5, nb: 5, tp: 0.17 },
  { x: 0.82, yb: 0.09, yt: 0.61, w: 0.255, nt: 4.5, nb: 5, tp: 0.17 },
  { x: 0.77, yb: 0.09, yt: 0.61, w: 0.26, nt: 4.5, nb: 5, tp: 0.17 },
  { x: 0.72, yb: 0.09, yt: 0.5, w: 0.265, nt: 4.5, nb: 5, tp: 0.12 },
  { x: 0.3, yb: 0.085, yt: 0.49, w: 0.27, nt: 4.5, nb: 5, tp: 0.12 },
  { x: -0.16, yb: 0.085, yt: 0.5, w: 0.27, nt: 4.5, nb: 5, tp: 0.12 },
  { x: -0.22, yb: 0.085, yt: 0.655, w: 0.265, nt: 4, nb: 5, tp: 0.2 },
  { x: -0.42, yb: 0.085, yt: 0.715, w: 0.245, nt: 3.4, nb: 5, tp: 0.38 },
  { x: -0.75, yb: 0.09, yt: 0.67, w: 0.22, nt: 3.2, nb: 5, tp: 0.42 },
  { x: -1.05, yb: 0.1, yt: 0.6, w: 0.19, nt: 3.2, nb: 4.5, tp: 0.42 },
  { x: -1.4, yb: 0.115, yt: 0.505, w: 0.15, nt: 3, nb: 4, tp: 0.38 },
  { x: -1.75, yb: 0.14, yt: 0.43, w: 0.11, nt: 3, nb: 3.5, tp: 0.3 },
  { x: -2.05, yb: 0.18, yt: 0.385, w: 0.08, nt: 2.8, nb: 3, tp: 0.2 },
  { x: -2.28, yb: 0.23, yt: 0.35, w: 0.055, nt: 2.6, nb: 2.6 },
  { x: -2.4, yb: 0.26, yt: 0.33, w: 0.03, nt: 2.4, nb: 2.4 },
];
// the airbox over the driver's head (the roll hoop inside it), its mouth open, running down into the engine cover's spine
const AIRBOX_KEYS = [
  { x: -0.05, yb: 0.79, yt: 0.955, w: 0.095, nt: 3, nb: 2.6, tp: 0.25 },
  { x: -0.18, yb: 0.75, yt: 0.975, w: 0.105, nt: 3, nb: 2.8, tp: 0.3 },
  { x: -0.42, yb: 0.7, yt: 0.945, w: 0.09, nt: 3, nb: 3, tp: 0.35 },
  { x: -0.75, yb: 0.64, yt: 0.83, w: 0.06, nt: 2.8, nb: 3, tp: 0.35 },
  { x: -1.05, yb: 0.58, yt: 0.71, w: 0.035, nt: 2.6, nb: 2.6, tp: 0.3 },
  { x: -1.15, yb: 0.56, yt: 0.655, w: 0.02, nt: 2.4, nb: 2.4 },
];
// a sidepod (σ the side): the letterbox inlet's lip, the flat top, the deep undercut below it (the lower half pointed
// and drawn in toward the tub), the downwash ramp, the tail
const sidepodKeys = (σ) => [
  { x: 0.95, yb: 0.42, yt: 0.555, w: 0.15, zc: σ * 0.52, nt: 5, nb: 3, tp: -0.1 },
  { x: 0.86, yb: 0.33, yt: 0.57, w: 0.215, zc: σ * 0.55, nt: 6, nb: 1.3, sk: -σ * 0.12, tp: -0.22 },
  { x: 0.55, yb: 0.27, yt: 0.56, w: 0.235, zc: σ * 0.545, nt: 6.5, nb: 1.2, sk: -σ * 0.15, tp: -0.25 },
  { x: 0.15, yb: 0.24, yt: 0.515, w: 0.215, zc: σ * 0.5, nt: 6.5, nb: 1.25, sk: -σ * 0.14, tp: -0.25 },
  { x: -0.3, yb: 0.2, yt: 0.44, w: 0.17, zc: σ * 0.43, nt: 6, nb: 1.4, sk: -σ * 0.1, tp: -0.2 },
  { x: -0.7, yb: 0.17, yt: 0.36, w: 0.12, zc: σ * 0.36, nt: 5, nb: 1.6, sk: -σ * 0.06, tp: -0.15 },
  { x: -1.1, yb: 0.14, yt: 0.29, w: 0.07, zc: σ * 0.29, nt: 4, nb: 2, sk: -σ * 0.02 },
  { x: -1.3, yb: 0.13, yt: 0.25, w: 0.04, zc: σ * 0.25, nt: 3, nb: 2.4 },
];
// a cockpit side wall, up to the rim (σ the side)
const wallKeys = (σ) => [
  { x: 0.8, yb: 0.42, yt: 0.615, w: 0.026, zc: σ * 0.236, nt: 2.6, nb: 4 },
  { x: 0.55, yb: 0.42, yt: 0.6, w: 0.032, zc: σ * 0.242, nt: 2.6, nb: 4 },
  { x: 0.15, yb: 0.42, yt: 0.6, w: 0.034, zc: σ * 0.245, nt: 2.6, nb: 4 },
  { x: -0.12, yb: 0.42, yt: 0.625, w: 0.032, zc: σ * 0.242, nt: 2.6, nb: 4 },
  { x: -0.24, yb: 0.42, yt: 0.655, w: 0.026, zc: σ * 0.236, nt: 2.6, nb: 4 },
];
// the floor in plan: its leading edge behind the front wheels, out to the edge wing, in again ahead of the rear wheels
const FLOOR_HALF = [[1.32, 0], [1.3, 0.2], [1.18, 0.42], [1.02, 0.62], [0.92, 0.76], [0.55, 0.8], [-0.85, 0.8], [-1.1, 0.76], [-1.3, 0.66], [-1.4, 0.56], [-1.45, 0.53], [-2.22, 0.53], [-2.25, 0]];
const FLOOR = [...FLOOR_HALF, ...FLOOR_HALF.slice(1, -1).reverse().map(([x, z]) => [x, -z])];

/** the static body, the wings, the halo and the wheels at one tessellation: 0 the near one, 1 the mid one, 2 the far
 *  bake's (never drawn as it is: baked into one mesh) */
function buildSet(level) {
  const hi = level === 0, Q = (a, b, c) => (level === 0 ? a : level === 1 ? b : c);
  const step = Q(0.045, 0.2, 0.42), seg = Q(36, 12, 8), st = Q(22, 5, 2), np = Q(9, 3, 2), rs = Q(8, 4, 3);
  const B = { livery: [], accent: [], carbon: [], matte: [], metal: [], visor: [] };   // the body (static), merged per material
  const Fn = { livery: [], accent: [], carbon: [], matte: [], metal: [] };            // the fine work (hi only)

  // ---- tub, nose, engine cover, airbox, sidepods, cockpit
  B.livery.push(loft(sections(BODY_KEYS, step), seg));   // (the tub: the most of every state's triangles)
  B.livery.push(loft(sections(AIRBOX_KEYS, step), Q(28, 10, 6), { cap0: false }));
  B.matte.push(loft(sections([{ x: -0.065, yb: 0.81, yt: 0.965, w: 0.1, nt: 2.6, nb: 2.2 }, { x: -0.09, yb: 0.81, yt: 0.965, w: 0.1, nt: 2.6, nb: 2.2 }], 1), hi ? 24 : 8));   // (the mouth: dark inside)
  for (const σ of [-1, 1]) {
    B.livery.push(loft(sections(sidepodKeys(σ), step * 1.4), Q(28, 10, 7), { cap0: false }));
    B.matte.push(loft(sections([{ x: 0.93, yb: 0.43, yt: 0.548, w: 0.135, zc: σ * 0.52, nt: 5, nb: 3 }, { x: 0.89, yb: 0.43, yt: 0.548, w: 0.135, zc: σ * 0.52, nt: 5, nb: 3 }], 1), hi ? 24 : 8));   // the inlet
    B.livery.push(loft(sections(wallKeys(σ), step * 2), hi ? 16 : 6));
    // mirrors: a flat teardrop housing on two short stalks off the sidepod's shoulder, the glass facing back
    B.livery.push(loft(sections([{ x: 0.86, yb: 0.672, yt: 0.678, w: 0.02, zc: σ * 0.6, nt: 3, nb: 3 }, { x: 0.79, yb: 0.656, yt: 0.694, w: 0.075, zc: σ * 0.6, nt: 4, nb: 4 }, { x: 0.735, yb: 0.656, yt: 0.694, w: 0.082, zc: σ * 0.6, nt: 6, nb: 6 }], hi ? 0.02 : 0.1), hi ? 16 : 6));
    B.visor.push(bxg(0.004, 0.032, 0.15, 0.732, 0.675, σ * 0.6));
    B.carbon.push(rod([0.8, 0.555, σ * 0.47], [0.775, 0.66, σ * 0.56], 0.018, 0.006, rs), rod([0.8, 0.55, σ * 0.62], [0.775, 0.655, σ * 0.645], 0.018, 0.006, rs));
    // the driver's headrest pads either side of the helmet
    B.matte.push(loft(sections([{ x: 0.0, yb: 0.48, yt: 0.62, w: 0.05, zc: σ * 0.16, nt: 3, nb: 3 }, { x: -0.22, yb: 0.48, yt: 0.65, w: 0.06, zc: σ * 0.16, nt: 3, nb: 3 }], hi ? 0.05 : 0.3), hi ? 14 : 6));
  }
  B.matte.push(loft(sections([{ x: 0.76, yb: 0.42, yt: 0.515, w: 0.215, nt: 3, nb: 3 }, { x: 0.3, yb: 0.42, yt: 0.515, w: 0.225, nt: 3, nb: 3 }, { x: -0.2, yb: 0.42, yt: 0.52, w: 0.215, nt: 3, nb: 3 }], hi ? 0.1 : 0.5), hi ? 20 : 8));   // the cockpit's padding
  B.matte.push(loft(sections([{ x: -0.1, yb: 0.48, yt: 0.62, w: 0.1, nt: 3, nb: 3 }, { x: -0.23, yb: 0.48, yt: 0.65, w: 0.1, nt: 3, nb: 3 }], 0.2), hi ? 14 : 6));   // the headrest behind
  // the driver: shoulders in the suit's colour, the HANS collar
  { const sh = new THREE.SphereGeometry(1, hi ? 18 : 8, hi ? 10 : 5); sh.scale(0.15, 0.06, 0.19); sh.translate(0.03, 0.525, 0); B.accent.push(sh); }
  B.matte.push(new THREE.CylinderGeometry(0.055, 0.075, 0.14, hi ? 14 : 6).translate(0.09, 0.595, 0));
  // the T-cam pod on the roll hoop, the shark fin, the nose's camera pods
  B.carbon.push(bxg(0.12, 0.035, 0.085, -0.34, 1.005, 0));
  B.livery.push(plate([[-0.78, 0.68], [-0.88, 0.75], [-1.2, 0.75], [-1.82, 0.57], [-1.9, 0.5], [-1.7, 0.43], [-1.0, 0.58]], 0.006, 0));
  for (const σ of [-1, 1]) B.carbon.push(loft(sections([{ x: 2.2, yb: 0.32, yt: 0.36, w: 0.016, zc: σ * 0.1 }, { x: 2.05, yb: 0.36, yt: 0.4, w: 0.018, zc: σ * 0.115 }], 0.15), hi ? 10 : 4));
  // ---- the floor, its edge wing, the diffuser
  B.carbon.push(slab(FLOOR, 0.025, 0.075));
  B.carbon.push(plate([[-1.42, 0.052], [-1.42, 0.078], [-1.8, 0.145], [-2.1, 0.245], [-2.27, 0.315], [-2.27, 0.29], [-2.1, 0.222], [-1.8, 0.122]], 1.04, 0));   // the diffuser's roof, the kick-up
  for (const z of [-0.52, 0.52]) B.carbon.push(plate([[-1.45, 0.05], [-2.27, 0.05], [-2.27, 0.31], [-1.8, 0.14], [-1.45, 0.076]], 0.012, z));   // its side walls
  // ---- the rear crash structure's exhaust, the rain light's housing
  B.metal.push(new THREE.CylinderGeometry(0.045, 0.05, 0.16, hi ? 16 : 6).rotateZ(Math.PI / 2).translate(-2.3, 0.42, 0));
  B.matte.push(new THREE.CylinderGeometry(0.032, 0.032, 0.02, hi ? 14 : 6).rotateZ(Math.PI / 2).translate(-2.385, 0.42, 0));
  // ---- the suspension: wishbones (both tessellations), the rods and shafts (fine)
  const susp = B.carbon, fine = hi ? Fn : null;
  for (const σ of [-1, 1]) {
    // front: double wishbones to the upright, the pushrod up to the chassis, the track rod; the brake duct's drum and scoop
    const ufF = [1.82, 0.52, σ * 0.68], lfF = [1.8, 0.19, σ * 0.71];
    susp.push(rod([2.05, 0.46, σ * 0.16], ufF, 0.035, 0.012, rs), rod([1.55, 0.5, σ * 0.2], ufF, 0.035, 0.012, rs));
    susp.push(rod([2.12, 0.21, σ * 0.13], lfF, 0.035, 0.012, rs), rod([1.48, 0.2, σ * 0.19], lfF, 0.035, 0.012, rs));
    B.carbon.push(new THREE.CylinderGeometry(0.15, 0.15, 0.1, hi ? 20 : 8).rotateX(Math.PI / 2).translate(1.8, HUB_Y, σ * 0.64));
    // rear: the same, the pullrod down to the gearbox, the toe link; the drive shaft; the duct's drum
    const urR = [-1.78, 0.54, σ * 0.57], lrR = [-1.8, 0.17, σ * 0.59];
    susp.push(rod([-1.45, 0.47, σ * 0.2], urR, 0.035, 0.012, rs), rod([-1.98, 0.48, σ * 0.12], urR, 0.035, 0.012, rs));
    susp.push(rod([-1.4, 0.18, σ * 0.22], lrR, 0.035, 0.012, rs), rod([-2.05, 0.2, σ * 0.11], lrR, 0.035, 0.012, rs));
    B.carbon.push(new THREE.CylinderGeometry(0.16, 0.16, 0.11, hi ? 20 : 8).rotateX(Math.PI / 2).translate(-1.8, HUB_Y, σ * 0.54));
    if (fine) {
      fine.carbon.push(rod([1.78, 0.21, σ * 0.66], [1.64, 0.5, σ * 0.19], 0.02, 0.011, rs), rod([1.72, 0.32, σ * 0.17], [1.74, 0.33, σ * 0.68], 0.016, 0.009, rs));
      fine.carbon.push(rod([-1.78, 0.52, σ * 0.55], [-1.7, 0.22, σ * 0.16], 0.02, 0.011, rs), rod([-1.98, 0.34, σ * 0.12], [-1.92, 0.35, σ * 0.57], 0.016, 0.009, rs));
      fine.metal.push(rod([-1.8, 0.33, σ * 0.11], [-1.8, 0.36, σ * 0.5], 0.028, 0.028, 12));
      fine.matte.push(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16).rotateX(Math.PI / 2).translate(1.94, 0.3, σ * 0.62));   // the duct's scoop mouth
      fine.carbon.push(bxg(0.14, 0.11, 0.08, 1.93, 0.3, σ * 0.62));
      // the brake ducts' winglets, the rear ones stacked
      fine.carbon.push(wing(σ * 0.5, σ * 0.62, 3, 4, () => ({ x: 1.95, y: 0.53, c: 0.16, a: 0.25 }), { t: 0.08, m: -0.04 }));
      for (const [y, a] of [[0.56, 0.2], [0.61, 0.35]]) fine.carbon.push(wing(σ * 0.48, σ * 0.6, 3, 4, () => ({ x: -1.62, y, c: 0.3, a }), { t: 0.07, m: -0.05 }));
      // the floor's fences under its leading edge, its edge wing, the sidepods' cooling louvres, the airbox's divider
      for (const z of [0.22, 0.34, 0.46, 0.58]) fine.carbon.push(plate([[1.27, 0.075], [1.27, 0.03], [1.0, 0.012], [0.7, 0.012], [0.7, 0.05]], 0.01, σ * z));
      fine.carbon.push(plate([[0.85, 0.075], [0.85, 0.105], [-0.85, 0.12], [-0.85, 0.075]], 0.012, σ * 0.795), bxg(1.7, 0.008, 0.05, 0.0, 0.118, σ * 0.815));
      for (let k = 0; k < 5; k++) fine.matte.push(bxg(0.22, 0.012, 0.014, -0.45 - k * 0.08, 0.466 - k * 0.018, σ * (0.38 - k * 0.012), 0, 0));
      // the diffuser's strakes
      for (const z of [0.18, 0.36]) fine.carbon.push(plate([[-1.5, 0.05], [-2.25, 0.05], [-2.25, 0.29], [-1.8, 0.13], [-1.5, 0.08]], 0.008, σ * z));
    }
  }
  if (fine) {
    fine.carbon.push(plate([[-1.5, 0.05], [-2.25, 0.05], [-2.25, 0.29], [-1.8, 0.13], [-1.5, 0.08]], 0.008, 0));
    fine.carbon.push(bxg(0.06, 0.13, 0.008, -0.11, 0.885, 0));   // the airbox mouth's divider
    // the cockpit rim's padding along the side walls' tops
    for (const σ of [-1, 1]) fine.matte.push(tube([[0.78, 0.612, σ * 0.218], [0.4, 0.598, σ * 0.224], [0.0, 0.6, σ * 0.226], [-0.22, 0.65, σ * 0.218]], 0.016, 16, 6));
  }

  // ---- front wing: the mainplane under the nose (its neutral centre raised), three flaps a side curving up toward the
  //      endplates (the top one in the accent colour), the flap adjusters' brackets
  const FW = { carbon: [], accent: [] }, FWfine = { carbon: [] };
  FW.carbon.push(wing(-0.94, 0.94, Q(30, 6, 3), np, (z) => { const u = Math.abs(z) / 0.94, c = Math.max(0, Math.min(1, (0.3 - Math.abs(z)) / 0.12)); return { x: 3.07 - 0.03 * u * u, y: 0.08 + 0.03 * c * c * (3 - 2 * c), c: 0.4 - 0.04 * u, a: 0.1 }; }, { t: 0.065, m: -0.05 }));
  const flap = (σ, x0, y0, dy, c, a) => wing(σ * 0.2, σ * 0.935, st, np, (z) => { const u = (Math.abs(z) - 0.2) / 0.735; return { x: x0 - 0.02 * u, y: y0 + dy * u * u, c, a: a + 0.08 * u }; }, { t: 0.06, m: -0.06 });
  for (const σ of [-1, 1]) {
    FW.carbon.push(flap(σ, 2.8, 0.13, 0.04, 0.2, 0.26), flap(σ, 2.66, 0.185, 0.05, 0.15, 0.42));
    FW.accent.push(flap(σ, 2.55, 0.235, 0.06, 0.11, 0.6));
    if (hi) for (const z of [0.42, 0.68]) FWfine.carbon.push(plate([[2.82, 0.115], [2.5, 0.27], [2.47, 0.31], [2.51, 0.32], [2.86, 0.13]], 0.006, σ * z));
  }
  // an endplate (σ: +1 the left mesh, fwL; -1 fwR), about its own centre (it droops and comes off on its own): the plate
  // in the team's colour, its footplate and the canard outboard in carbon
  const EP = (σ) => ({
    livery: [plate([[0.31, -0.05], [0.32, 0.03], [0.22, 0.12], [0.0, 0.16], [-0.22, 0.19], [-0.32, 0.17], [-0.33, -0.04], [-0.1, -0.065]], 0.012, 0)],
    carbon: [bxg(0.58, 0.012, 0.09, 0, -0.062, -σ * 0.04), wing(σ * 0.008, σ * 0.07, 2, hi ? 5 : 3, () => ({ x: 0.2, y: 0.11, c: 0.13, a: 0.3 }), { t: 0.08, m: -0.05 })],
  });
  // ---- rear wing: the mainplane (a spoon: lower in the middle) on its pylons, the endplates in the team's colour with
  //      their strakes and the rain-light strips, the beam wing's two elements; the DRS flap about its own pivot
  const RW = { carbon: [], livery: [] }, RWfine = { carbon: [], matte: [] };
  RW.carbon.push(wing(-0.505, 0.505, Q(26, 6, 3), np, (z) => ({ x: -2.17 + 0.02 * (z / 0.5) ** 2, y: 0.735 + 0.025 * (z / 0.5) ** 2, c: 0.3, a: 0.22 }), { t: 0.075, m: -0.06 }));
  for (const σ of [-1, 1]) {
    // (carbon, swept back, with a cap in the team's colour along the top)
    RW.carbon.push(plate([[-2.14, 0.6], [-2.12, 0.79], [-2.2, 0.885], [-2.42, 0.935], [-2.6, 0.925], [-2.65, 0.85], [-2.6, 0.64], [-2.42, 0.56]], 0.01, σ * 0.525));
    RW.livery.push(tube([[-2.13, 0.79], [-2.2, 0.885], [-2.42, 0.935], [-2.6, 0.925], [-2.65, 0.85]], 0.011, hi ? 20 : 6, hi ? 6 : 3).scale(1, 1, 1).translate(0, 0, σ * 0.525));
    RW.carbon.push(plate([[-2.24, 0.34], [-2.36, 0.34], [-2.38, 0.6], [-2.33, 0.77], [-2.25, 0.77], [-2.28, 0.6]], 0.014, σ * 0.07));   // a pylon
    if (hi) for (let k = 0; k < 4; k++) RWfine.matte.push(bxg(0.075, 0.007, 0.02, -2.15 - k * 0.012, 0.86 + k * 0.022, σ * 0.534, -0.15));
  }
  RW.carbon.push(wing(-0.42, 0.42, st, np, () => ({ x: -2.08, y: 0.33, c: 0.13, a: 0.25 }), { t: 0.1, m: -0.06 }), wing(-0.42, 0.42, st, np, () => ({ x: -2.2, y: 0.37, c: 0.1, a: 0.5 }), { t: 0.1, m: -0.06 }));
  const DRS = { accent: [wing(-0.495, 0.495, hi ? 22 : 5, np, () => ({ x: 0, y: 0, c: 0.19, a: 0 }), { t: 0.07, m: -0.06 })] };
  // ---- the halo: the hoop from its rear mounts on the cockpit's side walls round the driver's head, the centre pillar
  //      down onto the chassis ahead of the cowl
  const hoop = [[-0.3, 0.635, -0.236], [-0.12, 0.78, -0.27], [0.12, 0.845, -0.265], [0.36, 0.865, -0.21], [0.52, 0.87, -0.11], [0.565, 0.87, 0], [0.52, 0.87, 0.11], [0.36, 0.865, 0.21], [0.12, 0.845, 0.265], [-0.12, 0.78, 0.27], [-0.3, 0.635, 0.236]];
  const HALO = { carbon: [tube(hoop, 0.036, Q(72, 20, 10), Q(10, 5, 3)), tube([[0.56, 0.869, 0], [0.7, 0.78, 0], [0.8, 0.62, 0]], 0.04, Q(14, 5, 2), Q(10, 5, 3))] };

  // ---- wheels: the tyre (its profile turned: the tread, the rounded shoulders, the sidewall bulging past the rim) and
  //      the rim's barrel and lip in one vertex-coloured mesh; the compound's decal ring on the outer sidewall
  const lathe = (pts, segs) => { const g = new THREE.LatheGeometry(pts.map(([r, z]) => new THREE.Vector2(r, z)), segs); g.rotateX(Math.PI / 2); return faceOut(g, (p, o) => o.set(0, 0, p.z)); };
  const wheel = (W) => {
    const h = W / 2, segs = Q(48, 18, 10);
    const prof = [[R_RIM + 0.004, -h + 0.02], [0.255, -h - 0.004], [0.295, -h - 0.007], [0.328, -h - 0.004], [0.345, -h + 0.008], [0.354, -h + 0.025], [0.359, -h + 0.05], [R_TYRE, -h + 0.08],
      [R_TYRE, h - 0.08], [0.359, h - 0.05], [0.354, h - 0.025], [0.345, h - 0.008], [0.328, h + 0.004], [0.295, h + 0.007], [0.255, h + 0.004], [R_RIM + 0.004, h - 0.02]];
    const tyre = painted(lathe(hi ? prof : level === 1 ? prof.filter((_, i) => i % 2 === 0 || i === prof.length - 1) : [prof[0], prof[5], prof[7], prof[8], prof[10], prof[15]], segs), 0x151515);
    if (level === 2) return tyre;   // (the far bake: the tyre alone, the face covers the rim)
    const barrel = painted(new THREE.CylinderGeometry(R_RIM - 0.002, R_RIM - 0.002, W - 0.03, segs, 1, true).rotateX(Math.PI / 2), 0x24262b);
    const parts = [tyre, barrel];
    for (const s of [-1, 1]) parts.push(painted(new THREE.TorusGeometry(R_RIM + 0.002, 0.011, hi ? 6 : 3, segs).translate(0, 0, s * (h - 0.012)), 0x3a3d44));
    return mergeGeometries(parts);
  };
  const decal = (W, s) => { const g = new THREE.RingGeometry(0.245, 0.345, hi ? 64 : 24, 1); if (s < 0) g.rotateY(Math.PI); g.translate(0, 0, s * (W / 2 + 0.0085)); return g; };
  const face = (W, s) => { const g = new THREE.CircleGeometry(R_RIM - 0.006, hi ? 40 : 16); if (s < 0) g.rotateY(Math.PI); g.translate(0, 0, s * (W / 2 - 0.035)); return g; };
  const stripe = (W, s) => painted(new THREE.TorusGeometry(0.33, 0.012, 3, 14).translate(0, 0, s * (W / 2 + 0.004)), 0xffffff);   // (the far bake's compound ring)
  const nut = (W, s) => new THREE.CylinderGeometry(0.035, 0.04, 0.05, hi ? 6 : 6).rotateX(Math.PI / 2).translate(0, 0, s * (W / 2 - 0.02));
  const out = {
    body: mergeSet(B), fine: hi ? mergeSet(Fn) : {}, fw: mergeSet(FW), fwFine: hi ? mergeSet(FWfine) : {}, epL: mergeSet(EP(1)), epR: mergeSet(EP(-1)),
    rw: mergeSet(RW), rwFine: hi ? mergeSet(RWfine) : {}, drs: mergeSet(DRS), halo: mergeSet(HALO),
    wheel: { F: wheel(TYRE_WF), R: wheel(TYRE_WR) },
    decal: { F: { [-1]: decal(TYRE_WF, -1), 1: decal(TYRE_WF, 1) }, R: { [-1]: decal(TYRE_WR, -1), 1: decal(TYRE_WR, 1) } },
    face: { F: { [-1]: face(TYRE_WF, -1), 1: face(TYRE_WF, 1) }, R: { [-1]: face(TYRE_WR, -1), 1: face(TYRE_WR, 1) } },
    stripe: { F: { [-1]: stripe(TYRE_WF, -1), 1: stripe(TYRE_WF, 1) }, R: { [-1]: stripe(TYRE_WR, -1), 1: stripe(TYRE_WR, 1) } },
    nut: { F: { [-1]: nut(TYRE_WF, -1), 1: nut(TYRE_WF, 1) }, R: { [-1]: nut(TYRE_WR, -1), 1: nut(TYRE_WR, 1) } },
  };
  for (const a of ['wheel']) for (const k of ['F', 'R']) SHARED_GEO.add(out[a][k]);
  for (const a of ['decal', 'face', 'stripe', 'nut']) for (const k of ['F', 'R']) for (const s of [-1, 1]) SHARED_GEO.add(out[a][k][s]);
  return out;
}
let LIB = null;
/** every part's geometry at both tessellations (built the first time a car is made) */
function library() { return LIB || (LIB = { hi: buildSet(0), lo: buildSet(1), far: buildSet(2) }); }

/**
 * The silhouette beyond LOD_MIN, ~200 triangles: the body, the sidepods, both wings (if the car still has them), the
 * wheels it still has. cols: { liv, acc, dark } (THREE.Color), has: { fw, rw, wheels: [4 booleans] }
 */
function minGeometry(cols, has) {
  const P = [];
  const push = (g, c) => P.push(painted(g, c.getHex ? c.getHex() : c));
  push(loft(sections([{ x: 3.0, yb: 0.12, yt: 0.2, w: 0.06 }, { x: 1.6, yb: 0.15, yt: 0.5, w: 0.2 }, { x: 0.6, yb: 0.09, yt: 0.62, w: 0.3 }, { x: -0.35, yb: 0.09, yt: 0.95, w: 0.2, nt: 3 }, { x: -1.2, yb: 0.1, yt: 0.6, w: 0.22 }, { x: -2.4, yb: 0.25, yt: 0.35, w: 0.04 }], 9), 6), cols.liv);
  push(bxg(1.9, 0.3, 1.1, -0.15, 0.38, 0), cols.liv);
  push(bxg(3.5, 0.03, 1.5, -0.45, 0.06, 0), cols.dark);
  if (has.fw) push(bxg(0.45, 0.06, 1.88, 2.8, 0.13, 0), cols.dark);
  if (has.rw) push(bxg(0.45, 0.12, 1.06, -2.35, 0.8, 0), cols.dark);
  [[FRONT_AXLE, HUB_ZF, TYRE_WF], [FRONT_AXLE, -HUB_ZF, TYRE_WF], [REAR_AXLE, -HUB_ZR, TYRE_WR], [REAR_AXLE, HUB_ZR, TYRE_WR]].forEach(([x, z, w], k) => {
    if (has.wheels[k]) push(new THREE.CylinderGeometry(R_TYRE, R_TYRE, w, 7).rotateX(Math.PI / 2).translate(x, HUB_Y, z), 0x141414);
  });
  const g = mergeGeometries(P.map((x) => { for (const k of Object.keys(x.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') x.deleteAttribute(k); return x; }));
  return g;
}

// ---------------------------------------------------------------------------------------------------------------------
// Textures
// ---------------------------------------------------------------------------------------------------------------------
let rimTex = null;
/** the wheel's face: ten machined spokes, a dark well between them, the centre-lock nut */
function rimTexture() {
  if (rimTex) return rimTex;
  const c = document.createElement('canvas'); c.width = c.height = 256; const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128); g.addColorStop(0, '#2b2e34'); g.addColorStop(1, '#101114'); ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5; ctx.save(); ctx.translate(128, 128); ctx.rotate(a);
    const sg = ctx.createLinearGradient(0, -9, 0, 9); sg.addColorStop(0, '#5d636d'); sg.addColorStop(0.5, '#b9bfc9'); sg.addColorStop(1, '#4a4f58');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(22, -7); ctx.lineTo(118, -12); ctx.lineTo(118, 12); ctx.lineTo(22, 7); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  ctx.strokeStyle = '#7d838d'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(128, 128, 122, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#9097a2'; ctx.beginPath(); ctx.arc(128, 128, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d3d7dd'; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.lineTo(128 + Math.cos(a) * 16, 128 + Math.sin(a) * 16); } ctx.closePath(); ctx.fill();
  rimTex = new THREE.CanvasTexture(c); rimTex.colorSpace = THREE.SRGBColorSpace; rimTex.anisotropy = 4; return rimTex;
}
let faceMat = null, faceBareMat = null;
/** the wheel face with no tyre round it: bright machined spokes */
function bareFaceTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = '#8c929b'; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#f4f6f8'; ctx.lineWidth = 10;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; ctx.beginPath(); ctx.moveTo(64 + Math.cos(a) * 14, 64 + Math.sin(a) * 14); ctx.lineTo(64 + Math.cos(a) * 60, 64 + Math.sin(a) * 60); ctx.stroke(); }
  ctx.strokeStyle = '#dfe2e7'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(64, 64, 59, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#f4f5f7'; ctx.beginPath(); ctx.arc(64, 64, 13, 0, Math.PI * 2); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const DECALS = {};
/**
 * The sidewall's decal for a compound (shared): the coloured band round it and PIRELLI / P ZERO in white, laid out in
 * the ring's own uv (RingGeometry: uv from x, y over the outer radius)
 */
function decalMat(compound) {
  if (DECALS[compound]) return DECALS[compound];
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), R = (r) => (r / 0.345) * (S / 2), C = S / 2;
  x.strokeStyle = COMPOUNDS[compound].color; x.lineWidth = R(0.016); x.beginPath(); x.arc(C, C, R(0.326), 0, Math.PI * 2); x.stroke();
  const arcText = (txt, r, a0, size) => {
    x.save(); x.translate(C, C); x.font = `italic 900 ${size}px Arial, sans-serif`; x.fillStyle = '#f2f2f2'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const w = [...txt].map((ch) => x.measureText(ch).width), tot = w.reduce((a, b) => a + b, 0), ang = tot / R(r);
    let a = a0 - ang / 2;
    [...txt].forEach((ch, i) => { const aa = a + w[i] / 2 / R(r); x.save(); x.rotate(aa); x.translate(0, -R(r)); x.fillText(ch, 0, 0); x.restore(); a += w[i] / R(r); });
    x.restore();
  };
  for (const a0 of [0, Math.PI]) { arcText('PIRELLI', 0.283, a0, R(0.04)); arcText('P ZERO', 0.283, a0 + Math.PI / 2, R(0.034)); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const m = new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.35, roughness: 0.6, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  SHARED_MAT.add(m); DECALS[compound] = m; return m;
}
/** the car's number, on a clear ground: the accent colour, edged in the team's */
function numberTexture(num, color, edge) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128; const ctx = c.getContext('2d');
  ctx.font = 'italic 900 88px "Segoe UI", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 8; ctx.strokeStyle = edge; ctx.strokeText(String(num), 64, 70); ctx.fillStyle = color; ctx.fillText(String(num), 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export class CarMesh {
  constructor(color, compound = 'SOFT', opts = {}) {
    const lib = library();
    this.group = new THREE.LOD(); this.group.userData.isCar = true;
    const body = new THREE.Group(); this.body = body;
    const col = new THREE.Color(color);
    const col2 = new THREE.Color(opts.color2 || col.clone().offsetHSL(0, -0.1, -0.3));
    const livery = new THREE.MeshStandardMaterial({ color: col, vertexColors: true, roughness: 0.42, metalness: 0.25, envMapIntensity: 0.8 });
    const accent = new THREE.MeshStandardMaterial({ color: col2, roughness: 0.42, metalness: 0.25 });
    this.livery = livery; this.accent = accent; this.compound = compound;
    const MAT = { livery, accent, carbon, matte: carbonMatte, metal, visor: visorMat };
    this.hi = []; this.lo = [];
    /** meshes of a set of merged parts ({ material key: geometry }) into parent, shown in state `lod` ('hi' / 'lo'; 'far':
     *  never drawn, what the far bake is made of - here so it is posed, and lost, with the part it belongs to) */
    const put = (parent, parts, lod) => { for (const [k, g] of Object.entries(parts)) { const m = new THREE.Mesh(g, MAT[k]); m.userData.lod = lod; m.userData.role = k; parent.add(m); if (lod === 'far') m.visible = false; else (lod === 'hi' ? this.hi : this.lo).push(m); } };
    const both = (parent, key) => { put(parent, lib.hi[key], 'hi'); put(parent, lib.lo[key], 'lo'); put(parent, lib.far[key], 'far'); };

    // ---- the static body: the tub, nose, engine cover, airbox, sidepods, floor, diffuser, suspension, driver (both
    //      tessellations), and the fine work
    both(body, 'body'); put(body, lib.hi.fine, 'hi');
    const tcamTab = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.022, 0.07).translate(-0.34, 1.033, 0), new THREE.MeshStandardMaterial({ color: opts.tcamColor || 0xffd400, roughness: 0.5 }));
    tcamTab.userData.role = 'tcam'; body.add(tcamTab);
    // (the driver's own helmet design if they have one - world/HelmetDesigns.js - else one colour; u = 0 turned to face forward)
    const hmap = opts.driver ? helmetTexture(opts.driver, { size: 512 }) : null;
    const helmet = new THREE.Mesh(helmetGeo, new THREE.MeshStandardMaterial(hmap ? { map: hmap, roughness: 0.22, metalness: 0.12 } : { color: new THREE.Color(opts.helmet || '#ffffff'), roughness: 0.25, metalness: 0.15 }));
    if (hmap) helmet.rotation.y = Math.PI;
    helmet.scale.setScalar(0.9); helmet.position.set(0.12, 0.735, 0); helmet.userData.role = 'helmet'; this._helmetCol = new THREE.Color(hmap ? '#e8e8e8' : (opts.helmet || '#ffffff'));
    body.add(helmet); this.helmet = helmet; helmet.userData.noBake = true;
    { const fh = new THREE.Mesh(helmetFar, helmet.material); fh.visible = false; fh.userData.lod = 'far'; fh.userData.role = 'helmet'; fh.position.copy(helmet.position); fh.scale.setScalar(0.9); body.add(fh); }   // (the far bake's helmet)
    { const v = new THREE.Mesh(visorBandGeo, visorMat); v.position.copy(helmet.position); v.userData.role = 'visor'; v.userData.lod = 'hi'; body.add(v); this.hi.push(v); }   // (the visor's dark band across the front of the helmet)
    // the halo (toggled with H)
    this.halo = new THREE.Group(); both(this.halo, 'halo'); body.add(this.halo);

    // ---- front wing (the endplates keep their own groups: damage visuals)
    this.frontWing = new THREE.Group();
    both(this.frontWing, 'fw'); put(this.frontWing, lib.hi.fwFine, 'hi');
    const endplate = (side) => { const g = new THREE.Group(), k = side > 0 ? 'epL' : 'epR'; put(g, lib.hi[k], 'hi'); put(g, lib.lo[k], 'lo'); put(g, lib.far[k], 'far'); g.position.set(2.77, 0.165, side * 0.955); return g; };
    this.fwL = endplate(1); this.fwR = endplate(-1); this.frontWing.add(this.fwL, this.fwR); body.add(this.frontWing);

    // ---- rear wing (the DRS flap turns about its leading edge), the rain lights (the crash structure's tip, the
    //      endplates' trailing edges: one material, brighter under braking or in the wet)
    this.rearWing = new THREE.Group();
    both(this.rearWing, 'rw'); put(this.rearWing, lib.hi.rwFine, 'hi');
    this.drs = new THREE.Group(); both(this.drs, 'drs'); this.drs.position.set(-2.43, 0.835, 0); this.drs.rotation.z = -0.6; this.rearWing.add(this.drs);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0x300000, emissive: 0xff1010, emissiveIntensity: 2 });
    this.rearLight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.12).translate(-2.41, 0.305, 0), lightMat); this.rearLight.userData.role = 'light'; body.add(this.rearLight);
    { const g = mergeGeometries([bxg(0.006, 0.12, 0.008, -2.64, 0.74, 0.525), bxg(0.006, 0.12, 0.008, -2.64, 0.74, -0.525)]); const m = new THREE.Mesh(g, lightMat); m.userData.role = 'light'; this.rearWing.add(m); }
    body.add(this.rearWing);

    // ---- race numbers: on the nose and both sides of the engine cover, one mesh
    if (opts.number != null) {
      const tex = numberTexture(opts.number, '#' + col2.getHexString(), '#' + col.clone().multiplyScalar(0.5).getHexString());
      const planes = [new THREE.PlaneGeometry(0.11, 0.11).rotateX(-Math.PI / 2).rotateY(-Math.PI / 2).translate(2.3, 0.301, 0)];
      for (const σ of [-1, 1]) { const p = new THREE.PlaneGeometry(0.2, 0.2); if (σ < 0) p.rotateY(Math.PI); p.rotateX(-σ * 0.5); p.translate(-0.98, 0.49, σ * 0.172); planes.push(p); }
      const dm = new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.4, roughness: 0.32, metalness: 0.3, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const dmesh = new THREE.Mesh(mergeGeometries(planes), dm); dmesh.userData.role = 'decal'; body.add(dmesh);
    }

    // the steering wheel in front of the driver (seen from the cockpit and through the visor): a carbon plate, its two
    // grips, the display lit, the driver's gloves on it; tilted back toward them, turning with the steering
    // (two meshes: the plate, grips and gloves vertex-coloured in one, the lit display and its buttons in the other)
    const swTilt = new THREE.Group(), sw = new THREE.Group(); swTilt.add(sw);
    const solid = [painted(new THREE.BoxGeometry(0.03, 0.12, 0.2), 0x17181c)], lit = [];
    for (const z of [-0.125, 0.125]) {
      solid.push(painted(new THREE.BoxGeometry(0.045, 0.12, 0.05).translate(0, -0.005, z), 0x0f1013));
      solid.push(painted(new THREE.BoxGeometry(0.08, 0.085, 0.07).translate(-0.025, 0.005, z * 1.02), opts.glove || col2));
    }
    lit.push(painted(new THREE.PlaneGeometry(0.085, 0.045).rotateY(-Math.PI / 2).translate(-0.017, 0.02, 0), 0x2bb6ff));
    for (const [y, z, c] of [[-0.035, -0.06, 0xff3b30], [-0.035, 0.06, 0x30d158], [0.045, -0.07, 0xffd60a], [0.045, 0.07, 0xffffff]]) lit.push(painted(new THREE.CylinderGeometry(0.008, 0.008, 0.01, 10).rotateZ(Math.PI / 2).translate(-0.017, y, z), c));
    sw.add(new THREE.Mesh(mergeGeometries(solid), swMat));
    this.wheelDisp = new THREE.MeshBasicMaterial({ vertexColors: true }); sw.add(new THREE.Mesh(mergeGeometries(lit), this.wheelDisp));
    swTilt.position.set(helmet.position.x + 0.4, 0.68, 0); swTilt.rotation.z = 0.25; body.add(swTilt); this.wheelSteer = sw;
    // (only ever seen from close by: not drawn beyond a few car lengths - see detail())
    this.details = [swTilt]; this._near = true; this._high = true; this._gy = 0; this._zoom = 1;
    body.position.x = CG_X;

    // ---- wheels (the hub steers, `spin` turns): the tyre and rim (one vertex-coloured mesh), the compound's decal on
    //      the outer sidewall, the spoked face and the wheel nut
    this.wheels = [];
    if (!faceMat) { faceMat = new THREE.MeshStandardMaterial({ map: rimTexture(), roughness: 0.38, metalness: 0.65 }); SHARED_MAT.add(faceMat); }
    for (const [x, z, front] of [[FRONT_AXLE, HUB_ZF, true], [FRONT_AXLE, -HUB_ZF, true], [REAR_AXLE, HUB_ZR, false], [REAR_AXLE, -HUB_ZR, false]]) {
      const hub = new THREE.Group(), spin = new THREE.Group(), tyre = new THREE.Group(), s = Math.sign(z), A = front ? 'F' : 'R';
      hub.position.set(x, HUB_Y, z); hub.add(spin); spin.add(tyre);
      const decals = [];
      for (const q of ['hi', 'lo']) {
        const L = lib[q], t = new THREE.Mesh(L.wheel[A], wheelMat), d = new THREE.Mesh(L.decal[A][s], decalMat(compound));
        t.userData.lod = d.userData.lod = q; t.userData.role = 'wheel'; d.userData.role = 'decal'; tyre.add(t, d); this[q].push(t, d); decals.push(d);
        if (q === 'hi') { const n = new THREE.Mesh(L.nut[A][s], metal); n.userData.lod = 'hi'; n.userData.role = 'metal'; spin.add(n); this.hi.push(n); }
      }
      const st = new THREE.Mesh(lib.lo.stripe[A][s], wheelMat); st.visible = false; st.userData.lod = 'far'; st.userData.role = 'stripe'; tyre.add(st);   // (only for the far bake: the compound's colour)
      const ft = new THREE.Mesh(lib.far.wheel[A], wheelMat); ft.visible = false; ft.userData.lod = 'far'; ft.userData.role = 'wheel'; tyre.add(ft);
      const face = new THREE.Mesh(lib.hi.face[A][s], faceMat); face.userData.role = 'face'; spin.add(face);
      body.add(hub);
      this.wheels.push({ hub, spin, mesh: tyre, face, decals, front, side: s, state: 0 });
    }
    for (const o of this.lo) o.visible = false;
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat); body.add(this.shadow);   // blob shadow
    this.spin = 0; this.lost = {}; this.mangled = false;

    // ---- the far states: one baked mesh each, and their own blob shadows
    this.far = new THREE.Group(); this.farMesh = new THREE.Mesh(new THREE.BufferGeometry(), farMat); this.shadowFar = new THREE.Mesh(shadowGeo, shadowMat); this.far.add(this.farMesh, this.shadowFar);
    this.min = new THREE.Group(); this.minMesh = new THREE.Mesh(new THREE.BufferGeometry(), farMat); this.shadowMin = new THREE.Mesh(shadowGeo, shadowMat); this.min.add(this.minMesh, this.shadowMin);
    this.group.addLevel(body, 0); this.group.addLevel(this.far, LOD_FAR); this.group.addLevel(this.min, LOD_MIN);
    this._sig = this._signature(); this._bake();
  }

  /**
   * The car's state by distance (cam: world position, on the flat plan - the camera is lifted onto the ground only for
   * the frame, main.js terrainLift; the car model already stands on it, so its height above the ground is what counts:
   * measured from its own, a car on the hill to Turn 1 lost its steering wheel). zoom: how much the lens magnifies
   * against the default (tan of half the default field of view over tan of half this one) - the distances scale by it.
   */
  detail(cam, zoom = 1) {
    const p = this.group.position, d = Math.sqrt((p.x - cam.x) ** 2 + (p.y - this._gy - cam.y) ** 2 + (p.z - cam.z) ** 2) / zoom;
    const near = d < D_ULTRA, high = d < D_HIGH;
    if (near !== this._near) { this._near = near; for (const o of this.details) o.visible = near; }
    if (high !== this._high) { this._high = high; for (const o of this.hi) o.visible = high; for (const o of this.lo) o.visible = !high; }
    if (zoom !== this._zoom) { this._zoom = zoom; for (const l of this.group.levels) l.distance = l.object === this.far ? LOD_FAR * zoom : l.object === this.min ? LOD_MIN * zoom : 0; }
    if (this._dirty && d > LOD_FAR * 0.6) this._bake();
  }

  /** what the far states show of the car: its wings, its wheels, crumpled or not, its compound (rebaked when it changes) */
  _signature() {
    let s = (this.frontWing.visible ? 1 : 0) | (this.fwL.visible ? 2 : 0) | (this.fwR.visible ? 4 : 0) | (this.rearWing.visible ? 8 : 0) | (this.mangled ? 16 : 0);
    this.wheels.forEach((w, k) => { if (!w.gone && w.hub.visible && w.mesh.visible) s |= 32 << k; });
    return `${s}|${this.compound}`;
  }
  /** bake the far states from the far set's parts as the car stands now (lost parts left out, its paint as it is now) */
  _bake() {
    this._dirty = false; if (!this.far && !this.min) return;
    this.group.updateMatrixWorld(true);
    const inv = _m4b.copy(this.group.matrixWorld).invert(), parts = [], cDark = new THREE.Color(0x17181c);
    const role = { livery: this.livery.color, accent: this.accent.color, carbon: cDark, matte: new THREE.Color(0x0e0f12), metal: new THREE.Color(0x8d939c), visor: new THREE.Color(0x0a0a10), light: new THREE.Color(0xff2020), face: new THREE.Color(0x2a2c31), wheel: new THREE.Color(1, 1, 1), helmet: this._helmetCol, tcam: this.body.children.find((o) => o.userData.role === 'tcam')?.material.color, stripe: new THREE.Color(COMPOUNDS[this.compound]?.color || '#ffffff') };
    const shown = (o) => { for (let q = o.parent; q && q !== this.body; q = q.parent) if (!q.visible) return false; return true; };
    const bodyLevel = this.body;
    bodyLevel.traverse((o) => {
      if (!o.isMesh || o === this.shadow) return;
      const lod = o.userData.lod, r = o.userData.role;
      if (lod === 'hi' || lod === 'lo' || o.userData.noBake || r === 'decal' || !r || !role[r] || !shown(o) || (lod == null && !o.visible)) return;
      let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); g.applyMatrix4(_m4.multiplyMatrices(inv, o.matrixWorld));
      for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') g.deleteAttribute(k);
      const c = role[r], n = g.attributes.position.count, vc = g.attributes.color, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { const m = vc && r !== 'stripe' ? [vc.getX(i), vc.getY(i), vc.getZ(i)] : null; a[i * 3] = m ? (r === 'wheel' ? m[0] : c.r * m[0]) : c.r; a[i * 3 + 1] = m ? (r === 'wheel' ? m[1] : c.g * m[1]) : c.g; a[i * 3 + 2] = m ? (r === 'wheel' ? m[2] : c.b * m[2]) : c.b; }
      g.setAttribute('color', new THREE.BufferAttribute(a, 3)); parts.push(g);
    });
    if (this.far) { this.farMesh.geometry.dispose(); this.farMesh.geometry = parts.length ? mergeGeometries(parts) : new THREE.BufferGeometry(); this.farMesh.geometry.computeBoundingSphere(); }
    if (this.min) {
      this.minMesh.geometry.dispose();
      this.minMesh.geometry = minGeometry({ liv: this.livery.color, acc: this.accent.color, dark: 0x17181c }, { fw: this.frontWing.visible, rw: this.rearWing.visible, wheels: this.wheels.map((w) => !w.gone && w.hub.visible) });
      this.minMesh.position.x = CG_X; this.minMesh.geometry.computeBoundingSphere();
    }
  }

  /** free this car's own geometries, materials and number texture (the module-level shared ones stay) */
  dispose() {
    this.group.traverse((o) => {
      if (!o.isMesh) return;
      if (!SHARED_GEO.has(o.geometry)) o.geometry.dispose();
      if (!SHARED_MAT.has(o.material)) { o.material.map?.dispose(); o.material.dispose(); }
    });
  }

  setCompound(c) {
    this.compound = c;
    for (const w of this.wheels) for (const d of w.decals) d.material = decalMat(c);
  }
  setHalo(v) { this.halo.visible = v; }   // (the far states keep it: at 95 m+ it is a few pixels)

  /** world position of one of this car's parts (last frame's transforms: one frame late is invisible) */
  _wpos(o) { return o.getWorldPosition(_wp); }
  _drop(kind, o, car, color, kick) {
    if (!DEBRIS) return; const p = this._wpos(o); const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel();
    DEBRIS.part(kind, p.x, Math.max(0.2, p.y), p.z, vx, vz, color, kick);
  }
  /** the big one: the bodywork crumples and is scorched (which parts come off is the physics' call: wheelK events, wing damage) */
  _mangle(car) {
    if (this.mangled) return; this.mangled = true;
    this.livery.color.multiplyScalar(0.62); this.accent.color.multiplyScalar(0.62);
    this.body.scale.set(0.96, 1, 1.03); this.body.rotation.x = (Math.random() - 0.5) * 0.08;   // crumpled, twisted tub (height kept: the physics' contact points are on it)
    this.halo.rotation.z = (Math.random() - 0.5) * 0.2;
    if (DEBRIS) { const [vx, vz] = car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 24, this.livery.color.getHex()); }
  }
  /**
   * The car torn in two (Car.splitApart): everything aft of SPLIT_X - the rear wing, the rear wheels, the back of the
   * tub and engine cover (the merged meshes are cut triangle by triangle) - moves into a group of its own that
   * world/Chunks.js flies as a rigid body; this mesh keeps the front half. The far states (a whole car) go.
   */
  split(car) {
    if (this.splitDone || !CHUNKS) return; this.splitDone = true;
    const body = this.body; this.group.updateMatrixWorld(true);
    // the half's centre (body frame) and the group that carries it
    const C = new THREE.Vector3((SPLIT_X - 2.9) / 2, 0.45, 0), root = new THREE.Group(); root.name = 'car-half';
    body.localToWorld(root.position.copy(C)); body.getWorldQuaternion(root.quaternion); root.updateMatrixWorld(true);
    const inv = _m4b.copy(root.matrixWorld).invert();
    const adopt = (o) => { o.updateMatrixWorld(true); _m4.multiplyMatrices(inv, o.matrixWorld); o.parent?.remove(o); _m4.decompose(o.position, o.quaternion, o.scale); root.add(o); };
    // whole parts
    adopt(this.rearWing); adopt(this.rearLight);
    for (const w of this.wheels) if (!w.front) { adopt(w.hub); w.gone = true; }
    // the merged static meshes, cut in two
    const cut = [];
    for (const o of body.children) if (o.isMesh && o !== this.helmet && o !== this.shadow && o.geometry.attributes.position) cut.push(o);
    for (const o of cut) {
      const [front, rear] = cutGeometry(o.geometry, (SPLIT_X - o.position.x) / (o.scale.x || 1));
      if (!rear) continue;
      const back = new THREE.Mesh(rear, o.material); back.position.copy(o.position); back.rotation.copy(o.rotation); back.scale.copy(o.scale); back.visible = o.visible; back.userData.ownGeo = true; back.userData.lod = o.userData.lod; body.add(back); adopt(back);
      const old = o.geometry; if (front) o.geometry = front; else o.visible = false; if (!SHARED_GEO.has(old) && old !== o.geometry) old.dispose();
      // (the half keeps the state it was in when it tore off - near enough to see it go, it is the detailed one)
      if (back.userData.lod === 'lo') back.visible = !this._high; else if (back.userData.lod === 'hi') back.visible = this._high;
    }
    root.traverse((m) => { if (m.isMesh && m.userData.ownGeo == null) m.userData.ownGeo = !SHARED_GEO.has(m.geometry); });
    // (no whole-car far states any more)
    for (const k of ['far', 'min']) { const o = this[k]; if (!o) continue; const L = this.group.levels, i = L.findIndex((l) => l.object === o); if (i >= 0) L.splice(i, 1); this.group.remove(o); o.traverse((m) => { if (m.isMesh && !SHARED_GEO.has(m.geometry)) m.geometry.dispose(); }); this[k] = null; }
    this.body.visible = true;
    // its motion: the car's, plus the tear (backwards and up) and a tumble
    const v = car.v ? car.v : [...car.worldVel().slice(0, 1), 0, car.worldVel()[1]], c = Math.cos(car.th), s = Math.sin(car.th), r = () => Math.random() - 0.5;
    this.half = root;   // (the rear half: its flight is remembered for the news replay, main.js)
    CHUNKS.add(root, [v[0] - c * 4, (v[1] || 0) + 2 + Math.random() * 3, v[2] - s * 4], [r() * 6, r() * 8, r() * 6], [1.15, 0.45, 0.85], 260);
    if (FIRE) FIRE.add((out) => { out.set(0.7, 0.2, 0).applyMatrix4(root.matrixWorld); return true; }, 'smoke', 0.9);
    if (DEBRIS) { const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 30, this.livery.color.getHex()); }
  }
  /** a fire / smoke source on this car (body frame point), alive while the car's mesh is */
  _source(kind, bx, by, k, car) {
    if (!FIRE) return; if (kind === 'fire') car._burned = true;   // (the news replays it: ui/NewsBroadcast.js)
    FIRE.add((out) => { if (!this.group.parent) return false; this.body.localToWorld(out.set(bx, by, 0)); return true; }, kind, k, () => car.speed < 1 || car.wreck);
  }
  /** the parts of a tyre coming apart, built the first time this wheel punctures (hidden until then) */
  _buildRuin(w) {
    const R = new THREE.Group(), width = w.front ? TYRE_WF : TYRE_WR, rnd = Math.random;
    const rim = new THREE.Group(); rim.add(new THREE.Mesh(w.front ? rimF : rimR, bareRimMat));
    for (const s of [-1, 1]) { const f = new THREE.Mesh(flangeGeo, bareRimMat); f.position.z = s * (width / 2 + 0.005); rim.add(f); }
    const carcass = new THREE.Mesh(carcassGeo, rubber); carcass.rotation.z = rnd() * 6.28; carcass.scale.z = 0.3 * width / 0.028;
    const tatters = [];
    // (each strip two pieces: the half still stuck to the tyre and a loose end that curls back and whips)
    for (let i = 0; i < 6; i++) {
      const pivot = new THREE.Group(), a = new THREE.Mesh(tatterGeo, rubber), joint = new THREE.Group(), b = new THREE.Mesh(tatterGeo, rubber);
      joint.add(b); pivot.add(a, joint);
      pivot.userData = { a: i * 1.05 + rnd() * 0.6, z: (rnd() - 0.5) * width * 0.5, len: 0.36 + rnd() * 0.4, wd: 0.08 + rnd() * 0.12, base: 0.05 + rnd() * 0.25, curl: -0.3 - rnd() * 0.7, f: 16 + rnd() * 14, ph: rnd() * 6.28, tw: (rnd() - 0.5) * 1.6, seg: [a, joint, b] };
      a.scale.z = b.scale.z = pivot.userData.wd; R.add(pivot); tatters.push(pivot);
    }
    const cords = [0, 1].map((j) => { const m = new THREE.Mesh(cordGeo, cordMat); m.rotation.z = j * 3.4 + rnd(); m.position.z = (rnd() - 0.5) * width * 0.3; m.scale.z = 0.28 * width / 0.02; R.add(m); return m; });
    R.add(rim, carcass); R.visible = false; R.userData = { rim, carcass, tatters, cords };
    w.hub.add(R); w.ruin = R;
    if (!faceBareMat) { faceBareMat = new THREE.MeshStandardMaterial({ map: bareFaceTexture(), roughness: 0.35, metalness: 0.3, emissive: 0xffffff, emissiveMap: bareFaceTexture(), emissiveIntensity: 0.22 }); SHARED_MAT.add(faceBareMat); }
  }
  /**
   * A punctured tyre, in stages as it comes apart (P: Failures' punctP, 0 -> 1 with the distance driven on it; -1 a
   * sound tyre): flat (to 0.35) - squashed at the bottom; delaminating (to 0.8) - the tread peeling off in strips that
   * flail as the wheel turns, the tyre sagging lower; coming off (to 1) - the tyre gone but for a torn band of carcass
   * and a few strips, the bare rim on the road; shredded (1) - the bare silver rim and the odd tatter.
   */
  _tyre(w, P, car, dt) {
    if (P < 0) {
      if (w.state) { w.state = 0; w.mesh.visible = true; w.face.material = faceMat; w.hub.scale.set(1, 1, 1); if (w.ruin) w.ruin.visible = false; }
      return;
    }
    if (!w.ruin) this._buildRuin(w);
    const R = w.ruin, U = R.userData, bare = P >= 0.8, st = P < 0.35 ? 1 : P < 0.8 ? 2 : P < 1 ? 3 : 4;
    if (st !== w.state) {
      w.state = st; w.mesh.visible = !bare; R.visible = st > 1; U.rim.visible = bare; U.carcass.visible = bare;
      U.cords[1].visible = st === 3;
      w.face.material = bare ? faceBareMat : faceMat;
    }
    const sq = bare ? 1 : P < 0.35 ? 0.82 : 0.82 - 0.08 * (P - 0.35) / 0.45;   // (a sagging tyre; a rim is round)
    if (w.hub.scale.y !== sq) w.hub.scale.set(1, sq, 1);
    if (!R.visible) return;
    R.rotation.z = -this.spin;
    U.cords[0].visible = st === 3 || (st === 2 && P > 0.42); if (st === 2) U.cords[1].visible = P > 0.62;
    // the strips of tread: more and more of them peel off; once it is down to the rim a few short ones are left
    const n = st === 2 ? 1 + Math.floor((P - 0.35) / 0.45 * 4.99) : st === 3 ? 6 : 3;
    const hinge = bare ? 0.25 : 0.335, fl = Math.min(1, car.speed / 40), tt = (this._tt = (this._tt || 0) + dt);
    U.tatters.forEach((o, i) => {
      o.visible = i < n; if (!o.visible) return;
      const u = o.userData, [a, joint, b] = u.seg;
      // thrown outward by the spin and whipped by the air (more the faster it goes), the loose end curling and
      // flailing on its own, a little twist
      const beta = u.base + fl * (0.4 + 0.3 * Math.sin(tt * u.f + u.ph)) + (Math.random() - 0.5) * 0.25 * fl;
      o.position.set(Math.cos(u.a) * hinge, Math.sin(u.a) * hinge, u.z);
      o.rotation.z = u.a + Math.PI / 2 - beta;
      const L = (st === 4 ? 0.5 : st === 3 ? 0.9 : 0.55 + 0.45 * (P - 0.35) / 0.45) * u.len / 2;   // (each piece)
      a.scale.x = b.scale.x = L / 0.42; joint.position.set(L, 0, 0);
      joint.rotation.z = u.curl * (1 - 0.5 * fl) + fl * 0.7 * Math.sin(tt * u.f * 1.7 + u.ph * 2) + (Math.random() - 0.5) * 0.4 * fl;
      a.rotation.x = u.tw; b.rotation.x = u.tw + Math.sin(tt * u.f * 0.6 + u.ph) * 0.4 * fl;
    });
  }

  /** wheel k (FL FR RL RR) torn off: it flies on as debris */
  _loseWheel(k, car) {
    const order = [[true, -1], [true, 1], [false, -1], [false, 1]][k];
    const w = this.wheels.find((x) => x.front === order[0] && x.side === order[1]) || this.wheels[k];
    if (!w || w.gone) return; this._drop('tyre', w.hub, car, 0x141414, 9); w.hub.visible = false; w.gone = true;
  }

  update(car, dt) {
    if (this.wheelSteer) { this.wheelSteer.rotation.x = -(car.steer || 0) * 1.5; this.wheelDisp.color.setHex(car.retired || car.wreck ? 0x08090b : 0xffffff); }   // (the steering wheel, turned by the driver; its display and lights dead with the car)
    // ---- debris from this car's impacts, and the parts it has lost
    if (car.events.length) {
      for (const e of car.events) {
        if (e.kind === 'mangle') this._mangle(car);
        else if (e.kind === 'split') this._splitNow = true;   // (done after this frame's pose is set: below)
        else if (e.kind === 'fire') this._source('fire', car.split ? SPLIT_X + 0.3 : -1.3, 0.55, e.sev, car);
        else if (e.kind === 'smoke') this._source('smoke', -2.0, 0.7, e.sev, car);
        else if (e.kind.startsWith('puncture')) { if (DEBRIS) for (let k = 0; k < 3; k++) DEBRIS.part('strip', e.x, 0.25, e.z, e.vx, e.vz, 0x0c0c0c, 2.5); if (FIRE) this._source('puff', 0, 0.2, 1, car); }
        else if (e.kind.startsWith('wheel')) this._loseWheel(+e.kind[5], car);
        else if (DEBRIS) DEBRIS.burst(e.x, e.z, e.vx, e.vz, Math.min(16, 2 + Math.round(e.sev * 16)), this.livery.color.getHex());
      }
      car.events.length = 0;
    }
    const L = this.lost, dm = car.dmg;
    if (dm.fwL >= 0.6 && !L.fwL) { L.fwL = true; this._drop('endplate', this.fwL, car, 0x16171b, 5); } else if (dm.fwL < 0.6) L.fwL = false;
    if (dm.fwR >= 0.6 && !L.fwR) { L.fwR = true; this._drop('endplate', this.fwR, car, 0x16171b, 5); } else if (dm.fwR < 0.6) L.fwR = false;
    const fwGone = dm.fwL > 0.95 && dm.fwR > 0.95;
    if (fwGone && !L.fw && this.frontWing.visible) { L.fw = true; this._drop('plate', this.frontWing, car, this.livery.color.getHex(), 5); } else if (!fwGone) L.fw = false;
    if (dm.rw >= 0.85 && !L.rw && this.rearWing.visible) { L.rw = true; this._drop('rearwing', this.rearWing, car, this.livery.color.getHex(), 5); } else if (dm.rw < 0.85) L.rw = false;

    // ---- pose: on the ground a yaw; airborne / wrecked the full attitude, turned about the body's centre
    if ((car.air || car.wreck) && car.q) {
      const q = car.q; this.group.quaternion.set(q[0], q[1], q[2], q[3]);
      _wp.set(0, 0.48, 0).applyQuaternion(this.group.quaternion);   // the body turns about its centre, 0.48 m above the mesh origin
      this._gy = TERRAIN.at(car.p[0], car.p[2]); this.group.position.set(car.p[0] - _wp.x, car.p[1] - _wp.y + this._gy, car.p[2] - _wp.z);
      this.shadow.visible = false; if (this.shadowFar) this.shadowFar.visible = false; if (this.shadowMin) this.shadowMin.visible = false;   // the blob shadow is a ground decal: not on a tumbling body
    } else {
      // the sprung body: heave, pitch (nose up = +z rotation in the mesh frame) and roll (left side up = +x)
      // (on a circuit that is not flat: on the ground under it, nose up the slope it is climbing and leaning with the
      //  camber across it - world/Terrain.js)
      let gy = 0, gp = 0, gr = 0;
      if (TERRAIN.on) { const g = TERRAIN.grad(car.x, car.z, _gr), c = Math.cos(car.th), s = Math.sin(car.th); gy = TERRAIN.at(car.x, car.z); gp = Math.atan(g[0] * c + g[1] * s); gr = Math.atan(g[0] * s - g[1] * c); }
      this.group.rotation.set(car.rl + gr, -car.th, car.pt + gp, 'YZX');
      this.group.position.set(car.x, car.hv + gy, car.z); this._gy = gy;
    }
    const dMax = Math.max(0.055, 0.38 * (1 - car.speed / 118));
    this.spin += car.vLong / R_TYRE * dt;
    const onGround = !car.air && !car.wreck, W = car.wh;
    for (const w of this.wheels) {
      if (w.gone) continue;
      if (w.front) w.hub.rotation.y = car.steer * dMax * 1.2;
      w.spin.rotation.z = -this.spin;
      // each wheel stays on the road under it (kerb, grass) while the body moves on its springs
      const k = (w.front ? 0 : 2) + (w.side < 0 ? 0 : 1), flat = car.punct === k;
      // a puncture: the tyre's state as it comes apart (_tyre), the wheel lower and lower on the road
      const P = flat ? (car.punctShred ? 1 : Math.min(0.999, car.punctP || 0)) : -1;
      this._tyre(w, P, car, dt);
      if (onGround) w.hub.position.y = HUB_Y + Math.max(-0.05, Math.min(0.1, W.def[k])) - (P < 0 ? 0 : P < 0.8 ? 0.07 + 0.03 * Math.max(0, (P - 0.35) / 0.45) : 0.115);
      // it throws strips of tread as it goes; once metal touches the road, sparks - by speed, and brightest from a
      // bare rim
      if (P >= 0 && car.speed > 6) {
        const p = this._wpos(w.hub), [vx, vz] = car.worldVel();
        const strips = P < 0.35 ? 0.5 : P < 0.8 ? 1.4 : P < 1 ? 0.9 : 0;   // a second
        if (DEBRIS && strips && Math.random() < dt * strips) DEBRIS.part('strip', p.x, 0.2, p.z, vx, vz, 0x0c0c0c, 2);
        const metal = W.surf[k] >= 2 ? 0 : P >= 1 ? 1 : P >= 0.8 ? 0.55 : P > 0.65 ? 0.12 : 0;   // (asphalt and kerbs: no sparks off grass or gravel)
        if (FIRE?.grind && metal) FIRE.grind(p.x, 0.02, p.z, vx, vz, car.speed, metal, dt, w);
      }
    }
    // the DRS flap: open (nearly flat) when the car's DRS is (RaceDirector / DRS.js), steep when shut
    const drsOpen = !!car.drs;
    this.drs.rotation.z += ((drsOpen ? -0.06 : -0.6) - this.drs.rotation.z) * Math.min(1, dt * 8);
    // damage visuals
    const d = car.dmg;
    this.fwL.visible = d.fwL < 0.6; this.fwR.visible = d.fwR < 0.6;
    this.fwL.rotation.x = d.fwL * 0.6; this.fwR.rotation.x = -d.fwR * 0.6;
    this.frontWing.visible = !(d.fwL > 0.95 && d.fwR > 0.95);
    this.rearWing.visible = d.rw < 0.85; this.rearWing.rotation.x = d.rw * 0.5;
    // a bent front wing droops on its damaged side, a broken wishbone leans its wheel
    this.frontWing.rotation.x = (d.fwR - d.fwL) * 0.12; this.frontWing.rotation.z = -Math.max(d.fwL, d.fwR) * 0.08;
    if (d.susp > 0.3) { const w = this.wheels[car.suspSide > 0 ? 0 : 1]; w.hub.rotation.z = d.susp * 0.35; }
    this.rearLight.material.emissiveIntensity = car.brake > 0.3 || car.wetness > 0.3 ? 3 : 0.8;
    // (a recovered wreck stays where the marshals set it down, for the rest of the race)
    if (this._splitNow) { this._splitNow = false; this.split(car); }
    this.group.visible = !(car.ghost > 0 && Math.floor(car.ghost * 8) % 2 === 0);
    // (the far states: baked again once what they show has changed - a lost wing or wheel, new tyres, a crumpled car)
    const sig = this._signature(); if (sig !== this._sig) { this._sig = sig; this._dirty = true; }
  }
}
