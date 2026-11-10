// The team principal's people (career/Manager.js): the drivers' morale, what you tell and promise them, their race
// engineers, the press, and how tired the whole team is.
//
// MORALE (0-100, a driver's): results against what the car and the driver should do, a win or a podium, a retirement
// (the car's fault hurts more than their own), being told to move over, a call overridden on the radio, a contract
// running out with no talks, promises kept and broken - and what you say to them. It is the driver's form on track
// (career/Morale.js: pace, mistakes, starts) and what a contract extension takes: an unhappy driver will not sign.
//
// TALKS: praise or criticism (once a round each driver), and three promises - number-one status for the season (broken
// the moment they are told to let the other car by), a new part on the car within three rounds, contract talks before
// the season ends. Kept: trust; broken: a lot of it gone.
//
// RACE ENGINEERS: one a car. Feedback: how much each practice run tells (ui/Setup.js); chemistry with the driver, which
// grows race by race and is a little pace; swapped, it starts again.
//
// THE PRESS: a question after every race, three ways to answer - each costs or wins something: a driver's morale, the
// board's confidence, the team's profile with sponsors.
//
// FATIGUE (the whole team, 0-1): every round, more with a full factory and hard pit crew training. Tired: parts
// correlate worse, the crew fumbles. A rest week (chosen before a race) takes it off - the factory stands still for it.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sur = (n) => String(n || '').split(' ').pop();
const ENG_FIRST = ['Tom', 'Julien', 'Riccardo', 'Hannah', 'Will', 'Gaëtan', 'Marcus', 'Laura', 'Bono', 'Hugh', 'Xavi', 'Andrea', 'Mark', 'Peter', 'Emma'];
const ENG_LAST = ['Stallard', 'Simon-Chautemps', 'Adami', 'Joseph', 'Bozzi', 'Jego', 'Dudley', 'Mueller', 'Bonnington', 'Bird', 'Marcos', 'Benisi', 'Slade', 'Hall', 'Whitcombe'];

export function peopleEnsure(c) {
  for (const d of Object.values(c.drivers)) if (d.morale == null) d.morale = 60;
  if (!c.promises) c.promises = [];
  if (!c.talked) c.talked = {};
  if (!c.engineers) {
    const tier = c.team?.tier ?? 2, mk = () => ({ name: `${pick(ENG_FIRST)} ${pick(ENG_LAST)}`, feedback: +clamp(0.55 + (3 - tier) * 0.06 + Math.random() * 0.2, 0.4, 0.95).toFixed(2), did: null, chem: 0.4, salary: 0.4 });
    c.engineers = [mk(), mk()];
    c.team.seats.forEach((did, i) => { if (c.engineers[i]) c.engineers[i].did = did; });
    c.engMarket = [mk(), mk(), mk()].map((e) => ({ ...e, feedback: +clamp(e.feedback + 0.08, 0.4, 0.97).toFixed(2), chem: 0.3 }));
  }
  // (a driver signed since: the engineer without a driver takes the driver without an engineer)
  const seats = c.team.seats; for (const e of c.engineers) if (e.did && !seats.includes(e.did)) e.did = null;
  for (const did of seats) if (!c.engineers.some((e) => e.did === did)) { const free = c.engineers.find((e) => !e.did); if (free) { free.did = did; free.chem = 0.3; } }
  if (c.fatigue == null) c.fatigue = 0.2;
  if (c.buzz == null) c.buzz = 0;
}
export const moraleWord = (m) => (m >= 80 ? 'Delighted' : m >= 65 ? 'Happy' : m >= 45 ? 'Content' : m >= 30 ? 'Unhappy' : 'Wants out');
const shift = (c, did, n, why) => { const d = c.drivers[did]; if (!d) return; d.morale = Math.round(clamp((d.morale ?? 60) + n, 0, 100)); if (why && Math.abs(n) >= 4 && d.team === c.myTeam) c.addNews(`${d.name} ${n > 0 ? 'is lifted' : 'is unhappy'}: ${why}.`); };
export const engineerOf = (c, did) => (c.engineers || []).find((e) => e.did === did) || null;
/** a car's practice feedback factor and its little pace from the engineer's chemistry */
export function engineerFx(c, did) { const e = engineerOf(c, did); return e ? { setupK: 0.75 + 0.55 * e.feedback, perf: 1 + (e.chem - 0.5) * 0.0016 } : { setupK: 0.7, perf: 0.9992 }; }

/** something on the radio or the pit wall during the race: 'override' (a stop the driver doubted), 'yield' (told to let the team-mate by), 'held' */
export function raceEvent(c, what, did) {
  peopleEnsure(c);
  if (what === 'override') shift(c, did, -1);
  else if (what === 'yield') { shift(c, did, -5, 'told to let the other car through'); const p = c.promises.find((x) => x.did === did && x.kind === 'no1' && !x.done); if (p) { p.done = true; p.kept = false; shift(c, did, -12, 'promised number-one status, then told to move over'); } }
  else if (what === 'held') shift(c, did, -2);
}
/** the race into the morale, the engineers' chemistry, the team's fatigue; the promises checked; the press's question */
export function peopleAfterRace(c, rows, rep, o = {}) {
  peopleEnsure(c);
  const E = c.entries().map((e) => ({ id: e.careerId, s: (e.perf - 1) * 40.5 + (e.rating - 0.9) * 1.08 })).sort((a, b) => b.s - a.s);
  for (const r of rows) {
    const d = c.drivers[r.car.careerId]; if (!d) continue;
    const exp = E.findIndex((x) => x.id === d.id) + 1 || r.pos, mine = d.team === c.myTeam;
    let n = r.car.retired ? (/accident|collision/i.test(r.car.retireReason || '') ? -2 : -4) : clamp((exp - r.pos) * 0.8, -5, 5) + (r.pos === 1 ? 6 : r.pos <= 3 ? 3 : 0);
    if (mine && !r.car.retired) { const mate = rows.find((x) => x.car.team === d.team && x.car.careerId !== d.id); const md = mate && c.drivers[mate.car.careerId]; if (md && !mate.car.retired && mate.pos < r.pos && d.rating > md.rating + 0.01) n -= 2; }
    shift(c, d.id, n * (mine ? 1 : 0.6));
    // (it settles toward content between races)
    d.morale = Math.round(d.morale + (58 - d.morale) * 0.07);
    if (mine && d.until != null && d.until <= c.season && c.round > c.rounds / 2) shift(c, d.id, -1.5);
  }
  for (const e of c.engineers) if (e.did) e.chem = +clamp(e.chem + 0.05, 0, 1).toFixed(2);
  // the promises: a part within three rounds
  for (const p of c.promises) {
    if (p.done || p.season !== c.season) continue;
    if (p.kind === 'part') {
      if (rep.parts?.length) { p.done = true; p.kept = true; shift(c, p.did, 6, 'the new part they were promised is on the car'); }
      else if (c.round >= p.due) { p.done = true; p.kept = false; shift(c, p.did, -9, 'the part they were promised never came'); }
    }
  }
  // fatigue: the round, the factory's load, the crew's training
  const load = (c.team.dev || []).length, hard = c.crew?.plan?.int === 'hard' && c.crew?.plan?.focus !== 'rest';
  if (o.rest) { c.fatigue = clamp(c.fatigue - 0.32, 0, 1); c.addNews('A rest week: the factory stood still, and the team is fresher for it.'); }
  else c.fatigue = +clamp(c.fatigue + 0.045 + 0.014 * load + (hard ? 0.02 : 0), 0, 1).toFixed(3);
  if (c.fatigue > 0.8) for (const did of c.team.seats) shift(c, did, -1);
  c.talked = {};
  c.buzz = +(c.buzz * 0.8).toFixed(3);
  // the press: what was promised in public for this race, held against the result; a question left unanswered
  if (c.pressTarget && c.pressTarget.round === rep.round) {
    const best = (rep.mine || []).filter((m) => !m.dnf).sort((a, b) => a.pos - b.pos)[0], ok = best && best.pos <= (c.expectedPos?.(true) ?? 10) + 1;
    c.board.conf = Math.round(clamp(c.board.conf + (ok ? 1 : -2), 0, 100)); if (!ok) c.addNews('The papers remember what you promised before the race.');
    c.pressTarget = null;
  }
  if (c.press && !c.press.done) { c.board.conf = Math.round(clamp(c.board.conf - 1, 0, 100)); }
  c.press = makePress(c, rep);
}
function makePress(c, rep) {
  const M = rep.mine || [], best = M.filter((m) => !m.dnf).sort((a, b) => a.pos - b.pos)[0], dnf = M.find((m) => m.dnf), D = c.seatsOf(c.myTeam);
  const exp = c.expectedPos?.() ?? 10, good = best && best.pos <= exp - 1, bad = !best || best.pos > exp + 3;
  const a = D[0]?.id, b = D[1]?.id, worse = M.slice().sort((x, y) => (y.dnf ? 99 : y.pos) - (x.dnf ? 99 : x.pos))[0];
  if (dnf && /accident|collision/i.test(dnf.why || '')) return { q: `${sur(dnf.name)} crashed out today. Was that the driver's mistake?`, opts: [
    { t: 'Back the driver', text: '"These things happen. We win and lose together."', fx: { morale: [[dnf.id, 4]], conf: -1 } },
    { t: 'Blame the driver', text: '"That was avoidable, and he knows it."', fx: { morale: [[dnf.id, -7]], conf: 1 } },
    { t: 'No comment', text: '"We will look at the data."', fx: {} }] };
  if (good) return { q: `A strong result for ${c.myTeam}. Is this the team's real level now?`, opts: [
    { t: 'Talk it up', text: '"This is where we belong - and there is more to come."', fx: { buzz: 0.12, conf: 1, pressure: 1 } },
    { t: 'Credit the drivers', text: '"The drivers were superb today."', fx: { morale: [[a, 3], [b, 3]] } },
    { t: 'Stay humble', text: '"One race. We keep our heads down."', fx: { conf: 1 } }] };
  if (bad) return { q: `A difficult weekend. What went wrong for ${c.myTeam}?`, opts: [
    { t: 'Take the blame', text: '"That is on me and the pit wall, not the drivers."', fx: { morale: [[a, 3], [b, 3]], conf: -2 } },
    { t: 'Blame the car', text: '"We simply did not have the pace."', fx: { conf: -1, fatigue: 0.03 } },
    { t: 'Blame the driver', text: `"${sur(worse?.name)} had the car to do better."`, fx: { morale: [[worse?.id, -6]], conf: 1 } }] };
  return { q: `Solid, not spectacular. What is the target for the next race?`, opts: [
    { t: 'Promise more', text: '"Points with both cars, minimum."', fx: { buzz: 0.08, pressure: 1 } },
    { t: 'Praise the team', text: '"The factory has been flat out. This is for them."', fx: { fatigue: -0.04 } },
    { t: 'Say little', text: '"We take it race by race."', fx: {} }] };
}
/** the answer given -> text */
export function answerPress(c, i) {
  const P = c.press, o = P?.opts?.[i]; if (!P || P.done || !o) return 'There is no question to answer.';
  P.done = true; P.answer = i;
  for (const [did, n] of o.fx.morale || []) if (did) shift(c, did, n, n < 0 ? 'criticised in public by the team principal' : 'backed in public by the team principal');
  if (o.fx.conf) c.board.conf = Math.round(clamp(c.board.conf + o.fx.conf, 0, 100));
  if (o.fx.buzz) c.buzz = +clamp(c.buzz + o.fx.buzz, 0, 0.4).toFixed(3);
  if (o.fx.fatigue) c.fatigue = clamp(c.fatigue + o.fx.fatigue, 0, 1);
  if (o.fx.pressure) c.pressTarget = { round: c.round, n: o.fx.pressure };
  c.addNews(`To the press: ${o.text}`);
  return `You said: ${o.text}`;
}

// ---- talks ---------------------------------------------------------------------------------------------------------------
export const TALKS = {
  praise: { name: 'PRAISE', title: 'Tell them they are doing a great job (once a round)' },
  push: { name: 'DEMAND MORE', title: 'Tell them you expect more: it fires some drivers up, and upsets others (once a round)' },
  no1: { name: 'PROMISE NO. 1 STATUS', title: 'Number-one status for the season: broken the moment they are told to let the other car through' },
  part: { name: 'PROMISE A NEW PART', title: 'A new part on the car within three rounds' },
  contract: { name: 'PROMISE CONTRACT TALKS', title: 'An extension before the season ends' },
};
export function talk(c, did, kind) {
  peopleEnsure(c);
  const d = c.drivers[did]; if (!d || d.team !== c.myTeam) return 'Not your driver.';
  const live = (k) => c.promises.find((p) => p.did === did && p.kind === k && p.season === c.season && !p.done);
  if (kind === 'praise' || kind === 'push') {
    if (c.talked[did]) return `You have already spoken to ${d.name} this round.`;
    c.talked[did] = true;
    if (kind === 'praise') { const n = d.morale >= 80 ? 0 : d.morale >= 65 ? 1 : 2; shift(c, did, n); return n ? `${d.name} appreciates it.` : `${d.name} has heard it before: it changes nothing.`; }
    const fired = Math.random() < 0.45 + (d.rating - 0.85) * 2; shift(c, did, fired ? 3 : -4);
    return fired ? `${d.name} takes it well: "I'll show you."` : `${d.name} does not take it well.`;
  }
  if (live(kind)) return `You have already promised ${d.name} that.`;
  if (kind === 'no1') { const other = c.promises.find((p) => p.kind === 'no1' && p.season === c.season && !p.done && p.did !== did); if (other) return `You have promised that to ${c.drivers[other.did]?.name}.`; }
  c.promises.push({ did, kind, season: c.season, round: c.round, due: c.round + 3, done: false, kept: null });
  shift(c, did, kind === 'no1' ? 8 : 4);
  return `${d.name}: "${kind === 'no1' ? 'Number one. I will hold you to that.' : kind === 'part' ? 'Good. I need it on the car within three races.' : 'Then let us talk before the season is out.'}"`;
}
/** a contract extended: the promise kept, the driver lifted */
export function onExtend(c, did) { const p = c.promises.find((x) => x.did === did && x.kind === 'contract' && !x.done); if (p) { p.done = true; p.kept = true; } shift(c, did, 6); }
/** will this driver sign on? -> null, or why not */
export function extendBlock(c, did) { const d = c.drivers[did]; return d && (d.morale ?? 60) < 28 ? `${d.name} will not sign: ${moraleWord(d.morale).toLowerCase()} with the team.` : null; }
/** the season's end: the promises still open */
export function peopleSeasonEnd(c) {
  for (const p of c.promises) {
    if (p.done || p.season !== c.season) continue; p.done = true;
    if (p.kind === 'no1') { p.kept = true; shift(c, p.did, 4, 'number-one status, as promised, all season'); }
    else { p.kept = false; shift(c, p.did, p.kind === 'contract' ? -10 : -8, p.kind === 'contract' ? 'the contract talks they were promised never happened' : 'a promise broken'); }
  }
}
/** the engineers swapped between the two cars: the chemistry starts again */
export function swapEngineers(c) {
  const [a, b] = c.engineers; if (!a || !b) return 'Two engineers are needed.';
  [a.did, b.did] = [b.did, a.did]; a.chem = 0.3; b.chem = 0.3;
  return `${a.name} now runs ${c.drivers[a.did]?.name || 'the other car'}, ${b.name} ${c.drivers[b.did]?.name || 'the other car'}. They start from scratch together.`;
}
export function hireEngineer(c, i, slot) {
  const p = c.engMarket?.[i], was = c.engineers[slot], t = c.team; if (!p || !was) return 'No such engineer.';
  const fee = 0.8; if (t.budget < fee) return `Not enough money: $${fee}M to bring ${p.name} in.`;
  t.budget = Math.round((t.budget - fee) * 10) / 10; c.engineers[slot] = { ...p, did: was.did, chem: 0.3 }; c.engMarket.splice(i, 1);
  c.addNews(`${p.name} joins as race engineer for ${c.drivers[was.did]?.name || 'a car'}, replacing ${was.name}.`);
  return `${p.name} is ${c.drivers[was.did]?.name || 'the car'}'s race engineer ($${fee}M).`;
}
/** how tiredness spoils a new part (a factor on its correlation) */
export const fatigueQ = (c) => 1 - Math.max(0, (c.fatigue || 0) - 0.5) * 0.16;
