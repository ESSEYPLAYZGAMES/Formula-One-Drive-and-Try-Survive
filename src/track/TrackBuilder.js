// Centerline -> spline -> uniform arc-length samples with frames/curvature,
// spatial hash for nearest-point queries, and the road/kerb/run-off/barrier meshes.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
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
        if (cap[i] === 2) { raw[i] = BAR.ARMCO; continue; }
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
   * What a car at lateral offset d of sample i is driving on (SURFACE codes of Car.js): 0 road, 1 kerb, 2 paved
   * run-off, 3 grass, 4 gravel. A street circuit is paved to the wall. On a permanent circuit the kerbs exist in the
   * corners only, a gravel trap starts 2 m of grass beyond the kerb line and ends short of the barrier, an asphalt
   * run-off starts at the kerb, and everything else is grass.
   */
  surface(i, d) {
    const ad = Math.abs(d), hw = this.halfWidth;
    if (ad <= hw) return 0;
    if (!this.circuit) return ad <= hw + this.kerbWidth ? 1 : 2;
    if (this.pitCovers && this.pitCovers[i] && d * this.pitSide > 0) return 2;
    const t = d > 0 ? this.surfL[i] : this.surfR[i], wall = d > 0 ? this.wallL[i] : this.wallR[i];
    if (ad <= hw + this.kerbWidth) return this.inCorner[i] ? 1 : t === 1 ? 2 : 3;
    if (this.inCorner[i] && ad <= hw + this.kerbWidth + GREEN_W) return 2;   // the painted green strip behind the kerb
    if (t === 1) return ad < wall - APRON_EDGE ? 2 : 3;
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
      this.surfL[i] = this.standL?.[i] && this.wallL[i] > this.minWall + 3 ? front(this.apronL, this.standL, i) : this.apronL[i] >= 0 && this.wallL[i] > this.minWall + 6 ? kind[this.apronL[i]] : 0;
      this.surfR[i] = this.standR?.[i] && this.wallR[i] > this.minWall + 3 ? front(this.apronR, this.standR, i) : this.apronR[i] >= 0 && this.wallR[i] > this.minWall + 6 ? kind[this.apronR[i]] : 0;
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
    const lo = this.minWall;
    for (const [arr, side, cap] of [[this.wallL, 1, this.capL], [this.wallR, -1, this.capR]]) {
      const before = Float32Array.from(arr);
      for (let i = 0; i < this.n; i++) {
        if (arr[i] <= lo + 0.5) continue;
        for (let d = lo; d <= arr[i] + margin; d += 1.5) { if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { arr[i] = Math.max(lo, d - margin); break; } }
      }
      this._easeWall(arr);
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
    const inside = insideRings(rings), lo = this.minWall, n = this.n;
    this.standL = this.standL || new Uint8Array(n); this.standR = this.standR || new Uint8Array(n);
    for (const [arr, side, cap, flag] of [[this.wallL, 1, this.capL, this.standL], [this.wallR, -1, this.capR, this.standR]]) {
      const ext = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        for (let d = lo; d <= reach; d += 1.5) if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { ext[i] = d - margin; break; }
      }
      // taper the ends (a max-filter with a slope) so the barrier angles back to the verge instead of stepping
      const r = Math.round(140 / this.ds), slope = 0.6 * this.ds;
      for (let i = 0; i < n; i++) {
        let m = 0; for (let k = -r; k <= r; k++) m = Math.max(m, ext[(i + k + n) % n] - Math.abs(k) * slope);
        if (m > arr[i] + 1 && m > lo) { arr[i] = m; cap[i] = 1; flag[i] = 1; }
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
    if (!rings.length) return;
    const inside = insideRings(rings), ext = Math.round(25 / this.ds);
    for (const [bar, wall, fence, side] of [[this.barL, this.wallL, this.fenceL, 1], [this.barR, this.wallR, this.fenceR, -1]]) {
      const raw = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        if (!bar[i] || bar[i] === BAR.WALL) continue;
        for (let d = wall[i]; d <= wall[i] + reach; d += 2) if (inside(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d)) { raw[i] = 1; break; }
      }
      for (let i = 0; i < n; i++) { if (!bar[i] || bar[i] === BAR.WALL) continue; for (let k = -ext; k <= ext && !fence[i]; k++) if (raw[(i + k + n) % n]) fence[i] = 1; }
    }
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
  /** the pinned wall (pinWall) that a point at arc length s, lateral d is up against, or null */
  pinAt(s, d) {
    for (const p of this.pins || []) if (Math.sign(d) === p.side && (p.a <= p.b ? s >= p.a && s <= p.b : s >= p.a || s <= p.b)) return p;
    return null;
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
    const lo = this.halfWidth + this.kerbWidth + 1.5, q = {};
    for (const [arr, side, cap] of [[this.wallL, 1, this.capL], [this.wallR, -1, this.capR]]) {
      const before = Float32Array.from(arr);
      for (let i = 0; i < this.n; i++) {
        for (let d = lo; d <= arr[i] + margin; d += 1.5) {
          this.nearest(this.px[i] + this.nx[i] * side * d, this.pz[i] + this.nz[i] * side * d, -1, q);
          const sep = Math.min(Math.abs(q.i - i), this.n - Math.abs(q.i - i)) * this.ds;
          if (sep > Math.max(80, 4 * d)) { arr[i] = Math.max(lo, d - margin); break; }
        }
      }
      this._easeWall(arr);
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
  if (!_fenceMat) _fenceMat = new THREE.MeshStandardMaterial({ map: fenceTexture(), alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.4, emissive: 0x15171a });
  return _fenceMat;
}
/** the catch fences in front of the grandstands (Track.markFences), built once the stands are placed */
export function buildCatchFences(track, pit) {
  const tr = track, group = new THREE.Group(); group.name = 'catch-fences';
  if (!tr.fenceL) return group;
  const pitSide = pit ? pit.sideSign : 0;
  const geos = [1, -1].map((side) => {
    const f = side > 0 ? tr.fenceL : tr.fenceR;
    const mask = (i) => f[i] && f[(i + 1) % tr.n] && !(pit && side === pitSide && pit.laneCovers?.[i]);
    return ribbon(tr, (i) => side * (tr.wallAt(i, side) + 0.25), (i) => side * (tr.wallAt(i, side) + 0.25), 0.4, { yB: FENCE_H, mask, uvFn: (i) => tr.s[i] / 3 });
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
export function ribbon(tr, offA, offB, y, { mask = null, colorFn = null, uvV = 8, closed = tr.closed, yB = null, uvFn = null } = {}) {
  const pos = [], uv = [], idx = [], col = [];
  const n = tr.n, segs = closed ? n : n - 1;
  let vcount = 0; let prevEmitted = false;
  const yAt = (i) => (typeof y === 'function' ? y(i) : y);
  const yBAt = (i) => (yB == null ? yAt(i) : (typeof yB === 'function' ? yB(i) : yB));
  const emit = (i) => {
    let a = offA(i), b = offB(i);
    // a flat ribbon always runs right edge to left edge, whatever order its offsets were given in (backwards, it
    // faces down and is culled - which once made Silverstone's pit lane grass); walls (yB) keep their order
    if (yB == null && a > b) { const t = a; a = b; b = t; }
    pos.push(tr.px[i] + tr.nx[i] * a, yAt(i), tr.pz[i] + tr.nz[i] * a, tr.px[i] + tr.nx[i] * b, yBAt(i), tr.pz[i] + tr.nz[i] * b);
    const v = uvFn ? uvFn(i) : tr.s[i] / uvV;
    uv.push(0, v, 1, v);
    if (colorFn) { col.push(...colorFn(i, a), ...colorFn(i, b)); }
    return vcount++;
  };
  for (let k = 0; k < segs; k++) {
    const i = k, j = (k + 1) % n;
    if (mask && !mask(i)) { prevEmitted = false; continue; }
    let vi;
    if (!prevEmitted) vi = emit(i); else vi = vcount - 1;
    const vj = emit(j);
    const a0 = vi * 2, a1 = vi * 2 + 1, b0 = vj * 2, b1 = vj * 2 + 1;
    idx.push(a0, b0, a1, a1, b0, b1);
    prevEmitted = true;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (colorFn) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
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
  const open = (i, side) => !(pit && side === pitSide && isNaN(pit.wallD[i]));
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
  const roadGeo = ribbon(tr, () => -hw, () => hw, 0, { colorFn: (i, d) => { const r = 1 - 0.28 * Math.exp(-(d * d) / 18); return [r, r, r]; }, uvV: 10 });
  group.add(spatialChunks([roadGeo], roadMat, 'road')); group.userData.roadMat = roadMat;   // lap-long ribbons are cut into map cells so off-camera parts cull

  // --- white edge lines (polygon offset: painted overlays never z-fight with the road at distance)
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe8e8e8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const l1 = ribbon(tr, () => hw - 0.25, () => hw, 0.012), l2 = ribbon(tr, () => -hw, () => -hw + 0.25, 0.012);
  group.add(spatialChunks([l1, l2], lineMat, 'lines'));

  // --- kerbs: the Las Vegas card-suit kerbs (red / white blocks with spades, hearts, clubs, diamonds), corner zones only
  const kerbMask = (i) => tr.inCorner[i] === 1;
  const kerbTex = kerbTexture(tr.def.kerb || 'cards');
  const kL = ribbon(tr, () => hw, () => hw + kw, 0.02, { mask: kerbMask, yB: 0.06, uvV: 10 });
  const kR = ribbon(tr, () => -hw - kw, () => -hw, 0.06, { mask: kerbMask, yB: 0.02, uvV: 10 });
  const kerbMat = new THREE.MeshStandardMaterial({ map: kerbTex, roughness: 0.62, emissive: 0xffffff, emissiveMap: kerbTex, emissiveIntensity: 0.18, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  group.add(spatialChunks([kL, kR], kerbMat, 'kerbs'));

  // --- run-off (painted concrete/asphalt), full lap; on the pit side it stops at the pit wall and is absent where the pit lane branches off
  const concrete = concreteTexture(); concrete.repeat.set(1, 1);
  // (no polygon offset and the same y as the road: the surfaces share edges instead of overlapping, and a
  //  positive offset would push them behind the ground plane at grazing angles - the black patches of old)
  // The paved run-off reaches all the way to the barrier (which is pushed back on the outside of corners), and is
  // painted per corner like the real event: red at T1, T-Mobile magenta around the Sphere loop, teal at T12 / T14.
  const runMat = new THREE.MeshStandardMaterial({ map: concrete, color: 0xffffff, vertexColors: true, roughness: 0.9, emissive: 0x0a0a0c });
  const runEdge = (i, side) => wallAt(i, side);
  const runMask = (side) => (i) => open(i, side) && runEdge(i, side) > hw + kw + 0.25 && !(pit && side === pitSide && pit.laneCovers[i]);
  const paint = tr.def.runoffPaint || [];
  const runTint = (i, d) => {
    if (wallAt(i, d > 0 ? 1 : -1) < bo + 1.5) return [0.6, 0.62, 0.65];   // only the escape apron is painted, the normal verge stays concrete
    const z = tr.inCornerZone(i) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 60)) || tr.inCornerZone(tr.idxAtS(tr.s[i] + 30));
    const turns = z ? (z.turns || [z.turn]) : [];
    for (const p of paint) if (turns.some((t) => p.turns.includes(t))) return p.color;   // per-track apron colours (tracks.js)
    return [0.6, 0.62, 0.65];
  };
  const circuit = tr.circuit;
  const surfAt = (i, side) => (side > 0 ? tr.surfL[i] : tr.surfR[i]);
  let gravelMat = null;
  if (!circuit) {
    const runL = ribbon(tr, (i) => hw + (kerbMask(i) ? kw : 0), (i) => runEdge(i, 1), 0, { uvV: 6, mask: runMask(1), colorFn: runTint });
    const runR = ribbon(tr, (i) => -runEdge(i, -1), (i) => -hw - (kerbMask(i) ? kw : 0), 0, { uvV: 6, mask: runMask(-1), colorFn: runTint });
    group.add(spatialChunks([runL, runR], runMat, 'runoff'));
  } else {
    // A permanent circuit: the verge is grass (the ground itself). Escape areas on the outside of the corners are
    // gravel traps (2 m of grass beyond the kerb, then gravel to just short of the barrier) or painted asphalt
    // from the kerb out; textures are mapped in world space so a 50 m deep trap is not one stretched tile.
    const worldUV = (g, scale) => { const p = g.attributes.position, uv = g.attributes.uv; for (let k = 0; k < p.count; k++) uv.setXY(k, p.getX(k) / scale, p.getZ(k) / scale); return g; };
    const inner = (i, t) => hw + kw + (t === 2 ? GRAVEL_IN : 0) - (t === 1 && !kerbMask(i) ? kw : 0);
    const outer = (i, side, t) => Math.max(inner(i, t), runEdge(i, side) - APRON_EDGE);
    const apronMask = (side, t) => (i) => { const j = (i + 1) % tr.n; return open(i, side) && surfAt(i, side) === t && surfAt(j, side) === t && !(pit && side === pitSide && pit.laneCovers[i]); };
    const apron = (t, opts) => [1, -1].map((side) => worldUV(side > 0
      ? ribbon(tr, (i) => inner(i, t), (i) => outer(i, 1, t), 0.004, { mask: apronMask(1, t), ...opts })
      : ribbon(tr, (i) => -outer(i, -1, t), (i) => -inner(i, t), 0.004, { mask: apronMask(-1, t), ...opts }), t === 2 ? 5 : 7));
    const asph = apron(1, { colorFn: runTint }).filter((g) => g.index.count);
    group.add(spatialChunks(asph, runMat, 'runAsphalt'));
    gravelMat = new THREE.MeshStandardMaterial({ map: gravelTexture(), roughness: 1, metalness: 0 });
    group.add(spatialChunks(apron(2, {}), gravelMat, 'runGravel'));
  }

  // --- barriers: sponsor panels (Heineken 0.0, Pirelli, Fabulous Las Vegas, chevrons, Golden Knights ...) in 180 m
  //     zones, all from one atlas texture: one material for every banner on the circuit
  const atlas = barrierAtlas();
  const panelMat = new THREE.MeshStandardMaterial({ map: atlas, emissive: 0xffffff, emissiveMap: atlas, emissiveIntensity: 0.55, roughness: 0.55, side: THREE.DoubleSide });
  const zoneOf = (i) => Math.floor(tr.s[i] / ZONE_LEN);
  const nZones = Math.ceil(tr.length / ZONE_LEN);
  const panelGeos = [];
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
  for (const side of [1, -1]) {
    for (let z = 0; z < nZones; z++) {
      const p = inTMobile(z) ? sz.panel : seq[(z + (side < 0 ? 5 : 0)) % seq.length];
      const keep = seg(side, (st) => st >= BAR.TYRES);
      const g = ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 1.2, mask: (i) => zoneOf(i) === z && keep(i) && !overAt(i, side), uvFn: (i) => -side * tr.s[i] / PANEL_LEN });
      if (!g.index.count) continue;
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, atlasU(p, uv.getX(k)));   // this zone's tile of the atlas
      panelGeos.push(g);
    }
    for (const o of over) {
      if (o.side !== side) continue;
      const keep = seg(side, (st) => st >= BAR.TYRES);
      const g = ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 1.2, mask: (i) => keep(i) && inRangeS(tr.s[i], o.a, o.b), uvFn: (i) => -side * tr.s[i] / PANEL_LEN });
      if (!g.index.count) continue;
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, atlasU(o.panel, uv.getX(k)));
      panelGeos.push(g);
    }
  }
  group.add(spatialChunks(panelGeos, panelMat, 'panels'));
  // wall caps, debris fence, blue LED rail
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x8e9299, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x151515 });
  const solidL = seg(1, (st) => st === BAR.WALL), solidR = seg(-1, (st) => st === BAR.WALL);
  const wLt = ribbon(tr, (i) => wallAt(i, 1), (i) => wallAt(i, 1) + 0.6, 1.2, { mask: solidL }), wRt = ribbon(tr, (i) => -wallAt(i, -1) - 0.6, (i) => -wallAt(i, -1), 1.2, { mask: solidR });
  group.add(spatialChunks([wLt, wRt], wallMat, 'caps'));
  const fenceMat = fenceMaterial();
  const fL = ribbon(tr, (i) => wallAt(i, 1) + 0.3, (i) => wallAt(i, 1) + 0.3, 1.2, { yB: 4.2, mask: solidL, uvFn: (i) => tr.s[i] / 3 }), fR = ribbon(tr, (i) => -wallAt(i, -1) - 0.3, (i) => -wallAt(i, -1) - 0.3, 1.2, { yB: 4.2, mask: solidR, uvFn: (i) => tr.s[i] / 3 });
  group.add(spatialChunks([fL, fR], fenceMat, 'fences'));
  const railMat = new THREE.MeshBasicMaterial({ color: 0x2255ff });
  const rL = ribbon(tr, (i) => wallAt(i, 1) + 0.2, (i) => wallAt(i, 1) + 0.4, 1.22, { mask: (i) => !circuit && !tr.inCornerZone(i) && open(i, 1) }), rR = ribbon(tr, (i) => -wallAt(i, -1) - 0.4, (i) => -wallAt(i, -1) - 0.2, 1.22, { mask: (i) => !circuit && !tr.inCornerZone(i) && open(i, -1) });
  group.add(spatialChunks([rL, rR], railMat, 'rails'));
  let armcoMat = null;
  if (circuit) {
    armcoMat = new THREE.MeshStandardMaterial({ map: armcoTexture(), roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide });
    const arm = [1, -1].map((side) => ribbon(tr, (i) => side * wallAt(i, side), (i) => side * wallAt(i, side), 0, { yB: 0.85, mask: seg(side, (st) => st === BAR.ARMCO), uvFn: (i) => tr.s[i] / 4 })).filter((g) => g.index.count);
    group.add(spatialChunks(arm, armcoMat, 'armco'));
    // the tyre wall under its banners: a dark band of stacked tyres along the bottom, a touch in front of the cover
    const tyreMat = new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.9, side: THREE.DoubleSide });
    const tyres = [1, -1].map((side) => ribbon(tr, (i) => side * (wallAt(i, side) - 0.05), (i) => side * (wallAt(i, side) - 0.05), 0, { yB: 0.35, mask: seg(side, (st) => st === BAR.TYRES) })).filter((g) => g.index.count);
    group.add(spatialChunks(tyres, tyreMat, 'tyreWall'));
    // painted green strip behind the kerbs (as at the real circuit: the "astroturf" paint on corner exits)
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2f8f3a, roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const gm = (side) => (i) => kerbMask(i) && kerbMask((i + 1) % tr.n) && surfAt(i, side) !== 1 && !(pit && side === pitSide && pit.laneCovers[i]);
    const green = [ribbon(tr, () => hw + kw, () => hw + kw + GREEN_W, 0.006, { mask: gm(1) }), ribbon(tr, () => -hw - kw - GREEN_W, () => -hw - kw, 0.006, { mask: gm(-1) })].filter((g) => g.index.count);
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
      const inner = hw + kw + 0.15, outer = hw + kw + 3.0 - 0.15;
      const ok = (i) => inRangeS(tr.s[i], a, b) && runEdge(i, side) >= outer + (circuit ? APRON_EDGE : 0) && (circuit ? open(i, side) && surfAt(i, side) === 1 : runMask(side)(i));
      const g = ribbon(tr, () => side * inner, () => side * outer, 0.012, { mask: (i) => ok(i) && ok((i + 1) % tr.n), uvFn: (i) => tr.wrapS(tr.s[i] - a) / len });
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
    const roadA = (i) => Math.min(ws * pit.laneEdge[i], gs * pit.halfWidth), roadB = (i) => Math.max(ws * pit.laneEdge[i], gs * pit.halfWidth);
    const pitRoad = new THREE.Mesh(ribbon(pl, roadA, roadB, 0, { closed: false, colorFn: () => [0.85, 0.85, 0.9], uvV: 10, mask: own }), pitRoadMat);
    group.add(pitRoad); group.userData.pitRoadMat = pitRoadMat; pitRoad.userData.keep = true;
    // yellow edge lines: the track-side one follows the clipped edge (it is the pit entry / exit line where the lane meets the kerb)
    const pe1 = ribbon(pl, (i) => ws * (pit.laneEdge[i] - 0.2), (i) => ws * pit.laneEdge[i], 0.01, { closed: false, mask: (i) => own(i) && pit.laneEdge[i] > -pit.halfWidth + 1.0 });
    const pe2 = ribbon(pl, () => gs * pit.halfWidth, () => gs * (pit.halfWidth - 0.2), 0.01, { closed: false, mask: own });
    const yellow = new THREE.MeshBasicMaterial({ color: 0xffd23a, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    group.add(new THREE.Mesh(mergeGeometries([pe1, pe2]), yellow));
    // fast-lane / working-lane dashed separator
    const sep = ribbon(pl, () => gs * (pit.halfWidth - 3.6), () => gs * (pit.halfWidth - 3.45), 0.01, { closed: false, mask: (i) => own(i) && (i % 4) < 2 && isFinite(pit.wallIn[i]) });
    group.add(new THREE.Mesh(sep, lineMat));
    // concrete apron between the lane edge and the pit wall (only where the wall exists)
    const hasWall = (i) => own(i) && isFinite(pit.wallIn[i]);
    const wIn = (i) => (isFinite(pit.wallIn[i]) ? pit.wallIn[i] : Math.max(0.6, pit.wallPos[i]));   // finite everywhere (vertex at the wall's end sample)
    // (the run-off material is vertex-coloured: the apron gets the plain concrete tint, or it renders black)
    const apron = ribbon(pl, (i) => Math.min(ws * pit.laneEdge[i], ws * (wIn(i) + 0.6)), (i) => Math.max(ws * pit.laneEdge[i], ws * (wIn(i) + 0.6)), 0, { closed: false, mask: hasWall, uvV: 6, colorFn: () => [0.6, 0.62, 0.65] });
    group.add(new THREE.Mesh(apron, runMat)).children.at(-1).userData.keep = true;
    // the pit lane's own track-side wall, only where the lane runs too far from the road for the circuit barrier to double as pit wall
    const farWall = (i) => hasWall(i) && pit.trackD[i] - pit.wallIn[i] > tr.minWall + 0.5;
    const pw = ribbon(pl, (i) => ws * wIn(i), (i) => ws * wIn(i), 0, { closed: false, yB: 1.1, mask: farWall });
    const pwCap = ribbon(pl, (i) => ws * (wIn(i) - 0.3), (i) => ws * (wIn(i) + 0.3), 1.1, { closed: false, mask: farWall });
    // pit-lane outer wall (garage side)
    const outer = ribbon(pl, () => gs * (pit.halfWidth + 1.0), () => gs * (pit.halfWidth + 1.0), 0, { closed: false, yB: 1.0, mask: (i) => own(i) && i > 8 && i < pl.n - 10 });
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
    if (pit.wallStartI >= 0) { nose(pit.wallStartI - 9, pit.wallStartI, true); nose(pit.wallEndI, pit.wallEndI + 9, false); }
    if (noses.length) group.add(new THREE.Mesh(mergeGeometries(noses), noseMat));
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
  const concreteDay = concreteTexture(true);
  group.userData.setTime = (mode) => {
    const day = mode === 'day';
    roadMat.map = day ? asphaltDay : asphalt; roadMat.emissiveIntensity = day ? 0 : 0.6; roadMat.needsUpdate = true;
    runMat.map = day ? concreteDay : concrete; runMat.emissiveIntensity = day ? 0 : 1; runMat.needsUpdate = true;
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

/** Signed distance from the racing corridor (track barriers + pit lane): negative = inside the corridor by that much. */
export function corridorSigned(track, pit, x, z, margin = 1.5) {
  const q = track.nearest(x, z);
  let c = Math.abs(q.d) - (track.wallAt(q.i, q.d > 0 ? 1 : -1) + margin);
  if (pit) {
    const ps = pit.samples; let bd = Infinity, bi = 0;
    for (let i = 0; i < ps.n; i += 2) { const dd = (ps.px[i] - x) ** 2 + (ps.pz[i] - z) ** 2; if (dd < bd) { bd = dd; bi = i; } }
    const dx = x - ps.px[bi], dz = z - ps.pz[bi];
    const along = dx * ps.tx[bi] + dz * ps.tz[bi], lat = dx * ps.nx[bi] + dz * ps.nz[bi];
    const inEnds = (bi <= 1 && along < -margin) || (bi >= ps.n - 2 && along > margin);
    if (!inEnds) c = Math.min(c, Math.abs(lat) - (pit.halfWidth + 3 + margin));
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
  const hwT = track.halfWidth, kwT = track.kerbWidth;
  // per pit sample: distance of the road centre, whether the sample still lies on the road (entry/exit blend),
  // how far the lane's own asphalt may reach toward the road (clipped at the kerb) and whether the pit wall exists yet
  const n = samples.n;
  const overlapsTrack = new Uint8Array(n), trackD = new Float32Array(n), laneEdge = new Float32Array(n), wallIn = new Float32Array(n), trackI = new Int32Array(n), wallPos = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const q = track.nearest(samples.px[i], samples.pz[i]); const D = Math.abs(q.d);
    trackD[i] = D; trackI[i] = q.i;
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
  let wallStartI = -1, wallEndI = -1;
  for (let i = 0; i < n; i++) if (isFinite(wallIn[i])) { if (wallStartI < 0) wallStartI = i; wallEndI = i; }
  for (let i = 0; i < n; i++) wallIn[i] = i >= wallStartI && i <= wallEndI && wallStartI >= 0 ? Math.max(0.6, wallPos[i]) : Infinity;   // one continuous wall, no islands
  // how far the lane's own asphalt reaches toward the road: to the wall base where the wall exists, else exactly to the
  // road's kerb / edge line (negative = that line lies on the garage side of the lane centre: the lane is merging and its
  // asphalt tapers to a point against the road edge - no overlap, no z-fighting)
  for (let i = 0; i < n; i++) {
    const edgeIn = hwT + (track.inCornerZone(trackI[i]) ? kwT : 0);
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
  for (let k = track.idxAtS(first.s - 120); ; k = (k + 1) % track.n) { sideArr[k] = Math.min(sideArr[k], track.minWall); sideBar[k] = BAR.WALL; if (k === track.idxAtS(last.s + 120)) break; }   // the pit wall
  track.pitCovers = laneCovers; track.pitSide = sideSign;   // the lane's asphalt beside the road is not grass (Track.surface)
  const wallD = new Float32Array(track.n); for (let i = 0; i < track.n; i++) wallD[i] = sideArr[i];
  const set = new Uint8Array(track.n);
  for (let k = entryI; ; k = (k + 1) % track.n) { wallD[k] = NaN; if (k === exitI) break; }
  for (let i = 0; i < n; i++) {
    if (overlapsTrack[i]) continue;
    // (with def.pitWallClear, never on the road or its kerb: where the circuit bends away from a straight lane -
    //  Montreal's last chicane - a lane sample's nearest point of the circuit can be one the wall is not beside)
    const ti = trackI[i]; const v = isFinite(wallIn[i]) ? Math.max(track.def.pitWallClear ? hwT + kwT + 0.5 : 0, Math.min(track.minWall, trackD[i] - wallIn[i])) : NaN;
    wallD[ti] = v; set[ti] = 1;
  }
  let prev = NaN;
  for (let k = entryI; ; k = (k + 1) % track.n) { if (set[k]) prev = wallD[k]; else wallD[k] = prev; if (k === exitI) break; }
  const gapEntry = [track.wrapS(first.s - 10), track.wrapS(first.s + samples.s[divergeI] + 40)];
  const gapExit = [track.wrapS(last.s - (samples.length - samples.s[mergeI]) - 60), track.wrapS(last.s + 10)];
  const isGapS = (s) => inRangeS(s, gapEntry[0], gapEntry[1]) || inRangeS(s, gapExit[0], gapExit[1]);
  // boxes: one garage per team, adjacent (16 m pitch) and centred on the walled part of the lane, like a real pit building
  const boxes = []; const pitch = Math.round(16 / samples.ds);
  const midI = wallStartI >= 0 ? (wallStartI + wallEndI) / 2 : n / 2;
  for (let k = 0; k < boxCount; k++) boxes.push({ i: Math.round(midI + (k - (boxCount - 1) / 2) * pitch), k, team: null });
  // the speed-limit zone: from the pit-entry speed line to the pit-exit line. Real circuits have them bracketing the
  // garages, with the entry and exit roads (driven at speed) outside: track.def.pitLimit = { before, after } metres
  // before the first box / after the last; without it the whole lane is limited.
  const lim = track.def.pitLimit, bU0 = samples.s[boxes[0].i], bU1 = samples.s[boxes[boxes.length - 1].i];
  const limitFrom = lim ? Math.max(samples.s[divergeI] - 4, bU0 - lim.before) : samples.s[divergeI] - 4;
  const limitTo = lim ? Math.min(samples.s[mergeI] + 4, bU1 + lim.after) : samples.s[mergeI] + 4;
  const pit = {
    limitFrom, limitTo,
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

