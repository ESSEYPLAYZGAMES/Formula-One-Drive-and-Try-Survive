// Damage on the car model (shared by every car, built once from vehicle/CarModel.js):
//
//  * crumpling: a car's dents (Car.crush: where, how big, how deep, which way, when) bend its bodywork in the vertex
//    shader - pushed in, folded across the push (the folds tilt the normals, so the light finds the creases) - and its
//    paint is scraped to the carbon underneath where it is crushed, cracked along the folds (dentWith). Every car
//    material has the code from the start, so the first dent compiles nothing.
//  * breaking: the bodywork's regions that come off (the nose, the suspension, the sidepods' panels, the engine cover,
//    the floor's edges, the mirrors, the crash structure, the rear wing's endplates) are index lists over the model's
//    own geometry - a car without some of them draws the same meshes with fewer triangles (partGeo), and a region that
//    comes off flies as pieces of itself, broken along triangle edges (fragments: jagged, never a clean cut).
//  * tearing in two: every body triangle is in front of or behind a ragged line across the car behind the survival
//    cell (TEAR): the halves are the triangles either side of it.
import * as THREE from 'three';
import { carModel } from './CarModel.js';

/** at most this many dents bend a car at once (its deepest) */
export const DENT_N = 12;

/**
 * The regions of the body (and the rear wing) that can come off, in the model's frame (x forward from the axles'
 * midpoint, y up from the ground, z to the right): [name, part, test (a triangle's centre; p: painted), centre, reach
 * (m: a dent this close to the centre works on it)]. First match wins.
 */
export const REGIONS = [
  ['nose', 'body', (x, y, z) => x > 2.0 && y > 0.18, [2.42, 0.3, 0], 0.55],
  ['armFL', 'body', (x, y, z, p) => x > 1.3 && x < 2.15 && z < -0.16 && !p && y > 0.08, [1.7, 0.35, -0.5], 0.5],
  ['armFR', 'body', (x, y, z, p) => x > 1.3 && x < 2.15 && z > 0.16 && !p && y > 0.08, [1.7, 0.35, 0.5], 0.5],
  ['armRL', 'body', (x, y, z, p) => x > -2.1 && x < -1.2 && z < -0.3 && y > 0.12 && y < 0.62 && !p, [-1.7, 0.35, -0.55], 0.5],
  ['armRR', 'body', (x, y, z, p) => x > -2.1 && x < -1.2 && z > 0.3 && y > 0.12 && y < 0.62 && !p, [-1.7, 0.35, 0.55], 0.5],
  ['podL', 'body', (x, y, z, p) => p && z < -0.36 && x > -1.0 && x < 0.95 && y < 0.78, [0.0, 0.45, -0.58], 0.65],
  ['podR', 'body', (x, y, z, p) => p && z > 0.36 && x > -1.0 && x < 0.95 && y < 0.78, [0.0, 0.45, 0.58], 0.65],
  ['cover', 'body', (x, y, z, p) => p && x < -0.55 && y > 0.66 && Math.abs(z) < 0.3, [-1.1, 0.82, 0], 0.6],
  ['floorL', 'body', (x, y, z, p) => !p && y < 0.16 && z < -0.52 && x > -1.3 && x < 1.3, [0, 0.08, -0.72], 0.65],
  ['floorR', 'body', (x, y, z, p) => !p && y < 0.16 && z > 0.52 && x > -1.3 && x < 1.3, [0, 0.08, 0.72], 0.65],
  ['mirL', 'body', (x, y, z) => x > 0 && x < 0.45 && z < -0.22 && z > -0.5 && y > 0.5 && y < 0.85, [0.25, 0.66, -0.36], 0.3],
  ['mirR', 'body', (x, y, z) => x > 0 && x < 0.45 && z > 0.22 && z < 0.5 && y > 0.5 && y < 0.85, [0.25, 0.66, 0.36], 0.3],
  ['crash', 'body', (x) => x < -2.05, [-2.3, 0.3, 0], 0.4],
  ['rwL', 'rw', (x, y, z) => z < -0.36, [-2.3, 0.75, -0.48], 0.4],
  ['rwR', 'rw', (x, y, z) => z > 0.36, [-2.3, 0.75, 0.48], 0.4],
];
/** region name -> its bit (a car's lost regions are a mask of them) */
export const REGION_BIT = Object.fromEntries(REGIONS.map((r, i) => [r[0], 1 << i]));
/** where a car tears in two (model frame): behind the survival cell, ahead of the engine - ragged, never straight */
export const TEAR_X = -0.62;
export const tearAt = (y, z) => TEAR_X + 0.09 * Math.sin(z * 17.3 + y * 9.1) + 0.06 * Math.sin(z * 31.7 - y * 23.3) + 0.045 * Math.sin(y * 41.0 + z * 7.0);

// ---- the shared data: per part, level and material, the triangles of every region on either side of the tear
let D = null;
const GEO = new Map();
const REG_PARTS = ['body', 'rw'];
/** (built once the model is loaded) */
function data() {
  if (D) return D;
  const M = carModel(); D = {};
  for (const part of REG_PARTS) {
    const pv = M.pivots[part] || [0, 0, 0], regs = REGIONS.map((r, i) => [i, r]).filter(([, r]) => r[1] === part);
    D[part] = M.geo[part].slice(0, 3).map((L) => {   // (the near levels: the far ones are merged, CarMesh.farGeometry)
      const out = {};
      for (const [mk, g] of Object.entries(L)) {
        const P = g.attributes.position.array, I = g.index.array, nt = I.length / 3, paint = mk === 'paint' || !!g.attributes.color;
        // (the medium level paints by vertex colour: its painted triangles are flagged in the alpha channel)
        const C = g.attributes.color?.array, painted = (a, b, c) => (C ? C[a * 4 + 3] > 200 && C[b * 4 + 3] > 200 && C[c * 4 + 3] > 200 : mk === 'paint');
        const groups = new Map();   // (region * 2 + half) -> triangle indices
        for (let t = 0; t < nt; t++) {
          const a = I[t * 3], b = I[t * 3 + 1], c = I[t * 3 + 2];
          const x = (P[a * 3] + P[b * 3] + P[c * 3]) / 3 + pv[0], y = (P[a * 3 + 1] + P[b * 3 + 1] + P[c * 3 + 1]) / 3 + pv[1], z = (P[a * 3 + 2] + P[b * 3 + 2] + P[c * 3 + 2]) / 3 + pv[2];
          let r = -1; for (const [i, R] of regs) if (R[2](x, y, z, paint && painted(a, b, c))) { r = i; break; }
          const half = part === 'rw' || x < tearAt(y, z) ? 1 : 0, k = (r + 1) * 2 + half;
          let arr = groups.get(k); if (!arr) groups.set(k, (arr = [])); arr.push(t);
        }
        out[mk] = { g, groups, big: g.index.array instanceof Uint32Array };
      }
      return out;
    });
  }
  return D;
}
/** does this part have regions (its geometry is drawn by partGeo)? */
export const hasRegions = (part) => REG_PARTS.includes(part);

/** a geometry over `src`'s own attributes (shared: uploaded once) with these triangles */
function subset(src, tris, big) {
  const I = src.index.array, out = big ? new Uint32Array(tris.length * 3) : new Uint16Array(tris.length * 3);
  for (let k = 0; k < tris.length; k++) { const t = tris[k]; out[k * 3] = I[t * 3]; out[k * 3 + 1] = I[t * 3 + 1]; out[k * 3 + 2] = I[t * 3 + 2]; }
  const g = new THREE.BufferGeometry();
  for (const [n, a] of Object.entries(src.attributes)) g.setAttribute(n, a);
  g.setIndex(new THREE.BufferAttribute(out, 1));
  g.boundingSphere = src.boundingSphere; g.boundingBox = src.boundingBox; g.userData.shared = true;
  return g;
}

/**
 * Part `part`'s geometry at level lv for material mk without the regions in `lost` (a mask), and of one half of a car
 * torn in two (half: 0 the whole car, 1 the front, 2 the back). Shared and cached: the whole part's is the model's own.
 */
export function partGeo(part, lv, mk, lost = 0, half = 0) {
  const M = carModel(), src = M.geo[part]?.[lv]?.[mk];
  if (!src || !hasRegions(part)) return src;
  const mine = REGIONS.reduce((m, r, i) => (r[1] === part ? m | (1 << i) : m), 0);
  lost &= mine; if (!lost && !half) return src;
  const key = `${part}|${lv}|${mk}|${lost}|${half}`;
  if (GEO.has(key)) return GEO.get(key);
  const E = data()[part][lv][mk], tris = [];
  for (const [k, arr] of E.groups) { const r = (k >> 1) - 1, h = k & 1; if (r >= 0 && lost & (1 << r)) continue; if (half && h !== half - 1) continue; for (const t of arr) tris.push(t); }
  const g = tris.length ? subset(E.g, tris, E.big) : null;
  GEO.set(key, g); return g;
}
/** the triangles of region r (all of it) at level lv for material mk: the piece that comes off */
export function regionGeo(r, lv, mk, frag = -1, nFrag = 1) {
  const part = REGIONS[r][1], E = data()[part][lv]?.[mk]; if (!E) return null;
  const key = `R${r}|${lv}|${mk}|${frag}|${nFrag}`;
  if (GEO.has(key)) return GEO.get(key);
  let tris = []; for (const h of [0, 1]) tris = tris.concat(E.groups.get((r + 1) * 2 + h) || []);
  if (frag >= 0 && nFrag > 1) {
    // (the seeds over the region's own extent, about its centre: its frame is its part's, about the part's pivot)
    const [, , , c, reach] = REGIONS[r], pv = carModel().pivots[part] || [0, 0, 0], h = reach * 0.8;
    tris = fragmentOf(E.g, tris, frag, nFrag, `R${r}|${lv}`, [c[0] - pv[0] - h, c[1] - pv[1] - h * 0.5, c[2] - pv[2] - h], [c[0] - pv[0] + h, c[1] - pv[1] + h * 0.5, c[2] - pv[2] + h]);
  }
  const g = tris.length ? subset(E.g, tris, E.big) : null;
  GEO.set(key, g); return g;
}
/** the whole of a part (a wing, the T-cam) broken into nFrag pieces: piece `frag`'s triangles for material mk */
export function fragGeo(part, lv, mk, frag, nFrag) {
  const src = carModel().geo[part]?.[lv]?.[mk]; if (!src) return null;
  const key = `F${part}|${lv}|${mk}|${frag}|${nFrag}`;
  if (GEO.has(key)) return GEO.get(key);
  const all = Array.from({ length: src.index.count / 3 }, (_, t) => t);
  // (the seeds over the whole part: every one of its materials)
  const bb = new THREE.Box3(); for (const g of Object.values(carModel().geo[part][lv])) { if (!g.boundingBox) g.computeBoundingBox(); bb.union(g.boundingBox); }
  const tris = nFrag > 1 ? fragmentOf(src, all, frag, nFrag, `F${part}|${lv}`, bb.min.toArray(), bb.max.toArray()) : all;
  const g = tris.length ? subset(src, tris, src.index.array instanceof Uint32Array) : null;
  GEO.set(key, g); return g;
}
/**
 * Piece `frag` of nFrag of a set of triangles: the cells of nFrag seed points spread over it (the farthest from the
 * ones before; seeded by the set's own name, so every car breaks the same part the same way and a replay matches) -
 * every triangle to its nearest seed, so the pieces part along the triangles' edges: ragged, like broken carbon.
 * (The seeds are shared by all of a part's materials: its paint and its carbon break along the same lines.)
 */
const SEEDS = new Map();
function fragmentOf(g, tris, frag, nFrag, name, mn, mx) {
  const P = g.attributes.position.array, I = g.index.array;
  const cen = (t) => { const a = I[t * 3] * 3, b = I[t * 3 + 1] * 3, c = I[t * 3 + 2] * 3; return [(P[a] + P[b] + P[c]) / 3, (P[a + 1] + P[b + 1] + P[c + 1]) / 3, (P[a + 2] + P[b + 2] + P[c + 2]) / 3]; };
  const key = name + '|' + nFrag;
  let S = SEEDS.get(key);
  if (!S) {
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
    const cand = Array.from({ length: 48 }, () => [mn[0] + rnd() * (mx[0] - mn[0]), mn[1] + rnd() * (mx[1] - mn[1]), mn[2] + rnd() * (mx[2] - mn[2])]);
    S = [cand[0]];
    while (S.length < nFrag) { let best = null, bd = -1; for (const c of cand) { const d = Math.min(...S.map((s) => (s[0] - c[0]) ** 2 + (s[1] - c[1]) ** 2 + (s[2] - c[2]) ** 2)); if (d > bd) { bd = d; best = c; } } S.push(best); }
    SEEDS.set(key, S);
  }
  return tris.filter((t) => {
    const c = cen(t); let bi = 0, bd = Infinity;
    for (let i = 0; i < S.length; i++) {
      // (a little wobble on the distance: the cells' borders zig-zag instead of running straight)
      const d = (S[i][0] - c[0]) ** 2 + (S[i][1] - c[1]) ** 2 + (S[i][2] - c[2]) ** 2 + 0.004 * Math.sin(c[0] * 37 + c[2] * 23 + i * 5) + 0.003 * Math.sin(c[1] * 41 - c[0] * 19 + i);
      if (d < bd) { bd = d; bi = i; }
    }
    return bi === frag;
  });
}
/** the centre (model frame) of a set of geometries placed at pivot pv: where its piece's own frame goes */
export function centreOf(geos, pv = [0, 0, 0]) {
  let x = 0, y = 0, z = 0, n = 0;
  for (const g of geos) {
    if (!g) continue; const P = g.attributes.position.array, I = g.index.array;
    for (let k = 0; k < I.length; k += 9) { const a = I[k] * 3; x += P[a]; y += P[a + 1]; z += P[a + 2]; n++; }   // (every third triangle's first corner: plenty)
  }
  return n ? [x / n + pv[0], y / n + pv[1], z / n + pv[2]] : [...pv];
}

/** build the region data now (at start-up, with the model: not at the first crash) */
export function prepareDamage() {
  data();
  // the pieces that come off, ready: every region's (and the wings') level-1 fragments
  const M = carModel();
  REGIONS.forEach((R, r) => { const L = M.geo[R[1]][1]; for (const mk of Object.keys(L)) for (let f = 0; f < 3; f++) regionGeo(r, 1, mk, f, 3); });
  for (const part of ['fw', 'fwL', 'fwR', 'rw', 'drs']) for (const mk of Object.keys(M.geo[part]?.[1] || {})) for (let f = 0; f < 3; f++) fragGeo(part, 1, mk, f, 3);
}

// ---- the crumple shader -----------------------------------------------------------------------------------------
/** a car's dent uniforms (shared by all of its materials): DENT_N dents (centre, radius; push, seed), how many */
export function dentUniforms() {
  return { uDentA: { value: new Float32Array(DENT_N * 4) }, uDentB: { value: new Float32Array(DENT_N * 4) }, uDentN: { value: 0 } };
}
/** the uniforms of the shared materials: no dents (a car that is hit gets its own copies: CarMesh._ownMats) */
export const NO_DENTS = dentUniforms();

const VERT_HEAD = `
#define DENT_N ${DENT_N}
uniform vec4 uDentA[DENT_N]; uniform vec4 uDentB[DENT_N]; uniform int uDentN; uniform vec3 uDentOff;
varying vec3 vDentP; varying float vDent;`;
// (after beginnormal_vertex: the displacement and the bent normal, in the model's frame - the part's own plus its
//  pivot. The push a, the profile f - flat-bottomed: the middle of the hit is crushed by the whole depth - and the
//  creases w: sharp ridged folds a few centimetres deep (never more than 2.5 cm, however deep the dent) across the push.
//  The surface moves by a f (1 + amp w); its normal tilts by the gradient: n - (a . n) grad(f (1 + amp w)))
const VERT_BODY = `
vec3 dentD = vec3(0.0); vDent = 0.0; vDentP = position + uDentOff;
if (uDentN > 0) {
  vec3 nG = vec3(0.0);
  for (int i = 0; i < DENT_N; i++) {
    if (i >= uDentN) break;
    vec4 A = uDentA[i], B = uDentB[i];
    vec3 q = vDentP - A.xyz; float R2 = A.w * A.w, r2 = dot(q, q);
    if (r2 >= R2) continue;
    float u = 1.0 - r2 / R2, f0 = 1.8 * u * u, f = min(1.0, f0);
    vec3 gf = f0 < 1.0 ? -7.2 * u * q / R2 : vec3(0.0);
    float dep = length(B.xyz), amp = min(0.35, 0.025 / max(dep, 1e-4));
    vec3 k1 = vec3(57.0, 23.0, 41.0), k2 = vec3(-37.0, 61.0, 19.0), k3 = vec3(97.0, -71.0, 83.0);
    float a1 = dot(q, k1) + B.w, a2 = dot(q, k2) + 2.3 * B.w, a3 = dot(q, k3) - 1.7 * B.w;
    float s1 = sin(a1), s2 = sin(a2), s3 = sin(a3);
    float w = 2.0 * abs(s1) * abs(s2) - 1.0 + 0.35 * (2.0 * abs(s3) - 1.0);
    vec3 gw = 2.0 * (sign(s1) * cos(a1) * abs(s2) * k1 + abs(s1) * sign(s2) * cos(a2) * k2) + 0.7 * sign(s3) * cos(a3) * k3;
    float g = f * (1.0 + amp * w);
    dentD += B.xyz * g;
    nG += (gf * (1.0 + amp * w) + f * amp * gw) * dot(B.xyz, objectNormal);
    vDent = max(vDent, f * dep / max(0.035, 0.3 * A.w));
  }
  objectNormal = normalize(objectNormal - nG);
}`;
const FRAG_HEAD = `
varying vec3 vDentP; varying float vDent;`;
// (before roughnessmap_fragment: crushed paint scraped to the dark carbon under it, cracks along the folds; matt)
const FRAG_BODY = `
float dentSc = 0.0;
if (vDent > 0.02) {
  vec3 Q = vDentP * 9.0;
  float cr = abs(sin(Q.x * 2.1 + sin(Q.z * 1.7) * 2.0) * sin(Q.y * 2.3 + sin(Q.x * 1.3) * 2.0) * sin(Q.z * 1.9 + sin(Q.y * 1.1) * 2.0));
  float crack = (1.0 - smoothstep(0.0, 0.1, cr)) * smoothstep(0.08, 0.45, vDent);
  dentSc = smoothstep(0.25, 0.95, vDent);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.028, 0.028, 0.032), clamp(dentSc * 0.8 + crack * 0.9, 0.0, 1.0));
}`;

/**
 * Give a material the crumple code (chained after whatever it injects already - the livery's). DU: the car's dent
 * uniforms (NO_DENTS for the shared ones); off: the part's pivot (its vertices are about it).
 */
export function dentWith(mat, DU, off = [0, 0, 0]) {
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey;
  const own = { uDentOff: { value: new THREE.Vector3(...off) } };
  const base = prev === THREE.Material.prototype.onBeforeCompile ? null : prev;
  const key0 = base ? prevKey.call(mat) : '';
  mat.onBeforeCompile = (sh, r) => {
    if (base) base.call(mat, sh, r);
    Object.assign(sh.uniforms, DU, own);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>' + VERT_HEAD)
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>' + VERT_BODY)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += dentD;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>' + FRAG_HEAD)
      .replace('#include <roughnessmap_fragment>', FRAG_BODY + '\n#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.9, dentSc);');
  };
  mat.customProgramCacheKey = () => key0 + '|dent';
  mat.userData.dents = DU; mat.userData.dentOff = own.uDentOff;
  return mat;
}
/** a car's own copy of a shared material (same program: compiles nothing), bent by its dents */
export function ownCopy(mat, DU, off) {
  const m = mat.clone(); m.userData = { ...mat.userData, sharedMap: true, src: mat };
  return dentWith(m, DU, off);
}

/**
 * Write a car's dents (Car.dents: [x, y, z, r, ax, ay, az, seed, t]) into its uniforms - those made by race time t,
 * the deepest DENT_N of them. Returns how many.
 */
export function uploadDents(DU, dents, t = Infinity) {
  const live = dents.filter((d) => d[8] <= t + 1e-6);
  if (live.length > DENT_N) live.sort((a, b) => Math.hypot(b[4], b[5], b[6]) * b[3] - Math.hypot(a[4], a[5], a[6]) * a[3]);
  const A = DU.uDentA.value, B = DU.uDentB.value, n = Math.min(DENT_N, live.length);
  for (let i = 0; i < n; i++) { const d = live[i]; A.set([d[0], d[1], d[2], d[3]], i * 4); B.set([d[4], d[5], d[6], d[7]], i * 4); }
  DU.uDentN.value = n;
  return n;
}
