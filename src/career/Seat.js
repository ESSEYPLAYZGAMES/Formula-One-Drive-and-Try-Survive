// Your seat (a career): you are a driver, never the owner. You hold a contract with a team - a salary, the years it
// runs and your standing in the garage (number one, equal, number two) - and the team is not yours, nor is its money.
// What it thinks of you is one number, management confidence (0-100), moved after every race you drive by the signals
// below: your result against what the team expected of you (by the car, your rating and the team's ambition), the
// head-to-head with your team-mate, the crashes you cause, the stewards' points and bans, team orders you ignore and
// the team-mate you hit, the scandals in the papers, and the good days - wins, podiums, Driver of the Day. Fall below
// the team's danger line and the warnings come first (your agent, the news, the press pen, then the final warning:
// one more race); stay below its cut line and the seat goes to the reserve. A front-runner gives a rookie two races
// (Red Bull and Liam Lawson, 2025), the midfield half a season, a backmarker longer - but a driver who is always
// beaten by his team-mate is replaced anywhere. Then you are a free agent: the rounds go on without you, your agent
// looks for a seat (a backmarker's mid-season call now and then, a reserve role, offers at the season's end by your
// reputation), and an offer accepted puts you back in a car.
//
// The career starts here too: your own rookie, a junior academy (the real ones, below - easy to edit) and about three
// offers, mostly midfield and backmarker seats linked to the academy, now and then a front-runner's (Verstappen in
// 2016, Antonelli in 2025): big money, brutal patience. Plain data and functions on the career's plain JSON (c.seat);
// career/Career.js signs the contracts and runs the races. Bargaining power (leverage, below) is what you have to
// spend: your results against what the team expected and your place in the championship, your name and image, the
// teams that want you (an approach or an offer in hand: the strongest lever of all), your personal sponsors, your
// standing in the garage and what the team thinks of you - and what you have already asked of it (goodwill). It buys a
// say over the car's development, your team-mate and your contract's terms (career/Say.js); the market around you -
// contracts running out, the seats that open, the rival teams that approach you - is career/Market.js.
import { pushText } from './Social.js';
import { paddockOf, conflictOf, CELEB } from './Celebs.js';
import { prEvent, crisisFrom, fameIndex } from './PR.js';

// ---- small helpers ----------------------------------------------------------------------------------------------------
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const half = (v) => Math.max(0.5, Math.round(v * 2) / 2);
const pick = (a) => a[(Math.random() * a.length) | 0];
const last = (n) => String(n || '').split(' ').pop();
const arr = (v) => (Array.isArray(v) ? v : []);
const safe = (what, f, fb = null) => { try { return f(); } catch (e) { console.warn(`Seat: ${what} failed`, e); return fb; } };

// ---- the academies (real F1 junior programmes; edit freely) -----------------------------------------------------------
/**
 * Each: id, name, short (for buttons), color, blurb (one line on how it brings drivers up), teams: [[team, link]] -
 * the seats it can open for you: 'own' (the academy's own team), 'sister' (a second team of the same owner),
 * 'customer' (a team that runs its power unit) - and top: the chance its own front-running team offers a rookie
 * the race seat straight away (only an academy whose own team is a front-runner). Team names are the roster's.
 */
export const ACADEMIES = [
  { id: 'redbull', name: 'Red Bull Junior Team', short: 'Red Bull', color: '#1e3a8a', top: 0.3,
    blurb: 'The most ruthless ladder in the sport: Vettel, Ricciardo, Verstappen. Promotion comes fast - Verstappen was in the senior team at 18 - and so does the axe.',
    teams: [['Red Bull Racing', 'own'], ['Racing Bulls', 'sister']] },
  { id: 'ferrari', name: 'Ferrari Driver Academy', short: 'Ferrari', color: '#e8002d', top: 0.12,
    blurb: 'Maranello places its juniors at a customer team first - Leclerc at Sauber, Bearman at Haas - and calls them up when they are ready.',
    teams: [['Ferrari', 'own'], ['Haas', 'customer'], ['Cadillac', 'customer']] },
  { id: 'mercedes', name: 'Mercedes Junior Programme', short: 'Mercedes', color: '#27c7b0', top: 0.22,
    blurb: 'Russell served three years at Williams first; Antonelli went straight into Hamilton\'s seat at eighteen.',
    teams: [['Mercedes', 'own'], ['Williams', 'customer'], ['Alpine', 'customer']] },
  { id: 'mclaren', name: 'McLaren Driver Development', short: 'McLaren', color: '#ff8000', top: 0.18,
    blurb: 'A small programme that backs its own: Lando Norris went from F2 straight into a McLaren in 2019.',
    teams: [['McLaren', 'own']] },
  { id: 'alpine', name: 'Alpine Academy', short: 'Alpine', color: '#ff5fb0', top: 0,
    blurb: 'Enstone\'s juniors: a reserve role, simulator miles - and a race seat at Alpine when one opens.',
    teams: [['Alpine', 'own']] },
  { id: 'williams', name: 'Williams Driver Academy', short: 'Williams', color: '#0a2aa8', top: 0,
    blurb: 'Franco Colapinto came through it to a mid-season seat at Monza in 2024. Grove gives its juniors a real chance.',
    teams: [['Williams', 'own']] },
  { id: 'aston', name: 'Aston Martin Driver Development', short: 'Aston Martin', color: '#00665e', top: 0,
    blurb: 'Silverstone\'s young drivers learn beside a double world champion - and wait for a seat in a team building to win.',
    teams: [['Aston Martin', 'own']] },
  { id: 'audi', name: 'Audi Driver Development (the Sauber Academy)', short: 'Audi', color: '#151515', top: 0,
    blurb: 'Hinwil has given rookies their first race seat for decades - Räikkönen, Massa, Leclerc - and Audi keeps the habit.',
    teams: [['Audi', 'own']] },
];
export const ACADEMY_BY_ID = Object.fromEntries(ACADEMIES.map((a) => [a.id, a]));

// ---- the three kinds of seat ------------------------------------------------------------------------------------------
/** a team's tier as the seat reads it: 0 a front-runner, 1-2 the midfield, 3 a backmarker */
export const kindOf = (tier) => (num(tier, 3) <= 0 ? 'front' : num(tier, 3) >= 3 ? 'back' : 'mid');
export const KIND_NAME = { front: 'Front-runner', mid: 'Midfield', back: 'Backmarker' };
/** the finishing position a team wants from its driver by its tier, before your car and rating are weighed in */
export const DEMAND = [3, 7, 9, 13];
/**
 * How each kind of team treats its driver: start (confidence on signing), danger (below it the warnings come), cut
 * (below it, after the final warning, the seat goes), minRaces (the fewest races before a cut), fast (the first
 * warning can be the final one when it is already that bad), mateRule (only cut a driver his team-mate keeps
 * beating, unless it is far worse than the line), the expectations in words, and its patience in words.
 */
export const SEAT_RULES = {
  front: { start: 60, danger: 46, cut: 32, minRaces: 2, fast: true, mateRule: false,
    expect: 'Podiums from the start, wins when the car allows, and beat your team-mate.',
    patience: 'Two races. A front-runner does not wait: a warning, one more race, and the reserve is in the car.' },
  mid: { start: 62, danger: 38, cut: 25, minRaces: 5, fast: false, mateRule: false,
    expect: 'Regular points, and stay close to your team-mate.',
    patience: 'About half a season. Two warnings first - then the seat goes.' },
  back: { start: 66, danger: 32, cut: 20, minRaces: 6, fast: false, mateRule: true,
    expect: 'Beat your team-mate, and score when the car allows.',
    patience: 'The most patient seat on the grid - but a driver his team-mate keeps beating is still replaced.' },
};
/**
 * Every signal that moves management confidence, with its weight - one place, so phase 2's bargaining power can read
 * the same. result: per place missed against the target (beating it counts resultUp of that; the first tol places
 * missed count half - a midfield team shrugs at a place or two, a front-runner barely); mateBeat / mateLost: the
 * head-to-head this race; h2hRun: a run of defeats to your team-mate over the season (behind by three or more);
 * crash / crashBlame: a retirement you caused (blamed: a collision penalty); penaltyPt: each penalty point; ban: twelve
 * points; licence9: nine or more on the licence; orders: team orders (race/TeamOrders.js subs); mateContact /
 * mateCrash: contact with your team-mate; heat: the press heat lines; scandal: a story about you in the papers this
 * round; coiCeo / coiAgent: a relationship with the team's chief executive (or your own agent) in the papers;
 * dotd, fastest, pole, overtakes: the good days; drift: how far confidence settles back toward where it started, a
 * race (the team forgets a little); max: no one race moves it more than this either way.
 */
export const CONF_W = {
  result: { front: 2.0, mid: 1.4, back: 1.0 }, resultUp: 0.6, tol: { front: 1, mid: 2, back: 2 },
  win: { front: 8, mid: 12, back: 15 }, podium: { front: 4, mid: 7, back: 10 }, points: { front: 0, mid: 1.5, back: 3 },
  mateBeat: { front: 3, mid: 3, back: 4 }, mateLost: { front: 4, mid: 3, back: 4.5 }, h2hRun: { front: 2, mid: 2, back: 3 },
  crash: 6, crashBlame: 10,
  penaltyPt: 1, ban: 10, licence9: 2,
  orders: { youRefused: -10, youBrokeHold: -8, youHeldUp: -10, youHit: -15, youObeyed: 3, youSacrificed: 5, clash: -4 },
  mateContact: -5, mateCrash: -12,
  heat: [[60, -3], [40, -1.5]], scandal: -3, coiCeo: -8, coiAgent: -2,
  dotd: 4, fastest: 1.5, pole: 3, overtakes: 2,
  drift: 0.06, max: 30,
};
/** the crises that are the papers' scandals (career/PR.js crisis kinds): the team reads them too */
const SCANDALS = new Set(['scandal', 'brawl', 'paps', 'nightout', 'cruel', 'feud']);

/** how far a team's own ambition (DEMAND) pulls its target from what the car and your rating promise: a front-runner halfway, a backmarker a quarter */
export const AMBITION = { front: 0.5, mid: 0.35, back: 0.25 };
/** the race a team wants from you: between what the car and your rating promise (exp) and its own ambition */
export function seatTarget(tier, exp) {
  const t = clamp(Math.round(num(tier, 3)), 0, 3), d = DEMAND[t], e = num(exp, d), w = AMBITION[kindOf(t)];
  return clamp(Math.round(e * (1 - w) + d * w), 1, 20);
}
/** management confidence in words: { k: 'delighted' | 'happy' | 'impatient' | 'danger' | 'final', text, short (for a tile), color } */
export function confLabel(conf, warn = 0, tier = 3) {
  const K = SEAT_RULES[kindOf(tier)], v = num(conf, 60);
  if (warn >= 2 && v < K.danger + 10) return { k: 'final', text: 'Final warning: one more race', short: 'final warning', color: '#c0262d' };
  if (v < K.danger) return { k: 'danger', text: 'Your seat is in danger', short: 'seat in danger', color: '#e5484d' };
  if (v < 55) return { k: 'impatient', text: 'The team is getting impatient', short: 'impatient', color: '#e39a1b' };
  if (v < 75) return { k: 'happy', text: 'The team is happy', short: 'happy', color: '#3d7bd9' };
  return { k: 'delighted', text: 'The team is delighted', short: 'delighted', color: '#1fae64' };
}

// ---- the seat's state ---------------------------------------------------------------------------------------------------
/**
 * c.seat: { status: 'rookie' (offers on the table, no car yet) | 'driver' | 'reserve' | 'free', academy, team, tier,
 * conf, warn (0, 1 warned, 2 the final warning), races (driven at this team), since: { season, round }, praised,
 * log: [{ season, round, d, conf, f: [[key, delta, words]] }] (the last races, for the hub), offers: [offer],
 * next (an offer accepted for next season: a renewal, a market seat, a rival's pre-contract), notice ({ kind, text,
 * season, round, seen }: the hub's plain words on the latest beat), history: [{ team, from, to, how }], firedFrom,
 * coiSeen, scandalSeen, and the say you have (career/Say.js, career/Market.js): goodwill (-40..25: favours asked of
 * the team, and the ones it owes you), requests ([request]: the parts you asked for, and how they turned out),
 * interest ({ team: { season, round, kind } }: the rival teams that approached you), mateSay (a seat opening beside
 * you: the shortlist and your say), leak (a pre-contract signed elsewhere, and whether the paddock knows) }
 */
export function newSeat(o = {}) {
  return { status: o.status || 'free', academy: o.academy || null, team: o.team || null, tier: num(o.tier, 3), conf: num(o.conf, 60), warn: 0, races: 0,
    since: o.since || null, praised: false, log: [], offers: arr(o.offers), next: null, notice: null, history: arr(o.history), firedFrom: null, coiSeen: {}, scandalSeen: null, requests: [],
    goodwill: 0, interest: {}, mateSay: null, leak: null };
}
/** an offer's kind as phase 2 names them (a save from before: 'renew' was a renewal, 'seat' a market seat) */
export const offerKind = (k) => (k === 'renew' ? 'renewal' : ['first', 'seat', 'renewal', 'precontract', 'buyout', 'midseason', 'reserve'].includes(k) ? k : 'seat');
/** an older or damaged seat filled in (never throws) -> c.seat */
export function seatEnsure(c) {
  if (!c) return null;
  const S = c.seat && typeof c.seat === 'object' && !Array.isArray(c.seat) ? c.seat : (c.seat = newSeat());
  const d = newSeat(); for (const k of Object.keys(d)) if (S[k] === undefined) S[k] = d[k];
  if (!['rookie', 'driver', 'reserve', 'free'].includes(S.status)) S.status = 'free';
  S.conf = clamp(num(S.conf, 60), 0, 100); S.warn = clamp(Math.round(num(S.warn, 0)), 0, 2); S.races = Math.max(0, Math.round(num(S.races, 0)));
  for (const k of ['log', 'offers', 'history', 'requests']) S[k] = arr(S[k]);
  if (!S.coiSeen || typeof S.coiSeen !== 'object') S.coiSeen = {};
  S.offers = S.offers.filter((o) => o && typeof o === 'object' && c.teams?.[o.team]);
  // (phase 2: every offer's kind by its new name, a release clause and whether it can be talked over; the say's state)
  for (const o of [...S.offers, S.next].filter((x) => x && typeof x === 'object')) {
    o.kind = offerKind(o.kind);
    if (o.kind !== 'reserve' && !(num(o.releaseClause, 0) > 0)) o.releaseClause = clauseFor(o.salary, o.years, o.tier);
    if (typeof o.negotiable !== 'boolean') o.negotiable = !['first', 'reserve'].includes(o.kind);
  }
  if (S.next && !c.teams?.[S.next.team]) S.next = null;
  S.goodwill = clamp(num(S.goodwill, 0), -40, 25);
  if (!S.interest || typeof S.interest !== 'object' || Array.isArray(S.interest)) S.interest = {};
  if (S.mateSay && (typeof S.mateSay !== 'object' || !Array.isArray(S.mateSay.cands))) S.mateSay = null;
  if (S.leak && typeof S.leak !== 'object') S.leak = null;
  const k = c.drivers?.[c.playerId]?.contract; if (k && k.role !== 'reserve' && !(num(k.releaseClause, 0) > 0)) k.releaseClause = clauseFor(k.salary, Math.max(1, num(k.until, c.season) - num(c.season, 2026) + 1), S.tier);
  return S;
}
/**
 * A contract's release clause ($M): what another team must pay to take you while it runs - by the money, the years left
 * and the team's tier (a front-runner prices its driver highest). Your agent wants it low (freedom), the team high.
 */
export function clauseFor(salary, years = 1, tier = 3) {
  const t = clamp(Math.round(num(tier, 3)), 0, 3);
  return half(num(salary, 1) * Math.max(1, num(years, 1)) * [2.2, 1.8, 1.5, 1.2][t] + [6, 4, 3, 2][t]);
}
/** an offer still on the table (not lapsed: its expiry, { season, round }, not passed) */
export const liveOffer = (c, o) => !!o && (!o.expires || o.expires.season > c.season || (o.expires.season === c.season && o.expires.round >= c.round));
/** what the team expects of you, as an offer card and the hub say it */
export function expectText(tier) { const K = SEAT_RULES[kindOf(tier)]; return { expect: K.expect, patience: K.patience }; }

// ---- reputation and offers ------------------------------------------------------------------------------------------------
/**
 * What the paddock makes of you, 0-100 - the offers your agent can find: your rating, your results (wins, podiums,
 * points over the career), your public image and following, and how your last team rated you (a seat lost this
 * season counts against you)
 */
export function repOf(c) {
  const me = c?.drivers?.[c?.playerId]; if (!me) return 0;
  const S = c.seat || {}, P = c.pr || {};
  const rating = clamp((num(me.rating, 0.8) - 0.76) / 0.18, 0, 1) * 45;
  const results = Math.min(25, num(me.wins) * 5 + num(me.podiums) * 2 + num(me.careerPts) / 20);
  const pr = clamp(num(P.image, 0), -50, 50) / 50 * 8 + Math.min(8, num(P.fame, 0.2) * 2);
  const conf = S.status === 'driver' ? (num(S.conf, 60) - 55) / 4 : 0;
  const fired = S.firedFrom && arr(S.history).some((h) => h.how === 'fired' && h.to?.season === c.season) ? -8 : 0;
  return Math.round(clamp(rating + results + pr + conf + fired + 10, 0, 100));
}
/** the driver a team would let go to make room for you: the lower-rated of its two (never you) -> driver | null */
const seatOf = (c, team) => (c.teams?.[team]?.seats || []).map((i) => c.drivers[i]).filter((d) => d && d.alive && d.id !== c.playerId).sort((a, b) => a.rating - b.rating)[0] || null;
const offerId = (c, k, team) => `${k}-${c.season}-${c.round}-${String(team).toLowerCase().replace(/[^a-z]/g, '')}-${(Math.random() * 1e6) | 0}`;
/** a salary for you at a team of this tier: by your rating, the tier, and (for a market offer) your reputation */
const payFor = (c, tier, kind, rep) => {
  const me = c.drivers[c.playerId], t = clamp(Math.round(num(tier, 3)), 0, 3), jit = 0.85 + Math.random() * 0.3;
  if (kind === 'rookie') return half([5, 2.5, 2, 1.2][t] * jit);
  if (kind === 'reserve') return half([1, 0.8, 0.6, 0.5][t] * jit);
  const ask = Math.max(0.5, (num(me?.rating, 0.8) - 0.72) * 80);
  return half(Math.max([5, 3, 2.2, 1.4][t] * (0.6 + rep / 100), ask * [0.9, 0.7, 0.55, 0.45][t] * (0.7 + rep / 200)) * jit);
};
/** your standing in the garage at that team: number one over a clearly slower team-mate, number two to a clearly quicker one */
const roleAt = (c, team, rookie = false) => {
  const me = c.drivers[c.playerId], o = seatOf(c, team), mate = (c.teams[team]?.seats || []).map((i) => c.drivers[i]).filter((d) => d && d.alive && d.id !== c.playerId && d !== o)[0] || null;
  const g = num(me?.rating, 0.8) - num(mate?.rating, 0.8);
  if (rookie) return g > 0.03 ? 'equal' : 'support';
  return g > 0.03 ? 'lead' : g < -0.03 ? 'support' : 'equal';
};
/**
 * One offer: { id, kind, team, tier, front (a front-runner's), salary, years, role, winBonus, podiumBonus, seatOf (the
 * driver it replaces) and seatName, expect / patience (the team's words), from ('academy' | 'agent' | 'team'), next (it
 * starts next season), expires ({ season, round } it lapses after, or null), note (one line on how it came about),
 * releaseClause (what another team would have to pay to take you while it runs, $M), negotiable (its terms can be
 * talked over at the table: ui/Negotiation.js), buyoutFee (a rival paying your current team's release clause) }.
 * kind: 'first' (a rookie's academy offer) | 'seat' (a race seat from the market) | 'renewal' (your team's new
 * contract) | 'precontract' (a rival's seat for next season, signed now) | 'buyout' (the same, your release clause
 * paid) | 'midseason' (a rival wants you now) | 'reserve' (a reserve role)
 */
export function makeOffer(c, team, o = {}) {
  const t = c.teams?.[team]; if (!t) return null;
  const kind = offerKind(o.kind || (o.rookie ? 'first' : 'seat')), tier = t.tier, rep = num(o.rep, repOf(c)), out = kind === 'reserve' || kind === 'renewal' ? null : o.seatOf !== undefined ? (c.drivers[o.seatOf] || null) : seatOf(c, team), T = expectText(tier);
  const years = kind === 'reserve' ? 1 : num(o.years, kindOf(tier) === 'front' ? 1 : 2), salary = num(o.salary, payFor(c, tier, o.rookie ? 'rookie' : kind, rep));
  return {
    id: offerId(c, kind, team), kind, team, tier, front: kindOf(tier) === 'front' && kind !== 'reserve', salary, years,
    role: kind === 'reserve' ? 'reserve' : o.role || roleAt(c, team, !!o.rookie), winBonus: kind === 'reserve' ? 0 : [0.5, 0.75, 1, 1][clamp(tier, 0, 3)], podiumBonus: kind === 'reserve' ? 0 : [0.15, 0.3, 0.5, 0.5][clamp(tier, 0, 3)],
    seatOf: out?.id || null, seatName: out?.name || null, expect: kind === 'reserve' ? 'Be ready: if one of its race drivers is hurt or banned, the car is yours for the weekend.' : T.expect,
    patience: kind === 'reserve' ? 'A reserve is judged on the weekends he gets - and is first in line when a seat opens.' : T.patience,
    from: o.from || 'agent', next: !!o.next, expires: o.expires || null, note: o.note || '',
    releaseClause: kind === 'reserve' ? 0 : num(o.releaseClause, clauseFor(salary, years, tier)), negotiable: typeof o.negotiable === 'boolean' ? o.negotiable : !['first', 'reserve'].includes(kind), buyoutFee: num(o.buyoutFee, 0),
  };
}
/**
 * The first offers of a rookie career (the academy's teams; ~3): mostly midfield and backmarker seats linked to the
 * academy, its own front-running team now and then (by its top chance - the Verstappen 2016 / Antonelli 2025 route),
 * and a wild call from a front-runner outside it very rarely; the rest of the three from teams the agent knows
 * (the backmarkers and the lower midfield). -> [offer]
 */
export function rookieOffers(c, academyId, n = 3) {
  const A = ACADEMY_BY_ID[academyId] || ACADEMIES[0], T = c.teams || {}, out = [], used = new Set();
  const add = (team, note, from = 'academy') => { if (out.length >= n || used.has(team) || !T[team]) return; const o = makeOffer(c, team, { rookie: true, from, note }); if (o) { used.add(team); out.push(o); } };
  const own = A.teams.filter(([tm]) => T[tm]), top = own.filter(([tm]) => T[tm].tier <= 0);
  // (the call-up: the academy's own front-runner, by its chance - or, very rarely, someone else's)
  if (top.length && Math.random() < num(A.top, 0)) add(top[0][0], `${A.short}'s own team wants you in the race seat at once.`);
  else if (Math.random() < 0.05) { const fr = Object.values(T).filter((t) => t.tier <= 0 && !own.some(([tm]) => tm === t.name)); if (fr.length) add(pick(fr).name, 'A front-runner outside the academy has been watching you.', 'agent'); }
  // (the academy's other seats: its own midfield or backmarker team, the sister team, the customers)
  for (const [tm, link] of own.filter(([tm]) => T[tm].tier > 0).sort(() => Math.random() - 0.5)) add(tm, link === 'own' ? `${A.short}'s own team.` : link === 'sister' ? `${A.short}'s sister team.` : `A ${A.short} customer team.`);
  // (and the teams the agent knows: the backmarkers first, then the lower midfield)
  const rest = Object.values(T).filter((t) => !used.has(t.name)).sort((a, b) => b.tier - a.tier || Math.random() - 0.5);
  for (const t of rest) { if (out.length >= n) break; if (t.tier >= 2 || Math.random() < 0.3) add(t.name, 'Your agent\'s contacts.', 'agent'); }
  for (const t of rest) add(t.name, 'Your agent\'s contacts.', 'agent');
  return out;
}
/**
 * Offers from the market by your reputation (excluding o.not, the team you drive for): how many (1-3) and how high
 * up the grid they come from - for next season, the seats that open first (the market's plan at the season's end,
 * career/Market.js c.market.open: a driver whose contract runs out and is not kept), then a team that would make room
 * for you. kind: 'season' (for next season) | 'mid' (now). -> [offer]
 */
export function marketOffers(c, o = {}) {
  const rep = repOf(c), n = num(o.n, rep >= 65 ? 3 : rep >= 40 ? 2 : 1), best = rep >= 78 ? 0 : rep >= 58 ? 1 : rep >= 40 ? 2 : 3;
  const open = o.kind === 'season' && c.market?.season === c.season ? arr(c.market.open) : [], openAt = new Map(open.filter((x) => x && c.teams?.[x.team]).map((x) => [x.team, x.out || null]));
  const T = Object.values(c.teams || {}).filter((t) => t.name !== o.not && (openAt.has(t.name) || seatOf(c, t.name)));
  const L = T.filter((t) => t.tier >= best).sort((a, b) => (openAt.has(b.name) - openAt.has(a.name)) * 2 + a.tier - b.tier + (Math.random() - 0.5) * 2.2), out = [];
  for (const t of L) {
    if (out.length >= n) break;
    const of = makeOffer(c, t.name, { rep, from: 'agent', next: o.kind === 'season', expires: o.expires || null, note: o.note || '', ...(openAt.has(t.name) ? { seatOf: openAt.get(t.name) } : {}) });
    if (of) { if (openAt.has(t.name) && of.seatName) of.note = `${of.seatName}'s seat: the contract runs out and ${t.name} are not keeping him.`; out.push(of); }
  }
  return out;
}

// ---- the agent and the team, in your phone ------------------------------------------------------------------------------
/** your agent (career/Paddock.js: the paddock's 'myagent', registered by career/Celebs.js) -> { id, name, first } | null */
export function agentOf(c) {
  const R = safe('paddockOf', () => paddockOf(c)), id = R?.myagent, K = id ? CELEB[id] : null;
  return K ? { id, name: K.name, first: String(K.name).split(' ')[0] } : null;
}
/** a text from your agent (o.boss: from the team principal instead) - never in a grave week (Social.pushText) */
export function agentText(c, text, o = {}) {
  if (!text) return null;
  if (o.boss) return safe('pushText boss', () => pushText(c, 'x:boss', text));
  const A = agentOf(c); return A ? safe('pushText agent', () => pushText(c, `c:${A.id}`, text)) : null;
}
const notice = (c, kind, text) => { c.seat.notice = { kind, text, season: c.season, round: c.round, seen: false }; };

// ---- a race you drove: the signals, confidence, the beats -------------------------------------------------------------------
/**
 * The race as the team saw it -> [[key, delta, words]]. R: { pos, fin, crash, blame, exp (your expected place), mate:
 * { pos, fin, exp } | null, pts (penalty points this race), banned, licence (points on it now), orders (your
 * team-order story's sub), mateContact ({ sev, crash } | null), dotd, fastest, pole, overtakes, points (scored) }.
 */
export function seatSignals(c, R) {
  const S = c.seat, tier = num(S?.tier, 3), k = kindOf(tier), W = CONF_W, out = [], add = (key, d, why) => { if (d) out.push([key, r1(d), why]); };
  const target = seatTarget(tier, R.exp), fin = !!R.fin;
  // (the result against the target - the heaviest signal: a place missed costs more than a place gained earns)
  if (fin) {
    const g = clamp(target - num(R.pos, 20), -8, 8), tl = W.tol[k], miss = g < 0 ? (-g <= tl ? g * 0.5 : -tl * 0.5 + (g + tl)) : 0;
    add('result', g < 0 ? miss * W.result[k] : g * W.result[k] * W.resultUp, g < 0 ? `P${R.pos}: the team wanted P${target} or better` : g > 0 ? `P${R.pos}: better than the P${target} they wanted` : `P${R.pos}: what they wanted`);
    if (R.pos === 1) add('win', W.win[k], 'A win'); else if (R.pos <= 3) add('podium', W.podium[k], 'A podium');
    else if (R.points && W.points[k]) add('points', W.points[k], 'Points for the team');
  } else if (R.crash) add('crash', -(R.blame ? W.crashBlame : W.crash), R.blame ? 'A crash you were blamed for' : 'Out of the race in an accident');
  // (the team-mate: beating a quicker one is worth more; losing to a quicker one costs less; in the midfield close behind is close enough)
  const M = R.mate;
  if (M && fin && M.fin) {
    const gap = num(R.exp, 10) - num(M.exp, 10);
    if (R.pos < M.pos) add('mate', W.mateBeat[k] * clamp(1 + gap / 4, 1, 2), 'Ahead of your team-mate');
    else add('mate', -W.mateLost[k] * clamp(1 - gap * 0.1, 0.4, 1.3) * (k === 'mid' && R.pos - M.pos <= 2 ? 0.5 : 1), 'Behind your team-mate');
  }
  const H = c.h2h, h = H && H.mate && M ? H.r : null;
  if (h && h[1] - h[0] >= 3) add('h2h', -W.h2hRun[k], `Beaten ${h[1]}-${h[0]} by your team-mate this season`);
  // (the stewards: every point, a ban, a licence close to one)
  if (num(R.pts) > 0) add('penalty', -num(R.pts) * W.penaltyPt, `${R.pts} penalty point${R.pts === 1 ? '' : 's'}`);
  if (R.banned) add('ban', -W.ban, 'A one-race ban');
  else if (num(R.licence) >= 9) add('licence', -W.licence9, `${R.licence} points on your licence`);
  // (team orders and your team-mate: the pit wall remembers who listened)
  const o = W.orders[R.orders]; if (o) add('orders', o, { youRefused: 'You ignored team orders', youBrokeHold: 'You broke the hold order', youHeldUp: 'You held your team-mate up', youHit: 'You took your team-mate out', youObeyed: 'You followed team orders', youSacrificed: 'You gave way for the team', clash: 'A collision between the team\'s cars' }[R.orders]);
  if (R.mateContact && R.orders !== 'youHit' && R.orders !== 'clash') add('contact', R.mateContact.crash ? W.mateCrash : W.mateContact, R.mateContact.crash ? 'A crash with your team-mate' : 'Contact with your team-mate');
  // (the papers: the heat around you, a scandal this round, a relationship with the team's chief executive)
  const P = c.pr || {}, heat = num(P.heat, 0), hl = W.heat.find(([v]) => heat >= v);
  if (hl) add('heat', hl[1], `The press heat around you (${Math.round(heat)})`);
  const K = P.crisis; if (K && SCANDALS.has(K.kind) && K.id !== S.scandalSeen && K.season === c.season && K.round >= c.round - 1) { S.scandalSeen = K.id; add('scandal', W.scandal, `In the papers: ${String(K.title || 'a scandal').toLowerCase()}`); }
  for (const [id, b] of Object.entries(c.celebs?.bonds || {})) {
    if (!b?.coi || S.coiSeen[id]) continue;
    const kk = safe('conflictOf', () => conflictOf(c, id)); if (!kk) continue;
    S.coiSeen[id] = true; add('coi', kk === 'ceo' ? W.coiCeo : W.coiAgent, kk === 'ceo' ? 'Dating the team\'s chief executive: in the papers' : 'Dating your own agent: in the papers');
  }
  // (the good days)
  if (R.dotd) add('dotd', W.dotd, 'Driver of the Day');
  if (R.pole) add('pole', W.pole, 'Pole position');
  if (R.fastest) add('fastest', W.fastest, 'The fastest lap');
  if (num(R.overtakes) >= 5) add('overtakes', W.overtakes, `${R.overtakes} overtakes`);
  return out;
}
/**
 * Your race, read by the team (c.seat, a driver's): confidence moves by the signals and settles a little toward where
 * it started; then the beat it brings, if any - 'warn' (below the danger line: a first warning), 'final' (one more
 * race), 'fired' (below the cut line after the final warning, enough races in; a backmarker only cuts a driver his
 * team-mate keeps beating, unless it is far worse), 'eased' (back clear of danger), 'praised' (the team is delighted,
 * once a stint) -> { d, conf, f, beat, target } | null
 */
export function seatRace(c, R) {
  const S = seatEnsure(c); if (!S || S.status !== 'driver') return null;
  const K = SEAT_RULES[kindOf(S.tier)], f = seatSignals(c, R);
  const sum = clamp(f.reduce((a, x) => a + x[1], 0), -CONF_W.max, CONF_W.max), drift = (K.start - S.conf) * CONF_W.drift;
  const c0 = S.conf; S.conf = r1(clamp(S.conf + sum + drift, 0, 100)); S.races++;
  if (Math.abs(drift) >= 0.5) f.push(['drift', r1(drift), drift > 0 ? 'The team gives you time' : 'Settling']);
  S.log.unshift({ season: c.season, round: c.round, d: r1(S.conf - c0), conf: S.conf, f }); if (S.log.length > 12) S.log.length = 12;
  const H = c.h2h?.r || [0, 0], beaten = H[0] + H[1] >= 4 && H[1] / (H[0] + H[1]) >= 0.65;
  let beat = null;
  const cutOk = S.conf < K.cut && S.races >= K.minRaces && (!K.mateRule || beaten || S.conf < K.cut - 10);
  if (S.warn >= 2 && cutOk) beat = 'fired';
  else if (S.conf < K.danger) {
    if (S.warn === 0) { S.warn = K.fast && S.conf < K.cut ? 2 : 1; beat = S.warn === 2 ? 'final' : 'warn'; }
    else if (S.warn === 1 && (S.conf < K.cut + 6 || S.conf <= c0)) { S.warn = 2; beat = 'final'; }
  } else if (S.warn && S.conf >= K.danger + 10) { S.warn = 0; beat = 'eased'; }
  else if (S.conf >= 80 && !S.praised) { S.praised = true; beat = 'praised'; }
  return { d: r1(S.conf - c0), conf: S.conf, f, beat, target: seatTarget(S.tier, R.exp) };
}
/**
 * The beat in the world: news, your agent and the team principal on your phone, a story for the press (career/PR.js:
 * the 'seat' crisis and headlines), the hub's plain words (c.seat.notice). The firing itself is Career.fire's.
 * grave: a round that hurt someone - the team keeps its counsel (nothing but the notice).
 */
export function seatBeat(c, beat, o = {}) {
  const S = c.seat, me = c.drivers[c.playerId], team = S.team || c.myTeam || 'the team', F = last(me?.name), grave = !!o.grave;
  if (!beat) return;
  if (beat === 'warn') {
    notice(c, 'warn', `${team} are getting impatient: your seat is in danger. Better results - and no trouble - or the warnings get worse.`);
    if (grave) return;
    c.addNews(`Pressure on ${me.name}: ${team} are said to be unhappy with their driver's results.`);
    const nx = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal', austin: 'Austin' }[o.next] || 'the next race';
    agentText(c, pick([`Heads up: ${team} are not happy. I'm hearing it from three people. We need a big one at ${nx}.`, `Talked to the team. They're worried, ${F}. Results, and nothing silly off the track. Please.`]));
    safe('crisis seat', () => crisisFrom(c, 'seat', { track: o.track }));
    safe('PR seat warn', () => prEvent(c, 'seat', { sub: 'warn', track: o.track }));
  } else if (beat === 'final') {
    notice(c, 'final', `Final warning from ${team}: one more race. Do not finish where you have been finishing.`);
    if (grave) return;
    c.addNews(`${team} have given ${me.name} a final warning, the paddock hears: one more race to save the seat.`);
    agentText(c, `I'll be straight with you: one more race. That's what ${team} told me. Drive the race of your life.`);
    agentText(c, pick(['One more race. I can\'t protect the seat after that.', 'You know where we are. Next race. Make it count.']), { boss: true });
    // (the final warning is a new story, not a footnote to the first: the old one gives way, its clock with it)
    if (c.pr?.crisis?.kind === 'seat') c.pr.crisis = null;
    safe('crisis seat', () => crisisFrom(c, 'seat', { source: 'final', track: o.track }));
    safe('PR seat final', () => prEvent(c, 'seat', { sub: 'final', track: o.track }));
  } else if (beat === 'eased') {
    notice(c, 'eased', `The pressure is off: ${team} are happy with you again.`);
    if (!grave) { c.addNews(`${me.name} eases the pressure at ${team}.`); agentText(c, 'Whatever you did, keep doing it. The team has stopped asking me awkward questions.'); }
  } else if (beat === 'praised') {
    notice(c, 'praised', `${team} are delighted with you. Your agent says that is worth something when the contract comes up.`);
    if (!grave) { agentText(c, `${team} love you right now. Remember this when we talk about next year.`); safe('PR seat praised', () => prEvent(c, 'seat', { sub: 'praised', track: o.track })); }
  }
}

// ---- a free agent: the agent's search, a round at a time --------------------------------------------------------------------
/**
 * The round turned over without you in a car (free, or a reserve not needed): old offers lapse; your agent may find a
 * backmarker that needs a driver now (rare - better the better your reputation), or a reserve role (a free agent
 * without one, now and then). Texts when something comes in. -> the new offers
 */
export function seatRoundTick(c) {
  const S = seatEnsure(c); if (!S || c.round > c.rounds) return [];
  S.offers = S.offers.filter((o) => liveOffer(c, o));
  if (S.status !== 'free' && S.status !== 'reserve') return [];
  const rep = repOf(c), exp = { season: c.season, round: Math.min(c.rounds, c.round + 1) }, have = new Set(S.offers.map((o) => o.team)), out = [];
  const backs = Object.values(c.teams).filter((t) => t.tier >= 2 && !have.has(t.name) && t.name !== S.firedFrom && seatOf(c, t.name));
  if (backs.length && Math.random() < 0.05 + rep / 900) {
    const t = pick(backs), of = makeOffer(c, t.name, { rep, from: 'agent', expires: exp, note: `${t.name} have lost patience with ${seatOf(c, t.name)?.name || 'a driver'} and want you in the car now.` });
    if (of) { of.years = 1; out.push(of); }
  }
  if (S.status === 'free' && !S.offers.some((o) => o.kind === 'reserve') && Math.random() < (S.firedFrom && c.round - num(S.firedAt?.round, 0) <= 1 ? 0.55 : 0.2) && rep >= 20) {
    const R = Object.values(c.teams).filter((t) => t.name !== S.firedFrom && !have.has(t.name)), t = R.length ? pick(R) : null;
    const of = t ? makeOffer(c, t.name, { kind: 'reserve', rep, from: 'agent', expires: exp, note: `${t.name} need a reserve driver: the simulator, the Friday sessions, the car when a race driver can't.` }) : null;
    if (of) out.push(of);
  }
  if (out.length) {
    S.offers.push(...out);
    const o = out[0], A = agentOf(c);
    agentText(c, o.kind === 'reserve' ? `Not a race seat, but it's a way back in: ${o.team} want you as their reserve. Have a look.` : `Good news for once: ${o.team} want you in the car. From the next race. Call me.`);
    c.addNews(o.kind === 'reserve' ? `${c.drivers[c.playerId].name} is in talks to become ${o.team}'s reserve driver${A ? `, says ${A.name}` : ''}.` : `${o.team} approach ${c.drivers[c.playerId].name} for a race seat.`);
  }
  return out;
}

// ---- the season's end: your contract, and the market -----------------------------------------------------------------------
/**
 * The last race run (c.round past the calendar): your team decides - renew a contract that is ending if it is happy
 * (an offer on the table), let it run out if not, release you with years left if it has given up on you - and your
 * agent brings what the market offers, by your reputation (the seats that open first). Everything waits for NEXT
 * SEASON (Career.nextSeason); a renewal and a market seat can be talked over first (negotiable). A pre-contract signed
 * during the season stands: you are leaving ('leaving'), and the paddock is told.
 * -> { verdict: 'continue' | 'renew' | 'expire' | 'release' | 'free' | 'leaving', offers }
 */
export function seatSeasonEnd(c) {
  const S = seatEnsure(c), me = c.drivers[c.playerId]; if (!S || !me || !me.alive) return null;
  if (S.endDone === c.season) return { verdict: S.verdict, offers: S.offers };
  S.endDone = c.season;
  const pre = S.next && ['precontract', 'buyout'].includes(S.next.kind) && c.teams[S.next.team] && S.next.team !== S.team ? S.next : null;
  if (pre) {
    S.offers = [pre]; S.verdict = 'leaving';
    c.addNews(`It's official: ${me.name} leaves ${S.team || 'the team'} for ${pre.team} next season${S.leak?.out ? ' - as the paddock had heard' : ''}.`);
    if (S.leak) S.leak.out = true;
    agentText(c, `${pre.team} next season. It's announced. Enjoy the winter - you've earned it.`);
    return { verdict: 'leaving', offers: S.offers };
  }
  S.next = null;
  S.offers = S.offers.filter((o) => o.next && liveOffer(c, o));
  let verdict = 'free';
  if (S.status === 'driver') {
    const K = SEAT_RULES[kindOf(S.tier)], k = me.contract, ending = !k || num(k.until, c.season) <= c.season;
    if (S.conf < K.cut) verdict = 'release';
    else if (ending) verdict = S.conf >= 50 ? 'renew' : 'expire';
    else verdict = 'continue';
    if (verdict === 'renew') {
      const of = makeOffer(c, S.team, { kind: 'renewal', from: 'team', next: true, salary: half(num(k?.salary, 1) * (1 + (S.conf - 50) / 100) + 0.5), years: S.conf >= 75 ? 2 : 1, role: k?.role === 'support' && S.conf >= 70 ? 'equal' : k?.role || 'equal', note: `${S.team} want to keep you.`, negotiable: true });
      if (of) S.offers.unshift(of);
      c.addNews(`${S.team} offer ${me.name} a new contract.`);
    } else if (verdict === 'expire') c.addNews(`${S.team} will not renew ${me.name}'s contract.`);
    else if (verdict === 'release') c.addNews(`${S.team} end ${me.name}'s contract early: a new driver next season.`);
  }
  S.verdict = verdict;
  // (the market: the better your season and name, the more offers and the higher up the grid)
  if (verdict !== 'continue' || repOf(c) >= 60) for (const of of marketOffers(c, { not: S.status === 'driver' ? S.team : null, kind: 'season', note: 'For next season.' })) if (!S.offers.some((o) => o.team === of.team)) S.offers.push(of);
  const n = S.offers.length;
  agentText(c, verdict === 'continue' ? (n ? `You're under contract, but ${n === 1 ? 'a team has' : `${n} teams have`} asked about you. Have a look before the winter.` : 'Good season. You\'re under contract - rest, train, come back quicker.')
    : verdict === 'renew' ? `${S.team} want to keep you.${n > 1 ? ` ${n - 1} other offer${n > 2 ? 's' : ''} too. Your call.` : ''}`
    : n ? `${verdict === 'free' ? 'Here\'s what I\'ve got for next season.' : `${S.team} won't keep you. I've found ${n === 1 ? 'one team' : `${n} teams`} that will.`}` : 'Nothing yet. I\'m making calls. Keep your phone on over the winter.');
  return { verdict, offers: S.offers };
}

// ---- bargaining power -------------------------------------------------------------------------------------------------------------
/** the signals of a race that are about the result (career/Seat.js CONF_W): against the target, a win, a podium, points, the team-mate, a season of defeats to him */
const RESULT_KEYS = new Set(['result', 'win', 'podium', 'points', 'mate', 'h2h']);
const nameList = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
/** the window an approach without an offer still counts for (rounds) */
export const INTEREST_ROUNDS = 4;
/**
 * The teams that want you, other than `not` and your own: an offer in hand (a race seat, not a reserve role, not
 * lapsed), or an approach this season in the last INTEREST_ROUNDS rounds -> [{ team, tier, offer }]
 */
export function rivalInterest(c, not = null) {
  const S = c?.seat; if (!S) return [];
  const out = new Map(), live = (o) => !o.expires || o.expires.season > c.season || (o.expires.season === c.season && o.expires.round >= c.round);
  for (const o of arr(S.offers)) if (o && o !== S.next && o.id !== S.next?.id && o.team !== not && o.team !== S.team && o.kind !== 'reserve' && live(o) && c.teams?.[o.team]) out.set(o.team, { team: o.team, tier: c.teams[o.team].tier, offer: true });
  for (const [team, x] of Object.entries(S.interest || {})) {
    if (team === not || team === S.team || out.has(team) || !c.teams?.[team] || !x || x.season !== c.season || c.round - num(x.round, 0) > INTEREST_ROUNDS) continue;
    out.set(team, { team, tier: c.teams[team].tier, offer: false });
  }
  return [...out.values()];
}
/** bargaining power in words */
export const leverageLabel = (v) => (v >= 75 ? 'Commanding' : v >= 55 ? 'Strong' : v >= 35 ? 'Some' : v >= 15 ? 'Little' : 'Next to none');
/**
 * Your bargaining power, 0-100, and what makes it -> { v, label, parts: [{ k, d, text }] } (the biggest first). team:
 * the team you would bargain with (default: your own). Base 20. With your own team: management confidence ((conf - 50)
 * x 0.4), your results against what it wanted over the last five races (their result signals x 0.35, at most ±14),
 * your standing in the garage (number one +8, equal +2, number two -4). With another team (an offer, a free agent):
 * your reputation ((rep - 40) x 0.35) and your results (x 0.25, ±10). Either way: the championship (P1-3 +10, P4-6
 * +6, P7-10 +3; ahead of your team-mate on points +2), your following (fame index - 45) / 5 (0..8) and image / 12
 * (±5), rival interest - an offer in hand from a team as high up the grid as this one +12, from a lower one +6, an
 * approach without an offer +4, at most 26: the strongest lever - your personal sponsors (+3 each, at most 9), goodwill
 * (favours asked of the team and the ones it owes you, -40..25) and a contract signed elsewhere for next season (-18).
 */
export function leverageParts(c, team = null) {
  const S = c?.seat, me = c?.drivers?.[c?.playerId]; if (!S || !me || me.alive === false) return { v: 0, label: leverageLabel(0), parts: [] };
  const at = team || S.team, own = S.status === 'driver' && !!at && at === S.team, T = c.teams?.[at], tier = num(T?.tier, 3), parts = [];
  const add = (k, d, text) => { d = r1(d); if (Math.abs(d) >= 0.5) parts.push({ k, d, text }); };
  const recent = arr(S.log).filter((x) => x && (x.season === c.season || x.season === c.season - 1)).slice(0, 5), nr = recent.length;
  const res = recent.reduce((a, x) => a + arr(x.f).filter((f) => RESULT_KEYS.has(f[0])).reduce((s, f) => s + num(f[1]), 0), 0);
  const races = nr === 1 ? 'Last race' : `Last ${nr} races`;
  if (own) {
    add('conf', (num(S.conf, 60) - 50) * 0.4, `Team confidence ${Math.round(S.conf)}`);
    if (nr) add('results', clamp(res * 0.35, -14, 14), res >= 0 ? `${races}: above target` : `${races}: below target`);
    const role = me.contract?.role; add('role', role === 'lead' ? 8 : role === 'support' ? -4 : role === 'equal' ? 2 : 0, role === 'lead' ? 'Number one' : role === 'support' ? 'Number two' : 'Equal status');
  } else {
    const rep = repOf(c); add('rep', (rep - 40) * 0.35, `Reputation ${rep}`);
    if (nr) add('results', clamp(res * 0.25, -10, 10), res >= 0 ? `${races}: above target` : `${races}: below target`);
  }
  // (the championship: where you are, and ahead of your team-mate)
  const st = Object.values(c.drivers || {}).filter((d) => d.points > 0 || (d.team && d.alive)).sort((a, b) => b.points - a.points || b.wins - a.wins), pos = st.indexOf(me) + 1;
  if (me.points > 0 && pos) add('champ', pos <= 3 ? 10 : pos <= 6 ? 6 : pos <= 10 ? 3 : 0, `P${pos} in the championship`);
  const mate = own ? arr(T?.seats).map((i) => c.drivers[i]).find((d) => d && d.alive && d.id !== me.id) : null;
  if (mate && num(me.points) > num(mate.points)) add('matePts', 2, `Ahead of ${last(mate.name)} on points`);
  // (the public: your following and your image)
  const P = c.pr || {}, img = num(P.image, 0);
  add('fame', clamp((fameIndex(num(P.fame, 0)) - 45) / 5, 0, 8), 'Your following');
  add('image', clamp(img / 12, -5, 5), 'Public image');
  // (the teams that want you - the strongest lever)
  const RI = rivalInterest(c, at); let ri = 0;
  for (const x of RI) ri += x.offer ? (x.tier <= tier ? 12 : 6) : 4;
  if (ri) add('rivals', Math.min(26, ri), `${nameList(RI.map((x) => x.team))}: ${RI.some((x) => x.offer) ? (RI.length > 1 ? 'offers in hand' : 'offer in hand') : 'asked about you'}`);
  // (your personal sponsors: a driver who brings his own backers is worth keeping happy)
  const deals = arr(P.deals).length; if (deals) add('sponsors', Math.min(9, deals * 3), `${deals} personal sponsor${deals > 1 ? 's' : ''}`);
  // (what you have asked of the team, and what it owes you)
  const gw = num(S.goodwill, 0); add('goodwill', gw, gw > 0 ? 'Favours owed to you' : 'Favours asked');
  // (signed elsewhere for next season: the team knows where your future is)
  if (own && S.next && S.next.team !== at && S.next.kind !== 'reserve') add('leaving', -18, `Signed for ${S.next.team} next year`);
  const v = Math.round(clamp(20 + parts.reduce((a, p) => a + p.d, 0), 0, 100));
  parts.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  return { v, label: leverageLabel(v), parts };
}
/** your bargaining power with a team (default: your own), 0-100 (leverageParts for what makes it) */
export function leverage(c, team = null) { return leverageParts(c, team).v; }

// ---- for the interview and the hub ---------------------------------------------------------------------------------------------
/**
 * The seat as the media pen and the hub read it -> { status, team, tier, kind, conf, warn, label, beat (this round's,
 * the race just run), firedFrom, contract } | null
 */
export function seatCtx(c) {
  const S = c?.seat; if (!S) return null;
  // (the beat of the race just run: the round has moved on by the time anyone asks)
  const me = c.drivers?.[c.playerId], L = confLabel(S.conf, S.warn, S.tier), n = S.notice, fresh = n && n.season === c.season && n.round === c.round - 1;
  const beat = fresh ? n.kind : null;
  return { status: S.status, team: S.team || S.firedFrom || null, tier: S.tier, kind: kindOf(S.tier), conf: Math.round(S.conf), warn: S.warn, label: L.text, k: L.k, beat, firedFrom: S.firedFrom || null, contract: me?.contract || null };
}
