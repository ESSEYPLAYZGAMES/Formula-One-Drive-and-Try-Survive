// Your say (a career): what bargaining power buys a driver who does not own the team (career/Seat.js leverage). Three
// things, each with a price and a memory:
//
//  * An upgrade request. You ask the team to build a part next (the tech tree's REQUEST). It answers by your leverage,
//    its budget and its own plans - yes (the factory starts it, or it is first in the queue), half (it goes on the
//    list: built when a slot and the money allow, no promises), or no. Asking costs goodwill either way. Then the team
//    watches: once the part is on the car and you have raced it three times, results better than before (or a part
//    that correlated well and results no worse) give the goodwill back and then some; a part that did not pay off
//    costs you. Everything else on the car is still the team's own choice (career/TechTree.js aiDevelopTeam, which
//    gives a half-promised part its priority through t.asked).
//  * A say over your team-mate. When the seat beside you opens (his contract ends, or the team replaces him mid-season:
//    career/Market.js opens c.seat.mateSay with a shortlist and the team's own choice), you may back a candidate or veto
//    the team's choice. Each needs a certain bargaining power - more the further your man is from the team's own choice
//    - and is plain about it. It works or it does not; either way the drivers involved remember (Paddock Rapport) and so
//    does the team (goodwill, and confidence when you lose).
//  * Your contract's terms (ui/Negotiation.js, the motorhome table): salary, years, your standing in the garage, the
//    win bonus and the release clause. How far a team moves from its offer is your leverage with it: the most it will
//    pay, the status it will give, the clause it will accept - and a budget of give, spent across the terms. Ask
//    within it and they sign; ask past it and they counter on the term most in the way; too much and patience goes
//    (twice as fast for an insult). Walk away and a team that wants you badly enough may call back with more.
//
// Plain functions on the career's plain JSON; nothing here imports the career itself (the bundle has no cycles).
import { UP, UPGRADES, levelOf, nextLevel, upgradeState, levelCost, levelWorth, techEffects, upgradeName } from './TechTree.js';
import { leverage, seatEnsure, agentText, clauseFor } from './Seat.js';

// ---- small helpers -------------------------------------------------------------------------------------------------------
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const half = (v) => Math.max(0.5, Math.round(v * 2) / 2);
const quarter = (v) => Math.max(0, Math.round(v * 4) / 4);
const arr = (v) => (Array.isArray(v) ? v : []);
const last = (n) => String(n || '').split(' ').pop();
const pick = (a) => a[(Math.random() * a.length) | 0];
const safe = (what, f, fb = null) => { try { return f(); } catch (e) { console.warn(`Say: ${what} failed`, e); return fb; } };
const myTeam = (c) => (c?.seat?.status === 'driver' ? c.teams?.[c.seat.team] || null : null);
/** goodwill moved (kept to its range: -40..25) -> the change */
export function goodwill(c, d) { const S = c.seat, g0 = num(S.goodwill, 0); S.goodwill = r1(clamp(g0 + d, -40, 25)); return S.goodwill - g0; }
/** management confidence moved between races (a request that paid off, a say you lost): onto the last race's line, as the media pen's answers are */
function confNudge(c, d, words) {
  const S = c.seat; if (!S || S.status !== 'driver' || !d) return 0;
  const c0 = S.conf; S.conf = r1(clamp(S.conf + d, 0, 100));
  const L = S.log?.[0]; if (L) { L.f.push(['say', r1(S.conf - c0), words]); L.d = r1(L.d + (S.conf - c0)); L.conf = S.conf; }
  return S.conf - c0;
}
const note = (c, kind, text) => { c.seat.notice = { kind, text, season: c.season, round: c.round - 1, seen: false }; };

// ---- upgrade requests ---------------------------------------------------------------------------------------------------------
/** what the team keeps back from its budget before it builds anything (career/TechTree.js RESERVE) */
const RESERVE = 6;
/** the request still being followed for your team, if any (answered yes or half, not yet judged) */
export function liveRequest(c) {
  const S = c?.seat; if (!S) return null;
  return arr(S.requests).find((r) => r && r.team === S.team && ['building', 'queued', 'onCar'].includes(r.state)) || null;
}
/** a request for this upgrade, the latest (any state) -> request | null */
export function requestFor(c, upId) { const S = c?.seat; return arr(S?.requests).filter((r) => r && r.up === upId && r.team === S.team).pop() || null; }
/** your form as the team reads it: the result signals of the last n races (career/Seat.js log), averaged per race */
const formOf = (S, n = 3) => { const L = arr(S.log).slice(0, n); return L.length ? r2(L.reduce((a, x) => a + arr(x.f).filter((f) => ['result', 'win', 'podium', 'points', 'mate'].includes(f[0])).reduce((s, f) => s + num(f[1]), 0), 0) / L.length) : 0; };
/** where an upgrade sits in the team's own plans: its rank among the levels the team could build next, by lap time per $M */
function planRank(c, t, upId) {
  const relMax = techEffects(t).relMul <= 0.4501, L = [];
  for (const u of UPGRADES) {
    const st = upgradeState(c, t.name, u.id); if (!['open', 'busy', 'poor'].includes(st)) continue;
    const lv = nextLevel(t, u.id); L.push([u.id, levelWorth(t, u.id, lv, relMax) / Math.max(0.5, levelCost(c, t.name, u.id, lv))]);
  }
  L.sort((a, b) => b[1] - a[1]);
  const i = L.findIndex((x) => x[0] === upId); return { rank: i < 0 ? 99 : i, of: L.length };
}
/**
 * What the team would say to a request for an upgrade's next level, before you ask -> { ok, why, answer ('yes' |
 * 'half' | 'no'), score, lev, plan, money, asked, cost (goodwill it would cost) }. The score: your bargaining power
 * (x 0.55), how well the part fits the team's own plans (its top three by lap time per $M: 0.25, its top eight: 0.15,
 * else 0.06), whether it can pay (a level within its budget past the $6M it keeps back: 0.2, half of it: 0.1), less
 * 0.08 for each request already made this season and 0.1 for each that did not pay off. Yes from 0.6 (and the money
 * there); half from 0.4; else no.
 */
export function requestOdds(c, upId) {
  const S = c?.seat, t = myTeam(c), u = UP[upId];
  if (!S || !t) return { ok: false, why: 'Only a race driver under contract can ask the team for a part.' };
  if (c.round > c.rounds) return { ok: false, why: 'The season is over: the factory is building next year\'s car.' };
  if (!u) return { ok: false, why: 'No such part.' };
  const st = upgradeState(c, t.name, upId);
  if (st === 'max') return { ok: false, why: `${u.name} is fully developed.` };
  if (st === 'dev') return { ok: false, why: `${u.name} is already in the factory.` };
  if (st === 'locked') return { ok: false, why: `${u.name} needs other work first: the team can't build it yet.` };
  const live = liveRequest(c);
  if (live) return { ok: false, why: `You have already asked for ${upgradeName(live.up, live.level)}: the team wants to see it on the car first.` };
  const lastAsk = arr(S.requests).filter((r) => r.team === S.team).pop();
  if (lastAsk && lastAsk.season === c.season && lastAsk.round === c.round) return { ok: false, why: 'You asked this week already. Give it a race.' };
  const lv = nextLevel(t, upId), cost = levelCost(c, t.name, upId, lv), spare = num(t.budget, 0) - RESERVE;
  const lev = leverage(c), P = planRank(c, t, upId), plan = P.rank <= 2 ? 0.25 : P.rank <= 7 ? 0.15 : 0.06, money = spare >= cost ? 0.2 : spare >= cost * 0.5 ? 0.1 : 0;
  const mine = arr(S.requests).filter((r) => r.team === S.team && r.season === c.season), asked = mine.length, flops = mine.filter((r) => r.state === 'flop').length;
  const score = r2(lev / 100 * 0.55 + plan + money - 0.08 * asked - 0.1 * flops);
  const answer = score >= 0.6 && money >= 0.2 ? 'yes' : score >= 0.4 ? 'half' : 'no';
  return { ok: true, answer, score, lev, plan: P, money: spare >= cost ? 'yes' : spare >= cost * 0.5 ? 'tight' : 'no', cost, level: lv, asked, slots: st === 'busy' ? 'full' : 'free', goodwill: { yes: -6, half: -4, no: -3 }[answer] };
}
/** the team's answer in words, before and after */
export const ANSWER_TXT = { yes: 'likely yes', half: 'maybe: on the list', no: 'likely no' };
/**
 * Ask the team for an upgrade's next level -> { ok, answer, text, request }. Yes: the factory starts it now (develop),
 * or - every slot in use - it is first in the queue (t.asked, the team's development gives it priority); half: on the
 * list (t.asked for four rounds: built when a slot and the money allow); no: nothing. Asking costs goodwill (yes -6,
 * half -4, no -3) and a request answered is followed until it has been judged (requestTick).
 */
export function requestUpgrade(c, upId, develop) {
  const O = requestOdds(c, upId); if (!O.ok) return { ok: false, text: O.why };
  const S = seatEnsure(c), t = myTeam(c), u = UP[upId], nm = upgradeName(upId, O.level), F = last(c.drivers[c.playerId]?.name);
  const R = { id: `rq-${c.season}-${c.round}-${upId}`, team: t.name, up: upId, level: O.level, season: c.season, round: c.round, answer: O.answer, score: O.score, lev: O.lev,
    state: O.answer === 'no' ? 'refused' : 'queued', base: formOf(S), after: [], q: null, onCar: null };
  S.requests.push(R); if (S.requests.length > 16) S.requests.splice(0, S.requests.length - 16);
  goodwill(c, O.goodwill);
  let text;
  if (O.answer === 'yes') {
    const started = O.slots === 'free' && typeof develop === 'function' && develop(c, t.name, upId);
    if (started) { R.state = 'building'; text = `${t.name} agree: work starts on ${nm} now.`; }
    else { t.asked = { id: upId, level: O.level, season: c.season, until: c.round + 4, strong: true }; text = `${t.name} agree: ${nm} is first in the queue when a slot frees up.`; }
    c.addNews(`${t.name} bring ${nm} forward at ${c.drivers[c.playerId]?.name}'s request.`);
  } else if (O.answer === 'half') {
    t.asked = { id: upId, level: O.level, season: c.season, until: c.round + 4, strong: false };
    text = `${t.name} will think about it: ${nm} goes on the list - built when a slot and the money allow, no promises.`;
  } else {
    text = pick([`${t.name} say no: ${nm} is not in their plans, and your word isn't enough to change them.`, `No. ${t.name} have their own plan for the car, and ${nm} isn't in it.`]);
    agentText(c, pick([`Heard they turned you down on the ${u.short}. Don't push it again this month.`, `Bit early to be telling them how to build the car, ${F}. Results first.`]));
  }
  return { ok: true, answer: O.answer, text, request: R };
}
/**
 * The requests followed, a round at a time (after the factory's round: done - devTick's completions for your team).
 * A part asked for that reached the car is noted (its correlation, the round); one in the factory is 'building'; a
 * half-promise not started within four rounds lapses (some goodwill back: they did not do it). Once a part has been on
 * the car for three of your races, the verdict: its form since (the result signals per race) against the form before
 * you asked - better by a place's worth (1.0), or no worse (-0.5) with a part that correlated at 100% or more: it paid
 * off (goodwill +8, confidence +3, and your agent and the news say so); else it did not (goodwill -6, confidence -3).
 * Called after every race you drive (the round already moved on) -> [request judged]
 */
export function requestTick(c, done = []) {
  const S = c?.seat; if (!S) return [];
  const out = [], t = c.teams?.[S.team];
  for (const R of arr(S.requests)) {
    if (!['building', 'queued', 'onCar'].includes(R.state)) continue;
    // (a request for a team you no longer drive for, or a season gone: it lapses quietly)
    if (R.team !== S.team || S.status !== 'driver' || R.season < c.season - 1) { R.state = 'lapsed'; continue; }
    const T = c.teams?.[R.team]; if (!T) { R.state = 'lapsed'; continue; }
    const hit = arr(done).find((x) => x.team === R.team && x.id === R.up && x.level === R.level && !x.re);
    if (R.state !== 'onCar' && (hit || levelOf(T, R.up) >= R.level)) { R.state = 'onCar'; R.onCar = { season: c.season, round: c.round - 1 }; R.q = hit ? hit.q : num(T.quality?.[R.up]?.[R.level - 1], 1); continue; }
    if (R.state === 'queued' && arr(T.dev).some((x) => x.id === R.up && x.level === R.level && !x.re)) { R.state = 'building'; if (T.asked?.id === R.up) delete T.asked; continue; }
    if (R.state === 'queued' && (R.season !== c.season || c.round - R.round > 4)) {
      R.state = 'lapsed'; if (T.asked?.id === R.up) delete T.asked; goodwill(c, 2);
      note(c, 'request', `${R.team} never got round to ${upgradeName(R.up, R.level)}. The favour is half forgotten.`);
      continue;
    }
    if (R.state === 'onCar') {
      // (your races with it on the car: the form of each, read from the seat's log)
      const L = arr(S.log).filter((x) => x.season > R.onCar.season || (x.season === R.onCar.season && x.round > R.onCar.round));
      R.after = L.slice(0, 3).map((x) => r2(arr(x.f).filter((f) => ['result', 'win', 'podium', 'points', 'mate'].includes(f[0])).reduce((s, f) => s + num(f[1]), 0)));
      if (R.after.length < 3) continue;
      const aft = r2(R.after.reduce((a, b) => a + b, 0) / R.after.length), gain = r2(aft - num(R.base, 0)), nm = upgradeName(R.up, R.level);
      R.gain = gain; R.judged = { season: c.season, round: c.round - 1 };
      if (gain >= 1 || (gain >= -0.5 && num(R.q, 1) >= 1)) {
        R.state = 'paid'; goodwill(c, 8); confNudge(c, 3, `The ${UP[R.up]?.short || 'part'} you asked for paid off`);
        note(c, 'request', `${nm} - the part you asked for - has paid off: the results are better since. ${R.team} remember who asked for it.`);
        c.addNews(`${R.team}'s ${nm} has transformed ${c.drivers[c.playerId]?.name}'s races, the paddock says - the driver asked for it.`);
        agentText(c, pick([`The ${UP[R.up]?.short} was your call and it worked. That's capital, use it wisely.`, 'Told you to trust your gut on the car. The team noticed.']));
      } else {
        R.state = 'flop'; goodwill(c, -6); confNudge(c, -3, `The ${UP[R.up]?.short || 'part'} you pushed for did not deliver`);
        note(c, 'request', `${nm} - the part you pushed for - hasn't delivered. ${R.team} have noticed.`);
        agentText(c, pick([`The ${UP[R.up]?.short} hasn't done what you said it would. Keep your head down for a bit.`, 'That part you wanted? Not working. Expect fewer favours.']));
      }
      out.push(R);
    }
  }
  if (t?.asked && (t.asked.season !== c.season || c.round > t.asked.until)) delete t.asked;
  return out;
}

// ---- your say over your team-mate ----------------------------------------------------------------------------------------------
/**
 * The bargaining power a say would need -> number. Backing a driver the team did not choose: 38, plus 400 x how far his
 * rating is below the team's choice (0.05 -> +20), plus 6 for keeping a team-mate the team wants gone; backing the
 * team's own choice: nothing to it. Vetoing the team's choice: 48, plus 400 x how far the next on the list is below him.
 * Kept to 25..95.
 */
export function mateNeed(c, act, did) {
  const M = c?.seat?.mateSay; if (!M) return 99;
  const D = c.drivers, P = D[M.pick], X = D[did]; if (!X) return 99;
  if (act === 'back') {
    if (did === M.pick) return 0;
    return Math.round(clamp(38 + Math.max(0, num(P?.rating, 0.8) - X.rating) * 400 + (did === M.out ? 6 : 0), 25, 95));
  }
  const next = M.cands.map((id) => D[id]).filter((d) => d && d.id !== M.pick).sort((a, b) => b.rating - a.rating)[0];
  return Math.round(clamp(48 + Math.max(0, num(X?.rating, 0.8) - num(next?.rating, 0.8)) * 400, 30, 95));
}
/** the shortlist as the hub shows it -> [{ id, name, rating, from, team, pick (the team's choice), out (the outgoing team-mate), back, veto (the power each needs) }] */
export function mateOptions(c) {
  const M = c?.seat?.mateSay; if (!M) return [];
  return M.cands.map((id) => c.drivers[id]).filter((d) => d && d.alive).map((d) => ({ id: d.id, name: d.name, rating: d.rating, from: d.from, team: d.team || null, reserveOf: d.reserveOf || null,
    pick: d.id === M.pick, out: d.id === M.out, back: mateNeed(c, 'back', d.id), veto: d.id === M.pick ? mateNeed(c, 'veto', d.id) : null }));
}
/**
 * Your say: back a candidate (act 'back') or veto the team's choice ('veto'), once per seat -> { ok, done, text }.
 * Works when your bargaining power reaches what it needs (mateNeed). Backing him: he becomes the team's choice
 * (goodwill -5; he is grateful, Rapport +18; the driver the team had chosen is not, -8); backing in vain: goodwill
 * -6, confidence -2 (he still appreciates it, +8). A veto: the next on the list becomes the choice (goodwill -7; the
 * driver vetoed, Rapport -25 - -30 for your own team-mate); a veto that fails: goodwill -8, confidence -3, and he
 * knows (-20). Backing the team's own choice costs nothing and earns a little goodwill (+2) and his thanks (+6).
 */
export function mateSay(c, act, did) {
  const S = c?.seat, M = S?.mateSay, D = c?.drivers || {}; if (!M || M.state !== 'open') return { ok: false, text: 'There is no seat to have a say over.' };
  const X = D[did]; if (!X || !X.alive || !M.cands.includes(did)) return { ok: false, text: 'That driver is not on the shortlist.' };
  if (act === 'veto' && did !== M.pick) return { ok: false, text: 'You can only veto the team\'s own choice.' };
  const lev = leverage(c), need = mateNeed(c, act, did), team = S.team, pick0 = M.pick, P0 = D[pick0];
  M.state = 'done'; M.acted = { act, did, lev, need, season: c.season, round: c.round };
  const rel = (id, d, why) => { if (id && D[id] && id !== c.playerId) c.relate?.(id, d, why); };
  if (act === 'back') {
    if (did === pick0) { goodwill(c, 2); rel(did, 6, 'you backed them for the seat'); M.result = 'agreed'; return { ok: true, done: true, text: `You back ${X.name}: the team's own choice. ${team} are glad of it.` }; }
    if (lev >= need) {
      M.pick = did; M.result = 'won'; goodwill(c, -5); rel(did, 18, `you got them the ${team} seat`); rel(pick0, -8, 'you backed someone else for the seat');
      c.addNews(`${team} change their minds over the second seat: ${X.name}, the driver ${c.drivers[c.playerId]?.name} backed, is now their choice.`);
      return { ok: true, done: true, text: `${team} listen: ${X.name} is their choice now${P0 ? ` instead of ${P0.name}` : ''}. That was a favour.` };
    }
    M.result = 'lost'; goodwill(c, -6); confNudge(c, -2, 'You lobbied for a team-mate and lost'); rel(did, 8, 'you tried to get them the seat');
    return { ok: true, done: true, text: `${team} hear you out and go their own way: ${P0 ? P0.name : 'their choice'} it is. You needed ${need} bargaining power, you had ${lev}.` };
  }
  // (a veto)
  const next = M.cands.map((id) => D[id]).filter((d) => d && d.alive && d.id !== pick0).sort((a, b) => b.rating - a.rating)[0];
  if (lev >= need && next) {
    M.pick = next.id; M.vetoed = pick0; M.result = 'won'; goodwill(c, -7); rel(pick0, pick0 === M.out ? -30 : -25, `you blocked them from the ${team} seat`);
    c.addNews(`${c.drivers[c.playerId]?.name} is said to have blocked ${P0?.name}${pick0 === M.out ? '\'s new contract' : '\'s move'} at ${team}. ${next.name} is now in line for the seat.`);
    return { ok: true, done: true, text: `Vetoed. ${team} drop ${P0?.name} from their plans - ${next.name} is their choice now. ${last(P0?.name)} will not forget it.` };
  }
  M.result = 'lost'; goodwill(c, -8); confNudge(c, -3, 'You tried to veto the team\'s choice of team-mate'); rel(pick0, -20, 'you tried to block them from the seat');
  return { ok: true, done: true, text: `${team} won't be told: ${P0?.name} it is - and they know you tried to stop it. You needed ${need} bargaining power, you had ${lev}.` };
}

// ---- your contract's terms, at the table -----------------------------------------------------------------------------------
const ROLE_RANK = { support: 0, equal: 1, lead: 2, reserve: -1 };
/**
 * How far a team will move from its offer: { lev (your bargaining power with it), base (its offer's terms), salaryMax,
 * roleMax, years: [min, max], winBonusMax, clauseMin, give (the budget of give, spent across the terms), patience,
 * mate (the other driver's standing) }. Salary up to +8% plus 0.7 x leverage % (leverage 50: +43%); number one from
 * leverage 62 - 85 if the other driver already has it - and never over a clearly quicker team-mate; equal from 35;
 * a year either way (from 30 and 40); the win bonus up to 1.5 x leverage % more; the release clause down by up to 0.7 x
 * leverage %. Give: 0.2 + 1.2 x leverage / 100. Patience: 2 + leverage / 30 rounds of asking.
 * Fixed for one offer and one round of talks (of.talk).
 */
export function talkProfile(c, of) {
  if (of?.talk && of.talk.season === c.season && of.talk.round === c.round) return of.talk;
  const lev = leverage(c, of.team), t = c.teams[of.team], me = c.drivers[c.playerId];
  const mates = arr(t?.seats).map((i) => c.drivers[i]).filter((d) => d && d.alive && d.id !== c.playerId && d.id !== of.seatOf);
  const mate = mates.sort((a, b) => b.rating - a.rating)[0] || null, mr = mate?.contract?.role || 'equal';
  const base = { salary: num(of.salary, 1), years: clamp(Math.round(num(of.years, 1)), 1, 3), role: of.role || 'equal', winBonus: num(of.winBonus, 0), releaseClause: num(of.releaseClause, clauseFor(of.salary, of.years, of.tier)) };
  const quick = mate && mate.rating - num(me?.rating, 0.8) > 0.03;
  const roleMax = lev >= 62 && (mr !== 'lead' || lev >= 85) && !quick ? 'lead' : lev >= 35 || ROLE_RANK[base.role] >= 1 ? 'equal' : base.role;
  const P = { season: c.season, round: c.round, lev, base, salaryMax: half(base.salary * (1.08 + lev / 100 * 0.7)), roleMax: ROLE_RANK[roleMax] >= ROLE_RANK[base.role] ? roleMax : base.role,
    years: [Math.max(1, base.years - (lev >= 40 ? 1 : 0)), Math.min(3, base.years + (lev >= 30 ? 1 : 0))], winBonusMax: quarter(base.winBonus * (1 + lev / 100 * 1.5) + (lev >= 50 ? 0.25 : 0)),
    clauseMin: half(base.releaseClause * (1 - lev / 100 * 0.7)), give: r2(0.2 + lev / 100 * 1.2), patience: 2 + Math.floor(lev / 30), mate: mate ? { id: mate.id, name: mate.name, role: mr } : null };
  of.talk = P; return P;
}
/**
 * How your ask looks to the team -> { u (how comfortable: 1 at their offer, 0 at the edge of their give, below 0 past
 * it), cost (the give it spends), parts ({ salary, role, years, winBonus, clause }: each term's share), over (a term
 * past what they will ever do, or null), ok (they would sign it), gap (the term most in the way) }
 */
export function talkEval(c, of, ask) {
  const P = talkProfile(c, of), B = P.base, a = { ...B, ...ask };
  const sal = Math.max(0, a.salary - B.salary) / Math.max(0.5, P.salaryMax - B.salary);
  const rd = (ROLE_RANK[a.role] ?? 1) - (ROLE_RANK[B.role] ?? 1), role = rd <= 0 ? 0 : rd === 1 ? (B.role === 'support' ? 0.6 : 0.8) : 1.3;
  const years = Math.abs(a.years - B.years) * 0.25, wb = Math.max(0, a.winBonus - B.winBonus) / Math.max(0.25, P.winBonusMax - B.winBonus) * 0.4;
  const clause = Math.max(0, B.releaseClause - a.releaseClause) / Math.max(0.5, B.releaseClause - P.clauseMin) * 0.5;
  const parts = { salary: r2(sal), role: r2(role), years: r2(years), winBonus: r2(wb), clause: r2(clause) }, cost = r2(sal + role + years + wb + clause);
  const over = a.salary > P.salaryMax + 1e-6 ? 'salary' : (ROLE_RANK[a.role] ?? 1) > (ROLE_RANK[P.roleMax] ?? 1) ? 'role' : a.years < P.years[0] || a.years > P.years[1] ? 'years'
    : a.winBonus > P.winBonusMax + 1e-6 ? 'winBonus' : a.releaseClause < P.clauseMin - 1e-6 ? 'clause' : null;
  const gap = over || Object.keys(parts).sort((x, y) => parts[y] - parts[x])[0];
  return { u: r2(1 - cost / Math.max(0.05, P.give)), cost, parts, over, ok: !over && cost <= P.give + 1e-6, gap };
}
/**
 * The team's answer to your ask -> { result: 'accept' | 'counter' | 'reject' | 'walk', focus (the term it is about),
 * want (the term as they would have it: { salary } | { role } | { years } | { winBonus } | { releaseClause }), insult,
 * patience }. A counter costs a round of patience, an insult (twice their give, or half as much again as the most they
 * would pay) two; at none the team ends the talks: its offer stands as first made, take it or leave it.
 */
export function talkRespond(c, of, ask) {
  const P = talkProfile(c, of), E = talkEval(c, of, ask), B = P.base, a = { ...B, ...ask };
  if (E.ok) return { result: 'accept', E };
  const insult = E.cost > P.give * 2 + 0.6 || a.salary > P.salaryMax * 1.5;
  P.patience -= insult ? 2 : 1;
  if (P.patience <= 0) return { result: 'walk', focus: insult ? 'insult' : E.gap, E, patience: 0 };
  // (what they would do on the term most in the way, the rest as asked: the give that is left, spent on it)
  const left = Math.max(0, P.give - (E.cost - (E.parts[E.gap === 'clause' ? 'clause' : E.gap] || 0)));
  const want = E.gap === 'salary' ? { salary: half(Math.min(P.salaryMax, B.salary + (P.salaryMax - B.salary) * Math.min(1, left))) }
    : E.gap === 'role' ? { role: (ROLE_RANK[P.roleMax] ?? 1) < (ROLE_RANK[a.role] ?? 1) ? P.roleMax : (left >= 0.6 ? 'equal' : B.role) }
    : E.gap === 'years' ? { years: clamp(a.years, P.years[0], P.years[1]) === a.years ? B.years : clamp(a.years, P.years[0], P.years[1]) }
    : E.gap === 'winBonus' ? { winBonus: quarter(Math.min(P.winBonusMax, B.winBonus + (P.winBonusMax - B.winBonus) * Math.min(1, left / 0.4))) }
    : { releaseClause: half(Math.max(P.clauseMin, B.releaseClause - (B.releaseClause - P.clauseMin) * Math.min(1, left / 0.5))) };
  return { result: insult ? 'reject' : 'counter', focus: E.gap, want, insult, E, patience: P.patience };
}
/**
 * The deal agreed at the table: the offer's terms become yours (it can't be talked over again) -> the offer. Hard
 * bargaining a team stretched for is remembered (goodwill: -4 x the give it spent, for your own team)
 */
export function talkAgree(c, of, ask) {
  const E = talkEval(c, of, ask), P = talkProfile(c, of), a = { ...P.base, ...ask };
  Object.assign(of, { salary: half(a.salary), years: clamp(Math.round(a.years), 1, 3), role: a.role, winBonus: quarter(a.winBonus), releaseClause: half(a.releaseClause), negotiable: false, talked: { season: c.season, round: c.round, cost: E.cost, lev: P.lev } });
  if (of.team === c.seat?.team && E.cost > 0.2) goodwill(c, -r1(E.cost * 4));
  if (of.podiumBonus != null && of.winBonus) of.podiumBonus = quarter(Math.max(of.podiumBonus, of.winBonus * 0.3));
  delete of.talk; return of;
}
/**
 * You walk away from the table (ui/Negotiation.js) -> { called (the team came back with more), text }. A team that
 * wants you enough calls your agent back - the chance (leverage - 45) / 70, from leverage 55 - with a final offer:
 * 40% of the way to the most it would pay, equal status for a number two from leverage 45. Either way the offer is
 * no longer negotiable: take it or leave it on the card (a lapsing offer still lapses).
 */
export function talkWalk(c, of) {
  const P = talkProfile(c, of); of.negotiable = false; delete of.talk;
  if (P.lev >= 55 && Math.random() < (P.lev - 45) / 70) {
    of.salary = half(P.base.salary + (P.salaryMax - P.base.salary) * 0.4);
    if (of.role === 'support' && P.lev >= 45) of.role = 'equal';
    of.note = `${of.team} called back with a final offer after you walked out.`; of.improved = true;
    agentText(c, pick([`${of.team} just called. They've come up: ${of.salary ? `$${of.salary}M` : 'more money'}. Final offer, they say.`, `Walking out worked. ${of.team} have improved it - final offer. Have a look.`]));
    return { called: true, text: `${of.team} call your agent back with a final offer: $${of.salary}M a year${of.role === 'equal' && P.base.role === 'support' ? ', equal status' : ''}.` };
  }
  return { called: false, text: `You walk out. ${of.team}'s offer stays on the table as they made it - take it or leave it.` };
}
/** a contract's terms in words: '$4.5M a year, 2 seasons, number one, $1M a win, release clause $12M' */
export function termsText(o) {
  const role = { lead: 'number one', equal: 'equal status', support: 'number two', reserve: 'reserve' }[o?.role] || 'equal status';
  return `$${num(o?.salary, 0)}M a year, ${num(o?.years, 1)} season${num(o?.years, 1) > 1 ? 's' : ''}, ${role}${o?.winBonus ? `, $${o.winBonus}M a win` : ''}${o?.releaseClause ? `, release clause $${o.releaseClause}M` : ''}`;
}
/** the team-mate's standing set beside yours when you sign (number one makes him the number two, and so on) -> the mate's new role */
export function mateRoleFor(myRole, mate, me) {
  if (!mate) return null;
  if (myRole === 'lead') return 'support';
  if (myRole === 'support') return 'lead';
  return mate.contract?.role === 'lead' && num(mate.rating, 0.8) - num(me?.rating, 0.8) >= 0.04 ? 'lead' : 'equal';
}
/** one line for the news when you get number-one status (the team-mate is told) */
export function leadNews(c, team, mate) { return `${c.drivers[c.playerId]?.name} will be ${team}'s number one${mate ? `, ${mate.name} the number two` : ''}.`; }
