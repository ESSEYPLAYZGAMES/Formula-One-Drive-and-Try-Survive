// The drink, for the affection build (WP-D): how much everyone in the room has had, what it does to them, and - at the
// pool club, where no PartyPlay runs the bar - what it does to you. ui/Affection.js (WP-A) reads it: a merry or tipsy
// star is bolder and says yes more readily; from 7.5 units nobody is romanced, either way; from 8.5 it is water, a seat
// and a car home. The model is realistic and quiet: UK units (10 ml of alcohol), absorbed over 45 game-minutes, the
// liver's unit an hour (PartyPlay's own). The stars pace themselves by their own traits (drama, free) and most stop
// short of the line; a few have a big night after 02:00, and four in ten go on to water after 02:30. Real F1 drivers
// never get past a glass; anyone under the drinking age, and anyone working (security, the bar, the DJ), stays at 0.
// What you see of it: a nod on the beat once someone is merry, a sideways sway about their own facing axis once tipsy,
// a stagger now and then once drunk - on standing people only, never on anyone a link, a shot, a game, a scuffle or a
// dance holds, and none of it under reduced motion.
// Built for the Intel UHD laptop: the model runs at 0.2 Hz on the game clock, the tiers at 1 Hz, the cues on numbers
// kept per person (nothing allocated per frame); no geometry, no lights, no materials; one small chip at the pool.
//
// =====================================================================================================================
// AFFECTIONDRINK CONTRACT (WP-D, published 2026-10-11) - what ui/Affection.js (WP-A) codes against
// =====================================================================================================================
//
//   import { AffectionDrink, AFF_TIER, AFF_HAZY, AFF_PAST } from './AffectionDrink.js';
//
//   const D = new AffectionDrink(ev, launch)
//     ev: the Evening (ui/Hangout.js); launch: its o (career/Party.js's party launch, or a hangout's). Makes nothing in
//     3D or the page yet; safe to construct in the Evening's constructor (after this.party). window.__affDrink = D.
//
//   steps() -> [fn]           behind the cover (Hangout _build, after the party's steps): setup - everyone's opening
//                             level, the pool's tier chip, the pool's camera sway. update() runs setup itself if not.
//   update(dt, owned)         once a frame, AFTER Hangout._people (Affection.update, right after _partyUpdate).
//                             owned(g) -> true for anyone a link, a shot, a game, a scuffle or a Dance holds: no cues on
//                             them (any cue already on them comes off first). Built in as well: ev.game's g / foe, and
//                             PartyPlay's scuffle foe. The model ticks at 0.2 Hz, tiers at 1 Hz, cues every frame.
//   level(g) -> units         g: a guest (ev.gs or ev.cast) or its cid. 0 for anyone who does not drink.
//   tier(g) -> 0..4           0 sober (< 3), 1 merry (3+), 2 tipsy (5.5+), 3 drunk (8.5+), 4 past the line (12+).
//   hazy(g) -> bool           level >= 7.5 (AFF_HAZY): no romance either way, water offered.
//   past(g) -> bool           level >= 8.5 (AFF_PAST, tier 3+): care only.
//   word(g) -> string         'sober' | 'merry' | 'tipsy' | 'had a lot' (7.5+) | 'very drunk' (8.5+): the menu's word.
//   drinks(g) -> bool         an adult who is not working (an under-age guest, security, the bar, the DJ: false).
//   me() -> { level, tier, pending, peak, drinks, under, real, age, own }  (one object, refreshed in place)
//                             PartyPlay's pp.level / pp.tier when ev.party exists (own: false), else this module's own
//                             model (own: true - the pool, or a party venue opened without PartyPlay; at the 7 evening
//                             venues nothing alcoholic is served, so it stays at 0). age: years, null when unknown.
//   served(label) -> { kind, units, line } | null   in Hangout._ordered(item): a pool order by its POOL_ORDERS label
//                             (a party venue's by keyword) into your own model. line: what to toast in place of
//                             'Ordered: ...' ('Water, sir.' at 12 units; soft drinks only under the city's age), null
//                             for Hangout's own. units 0 for anything without alcohol. null when PartyPlay runs the bar.
//   water(g)                  'Get her some water': no more drinks for 60 game-minutes (the level never drops for it).
//   onRound(cids)             a round sent over to these: +1.5 each (a real driver takes a soft drink). Rounds PartyPlay
//                             sends are seen anyway (R.party.rounds.sent, the recipients' g.fx.round: everyone who drinks
//                             within 3 m of them).
//   onCheers(g)               a toast: +0.3 (once a person; g.cheers turning true is seen anyway).
//   carryOut() -> { clock, levels: { cid: units }, seed }   for res.aff (R.party.aff): clock in hours past midnight as 24+.
//   carryIn(aff)              act 2 (launch.carry.aff): the levels back, less the liver's unit an hour over the gap
//                             between aff.clock and now; seed keeps the night's big nights and water-switchers.
//   chip() -> element | null  the pool's tier chip (SOBER / MERRY / TIPSY / DRUNK, n drinks) at the left edge, where
//                             PartyPlay's glass sits at a party. Built once by setup; null where PartyPlay has the glass.
//                             Rewritten only when the tier or the count changes; hidden while a game or moment is up.
//   info() -> [{ cid, name, who, level, pend, tier, cap, big, water, dry, adult }]   tests
//   dispose()                 every cue off, the chip and its CSS gone, the camera's sway unhooked.
//
// What it writes: g.n.tipsy = tier (the talk may read it). On standing people only while a cue runs: person.group
// rotation.x (the sway, order 'YXZ' meanwhile - put back when it stops) and position x/z (a stagger of 0.05 m, eased
// back); head.rotation.y/z additions on top of what _people set this frame. At the pool (no PartyPlay) it wraps
// ev._camera for the tier >= 2 camera sway (PartyPlay's own amplitudes), and puts it back on dispose. Never R, R.party,
// g.fx, discs, spots or anything of the career.
// Who drinks what (mechanics section 9): stars at a club or the pool start at 1.0 + 2.5r + drama and take 1.5-2 units
// every (35 - 15 drama - 10 free) game-minutes +-30%, to 7.4 (big night - 15% of those with drama >= 0.4 or free >= 0.5
// - to 10 after 02:00); after 02:30 four in ten switch to water. At the team party 0.5 + 1.5r, every 45 min, to 6.
// Fictional drivers as the stars x0.8, to 7 (a big night 10); real drivers 0.5, a unit an hour, never past 2.5; reps,
// agents and the press to 4.5, the influencer 5, the boss and the engineer 3.5; the antagonist 9. Nobody drinks at the
// evening venues (their menus are soft) or on a quiet evening.
// Test switches: window.__affDrunk = { cid: units } (or { '*': units }) holds those levels - a real driver still at
// most 2.5, anyone under age or working still 0. At the pool window.__partyDrunk (PartyPlay's) starts you that far in.
// =====================================================================================================================
import { POOL_ORDERS } from './PartyPool.js';
import { ageOk, ageOf } from '../career/Party.js';

/** PartyPlay's tiers: the units in the blood at which you are merry, tipsy, drunk, past the line */
export const AFF_TIER = [0, 3, 5.5, 8.5, 12];
/** from here nobody is romanced, either way (water is offered) */
export const AFF_HAZY = 7.5;
/** from here (very drunk: slurring, unsteady) it is care only */
export const AFF_PAST = 8.5;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ss = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const num = (v, d) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
/** a test switch on window -> its value or null */
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
/** the clock as the night reads it: after midnight as 24+ */
const h24 = (h) => (h < 12 ? h + 24 : h);
const tierOf = (L) => (L >= AFF_TIER[4] ? 4 : L >= AFF_TIER[3] ? 3 : L >= AFF_TIER[2] ? 2 : L >= AFF_TIER[1] ? 1 : 0);
const wordOf = (L) => (L >= AFF_PAST ? 'very drunk' : L >= AFF_HAZY ? 'had a lot' : L >= AFF_TIER[2] ? 'tipsy' : L >= AFF_TIER[1] ? 'merry' : 'sober');
const hash = (s) => { let h = 2166136261; const t = String(s); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
/** a number 0..1 of its own for this string (the same every time: act 2 sees the same night) */
const rnd = (s) => (hash(s) % 1000003) / 1000003;
const ELIM = 1;          // the liver: a unit an hour
const ABS = 0.75;        // a drink is in the blood 45 game-minutes after it was poured
const TICK = 5;          // the model's step, real seconds (0.2 Hz)
const TIER_NAME = ['SOBER', 'MERRY', 'TIPSY', 'DRUNK', 'DRUNK'];
const FILL = [0, 0.38, 0.62, 0.86, 1];
/** the legal age to drink, by the race's city (Nevada 21, the UK 18) */
const LEGAL = { lasvegas: 21, silverstone: 18 };
/** a drink by its name, where the venue's list has no units of its own (a party venue opened without PartyPlay) */
const GUESS = [[/water/i, 'water', 0], [/lemonade|soft drink|cola|juice|mocktail|soda/i, 'soft', 0], [/champagne|flute|prosecco|bottle/i, 'champagne', 1.5], [/margarita|cocktail|martini|spritz|negroni/i, 'cocktail', 2],
  [/\bshots?\b|tequila/i, 'shot', 1.7], [/beer|lager|pint/i, 'beer', 2], [/wine/i, 'wine', 2.3], [/whisky|whiskey|gin\b|vodka|\brum\b/i, 'spirit', 1.5]];
const STAFF = new Set(['security', 'bartender', 'dj']);

const CSS = `
#hangout .affd-chip { position: absolute; left: 16px; top: 50%; transform: translate(-6px, -50%); width: 72px; box-sizing: border-box; padding: 9px 4px 8px; background: rgba(8,10,16,.58); border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 5px; pointer-events: none; opacity: 0; transition: opacity .22s, transform .22s; }
#hangout .affd-chip.in { opacity: 1; transform: translate(0, -50%); }
#hangout .affd-chip svg { width: 26px; height: 32px; display: block; }
#hangout .affd-chip svg .o { fill: none; stroke: rgba(255,255,255,.72); stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
#hangout .affd-chip svg .l { fill: #f2c25a; }
#hangout .affd-chip b { font: 900 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #e8ebf0; text-shadow: 0 1px 3px #000; }
#hangout .affd-chip b.t1 { color: #6cd08f; } #hangout .affd-chip b.t2 { color: #f5c04a; } #hangout .affd-chip b.t3 { color: #ff7a6a; }
#hangout .affd-chip small { font: 600 10.5px/1.3 'Segoe UI', Arial, sans-serif; color: #c9ced8; text-align: center; white-space: nowrap; text-shadow: 0 1px 3px #000; }
`;

// =====================================================================================================================
// AffectionDrink
// =====================================================================================================================
/** how much everyone has had tonight, and what it shows (see the contract above) */
export class AffectionDrink {
  constructor(ev, launch) {
    this.ev = ev; this.o = launch || ev?.o || {}; this.c = ev?.c || this.o.c || null; this.on = true; this.set = false;
    this.L = []; this.by = new Map(); this.acc = 0; this.acc1 = 0; this.ft = -1; this.lastT = null; this.rSent = 0; this.carry = null;
    this.ctx = 'none'; this.pool = false; this.own = false; this.clubby = false; this.bpm = 124;
    // (your own drink, where PartyPlay does not keep it: PartyPlay's model - serves still being absorbed, what is done, what the liver has taken)
    this.serves = []; this.absDone = 0; this.elim = 0; this.mLevel = 0; this.mPend = 0; this.mPeak = 0; this.mTier = 0; this.mLast = null; this.mDrinks = 0; this.mWater = 0;
    this._me = { level: 0, tier: 0, pending: 0, peak: 0, drinks: 0, under: false, real: false, age: null, own: true };
    this.dom = null; this.dB = null; this.dS = null; this.dL = null; this.chipKey = -1; this.chipIn = false; this.cam0 = null;
    // (the night's own seed: who has a big night, who goes on to water - the same in act 2)
    const c = this.c; this.seed = c ? `${c.season ?? 0}|${c.round ?? 0}|${c.playerId ?? ''}` : `s${Math.floor(Math.random() * 1e9)}`;
    try { window.__affDrink = this; } catch (_) { /* (no window) */ }
  }

  // ---- the opening ------------------------------------------------------------------------------------------------------
  steps() { return [() => this.setup()]; }
  /** where we are and who is here: the context, your own age and bar, everyone's opening level, the pool's chip and sway */
  setup() {
    if (this.set || !this.on) return; this.set = true;
    const ev = this.ev, o = this.o, me = o.me || {}, c = this.c, P = ev.P || {}, V = ev.V || {};
    this.pool = !!POOL_ORDERS[ev.vid];
    this.ctx = ev.quiet ? 'none' : ev.party ? (ev.party.team ? 'team' : 'club') : this.pool ? 'club' : ev.isParty ? (ev.vid === 'teamparty' ? 'team' : 'club') : 'none';
    // (your own bar: the pool, or a party venue opened as a plain evening - PartyPlay keeps it everywhere else)
    this.own = !ev.party && !ev.quiet && (this.pool || !!ev.isParty);
    this.clubby = ev.occ === 'club' || !!V.club || !!P.club; this.bpm = num(+V.beat?.bpm, num(+P.bpm, 124));
    this.track = [o.track, P.where, ev.trackId].find((k) => typeof k === 'string' && LEGAL[k]) || (this.pool ? 'lasvegas' : ev.trackId || 'lasvegas');
    // (you: a real driver keeps to his line, as at the party; your age on the night - null when the career cannot say)
    const d = c?.drivers?.[c?.playerId];
    this.meReal = typeof me.real === 'boolean' ? me.real : !!d && ['F1', 'Reserve', 'F2'].includes(d.from);
    let age = num(me.age, null); if (age == null && c && d) { try { age = ageOf(c, c.playerId, this.track); } catch (_) { age = null; } }
    this.meAge = age;
    let under = typeof me.soft === 'boolean' ? me.soft : false;
    if (typeof me.soft !== 'boolean' && c && d) { try { under = !ageOk(c, c.playerId, this.track); } catch (_) { under = false; } }
    this.meUnder = under;
    const now = this._clock(); this.lastT = now; this.mLast = now;
    const fd = flag('__partyDrunk'); if (this.own && fd && !this.meUnder) { const u = typeof fd === 'number' ? fd : 9; this.absDone = u; this.mPeak = u; }
    this.rSent = num(+ev.R?.party?.rounds?.sent, 0);
    this._scan(); this._meTick(); this._sync();
    if (this.own) { this.chip(); this._hookCam(); }
  }
  _clock() { const h = +this.ev?.clock; return Number.isFinite(h) ? h : 0; }
  /** everyone not yet known: the guests, then the cast (security, the DJ, the antagonist) */
  _scan() {
    const ev = this.ev;
    for (const g of ev.gs || []) if (g && !this.by.has(g.cid || g.name)) this._reg(g, true);
    const C = ev.cast || {}; for (const k of Object.keys(C)) { const g = C[k]; if (g && (g.cid || g.name) && !this.by.has(g.cid || g.name) && !(ev.gs || []).includes(g)) this._reg(g, false); }
  }
  /** who a person is, for the drink: star, fdriver, rdriver, work, infl, team (boss, engineer), staff, ant */
  _who(g) {
    if (g.kind === 'celeb' || g.kind === 'star') return 'star';
    if (g.kind === 'driver') return (g.real ?? g.n?.real ?? true) === false ? 'fdriver' : 'rdriver';   // (an unknown driver counts as real)
    const r = g.role || g.n?.role || '';
    if (r === 'antagonist') return 'ant'; if (STAFF.has(r)) return 'staff'; if (r === 'infl') return 'infl'; if (r === 'boss' || r === 'eng') return 'team';
    return 'work';
  }
  /** below the city's drinking age: the launch's soft, the talk's under, else a driver's birthday on the race's date */
  _under(g) {
    if (g.soft === true || g.n?.under === true) return true;
    if (g.soft === false && this.ev.isParty) return false;
    if (g.kind === 'driver' && g.id && this.c) { try { return !ageOk(this.c, g.id, this.track); } catch (_) { return false; } }
    return false;
  }
  _reg(g, inGs) {
    const cid = g.cid || g.name; if (!cid) return null;
    const S = { g, cid, inGs: !!inGs, who: this._who(g), seed: `${this.seed}|${cid}`, adult: false, drinks: false, level: 0, pend: 0, start: 0, every: 999, size: 0, cap: 0, capBig: 0, big: false, water: false, fixed: null,
      next: 0, dry: -1, cheered: !!g.cheers, fxr: num(+g.fx?.round, 0), tier: 0, stand: false, carried: false, ph: num(g.ph, 0) + 1.3, bo: 0,
      rollOn: false, rx0: 0, rxW: 0, ord0: 'XYZ', stagOn: false, ox: 0, oz: 0, pxW: 0, pzW: 0, stA: -1, stT: 0, stDir: 1 };
    S.bo = 0.12 * rnd(S.seed + '|beat'); S.stT = 8 + 24 * rnd(S.seed + '|stag');
    S.adult = S.who !== 'staff' && !this._under(g);
    this._plan(S, g);
    S.drinks = S.adult && this.ctx !== 'none' && S.cap > 0;
    const now = this._clock();
    S.level = S.drinks ? Math.min(S.start, Math.max(S.cap, S.fixed ?? 0)) : 0;
    S.next = now + (S.every / 60) * (0.25 + 0.75 * Math.random());
    this.L.push(S); this.by.set(cid, S);
    if (this.carry) this._carryTo(S);
    S.tier = tierOf(this._lv(S)); S.stand = this._stands(g);
    return S;
  }
  /** a person's night (mechanics section 9): opening level, minutes between drinks, a drink's size, how far they go */
  _plan(S, g) {
    const team = this.ctx === 'team', r = rnd(S.seed + '|start'), T = g.C?.traits || {};
    switch (S.who) {
      case 'star': case 'fdriver': {
        const fd = S.who === 'fdriver', k = fd ? 0.8 : 1;
        // (a driver's own drama is his: the career keeps no trait for it)
        const dr = fd ? 0.15 + 0.4 * rnd(S.seed + '|drama') : clamp(num(T.drama, 0.3), 0, 1), fr = fd ? 0 : clamp(num(T.free, 0), 0, 1);
        S.start = (team ? 0.5 + 1.5 * r : 1.0 + 2.5 * r + dr) * k;
        S.every = (team ? 45 : Math.max(12, 35 - 15 * dr - 10 * fr)) / k; S.size = 1.75;
        S.cap = team ? 6 : fd ? 7 : 7.4; S.capBig = 10;
        S.big = !team && (dr >= 0.4 || fr >= 0.5) && rnd(S.seed + '|big') < 0.15;
        S.water = !team && !S.big && rnd(S.seed + '|water') < 0.4;
        break;
      }
      case 'rdriver': S.start = 0.5; S.every = 90; S.size = 1.5; S.cap = 2.5; break;
      case 'work': S.start = 0.3 + (team ? 1.0 : 1.5) * r; S.every = team ? 50 : 40; S.size = 1.6; S.cap = 4.5; break;
      case 'infl': S.start = 0.3 + 1.5 * r; S.every = 40; S.size = 1.6; S.cap = 5; break;
      case 'team': S.start = 0.3 + r; S.every = team ? 55 : 50; S.size = 1.6; S.cap = 3.5; break;
      case 'ant': S.start = 9; S.fixed = 9; S.cap = 9; break;
      default: break;
    }
  }
  _cap(S, H) { return S.big && H >= 26 ? S.capBig : S.cap; }
  /** a level as it stands, the test switch over it - and the content line under it: a real driver at most a glass, under age or working nothing */
  _lv(S) {
    if (!S.adult) return 0;
    let v = S.drinks ? S.level : 0; const o = flag('__affDrunk');
    if (o && typeof o === 'object') { const x = o[S.cid] ?? o['*']; if (typeof x === 'number' && Number.isFinite(x)) v = x; }
    if (S.who === 'rdriver') v = Math.min(v, 2.5);
    return Math.max(0, v);
  }
  _get(g) { if (g == null) return null; const k = typeof g === 'string' ? g : g.cid || g.name; let S = this.by.get(k) || null; if (!S && typeof g === 'object' && this.set && k) S = this._reg(g, (this.ev.gs || []).includes(g)); return S; }
  /** units into the glass, up to how far this person goes tonight */
  _add(S, u) {
    if (!S || !S.drinks || S.fixed != null || !(u > 0)) return 0;
    const room = this._cap(S, h24(this._clock())) - S.level - S.pend; if (room <= 0.05) return 0;
    const a = Math.min(u, room); S.pend += a; return a;
  }

  // ---- reading it ---------------------------------------------------------------------------------------------------
  level(g) { const S = this._get(g); return S ? this._lv(S) : 0; }
  tier(g) { return tierOf(this.level(g)); }
  hazy(g) { return this.level(g) >= AFF_HAZY; }
  past(g) { return this.level(g) >= AFF_PAST; }
  word(g) { return wordOf(this.level(g)); }
  drinks(g) { const S = this._get(g); return !!S && S.adult; }
  me() {
    const M = this._me, pp = this.ev?.party;
    if (pp) {
      M.level = num(pp.level, 0); M.tier = num(pp.tier, 0); M.pending = num(pp.pending, 0); M.peak = num(pp.peak, 0);
      let n = 0; const D = pp.Rp?.drinks; if (Array.isArray(D)) for (let i = 0; i < D.length; i++) if (D[i]?.units > 0) n++;
      M.drinks = n; M.under = !!pp.underage; M.real = !!pp.realMe; M.own = false;
    } else { M.level = this.mLevel; M.tier = this.mTier; M.pending = this.mPend; M.peak = this.mPeak; M.drinks = this.mDrinks; M.under = !!this.meUnder; M.real = !!this.meReal; M.own = true; }
    M.age = this.meAge ?? null; return M;
  }

  // ---- what happens to it ---------------------------------------------------------------------------------------------
  /** Hangout._ordered(item): your own order, by the pool's list (a party venue's drinks by name) -> { kind, units, line } | null */
  served(label) {
    const ev = this.ev; if (!this.on || ev?.party) return null;
    if (!this.set) this.setup();
    const s = String(label || ''), L = POOL_ORDERS[ev.vid] || null, D = L ? L.find((x) => x.label === s) : null;
    let kind = D?.kind || 'soft', units = D ? num(+D.units, 0) : 0;
    if (!D && ev.isParty) { const G = GUESS.find((x) => x[0].test(s)); if (G) { kind = G[1]; units = G[2]; } }
    if (!this.own || units <= 0) return { kind, units: 0, line: null };
    if (this.meUnder) return { kind: 'soft', units: 0, line: `Soft drinks only for you here: you are under ${LEGAL[this.track] || 21} in ${this.track === 'silverstone' ? 'England' : 'Nevada'}.` };
    this._meTick();
    // (the bar's own line: past 12 units it is water; a real driver keeps to his, as at the party)
    if (this.mLevel + this.mPend >= AFF_TIER[4]) { this.mWater++; return { kind: 'water', units: 0, line: 'Water, sir.' }; }
    if (this.meReal && this.mLevel + this.mPend >= AFF_TIER[3] - 0.7) { this.mWater++; return { kind: 'water', units: 0, line: 'You know where your line is. Water from here.' }; }
    this.serves.push({ units, at: this._clock(), ab: ABS }); this.mDrinks++;
    this._meTick(); this._chipSync();
    return { kind, units, line: null };
  }
  water(g) { const S = this._get(g); if (!S) return false; S.dry = this._clock() + 1; if (S.next < S.dry) S.next = S.dry; return true; }
  onRound(cids) { for (const k of [].concat(cids || [])) { const S = this._get(k); if (S) this._add(S, S.who === 'rdriver' ? 0 : 1.5); } }
  onCheers(g) { const S = this._get(g); if (!S || S.cheered) return; S.cheered = true; this._add(S, 0.3); }
  /** rounds and toasts, as PartyPlay and Hangout record them */
  _events() {
    const L = this.L;
    for (let i = 0; i < L.length; i++) { const S = L[i]; if (S.g.cheers && !S.cheered) { S.cheered = true; this._add(S, 0.3); } }
    const Rr = this.ev.R?.party?.rounds; if (!Rr) return;
    const sent = num(+Rr.sent, 0); if (sent <= this.rSent) return; this.rSent = sent;
    const rec = [];
    for (let i = 0; i < L.length; i++) { const S = L[i], r = num(+S.g.fx?.round, 0); if (r > S.fxr) { S.fxr = r; rec.push(S); } }
    const at = rec.length ? rec.map((S) => S.g.person?.group?.position).filter(Boolean) : [this.ev.pos].filter(Boolean);
    for (let i = 0; i < L.length; i++) {
      const S = L[i], q = S.g.person?.group?.position; if (S.g.gone) continue;
      if (rec.includes(S) || (q && at.some((a) => Math.hypot(a.x - q.x, a.z - q.z) < 3))) this._add(S, S.who === 'rdriver' ? 0 : 1.5);
    }
  }

  // ---- the night going on -------------------------------------------------------------------------------------------------
  update(dt, owned) {
    if (!this.on) return; const ev = this.ev; if (!ev || !ev.ready || ev.closing) return;
    if (!this.set) this.setup();
    this.acc += dt; this.acc1 += dt;
    if (this.acc >= TICK) { this.acc = 0; this.acc1 = 0; this._tick(); }
    else if (this.acc1 >= 1) { this.acc1 = 0; this._sync(); }
    this._cues(dt, owned);
    if (this.dom) { const want = !(ev.game || ev.moment); if (want !== this.chipIn) { this.chipIn = want; this.dom.classList.toggle('in', want); } }
  }
  /** 0.2 Hz: the drinking - absorbed, eliminated, the next one poured (or not) */
  _tick() {
    const now = this._clock(), dH = clamp(now - (this.lastT ?? now), 0, 3); this.lastT = now;
    this._scan(); this._events();
    const pp = this.ev.party, shut = pp && pp.lastCall != null && now >= pp.lastCall, L = this.L;
    for (let i = 0; i < L.length; i++) {
      const S = L[i];
      if (!S.drinks) { S.level = 0; S.pend = 0; continue; }
      if (S.fixed != null) { S.level = S.fixed; continue; }
      if (S.pend > 0) { const a = Math.min(S.pend, dH * Math.max(2, S.pend / ABS)); S.pend -= a; S.level += a; }
      S.level = Math.max(0, S.level - ELIM * dH);
      // (every drink due since the last step, at most a few - the clock can run fast; far behind, the pace starts afresh)
      for (let k = 0; k < 4 && now >= S.next; k++) {
        const at = S.next; S.next = at + (S.every / 60) * (0.7 + 0.6 * Math.random());
        // (the bar shut, a water on the go, or one of those who go on to water after half past two)
        if (!(shut || at < S.dry || (S.water && h24(at) >= 26.5) || S.g.gone)) this._add(S, S.size * (0.86 + 0.28 * Math.random()));
      }
      if (now >= S.next) S.next = now + (S.every / 60) * (0.3 + 0.7 * Math.random());
    }
    this._sync();
  }
  /** 1 Hz: your own level, everyone's tier (the talk's g.n.tipsy), who is standing, the chip */
  _sync() {
    if (this.own) this._meTick();
    const L = this.L;
    for (let i = 0; i < L.length; i++) { const S = L[i], t = tierOf(this._lv(S)); S.tier = t; S.stand = this._stands(S.g); const n = S.g.n; if (n && n.tipsy !== t) n.tipsy = t; }
    this._chipSync();
  }
  /** your own drink (PartyPlay's model, at the pool): what is in, what is still coming through, what the liver has taken */
  _meTick() {
    const now = this._clock(); if (this.mLast == null) this.mLast = now; const dH = Math.max(0, now - this.mLast); this.mLast = now;
    let abs = this.absDone, pend = 0;
    for (let i = this.serves.length - 1; i >= 0; i--) { const s = this.serves[i], f = clamp((now - s.at) / s.ab, 0, 1); if (f >= 1) { this.absDone += s.units; abs += s.units; this.serves.splice(i, 1); } else { abs += s.units * f; pend += s.units * (1 - f); } }
    this.elim += Math.min(Math.max(0, abs - this.elim), ELIM * dH);
    this.mLevel = Math.max(0, abs - this.elim); this.mPend = pend; if (this.mLevel > this.mPeak) this.mPeak = this.mLevel;
    let t = tierOf(this.mLevel); if (this.meReal && t > 2) t = 2; this.mTier = t;
  }

  // ---- what it looks like -----------------------------------------------------------------------------------------------
  /** standing on their own feet (a seat, a lean on the bar, a booth: no sway, no stagger) */
  _stands(g) {
    const sp = g.spot; if (sp && (sp.pose === 'sit' || sp.pose === 'lean' || sp.seat || sp.lean)) return false;
    return !/sit|lean|booth|perch|stool/i.test(String(g.pose || g.opts?.pose || ''));
  }
  _owned(g, owned) {
    if (owned) { try { if (owned(g)) return true; } catch (_) { return true; } }
    const G = this.ev.game; if (G && (G.g === g || G.foe === g || (G.foe && G.foe.cid === g.cid) || G.her === g)) return true;
    const B = this.ev.party?.brawl; if (B && B.foe && B.foe.cid === g.cid && !B.done) return true;
    return false;
  }
  /** every frame, after _people: the nod (merry), the sway (tipsy), the stagger (drunk) - nothing allocated */
  _cues(dt, owned) {
    const ev = this.ev; if (ev.t === this.ft) return; this.ft = ev.t;
    const L = this.L, t = ev.t || 0, T0 = ev.talk, B = ev.party?.beat, beats = B ? B.t : this.clubby ? (t * this.bpm) / 60 : -1;
    for (let i = 0; i < L.length; i++) {
      const S = L[i], g = S.g, p = g.person;
      if (!S.inGs || !p || g.gone || REDUCED || S.tier < 1 || !p.group.visible || this._owned(g, owned)) { if (S.rollOn || S.stagOn) this._off(S); continue; }
      const gp = p.group, talking = !!T0 && T0.g === g, h = p.head;
      // (the head: on top of what _people set this frame - a nod on the beat where there is music, else a slower one)
      if (h) {
        const b = beats >= 0 ? Math.abs(Math.sin(Math.PI * (beats + S.bo))) - 0.637 : 0.5 * Math.sin(2.1 * t + S.ph);
        let nz = 0, ny = 0;
        if (S.tier === 1) nz = 0.035 * b;
        else if (S.tier === 2) { nz = 0.045 * b; ny = 0.035 * Math.sin(0.8 * t + S.ph); }
        else { nz = 0.03 * b - 0.08; ny = 0.06 * Math.sin(0.55 * t + S.ph); }
        if (talking) { nz *= 0.4; ny *= 0.4; }
        h.rotation.z += nz; h.rotation.y += ny;
      }
      // (the sway: a roll about her own facing axis - the group's order 'YXZ' puts rotation.x on the body's own forward axis)
      if (S.stand && S.tier >= 2) {
        if (!S.rollOn) { S.rx0 = gp.rotation.x; S.ord0 = gp.rotation.order; S.rollOn = true; }
        else if (gp.rotation.x !== S.rxW) S.rx0 = gp.rotation.x;
        if (gp.rotation.order !== 'YXZ') gp.rotation.order = 'YXZ';
        const a = S.tier >= 3 ? 0.045 : 0.02;
        gp.rotation.x = S.rx0 + a * Math.sin(1.3 * t + S.ph) + (S.tier >= 3 ? 0.012 * Math.sin(2.3 * t + 1.7 * S.ph) : 0);
        S.rxW = gp.rotation.x;
      } else if (S.rollOn) this._rollOff(S);
      // (the stagger: every 20-40 s once drunk, a step to the side and back - never in the middle of talking to you)
      if (S.stand && S.tier >= 3) {
        if (S.stA < 0) { S.stT -= dt; if (S.stT <= 0 && !talking) { S.stA = 0; S.stDir = Math.random() < 0.5 ? -1 : 1; S.stT = 20 + 20 * Math.random(); } }
        let k = 0;
        if (S.stA >= 0) { const a = (S.stA += dt); k = a < 0.35 ? ss(a / 0.35) : a < 0.85 ? 1 : 1 - ss((a - 0.85) / 1.6); if (a >= 2.45) { S.stA = -1; k = 0; } }
        const th = gp.rotation.y, d = 0.05 * S.stDir * k;
        this._shift(S, gp.position, Math.sin(th) * d, Math.cos(th) * d);
      } else if (S.stagOn) this._stagOff(S);
    }
  }
  /** a stagger's offset, applied as a change from the last one (anyone else's placement in between is left alone) */
  _shift(S, P, wx, wz) {
    if (S.stagOn && (P.x !== S.pxW || P.z !== S.pzW)) { S.ox = 0; S.oz = 0; }
    P.x += wx - S.ox; P.z += wz - S.oz; S.ox = wx; S.oz = wz; S.pxW = P.x; S.pzW = P.z; S.stagOn = true;
  }
  _stagOff(S) {
    const P = S.g.person?.group?.position;
    if (P && P.x === S.pxW && P.z === S.pzW) { P.x -= S.ox; P.z -= S.oz; }
    S.ox = 0; S.oz = 0; S.stagOn = false; S.stA = -1;
  }
  _rollOff(S) {
    const R = S.g.person?.group?.rotation;
    if (R) { if (R.x === S.rxW) R.x = S.rx0; if (R.x === 0 && R.order !== S.ord0) R.order = S.ord0; }
    S.rollOn = false;
  }
  _off(S) { if (S.rollOn) this._rollOff(S); if (S.stagOn) this._stagOff(S); }

  // ---- the pool: your glass, and the room swimming a little once you are tipsy ----------------------------------------------
  chip() {
    if (!this.own || !this.on) return null;
    if (this.dom) return this.dom;
    const ui = this.ev.$?.('.hg-ui'); if (!ui) return null;
    try { if (!document.getElementById('affd-css')) { const st = document.createElement('style'); st.id = 'affd-css'; st.textContent = CSS; document.head.appendChild(st); } } catch (_) { /* (no head) */ }
    const d = document.createElement('div'); d.className = 'affd-chip';
    d.innerHTML = '<svg viewBox="0 0 26 32" aria-hidden="true"><polygon class="l" points="13,16 13,16 13,16"/><path class="o" d="M3 4 H23 L13 16 Z M13 16 V27 M8 28 H18"/></svg><b>SOBER</b><small>No drinks</small>';
    ui.appendChild(d); this.dom = d; this.dB = d.querySelector('b'); this.dS = d.querySelector('small'); this.dL = d.querySelector('polygon'); this.chipKey = -1; this.chipIn = false;
    this._chipSync(); return d;
  }
  _chipSync() {
    if (!this.dom) return; const t = this.mTier, n = this.mDrinks, key = t * 10000 + n; if (key === this.chipKey) return; this.chipKey = key;
    this.dB.textContent = TIER_NAME[t]; this.dB.className = t ? 't' + Math.min(3, t) : '';
    this.dS.textContent = n ? `${n} drink${n === 1 ? '' : 's'}` : 'No drinks';
    const f = FILL[t] || 0, y = (16 - 11 * f).toFixed(2), w = 9.3 * f; this.dL.setAttribute('points', `${(13 - w).toFixed(2)},${y} ${(13 + w).toFixed(2)},${y} 13,16`);
  }
  /** the tier >= 2 camera sway (PartyPlay's own, in its light()): after Hangout has set the camera each frame */
  _hookCam() {
    const ev = this.ev; if (this.cam0 || typeof ev._camera !== 'function') return;
    const own = Object.prototype.hasOwnProperty.call(ev, '_camera'), base = ev._camera, self = this;
    this.cam0 = { own, base };
    ev._camera = function camSway(dt) { const r = base.call(this, dt); self._sway(); return r; };
  }
  _unhookCam() { const ev = this.ev, C = this.cam0; if (!C) return; this.cam0 = null; if (C.own) ev._camera = C.base; else delete ev._camera; }
  _sway() {
    const ev = this.ev, cam = ev.cam; if (!this.on || REDUCED || this.mTier < 2 || ev.game || ev.moment || !cam) return;
    const a = this.mTier >= 3 ? 0.02 : 0.009, t = ev.t || 0; cam.rotateZ(a * Math.sin(t * 0.9)); cam.rotateX(a * 0.35 * Math.sin(t * 0.63 + 1.1)); cam.updateMatrixWorld();
  }

  // ---- act 2 ----------------------------------------------------------------------------------------------------------------
  carryOut() {
    const levels = {}; for (const S of this.L) if (S.adult && (S.drinks || this._lv(S) > 0)) levels[S.cid] = +Math.max(0, S.level + S.pend).toFixed(2);
    const o = flag('__affDrunk'); if (o && typeof o === 'object') for (const S of this.L) { const x = o[S.cid]; if (typeof x === 'number' && S.adult) levels[S.cid] = +this._lv(S).toFixed(2); }
    return { clock: +h24(this._clock()).toFixed(3), levels, seed: this.seed };
  }
  carryIn(aff) {
    if (!aff || typeof aff !== 'object') return;
    const A = aff.levels && typeof aff.levels === 'object' ? aff.levels : null; if (!A) return;
    if (typeof aff.seed === 'string' && aff.seed) { this.seed = aff.seed; for (const S of this.L) { S.seed = `${this.seed}|${S.cid}`; this._plan(S, S.g); S.drinks = S.adult && this.ctx !== 'none' && S.cap > 0; } }
    this.carry = { clock: num(+aff.clock, null), levels: A };
    for (const S of this.L) this._carryTo(S);
  }
  /** a person's level from the first act, less what the liver took while everyone moved on */
  _carryTo(S) {
    const C = this.carry; if (!C || S.carried || !S.drinks || S.fixed != null) return;
    const u = num(+C.levels[S.cid], null); if (u == null) return;
    const gap = C.clock != null ? Math.max(0, h24(this._clock()) - C.clock) : 0;
    S.level = Math.max(0, u - ELIM * gap); S.pend = 0; S.carried = true;
  }

  // ---- tests, and the end ---------------------------------------------------------------------------------------------------
  info() {
    const H = h24(this._clock());
    return this.L.map((S) => ({ cid: S.cid, name: S.g.name, who: S.who, level: +this._lv(S).toFixed(2), pend: +S.pend.toFixed(2), tier: tierOf(this._lv(S)), cap: this._cap(S, H), big: S.big, water: S.water, dry: S.dry > this._clock(), adult: S.adult, drinks: S.drinks }));
  }
  dispose() {
    if (!this.on) return; this.on = false;
    for (const S of this.L) { try { this._off(S); } catch (_) { /* (gone with the room) */ } }
    this._unhookCam();
    try { this.dom?.remove(); } catch (_) { /* */ } this.dom = null;
    try { document.getElementById('affd-css')?.remove(); } catch (_) { /* */ }
    try { if (window.__affDrink === this) window.__affDrink = null; } catch (_) { /* */ }
  }
}
