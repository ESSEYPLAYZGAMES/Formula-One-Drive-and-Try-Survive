// Swimwear: what is really worn at a pool club, a beach club, on a yacht (a Las Vegas dayclub, a Miami beach club, a
// Monaco yacht) - world/People.js's swimwear kits. Hers: bikinis (a triangle top on fine ties, a ruched or twisted
// bandeau, an underwired balconette, a sporty scoop; bottoms full, cheeky, Brazilian or a thong's strip - the cleft of
// her seat always under the cloth - high-leg, tied at the sides or on rings), monokinis (a one-piece cut out at the centre front, at the waist either side, laced across, ringed, or a
// plunge open at the sides), one-pieces (high-cut, scooped low behind, plunging, belted) and what goes over them (a sheer
// pareo tied at the hip, a crochet or mesh mini, an open shirt, a chiffon kaftan) - with slides, heeled or platform
// sandals, sunglasses, a straw sun hat, a beach tote, a belly chain, an anklet. His: swim shorts, short or to above the
// knee, plain or printed, an open resort or linen shirt over them, slides. Always opaque where it covers - the bust, the
// seat, between the legs: a sheer layer only ever over the swimwear itself.
// Each piece built once, against the person's own torso (T: People's torsoOf - T.pt(f, angle, out), T.c(f), T.sec(f),
// T.H, T.fLo; angle 0 the front, +-pi the back; f a share of the torso's length, 0 at the hips' joints, below 0 the
// seat) and her own legs as People builds them - every measure a share of hers, nothing drawn per frame.
import * as THREE from 'three';
import { strip, oRing, twist as twistOf } from './Trims.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const ss3 = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
const gau = (x, s) => Math.exp(-((x / s) ** 2));
const clamp01 = (x) => Math.max(0, Math.min(1, x));
/** an angle folded to |a| in 0..pi (0 the front, pi the back) */
const bOf = (a) => Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
/** a superellipse's half-width across u in [0, 1] (p: its squareness) - a cut-out's rounded ends */
const sEll = (u, p = 2.4) => Math.pow(Math.max(0, 1 - Math.abs(2 * u - 1) ** p), 1 / p);
/** her own measure against the torso the shapes were drawn on */
const kOf = (T) => T.H / 0.66;
/** the way out of the torso at p (on its section at f), level */
const outN = (T, p, f) => p.clone().sub(T.c(f)).setY(0).normalize();
/** a geometry's colour set to k (all its vertices) -> g */
function tintG(g, k) { const P = g.attributes.position, C = new Float32Array(P.count * 3).fill(k); g.setAttribute('color', new THREE.BufferAttribute(C, 3)); return g; }

// ---- her legs as People builds them, and where each comes out of her torso ------------------------------------------
/**
 * Each thigh as People's bare legs build it (J: the pose's joints; F: her figure; legRad, legForm: People's) -> [{ P0
 * (the hip's joint, drawn in), d1 (down the thigh), L (the leg's length), tj (the knee's share), rad(t), back(t),
 * ka(t, a), N, B (the tube's frame: toward its back, across) }]
 */
export function thighsOf(J, F, fem, legRad, legForm) {
  return ['R', 'L'].map((s) => {
    const P0 = J['hip' + s].clone().setZ(J['hip' + s].z * (fem ? 0.94 : 0.86)), k = J['knee' + s], an = J['ankle' + s];
    const L1 = Math.max(0.01, P0.distanceTo(k)), L = L1 + k.distanceTo(an), tj = L1 / L, rad = legRad(F.leg, tj, fem), fm = fem ? legForm(F.leg, tj, s === 'R' ? -1 : 1) : null;
    const d1 = k.clone().sub(P0).normalize(), N = new THREE.Vector3().crossVectors(d1, V(0, 0, 1)).normalize(), B = new THREE.Vector3().crossVectors(d1, N), tp = rootTaper(J, s);
    return { P0, d1, L, tj, rad, back: fm ? (t) => fm.back(t) + fm.hb(t) : (t) => F.leg[3] * 0.28 * gau(t - tj - 0.3 * (1 - tj), 0.13), ka: fm || tp ? (t, a) => (fm ? fm.ka(t, a) : 1) * (tp ? tp(t, a) : 1) : null, N, B };
  });
}
/**
 * A thigh drawn forward from the hip (sitting, kneeling): its top at the root eased down into the fold at the groin, as
 * a thigh's is when the hip is bent - not a tube's full round standing over her lower belly (s: 'R' | 'L') -> (t, a) its
 * radius' share (a from the leg's back - its underside, sitting; the top at pi), or null (standing: none)
 */
export function rootTaper(J, s) {
  const d = J['knee' + s].clone().sub(J['hip' + s]).normalize(), bend = ss3(-0.6, -0.15, d.y);
  if (bend < 0.01) return null;
  // (most over its top toward the other thigh - where the two close over her crotch: the fold between them left open, as a
  // seated body's is - its angle th round the leg from its back, as limbAlong's rings count it)
  const N = new THREE.Vector3().crossVectors(d, V(0, 0, 1)).normalize(), B = new THREE.Vector3().crossVectors(d, N), o = s === 'R' ? 'L' : 'R';
  const v = V(0, 0.75, 0.66 * Math.sign(J['hip' + o].z - J['hip' + s].z || (s === 'R' ? 1 : -1))), th = Math.atan2(v.dot(B), v.dot(N));
  return (t, a) => 1 - bend * 0.8 * (1 - ss3(0, 0.42, t)) * ((1 + Math.cos(a - th)) / 2) ** 0.9;
}
/** how far p is out of the nearest thigh's surface (inside: < 0) */
function thighD(LG, p) {
  let best = 9; const e = V(), c = V();
  for (const lg of LG) {
    const u = e.copy(p).sub(lg.P0).dot(lg.d1), t = Math.max(0, Math.min(lg.tj, u / lg.L));
    c.copy(lg.P0).addScaledVector(lg.d1, t * lg.L).addScaledVector(lg.N, lg.back(t)); e.copy(p).sub(c); if (u > 0) e.addScaledVector(lg.d1, -e.dot(lg.d1));
    const el = e.length(), r = lg.rad(t) * (lg.ka ? lg.ka(t, Math.atan2(e.dot(lg.B), e.dot(lg.N))) : 1);
    best = Math.min(best, el - r);
  }
  return best;
}
/**
 * Where her thighs come out of her torso, all round it: X(a) - the highest f at angle a where the torso's surface goes
 * into a thigh (T.fLo where it never does: between them, in front and behind). Found once per person: a few dozen
 * angles, scanned down from the hips
 */
export function legCross(T, LG) {
  const NA = 48, tab = [], dIn = (f, a) => Math.min(thighD(LG, T.pt(f, a, 0)), thighD(LG, T.pt(f, -a, 0)));
  for (let i = 0; i <= NA; i++) {
    const a = (i / NA) * Math.PI; let fx = T.fLo;
    for (let f = 0.24; f > T.fLo; f -= 0.006) if (dIn(f, a) < 0) {
      // (found between this step and the last: halved down to a millimetre or so)
      let lo = f, hi = f + 0.006; for (let k = 0; k < 4; k++) { const m = (lo + hi) / 2; if (dIn(m, a) < 0) lo = m; else hi = m; }
      fx = (lo + hi) / 2; break;
    }
    tab.push(fx);
  }
  // (smoothed round her - the crease a soft line, not each sample's own step)
  for (let it = 0; it < 3; it++) { const t0 = tab.slice(); for (let i = 0; i <= NA; i++) tab[i] = (t0[Math.abs(i - 1)] + 2 * t0[i] + t0[i < NA ? i + 1 : NA - 1]) / 4; }
  return (a) => { const x = (bOf(a) / Math.PI) * NA, i = Math.min(NA - 1, Math.floor(x)); return tab[i] + (tab[i + 1] - tab[i]) * (x - i); };
}

// ---- the bottoms, a one-piece's leg line ----------------------------------------------------------------------------
/**
 * A bikini's bottoms, or a one-piece's leg line (o: OF.brief or OF.suit - { rise (its top in front, f), riseB (behind),
 * side (its top at the hips), sideW (how deep it is there: a tie's string or a band; a one-piece: 0 - its leg line's apex
 * at side), leg (how high its leg opening is cut at the hip: 0 a classic cut, 1 high-leg), back ('full' | 'cheeky' |
 * 'brazil' | 'thong': BACKS), gus (the gusset's half-width, rad) }; X: legCross's) -> { lo(a), hi(a), back } - its lower edge (the leg
 * openings, down to the crotch in front and behind) and its top. The leg openings hug the crease where each thigh leaves
 * her - never cut into the thigh itself
 */
export function briefLines(T, o, X) {
  const rise = o.rise ?? 0.1, riseB = o.riseB ?? rise + 0.02, side = o.side ?? rise + 0.02, sideW = o.sideW ?? 0.06, leg = o.leg ?? 0, cheek = o.back === 'cheeky' ? 1 : 0, fL = T.fLo;
  // (its top: across the front at rise, sweeping up to the hips as high as its sides are cut, down behind to riseB - a
  // smooth line all round)
  const hi = (a) => { const b = bOf(a); return b < Math.PI / 2 ? rise + (side - rise) * ss3(0.25, 1.45, b) : side + (riseB - side) * ss3(1.7, 2.9, b); };
  // (the leg opening: from the gusset (gus either side of the middle, down at the crotch) up the crease to the hip -
  // higher and sooner on a high-leg cut - over the side under its band, down behind across the seat: a full back from
  // the crease under each round of the seat, a cheeky one higher over their outer curves, coming down to the middle)
  const gus = o.gus ?? 0.2, bS0 = 1.25 - 0.25 * leg, bS1 = 1.95;
  // (a Brazilian back or a thong's - BACKS: [w0, wT, k] - its panel behind narrowing from wT either side of the middle at
  // its top (the angle from the middle of her back) to w0 at its foot between her thighs, its sides' curve k: a Brazilian's
  // a deep V over the middle of her seat, its lower cheeks bare; a thong's a small triangle under its top on to a strip a
  // centimetre and a half wide down the cleft of her seat to the gusset - the cleft always under the strip)
  const BK = BACKS[o.back] || null;
  const design = (a) => {
    const b = bOf(a), top = hi(a) - sideW;
    if (b < bS0) return fL + (top - fL) * ss3(gus, bS0, b) ** (1.25 - 0.45 * leg);
    if (BK) { const d = Math.PI - b, [w0, wT, k] = BK; return d >= wT ? top : d <= w0 ? fL : fL + (top - fL) * ((d - w0) / (wT - w0)) ** k; }
    if (b < bS1) return top;
    const u = (b - bS1) / (Math.PI - bS1);
    return cheek ? top + (fL - top) * ss3(0.15, 1, u) ** 0.7 : top + (fL - top) * ss3(0, 0.8, u) ** 0.85;
  };
  // (the two met smoothly - a soft max, no corner where the cut's own line gives way to the crease)
  const smax = (x, y, k = 0.018) => (x + y + Math.sqrt((x - y) ** 2 + k * k)) / 2;
  // (at the very front and back of the crotch the cloth carried on in between the thighs where they meet - into the
  // crease, never stopping short of it: the gusset closes it beneath)
  // (a few millimetres clear of the crease, the two met softly; the cloth lifted over the thigh by overThighs where the
  // thigh still comes up under it)
  // (carried in only near the middle, the crotch's own width: off it, the leg opening on the crease itself, where her
  // thigh is flush with her - never on her torso inside the thigh, where the thigh's facets would come up through it)
  const lo0 = (a) => { const b = bOf(a), c = Math.min(b, Math.PI - b); return Math.min(hi(a) - 0.012, smax(design(a), X(a) + 0.004 - 0.05 * (1 - ss3(0.05, 0.25, c)), 0.03)); };
  // (and the leg opening rising all the way from the crotch to the hip, in front and behind - never dipping again where
  // the crease falls away toward her side, which would cut a step into it there: each side's highest so far, softened)
  const NB = 360, tb = Array.from({ length: NB + 1 }, (_, i) => lo0((i / NB) * Math.PI)), iM = Math.round(((bS0 + (BK ? Math.PI - BK[1] : bS1)) / 2 / Math.PI) * NB);
  for (let i = 1; i <= iM; i++) tb[i] = Math.max(tb[i], tb[i - 1]);
  for (let i = NB - 1; i > iM; i--) tb[i] = Math.max(tb[i], tb[i + 1]);
  for (let it = 0; it < 10; it++) { const t0 = tb.slice(); for (let i = 1; i < NB; i++) tb[i] = Math.min(hi((i / NB) * Math.PI) - 0.012, (t0[i - 1] + 2 * t0[i] + t0[i + 1]) / 4); }
  const lo = (a) => { const x = (bOf(a) / Math.PI) * NB, i = Math.min(NB - 1, Math.floor(x)); return tb[i] + (tb[i + 1] - tb[i]) * (x - i); };
  return { lo, hi, X, back: o.back || 'full' };
}
/** the backs narrower than a cheeky one (briefLines): [w0 (half-width at its foot), wT (at its top), k (its sides' curve)] - angles round her from the middle of her back */
const BACKS = { brazil: [0.13, 0.85, 0.62], thong: [0.042, 0.46, 0.27] };
/** her bottoms' columns round her (L.back): closer together over the front's V, and behind where a narrow back needs them - its sides' curve, a thong's strip -> angles (m of them, from -pi) */
function briefAngles(back, m) {
  const [kB, wB] = back === 'thong' ? [6, 0.22] : back === 'brazil' ? [2.6, 0.45] : [0.8, 0.8], G = 720, C = [0];
  for (let i = 0; i < G; i++) { const a = -Math.PI + ((i + 0.5) / G) * 2 * Math.PI, b = bOf(a); C.push(C[i] + 1 + 1.4 * gau(b / 0.5, 1) + kB * gau((Math.PI - b) / wB, 1)); }
  const A = []; for (let j = 0, i = 0; j < m; j++) { const c = (j * C[G]) / m; while (C[i + 1] < c) i++; A.push(-Math.PI + ((i + (c - C[i]) / (C[i + 1] - C[i])) / G) * 2 * Math.PI); }
  return A;
}
/** rings of points (each m round, closed) lofted into one surface, its faces outward -> geometry */
function loftRings(R) {
  const K = R.length, M = R[0].length, pos = new Float32Array(K * M * 3), idx = [];
  for (let k = 0; k < K; k++) for (let j = 0; j < M; j++) { const p = R[k][j], i = (k * M + j) * 3; pos[i] = p.x; pos[i + 1] = p.y; pos[i + 2] = p.z; }
  for (let k = 0; k < K - 1; k++) for (let j = 0; j < M; j++) { const j1 = (j + 1) % M, a = k * M + j, b = k * M + j1, c = (k + 1) * M + j1, d = (k + 1) * M + j; idx.push(a, c, b, a, d, c); }
  // (turned outward: from the middle of its rings, its faces' normals pointing away)
  let s = 0; const cx = new THREE.Vector3(); for (let i = 0; i < pos.length; i += 3) cx.set(cx.x + pos[i], cx.y + pos[i + 1], cx.z + pos[i + 2]); cx.multiplyScalar(3 / pos.length);
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3, ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    s += (uy * vz - uz * vy) * (pos[a] - cx.x) + (uz * vx - ux * vz) * 0 + (ux * vy - uy * vx) * (pos[a + 2] - cx.z);
  }
  if (s < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
/**
 * The bottoms' cloth's lift (L: briefLines'; proud: a monokini's front piece tucked under its top, for |a| below it) -
 * close on her, bridging the cleft of the seat behind and the dip at the crotch in front -> out(f, a)
 */
function briefOut(T, L, tight, proud = 0) {
  const fLo = T.fLo, K = tiltOf(T);
  // (where a thigh still comes up under it, overThighs lifts it out over the thigh as built, once both legs are)
  return (f, a) => { const b = bOf(a); return K(f, a) * (tight + 0.007 * gau(Math.PI - b, 0.22) * ss3(0.08, -0.05, f) * ss3(fLo + 0.02, -0.13, f) + 0.003 * gau(b, 0.25) * ss3(-0.12, fLo + 0.01, f) + (proud ? 0.0009 * (1 - ss3(proud, proud + 0.3, b)) * ss3(L.hi(a) - 0.03, L.hi(a) - 0.016, f) : 0)); };
}
/**
 * How much further a lift People's torso takes level, across its section (pt's out), must go to stand as far off her
 * surface where that faces down - the seat's lower round turning under to its fold, the crotch: there a level lift only
 * slides along her, the cloth and the skin under it within a hair of each other -> (f, a) the factor, 1 .. 3 (none above
 * the seat's round, where she is upright)
 */
function tiltOf(T) {
  const up = V(0, 1, 0).applyQuaternion(T.q), d = V(), o = V();
  return (f, a) => {
    if (f > 0.08) return 1;
    const e = 0.005, p0 = T.pt(f - e, a), p1 = T.pt(f + e, a); d.subVectors(p1, p0);
    o.addVectors(p0, p1).multiplyScalar(0.5).sub(T.c(f)); o.addScaledVector(up, -o.dot(up)); const ol = o.length(); if (ol < 1e-6) return 1;
    const dy = Math.abs(d.dot(up)), dr = d.dot(o) / ol;
    return Math.min(3, Math.hypot(dy, dr) / Math.max(1e-6, dy));
  };
}
/**
 * The gusset: a small closed cup of the cloth under her, between the thighs - nothing of her there to see; up into the
 * bottoms' own cloth only where that comes down between her legs, in front and behind (L.lo near her torso's foot) -
 * never a band of it round under her seat where her skin is bare (a narrow back's lower cheeks)
 */
function gusset(T, out, ctx, L = null) {
  // (only where the cloth itself comes right down to her torso's foot - its own width there, tucked up under it: never wider
  // than the cut's V where that narrows to the crotch, which would show the cup's sides below the leg openings behind)
  const n = ctx.n || ((k) => k), fL = T.fLo, hi = L ? (a) => fL + 0.0005 + 0.0345 * ss3(0.012, 0.002, L.lo(a) - fL) : fL + 0.035;
  return ctx.band(T, fL, hi, (f, a) => out(f, a) + 0.0004, { m: n(32, 10), rows: 3, cap: 'lo' });
}
/**
 * The bottoms themselves (L: briefLines; tight: how close the cloth is) -> [geometry]: the cloth from the leg openings to
 * its top - over the cleft of the seat bridging it, as stretch cloth does - its edges turned under; the gusset closing
 * under her between the thighs
 */
export function briefCloth(T, L, tight = 0.0022, ctx = {}, proud = 0) {
  const n = ctx.n || ((k) => k), out = briefOut(T, L, tight, proud), Q = ctx.Q ?? 1, th = 0.6 * tight, R = n(12, 4);
  // (its columns where its edges need them - the front's V, a narrow back's curve and strip; its rows from the leg
  // opening to its top, both edges turned under)
  const A = briefAngles(L.back, n(L.back === 'thong' ? 66 : 60, 16)), ring = (s, dO = 0) => A.map((a) => { const f0 = L.lo(a), f = f0 + (L.hi(a) - f0) * s; return T.pt(f, a, out(f, a) + dO); });
  const rings = []; if (Q >= 0.6) rings.push(ring(0, -th)); for (let i = 0; i <= R; i++) rings.push(ring(i / R)); if (Q >= 0.6) rings.push(ring(1, -th));
  return [loftRings(rings), gusset(T, out, ctx, L)];
}
/**
 * A one-piece's own leg line and seat (L: swimLines', its suitHi): the cloth from the leg openings - turned under there,
 * its columns where the cut needs them, front and behind - up to suitHi, its top sinking a hair under People's bodice,
 * which lies over it from a little below there: one surface to see, the bodice's edge a seam's line -> geometry
 */
function suitCloth(T, L, tight, ctx) {
  const n = ctx.n || ((k) => k), o0 = briefOut(T, L, tight), out = (f, a) => o0(f, a) - 0.0007 * ss3(L.suitHi(a) - 0.035, L.suitHi(a) - 0.012, f), R = n(10, 3);
  const A = briefAngles(L.back, n(64, 16)), ring = (s, dO = 0) => A.map((a) => { const f0 = L.lo(a), f = f0 + (L.suitHi(a) - f0) * s; return T.pt(f, a, out(f, a) + dO); });
  const rings = []; if ((ctx.Q ?? 1) >= 0.6) rings.push(ring(0, -0.6 * tight)); for (let i = 0; i <= R; i++) rings.push(ring(i / R));
  return loftRings(rings);
}
/**
 * The skin of her hips and her seat, from her crotch up to a little over the bottoms' top (hi: a number) - the torso's
 * own surface, under the cloth and bare beside it (a high leg's hips, a cheeky cut's lower seat) -> geometry
 */
export function pelvisSkin(T, hi, ctx = {}, L = null) {
  const n = ctx.n || ((k) => k);
  // (sunk a little under her own surface where the cloth covers it (L: the lines it is cut to) - never a facet of it
  // through the cloth over the seat's curve)
  const K = tiltOf(T), fL = T.fLo, out = L ? (f, a) => { const s = ss3(L.lo(a) + 0.004, L.lo(a) + 0.014, f) * (L.brief ? ss3(L.hi(a) - 0.004, L.hi(a) - 0.014, f) : 1); return s > 0 ? -0.003 * K(f, a) * s : 0; } : () => 0;
  // (its columns closer behind - over the seat and its fold, where her thighs grow out of it - and at the crotch; fewer
  // round the sides of her front, under the cloth or smooth there)
  const M = n(48, 14), R = n(18, 5), G = 720, C = [0];
  for (let i = 0; i < G; i++) { const b = bOf(-Math.PI + ((i + 0.5) / G) * 2 * Math.PI); C.push(C[i] + 0.7 + 0.9 * gau((Math.PI - b) / 0.95, 1) + 0.35 * gau(b / 0.3, 1)); }
  const A = []; for (let j = 0, i = 0; j < M; j++) { const c = (j * C[G]) / M; while (C[i + 1] < c) i++; A.push(-Math.PI + ((i + (c - C[i]) / (C[i + 1] - C[i])) / G) * 2 * Math.PI); }
  // (its rows spaced by her surface's own length down it - its front, its side, over each round of her seat - and by its
  // turning: closer where the seat turns under to its fold, never a long facet across the fold standing out of her there)
  const NS = 64, MER = [0.35, Math.PI / 2, 2.3, 2.75], pv = MER.map((a) => T.pt(fL, a)), dv = MER.map(() => null); let D = [];
  for (let i = 1; i <= NS; i++) {
    const f = fL + ((hi - fL) * i) / NS; let s = 0;
    MER.forEach((a, m) => { const p = T.pt(f, a), v = p.clone().sub(pv[m]), l = v.length() || 1e-9; v.multiplyScalar(1 / l); s += l + (dv[m] ? 0.03 * Math.acos(Math.max(-1, Math.min(1, v.dot(dv[m])))) : 0); dv[m] = v; pv[m] = p; });
    D.push(s);
  }
  for (let it = 0; it < 6; it++) D = D.map((s, i) => 0.25 * D[Math.max(0, i - 1)] + 0.5 * s + 0.25 * D[Math.min(NS - 1, i + 1)]);
  const S = [0]; for (let i = 0; i < NS; i++) S.push(S[i] + D[i]);
  const fAt = (u) => { const c = u * S[NS]; let i = 0; while (i < NS - 1 && S[i + 1] < c) i++; return fL + ((hi - fL) * (i + clamp01((c - S[i]) / (S[i + 1] - S[i] || 1)))) / NS; };
  const rings = [Array(M).fill(T.c(fL - 0.01))];
  for (let k = 0; k <= R; k++) { const f = fAt(k / R); rings.push(A.map((a) => T.pt(f, a, out(f, a)))); }
  return loftRings(rings);
}
/**
 * The lines her swimwear is cut to, worked out before any of it is built (c: { T, J, F, OF, fem, legRad, legForm }) ->
 * briefLines' { lo, hi, X } and, for People's bodice: bodLo(a) - a one-piece's own lower edge (its leg line), a
 * monokini's (its front carried down to its bottoms, its sides open to its top's band: OF.mono { w0, w1 } - the front
 * piece's half-width at its foot and where it has risen to the top's band) - and rows (the bodice's, that long); none:
 * a man's, or a kit without bottoms of its own
 */
export function swimLines(c) {
  const { T, OF } = c, B = OF.brief || OF.suit;
  if (!B || !c.fem) return null;
  const LG = thighsOf(c.J, c.F, c.fem, c.legRad, c.legForm), L = briefLines(T, B, legCross(T, LG));
  L.brief = !!OF.brief; L.LG = LG;
  // (People's bodice asks how far further out a one-piece must lie over her thighs' tops: none - its own leg piece,
  // suitCloth, is lifted over them by overThighs)
  L.wrap = () => 0;
  // (a one-piece: its leg line and seat its own piece, as a bikini's bottoms are (suitCloth, up to suitHi) - People's bodice
  // from a little under that piece's top, lying over it)
  // (the bodice's foot always a little above the leg opening - at a high leg's apex at the hip too, where the two met edge to
  // edge and the bodice's coarser edge stood out past the leg piece's turned one)
  if (OF.suit) { L.suitHi = (a) => Math.min(Math.max(0.26, L.lo(a) + 0.02), Math.max(0.15, L.lo(a) + 0.05)); L.bodLo = (a) => Math.max(L.lo(a) + 0.006, L.suitHi(a) - 0.03); L.rows = 20; }
  else if (OF.mono) { const m = OF.mono, cr = OF.crop; L.bodLo = (a) => { const b = bOf(a); return cr - (cr - (L.hi(a) - 0.014)) * (1 - ss3(m.w0, m.w1, b)); }; L.rows = 28; }
  return L;
}

// ---- her tops -------------------------------------------------------------------------------------------------------
/**
 * Necklines for her swimwear tops (f by the angle round from the front, as People's NECK): tri - a triangle bikini's two
 * cups, each a triangle on the bust from the band beneath it up to its point where its tie goes, the band a fine strip
 * between them and on round the back; balc - a balconette's cups, their tops nearly straight across the upper bust from
 * a low gore, the band round the back; sport - a sporty scoop crop on broad straps; and the one-pieces': sscoop (a low
 * scoop between its straps, scooped behind), ssquare (straight across the upper bust), splunge (plunging to below the
 * bust - always well inside each round, the bust covered - its straps at the shoulders, low behind)
 */
const TRI = { f0: 0.52, w: 0.016, aI: 0.07, aA: 0.44, fA: 0.775, aO: 1.12 };
export const SWIM_NECKS = Object.freeze({
  tri: (a) => {
    const b = Math.abs(a), { f0, w, aI, aA, fA, aO } = TRI, base = f0 + w;
    // (each cup's inner edge rising from beside the middle to its point, its outer edge falling to the band under the arm
    // - straight, as a triangle's; its point rounded off a little where the tie comes from it)
    const up = b < aA ? base + (fA - base) * clamp01((b - aI) / (aA - aI)) : base + (fA - base) * clamp01((aO - b) / (aO - aA));
    return Math.max(base, up - 0.012 * gau((b - aA) / 0.05, 1));
  },
  balc: (a) => { const b = Math.abs(a); return b < 1.3 ? 0.6 + 0.115 * ss3(0.02, 0.32, b) - 0.02 * ss3(0.7, 1.3, b) : 0.695 - 0.12 * ss3(1.3, 2.1, b); },
  sport: (a) => { const b = Math.abs(a); return 0.69 + 0.1 * ss3(0.05, 0.7, b) - 0.09 * ss3(0.8, 1.45, b) - 0.14 * ss3(1.6, 2.3, b); },
  sscoop: (a) => { const b = Math.abs(a); return 0.735 + 0.1 * ss3(0.05, 0.75, b) - 0.09 * ss3(0.85, 1.45, b) - 0.08 * ss3(1.7, 2.5, b); },
  ssquare: (a) => { const b = Math.abs(a); return 0.77 + 0.085 * ss3(0.48, 0.7, b) - 0.1 * ss3(0.85, 1.45, b) - 0.08 * ss3(1.7, 2.5, b); },
  splunge: (a) => { const b = Math.abs(a), u = Math.min(1, b / 0.56); return 0.44 + 0.4 * (1 - (1 - u) ** 1.8) - 0.1 * ss3(0.9, 1.45, b) - 0.12 * ss3(1.7, 2.5, b); },
});
/** the necklines that lift her bust as a structured top does (People's LIFT_NECKS, with the kit's own lift) */
export const SWIM_LIFT = Object.freeze(['balc', 'splunge']);
/**
 * A monokini's cut-outs (merged into People's HOLES - each { f0, f1, c(u), w(u) }): mside - at the waist either side,
 * from the hip up under the bust's side and round toward the back; mfront - an oval at the centre front from the navel to
 * under the bust; mcross - a long narrow one up the front, laced across; mring - a wide oval at the front, a ring at its
 * middle on a strap from the top down to the bottoms
 */
export const SWIM_HOLES = Object.freeze({
  mside: () => [1, -1].map((k) => ({ f0: 0.27, f1: 0.5, c: (u) => k * (1.3 + 0.12 * u), w: (u) => 0.48 * sEll(u, 2.2) })),
  mfront: () => [{ f0: 0.26, f1: 0.54, c: () => 0, w: (u) => 0.3 * sEll(u, 1.7) * (1 - 0.25 * u) }],
  mcross: () => [{ f0: 0.27, f1: 0.6, c: () => 0, w: (u) => 0.22 * sEll(u, 1.6) * (1 - 0.3 * u) }],
  mring: () => [{ f0: 0.255, f1: 0.52, c: () => 0, w: (u) => 0.5 * sEll(u, 2.6) }],
});
/**
 * A triangle top's ties (neck: its neckline; out(f, a): the cloth's lift; fS: the neck's seam) -> [geometry] (the top's
 * cloth): from each cup's point up over the collarbone to the side of the neck, round the back of it to a knot at the
 * nape, its two tails hanging; and the band's two ends tied in a bow at the middle of her back
 */
export function triTies(T, neck, out, fS) {
  const G = [], { aA } = TRI, kh = kOf(T);
  for (const s of [-1, 1]) {
    const pts = [], nr = [], P = [];
    // (up from the cup's point, over the chest beside the neck - a little in from the shoulder - and round behind it)
    const fP = neck(s * aA) - 0.006;
    for (let i = 0; i <= 10; i++) { const u = i / 10, f = fP + (fS - 0.012 - fP) * ss3(0, 1, u) ** 0.8, a = s * (aA + (0.95 - aA) * ss3(0.2, 1, u)); P.push([f, a]); }
    for (let i = 1; i <= 8; i++) { const u = i / 8, a = s * (0.95 + (Math.PI - 0.12 - 0.95) * u); P.push([fS - 0.012 + 0.004 * Math.sin(Math.PI * u), a]); }
    for (const [f, a] of P) { const p = T.pt(f, a, out(f, a) + 0.0016); pts.push(p); nr.push(p.clone().sub(T.c(f)).normalize()); }
    G.push(strip(pts, nr, 0.007 * kh, 0.0018));
  }
  // (the knot at the nape, its tails hanging a little down the back)
  const pk = T.pt(fS - 0.012, Math.PI, 0.003), nk = pk.clone().sub(T.c(fS - 0.012)).normalize(), up = V(0, 1, 0).applyQuaternion(T.q);
  G.push(...tieBow(pk, nk, up, 0.022 * kh, 0.06 * kh));
  const fb = TRI.f0 + TRI.w / 2, pb = T.pt(fb, Math.PI, out(fb, Math.PI) + 0.001), nb = pb.clone().sub(T.c(fb)).normalize();
  G.push(...tieBow(pb, nb, up, 0.026 * kh, 0.07 * kh));
  return G.map((g) => tintG(g, 0.94));
}
/**
 * A swimsuit's small tie bow (a bikini's at the hips, its top's at the nape and behind): Trims' bow drawn lighter - a
 * bow two centimetres across needs few facets - two loops and a knot, two tails narrowing (p, n, up, s, tail as Trims'
 * bow) -> [geometry]
 */
function tieBow(p, n, up, s, tail) {
  const N = n.clone().normalize(), U = up.clone().addScaledVector(N, -up.dot(N)).normalize(), S = V().crossVectors(U, N), out = [], w = 0.38 * s, t = 0.0018;
  for (const sd of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI * 2, x = sd * (0.5 - 0.5 * Math.cos(a)) * s, y = 0.32 * s * Math.sin(a) + 0.08 * x; pts.push(p.clone().addScaledVector(S, x).addScaledVector(U, y).addScaledVector(N, 0.003 + 0.005 * Math.sin(Math.PI * Math.abs(x) / s))); nr.push(N.clone().addScaledVector(U, -0.3 * Math.sin(a)).normalize()); }
    out.push(strip(pts, nr, w, t, (u) => 0.75 + 0.25 * Math.sin(Math.PI * u)));
  }
  const kn = new THREE.SphereGeometry(0.2 * s, 6, 4); kn.scale(0.8, 1.15, 0.6); kn.applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(S, U, N))); kn.translate(...p.clone().addScaledVector(N, 0.005).toArray()); out.push(kn);
  for (const sd of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 5; i++) { const u = i / 5; pts.push(p.clone().addScaledVector(S, sd * (0.05 * s + 0.25 * tail * u)).addScaledVector(U, -tail * u).addScaledVector(N, 0.004 - 0.002 * u)); nr.push(N.clone()); }
    out.push(strip(pts, nr, 0.3 * s, t, (u) => 1 - 0.3 * u));
  }
  return out;
}
/** a bikini's sides (B: OF.brief - tie: tied in a bow at each hip, its tails hanging; ring: a metal ring there) -> { cloth, metal } */
function hipPieces(T, L, B, out, Q) {
  const cloth = [], metal = [], kh = kOf(T), up = V(0, 1, 0).applyQuaternion(T.q);
  for (const s of [-1, 1]) {
    const a = s * Math.PI / 2, f = L.hi(a) - 0.5 * (B.sideW ?? 0.02), p = T.pt(f, a, out(f, a) + 0.0016), nn = outN(T, p, f);
    if (B.tie) cloth.push(...tieBow(p, nn, up, 0.02 * kh, 0.07 * kh).map((g) => tintG(g, 0.94)));
    if (B.ring && Q >= 0.6) metal.push(oRing(T.pt(f, a, out(f, a) + 0.0028), nn, 0.011 * kh, 0.0022));
  }
  return { cloth, metal };
}
/**
 * A ring monokini's own (H: its cut-out, HOLES'): a metal O-ring at the middle of the cut-out, a broad strap of the cloth
 * from its top edge down to the ring, looped round it, and from the ring on down to its foot -> { cloth, metal }
 */
function vRing(T, H, tight) {
  const h = H[0], kh = kOf(T), fm = (h.f0 + h.f1) / 2, r = 0.017 * kh, rf = r / T.H, cloth = [], metal = [];
  const p = T.pt(fm, 0, tight + 0.003), nn = outN(T, p, fm);
  metal.push(oRing(p, nn, r, 0.0028));
  for (const [fa, fb] of [[h.f1 + 0.014, fm + 0.75 * rf], [fm - 0.75 * rf, h.f0 - 0.014]]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 6; i++) { const f = fa + (fb - fa) * i / 6, q = T.pt(f, 0, tight + 0.0012); pts.push(q); nr.push(outN(T, q, f)); }
    cloth.push(strip(pts, nr, 0.028 * kh, 0.0018));
  }
  return { cloth, metal };
}
/** a belted one-piece's buckle: a square frame of metal at the front of its belt (f: the belt's middle; out: its face) -> [geometry] */
function buckle(T, f, out) {
  const kh = kOf(T), p = T.pt(f, 0, out), nn = outN(T, p, f), up = V(0, 1, 0).applyQuaternion(T.q), S = V().crossVectors(up, nn).normalize(), G = [];
  const w = 0.024 * kh, h = 0.02 * kh, t = 0.0032, M = new THREE.Matrix4().makeBasis(S, up.clone().addScaledVector(nn, -up.dot(nn)).normalize(), nn);
  const bar = (cx, cy, lx, ly) => { const g = new THREE.BoxGeometry(lx, ly, t); g.applyMatrix4(M); const c = p.clone().addScaledVector(S, cx).addScaledVector(up, cy); g.translate(c.x, c.y, c.z); return g; };
  G.push(bar(0, h, 2 * w + 2 * t, 1.6 * t), bar(0, -h, 2 * w + 2 * t, 1.6 * t), bar(-w, 0, 1.6 * t, 2 * h), bar(w, 0, 1.6 * t, 2 * h), bar(-0.25 * w, 0, 0.8 * t, 2 * h));
  return G;
}
/** a sarong's knot at the hip (f, a: where; out: the cloth's lift): the two ends twisted round one another, their tails hanging -> [geometry] */
function hipKnot(T, f, a, out) {
  const kh = kOf(T), p = T.pt(f, a, out), nn = outN(T, p, f), up = V(0, 1, 0).applyQuaternion(T.q), S = V().crossVectors(up, nn).normalize(), G = [...twistOf(p, nn, up, 0.045 * kh, 0.03 * kh)];
  for (const s of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(p.clone().addScaledVector(S, s * (0.008 + 0.028 * u) * kh).addScaledVector(up, -(0.04 + 0.12 * u) * kh).addScaledVector(nn, 0.006 - 0.003 * u)); nr.push(nn.clone()); }
    G.push(strip(pts, nr, 0.034 * kh, 0.0015, (u) => 1 - 0.35 * u));
  }
  return G;
}
/** his swim shorts' waistband, an elastic one, a hair proud, and its drawstring tied at the front, the ends hanging (top: its top, f) -> [geometry] */
function drawstring(T, top, out, ctx) {
  const n = ctx.n || ((k) => k), kh = kOf(T), G = [], up = V(0, 1, 0).applyQuaternion(T.q);
  G.push(tintG(ctx.band(T, top - 0.03, top + 0.002, out + 0.0018, { m: n(44, 12), rows: 2, hem: 'both', th: 0.002 }), 0.88));
  if ((ctx.Q ?? 1) < 0.6) return G;
  for (const s of [-1, 1]) {
    const f0 = top - 0.012, p0 = T.pt(f0, s * 0.045, out + 0.0035), nn = outN(T, p0, f0), S = V().crossVectors(up, nn).normalize(), pts = [], nr = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(p0.clone().addScaledVector(up, -0.085 * u * kh).addScaledVector(S, -s * 0.014 * u * kh).addScaledVector(nn, 0.004 * Math.sin(Math.PI * Math.min(1, u * 1.6)))); nr.push(nn.clone()); }
    G.push(tintG(strip(pts, nr, 0.0045, 0.003), 0.95));
    const k = new THREE.SphereGeometry(0.004, 6, 4); k.scale(1, 1.6, 1); const e = pts[pts.length - 1]; k.translate(e.x, e.y, e.z); G.push(tintG(k, 0.8));
  }
  return G;
}

/** the nearest point to p on triangle abc (flat arrays' offsets into P: ia, ib, ic) -> [x, y, z] */
function nearOnTri(px, py, pz, P, ia, ib, ic) {
  const ax = P[ia], ay = P[ia + 1], az = P[ia + 2], abx = P[ib] - ax, aby = P[ib + 1] - ay, abz = P[ib + 2] - az, acx = P[ic] - ax, acy = P[ic + 1] - ay, acz = P[ic + 2] - az;
  const apx = px - ax, apy = py - ay, apz = pz - az, d1 = abx * apx + aby * apy + abz * apz, d2 = acx * apx + acy * apy + acz * apz;
  if (d1 <= 0 && d2 <= 0) return [ax, ay, az];
  const bpx = px - P[ib], bpy = py - P[ib + 1], bpz = pz - P[ib + 2], d3 = abx * bpx + aby * bpy + abz * bpz, d4 = acx * bpx + acy * bpy + acz * bpz;
  if (d3 >= 0 && d4 <= d3) return [P[ib], P[ib + 1], P[ib + 2]];
  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); return [ax + v * abx, ay + v * aby, az + v * abz]; }
  const cpx = px - P[ic], cpy = py - P[ic + 1], cpz = pz - P[ic + 2], d5 = abx * cpx + aby * cpy + abz * cpz, d6 = acx * cpx + acy * cpy + acz * cpz;
  if (d6 >= 0 && d5 <= d6) return [P[ic], P[ic + 1], P[ic + 2]];
  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); return [ax + w * acx, ay + w * acy, az + w * acz]; }
  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) { const w = (d4 - d3) / (d4 - d3 + (d5 - d6)); return [P[ib] + w * (P[ic] - P[ib]), P[ib + 1] + w * (P[ic + 1] - P[ib + 1]), P[ib + 2] + w * (P[ic + 2] - P[ib + 2])]; }
  const dn = 1 / (va + vb + vc), v = vb * dn, w = vc * dn; return [ax + abx * v + acx * w, ay + aby * v + acy * w, az + abz * v + acz * w];
}
/**
 * Her swimwear's cloth by her thighs' tops lifted out over them as they were built - their facets, their fillet into her
 * hips, their tops kept under it - wherever a thigh's surface would come through it: the leg opening's edge then lying on
 * the thigh, as an elastic edge does, never cut into by it. Only within a centimetre and a half of their surface: deeper
 * (between her thighs at the crotch) the cloth is hidden by them, as it is on her (legs: People's leg geometries; cloth:
 * lists of the cloth's; keep: pieces left as they are - the gusset under her) -> nothing (the points moved, the light
 * worked out again). Once, at build time
 */
function overThighs(T, hM, legs, cloth, keep) {
  const yTop = T.c(hM + 0.03).y + 0.03, yBot = T.c(T.fLo).y - 0.08, cs = 0.03, deep = 0.015, gap = 0.0016;
  // (the cloth's points down there, and the box they lie in)
  const CG = []; let x0 = 9, y0 = 9, z0 = 9, x1 = -9, y1 = -9, z1 = -9;
  for (const list of cloth) for (const g of list) {
    if (!g || keep.has(g) || !g.attributes?.position) continue;
    const P = g.attributes.position.array, ix = []; for (let i = 0; i < P.length; i += 3) { const y = P[i + 1]; if (y > yTop || y < yBot) continue; ix.push(i); x0 = Math.min(x0, P[i]); x1 = Math.max(x1, P[i]); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, P[i + 2]); z1 = Math.max(z1, P[i + 2]); }
    if (ix.length) CG.push([g, ix]);
  }
  if (!CG.length) return;
  x0 -= cs; y0 -= cs; z0 -= cs; x1 += cs; y1 += cs; z1 += cs;
  // (the thighs' faces in that box, each with its way out, in cells cs across - none of those wholly under her own skin,
  // where People laid a thigh's top inside her hips: unseen, and crumpled there)
  const grid = new Map(), TR = [], key = (i, j, k) => (i * 1024 + j) * 1024 + k, q = V();
  for (const g of legs) {
    const P = g.attributes?.position?.array; if (!P) continue; const I = g.index ? g.index.array : null, nt = (I ? I.length : P.length / 3) / 3, S = new Map();
    const sOf = (ia) => { let s = S.get(ia); if (s === undefined) { s = T.near(q.set(P[ia], P[ia + 1], P[ia + 2])).s; S.set(ia, s); } return s; };
    for (let t = 0; t < nt; t++) {
      const ia = (I ? I[3 * t] : 3 * t) * 3, ib = (I ? I[3 * t + 1] : 3 * t + 1) * 3, ic = (I ? I[3 * t + 2] : 3 * t + 2) * 3, cx = (P[ia] + P[ib] + P[ic]) / 3, cy = (P[ia + 1] + P[ib + 1] + P[ic + 1]) / 3, cz = (P[ia + 2] + P[ib + 2] + P[ic + 2]) / 3;
      if (cx < x0 || cx > x1 || cy < y0 || cy > y1 || cz < z0 || cz > z1) continue;
      if (Math.max(sOf(ia), sOf(ib), sOf(ic)) < -0.0012) continue;
      const ux = P[ib] - P[ia], uy = P[ib + 1] - P[ia + 1], uz = P[ib + 2] - P[ia + 2], vx = P[ic] - P[ia], vy = P[ic + 1] - P[ia + 1], vz = P[ic + 2] - P[ia + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz); if (l < 1e-12) continue; nx /= l; ny /= l; nz /= l;
      const id = TR.length; TR.push([P, ia, ib, ic, nx, ny, nz]);
      const k = key(Math.floor((cx - x0) / cs), Math.floor((cy - y0) / cs), Math.floor((cz - z0) / cs)); if (!grid.has(k)) grid.set(k, []); grid.get(k).push(id);
    }
  }
  if (!TR.length) return;
  for (const [g, ix] of CG) {
    const P = g.attributes.position.array, NN = g.attributes.normal?.array; let moved = false;
    if (!NN) continue;
    for (const i of ix) {
      // (straight out of her torso there - not the cloth's own way out, which turns along her at its edges, where it is
      // turned under - the first of a thigh's faces met on the way: if it is one the ray leaves the thigh by, the cloth was
      // inside the thigh and is lifted out past it; if one it goes into, a thigh lies over the cloth there (between her
      // thighs) and hides it, as it should. Only where a thigh's faces are near at all)
      const px = P[i], py = P[i + 1], pz = P[i + 2], gi = Math.floor((px - x0) / cs), gj = Math.floor((py - y0) / cs), gk = Math.floor((pz - z0) / cs), CL = [];
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) { const Lc = grid.get(key(gi + a, gj + b, gk + c)); if (Lc) CL.push(Lc); }
      if (!CL.length) continue;
      // (none right down between her thighs, by her torso's foot - hidden there, and lifted every which way between them)
      const m0 = T.near(q.set(px, py, pz)); if (m0.f < T.fLo + 0.03) continue;
      const n0 = m0.n, dx = n0.x, dy = n0.y, dz = n0.z;
      let tIn = 1e9, tOut = -1;
      for (const Lc of CL) {
        for (const id of Lc) {
          const [Q, ia, ib, ic, nx, ny, nz] = TR[id], e1x = Q[ib] - Q[ia], e1y = Q[ib + 1] - Q[ia + 1], e1z = Q[ib + 2] - Q[ia + 2], e2x = Q[ic] - Q[ia], e2y = Q[ic + 1] - Q[ia + 1], e2z = Q[ic + 2] - Q[ia + 2];
          const pvx = dy * e2z - dz * e2y, pvy = dz * e2x - dx * e2z, pvz = dx * e2y - dy * e2x, det = e1x * pvx + e1y * pvy + e1z * pvz; if (Math.abs(det) < 1e-14) continue;
          const iv = 1 / det, tx = px - Q[ia], ty = py - Q[ia + 1], tz = pz - Q[ia + 2], u = (tx * pvx + ty * pvy + tz * pvz) * iv; if (u < 0 || u > 1) continue;
          const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x, v = (dx * qx + dy * qy + dz * qz) * iv; if (v < 0 || u + v > 1) continue;
          const t = (e2x * qx + e2y * qy + e2z * qz) * iv; if (t < -0.0004 || t > deep + 0.01) continue;
          if (nx * dx + ny * dy + nz * dz > 0) tOut = Math.max(tOut, t); else tIn = Math.min(tIn, t);
        }
      }
      if (tOut < 0 || tIn < tOut || tOut > deep) continue;
      const e = (tOut + gap) * ss3(deep, 0.6 * deep, tOut); if (e < 1e-5) continue;
      P[i] += dx * e; P[i + 1] += dy * e; P[i + 2] += dz * e; moved = true;
    }
    // (its light worked out again down there only - what People set on it higher up, by her arms, left as it was)
    if (moved && g.index && g.attributes.normal) {
      const tmp = new THREE.BufferGeometry(); tmp.setAttribute('position', g.attributes.position); tmp.setIndex(g.index); tmp.computeVertexNormals();
      const N = g.attributes.normal.array, N2 = tmp.attributes.normal.array; for (const i of ix) { N[i] = N2[i]; N[i + 1] = N2[i + 1]; N[i + 2] = N2[i + 2]; }
      g.attributes.normal.needsUpdate = true;
    }
  }
}

// ---- all of it, for People's buildPerson ------------------------------------------------------------------------------
/**
 * Her swimwear's own pieces, or his (c: { T, J, F, OF (the kit), fem, Q, n, band (People's), legRad, legForm, neck (the
 * top's neckline as built), tight, fS (the neck's seam), oSide, L (swimLines') }) -> { cloth (the swimwear's - the top's
 * material), skin, metal, top (a sarong's own: its material), legs (his shorts' cloth), sheer, side (the skin her legs
 * grow out of: People's legB.side), bare(f, a) (how bare her hips are there - her thighs filleted only into bare skin,
 * never on to the cloth), tuck(g) (a thigh's top kept under the cloth) }
 */
export function swimBody(c) {
  const { T, OF } = c, Q = c.Q ?? 1, R = { cloth: [], skin: [], metal: [], bottom: [], sheer: [], top: [], legs: [], side: null, bare: null, tuck: null };
  const L = c.L, B = OF.brief || OF.suit;
  // (her thighs drawn forward, sitting: their tops eased down into the groin's fold - People's bare legs, as thighsOf has them)
  if (c.fem) R.ka = (s, base) => { const tp = rootTaper(c.J, s); return tp ? (t, a) => (base ? base(t, a) : 1) * tp(t, a) : base; };
  if (L && B) {
    R.lines = L;
    // (the skin of her hips and seat: up under a bikini's top, where her midriff takes over (People's, from OF.rise); under a
    // one-piece up a little past its leg line)
    let top = OF.rise ? OF.rise - 0.014 : -1; if (!OF.rise) for (let a = 0; a <= Math.PI; a += 0.1) top = Math.max(top, L.lo(a) + 0.03);
    // (under a cover-up, a little lighter: what goes over it takes its own share of her triangles - c2's counts)
    const n0 = c.n || ((k) => k), c2 = OF.cover ? { ...c, n: (k, lo) => n0(Math.round(k * 0.78), lo) } : c;
    R.skin.push(R.side = pelvisSkin(T, top, c2, L));
    const out = briefOut(T, L, c.tight, OF.mono ? OF.mono.w1 : 0), keep = new Set();
    if (OF.brief) {
      const BC = briefCloth(T, L, c.tight, c2, OF.mono ? OF.mono.w1 : 0); keep.add(BC[1]); R.cloth.push(...BC);
      if (Q >= 0.6 && (B.tie || B.ring)) { const HP = hipPieces(T, L, B, out, Q); R.cloth.push(...HP.cloth); R.metal.push(...HP.metal); }
    } else { if (L.suitHi) R.cloth.push(suitCloth(T, L, c.tight, c2)); const G = gusset(T, out, c2, L); keep.add(G); R.cloth.push(G); }
    // (bare a little below the cloth's edge - the fillet's own rise kept off it: its crease a centimetre or so under the
    // leg opening, as an elastic edge sits on her; the fillet fading in over a few centimetres below it, its rise never a
    // ridge under the cloth's edge. None low between her thighs - their inner sides, either side of her torso's foot - but
    // on round under her seat to the fold where each thigh leaves it, bare under a narrow back)
    R.bare = (f, a) => ss3(L.lo(a) - 0.006, L.lo(a) - 0.05, f) ** 1.5 * (1 - (1 - ss3(T.fLo + 0.03, T.fLo + 0.1, f)) * gau((bOf(a) - Math.PI / 2) / 0.75, 1));
    // (her thighs' tops kept under the cloth wherever it covers her - a few millimetres under her own surface there, never
    // through it: People's legs, after their fillet)
    const hM = Math.max(...[0, 0.8, 1.6, 2.4, Math.PI].map((a) => (OF.brief ? L.hi(a) : L.lo(a) + 0.08)));
    R.tuck = (g) => {
      // (only what is hidden under it moves: its light - the fillet's - left as it was)
      const P = g.attributes.position, q = V(), yT = T.c(hM + 0.02).y;
      for (let i = 0; i < P.count; i++) {
        q.fromBufferAttribute(P, i); if (q.y > yT + 0.05) continue; const m = T.near(q);
        if (m.f < T.fLo + 0.04 || m.f > hM || m.s > 0.03) continue;
        // (only under it - never her inner thighs below the gusset, between them)
        const lo = L.lo(m.an); if (m.f < lo - 0.006 || (m.f < T.fLo + 0.06 && L.X(m.an) < T.fLo + 0.03)) continue;
        // (deeper a little way in from the leg opening: a thigh's facets from there to its next ring out below the edge -
        // steep where the thigh comes out of her - crossing the cloth's height below the edge, never through the cloth: the
        // edge one clean line on her, as an elastic edge is)
        const tg = -0.003 - 0.012 * ss3(lo - 0.002, lo + 0.018, m.f); if (m.s < tg) continue;
        const k = ss3(lo - 0.006, lo + 0.002, m.f); q.addScaledVector(m.n, (tg - m.s) * k); P.setXYZ(i, q.x, q.y, q.z);
      }
    };
    // (and once both legs are built, the cloth by her thighs' tops lifted out over them as they are - People's: over(legs, cloth))
    if (c.fem && Q >= 0.6) R.over = (legs, cloth) => overThighs(T, hM, legs, cloth, keep);
  }
  if (OF.top === 'tri' && Q >= 0.6) R.cloth.push(...triTies(T, c.neck, () => c.tight, c.fS));
  // (a ring monokini's ring on its strap down the middle of its cut-out)
  if (OF.vring && OF.holes && SWIM_HOLES[OF.holes] && Q >= 0.6) { const VR = vRing(T, SWIM_HOLES[OF.holes](), c.tight); R.cloth.push(...VR.cloth); R.metal.push(...VR.metal); }
  // (a belted one's buckle, on People's belt)
  if (OF.buckle && OF.belt === 1 && Q >= 0.6) R.metal.push(...buckle(T, 0.3025, c.tight + 0.0105));
  // (a sarong tied at the hip - on the side its hem is shortest, its slit there)
  if (OF.cover === 'sheer' && OF.skirt && Q >= 0.6) R.top.push(...hipKnot(T, (OF.skirt.rise ?? 0.14) - 0.004, -(c.oSide || 1) * 1.3, 0.0115));
  // (his: the shorts' waistband and drawstring)
  if (OF.swim === 'm' && OF.trousers) R.legs.push(...drawstring(T, OF.rise ?? 0.17, 0.006, c));
  return R;
}
/**
 * His bare torso's own quiet form (lo: his shorts' top, f; lum: his skin's luminance): the navel a small dimple, a soft
 * hood over it, the faint line up from it, the lower belly's round, the obliques easing in toward the hips, the hip bones'
 * slight rise above low shorts - a share of the torso's length, never sculpted -> { out(f, a) (m), col(f, a) ([r, g, b]
 * on the skin's colour) }
 */
export function bellyOf(T, lo, lum = 0.35) {
  const hk = kOf(T), fN = 0.235, aW = 0.8, fHB = Math.max(0.15, lo + 0.045), hbOn = lo < 0.2 ? 1 : 0, sMin = 0.45 + 0.12 * ss3(0.3, 0.08, lum);
  const out = (f, a) => {
    const b = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))), fade = ss3(lo + 0.004, lo + 0.024, f) * ss3(0.56, 0.44, f);
    const nv = -0.0042 * hk * gau(a / 0.07, 1) * gau((f - fN + 0.003) / 0.012, 1) + 0.0011 * hk * gau(a / 0.11, 1) * gau((f - fN - 0.017) / 0.012, 1);
    const la = -0.0007 * hk * gau(a / 0.05, 1) * ss3(fN + 0.02, fN + 0.06, f) * ss3(0.48, 0.38, f), lb = 0.0016 * hk * gau(a / 0.55, 1) * gau((f - 0.17) / 0.06, 1);
    const ob = -0.0012 * hk * gau((b - 1.05) / 0.22, 1) * gau((f - 0.3) / 0.08, 1), hb = hbOn * 0.0016 * hk * gau((b - aW) / 0.16, 1) * gau((f - fHB) / 0.03, 1);
    return fade * (nv + la + lb + ob + hb);
  };
  const col = (f, a) => {
    const d = gau(a / 0.05, 1) * gau((f - fN + 0.004) / 0.008, 1), l = 0.05 * gau(a / 0.035, 1) * ss3(fN + 0.02, fN + 0.06, f) * ss3(0.46, 0.38, f);
    const s0 = 1 - 0.5 * d - l, s = s0 + sMin * (1 - s0) ** 2.4; return [s ** 0.8, s, s ** 1.18];
  };
  return { out, col };
}

// ---- what goes on her feet, her head, round her waist and her ankle ---------------------------------------------------
const FOOT_W = [[0, 0.088], [0.12, 0.12], [0.35, 0.138], [0.62, 0.156], [0.8, 0.142], [0.9, 0.115], [0.96, 0.08], [1, 0.03]];
const FOOT_H = [[0, 0.22], [0.12, 0.27], [0.3, 0.3], [0.42, 0.26], [0.6, 0.19], [0.8, 0.13], [0.93, 0.1], [1, 0.06]];
/**
 * A slide (H: People's helpers - loft, spline, n): her foot - or his - bare and flat on a moulded footbed (its sole a
 * centimetre and more), one broad strap over the instep; every measure a share of the foot's length (fl) -> { foot
 * (skin), shoe: [geometry] (the footbed's sole a shade darker than its strap)}; bare: her foot as it is, in the water or
 * on its edge - no footbed, no strap, its sole on the ground and its heel and instep as deep as ever up to the ankle
 */
export function slideAt(ankle, foot, fl, H, bare = false) {
  const len = fl * 1.02, x0 = -0.25 * len, sole0 = 0.012 + 0.012 * fl, sole = bare ? 0.003 : sole0, M = H.n(14, 6), K = H.n(12, 5), sp = (R, u) => H.spline(R, u)[0];
  const sec = (u, wd, bot, top, o = 0) => { const x = x0 + u * len, h = top - bot; return Array.from({ length: M }, (_, j) => { const a = (j / M) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); return s >= 0 ? V(x, bot + h * s ** 0.7 + o * s, Math.sign(c) * (Math.abs(c) ** 0.8 * wd + o)) : V(x, bot + 0.002 * s, Math.sign(c) * (Math.abs(c) ** 0.25 * wd + o * Math.abs(c))); }); };
  const fw = (u) => sp(FOOT_W, u) * fl, fh = (u) => sp(FOOT_H, u) * fl + (bare ? (sole0 - sole) * (1 - ss3(0.3, 0.7, u)) : 0);
  // (the foot: rounded at the heel, widest at the ball, its toes drawn in to a round - its top the instep's slope)
  const R = [Array(M).fill(V(x0 - 0.01 * fl, sole + 0.45 * fh(0), 0))];
  for (let i = 0; i <= K; i++) { const u = i / K; R.push(sec(u, fw(u), sole, sole + fh(u))); }
  R.push(Array(M).fill(V(x0 + len + 0.01 * fl, sole + 0.35 * fh(1), 0)));
  // (the footbed: a little wider and longer than the foot, its edge rounded)
  const S = [], ms = H.n(10, 6), ring = (u, wd, h) => { const x = x0 + u * len; return Array.from({ length: ms }, (_, j) => { const a = (j / ms) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); return V(x, h / 2 + (h / 2) * Math.sign(s) * Math.abs(s) ** 0.35, Math.sign(c) * Math.abs(c) ** 0.35 * wd); }); };
  S.push(Array(ms).fill(V(x0 - 0.035 * fl, sole / 2, 0)));
  for (let i = 0; i <= K; i++) { const u = i / K; S.push(ring(u, fw(u) + 0.006 + 0.008 * fl, sole)); }
  S.push(Array(ms).fill(V(x0 + len + 0.03 * fl, sole / 2, 0)));
  // (the strap: over the instep from side to side, closed down on to the foot at its edges)
  const T2 = [], u0 = 0.36, u1 = 0.6;
  T2.push(sec(u0, fw(u0), sole - 0.004, sole + fh(u0), 0.0005));
  for (let i = 0; i <= 4; i++) { const u = u0 + (u1 - u0) * i / 4; T2.push(sec(u, fw(u), sole - 0.004, sole + fh(u), 0.004)); }
  T2.push(sec(u1, fw(u1), sole - 0.004, sole + fh(u1), 0.0005));
  const place = (g) => { if (foot === 'toes') { const th = -0.5 * Math.PI; g.translate(-0.012, -0.33 * fl, 0); g.rotateZ(th); g.translate(ankle.x, Math.max(0.12, ankle.y), ankle.z); } else g.translate(ankle.x, 0, ankle.z); return g; };
  if (bare) return { foot: place(H.loft(R)), shoe: [] };
  const sg = H.loft(S); tintG(sg, 0.72);
  return { foot: place(H.loft(R)), shoe: [place(sg), place(H.loft(T2))] };
}
/**
 * A platform sandal on a block heel (H: People's helpers - limbAlong, spline, courtShoe, n): her foot bare on it, arched
 * less than on a stiletto (the forefoot raised on the platform), a broad strap across the toes, one over the instep, a
 * fine one round the ankle -> { foot (skin), shoe: [geometry] }
 */
export function platformAt(ankle, H) {
  const pf = 0.024, { foot } = H.courtShoe(ankle, 1), P = foot.attributes.position;
  for (let i = 0; i < P.count; i++) P.setY(i, P.getY(i) + pf * ss3(ankle.x - 0.02, ankle.x + 0.09, P.getX(i)));
  foot.computeVertexNormals();
  const sp = (R, t) => H.spline(R, t)[0], side = V(0, 0, 1), G = [];
  // (the footbed under the arch, and the platform under the forefoot - a sole a couple of centimetres deep, rounded)
  G.push(H.limbAlong([V(ankle.x - 0.034, 0.086, ankle.z), V(ankle.x + 0.1, pf + 0.0035, ankle.z), V(ankle.x + 0.182, pf + 0.0035, ankle.z)], (t) => sp([[0, 0.026], [0.3, 0.027], [0.62, 0.03], [0.85, 0.027], [1, 0.016]], t), { k: 8, m: 8, sq: 0.12, side, dome: 'ab' }));
  const plat = H.limbAlong([V(ankle.x + 0.02, pf / 2, ankle.z), V(ankle.x + 0.11, pf / 2, ankle.z), V(ankle.x + 0.188, pf / 2, ankle.z)], (t) => sp([[0, 0.028], [0.4, 0.031], [0.75, 0.029], [1, 0.016]], t), { k: 6, m: 10, sq: 0.45, side, dome: 'ab' });
  G.push(tintG(plat, 0.85));
  // (the block heel: broad and square-ish, under the heel's cup)
  const hb = new THREE.CylinderGeometry(0.019, 0.022, 0.08, 8, 1); hb.rotateY(Math.PI / 8); hb.scale(1.1, 1, 1.2); hb.translate(ankle.x - 0.036, 0.04, ankle.z); G.push(tintG(hb, 0.85));
  // (the straps, on the foot as it is raised)
  const FP = [V(ankle.x - 0.01, 0.11, ankle.z), V(ankle.x + 0.105, 0.014 + pf, ankle.z), V(ankle.x + 0.17, 0.012 + pf, ankle.z)], fr = (t) => sp([[0, 0.03], [0.25, 0.028], [0.6, 0.024], [0.85, 0.02], [1, 0.012]], t);
  const strap = (t0, t1) => H.limbAlong(FP, (t) => fr(t) + 0.0024, { t0, t1, k: 2, m: 12, sq: 0.66, side });
  const ank = new THREE.TorusGeometry(0.034, 0.003, H.n(4, 3), H.n(14, 8)); ank.rotateX(Math.PI / 2); ank.scale(1.05, 1, 0.95); ank.translate(ankle.x - 0.006, 0.128, ankle.z);
  G.push(strap(0.72, 0.84), strap(0.44, 0.52), ank);
  return { foot, shoe: G };
}
/**
 * A straw sun hat, wide-brimmed (hc: the head's centre in the head's own frame, the face toward +x; hair: the hair's
 * points there, a flat array): its crown wide enough for the hair under it - none (null) when her hair is up too high or
 * too full for a hat - a dark band round its foot, its brim ten centimetres and more, softly dipping and waved at its
 * edge -> geometry (its colours: the band's shade), or null
 */
export function sunHat(hc, hair, H) {
  const tilt = 0.1, yB = hc.y + 0.048, cx = hc.x - 0.008, cz = hc.z, base = (x) => yB - (x - cx) * Math.tan(tilt);
  // (the crown: round the head and whatever hair stands out above the brim's line - an oval, a head being longer than wide)
  let rx = 0.104, rz = 0.088, tooHigh = false;
  for (let i = 0; i < hair.length; i += 3) {
    const x = hair[i] - cx, y = hair[i + 1], z = hair[i + 2] - cz, h = y - base(hair[i]);
    if (h > 0 && h < 0.08) { rx = Math.max(rx, Math.abs(x) + 0.008); rz = Math.max(rz, Math.abs(z) + 0.008); }
    if (h > 0.105) tooHigh = true;
  }
  if (tooHigh || rx > 0.15 || rz > 0.14) return null;
  const M = H.n(30, 12), R = [], C = [], W = 0.105 + 0.02 * ss3(0.1, 0.14, rx), ring = (k, dy, out, col, wave = 0) => {
    R.push(Array.from({ length: M }, (_, j) => { const a = (j / M) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), x = cx + c * (rx * k + out), z = cz + s * (rz * k + out), dr = out > 0.01 ? -0.028 * (out / W) ** 1.7 + wave * Math.sin(5 * a + 0.6) * (out / W) ** 2 : 0; return V(x, base(x) + dy + dr, z); }));
    C.push(col);
  };
  // (from the crown's top down its side to the band, out along the brim's top, round its edge and back in under it)
  R.push(Array(M).fill(V(cx, base(cx) + 0.098, cz))); C.push(1);
  ring(0.55, 0.096, 0, 1); ring(0.82, 0.09, 0, 1); ring(0.95, 0.075, 0, 1); ring(1, 0.05, 0, 1); ring(1.01, 0.024, 0, 0.32); ring(1.012, 0.004, 0, 0.32);
  for (const [o2, w] of [[0.004, 0], [0.03, 0.004], [0.065, 0.007], [W, 0.009]]) ring(1.012, 0.002, o2, 1, w);
  ring(1.012, -0.002, W + 0.002, 0.9, 0.009); ring(1.012, -0.004, W - 0.004, 0.75, 0.009);
  for (const [o2, w] of [[0.06, 0.007], [0.025, 0.004], [0.002, 0]]) ring(1.012, -0.004, o2, 0.7, w);
  ring(0.97, 0.012, 0, 0.55);
  const g = H.loft(R), P = g.attributes.position, CA = new Float32Array(P.count * 3);
  for (let i = 0; i < P.count; i++) { const k = C[Math.floor(i / M)]; CA[i * 3] = k; CA[i * 3 + 1] = k; CA[i * 3 + 2] = k; }
  g.setAttribute('color', new THREE.BufferAttribute(CA, 3)); return g;
}
/**
 * A belly chain: two fine strands low round her hips, on the skin - over the cloth where her swimwear covers her there -
 * dipping at the front, a drop at the lower one's dip (L: swimLines'; cov(f, a): covered there) -> [geometry] (metal)
 */
export function bodyChain(T, cov, tight) {
  const G = [];
  for (const [f0, dip, r] of [[0.205, 0.03, 0.0011], [0.16, 0.05, 0.0012]]) {
    let pts = [];
    for (let j = 0; j < 48; j++) { const a = (j / 48) * 2 * Math.PI - Math.PI, b = bOf(a), f = f0 - dip * gau(b, 0.95) + 0.012 * ss3(1.2, 2.6, b); pts.push(T.pt(f, a, (cov(f, a) ? tight : 0) + 0.003)); }
    for (let it = 0; it < 3; it++) { const q = pts.map((p) => p.clone()); pts = q.map((p, j) => q[(j + 47) % 48].clone().add(q[(j + 1) % 48]).multiplyScalar(0.25).addScaledVector(p, 0.5)); }
    G.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 48, r, 3, true));
  }
  const fp = 0.16 - 0.05 - 0.012, pp = T.pt(fp, 0, (cov(fp, 0) ? tight : 0) + 0.0045), d = new THREE.SphereGeometry(0.0042, 6, 4); d.scale(1, 1.8, 0.7); d.translate(pp.x, pp.y, pp.z); G.push(d);
  return G;
}
/** an anklet: a fine chain round the leg just above the ankle (lp: the leg's hip, knee, ankle; r: the leg's radius there) -> geometry (metal) */
export function anklet(lp, r) {
  const d = lp[1].clone().sub(lp[2]).normalize(), p = lp[2].clone().addScaledVector(d, 0.04), g = new THREE.TorusGeometry(r + 0.0025, 0.0011, 4, 24);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d)); g.translate(p.x, p.y, p.z); return g;
}

// ---- the kits ---------------------------------------------------------------------------------------------------------
/**
 * The swimwear kits (merged into People's OUTFITS): swim (1 hers, 'm' his), neck (SWIM_NECKS, or People's), crop (a
 * bikini top's band, f), rise (its bottoms' top, f: her midriff between), fit (how close), brief (her bottoms:
 * briefLines'), suit (a one-piece's leg line: briefLines'), mono (a monokini's front carried down to its bottoms, its
 * sides open), top ('tri': its ties), band (a bandeau, ruched), knot, bra (the balconette's band, gore and seams), lift,
 * straps (strapW: their width), holes (People's HOLES: a cut-out, its edge bound; cross: laced; vring: a ring on a strap
 * down the middle), back (open to f behind), belt + buckle, cover (what goes over it: 'sheer' - a sarong, its skirt
 * (People's skirt: a hem on the diagonal, slit, wrapped, low on the hips) in a sheer chiffon; 'net' - a dress of crochet,
 * mesh or chiffon over it (People's sheer: net 3 crochet, 1 mesh, 0 chiffon; lo its foot; ease; wide sleeves); 'shirt' -
 * an open shirt (jacket) - the swimwear under it in the accent colour, its own cloth accFin), fin (the cloth's finish),
 * the shoes. His: bareTop (his torso bare), trousers 'swim' (CUTS.swim) to shorts (their hem: a share of the thigh),
 * legFab (their cloth or print), jacket (an open resort or linen shirt)
 */
const BRIEF = (o) => ({ rise: 0.09, riseB: 0.105, side: 0.12, sideW: 0.035, leg: 0.4, back: 'cheeky', ...o });
const SUIT = (o) => ({ sideW: 0, leg: 0.8, back: 'cheeky', ...o, rise: o.side, riseB: o.side });
const TRIB = BRIEF({ rise: 0.085, riseB: 0.1, side: 0.11, sideW: 0.018, leg: 0.5, tie: 1 }), BANDB = BRIEF({ rise: 0.1, riseB: 0.115, side: 0.13, sideW: 0.05, leg: 0.2, back: 'full' }), BALCB = BRIEF({ rise: 0.08, riseB: 0.1, side: 0.15, sideW: 0.04, leg: 0.9 });
const HIGHCUT = SUIT({ side: 0.25, leg: 1 }), CLASSIC = SUIT({ side: 0.15, leg: 0.4, back: 'full' });
const THONGB = BRIEF({ rise: 0.075, riseB: 0.1, side: 0.12, sideW: 0.014, leg: 0.7, tie: 1, back: 'thong' }), BRAZB = BRIEF({ rise: 0.08, riseB: 0.1, side: 0.145, sideW: 0.03, leg: 0.85, back: 'brazil' });
export const SWIM_OUTFITS = {
  // (bikinis: a triangle top on fine strings, tied at the sides; a ruched bandeau over full bottoms; an underwired
  // balconette over high-leg cheeky ones; a sporty scoop over high-leg full ones; a twist-front bandeau in lame on gold rings)
  tribikini: { swim: 1, neck: 'tri', sleeve: 0, crop: TRI.f0, top: 'tri', fit: 0.0022, brief: TRIB, rise: TRIB.rise, shoe: 'sandal', fin: 'lycra', rough: 0.55 },
  bandeaubikini: { swim: 1, neck: 'straight', sleeve: 0, band: 1, crop: 0.54, fit: 0.0022, brief: BANDB, rise: BANDB.rise, shoe: 'slide', fin: 'crinkle', rough: 0.7 },
  balconette: { swim: 1, neck: 'balc', sleeve: 0, straps: 1, lift: 1, bra: 1, crop: 0.53, fit: 0.0022, brief: BALCB, rise: BALCB.rise, shoe: 'platform', fin: 'shine', rough: 0.35 },
  sportbikini: { swim: 1, neck: 'sport', sleeve: 0, straps: 1, strapW: 0.016, crop: 0.5, fit: 0.0022, brief: BRIEF({ rise: 0.1, riseB: 0.11, side: 0.17, sideW: 0.045, leg: 1, back: 'full' }), rise: 0.1, shoe: 'slide', fin: 'swimrib', rough: 0.75 },
  twistbikini: { swim: 1, neck: 'twist', sleeve: 0, band: 1, knot: 'twist', crop: 0.54, fit: 0.0022, brief: BRIEF({ rise: 0.075, riseB: 0.095, side: 0.13, sideW: 0.02, leg: 0.8, ring: 1, back: 'brazil' }), rise: 0.075, shoe: 'sandal', fin: 'foil', rough: 0.3 },
  // (and the backs as worn at a Vegas dayclub or on a Miami beach: a string triangle over a thong tied at the hips; an
  // underwired balconette over Brazilian bottoms)
  stringbikini: { swim: 1, neck: 'tri', sleeve: 0, crop: TRI.f0, top: 'tri', fit: 0.0022, brief: THONGB, rise: THONGB.rise, shoe: 'platform', fin: 'shine', rough: 0.35 },
  brazilbikini: { swim: 1, neck: 'balc', sleeve: 0, straps: 1, lift: 1, bra: 1, crop: 0.53, fit: 0.0022, brief: BRAZB, rise: BRAZB.rise, shoe: 'slide', fin: 'swimrib', rough: 0.75 },
  // (monokinis: a square-necked one-piece cut out at the centre front; a scoop one cut out at the waist either side; one
  // laced across a long front cut-out; one with a gold ring on a strap down the middle of its cut-out; a plunge carried
  // down to its bottoms, open at the sides and the back)
  monofront: { swim: 1, neck: 'ssquare', sleeve: 0, straps: 1, strapW: 0.018, holes: 'mfront', suit: SUIT({ side: 0.22, leg: 0.9 }), hem: 0, fit: 0.0022, shoe: 'platform', fin: 'lycra', rough: 0.55 },
  monoside: { swim: 1, neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.014, holes: 'mside', suit: SUIT({ side: 0.2, leg: 0.8 }), hem: 0, fit: 0.0022, shoe: 'slide', fin: 'swimrib', rough: 0.75 },
  monocross: { swim: 1, neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.012, holes: 'mcross', cross: 3, suit: SUIT({ side: 0.23, leg: 1 }), hem: 0, fit: 0.0022, shoe: 'sandal', fin: 'shine', rough: 0.35 },
  monoring: { swim: 1, neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.014, holes: 'mring', vring: 1, suit: SUIT({ side: 0.22, leg: 1 }), hem: 0, fit: 0.0022, shoe: 'platform', fin: 'shine', rough: 0.35 },
  monoplunge: { swim: 1, neck: 'splunge', sleeve: 0, straps: 1, strapW: 0.014, lift: 1, crop: 0.47, mono: { w0: 0.3, w1: 0.95 }, fit: 0.0022, brief: BRIEF({ rise: 0.085, riseB: 0.1, side: 0.14, sideW: 0.04, leg: 0.9 }), rise: 0.085, shoe: 'platform', fin: 'crinkle', rough: 0.7 },
  // (one-pieces: high-cut, scooped; square-necked, open behind to the waist; plunging, open-backed; a belted balconette)
  highcut: { swim: 1, neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.016, suit: HIGHCUT, hem: 0, fit: 0.0022, shoe: 'slide', fin: 'lycra', rough: 0.55 },
  scoopback: { swim: 1, neck: 'ssquare', sleeve: 0, straps: 1, strapW: 0.02, back: 0.32, suit: SUIT({ side: 0.17, leg: 0.5, back: 'full' }), hem: 0, fit: 0.0022, shoe: 'sandal', fin: 'swimrib', rough: 0.75 },
  plungesuit: { swim: 1, neck: 'splunge', sleeve: 0, straps: 1, strapW: 0.014, lift: 1, back: 0.45, suit: SUIT({ side: 0.21, leg: 0.8 }), hem: 0, fit: 0.0022, shoe: 'platform', fin: 'shine', rough: 0.35 },
  beltedsuit: { swim: 1, neck: 'balc', sleeve: 0, straps: 1, strapW: 0.014, lift: 1, belt: 1, buckle: 1, suit: CLASSIC, hem: 0, fit: 0.0022, shoe: 'platform', fin: 'lycra', rough: 0.55 },
  // (and what goes over them - the cover-up in her colour, the swimwear beneath in the accent: a sheer chiffon pareo tied
  // at the hip over a triangle bikini; a crochet mini over a bandeau; a fine mesh mini over a high-cut one-piece; a sheer
  // kaftan to the floor over a one-piece; a man's linen shirt worn open over a balconette)
  pareo: { swim: 1, cover: 'sheer', neck: 'tri', sleeve: 0, crop: TRI.f0, top: 'tri', fit: 0.0022, brief: TRIB, rise: TRIB.rise, skirt: { hem: 'midi', asym: 'thigh', slit: 1, wrap: 1, flare: 0.2, cling: 0.12, rise: 0.14, m: 50 }, shoe: 'slide', fin: 'chiffon', accFin: 'lycra', coverOp: 0.55, rough: 0.8 },
  crochetmini: { swim: 1, cover: 'net', neck: 'straight', sleeve: 0, band: 1, crop: 0.54, fit: 0.0022, brief: BANDB, rise: BANDB.rise, sheer: { neck: 'scoop', sleeve: 0.97, wide: 0.035, hem: 'mini', flare: 0.08, cling: 0.3, net: 3, lo: 0.27, ease: 0.004 }, shoe: 'slide', fin: 'crochet', accFin: 'lycra', rough: 0.9 },
  meshcover: { swim: 1, cover: 'net', neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.016, suit: HIGHCUT, hem: 0, fit: 0.0022, sheer: { neck: 'crew', sleeve: 0.97, hem: 'mini', flare: 0.04, cling: 0.5, net: 1, lo: 0.27 }, shoe: 'sandal', fin: 'lycra', accFin: 'shine', rough: 0.5 },
  kaftan: { swim: 1, cover: 'net', neck: 'sscoop', sleeve: 0, straps: 1, strapW: 0.016, suit: CLASSIC, hem: 0, fit: 0.0022, sheer: { neck: 'vd', sleeve: 0.72, wide: 0.07, hem: 'floor', flare: 0.3, cling: 0, slit: 1, net: 0, op: 0.45, lo: 0.27, ease: 0.012 }, shoe: 'slide', fin: 'chiffon', accFin: 'lycra', rough: 0.8 },
  // (a guipure lace beach dress to the calf over a bandeau and Brazilian bottoms - its sleeves to the forearm, slit at the
  // side: world/Lace.js's lace, the bikini beneath it all that is opaque)
  lacecover: { swim: 1, cover: 'net', neck: 'straight', sleeve: 0, band: 1, crop: 0.54, fit: 0.0022, brief: BRAZB, rise: BRAZB.rise, sheer: { neck: 'vd', sleeve: 0.62, hem: 'midi', flare: 0.14, cling: 0.15, slit: 1, lace: 1, lo: 0.27, ease: 0.008 }, lace: { kind: 'guipure' }, shoe: 'slide', fin: 'crochet', accFin: 'lycra', rough: 0.9 },
  openshirt: { swim: 1, cover: 'shirt', jacket: 'shirt', neck: 'balc', sleeve: 0, straps: 1, lift: 1, bra: 1, crop: 0.53, fit: 0.0022, brief: BALCB, rise: BALCB.rise, shoe: 'slide', fin: 'linen', accFin: 'shine', rough: 0.85 },
  // (his: short swim shorts, plain; board shorts to above the knee in a palm print; a palm-print resort shirt open over
  // short ones; an open linen shirt, its sleeves rolled, over mid-length ones)
  trunks: { swim: 'm', bareTop: 1, neck: 'crew', sleeve: 0, trousers: 'swim', shorts: 0.42, rise: 0.17, legFab: 'nylon', shoe: 'slide', rough: 0.5 },
  boardshorts: { swim: 'm', bareTop: 1, neck: 'crew', sleeve: 0, trousers: 'swim', shorts: 0.68, rise: 0.18, legFab: 'palm', shoe: 'slide', rough: 0.7 },
  resortshirt: { swim: 'm', bareTop: 1, neck: 'crew', sleeve: 0, trousers: 'swim', shorts: 0.48, rise: 0.17, legFab: 'nylon', jacket: 'resort', fin: 'palm', shoe: 'slide', rough: 0.7 },
  linenshirt: { swim: 'm', bareTop: 1, neck: 'crew', sleeve: 0, trousers: 'swim', shorts: 0.6, rise: 0.18, legFab: 'stripe', jacket: 'linen', fin: 'linen', shoe: 'slide', rough: 0.9 },
};
export const SWIM_F = Object.freeze(Object.keys(SWIM_OUTFITS).filter((k) => SWIM_OUTFITS[k].swim === 1));
export const SWIM_M = Object.freeze(Object.keys(SWIM_OUTFITS).filter((k) => SWIM_OUTFITS[k].swim === 'm'));
/** how each covers (world/PartyPool.js: a crowd's colours and far bodies) - mid: 'skin' (a bare midriff), shirt (an open shirt over), cover (a cover-up's hem) */
export const SWIM_INFO = Object.freeze(Object.fromEntries(Object.entries(SWIM_OUTFITS).map(([k, o]) => [k, { ...(o.crop ? { mid: 'skin' } : {}), ...(o.jacket ? { shirt: 1 } : {}), ...(o.skirt ? { cover: o.skirt.hem } : o.sheer ? { cover: o.sheer.hem } : {}) }])));
/**
 * The swimwear's cloths (merged into People's FINISHES): matt lycra, a soft dull sheen; shiny lycra; a ribbed swim knit;
 * crinkle; prints - palm fronds, awning stripes (Fabric's, their ink a cream or a navy against the cloth); a swim short's
 * nylon; linen, crumpled; chiffon and crochet for what goes over
 */
export const SWIM_FINISHES = Object.freeze({ lycra: { r: 0.58 }, shine: { r: 0.34, env: 0.55 }, foil: { r: 0.3, metal: 0.45, env: 0.85, w: 'lame' }, swimrib: { r: 0.78, w: 'rib' }, crinkle: { r: 0.72, w: 'crinkle' }, palm: { r: 0.72, w: 'palm' }, stripe: { r: 0.72, w: 'stripe' }, nylon: { r: 0.6 }, linen: { r: 0.9, w: 'crinkle' }, chiffon: { r: 0.8 }, crochet: { r: 0.95 } });
/**
 * Open shirts over swimwear (merged into People's JACKETS - its fields): hers a man's-cut linen shirt worn open, its
 * sleeves rolled to the forearm (sleeve, roll); his a short-sleeved camp-collar resort shirt, or a linen one rolled - all
 * soft (no padded shoulder)
 */
export const SWIM_JACKETS = Object.freeze({
  shirt: { hem: -0.13, open: (f) => 0.3 + 0.16 * ss3(0.55, 0.97, f) + 0.08 * ss3(0.1, -0.13, f), lapel: 0.12, lapV: 0.72, out: 0.018, flare: 0.012, loose: 0.02, sleeve: 0.62, roll: 1, soft: 1, fall: 1, rows: 14, cols: 24, her: { hem: -0.15, out: 0.013, flare: 0.006, loose: 0.016 } },
  resort: { hem: -0.1, open: (f) => 0.24 + 0.2 * ss3(0.5, 0.97, f), lapel: 0.17, lapV: 0.62, out: 0.016, flare: 0.032, loose: 0.022, sleeve: 0.42, soft: 1, rows: 18, cols: 28 },
  linen: { hem: -0.11, open: (f) => 0.18 + 0.18 * ss3(0.55, 0.97, f), lapel: 0.12, lapV: 0.72, out: 0.017, flare: 0.034, loose: 0.02, sleeve: 0.66, roll: 1, soft: 1, rows: 18, cols: 28 },
});
/** swim shorts' cut (People's CUTS: how much of the leg's own shape they follow, ease, the hem's radius) - loose, a little flared */
export const SWIM_CUT = Object.freeze([0.45, 0.018, 0.072]);
