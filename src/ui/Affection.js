// Affection and intoxication, played (WP-A): at an evening out, an after-party or a pool night you can, at any moment,
// get close to the person you are with - platonic first (a hand on her arm, a hug, an arm round her, leaning together on
// a sofa) and, when it is welcome, a step further (holding hands, cuddling up, a slow dance close, a kiss on the cheek, a
// brief closed kiss on the lips). G opens it (G again does the step the prompt names); the talk's closing row can offer
// it after a warm conversation. Every step is asked, never taken: she can say yes, not yet, or no - and a not yet or a no
// puts that step (and every step above it) on hold with her for a minute of play (COOL; no route gets past it meanwhile:
// the menu, the talk's kiss, the talk's topics, 'Leave with...', act 2), with a small dip in her mood that fades.
// Drink is part of it: a merry or tipsy star is bolder and says yes more readily, and sometimes makes the move herself -
// a lean, a hand to the dance floor, a kiss on the cheek, now and then a kiss on the lips out of the blue (kiss back,
// laugh it off, or step back gently). Somebody very drunk is never escalated with and never initiates: the options are
// water, a seat, staying with them, a car home - and looking after them is remembered.
// Rides on Hangout (ui/Hangout.js) the way PartyPlay does, through '// affection hook' blocks; reads PartyPlay's frozen
// surface at parties; hands its night to the career as res.aff (career/AffectionResult.js settles it). The words are
// AffectionLines' (ui/AffectionLines.js); the paired bodies and the two-shot camera are PairFrames' (world/PairFrames.js);
// the NPC drink model and the pool's own are AffectionDrink's (ui/AffectionDrink.js). Without either, every path still
// works: a moment is a letterboxed caption, levels are 0.
// The line (the lead's): PG - never making out, groping or anything sexual; consent modelled both ways; tipsy is fine,
// very drunk (7.5 units and up) is never romance; romance only with the 12 invented adult stars and never for a player
// under 18 (or of unknown age); real F1 drivers get platonic gestures only (a bro-hug, a celebration hug, an arm round
// for a photo) and are never drunk, romantic or scandalous; a grave week is a hand on the shoulder and a quiet hug.
// Built for the Intel UHD laptop: no light, material or shadow of its own; the director runs at 1 Hz; nothing is
// allocated per frame; its DOM is built once behind the opening cover; bodies are built only behind a cover or a blink.
//
// =====================================================================================================================
// AFFECTION CONTRACT (WP-A, published 2026-10-11)
// =====================================================================================================================
// new Affection(ev, launch)   in the Evening constructor right after the PartyPlay line (ev.gs, ev.x, ev.R exist; no DOM
//                             yet). launch: Hangout's o (a party's launch: me.age, me.real, carry - act 1's R.party).
// Hooks Hangout calls (each safe at any time, each in a try/catch):
//   steps() -> [fn]           _build, after the party's steps: you (ev._makeMe) when missing, the prebuilt pair frames
//                             (at most 6), the DOM, AffectionDrink's setup.
//   update(dt)                Evening.update, right after the _partyUpdate line (heads and links after _people).
//   key(e) -> bool            _kd, right after the party key hook: takes KeyG only (menu, G-G, the talk's closer).
//   prompt(t, html) -> html   _prompt: the G label on a guest's line, the link's span (WITH MIRA · HOLDING HANDS).
//   closer(box, T0)           _offerLeave: a second button after a warm talk ([Hug her], [Kiss her], [Bro-hug]).
//   served(item)              _ordered: the pool's drink model (AffectionDrink).
//   photoPose(g, on)          _snap, around the render: the side frames (an arm round) when they are built.
//   meLook(h) -> opts | null  _makeMe at the pool (occ 'pool'): poolDriverLook.
//   resultInto(res)           result(), AFTER party.resultInto: res.aff (and R.party.aff at a party, for act 2).
//   dispose()                 _dispose, first.
// Called by PartyPlay (two lines): talkKiss(g, counted) -> bool in _kiss after its guard (true: handled or vetoed);
//   g.n.affHold read by _leaveWith's filter. HangoutTalk reads g.n.affHold in hangoutTopics (kiss / together topics).
// PartyPlay surface read (frozen with the afterparty owner): tier, level, Rp, XP, hf, beat, isPrivate(g), _free(),
//   _blink(fn), _place(g, x, z, r, face), _dance(g), _flashDom(p), exiting, card, who, drama, pend (+ team, london, zoneK,
//   fame, brawl when present).
// res.aff = { v: 1, youPeak, meAge, meReal, clock, levels: { cid: units }, with: { [cid]: { kind, role, top, acts: [{ k,
//   at, by: 'me'|'her', ans: 'yes'|'notyet'|'no'|'back'|'laugh'|'step'|'veto', priv, photo, seenBy: [cid], tier, you,
//   act, why? }], closed, cap, stepped: [k], sorry, npcKiss, npcDone: [k], care: [], herPeak, linked (s), danced,
//   kissRp } }, photos: [{ cid, k }], log: [string] (<= 4) }.
// Tests: window.__aff (this), window.__affYes / __affNo (the next attempt's answer), window.__affNpcKiss (her move, at
//   the next free second, with the nearest eligible star), window.__affPaps (every public act photographed),
//   window.__affDrunk = { cid: units } (AffectionDrink's override; the stub honours it too).
// =====================================================================================================================
import * as THREE from 'three';
import * as Celebs from '../career/Celebs.js';
import { ageOf } from '../career/Party.js';
import { poolDriverLook } from './PartyPool.js';
import { PairFrames } from '../world/PairFrames.js';
import { AffectionDrink } from './AffectionDrink.js';
import { papsSeen } from './PapsConfront.js';
import { AFF_LABEL, AFF_SHORT, AFF_LINKED, AFF_DRINK_WORD, AFF_CHIP, AFF_READ, AFF_YES, AFF_YES_TIPSY, AFF_NOTYET, AFF_NO, AFF_TOAST, AFF_CAP, AFF_DANCE, AFF_NPC, AFF_BOLD, AFF_CARE, AFF_SAW, AFF_QUIET, AFF_SORRY } from './AffectionLines.js';
// RELEASE GATE: on since v77 (the paired poses are in People.js POSES, PartyPlay's talkKiss/leaveHold lines and
// HangoutTalk's affHold/affLeave gate are in). false = Hangout never makes an Affection (every hook is null-safe,
// res.aff is never written, so career/AffectionResult.js settles nothing).
export const AFFECTION_ON = true;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : a);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const firstOf = (s) => String(s || '').trim().split(' ')[0];
const facing = (dx, dz) => Math.atan2(-dz, dx);
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const num = (v, d) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
const flag = (k) => { try { return window[k] ?? null; } catch (_) { return null; } };
const unflag = (k) => { try { window[k] = null; } catch (_) { /* */ } };
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
/** the drink tiers (UK units in the blood, PartyPlay's): merry 3, tipsy 5.5, drunk 8.5, past 12 -> 0..4 */
const tierOf = (L) => (L >= 12 ? 4 : L >= 8.5 ? 3 : L >= 5.5 ? 2 : L >= 3 ? 1 : 0);
const HAZY = 7.5, PAST = 8.5, ROM = 3;
const STAGE_I = { stranger: 0, met: 1, friendly: 2, flirting: 3, dating: 4, partner: 5, ex: -1 };
const COMFORT0 = { stranger: 0, met: 0.5, friendly: 1.5, flirting: 2, dating: 3, partner: 3.5, ex: 0.5 };
// (loosened v78: a friendly star hugs and holds hands readily, a slow dance and a cheek kiss come at a low bond, and a
//  kiss on the lips is a real chance on a first good night - likelier tipsy or somewhere private)
const BASE = { stranger: 1.6, met: 2.8, friendly: 3.6, flirting: 4.6, dating: 5.4, partner: 5.8, ex: 1.6 };
/** a not yet or a no puts that step (and every step above it) with her on hold for this many seconds of play - never the night */
const COOL = 60;
const FRIEND_OK = new Set(['friend', 'mate', 'best', 'friendly']);
const DANCE_EV = new Set(['rooftop', 'apartment', 'restaurant', 'poolclub', 'dayclub']);
const PHOTO_K = { hand: 0.25, cuddle: 0.3, arm: 0.3, dance: 0.35, cheek: 0.2, kiss: 0.6, close: 0.25 };
const isRealMe = (d) => !!d && ['F1', 'Reserve', 'F2'].includes(d.from);

// ---- the gestures ----------------------------------------------------------------------------------------------------
// I: how intimate (romance from 3); ctx: where it works (any | stand | sofa | table | standsofa | floor); pair:
// PairFrames' pair (seatPair on a sofa); link: you stay that way, walking or sitting; shot: the two-shot's seconds;
// frame: the shot's framing (chest | waist)
const GEST = {
  touch: { I: 0.5, ctx: 'any' },
  hug: { I: 1, ctx: 'stand', pair: 'hug', shot: 1.6, frame: 'chest' },
  side: { I: 1.5, ctx: 'stand', pair: 'side', link: true, shot: 1.4, frame: 'waist' },
  lean: { I: 2, ctx: 'sofa', pair: 'seatLean', link: true, seat: true, shot: 1.4, frame: 'waist' },
  hand: { I: 3, ctx: 'stand', pair: 'hand', link: true, shot: 1.4, frame: 'waist', rom: true },
  reach: { I: 3, ctx: 'table', single: 'sitReach', rom: true },
  arm: { I: 3, ctx: 'sofa', pair: 'seatArm', link: true, seat: true, shot: 1.4, frame: 'waist', rom: true, beside: true },
  cuddle: { I: 3.5, ctx: 'sofa', pair: 'seatArm', link: true, seat: true, shot: 1.4, frame: 'waist', rom: true, head: true },
  close: { I: 3.5, ctx: 'stand', pair: 'embrace', shot: 2.6, frame: 'chest', rom: true },
  dance: { I: 3.5, ctx: 'floor', pair: 'embrace', frame: 'chest', rom: true, dance: true },
  cheek: { I: 4, ctx: 'standsofa', pair: 'cheek', shot: 1.6, frame: 'chest', rom: true, beside: true },
  kiss: { I: 5, ctx: 'standsofa', pair: 'kiss', seatPair: 'seatKiss', shot: 3.8, frame: 'chest', rom: true, beside: true },
  bro: { I: 1, ctx: 'stand', pair: 'brohug', shot: 1.6, frame: 'chest' },
  celebrate: { I: 1, ctx: 'stand', pair: 'hug', shot: 1.6, frame: 'chest' },
  mates: { I: 1.5, ctx: 'stand', pair: 'side', shot: 1.4, frame: 'waist' },
  selfie: { I: 1, ctx: 'stand', pair: 'side', shot: 1.4, frame: 'waist' },
  comfort: { I: 1, ctx: 'any', quiet: true },
  quietTouch: { I: 0.5, ctx: 'any', quiet: true },
  water: { I: 0, care: true }, seat: { I: 0, care: true }, stay: { I: 0, care: true }, car: { I: 0, care: true },
  space: { I: 0, meta: true }, sorry: { I: 0, meta: true }, release: { I: 0, meta: true },
};
// what each kind of person can be offered (romance among the star's is consent-gated; see _options)
const BY_WHO = {
  star: ['touch', 'hug', 'side', 'lean', 'hand', 'reach', 'arm', 'cuddle', 'close', 'dance', 'cheek', 'kiss'],
  ex: ['touch', 'hug'],
  fdriver: ['touch', 'bro', 'celebrate', 'mates'],
  rdriver: ['touch', 'bro', 'celebrate', 'mates'],
  team: ['touch', 'celebrate'],
  infl: ['touch', 'selfie'],
  biz: ['touch'],
};
const CARE = ['water', 'seat', 'stay', 'car'];

const CSS = `
#hangout .hg-prompt .aff-g kbd { transition: box-shadow .2s; }
#hangout .hg-prompt .aff-g.nudge kbd { box-shadow: 0 0 0 3px rgba(239,127,180,.55); animation: affNudge .9s ease-in-out infinite alternate; }
@keyframes affNudge { from { box-shadow: 0 0 0 1px rgba(239,127,180,.3); } to { box-shadow: 0 0 0 4px rgba(239,127,180,.7); } }
#hangout .hg-prompt .aff-with { font: 800 10.5px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #ef7fb4; }
#hangout .hg-talk .opts button i.aff-warm { color: #6cd08f; } #hangout .hg-talk .opts button i.aff-mid { color: #aeb5c2; }
#hangout .hg-talk .opts button i.aff-cool { color: #f5c04a; } #hangout .hg-talk .opts button i.aff-imp { color: #ff8a3d; }
#hangout .aff-card { position: absolute; left: 50%; bottom: calc(11vh + 10px); width: min(420px, calc(100vw - 32px)); transform: translate(-50%, 12px); background: rgba(12,14,20,.95); border: 1px solid rgba(255,255,255,.14); border-left: 3px solid #ef7fb4; border-radius: 10px; padding: 10px 12px 9px; box-sizing: border-box; opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none; box-shadow: 0 12px 34px rgba(0,0,0,.5); z-index: 2; }
#hangout .aff-card.in { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#hangout .aff-card header { font: 800 11px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #ef7fb4; text-transform: uppercase; margin-bottom: 8px; }
#hangout .aff-card .aff-b { display: flex; gap: 6px; }
#hangout .aff-card button { flex: 1; background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.16); border-radius: 7px; padding: 8px 6px; font: 700 12px/1.2 'Segoe UI', Arial, sans-serif; cursor: pointer; transition: background .14s; }
#hangout .aff-card button:hover, #hangout .aff-card button:focus-visible { background: rgba(255,255,255,.15); outline: none; }
#hangout .aff-card button kbd { margin-right: 5px; }
#hangout .aff-card s { display: block; height: 3px; margin-top: 8px; border-radius: 2px; background: rgba(255,255,255,.14); overflow: hidden; text-decoration: none; }
#hangout .aff-card s u { display: block; height: 100%; background: #fff; transform-origin: left; text-decoration: none; }
@media (max-height: 560px) { #hangout .aff-card { padding: 7px 10px 6px; } #hangout .aff-card header { margin-bottom: 5px; } #hangout .aff-card button { padding: 6px 5px; } }
`;

// =====================================================================================================================
// the stand-ins, until world/PairFrames.js and ui/AffectionDrink.js are there (or if one cannot start): no bodies of
// their own (a moment is a caption), the sofa slot and a link's follow worked out simply, nobody has had a drink
// =====================================================================================================================
class PairStub {
  constructor(ev) { this.ev = ev; this.stub = true; this._slots = new Map(); }
  framesFor() { return null; }
  steps() { return []; }
  need() { return []; }
  build() { return 0; }
  ready() { return false; }
  /** you beside her (a link) or in front of her (anything else), anchored on her -> { ok, ax, az, ayaw (your heading), bx, bz, byaw (her turn) } */
  place(kind, g) {
    const ev = this.ev, p = g?.person?.group?.position; if (!p) return { ok: false };
    const r = g.person.group.rotation.y, h = -r, side = kind === 'side' || kind === 'hand';
    if (side) {
      const d = kind === 'hand' ? 0.5 : 0.36, rx = -Math.sin(h), rz = Math.cos(h);
      for (const s of [1, -1]) { const ax = p.x - rx * d * s, az = p.z - rz * d * s; if (ev._free(ax, az, 0.2, g.disc)) return { ok: true, ax, az, ayaw: h, bx: p.x, bz: p.z, byaw: r, mirror: s < 0 }; }
      return { ok: false };
    }
    const ax = p.x + Math.cos(h) * 0.8, az = p.z + Math.sin(h) * 0.8;
    return { ok: true, ax, az, ayaw: h + Math.PI, bx: p.x, bz: p.z, byaw: r };
  }
  /** a place on the same sofa beside her: her seat +/- 0.55 m across her facing, inside the same solid, nobody there -> { x, z, yaw, eye } | null */
  slot(g) {
    const sp = g?.spot, ev = this.ev; if (!sp || sp.pose !== 'sit' || !ev.K) return null;
    if (this._slots.has(sp)) return this._slots.get(sp);
    let out = null; const f = sp.face, ax = Math.sin(f), az = Math.cos(f);
    const S = ev.K.solids.find((s) => sp.x > s.x0 - 0.06 && sp.x < s.x1 + 0.06 && sp.z > s.z0 - 0.06 && sp.z < s.z1 + 0.06);
    const alongX = Math.abs(ax) >= Math.abs(az);
    if (S) for (const d of [0.55, -0.55]) {
      const x = sp.x + ax * d, z = sp.z + az * d;
      // (along the seat: at least 0.2 m from its ends; across it: where she sits)
      const inX = alongX ? x >= S.x0 + 0.2 && x <= S.x1 - 0.2 : x >= S.x0 - 0.06 && x <= S.x1 + 0.06, inZ = alongX ? z >= S.z0 - 0.06 && z <= S.z1 + 0.06 : z >= S.z0 + 0.2 && z <= S.z1 - 0.2;
      if (!inX || !inZ) continue;
      if (ev.K.discs.some((q) => q !== g.disc && (q.x - x) ** 2 + (q.z - z) ** 2 < 0.4 * 0.4 && q.r > 0)) continue;
      out = { x, z, yaw: -f, eye: 1.12 + (sp.y || 0) }; break;
    }
    this._slots.set(sp, out); return out;
  }
  show() {}
  single() { return false; }
  heads(kind, g, k = 1) {
    const ev = this.ev, P = g?.person, h = P?.head; if (!h) return;
    const gp = P.group.position, ty = clamp(wrap(facing(ev.pos.x - gp.x, ev.pos.z - gp.z) - P.group.rotation.y), -0.6, 0.6);
    h.rotation.y = kind === 'seatArm' ? 0.15 * Math.sign(ty || 1) * k : ty * k; if (kind === 'seatArm') h.rotation.z = (P.bow || 0) + 0.25 * k;
  }
  sway() {}
  /** her beside you as you walk (0.38 m to your right, 0.5 holding hands; behind-right when tight) -> 'ok' | 'blocked' */
  follow(g, kind, dt, moving) {
    const ev = this.ev, gp = g?.person?.group; if (!gp) return 'blocked';
    const y = ev.yaw, fx = Math.cos(y), fz = Math.sin(y), rx = -fz, rz = fx, d = kind === 'hand' ? 0.5 : 0.38;
    let tx = ev.pos.x + rx * d, tz = ev.pos.z + rz * d;
    if (!ev._free(tx, tz, 0.18, g.disc)) { tx = ev.pos.x + rx * 0.5 - fx * 0.5; tz = ev.pos.z + rz * 0.5 - fz * 0.5; if (!ev._free(tx, tz, 0.18, g.disc)) return 'blocked'; }
    const k = Math.min(1, dt * 6), dx = (tx - gp.position.x) * k, dz = (tz - gp.position.z) * k, s = Math.hypot(dx, dz), mx = 2 * dt;
    const q = s > mx ? mx / s : 1; gp.position.x += dx * q; gp.position.z += dz * q;
    const hy = ev.V?.heightAt; if (typeof hy === 'function') { try { gp.position.y = num(hy(gp.position.x, gp.position.z), gp.position.y); } catch (_) { /* */ } }
    if (moving) gp.rotation.y += wrap(-y - gp.rotation.y) * Math.min(1, dt * 5);
    g.face0 = gp.rotation.y; if (g.disc) { g.disc.x = gp.position.x; g.disc.z = gp.position.z; }
    try { ev.crowd?.push?.(gp.position.x, gp.position.z, 0.5); } catch (_) { /* */ }
    return 'ok';
  }
  shot() { return null; }
  aim() {}
  unshot() {}
  release() {}
  dispose() {}
}
class DrinkStub {
  constructor(ev) { this.ev = ev; this.stub = true; }
  level(g) { const o = flag('__affDrunk'); if (o && g?.cid && o[g.cid] != null) return +o[g.cid] || 0; return 0; }
  tier(g) { return tierOf(this.level(g)); }
  hazy(g) { return this.level(g) >= HAZY; }
  past(g) { return this.level(g) >= PAST; }
  me() { const pp = this.ev.party; return pp ? { level: num(pp.level, 0), tier: num(pp.tier, 0), peak: num(pp.peak, 0) } : { level: 0, tier: 0, peak: 0 }; }
  served() {} water() {} onRound() {} onCheers() {} update() {} chip() {} dispose() {}
  steps() { return []; }
  carryOut() { return { clock: num(+this.ev.clock, 0), levels: {} }; }
  carryIn() {}
}

// =====================================================================================================================
// the pseudo-games (Hangout's game shape: { name, done, result: null, update, key, mouse, skip, info, dispose })
// =====================================================================================================================
/** a two-shot: the pair's bodies, the camera beside you both (letterboxed); a caption where there are no bodies */
class PairShot {
  constructor(aff, g, k, pair, o = {}) {
    this.aff = aff; this.ev = aff.ev; this.g = g; this.k = k; this.pair = pair; this.o = o; this.name = 'affection'; this.done = false; this.result = null; this.t = 0;
    const G0 = GEST[k] || {}, ev = this.ev; this.dur = o.dur || G0.shot || 1.6; this.min = o.min ?? Math.min(1.2, this.dur * 0.6); this.link = !!(G0.link && !o.noLink); this.by = o.by || 'me';
    ev._unlock?.(); ev.keys?.clear();
    this.p0x = ev.pos.x; this.p0y = ev.pos.y; this.p0z = ev.pos.z; this.yaw0 = ev.yaw; this.pitch0 = ev.pitch; this.face0 = g.face0; this.fov0 = ev.cam?.fov;
    this.framed = false; this.plan = null;
    const pf = aff.pf;
    try {
      if (pair && !pf.stub && pf.ready(pair, g)) {
        const P = pf.place(pair, g, { dance: !!o.dance });
        if (P?.ok) { aff._applyPlace(P, g, !!G0.seat); pf.show(pair, g, true); this.framed = true; this.plan = pf.shot(pair, g, { frame: G0.frame || 'chest', swim: aff._swim(g), dance: !!o.dance, kind: k }); }
      } else if (this.link && pair) { const P = pf.place(pair, g, {}); if (P?.ok && !G0.seat) aff._applyPlace(P, g, false); }
    } catch (e) { console.warn('Affection: the two-shot could not be set up', e); this.framed = false; this.plan = null; }
    ev.$?.('.hg-bars')?.classList.add('in');
    if (o.caption) ev._caption?.(o.caption);
  }
  update(dt) {
    if (this.done) return; this.t += dt; const aff = this.aff;
    try { if (this.plan) aff.pf.aim(this.plan, this.t); else aff._lookAtHer(this.g, dt, 3); if (this.framed) aff.pf.heads(this.pair, this.g, 1); } catch (e) { this.plan = null; }
    aff._push(this.g);
    if (this.t >= this.dur) this._end(false);
  }
  key(c, down) { if (down && this.t > this.min && (c === 'Space' || c === 'KeyE' || c === 'Enter' || c === 'NumpadEnter')) this._end(true); }
  skip() { if (this.t > this.min) this._end(true); }
  mouse() {}
  info() { return { aff: this.k, pair: this.pair, t: +this.t.toFixed(2), framed: this.framed, shot: !!this.plan }; }
  _end(user) {
    if (this.done) return; this.done = true; const ev = this.ev, aff = this.aff;
    ev.$?.('.hg-bars')?.classList.remove('in'); ev._caption?.(null);
    try { if (this.plan) aff.pf.unshot(this.plan, { link: !!this.link }); } catch (_) { /* */ }
    aff._fov(this.fov0);
    if (ev.me) ev.me.group.visible = false;
    aff._shotDone(this, user);
  }
  dispose() { if (!this.done) this._end(false); this.aff._fov(this.fov0); }
}
/** a slow dance, close: about ten seconds of sway in a letterboxed two-shot, no buttons - then a small card */
class DanceShot {
  constructor(aff, g, o = {}) {
    this.aff = aff; this.ev = aff.ev; this.g = g; this.o = o; this.name = 'affection'; this.k = 'dance'; this.pair = 'embrace'; this.done = false; this.result = null; this.t = 0; this.dur = flag('__partyFast') ? 3 : 10; this.min = 2; this.card = false; this.ct = 0; this.by = o.by || 'me';
    const ev = this.ev, pf = aff.pf; ev._unlock?.(); ev.keys?.clear(); this.fov0 = ev.cam?.fov; this.face0 = g.face0; this.framed = false; this.plan = null;
    this.p0x = ev.pos.x; this.p0y = ev.pos.y; this.p0z = ev.pos.z; this.yaw0 = ev.yaw; this.pitch0 = ev.pitch;
    try { if (!pf.stub && pf.ready('embrace', g)) { const P = pf.place('embrace', g, { dance: true }); if (P?.ok) { aff._applyPlace(P, g, false); pf.show('embrace', g, true); this.framed = true; this.plan = pf.shot('embrace', g, { frame: 'chest', swim: aff._swim(g), dance: true, orbit: !REDUCED, kind: 'dance' }); } } } catch (e) { console.warn('Affection: the dance could not be set up', e); }
    ev.$?.('.hg-bars')?.classList.add('in'); ev._caption?.(aff._fill(pick(AFF_CAP.dance.star), g));
  }
  update(dt) {
    if (this.done) return; this.t += dt; const aff = this.aff, pp = this.ev.party;
    const ph = pp?.beat ? num(pp.beat.t, this.t * 2) / 2 : this.t * 0.9;
    try { if (this.plan) aff.pf.aim(this.plan, Math.min(this.t, this.dur)); else aff._lookAtHer(this.g, dt, 2); if (this.framed) { if (!REDUCED) aff.pf.sway('embrace', this.g, ph); aff.pf.heads('embrace', this.g, 1); } } catch (e) { this.plan = null; }
    aff._push(this.g);
    if (!this.card && this.t >= this.dur) this._card();
    if (this.card) { this.ct += dt; aff._cardTick(this.ct / 6); if (this.ct >= 6) this._pick(1); }
  }
  _card() { if (this.card) return; this.card = true; this.ev._caption?.(null); this.aff._cardShow(AFF_DANCE.endHead, AFF_DANCE.end, (i) => this._pick(i)); }
  _pick(i) { if (this.done) return; this.aff._cardHide(); this.choice = i; this._end(); }
  key(c, down) {
    if (!down) return;
    if (this.card) { if (c === 'Digit1' || c === 'Numpad1') this._pick(0); else if (c === 'Digit2' || c === 'Numpad2' || c === 'Space' || c === 'KeyE' || c === 'Enter') this._pick(1); return; }
    if (this.t > this.min && (c === 'Space' || c === 'KeyE' || c === 'Enter')) this._card();
  }
  skip() { if (this.card) this._pick(1); else if (this.t > this.min) this._card(); }
  mouse() {}
  info() { return { aff: 'dance', t: +this.t.toFixed(2), card: this.card, framed: this.framed }; }
  _end() {
    if (this.done) return; this.done = true; const ev = this.ev, aff = this.aff;
    ev.$?.('.hg-bars')?.classList.remove('in'); ev._caption?.(null); aff._cardHide();
    try { if (this.plan) aff.pf.unshot(this.plan, { link: !!this.link }); } catch (_) { /* */ }
    aff._fov(this.fov0); if (ev.me) ev.me.group.visible = false;
    aff._danceDone(this);
  }
  dispose() { if (!this.done) { this.choice = 1; this._end(); } this.aff._fov(this.fov0); }
}
/** her move: a kiss out of the blue - then your answer (1 kiss her back, 2 laugh it off, 3 step back gently; time, Esc or Q: laugh) */
class KissResponse {
  constructor(aff, g, o = {}) {
    this.aff = aff; this.ev = aff.ev; this.g = g; this.o = o; this.name = 'affection'; this.k = 'kiss'; this.pair = 'kiss'; this.by = 'her'; this.done = false; this.result = null; this.t = 0; this.phase = 'kiss'; this.ct = 0; this.ans = null;
    this.partner = !!o.partner; const ev = this.ev, pf = aff.pf; ev._unlock?.(); ev.keys?.clear(); this.fov0 = ev.cam?.fov; this.face0 = g.face0; this.framed = false; this.plan = null;
    this.p0x = ev.pos.x; this.p0y = ev.pos.y; this.p0z = ev.pos.z; this.yaw0 = ev.yaw; this.pitch0 = ev.pitch;
    const sofa = aff._seatedBeside(g); this.pair = sofa ? 'seatKiss' : 'kiss';
    try { if (!pf.stub && pf.ready(this.pair, g)) { const P = pf.place(this.pair, g, {}); if (P?.ok) { aff._applyPlace(P, g, sofa); pf.show(this.pair, g, true); this.framed = true; this.plan = pf.shot(this.pair, g, { frame: 'chest', swim: aff._swim(g), kind: 'kiss' }); } } } catch (e) { console.warn('Affection: her kiss could not be set up', e); }
    ev.$?.('.hg-bars')?.classList.add('in'); ev._caption?.(aff._fill(pick(AFF_BOLD.cap), g));
  }
  update(dt) {
    if (this.done) return; this.t += dt; const aff = this.aff;
    try { if (this.plan) aff.pf.aim(this.plan, Math.min(this.t, 2.4)); else aff._lookAtHer(this.g, dt, 3); if (this.framed) aff.pf.heads(this.pair, this.g, 1); } catch (e) { this.plan = null; }
    aff._push(this.g);
    if (this.phase === 'kiss' && this.t >= 1.6) {
      if (this.partner) { this.phase = 'hint'; this.ct = 0; this.ev._caption?.(AFF_BOLD.partnerHint); }
      else { this.phase = 'card'; this.ct = 0; this.ev._caption?.(null); aff._cardShow(aff._fill(AFF_BOLD.head, this.g), ['Kiss her back', 'Laugh it off', 'Step back gently'], (i) => this._answer(['back', 'laugh', 'step'][i] || 'laugh')); }
    } else if (this.phase === 'card') { this.ct += dt; aff._cardTick(this.ct / 5); if (this.ct >= 5) this._answer('laugh'); }
    else if (this.phase === 'hint') { this.ct += dt; if (this.ct >= 2) this._answer('back'); }
    else if (this.phase === 'after') { this.ct += dt; if (this.ct >= this.hold) this._end(); }
  }
  _answer(a) {
    if (this.ans) return; this.ans = a; this.aff._cardHide(); this.phase = 'after'; this.ct = 0; this.hold = 1.8;
    const cap = this.aff._fill(a === 'back' ? pick(AFF_BOLD.back.cap) : a === 'laugh' ? `"${pick(AFF_BOLD.laugh.you)}"` : `"${pick(AFF_BOLD.step.you)}"`, this.g);
    // (kissing her back: the shot holds a second, longer beat; laughing it off or stepping back: the two of you apart, at once)
    if (a === 'back') this.ev._caption?.(cap); else { this.capAfter = cap; this._end(); }
  }
  key(c, down) {
    if (!down) return;
    if (this.phase === 'card') { if (c === 'Digit1' || c === 'Numpad1') this._answer('back'); else if (c === 'Digit2' || c === 'Numpad2') this._answer('laugh'); else if (c === 'Digit3' || c === 'Numpad3') this._answer('step'); return; }
    if (this.phase === 'hint' || (this.phase === 'kiss' && this.partner)) { if (c === 'KeyG') this._answer('step'); return; }
    if (this.phase === 'after' && this.ct > 0.6 && (c === 'Space' || c === 'KeyE' || c === 'Enter')) this._end();
  }
  skip() { if (this.phase === 'card' || this.phase === 'kiss' || this.phase === 'hint') this._answer(this.partner ? 'back' : 'laugh'); else if (this.phase === 'after' && this.ct > 0.6) this._end(); }
  mouse() {}
  info() { return { aff: 'npcKiss', phase: this.phase, t: +this.t.toFixed(2), ans: this.ans, framed: this.framed }; }
  _end() {
    if (this.done) return; this.done = true; const ev = this.ev, aff = this.aff;
    if (!this.ans) this.ans = this.partner ? 'back' : 'laugh';
    ev.$?.('.hg-bars')?.classList.remove('in'); ev._caption?.(null); aff._cardHide();
    try { if (this.plan) aff.pf.unshot(this.plan, { link: !!this.link }); } catch (_) { /* */ }
    aff._fov(this.fov0); if (ev.me) ev.me.group.visible = false;
    aff._boldDone(this);
  }
  dispose() { if (!this.done) this._end(); this.aff._fov(this.fov0); }
}
/** a letterboxed caption with the camera on her (a grave week's hug, a car home, a moment without bodies) */
class CaptionMoment {
  constructor(aff, g, text, dur = 3.2, then = null) {
    this.aff = aff; this.ev = aff.ev; this.g = g; this.name = 'affection'; this.k = 'caption'; this.done = false; this.result = null; this.t = 0; this.dur = dur; this.min = Math.min(1.5, dur * 0.5); this.then = then;
    this.ev._unlock?.(); this.ev.keys?.clear(); this.ev.$?.('.hg-bars')?.classList.add('in'); this.ev._caption?.(text);
  }
  update(dt) { if (this.done) return; this.t += dt; if (this.g?.person && !this.g.gone) this.aff._lookAtHer(this.g, dt, 1.6); else this.ev._camera?.(dt); if (this.t >= this.dur) this._end(); }
  key(c, down) { if (down && this.t > this.min && (c === 'Space' || c === 'KeyE' || c === 'Enter' || c === 'NumpadEnter')) this._end(); }
  skip() { if (this.t > this.min) this._end(); }
  mouse() {}
  info() { return { aff: 'caption', t: +this.t.toFixed(2) }; }
  _end() { if (this.done) return; this.done = true; this.ev.$?.('.hg-bars')?.classList.remove('in'); this.ev._caption?.(null); const f = this.then; this.then = null; if (f) this.aff.after.push(f); }
  dispose() { this._end(); }
}

// =====================================================================================================================
// Affection
// =====================================================================================================================
/** the play layer for affection and drink at an evening, a party or the pool (see the contract above) */
export class Affection {
  constructor(ev, launch = {}) {
    this.ev = ev; this.o = launch || {}; this.on = true; this.after = []; this.threads = new Map(); this.acc = 0; this.t1 = 0;
    this.link = null; this.busy = false; this.npcT = -999; this.boldDone = false; this.drunkTries = 0; this.lastKissT = -999; this.firstRom = false; this.photoK = new Set(); this.photos = []; this.log = [];
    this.flN = 0; this.flashT = -999; this.sawT = -999; this.plCache = { g: null, t: -9, lab: '', hold: false }; this.nudge = null; this.nudgeT = 0; this.closerK = null; this.discFix = [];
    this.watch = { talk: null, dm: 0, game: null, moment: null };
    this._v0 = new THREE.Vector3(); this._v1 = new THREE.Vector3(); this._v2 = new THREE.Vector3(); this._mv = { x: 0, z: 0 };
    const c = ev.c || null, me = c?.drivers?.[c?.playerId] || null, L = this.o.me || {};
    // (your age: the launch's (a party), else the birthdays on file - unknown counts as under age: no romance either way)
    let age = Number.isFinite(L.age) ? L.age : null; if (L.age === undefined) { try { age = ageOf(c, me, ev.trackId, c?.season); } catch (_) { age = null; } }
    this.meAge = Number.isFinite(age) ? age : null; this.minor = !(this.meAge != null && this.meAge >= 18);
    this.meReal = typeof L.real === 'boolean' ? L.real : isRealMe(me);
    this.quiet = !!ev.quiet; this.act = num(this.o.act, 1);
    // (the bodies and the drink: PairFrames and AffectionDrink when they are there, else the stand-ins)
    this.pf = this._makePF(); this.drink = this._makeDrink();
    this._ownsFn = (g) => this._owns(g);
    // (act 2: the night so far - who said no, who stepped back, what was done once a night, how much they have had)
    const C = this.o.carry && typeof this.o.carry === 'object' ? this.o.carry.aff : null;
    if (C && typeof C === 'object') this._carryIn(C);
    try { window.__aff = this; } catch (_) { /* (no window) */ }
  }
  _makePF() { if (!flag('__affNoPF')) { try { return new PairFrames(this.ev); } catch (e) { console.warn('Affection: no pair frames - captions only', e); } } return new PairStub(this.ev); }
  _makeDrink() { if (!flag('__affNoDrink')) { try { return new AffectionDrink(this.ev, this.o); } catch (e) { console.warn('Affection: no drink model - levels 0', e); } } return new DrinkStub(this.ev); }

  // ---- hooks ----------------------------------------------------------------------------------------------------------
  steps() {
    const ev = this.ev, S = [];
    // (you, for the two-shots: the evening makes you only at a party or where there is a photo spot - by the time this
    //  step runs the people are built, so whether anyone here is someone to get close to is known)
    if (!this.quiet) S.push(() => { if (!ev.me && typeof ev._makeMe === 'function' && (ev.gs || []).some((g) => this._who(g) !== 'none')) ev._makeMe(); });
    S.push(() => this._dom());
    try { for (const f of this.drink.steps?.() || []) S.push(f); } catch (e) { console.warn('Affection: the drink model could not queue', e); }
    if (!this.quiet && !this.pf.stub) {
      S.push(() => {
        try { const L = this._prebuild(); for (const f of this.pf.steps(L) || []) this._pre.push(f); } catch (e) { console.warn('Affection: no pair frames', e); }
      });
      this._pre = [];
      for (let j = 0; j < 6; j++) S.push(() => { const f = this._pre.shift(); if (f) { try { f(); } catch (e) { console.warn('Affection: a pair frame', e); } } });
    }
    S.push(() => { try { this.drink.chip?.(); } catch (_) { /* (no chip) */ } });
    return S;
  }
  /** what is built behind the cover (at most 6): you - hug, embraceM, sideOut; P1 (your partner, else the closest star) - hug, embraceF, sideIn */
  _prebuild() {
    const P = (this.ev.gs || []).filter((g) => this._who(g) === 'star' && g.person);
    const p1 = P.find((g) => g.role === 'partner' || this._stage(g) === 'partner') || P.slice().sort((a, b) => (STAGE_I[this._stage(b)] ?? 0) - (STAGE_I[this._stage(a)] ?? 0))[0] || null;
    const L = [{ g: 'me', poses: ['hug', 'embraceM', 'sideOut'] }];
    if (p1) L.push({ g: p1, poses: ['hug', 'embraceF', 'sideIn'] });
    return L;
  }
  update(dt) {
    if (!this.on) return; const ev = this.ev;
    if (!ev.ready || ev.closing) return;
    if (this.after.length && !ev.game && !this.busy) { const f = this.after.shift(); try { f(); } catch (e) { console.warn('Affection: a step failed', e); } }
    this._watch();
    if (this.link) this._linkTick(dt);
    if (this.single) { this.single.t -= dt; if (this.single.t <= 0) this._singleOff(); }
    if (this.discFix.length) this._discFix();
    if (this.nudgeT > 0) { this.nudgeT -= dt; if (this.nudgeT <= 0) { this.nudge = null; ev.prHtml = null; } }
    try { this.drink.update(dt, this._ownsFn); } catch (e) { if (!this.drErr) { this.drErr = true; console.warn('Affection: the drink model failed', e); } }
    this.acc += dt; if (this.acc >= 1) { this.acc -= 1; this._second(); }
  }
  key(e) {
    if (!this.on) return false; const ev = this.ev, c = e.code;
    if (c !== 'KeyG') return false;
    if (ev.ask || ev.moment || ev.game || ev.sty || ev.buzzE?.open || this.busy) return false;
    const pp = ev.party; if (pp && (pp.who || pp.card)) return false;
    if (ev.menu) { if (!ev.menu.aff) return false; if (!e.repeat) ev._menuPick(0); return true; }
    if (ev.talk) { if (ev.talk.closing && this.closerK) { if (!e.repeat) this._closerPick(); return true; } return false; }
    if (e.repeat) return true;
    const g = this.link?.g || (ev.tgt?.g && !ev.tgt.g.gone ? ev.tgt.g : null) || this._near();
    if (!g || this._who(g) === 'none') { ev._toast?.('Nobody close enough.', ''); return true; }
    this._menuOpen(g); return true;
  }
  /** Hangout's prompt line, with the G label on a guest's line and the link's span -> html */
  prompt(t, html) {
    if (!this.on || !this.ev.ready) return html;
    const g = t?.g && !t.g.gone ? t.g : null, L = this.link; let out = html;
    const G = g || (L && !t ? L.g : null);
    if (G && this._who(G) !== 'none') {
      const lab = this._promptLabel(G);
      if (lab) { const span = `<span class="aff-g${this.nudge === G && this.nudgeT > 0 ? ' nudge' : ''}"><kbd>G</kbd>${esc(lab)}</span>`, i = out.indexOf('<small>'); out = i >= 0 ? out.slice(0, i) + span + out.slice(i) : out + span; }
    }
    if (L) out = `<span class="aff-with">WITH ${esc(String(L.g.first || '').toUpperCase())} · ${esc(AFF_LINKED[L.care ? 'stay' : L.k] || 'TOGETHER')}</span>` + out;
    return out;
  }
  closer(box, T0) {
    this.closerK = null; if (!this.on || !box || !T0?.g || T0.dm < 3) return;
    const g = T0.g, who = this._who(g); if (who === 'none' || who === 'biz' || who === 'team' || who === 'infl') return;
    if (who === 'star' && this._stage(g) === 'stranger') return;
    if ((who === 'fdriver' || who === 'rdriver') && !FRIEND_OK.has(g.n?.stage) && g.role !== 'mate' && g.role !== 'friend') return;
    const O = this._options(g); if (!O || O.mode !== 'normal') return; const k = O.def; if (!k || GEST[k]?.meta || k === 'touch') return;
    const b = document.createElement('button'); b.type = 'button'; b.dataset.tone = GEST[k].rom ? 'flirt' : 'kind'; b.style.setProperty('--i', 1);
    const it = O.items.find((x) => x.k === k), chip = it?.chip ? AFF_CHIP[it.chip] : '';
    b.innerHTML = `<b>G</b><span>[${esc(this._label(k, g))}]</span><i>${esc(chip)}</i>`; b.addEventListener('click', () => this._closerPick());
    box.appendChild(b); requestAnimationFrame(() => b.classList.add('in'));
    this.closerK = { g, k }; this._nudge(g);
  }
  served(item) { try { return this.drink.served?.(item); } catch (e) { console.warn('Affection: a drink', e); return undefined; } }
  /** _snap: an arm round each other in the photo, when the side frames are built (on: before the render, off: after) */
  photoPose(g, on) {
    try {
      const pf = this.pf, ev = this.ev; if (pf.stub || !g?.person || !ev.me || ev.seat || g.spot?.pose === 'sit') return;
      if (!on) { if (this.photoOn) { pf.show('side', this.photoOn, false); this.photoOn = null; } return; }
      const who = this._who(g); if (!['star', 'fdriver', 'rdriver', 'infl'].includes(who) || (who === 'star' && this._thread(g).comfort < 1.5 && this._stage(g) !== 'friendly')) return;
      if (!pf.ready('side', g)) return;
      const y = ev.yaw, rx = -Math.sin(y), rz = Math.cos(y), gp = g.person.group; gp.position.x = ev.pos.x + rx * 0.36; gp.position.z = ev.pos.z + rz * 0.36;
      pf.show('side', g, true); this.photoOn = g; ev.me.group.visible = true;
    } catch (e) { console.warn('Affection: the photo pose', e); }
  }
  meLook(h) { try { return poolDriverLook(h >>> 0, this.ev.P?.day === true || this.ev.night === false, true); } catch (_) { return null; } }
  /**
   * PartyPlay's _kiss, after its own guard (the talk's [Kiss her]): a hold (a no tonight, her or you too far gone, under
   * age, a quiet night) vetoes it - she thinks better of it - and nothing is recorded; no bodies built for it: false, and
   * PartyPlay's cut-away runs as it always has; else the two-shot, recorded as PartyPlay would -> bool (handled)
   */
  talkKiss(g, counted = false) {
    if (!this.on || !g?.person) return false; const ev = this.ev, T = this._thread(g);
    try {
      const cool = this._coolI(T) <= GEST.kiss.I, hold = !!g.n?.affHold || cool || this.minor || this._lv(g) >= HAZY || this._meTier() >= 3;
      if (hold) { this._act(g, 'kiss', 'me', 'veto', { why: cool ? 'cool' : 'hold', via: 'talk' }); ev._bark?.(g, this._fill(pick(cool ? [`She smiles, shakes her head. "Give it a minute."`, `She stops you, laughing. "Not right now. Give it a minute."`] : [`She thinks better of it - "Not tonight."`, `She stops, smiles, shakes her head. "Not tonight."`]), g)); return true; }
      const pair = this._seatedBeside(g) ? 'seatKiss' : 'kiss';
      if (this.pf.stub || !this.pf.ready(pair, g) || ev.game) { const A = this._act(g, 'kiss', 'me', 'yes', { via: 'talk' }); A.kissRp = true; T.kissRp = true; T.comfort = Math.max(T.comfort, 5); this.lastKissT = ev.t; return false; }
      T.comfort = Math.max(T.comfort, 5); const priv = this._private(g), A = this._act(g, 'kiss', 'me', 'yes', { priv, via: 'talk' });
      this._kissRecord(g, A, { counted, priv });
      this._start(() => new PairShot(this, g, 'kiss', pair, { caption: this._fill(pick(AFF_CAP.kiss[this._lineWho(g)] || AFF_CAP.kiss.star), g), by: 'me', act: A }));
      return true;
    } catch (e) { console.warn('Affection: the talk kiss', e); return false; }
  }
  /** PartyPlay's _leaveWith filter: a not yet or a no in the last minute, or her too far gone to go anywhere but home -> true (not offered) */
  leaveHold(g) {
    if (!this.on || !g) return false;
    try { const T = this._thread(g); return !!(this._coolI(T) < Infinity || this._lv(g) >= HAZY); } catch (_) { return false; }
  }
  // ---- the cooldown: a not yet or a no holds that step and those above it for COOL seconds; then she may say yes ----
  /** the lowest step on hold with her now (Infinity: none); an expired hold is dropped */
  _coolI(T) { const C = T?.cool; if (!C) return Infinity; if (num(this.ev.t, 0) >= C.until) { T.cool = null; return Infinity; } return C.I; }
  _coolLeft(T) { return this._coolI(T) < Infinity ? Math.max(0, T.cool.until - num(this.ev.t, 0)) : 0; }
  /** a refusal of step I: that step and above on hold for a minute (the lower of two holds, the later end), and a small dip in her mood that fades */
  _coolSet(T, I, no = false) {
    const t = num(this.ev.t, 0), C = this._coolI(T) < Infinity ? T.cool : null;
    T.cool = { I: C ? Math.min(C.I, I) : I, until: Math.max(C ? C.until : 0, t + COOL), no: !!(no || C?.no) };
    T.dip = num(T.dip, 0) + (no ? 1 : 0.5);
  }
  resultInto(res) {
    if (!res) return; const ev = this.ev;
    try {
      const A = this._result(); res.aff = A;
      if (ev.R?.party && typeof ev.R.party === 'object') ev.R.party.aff = A;
      // (a car home is Affection's own way out, never a walk-out: the contact is not 'gone', and the evening's score is put back)
      const n = Math.max(1, (ev.gs || []).length);
      for (const [cid, W] of Object.entries(A.with)) {
        if (!W.care?.includes('car')) continue;
        const C = res.party?.contacts?.[cid]; if (C && C.gone) { C.gone = false; C.score = Math.round(clamp(num(C.score, 0.5) + 0.25, 0, 1) * 100) / 100; }
        const P = res.per?.[cid]; if (P && P.gone) { P.gone = false; P.score = Math.round(clamp(num(P.score, 0.5) + 0.25, 0, 1) * 100) / 100; res.score = Math.round(clamp(num(res.score, 0.5) + 0.25 / n, 0, 1) * 100) / 100; }
      }
    } catch (e) { console.warn('Affection: the result', e); }
  }
  dispose() {
    if (!this.on) return; const ev = this.ev; this.ending = true;
    // (a moment of ours still playing first - it must not hand on to a link - then the link, the single frame)
    if (ev.game && ev.game.aff === this) { try { ev.game.dispose(); } catch (_) { /* */ } ev.game = null; }
    try { if (this.link) this._linkEnd('dispose', true); } catch (_) { /* */ }
    try { this._singleOff(); } catch (_) { /* */ }
    this._cardHide(); this.after.length = 0;
    this.on = false;
    try { this.pf.dispose(); } catch (e) { console.warn('Affection: the pair frames did not tidy up', e); }
    try { this.drink.dispose(); } catch (_) { /* */ }
    for (const g of ev.gs || []) if (g.n) { g.n.affHold = false; g.n.affLeave = false; }
    this.dom?.card?.remove(); this.dom = null;
    try { if (window.__aff === this) window.__aff = null; } catch (_) { /* */ }
  }

  // ---- who, and how close you already are ----------------------------------------------------------------------------
  /** star | ex | fdriver | rdriver | team | infl | biz | none */
  _who(g) {
    if (!g || g.cast || g.hidden || !g.person) return 'none';
    const pp = this.ev.party; try { if (pp?._ant?.(g)) return 'none'; } catch (_) { /* */ }
    if (g.role === 'antagonist' || g.tier === 'staff' || g.tier === 'reserved' || ['dj', 'security', 'bartender', 'stranger', 'fan', 'exnew', 'dateex'].includes(g.role)) return 'none';
    if (g.kind === 'celeb') { if (!g.id || !Celebs.CELEB?.[g.id]) return 'none'; return this._stage(g) === 'ex' ? 'ex' : 'star'; }
    if (g.kind === 'driver') { const r = g.real ?? g.n?.real; return r === false ? 'fdriver' : 'rdriver'; }
    if (g.kind === 'person') { if (g.role === 'boss' || g.role === 'eng') return 'team'; if (g.role === 'infl') return 'infl'; return 'biz'; }
    return 'none';
  }
  /** the words' who: star | partner | ex | driver | person */
  _lineWho(g) { const w = this._who(g); if (w === 'star') return this._partnerish(g) ? 'partner' : 'star'; if (w === 'ex') return 'ex'; if (w === 'fdriver' || w === 'rdriver') return 'driver'; return 'person'; }
  _bond(g) { const id = g?.kind === 'celeb' ? g.id : null; return id ? this.ev.c?.celebs?.bonds?.[id] || null : null; }
  _stage(g) { if (!g) return null; if (g.kind !== 'celeb') return g.n?.stage || null; return g.n?.stage || g.stage || this._bond(g)?.stage || 'stranger'; }
  _partnerish(g) { const s = this._stage(g); return g.role === 'partner' || s === 'partner' || s === 'dating'; }
  _thread(g) {
    const k = g.cid || g.name; let T = this.threads.get(k);
    if (!T) {
      const who = this._who(g), st = this._stage(g);
      T = { cid: k, comfort: who === 'star' || who === 'ex' ? COMFORT0[st] ?? 0 : 1, cap: Infinity, closed: false, cool: null, dip: 0, stepped: new Set(), acts: [], npc: { done: new Set(), lastT: -999, greeted: false, bold: false }, sorry: false, close: 0, herPeak: 0, linkedS: 0, danced: 0, care: [], npcKiss: null, kissRp: false, top: 0, charmed: false, kind: g.kind, role: g.role || null };
      this.threads.set(k, T);
    }
    return T;
  }
  _lv(g) { try { return num(this.drink.level(g), 0); } catch (_) { return 0; } }
  _meTier() { try { return num(this.drink.me()?.tier, 0); } catch (_) { return 0; } }
  _meLevel() { try { return num(this.drink.me()?.level, 0); } catch (_) { return 0; } }
  _dist(g) { const p = g?.person?.group?.position; return p ? Math.hypot(p.x - this.ev.pos.x, p.z - this.ev.pos.z) : 99; }
  _near() { let b = null, bd = 2.6; for (const g of this.ev._present?.() || []) { if (this._who(g) === 'none' || !g.person.group.visible) continue; const d = this._dist(g); if (d < bd) { bd = d; b = g; } } return b; }
  /** private: PartyPlay's (the terrace, the VIP with nobody within 3 m) at a party; else a private place or the quiet-minute spot, nobody else within 3 m */
  _private(g) {
    const ev = this.ev, pp = ev.party, p = g?.person?.group?.position; if (!p) return false;
    if (pp?.isPrivate) { const XP = pp.XP, was = XP ? XP.private : undefined; let r = false; try { r = !!pp.isPrivate(g); } catch (_) { r = false; } if (XP) XP.private = was; return r; }
    let priv = num(ev.privacy, 0.5) >= 0.8;
    if (!priv) for (const h of ev.hots || []) if ((h.kind === 'moment' || h.kind === 'quiet') && h.p && Math.hypot(h.p.x - p.x, h.p.z - p.z) < 2.6) { priv = true; break; }
    if (!priv) return false;
    for (const o of ev.gs || []) { if (o === g || !o.person || o.gone || !o.person.group.visible) continue; const q = o.person.group.position; if (Math.hypot(q.x - p.x, q.z - p.z) < 3) return false; }
    const S = ev.staff?.person?.group?.position; if (S && Math.hypot(S.x - p.x, S.z - p.z) < 3) return false;
    return true;
  }
  /** where she is: stand | sofa (a place beside her on the same seat) | table */
  _ctx(g) { if (g?.spot?.pose !== 'sit') return 'stand'; return this._slot(g) || this._seatedBeside(g) ? 'sofa' : 'table'; }
  _slot(g) { try { return this.pf.slot(g) || null; } catch (_) { return null; } }
  _seatedBeside(g) { const s = this.ev.seat, sp = g?.spot; if (!s || !sp || sp.pose !== 'sit') return false; if (this.link?.g === g && this.link.sit) return true; return Math.hypot(s.x - sp.x, s.z - sp.z) < 0.95; }
  _floorOk() {
    const ev = this.ev; if (ev.quiet) return false;
    if (ev.party) return !!ev.V?.zones?.floor || (ev.hots || []).some((h) => h.kind === 'dance');
    const M = ev.V?.moods?.[ev.moodI]; return (DANCE_EV.has(ev.vid) && !!M && M.music != null) || ev.occ === 'club';
  }
  _swim(g) { const ev = this.ev; return ev.occ === 'pool' || /swim|bikini|trunk|one-?piece/i.test(String(g?.opts?.kit || '')); }
  /** a reason romance is off with her tonight, or '' */
  _romBlock(g) {
    if (this._who(g) !== 'star') return 'who';
    if (this.minor) return 'minor'; if (this.quiet) return 'quiet';
    const b = this._bond(g); if (g.n?.grieving || b?.grieving) return 'grief';
    if (g.offended) return 'offended'; if ((b?.upset || 0) >= 3) return 'upset';
    if (this._lv(g) >= HAZY) return 'hazy';
    return '';
  }
  _celebrateOk(g) {
    const pp = this.ev.party, XP = pp?.XP || {}; if (!pp?.team || !(XP.podium || XP.won)) return false;
    return g.role === 'mate' || g.role === 'eng' || g.role === 'boss' || (g.kind === 'driver' && g.team && g.team === this.ev.c?.myTeam);
  }

  // ---- consent: her ceiling ------------------------------------------------------------------------------------------
  /**
   * How far she would go right now: BASE[stage] + aff/50 + dm/10 + trust + her drink + private - public - rivals - state
   * (+ noise, at an attempt) -> I she would welcome. A driver, a person: a friendly 2.3 + mood.
   */
  _ceil(g, I = 1, o = {}) {
    const who = this._who(g); if (who !== 'star' && who !== 'ex') return 2.3 + clamp(num(g.dm, 0), -6, 8) * 0.1 - (g.offended ? 3 : 0) - (g.shaken > 0 ? 2 : 0);
    const st = this._stage(g), b = this._bond(g), C = g.C?.traits || {}, ev = this.ev;
    let base = BASE[st] ?? 0.6;
    if (st === 'ex' && b?.exAt && b.exAt.season === ev.c?.season && num(ev.c?.round, 0) - num(b.exAt.round, 0) <= 4) base = 0.6;
    const aff = num(b?.aff, 0), trust = num(b?.trust, 30);
    let v = base + aff / 50 + clamp(num(g.dm, 0), -6, 8) * 0.1 + (trust >= 60 ? 0.3 : trust < 25 ? -0.5 : 0);
    const lv = this._lv(g); if (lv < HAZY) v += lv >= 5.5 ? 0.9 : lv >= 3 ? 0.45 : 0;
    const priv = o.priv ?? this._private(g); if (priv) v += 0.6;
    // (the night so far: every step she has welcomed warms her to the next; a refusal's dip fades over a minute or two)
    const T = this._thread(g); v += Math.min(4, num(T.comfort, 0)) * 0.15 - num(T.dip, 0) * 0.35;
    // (holding her now - an arm round, her hand - or a hug or a slow dance she enjoyed just now: the next step comes easier)
    v += this._heldB(g);
    if (!priv && I >= 2) {
      v -= 1.2 * num(C.privacy, 0.3); if (b?.secret) v -= 1.0;
      const pp = ev.party; if (ev.t - this.flashT < 60 || pp?.zoneK === 'door' || ev.zone === 'door') v -= 0.5;
      if (num(C.drama, 0) >= 0.45) v += 0.3;
    }
    if (I >= 2) v -= this._rival(g);
    if (num(b?.upset, 0) >= 2) v -= 1.5;
    if (this._meTier() >= 2) v -= 0.2;
    if (o.noise) v += (Math.random() * 2 - 1) * 0.45;
    return v + (o.bonus || 0);
  }
  /** someone else you are seeing, here (within 12 m): your public partner costs most */
  _rival(g) {
    const ev = this.ev, wreck = num(g.C?.traits?.wreck, 0), hb = this._bond(g); let cost = 0;
    for (const o of ev.gs || []) {
      if (o === g || o.kind !== 'celeb' || !o.person || o.gone || !o.person.group.visible) continue;
      const ob = this._bond(o); if (!ob || (ob.stage !== 'dating' && ob.stage !== 'partner') || ob.grieving) continue;
      if (this._dist(o) > 12) continue;
      if (ob.stage === 'partner' && ob.public) cost = Math.max(cost, 1.6 * (1 - wreck));
      else if (ob.public || (hb?.knows || []).includes(o.id)) cost = Math.max(cost, 1.2 * (1 - wreck));
      else cost = Math.max(cost, 0.4);
    }
    return cost;
  }
  _band(m) { return m >= 0.6 ? 'warm' : m >= -0.4 ? 'mid' : 'cool'; }
  /** close to her right now -> her ceiling's bonus: a link on (a hand, an arm round her 1.0; arm in arm, leaning 0.8), else a warm yes in the last 30 s (a hug, a dance) 0.6, else 0 */
  _heldB(g) {
    const L = this.link; if (L && L.g === g && !L.care) return (GEST[L.k]?.I || 1) >= ROM ? 1.0 : 0.8;
    const T = this.threads.get(g?.cid || g?.name); return T && num(this.ev.t, 0) - num(T.warmT, -999) < 30 ? 0.6 : 0;
  }

  // ---- the options ---------------------------------------------------------------------------------------------------
  /**
   * What G offers with her now -> { mode: 'normal' | 'care' | 'closed' | 'quiet' | 'touch', items: [{ k, chip }], keys,
   * def (the default step), read (the line), head } | null
   */
  _options(g) {
    const who = this._who(g); if (who === 'none') return null;
    const ev = this.ev, T = this._thread(g), meT = this._meTier(), lv = this._lv(g), L = this.link && this.link.g === g ? this.link : null;
    const out = { mode: 'normal', items: [], keys: [], def: null, read: '' };
    const add = (k, chip = null) => { if (!out.keys.includes(k)) { out.items.push({ k, chip }); out.keys.push(k); } };
    // (a not yet or a no in the last minute: that step and those above it wait; below it, everything as normal)
    const coolI = this._coolI(T);
    // (very drunk: looking after them is all there is - a star, a fictional driver; a real driver is never in that state)
    if (lv >= PAST && (who === 'star' || who === 'fdriver' || who === 'ex')) { out.mode = 'care'; for (const k of CARE) add(k); if (L) add('release'); out.def = 'water'; out.read = pick(AFF_READ.past); return out; }
    if (this.quiet || g.n?.grieving || this._bond(g)?.grieving) { out.mode = 'quiet'; add('quietTouch'); add('comfort'); out.def = 'comfort'; out.read = pick(AFF_READ.quiet); return out; }
    if (g.offended) { out.mode = 'touch'; add('touch'); out.def = 'touch'; out.read = pick(AFF_READ.cool); return out; }
    const ctx = this._ctx(g), beside = this._seatedBeside(g);
    let list = BY_WHO[who].filter((k) => this._ctxOk(k, ctx, g, beside));
    if (coolI < Infinity) list = list.filter((k) => GEST[k].I < coolI);
    if (who === 'ex' && num(this._bond(g)?.aff, 0) < 10) list = list.filter((k) => k !== 'hug');
    if (!this._celebrateOk(g)) list = list.filter((k) => k !== 'celebrate');
    if (who === 'star') {
      const rb = this._romBlock(g); if (rb) list = list.filter((k) => !GEST[k].rom);
      // (a link already on: its own kind is not offered again; a seated one offers the next steps on the sofa)
      if (L) list = list.filter((k) => k !== L.k && !(L.sit && (k === 'lean')));
      // (holding her, or a hug she enjoyed just now: every next step is on the table - pull her closer, a dance, a kiss)
      const held = this._heldB(g) > 0;
      const comfort = T.comfort, allow = Math.max(held ? GEST.kiss.I : 0, comfort + 2 + (lv >= 3 && lv < HAZY ? 0.5 : 0) + (this._partnerish(g) && this._stage(g) === 'partner' ? 0.5 : 0));
      const within = list.filter((k) => GEST[k].I <= allow), aboveA = list.filter((k) => GEST[k].I > allow);
      let imp = null; if (meT >= 2 && aboveA.length) imp = aboveA.slice().sort((a, b) => GEST[b].I - GEST[a].I)[0];
      const blind = meT >= 3, warm = meT === 2 ? hash(`${g.cid}|${Math.floor(ev.t / 30)}`) : 0;
      const chipOf = (k, i) => { if (blind) return null; let b = this._band(this._ceil(g, GEST[k].I) - GEST[k].I); if (meT === 2 && ((warm >>> i) & 7) < 2) b = b === 'cool' ? 'mid' : 'warm'; return b; };
      const above = within.filter((k) => GEST[k].I > comfort).sort((a, b) => GEST[a].I - GEST[b].I), at = within.filter((k) => GEST[k].I <= comfort).sort((a, b) => GEST[b].I - GEST[a].I);
      // (the default: on a sofa you are not on yet, sitting with her at the level you are at; else the lowest new step
      //  she reads as at least hard to read; else what you already have - or, a few drinks in, the impulsive one)
      let def = null;
      if (ctx === 'sofa' && !beside) def = ['cuddle', 'lean'].find((k) => within.includes(k) && GEST[k].I <= Math.max(comfort, 2)) || within.find((k) => GEST[k].seat) || null;
      if (!def) def = above.find((k) => !(GEST[k].meta) && this._ceil(g, GEST[k].I) - GEST[k].I >= -0.4) || null;
      if (!def && meT >= 2 && imp) def = imp;
      if (!def) def = at[0] || above[0] || null;
      const slots = (held ? 5 : 4) - (imp ? 1 : 0), pickL = [];
      if (def && def !== imp) pickL.push(def);
      for (const k of above) if (pickL.length < slots && !pickL.includes(k)) pickL.push(k);
      for (const k of at) if (pickL.length < slots && !pickL.includes(k)) pickL.push(k);
      if (held && within.includes('kiss') && !pickL.includes('kiss') && imp !== 'kiss') { if (pickL.length >= slots) pickL.pop(); pickL.push('kiss'); }
      pickL.forEach((k, i) => add(k, chipOf(k, i)));
      if (imp) { if (def === imp) { out.items.unshift({ k: imp, chip: 'imp' }); out.keys.unshift(imp); } else add(imp, 'imp'); }
      if (rb === 'hazy') add('water');
      if (L) add('release');
      out.def = def || (L ? 'release' : out.keys[0] || null);
      out.read = blind ? AFF_READ.drunk : lv >= HAZY ? pick(AFF_READ.hazy) : this._partnerish(g) && this._stage(g) === 'partner' ? pick(AFF_READ.partner) : pick(AFF_READ[this._band(def ? this._ceil(g, GEST[def].I) - GEST[def].I : 0)]);
    } else {
      for (const k of list) add(k);
      if (L) add('release');
      out.def = list.find((k) => k !== 'touch') || list[0] || null;
      out.read = pick(who === 'fdriver' || who === 'rdriver' ? AFF_READ.driver : who === 'ex' ? AFF_READ.mid : AFF_READ.person);
    }
    // (on hold: the menu says so - give it a minute; after a no, a sorry; nothing left below the hold: some space)
    if (coolI < Infinity) {
      if (T.cool.no && !T.sorry) add('sorry');
      out.read = pick(T.cool.no && coolI <= 1 ? AFF_READ.closed : AFF_READ.wait) + ` (${Math.ceil(this._coolLeft(T))}s)`;
      out.wait = Math.ceil(this._coolLeft(T));
      if (!out.def || !out.keys.includes(out.def)) { if (!out.keys.length) { out.mode = 'closed'; add('space'); } out.def = out.keys[0]; }
    }
    // (the default first: G twice is that step)
    if (out.def && out.keys[0] !== out.def) { const i = out.keys.indexOf(out.def); if (i > 0) { const [it] = out.items.splice(i, 1); out.items.unshift(it); out.keys.splice(i, 1); out.keys.unshift(out.def); } }
    return out;
  }
  _ctxOk(k, ctx, g, beside) {
    const G0 = GEST[k]; if (!G0) return false;
    switch (G0.ctx) {
      case 'any': return true;
      case 'stand': return ctx === 'stand';
      case 'sofa': return ctx === 'sofa' && (!G0.beside || beside);
      case 'table': return ctx === 'table';
      case 'standsofa': return ctx === 'stand' || (ctx === 'sofa' && beside);
      case 'floor': return ctx === 'stand' && this._floorOk();
      default: return false;
    }
  }
  _label(k, g) {
    const w = this._lineWho(g), wk = w === 'driver' ? 'driver' : w === 'person' ? 'person' : 'star', beside = this._seatedBeside(g);
    let key = k; if (k === 'lean' && !beside) key = 'sitLean'; else if (k === 'cuddle' && !beside) key = 'sitCuddle';
    const T = AFF_LABEL[key]; if (!T) return k; const v = T[wk] || T.star || T.driver || T.person;
    return this._fill((v && (this._meTier() >= 2 ? v[1] : v[0])) || k, g);
  }
  _short(k, g) {
    const w = this._lineWho(g), wk = w === 'driver' ? 'driver' : w === 'person' ? 'person' : 'star', beside = this._seatedBeside(g);
    let key = k; if (k === 'lean' && !beside) key = 'sitLean'; else if (k === 'cuddle' && !beside) key = 'sitCuddle';
    const T = AFF_SHORT[key]; return (T && (T[wk] || T.star || T.driver || T.person)) || '';
  }
  _promptLabel(g) {
    const C = this.plCache, ev = this.ev; if (C.g === g && ev.t - C.t < 0.5) return C.lab;
    let lab = ''; try { const O = this._options(g); if (O?.def) lab = this._short(O.def, g); } catch (_) { lab = ''; }
    C.g = g; C.t = ev.t; C.lab = lab; return lab;
  }

  // ---- the menu ------------------------------------------------------------------------------------------------------
  _menuOpen(g) {
    const ev = this.ev, O = this._options(g); if (!O || !O.items.length) { ev._toast?.('Not now.', ''); return; }
    const lw = this._lineWho(g), st = this._stage(g), lv = this._lv(g);
    const stage = g.kind === 'celeb' ? (Celebs.stageLabel?.(st) || '') : g.kind === 'driver' ? (g.role === 'mate' ? 'Team-mate' : { acquaintance: 'Acquaintance', friendly: 'Friendly', friend: 'Friend', mate: 'Mate', best: 'Best mate' }[st] || 'Driver') : (g.role ? { boss: 'Team principal', eng: 'Race engineer', infl: 'Influencer', rep: 'Sponsor', agent: 'Agent', press: 'Press' }[g.role] || '' : '');
    const drinking = !!ev.party || ev.occ === 'pool' || !this.drink.stub;
    const word = drinking && lw !== 'person' && !(g.kind === 'driver' && this._who(g) === 'rdriver' && lv < 3) ? AFF_DRINK_WORD[lv >= PAST ? 4 : lv >= HAZY ? 3 : lv >= 5.5 ? 2 : lv >= 3 ? 1 : 0] : '';
    const who = [g.name, stage, word].filter(Boolean).join(' · ');
    const items = O.items.map((it) => this._label(it.k, g)); items.push('Not now');
    const keys = O.keys.slice();
    ev._menu(who, O.read || '', items, (i) => { const k = keys[i]; if (k) this.attempt(g, k, 'menu'); });
    if (!ev.menu) return; ev.menu.aff = true;
    try {
      const btns = ev.$('.hg-talk .opts').querySelectorAll('button');
      O.items.forEach((it, i) => { const el = btns[i]?.querySelector('i'); if (!el || !it.chip) return; el.textContent = AFF_CHIP[it.chip] || ''; el.className = 'aff-' + it.chip; if (GEST[it.k]?.rom) btns[i].dataset.tone = 'flirt'; });
      const nx = ev.$('.hg-talk .next'); if (nx) nx.textContent = `1-${items.length} · G = 1 · ESC TO CLOSE`;
    } catch (_) { /* (the labels alone) */ }
  }
  _closerPick() { const C = this.closerK; if (!C) return; this.closerK = null; const ev = this.ev; try { ev._leaveTalk?.(); } catch (_) { /* */ } this.attempt(C.g, C.k, 'closer'); }

  // ---- an attempt: the one path G, the closer and the dance's card all take -------------------------------------------
  /** try a gesture with g (src: menu | closer | dance | test; o.bonus: a warm dance's +0.3) -> 'yes' | 'notyet' | 'no' | 'deferred' | null */
  attempt(g, k, src = 'menu', o = {}) {
    if (!this.on || !g?.person || g.gone) return null; const ev = this.ev, G0 = GEST[k]; if (!G0) return null;
    if (ev.game || this.busy) { this.after.push(() => this.attempt(g, k, src, o)); return 'deferred'; }
    const T = this._thread(g), who = this._who(g);
    if (k === 'release') { this._linkEnd('let go'); return 'yes'; }
    if (k === 'space') { this._space(g); return 'yes'; }
    if (k === 'sorry') { this._sorry(g); return 'yes'; }
    if (G0.care) { this._care(g, k); return 'yes'; }
    // (what the menu offers is what may be tried; the dance's end card offers the kiss on its own - still never past a
    //  not yet, a no or a hard stop)
    const cool = !G0.meta && !G0.care && !G0.quiet && G0.I >= this._coolI(T);
    if (cool && src !== 'dance') { ev._toast?.(`${AFF_TOAST.wait} (${Math.ceil(this._coolLeft(T))}s)`, ''); return null; }
    if (src === 'menu' || src === 'closer') { const O = this._options(g); if (!O || !O.keys.includes(k)) { ev._toast?.('Not now.', ''); return null; } }
    else if (src === 'dance' && (cool || this._romBlock(g))) { ev._caption?.(pick(AFF_DANCE.hold), 2.6); return null; }
    // (a driver, a person, a quiet hug: no roll - unless they are upset with you)
    if (who !== 'star' && who !== 'ex') { if (g.offended || g.shaken > 0) { ev._toast?.(`${g.first} needs a minute.`, ''); return null; } return this._yes(g, k, { by: 'me' }); }
    if (G0.quiet) return this._yes(g, k, { by: 'me' });
    const force = flag('__affYes') ? 'yes' : flag('__affNo') ? 'no' : o.force || null; if (force) { unflag('__affYes'); unflag('__affNo'); }
    // (hard stops: you are drunk - a kind not yet, then a no; she has had a lot - not tonight)
    if (G0.rom && !force) {
      if (this._meTier() >= 3) { this.drunkTries++; return this.drunkTries === 1 ? this._notYet(g, k, 'drunkYou') : this._no(g, k, 'drunkYou'); }
      if (this._lv(g) >= HAZY) return this._notYet(g, k, 'hazy');
      if (this._romBlock(g)) return null;
    }
    const priv = this._private(g), I = G0.I, m = this._ceil(g, I, { noise: true, priv, bonus: o.bonus || 0 }) - I;
    if (force === 'yes' || (!force && m >= 0)) return this._yes(g, k, { by: 'me', priv, margin: m });
    const why = this._stage(g) === 'stranger' || this._stage(g) === 'met' ? 'stranger' : this._rival(g) >= 1 ? 'rival' : !priv && I >= 2 && this._bond(g)?.secret ? 'secret' : !priv && I >= 2 && num(g.C?.traits?.privacy, 0) >= 0.5 ? 'public' : 'general';
    if (force === 'no' || m < -1) return this._no(g, k, why);
    return this._notYet(g, k, why);
  }
  _yes(g, k, o = {}) {
    const ev = this.ev, T = this._thread(g), G0 = GEST[k], I = G0.I, by = o.by || 'me', who = this._who(g), pp = ev.party, priv = o.priv ?? this._private(g);
    // (her own move: what she did herself is no longer above what you may ask - a not yet on it is lifted)
    T.comfort = Math.max(T.comfort, I); if (by === 'her' && this._coolI(T) <= I) T.cool = null;
    // (warmth builds: every hug or arm round she welcomes brings the next step nearer - two or three, and romance is on the
    //  table; and for half a minute after a warm yes the next step comes easier - see _heldB)
    if (who === 'star' && I >= 1 && !G0.quiet) { if (I < ROM && T.comfort < ROM) T.comfort = Math.min(ROM, T.comfort + 0.75); T.warmT = ev.t; }
    if (k !== 'kiss') g.dm += k === 'touch' || k === 'quietTouch' ? 0.3 : I < 2 ? 0.5 : I < 3 ? 0.8 : I < 4 ? 1.2 : 1.5;
    const A = this._act(g, k, by, 'yes', { priv });
    if (k === 'selfie') { ev.snd?.shutter?.(); if (pp?.Rp) pp.Rp.selfies = num(pp.Rp.selfies, 0) + 1; }
    if (pp && who === 'star') {
      // (live, as the talk's flirt is: partyResult reads them per guest; a private moment is counted as private)
      const st = this._stage(g);
      if (k === 'hug' && (st === 'met' || st === 'friendly' || st === 'stranger') && !T.charmed) { T.charmed = true; g.fx.charm = (g.fx.charm || 0) + 1; }
      if (G0.rom && k !== 'kiss' && k !== 'dance') { g.fx.flirt = (g.fx.flirt || 0) + 1; if (priv) g.ppPriv = (g.ppPriv || 0) + 1; }
      if (G0.rom) { const XP = pp.XP; if (XP && Array.isArray(XP.flirted) && !XP.flirted.includes(g.cid)) XP.flirted.push(g.cid); }
      if (st === 'stranger') { g.stage = 'met'; if (g.n) g.n.stage = 'met'; }
    }
    if (k === 'kiss') this._kissRecord(g, A, { counted: false, priv, by });
    if (G0.rom && !this.firstRom && by === 'me') { this.firstRom = true; setTimeout(() => this.on && ev._toast?.(this._fill(pick(AFF_TOAST.firstYes), g), 'up'), 900); }
    // (escalating from a link with her - a kiss from holding hands: the link lets go first, quietly)
    if (this.link?.g === g && !G0.link) this._linkEnd('swap', true);
    this._play(g, k, { by, act: A, caption: o.caption, then: o.then });
    return 'yes';
  }
  _notYet(g, k, why = 'general') {
    const ev = this.ev, T = this._thread(g), I = GEST[k].I;
    if (why !== 'drunkYou' && why !== 'hazy') this._coolSet(T, I, false);
    if (I >= ROM && why !== 'drunkYou') g.dm -= 0.5;
    this._act(g, k, 'me', 'notyet', { why });
    const lw = this._lineWho(g);
    const line = why === 'drunkYou' ? pick(AFF_NOTYET.drunkYou) : why === 'hazy' ? pick(AFF_NOTYET.hazy) : why === 'secret' ? pick(AFF_NOTYET.secret) : lw === 'partner' ? pick(AFF_NOTYET.partner) : pick(k === 'kiss' ? AFF_NOTYET.kiss : I >= ROM ? AFF_NOTYET.rom : AFF_NOTYET.plat);
    // (she turns it into a hug, where a hug is welcome and you are both standing; else a kind word)
    // (holding her already: she keeps hold of you - a word, no hug shot over the link)
    const hugOk = why !== 'drunkYou' && why !== 'hazy' && I > 1 && this._ctx(g) === 'stand' && this._ceil(g, 1) >= 1 && this.link?.g !== g;
    if (hugOk) { this._play(g, 'hug', { by: 'her', act: null, caption: pick(AFF_NOTYET.hug), then: () => ev._bark?.(g, this._fill(line, g)) }); }
    else ev._bark?.(g, this._fill(line, g));
    return 'notyet';
  }
  _no(g, k, why = 'general') {
    const ev = this.ev, T = this._thread(g);
    // (a no holds that step and those above it for a minute - never the night; she steps back for a few seconds)
    this._coolSet(T, GEST[k].I, true); g.shaken = 12; g.dm -= 1;
    this._act(g, k, 'me', 'no', { why });
    if (this.link?.g === g) this._linkEnd('no', true);
    // (she steps back half a metre, if she is standing and there is room - her spot and disc with her)
    const gp = g.person.group, P = ev.pos;
    if (g.spot?.pose !== 'sit') {
      const dx = gp.position.x - P.x, dz = gp.position.z - P.z, d = Math.hypot(dx, dz) || 1, x = gp.position.x + (dx / d) * 0.45, z = gp.position.z + (dz / d) * 0.45;
      if (ev._free(x, z, 0.24, g.disc)) { gp.position.x = x; gp.position.z = z; g.spot = { ...(g.spot || {}), x, z }; if (g.disc) { g.disc.x = x; g.disc.z = z; } }
      g.face0 = facing(P.x - gp.position.x, P.z - gp.position.z);
    }
    const line = why === 'drunkYou' ? pick(AFF_NO.drunkYou) : pick(AFF_NO[why] || AFF_NO.general);
    ev._bark?.(g, this._fill(line, g), 3.4);
    ev._toast?.(this._fill(AFF_TOAST.no, g), 'down');
    this._logLine(`${g.first} said no.`);
    return 'no';
  }
  _space(g) { const ev = this.ev; ev._toast?.(this._fill(pick(AFF_SORRY.space), g), ''); const T = this._thread(g); T.space = (T.space || 0) + 1; }
  _sorry(g) {
    const ev = this.ev, T = this._thread(g); if (T.sorry) { this._space(g); return; }
    T.sorry = true; g.dm += 1; this._act(g, 'sorry', 'me', 'yes', {});
    ev._caption?.(`"${pick(AFF_SORRY.you)}"`, 2); setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(g, this._fill(pick(AFF_SORRY.her), g), 3); }, 1700);
  }

  // ---- the records -------------------------------------------------------------------------------------------------------
  /** one act into her thread (seen by whom, photographed, how much each of you had) -> the act */
  _act(g, k, by, ans, o = {}) {
    const ev = this.ev, T = this._thread(g), I = GEST[k]?.I ?? 0, priv = o.priv ?? this._private(g);
    const A = { k, at: +num(+ev.clock, 0).toFixed(2), by, ans, priv: !!priv, photo: false, seenBy: [], tier: tierOf(this._lv(g)), you: this._meTier(), act: this.act };
    if (o.why) A.why = o.why; if (o.via) A.via = o.via;
    if (I >= 2 && ans !== 'veto') A.seenBy = priv ? [] : this._seenBy(g);
    T.acts.push(A); if (T.acts.length > 40) T.acts.splice(0, T.acts.length - 40);
    if ((ans === 'yes' || ans === 'back') && I > T.top) T.top = I;
    // (someone you are seeing saw it happen: her face says so; a public romantic act may be photographed)
    if ((ans === 'yes' || ans === 'back') && I >= 2) { this._sawIt(g, A); if (!priv && k !== 'kiss') this._photoRoll(g, k, A); }
    return A;
  }
  _seenBy(g) {
    const ev = this.ev, P = ev.pos, out = [];
    for (const o of ev.gs || []) {
      if (o === g || !o.person || o.gone || !o.person.group.visible || o.cast || !o.cid) continue;
      const q = o.person.group.position, dx = P.x - q.x, dz = P.z - q.z, d = Math.hypot(dx, dz); if (d > 12) continue;
      if (d < 5) { out.push(o.cid); continue; }
      const r = o.person.group.rotation.y; if ((Math.cos(r) * dx - Math.sin(r) * dz) / d >= -0.2) out.push(o.cid);
    }
    return out;
  }
  /** the ones you are seeing who saw a romantic act: her bark, her mood (and at a party, her fx.jealous) */
  _sawIt(g, A) {
    const ev = this.ev; if (!A.seenBy.length) return;
    for (const cid of A.seenBy) {
      const w = (ev.gs || []).find((q) => q.cid === cid); if (!w || w === g || w.kind !== 'celeb') continue;
      const b = this._bond(w); if (!b || (b.stage !== 'dating' && b.stage !== 'partner') || b.grieving) continue;
      w.dm -= 3; if (ev.party) w.fx.jealous = (w.fx.jealous || 0) + 1;
      if (ev.t - this.sawT > 30) { this.sawT = ev.t; setTimeout(() => { if (this.on && !ev.closing) { ev._bark?.(w, pick(AFF_SAW.partner), 3); ev._toast?.(this._fill(AFF_TOAST.saw, w), 'warn'); } }, 2400); }
    }
  }
  _fameK(g) { const pp = this.ev.party, me = pp ? num(pp.fame, 40) : 40, her = num(g?.C?.fame, 50); return clamp(0.3 + 0.7 * Math.max(me, her) / 100, 0.3, 1); }
  _privacy() { const ev = this.ev; return clamp(num(ev.party ? ev.P?.privacy : ev.privacy, 0.4), 0, 1); }
  /** a public act on camera: once per kind a night, (1 - privacy) x fame x how much of a picture it is (London: phones stickered) */
  _photoRoll(g, k, A) {
    const kk = PHOTO_K[k]; if (!kk || this.photoK.has(k) || this.quiet) return false;
    const ev = this.ev, pp = ev.party;
    const p = flag('__affPaps') ? 1 : (1 - this._privacy()) * this._fameK(g) * kk * (pp?.london ? 0.1 : 1);
    if (Math.random() >= p) return false;
    this.photoK.add(k); A.photo = true; this.photos.push({ cid: g.cid, k });
    if (pp) { pp.Rp.flashes = num(pp.Rp.flashes, 0) + 1; try { pp._flashDom?.(null); } catch (_) { /* */ } setTimeout(() => this.on && ev._toast?.(AFF_TOAST.shot, 'warn'), 1200); }
    else { try { if (ev.V?.paps?.length) ev._flash(); else { ev.R.seen = true; ev._toast?.(AFF_TOAST.flash, 'warn'); } } catch (_) { /* */ } }
    try { papsSeen(ev, null, 'personal'); } catch (_) { /* */ }   // paps hook: a private moment, photographed
    return true;
  }
  /** a kiss on the lips, recorded: at a party the night's first goes where PartyPlay keeps it (its own seen formula) */
  _kissRecord(g, A, o = {}) {
    const ev = this.ev, pp = ev.party, T = this._thread(g), priv = !!o.priv; this.lastKissT = ev.t; g.dm += 2;
    if (pp?.Rp) {
      const Rp = pp.Rp;
      if (!Rp.kiss) {
        const z = pp.zoneK, privacy = num(ev.P?.privacy, 0.25), P = ev.pos;
        const seen = flag('__partyPaps') ? !priv : pp.london ? Math.random() < 0.06 : priv ? false : Math.random() < (z === 'floor' ? 0.6 : 0.35) * (1 - privacy) + 0.1;
        const by = priv ? [] : (ev.gs || []).filter((q) => q !== g && q.person?.group?.visible && !q.gone && Math.hypot(q.person.group.position.x - P.x, q.person.group.position.z - P.z) < 12).map((q) => q.cid);
        Rp.kiss = g.cid; Rp.kissSeen = !!seen; Rp.kissSeenBy = by; Rp.kissPrivate = priv;
        if (!o.counted) { g.fx.kiss = (g.fx.kiss || 0) + 1; ev.R.fx.kiss = (ev.R.fx.kiss || 0) + 1; } if (priv) g.ppPriv = (g.ppPriv || 0) + 1;
        if (A) { A.kissRp = true; A.photo = !!seen; } T.kissRp = true;
        if (seen) { this.photos.push({ cid: g.cid, k: 'kiss' }); this.photoK.add('kiss'); setTimeout(() => this.on && ev._toast?.(pp.london ? 'Somebody in here has a phone without a sticker.' : 'A phone came up somewhere on the floor.', 'warn'), 2600); }
      } else if (A && !priv) this._photoRoll(g, 'kiss', A);
      if (pp.XP) pp.XP.kissed = g.cid;
    } else if (A && !priv) this._photoRoll(g, 'kiss', A);
  }
  _logLine(s) { if (this.log.length < 4 && s) this.log.push(s); }

  // ---- playing it out ------------------------------------------------------------------------------------------------
  /** the gesture, seen: a caption, a two-shot (built under a blink if it must be), a link, the dance */
  _play(g, k, o = {}) {
    const ev = this.ev, G0 = GEST[k], lw = this._lineWho(g), tipsy = this._lv(g) >= 3 && this._lv(g) < HAZY;
    const yes = () => { const b = AFF_YES[k]; let L = b && (b[lw] || b.star || b.driver || b.person); if (tipsy && lw !== 'driver' && Math.random() < 0.5) L = k === 'kiss' ? AFF_YES_TIPSY.kiss : G0.rom ? AFF_YES_TIPSY.rom : AFF_YES_TIPSY.plat; return L ? this._fill(pick(L), g) : ''; };
    const after = () => { const s = o.then ? null : yes(); if (o.then) o.then(); else if (s) ev._bark?.(g, s, 2.8); };
    if (k === 'touch') { ev._caption?.(this._fill(lw === 'driver' ? 'A clap on the back.' : lw === 'person' ? 'A handshake.' : 'A hand on her arm.', g), 1.6); g.nod = 1; after(); return; }
    if (k === 'quietTouch') { this._start(() => new CaptionMoment(this, g, this._fill(pick(AFF_QUIET.touch), g), 3, after)); return; }
    if (k === 'comfort') { this._start(() => new CaptionMoment(this, g, this._fill(pick(AFF_QUIET.hug), g), 4.6, after)); return; }
    if (G0.single) { this._singleOn(g, G0.single, this._fill(pick(AFF_CAP.reach.star), g)); after(); return; }
    if (G0.dance) { this._danceStart(g, o); return; }
    const sofa = this._ctx(g) === 'sofa', beside = this._seatedBeside(g);
    // (a cheek kiss on the sofa: the two of you as you are, a caption)
    if (k === 'cheek' && sofa) { this._start(() => new CaptionMoment(this, g, this._fill(pick(AFF_CAP.cheek.star), g), 2.4, after)); return; }
    const pair = sofa && G0.seatPair ? G0.seatPair : G0.pair; if (!pair) { after(); return; }
    const capL = AFF_CAP[k], cap = o.caption || (capL ? this._fill(pick(capL[lw] || capL.star || capL.driver || capL.person), g) : '');
    const needSeat = !!G0.seat && !beside, needStand = !G0.seat && !!ev.seat && g.spot?.pose !== 'sit';
    let need = []; try { need = this.pf.stub ? [] : this.pf.need(pair, g) || []; } catch (_) { need = []; }
    const go = () => this._start(() => new PairShot(this, g, k, pair, { caption: cap, by: o.by || 'me', act: o.act, then: after }));
    if (needSeat || needStand || need.length) {
      this._blink(() => {
        if (needStand) ev._stand?.();
        if (needSeat) { const s = this._slot(g); if (s) { ev._sit?.({ x: s.x, z: s.z, yaw: s.yaw, eye: s.eye }); this.seatMine = ev.seat; } }
        if (need.length) { try { this.pf.build(pair, g, need.length > 1 ? 2 : 1); } catch (e) { console.warn('Affection: a pair frame under the blink', e); } }
        go();
      });
    } else go();
  }
  /** a game of ours on ev.game now, or as soon as the one there has ended */
  _start(make) {
    const ev = this.ev; if (!this.on || ev.closing) return false;
    if (ev.game || ev.talk || ev.menu) { this.after.push(() => this._start(make)); return false; }
    let G = null; try { G = make(); } catch (e) { console.warn('Affection: a moment could not start', e); return false; }
    G.aff = this; ev.game = G; ev.helpT = 0; const h = ev.$?.('.hg-help'); if (h) h.style.opacity = '0'; ev.$?.('.hg-prompt')?.classList.remove('in'); ev.prHtml = null;
    return true;
  }
  /** a short cover (220 ms) to move people and build a body behind; the moment plays as a caption if it cannot */
  _blink(fn) {
    const ev = this.ev, C = ev.cover; if (this.busy) { this.after.push(() => this._blink(fn)); return; }
    if (!C) { try { fn(); } catch (e) { console.warn('Affection: a blink', e); } return; }
    this.busy = true; C.classList.add('fast'); C.classList.remove('off');
    setTimeout(() => { try { if (this.on && !ev.closing) fn(); } catch (e) { console.warn('Affection: a blink', e); } finally { this.busy = false; if (!ev.closing) C.classList.add('off'); } }, 220);
  }
  /** a pair's placement applied: you where the pair has you (her where she is), facing as it says */
  _applyPlace(P, g, seated) {
    const ev = this.ev;
    if (!seated) { ev.pos.x = P.ax; ev.pos.z = P.az; if (Number.isFinite(P.ayaw)) ev.yaw = P.ayaw; }
    const gp = g.person.group; if (Number.isFinite(P.bx)) { gp.position.x = P.bx; gp.position.z = P.bz; } if (Number.isFinite(P.byaw)) { gp.rotation.y = P.byaw; g.face0 = P.byaw; }
    if (g.disc && Number.isFinite(P.bx)) { g.disc.x = P.bx; g.disc.z = P.bz; }
  }
  /** a shot is over: a link goes on, anything else puts you back a step from her, in first person */
  _shotDone(S, user) {
    const ev = this.ev, g = S.g, T = this._thread(g), pf = this.pf, ending = !this.on || this.ending || ev.closing;
    // (her own move, ended by you inside three seconds: she will not try that again tonight)
    if (S.by === 'her' && user && S.t < 3) { T.stepped.add(S.k); T.npc.done.add(S.k); }
    if (S.link && !ending && g.person && !g.gone && !(S.by === 'her' && user && S.t < 3)) { this._linkStart(g, S.k, S.pair, S.by); }
    // (a star's hug, dance, cheek kiss or kiss she welcomed, standing: she stays in your arms, hers round your neck -
    //  the 'close' hold - instead of a step back; let go as from any hold)
    else if (!ending && g.person && !g.gone && !g.n?.real && !GEST[S.k]?.seat && ['hug', 'close', 'dance', 'cheek', 'kiss'].includes(S.k) && !(this._coolLeft(T) > 0) && !(S.by === 'her' && user && S.t < 3)) {
      g.face0 = S.face0; this._linkStart(g, 'close', 'embrace', S.by);
    }
    else {
      try { if (S.framed) pf.show(S.pair, g, false); } catch (_) { /* */ }
      g.face0 = S.face0;
      if (S.framed && !GEST[S.k]?.seat) this._stepBack(g, S);
    }
    ev.pitch = -0.06; if (ending) return;
    try { S.o?.then?.(); } catch (e) { console.warn('Affection: after a moment', e); }
  }
  /** you a step back from her after a hug or a kiss (a free place, else where you were) */
  _stepBack(g, S) {
    const ev = this.ev, q = g.person?.group?.position; if (!q) return;
    const dx = S.p0x - q.x, dz = S.p0z - q.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d;
    for (const r of [0.8, 0.95, 1.15]) { const x = q.x + ux * r, z = q.z + uz * r; if (ev._free(x, z, 0.24, g.disc)) { ev.pos.x = x; ev.pos.z = z; ev.yaw = Math.atan2(q.z - z, q.x - x); return; } }
    if (ev._free(S.p0x, S.p0z, 0.2)) { ev.pos.x = S.p0x; ev.pos.z = S.p0z; ev.yaw = Math.atan2(q.z - S.p0z, q.x - S.p0x); }
    else { this.discFix.push({ g, r0: g.disc?.r ?? 0.3 }); if (g.disc) g.disc.r = 0; }
  }
  /** the camera on her face from where you stand (a shot without bodies) */
  _lookAtHer(g, dt, k = 3) {
    const ev = this.ev, P = g?.person; if (!P) { ev._camera?.(dt); return; }
    const hp = this._v0; (P.head || P.group).getWorldPosition(hp); ev._toL?.(hp); hp.y -= 0.06;
    const dx = hp.x - ev.pos.x, dz = hp.z - ev.pos.z, wy = Math.atan2(dz, dx), wp = clamp(Math.atan2(hp.y - ev.pos.y, Math.hypot(dx, dz)), -0.7, 0.5), a = Math.min(1, dt * k);
    ev.yaw += wrap(wy - ev.yaw) * a; ev.pitch += (wp - ev.pitch) * a; ev._camera?.(dt);
  }
  _push(g) { const C = this.ev.crowd; if (!C?.push) return; try { const p = g?.person?.group?.position; if (p) C.push(p.x, p.z, 1.2); C.push(this.ev.pos.x, this.ev.pos.z, 0.9); } catch (_) { /* */ } }
  _fov(f) { const cam = this.ev.cam; if (cam && Number.isFinite(f) && Math.abs(cam.fov - f) > 1e-3) { cam.fov = f; cam.updateProjectionMatrix(); } }
  /** her own single frame for a while (a hand across the table; a seat when very drunk) */
  _singleOn(g, pose, cap, dur = 6) {
    const ev = this.ev; this._singleOff();
    let ok = false; try { ok = !this.pf.stub && !!this.pf.single(g, pose); } catch (_) { ok = false; }
    if (ok) this.single = { g, pose, t: dur };
    if (cap) ev._caption?.(cap, 2.6);
  }
  _singleOff() { const S = this.single; if (!S) return; this.single = null; try { this.pf.single(S.g, null); } catch (_) { /* */ } }

  // ---- the dance close ---------------------------------------------------------------------------------------------------
  _danceStart(g, o = {}) {
    const ev = this.ev, pp = ev.party, F = ev.V?.zones?.floor;
    const onFloor = !pp || !F || pp.zoneK === 'floor';
    let need = []; try { need = this.pf.stub ? [] : this.pf.need('embrace', g) || []; } catch (_) { need = []; }
    const go = () => this._start(() => new DanceShot(this, g, o));
    if (!onFloor || need.length || ev.seat) {
      this._blink(() => {
        if (ev.seat) ev._stand?.();
        if (!onFloor && pp?._place) { const R = Array.isArray(F) ? F[0] : F, x = (R.x0 + R.x1) / 2, z = (R.z0 + R.z1) / 2; try { if (pp._place(g, x, z, 1.0)) { const q = g.person.group.position, a = Math.random() * 6.28; for (const r of [0.8, 1.0]) { const mx = q.x + Math.cos(a) * r, mz = q.z + Math.sin(a) * r; if (ev._free(mx, mz, 0.2, g.disc)) { ev.pos.x = mx; ev.pos.z = mz; ev.yaw = Math.atan2(q.z - mz, q.x - mx); break; } } } } catch (e) { console.warn('Affection: to the floor', e); } }
        if (need.length) { try { this.pf.build('embrace', g, 2); } catch (_) { /* */ } }
        go();
      });
    } else go();
  }
  _danceDone(D) {
    const ev = this.ev, g = D.g, T = this._thread(g), pp = ev.party, pf = this.pf;
    try { if (D.framed) pf.show('embrace', g, false); } catch (_) { /* */ }
    g.face0 = D.face0; if (D.framed) this._stepBack(g, D);
    T.danced++; g.dm += 1.5;
    if (pp?.Rp && g.kind === 'celeb') {
      pp.Rp.danced.push({ cid: g.cid, score: 0.8 }); const XP = pp.XP;
      if (XP) { if (Array.isArray(XP.danced) && !XP.danced.includes(g.cid)) XP.danced.push(g.cid); if (Array.isArray(XP.flirted) && !XP.flirted.includes(g.cid)) XP.flirted.push(g.cid); }
      g.fx.dance = (g.fx.dance || 0) + 1; ev.R.fx.dance = (ev.R.fx.dance || 0) + 1;
    }
    // (her head on your shoulder: a kiss now is welcome more often than not - still her yes or not yet, never past a hold)
    T.warmT = ev.t;
    if (D.choice === 0) this.after.push(() => this.attempt(g, 'kiss', 'dance', { bonus: 0.6 }));
    else setTimeout(() => { if (this.on && !ev.closing) ev._caption?.(pick(AFF_DANCE.hold), 2.6); }, 120);
  }
  // ---- the response card (her kiss; the dance's end) ------------------------------------------------------------------------
  _cardShow(head, labels, fn) {
    const el = this.dom?.card; if (!el) { fn(1); return; }   // (no card to show: what time running out would choose)
    this.ev._unlock?.();   // (a click during the dance locked the pointer again: the card's buttons must be clickable)
    el.innerHTML = `<header>${esc(head)}</header><div class="aff-b">${labels.map((s, i) => `<button type="button" data-i="${i}"><kbd>${i + 1}</kbd>${esc(s)}</button>`).join('')}</div><s><u></u></s>`;
    el.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => fn(+b.dataset.i)));
    this.cardU = el.querySelector('s u'); requestAnimationFrame(() => el.classList.add('in'));
  }
  _cardTick(f) { const u = this.cardU; if (u) u.style.transform = `scaleX(${Math.max(0, 1 - f).toFixed(3)})`; }
  _cardHide() { this.dom?.card?.classList.remove('in'); this.cardU = null; }
  _dom() {
    const ev = this.ev, ui = ev.$?.('.hg-ui'); if (!ui || this.dom) return;
    if (!document.getElementById('aff-css')) { const st = document.createElement('style'); st.id = 'aff-css'; st.textContent = CSS; document.head.appendChild(st); }
    const card = document.createElement('div'); card.className = 'aff-card'; ui.appendChild(card);
    this.dom = { card };
  }

  // ---- links: hand in hand, an arm round, leaning together, cuddled up ------------------------------------------------
  _linkStart(g, k, pair, by = 'me') {
    const ev = this.ev; if (this.link) this._linkEnd('swap', true);
    const sit = !!GEST[k]?.seat;
    this.link = { g, k, pair, by, t: 0, sit, seat: ev.seat, r0: g.disc ? g.disc.r : 0.3, face0: g.face0, bow0: g.person?.bow ?? 0, paused: false, block: 0, timeout: by === 'her' ? 40 + Math.random() * 50 : 0, mx: ev.pos.x, mz: ev.pos.z, care: false };
    if (g.disc) g.disc.r = 0;
    try { this.pf.show(pair, g, true); } catch (_) { /* */ }
    if (ev.me) ev.me.group.visible = false;
    ev.prHtml = null;
  }
  _linkTick(dt) {
    const L = this.link, g = L.g, ev = this.ev; L.t += dt;
    if (!g.person || g.gone) { this._linkEnd('gone', true); return; }
    // (PartyPlay's dance, a moment, a scuffle, the way out: the link lets go, and her body is the game's)
    if (ev.game && ev.game.aff !== this) { this._linkEnd('game', true); return; }
    if (L.sit) { if (ev.seat !== L.seat) { this._linkEnd('stood'); return; } try { this.pf.heads(L.pair, g, 1); } catch (_) { /* */ } return; }
    if (ev.talk?.g === g) { if (!L.paused) { L.paused = true; try { this.pf.show(L.pair, g, false); } catch (_) { /* */ } } return; }
    if (ev.game || ev.moment || ev.menu || ev.ask) return;
    const d = this._dist(g);
    if (L.paused) { if (d < 1.2) { L.paused = false; try { this.pf.show(L.pair, g, true); } catch (_) { /* */ } } else if (d > 6) this._linkEnd('far'); return; }
    const mv = Math.hypot(ev.pos.x - L.mx, ev.pos.z - L.mz) > 0.002; L.mx = ev.pos.x; L.mz = ev.pos.z;
    let r = 'ok'; try { r = this.pf.follow(g, L.k === 'hand' ? 'hand' : 'side', dt, mv); } catch (_) { r = 'ok'; }
    if (r === 'blocked') { L.block += dt; if (L.block > 1.5) { this._linkEnd('lost'); return; } } else L.block = 0;
    try { this.pf.heads(L.pair, g, 1); } catch (_) { /* */ }
  }
  /** the slow checks (1 Hz): too far, the moment gone (her ceiling), your partner in view, her own lean timing out */
  _linkCheck() {
    const L = this.link, g = L.g, ev = this.ev, pp = ev.party;
    if (!g.person || g.gone) { this._linkEnd('gone', true); return; }
    if (pp && (pp.exiting || pp.brawl)) { this._linkEnd('game', true); return; }
    if (!L.sit && this._dist(g) > 6) { this._linkEnd('far'); return; }
    if (L.timeout && L.t > L.timeout) { this._linkEnd('timeout'); return; }
    if (L.care) return;
    const I = GEST[L.k]?.I || 1; if (this._who(g) === 'star' && I >= 2 && this._ceil(g, I) < I - 0.5) { this._linkEnd('notHere'); return; }
    for (const o of ev.gs || []) {
      if (o === g || o.kind !== 'celeb' || !o.person?.group?.visible || o.gone) continue; const b = this._bond(o); if (!b || (b.stage !== 'dating' && b.stage !== 'partner') || b.grieving) continue;
      if (I >= 1.5 && this._seenBy(g).includes(o.cid)) { this._linkEnd('partner'); return; }
    }
  }
  _linkEnd(why = 'let go', quiet = false) {
    const L = this.link; if (!L) return; this.link = null; const ev = this.ev, g = L.g, T = this._thread(g);
    T.linkedS += L.t;
    if (L.by === 'her' && L.t < 3 && why === 'let go') { T.stepped.add(L.k); T.npc.done.add(L.k); }
    try { this.pf.release(g); } catch (e) { console.warn('Affection: a release', e); }
    const P = g.person, p = P?.group?.position;
    if (P) { P.bow = L.bow0; if (g.drink) g.drink.visible = true; }
    // (PartyPlay's dance took her: it kept the link's tilt of her head as hers - give it her own)
    if (ev.game && ev.game.g === g && 'bow0' in ev.game) ev.game.bow0 = L.bow0;
    if (g.disc) { g.disc.r = L.r0 || 0.3; if (p) { g.disc.x = p.x; g.disc.z = p.z; } }
    if (p && !L.sit) { g.spot = { ...(g.spot || {}), x: p.x, z: p.z, y: p.y, face: P.group.rotation.y, pose: 'stand' }; g.face0 = facing(ev.pos.x - p.x, ev.pos.z - p.z); if (Math.hypot(ev.pos.x - p.x, ev.pos.z - p.z) < (L.r0 || 0.3) + 0.27) { this.discFix.push({ g, r0: L.r0 || 0.3 }); if (g.disc) g.disc.r = 0; } }
    else if (L.sit) g.face0 = L.face0;
    ev.prHtml = null;
    if (quiet) return;
    if (why === 'lost') ev._toast?.(this._fill(AFF_TOAST.lost, g), '');
    else if (why === 'notHere' || why === 'partner') { ev._toast?.(this._fill(AFF_TOAST.notHere, g), 'warn'); ev._bark?.(g, pick(AFF_NOTYET.secret), 2.4); }
    else if (why === 'timeout') ev._caption?.(this._fill(pick(AFF_NPC.timeout), g), 2.4);
  }
  /** a disc set aside while you stand inside it: back once you have stepped away */
  _discFix() {
    const P = this.ev.pos;
    for (let i = this.discFix.length - 1; i >= 0; i--) { const F = this.discFix[i], g = F.g, p = g.person?.group?.position; if (!p || g.gone || this.link?.g === g) { this.discFix.splice(i, 1); continue; } if (Math.hypot(P.x - p.x, P.z - p.z) > F.r0 + 0.3) { if (g.disc) g.disc.r = F.r0; this.discFix.splice(i, 1); } }
  }

  // ---- looking after someone very drunk ------------------------------------------------------------------------------------
  _care(g, k) {
    const ev = this.ev, T = this._thread(g), lw = this._lineWho(g), drv = lw === 'driver';
    T.care.push(k); this._act(g, k, 'me', 'yes', { why: 'care' }); g.dm += 1;
    const friend = () => { const f = (ev.gs || []).find((q) => q !== g && q.person?.group?.visible && !q.gone && this._dist(q) < 5 && this._who(q) !== 'none'); if (f) setTimeout(() => { if (this.on && !ev.closing && !ev.talk) ev._bark?.(f, pick(AFF_CARE.friend), 2.4); }, 2600); };
    if (k === 'water') { try { this.drink.water(g); } catch (_) { /* */ } ev._caption?.(`"${pick(AFF_CARE.water.you)}"`, 1.8); setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(g, pick(AFF_CARE.water.her), 3); }, 1500); friend(); ev._toast?.(this._fill(AFF_TOAST.care, g), 'up'); return; }
    if (k === 'stay') {
      if (g.spot?.pose === 'sit' && this._slot(g)) { this._play(g, 'lean', { by: 'me', act: null, caption: this._fill(pick(AFF_CARE.stay.cap), g) }); this.after.push(() => { if (this.link?.g === g) this.link.care = true; }); }
      else this._start(() => new CaptionMoment(this, g, this._fill(pick(AFF_CARE.stay.cap), g), 3.6));
      friend(); return;
    }
    if (k === 'seat') {
      if (g.spot?.pose === 'sit') { this._singleOn(g, 'sitWater', this._fill(pick(AFF_CARE.seat.cap), g), 30); friend(); return; }
      this._blink(() => {
        const s = this._freeSeat(g); let ok = false;
        if (s && !this.pf.stub) { const gp = g.person.group; gp.position.set(s.x, 0, s.z); gp.rotation.y = -s.yaw; g.spot = { ...(g.spot || {}), x: s.x, z: s.z, y: 0, face: -s.yaw, pose: 'sit' }; g.face0 = -s.yaw; if (g.disc) { g.disc.x = s.x; g.disc.z = s.z; g.disc.r = 0.28; } try { ok = !!this.pf.single(g, 'sitWater'); } catch (_) { ok = false; } }
        if (ok) { this.single = { g, pose: 'sitWater', t: 1e9 }; ev._caption?.(this._fill(pick(AFF_CARE.seat.cap), g), 2.8); }
        else ev._caption?.(this._fill(pick(AFF_CARE.seat.bar), g), 3);
      });
      friend(); return;
    }
    if (k === 'car') {
      this._start(() => new CaptionMoment(this, g, this._fill(pick(drv ? AFF_CARE.car.driver : AFF_CARE.car.cap), g), 4.2, () => this._carExit(g)));
      this._logLine(`Got ${g.first} a car home.`);
    }
  }
  /** a free seat near you for her (the venue's seats), or null */
  _freeSeat(g) {
    const ev = this.ev, P = ev.pos; let best = null, bd = 7;
    const S = [...(ev.V?.seats || []), ...(ev.hots || []).filter((h) => h.kind === 'seat' && h.seat).map((h) => h.seat)];
    for (const s of S) { if (!s || !Number.isFinite(s.x)) continue; if (ev.seat === s) continue; const d = Math.hypot(s.x - P.x, s.z - P.z); if (d >= bd) continue; if ((ev.K?.discs || []).some((q) => q !== g.disc && q.r > 0 && (q.x - s.x) ** 2 + (q.z - s.z) ** 2 < 0.35 * 0.35)) continue; bd = d; best = s; }
    return best;
  }
  /** a car home: her way out - not a walk-out (no 'left early', nothing off the evening's score) */
  _carExit(g) {
    const ev = this.ev; if (this.link?.g === g) this._linkEnd('care', true); if (this.single?.g === g) this._singleOff();
    this._blink(() => {
      if (g.person) g.person.group.visible = false; const i = ev.K?.discs?.indexOf(g.disc) ?? -1; if (i >= 0) ev.K.discs.splice(i, 1);
      g.gone = true; g.affCare = 'car'; ev._toast?.(`${g.first} is on the way home. You made sure of it.`, 'up');
      if (!ev._present?.().length && !ev.closing) setTimeout(() => { if (!ev.closing) ev._finish?.('normal'); }, 2600);
    });
  }

  // ---- the night going on: once a second ------------------------------------------------------------------------------------
  _second() {
    const ev = this.ev; this.t1++;
    const fl = num(ev.R?.flashes, 0) + num(ev.party?.Rp?.flashes, 0); if (fl !== this.flN) { this.flN = fl; this.flashT = ev.t; }
    const meT = this._meTier();
    for (const g of ev.gs || []) {
      if (!g.person) continue;
      const T = this._thread(g), lv = this._lv(g);
      if (!g.gone && g.person.group.visible && this._dist(g) < 1.6) T.close += 1;
      if (lv > T.herPeak) T.herPeak = lv;
      // (a refusal's dip fades: about a minute and a half for a no)
      if (T.dip > 0) T.dip = Math.max(0, T.dip - 0.012);
      const coolI = this._coolI(T);
      if (g.n) { g.n.affHold = !!(coolI <= GEST.kiss.I || T.stepped.has('kiss') || lv >= HAZY || meT >= 3 || this.minor || this.quiet || g.n.grieving); g.n.affLeave = !!(coolI < Infinity || lv >= HAZY); }
    }
    if (this.link) this._linkCheck();
    this._director();
  }
  /** the talk ending warm, PartyPlay's dance with her ending, the quiet minute ending: a nudge on the G label */
  _watch() {
    const ev = this.ev, W = this.watch;
    if (ev.talk) { W.talk = ev.talk.g; W.dm = ev.talk.dm; } else if (W.talk) { const g = W.talk; W.talk = null; this.closerK = null; if (W.dm >= 3 && this._who(g) === 'star') this._nudge(g); }
    const G = ev.game; if (G && G.aff !== this && G.name === 'dance' && G.g) W.game = G.g; else if (!G && W.game) { const g = W.game; W.game = null; if (this._who(g) === 'star') this._nudge(g); }
    if (ev.moment?.g) W.moment = ev.moment.g; else if (!ev.moment && W.moment) { const g = W.moment; W.moment = null; if (this._who(g) === 'star') this._nudge(g); }
  }
  _nudge(g) { if (!g || this._coolI(this._thread(g)) < Infinity) return; this.nudge = g; this.nudgeT = 5; this.ev.prHtml = null; this.plCache.g = null; }
  /** who the director may move now (nothing open, nothing pending: PartyPlay's free and its queue empty) */
  _free() {
    const ev = this.ev, pp = ev.party;
    if (!ev.ready || ev.closing || ev.talk || ev.menu || ev.game || ev.ask || ev.moment || ev.sty || ev.buzzE?.open || this.busy || this.after.length) return false;
    if (pp) { try { if (pp._free && !pp._free()) return false; if (pp.pend?.length || pp.drama || pp.exiting || pp.card || pp.who || pp.brawl) return false; } catch (_) { return false; } }
    return true;
  }
  /** may she make a romantic move on you tonight (the hard stops, both ways) */
  _npcRom(g) {
    if (this._who(g) !== 'star' || this.minor || this.quiet || this._meTier() >= 3) return false;
    const T = this._thread(g), b = this._bond(g); if (this._coolI(T) < Infinity || g.offended || g.shaken > 0 || g.n?.grieving || b?.grieving || num(b?.upset, 0) >= 3) return false;
    return this._lv(g) < HAZY;
  }
  /** the people's own moves, one at a time and never too close together (45 s overall, 120 s each) */
  _director() {
    if (!this._free() || this.quiet) return;
    const ev = this.ev, t = ev.t, forced = !!flag('__affNpcKiss');
    if (!forced && t - this.npcT < 30) return;
    const meT = this._meTier(), pp = ev.party;
    const P = (ev._present?.() || []).filter((g) => g.person.group.visible && this._who(g) !== 'none').sort((a, b) => this._dist(a) - this._dist(b));
    for (const g of P) {
      const who = this._who(g), T = this._thread(g); if (this._coolI(T) < Infinity || g.offended || g.shaken > 0) continue;
      if (!forced && t - T.npc.lastT < 75) continue;
      const d = this._dist(g), lv = this._lv(g), tier = tierOf(lv), st = this._stage(g), standing = g.spot?.pose !== 'sit' && !ev.seat, sitting = g.spot?.pose === 'sit';
      // (her move: a kiss out of the blue - forced by the test switch, or the hazard below)
      if (forced && who === 'star' && this._boldOk(g, true)) { unflag('__affNpcKiss'); this._npcKiss(g); return; }
      if (forced) continue;
      // (hello: a hug, a bro-hug - your partner kisses you hello)
      if (!T.npc.greeted && d < 2.4 && standing && !this.link) {
        T.npc.greeted = true;
        const friend = who === 'star' ? (STAGE_I[st] ?? 0) >= STAGE_I.friendly : (who === 'fdriver' || who === 'rdriver') ? FRIEND_OK.has(g.n?.stage) || g.role === 'mate' || g.role === 'friend' : false;
        if (friend && Math.random() < (this._partnerish(g) ? 0.85 : 0.5)) { this._npcGreet(g); return; }
      }
      // (the team's party after a podium: a celebration hug from the team-mate, the engineer, the boss)
      if (!T.npc.celebrated && d < 2.6 && standing && this._celebrateOk(g)) { T.npc.celebrated = true; if (Math.random() < 0.7) { this._npcGo(g, 'celebrate', AFF_NPC.celebrate); return; } }
      if (who !== 'star' || T.close < 12 || d > 1.6) continue;
      // (a kiss out of the blue)
      if (this._boldOk(g, false)) { const h = this._boldHazard(g); if (Math.random() < h) { this._npcKiss(g); return; } }
      if (!this._npcRom(g) && !(lv < HAZY && !this.quiet)) continue;
      const comfort = T.comfort;
      // (a merry or tipsy hug, out of nowhere - once a night each)
      if (tier >= 1 && lv < HAZY && standing && !this.link && (STAGE_I[st] ?? 0) >= STAGE_I.met && !T.npc.done.has('hug') && Math.random() < 0.006 * tier) { this._npcGo(g, 'hug', AFF_NPC.hug, AFF_NPC.hugBark); return; }
      // (a tipsy lean against you, standing)
      if (tier >= 1 && lv < HAZY && comfort >= 1 && standing && !this.link && !T.npc.done.has('side') && !T.stepped.has('side') && Math.random() < 0.012 * tier) { this._npcGo(g, 'side', AFF_NPC.lean, AFF_NPC.leanBark); return; }
      // (both on the same seat: her head on your shoulder)
      if (sitting && this._seatedBeside(g) && comfort >= 1 && !this.link && lv < HAZY && !T.npc.done.has('lean') && !T.stepped.has('lean') && Math.random() < 0.004 + 0.008 * tier) { this._npcGo(g, 'lean', AFF_NPC.seatLean); return; }
      if (!this._npcRom(g) || meT >= 3) continue;
      // (a hand to the dance floor)
      if (pp && this._floorOk() && tier >= 1 && standing && ((STAGE_I[st] ?? 0) >= STAGE_I.flirting || (st === 'friendly' && tier >= 1)) && !T.npc.done.has('floor') && Math.random() < 0.002 + 0.003 * tier) {
        T.npc.done.add('floor'); T.npc.lastT = t; this.npcT = t; if (this.link) this._linkEnd('swap', true);
        ev._bark?.(g, pick(AFF_NPC.floorBark), 2); this._act(g, 'dance', 'her', 'yes', {});
        try { pp._blink(() => { try { pp._dance(g); } catch (e) { console.warn('Affection: to the floor', e); } }); } catch (_) { /* */ }
        return;
      }
      // (a kiss on the cheek)
      if (tier >= 1 && (STAGE_I[st] ?? 0) >= STAGE_I.friendly && standing && !T.npc.done.has('cheek') && !T.stepped.has('cheek') && Math.random() < 0.0015 + 0.003 * tier) { this._npcGo(g, 'cheek', AFF_NPC.cheek, AFF_NPC.cheekBark); return; }
    }
  }
  /** may she kiss you out of the blue tonight (the gates) */
  _boldOk(g, forced) {
    if (this.boldDone || this.meReal || !this._npcRom(g)) return false;
    const T = this._thread(g), st = this._stage(g), lv = this._lv(g), b = this._bond(g); if (T.npc.bold || T.stepped.has('kiss') || T.npc.done.has('kiss') || T.acts.some((a) => a.k === 'kiss' && a.ans === 'yes') || st === 'ex' || st === 'partner') return false;
    if (!forced && (lv < 1 || lv >= HAZY)) return false;
    if (!forced && !(st === 'flirting' || st === 'dating' || (st === 'friendly' && tierOf(lv) >= 1 && (num(b?.aff, 0) >= 10 || tierOf(lv) >= 2)))) return false;
    // (not with your public partner a few metres away - unless she is the kind who does not care)
    const ev = this.ev; if (num(g.C?.traits?.wreck, 0) < 0.5) for (const o of ev.gs || []) { if (o === g || o.kind !== 'celeb' || !o.person?.group?.visible || o.gone) continue; const ob = this._bond(o); if (ob?.stage === 'partner' && ob.public && this._dist(o) < 8) return false; }
    return forced || this._ceil(g, 5) >= 4.4;
  }
  _boldHazard(g) {
    const lv = this._lv(g), tier = tierOf(lv), cK = this._ceil(g, 5), interest = clamp((cK - 4.4) / 1.2 + 0.3, 0.3, 1);
    return 0.003 * (tier >= 2 ? 1 : 0.6) * interest * (this._private(g) ? 1.4 : 0.7) * (0.7 + 0.6 * num(g.C?.traits?.drama, 0.3));
  }
  _npcKiss(g) {
    const ev = this.ev, T = this._thread(g); this.boldDone = true; T.npc.bold = true; T.npc.lastT = ev.t; this.npcT = ev.t;
    if (this.link && this.link.g !== g) this._linkEnd('swap', true);
    const partner = this._partnerish(g) && this._stage(g) !== 'flirting';
    const pair = this._seatedBeside(g) ? 'seatKiss' : 'kiss'; let need = []; try { need = this.pf.stub ? [] : this.pf.need(pair, g) || []; } catch (_) { need = []; }
    const go = () => this._start(() => new KissResponse(this, g, { partner }));
    if (need.length || (ev.seat && pair === 'kiss')) this._blink(() => { if (ev.seat && pair === 'kiss') ev._stand?.(); try { if (need.length) this.pf.build(pair, g, 2); } catch (_) { /* */ } go(); });
    else go();
  }
  _boldDone(K) {
    const ev = this.ev, g = K.g, T = this._thread(g), a = K.ans || 'laugh', priv = this._private(g);
    try { if (K.framed) this.pf.show(K.pair, g, false); } catch (_) { /* */ }
    g.face0 = K.face0; if (K.framed || a === 'step') this._stepBack(g, K);
    T.npcKiss = a; T.npc.done.add('kiss');
    const A = this._act(g, 'kiss', 'her', a, { priv });
    // (her partner-to-be, the one you are seeing, the press: each answer has its own fallout)
    if (a === 'back') { T.comfort = Math.max(T.comfort, 5); T.cool = null; this._kissRecord(g, A, { counted: false, priv, by: 'her' }); if (ev.party && !priv) this._photoRoll(g, 'kiss', A); setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(g, pick(AFF_BOLD.back.her), 3); }, 400); this._logLine(`${g.first} kissed you, and you kissed her back.`); }
    else if (a === 'laugh') { setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(g, pick(AFF_BOLD.laugh.her), 3); }, 300); if (!priv && !A.photo) this._photoRoll(g, 'kiss', A); this._logLine(`${g.first} kissed you; you both laughed it off.`); }
    else { T.stepped.add('kiss'); g.dm -= 1; setTimeout(() => { if (this.on && !ev.closing) { ev._bark?.(g, pick(AFF_BOLD.step.her), 3); ev._toast?.(this._fill(AFF_TOAST.stepped, g), ''); } }, 300); if (!priv && !A.photo) this._photoRoll(g, 'kiss', A); this._logLine(`${g.first} kissed you; you stepped back.`); }
    // (the one you are seeing saw it: a step back she will thank you for; a laugh she will not)
    for (const cid of A.seenBy) {
      const w = (ev.gs || []).find((q) => q.cid === cid), b = w && this._bond(w); if (!w || !b || (b.stage !== 'dating' && b.stage !== 'partner') || b.grieving) continue;
      if (a === 'step') { w.dm += 1; setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(w, pick(AFF_SAW.step), 3); }, 3600); }
      else if (a === 'laugh') { w.dm -= 2; setTimeout(() => { if (this.on && !ev.closing) ev._bark?.(w, pick(AFF_SAW.laugh), 3); }, 3600); }
    }
  }
  /** a hello: a hug or a bro-hug - your partner (dating) kisses your cheek, or your lips if you are that close and it is not a secret in public */
  _npcGreet(g) {
    const ev = this.ev, T = this._thread(g), who = this._who(g), t = ev.t; T.npc.lastT = t; this.npcT = t;
    this.greets = (this.greets || 0) + 1; const shot = this.greets <= 2;
    if (who === 'star' && this._partnerish(g) && this._npcRom(g)) {
      const priv = this._private(g), secret = !!this._bond(g)?.secret && !priv;
      if (!secret) {
        const lips = T.comfort >= 3.5 && this._stage(g) === 'partner';
        this._act(g, lips ? 'kiss' : 'cheek', 'her', 'yes', { priv, why: 'hello' }); T.comfort = Math.max(T.comfort, lips ? 5 : 4);
        if (lips) this.lastKissT = t;
        if (shot) this._play(g, lips ? 'kiss' : 'cheek', { by: 'her', act: null, caption: this._fill(pick(lips ? AFF_NPC.hello.lips : AFF_NPC.hello.cheek), g) });
        else ev._caption?.(this._fill(pick(lips ? AFF_NPC.hello.lips : AFF_NPC.hello.cheek), g), 2.4);
        return;
      }
    }
    const k = who === 'star' || who === 'ex' ? 'hug' : 'bro', L = AFF_NPC.greet[who === 'star' ? (this._partnerish(g) ? 'partner' : 'star') : 'driver'] || AFF_NPC.greet.star;
    this._act(g, k, 'her', 'yes', {}); this._thread(g).comfort = Math.max(this._thread(g).comfort, 1);
    if (shot) this._play(g, k, { by: 'her', act: null, caption: this._fill(pick(L), g), then: () => ev._bark?.(g, pick(AFF_NPC.greetBark[who === 'star' ? 'star' : 'driver']), 2.2) });
    else { ev._caption?.(this._fill(pick(L), g), 2.2); ev._bark?.(g, pick(AFF_NPC.greetBark[who === 'star' ? 'star' : 'driver']), 2.2); }
  }
  /** one of her own moves (a lean, a cheek kiss, a celebration hug) - the gesture played as hers */
  _npcGo(g, k, capL, barkL = null) {
    const ev = this.ev, T = this._thread(g), t = ev.t; T.npc.lastT = t; this.npcT = t; T.npc.done.add(k);
    this._yes(g, k, { by: 'her' });
    // (_yes plays it with the yes line; her own words first, as a caption on the shot)
    if (ev.game && ev.game.aff === this && ev.game.k === k && capL) ev._caption?.(this._fill(pick(capL), g));
    else if (capL) ev._caption?.(this._fill(pick(capL), g), 2.4);
    if (barkL) setTimeout(() => { if (this.on && !ev.closing && !ev.talk) ev._bark?.(g, pick(barkL), 2.6); }, 1800);
  }
  /** whose body a game, a link or a scuffle owns right now (AffectionDrink leaves them alone) */
  _owns(g) {
    const ev = this.ev; if (!g || g.gone || g._ppPerson) return true;
    if (this.link?.g === g || this.single?.g === g) return true;
    const G = ev.game; return !!(G && G.g === g);
  }

  // ---- the words -------------------------------------------------------------------------------------------------------
  _fill(s, g) {
    if (!s) return ''; const w = this._lineWho(g), o = w === 'driver' ? 'him' : w === 'person' ? 'them' : 'her', p = w === 'driver' ? 'his' : w === 'person' ? 'their' : 'her';
    return String(s).replace(/\{first\}/g, g?.first || 'they').replace(/\{o\}/g, o).replace(/\{p\}/g, p).replace(/\{me\}/g, firstOf(this.ev.meName) || 'you');
  }

  // ---- act 2, and the result ---------------------------------------------------------------------------------------------
  _carryIn(A) {
    for (const [cid, W] of Object.entries(A.with || {})) {
      if (!W || typeof W !== 'object') continue;
      const acts = Array.isArray(W.acts) ? W.acts.slice(-40) : [];
      let comfort = 0; for (const a of acts) if ((a.ans === 'yes' || a.ans === 'back') && GEST[a.k]) comfort = Math.max(comfort, GEST[a.k].I);
      // (act 1's holds come along only for what is left of their minute - a no is never a lock for the night)
      const CW = W.cool && typeof W.cool === 'object' && num(W.cool.left, 0) > 0 ? W.cool : null;
      const T = { cid, comfort, cap: Infinity, closed: false, cool: CW ? { I: num(CW.I, GEST.kiss.I), until: num(this.ev.t, 0) + Math.min(COOL, num(CW.left, 0)), no: !!CW.no } : null, dip: clamp(num(W.dip, 0), 0, 3), stepped: new Set(Array.isArray(W.stepped) ? W.stepped : []), acts, npc: { done: new Set(Array.isArray(W.npcDone) ? W.npcDone : []), lastT: -999, greeted: true, bold: !!W.npcKiss || (Array.isArray(W.npcDone) && W.npcDone.includes('kiss')) },
        sorry: !!W.sorry, close: 0, herPeak: num(W.herPeak, 0), linkedS: num(W.linked, 0), danced: num(W.danced, 0), care: Array.isArray(W.care) ? W.care.slice() : [], npcKiss: W.npcKiss || null, kissRp: !!W.kissRp, top: num(W.top, 0), charmed: false, kind: W.kind || null, role: W.role || null, carried: true };
      this.threads.set(cid, T);
      if (T.npc.bold) this.boldDone = true;
      for (const a of acts) if (a.you >= 3 && GEST[a.k]?.rom && a.by === 'me') this.drunkTries++;
    }
    for (const p of Array.isArray(A.photos) ? A.photos : []) if (p?.k) { this.photoK.add(p.k); this.photos.push({ cid: p.cid, k: p.k }); }
    for (const s of Array.isArray(A.log) ? A.log : []) this._logLine(s);
    // (the levels go on, less what the liver took between the two venues: AffectionDrink's)
    try { this.drink.carryIn(A); } catch (_) { /* */ }
  }
  /** res.aff (see the contract) */
  _result() {
    const ev = this.ev, W = {};
    for (const [cid, T] of this.threads) {
      const g = (ev.gs || []).find((q) => (q.cid || q.name) === cid) || null;
      if (!T.acts.length && !T.care.length && !T.closed && !T.carried) continue;
      W[cid] = { kind: g?.kind || T.kind || null, role: g?.role || T.role || null, top: T.top, acts: T.acts.map((a) => ({ ...a, seenBy: a.seenBy.slice() })), closed: T.acts.some((a) => a.ans === 'no'), cap: null,
        cool: this._coolI(T) < Infinity ? { I: T.cool.I, left: Math.round(this._coolLeft(T)), no: !!T.cool.no } : null, dip: +num(T.dip, 0).toFixed(2),
        stepped: [...T.stepped], sorry: T.sorry, npcKiss: T.npcKiss, npcDone: [...T.npc.done], care: T.care.slice(), herPeak: +T.herPeak.toFixed(2), linked: Math.round(T.linkedS + (this.link && this.link.g === g ? this.link.t : 0)), danced: T.danced, kissRp: !!T.kissRp };
    }
    let carry = { clock: num(+ev.clock, 0), levels: {} }; try { carry = this.drink.carryOut() || carry; } catch (_) { /* */ }
    let peak = 0; try { peak = num(this.drink.me()?.peak, num(ev.party?.peak, 0)); } catch (_) { peak = 0; }
    return { v: 1, youPeak: +peak.toFixed(2), meAge: this.meAge, meReal: !!this.meReal, clock: +num(carry.clock, num(+ev.clock, 0)).toFixed(3), levels: { ...(carry.levels || {}) }, with: W, photos: this.photos.map((p) => ({ ...p })), log: this.log.slice(0, 4) };
  }

  // ---- tests ------------------------------------------------------------------------------------------------------------
  /** the guest i (or by cid) */
  guest(i) { const gs = this.ev.gs || []; return typeof i === 'string' ? gs.find((g) => g.cid === i || g.name === i) || null : gs[i] || null; }
  /** what G would offer with guest i -> { mode, items: [{ k, label, chip }], def, read } */
  menuFor(i) { const g = this.guest(i); const O = g ? this._options(g) : null; return O ? { mode: O.mode, def: O.def, read: O.read, items: O.items.map((it) => ({ k: it.k, label: this._label(it.k, g), chip: it.chip })) } : null; }
  /** try gesture k with guest i (force: 'yes' | 'no' | null) -> answer */
  tryIt(i, k, force = null) { const g = this.guest(i); return g ? this.attempt(g, k, 'test', { force }) : null; }
  get state() {
    const ev = this.ev;
    return { link: this.link ? { with: this.link.g.name, k: this.link.k, t: +this.link.t.toFixed(1), sit: this.link.sit } : null, busy: this.busy, game: ev.game?.aff === this ? ev.game.info() : null, me: { tier: this._meTier(), level: +this._meLevel().toFixed(2), age: this.meAge, minor: this.minor, real: this.meReal },
      pf: this.pf.stub ? 'stub' : 'PairFrames', drink: this.drink.stub ? 'stub' : 'AffectionDrink', bold: this.boldDone, photos: this.photos.length,
      threads: [...this.threads.values()].filter((T) => T.acts.length || T.closed).map((T) => ({ cid: T.cid, comfort: T.comfort, cap: Number.isFinite(T.cap) ? T.cap : null, closed: T.closed, cool: this._coolI(T) < Infinity ? { I: T.cool.I, left: +this._coolLeft(T).toFixed(1), no: !!T.cool.no } : null, dip: +num(T.dip, 0).toFixed(2), close: T.close, acts: T.acts.map((a) => `${a.by}:${a.k}:${a.ans}`) })) };
  }
}
