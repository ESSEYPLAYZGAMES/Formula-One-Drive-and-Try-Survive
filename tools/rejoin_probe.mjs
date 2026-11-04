// An AI car rolled into a barrier at a crawl, left to rejoin on its own (AIDriver.rejoin): per barrier kind, speed and
// angle, whether it gets back on the road within 40 s, or is beached / stuck.   node tools/rejoin_probe.mjs [track] [turn s-offset...]
// (with a turn: into the barrier on that corner's outside as the circuit has it, at the apex + each offset, metres)
import { openGame } from './ai_lib.mjs';
const g = await openGame(process.argv[2] || 'lasvegas');
try {
  const rows = await g.page.evaluate(([turn, offs]) => {
    const F = window.__F1, out = [];
    for (const kind of turn ? offs : ['wall', 'soft', 'tyres', 'armco']) for (const kmh of [30, 60, 100]) for (const deg of [30, 60, 90]) {
      F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = 5; F.settings.sc = 'off'; F.restart();
      const d = F.S.director, tr = d.track; F.S.paused = true;
      const ai = d.cars.filter((c) => !c.isPlayer), c = ai[0];
      for (let k = 0; k < 40 && !(d.world.racing && d.time - (d.world.raceStart || 0) > 1); k++) F.stepSim(0.5);   // (lights out first)
      c.startRun = false;
      for (const o of d.cars) if (o !== c) { o.retired = true; o.cleared = true; o.ghost = 1e9; o.placeOnTrack(o.s, 30, 0); }
      if (!tr.giveL) tr.buildGive();
      let s0, side = 1;
      if (turn) {
        const cn = tr.def.corners.find((k) => k.n === turn), ci = tr.idxAtS(cn.s), z = tr.cornerZones.find((q) => (q.a <= q.b ? ci >= q.a - 20 && ci <= q.b + 20 : ci >= q.a - 20 || ci <= q.b + 20));
        side = -(z?.dir || 1); s0 = tr.wrapS(cn.s + kind);
      } else {
        s0 = window.__crash.straight(tr); const i0 = tr.idxAtS(s0), W = Math.round(200 / tr.ds);
        const code = { wall: 3, soft: 4, tyres: 2, armco: 1 }[kind], bar = { wall: 3, soft: 2, tyres: 2, armco: 1 }[kind];
        for (let k = -W; k <= W; k++) { const i = (i0 + k + tr.n) % tr.n; tr.giveL[i] = code; tr.barL[i] = bar; }
      }
      const i0 = tr.idxAtS(s0), a = deg * Math.PI / 180, wall = side > 0 ? tr.wallL[i0] : tr.wallR[i0];
      c.placeOnTrack(s0, side * (wall - (3.0 * Math.sin(a) + 0.95 * Math.cos(a)) - 0.3), kmh / 3.6); c.th -= side * a;
      c.ai.startRejoin?.(); c.ai.spun = true;
      let t = 0, back = null;
      for (; t < 40; t += 0.5) { F.stepSim(0.5); if (c.retired) break; if (!c.ai.rj && Math.abs(c.d) < tr.edgeAt(c.trackIdx, Math.sign(c.d) || 1) && c.speed > 5) { back = t; break; } }
      const K = turn ? `T${turn}${kind >= 0 ? '+' : ''}${kind} ${['-', 'armco', 'tyres', 'wall', 'soft'][(side > 0 ? tr.giveL : tr.giveR)[i0]]}` : kind;
      out.push(`${String(K).padEnd(6)} ${kmh} km/h ${deg} deg: ${back != null ? 'back on the road at ' + back + ' s' : c.retired ? 'OUT ' + c.retireReason : 'not back after 40 s'}  (d ${c.d.toFixed(1)}, ${Math.round(c.speedKmh)} km/h, rj ${c.ai.rj?.phase || '-'}, pen ${c._bc?.on ? c._bc.pen.toFixed(2) : '-'})`);
    }
    return out;
  }, [+(process.argv[3] || 0), process.argv.slice(4).map(Number)]);
  console.log(rows.join('\n'));
} finally { await g.close(); }
