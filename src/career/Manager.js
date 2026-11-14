// The team principal's career: you run a Formula 1 team, season after season - never a driver. The whole paddock lives
// on in one save (the browser's): every team develops its car through the tech tree (career/TechTree.js - the AI teams
// choose their own upgrades, you choose yours, all under the cost cap), every driver has a contract (who drives for
// whom, for how much, until when), and the championship runs on a calendar of the circuits. Yours to decide: what the
// factory builds; who drives for you (the two you start with, a contract extended, a driver released and paid off, a
// free agent signed - the reserves and F2); three key staff (the technical director: how well a part correlates; the
// head of strategy: how often the pit wall gets a call wrong; the pit crew chief: how long a stop takes); and the race
// weekends themselves (main.js TP: watched on the feed and run from the pit wall, or simulated). The money: a share of
// the commercial rights every race and more by the points scored, the title sponsor's bonus for its target that
// weekend, the salaries going out every race, and the prize money at the season's end by the constructors' order. The
// board sets a target (a place in the constructors' championship, by what the team is) and watches: its confidence
// moves with every result, and a season far short of the target with the board's patience gone is the end - another
// team, a smaller one, may offer you a way back.
import { ROSTER, RESERVES, F2, POINTS, PERF_GAIN, dayPerf } from '../race/Roster.js';
import { startLevels, techEffects, devTick, aiDevelopTeam, upgradeName, UP } from './TechTree.js';
import { crewEnsure, crewRound, crewNewSeason, crewSalaries } from './ManagerCrew.js';
import { peopleEnsure, peopleAfterRace, peopleSeasonEnd, raceEvent, onExtend, extendBlock, engineerFx, fatigueQ } from './ManagerPeople.js';
import { carEnsure, trackFit, engineFx, buildCheck, onBuilt, carRound, carNewSeason, rulesChange } from './ManagerCar.js';
import { storyEnsure, storyAfterRace, storySeasonStart, storyBeforeRace, subOf } from './ManagerStory.js';
import { opsEnsure, puEffect, sparesPerf, partsAfterRace, partsNewSeason, takePenalties, facFx, facRound, sponsorRace, sponsorsSeasonEnd } from './ManagerOps.js';

const KEY = 'f1sim-manager-v1';
import { seasonsEnsure, ageDrivers, retireRound, marketRound, marketWinter, contractAsk, academyRound, academyWinter, regsReset, gapsWinter } from './Seasons.js';
import { rivalsEnsure, rivalFx, rivalDevelop, rivalsLanded, rivalsRound, rivalsWinter } from './Rivals.js';
export const TRACKS_ALL = ['lasvegas', 'silverstone', 'montreal', 'austin'];
/** $M a team starts a season with, by tier; the commercial rights every race; the cost cap on development a season */
export const TIER_BUDGET = [60, 50, 42, 36];
export const RACE_INCOME = [4.2, 3.9, 3.6, 3.3];
/** the commercial rights' share by the points scored, a point ($M) */
export const POINT_INCOME = 0.25;
export const COST_CAP = 70;
/** the board's target in the constructors' championship by tier, and the prize money by where a team ends ($M) */
export const BOARD_TARGET = [2, 4, 6, 9];
export const PRIZE = [14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
export const TIER_NAME = ['Top team', 'Upper midfield', 'Lower midfield', 'Backmarker'];
export const STAFF_ROLES = {
  td: { name: 'Technical Director', what: 'How well a new part does on the car what it did in the tunnel (correlation).' },
  strat: { name: 'Head of Strategy', what: 'How often the AI strategist gets a call wrong - a stop a lap late, a tyre that will not last.' },
  crew: { name: 'Pit Crew Chief', what: 'How long a stop takes.' },
};
const FIRST = ['James', 'Pierre', 'Andrea', 'Hannah', 'Luca', 'Ruth', 'Tom', 'Laurent', 'Mattia', 'Gianpiero', 'Simone', 'Ben', 'Jonathan', 'Bernadette', 'Paul', 'Ayao', 'Claire', 'Rob', 'Dan', 'Marta', 'Kenji', 'Sofia', 'Nikolas', 'Aisha'];
const LAST = ['Allison', 'Waché', 'Stella', 'Schmitz', 'Marchetti', 'Collins', 'Fallows', 'Wheatley', 'Lambiase', 'Resta', 'Bennett', 'Mekies', 'Vowles', 'Komatsu', 'Monaghan', 'Hughes', 'Okafor', 'Nielsen', 'Varga', 'Tanaka', 'Ribeiro', 'Lindqvist', 'Haddad', 'Moreau'];

const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const id = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
/** a driver's asking salary a season ($M), from their rating */
export const askOf = (rating) => Math.max(0.5, Math.round((rating - 0.72) * 80) / 2);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function person(role, rating) {
  return { role, name: `${pick(FIRST)} ${pick(LAST)}`, rating: +rating.toFixed(2), salary: r1(1 + (rating - 0.6) * 9) };
}

export class ManagerCareer {
  constructor(o) { Object.assign(this, o); this.manager = true; }

  /** a new career: o { team, rounds, laps, diff, tracks } */
  static create(o) {
    const teams = {}, drivers = {}, order = [];
    for (const r of ROSTER) {
      if (!teams[r.team]) { order.push(r.team); teams[r.team] = { name: r.team, color: r.color, color2: r.color2, tier: r.tier, livery: r.livery || null, budget: TIER_BUDGET[r.tier], levels: startLevels(r.tier), quality: {}, dev: [], points: 0, garage: order.length - 1, seats: [] }; }
      const d = newDriver(r.name, r.short, r.rating, r.number, r.helmet, 'F1');
      d.team = r.team; d.salary = askOf(r.rating); d.until = 2026 + 1 + (ROSTER.indexOf(r) % 3 === 0 ? 0 : 1);
      drivers[d.id] = d; teams[r.team].seats.push(d.id);
    }
    for (const r of Object.values(RESERVES)) if (!drivers[id(r[0])]) drivers[id(r[0])] = newDriver(r[0], r[1], r[2], r[3], r[4], r[5] === 'F2' ? 'F2' : 'Reserve');
    for (const r of F2) if (!drivers[id(r[0])]) drivers[id(r[0])] = newDriver(r[0], r[1], r[2], r[3], r[4], 'F2');
    const tracks = (o.tracks && o.tracks.length ? o.tracks : TRACKS_ALL), rounds = Math.max(2, Math.min(24, o.rounds || 8));
    const calendar = Array.from({ length: rounds }, (_, i) => tracks[i % tracks.length]);
    const my = teams[o.team] ? o.team : order[0], T = teams[my];
    const staff = { td: person('td', 0.68 + 0.08 * (3 - T.tier) / 3 + Math.random() * 0.06), strat: person('strat', 0.66 + 0.1 * (3 - T.tier) / 3 + Math.random() * 0.06), crew: person('crew', 0.66 + 0.1 * (3 - T.tier) / 3 + Math.random() * 0.06) };
    const c = new ManagerCareer({ v: 1, season: 2026, round: 1, rounds, calendar, laps: o.laps || 5, diff: o.diff ?? 75, teams, drivers, myTeam: my, staff,
      board: { target: 0, conf: 60 }, since: 2026, seasonSpend: 0, spendAt: 0, news: [], results: [], history: [], last: null, seasonDone: false, sacked: false, offers: [], hires: null });
    c.forecast = calendar.map(forecastFor); c.board.target = c.boardTarget();
    c.addNews(`You take charge of ${my} for the ${c.season} season. The board expects P${c.board.target} in the constructors' championship.`);
    c.ensure(); c.newObjective(); c.refreshHires(); storySeasonStart(c); c.save();
    return c;
  }
  static load() { try { const s = localStorage.getItem(KEY); if (!s) return null; const o = JSON.parse(s); if (!o || o.v !== 1) return null; const c = new ManagerCareer(o); c.ensure(); return c; } catch (e) { return null; } }
  static erase() { try { localStorage.removeItem(KEY); } catch (e) { /* nothing kept */ } }
  static peek() { const c = ManagerCareer.load(); return c ? `${c.myTeam} · Season ${c.season} · ${c.seasonDone ? 'the season is over' : `Round ${c.round} of ${c.rounds}`}` : null; }
  save() { try { const o = { ...this }; delete o.manager; localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* a private window: this sitting only */ } }

  get team() { return this.teams[this.myTeam]; }
  /** every system's state made or brought up to date: parts, facilities and sponsors; the pit crew; the people; the car */
  ensure() { opsEnsure(this); crewEnsure(this); peopleEnsure(this); carEnsure(this); storyEnsure(this); seasonsEnsure(this); rivalsEnsure(this); }
  /** may this level be started (the cost cap, the tunnel's hours) -> null or why not; a level started (career/ManagerCar.js) */
  buildCheck(id, lvl, cost) { return buildCheck(this, id, lvl, cost); }
  onBuilt(id, lvl) { onBuilt(this, id, lvl); }
  /** something in the race for the people's morale: 'override' | 'yield' | 'held' (career/ManagerPeople.js) */
  onRaceEvent(what, did) { raceEvent(this, what, did); }
  addNews(text) { this.news.unshift({ season: this.season, round: this.round, text }); if (this.news.length > 60) this.news.length = 60; }
  seatsOf(team) { return (this.teams[team]?.seats || []).map((x) => this.drivers[x]).filter(Boolean); }
  freeAgents() { return Object.values(this.drivers).filter((d) => !d.team && !d.retired).sort((a, b) => b.rating - a.rating); }
  /** the constructors' order now (points, then the pecking order) */
  constructors() { return Object.values(this.teams).sort((a, b) => b.points - a.points || a.tier - b.tier || a.garage - b.garage); }
  drivers_() { return Object.values(this.drivers).filter((d) => d.team || d.points > 0).sort((a, b) => b.points - a.points || b.rating - a.rating); }
  posOf(team) { return this.constructors().findIndex((t) => t.name === team) + 1; }
  /** a team's place as the board reads it: level on points is level (one ahead of everyone it beats) */
  boardPos(team) { const p = this.teams[team]?.points || 0; return 1 + Object.values(this.teams).filter((t) => t.points > p).length; }
  /** this round's circuit and its forecast */
  get track() { return this.calendar[this.round - 1]; }
  get fc() { return this.forecast[this.round - 1] || { weather: 'dry', time: 'day' }; }
  /** development spent this season, against the cost cap */
  spent(t = this.team) { return r1((+t.devSpend?.all || 0) - (t.spendAt || 0)); }
  /** the board's target: where the team should finish, by its car and its drivers against the field (a top team: the title) */
  boardTarget(team = this.myTeam) {
    const E = this.entries().map((e) => ({ e, s: paceOf(e) })), by = {};
    for (const x of E) by[x.e.team] = (by[x.e.team] || 0) + x.s;
    const order = Object.keys(by).sort((a, b) => by[b] - by[a]), i = order.indexOf(team) + 1;
    return Math.max(1, i || BOARD_TARGET[this.teams[team]?.tier ?? 2]);
  }
  /** an AI team's round in the factory, under the cost cap: it spends no more than the cap leaves it (the AI keeps $6M back) */
  aiDevelop(t) {
    const real = +t.budget || 0, room = Math.max(0, COST_CAP - this.spent(t)), cap = Math.min(real, room + 6);
    t.budget = cap; aiDevelopTeam(this, t); const used = cap - t.budget; t.budget = r1(real - used);
  }
  capLeft() { return r1(COST_CAP - this.spent()); }
  salaries() { return r1(this.seatsOf(this.myTeam).reduce((s, d) => s + (d.salary || 0), 0)); }
  staffCost() { return r1(Object.values(this.staff).reduce((s, p) => s + (p.salary || 0), 0)); }

  // ---- the race field ------------------------------------------------------------------------------------------------
  /** every car this weekend -> [{ careerId, name, short, team, color, color2, livery, helmet, tier, perf, rating, number, fx, garage, mine }] */
  entries(track = this.track) {
    const out = [];
    for (const t of Object.values(this.teams).sort((a, b) => a.garage - b.garage)) {
      const fx = techEffects(t), fit = trackFit(t, track), eng = engineFx(this, t);   // (how the car suits the circuit; its power unit's maker: career/ManagerCar.js)
      for (const d0 of this.seatsOf(t.name)) {
        const d = t.name === this.myTeam ? subOf(this, d0) : d0;   // (a reserve in an injured driver's car: career/ManagerStory.js)
        // (the power unit's wear - a worn ICE a little down on power, any worn element more likely to fail - and, for your
        //  team, a damaged part raced for want of a spare: career/ManagerOps.js)
        const pu = puEffect(this, t.name, d0.id), sp = t.name === this.myTeam ? sparesPerf(this, t.name) : 1;
        out.push({ careerId: d.id, name: d.name, short: d.short, team: t.name, color: t.color, color2: t.color2, livery: t.livery, helmet: d.helmet, tier: t.tier, perf: (fx.perf + (t.gap || 0)) * pu.perfMul * sp * fit * eng.perf * (t.name === this.myTeam ? engineerFx(this, d0.id).perf : 1),   /* (t.gap: the grid's width - career/Seasons.js) */ rating: d.rating, number: d.number, morale: d.morale ?? 60, fx: { ...fx, relMul: (fx.relMul || 1) * pu.relMul * eng.relMul, pitMul: (fx.pitMul || 1) * (t.name === this.myTeam ? 1 : rivalFx(this, t).pitMul) }, garage: t.garage, mine: t.name === this.myTeam, champPts: d.points });
      }
    }
    return out;
  }
  /** the staff's effect on your cars: pitMul (the stop's length), faultMul (the strategist's mistakes) */
  staffFx() {
    const s = this.staff;
    return { pitMul: (1.08 - 0.12 * (s.crew?.rating ?? 0.7)) * facFx(this, 'pitc').pitMul, faultMul: clamp(2.2 - 2 * (s.strat?.rating ?? 0.7), 0.25, 1.4) };
  }

  // ---- the weekend done ------------------------------------------------------------------------------------------------
  /**
   * A race's result into the season: rows [{ pos, car: { careerId, team, retired, bestLap } }] (the live race's
   * classification, or simRace's). Points, the money, the factories, the board, the next round -> a report for the hub
   */
  applyRace(rows, trackId, o = {}) {
    if (this.seasonDone) return null;
    const rep = { round: this.round, track: trackId, season: this.season, mine: [], income: 0, sponsor: 0, wages: 0, objective: this.objective ? { ...this.objective, met: false } : null, parts: [], conf0: this.board.conf };
    const byTeam = {};
    let fl = null; for (const r of rows) if (!r.car.retired && isFinite(r.car.bestLap) && (!fl || r.car.bestLap < fl.car.bestLap)) fl = r;
    for (const r of rows) {
      const d = this.drivers[r.car.careerId], t = this.teams[r.car.team]; if (!d || !t) continue;
      const pts = r.car.retired ? 0 : (POINTS[r.pos - 1] || 0);
      d.points += pts; d.starts = (d.starts || 0) + 1; if (pts && r.pos === 1) d.wins = (d.wins || 0) + 1; if (!r.car.retired && r.pos <= 3) d.podiums = (d.podiums || 0) + 1;
      t.points += pts; byTeam[t.name] = (byTeam[t.name] || 0) + pts;
      if (t.name === this.myTeam) rep.mine.push({ id: d.id, name: d.name, pos: r.pos, pts, dnf: !!r.car.retired, why: r.car.retireReason || null });
    }
    // the money: the commercial rights and a share by the points; the salaries; your sponsor's target and your staff
    for (const t of Object.values(this.teams)) {
      const inc = RACE_INCOME[t.tier] + (byTeam[t.name] || 0) * POINT_INCOME, wages = this.seatsOf(t.name).reduce((s, d) => s + (d.salary || 0), 0) / this.rounds;
      t.budget = r1(t.budget + inc - wages);
      if (t.name === this.myTeam) { const staff = (this.staffCost() + crewSalaries(this) + (this.engineers || []).reduce((s, e) => s + (e.salary || 0), 0)) / this.rounds; rep.income = r1(inc); rep.wages = r1(wages + staff); t.budget = r1(t.budget - staff); }
    }
    // the sponsors: their fees, and the bonus of each whose target for the weekend was met (career/ManagerOps.js)
    const sp = sponsorRace(this, rep.mine);
    this.team.budget = r1(this.team.budget + sp.fees + sp.bonus); rep.sponsor = r1(sp.fees + sp.bonus); rep.spFees = sp.fees; rep.spBonus = sp.bonus; rep.spMet = sp.met;
    if (sp.met.length) this.addNews(`Sponsor targets met: ${sp.met.join(', ')} - $${sp.bonus}M in bonuses.`);
    // the parts: the weekend's wear and damage, the factory's spares; the facilities' round
    rep.used = partsAfterRace(this, rows, o.push || {}); facRound(this);
    // the factories: what was built reaches the cars (your technical director's eye on how it correlates), then every
    // other team chooses its next work
    if (this.restWeek) for (const x of this.team.dev || []) x.left++;   // (a rest week: the factory stands still)
    const done = devTick(this);
    const td = this.staff.td?.rating ?? 0.7, tired = fatigueQ(this);
    for (const x of done) {
      if (x.team !== this.myTeam || x.re || UP[x.id]?.branch === 'facilities') continue;
      const qa = this.team.quality[x.id], k = x.level - 1; if (!qa) continue;
      qa[k] = +clamp(qa[k] * (1 + (td - 0.75) * 0.25) * tired, 0.6, 1.12).toFixed(3); x.q = qa[k];
      rep.parts.push({ id: x.id, level: x.level, q: x.q });
      this.addNews(`${upgradeName(x.id, x.level)} is on the car: ${Math.round(x.q * 100)}% of what the tunnel promised.`);
    }
    for (const line of rivalsLanded(this, done)) this.addNews(line);
    for (const t of Object.values(this.teams)) if (t.name !== this.myTeam) rivalDevelop(this, t);   // (each in its own way: career/Rivals.js)
    // the paddock: who comes for your people, who signs whom for next year, who is stopping; your juniors' round
    for (const line of [...rivalsRound(this), ...marketRound(this), ...retireRound(this)]) this.addNews(line);
    academyRound(this);
    // the people and the car: what the team principal's orders did to the drivers; morale, the engineers, fatigue, the
    // press; the pit crew's training; the work on next year's car
    for (const ev of o.events || []) raceEvent(this, ev.what, ev.did);
    peopleAfterRace(this, rows, rep, { rest: !!this.restWeek });
    if (!this.restWeek) crewRound(this, 1 + (1.04 - facFx(this, 'pitc').pitMul) * 5); else { const f = this.crew.plan.focus; this.crew.plan.focus = 'rest'; crewRound(this, 1); this.crew.plan.focus = f; }
    carRound(this); this.restWeek = false;
    // the board: where the team stands against its target, and this race against what the car should do
    const pos = this.posOf(this.myTeam), bpos = this.boardPos(this.myTeam), tgt = this.board.target, exp = expectedPoints(this, this.myTeam), got = byTeam[this.myTeam] || 0;
    const delta = clamp(clamp(tgt - bpos, -3, 3) * 0.6 + (got - exp) * 0.3, -6, 6);
    this.board.conf = Math.round(clamp(this.board.conf + delta, 0, 100)); rep.conf = this.board.conf;
    // the race into the history
    this.results.push({ season: this.season, round: this.round, track: trackId, top: rows.slice(0, 3).map((r) => r.car.careerId), mine: rep.mine.map((m) => ({ id: m.id, pos: m.pos, dnf: m.dnf })), fl: fl?.car.careerId || null });
    if (rep.mine.length) this.addNews(`Round ${this.round}: ${rep.mine.map((m) => `${m.name.split(' ').pop()} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ')} - ${got} point${got === 1 ? '' : 's'}. ${this.teams[this.myTeam].name} P${pos} in the constructors'.`);
    this.last = rep;
    this.round++;
    if (this.round > this.rounds) this.endSeason(); else this.newObjective();
    try { storyAfterRace(this, rep, rows, o.live || null); } catch (e) { console.error('[manager] the story', e); }   // (the drama out of the race: career/ManagerStory.js)
    this.save();
    return rep;
  }
  /** the weekend simulated (no race run): every car's result from its car, its driver and the day */
  simRace() {
    storyBeforeRace(this);
    const track = this.track, wet = { dry: 0, changeable: 0.2, damp: 0.35, wet: 0.75 }[this.fc.weather] ?? 0;
    const E = this.entries(), g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 1.63, pen = takePenalties(this);
    const rows = E.map((e) => {
      const rel = e.fx.relMul || 1, dnf = Math.random() < (0.035 * rel + 0.03 * wet) * (1.5 - e.rating * 0.5) * this.laps / 10;
      const score = paceOf({ perf: e.perf + dayPerf(e.team, track), rating: e.rating }) + g() * (0.15 + wet * 0.25) - (pen.get(e.name) || 0) * 0.03;   // (seconds a lap: the car, the driver, the day; a grid penalty: a start further back)
      return { e, score, dnf };
    }).sort((a, b) => (a.dnf - b.dnf) || b.score - a.score);
    return rows.map((x, i) => ({ pos: i + 1, car: { careerId: x.e.careerId, team: x.e.team, name: x.e.name, retired: x.dnf, retireReason: x.dnf ? (Math.random() < 0.5 ? 'Accident' : 'Mechanical') : null, bestLap: x.dnf ? Infinity : 90 - x.score * 0.05 } }));
  }
  /** where your cars should finish on average, by the car and the drivers against the field */
  expectedPos(best = false) { return expectedPos(this, this.myTeam, best); }
  /** the title sponsor's target for the coming weekend, by what the car can do */
  newObjective() {
    const pos = expectedPos(this, this.myTeam), t = this.team.tier;
    const best = Math.max(1, Math.round(pos - 1)), both = Math.min(10, Math.round(pos + 2));
    const o = Math.random() < 0.5 ? { kind: 'best', pos: best, text: best === 1 ? 'win the race' : `a car in the top ${best}`, reward: r1(1 + (4 - t) * 0.4 + (pos - best) * 0.3) }
      : both <= 10 ? { kind: 'both', pos: both, text: `both cars in the top ${both}`, reward: r1(1.2 + (4 - t) * 0.35) } : { kind: 'finish', pos: 22, text: 'both cars to the flag', reward: 1 };
    this.objective = o;
  }

  // ---- your decisions ----------------------------------------------------------------------------------------------------
  /** can this part be built under the cost cap -> null (yes) or why not */
  capCheck(cost) { return this.spent() + cost > COST_CAP + 1e-9 ? `Over the cost cap: $${this.spent()}M of $${COST_CAP}M spent this season.` : null; }
  /** a driver's contract extended by `years`: what he asks is his worth, who else wants him, how he feels (career/Seasons.contractAsk) -> text */
  extend(did, years = 1) {
    const d = this.drivers[did]; if (!d || d.team !== this.myTeam) return 'Not your driver.';
    const no = extendBlock(this, did); if (no) return no;
    const T = contractAsk(this, d, years); if (T.no) return T.no;
    onExtend(this, did);
    const had = d.offer; d.until = Math.max(d.until, this.season) + years; d.salary = T.salary; delete d.offer;
    this.addNews(`${d.name} signs on to the end of ${d.until}: $${T.salary}M a season.${had ? ` ${had.team} are turned down.` : ''}`); this.save();
    return `${d.name} extends to the end of ${d.until} at $${T.salary}M a season.`;
  }
  /** what releasing a driver costs: the rest of this season's salary and the next ones' half */
  releaseCost(d) { const left = (this.rounds - this.round + 1) / this.rounds; return r1(d.salary * left + d.salary * 0.5 * Math.max(0, d.until - this.season)); }
  release(did) {
    const d = this.drivers[did], t = this.team; if (!d || d.team !== this.myTeam) return 'Not your driver.';
    const cost = this.releaseCost(d); if (t.budget < cost) return `Not enough money: releasing ${d.name} costs $${cost}M.`;
    t.budget = r1(t.budget - cost); t.seats = t.seats.filter((x) => x !== did); d.team = null; d.until = null; d.salary = askOf(d.rating);
    this.addNews(`${d.name} is released by ${t.name} ($${cost}M paid off).`); this.save();
    return `${d.name} released: $${cost}M paid off. Sign a driver for the empty seat before the next race.`;
  }
  /** a free agent into your empty seat for `years`: his asking salary (career/Seasons.contractAsk), a signing fee of half a season's */
  sign(did, years = 2) {
    const d = this.drivers[did], t = this.team; if (!d || d.team || d.retired) return 'Not a free agent.';
    if (t.seats.length >= 2) return 'Both seats are taken: release a driver first.';
    const T = contractAsk(this, d, years); if (T.no) return `Not signed: ${T.no}`;
    if (t.budget < T.fee) return `Not enough money for the signing fee ($${T.fee}M).`;
    t.budget = r1(t.budget - T.fee); d.team = t.name; d.salary = T.salary; d.until = this.season + years - 1; t.seats.push(did); delete d.offer; delete d.next;
    this.addNews(`${t.name} sign ${d.name} to the end of ${d.until}: $${T.salary}M a season.`); this.ensure(); this.save();
    return `${d.name} signed: $${T.salary}M a season to the end of ${d.until} (signing fee $${T.fee}M).`;
  }
  /** the staff on the market for each role (drawn once a season, or after a hire) */
  refreshHires() {
    const tier = this.team.tier;
    this.hires = Object.fromEntries(Object.keys(STAFF_ROLES).map((k) => [k, Array.from({ length: 3 }, (_, i) => person(k, clamp(0.62 + i * 0.1 + Math.random() * 0.08 - tier * 0.01, 0.55, 0.97)))]));
  }
  hire(role, i) {
    const p = this.hires?.[role]?.[i], t = this.team; if (!p) return 'No such person.';
    const fee = r1(p.salary * 0.6); if (t.budget < fee) return `Not enough money: the move costs $${fee}M.`;
    const was = this.staff[role]; t.budget = r1(t.budget - fee); this.staff[role] = p; this.hires[role].splice(i, 1, person(role, clamp(0.6 + Math.random() * 0.3, 0.55, 0.95)));
    this.addNews(`${p.name} joins ${t.name} as ${STAFF_ROLES[role].name}${was ? `, replacing ${was.name}` : ''}.`); this.save();
    return `${p.name} is your ${STAFF_ROLES[role].name} ($${fee}M to bring in, $${p.salary}M a season).`;
  }
  /** a seat empty: the race cannot start without two drivers */
  seatsReady() { return this.team.seats.length >= 2; }

  // ---- the season's end ------------------------------------------------------------------------------------------------
  endSeason() {
    this.seasonDone = true;
    const order = this.constructors(), pos = order.findIndex((t) => t.name === this.myTeam) + 1, tgt = this.board.target;
    const rev = { season: this.season, pos, target: tgt, prize: PRIZE[pos - 1] ?? 1, champ: this.drivers_()[0]?.name, champTeam: order[0].name, conf: this.board.conf };
    for (const t of order) { const i = order.indexOf(t); t.budget = r1(t.budget + (PRIZE[i] ?? 1) + (t.name === this.myTeam && i + 1 < tgt ? 5 : 0)); }
    // the board's verdict: beaten the target, met it, short of it - and out of patience
    const bpos = this.boardPos(this.myTeam); rev.bpos = bpos;
    this.board.conf = Math.round(clamp(this.board.conf + clamp(tgt - bpos, -4, 4) * 6, 0, 100));
    rev.verdict = bpos < tgt ? 'beaten' : bpos === tgt ? 'met' : 'missed';
    // (a first season with a team is a free one: the board judges the second)
    if (bpos > tgt + 2 && this.board.conf < 20 && this.season > (this.since ?? this.season)) {
      this.sacked = true; rev.verdict = 'sacked';
      // (a team further down the order wants you: a chance to rebuild)
      this.offers = Object.values(this.teams).filter((t) => t.name !== this.myTeam && t.tier >= this.team.tier).sort(() => Math.random() - 0.5).slice(0, 2).map((t) => t.name);
    }
    rev.sponsorPaid = sponsorsSeasonEnd(this, rev.bpos ?? pos);
    peopleSeasonEnd(this);
    this.history.push(rev); this.review = rev;
    this.addNews(`Season ${this.season} is over: ${this.myTeam} P${pos} in the constructors' (the board's target P${tgt}). ${rev.champ} is champion, ${rev.champTeam} the constructors' champions.`);
  }
  /** the next season: contracts that ran out (the AI teams sign whom they need), the points to zero, the budgets topped up */
  nextSeason(newTeam = null) {
    if (newTeam && this.teams[newTeam]) { this.myTeam = newTeam; this.since = this.season + 1; this.board = { target: 0, conf: 55 }; this.sacked = false; this.offers = []; this.addNews(`You join ${newTeam} as team principal.`); }
    const order = this.constructors().map((t) => t.name);   // (the season just ended: the rivals' boards judge by it)
    this.season++;
    // the winter (career/Seasons.js, career/Rivals.js): everyone a year older; the retired gone, the contracts run out,
    // next year's deals in force, the rookies up, the empty seats filled; the rivals' boards, money and people; your academy
    ageDrivers(this);
    for (const line of [...marketWinter(this), ...rivalsWinter(this, order), ...academyWinter(this)]) this.addNews(line);
    for (const t of Object.values(this.teams)) { t.points = 0; t.budget = r1(t.budget + TIER_BUDGET[t.tier] * 0.8); }
    this.round = 1; this.seasonDone = false; this.review = null;
    for (const t of Object.values(this.teams)) t.spendAt = +t.devSpend?.all || 0;   // (the cost cap: every team's spending counted afresh)
    // (the board's target: what the car and the drivers should do - and never more than a place below where the team
    //  finished last year, however the car looks this morning: a team cannot talk its own target down)
    { const last = newTeam ? null : this.history[this.history.length - 1]; this.board.target = Math.min(this.boardTarget(), last ? last.pos + 1 : 99); }
    for (const t of Object.values(this.teams)) if (t.name !== this.myTeam) this.aiDevelop(t);
    partsNewSeason(this); this.ensure(); crewNewSeason(this); this.fatigue = 0.15;   // (the winter: everyone rested)
    // (new regulations: every car a new one, the order drawn again - else the field a little closer than it was)
    if (rulesChange(this.season)) { for (const line of regsReset(this)) this.addNews(line); } else gapsWinter(this);
    for (const line of carNewSeason(this)) this.addNews(line);
    this.forecast = this.calendar.map(forecastFor); this.newObjective(); this.refreshHires();
    this.addNews(`Season ${this.season} begins. The board expects P${this.board.target}.`);
    storySeasonStart(this);
    this.save();
  }
}

/**
 * A car and driver's pace in seconds a lap against a perfect car and a 0.90 driver - the race model's own weights
 * (RaceDirector.simulateRest: 0.45 of the lap for the car's performance, 0.012 for the driver's rating, a 90 s lap):
 * the car counts about three times what the driver does across the grid
 */
export const paceOf = (e) => (e.perf - 1) * 40.5 + (e.rating - 0.9) * 1.08;
function newDriver(name, short, rating, number, helmet, from) {
  return { id: id(name), name, short, rating, number, helmet, from, team: null, salary: askOf(rating), until: null, points: 0, starts: 0, wins: 0, podiums: 0 };
}
function forecastFor(track) {
  const r = Math.random(), night = track === 'lasvegas' ? Math.random() < 0.85 : Math.random() < 0.15;
  return { weather: r < 0.6 ? 'dry' : r < 0.75 ? 'changeable' : r < 0.9 ? 'damp' : 'wet', time: night ? 'night' : 'day' };
}
/** where a team's cars should finish, from the car and the drivers against the field */
function expectedPos(c, team, best = false) {
  const E = c.entries().map((e) => ({ e, s: paceOf(e) })).sort((a, b) => b.s - a.s);
  const P = E.map((x, i) => (x.e.team === team ? i + 1 : null)).filter(Boolean);
  return P.length ? (best ? Math.min(...P) : P.reduce((a, b) => a + b, 0) / P.length) : 11;
}
function expectedPoints(c, team) {
  const E = c.entries().map((e) => ({ e, s: paceOf(e) })).sort((a, b) => b.s - a.s);
  return E.reduce((s, x, i) => s + (x.e.team === team ? (POINTS[i] || 0) * 0.85 : 0), 0);
}
