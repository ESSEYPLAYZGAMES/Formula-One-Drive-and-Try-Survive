// The lifetime stats book: everything you have played on this device, every mode - a quick race, a time trial, free
// practice, qualifying, a career's races - apart from any career (its own localStorage key: abandoning or erasing a
// career leaves it as it is). Each session is counted once, as it ends (main.js endSession -> playSession: every
// session of every mode ends there, a quit or a restart too): its mode's sessions, your time at the wheel, the laps and
// the distance you drove, your overtakes and crashes, and for a race run to the flag the start and the result; the best
// laps you drove at each circuit, a time trial's above all. And the time the game has been open in front of you (the
// page visible), counted while it runs. A career keeps its own, deeper book of its own races (career/Stats.js); this
// one is the whole of your play. Nothing here throws: a session that cannot be read is left out.
import { raceStatsOf, dnfCause } from '../career/Stats.js';

export const PLAY_KEY = 'f1sim-stats-v1';
/** the modes the book keeps apart, in the order the screen shows them: [key, name] */
export const PLAY_MODES = [['career', 'Career'], ['quick', 'Quick race'], ['tt', 'Time trial'], ['practice', 'Practice']];
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const r1 = (v) => Math.round(v * 10) / 10;
const r3 = (v) => Math.round(v * 1000) / 1000;
/** one mode's figures: sessions (quali: the qualifying sessions among them), seconds at the wheel, races run to the flag and their results, laps, km */
export const playBook = () => ({ sessions: 0, quali: 0, sec: 0, races: 0, wins: 0, podiums: 0, fin: 0, dnf: 0, laps: 0, km: 0, ovt: 0, led: 0, crashes: 0 });
const blank = () => ({ v: 1, since: new Date().toISOString().slice(0, 10), game: 0, modes: Object.fromEntries(PLAY_MODES.map(([k]) => [k, playBook()])), tracks: {}, last: null });

/** the book as stored (a missing or broken one: a fresh one, its figures brought to the current shape) */
export function playLoad() {
  let S = null;
  try { const s = localStorage.getItem(PLAY_KEY); S = s ? JSON.parse(s) : null; } catch (e) { S = null; }
  if (!S || typeof S !== 'object' || Array.isArray(S)) S = blank();
  if (!S.modes || typeof S.modes !== 'object') S.modes = {};
  for (const [k] of PLAY_MODES) { const b = S.modes[k] && typeof S.modes[k] === 'object' ? S.modes[k] : {}; const d = playBook(); for (const f of Object.keys(d)) b[f] = num(b[f]); S.modes[k] = b; }
  if (!S.tracks || typeof S.tracks !== 'object') S.tracks = {};
  S.game = num(S.game); if (typeof S.since !== 'string') S.since = blank().since;
  return S;
}
const playSave = (S) => { try { localStorage.setItem(PLAY_KEY, JSON.stringify(S)); } catch (e) { /* (a private window, a full storage: the book lasts the session) */ } };
/** every mode added up -> a book */
export function playTotal(S) {
  const t = playBook();
  for (const [k] of PLAY_MODES) for (const f of Object.keys(t)) t[f] += num(S.modes?.[k]?.[f]);
  t.km = r3(t.km); t.sec = r1(t.sec);
  return t;
}

/**
 * A session over (main.js endSession, the director still up): counted once (d._played). o: { career (a career
 * weekend), mode (the weekend's: 'quick' | 'champ' | 'tt'), track, len (the circuit, m), crashG (the crash camera's
 * threshold) }. The mode it goes to: free practice is Practice whatever the weekend; a time trial is Time trial; a
 * career weekend's qualifying and race are Career; anything else Quick race. Your time at the wheel runs to the
 * hand-over (main.js watchSession's c.handAt: your laps done, the flag, a retirement) or the session's end; the laps
 * are the ones you drove. Nothing driven (a session simulated, a race watched): nothing counted. -> what was added | null
 */
export function playSession(d, o = {}) {
  try {
    if (!d || d._played) return null;
    const cars = Array.isArray(d.cars) ? d.cars : [], p = (d.player && cars.includes(d.player) ? d.player : null) || cars.find((c) => c && c.isPlayer) || null;
    if (!p) return null;
    d._played = true;
    const mode = d.practice ? 'practice' : d.mode === 'tt' || o.mode === 'tt' ? 'tt' : o.career ? 'career' : 'quick';
    const L = num(o.len, num(d.track?.length)), hand = num(p.handAt, NaN), end = isFinite(hand) ? hand : num(d.time), T = Array.isArray(p.lapTimes) ? p.lapTimes : [];
    const crash = num(p.peakG) >= num(o.crashG, 30) || !!p._flew || !!p.wreck || (!!p.retired && dnfCause(p) === 'acc');
    const add = { mode, sec: 0, laps: 0, km: 0, ovt: 0, led: 0, crash, race: false, pos: null, dnf: false, best: null };
    let kind = 'tt';
    if (d.mode === 'race') {
      kind = 'race';
      const t0 = num(d.world?.raceStart, NaN), RS = isFinite(t0) ? raceStatsOf(d, null, { len: L, crashG: o.crashG }) : null, M = RS?.me || null;
      add.sec = isFinite(t0) ? Math.max(0, end - t0) : 0; add.laps = M ? num(M.laps) : num(p.lap); add.km = M ? num(M.km) : (add.laps * L) / 1000;
      add.ovt = num(p.overtakes); add.led = num(M?.led); add.best = num(M?.best) > 20 ? M.best : null;
      // (a race run to the flag - or stopped and classified: a start, and where you were)
      if (d.done && isFinite(t0)) { const rows = d.classification?.() || [], row = rows.find((r) => r.car === p); if (row) { add.race = true; add.pos = row.pos; add.dnf = !!p.retired; } }
    } else {
      // (qualifying, practice, a time trial: your timed laps - the ones before the hand-over; the simulation's are not yours)
      kind = d.practice ? 'practice' : d.mode === 'quali' ? 'quali' : 'tt';
      const mine = (isFinite(hand) ? T.slice(0, num(p.handLaps, T.length)) : T).filter((t) => isFinite(t) && t > 20);
      add.sec = Math.max(0, end); add.laps = mine.length; add.km = (mine.length * L) / 1000; add.best = mine.length ? r3(Math.min(...mine)) : null;
    }
    if (add.sec < 1 && !add.laps) return null;
    // (read again just before writing: another tab may have counted something since)
    const S = playLoad(), B = S.modes[mode];
    B.sessions++; B.sec = r1(B.sec + add.sec); B.laps += add.laps; B.km = r3(B.km + add.km); B.ovt += add.ovt; B.led += add.led;
    if (kind === 'quali') B.quali++;
    if (crash) B.crashes++;
    if (add.race) { B.races++; if (add.dnf) B.dnf++; else { B.fin++; if (add.pos === 1) B.wins++; if (add.pos <= 3) B.podiums++; } }
    // (the circuit: the best lap you drove there in each kind of session, the laps and the distance)
    const tid = o.track || d.track?.def?.id || null;
    if (tid) {
      const C = S.tracks[tid] && typeof S.tracks[tid] === 'object' ? S.tracks[tid] : (S.tracks[tid] = { laps: 0, km: 0, races: 0, wins: 0 });
      C.laps = num(C.laps) + add.laps; C.km = r3(num(C.km) + add.km);
      if (add.race) { C.races = num(C.races) + 1; if (!add.dnf && add.pos === 1) C.wins = num(C.wins) + 1; if (!add.dnf && (!C.bestPos || add.pos < C.bestPos)) C.bestPos = add.pos; }
      if (add.best && (!C[kind] || add.best < C[kind])) { C[kind] = add.best; C[`${kind}At`] = new Date().toISOString().slice(0, 10); }
    }
    S.last = { mode, kind, track: tid, at: new Date().toISOString() };
    playSave(S); label();
    return add;
  } catch (e) { console.warn('PlayStats: a session could not be counted', e); return null; }
}

// ---- the time in the game: counted while the page is open and in front of you -----------------------------------------
/** seconds -> '12h 05m', '38 min' */
export const playDur = (s) => { const m = Math.round(num(s) / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m} min`; };
const clock = { last: 0, on: false };
/**
 * The time since the last tick into the book (a gap over a minute - a sleep, a frozen tab - is not counted, nor a
 * tick while the page is hidden). leaving: the page is being hidden or closed just now - it was in front of you up to here.
 */
export function playTick(leaving = false) {
  if (typeof performance === 'undefined') return;
  const now = performance.now(), dt = (now - clock.last) / 1000; clock.last = now;
  if (!(dt > 0 && dt <= 60) || (!leaving && typeof document !== 'undefined' && document.visibilityState === 'hidden')) return;
  const S = playLoad(); S.game = r1(S.game + dt); playSave(S); label();
}
/** the menu's STATS button: its line under the name (your time at the wheel, every mode) */
function label() {
  if (typeof document === 'undefined') return;
  const el = document.querySelector('#stats-open span'); if (!el) return;
  const t = playTotal(playLoad());
  el.textContent = t.sec >= 60 ? `${playDur(t.sec)} at the wheel` : 'Every mode, every lap';
}
if (typeof window !== 'undefined' && typeof document !== 'undefined' && !clock.on) {
  clock.on = true; clock.last = performance.now();
  setInterval(() => playTick(), 15000);
  // (leaving or hiding the page: the time up to now, before the ticks stop; coming back: the clock starts again from here)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') playTick(true); else clock.last = performance.now(); });
  addEventListener('pagehide', () => playTick(true));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', label); else label();
}
