// The drivers rated after a race, 1 to 10, with the reasons - and what it does to each one's rating (OVR: the rating
// times a hundred). Read against what his car could do (exp: the place its pace was worth, by the car alone), the
// places taken from the grid, the passes made, the spins and the penalties, the team-mate beaten or not, a win, a
// podium, the fastest lap; crashed out, low; out with a failure of the car, not rated (it was not his doing).
// Used by the results sheet (main.js) and both careers (career/Manager.js, career/Career.js): the same race, the same
// marks.

const ACCIDENT = /accident|crash|collision|rolled|torn|wall|beached|spun/i;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sur = (n) => String(n || '').split(' ').pop();

/**
 * rows: [{ pos, car }] (car: careerId, name, team, retired, retireReason, gridPos, overtakes, spins, penaltyCount, bestLap,
 * perf). o.exp: careerId -> the place the car was worth (else by car.perf among the rows).
 * -> Map(car -> { score (1..10, one decimal) | null, why: [words], d: the rating's change })
 */
export function rateRace(rows, o = {}) {
  const out = new Map(), N = rows.length;
  let exp = o.exp || null;
  if (!exp) { exp = {}; [...rows].sort((a, b) => (b.car.perf ?? 0) - (a.car.perf ?? 0)).forEach((r, i) => { exp[r.car.careerId ?? r.car.name] = i + 1; }); }
  const fl = rows.filter((r) => !r.car.retired && isFinite(r.car.bestLap) && r.car.bestLap > 20).sort((a, b) => a.car.bestLap - b.car.bestLap)[0];
  for (const r of rows) {
    const c = r.car, id = c.careerId ?? c.name, why = [];
    if (c.retired && !ACCIDENT.test(c.retireReason || '')) { out.set(c, { score: null, why: [`out: ${String(c.retireReason || 'the car').toLowerCase()}`], d: 0 }); continue; }
    let s = 6.0;
    const e = exp[id] ?? r.pos, spins = c.spins || 0, pens = c.penaltyCount || 0, ov = c.overtakes || 0;
    if (c.retired) { s = 3.6 - 0.4 * Math.min(2, spins); why.push('crashed out'); }
    else {
      const dp = e - r.pos; s += clamp(dp * 0.22, -2.2, 2.8);
      if (dp >= 2) why.push(`P${r.pos} in a car for P${Math.round(e)}`); else if (dp <= -2) why.push(`P${r.pos} in a car for P${Math.round(e)}`);
      const g = (c.gridPos || r.pos) - r.pos; s += clamp(g * 0.05, -0.6, 0.8); if (g >= 4) why.push(`${g} places from the grid`);
      if (ov) { s += Math.min(0.9, ov * 0.15); if (ov >= 2) why.push(`${ov} overtakes`); }
      if (r.pos === 1) { s += 0.35; why.push('the win'); } else if (r.pos <= 3) s += 0.15;
      if (fl && fl === r) { s += 0.3; why.push('fastest lap'); }
      // (the team-mate: the only one in the same car)
      const m = rows.find((x) => x !== r && x.car.team === c.team);
      if (m && !m.car.retired) { if (r.pos < m.pos) { s += 0.3; why.push(`beat ${sur(m.car.name)}`); } else { s -= 0.3; why.push(`behind ${sur(m.car.name)}`); } }
    }
    if (spins) { s -= Math.min(1.5, 0.5 * spins); why.push(spins === 1 ? 'a spin' : `${spins} spins`); }
    if (pens) { s -= Math.min(1.35, 0.45 * pens); why.push(pens === 1 ? 'a penalty' : `${pens} penalties`); }
    s = Math.round(clamp(s, 1, 10) * 10) / 10;
    // (the rating moves with it: a 9 is some +0.4 on the OVR, a 4 some -0.4)
    out.set(c, { score: s, why: why.slice(0, 3), d: Math.round((s - 6.3) * 0.0016 * 10000) / 10000 });
  }
  return out;
}
/** a rating's colour on the sheets */
export const rateCol = (s) => (s == null ? '#8b95a3' : s >= 8 ? '#3ddc84' : s >= 6.5 ? '#c8f0d0' : s >= 5 ? '#ffd166' : '#ff6b6b');
