// 22-car races, seeded, on one or more circuits: retirements (and why), cars launched / torn in two, drivers hurt, and
// every barrier impact over 0.3 severity with the cars within 40 m of it at that moment (RaceDirector.impactLog).
//   node tools/race_probe.mjs [laps] [seeds] [track ...]      e.g.  node tools/race_probe.mjs 5 3 lasvegas silverstone
import { openGame } from './ai_lib.mjs';

const laps = +(process.argv[2] || 5), seeds = +(process.argv[3] || 2), tracks = process.argv.slice(4).length ? process.argv.slice(4) : ['lasvegas', 'silverstone', 'montreal', 'austin'];
const all = [];
for (const track of tracks) {
  const g = await openGame(track);
  try {
    for (let sd = 0; sd < seeds; sd++) {
      await g.page.evaluate(([laps, seed]) => {
        let x = 20260615 + seed * 7919; window.__rand0 = window.__rand0 || Math.random; Math.random = () => ((x = (x * 16807) % 2147483647) / 2147483647);
        const F = window.__F1; F.settings.sc = 'off'; F.settings.weather = 'dry'; F.settings.fail = 'off';
        window.__race.start(laps); const d = F.S.director; d.impactLog = [];
        // (each barrier hit: who was round it)
        window.__near = [];
        const oi = d.onImpact.bind(d);
        d.onImpact = (c, sev, type) => { if (type === 'wall' && sev > 0.3) window.__near.push({ t: +d.time.toFixed(1), car: c.short, s: Math.round(c.s), sev: +sev.toFixed(2), kmh: Math.round(c.speedKmh), g: +(c.lastHit?.g || 0).toFixed(0), kind: c.lastHit?.kind || '?', near: d.cars.filter((o) => o !== c && !o.isPlayer && Math.hypot(o.x - c.x, o.z - c.z) < 40).map((o) => o.short).join(',') }); return oi(c, sev, type); };
      }, [laps, sd]);
      let t = 0; for (let k = 0; k < 40; k++) { t = await g.page.evaluate(() => window.__race.run(60)); if (await g.page.evaluate(() => window.__F1.S.director.done)) break; }
      const r = await g.page.evaluate(() => {
        const d = window.__F1.S.director, ai = d.cars.filter((c) => !c.isPlayer), rep = window.__race.report();
        return { track: rep.track, t: rep.t, done: rep.done, retired: ai.filter((c) => c.retired).map((c) => `${c.short}:${c.retireReason}@${Math.round(c.s)}${c.peakG ? ' ' + c.peakG.toFixed(0) + 'g' : ''}`),
          launched: ai.filter((c) => c._flew).length, split: ai.filter((c) => c.split).length, hurt: ai.filter((c) => c.injured).length, maxG: Math.max(0, ...ai.map((c) => c.peakG || 0)).toFixed(0),
          spins: rep.spins, airborne: rep.airborne, hits: rep.damagingHits, wallHits: window.__near.length, near: window.__near.slice(0, 25) };
      });
      await g.page.evaluate(() => { Math.random = window.__rand0; });
      r.seed = sd; all.push(r);
      console.log(`${r.track} seed ${sd}: t ${r.t}s ${r.done ? 'finished' : 'unfinished'}  retired ${r.retired.length} [${r.retired.join(' | ')}]  launched ${r.launched} split ${r.split} hurt ${r.hurt} maxG ${r.maxG}  spins ${r.spins} carHits ${r.hits} wallHits ${r.wallHits}`);
      for (const n of r.near) console.log(`    ${n.t}s ${n.car}@${n.s} ${n.kmh}km/h sev ${n.sev} ${n.g}g ${n.kind} near[${n.near}]`);
    }
  } finally { await g.close(); }
}
const by = {};
for (const r of all) { const b = (by[r.track] = by[r.track] || { races: 0, retired: 0, launched: 0, split: 0, hurt: 0 }); b.races++; b.retired += r.retired.length; b.launched += r.launched; b.split += r.split; b.hurt += r.hurt; }
console.log('SUMMARY', JSON.stringify(by));
