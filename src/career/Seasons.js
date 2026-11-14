// The years of a team principal's career (career/Manager.js calls in at each round, at the season's end and in the
// winter): drivers who are born, grow to what they can be, hold it, fade and retire; rookies who come up to replace
// them; your academy (prospects scouted, juniors raced up through F4, F3 and F2, promoted or lost); contracts that are
// asked for by what a driver is worth, who else wants him and what your team is - and a market that moves from the
// season's half-way: teams renew, sign each other's drivers for next year, and come for yours; the regulations, which
// change every third season and send every team back to a new car (its place by how good the old one was, its
// factory, the work it put in early, and luck); and the wide grid itself (t.gap: the gaps between the tiers that the
// development tree alone does not make). Plain data on the career, saved with it.
import { UPGRADES, UP, startLevels, techEffects } from './TechTree.js';

const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const rnd = () => Math.random();
const pick = (a) => a[Math.floor(rnd() * a.length)];
const sur = (n) => String(n || '').trim().split(/\s+/).pop();
const idOf = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
const ask0 = (rating) => Math.max(0.5, Math.round((rating - 0.72) * 80) / 2);
/** the manager's grid: how far each tier's car starts behind the front beyond what the tree gives (pace: -0.001 ~ 0.04 s a lap) */
export const TIER_GAP = [0, -0.004, -0.0085, -0.0125];
const BORN = { norris: 1999, piastri: 2001, leclerc: 1997, hamilton: 1985, verstappen: 1997, hadjar: 2004, russell: 1998, antonelli: 2006, alonso: 1981, stroll: 1998, albon: 1996, sainz: 1994, lawson: 2002, lindblad: 2007, ocon: 1996, bearman: 2005, gasly: 1996, colapinto: 2003, hulkenberg: 1987, bortoleto: 2004, bottas: 1989, perez: 1990,
  "o'ward": 1999, giovinazzi: 1993, tsunoda: 2000, vesti: 2002, drugovich: 2000, browning: 2002, iwasa: 2001, hirakawa: 1994, maini: 2000, aron: 2004, guanyu: 1999, fornaroli: 2004, verschoor: 2000, crawford: 2005, beganovic: 2004, martins: 2001, durksen: 2003 };
const FIRST = ['Mateo', 'Luca', 'Noah', 'Kai', 'Elias', 'Hugo', 'Theo', 'Rafael', 'Tomas', 'Jonas', 'Enzo', 'Arjun', 'Kenta', 'Lucas', 'Emil', 'Oskar', 'Diego', 'Felix', 'Milan', 'Sami', 'Ravi', 'Callum', 'Andre', 'Niko', 'Taro', 'Ivan', 'Zane', 'Matteo', 'Julien', 'Aleksi', 'Sofia', 'Maya', 'Lena', 'Chloe', 'Abbi', 'Doriane'];
const LAST = ['Varga', 'Lindholm', 'Moretti', 'Okonkwo', 'Bauer', 'Castillo', 'Novak', 'Hartley', 'Rossetti', 'Sandoval', 'Kimura', 'Petrov', 'Laurent', 'Mwangi', 'Eriksen', 'Dalton', 'Ferreira', 'Kovac', 'Nakamura', 'Villeneuve', 'Halloran', 'Schreiber', 'Montoya', 'Ilves', 'Marchand', 'Bianchi', 'Raikko', 'Sutherland', 'Zhang', 'Brennan', 'Costa', 'Weiss', 'Aitken', 'Demir'];
const HELM = ['#e10600', '#0b3d91', '#ffd400', '#00a3e0', '#ffffff', '#1f8f6f', '#ff7a00', '#7a1fa0', '#111318', '#d4af37'];
export const SERIES = { F4: { name: 'Formula 4', ref: 0.69, cost: 0.3 }, F3: { name: 'Formula 3', ref: 0.74, cost: 0.7 }, F2: { name: 'Formula 2', ref: 0.79, cost: 1.6 } };
export const ACADEMY_COST = [2, 4, 7];

// ---- ages --------------------------------------------------------------------------------------------------------------
export const ageOf = (c, d) => c.season - (d.born || c.season - 27);
function person(c, born, rating, pot, from) {
  let name, id, k = 0; do { name = `${pick(FIRST)} ${pick(LAST)}`; id = idOf(name); } while (c.drivers[id] && ++k < 40);
  const short = sur(name).slice(0, 3).toUpperCase();
  return { id, name, short, rating: +rating.toFixed(3), pot: +pot.toFixed(3), born, number: 2 + ((rnd() * 97) | 0), helmet: pick(HELM), starts: 0, points: 0, wins: 0, podiums: 0, alive: true, from, team: null, until: null, salary: ask0(rating), morale: 60 };
}
export function seasonsEnsure(c) {
  for (const d of Object.values(c.drivers)) {
    if (!d.born) d.born = BORN[sur(d.name).toLowerCase()] || c.season - (d.from === 'F2' ? 20 : 24 + ((rnd() * 9) | 0));
    if (d.pot == null) { const a = ageOf(c, d); d.pot = +clamp(d.rating + Math.max(0, 27 - a) * (0.004 + rnd() * 0.006), d.rating, 0.975).toFixed(3); }
  }
  for (const t of Object.values(c.teams)) if (t.gap == null) t.gap = TIER_GAP[t.tier] ?? 0;
  if (!c.academy) c.academy = { level: 0, juniors: [], prospects: [], drawn: -1 };
  if (!c.era) c.era = { log: [] };
  if (c.academy.drawn !== c.season) { c.academy.drawn = c.season; drawProspects(c); }
}
/** a winter older: the young grow toward what they can be, the settled hold, the old fade */
export function ageDrivers(c) {
  for (const d of Object.values(c.drivers)) {
    if (d.retired) continue; const a = ageOf(c, d);
    const dr = a < 27 ? (d.pot - d.rating) * (0.28 + rnd() * 0.14) + (rnd() - 0.4) * 0.004 : a < 33 ? (rnd() - 0.5) * 0.007 : -0.004 - (a - 33) * 0.0028 - rnd() * 0.005;
    d.rating = +clamp(d.rating + dr, 0.68, 0.975).toFixed(3); d.points = 0;
  }
}
/** three quarters through a season: who has decided this is the last (said now, so a seat can be planned for) -> lines */
export function retireRound(c) {
  if (c.round !== Math.ceil(c.rounds * 0.7)) return [];
  const out = [];
  for (const d of Object.values(c.drivers)) {
    if (d.retired || d.retiring) continue; const a = ageOf(c, d); if (a < 33) continue;
    // (from 36 it is a question every year; sooner for one who has slowed or has no seat)
    const p = Math.max(0, a - 35) * 0.11 + (d.rating < 0.84 ? 0.14 : 0) + (d.team ? 0 : 0.4) - (d.rating > 0.92 ? 0.12 : 0);
    if (rnd() < p) { d.retiring = true; if (d.team) out.push(`${d.name} (${a}) will retire at the end of the season${d.team === c.myTeam ? ': your seat will be empty' : ''}.`); }
  }
  return out;
}

// ---- contracts -----------------------------------------------------------------------------------------------------------
/** how much a driver wants to be at a team: where it is in the order, 0 (last) .. 1 (first) */
export function appeal(c, team) {
  const order = c.constructors().map((t) => t.name), any = order.some((n) => c.teams[n].points > 0), i = any ? order.indexOf(team) : Object.values(c.teams).sort((a, b) => a.tier - b.tier || a.garage - b.garage).findIndex((t) => t.name === team);
  return 1 - clamp(i, 0, order.length - 1) / Math.max(1, order.length - 1);
}
/** what a driver asks of YOUR team for a contract of `years` -> { salary, fee, no (why he will not sign), why } */
export function contractAsk(c, d, years = 2) {
  const mine = d.team === c.myTeam, ap = appeal(c, c.myTeam), jr = d.academy === c.myTeam;
  if (d.retiring) return { no: `${d.name} is retiring at the end of the season.` };
  if (d.next && d.next.team !== c.myTeam) return { no: `${d.name} has signed for ${d.next.team} for next season.` };
  if (!mine && !jr && d.rating >= 0.92 && ap < 0.3) return { no: `${d.name} will not join a team this far down the order.` };
  const k = (1.25 - 0.33 * ap) * (d.offer ? 1.15 : 1) * (mine ? 1 + (60 - (d.morale ?? 60)) * 0.004 : 1) * (years === 1 ? 0.97 : years === 3 ? (d.rating > 0.9 ? 1.07 : 0.97) : 1) * (jr ? 0.7 : 1);
  const salary = r1(Math.max(0.4, ask0(d.rating) * k, mine ? d.salary * 1.04 : 0));
  return { salary, fee: mine ? 0 : r1(salary * 0.5), why: `${d.offer ? `${d.offer.team} want him too. ` : ''}${ap < 0.4 ? 'Your place in the order costs you. ' : ap > 0.75 ? 'A front-running seat: he takes less. ' : ''}${jr ? 'Your own junior.' : ''}`.trim() };
}

// ---- the market ----------------------------------------------------------------------------------------------------------
const planned = (c, t) => c.seatsOf(t.name).filter((d) => !d.retiring && !d.out && !(d.next && d.next.team !== t.name) && (d.until > c.season || d.renew)).length + Object.values(c.drivers).filter((d) => d.next?.team === t.name && d.team !== t.name).length;
/**
 * A round of the market, from the season's half-way: each rival team with a seat running out decides once - renew, or
 * sign someone better for next year (a free agent, another team's man whose contract is ending, one of YOURS: he then
 * has an offer, and leaves in the winter unless you extend him first) -> lines of news
 */
export function marketRound(c) {
  const out = []; if (c.round < Math.ceil(c.rounds * 0.5)) return out;
  for (const t of Object.values(c.teams)) {
    if (t.name === c.myTeam) continue;
    for (const d of c.seatsOf(t.name)) {
      if (d.dec || (d.until > c.season && !d.retiring)) continue; if (rnd() > 0.45 && c.round < c.rounds) continue;
      d.dec = true; if (planned(c, t) >= 2 && !d.retiring) { d.renew = true; continue; }
      const ap = appeal(c, t.name);
      const cands = Object.values(c.drivers).filter((x) => !x.retired && !x.retiring && !x.next && x !== d && x.team !== t.name && (!x.team || x.until <= c.season) && !(x.academy === c.myTeam && !x.team && (x.hold ?? 0) >= c.season)
        && x.rating > (d.retiring ? 0 : d.rating + 0.012) && (!x.team || appeal(c, x.team) < ap + 0.12)).sort((a, b) => (b.rating + (b.pot - b.rating) * 0.4) - (a.rating + (a.pot - a.rating) * 0.4));
      const x = cands[0];
      if (x && (d.retiring || rnd() < 0.62)) {
        const deal = { team: t.name, salary: r1(ask0(x.rating) * 1.08), until: c.season + 1 + (rnd() < 0.5 ? 1 : 0) };
        if (x.team === c.myTeam) { x.offer = { ...deal, round: c.round }; out.push(`${t.name} have made ${x.name} an offer for next season: extend his contract or lose him.`); d.renew = true; d.until = Math.max(d.until, c.season); }   // (their man stays unless yours comes)
        else { x.next = deal; if (!d.retiring) d.out = true; out.push(`${t.name} sign ${x.name} for ${c.season + 1}${d.retiring ? '' : `: ${sur(d.name)} is out`}.`); }
      } else if (!d.retiring) { d.renew = true; d.until = c.season + 1 + (rnd() < 0.4 ? 1 : 0); d.salary = r1(Math.max(d.salary, ask0(d.rating))); if (d.rating > 0.88) out.push(`${d.name} stays at ${t.name} to the end of ${d.until}.`); }
    }
  }
  return out;
}
/** the winter's moves: the retired go, the contracts run out, next year's deals take effect, the rookies arrive, the empty seats are filled -> lines */
export function marketWinter(c) {
  const out = [], T = c.teams, leave = (d) => { const t = T[d.team]; if (t) t.seats = t.seats.filter((x) => x !== d.id); d.team = null; d.until = null; };
  let gone = 0;
  for (const d of Object.values(c.drivers)) {
    if (d.retiring) { if (d.team) { out.push(`${d.name} retires after ${d.starts || 0} starts${d.wins ? ` and ${d.wins} win${d.wins === 1 ? '' : 's'}` : ''}.`); gone++; } leave(d); d.retired = true; d.retiring = false; c.era.log.push({ season: c.season - 1, kind: 'retired', name: d.name }); continue; }
    if (!d.team) continue;
    if (d.team === c.myTeam && d.until != null && d.until < c.season) { const o = d.offer; out.push(`${d.name}'s contract has run out: he leaves ${d.team}${o ? ` for ${o.team}` : ''}.`); leave(d); if (o) d.next = { team: o.team, salary: o.salary, until: o.until }; }
    else if (d.team !== c.myTeam && (d.out || (d.until != null && d.until < c.season && !d.renew))) leave(d);
    else if (d.next && d.next.team !== d.team) leave(d);
  }
  for (const d of Object.values(c.drivers)) {
    const n = d.next; if (n && T[n.team] && !d.retired) { const t = T[n.team]; if (t.seats.length >= 2) { const w = c.seatsOf(t.name).sort((a, b) => a.rating - b.rating)[0]; leave(w); } d.team = t.name; d.salary = n.salary; d.until = n.until; t.seats.push(d.id); }
    delete d.next; delete d.offer; delete d.dec; delete d.out; delete d.renew;
  }
  // (those nobody has wanted for two winters stop looking: the pool is who might still get a seat)
  for (const d of Object.values(c.drivers)) { if (d.team || d.retired) { d.idle = 0; continue; } d.idle = (d.idle || 0) + 1; if (d.idle >= 3 && !(d.academy === c.myTeam && (d.hold ?? 0) >= c.season) && (ageOf(c, d) > 29 || d.rating < 0.8 || d.idle >= 4)) d.retired = true; }
  // the rookies: one for each who retired and now and then one more, out of other people's academies
  const names = Object.keys(T).filter((n) => n !== c.myTeam);
  // (and enough of them that there is always somebody to sign: eight free drivers or so)
  const freeNow = Object.values(c.drivers).filter((d) => !d.team && !d.retired).length;
  for (let i = 0, n = Math.max(gone + (rnd() < 0.6 ? 1 : 0), 8 - freeNow); i < n; i++) { const pot = clamp(0.84 + rnd() * 0.09 + (rnd() < 0.15 ? 0.04 : 0), 0.82, 0.97), d = person(c, c.season - 18 - ((rnd() * 4) | 0), clamp(0.77 + rnd() * 0.06, 0.76, pot), pot, 'F2'); d.academy = pick(names); c.drivers[d.id] = d; out.push(`${d.name} (${ageOf(c, d)}) comes up from Formula 2, a ${d.academy} junior.`); }
  for (const t of Object.values(T)) while (t.name !== c.myTeam && t.seats.length < 2) {
    const f = Object.values(c.drivers).filter((d) => !d.team && !d.retired && !(d.academy === c.myTeam && (d.hold ?? 0) >= c.season)).sort((a, b) => (b.rating + (b.academy === t.name ? 0.03 : 0)) - (a.rating + (a.academy === t.name ? 0.03 : 0)))[0]; if (!f) break;
    f.team = t.name; f.salary = ask0(f.rating); f.until = c.season + 1; t.seats.push(f.id); out.push(`${t.name} sign ${f.name}.`);
  }
  return out;
}

// ---- the academy -----------------------------------------------------------------------------------------------------------
function drawProspects(c) {
  const A = c.academy, n = 3 + A.level, acc = 0.07 - A.level * 0.018;
  A.prospects = Array.from({ length: n }, () => {
    const star = rnd() < 0.08 + A.level * 0.04, pot = clamp(0.8 + rnd() * 0.1 + (star ? 0.06 : 0), 0.78, 0.97), d = person(c, c.season - 15 - ((rnd() * 4) | 0), 0.6 + rnd() * 0.09, pot, 'Academy'), off = (rnd() - 0.5) * acc;
    return { ...d, series: 'F4', lo: +clamp(pot + off - acc, 0.7, 0.99).toFixed(2), hi: +clamp(pot + off + acc, 0.7, 0.99).toFixed(2), sign: r1(0.2 + (pot - 0.8) * 4 + rnd() * 0.3), res: [] };
  });
}
/** a prospect signed to your academy -> text */
export function scout(c, i) {
  const A = c.academy, p = A.prospects[i]; if (!p) return 'No such prospect.';
  if (A.juniors.length >= 2 + A.level) return `Your academy has room for ${2 + A.level}: build it up, or let someone go.`;
  if (c.team.budget < p.sign) return `Not enough money: ${p.name} costs $${p.sign}M to sign.`;
  c.team.budget = r1(c.team.budget - p.sign); A.prospects.splice(i, 1); A.juniors.push(p); c.addNews(`${p.name} (${ageOf(c, p)}) joins the ${c.myTeam} academy.`); c.save();
  return `${p.name} signed to the academy ($${p.sign}M). ${SERIES.F4.name} this season: $${SERIES.F4.cost}M.`;
}
export function academyUp(c) {
  const A = c.academy; if (A.level >= 3) return 'The academy is as big as it gets.';
  const cost = ACADEMY_COST[A.level]; if (c.team.budget < cost) return `Not enough money: $${cost}M.`;
  c.team.budget = r1(c.team.budget - cost); A.level++; c.addNews(`${c.myTeam} build up their academy (level ${A.level}).`); c.save();
  return `Academy level ${A.level}: room for ${2 + A.level}, better scouting, juniors learn faster.`;
}
export function juniorRelease(c, i) { const A = c.academy, j = A.juniors[i]; if (!j) return 'No such junior.'; A.juniors.splice(i, 1); c.addNews(`${j.name} is released from the ${c.myTeam} academy.`); c.save(); return `${j.name} released.`; }
/** a junior brought up to Formula 1: yours to sign before anyone else, for this season and the next */
export function promote(c, i) {
  const A = c.academy, j = A.juniors[i]; if (!j) return 'No such junior.';
  if (j.rating < 0.755) return `${j.name} has not the results for a super licence yet (needs 76).`;
  A.juniors.splice(i, 1); const { series, lo, hi, sign, res, ...d } = j; void series; void lo; void hi; void sign; void res;
  d.from = 'Academy'; d.academy = c.myTeam; d.hold = c.season + 1; d.salary = ask0(d.rating); c.drivers[d.id] = d; c.addNews(`${d.name} graduates from the ${c.myTeam} academy: free to be signed.`); c.save();
  return `${d.name} is ready for a seat: yours to sign first, until the end of ${d.hold}.`;
}
/** a round in the junior series: they learn (faster in a better academy) */
export function academyRound(c) { const A = c.academy, k = (0.024 + 0.007 * A.level) * 8 / Math.max(4, c.rounds); for (const j of A.juniors) j.rating = +clamp(j.rating + (j.pot - j.rating) * k * (0.6 + rnd() * 0.8), 0.55, j.pot).toFixed(3); }
/** the junior seasons' ends: where each finished, who moves up, what next year costs -> lines */
export function academyWinter(c) {
  const A = c.academy, out = []; let cost = 0.5 * A.level;
  for (const j of [...A.juniors]) {
    const S = SERIES[j.series], pos = clamp(Math.round(1 + (S.ref + 0.03 - j.rating) * 70 + (rnd() - 0.5) * 6), 1, 22); j.res.push({ season: c.season - 1, series: j.series, pos });
    const up = j.series === 'F4' && j.rating >= 0.71 ? 'F3' : j.series === 'F3' && j.rating >= 0.755 ? 'F2' : null;
    out.push(`Academy: ${j.name} P${pos} in ${S.name}${up ? `, up to ${SERIES[up].name}` : ''}.`);
    if (up) j.series = up;
    else if (j.series === 'F2' && j.res.filter((r) => r.series === 'F2').length >= 3) { A.juniors.splice(A.juniors.indexOf(j), 1); out.push(`Academy: ${j.name} has had three seasons of Formula 2 and no seat: he leaves.`); continue; }
    cost += SERIES[j.series].cost;
  }
  if (cost > 0) { c.team.budget = r1(c.team.budget - cost); out.push(`The academy's season: $${r1(cost)}M.`); }
  return out;
}

// ---- the regulations -------------------------------------------------------------------------------------------------------
export const regsNext = (c) => { let s = c.season + 1; while (s % 3 !== 0) s++; return s; };
/**
 * New technical regulations (c.season already the new one; before career/ManagerCar.carNewSeason, which adds what each
 * put into this car early): every car is a new one - its parts back to what a team of its place starts with, the old
 * advantages gone - and where each stands is drawn again from how good its old car was, its factory, and luck. The
 * tiers follow the new order. -> lines
 */
export function regsReset(c) {
  const T = Object.values(c.teams), tot = (t) => techEffects(t).perf + (t.gap || 0), cur = T.map(tot), lo = Math.min(...cur), hi = Math.max(...cur);
  const facIds = UPGRADES.filter((u) => u.branch === 'facilities').map((u) => u.id), facOf = (t) => facIds.reduce((s, id) => s + (t.levels?.[id] || 0), 0), fMax = Math.max(1, ...T.map(facOf));
  const sc = T.map((t, i) => ({ t, s: 0.5 * (cur[i] - lo) / Math.max(1e-6, hi - lo) + 0.2 * facOf(t) / fMax + 0.3 * rnd() })).sort((a, b) => b.s - a.s);
  const TIERS = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3], out = [], before = T.slice().sort((a, b) => tot(b) - tot(a)).map((t) => t.name);
  sc.forEach(({ t }, i) => {
    const tier = TIERS[Math.min(i, TIERS.length - 1)], keep = {}; for (const id of facIds) if (t.levels?.[id]) keep[id] = t.levels[id];
    const st = startLevels(tier), lv = { ...keep }; for (const [id, v] of Object.entries(st)) if (UP[id]?.branch !== 'facilities') lv[id] = v;   /* (the factory is what the team has built, not what its new place would give it) */
    // (a level only counts when what it needs is there: a team new to the front without the front's factory starts a little short)
    for (let pass = 0, ch = true; ch && pass < 10; pass++) { ch = false; for (const u of UPGRADES) { if (u.branch === 'facilities') continue; const v = lv[u.id] || 0; let ok = 0; while (ok < v && u.levels[ok].req.every(([r, l]) => (lv[r] || 0) >= l)) ok++; if (ok < v) { ch = true; if (ok) lv[u.id] = ok; else delete lv[u.id]; } } }
    for (const id of Object.keys(lv)) if (!lv[id]) delete lv[id];
    t.tier = tier; t.levels = lv; t.perfAdj = 0; t.dev = (t.dev || []).filter((x) => UP[x.id]?.branch === 'facilities');
    if (t.quality) for (const id of Object.keys(t.quality)) if (UP[id]?.branch !== 'facilities') delete t.quality[id];
    const want = -0.0135 * (i / Math.max(1, sc.length - 1)) ** 0.9 + (rnd() - 0.5) * 0.0012;
    t.gap = 0; t.gap = +(want - (techEffects(t).perf - 1)).toFixed(5);
  });
  const after = sc.map((x) => x.t.name), me = c.myTeam, a = before.indexOf(me) + 1, b = after.indexOf(me) + 1;
  out.push(`New technical regulations for ${c.season}: every car is a new one. The order as the new cars roll out: ${after.slice(0, 4).join(', ')} ...`);
  out.push(`${me}: ${b < a ? `up from ${a}${ord(a)} to ${b}${ord(b)} quickest` : b > a ? `down from ${a}${ord(a)} to ${b}${ord(b)} quickest` : `still ${b}${ord(b)} quickest`} under the new rules. The parts built for the old car are history; the factory is not.`);
  c.era.log.push({ season: c.season, kind: 'regs', order: after.slice(0, 3) });
  return out;
}
const ord = (n) => ['th', 'st', 'nd', 'rd'][n % 100 > 10 && n % 100 < 14 ? 0 : Math.min(4, n % 10) % 4] || 'th';
/** a winter under stable rules: the field closes up a little (everybody learns what the fast cars do) */
export function gapsWinter(c) { for (const t of Object.values(c.teams)) t.gap = +((t.gap || 0) * 0.9).toFixed(5); }
