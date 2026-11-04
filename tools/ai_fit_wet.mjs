// Fit the AI to wet laps: the game's own telemetry from a race on a wet track (f1sim-telemetry/2, its settings.wetness
// above 0.15) - each corner's minimum speed and braking point as the driver took it in the wet, against the AI's own
// in the same water on intermediates - into the circuit's wet calibration (ai/Calibration.js `wet: { at, corners }`).
// The dry calibration is fitted to dry laps and fades out as the track gets wet (AIDriver: calW); the wet one fades in
// by how wet the line is against the wetness it was fitted at (calWet), so a drying track goes from one to the other.
//
//   node tools/ai_fit_wet.mjs <track> <telemetry file> [more files...] [--blend 0.7] [--laps 3] [--dry]
//
//  1. the telemetry: every lap as driven after its flashbacks (a rewound attempt dropped), and through each numbered
//     corner's window (apex - 220 m .. apex + 50 m) only the passes that stayed on the road (no grass or gravel), were
//     not rewound there and are not the standing start; per corner the second-best clean pass (the best if there are
//     fewer than three) - its minimum speed, and where the brake first went past 0.3 before the apex;
//  2. the AI alone on the same circuit at the same wetness, on inters, mistakes off (tools/harness.js __calRun):
//     the same two numbers per corner, with no wet calibration;
//  3. per corner: v = the driver's minimum speed over the AI's, b = the AI's braking distance over the driver's (a
//     later stop: b above 1), each pulled toward 1 by --blend and held to 0.85 .. 1.2;
//  4. driven: a corner where the AI then goes off or spins has its numbers halved back toward 1, and is driven again;
//  5. written into the circuit's block in src/ai/Calibration.js (between its // <cal:track> markers - a new block if
//     the circuit has none) as `wet`, the rest of the block untouched. --dry: printed, not written.
import fs from 'fs';
import path from 'path';
import { openGame, calRun, ROOT } from './ai_lib.mjs';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? +args[i + 1] : d; };
const files = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--') && args[i - 1] !== '--dry'));
const track = files.shift(), BLEND = opt('blend', 0.7), LAPS = opt('laps', 3), DRY = args.includes('--dry');
if (!track || !files.length) { console.log('usage: node tools/ai_fit_wet.mjs <track> <telemetry file> [...] [--blend 0.7] [--laps 3] [--dry]'); process.exit(1); }

// ---- 1. the telemetry ----------------------------------------------------------------------------------------------
function unrewind(S) {
  const keep = [], d = S.d, joins = [];
  for (let i = 0; i < d.length; i++) {
    if (keep.length && d[i] < d[keep[keep.length - 1]] - 3) { joins.push(d[i]); while (keep.length && d[keep[keep.length - 1]] >= d[i] - 0.5) keep.pop(); }
    keep.push(i);
  }
  const out = { joins }; for (const k of Object.keys(S)) out[k] = keep.map((i) => S[k][i]); return out;
}
const passes = new Map(); let wetness = null, corners = null, used = [];
for (const f of files) {
  const J = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!String(J.format || '').startsWith('f1sim-telemetry')) { console.log(`${path.basename(f)}: not the game's telemetry, skipped`); continue; }
  if (J.track?.id !== track) { console.log(`${path.basename(f)}: ${J.track?.id}, not ${track}, skipped`); continue; }
  const w = J.settings?.wetness ?? 0;
  if (w < 0.15) { console.log(`${path.basename(f)}: a dry race (wetness ${w}), skipped`); continue; }
  wetness = wetness == null ? w : Math.min(wetness, w); corners = J.track.corners.filter((c) => c.s != null); used.push(`${path.basename(f)} (wetness ${w}, ${J.laps.length} laps)`);
  for (const L of J.laps) {
    if (!L.samples?.d?.length) continue;
    const S = unrewind(L.samples), n = S.d.length;
    for (const c of corners) {
      const a = c.s - 220, b = c.s + 50; if (a < 0 && L.n === 1) continue;   // (the standing start: not a corner taken at racing speed)
      if (S.joins.some((j) => j > a - 100 && j < b + 20)) continue;          // (rewound there)
      let vmin = Infinity, iMin = -1, brake = null, off = false, k = 0, i0 = -1;
      for (let i = 0; i < n; i++) {
        const x = S.d[i]; if (x < a || x > b) continue; k++; if (i0 < 0) i0 = i;
        if ((S.surf?.[i] ?? 0) >= 2) off = true;
        if (x >= c.s - 70 && S.v[i] < vmin) { vmin = S.v[i]; iMin = i; }
      }
      // (the stop into this corner: back from its slowest point through the braking run to where the pedal went
      //  past 0.3 - a run that goes back past the window's start is a stop for something before it: no point)
      if (iMin > 0) {
        let j = iMin; while (j > i0 && S.brk[j] <= 0.3 && S.v[j - 1] >= S.v[j] - 0.3 && S.d[iMin] - S.d[j] < 90) j--;
        if (S.brk[j] > 0.3) { while (j > i0 && S.brk[j - 1] > 0.3) j--; if (j > i0 + 2) brake = c.s - S.d[j]; }
      }
      if (off || k < 15 || !isFinite(vmin)) continue;
      if (!passes.has(c.n)) passes.set(c.n, []);
      passes.get(c.n).push({ lap: L.n, vmin, brake, file: path.basename(f) });
    }
  }
}
if (!corners) { console.log('no wet laps of this circuit in those files'); process.exit(1); }
const T = {};
for (const [n, P] of passes) { P.sort((x, y) => y.vmin - x.vmin); const p = P[P.length >= 3 ? 1 : 0]; T[n] = { ...p, of: P.length }; }
console.log(`wet laps at ${track}, wetness ${wetness}: ${used.join('; ')}`);
for (const c of corners) console.log(`  T${c.n} ${c.name || ''}: ${T[c.n] ? `${T[c.n].vmin.toFixed(1)} km/h, brake ${T[c.n].brake?.toFixed(0) ?? '-'} m (lap ${T[c.n].lap}, ${T[c.n].of} clean passes)` : 'no clean pass'}`);

// ---- 2-4. the AI in the same water ---------------------------------------------------------------------------------
const G = await openGame(track);
const page = G.page;
const own = await page.evaluate((t) => JSON.parse(JSON.stringify(window.__F1.AI_CAL[t] || null)), track);
const base = own ? { ...own } : { corners: {} }; delete base.wet;
const run = (wet) => calRun(page, LAPS, { ...base, ...(wet ? { wet } : {}) }, { weather: 'damp', wetness, tyre: 'INTER', diff: 100, fresh: true });
const A = await run(null);
console.log(`AI alone, no wet calibration: laps ${A.laps.join(', ')}  ${A.events.join(' ') || 'clean'}`);
const fit = {}, clamp = (x) => Math.max(0.85, Math.min(1.2, x));
for (const c of A.corners) {
  const t = T[c.n]; if (!t || c.vmin == null) continue;
  const v = clamp(1 + (t.vmin / c.vmin - 1) * BLEND);
  const b = t.brake > 15 && c.brake > 15 && c.brake < 212 ? clamp(1 + (c.brake / t.brake - 1) * BLEND) : 1;
  fit[c.n] = { v: +v.toFixed(3), b: +b.toFixed(3) };
  console.log(`  T${c.n}: AI ${c.vmin} km/h brake ${c.brake ?? '-'} m | driver ${t.vmin.toFixed(1)} / ${t.brake?.toFixed(0) ?? '-'} -> v ${fit[c.n].v} b ${fit[c.n].b}`);
}
// (then driven, ROUNDS times: each corner's minimum speed as the AI now takes it against the driver's, the number moved
//  half the rest of the way - a corner whose speed the planner's other limits hold back gets pushed further, to 1.25 -
//  and a corner that went off or spun halved back toward 1; the quickest clean round is kept)
const ROUNDS = opt('rounds', 3), lift = (x) => Math.max(0.85, Math.min(1.25, x)), lapOf = (L) => (L?.length > 1 ? Math.min(...L.slice(1)) : Infinity);
let wet = { at: wetness, source: '', corners: fit }, R = null, keep = null;
for (let round = 0; round < ROUNDS; round++) {
  R = await run(wet);
  console.log(`with the wet calibration (round ${round + 1}): laps ${R.laps.join(', ')}  ${R.events.join(' ') || 'clean'}`);
  const bad = R.corners.filter((c) => c.incidents.length && fit[c.n]);
  if (!bad.length && (!keep || lapOf(R.laps) < lapOf(keep.R.laps))) keep = { R, corners: JSON.parse(JSON.stringify(fit)) };
  for (const c of bad) { const k = fit[c.n]; k.v = +(1 + (k.v - 1) * 0.5).toFixed(3); k.b = +(1 + (k.b - 1) * 0.5).toFixed(3); console.log(`  T${c.n}: ${c.incidents.join(' ')} -> v ${k.v} b ${k.b}`); }
  if (round < ROUNDS - 1) for (const c of R.corners) {
    const t = T[c.n], k = fit[c.n]; if (!t || !k || c.vmin == null || bad.includes(c)) continue;
    k.v = +lift(k.v * (1 + (t.vmin / c.vmin - 1) * 0.5)).toFixed(3);
  }
}
if (keep) { wet.corners = keep.corners; R = keep.R; }
console.log(`kept: laps ${R.laps.join(', ')}`);
await G.close();
const best = (L) => (L?.length ? Math.min(...L.slice(1).length ? L.slice(1) : L) : null);
wet.source = `the driver's wet laps (tools/ai_fit_wet.mjs): ${used.join('; ')}; inters, the AI alone at wetness ${wetness}: ${best(A.laps)?.toFixed(2)} s -> ${best(R.laps)?.toFixed(2)} s (${new Date().toISOString().slice(0, 10)}, blend ${BLEND})`;
console.log(wet.source);

// ---- 5. written ----------------------------------------------------------------------------------------------------
const fmt = (o) => '{ ' + Object.entries(o).map(([k, v]) => `${k}: ${v}`).join(', ') + ' }';
const wetTxt = `    wet: {\n      at: ${wet.at},\n      source: ${JSON.stringify(wet.source)},\n      corners: {\n${Object.keys(wet.corners).sort((a, b) => a - b).map((n) => `        ${n}: ${fmt(wet.corners[n])},`).join('\n')}\n      },\n    },\n`;
if (DRY) { console.log(wetTxt); process.exit(0); }
const FILE = path.join(ROOT, 'src', 'ai', 'Calibration.js');
let src = fs.readFileSync(FILE, 'utf8');
const re = new RegExp(`(  // <cal:${track}>[\\s\\S]*?)(  },\\n  // </cal:${track}>)`);
if (re.test(src)) {
  src = src.replace(re, (all, body, end) => body.replace(/    wet: \{\n[\s\S]*?\n    \},\n$/, '') + wetTxt + end);
} else {
  const block = `  // <cal:${track}>\n  ${track}: {\n    source: "no dry calibration: the physics alone in the dry",\n    corners: {},\n${wetTxt}  },\n  // </cal:${track}>`;
  src = src.replace('export const AI_CAL = {\n', `export const AI_CAL = {\n${block}\n`);
}
fs.writeFileSync(FILE, src);
console.log(`written: src/ai/Calibration.js (${track}.wet)`);
