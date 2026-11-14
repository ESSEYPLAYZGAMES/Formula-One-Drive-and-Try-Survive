// The other ten teams as teams (career/Manager.js calls in each round and each winter): each has a principal under
// its own board's pressure, a way of building a car (a steady stream of parts, big packages, a gamble on the grey areas
// of the rules ...), a technical director, a strategist and a crew chief whose ratings are in its cars and its stops,
// and money that comes and goes. They bring upgrades you hear about, come for your staff (match the offer or lose
// them), can be raided for theirs, and can be protested when a new part of theirs looks too clever - as they protest
// yours (career/ManagerStory.js). What you do to them they remember (the story's heat between principals).
import { UP, techEffects } from './TechTree.js';
import { appeal } from './Seasons.js';

const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const rnd = () => Math.random();
const pick = (a) => a[Math.floor(rnd() * a.length)];
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; };
/** how a team builds its car: when it spends (every: the rounds it starts work in), how well its parts come out (q), how often a part is in a grey area (grey) */
export const PHIL = {
  steady: { name: 'A steady stream', what: 'Something new at most races, little of it a surprise.', every: 1, q: 1.0, grey: 0.1 },
  package: { name: 'Big packages', what: 'Nothing for three races, then half a new car.', every: 3, q: 1.03, grey: 0.2 },
  gambler: { name: 'The grey areas', what: 'Clever parts that are quick until someone protests them.', every: 1, q: 1.06, grey: 0.6 },
  frugal: { name: 'Counting the money', what: 'Builds what it can afford, and it works.', every: 2, q: 1.04, grey: 0.05 },
  late: { name: 'Next year, always', what: 'Holds back for the next car; quicker out of the winter.', every: 2, q: 0.98, grey: 0.1 },
};
const PHILS = Object.keys(PHIL);
const BOSS_F = ['Andrea', 'Laurent', 'Jonathan', 'Ayao', 'Frederic', 'Oliver', 'Mattia', 'Graeme', 'Toto', 'Zak', 'Flavio', 'Otmar', 'Guenther', 'Claire', 'Monisha', 'Susie'], BOSS_L = ['Stella', 'Mekies', 'Wheatley', 'Komatsu', 'Vasseur', 'Oakes', 'Binotto', 'Lowdon', 'Brandt', 'Marsh', 'Ricci', 'Szafnauer', 'Steiner', 'Hale', 'Kalt', 'Wolfe'];
const STAFF_F = ['James', 'Pierre', 'Hannah', 'Luca', 'Ruth', 'Tom', 'Simone', 'Ben', 'Paul', 'Rob', 'Dan', 'Marta', 'Kenji', 'Sofia', 'Aisha', 'Enrico'], STAFF_L = ['Allison', 'Schmitz', 'Marchetti', 'Collins', 'Fallows', 'Resta', 'Bennett', 'Monaghan', 'Hughes', 'Okafor', 'Nielsen', 'Tanaka', 'Ribeiro', 'Lindqvist', 'Haddad', 'Cardile'];
const ROLE = { td: 'Technical Director', strat: 'Head of Strategy', crew: 'Pit Crew Chief' };
const staffer = (rating) => ({ name: `${pick(STAFF_F)} ${pick(STAFF_L)}`, rating: +clamp(rating, 0.55, 0.97).toFixed(2), salary: r1(1 + (clamp(rating, 0.55, 0.97) - 0.6) * 9) });
const heat = (c, team, k) => { const p = c.story?.pri?.[team]; if (p) p.heat = clamp((p.heat || 0) + k, 0, 100); };

export function rivalsEnsure(c) {
  for (const t of Object.values(c.teams)) {
    if (t.name === c.myTeam) continue;
    if (!t.ai) {
      const base = 0.86 - t.tier * 0.045, h = hash(t.name);
      t.ai = { phil: PHILS[((t.garage || 0) * 3 + 1) % PHILS.length], boss: c.story?.pri?.[t.name]?.name || `${pick(BOSS_F)} ${pick(BOSS_L)}`, since: c.season, pressure: 0, grey: 0, gains: [], last: null, money: 'steady',
        staff: { td: staffer(base + (h - 0.5) * 0.1), strat: staffer(base + (hash(t.name + 's') - 0.5) * 0.1), crew: staffer(base + (hash(t.name + 'c') - 0.5) * 0.1) }, raided: {} };
    }
    if (c.story?.pri?.[t.name]?.name) t.ai.boss = c.story.pri[t.name].name;
  }
  // (no two teams run by a man of the same name: the second is someone else)
  const seen = new Set();
  for (const t of Object.values(c.teams)) { const A = t.ai; if (!A) continue; let k = 0; while (seen.has(A.boss) && k++ < 30) A.boss = `${pick(BOSS_F)} ${pick(BOSS_L)}`; seen.add(A.boss); if (c.story?.pri?.[t.name]) c.story.pri[t.name].name = A.boss; }
  if (!c.rivals) c.rivals = { approaches: [], protestAt: -9 };
}
/** what a rival's people do to its cars: its crew chief in its stops (as yours is in yours) */
export function rivalFx(c, t) { const s = t.ai?.staff; return s ? { pitMul: 1.08 - 0.12 * s.crew.rating } : { pitMul: 1 }; }
/** a rival's round in the factory: when its way of working says so (a package team saves three rounds' money and spends it at once) */
export function rivalDevelop(c, t) {
  const P = PHIL[t.ai?.phil] || PHIL.steady;
  if (P.every > 1 && (c.round + Math.floor(hash(t.name) * P.every)) % P.every !== 0) return;
  for (let i = 0; i < (P.every > 2 ? 2 : 1); i++) c.aiDevelop(t);
}
/** what reached the cars this round (TechTree.devTick's list): each rival's technical director in how its parts came out, the news of it, what may not be legal -> lines */
export function rivalsLanded(c, done) {
  const by = {}, out = [];
  for (const x of done || []) {
    const t = c.teams[x.team]; if (!t || t.name === c.myTeam || !t.ai || x.re || UP[x.id]?.branch === 'facilities') continue;
    const qa = t.quality?.[x.id], k = x.level - 1, P = PHIL[t.ai.phil] || PHIL.steady;
    if (Array.isArray(qa) && qa[k]) qa[k] = +clamp(qa[k] * (1 + (t.ai.staff.td.rating - 0.75) * 0.25) * P.q, 0.6, 1.14).toFixed(3);
    by[t.name] = (by[t.name] || 0) + (UP[x.id].levels[k].fx.perf || 0) * (Array.isArray(qa) ? +qa[k] || 1 : 1);
  }
  for (const t of Object.values(c.teams)) {
    if (!t.ai) continue; const g = by[t.name] || 0, P = PHIL[t.ai.phil] || PHIL.steady;
    t.ai.gains.push(+g.toFixed(5)); if (t.ai.gains.length > 4) t.ai.gains.shift(); t.ai.grey = clamp(t.ai.grey - 0.12, 0, 1);
    if (g >= 0.0009) { t.ai.last = { round: c.round, season: c.season, perf: +g.toFixed(5) }; if (rnd() < P.grey) t.ai.grey = clamp(t.ai.grey + 0.35 + rnd() * 0.4, 0, 1); out.push(`${t.name} bring ${g >= 0.002 ? 'a major upgrade' : 'new parts'}: about ${(g * 40.5).toFixed(2)} s a lap${t.ai.grey > 0.55 ? ' - and the paddock is asking how' : ''}.`); }
  }
  return out;
}
/** a round among the teams: who comes for your people -> lines */
export function rivalsRound(c) {
  const out = [], R = c.rivals;
  for (const a of [...R.approaches]) if (a.due <= c.round) { R.approaches.splice(R.approaches.indexOf(a), 1); const r = rnd() < 0.65 ? answerApproach(c, a, 'let') : null; out.push(r || `${a.name} turns ${a.team} down and stays.`); }
  if (c.round > 1 && rnd() < 0.16) {
    const role = pick(Object.keys(ROLE)), mine = c.staff?.[role]; if (mine && mine.rating >= 0.78 && !R.approaches.some((a) => a.role === role)) {
      const T = Object.values(c.teams).filter((t) => t.ai && t.ai.staff[role].rating < mine.rating - 0.03 && appeal(c, t.name) > appeal(c, c.myTeam) - 0.25 && (t.budget || 0) > 12);
      const t = T.sort((a, b) => (c.story?.pri?.[b.name]?.heat || 0) - (c.story?.pri?.[a.name]?.heat || 0) + (rnd() - 0.5) * 30)[0];
      if (t) { R.approaches.push({ role, team: t.name, name: mine.name, salary: r1(mine.salary * (1.25 + rnd() * 0.25)), due: c.round + 2 }); out.push(`${t.name} have approached your ${ROLE[role]}, ${mine.name}. Match their offer or he may go.`); }
    }
  }
  return out;
}
/** your answer to an approach for one of your people: 'match' (their salary: he stays) | 'let' (he goes; they pay you for the notice) -> text */
export function answerApproach(c, a, how) {
  const R = c.rivals, i = R.approaches.indexOf(a); if (i >= 0) R.approaches.splice(i, 1);
  const p = c.staff[a.role], t = c.teams[a.team]; if (!p || p.name !== a.name) return `${a.name} is no longer with you.`;
  if (how === 'match') { p.salary = a.salary; c.addNews(`${p.name} stays at ${c.myTeam} on $${a.salary}M a season.`); return `${p.name} stays: $${a.salary}M a season now.`; }
  const comp = r1(p.salary * 0.6); c.team.budget = r1(c.team.budget + comp);
  if (t?.ai) { t.ai.staff[a.role] = { name: p.name, rating: p.rating, salary: a.salary }; t.budget = r1((t.budget || 0) - comp); }
  c.staff[a.role] = { role: a.role, name: `${pick(STAFF_F)} ${pick(STAFF_L)}`, rating: +clamp(p.rating - 0.1 - rnd() * 0.05, 0.55, 0.9).toFixed(2), salary: r1(p.salary * 0.6) };
  c.addNews(`${p.name} leaves ${c.myTeam} for ${a.team}. ${c.staff[a.role].name}, the deputy, steps up.`);
  return `${p.name} goes to ${a.team} ($${comp}M for the notice). ${c.staff[a.role].name} steps up as ${ROLE[a.role]} (${Math.round(c.staff[a.role].rating * 100)}).`;
}
/** what going for a rival's man costs and how likely he is to come -> { fee, odds, who, no } */
export function raidTerms(c, team, role) {
  const t = c.teams[team], who = t?.ai?.staff?.[role]; if (!who) return { no: 'No such person.' };
  if (t.ai.raided[role] === c.season) return { no: `You have asked ${who.name} once this season already.` };
  const fee = r1(who.salary * 1.2 + 1), odds = clamp(0.3 + 0.55 * appeal(c, c.myTeam) - 0.4 * appeal(c, team) + (who.rating < 0.75 ? 0.15 : 0), 0.06, 0.85);
  return { fee, odds, who };
}
/** go for a rival's technical director, strategist or crew chief -> { text, ok } */
export function raid(c, team, role) {
  const T = raidTerms(c, team, role), t = c.teams[team]; if (T.no) return { text: T.no, ok: false };
  if (c.team.budget < T.fee) return { text: `Not enough money: bringing ${T.who.name} over costs $${T.fee}M.`, ok: false };
  t.ai.raided[role] = c.season;
  if (rnd() > T.odds) { heat(c, team, 8); c.team.budget = r1(c.team.budget - 0.2); c.addNews(`${c.myTeam} tried to sign ${T.who.name} from ${team}. He is staying.`); return { text: `${T.who.name} says no, and ${t.ai.boss} knows you asked ($0.2M in fees).`, ok: false }; }
  const was = c.staff[role]; c.team.budget = r1(c.team.budget - T.fee); heat(c, team, 18);
  c.staff[role] = { role, name: T.who.name, rating: T.who.rating, salary: r1(T.who.salary * 1.15) }; t.ai.staff[role] = staffer(T.who.rating - 0.07 - rnd() * 0.05);
  c.addNews(`${T.who.name} leaves ${team} for ${c.myTeam} as ${ROLE[role]}${was ? `, replacing ${was.name}` : ''}. ${t.ai.boss} is not pleased.`); c.save();
  return { text: `${T.who.name} is your ${ROLE[role]} (${Math.round(T.who.rating * 100)}): $${T.fee}M to bring over, $${c.staff[role].salary}M a season.`, ok: true };
}
/** protest a rival's car to the stewards: a deposit, and their last upgrade thrown out if it is found to be what you say -> { text, ok } */
export function protest(c, team) {
  const t = c.teams[team], A = t?.ai, R = c.rivals; if (!A) return { text: 'No such team.', ok: false };
  if (c.round - R.protestAt < 3 && R.protestSeason === c.season) return { text: 'The stewards have had a protest from you lately: wait a few races.', ok: false };
  if (!A.last || A.last.season !== c.season || c.round - A.last.round > 3) return { text: `${team} have brought nothing new lately: there is nothing to protest.`, ok: false };
  if (c.team.budget < 0.5) return { text: 'The deposit is $0.5M.', ok: false };
  R.protestAt = c.round; R.protestSeason = c.season; c.team.budget = r1(c.team.budget - 0.5);
  if (rnd() < 0.08 + 0.8 * A.grey) {
    const cut = +(A.last.perf * 0.6).toFixed(5); t.perfAdj = +((+t.perfAdj || 0) - cut).toFixed(5); t.budget = r1((t.budget || 0) - 2); A.grey = 0; A.last = null; heat(c, team, 22); c.team.budget = r1(c.team.budget + 0.5);
    if (c.story) c.story.cred = clamp((c.story.cred ?? 50) + 4, 0, 100);
    c.addNews(`Protest upheld: ${team}'s new parts are ruled illegal. They lose about ${(cut * 40.5).toFixed(2)} s a lap and $2M.`); c.save();
    return { text: `Upheld. ${team} lose about ${(cut * 40.5).toFixed(2)} s a lap; your deposit comes back. ${A.boss} will not forget it.`, ok: true };
  }
  heat(c, team, 10); if (c.story) c.story.cred = clamp((c.story.cred ?? 50) - 4, 0, 100);
  c.addNews(`${c.myTeam}'s protest against ${team} is dismissed.`); c.save();
  return { text: `Dismissed: the parts are legal. The deposit is gone, and so is some of your word.`, ok: false };
}
/** the winter among the teams: principals who missed their targets twice go, money comes and goes, people move on -> lines */
export function rivalsWinter(c, order) {
  const out = [];
  for (const t of Object.values(c.teams)) {
    const A = t.ai; if (!A) continue; const pos = order.indexOf(t.name) + 1, want = [2, 5, 8, 10][t.tier] ?? 8;
    A.pressure = pos > want + 1 ? A.pressure + 1 : Math.max(0, A.pressure - 1); A.raided = {}; A.gains = []; A.last = null; A.grey = 0;
    if (A.pressure >= 2 && rnd() < 0.7) {
      const old = A.boss; A.boss = `${pick(BOSS_F)} ${pick(BOSS_L)}`; A.phil = pick(PHILS.filter((p) => p !== A.phil)); A.pressure = 0; A.since = c.season;
      if (c.story?.pri?.[t.name]) { c.story.pri[t.name].name = A.boss; c.story.pri[t.name].heat = 0; }
      out.push(`${t.name} sack ${old}: ${A.boss} is the new team principal (${PHIL[A.phil].name.toLowerCase()}).`);
    }
    const q = rnd();
    if (t.tier >= 2 && q < 0.14) { t.budget = r1((t.budget || 0) + 22); A.money = 'flush'; out.push(`${t.name} have a new investor: $22M into the team.`); }
    else if (q > 0.9) { t.budget = r1(Math.max(4, (t.budget || 0) - 9)); A.money = 'tight'; out.push(`${t.name} lose their title sponsor: $9M gone from the budget.`); }
    else A.money = 'steady';
    for (const k of Object.keys(ROLE)) if (rnd() < 0.18) A.staff[k] = staffer(A.staff[k].rating + (rnd() - 0.45) * 0.1);
  }
  return out;
}
/** every team's car against the quickest, as the timing shows it -> [{ name, s (seconds a lap behind), trend, mine }] quickest first */
export function paceTable(c) {
  const rows = Object.values(c.teams).map((t) => ({ t, p: techEffects(t).perf + (t.gap || 0) })), best = Math.max(...rows.map((r) => r.p));
  return rows.sort((a, b) => b.p - a.p).map(({ t, p }) => ({ name: t.name, s: +((best - p) * 40.5).toFixed(2), trend: (t.ai?.gains || []).reduce((a, b) => a + b, 0) * 40.5, mine: t.name === c.myTeam, team: t }));
}
export const ROLE_NAME = ROLE;
