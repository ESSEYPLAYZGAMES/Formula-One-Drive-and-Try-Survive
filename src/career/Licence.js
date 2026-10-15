// Superlicence penalty points: the points the stewards add to a driver's licence along with a penalty for a driving
// offence (and, in this game, for conduct on the grid). Every driver in the paddock carries a licence. These are the
// real rules: twelve points within twelve months bring a one-race ban, each point expires twelve months after the
// offence, and once the ban has been served the twelve points come off the licence. In a career twelve months is one
// full season of rounds - a point from round 3 is gone before round 3 of the next season - and the ban is the round
// after the one that took the driver to twelve (the first round of the next season if that was the last), with a
// stand-in in the seat. How many points each offence carries is the game's own table: in reality the stewards decide
// case by case. A ban hurts - morale falls, the press has its story - and the return is just that, a return: nobody
// was hurt. Quick races keep a licence of their own in the browser, where a "season" is eight races.
import { shiftMorale } from './Morale.js';
import { prEvent, crisisFrom } from './PR.js';

// ---- the table ------------------------------------------------------------------------------------------------------
export const LICENCE_MAX = 12;
/** points per offence: the game's choice, not the FIA's (the stewards decide each case); 10 s for a collision is 3 */
export const OFFENCE_POINTS = { 'causing a collision': 2, 'leaving the track and gaining an advantage': 2,
  'track limits': 0, 'overtaking under the safety car': 2, 'overtaking under yellow flags': 2,
  'overtaking under the VSC': 2, 'overtaking before the control line': 1, 'a jump start': 1,
  'not respecting the VSC delta': 1, 'not respecting the safety car delta': 1, 'unsportsmanlike conduct': 3,
  'a scuffle on the grid': 3 };
const OFFENCE = Object.fromEntries(Object.entries(OFFENCE_POINTS).map(([k, v]) => [k.toLowerCase(), v]));
const CONDUCT = 'unsportsmanlike conduct';
const TRACK_NAME = { silverstone: 'Silverstone', lasvegas: 'Las Vegas', montreal: 'Montreal' };
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const place = (w) => TRACK_NAME[w] || w || '';
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
/** a call into the PR desk that must never break the stewards' paperwork (an old save, a test's mock Career) */
const press = (fn) => { try { fn(); } catch (e) { console.warn('Licence: PR', e); } };

/** the points an offence carries (sec: the time penalty that came with it) -> pts (unknown offences: 1) */
export function pointsFor(reason, sec = 5) {
  const k = String(reason || '').trim().toLowerCase();
  if (k === 'causing a collision') return num(sec, 5) >= 10 ? 3 : 2;
  return Object.prototype.hasOwnProperty.call(OFFENCE, k) ? OFFENCE[k] : 1;
}

// ---- a driver's licence ---------------------------------------------------------------------------------------------
// d.licence: [{ pts, season, round, why, at }] in the order given (the oldest first); d.ban: null | { season, round,
// why, pts, at } - always a round that will be run (never past the season's last)
/** a driver record's licence fields, filled in where missing (a new driver, an old save) - safe to call again -> d */
export function licenceInit(d) {
  if (!d || typeof d !== 'object') return d;
  d.licence = (Array.isArray(d.licence) ? d.licence : []).filter((e) => e && num(e.pts, 0) > 0 && num(e.season, null) != null && num(e.round, null) != null);
  if (!d.ban || num(d.ban.season, null) == null || num(d.ban.round, null) == null) d.ban = null;
  return d;
}
const rec = (c, d) => (typeof d === 'string' ? c?.drivers?.[d] : d);
const span = (c) => c?.rounds || 6;
/** how many rounds ago an entry was given (twelve months = one season of rounds) */
const ageOf = (c, e) => (c.season - e.season) * span(c) + (c.round - e.round);
const live = (c, e) => ageOf(c, e) < span(c);
const byAge = (a, b) => a.season - b.season || a.round - b.round;
const served = (c, b) => b.season < c.season || (b.season === c.season && b.round < c.round);
const pending = (c, d) => !!d.ban && !served(c, d.ban);
/** a driver's points still on the licence (d: the record or its id) -> number */
export function activePoints(c, d) {
  const r = rec(c, d); if (!r || !Array.isArray(r.licence)) return 0;
  return r.licence.reduce((a, e) => a + (live(c, e) ? num(e.pts, 0) : 0), 0);
}
/** the entries still on the licence, the oldest first -> [{ ...e, expires: { season, round }, left (rounds to go) }] */
export function activeEntries(c, d) {
  const r = rec(c, d); if (!r || !Array.isArray(r.licence)) return [];
  return r.licence.filter((e) => live(c, e)).sort(byAge).map((e) => ({ ...e, expires: { season: e.season + 1, round: e.round }, left: span(c) - ageOf(c, e) }));
}
/** the race a driver sits out is this one (c.round: the race about to be run) -> bool */
export function isBanned(c, d) {
  const r = rec(c, d); return !!(r?.ban && r.ban.season === c.season && r.ban.round === c.round);
}
/** how a licence reads at a glance -> 'Clean' | 'Light' | 'Under watch' | 'On the edge' | 'Ban' */
export function pointsLabel(total) {
  const t = num(total, 0); return t <= 0 ? 'Clean' : t <= 5 ? 'Light' : t <= 8 ? 'Under watch' : t < LICENCE_MAX ? 'On the edge' : 'Ban';
}
/** a driver's pending ban in words, or null: 'Banned this round (Las Vegas)' / 'Banned for round 4 (Silverstone)' */
export function banText(c, d) {
  const r = rec(c, d); if (!r || !pending(c, r)) return null;
  const b = r.ban, w = place(c.calendar?.[b.round - 1]), at = w ? ` (${w})` : '';
  return isBanned(c, r) ? `Banned this round${at}` : b.season === c.season ? `Banned for round ${b.round}${at}` : `Banned for round ${b.round} of ${b.season}${at}`;
}

// ---- the stewards' decision -----------------------------------------------------------------------------------------
/**
 * Penalty points for driver did (pts, the offence why, where: the circuit's id or name), given at this race (the
 * entry is stamped c.season / c.round). Twelve or more on the licence with no ban pending: a ban for banRound (the
 * next round by default; past the season's last, round 1 of the next season), a measured news line, -15 morale, and
 * for you the PR desk's 'ban' story and a crisis to answer. Every award costs composure (yours 6, an AI driver's 4).
 * The instigator rule: 'unsportsmanlike conduct' (an AI driver who shoved you) counts once per driver a season.
 * o.grave: a round of injury or loss - no PR and no crisis, whatever happens. -> { total, banned (a ban set now) }
 */
export function addPoints(c, did, pts, why, where = '', banRound = c.round + 1, o = {}) {
  const d = c?.drivers?.[did]; if (!d || d.alive === false) return { total: 0, banned: false };
  licenceInit(d);
  const n = Math.round(num(pts, 0)), me = did === c.playerId, at = place(where), what = String(why || 'an offence');
  if (n <= 0) return { total: activePoints(c, d), banned: false };
  if (what === CONDUCT && !me) {
    if (d.conductSeason === c.season) return { total: activePoints(c, d), banned: false, skipped: true };
    d.conductSeason = c.season;
  }
  d.licence.push({ pts: n, season: c.season, round: c.round, why: what, at: at || null });
  const total = activePoints(c, d);
  shiftMorale(c, did, me ? -6 : -4, `${plural(n, 'penalty point')}: ${what}`, 'composure');
  if (total < LICENCE_MAX || pending(c, d)) {
    const tally = total < LICENCE_MAX ? `${total} of ${LICENCE_MAX} on the licence` : `${total} on the licence, with a ban still to serve`;
    if (me) c.addNews?.(`${d.name}: ${plural(n, 'penalty point')} for ${what}${at ? ` at ${at}` : ''} - ${tally}.`);
    return { total, banned: false };
  }
  // the ban: the round after this one, always a round that will be run
  const R = span(c), br = Math.max(c.round + 1, Math.round(num(banRound, c.round + 1))), roll = br > R;
  d.ban = { season: roll ? c.season + 1 : c.season, round: roll ? 1 : br, why: `${total} penalty points`, pts: total, at: at || null };
  const w = place(c.calendar?.[d.ban.round - 1]), round = w ? `the ${w} round` : `round ${d.ban.round}`;
  c.addNews?.(`${d.name} reaches ${total} penalty points and will miss ${round}${roll ? ` (the first of ${d.ban.season})` : ''}: twelve points within twelve months bring a one-race ban.`);
  shiftMorale(c, did, -15, 'A one-race ban');
  if (me && !o?.grave) {
    const data = { did, name: d.name, pts: total, why: what, track: w, season: d.ban.season, round: d.ban.round };
    press(() => prEvent(c, 'ban', data));
    press(() => crisisFrom(c, 'ban', data));
  }
  return { total, banned: true };
}

// ---- between rounds -------------------------------------------------------------------------------------------------
/**
 * Once a round, after the race (the round has moved on; after moraleRoundTick): bans served end - the oldest points
 * totalling twelve or more come off the licence and the driver returns (PR 'banReturn' for you; never a comeback,
 * nothing about an injury) - then points twelve months old expire. o.grave: no PR this round.
 * -> { lines } (yours, for the report)
 */
export function licenceRoundTick(c, o = {}) {
  const lines = [];
  for (const d of Object.values(c?.drivers || {})) {
    if (!d || d.alive === false) continue;
    licenceInit(d);
    const me = d.id === c.playerId;
    if (d.ban && served(c, d.ban)) {
      d.ban = null;
      // (as the FIA does: the twelve points that brought the ban are removed - here the oldest still on it)
      let off = 0; const gone = [];
      for (const e of d.licence.filter((x) => live(c, x)).sort(byAge)) { if (off >= LICENCE_MAX) break; off += e.pts; gone.push(e); }
      d.licence = d.licence.filter((e) => !gone.includes(e));
      const left = activePoints(c, d), out = d.outUntil != null && d.outUntil >= c.round;
      const cleared = off ? `: ${plural(off, 'penalty point')} come${off === 1 ? 's' : ''} off the licence${left ? `, ${left} remain` : ''}` : '';
      const text = `${d.name} ${d.team && !out ? `returns to the ${d.team} car after` : 'has served'} a one-race ban${cleared}.`;
      c.addNews?.(text);
      if (me) { lines.push(text); if (!o?.grave && !out) press(() => prEvent(c, 'banReturn', { did: d.id, name: d.name })); }
    }
    const old = d.licence.filter((e) => !live(c, e));
    if (!old.length) continue;
    d.licence = d.licence.filter((e) => live(c, e));
    if (me) {
      const n = old.reduce((a, e) => a + e.pts, 0), left = activePoints(c, d);
      const text = `${plural(n, 'penalty point')} on ${d.name}'s licence expire${n === 1 ? 's' : ''}: ${left} of ${LICENCE_MAX} remain.`;
      c.addNews?.(text); lines.push(text);
    }
  }
  const you = c?.drivers?.[c.playerId];
  if (you && you.alive !== false && isBanned(c, you)) { const w = place(c.calendar?.[c.round - 1]); lines.push(`${you.name} sits out ${w ? `the ${w} round` : 'this round'}: a one-race ban. A stand-in takes the seat.`); }
  return { lines };
}

// ---- quick races ----------------------------------------------------------------------------------------------------
// The player's own licence outside a career, in the browser: { entries: [{ pts, race, why, track }], races (quick
// races completed), banRace (the race to sit out) | null }. An entry is stamped with the race it came in (the count
// completed before it); it expires after eight races; a ban is the next race.
const QKEY = 'f1sim-licence', QSPAN = 8;
let qMem = null;   // (the licence kept here too: a private window keeps nothing in storage, so it lasts the session)
const qFresh = () => ({ entries: [], races: 0, banRace: null });
const qNorm = (s) => {
  const races = Math.max(0, Math.round(num(s?.races, 0)));
  const entries = (Array.isArray(s?.entries) ? s.entries : []).filter((e) => e && num(e.pts, 0) > 0 && num(e.race, null) != null)
    .map((e) => ({ pts: Math.round(e.pts), race: Math.round(e.race), why: String(e.why || ''), track: String(e.track || '') })).sort((a, b) => a.race - b.race);
  let banRace = num(s?.banRace, null); if (banRace != null) banRace = Math.round(banRace);
  if (banRace != null && banRace < races) banRace = null;   // (one long since served: a race it could not record)
  return { entries, races, banRace };
};
const qLoad = () => {
  let s = qMem;
  try { const v = localStorage.getItem(QKEY); if (v) s = JSON.parse(v); } catch (e) { /* (a private window: the session's copy) */ }
  return qNorm(s || qFresh());
};
const qSave = (s) => { qMem = s; try { localStorage.setItem(QKEY, JSON.stringify(s)); } catch (e) { /* (a private window: the licence lasts the session) */ } return s; };
const qTotal = (s) => s.entries.reduce((a, e) => a + (s.races - e.race < QSPAN ? e.pts : 0), 0);
/** the quick-race licence -> { entries, races, banRace, banNext (the next race is the ban), total } */
export function quickLicence() { const s = qLoad(); return { ...s, banNext: s.banRace != null && s.banRace === s.races, total: qTotal(s) }; }
/** points from this quick race (or its grid walk) -> { total, banned (a ban set now: the next race) } */
export function quickAddPoints(pts, why, track) {
  const s = qLoad(), n = Math.round(num(pts, 0));
  if (n <= 0) return { total: qTotal(s), banned: false };
  s.entries.push({ pts: n, race: s.races, why: String(why || 'an offence'), track: place(track) });
  const total = qTotal(s), banned = total >= LICENCE_MAX && s.banRace == null;
  if (banned) s.banRace = s.races + 1;
  qSave(s); return { total, banned };
}
/**
 * A quick race is over (driven, or sat out): if it was the ban, the ban is served and the oldest points totalling
 * twelve or more come off; then the race counts and points eight races old expire. -> { served, total }
 */
export function quickRaceDone() {
  const s = qLoad(); let served = false;
  if (s.banRace != null && s.banRace === s.races) {
    served = true; s.banRace = null; let off = 0;
    s.entries = s.entries.filter((e) => { if (off >= LICENCE_MAX) return true; off += e.pts; return false; });
  }
  s.races++;
  s.entries = s.entries.filter((e) => s.races - e.race < QSPAN);
  qSave(s); return { served, total: qTotal(s) };
}
/** the next quick race is a suspension -> bool */
export function quickBanned() { const s = qLoad(); return s.banRace != null && s.banRace === s.races; }
/** the quick-race licence's points -> number */
export function quickPoints() { return qTotal(qLoad()); }
/** a clean quick-race licence (tests) -> the fresh state */
export function quickReset() { return qSave(qFresh()); }
