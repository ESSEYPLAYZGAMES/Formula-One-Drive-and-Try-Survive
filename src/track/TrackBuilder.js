// Centerline -> spline -> uniform arc-length samples with frames/curvature,
// spatial hash for nearest-point queries, and the road/kerb/run-off/barrier meshes.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { giveMaterial } from '../world/BarrierGive.js';
import { kerbTexture, barrierAtlas, atlasU, runoffTextTexture, RUNOFF_DECAL_LEN, ZONE_SEQ, ZONE_LEN, PANEL_LEN } from './Branding.js';

const DS = 2.0;              // sample spacing (m)
const CELL = 24;             // spatial hash cell (m)
const GRAVEL_IN = 2.0;       // grass between the kerb line and a gravel trap (m)
const APRON_EDGE = 1.5;      // grass between an escape area and the barrier behind it (m)
const GREEN_W = 1.6;         // painted green strip behind a permanent circuit's kerbs (m)
/**
 * Distance (m) beyond which a thin track detail is not drawn: a 25 cm white line or a 1.6 m green strip is under a
 * pixel long before that, and the fog has it anyway. Road, paved run-off and gravel stay to the horizon.
 */
export const DETAIL_CUT = { lines: 700, kerbs: 900, green: 700, panels: 1100, tyreWall: 900, caps: 900, fences: 800, rails: 900, armco: 900, pitDetail: 900 };
/** barrier types at the wall line */
export const BAR = { NONE: 0, ARMCO: 1, TYRES: 2, WALL: 3 };
/** what a barrier gives to a car that hits it (Track.giveL / giveR, Car.js BARRIER): the BAR codes, and a soft wall -
 *  SAFER / TecPro, energy-absorbing - drawn as what stands there */
export const GIVE = { NONE: 0, ARMCO: 1, TYRES: 2, WALL: 3, SOFT: 4 };
const GIVE_NAME = { wall: GIVE.WALL, soft: GIVE.SOFT, tyres: GIVE.TYRES, armco: GIVE.ARMCO };
/** how tall each barrier type stands (m): Armco, a tyre wall, a concrete wall with its debris fence; a catch fence 4 m */
export const BAR_HEIGHT = [0, 0.85, 1.3, 4.2], FENCE_H = 4.0;
/** point-in-footprint test over a set of rings (bounding boxes first) */
function insideRings(rings) {
  const boxes = rings.map((r) => { let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity; for (const p of r) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < z0) z0 = p[1]; if (p[1] > z1) z1 = p[1]; } return [x0, z0, x1, z1]; });
  return (x, z) => { for (let k = 0; k < rings.length; k++) { const b = boxes[k]; if (x < b[0] || x > b[2] || z < b[1] || z > b[3]) continue; const r = rings[k]; let hit = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { if ((r[i][1] > z) !== (r[j][1] > z) && x < (r[j][0] - r[i][0]) * (z - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) hit = !hit; } if (hit) return true; } return false; };
}

// ---------------------------------------------------------------------------
// Geometry pre-processing
// ---------------------------------------------------------------------------
function densify(pts, step, closed) {
  const out = [];
  const n = pts.length, m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.ceil(d / step));
    for (let j = 0; j < k; j++) { const t = j / k; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

/** Gaussian smoothing along the polyline: turns single-node OSM corners into drivable fillets (radius ~15-20 m). */
function smoothCorners(pts, sigmaSamples, closed) {
  const n = pts.length, r = Math.ceil(sigmaSamples * 3);
  const w = []; let ws = 0;
  for (let k = -r; k <= r; k++) { const g = Math.exp(-(k * k) / (2 * sigmaSamples * sigmaSamples)); w.push(g); ws += g; }
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    let x = 0, z = 0;
    for (let k = -r; k <= r; k++) {
      let j = i + k;
      if (closed) j = (j + n) % n; else j = Math.min(n - 1, Math.max(0, j));
      x += pts[j][0] * w[k + r]; z += pts[j][1] * w[k + r];
    }
    out[i] = [x / ws, z / ws];
  }
  return out;
}

/**
 * Replace sharp polyline vertices with tangent circular arcs. Tight corners (> 45Â°) get radius rTight,
 * medium bends a larger radius; gentle vertices (< 6Â°) are left alone. Keeps 90Â° corners crisp and constant-radius.
 */
function filletPolyline(pts, closed, rTight = 22, rMedium = 55) {
  const n = pts.length, out = [];
  const m = closed ? n : n - 2;
  if (!closed) out.push(pts[0]);
  for (let k = 0; k < m; k++) {
    const i = closed ? k : k + 1;
    const P = pts[i], A = pts[(i - 1 + n) % n], B = pts[(i + 1) % n];
    let ax = P[0] - A[0], az = P[1] - A[1], bx = B[0] - P[0], bz = B[1] - P[1];
    const la = Math.hypot(ax, az) || 1, lb = Math.hypot(bx, bz) || 1; ax /= la; az /= la; bx /= lb; bz /= lb;
    const dot = Math.max(-1, Math.min(1, ax * bx + az * bz)); const theta = Math.acos(dot);
    if (theta < 6 * Math.PI / 180 || theta > 170 * Math.PI / 180) { out.push(P); continue; }
    const R = theta > Math.PI / 4 ? rTight : rMedium;
    let t = R * Math.tan(theta / 2);
    const tMax = 0.48 * Math.min(la, lb);
    if (t > tMax) t = tMax;
    const Rr = t / Math.tan(theta / 2);
    const start = [P[0] - ax * t, P[1] - az * t], end = [P[0] + bx * t, P[1] + bz * t];
    // arc centre: offset from start perpendicular to the incoming direction, on the turning side
    const turn = Math.sign(ax * bz - az * bx) || 1;          // +1: turning toward the (-az, ax) side
    const cx = start[0] - az * turn * Rr, cz = start[1] + ax * turn * Rr;
    const a0 = Math.atan2(start[1] - cz, start[0] - cx), a1 = Math.atan2(end[1] - cz, end[0] - cx);
    let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    const segs = Math.max(3, Math.ceil(Math.abs(da) * Rr / 3));
    for (let j = 0; j <= segs; j++) { const a = a0 + da * j / segs; out.push([cx + Math.cos(a) * Rr, cz + Math.sin(a) * Rr]); }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

/**
 * Ease carriageway jogs: where the chain steps sideways between two parallel OSM ways (one short segment across, the
 * road on both sides running on in the same direction), the step is spread as a smoothstep S over `spread` metres
 * of the road around it instead of a 20 m sidestep that the spline turns into a pair of 15 m hairpins.
 */
function easeJogs(pts, closed, { maxSeg = 35, minDev = 25, base = 60, spread = 160 } = {}) {
  if (!closed) return pts;
  const n = pts.length, dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const walk = (k, dir, len) => {   // index reached walking `len` metres along the chain from vertex k
    let acc = 0, j = k;
    for (let c = 0; c < n - 2 && acc < len; c++) { const nj = closed ? (j + dir + n) % n : j + dir; if (nj < 0 || nj >= n) break; acc += dist(pts[j], pts[nj]); j = nj; }
    return j;
  };
  for (let k = 0; k < (closed ? n : n - 1); k++) {
    const p = pts[k], q = pts[(k + 1) % n], seg = dist(p, q);
    if (seg > maxSeg || seg < 1e-3) continue;
    const a = pts[walk(k, -1, base)], b = pts[walk((k + 1) % n, 1, base)];
    const la = dist(a, p), lb = dist(q, b); if (la < base * 0.6 || lb < base * 0.6) continue;
    const ui = [(p[0] - a[0]) / la, (p[1] - a[1]) / la], uo = [(b[0] - q[0]) / lb, (b[1] - q[1]) / lb];
    if (ui[0] * uo[0] + ui[1] * uo[1] < Math.cos(20 * Math.PI / 180)) continue;   // a real corner, not a jog
    const sx = (q[0] - p[0]) / seg, sz = (q[1] - p[1]) / seg;
    if (Math.acos(Math.min(1, Math.abs(ui[0] * sx + ui[1] * sz))) < minDev * Math.PI / 180) continue;
    const along = (q[0] - p[0]) * ui[0] + (q[1] - p[1]) * ui[1];
    const H = [q[0] - p[0] - ui[0] * along, q[1] - p[1] - ui[1] * along];   // the sideways part of the step
    if (Math.hypot(H[0], H[1]) < 3) continue;
    // the road around the step, densified (4 m), each side shifted toward the other along a smoothstep
    const ia = walk(k, -1, spread / 2), ib = walk((k + 1) % n, 1, spread / 2);
    const before = [], after = [];
    for (let j = ia; j !== k; j = (j + 1) % n) before.push(...densify([pts[j], pts[(j + 1) % n]], 4, false).slice(0, -1));
    before.push(p);
    for (let j = (k + 1) % n; j !== ib; j = (j + 1) % n) after.push(...densify([pts[j], pts[(j + 1) % n]], 4, false).slice(0, -1));
    after.push(pts[ib]);
    const run = [...before, ...after], cum = [0];
    for (let i = 1; i < run.length; i++) cum.push(cum[i - 1] + (i === before.length ? along : dist(run[i - 1], run[i])));
    const tot = cum[cum.length - 1];
    const eased = run.map((pt, i) => {
      const t = cum[i] / tot, w = t * t * (3 - 2 * t), sh = i < before.length ? w : w - 1;   // before: 0 -> +H/2, after: -H/2 -> 0
      return [pt[0] + H[0] * sh, pt[1] + H[1] * sh];
    });
    // (p and q now differ only by the step's along-road part.) Splice the eased run in place of vertices ia..ib (the chain may wrap past index 0 on a closed circuit)
    const keep = []; for (let j = ib; j !== ia; j = (j + 1) % n) keep.push(pts[j]);
    const out = [...eased.slice(0, -1), ...keep];
    return easeJogs(out, closed, { maxSeg, minDev, base, spread });   // (the next jog, if any)
  }
  return pts;
}

export function buildSpline(rawPts, { closed = true, filletSigma = 6, step = 4, tension = 0.5, rTight = 22, rMedium = 55, fillet = true } = {}) {
  // fillets turn the single-node corners of OSM streets into arcs; a surveyed raceway line is already a smooth
  // polyline, where fillets would only add tight micro-arcs at every vertex (fillet: false)
  if (fillet) rawPts = easeJogs(rawPts, closed);
  let pts = fillet ? filletPolyline(rawPts, closed, rTight, rMedium) : rawPts;
  pts = densify(pts, step, closed);
  pts = smoothCorners(pts, filletSigma / step, closed);
  const v3 = pts.map((p) => new THREE.Vector3(p[0], 0, p[1]));
  const curve = new THREE.CatmullRomCurve3(v3, closed, 'catmullrom', tension);
  curve.arcLengthDivisions = Math.max(400, pts.length * 2);
  return curve;
}

/** Uniform samples along a curve with tangent, left normal, signed curvature (left turn > 0) and arc length. */
export function sampleCurve(curve, closed, ds = DS) {
  const L = curve.getLength();
  const n = Math.max(8, Math.round(L / ds));
  const pts = curve.getSpacedPoints(closed ? n : n);
  if (closed) pts.pop();              // getSpacedPoints returns n+1 points incl. the duplicated start
  const N = pts.length;
  const px = new Float32Array(N), pz = new Float32Array(N), tx = new Float32Array(N), tz = new Float32Array(N);
  const nx = new Float32Array(N), nz = new Float32Array(N), curv = new Float32Array(N), s = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    px[i] = p.x; pz[i] = p.z;
    const a = pts[closed ? (i - 1 + N) % N : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % N : Math.min(N - 1, i + 1)];
    let dx = b.x - a.x, dz = b.z - a.z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    tx[i] = dx; tz[i] = dz; nx[i] = dz; nz[i] = -dx;   // left normal = up x t
    s[i] = i * (L / (closed ? N : N - 1));
  }
  for (let i = 0; i < N; i++) {
    const i0 = closed ? (i - 1 + N) % N : Math.max(0, i - 1), i1 = closed ? (i + 1) % N : Math.min(N - 1, i + 1);
    const cross = tz[i0] * tx[i1] - tx[i0] * tz[i1];   // (t0 x t1).y  -> positive for a left turn (east -> north)
    const dot = tx[i0] * tx[i1] + tz[i0] * tz[i1];
    const dth = Math.atan2(cross, dot);
    curv[i] = dth / (s[i1] - s[i0] || ds * 2) * (closed ? 1 : 1);
    if (!closed && (i === 0 || i === N - 1)) curv[i] = 0;
  }
  // light smoothing of curvature (numerical noise)
  const c2 = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let acc = 0, cnt = 0;
    for (let k = -2; k <= 2; k++) { let j = i + k; if (closed) j = (j + N) % N; else if (j < 0 || j >= N) continue; acc += curv[j]; cnt++; }
    c2[i] = acc / cnt;
  }
  return { n: N, length: L, ds: L / (closed ? N : N - 1), px, pz, tx, tz, nx, nz, curv: c2, s, closed };
}

/** Rotate a closed sample set so that index 0 is the sample nearest (x, z) (e.g. the start/finish line). */
export function rotateSamples(sm, x, z) {
  let k = 0, bd = Infinity;
  for (let i = 0; i < sm.n; i++) { const d = (sm.px[i] - x) ** 2 + (sm.pz[i] - z) ** 2; if (d < bd) { bd = d; k = i; } }
  if (k === 0) return sm;
  const rot = (a) => { const o = new Float32Array(sm.n); for (let i = 0; i < sm.n; i++) o[i] = a[(i + k) % sm.n]; return o; };
  const out = { ...sm, px: rot(sm.px), pz: rot(sm.pz), tx: rot(sm.tx), tz: rot(sm.tz), nx: rot(sm.nx), nz: rot(sm.nz), curv: rot(sm.curv), s: new Float32Array(sm.n) };
  for (let i = 0; i < sm.n; i++) out.s[i] = i * sm.ds;
  return out;
}

// ---------------------------------------------------------------------------
// Track object (samples + queries)
// ---------------------------------------------------------------------------
export class Track {
  constructor(samples, def) {
    Object.assign(this, samples);
    this.def = def;
    this.halfWidth = def.width / 2;
    this.kerbWidth = 1.2;
    // the road's half width per sample: halfWidth everywhere, wider where def.widths opens it out (widen())
    this.hw = new Float32Array(this.n).fill(this.halfWidth); this.maxHalfWidth = this.halfWidth;
    // ... and per side (the wider of the two is hw): a corner widened on its outside only - the inside keeps clear of a
    // pit lane or another part of the lap, and an inside edge pushed out past the corner's radius would fold the road
    this.hwL = new Float32Array(this.n).fill(this.halfWidth); this.hwR = new Float32Array(this.n).fill(this.halfWidth);
    // A street circuit (def.verge unset) is walled in: 3 m of paved verge, then concrete. A permanent circuit
    // (def.verge = 'circuit') has grass verges, gravel or asphalt run-offs and its barriers far back.
    // def.verge = 'park' (Montreal): a permanent circuit's grass verges, kerbs, gravel and asphalt run-offs, but walled
    // in all the way round like a street circuit (the concrete of Ile Notre-Dame, a few metres off the white line)
    this.circuit = def.verge === 'circuit' || def.verge === 'park';
    this.walled = def.verge === 'park';
    this.runoffWidth = def.vergeWidth ?? 3.0;
    this.minWall = this.halfWidth + this.kerbWidth + 3.0;                     // a barrier never stands closer than this (11.7 m)
    this.barrierOffset = this.halfWidth + this.kerbWidth + this.runoffWidth;  // where it stands along a plain straight
    this._grid = new Map();
    for (let i = 0; i < this.n; i++) {
      const k = this._cellKey(this.px[i], this.pz[i]);
      let arr = this._grid.get(k); if (!arr) { arr = []; this._grid.set(k, arr); } arr.push(i);
    }
    this.cornerZones = this._detectCorners();
    this.inCorner = new Uint8Array(this.n);
    for (let i = 0; i < this.n; i++) this.inCorner[i] = this.inCornerZone(i) ? 1 : 0;   // where the kerbs are
    // a permanent circuit's exit kerbs run on well past the corner (cars use all of them on the way out)
    if (this.circuit) for (const z of this.cornerZones) for (let k = 1; k <= Math.round(70 / this.ds); k++) this.inCorner[(z.b + k) % this.n] = 1;
    this.apronL = new Int16Array(this.n).fill(-1); this.apronR = new Int16Array(this.n).fill(-1);   // corner zone whose escape area a sample belongs to
    this.surfL = new Uint8Array(this.n); this.surfR = new Uint8Array(this.n);                       // escape-area surface: 0 grass, 1 asphalt, 2 gravel
    // what stands at the wall line, per side: BAR.NONE / ARMCO / TYRES / WALL. A street circuit is walled in all
    // the way round; a permanent circuit gets barriers only where something stands behind the verge (layoutBarriers)
    this.barL = new Uint8Array(this.n).fill(BAR.WALL); this.barR = new Uint8Array(this.n).fill(BAR.WALL);
    this.capL = new Uint8Array(this.n); this.capR = new Uint8Array(this.n);                         // why the wall line was pulled in: 1 a building / stand, 2 another part of the lap
    this._layoutRunoff();
  }

  /**
   * Barriers of a permanent circuit. Most of Silverstone has none: grass verges and run-offs simply end in more
   * grass. A barrier stands only where something is behind it: a tyre wall with banners in front of grandstands and
   * buildings (within 15 m of the verge line), Armco between two parts of the lap that run close together, the
   * concrete pit wall (set by buildPitLane). Short gaps between barrier runs are closed, runs are extended 15 m.
   */
  layoutBarriers(rings) {
    if (!this.circuit) return;
    if (this.walled) {
      // a walled park circuit: concrete everywhere, except across the back of a deep escape area, where the wall
      // gives way to a run of TecPro / tyre barrier under its banners
      const deep = this.barrierOffset + 9;
      for (const [bar, wall] of [[this.barL, this.wallL], [this.barR, this.wallR]]) for (let i = 0; i < this.n; i++) bar[i] = wall[i] > deep ? BAR.TYRES : BAR.WALL;
      return;
    }
    const inside = insideRings(rings), n = this.n;
    for (const [bar, cap, wall, side] of [[this.barL, this.capL, this.wallL, 1], [this.barR, this.capR, this.wallR, -1]]) {
      const raw = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        if (cap[i] === 2) { raw[i] = this.def.selfArmco === false ? 0 : BAR.ARMCO; continue; }   // (def.selfArmco false: open grass between the two, Austin's hairpins)
        if (cap[i] === 1) { raw[i] = BAR.TYRES; continue; }
        for (let d = wall[i]; d <= wall[i] + 15; d += 2) if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { raw[i] = BAR.TYRES; break; }
      }
      const ext = Math.round(15 / this.ds), gap = Math.round(25 / this.ds);
      for (let i = 0; i < n; i++) { let b = 0; for (let k = -ext; k <= ext; k++) b = Math.max(b, raw[(i + k + n) % n]); bar[i] = b; }
      // close short gaps (a barrier with a 20 m hole in it is not a thing)
      for (let i = 0; i < n; i++) {
        if (bar[i] || !bar[(i - 1 + n) % n]) continue;
        let k = 0; while (k <= gap && !bar[(i + k) % n]) k++;
        if (k <= gap) for (let q = 0; q < k; q++) bar[(i + q) % n] = bar[(i - 1 + n) % n];
      }
    }
  }

  /**
   * What each barrier gives to a car that hits it (Car.js BARRIER), per sample and side: giveL / giveR. The barrier
   * line's own kind (barL / barR) - concrete, tyres, Armco - with soft walls (GIVE.SOFT: SAFER / TecPro) where they
   * stand: a walled park circuit's runs across the back of its escape areas are TecPro (Montreal). Then each corner of
   * def.barriers: [{ turn, side, from, to, kind, deep }] - side 'out' / 'in' of the corner, or 1 / -1 (left / right),
   * both when unset; from / to in metres from the apex; kind 'wall' | 'soft' | 'tyres' | 'armco'; deep: only where the
   * barrier stands at least that far beyond the usual line (the end wall of a run-off, not the walls beside the road
   * leading to it). It applies where a barrier stands, and changes nothing that is drawn. Call once the barrier lines
   * are final (main.js, after fairWalls); Car builds it if nobody did.
   */
  buildGive() {
    const n = this.n, gL = Uint8Array.from(this.barL), gR = Uint8Array.from(this.barR);
    if (this.walled) for (const g of [gL, gR]) for (let i = 0; i < n; i++) if (g[i] === BAR.TYRES) g[i] = GIVE.SOFT;
    for (const b of this.def.barriers || []) {
      const c = (this.def.corners || []).find((k) => k.n === b.turn); if (!c || c.s == null) continue;
      const kind = GIVE_NAME[b.kind]; if (kind == null) continue;
      const ci = this.idxAtS(c.s), z = this.cornerZones.find((q) => (q.a <= q.b ? ci >= q.a - 20 && ci <= q.b + 20 : ci >= q.a - 20 || ci <= q.b + 20)), dir = z ? z.dir : 1;
      const sides = b.side === 'out' ? [-dir] : b.side === 'in' ? [dir] : b.side === 1 || b.side === -1 ? [b.side] : [1, -1];
      const i0 = this.idxAtS(c.s + (b.from ?? -60)), m = Math.round(this.wrapS((b.to ?? 60) - (b.from ?? -60)) / this.ds);
      for (const side of sides) {
        const g = side > 0 ? gL : gR, bar = side > 0 ? this.barL : this.barR, wall = side > 0 ? this.wallL : this.wallR;
        for (let k = 0; k <= m; k++) { const i = (i0 + k) % n; if (bar[i] && (b.deep == null || wall[i] > this.barrierOffset + b.deep)) g[i] = kind; }
      }
    }
    this.giveL = gL; this.giveR = gR;
    return gL;
  }

  /**
   * What a car at lateral offset d of sample i is driving on (SURFACE codes of Car.js): 0 road, 1 kerb, 2 paved
   * run-off, 3 grass, 4 gravel. A street circuit is paved to the wall. On a permanent circuit the kerbs exist in the
   * corners only, a gravel trap starts 2 m of grass beyond the kerb line and ends short of the barrier, an asphalt
   * run-off starts at the kerb, and everything else is grass.
   */
  surface(i, d) {
    const ad = Math.abs(d), hw = d > 0 ? this.hwL[i] : this.hwR[i];
    if (ad <= hw) return 0;
    if (!this.circuit) return ad <= hw + this.kerbWidth ? 1 : 2;
    if (this.pitCovers && this.pitCovers[i] && d * this.pitSide > 0) return 2;
    // the paved infield (buildPitLane): the kerb, then paving - after the lane's own asphalt above, which has the strip
    // beside the road flat where the lane is near it (as it always had: the AI's line rides that edge out of T14)
    if (this.pitInfield && this.pitInfield[i] && d * this.pitSide > 0) return ad <= hw + this.kerbWidth && this.inCorner[i] ? 1 : 2;
    const t = d > 0 ? this.surfL[i] : this.surfR[i], wall = d > 0 ? this.wallL[i] : this.wallR[i];
    if (ad <= hw + this.kerbWidth) return this.inCorner[i] ? 1 : t === 1 ? 2 : 3;
    if (this.inCorner[i] && ad <= hw + this.kerbWidth + GREEN_W) return 2;   // the painted green strip behind the kerb
    if (t === 1) return ad < Math.min(wall - APRON_EDGE, hw + this.kerbWidth + this.apronMaxAt(i)) ? 2 : 3;
    if (t === 2) return ad > hw + this.kerbWidth + GRAVEL_IN && ad < wall - APRON_EDGE ? 4 : 3;
    return 3;
  }

  /**
   * Surface of every escape area, from the track definition: def.runoff = { asphalt: [turns], gravel: [turns] },
   * anything unlisted is gravel. Call after the corner zones have their turn numbers.
   */
  layoutSurfaces() {
    if (!this.circuit) return;
    const ro = this.def.runoff || {}, asphalt = ro.asphalt || [], grass = ro.grass || [];
    const kind = this.cornerZones.map((z) => { const ts = z.turns || [z.turn]; return ts.some((t) => grass.includes(t)) ? 0 : ts.some((t) => asphalt.includes(t)) ? 1 : 2; });
    // in front of a grandstand (extendToStands): gravel right up to its barrier, unless that corner's run-off is asphalt
    const front = (ap, st, i) => (ap[i] >= 0 && kind[ap[i]] === 1 ? 1 : 2);
    for (let i = 0; i < this.n; i++) {
      this.surfL[i] = this.standL?.[i] && this.wallL[i] > this.minWallAt(i, 1) + 3 ? front(this.apronL, this.standL, i) : this.apronL[i] >= 0 && this.wallL[i] > this.minWallAt(i, 1) + 6 ? kind[this.apronL[i]] : 0;
      this.surfR[i] = this.standR?.[i] && this.wallR[i] > this.minWallAt(i, -1) + 3 ? front(this.apronR, this.standR, i) : this.apronR[i] >= 0 && this.wallR[i] > this.minWallAt(i, -1) + 6 ? kind[this.apronR[i]] : 0;
    }
  }
  _cellKey(x, z) { return `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`; }

  /**
   * Per-sample barrier distance on each side (left / right of the centreline). The base is `barrierOffset`.
   * A run-off is an ESCAPE AREA, not a wider lane: on the outside of a corner the barrier keeps running straight
   * on along the approach direction (the tangent of the road at turn-in) while the road turns away from it, so a
   * car that locks up and goes straight has paved ground ahead of it. The straight wall is followed until the
   * apron would get deeper than the corner's cap (tight 42 m, medium 24 m, gentle 12 m) or the road has turned
   * away too far; from there the wall closes back to the base offset over 30 m. Real Vegas T1 is exactly this shape.
   */
  _layoutRunoff() {
    const n = this.n, bo = this.barrierOffset;
    this.wallL = new Float32Array(n).fill(bo); this.wallR = new Float32Array(n).fill(bo);
    const closeLen = Math.round(75 / this.ds);   // the apron eases back into the verge over 75 m (S-curve), no sharp kink
    const cross = (ax, az, bx, bz) => ax * bz - az * bx;
    for (let zi = 0; zi < this.cornerZones.length; zi++) {
      const z = this.cornerZones[zi];
      if (!z.dir) continue;
      const caps = this.def.runoffCaps || [42, 24, 12];
      const cap = z.maxCurv > 1 / 45 ? caps[0] : z.maxCurv > 1 / 90 ? caps[1] : caps[2];
      const side = -z.dir;                                        // left turn -> escape area on the right
      const arr = side > 0 ? this.wallL : this.wallR, ap = side > 0 ? this.apronL : this.apronR;
      for (let k = -Math.round(40 / this.ds); k < 0; k++) ap[(z.a + k + n) % n] = zi;   // the trap starts in the braking zone
      // the straight wall: the outer barrier line of the approach, through the turn-in point along its tangent
      const a = z.a; const qx = this.px[a] + this.nx[a] * side * bo, qz = this.pz[a] + this.nz[a] * side * bo;
      const tx = this.tx[a], tz = this.tz[a];
      const zoneLen = (z.b - z.a + n) % n; const post = Math.round(65 / this.ds);   // the straight wall runs on past the corner exit
      let k = 0, last = bo, closing = -1;
      for (; k < zoneLen + post + closeLen + 4; k++) {
        const i = (a + k) % n;
        ap[i] = zi;
        if (closing >= 0) {                                       // easing back to the verge: smoothstep, so the wall merges tangentially
          const t = Math.min(1, (k - closing) / closeLen); const e = t * t * (3 - 2 * t); const v = last + (bo - last) * e;
          arr[i] = Math.max(arr[i], v); if (t >= 1) break; continue;
        }
        // distance d along this sample's outward normal to the straight wall line
        const rx = this.nx[i] * side, rz = this.nz[i] * side;
        const den = cross(rx, rz, tx, tz);
        let d = Math.abs(den) < 1e-4 ? Infinity : cross(qx - this.px[i], qz - this.pz[i], tx, tz) / den;
        const u = Math.abs(den) < 1e-4 ? -1 : cross(qx - this.px[i], qz - this.pz[i], rx, rz) / den;   // position along the wall line (0 at turn-in)
        if (d < bo) d = bo;                                       // the road hasn't turned away yet
        if (d >= cap || u < -1 || k > zoneLen + post) { last = Math.min(d, cap); closing = k; arr[i] = Math.max(arr[i], last); continue; }
        arr[i] = Math.max(arr[i], d); last = d;
      }
      z.runoff = Math.min(cap, Math.max(0, last - bo));
    }
    // a zone that turns both ways (Brooklands into Luffield, Maggotts - Becketts) only got the escape area of its
    // net direction above: every part of it still has an outside, and that side is run-off too (as deep as the verge)
    for (let zi = 0; zi < this.cornerZones.length; zi++) {
      const z = this.cornerZones[zi], len = (z.b - z.a + n) % n;
      let side = 0;
      for (let k = 0; k <= len + Math.round(60 / this.ds); k++) {
        const i = (z.a + k) % n;
        if (k <= len && Math.abs(this.curv[i]) > 1 / 400) side = -Math.sign(this.curv[i]);
        const ap = side > 0 ? this.apronL : side < 0 ? this.apronR : null;
        if (ap && ap[i] < 0) ap[i] = zi;
      }
    }
  }
  /** barrier distance on a side (+1 left / -1 right) at sample i */
  wallAt(i, side) { return side > 0 ? this.wallL[i] : this.wallR[i]; }

  /**
   * Pull the barrier back in wherever an escape apron would run into a protected footprint (the real grandstands
   * of a permanent circuit): the wall stops `margin` metres short of the first footprint met along the outward
   * normal, never closer than the base offset. Then smooth the result so the wall has no steps.
   */
  capRunoff(rings, margin = 4) {
    if (!rings.length) return;
    const inside = insideRings(rings);
    for (const [arr, side, cap] of [[this.wallL, 1, this.capL], [this.wallR, -1, this.capR]]) {
      const before = Float32Array.from(arr);
      for (let i = 0; i < this.n; i++) {
        const lo = this.minWallAt(i, side);
        if (arr[i] <= lo + 0.5) continue;
        for (let d = lo; d <= arr[i] + margin; d += 1.5) { if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { arr[i] = Math.max(lo, d - margin); break; } }
      }
      this._easeWall(arr); this._clampWall(arr);
      for (let i = 0; i < this.n; i++) if (arr[i] < before[i] - 0.5 && !cap[i]) cap[i] = 1;
    }
  }
  /**
   * A permanent circuit's grandstands: the escape area runs right up to them. Wherever a stand footprint lies within
   * `reach` of the verge, the barrier moves out to `margin` metres in front of it (a banner-covered tyre wall, see
   * layoutBarriers) and the ground in between becomes gravel (asphalt where that corner's run-off is asphalt; see
   * layoutSurfaces). The ends taper back to the verge at ~40 degrees, like a real barrier run.
   */
  extendToStands(rings, reach = 90, margin = 4) {
    if (!rings.length || !this.circuit) return;
    const inside = insideRings(rings), n = this.n;
    this.standL = this.standL || new Uint8Array(n); this.standR = this.standR || new Uint8Array(n);
    for (const [arr, side, cap, flag] of [[this.wallL, 1, this.capL, this.standL], [this.wallR, -1, this.capR, this.standR]]) {
      const ext = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const lo = this.minWallAt(i, side);
        for (let d = lo; d <= reach; d += 1.5) if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { ext[i] = d - margin; break; }
      }
      // taper the ends (a max-filter with a slope) so the barrier angles back to the verge instead of stepping
      const r = Math.round(140 / this.ds), slope = 0.6 * this.ds;
      for (let i = 0; i < n; i++) {
        let m = 0; for (let k = -r; k <= r; k++) m = Math.max(m, ext[(i + k + n) % n] - Math.abs(k) * slope);
        if (m > arr[i] + 1 && m > this.minWallAt(i, side)) { arr[i] = m; cap[i] = 1; flag[i] = 1; }
      }
    }
  }
  /**
   * Catch fences: 4 m of wire mesh on posts along the barrier wherever a grandstand stands within `reach` behind it -
   * there to keep a car, or its wheels, out of the crowd and send it back toward the track. (A concrete wall carries
   * its own debris fence already.)
   */
  markFences(rings, reach = 30) {
    const n = this.n; this.fenceL = new Uint8Array(n); this.fenceR = new Uint8Array(n);
    if (!rings.length && !this.guardL) return;
    const inside = insideRings(rings), ext = Math.round(25 / this.ds);
    for (const [bar, wall, fence, side] of [[this.barL, this.wallL, this.fenceL, 1], [this.barR, this.wallR, this.fenceR, -1]]) {
      const raw = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        if (!bar[i] || bar[i] === BAR.WALL) continue;
        for (let d = wall[i]; d <= wall[i] + reach; d += 2) if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { raw[i] = 1; break; }
      }
      for (let i = 0; i < n; i++) { if (!bar[i] || bar[i] === BAR.WALL) continue; for (let k = -ext; k <= ext && !fence[i]; k++) if (raw[(i + k + n) % n]) fence[i] = 1; }
    }
    // (and every spectator area's fence: guardZones)
    for (const [fence, g, bar] of [[this.fenceL, this.guardL, this.barL], [this.fenceR, this.guardR, this.barR]]) if (g) for (let i = 0; i < n; i++) if (g[i] && bar[i] && bar[i] !== BAR.WALL) fence[i] = 1;
  }
  /**
   * A circuit's spectator areas all round the lap (zones: [{ s0, s1, side, back }]): wherever one lies behind the verge,
   * a banner-covered barrier and over it a catch fence, along its whole length (and 15 m past either end) - the crowd is
   * behind the fence, never in reach of a car. Kept in track.crowdZones.
   * Where the barriers stand is then worked out the way a circuit's are (tautWalls): a zone with z.back keeps its fence
   * at least CLEAR m past the kerb, a zone without (the main straight's grandstand wall) stays where it is; everything
   * else - the run-offs, the stands, the pit wall - as laid out before. `rings`: the footprints the barrier must stop short
   * of (buildings, stands); `pit`: the lane, which it never crosses.
   */
  guardZones(zones, rings = [], pit = null) {
    const n = this.n, ext = Math.round(15 / this.ds), q = {}, CLEAR = 9;
    this.crowdZones = zones; this.guardL = new Uint8Array(n); this.guardR = new Uint8Array(n);
    // (want: -1 no crowd, 0 a crowd at the barrier where it is (the main straight's grandstand wall), up to 1 a crowd kept
    //  CLEAR m back - eased in over the 15 m either end of a zone, so the line opens out to it gradually, never in a step)
    const want = { 1: new Float32Array(n), '-1': new Float32Array(n) }, close = { 1: new Uint8Array(n), '-1': new Uint8Array(n) };
    for (const z of zones) {
      const W = want[z.side], C = close[z.side], i0 = this.idxAtS(z.s0), m = Math.round(this.wrapS(z.s1 - z.s0) / this.ds);
      for (let k = -ext; k <= m + ext; k++) { const i = (i0 + k + n) % n, t = k < 0 ? 1 + k / ext : k > m ? 1 - (k - m) / ext : 1; if (z.back) W[i] = Math.max(W[i], t * t * (3 - 2 * t)); else C[i] = 1; }
    }
    const inside = insideRings(rings);
    // (the pit lane: its own samples on a coarse grid, for a quick 'is this point on the lane' test)
    const lane = new Map(), LC = 20;
    if (pit) { const P = pit.samples; for (let k = 0; k < P.n; k++) { const key = `${Math.floor(P.px[k] / LC)},${Math.floor(P.pz[k] / LC)}`; (lane.get(key) || lane.set(key, []).get(key)).push(k); } }
    const onLane = (x, z) => {
      if (!pit) return false; const P = pit.samples, cx = Math.floor(x / LC), cz = Math.floor(z / LC), r = pit.halfWidth + 6;
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (const k of lane.get(`${cx + dx},${cz + dz}`) || []) if ((P.px[k] - x) ** 2 + (P.pz[k] - z) ** 2 < r * r) return true;
      return false;
    };
    for (const side of [1, -1]) {
      const arr = side > 0 ? this.wallL : this.wallR, bar = side > 0 ? this.barL : this.barR, stand = side > 0 ? this.standL : this.standR, W = want[side], fan = (side > 0 ? this.fanL : this.fanR) || arr;
      const lo = Float32Array.from(arr), hi = Float32Array.from(arr), mid = new Float32Array(n).fill(Infinity);
      for (let i = 0; i < n; i++) {
        if (bar[i] === BAR.WALL || close[side][i]) continue;   // (the pit wall, the main straight's wall: where they are)
        // (what it must keep behind it: the escape area a car going straight on needs - not the line as it was, which
        //  carries the old pulls round buildings and the other parts of the lap: those are what `hi` is for - and the
        //  crowd's clearance; in front of a stand no further out than the stand's front)
        const e = this.edgeAt(i, side) + this.kerbWidth;
        lo[i] = Math.max(this.minWallAt(i, side), stand?.[i] ? Math.min(fan[i], arr[i]) : fan[i]);
        if (W[i] > 0) lo[i] = Math.max(lo[i], Math.min(stand?.[i] ? arr[i] : Infinity, e + CLEAR * W[i]));
        // how far out it may go: short of the next part of the lap (past the line halfway to it), of a footprint, of the lane
        // (each hit found to a few centimetres - stepping out 2 m at a time left the limit in steps, and the line in scallops)
        const hit = (d) => {
          const x = this.px[i] + this.nx[i] * side * d, z = this.pz[i] + this.nz[i] * side * d;
          this.nearest(x, z, -1, q); const sep = Math.min(Math.abs(q.i - i), n - Math.abs(q.i - i)) * this.ds;
          return sep > Math.max(80, 4 * d) ? 1 : inside(x, z) ? 2 : onLane(x, z) ? 3 : 0;
        };
        let h = lo[i] + 45;
        for (let d = Math.max(e + 2, lo[i] - 6); d <= h; d += 2) {
          const k = hit(d); if (!k) continue;
          let a = d - 2, b = d; for (let it = 0; it < 6; it++) { const m = (a + b) / 2; if (hit(m)) b = m; else a = m; }
          h = b - (k === 1 ? 8 : k === 2 ? 5 : 3); if (k === 1) mid[i] = b; break;
        }
        let c = 0; for (let k = -10; k <= 10; k++) c = Math.max(c, this.curv[(i + k + n) % n] * side);
        if (c > 1e-4) h = Math.min(h, 1 / c - 12);   // (on the inside of a bend, well short of its centre: see fairWalls)
        if (stand?.[i]) h = Math.min(h, arr[i]);
        lo[i] = Math.min(lo[i], Math.max(e + 1.5, h)); hi[i] = Math.max(lo[i], h);
      }
      // (what it must keep behind it smoothed over its little steps - where one escape area's line meets the next, where
      //  a crowd's clearance comes in - so the line does not crinkle along them: only ever more ground kept, never less;
      //  never past the limit)
      const KL = Math.round(30 / this.ds), dl = new Float32Array(n), RL = 30;
      for (let i = 0; i < n; i++) { let m = -Infinity; for (let k = -KL; k <= KL; k++) { const v = lo[(i + k + n) % n] - (k * this.ds) ** 2 / (2 * RL); if (v > m) m = v; } dl[i] = m; }
      for (let i = 0; i < n; i++) { let m = Infinity; for (let k = -KL; k <= KL; k++) { const v = dl[(i + k + n) % n] + (k * this.ds) ** 2 / (2 * RL); if (v < m) m = v; } if (lo[i] < hi[i]) lo[i] = Math.min(hi[i], Math.max(lo[i], m)); }
      // (the limit rounded off where it dips - another part of the lap, a building - so the line bends round it in a
      //  curve, not to a point: brought in, never out)
      const hs = Float32Array.from(hi), KH = Math.round(60 / this.ds);
      for (let i = 0; i < n; i++) { let m = hs[i]; for (let k = -KH; k <= KH; k++) { const v = hs[(i + k + n) % n] + (k * this.ds) ** 2 / (2 * 40); if (v < m) m = v; } hi[i] = Math.max(lo[i], m); }
      arr.set(this.tautWalls(lo, hi, side));
      // (between the legs of a hairpin, or two parts of the lap as close, the line would only follow the halfway line
      //  between them: open grass there, as there is at Austin - no barrier and no crowd in a strip that narrow)
      const open = (side > 0 ? this.openL = new Uint8Array(n) : this.openR = new Uint8Array(n));
      for (let i = 0; i < n; i++) if (mid[i] < 48 && arr[i] > hi[i] - 1.5) open[i] = 1;
      const E = Math.round(10 / this.ds); for (let i = 0; i < n; i++) if (open[i] === 1) for (let k = -E; k <= E; k++) { const q = (i + k + n) % n; if (!open[q]) open[q] = 2; }
    }
    this.taut = true;
    this.layoutSurfaces();
    for (const z of zones) {
      const bar = z.side > 0 ? this.barL : this.barR, g = z.side > 0 ? this.guardL : this.guardR, open = z.side > 0 ? this.openL : this.openR, i0 = this.idxAtS(z.s0), m = Math.round(this.wrapS(z.s1 - z.s0) / this.ds);
      for (let k = -ext; k <= m + ext; k++) { const i = (i0 + k + n) % n; if (open[i] && bar[i] !== BAR.WALL) continue; if (!bar[i]) bar[i] = BAR.TYRES; if (bar[i] !== BAR.WALL) g[i] = 1; }
    }
  }
  /**
   * A barrier line the way a circuit's is drawn: the shortest line round the lap on one side (+1 left / -1 right) that
   * keeps every sample's escape ground behind it (at least lo[i] from the centreline: the verge, the run-off a car
   * going straight on needs) and stops short of whatever it must not reach (at most hi[i]). It holds the run-off's edge
   * where the road bends away from it, the outside of a corner, and runs straight across where the road bends toward
   * it, the inside: long straight runs from one escape area to the next, closing in to the apexes - never the road's
   * wiggles copied out at a fixed distance. (A taut string: each point moved along its normal onto the line between its
   * neighbours, coarse to fine.) -> the barrier's distance per sample
   */
  tautWalls(lo, hi, side) {
    const n = this.n, d = Float32Array.from(lo), X = new Float32Array(n), Z = new Float32Array(n);
    const pt = (i) => { X[i] = this.px[i] + this.nx[i] * side * d[i]; Z[i] = this.pz[i] + this.nz[i] * side * d[i]; };
    for (let i = 0; i < n; i++) pt(i);
    // (sample i's distance where its normal crosses the line from a to c, held within its bounds)
    const onto = (i, a, c) => {
      const ux = this.nx[i] * side, uz = this.nz[i] * side, cx = X[c] - X[a], cz = Z[c] - Z[a], den = cx * uz - cz * ux;
      if (Math.abs(den) < 1e-6) return d[i];
      const t = (cx * (Z[a] - this.pz[i]) - cz * (X[a] - this.px[i])) / den;
      return Math.min(hi[i], Math.max(lo[i], t));
    };
    for (const st of [32, 16, 8, 4, 2, 1]) {
      const idx = []; for (let i = 0; i < n; i += st) idx.push(i); const m = idx.length;
      for (let sweep = 0; sweep < (st >= 16 ? 400 : 120); sweep++) {
        let moved = 0;
        for (let j = 0; j < m; j++) { const i = idx[j], v = onto(i, idx[(j - 1 + m) % m], idx[(j + 1) % m]); moved = Math.max(moved, Math.abs(v - d[i])); d[i] = v; pt(i); }
        if (moved < 0.01) break;
      }
      if (st > 1) for (let j = 0; j < m; j++) { const a = idx[j], c = idx[(j + 1) % m], len = ((c - a + n) % n) || n; for (let k = 1; k < len; k++) { const i = (a + k) % n; d[i] = onto(i, a, c); pt(i); } }
    }
    this._cutLoops(d, side, (i) => hi[i]);
    return d;
  }
  /**
   * Where a barrier line (distances from the centreline, one side) crosses over itself - the inside of a bend tighter than
   * the line is far out, or the tip of a hairpin's infield where the line from either leg meets - the loop beyond the
   * crossing is cut off: the line comes to the crossing point and goes on from it (in place). Never where that would
   * carry any of it further out than max(i) - a crossing with a far part of the same line (an open stretch with no
   * barrier drawn) is not a fold, and moving a barrier out could put it into what it was kept clear of
   */
  _cutLoops(d, side, max = (i) => d[i] + 1) {
    const n = this.n, X = new Float32Array(n), Z = new Float32Array(n), Wn = Math.round(320 / this.ds);
    for (let i = 0; i < n; i++) { X[i] = this.px[i] + this.nx[i] * side * d[i]; Z[i] = this.pz[i] + this.nz[i] * side * d[i]; }
    for (let a = 0; a < n; a++) {
      const a1 = (a + 1) % n;
      for (let k = 2; k < Wn; k++) {
        const b = (a + k) % n, b1 = (b + 1) % n;
        const rx = X[a1] - X[a], rz = Z[a1] - Z[a], sx = X[b1] - X[b], sz = Z[b1] - Z[b], den = rx * sz - rz * sx; if (Math.abs(den) < 1e-9) continue;
        const qx = X[b] - X[a], qz = Z[b] - Z[a], t = (qx * sz - qz * sx) / den, u = (qx * rz - qz * rx) / den;
        if (t < 0 || t > 1 || u < 0 || u > 1) continue;
        const ix = X[a] + rx * t, iz = Z[a] + rz * t, nd = (i) => Math.max(0.5, (ix - this.px[i]) * this.nx[i] * side + (iz - this.pz[i]) * this.nz[i] * side);
        let ok = true; for (let j = 1; j <= k && ok; j++) { const i = (a + j) % n, v = nd(i); if (v > max(i) && !(k * this.ds <= 16 && v <= d[i] + 5)) ok = false; }   // (a little knot at a street corner: undone even if a point of it moves out a little)
        if (!ok) continue;
        for (let j = 1; j <= k; j++) { const i = (a + j) % n; d[i] = nd(i); X[i] = ix; Z[i] = iz; }
        a = a + k - 1; break;
      }
    }
  }
  /**
   * Every circuit's barriers made fair - the last thing done to them, once everything that moves a wall line (the run-
   * offs, the stands, buildings, the other parts of the lap, the pit lane, the crowds) has had its say. A barrier is built
   * in long runs and gentle bends; the steps those leave where a line is pulled in round something (another part of the
   * lap, a building) would be wedges of tyre wall jutting into a run-off. So each line, as distance from the centreline
   * along the lap, is only ever brought IN (never out into what it was kept clear of):
   *   * every dip rounded out to a bend of at least FAIR_R metres (the line pulled in a little either side of it);
   *   * nowhere closing in or opening out at more than FAIR_DEG against the road;
   *   * every corner left on the far side (the far end of a run-off) rounded off;
   * then whatever still turns sharply in the plan - the inside of a hairpin, where the runs from either leg would meet in
   * a point - has no barrier: the infield's tip is left open, back to where the two runs stand 20 m apart. The pit wall and
   * a pinned wall stay where they are (but for wrapping round an apex rather than folding over themselves).
   */
  fairWalls() {
    const n = this.n, ds = this.ds, FAIR_R = 45, tanB = Math.tan((28 * Math.PI) / 180), K = Math.round(70 / ds), G = Math.max(1, Math.round(4 / ds));
    const gw = []; for (let k = -3 * G; k <= 3 * G; k++) gw.push(Math.exp(-(k * k) / (2 * G * G)));
    const gs = gw.reduce((a, b) => a + b, 0);
    for (const side of [1, -1]) {
      const arr = side > 0 ? this.wallL : this.wallR, bar = side > 0 ? this.barL : this.barR;
      const pinned = (i) => this.pinAt(this.s[i], side) || this.heldAt(this.s[i], side);
      // (a concrete wall - the pit wall included - can have no gap: on the inside of a bend tighter than it stands far out
      //  it wraps round the apex instead of folding over itself into a point, behind the kerb if it has to be, as a street
      //  circuit's does)
      // (and any barrier on the inside of a bend stands well short of the bend's centre: every point of a line out there
      //  is the same point - the line would come to a corner pointing at the road - so it is drawn as a bend of its own,
      //  10 m round at the least; a wall closer still, round an apex tighter than that)
      const R = Math.round(10 / ds), floor = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        floor[i] = this.edgeAt(i, side) + this.kerbWidth + 1.5;
        let c = 0; for (let k = -R; k <= R; k++) c = Math.max(c, this.curv[(i + k + n) % n] * side);   // (the tightest of the bend near it)
        if (c < 1e-4) continue;
        if (bar[i] !== BAR.WALL) { arr[i] = Math.max(floor[i], Math.min(arr[i], 1 / c - 10)); continue; }
        const lim = Math.min(0.75 / c, Math.max(0.5 / c, 1 / c - 6));   // (its own bend no tighter than 6 m)
        if (arr[i] > lim) { floor[i] = Math.max(this.edgeAt(i, side) + this.kerbWidth + 0.2, Math.min(floor[i], lim)); arr[i] = floor[i]; }
      }
      this._cutLoops(arr, side);
      // (the line in the plan, and how it turns at each point over 4 m either way: + where it turns away from the road -
      //  a notch, a corner pointing at the road - and - where it turns toward it - a corner pointing away)
      const X = new Float32Array(n), Z = new Float32Array(n);
      const plan = () => { for (let i = 0; i < n; i++) { X[i] = this.px[i] + this.nx[i] * side * arr[i]; Z[i] = this.pz[i] + this.nz[i] * side * arr[i]; } };
      const reach = (i, dir, D = 4) => { let L = 0, j = i; for (let c = 0; c < 120 && L < D; c++) { const q = (j + dir + n) % n; L += Math.hypot(X[q] - X[j], Z[q] - Z[j]); j = q; } return j; };
      const turn = (i, a = reach(i, -1), c = reach(i, 1)) => { const ux = X[i] - X[a], uz = Z[i] - Z[a], vx = X[c] - X[i], vz = Z[c] - Z[i]; return Math.hypot(ux, uz) < 0.5 || Math.hypot(vx, vz) < 0.5 ? 0 : Math.atan2(-(ux * vz - uz * vx), ux * vx + uz * vz) * side; };
      // the dips and steps rounded, as distance from the road: all round the lap where the line follows the road (its
      // steps are where it was pulled in round something), only about each notch where it was drawn taut (a straight run
      // across the inside of a bend is a hump in that distance, and it must stay straight)
      const f = Float32Array.from(arr), e = Float32Array.from(arr), mask = new Uint8Array(n);
      if (!this.taut) mask.fill(1);
      else { plan(); const W = Math.round(30 / ds); for (let i = 0; i < n; i++) if (turn(i) > (20 * Math.PI) / 180) for (let k = -W; k <= W; k++) mask[(i + k + n) % n] = 1; }
      for (let i = 0; i < n; i++) { if (!mask[i]) continue; let m = f[i]; for (let k = -K; k <= K; k++) { const v = f[(i + k + n) % n] + (k * ds) ** 2 / (2 * FAIR_R); if (v < m) m = v; } e[i] = m; }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < n * 2; i++) { const a = i % n, b = (i - 1) % n; if (mask[a]) e[a] = Math.min(e[a], e[b] + ds * tanB); }
        for (let i = n * 2 - 2; i >= 0; i--) { const a = i % n, b = (i + 1) % n; if (mask[a]) e[a] = Math.min(e[a], e[b] + ds * tanB); }
      }
      const g = Float32Array.from(e);
      for (let i = 0; i < n; i++) { if (!mask[i]) continue; let a = 0; for (let k = -3 * G; k <= 3 * G; k++) a += e[(i + k + n) % n] * gw[k + 3 * G]; g[i] = Math.min(e[i], a / gs); }
      // (the nearest it may come eased the same way: where a wall wraps an apex closer in than usual, the line round it
      //  comes in to that gradually, not in a jog)
      const fl = new Float32Array(n);
      for (let i = 0; i < n; i++) { let m = floor[i]; for (let k = -K; k <= K; k++) { const v = floor[(i + k + n) % n] + (k * ds) ** 2 / (2 * FAIR_R); if (v < m) m = v; } fl[i] = m; }
      for (let i = 0; i < n; i++) if (!pinned(i)) arr[i] = Math.max(fl[i], Math.min(f[i], g[i]));
      // every corner still pointing away from the road taken in, onto the line between the points 4 m either side of it
      for (let it = 0; it < 30; it++) {
        plan(); let moved = 0;
        for (let i = 0; i < n; i++) {
          if (pinned(i)) continue; const a = reach(i, -1), c = reach(i, 1); if (turn(i, a, c) > -(12 * Math.PI) / 180) continue;
          const ux = this.nx[i] * side, uz = this.nz[i] * side, cx = X[c] - X[a], cz = Z[c] - Z[a], den = cx * uz - cz * ux; if (Math.abs(den) < 1e-6) continue;
          const t = (cx * (Z[a] - this.pz[i]) - cz * (X[a] - this.px[i])) / den; if (!(t < arr[i])) continue;
          const v = Math.max(fl[i], arr[i] + (t - arr[i]) * 0.6); moved = Math.max(moved, arr[i] - v); arr[i] = v;
        }
        if (moved < 0.02) break;
      }
      // (and any saw-tooth that left - neighbouring points taken in by different amounts where the line's points are
      //  spaced unevenly, along a run-off's fast-widening edge - smoothed away, again only ever inward)
      for (let pass = 0; pass < 3; pass++) {
        const t = Float32Array.from(arr);
        for (let i = 0; i < n; i++) if (!pinned(i)) arr[i] = Math.max(fl[i], Math.min(t[i], (t[(i - 2 + n) % n] + 4 * t[(i - 1 + n) % n] + 6 * t[i] + 4 * t[(i + 1) % n] + t[(i + 2) % n]) / 16));
      }
      this._cutLoops(arr, side);
      // what still turns sharply in the plan: the barrier there taken away
      plan(); const sharp = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        if (!bar[i]) continue;
        const a = reach(i, -1), c = reach(i, 1), ux = X[i] - X[a], uz = Z[i] - Z[a], vx = X[c] - X[i], vz = Z[c] - Z[i], lu = Math.hypot(ux, uz), lv = Math.hypot(vx, vz);
        if (lu < 1 || lv < 1) continue;
        if ((ux * vx + uz * vz) / (lu * lv) < Math.cos((35 * Math.PI) / 180)) sharp[i] = 1;
      }
      for (let i = 0; i < n; i++) {
        if (!sharp[i] || sharp[(i - 1 + n) % n]) continue;
        let i1 = i; while (sharp[(i1 + 1) % n] && i1 - i < n) i1++;
        let j0 = i - G, j1 = i1 + G;
        while (Math.hypot(X[(j1 + n) % n] - X[(j0 + n) % n], Z[(j1 + n) % n] - Z[(j0 + n) % n]) < 20 && j1 - j0 < Math.round(160 / ds)) { j0--; j1++; }
        for (let j = j0; j <= j1; j++) { const q = (j + n) % n; if (bar[q] !== BAR.WALL) bar[q] = 0; }
        const gd = side > 0 ? this.guardL : this.guardR; if (gd) for (let j = j0; j <= j1; j++) { const q = (j + n) % n; if (!bar[q]) gd[q] = 0; }
      }
    }
    // (a scrap of barrier left between two openings - under 20 m - taken away too)
    for (const [bar, gd] of [[this.barL, this.guardL], [this.barR, this.guardR]]) {
      for (let i = 0; i < n; i++) {
        if (!bar[i] || bar[(i - 1 + n) % n]) continue;
        let k = 0; while (k < n && bar[(i + k) % n]) k++;
        if (k * this.ds < 20 && k < n) for (let j = 0; j < k; j++) { const q = (i + j) % n; if (bar[q] !== BAR.WALL) { bar[q] = 0; if (gd) gd[q] = 0; } }
      }
    }
    // (and no crowd where its barrier was taken away: a spectator area is cut short either side of an opening, and what is
    //  left of it under 30 m long dropped)
    if (this.crowdZones) {
      const out = [];
      for (const z of this.crowdZones) {
        const bar = z.side > 0 ? this.barL : this.barR, len = this.wrapS(z.s1 - z.s0); let a = null;
        for (let u = 0; u <= len + 0.01; u += this.ds) {
          const s = this.wrapS(z.s0 + u), ok = !!bar[this.idxAtS(s)] && u < len;
          if (ok && a == null) a = u; else if (!ok && a != null) { if (u - a >= 30) out.push({ ...z, s0: this.wrapS(z.s0 + a), s1: this.wrapS(z.s0 + u - this.ds) }); a = null; }
        }
      }
      this.crowdZones = out;
    }
    // (a paved infield's line - buildPitLane, def.pitEscape.infield - stays out past the lane and its escape, whatever
    //  the bend inside it: no barrier stands on it, the line is where scenery may start)
    if (this.pitInfieldWall) { const arr = this.pitSide > 0 ? this.wallL : this.wallR, bar = this.pitSide > 0 ? this.barL : this.barR; for (let i = 0; i < n; i++) if (this.pitInfield[i]) { arr[i] = this.pitInfieldWall[i]; bar[i] = BAR.TYRES; } }
    this.layoutSurfaces();
    this.openInfields();   // (a hairpin's open infield, def.openInfields: after everything else has laid the barriers out)
  }
  /**
   * A hairpin's infield left open (def.openInfields: [{ turn, side, before, after }]): from `before` metres ahead of the
   * corner's apex to `after` past it, on `side` (+1 left / -1 right of the racing direction: the inside), no barrier at
   * all - Montreal's L'Epingle, open grass between the two legs, where a walled park circuit would draw a concrete wall
   * down the middle of it. The barrier's line there moves out to the middle of the grass (halfway across to the other
   * leg's road; round the apex short of the bend's centre), eased in over 30 m at either end: whatever is set down
   * "inside the barrier" - a car that cannot go on pulled off, a wreck the marshals park, the scenery kept clear of the
   * corridor - is out on the grass, not back on the road. The ground there is grass: no escape area.
   */
  openInfields(list = this.def.openInfields) {
    if (!list) return;
    const n = this.n, q = {}, R = Math.round(10 / this.ds), E = Math.max(1, Math.round(30 / this.ds));
    for (const o of list) {
      const c = (this.def.corners || []).find((k) => k.n === o.turn); if (!c || c.s == null) continue;
      const side = o.side || -1, bar = side > 0 ? this.barL : this.barR, arr = side > 0 ? this.wallL : this.wallR, ap = side > 0 ? this.apronL : this.apronR;
      const i0 = this.idxAtS(c.s - (o.before ?? 150)), m = Math.round(((o.before ?? 150) + (o.after ?? 150)) / this.ds);
      for (let k = 0; k <= m; k++) {
        const i = (i0 + k) % n; bar[i] = BAR.NONE; ap[i] = -1;
        let mid = 60;   // (half the way across to the first road met that belongs to another part of the lap)
        for (let d = this.edgeAt(i, side) + this.kerbWidth; d < 120; d += 0.5) {
          this.nearest(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d, -1, q);
          if (Math.min(Math.abs(q.i - i), n - Math.abs(q.i - i)) * this.ds > 30 && Math.abs(q.d) < this.edgeAt(q.i, Math.sign(q.d) || 1)) { mid = d / 2; break; }
        }
        let cv = 0; for (let j = -R; j <= R; j++) cv = Math.max(cv, this.curv[(i + j + n) % n] * side);
        const t = Math.min(1, k / E, (m - k) / E), w = t * t * (3 - 2 * t), want = Math.min(mid - 0.5, cv > 1e-4 ? 0.9 / cv : Infinity);
        if (want > arr[i]) arr[i] += (want - arr[i]) * w;
      }
    }
    this.layoutSurfaces();
  }
  /** how tall the barrier on a side (+1 left / -1 right) stands at sample i (m; 0: none) */
  barrierHeight(i, side) {
    const b = side > 0 ? this.barL[i] : this.barR[i]; if (!b) return 0;
    const f = side > 0 ? this.fenceL?.[i] : this.fenceR?.[i];
    return Math.max(BAR_HEIGHT[b], f ? FENCE_H : 0);
  }
  /**
   * A wall pinned close to the road over [s0, s1] on one side (+1 left / -1 right): Montreal's Wall of Champions, a
   * kerb and a painted strip off the exit of the last chicane. The wall eases in and out over `ease` metres. Kept in
   * track.pins ({ a, b, side, d, panel, name }) for the panels, the paint and the race director.
   */
  pinWall(s0, s1, side, d, { ease = 25, panel = null, name = null } = {}) {
    const arr = side > 0 ? this.wallL : this.wallR, bar = side > 0 ? this.barL : this.barR, n = this.n;
    const len = this.wrapS(s1 - s0), e = Math.max(1, Math.round(ease / this.ds)), k0 = this.idxAtS(s0), m = Math.round(len / this.ds);
    for (let k = -e; k <= m + e; k++) {
      const i = (k0 + k + n) % n, t = k < 0 ? 1 + k / e : k > m ? 1 - (k - m) / e : 1, w = t * t * (3 - 2 * t);
      arr[i] = Math.min(arr[i], d * w + arr[i] * (1 - w)); if (w > 0.5) bar[i] = BAR.WALL;
    }
    (this.pins || (this.pins = [])).push({ a: this.wrapS(s0), b: this.wrapS(s1), side, d, panel, name });
  }
  /**
   * Corners left open (def.openCorners: [{ turn, left, right, before, after }]): around the corner's apex, from `before`
   * metres ahead of it to `after` past it, the barrier stands at least `left` / `right` metres from the centreline -
   * Montreal's Senna S and hairpin, wide paved escapes and grass where a street circuit would have concrete. The
   * ends ease back over 40 m; capSelf / capRunoff (run after) still stop it short of other parts of the lap and of
   * buildings. Call once the corners have their arc lengths.
   */
  openCorners(list = this.def.openCorners) {
    if (!list) return;
    const n = this.n, ease = Math.round(40 / this.ds);
    for (const o of list) {
      const c = (this.def.corners || []).find((k) => k.n === o.turn); if (!c || c.s == null) continue;
      const i0 = this.idxAtS(c.s - (o.before ?? 60)), m = Math.round(((o.before ?? 60) + (o.after ?? 60)) / this.ds);
      for (const [arr, d] of [[this.wallL, o.left], [this.wallR, o.right]]) {
        if (!d) continue;
        for (let k = -ease; k <= m + ease; k++) {
          const i = (i0 + k + n) % n, t = k < 0 ? 1 + k / ease : k > m ? 1 - (k - m) / ease : 1, w = t * t * (3 - 2 * t);
          arr[i] = Math.max(arr[i], arr[i] + (d - arr[i]) * w);
        }
      }
    }
  }
  /**
   * Escape roads (def.escapes: [{ ring: [[x, z]...], side }]): wherever the road's edge on that side (+1 left / -1 right)
   * lies inside the ring, the barrier is pushed out along the normal to the ring's edge - a paved run-off the shape of
   * the ring, straight on past a corner (Las Vegas's Turns 1-2: the escape beyond the U, between the main grandstand's
   * line and the return leg's). Call after openCorners.
   */
  escapes(list = this.def.escapes) {
    if (!list) return;
    this.escapeBoxes = [];
    for (const e of list) {
      const side = e.side ?? -1, ring = e.auto ? this._escapeBox(e.auto, side) : e.band ? this._escapeBand(e.band, side) : e.ring; if (!ring) continue;
      const inside = insideRings([ring]), arr = side > 0 ? this.wallL : this.wallR;
      const at = (i, d) => [this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d];
      let lo = -1, hi = -1;
      for (let i = 0; i < this.n; i++) {
        let d = this.edgeAt(i, side) + this.kerbWidth + 0.5; if (!inside(...at(i, d))) continue;
        while (d < 200 && inside(...at(i, d + 0.5))) d += 0.5;
        arr[i] = Math.max(arr[i], d); if (lo < 0) lo = i; hi = i;
      }
      // (an escape drawn to the real one's shape is held as it is: fairWalls rounds every other barrier line, and would
      //  round this one's square corners into a balloon)
      if ((e.auto || e.band) && lo >= 0) (this.heldWalls || (this.heldWalls = [])).push({ a: this.s[lo], b: this.s[hi], side });
    }
  }
  /**
   * A run-off swelling out from the barrier line beside a stretch of the lap (escapes band: { turn, from, to, depth }):
   * from `from` to `to` m about the corner's apex, its outer wall as the real one is built - leaving the road's own wall
   * in line with it and curving gently away, then one straight run along the stands behind it (at least `depth` m past
   * the kerb at the middle of the stretch, and never nearer the road than 12 m along that run), then curving gently back
   * in to fence the road again. Not an offset of the road, which would wiggle with every kerb of a chicane. Las Vegas's
   * Turns 7-8: the painted run-off east of the chicane. Its outline is kept for the paint (escapeBands).
   */
  _escapeBand(o, side) {
    const c = (this.def.corners || []).find((k) => k.n === o.turn); if (!c || c.s == null) return null;
    const sA = c.s + (o.from ?? -20), sB = c.s + (o.to ?? 120), D = o.depth ?? 30, f = {};
    const wallPt = (s) => { const i = this.idxAtS(s); this.sample(s, side * this.wallAt(i, side), f); return [f.x, f.z]; };
    const tan = (s) => { const i = this.idxAtS(s); return [this.tx[i], this.tz[i]]; };
    const A = wallPt(sA), B = wallPt(sB), CL = Math.hypot(B[0] - A[0], B[1] - A[1]), u = [(B[0] - A[0]) / CL, (B[1] - A[1]) / CL], sM = (sA + sB) / 2;
    // (out from the line between its ends, on the run-off's side)
    let n = [-u[1], u[0]]; { this.sample(sM, 0, f); const c0 = [f.x, f.z]; this.sample(sM, side * 10, f); if ((f.x - c0[0]) * n[0] + (f.z - c0[1]) * n[1] < 0) n = [-n[0], -n[1]]; }
    const off = (s, d) => { const i = this.idxAtS(s); this.sample(s, side * (this.edgeAt(i, side) + this.kerbWidth + d), f); return (f.x - A[0]) * n[0] + (f.z - A[1]) * n[1]; };
    let h = off(sM, D); for (let s = sA + (sB - sA) * 0.25; s <= sB - (sB - sA) * 0.25; s += 2) h = Math.max(h, off(s, 12));
    const P1 = [A[0] + u[0] * CL * 0.3 + n[0] * h, A[1] + u[1] * CL * 0.3 + n[1] * h], P2 = [A[0] + u[0] * CL * 0.7 + n[0] * h, A[1] + u[1] * CL * 0.7 + n[1] * h];
    const cubic = (p0, p1, p2, p3, out, first) => { for (let k = first ? 0 : 1; k <= 20; k++) { const t = k / 20, a = (1 - t) ** 3, b = 3 * t * (1 - t) ** 2, cc = 3 * t * t * (1 - t), d = t ** 3; out.push([a * p0[0] + b * p1[0] + cc * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + cc * p2[1] + d * p3[1]]); } };
    const tA = tan(sA), tB = tan(sB), k1 = Math.hypot(P1[0] - A[0], P1[1] - A[1]) * 0.5, k2 = Math.hypot(B[0] - P2[0], B[1] - P2[1]) * 0.5, outer = [];
    cubic(A, [A[0] + tA[0] * k1, A[1] + tA[1] * k1], [P1[0] - u[0] * k1, P1[1] - u[1] * k1], P1, outer, true);
    for (let k = 1; k < 10; k++) outer.push([P1[0] + (P2[0] - P1[0]) * k / 10, P1[1] + (P2[1] - P1[1]) * k / 10]);
    cubic(P2, [P2[0] + u[0] * k2, P2[1] + u[1] * k2], [B[0] - tB[0] * k2, B[1] - tB[1] * k2], B, outer, false);
    const inner = []; for (let s = sB; s >= sA - 0.01; s -= 2) { this.sample(s, 0, f); inner.push([f.x, f.z]); }
    (this.escapeBands || (this.escapeBands = [])).push({ turn: o.turn, sA, sB, side, depth: D, arc: { A, B, P1, P2 }, outer });
    return [...outer, ...inner];
  }
  /** a barrier line held as drawn (escapes: an escape the shape of the real one) at arc length s on that side */
  heldAt(s, side) { return (this.heldWalls || []).some((h) => h.side === side && s >= h.a && s <= h.b); }
  /**
   * A straight-on escape beyond a corner (escapes auto: { turn, depth, from, to }): a rectangle in the frame of the
   * straight before it (along it from `to` m before the apex - where the straight ends - to `depth` m past the corner's
   * outermost kerb; across it from the straight's barrier line on the outside to the barrier line of the leg coming back
   * out of the corner, carried on at that leg's own angle), so the run-off is the straight carried on with a wall across
   * its end and the exit leg's wall slanting in to it - never a bulge round the corner. Its frame is kept for the paint
   * (escapeBoxes: { o, along, left, uOut, uEnd, wR, wL / wEnd: the exit side at uOut / at the end, wExit(u), slope }).
   */
  _escapeBox(o, side) {
    const c = (this.def.corners || []).find((k) => k.n === o.turn); if (!c || c.s == null) return null;
    const a = this.sample(c.s - (o.from ?? 220), 0, {}), b = this.sample(c.s - (o.to ?? 80), 0, {});
    const L = Math.hypot(b.x - a.x, b.z - a.z) || 1, al = [(b.x - a.x) / L, (b.z - a.z) / L], le = [al[1], -al[0]], O = [b.x, b.z];
    const U = (x, z) => (x - O[0]) * al[0] + (z - O[1]) * al[1], Wv = (x, z) => (x - O[0]) * le[0] + (z - O[1]) * le[1];
    const wR = side * this.wallAt(this.idxAtS(c.s - (o.to ?? 80)), side);   // (the straight's barrier line on that side)
    let uOut = -Infinity;
    for (let s = c.s - 80; s <= c.s + 260; s += 2) {
      const i = this.idxAtS(s), e = this.edgeAt(i, side) + this.kerbWidth, x = this.px[i] + this.nx[i] * side * e, z = this.pz[i] + this.nz[i] * side * e;
      if (s <= c.s + 120) uOut = Math.max(uOut, U(x, z));
    }
    // (the leg coming back: its barrier line where it leaves the corner - `exit` m back down the straight from the kerb's
    //  furthest point - carried on at its own angle to the end wall: the leg opens away from the straight (Las Vegas: ~20
    //  degrees), so the run-off's exit side is that slant, narrowing to its end, never a line parallel to the straight)
    let A = null, B = null;
    for (let s = c.s + 10; s <= c.s + 400 && !B; s += 2) {
      const i = this.idxAtS(s), w = this.wallAt(i, side), wx = this.px[i] + this.nx[i] * side * w, wz = this.pz[i] + this.nz[i] * side * w;
      if (!A) { if (U(this.px[i], this.pz[i]) <= uOut - (o.exit ?? 45)) A = { s, u: U(wx, wz), w: Wv(wx, wz) }; }
      else if (s >= A.s + (o.legLen ?? 60)) B = { s, u: U(wx, wz), w: Wv(wx, wz) };
    }
    if (!A || !B || B.u >= A.u) return null;
    const uEnd = uOut + (o.depth ?? 40), slope = (B.w - A.w) / (B.u - A.u), wExit = (u) => A.w + (u - A.u) * slope;
    const P = (u, w) => [O[0] + al[0] * u + le[0] * w, O[1] + al[1] * u + le[1] * w];
    (this.escapeBoxes || (this.escapeBoxes = [])).push({ o: O, along: al, left: le, uOut, uEnd, wR, wL: wExit(uOut), wEnd: wExit(uEnd), exitA: [A.u, A.w], slope, wExit, turn: o.turn });
    return [P(0, wR), P(uEnd, wR), P(uEnd, wExit(uEnd)), P(B.u, B.w)];
  }
  /** the pinned wall (pinWall) that a point at arc length s, lateral d is up against, or null */
  pinAt(s, d) {
    for (const p of this.pins || []) if (Math.sign(d) === p.side && (p.a <= p.b ? s >= p.a && s <= p.b : s >= p.a || s <= p.b)) return p;
    return null;
  }
  /** how far past the kerb the paved apron may reach at sample i: def.apronMax, more round the corners of def.apronWide
   *  ({ turn: metres }: the huge paved run-offs) */
  apronMaxAt(i) {
    if (!this._amax) {
      const A = new Float32Array(this.n).fill(this.def.apronMax ?? 1e9), W = this.def.apronWide;
      if (W) for (let k = 0; k < this.n; k++) { const z = this.inCornerZone(k) || this.inCornerZone(this.idxAtS(this.s[k] + 60)) || this.inCornerZone(this.idxAtS(this.s[k] + 30)); for (const t of z ? z.turns || [z.turn] : []) if (W[t] != null) A[k] = Math.max(A[k], W[t]); }
      this._amax = A;
    }
    return this._amax[i];
  }
  /** the road's edge on a side (+1 left / -1 right) at sample i */
  edgeAt(i, side) { return side > 0 ? this.hwL[i] : this.hwR[i]; }
  /** the nearest a barrier may stand at sample i (the road's edge, the kerb and 3 m) - on a side (+1 left / -1 right), from
   *  that side's own edge: a road widened on the outside of a corner keeps its inside barrier where it was */
  minWallAt(i, side = 0) { return (side ? this.edgeAt(i, side) : this.hw[i]) + this.kerbWidth + 3.0; }
  /** no barrier closer to the road's edge than the kerb and `gap` m, wherever the road is widened */
  _clampWall(arr, gap = 3.0) { const E = arr === this.wallL ? this.hwL : arr === this.wallR ? this.hwR : this.hw; for (let i = 0; i < this.n; i++) arr[i] = Math.max(arr[i], E[i] + this.kerbWidth + gap); }
  /**
   * A road wider in places than its base width (def.widths: [{ turn, before, after, width, ease, side }]): around a corner,
   * from `before` m ahead of its apex to `after` past it, the road is `width` m across (the ends eased over `ease` m), and
   * def.width elsewhere - Austin's Turn 1, forty metres across at the top of the hill. The extra is on the corner's
   * outside (side 'out', the default; 'in' / 'both'), the barriers move out with that edge. Call once the corners have their
   * arc lengths, before anything is laid along the edges.
   */
  widen(list = this.def.widths) {
    if (!list) return;
    const n = this.n, base = this.halfWidth;
    for (const o of list) {
      const c = (this.def.corners || []).find((k) => k.n === o.turn); if (!c || c.s == null) continue;
      const ease = Math.max(1, Math.round((o.ease ?? 70) / this.ds)), i0 = this.idxAtS(c.s - (o.before ?? 60)), m = Math.round(((o.before ?? 60) + (o.after ?? 60)) / this.ds);
      const ci = this.idxAtS(c.s), z = this.cornerZones.find((q) => { const a = q.a, b = q.b; return a <= b ? ci >= a - 20 && ci <= b + 20 : ci >= a - 20 || ci <= b + 20; });
      const out = z && z.dir ? -z.dir : (this.curv[ci] > 0 ? -1 : 1), extra = o.width - 2 * base, mode = o.side || 'out';
      for (let k = -ease; k <= m + ease; k++) {
        const i = (i0 + k + n) % n, t = k < 0 ? 1 + k / ease : k > m ? 1 - (k - m) / ease : 1, w = t * t * (3 - 2 * t);
        const eo = mode === 'both' ? extra / 2 : mode === 'in' ? 0 : extra, ei = mode === 'both' ? extra / 2 : mode === 'in' ? extra : 0;
        const A = out > 0 ? this.hwL : this.hwR, B = out > 0 ? this.hwR : this.hwL;
        A[i] = Math.max(A[i], base + eo * w); B[i] = Math.max(B[i], base + ei * w);
      }
    }
    for (let i = 0; i < n; i++) { this.wallL[i] += this.hwL[i] - base; this.wallR[i] += this.hwR[i] - base; this.hw[i] = Math.max(this.hwL[i], this.hwR[i]); this.maxHalfWidth = Math.max(this.maxHalfWidth, this.hw[i]); }
    this.fanL = Float32Array.from(this.wallL); this.fanR = Float32Array.from(this.wallR);   // (the escape areas alone, before anything pulls a line in: tautWalls)
  }
  /** min-filter a wall line so a capped sample pulls its neighbours in gradually (no steps in the barrier) */
  _easeWall(arr, slope = 1.2, r = 50) {
    const tmp = Float32Array.from(arr);
    for (let i = 0; i < this.n; i++) { let m = tmp[i]; for (let k = -r; k <= r; k++) m = Math.min(m, tmp[(i + k + this.n) % this.n] + Math.abs(k) * slope); arr[i] = m; }
  }

  /**
   * A permanent circuit doubles back on itself (Village / The Loop / Aintree, Vale / Club): where the ground beside
   * the road is nearer to another part of the lap, the barrier stands on the line halfway between the two.
   */
  capSelf(margin = 1.5) {
    const q = {};
    for (const [arr, side, cap] of [[this.wallL, 1, this.capL], [this.wallR, -1, this.capR]]) {
      const before = Float32Array.from(arr);
      for (let i = 0; i < this.n; i++) {
        const lo = this.hw[i] + this.kerbWidth + 1.5;
        for (let d = lo; d <= arr[i] + margin; d += 1.5) {
          this.nearest(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d, -1, q);
          const sep = Math.min(Math.abs(q.i - i), this.n - Math.abs(q.i - i)) * this.ds;
          if (sep > Math.max(80, 4 * d)) { arr[i] = Math.max(lo, d - margin); break; }
        }
      }
      this._easeWall(arr); this._clampWall(arr, 1.5);
      for (let i = 0; i < this.n; i++) if (arr[i] < before[i] - 0.5) cap[i] = 2;
    }
  }

  wrapS(s) { const L = this.length; s %= L; return s < 0 ? s + L : s; }
  idxAtS(s) { return Math.floor(this.wrapS(s) / this.ds) % this.n; }

  /** Interpolated frame at arc length s (+ lateral offset d, left positive). */
  sample(s, d = 0, out = {}) {
    const u = this.wrapS(s) / this.ds; const i0 = Math.floor(u) % this.n, i1 = (i0 + 1) % this.n, f = u - Math.floor(u);
    const lerp = (a) => a[i0] + (a[i1] - a[i0]) * f;
    const nxv = lerp(this.nx), nzv = lerp(this.nz);
    out.x = lerp(this.px) + nxv * d; out.z = lerp(this.pz) + nzv * d;
    let txv = lerp(this.tx), tzv = lerp(this.tz); const l = Math.hypot(txv, tzv) || 1;
    out.tx = txv / l; out.tz = tzv / l; out.nx = nxv; out.nz = nzv; out.curv = lerp(this.curv); out.s = this.wrapS(s);
    return out;
  }

  /** Nearest sample -> { i, s, d (signed lateral), along } . hint = previous index for O(1) tracking. */
  nearest(x, z, hint = -1, out = {}) {
    let best = -1, bd = Infinity;
    if (hint >= 0) {
      // local search around the hint (cars move < 40 samples per step)
      for (let k = -40; k <= 40; k++) {
        const i = (hint + k + this.n) % this.n; const d = (this.px[i] - x) ** 2 + (this.pz[i] - z) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      // too far from the hint (a pit lane 60+ m from the centreline, a reset): search the whole track instead. (bd
      // must go back to Infinity too: a global search that only accepts points closer than the hint's best found
      // nothing when the hint's best WAS the nearest, and s went NaN - the lap through the pit lane never counted)
      if (bd > 60 * 60) { best = -1; bd = Infinity; }
    }
    if (best < 0) {
      const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
      for (let r = 0; r <= 3 && best < 0; r++) {
        for (let ix = cx - r; ix <= cx + r; ix++) for (let iz = cz - r; iz <= cz + r; iz++) {
          const arr = this._grid.get(`${ix},${iz}`); if (!arr) continue;
          for (const i of arr) { const d = (this.px[i] - x) ** 2 + (this.pz[i] - z) ** 2; if (d < bd) { bd = d; best = i; } }
        }
      }
      if (best < 0) for (let i = 0; i < this.n; i++) { const d = (this.px[i] - x) ** 2 + (this.pz[i] - z) ** 2; if (d < bd) { bd = d; best = i; } }
    }
    // refine along the local tangent for a continuous s
    const i = best, dx = x - this.px[i], dz = z - this.pz[i];
    const along = dx * this.tx[i] + dz * this.tz[i];
    out.i = i; out.s = this.wrapS(this.s[i] + along); out.d = dx * this.nx[i] + dz * this.nz[i]; out.along = along;
    return out;
  }

  _detectCorners() {
    // zones where |curvature| > 1/170 m, expanded by 25 m each side; used for kerbs and AI error hotspots
    const zones = []; const th = this.def.cornerCurv || 1 / 170; const pad = Math.round(25 / this.ds);
    const mask = new Uint8Array(this.n);
    for (let i = 0; i < this.n; i++) if (Math.abs(this.curv[i]) > th) for (let k = -pad; k <= pad; k++) mask[(i + k + this.n) % this.n] = 1;
    let i = 0; while (i < this.n && mask[i]) i++; // start outside a zone
    const start0 = i;
    for (let c = 0; c < this.n; c++) {
      const j = (start0 + c) % this.n, jn = (start0 + c + 1) % this.n;
      if (!mask[j] && mask[jn]) zones.push({ a: jn });
      if (mask[j] && !mask[jn] && zones.length) {
        const z = zones[zones.length - 1]; z.b = j;
        let sum = 0, cnt = 0, m = 0; for (let k = z.a; k !== (z.b + 1) % this.n; k = (k + 1) % this.n) { sum += this.curv[k]; cnt++; m = Math.max(m, Math.abs(this.curv[k])); }
        z.dir = Math.sign(sum); z.maxCurv = m; z.sA = this.s[z.a]; z.sB = this.s[z.b];
      }
    }
    return zones.filter((z) => z.b != null);
  }

  inCornerZone(i) { for (const z of this.cornerZones) { if (z.a <= z.b ? (i >= z.a && i <= z.b) : (i >= z.a || i <= z.b)) return z; } return null; }
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Procedural textures
// ---------------------------------------------------------------------------
function noiseCanvas(size, base, variance, fn) {
  const c = document.createElement('canvas'); c.width = c.height = size; const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size); const d = img.data;
  for (let i = 0; i < size * size; i++) {
    const v = base + (Math.random() - 0.5) * variance; const o = i * 4;
    d[o] = v; d[o + 1] = v; d[o + 2] = v + 3; d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  if (fn) fn(ctx, size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function asphaltTexture(day = false) { return noiseCanvas(512, day ? 108 : 62, day ? 44 : 34); }
export function concreteTexture(day = false) { return noiseCanvas(256, day ? 168 : 120, day ? 36 : 30); }
/**
 * The paved run-offs' grain: a coat of paint rolled over asphalt - near white, a fine grain in it and the aggregate
 * showing through in dark specks - so the vertex tint (tracks.js runoffPaint / runoffBase) comes through at nearly
 * full strength. (They had the concrete noise, mid grey: as a linear multiplier that is 0.39 by day and 0.19 by
 * night, and every apron colour came out at a third of itself or less - Austin's red, white and blue a muddy maroon,
 * a slate navy and a grey.) The night set is darker, as the road's is (half the day's, as the concrete's was): under
 * the floodlights nothing should glow.
 */
export function paintTexture(day = false) {
  return noiseCanvas(256, day ? 236 : 172, day ? 22 : 18, (ctx, size) => {
    for (let k = 0; k < 700; k++) { ctx.fillStyle = `rgba(40,40,44,${0.12 + Math.random() * 0.2})`; ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random(), 1 + Math.random()); }
  });
}
/** a paint colour as tracks.js writes it ([r, g, b] 0-1, sRGB like the panels' and kerbs' hex) -> the linear vertex colour */
const SRGB = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const paintRGB = (c) => [SRGB(c[0]), SRGB(c[1]), SRGB(c[2])];
/** Armco: two galvanised rails on posts. A wall ribbon maps u bottom-to-top and v along the barrier (one post per repeat). */
export function armcoTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = '#3d4a36'; ctx.fillRect(0, 0, 64, 128);                       // the gap shows the grass behind
  for (const x of [8, 36]) { const g = ctx.createLinearGradient(x, 0, x + 22, 0); g.addColorStop(0, '#c4c9cf'); g.addColorStop(0.5, '#8b9299'); g.addColorStop(1, '#d9dde2'); ctx.fillStyle = g; ctx.fillRect(x, 0, 22, 128); }
  ctx.fillStyle = '#6b7178'; ctx.fillRect(0, 58, 64, 12);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
/**
 * A catch / debris fence: diamond wire mesh with a post at each repeat and a cable along the top, alpha-tested (you see
 * through it, and it is plainly there). A wall ribbon maps u bottom-to-top and v along the barrier (3 m a repeat).
 */
export function fenceTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 96; const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 128, 96);
  ctx.strokeStyle = 'rgba(205,210,216,0.95)'; ctx.lineWidth = 1.4;
  for (let k = -128; k < 224; k += 12) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 96, 96); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k + 96, 0); ctx.lineTo(k, 96); ctx.stroke(); }
  ctx.fillStyle = '#5c636b'; ctx.fillRect(0, 0, 128, 5);     // the post (one per repeat)
  ctx.fillStyle = '#7d848c'; ctx.fillRect(122, 0, 6, 96);    // the top rail / cable
  ctx.fillRect(0, 0, 3, 96);                                 // the bottom rail
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
let _fenceMat = null;
function fenceMaterial() {
  if (!_fenceMat) _fenceMat = giveMaterial(new THREE.MeshStandardMaterial({ map: fenceTexture(), alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.4, emissive: 0x15171a }));   // (the catch fence flexes with a barrier pushed back into it)
  return _fenceMat;
}
/** a street circuit's catch-fence mesh: fine diamond chain link alone (the posts are geometry) - u up the fence, v along
 *  it (3 m a repeat) */
function streetMeshTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 192; const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 256, 192); ctx.strokeStyle = 'rgba(212,216,222,0.9)'; ctx.lineWidth = 1.2;
  for (let k = -256; k < 448; k += 9) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 192, 192); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k + 192, 0); ctx.lineTo(k, 192); ctx.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
/**
 * A street circuit's catch fence as Las Vegas has it (def.streetFence; the onboard footage): on the concrete wall, round
 * galvanised posts every 3.6 m, 4.6 m tall and then cranked in toward the track for another 0.9 m; a clamp on each post
 * at every cable; five steel cables strung along the posts in front of the chain-link mesh, the mesh up the cranked top
 * too. Wherever the barrier is a concrete wall (masks[side]); in spatial chunks, drawn to the fences' detail distance.
 */
function streetFence(tr, wallAt, masks) {
  const group = new THREE.Group(); group.name = 'fences'; group.userData.cut = DETAIL_CUT.fences;
  const H = 4.6, TOP = 5.5, LEAN = 0.55, SP = 3.6, CABLES = [1.75, 2.45, 3.15, 3.85, 4.5];
  const meshGeos = [], cableGeos = [], postGeos = [];
  for (const side of [1, -1]) {
    const m = masks[side], o = (d) => (i) => side * (wallAt(i, side) + d);
    const up = ribbon(tr, o(0.3), o(0.3), 1.2, { yB: H, mask: m, uvFn: (i) => tr.s[i] / 3 });
    const top = ribbon(tr, o(0.3), o(0.3 - LEAN), H, { yB: TOP, mask: m, uvFn: (i) => tr.s[i] / 3 });
    { const uv = top.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * (TOP - H) / (H - 1.2)); }   // (the same mesh size up the crank)
    meshGeos.push(up, top);
    for (const y of CABLES) cableGeos.push(ribbon(tr, o(0.2), o(0.2), y, { yB: y + 0.035, mask: m }));
    cableGeos.push(ribbon(tr, o(0.3 - LEAN), o(0.3 - LEAN), TOP - 0.04, { yB: TOP, mask: m }));
  }
  // one post (local: y up, z toward the track): the upright, the cranked top, a clamp at each cable
  const parts = [];
  { const g = new THREE.CylinderGeometry(0.055, 0.065, H - 1.15, 6, 1, true); g.translate(0, (H + 1.15) / 2, 0); parts.push(g); }
  { const L = Math.hypot(TOP - H, LEAN), g = new THREE.CylinderGeometry(0.05, 0.055, L, 6, 1, true); g.translate(0, L / 2, 0); g.rotateX(Math.atan2(LEAN, TOP - H)); g.translate(0, H, 0); parts.push(g); }
  for (const y of [CABLES[0], CABLES[2], CABLES[4]]) { const g = new THREE.BoxGeometry(0.16, 0.07, 0.16); g.translate(0, y + 0.02, 0.06); parts.push(g); }
  const post = mergeGeometries(parts.map((g) => g.toNonIndexed()));
  const M = new THREE.Matrix4(), X = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(), f = {};
  for (const side of [1, -1]) {
    const m = masks[side];
    for (let s = 0; s < tr.length - 1; s += SP) {
      const i = tr.idxAtS(s); if (!m(i)) continue;
      tr.sample(s, side * (wallAt(i, side) + 0.3), f);
      Z.set(-tr.nx[i] * side, 0, -tr.nz[i] * side); X.set(Z.z, 0, -Z.x); M.makeBasis(X, Y, Z).setPosition(f.x, 0, f.z);
      const g = post.clone(); g.applyMatrix4(M); g.setIndex([...Array(g.attributes.position.count).keys()]); postGeos.push(g);
    }
  }
  const meshMat = new THREE.MeshStandardMaterial({ map: streetMeshTexture(), alphaTest: 0.3, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5, emissive: 0x16181b });
  const steel = new THREE.MeshStandardMaterial({ color: 0xb9bec5, roughness: 0.45, metalness: 0.6, emissive: 0x1a1c20, side: THREE.DoubleSide });
  const cable = new THREE.MeshBasicMaterial({ color: 0x8d939b, side: THREE.DoubleSide });
  for (const [geos, mat] of [[meshGeos, meshMat], [postGeos, steel], [cableGeos, cable]]) for (const ch of [...spatialChunks(geos, mat, '').children]) group.add(ch);
  return group;
}
/**
 * The paved infield of a last chicane (pit.infield, buildPitLane - Montreal's T13-T14 as it is now): one sheet of asphalt
 * from the circuit's edge to the lane's, sharing their edge points (no overlap to fight over); the green paint round the
 * inside of the second apex, fanning out from its kerb; and the red and white tyre wall capping the pit wall's nose,
 * where a car crossing the infield would meet it.
 */
function buildInfield(tr, pit, roadMat, kw, side) {
  const grp = new THREE.Group(); grp.name = 'pit-infield';
  const { poly, kA, kB } = pit.infield, N = tr.n;
  // ---- the asphalt: the ring cut into triangles, each turned to face up, mapped in world space
  const tris = THREE.ShapeUtils.triangulateShape(poly.map(([x, z]) => new THREE.Vector2(x, z)), []);
  const pos = new Float32Array(tris.length * 9), uv = new Float32Array(tris.length * 6), col = new Float32Array(tris.length * 9);
  tris.forEach((t, f) => {
    let [a, b, c] = t; const A = poly[a], B = poly[b], C = poly[c];
    if ((B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]) > 0) { const q = b; b = c; c = q; }   // (counter-clockwise in x/z faces down)
    [a, b, c].forEach((v, k) => { const [x, z] = poly[v], o = f * 9 + k * 3; pos[o] = x; pos[o + 1] = 0; pos[o + 2] = z; uv[f * 6 + k * 2] = x / 9; uv[f * 6 + k * 2 + 1] = z / 9; col[o] = 0.8; col[o + 1] = 0.8; col[o + 2] = 0.83; });
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const night = asphaltTexture(), day = asphaltTexture(true), mat = roadMat.clone(); mat.map = night;
  grp.userData.setTime = (isDay) => { mat.map = isDay ? day : night; mat.emissiveIntensity = isDay ? 0 : 0.6; mat.needsUpdate = true; };   // (the road's day / night sets: buildTrackMeshes' setTime)
  const sheet = new THREE.Mesh(g, mat); sheet.name = 'pit-infield:asphalt'; sheet.userData.keep = true; grp.add(sheet);
  // ---- the green round the inside of the second apex: from its kerb out to 7 m at the apex, fading to the kerb either way
  const span = (kB - kA + N) % N, inside = new Float32Array(N);
  for (let m = 0, k = kA; m <= span; m++, k = (k + 1) % N) if (tr.inCorner[k] && tr.curv[k] * side > 0.006) inside[k] = Math.min(1, (tr.curv[k] * side - 0.006) / 0.03);
  // (blurred along the kerb - 6 samples either way, Gaussian - and eased, so its edge is one smooth curve, not a step per sample)
  const W = new Float32Array(N), R = 14, sig = 6;
  for (let m = 0, k = kA; m <= span; m++, k = (k + 1) % N) {
    let a = 0, b = 0; for (let j = -R; j <= R; j++) { const g = Math.exp(-(j * j) / (2 * sig * sig)); a += g * inside[(k + j + N) % N]; b += g; }
    const t = Math.min(1, (a / b) * 1.5); W[k] = 7 * t * t * (3 - 2 * t);
  }
  const e0 = (i) => tr.edgeAt(i, side) + kw + 0.05;
  const green = ribbon(tr, (i) => side * e0(i), (i) => side * (e0(i) + W[i]), 0.01, { mask: (i) => W[i] > 0.3 && W[(i + 1) % N] > 0.3, closed: tr.closed });
  if (green.index.count) grp.add(new THREE.Mesh(green, new THREE.MeshStandardMaterial({ color: 0x2f8a4c, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })));
  // ---- the tyre wall on the pit wall's nose: blocks of red and white along its first 14 m, a little proud of it all round
  const tyres = [];
  for (let m = 0; m < 7; m++) {
    const k = (kB + m) % N, d = pit.wallD[k]; if (!isFinite(d)) continue;
    const b = new THREE.BoxGeometry(1.7, 1.25, tr.ds * 0.96); b.rotateY(Math.atan2(tr.tx[k], tr.tz[k]));
    const c = side * (d + 0.15); b.translate(tr.px[k] + tr.nx[k] * c + tr.tx[k] * tr.ds * 0.5, 0.625, tr.pz[k] + tr.nz[k] * c + tr.tz[k] * tr.ds * 0.5);
    const rgb = m % 2 ? [0.93, 0.93, 0.93] : [0.82, 0.08, 0.08], cc = new Float32Array(b.attributes.position.count * 3); for (let q = 0; q < cc.length; q += 3) cc.set(rgb, q);
    b.setAttribute('color', new THREE.BufferAttribute(cc, 3)); tyres.push(b);
  }
  if (tyres.length) { const m = new THREE.Mesh(mergeGeometries(tyres), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75 })); m.name = 'pit-infield:tyres'; m.castShadow = true; grp.add(m); }
  return grp;
}
/** TecPro blocks: how deep (m, back from the barrier's face), how tall, how long each, the gap between two */
export const TECPRO = { depth: 0.75, h: 1.1, len: 1.5, gap: 0.05, bevel: 0.09 };
/** where a soft wall (GIVE.SOFT) stands in front of tyres or Armco: drawn as a run of TecPro blocks (a SAFER wall's is concrete) */
export const isTecpro = (tr, i, side) => { const g = side > 0 ? tr.giveL : tr.giveR, b = side > 0 ? tr.barL[i] : tr.barR[i]; return !!g && g[i] === GIVE.SOFT && b !== BAR.WALL && b !== BAR.NONE; };
/** one block's face: white (the vertex colour makes half of them red), the seams dark, the logo plate and its lettering */
let _tpTex = null;
function tecproTexture() {
  if (_tpTex) return _tpTex;
  const c = document.createElement('canvas'); c.width = 256; c.height = 192; const x = c.getContext('2d');
  x.fillStyle = '#f4f4f2'; x.fillRect(0, 0, 256, 192);
  const gr = x.createLinearGradient(0, 0, 0, 192); gr.addColorStop(0, 'rgba(255,255,255,0.35)'); gr.addColorStop(0.15, 'rgba(255,255,255,0)'); gr.addColorStop(0.85, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.25)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 192);
  x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(0, 0, 5, 192); x.fillRect(251, 0, 5, 192);   // (the moulded edges, where two blocks meet)
  x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(0, 118, 256, 4);                              // (the strap between the blocks)
  x.fillStyle = 'rgba(80,80,80,0.75)'; x.font = '800 40px Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TECPRO', 128, 74);
  _tpTex = new THREE.CanvasTexture(c); _tpTex.colorSpace = THREE.SRGBColorSpace; _tpTex.anisotropy = 4;
  return _tpTex;
}
/**
 * The TecPro blocks along one side's barrier line where mask(i): solid blocks, TECPRO.len long, standing behind the
 * barrier's face (the face is where the physics has it - vehicle/Car.js BARRIER.soft), linked in a chain, red and
 * white in turn. Each vertex carries aGive - 1 on the face a car presses, falling to 0.1 at the back - so the barrier's
 * give (world/BarrierGive.js) squashes them: the face pushed back, the back held, the top bulging up.
 */
function tecproBlocks(tr, side, wallAt, mask) {
  const n = tr.n, L = tr.length, T = TECPRO, pos = [], uv = [], col = [], giv = [];
  const P = (sv, out) => {   // (the barrier's face at arc length sv on this side, and the normal out of the road there)
    sv = ((sv % L) + L) % L; const f = sv / tr.ds, i = Math.floor(f) % n, j = (i + 1) % n, t = f - Math.floor(f);
    const wi = wallAt(i, side), wj = wallAt(j, side);
    out[0] = (tr.px[i] + tr.nx[i] * side * wi) * (1 - t) + (tr.px[j] + tr.nx[j] * side * wj) * t;
    out[1] = (tr.pz[i] + tr.nz[i] * side * wi) * (1 - t) + (tr.pz[j] + tr.nz[j] * side * wj) * t;
    out[2] = (tr.nx[i] * (1 - t) + tr.nx[j] * t) * side; out[3] = (tr.nz[i] * (1 - t) + tr.nz[j] * t) * side; return out;
  };
  // the cross-section (w out from the face, y up) and what each edge gives: the face, the bevel, the top's back edge, the back
  const SEC = [[0, 0, 1], [0, T.h - T.bevel, 1], [T.bevel, T.h, 0.85], [T.depth, T.h, 0.1], [T.depth, 0, 0.1]];
  const A = [0, 0, 0, 0], B = [0, 0, 0, 0];
  const vert = (E, w, y, g, u, v, rgb) => { pos.push(E[0] + E[2] * w, y, E[1] + E[3] * w); uv.push(u, v); col.push(rgb[0], rgb[1], rgb[2]); giv.push(g); };
  const PLAIN = [0.5, 0.06];
  let start = -1;
  for (let k = 0; k <= n; k++) {
    const on = k < n && mask(k);
    if (on && start < 0) start = k;
    if ((!on || k === n) && start >= 0) {
      const s0 = start * tr.ds, s1 = k * tr.ds, m = Math.floor((s1 - s0 + 1e-6) / T.len);
      for (let b = 0; b < m; b++) {
        const sa = s0 + (s1 - s0 - m * T.len) / 2 + b * T.len, sb = sa + T.len - T.gap;
        P(sa, A); P(sb, B);
        const red = (Math.round(sa / T.len) & 1) === 0, rgb = red ? [0.84, 0.1, 0.12] : [1, 1, 1];
        const [E0, E1] = side > 0 ? [A, B] : [B, A];   // (wound so the faces look out of the block)
        // the four long faces: face, bevel, top, back
        for (let q = 0; q < 4; q++) {
          const p0 = SEC[q], p1 = SEC[q + 1], front = q === 0;
          const u0 = 0, u1 = 1, v0 = front ? 0 : PLAIN[1], v1 = front ? (T.h - T.bevel) / T.h : PLAIN[1];
          const a = [E0, p0, front ? u0 : PLAIN[0], v0], bb = [E1, p0, front ? u1 : PLAIN[0], v0], c = [E1, p1, front ? u1 : PLAIN[0], v1], d = [E0, p1, front ? u0 : PLAIN[0], v1];
          for (const [E, pp, u, v] of [a, bb, c, a, c, d]) vert(E, pp[0], pp[1], pp[2], side > 0 ? u : 1 - u, v, rgb);
        }
        // the two ends: the cross-section, fanned
        for (const [E, flip] of [[E0, false], [E1, true]]) for (let q = 1; q < 4; q++) {
          const tri = flip ? [SEC[0], SEC[q + 1], SEC[q]] : [SEC[0], SEC[q], SEC[q + 1]];
          for (const pp of tri) vert(E, pp[0], pp[1], pp[2], PLAIN[0], PLAIN[1], rgb);
        }
      }
      start = -1;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setAttribute('aGive', new THREE.Float32BufferAttribute(giv, 1));
  g.computeVertexNormals();
  g.setIndex(Array.from({ length: pos.length / 3 }, (_, k) => k));   // (spatialChunks sorts by triangle)
  return g;
}
/** the catch fences in front of the grandstands (Track.markFences), built once the stands are placed */
export function buildCatchFences(track, pit) {
  const tr = track, group = new THREE.Group(); group.name = 'catch-fences';
  if (!tr.fenceL) return group;
  const pitSide = pit ? pit.sideSign : 0;
  // (behind the barrier it stands on, always: on the pit side the barrier drawn is the pit wall (buildTrackMeshes'
  //  wallGeo), not the track's own line - a fence on the track's line stood in front of it round Austin's pit roads)
  const pitWall = pit ? new Float32Array(tr.n) : null;
  if (pit) for (let i = 0; i < tr.n; i++) { let v = pit.wallD[i]; for (let k = 1; isNaN(v) && k < 12; k++) { v = pit.wallD[(i - k + tr.n) % tr.n]; if (isNaN(v)) v = pit.wallD[(i + k) % tr.n]; } pitWall[i] = isNaN(v) ? tr.wallAt(i, pitSide) : v; }
  const barAt = (i, side) => (pit && side === pitSide ? pitWall[i] : tr.wallAt(i, side));
  const geos = [1, -1].map((side) => {
    const f = side > 0 ? tr.fenceL : tr.fenceR;
    const mask = (i) => f[i] && f[(i + 1) % tr.n] && !(pit && side === pitSide && (pit.laneCovers?.[i] || tr.pitInfield?.[i]));
    const off = (i) => barAt(i, side) + 0.25 + (isTecpro(tr, i, side) ? TECPRO.depth : 0);   // (behind the TecPro blocks where they stand)
    return ribbon(tr, (i) => side * off(i), (i) => side * off(i), 0.4, { yB: FENCE_H, mask, uvFn: (i) => tr.s[i] / 3 });
  }).filter((g) => g.index.count);
  if (geos.length) group.add(spatialChunks(geos, fenceMaterial(), 'catchFences'));
  return group;
}
/** gravel trap: pale stone-coloured speckle with raked furrows */
export function gravelTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const ctx = c.getContext('2d');
  const img = ctx.createImageData(256, 256); const d = img.data;
  for (let i = 0; i < 256 * 256; i++) {
    const v = (Math.random() - 0.5) * 46 + 7 * Math.sin((i % 256) * 0.39); const o = i * 4;
    d[o] = 196 + v; d[o + 1] = 180 + v; d[o + 2] = 148 + v * 0.9; d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function checkerTexture(n = 8) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const ctx = c.getContext('2d'); const s = 256 / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { ctx.fillStyle = (i + j) % 2 ? '#111' : '#f4f4f4'; ctx.fillRect(i * s, j * s, s, s); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------------------
// Mesh construction
// ---------------------------------------------------------------------------
/**
 * Ribbon between lateral offsets offA(i) and offB(i) (functions of sample index).
 * mask(i) may skip segments. colorFn(i, d) -> [r,g,b] for vertex colors. y may be a function of i.
 * uv: u = 0 at offA, 1 at offB; v = uvFn(i) if given, else s / uvV.
 */
export function ribbon(tr, offA, offB, y, { mask = null, colorFn = null, uvV = 8, closed = tr.closed, yB = null, uvFn = null, wx = false } = {}) {
  const pos = [], uv = [], idx = [], col = [], wxa = [];   // (wx: each vertex's lap distance and lateral offset, for the road's wetness - race/Weather.js, main.js wetRoad)
  const n = tr.n, segs = closed ? n : n - 1;
  let vcount = 0; let prevEmitted = false;
  const yAt = (i) => (typeof y === 'function' ? y(i) : y);
  const yBAt = (i) => (yB == null ? yAt(i) : (typeof yB === 'function' ? yB(i) : yB));
  const vAt = (i) => (uvFn ? uvFn(i) : tr.s[i] / uvV);
  const emit = (i, vOver = null) => {
    let a = offA(i), b = offB(i);
    // a flat ribbon always runs right edge to left edge, whatever order its offsets were given in (backwards, it
    // faces down and is culled - which once made Silverstone's pit lane grass); walls (yB) keep their order
    if (yB == null && a > b) { const t = a; a = b; b = t; }
    pos.push(tr.px[i] + tr.nx[i] * a, yAt(i), tr.pz[i] + tr.nz[i] * a, tr.px[i] + tr.nx[i] * b, yBAt(i), tr.pz[i] + tr.nz[i] * b);
    const v = vOver ?? vAt(i);
    uv.push(0, v, 1, v);
    if (wx) { const sv = vOver != null ? vOver * uvV : tr.s[i]; wxa.push(sv, a, sv, b); }
    if (colorFn) { col.push(...colorFn(i, a), ...colorFn(i, b)); }
    return vcount++;
  };
  for (let k = 0; k < segs; k++) {
    const i = k, j = (k + 1) % n;
    if (mask && !mask(i)) { prevEmitted = false; continue; }
    let vi;
    if (!prevEmitted) vi = emit(i); else vi = vcount - 1;
    // (the segment that closes the lap, back across the line to sample 0: its far end's coordinate runs on from the
    //  last sample's, not back to the first's - a lap's worth of banner or kerb squeezed into one segment otherwise)
    const vj = closed && k === n - 1 && n > 2 ? emit(j, 2 * vAt(n - 1) - vAt(n - 2)) : emit(j);
    const a0 = vi * 2, a1 = vi * 2 + 1, b0 = vj * 2, b1 = vj * 2 + 1;
    idx.push(a0, b0, a1, a1, b0, b1);
    prevEmitted = true;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (colorFn) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  if (wx) g.setAttribute('aWx', new THREE.Float32BufferAttribute(wxa, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
const inRangeS = (s, a, b) => (a <= b ? s >= a && s <= b : s >= a || s <= b);

/**
 * Split a lap-long geometry into chunk meshes that share its vertex buffers (draw ranges over the index) with a
 * bounding sphere per chunk, so the renderer frustum-culls the parts of the circuit that are off camera. One
 * mesh per ~`tris` triangles (a ribbon segment is 2 triangles, so 800 = ~400 samples = 800 m).
 */
export function chunked(geo, mat, tris = 800, name = '') {
  const grp = new THREE.Group(); grp.name = name;
  const idx = geo.index; if (!idx || idx.count === 0) return grp;
  const pos = geo.attributes.position.array; const per = tris * 3;
  for (let start = 0; start < idx.count; start += per) {
    const count = Math.min(per, idx.count - start);
    const g = new THREE.BufferGeometry(); for (const k in geo.attributes) g.setAttribute(k, geo.attributes[k]); g.setIndex(idx); g.setDrawRange(start, count);
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = start; i < start + count; i++) { const v = idx.array[i] * 3; const x = pos[v], y = pos[v + 1], z = pos[v + 2]; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; if (z < minZ) minZ = z; if (z > maxZ) maxZ = z; }
    const c = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
    g.boundingSphere = new THREE.Sphere(c, Math.hypot(maxX - minX, maxY - minY, maxZ - minZ) / 2 + 1);
    g.boundingBox = new THREE.Box3(new THREE.Vector3(minX, minY, minZ), new THREE.Vector3(maxX, maxY, maxZ));
    grp.add(new THREE.Mesh(g, mat));
  }
  return grp;
}

/**
 * Several geometries that share one material (both sides' lines, kerbs, walls, every sponsor panel of the atlas)
 * merged and re-ordered by 500 m map cells: each cell is one draw range with its own bounding sphere. A stretch
 * of circuit in view then costs one draw call per material, instead of one per ribbon per chunk.
 */
export function spatialChunks(geos, mat, name = '', cell = 500) {
  const grp = new THREE.Group(); grp.name = name;
  if (DETAIL_CUT[name]) grp.userData.cut = DETAIL_CUT[name];   // thin detail: not drawn beyond this distance (main.js cullDetail)
  geos = geos.filter((g) => g && g.index && g.index.count);
  if (!geos.length) return grp;
  const geo = geos.length === 1 ? geos[0] : mergeGeometries(geos);
  const idx = geo.index.array, pos = geo.attributes.position.array, buckets = new Map();
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const key = Math.floor((pos[a] + pos[b] + pos[c]) / 3 / cell) * 100003 + Math.floor((pos[a + 2] + pos[b + 2] + pos[c + 2]) / 3 / cell);
    let arr = buckets.get(key); if (!arr) buckets.set(key, (arr = [])); arr.push(idx[t], idx[t + 1], idx[t + 2]);
  }
  const order = geo.attributes.position.count > 65535 ? new Uint32Array(idx.length) : new Uint16Array(idx.length);
  const ranges = []; let o = 0;
  for (const arr of buckets.values()) { order.set(arr, o); ranges.push([o, arr.length]); o += arr.length; }
  geo.setIndex(new THREE.BufferAttribute(order, 1));
  for (const [start, count] of ranges) {
    const g = new THREE.BufferGeometry(); for (const k in geo.attributes) g.setAttribute(k, geo.attributes[k]); g.setIndex(geo.index); g.setDrawRange(start, count);
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let i = start; i < start + count; i++) { const v = order[i] * 3; const x = pos[v], y = pos[v + 1], z = pos[v + 2]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; if (z < z0) z0 = z; if (z > z1) z1 = z; }
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), Math.hypot(x1 - x0, y1 - y0, z1 - z0) / 2 + 1);
    g.boundingBox = new THREE.Box3(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1));
    grp.add(new THREE.Mesh(g, mat));
  }
  return grp;
}

export function buildTrackMeshes(track, pit, gridSlots) {
  const group = new THREE.Group(); group.name = 'track';
  const tr = track, hw = tr.halfWidth, kw = tr.kerbWidth, ro = tr.runoffWidth, bo = tr.barrierOffset;
  const pitSide = pit ? pit.sideSign : 0;
  /** is the barrier present on this side at sample i? (false = open: the pit lane branches off / rejoins here) */
  const open = (i, side) => !(pit && side === pitSide && (isNaN(pit.wallD[i]) || tr.pitInfield?.[i]));   // (a paved infield's barrier is the lane's escape wall: drawn with the lane)
  // barrier distance used for GEOMETRY (per sample: pushed back on the outside of corners for the run-offs, the pit
  // wall on the pit side). An open sample takes the nearest closed sample's value, because the segment before an
  // opening still emits a vertex at the opening sample (a NaN there would poison the whole mesh)
  const wallGeo = new Float32Array(tr.n);
  for (let i = 0; i < tr.n; i++) wallGeo[i] = tr.wallAt(i, pitSide || 1);
  if (pit) for (let i = 0; i < tr.n; i++) { let v = pit.wallD[i]; for (let k = 1; isNaN(v) && k < 12; k++) { v = pit.wallD[(i - k + tr.n) % tr.n]; if (isNaN(v)) v = pit.wallD[(i + k) % tr.n]; } if (!isNaN(v)) wallGeo[i] = v; }
  const wallAt = (i, side) => (pit && side === pitSide ? wallGeo[i] : tr.wallAt(i, side));

  // --- road surface: asphalt with vertex-colour rubbering toward the centre
  const asphalt = asphaltTexture(); asphalt.repeat.set(2, 1);
  const roadMat = new THREE.MeshStandardMaterial({ map: asphalt, roughness: 0.62, metalness: 0.06, envMapIntensity: 0.55, vertexColors: true, emissive: 0x0c0d12, emissiveIntensity: 0.6 });   // slick: floodlights / Sphere glow smear across it
  const HW = tr.hw, HL = tr.hwL, HR = tr.hwR, EG = (i, side) => (side > 0 ? HL[i] : HR[i]);
  const roadGeo = ribbon(tr, (i) => -HR[i], (i) => HL[i], 0, { colorFn: (i, d) => { const r = 1 - 0.28 * Math.exp(-(d * d) / 18); return [r, r, r]; }, uvV: 10, wx: true });
  group.add(spatialChunks([roadGeo], roadMat, 'road')); group.userData.roadMat = roadMat;   // lap-long ribbons are cut into map cells so off-camera parts cull

  // --- white edge lines (polygon offset: painted overlays never z-fight with the road at distance)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const l1 = ribbon(tr, (i) => HL[i] - 0.25, (i) => HL[i], 0.012), l2 = ribbon(tr, (i) => -HR[i], (i) => -HR[i] + 0.25, 0.012);
  group.add(spatialChunks([l1, l2], lineMat, 'lines'));

  // --- kerbs: the Las Vegas card-suit kerbs (red / white blocks with spades, hearts, clubs, diamonds), corner zones only
  const kerbMask = (i) => tr.inCorner[i] === 1;
  const kerbTex = kerbTexture(tr.def.kerb || 'cards');
  const kL = ribbon(tr, (i) => HL[i], (i) => HL[i] + kw, 0.02, { mask: kerbMask, yB: 0.06, uvV: 10 });
  const kR = ribbon(tr, (i) => -HR[i] - kw, (i) => -HR[i], 0.06, { mask: kerbMask, yB: 0.02, uvV: 10 });
  const kerbMat = new THREE.MeshStandardMaterial({ map: kerbTex, roughness: 0.62, emissive: 0xffffff, emissiveMap: kerbTex, emissiveIntensity: 0.18, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  group.add(spatialChunks([kL, kR], kerbMat, 'kerbs'));

  // --- run-off (painted concrete/asphalt), full lap; on the pit side it stops at the pit wall and is absent where the pit lane branches off
  // (the grain is near white and the colours are the paint's own, made linear: tracks.js writes them as sRGB, like
  //  every hex on the circuit, and a vertex colour is used as it stands - a red of 0.72 read as linear is a pink, and
  //  times the old mid-grey concrete map it came out maroon. paintTexture: fresh paint in the sun, grain enough not to
  //  look like plastic, and a darker night set so nothing glows under the lights)
  const grain = paintTexture(); grain.repeat.set(1, 1);
  // (no polygon offset and the same y as the road: the surfaces share edges instead of overlapping, and a
  //  positive offset would push them behind the ground plane at grazing angles - the black patches of old)
  // The paved run-off reaches all the way to the barrier (which is pushed back on the outside of corners), and is
  // painted per corner like the real event: red at T1, T-Mobile magenta around the Sphere loop, teal at T12 / T14.
  const runMat = new THREE.MeshStandardMaterial({ map: grain, color: 0xffffff, vertexColors: true, roughness: 0.88, emissive: 0x0a0a0c });
  const runMats = [runMat];   // every material on the run-off grain (setTime swaps the day / night set on each)
  const runEdge = (i, side) => wallAt(i, side);
  const runMask = (side) => (i) => open(i, side) && runEdge(i, side) > EG(i, side) + kw + 0.25 && !(pit && side === pitSide && pit.laneCovers[i]);
  const paint = tr.def.runoffPaint || [];
  // (bare concrete: the grey that comes out as bright on the new grain, day and night, as 0.6 / 0.62 / 0.65 did on the old)
  const CONCRETE = paintRGB([0.57, 0.58, 0.6]), runBase = tr.def.runoffBase ? paintRGB(tr.def.runoffBase) : CONCRETE;
  const paintCol = paint.map((p) => paintRGB(p.color || p.base || [0.85, 0.86, 0.88]));   // per-track apron colours (tracks.js), linear
  const runTint = (i, d) => {
    if (wallAt(i, d > 0 ? 1 : -1) < bo + (EG(i, d > 0 ? 1 : -1) - hw) + 1.5) return runBase;   // only the escape apron is painted, the normal verge stays concrete
    const z = tr.inCornerZone(i) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 60)) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 30));
    const turns = z ? (z.turns || [z.turn]) : [];
    for (let k = 0; k < paint.length; k++) if (turns.some((t) => paint[k].turns.includes(t))) return paintCol[k];
    return runBase;
  };
  const circuit = tr.circuit;
  const surfAt = (i, side) => (side > 0 ? tr.surfL[i] : tr.surfR[i]);
  let gravelMat = null;
  if (!circuit) {
    const runL = ribbon(tr, (i) => HL[i] + (kerbMask(i) ? kw : 0), (i) => runEdge(i, 1), 0, { uvV: 6, mask: runMask(1), colorFn: runTint });
    const runR = ribbon(tr, (i) => -runEdge(i, -1), (i) => -HR[i] - (kerbMask(i) ? kw : 0), 0, { uvV: 6, mask: runMask(-1), colorFn: runTint });
    group.add(spatialChunks([runL, runR], runMat, 'runoff'));
  } else {
    // A permanent circuit: the verge is grass (the ground itself). Escape areas on the outside of the corners are
    // gravel traps (2 m of grass beyond the kerb, then gravel to just short of the barrier) or painted asphalt
    // from the kerb out; textures are mapped in world space so a 50 m deep trap is not one stretched tile.
    const worldUV = (g, scale) => { const p = g.attributes.position, uv = g.attributes.uv; for (let k = 0; k < p.count; k++) uv.setXY(k, p.getX(k) / scale, p.getZ(k) / scale); return g; };
    const inner = (i, t, side = 1) => EG(i, side) + kw + (t === 2 ? GRAVEL_IN : 0) - (t === 1 && !kerbMask(i) ? kw : 0);
    const outer = (i, side, t) => Math.max(inner(i, t, side), Math.min(runEdge(i, side) - APRON_EDGE, t === 1 ? EG(i, side) + kw + tr.apronMaxAt(i) : Infinity));
    const apronMask = (side, t) => (i) => { const j = (i + 1) % tr.n; return open(i, side) && surfAt(i, side) === t && surfAt(j, side) === t && !(pit && side === pitSide && pit.laneCovers[i]); };
    const apron = (t, opts) => [1, -1].map((side) => worldUV(side > 0
      ? ribbon(tr, (i) => inner(i, t, 1), (i) => outer(i, 1, t), 0.004, { mask: apronMask(1, t), ...opts })
      : ribbon(tr, (i) => -outer(i, -1, t), (i) => -inner(i, t, -1), 0.004, { mask: apronMask(-1, t), ...opts }), t === 2 ? 5 : 7));
    const asph = apron(1, { colorFn: runTint }).filter((g) => g.index.count);
    group.add(spatialChunks(asph, runMat, 'runAsphalt'));
    // painted in stripes (def.runoffPaint { turns, stripes: [colours], w (each band's width), bands }): bands following
    // the kerb out across the asphalt apron, a colour each in turn - Austin's red, white and blue
    const striped = paint.filter((p) => p.stripes);
    if (striped.length) {
      const stripeOf = (i) => { const z = tr.inCornerZone(i) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 60)) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 30)), ts = z ? (z.turns || [z.turn]) : []; return striped.find((p) => ts.some((x) => p.turns.includes(x))) || null; };
      const geos = [];
      for (const side of [1, -1]) for (const P of striped) {
        const w = P.w || 2.6, nB = P.bands || 16, n = tr.n, on = new Uint8Array(n);
        for (let i = 0; i < n; i++) on[i] = apronMask(side, 1)(i) && stripeOf(i) === P ? 1 : 0;
        // (the paint fans in and out: over its first and last 60 m the bands narrow down to the kerb, so a corner's
        //  stripes grow out of it and die away into it instead of starting square across the apron)
        const fw = new Float32Array(n), bw = new Float32Array(n), T = new Float32Array(n), R = Math.round(60 / tr.ds);
        for (let pass = 0; pass < 2; pass++) for (let k = 0; k < n; k++) { const i = k % n, p = (i - 1 + n) % n; fw[i] = on[i] ? (on[p] ? fw[p] + 1 : 1) : 0; }
        for (let pass = 0; pass < 2; pass++) for (let k = n - 1; k >= 0; k--) { const i = k, q = (i + 1) % n; bw[i] = on[i] ? (on[q] ? bw[q] + 1 : 1) : 0; }
        for (let i = 0; i < n; i++) { const u = Math.min(1, Math.min(fw[i], bw[i]) / R); T[i] = u * u * (3 - 2 * u); }
        for (let k = 0; k < nB; k++) {
          const col = paintRGB(P.stripes[k % P.stripes.length]), a = (i) => Math.min(inner(i, 1, side) + k * w * T[i], outer(i, side, 1)), b = (i) => Math.min(inner(i, 1, side) + (k + 1) * w * T[i], outer(i, side, 1));
          const mask = (i) => on[i] && on[(i + 1) % n] && T[i] > 0.01 && b(i) - a(i) > 0.02;
          const g = side > 0 ? ribbon(tr, a, b, 0.008, { mask, colorFn: () => col }) : ribbon(tr, (i) => -b(i), (i) => -a(i), 0.008, { mask, colorFn: () => col });
          if (g.index.count) geos.push(worldUV(g, 7));
        }
      }
      // (drawn over the apron with a depth bias of their own: 4 mm above it is below the depth buffer's precision once
      //  the ground lifts it all onto the hills, and the two would fight - the stripes breaking up into the grey)
      // (a clone holds the map it was cloned with: it goes in runMats so the day / night swap reaches it too - it
      //  kept the dark night grain all day long, the stripes at half the brightness of the apron they sit on)
      const stripeMat = runMat.clone(); stripeMat.polygonOffset = true; stripeMat.polygonOffsetFactor = -1.5; stripeMat.polygonOffsetUnits = -3;
      if (geos.length) { group.add(spatialChunks(geos, stripeMat, 'runStripes')); runMats.push(stripeMat); }
    }
    gravelMat = new THREE.MeshStandardMaterial({ map: gravelTexture(), roughness: 1, metalness: 0 });
    group.add(spatialChunks(apron(2, {}), gravelMat, 'runGravel'));
  }

  // --- barriers: sponsor panels (Heineken 0.0, Pirelli, Fabulous Las Vegas, chevrons, Golden Knights ...) in 180 m
  //     zones, all from one atlas texture: one material for every banner on the circuit
  const atlas = barrierAtlas();
  const panelMat = new THREE.MeshStandardMaterial({ map: atlas, emissive: 0xffffff, emissiveMap: atlas, emissiveIntensity: 0.55, roughness: 0.55, side: THREE.DoubleSide });
  giveMaterial(panelMat);   // (pushed back round a car pressing into a barrier that gives: world/BarrierGive.js)
  const zoneOf = (i) => Math.floor(tr.s[i] / ZONE_LEN);
  const nZones = Math.ceil(tr.length / ZONE_LEN);
  const panelGeos = []; const tecproGeos = [];
  // the T-Mobile Zone: every barrier around the Sphere loop (T5 - T9) carries the magenta panel
  // (T5 through the straight past the Sphere itself to T10: the Sphere sits between T9 and T10)
  const cs = tr.def.corners || []; const sz = tr.def.sponsorZone; const seq = tr.def.zoneSeq || ZONE_SEQ;
  const cA = sz && cs.find((c) => c.n === sz.fromTurn), cB = sz && cs.find((c) => c.n === sz.toTurn);
  const tmobile = cA && cB && cA.s != null && cB.s != null ? [tr.wrapS(cA.s - (sz.before || 0)), tr.wrapS(cB.s + (sz.after || 0))] : null;
  const inTMobile = (z) => tmobile && inRangeS(tr.wrapS(z * ZONE_LEN + ZONE_LEN / 2), tmobile[0], tmobile[1]);
  // panels by the metre: a wall pinned with its own panel (Track.pinWall: the Wall of Champions) and the named sponsor
  // stretches of def.sponsorZones ([{ panel, fromTurn, toTurn, before, after, side? }]) take their stretch of wall
  // from the 180 m zone sequence
  const over = [];
  for (const p of tr.pins || []) if (p.panel != null) over.push({ a: p.a, b: p.b, side: p.side, panel: p.panel });
  for (const z of tr.def.sponsorZones || []) {
    const A = cs.find((c) => c.n === z.fromTurn), B = cs.find((c) => c.n === (z.toTurn ?? z.fromTurn)); if (!A || !B || A.s == null || B.s == null) continue;
    for (const side of z.side ? [z.side] : [1, -1]) over.push({ a: tr.wrapS(A.s - (z.before || 0)), b: tr.wrapS(B.s + (z.after || 0)), side, panel: z.panel });
  }
  const overAt = (i, side) => { for (const o of over) if (o.side === side && inRangeS(tr.s[i], o.a, o.b)) return o; return null; };
  // What stands at the barrier line (Track.barL / barR). A street circuit is concrete wall, fence and LED rail all
  // the way round. A permanent circuit has mostly nothing: a banner-covered tyre wall in front of stands and
  // buildings, Armco between close parts of the lap, the concrete pit wall.
  const style = (i, side) => (side > 0 ? tr.barL[i] : tr.barR[i]);
  const seg = (side, fn) => (i) => open(i, side) && fn(style(i, side)) && fn(style((i + 1) % tr.n, side));
  // (where TecPro blocks stand - a soft wall in front of tyres or Armco - nothing else is drawn on the line)
  const tp = (i, side) => isTecpro(tr, i, side) || isTecpro(tr, (i + 1) % tr.n, side);
  const segT = (side, fn) => (i) => seg(side, fn)(i) && !tp(i, side);
  for (const side of [1, -1]) {
    for (let z = 0; z < nZones; z++) {
      const p = inTMobile(z) ? sz.panel : seq[(z + (side < 0 ? 5 : 0)) % seq.length];
      const keep = segT(side, (st) => (tr.walled ? st === BAR.WALL : st >= BAR.TYRES));   // (the TecPro runs: below)
      const g = ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 1.2, mask: (i) => zoneOf(i) === z && keep(i) && !overAt(i, side), uvFn: (i) => -side * tr.s[i] / PANEL_LEN });
      if (!g.index.count) continue;
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, atlasU(p, uv.getX(k)));   // this zone's tile of the atlas
      panelGeos.push(g);
    }
    // the red and white TecPro blocks wherever a soft wall stands in front of tyres or Armco: across the back of a park
    // circuit's escape areas (Montreal), behind the run-offs a circuit names (def.barriers) - solid, linked, and squashed
    // where a car presses into them (world/BarrierGive.js)
    const tpg = tecproBlocks(tr, side, wallAt, (i) => open(i, side) && isTecpro(tr, i, side));
    if (tpg.attributes.position.count) tecproGeos.push(tpg);
    for (const o of over) {
      if (o.side !== side) continue;
      const keep = segT(side, (st) => st >= BAR.TYRES);
      const g = ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 1.2, mask: (i) => keep(i) && inRangeS(tr.s[i], o.a, o.b), uvFn: (i) => -side * tr.s[i] / PANEL_LEN });
      if (!g.index.count) continue;
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, atlasU(o.panel, uv.getX(k)));
      panelGeos.push(g);
    }
  }
  group.add(spatialChunks(panelGeos, panelMat, 'panels'));
  if (tecproGeos.length) { const tm = giveMaterial(new THREE.MeshStandardMaterial({ map: tecproTexture(), vertexColors: true, roughness: 0.6 }), { blocks: true }); const tg = spatialChunks(tecproGeos, tm, 'tecpro'); tg.traverse((o) => { if (o.isMesh) o.castShadow = true; }); group.add(tg); }
  // wall caps, debris fence, blue LED rail
  const wallMat = giveMaterial(new THREE.MeshStandardMaterial({ color: 0x8e9299, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x151515 }));
  const solidL = seg(1, (st) => st === BAR.WALL), solidR = seg(-1, (st) => st === BAR.WALL);
  const wLt = ribbon(tr, (i) => wallAt(i, 1), (i) => wallAt(i, 1) + 0.6, 1.2, { mask: solidL }), wRt = ribbon(tr, (i) => -wallAt(i, -1) - 0.6, (i) => -wallAt(i, -1), 1.2, { mask: solidR });
  group.add(spatialChunks([wLt, wRt], wallMat, 'caps'));
  const fenceMat = fenceMaterial();
  if (tr.def.streetFence) group.add(streetFence(tr, wallAt, { 1: solidL, '-1': solidR }));
  else {
    const fL = ribbon(tr, (i) => wallAt(i, 1) + 0.3, (i) => wallAt(i, 1) + 0.3, 1.2, { yB: 4.2, mask: solidL, uvFn: (i) => tr.s[i] / 3 }), fR = ribbon(tr, (i) => -wallAt(i, -1) - 0.3, (i) => -wallAt(i, -1) - 0.3, 1.2, { yB: 4.2, mask: solidR, uvFn: (i) => tr.s[i] / 3 });
    group.add(spatialChunks([fL, fR], fenceMat, 'fences'));
  }
  const railMat = new THREE.MeshBasicMaterial({ color: 0x2255ff });
  const rL = ribbon(tr, (i) => wallAt(i, 1) + 0.2, (i) => wallAt(i, 1) + 0.4, 1.22, { mask: (i) => !circuit && !tr.inCornerZone(i) && open(i, 1) }), rR = ribbon(tr, (i) => -wallAt(i, -1) - 0.4, (i) => -wallAt(i, -1) - 0.2, 1.22, { mask: (i) => !circuit && !tr.inCornerZone(i) && open(i, -1) });
  group.add(spatialChunks([rL, rR], railMat, 'rails'));
  let armcoMat = null;
  if (circuit) {
    armcoMat = giveMaterial(new THREE.MeshStandardMaterial({ map: armcoTexture(), roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide }));
    const arm = [1, -1].map((side) => ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 0.85, mask: segT(side, (st) => st === BAR.ARMCO), uvFn: (i) => tr.s[i] / 4 })).filter((g) => g.index.count);
    group.add(spatialChunks(arm, armcoMat, 'armco'));
    // the tyre wall under its banners: a dark band of stacked tyres along the bottom, a touch in front of the cover
    const tyreMat = giveMaterial(new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.9, side: THREE.DoubleSide }));
    const tyres = [1, -1].map((side) => ribbon(tr, (i) => side * (wallAt(i, side) - 0.05), (i) => side * (wallAt(i, side) - 0.05), 0, { yB: 0.35, mask: segT(side, (st) => st === BAR.TYRES) })).filter((g) => g.index.count);
    group.add(spatialChunks(tyres, tyreMat, 'tyreWall'));
    // painted green strip behind the kerbs (as at the real circuit: the "astroturf" paint on corner exits)
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2f8f3a, roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const gm = (side) => (i) => kerbMask(i) && kerbMask((i + 1) % tr.n) && surfAt(i, side) !== 1 && !(pit && side === pitSide && pit.laneCovers[i]);
    const green = [ribbon(tr, (i) => HL[i] + kw, (i) => HL[i] + kw + GREEN_W, 0.006, { mask: gm(1) }), ribbon(tr, (i) => -HR[i] - kw - GREEN_W, (i) => -HR[i] - kw, 0.006, { mask: gm(-1) })].filter((g) => g.index.count);
    group.add(spatialChunks(green, greenMat, 'green'));
  }

  // --- start/finish line
  const sfGeo = new THREE.PlaneGeometry(tr.def.width, 1.6); sfGeo.rotateX(-Math.PI / 2);
  const sf = new THREE.Mesh(sfGeo, new THREE.MeshBasicMaterial({ map: checkerTexture(8), polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
  const f0 = tr.sample(0); sf.position.set(f0.x, 0.015, f0.z); sf.rotation.y = Math.atan2(f0.tx, f0.tz); group.add(sf);

  // --- grid boxes
  const boxGeos = [];
  for (const slot of gridSlots) {
    const f = tr.sample(slot.s, slot.d);
    const ang = Math.atan2(f.tx, f.tz);
    const mk = (w, l, ox, oz) => { const g = new THREE.PlaneGeometry(w, l); g.rotateX(-Math.PI / 2); g.translate(ox, 0, oz); g.rotateY(ang); g.translate(f.x, 0.013, f.z); return g; };
    boxGeos.push(mk(2.6, 0.15, 0, 2.6), mk(0.12, 3.0, -1.3, 1.1), mk(0.12, 3.0, 1.3, 1.1));
  }
  if (boxGeos.length) group.add(new THREE.Mesh(mergeGeometries(boxGeos), lineMat));

  // --- "LAS VEGAS" painted on the run-off strip on the outside of the big braking zones (never on the road);
  //     each side gets the texture variant that reads left-to-right from outside the barrier
  const runoffText = tr.def.runoffText || 'LAS VEGAS';
  const vegasTex = { 1: runoffTextTexture(runoffText, false), '-1': runoffTextTexture(runoffText, true) };
  const decals = { 1: [], '-1': [] };   // one material per reading direction, every decal of a direction in one mesh
  const runoffDecal = (s0, side, repeats = 2) => {
    const len = RUNOFF_DECAL_LEN;
    for (let r = 0; r < repeats; r++) {
      const a = tr.wrapS(s0 + r * (len + 6)), b = tr.wrapS(a + len);
      const inner = (i) => EG(i, side) + kw + 0.15, outer = (i) => EG(i, side) + kw + 3.0 - 0.15;
      const ok = (i) => inRangeS(tr.s[i], a, b) && runEdge(i, side) >= outer(i) + (circuit ? APRON_EDGE : 0) && (circuit ? open(i, side) && surfAt(i, side) === 1 : runMask(side)(i));
      const g = ribbon(tr, (i) => side * inner(i), (i) => side * outer(i), 0.012, { mask: (i) => ok(i) && ok((i + 1) % tr.n), uvFn: (i) => tr.wrapS(tr.s[i] - a) / len });
      if (g.index.count) decals[side].push(g);
    }
  };
  const zoneFor = (turn) => tr.cornerZones.find((c) => c.turn === turn || (c.turns || []).includes(turn));
  for (const t of (tr.def.runoffDecalTurns || [1, 5, 12, 14])) { const z = zoneFor(t); if (z) runoffDecal(z.sA - 75, -(z.dir || 1)); }   // outside of the corner = opposite its turning side
  for (const side of [1, -1]) {
    if (!decals[side].length) continue;
    group.add(new THREE.Mesh(mergeGeometries(decals[side]), new THREE.MeshBasicMaterial({ map: vegasTex[side], transparent: true, opacity: 0.95, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })));
  }

  // --- pit lane: the lane's own asphalt only once it has left the road, its track-side edge clipped to the kerb
  //     until the pit wall can start (no wall ever pokes onto the circuit), branded boxes are built in PitLane.js
  if (pit) {
    const pl = pit.samples, ws = pit.trackSide, gs = -ws, wallOff = pit.wallOff;
    // the lane's asphalt exists wherever the strip between the road edge and the lane's outer edge has width: it
    // tapers to a point against the kerb at both ends (smooth merge, no overlap with the road)
    const own = (i) => pit.laneEdge[i] > -pit.halfWidth + 0.6;
    const pitRoadMat = roadMat.clone();
    // (a ribbon is built from its right edge to its left: with the track on the lane's left the two edges swap, or
    //  the strip faces down and is culled - Silverstone's pit lane was grass)
    const gEdge = (i) => Math.max(pit.halfWidth, (pit.garageW?.[i] ?? pit.halfWidth + 0.7) - 0.7);   // (the escape's asphalt past the lane edge)
    const roadA = (i) => Math.min(ws * pit.laneEdge[i], gs * gEdge(i)), roadB = (i) => Math.max(ws * pit.laneEdge[i], gs * gEdge(i));
    const pitRoad = new THREE.Mesh(ribbon(pl, roadA, roadB, 0, { closed: false, colorFn: () => [0.85, 0.85, 0.9], uvV: 10, mask: own }), pitRoadMat);
    group.add(pitRoad); group.userData.pitRoadMat = pitRoadMat; pitRoad.userData.keep = true;
    // yellow edge lines: the track-side one follows the clipped edge (it is the pit entry / exit line where the lane meets the kerb)
    // (def.pitLine: a circuit's own colour and width for them - Las Vegas paints the pit entry and exit lines T-Mobile
    //  magenta, wide)
    const PL = tr.def.pitLine || {}, plw = PL.width ?? 0.2;
    const pe1 = ribbon(pl, (i) => ws * (pit.laneEdge[i] - plw), (i) => ws * pit.laneEdge[i], 0.01, { closed: false, mask: (i) => own(i) && pit.laneEdge[i] > -pit.halfWidth + 1.0 });
    const pe2 = ribbon(pl, () => gs * pit.halfWidth, () => gs * (pit.halfWidth - 0.2), 0.01, { closed: false, mask: own });
    const yellow = new THREE.MeshBasicMaterial({ color: PL.color ?? 0xffd23a, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    group.add(new THREE.Mesh(mergeGeometries([pe1, pe2]), yellow));
    // fast-lane / working-lane dashed separator
    const sep = ribbon(pl, () => gs * (pit.halfWidth - 3.6), () => gs * (pit.halfWidth - 3.45), 0.01, { closed: false, mask: (i) => own(i) && (i % 4) < 2 && isFinite(pit.wallIn[i]) });
    group.add(new THREE.Mesh(sep, lineMat));
    // concrete apron between the lane edge and the pit wall (only where the wall exists)
    const hasWall = (i) => own(i) && isFinite(pit.wallIn[i]);
    const wIn = (i) => (isFinite(pit.wallIn[i]) ? pit.wallIn[i] : Math.max(0.6, pit.wallPos[i]));   // finite everywhere (vertex at the wall's end sample)
    // (the run-off material is vertex-coloured: the apron gets the plain concrete tint, or it renders black)
    const apron = ribbon(pl, (i) => Math.min(ws * pit.laneEdge[i], ws * (wIn(i) + 0.6)), (i) => Math.max(ws * pit.laneEdge[i], ws * (wIn(i) + 0.6)), 0, { closed: false, mask: hasWall, uvV: 6, colorFn: () => CONCRETE });
    group.add(new THREE.Mesh(apron, runMat)).children.at(-1).userData.keep = true;
    // the pit lane's own track-side wall, only where the lane runs too far from the road for the circuit barrier to double as pit wall
    const farWall = (i) => hasWall(i) && pit.trackD[i] - pit.wallIn[i] > tr.minWall + 0.5;
    const pw = ribbon(pl, (i) => ws * wIn(i), (i) => ws * wIn(i), 0, { closed: false, yB: 1.1, mask: farWall });
    const pwCap = ribbon(pl, (i) => ws * (wIn(i) - 0.3), (i) => ws * (wIn(i) + 0.3), 1.1, { closed: false, mask: farWall });
    // pit-lane outer wall (garage side)
    const outer = ribbon(pl, (i) => gs * (gEdge(i) + 1.0), (i) => gs * (gEdge(i) + 1.0), 0, { closed: false, yB: 1.0, mask: (i) => own(i) && i > 8 && i < pl.n - 10 && !pit.escape?.[i] });
    // (the escape's edge: a tyre wall, red and white, in place of the concrete)
    const esc = ribbon(pl, (i) => gs * (gEdge(i) + 0.4), (i) => gs * (gEdge(i) + 1.6), 0.95, { closed: false, mask: (i) => !!pit.escape?.[i], colorFn: (i) => ((i >> 1) % 2 ? [0.85, 0.1, 0.1] : [0.92, 0.92, 0.92]) });
    const escF = ribbon(pl, (i) => gs * (gEdge(i) + 0.4), (i) => gs * (gEdge(i) + 0.4), 0, { closed: false, yB: 0.95, mask: (i) => !!pit.escape?.[i], colorFn: (i) => ((i >> 1) % 2 ? [0.85, 0.1, 0.1] : [0.92, 0.92, 0.92]) });
    if (esc.index.count) group.add(new THREE.Mesh(mergeGeometries([esc, escF]), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, side: THREE.DoubleSide })));
    const pitWalls = [pw, pwCap, outer].filter((g) => g.index.count);
    if (pitWalls.length) group.add(new THREE.Mesh(mergeGeometries(pitWalls), wallMat));
    // striped "nose" where the pit wall begins / ends: a painted wedge that tapers into the wall base (as at the real pit exit)
    const noseMat = new THREE.MeshBasicMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
    const noses = [];
    const nose = (i0, i1, grow) => {   // taper from 0 at i0 to full at i1 (grow=1) or the reverse, along the wall's base line (the road-edge line before the wall exists)
      const len = Math.max(1, i1 - i0); const wp = (i) => pit.wallPos[i];
      const t = (i) => Math.max(0, Math.min(1, (i - i0) / len)); const w = (i) => 1.3 * (grow ? t(i) : 1 - t(i));
      // sits on the run-off just outside the road edge / kerb (never over the kerb: that z-fought)
      const g = ribbon(pl, (i) => ws * (wp(i) - w(i) - 0.15), (i) => ws * (wp(i) + 0.25), 0.012, { closed: false, mask: (i) => i >= i0 && i < i1 && !pit.overlapsTrack[i], colorFn: (i) => ((i >> 1) % 2 ? [0.9, 0.12, 0.12] : [0.95, 0.95, 0.95]) });
      if (g.index.count) noses.push(g);
    };
    if (pit.wallStartI >= 0) { nose(pit.wallStartI - (pit.infield ? 0 : 9), pit.wallStartI, true); nose(pit.wallEndI, pit.wallEndI + 9, false); }
    if (noses.length) group.add(new THREE.Mesh(mergeGeometries(noses), noseMat));
    if (pit.infield) group.add(buildInfield(tr, pit, roadMat, kw, pitSide));
    // speed-limit line across the lane at both ends of the limiter zone
    const limitGeos = [];
    for (const i of [Math.round(pit.limitFrom / pl.ds), Math.round(pit.limitTo / pl.ds)].map((i) => Math.max(0, Math.min(pl.n - 1, i)))) {
      if (i < 0 || i >= pl.n) continue;
      const ang = Math.atan2(pl.tx[i], pl.tz[i]);
      const g = new THREE.PlaneGeometry(pit.halfWidth * 2 - 0.4, 0.5); g.rotateX(-Math.PI / 2); g.rotateY(ang); g.translate(pl.px[i], 0.012, pl.pz[i]); limitGeos.push(g);
    }
    if (limitGeos.length) group.add(new THREE.Mesh(mergeGeometries(limitGeos), lineMat));
  }

  // --- floodlight masts along the barriers (the emissive heads; the nearest ones carry real SpotLights, see Lighting.js).
  //     On the pit side of the pit straight they stand behind the garages, never in the pit lane.
  const mastGeo = new THREE.CylinderGeometry(0.25, 0.35, 18, 6); const headGeo = new THREE.BoxGeometry(2.4, 0.5, 0.8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x777c88, roughness: 0.6 });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
  const masts = [], heads = [], mastList = [];   // instance transforms: every mast is one instance, every head another
  const inPitRange = (i) => pit && inRangeS(tr.s[i], tr.wrapS(pit.entryS - 30), tr.wrapS(pit.exitS + 30));
  const addMast = (x, z, ang, ax, az, tx, tz) => {   // ax/az: head offset toward the lit area; tx/tz: aim point on the ground
    masts.push(new THREE.Matrix4().makeTranslation(x, 9, z));
    heads.push(new THREE.Matrix4().makeRotationY(ang).setPosition(x + ax, 18, z + az));
    mastList.push({ x: x + ax, y: 17.6, z: z + az, tx, tz });
  };
  for (let s = 0; s < tr.length; s += 60) {
    for (const side of [1, -1]) {
      const i = tr.idxAtS(s); if (!open(i, side)) continue;
      if (pit && side === pitSide && inPitRange(i)) continue;
      const w = wallAt(i, side); const f = tr.sample(s, side * (w + 3.5)); const c = tr.sample(s, 0);
      addMast(f.x, f.z, Math.atan2(f.tx, f.tz), -f.nx * side * 1.2, -f.nz * side * 1.2, c.x, c.z);
    }
  }
  if (pit) {   // behind the garages, lighting the lane and the pit straight from the far side
    const pl = pit.samples, gs = -pit.trackSide; const off = pit.halfWidth + 9.0;
    for (let i = Math.max(4, pit.wallStartI); i <= pit.wallEndI && i < pl.n; i += Math.round(70 / pl.ds)) {
      addMast(pl.px[i] + pl.nx[i] * gs * off, pl.pz[i] + pl.nz[i] * gs * off, Math.atan2(pl.tx[i], pl.tz[i]), -pl.nx[i] * gs * 1.2, -pl.nz[i] * gs * 1.2, pl.px[i], pl.pz[i]);
    }
  }
  // two instanced meshes for every floodlight on the circuit: two draw calls (a few thousand vertices: no culling needed)
  const inst = (geo, mat, list, name) => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length)); m.count = list.length; list.forEach((x, k) => m.setMatrixAt(k, x)); m.frustumCulled = false; m.name = name; return m; };
  const mastGrp = inst(mastGeo, mastMat, masts, 'masts'), headGrp = inst(headGeo, headMat, heads, 'heads');
  group.add(mastGrp, headGrp);
  group.userData.masts = mastList;

  // day / night surface sets
  const asphaltDay = asphaltTexture(true); asphaltDay.repeat.set(2, 1);
  const grainDay = paintTexture(true);
  group.userData.setTime = (mode) => {
    const day = mode === 'day';
    roadMat.map = day ? asphaltDay : asphalt; roadMat.emissiveIntensity = day ? 0 : 0.6; roadMat.needsUpdate = true;
    group.getObjectByName('pit-infield')?.userData.setTime?.(day);
    for (const m of runMats) { m.map = day ? grainDay : grain; m.emissiveIntensity = day ? 0 : 1; m.needsUpdate = true; }
    kerbMat.emissiveIntensity = day ? 0 : 0.18;
    panelMat.emissiveIntensity = day ? 0 : 0.55;
    wallMat.emissiveIntensity = day ? 0 : 1;
    railMat.color.set(day ? 0x3a4fb8 : 0x2255ff);
    headMat.color.set(day ? 0x9a9a9a : 0xfff6d8);
    mastGrp.visible = headGrp.visible = !(circuit && day);   // a permanent circuit has no floodlights: the masts only come out for a night race
  };

  // the small single meshes (grid boxes, start line, decals, pit-lane paint and walls) are details too
  for (const ch of group.children) if (ch.isMesh && !ch.isInstancedMesh && !ch.userData.keep) { ch.geometry.computeBoundingSphere(); ch.userData.cut = DETAIL_CUT.pitDetail; }
  return group;
}

/** Signed distance from the racing corridor (track barriers + pit lane, its escape and a paved infield): negative = inside the corridor by that much. */
export function corridorSigned(track, pit, x, z, margin = 1.5) {
  const q = track.nearest(x, z);
  let c = Math.abs(q.d) - (track.wallAt(q.i, q.d > 0 ? 1 : -1) + margin);
  if (pit?.infield?.inside(x, z)) return Math.min(c, -margin);
  if (pit) {
    const ps = pit.samples; let bd = Infinity, bi = 0;
    for (let i = 0; i < ps.n; i += 2) { const dd = (ps.px[i] - x) ** 2 + (ps.pz[i] - z) ** 2; if (dd < bd) { bd = dd; bi = i; } }
    const dx = x - ps.px[bi], dz = z - ps.pz[bi];
    const along = dx * ps.tx[bi] + dz * ps.tz[bi], lat = dx * ps.nx[bi] + dz * ps.nz[bi];
    const inEnds = (bi <= 1 && along < -margin) || (bi >= ps.n - 2 && along > margin);
    if (!inEnds) c = Math.min(c, Math.abs(lat) - (Math.max(pit.halfWidth, (pit.garageW?.[bi] ?? 0) - 0.7) + 3 + margin));   // (the escape road's width too)
  }
  return c;
}

/** Grid slot layout: F1 staggered 8 m spacing, pole on the inside of Turn 1. */
export function gridLayout(track, count, poleSide = 1) {
  const slots = [];
  for (let k = 0; k < count; k++) {
    slots.push({ s: track.wrapS(-(14 + 8 * k)), d: (k % 2 === 0 ? poleSide : -poleSide) * 3.4, n: k + 1 });
  }
  return slots;
}

/** Build the pit lane from a raw polyline; entry/exit are matched to the nearest track s. */
export function buildPitLane(track, rawPts, boxCount = 12) {
  const curve = buildSpline(rawPts, { closed: false, filletSigma: 10, step: 3 });
  const samples = sampleCurve(curve, false, 2);
  const first = track.nearest(samples.px[0], samples.pz[0]);
  const last = track.nearest(samples.px[samples.n - 1], samples.pz[samples.n - 1]);
  // which side of the pit lane is the track on? (sign of lateral offset of the track centre at mid pit)
  const mid = Math.floor(samples.n / 2);
  const tm = track.nearest(samples.px[mid], samples.pz[mid]);
  const tc = track.sample(tm.s);
  const trackSide = Math.sign((tc.x - samples.px[mid]) * samples.nx[mid] + (tc.z - samples.pz[mid]) * samples.nz[mid]) || 1;
  const halfWidth = 5.5, wallOff = halfWidth + 1.0;
  const kwT = track.kerbWidth;
  // per pit sample: distance of the road centre, whether the sample still lies on the road (entry/exit blend),
  // how far the lane's own asphalt may reach toward the road (clipped at the kerb) and whether the pit wall exists yet
  const n = samples.n;
  const overlapsTrack = new Uint8Array(n), trackD = new Float32Array(n), laneEdge = new Float32Array(n), wallIn = new Float32Array(n), trackI = new Int32Array(n), wallPos = new Float32Array(n), laneSide = new Int8Array(n);
  for (let i = 0; i < n; i++) {
    const q = track.nearest(samples.px[i], samples.pz[i]); const D = Math.abs(q.d), hwT = track.edgeAt(q.i, q.d > 0 ? 1 : -1);
    trackD[i] = D; trackI[i] = q.i; laneSide[i] = q.d > 0 ? 1 : -1;
    overlapsTrack[i] = D < hwT + 0.5 ? 1 : 0;
    // the pit wall stands wallOff from the lane centre, but never closer to the road than 0.6 m off its edge
    // (or 0.4 m past the kerb in a corner zone): where the OSM lane hugs the circuit the wall simply sits at the road edge
    const edge = hwT + (track.inCornerZone(q.i) ? kwT + 0.4 : 0.6);
    wallPos[i] = Math.min(wallOff, D - edge);
    // a wall only once the lane is at least ~8.5 m wide - and (def.pitWallClear) only where it stands that far from the
    // centreline: Montreal's pit entry leaves from a corner's turn-in, where the strip beside the kerb is paint and bollards
    wallIn[i] = wallPos[i] >= 3.0 && !overlapsTrack[i] && D - wallPos[i] >= (track.def.pitWallClear || 0) ? wallPos[i] : Infinity;
  }
  let divergeI = 0; while (divergeI < n - 1 && overlapsTrack[divergeI]) divergeI++;
  let mergeI = n - 1; while (mergeI > 0 && overlapsTrack[mergeI]) mergeI--;
  // def.pitEscape.infield (m): where the circuit bends away from a straight entry road and comes back to it (Montreal's
  // last chicane), the whole of the ground between them is one paved run-off - no pit wall down the lane's track side
  // until the lane is back within `infield` m of the centreline, where the wall's nose stands (wallStartI, below).
  // (infieldEnd: that lane sample; the lane's farthest point from the road is looked for within 250 m of its branching)
  const PEI = track.def.pitEscape?.infield;
  let infieldEnd = -1;
  if (PEI && divergeI < n - 1) {
    let far = divergeI; for (let i = divergeI; i < n && samples.s[i] < samples.s[divergeI] + 250; i++) if (trackD[i] > trackD[far]) far = i;
    if (trackD[far] > PEI + 4) {
      let e = far; while (e < n - 1 && trackD[e] > PEI) e++;
      infieldEnd = e;
    }
  }
  let wallStartI = -1, wallEndI = -1;
  for (let i = 0; i < n; i++) if (isFinite(wallIn[i])) { if (wallStartI < 0) wallStartI = i; wallEndI = i; }
  // (and its nose no sooner than where the lane has opened out to its full width beside it - up to 5 m between the lane's
  //  centre and the wall: a car still cutting across into the lane, or back out of it, has the room. Started the moment
  //  there were 3 m, it stood in the path of every car entering Austin's lane on the inside of Turn 20, whose road is
  //  widened on the other side only)
  if (wallStartI >= 0) {
    const run = Array.from(wallPos.subarray(wallStartI, wallEndI + 1)).sort((a, b) => a - b), full = Math.min(5, 0.9 * run[run.length >> 1]);   // (its usual width along the garages)
    while (wallStartI < wallEndI && wallPos[wallStartI] < full) wallStartI++;
    while (wallEndI > wallStartI && wallPos[wallEndI] < full) wallEndI--;
  }
  // (a paved infield: the wall's nose where the lane is back beside the road, not before. Its line is still the one
  //  continuous wall below - along the pit straight a lane that hugs the road has no wall of its own, wallIn's test,
  //  only the one carried on from here)
  const wallStart0 = wallStartI;   // (where it would start without the infield: the boxes are spaced about the middle of that)
  if (infieldEnd >= 0 && wallStartI >= 0 && wallStartI < infieldEnd) wallStartI = Math.min(infieldEnd, wallEndI);
  for (let i = 0; i < n; i++) wallIn[i] = i >= wallStartI && i <= wallEndI && wallStartI >= 0 ? Math.max(0.6, wallPos[i]) : Infinity;   // one continuous wall, no islands
  // how far the lane's own asphalt reaches toward the road: to the wall base where the wall exists, else exactly to the
  // road's kerb / edge line (negative = that line lies on the garage side of the lane centre: the lane is merging and its
  // asphalt tapers to a point against the road edge - no overlap, no z-fighting)
  for (let i = 0; i < n; i++) {
    const edgeIn = track.edgeAt(trackI[i], laneSide[i]) + (track.inCornerZone(trackI[i]) ? kwT : 0);
    laneEdge[i] = isFinite(wallIn[i]) ? Math.min(halfWidth + 0.7, wallIn[i] - 0.3) : Math.min(halfWidth + 0.7, trackD[i] - edgeIn);
  }
  // track samples covered by the lane's asphalt (the run-off strip is not drawn there)
  const laneCovers = new Uint8Array(track.n);
  for (let i = 0; i < n; i++) if (laneEdge[i] > -halfWidth + 0.6) { const ti = trackI[i]; laneCovers[ti] = 1; laneCovers[(ti + 1) % track.n] = 1; laneCovers[(ti - 1 + track.n) % track.n] = 1; }
  const sideSign = Math.sign(tm.d) || -1;                     // side of the track the pit lane lies on (left +)
  // per TRACK sample on the pit side: where the barrier stands (it doubles as pit wall while the lane runs alongside)
  // or NaN where it is open because the lane is branching off / rejoining. No corner run-off widening on this
  // side while the lane runs alongside: the pit complex is there.
  const entryI = track.idxAtS(first.s - 6), exitI = track.idxAtS(last.s + 6);
  const sideArr = sideSign > 0 ? track.wallL : track.wallR;
  const sideBar = sideSign > 0 ? track.barL : track.barR;
  const run = track.def.pitWallRun ?? 120; track.pitWall = new Uint8Array(track.n); for (let k = track.idxAtS(first.s - run); ; k = (k + 1) % track.n) { sideArr[k] = Math.min(sideArr[k], track.minWallAt(k, sideSign)); sideBar[k] = BAR.WALL; track.pitWall[k] = 1; if (k === track.idxAtS(last.s + run)) break; }   // the pit wall
  track.pitCovers = laneCovers; track.pitSide = sideSign;   // the lane's asphalt beside the road is not grass (Track.surface)
  const wallD = new Float32Array(track.n); for (let i = 0; i < track.n; i++) wallD[i] = sideArr[i];
  const set = new Uint8Array(track.n);
  for (let k = entryI; ; k = (k + 1) % track.n) { wallD[k] = NaN; if (k === exitI) break; }
  for (let i = 0; i < n; i++) {
    if (overlapsTrack[i]) continue;
    // (with def.pitWallClear, never on the road or its kerb: where the circuit bends away from a straight lane -
    //  Montreal's last chicane - a lane sample's nearest point of the circuit can be one the wall is not beside)
    const ti = trackI[i]; const v = isFinite(wallIn[i]) ? Math.max(track.def.pitWallClear ? track.edgeAt(ti, sideSign) + kwT + 0.5 : 0, Math.min(track.minWallAt(ti, sideSign), trackD[i] - wallIn[i])) : NaN;
    wallD[ti] = v; set[ti] = 1;
  }
  let prev = NaN;
  for (let k = entryI; ; k = (k + 1) % track.n) { if (set[k]) prev = wallD[k]; else wallD[k] = prev; if (k === exitI) break; }
  const gapEntry = [track.wrapS(first.s - 10), track.wrapS(first.s + samples.s[divergeI] + 40)];
  const gapExit = [track.wrapS(last.s - (samples.length - samples.s[mergeI]) - 60), track.wrapS(last.s + 10)];
  const isGapS = (s) => inRangeS(s, gapEntry[0], gapEntry[1]) || inRangeS(s, gapExit[0], gapExit[1]);
  // boxes: one garage per team, adjacent (16 m pitch) and centred on the walled part of the lane, like a real pit building
  const boxes = []; const pitch = Math.round(16 / samples.ds);
  const midI = wallStart0 >= 0 ? (wallStart0 + wallEndI) / 2 : n / 2;   // (an infield's later nose does not move the garages)
  for (let k = 0; k < boxCount; k++) boxes.push({ i: Math.round(midI + (k - (boxCount - 1) / 2) * pitch), k, team: null });
  // the speed-limit zone: from the pit-entry speed line to the pit-exit line. Real circuits have them bracketing the
  // garages, with the entry and exit roads (driven at speed) outside: track.def.pitLimit = { before, after } metres
  // before the first box / after the last; without it the whole lane is limited.
  const lim = track.def.pitLimit, bU0 = samples.s[boxes[0].i], bU1 = samples.s[boxes[boxes.length - 1].i];
  const limitFrom = lim ? Math.max(samples.s[divergeI] - 4, bU0 - lim.before) : samples.s[divergeI] - 4;
  const limitTo = lim ? Math.min(samples.s[mergeI] + 4, bU1 + lim.after) : samples.s[mergeI] + 4;
  // the garage-side boundary from the lane's centre: 0.7 m past its edge - and, where the circuit's straight-on escape
  // IS the pit entry road (def.pitEscape: { width, from, before } - Montreal's last chicane, missed at 300 km/h, ran into
  // the lane and its garage wall), a wide paved area from `from` m past the lane's branching to `before` m short of the
  // speed line, a tyre wall at its edge (escape: 1 where it is)
  const garageW = new Float32Array(n).fill(halfWidth + 0.7), escape = new Uint8Array(n), PE = track.def.pitEscape;
  if (PE) {
    // (opened over 50 m, closed over 80: the tyre wall comes back in at under 20 degrees - a car run down the escape
    //  flat out glances off it, where the old 50 m, 30 degrees at its steepest, met it nearly head on)
    const u0 = samples.s[divergeI] + (PE.from ?? 6), u1 = limitFrom - (PE.before ?? 25), E = 50, E1 = PE.close ?? 50;
    for (let i = 0; i < n; i++) {
      const u = samples.s[i], t = u < u0 ? (u - (u0 - E)) / E : u > u1 ? ((u1 + E1) - u) / E1 : 1, w = Math.max(0, Math.min(1, t));
      if (w > 0) { garageW[i] = halfWidth + 0.7 + (PE.width - halfWidth - 0.7) * w * w * (3 - 2 * w); escape[i] = 1; }
    }
  }
  // the paved infield (def.pitEscape.infield, above): the ground between the circuit's edge and the lane's track-side
  // edge, from where the lane has opened out beside the road to the pit wall's nose, as one ring (infield.poly); on the
  // circuit's side of it no wall: the barrier's line moves out past the lane to its escape's tyre wall (so nothing is set
  // down out there, and a car is held in wherever the physics has it), and the ground is paved (Track.surface: pitInfield)
  let infield = null;
  if (infieldEnd >= 0) {
    const iB = wallStartI >= infieldEnd ? wallStartI : infieldEnd;
    let iA = divergeI; while (iA < iB && laneEdge[iA] < halfWidth + 0.69) iA++;
    const edgeOf = (k) => track.edgeAt(k, sideSign) + (track.inCorner[k] ? kwT : 0);
    const kD = trackI[divergeI], kA = trackI[iA], kB = trackI[iB], N = track.n, span = (a, b) => (b - a + N) % N;
    const poly = [];
    for (let m = 0, k = kA; m <= span(kA, kB); m++, k = (k + 1) % N) { const dd = sideSign * edgeOf(k); poly.push([track.px[k] + track.nx[k] * dd, track.pz[k] + track.nz[k] * dd]); }
    for (let i = iB; i >= iA; i--) { const dd = trackSide * laneEdge[i]; poly.push([samples.px[i] + samples.nx[i] * dd, samples.pz[i] + samples.nz[i] * dd]); }
    const inPoly = insideRings([poly]);
    // (on the lane or its escape: between its track-side edge and the escape's tyre wall)
    const onLane = (x, z) => {
      let bi = 0, bd = Infinity; for (let i = 0; i < n; i++) { const q = (samples.px[i] - x) ** 2 + (samples.pz[i] - z) ** 2; if (q < bd) { bd = q; bi = i; } }
      if (bi === 0 || bi === n - 1) return false;
      const g = -trackSide * ((x - samples.px[bi]) * samples.nx[bi] + (z - samples.pz[bi]) * samples.nz[bi]);
      return g > -laneEdge[bi] - 0.5 && g < garageW[bi] + 1.6;
    };
    track.pitInfield = new Uint8Array(N); track.pitInfieldWall = new Float32Array(N);
    let prevFar = 40;
    for (let m = 0, k = kD; m < span(kD, kB); m++, k = (k + 1) % N) {
      track.pitInfield[k] = 1; if (track.pitWall) track.pitWall[k] = 0;
      // the barrier's line: out across the infield, the lane and its escape - the escape's own tyre wall, seen from the
      // circuit (a car the physics has on the circuit's side of the lane meets it there too, never the open park; nothing
      // is drawn for it here: buildTrackMeshes / buildCatchFences leave the infield's samples alone, the lane draws the wall)
      let d = edgeOf(k) + 0.3, was = false;
      for (; d < 120; d += 1) { const x = track.px[k] + track.nx[k] * sideSign * d, z = track.pz[k] + track.nz[k] * sideSign * d; const on = inPoly(x, z) || onLane(x, z); if (on) was = true; else if (was) break; }
      const far = was ? Math.max(sideArr[k], d - 0.4) : prevFar; prevFar = far;
      sideArr[k] = far; track.pitInfieldWall[k] = far; wallD[k] = far; sideBar[k] = BAR.TYRES;
    }
    infield = { poly, inside: inPoly, iA, iB, kA: kD, kB };
  }
  // (where the circuit's own wall is open for the lane - the way in, the way out - what stands on that side is the
  //  LANE's outer wall: outerD, per sample of the circuit, how far out it is. A car not in the lane that goes through
  //  the opening - missing the last chicane into the escape road, arriving too fast at the way out - used to meet
  //  nothing there, run on, and be beyond the circuit's wall where it started again: vehicle/Car.js _barriers.)
  const outerD = new Float32Array(track.n).fill(NaN);
  for (let i = 0; i < n; i++) { const ti = trackI[i], v = trackD[i] + garageW[i] + (escape[i] ? 1.5 : 0); if (!(outerD[ti] >= v)) outerD[ti] = v; }
  { let prev = NaN; for (let k = entryI, guard = 0; guard < track.n; k = (k + 1) % track.n, guard++) { if (isNaN(outerD[k])) outerD[k] = prev; else prev = outerD[k]; if (k === exitI) break; } }
  // (never nearer the road than the circuit's own wall would stand there: where the lane runs on the road itself - its
  //  merge - the lane's "outer wall" is a line a couple of metres off the kerb, and nothing stands on it)
  for (let k = 0; k < track.n; k++) if (outerD[k] < sideArr[k]) outerD[k] = sideArr[k];
  const pit = {
    limitFrom, limitTo, garageW, escape, infield, outerD,
    samples, curve, halfWidth, wallOff, entryS: first.s, exitS: last.s, trackSide, sideSign, boxes, boxPitch: pitch * samples.ds, length: samples.length, limiter: 80 / 3.6,
    overlapsTrack, trackD, trackI, laneEdge, laneCovers, wallIn, wallPos, wallStartI, wallEndI, wallD, divergeU: samples.s[divergeI], mergeU: samples.s[mergeI], gapEntry, gapExit, isGapS,
    /** nearest pit-lane sample -> { i, u (distance along), lat (left +), along } */
    nearest(x, z, out = {}) {
      let bi = 0, bd = Infinity;
      for (let i = 0; i < samples.n; i++) { const d = (samples.px[i] - x) ** 2 + (samples.pz[i] - z) ** 2; if (d < bd) { bd = d; bi = i; } }
      const dx = x - samples.px[bi], dz = z - samples.pz[bi];
      out.i = bi; out.along = dx * samples.tx[bi] + dz * samples.tz[bi]; out.u = samples.s[bi] + out.along; out.lat = dx * samples.nx[bi] + dz * samples.nz[bi]; out.dist = Math.sqrt(bd);
      return out;
    },
    /** the garage box a car uses (world position + heading) */
    boxFor(idx) { const b = boxes[Math.abs(idx) % boxes.length]; const i = b.i; const gs = -trackSide; const off = gs * (halfWidth - 2.2); return { i, k: b.k, u: samples.s[i], x: samples.px[i] + samples.nx[i] * off, z: samples.pz[i] + samples.nz[i] * off, lat: off, th: Math.atan2(samples.tz[i], samples.tx[i]) }; },
  };
  return pit;
}

