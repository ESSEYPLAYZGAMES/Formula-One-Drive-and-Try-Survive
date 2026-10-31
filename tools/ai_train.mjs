// Train the AI on a circuit: corner by corner, how much faster or slower than the physics' limit it should take each
// corner (v) and how late it should brake for it (b), from headless laps of one AI car alone (tools/harness.js
// __calRun: seeded, mistakes off, no safety car or failures). Corners that share a corner zone (a chicane's two turns)
// move together.
//   1. clean: a group where the car goes off, spins or hits something comes back (slower, earlier on the brakes)
//      until it doesn't
//   2. explore: every group a step faster and a step slower in the same run; a group keeps a step that made its window
//      quicker by more than the run-to-run noise AND stayed clean; a run with the kept steps confirms them (a group
//      that is not clean in it goes back); the steps shrink
//   3. pace (--target s): one factor on every corner's speed so the flying lap comes to the target - the shape found
//      above, at the pace this circuit should have against the others
// A margin comes off whatever went past the physics (the car trained alone, on fresh softs, without mistakes), and the
// result is written into src/ai/Calibration.js.
//   node tools/ai_train.mjs montreal [--target 76.0] [--laps 3] [--dry]
import { openGame, calRun, readCal, writeCal, groupsOf } from './ai_lib.mjs';

const args = process.argv.slice(2), track = args.find((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--') && args[i - 1] !== '--dry'));
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? +args[i + 1] : d; };
const LAPS = opt('laps', 3), TARGET = opt('target', null), DRY = args.includes('--dry'), MARGIN = 0.006;
const LIM = { v: [0.9, 1.08], b: [0.82, 1.12] };

const { page, close } = await openGame(track || 'montreal');
const cal = await readCal(page, track); cal.corners = cal.corners || {};
const groups = await groupsOf(page);
for (const g of groups) for (const n of g) cal.corners[n] = { ...cal.corners[n], v: cal.corners[n]?.v ?? 1, b: cal.corners[n]?.b ?? 1 };
const clone = (c) => JSON.parse(JSON.stringify(c));
const set = (c, g, key, f) => { for (const n of g) { const k = c.corners[n]; k[key] = +Math.max(LIM[key][0], Math.min(LIM[key][1], k[key] * f)).toFixed(4); } };
const G = (R, g) => { const cs = R.corners.filter((c) => g.includes(c.n)); return { t: cs.reduce((a, c) => a + (c.t ?? 99), 0), clean: cs.every((c) => !c.incidents.length && c.runs.length >= LAPS - 1), inc: cs.flatMap((c) => c.incidents) }; };
const flying = (R) => { const L = R.laps.slice(1, LAPS + 1); return L.length ? L.reduce((a, b) => a + b, 0) / L.length : Infinity; };
const say = (m) => console.log(`[train] ${m}`);
const run = (c) => calRun(page, LAPS, c);

// ---- 0: where it stands, and how much a run varies by itself
let base = await run(cal), again = await run(cal);
const noise = Object.fromEntries(groups.map((g) => [g.join('/'), Math.max(0.02, 1.5 * Math.abs(G(base, g).t - G(again, g).t))]));
const start = flying(base);
say(`${track}: start ${base.laps.join(' ')} (${base.events.join(', ') || 'clean'}); noise ${Object.values(noise).map((x) => x.toFixed(2)).join(' ')}`);

// ---- 1: clean
for (let it = 0; it < 8; it++) {
  const bad = groups.filter((g) => !G(base, g).clean || !G(again, g).clean);
  if (!bad.length) break;
  for (const g of bad) { set(cal, g, 'v', 0.985); set(cal, g, 'b', 0.96); }
  say(`clean ${it + 1}: ${bad.map((g) => `${g.join('/')} (${[...G(base, g).inc, ...G(again, g).inc].join(' ')})`).join(', ')} -> slower`);
  base = await run(cal); again = await run(cal);
}

// ---- 2: explore
for (const [key, steps] of [['v', [0.025, 0.012]], ['b', [0.05, 0.025]], ['v', [0.006]]]) {
  for (const d of steps) for (const dir of [1, -1]) {
    const trial = clone(cal); for (const g of groups) set(trial, g, key, 1 + dir * d);
    const R = await run(trial), kept = [], before = clone(cal);
    for (const g of groups) { const a = G(base, g), b = G(R, g); if (b.clean && a.t - b.t > noise[g.join('/')]) { for (const n of g) cal.corners[n][key] = trial.corners[n][key]; kept.push(g); } }
    if (kept.length) {
      const C = await run(cal), undone = [];
      for (const g of kept) if (!G(C, g).clean) { for (const n of g) cal.corners[n][key] = before.corners[n][key]; undone.push(g.join('/')); }
      base = undone.length ? await run(cal) : C;
      say(`${key} ${dir > 0 ? '+' : '-'}${d}: kept ${kept.map((g) => g.join('/')).join(' ')}${undone.length ? ` (undone: ${undone.join(' ')})` : ''} -> ${base.laps.slice(1, LAPS + 1).join(' ')}`);
    } else say(`${key} ${dir > 0 ? '+' : '-'}${d}: nothing kept`);
  }
}

// ---- the margin, then 3: the pace
for (const n of Object.keys(cal.corners)) { const k = cal.corners[n]; if (k.v > 1) k.v = +Math.max(1, k.v - MARGIN).toFixed(4); if (k.b > 1) k.b = +Math.max(1, k.b - 2 * MARGIN).toFixed(4); }
base = await run(cal);
if (TARGET) {
  for (let it = 0; it < 4; it++) {
    const lap = flying(base), f = Math.pow(lap / TARGET, 1 / 0.7);   // (a lap gets about 0.7 % quicker for every 1 % of corner speed)
    if (Math.abs(lap - TARGET) < 0.15) break;
    const trial = clone(cal); for (const g of groups) set(trial, g, 'v', Math.max(0.97, Math.min(1.03, f)));
    const R = await run(trial), bad = groups.filter((g) => !G(R, g).clean);
    say(`pace ${it + 1}: ${lap.toFixed(2)} s -> x${f.toFixed(3)} -> ${flying(R).toFixed(2)} s${bad.length ? ` (not clean at ${bad.map((g) => g.join('/')).join(' ')}: kept as it was)` : ''}`);
    if (bad.length) break;
    Object.assign(cal, trial); base = R;
  }
}
const fin = await run(cal), end = flying(fin);
cal.source = `trained: tools/ai_train.mjs (${new Date().toISOString().slice(0, 10)}), seeded ${LAPS}-lap solo runs, mistakes off${TARGET ? `, pace target ${TARGET} s` : ''}; flying lap ${start.toFixed(2)} s -> ${end.toFixed(2)} s${cal.fitted ? `; fitted to telemetry: ${cal.fitted}` : ''}`;
say(`done: ${start.toFixed(3)} -> ${end.toFixed(3)} s, ${fin.events.join(', ') || 'clean'}`);
console.log(JSON.stringify(cal.corners));
if (!DRY) { writeCal(track, cal); say('written to src/ai/Calibration.js'); }
await close();
