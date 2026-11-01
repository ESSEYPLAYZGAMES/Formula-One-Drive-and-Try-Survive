// The driver market (a career's silly season): every driver's contract runs out some day, and every team decides. Four
// moments a season:
//
//  * Every race: each driver's season is measured against what his car and rating promised (d.mk) - the yardstick the
//    teams use for everything below.
//  * Between races: a driver far below that, and well beaten by his team-mate, is replaced (rarely: one a season,
//    after the fourth race at the earliest - the reserve or the best young driver free gets the car, and the news says
//    so); a pre-contract you signed may leak (your team reads about it: confidence and goodwill fall, and the papers
//    have the story); and when you are driving well, a rival team approaches you through your agent ("Ferrari want to
//    talk"): a pre-contract for next season when your contract runs out, a buyout of your release clause when it does
//    not, and now and then a seat at once. Interest alone is leverage (career/Seat.js rivalInterest).
//  * The season's end: each team decides on the drivers whose contracts are running out - kept, by how they drove and
//    what they are worth against the team's ambition, or let go - and a driver far below it with years left may be
//    released early. The seats that open are the market's (c.market.open: your agent's offers come from them first,
//    career/Seat.js marketOffers); a seat opening beside you is your say (c.seat.mateSay, career/Say.js).
//  * The winter (Career.nextSeason): the decisions carried out - the kept re-signed, the rest released; your own seat
//    (signed again, elsewhere, or none); your team-mate as the team and your say chose him; every seat still open
//    filled, the front-runners choosing first - the reserves step up, F2 and the juniors are promoted - then the silly
//    season's poaching (a clearly better driver bought out of a smaller team), and a final check that every team has
//    exactly two drivers, nobody is in two cars and nobody dead or banned was signed. Every move is in the news.
//
// Plain functions on the career's plain JSON (c.market, each driver's d.mk); the career's own methods do the signing
// (Career.sign). Nothing here imports the career itself (the bundle has no cycles).
import { seatEnsure, makeOffer, repOf, agentText, clauseFor, kindOf, liveOffer } from './Seat.js';
import { goodwill, mateRoleFor } from './Say.js';
import { prEvent } from './PR.js';
import { ageOf } from './Party.js';

// ---- small helpers -------------------------------------------------------------------------------------------------------
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const half = (v) => Math.max(0.5, Math.round(v * 2) / 2);
const arr = (v) => (Array.isArray(v) ? v : []);
const pick = (a) => a[(Math.random() * a.length) | 0];
const last = (n) => String(n || '').split(' ').pop();
const safe = (what, f, fb = null) => { try { return f(); } catch (e) { console.warn(`Market: ${what} failed`, e); return fb; } };
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
/** still learning (the career's isYoung, through the career: no import back) */
const young = (c, d) => (typeof c.youngOf === 'function' ? !!c.youngOf(d) : d.from !== 'F1' && num(d.starts) < 60);
/** what a driver asks for a season, $M (the career's askOf) */
const askOf = (c, d) => (typeof c.askFor === 'function' ? c.askFor(d) : Math.max(0.5, Math.round((d.rating - 0.72) * 80) / 2));
const out = (c, d) => (typeof c.isOut === 'function' ? c.isOut(d) : false);
/** a team's ambition for its drivers by tier - the value a driver must show to be kept: a front-runner wants the most */
export const KEEP_BAR = [9, 5, 3, 0];
/** how a mid-season replacement is triggered: after this many races, this far below his car (places a race), his team-mate this much better, the chance a round */
export const MID_CUT = { races: 4, form: -3.2, mateGap: 2.5, p: 0.12, perSeason: 1 };

/** the market's state: c.market = { v, planned (the season whose end it planned), season, resign: { did: years }, drop: [did], retire: [did], open: [{ team, out, why }], midSeason, mid (changes this season) } */
export function marketEnsure(c) {
  if (!c) return null;
  const M = c.market && typeof c.market === 'object' && !Array.isArray(c.market) ? c.market : (c.market = {});
  if (!M.resign || typeof M.resign !== 'object') M.resign = {};
  M.drop = arr(M.drop); M.open = arr(M.open); M.retire = arr(M.retire); M.v = 1; M.mid = num(M.mid, 0);
  return M;
}

// ---- the yardstick: each driver's season ----------------------------------------------------------------------------------
/** a race run (rows, exp: each driver's expected place): each driver's season against what his car promised -> d.mk = { s, n, g (expected minus actual, at most ±8 a race), dnf } */
export function marketRace(c, rows, exp) {
  for (const r of arr(rows)) {
    const d = c.drivers?.[r?.car?.careerId]; if (!d || !d.alive) continue;
    if (!d.mk || d.mk.s !== c.season) d.mk = { s: c.season, n: 0, g: 0, dnf: 0 };
    d.mk.n++;
    if (r.car.retired) d.mk.dnf++; else d.mk.g = r1(d.mk.g + clamp(num(exp?.[d.id], r.pos) - r.pos, -8, 8));
  }
}
/** a driver's form this season: places a race better (+) or worse (-) than his car and rating promised */
export const formOf = (d, season) => (d?.mk && d.mk.s === season && d.mk.n ? d.mk.g / d.mk.n : 0);
/** what a driver is worth to a team: his rating (0.80 = 0, a point = 1), his form this season (x 1.2, ±6), and the young a little more (+2) */
export const valueOf = (c, d) => (num(d.rating, 0.8) - 0.8) * 100 + clamp(formOf(d, c.season), -5, 5) * 1.2 + (young(c, d) ? 2 : 0);
/** how much a young driver's promise is worth to a team, by its tier: the front-runners want the finished article, the backmarkers blood rookies */
const YOUTH = [0.004, 0.008, 0.016, 0.024];
/** and a driver straight from F2 or the juniors, more still at the back of the grid (Bearman, Colapinto, Bortoleto) */
const FRESH = [0, 0, 0.008, 0.016];
/** how much a team wants a driver for a seat: his rating, a young one more (more the further back), its own reserve more still, his form */
const prefer = (c, team, d) => { const ti = clamp(num(c.teams[team]?.tier, 3), 0, 3); return num(d.rating, 0.8) + (young(c, d) ? YOUTH[ti] : 0) + (d.from === 'F2' || d.from === 'Junior' ? FRESH[ti] : 0) + (d.reserveOf === team ? 0.012 : 0) + clamp(formOf(d, c.season), -4, 4) * 0.002; };
/** the drivers a team could sign now: alive, without a race seat, fit and not banned, not retired - never you (plus: ids a team is letting go, for the shortlist) */
export function poolFor(c, team, o = {}) {
  const ex = new Set(arr(o.not)), plus = new Set(arr(o.plus));
  return Object.values(c.drivers || {}).filter((d) => d && d.alive && !d.retired && d.id !== c.playerId && !ex.has(d.id) && (!d.team || plus.has(d.id)) && !out(c, d)).sort((a, b) => prefer(c, team, b) - prefer(c, team, a));
}
/** the best rating on the market now (free, fit, not retired) - a team with a weaker driver out of contract looks at him */
const bestFree = (c) => Math.max(0, ...Object.values(c.drivers || {}).filter((d) => d && d.alive && !d.retired && !d.team && d.id !== c.playerId && !out(c, d)).map((d) => num(d.rating, 0)));
/** the chance a veteran stops when his contract runs out: from 38, 0.1 and 0.13 more a year (a driver whose age is not known never) */
export function retireChance(c, d) { const a = safe('age', () => ageOf(c, d, null, c.season), null); return a == null || a < 38 ? 0 : clamp(0.1 + (a - 38) * 0.13, 0, 0.9); }
/** where a newly signed driver comes from, for the news */
const fromTxt = (d, team) => (d.reserveOf === team ? `${team}'s own reserve steps up` : d.from === 'F2' ? 'promoted from F2' : d.from === 'Junior' ? 'a junior given his chance' : d.from === 'Reserve' ? `from the reserve ranks${d.reserveOf ? ` (${d.reserveOf})` : ''}` : 'back on the grid');
/** the standing a new signing gets beside the other driver (you: by your contract; another: number one over a clearly slower one) */
function roleBeside(c, team, d) {
  const o = c.seatsOf(team).find((x) => x.id !== d.id); if (!o) return 'equal';
  if (o.id === c.playerId) return mateRoleFor(o.contract?.role || 'equal', d, o) || 'equal';
  return d.rating - o.rating >= 0.04 ? 'lead' : o.rating - d.rating >= 0.04 ? 'support' : 'equal';
}
/** a driver let go: his seat empty, his contract gone (how: 'expire' | 'early' | 'cut' | 'extra' - a third driver the check found) - the news says it */
function release(c, d, t, how) {
  t.seats = t.seats.filter((x) => x !== d.id); d.team = null; d.contract = null;
  c.addNews(how === 'cut' ? `${t.name} drop ${d.name} with immediate effect.` : how === 'early' ? `${t.name} release ${d.name} a year early.` : how === 'extra' ? `${d.name} leaves ${t.name}.` : `${d.name} leaves ${t.name}: the contract has run out and the team is not renewing it.`);
}
/** a driver signed into a team's empty seat (salary: about what he asks; years: 1-2) - the news says where he came from */
function signInto(c, team, d, why = 'winter') {
  const t = c.teams[team]; if (!t || !d || !d.alive || d.team === team) return false;
  const promoted = !d.team && (d.from === 'F2' || d.from === 'Junior' || (d.from === 'Reserve' && !num(d.starts))), src = fromTxt(d, team);
  const years = young(c, d) ? 2 : d.rating >= 0.9 ? 2 : Math.random() < 0.5 ? 1 : 2, salary = half(askOf(c, d) * (why === 'mid' ? 0.7 : 1));
  if (!c.sign(team, d.id, salary, years, null, { role: roleBeside(c, team, d) })) return false;
  if (promoted) c.addNews(`${d.name} gets a Formula 1 seat: ${src}, at ${team}.`);
  else if (d.reserveOf === team) c.addNews(`${d.name} steps up from reserve to race driver at ${team}.`);
  delete d.reserveOf;
  return true;
}
/** every team below two drivers fills its seats from the pool, the front-runners first (exclude: ids already spoken for) */
function fillAll(c, why = 'winter', exclude = []) {
  const ex = new Set(exclude);
  const teams = Object.values(c.teams || {}).sort((a, b) => a.tier - b.tier || Math.random() - 0.5);
  for (const t of teams) {
    for (let guard = 0; guard < 3 && c.seatsOf(t.name).length < 2; guard++) {
      const d = poolFor(c, t.name, { not: [...ex] })[0]; if (!d) break;
      if (!signInto(c, t.name, d, why)) { ex.add(d.id); continue; }
    }
  }
}

// ---- between races ------------------------------------------------------------------------------------------------------------
/**
 * The round turned over (after every race, the season not over): your say over a mid-season change carried out; an AI
 * driver far below his car replaced (rarely); a pre-contract leaking; a rival team approaching you. -> { moves, approach }
 */
export function marketRoundTick(c) {
  const M = marketEnsure(c); if (!M || c.round > c.rounds) return null;
  if (M.midSeason !== c.season) { M.midSeason = c.season; M.mid = 0; }
  // (an offer that has lapsed - an approach not taken - leaves the table, whatever your status)
  if (c.seat) c.seat.offers = arr(c.seat.offers).filter((o) => liveOffer(c, o));
  const moves = [];
  safe('mid say', () => { const m = applyMidSay(c); if (m) moves.push(m); });
  safe('mid cuts', () => moves.push(...midSeasonCuts(c)));
  safe('leak', () => leakTick(c));
  const approach = safe('approach', () => approachTick(c));
  return { moves, approach };
}
/** a driver far below what his car promised (MID_CUT), beaten by his team-mate: his team replaces him, rarely - yours: your say first, the change a round later */
function midSeasonCuts(c) {
  const M = c.market, S = c.seat || {}, done = [];
  if (c.round <= MID_CUT.races) return done;
  for (const t of shuffle(Object.values(c.teams || {}))) {
    if (M.mid >= MID_CUT.perSeason && !(M.mid < MID_CUT.perSeason + 1 && Math.random() < 0.1)) break;
    const ds = c.seatsOf(t.name).filter((d) => d.id !== c.playerId && !out(c, d) && d.mk?.s === c.season && d.mk.n >= MID_CUT.races && !(d.mkKept?.s === c.season && c.round <= d.mkKept.r));
    for (const d of ds) {
      const f = formOf(d, c.season), mate = c.seatsOf(t.name).find((x) => x.id !== d.id), mf = mate ? formOf(mate, c.season) : f;
      if (f > MID_CUT.form || mf < f + MID_CUT.mateGap || Math.random() > MID_CUT.p) continue;
      if (S.status === 'driver' && S.team === t.name) { if (!S.mateSay) { openMateSay(c, 'cut', d); M.mid++; M.midAll = num(M.midAll) + 1; } break; }
      const r = poolFor(c, t.name).find((x) => x.rating >= d.rating - 0.05); if (!r) continue;
      release(c, d, t, 'cut');
      c.addNews(`${t.name} have seen enough: ${d.name}, ${Math.abs(f).toFixed(1)} places a race below what the car can do, is out. ${r.name} takes the seat from round ${c.round}.`);
      signInto(c, t.name, r, 'mid');
      M.mid++; M.midAll = num(M.midAll) + 1; done.push({ team: t.name, out: d.id, in: r.id, kind: 'cut' });
      break;
    }
  }
  return done;
}
/** your say over a mid-season change, carried out the round after it opened: the team's choice (as your say left it) takes the seat - or the team-mate you backed keeps it */
function applyMidSay(c) {
  const S = c.seat, M = S?.mateSay; if (!M || M.why !== 'cut') return null;
  if (S.status !== 'driver' || S.team !== M.team || !c.teams[M.team]) { S.mateSay = null; return null; }
  if (c.season === M.season && c.round <= M.round) return null;
  const t = c.teams[M.team], D = c.drivers, o = D[M.out], p = D[M.pick];
  S.mateSay = null;
  if (!o || !o.alive || o.team !== t.name) return null;
  // (kept: the team gives him three more races before it asks the question again)
  if (M.pick === M.out) { o.mkKept = { s: c.season, r: c.round + 3 }; c.addNews(`${t.name} keep faith with ${o.name}${M.result === 'won' ? `, with ${D[c.playerId]?.name}'s backing` : ''}.`); return { team: t.name, kept: o.id }; }
  const r = p && p.alive && !p.team && !out(c, p) ? p : poolFor(c, t.name).find((x) => x.id !== o.id);
  if (!r) return null;
  release(c, o, t, 'cut');
  c.addNews(`${t.name} replace ${o.name} with ${r.name} with immediate effect${M.result === 'won' ? ` - ${last(D[c.playerId]?.name)} had a say in it` : ''}.`);
  signInto(c, t.name, r, 'mid');
  return { team: t.name, out: o.id, in: r.id, kind: 'cut' };
}

// ---- the seat beside you: your say opens --------------------------------------------------------------------------------------
/**
 * A seat opening beside you (why 'season': your team-mate's contract runs out - kept or not, the team has decided; 'cut':
 * the team wants him out now; mate: the driver concerned) -> c.seat.mateSay = { id, team, season, round, why, out (your
 * team-mate, if any), teamKeeps, cands (the outgoing team-mate and the team's shortlist of three: the best it could
 * sign, the drivers other teams are letting go among them), pick (the team's choice), state 'open' } | null
 */
export function openMateSay(c, why = 'season', mate = null) {
  const S = seatEnsure(c), t = c.teams?.[S?.team], M = marketEnsure(c); if (!S || !t || S.status !== 'driver') return null;
  const m = mate || c.seatsOf(t.name).find((d) => d.id !== c.playerId) || null;
  if (m && m.team !== t.name) return null;
  let keeps = false;
  if (why === 'season') {
    if (m) { const ending = M.resign[m.id] != null || M.drop.includes(m.id); if (!ending) return null; keeps = M.resign[m.id] != null; }
  }
  const P = poolFor(c, t.name, { not: m ? [m.id] : [], plus: why === 'season' ? M.drop.filter((id) => c.drivers[id]?.team !== t.name) : [] }).slice(0, 3);
  if (!P.length && !keeps) return null;
  const gone = m && arr(M.retire).includes(m.id), cands = [...(m && !gone ? [m.id] : []), ...P.map((d) => d.id)], pickId = keeps ? m.id : P[0]?.id;
  S.mateSay = { id: `ms-${c.season}-${c.round}`, team: t.name, season: c.season, round: c.round, why, out: m?.id || null, teamKeeps: keeps, cands, pick: pickId, state: 'open' };
  const pn = c.drivers[pickId]?.name, F = last(c.drivers[c.playerId]?.name);
  const text = why === 'cut' ? `${t.name} are about to replace ${m.name}: ${pn} is their choice. Back someone, veto it, or stand by ${last(m.name)} - before the next race.`
    : gone ? `${m.name} is retiring: ${t.name} need a new driver beside you. ${pn} is their choice. Have your say.`
    : m ? `${m.name}'s contract is up. ${keeps ? `${t.name} want to keep him` : `${t.name} are looking elsewhere - ${pn} is their choice`}. If you want a say over your team-mate, now is the time.`
    : `The seat beside you is open for next season. ${t.name}'s choice: ${pn}. Have your say.`;
  S.notice = { kind: 'matesay', text, season: c.season, round: c.round - 1, seen: false };
  agentText(c, why === 'cut' ? `Between us: ${t.name} are replacing ${last(m.name)}. They've got ${last(pn)} lined up. If you have an opinion, they'll listen - up to a point.` : `${t.name} are deciding on your team-mate for next year, ${F}. ${last(pn)} is their pick. Want a say?`);
  return S.mateSay;
}
/** the season's end, once seatSeasonEnd has decided yours: a seat opening beside you (only if you are staying - under contract or offered a new one) */
export function seasonSay(c) {
  const S = c.seat; if (!S || S.status !== 'driver' || !['continue', 'renew'].includes(S.verdict)) return null;
  if (S.mateSay && S.mateSay.season === c.season && S.mateSay.why === 'season') return S.mateSay;
  return openMateSay(c, 'season');
}

// ---- a pre-contract that leaks -------------------------------------------------------------------------------------------------
/** a pre-contract (or a buyout) signed with a rival: the paddock may hear of it - now (0.3) and every round after (0.18, more under press heat) */
export function precontractSigned(c, of) {
  const S = seatEnsure(c); if (!S || S.status !== 'driver' || !of || of.team === S.team) return null;
  S.leak = { team: of.team, from: S.team, season: c.season, round: c.round, out: false };
  if (Math.random() < 0.3) leakNow(c);
  return S.leak;
}
function leakTick(c) {
  const S = c.seat, L = S?.leak; if (!L || L.out || L.season !== c.season || S.status !== 'driver' || !S.next || S.team !== L.from) return;
  if (Math.random() < 0.18 + num(c.pr?.heat, 0) / 250) leakNow(c);
}
/** the leak: your team reads it in the papers - confidence -12, goodwill -8 - and the press has its story */
export function leakNow(c) {
  const S = c.seat, L = S?.leak; if (!L || L.out) return false;
  L.out = true; L.at = { season: c.season, round: c.round };
  const me = c.drivers[c.playerId], c0 = S.conf; S.conf = r1(clamp(S.conf - 12, 0, 100)); goodwill(c, -8);
  const lg = S.log?.[0]; if (lg) { lg.f.push(['leak', r1(S.conf - c0), `Your pre-contract with ${L.team}: in the papers`]); lg.d = r1(lg.d + S.conf - c0); lg.conf = S.conf; }
  c.addNews(`${me?.name} has signed a pre-contract with ${L.team} for next season, the Paddock Post reveals. ${L.from} are said to be furious.`);
  S.notice = { kind: 'leak', text: `It's out: the papers have your pre-contract with ${L.team}. ${L.from} read it there first - and they are not pleased.`, season: c.season, round: c.round - 1, seen: false };
  safe('PR leak', () => prEvent(c, 'seat', { sub: 'leak', newTeam: L.team }));
  agentText(c, pick([`The Post has the ${L.team} deal. Not from me, I swear. Say nothing for now.`, `It's leaked. ${L.from} know. Keep your head down and drive.`]));
  agentText(c, pick([`I read about ${L.team} in the papers. Thanks for that.`, 'You could have told me before the Paddock Post did.']), { boss: true });
  return true;
}

// ---- rival teams approach you -----------------------------------------------------------------------------------------------
/** the most approaches a season, and the rounds between two */
export const APPROACH = { perSeason: 3, gap: 2 };
/** the chance this round that a rival approaches you: your form (+0.05 a place a race above your car), your name (rep past 45), a delighted team, the championship */
export function approachChance(c) {
  const S = c.seat, me = c.drivers?.[c.playerId]; if (!S || !me) return 0;
  const f = formOf(me, c.season), rep = repOf(c), st = c.driverStandings ? c.driverStandings() : [], pos = st.indexOf(me) + 1;
  return clamp(0.02 + Math.max(0, f) * 0.05 + Math.max(0, rep - 45) / 220 + (S.conf >= 75 ? 0.05 : 0) + (me.points > 0 && pos && pos <= 6 ? 0.05 : 0), 0, 0.45);
}
/**
 * A rival team approaching you through your agent (a race driver, from the third race, nothing signed for next
 * season, the gaps and the season's cap respected) -> the offer, or null. The team: higher up the grid than yours (or
 * level with it), one that has not asked this season, with a seat it would open for you (the weaker of its two). The
 * kind: your contract runs out this season - a pre-contract for next; it runs on - a buyout of your release clause, if
 * it can pay it (else only interest: it asked, the clause put it off); now and then (0.12) a seat at once, clause paid.
 * An approach pays a little more than the market (x1.1) and lapses after the next race.
 */
export function approachTick(c, force = false) {
  const S = seatEnsure(c), me = c.drivers?.[c.playerId];
  if (!S || S.status !== 'driver' || !me?.alive || S.next || c.round < 3 || c.round > c.rounds) return null;
  const mine = Object.values(S.interest || {}).filter((x) => x && x.season === c.season);
  if (!force && (mine.length >= APPROACH.perSeason || mine.some((x) => c.round - num(x.round, 0) < APPROACH.gap))) return null;
  if (!force && Math.random() >= approachChance(c)) return null;
  const myTier = num(c.teams[S.team]?.tier, 3), rep = repOf(c);
  const L = Object.values(c.teams).filter((t) => t.name !== S.team && S.interest[t.name]?.season !== c.season && t.tier <= myTier && c.seatsOf(t.name).some((d) => d.id !== c.playerId))
    .sort((a, b) => a.tier - b.tier + (Math.random() - 0.5) * (rep >= 70 ? 1.2 : 2.5));
  const t = L[0]; if (!t) return null;
  // (the seat it would open: its weaker driver - his rating first, this season's form only a nudge, a young one kept a little longer)
  const seatScore = (d) => num(d.rating, 0.8) * 100 + clamp(formOf(d, c.season), -3, 3) * 0.5 + (young(c, d) ? 1 : 0);
  const seat = c.seatsOf(t.name).filter((d) => d.id !== c.playerId).sort((a, b) => seatScore(a) - seatScore(b))[0];
  const k = me.contract || {}, ending = num(k.until, c.season) <= c.season, fee = num(k.releaseClause, clauseFor(k.salary, 1, S.tier)), rich = num(t.budget, 0) >= fee + 8;
  let kind = ending ? 'precontract' : rich ? 'buyout' : null;
  if (rich && c.round <= c.rounds - 1 && formOf(seat, c.season) <= -2.5 && Math.random() < 0.12) kind = 'midseason';
  S.interest[t.name] = { season: c.season, round: c.round, kind: kind || 'interest' };
  const F = last(me.name);
  if (!kind) {
    agentText(c, `${t.name} called about you, ${F}. Then they saw the release clause ($${fee}M). Still - they called. That's worth something.`);
    return null;
  }
  const of = makeOffer(c, t.name, { kind, rep, from: 'agent', next: kind !== 'midseason', expires: { season: c.season, round: Math.min(c.rounds, c.round + 1) }, seatOf: seat?.id || null, buyoutFee: kind === 'precontract' ? 0 : fee, negotiable: true,
    note: kind === 'precontract' ? `${t.name} want you next season - signed now, quietly.` : kind === 'buyout' ? `${t.name} will pay your $${fee}M release clause to have you next season.` : `${t.name} want you in their car from the next race - and will pay the $${fee}M clause.` });
  if (!of) return null;
  of.salary = half(of.salary * 1.1);
  S.offers = S.offers.filter((o) => o.team !== t.name); S.offers.push(of); S.interest[t.name].offer = of.id;
  agentText(c, kind === 'precontract' ? `${t.name} want to talk. A seat for next season - they'd sign you now, quietly. Have a look before someone else does.`
    : kind === 'buyout' ? `${t.name} want you next year - and they'll pay your release clause ($${fee}M) to get you. Interested?` : `${t.name} want you in their car now. They'd pay the $${fee}M clause. Big call - have a look.`);
  if (Math.random() < 0.5) c.addNews(`Paddock whispers: ${t.name} are keeping a close eye on ${me.name}.`);
  S.notice = { kind: 'approach', text: `${t.name} want to talk: ${kind === 'precontract' ? 'a seat for next season, signed now' : kind === 'buyout' ? `a seat for next season - your release clause paid` : 'a seat from the next race'}. Your agent has the offer.`, season: c.season, round: c.round - 1, seen: false };
  return of;
}
/**
 * You moved to a rival in mid-season (a 'midseason' offer taken, Career.acceptOffer: you are already in its car): it
 * pays your old team the release clause, the old team fills your seat at once, and the news has the move.
 */
export function moveNow(c, of, prevName) {
  const prev = c.teams?.[prevName], t = c.teams?.[of?.team]; if (!prev || !t || prev === t) return;
  const fee = num(of.buyoutFee, 0);
  if (fee) { t.budget = r1(num(t.budget) - fee); prev.budget = r1(num(prev.budget) + fee); }
  c.addNews(`${c.drivers[c.playerId]?.name} leaves ${prev.name} for ${t.name} with immediate effect${fee ? `: ${t.name} pay the $${fee}M release clause` : ''}.`);
  fillAll(c, 'mid');
}

// ---- the season's end: the teams decide ---------------------------------------------------------------------------------------
/**
 * keep a driver whose contract runs out? his value against the team's bar (KEEP_BAR): 0.42 + 0.065 a point either way,
 * 0.22 less with a clearly better driver (+0.025) free on the market (0.08..0.92)
 */
const keepChance = (c, d, t, best = bestFree(c)) => clamp(0.42 + (valueOf(c, d) - KEEP_BAR[clamp(num(t.tier, 3), 0, 3)]) * 0.065 - (best >= num(d.rating, 0.8) + 0.025 ? 0.22 : 0), 0.08, 0.92);
/**
 * The last race run (c.round past the calendar), once a season: each team's decision on every AI driver whose contract
 * runs out - kept (the years: two for one clearly above its bar) or let go - and on one far below it with years left
 * (released early, 0.4). The seats that open are c.market.open (your agent's offers start there). -> c.market
 */
export function marketSeasonEnd(c) {
  const M = marketEnsure(c); if (!M || M.planned === c.season) return M;
  M.planned = c.season; M.season = c.season; M.resign = {}; M.drop = []; M.open = []; M.retire = [];
  const best = bestFree(c);
  for (const t of Object.values(c.teams || {})) {
    for (const d of c.seatsOf(t.name).filter((x) => x.id !== c.playerId)) {
      const k = d.contract, ending = !k || num(k.until, c.season) <= c.season, bar = KEEP_BAR[clamp(num(t.tier, 3), 0, 3)];
      if (ending && Math.random() < retireChance(c, d)) {
        M.retire.push(d.id); M.drop.push(d.id); M.open.push({ team: t.name, out: d.id, why: 'retire' });
        c.addNews(`${d.name} announces he will retire from Formula 1 at the end of the season${num(d.wins) ? `, after ${d.wins} win${d.wins > 1 ? 's' : ''} in this career` : ''}.`);
      } else if (ending) {
        if (Math.random() < keepChance(c, d, t, best)) M.resign[d.id] = valueOf(c, d) >= bar + 6 || young(c, d) ? 2 : Math.random() < 0.5 ? 1 : 2;
        else { M.drop.push(d.id); M.open.push({ team: t.name, out: d.id, why: 'expire' }); }
      } else if (valueOf(c, d) < bar - 6 && formOf(d, c.season) < -2 && Math.random() < 0.4) { M.drop.push(d.id); M.open.push({ team: t.name, out: d.id, why: 'early' }); }
    }
  }
  // (the paddock hears it first: the biggest decisions in the news)
  for (const x of M.open.filter((o) => o.why !== 'retire').slice(0, 4)) { const d = c.drivers[x.out]; if (d) c.addNews(x.why === 'early' ? `Silly season: ${x.team} are ready to release ${d.name} a year early.` : `Silly season: ${x.team} will not renew ${d.name}'s contract.`); }
  return M;
}
/**
 * The winter (Career.nextSeason, the season already turned): the market's decisions carried out, your seat, your
 * team-mate, every seat filled, the silly season's poaching, and the check that every team has exactly two drivers.
 * A save from before the market (no plan) decides on the spot.
 */
export function marketNewSeason(c) {
  const M = marketEnsure(c), S = seatEnsure(c), planned = M.planned === c.season - 1, me = c.drivers[c.playerId];
  const say = S?.mateSay && S.mateSay.why === 'season' && S.mateSay.season === c.season - 1 ? S.mateSay : null;
  const locked = new Set(), renewed = new Set();
  // 1. the contracts that ran out (and the drivers released early): kept as decided, or gone - your say over your team-mate counts here
  for (const d of Object.values(c.drivers || {})) {
    if (!d.alive || d.id === c.playerId || !d.team) continue;
    const t = c.teams[d.team]; if (!t) { d.team = null; d.contract = null; continue; }
    const k = d.contract, ended = !k || num(k.until, c.season) < c.season, early = planned && M.drop.includes(d.id) && !ended;
    if (!ended && !early) continue;
    // (a veteran who said he would stop: he stops - your say can't keep him)
    if (planned && arr(M.retire).includes(d.id)) { d.retired = c.season - 1; t.seats = t.seats.filter((x) => x !== d.id); d.team = null; d.contract = null; c.addNews(`${d.name} has raced for the last time: he retires from Formula 1.`); continue; }
    let keep = !early && (planned ? M.resign[d.id] != null : Math.random() < keepChance(c, d, t));
    // (your say counts only if you are staying: signed again, or under contract)
    const stays = S?.status === 'driver' && S.team === t.name && (S.next ? S.next.team === t.name : num(me?.contract?.until, 0) >= c.season);
    const mineSay = !!say && stays && say.team === t.name && say.out === d.id;
    if (mineSay) { keep = say.pick === d.id; locked.add(d.id); }
    if (keep && early) continue;
    if (keep) {
      const yrs = num(M.resign[d.id], young(c, d) ? 2 : 1) || 1, sal = half((num(k?.salary, askOf(c, d)) + askOf(c, d)) / 2);
      d.contract = { ...(k || {}), salary: sal, until: c.season + yrs - 1, role: k?.role || 'equal' };
      renewed.add(d.id);
      c.addNews(`${d.name} stays at ${t.name}: a new contract to the end of ${d.contract.until}${mineSay && say.result === 'won' ? `, with ${me?.name}'s backing` : ''}.`);
    } else release(c, d, t, early ? 'early' : 'expire');
  }
  // 2. your own seat over the winter: signed again, elsewhere, or none (Career._seatNewSeason)
  safe('seatNewSeason', () => c._seatNewSeason?.());
  // 3. the seat beside you, as the team and your say chose
  if (say && S.status === 'driver' && S.team === say.team && say.pick !== say.out) {
    const p = c.drivers[say.pick], t = c.teams[say.team];
    if (t && c.seatsOf(t.name).length < 2 && p && p.alive && !out(c, p) && (!p.team || p.team === t.name)) {
      if (signInto(c, t.name, p, 'winter')) { locked.add(p.id); if (say.result === 'won') c.addNews(`${p.name} joins ${t.name} alongside ${me?.name}, who pushed for him.`); }
    }
  }
  if (S) S.mateSay = null;
  // 4. every seat still open, the front-runners choosing first
  fillAll(c, 'winter');
  // 5. silly season: a team swaps its weakest driver for a clearly better one - free, or bought out of a smaller team
  safe('silly season', () => sillySeason(c, new Set([...locked, ...renewed])));
  // 6. the check: two drivers a team, nobody twice, nobody dead or banned
  marketSanity(c);
  M.resign = {}; M.drop = []; M.open = []; M.retire = []; M.mid = 0; M.midSeason = c.season;
}
/** the silly season's poaching: a team replaces its weakest driver (not you, not one kept or chosen this winter) with a clearly better one - a free agent, or bought out of a smaller team (half the time), which fills its own seat */
function sillySeason(c, locked) {
  for (const t of shuffle(Object.values(c.teams || {}))) {
    const seats = c.seatsOf(t.name); if (seats.length < 2) continue;
    const weak = seats.filter((d) => d.id !== c.playerId && !locked.has(d.id)).sort((a, b) => a.rating - b.rating)[0]; if (!weak) continue;
    const target = Object.values(c.drivers).filter((d) => d.alive && !d.retired && d.id !== c.playerId && d.team !== t.name && !locked.has(d.id) && !out(c, d) && d.rating > weak.rating + 0.025)
      .filter((d) => !d.team || (c.teams[d.team] && c.teams[d.team].tier > t.tier && Math.random() < 0.5)).sort((a, b) => b.rating - a.rating)[0];
    if (!target || Math.random() > 0.55) continue;
    const from = target.team;
    if (from) { c.teams[from].seats = c.teams[from].seats.filter((x) => x !== target.id); c.teams[from].budget = r1(num(c.teams[from].budget) + 4); }
    target.team = null;
    c.sign(t.name, target.id, askOf(c, target), 2, seats.indexOf(weak), { role: target.rating - (seats.find((d) => d !== weak)?.rating ?? 0) >= 0.04 ? 'lead' : 'equal' });
    c.addNews(`Silly season: ${target.name} moves${from ? ` from ${from}` : ''} to ${t.name}, replacing ${weak.name}.`);
    locked.add(target.id);
    if (from) fillAll(c, 'winter');
  }
}
/**
 * Every team exactly two drivers (more: the lowest-rated who is not you goes; fewer: filled from the pool), nobody listed
 * twice or by a team his record does not name, nobody dead in a seat; you in your team's seats whenever you drive for it.
 */
export function marketSanity(c) {
  const seen = new Set(), me = c.drivers?.[c.playerId];
  for (const t of Object.values(c.teams || {})) {
    t.seats = [...new Set(arr(t.seats))].filter((id) => { const d = c.drivers[id]; if (!d || !d.alive || d.team !== t.name || seen.has(id)) return false; seen.add(id); return true; });
    while (t.seats.length > 2) {
      const x = t.seats.map((i) => c.drivers[i]).filter((d) => d.id !== c.playerId).sort((a, b) => a.rating - b.rating)[0]; if (!x) break;
      release(c, x, t, 'extra');
    }
  }
  for (const d of Object.values(c.drivers || {})) if (d.team && !seen.has(d.id)) {
    if (d.id === c.playerId && d.alive && c.teams[d.team]) { const t = c.teams[d.team]; if (t.seats.length >= 2) { const x = t.seats.map((i) => c.drivers[i]).sort((a, b) => a.rating - b.rating)[0]; if (x) release(c, x, t, 'extra'); } t.seats.unshift(d.id); seen.add(d.id); }
    else { d.team = null; d.contract = null; }
  }
  if (me && me.alive && me.team && c.myTeam !== me.team && c.seat?.status === 'driver') c.myTeam = me.team;
  fillAll(c, 'winter');
}
/** the seats that open next season (the market's plan at the season's end) -> [{ team, out, why }] */
export function openSeats(c) { const M = c?.market; return M && M.planned === c.season ? arr(M.open) : []; }
/** for the tests and the hub: a kind of team in words */
export const tierWord = (t) => ({ front: 'a front-runner', mid: 'a midfield team', back: 'a backmarker' }[kindOf(num(t?.tier, 3))]);
