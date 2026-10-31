// The car model: the 2026 car from a glTF (Sketchfab's "2026 Redbull RB22" by Dave Love, CC BY 4.0 - its livery,
// decals and numbers are dropped: the game paints its own) cut into the parts the game moves, at five levels of
// detail, packed for src/vehicle/CarModel.js.
//
//   node tools/car_model.mjs <scene.gltf> [out dir = assets/car]
//   needs @gltf-transform/core @gltf-transform/extensions meshoptimizer pngjs (npm i in a folder, CAR_TOOLS=<it>)
//
// The body frame (CarMesh's): forward +x, y up, z to the right, the ground at y = 0, the axles' midpoint at x = 0.
// Parts: 'body' (static), 'fw' (front wing; 'fwL' / 'fwR' its outer thirds with the endplates - they come off on
// their own), 'rw' (rear wing) and 'drs' (its top flap, turning about its leading edge), the four wheels ('w' +
// F/R + L/R, about their hubs: the tyre, rim and brake disc), 'sw' (steering wheel, about its column), 'tcam', 'number'
// (the decal plates, in CarModel's number atlas), 'light' (the rain lights).
// Levels: 0 ULTRA (textured, every part), 1 HIGH (textured, the cockpit's insides dropped), 2 MED (paint + one
// vertex-coloured material), 3 FAR and 4 MIN (one vertex-coloured mesh a part: the paint flagged in the alpha, the
// tyres' compound band too). The colours of every level >= 2 are sampled from the source textures.
//
// Output: car.json (the parts, their levels' chunks in car.bin.gz, the materials) and car.bin.gz.
import fs from 'fs'; import path from 'path'; import zlib from 'zlib'; import { createRequire } from 'module';

const TOOLS = process.env.CAR_TOOLS || process.cwd();
const req = createRequire(path.join(TOOLS, 'package.json'));
const imp = (m) => import(req.resolve(m));
const { NodeIO } = await imp('@gltf-transform/core');
const { ALL_EXTENSIONS } = await imp('@gltf-transform/extensions');
const { MeshoptSimplifier } = await imp('meshoptimizer');
const { PNG } = req('pngjs');
await MeshoptSimplifier.ready; MeshoptSimplifier.useExperimentalFeatures = true;

const SRC = process.argv[2], OUT = process.argv[3] || 'assets/car';
const SRCDIR = path.dirname(SRC);
const LIFT = 0.031;   // (the tyres stand 3 cm into the source's ground)

// ---- what each source mesh is (node name -> role); the rest by where it is
const WHEEL = new Set(['Object_11', 'Object_12', 'Object_13', 'Object_14']);
const SW = new Set(['Object_16', 'Object_17', 'Object_18', 'Object_25', 'Object_26', 'Object_27', 'Object_28']);
const DROP = new Set(['Object_21', 'Object_22', 'Object_23']);   // the sponsors' decals; the pedal box and the belts (under the driver)
const SPECIAL = { Object_24: 'tcam', Object_19: 'number', Object_10: 'light' };
// the wings: the front one ahead of x = 2.0 m below the nose; the rear one behind -1.98 m above 0.62 m; its flap
const FW_X = Number(process.env.FW_X ?? 1.98), FW_Y = Number(process.env.FW_Y ?? 0.36), FW_SIDE = Number(process.env.FW_SIDE ?? 0.42);
const RW_X = Number(process.env.RW_X ?? -1.84), RW_Y = Number(process.env.RW_Y ?? 0.62);
const HALO = JSON.parse(process.env.HALO ?? '{"x0":0.1,"x1":0.97,"y0":0.8,"z":0.46,"airX":0.12,"airZ":0.24}');
const DRS = JSON.parse(process.env.DRS ?? '{"x0":-2.62,"x1":-2.2,"y0":0.84,"zMax":0.5}');

// ---- materials: source material -> the game's (textured at levels 0-1; baseColor sampled for the vertex colours)
const MATS = {
  'redbull_paint.007': { k: 'paint' }, 'redbull_color.005': { k: 'tcam' }, 'redbull_number_3.005': { k: 'number' },
  'redbull_carbon3.007': { k: 'carbon3', tex: 'carbon3', nrm: 'carbon3_n', rough: 0.32, metal: 0.0 },
  'redbull_carbon1.007': { k: 'carbon1', tex: 'carbon1', rough: 0.55, metal: 0.0 },
  'redbull_carbon2.007': { k: 'carbon2', tex: 'carbon2', rough: 0.32, metal: 0.0 },
  'redbull_detail.007': { k: 'detail', tex: 'detail', rough: 0.36, metal: 0.2 },
  'generics2.007': { k: 'generic', tex: 'generic', rough: 0.45, metal: 0.25 },
  'rear_light_2.007': { k: 'light', tex: 'light', rough: 0.3, metal: 0.0 },
  'glass.005': { k: 'glass', tex: 'glass', rough: 0.2, metal: 0.0 },
  'discs.007': { k: 'disc', tex: 'disc', rough: 0.7, metal: 0.2 },
  'redbull_wheel_hub.007': { k: 'rim', tex: 'rim', rough: 0.35, metal: 0.5 },
  'sidewall.007': { k: 'tyre', tex: 'tyre', nrm: 'tyre_n', rough: 0.85, metal: 0.0 },
  'black_s.006': { k: 'black', color: [0.02, 0.02, 0.025], rough: 0.7, metal: 0.0 },
  'redbull_steeringwheel.004': { k: 'swheel', tex: 'swheel', rough: 0.6, metal: 0.1 },
  'kers_blue.003': { k: 'swled', color: [0.1, 0.4, 1.0], rough: 0.5, metal: 0.0 },
  'gp21_LCD.003': { k: 'swlcd', color: [0.05, 0.08, 0.1], rough: 0.3, metal: 0.0 },
  'clearled.003': { k: 'swclear', color: [0.8, 0.8, 0.8], rough: 0.4, metal: 0.0 },
  'sw_decals.004': { k: 'swdecal', tex: 'swdecal', rough: 0.6, metal: 0.0, alpha: true },
  'redbull_mirror_right.005': { k: 'mirror', color: [0.7, 0.72, 0.75], rough: 0.05, metal: 1.0 },
};
// the texture each material's colours are sampled from (source file)
const TEXFILE = { carbon3: 'redbull_carbon3.007_baseColor.png', carbon1: 'redbull_carbon1.007_baseColor.png', carbon2: 'redbull_carbon2.007_baseColor.png', detail: 'redbull_detail.007_baseColor.png', generic: 'generics2.007_baseColor.png', light: 'rear_light_2.007_baseColor.png', glass: 'glass.005_baseColor.png', disc: 'discs.007_baseColor.png', rim: 'redbull_wheel_hub.007_baseColor.png', tyre: 'sidewall.007_baseColor.png', swheel: 'redbull_steeringwheel.004_baseColor.png', swdecal: 'sw_decals.004_baseColor.png' };

// ---- levels: per material, the share of its triangles kept (level 0 and 1); levels 2+ by part totals
const KEEP0 = { carbon2: 0.42, paint: 0.7, detail: 0.45, generic: 0.6, rim: 0.3, tyre: 0.55, swheel: 0.3, carbon3: 0.6, carbon1: 0.6 };
const KEEP1 = { carbon2: 0.14, paint: 0.3, detail: 0.15, generic: 0.15, rim: 0.2, tyre: 0.3, carbon3: 0.25, carbon1: 0.25, light: 0.5, glass: 1, disc: 1, black: 1, mirror: 1, tcam: 0.5, number: 1 };
const DROP1 = new Set(['swheel', 'swled', 'swlcd', 'swclear', 'swdecal']);   // (level 1 on: the steering wheel is a part of its own, ULTRA only)
// triangles of each part's merged mesh at levels 2, 3, 4 (a share of the part's level-0 total, with a floor)
// (welded by position and colour - normals averaged, by 0.35 at level 2 - and small loose pieces pruned beyond it; err: the
//  simplifier's bound, a share of the part's size)
const LV = [null, null, { share: 0.05, min: 120, err: 0.02, nq: 3 }, { share: 0.012, min: 40, err: 0.07, prune: true }, { share: 0.003, min: 12, err: 0.2, prune: true }];

// ---------------------------------------------------------------------------------------------------------------------
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(SRC);
const pngs = {};
function texture(name) {
  if (pngs[name] !== undefined) return pngs[name];
  const f = path.join(SRCDIR, 'textures', TEXFILE[name]);
  if (!fs.existsSync(f)) return (pngs[name] = null);
  const p = PNG.sync.read(fs.readFileSync(f));
  return (pngs[name] = p);
}
/** the texture's colour at uv (bilinear, repeat), 0..1 */
function sample(name, u, v, out) {
  const p = texture(name); if (!p) { out[0] = out[1] = out[2] = 0.5; return out; }
  const W = p.width, H = p.height, x = ((u % 1) + 1) % 1 * W - 0.5, y = ((v % 1) + 1) % 1 * H - 0.5;
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, d = p.data;
  const at = (xx, yy, c) => d[(((yy + H) % H) * W + ((xx + W) % W)) * 4 + c] / 255;
  for (let c = 0; c < 3; c++) out[c] = (at(x0, y0, c) * (1 - fx) + at(x0 + 1, y0, c) * fx) * (1 - fy) + (at(x0, y0 + 1, c) * (1 - fx) + at(x0 + 1, y0 + 1, c) * fx) * fy;
  return out;
}
const srgbToLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

// ---- read every primitive into the body frame
const prims = [];
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh || DROP.has(node.getName())) continue;
  const M = node.getWorldMatrix();
  for (const p of mesh.listPrimitives()) {
    const P = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), T = p.getAttribute('TEXCOORD_0'), n = P.getCount();
    const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), uv = new Float32Array(n * 2), v = [0, 0, 0], w = [0, 0];
    for (let i = 0; i < n; i++) {
      P.getElement(i, v);
      const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], y = M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], z = M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14];
      pos[i * 3] = z; pos[i * 3 + 1] = y + LIFT; pos[i * 3 + 2] = -x;
      N.getElement(i, v);
      const nx = M[0] * v[0] + M[4] * v[1] + M[8] * v[2], ny = M[1] * v[0] + M[5] * v[1] + M[9] * v[2], nz = M[2] * v[0] + M[6] * v[1] + M[10] * v[2], l = Math.hypot(nx, ny, nz) || 1;
      nrm[i * 3] = nz / l; nrm[i * 3 + 1] = ny / l; nrm[i * 3 + 2] = -nx / l;
      if (T) { T.getElement(i, w); uv[i * 2] = w[0]; uv[i * 2 + 1] = w[1]; }
    }
    const det = M[0] * (M[5] * M[10] - M[6] * M[9]) - M[4] * (M[1] * M[10] - M[2] * M[9]) + M[8] * (M[1] * M[6] - M[2] * M[5]);
    let idx = p.getIndices() ? Uint32Array.from(p.getIndices().getArray()) : Uint32Array.from({ length: n }, (_, i) => i);
    if (det < 0) for (let t = 0; t < idx.length; t += 3) { const a = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = a; }   // (a mirroring transform: keep the faces outward)
    const sm = p.getMaterial()?.getName(), mat = MATS[sm];
    if (!mat) { console.warn('no material mapping for', sm, '- dropped'); continue; }
    prims.push({ node: node.getName(), mat, pos, nrm, uv, idx });
  }
}

// ---- the wheels: each one's hub (the tyre's centre), its own axis (the tyre's flattest direction: the fronts have
// camber), radius and width - fitted from the tyres, Object_13/14
/** eigenvalues / vectors of a symmetric 3x3 (Jacobi), smallest first */
function eig3(A) {
  const a = A.map((r) => r.slice()), V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 60; it++) {
    let p = 0, q = 1; for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) if (Math.abs(a[i][j]) > Math.abs(a[p][q])) { p = i; q = j; }
    if (Math.abs(a[p][q]) < 1e-14) break;
    const th = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]), c = Math.cos(th), sn = Math.sin(th);
    for (let k = 0; k < 3; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - sn * akq; a[k][q] = sn * akp + c * akq; }
    for (let k = 0; k < 3; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - sn * aqk; a[q][k] = sn * apk + c * aqk; }
    for (let k = 0; k < 3; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - sn * vkq; V[k][q] = sn * vkp + c * vkq; }
  }
  return [0, 1, 2].map((i) => ({ val: a[i][i], vec: [V[0][i], V[1][i], V[2][i]] })).sort((x, y) => x.val - y.val);
}
const HUB = {};
{
  const W = {};
  for (const pr of prims) {
    if (pr.node !== 'Object_14' && pr.node !== 'Object_13') continue;
    for (let i = 0; i < pr.pos.length / 3; i++) { const x = pr.pos[i * 3], y = pr.pos[i * 3 + 1], z = pr.pos[i * 3 + 2]; (W['w' + (x > 0 ? 'F' : 'R') + (z > 0 ? 'R' : 'L')] ||= []).push([x, y, z]); }
  }
  for (const [k, P] of Object.entries(W)) {
    const c = [0, 1, 2].map((j) => P.reduce((sum, q) => sum + q[j], 0) / P.length);
    const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of P) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += (q[i] - c[i]) * (q[j] - c[j]) / P.length;
    const ax = eig3(C)[0].vec; if (ax[2] < 0) for (let j = 0; j < 3; j++) ax[j] = -ax[j];
    let r = 0, a0 = 1e9, a1 = -1e9; for (const q of P) { const d = q.map((x, j) => x - c[j]), t = d[0] * ax[0] + d[1] * ax[1] + d[2] * ax[2]; r = Math.max(r, Math.hypot(d[0] - t * ax[0], d[1] - t * ax[1], d[2] - t * ax[2])); a0 = Math.min(a0, t); a1 = Math.max(a1, t); }
    // the turn from the wheel's own frame (its axis along z) into the body's: z -> ax
    const ang = Math.acos(Math.max(-1, Math.min(1, ax[2]))), ra = [-ax[1], ax[0], 0], rl = Math.hypot(ra[0], ra[1]) || 1, sh = Math.sin(ang / 2);
    const q = rl < 1e-9 ? [0, 0, 0, 1] : [ra[0] / rl * sh, ra[1] / rl * sh, 0, Math.cos(ang / 2)];
    HUB[k] = { c, ax, r, a0, a1, w: a1 - a0, q };
  }
}
/** v rotated by the inverse of quaternion q */
function unrot(q, v) {
  const x = -q[0], y = -q[1], z = -q[2], w = q[3], tx = 2 * (y * v[2] - z * v[1]), ty = 2 * (z * v[0] - x * v[2]), tz = 2 * (x * v[1] - y * v[0]);
  return [v[0] + w * tx + (y * tz - z * ty), v[1] + w * ty + (z * tx - x * tz), v[2] + w * tz + (x * ty - y * tx)];
}
/** which wheel a piece lies inside (90 % of its points within the tyre's cylinder), and whether it is round about the axle
 *  (its centre on the axle, all the way round it: a cover, a nut, a disc - it turns with the wheel; else it is the hub's
 *  static work - the brake drum's duct, the upright - moving with the wheel on its springs) -> 'wFR' / 'wFRs' / null */
function wheelOf(pos, vset) {
  const verts = [...vset];
  for (const [k, H] of Object.entries(HUB)) {
    let inside = 0, sx = 0, sy = 0; const angs = new Set();
    for (const i of verts) {
      const d = unrot(H.q, [pos[i * 3] - H.c[0], pos[i * 3 + 1] - H.c[1], pos[i * 3 + 2] - H.c[2]]), r = Math.hypot(d[0], d[1]);
      if (r < H.r * 0.98 && d[2] > H.a0 - 0.06 && d[2] < H.a1 + 0.06) inside++;
      sx += d[0]; sy += d[1]; angs.add(Math.floor((Math.atan2(d[1], d[0]) + Math.PI) / (Math.PI / 18)));
    }
    if (inside < 0.9 * verts.length) continue;
    const off = Math.hypot(sx, sy) / verts.length;
    return off < 0.02 && angs.size >= 30 ? k : k + 's';
  }
  return null;
}

// ---- every triangle into its part, by material: parts[part][matKey] = { pos[], nrm[], uv[], mat }
// A piece of the model (a connected set of triangles: an endplate, a wing element, a flap) goes to a part whole: the
// wings come off without leaving half an endplate behind. Only a piece that spans the line (the paint's one big shell
// over the nose, say) is cut triangle by triangle.
const parts = {};
function regionOf(cx, cy, cz) {
  if (cx > FW_X && cy < FW_Y) return Math.abs(cz) > FW_SIDE ? (cz > 0 ? 'fwL' : 'fwR') : 'fw';
  // (the halo: over the cockpit's rim from its front pillar to its mounts behind the driver, clear of the airbox)
  if (cx > HALO.x0 && cx < HALO.x1 && cy > HALO.y0 && Math.abs(cz) < HALO.z && !(cx < HALO.airX && Math.abs(cz) < HALO.airZ)) return 'halo';
  // (the rear wing: its elements above RW_Y, its endplates - outboard - down to 0.36 m)
  if (cx < RW_X && (cy > RW_Y || (Math.abs(cz) > 0.42 && cy > 0.36))) return cx > DRS.x0 && cx < DRS.x1 && cy > DRS.y0 && Math.abs(cz) < DRS.zMax ? 'drs' : 'rw';
  return 'body';
}
/** a triangle (9 positions, 9 normals, 6 uvs) cut by the plane z = c into the triangles on each side: [[below...], [above...]] */
function clipZ(T, c, axis = 2) {
  const V = [0, 1, 2].map((i) => ({ p: T.p.slice(i * 3, i * 3 + 3), n: T.n.slice(i * 3, i * 3 + 3), u: T.u.slice(i * 2, i * 2 + 2) }));
  const d = V.map((v) => v.p[axis] - c), up = d.map((x) => x >= 0), nU = up.filter(Boolean).length;
  if (nU === 0 || nU === 3) return nU ? [[], [T]] : [[T], []];
  const lerp = (a, b, t) => ({ p: a.p.map((x, i) => x + (b.p[i] - x) * t), n: a.n.map((x, i) => x + (b.n[i] - x) * t), u: a.u.map((x, i) => x + (b.u[i] - x) * t) });
  const lone = up.findIndex((f) => f === (nU === 1)), i1 = (lone + 1) % 3, i2 = (lone + 2) % 3;
  const Q1 = lerp(V[lone], V[i1], d[lone] / (d[lone] - d[i1])), Q2 = lerp(V[lone], V[i2], d[lone] / (d[lone] - d[i2]));
  const tri = (a, b, cc) => ({ p: [...a.p, ...b.p, ...cc.p], n: [...a.n, ...b.n, ...cc.n], u: [...a.u, ...b.u, ...cc.u] });
  const L = [tri(V[lone], Q1, Q2)], O = [tri(Q1, V[i1], V[i2]), tri(Q1, V[i2], Q2)];
  return nU === 1 ? [O, L] : [L, O];
}
/** connected pieces of a primitive (by shared positions): a piece id per triangle */
function pieces(pos, idx) {
  const n = pos.length / 3, parent = new Int32Array(n).map((_, i) => i), key = new Map(), canon = new Int32Array(n);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  for (let i = 0; i < n; i++) { const k = `${Math.round(pos[i * 3] * 1e4)},${Math.round(pos[i * 3 + 1] * 1e4)},${Math.round(pos[i * 3 + 2] * 1e4)}`; let c = key.get(k); if (c === undefined) key.set(k, (c = i)); canon[i] = c; }
  for (let t = 0; t < idx.length; t += 3) { const a = find(canon[idx[t]]); for (let j = 1; j < 3; j++) { const b = find(canon[idx[t + j]]); if (a !== b) parent[b] = a; } }
  const tri = new Int32Array(idx.length / 3); for (let t = 0; t < tri.length; t++) tri[t] = find(canon[idx[t * 3]]);
  return tri;
}
for (const pr of prims) {
  const { pos, nrm, uv, idx } = pr, nt = idx.length / 3, cen = new Float32Array(nt * 3);
  for (let t = 0; t < nt; t++) for (let j = 0; j < 3; j++) cen[t * 3 + j] = (pos[idx[t * 3] * 3 + j] + pos[idx[t * 3 + 1] * 3 + j] + pos[idx[t * 3 + 2] * 3 + j]) / 3;
  const fixed = WHEEL.has(pr.node) || SW.has(pr.node) || SPECIAL[pr.node];
  const piece = fixed ? null : pieces(pos, idx), vote = new Map();
  // a piece's region: the one most of its triangles are in - whole if it is a small piece (under 1.2 m every way: an
  // endplate, a flap) or 85 % of it is there; else each triangle its own
  const box = new Map();
  if (piece) for (let t = 0; t < nt; t++) {
    const r = regionOf(cen[t * 3], cen[t * 3 + 1], cen[t * 3 + 2]), v = vote.get(piece[t]) || vote.set(piece[t], {}).get(piece[t]); v[r] = (v[r] || 0) + 1;
    const B = box.get(piece[t]) || box.set(piece[t], [1e9, 1e9, 1e9, -1e9, -1e9, -1e9]).get(piece[t]);
    for (let j = 0; j < 3; j++) { B[j] = Math.min(B[j], cen[t * 3 + j]); B[j + 3] = Math.max(B[j + 3], cen[t * 3 + j]); }
  }
  const whole = new Map(); for (const [id, v] of vote) {
    const tot = Object.values(v).reduce((a, b) => a + b, 0), [best, cnt] = Object.entries(v).sort((x, y) => y[1] - x[1])[0], B = box.get(id);
    const small = B[3] - B[0] < 1.2 && B[4] - B[1] < 1.2 && B[5] - B[2] < 1.2;
    let w = cnt >= 0.85 * tot || (small && cnt > 0.5 * tot) ? best : null;
    // (a small piece standing on the front wing - a fence, an endplate's fin - goes with it)
    if (small && B[0] > FW_X - 0.08 && B[4] < 0.72 && B[1] < FW_Y) { const zc = (B[2] + B[5]) / 2; w = Math.abs(zc) > FW_SIDE ? (zc > 0 ? 'fwL' : 'fwR') : 'fw'; }
    whole.set(id, w);
    if (process.env.DEBUG_PIECES && B[0] > -0.6 && B[3] < 1.1 && B[1] > 0.55 && B[5] - B[2] > 0.3) console.log('piece', pr.node, pr.mat.k, 'tris', tot, 'votes', JSON.stringify(v), 'box', B.map((x) => x.toFixed(2)).join(','), '->', whole.get(id));
  }
  // (the pieces inside a wheel: whole, to it - wheelOf)
  if (piece) {
    const verts = new Map(); for (let t = 0; t < nt; t++) { const V = verts.get(piece[t]) || verts.set(piece[t], new Set()).get(piece[t]); for (let j = 0; j < 3; j++) V.add(idx[t * 3 + j]); }
    if (pr.mat.k !== 'paint') for (const [id, V] of verts) { const w = wheelOf(pos, V); if (w) whole.set(id, w); }   // (paint stays the body's: it is painted where it is)
  }
  // (a wheel's parts in its own frame: about its hub, its axis along z)
  const add = (part, T) => {
    if (part[0] === 'w') { const H = HUB[part.slice(0, 3)]; T = { p: [], n: [], u: T.u, s: T }; for (let j = 0; j < 3; j++) { T.p.push(...unrot(H.q, [T.s.p[j * 3] - H.c[0], T.s.p[j * 3 + 1] - H.c[1], T.s.p[j * 3 + 2] - H.c[2]])); T.n.push(...unrot(H.q, T.s.n.slice(j * 3, j * 3 + 3))); } }
    const P = parts[part] || (parts[part] = {}), G = P[pr.mat.k] || (P[pr.mat.k] = { mat: pr.mat, pos: [], nrm: [], uv: [] }); G.pos.push(...T.p); G.nrm.push(...T.n); G.uv.push(...T.u);
  };
  for (let t = 0; t < nt; t++) {
    const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2], cx = cen[t * 3], cy = cen[t * 3 + 1], cz = cen[t * 3 + 2];
    const T = { p: [], n: [], u: [] }; for (const i of [a, b, c]) { T.p.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); T.n.push(nrm[i * 3], nrm[i * 3 + 1], nrm[i * 3 + 2]); T.u.push(uv[i * 2], uv[i * 2 + 1]); }
    const part = WHEEL.has(pr.node) ? 'w' + (cx > 0 ? 'F' : 'R') + (cz > 0 ? 'R' : 'L') : SW.has(pr.node) ? 'sw' : SPECIAL[pr.node] || whole.get(piece[t]) || regionOf(cx, cy, cz);
    // (a front wing element spanning the wing: cut clean along the lines where its outer thirds come away)
    if ((part === 'fw' || part === 'fwL' || part === 'fwR') && piece && !whole.get(piece[t])) {
      const [inR, outL] = clipZ(T, FW_SIDE);
      for (const Q of outL) add('fwL', Q);
      for (const Q of inR) { const [outR, mid] = clipZ(Q, -FW_SIDE); for (const W of outR) add('fwR', W); for (const W of mid) add('fw', W); }
      continue;
    }
    // (the halo out of the body's shell: cut clean along its foot, HALO.y0 - what stays are its mounts)
    if (part === 'halo' && piece && !whole.get(piece[t])) { const [lo, hi] = clipZ(T, HALO.y0, 1); for (const Q of lo) add('body', Q); for (const Q of hi) add('halo', Q); continue; }
    if (part === 'body' && piece && !whole.get(piece[t]) && cy > HALO.y0 - 0.06 && cy < HALO.y0 + 0.06 && cx > HALO.x0 && cx < HALO.x1 && Math.abs(cz) < HALO.z && !(cx < HALO.airX && Math.abs(cz) < HALO.airZ)) {
      const [lo, hi] = clipZ(T, HALO.y0, 1); for (const Q of lo) add('body', Q); for (const Q of hi) add('halo', Q); continue;
    }
    add(part, T);
  }
}

// ---- pivots: the flap's leading edge, the steering wheel's centre (the wheels are in their own frames already)
const pivot = {};
{
  // the flap: about its leading edge (its front-most points' mean height)
  let fx = -1e9, xs = []; for (const G of Object.values(parts.drs || {})) for (let i = 0; i < G.pos.length; i += 3) { fx = Math.max(fx, G.pos[i]); xs.push([G.pos[i], G.pos[i + 1]]); }
  const front = xs.filter(([x]) => x > fx - 0.03); pivot.drs = [fx, front.reduce((sum, [, y]) => sum + y, 0) / Math.max(1, front.length), 0];
  // the steering wheel: about the middle of its display (Object_26, the LCD), turning about the display's normal - the
  // column's axis (forward-pointing)
  const L = prims.find((q) => q.node === 'Object_26'), c = [0, 0, 0]; let nn = [0, 0, 0];
  for (let i = 0; i < L.pos.length / 3; i++) for (let j = 0; j < 3; j++) c[j] += L.pos[i * 3 + j] / (L.pos.length / 3);
  for (let t = 0; t < L.idx.length; t += 3) { const P = [0, 1, 2].map((j) => [0, 1, 2].map((k) => L.pos[L.idx[t + j] * 3 + k])), u = P[1].map((x, k) => x - P[0][k]), v = P[2].map((x, k) => x - P[0][k]); const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]; if (n[0] < 0) n.forEach((x, k) => (n[k] = -x)); nn = nn.map((x, k) => x + n[k]); }
  const nl = Math.hypot(...nn); nn = nn.map((x) => x / nl);
  pivot.sw = c; pivot.swAxis = nn;
}
// the wings' and the halo's: what they turn about when they are damaged (the front wing on the nose; its outer thirds
// at their cut; the rear wing at its pylon's foot)
pivot.fw = [2.05, 0.14, 0]; pivot.fwL = [2.35, 0.12, FW_SIDE]; pivot.fwR = [2.35, 0.12, -FW_SIDE]; pivot.rw = [-2.1, 0.62, 0];

// ---------------------------------------------------------------------------------------------------------------------
// geometry tools: weld a triangle soup, simplify, sample colours
/** a triangle soup (flat arrays) welded on position + normal + uv: { pos, nrm, uv, idx } */
function weld(G) {
  const map = new Map(), pos = [], nrm = [], uv = [], idx = [];
  const q = (x, s) => Math.round(x * s);
  for (let i = 0; i < G.pos.length / 3; i++) {
    const key = `${q(G.pos[i * 3], 1e4)},${q(G.pos[i * 3 + 1], 1e4)},${q(G.pos[i * 3 + 2], 1e4)},${q(G.nrm[i * 3], 100)},${q(G.nrm[i * 3 + 1], 100)},${q(G.nrm[i * 3 + 2], 100)},${q(G.uv[i * 2], 4096)},${q(G.uv[i * 2 + 1], 4096)}`;
    let k = map.get(key);
    if (k === undefined) { k = pos.length / 3; map.set(key, k); pos.push(G.pos[i * 3], G.pos[i * 3 + 1], G.pos[i * 3 + 2]); nrm.push(G.nrm[i * 3], G.nrm[i * 3 + 1], G.nrm[i * 3 + 2]); uv.push(G.uv[i * 2], G.uv[i * 2 + 1]); }
    idx.push(k);
  }
  return { pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), uv: Float32Array.from(uv), idx: Uint32Array.from(idx) };
}
/** a mesh welded again by position and colour (the uvs dropped) and, with nq, its normals quantized by 1/nq (else averaged) */
function reweld(M, nq) {
  const map = new Map(), pos = [], nrm = [], col = [], cnt = [], remap = new Uint32Array(M.pos.length / 3);
  const q = (x, s) => Math.round(x * s);
  for (let i = 0; i < M.pos.length / 3; i++) {
    let key = `${q(M.pos[i * 3], 2e3)},${q(M.pos[i * 3 + 1], 2e3)},${q(M.pos[i * 3 + 2], 2e3)},${q(M.col[i * 4], 24)},${q(M.col[i * 4 + 1], 24)},${q(M.col[i * 4 + 2], 24)},${q(M.col[i * 4 + 3], 4)}`;
    if (nq) key += `,${q(M.nrm[i * 3], nq)},${q(M.nrm[i * 3 + 1], nq)},${q(M.nrm[i * 3 + 2], nq)}`;
    let k = map.get(key);
    if (k === undefined) { k = pos.length / 3; map.set(key, k); pos.push(M.pos[i * 3], M.pos[i * 3 + 1], M.pos[i * 3 + 2]); nrm.push(0, 0, 0); col.push(M.col[i * 4], M.col[i * 4 + 1], M.col[i * 4 + 2], M.col[i * 4 + 3]); }
    for (let j = 0; j < 3; j++) nrm[k * 3 + j] += M.nrm[i * 3 + j];
    remap[i] = k;
  }
  for (let k = 0; k < nrm.length / 3; k++) { const l = Math.hypot(nrm[k * 3], nrm[k * 3 + 1], nrm[k * 3 + 2]) || 1; for (let j = 0; j < 3; j++) nrm[k * 3 + j] /= l; }
  const idx = new Uint32Array(M.idx.length); for (let i = 0; i < idx.length; i++) idx[i] = remap[M.idx[i]];
  return { pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), uv: new Float32Array(pos.length / 3 * 2), col: Float32Array.from(col), idx };
}
/** keep `share` of the triangles (meshoptimizer: normals weighted in, uv seams kept) */
function simplify(M, share, prune = false, attrs = null, weights = null, error = 0.08) {
  const target = Math.max(3, Math.floor(M.idx.length * share / 3) * 3);
  if (target >= M.idx.length) return M;
  const A = attrs || M.nrm, W = weights || [0.5, 0.5, 0.5];
  const [idx] = MeshoptSimplifier.simplifyWithAttributes(M.idx, M.pos, 3, A, W.length, W, null, target, error, prune ? ['Prune'] : []);
  return compact({ ...M, idx });
}
/** drop the vertices no triangle uses */
function compact(M) {
  const remap = new Int32Array(M.pos.length / 3).fill(-1); let n = 0;
  const idx = new Uint32Array(M.idx.length);
  for (let i = 0; i < M.idx.length; i++) { let k = remap[M.idx[i]]; if (k < 0) { k = remap[M.idx[i]] = n++; } idx[i] = k; }
  const out = { idx };
  for (const [key, size] of [['pos', 3], ['nrm', 3], ['uv', 2], ['col', 4]]) {
    if (!M[key]) continue; const a = new Float32Array(n * size);
    for (let i = 0; i < remap.length; i++) if (remap[i] >= 0) for (let j = 0; j < size; j++) a[remap[i] * size + j] = M[key][i * size + j];
    out[key] = a;
  }
  return out;
}
/** vertex colours (linear, 0..1) from the material's texture; alpha: 1 paint (the livery), 0.5 the tyre's compound band, 0 */
function colours(M, mat) {
  const n = M.pos.length / 3, col = new Float32Array(n * 4), c = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    let r, g, b, a = 0;
    if (mat.k === 'paint') { r = g = b = 0.6; a = 1; }
    else if (mat.k === 'tcam') { r = 0.9; g = 0.75; b = 0.1; a = 0.25; }   // (the T-cam: its own colour, CarModel)
    else if (mat.k === 'number') { r = g = b = 0.9; }
    else if (mat.tex) {
      sample(mat.tex, M.uv[i * 2], M.uv[i * 2 + 1], c); r = c[0]; g = c[1]; b = c[2];
      if (mat.k === 'tyre' && r > 0.45 && g < 0.25 && b < 0.25) { a = 0.5; }
    } else [r, g, b] = mat.color.map((x) => x ** (1 / 2.2));
    col[i * 4] = srgbToLin(r); col[i * 4 + 1] = srgbToLin(g); col[i * 4 + 2] = srgbToLin(b); col[i * 4 + 3] = a;
  }
  return col;
}
function merge(list) {
  let nv = 0, ni = 0; for (const M of list) { nv += M.pos.length / 3; ni += M.idx.length; }
  const out = { pos: new Float32Array(nv * 3), nrm: new Float32Array(nv * 3), uv: new Float32Array(nv * 2), col: new Float32Array(nv * 4), idx: new Uint32Array(ni) };
  let ov = 0, oi = 0;
  for (const M of list) {
    out.pos.set(M.pos, ov * 3); out.nrm.set(M.nrm, ov * 3); out.uv.set(M.uv, ov * 2); out.col.set(M.col, ov * 4);
    for (let i = 0; i < M.idx.length; i++) out.idx[oi + i] = M.idx[i] + ov;
    ov += M.pos.length / 3; oi += M.idx.length;
  }
  return out;
}
const tris = (M) => M.idx.length / 3;

// ---------------------------------------------------------------------------------------------------------------------
// the levels, written into one binary
const chunks = [], bin = [];
let off = 0;
function put(arr) { const b = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength); const pad = (4 - (off % 4)) % 4; if (pad) { bin.push(Buffer.alloc(pad)); off += pad; } const o = off; bin.push(b); off += b.length; return o; }
/** a chunk: positions quantized to 16 bits in its box (about its pivot), normals 8 bits, uvs 16 bits in their range, colours 8 bits */
function chunk(M, pv, opts) {
  const n = M.pos.length / 3, mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  const P = new Float32Array(n * 3); for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) { const v = M.pos[i * 3 + j] - pv[j]; P[i * 3 + j] = v; mn[j] = Math.min(mn[j], v); mx[j] = Math.max(mx[j], v); }
  const q = new Uint16Array(n * 3); for (let i = 0; i < n * 3; i++) { const j = i % 3, s = mx[j] - mn[j] || 1; q[i] = Math.round((P[i] - mn[j]) / s * 65535); }
  const nn = new Int8Array(n * 4); for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) nn[i * 4 + j] = Math.round(Math.max(-1, Math.min(1, M.nrm[i * 3 + j])) * 127);
  const c = { n, t: M.idx.length / 3, box: [mn, mx].map((v) => v.map((x) => +x.toFixed(5))), pos: put(q), nrm: put(nn) };
  if (opts.uv) {
    let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9; for (let i = 0; i < n; i++) { u0 = Math.min(u0, M.uv[i * 2]); u1 = Math.max(u1, M.uv[i * 2]); v0 = Math.min(v0, M.uv[i * 2 + 1]); v1 = Math.max(v1, M.uv[i * 2 + 1]); }
    const uq = new Uint16Array(n * 2); for (let i = 0; i < n; i++) { uq[i * 2] = Math.round((M.uv[i * 2] - u0) / ((u1 - u0) || 1) * 65535); uq[i * 2 + 1] = Math.round((M.uv[i * 2 + 1] - v0) / ((v1 - v0) || 1) * 65535); }
    c.uvr = [u0, v0, u1, v1].map((x) => +x.toFixed(6)); c.uv = put(uq);
  }
  if (opts.col) { const cq = new Uint8Array(n * 4); for (let i = 0; i < n * 4; i++) cq[i] = Math.round(Math.max(0, Math.min(1, M.col[i])) * 255); c.col = put(cq); }
  const big = n > 65535, I = big ? Uint32Array.from(M.idx) : Uint16Array.from(M.idx);
  c.idx = put(I); c.i32 = big;
  return c;
}

const out = { version: 1, credit: 'This work is based on "2026 Redbull RB22" (https://sketchfab.com/3d-models/2026-redbull-rb22-0a3d24a58e0549d591a5a48c22eec383) by Dave Love SketchFab (https://sketchfab.com/Tyler_Dave) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/). Its livery, decals and numbers are not used.',
  hubs: Object.fromEntries(Object.entries(HUB).map(([k, b]) => [k, { c: b.c.map((x) => +x.toFixed(5)), q: b.q.map((x) => +x.toFixed(6)), r: +b.r.toFixed(4), w: +b.w.toFixed(4) }])),
  pivots: Object.fromEntries(Object.entries(pivot).map(([k, v]) => [k, v.map((x) => +x.toFixed(4))])),
  materials: Object.fromEntries(Object.values(MATS).map((m) => [m.k, { tex: m.tex || null, nrm: m.nrm || null, rough: m.rough ?? 0.5, metal: m.metal ?? 0, color: m.color || null, alpha: !!m.alpha }])),
  parts: {} };
const report = [];
for (const [name, mats] of Object.entries(parts)) {
  const pv = pivot[name] || [0, 0, 0], P = (out.parts[name] = { pivot: pv, lv: [] });
  // levels 0 and 1: one chunk per material (welded, simplified)
  const L0 = {}, L1 = {}, colored = [];
  let total0 = 0;
  for (const [k, G] of Object.entries(mats)) {
    const W = weld(G), m0 = simplify(W, KEEP0[k] ?? 1);
    m0.col = colours(m0, G.mat); colored.push(m0); total0 += tris(m0);
    const uv = !!G.mat.tex || k === 'number';
    L0[k] = chunk(m0, pv, { uv });
    if (!(DROP1.has(k) || (name === 'sw'))) { const m1 = simplify(m0, (KEEP1[k] ?? 0.25) / (KEEP0[k] ?? 1)); L1[k] = chunk(m1, pv, { uv }); }
  }
  P.lv.push(L0, L1);
  // levels 2-4: everything of the part in one vertex-coloured mesh (the paint flagged), simplified from level 0
  if (name !== 'sw' && name !== 'number') {
    const merged = merge(colored);
    for (let l = 2; l <= 4; l++) {
      const all = reweld(merged, LV[l].nq), want = Math.max(LV[l].min, total0 * LV[l].share) / tris(all);
      const attrs = new Float32Array(all.pos.length / 3 * 7); for (let i = 0; i < all.pos.length / 3; i++) { for (let j = 0; j < 3; j++) attrs[i * 7 + j] = all.nrm[i * 3 + j]; for (let j = 0; j < 4; j++) attrs[i * 7 + 3 + j] = all.col[i * 4 + j]; }
      const m = simplify(all, want, !!LV[l].prune, attrs, [0.3, 0.3, 0.3, 0.6, 0.6, 0.6, 2], LV[l].err);
      P.lv.push({ all: chunk(m, pv, { col: true }) });
    }
  }
  report.push(`${name.padEnd(7)} ` + P.lv.map((L, i) => `L${i} ${Object.values(L).reduce((s, c) => s + c.t, 0)}`).join('  '));
}
fs.mkdirSync(OUT, { recursive: true });
const raw = Buffer.concat(bin), gz = zlib.gzipSync(raw, { level: 9 });
fs.writeFileSync(path.join(OUT, 'car.bin.gz'), gz);
fs.writeFileSync(path.join(OUT, 'car.json'), JSON.stringify(out));
console.log(report.join('\n'));
const sum = (l) => Object.values(out.parts).reduce((s, P) => s + (P.lv[l] ? Object.values(P.lv[l]).reduce((a, c) => a + c.t, 0) : 0), 0);
console.log(`triangles by level: ${[0, 1, 2, 3, 4].map(sum).join(' / ')}; car.bin ${(raw.length / 1e6).toFixed(2)} MB, gzipped ${(gz.length / 1e6).toFixed(2)} MB`);
console.log('hubs', JSON.stringify(out.hubs), 'pivots', JSON.stringify(out.pivots));
