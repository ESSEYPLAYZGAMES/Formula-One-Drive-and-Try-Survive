// 22-car races, seeded, on one or more circuits: retirements (and why), cars launched / torn in two, drivers hurt, and
// every barrier impact over 0.3 severity with the cars within 40 m of it at that moment (RaceDirector.impactLog).
//   node tools/race_probe.mjs [laps] [seeds] [track ...]      e.g.  node tools/race_probe.mjs 5 3 lasvegas silverstone
// (SEED0=n: the seeds start at n.) Each retirement is put down to the last thing the car hit in the 10 s before it: a
// barrier (its kind and the g it felt), another car, or nothing (gravel, a roll, a failure).
import { openGame } from './ai_lib.mjs';

const laps = +(process.argv[2] || 5), seeds = +(process.argv[3] || 2), tracks = process.argv.slice(4).length ? process.argv.slice(4) : ['lasvegas', 'silverstone', 'montreal', 'austin'];
const all = [], SEED0 = +(process.env.SEED0 || 0);
for (const track of tracks) {
  const g = await openGame(track);
  try {
    for (let sd = SEED0; sd < SEED0 + seeds; sd++) {
      await g.page.evaluate(([laps, seed]) => {
        // (seeded only while the probe steps the race - __seeded: the renderer between the chunks draws from the browser's own
        //  generator, so how many frames ran in between cannot shift the race's stream)
        window.__seedX = 20260615 + seed * 7919;
        window.__seeded = (fn) => { const R = Math.random; Math.random = () => ((window.__seedX = (window.__seedX * 16807) % 2147483647) / 2147483647); try { return fn(); } finally { Math.random = R; } };
        const F = window.__F1; F.settings.sc = 'off'; F.settings.weather = 'dry'; F.settings.fail = 'off';
        window.__seeded(() => window.__race.start(laps)); const d = F.S.director; d.impactLog = [];
        F.S.paused = true;   // (the game's own frame loop must not step the race in wall-clock time between the chunks: seeded runs repeat exactly)
        // (each barrier hit: who was round it)
        window.__near = [];
        const oi = d.onImpact.bind(d);
        window.__last = new Map(); window.__out = [];
        d.onImpact = (c, sev, type) => { if (sev > 0.05) { const L = window.__last.get(c) || {}; L[type === 'wall' ? 'wall' : 'car'] = { t: d.time, g: c.lastHit?.g || 0, kind: type === 'wall' ? (c.lastHit?.kind || 'wall') : 'car' }; window.__last.set(c, L); }
          if (type === 'wall' && sev > 0.3) window.__near.push({ t: +d.time.toFixed(1), car: c.short, s: Math.round(c.s), sev: +sev.toFixed(2), kmh: Math.round(c.speedKmh), g: +(c.lastHit?.g || 0).toFixed(0), kind: c.lastHit?.kind || '?', near: d.cars.filter((o) => o !== c && !o.isPlayer && Math.hypot(o.x - c.x, o.z - c.z) < 40).map((o) => o.short).join(',') }); return oi(c, sev, type); };
      }, [laps, sd]);
      for (let k = 0; k < 400; k++) {
        const done = await g.page.evaluate(() => {
          window.__seeded(() => window.__race.run(6)); const d = window.__F1.S.director;
          // (a car that has just retired: the last thing it hit, within 10 s)
          for (const c of d.cars) if (c.retired && !c.isPlayer && !c.__seen) {
            c.__seen = true; const L = window.__last.get(c) || {}, w = L.wall && d.time - L.wall.t < 10 ? L.wall : null, cc = L.car && d.time - L.car.t < 10 ? L.car : null;
            const by = w && (!cc || w.t >= cc.t) ? `barrier:${w.kind}` : cc ? 'car' : 'none';
            window.__out.push({ car: c.short, why: c.retireReason, s: Math.round(c.s), by, g: +(c.peakG || 0).toFixed(0) });
          }
          return d.done;
        });
        if (done) break;
      }
      const r = await g.page.evaluate(() => {
        const d = window.__F1.S.director, ai = d.cars.filter((c) => !c.isPlayer), rep = window.__race.report();
        return { track: rep.track, t: rep.t, done: rep.done, retired: ai.filter((c) => c.retired).map((c) => `${c.short}:${c.retireReason}@${Math.round(c.s)}${c.peakG ? ' ' + c.peakG.toFixed(0) + 'g' : ''}`),
          launched: ai.filter((c) => c._flew).length, split: ai.filter((c) => c.split).length, hurt: ai.filter((c) => c.injured).length, maxG: Math.max(0, ...ai.map((c) => c.peakG || 0)).toFixed(0),
          spins: rep.spins, airborne: rep.airborne, hits: rep.damagingHits, wallHits: window.__near.length, near: window.__near.slice(0, 25), outs: window.__out };
      });
      r.seed = sd; all.push(r);
      console.log(`${r.track} seed ${sd}: t ${r.t}s ${r.done ? 'finished' : 'unfinished'}  retired ${r.retired.length} [${r.retired.join(' | ')}]  launched ${r.launched} split ${r.split} hurt ${r.hurt} maxG ${r.maxG}  spins ${r.spins} carHits ${r.hits} wallHits ${r.wallHits}`);
      for (const o of r.outs) console.log(`    OUT ${o.car} ${o.why} @${o.s} ${o.g}g  by ${o.by}`);
      for (const n of r.near) console.log(`    ${n.t}s ${n.car}@${n.s} ${n.kmh}km/h sev ${n.sev} ${n.g}g ${n.kind} near[${n.near}]`);
    }
  } finally { await g.close(); }
}
const by = {};
for (const r of all) { const b = (by[r.track] = by[r.track] || { races: 0, retired: 0, byBarrier: 0, byCar: 0, byNone: 0, launched: 0, split: 0, hurt: 0, wallHits: 0 }); b.races++; b.retired += r.retired.length; b.launched += r.launched; b.split += r.split; b.hurt += r.hurt; b.wallHits += r.wallHits; for (const o of r.outs) { if (o.by.startsWith('barrier')) b.byBarrier++; else if (o.by === 'car') b.byCar++; else b.byNone++; } }
console.log('SUMMARY', JSON.stringify(by));
