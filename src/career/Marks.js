// What the marks (race/Ratings.js) do in a career, both of them (career/Manager.js, career/Career.js): each driver's
// marks kept for the season - the average, the Drivers of the Day, the rating it began with - and his form (the last
// five); the fans' Driver of the Day (main.js raceFacts: the vote, the marks in it; a simulated race: the best mark);
// and at the season's end the awards: Driver of the Year (the best average), Rookie of the Year, the most Drivers of
// the Day, the most improved (the rating's rise). The form is read by the contracts (career/Seasons.js contractAsk:
// a run of 8s asks for more, a run of 4s for less), the rivals' market (who is kept, who is wanted: Seasons.js
// marketRound, Market.js formOf) and the morale.

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const ROOKIES = new Set(['Arvid Lindblad']);   // (the 2026 grid's rookie)

/** a driver's form: the average of his last n marks (null: fewer than three) */
export function markForm(d, n = 5) {
  const m = (d?.marks || []).filter((x) => x != null).slice(-n);
  return m.length >= 3 ? m.reduce((a, b) => a + b, 0) / m.length : null;
}
/** a driver's average mark this season (null: fewer than two) */
export const seasonMark = (d, season) => (d?.ms && d.ms.s === season && d.ms.n >= 2 ? d.ms.sum / d.ms.n : null);
/** the form as a price: a run of 8s asks some +10 %, a run of 4s some -12 % (1: no form yet) */
export const formPay = (d) => { const f = markForm(d); return f == null ? 1 : clamp(1 + (f - 6.3) * 0.06, 0.86, 1.14); };
/** the form in words, for a contract's reasons ('' when there is nothing to say) */
export const formWhy = (d) => { const f = markForm(d); return f == null ? '' : f >= 7.5 ? `On a run of ${f.toFixed(1)}s: he knows his worth.` : f <= 5.2 ? `His marks are down (${f.toFixed(1)}): he asks for less.` : ''; };

/**
 * A race's marks into the career (C.drivers by careerId; marks: rateRace's Map; rows the classification - a row's
 * car.dotd: the fans' vote, else the best mark is Driver of the Day). Each driver's marks and season kept; the Driver
 * of the Day counted. -> { id, name, team, score, why } the Driver of the Day, or null
 */
export function noteMarks(C, marks, rows) {
  let best = null, voted = null; if (C.marksFrom == null) C.marksFrom = C.season;
  for (const r of rows) {
    const d = C.drivers?.[r.car.careerId], m = marks.get(r.car); if (!d) continue;
    // (a rookie: in his first season of racing - the grid the career began with knows its own: Lindblad in 2026 - every
    //  driver who first races later, in the season he first races)
    if (d.debut == null) d.debut = C.season > C.marksFrom ? C.season : ROOKIES.has(d.name) ? C.season : 0;
    if (!d.ms || d.ms.s !== C.season) d.ms = { s: C.season, sum: 0, n: 0, dotd: 0, r0: d.rating, rookie: d.debut === C.season };
    if (m?.score != null) {
      d.marks = [...(d.marks || []), m.score].slice(-10); d.ms.sum = Math.round((d.ms.sum + m.score) * 10) / 10; d.ms.n++;
      if (!best || m.score > best.m.score || (m.score === best.m.score && r.pos < best.r.pos)) best = { d, m, r };
    }
    if (r.car.dotd) voted = { d, m, r };
  }
  const w = voted || best; if (!w) return null;
  w.d.ms.dotd++; w.d.dotd = (w.d.dotd || 0) + 1;
  return { id: w.d.id, name: w.d.name, team: w.r.car.team, score: w.m?.score ?? null, why: w.m?.why || [] };
}

/** the morale a mark is worth to the driver (0..100 scale): a 9 +4, an 8 +2, a 4.5 or less -3, Driver of the Day +2 */
export const markMorale = (score, dotd) => (score == null ? 0 : score >= 9 ? 4 : score >= 8 ? 2 : score <= 4.5 ? -3 : 0) + (dotd ? 2 : 0);

/**
 * The season's awards from the marks (C.drivers; teamOf(d): his team's name) -> [{ key, title, id, name, team, what }]
 * (at least half the season's races rated for the Driver and the Rookie of the Year)
 */
export function seasonAwards(C, teamOf = (d) => d.team) {
  const S = C.season, all = Object.values(C.drivers || {}).filter((d) => d.ms?.s === S && d.ms.n > 0 && d.alive !== false);
  const need = Math.max(2, Math.ceil((C.rounds || 4) / 2)), avg = (d) => d.ms.sum / d.ms.n, out = [];
  const add = (key, title, d, what) => { if (d) out.push({ key, title, id: d.id, name: d.name, team: teamOf(d) || '', what }); };
  const full = all.filter((d) => d.ms.n >= need).sort((a, b) => avg(b) - avg(a));
  add('doty', 'Driver of the Year', full[0], full[0] && `${avg(full[0]).toFixed(1)} a race over ${full[0].ms.n}`);
  const rk = full.filter((d) => d.ms.rookie);
  add('rookie', 'Rookie of the Year', rk[0], rk[0] && `${avg(rk[0]).toFixed(1)} a race in his first season`);
  const dd = [...all].sort((a, b) => b.ms.dotd - a.ms.dotd || avg(b) - avg(a))[0];
  if (dd && dd.ms.dotd >= 2) add('fans', "The fans' favourite", dd, `Driver of the Day ${dd.ms.dotd} times`);
  const up = [...all].filter((d) => d.ms.r0 != null).sort((a, b) => (b.rating - b.ms.r0) - (a.rating - a.ms.r0))[0];
  if (up && up.rating - up.ms.r0 >= 0.004) add('improved', 'Most improved', up, `OVR ${Math.round(up.ms.r0 * 100)} to ${Math.round(up.rating * 100)}`);
  return out;
}
/** the awards as one line of news */
export const awardsLine = (S, A) => (A.length ? `The ${S} awards: ${A.map((a) => `${a.title} - ${a.name} (${a.what})`).join('; ')}.` : '');
