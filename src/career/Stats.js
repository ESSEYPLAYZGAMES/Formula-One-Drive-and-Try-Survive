// The stats book: your driver's figures, race by race, for each season and over the whole career - the starts and the
// results, the grid against the finish, the laps completed and led, the distance and the time at the wheel (the race,
// and qualifying and practice where you drove them), the overtakes, the stewards, the crashes, the team-mate, the pit
// wall's orders, the stops, the money and the contracts, and every circuit's bests - with a lighter tally for every
// driver in the paddock (starts, wins, podiums, points, poles, fastest laps, retirements, laps led) for the comparisons
// and the records. The career keeps it as plain JSON (c.stats) and feeds it after every race (Career.applyRace ->
// statsRace) with what the classification says and what main.js measured on the cars (raceStatsOf, handed over as
// extra.stats); main.js adds qualifying and practice as each ends (statsSession). A save from before the book starts
// counting from the round it is first loaded in, with what the career's own records can give back (statsEnsure: the
// driver's record, the season's log, the archive of seasons, the head-to-head, the seat's history). Nothing here
// throws: a figure that cannot be worked out is left out, and the round turns over all the same.

export const STATS_V = 1;
/** the lighter tally kept for every driver, a season at a time: [starts, wins, podiums, points, poles, fastest laps, retirements, laps led] */
export const AI_KEYS = ['starts', 'wins', 'podiums', 'pts', 'poles', 'fl', 'dnf', 'led'];
const AI_N = AI_KEYS.length, MAX_SEASONS = 30, MAX_PAST = 3;
/**
 * The circuits' lengths (km), for a race simulated from the hub: a race driven measures the circuit the cars ran on
 * (main.js passes W.track.length). These are the game's own circuits as built (W.track.length), a little under the
 * real ones' 5.891, 6.201, 4.361 and 5.513 km.
 */
export const TRACK_KM = { silverstone: 5.863, lasvegas: 6.148, montreal: 4.356, austin: 5.484 };

const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const r3 = (v) => Math.round(v * 1000) / 1000;
const warn = (what, e) => console.warn(`Stats: ${what} failed`, e);
// (a retirement as the book counts it: an accident or a car that broke - the morale engine's reading, Career.js ACCIDENT)
const ACCIDENT = /accident|collision|crash|suspension damage|beached|stuck|gravel|stopped on track/i;
const MECH = /mechanical|engine|gearbox|hydraulic|brake|power|puncture|electr|failure|overheat|fuel|leak/i;
/** why a car retired -> 'acc' (an accident, off the road) | 'mech' (the car broke) | 'other' */
export const dnfCause = (car) => (car?.wreck || car?.injured || ACCIDENT.test(car?.retireReason || '') ? 'acc' : MECH.test(car?.retireReason || '') ? 'mech' : 'other');
// (the pit wall's orders, yours: race/TeamOrders.js orderSub - done as asked, or not)
const OBEYED = new Set(['youObeyed', 'youSacrificed']);
const DEFIED = new Set(['youRefused', 'youBrokeHold', 'youHeldUp', 'youHit']);

// ---- the books -------------------------------------------------------------------------------------------------------
/**
 * An empty book: what a season (or the whole career) adds up to. best / bestGrid: 0 until there is one; sec: seconds
 * at the wheel; earn: $M into your own account; mates: the head-to-head with each team-mate { name, q, r, n, pts }.
 */
export function newBook() {
  return { starts: 0, wins: 0, podiums: 0, poles: 0, fronts: 0, fl: 0, pts: 0, ptsFin: 0, fin: 0, sumFin: 0, best: 0, nGrid: 0, sumGrid: 0, bestGrid: 0, gain: 0, nGain: 0,
    dnf: { acc: 0, mech: 0, other: 0 }, laps: 0, led: 0, ledRaces: 0, km: 0, sec: { race: 0, quali: 0, prac: 0 }, sess: { quali: 0, prac: 0 }, ovt: 0, dotd: 0,
    pens: 0, penS: 0, pp: 0, crashes: 0, h2h: { q: [0, 0], r: [0, 0] }, orders: { ok: 0, no: 0 }, stops: 0, hat: 0, earn: { salary: 0, bonus: 0, deals: 0 }, mates: {} };
}
/** a book brought to the current shape: every missing or broken figure back at its start (the old ones kept) */
const fill = (o, d) => {
  for (const [k, v] of Object.entries(d)) {
    const x = o[k];
    if (Array.isArray(v)) o[k] = Array.isArray(x) && x.length === v.length ? x.map((e) => num(e)) : [...v];
    else if (v && typeof v === 'object') { if (!x || typeof x !== 'object' || Array.isArray(x)) o[k] = JSON.parse(JSON.stringify(v)); else fill(x, v); }
    else if (typeof v === 'number' && !(typeof x === 'number' && isFinite(x))) o[k] = v;
  }
  return o;
};
// (since: the first race the book counts - a season already over counts from the next one's first)
const blank = (c) => ({ v: STATS_V, pid: c.playerId || null, name: c.me?.name || '', since: c.round > (c.rounds || Infinity) ? { season: c.season + 1, round: 1 } : { season: c.season, round: c.round }, back: null,
  career: newBook(), seasons: {}, tracks: {}, teams: {}, rec: {}, streak: { win: [0, 0], pod: [0, 0], pts: [0, 0], fin: [0, 0] }, k: null, contracts: 0, ai: {}, aiPart: null, past: [] });
/** a season's book (made when first needed): a book, and the race-by-race log { r, t, tm, g, q, p, d, pts, o, l, n, f, v, c, s } */
export function seasonBook(S, season) {
  const k = String(season); let b = S.seasons[k];
  if (!b || typeof b !== 'object' || Array.isArray(b)) b = S.seasons[k] = { ...newBook(), races: [] };
  if (!Array.isArray(b.races)) b.races = [];
  return b;
}
const trackBook = (S, tid) => {
  const T = S.tracks[tid];
  if (T && typeof T === 'object') return T;
  return (S.tracks[tid] = { starts: 0, wins: 0, podiums: 0, poles: 0, best: 0, fin: 0, sumFin: 0, dnf: 0, laps: 0, bestGrid: 0, lap: null, lapAt: null, q: null, qAt: null });
};
const teamBook = (S, name, from = null) => {
  const t = S.teams[name];
  if (t && typeof t === 'object') return t;
  return (S.teams[name] = { starts: 0, wins: 0, podiums: 0, pts: 0, from: from || null, to: null });
};
const mateBook = (B, id, c) => {
  B.mates = B.mates && typeof B.mates === 'object' ? B.mates : {};
  const m = B.mates[id];
  if (m && typeof m === 'object') return m;
  return (B.mates[id] = { name: c.drivers?.[id]?.name || id, q: [0, 0], r: [0, 0], n: 0, pts: [0, 0] });
};
/** the paddock's tallies for a season (the oldest dropped past MAX_SEASONS) -> { [driverId]: [AI_KEYS] } */
const aiSeason = (S, season) => {
  S.ai = S.ai && typeof S.ai === 'object' ? S.ai : {};
  const k = String(season);
  if (!S.ai[k] || typeof S.ai[k] !== 'object') {
    S.ai[k] = {};
    const ks = Object.keys(S.ai).sort((a, b) => +a - +b);
    while (ks.length > MAX_SEASONS) delete S.ai[ks.shift()];
  }
  return S.ai[k];
};
const aiRow = (A, id) => {
  const a = A[id];
  if (Array.isArray(a) && a.length === AI_N) return a;
  const out = new Array(AI_N).fill(0);
  if (Array.isArray(a)) a.slice(0, AI_N).forEach((v, i) => { out[i] = num(v); });
  return (A[id] = out);
};
/** a driver's tally for a season as an object ({ starts, wins, ... }), or null */
export function aiOf(c, season, id) {
  const a = c?.stats?.ai?.[String(season)]?.[id];
  return Array.isArray(a) ? Object.fromEntries(AI_KEYS.map((k, i) => [k, num(a[i])])) : null;
}
// (your contract as a signature: a new one - signed, renewed, renegotiated, a reserve's - is one more contract signed)
const sigOf = (c) => { const me = c.me, k = me?.contract, t = me?.team || me?.reserveOf || null; return me && me.alive !== false && k && t ? `${t}|${k.salary}|${k.until}|${k.role}` : ''; };

// ---- keeping it --------------------------------------------------------------------------------------------------------
/**
 * The career's stats book, made or brought up to date (Career.upgrade on every load; every call below first): a save
 * without one gets one now, filled from what the career already holds; a different driver at the wheel (yours was
 * killed, or you took over your team-mate) puts the old book away and opens theirs; a new contract is counted. -> c.stats
 */
export function statsEnsure(c) {
  try {
    if (!c || !c.drivers) return null;
    let S = c.stats;
    if (!S || typeof S !== 'object' || Array.isArray(S)) { S = c.stats = blank(c); backfill(c, S, true); }
    else repair(S);
    if (c.playerId && S.pid !== c.playerId) switchDriver(c, S);
    const k = sigOf(c);
    if (k !== S.k) { if (k && S.k != null) S.contracts = num(S.contracts) + 1; S.k = k; }
    return S;
  } catch (e) { warn('statsEnsure', e); return c?.stats && typeof c.stats === 'object' ? c.stats : null; }
}
function repair(S) {
  const B = blank({ season: 0, round: 0 });
  for (const k of ['seasons', 'tracks', 'teams', 'rec', 'ai']) if (!S[k] || typeof S[k] !== 'object' || Array.isArray(S[k])) S[k] = {};
  if (!Array.isArray(S.past)) S.past = [];
  S.career = fill(S.career && typeof S.career === 'object' ? S.career : {}, newBook());
  for (const k of Object.keys(S.seasons)) { const b = S.seasons[k]; if (!b || typeof b !== 'object') { delete S.seasons[k]; continue; } fill(b, newBook()); if (!Array.isArray(b.races)) b.races = []; }
  S.streak = fill(S.streak && typeof S.streak === 'object' ? S.streak : {}, B.streak);
  if (!S.since || typeof S.since !== 'object') S.since = { season: 0, round: 0 };
  S.contracts = num(S.contracts); S.v = STATS_V;
}
/**
 * What the career's own records can give back, for a book opened late. initial (a save from before the stats): the
 * driver's record for the career's starts, wins, podiums, points, poles and fastest laps; the archive for each past
 * season's points and wins; this season's log for its starts, wins, podiums, best result and the circuits; the
 * head-to-head with this season's team-mate; the seat's history for the teams and the contracts; the paddock's points
 * and wins this season. Otherwise (a driver you have taken over): their record, and this season from the paddock's
 * tally. Everything else counts from now (S.since); S.back names the figures that reach back further.
 */
function backfill(c, S, initial) {
  const me = c.me; S.k = sigOf(c);
  if (!me) return;
  const log = Array.isArray(c.log) ? c.log : [], seasons = Array.isArray(c.seasons) ? c.seasons : [];
  const hist = Array.isArray(c.seat?.history) ? c.seat.history : [];
  // (a career with nothing behind it yet - a new one, a rookie who has only just signed: nothing to reach back for)
  if (!(num(me.starts) > 0 || log.length || seasons.length)) {
    if (initial) for (const x of hist) if (x && x.team) teamBook(S, x.team, x.from ? { s: x.from.season, r: x.from.round } : null);
    S.contracts = Math.max(initial ? hist.length : 0, S.k ? 1 : 0);
    return;
  }
  const C = S.career;
  C.starts = num(me.starts); C.wins = num(me.wins); C.podiums = num(me.podiums); C.poles = num(me.poles); C.fl = num(me.fl); C.pts = num(me.careerPts, num(me.points));
  S.back = ['starts', 'wins', 'podiums', 'pts', 'poles', 'fl'];
  if (!initial) {
    const a = aiOf(c, c.season, me.id);
    if (a) { const b = seasonBook(S, c.season); Object.assign(b, { starts: a.starts, wins: a.wins, podiums: a.podiums, pts: a.pts, poles: a.poles, fl: a.fl, led: a.led }); b.part = true; }
    if (me.team) teamBook(S, me.team, { s: c.season, r: c.round });
    S.contracts = S.k ? 1 : 0;
    return;
  }
  // (the seasons before this one, as the archive kept them: your points and your wins)
  for (const s of seasons) { if (!s || s.season == null || s.season === c.season) continue; const b = seasonBook(S, s.season); b.pts = num(s.youPts); b.wins = num(s.wins); b.part = true; }
  // (this season so far, from its log: every round you were classified in)
  const L = log.filter((l) => l && typeof l.you === 'number' && l.you > 0), B = seasonBook(S, c.season);
  if (L.length || num(me.points)) {
    B.starts = L.length; B.wins = L.filter((l) => l.you === 1).length; B.podiums = L.filter((l) => l.you <= 3).length; B.pts = num(me.points);
    B.best = L.length ? Math.min(...L.map((l) => l.you)) : 0; B.part = true;
    B.races = L.map((l) => ({ r: l.round, t: l.track, p: l.you, b: 1 }));
  }
  for (const l of L) { const T = trackBook(S, l.track); T.starts++; if (l.you === 1) T.wins++; if (l.you <= 3) T.podiums++; T.best = T.best ? Math.min(T.best, l.you) : l.you; T.part = true; }
  // (the head-to-head with this season's team-mate, as far as it has gone)
  const h = c.h2h;
  if (h && h.mate && c.drivers[h.mate] && Array.isArray(h.q) && Array.isArray(h.r)) {
    for (const b of [B, C]) { b.h2h.q = [num(h.q[0]), num(h.q[1])]; b.h2h.r = [num(h.r[0]), num(h.r[1])]; const m = mateBook(b, h.mate, c); m.q = [...b.h2h.q]; m.r = [...b.h2h.r]; m.n = m.r[0] + m.r[1]; }
  }
  // (the teams you have been with - the seat's history - and a contract behind each stint)
  for (const x of hist) if (x && x.team) { const t = teamBook(S, x.team, x.from ? { s: x.from.season, r: x.from.round } : null); if (x.to) t.to = { s: x.to.season, r: x.to.round }; }
  if (me.team && !S.teams[me.team]) teamBook(S, me.team, c.seat?.since ? { s: c.seat.since.season, r: c.seat.since.round } : null);
  S.contracts = Math.max(hist.length, S.k ? 1 : 0);
  // (the paddock this season: the points each driver holds, the wins the log names, the starts the rounds give)
  const A = aiSeason(S, c.season), byName = new Map(Object.values(c.drivers).map((d) => [d?.name, d]));
  for (const d of Object.values(c.drivers)) { if (!d || !(num(d.points) > 0 || d.team)) continue; const a = aiRow(A, d.id); a[3] = num(d.points); if (d.team) a[0] = log.length; }
  for (const l of log) { const w = byName.get(l?.winner); if (w) aiRow(A, w.id)[1]++; }
  S.aiPart = c.season;
}
/** a different driver at the wheel: the old book put away (the last few kept), a new one opened from their record */
function switchDriver(c, S) {
  const past = (Array.isArray(S.past) ? S.past : []).slice(-(MAX_PAST - 1)), ai = S.ai;
  if (S.pid) past.push({ pid: S.pid, name: S.name, until: { season: c.season, round: c.round }, career: S.career, seasons: S.seasons, tracks: S.tracks, teams: S.teams, rec: S.rec, contracts: S.contracts });
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, blank(c), { ai: ai && typeof ai === 'object' ? ai : {}, past });
  backfill(c, S, false);
}

// ---- after a race ------------------------------------------------------------------------------------------------------
/**
 * A race done (Career.applyRace, before the round's snapshot): x = { rows, trackId, X (applyRace's extra: X.stats from
 * main.js raceStatsOf, X.dotd, X.overtakes, X.orders), S0, R0 (the race's season and round), POINTS (the table used),
 * meRow, mateRow, mate, flRow (the fastest lap's row), mine (your own driver raced it), earn: { salary, bonus, deals }
 * (what reached your account this round) }. Everyone's tally first; the money; your time at the wheel (a stand-in's
 * race is still your driving); then, for a race of your own driver's, every figure of the book. -> c.stats
 */
export function statsRace(c, x) {
  const S = statsEnsure(c); if (!S || !x || !Array.isArray(x.rows)) return S;
  const { rows, trackId = null, S0 = c.season, R0 = c.round - 1, meRow = null, mateRow = null, mate = null, flRow = null, mine = false } = x;
  const X = x.X || {}, POINTS = Array.isArray(x.POINTS) ? x.POINTS : [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const RS = X.stats && typeof X.stats === 'object' ? X.stats : null, M = RS?.me && typeof RS.me === 'object' ? RS.me : null;
  const q = c._quali || {}, at = { s: S0, r: R0, t: trackId }, ptsOf = (r) => (r?.car?.retired ? 0 : num(POINTS[r.pos - 1]));
  // the paddock's tally: every driver in the race
  const A = aiSeason(S, S0);
  for (const r of rows) {
    const id = r?.car?.careerId; if (!id || !c.drivers[id]) continue;
    const a = aiRow(A, id), fin = !r.car.retired;
    a[0]++; a[3] += ptsOf(r); a[7] += num(RS?.led?.[id]);
    if (fin && r.pos === 1) a[1]++;
    if (fin && r.pos <= 3) a[2]++;
    if (q[id] === 1) a[4]++;
    if (r === flRow) a[5]++;
    if (!fin) a[6]++;
  }
  const B = seasonBook(S, S0), C = S.career, both = [B, C], E = x.earn || {};
  // (the money into your own account this round - a free agent's personal deals too)
  for (const b of both) { b.earn.salary = r2(b.earn.salary + num(E.salary)); b.earn.bonus = r2(b.earn.bonus + num(E.bonus)); b.earn.deals = r2(b.earn.deals + num(E.deals)); }
  // (your time at the wheel, whoever's car it was)
  if (M && num(M.sec) > 0) for (const b of both) b.sec.race = r1(b.sec.race + num(M.sec));
  if (!meRow || !mine) return S;
  const car = meRow.car || {}, fin = !car.retired, pos = num(meRow.pos), pts = ptsOf(meRow), team = car.team || null;
  const grid = num(M?.grid, num(car.gridPos)) || 0, qp = num(q[c.playerId]) || 0, start = qp || grid;
  const laps = M ? num(M.laps) : num(car.lap), led = M ? num(M.led) : 0;
  const km = M && M.km != null ? num(M.km) : r3(laps * num(TRACK_KM[trackId], 5));
  const ovt = M ? num(M.ovt) : num(X.overtakes, num(car.overtakes)), stops = M ? num(M.stops) : num(car.pitStops, num(meRow.stops));
  const cause = fin ? null : dnfCause(car), crash = !!M?.crash || cause === 'acc', fastest = !!flRow && flRow === meRow, pole = start === 1;
  const ppl = Array.isArray(car.ppLog) && car.ppLog.length ? car.ppLog : Array.isArray(meRow.ppLog) ? meRow.ppLog : [];
  const pp = ppl.length ? ppl.reduce((a, e) => a + Math.max(0, Math.round(num(e?.pts))), 0) : Math.max(0, Math.round(num(car.penPts, num(meRow.penPts))));
  const pens = Math.max(num(car.penaltyCount), ppl.length), penS = M ? num(M.penS) : num(car.penalties) + num(car.penaltyServed);
  const mo = (Array.isArray(X.orders) ? X.orders : []).find((o) => o && o.mine && (OBEYED.has(o.sub) || DEFIED.has(o.sub)));
  // (the head-to-head: the race when either of you finished it, qualifying when you both set a place - 0 you, 1 them)
  const mid = mate?.id || null, qm = mid ? num(q[mid]) : 0;
  const rH = mateRow && !(car.retired && mateRow.car?.retired) ? (fin && (mateRow.car?.retired || pos < mateRow.pos) ? 0 : 1) : null;
  const qH = mid && qp && qm ? (qp < qm ? 0 : 1) : null;
  for (const b of both) {
    b.starts++; b.pts += pts; b.laps += laps; b.led += led; b.km = r3(b.km + km); b.ovt += ovt; b.stops += stops;
    b.pens += pens; b.penS = r1(b.penS + penS); b.pp += pp;
    if (fin && pos === 1) b.wins++;
    if (fin && pos <= 3) b.podiums++;
    if (pole) b.poles++;
    if (start && start <= 2) b.fronts++;
    if (fastest) b.fl++;
    if (pts > 0) b.ptsFin++;
    if (led > 0) b.ledRaces++;
    if (X.dotd) b.dotd++;
    if (crash) b.crashes++;
    if (pole && fin && pos === 1 && fastest) b.hat++;
    if (fin) { b.fin++; b.sumFin += pos; b.best = b.best ? Math.min(b.best, pos) : pos; if (grid) { b.gain += grid - pos; b.nGain++; } } else b.dnf[cause]++;
    if (grid) { b.nGrid++; b.sumGrid += grid; b.bestGrid = b.bestGrid ? Math.min(b.bestGrid, grid) : grid; }
    if (mo) b.orders[OBEYED.has(mo.sub) ? 'ok' : 'no']++;
    if (qH != null) b.h2h.q[qH]++;
    if (rH != null) b.h2h.r[rH]++;
    if (mid) {
      const m = mateBook(b, mid, c);
      if (qH != null) m.q[qH]++;
      if (rH != null) m.r[rH]++;
      if (mateRow) { m.n++; m.pts[0] += pts; m.pts[1] += ptsOf(mateRow); }
    }
  }
  B.races.push({ r: R0, t: trackId, tm: team, g: grid || null, q: qp || null, p: pos, d: cause, pts, o: ovt, l: led, n: laps, f: fastest ? 1 : 0, v: X.dotd ? 1 : 0, c: crash ? 1 : 0, s: r1(num(M?.sec)) });
  // the circuit: its starts and results, the best finish, the best race lap you drove there
  if (trackId) {
    const T = trackBook(S, trackId);
    T.starts++; T.laps += laps;
    if (fin && pos === 1) T.wins++;
    if (fin && pos <= 3) T.podiums++;
    if (pole) T.poles++;
    if (fin) { T.fin++; T.sumFin += pos; T.best = T.best ? Math.min(T.best, pos) : pos; } else T.dnf++;
    if (grid) T.bestGrid = T.bestGrid ? Math.min(T.bestGrid, grid) : grid;
    if (num(M?.best) > 20 && (!T.lap || M.best < T.lap)) { T.lap = M.best; T.lapAt = at; }
  }
  // the team you drove it for
  if (team) {
    const t = teamBook(S, team, at);
    t.starts++; t.pts += pts; t.to = at; if (!t.from) t.from = at;
    if (fin && pos === 1) t.wins++;
    if (fin && pos <= 3) t.podiums++;
  }
  // personal records (the most in a race; the quickest clean stop) and the streaks [now, best]
  const R = S.rec, more = (k, n, o = {}) => { if (n > 0 && n > num(R[k]?.n)) R[k] = { n, ...o, at }; };
  if (fin && grid) more('gain', grid - pos, { from: grid, to: pos });
  more('ovt', ovt); more('led', led);
  if (num(M?.stop) > 0 && (!R.stop || M.stop < num(R.stop.n, Infinity))) R.stop = { n: M.stop, at };
  const run = (k, yes) => { const s = S.streak[k]; s[0] = yes ? s[0] + 1 : 0; if (s[0] > s[1]) s[1] = s[0]; };
  run('win', fin && pos === 1); run('pod', fin && pos <= 3); run('pts', pts > 0); run('fin', fin);
  return S;
}

// ---- the sessions (main.js) --------------------------------------------------------------------------------------------
/**
 * The race as main.js saw it, from the director's cars (d: RaceDirector, after the flag), as plain data for the career
 * (extra.stats): every driver's laps led (the first across the line at the end of each lap, from the lap times since
 * lights out), and yours - the laps (to the flag: a cool-down lap that crossed the line again is not one), laps led,
 * the distance, the time at the wheel (lights out to the moment the car stopped being yours: the hand-over after the
 * flag or a retirement, main.js watchSession's c.handAt), the grid, your best lap driven, the stops and the quickest
 * clean one, the overtakes, a crash (a hit the crash camera would take - o.crashG - a launch, a wreck, an accident),
 * the stewards' time. o: { len (the circuit, m), crashG }. -> { v, len, laps, me, led } | null
 */
export function raceStatsOf(d, rows = null, o = {}) {
  try {
    if (!d || d.mode !== 'race') return null;
    const cars = (d.cars || []).filter((c) => c && !c.isSC), L = num(o.len, num(d.track?.length)), t0 = num(d.world?.raceStart, NaN), N = num(d.lapsTotal);
    const lf = d.leaderFinished ? num(d.leaderFinishTime, Infinity) : Infinity;
    // (each car's crossings, seconds after lights out: the sum of its lap times)
    const X = new Map(cars.map((c) => { let t = 0; return [c, (Array.isArray(c.lapTimes) ? c.lapTimes : []).map((v) => (t += num(v)))]; }));
    // (its laps: run to the flag, to its finishing lap; a car whose race was simulated keeps the count the simulation gave it)
    const lapsOf = new Map(cars.map((c) => {
      const x = X.get(c), n = num(c.lap);
      if (!c.finished || x.length < n || !isFinite(t0)) return [c, n];
      for (let k = 0; k < x.length; k++) if (k + 1 >= N || t0 + x[k] >= lf - 0.05) return [c, k + 1];
      return [c, n];
    }));
    const led = {}, K = Math.max(0, ...cars.map((c) => lapsOf.get(c)));
    for (let k = 0; k < K; k++) {
      let who = null, bt = Infinity;
      for (const c of cars) { const tk = X.get(c)[k]; if (lapsOf.get(c) > k && tk != null && tk < bt) { bt = tk; who = c; } }
      if (who?.careerId) led[who.careerId] = (led[who.careerId] || 0) + 1;
    }
    // (your car: the director's player - or, while photo mode drives it, the car that is yours)
    const p = (d.player && cars.includes(d.player) ? d.player : null) || cars.find((c) => c.isPlayer) || null;
    let me = null;
    if (p) {
      const x = X.get(p), hand = num(p.handAt, NaN), end = isFinite(hand) ? hand : num(d.time), n = lapsOf.get(p);
      const driven = Math.min(n, x.length, isFinite(hand) ? num(p.handLaps, x.length) : x.length);
      let best = Infinity; for (let k = 0; k < driven; k++) { const t = num(p.lapTimes[k], Infinity); if (t > 20 && t < best) best = t; }
      const part = p.retired ? Math.max(0, Math.min(L, num(p.lapDist))) : 0;
      const st = (Array.isArray(d.stops) ? d.stops : []).filter((s) => s && s.c === p && s.clean && num(s.t) > 0).map((s) => s.t);
      const crash = num(p.peakG) >= num(o.crashG, 30) || !!p._flew || !!p.wreck || (!!p.retired && dnfCause(p) === 'acc');
      me = { id: p.careerId || null, laps: n, led: num(led[p.careerId]), km: r3((n * L + part) / 1000), sec: isFinite(t0) ? r1(Math.max(0, end - t0)) : 0, grid: num(p.gridPos) || null,
        best: isFinite(best) ? r3(best) : null, stops: num(p.pitStops), stop: st.length ? r2(Math.min(...st)) : null, ovt: num(p.overtakes), crash,
        pens: num(p.penaltyCount), penS: r1(num(p.penalties) + num(p.penaltyServed)) };
    }
    return { v: 1, len: r1(L), laps: N, me, led };
  } catch (e) { warn('raceStatsOf', e); return null; }
}
/**
 * Practice or qualifying over (main.js, in the session's onFinish, the director still up): your time at the wheel
 * (from the start of the session to the hand-over - your laps done, a crash, the rest simulated - else its end) and,
 * in qualifying, your best lap driven there (laps the simulation added after the hand-over are not yours). Saved.
 * kind: 'quali' | 'practice'. -> { sec, best } | null
 */
export function statsSession(c, d, kind, trackId = null) {
  try {
    const S = statsEnsure(c), p = d?.player || (Array.isArray(d?.cars) ? d.cars.find((x) => x && x.isPlayer) : null); if (!S || !p) return null;
    const k = kind === 'quali' ? 'quali' : 'prac', hand = num(p.handAt, NaN), sec = r1(Math.max(0, isFinite(hand) ? hand : num(d.time)));
    for (const b of [seasonBook(S, c.season), S.career]) { b.sec[k] = r1(b.sec[k] + sec); if (sec >= 1) b.sess[k]++; }
    let best = null;
    if (k === 'quali') {
      const T0 = Array.isArray(p.lapTimes) ? p.lapTimes : [], T = isFinite(hand) ? T0.slice(0, num(p.handLaps, T0.length)) : T0, ok = T.filter((t) => isFinite(t) && t > 20);
      if (ok.length) best = r3(Math.min(...ok));
      if (best && trackId) { const B = trackBook(S, trackId); if (!B.q || best < B.q) { B.q = best; B.qAt = { s: c.season, r: c.round, t: trackId }; } }
    }
    c.save?.();
    return { sec, best };
  } catch (e) { warn('statsSession', e); return null; }
}

// ---- reading it ----------------------------------------------------------------------------------------------------------
/** seconds at the wheel in a book (race + qualifying + practice) */
export const secOf = (b) => num(b?.sec?.race) + num(b?.sec?.quali) + num(b?.sec?.prac);
/** the figures a book gives once worked out: averages and rates (null where there is nothing to divide by) */
export function figures(b) {
  const B = b || newBook(), dnf = num(B.dnf?.acc) + num(B.dnf?.mech) + num(B.dnf?.other), per = (v, n) => (n > 0 ? v / n : null);
  return { dnf, avgFin: per(B.sumFin, B.fin), avgGrid: per(B.sumGrid, B.nGrid), avgGain: per(B.gain, B.nGain), winRate: per(B.wins, B.starts), podRate: per(B.podiums, B.starts),
    finRate: per(B.fin, B.fin + dnf), ptsPer: per(B.pts, B.starts), ovtPer: per(B.ovt, B.starts), sec: secOf(B), earn: r2(num(B.earn?.salary) + num(B.earn?.bonus) + num(B.earn?.deals)) };
}
/** the seasons the book or the career knows of, oldest first */
export function seasonsOf(c) {
  const S = c?.stats || {}, set = new Set([c.season, ...Object.keys(S.seasons || {}).map(Number), ...(c.seasons || []).map((s) => s?.season)].filter((v) => Number.isFinite(v)));
  return [...set].sort((a, b) => a - b);
}
/**
 * The paddock's records since the career began - the most wins, podiums, points, poles, fastest laps and starts of any
 * driver, alive or not (their records: Career's driver entries), and the most points and wins in one season (the
 * book's tallies, the archive's champions) - with your own place in each. -> [{ key, label, who, n, you, rank }]
 */
export function paddockRecords(c) {
  const ds = Object.values(c?.drivers || {}).filter((d) => d && d.name), me = c?.me;
  const row = (key, label, val) => {
    const L = ds.map((d) => [d, num(val(d))]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const top = L[0], you = me ? num(val(me)) : 0, rank = me && you > 0 ? 1 + L.filter(([, v]) => v > you).length : null;
    return { key, label, who: top ? top[0].name : null, id: top ? top[0].id : null, n: top ? top[1] : 0, you, rank };
  };
  const out = [row('wins', 'Most wins', (d) => d.wins), row('podiums', 'Most podiums', (d) => d.podiums), row('pts', 'Most points', (d) => num(d.careerPts, d.points)),
    row('poles', 'Most poles', (d) => d.poles), row('fl', 'Most fastest laps', (d) => d.fl), row('starts', 'Most starts', (d) => d.starts)];
  // (one season: the book's tallies; the archive's champions for the seasons before it, with their points)
  let bestPts = null, bestWins = null;
  for (const [s, A] of Object.entries(c?.stats?.ai || {})) {
    for (const [id, a] of Object.entries(A || {})) {
      const d = c.drivers?.[id]; if (!d || !Array.isArray(a)) continue;
      if (!bestPts || num(a[3]) > bestPts.n) bestPts = { n: num(a[3]), who: d.name, id, season: +s };
      if (!bestWins || num(a[1]) > bestWins.n) bestWins = { n: num(a[1]), who: d.name, id, season: +s };
    }
  }
  const mine = (k) => Math.max(0, ...Object.entries(c?.stats?.seasons || {}).map(([, b]) => num(b?.[k])));
  out.push({ key: 'seasonPts', label: 'Most points in a season', who: bestPts?.who || null, id: bestPts?.id || null, n: bestPts?.n || 0, season: bestPts?.season ?? null, you: mine('pts'), rank: null });
  out.push({ key: 'seasonWins', label: 'Most wins in a season', who: bestWins?.who || null, id: bestWins?.id || null, n: bestWins?.n || 0, season: bestWins?.season ?? null, you: mine('wins'), rank: null });
  return out;
}
