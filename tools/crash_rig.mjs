// The barrier crash rig (tools/harness.js __crashRig) in a headless browser: every barrier kind x speed x angle, a table
// on stdout, the rows as JSON to the file named (optional).
//   node tools/crash_rig.mjs [out.json] [seeds]
import fs from 'fs';
import { openGame } from './ai_lib.mjs';

const out = process.argv[2], seeds = +(process.argv[3] || 3);
const g = await openGame('lasvegas');
try {
  await g.page.evaluate(() => { const F = window.__F1; F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = 3; F.restart(); });
  const rows = await g.page.evaluate((n) => window.__crashRig({ seeds: n }), seeds);
  const pad = (x, w) => String(x ?? '-').padStart(w);
  console.log('kind   km/h deg  vN   g(avg/max) force  E/kJ  ms  vEnd vFin  sev  flew roll split out  pInj  pDeath  damage / lost');
  for (const r of rows) console.log(`${r.kind.padEnd(6)} ${pad(r.kmh, 4)} ${pad(r.deg, 3)} ${pad(r.uN, 4)} ${pad(r.g, 6)}/${pad(r.gMax, 5)} ${pad(r.peakF, 5)} ${pad(r.Ekj, 5)} ${pad(r.ms, 4)} ${pad(r.vEnd, 4)} ${pad(r.vFin, 4)} ${pad(r.sev, 4)}  ${r.flew}/${r.n}  ${r.rolled}/${r.n}  ${r.split}/${r.n}  ${r.out}/${r.n} ${pad(r.pInj, 5)} ${pad(r.pDeath, 7)}  ${r.dmg} | ${r.lost} ${r.why ? '(' + r.why + ')' : ''}`);
  if (out) fs.writeFileSync(out, JSON.stringify(rows, null, 1));
} finally { await g.close(); }
