// The contract table and the dismissal, as cutscenes (a career: you are a driver, not the owner). ui/Offers.js is the
// one way an offer is chosen and the one way a lost seat is shown; this module registers both scenes there as it loads.
//
// The table: a meeting room, the offers on the table as contracts - one per team, printed in its colours with its name,
// the salary, the years, your standing, the driver you replace, the bonuses, what the team expects and how patient it
// is (anything else an offer carries listed plainly under them). The camera glides from one to the next and frames it
// to be read (← →, 1-N, a click or a tap on one, a swipe; ↑ all of them); SIGN takes it. Then, in first person, a pen
// in your hand: your name signed on it stroke by stroke (a cursive of our own - below - slanted and jittered by your
// name, a fountain pen's thick and thin), the papers and the phones with the news, your shirt heat-pressed with your
// name and number, and the chief executive's hand shaken for the photographers. About 20 s; any beat skipped with
// Space, Enter or a click, the lot with Esc - the choice is made either way. A negotiable offer is not signed here:
// chosen (TALK TERMS), it goes back at once to the caller for the talks at the table; the deal they agree comes back
// through here (direct: straight to the pen) to be signed.
// The dismissal: the meeting room in the team's colours, the team principal across the table, the letter slid across
// to you; a silence, then a handshake - or not; your helmet and race suit packed into a box; the headline; the camera
// following you out of the garage. About 19 s, skipped the same way.
// No real team principal or chief executive is ever depicted: the principal is a generic, unnamed one, the chief
// executive the team's invented one (career/Paddock.js). One renderer: the hub's (its showroom's, lent: its canvas, tone
// and size handed back and its studio started again), else one of our own, disposed with the rest on the way out. Each
// beat is its own small set (a THREE.Scene), the next one built while this one plays; everything disposed at the end.
import * as THREE from 'three';
import { setOfferScene, setDroppedScene } from './Offers.js';
import { makePerson, makeHelmet, lookOf, baseLook } from '../world/People.js';
import { ensureMotion, reduced, keys } from './Motion.js';
import * as PR from '../career/PR.js';
import { makePaddock, paddockRoster } from '../career/Paddock.js';
import { celebLook } from '../career/Celebs.js';

// ---- small helpers ----------------------------------------------------------------------------------------------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const u01 = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const eOut = (u) => 1 - Math.pow(1 - u, 3);
const eIn = (u) => u * u * u;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const money = (m) => `$${(Math.round((+m || 0) * 10) / 10).toFixed(1)}M`;
const words = (n) => String(n || '').trim().split(/\s+/).filter(Boolean);
const last = (n) => words(n).pop() || '';
const first = (n) => words(n)[0] || '';
/** what someone across a table calls you: your first name - your surname when all you go by is an initial ('E. Esselink') */
const callName = (n) => { const f = first(n); return /\.$/.test(f) || f.length <= 2 ? last(n) : f; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** a seeded random stream (the same seed, the same stream) */
const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; s ^= s >>> 12; return (s >>> 0) / 4294967296; }; };
const pick = (a, R = Math.random) => a[(R() * a.length) | 0];
const safe = (f, fb = null) => { try { return f(); } catch (e) { console.warn('[contract scene]', e); return fb; } };
/** a colour's sRGB channels 0..1 from '#rrggbb' (anything else: grey) */
const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '')); const v = m ? parseInt(m[1], 16) : 0x888888; return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255]; };
const hexOk = (h, d) => (/^#[0-9a-f]{6}$/i.test(String(h || '')) ? h : d);
/** relative luminance (WCAG) of a hex colour */
const lum = (h) => { const L = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4), [r, g, b] = rgb(h); return 0.2126 * L(r) + 0.7152 * L(g) + 0.0722 * L(b); };
/** the ink that reads on a background: near-black on a light one, white on a dark one */
const inkOn = (bg) => (lum(bg) > 0.4 ? '#12161d' : '#ffffff');
/** a colour a little darker or lighter (k < 1 darker) as hex */
const shade = (h, k) => { const [r, g, b] = rgb(h), f = (c) => Math.round(clamp(k < 1 ? c * k : c + (1 - c) * (k - 1), 0, 1) * 255).toString(16).padStart(2, '0'); return `#${f(r)}${f(g)}${f(b)}`; };
/** two colours far enough apart to read one on the other: b, else white or near-black */
const apart = (a, b) => { const x = lum(a), y = lum(b), r = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); return r >= 2.2 ? b : inkOn(a); };
const tierName = (t) => (t <= 0 ? 'Front-runner' : t >= 3 ? 'Backmarker' : 'Midfield');
const ROLE_NAME = { lead: 'Number one', equal: 'Equal status', support: 'Number two', reserve: 'Reserve driver' };
const FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif', SERIF = 'Georgia, "Times New Roman", serif', COND = '"Arial Narrow", "Roboto Condensed", "Segoe UI", Arial, sans-serif';

/** a team as the career has it: { name, color, color2, tier } (unknown: the career's grey) */
function teamInfo(c, name) {
  const t = (name && c?.teams?.[name]) || {};
  return { name: String(name || t.name || 'The team'), color: hexOk(t.color, '#3a4150'), color2: hexOk(t.color2, '#ffffff'), tier: Number.isFinite(t.tier) ? t.tier : 2 };
}
/** you: { name, number, helmet, skin } */
function meInfo(c) {
  const me = c?.me || {}, name = String(me.name || 'You');
  return { name, number: me.number ?? 99, helmet: hexOk(me.helmet, '#ffffff'), skin: hexOk(safe(() => lookOf(name)?.skin), '#e3b994') };
}

// ---- your signature: a cursive of our own, written stroke by stroke ---------------------------------------------------
// Each glyph: [advance, points, join] in an em where the x-height is 1, the baseline 0, an ascender ~2.1 and a descender
// ~-1.1. The points are a smooth curve's (Catmull-Rom through them); '|' lifts the pen and goes on at once, '*' starts a
// stroke left for later (an i's dot, a t's cross - written once the name is). A lowercase letter starts where the one
// before it left off (its first point is where the joining stroke arrives); a capital starts a stroke of its own, and
// joins the next letter only when join is set.
const LO = {
  a: [0.95, '.6,.82 .4,1 .12,.8 .03,.4 .18,.03 .44,.1 .6,.5 .64,.98 .62,.38 .68,.05 .82,0 .95,.24'],
  b: [0.8, '.08,.3 .42,1.5 .5,2 .36,2.12 .24,1.8 .2,.6 .2,.05 .3,.45 .5,.9 .66,.78 .6,.3 .38,.02 .26,.14 .48,.2 .64,.55 .8,.82'],
  c: [0.72, '.56,.78 .44,.98 .16,.84 .04,.44 .16,.06 .42,0 .72,.24'],
  d: [0.95, '.6,.82 .4,1 .12,.8 .03,.4 .18,.03 .44,.1 .6,.5 .7,2.1 .62,.4 .68,.05 .82,0 .95,.24'],
  e: [0.7, '.08,.3 .44,.6 .54,.84 .42,.98 .2,.84 .1,.48 .18,.1 .42,0 .7,.24'],
  f: [0.72, '.08,.3 .44,1.3 .56,1.9 .44,2.12 .3,1.85 .28,.6 .26,-.4 .2,-1 .1,-.86 .26,-.24 .52,.12 .72,.3'],
  g: [0.95, '.6,.82 .4,1 .12,.8 .03,.4 .18,.03 .44,.1 .6,.5 .64,.98 .62,-.1 .54,-.86 .34,-1.06 .2,-.86 .38,-.34 .68,-.04 .95,.24'],
  h: [0.95, '.08,.35 .42,1.5 .5,2 .36,2.12 .24,1.8 .2,.6 .18,0 .24,.55 .44,.96 .62,.84 .66,.38 .7,.05 .82,0 .95,.24'],
  i: [0.55, '.08,.24 .3,.96 .26,.3 .32,.03 .42,0 .55,.24 *.28,1.38 .33,1.46'],
  j: [0.62, '.08,.24 .32,.96 .3,-.1 .24,-.86 .1,-1.06 0,-.86 .2,-.34 .44,-.04 .62,.24 *.3,1.38 .35,1.46'],
  k: [0.9, '.08,.35 .42,1.5 .5,2 .36,2.12 .24,1.8 .2,.6 .18,0 .24,.52 .5,.96 .62,.8 .46,.56 .28,.5 .5,.42 .6,.1 .74,0 .9,.24'],
  l: [0.58, '.08,.3 .42,1.5 .5,2 .36,2.12 .24,1.8 .2,.6 .24,.06 .4,0 .58,.24'],
  m: [1.22, '.06,.5 .18,.96 .2,0 .24,.6 .4,.96 .54,.84 .56,0 .6,.6 .76,.96 .92,.84 .94,.3 .98,.04 1.1,0 1.22,.24'],
  n: [0.9, '.06,.5 .18,.96 .2,0 .24,.6 .42,.96 .58,.84 .6,.3 .64,.04 .76,0 .9,.24'],
  o: [0.78, '.54,.84 .4,1 .12,.82 .03,.42 .18,.03 .44,.06 .58,.5 .54,.92 .44,.84 .6,.8 .78,.84'],
  p: [0.92, '.08,.3 .3,.96 .24,-1.1 .26,.4 .48,.96 .68,.8 .72,.35 .54,.03 .3,.1 .54,.04 .74,.1 .92,.3'],
  q: [0.95, '.6,.82 .4,1 .12,.8 .03,.4 .18,.03 .44,.1 .6,.5 .64,.98 .62,-1 .68,-.5 .8,-.1 .95,.24'],
  r: [0.78, '.06,.3 .24,.96 .36,.8 .5,.9 .48,.4 .52,.04 .64,0 .78,.24'],
  s: [0.72, '.06,.3 .4,1 .54,.5 .5,.14 .3,0 .1,.12 .3,.08 .56,.06 .72,.24'],
  t: [0.66, '.08,.3 .34,1 .42,1.55 .32,.4 .36,.04 .5,0 .66,.24 *.1,1.04 .62,1.12'],
  u: [0.95, '.06,.3 .2,.96 .18,.26 .3,0 .5,.1 .62,.5 .66,.96 .64,.34 .7,.04 .82,0 .95,.24'],
  v: [0.86, '.06,.4 .2,.96 .3,.5 .4,.04 .52,.36 .64,.96 .6,.84 .74,.8 .86,.84'],
  w: [1.1, '.06,.4 .2,.96 .22,.24 .32,0 .46,.2 .52,.7 .56,.24 .66,0 .8,.36 .86,.96 .82,.84 .96,.8 1.1,.84'],
  x: [0.84, '.06,.3 .3,.96 .44,.6 .54,.14 .68,0 .84,.24 *.62,.96 .18,.04'],
  y: [0.95, '.06,.3 .2,.96 .18,.26 .3,0 .5,.1 .62,.5 .66,.96 .62,-.1 .54,-.86 .34,-1.06 .2,-.86 .38,-.34 .68,-.04 .95,.24'],
  z: [0.82, '.08,.7 .34,.96 .62,.9 .3,.26 .1,.02 .38,.1 .62,.02 .82,.24'],
};
const UP = {
  A: [1.45, '1.05,1.9 .78,2.2 .3,1.92 .05,1 .24,.06 .66,.3 .98,1.2 1.12,2.15 1.06,.8 1.14,.08 1.3,0 1.45,.24', 1],
  B: [1.2, '.15,1.9 .45,2.2 .42,1 .36,0 .28,.2 .5,2.08 .94,2.14 1.04,1.7 .7,1.2 .45,1.14 .8,1.1 1.1,.7 .95,.14 .5,0 .38,.14 .74,.24 1.2,.3', 1],
  C: [1.0, '1,1.8 .84,2.2 .4,2 .1,1.2 .2,.25 .6,0 1,.3', 1],
  D: [1.25, '.56,2 .5,.05 .25,.05 .2,.3 .6,.12 1.05,.45 1.2,1.3 .95,2.05 .45,2.2 .15,1.95 .35,1.75', 0],
  E: [1.05, '.95,1.9 .75,2.2 .35,2.05 .4,1.5 .7,1.2 .35,1.15 .1,.7 .25,.08 .7,0 1.05,.3', 1],
  F: [1.2, '.15,1.95 .5,2.15 1.25,2.2 .8,2.15 .62,1 .45,.15 .2,0 .05,.25 *.35,1.15 .95,1.2', 0],
  G: [1.25, '1,1.7 .8,2.2 .35,1.95 .1,1.1 .25,.15 .65,.05 .95,.6 1,1.1 .98,0 .85,-.85 .6,-1.05 .45,-.8 .7,-.3 1.05,0 1.25,.25', 1],
  H: [1.3, '.1,1.9 .35,2.2 .3,1 .25,0 .3,.9 .6,1.15 .95,1.2 1.05,2.2 .95,1 .98,.1 1.1,0 1.3,.25', 1],
  I: [0.95, '.9,2 .7,2.2 .55,1.6 .45,.5 .35,.05 .1,.05 .05,.3 .4,.3 .95,.35', 0],
  J: [1.0, '.1,2 .5,2.2 .75,2.2 .65,.8 .55,-.6 .35,-1.05 .15,-.8 .35,-.2 .75,.05 1,.25', 1],
  K: [1.2, '.1,1.9 .35,2.2 .3,1 .25,0 .3,.9 1,2.15 .4,1.05 .6,1.1 .85,.2 1,0 1.2,.25', 1],
  L: [1.1, '.6,1.6 .9,2.1 .75,2.2 .5,1.8 .4,.8 .3,.1 .1,0 .15,.25 .5,.1 .9,0 1.1,.2', 1],
  M: [1.25, '.05,0 .25,1.6 .35,2.2 .5,1.2 .55,0 .6,1.4 .8,2.2 .95,1.4 .95,.3 1.05,0 1.25,.25', 1],
  N: [1.3, '.05,0 .25,1.6 .35,2.2 .6,1.1 .85,0 .95,1.2 1.05,2.2 1,2 1.15,2 1.3,2.1', 0],
  O: [1.1, '.7,2.1 .3,1.9 .05,1.1 .25,.1 .7,.05 1,.9 .95,1.9 .65,2.15 .45,1.9 .8,1.95 1.1,2', 0],
  P: [1.1, '.4,1.9 .42,1 .35,0 .3,.15 .45,2.05 .9,2.15 1.1,1.75 .85,1.2 .4,1.1', 0],
  Q: [1.15, '.7,2.1 .3,1.9 .05,1.1 .25,.1 .7,.05 1,.9 .95,1.9 .65,2.15 .45,1.9 *.5,.4 .8,0 1.15,.1', 0],
  R: [1.25, '.4,1.9 .42,1 .35,0 .3,.15 .45,2.05 .9,2.15 1.1,1.75 .85,1.2 .45,1.1 .7,1 .9,.2 1.05,0 1.25,.25', 1],
  S: [1.1, '.2,.9 .5,1.5 .95,2.2 .65,2.15 .4,1.8 .6,1.3 .85,.7 .7,.1 .3,0 .1,.25 .4,.2 .8,.2 1.1,.3', 1],
  T: [1.3, '.05,1.9 .35,2.15 1.3,2.2 .85,2.15 .68,1 .5,.15 .25,0 .1,.25', 0],
  U: [1.35, '.1,1.9 .3,2.2 .25,.6 .45,0 .8,.3 1,1.2 1.05,2.2 .98,.8 1.05,.05 1.2,0 1.35,.25', 1],
  V: [1.35, '.1,1.9 .3,2.2 .45,1 .6,0 .85,1 1.1,2.2 1.05,2 1.2,1.95 1.35,2.05', 0],
  W: [1.55, '.1,1.9 .3,2.2 .35,1 .45,0 .7,1.4 .95,0 1.1,1.2 1.3,2.2 1.25,2 1.4,1.95 1.55,2.05', 0],
  X: [1.1, '.1,1.9 .3,2.2 .6,1.1 .9,0 1.1,.25 *1.05,2.15 .15,0', 1],
  Y: [1.25, '.1,1.9 .3,2.2 .25,.9 .45,.5 .8,.9 1,2.2 .95,.3 .85,-.85 .6,-1.05 .45,-.8 .7,-.3 1.05,0 1.25,.25', 1],
  Z: [1.15, '.15,1.9 .45,2.2 1.05,2.1 .55,1 .1,.05 .5,.15 .9,0 1.15,.25', 1],
};
/** a glyph's spec parsed once: { w, now: [[[x, y]]] (written in turn), later: [[[x, y]]], join } */
const GLYPHS = new Map();
function glyph(ch) {
  if (GLYPHS.has(ch)) return GLYPHS.get(ch);
  const up = ch >= 'A' && ch <= 'Z', spec = up ? UP[ch] : LO[ch];
  let g = null;
  if (spec) {
    g = { w: spec[0], now: [], later: [], join: up ? !!spec[2] : true, up };
    // ('|' and '*' start a stroke of their own; '*' one left for later)
    for (const part of spec[1].split(/(?=[|*])/)) {
      const later = part[0] === '*', pts = part.replace(/^[|*]/, '').trim().split(/\s+/).filter(Boolean).map((p) => p.split(',').map(Number));
      if (pts.length) (later ? g.later : g.now).push(pts);
    }
  }
  GLYPHS.set(ch, g); return g;
}
/** points through a centripetal Catmull-Rom curve (no cusps, no loops of its own), per samples a segment */
function smooth(P, per = 9) {
  if (P.length < 2) return P.map((p) => [...p]);
  const n = P.length, out = [], mix = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const Q = [[2 * P[0][0] - P[1][0], 2 * P[0][1] - P[1][1]], ...P, [2 * P[n - 1][0] - P[n - 2][0], 2 * P[n - 1][1] - P[n - 2][1]]];
  const d = (a, b) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
  for (let i = 1; i < Q.length - 2; i++) {
    const p0 = Q[i - 1], p1 = Q[i], p2 = Q[i + 1], p3 = Q[i + 2], t1 = d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    for (let s = 0; s < per; s++) {
      const t = t1 + (t2 - t1) * (s / per);
      const A1 = mix(p0, p1, t / t1), A2 = mix(p1, p2, (t - t1) / (t2 - t1)), A3 = mix(p2, p3, (t - t2) / (t3 - t2));
      const B1 = mix(A1, A2, t / t2), B2 = mix(A2, A3, (t - t1) / (t3 - t1));
      out.push(mix(B1, B2, (t - t1) / (t2 - t1)));
    }
  }
  out.push([...P[n - 1]]); return out;
}
/**
 * A name as a signature: its strokes in the order a hand writes them (the letters, each word joined up; then the dots
 * and crosses; then the flourish under it), slanted, each letter a little off its neighbour (seeded by the name: the
 * same hand every time) -> { strokes: [{ p: [[x, y]], L: [length so far], len }], box: { x0, x1, y0, y1 } } (em units)
 */
export function signatureStrokes(name, seed = name) {
  const R = rng(hash(`sig|${seed}`)), clean = String(name || 'X').normalize('NFD').replace(/[̀-ͯ]/g, '');
  const now = [], later = []; let x = 0, cur = null, join = false;
  for (const ch of clean) {
    if (ch === ' ') { x += 0.45; cur = null; join = false; continue; }
    if (ch === '.') { later.push([[x + 0.04, 0.08], [x + 0.1, 0.02]]); x += 0.3; cur = null; join = false; continue; }
    if (ch === '-') { now.push([[x + 0.04, 0.5], [x + 0.4, 0.56]]); x += 0.48; cur = null; join = false; continue; }
    if (ch === "'" || ch === '’') { later.push([[x + 0.12, 2.1], [x + 0.06, 1.72]]); x += 0.2; continue; }
    const g = glyph(ch) || glyph(ch.toLowerCase());
    if (!g) { x += 0.5; cur = null; join = false; continue; }
    // (each letter a touch bigger or smaller, a touch higher or lower than its neighbours; each point a little off)
    const k = 0.93 + R() * 0.14, dy = (R() - 0.5) * 0.09;
    const map = (s) => s.map(([px, py]) => [x + px * k + (R() - 0.5) * 0.045, py * k + dy + (R() - 0.5) * 0.045]);
    g.now.forEach((s, i) => { const P = map(s); if (i === 0 && cur && join && !g.up) cur.push(...P); else { cur = P; now.push(cur); } });
    for (const s of g.later) later.push(map(s));
    join = g.join; x += g.w * k + 0.02;
  }
  // the flourish: from past the last letter, round and back under the whole name
  if (now.length) { const w = x; later.push([[w + 0.05, 0.35], [w + 0.32, -0.12], [w * 0.62, -0.62], [0.12, -0.5], [0.42, -0.36]]); }
  // the slant, and the baseline drifting a little as a hand's does
  const ph = R() * 6;
  const slant = (P) => P.map(([px, py]) => [px + py * 0.3, py + 0.05 * Math.sin(px * 0.8 + ph)]);
  const strokes = [...now, ...later].map((P) => {
    const p = smooth(slant(P)), L = [0];
    for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
    return { p, L, len: L[L.length - 1] };
  });
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const s of strokes) for (const [px, py] of s.p) { x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }
  if (!strokes.length) { x0 = 0; x1 = 1; y0 = 0; y1 = 1; }
  return { strokes, box: { x0, x1, y0, y1 } };
}
/**
 * A signature being written on a 2D canvas: plan(dur) spreads its strokes over dur seconds (the pen lifted between
 * them a beat each), at(t) writes everything up to t (only what is new since the last call) and says where the nib is
 * -> { x, y (canvas px), lift 0..1 (off the paper between strokes), done }; all() writes the rest. Its place on the
 * canvas: em (px a unit) and the origin (ox, oy: the baseline's start). A fountain pen's line: thicker across the nib's
 * edge than along it, thinner where a stroke starts and ends.
 */
class Ink {
  constructor(sig, ctx, { em, ox, oy, width = em * 0.075, color = '#18307a' }) {
    Object.assign(this, { sig, ctx, em, ox, oy, w0: width, color });
    this.si = 0; this.pi = 0; this.plan(2.8);
  }
  plan(dur) {
    const S = this.sig.strokes, lift = 0.075, total = S.reduce((a, s) => a + s.len, 0) || 1;
    const speed = total / Math.max(0.2, dur - lift * Math.max(0, S.length - 1));
    let t = 0; this.T = S.map((s, i) => { const t0 = t + (i ? lift : 0), t1 = t0 + s.len / speed; t = t1; return [t0, t1]; });
    this.dur = t; return t;
  }
  px(p) { return [this.ox + p[0] * this.em, this.oy - p[1] * this.em]; }
  seg(s, i) {
    const x = this.ctx, a = this.px(s.p[i - 1]), b = this.px(s.p[i]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = Math.min(s.L[i], s.len - s.L[i]), taper = 0.45 + 0.55 * clamp(end / 0.22, 0, 1);
    x.lineWidth = this.w0 * (0.38 + 0.78 * Math.abs(Math.sin(ang + 0.62))) * taper;
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
  }
  at(t) {
    const S = this.sig.strokes, x = this.ctx; x.strokeStyle = this.color; x.lineCap = 'round'; x.lineJoin = 'round';
    // (what is new: the rest of the stroke under way, the whole of each one finished since, part of the one under way now)
    while (this.si < S.length) {
      const s = S[this.si], [t0, t1] = this.T[this.si];
      if (t < t0) break;
      const L = s.len * clamp((t - t0) / Math.max(1e-6, t1 - t0), 0, 1);
      while (this.pi + 1 < s.p.length && s.L[this.pi + 1] <= L) { this.pi++; if (this.pi > 0) this.seg(s, this.pi); }
      if (t < t1) break;
      this.si++; this.pi = 0;
    }
    return this.nib(t);
  }
  /** where the nib is at t: on a stroke, or lifted between two (the pen travelling from one's end to the next's start) */
  nib(t) {
    const S = this.sig.strokes; if (!S.length) return { x: this.ox, y: this.oy, lift: 1, done: true };
    for (let i = 0; i < S.length; i++) {
      const [t0, t1] = this.T[i], s = S[i];
      if (t <= t1 || i === S.length - 1) {
        if (t < t0) {
          // (between strokes: from the last one's end to this one's start, lifted in an arc)
          const pe = i ? S[i - 1].p[S[i - 1].p.length - 1] : s.p[0], pt = s.p[0], pv = i ? this.T[i - 1][1] : t0 - 0.2, u = clamp((t - pv) / Math.max(1e-6, t0 - pv), 0, 1);
          const [ax, ay] = this.px(pe), [bx, by] = this.px(pt);
          return { x: lerp(ax, bx, ease(u)), y: lerp(ay, by, ease(u)), lift: Math.sin(Math.PI * u), done: false };
        }
        const L = s.len * clamp((t - t0) / Math.max(1e-6, t1 - t0), 0, 1);
        let j = 1; while (j < s.p.length - 1 && s.L[j] < L) j++;
        const f = clamp((L - s.L[j - 1]) / Math.max(1e-6, s.L[j] - s.L[j - 1]), 0, 1), a = this.px(s.p[j - 1]), b = this.px(s.p[j]);
        return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), lift: 0, done: t >= this.dur };
      }
    }
    const p = this.px(S[S.length - 1].p.at(-1)); return { x: p[0], y: p[1], lift: 0, done: true };
  }
  all() { return this.at(this.dur + 1); }
}
/** a whole signature drawn at once into a box (x, y, w, h) on a 2D canvas (a countersignature; a letter's) */
function signInto(ctx, name, x, y, w, h, color = '#16224f', seed = name) {
  const sig = signatureStrokes(name, seed), B = sig.box, em = Math.min(w / (B.x1 - B.x0), h / (B.y1 - B.y0));
  const ink = new Ink(sig, ctx, { em, ox: x - B.x0 * em, oy: y + B.y1 * em, color }); ink.all();
}

// ---- the paper: canvases for the contract, the letter, the papers, the phone, the shirt -----------------------------
const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
/** a 2D canvas as a texture: sRGB, mipmapped, as sharp at a slant as the GPU allows */
function texOf(cv, R) { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, R?.capabilities?.getMaxAnisotropy?.() || 1); return t; }
const spaced = (x, px) => { if ('letterSpacing' in x) x.letterSpacing = `${px}px`; };
/** the largest size (<= size) at which text fits maxW in this weight and family */
function fitFont(x, text, weight, size, maxW, family = FONT, min = 12) {
  let s = size; x.font = `${weight} ${s}px ${family}`;
  while (s > min && x.measureText(text).width > maxW) { s -= 2; x.font = `${weight} ${s}px ${family}`; }
  return s;
}
/** text wrapped to maxW in the font set, at most max lines (the last one cut with an ellipsis) */
function wrap(x, text, maxW, max = 3) {
  const out = []; let line = '';
  for (const w of String(text || '').split(/\s+/).filter(Boolean)) {
    const t = line ? `${line} ${w}` : w;
    if (x.measureText(t).width <= maxW || !line) line = t; else { out.push(line); line = w; }
  }
  if (line) out.push(line);
  if (out.length > max) { out.length = max; let l = out[max - 1]; while (l && x.measureText(`${l}…`).width > maxW) l = l.slice(0, -1); out[max - 1] = `${l.trim()}…`; }
  return out;
}
/** a label in small capitals, letter-spaced */
function label(x, text, px, py, color = '#6b7480', size = 22) { x.save(); x.font = `800 ${size}px ${FONT}`; spaced(x, 3); x.fillStyle = color; x.fillText(String(text).toUpperCase(), px, py); x.restore(); }
/** a little paper grain: faint flecks, the same for the same seed */
function grain(x, W, H, seed, n = 900, a = 0.035) { const R = rng(seed); x.save(); for (let i = 0; i < n; i++) { x.fillStyle = `rgba(80,70,50,${a * R()})`; x.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R() * 2); } x.restore(); }

// the contract's sheet: 1024 x 1448 (A4), 0.25 m wide on the table
const PW = 0.25, PH = 0.3536, CW = 1024, CH = 1448;
/** your signature's place on the sheet (canvas px): the box the signature is written over (it may run outside it) */
const SIGBOX = { x: 520, y: 1136, w: 470, h: 262 }, SIGLINE = 1330;
/**
 * What kind of contract this is, in words: { title, sub, chip, bank (the headlines' bank and sub-bank) } - by the
 * offer's own kind (career/Seat.js: 'first' | 'seat' | 'renewal' (a save's old 'renew') | 'precontract' | 'buyout' |
 * 'midseason' | 'reserve'), else the moment's (opts.kind)
 */
function kindText(of, opts, T) {
  const ok = String(of?.kind || ''), k = ok && ok !== 'seat' ? ok : String(opts?.kind || '');
  if (k === 'reserve' || of?.role === 'reserve') return { title: 'RESERVE DRIVER AGREEMENT', sub: `The car is yours whenever a ${T.name} race driver can't race`, chip: 'Reserve role', bank: ['contract', 'reserve'] };
  if (k === 'renew' || k === 'renewal') return { title: 'CONTRACT RENEWAL', sub: `A new contract: you stay at ${T.name}`, chip: 'New contract', bank: ['contract', 'renew'] };
  if (k === 'buyout') return { title: 'TRANSFER AGREEMENT', sub: of?.next ? `${T.name} buy out your contract: yours from next season` : `${T.name} buy out your contract`, chip: 'Clause bought', bank: of?.next ? ['contract', 'next'] : ['signing', null] };
  if (k === 'precontract' || (of?.next && k !== 'first')) return { title: 'PRE-CONTRACT', sub: 'Your race seat from next season', chip: 'Pre-contract', bank: ['contract', 'next'] };
  if (k === 'midseason') return { title: 'DRIVER AGREEMENT', sub: 'A race seat from the next round', chip: 'A seat now', bank: ['signing', null] };
  if (k === 'first') return { title: 'DRIVER AGREEMENT', sub: 'Your first Formula 1 race seat', chip: 'Your first seat', bank: ['signing', null] };
  return { title: 'DRIVER AGREEMENT', sub: 'A race seat', chip: 'Race seat', bank: ['signing', null] };
}
// (the fields of an offer the sheet prints in their own places: anything else is listed plainly under them)
const KNOWN = new Set(['id', 'kind', 'team', 'tier', 'front', 'salary', 'years', 'role', 'winBonus', 'podiumBonus', 'bonuses', 'seatOf', 'seatName', 'replaces', 'expect', 'expects',
  'patience', 'from', 'next', 'expires', 'note', 'why', 'negotiable', 'releaseClause', 'buyoutFee', 'start', 'season', 'round', 'seen', 'at', 'made', 'ask', 'floor', 'base', 'terms', 'talked', 'walked']);
const human = (k) => String(k).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
/** the lines of an offer beyond the usual terms: negotiable, a release clause - and whatever else it carries, plainly */
function extrasOf(of) {
  const L = [];
  if (of.negotiable != null) L.push(['Negotiable', of.negotiable === true ? 'Yes: talked over at the table first' : of.negotiable === false ? 'No: as written' : String(of.negotiable)]);
  if (+of.buyoutFee) L.push(['Buyout', `${of.team} pay your current team's ${money(of.buyoutFee)} clause`]);
  if (of.releaseClause && (typeof of.releaseClause !== 'number' || of.releaseClause > 0)) L.push(['Release clause', typeof of.releaseClause === 'number' ? `${money(of.releaseClause)} to buy you out` : typeof of.releaseClause === 'object' ? Object.entries(of.releaseClause).map(([k, v]) => `${human(k)} ${typeof v === 'number' && v < 100 ? money(v) : v}`).join(', ') : String(of.releaseClause)]);
  if (of.expires && typeof of.expires === 'object' && of.expires.round != null) L.push(['Offer open until', `round ${of.expires.round}${of.expires.season ? `, ${of.expires.season}` : ''}`]);
  for (const [k, v] of Object.entries(of)) {
    if (KNOWN.has(k) || v == null || v === '' || typeof v === 'object' || typeof v === 'function') continue;
    L.push([human(k), typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)]);
  }
  return L.slice(0, 4);
}
/** the bonuses in words (an offer's own bonuses object, or its win and podium bonus) */
function bonusText(of) {
  if (of.bonuses && typeof of.bonuses === 'object') { const L = Object.entries(of.bonuses).filter(([, v]) => v).map(([k, v]) => `${typeof v === 'number' ? money(v) : v} ${human(k).toLowerCase()}`); if (L.length) return L.join(' · '); }
  if (typeof of.bonuses === 'string' && of.bonuses) return of.bonuses;
  const L = []; if (+of.winBonus) L.push(`${money(of.winBonus)} a win`); if (+of.podiumBonus) L.push(`${money(of.podiumBonus)} a podium`);
  return L.join(' · ') || 'None';
}
/**
 * The contract as printed: the team's band in its colours, the title, the terms in big type (salary, length, standing,
 * whose seat it is), the bonuses, what the team expects and its patience, the note, anything else plainly, and the
 * signatures at the foot: the chief executive's already on it, yours waiting by a yellow SIGN HERE flag -> canvas
 */
function contractCanvas(of, T, K, me, c) {
  const cv = canvas(CW, CH), x = cv.getContext('2d'), P = 72, tc = T.color, ink = inkOn(tc), c2 = apart(tc, T.color2);
  x.fillStyle = '#fbfaf6'; x.fillRect(0, 0, CW, CH); grain(x, CW, CH, hash(`paper|${of.team}`));
  // the team's band: its colour, a slash of its second colour, its name
  x.fillStyle = tc; x.fillRect(0, 0, CW, 206);
  x.fillStyle = c2; x.globalAlpha = 0.9; x.beginPath(); x.moveTo(CW - 250, 0); x.lineTo(CW - 150, 0); x.lineTo(CW - 260, 206); x.lineTo(CW - 360, 206); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(CW - 120, 0); x.lineTo(CW - 80, 0); x.lineTo(CW - 190, 206); x.lineTo(CW - 230, 206); x.closePath(); x.fill(); x.globalAlpha = 1;
  x.fillStyle = ink; fitFont(x, T.name.toUpperCase(), 900, 84, CW - P * 2 - 260); x.fillText(T.name.toUpperCase(), P, 118);
  x.globalAlpha = 0.85; label(x, `${tierName(T.tier)} · ${K.chip}`, P, 168, ink, 25); x.globalAlpha = 1;
  x.fillStyle = shade(tc, 0.72); x.fillRect(0, 206, CW, 8);
  // the title and who it is between
  x.fillStyle = '#151a22'; fitFont(x, K.title, 800, 46, CW - P * 2); spaced(x, 2); x.fillText(K.title, P, 290); spaced(x, 0);
  x.fillStyle = '#5d6675'; fitFont(x, `${K.sub} · ${T.name} and ${me.name}`, 500, 27, CW - P * 2); x.fillText(`${K.sub} · ${T.name} and ${me.name}`, P, 330);
  x.fillStyle = '#d9dce1'; x.fillRect(P, 354, CW - P * 2, 2);
  // the terms, two by two
  const reserve = of.kind === 'reserve' || of.role === 'reserve', start = c?.seasonOver || of.next ? (c?.season || 2026) + 1 : c?.season || 2026;
  const yrs = Math.max(1, +of.years || 1), until = start + yrs - 1;
  const cell = (cx, cy, lab, val, sub, w = CW / 2 - P - 14) => {
    label(x, lab, cx, cy); x.fillStyle = '#151a22'; fitFont(x, val, 900, 62, w); x.fillText(val, cx, cy + 66);
    x.fillStyle = '#5d6675'; fitFont(x, sub, 500, 26, w); x.fillText(sub, cx, cy + 104);
  };
  const out = of.replaces || of.seatName;
  cell(P, 400, 'Salary', money(of.salary), 'a year, paid race by race');
  cell(CW / 2 + 14, 400, 'Length', reserve ? 'This season' : `${yrs} season${yrs > 1 ? 's' : ''}`, reserve ? 'a reserve role, renewed by the year' : `${start}${yrs > 1 ? `-${until}` : ''}`);
  cell(P, 548, 'Your standing', ROLE_NAME[of.role] || 'Equal status', reserve ? 'no race seat of your own' : of.role === 'lead' ? 'the car built around you' : of.role === 'support' ? 'the team-mate comes first' : 'the same car, the same calls');
  const renew = K.bank[1] === 'renew';
  cell(CW / 2 + 14, 548, 'Replaces', out ? String(out) : renew ? 'Nobody: you stay' : reserve ? 'Nobody' : 'An open seat', out ? 'makes way for you' : renew ? 'your seat, kept' : reserve ? 'you wait for your chance' : 'nobody makes way');
  x.fillStyle = '#d9dce1'; x.fillRect(P, 686, CW - P * 2, 2);
  // bonuses, what they expect, their patience - room kept for anything else the offer carries
  const extra = extrasOf(of);
  let y = 730;
  label(x, 'Bonuses', P, y); x.fillStyle = '#151a22'; fitFont(x, bonusText(of), 700, 36, CW - P * 2 - 180); x.fillText(bonusText(of), P + 180, y + 2);
  y += 54;
  const para = (lab, text, max = 3, size = 29) => {
    if (!text) return; label(x, lab, P, y); y += 38;
    x.font = `500 ${size}px ${FONT}`; x.fillStyle = '#20262f';
    for (const l of wrap(x, text, CW - P * 2, max)) { x.fillText(l, P, y); y += size + 8; }
    y += 10;
  };
  para('What they expect', of.expects || of.expect, 2);
  para('Their patience', of.patience, extra.length > 1 ? 2 : 3);
  const why = of.why || of.note;
  if (why) { x.font = `italic 500 26px ${SERIF}`; x.fillStyle = '#5d6675'; for (const l of wrap(x, `"${why}"`, CW - P * 2, 1)) { x.fillText(l, P, y); y += 34; } y += 4; }
  // anything else the offer carries: plainly, a line each (above the signatures' own space)
  for (const [k, v] of extra) { if (y > SIGLINE - 150) break; label(x, k, P, y, '#6b7480', 19); x.font = `600 24px ${FONT}`; x.fillStyle = '#20262f'; x.fillText(wrap(x, v, CW - P * 2 - 270, 1)[0] || '', P + 270, y + 1); y += 34; }
  // the signatures: the team's already there, yours by the flag
  const ly = SIGLINE;
  x.fillStyle = '#151a22'; x.fillRect(P, ly, 400, 2); x.fillRect(SIGBOX.x + 20, ly, CW - P - SIGBOX.x - 20, 2);
  signInto(x, `${pick(['K', 'M', 'A', 'J', 'S', 'L'], rng(hash(T.name)))}. ${pick(['Hartwell', 'Lindqvist', 'Moreau', 'Castell', 'Brandt', 'Okafor', 'Vance'], rng(hash(`ceo|${T.name}`)))}`, P + 14, ly - 120, 330, 112, '#1b1f2e', `team|${T.name}`);
  label(x, `For ${T.name}`, P, ly + 36, '#6b7480', 19); x.font = `500 21px ${FONT}`; x.fillStyle = '#8a929e'; x.fillText('Chief executive', P, ly + 64);
  label(x, 'The driver', SIGBOX.x + 20, ly + 36, '#6b7480', 19); x.font = `600 22px ${FONT}`; x.fillStyle = '#20262f'; x.fillText(me.name, SIGBOX.x + 20, ly + 66);
  x.fillStyle = '#9aa1ab'; x.font = `500 18px ${FONT}`; x.fillText(`Strictly private and confidential · ${T.name} · ${c?.season || 2026}`, P, CH - 36);
  return cv;
}
/** the letter that ends it: the team's letterhead, the words, the principal's signature -> canvas */
function letterCanvas(T, me, reason, who, c) {
  const cv = canvas(CW, CH), x = cv.getContext('2d'), P = 84;
  x.fillStyle = '#fcfcfa'; x.fillRect(0, 0, CW, CH); grain(x, CW, CH, hash(`letter|${T.name}`));
  x.fillStyle = T.color; x.fillRect(0, 0, CW, 26); x.fillStyle = apart('#fcfcfa', T.color); fitFont(x, T.name.toUpperCase(), 900, 60, CW - P * 2); x.fillText(T.name.toUpperCase(), P, 124);
  label(x, 'Formula 1 team · Racing department', P, 166, '#8a929e', 20);
  x.fillStyle = '#c8102e'; x.font = `900 24px ${FONT}`; spaced(x, 3); x.fillText('PRIVATE AND CONFIDENTIAL', P, 250); spaced(x, 0);
  x.fillStyle = '#20262f'; x.font = `500 28px ${FONT}`; x.fillText(`Round ${Math.max(1, (c?.round || 2) - 1)} · ${c?.season || 2026}`, P, 300);
  x.fillStyle = '#151a22'; fitFont(x, 'TERMINATION OF DRIVER AGREEMENT', 900, 50, CW - P * 2); x.fillText('TERMINATION OF DRIVER AGREEMENT', P, 392);
  x.font = `500 36px ${SERIF}`; x.fillStyle = '#20262f'; let y = 470;
  const para = (t) => { for (const l of wrap(x, t, CW - P * 2, 6)) { x.fillText(l, P, y); y += 48; } y += 20; };
  para(`Dear ${callName(me.name)},`);
  para(`This letter confirms that ${T.name} is ending your Driver Agreement with immediate effect.${reason ? ` ${reason}` : ''}`);
  para(who ? `${who} will drive the car from the next round. Your contract, and its salary, end today.` : 'Your race seat will be filled from the next round. Your contract, and its salary, end today.');
  para('We thank you for your work with the team, and wish you well for the rest of your career.');
  para('Yours sincerely,');
  signInto(x, `${pick(['R', 'D', 'T', 'G'], rng(hash(`tp|${T.name}`)))}. ${pick(['Ashby', 'Kerrigan', 'Voss', 'Delacroix', 'Mantovani'], rng(hash(`tp2|${T.name}`)))}`, P, y - 10, 330, 112, '#1b1f2e', `tp|${T.name}`);
  y += 130; x.fillStyle = '#151a22'; x.fillRect(P, y, 360, 2); x.font = `600 25px ${FONT}`; x.fillText('Team principal', P, y + 36);
  x.save(); x.translate(CW - 250, CH - 230); x.rotate(-0.22); x.strokeStyle = 'rgba(200,16,46,.72)'; x.lineWidth = 7; x.strokeRect(-150, -52, 300, 104);
  x.fillStyle = 'rgba(200,16,46,.72)'; x.font = `900 46px ${FONT}`; x.textAlign = 'center'; spaced(x, 4); x.fillText('TERMINATED', 0, 16); x.restore();
  return cv;
}
/** the front page of a paper with the story -> canvas (1024 x 1400) */
function paperCanvas(out, text, T, me, sub, n) {
  const cv = canvas(1024, 1400), x = cv.getContext('2d'), tab = out.kind === 'tabloid', P = 54, oc = hexOk(out.color, '#c8102e');
  x.fillStyle = tab ? '#fbfbf9' : '#f2eee3'; x.fillRect(0, 0, 1024, 1400); grain(x, 1024, 1400, hash(`news|${out.id}|${text}`), 1600, 0.05);
  // the masthead: a tabloid's red block, a broadsheet's black serif over a coloured rule
  if (tab) { x.fillStyle = oc; x.fillRect(0, 0, 1024, 190); x.fillStyle = '#fff'; fitFont(x, out.name.toUpperCase(), 900, 120, 1024 - P * 2, FONT); x.fillText(out.name.toUpperCase(), P, 140); }
  else { x.fillStyle = '#111'; x.textAlign = 'center'; fitFont(x, out.name, 900, 112, 1024 - P * 2, SERIF); x.fillText(out.name, 512, 132); x.textAlign = 'left'; x.fillStyle = oc; x.fillRect(P, 160, 1024 - P * 2, 8); }
  x.fillStyle = tab ? '#111' : '#333'; x.font = `700 22px ${FONT}`; spaced(x, 2); x.fillText(`ROUND ${Math.max(1, n?.round || 1)} · ${n?.season || 2026}`, P, 222); x.textAlign = 'right'; x.fillText(tab ? 'EXCLUSIVE' : 'MOTORSPORT', 1024 - P, 222); x.textAlign = 'left'; spaced(x, 0);
  x.fillStyle = '#222'; x.fillRect(P, 238, 1024 - P * 2, 3);
  // the headline: huge, wrapped
  const fam = tab ? FONT : SERIF, wgt = tab ? 900 : 800, HT = tab ? String(text).toUpperCase() : String(text);
  let size = tab ? 150 : 132, L = [];
  for (; size >= 52; size -= 6) { x.font = `${wgt} ${size}px ${fam}`; L = wrap(x, HT, 1024 - P * 2, 3); if (L.length && L.length <= 3 && !L[L.length - 1].endsWith('…')) break; }
  x.fillStyle = '#0d0f12'; let y = 250 + size;
  for (const l of L) { x.fillText(l, P, y); y += size * 1.04; }
  if (sub) { x.fillStyle = '#3a4048'; x.font = `italic 500 34px ${SERIF}`; for (const l of wrap(x, sub, 1024 - P * 2, 2)) { y += 4; x.fillText(l, P, y + 10); y += 44; } }
  // the photo: the team's colours, your helmet's shape and your number
  const py = y + 30, ph = Math.min(560, 1400 - py - 150);
  if (ph > 160) {
    const g = x.createLinearGradient(P, py, 1024 - P, py + ph); g.addColorStop(0, shade(T.color, 0.55)); g.addColorStop(0.6, T.color); g.addColorStop(1, shade(T.color, 1.25));
    x.fillStyle = g; x.fillRect(P, py, 1024 - P * 2, ph);
    x.save(); x.beginPath(); x.rect(P, py, 1024 - P * 2, ph); x.clip();
    x.globalAlpha = 0.25; x.fillStyle = apart(T.color, T.color2); x.font = `italic 900 ${ph * 0.9}px ${FONT}`; x.fillText(String(me.number), 1024 - P - ph * 1.1, py + ph * 0.86); x.globalAlpha = 1;
    for (let k = 0; k < 9; k++) { x.fillStyle = `rgba(255,255,255,${0.04 + 0.03 * (k % 3)})`; x.fillRect(P, py + ph * (0.1 + k * 0.09), 1024 - P * 2, 3 + (k % 2) * 4); }
    helmetSide(x, 300, py + ph * 0.56, ph * 0.4, me.helmet, T.color);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(P, py + ph - 46, 1024 - P * 2, 46); x.fillStyle = '#fff'; x.font = `600 22px ${FONT}`; x.fillText(`${me.name} · ${T.name}`, P + 16, py + ph - 16);
    x.restore();
  }
  // and the columns under it
  x.fillStyle = 'rgba(40,40,40,.32)'; const cy = (ph > 160 ? py + ph : y) + 34, cols = 3, cw = (1024 - P * 2 - 40) / cols;
  for (let k = 0; k < cols; k++) for (let r = 0; cy + r * 24 < 1370; r++) x.fillRect(P + k * (cw + 20), cy + r * 24, cw * (r % 7 === 6 ? 0.6 : 1), 9);
  return cv;
}
/** a racing helmet from the side (facing right) at (cx, cy), r its size: the shell, the chin, the visor, a stripe */
function helmetSide(x, cx, cy, r, shell, stripe) {
  x.save(); x.translate(cx, cy);
  x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.ellipse(r * 0.05, r * 0.98, r * 1.05, r * 0.14, 0, 0, Math.PI * 2); x.fill();
  const outline = () => { x.beginPath(); x.moveTo(-r * 0.92, r * 0.42); x.bezierCurveTo(-r * 1.08, -r * 0.55, -r * 0.35, -r * 1.02, r * 0.28, -r * 0.92); x.bezierCurveTo(r * 0.86, -r * 0.82, r * 1.12, -r * 0.3, r * 1.06, r * 0.2); x.lineTo(r * 0.98, r * 0.62); x.bezierCurveTo(r * 0.7, r * 0.84, r * 0.1, r * 0.86, -r * 0.42, r * 0.8); x.bezierCurveTo(-r * 0.72, r * 0.76, -r * 0.88, r * 0.62, -r * 0.92, r * 0.42); x.closePath(); };
  const g = x.createLinearGradient(0, -r, 0, r); g.addColorStop(0, shade(shell, 1.25)); g.addColorStop(0.55, shell); g.addColorStop(1, shade(shell, 0.6));
  outline(); x.fillStyle = g; x.fill();
  x.save(); outline(); x.clip();
  x.fillStyle = stripe; x.beginPath(); x.moveTo(-r * 1.2, -r * 0.05); x.bezierCurveTo(-r * 0.3, -r * 0.35, r * 0.4, -r * 0.4, r * 1.2, -r * 0.62); x.lineTo(r * 1.2, -r * 0.42); x.bezierCurveTo(r * 0.4, -r * 0.2, -r * 0.3, -r * 0.12, -r * 1.2, r * 0.18); x.closePath(); x.fill();
  x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(-r * 1.2, r * 0.56, r * 2.4, r * 0.4);
  x.restore();
  // (the visor: a dark band with a highlight)
  x.fillStyle = '#0b0c10'; x.beginPath(); x.moveTo(r * 0.12, -r * 0.3); x.bezierCurveTo(r * 0.5, -r * 0.42, r * 0.92, -r * 0.34, r * 1.04, -r * 0.08); x.lineTo(r * 1.02, r * 0.16); x.bezierCurveTo(r * 0.7, r * 0.16, r * 0.3, r * 0.12, r * 0.12, r * 0.04); x.closePath(); x.fill();
  x.fillStyle = 'rgba(255,255,255,.28)'; x.beginPath(); x.moveTo(r * 0.3, -r * 0.3); x.bezierCurveTo(r * 0.55, -r * 0.36, r * 0.8, -r * 0.3, r * 0.92, -r * 0.18); x.lineTo(r * 0.86, -r * 0.12); x.bezierCurveTo(r * 0.7, -r * 0.24, r * 0.5, -r * 0.26, r * 0.32, -r * 0.22); x.closePath(); x.fill();
  x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-r * 0.3, -r * 0.6, r * 0.35, r * 0.12, -0.35, 0, Math.PI * 2); x.fill();
  x.restore();
}
/** a phone's screen with a post on it -> canvas (600 x 1200) */
function phoneCanvas(post, T, me) {
  const cv = canvas(600, 1200), x = cv.getContext('2d');
  x.fillStyle = '#0f1115'; x.fillRect(0, 0, 600, 1200);
  x.fillStyle = '#fff'; x.font = `600 24px ${FONT}`; x.fillText('9:41', 40, 54); x.textAlign = 'right'; x.fillText('100%', 560, 54); x.textAlign = 'left';
  x.fillStyle = hexOk(post.color, '#00b3a4'); x.font = `900 40px ${FONT}`; x.fillText(post.app || 'Chequered', 40, 130);
  x.fillStyle = '#272b33'; x.fillRect(0, 160, 600, 2);
  // the post: who, the words, the picture, the counts
  const av = post.avatar || T.color; x.fillStyle = av; x.beginPath(); x.arc(78, 236, 38, 0, Math.PI * 2); x.fill();
  x.fillStyle = inkOn(av); x.font = `900 30px ${FONT}`; x.textAlign = 'center'; x.fillText(post.initials || T.name.slice(0, 2).toUpperCase(), 78, 247); x.textAlign = 'left';
  x.fillStyle = '#fff'; x.font = `800 28px ${FONT}`; x.fillText(post.who || T.name, 134, 228); x.fillStyle = '#8b93a1'; x.font = `500 24px ${FONT}`; x.fillText(post.handle || `@${T.name.replace(/\W+/g, '').toLowerCase()}`, 134, 262);
  x.fillStyle = '#eef1f5'; x.font = `500 33px ${FONT}`; let y = 340; for (const l of wrap(x, post.text, 520, 5)) { x.fillText(l, 40, y); y += 44; }
  const iy = y + 10, ih = 400, g = x.createLinearGradient(40, iy, 560, iy + ih); g.addColorStop(0, shade(T.color, 0.6)); g.addColorStop(1, T.color);
  x.fillStyle = g; x.fillRect(40, iy, 520, ih);
  x.fillStyle = apart(T.color, T.color2); x.font = `900 30px ${FONT}`; spaced(x, 6); x.fillText(post.tag || 'OFFICIAL', 70, iy + 64); spaced(x, 0);
  fitFont(x, last(me.name).toUpperCase(), 900, 96, 460); x.fillText(last(me.name).toUpperCase(), 70, iy + 200);
  x.font = `italic 900 150px ${FONT}`; x.globalAlpha = 0.9; x.fillText(String(me.number), 70, iy + 360); x.globalAlpha = 1;
  x.fillStyle = '#8b93a1'; x.font = `600 26px ${FONT}`; y = iy + ih + 54;
  x.fillText(`♥ ${post.likes || '48.2K'}`, 40, y); x.fillText(`⟲ ${post.shares || '9.1K'}`, 230, y); x.fillText(`✉ ${post.replies || '3.4K'}`, 420, y);
  x.fillStyle = '#272b33'; x.fillRect(0, y + 30, 600, 2);
  x.fillStyle = '#5d6675'; x.font = `500 24px ${FONT}`; for (const l of wrap(x, post.reply || '', 520, 3)) { y += 40; x.fillText(l, 40, y + 40); }
  return cv;
}
/** the back of the team's shirt: blank, or printed with your name and number -> canvas (1024 x 1024; the shirt's bounds) */
function shirtCanvas(T, me, printed) {
  const cv = canvas(1024, 1024), x = cv.getContext('2d'), tc = T.color, c2 = apart(tc, T.color2);
  x.fillStyle = tc; x.fillRect(0, 0, 1024, 1024);
  // the yoke across the shoulders and the side panels in the second colour; a knit's faint lines
  x.fillStyle = shade(tc, 0.82); x.fillRect(0, 0, 1024, 200); x.fillStyle = c2; x.fillRect(0, 200, 1024, 12);
  x.fillStyle = shade(tc, 0.86); x.fillRect(0, 300, 170, 724); x.fillRect(1024 - 170, 300, 170, 724);
  x.globalAlpha = 0.05; x.fillStyle = '#000'; for (let i = 0; i < 1024; i += 6) x.fillRect(0, i, 1024, 2); x.globalAlpha = 1;
  if (printed) {
    const pc = c2, name = last(me.name).toUpperCase();
    x.fillStyle = pc; x.textAlign = 'center';
    fitFont(x, name, 900, 120, 600, COND); spaced(x, 10); x.fillText(name, 512, 390); spaced(x, 0);
    x.font = `900 400px ${COND}`; x.fillText(String(me.number), 512, 790);
    x.strokeStyle = shade(tc, 0.6); x.lineWidth = 6; x.strokeText(String(me.number), 512, 790);
    x.font = `800 30px ${FONT}`; spaced(x, 8); x.fillText(T.name.toUpperCase(), 512, 900); spaced(x, 0); x.textAlign = 'left';
  }
  return cv;
}
/** the SIGN HERE flag: a yellow tab with its arrow -> canvas */
function flagCanvas() {
  const cv = canvas(256, 64), x = cv.getContext('2d');
  x.fillStyle = '#ffd23a'; x.beginPath(); x.moveTo(256, 6); x.lineTo(30, 6); x.lineTo(4, 32); x.lineTo(30, 58); x.lineTo(256, 58); x.closePath(); x.fill();
  x.fillStyle = '#5a4300'; x.font = `900 24px ${FONT}`; spaced(x, 2); x.fillText('SIGN HERE', 46, 41);
  return cv;
}
/** a step-and-repeat for the photographers: the team's name over and over -> canvas (1024 x 512, tiled) */
function wallCanvas(T) {
  const cv = canvas(1024, 512), x = cv.getContext('2d'), bg = lum(T.color) > 0.5 ? shade(T.color, 0.25) : '#f4f5f7', ink = apart(bg, T.color);
  x.fillStyle = bg; x.fillRect(0, 0, 1024, 512);
  // (two rows, the second offset by half: each name drawn either side of the edge too, so the tiles meet without a seam)
  x.textAlign = 'center'; fitFont(x, T.name.toUpperCase(), 900, 64, 400);
  for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) {
    const cx = 256 + k * 512 + (r ? 256 : 0), cy = 128 + r * 256;
    for (const dx of [0, -1024, 1024]) { x.fillStyle = ink; x.fillText(T.name.toUpperCase(), cx + dx, cy + 10); x.fillStyle = apart(bg, T.color2 === '#ffffff' ? T.color : T.color2); x.fillRect(cx + dx - 120, cy + 30, 240, 8); }
  }
  x.textAlign = 'left';
  return cv;
}
/** a soft round spot (shadows under things on the table, steam) -> texture */
function blobTex(inner = 'rgba(0,0,0,0.55)', outer = 'rgba(0,0,0,0)') {
  const cv = canvas(128, 128), x = cv.getContext('2d'), g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, inner); g.addColorStop(1, outer); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); return t;
}

// ---- 3D pieces ----------------------------------------------------------------------------------------------------------
const std = (color, roughness = 0.6, metalness = 0, o = {}) => new THREE.MeshStandardMaterial({ color, roughness, metalness, ...o });
const box = (w, h, d, m, x = 0, y = 0, z = 0) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); return b; };
const cyl = (r0, r1, h, m, seg = 20) => new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), m);
/** a capsule from a to b (radius r) */
function limb(a, b, r, m) {
  const d = new THREE.Vector3().subVectors(b, a), L = d.length(), g = new THREE.CapsuleGeometry(r, Math.max(0.001, L), 6, 14), mesh = new THREE.Mesh(g, m);
  mesh.position.copy(a).addScaledVector(d, 0.5); mesh.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize()); return mesh;
}
/** an ellipsoid of half-sizes (sx, sy, sz) at p, its y axis along dir */
function blob(p, sx, sy, sz, m, dir = null) { const g = new THREE.SphereGeometry(1, 18, 14); g.scale(sx, sy, sz); const mesh = new THREE.Mesh(g, m); mesh.position.copy(p); if (dir) mesh.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize()); return mesh; }
/** a flat shape with rounded corners (w x h, radius r) in the xy plane */
function rounded(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
/** a fountain pen, its nib at the origin, along +y: black resin, gold bands, a clip */
function makePen() {
  const g = new THREE.Group(), resin = std('#101114', 0.22, 0.35), gold = std('#d6b25e', 0.25, 0.9), steel = std('#c9ccd2', 0.2, 0.95);
  const nib = new THREE.Mesh(new THREE.ConeGeometry(0.0042, 0.016, 14), steel); nib.position.y = 0.008; g.add(nib);
  const sec = cyl(0.0052, 0.0044, 0.022, resin); sec.position.y = 0.027; g.add(sec);
  const band = cyl(0.0058, 0.0058, 0.003, gold); band.position.y = 0.04; g.add(band);
  const body = cyl(0.0062, 0.0058, 0.105, resin); body.position.y = 0.094; g.add(body);
  const cap = cyl(0.0058, 0.0046, 0.012, resin); cap.position.y = 0.152; g.add(cap);
  const band2 = cyl(0.0064, 0.0064, 0.004, gold); band2.position.y = 0.12; g.add(band2);
  const clip = box(0.0016, 0.05, 0.003, gold, 0, 0.12, 0.0066); g.add(clip);
  return g;
}
/**
 * Your hand from your own eyes, a pen in it (or an open hand for a handshake: pen false): the nib (or the palm) at the
 * origin; the hand coming in from the lower right, the sleeve running off toward the camera. -> group
 */
function makeHand(skin, sleeve, o = {}) {
  const g = new THREE.Group(), sk = std(skin, 0.6), sl = std(sleeve, 0.78), cuff = std('#f2f2ee', 0.7);
  const add = (...m) => { for (const x of m) g.add(x); };
  if (o.pen !== false) {
    // the pen held at about 45 degrees, leaning back toward you and a little to the right; its top (n), the thumb's side (s)
    const d = V3(0.3, 0.7, 0.64).normalize(), pen = makePen(); pen.quaternion.setFromUnitVectors(V3(0, 1, 0), d); g.add(pen);
    const s = new THREE.Vector3().crossVectors(d, V3(0, 1, 0)).normalize(), n = new THREE.Vector3().crossVectors(s, d).normalize();
    const at = (k, a = 0, b = 0) => d.clone().multiplyScalar(k).addScaledVector(s, a).addScaledVector(n, b);
    // the index finger along the pen's top to the grip; the thumb on its near side; the middle finger under it; the
    // ring and little fingers curled into the palm; the back of the hand behind them, the wrist low toward the table
    add(limb(at(0.032, -0.002, 0.008), at(0.058, -0.004, 0.017), 0.0068, sk), limb(at(0.058, -0.004, 0.017), at(0.082, -0.012, 0.026), 0.0076, sk));
    add(limb(at(0.036, 0.009, 0.0), at(0.06, 0.022, -0.002), 0.0078, sk), limb(at(0.06, 0.022, -0.002), at(0.08, 0.03, -0.012), 0.0088, sk));
    add(limb(at(0.03, -0.009, -0.006), at(0.062, -0.026, -0.012), 0.0068, sk));
    add(blob(at(0.062, -0.036, -0.016), 0.012, 0.016, 0.01, sk, d), blob(at(0.068, -0.044, -0.012), 0.01, 0.014, 0.009, sk, d));
    add(blob(at(0.086, -0.026, 0.006), 0.026, 0.04, 0.018, sk, d));
    const wr = at(0.112, -0.04, -0.006), el = wr.clone().add(V3(0.15, -0.06, 0.26)), dir = el.clone().sub(wr).normalize();
    add(limb(at(0.09, -0.03, 0.0), wr, 0.021, sk));
    add(limb(wr.clone().addScaledVector(dir, 0.012), wr.clone().addScaledVector(dir, 0.04), 0.026, cuff));
    add(limb(wr.clone().addScaledVector(dir, 0.038), el, 0.034, sl));
  } else {
    // an open hand held out (toward -z): the palm upright, the thumb up, the fingers forward
    add(blob(V3(0, 0, 0), 0.016, 0.042, 0.048, sk));
    for (let i = 0; i < 4; i++) { const y = 0.024 - i * 0.016, a = V3(-0.004, y, -0.04), b = V3(-0.01, y - 0.004, -0.085 + i * 0.008); add(limb(a, b, 0.0072, sk)); }
    add(limb(V3(-0.012, 0.03, -0.004), V3(-0.022, 0.058, -0.036), 0.0085, sk));
    const wr = V3(0.006, -0.006, 0.05), el = V3(0.13, -0.16, 0.42);
    add(limb(V3(0, 0, 0.02), wr, 0.022, sk), limb(wr, wr.clone().lerp(el, 0.08), 0.027, cuff), limb(wr.clone().lerp(el, 0.07), el, 0.036, sl));
  }
  g.traverse((m) => { if (m.isMesh) m.castShadow = false; });
  return g;
}
/** a person stood in a set (kept apart: disposed by its own dispose - its face's paint is People's to give back) */
function person(set, opts, at = [0, 0, 0], yaw = 0) {
  const p = safe(() => makePerson({ jitter: 0, ...opts })); if (!p) return null;
  p.group.position.set(at[0], at[1], at[2]); p.group.rotation.y = yaw; p.group.userData.person = true;
  p.group.traverse((m) => { if (m.isMesh) m.castShadow = false; });
  set.scene.add(p.group); set.people.push(p); return p;
}
/** the team's chief executive (invented: career/Paddock.js) as makePerson options in a pose -> { opts, name, title } | null */
function ceoOf(c, team, pose) {
  return safe(() => {
    const R = paddockRoster({ playerId: c?.playerId, myTeam: team, home: c?.paddockHome || team, teams: Object.keys(c?.teams || {}) });
    const P = makePaddock(R.ceo, team); if (!P) return null;
    return { opts: { ...celebLook(P, { occasion: 'grid' }), pose }, name: P.name, title: 'Chief executive' };
  });
}
/** a team principal: generic, unnamed, in the team's polo - the same face, skin and hair each time (People draws skin
 *  and hair at random unless told) -> makePerson options */
const principalOf = (T, pose) => { const id = `principal|${T.name}`, B = baseLook(id); return { pose, kit: 'polo', color: T.color, accent: T.color2, teamName: T.name, seed: id, skin: B.skin, hair: B.hair, style: B.style, build: 'average' }; };
/**
 * A new set: { scene, people, extra (textures of its own to let go), comp (its shaders compiling), dispose() } -
 * disposed once however often asked (a person's dispose gives its face's paint back to People's cache: twice would
 * give it back twice), and never while its shaders compile (three's compileAsync reads each material's program while
 * it waits: a material disposed under it throws) - then as soon as that settles
 */
function newSet(bg = '#121317') {
  const S = new THREE.Scene(); S.background = new THREE.Color(bg);
  return { scene: S, people: [], extra: [], gone: false, comp: null, dispose() {
    if (this.gone) return;
    if (this.comp) { if (!this.later) { this.later = true; this.comp.then(() => { this.comp = null; this.dispose(); }); } return; }
    this.gone = true;
    for (const p of this.people) safe(() => p.dispose());
    const seen = new Set(), walk = (o) => {
      // (a person's own meshes are its own dispose's)
      if (o.userData?.person) return;
      if (o.isMesh || o.isSprite) {
        o.geometry?.dispose();
        for (const m of [].concat(o.material || [])) { if (seen.has(m)) continue; seen.add(m); for (const k of ['map', 'alphaMap', 'emissiveMap']) m[k]?.dispose?.(); m.dispose(); }
      }
      for (const ch of o.children) walk(ch);
    };
    walk(S);
    for (const t of this.extra) safe(() => t.dispose?.());
    S.clear();
  } };
}
/** the room: a warm floor, walls, a window onto the paddock, the long table, chairs, pendant lamps; accent: a stripe and a word on the wall */
function meetingRoom(set, o = {}) {
  const S = set.scene, L = o.len || 2.4, acc = hexOk(o.accent, '#9aa3b2');
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), std('#5a4535', 0.55)); floor.rotation.x = -Math.PI / 2; S.add(floor);
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(L + 1.6, 3.0), std('#2a2c31', 0.95)); rug.rotation.x = -Math.PI / 2; rug.position.y = 0.003; S.add(rug);
  const wallM = std('#e8e4dd', 0.92), back = new THREE.Mesh(new THREE.PlaneGeometry(16, 5), wallM); back.position.set(0, 2.5, -2.3); S.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallM); left.position.set(-L / 2 - 2.2, 2.5, 0); left.rotation.y = Math.PI / 2; S.add(left);
  const right = left.clone(); right.position.x = L / 2 + 2.2; right.rotation.y = -Math.PI / 2; S.add(right);
  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.12), new THREE.MeshBasicMaterial({ color: acc })); stripe.position.set(0, 1.12, -2.29); S.add(stripe);
  // the window: the paddock by day, or the night's lights
  const wcv = canvas(512, 256), wx = wcv.getContext('2d'), wg = wx.createLinearGradient(0, 0, 0, 256);
  if (o.night) { wg.addColorStop(0, '#0b1230'); wg.addColorStop(0.7, '#3a2a55'); wg.addColorStop(1, '#f2a65a'); } else { wg.addColorStop(0, '#8ec5ff'); wg.addColorStop(0.7, '#dcefff'); wg.addColorStop(1, '#b9c2b0'); }
  wx.fillStyle = wg; wx.fillRect(0, 0, 512, 256);
  // (the motorhomes over the way: blocks of colour, low and long)
  const R = rng(hash(o.word || 'room')); for (let i = 0; i < 9; i++) { wx.fillStyle = `hsla(${R() * 360},${20 + R() * 40}%,${o.night ? 25 : 70}%,.9)`; const w = 40 + R() * 90; wx.fillRect(i * 60 - 20, 170 + R() * 30, w, 90); }
  const win = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.5), new THREE.MeshBasicMaterial({ map: texOf(wcv) })); win.position.set(-0.6, 2.0, -2.28); S.add(win);
  const frameM = std('#2b2d33', 0.4, 0.5);
  for (const [w, h, x, y] of [[3.5, 0.05, -0.6, 2.75], [3.5, 0.05, -0.6, 1.25], [0.05, 1.55, -2.33, 2.0], [0.05, 1.55, 1.13, 2.0], [0.04, 1.5, -0.6, 2.0]]) S.add(box(w, h, 0.04, frameM, x, y, -2.27));
  // a word on the wall: the team's name, or the room's
  if (o.word) {
    const cv = canvas(1024, 192), x = cv.getContext('2d'); x.fillStyle = acc; x.textAlign = 'center'; fitFont(x, o.word.toUpperCase(), 900, 130, 1000); x.fillText(o.word.toUpperCase(), 512, 140);
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.49), new THREE.MeshBasicMaterial({ map: texOf(cv), transparent: true })); wm.position.set(2.1, 2.2, -2.28); S.add(wm);
  }
  // the table and its chairs
  const D = o.depth || 1.3, top = box(L, 0.05, D, std(o.tableColor || '#33261e', 0.34, 0.12), 0, 0.715, 0); S.add(top);
  const edge = box(L + 0.004, 0.012, D + 0.004, std('#1c1612', 0.5), 0, 0.689, 0); S.add(edge);
  const steel = std('#9aa0a8', 0.3, 0.8);
  for (const [lx, lz] of [[-L / 2 + 0.12, -D / 2 + 0.13], [L / 2 - 0.12, -D / 2 + 0.13], [-L / 2 + 0.12, D / 2 - 0.13], [L / 2 - 0.12, D / 2 - 0.13]]) { const leg = cyl(0.025, 0.025, 0.69, steel, 10); leg.position.set(lx, 0.345, lz); S.add(leg); }
  const seatM = std('#1d1f24', 0.7);
  const chair = (cx, cz, face) => {
    const c = new THREE.Group(); c.add(box(0.5, 0.07, 0.5, seatM, 0, 0.46, 0)); c.add(box(0.5, 0.55, 0.06, seatM, 0, 0.78, -0.24)); const p = cyl(0.03, 0.03, 0.44, steel, 8); p.position.y = 0.22; c.add(p);
    c.position.set(cx, 0, cz); c.rotation.y = face; S.add(c); return c;
  };
  for (const cx of o.chairs || [-0.7, 0.7]) chair(cx, -D / 2 - 0.3, 0);
  // the lamps over it, and the light: warm from above, the window's daylight, a soft fill
  const shadeM = std('#1e2024', 0.5, 0.3), glow = new THREE.MeshBasicMaterial({ color: '#fff2d8' });
  for (const lx of [-L / 4, L / 4]) {
    const sh = cyl(0.05, 0.22, 0.16, shadeM, 24); sh.position.set(lx, 1.92, 0); S.add(sh);
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), glow); d.rotation.x = Math.PI / 2; d.position.set(lx, 1.835, 0); S.add(d);
    const wire = cyl(0.004, 0.004, 1.2, shadeM, 4); wire.position.set(lx, 2.6, 0); S.add(wire);
    const pl = new THREE.PointLight(0xffd9a8, 4.2, 4.5, 2); pl.position.set(lx, 1.75, 0); S.add(pl);
  }
  S.add(new THREE.HemisphereLight(0xfff1e0, 0x3a3027, 0.95));
  const key = new THREE.DirectionalLight(0xfff0dc, 1.25); key.position.set(1.4, 3.6, 2.6); S.add(key);
  const winL = new THREE.DirectionalLight(o.night ? 0x8a8fe0 : 0xd8ecff, o.night ? 0.35 : 0.7); winL.position.set(-0.6, 2.2, -3); S.add(winL);
  return { top: 0.74, chair };
}

// ---- the stage: the overlay, the renderer, the camera, the clock ------------------------------------------------------
const CSS = `
#cscene { position: fixed; inset: 0; z-index: 46; background: #0e0f12; color: #fff; font-family: var(--k-font, 'Segoe UI', Arial, sans-serif); overflow: hidden; --tc: #e10600; user-select: none; -webkit-user-select: none; touch-action: none; }
#cscene .cs-3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#cscene .cs-fade, #cscene .cs-flash { position: absolute; inset: 0; pointer-events: none; background: #000; opacity: 0; }
#cscene .cs-flash { background: #fff; }
#cscene .cs-ui { position: absolute; inset: 0; pointer-events: none; }
#cscene .cs-ui > * { pointer-events: auto; }
#cscene button { font: 800 12px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .1em; cursor: pointer; border-radius: 12px; border: 1px solid rgba(255,255,255,.22); background: rgba(16,18,24,.78); color: #fff; padding: 0 16px; height: 44px; transition: transform 90ms ease, background-color 120ms; }
#cscene button:hover { background: rgba(32,36,46,.9); } #cscene button:active { transform: scale(.97); }
#cscene button.go { background: var(--tc); border-color: var(--tc); color: var(--tc-ink, #fff); }
#cscene .cs-top { position: absolute; left: 16px; top: 14px; right: 16px; display: flex; gap: 8px; align-items: center; pointer-events: none; font: 800 12px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .16em; }
#cscene .cs-top b { background: var(--tc); color: var(--tc-ink, #fff); padding: 8px 10px; border-radius: 7px; white-space: nowrap; }
#cscene .cs-top span { background: rgba(0,0,0,.55); padding: 8px 10px; border-radius: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
#cscene .cs-bar { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); width: min(760px, calc(100% - 24px)); display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 8px 12px; align-items: center;
  padding: 12px 14px; border-radius: 18px; background: rgba(12,14,18,.82); box-shadow: 0 18px 40px rgba(0,0,0,.35); }
#cscene .cs-sum { min-width: 0; display: grid; gap: 4px; }
#cscene .cs-sum small { font: 800 10.5px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .16em; color: #9aa3b2; }
#cscene .cs-sum b { font: 800 18px/1.15 var(--k-font, 'Segoe UI', Arial, sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#cscene .cs-sum span { font: 600 13px/1.25 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #d5dae2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#cscene .cs-acts { display: flex; gap: 8px; }
#cscene .cs-acts .go { min-width: 150px; }
#cscene .cs-hint { grid-column: 1 / -1; font: 600 11.5px/1.2 var(--k-font, 'Segoe UI', Arial, sans-serif); color: #8a93a2; letter-spacing: .02em; }
#cscene .cs-dots { display: inline-flex; gap: 6px; margin-left: 8px; vertical-align: 2px; } #cscene .cs-dots i { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.3); } #cscene .cs-dots i.on { background: var(--tc); box-shadow: 0 0 0 2px rgba(255,255,255,.7); }
#cscene .cs-arrow { position: absolute; top: 50%; width: 52px; height: 52px; margin-top: -40px; padding: 0; border-radius: 50%; font-size: 26px; letter-spacing: 0; }
#cscene .cs-arrow.l { left: 12px; } #cscene .cs-arrow.r { right: 12px; } #cscene .cs-arrow:disabled { opacity: .25; cursor: default; }
#cscene .cs-skip { position: absolute; right: 16px; bottom: 16px; font: 700 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .14em; color: rgba(255,255,255,.75); background: rgba(0,0,0,.45); padding: 9px 12px; border-radius: 8px; pointer-events: none; }
#cscene .cs-cap { position: absolute; left: 50%; bottom: 64px; transform: translateX(-50%); width: min(680px, calc(100% - 32px)); text-align: center; pointer-events: none; opacity: 0; }
#cscene .cs-cap.on { opacity: 1; }
#cscene .cs-cap small { display: block; font: 800 11px/1 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .18em; color: #c8ced8; margin-bottom: 8px; text-transform: uppercase; }
#cscene .cs-cap p { margin: 0; display: inline-block; font: 500 clamp(17px, 2.2vw, 23px)/1.35 Georgia, 'Times New Roman', serif; background: rgba(0,0,0,.6); padding: 10px 16px; border-radius: 12px; min-height: 1.35em; }
#cscene .cs-photo { position: absolute; left: 50%; top: 47%; width: min(56vw, 62vh); transform: translate(-50%, -50%) rotate(-3deg) scale(.9); background: #fdfdfb; padding: 12px 12px 62px; box-shadow: 0 30px 60px rgba(0,0,0,.5); opacity: 0; transition: opacity .3s ease, transform .5s cubic-bezier(.2,.8,.2,1); pointer-events: none; }
#cscene .cs-photo.on { opacity: 1; transform: translate(-50%, -50%) rotate(-3deg); }
#cscene .cs-photo img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #222; }
#cscene .cs-photo p { position: absolute; left: 14px; right: 14px; bottom: 12px; margin: 0; color: #20262f; font: 600 clamp(13px, 1.6vw, 17px)/1.25 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#cscene .cs-photo p small { display: block; font: 600 clamp(10px, 1.2vw, 12.5px)/1.3 var(--k-font, 'Segoe UI', Arial, sans-serif); letter-spacing: .08em; color: #6b7480; text-transform: uppercase; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 640px) {
  #cscene .cs-bar { grid-template-columns: 1fr; bottom: 10px; padding: 10px; }
  #cscene .cs-acts > * { flex: 1; } #cscene .cs-acts .go { min-width: 0; }
  #cscene .cs-hint { display: none; }
  #cscene .cs-arrow { width: 46px; height: 46px; margin-top: -60px; }
  #cscene .cs-top span { display: none; }
  #cscene .cs-photo { width: 84vw; }
}
@media (max-height: 460px) { #cscene .cs-hint { display: none; } #cscene .cs-bar { padding: 8px 12px; } #cscene .cs-sum b { font-size: 15px; } }
`;
// (the cutscene that is up, for the test console: its stage, its beat, step(dt) to run it by hand, skip(), all())
let LIVE = null;
class Stage {
  /** o: { renderer (the hub's, lent; default: the hub showroom's), color (the team's: the buttons) } */
  constructor(o = {}) {
    ensureMotion();
    if (!document.getElementById('cscene-css')) { const st = document.createElement('style'); st.id = 'cscene-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'cscene';
    el.innerHTML = '<div class="cs-fade" style="opacity:1"></div><div class="cs-flash"></div><div class="cs-ui"></div>';
    this.ui = el.querySelector('.cs-ui'); this.fadeEl = el.querySelector('.cs-fade'); this.flashEl = el.querySelector('.cs-flash');
    this.color(o.color || '#e10600');
    document.body.appendChild(el);
    const hub = (typeof window !== 'undefined' && window.__careerRoom) || null, R0 = o.renderer || hub?.renderer || null;
    try {
      if (R0) {
        // (the hub's renderer, lent: its canvas moves in here; its studio stops drawing; all of it noted to be put back)
        const cv = R0.domElement; this.R = R0; this.canvas = cv; this.shared = true; this.hub = hub && hub.renderer === R0 ? hub : null;
        this.back = { parent: cv.parentNode, next: cv.nextSibling, cls: cv.className, tm: R0.toneMapping, ex: R0.toneMappingExposure, size: R0.getSize(new THREE.Vector2()), pr: R0.getPixelRatio(), cc: R0.getClearColor(new THREE.Color()), ca: R0.getClearAlpha() };
        this.hubOn = !!this.hub?.on; this.hub?.stop?.();
        cv.className = 'cs-3d'; el.prepend(cv);
      } else {
        this.canvas = document.createElement('canvas'); this.canvas.className = 'cs-3d'; el.prepend(this.canvas);
        this.R = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true }); this.R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      }
    } catch (e) { el.remove(); throw e; }
    this.R.toneMapping = THREE.ACESFilmicToneMapping; this.R.toneMappingExposure = 1.0;
    this.cam = new THREE.PerspectiveCamera(40, 1, 0.02, 80);
    this.set = null; this.on = true; this.hold = false; this.tick = null; this.fade = 1; this.flash = 0; this.shake = 0; this.tt = 0; this.comps = new Set();
    const loop = (now) => { if (!this.on) return; this.raf = requestAnimationFrame(loop); if (this.hold) return; this.step(Math.min(0.1, Math.max(0, (now - (this.last ?? now)) / 1000))); this.last = now; };
    this.raf = requestAnimationFrame(loop);
    // (a page whose frames do not come - a busy machine, a headless one: the clock still runs, slower)
    this.dog = setInterval(() => { if (!this.on || this.hold || document.hidden) return; const now = performance.now(); if (now - (this.lastStep || 0) > 400) { this.step(Math.min(0.1, (now - (this.last ?? now)) / 1000)); this.last = now; } }, 200);
  }
  color(tc) { this.el.style.setProperty('--tc', tc); this.el.style.setProperty('--tc-ink', inkOn(tc)); }
  get w() { return this.canvas.clientWidth || innerWidth; }
  get h() { return this.canvas.clientHeight || innerHeight; }
  get aspect() { return this.w / Math.max(1, this.h); }
  /** one frame: the beat's own update (the set, the camera), then drawn */
  step(dt) {
    if (!this.on) return; this.lastStep = performance.now(); this.tt += dt;
    const c = this.canvas, w = this.w, h = this.h, pr = this.R.getPixelRatio();
    if (c.width !== Math.floor(w * pr) || c.height !== Math.floor(h * pr)) this.R.setSize(w, h, false);
    if (Math.abs(this.cam.aspect - w / h) > 1e-4) { this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
    // (the hub's studio started again under us - a resize, a page: stopped again, and started once we are done)
    if (this.hub?.on) { this.hub.stop(); this.hubOn = true; }
    try { this.tick?.(dt); } catch (e) { console.warn('[contract scene] a frame failed', e); }
    this.fadeEl.style.opacity = String(clamp(this.fade, 0, 1));
    this.flashEl.style.opacity = String(clamp(this.flash, 0, 1));
    if (this.shake > 0) { this.shake = Math.max(0, this.shake - dt); const k = this.shake * 0.04; this.cam.position.x += (Math.random() - 0.5) * k; this.cam.position.y += (Math.random() - 0.5) * k; }
    if (this.set) {
      this.R.render(this.set.scene, this.cam);
      if (this.snap) { const f = this.snap; this.snap = null; safe(() => f(this.canvas.toDataURL('image/jpeg', 0.86))); }
    }
  }
  /** the camera to a shot: { p, l, f } */
  shot(s) { this.cam.position.copy(s.p); this.cam.lookAt(s.l); if (Math.abs(this.cam.fov - s.f) > 1e-3) { this.cam.fov = s.f; this.cam.updateProjectionMatrix(); } }
  /** a set to draw (its shaders compiled off the main thread first where the GPU can - at most 250 ms waited) */
  use(set) { this.set = set; }
  /** a set's shaders compiled ahead, off the main thread where the GPU can (set.comp until that settles) */
  prepare(set) {
    if (!set || set.compiled || !this.on) return; set.compiled = true;
    safe(() => {
      const p = this.R.compileAsync?.(set.scene, this.cam); if (!p?.then) return;
      const c = set.comp = p.catch(() => {}).then(() => { if (set.comp === c) set.comp = null; this.comps.delete(c); });
      this.comps.add(c);
    });
  }
  dispose() {
    this.on = false; cancelAnimationFrame(this.raf); clearInterval(this.dog);
    if (this.shared) {
      // (the lent renderer goes home as it came: its canvas back in its place, its tone, size and clear colour)
      const R = this.R, B = this.back, c = this.canvas;
      c.className = B.cls; R.toneMapping = B.tm; R.toneMappingExposure = B.ex; R.setClearColor(B.cc, B.ca);
      if (Math.abs(R.getPixelRatio() - B.pr) > 1e-6) R.setPixelRatio(B.pr);
      const home = B.parent?.isConnected ? B.parent : document.getElementById('career');
      if (home) { if (B.next && B.next.parentNode === home) home.insertBefore(c, B.next); else home.prepend(c); } else c.remove();
      R.setSize(B.size.x, B.size.y, false);
      if (this.hub) { this.hub.dirty = true; if (this.hubOn) this.hub.start?.(); }
    } else {
      // (a renderer of our own: let go once nothing is compiling on it any more)
      const R = this.R, cv = this.canvas; cv.remove();
      Promise.all([...this.comps]).then(() => { R.dispose(); R.forceContextLoss?.(); });
    }
    this.el.remove();
  }
}
/** the distance at which a w x h box facing the camera fills the view (fov in degrees, the screen's share of height free: k) */
const fitDist = (w, h, fov, aspect, m = 1.1, k = 1) => { const t = Math.tan(THREE.MathUtils.degToRad(fov) / 2) * k; return Math.max((h * m) / 2 / t, (w * m) / 2 / (t * aspect)); };
/** a shot between two: positions and targets eased, the fov too; arc lifts the camera on the way */
function between(a, b, u, arc = 0) { const e = ease(clamp(u, 0, 1)); return { p: a.p.clone().lerp(b.p, e).add(V3(0, arc * Math.sin(Math.PI * e), 0)), l: a.l.clone().lerp(b.l, e), f: lerp(a.f, b.f, e) }; }
const shotOf = (p, l, f) => ({ p: p.clone(), l: l.clone(), f });

/**
 * A run of beats on a stage: each { dur, build() -> set (built ahead, while the one before it plays), enter(set),
 * update(set, t, dt), finish(set) (skipped: whatever the beat must leave done) }. A beat opens out of black; Space, Enter
 * or a click skips one, Esc the lot. -> Promise (when the last is over)
 */
function reel(st, beats, o = {}) {
  return new Promise((resolve) => {
    let i = -1, b = null, set = null, t = 0, over = false;
    // (a beat's set: its own build, the one before it (same: true), or the one passed in for the first (o.first))
    const built = new Map(); if (o.first) built.set(0, o.first);
    const buildAt = (k) => {
      if (k >= beats.length) return null;
      if (built.has(k)) return built.get(k);
      const B = beats[k], s = B.same ? buildAt(k - 1) : safe(() => B.build?.() || null);
      built.set(k, s); if (s && !B.same) st.prepare(s); return s;
    };
    /** a set let go, unless a beat still to come plays on it */
    const drop = (s, from) => { if (!s) return; for (const [j, x] of built) if (j >= from && x === s) return; safe(() => s.dispose()); };
    const end = () => { if (over) return; over = true; st.tick = null; st.use(null); for (const s of new Set(built.values())) if (s) safe(() => s.dispose()); resolve(); };
    const go = (k) => {
      if (over) return;
      if (b) safe(() => b.finish?.(set, t));
      if (k >= beats.length) { end(); return; }
      const prev = set, next = buildAt(k);
      i = k; t = 0; b = beats[k]; set = next;
      if (prev && prev !== next) drop(prev, k);
      st.use(set); if (b.cut !== false) st.fade = 1; st.flash = 0;
      safe(() => b.enter?.(set));
      // (the next beat's set built a moment after this one is up - in the dip from black, not mid-move)
      setTimeout(() => { if (!over && i === k) buildAt(k + 1); }, 60);
    };
    st.tick = (dt) => {
      if (!b || over) return;
      t += dt;
      if (b.cut !== false) st.fade = Math.max(0, 1 - t / 0.3);
      safe(() => b.update?.(set, t, dt));
      if (t >= b.dur) go(i + 1);
    };
    o.ctl?.({ skip: () => go(i + 1), all: () => { if (over) return; if (b) safe(() => b.finish?.(set, t)); b = null; end(); },
      get beat() { return i; }, get t() { return t; }, get set() { return set; } });
    go(0);
  });
}
/** a caption over the scene (the dismissal's few words): who, the line typed out by p (0..1) */
function caption(st) {
  let el = st.ui.querySelector('.cs-cap'); if (!el) { el = document.createElement('div'); el.className = 'cs-cap'; el.innerHTML = '<small></small><p></p>'; st.ui.appendChild(el); }
  return { show(who, text, p = 1) { const n = Math.round(String(text || '').length * clamp(p, 0, 1)); if (!n) { el.classList.remove('on'); return; } el.classList.add('on'); el.querySelector('small').textContent = who || ''; el.querySelector('p').textContent = String(text).slice(0, n); }, hide() { el.classList.remove('on'); } };
}
/** the skip hint (bottom right) */
function skipHint(st, on) {
  let el = st.ui.querySelector('.cs-skip'); if (!el) { el = document.createElement('div'); el.className = 'cs-skip'; st.ui.appendChild(el); }
  el.textContent = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches ? 'TAP TO SKIP' : 'SPACE SKIP · ESC SKIP ALL'; el.style.display = on ? '' : 'none';
}

// ---- the contract table: the sets --------------------------------------------------------------------------------------
/**
 * The meeting room with the offers on the table: { scene, docs: [{ g (on the table), sheet (the paper's own frame: x
 * across, y up the page, z out of it), of, x, z, yaw }], pen, shots (wide, doc(i), sign(i)) }
 */
function tableSet(st, offers, info) {
  const set = newSet('#16171b'), S = set.scene, N = offers.length, gap = N > 4 ? 0.34 : 0.4, span = (N - 1) * gap, L = Math.max(2.3, span + 1.1);
  const room = meetingRoom(set, { len: L, accent: info.accent, word: info.word, night: info.night, chairs: [-0.75, 0.75] });
  const shadowT = blobTex(), flagTex = texOf(flagCanvas(), st.R); set.extra.push(shadowT, flagTex);
  const R = rng(hash(offers.map((o) => o.team).join('|')));
  set.docs = offers.map((of, i) => {
    const T = teamInfo(info.c, of.team), K = kindText(of, info.opts, T);
    const g = new THREE.Group(), x = -span / 2 + i * gap, z = 0.04 + (N > 4 ? (i % 2) * 0.05 : 0), yaw = (R() - 0.5) * 0.14;
    g.position.set(x, room.top, z); g.rotation.y = yaw; S.add(g);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.54), new THREE.MeshBasicMaterial({ map: shadowT, transparent: true, depthWrite: false, opacity: 0.8 })); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.0006; g.add(sh);
    // the team's leather folder, a second page under the first, the sheet; a tab in the team's second colour
    g.add(box(0.3, 0.008, 0.41, std(T.color, 0.48, 0.05), 0, 0.004, 0));
    g.add(box(0.252, 0.002, 0.356, std('#f1efe9', 0.9), 0.003, 0.0092, 0.002));
    g.add(box(0.05, 0.004, 0.02, std(apart(T.color, T.color2), 0.5), 0.09, 0.006, -0.214));
    const sheet = new THREE.Group(); sheet.rotation.x = -Math.PI / 2; sheet.position.y = 0.0106; g.add(sheet);
    const tex = texOf(contractCanvas(of, T, K, info.me, info.c), st.R);
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), std('#ffffff', 0.86, 0, { map: tex })); paper.userData.doc = i; sheet.add(paper);
    // (the yellow SIGN HERE flag stuck on your line, poking out past the sheet's edge)
    const [fx, fy] = sheetXY(CW, SIGLINE - 22), flag = new THREE.Mesh(new THREE.PlaneGeometry(0.056, 0.014), new THREE.MeshBasicMaterial({ map: flagTex, transparent: true }));
    flag.position.set(fx + 0.012, fy, 0.0006); flag.rotation.z = 0.04; sheet.add(flag);
    return { g, sheet, paper, of, T, K, x, z, yaw, lift: 0 };
  });
  // the pen waiting on your side of the table; a glass of water, a coffee
  const pen = makePen(); pen.rotation.set(Math.PI / 2, 0, 0.6); pen.position.set(span / 2 + 0.3, room.top + 0.007, 0.3); S.add(pen); set.pen = pen;
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.12, 20), std('#dfe9f2', 0.05, 0, { transparent: true, opacity: 0.35 })); glass.position.set(-span / 2 - 0.3, room.top + 0.06, -0.36); S.add(glass);
  const cup = cyl(0.042, 0.035, 0.09, std('#f4f4f2', 0.4), 18); cup.position.set(span / 2 + 0.36, room.top + 0.045, -0.34); S.add(cup);
  const co = new THREE.Mesh(new THREE.CircleGeometry(0.038, 18), std('#3b2416', 0.2)); co.rotation.x = -Math.PI / 2; co.position.set(span / 2 + 0.36, room.top + 0.086, -0.34); S.add(co);
  set.top = room.top; set.span = span;
  return set;
}
/** where a point on a doc's sheet (sheet coords: m) is in the world */
const onSheet = (d, x, y, z = 0) => { d.g.updateMatrixWorld(true); return d.sheet.localToWorld(V3(x, y, z)); };
/** a sheet's canvas px -> its own coords (m) */
const sheetXY = (px, py) => [(px / CW - 0.5) * PW, (0.5 - py / CH) * PH];

/** how far a framed contract is picked up toward you: its far edge raised (rad), the whole of it lifted (m) */
const TILT = 0.34, LIFT = 0.205 * Math.sin(TILT) + 0.012;
/** the shot that frames doc i to be read (the screen's top and bottom bars kept clear): square on to the sheet as it is held */
function docShot(st, set, i, bars = [56, 128]) {
  const d = set.docs[i], h = st.h, k = clamp((h - bars[0] - bars[1]) / h, 0.45, 1), portrait = st.aspect < 0.8, el = THREE.MathUtils.degToRad(portrait ? 66 : 58) + TILT * 0.8, f = portrait ? 46 : 36;
  const dist = fitDist(PW + 0.012, PH * Math.sin(el + TILT * 0.2) + 0.01, f, st.aspect, portrait ? 1.03 : 1.05, k);
  const c = V3(d.x, set.top + LIFT, d.z), l = c.clone().add(V3(0, 0, 0.004)), p = c.clone().add(V3(0, Math.sin(el) * dist, Math.cos(el) * dist));
  // (the bars' difference: the framing moved up the screen by it)
  const shift = ((bars[1] - bars[0]) / 2 / h) * 2 * Math.tan(THREE.MathUtils.degToRad(f) / 2) * dist;
  const up = V3(0, Math.cos(el), -Math.sin(el)); l.addScaledVector(up, -shift); p.addScaledVector(up, -shift);
  return { p, l, f };
}
function wideShot(st, set) {
  const f = 40, el = THREE.MathUtils.degToRad(48), dist = fitDist(set.span + 0.5, 0.62, f, st.aspect, 1.05, 0.8);
  const c = V3(0, set.top, 0.08); return { p: c.clone().add(V3(0, Math.sin(el) * dist + 0.05, Math.cos(el) * dist)), l: c.clone().add(V3(0, -0.04, -0.02)), f };
}
/** first person over doc i: your eyes over the signature line */
function signShot(st, set, i) {
  const d = set.docs[i], [sx, sy] = sheetXY(SIGBOX.x + SIGBOX.w / 2, SIGBOX.y + SIGBOX.h * 0.62), tgt = onSheet(d, sx - 0.012, sy + 0.012), portrait = st.aspect < 0.8;
  const f = portrait ? 58 : 44, back = portrait ? 0.26 : 0.2;
  return { p: tgt.clone().add(V3(-0.05, 0.3, back)), l: tgt.clone().add(V3(0.005, 0, 0.006)), f };
}

/** the papers and the phones with the news: a desk, the papers spinning in one after another, a phone sliding in */
function newsSet(st, items, T, me) {
  const set = newSet('#0c0d10'), S = set.scene;
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), std('#2b221c', 0.6)); desk.rotation.x = -Math.PI / 2; S.add(desk);
  S.add(new THREE.HemisphereLight(0xffffff, 0x302822, 0.9));
  const key = new THREE.SpotLight(0xfff3e0, 22, 7, 0.7, 0.6, 1.4); key.position.set(0.4, 3.2, 0.8); key.target.position.set(0, 0, 0); S.add(key, key.target);
  const shadowT = blobTex('rgba(0,0,0,.6)'); set.extra.push(shadowT);
  const papers = items.filter((x) => x.kind === 'paper'), phone = items.find((x) => x.kind === 'phone');
  // (laid out across the desk on a wide screen; down it, one under the other, on a tall one)
  const tall = st.aspect < 0.8; set.tall = tall;
  const spots = tall ? [[-0.07, -0.34, 0.1], [0.08, 0.04, -0.08], [-0.04, 0.42, 0.05], [0.1, 0.6, 0.12]] : [[-0.34, -0.02, 0.14], [0.3, 0.06, -0.1], [-0.02, 0.16, 0.05], [0.36, -0.12, 0.2]];
  set.papers = papers.slice(0, 4).map((it, k) => {
    const g = new THREE.Group(), [x, z, r] = spots[k]; S.add(g);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.94), new THREE.MeshBasicMaterial({ map: shadowT, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.002; g.add(sh);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.766), std('#ffffff', 0.92, 0, { map: texOf(paperCanvas(it.out, it.text, T, me, it.sub, it.n), st.R), side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; g.add(m);
    g.userData = { x, z, r, y: 0.002 + k * 0.004, k };
    g.visible = false; return g;
  });
  if (phone) {
    const g = new THREE.Group(), body = new THREE.Mesh(new THREE.ExtrudeGeometry(rounded(0.17, 0.34, 0.024), { depth: 0.012, bevelEnabled: false }), std('#17181c', 0.3, 0.5));
    body.rotation.x = -Math.PI / 2; g.add(body);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.156, 0.312), new THREE.MeshBasicMaterial({ map: texOf(phoneCanvas(phone, T, me), st.R) })); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0125; g.add(scr);
    g.userData = tall ? { x: 0.17, z: 0.5, r: -0.18 } : { x: 0.43, z: 0.14, r: -0.22 }; g.visible = false; S.add(g); set.phone = g;
  }
  return set;
}
/** the heat press: the shirt on its plate, the transfer on it, the press coming down - and lifted, your name on the back */
function pressSet(st, T, me) {
  const set = newSet('#17181c'), S = set.scene;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), std('#3b3e44', 0.8)); floor.rotation.x = -Math.PI / 2; S.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), std('#d9dbe0', 0.9)); wall.position.set(0, 2, -0.9); S.add(wall);
  const band = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.3), new THREE.MeshBasicMaterial({ color: T.color })); band.position.set(0, 1.55, -0.89); S.add(band);
  // (spare shirts on the rail behind: the team's colour, a row of them)
  const shirtShape = () => { const s = new THREE.Shape(); s.moveTo(-0.13, -0.26); s.lineTo(0.13, -0.26); s.lineTo(0.13, 0.08); s.lineTo(0.24, 0.02); s.lineTo(0.3, 0.12); s.lineTo(0.16, 0.24); s.lineTo(0.06, 0.26); s.quadraticCurveTo(0, 0.2, -0.06, 0.26); s.lineTo(-0.16, 0.24); s.lineTo(-0.3, 0.12); s.lineTo(-0.24, 0.02); s.lineTo(-0.13, 0.08); s.closePath(); return s; };
  const railM = std(T.color, 0.7);
  for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(new THREE.ShapeGeometry(shirtShape()), railM); m.position.set(-1.25 + i * 0.5, 2.05, -0.8); m.scale.setScalar(0.9); S.add(m); }
  S.add(box(4, 0.02, 0.02, std('#9aa0a8', 0.3, 0.8), 0, 2.33, -0.8));
  // the bench and the press: the base, its silicone pad, the hinge at the back, the hot plate and its handle
  S.add(box(1.8, 0.9, 0.9, std('#4a4f57', 0.7, 0.2), 0, 0.45, 0));
  S.add(box(1.82, 0.03, 0.92, std('#6d737c', 0.5, 0.4), 0, 0.915, 0));
  S.add(box(0.6, 0.08, 0.66, std('#25282d', 0.5, 0.3), 0, 0.97, 0));
  S.add(box(0.52, 0.02, 0.58, std('#15171a', 0.9), 0, 1.02, 0.01));
  S.add(box(0.1, 0.36, 0.1, std('#25282d', 0.5, 0.3), 0, 1.15, -0.34));
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), new THREE.MeshBasicMaterial({ color: '#3a0d0d' })); lamp.position.set(0.22, 0.99, 0.335); S.add(lamp); set.lamp = lamp;
  // (its display: the temperature and the seconds left)
  const dcv = canvas(256, 96), dx = dcv.getContext('2d'); dx.fillStyle = '#0b1210'; dx.fillRect(0, 0, 256, 96); dx.fillStyle = '#5dffa8'; dx.font = `700 46px ${COND}`; dx.fillText('185°C', 14, 62); dx.font = `700 30px ${COND}`; dx.fillText('0:15', 170, 60);
  const disp = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.045), new THREE.MeshBasicMaterial({ map: texOf(dcv) })); disp.position.set(-0.12, 0.97, 0.3315); S.add(disp);
  S.add(box(0.6, 0.012, 0.012, std(T.color, 0.5), 0, 1.006, 0.33));
  // the shirt laid on the pad, back up, the collar away from you; the transfer sheet over its print
  const geo = new THREE.ShapeGeometry(shirtShape());
  const bb = new THREE.Box3().setFromBufferAttribute(geo.attributes.position), uv = geo.attributes.uv, pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y));
  const blank = texOf(shirtCanvas(T, me, false), st.R), printed = texOf(shirtCanvas(T, me, true), st.R);
  const shirtM = std('#ffffff', 0.85, 0, { map: blank }), shirt = new THREE.Mesh(geo, shirtM); shirt.rotation.x = -Math.PI / 2; shirt.scale.setScalar(0.92); shirt.position.set(0, 1.032, 0.01); S.add(shirt);
  set.shirt = { m: shirtM, blank, printed };
  const tcv = canvas(512, 384), tx = tcv.getContext('2d'); tx.fillStyle = 'rgba(255,255,255,.9)'; tx.fillRect(0, 0, 512, 384); tx.save(); tx.translate(512, 0); tx.scale(-1, 1); tx.fillStyle = 'rgba(120,120,120,.35)'; tx.textAlign = 'center'; fitFont(tx, last(me.name).toUpperCase(), 900, 70, 400, COND); tx.fillText(last(me.name).toUpperCase(), 256, 110); tx.font = `900 220px ${COND}`; tx.fillText(String(me.number), 256, 330); tx.restore();
  const sheetG = new THREE.Group(); sheetG.position.set(0, 1.036, -0.17); S.add(sheetG);
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.34), std('#ffffff', 0.4, 0, { map: texOf(tcv, st.R), transparent: true, opacity: 0.92, side: THREE.DoubleSide })); sheet.rotation.x = -Math.PI / 2; sheet.position.z = 0.17 + 0.02; sheetG.add(sheet);
  set.sheet = sheetG;
  const hinge = new THREE.Group(); hinge.position.set(0, 1.33, -0.34); S.add(hinge);
  const plate = box(0.54, 0.07, 0.6, std('#c3c7cd', 0.32, 0.75), 0, -0.24, 0.32); hinge.add(plate);
  hinge.add(box(0.5, 0.006, 0.56, std('#3a2f2a', 0.6, 0.3, { emissive: '#ff5a1f', emissiveIntensity: 0.0 }), 0, -0.278, 0.32));
  set.heat = hinge.children[1].material;
  hinge.add(box(0.1, 0.06, 0.36, std('#25282d', 0.5, 0.3), 0, -0.2, 0.12));
  const handle = cyl(0.016, 0.016, 0.5, std('#111215', 0.4, 0.3), 12); handle.rotation.z = Math.PI / 2; handle.position.set(0, -0.2, 0.66); hinge.add(handle);
  hinge.add(box(0.03, 0.05, 0.04, std('#25282d', 0.5, 0.3), -0.2, -0.22, 0.63), box(0.03, 0.05, 0.04, std('#25282d', 0.5, 0.3), 0.2, -0.22, 0.63));
  set.hinge = hinge;
  // steam: soft puffs rising from the plate's edges while it presses
  const puffT = blobTex('rgba(255,255,255,0.75)', 'rgba(255,255,255,0)'); set.extra.push(puffT);
  set.puffs = Array.from({ length: 16 }, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffT, transparent: true, opacity: 0, depthWrite: false })); s.userData = { a: (i / 16) * Math.PI * 2, d: Math.random() * 0.6 }; S.add(s); return s; });
  S.add(new THREE.HemisphereLight(0xffffff, 0x404348, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(1.2, 3, 2); S.add(key);
  const fill = new THREE.PointLight(0xfff0dd, 2.5, 4, 2); fill.position.set(-0.8, 1.8, 0.8); S.add(fill);
  return set;
}
/** the photo-op: a step-and-repeat in the team's colours, you and the boss shaking hands */
function shakeSet(st, T, me, c) {
  const set = newSet('#101114'), S = set.scene;
  const wt = texOf(wallCanvas(T), st.R); wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(3.5, 1.6);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.2), new THREE.MeshStandardMaterial({ map: wt, roughness: 0.8 })); wall.position.set(0, 1.6, -1.25); S.add(wall);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), std('#2a2c31', 0.45, 0.1)); floor.rotation.x = -Math.PI / 2; S.add(floor);
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.2), std(shade(T.color, 0.7), 0.9)); carpet.rotation.x = -Math.PI / 2; carpet.position.set(0, 0.003, -0.15); S.add(carpet);
  // you, in the team's polo now; the boss: the team's chief executive (invented), or a generic principal
  // (no pose of People's is a handshake: 'gesture' - the right hand up in front, the elbow bent - each, the hands met)
  const boss = ceoOf(c, T.name, 'gesture'), bossOpts = boss?.opts || principalOf(T, 'gesture');
  const you = person(set, { pose: 'gesture', kit: 'polo', color: T.color, accent: T.color2, driver: me.name, teamName: T.name }, [-0.33, 0, 0.19], 0);
  let them = person(set, bossOpts, [0.33, 0, -0.19], Math.PI), who = them && boss ? boss : null;
  if (!them && boss) them = person(set, principalOf(T, 'gesture'), [0.33, 0, -0.19], Math.PI);
  set.you = you; set.boss = them; set.bossName = who;
  // (their right hands where they meet: the boss stood so that they do)
  if (you && them) {
    const a = new THREE.Vector3(), b = new THREE.Vector3(); you.group.updateMatrixWorld(true); them.group.updateMatrixWorld(true);
    a.copy(you.wrR).applyMatrix4(you.group.matrixWorld); b.copy(them.wrR).applyMatrix4(them.group.matrixWorld);
    them.group.position.x += a.x - b.x; them.group.position.z += a.z - b.z; set.clasp = a.clone().setY((a.y + b.y) / 2);
  } else set.clasp = V3(0, 1.02, 0);
  S.add(new THREE.HemisphereLight(0xffffff, 0x2a2c31, 0.9));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.9); key.position.set(-1.5, 2.6, 3); S.add(key);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 0.9); rim.position.set(2, 2.5, -2); S.add(rim);
  set.flashL = new THREE.PointLight(0xffffff, 0, 8, 1.5); set.flashL.position.set(0.4, 1.6, 2.4); S.add(set.flashL);
  return set;
}

// ---- the contract table: the scene ------------------------------------------------------------------------------------
/**
 * The offers on the table -> Promise<index | null>. opts: { career, kind ('first' | 'renewal' | 'precontract' |
 * 'buyout' | 'midseason' | 'reserve' | 'free': the moment's - each offer's own kind prints on its sheet), start (the
 * one framed first), direct (the contract seen a moment, then straight to the pen: a deal agreed in talks), decline
 * (true: DECLINE ALL; else BACK for a first contract, NOT NOW in the hub - each gives null), renderer (the hub's) }.
 * A negotiable offer chosen resolves at once with its index (no signing: its terms are talked over first).
 */
async function contractTable(offers, opts = {}) {
  const c = opts.career || null, me = meInfo(c), L = offers.filter(Boolean); if (!L.length) return null;
  const T0 = teamInfo(c, L[0].team), st = new Stage({ renderer: opts.renderer, color: T0.color });
  const info = { c, opts, me, accent: '#9aa3b2', word: null, night: false };
  let set = null, done = false;
  try { set = tableSet(st, L, info); } catch (e) { st.dispose(); throw e; }
  st.use(set); st.prepare(set);
  let cur = clamp(Number.isInteger(opts.start) ? opts.start : 0, 0, L.length - 1), view = 'doc', from = null, u = 1, dur = 0.9, hover = -1;
  const CTL = { stage: st, set, get index() { return cur; }, get view() { return view; }, step: (dt, n = 1) => { for (let k = 0; k < n; k++) st.step(dt); }, hold: (on = true) => { st.hold = on; } };
  LIVE = CTL; if (typeof window !== 'undefined') window.__contractScene = CTL;
  // the overlay: the tag, the arrows, the bar with the terms and SIGN
  const kindTxt = { first: 'YOUR FIRST CONTRACT', renewal: 'CONTRACT RENEWAL', precontract: 'NEXT SEASON', buyout: 'A TRANSFER', midseason: 'A SEAT NOW', reserve: 'RESERVE ROLE' }[opts.kind] || (c?.seasonOver ? 'FOR NEXT SEASON' : 'FROM YOUR AGENT');
  const declineTxt = opts.decline ? 'DECLINE ALL' : opts.kind === 'first' ? 'BACK' : 'NOT NOW';
  // (one contract alone: nothing to cycle through - no arrows, no dots)
  const one = L.length === 1, escTxt = opts.decline ? (one ? 'declines it' : 'declines them all') : opts.kind === 'first' ? 'goes back' : 'decides later';
  st.ui.innerHTML = `<div class="cs-top"><b>${one ? 'CONTRACT' : 'CONTRACT OFFERS'}</b><span>${esc(kindTxt)} · ${esc(me.name.toUpperCase())}</span></div>
    ${one ? '' : '<button class="cs-arrow l" data-a="prev" aria-label="Previous contract">‹</button><button class="cs-arrow r" data-a="next" aria-label="Next contract">›</button>'}
    <div class="cs-bar"><div class="cs-sum"><small><span data-n></span>${one ? '' : `<span class="cs-dots">${L.map(() => '<i></i>').join('')}</span>`}</small><b data-team></b><span data-terms></span></div>
      <div class="cs-acts"><button data-a="back">${declineTxt}</button><button class="go" data-a="sign">SIGN →</button></div>
      <div class="cs-hint">${one ? '' : `← → or 1–${L.length} to choose · click a contract · `}↑ the whole table · Enter signs · Esc ${escTxt}</div></div>`;
  const $ = (q) => st.ui.querySelector(q);
  const paint = () => {
    const d = set.docs[cur], of = d.of, T = d.T;
    st.color(T.color);
    $('[data-n]').textContent = one ? d.K.chip.toUpperCase() : st.w < 480 ? `CONTRACT ${cur + 1} OF ${L.length}` : `CONTRACT ${cur + 1} OF ${L.length} · ${d.K.chip.toUpperCase()}`;
    $('[data-team]').textContent = `${T.name} · ${tierName(T.tier)}`;
    $('[data-terms]').textContent = `${money(of.salary)} a year · ${of.kind === 'reserve' ? 'this season' : `${of.years} season${of.years > 1 ? 's' : ''}`} · ${ROLE_NAME[of.role] || 'Equal status'}${of.seatName || of.replaces ? ` · replaces ${of.replaces || of.seatName}` : ''}`;
    $('[data-a="sign"]').textContent = of.negotiable ? 'TALK TERMS →' : `${of.kind === 'renewal' || of.kind === 'renew' ? 'SIGN AGAIN' : of.kind === 'reserve' ? 'TAKE THE ROLE' : 'SIGN'} · ${T.name.toUpperCase()} →`;
    st.ui.querySelectorAll('.cs-dots i').forEach((x, k) => x.classList.toggle('on', k === cur));
    if (!one) { $('[data-a="prev"]').disabled = cur <= 0; $('[data-a="next"]').disabled = cur >= L.length - 1; }
  };
  const target = () => (view === 'wide' ? wideShot(st, set) : docShot(st, set, cur));
  const glide = (d = 0.9) => { from = { p: st.cam.position.clone(), l: (st.lookAt || target().l).clone(), f: st.cam.fov }; u = 0; dur = reduced() ? 0.01 : d; };
  const focus = (i, how = 'doc') => { const n = clamp(i, 0, L.length - 1); if (n === cur && view === how) return; cur = n; view = how; glide(); paint(); };
  // (the opening: the whole table, then the first contract)
  const w0 = wideShot(st, set); st.shot({ p: w0.p.clone().add(V3(0, 0.5, 0.7)), l: w0.l, f: w0.f }); st.lookAt = w0.l.clone();
  from = { p: st.cam.position.clone(), l: w0.l.clone(), f: w0.f }; u = 0; dur = 1.6; view = 'doc';
  paint();
  let t = 0;
  st.tick = (dt) => {
    t += dt; st.fade = Math.max(0, 1 - t / 0.5);
    // (straight to signing: the contract seen a moment first)
    if (CTL.direct && t > 0.9) { CTL.direct = false; CTL.sign?.(); return; }
    // the camera: gliding to the shot wanted (and keeping to it as the screen changes shape)
    const goal = target();
    if (u < 1) { u = Math.min(1, u + dt / dur); const s = between(from, goal, u, view === 'doc' ? 0.05 : 0.1); st.shot(s); st.lookAt = s.l.clone(); }
    else { st.shot(goal); st.lookAt = goal.l.clone(); }
    // the contracts: the one framed lifted a little and squared up, the one under the pointer raised a touch
    set.docs.forEach((d, k) => {
      const want = view === 'doc' && k === cur ? 1 : 0, hv = k === hover && want === 0 ? 1 : 0;
      d.lift += (want - d.lift) * (1 - Math.exp(-dt * 7)); d.hv = (d.hv || 0) + (hv - (d.hv || 0)) * (1 - Math.exp(-dt * 10));
      d.g.position.y = set.top + d.lift * LIFT + d.hv * 0.008; d.g.rotation.x = d.lift * TILT; d.g.rotation.y = d.yaw * (1 - d.lift);
    });
  };
  // input: keys, clicks on the bar, clicks (and taps) on the contracts, swipes
  return new Promise((resolve) => {
    let picked = null, signing = false, ctl = null;
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    const docAt = (e) => { const r = st.canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, st.cam); const hit = ray.intersectObjects(set.docs.map((d) => d.paper), false)[0]; return hit ? hit.object.userData.doc : -1; };
    let down = null;
    const onDown = (e) => { if (signing) return; down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
    const onUp = (e) => {
      if (signing) { ctl?.skip(); return; }
      if (!down || e.target !== st.canvas) { down = null; return; }
      const dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { focus(cur + (dx < 0 ? 1 : -1)); return; }
      if (Math.hypot(dx, dy) > 12) return;
      const k = docAt(e); if (k >= 0) focus(k, 'doc'); else if (view === 'doc') focus(cur, 'wide');
    };
    const onMove = (e) => { if (signing || e.pointerType === 'touch') return; const k = docAt(e); if (k !== hover) { hover = k; st.canvas.style.cursor = k >= 0 ? 'pointer' : ''; } };
    st.canvas.addEventListener('pointerdown', onDown); window.addEventListener('pointerup', onUp, true); st.canvas.addEventListener('pointermove', onMove);
    const close = (val) => {
      if (done) return; done = true;
      window.removeEventListener('keydown', onKey, true); window.removeEventListener('pointerup', onUp, true); unkeys();
      if (LIVE === CTL) LIVE = null; if (typeof window !== 'undefined' && window.__contractScene === CTL) window.__contractScene = null;
      // (out through black, then everything let go: the sets, the renderer handed back)
      const out = () => { st.tick = null; ctl?.all(); safe(() => set?.dispose()); st.dispose(); resolve(val); };
      let k = 0; st.tick = (dt) => { k += dt; st.fade = Math.min(1, k / 0.25); if (k >= 0.28) out(); };
      if (reduced()) out();
    };
    const sign = () => {
      if (signing || done) return;
      // (a negotiable offer is not signed yet: chosen, it goes to the talks at the table - the caller's)
      if (set.docs[cur].of.negotiable) { close(cur); return; }
      signing = true; picked = cur; hover = -1; st.canvas.style.cursor = '';
      st.ui.innerHTML = ''; skipHint(st, true);
      const d = set.docs[cur], T = d.T;
      st.color(T.color);
      const beats = signingBeats(st, set, d, { c, me, T, K: d.K, opts, of: d.of });
      reel(st, beats, { first: set, ctl: (x) => { ctl = x; CTL.reel = x; } }).then(() => { set = null; close(picked); });
    };
    const onKey = (e) => {
      const k = e.key; let used = true;
      if (signing) { if (k === 'Escape') ctl?.all(); else if (k === ' ' || k === 'Enter' || k === 'ArrowRight') ctl?.skip(); else used = false; }
      else if (k === 'ArrowLeft') focus(cur - 1); else if (k === 'ArrowRight') focus(cur + 1);
      else if (k === 'ArrowUp') focus(cur, 'wide'); else if (k === 'ArrowDown') focus(cur, 'doc');
      else if (/^[1-9]$/.test(k) && +k <= L.length) focus(+k - 1, 'doc');
      else if (k === 'Enter' || k === 's' || k === 'S') { if (view === 'wide') focus(cur, 'doc'); else sign(); }
      else if (k === 'Escape' || k === 'Backspace') { if (view === 'wide') focus(cur, 'doc'); else close(null); }
      else used = false;
      if (used) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('keydown', onKey, true);
    // (nothing under this screen - the hub - hears a key while it is up)
    const unkeys = keys(st.el, {});
    st.ui.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || b.disabled || signing) return;
      const a = b.dataset.a;
      if (a === 'prev') focus(cur - 1); else if (a === 'next') focus(cur + 1); else if (a === 'sign') sign(); else if (a === 'back') close(null);
    });
    CTL.sign = sign; CTL.focus = focus; CTL.close = close;
    CTL.direct = !!opts.direct;
  });
}
/** headlines for the montage: the career's own banks (career/PR.js) in three outlets' voices, else made from the offer */
function headlinesFor(bank, sub, X, ids, fb) {
  const out = PR.OUTLET_BY_ID || {}, seen = new Set(), res = [];
  for (const [k, id] of ids.entries()) {
    // (each paper its own line: the bank asked again where two would print the same words, then the offer's own)
    let h = null;
    for (let n = 0; n < 5 && !h; n++) { const x = safe(() => (typeof PR.storyHeadlines === 'function' ? PR.storyHeadlines(bank, sub, X, [id])[0] : null)); if (x && !seen.has(x.text)) h = x; }
    if (!h) { const t = fb.find((f) => !seen.has(f)) || fb[k % fb.length]; h = { id, name: out[id]?.name || id, color: out[id]?.color || '#c8102e', kind: out[id]?.kind || 'online', text: t }; }
    seen.add(h.text); res.push(h);
  }
  return res;
}
/**
 * After SIGN: the signature in first person, the news, the shirt, the handshake -> [beat]. x: { c, me, T, K, opts, of }
 */
function signingBeats(st, set, d, x) {
  const { c, me, T, K, of } = x, sur = last(me.name), Xs = { sur, newTeam: T.name, team: T.name };
  const fb = K.bank[0] === 'contract' ? (K.bank[1] === 'renew' ? [`${sur} stays at ${T.name}`, `${T.name} keep ${sur}`] : K.bank[1] === 'reserve' ? [`${sur} joins ${T.name} as reserve`] : [`${sur} to join ${T.name} next season`])
    : [`${sur} signs for ${T.name}`, `Confirmed: ${sur} joins ${T.name}`, `New colours for ${sur}`];
  const H = headlinesFor(K.bank[0], K.bank[1], Xs, ['f1news', 'post', 'race24', 'feed'], fb);
  const n = { round: c?.round || 1, season: c?.season || 2026 };
  const subs = [`${money(of.salary)} a year, ${of.kind === 'reserve' ? 'this season' : `${of.years} season${of.years > 1 ? 's' : ''}`}${of.seatName ? `: ${of.seatName} makes way` : ''}`, `"${T.name} have got a real one" - the paddock reacts`,
    K.chip === 'Your first seat' ? `The rookie and the ${tierName(T.tier).toLowerCase()} team: what it means` : `${sur} and ${T.name}: what the deal means for the grid`];
  const items = [...H.slice(0, 3).map((h, k) => ({ kind: 'paper', out: h, text: h.text, sub: subs[k], n })), { kind: 'phone', color: H[3]?.color || '#00b3a4', app: H[3]?.name || 'Chequered', who: T.name, initials: T.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(), text: `Welcome to the team, ${me.name}. ${H[3]?.text ? '' : ''}#${(T.name + sur).replace(/\W+/g, '')}`, tag: K.bank[1] === 'renew' ? 'STAYING' : 'OFFICIAL', reply: H[3]?.text || `Fans react to ${sur}'s move to ${T.name}` }];
  // the signature: written on its own canvas over the sheet's signature box
  const ocv = canvas(SIGBOX.w * 2, SIGBOX.h * 2), ox = ocv.getContext('2d'), sig = signatureStrokes(me.name), B = sig.box;
  const base = (SIGLINE - 10 - SIGBOX.y) * 2, em = Math.min((ocv.width - 60) / (B.x1 - B.x0), (base - 16) / Math.max(1.6, B.y1), (ocv.height - base - 6) / Math.max(0.6, -B.y0));
  const ink = new Ink(sig, ox, { em, ox: 30 - B.x0 * em, oy: base });
  const sigDur = clamp(1.6 + sig.strokes.reduce((a, s) => a + s.len, 0) * 0.07, 2.2, 3.4); ink.plan(sigDur);
  const otex = texOf(ocv, st.R);
  const [cx, cy] = sheetXY(SIGBOX.x + SIGBOX.w / 2, SIGBOX.y + SIGBOX.h / 2);
  const over = new THREE.Mesh(new THREE.PlaneGeometry((SIGBOX.w / CW) * PW, (SIGBOX.h / CH) * PH), new THREE.MeshBasicMaterial({ map: otex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  over.position.set(cx, cy, 0.0004); d.sheet.add(over);
  const ovPx = (px, py) => sheetXY(SIGBOX.x + px / 2, SIGBOX.y + py / 2);
  const hand = makeHand(me.skin, '#20252f'); hand.visible = false; set.scene.add(hand);
  const nib = new THREE.Vector3();
  let s0 = null, s1 = null;
  const beats = [];
  // 1. into first person, the pen in your hand, your name on the line
  const T_IN = 1.1, T_W = T_IN + 0.15, T_OUT = T_W + ink.dur;
  beats.push({
    dur: T_OUT + 1.1, cut: false,
    enter() { s0 = { p: st.cam.position.clone(), l: (st.lookAt || docShot(st, set, set.docs.indexOf(d)).l).clone(), f: st.cam.fov }; set.pen.visible = false; d.g.rotation.y = 0; d.lift0 = d.lift; },
    update(S, t) {
      st.fade = Math.min(st.fade, Math.max(0, 1 - t / 0.3));
      // (the contract laid back down flat on the table to be signed)
      const down = 1 - ease(u01(t, 0, 0.7)); d.g.rotation.x = d.lift0 * TILT * down; d.g.position.y = set.top + d.lift0 * LIFT * down;
      s1 = signShot(st, set, set.docs.indexOf(d));
      const push = u01(t, T_W, T_OUT + 0.6) * 0.03, s = between(s0, s1, u01(t, 0, T_IN));
      s.p.add(V3(0, -push, -push * 0.6)); st.shot(s); st.lookAt = s.l;
      // the nib: coming in from the lower right to the first stroke, writing, then lifted away
      const n0 = ink.nib(0), w = t >= T_W ? ink.at(t - T_W) : n0, [lx, ly] = ovPx(w.x, w.y);
      nib.copy(onSheet(d, lx, ly, 0.0008 + w.lift * 0.009));
      const inU = eOut(u01(t, 0.45, T_W)), outU = eIn(u01(t, T_OUT + 0.1, T_OUT + 0.7));
      hand.visible = t > 0.45 && outU < 1;
      hand.position.copy(nib).add(V3(0.22 * (1 - inU) + 0.24 * outU, 0.12 * (1 - inU) + 0.1 * outU + 0.012 * (1 - inU), 0.2 * (1 - inU) + 0.24 * outU));
      // (the hand leaning a touch with the stroke, as a wrist does)
      hand.rotation.set(0, 0, Math.sin(t * 9) * 0.015 * (t > T_W && t < T_OUT ? 1 : 0));
      otex.needsUpdate = true;
    },
    finish() { ink.all(); otex.needsUpdate = true; hand.visible = false; },
  });
  // 2. the news: the papers spinning in, a phone
  beats.push({
    dur: 4.3, build: () => newsSet(st, items, T, me),
    update(S, t) {
      const cam = newsCam(st, t / 4.3, S.tall);
      st.shot(cam);
      S.papers.forEach((g, k) => {
        const D = g.userData, t0 = 0.25 + k * 0.78, uu = u01(t, t0, t0 + 0.62), e = eIn(uu);
        g.visible = t >= t0;
        if (reduced()) { g.position.set(D.x, D.y + (1 - uu) * 0.02, D.z); g.rotation.y = D.r; return; }
        // (from close to the lens, turning fast, down onto the pile; a jolt when it lands)
        g.position.set(lerp(D.x * 0.2, D.x, e), lerp(1.55, D.y, e), lerp(D.z * 0.2 + 0.15, D.z, e)); g.rotation.y = D.r + (1 - e) * Math.PI * 4.2;
        if (uu >= 1 && !D.landed) { D.landed = true; st.shake = 0.12; }
      });
      if (S.phone) { const g = S.phone, D = g.userData, uu = eOut(u01(t, 2.75, 3.3)); g.visible = t >= 2.75; g.position.set(D.x + (1 - uu) * 0.4, 0.026, D.z + (1 - uu) * 0.9); g.rotation.y = D.r - (1 - uu) * 0.4; }
    },
  });
  // 3. the shirt: pressed with your name and number
  beats.push({
    dur: 4.7, build: () => pressSet(st, T, me),
    update(S, t) {
      const close = eIn(u01(t, 0.35, 0.9)), open = eOut(u01(t, 2.05, 2.7)), a = -0.72 * (1 - close) - 1.25 * open;
      S.hinge.rotation.x = a;
      if (t >= 0.9 && !S.thud) { S.thud = true; st.shake = 0.14; }
      const on = t >= 0.9 && t < 2.1; S.lamp.material.color.set(on ? '#ff3b30' : '#3a0d0d'); S.heat.emissiveIntensity = on ? 0.6 : 0;
      if (t >= 2.0 && !S.done) { S.done = true; S.shirt.m.map = S.shirt.printed; S.shirt.m.needsUpdate = true; }
      // (the transfer peeled off from the near edge and away)
      const peel = ease(u01(t, 2.7, 3.3)); S.sheet.rotation.x = -peel * 2.2; S.sheet.position.y = 1.036 + peel * 0.25; S.sheet.visible = peel < 0.98;
      // (steam out from under the plate while it presses - and a breath of it as it lifts)
      S.puffs.forEach((p) => { const D = p.userData, lt = ((t - 0.95 - D.d) % 1.1 + 1.1) % 1.1, life = lt / 1.1, on = t > 0.95 + D.d && t < 2.9; p.material.opacity = on ? 0.75 * Math.sin(Math.PI * life) : 0; p.position.set(Math.cos(D.a) * (0.3 + life * 0.08), 1.06 + life * 0.38, Math.sin(D.a) * (0.34 + life * 0.08) + 0.01); p.scale.setScalar(0.1 + life * 0.26); });
      st.shot(pressCam(st, t));
    },
  });
  // 4. the handshake and the photographers
  let snapped = false;
  const photo = document.createElement('div'); photo.className = 'cs-photo'; photo.innerHTML = '<img alt=""><p></p>';
  beats.push({
    dur: 5.0, build: () => shakeSet(st, T, me, c),
    enter(S) { st.ui.appendChild(photo); photo.querySelector('p').innerHTML = `${esc(me.name)} & ${esc(S.bossName ? S.bossName.name : 'the team principal')}<small>${esc(S.bossName ? `${S.bossName.title}, ${T.name}` : T.name)} · ${esc(String(c?.seasonOver ? (c?.season || 2026) + 1 : c?.season || 2026))}</small>`; },
    update(S, t) {
      const C = S.clasp, close = { p: C.clone().add(V3(0.1, 0.06, 0.55)), l: C.clone(), f: 34 };
      // (the photographers' frame: the two of them from the knees up)
      const wide = { p: V3(0.05, 1.42, 0), l: V3(0, 1.22, 0), f: 34 }; wide.p.z = fitDist(1.35, 1.35, 34, st.aspect, 1.06);
      st.shot(between(close, wide, u01(t, 1.2, 2.5)));
      // (heads to each other, then round to the cameras)
      const turn = ease(u01(t, 1.8, 2.45));
      if (S.you) { S.you.head.rotation.z = 0.02; S.you.head.rotation.y = -1.25 * turn; S.you.group.position.y = Math.sin(t * 9) * 0.004 * (t < 2.0 ? 1 : 0); }
      if (S.boss) { S.boss.head.rotation.z = 0.02; S.boss.head.rotation.y = 1.25 * turn; S.boss.group.position.y = Math.sin(t * 9) * 0.004 * (t < 2.0 ? 1 : 0); }
      // the flashes, the last one kept: the photograph
      let f = 0; for (const ft of [2.65, 2.9, 3.08, 3.5]) f = Math.max(f, 1 - Math.abs(t - ft) / 0.09);
      st.flash = f * 0.75; S.flashL.intensity = f * 40;
      if (t >= 3.52 && !snapped) { snapped = true; st.snap = (url) => { photo.querySelector('img').src = url; photo.classList.add('on'); }; }
    },
    finish() { photo.remove(); },
  });
  return beats;
}
/** the news desk's camera: top-down over the pile, easing in */
function newsCam(st, u, tall = st.aspect < 0.8) {
  const f = 40, dist = (tall ? fitDist(0.78, 1.6, f, st.aspect, 1.02) : fitDist(1.35, 1.12, f, st.aspect, 1.02)) * lerp(1.04, 0.92, ease(u));
  return tall ? { p: V3(0.02, dist, 0.2), l: V3(0.02, 0, 0.05), f } : { p: V3(0.03, dist, 0.18), l: V3(0.03, 0, 0.02), f };
}
/** the heat press's camera: three-quarters above it, then in close on the print */
function pressCam(st, t) {
  const f = 38, a = { p: V3(0.82, 1.78, 1.05), l: V3(0, 1.02, 0.02), f }, k = fitDist(0.7, 0.6, f, st.aspect, 1.0) / 1.55;
  a.p.sub(a.l).multiplyScalar(Math.max(1, k)).add(a.l);
  const b = { p: V3(0.06, 1.62, 0.5), l: V3(0, 1.03, 0.0), f: 36 }, kb = fitDist(0.5, 0.48, 36, st.aspect, 1.0) / 0.7; b.p.sub(b.l).multiplyScalar(Math.max(1, kb)).add(b.l);
  return between(a, b, u01(t, 3.0, 4.6));
}

// ---- the dismissal ------------------------------------------------------------------------------------------------------
/** the meeting room in the team's colours, the principal across the table (seated, and standing to offer a hand), the letter */
function sackRoomSet(st, T, me, info) {
  const set = newSet('#16171b'), S = set.scene;
  const room = meetingRoom(set, { len: 2.0, depth: 1.0, accent: T.color, word: T.name, chairs: [0], tableColor: '#2e2a27' });
  set.sit = person(set, principalOf(T, 'sit'), [0, 0, -0.85], -Math.PI / 2);
  // (standing at the table's edge to hold out his hand: 'gesture' - the hand forward at the chest, offered)
  set.stand = person(set, principalOf(T, 'gesture'), [0, 0, -0.64], -Math.PI / 2); if (set.stand) set.stand.group.visible = false;
  const tex = texOf(letterCanvas(T, me, info.reason, info.who, info.c), st.R);
  const g = new THREE.Group(); g.position.set(0, room.top + 0.002, -0.28); g.rotation.y = Math.PI; S.add(g);
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), std('#ffffff', 0.86, 0, { map: tex })); sheet.rotation.x = -Math.PI / 2; g.add(sheet);
  set.letter = g; set.top = room.top;
  const hand = makeHand(me.skin, '#20252f', { pen: false }); hand.visible = false; S.add(hand); set.hand = hand;
  return set;
}
/** the bench in the garage, the box: your helmet and your race suit going into it */
function boxSet(st, T, me) {
  const set = newSet('#121316'), S = set.scene;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), std('#55595f', 0.5, 0.1)); floor.rotation.x = -Math.PI / 2; S.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), std(shade(T.color, 0.55), 0.85)); wall.position.set(0, 2, -0.75); S.add(wall);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.08), new THREE.MeshBasicMaterial({ color: apart(shade(T.color, 0.55), T.color2) })); strip.position.set(0, 1.35, -0.74); S.add(strip);
  S.add(box(2.2, 0.06, 0.8, std('#8a8f96', 0.4, 0.6), 0, 0.88, 0), box(2.1, 0.85, 0.7, std('#2c2f35', 0.6, 0.3), 0, 0.43, -0.02));
  // the box: brown card, open, its flaps to fold
  const card = std('#b98a55', 0.92), cardIn = std('#9c7244', 0.95), W = 0.44, D = 0.36, H = 0.3, y0 = 0.91;
  S.add(box(W, 0.008, D, cardIn, 0, y0 + 0.004, 0));
  S.add(box(W, H, 0.008, card, 0, y0 + H / 2, D / 2), box(W, H, 0.008, card, 0, y0 + H / 2, -D / 2), box(0.008, H, D, card, W / 2, y0 + H / 2, 0), box(0.008, H, D, card, -W / 2, y0 + H / 2, 0));
  const tape = std('#c9a774', 0.4, 0, { transparent: true, opacity: 0.85 });
  const flaps = [];
  for (const [ax, az, w, d, dir] of [[0, D / 2, W, D / 2, 1], [0, -D / 2, W, D / 2, -1], [W / 2, 0, W / 2, D, 2], [-W / 2, 0, W / 2, D, -2]]) {
    const hinge = new THREE.Group(); hinge.position.set(ax, y0 + H, az); S.add(hinge);
    const f = Math.abs(dir) === 1 ? box(w, 0.006, d, card, 0, 0, dir * d / 2) : box(w, 0.006, d, card, Math.sign(dir) * w / 2, 0, 0); hinge.add(f);
    hinge.userData = { dir }; flaps.push(hinge);
  }
  set.flaps = flaps; set.y0 = y0; set.H = H;
  const label0 = canvas(256, 96), lx = label0.getContext('2d'); lx.fillStyle = '#1b1b1b'; lx.font = `700 40px 'Segoe Script', 'Bradley Hand', cursive`; lx.fillText(last(me.name).toUpperCase(), 14, 64);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.075), new THREE.MeshBasicMaterial({ map: texOf(label0), transparent: true })); lab.position.set(0, y0 + H * 0.55, D / 2 + 0.006); S.add(lab);
  const tp = box(0.06, 0.002, D + 0.01, tape, 0, y0 + H + 0.004, 0); tp.visible = false; S.add(tp); set.tape = tp;
  // your helmet (your design) and your race suit, folded, in the team's colours
  const hel = makeHelmet(me.helmet, T.color, me.number, { driver: me.name }); hel.scale.setScalar(0.88); hel.rotation.y = -0.6; S.add(hel); set.helmet = hel;
  const suit = new THREE.Group(); const sm = std(T.color, 0.75), sa = std(apart(T.color, T.color2), 0.7);
  suit.add(box(0.34, 0.07, 0.26, sm), box(0.34, 0.012, 0.03, sa, 0, 0.036, 0.06), box(0.1, 0.02, 0.24, sm, 0.1, 0.044, 0));
  S.add(suit); set.suit = suit;
  S.add(new THREE.HemisphereLight(0xffffff, 0x3a3d42, 0.9));
  const key = new THREE.DirectionalLight(0xfff2e2, 1.7); key.position.set(0.8, 3, 2); S.add(key);
  const top = new THREE.PointLight(0xe8f0ff, 3, 4, 2); top.position.set(0, 2.2, 0.4); S.add(top);
  return set;
}
/** the garage, the door open onto the pit lane's light: you, walking out (a three-frame step) */
function garageSet(st, T, me) {
  const set = newSet('#0f1013'), S = set.scene, tc = T.color;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 14), std('#6b7078', 0.35, 0.15)); floor.rotation.x = -Math.PI / 2; floor.position.z = -2; S.add(floor);
  const lineM = new THREE.MeshBasicMaterial({ color: '#e9e9e9' });
  for (const x of [-1.6, 1.6]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 12), lineM); l.rotation.x = -Math.PI / 2; l.position.set(x, 0.002, -2); S.add(l); }
  const wallM = std(shade(tc, 0.6), 0.8), panelM = std('#e9ebef', 0.7);
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), wallM); w.position.set(s * 3.2, 2, -2); w.rotation.y = -s * Math.PI / 2; S.add(w);
    for (let k = 0; k < 5; k++) S.add(box(0.02, 1.4, 1.6, panelM, s * 3.18, 1.2, 1.5 - k * 1.9));
    for (let k = 0; k < 3; k++) S.add(box(0.5, 0.9, 0.6, std(tc, 0.5, 0.3), s * 2.8, 0.45, 0.6 - k * 2.4));
  }
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(7, 14), std('#2a2d33', 0.9)); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 4, -2); S.add(ceil);
  for (let k = 0; k < 5; k++) S.add(box(2.4, 0.04, 0.16, new THREE.MeshBasicMaterial({ color: '#f4f8ff' }), 0, 3.95, 1.5 - k * 2.2));
  // the front: the door open, the pit lane's daylight
  const lane = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4), new THREE.MeshBasicMaterial({ color: '#fbfcff' })); lane.position.set(0, 2, -8.9); S.add(lane);
  const head = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 0.6), new THREE.MeshBasicMaterial({ color: shade(tc, 0.6) })); head.position.set(0, 3.7, -8.85); S.add(head);
  const cv = canvas(1024, 128), x = cv.getContext('2d'); x.fillStyle = apart(shade(tc, 0.6), T.color2); x.textAlign = 'center'; fitFont(x, T.name.toUpperCase(), 900, 96, 1000); x.fillText(T.name.toUpperCase(), 512, 100);
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.5), new THREE.MeshBasicMaterial({ map: texOf(cv), transparent: true })); nm.position.set(0, 3.7, -8.82); S.add(nm);
  // the car you will not drive: under its cover, to one side
  const cover = std('#1d1f24', 0.95), CX = 1.75, CZ = -2.6;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 3.4, 6, 16), cover); body.rotation.x = Math.PI / 2; body.scale.set(1.0, 1, 0.62); body.position.set(CX, 0.32, CZ); S.add(body);
  const pods = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.2, 6, 12), cover); pods.rotation.z = Math.PI / 2; pods.scale.set(1, 1.55, 0.9); pods.position.set(CX, 0.3, CZ + 0.3); S.add(pods);
  for (const [dx, dz, r] of [[-0.78, -1.45, 0.29], [0.78, -1.45, 0.29], [-0.78, 1.05, 0.34], [0.78, 1.05, 0.34]]) { const w = cyl(r, r, 0.38, cover, 20); w.rotation.z = Math.PI / 2; w.position.set(CX + dx, r, CZ + dz); S.add(w); }
  S.add(box(1.8, 0.05, 0.42, cover, CX, 0.12, CZ - 2.05), box(1.0, 0.36, 0.06, cover, CX, 0.78, CZ + 1.78), box(0.06, 0.5, 0.3, cover, CX - 0.48, 0.62, CZ + 1.7), box(0.06, 0.5, 0.3, cover, CX + 0.48, 0.62, CZ + 1.7));
  // you, in your own clothes now: three steps of a walk, shown in turn
  set.walk = ['walk1', 'walk2', 'walk3'].map((pose) => person(set, { pose, kit: 'jacket', color: '#2b2f38', accent: '#d8dce3', driver: me.name }, [0, 0, 0], Math.PI / 2)).filter(Boolean);
  S.add(new THREE.HemisphereLight(0xf2f6ff, 0x3a3d42, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(0, 3, -10); S.add(key);
  const fill = new THREE.DirectionalLight(0xfff2e0, 0.5); fill.position.set(2, 3, 4); S.add(fill);
  return set;
}
/**
 * Dropped -> Promise<void>. ctx: { career, team (its name, or { name, color, color2 }), reason, who (the driver who has
 * your seat), handshake (true / false; unset: the principal's own way) }
 */
async function dismissal(ctx = {}) {
  const c = ctx.career || null, me = meInfo(c), tn = typeof ctx.team === 'object' && ctx.team ? ctx.team.name : ctx.team || c?.seat?.firedFrom || c?.myTeam;
  const T = { ...teamInfo(c, tn), ...(typeof ctx.team === 'object' && ctx.team ? { color: hexOk(ctx.team.color, teamInfo(c, tn).color), color2: hexOk(ctx.team.color2, teamInfo(c, tn).color2) } : {}) };
  const notice = c?.seat?.notice?.kind === 'fired' ? c.seat.notice.text : '';
  const who = ctx.who || (/(?:^|[.!]\s+)([^.!]+?) has your seat/.exec(notice) || [])[1] || null;
  const reason = ctx.reason ? `${String(ctx.reason).replace(/^./, (x) => x.toUpperCase()).replace(/\.?$/, '.')}` : 'The results have not been what the team needs.';
  const shake = typeof ctx.handshake === 'boolean' ? ctx.handshake : (hash(`${me.name}|${T.name}|${c?.season}|${c?.round}`) % 100) < 62;
  const st = new Stage({ renderer: ctx.renderer, color: T.color });
  const info = { c, reason, who };
  const sur = last(me.name), Xs = { sur, team: T.name };
  const H = headlinesFor('seat', 'dropped', Xs, ['f1news', 'post', 'feed'], [`${T.name} drop ${sur}`, `Axed! ${T.name} show ${sur} the door`, `Fans react as ${T.name} drop ${sur}`]);
  const n = { round: Math.max(1, (c?.round || 2) - 1), season: c?.season || 2026 };
  const items = [{ kind: 'paper', out: H[0], text: H[0].text, sub: who ? `${who} takes the seat from the next round` : 'The seat will be filled from the next round', n },
    { kind: 'paper', out: H[1], text: H[1].text, sub: `"It's a results business" - the paddock on ${sur}`, n },
    { kind: 'phone', color: '#00b3a4', app: H[2]?.name || 'Chequered', who: T.name, initials: T.name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(), text: `Thank you, ${me.name}. Everyone at ${T.name} wishes you the very best for the future.`, tag: 'THANK YOU', reply: H[2]?.text || `Fans react as ${T.name} drop ${sur}` }];
  const cap = caption(st);
  const lines = { a: pick([`I'll get straight to it, ${callName(me.name)}. We're making a change.`, `There's no easy way to say this. We're letting you go.`, `Sit down, ${callName(me.name)}. This won't take long.`]), b: shake ? pick(['For what it\'s worth, I\'m sorry. Good luck.', 'You\'ll find a seat. Good luck out there.']) : '' };
  const CTL = { stage: st, step: (dt, n2 = 1) => { for (let k = 0; k < n2; k++) st.step(dt); }, hold: (on = true) => { st.hold = on; } };
  LIVE = CTL; if (typeof window !== 'undefined') window.__contractScene = CTL;
  skipHint(st, true);
  const youEye = (top) => V3(0, top + 0.43, 0.78);
  /** the letter as you read it: close over it, square on to it as it is held */
  const readShot = (st2, S) => { const f = st2.aspect < 0.8 ? 52 : 44, el = 1.2 + TILT * 0.6, d = fitDist(PW + 0.02, PH * 0.98, f, st2.aspect, 1.04, 0.86), c = V3(0, S.top + LIFT, 0.24); return { p: c.clone().add(V3(0, Math.sin(el) * d, Math.cos(el) * d)), l: c.clone().add(V3(0, 0, 0.006)), f }; };
  const beats = [
    // 1. across the table: the principal's words, the letter slid over to you
    { dur: 4.6, build: () => sackRoomSet(st, T, me, info),
      update(S, t) {
        const face = V3(0, 1.12, -0.8), eye = youEye(S.top);
        st.shot(between({ p: eye, l: face, f: 40 }, readShot(st, S), u01(t, 2.3, 3.3)));
        cap.show('The team principal', t < 2.4 ? lines.a : '', u01(t, 0.3, 1.6));
        if (S.sit) S.sit.head.rotation.z = S.sit.bow + 0.01 * Math.sin(t * 0.8);
        // (slid across the table to you, turned round on the way; then picked up a little to be read)
        const u = ease(u01(t, 1.5, 2.5)), up = ease(u01(t, 2.5, 3.2)); S.letter.position.z = lerp(-0.28, 0.24, u); S.letter.rotation.y = Math.PI * (1 - u);
        S.letter.rotation.x = up * TILT; S.letter.position.y = S.top + 0.002 + up * LIFT;
      },
      finish(S) { cap.hide(); if (S) { S.letter.position.set(0, S.top + 0.002 + LIFT, 0.24); S.letter.rotation.set(TILT, 0, 0); } } },
    // 2. the silence; then a hand across the table - or not
    { dur: 3.6, cut: false, same: true,
      update(S, t) {
        const eye = youEye(S.top), face = V3(0, 1.12, -0.8);
        const reading = readShot(st, S), up = { p: eye, l: face, f: 40 };
        // (the letter put down again as you look up)
        const dn = ease(u01(t, 0.1, 0.8)); S.letter.rotation.x = TILT * (1 - dn); S.letter.position.y = S.top + 0.002 + LIFT * (1 - dn);
        if (shake && t > 1.6) {
          // (he stands and holds out his hand across the table; you stand, lean in and take it)
          if (S.sit) S.sit.group.visible = false; if (S.stand) S.stand.group.visible = true;
          S.stand?.group.updateMatrixWorld(true);
          const sh = S.stand ? new THREE.Vector3().copy(S.stand.wrR).applyMatrix4(S.stand.group.matrixWorld) : V3(0.17, 1.02, -0.25);
          const rise = ease(u01(t, 1.6, 2.4)), lean = ease(u01(t, 2.3, 2.9)), standEye = { p: V3(-0.05, 1.6 - lean * 0.06, 0.66 - lean * 0.14), l: sh.clone().lerp(V3(0, 1.55, -0.62), 0.5), f: 50 };
          st.shot(between(up, standEye, rise));
          const meet = ease(u01(t, 2.2, 2.85)); S.hand.visible = true;
          S.hand.position.copy(sh).add(V3(-0.01, -0.01, 0.055)).add(V3(0.2 * (1 - meet), -0.3 * (1 - meet), 0.3 * (1 - meet)));
          S.hand.position.y += Math.sin(t * 11) * 0.014 * (t > 2.85 && t < 3.45 ? 1 : 0);
          cap.show('The team principal', lines.b, u01(t, 2.6, 3.4));
        } else {
          st.shot(between(reading, up, u01(t, 0.2, 1.2)));
          // (no hand held out: he looks down at his papers and away; you stand, and that is that)
          if (!shake && S.sit) { const away = ease(u01(t, 1.3, 2.1)); S.sit.head.rotation.z = S.sit.bow + 0.32 * away; S.sit.head.rotation.y = 0.35 * away; }
          if (!shake && t > 2.0) { const rise = ease(u01(t, 2.0, 3.2)); st.shot(between(up, { p: V3(0.08, 1.62, 0.8), l: V3(0, 0.98, -0.75), f: 42 }, rise)); }
          if (t > 1.4) cap.show('', shake ? '' : 'No handshake.', u01(t, 1.6, 2.0)); else cap.hide();
        }
      },
      finish(S) { cap.hide(); if (S?.hand) S.hand.visible = false; } },
    // 3. the box: the helmet, the suit, the flaps closed
    { dur: 3.9, build: () => boxSet(st, T, me),
      update(S, t) {
        const y0 = S.y0;
        const hu = ease(u01(t, 0.15, 1.25)); S.helmet.position.set(-0.06, lerp(y0 + 0.62, y0 + 0.15, hu), 0.0); S.helmet.rotation.z = (1 - hu) * 0.35; S.helmet.rotation.y = -0.6 + (1 - hu) * 0.5;
        const su = eOut(u01(t, 1.2, 2.0)); S.suit.position.set(0.04, lerp(y0 + 0.8, y0 + 0.21, su), lerp(0.1, 0.0, su)); S.suit.rotation.y = 0.12 + (1 - su) * 0.5; S.suit.visible = t > 1.2;
        // (a flap upright and leaning out a little, folded over flat onto the box: the front and back first, the sides over them)
        S.flaps.forEach((h, k) => { const fu = ease(u01(t, 2.25 + k * 0.18, 2.6 + k * 0.18)), d = h.userData.dir, a = lerp(d === 1 ? 0.25 : 1.15, Math.PI - 0.02, fu); if (Math.abs(d) === 1) h.rotation.x = -d * a; else h.rotation.z = Math.sign(d) * a; h.position.y = y0 + S.H + (k > 1 ? 0.007 : 0); });
        S.tape.visible = t > 3.2;
        const f = 38, a = { p: V3(0.42, 1.95, 0.95), l: V3(0, y0 + 0.14, 0), f }, b = { p: V3(0.2, 1.75, 0.78), l: V3(0, y0 + 0.2, 0), f };
        const k = Math.max(1, fitDist(0.7, 0.62, f, st.aspect, 1.0) / 1.2); for (const s of [a, b]) s.p.sub(s.l).multiplyScalar(k).add(s.l);
        st.shot(between(a, b, u01(t, 0, 3.9)));
      } },
    // 4. the headline
    { dur: 3.6, build: () => newsSet(st, items, T, me),
      update(S, t) {
        st.shot(newsCam(st, t / 3.6, S.tall));
        S.papers.forEach((g, k) => { const D = g.userData, t0 = 0.2 + k * 0.8, uu = u01(t, t0, t0 + 0.6), e = eIn(uu); g.visible = t >= t0; g.position.set(lerp(D.x * 0.2, D.x, e), lerp(1.55, D.y, e), lerp(D.z * 0.2 + 0.15, D.z, e)); g.rotation.y = D.r + (reduced() ? 0 : (1 - e) * Math.PI * 4.2); if (uu >= 1 && !D.landed) { D.landed = true; st.shake = 0.12; } });
        if (S.phone) { const g = S.phone, D = g.userData, uu = eOut(u01(t, 1.95, 2.5)); g.visible = t >= 1.95; g.position.set(D.x + (1 - uu) * 0.4, 0.026, D.z + (1 - uu) * 0.9); g.rotation.y = D.r - (1 - uu) * 0.4; }
      } },
    // 5. out of the garage
    { dur: 4.8, build: () => garageSet(st, T, me),
      update(S, t) {
        const z = 1.2 - t * 1.25, W = S.walk, f = Math.floor(t * 4.2) % 4, fr = [0, 1, 2, 1][f];
        W.forEach((p, k) => { p.group.visible = k === fr; p.group.position.set(0, 0, z); });
        // (behind you as you go, further back on a tall screen so that the garage is around you)
        const tall = st.aspect < 0.8; st.shot(tall ? { p: V3(0.2, 1.9, z + 3.9 + t * 0.15), l: V3(0, 1.05, z - 2.6), f: 52 } : { p: V3(0.55, 1.75, z + 2.7 + t * 0.15), l: V3(0, 1.15, z - 2.2), f: 42 });
        st.fade = Math.max(st.fade, u01(t, 4.1, 4.8));
        st.flash = 0.55 * u01(t, 3.0, 4.6);
      } },
  ];
  return new Promise((resolve) => {
    let done = false, ctl = null;
    const close = () => {
      if (done) return; done = true;
      window.removeEventListener('keydown', onKey, true); st.el.removeEventListener('pointerup', onUp); unkeys(); cap.hide();
      if (LIVE === CTL) LIVE = null; if (typeof window !== 'undefined' && window.__contractScene === CTL) window.__contractScene = null;
      const out = () => { st.tick = null; ctl?.all(); st.dispose(); resolve(); };
      let k = 0; st.tick = (dt) => { k += dt; st.fade = Math.min(1, k / 0.25); if (k >= 0.28) out(); };
      if (reduced()) out();
    };
    const onKey = (e) => { const k = e.key; if (k === 'Escape') ctl?.all(); else if (k === ' ' || k === 'Enter' || k === 'ArrowRight') ctl?.skip(); else return; e.preventDefault(); e.stopPropagation(); };
    const onUp = () => ctl?.skip();
    window.addEventListener('keydown', onKey, true); st.el.addEventListener('pointerup', onUp);
    const unkeys = keys(st.el, {});
    reel(st, beats, { ctl: (x) => { ctl = x; CTL.reel = x; } }).then(close);
  });
}

/** for the test console: the cutscene that is up (its stage; step(dt, n) with hold(true) runs it frame by frame) */
export const contractSceneLive = () => LIVE;
/** the scenes are registered (ui/Offers.js) the moment this module loads; a page that imports it needs nothing else */
export const CONTRACT_SCENES = { table: contractTable, dropped: dismissal };
setOfferScene(contractTable);
setDroppedScene(dismissal);
