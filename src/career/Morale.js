// Morale: how every driver in the paddock feels going into a weekend - you included. One number, 0..100 (Low, Shaky,
// Steady, Good, Flying), moved by the results against what the car promised, wins and podiums, beating or being beaten
// by the team-mate, retirements, a contract running out, and by the life around the racing (the week between rounds,
// the press, a partner). Under it sit four traits - focus, racecraft, confidence and composure - each the morale plus
// a short-lived offset that a single moment pushes (a pole is a shot of confidence, a scuffle on the grid costs
// composure) and that fades over the next rounds, while the morale itself drifts back towards where a driver in that
// car would expect to be. The traits reach the car the way a driver's head does, gently: a confident AI driver carries
// a touch more speed and brakes a little later, a distracted one makes more mistakes and is slow off the line, one
// with racecraft gives exactly the room it must and follows closer, a tense one cracks under pressure and leans on a
// rival. Your own car feels it too, never enough to decide a race: a little grip and braking bite from confidence,
// kinder tyres from focus, a closer follow in dirty air from racecraft, a wider pit-box window from composure. Every
// change keeps its reason (moodWhy), so the hub can tell you why you feel the way you do.

// ---- the record -----------------------------------------------------------------------------------------------------
export const MOOD_STATS = ['focus', 'racecraft', 'confidence', 'composure'];
export const MOOD_NAMES = { focus: 'Focus', racecraft: 'Racecraft', confidence: 'Confidence', composure: 'Composure' };
const START = 60, PLAYER_START = 65;   // morale a new record starts with (yours a little higher: it's your team)
const OFF_MAX = 40, WHY_CAP = 14;      // a trait's offset either way; the reasons kept (newest first)
const STD_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const TRACK_NAME = { silverstone: 'Silverstone', lasvegas: 'Las Vegas', montreal: 'Montreal' };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const num = (v, f) => (typeof v === 'number' && isFinite(v) ? v : f);
const last = (name) => String(name || '').split(' ').pop();
/** the circuit of the race being run (c.round is always the race about to be run, or just run before round++) */
const trackOf = (c) => { const id = c?.calendar?.[(c.round || 1) - 1]; return TRACK_NAME[id] || id || ''; };
const at = (c) => { const w = trackOf(c); return w ? ` at ${w}` : ''; };

/** a driver record's morale fields, filled in where missing (a new driver, an old save) - safe to call again -> d */
export function moraleInit(d, isPlayer = false) {
  if (!d || typeof d !== 'object') return d;
  d.morale = num(d.morale, null) == null ? (isPlayer ? PLAYER_START : START) : clamp(Math.round(d.morale), 0, 100);
  const o = d.moodOff && typeof d.moodOff === 'object' && !Array.isArray(d.moodOff) ? d.moodOff : (d.moodOff = {});
  for (const k of MOOD_STATS) o[k] = clamp(Math.round(num(o[k], 0)), -OFF_MAX, OFF_MAX) || 0;
  if (!Array.isArray(d.moodWhy)) d.moodWhy = [];
  return d;
}
/** a driver's state -> { morale, focus, racecraft, confidence, composure }, whole numbers 0..100 (a trait = morale + offset) */
export function moodOf(d) {
  const m = clamp(Math.round(num(d?.morale, d ? START : 50)), 0, 100), o = d?.moodOff || {}, out = { morale: m };
  for (const k of MOOD_STATS) out[k] = clamp(Math.round(m + num(o[k], 0)), 0, 100);
  return out;
}
/** -> 'Low' | 'Shaky' | 'Steady' | 'Good' | 'Flying' */
export function moraleLabel(v) { v = num(v, 50); return v <= 20 ? 'Low' : v <= 40 ? 'Shaky' : v < 60 ? 'Steady' : v < 80 ? 'Good' : 'Flying'; }
/** for CSS -> 'low' (Low, Shaky) | 'mid' (Steady) | 'high' (Good, Flying) */
export function moraleBand(v) { v = num(v, 50); return v <= 40 ? 'low' : v < 60 ? 'mid' : 'high'; }

// ---- moving it ------------------------------------------------------------------------------------------------------
/** the reason kept for the hub: the same reason twice in one round folds into one line (a race's two penalties) */
const note = (c, d, k, dv, why) => {
  const w = d.moodWhy, top = w[0], season = c.season ?? null, round = c.round ?? null;
  if (top && top.season === season && top.round === round && top.k === k && top.why === why) { top.d += dv; if (!top.d) w.shift(); return; }
  w.unshift({ season, round, k, d: dv, why });
  if (w.length > WHY_CAP) w.length = WHY_CAP;
};
/**
 * Move a driver's morale (stat null: d.morale, 0..100) or one trait's offset (stat: a MOOD_STATS key, -40..40) by
 * delta, keeping why for the hub. Unknown or dead drivers are left alone. -> the change actually applied (whole)
 */
export function shiftMorale(c, did, delta, why = '', stat = null) {
  const d = c?.drivers?.[did]; if (!d || d.alive === false || !num(delta, 0)) return 0;
  moraleInit(d, did === c.playerId);
  const k = MOOD_STATS.includes(stat) ? stat : null;
  let v0, v;
  if (k) { v0 = d.moodOff[k]; v = clamp(Math.round(v0 + delta), -OFF_MAX, OFF_MAX); d.moodOff[k] = v; }
  else { v0 = d.morale; v = clamp(Math.round(v0 + delta), 0, 100); d.morale = v; }
  const dv = v - v0;
  if (dv && why) note(c, d, k || 'morale', dv, String(why));
  return dv;
}

// ---- the weekend: qualifying and the race ---------------------------------------------------------------------------
// (a retirement in an accident or off the road - the driver's own doing, or part of it - against a car that broke)
const ACCIDENT = /accident|suspension damage|beached|stuck|gravel|stopped on track/i;
const crashed = (car) => !!(car.wreck || car.injured || ACCIDENT.test(car.retireReason || ''));
const blamed = (r) => [...(r.car.ppLog || []), ...(r.ppLog || [])].some((x) => /collision/i.test(x?.reason || '')) || !!r.car.blamed;
/** a car caught up in an accident that hurt or killed its driver: nobody's morale is scored against it */
const grave = (car) => !!(car?.injured || car?.fate);
/**
 * After a race, driven or simulated (rows: the classification { pos, car: { careerId, team, retired, retireReason,
 * ppLog? }, pts? }; exp: { careerId: the position the car and driver could expect }): every driver's morale from the
 * result against that expectation, a win, a podium, the season's first points, a retirement, and the team-mate.
 * Call it before the round moves on. -> { careerId: change in morale } (for the report)
 */
export function moraleFromRace(c, rows, exp) {
  const out = {}, w = at(c), byTeam = {};
  for (const r of rows || []) { const t = r?.car?.team; if (t) (byTeam[t] = byTeam[t] || []).push(r); }
  for (const r of rows || []) {
    const car = r?.car, did = car?.careerId, d = c?.drivers?.[did]; if (!d || d.alive === false || car.fate) continue;
    moraleInit(d, did === c.playerId);
    const m0 = d.morale, pos = r.pos, ret = !!car.retired, e = num(typeof exp === 'function' ? exp(did) : exp?.[did], null);
    const mech = ret && !crashed(car);
    if (!ret) {
      // (the result against what the car and the driver promised: the biggest part of how a weekend feels)
      if (e != null) shiftMorale(c, did, clamp((e - pos) * 1.6, -10, 10), `P${pos}${w}, expected P${e}`);
      if (pos === 1) { shiftMorale(c, did, 8, `Won${w}`); shiftMorale(c, did, 6, `Won${w}`, 'confidence'); }
      else if (pos <= 3) shiftMorale(c, did, 4, `On the podium${w}`);
      const got = num(r.pts, STD_POINTS[pos - 1] || 0);
      if (got > 0) {
        // (the first points of the season: d.points already holds today's when this runs after the scoring)
        if (d.scoredSeason !== c.season && num(d.points, 0) <= got + 0.01) shiftMorale(c, did, 3, 'First points of the season');
        d.scoredSeason = c.season;
      }
    } else if (!mech) {
      shiftMorale(c, did, -8, `Out of the race in an accident${w}`, 'confidence');
      if (blamed(r)) shiftMorale(c, did, -2, 'Blamed by the stewards for a collision');
    } else shiftMorale(c, did, -4, `Retired${w}: ${String(car.retireReason || 'a mechanical problem').toLowerCase()}`);
    // the team-mate, the first driver anyone measures you against (not when a car broke, nor beside an accident that hurt)
    const mate = (byTeam[car.team] || []).find((o) => o !== r && o.car.careerId !== did);
    if (mate && !mech && !(mate.car.retired && !crashed(mate.car)) && !grave(car) && !grave(mate.car) && !(ret && mate.car.retired)) {
      const beat = !ret && (mate.car.retired || pos < mate.pos), who = last(c.drivers[mate.car.careerId]?.name || mate.car.name);
      shiftMorale(c, did, beat ? 3 : -2, beat ? `Beat ${who}` : `Beaten by ${who}`, 'racecraft');
    }
    out[did] = d.morale - m0;
  }
  return out;
}
/**
 * After qualifying (ids: career ids, fastest first): pole is a shot of confidence, the top three a lift, the last
 * three a knock, and being out-qualified by the team-mate stings. -> { careerId: change in morale }
 */
export function moraleFromQuali(c, ids) {
  const list = (ids || []).filter((id) => id && c?.drivers?.[id]), n = list.length, w = at(c), out = {}, teamOf = {}, first = {};
  // (the team each car raced for: a stand-in has no team of its own on the record)
  try { for (const e of (typeof c.entries === 'function' ? c.entries() : [])) teamOf[e.careerId] = e.team; } catch (e) { /* (a mock or a broken grid: the records' teams will do) */ }
  list.forEach((did, i) => {
    const p = i + 1, d = moraleInit(c.drivers[did], did === c.playerId), m0 = d.morale;
    if (p === 1) { shiftMorale(c, did, 6, `Pole position${w}`, 'confidence'); shiftMorale(c, did, 3, `Pole position${w}`); }
    else if (p <= 3) shiftMorale(c, did, 2, `Qualified P${p}${w}`);
    else if (n >= 8 && p > n - 3) shiftMorale(c, did, -2, `Qualified P${p} of ${n}${w}`);
    const t = teamOf[did] ?? d.team;
    if (t) {
      if (first[t] == null) first[t] = did;
      else shiftMorale(c, did, -2, `Out-qualified by ${last(c.drivers[first[t]]?.name)}`, 'confidence');
    }
    out[did] = d.morale - m0;
  });
  return out;
}

// ---- between rounds -------------------------------------------------------------------------------------------------
/** where a driver's morale settles: a little higher in a top-three car, lower in the last three (none yet: level) */
const baselines = (c) => {
  const ts = Object.values(c?.teams || {}).sort((a, b) => (b.points || 0) - (a.points || 0)), n = ts.length, any = ts.some((t) => (t.points || 0) > 0);
  const out = {}; ts.forEach((t, i) => { out[t.name] = !any ? START : i < 3 ? 62 : i >= n - 3 ? 56 : START; });
  return out;
};
/**
 * Once a round, after the race (the round has moved on): every trait's offset fades 40% towards nothing, morale
 * drifts 20% back towards the driver's baseline (25% from above 75: a high doesn't last on its own), and an AI driver
 * whose contract ends this season starts to worry about next year once half of it has gone.
 */
export function moraleRoundTick(c) {
  const base = baselines(c), R = c?.rounds || 6, half = (c?.round || 1) - 1 >= R / 2;
  for (const d of Object.values(c?.drivers || {})) {
    if (!d || d.alive === false) continue;
    moraleInit(d, d.id === c.playerId);
    for (const k of MOOD_STATS) d.moodOff[k] = Math.trunc(d.moodOff[k] * 0.6) || 0;
    // (rounded towards the baseline, so a driver one point off it gets there rather than sitting a point away for ever)
    const b = base[d.team] ?? START, v = d.morale, nv = v + (b - v) * (v > 75 ? 0.25 : 0.2);
    d.morale = clamp(b > v ? Math.ceil(nv) : Math.floor(nv), 0, 100);
    if (half && d.id !== c.playerId && d.team && d.contract && d.contract.until <= c.season) shiftMorale(c, d.id, -2, 'No contract yet for next season');
  }
}
/** the winter (an extra for nextSeason): morale halfway back to 60, the traits' offsets gone */
export function moraleNewSeason(c) {
  for (const d of Object.values(c?.drivers || {})) {
    if (!d || d.alive === false) continue;
    moraleInit(d, d.id === c.playerId);
    const v = d.morale, nv = v + (START - v) * 0.5;
    d.morale = START > v ? Math.ceil(nv) : Math.floor(nv);
    for (const k of MOOD_STATS) d.moodOff[k] = 0;
  }
}

// ---- in the car: FORM -----------------------------------------------------------------------------------------------
// The traits as the race code reads them, every frame (so worked out once, before the race). The AI's numbers are
// kept tiny on purpose: the whole field's rating spread is only ~0.5% of corner speed, so a confident driver gains
// about a tenth of that; the player's are gentler still (a quarter of a per cent of grip at the extremes).
const LOW = { focus: 'DISTRACTED', racecraft: 'HESITANT', confidence: 'SHAKY', composure: 'TENSE' };
const HIGH = { focus: 'FOCUSED', racecraft: 'SHARP', confidence: 'CONFIDENT', composure: 'COOL' };
const ORDER = ['confidence', 'composure', 'focus', 'racecraft'];   // (a tie: the trait the car feels first)
/** the HUD word: FLYING when everything is high, else the trait most out of line (a low one before a high one) */
const formLabel = (mo, s) => {
  if (mo >= 80 && ORDER.every((k) => s[k] >= 72)) return 'FLYING';
  let lo = null, lv = 0, hi = null, hv = 0;
  for (const k of ORDER) {
    // (low: 42 or under, or 10 below the driver's own morale; high: 72 or over, or 10 above it from a fair level)
    const off = s[k] - mo, l = Math.max(43 - s[k], -9 - off), h = Math.max(s[k] - 71, s[k] >= 58 ? off - 9 : 0);
    if (l > lv) { lo = k; lv = l; }
    if (h > hv) { hi = k; hv = h; }
  }
  return lo ? LOW[lo] : hi ? HIGH[hi] : 'STEADY';
};
/**
 * Race modifiers from a driver's state (m: moodOf(d); null or missing traits: neutral, 50) -> FORM, every field always
 * present: pace, brake, err, react, width, gap, defend, pressure, flare, jump (the AI); grip, pBrake, wear, pitWin,
 * qte, follow, respect (the player); label (the HUD word: FLYING, CONFIDENT, FOCUSED, SHARP, COOL, STEADY, SHAKY,
 * TENSE, DISTRACTED, HESITANT)
 */
export function formOf(m) {
  const mo = clamp(num(m?.morale, 50), 0, 100), s = {};
  for (const k of MOOD_STATS) s[k] = clamp(num(m?.[k], m ? mo : 50), 0, 100);
  const fo = s.focus, rc = s.racecraft, cf = s.confidence, cp = s.composure;
  return {
    pace: 1 + (cf - 50) / 50 * 0.0012,                                              // AI corner speed (±0.12%)
    brake: 1 + (cf - 50) / 50 * 0.004,                                              // AI braking commitment
    err: fo < 50 ? 1.35 - fo / 50 * 0.35 : 1 - (fo - 50) / 50 * 0.28,              // AI mistake rate (1.35 .. 0.72)
    react: (50 - fo) / 50 * 0.035,                                                  // s added to the AI's start reaction
    width: 1 - (rc - 50) / 50 * 0.06,                                               // AI side room
    gap: 1 - (rc - 50) / 50 * 0.08,                                                 // AI following gap
    defend: (rc - 50) / 50 * 0.08,                                                  // added to the AI's defend chance
    pressure: 1 + (50 - cp) / 50 * 0.45,                                            // AI pressure term
    flare: 1 + (50 - cp) / 50 * 0.5,                                                // AI feud flare-ups
    jump: 1 + (50 - cp) / 50 * 0.8,                                                 // AI jump-start chance
    grip: 1 + (cf - 50) / 50 * 0.0025,                                              // your grip (±0.25%)
    pBrake: 1 + (cf - 50) / 50 * 0.006,                                             // your brake force
    wear: 1 - (fo - 50) / 50 * 0.03,                                                // your tyre wear (smooth inputs)
    pitWin: 1 + (cp - 50) / 50 * 0.25,                                              // your pit-box timing window
    qte: 1 + (cp - 50) / 50 * 0.25,                                                 // your scuffle prompt windows
    follow: 1 - (rc - 50) / 50 * 0.10,                                              // your downforce lost in dirty air
    respect: 1 + (rc - 50) / 50 * 0.08,                                             // room AI cars alongside you leave
    label: formLabel(mo, s),
  };
}
/** FORM with nothing in it: every multiplier 1, every addition 0 (quick races' player, a missing record) */
export function neutralForm() { return formOf(null); }
/** the rating offset the hub's simulated weekends add (m: moodOf(d)) -> about ±0.035 at the extremes */
export function moraleSimBonus(m) {
  if (!m) return 0;
  return (clamp(num(m.confidence, 50), 0, 100) - 50) / 50 * 0.025 + (clamp(num(m.focus, 50), 0, 100) - 50) / 50 * 0.01;
}

// ---- words ----------------------------------------------------------------------------------------------------------
const LINES = {
  FLYING: [`You're flying at the moment. Same again today: trust the car and let it come to you.`, `Everything's clicking for you right now. Keep it tidy and the result looks after itself.`],
  CONFIDENT: [`You're braking deep and it's working. Keep it, just pick your moments in traffic.`, `Confidence is high. Use it on the brakes, but don't overcook turn one.`],
  FOCUSED: [`You look switched on today. Smooth inputs, look after the rears.`, `Head's in the right place. Hit your marks and the tyres will last.`],
  SHARP: [`Your racecraft's sharp at the moment. Be patient, the moves will come to you.`, `You're reading the battles well. Stay close in the dirty air and the chance will come.`],
  COOL: [`You're calm in there, and that's worth a lot when it gets busy.`, `Nice and relaxed. Hit the box marks and let the others get flustered.`],
  STEADY: [`All normal on our side. Do your race, one lap at a time.`, `Nothing to change. A clean start and build from there.`],
  SHAKY: [`Last weekend's behind us. Build up to the braking points, don't chase it on lap one.`, `Take the first few laps to find your feet. The pace is in the car.`],
  TENSE: [`Breathe. Don't let anyone wind you up out there, race your own race.`, `Keep a cool head today. If someone leans on you, let it go and get it back later.`],
  DISTRACTED: [`Leave everything else in the garage now. Head in the car, eyes up.`, `Lots going on off the track this week. In the car it's just you and the next corner.`],
  HESITANT: [`Be decisive in the fights today. If the gap is there, commit to it.`, `Don't second-guess the moves. Pick one and go.`],
};
/** one short engineer's sentence about the driver's state (m: moodOf(d)); the same state always gets the same line */
export function moraleLine(m) {
  const pool = LINES[formOf(m).label] || LINES.STEADY;
  const h = Math.round(num(m?.focus, 0) + 3 * num(m?.racecraft, 0) + 7 * num(m?.confidence, 0) + 11 * num(m?.composure, 0));
  return pool[Math.abs(h) % pool.length];
}
