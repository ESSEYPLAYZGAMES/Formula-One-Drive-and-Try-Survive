// Fit the AI to telemetry: each corner's minimum speed and braking point from a real lap (or the fastest of several),
// relative to that lap, carried onto the sim's car - which is not the real car: the fit matches the SHAPE of the lap
// (where it is slow, where it brakes, against its own average) and leaves the sim's overall pace alone.
//
//   node tools/ai_fit.mjs <track> <telemetry file> [more files...] [--offset m] [--blend 0.7] [--dry]
//
// Laps of the game's own car on the same circuit (its telemetry export) are the same car as the AI's: the lap mode
// (--corners: the older fit, the corners and the driver's line from the fastest lap; --shape: the relative fit above):
//   * one lap out of all of them: the circuit in sections (between the corners, cut where the speed profile peaks),
//     each from the fastest lap through it that stayed on the road (its centre within 1.5 m of the kerb) and was not
//     rewound there (a flashback: the attempt it abandoned, 100 m before the rewind, and what came after it), blended
//     over 60 m at the joins; its line smoothed (wiggles shorter than ~23 m - steering corrections - go);
//   * that lap is the racing line drawn on the track (ai/Calibration.js `show`: where it was on the road and its speed
//     every 2 m - red on screen wherever you are quicker than it was there);
//   * the AI keeps its own line (driven by the AI, a human's line was no quicker in any section: its controller cannot
//     scrub speed at full lock as a driver does), and its corners are fitted to the lap's minimum speeds and braking
//     points (the absolute fit below), then driven: a corner that is no longer clean goes back.
import fs from 'fs';
import path from 'path';
import { openGame, calRun, readCal, writeCal, groupsOf } from './ai_lib.mjs';

const args = process.argv.slice(2), files = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--') && !['--dry'].includes(args[i - 1])));
const track = files.shift(), opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? +args[i + 1] : d; };
const BLEND = opt('blend', 0.7), OFFSET = args.includes('--offset') ? opt('offset', 0) : null, DRY = args.includes('--dry');
if (!track || !files.length) { console.log('usage: node tools/ai_fit.mjs <track> <telemetry file> [...] [--offset m] [--blend 0.7] [--dry]'); process.exit(1); }

// ---- reading -------------------------------------------------------------------------------------------------------
const num = (x) => { if (typeof x === 'boolean') return +x; if (/^\s*true\s*$/i.test(x)) return 1; if (/^\s*false\s*$/i.test(x)) return 0; const v = parseFloat(x); return isFinite(v) ? v : null; };
const pickCol = (names, cands) => { const low = names.map((n) => String(n).toLowerCase().trim()); for (const c of cands) { const i = low.indexOf(c); if (i >= 0) return names[i]; } return null; };
function fromRows(rows, label) {
  const names = Object.keys(rows[0] || {});
  const cD = pickCol(names, ['distance', 'dist', 'd', 'lapdist', 'lap_distance', 'lapdistance', 'relativedistance']), cV = pickCol(names, ['speed', 'v', 'speed_kmh', 'kmh', 'vcar']);
  const cB = pickCol(names, ['brake', 'brk', 'brake_pressure', 'brakes']), cL = pickCol(names, ['lap', 'lapnumber', 'lap_number']), cT = pickCol(names, ['laptime', 'lap_time']);
  if (!cD || !cV) throw new Error(`${label}: no distance / speed columns among ${names.join(', ')}`);
  let use = rows;
  if (cL) {   // several laps: the fastest by its lap-time column, else the first full one
    const by = new Map(); for (const r of rows) { const k = r[cL]; if (!by.has(k)) by.set(k, []); by.get(k).push(r); }
    const laps = [...by.values()].filter((L) => L.length > 50);
    use = cT ? laps.sort((a, b) => num(a[0][cT]) - num(b[0][cT]))[0] : laps[0];
  }
  const d = [], v = [], b = [];
  for (const r of use) { const x = num(r[cD]), s = num(r[cV]); if (x == null || s == null) continue; d.push(x); v.push(s); let br = cB ? num(r[cB]) ?? 0 : 0; if (br > 1.5) br /= 100; b.push(br); }
  if (cD.toLowerCase() === 'relativedistance') { const L = Math.max(...d) > 1.5 ? 1 : 4361; for (let i = 0; i < d.length; i++) d[i] *= L; }
  return { label, d, v, b, hasBrake: !!cB };
}
/** a lap as it stands after its flashbacks: where the distance jumps back (a rewind), the attempt it rewound is dropped -
 *  the samples from that distance on, before the jump - so the lap is the one driven (`cut`: how many rewinds) */
function unrewind(S) {
  const keep = [], d = S.d, joins = []; let cut = 0;
  for (let i = 0; i < d.length; i++) {
    if (keep.length && d[i] < d[keep[keep.length - 1]] - 3) { cut++; joins.push(d[i]); while (keep.length && d[keep[keep.length - 1]] >= d[i] - 0.5) keep.pop(); }
    keep.push(i);
  }
  const col = (a) => (a ? keep.map((i) => a[i]) : a);
  return { d: col(S.d), v: col(S.v), brk: col(S.brk), x: col(S.x), z: col(S.z), cut, joins };
}
function readTelemetry(file) {
  const text = fs.readFileSync(file, 'utf8'), label = path.basename(file);
  if (/\.csv$/i.test(file) || /^[^{[]/.test(text.trim())) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim()), sep = lines[0].includes(';') && !lines[0].includes(',') ? ';' : lines[0].includes('\t') ? '\t' : ',';
    const head = lines[0].split(sep).map((h) => h.replace(/^"|"$/g, ''));
    return fromRows(lines.slice(1).map((l) => { const c = l.split(sep); const o = {}; head.forEach((h, i) => { o[h] = c[i]?.replace(/^"|"$/g, ''); }); return o; }), label);
  }
  const J = JSON.parse(text);
  if (J.format && String(J.format).startsWith('f1sim-telemetry')) {
    // the game's own export: every complete lap that stayed on the track (a flashback used elsewhere in it is fine: its
    // samples are the lap as driven after it), else the fastest lap there is
    const all = (J.laps || []).filter((l) => l.time && l.samples?.d?.length > 50 && l.samples.d[0] < 30);
    let use = all.filter((l) => (l.offTrack || 0) < 0.3);
    if (!use.length) use = [...all].sort((a, b) => a.time - b.time).slice(0, 1);
    if (!use.length) throw new Error(`${label}: no laps in it`);
    return use.map((L) => { const s = unrewind(L.samples); return { label: `${label} (lap ${L.n}, ${L.time}s${s.cut ? `, ${s.cut} flashback${s.cut > 1 ? 's' : ''}` : ''})`, d: s.d, v: s.v, b: s.brk, x: s.x, z: s.z, joins: s.joins, hasBrake: true, track: J.track?.id, own: true }; });
  }
  if (Array.isArray(J)) return fromRows(J, label);
  const keys = Object.keys(J); const n = Math.max(...keys.map((k) => (Array.isArray(J[k]) ? J[k].length : 0)));
  return fromRows(Array.from({ length: n }, (_, i) => Object.fromEntries(keys.filter((k) => Array.isArray(J[k])).map((k) => [k, J[k][i]]))), label);
}

// ---- lining up and measuring ---------------------------------------------------------------------------------------
/** speed every 5 m over `len` metres (the telemetry stretched to it, shifted by `off`) */
function resample(T, len, off, scale) {
  const n = Math.ceil(len / 5), out = new Array(n), Lt = T.d[T.d.length - 1] - T.d[0];
  let j = 0;
  for (let k = 0; k < n; k++) {
    let x = ((k * 5) / scale - off) % Lt; if (x < 0) x += Lt; x += T.d[0];
    if (x < T.d[j]) j = 0; while (j < T.d.length - 2 && T.d[j + 1] < x) j++;
    const f = Math.max(0, Math.min(1, (x - T.d[j]) / ((T.d[j + 1] - T.d[j]) || 1)));
    out[k] = T.v[j] + (T.v[j + 1] - T.v[j]) * f;
  }
  return out;
}
function align(T, aiTrace, len) {
  const Lt = T.d[T.d.length - 1] - T.d[0], scale = len / Lt;
  const z = (a) => { const m = a.reduce((s, x) => s + x, 0) / a.length, sd = Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / a.length) || 1; return a.map((x) => (x - m) / sd); };
  const A = z(aiTrace); let best = { off: 0, r: -Infinity };
  if (OFFSET != null) return { off: OFFSET, scale, r: null };
  for (let off = -400; off <= 400; off += 5) { const B = z(resample(T, len, off, scale)); let r = 0; for (let k = 0; k < A.length; k++) r += A[k] * B[k]; r /= A.length; if (r > best.r) best = { off, r }; }
  return { ...best, scale };
}
/** per corner of the sim circuit: the telemetry's minimum speed and braking point (m before the apex), each over its lap's own */
function measure(T, al, corners, len) {
  const at = (s) => { let x = (s / al.scale - al.off) % (T.d[T.d.length - 1] - T.d[0]); if (x < 0) x += T.d[T.d.length - 1] - T.d[0]; return x + T.d[0]; };
  const sample = (x, ch) => { let j = 0; while (j < T.d.length - 2 && T.d[j + 1] < x) j++; const f = Math.max(0, Math.min(1, (x - T.d[j]) / ((T.d[j + 1] - T.d[j]) || 1))); return T[ch][j] + (T[ch][j + 1] - T[ch][j]) * f; };
  const mean = T.v.reduce((a, b) => a + b, 0) / T.v.length;
  return corners.map((c) => {
    let vmin = Infinity, brake = null;
    for (let u = -220; u <= 120; u += 2) { const x = at(c.apex + u), v = sample(x, 'v'); if (u >= -70 && u <= 50) vmin = Math.min(vmin, v); if (brake == null && u < 0 && T.hasBrake && sample(x, 'b') > 0.3) brake = -u; }
    return { n: c.n, vmin, brake, relV: vmin / mean };
  });
}

// ---- the lap mode: the game's own laps, taken whole ---------------------------------------------------------------
function ownLaps(file) {
  let J; try { J = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
  if (!J.format || !String(J.format).startsWith('f1sim-telemetry') || J.track?.id !== track) return null;
  return (J.laps || []).filter((l) => l.time && l.samples?.d?.length > 50 && l.samples.x).map((l) => ({ label: `${path.basename(file)} lap ${l.n} (${l.time}s${l.flags?.length ? `, ${l.flags.join(', ')}` : ''})`,
    S: Object.fromEntries(['t', 'd', 'x', 'z', 'v', 'thr', 'brk'].map((k) => [k, l.samples[k]])) }));
}
/** (in the game) the one lap out of all of them, its line and its speeds every `every` m - see the head of this file */
function composite({ laps, every, lam }) {
  const F = window.__F1, tr = F.W.track, L = tr.length, n = Math.round(L / every), q = {}, prof = F.W.profile;
  const wrap = (s) => ((s % L) + L) % L;
  const interp = (D, V, x) => { let lo = 0, hi = D.length - 1; if (x <= D[0]) return V[0]; if (x >= D[hi]) return V[hi]; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (D[m] <= x) lo = m; else hi = m; } const f = (x - D[lo]) / ((D[hi] - D[lo]) || 1); return V[lo] + (V[hi] - V[lo]) * f; };
  const per = laps.map((lap) => {
    const S = lap.S, keep = [], bad = [];
    for (let i = 0; i < S.d.length; i++) {
      if (keep.length && S.d[i] < S.d[keep[keep.length - 1]] - 3) { bad.push([S.d[i] - 100, S.d[keep[keep.length - 1]] + 10]); while (keep.length && S.d[keep[keep.length - 1]] >= S.d[i] - 0.5) keep.pop(); }
      keep.push(i);
    }
    const c = {}; for (const k of Object.keys(S)) c[k] = keep.map((i) => S[k][i]);
    c.off = []; let hint = -1;
    for (let i = 0; i < c.d.length; i++) {
      tr.nearest(c.x[i], c.z[i], hint, q); hint = q.i; c.off.push(q.d);
      if (Math.abs(q.d) - tr.edgeAt(q.i, Math.sign(q.d) || 1) - tr.kerbWidth > 1.5) bad.push([c.d[i] - 60, c.d[i] + 30]);
    }
    return { label: lap.label, c, bad };
  });
  // the sections: cut where the speed profile peaks between two corners
  const cs = tr.def.corners.filter((k) => k.s != null).map((k) => k.s).sort((a, b) => a - b), B = [];
  for (let j = 0; j < cs.length; j++) {
    const a = cs[j], b = j + 1 < cs.length ? cs[j + 1] : cs[0] + L; let best = -1, at = (a + b) / 2;
    for (let x = a + 30; x < b - 30; x += 2) { const v = prof[tr.idxAtS(x)]; if (v > best) { best = v; at = x; } }
    B.push(wrap(at));
  }
  B.sort((a, b) => a - b);
  const secs = B.map((a, j) => [a, j + 1 < B.length ? B[j + 1] : B[0] + L]);
  const tAt = (c, x) => interp(c.d, c.t, x);
  const secT = (c, a, b) => (b <= L ? tAt(c, b) - tAt(c, a) : (tAt(c, L) - tAt(c, a)) + (tAt(c, b - L) - tAt(c, 0)));
  const overlaps = (bad, a, b) => bad.some(([x0, x1]) => (x0 < b && x1 > a) || (b > L && x0 < b - L));
  const pick = secs.map(([a, b]) => {
    const opts = per.map((p, k) => ({ k, t: secT(p.c, a, b), ok: !overlaps(p.bad, a, b) && p.c.d[0] <= Math.max(0, a) + 15 && p.c.d[p.c.d.length - 1] >= Math.min(L, b) - 15 }));
    const ok = opts.filter((o) => o.ok), o = (ok.length ? ok : opts).reduce((x, y) => (y.t < x.t ? y : x));
    return { k: o.k, t: o.t, clean: !!ok.length };
  });
  // every bin from its section's lap, blended over 30 m either side of a join
  const BL = 30, line = new Float64Array(n), kmh = new Float64Array(n), thr = new Float64Array(n), brk = new Float64Array(n);
  const secOf = (x) => { for (let j = 0; j < secs.length; j++) { const [a, b] = secs[j]; if ((x >= a && x < b) || (b > L && x < b - L)) return j; } return 0; };
  for (let k = 0; k < n; k++) {
    const x = k * every, j = secOf(x), [a, b] = secs[j], w = new Map([[pick[j].k, 1]]), da = wrap(x - a), db = wrap(b - x);
    if (da < BL) { const f = 0.5 + 0.5 * da / BL; w.set(pick[j].k, f); const o = pick[(j - 1 + secs.length) % secs.length].k; w.set(o, (o === pick[j].k ? f : w.get(o) || 0) + 1 - f); }
    else if (db < BL) { const f = 0.5 + 0.5 * db / BL; w.set(pick[j].k, f); const o = pick[(j + 1) % secs.length].k; w.set(o, (o === pick[j].k ? f : w.get(o) || 0) + 1 - f); }
    for (const [m, wt] of w) { const c = per[m].c; line[k] += wt * interp(c.d, c.off, x); kmh[k] += wt * interp(c.d, c.v, x); thr[k] += wt * interp(c.d, c.thr, x); brk[k] += wt * interp(c.d, c.brk, x); }
  }
  // the line smoothed: a Whittaker smoother (second differences, periodic), solved by conjugate gradients
  const A = (x, out) => { for (let i = 0; i < n; i++) out[i] = x[i] + lam * (x[(i - 2 + n) % n] - 4 * x[(i - 1 + n) % n] + 6 * x[i] - 4 * x[(i + 1) % n] + x[(i + 2) % n]); };
  const X = Float64Array.from(line), r = new Float64Array(n), p = new Float64Array(n), Ap = new Float64Array(n);
  A(X, Ap); for (let i = 0; i < n; i++) { r[i] = line[i] - Ap[i]; p[i] = r[i]; }
  let rr = r.reduce((s2, x) => s2 + x * x, 0);
  for (let it = 0; it < 2000 && rr > 1e-10; it++) {
    A(p, Ap); const al = rr / p.reduce((s2, x, i) => s2 + x * Ap[i], 0);
    for (let i = 0; i < n; i++) { X[i] += al * p[i]; r[i] -= al * Ap[i]; }
    const r2 = r.reduce((s2, x) => s2 + x * x, 0); for (let i = 0; i < n; i++) p[i] = r[i] + (r2 / rr) * p[i]; rr = r2;
  }
  let t = 0; for (let k = 0; k < n; k++) t += every / Math.max(1, (kmh[k] + kmh[(k + 1) % n]) / 7.2);
  return { line: Array.from(X, (x) => +x.toFixed(2)), kmh: Array.from(kmh, (x) => +x.toFixed(1)), thr: Array.from(thr, (x) => +x.toFixed(2)), brk: Array.from(brk, (x) => +x.toFixed(2)), time: t,
    secs: secs.map(([a, b], j) => ({ a: Math.round(a), b: Math.round(wrap(b)), lap: per[pick[j].k].label, t: +pick[j].t.toFixed(2), clean: pick[j].clean })) };
}
const own = !args.includes('--shape') && !args.includes('--corners') ? files.map(ownLaps) : [];
let LAP = null;   // (the lap mode: the composite lap, and the game it was built in - the corner fit below goes on in it)
if (own.length && own.every(Boolean)) {
  const laps = own.flat(), EVERY = 2;
  console.log(`[fit] ${laps.length} lap(s) of the game's own car on ${track}: the lap mode`);
  const G = await openGame(track);
  const R = await G.page.evaluate(composite, { laps, every: EVERY, lam: opt('lambda', 12) });
  for (const sc of R.secs) console.log(`[fit]   ${String(sc.a).padStart(5)}-${String(sc.b).padEnd(5)} ${sc.t.toFixed(2).padStart(6)} s  ${sc.lap}${sc.clean ? '' : '  (no clean pass: the fastest)'}`);
  console.log(`[fit] the lap: ${R.time.toFixed(2)} s from its speeds; the line ${Math.max(...R.line.map(Math.abs)).toFixed(1)} m off the centreline at the widest`);
  const bins = R.kmh.map((_, k) => k * EVERY);
  LAP = { G, show: { every: EVERY, d: R.line, kmh: R.kmh }, T: [{ label: `the composite of ${laps.length} laps (${R.time.toFixed(2)} s)`, d: bins, v: R.kmh, b: R.brk, hasBrake: true, own: true, track }] };
}

// ---- the fit -------------------------------------------------------------------------------------------------------
const T = LAP ? LAP.T : files.flatMap(readTelemetry);
// the game's own car on this circuit (its export): the same car as the AI's, so the fit is absolute - the speeds and
// the braking points themselves, not only the lap's shape (--shape keeps it relative)
const ABS = !args.includes('--shape') && T.every((t) => t.own && t.track === track);
const PASSES = opt('passes', ABS ? 2 : 1), LIMV = ABS ? [0.9, 1.45] : [0.9, 1.1], LIMB = ABS ? [0.85, 1.15] : [0.85, 1.15];   // (braking: later than 1.15 x the physics' point holds solo, but in a field - dirty air, mistakes on - the hairpin became a pile-up)
if (ABS) console.log(`[fit] ${T.length} lap(s) of the game's own car on ${track}: fitting the speeds and braking points themselves, ${PASSES} passes`);
const { page, close } = LAP ? LAP.G : await openGame(track);
// (the lap mode: driven at the difficulty slider's top, --diff - what holds there holds below, and the driver's laps were
//  run against it - on new tyres at every line)
const RUN = LAP ? { diff: opt('diff', 100), fresh: true } : {};
const cal = await readCal(page, track); cal.corners = cal.corners || {};
// (the lap mode: the AI keeps its own line - it is the quicker one for it - and the driver's lap is the racing line shown
//  on the track: cal.show; the corners are fitted to its speeds and braking points)
if (LAP) { cal.show = LAP.show; delete cal.line; await page.evaluate((c) => window.__F1.rebuildLine(c), cal); }
const groups = await groupsOf(page);
for (const g of groups) for (const n of g) cal.corners[n] = { v: 1, b: 1, ...cal.corners[n] };
// the driver's own line (the game's car, with positions): where on the road each lap was, every 2 m, averaged over the
// laps; it becomes the AI's racing line (ai/Calibration.js `line`, RacingLine `fixed`) - the kerbs the driver rides, the
// chicanes straightened - and the speeds and brakes are fitted on it. --noline keeps the AI's own line
if (ABS && !LAP && !args.includes('--noline') && T.every((t) => t.x?.length)) {
  const EVERY = 2;
  const L = await page.evaluate(([laps, EVERY]) => {
    const tr = window.__F1.W.track, n = Math.ceil(tr.length / EVERY), sum = new Float64Array(n), cnt = new Float64Array(n), q = {};
    // the path itself first: each lap's positions in pieces (a flashback's join - the lap rewound and driven again from
    // there - is a jump in the trace: the pieces stop 20 m either side of one), resampled every metre along the path and
    // smoothed there (sigma 3 m: GPS-like noise in a few samples is not curvature); then each point onto the track: its
    // distance along it and its offset, binned every EVERY m (bin k is the line at k * EVERY m, as RacingLine reads it)
    for (const lap of laps) {
      const pieces = []; let cur = [];
      for (let i = 0; i < lap.x.length; i++) {
        if (lap.joins.some((j) => Math.abs(lap.d[i] - j) < 20)) { if (cur.length) pieces.push(cur); cur = []; continue; }
        if (cur.length && Math.hypot(lap.x[i] - cur[cur.length - 1][0], lap.z[i] - cur[cur.length - 1][1]) > 25) { pieces.push(cur); cur = []; }
        cur.push([lap.x[i], lap.z[i]]);
      }
      if (cur.length) pieces.push(cur);
      for (const pc of pieces) {
        if (pc.length < 4) continue;
        const R = [pc[0]]; let acc = 0;   // (every metre along it)
        for (let i = 1; i < pc.length; i++) { const [ax, az] = pc[i - 1], [bx, bz] = pc[i], l = Math.hypot(bx - ax, bz - az); if (!l) continue; let u = 1 - acc; while (u <= l) { R.push([ax + (bx - ax) * (u / l), az + (bz - az) * (u / l)]); u += 1; } acc = (acc + l) % 1; }
        let hint = -1;
        for (let i = 0; i < R.length; i++) {
          let sx = 0, sz = 0, w = 0; for (let j = -9; j <= 9; j++) { const r = R[i + j]; if (!r) continue; const g = Math.exp(-(j * j) / 18); sx += r[0] * g; sz += r[1] * g; w += g; }
          tr.nearest(sx / w, sz / w, hint, q); hint = q.i; const k = Math.round(q.s / EVERY) % n; sum[k] += q.d; cnt[k]++;
        }
      }
    }
    const raw = []; for (let k = 0; k < n; k++) raw.push(cnt[k] ? sum[k] / cnt[k] : null);
    // the gaps bridged in the world, not in the offsets: a straight run between the two ends, as a car would take it (an
    // offset carried straight across a chicane would follow the centreline's own jink) - kept on the road
    const filled = raw.slice(), P = (k, d) => tr.sample(k * EVERY, d), lim = tr.halfWidth + 0.6;
    for (let k = 0; k < n; k++) if (raw[k] == null) {
      let a = 1, b = 1; while (raw[(k - a + n) % n] == null && a < n) a++; while (raw[(k + b) % n] == null && b < n) b++;
      const ka = (k - a + n) % n, kb = (k + b) % n, A = P(ka, raw[ka] ?? 0), B = P(kb, raw[kb] ?? raw[ka] ?? 0), f = a / (a + b);
      const x = A.x + (B.x - A.x) * f, z = A.z + (B.z - A.z) * f, c = P(k, 0);
      filled[k] = Math.max(-lim, Math.min(lim, (x - c.x) * c.nx + (z - c.z) * c.nz));
    }
    return { d: filled, hw: tr.halfWidth, max: Math.max(...filled.map(Math.abs)) };
  }, [T.map((t) => ({ x: t.x, z: t.z, d: t.d, joins: t.joins || [] })), EVERY]);
  cal.line = { every: EVERY, d: L.d.map((x) => +x.toFixed(2)) };
  console.log(`[fit] the driver's line: ${L.d.length} points, widest ${L.max.toFixed(1)} m off the centreline (the road's edge at ${L.hw} m)`);
  console.log(`[fit] the AI on it: ${JSON.stringify(await page.evaluate((c) => window.__F1.rebuildLine(c), cal))}`);
  if (args.includes('--lineonly')) {   // (the line's corners as the speed profile sees them, and stop)
    console.log('[fit] ' + await page.evaluate(() => { const F = window.__F1, tr = F.W.track, L = F.W.line, P = F.W.profile; return F.W.def.corners.filter((c) => c.s != null).map((c) => { let m = 1e9, at = 0; for (let s = c.s - 70; s <= c.s + 50; s += tr.ds) { const i = tr.idxAtS(s); if (P[i] < m) { m = P[i]; at = i; } } return `T${c.n} ${Math.round(m * 3.6)} km/h (R ${Math.round(1 / Math.max(1e-5, Math.abs(L.lineCurv[at])))} m)`; }).join(', '); }));
    await close(); process.exit(0);
  }
}
for (let pass = 0; pass < PASSES; pass++) {
if (PASSES > 1) console.log(`[fit] pass ${pass + 1}`);
const ai = await calRun(page, 2, cal, { trace: true, ...RUN });
const apexes = await page.evaluate(() => window.__F1.W.def.corners.filter((c) => c.s != null).map((c) => ({ n: c.n, apex: c.s })));
const aiMean = ai.trace.reduce((a, b) => a + b, 0) / ai.trace.length;
// (the AI's corner as one lap of it, like the telemetry: its laps' minimum speeds and braking points averaged)
const avgOf = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const aiC = Object.fromEntries(ai.corners.map((c) => { const vm = avgOf(c.runs.map((r) => r.vmin)) ?? c.vmin, br = avgOf(c.runs.map((r) => r.brake).filter((x) => x != null)); return [c.n, { vmin: vm, brake: br, relV: vm / aiMean }]; }));
const per = {};
for (const t of T) {
  const al = t.own && t.track === track ? { off: 0, scale: 1, r: null } : align(t, ai.trace, ai.length);
  console.log(`[fit] ${t.label}: ${t.d.length} samples over ${Math.round(t.d[t.d.length - 1] - t.d[0])} m, lined up at ${al.off} m${al.r != null ? ` (shape match ${al.r.toFixed(2)})` : ''}`);
  if (al.r != null && al.r < 0.6) console.warn(`[fit] ${t.label}: the trace does not look like this circuit (match ${al.r.toFixed(2)} < 0.6) - check the track, or give --offset`);
  for (const m of measure(t, al, apexes, ai.length)) (per[m.n] = per[m.n] || []).push(m);
}
const avgBrake = (src) => { const xs = Object.values(src).map((c) => c.brake).filter((x) => x != null); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null; };
const telC = Object.fromEntries(Object.entries(per).map(([n, ms]) => [n, { relV: ms.reduce((a, m) => a + m.relV, 0) / ms.length, brake: ms.some((m) => m.brake != null) ? ms.filter((m) => m.brake != null).reduce((a, m) => a + m.brake, 0) / ms.filter((m) => m.brake != null).length : null, vmin: ms.reduce((a, m) => a + m.vmin, 0) / ms.length }]));
const bT = avgBrake(telC), bA = avgBrake(aiC);
const prev = JSON.parse(JSON.stringify(cal)); const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
console.log('[fit] corner   telemetry vmin / rel   AI vmin / rel    brake tel / AI (m)   v      b');
for (const g of groups) {
  // a group moves together: the mean of its corners' ratios
  const rv = g.map((n) => (telC[n] && aiC[n] ? (ABS ? telC[n].vmin / aiC[n].vmin : telC[n].relV / aiC[n].relV) : 1));
  const rb = g.map((n) => (telC[n]?.brake && aiC[n]?.brake && bT && bA ? (ABS ? aiC[n].brake / telC[n].brake : (aiC[n].brake / bA) / (telC[n].brake / bT)) : 1));
  const fv = rv.reduce((a, b) => a + b, 0) / rv.length, fb = rb.reduce((a, b) => a + b, 0) / rb.length;
  for (const n of g) {
    const k = cal.corners[n];
    k.v = +clamp(k.v * (1 + (fv - 1) * BLEND), LIMV[0], LIMV[1]).toFixed(3); k.b = +clamp(k.b * (1 + (fb - 1) * BLEND), LIMB[0], LIMB[1]).toFixed(3);
    const t = telC[n], a = aiC[n];
    console.log(`[fit] T${String(n).padEnd(3)}   ${t ? `${t.vmin.toFixed(0).padStart(4)} / ${t.relV.toFixed(3)}` : '   -        '}       ${a ? `${a.vmin?.toFixed(0).padStart(4)} / ${a.relV.toFixed(3)}` : '   -'}     ${t?.brake != null ? t.brake.toFixed(0).padStart(4) : '   -'} / ${a?.brake != null ? a.brake.toFixed(0) : '-'}          ${k.v}  ${k.b}`);
  }
}
// the AI drives it: a group that is no longer clean goes halfway back (three tries)
for (let tries = 0; tries < 3; tries++) {
  const R = await calRun(page, 3, cal, RUN); let bad = [];
  for (const g of groups) { const cs = R.corners.filter((c) => g.includes(c.n)); if (cs.some((c) => c.incidents.some((x) => !String(x).startsWith('off')))) {   // (a spin or a hit: a moment over the kerb's edge on the driver's own line is not)
      bad.push(g.join('/')); for (const n of g) for (const key of ['v', 'b']) cal.corners[n][key] = +((cal.corners[n][key] + prev.corners[n][key]) / 2).toFixed(3); } }
  console.log(`[fit] check ${tries + 1}: ${R.laps.slice(1).join(' ')} ${bad.length ? `- not clean at ${bad.join(', ')}, eased back` : '- clean'}`);
  if (!bad.length) break;
  if (tries === 2) {   // (still not clean after three: those groups keep what they had)
    for (const g of groups) if (bad.includes(g.join('/'))) for (const n of g) cal.corners[n] = { ...prev.corners[n] };
    console.log(`[fit] ${bad.join(', ')}: kept as before the fit`);
    // (and the whole is driven once more: not clean even so, the pass is undone)
    const V = await calRun(page, 3, cal, RUN), still = groups.filter((g) => V.corners.filter((c) => g.includes(c.n)).some((c) => c.incidents.some((x) => !String(x).startsWith('off'))));
    if (still.length) { Object.assign(cal.corners, JSON.parse(JSON.stringify(prev.corners))); console.log(`[fit] still not clean at ${still.map((g) => g.join('/')).join(', ')}: this pass undone`); }
    else console.log(`[fit] check: ${V.laps.slice(1).join(' ')} - clean`);
  }
}
}
cal.fitted = `${T.map((t) => t.label).join(', ')} (${new Date().toISOString().slice(0, 10)}, blend ${BLEND})`;
cal.source = LAP ? `the driver's own laps (tools/ai_fit.mjs, lap mode): the racing line shown is ${T[0].label}; the AI on its own line, its corners fitted to that lap's speeds and braking points at difficulty ${RUN.diff} (${cal.fitted.replace(/^.*\((\d{4}-\d\d-\d\d), /, '$1, ').replace(/\)$/, '')})`
  : `${(cal.source || '').replace(/; fitted to telemetry:.*$/, '')}; fitted to telemetry: ${cal.fitted}`;
if (!DRY) { writeCal(track, cal); console.log('[fit] written to src/ai/Calibration.js - rebuild the game (tools/bundle.py) to ship it'); }
else console.log(JSON.stringify(cal.corners));
await close();
