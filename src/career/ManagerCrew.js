// The team principal's pit crew (career/Manager.js): ten people with a job each - the front and rear jacks, a wheel
// gun at every corner, a tyre handler at every corner - and each a speed, a consistency and a fatigue. A stop is as
// long as its slowest corner (the gun and the handler there) and the jacks, a little luck on top; anyone can make a
// mistake - a nut cross-threaded, a jack dropped late, a wheel fumbled - the less consistent and the more tired, the
// more often. Between the races the crew trains to a plan: a focus (speed, consistency, double stops, or rest) and an
// intensity - hard training teaches more and tires more, and a tired crew fumbles. At a race weekend it can practise
// stops (three sessions: sharper for that race, a little more tired). The release: safe (two tenths lost, never
// unsafe), normal, or aggressive (a tenth and a half gained - and now and then an unsafe release: five seconds). Two
// cars stopping on the same lap wait on how ready the crew is for a double stop. People can be replaced from the
// market: a fee, a salary.
const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const FIRST = ['Sam', 'Jo', 'Marco', 'Dani', 'Lee', 'Chris', 'Alex', 'Nico', 'Tomas', 'Ravi', 'Kai', 'Luis', 'Ben', 'Mika', 'Owen', 'Pavel', 'Iker', 'Jules', 'Arjun', 'Matteo', 'Callum', 'Yusuf', 'Erik', 'Hugo'];
const LAST = ['Reyes', 'Novak', 'Carter', 'Bianchi', 'Okoro', 'Lindgren', 'Marsh', 'Duval', 'Petrov', 'Sato', 'Keane', 'Moretti', 'Brandt', 'Ferreira', 'Holt', 'Vance', 'Ilves', 'Roche', 'Banerjee', 'Stone', 'Maddox', 'Quinn', 'Eze', 'Larsen'];

export const CREW_ROLES = [
  { id: 'fj', name: 'Front jack', kind: 'jack' }, { id: 'rj', name: 'Rear jack', kind: 'jack' },
  { id: 'gFL', name: 'Gun · front left', kind: 'gun', corner: 0 }, { id: 'gFR', name: 'Gun · front right', kind: 'gun', corner: 1 },
  { id: 'gRL', name: 'Gun · rear left', kind: 'gun', corner: 2 }, { id: 'gRR', name: 'Gun · rear right', kind: 'gun', corner: 3 },
  { id: 'tFL', name: 'Tyres · front left', kind: 'tyre', corner: 0 }, { id: 'tFR', name: 'Tyres · front right', kind: 'tyre', corner: 1 },
  { id: 'tRL', name: 'Tyres · rear left', kind: 'tyre', corner: 2 }, { id: 'tRR', name: 'Tyres · rear right', kind: 'tyre', corner: 3 },
];
export const TRAIN_FOCUS = { speed: 'Speed', cons: 'Consistency', stack: 'Double stops', rest: 'Rest' };
export const TRAIN_INT = { light: { name: 'Light', gain: 0.5, fat: -0.08 }, normal: { name: 'Normal', gain: 1, fat: -0.01 }, hard: { name: 'Hard', gain: 1.7, fat: 0.07 } };
export const RELEASE = { safe: { name: 'Safe', dt: 0.2, unsafe: 0 }, normal: { name: 'Normal', dt: 0, unsafe: 0.012 }, aggr: { name: 'Aggressive', dt: -0.15, unsafe: 0.07 } };
export const PIT_PRACTICE = 3;

function member(role, base) {
  const sp = clamp(base + (Math.random() - 0.5) * 0.16, 0.4, 0.97), co = clamp(base + (Math.random() - 0.5) * 0.2, 0.4, 0.97);
  return { role, name: `${pick(FIRST)} ${pick(LAST)}`, speed: +sp.toFixed(2), cons: +co.toFixed(2), fat: 0.1, salary: r1(0.1 + ((sp + co) / 2 - 0.5) * 0.7) };
}
/** the crew made once (an old save brought up to date) */
export function crewEnsure(c) {
  if (c.crew?.members?.length === CREW_ROLES.length) return;
  const base = 0.74 - 0.045 * (c.team?.tier ?? 2);
  c.crew = { members: CREW_ROLES.map((R) => member(R.id, base)), plan: { focus: 'speed', int: 'normal' }, release: 'normal', stack: 0.45 + 0.1 * (3 - (c.team?.tier ?? 2)) / 3, sharp: 0, practice: 0, market: null, log: [] };
  crewMarket(c);
}
export function crewMarket(c) { const base = 0.72 - 0.03 * (c.team?.tier ?? 2); c.crew.market = Array.from({ length: 6 }, () => member(pick(CREW_ROLES).id, base + Math.random() * 0.14)); }
const of = (c, id) => c.crew.members.find((m) => m.role === id);
/** the stop the crew would make on an average day (s stationary), and its chance of a mistake */
export function crewExpect(c) {
  crewEnsure(c);
  const M = c.crew, corner = (k) => 1.5 + (1 - (of(c, ['gFL', 'gFR', 'gRL', 'gRR'][k]).speed + of(c, ['tFL', 'tFR', 'tRL', 'tRR'][k]).speed) / 2) * 1.35;
  const jack = 0.22 + (1 - (of(c, 'fj').speed + of(c, 'rj').speed) / 2) * 0.55;
  const time = (Math.max(corner(0), corner(1), corner(2), corner(3)) + jack) * (1 - M.sharp * 0.5) + 0.12 + RELEASE[M.release].dt;
  let ok = 1; for (const m of M.members) ok *= 1 - errP(m, c);
  return { time, err: 1 - ok, fatigue: M.members.reduce((s, m) => s + m.fat, 0) / M.members.length };
}
const errP = (m, c) => 0.002 + (1 - m.cons) * 0.012 + Math.max(0, m.fat - 0.3) * 0.05 + Math.max(0, (c.fatigue || 0) - 0.6) * 0.02;
/**
 * A stop: o { stacked (the team-mate in the box this lap), mul (the crew chief's and the training centre's factor) } ->
 * { time (s stationary, before repairs), slow (a mistake), note (who and what), unsafe (a 5 s penalty to come) }
 */
export function crewStop(c, o = {}) {
  crewEnsure(c);
  const M = c.crew, E = crewExpect(c);
  let time = E.time * (o.mul || 1) + Math.random() * Math.random() * 0.45, slow = false, note = null;
  for (const m of M.members) {
    if (Math.random() >= errP(m, c)) continue;
    const R = CREW_ROLES.find((x) => x.id === m.role); slow = true;
    const add = R.kind === 'gun' ? 2.5 + Math.random() * 3 : R.kind === 'jack' ? 1 + Math.random() * 1.2 : 1.5 + Math.random() * 1.8;
    time += add; note = `${R.kind === 'gun' ? 'wheel nut stuck' : R.kind === 'jack' ? 'the jack dropped late' : 'a wheel fumbled'} (${R.name.toLowerCase()}, ${m.name})`;
    break;
  }
  if (o.stacked) time += (1 - M.stack) * 2.6;
  const unsafe = Math.random() < RELEASE[M.release].unsafe * (o.stacked ? 2 : 1);
  M.log.push({ season: c.season, round: c.round, time: +time.toFixed(2), slow, note, unsafe }); if (M.log.length > 30) M.log.shift();
  return { time, slow, note, unsafe };
}
/** a practice-stop session at the race weekend: sharper for this race, a little more tired -> text */
export function crewPractise(c) {
  crewEnsure(c); const M = c.crew;
  if (M.practice >= PIT_PRACTICE) return 'The crew has done its practice stops for this weekend.';
  M.practice++; M.sharp = Math.min(0.18, M.sharp + 0.06); for (const m of M.members) m.fat = clamp(m.fat + 0.02, 0, 1);
  const t = 1.9 + Math.random() * 0.9;
  return `Practice stops: best ${t.toFixed(2)} s. The crew is sharper for this race (${PIT_PRACTICE - M.practice} session${PIT_PRACTICE - M.practice === 1 ? '' : 's'} left).`;
}
/** the round's training (after a race): the plan's gains and its fatigue; the weekend's sharpness gone */
export function crewRound(c, facMul = 1) {
  crewEnsure(c);
  const M = c.crew, I = TRAIN_INT[M.plan.int] || TRAIN_INT.normal, f = M.plan.focus, g = 0.012 * I.gain * facMul;
  for (const m of M.members) {
    const tired = 1 - 0.5 * m.fat;
    if (f === 'speed') m.speed = clamp(m.speed + g * tired * (1 - m.speed) * 2.2 * (0.6 + Math.random() * 0.8), 0.3, 0.98);
    if (f === 'cons') m.cons = clamp(m.cons + g * tired * (1 - m.cons) * 2.2 * (0.6 + Math.random() * 0.8), 0.3, 0.98);
    m.speed = +m.speed.toFixed(3); m.cons = +m.cons.toFixed(3);
    m.fat = +clamp(m.fat + (f === 'rest' ? -0.3 : I.fat) + 0.03, 0, 1).toFixed(3);   // (a race weekend tires everyone a little)
  }
  M.stack = +clamp(M.stack + (f === 'stack' ? 0.07 * I.gain * facMul : -0.012), 0.1, 0.98).toFixed(3);
  M.sharp = 0; M.practice = 0;
}
export function crewHire(c, i) {
  const M = c.crew, p = M.market?.[i], t = c.team; if (!p) return 'No such person.';
  const fee = r1(p.salary * 1.5); if (t.budget < fee) return `Not enough money: bringing ${p.name} in costs $${fee}M.`;
  const k = M.members.findIndex((m) => m.role === p.role), was = M.members[k];
  t.budget = r1(t.budget - fee); M.members[k] = { ...p, fat: 0.1 }; M.market.splice(i, 1);
  c.addNews?.(`${p.name} joins the pit crew (${CREW_ROLES.find((R) => R.id === p.role).name.toLowerCase()}), replacing ${was.name}.`);
  return `${p.name} replaces ${was.name} on ${CREW_ROLES.find((R) => R.id === p.role).name.toLowerCase()} ($${fee}M).`;
}
/** the winter: everyone rested */
export function crewNewSeason(c) { crewEnsure(c); for (const m of c.crew.members) m.fat = 0.1; c.crew.sharp = 0; c.crew.practice = 0; crewMarket(c); }
export const crewSalaries = (c) => r1((c.crew?.members || []).reduce((s, m) => s + (m.salary || 0), 0));
