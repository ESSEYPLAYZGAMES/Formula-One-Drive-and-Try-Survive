// Walls that come in: on every stretch of a circuit where a barrier's line closes toward the road along the lap (a
// run-off narrowing, a wall's return), a car is set down against the wide part of it and let roll along it at two
// speeds, both ways round. A car that ends with its centre beyond the barrier has been let through it.
//   node tools/pocket_probe.mjs <track ...>
import { openGame } from './ai_lib.mjs';
let bad = 0, runs = 0;
for (const track of process.argv.slice(2)) {
  const g = await openGame(track);
  try {
    const spots = await g.page.evaluate(() => {
      const tr = window.__F1.W.track, n = tr.n, ds = tr.length / n, res = [];
      for (const [side, wall, bar] of [[1, tr.wallL, tr.barL], [-1, tr.wallR, tr.barR]]) for (const dir of [1, -1]) {
        if (window.__F1.W.pit && side === window.__F1.W.pit.sideSign) continue;   // (the pit lane's side: its own walls stand there, not these)
        let run = null;
        for (let q = 0; q <= n; q++) {
          const a = ((dir > 0 ? q : -q) % n + n) % n, b = (a + dir + n) % n, wa = bar[a] ? wall[a] : 999, wb = bar[b] ? wall[b] : 999, d = wa - wb;
          if (d > 0.02 * ds && wb < 900 && wa < 900) { if (!run) run = { side, dir, i0: a, from: wa, max: 0 }; run.max = Math.max(run.max, d / ds); run.to = wb; }
          else if (run) { if (run.from - run.to > 2.5 && run.max > 0.15 && run.from < 60) res.push(run); run = null; }   /* (a barrier 60 m and more from the road: the far side of a paddock, not a run-off) */
        }
      }
      return res.map((r) => ({ ...r, s: +(r.i0 * ds).toFixed(0) }));
    });
    const rows = []; let k = 0;
    for (const sp of spots) for (const kmh of [60, 170]) {
      const r = await g.page.evaluate(([sp, kmh, fresh]) => {
        const F = window.__F1;
        // (one field for twenty runs, a car of it for each: a race is slow to start)
        if (fresh) { F.settings.sc = 'off'; F.settings.fail = 'off'; window.__race.start(1); F.S.paused = true; const d0 = F.S.director; window.__pool = d0.cars.filter((x) => !x.isPlayer); for (const o of d0.cars) o.ghost = 1e9; d0.ai = []; F.stepSim(12, 1 / 30); }   /* (past the lights: before them nobody moves) */   /* (the rest of the field: ghosts on the grid, nobody driving them) */
        const d = F.S.director, tr = d.track, n = tr.n, ds = tr.length / n, c = window.__pool.pop();
        c.ghost = 0;   /* (a ghost meets no barrier) */
        const i0 = ((sp.i0 - sp.dir * Math.round(14 / ds)) % n + n) % n, lat = (tr.wallAt(i0, sp.side) - 2.2) * sp.side;
        c.placeOnTrack(tr.s ? tr.s[i0] : i0 * ds, 0, 0);
        // (set down by hand: beside the barrier, along the lap or against it)
        c.x = tr.px[i0] + tr.nx[i0] * lat; c.z = tr.pz[i0] + tr.nz[i0] * lat; c.th = Math.atan2(tr.tz[i0] * sp.dir, tr.tx[i0] * sp.dir); c.vLong = kmh / 3.6; c.vLat = 0; c.r = 0; if (c._over) c._over.ok = false;
        let worst = -99, g = 0, end = 0, es = 0, kmhE = 0, air = 0;
        for (let q = 0; q < 45; q++) {
          F.stepSim(0.1, 1 / 120);
          const i = c.trackIdx, dc = (c.x - tr.px[i]) * tr.nx[i] + (c.z - tr.pz[i]) * tr.nz[i], w = dc > 0 ? (tr.barL[i] ? tr.wallL[i] : 999) : (tr.barR[i] ? tr.wallR[i] : 999);
          worst = Math.max(worst, Math.abs(dc) - w); g = Math.max(g, c.lastHit?.g || 0);
          end = Math.abs(dc) - w; es = Math.round(i * ds); kmhE = Math.round(c.speedKmh || 0); air = c.air || c.wreck ? 1 : 0;
        }
        c.ghost = 1e9; c.vLong = 0; c.vLat = 0;
        return { end: +end.toFixed(1), worst: +worst.toFixed(1), es, kmhE, g: Math.round(g), air };
      }, [sp, kmh, k % 20 === 0]);
      k++; runs++; const out = r.end > 1.3 && !r.air; if (out) bad++;
      rows.push(`${out ? 'THROUGH' : '   ok  '} ${sp.side > 0 ? 'L' : 'R'} ${sp.dir > 0 ? '->' : '<-'} @${sp.s}m wall ${sp.from.toFixed(0)}->${sp.to.toFixed(0)} (${sp.max.toFixed(2)} m/m) at ${kmh}: ends ${r.end} m past it @${r.es}m, ${r.kmhE} km/h, ${r.g} g${r.air ? ' (in the air)' : ''}`);
    }
    console.log(`== ${track}: ${spots.length} narrowing stretches`); for (const x of rows) if (process.env.ALL || x.startsWith('THROUGH')) console.log('  ' + x);
  } finally { await g.close(); }
}
console.log(`RESULT ${bad} of ${runs} runs let a car through a barrier`);
