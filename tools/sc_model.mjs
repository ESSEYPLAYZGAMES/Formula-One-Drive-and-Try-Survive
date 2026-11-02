// The safety car model: Sketchfab's "2021 | Aston Martin Vantage F1 Safety Car" by kevin (ケビン) (CC BY 4.0), cut into
// the parts the game moves and packed for src/vehicle/SafetyCarModel.js:
//   'body' (static), the four wheels ('wFL' 'wFR' 'wRL' 'wRR': tyre, rim, spokes, brake disc and centre cap about their
//   hubs - they roll, the fronts steer), the roof light bar's lamps and lenses ('lampL' 'lampR' amber, 'lampC' green) and the
//   tail lights ('tail', brightened under braking).
// Levels: 0 (textured, everything; the hidden engine bay dropped), 1 (textured, the cabin's insides thinned hard),
// 2 (one flat colour a material, coarse).
//
//   node tools/sc_model.mjs <model.glb> [out dir = assets/sc]
//   needs @gltf-transform/core @gltf-transform/extensions meshoptimizer (npm i in a folder, CAR_TOOLS=<it>), python3 + PIL
//
// The body frame (SafetyCarMesh's): forward +x, y up, z to the right, the ground at y = 0, the axles' midpoint at x = 0.
import fs from 'fs'; import path from 'path'; import zlib from 'zlib'; import os from 'os'; import { execFileSync } from 'child_process';
import { createRequire } from 'module';

const TOOLS = process.env.CAR_TOOLS || process.cwd();
const req = createRequire(path.join(TOOLS, 'package.json'));
const imp = (m) => import(req.resolve(m));
const { NodeIO } = await imp('@gltf-transform/core');
const { ALL_EXTENSIONS } = await imp('@gltf-transform/extensions');
const { MeshoptSimplifier } = await imp('meshoptimizer');
await MeshoptSimplifier.ready;

const SRC = process.argv[2], OUT = process.argv[3] || 'assets/sc';
fs.mkdirSync(path.join(OUT, 'tex'), { recursive: true });

// ---- what the source's materials are
const DROP = new Set(['AstonMartin_VantageV8Reward_2018EngineA_Material',   // the engine bay (under the closed bonnet)
  'center_blur', 'badge', 'AstonMartin_VantageV8Reward_2018WindowInside_Material']);   // (fully transparent)
const WHEEL = new Set(['Tyre', 'rim_black', 'rim_spoke', 'EXT_Disc', 'AstonMartin_VantageV8Reward_2018_Wheel1A_3D_3DWheel1B_Material']);
const INSIDE = new Set(['AstonMartin_VantageV8Reward_2018InteriorA_Material', 'AstonMartin_VantageV8Reward_2018InteriorColourZoneA_Material',
  'AstonMartin_VantageV8Reward_2018InteriorTillingColourZo_5c0eeff', 'int_metal', 'carpet', 'interior_poloska', 'interior_alpha',
  'AstonMartin_VantageV8Reward_2018SeatBelt_Material', 'INT_DISPLAY', 'digital', 'digital2', 'digital3', 'display_rtm_max', 'fuel_0', 'fuel_1', 'Material_8',
  'Material.001']);
// the game's look for a material (the source leaves most at metal 0 / rough 0.6): linear colours
const LOOK = {
  body: { metal: 0.55, rough: 0.26, clear: 1 },   // Aston Martin racing green
  body2: { metal: 0.55, rough: 0.26, clear: 1 },
  vertt: { color: [0.32, 0.9, 0.0], metal: 0.3, rough: 0.3, clear: 1 },   // the lime accents
  AstonMartin_VantageV8Reward_2018InteriorTillingColourZo_5c0eeff: { rough: 0.5 },
  AstonMartin_VantageV8Reward_2018Coloured_Material: { color: [0.012, 0.013, 0.014], metal: 0.2, rough: 0.35 },
  Tyre: { color: [0.025, 0.025, 0.027], metal: 0, rough: 0.88 },
  rim_black: { color: [0.03, 0.03, 0.032], metal: 0.6, rough: 0.32 },
  rim_spoke: { metal: 0.85, rough: 0.28 },
  EXT_Disc: { metal: 0.7, rough: 0.45 },
  AstonMartin_VantageV8Reward_2018GlassA_Material: { color: [0.6, 0.6, 0.62], metal: 0, rough: 0.05 },
  AstonMartin_VantageV8Reward_2018Window_Material: { color: [0.02, 0.022, 0.026], metal: 0.3, rough: 0.04, opacity: 0.82 },
  safety_glass: { color: [0.5, 0.5, 0.5], metal: 0, rough: 0.05, opacity: 0.45 },
  light_red: { color: [0.35, 0.0, 0.0], metal: 0, rough: 0.12, opacity: 0.8, emissive: [1, 0.03, 0.02], emI: 0.6 },
  mirrors: { color: [0.8, 0.8, 0.82], metal: 1, rough: 0.04 },
  metal_black: { metal: 0.9, rough: 0.25 },
  safety_black_plastic: { color: [0.01, 0.01, 0.011], metal: 0, rough: 0.5 },
  safety_light: { color: [0.6, 0.6, 0.6], metal: 0, rough: 0.2 },
  carbon2: { metal: 0.1, rough: 0.3 }, body_carbon: { metal: 0.1, rough: 0.3 },
  AstonMartin_VantageV8Reward_2018Carbon1M_Material: { metal: 0.1, rough: 0.3 },
  AstonMartin_VantageV8Reward_2018LightA_Material: { metal: 0.2, rough: 0.15 },
  AstonMartin_VantageV8Reward_2018ManufacturerPlateA_Material: { metal: 0.3, rough: 0.3 },
};
// share of the triangles kept (level 0 / level 1); level 2 keeps 'FAR' of the whole
const KEEP0 = (m) => (INSIDE.has(m) ? 0.3 : 0.6), KEEP1 = (m) => (INSIDE.has(m) ? 0.03 : WHEEL.has(m) ? 0.18 : 0.16);
const FAR = 0.025;
const TEXMAX = { 'Material.024': 512, emblem: 1024 };

// ---- read: every triangle in the body frame
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SRC);
const asset = doc.getRoot().getAsset().extras || {};
const prims = [];   // { mat, pos, nrm, uv, idx }
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const W = node.getWorldMatrix();
  for (const p of mesh.listPrimitives()) {
    const mat = p.getMaterial(), name = mat ? mat.getName() : 'none';
    if (DROP.has(name)) continue;
    const A = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), U = p.getAttribute('TEXCOORD_0'), n = A.getCount();
    const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), uv = new Float32Array(n * 2), v = [0, 0, 0];
    for (let i = 0; i < n; i++) {
      A.getElement(i, v);
      const x = W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], y = W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], z = W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14];
      pos[i * 3] = z; pos[i * 3 + 1] = y; pos[i * 3 + 2] = -x;   // (source: forward +z, x to the left)
      if (N) { N.getElement(i, v); const a = W[0] * v[0] + W[4] * v[1] + W[8] * v[2], b = W[1] * v[0] + W[5] * v[1] + W[9] * v[2], c = W[2] * v[0] + W[6] * v[1] + W[10] * v[2], l = Math.hypot(a, b, c) || 1; nrm[i * 3] = c / l; nrm[i * 3 + 1] = b / l; nrm[i * 3 + 2] = -a / l; }
      if (U) { U.getElement(i, v); uv[i * 2] = v[0]; uv[i * 2 + 1] = v[1]; }
    }
    const I = p.getIndices(), idx = I ? Uint32Array.from(I.getArray()) : Uint32Array.from({ length: n }, (_, i) => i);
    prims.push({ mat: name, pos, nrm, uv, idx, src: mat });
  }
}
// the axles: the tyres' four clusters
const tyreBox = [0, 1, 2, 3].map(() => ({ mn: [1e9, 1e9, 1e9], mx: [-1e9, -1e9, -1e9] }));
const wheelOf = (x, z) => (x > 0 ? 0 : 2) + (z > 0 ? 1 : 0);   // FL FR RL RR
for (const P of prims) if (P.mat === 'Tyre') for (let i = 0; i < P.pos.length / 3; i++) {
  const B = tyreBox[wheelOf(P.pos[i * 3], P.pos[i * 3 + 2])];
  for (let k = 0; k < 3; k++) { B.mn[k] = Math.min(B.mn[k], P.pos[i * 3 + k]); B.mx[k] = Math.max(B.mx[k], P.pos[i * 3 + k]); }
}
let hubs = tyreBox.map((B) => B.mn.map((a, k) => (a + B.mx[k]) / 2));
const radius = tyreBox.reduce((s, B) => s + (B.mx[1] - B.mn[1]) / 2, 0) / 4;
const lift = -Math.min(...tyreBox.map((B) => B.mn[1]));
const mid = (hubs[0][0] + hubs[2][0]) / 2;
for (const P of prims) for (let i = 0; i < P.pos.length / 3; i++) { P.pos[i * 3] -= mid; P.pos[i * 3 + 1] += lift; }
hubs = hubs.map(([x, y, z]) => [x - mid, y + lift, z]);
console.log('hubs', hubs.map((h) => h.map((a) => a.toFixed(3)).join(' ')).join(' | '), 'radius', radius.toFixed(3));

// ---- cut into parts: { part: { mat: [triangle soups] } }
const PARTS = {};
const add = (part, mat, P, tris) => {
  if (!tris.length) return;
  const map = new Map(), pos = [], nrm = [], uv = [], idx = [];
  for (const t of tris) for (let k = 0; k < 3; k++) {
    const i = P.idx[t * 3 + k]; let j = map.get(i);
    if (j === undefined) { j = pos.length / 3; map.set(i, j); pos.push(P.pos[i * 3], P.pos[i * 3 + 1], P.pos[i * 3 + 2]); nrm.push(P.nrm[i * 3], P.nrm[i * 3 + 1], P.nrm[i * 3 + 2]); uv.push(P.uv[i * 2], P.uv[i * 2 + 1]); }
    idx.push(j);
  }
  ((PARTS[part] ??= {})[mat] ??= []).push({ pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), uv: Float32Array.from(uv), idx: Uint32Array.from(idx) });
};
const WN = ['wFL', 'wFR', 'wRL', 'wRR'];
for (const P of prims) {
  const nt = P.idx.length / 3, bins = {};
  for (let t = 0; t < nt; t++) {
    let cx = 0, cy = 0, cz = 0;
    for (let k = 0; k < 3; k++) { const i = P.idx[t * 3 + k]; cx += P.pos[i * 3] / 3; cy += P.pos[i * 3 + 1] / 3; cz += P.pos[i * 3 + 2] / 3; }
    let part = 'body';
    if (WHEEL.has(P.mat)) part = WN[wheelOf(cx, cz)];
    else if (P.mat === 'safety_light' || P.mat === 'safety_glass') part = cz < -0.25 ? 'lampL' : cz > 0.25 ? 'lampR' : 'lampC';
    else if (P.mat === 'light_red') part = 'tail';
    (bins[part] ??= []).push(t);
  }
  for (const [part, tris] of Object.entries(bins)) add(part, P.mat, P, tris);
}
const PIVOT = { wFL: hubs[0], wFR: hubs[1], wRL: hubs[2], wRR: hubs[3] };

// ---- geometry tools
function merge(list) {
  let nv = 0, ni = 0; for (const M of list) { nv += M.pos.length / 3; ni += M.idx.length; }
  const out = { pos: new Float32Array(nv * 3), nrm: new Float32Array(nv * 3), uv: new Float32Array(nv * 2), idx: new Uint32Array(ni) };
  let ov = 0, oi = 0;
  for (const M of list) { out.pos.set(M.pos, ov * 3); out.nrm.set(M.nrm, ov * 3); out.uv.set(M.uv, ov * 2); for (let i = 0; i < M.idx.length; i++) out.idx[oi + i] = M.idx[i] + ov; ov += M.pos.length / 3; oi += M.idx.length; }
  return out;
}
/** welded by position + normal + uv (exact duplicates), so the simplifier sees the surface as connected */
function weld(M, uvToo = true) {
  const map = new Map(), pos = [], nrm = [], uv = [], remap = new Uint32Array(M.pos.length / 3);
  const q = (a, s) => Math.round(a * s);
  for (let i = 0; i < M.pos.length / 3; i++) {
    const key = `${q(M.pos[i * 3], 1e4)},${q(M.pos[i * 3 + 1], 1e4)},${q(M.pos[i * 3 + 2], 1e4)}` + (uvToo ? `,${q(M.nrm[i * 3], 50)},${q(M.nrm[i * 3 + 1], 50)},${q(M.nrm[i * 3 + 2], 50)},${q(M.uv[i * 2], 2e3)},${q(M.uv[i * 2 + 1], 2e3)}` : '');
    let k = map.get(key);
    if (k === undefined) { k = pos.length / 3; map.set(key, k); pos.push(M.pos[i * 3], M.pos[i * 3 + 1], M.pos[i * 3 + 2]); nrm.push(M.nrm[i * 3], M.nrm[i * 3 + 1], M.nrm[i * 3 + 2]); uv.push(M.uv[i * 2], M.uv[i * 2 + 1]); }
    remap[i] = k;
  }
  return { pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), uv: Float32Array.from(uv), idx: M.idx.map((i) => remap[i]) };
}
function compact(M, idx) {
  const map = new Map(), pos = [], nrm = [], uv = [], out = new Uint32Array(idx.length);
  for (let t = 0; t < idx.length; t++) { const i = idx[t]; let j = map.get(i); if (j === undefined) { j = pos.length / 3; map.set(i, j); pos.push(M.pos[i * 3], M.pos[i * 3 + 1], M.pos[i * 3 + 2]); nrm.push(M.nrm[i * 3], M.nrm[i * 3 + 1], M.nrm[i * 3 + 2]); uv.push(M.uv[i * 2], M.uv[i * 2 + 1]); } out[t] = j; }
  return { pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), uv: Float32Array.from(uv), idx: out };
}
function simplify(M, share, error = 0.02, flags = []) {
  const nt = M.idx.length / 3; if (share >= 1 || nt < 60) return M;
  const target = Math.max(12, Math.floor(nt * share)) * 3;
  const [idx] = MeshoptSimplifier.simplify(M.idx, M.pos, 3, target, error, flags);
  return compact(M, idx.length ? idx : M.idx);
}
const tris = (M) => M.idx.length / 3;

// ---- textures: PNG -> webp (max 1024, some smaller), and each material's mean colour (for level 2)
const texOf = new Map(), texOut = {}, byHash = new Map();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sctex-'));
function texture(tex, matName, role) {
  if (!tex) return null;
  if (texOf.has(tex)) return texOf.get(tex);
  const h = Buffer.from(tex.getImage()).toString('base64');   // (the same picture twice: one file)
  if (byHash.has(h)) { texOf.set(tex, byHash.get(h)); return byHash.get(h); }
  const name = 't' + byHash.size;
  texOf.set(tex, name); byHash.set(h, name);
  fs.writeFileSync(path.join(tmp, name + '.png'), Buffer.from(tex.getImage()));
  texOut[name] = { max: TEXMAX[matName] || 1024, alpha: role === 'alpha' };
  return name;
}
const MATS = {};
for (const P of prims) {
  if (MATS[P.mat]) continue;
  const m = P.src, L = LOOK[P.mat] || {};
  const bc = m ? m.getBaseColorFactor() : [0.5, 0.5, 0.5, 1];
  const blend = m && m.getAlphaMode() === 'BLEND';
  MATS[P.mat] = {
    color: L.color || bc.slice(0, 3).map((x) => +x.toFixed(4)), opacity: L.opacity ?? (blend ? +bc[3].toFixed(3) : 1), blend: blend || L.opacity != null,
    tex: m ? texture(m.getBaseColorTexture(), P.mat, blend ? 'alpha' : 'color') : null,
    emtex: m && m.getEmissiveTexture() ? texture(m.getEmissiveTexture(), P.mat, 'color') : null,
    emissive: L.emissive || (m ? m.getEmissiveFactor() : [0, 0, 0]), emI: L.emI ?? 1,
    metal: L.metal ?? (m ? m.getMetallicFactor() : 0), rough: L.rough ?? (m ? m.getRoughnessFactor() : 0.6), clear: L.clear || 0,
    ds: !!(m && m.getDoubleSided()), inside: INSIDE.has(P.mat) || undefined,
  };
}
// webp + the textures' mean colours (python: PIL)
const py = `
import json, sys, os
from PIL import Image
tmp, out, spec = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
mean = {}
for n, s in spec.items():
    im = Image.open(os.path.join(tmp, n + '.png')); im.load()
    im = im.convert('RGBA' if s['alpha'] else 'RGB')
    w, h = im.size; k = min(1.0, s['max'] / max(w, h))
    if k < 1: im = im.resize((max(1, int(w * k)), max(1, int(h * k))), Image.LANCZOS)
    im.save(os.path.join(out, n + '.webp'), 'WEBP', quality=82, method=6)
    m = im.convert('RGB').resize((1, 1), Image.BOX).getpixel((0, 0)); mean[n] = [round((c / 255) ** 2.2, 4) for c in m]
print(json.dumps(mean))`;
const mean = JSON.parse(execFileSync('python3', ['-c', py, tmp, path.join(OUT, 'tex'), JSON.stringify(texOut)]).toString());
for (const M of Object.values(MATS)) M.flat = M.tex ? M.color.map((c, k) => +(c * mean[M.tex][k]).toFixed(4)) : M.color;
fs.rmSync(tmp, { recursive: true });

// ---- pack
const bin = []; let off = 0;
function put(arr) { const b = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength); const pad = (4 - (off % 4)) % 4; if (pad) { bin.push(Buffer.alloc(pad)); off += pad; } const o = off; bin.push(b); off += b.length; return o; }
function chunk(M, pv, mat, uvToo = true, col = null) {
  const n = M.pos.length / 3, mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  const p = new Float32Array(n * 3); for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { const a = M.pos[i * 3 + k] - pv[k]; p[i * 3 + k] = a; mn[k] = Math.min(mn[k], a); mx[k] = Math.max(mx[k], a); }
  const q = new Uint16Array(n * 3); for (let i = 0; i < n * 3; i++) { const k = i % 3; q[i] = Math.round(((p[i] - mn[k]) / Math.max(1e-9, mx[k] - mn[k])) * 65535); }
  const nq = new Int8Array(n * 4); for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) nq[i * 4 + k] = Math.round(Math.max(-1, Math.min(1, M.nrm[i * 3 + k])) * 127);
  const c = { m: mat, n, t: M.idx.length / 3, box: [mn.map((x) => +x.toFixed(5)), mx.map((x) => +x.toFixed(5))] };
  c.pos = put(q); c.nrm = put(nq);
  if (uvToo) {
    let u0 = 1e9, v0 = 1e9, u1 = -1e9, v1 = -1e9; for (let i = 0; i < n; i++) { u0 = Math.min(u0, M.uv[i * 2]); u1 = Math.max(u1, M.uv[i * 2]); v0 = Math.min(v0, M.uv[i * 2 + 1]); v1 = Math.max(v1, M.uv[i * 2 + 1]); }
    const uq = new Uint16Array(n * 2); for (let i = 0; i < n; i++) { uq[i * 2] = Math.round(((M.uv[i * 2] - u0) / Math.max(1e-9, u1 - u0)) * 65535); uq[i * 2 + 1] = Math.round(((M.uv[i * 2 + 1] - v0) / Math.max(1e-9, v1 - v0)) * 65535); }
    c.uvr = [u0, v0, u1, v1].map((x) => +x.toFixed(6)); c.uv = put(uq);
  }
  if (col) { const cq = new Uint8Array(n * 4); for (let i = 0; i < n * 4; i++) cq[i] = Math.round(Math.max(0, Math.min(1, col[i])) * 255); c.col = put(cq); }
  const big = n > 65535; c.i32 = big; c.idx = put(big ? M.idx : Uint16Array.from(M.idx));
  return c;
}
const out = { credit: { title: asset.title, author: asset.author, source: asset.source, license: asset.license }, radius: +radius.toFixed(4), hubs: hubs.map((h) => h.map((a) => +a.toFixed(4))), mats: MATS, parts: {} };
const count = [0, 0, 0];
for (const [part, mats] of Object.entries(PARTS)) {
  const pv = PIVOT[part] || [0, 0, 0], L = [[], [], []];
  const plain1 = [], flat = [], lamp = part.startsWith('lamp');
  // (a material with no texture, transparency or clear coat: merged with the others like it, vertex-coloured, at level 1)
  const plain = (mat) => { const m = MATS[mat]; return !lamp && !m.tex && !m.emtex && !m.blend && !m.clear; };
  for (const [mat, list] of Object.entries(mats)) {
    const W = weld(merge(list));
    const m0 = simplify(W, KEEP0(mat)); L[0].push(chunk(m0, pv, mat)); count[0] += tris(m0);
    const m1 = simplify(m0, KEEP1(mat) / KEEP0(mat), 0.05); count[1] += tris(m1);
    if (plain(mat)) plain1.push([mat, m1]); else L[1].push(chunk(m1, pv, mat));
    if (!INSIDE.has(mat) || part !== 'body') flat.push([mat, m1]);
  }
  const vc = (list, key) => { const M = merge(list.map((e) => e[1])), col = new Float32Array(M.pos.length / 3 * 4); let o = 0;
    for (const [mat, m] of list) { const c = MATS[mat][key]; for (let i = 0; i < m.pos.length / 3; i++, o++) { col[o * 4] = c[0]; col[o * 4 + 1] = c[1]; col[o * 4 + 2] = c[2]; col[o * 4 + 3] = 1; } }
    return [M, col]; };
  if (plain1.length) { const [M, col] = vc(plain1, 'color'); L[1].push(chunk(M, pv, '_vc', false, col)); }
  // level 2: the outside only, coarse, all in one vertex-coloured chunk (the lamps: as level 1)
  const far = [];
  for (const [mat, m1] of flat) {
    if (lamp) { L[2].push(chunk(m1, pv, mat, false)); count[2] += tris(m1); continue; }
    const m2 = simplify(weld(m1, false), FAR / KEEP1(mat), 0.12, ['LockBorder']);
    if (tris(m2) >= 2) { far.push([mat, m2]); count[2] += tris(m2); }
  }
  if (far.length) { const [M, col] = vc(far, 'flat'); L[2].push(chunk(M, pv, '_vc', false, col)); }
  out.parts[part] = { pivot: pv.map((a) => +a.toFixed(4)), lv: L };
}
console.log('triangles by level', count.join(' / '));
fs.writeFileSync(path.join(OUT, 'sc.json'), JSON.stringify(out));
fs.writeFileSync(path.join(OUT, 'sc.bin.gz'), zlib.gzipSync(Buffer.concat(bin), { level: 9 }));
fs.writeFileSync(path.join(OUT, 'CREDIT.txt'), `The safety car is based on "${asset.title}" (${asset.source})\nby ${asset.author}, licensed under ${asset.license}.\n\n` +
  'Changes: converted with tools/sc_model.mjs - the engine bay and hidden parts removed, cut into parts (four wheels about\n' +
  'their hubs, the light bar\'s lamps, the tail lights), simplified to three levels of detail, quantized; materials retuned;\n' +
  'textures downsized to webp.\n');
console.log('wrote', OUT, (fs.statSync(path.join(OUT, 'sc.bin.gz')).size / 1e6).toFixed(2), 'MB bin,', Object.keys(texOut).length, 'textures');
