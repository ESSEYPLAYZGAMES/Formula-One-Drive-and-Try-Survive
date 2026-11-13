// The team principal's story (career/Manager.js keeps it in c.story): the drama that comes out of the systems, the
// people who remember, and how much of it is shown.
// Every race feeds it (storyAfterRace: the result, and what happened in it - contacts, orders given and refused,
// crashes, stops: storyLive collects them as the race runs). From that it moves the slow things - the feud between
// your drivers, the rivalries on the grid, the fans' mood, what the press holds you to, the board's patience - and
// raises MATTERS: something that happened, told as a cutscene (ui/CineScenes*.js) and usually wanting a decision.
// The budget: between two races at most ONE matter plays itself as a scene when you come back to the HQ (the most
// pressing; none at all straight after another unless it is serious), plus those that cannot wait (a season's first
// and last films, an injured driver's replacement). Everything else waits in the INBOX, where each can be watched
// (the same scene) or simply decided - and decides itself, the cautious way, when its time runs out. At the track,
// after the flag: at most one short scene, and only when the race earned it.
// A matter: { key, scene, title, text, ctx (plain data: the scene's), options [{ id, label, hint }], def, due (the
// round it lapses before), prio, force, pre (a question to answer before its scene is worth showing), data }.
import { POINTS } from '../race/Roster.js';
import { upgradeName } from './TechTree.js';
import { STYLES, principalOf, JOURNALISTS, chairOf, TRAITS, traitFor, factLine, driverLine, feedPosts, pressQuestion, rumourText, episodeName, sur, cap1 } from './StoryLines.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal', austin: 'Austin' };
export const trackName = (id) => TRACK[id] || cap1(String(id || ''));
const rnd = () => Math.random();
const pick = (a) => a[(rnd() * a.length) | 0];

export function storyEnsure(c) {
  if (!c.story) c.story = { v: 1, feud: { level: 0, last: -9, fav: null }, riv: {}, pri: {}, press: { said: [], last: -9 }, cred: 50, fans: 55, matters: [], feed: [], rumours: [], seen: [], board: { stage: 0 }, obey: {}, spMiss: {}, flags: {}, lastAuto: -9, lastTrack: -9, n: 0, ep: 0, live: null, fac: null, sub: null, lastRows: [], track: null, mole: false };
  const S = c.story;
  for (const t of Object.keys(c.teams)) if (t !== c.myTeam && !S.pri[t]) S.pri[t] = principalOf(t);
  if (!S.fac && c.fac) S.fac = Object.fromEntries(Object.entries(c.fac).map(([k, f]) => [k, f.level]));
  return S;
}
export const traitOf = (c, did) => traitFor(did);
export { TRAITS };
const teamInfo = (c, name) => { const t = c.teams[name] || {}; return { name: t.name || name, color: t.color || '#888888', color2: t.color2 || '#ffffff', livery: t.livery || null }; };
const dinfo = (c, did) => { const d = c.drivers[did] || {}; return { id: did, name: d.name || 'A driver', short: d.short, number: d.number, helmet: d.helmet }; };
const mineOf = (c) => c.seatsOf(c.myTeam);
const mor = (c, did, n) => { const d = c.drivers[did]; if (d) d.morale = Math.round(clamp((d.morale ?? 60) + n, 0, 100)); };
const fans = (c, n) => { c.story.fans = Math.round(clamp(c.story.fans + n, 0, 100)); };
const cred = (c, n) => { c.story.cred = Math.round(clamp(c.story.cred + n, 0, 100)); };
const buzz = (c, n) => { c.buzz = +clamp((c.buzz || 0) + n, 0, 0.4).toFixed(3); };
const heat = (c, team, n) => { const p = c.story.pri[team]; if (p) p.heat = Math.round(clamp(p.heat + n, 0, 100)); };
const money = (c, n) => { c.team.budget = r1(c.team.budget + n); };
/** what every scene is given: the team, the season, the round's circuit, your drivers, your sponsors */
export function baseCtx(c) {
  return { T: teamInfo(c, c.myTeam), season: c.season, round: c.round, track: trackName(c.track), drivers: mineOf(c).map((d) => dinfo(c, d.id)), sponsors: Object.values(c.sponsors || {}).filter(Boolean).map((s) => s.brand), cups: (c.results || []).reduce((n, r) => n + r.mine.filter((m) => !m.dnf && m.pos === 1).length, 0) };
}
const table = (c) => c.constructors().slice(0, 10).map((t, i) => ({ a: i + 1, b: t.name, c: t.points, hi: t.name === c.myTeam, col: t.color, line: i + 1 === c.board.target + 1 }));

/**
 * The season in its own terms, for the team (did: one driver): this race against the ones before it - the streaks,
 * the droughts, the firsts. -> null before a race has been run
 */
export function facts(c, did = null) {
  const R = (c.results || []).filter((r) => r.season === c.season), n = R.length; if (!n) return null;
  const of = (r) => r.mine.filter((m) => !did || m.id === did), ok = (r) => of(r).filter((m) => !m.dnf);
  const pts = (r) => ok(r).some((m) => m.pos <= 10), best = (r) => Math.min(99, ...ok(r).map((m) => m.pos)), dn = (r) => of(r).filter((m) => m.dnf).length;
  const last = R[n - 1], prev = R.slice(0, -1), run = (arr, f) => { let k = 0; for (let i = arr.length - 1; i >= 0 && f(arr[i]); i--) k++; return k; };
  const dryBefore = run(prev, (r) => !pts(r)), lp = [...prev].reverse().find(pts);
  return { season: true, n, span: Math.min(4, n), dnfNow: dn(last) > 0, dnfIn4: R.slice(-4).reduce((s, r) => s + dn(r), 0), double: dn(last) >= 2 && !did, pointsNow: pts(last), dry: run(R, (r) => !pts(r)), dryBefore, lastPointsAt: lp ? trackName(lp.track) : null,
    pointsStreak: run(R, pts), winNow: best(last) === 1, firstWin: best(last) === 1 && !prev.some((r) => best(r) === 1), winStreak: run(R, (r) => best(r) === 1), podiumNow: best(last) <= 3, firstPodium: best(last) <= 3 && !prev.some((r) => best(r) <= 3), bestNow: prev.length >= 2 && best(last) < Math.min(...prev.map(best)), best: best(last) };
}
/** the same, said: "a third retirement in four races for Ferrari" */
export const factText = (c, did = null) => factLine(facts(c, did), did ? sur(c.drivers[did]?.name) : c.myTeam);

// ---- as the race runs -------------------------------------------------------------------------------------------------
/** will this driver do as he is told? (0..1) - his morale, his manner, the feud, what happened the last time he did not */
export function obeyChance(c, did) {
  const S = storyEnsure(c), d = c.drivers[did]; if (!d) return 1; const tr = traitFor(did), m = d.morale ?? 60;
  return clamp(0.98 - Math.max(0, 58 - m) * 0.013 - ({ hot: 0.1, political: 0.05, mercenary: 0.05, perfectionist: 0.03 }[tr] || 0) + ({ team: 0.06, loyal: 0.05 }[tr] || 0) - S.feud.level / 100 * 0.22 + (S.obey[did] || 0), 0.25, 1);
}
/** something in the race, kept for the story: { kind: 'contact' | 'order' | 'refuse' | 'crash' | 'stop' | 'pen', ... } */
export function storyLive(c, ev) { const S = storyEnsure(c); if (!S.live) S.live = { contacts: [], orders: [], crashes: [], stops: [], pens: [] }; const k = { contact: 'contacts', order: 'orders', refuse: 'orders', crash: 'crashes', stop: 'stops', pen: 'pens' }[ev.kind]; if (k) S.live[k].push(ev.kind === 'refuse' ? { ...ev, kind: ev.order || 'swap', obeyed: false } : ev.kind === 'order' ? { ...ev, kind: ev.order || 'swap', obeyed: true } : ev); }
/** what the track should know of the story this weekend: the feud hot, the pairs with a grudge, a stand-in */
export function storyTrack(c) {
  const S = storyEnsure(c), [a, b] = mineOf(c);
  const pairs = Object.entries(S.riv).filter(([, r]) => r.heat >= 3).map(([k]) => k.split('|')); if (a && b && S.feud.level >= 50) pairs.push([a.id, b.id]);
  return { feudHot: S.feud.level >= 50, pairs, fans: S.fans };
}
/** your driver replaced for now by a reserve (an injury): the driver who takes the car this round */
export function subOf(c, d) { const s = c.story?.sub; return s && s.did === d.id && c.round <= s.until && c.season === s.season && c.drivers[s.sub] ? c.drivers[s.sub] : d; }
/** a line for the pit wall's radio as it happens ('retire' | 'win' | 'points'), knowing the season */
export function radioFact(c, kind, did) {
  const F = facts(c), F1 = facts(c, did), n = sur(c.drivers[did]?.name);
  if (kind === 'retire') return F && F.dnfIn4 >= 1 ? `That is ${F.dnfIn4 + 1} retirements in ${Math.min(4, (F.n || 0) + 1)} races for us.` : `${n} is out.`;
  if (kind === 'win') return F && !(c.results || []).some((r) => r.season === c.season && r.mine.some((m) => !m.dnf && m.pos === 1)) ? 'The first win of the season. Remember this one.' : 'Another one. Do not get used to it.';
  if (kind === 'points') return F1 && F1.dry >= 2 ? `First points for ${n} since ${F1.lastPointsAt || 'a long time'}.` : '';
  return '';
}

// ---- matters ----------------------------------------------------------------------------------------------------------
function add(c, m) {
  const S = c.story; m.key = `${c.season}.${c.round}.${m.scene}.${S.matters.length}.${(rnd() * 1e6) | 0}`; m.season = c.season; m.round = c.round; m.gap = S.n; m.ctx = { ...baseCtx(c), ...(m.ctx || {}) };
  if (m.due == null) m.due = c.round + 2; S.matters.push(m); if (S.matters.length > 40) S.matters = S.matters.filter((x) => !x.done).concat(S.matters.filter((x) => x.done).slice(-10)); return m;
}
const open = (c, scene) => c.story.matters.some((m) => m.scene === scene && !m.done);
const since = (c, scene) => { const m = [...c.story.matters].reverse().find((x) => x.scene === scene); return m ? c.story.n - m.gap : 99; };
/** the matters waiting (most pressing first) */
export const inboxOf = (c) => storyEnsure(c).matters.filter((m) => !m.done).sort((a, b) => (b.prio || 0) - (a.prio || 0));
/**
 * The scenes that play themselves now (the HQ opened): those that cannot wait, then one more if the budget allows.
 * -> [matter] (0..2)
 */
export function storyQueue(c) {
  const S = storyEnsure(c), W = inboxOf(c).filter((m) => !m.played && !m.pre && m.gap === S.n && !m.quiet);
  const out = W.filter((m) => m.force).slice(0, 2);
  if (out.length < 2 && !out.some((m) => m.heavy)) { const m = W.find((x) => !x.force && (x.prio || 0) >= (S.lastAuto >= S.n - 1 ? 70 : 42)); if (m) out.push(m); }
  return out;
}
/** a matter's scene was shown (the budget counts it) */
export function storyShown(c, key) { const S = storyEnsure(c), m = S.matters.find((x) => x.key === key); if (!m) return; m.played = true; if (!m.force) S.lastAuto = S.n; if (!S.seen.some((x) => x.key === key)) { S.seen.unshift({ key }); if (S.seen.length > 24) S.seen.length = 24; }   /* (which have been shown - not kept to be played again) */ c.save(); }

/** five seconds on a driver for the last race: a place lost to the car behind, the points with it -> { d, other } | null */
function penalise(c, did) {
  const L = c.story.lastRows || [], me = L.find((x) => x.id === did); if (!me || me.dnf) return null;
  const nx = L.find((x) => x.pos === me.pos + 1 && !x.dnf); if (!nx) return null;
  const d = (POINTS[me.pos - 1] || 0) - (POINTS[nx.pos - 1] || 0);
  if (d) { for (const [x, s] of [[me, -1], [nx, 1]]) { if (c.drivers[x.id]) c.drivers[x.id].points = Math.max(0, c.drivers[x.id].points + s * d); if (c.teams[x.team]) c.teams[x.team].points = Math.max(0, c.teams[x.team].points + s * d); } }
  [me.pos, nx.pos] = [nx.pos, me.pos]; return { d, other: nx.id };
}

/**
 * A matter settled: by its scene's result ({ choice, picks, qte }) or by a choice made in the inbox ({ choice }) - or
 * by time (the default). What it changes is here, once. -> a line for the news
 */
export function storyApply(c, key, res = {}) {
  const S = storyEnsure(c), m = S.matters.find((x) => x.key === key); if (!m || m.done) return '';
  const ch = res.choice && res.choice !== '-' ? res.choice : m.def, P = res.picks || {}, Q = res.qte || {}, D = m.data || {}, X = m.ctx; let out = '';
  switch (m.scene) {
    case 'feudRow': {
      const a = D.a, b = D.b, na = sur(c.drivers[a]?.name), nb = sur(c.drivers[b]?.name);
      if (P.step === 'in') { S.feud.level = clamp(S.feud.level - 8, 0, 100); } else if (P.step === 'let') { fans(c, 2); buzz(c, 0.02); }
      if (ch === 'a') { mor(c, a, 8); mor(c, b, -10); S.feud.level = clamp(S.feud.level - 10, 0, 100); S.feud.fav = a; out = `You back ${na}. ${nb} is not speaking to the engineers.`; }
      else if (ch === 'b') { mor(c, b, 8); mor(c, a, -10); S.feud.level = clamp(S.feud.level - 10, 0, 100); S.feud.fav = b; out = `You back ${nb}. ${na} leaves the circuit without a word.`; }
      else { mor(c, a, -4); mor(c, b, -4); S.feud.level = clamp(S.feud.level - 25, 0, 100); out = `Both drivers told where they stand. Neither thanks you; the garage is quieter.`; }
      const cl = S.press.said.find((x) => x.kind === 'peace' && !x.done); if (cl) { cl.done = true; cl.broken = true; cred(c, -6); }
      break; }
    case 'debrief': {
      const d = D.did, n = sur(c.drivers[d]?.name), o = mineOf(c).find((x) => x.id !== d);
      if (P.tone === 'calm') mor(c, d, 2); else if (P.tone === 'hard') { mor(c, d, -2); S.obey[d] = (S.obey[d] || 0) + 0.05; }
      if (ch === 'fine') { mor(c, d, -8); S.obey[d] = (S.obey[d] || 0) + 0.25; money(c, 0.1); out = `${n} is fined for ignoring the pit wall. He will do as he is told next time.`; }
      else if (ch === 'warn') { mor(c, d, -4); S.obey[d] = (S.obey[d] || 0) + 0.15; S.flags[`warned.${d}`] = true; out = `${n} has a formal warning on his file.`; }
      else { mor(c, d, 3); if (o) mor(c, o.id, -6); S.obey[d] = (S.obey[d] || 0) - 0.1; S.feud.level = clamp(S.feud.level + 6, 0, 100); out = `You let it go. ${o ? `${sur(o.name)} noticed.` : ''}`; }
      break; }
    case 'poach': {
      const d = c.drivers[D.did], n = D.name;
      if (P.move === 'walk') { heat(c, D.team, 10); if (d) mor(c, D.did, 2); }
      if (ch === 'counter') { if (d) { d.salary = r1((d.salary || 1) + (D.cost || 1)); mor(c, D.did, 6); d.until = Math.max(d.until || c.season, c.season + 1); } else money(c, -(D.cost || 0.3)); out = `${n} stays: a counter-offer, $${D.cost}M a season more.`; }
      else if (ch === 'promise') { if (d) { mor(c, D.did, 4); (c.promises = c.promises || []).push({ did: D.did, kind: 'contract', season: c.season, round: c.round, due: c.round + 3, done: false }); } out = `${n} is promised talks within three races. Keep it.`; }
      else { if (d) { mor(c, D.did, -3); S.flags[`out.${D.did}`] = D.team; } else if (rnd() < 0.4 && D.eng != null && c.engineers?.[D.eng]) { c.engineers[D.eng].feedback = clamp(c.engineers[D.eng].feedback - 0.12, 0.2, 1); out = `${n} has gone to ${D.team}. A junior takes the headset.`; } if (!out) out = `${n} keeps talking to ${D.team}.`; }
      break; }
    case 'hearing': {
      if (m.pre && ch === 'drop') { out = 'No protest lodged.'; break; }
      const odds = clamp((X.odds ?? 0.5) + (P.evidence === X.best ? 0.3 : !P.evidence || P.evidence === 'none' ? -0.15 : -0.05), 0.05, 0.95), won = (X.roll ?? 0.5) < odds;
      if (X.mine !== false) { money(c, -0.2); if (won) { const r = penalise(c, D.them); heat(c, D.team, 12); fans(c, 2); out = `The protest is upheld: five seconds for ${sur(c.drivers[D.them]?.name)}${r?.d ? `, ${r.d} point${r.d === 1 ? '' : 's'} change hands` : ''}.`; } else { heat(c, D.team, 6); cred(c, -2); out = 'The protest is dismissed. The fee is gone.'; } }
      else if (won) { out = 'No further action from the stewards.'; cred(c, 2); } else { const r = penalise(c, D.mine); mor(c, D.mine, -4); out = `${sur(c.drivers[D.mine]?.name)} is given five seconds after the hearing${r?.d ? `: ${r.d} point${r.d === 1 ? '' : 's'} lost` : ''}.`; }
      break; }
    case 'scrutineering': {
      if (X.yours === false) { out = `${D.team}'s ${X.part} failed the new test: they will be slower from ${X.from}.`; break; }
      const q = c.team.quality?.[D.up], cut = () => { if (q && q.length) q[q.length - 1] = +(q[q.length - 1] * 0.86).toFixed(3); };
      if (ch === 'run') { S.flags.tdRisk = { round: c.round, up: D.up }; out = `The ${X.part} runs as it is for one more race. If anyone protests it, the result is at risk.`; }
      else if (ch === 'lobby') { money(c, -1); if (rnd() < 0.3) { out = 'The directive is put back to next season. It cost a million and some friends.'; for (const t of Object.keys(S.pri)) heat(c, t, 3); } else { cut(); out = `The lobbying fails: the ${X.part} is stiffened. ${X.loss} lost until it is developed again.`; } }
      else { cut(); out = `The ${X.part} is stiffened to the new limit: ${X.loss} lost until it is developed again.`; }
      break; }
    case 'audit': {
      const fine = X.fine ?? 1.5;
      if (ch === 'contest') { money(c, -0.6); const odds = 0.4 + (P.line === 'books' ? 0.15 : P.line === 'built' ? 0.05 : 0); if (rnd() < odds) { money(c, -fine / 2); out = `The breach is halved on appeal: $${r1(fine / 2)}M, no tunnel penalty.`; } else { money(c, -fine * 1.5); S.flags.atrMul = 0.85; S.flags.atrFor = c.seasonDone ? c.season + 1 : c.season; cred(c, -4); out = `The appeal fails: $${r1(fine * 1.5)}M and fifteen per cent of the tunnel time.`; } }
      else { money(c, -fine); S.flags.atrMul = 0.9; S.flags.atrFor = c.seasonDone ? c.season + 1 : c.season; out = `The breach is accepted: $${fine}M and ten per cent of next season's tunnel time.`; }
      break; }
    case 'sponsorCall': {
      const slot = Object.keys(c.sponsors || {}).find((k) => c.sponsors[k]?.brand === D.brand), s = slot && c.sponsors[slot];
      if (!s) break;
      if (ch === 'promise') { S.flags.spPromise = { brand: D.brand, by: c.round + 1, season: c.season }; out = `${D.brand} are promised points within two races.`; }
      else if (ch === 'cut') { s.base = r1(s.base * 0.7); s.bonus = r1((s.bonus || 0) * 0.7); out = `${D.brand} stay for 30% less.`; }
      else { c.sponsors[slot] = null; buzz(c, -0.03); fans(c, -2); out = `${D.brand} take their name off the car.`; }
      S.spMiss[D.brand] = 0; break; }
    case 'leak': {
      const known = Q.freeze === 'good' || D.known, rt = c.teams[D.team];
      const undo = () => { if (rt && D.up && D.gave && rt.levels?.[D.up] > 0) rt.levels[D.up]--; };
      if (ch === 'fire') { S.mole = false; c.fatigue = clamp((c.fatigue || 0) + 0.03, 0, 1); out = `${D.mole} is dismissed. The factory knows why.`; }
      else if (ch === 'feed') { if (rnd() < 0.7) { undo(); heat(c, D.team, 8); out = `${D.team} spend three weeks building a drawing that does not work.`; } else { buzz(c, -0.02); out = `${D.mole} worked out what the drawing was. It is in the papers.`; } S.mole = known; }
      else if (ch === 'quiet') { S.mole = rnd() < 0.5; out = `A quiet word with ${D.mole}.`; }
      else if (ch === 'probe') { money(c, -(X.cost ?? 0.3)); if (rnd() < (Q.freeze === 'ok' ? 0.9 : 0.6)) { S.mole = false; out = `The investigation finds ${D.mole}. They are gone by Friday.`; } else { S.mole = true; out = 'The investigation finds nothing. The factory feels watched.'; c.fatigue = clamp((c.fatigue || 0) + 0.03, 0, 1); } }
      else { S.mole = true; out = 'The leak is left alone.'; }
      break; }
    case 'seatFit': {
      const id = P.who || ch || D.cands?.[0]; S.sub = { did: D.did, sub: id, until: D.until, season: c.season };
      out = `${c.drivers[id]?.name || 'A reserve'} drives ${sur(c.drivers[D.did]?.name)}'s car until round ${D.until}.`; break; }
    case 'crewTalk': {
      const M = c.crew?.members || [], who = M.find((x) => x.name === D.name);
      if (D.what === 'retire') { if (ch === 'role') { money(c, -0.2); for (const x of M) x.speed = +clamp(x.speed + 0.01, 0.4, 0.97).toFixed(2); out = `${D.name} will run the crew centre next season.`; } else { for (const x of M) x.cons = +clamp(x.cons + 0.01, 0.4, 0.97).toFixed(2); out = `${D.name} gets the last stop of the year.`; } }
      else if (ch === 'move' && who) { const tyre = M.filter((x) => /^t/.test(x.role) && x !== who).sort((a, b) => b.cons - a.cons)[0]; if (tyre) [who.role, tyre.role] = [tyre.role, who.role]; who.cons = +clamp(who.cons - 0.02, 0.4, 0.97).toFixed(2); out = `${D.name} is moved off the gun.`; }
      else if (ch === 'drill') { for (const x of M) { x.speed = +clamp(x.speed + 0.01, 0.4, 0.97).toFixed(2); x.fat = clamp(x.fat + 0.06, 0, 1); } out = 'Extra practice for the whole crew.'; }
      else { if (who) { who.cons = +clamp(who.cons + 0.03, 0.4, 0.97).toFixed(2); who.fat = clamp(who.fat - 0.05, 0, 1); } out = `You keep faith with ${D.name}.`; }
      break; }
    case 'press': {
      const o = (X.opts || []).find((x) => x.id === (P.answer || ch)), fx = o?.fx || { cred: -2, fans: -1 };
      if (fx.fans) fans(c, fx.fans); if (fx.cred) cred(c, fx.cred); if (fx.buzz) buzz(c, fx.buzz); if (fx.morale) for (const d of mineOf(c)) mor(c, d.id, fx.morale); if (fx.heat && D.rival) heat(c, D.rival, fx.heat);
      if (fx.crew && c.crew) for (const x of c.crew.members) x.fat = clamp(x.fat - 0.03, 0, 1);
      if (fx.claim) S.press.said.push({ ...fx.claim, season: c.season, round: c.round, track: X.track, done: false });
      out = o ? `"${o.head}"` : `${X.T.name}'s boss walks out of the press conference.`; break; }
    case 'board': {
      const p = P.pitch || 'own';
      if (X.stage < 3) { c.board.conf = Math.round(clamp(c.board.conf + ({ results: 6, invest: -2, own: 3 }[p] || 0), 0, 100)); if (p === 'results') S.board.promise = { by: c.round + 2, pts: c.team.points }; if (p === 'invest' && rnd() < 0.4) { money(c, 3); out = 'The board finds $3M for the factory.'; } }
      else S.board.ultimatum = c.round + 1;
      if (!out) out = X.stage === 3 ? 'The board has given you two races.' : X.stage === 2 ? 'The board issues a vote of confidence.' : 'A word from the chair.'; break; }
    case 'signing': { if (P.message === 'win') { mor(c, D.did, 4); fans(c, 2); } else if (P.message === 'change') { const o = mineOf(c).find((x) => x.id !== D.did); if (o) mor(c, o.id, -3); } else mor(c, D.did, 2); if (Q.shake === 'good') buzz(c, 0.02); break; }
    case 'released': { const o = mineOf(c)[0]; if (P.how === 'cold') { if (o) mor(c, o.id, -3); fans(c, -2); } else if (P.how === 'kind') fans(c, 1); else cred(c, 2); break; }
    case 'sacked': { if (P.how === 'grace') { const t = Object.values(c.teams).filter((x) => x.name !== c.myTeam && !c.offers.includes(x.name)).sort((a, b) => b.tier - a.tier)[0]; if (t) c.offers.push(t.name); } else if (P.how === 'blame' && c.offers.length > 1) c.offers.pop(); break; }
    case 'documentary': { const o = (X.you?.opts || []).find((x) => x.id === P.you); if (o?.fx) { if (o.fx.fans) fans(c, o.fx.fans); if (o.fx.cred) cred(c, o.fx.cred); if (o.fx.buzz) buzz(c, o.fx.buzz); } break; }
    default: break;
  }
  m.done = true; m.result = out; if (out) c.addNews(out); c.save(); return out;
}

// ---- after a race -----------------------------------------------------------------------------------------------------
/**
 * The race into the story. rep: Manager.applyRace's report; rows: the classification ({ car: { careerId, team, retired,
 * retireReason }, pos }); live: what storyLive kept (none: a simulated weekend - a little is made up).
 */
export function storyAfterRace(c, rep, rows, live = null) {
  const S = storyEnsure(c), my = mineOf(c), [a, b] = my, T = c.myTeam, sim = !live;
  live = live || { contacts: [], orders: [], crashes: [], stops: [], pens: [] }; S.live = null;
  S.n++; S.lastRows = rows.map((r) => ({ id: r.car.careerId, team: r.car.team, pos: r.pos, dnf: !!r.car.retired }));
  const mine = rep.mine || [], F = facts(c), fact = factLine(F, T), posOf = (id) => S.lastRows.find((x) => x.id === id), win = mine.some((m) => !m.dnf && m.pos === 1), podium = mine.some((m) => !m.dnf && m.pos <= 3), double = mine.length >= 2 && mine.every((m) => m.dnf);
  if (fact) c.addNews(`${cap1(fact)}.`);   // (the result in the season's own terms)
  // (a simulated weekend: now and then the two of yours touch, or someone leans on one of them)
  if (sim && a && b) { if (rnd() < 0.05) live.contacts.push({ a: a.id, b: b.id, sev: 0.4 + rnd() * 0.4, lap: 3, where: 'Turn 1' }); if (rnd() < 0.1) { const o = pick(S.lastRows.filter((x) => x.team !== T)); if (o) live.contacts.push({ a: o.id, b: pick(my).id, sev: 0.3 + rnd() * 0.5, lap: 2 + ((rnd() * 20) | 0), where: `Turn ${1 + ((rnd() * 9) | 0)}` }); } }
  // matters whose time has run out decide themselves
  for (const m of S.matters) if (!m.done && m.due != null && (c.round > m.due || c.season > m.season)) storyApply(c, m.key, {});
  // the stand-in's stint over
  if (S.sub && (c.round > S.sub.until || c.season > S.sub.season)) { c.addNews(`${c.drivers[S.sub.did]?.name} is fit again and back in the car.`); S.sub = null; }
  // the fans: the result against what the car should do, the orders they hate, the drama they love
  fans(c, clamp(((rep.conf ?? 50) - (rep.conf0 ?? 50)) * 0.7, -4, 4) + (win ? 5 : podium ? 2 : 0) + (double ? -3 : 0) - live.orders.filter((o) => o.kind === 'swap' && o.obeyed !== false).length * 2 + (live.orders.some((o) => o.obeyed === false) ? 1 : 0));
  S.fans = Math.round(S.fans + (55 - S.fans) * 0.04); c.buzz = +clamp((c.buzz || 0) + (S.fans - 50) * 0.0004, 0, 0.4).toFixed(3);
  // the rivalries: every pair that touched
  for (const k of Object.keys(S.riv)) { S.riv[k].heat = +(S.riv[k].heat - 0.4).toFixed(2); if (S.riv[k].heat <= 0) delete S.riv[k]; }
  for (const x of live.contacts) { if (!x.a || !x.b || x.a === x.b) continue; const k = [x.a, x.b].sort().join('|'), r = S.riv[k] || (S.riv[k] = { heat: 0, n: 0 }); r.heat = +(r.heat + 1 + (x.sev || 0.4)).toFixed(2); r.n++; r.last = `${trackName(rep.track)}, lap ${x.lap || '?'}`; if (r.n === 3 && !r.named) { r.named = true; c.addNews(`${sur(c.drivers[x.a]?.name)} and ${sur(c.drivers[x.b]?.name)} again: a third coming-together this season. The paddock is calling it a feud.`); } }
  // the feud between your two: contact, orders, the quicker one held, who beat whom
  if (a && b) {
    const fe = S.feud, k = ({ hot: 1.3, team: 0.6, loyal: 0.8 }[traitFor(a.id)] || 1) * ({ hot: 1.3, team: 0.6, loyal: 0.8 }[traitFor(b.id)] || 1);
    let up = -4; const touch = live.contacts.filter((x) => (x.a === a.id && x.b === b.id) || (x.a === b.id && x.b === a.id));
    for (const x of touch) up += 16 + 14 * (x.sev || 0.4); up += live.orders.filter((o) => o.kind === 'swap' || o.kind === 'hold').length * 7 + live.orders.filter((o) => o.obeyed === false).length * 10;
    const pa = posOf(a.id), pb = posOf(b.id); if (pa && pb && !pa.dnf && !pb.dnf && Math.abs(pa.pos - pb.pos) === 1) up += 3;
    fe.level = Math.round(clamp(fe.level + (up > 0 ? up * k : up), 0, 100));
    if (fe.level >= 55 && since(c, 'feudRow') >= 3 && (touch.length || live.orders.length || fe.level >= 70)) {
      const agg = touch.length ? (pa && pb && pa.pos > pb.pos ? a : b) : (live.orders.find((o) => o.kind === 'swap' || o.kind === 'hold')?.did === b.id ? b : a), oth = agg === a ? b : a;
      add(c, { scene: 'feudRow', prio: 72, title: `${sur(a.name)} and ${sur(b.name)}: a row in the garage`, text: touch.length ? `They touched at ${touch[0].where || 'the first corner'}. Now they are shouting.` : 'Team orders, and one of them thinks they always go the same way.', def: 'both', data: { a: agg.id, b: oth.id },
        options: [{ id: 'a', label: `Back ${sur(agg.name)}` }, { id: 'b', label: `Back ${sur(oth.name)}` }, { id: 'both', label: 'Read them both the riot act' }],
        ctx: { a: dinfo(c, agg.id), b: dinfo(c, oth.id), why: touch.length ? 'contact' : 'orders', track: trackName(rep.track), lines: { a1: driverLine(traitFor(agg.id), 'feudA'), b1: driverLine(traitFor(oth.id), 'feudB') } } });
      fe.last = S.n;
    }
  }
  // an order refused
  for (const o of live.orders.filter((x) => x.obeyed === false).slice(0, 1)) {
    const d = c.drivers[o.did]; if (!d || open(c, 'debrief')) break;
    add(c, { scene: 'debrief', prio: 66, title: `${sur(d.name)} ignored the pit wall`, text: `Lap ${o.lap || '?'}: told to ${o.kind === 'hold' ? 'hold position' : 'let his team-mate through'}. He did not.`, def: 'drop', data: { did: o.did },
      options: [{ id: 'fine', label: 'Fine him' }, { id: 'drop', label: 'Let it go' }, { id: 'warn', label: 'A formal warning' }], ctx: { d: dinfo(c, o.did), order: o.kind, lap: o.lap, traitText: TRAITS[traitFor(o.did)].name, track: trackName(rep.track), lines: { radio: `"${driverLine(traitFor(o.did), 'refuse')}"` } } });
  }
  // an injury: a heavy crash (or, simulated, the odd accident) - someone else gets the car
  const hurt = live.crashes.find((x) => my.some((d) => d.id === x.did) && (x.hurt || (x.g || 0) >= 38)) || (sim && rnd() < 0.012 && mine.find((m) => m.dnf) ? { did: mine.find((m) => m.dnf).id, g: 40 } : null);
  if (hurt && !S.sub && !c.seasonDone && !open(c, 'seatFit')) {
    const n = 1 + (rnd() < 0.45 ? 1 : 0), cands = c.freeAgents().filter((d) => d.from !== 'F1' || !d.team).slice(0, 3);
    if (cands.length) add(c, { scene: 'seatFit', prio: 95, force: true, title: `${sur(c.drivers[hurt.did]?.name)} is hurt`, text: `Out for ${n} race${n === 1 ? '' : 's'}. Someone has to drive the car.`, def: cands[0].id, due: c.round, data: { did: hurt.did, until: Math.min(c.rounds, c.round + n - 1), cands: cands.map((x) => x.id) },
      options: cands.map((x) => ({ id: x.id, label: x.name })), ctx: { hurt: dinfo(c, hurt.did), rounds: n, why: pick(['A fracture in the wrist.', 'Concussion: the doctors will not sign him off.', 'Two cracked ribs.']), cands: cands.map((x) => ({ id: x.id, name: x.name, note: `${x.from === 'F2' ? 'F2' : 'Reserve'} · ${Math.round(x.rating * 100)}` })), lines: { res: driverLine(traitFor(cands[0].id), 'seat') } } });
  } else if (live.crashes.some((x) => my.some((d) => d.id === x.did)) && since(c, 'garageNight') >= 3) {
    const x = live.crashes.find((q) => my.some((d) => d.id === q.did));
    add(c, { scene: 'garageNight', prio: 44, title: 'The car rebuilt overnight', text: `${sur(c.drivers[x.did]?.name)}'s crash: the crew did not go home.`, ctx: { d: dinfo(c, x.did), damage: 'Front wing, floor, the front-left corner', spares: c.spares?.fw ?? c.parts?.spares?.fw ?? 1, track: trackName(rep.track) } });
  }
  // the stewards: someone hit one of yours and nothing was done about it - or one of yours did the hitting
  const inc = live.contacts.find((x) => { const A = my.some((d) => d.id === x.a), B = my.some((d) => d.id === x.b); return A !== B && (x.sev || 0) >= 0.45; });
  if (inc && since(c, 'hearing') >= 2 && !c.seasonDone) {
    const mineId = my.some((d) => d.id === inc.a) ? inc.a : inc.b, them = mineId === inc.a ? inc.b : inc.a, td = c.drivers[them], rt = td?.team, pm = posOf(mineId), pt = posOf(them);
    if (rt && S.pri[rt]) {
      const victim = !pm || pm.dnf || (pt && !pt.dnf && pt.pos < pm.pos), I = { a: c.drivers[mineId]?.short || 'US', b: td.short || 'THEM', ca: c.team.color, cb: c.teams[rt].color, where: inc.where || 'Turn 4', lap: inc.lap || 1 }, rv = { name: S.pri[rt].name, team: teamInfo(c, rt) };
      const common = { rival: rv, inc: I, best: pick(['trace', 'onboard', 'radio']), odds: victim ? 0.5 : 0.45, roll: rnd(), doc: 30 + ((rnd() * 40) | 0), track: trackName(rep.track), lines: { rival: STYLES[S.pri[rt].style].protest } };
      if (victim && pt && !pt.dnf) add(c, { scene: 'hearing', prio: 58, pre: true, title: `Protest ${sur(td.name)}?`, text: `${sur(td.name)} put ${sur(c.drivers[mineId]?.name)} off at ${I.where} and finished ahead. No penalty was given. A protest costs $0.2M.`, def: 'drop', due: c.round, data: { them, mine: mineId, team: rt }, options: [{ id: 'lodge', label: 'Lodge the protest' }, { id: 'drop', label: 'Leave it' }], ctx: { ...common, mine: true } });
      else if (!victim && rnd() < 0.6) add(c, { scene: 'hearing', prio: 62, title: `Summoned: ${rt} protest ${sur(c.drivers[mineId]?.name)}`, text: `${rt} say your car caused the contact at ${I.where}.`, def: 'none', due: c.round, data: { them, mine: mineId, team: rt }, ctx: { ...common, mine: false } });
    }
  }
  // a part run against the directive, and someone protested it
  if (S.flags.tdRisk && S.flags.tdRisk.round < c.round) { const up = S.flags.tdRisk.up; S.flags.tdRisk = null; const q = c.team.quality?.[up]; if (q && q.length) q[q.length - 1] = +(q[q.length - 1] * 0.86).toFixed(3); if (rnd() < 0.35) { let lost = 0; for (const m of mine) { const d = c.drivers[m.id]; if (d && m.pts) { d.points -= m.pts; c.team.points -= m.pts; lost += m.pts; } } c.addNews(`Excluded: the part was protested and failed the new test. ${lost} point${lost === 1 ? '' : 's'} gone.`); cred(c, -5); fans(c, -3); } else c.addNews('Nobody protested the part. It is stiffened now, as the directive requires.'); }
  // the technical directive, once a season, a little before half distance
  if (!c.seasonDone && c.rounds >= 4 && rep.round === Math.max(2, Math.ceil(c.rounds * 0.42)) && !S.flags[`td.${c.season}`]) {
    S.flags[`td.${c.season}`] = true; const ups = Object.entries(c.team.levels || {}).filter(([k, v]) => v >= 2 && c.team.quality?.[k]?.length), PART = ['front wing', 'floor', 'rear wing', 'diffuser'][c.season % 4], no = 10 + ((rnd() * 30) | 0), next = trackName(c.track);
    const ahead = c.constructors()[Math.max(0, c.posOf(T) - 2)];
    if (ups.length && rnd() < 0.55) { const [up] = ups.sort((x, y) => y[1] - x[1])[0]; add(c, { scene: 'scrutineering', prio: 76, title: `Technical directive ${no}: your ${PART}`, text: `The new load test finds it over the limit. It applies from ${next}.`, def: 'comply', due: c.round, data: { up }, options: [{ id: 'comply', label: 'Stiffen it now' }, { id: 'run', label: 'Run it one more race' }, { id: 'lobby', label: 'Lobby against it ($1M)' }], ctx: { part: PART, no, td: { name: c.staff.td?.name }, mm: [r1(10.6 + rnd() * 2), 10], from: next, loss: 'about a tenth and a half', yours: true } }); }
    else if (ahead && ahead.name !== T) { const k = Object.keys(ahead.levels || {}).sort((x, y) => (ahead.levels[y] || 0) - (ahead.levels[x] || 0))[0]; if (k && ahead.levels[k] > 0) ahead.levels[k]--; add(c, { scene: 'scrutineering', prio: 48, title: `Technical directive ${no}: ${ahead.name} caught out`, text: `Their ${PART} fails the new test. They lose pace from ${next}.`, data: { team: ahead.name }, ctx: { part: PART, no, td: { name: c.staff.td?.name }, mm: [r1(11 + rnd() * 2), 10], from: next, loss: 'two tenths', yours: false, rival: teamInfo(c, ahead.name) } }); }
  }
  // another team after one of yours
  if (!c.seasonDone && rep.round >= 2 && since(c, 'poach') >= 4 && my.length) {
    const cand = my.map((d) => ({ d, w: 0.05 + (d.until === c.season ? 0.09 : 0) + ((d.morale ?? 60) < 45 ? 0.08 : 0) + ({ political: 0.05, mercenary: 0.07, loyal: -0.04 }[traitFor(d.id)] || 0) + ((posOf(d.id)?.pos || 20) <= 5 ? 0.04 : 0) })).sort((x, y) => y.w - x.w)[0];
    const order = c.constructors(), i = order.findIndex((t) => t.name === T), rt = pick(order.filter((t, j) => t.name !== T && Math.abs(j - i) <= 2)) || order.find((t) => t.name !== T);
    if (rt && rnd() < cand.w) { const d = cand.d, cost = r1(clamp((d.salary || 1) * 0.2, 0.5, 3)); add(c, { scene: 'poach', prio: 60, title: `${rt.name} are talking to ${sur(d.name)}`, text: `Seen at their table in the paddock. ${d.until === c.season ? 'His contract ends this season.' : ''}`, def: 'let', data: { did: d.id, name: d.name, team: rt.name, cost }, options: [{ id: 'counter', label: `Counter-offer (+$${cost}M)` }, { id: 'promise', label: 'Promise contract talks' }, { id: 'let', label: 'Let them talk' }], ctx: { who: { ...dinfo(c, d.id), role: 'Driver', driver: true }, rival: { name: S.pri[rt.name].name, team: teamInfo(c, rt.name) }, cost, offer: STYLES[S.pri[rt.name].style].poach, lines: { vo: `${cap1(factLine(facts(c, d.id), sur(d.name)) || `${sur(d.name)} has been driving well`)}. Of course they noticed.` } } }); }
    else if (rt && rnd() < 0.035 && c.engineers?.length) { const k = (rnd() * c.engineers.length) | 0, e = c.engineers[k]; add(c, { scene: 'poach', prio: 50, title: `${rt.name} want your race engineer`, text: `${e.name} has been offered a job.`, def: 'let', data: { name: e.name, team: rt.name, cost: 0.3, eng: k }, options: [{ id: 'counter', label: 'Counter-offer ($0.3M)' }, { id: 'let', label: 'Let them talk' }], ctx: { who: { name: e.name, role: 'Race engineer', driver: false }, rival: { name: S.pri[rt.name].name, team: teamInfo(c, rt.name) }, cost: 0.3 } }); }
  }
  // a sponsor's patience: three targets missed running
  const met = new Set(rep.spMet || []);
  for (const s of Object.values(c.sponsors || {})) { if (!s) continue; S.spMiss[s.brand] = met.has(s.brand) ? 0 : (S.spMiss[s.brand] || 0) + 1; if (S.spMiss[s.brand] >= 3 && !open(c, 'sponsorCall') && !c.seasonDone && since(c, 'sponsorCall') >= 3) add(c, { scene: 'sponsorCall', prio: 61, title: `${s.brand} have had enough`, text: `${S.spMiss[s.brand]} targets missed in a row.`, def: 'cut', data: { brand: s.brand }, options: [{ id: 'promise', label: 'Promise points in two races' }, { id: 'cut', label: 'Offer 30% less' }, { id: 'walk', label: 'Let them walk' }], ctx: { sp: { name: s.brand, fee: s.base }, missed: S.spMiss[s.brand], ask: 'A points finish in the next two races' } }); }
  const sp = S.flags.spPromise; if (sp && sp.season === c.season) { const slot = Object.keys(c.sponsors || {}).find((k) => c.sponsors[k]?.brand === sp.brand); if (mine.some((m) => m.pts > 0)) { S.flags.spPromise = null; buzz(c, 0.02); c.addNews(`Points, as promised: ${sp.brand} stay.`); } else if (rep.round >= sp.by) { S.flags.spPromise = null; if (slot) c.sponsors[slot] = null; buzz(c, -0.04); fans(c, -3); cred(c, -4); c.addNews(`No points in two races: ${sp.brand} leave, and say why.`); } }
  // a leak from the factory while something is being built
  const building = (c.team.dev || []).find((x) => !x.re);
  if (!c.seasonDone && building && since(c, 'leak') >= 5 && rnd() < (S.mole ? 0.16 : 0.07)) {
    const order = c.constructors(), i = order.findIndex((t) => t.name === T), rt = order[Math.max(0, i - 1)]?.name !== T ? order[Math.max(0, i - 1)] : order[i + 1], gave = !!rt && (rt.levels?.[building.id] || 0) < (c.team.levels?.[building.id] || 0) + 1; if (gave) rt.levels[building.id] = (rt.levels[building.id] || 0) + 1;
    const mole = `${pick(['A.', 'R.', 'S.', 'L.', 'J.', 'M.'])} ${pick(['Marchetti', 'Collins', 'Bennett', 'Resta', 'Schmitz', 'Fallows', 'Okoro', 'Lindahl'])}`, what = upgradeName(building.id, building.level).toLowerCase();
    add(c, { scene: 'leak', prio: 57, title: 'Your drawings are in the press', text: `${cap1(what)}, in full, before it is on the car.${gave && rt ? ` ${rt.name} have a copy.` : ''}`, def: 'ignore', data: { mole, team: rt?.name, up: building.id, gave }, options: [{ id: 'probe', label: 'Investigate ($0.3M)' }, { id: 'ignore', label: 'Let it lie' }], ctx: { what: `the ${what}`, paper: JOURNALISTS[2].outlet, head: `${T}'s secret: the ${what}`, suspects: [{ name: mole, role: pick(['Aerodynamicist', 'Design engineer', 'CFD analyst']) }, { name: 'T. Whitaker', role: 'Model maker' }], lv: S.fac || undefined, cost: 0.3 } });
  }
  // the crew: a stop thrown away; a veteran's last season
  const bad = live.stops.filter((x) => x.slow && (x.time || 0) >= 4.6).sort((x, y) => y.time - x.time)[0];
  if (bad && c.crew?.members?.length && since(c, 'crewTalk') >= 4) { const m = c.crew.members.filter((x) => /^g/.test(x.role)).sort((x, y) => x.cons - y.cons)[0] || c.crew.members[0]; add(c, { scene: 'crewTalk', prio: 46, title: `${m.name} wants a word`, text: `The ${bad.time.toFixed(1)} s stop. He was on the gun.`, def: 'faith', data: { name: m.name, what: 'botch' }, options: [{ id: 'faith', label: 'Keep faith' }, { id: 'move', label: 'Move him to tyres' }, { id: 'drill', label: 'Extra practice for all' }], ctx: { who: { name: m.name, role: 'Wheel gun' }, what: 'botch', time: bad.time, track: trackName(rep.track) } }); }
  else if (!c.seasonDone && rep.round === c.rounds - 1 && c.crew?.members?.length && !S.flags[`ret.${c.season}`] && rnd() < 0.5) { S.flags[`ret.${c.season}`] = true; const m = pick(c.crew.members); add(c, { scene: 'crewTalk', prio: 34, title: `${m.name} is retiring`, text: 'His last race is the next one.', def: 'stop', data: { name: m.name, what: 'retire' }, options: [{ id: 'stop', label: 'Give him the last stop' }, { id: 'role', label: 'Offer him the crew centre ($0.2M)' }], ctx: { who: { name: m.name, role: 'Front jack' }, what: 'retire', years: 14 + ((rnd() * 12) | 0) } }); }
  // the board, as its patience goes
  const stage = c.board.conf < 15 ? 3 : c.board.conf < 30 ? 2 : c.board.conf < 45 ? 1 : 0;
  if (S.board.season !== c.season) S.board = { stage: 0, season: c.season };
  if (S.board.promise && rep.round >= S.board.promise.by) { const ok = c.team.points - S.board.promise.pts >= 6; c.board.conf = Math.round(clamp(c.board.conf + (ok ? 5 : -8), 0, 100)); c.addNews(ok ? 'The board notes the results you promised.' : 'The three races you asked the board for are up. Nothing has changed.'); S.board.promise = null; }
  if (stage > S.board.stage && !c.seasonDone && c.season > (c.since ?? c.season) - 1) { S.board.stage = stage; add(c, { scene: 'board', prio: stage >= 2 ? 88 : 74, title: stage === 3 ? 'The board: an ultimatum' : stage === 2 ? 'The board: a vote of confidence' : 'The chair wants a word', text: `P${c.posOf(T)} in the constructors'; the target was P${c.board.target}.`, def: 'own', due: c.round, ctx: { stage, chair: { name: chairOf(T) }, table: table(c), pos: c.posOf(T), target: c.board.target, lines: { fact: `${cap1(fact || `P${c.posOf(T)} in the constructors'`)}. We asked for P${c.board.target}.` } } }); if (stage >= 2) c.addNews(`${T}'s board gives its team principal "its full confidence".`); }
  // the press, when it has something to hold you to (never two races running)
  for (const cl of S.press.said) { if (cl.done || cl.season !== c.season) continue; const ago = rep.round - cl.round + 1; if (ago < 1) continue; if (cl.kind === 'points' && mine.some((m) => m.pts > 0)) { cl.done = true; cred(c, 4); } else if (cl.kind === 'podium' && podium) { cl.done = true; cred(c, 5); } else if (ago >= cl.n && cl.kind !== 'peace') { cl.done = true; cl.broken = true; cl.ago = ago; cred(c, -6); } else if (cl.kind === 'peace' && ago >= cl.n) { cl.done = true; cred(c, 3); } }
  if (!c.seasonDone && S.n - S.press.last >= 2) {
    const brk = S.press.said.find((x) => x.broken && !x.asked), nearest = Object.entries(S.pri).sort((x, y) => y[1].heat - x[1].heat)[0];
    const topic = brk ? 'broken' : S.feud.level >= 45 && since(c, 'feudRow') <= 2 ? 'feud' : (F?.firstWin || F?.firstPodium || (win && rnd() < 0.5)) ? 'win' : F && F.dry >= 2 ? 'slump' : nearest && nearest[1].heat >= 25 && rnd() < 0.5 ? 'rival' : null;
    if (topic) { if (brk) brk.asked = true; const j = topic === 'broken' || topic === 'slump' ? JOURNALISTS[0] : topic === 'win' ? JOURNALISTS[1] : JOURNALISTS[2], rv = nearest ? { name: nearest[1].name, team: nearest[0], said: STYLES[nearest[1].style].beat(T) } : null;
      const Q = pressQuestion({ team: T, topic, j, claim: brk ? { text: brk.text, track: brk.track, ago: brk.ago || 2 } : null, fact, a: sur(a?.name), b: sur(b?.name), rival: rv });
      add(c, { scene: 'press', prio: topic === 'broken' ? 63 : 52, title: `${j.name} has a question`, text: Q.q, def: 'nc', due: c.round, data: { rival: rv?.team }, options: Q.opts.map((o) => ({ id: o.id, label: o.label })), ctx: { j, q: Q.q, opts: Q.opts, track: trackName(rep.track) } }); S.press.last = S.n; }
  }
  // a facility finished: the factory walked through
  if (c.fac) { for (const [k, f] of Object.entries(c.fac)) { if (S.fac && f.level > (S.fac[k] ?? f.level)) add(c, { scene: 'factoryTour', prio: 43, title: `The factory: ${k === 'factory' ? 'manufacturing' : k === 'hosp' ? 'hospitality' : k === 'dil' ? 'the simulator' : 'the pit crew centre'} at level ${f.level}`, text: 'The work is finished. Walk round it.', ctx: { lv: Object.fromEntries(Object.entries(c.fac).map(([q, v]) => [q, v.level])), changed: k, td: { name: c.staff.td?.name } } }); } S.fac = Object.fromEntries(Object.entries(c.fac).map(([k, f]) => [k, f.level])); }
  // the documentary: half distance, with whatever the story is
  if (!c.seasonDone && c.rounds >= 4 && rep.round === Math.ceil(c.rounds / 2)) {
    const topic = S.feud.level >= 45 ? 'feud' : c.board.conf < 35 ? 'board' : c.posOf(T) <= c.board.target ? 'win' : F && F.dry >= 2 ? 'slump' : 'plain', rv = Object.entries(S.pri).sort((x, y) => y[1].heat - x[1].heat)[0], sad = [...my].sort((x, y) => (x.morale ?? 60) - (y.morale ?? 60))[0];
    S.ep++; add(c, { scene: 'documentary', prio: 73, heavy: true, title: `Pit Wall, episode ${S.ep}`, text: 'The cameras have been in the garage all season. This is what they made of it.', ctx: { ep: S.ep, name: episodeName(topic, `${c.season}|${T}`), next: trackName(c.track),
      heads: [sad && { ...dinfo(c, sad.id), role: T, team: teamInfo(c, T), driver: true, line: driverLine(traitFor(sad.id), 'doc') }, rv && { name: rv[1].name, role: `Team principal · ${rv[0]}`, team: teamInfo(c, rv[0]), line: c.posOf(rv[0]) < c.posOf(T) ? STYLES[rv[1].style].beat(T) : STYLES[rv[1].style].lost(T) }, { name: JOURNALISTS[0].name, role: JOURNALISTS[0].outlet, team: { name: 'Press', color: '#8a8f98' }, female: true, line: `${cap1(fact || `P${c.posOf(T)} at half distance`)}. ${c.posOf(T) <= c.board.target ? 'Nobody saw that coming. I certainly did not.' : `The board asked for P${c.board.target}. You can do the arithmetic.`}` }].filter(Boolean),
      vo: { who: JOURNALISTS[0].name, line: `${T}, ${c.season}. Half a season gone. P${c.posOf(T)}.` },
      you: { q: 'Half a season. How would you describe it?', opts: [{ id: 'calm', label: 'Measured', line: 'We are exactly where the work says we should be.', fx: { cred: 3 } }, { id: 'fire', label: 'Defiant', line: 'Write us off. Please. I enjoy it.', fx: { fans: 3, buzz: 0.02 } }, { id: 'raw', label: 'Honest', line: 'It has been harder than I let them see.', fx: { fans: 2, cred: 2 } }] } } });
  }
  // the feed and the rumour mill
  const near = c.constructors(), mi = near.findIndex((t) => t.name === T), nb = near[mi - 1] || near[mi + 1], np = nb && S.pri[nb.name];
  const posts = feedPosts({ team: T, mine, fans: S.fans, fact, win, podium, double, order: live.orders.find((o) => o.kind === 'swap' && o.obeyed !== false), refused: c.drivers[live.orders.find((o) => o.obeyed === false)?.did]?.name, row: S.feud.last === S.n, botch: bad?.time, rival: np && rnd() < 0.6 ? { name: np.name, team: nb.name, line: (nb.points > c.team.points ? STYLES[np.style].beat : STYLES[np.style].lost)(T) } : null }, `${c.season}|${rep.round}`);
  for (const p of posts.reverse()) S.feed.unshift({ ...p, season: c.season, round: rep.round }); if (S.feed.length > 50) S.feed.length = 50;
  S.rumours = S.rumours.filter((r) => r.until >= c.round && r.season === c.season);
  if (!c.seasonDone && rep.round >= Math.floor(c.rounds / 2) && rnd() < 0.4 && S.rumours.length < 3) {
    const flagged = my.find((d) => S.flags[`out.${d.id}`]), fa = c.freeAgents()[0], k = flagged && rnd() < 0.6 ? 'out' : fa && rnd() < 0.5 ? 'in' : 'boss';
    const r = k === 'out' ? { kind: 'out', did: flagged.id, name: flagged.name, to: S.flags[`out.${flagged.id}`], truth: true } : k === 'in' ? { kind: 'in', did: fa.id, name: fa.name, to: T, truth: false } : (() => { const t = pick(Object.keys(S.pri)); return { kind: 'boss', name: S.pri[t].name, to: t, truth: rnd() < 0.3 }; })();
    S.rumours.push({ ...r, id: `${c.season}.${rep.round}.${k}`, text: rumourText(r), season: c.season, until: c.round + 3 });
  }
  // the scene at the track, if the race earned one
  S.track = null;
  const top = rows.filter((r) => !r.car.retired).slice(0, 3), mineTop = top.find((r) => r.car.team === T), eng = c.engineers?.[0]?.name || 'Race engineer';
  const ts = (scene, ctx) => { S.track = { scene, ctx: { ...baseCtx(c), track: trackName(rep.track), round: rep.round, ...ctx } }; S.lastTrack = S.n; };
  const whoBest = [...mine].filter((m) => !m.dnf).sort((x, y) => x.pos - y.pos)[0], gaps = rows.slice(0, 5).map((r) => ({ pos: r.pos, name: (c.drivers[r.car.careerId]?.short) || '', gap: r.pos === 1 ? 'LEADER' : '', mine: r.car.team === T, col: c.teams[r.car.team]?.color }));
  if (win) ts('pitwallReact', { kind: 'win', who: whoBest.name, pos: 1, eng, gaps, lines: { b: `P1! ${sur(whoBest.name)} wins it! ${cap1(fact || 'yes')}!` } });
  else if (S.lastTrack >= S.n - 1) { /* (a scene after the last race too: not again, unless it is a win) */ }
  else if (mineTop && top.length === 3 && rnd() < 0.7) ts('cooldownRoom', { top: top.map((r) => ({ name: c.drivers[r.car.careerId]?.name || 'Driver', team: teamInfo(c, r.car.team) })), inc: { a: c.drivers[top[0].car.careerId]?.short, b: c.drivers[top[1].car.careerId]?.short, ca: c.teams[top[0].car.team]?.color, cb: c.teams[top[1].car.team]?.color, where: 'Turn 1', lap: 1 } });
  else if (podium) ts('pitwallReact', { kind: 'podium', who: whoBest.name, pos: whoBest.pos, eng, gaps });
  else if (double) ts('pitwallReact', { kind: 'double', who: mine[1]?.name, eng, lines: { a: `${sur(mine[1]?.name)} is out as well. ${cap1(fact || 'both cars')}.` } });
  else if (bad && bad.time >= 5) ts('pitwallReact', { kind: 'botch', time: bad.time, note: bad.note });
  else if (F && F.pointsNow && F.dryBefore >= 2 && whoBest) ts('pitwallReact', { kind: 'points', who: whoBest.name, pos: whoBest.pos, eng, lines: { b: `P${whoBest.pos}. ${cap1(fact)}. We will take every one of them.` } });
  // the season's end: its film, the audit, the letter
  if (c.seasonDone) storySeasonEnd(c);
}
/** before a race is run: what cannot wait for you any longer decides itself (the empty seat) */
export function storyBeforeRace(c) { const S = storyEnsure(c); for (const m of S.matters) if (!m.done && m.scene === 'seatFit') storyApply(c, m.key, {}); }
/** what the race kept for the story, taken (the live race's: empty lists if nothing happened) */
export function storyTakeLive(c) { const S = storyEnsure(c), L = S.live || { contacts: [], orders: [], crashes: [], stops: [], pens: [] }; S.live = null; return L; }
/** the scene to show at the track after the flag (once): { scene, ctx } | null */
export function storyTrackScene(c) { const S = storyEnsure(c), t = S.track; S.track = null; return t; }

function storySeasonEnd(c) {
  const S = c.story, T = c.myTeam, rev = c.review || {}, R = (c.results || []).filter((r) => r.season === c.season);
  // the moments of the year: the first win, the best day, the worst, the row, the fastest stop
  const M = [], bestOf = (r) => Math.min(99, ...r.mine.filter((m) => !m.dnf).map((m) => m.pos)), nm = (r) => sur(c.drivers[[...r.mine].filter((m) => !m.dnf).sort((x, y) => x.pos - y.pos)[0]?.id]?.name);
  const fw = R.find((r) => bestOf(r) === 1), fp = R.find((r) => bestOf(r) <= 3), dbl = R.find((r) => r.mine.length >= 2 && r.mine.every((m) => m.dnf)), best = [...R].sort((x, y) => bestOf(x) - bestOf(y))[0], row = S.matters.find((m) => m.scene === 'feudRow' && m.season === c.season), stop = [...(c.crew?.log || [])].filter((x) => x.season === c.season && !x.slow).sort((x, y) => x.time - y.time)[0];
  if (fw) M.push({ kind: 'win', round: fw.round, track: trackName(fw.track), text: `${nm(fw)} wins. The first of the year.` }); else if (fp) M.push({ kind: 'podium', round: fp.round, track: trackName(fp.track), text: `${nm(fp)} on the podium.` }); else if (best && bestOf(best) < 99) M.push({ kind: 'first', round: best.round, track: trackName(best.track), text: `P${bestOf(best)}: the best day of the season.` });
  if (row) M.push({ kind: 'row', round: row.round, track: row.ctx.track, text: row.result || 'The afternoon the garage went quiet.' });
  if (dbl) M.push({ kind: 'double', round: dbl.round, track: trackName(dbl.track), text: 'Both cars out. The long walk back.' });
  if (stop) M.push({ kind: 'stop', round: stop.round, track: trackName(c.calendar[stop.round - 1]), text: `${stop.time.toFixed(2)} seconds: the crew's fastest stop of the year.` });
  const lw = [...R].reverse().find((r) => bestOf(r) === 1 && r !== fw); if (lw) M.push({ kind: 'win', round: lw.round, track: trackName(lw.track), text: `${nm(lw)} again.` });
  add(c, { scene: 'seasonReview', prio: 100, force: true, heavy: true, title: `Season ${c.season}: the film`, text: `P${rev.pos} in the constructors'.`, due: 99, ctx: { moments: M.slice(0, 5), pos: rev.pos, target: rev.target, verdict: rev.verdict, champ: rev.champ, champTeam: rev.champTeam } });
  if (c.sacked) add(c, { scene: 'sacked', prio: 99, force: true, title: 'The board has made its decision', text: 'You are dismissed.', def: 'grace', due: 99, ctx: { chair: { name: chairOf(T) }, table: table(c), pos: rev.bpos ?? rev.pos, target: rev.target, seasons: c.season - (c.since ?? c.season) + 1 } });
  // the cost cap: close to it, and the auditors look
  const spent = c.spent(), cap = 70;
  if (!c.sacked && spent >= cap * 0.95 && rnd() < 0.3 + (spent - cap * 0.95) * 0.12) { const over = r1(Math.max(0.3, spent - cap + 0.4 + rnd() * 1.2)); add(c, { scene: 'audit', prio: 86, title: 'The cost cap: an audit', text: `The administration finds you $${over}M over.`, def: 'accept', due: 99, options: [{ id: 'accept', label: 'Accept the breach' }, { id: 'contest', label: 'Contest it ($0.6M)' }], ctx: { spent: r1(cap + over), cap, fine: r1(0.6 + over) } }); }
  // a driver who was let talk, and whose contract is up: gone to the team that asked
  for (const d of mineOf(c)) { const to = S.flags[`out.${d.id}`]; if (to && d.until != null && d.until <= c.season && c.teams[to]) { const t = c.teams[to], out = c.seatsOf(to).sort((x, y) => x.rating - y.rating)[0]; if (out) { t.seats = t.seats.filter((x) => x !== out.id); out.team = null; out.until = null; } c.team.seats = c.team.seats.filter((x) => x !== d.id); d.team = to; d.until = c.season + 2; t.seats.push(d.id); c.addNews(`${d.name} signs for ${to}. They asked in the summer; nobody stopped them.`); } delete S.flags[`out.${d.id}`]; }
}
/** a season begins: the launch (and what the winter settled) */
export function storySeasonStart(c) {
  const S = storyEnsure(c), last = c.history?.[c.history.length - 1], my = mineOf(c);
  if (S.flags.atrMul && S.flags.atrFor !== c.season) { delete S.flags.atrMul; delete S.flags.atrFor; }
  S.feud.level = Math.round(S.feud.level * 0.4); S.spMiss = {}; S.board = { stage: 0, season: c.season }; S.sub = null; S.n++;
  for (const k of Object.keys(S.riv)) { S.riv[k].heat = +(S.riv[k].heat * 0.5).toFixed(2); S.riv[k].n = 0; S.riv[k].named = false; }
  add(c, { scene: 'launch', prio: 100, force: true, heavy: true, title: `The ${c.season} car`, text: 'Launch night.', due: 99, ctx: { last: last && last.season === c.season - 1 ? { pos: last.pos, target: last.target } : null, target: c.board.target, fans: S.fans, lines: { d1: my[0] && driverLine(traitFor(my[0].id), 'launch'), d2: my[1] && driverLine(traitFor(my[1].id), 'launch') } } });
  c.save();
}
/** the tunnel time the auditors took (career/ManagerCar.js reads it), for one season */
export const atrMul = (c) => c.story?.flags?.atrMul || 1;
/** the title can be settled at this race: the film before it -> a matter-like { scene, ctx } | null */
export function storyPreRace(c) {
  storyEnsure(c); if (c.round !== c.rounds || c.seasonDone) return null;
  const D = c.drivers_().slice(0, 2), C = c.constructors().slice(0, 2), wins = (id) => (c.results || []).filter((r) => r.season === c.season && r.top[0] === id).length;
  const dOpen = D.length === 2 && D[0].points - D[1].points <= 25, cOpen = C.length === 2 && C[0].points - C[1].points <= 43;
  if (!dOpen && !cOpen) return null;
  const mineD = D.some((d) => d.team === c.myTeam), con = !dOpen || (!mineD && cOpen && C.some((t) => t.name === c.myTeam));
  const a = con ? { name: C[0].name, team: teamInfo(c, C[0].name), pts: C[0].points } : { name: D[0].name, team: teamInfo(c, D[0].team), pts: D[0].points, wins: wins(D[0].id) }, b = con ? { name: C[1].name, team: teamInfo(c, C[1].name), pts: C[1].points } : { name: D[1].name, team: teamInfo(c, D[1].team), pts: D[1].points, wins: wins(D[1].id) };
  return { scene: 'decider', ctx: { ...baseCtx(c), a, b, what: con ? 'constructors' : 'drivers', left: 1, rounds: c.rounds } };
}
/** signing or releasing a driver in the HQ: the scene for it -> a matter (played at once by the HQ) */
export function storySigning(c, did, o = {}) { storyEnsure(c); const d = c.drivers[did]; if (!d) return null; return add(c, { scene: 'signing', prio: 90, quiet: true, title: `${d.name} signs`, text: '', due: 99, data: { did }, ctx: { d: dinfo(c, did), years: Math.max(1, (d.until || c.season + 1) - c.season + 1), salary: d.salary, from: d.from === 'F2' ? 'F2' : o.from || null, lines: { d: driverLine(traitFor(did), 'launch') } } }); }
export function storyReleased(c, did) { storyEnsure(c); const d = c.drivers[did]; if (!d) return null; const R = (c.results || []).filter((r) => r.season === c.season); return add(c, { scene: 'released', prio: 90, quiet: true, title: `${d.name} is released`, text: '', due: 99, data: { did }, ctx: { d: dinfo(c, did), why: `${d.points} point${d.points === 1 ? '' : 's'} in ${R.length} race${R.length === 1 ? '' : 's'}.` } }); }
/** a protest lodged from the inbox: its hearing is now a scene to show */
export function storyLodge(c, key) { const m = storyEnsure(c).matters.find((x) => x.key === key); if (m) { m.pre = false; m.options = null; m.title = 'The stewards hear your protest'; } return m; }
/** a rumour answered: 'deny' | 'fuel' -> a line */
export function storyRumour(c, id, what) {
  const S = storyEnsure(c), r = S.rumours.find((x) => x.id === id); if (!r || r.answered) return '';
  r.answered = what;
  if (what === 'deny') { if (r.truth) { cred(c, -6); return 'You deny it. It is true, and people will remember that you said it was not.'; } cred(c, 2); if (r.did) mor(c, r.did, 2); return 'You deny it. It dies by the weekend.'; }
  buzz(c, 0.02); if (r.kind === 'in' && r.did) { const d = c.drivers[r.did]; if (d) d.salary = r1((d.salary || 1) * 1.08); } if (r.kind === 'boss') heat(c, r.to, 8); return 'You let it be known there is something in it. The paddock talks of nothing else.';
}
/**
 * What the team has won under you, for the trophy room: a cup for each win (the latest nine), plates for podiums, a
 * board for each season's place, the fastest stop, the year's points. -> items (ui/CineSets.trophyRoom)
 */
export function trophiesOf(c) {
  const T = c.myTeam, out = [], R = (c.results || []), nm = (id) => c.drivers[id]?.name || 'A driver';
  for (const r of R) for (const m of r.mine) if (!m.dnf && m.pos <= 3) out.push({ kind: m.pos === 1 ? 'cup' : 'plate', tint: m.pos === 1 ? 'gold' : m.pos === 2 ? 'silver' : 'bronze', kicker: `${r.season} · Round ${r.round}`, title: `${trackName(r.track)} · P${m.pos}`, text: `${nm(m.id)}\n${m.pos === 1 ? 'Race winner' : m.pos === 2 ? 'Second place' : 'Third place'}`, w: (4 - m.pos) * 100 + r.season });
  const cups = out.sort((x, y) => y.w - x.w).slice(0, 9);
  for (const h of c.history || []) cups.push({ kind: 'board', kicker: `Season ${h.season}`, title: `P${h.pos} in the constructors'`, text: `The board asked for P${h.target}.\nChampion: ${h.champ || '-'}\nConstructors' champions: ${h.champTeam || '-'}`, rows: [{ a: h.pos, b: T, c: `TARGET P${h.target}`, hi: true }] });
  const stop = [...(c.crew?.log || [])].filter((x) => !x.slow).sort((x, y) => x.time - y.time)[0];
  if (stop) cups.push({ kind: 'board', kicker: 'The pit crew', title: `${stop.time.toFixed(2)} seconds`, text: `The fastest stop on record.\nSeason ${stop.season}, round ${stop.round}.`, rows: [{ a: '', b: 'FASTEST STOP', c: `${stop.time.toFixed(2)} s`, hi: true }] });
  const top = Object.values(c.drivers).filter((d) => d.team === T).sort((x, y) => (y.wins || 0) - (x.wins || 0) || y.points - x.points)[0];
  if (top) cups.push({ kind: 'helmet', color: top.helmet, kicker: 'The driver', title: top.name, text: `${top.wins || 0} win${top.wins === 1 ? '' : 's'}, ${top.podiums || 0} podium${top.podiums === 1 ? '' : 's'}, ${top.starts || 0} start${top.starts === 1 ? '' : 's'}.` });
  return cups.slice(0, 14);
}
/** the rivalries worth a name: [{ a, b, heat, n, last }] */
export const rivalriesOf = (c) => Object.entries(storyEnsure(c).riv).filter(([, r]) => r.heat >= 2).map(([k, r]) => { const [a, b] = k.split('|'); return { a: c.drivers[a]?.name, b: c.drivers[b]?.name, heat: r.heat, n: r.n, last: r.last }; }).sort((x, y) => y.heat - x.heat).slice(0, 6);
