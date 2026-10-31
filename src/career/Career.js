// The championship career: you are a driver and the owner of your team. One profile (saved in the browser) holds the
// season - a calendar cycling the circuits, standings, history for the charts, money - every team's development (a
// tech tree of upgrades with levels, career/TechTree.js, paid for by what it earns on track), Paddock Rapport (your
// standing with every driver), and every driver in the paddock: the F1 grid, the reserves, F2 and a few juniors, each
// with a contract or free, a morale (career/Morale.js) and a superlicence (career/Licence.js). Around the racing sit
// your press desk (career/PR.js), your personal life (career/Celebs.js), your phone and your friends in the paddock
// (career/Social.js), the week between rounds (career/Agenda.js) and your own money (the wallet): the career holds
// them as plain JSON and turns the round over in the right order, and the engines do the rest. You choose your driver
// once: you race as them until they die - a death is final. An AI driver hurt in an accident misses the next round or
// two, and a driver who reaches twelve penalty points misses the next one: a stand-in in their seat either way.
import { ROSTER, RESERVES, F2, PERF_GAIN, dayPerf } from '../race/Roster.js';
import { BRANCHES, UP, startLevels, techEffects, upgradeState, develop, devTick, aiDevelop, migrateTeam, upgradeName, branchMaxed } from './TechTree.js';
import { moraleInit, moodOf, shiftMorale, moraleFromRace, moraleFromQuali, moraleRoundTick, moraleNewSeason, formOf, moraleSimBonus } from './Morale.js';
import { LICENCE_MAX, pointsFor, licenceInit, activePoints, isBanned, banText, addPoints, licenceRoundTick } from './Licence.js';
import { DEAL_SPLIT, prInit, prEnsure, prEvent, crisisFrom, postContext, prRoundTick, prSeasonEnd, sponsorMul, outletName } from './PR.js';
import { celebState, celebEnsure, celebRoundTick, partnerAtRace, grieve, resetForNewDriver } from './Celebs.js';
import { socialState, socialEnsure, socialResetForNewDriver, relateFriend, friendsRoundTick, inboxTick } from './Social.js';
import { weekRoundTick, raceDayCheck } from './Agenda.js';
import { partyEnsure, partyReset, snapAfterRace, partyTick, agentFor } from './Party.js';
import { normLook, blankLook } from './Avatar.js';

const KEY = 'f1sim-career-v2';
// (a save from before the v67 update, as it was stored, kept once when it is first brought up to date)
const BACKUP_KEY = 'f1sim-career-v2-backup';
/** the board's target for the constructors' championship, by the team's tier, and the prize money by where it ends ($M) */
export const BOARD_TARGET = [2, 4, 6, 9];
export const PRIZE = [14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
/** race day, drawn when the calendar is made (the forecast): Las Vegas is a night race, Silverstone a day one, mostly */
export function drawForecast(track) {
  const r = Math.random(), night = track === 'lasvegas' ? Math.random() < 0.85 : Math.random() < 0.15;
  return { weather: r < 0.62 ? 'dry' : r < 0.84 ? 'damp' : 'wet', time: night ? 'night' : 'day' };
}
/**
 * Trophies: the milestones of a career, each earned once (the round and season it came in kept). check(x): x is the
 * context after a race ({ me, row, mate, report, c }), a qualifying ({ qpos }), a season's end ({ season }), a
 * scuffle on the grid ({ brawl }: what the grid walk made of it) or the career alone ({}: a deal signed, a
 * relationship made public)
 */
export const TROPHIES = [
  ['start', 'Lights out', 'Start your first Grand Prix', (x) => x.row],
  ['points', 'On the board', 'Score your first points', (x) => x.row && !x.row.car.retired && x.row.pos <= 10],
  ['podium', 'Champagne', 'Finish on the podium', (x) => x.row && !x.row.car.retired && x.row.pos <= 3],
  ['win', 'Race winner', 'Win a Grand Prix', (x) => x.row && !x.row.car.retired && x.row.pos === 1],
  ['pole', 'Pole position', 'Qualify first', (x) => x.qpos === 1],
  ['fl', 'Purple', 'Set the fastest lap of a race', (x) => x.fastest],
  ['hat', 'Hat-trick', 'Pole, the win and the fastest lap in one weekend', (x) => x.row && x.row.pos === 1 && !x.row.car.retired && x.fastest && x.c._quali?.[x.c.playerId] === 1],
  ['charge', 'Through the field', 'Gain ten places in a race', (x) => x.row && !x.row.car.retired && (x.row.car.gridPos || 0) - x.row.pos >= 10],
  ['onetwo', 'One-two', 'You and your team-mate first and second', (x) => x.row && x.mateRow && !x.row.car.retired && !x.mateRow.car.retired && x.row.pos + x.mateRow.pos === 3],
  ['giant', 'Giant-killer', 'Beat both cars of a top team in a backmarker', (x) => x.row && !x.row.car.retired && x.c.team.tier >= 2 && x.rows.filter((r) => r.car.tier === 0).length >= 2 && x.rows.filter((r) => r.car.tier === 0).every((r) => r.car.retired || r.pos > x.row.pos)],
  ['perfect', 'Sponsor\'s favourite', 'Meet every objective of a round', (x) => x.report && x.report.objectives.length && x.report.objectives.every((o) => o.ok)],
  ['starts10', 'Ten starts', 'Start ten Grands Prix', (x) => x.me && x.me.starts >= 10],
  ['starts25', 'A regular', 'Start twenty-five Grands Prix', (x) => x.me && x.me.starts >= 25],
  ['wins5', 'Five-time winner', 'Win five Grands Prix', (x) => x.me && x.me.wins >= 5],
  ['branch', 'Fully developed', 'Complete a branch of the tech tree', (x) => x.c && x.c.team && Object.keys(BRANCHES).some((b) => branchMaxed(x.c.team, b))],
  ['board', 'The board is delighted', 'Beat the board\'s target for a season', (x) => x.season && x.season.teamPos < x.season.target],
  ['champ', 'World Champion', 'Win the drivers\' championship', (x) => x.season && x.season.youPos === 1],
  ['cons', 'Constructors\' Champions', 'Win the constructors\' championship', (x) => x.season && x.season.teamPos === 1],
  // (Montreal: the wall at the exit of the last chicane has caught world champions - Hill, Schumacher, Villeneuve in 1999)
  ['woc', 'Wall of Champions', 'Kiss the Wall of Champions in Montreal and still win the title that season', (x) => x.season && x.season.youPos === 1 && (x.c.wocSeasons || []).includes(x.season.season)],
  // (the life around the racing: a clean licence, the public, the papers, the grid walk, the sponsors)
  ['clean', 'Clean licence', 'A whole season without a penalty point', (x) => x.season && x.season.youPos && x.c.me && !(x.c.me.licence || []).some((e) => e.season === x.season.season) && x.c.me.ptsSeason !== x.season.season],
  ['darling', 'Fan favourite', 'Win the public over: an image of 60 or more', (x) => (x.c?.pr?.image ?? -100) >= 60],
  ['partner', 'Going public', 'Make a relationship public', (x) => !!x.c?.celebs?.partner],
  ['handbags', 'Handbags on the grid', 'Hold your own in a scuffle you didn\'t start', (x) => x.brawl && !x.brawl.started && x.brawl.result !== 'lost' && !x.brawl.walkedAway && !x.brawl.aborted],
  ['mogul', 'Brand ambassador', 'Hold three endorsement deals at once', (x) => (x.c?.pr?.deals?.length || 0) >= 3],
].map(([id, name, desc, check]) => ({ id, name, desc, check }));
// (a simulated weekend's pole lap, s: the real ones - Las Vegas 2024 1:32.3, Silverstone 2024 1:25.8, Montreal 2025 1:10.9)
const SIM_LAP = { lasvegas: 92.3, silverstone: 85.8, montreal: 70.9, austin: 92.5 };
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
/** a car's pace in a simulated session: its development as the physics sees it (Roster PERF_GAIN) on this circuit (how
 *  it suits the car: Roster dayPerf, without the weekend's form - the luck below is that) */
const carPace = (e, tid) => 1 + (e.perf + dayPerf(e.team, tid, () => 0.5) - 1) * PERF_GAIN;
const pick = (a) => a[(Math.random() * a.length) | 0];
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const TIER_BUDGET = [60, 50, 42, 36];     // $M to start a season with, by the team's tier
export const DISTANCES = [[3, '3 laps'], [5, '5 laps'], [8, '8 laps'], [13, '25 %'], [25, '50 %']];

// ---- the engines around the racing ----------------------------------------------------------------------------------
/** a call into one of the engines that must never stop a round turning over (an old save, a bug in a module) -> its result, or null */
const safe = (what, f) => { try { return f(); } catch (e) { console.warn(`Career: ${what} failed`, e); return null; } };
// (a retirement in an accident or off the road, against a car that broke: as the morale engine reads it)
const ACCIDENT = /accident|collision|crash|suspension damage|beached|stuck|gravel|stopped on track/i;
/** the stewards' penalty points a classification row carries -> [{ pts, reason }] (the race's log, else a bare total) */
const ppOf = (r) => {
  const L = Array.isArray(r?.car?.ppLog) && r.car.ppLog.length ? r.car.ppLog : Array.isArray(r?.ppLog) ? r.ppLog : [];
  const out = L.map((e) => ({ ...e, pts: Math.round(+e?.pts || 0), reason: String(e?.reason || 'a driving offence') })).filter((e) => e.pts > 0);
  if (L.length) return out;
  const n = Math.round(+(r?.car?.penPts ?? r?.penPts) || 0);
  return n > 0 ? [{ pts: n, reason: 'a driving offence' }] : [];
};
/** what reached a factory or a car this round, as the news puts it (devTick's completions: { id, level, q, re, was, early }) */
const devNews = (x) => {
  const nm = upgradeName(x.id, x.level) || x.id, pc = (q) => Math.round((+q || 1) * 100), early = x.early ? ', a race early' : '';
  if (x.re) return `${nm} re-tuned: now correlated ${pc(x.q)}% (was ${pc(x.was)}%).`;
  if (UP[x.id]?.branch === 'facilities') return `New at the factory: ${nm}${early}.`;
  return `New on the car: ${nm} (correlated ${pc(x.q)}%${early}).`;
};
/**
 * Still learning: the F1 grid's newcomers of the last two seasons (a career's starts count from its first race, so
 * they can't tell a rookie from a veteran), and anyone from F2, the reserves or the juniors, for their first 60 starts.
 */
const NEWCOMERS = new Set(['Kimi Antonelli', 'Gabriel Bortoleto', 'Isack Hadjar', 'Oliver Bearman', 'Liam Lawson', 'Franco Colapinto', 'Arvid Lindblad']);
export const isYoung = (d) => (d.from !== 'F1' && d.starts < 60) || (NEWCOMERS.has(d.name) && d.starts < 40);
/** what a driver asks for a season ($M) */
export const askOf = (d) => Math.max(0.5, Math.round((d.rating - 0.72) * 40 * 2) / 2);

// ---- Paddock Rapport ---------------------------------------------------------------------------------------------------
export const RAPPORT_NAME = 'Paddock Rapport';
export function rapportLabel(v) { return v <= -60 ? 'Bitter rival' : v <= -25 ? 'Hostile' : v < -8 ? 'Cold' : v < 10 ? 'Neutral' : v < 35 ? 'Friendly' : v < 65 ? 'Respected' : 'Close ally'; }

const JUNIORS = [['Tomás Rivera', 'RIV', 0.76, 52, '#ff7a00'], ['Kenji Morita', 'MOR', 0.75, 64, '#e10600'], ['Elias Brandt', 'BRA', 0.77, 58, '#ffffff'],
  ['Noah Lindqvist', 'LIQ', 0.74, 71, '#00a3e0'], ['Rafael Costa', 'COS', 0.76, 48, '#22c55e'], ['Ivan Petrov', 'PET', 0.73, 93, '#ffd400']];
const id = (name) => name.toLowerCase().replace(/[^a-z]/g, '-');
const newDriver = (r, extra) => ({ id: id(r[0] ?? r.name), name: r[0] ?? r.name, short: r[1] ?? r.short, rating: r[2] ?? r.rating, number: r[3] ?? r.number, helmet: r[4] ?? r.helmet, starts: 0, points: 0, wins: 0, podiums: 0, alive: true, ...extra });

export class Career {
  constructor(data) { Object.assign(this, data); }

  // ---- making one --------------------------------------------------------------------------------------------------
  /**
   * o: { driver: a ROSTER index (you become them, and own their team) | 'custom', custom: { name, teamName, color,
   * color2, look (your own look: career/Avatar.js - kept on your driver's record) }, rounds, laps, diff, tracks:
   * [circuit ids], firstTrack }
   */
  static create(o) {
    const teams = {}, drivers = {};
    for (const r of ROSTER) {
      if (!teams[r.team]) teams[r.team] = { name: r.team, color: r.color, color2: r.color2, tier: r.tier, budget: TIER_BUDGET[r.tier], levels: startLevels(r.tier), quality: {}, dev: [], seats: [], points: 0, garage: Object.keys(teams).length };
      drivers[id(r.name)] = newDriver([r.name, r.short, r.rating, r.number, r.helmet], { from: 'F1', team: r.team, contract: { salary: askOf(r), until: 2027 + (r.rating > 0.9 ? 1 : 0) } });
      teams[r.team].seats.push(id(r.name));
    }
    for (const [team, r] of Object.entries(RESERVES)) drivers[id(r[0])] = newDriver(r, { from: r[5] === 'F2' ? 'F2' : 'Reserve', team: null, reserveOf: team, contract: null });
    for (const r of [...F2, ...JUNIORS]) if (!drivers[id(r[0])]) drivers[id(r[0])] = newDriver(r, { from: JUNIORS.includes(r) ? 'Junior' : 'F2', team: null, contract: null });
    let playerId;
    if (o.driver === 'custom') {
      const c = o.custom || {}, tn = (c.teamName || 'Independent').slice(0, 22);
      teams[tn] = { name: tn, color: c.color || '#00d4ff', color2: c.color2 || '#ffffff', livery: c.livery || null, tier: 3, budget: TIER_BUDGET[3], levels: startLevels(3), quality: {}, dev: [], seats: [], points: 0, garage: 'own', own: true };
      playerId = 'you-' + id(c.name || 'driver');
      // (your look on your own record - the game's own pick where you chose nothing; the helmet's base colour as the plain one)
      const look = normLook(c.look) || blankLook();
      drivers[playerId] = newDriver([c.name || 'Custom Driver', (c.name || 'YOU').replace(/[^A-Za-z]/g, '').slice(-3).toUpperCase().padEnd(3, 'X'), 0.88, 99, look.helmet?.c?.[0] || c.color2 || '#ffffff'], { id: playerId, from: 'Custom', team: tn, contract: { salary: 0, until: 2099 }, look });   // (its id is its key: 'you-...', not the name's)
      teams[tn].seats.push(playerId);
      const mate = Object.values(drivers).filter((d) => !d.team && d.alive).sort((a, b) => b.rating - a.rating)[0];
      if (mate) { mate.team = tn; mate.contract = { salary: askOf(mate), until: 2027 }; teams[tn].seats.push(mate.id); }
    } else playerId = id(ROSTER[+o.driver].name);
    const me = drivers[playerId], myTeam = teams[me.team]; myTeam.own = true;
    const tracks = o.tracks || ['silverstone', 'lasvegas'], first = Math.max(0, tracks.indexOf(o.firstTrack));
    const calendar = Array.from({ length: o.rounds || 6 }, (_, i) => tracks[(first + i) % tracks.length]);
    const rapport = Object.fromEntries(Object.keys(drivers).filter((k) => k !== playerId).map((k) => [k, 0]));
    const c = new Career({ v: 4, season: 2026, round: 1, rounds: calendar.length, calendar, laps: o.laps || 5, diff: o.diff ?? 75, teams, drivers, playerId, myTeam: myTeam.name, rapport,
      news: [{ round: 0, text: `${me.name} takes charge of ${myTeam.name}: driver and owner.` }], lost: [], log: [], history: [],
      forecast: calendar.map(drawForecast), trophies: [], seasons: [], h2h: { mate: null, q: [0, 0], r: [0, 0] }, wallet: 3, week: null, slump: 0 });
    // (the life around the racing: every driver's morale and licence, then your press desk, your personal life and your phone)
    for (const d of Object.values(drivers)) { moraleInit(d, d.id === playerId); licenceInit(d); }
    c.pr = safe('prInit', () => prInit(c)); if (!c.pr) delete c.pr;
    c.celebs = celebState(); c.social = socialState();
    c.snapshot(); c.objectivesFor(); return c;
  }

  // ---- saving ------------------------------------------------------------------------------------------------------
  static load() { try { const s = localStorage.getItem(KEY); return s ? new Career(JSON.parse(s)).upgrade(s) : null; } catch (e) { return null; } }
  save() { try { localStorage.setItem(KEY, JSON.stringify({ ...this })); } catch (e) { /* (a private window: the career lasts the session) */ } }
  static erase() { try { localStorage.removeItem(KEY); } catch (e) { /* nothing saved */ } }

  // ---- reading -----------------------------------------------------------------------------------------------------
  get me() { return this.drivers[this.playerId]; }
  get team() { return this.teams[this.myTeam]; }
  get needsDriver() { return !this.me || !this.me.alive || this.me.team !== this.myTeam; }
  get seasonOver() { return this.round > this.rounds; }
  seatsOf(team) { return this.teams[team].seats.map((i) => this.drivers[i]).filter((d) => d && d.alive); }
  freeAgents() { return Object.values(this.drivers).filter((d) => d.alive && !d.team); }
  driverStandings() { return Object.values(this.drivers).filter((d) => d.points > 0 || (d.team && d.alive)).sort((a, b) => b.points - a.points || b.wins - a.wins); }
  teamStandings() { return Object.values(this.teams).sort((a, b) => b.points - a.points); }
  teammate() { return this.seatsOf(this.myTeam).find((d) => d.id !== this.playerId) || null; }
  addNews(text) { this.news.unshift({ round: this.round, text }); this.news.length = Math.min(this.news.length, 80); }
  /** a name already in the paddock (the grid, the reserves, F2, the juniors - case and spacing aside): a new driver can't take it */
  static nameTaken(name) {
    const k = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase(), n = k(name); if (!n) return false;
    return [...ROSTER.map((r) => r.name), ...Object.values(RESERVES).map((r) => r[0]), ...F2.map((r) => r[0]), ...JUNIORS.map((r) => r[0])].some((x) => k(x) === n);
  }
  /** your own look changed (career/Avatar.js; only a driver you made yourself has one) -> whether it was taken */
  setLook(look) {
    const me = this.me, L = normLook(look); if (!me || me.from !== 'Custom' || !L) return false;
    me.look = L; me.helmet = L.helmet?.c?.[0] || me.helmet; return true;
  }
  /** why a driver misses this round -> 'injury' (hurt in an accident) | 'ban' (twelve penalty points) | null */
  outWhy(d) { return !d ? null : d.outUntil != null && d.outUntil >= this.round ? 'injury' : isBanned(this, d) ? 'ban' : null; }
  /** a driver who misses this round, hurt or banned (a stand-in takes the seat) */
  isOut(d) { return !!this.outWhy(d); }
  /**
   * a life lost this round - its memorial weekend: a grave round, as the press desk and the week read it too (by rounds
   * ago, as they count it: a loss in a season's last race is stamped past its end, the memorial is round 1 of the next)
   */
  _lostNow() { const R = this.rounds || 6; return (this.lost || []).some((l) => l && l.season != null && l.round != null && (this.season - l.season) * R + (this.round - l.round) === 0); }
  /**
   * older saves: the newer parts of a career, filled in (raw: the save as it was stored). Never throws: a part that
   * cannot be brought up to date is left as it was, with a warning, and the rest still are.
   */
  upgrade(raw = null) {
    // (the first time a save from before the life around the racing loads: a copy of it as it was, in case)
    if (!(this.v >= 3)) { try { localStorage.setItem(BACKUP_KEY, raw || JSON.stringify({ ...this })); } catch (e) { /* (a private window or a full storage: no copy) */ } }
    // (the tech tree with levels, every driver's morale and licence, the press desk, the personal life, the phone, your own money, the week)
    for (const t of Object.values(this.teams || {})) safe('migrating a team', () => migrateTeam(t));
    for (const d of Object.values(this.drivers || {})) safe('a driver\'s record', () => { moraleInit(d, d.id === this.playerId); licenceInit(d); });
    safe('prEnsure', () => prEnsure(this)); safe('celebEnsure', () => celebEnsure(this)); safe('socialEnsure', () => socialEnsure(this)); safe('partyEnsure', () => partyEnsure(this));
    if (!(typeof this.wallet === 'number' && isFinite(this.wallet))) this.wallet = 3;
    if (!this.week || typeof this.week !== 'object' || Array.isArray(this.week)) this.week = null;
    if (!(typeof this.slump === 'number' && isFinite(this.slump))) this.slump = 0;
    // (v4: your own look on a custom driver's record - one saved without it gets the empty look: every choice the game's
    // own pick, so he looks just as he always did; any look cleaned, every load)
    safe('looks', () => { for (const d of Object.values(this.drivers || {})) { if (d && d.look != null) d.look = normLook(d.look) || blankLook(); else if (d && d.from === 'Custom') d.look = blankLook(); } });
    this.v = 4;
    try {
      this.forecast = this.forecast || this.calendar.map(drawForecast); this.trophies = this.trophies || []; this.seasons = this.seasons || [];
      this.h2h = this.h2h || { mate: null, q: [0, 0], r: [0, 0] };
      if (!this.seasonOver && !this.objectives) this.objectivesFor();
      // (repairs: your driver alive and in your team must have a seat in it, and is never out injured)
      // (a custom driver saved before the fix: its id was its name's, not its key - so it was never the player's car)
      if (this.me && this.me.id !== this.playerId) this.me.id = this.playerId;
      const me = this.me;
      if (me && me.alive && me.team === this.myTeam) { const t = this.team; if (t && !t.seats.includes(me.id)) t.seats.unshift(me.id); }
    } catch (e) { console.warn('Career: repairing an older save', e); }
    return this;
  }
  /** race day at round n (1-based): { weather, time } */
  forecastAt(n = this.round) { return this.forecast?.[n - 1] || { weather: 'dry', time: this.calendar[n - 1] === 'lasvegas' ? 'night' : 'day' }; }
  /** where a driver can expect to finish on pace alone: the car's development and the driver's rating, against the field */
  expectedPos(did) {
    const score = (e) => e.perf + e.rating * 0.02, es = this.entries(), me = es.find((e) => e.careerId === did);
    return me ? es.filter((e) => score(e) > score(me)).length + 1 : null;
  }
  earned(id) { return this.trophies.find((x) => x.id === id); }
  /** trophies newly earned in this context -> their names (added to the cabinet and the news) */
  award(x) {
    const out = [];
    for (const T of TROPHIES) {
      if (this.earned(T.id)) continue;
      let ok = false; try { ok = !!T.check({ c: this, ...x }); } catch (e) { ok = false; }
      if (ok) { this.trophies.push({ id: T.id, season: this.season, round: x.season ? null : this.round }); out.push(T.name); this.addNews(`Trophy: ${T.name} - ${T.desc.toLowerCase()}.`); }
    }
    return out;
  }

  // ---- sponsor objectives ------------------------------------------------------------------------------------------
  /**
   * The sponsors' targets for this round, set against what the car and the driver can expect (the first is always a
   * finishing position): met, each pays out after the race. -> this.objectives
   */
  objectivesFor() {
    const me = this.me; if (!me || !me.alive || this.seasonOver) { this.objectives = []; return this.objectives; }
    const exp = this.expectedPos(this.playerId) || this.expectedPos(this.entries().find((e) => e.isPlayer)?.careerId) || 12, tgt = Math.max(1, Math.min(18, exp)), mate = this.teammate();
    const money = (v) => Math.round(v * 2) / 2;
    const first = { id: 'finish', pos: tgt, text: tgt === 1 ? 'Win the race' : `Finish P${tgt} or better`, reward: money(1.5 + (21 - tgt) * 0.12) };
    const pool = [
      mate && { id: 'mate', text: `Finish ahead of ${mate.name.split(' ').pop()}`, reward: 2 },
      exp > 3 && { id: 'gain', text: 'Gain three places from your grid slot', reward: 2.5 },
      { id: 'quali', pos: Math.max(1, tgt - 2), text: tgt <= 3 ? 'Take pole position' : `Qualify P${tgt - 2} or better`, reward: tgt <= 3 ? 3 : 2 },
      exp > 9 && { id: 'points', text: 'Score points', reward: 3 },
      { id: 'clean', text: 'A clean race: no contact with another car', reward: 1.5 },
    ].filter(Boolean).sort(() => Math.random() - 0.5);
    this.objectives = [first, ...pool.slice(0, 2)];
    return this.objectives;
  }

  // ---- qualifying ----------------------------------------------------------------------------------------------------
  /** the qualifying order (career ids, fastest first): poles, the head-to-head, morale, your pole for the press, the qualifying objective -> trophies */
  recordQuali(ids) {
    this._quali = {}; ids.forEach((id, i) => { if (id) this._quali[id] = i + 1; });
    const pole = this.drivers[ids[0]]; if (pole) pole.poles = (pole.poles || 0) + 1;
    const mate = this.teammate(), q = this._quali;
    if (mate && q[this.playerId] && q[mate.id]) { if (this.h2h.mate !== mate.id) this.h2h = { mate: mate.id, q: [0, 0], r: [0, 0] }; this.h2h.q[q[this.playerId] < q[mate.id] ? 0 : 1]++; }
    // (a pole is a shot of confidence, being out-qualified by the team-mate stings; your own pole is a story - never on a memorial weekend)
    safe('moraleFromQuali', () => moraleFromQuali(this, ids));
    if (ids[0] && ids[0] === this.playerId && !this._lostNow()) safe('PR pole', () => prEvent(this, 'pole', { track: this.calendar[this.round - 1] }));
    const out = this.award({ qpos: q[this.playerId] }); this.save(); return out;
  }

  // ---- a weekend simulated from the hub (no circuit loaded): qualifying, the race, or both ----------------------------
  /**
   * Qualifying, simulated: every car's lap from its car (development) and its driver (rating, and how they feel about
   * it: morale), a little luck on the day, more of it in the wet. -> the grid, kept (savedGrid) as a qualifying driven
   * would keep it
   */
  simQuali() {
    const tid = this.calendar[this.round - 1], wet = this.forecastAt().weather, base = SIM_LAP[tid] || 90, es = this.entries();
    const sc = (e) => carPace(e, tid) + (e.rating + moraleSimBonus(e.morale)) * 0.02, best = Math.max(...es.map(sc)), luck = wet === 'wet' ? 0.004 : wet === 'damp' ? 0.0028 : 0.0015;
    const laps = es.map((e) => ({ e, t: base * (wet === 'wet' ? 1.12 : wet === 'damp' ? 1.05 : 1) * (1 + (best - sc(e)) * 1.4 + gauss() * luck + (Math.random() < 0.03 ? 0.01 + Math.random() * 0.02 : 0)) }));   // (now and then a lap spoiled: traffic, a mistake, a red flag)
    laps.sort((a, b) => a.t - b.t);
    const ids = laps.map((x) => x.e.careerId);
    this.recordQuali(ids);
    this.savedGrid = { season: this.season, round: this.round, ids, times: laps.map((x) => +x.t.toFixed(3)), sim: true };
    const pole = laps[0].e, mine = laps.findIndex((x) => x.e.isPlayer);
    this.addNews(`Qualifying (simulated): ${pole.name} on pole${mine >= 0 ? `, you start P${mine + 1}` : ''}.`);
    this.save();
    return this.savedGrid;
  }
  /**
   * The race, simulated from the grid: the pace of each car and driver (morale included) over the distance, the start
   * and the traffic from where it lines up, retirements (the car's reliability, accidents, more of them in the rain), the
   * stewards now and then (5 s and points on the licence); an accident may put a driver out of the next round or two.
   * Then the round is scored as a race driven would be (applyRace).
   */
  simRace() {
    // (race day: arriving running on empty costs focus for this race - Agenda.raceDayCheck, once a round)
    safe('raceDayCheck', () => raceDayCheck(this));
    if (!this.savedGrid || this.savedGrid.round !== this.round || this.savedGrid.season !== this.season) this.simQuali();
    const tid = this.calendar[this.round - 1], wet = this.forecastAt().weather, base = SIM_LAP[tid] || 90, laps = this.laps || 10;
    const es = this.entries(), by = Object.fromEntries(es.map((e) => [e.careerId, e])), grid = this.savedGrid.ids.filter((id) => by[id]);
    for (const e of es) if (!grid.includes(e.careerId)) grid.push(e.careerId);
    const sc = (e) => carPace(e, tid) + (e.rating + moraleSimBonus(e.morale)) * 0.02, best = Math.max(...es.map(sc)), rain = wet === 'wet' ? 2.2 : wet === 'damp' ? 1.5 : 1;
    const rows = grid.map((id, gi) => {
      const e = by[id], lap = base * 1.035 * (wet === 'wet' ? 1.12 : wet === 'damp' ? 1.05 : 1) * (1 + (best - sc(e)) * 1.4);
      // (the start and the traffic: a place on the grid is worth a little over the distance; the pace varies lap to lap)
      const total = lap * laps * (1 + gauss() * 0.0025 * rain) + gi * 0.35 + (laps >= 13 ? 22 : 0);   // (a stop over a longer race)
      const rel = (e.fx?.relMul || 1), pFail = 0.035 * rel * (laps / 20), pCrash = 0.02 * rain * (laps / 20) * (1.4 - e.rating * 0.5);
      const fail = Math.random() < pFail, crash = !fail && Math.random() < pCrash, out = fail || crash, at = out ? 0.1 + Math.random() * 0.85 : 1;
      // (the stewards: now and then a finisher is penalised - 5 s on the time and points on the licence)
      const q = Math.random(), pen = out ? null : q < 0.06 ? 'causing a collision' : q < 0.1 ? 'leaving the track and gaining an advantage' : null;
      return { e, total: total + (pen ? 5 : 0), out, crash, fail, at, best: lap * (0.985 + Math.random() * 0.01), gi, pen };
    });
    const fin = rows.filter((r) => !r.out).sort((a, b) => a.total - b.total), dnf = rows.filter((r) => r.out).sort((a, b) => b.at - a.at);
    const order = [...fin, ...dnf];
    // (anyone hurt is known before the round is scored: the round is a grave one, and they are hurt in its classification)
    const hurt = dnf.filter((r) => r.crash && Math.random() < 0.1);
    const out = order.map((r, i) => ({ pos: i + 1, name: r.e.name, car: { careerId: r.e.careerId, name: r.e.name, team: r.e.team, isPlayer: r.e.isPlayer, retired: r.out, finished: !r.out, bestLap: r.best, gridPos: r.gi + 1, lap: Math.round(r.at * laps), retireReason: r.crash ? 'Accident' : r.fail ? 'Mechanical' : null,
      injured: hurt.includes(r), penalties: r.pen ? 5 : 0, penaltyCount: r.pen ? 1 : 0, penPts: r.pen ? pointsFor(r.pen, 5) : 0, ppLog: r.pen ? [{ pts: pointsFor(r.pen, 5), reason: r.pen }] : [] } }));
    for (const r of dnf) this.addNews(`${r.e.name} (${r.e.team}) out of the race (simulated): ${r.crash ? 'an accident' : pick(['a power-unit failure', 'a hydraulics problem', 'gearbox trouble', 'a brake failure'])} on lap ${Math.max(1, Math.round(r.at * laps))}.`);
    const where = tid === 'lasvegas' ? 'Las Vegas' : 'Silverstone';
    // (the round is scored first - the round moves on - then anyone hurt misses the next one or two)
    this.applyRace(out, tid, [], null, { grave: hurt.length > 0, hurtIds: hurt.map((r) => r.e.careerId) });
    for (const r of hurt) this.injure(r.e.careerId, Math.random() < 0.7 ? 1 : 2, where);
    if (hurt.length) this.save();
    return out;
  }
  /** the whole weekend simulated: qualifying, then the race */
  simWeekend() { this.simQuali(); return this.simRace(); }

  // ---- the grid for a race: every team's seats (a stand-in for anyone out), each car as its team has developed it ----
  /**
   * -> [{ careerId, name, short, team, color, color2, helmet, tier, perf, rating, number, fx, garage, isPlayer,
   * standInFor, outWhy ('injury' | 'ban' | null: why the seat-holder is out), morale (moodOf), form (FORM, for the race
   * code), licence (penalty points on it) }] - the driver actually racing: a stand-in is its own record
   */
  entries() {
    const out = [], taken = new Set();
    for (const t of Object.values(this.teams)) {
      const fx = techEffects(t);
      for (const d0 of this.seatsOf(t.name)) {
        let d = d0, standInFor = null;
        const outWhy = this.outWhy(d0);
        if (outWhy) {   // (hurt or banned - you too: a stand-in races, and if it is your driver's seat, you drive it as them)
          // (the team's reserve if free, else the best free driver not already standing in)
          const pool = this.freeAgents().filter((x) => !taken.has(x.id) && !this.isOut(x));
          d = pool.find((x) => x.reserveOf === t.name) || pool.sort((a, b) => b.rating - a.rating)[0];
          if (!d) continue;
          taken.add(d.id); standInFor = d0.name;
        }
        const m = moodOf(d);
        out.push({ careerId: d.id, name: d.name, short: d.short, team: t.name, color: t.color, color2: t.color2, livery: t.livery || null, helmet: d.helmet, tier: t.tier, perf: fx.perf, rating: d.rating, number: d.number, fx, garage: t.garage, isPlayer: d.id === this.playerId || (!!standInFor && d0.id === this.playerId), standInFor,
          outWhy, morale: m, form: formOf(m), licence: activePoints(this, d) });
      }
    }
    return out;
  }

  // ---- development (career/TechTree.js: every upgrade's levels, the factory's queue, the AI teams' choices) ------------
  /** an upgrade for a team -> 'max' | 'dev' | 'locked' | 'busy' | 'poor' | 'open' */
  upgradeState(team, uid) { return upgradeState(this, team, uid); }
  /** start the next level of an upgrade for a team: paid now, in the factory for its rounds (news for your own) -> done? */
  develop(team, uid) { return develop(this, team, uid); }

  // ---- Paddock Rapport ---------------------------------------------------------------------------------------------
  rapportOf(did) { return this.rapport[did] ?? 0; }
  /** change your standing with driver did by delta (-100 .. 100); why goes to the news when it is a big swing */
  relate(did, delta, why) {
    if (!did || did === this.playerId || !this.drivers[did]) return 0;
    const v0 = this.rapport[did] ?? 0, v = Math.max(-100, Math.min(100, Math.round(v0 + delta)));
    this.rapport[did] = v;
    if (why && Math.abs(delta) >= 12) this.addNews(`${this.drivers[did].name}: ${why} (${RAPPORT_NAME} ${delta > 0 ? '+' : ''}${Math.round(delta)}).`);
    return v - v0;
  }

  // ---- the life around the racing: doors into the engines for callers that hold only the career ---------------------
  /** a story for the press desk (career/PR.js prEvent: kinds and data there) -> { headlines, d } */
  prEvent(kind, data = {}) { return safe(`PR ${kind}`, () => prEvent(this, kind, data)) || { headlines: [], d: { image: 0, fame: 0, heat: 0, appeal: 0 } }; }
  /**
   * penalty points on a driver's licence (career/Licence.js addPoints: the offence why, where - a circuit's id or
   * name, banRound - the race a ban would fall on; o.grave: no press) -> { total, banned }
   */
  addPoints(did, pts, why, where = '', banRound = this.round + 1, o = {}) {
    const r = safe('addPoints', () => addPoints(this, did, pts, why, where, banRound, o)) || { total: 0, banned: false };
    // (the season a driver last took points: the clean-licence trophy's memory, whatever a served ban later removes)
    const d = this.drivers[did]; if (d && Math.round(+pts || 0) > 0 && !r.skipped) d.ptsSeason = this.season;
    return r;
  }
  /** a driver's morale (stat null) or one of its four traits moved (career/Morale.js shiftMorale) -> the change applied */
  shiftMorale(did, delta, why = '', stat = null) { return safe('shiftMorale', () => shiftMorale(this, did, delta, why, stat)) || 0; }
  /** your friendship with a driver moved (career/Social.js relateFriend: rapport follows at half the size) -> the change */
  relateFriend(did, delta, why = '') { return safe('relateFriend', () => relateFriend(this, did, delta, why)) || 0; }

  // ---- the market: offers, buyouts, signing ------------------------------------------------------------------------
  // ---- negotiation at the table (ui/Negotiation.js) -------------------------------------------------------------
  /**
   * What a driver wants from a deal, fixed for the round you talk in: the salary they hope for (ask) and the floor
   * they will not go under, what matters to them (weights: money, status, security, ambition - the last is the car,
   * which an offer can't change, but a sign-on fee softens), the years they prefer, the status they expect, how many
   * poor offers they will sit through (patience), and for a star, perhaps a rival offer on the table.
   */
  negoProfile(d) {
    const rk = `${this.season}|${this.round}`; if (!this._nego || this._negoRound !== rk) { this._nego = {}; this._negoRound = rk; }   // (one round's talks at a time)
    const k = d.id; if (this._nego[k]) return this._nego[k];
    const r = this.rapportOf(d.id), t = this.team, star = d.rating >= 0.9, young = isYoung(d), mine = d.team === t.name;
    // (their agent, met at a party this season (career/Party.js c.party.met): a little warmer at the table - ask x0.97, patience +1)
    const ag = safe('agentFor', () => agentFor(d.id)), met = !!ag && this.party?.met?.[ag.id]?.season === this.season;
    const ask = Math.round(askOf(d) * (d.team && !mine ? 1.15 : 1) * (1 - r / 400) * (mine ? 0.95 : 1) * (met ? 0.97 : 1) * 2) / 2;
    const w = star ? { money: 0.3, status: 0.3, security: 0.15, ambition: 0.25 } : young ? { money: 0.2, status: 0.1, security: 0.25, ambition: 0.45 } : { money: 0.35, status: 0.15, security: 0.3, ambition: 0.2 };
    const tops = Object.values(this.teams).filter((x) => x.tier <= 1 && x.name !== t.name && !x.own);
    const rival = star && tops.length && Math.random() < 0.6 ? { team: tops[(Math.random() * tops.length) | 0].name, salary: Math.round(ask * (1.05 + Math.random() * 0.12) * 2) / 2 } : null;
    const P = { ask, floor: Math.round(ask * (star ? 0.86 : 0.74) * 2) / 2, w, years: star ? 2 : young ? 2 : 3, role: star ? 'lead' : 'equal', patience: Math.max(1, 3 + (r > 20 ? 1 : 0) - (r < -25 ? 1 : 0) + (met ? 1 : 0)), rival, star, young, agent: ag ? ag.name : null, agentMet: met };
    this._nego[k] = P; return P;
  }
  /** how good an offer looks to them: u (0..~1.2; they sign around 0.8), each term's part, the gap most in the way */
  evaluate(d, o) {
    const P = this.negoProfile(d), t = this.team;
    const wins = [2, 0.8, 0.2, 0.05][t.tier] ?? 0.1, pay = o.salary + (o.signOn || 0) / Math.max(1, o.years) + (o.winBonus || 0) * wins;
    const money = Math.max(0, Math.min(1.35, (pay / P.ask) ** 1.4));
    const status = { lead: 1, equal: P.role === 'lead' ? 0.45 : 0.85, support: P.role === 'lead' ? 0.05 : 0.35 }[o.role || 'equal'];
    const security = Math.max(0, 1 - 0.32 * Math.abs(o.years - P.years));
    const ambition = Math.min(1.1, [0.95, 0.75, 0.5, 0.32][t.tier] + Math.min(0.2, t.points / 250) + Math.min(0.35, (o.signOn || 0) / Math.max(4, P.ask * 2.2)));
    const parts = { money, status, security, ambition };
    let u = 0; for (const k in parts) u += P.w[k] * parts[k];
    u += this.rapportOf(d.id) / 500;
    if (P.rival && o.salary < P.rival.salary * 0.95) u -= 0.08;   // (they have something better in their pocket)
    const gap = Object.keys(parts).filter((k) => k !== 'ambition' || (o.signOn || 0) < P.ask * 1.5).sort((a, b) => P.w[b] * (1 - parts[b]) - P.w[a] * (1 - parts[a]))[0];
    return { u: Math.round(u * 1000) / 1000, parts, gap, floorOk: o.salary >= P.floor };
  }
  /**
   * Their answer to an offer: { result: 'accept' | 'counter' | 'reject' | 'walk', focus (what it is about), want (the
   * term they ask for), patience left }. A poor offer costs patience (an insulting one, two); at none they walk out and
   * won't talk again this round.
   */
  respond(d, o) {
    const P = this.negoProfile(d), E = this.evaluate(d, o);
    if (this.rapportOf(d.id) <= -60) { d.refused = this.round; return { result: 'walk', focus: 'rapport', E }; }
    if (E.floorOk && E.u >= 0.8) return { result: 'accept', E };
    const insult = o.salary < P.floor * 0.7 || E.u < 0.45;
    P.patience -= insult ? 2 : E.u < 0.62 ? 1 : 0.5;
    if (P.patience <= 0) { d.refused = this.round; return { result: 'walk', focus: insult ? 'insult' : E.gap, E }; }
    const focus = !E.floorOk ? 'money' : E.gap;
    const want = focus === 'money' ? { salary: Math.max(P.floor, Math.round(Math.min(P.ask * 1.15, Math.max(o.salary * 1.08, P.ask * (1.02 - 0.15 * (E.u - 0.6)))) * 2) / 2) }
      : focus === 'status' ? { role: P.role } : focus === 'security' ? { years: P.years } : { signOn: Math.round(P.ask * 0.8 * 2) / 2 };
    return { result: insult ? 'reject' : 'counter', focus, want, insult, E, patience: P.patience };
  }

  buyout(d) { return d.team && d.team !== this.myTeam && d.contract ? Math.round(d.contract.salary * Math.max(1, d.contract.until - this.season) * 0.6 * 2) / 2 : 0; }
  sign(team, driverId, salary, years, seat = null, terms = {}) {
    const t = this.teams[team], d = this.drivers[driverId]; if (!t || !d || !d.alive) return false;
    const fee = team === this.myTeam ? this.buyout(d) : 0;
    if (terms.signOn) t.budget = Math.round((t.budget - terms.signOn) * 10) / 10;
    if (fee) { t.budget -= fee; const from = this.teams[d.team]; if (from) from.budget += fee; }
    if (d.team) { const from = this.teams[d.team]; from.seats = from.seats.filter((x) => x !== d.id); }
    const alive = t.seats.filter((x) => this.drivers[x]?.alive);
    if (alive.length >= 2) {
      const out = seat != null ? alive[seat] : alive[alive.length - 1];
      if (out && out !== this.playerId) { const o = this.drivers[out]; o.team = null; o.contract = null; t.seats = t.seats.filter((x) => x !== out); this.addNews(`${o.name} released by ${t.name}.`); if (t.own) this.relate(out, -20, 'released by you'); }
    }
    t.seats = t.seats.filter((x) => this.drivers[x]?.alive); t.seats.push(d.id);
    d.team = team; d.contract = { salary, until: (this.seasonOver ? this.season + 1 : this.season) + years - 1, role: terms.role || 'equal', winBonus: terms.winBonus || 0 }; delete d.refused;   // (signed after the season's end: from next season)
    if (t.own) this.relate(d.id, 10);
    this.addNews(`${d.name} signs for ${t.name}: ${years} season${years > 1 ? 's' : ''}, $${salary}M a year${terms.role === 'lead' ? ', number-one status' : terms.role === 'support' ? ' as the number two' : ''}${terms.signOn ? `, a $${terms.signOn}M sign-on fee` : ''}${terms.winBonus ? `, $${terms.winBonus}M a win` : ''}${fee ? ` ($${fee}M buyout)` : ''}.`);
    return true;
  }
  /**
   * You race as another of your team's drivers from now on. The press desk starts again for them (the old deals end
   * quietly, nothing is left waiting for an answer) and so does the week; your own money stays yours. After a death the
   * people close to your old driver are left in peace and the paddock sends its quiet words (lose); a switch of your
   * own choosing is a fresh start away from the track too. -> done?
   */
  becomeDriver(driverId) {
    const d = this.drivers[driverId]; if (!d || !d.alive || d.team !== this.myTeam) return false;
    const prev = this.me, fresh = !prev || prev.id !== driverId, died = !!prev && prev.alive === false;
    // (a death from before the life around the racing was kept: its quiet steps now, in your old driver's name)
    if (fresh && died && !prev.griefDone) this._grief(prev);
    this.playerId = driverId; delete this.rapport[driverId];
    if (fresh) {
      safe('prInit', () => { this.pr = prInit(this); });
      this.week = null; this.slump = 0; safe('partyReset', () => partyReset(this));
      if (!died) { safe('resetForNewDriver', () => resetForNewDriver(this)); safe('socialResetForNewDriver', () => socialResetForNewDriver(this, false)); }
      // (nobody is their own friend: your new driver out of your phone)
      const S = this.social; if (S?.friends) delete S.friends[driverId]; if (S?.phone?.threads) delete S.phone.threads[`d:${driverId}`];
      safe('moraleInit', () => moraleInit(d, true));
    }
    this.addNews(`You will race as ${d.name}.`); this.objectivesFor(); return true;
  }

  // ---- a race done: points, money, development, rapport, morale, the licence, the press, the life around it, history --
  /**
   * rows: the classification ({ car, pos, ... }; a car may carry ppLog [{ pts, reason }] or penPts - the stewards'
   * penalty points); contacts: [{ id, sev, crash }] with your car; table: a shortened race's reduced points; extra:
   * { dotd (you were Driver of the Day), overtakes (yours), grave (the race abandoned or cancelled after an accident),
   * hurtIds (the drivers hurt in it), fought (the driver you clashed with) }. The round moves on.
   */
  applyRace(rows, trackId, contacts = [], table = null, extra = {}) {
    const POINTS = table || [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], byTeam = {};   // (table: a shortened race's reduced points)
    const X = extra || {}, S0 = this.season, R0 = this.round;
    // (before anything moves: your morale and your standing with the press, for the report)
    const me0 = this.me, m0 = me0 ? moodOf(me0).morale : null, why0 = me0?.moodWhy?.[0] || null, P0 = this.pr ? { image: this.pr.image, fame: this.pr.fame, top: this.pr.feed?.[0] || null } : null;
    // (a grave round - anyone hurt or killed in it, a race stopped by an accident, a life lost this round: nothing in it becomes a story)
    const hurtIds = Array.isArray(X.hurtIds) ? X.hurtIds : [], grave = !!X.grave || hurtIds.length > 0 || rows.some((r) => r.car?.injured || r.car?.fate) || this._lostNow();
    // (what everyone could expect today, before the result changes it: the form that moves the ratings)
    const exp = {}; { const es = this.entries(), sc = (e) => e.perf + e.rating * 0.02, sorted = [...es].sort((a, b) => sc(b) - sc(a)); sorted.forEach((e, i) => { exp[e.careerId] = i + 1; }); }
    // (you: your driver - or, while they are out hurt or banned, the stand-in you drove in their place)
    const meRow = rows.find((r) => r.car.careerId === this.playerId) || rows.find((r) => r.car.isPlayer), mate = this.teammate(), mateRow = mate ? rows.find((r) => r.car.careerId === mate.id) : null;
    const flRow = rows.filter((r) => isFinite(r.car.bestLap) && r.car.bestLap > 20).sort((a, b) => a.car.bestLap - b.car.bestLap)[0];
    // (a kiss of the Wall of Champions: the season it came in, for the trophy if the title follows)
    if (X.woc && meRow) { this.wocSeasons = this.wocSeasons || []; if (!this.wocSeasons.includes(S0)) { this.wocSeasons.push(S0); this.addNews('You kissed the Wall of Champions in Montreal. It has caught world champions before: win the title now and it is a story.'); } }
    if (flRow) { const fd = this.drivers[flRow.car.careerId]; if (fd) fd.fl = (fd.fl || 0) + 1; }
    // (the round is yours to talk about only when your own driver raced it and nobody was hurt)
    const mine = !!meRow && meRow.car.careerId === this.playerId, live = mine && !grave, fin = !!meRow && !meRow.car.retired;
    const heads = [], press = (kind, data) => { const r = safe(`PR ${kind}`, () => prEvent(this, kind, data)); if (r?.headlines?.length) heads.push(...r.headlines); return r; };
    const crisis = (kind, data) => safe(`crisis ${kind}`, () => crisisFrom(this, kind, data));
    // the round's context for the press desk and your posts, first of all: it replaces last week's (a grave week ends here)
    const top = [...(contacts || [])].sort((a, b) => (b.sev || 0) - (a.sev || 0))[0], cx = this.pr?.ctx, walked = cx && cx.season === S0 && cx.round === R0 ? cx.fought : null;
    safe('postContext', () => postContext(this, { won: live && fin && meRow.pos === 1, podium: live && fin && meRow.pos <= 3, pos: mine ? meRow.pos : null, track: trackId,
      fought: live ? X.fought || walked || top?.id || null : null, partner: live ? partnerAtRace(this) : null, grave }));
    // the stewards' penalty points (career/Licence.js): onto each driver's licence - twelve within a season of rounds, a ban for the next race
    const lic0 = meRow ? activePoints(this, meRow.car.careerId) : 0, banned = {};
    for (const r of rows) {
      const did = r.car?.careerId; if (!this.drivers[did] || r.car.fate === 'killed') continue;
      for (const e of ppOf(r)) if (this.addPoints(did, e.pts, e.reason, trackId, R0 + 1, { grave }).banned) banned[did] = true;
    }
    const rec = meRow ? this.drivers[meRow.car.careerId] : null, lic1 = rec ? activePoints(this, rec) : 0;
    const points = (rec?.licence || []).filter((e) => e.season === S0 && e.round === R0).map((e) => ({ pts: e.pts, why: e.why }));
    for (const r of rows) {
      const d = this.drivers[r.car.careerId]; if (!d) continue;
      d.starts++;
      const pts = r.car.retired ? 0 : (POINTS[r.pos - 1] || 0);
      d.points += pts; d.careerPts = (d.careerPts || 0) + pts; if (r.pos === 1 && !r.car.retired) d.wins++; if (r.pos <= 3 && !r.car.retired) d.podiums++;
      const team = r.car.team; if (this.teams[team]) { this.teams[team].points += pts; byTeam[team] = (byTeam[team] || 0) + pts; }
    }
    // rapport: contact on track, crashes, a close fight for the championship
    for (const k of contacts) this.relate(k.id, -(4 + Math.min(30, 22 * k.sev)) - (k.crash ? 22 : 0), k.crash ? 'blames you for the crash' : null);
    const st = this.driverStandings(), mi = st.findIndex((d) => d.id === this.playerId);
    if (mi >= 0) for (const j of [mi - 1, mi + 1]) { const o = st[j]; if (o && Math.abs(o.points - st[mi].points) <= 15 && st[mi].points > 0) this.relate(o.id, -3); }
    // money: prize money by the points scored (a backmarker's few points matter), the salaries for the round
    for (const t of Object.values(this.teams)) {
      const pay = this.seatsOf(t.name).reduce((a, d) => a + (d.contract?.salary || 0), 0) / this.rounds;
      t.budget = Math.round((t.budget + 3 + (byTeam[t.name] || 0) * 0.9 - pay) * 10) / 10;
    }
    // development (career/TechTree.js): every factory's round - what reached the cars (news for yours), then the AI teams' new work
    for (const x of safe('devTick', () => devTick(this)) || []) if (this.teams[x.team]?.own) this.addNews(devNews(x));
    safe('aiDevelop', () => aiDevelop(this));
    // the sponsors: each objective met pays out (what they think of you scales it: your own driver's races, never a grave one)
    const report = { round: this.round, track: trackId, pos: meRow ? meRow.pos : null, dnf: meRow ? !!meRow.car.retired : false, grid: meRow?.car.gridPos || null, objectives: [], bonus: 0, trophies: [], seen: false };
    if (meRow) {
      const pos = meRow.pos, fin = !meRow.car.retired, q = this._quali?.[this.playerId], mul = live ? safe('sponsorMul', () => sponsorMul(this)) || 1 : 1;
      for (const ob of this.objectives || []) {
        const ok = ob.id === 'finish' ? fin && pos <= ob.pos : ob.id === 'mate' ? fin && (!mateRow || mateRow.car.retired || pos < mateRow.pos) : ob.id === 'gain' ? fin && (meRow.car.gridPos || pos) - pos >= 3
          : ob.id === 'quali' ? !!q && q <= ob.pos : ob.id === 'points' ? fin && pos <= 10 : ob.id === 'clean' ? fin && !contacts.length : false;
        report.objectives.push({ text: ob.text, reward: ob.reward, ok }); if (ok) report.bonus += ob.reward;
      }
      report.sponsorMul = mul;
      if (report.bonus) {
        report.bonus = r1(report.bonus * mul); this.team.budget = Math.round((this.team.budget + report.bonus) * 10) / 10;
        this.addNews(`Sponsors pay out $${report.bonus}M: ${report.objectives.filter((o) => o.ok).length} of ${report.objectives.length} objectives met${mul !== 1 ? ` (x${mul}, your standing with sponsors)` : ''}.`);
      }
      // the head-to-head with your team-mate
      if (mateRow && meRow.car.careerId === this.playerId && !(meRow.car.retired && mateRow.car.retired)) { if (this.h2h.mate !== mate.id) this.h2h = { mate: mate.id, q: [0, 0], r: [0, 0] }; this.h2h.r[!meRow.car.retired && (mateRow.car.retired || meRow.pos < mateRow.pos) ? 0 : 1]++; }
    }
    // contracts: win bonuses due; a number two who beat you is not happy about it
    for (const r of rows) {
      const d = this.drivers[r.car.careerId], k = d?.contract; if (!d || !k || d.team !== this.myTeam || d.id === this.playerId) continue;
      if (k.winBonus && r.pos === 1 && !r.car.retired) { this.team.budget = Math.round((this.team.budget - k.winBonus) * 10) / 10; this.addNews(`${d.name}'s win bonus: $${k.winBonus}M.`); }
      if (k.role === 'support' && meRow && !r.car.retired && (meRow.car.retired || r.pos < meRow.pos)) this.relate(d.id, -2);
    }
    // the drivers develop: form against what the car promised, the young ones learning race by race
    for (const r of rows) {
      const d = this.drivers[r.car.careerId]; if (!d || !d.alive) continue;
      const young = isYoung(d), e = exp[d.id] || r.pos;
      let dv = r.car.retired ? (young ? 0.0006 : -0.0004) : Math.max(-0.004, Math.min(0.004, (e - r.pos) * 0.00035)) + (young ? 0.0012 : 0.0002);
      dv = Math.round(dv * 10000) / 10000; d.rating = Math.max(0.6, Math.min(0.995, Math.round((d.rating + dv) * 10000) / 10000)); d.lastDelta = dv;
      if (d.id === this.playerId) report.rating = dv;
    }
    // morale (career/Morale.js): every driver's weekend against what they could expect - a win, the team-mate, a retirement
    safe('moraleFromRace', () => moraleFromRace(this, rows, exp));
    // the press (career/PR.js): your result, your fastest lap, the fans' vote, your overtakes, your penalties - a stand-in's race at most one line
    if (live) {
      const mp = ppOf(meRow), sum = mp.reduce((a, e) => a + e.pts, 0);
      if (fin && meRow.pos === 1) press('win', { track: trackId });
      else if (fin && meRow.pos <= 3) press('podium', { pos: meRow.pos, track: trackId });
      else if (fin && (POINTS[meRow.pos - 1] || 0) > 0) press('points', { pos: meRow.pos, track: trackId });
      if (!fin) { if (meRow.car.wreck || ACCIDENT.test(meRow.car.retireReason || '')) press('crash', { blame: mp.some((e) => /collision/i.test(e.reason)) || !!meRow.car.blamed, track: trackId }); else press('dnf', { why: meRow.car.retireReason || 'mechanical', track: trackId }); }
      if (flRow === meRow) press('fastest', { track: trackId });
      if (X.dotd) press('dotd', { track: trackId });
      if ((+X.overtakes || 0) >= 3) press('overtakes', { n: +X.overtakes, track: trackId });
      if (sum > 0 && !banned[this.playerId]) press('penalty', { pts: sum, reason: [...mp].sort((a, b) => b.pts - a.pts)[0].reason, track: trackId });
      // stories that want an answer before the next race: a costly collision with your team-mate or a title rival, a
      // pattern of penalties, a run of races below what the car can do - and your moment, Driver of the Day or a charge
      const col = mp.find((e) => e.pts >= 3 && /collision/i.test(e.reason));
      if (col) {
        const vid = [col.did, col.vs, col.victim, col.against, top?.id].find((v) => typeof v === 'string' && v !== this.playerId && this.drivers[v]), rivals = st.filter((d) => d.id !== this.playerId).slice(0, 3).map((d) => d.id);
        if (vid && (vid === mate?.id || rivals.includes(vid))) crisis('clash', { did: vid, name: this.drivers[vid].name, track: trackId });
      }
      const n = Math.max(mp.length, +meRow.car.penaltyCount || 0);
      if (n >= 3) crisis('reckless', { n, track: trackId }); else if (lic0 < 9 && lic1 >= 9 && lic1 < LICENCE_MAX) crisis('reckless', { points: lic1, track: trackId });
      // (a slump: three races in a row clearly below what the car and the driver promised - a broken car is not the driver's)
      const e = exp[this.playerId], broke = !fin && !meRow.car.wreck && !ACCIDENT.test(meRow.car.retireReason || '');
      if (e && !broke) { this.slump = !fin || meRow.pos > e + 1 ? (this.slump || 0) + 1 : 0; if (this.slump >= 3) { this.slump = 0; crisis('slump', { track: trackId }); } }
      if (X.dotd) crisis('moment', { dotd: true, track: trackId }); else if ((+X.overtakes || 0) >= 5) crisis('moment', { n: +X.overtakes, track: trackId });
    } else if (meRow && !mine && !grave && meRow.car.isPlayer) press('standin', { did: meRow.car.careerId, name: this.drivers[meRow.car.careerId]?.name || meRow.car.name });
    const win = rows.find((r) => r.pos === 1);
    this.log.push({ round: this.round, track: trackId, winner: win?.car.name || '', you: meRow?.pos ?? null });
    // the strategy stories (race/Calls.js, main.js raceFacts): the day's biggest in the paddock news - yours to the press
    // too (a call that made or cost your race) - none in a grave round
    const strat = !grave && Array.isArray(X.strategy) ? X.strategy.filter((x) => x && typeof x.text === 'string') : [];
    for (const x of strat.slice(0, 2).reverse()) this.addNews(`Strategy: ${x.text}.`);
    const ms = live ? strat.find((x) => x.mine) : null;
    if (ms) press('strategy', { kind: ms.kind, good: !!ms.good, pos: ms.pos, n: ms.n >= 2 ? ms.n : null, rival: ms.rival, comp: ms.comp, track: trackId });
    // team orders (race/TeamOrders.js, main.js raceFacts): the day's biggest in the paddock news; yours to the press, and
    // to your team-mate - what it does to what they think of you (Paddock Rapport) and to their morale. A team-mate
    // with number-one status takes your defiance worse.
    const ords = !grave && Array.isArray(X.orders) ? X.orders.filter((x) => x && typeof x.text === 'string') : [];
    for (const x of ords.slice(0, 2).reverse()) this.addNews(`${x.text}.`);
    const mo = live ? ords.find((x) => x.mine && x.sub) : null;
    if (mo) {
      const mid = mo.did === this.playerId ? mo.other : mo.did, md = this.drivers[mid], lead = md?.contract?.role === 'lead';
      if (mid && md) {
        press('orders', { sub: mo.sub, rival: mid, track: trackId, contra: !!mo.contra, n: mo.n });
        const R = { youRefused: [-14, 'you ignored team orders'], youBrokeHold: [-12, 'you broke the hold order'], youHeldUp: [-16, 'you held them up on purpose'], youHit: [-18, 'you took them out'],
          youObeyed: [6, 'you let them through'], youSacrificed: [10, 'you gave way, standings and all'], mateRefused: [-6, 'refused to let you by'], mateHeldUp: [-6, 'held you up'],
          mateHit: [-5, 'hit you'], mateBrokeHold: [-5, 'ignored the hold order'], mateObeyed: [-3, 'moved over for you'], clash: [-6, 'a team-mate collision'] }[mo.sub];
        if (R) this.relate(mid, Math.round(R[0] * (lead && R[0] < 0 && mo.sub.startsWith('you') ? 1.4 : 1) * (mo.dirty ? 1.3 : 1)), R[1]);
        const M = { youRefused: -6, youBrokeHold: -5, youHeldUp: -6, youHit: -8, youObeyed: 3, youSacrificed: 4, mateObeyed: -4, mateRefused: 2 }[mo.sub];
        if (M) shiftMorale(this, mid, M, M < 0 ? 'team orders went against them' : 'the team came first');
        if (mo.sub === 'youSacrificed' || mo.sub === 'mateRefused' || mo.sub === 'mateHeldUp') shiftMorale(this, this.playerId, -4, 'team orders');
      }
    }
    if (win) this.addNews(`Round ${this.round} (${{ lasvegas: 'Las Vegas', montreal: 'Montreal', austin: 'Austin' }[trackId] || 'Silverstone'}): ${win.car.name} wins.`);
    // (each team's best race lap this round: the measured race pace, for the charts)
    this._laps = {}; for (const r of rows) { const t = r.car.team, b = r.car.bestLap; if (this.teams[t] && isFinite(b) && b > 20) this._laps[t] = Math.min(this._laps[t] ?? Infinity, +b.toFixed(3)); }
    if (meRow) report.trophies = this.award({ me: this.me, row: meRow, mateRow, rows, report, fastest: flRow === meRow });
    if (live && report.trophies.length) press('trophy', { name: report.trophies[0] });
    report.fastest = flRow === meRow;
    this.report = meRow ? report : null;
    // (tonight's party needs the race as it was - its city, its guests, its result - before the round moves on: career/Party.js)
    safe('snapAfterRace', () => snapAfterRace(this, { trackId, rows, X, meRow, mateRow, contacts, grave, live }));
    this.round++;
    for (const d of Object.values(this.drivers)) if (d.outUntil != null && d.outUntil < this.round) { delete d.outUntil; if (d.alive && d.team) { d.returnRound = this.round; this.addNews(`${d.name} is back in the ${d.team} car${d.id === this.playerId ? ' - your comeback' : ''} after the accident${d.hurtAt ? ` at ${d.hurtAt}` : ''}.`); } }
    // the round turns over, each engine on its own (one that fails leaves the rest): morale settles, licences age and
    // served bans end, the personal life and the friendships move on, the press desk counts the round and the deals pay
    // (70% to your own account, 30% to the team), a fresh week - and the texts about the race just run
    const life = [], add = (r) => { for (const l of r?.lines || []) if (l && !life.includes(l)) life.push(l); };
    safe('moraleRoundTick', () => moraleRoundTick(this));
    add(safe('licenceRoundTick', () => licenceRoundTick(this, { grave })));
    add(safe('celebRoundTick', () => celebRoundTick(this)));
    add(safe('friendsRoundTick', () => friendsRoundTick(this)));
    // (the split is stated once, when a deal is signed: the report keeps the sums. In a grave round the money still
    // moves, but followers and endorsements stay out of the report)
    const pt = safe('prRoundTick', () => prRoundTick(this)), cash = Math.max(0, +pt?.money || 0), split = DEAL_SPLIT || { wallet: 0.7, team: 0.3 };
    if (!grave) add(pt);
    let toYou = 0, toTeam = 0;
    if (cash > 0) { toYou = r2(cash * split.wallet); toTeam = r2(cash * split.team); this.wallet = r2((+this.wallet || 0) + toYou); const t = this.team; if (t) t.budget = r1(t.budget + toTeam); }
    add(safe('weekRoundTick', () => weekRoundTick(this)));
    add(safe('inboxTick', () => inboxTick(this, rows)));
    add(safe('partyTick', () => partyTick(this)));
    // the report's new pages: your morale and why it moved, the press, the points on your licence, the week's life, a ban
    if (this.report === report) {
      const me = this.me, P = this.pr, why = [];
      if (live && me) for (const w of me.moodWhy || []) { if (w === why0 || why.length >= 10) break; why.push({ k: w.k, d: w.d, why: w.why }); }
      report.morale = { before: m0, after: me ? moodOf(me).morale : null, why };
      const seen = new Set(heads.map((h) => h.text)), more = [];
      for (const h of P?.feed || []) { if (h === P0?.top || more.length >= 3) break; if (!seen.has(h.text)) more.push(h); }
      report.pr = { image: P && P0 ? r1(P.image - P0.image) : 0, fame: P && P0 ? r2(P.fame - P0.fame) : 0,
        headlines: [...heads, ...more].slice(0, 3).map((h) => ({ outlet: h.outlet, name: outletName(h.outlet), text: h.text, tone: h.tone })), money: { gross: +pt?.gross || 0, net: cash, wallet: toYou, team: toTeam } };
      report.points = points; report.life = life.slice(0, 14);
      report.ban = safe('banText', () => banText(this, this.playerId)) || null; report.grave = grave;
    }
    this.snapshot(); delete this._quali; delete this.savedGrid;   // (the round's grid is used up)
    if (this.seasonOver) { const c = this.driverStandings()[0]; this.addNews(`${this.season} champion: ${c.name}, ${c.points} points.`); this.objectives = []; }
    else this.objectivesFor();
    this.save();
  }
  /** the charts' history: every team's car pace, every driver's points and morale after each round, your following and image */
  snapshot() {
    this.history = this.history || [];
    const ds = Object.values(this.drivers).filter((d) => d.points > 0 || d.team);
    this.history.push({ round: this.round - 1, perf: Object.fromEntries(Object.values(this.teams).map((t) => [t.name, +techEffects(t).perf.toFixed(5)])),
      pts: Object.fromEntries(ds.map((d) => [d.id, d.points])), morale: Object.fromEntries(ds.filter((d) => d.alive).map((d) => [d.id, moodOf(d).morale])),
      pr: this.pr ? { fame: this.pr.fame, image: this.pr.image } : null, lap: this._laps || null, track: this.log[this.log.length - 1]?.track || null });
    delete this._laps;
  }
  /** a driver hurt in an accident (you too): out for the next `rounds` rounds (a stand-in drives). -> the stand-in, or null */
  injure(driverId, rounds = 2, where = '') {
    const d = this.drivers[driverId]; if (!d || !d.alive) return null;
    d.outUntil = this.round + rounds - 1;   // (the round has already moved on: from this one)
    d.hurtAt = where || null; d.hurtRounds = rounds; delete d.returnRound;
    const t = d.team ? this.teams[d.team] : null;
    this.addNews(`${d.name} (${d.team || 'free agent'}) will miss the next ${rounds === 1 ? 'round' : `${rounds} rounds`} after a heavy accident${where ? ` at ${where}` : ''}.`);
    safe('shiftMorale', () => shiftMorale(this, driverId, -10, `Hurt in an accident${where ? ` at ${where}` : ''}`, 'confidence'));
    const si = this.freeAgents().find((x) => x.reserveOf === d.team) || this.freeAgents().sort((a, b) => b.rating - a.rating)[0];
    return si ? { name: si.name, from: si.from, team: t?.name } : null;
  }
  /** a driver killed (yours always; an AI driver rarely): gone from the career for good. -> the replacement, or null */
  lose(driverId, roundTxt = '') {
    const d = this.drivers[driverId]; if (!d || !d.alive) return null;
    d.alive = false; d.diedRound = this.round; d.diedSeason = this.season;
    const t = d.team ? this.teams[d.team] : null;
    this.lost.push({ id: d.id, name: d.name, number: d.number, team: d.team, helmet: d.helmet, color: t?.color, starts: d.starts, wins: d.wins, podiums: d.podiums, season: this.season, round: this.round });
    this.addNews(`${d.name} (${d.team || 'free agent'}) killed in an accident${roundTxt}. The paddock mourns.`);
    // (the whole grid feels it, quietly: nothing here is a story)
    for (const o of Object.values(this.drivers)) if (o.alive && o.team) safe('shiftMorale', () => shiftMorale(this, o.id, -6, 'The paddock is grieving'));
    // (your own driver: the people close to them left in peace, nothing waiting for the press, the paddock's quiet words)
    if (driverId === this.playerId) this._grief(d);
    if (t) t.seats = t.seats.filter((x) => x !== d.id);
    d.team = null; d.contract = null;
    // (an AI team fills the seat with the best free driver; your own team's seat waits for you)
    if (t && !t.own) { const r = this.freeAgents().filter((x) => !this.isOut(x)).sort((a, b) => (b.reserveOf === t.name) - (a.reserveOf === t.name) || b.rating - a.rating)[0]; if (r) { this.sign(t.name, r.id, askOf(r), 2); return { name: r.name, from: r.from }; } }
    return null;
  }
  /**
   * Your driver has died (d, while still your driver): whoever they were close to is left in peace (Celebs.grieve - no
   * break-up, no story), nothing is left for the press to answer and no offers wait, the week is put away, and each
   * friend in the paddock sends one quiet message (Social). Once per driver (d.griefDone).
   */
  _grief(d) {
    safe('grieve', () => grieve(this));
    if (this.pr) { this.pr.crisis = null; this.pr.offers = []; }
    safe('socialResetForNewDriver', () => socialResetForNewDriver(this, true));
    safe('partyReset', () => partyReset(this));
    this.week = null; d.griefDone = true;
  }
  /** the season as it ended: the champions, where you and your team finished against the board's target, the prize */
  seasonReview() {
    const ds = this.driverStandings(), ts = this.teamStandings(), me = this.me, team = this.team;
    const teamPos = ts.indexOf(team) + 1, target = BOARD_TARGET[team.tier] ?? 9;
    return { season: this.season, champion: ds[0] || null, constructor: ts[0] || null, youPos: me ? ds.indexOf(me) + 1 : null, youPts: me?.points ?? 0,
      teamPos, target, prize: PRIZE[teamPos - 1] ?? 1, verdict: teamPos < target ? 'delighted' : teamPos === target ? 'satisfied' : teamPos <= target + 2 ? 'concerned' : 'unhappy',
      bonus: teamPos < target ? 5 : teamPos === target ? 2 : 0, expiring: this.seatsOf(this.myTeam).filter((d) => d.id !== this.playerId && d.contract && d.contract.until <= this.season) };
  }
  /** the next season: the standings reset, money for the new season, contracts that ran out end, morale over the winter */
  nextSeason() {
    // (the season that ended: into the archive, its trophies, the press's verdict on it, the prize money and the board's verdict)
    const rv = this.seasonReview();
    this.seasons.push({ season: rv.season, champion: rv.champion?.name || '-', championTeam: rv.champion?.team || '', constructor: rv.constructor?.name || '-', youPos: rv.youPos, youPts: rv.youPts, teamPos: rv.teamPos, target: rv.target, wins: this.log.filter((l) => l.you === 1).length });
    this.award({ season: rv });
    safe('prSeasonEnd', () => prSeasonEnd(this, rv));
    this.team.budget = Math.round((this.team.budget + rv.prize + rv.bonus) * 10) / 10;
    this.addNews(`${this.myTeam} finished P${rv.teamPos} (the board wanted P${rv.target}): $${rv.prize}M in prize money${rv.bonus ? `, $${rv.bonus}M bonus from a ${rv.verdict} board` : `, the board ${rv.verdict}`}.`);
    for (const t of Object.values(this.teams)) if (!t.own) t.budget = Math.round((t.budget + (PRIZE[this.teamStandings().indexOf(t)] ?? 1)) * 10) / 10;
    // (the drivers over the winter: the young ones step up, everyone else a little either way; morale halfway back to normal)
    for (const d of Object.values(this.drivers)) if (d.alive) {
      const young = isYoung(d), dv = young ? 0.008 + Math.random() * 0.02 : (Math.random() - 0.55) * 0.016;
      d.rating = Math.max(0.6, Math.min(0.995, Math.round((d.rating + dv) * 1000) / 1000));
    }
    safe('moraleNewSeason', () => moraleNewSeason(this));
    // (licences keep their points - they age by rounds, across the winter - and a ban due in round 1 stands)
    this.season++; this.round = 1; this.history = []; this.log = []; this.h2h = { mate: null, q: [0, 0], r: [0, 0] }; this.report = null; this.week = null; this.slump = 0;
    this.forecast = this.calendar.map(drawForecast);
    for (const d of Object.values(this.drivers)) { d.points = 0; delete d.outUntil; }
    for (const t of Object.values(this.teams)) { t.points = 0; t.budget = Math.round((t.budget + TIER_BUDGET[t.tier] * 0.8) * 10) / 10; }
    for (const d of Object.values(this.drivers)) if (d.alive && d.contract && d.contract.until < this.season && d.id !== this.playerId) {
      const t = this.teams[d.team]; this.addNews(`${d.name}'s contract with ${d.team} has ended.`);
      t.seats = t.seats.filter((x) => x !== d.id); d.team = null; d.contract = null;
    }
    for (const t of Object.values(this.teams)) if (!t.own) while (this.seatsOf(t.name).length < 2 && this.freeAgents().length) { const r = this.freeAgents().sort((a, b) => b.rating - a.rating)[0]; this.sign(t.name, r.id, askOf(r), 2); }
    // silly season: an AI team swaps its weakest driver for a clearly better one on the market (bought out if needed)
    const teams = Object.values(this.teams).filter((t) => !t.own).sort(() => Math.random() - 0.5);
    for (const t of teams) {
      const seats = this.seatsOf(t.name); if (seats.length < 2) continue;
      const weak = [...seats].sort((a, b) => a.rating - b.rating)[0];
      const target = Object.values(this.drivers).filter((d) => d.alive && d.id !== this.playerId && d.team !== this.myTeam && d.team !== t.name && !this.isOut(d) && d.rating > weak.rating + 0.025)
        .filter((d) => !d.team || (this.teams[d.team].tier > t.tier && Math.random() < 0.5)).sort((a, b) => b.rating - a.rating)[0];
      if (!target || Math.random() > 0.55) continue;
      const from = target.team;
      if (from) { this.teams[from].seats = this.teams[from].seats.filter((x) => x !== target.id); this.teams[from].budget += 4; }
      target.team = null;
      this.sign(t.name, target.id, askOf(target), 2, seats.indexOf(weak));
      this.addNews(`Silly season: ${target.name} moves${from ? ` from ${from}` : ''} to ${t.name}, replacing ${weak.name}.`);
      if (from) { const r = this.freeAgents().filter((x) => !this.isOut(x)).sort((a, b) => b.rating - a.rating)[0]; if (r) this.sign(from, r.id, askOf(r), 2); }
    }
    this.snapshot(); this.objectivesFor(); this.addNews(`The ${this.season} season begins.`); this.save();
  }
}
