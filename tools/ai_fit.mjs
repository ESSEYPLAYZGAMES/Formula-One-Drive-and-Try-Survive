// Fit the AI to telemetry: each corner's minimum speed and braking point from a real lap (or the fastest of several),
// relative to that lap, carried onto the sim's car - which is not the real car: the fit matches the SHAPE of the lap
// (where it is slow, where it brakes, against its own average) and leaves the sim's overall pace alone.
//
//   node tools/ai_fit.mjs <track> <telemetry file> [more files...] [--offset m] [--blend 0.7] [--dry]
//
// Telemetry it reads:
//   * the game's own export (f1sim-telemetry/2, the T screen's Export button): the fastest valid lap
//   * CSV with a header (FastF1's car_data / get_telemetry() saved with to_csv, a logger, a spreadsheet): columns found
//     by name - Distance (m from the line), Speed (km/h), Brake (0/1, 0-1 or 0-100), Throttle (optional), Lap
//     (optional: the fastest lap is taken, by its own time column if there is one, else the first)
//   * JSON: an array of samples ({ Distance, Speed, Brake } or { d, v, brk }) or an object of channel arrays
// The trace is lined up against the AI's own lap by shape (speed against distance, shifted and stretched to fit the
// sim circuit's length) unless --offset gives the shift. Each corner's speed factor moves by the ratio of the
// telemetry's relative minimum speed to the AI's, its braking factor by the ratio of the braking distances (each
// against the lap's own average), --blend of the way (0.7). Then the AI drives the result: any corner group that
// is no longer clean goes halfway back, up to three times. Written into src/ai/Calibration.js with what it was fitted to.
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
    return use.map((L) => ({ label: `${label} (lap ${L.n}, ${L.time}s)`, d: L.samples.d, v: L.samples.v, b: L.samples.brk, x: L.samples.x, z: L.samples.z, hasBrake: true, track: J.track?.id, own: true }));
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

// ---- the fit -------------------------------------------------------------------------------------------------------
const T = files.flatMap(readTelemetry);
// the game's own car on this circuit (its export): the same car as the AI's, so the fit is absolute - the speeds and
// the braking points themselves, not only the lap's shape (--shape keeps it relative)
const ABS = !args.includes('--shape') && T.every((t) => t.own && t.track === track);
const PASSES = opt('passes', ABS ? 2 : 1), LIMV = ABS ? [0.9, 1.25] : [0.9, 1.1], LIMB = ABS ? [0.85, 1.15] : [0.85, 1.15];   // (braking: later than 1.15 x the physics' point holds solo, but in a field - dirty air, mistakes on - the hairpin became a pile-up)
if (ABS) console.log(`[fit] ${T.length} lap(s) of the game's own car on ${track}: fitting the speeds and braking points themselves, ${PASSES} passes`);
const { page, close } = await openGame(track);
const cal = await readCal(page, track); cal.corners = cal.corners || {};
const groups = await groupsOf(page);
for (const g of groups) for (const n of g) cal.corners[n] = { v: 1, b: 1, ...cal.corners[n] };
// the driver's own line (the game's car, with positions): where on the road each lap was, every 5 m, averaged over the
// laps; it becomes the AI's racing line (ai/Calibration.js `line`, RacingLine `fixed`) - the kerbs the driver rides, the
// chicanes straightened - and the speeds and brakes are fitted on it. --noline keeps the AI's own line
if (ABS && !args.includes('--noline') && T.every((t) => t.x?.length)) {
  const L = await page.evaluate((laps) => {
    const tr = window.__F1.W.track, n = Math.ceil(tr.length / 5), sum = new Float64Array(n), cnt = new Float64Array(n), q = {};
    for (const lap of laps) { let hint = -1; for (let i = 0; i < lap.x.length; i++) { tr.nearest(lap.x[i], lap.z[i], hint, q); hint = q.i; const k = Math.floor(q.s / 5) % n; sum[k] += q.d; cnt[k]++; } }
    const d = []; for (let k = 0; k < n; k++) d.push(cnt[k] ? sum[k] / cnt[k] : null);
    for (let k = 0; k < n; k++) if (d[k] == null) { let a = 1; while (d[(k - a + n) % n] == null && a < n) a++; d[k] = d[(k - a + n) % n] ?? 0; }
    return { d, hw: tr.halfWidth, max: Math.max(...d.map(Math.abs)) };
  }, T.map((t) => ({ x: t.x, z: t.z })));
  cal.line = { every: 5, d: L.d.map((x) => +x.toFixed(2)) };
  console.log(`[fit] the driver's line: ${L.d.length} points, widest ${L.max.toFixed(1)} m off the centreline (the road's edge at ${L.hw} m)`);
  console.log(`[fit] the AI on it: ${JSON.stringify(await page.evaluate((c) => window.__F1.rebuildLine(c), cal))}`);
}
for (let pass = 0; pass < PASSES; pass++) {
if (PASSES > 1) console.log(`[fit] pass ${pass + 1}`);
const ai = await calRun(page, 2, cal, { trace: true });
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
  const R = await calRun(page, 3, cal); let bad = [];
  for (const g of groups) { const cs = R.corners.filter((c) => g.includes(c.n)); if (cs.some((c) => c.incidents.length)) { bad.push(g.join('/')); for (const n of g) for (const key of ['v', 'b']) cal.corners[n][key] = +((cal.corners[n][key] + prev.corners[n][key]) / 2).toFixed(3); } }
  console.log(`[fit] check ${tries + 1}: ${R.laps.slice(1).join(' ')} ${bad.length ? `- not clean at ${bad.join(', ')}, eased back` : '- clean'}`);
  if (!bad.length) break;
  if (tries === 2) {   // (still not clean after three: those groups keep what they had)
    for (const g of groups) if (bad.includes(g.join('/'))) for (const n of g) cal.corners[n] = { ...prev.corners[n] };
    console.log(`[fit] ${bad.join(', ')}: kept as before the fit`);
  }
}
}
cal.fitted = `${T.map((t) => t.label).join(', ')} (${new Date().toISOString().slice(0, 10)}, blend ${BLEND})`;
cal.source = `${(cal.source || '').replace(/; fitted to telemetry:.*$/, '')}; fitted to telemetry: ${cal.fitted}`;
if (!DRY) { writeCal(track, cal); console.log('[fit] written to src/ai/Calibration.js - rebuild the game (tools/bundle.py) to ship it'); }
else console.log(JSON.stringify(cal.corners));
await close();
