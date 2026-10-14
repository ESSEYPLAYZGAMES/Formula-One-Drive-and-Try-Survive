// Two people in one moment (ui/Affection.js's): a hug, an arm round the shoulders, holding hands, leaning together on a
// sofa, a slow dance, a kiss on the cheek, a kiss. Each person's paired poses are bodies of their own (world/PartyCrowd.js
// HeroFrames: headless, in the person's own clothes and materials, the person's own head moved onto the body shown), put
// where the moment wants them - anchored on her: she stays on her spot, you (your body, ev.me, and the eye, ev.pos) are
// placed from the pair's offset - fitted to each other from the real bodies (the chests' fronts measured once when a body
// is built, the heads where they really are), and a two-shot to show it: letterboxed, from the side, framed by its own
// field of view so that an embrace or a kiss is never seen below the chest (and nobody in swimwear below the shoulders).
// No lights, no materials of its own, nothing allocated a frame; it never imports ui/Hangout.js or ui/PartyPlay.js - the
// evening (ev) is handed to it.
//
// ==== PUBLISHED CONTRACT (WP-B: PairFrames) - WP-A (ui/Affection.js) codes against this ===================================
//
// import { PairFrames, PAIRS, pairOf } from '../world/PairFrames.js';
//
// Frames: People's own frame - a person faces +x, People's right is -z, left +z (NB the camera's right in first person is
// People's LEFT: B "on A's right" at (0, -z) is on your screen's left). A = you (the player's body, ev.me - a man), B = her
// (or him: a driver). Yaws: a person's group rotation.y (Hangout's facing(dx, dz) = atan2(-dz, dx)); cyaw: the eye's yaw
// (ev.yaw, looking along (cos, sin)) = -yaw.
//
// PAIRS[kind] (pairOf(kind) -> the entry or null; aliases resolve to the same object):
//   hug (celebrate: two men the same)  'hug' + 'hug', B 0.30 ahead facing A, chest fit; heads to their own left
//   embrace (close)                    'embraceM' + 'embraceF', 0.28; the long hug
//   dance                              'embraceM' + 'embraceF', 0.32, sway(), a slow 20 deg orbit in aim()
//   kiss                               'embraceM' + 'embraceF', fitted (heads 0.16-0.18 apart, closed, heads only)
//   side (mates, selfie)               'sideOut' (his arm round her shoulders) + 'sideIn' (hers round his waist), B at
//                                      (0, -0.36), each turned 0.15 in; a link
//   hand                               'handOut' + 'handIn', B at (0, -0.50); a link
//   cheek                              you in your own body ('talk') + 'sideIn', B at (0.10, -0.30) turned 0.7 to you, on
//                                      her toes 0.025; her lips by your cheek (fitted)
//   seatLean (lean)                    'sitBooth' + 'sitLean' on the sofa slot (slot()); a link
//   seatArm (arm)                      'sitArm' + 'sitLean'; a link
//   cuddle                             'sitArm' + 'sitLean', her head on your shoulder; a link
//   seatKiss                           'sitArm' + 'sitLean', heads turned to each other (fitted); 'kiss' asked while she
//                                      sits becomes this, 'cheek' becomes seatCheek
//   seatCheek                          'sitBooth' + 'sitLean'
//   brohug (bro)                       'brohug' + 'brohug', 0.32; right hands clasped
//   reach                              single: 'sitReach' on her (at a table: her hand across it) - single()
//   care                               single: 'sitWater' on her (the very drunk, sat down with a glass of water)
//   entry fields: a, b (poses; a 'own': your own body), at [x, z] (B in A's frame) | seat, by (B's yaw from A's), ay (A's
//   own turn), view 'chest' | 'waist', fit, heads, link, sway, single, dur (the spec's shot length, s), d (shot distance)
//
// new PairFrames(ev)    ev: the Hangout (reads ev.me, ev.meOpts (_makeMe's options - its affection hook), ev.party?.hf,
//                       ev.K (solids, discs, areas), ev._free, ev._look, ev._toL, ev.cam, ev.crowd, ev.pos, ev.yaw,
//                       ev.V.heightAt, ev.occ, ev._hostLit)
// .framesFor(g | 'me') -> HeroFrames | null   one per person: PartyPlay's own (ev.party.hf - its dancers') when it has
//                       one, else this one's own Map (never added to PartyPlay's: its hf.has(g) means "has dance frames").
//                       null: no person (ev.me not made yet - _makeMe first)
// .steps(list) -> [fn]  bake steps for the opening cover, one body each, 6 at most in all. list: [[who, [pose, ...]], ...]
//                       (or [{ who, poses }]); who: g | 'me'. The suggested six: [['me', ['hug', 'embraceM', 'sideOut']],
//                       [P1, ['hug', 'embraceF', 'sideIn']]]
// .need(kind, g, o?) -> [{ who, pose, person? }]   the bodies still to build for that moment (o.her: only hers - a link
//                       seen in first person). person: false - that person is not there to build on (ev.me missing)
// .build(kind, g, max = 1, o?) -> n   build up to max of them now (~126 ms each for a woman, under a blink only)
// .ready(kind, g, o?) -> bool   nothing left to build
// .place(kind, g, o?) -> { ok, kind, mir, psi, ax, az, ay, ayaw, cyaw, bx, bz, by, byaw, gap }   where the two would
//                       stand, anchored on her (B stays where she is; A from the pair's offset). Toward-pairs face A from
//                       where you are now (o.from { x, z }); same-way pairs keep her facing (o.yaw: the pair's yaw);
//                       seated pairs take the sofa slot. Not free: other angles, then mirrored (mir: B on A's left), then
//                       (o.fallback !== false) a hug -> kind 'hug'. { ok: false } when nothing fits
// .slot(g) -> { x, z, yaw (cyaw - for ev._sit), eye, y, side (1 her left, -1 her right), mir } | null   the place beside
//                       her on the furniture she sits on: 0.5 m along it, within the same solid (0.2 m from its ends), no
//                       one within 0.4 m. null: she is not sitting on a sofa or a banquette
// .show(kind, g, on, o?) -> bool   both bodies (on: o.mir mirrored; o.me false: hers only), person.bow set to the body's
//                       (restored), her hand's drink (g.drink) hidden (shown again), ev.me shown only while o.me !== false.
//                       false: a body is not built (nothing changed)
// .single(g, pose | null) -> bool   one body of hers ('sitReach', 'sitWater') or back to her own
// .heads(kind, g, k = 1)    the heads written for the moment (after Hangout._people, every frame): k 0..1 eased from
//                       wherever _people left them
// .sway(kind, g, phase)     the slow dance's sway about the pair's middle (none under reduced motion)
// .link(kind, g, o?) -> bool   a link held in first person: standing ('side', 'hand') she is put at your side (your
//                       facing; mirrored when that side is taken), her disc r 0 while linked, her link body shown if built
//                       (else her own); seated ('seatLean', 'seatArm', 'cuddle') her sitLean body on her seat (you are on
//                       the slot - ev._sit(slot(g)), the caller's). false: she cannot (sitting, for a standing link)
// .follow(g, kind, dt, moving?) -> 'ok' | 'blocked' | 'far' | 'none'   every frame while linked: you walking - her own
//                       body, eased to your side (0.38 m, 0.5 holding hands; 0.7 behind-right where it is tight) at 6/s, at
//                       most 2 m/s, on the floor (V.heightAt), a small bob, the crowd stepping aside; still for 0.6 s - her
//                       link body back. 'blocked': she could not keep up for 1.5 s; 'far': over 6 m apart (end it)
// .release(g)            back to her own body, bow, drink, disc (r, and where she is now), spot (pose 'stand' after a
//                       standing link) and face0 (facing you); you nudged clear of her disc
// .owns(g) -> bool       a body, a link or a shot of this one's has her (AffectionDrink: no sway cues then)
// .shot(kind, g, o?) -> plan | null   the moment set up for the camera: placed (place), both bodies shown, fitted, heads
//                       set, the two-shot found (side profile at 2 m - kiss 1.8 - then three-quarter, then over your
//                       shoulder; ev._free for the camera and its line; the side looking out to the nearer wall) and its
//                       fov set from the framing height (chest-up 0.8 m, waist-up 1.2 m; shoulders-up 0.55 m at 1.5 m
//                       whenever anyone is in swimwear or at the pool). null: not built (ready() first), nowhere to put
//                       the camera, or no place - nothing changed; the caller captions it (or PartyPlay's cut-away).
//                       o: { from, yaw, orbit (rad), view (only widens 'waist' pairs - never an embrace or a kiss) }
//                       plan: { kind, g, dur, fov, cam, look, C, fit: { gap, dh } } - read-only
// .aim(plan, t)          every frame of the shot (t: seconds in): the camera (a 0.08 m push-in, the orbit), the heads,
//                       her turn, the crowd pushed clear of the shot
// .unshot(plan, o?)      the shot over: fov back, bodies back (o.link: hers and your place kept for a link to follow
//                       - call link() next), you back where you stood (toward-pairs) or beside her (same-way), ev.me hidden
// .stats() -> { frames, built: [{ who, pose, ms, tris }] }   (tests, perf)
// .dispose()             any shot and link ended, then only the HeroFrames this one made given back (PartyPlay's are its
//                       own). Call it before PartyPlay's and the people's disposal
// ==========================================================================================================================
import * as THREE from 'three';
import { HeroFrames } from './PartyCrowd.js';
import { SWIM_KITS, SWIM_KITS_M } from './People.js';

const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();
const facing = (dx, dz) => Math.atan2(-dz, dx);
const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (x) => { const u = clamp(x, 0, 1); return u * u * (3 - 2 * u); };
const SWIM = new Set([...(SWIM_KITS || []), ...(SWIM_KITS_M || [])]);
const _v0 = new THREE.Vector3(), _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _v4 = new THREE.Vector3();

// ---- the moments ------------------------------------------------------------------------------------------------------
const TOWARD = Math.PI;
const P_HUG = { a: 'hug', b: 'hug', at: [0.30, 0], by: TOWARD, view: 'chest', fit: 'chest', heads: 'hug', dur: 1.6 };
const P_EMB = { a: 'embraceM', b: 'embraceF', at: [0.28, 0], by: TOWARD, view: 'chest', fit: 'chest', heads: 'embrace', dur: 2.6 };
const P_SIDE = { a: 'sideOut', b: 'sideIn', at: [0, -0.36], ay: 0.15, by: -0.15, view: 'waist', heads: 'look', link: true, follow: 0.38, dur: 1.4 };
const P_LEAN = { a: 'sitBooth', b: 'sitLean', seat: true, view: 'waist', heads: 'lean', link: true, dur: 1.4 };
const P_ARM = { a: 'sitArm', b: 'sitLean', seat: true, view: 'waist', heads: 'lean', link: true, dur: 1.4 };
const P_BRO = { a: 'brohug', b: 'brohug', at: [0.32, 0], by: TOWARD, view: 'chest', heads: 'hug', dur: 1.6 };
export const PAIRS = {
  hug: P_HUG, celebrate: P_HUG,
  embrace: P_EMB, close: P_EMB,
  dance: { a: 'embraceM', b: 'embraceF', at: [0.32, 0], by: TOWARD, view: 'chest', fit: 'chest', heads: 'dance', sway: true, orbit: 0.35, dur: 10 },
  kiss: { a: 'embraceM', b: 'embraceF', at: [0.28, 0], by: TOWARD, view: 'chest', fit: 'kiss', heads: 'kiss', dur: 3.8, d: 1.8 },
  side: P_SIDE, mates: P_SIDE, selfie: P_SIDE,
  hand: { a: 'handOut', b: 'handIn', at: [0, -0.5], view: 'waist', heads: 'look', link: true, follow: 0.5, dur: 1.4 },
  cheek: { a: 'own', b: 'sideIn', at: [0.10, -0.30], by: -0.7, toes: 0.025, view: 'chest', fit: 'cheek', heads: 'cheek', dur: 1.6 },
  seatLean: P_LEAN, lean: P_LEAN,
  seatArm: P_ARM, arm: P_ARM,
  cuddle: { a: 'sitArm', b: 'sitLean', seat: true, view: 'waist', heads: 'cuddle', link: true, dur: 1.4 },
  seatKiss: { a: 'sitArm', b: 'sitLean', seat: true, view: 'chest', fit: 'seatKiss', heads: 'seatKiss', dur: 3.8, d: 1.8 },
  seatCheek: { a: 'sitBooth', b: 'sitLean', seat: true, view: 'chest', heads: 'seatCheek', dur: 1.6 },
  brohug: P_BRO, bro: P_BRO,
  reach: { b: 'sitReach', single: true },
  care: { b: 'sitWater', single: true },
};
/** a moment by name (aliases too) -> its PAIRS entry, or null */
export function pairOf(kind) { return (kind && Object.prototype.hasOwnProperty.call(PAIRS, kind) && PAIRS[kind]) || null; }
const SEATED_AS = { kiss: 'seatKiss', cheek: 'seatCheek', hug: 'seatLean', side: 'seatArm' };

// ---- the camera's framing: the height of the picture (m) and how far away (m) -------------------------------------------
const VIEW = { chest: { H: 0.8, d: 2.0, cy: -0.1, ly: -0.04 }, waist: { H: 1.2, d: 2.0, cy: -0.22, ly: -0.3 }, shoulders: { H: 0.55, d: 1.5, cy: -0.06, ly: -0.02 } };

export class PairFrames {
  constructor(ev) {
    this.ev = ev; this.reg = new Map(); this.mine = new Set(); this.st = new Map(); this.links = new Map();
    this.me = null; this.plan = null; this.built = []; this.gone = false; this.ph = 0;
  }

  // ---- the bodies --------------------------------------------------------------------------------------------------------
  framesFor(who) {
    if (this.gone) return null;
    const me = who === 'me', P = me ? this.ev.me : who?.person; if (!P?.group) return null;
    const key = me ? 'me' : who, pp = this.ev.party?.hf;
    const H0 = pp && typeof pp.get === 'function' ? pp.get(key) : null; if (H0 && H0.P === P && !H0.gone) return H0;
    let H = this.reg.get(key);
    if (H && (H.P !== P || H.gone)) { if (this.mine.has(H)) { try { H.dispose(); } catch (_) { /* */ } this.mine.delete(H); } this.reg.delete(key); H = null; }
    if (!H) {
      try { H = new HeroFrames(P, me ? this._meOpts() : who.opts || {}, { poses: [], prep: (o) => this.ev._hostLit?.(o) }); } catch (e) { console.warn('PairFrames: no frames for', who?.name || who, e); return null; }
      this.reg.set(key, H); this.mine.add(H);
    }
    return H;
  }
  /** your body's options (_makeMe's, kept by its hook as ev.meOpts; else the same defaults it uses) */
  _meOpts() {
    const ev = this.ev; if (ev.meOpts) return ev.meOpts;
    return { pose: 'talk', kit: 'casual', color: '#1f2430', accent: ev.myColor || '#3a6fd8', legs: '#2c3e66', driver: ev.meName, jitter: 0, detail: 0.7 };
  }
  _fem(who) { return who !== 'me' && who?.opts?.figure === 'f'; }
  /** the pose each of the two takes in a moment */
  _poses(K) { return { a: K.single ? null : K.a, b: K.b }; }
  steps(list = []) {
    const out = []; let n = 0;
    for (const it of list || []) {
      const who = Array.isArray(it) ? it[0] : it?.who, poses = Array.isArray(it) ? it[1] : it?.poses;
      for (const pose of poses || []) { if (n >= 6 || !pose || pose === 'own') continue; n++; out.push(() => { try { this._buildOne(who, pose); } catch (e) { console.warn('PairFrames: a frame', pose, e); } }); }
    }
    return out;
  }
  _buildOne(who, pose) {
    const H = this.framesFor(who); if (!H || !pose || pose === 'own') return 0;
    if (pose in H.fr) return 0;
    const t0 = performance.now(), F = H.build(pose); if (!F) return 0;
    this._measure(F); const ms = performance.now() - t0;
    let tris = 0; F.group.traverse((m) => { if (m.isMesh) tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; });
    this.built.push({ who: who === 'me' ? 'me' : who?.cid || who?.name || '?', pose, ms: Math.round(ms), tris: Math.round(tris) });
    return 1;
  }
  /** a body's front at the chest (its torso: a band at chest height near the middle - a hand behind someone's back left out) */
  _measure(F) {
    const body = F.group.children.find((c) => c.isGroup) || F.group, s = body.scale.x || 1; let ext = 0.08, back = -0.08;
    body.traverse((m) => {
      if (!m.isMesh) return; const a = m.geometry.attributes.position;
      for (let i = 0; i < a.count; i++) { const y = a.getY(i) * s; if (y < 1.12 || y > 1.32) continue; const z = a.getZ(i) * s; if (z > 0.09 || z < -0.09) continue; const x = a.getX(i) * s; if (x > 0.33) continue; if (x > ext) ext = x; if (x < back) back = x; }
    });
    F._ext = ext; F._back = back;
  }
  need(kind, g, o = {}) {
    const K = pairOf(kind), out = []; if (!K || !g) return out;
    const want = (who, pose) => { if (!pose || pose === 'own') { if (pose === 'own' && !this.ev.me) out.push({ who, pose, person: false }); return; } const H = this.framesFor(who); if (!H) { out.push({ who, pose, person: false }); return; } if (!(pose in H.fr) || !H.fr[pose]) out.push({ who, pose }); };
    want(g, K.b); if (!K.single && !o.her) want('me', K.a);
    return out;
  }
  build(kind, g, max = 1, o = {}) {
    let n = 0; for (const q of this.need(kind, g, o)) { if (n >= max) break; if (q.person === false) continue; n += this._buildOne(q.who, q.pose); }
    return n;
  }
  ready(kind, g, o = {}) { return !!pairOf(kind) && this.need(kind, g, o).length === 0; }
  _F(who, pose) { const H = this.framesFor(who); return (H && pose && H.fr[pose]) || null; }

  // ---- where they stand --------------------------------------------------------------------------------------------------
  _floor(x, z, dflt = 0) { const f = this.ev.V?.heightAt; if (typeof f === 'function') { try { const y = +f(x, z); return Number.isFinite(y) ? y : dflt; } catch (_) { /* */ } } return dflt; }
  /** B's place from A's: A at (ax, az) facing psi, B at the pair's offset (oz mirrored) -> [x, z] */
  _offset(ax, az, psi, ox, oz) { const c = Math.cos(psi), s = Math.sin(psi); return [ax + ox * c + oz * s, az - ox * s + oz * c]; }
  _seated(g) { return g?.spot?.pose === 'sit' || /^sit/.test(g?.opts?.pose || g?.pose || ''); }
  _kindFor(kind, g) { return this._seated(g) && SEATED_AS[kind] && !pairOf(kind)?.seat && !pairOf(kind)?.single ? SEATED_AS[kind] : kind; }
  place(kind, g, o = {}) {
    const ev = this.ev, NO = { ok: false, kind }; kind = this._kindFor(kind, g); const K = pairOf(kind); if (!K || !g?.person) return NO;
    const gp = g.person.group, bx = gp.position.x, bz = gp.position.z, by0 = gp.position.y;
    if (K.single) return { ok: true, kind, mir: false, bx, bz, by: by0, byaw: gp.rotation.y, ax: ev.pos.x, az: ev.pos.z, ay: 0, ayaw: -ev.yaw, cyaw: ev.yaw, psi: gp.rotation.y, gap: 0 };
    if (K.seat) {
      const s = this.slot(g); if (!s) return NO;
      const f = g.spot?.face ?? gp.rotation.y;
      return { ok: true, kind, mir: s.mir, psi: f, ax: s.x, az: s.z, ay: s.y, ayaw: f, cyaw: -f, bx, bz, by: by0, byaw: f, gap: 0.5, slot: s };
    }
    const [ox, oz] = K.at, skip = g.disc, fit = (x, z) => ev._free(x, z, 0.2, skip);
    if (K.by === TOWARD) {
      const fr = o.from || ev.pos; let ux = fr.x - bx, uz = fr.z - bz; const L = Math.hypot(ux, uz);
      if (L < 0.05) { const f = gp.rotation.y; ux = Math.cos(f); uz = -Math.sin(f); } else { ux /= L; uz /= L; }
      const a0 = Math.atan2(uz, ux), gap = ox + 0.06;
      for (const da of [0, 0.4, -0.4, 0.8, -0.8, 1.2, -1.2, 1.7, -1.7]) {
        const cx = Math.cos(a0 + da), cz = Math.sin(a0 + da), ax = bx + cx * gap, az = bz + cz * gap; if (!fit(ax, az)) continue;
        const psi = facing(-cx, -cz);
        return { ok: true, kind, mir: false, psi, ax: bx + cx * ox, az: bz + cz * ox, ay: this._floor(bx + cx * ox, bz + cz * ox, by0), ayaw: psi + (K.ay || 0), cyaw: -(psi + (K.ay || 0)), bx, bz, by: by0 + (K.toes || 0), byaw: psi + K.by, gap: ox };
      }
      return NO;
    }
    // (side by side: the pair's facing hers - o.yaw, a link's: yours)
    const psi = o.yaw ?? gp.rotation.y;
    for (const m of [1, -1]) {
      const c = Math.cos(psi), s = Math.sin(psi), ozm = oz * m, ax = bx - (ox * c + ozm * s), az = bz - (-ox * s + ozm * c); if (!fit(ax, az)) continue;
      const ayaw = psi + (K.ay || 0) * m;
      return { ok: true, kind, mir: m < 0, psi, ax, az, ay: this._floor(ax, az, by0), ayaw, cyaw: -ayaw, bx, bz, by: by0 + (K.toes || 0), byaw: psi + (K.by || 0) * m, gap: Math.hypot(ox, oz) };
    }
    if (o.fallback !== false) { const H = this.place('hug', g, { ...o, fallback: false }); if (H.ok) return H; }
    return NO;
  }
  slot(g) {
    const ev = this.ev, K = ev.K, sp = g?.spot, P = g?.person; if (!K || !sp || !P || !this._seated(g)) return null;
    const f = sp.face ?? P.group.rotation.y, fx = Math.cos(f), fz = -Math.sin(f), lx = Math.sin(f), lz = Math.cos(f), x0 = P.group.position.x, z0 = P.group.position.z;
    const inS = (S, x, z) => x > S.x0 && x < S.x1 && z > S.z0 && z < S.z1;
    let S = null, b0 = 0;
    for (const b of [0, 0.12, 0.25, 0.4]) { const x = x0 - fx * b, z = z0 - fz * b; S = (K.solids || []).find((s) => inS(s, x, z)) || null; if (S) { b0 = b; break; } }
    if (!S) return null;
    for (const side of [1, -1]) {
      const d = 0.5, x = x0 + lx * d * side, z = z0 + lz * d * side;
      if (!inS(S, x - fx * b0 + lx * 0.2 * side, z - fz * b0 + lz * 0.2 * side) || !inS(S, x - fx * b0, z - fz * b0)) continue;
      if ((K.discs || []).some((q) => q !== g.disc && q.r > 0 && (q.x - x) ** 2 + (q.z - z) ** 2 < 0.4 * 0.4)) continue;
      const y = +sp.y || 0;
      return { x, z, yaw: -f, eye: 1.13 + y, y, side, mir: side < 0 };
    }
    return null;
  }

  // ---- showing the bodies ------------------------------------------------------------------------------------------------
  _mirror(H, P, mir) {
    for (const k in H.fr) { const F = H.fr[k]; if (F) F.group.scale.z = 1; }
    if (mir && H.cur) H.cur.group.scale.z = -1;
    const h = P?.head; if (h) h.scale.z = (mir && H.cur ? -1 : 1) * Math.abs(h.scale.x);
  }
  _on(g, H, pose, mir) {
    const P = g.person; let S = this.st.get(g);
    if (!S) { S = { bow0: P.bow, dk: g.drink || null, dkv: g.drink ? g.drink.visible : false, rx: P.head ? P.head.rotation.x : 0, mir: false, pose: null, kb: 0.15, kbB: 0.12, cheek: 0 }; this.st.set(g, S); }
    if (!H.show(pose)) return false;
    S.pose = pose; S.mir = !!mir; this._mirror(H, P, S.mir);
    P.bow = H.bow; if (S.dk) S.dk.visible = false;
    return true;
  }
  _off(g) {
    const S = this.st.get(g); if (!S) return; this.st.delete(g);
    const P = g.person, H = this.framesFor(g);
    if (H) { try { H.show(null); this._mirror(H, P, false); } catch (_) { /* */ } }
    if (P) { P.bow = S.bow0; if (P.head) { P.head.rotation.x = S.rx; P.head.rotation.z = S.bow0; } }
    if (S.dk) S.dk.visible = S.dkv;
  }
  _meOn(pose, mir) {
    const me = this.ev.me; if (!me) return false;
    if (pose === 'own') { const H0 = this.framesFor('me'); if (H0) { H0.show(null); this._mirror(H0, me, false); } this.me = { pose, mir: false }; me.group.visible = true; if (me.head) me.head.rotation.set(0, 0, me.bow ?? 0); return true; }
    const H = this.framesFor('me'); if (!H?.fr[pose] || !H.show(pose)) return false;
    this._mirror(H, me, !!mir); this.me = { pose, mir: !!mir, bow: H.bow }; me.group.visible = true;
    if (me.head) me.head.rotation.set(0, 0, H.bow);
    return true;
  }
  _meOff() {
    const me = this.ev.me; if (!me) return; const H = this.framesFor('me');
    if (H) { try { H.show(null); this._mirror(H, me, false); } catch (_) { /* */ } }
    me.group.visible = false; me.group.rotation.x = 0; if (me.head) me.head.rotation.set(0, 0, me.bow ?? 0); this.me = null;
  }
  show(kind, g, on, o = {}) {
    const K = pairOf(kind); if (!K || !g?.person) return false;
    if (!on) { this._off(g); if (!K.single && o.me !== false) this._meOff(); return true; }
    const Hb = this.framesFor(g); if (!Hb?.fr[K.b]) return false;
    const withMe = !K.single && o.me !== false;
    if (withMe && K.a !== 'own' && !this._F('me', K.a)) return false;
    if (withMe && K.a === 'own' && !this.ev.me) return false;
    if (!this._on(g, Hb, K.b, !!o.mir)) return false;
    if (withMe && !this._meOn(K.a, !!o.mir)) { this._off(g); return false; }
    return true;
  }
  single(g, pose) {
    if (!g?.person) return false;
    if (!pose) { this._off(g); return true; }
    const H = this.framesFor(g); if (!H?.fr[pose]) return false;
    return this._on(g, H, pose, false);
  }
  owns(g) { return this.st.has(g) || this.links.has(g) || this.plan?.g === g; }

  // ---- the heads ---------------------------------------------------------------------------------------------------------
  /**
   * a head turned (yaw: + People's right), bowed (bow: + forward, from the body's own F0) and rolled (+ to People's left),
   * eased k of the way from where it is. Values in the body's own sense: a mirrored body (B on A's left) turns them the
   * mirrored way by itself - toward the partner still (a yaw worked out from the world: _aim, negated for it)
   */
  _head(h, F0, yaw, bow, roll, mir, k) {
    if (!h) return; const y = yaw, r = roll, z = F0 - bow;
    if (k >= 1) { h.rotation.y = y; h.rotation.z = z; h.rotation.x = r; return; }
    h.rotation.y += (y - h.rotation.y) * k; h.rotation.z += (z - h.rotation.z) * k; h.rotation.x += (r - h.rotation.x) * k;
  }
  /** the head's yaw that turns a person at P toward the point (x, z) (mir: on a mirrored body) */
  _toward(P, x, z, mir) { const gp = P.group, a = wrap(facing(x - gp.position.x, z - gp.position.z) - gp.rotation.y); return mir ? -a : a; }
  heads(kind, g, k = 1) {
    const K = pairOf(kind); if (!K || !g?.person) return;
    const S = this.st.get(g), P = g.person, h = P.head, me = this.ev.me, M = this.me, mh = M && me?.group.visible ? me.head : null;
    const bB = S ? P.bow : P.bow ?? 0, mirB = !!S?.mir, bA = M?.bow ?? me?.bow ?? 0, mirA = !!M?.mir;
    const pos = this.ev.pos, ax = mh ? me.group.position.x : pos.x, az = mh ? me.group.position.z : pos.z;
    switch (K.heads) {
      case 'hug': this._head(h, bB, -0.45, 0.05, 0, mirB, k); this._head(mh, bA, -0.45, 0.05, 0, mirA, k); break;
      case 'embrace': this._head(h, bB, -0.6, 0.1, 0.12, mirB, k); this._head(mh, bA, -0.3, 0.18, 0, mirA, k); break;
      case 'dance': this._head(h, bB, -0.7, 0.12, 0.15, mirB, k); this._head(mh, bA, -0.25, 0.2, 0, mirA, k); break;
      case 'kiss': this._head(h, bB, 0.3, -(S?.kbB ?? 0.12), -0.2, mirB, k); this._head(mh, bA, 0.3, S?.kb ?? 0.15, -0.2, mirA, k); break;
      case 'look': { const yb = clamp(this._toward(P, ax, az, mirB), -0.6, 0.6); this._head(h, bB, yb, -0.05, 0, mirB, k); if (mh) { const ya = clamp(this._toward(me, P.group.position.x, P.group.position.z, mirA), -0.6, 0.6); this._head(mh, bA, ya, 0.08, 0, mirA, k); } break; }
      case 'lean': this._head(h, bB, -0.15, 0.05, 0.08, mirB, k); this._head(mh, bA, 0.2, 0.08, 0, mirA, k); break;
      case 'cuddle': this._head(h, bB, -0.15, 0.25, 0.3, mirB, k); this._head(mh, bA, 0.35, 0.2, -0.06, mirA, k); break;
      case 'cheek': { const yb = clamp(this._toward(P, ax, az, mirB), -1.1, 1.1); this._head(h, bB, yb, 0.05, 0.1, mirB, k); this._head(mh, bA, -0.3, 0.05, 0.05, mirA, k); break; }
      case 'seatKiss': this._head(h, bB, -1.05, -0.22, 0.2, mirB, k); this._head(mh, bA, 1.0, 0.3, -0.25, mirA, k); break;
      case 'seatCheek': this._head(h, bB, -1.05, -0.05, 0.15, mirB, k); this._head(mh, bA, -0.15, 0.05, 0.05, mirA, k); break;
      default: break;
    }
  }
  sway(kind, g, phase) {
    const pl = this.plan; if (REDUCED || !pl || pl.g !== g || !pairOf(kind)?.sway) return;
    const me = this.ev.me, gp = g.person.group, mx = (pl.ax + pl.bx) / 2, mz = (pl.az + pl.bz) / 2, a = 0.07 * Math.sin(phase), c = Math.cos(a), s = Math.sin(a), sh = 0.012 * Math.sin(phase * 2);
    const put = (grp, x, z, yaw) => { const dx = x - mx, dz = z - mz; grp.position.x = mx + dx * c + dz * s + pl.nx * sh; grp.position.z = mz - dx * s + dz * c + pl.nz * sh; grp.rotation.y = yaw + a; };
    put(gp, pl.bx, pl.bz, pl.byaw); g.face0 = pl.byaw + a; if (me?.group.visible) put(me.group, pl.ax, pl.az, pl.ayaw);
  }

  // ---- links: held in first person ---------------------------------------------------------------------------------------
  link(kind, g, o = {}) {
    const K = pairOf(this._kindFor(kind, g)), ev = this.ev; if (!K?.link || !g?.person || g.gone) return false;
    if (this.links.has(g)) this.release(g);
    const gp = g.person.group;
    if (K.seat) {
      if (!this._seated(g)) return false;
      const s = this.slot(g), L = { kind, K, seat: true, mir: !!s?.mir, shown: false, r0: g.disc?.r ?? 0.3 };
      this.links.set(g, L); L.shown = this._F(g, K.b) ? this._on(g, this.framesFor(g), K.b, L.mir) : false;
      return true;
    }
    if (this._seated(g)) return false;
    const psi = o.yaw ?? -ev.yaw, [ox, oz] = K.at;
    let m = 0;
    for (const mm of [1, -1]) { const [x, z] = this._offset(ev.pos.x, ev.pos.z, psi, ox, oz * mm); if (ev._free(x, z, 0.22, g.disc)) { m = mm; break; } }
    if (!m) return false;
    const [x, z] = this._offset(ev.pos.x, ev.pos.z, psi, ox, oz * m);
    const L = { kind, K, seat: false, mir: m < 0, r0: g.disc?.r ?? 0.3, px: ev.pos.x, pz: ev.pos.z, psi, still: 1, blk: 0, bob: 0, shown: false, y0: gp.position.y };
    this.links.set(g, L); if (g.disc) g.disc.r = 0;
    gp.position.set(x, this._floor(x, z, gp.position.y), z); gp.rotation.y = psi + (K.by || 0) * m; g.face0 = gp.rotation.y;
    if (this._F(g, K.b)) L.shown = this._on(g, this.framesFor(g), K.b, L.mir);
    return true;
  }
  follow(g, kind, dt, moving) {
    const L = this.links.get(g); if (!L) return 'none'; if (L.seat) return 'ok';
    const ev = this.ev, K = L.K, gp = g.person.group, p = ev.pos, dx0 = p.x - L.px, dz0 = p.z - L.pz;
    const mv = moving ?? dx0 * dx0 + dz0 * dz0 > 1e-6; L.px = p.x; L.pz = p.z;
    const far = Math.hypot(gp.position.x - p.x, gp.position.z - p.z); if (far > 6) return 'far';
    const sd = L.mir ? 1 : -1;
    if (mv) {
      L.still = 0; L.psi = -ev.yaw;
      if (L.shown) { this._off(g); L.shown = false; }
      // (where she would be: at your side; where it is tight, a step behind)
      const off = K.follow || 0.38; let [tx, tz] = this._offset(p.x, p.z, L.psi, 0, sd * off);
      if (!ev._free(tx, tz, 0.2, g.disc)) { const q = this._offset(p.x, p.z, L.psi, -0.5, sd * 0.5); tx = q[0]; tz = q[1]; }
      const dx = tx - gp.position.x, dz = tz - gp.position.z, d = Math.hypot(dx, dz);
      if (d > 1e-4) { const st = Math.min(d * (1 - Math.exp(-6 * dt)), 2.0 * dt) / d, nx = gp.position.x + dx * st, nz = gp.position.z + dz * st; if (ev._free(nx, nz, 0.18, g.disc) || d > 1.2) { gp.position.x = nx; gp.position.z = nz; L.blk = 0; } else L.blk += dt; L.bob += Math.min(d, 2 * dt) * 9; }
      if (d > 1.4) L.blk += dt;
      gp.position.y = this._floor(gp.position.x, gp.position.z, L.y0) + (REDUCED ? 0 : 0.012 * Math.abs(Math.sin(L.bob)));
      gp.rotation.y += wrap(L.psi - gp.rotation.y) * Math.min(1, dt * 6); g.face0 = gp.rotation.y;
      try { ev.crowd?.push?.(gp.position.x, gp.position.z, 0.5); } catch (_) { /* */ }
      if (L.blk > 1.5) return 'blocked';
      return 'ok';
    }
    L.still += dt;
    if (!L.shown && L.still > 0.6 && this._F(g, K.b)) {
      const [x, z] = this._offset(p.x, p.z, L.psi, K.at[0], K.at[1] * (L.mir ? -1 : 1));
      if (ev._free(x, z, 0.2, g.disc)) { gp.position.set(x, this._floor(x, z, L.y0), z); gp.rotation.y = L.psi + (K.by || 0) * (L.mir ? -1 : 1); g.face0 = gp.rotation.y; }
      else gp.position.y = this._floor(gp.position.x, gp.position.z, L.y0);
      L.shown = this._on(g, this.framesFor(g), K.b, L.mir);
    }
    return 'ok';
  }
  release(g) {
    if (!g) return; const L = this.links.get(g); this.links.delete(g); this._off(g);
    const gp = g.person?.group, ev = this.ev; if (!gp || !L || L.seat) return;
    gp.position.y = this._floor(gp.position.x, gp.position.z, L.y0);
    const P = ev.pos; let dx = gp.position.x - P.x, dz = gp.position.z - P.z, d = Math.hypot(dx, dz); const need = (L.r0 || 0.3) + 0.26;
    if (d < need) {
      if (d < 1e-3) { dx = Math.cos(-L.psi + Math.PI / 2); dz = Math.sin(-L.psi + Math.PI / 2); d = 1; }
      const ux = dx / d, uz = dz / d, x = P.x + ux * (need + 0.04), z = P.z + uz * (need + 0.04);
      if (ev._free(x, z, 0.26, g.disc)) { gp.position.x = x; gp.position.z = z; gp.position.y = this._floor(x, z, L.y0); }
      else { const px = gp.position.x - ux * (need + 0.04), pz = gp.position.z - uz * (need + 0.04); if (ev._free(px, pz, 0.24, g.disc)) { P.x = px; P.z = pz; } }
    }
    if (g.disc) { g.disc.r = L.r0; g.disc.x = gp.position.x; g.disc.z = gp.position.z; }
    const f = facing(P.x - gp.position.x, P.z - gp.position.z); gp.rotation.y = f;
    g.spot = { ...(g.spot || {}), x: gp.position.x, z: gp.position.z, y: gp.position.y, face: f, pose: 'stand' }; g.face0 = f;
  }

  // ---- the two-shot ------------------------------------------------------------------------------------------------------
  /** a person's head's middle in the venue's frame (out: a vector) */
  _headC(P, out) {
    const h = P?.head; if (!h) return out.copy(P.group.position).setY(1.55);
    h.updateWorldMatrix(true, false); out.copy(P.headTop || _v4.set(0.01, 1.61, 0)).sub(P.neck || _v4.set(0, 1.48, 0)); h.localToWorld(out);
    return this.ev._toL ? this.ev._toL(out) : out;
  }
  _swim(g) { const k = (x) => SWIM.has(x?.opts?.kit) || !!x?.opts?.swim; return this.ev.occ === 'pool' || k(g) || SWIM.has(this.ev.meOpts?.kit); }
  _inArea(x, z) { const A = this.ev.K?.areas; return !A?.length || A.some((a) => x > a.x0 && x < a.x1 && z > a.z0 && z < a.z1); }
  /** how far the room goes on from (x, z) along (dx, dz) - the wall behind the shot */
  _wallD(x, z, dx, dz) { for (let d = 0.3; d < 30; d += 0.3) if (!this._inArea(x + dx * d, z + dz * d)) return d; return 30; }
  shot(kind, g, o = {}) {
    if (this.gone || !g?.person || this.plan) return null;
    const pl = this.place(kind, g, o); if (!pl.ok) return null;
    kind = pl.kind; const K = pairOf(kind); if (!K || K.single || !this.ready(kind, g)) return null;
    const ev = this.ev, me = ev.me, gp = g.person.group, cam = ev.cam; if (!me || !cam) return null;
    const sv = { px: ev.pos.x, pz: ev.pos.z, yaw: ev.yaw, pitch: ev.pitch, bx: gp.position.x, by: gp.position.y, bz: gp.position.z, bry: gp.rotation.y, face0: g.face0, fov: cam.fov, discR: g.disc ? g.disc.r : null };
    // (the two of them where the moment puts them)
    gp.position.set(pl.bx, pl.by, pl.bz); gp.rotation.y = pl.byaw; g.face0 = pl.byaw;
    me.group.position.set(pl.ax, pl.ay, pl.az); me.group.rotation.set(0, pl.ayaw, 0);
    if (!this.show(kind, g, true, { mir: pl.mir })) { gp.position.set(sv.bx, sv.by, sv.bz); gp.rotation.y = sv.bry; g.face0 = sv.face0; return null; }
    const plan = { kind, g, K, pl, sv, dur: K.dur || 1.6, t: 0, ax: pl.ax, az: pl.az, ay: pl.ay, ayaw: pl.ayaw, bx: pl.bx, bz: pl.bz, byaw: pl.byaw, nx: 0, nz: 0, cam: new THREE.Vector3(), look: new THREE.Vector3(), C: new THREE.Vector3(), fov: sv.fov, fit: { gap: pl.gap, dh: 0 }, orbit: REDUCED ? 0 : o.orbit ?? K.orbit ?? 0 };
    this.plan = plan;
    this._fit(plan);
    this.heads(kind, g, 1);
    ev.pos.x = plan.ax; ev.pos.z = plan.az;
    if (!this._camera(plan, o)) { this.unshot(plan); return null; }
    cam.fov = plan.fov; cam.updateProjectionMatrix();
    this.aim(plan, 0);
    return plan;
  }
  /** the pair fitted to each other: chests never through each other, a kiss's heads together, her lips by your cheek */
  _fit(pl) {
    const K = pl.K, g = pl.g, me = this.ev.me, gp = g.person.group, S = this.st.get(g);
    const ux = pl.bx - pl.ax, uz = pl.bz - pl.az, L = Math.hypot(ux, uz) || 1, u = [ux / L, uz / L]; pl.nx = -u[1]; pl.nz = u[0];
    const setA = (gap) => { pl.ax = pl.bx - u[0] * gap; pl.az = pl.bz - u[1] * gap; me.group.position.x = pl.ax; me.group.position.z = pl.az; pl.fit.gap = gap; };
    const FA = this.me?.pose && this.me.pose !== 'own' ? this._F('me', this.me.pose) : null, FB = S ? this._F(g, S.pose) : null;
    const gapMin = (FA?._ext ?? 0.13) + (FB?._ext ?? 0.15) + 0.02;
    if (K.fit === 'chest' || K.fit === 'kiss') setA(Math.max(K.at[0], gapMin));
    if (K.fit === 'kiss' && S) {
      this.heads(pl.kind, g, 1); const hA = this._headC(me, _v0), hB = this._headC(g.person, _v1);
      const dh = hA.y - hB.y, th = Math.atan2(Math.max(0, dh), 0.17); pl.fit.dh = dh;
      S.kb = clamp(0.1 + th * 0.55, 0.1, 0.3); S.kbB = clamp(0.1 + th * 0.45, 0.1, 0.3);
      if (dh > 0.12) gp.position.y += 0.02;
      for (let i = 0; i < 3; i++) {
        this.heads(pl.kind, g, 1); const a = this._headC(me, _v0), b = this._headC(g.person, _v1), hd = (b.x - a.x) * u[0] + (b.z - a.z) * u[1];
        if (Math.abs(hd - 0.17) < 0.006) break; const want = pl.fit.gap - (hd - 0.17); setA(Math.max(gapMin - 0.03, want));
        if (want < gapMin - 0.03) { S.kb = Math.min(0.35, S.kb + 0.06); S.kbB = Math.min(0.35, S.kbB + 0.03); }
      }
      const a = this._headC(me, _v0), b = this._headC(g.person, _v1); pl.fit.hd = +(((b.x - a.x) * u[0] + (b.z - a.z) * u[1])).toFixed(3);
    }
    if (K.fit === 'cheek' && S) {
      // (her lips 0.05 m from your cheek: you stepped to suit)
      this.heads(pl.kind, g, 1); const a = this._headC(me, _v0), b = this._headC(g.person, _v1);
      const f = me.group.rotation.y, fx = Math.cos(f), fz = -Math.sin(f), rx = Math.sin(f), rz = -Math.cos(f);
      const ck = _v2.set(a.x + fx * 0.04 + rx * 0.07, a.y - 0.02, a.z + fz * 0.04 + rz * 0.07);
      const bf = gp.rotation.y, lip = _v3.set(b.x + Math.cos(bf) * 0.09, b.y - 0.04, b.z - Math.sin(bf) * 0.09);
      const ex = ck.x - lip.x, ez = ck.z - lip.z, e = Math.hypot(ex, ez);
      if (e > 0.05) { const k = (e - 0.05) / e; pl.ax -= ex * k; pl.az -= ez * k; me.group.position.x = pl.ax; me.group.position.z = pl.az; }
      pl.fit.gap = Math.hypot(pl.bx - pl.ax, pl.bz - pl.az);
    }
    if (K.fit === 'seatKiss' && S) {
      // (seated side by side: you lean in to her - your whole body rolled toward her about your seat - the heads 0.17 apart)
      me.group.rotation.order = 'YXZ'; let roll = 0.06;
      for (let i = 0; i < 4; i++) {
        this._roll(me.group, pl, roll); this.heads(pl.kind, g, 1); const a = this._headC(me, _v0), b = this._headC(g.person, _v1), d = Math.hypot(b.x - a.x, b.z - a.z);
        if (Math.abs(d - 0.17) < 0.01) break; roll = clamp(roll + (d - 0.17) * 1.2 * (pl.mir ? 1 : 1), 0, 0.3);
      }
      pl.fit.roll = +roll.toFixed(3);
    }
  }
  /** your seated body leant toward her by roll about your seat (the pelvis kept where it sits) */
  _roll(grp, pl, roll) {
    const r = (pl.mir ? 1 : -1) * roll; grp.rotation.x = r;
    // (rolled about the group's origin the seat would swing out: brought back so the pelvis (0, 0.52, 0) stays)
    // (rotation.x by r carries the local point (0, ps, 0) to (0, ps cos r, ps sin r); the body's local z (its left) is
    // (sin f, cos f) in the venue's frame)
    const ps = 0.52, dy = ps * (Math.cos(r) - 1), dzL = ps * Math.sin(r), f = pl.ayaw;
    grp.position.set(pl.ax - dzL * Math.sin(f), pl.ay - dy, pl.az - dzL * Math.cos(f));
  }
  /** the camera's place for the shot: side profile, three-quarter, over your shoulder - free, its line free, looking out to the nearer wall */
  _camera(pl, o = {}) {
    const ev = this.ev, K = pl.K, g = pl.g, me = ev.me, swim = this._swim(g);
    const hA = this._headC(me, _v0), hB = this._headC(g.person, _v1), C = pl.C.copy(hA).add(hB).multiplyScalar(0.5);
    let ux = hB.x - hA.x, uz = hB.z - hA.z; const L = Math.hypot(ux, uz);
    if (L < 0.05 || K.seat || K.by !== TOWARD) { const f = pl.byaw - (K.by || 0) * (pl.mir ? -1 : 1); ux = -Math.sin(f); uz = -Math.cos(f); if (K.by !== TOWARD && !K.seat && pl.ax !== pl.bx) { ux = pl.bx - pl.ax; uz = pl.bz - pl.az; } const l2 = Math.hypot(ux, uz) || 1; ux /= l2; uz /= l2; } else { ux /= L; uz /= L; }
    const nx = -uz, nz = ux, V = VIEW[swim ? 'shoulders' : K.view === 'waist' && o.view === 'chest' ? 'chest' : K.view] || VIEW.chest, d = swim ? V.d : K.d || V.d;
    pl.fov = (2 * Math.atan(V.H / 2 / d) * 180) / Math.PI; pl.view = swim ? 'shoulders' : K.view;
    // (whose face we want: a face-to-face pair from the side; a side-by-side or seated pair from in front of them)
    const fwd = K.by === TOWARD ? null : [Math.cos(pl.byaw), -Math.sin(pl.byaw)];
    const r0 = g.disc ? g.disc.r : 0; if (g.disc) g.disc.r = 0;
    const tries = [];
    for (const s of [1, -1]) tries.push([0, nx * s, nz * s, d]);
    for (const s of [1, -1]) for (const a of [0.61, -0.61]) { const c = Math.cos(a), sn = Math.sin(a), x = nx * s, z = nz * s; tries.push([1, x * c - z * sn, x * sn + z * c, d]); }
    for (const s of [1, -1]) { const x = -ux * 0.9 + nx * 0.35 * s, z = -uz * 0.9 + nz * 0.35 * s, l = Math.hypot(x, z); tries.push([2, x / l, z / l, 1.2]); }
    let best = null;
    // (a packed room: a second pass where the crowd's people (soft discs) do not block - aim() pushes them clear)
    const scan = (soft) => {
      for (const [cat, dx, dz, dd] of tries) {
        if (best && cat > best.cat) break;
        if (fwd && dx * fwd[0] + dz * fwd[1] < 0.35) continue;
        const x = C.x + dx * dd, z = C.z + dz * dd;
        if (!ev._free(x, z, 0.25, null, soft) || !ev._free(C.x + dx * dd * 0.45, C.z + dz * dd * 0.45, 0.1, null, soft) || !ev._free(C.x + dx * dd * 0.75, C.z + dz * dd * 0.75, 0.12, null, soft)) continue;
        const w = this._wallD(C.x, C.z, -dx, -dz);
        if (!best || w < best.w) best = { cat, x, z, w, dx, dz, dd };
      }
    };
    try { scan(false); if (!best) scan(true); } finally { if (g.disc) g.disc.r = r0; }
    if (!best) return false;
    pl.cam.set(best.x, C.y + V.cy, best.z); pl.look.set(C.x, C.y + V.ly, C.z); pl.dir = [best.dx, best.dz, best.dd]; pl.cat = best.cat;
    return true;
  }
  aim(pl, t) {
    if (!pl || pl !== this.plan) return; const ev = this.ev, g = pl.g, gp = g.person.group; pl.t = t;
    // (she stays turned to you: Hangout eases her toward face0 before this)
    if (!pl.K.sway) { gp.rotation.y = pl.byaw; g.face0 = pl.byaw; }
    const u = ease(t / Math.max(0.5, pl.dur)), push = REDUCED ? 0 : 0.08 * u;
    let cx = pl.cam.x, cz = pl.cam.z;
    if (pl.orbit) { const a = pl.orbit * (u - 0.5), c = Math.cos(a), s = Math.sin(a), dx = cx - pl.C.x, dz = cz - pl.C.z; cx = pl.C.x + dx * c - dz * s; cz = pl.C.z + dx * s + dz * c; }
    const lx = pl.look.x - cx, ly = pl.look.y - pl.cam.y, lz = pl.look.z - cz, l = Math.hypot(lx, ly, lz) || 1;
    _v2.set(cx + (lx / l) * push, pl.cam.y + (ly / l) * push, cz + (lz / l) * push);
    ev._look(_v2, pl.look);
    if (Math.abs(ev.cam.fov - pl.fov) > 0.01) { ev.cam.fov = pl.fov; ev.cam.updateProjectionMatrix(); }
    this.heads(pl.kind, g, Math.min(1, t / 0.3 + 0.35));
    try { ev.crowd?.push?.(pl.C.x, pl.C.z, 1.4); ev.crowd?.push?.((cx + pl.C.x) / 2, (cz + pl.C.z) / 2, 1.0); ev.crowd?.push?.(cx, cz, 0.7); } catch (_) { /* */ }
  }
  unshot(pl, o = {}) {
    if (!pl || pl !== this.plan) return; this.plan = null;
    const ev = this.ev, g = pl.g, gp = g.person?.group, sv = pl.sv, cam = ev.cam, K = pl.K;
    if (cam && cam.fov !== sv.fov) { cam.fov = sv.fov; cam.updateProjectionMatrix(); }
    this._meOff();
    if (!o.link) this._off(g);
    if (gp) { gp.position.y = sv.by; if (K.sway) { gp.position.x = pl.bx; gp.position.z = pl.bz; gp.rotation.y = pl.byaw; } if (!K.seat) { g.face0 = gp.rotation.y; if (g.spot) g.spot = { ...g.spot, face: gp.rotation.y }; } else { gp.rotation.y = sv.bry; g.face0 = sv.face0; } }
    if (o.link) { ev.pos.x = pl.ax; ev.pos.z = pl.az; ev.yaw = -pl.ayaw; return; }
    if (K.seat) { ev.pos.x = sv.px; ev.pos.z = sv.pz; return; }
    // (back where you stood - or a step back from her, if that is taken now)
    if (ev._free(sv.px, sv.pz, 0.24, g.disc) || !gp) { ev.pos.x = sv.px; ev.pos.z = sv.pz; }
    else { const dx = pl.ax - pl.bx, dz = pl.az - pl.bz, l = Math.hypot(dx, dz) || 1; for (const dd of [0.85, 1.0, 1.2]) { const x = pl.bx + (dx / l) * dd, z = pl.bz + (dz / l) * dd; if (ev._free(x, z, 0.24, g.disc)) { ev.pos.x = x; ev.pos.z = z; break; } } }
    if (gp) ev.yaw = Math.atan2(gp.position.z - ev.pos.z, gp.position.x - ev.pos.x);
  }
  stats() { let frames = 0; for (const H of this.reg.values()) for (const k in H.fr) if (H.fr[k]) frames++; return { frames, built: this.built.slice() }; }
  dispose() {
    if (this.gone) return;
    try { if (this.plan) this.unshot(this.plan); } catch (_) { /* */ }
    for (const g of [...this.links.keys()]) { try { this.release(g); } catch (_) { /* */ } }
    for (const g of [...this.st.keys()]) { try { this._off(g); } catch (_) { /* */ } }
    try { this._meOff(); } catch (_) { /* */ }
    this.gone = true;
    for (const H of this.mine) { try { H.dispose(); } catch (_) { /* */ } }
    this.mine.clear(); this.reg.clear();
  }
}
