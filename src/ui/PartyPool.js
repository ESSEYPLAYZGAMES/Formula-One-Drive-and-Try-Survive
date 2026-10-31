// The pool club: Tidewater Beach Club at the Meridian Grand, Las Vegas - the Strip's own kind of dayclub and night swim,
// for the race weekend's after-parties and the days out (ui/PartyVenues.js's party engine runs it; ui/Hangout.js builds
// it in its Kit, as every venue). Made after the real ones - Encore Beach Club, Marquee, Drai's, Wet Republic: one big
// party pool about a metre deep, so the crowd stands in it waist-deep facing the DJ, a sun shelf of shin-deep water with
// loungers set into it along the near side, two go-go podiums rising out of the water; daybeds down both sides (some
// under canopies), cabanas behind them (curtains, a sofa, a bottle on ice), two VIP bungalows with plunge pools of their
// own either side of the stage; the DJ's stage at the far end under a truss and a shade sail - an LED wall, line arrays,
// subs - the resort's curved bronze tower rising behind it; date palms in stone planters; a long bar against the resort's
// pool wing, where you come in, and an island bar; travertine underfoot, and the Strip all round.
// By day (P.day) the desert sun, the umbrellas open, the light netting across the pool floor and the sun's glint on the
// water; by night the pool lit from inside, the palms lit from below, LED under the daybeds, beams sweeping from the truss
// and the city's lights over the walls.
// Built for the Intel UHD laptop: no light added anywhere, no shadow maps (by day the shadows are decals cast along the
// sun - the canopies' squares, the palms' crowns and trunks - never over the water), every static piece merged by
// Hangout's Kit, one water mesh with its own small shader (a few travelling waves, the sky's reflection by the Fresnel
// term, the sun's glint: nothing allocated per frame, only a clock uniform) over a multiply layer for what the water
// absorbs (so legs under it read tinted, not pale), one additive caustic layer, the ripples
// round anyone standing in the water one instanced mesh refreshed four times a second, the beams one mesh swept in its
// vertex shader, the LED wall a texture scrolled. The crowd is world/PartyCrowd.js's (PoolCrowd below: its swimwear when
// People has it - in the water then; until then everyone on the deck), on the decks, the daybeds and in the cabanas.
//
// ==== THE CONTRACT (the party engine's venue builders: ui/PartyVenues.js / ui/PartyPlay.js) =========================
// import { poolclub, POOL_PLACES, POOL_HOSTED, POOL_FOOTPRINT, POOL_ORDERS, POOL_ALIAS, PoolCrowd, poolOccasion, poolDriverLook } from './PartyPool.js';
// POOL_PLACES { poolclub (the night swim, 23:45-04:30), dayclub (the dayclub, 13:00-18:30, P.day: built by day) } ->
//   merge into PARTY_PLACES (and Hangout's PLACES); each { name, kind, city, where, privacy, hc, start, late, close, rate,
//   cap, sealed: false (open air: the city is the view), age 21, host 'club', occasion 'pool', club: true, day?, build }.
// POOL_HOSTED / POOL_FOOTPRINT / POOL_ORDERS / POOL_ALIAS: the same, for HOSTED, HANGOUT_FOOTPRINT, PARTY_ORDERS, ALIAS.
// Hosted, it wants a raised anchor: the deck is the roof of the resort's pool podium (as Drai's and Marquee are), the
//   basin hanging 1.3 m into it - at ground level the world's terrain would cover the water. E.ay >= 4 builds the
//   podium down to the street in the city's own window look (E.hx.win), and the resort's wings either end.
// poolclub(K, E) -> ui/PartyVenues.js's builder contract in full (its header): Hangout's venue contract (light, lift,
//   moods + energy/occ/bpm, start, date, group, seats, staff, paps, bed, moment, where, photoBack) plus zones (ZL arrays:
//   floor, dj, bar, vip, quiet, door, tables), spots by role (each with its zone), crowdSpots ([{ x, z, y, yaw, zone, role,
//   pose, from, seat?, lean?, brand? }] - y below 0 is standing in the pool; clear of every hero spot by 0.75 m; <= 96),
//   beat, club: true (Hangout plays the club music and crowd loops), bartop, exits, wall (the step-and-repeat), booths
//   (the cabanas' tables, yours first), service, props, led { wall, say }, people { dj, security }, terrace / zoneLight
//   null, heightAt(x, z) (the stage, the bungalow decks, the pool's floor) - and its own: crowdMake(o) -> a PoolCrowd
//   (PartyCrowd's options; Hangout's party crowd should be made with it when V.crowdMake is there), crowdPools (pools
//   to merge), water { mesh, level, rects, caustics, wet }, screens.
//   E (the Evening): P (its place - P.day), night, occ ('pool': swimwear, people in the water), isParty, host, hx, ay,
//   scene, queue, pos, yaw, cam, clock, t, lib. A party (E.isParty): Hangout and PartyPlay run the crowd; an ordinary
//   evening: this builds and runs its own (the same PoolCrowd, the same spots).
// ======================================================================================================================


import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as People from '../world/People.js';
import * as Celebs from '../career/Celebs.js';
import { SKINS } from '../world/Crowd.js';
import { PartyCrowd } from '../world/PartyCrowd.js';
import { PoolBrain } from '../world/PoolLife.js';
import { poolPlay } from './PoolPlay.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/** a seeded generator (mulberry32) -> () => 0..1 */
const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hashS = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const pickR = (R, a) => a[Math.floor(R() * a.length) % a.length];
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
/** a person's (or a frame's) turn to face (dx, dz) - Hangout's spots face +x unturned */
const facing = (dx, dz) => Math.atan2(-dz, dx);
/** a rect from two corners; a zone: its rects as an array that also carries their bounding rect (ui/PartyVenues.js's ZL) */
const Rect = (x0, z0, x1, z1, y) => ({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), ...(y != null ? { y } : {}) });
const ZL = (...rs) => Object.assign(rs, rs.length ? { x0: Math.min(...rs.map((r) => r.x0)), z0: Math.min(...rs.map((r) => r.z0)), x1: Math.max(...rs.map((r) => r.x1)), z1: Math.max(...rs.map((r) => r.z1)) } : { x0: 0, z0: 0, x1: -1, z1: -1 });
const REDUCED = (() => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch (_) { return false; } })();

// ---- the plan (metres: x east, z south, y up; the deck at 0) -----------------------------------------------------------
// (the pool: 22 x 12.6 m, 1.05 m deep - waist-deep on most adults, as the party pools on the Strip are kept - its water
// 12 cm under the coping; the sun shelf the near 2 m of it, 32 cm deep)
const DECK = { x0: -24, z0: -18.4, x1: 24, z1: 15.6 };
const POOL = { x0: -11, z0: -11.6, x1: 11, z1: 1.0, shelf: -1.0, cope: 0.3, wl: -0.12, deep: -1.05, ledge: -0.32 };
const STAGE = { x0: -7.5, x1: 7.5, z0: -18.4, z1: -12.4, h: 1.2 };
const BUNG = { x0: 10.2, x1: 23.6, z0: -18.2, z1: -14.4, h: 0.45 };   // (the east one; the west mirrored)
const DAYBED_Z = [-10.0, -6.8, -3.6, -0.4], DAYBED_X = 14.6;
const CABANA_Z = [-11.9, -7.3, -2.7, 1.9], CABANA_X = 20.3;
const BAR = { x0: -17.5, x1: -8.5, z: 12.8 };        // (the long bar against the pool wing: its counter's middle line)
const ISLAND = { x: 14.0, z: 8.4 };
const MYCAB = { x: -CABANA_X, z: CABANA_Z[2] };      // (your cabana: the west row's third)

// =====================================================================================================================
// textures (seeded canvases: the venue looks the same every time)
// =====================================================================================================================
function ctex(w, h, draw, rep = null) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
function vgrad(x, w, h, stops) { const g = x.createLinearGradient(0, 0, 0, h); for (const [p, c] of stops) g.addColorStop(p, c); x.fillStyle = g; x.fillRect(0, 0, w, h); }
/** travertine pavers, 60 cm square (the canvas: 2.4 m), each its own warm cream, veined and pitted, in pale grout */
function paverTex(R) {
  return ctex(512, 512, (x, w, h) => {
    x.fillStyle = '#b9ab94'; x.fillRect(0, 0, w, h);
    const n = 4, s = w / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      x.fillStyle = `hsl(${34 + R() * 7},${20 + R() * 9}%,${83 + R() * 6}%)`; x.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3);
      for (let k = 0; k < 7; k++) { x.strokeStyle = `rgba(150,124,92,${0.06 + R() * 0.12})`; x.lineWidth = 0.6 + R() * 1.6; x.beginPath(); const y0 = j * s + 4 + R() * (s - 8); x.moveTo(i * s + 2, y0); for (let t = 1; t <= 6; t++) x.lineTo(i * s + 2 + (t * (s - 4)) / 6, y0 + (R() - 0.5) * 7); x.stroke(); }
      for (let k = 0; k < 46; k++) { x.fillStyle = `rgba(118,98,76,${0.12 + R() * 0.25})`; x.fillRect(i * s + 3 + R() * (s - 8), j * s + 3 + R() * (s - 8), 0.8 + R() * 2.6, 0.7 + R() * 1.3); }
    }
  }, [1, 1]);
}
/** a pool's glass mosaic, 2.5 cm tiles (the canvas: 40 cm) */
function tileTex(R, cols, grout) {
  return ctex(256, 256, (x, w) => { x.fillStyle = grout; x.fillRect(0, 0, w, w); const n = 16, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = cols[(R() * cols.length) | 0]; x.fillRect(i * s + 1, j * s + 1, s - 2, s - 2); } }, [1, 1]);
}
/** teak decking: planks along the canvas, grain and joints */
function teakTex(R) {
  return ctex(256, 256, (x, w, h) => {
    const n = 6, s = h / n;
    for (let j = 0; j < n; j++) {
      x.fillStyle = `hsl(${24 + R() * 6},${38 + R() * 10}%,${36 + R() * 8}%)`; x.fillRect(0, j * s, w, s);
      for (let k = 0; k < 14; k++) { x.strokeStyle = `rgba(40,24,12,${0.08 + R() * 0.12})`; x.lineWidth = 0.7; x.beginPath(); const y = j * s + R() * s; x.moveTo(0, y); x.bezierCurveTo(w * 0.3, y + (R() - 0.5) * 6, w * 0.7, y + (R() - 0.5) * 6, w, y); x.stroke(); }
      x.fillStyle = 'rgba(20,12,6,.55)'; x.fillRect(0, j * s, w, 1.5); const cut = R() * w; x.fillRect(cut, j * s, 1.5, s);
    }
  }, [1, 1]);
}
/** clipped hedge: leaves on leaves */
function hedgeTex(R) {
  return ctex(256, 256, (x, w, h) => { x.fillStyle = '#2f4a24'; x.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { x.fillStyle = `hsl(${88 + R() * 30},${30 + R() * 25}%,${16 + R() * 22}%)`; const r = 1 + R() * 3; x.beginPath(); x.ellipse(R() * w, R() * h, r, r * 0.6, R() * 3, 0, TAU); x.fill(); } }, [1, 1]);
}
/** an ornamental grass's blades (fountain grass): fine arcs up and out from the base, a few plumes, on clear (alpha-tested) */
function grassTex(R) {
  return ctex(128, 128, (x, w, h) => {
    x.clearRect(0, 0, w, h); x.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      const bx = w / 2 + (R() - 0.5) * 22, lean = (R() - 0.5) * 2.2, len = h * (0.55 + R() * 0.42), ex = bx + lean * len * 0.5, ey = h - len;
      x.strokeStyle = `hsl(${62 + R() * 30},${28 + R() * 22}%,${26 + R() * 22}%)`; x.lineWidth = 1 + R() * 1.1;
      x.beginPath(); x.moveTo(bx, h); x.quadraticCurveTo(bx + lean * len * 0.1, h - len * 0.6, ex, ey); x.stroke();
    }
    for (let i = 0; i < 9; i++) { const px = w / 2 + (R() - 0.5) * 70, py = h * (0.08 + R() * 0.2); x.fillStyle = `rgba(${210 + (R() * 30) | 0},${190 + (R() * 30) | 0},${150 + (R() * 30) | 0},1)`; x.beginPath(); x.ellipse(px, py, 3, 9, (R() - 0.5) * 0.8, 0, TAU); x.fill(); }
  });
}
/** a tuft of grass: two crossed planes of grassTex, h tall, standing on (x, y, z) */
function tuft(K, mat, x, y, z, h, R) { const a = R() * Math.PI; for (const d of [0, Math.PI / 2]) K.add(mat, new THREE.PlaneGeometry(h * 0.95, h), x, y + h / 2, z, a + d); }
/** a date palm's frond: the rachis down the middle, its leaflets angled out either side, on clear (alpha-tested) */
function frondTex(R) {
  return ctex(256, 64, (x, w, h) => {
    x.clearRect(0, 0, w, h); x.lineCap = 'round';
    for (let i = 6; i < w - 3; i += 2.9) {
      const u = i / w, L = (h / 2 - 2) * Math.sin(Math.PI * Math.min(1, u * 1.08 + 0.04)) * (1 - 0.3 * u);
      for (const s of [-1, 1]) { x.strokeStyle = `hsl(${74 + R() * 24},${30 + R() * 20}%,${22 + R() * 15}%)`; x.lineWidth = 1.2 + R() * 0.7; x.beginPath(); x.moveTo(i, h / 2); x.quadraticCurveTo(i + L * 0.3, h / 2 + s * L * 0.55, i + L * 0.62 + (R() - 0.5) * 2, h / 2 + s * L * (0.92 + R() * 0.08)); x.stroke(); }
    }
    x.strokeStyle = '#7a7444'; x.lineWidth = 3.2; x.beginPath(); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.stroke();
  });
}
/** a date palm's trunk: the diamond-cut leaf bases, row on row */
function trunkTex(R) {
  return ctex(64, 128, (x, w, h) => {
    x.fillStyle = '#6e5a44'; x.fillRect(0, 0, w, h);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 4; i++) {
      const cx = i * 16 + (j % 2 ? 8 : 0), cy = j * 16 + 8; x.fillStyle = `hsl(${28 + R() * 8},${18 + R() * 10}%,${34 + R() * 10}%)`;
      x.beginPath(); x.moveTo(cx, cy - 9); x.lineTo(cx + 8.5, cy); x.lineTo(cx, cy + 9); x.lineTo(cx - 8.5, cy); x.closePath(); x.fill();
      x.strokeStyle = 'rgba(30,20,12,.55)'; x.lineWidth = 1.4; x.stroke();
      if (cx < 8) { x.save(); x.translate(w, 0); x.beginPath(); x.moveTo(cx, cy - 9); x.lineTo(cx + 8.5, cy); x.lineTo(cx, cy + 9); x.lineTo(cx - 8.5, cy); x.closePath(); x.fill(); x.stroke(); x.restore(); }
    }
  }, [1, 1]);
}
/** a truss's lattice (alpha-tested): the chords along the edges, a zig-zag of braces */
function trussTex() {
  return ctex(64, 64, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = '#c8ccd2'; x.lineWidth = 5; x.strokeRect(2.5, 2.5, w - 5, h - 5); x.lineWidth = 3; x.beginPath(); x.moveTo(3, 3); x.lineTo(w - 3, h - 3); x.moveTo(w - 3, 3); x.lineTo(3, h - 3); x.stroke(); }, [1, 1]);
}
/** the stage's LED wall: waves of colour, a sun, the LED grid - all of it periodic across the width, so it scrolls */
function ledTex(R) {
  return ctex(512, 256, (x, w, h) => {
    x.fillStyle = '#05030a'; x.fillRect(0, 0, w, h);
    const g = x.createLinearGradient(0, 0, w, 0); for (const [p, c] of [[0, '#ff2f9e'], [0.25, '#7a3cff'], [0.5, '#18d2ff'], [0.75, '#ffb21a'], [1, '#ff2f9e']]) g.addColorStop(p, c);
    for (let k = 0; k < 7; k++) { x.strokeStyle = g; x.lineWidth = 5 + k * 3; x.globalAlpha = 0.9 - k * 0.1; x.beginPath(); for (let i = 0; i <= w; i += 4) { const y = h * 0.52 + Math.sin((i / w) * TAU * 2 + k * 0.8) * h * (0.1 + k * 0.045); if (i) x.lineTo(i, y); else x.moveTo(i, y); } x.stroke(); }
    x.globalAlpha = 1;
    for (const cx of [w * 0.25, w * 0.75]) { const rg = x.createRadialGradient(cx, h * 0.4, 3, cx, h * 0.4, h * 0.34); rg.addColorStop(0, 'rgba(255,244,214,.95)'); rg.addColorStop(0.45, 'rgba(255,150,70,.6)'); rg.addColorStop(1, 'rgba(255,60,130,0)'); x.fillStyle = rg; x.fillRect(cx - h * 0.4, 0, h * 0.8, h); }
    x.fillStyle = 'rgba(0,0,0,.42)'; for (let i = 0; i < w; i += 4) x.fillRect(i, 0, 1, h); for (let j = 0; j < h; j += 4) x.fillRect(0, j, w, 1);
  }, [1, 1]);
}
/** a lit sign: the words in white on black (rendered additive, so the black is nothing) */
function signTex(text, sub, col = '#ffffff', w = 1024, h = 160) {
  return ctex(w, h, (x) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = col; x.shadowBlur = 18; x.fillStyle = col; x.font = `600 ${h * (sub ? 0.5 : 0.62)}px 'Didot', 'Bodoni MT', Georgia, serif`;
    x.fillText(text, w / 2, h * (sub ? 0.4 : 0.52)); if (sub) { x.shadowBlur = 8; x.font = `500 ${h * 0.17}px 'Segoe UI', Arial, sans-serif`; x.fillText(sub, w / 2, h * 0.82); }
  });
}
/** a beam of light along its length: brightest at the lamp, fading out and soft at its edges */
function beamTex() {
  return ctex(32, 256, (x, w, h) => {
    const img = x.createImageData(w, h), d = img.data;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const u = (i + 0.5) / w - 0.5, v = j / h, a = Math.exp(-u * u * 38) * Math.pow(1 - v, 1.5) * (0.35 + 0.65 * (1 - v)), o = (j * w + i) * 4; d[o] = d[o + 1] = d[o + 2] = Math.round(255 * a); d[o + 3] = 255; }
    x.putImageData(img, 0, 0);
  });
}
/** the light netted across a pool's floor (a tiling cell pattern: bright where two cells meet) */
function causticTex() {
  return ctex(128, 128, (x, w, h) => {
    const R = rng(77), P = []; for (let i = 0; i < 22; i++) P.push([R() * w, R() * h]);
    const img = x.createImageData(w, h), d = img.data;
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
      let f1 = 1e9, f2 = 1e9;
      for (const [cx, cy] of P) { let dx = Math.abs(px - cx), dy = Math.abs(py - cy); if (dx > w / 2) dx = w - dx; if (dy > h / 2) dy = h - dy; const dd = dx * dx + dy * dy; if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd; }
      const e = Math.sqrt(f2) - Math.sqrt(f1), c = Math.round(255 * Math.pow(Math.max(0, 1 - e / 3.4), 2.4)), o = (py * w + px) * 4; d[o] = d[o + 1] = d[o + 2] = c; d[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
  }, [1, 1]);
}
/** the sky dome's gradient: the desert's deep blue to the pale horizon by day; by night the dark over a lit city */
function skyTex(night) {
  return ctex(16, 512, (x, w, h) => vgrad(x, w, h, night ? [[0, '#03040b'], [0.3, '#0a0d22'], [0.45, '#22183a'], [0.495, '#5a3446'], [0.505, '#20161c'], [1, '#08080a']] : [[0, '#2a64c4'], [0.28, '#4a86d6'], [0.44, '#9cc2e6'], [0.495, '#e4ecef'], [0.505, '#b4a892'], [1, '#8a806c']]));
}
/** the mountains round the valley by day: the Spring Mountains' hazy blue-brown ridges on clear */
function ridgeTex(R) {
  return ctex(1024, 128, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    for (const [col, amp, base] of [['rgba(150,146,160,.75)', 0.55, 0.92], ['rgba(122,112,116,.9)', 0.38, 1.0]]) {
      x.fillStyle = col; x.beginPath(); x.moveTo(0, h);
      const ph = R() * 10; for (let i = 0; i <= w; i += 4) { const u = i / w, y = h * base - h * amp * (0.35 + 0.35 * Math.sin(u * TAU * 3 + ph) * Math.sin(u * TAU * 1.3 + ph * 2) + 0.18 * Math.sin(u * TAU * 11 + ph) * Math.sin(u * TAU * 2.1)); x.lineTo(i, Math.min(h, y)); }
      x.lineTo(w, h); x.closePath(); x.fill();
    }
  }, [1, 1]);
}
/**
 * A building's face, one tile = 8 bays of 1.5 m by 8 floors of 3.3 m (12 x 26.4 m: FAC_W x FAC_H) - tone 0 blue-grey
 * glass, 1 the resort's bronze glass (its vertical fins), 2 the pool wings' cream render with a window in each bay and a
 * balcony slab at each floor. By night the same, dark, a share of the rooms lit - warm mostly, a few cool TV-lit ones,
 * dim as real windows are from outside - and the empty ones holding a little of the sky
 */
const FAC_W = 12, FAC_H = 26.4;
function facadeTex(R, night, tone = 0) {
  return ctex(256, 512, (x, w, h) => {
    const cw = w / 8, ch = h / 8;
    if (night) {
      x.fillStyle = tone === 2 ? '#1a1612' : '#07080c'; x.fillRect(0, 0, w, h);
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        const on = R() < (tone === 1 ? 0.34 : 0.42), a = on ? 0.22 + R() * 0.42 : 0.05 + R() * 0.06, warm = R() < 0.8;
        x.fillStyle = on ? (warm ? `rgba(255,${176 + (R() * 50) | 0},${104 + (R() * 50) | 0},${a})` : `rgba(${150 + (R() * 50) | 0},${190 + (R() * 40) | 0},255,${a})`) : `rgba(70,84,120,${a})`;
        const iw = tone === 2 ? 0.62 : 0.86, ih = tone === 2 ? 0.58 : 0.8; x.fillRect(i * cw + cw * (1 - iw) / 2, j * ch + ch * 0.08, cw * iw, ch * ih);
        if (on && R() < 0.4) { x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(i * cw + cw * (1 - iw) / 2, j * ch + ch * 0.08, cw * iw * (0.3 + R() * 0.4), ch * ih); }   // (a curtain half drawn)
      }
      for (let j = 0; j < 8; j++) { x.fillStyle = tone === 2 ? 'rgba(40,32,26,.9)' : 'rgba(0,0,0,.6)'; x.fillRect(0, j * ch + ch * 0.9, w, ch * 0.1); }
      if (tone === 1) for (let i = 0; i <= 8; i++) { x.fillStyle = 'rgba(120,86,46,.5)'; x.fillRect(i * cw - 1.5, 0, 3, h); }
    } else if (tone === 2) {
      x.fillStyle = '#e2d6c2'; x.fillRect(0, 0, w, h);
      for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(${150 + (R() * 60) | 0},${130 + (R() * 50) | 0},${100 + (R() * 40) | 0},${0.05 + R() * 0.08})`; x.fillRect(R() * w, R() * h, 1 + R() * 3, 1 + R() * 3); }
      for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 8; i++) { const g = x.createLinearGradient(0, j * ch, 0, j * ch + ch * 0.7); g.addColorStop(0, '#3c4c5a'); g.addColorStop(1, '#6f8597'); x.fillStyle = g; x.fillRect(i * cw + cw * 0.19, j * ch + ch * 0.12, cw * 0.62, ch * 0.62); x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(i * cw + cw * 0.19, j * ch + ch * 0.12, cw * 0.62, 2); }
        x.fillStyle = '#f2ece2'; x.fillRect(0, j * ch + ch * 0.8, w, ch * 0.08); x.fillStyle = 'rgba(70,56,40,.35)'; x.fillRect(0, j * ch + ch * 0.88, w, ch * 0.05);
      }
    } else {
      vgrad(x, w, h, tone ? [[0, '#b48a55'], [0.5, '#9a7444'], [1, '#7a5a36']] : [[0, '#8fa9c2'], [0.55, '#6c86a2'], [1, '#55687e']]);
      for (let j = 0; j < 8; j++) { x.fillStyle = `rgba(255,255,255,${0.02 + R() * 0.06})`; x.fillRect(0, j * ch, w, ch * 0.86); x.fillStyle = tone ? 'rgba(60,40,22,.5)' : 'rgba(40,50,62,.45)'; x.fillRect(0, j * ch + ch * 0.88, w, ch * 0.12); }
      for (let i = 0; i <= 8; i++) { x.fillStyle = tone ? 'rgba(212,170,110,.55)' : 'rgba(46,56,70,.45)'; x.fillRect(i * cw - (tone ? 2 : 1), 0, tone ? 4 : 2, h); }
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    }
  }, [1, 1]);
}
/** the street grid from the podium's roof: by day the roads and the hot pale lots, by night the street lights */
function groundTex(R, night) {
  return ctex(512, 512, (x, w, h) => {
    x.fillStyle = night ? '#07080c' : '#8c8478'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 1200; i++) { x.fillStyle = night ? `rgba(255,${160 + (R() * 80) | 0},90,${R() * 0.6})` : `rgba(${100 + (R() * 80) | 0},${96 + (R() * 70) | 0},${90 + (R() * 60) | 0},${0.2 + R() * 0.3})`; const s = night ? 1.5 : 3 + R() * 9; x.fillRect(R() * w, R() * h, s, s); }
    for (let i = 0; i < 8; i++) { const p = (i + 0.5) * (w / 8); x.fillStyle = night ? 'rgba(255,170,80,.35)' : 'rgba(58,58,62,.9)'; x.fillRect(p - 4, 0, 8, h); x.fillRect(0, p - 4, w, 8); }
  }, [1, 1]);
}

// =====================================================================================================================
// building blocks (each in the Kit's frame; someone sitting on a piece faces its frame's +x)
// =====================================================================================================================
/** a geometry made mergeable (as Hangout's: non-indexed, position / normal / uv only) */
const norm = (g) => {
  const n = g.index ? g.toNonIndexed() : g; if (n !== g) g.dispose();
  for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k);
  if (!n.attributes.normal) n.computeVertexNormals();
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  n.morphAttributes = {}; return n;
};
/** a floor from x0, z0 to x1, z1 at y, its texture tm metres a repeat, laid in the venue's own grid (no seam between pieces) */
function floorW(K, mat, x0, z0, x1, z1, tm, y = 0) {
  const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0); g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
  const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / tm, -p.getZ(i) / tm);
  K.add(mat, g, 0, y, 0);
}
/** a wall panel (facing ry, w x h from y0), its texture tm metres a repeat */
function panel(K, mat, x, y0, z, w, h, ry, tm = 0.4) { K.plane(mat, x, y0 + h / 2, z, w, h, ry, false, [w / tm, h / tm]); }
/** the shapes of the day's shadows on the deck: a canopy's (a square, its edge a little soft - the sun is half a degree
 * across) and a palm crown's (fronds out from the middle, the light coming through between the leaflets) */
const SHADE_TEX = new WeakMap();
function shadeTex(K) {
  let T = SHADE_TEX.get(K); if (T) return T;
  const rect = K.t(ctex(128, 128, (x, w) => { x.clearRect(0, 0, w, w); x.filter = 'blur(3px)'; x.fillStyle = '#fff'; x.fillRect(10, 10, w - 20, w - 20); x.filter = 'none'; }));
  const palmT = K.t(ctex(256, 256, (x, w) => {
    x.clearRect(0, 0, w, w); const R = rng(91), c = w / 2; x.filter = 'blur(1.2px)'; x.strokeStyle = '#fff'; x.lineCap = 'round';
    for (let i = 0; i < 17; i++) {
      const a = (i / 17) * TAU + R() * 0.3, L = c * (0.72 + R() * 0.26);
      x.lineWidth = 3; x.beginPath(); x.moveTo(c, c); x.lineTo(c + Math.cos(a) * L, c + Math.sin(a) * L); x.stroke();
      for (let t = 0.12; t < 0.98; t += 0.055) { const px = c + Math.cos(a) * L * t, py = c + Math.sin(a) * L * t, ll = L * 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.1)); x.lineWidth = 2.2; for (const s of [-1, 1]) { const b = a + s * 0.9; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(b) * ll, py + Math.sin(b) * ll); x.stroke(); } }
    }
    x.fillStyle = '#fff'; x.beginPath(); x.arc(c, c, w * 0.05, 0, TAU); x.fill(); x.filter = 'none';
  }));
  T = { rect, palm: palmT }; SHADE_TEX.set(K, T); return T;
}
/** a shadow on the deck by day (kind 'rect': under a canopy, an umbrella, a roof; 'palm': a palm's crown) - none falls on the water */
function shade(K, x, z, w, d, a = 0.3, y = 0.006, kind = 'rect') {
  const P = POOL; if (x + w / 2 > P.x0 - P.cope && x - w / 2 < P.x1 + P.cope && z + d / 2 > P.z0 - P.cope && z - d / 2 < P.z1 + P.cope) return;
  K.plane(K.e('#000000', { map: shadeTex(K)[kind], opacity: kind === 'palm' ? 0.34 : 0.44, fixed: true, depthWrite: false }), x, y, z, w, d, 0, true);
}
/** a sofa len long along the frame's z, its seat facing +x (Hangout's) */
function sofa(K, M, x, z, len, face, sh = 0.44) {
  K.at(x, z, face, () => {
    K.box(M.frame, 0, 0.06, 0, 0.92, sh - 0.16, len); K.box(M.frame, -0.36, 0.06, 0, 0.2, 0.8, len);
    for (const s of [-1, 1]) K.box(M.frame, 0.02, 0.06, s * (len / 2 - 0.09), 0.88, 0.56, 0.18);
    const n = Math.max(2, Math.round((len - 0.36) / 0.75)), cw = (len - 0.36) / n;
    for (let i = 0; i < n; i++) { const zz = -len / 2 + 0.18 + (i + 0.5) * cw; K.box(M.cushion, 0.08, sh - 0.1, zz, 0.66, 0.14, cw - 0.025); K.box(M.cushion, -0.2, sh + 0.02, zz, 0.16, 0.44, cw - 0.05); }
    for (const s of [-1, 1]) { K.box(M.foot || M.frame, 0.36, 0, s * (len / 2 - 0.1), 0.05, 0.06, 0.05); K.box(M.foot || M.frame, -0.36, 0, s * (len / 2 - 0.1), 0.05, 0.06, 0.05); }
    K.solid(-0.46, -len / 2, 0.46, len / 2);
  });
}
/** a bottle of champagne on ice in a steel bucket, and two flutes */
function iceBucket(K, M, x, y, z) {
  K.cyl(M.steel, x, y, z, 0.12, 0.1, 0.24, 14); K.cyl(M.ice, x, y + 0.2, z, 0.11, 0.11, 0.02, 12);
  K.cyl(M.bottle, x + 0.02, y + 0.12, z, 0.042, 0.042, 0.24, 10); K.cyl(M.bottle, x + 0.02, y + 0.36, z, 0.016, 0.04, 0.08, 8); K.cyl(M.foil, x + 0.02, y + 0.44, z, 0.017, 0.017, 0.06, 6);
  for (const d of [-0.2, 0.2]) { K.cyl(M.flute, x + 0.22, y, z + d, 0.03, 0.03, 0.005, 10); K.cyl(M.flute, x + 0.22, y, z + d, 0.004, 0.004, 0.08, 5); K.cyl(M.flute, x + 0.22, y + 0.08, z + d, 0.024, 0.017, 0.12, 10); }
}
/**
 * A daybed (2.2 m along the frame's z, 1.7 deep): a white plinth floating on a dark recess, a thick mattress (its top at
 * 0.46), a padded back leaning back, two pillows in the accent, a rolled towel; o.canopy: four slim posts, a fabric top
 * and its valance, the sheer drapes tied back at the rear posts. Sitters face +x (the pool)
 */
function daybed(K, M, x, z, face, o = {}) {
  K.at(x, z, face, () => {
    K.box(M.recess, 0, 0, 0, 1.56, 0.08, 2.06); K.box(M.bedbase, 0, 0.08, 0, 1.7, 0.24, 2.2); K.box(M.mattress, 0.03, 0.32, 0, 1.64, 0.14, 2.14);
    K.add(M.mattress, new THREE.BoxGeometry(0.2, 0.44, 2.04), -0.66, 0.66, 0, 0, 0, 0.2);
    for (const s of [-1, 1]) K.add(o.pill || M.pill, new THREE.BoxGeometry(0.14, 0.34, 0.5), -0.48, 0.62, s * 0.6, 0, 0, 0.26);
    K.bar(M.towel, 0.55, 0.53, s1(o) * 0.62, 0.07, 0.5, Math.PI / 2, 10);
    if (o.led) { K.box(o.led, 0.851, 0.1, 0, 0.01, 0.035, 2.1); K.pool(o.ledCol, 1.0, 0, 0.95, 0.22, 0.008); }
    if (o.canopy) {
      for (const [a, b] of [[0.81, 1.06], [0.81, -1.06], [-0.81, 1.06], [-0.81, -1.06]]) K.box(M.post, a, 0.32, b, 0.06, 2.1, 0.06);
      for (const s of [-1, 1]) { K.box(M.post, 0, 2.38, s * 1.06, 1.68, 0.06, 0.06); K.box(M.post, s * 0.81, 2.38, 0, 0.06, 0.06, 2.18); }
      K.plane(M.fabric, 0, 2.45, 0, 1.76, 2.24, 0, true);
      for (const s of [-1, 1]) { K.box(M.fabric, 0, 2.18, s * 1.11, 1.78, 0.26, 0.012); K.box(M.fabric, s * 0.86, 2.18, 0, 0.012, 0.26, 2.24); }
      for (const s of [-1, 1]) K.cyl(M.sheer, -0.81, 0.35, s * 1.0, 0.05, 0.09, 1.82, 8);
    }
  });
  K.at(x, z, face, () => K.solid(-0.85, -1.1, 0.85, 1.1));
}
const s1 = (o) => (o.towelSide === -1 ? -1 : 1);
/** a sun lounger (1.9 long along the frame's +x - its head end at -x, the back raised), on a teak frame; y: its foot */
function lounger(K, M, x, z, face, y = 0, solid = true) {
  K.at(x, z, face, () => {
    K.box(M.frame, 0.15, y + 0.06, 0, 1.3, 0.12, 0.66); K.box(M.mattress, 0.15, y + 0.18, 0, 1.28, 0.08, 0.64);
    K.add(M.mattress, new THREE.BoxGeometry(0.62, 0.08, 0.64), -0.72, y + 0.42, 0, 0, 0, -0.62); K.add(M.frame, new THREE.BoxGeometry(0.64, 0.06, 0.66), -0.74, y + 0.37, 0, 0, 0, -0.62);
    for (const [a, b] of [[0.76, 0.28], [0.76, -0.28], [-0.5, 0.28], [-0.5, -0.28]]) K.box(M.frame, a, y, b, 0.05, 0.08, 0.05);
    K.box(M.towel, 0.25, y + 0.265, 0, 0.9, 0.012, 0.56);
    if (solid) K.solid(-1.0, -0.35, 0.82, 0.35);
  });
}
/** a market umbrella (s across): open by day - a pole, a square canopy and its valance - or furled at night */
function umbrella(K, M, x, z, s, open, y = 0) {
  K.cyl(M.steel, x, y, z, 0.24, 0.26, 0.05, 16); K.cyl(M.pole, x, y + 0.05, z, 0.025, 0.03, 2.55, 8);
  if (open) {
    const g = new THREE.ConeGeometry(s * 0.707, 0.5, 4, 1, true); g.rotateY(Math.PI / 4); K.add(M.canopy, g, x, y + 2.62, z);
    for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; K.box(M.canopy, x + Math.cos(a) * s * 0.5, y + 2.24, z + Math.sin(a) * s * 0.5, i % 2 ? s : 0.012, 0.14, i % 2 ? 0.012 : s); }
    K.cyl(M.steel, x, y + 2.86, z, 0.03, 0.05, 0.08, 8);
  } else { K.cyl(M.canopy, x, y + 1.15, z, 0.05, 0.09, 1.45, 10); K.cyl(M.steel, x, y + 2.6, z, 0.02, 0.04, 0.1, 8); }
  K.disc(x, z, 0.28);
}
/** a stone planter (r) and what grows in it: a date palm (h: its trunk) */
function planter(K, M, x, z, r, h = 0.5) { K.cyl(M.stone, x, 0, z, r, r + 0.03, h, 20); K.cyl(M.soil, x, h - 0.04, z, r - 0.05, r - 0.05, 0.03, 16); K.disc(x, z, r + 0.05); }
/**
 * A date palm, h tall, leaning (lx, lz) by its top: a tapered trunk of diamond-cut leaf bases, a knob of old frond bases
 * under the crown, some eighteen fronds - the upper ones rising, the lower ones arching down - alpha-tested leaflets
 */
function palm(K, M, x, y, z, h, lx, lz, R) {
  const g = new THREE.CylinderGeometry(0.2, 0.27, h, 9, 8, true); g.translate(0, h / 2, 0);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const k = p.getY(i) / h, w = 1 + 0.05 * Math.sin(k * 23); p.setXYZ(i, p.getX(i) * w + lx * k * k, p.getY(i), p.getZ(i) * w + lz * k * k); uv.setY(i, (p.getY(i) / h) * (h / 0.75)); }
  g.computeVertexNormals(); K.add(M.trunk, g, x, y, z);
  const tx = x + lx, ty = y + h, tz = z + lz;
  K.sph(M.knob, tx, ty - 0.3, tz, 0.3, 10, 8, 1, 1.5, 1);
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + (i % 2) * 0.13 + R() * 0.25, tier = i % 3, L = 3.0 + R() * 0.9 - tier * 0.2, lift = [0.85, 0.35, -0.2][tier] + (R() - 0.5) * 0.25, droop = [0.5, 0.72, 0.88][tier];
    const f = new THREE.PlaneGeometry(1, 1, 8, 2), fp = f.attributes.position;
    for (let k = 0; k < fp.count; k++) {
      const u = fp.getX(k) + 0.5, v = fp.getY(k), w = 0.62 * Math.sin(Math.PI * Math.min(1, u * 1.1 + 0.03)) * (1 - 0.3 * u);
      fp.setXYZ(k, u * L * Math.cos(lift * 0.6), lift * u * L - droop * u * u * L - Math.abs(v) * w * 0.32, v * w);
    }
    f.computeVertexNormals(); f.rotateY(a); K.add(M.frond, f, tx, ty - 0.1 - tier * 0.12, tz);
  }
}
/** a cabana (3.6 deep along the frame's x, 4 wide): a teak platform, slim white posts, a flat white roof, a slatted screen at
 * the back, curtains drawn back at the sides, a sofa along the back facing out (+x), a low table with a bottle on ice */
function cabana(K, M, x, z, face, o = {}) {
  K.at(x, z, face, () => {
    K.box(M.teak, 0, 0, 0, 3.6, 0.12, 4.0, 0, [1.5, 3.3]);
    for (const [a, b] of [[1.72, 1.92], [1.72, -1.92], [-1.72, 1.92], [-1.72, -1.92]]) K.box(M.post, a, 0.12, b, 0.13, 2.72, 0.13);
    K.box(M.post, 0, 2.84, 0, 3.86, 0.26, 4.26); K.box(M.roof, 0, 3.1, 0, 3.7, 0.06, 4.1);
    K.box(M.slat, -1.74, 0.12, 0, 0.06, 2.72, 3.72); for (let i = 0; i < 12; i++) K.box(M.slatD, -1.7, 0.3 + i * 0.21, 0, 0.02, 0.05, 3.7);
    for (const s of [-1, 1]) { K.box(M.curtain, -0.6, 0.12, s * 1.95, 2.2, 2.66, 0.03); K.cyl(M.curtain, 1.5, 0.12, s * 1.88, 0.07, 0.12, 2.62, 8); K.box(M.post, 1.5, 1.2, s * 1.84, 0.04, 0.05, 0.12); }
    raised(K, 0.12, () => sofa(K, { frame: M.sofaF, cushion: M.cushion, foot: M.steel }, -1.15, 0, 3.1, 0));
    K.box(M.teak2, 0.35, 0.12, 0, 0.66, 0.34, 1.3); iceBucket(K, M, 0.3, 0.46, -0.2);
    for (const s of [-1, 1]) K.add(o.pill || M.pill, new THREE.BoxGeometry(0.13, 0.36, 0.46), -1.19, 0.79, s * 0.95, 0, 0, 0.22);
    if (o.night) { K.wash('#ffb36a', -1.69, 1.5, 0, 3.6, 2.6, Math.PI / 2, 0.22); K.pool('#ffb36a', -0.4, 0, 2.0, 0.22, 0.13); K.box(o.led, 1.94, 2.8, 0, 0.012, 0.04, 4.1); }
    K.solid(-1.82, -2.0, -1.66, 2.0); K.solid(0.0, -0.66, 0.7, 0.66);
    for (const s of [-1, 1]) K.solid(-1.8, s * 1.92 - 0.06, 0.6, s * 1.92 + 0.06);
  });
}
/** the line arrays: n cabinets hanging in a J from (x, y, z), facing +z */
function lineArray(K, M, x, y, z, n = 6) { let yy = y, a = 0; for (let i = 0; i < n; i++) { K.add(M.speaker, new THREE.BoxGeometry(1.0, 0.3, 0.62), x, yy, z, 0, a, 0); K.box(M.grille, x, yy - 0.13, z + 0.31 * Math.cos(a) + 0.01, 0.94, 0.24, 0.01); yy -= 0.31; a += 0.04 + i * 0.012; } }

/** the night's beams: n moving heads on the truss, each a pair of crossed additive planes, swept in the vertex shader (no per-frame cost but a clock) */
function beams(K, heads, tex) {
  const pos = [], uv = [], org = [], par = [], col = [], idx = []; let v0 = 0;
  for (const h of heads) {
    const L = h.len || 16, w0 = 0.05, w1 = h.w || 0.9;
    for (const ax of [0, 1]) {
      const q = ax ? [[0, 0, -w0], [0, 0, w0], [0, -L, w1], [0, -L, -w1]] : [[-w0, 0, 0], [w0, 0, 0], [w1, -L, 0], [-w1, -L, 0]];
      for (const [a, b, c] of q) { pos.push(a, b, c); org.push(h.x, h.y, h.z); par.push(h.ph, h.sp, h.yaw, h.pitch); col.push(h.col.r, h.col.g, h.col.b); }
      uv.push(0, 1, 1, 1, 1, 0, 0, 0); idx.push(v0, v0 + 1, v0 + 2, v0, v0 + 2, v0 + 3); v0 += 4;
    }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('aOrg', new THREE.Float32BufferAttribute(org, 3)); g.setAttribute('aPar', new THREE.Float32BufferAttribute(par, 4)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx);
  const U = { uT: { value: 0 }, uSw: { value: REDUCED ? 0 : 1 } };
  const m = new THREE.MeshBasicMaterial({ map: tex, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, fog: false });
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 aOrg; attribute vec4 aPar; uniform float uT, uSw;').replace('#include <begin_vertex>', `vec3 transformed = vec3( position );
      float yw = aPar.z + uSw * 0.75 * sin( uT * aPar.y + aPar.x ), pt = aPar.w + uSw * 0.22 * sin( uT * aPar.y * 0.63 + aPar.x * 1.7 );
      float cp = cos( pt ), sp = sin( pt ); transformed = vec3( transformed.x, transformed.y * cp - transformed.z * sp, transformed.y * sp + transformed.z * cp );
      float cy = cos( yw ), sy = sin( yw ); transformed = vec3( transformed.x * cy + transformed.z * sy, transformed.y, -transformed.x * sy + transformed.z * cy ) + aOrg;`);
  };
  m.customProgramCacheKey = () => 'pool-beams-v1';
  const mesh = K.obj(new THREE.Mesh(g, m)); mesh.frustumCulled = false; mesh.renderOrder = 4; mesh.matrixAutoUpdate = false; mesh.updateMatrix();
  K.anim((t) => { U.uT.value = t; });
  return mesh;
}
/**
 * The water: one mesh over every basin. Two looks, both a MeshBasicMaterial (no light of the world's or the room's: the
 * same hosted and not): the flat one - a translucent turquoise, nothing but its colour - and the full one (WATER_FX), a few
 * travelling waves summed into its slope, the swimmers' own rings in it, the sky by the Fresnel term, the sun's glint, the
 * shelf lighter than the deep end - more see-through looking down, a mirror at a low angle, as water is. The legs of anyone
 * standing in it go on beneath the surface, tinted and dimmed, the cut clean where they meet it.
 * (2026-10-15: the full look came out solid black on the user's Intel UHD laptop. It does not on software GL (bisected: the
 * water alone, the multiply layer alone, the caustics alone, the rings - each fine there), so the driver's own maths is the
 * suspect: an unguarded pow() of 0 to the 420th, a normalize() of a zero vector, an unbounded glint - any NaN in it is black.
 * Now every pow is of max(x, 1e-4), every normalize guarded, every term clamped, a floor under its brightness and a NaN
 * check at the end; and which look draws is decided where it runs: the first frame renders the full look by itself over a
 * grey card and reads the pixels back (waterProbe) - black or NaN, and the flat water takes its place for the night.
 * ?waterfx=1 / ?waterfx=0 (or #waterfx=, or localStorage 'f1sim-waterfx') forces either.)
 * (Later the same day, raycast from the deck's edge looking down: the black was not the water at all - the world's own
 * ground plane, 5 cm under a deck anchored at street level, drawn over the sunken basin; its polygon offset hid it at a
 * grazing angle and lost to it looking down - how far is up to the driver. The pool club now stands on its podium, 7 m
 * up (main.js hangoutAnchor), as this file always meant it to.)
 */
const WATER_FX = 'auto';
/** what the page asks for: 1 the full look, 0 the flat water, null decide by the probe */
function waterFxWanted() {
  if (globalThis.__waterFx != null) return globalThis.__waterFx ? 1 : 0;
  try {
    const q = String(location.search) + '&' + String(location.hash).replace(/^#/, ''), m = /[?&]waterfx=(\w+)/.exec(q);
    const v = m ? m[1] : localStorage.getItem('f1sim-waterfx');
    if (v != null && v !== '') return /^(1|on|true|yes|fx)$/i.test(v) ? 1 : 0;
  } catch (_) { /* (no location or storage: a test page) */ }
  return WATER_FX === 'auto' ? null : WATER_FX ? 1 : 0;
}
const RIPN = 8;   // (the swimmers whose rings are in the full look's slope: the nearest to the camera)
function waterMat(night, sunW, shelfZ) {
  const U = {
    uT: { value: 0 }, uSun: { value: sunW.clone().normalize() }, uSky: { value: new THREE.Color(night ? '#1a2350' : '#4f8ed8') }, uHor: { value: new THREE.Color(night ? '#5c3c5c' : '#d2e3ec') },
    uGl: { value: night ? 0.16 : 1 }, uFrMax: { value: night ? 0.42 : 0.8 }, uFloor: { value: night ? 0.1 : 0.2 }, uShelf: { value: shelfZ },
    uShallow: { value: new THREE.Color(night ? '#46e6f2' : '#8fe8ea') }, uDeep: { value: new THREE.Color(night ? '#0aa6cc' : '#1aa9c6') },
    uA: { value: new THREE.Vector2(night ? 0.4 : 0.3, night ? 0.64 : 0.56) }, uRip: { value: Array.from({ length: RIPN }, () => new THREE.Vector4(0, 0, 0, 0)) }, uBreak: { value: 0 },
  };
  const flat = new THREE.MeshBasicMaterial({ color: night ? '#1fb4d4' : '#27b2c6', transparent: true, opacity: night ? 0.72 : 0.5, depthWrite: false });
  flat.customProgramCacheKey = () => 'pool-water-flat';
  const fx = new THREE.MeshBasicMaterial({ color: night ? '#1fb4d4' : '#27b2c6', transparent: true, opacity: 1, depthWrite: false });
  fx.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vLP;').replace('#include <project_vertex>', '#include <project_vertex>\nvWP = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz; vLP = transformed;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
uniform float uT, uGl, uFrMax, uFloor, uShelf, uBreak; uniform vec3 uSun, uSky, uHor, uShallow, uDeep; uniform vec2 uA; uniform vec4 uRip[ ${RIPN} ]; varying vec3 vWP; varying vec3 vLP;`).replace('#include <opaque_fragment>', `{
      vec2 wp = vLP.xz;
      vec2 sl = vec2( 0.8, 0.6 ) * cos( dot( wp, vec2( 0.8, 0.6 ) ) * 2.1 + uT * 1.6 ) * 0.05 + vec2( -0.5, 0.866 ) * cos( dot( wp, vec2( -0.5, 0.866 ) ) * 3.4 + uT * 2.2 ) * 0.034
        + vec2( 0.96, -0.28 ) * cos( dot( wp, vec2( 0.96, -0.28 ) ) * 5.9 + uT * 3.0 ) * 0.02 + vec2( -0.2, -0.98 ) * cos( dot( wp, vec2( -0.2, -0.98 ) ) * 9.3 + uT * 3.9 ) * 0.012;
      // (the rings round the swimmers: each a travelling ring out to 3 m, fading with distance)
      for ( int i = 0; i < ${RIPN}; i ++ ) {
        vec4 r = uRip[ i ]; vec2 d = wp - r.xy; float dd = max( length( d ), 0.05 );
        sl += ( d / dd ) * ( r.z * exp( -dd * 1.7 ) * step( dd, 3.0 ) * sin( dd * 15.0 - uT * 7.0 + r.w ) );
      }
      sl = clamp( sl, vec2( -0.4 ), vec2( 0.4 ) );
      vec3 wn = vec3( -sl.x, 1.0, -sl.y ); wn *= inversesqrt( max( dot( wn, wn ), 1e-4 ) );
      vec3 dv = cameraPosition - vWP; vec3 wv = dv * inversesqrt( max( dot( dv, dv ), 1e-6 ) );
      float nv = clamp( dot( wn, wv ), 0.0, 1.0 );
      float fr = clamp( 0.02 + 0.98 * pow( max( 1.0 - nv, 1e-4 ), 5.0 ), 0.0, uFrMax );
      vec3 rf = reflect( -wv, wn );
      float sd = clamp( dot( rf, uSun ), 0.0, 1.0 );
      vec3 sky = mix( uHor, uSky, clamp( rf.y * 1.8, 0.0, 1.0 ) );
      float gl = min( pow( max( sd, 1e-4 ), 260.0 ) * 2.4 + pow( max( sd, 1e-4 ), 36.0 ) * 0.12, 2.0 ) * clamp( uGl, 0.0, 1.0 );
      // (the shelf lighter, the deep end deeper; the plunge pools - up on their decks - between)
      float deep = vLP.y > 0.0 ? 0.55 : 1.0 - smoothstep( uShelf - 0.35, uShelf + 0.35, vLP.z );
      vec3 body = mix( uShallow, uDeep, deep );
      vec3 col = mix( body, sky, fr ) + vec3( gl );
      // (never darker than its own glow: a floor under the brightness, in the water's own hue)
      float lum = dot( col, vec3( 0.2126, 0.7152, 0.0722 ) );
      col += body * max( 0.0, uFloor - lum ) * 2.0;
      col = clamp( col, 0.0, 3.0 );
      float a = clamp( mix( mix( uA.x, uA.y, deep ), 0.9, fr ) + gl * 0.4, 0.2, 0.95 );
      // (a NaN anywhere above fails every comparison: then the plain body colour)
      if ( !( col.r >= 0.0 && col.g >= 0.0 && col.b >= 0.0 && a >= 0.0 && lum < 1e4 ) ) { col = body; a = uA.y; }
      if ( uBreak > 0.5 ) { col = vec3( 0.0 ); a = 1.0; }
      outgoingLight = col; diffuseColor.a = a;
    }
    #include <opaque_fragment>`);
  };
  fx.customProgramCacheKey = () => 'pool-water-fx-v2';
  fx.userData.u = U; flat.userData.u = U;
  return { flat, fx, U };
}
/**
 * Does the full look draw here? It alone on a 24-pixel square in the corner of the canvas (scissored: nothing else of the
 * frame touched, and the frame drawn over it straight after), over a grey card, from three places - low over the water,
 * straight down, and in the sun's glint - and the pixels read back: black (a NaN draws black) or near it, and it fails.
 * Runs once, the frame the room is first shown; everything it makes is freed again. -> { ok, lum, black } | null (no renderer)
 */
function waterProbe(R, mat, sunW) {
  if (!R?.getContext) return null;
  const gl = R.getContext(), n = 24, buf = new Uint8Array(n * n * 4), out = { ok: true, lum: 1, black: 0 };
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0.42, 0.42, 0.42);
  const g = new THREE.PlaneGeometry(60, 60, 1, 1); g.rotateX(-Math.PI / 2); g.translate(0, -0.12, -4);
  const m = new THREE.Mesh(g, mat); m.frustumCulled = false; sc.add(m);
  const cam = new THREE.PerspectiveCamera(60, 1, 0.05, 400), s = sunW.clone().normalize();
  const rt0 = R.getRenderTarget(), vp = R.getViewport(new THREE.Vector4()), sci = R.getScissor(new THREE.Vector4()), st = R.getScissorTest(), ac = R.autoClear;
  try {
    R.setRenderTarget(null); R.autoClear = true;
    const pr = R.getPixelRatio() || 1, css = Math.ceil(n / pr) + 1;
    R.setViewport(0, 0, css, css); R.setScissor(0, 0, css, css); R.setScissorTest(true);
    let sum = 0, blk = 0, k = 0;
    for (const [p, l] of [[[0, 1.66, 8], [0, -0.12, -8]], [[0, 9, -4], [0, -0.12, -4.01]], [[-s.x * 9, s.y * 9, -4 - s.z * 9], [0, -0.12, -4]]]) {
      cam.position.set(p[0], p[1], p[2]); cam.lookAt(l[0], l[1], l[2]); cam.updateMatrixWorld();
      R.render(sc, cam); gl.readPixels(0, 0, n, n, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      for (let i = 0; i < buf.length; i += 4) { const L = (0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2]) / 255; sum += L; if (L < 0.035) blk++; k++; }
    }
    out.lum = +(sum / k).toFixed(3); out.black = +(blk / k).toFixed(3); out.ok = out.lum > 0.12 && out.black < 0.15;
  } catch (e) { console.warn('PartyPool: the water probe failed', e); out.ok = false; }
  finally { R.setScissorTest(st); R.setScissor(sci); R.setViewport(vp); R.autoClear = ac; R.setRenderTarget(rt0); g.dispose(); }
  return out;
}
/**
 * What the water takes out of the light through it - the reds first, as real water does: a multiply layer drawn just
 * under the surface's own, so the white floor reads turquoise and the legs of anyone standing in it go on tinted and
 * darker (not washed pale, as a mix toward the water's colour alone leaves them); a fixed colour, no shader of its own
 */
function absorbMat(night) {
  return new THREE.MeshBasicMaterial({ color: night ? '#5fb4c4' : '#7ccfd6', blending: THREE.MultiplyBlending, premultipliedAlpha: true, transparent: true, depthWrite: false, toneMapped: false, fog: false });
}
/** hosted: the building a raised place stands in - boxes [x0, y0, z0, x1, y1, z1] - in the city's own window look (as Hangout's buildingMass) */
function massOf(K, E, boxes) {
  const gs = boxes.filter((b) => b[4] - b[1] > 0.05 && b[3] - b[0] > 0.05 && b[5] - b[2] > 0.05).map(([x0, y0, z0, x1, y1, z1]) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return norm(g); });
  if (!gs.length) return null;
  const g = mergeGeometries(gs); for (const x of gs) x.dispose(); if (!g) return null;
  g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(0.96), 3));
  const win = E.hx?.win || null, m = K.obj(new THREE.Mesh(g, win || new THREE.MeshStandardMaterial({ color: '#23272f', roughness: 0.85 })));
  m.matrixAutoUpdate = false; m.updateMatrix(); m.userData.hgKeep = !!win;
  return m;
}

// =====================================================================================================================
// the venue
// =====================================================================================================================
/** the brand of a sponsor's takeover, if the launch has one -> { name, color } | null */
function brandOf(E) {
  const b = E?.o?.brand ?? null; if (!b) return null;
  if (typeof b === 'string') return { name: b.replace(/(^|[-_ ])(\w)/g, (_, s, c) => (s ? ' ' : '') + c.toUpperCase()).trim(), color: '#ffffff' };
  return { name: String(b.name || b.id || ''), color: b.color || '#ffffff' };
}

/** Tidewater Beach Club: the night swim (or, P.day, the dayclub) - see the header */
export function poolclub(K, E) {
  const P = E.P || {}, night = P.day ? false : E.night !== false, hosted = !!E.host, R = rng(night ? 7101 : 7102), RS = rng(7203);
  const brand = brandOf(E), ay = Math.max(0, +E.ay || 0), podium = hosted ? ay >= 4 : true;
  // ---- the looks
  const tileT = K.t(tileTex(rng(12), ['#a6dbe3', '#bce6ec', '#8fcfd9', '#d6f0f3', '#82c4d0', '#a6dbe3'], '#e7f2f2')), bandT = K.t(tileTex(rng(13), ['#1d5b86', '#296b96', '#174e70', '#3a7da6'], '#c9d9e3'));
  const frondT = K.t(frondTex(rng(15))), trunkT = K.t(trunkTex(rng(16))), trussT = K.t(trussTex());
  const M = {
    paver: K.mt(K.t(paverTex(rng(11))), 0.8), coping: K.m('#efe8dc', 0.55), stone: K.m('#d8ccb8', 0.75), render: K.m('#ebe4d8', 0.88), soil: K.m('#3a2c20', 1),
    tile: K.mt(tileT, 0.3, 0, night ? { emissive: '#0d5a6a' } : {}), band: K.mt(bandT, 0.25, 0, night ? { emissive: '#0a3048' } : {}),
    teak: K.mt(K.t(teakTex(rng(14))), 0.62), teak2: K.m('#6b4a30', 0.5), hedge: K.mt(K.t(hedgeTex(rng(17))), 0.95),
    white: K.m('#f2f0eb', 0.5), post: K.m('#f4f2ee', 0.45), roof: K.m('#e8e4dc', 0.7), recess: K.m('#26221e', 0.9), bedbase: K.m('#f1eee8', 0.55), mattress: K.m('#f5f1e8', 0.95),
    fabric: K.m('#f7f3ea', 0.92, 0, { side: THREE.DoubleSide }), sheer: K.m('#fbf8f2', 0.95), curtain: K.m('#efe7d8', 0.95), canopy: K.m('#f5efe2', 0.9, 0, { side: THREE.DoubleSide }),
    slat: K.m('#5a3e2a', 0.65), slatD: K.m('#3e2a1c', 0.7), sofaF: K.m('#ece6da', 0.85), cushion: K.m('#f6f2ea', 0.95), frame: K.m('#a57a52', 0.6), towel: K.m('#f8f8f6', 0.98),
    pill: K.m('#1e9fb6', 0.92), pill2: K.m('#f0a92c', 0.92), pill3: K.m('#e2577f', 0.92),
    steel: K.m('#b9bfc6', 0.3, 0.85), pole: K.m('#d8d2c6', 0.5), black: K.m('#141518', 0.55, 0.15), granite: K.m('#26252a', 0.22, 0.1), speaker: K.m('#141416', 0.7, 0.1), grille: K.m('#2a2b2e', 0.95),
    bottle: K.m('#13331f', 0.15, 0.1), foil: K.m('#d4af37', 0.35, 0.6), ice: K.m('#e6f4f8', 0.2), flute: K.glass('#e8f4f6', 0.3),
    glass: K.glass('#bfe3ee', 0.14), truss: K.m('#c8ccd2', 0.4, 0.6, { map: trussT, alphaTest: 0.5, side: THREE.DoubleSide }),
    // (by night the palms are lit from below, warm: the trunks and the fronds' undersides glowing over the dark deck)
    trunk: K.m(night ? '#a08a72' : '#ffffff', 0.92, 0, { map: trunkT, ...(night ? { emissive: '#4a3220' } : {}) }), knob: K.m('#5e5a34', 0.95),
    frond: K.m(night ? '#9ab868' : '#ffffff', 0.8, 0, { map: frondT, alphaTest: 0.5, side: THREE.DoubleSide, ...(night ? { emissive: '#18200c' } : {}) }),
    float1: K.m('#ff7aa8', 0.5), float2: K.m('#ffd23a', 0.5),
  };
  const ledCols = ['#ff2fa0', '#18d2ff', '#8a4bff', '#ffb21a'];
  const sunL = night ? V3(2, 7, 5) : V3(-4, 9, 5);   // (where the key light comes from: by day the afternoon sun, high in the south-west)
  const shOff = (h) => (night ? [0, 0] : [(-sunL.x / sunL.y) * h, (-sunL.z / sunL.y) * h]);

  // ---- the deck: travertine round the pool, a white coping on its edges --------------------------------------------
  const { x0, z0, x1, z1, cope: c } = POOL;
  floorW(K, M.paver, DECK.x0, DECK.z0, DECK.x1, z0 - c, 2.4); floorW(K, M.paver, DECK.x0, z1 + c, DECK.x1, DECK.z1, 2.4);
  floorW(K, M.paver, DECK.x0, z0 - c, x0 - c, z1 + c, 2.4); floorW(K, M.paver, x1 + c, z0 - c, DECK.x1, z1 + c, 2.4);
  K.box(M.coping, 0, -0.01, z0 - c / 2 + 0.015, x1 - x0 + 2 * c, 0.06, c + 0.03); K.box(M.coping, 0, -0.01, z1 + c / 2 - 0.015, x1 - x0 + 2 * c, 0.06, c + 0.03);
  K.box(M.coping, x0 - c / 2 + 0.015, -0.01, (z0 + z1) / 2, c + 0.03, 0.06, z1 - z0); K.box(M.coping, x1 + c / 2 - 0.015, -0.01, (z0 + z1) / 2, c + 0.03, 0.06, z1 - z0);
  // ---- the basin: glass mosaic, a dark band at the waterline, the sun shelf's step, lights in the walls
  const D = POOL.deep, Lg = POOL.ledge, sz = POOL.shelf, top = -0.02;
  floorW(K, M.tile, x0, z0, x1, sz, 0.4, D); floorW(K, M.tile, x0, sz, x1, z1, 0.4, Lg);
  panel(K, M.tile, 0, D, z0, x1 - x0, top - D, 0); panel(K, M.tile, 0, Lg, z1, x1 - x0, top - Lg, Math.PI); panel(K, M.tile, 0, D, sz, x1 - x0, Lg - D, Math.PI);
  panel(K, M.tile, x0, D, (z0 + z1) / 2, z1 - z0, top - D, Math.PI / 2); panel(K, M.tile, x1, D, (z0 + z1) / 2, z1 - z0, top - D, -Math.PI / 2);
  panel(K, M.band, 0, -0.3, z0 + 0.004, x1 - x0, 0.28, 0, 0.4); panel(K, M.band, 0, -0.3, z1 - 0.004, x1 - x0, 0.28, Math.PI, 0.4);
  panel(K, M.band, x0 + 0.004, -0.3, (z0 + z1) / 2, z1 - z0, 0.28, Math.PI / 2, 0.4); panel(K, M.band, x1 - 0.004, -0.3, (z0 + z1) / 2, z1 - z0, 0.28, -Math.PI / 2, 0.4);
  K.box(M.band, 0, Lg - 0.03, sz + 0.06, x1 - x0, 0.03, 0.12);   // (the shelf's edge, marked dark as the safety code has it)
  const lamp = night ? K.e('#d6fbff') : K.m('#eef6f6', 0.2, 0.3), lamps = [];
  for (const z of [-9.8, -6.6, -3.4]) lamps.push([x0 + 0.01, z, Math.PI / 2], [x1 - 0.01, z, -Math.PI / 2]);
  for (const x of [-7, 0, 7]) lamps.push([x, z0 + 0.01, 0]);
  for (const [x, z, ry] of lamps) {
    K.add(lamp, new THREE.CircleGeometry(0.13, 16), x, D + 0.5, z, ry);
    if (night) { const nx = Math.round(Math.sin(ry)), nz = Math.round(Math.cos(ry)); K.wash('#2fd0ff', x + nx * 0.02, D + 0.5, z + nz * 0.02, 2.6, 1.0, ry, 0.35); K.pool('#2fc8ff', x + nx * 1.6, z + nz * 1.6, 2.4, 0.3, D + 0.012); }
  }
  // (two go-go podiums rising out of the water, their tops 0.6 m over the deck - a ring of light round each at night)
  for (const s of [-1, 1]) {
    // (glass mosaic under the water, as the basin; white render above it)
    { const g = new THREE.CylinderGeometry(0.8, 0.84, POOL.wl - 0.04 - D, 28, 1, true), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 13, uv.getY(i) * 2.2); K.add(M.tile, g, s * 6.0, (D + POOL.wl - 0.04) / 2, -6.2); }
    K.cyl(M.white, s * 6.0, POOL.wl - 0.04, -6.2, 0.78, 0.8, 0.64 - POOL.wl, 28); K.cyl(M.coping, s * 6.0, 0.6, -6.2, 0.82, 0.82, 0.05, 28);
    if (night) K.add(K.e(s > 0 ? '#ff2fa0' : '#18d2ff'), new THREE.TorusGeometry(0.83, 0.02, 6, 40), s * 6.0, 0.52, -6.2, 0, Math.PI / 2);
  }
  // (the in-water loungers on the sun shelf, and two floats drifting by the far wall)
  for (const x of [-9.2, -7.4, 7.4, 9.2]) lounger(K, { frame: M.white, mattress: M.white, towel: M.towel }, x, 0.0, facing(0, -1), Lg, false);
  K.add(M.float1, new THREE.TorusGeometry(0.42, 0.14, 10, 24), -3.4, POOL.wl + 0.04, -9.4, 0, Math.PI / 2);
  K.add(M.float2, new THREE.TorusGeometry(0.4, 0.13, 10, 24), 4.6, POOL.wl + 0.04, -10.2, 0, Math.PI / 2);
  // (no wall round the pool: you can walk in and out - Hangout's eye height follows heightAt down to the pool's floor)

  // ---- the stage: a black deck 1.2 m up, the DJ's booth, the LED wall, the truss and its shade sail, the line arrays ---
  const S = STAGE;
  K.box(M.black, 0, 0, (S.z0 + S.z1) / 2, S.x1 - S.x0, S.h, S.z1 - S.z0); K.box(M.granite, 0, S.h, (S.z0 + S.z1) / 2, S.x1 - S.x0 + 0.04, 0.02, S.z1 - S.z0 + 0.04);
  K.box(night ? K.e('#18d2ff') : M.steel, 0, S.h - 0.06, S.z1 + 0.012, S.x1 - S.x0, 0.035, 0.01);
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) K.box(M.black, s * (S.x1 + 0.3), (i * S.h) / 6, -16.3 + i * 0.3, 0.6, S.h / 6, 0.3);   // (steps up the sides, at the back)
  K.at(0, -14.9, facing(0, 1), () => {
    K.box(M.black, 0, S.h, 0, 0.9, 1.0, 3.4); K.box(M.granite, 0.02, S.h + 1.0, 0, 0.96, 0.04, 3.5);
    for (const zz of [-1.1, -0.38, 0.38, 1.1]) { K.box(M.speaker, 0.05, S.h + 1.04, zz, 0.42, 0.08, 0.32); K.cyl(K.e('#3ad7ff'), 0.06, S.h + 1.12, zz, 0.1, 0.1, 0.008, 18); }
    K.box(M.speaker, 0.05, S.h + 1.04, 0, 0.36, 0.06, 0.28);
  });
  const ledT = K.t(ledTex(rng(18))), ledM = new THREE.MeshBasicMaterial({ map: ledT, toneMapped: false });
  const led = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(12.4, 5.6), ledM)); led.position.copy(K.P(0, S.h + 0.75 + 2.8, -17.95)); led.rotation.y = K.ry;
  K.box(M.black, 0, S.h + 0.6, -18.1, 12.8, 6.0, 0.2);
  const deskM = new THREE.MeshBasicMaterial({ map: ledT, toneMapped: false }), desk = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(3.3, 0.86), deskM));
  desk.position.copy(K.P(0, S.h + 0.5, -14.44)); desk.rotation.y = K.ry;
  const name = brand?.name ? brand.name.toUpperCase() : 'TIDEWATER', bannerT = K.t(signTex(name, brand?.name ? 'TIDEWATER BEACH CLUB · LAS VEGAS' : 'BEACH CLUB · MERIDIAN GRAND', brand?.color || '#ffffff'));
  K.plane(K.e('#ffffff', { map: bannerT, blending: THREE.AdditiveBlending, opacity: night ? 1 : 0.8 }), 0, 7.72, -12.42, 12.4, 1.92, 0);
  K.box(M.black, 0, 6.64, -12.5, 13.0, 2.12, 0.12);
  for (const sx of [-1, 1]) for (const sz2 of [-12.5, -18.1]) K.box(M.truss, sx * 7.95, 0, sz2, 0.42, 9.0, 0.42, 0, [1, 9.0 / 0.42]);
  for (const sz2 of [-12.5, -18.1]) K.box(M.truss, 0, 9.0, sz2, 16.3, 0.42, 0.42, 0, [16.3 / 0.42, 1]);
  for (const sx of [-1, 1]) K.box(M.truss, sx * 7.95, 9.0, -15.3, 0.42, 0.42, 5.2, 0, [1, 5.2 / 0.42]);
  {
    const g = new THREE.PlaneGeometry(17.4, 7.2, 10, 5); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const u = p.getX(i) / 17.4 + 0.5, v = p.getZ(i) / 7.2 + 0.5; p.setY(i, -0.55 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v) + 0.35 * (v - 0.5)); }
    g.computeVertexNormals(); K.add(M.canopy, g, 0, 9.75, -15.3);
  }
  for (const s of [-1, 1]) { lineArray(K, M, s * 7.18, 8.6, -12.2, 6); for (let k = 0; k < 2; k++) K.box(M.speaker, s * 8.7, k * 0.95, -13.3, 1.2, 0.93, 0.9); K.box(M.grille, s * 8.7, 0.08, -12.84, 1.1, 1.75, 0.01); K.solid(s * 8.7 - 0.62, -13.76, s * 8.7 + 0.62, -12.84); }
  for (let i = 0; i < 8; i++) { const x = -6.1 + i * (12.2 / 7); K.box(M.speaker, x, 8.68, -12.3, 0.28, 0.3, 0.28); K.sph(night ? K.e('#ffffff') : M.black, x, 8.74, -12.15, 0.09, 10, 8, 1, 1, 0.5); K.box(M.steel, x, 8.98, -12.4, 0.04, 0.03, 0.2); }
  for (const x of [-6.6, -2.2, 2.2, 6.6]) K.cyl(M.steel, x, S.h, -12.7, 0.09, 0.11, 0.42, 10);   // (CO2 jets)
  if (night) {
    for (const [x, col] of [[-4, '#ff2fa0'], [0, '#18d2ff'], [4, '#8a4bff']]) K.pool(col, x, -14.5, 3.4, 0.32, S.h + 0.03);
    const bh = []; for (let i = 0; i < 8; i++) { const x = -6.1 + i * (12.2 / 7); bh.push({ x, y: 8.7, z: -12.12, yaw: (i - 3.5) * 0.12, pitch: -0.62 - (i % 2) * 0.12, ph: i * 1.3, sp: 0.55 + (i % 3) * 0.17, len: 19, w: 0.85, col: new THREE.Color(ledCols[i % 4]) }); }
    beams(K, bh, K.t(beamTex()));
  }
  K.anim((t) => { ledT.offset.x = (t * 0.035) % 1; ledM.color.setHSL((t * 0.018) % 1, 0.32, 0.82); deskM.color.copy(ledM.color); });
  K.solid(S.x0, S.z0, S.x1, S.z1); K.solid(S.x1, -16.4, S.x1 + 0.6, -14.6); K.solid(S.x0 - 0.6, -16.4, S.x0, -14.6);
  for (const sx of [-1, 1]) K.solid(sx * 7.95 - 0.25, -12.75, sx * 7.95 + 0.25, -12.25);

  // ---- the daybeds down both sides (every other one under a canopy) and the palms between them ------------------------
  const pills = [M.pill, M.pill2, M.pill3];
  for (const s of [-1, 1]) DAYBED_Z.forEach((z, i) => {
    const can = (i + (s > 0 ? 1 : 0)) % 2 === 0, led = night ? K.e(ledCols[(i + (s > 0 ? 2 : 0)) % 4]) : null;
    daybed(K, M, s * DAYBED_X, z, facing(-s, 0), { canopy: can, pill: pills[(i + (s > 0 ? 1 : 0)) % 3], led, ledCol: ledCols[(i + (s > 0 ? 2 : 0)) % 4], towelSide: i % 2 ? -1 : 1 });
    if (!night && can) { const [ox, oz] = shOff(2.4); shade(K, s * DAYBED_X + ox * 0.8, z + oz * 0.8, 2.1, 2.6, 0.3); }
    if (!night && !can) umbrella(K, { steel: M.steel, pole: M.pole, canopy: M.canopy }, s * (DAYBED_X + 1.2), z + 1.5, 2.6, true);
    if (!night && !can) { const [ox, oz] = shOff(2.6); shade(K, s * (DAYBED_X + 1.2) + ox, z + 1.5 + oz, 3.2, 3.2, 0.26); }
  });

  // ---- the cabanas behind them, and the walls with their hedges -------------------------------------------------------
  for (const s of [-1, 1]) CABANA_Z.forEach((z, i) => {
    cabana(K, M, s * CABANA_X, z, facing(-s, 0), { night, pill: pills[(i + 2) % 3], led: night ? K.e(ledCols[(i + 1) % 4]) : null });
    if (!night) { const [ox, oz] = shOff(3.1); shade(K, s * CABANA_X + ox * 0.4, z + oz * 0.4, 4.6, 5.2, 0.32, 0.13); }
  });
  for (const s of [-1, 1]) {
    K.box(M.render, s * 24.15, -1.32, (DECK.z0 + DECK.z1) / 2, 0.3, 2.45, DECK.z1 - DECK.z0); K.box(M.coping, s * 24.15, 1.13, (DECK.z0 + DECK.z1) / 2, 0.42, 0.06, DECK.z1 - DECK.z0);
    K.box(M.stone, s * 23.65, 0, (DECK.z0 + DECK.z1) / 2 + 2, 0.6, 0.5, DECK.z1 - DECK.z0 - 4); K.box(M.hedge, s * 23.65, 0.5, (DECK.z0 + DECK.z1) / 2 + 2, 0.56, 0.85, DECK.z1 - DECK.z0 - 4.2, 0, [17, 1]);
    if (night) for (let z = -16; z <= 13; z += 5.8) K.wash(s > 0 ? '#8a4bff' : '#18d2ff', s * 23.3, 1.0, z, 5.0, 1.6, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0.16);
  }

  // ---- the VIP bungalows either side of the stage: a raised teak deck, a pergola over its sofas, a plunge pool -------
  const B = BUNG, plunges = [];
  for (const s of [-1, 1]) {
    const bx0 = s > 0 ? B.x0 : -B.x1, bx1 = s > 0 ? B.x1 : -B.x0, mid = (bx0 + bx1) / 2;
    const px0 = s > 0 ? B.x0 + 0.6 : -B.x0 - 4.6, px1 = px0 + 4.0, pz0 = B.z0 + 0.6, pz1 = B.z1 - 0.7;
    // (the teak deck round its plunge pool, the pool's own white coping)
    const deck = (a0, c0, a1, c1) => { if (a1 - a0 > 0.01 && c1 - c0 > 0.01) K.box(M.teak, (a0 + a1) / 2, 0, (c0 + c1) / 2, a1 - a0, B.h, c1 - c0, 0, [(a1 - a0) / 2.4, (c1 - c0) / 1.2]); };
    deck(bx0, B.z0, px0, B.z1); deck(px1, B.z0, bx1, B.z1); deck(px0, B.z0, px1, pz0); deck(px0, pz1, px1, B.z1);
    for (const [cx, cz, w, d] of [[(px0 + px1) / 2, pz0 - 0.09, 4.36, 0.18], [(px0 + px1) / 2, pz1 + 0.09, 4.36, 0.18], [px0 - 0.09, (pz0 + pz1) / 2, 0.18, pz1 - pz0], [px1 + 0.09, (pz0 + pz1) / 2, 0.18, pz1 - pz0]]) K.box(M.coping, cx, B.h - 0.01, cz, w, 0.04, d);
    floorW(K, M.tile, px0, pz0, px1, pz1, 0.4, B.h - 0.9);
    panel(K, M.tile, (px0 + px1) / 2, B.h - 0.9, pz0, 4.0, 0.86, 0); panel(K, M.tile, (px0 + px1) / 2, B.h - 0.9, pz1, 4.0, 0.86, Math.PI);
    panel(K, M.tile, px0, B.h - 0.9, (pz0 + pz1) / 2, pz1 - pz0, 0.86, Math.PI / 2); panel(K, M.tile, px1, B.h - 0.9, (pz0 + pz1) / 2, pz1 - pz0, 0.86, -Math.PI / 2);
    plunges.push([px0, pz0, px1, pz1]);
    if (night) K.pool('#2fc8ff', (px0 + px1) / 2, (pz0 + pz1) / 2, 2.2, 0.35, B.h - 0.88);
    const gx0 = s > 0 ? bx1 - 7.4 : bx0, gx1 = gx0 + 7.4;
    for (const gx of [gx0 + 0.15, gx1 - 0.15]) for (const gz of [B.z0 + 0.2, B.z1 - 0.2]) K.box(M.post, gx, B.h, gz, 0.16, 2.7, 0.16);
    for (let i = 0; i < 16; i++) K.box(M.slat, gx0 + 0.2 + i * 0.47, B.h + 2.7, (B.z0 + B.z1) / 2, 0.08, 0.16, B.z1 - B.z0 - 0.1);
    for (const gz of [B.z0 + 0.2, B.z1 - 0.2]) K.box(M.post, (gx0 + gx1) / 2, B.h + 2.62, gz, 7.4, 0.12, 0.14);
    sofaRow(K, M, s, gx0, gx1, B);
    for (let gx = bx0; gx < bx1 - 0.1; gx += 2.2) K.box(M.steel, gx + 0.05, B.h, B.z1 - 0.05, 0.05, 1.05, 0.05);
    K.plane(M.glass, mid + s * 0.0, B.h + 0.55, B.z1 - 0.04, bx1 - bx0, 1.0, 0); K.bar(M.steel, mid, B.h + 1.05, B.z1 - 0.05, 0.025, bx1 - bx0);
    if (night) { K.pool('#ffb36a', (gx0 + gx1) / 2, (B.z0 + B.z1) / 2, 2.6, 0.24, B.h + 0.01); K.box(K.e('#ffb36a'), (gx0 + gx1) / 2, B.h + 2.56, B.z1 - 0.12, 7.0, 0.03, 0.02); }
    K.solid(bx0, B.z0, bx1, B.z1);
  }

  // ---- the long bar against the pool wing, and the island bar on the south-east deck --------------------------------
  {
    const bx = (BAR.x0 + BAR.x1) / 2, L = BAR.x1 - BAR.x0, zc = BAR.z;
    K.box(M.white, bx, 0, zc, L, 1.04, 0.62); for (let i = 0; i < Math.round(L / 0.3); i++) K.box(M.teak2, BAR.x0 + 0.15 + i * 0.3, 0.06, zc - 0.315, 0.2, 0.86, 0.02);
    K.box(M.granite, bx, 1.04, zc - 0.05, L + 0.1, 0.05, 0.78); K.box(night ? K.e('#ffb36a') : M.white, bx, 0.98, zc - 0.43, L, 0.02, 0.02);
    K.box(M.white, bx, 0, 14.95, L, 0.95, 0.5); K.box(M.granite, bx, 0.95, 14.95, L, 0.04, 0.52);
    K.box(night ? K.e('#ffcf8a') : M.render, bx, 1.15, 15.45, L - 0.4, 1.7, 0.02);
    for (const y of [1.45, 1.95]) K.box(K.glass('#ffffff', 0.3), bx, y, 15.25, L - 0.4, 0.02, 0.3);
    bottles(K, BAR.x0 + 0.4, BAR.x1 - 0.4, 1.47, 15.27, R, 30); bottles(K, BAR.x0 + 0.4, BAR.x1 - 0.4, 1.97, 15.27, R, 26);
    for (let i = 0; i < 4; i++) iceBucket(K, M, BAR.x0 + 1.2 + i * 2.2, 0.95, 14.8);
    for (let x = BAR.x0 - 0.3; x <= BAR.x1 + 0.31; x += (L + 0.6) / 3) K.box(M.post, x, 0, 11.7, 0.16, 3.3, 0.16);
    for (let i = 0; i < 22; i++) K.box(M.slat, BAR.x0 - 0.4 + i * ((L + 0.8) / 21), 3.3, 13.6, 0.09, 0.16, 3.9);
    K.box(M.post, bx, 3.22, 11.7, L + 0.8, 0.14, 0.16);
    if (!night) { const [ox, oz] = shOff(3.3); shade(K, bx + ox * 0.5, 13.4 + oz * 0.5, L + 1.2, 3.8, 0.24); }
    else K.pool('#ffb36a', bx, 11.6, 3.0, 0.16);
    K.solid(BAR.x0, zc - 0.42, BAR.x1, 15.6);
  }
  {
    const { x, z } = ISLAND, w = 6.4, d = 4.4;
    for (const [cx, cz, ww, dd] of [[x, z - d / 2 + 0.31, w, 0.62], [x, z + d / 2 - 0.31, w, 0.62], [x - w / 2 + 0.31, z, 0.62, d - 1.24], [x + w / 2 - 0.31, z, 0.62, d - 1.24]]) { K.box(M.white, cx, 0, cz, ww, 1.04, dd); K.box(M.granite, cx, 1.04, cz, ww + 0.14, 0.05, dd + 0.14); }
    if (night) for (const [cx, cz, ww, dd] of [[x, z - d / 2 - 0.02, w, 0.02], [x, z + d / 2 + 0.02, w, 0.02], [x - w / 2 - 0.02, z, 0.02, d], [x + w / 2 + 0.02, z, 0.02, d]]) K.box(K.e('#18d2ff'), cx, 0.97, cz, ww, 0.02, dd);
    K.box(M.white, x, 0, z, 2.2, 0.95, 0.9); K.box(M.granite, x, 0.95, z, 2.24, 0.04, 0.94); K.box(night ? K.e('#ffcf8a') : M.render, x, 1.0, z, 1.9, 1.6, 0.5);
    bottles(K, x - 0.95, x + 0.95, 1.0, z - 0.3, R, 12); bottles(K, x - 0.95, x + 0.95, 1.0, z + 0.3, R, 12);
    for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) K.box(M.post, x + a * (w / 2 + 0.3), 0, z + b * (d / 2 + 0.3), 0.18, 3.5, 0.18);
    K.box(M.post, x, 3.5, z, w + 1.0, 0.24, d + 1.0); K.box(M.roof, x, 3.74, z, w + 0.8, 0.06, d + 0.8);
    if (night) K.pool('#18d2ff', x, z, 4.4, 0.18); else { const [ox, oz] = shOff(3.6); shade(K, x + ox * 0.5, z + oz * 0.5, w + 1.6, d + 1.6, 0.26); }
    K.solid(x - w / 2, z - d / 2, x + w / 2, z + d / 2);
    for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) K.disc(x + a * (w / 2 + 0.3), z + b * (d / 2 + 0.3), 0.18);
  }

  // ---- the south deck: loungers along the shelf, high tables under umbrellas, the way in from the wing ---------------
  for (const s of [-1, 1]) for (const ax of [6.2, 7.6, 9.0]) lounger(K, { frame: M.frame, mattress: M.mattress, towel: pills[(ax * 3) % 3 | 0] }, s * ax, 3.55, facing(0, -1));
  for (const [hx, hz] of [[-3.2, 5.0], [3.2, 5.0], [-5.8, 6.9], [5.8, 6.9]]) {
    K.cyl(M.steel, hx, 0, hz, 0.24, 0.26, 0.03, 18); K.cyl(M.steel, hx, 0.03, hz, 0.035, 0.035, 1.02, 8); K.cyl(M.granite, hx, 1.05, hz, 0.38, 0.38, 0.04, 28); K.disc(hx, hz, 0.42);
    umbrella(K, { steel: M.steel, pole: M.pole, canopy: M.canopy }, hx, hz, 2.8, !night, 1.09 - 1.09);
    if (!night) { const [ox, oz] = shOff(2.7); shade(K, hx + ox, hz + oz, 3.4, 3.4, 0.24); }
  }
  // (the pool wing's face at the deck: glass doors in, the club's name over them, the step-and-repeat beside, the host's stand)
  K.box(M.render, 0, 0, 15.85, 48.6, 4.2, 0.5);
  K.plane(night ? K.glass('#ffd9a0', 0.55) : K.glass('#9fb7c4', 0.5), 0, 1.45, 15.58, 5.4, 2.9, Math.PI);
  K.plane(night ? K.e('#3a2a1c') : K.m('#2a3238', 0.2), 0, 1.45, 15.6, 5.4, 2.9, Math.PI);
  for (const dx of [-2.75, -0.02, 2.75]) K.box(M.steel, dx, 0, 15.56, 0.06, 2.95, 0.06);
  K.box(M.white, 0, 3.0, 14.9, 7.2, 0.18, 1.6); const doorSign = K.t(signTex('TIDEWATER', 'BEACH CLUB', night ? '#ffe2b0' : '#c8a46a', 1024, 200));
  K.plane(night ? K.e('#ffffff', { map: doorSign, blending: THREE.AdditiveBlending }) : K.mt(doorSign, 0.6), 0, 3.75, 15.58, 4.6, 0.9, Math.PI);
  K.plane(night ? K.e('#ffffff', { map: doorSign, blending: THREE.AdditiveBlending }) : K.mt(doorSign, 0.6), 0, 3.75, 15.58 - 0.001, 4.6, 0.9, 0);
  if (night) K.pool('#ffcf8a', 0, 14.2, 3.2, 0.3);
  // (the step-and-repeat: the club's - or, on a sponsor's night, the brand's - name over and over, at the wall by the doors)
  const SR = { x0: -8.6, x1: -4.8, z: 15.42 };
  {
    const t = K.t(ctex(512, 320, (x, w, h) => { x.fillStyle = brand ? '#101014' : '#f4f1ea'; x.fillRect(0, 0, w, h); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = brand ? brand.color : '#1a9fb5'; const s = (brand?.name || 'TIDEWATER').toUpperCase(); let fs = 26; x.font = `600 ${fs}px 'Didot', Georgia, serif`; while (fs > 12 && x.measureText(s).width > w / 3 - 24) { fs -= 1; x.font = `600 ${fs}px 'Didot', Georgia, serif`; } for (let j = 0; j < 7; j++) for (let i = -1; i < 4; i++) x.fillText(s, (i + 0.5 + (j % 2 ? 0.5 : 0)) * (w / 3), 24 + j * 46); }));
    K.plane(K.mt(t, 0.8), (SR.x0 + SR.x1) / 2, 1.35, SR.z, SR.x1 - SR.x0, 2.5, Math.PI);
    K.box(M.black, (SR.x0 + SR.x1) / 2, 0, SR.z + 0.05, SR.x1 - SR.x0 + 0.1, 0.06, 0.1);
  }
  K.at(3.4, 13.6, facing(0, -1), () => { K.box(M.black, 0, 0, 0, 0.5, 1.1, 0.7); K.box(M.granite, 0.02, 1.1, 0, 0.56, 0.04, 0.76); K.box(night ? K.e('#cfe6ff') : M.speaker, 0.05, 1.14, 0, 0.22, 0.012, 0.3); K.solid(-0.28, -0.38, 0.28, 0.38); });
  for (let i = 0; i < 4; i++) { const z = 14.6 - i * 0.9; K.cyl(M.foil, 2.4, 0, z, 0.12, 0.14, 0.03, 12); K.cyl(M.foil, 2.4, 0.03, z, 0.022, 0.022, 0.92, 8); K.sph(M.foil, 2.4, 0.97, z, 0.04, 8, 6); if (i < 3) K.tube(K.m('#7a0f22', 0.6), [[2.4, 0.9, z], [2.4, 0.74, z - 0.45], [2.4, 0.9, z - 0.9]], 0.022, 10, 6); K.disc(2.4, z, 0.14); }
  K.box(M.white, 6.7, 0, 15.0, 2.8, 0.95, 0.6); for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) K.bar(M.towel, 5.55 + i * 0.46, 1.0 + j * 0.13, 14.95, 0.065, 0.42, Math.PI / 2, 10);
  K.solid(5.3, 14.6, 8.1, 15.6);
  // (the wing's service door, east: the side way out)
  K.box(M.steel, 20.0, 0, 15.57, 1.2, 2.3, 0.04); K.box(K.e(night ? '#3aff8a' : '#2a8a4a'), 20.0, 2.42, 15.56, 0.42, 0.14, 0.02);

  // ---- the quiet corner (south-west): a garden of grasses, low sofas round a fire (or a shaded table by day) -----------
  {
    const qx = -21.2, qz = 10.0;
    const grass = K.m(night ? '#8a9a6a' : '#ffffff', 0.9, 0, { map: K.t(grassTex(rng(19))), alphaTest: 0.45, side: THREE.DoubleSide });
    for (let z = 5.4; z < 15.2; z += 1.1) if (z < 8.6 || z > 10.8) { K.box(M.stone, -18.2, 0, z, 0.6, 0.55, 1.0); K.box(M.soil, -18.2, 0.5, z, 0.5, 0.04, 0.9); for (let k = 0; k < 2; k++) tuft(K, grass, -18.2 + (R() - 0.5) * 0.16, 0.52, z + (k ? 0.22 : -0.22) + (R() - 0.5) * 0.1, 0.8 + R() * 0.3, R); K.solid(-18.5, z - 0.5, -17.9, z + 0.5); }
    sofa(K, { frame: M.sofaF, cushion: M.cushion, foot: M.steel }, -23.1, qz, 3.6, 0); sofa(K, { frame: M.sofaF, cushion: M.cushion, foot: M.steel }, qx, 12.9, 2.6, facing(0, -1));
    K.box(M.stone, qx, 0, qz, 1.6, 0.42, 1.0);
    if (night) { K.box(K.m('#141414', 0.9), qx, 0.42, qz, 1.2, 0.02, 0.6); for (const dz of [-0.3, 0, 0.3]) K.sph(K.e('#ff8a2a'), qx + dz * 1.5, 0.48, qz, 0.09, 8, 6, 1.6, 0.8, 1); K.pool('#ff7a2a', qx, qz, 2.4, 0.35); }
    else umbrella(K, { steel: M.steel, pole: M.pole, canopy: M.canopy }, qx + 1.2, qz - 1.3, 3.0, true);
    K.solid(qx - 0.8, qz - 0.5, qx + 0.8, qz + 0.5);
  }

  // ---- the palms, in stone planters ---------------------------------------------------------------------------------
  const PALMS = [[-14.6, -8.4, 9.5], [14.6, -8.4, 10.2], [-14.6, -2.0, 8.6], [14.6, -2.0, 9.0], [-9.0, -17.7, 11.6], [9.0, -17.7, 11.0], [-11.8, 4.6, 8.0], [11.8, 4.6, 8.8], [-3.5, 14.8, 7.2], [3.5, 14.8, 7.6], [-22.6, 14.4, 9.8], [22.4, 9.4, 9.2], [-23.0, -13.6, 10.6], [23.0, -13.6, 10.0]];
  for (const [px, pz, h] of PALMS) {
    const r = 0.44, lx = (RS() - 0.5) * 0.9, lz = (RS() - 0.5) * 0.9;
    planter(K, M, px, pz, r, 0.5); palm(K, M, px, 0.46, pz, h, lx, lz, RS);
    if (night) K.pool('#ffd9a0', px, pz, 1.3, 0.3, 0.52);
    else {
      // (the crown's shadow, and the trunk's from the planter out to it)
      const [ox, oz] = shOff(h + 0.5), cx = px + lx + ox, cz = pz + lz + oz, L = Math.hypot(cx - px, cz - pz), P0 = POOL;
      shade(K, cx, cz, 6.6, 6.6, 0.34, 0.007, 'palm');
      const wet = (x, z) => x > P0.x0 - P0.cope - 0.3 && x < P0.x1 + P0.cope + 0.3 && z > P0.z0 - P0.cope - 0.3 && z < P0.z1 + P0.cope + 0.3;
      if (![0.2, 0.4, 0.6, 0.8, 1].some((t) => wet(px + (cx - px) * t, pz + (cz - pz) * t))) K.plane(K.e('#000000', { map: shadeTex(K).rect, opacity: 0.44, fixed: true, depthWrite: false }), (px + cx) / 2, 0.0065, (pz + cz) / 2, 0.34, L, Math.atan2(cx - px, cz - pz), true);
    }
  }

  // ---- the water: one mesh over the main pool and both plunge pools; the light netted on their floors by day ----------
  const sunW = sunL.clone().normalize(); if (hosted && E.scene?.quaternion) sunW.applyQuaternion(E.scene.quaternion);
  const WM = waterMat(night, sunW, POOL.shelf), want = waterFxWanted(), wm = want === 0 ? WM.flat : WM.fx, rects = [[x0, z0, x1, z1, POOL.wl], ...plunges.map(([a, b, cc, d]) => [a, b, cc, d, BUNG.h - 0.1])];
  const wg = mergeGeometries(rects.map(([a, b, cc, d, y]) => { const g = new THREE.PlaneGeometry(cc - a, d - b); g.rotateX(-Math.PI / 2); g.translate((a + cc) / 2, y, (b + d) / 2); return norm(g); }));
  const water = K.obj(new THREE.Mesh(wg, wm)); water.renderOrder = 2; water.matrixAutoUpdate = false; water.updateMatrix(); water.userData.water = true;
  const absorb = K.obj(new THREE.Mesh(wg, absorbMat(night))); absorb.renderOrder = 1.5; absorb.matrixAutoUpdate = false; absorb.updateMatrix();
  // (the light netted on the floor: one additive layer, the cell pattern read twice - two scales drifting different ways -
  // and the brighter of where both are bright kept, so the net shifts and re-forms as a real one does)
  const cauT = K.t(causticTex()), CU = { uT: { value: 0 } };
  const cm = new THREE.MeshBasicMaterial({ map: cauT, color: night ? '#5fe0ff' : '#f2fdff', transparent: true, opacity: night ? 0.16 : 0.52, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  cm.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, CU);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uT;').replace('#include <map_fragment>', `{
      vec2 u0 = vMapUv + vec2( uT * 0.021, uT * 0.013 ), u1 = vMapUv * 1.37 + vec2( -uT * 0.017, uT * 0.024 );
      float a = texture2D( map, u0 ).r, b = texture2D( map, u1 ).r;
      diffuseColor.rgb *= min( a, b ) * 1.5 + max( a, b ) * 0.22;
    }`);
  };
  cm.customProgramCacheKey = () => 'pool-caustic-v1';
  const cg = mergeGeometries([[x0, z0, x1, sz, D], [x0, sz, x1, z1, Lg], ...plunges.map(([a2, b, cc, d]) => [a2, b, cc, d, BUNG.h - 0.9])].map(([a2, b, cc, d, y]) => { const q = new THREE.PlaneGeometry(cc - a2, d - b); q.rotateX(-Math.PI / 2); q.translate((a2 + cc) / 2, y + 0.012, (b + d) / 2); const p = q.attributes.position, uv = q.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / 1.9, -p.getZ(i) / 1.9); return norm(q); }));
  const cau = K.obj(new THREE.Mesh(cg, cm)); cau.renderOrder = 1; cau.matrixAutoUpdate = false; cau.updateMatrix();
  const U = WM.U;
  K.anim((t) => { U.uT.value = t; CU.uT.value = t; });
  // (which look draws: the one asked for, else the full look if it passes the probe the first frame the room is shown)
  const wstate = { fx: want !== 0, probe: null, forced: want };
  if (globalThis.__waterBreak) U.uBreak.value = 1;   // (a test switch: the full look drawn black, as the laptop drew it - the probe must catch it)
  const useFlat = (why) => { if (water.material === WM.flat) return; water.material = WM.flat; wstate.fx = false; wstate.why = why; WM.fx.dispose(); };
  if (want === 0) WM.fx.dispose(); else if (want === 1) WM.flat.dispose();
  if (want == null) {
    let probed = false;
    K.anim(() => {
      if (probed || !E.renderer) return; probed = true;
      const r = wstate.probe = waterProbe(E.renderer, WM.fx, sunW);
      if (r && !r.ok) { console.warn(`PartyPool: the full water look draws black here (mean ${r.lum}, ${Math.round(r.black * 100)}% black) - the flat water instead`); useFlat('probe'); }
      else if (r) WM.flat.dispose();
    });
  }
  // (where someone stands in the water, the ring of ripples round them at the surface: one instanced mesh, its places
  // refreshed four times a second from the crowd and the guests - nothing allocated after the build)
  const ringT = K.t(ctex(64, 64, (x, w) => { x.clearRect(0, 0, w, w); const g = x.createRadialGradient(w / 2, w / 2, w * 0.16, w / 2, w / 2, w / 2); for (const [p, a] of [[0, 0], [0.3, 0.95], [0.5, 0.25], [0.7, 0.45], [0.85, 0.12], [1, 0]]) g.addColorStop(p, `rgba(255,255,255,${a})`); x.fillStyle = g; x.fillRect(0, 0, w, w); }));
  const RMAX = 72, ringG = new THREE.PlaneGeometry(1, 1); ringG.rotateX(-Math.PI / 2);
  const rings = K.obj(new THREE.InstancedMesh(ringG, new THREE.MeshBasicMaterial({ map: ringT, color: night ? '#9fefff' : '#ffffff', transparent: true, opacity: night ? 0.3 : 0.5, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }), RMAX));
  rings.count = 0; rings.renderOrder = 3; rings.frustumCulled = false; rings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const _rm = new THREE.Matrix4(); let ringAcc = 1;
  // (the full look's own rings, in its slope: the RIPN swimmers nearest the camera - kept sorted in place, nothing allocated)
  const rip = U.uRip.value, ripD = new Float32Array(RIPN), _rc = V3(0, 0, 0);
  K.anim((t, dt) => {
    if ((ringAcc += dt) < 0.25) return; ringAcc = 0;
    if (E.cam) { _rc.copy(E.cam.position); if (hosted && E._toL) E._toL(_rc); }
    let n = 0, nr = 0; ripD.fill(1e9); for (let i = 0; i < RIPN; i++) rip[i].z = 0;
    const C = E.crowd, put = (x, z, s, k = 0.035, ph = 0) => {
      if (n < RMAX) { _rm.makeScale(s, 1, s).setPosition(x, POOL.wl + 0.004, z); rings.setMatrixAt(n++, _rm); }
      const d = (x - _rc.x) ** 2 + (z - _rc.z) ** 2; if (d >= ripD[RIPN - 1]) return;
      let i = RIPN - 1; while (i > 0 && ripD[i - 1] > d) { ripD[i] = ripD[i - 1]; rip[i].copy(rip[i - 1]); i--; }
      ripD[i] = d; rip[i].set(x, z, k, ph); nr++;
    };
    if (C?.ready && C.people) for (const p of C.people) if (p.on && p.y < -0.3) put(p.x, p.z, (p.swimR || 0.8) * (p.scale || 1), p.swimK || 0.035, p.misc?.[0] || 0);
    for (const g of E.gs || []) if (g.person && !g.gone && (g.spot?.y || 0) < -0.3) put(g.person.group.position.x, g.person.group.position.z, 0.84);
    const me = E.pool;   // (you, in the water: ui/PoolLife.js's swim state)
    if (me?.inWater) put(me.x, me.z, me.swim ? 1.15 : 0.9, me.swim ? 0.07 : 0.04, 0);
    if (n || rings.count) { rings.count = n; rings.instanceMatrix.needsUpdate = true; }
  });

  // ---- the world round it: hosted, the podium down to the street and the resort's wings; else painted --------------
  if (hosted) {
    // (the resort's two pool wings, north behind the stage and south where you come in, down to the street; the podium
    // under the deck, its roof just under the basin)
    const base = podium ? -ay : 0, boxes = [[-24.3, base, -30, 24.3, 7.6, -18.6], [-24.3, base, 16.1, 24.3, 14, 26]];
    if (podium) boxes.push([-24.3, -ay, -18.6, 24.3, -1.4, 16.1]);
    massOf(K, E, boxes);
  } else worldOf(K, E, night, R);

  // ---- what there is to do ----------------------------------------------------------------------------------------
  const look = hosted ? (E.hx?.sphere ? E.hx.sphere.clone() : V3(400, 30, 0)) : V3(-330, 40, 520);
  const drinks = night ? 'Champagne, cocktails, shots, beer, water' : 'Frozen cocktails, buckets of beer, champagne, water';
  K.hot({ id: 'bar', kind: 'bar', x: -12.9, y: 1.15, z: 11.9, reach: 2.3, label: 'The bar', sub: drinks, text: 'The bartender leans in to hear you over the bass.' });
  K.hot({ id: 'bar-i', kind: 'bar', x: ISLAND.x, y: 1.15, z: ISLAND.z - 2.6, reach: 2.3, label: 'The island bar', sub: drinks, text: 'Two deep at the island bar, but it moves.' });
  K.hot({ id: 'table', kind: 'table', x: MYCAB.x + 0.35, y: 0.9, z: MYCAB.z, reach: 2.4, label: 'Your cabana', sub: 'Bottle service, invite someone over, send a round', text: 'Your cabana: a sofa in the shade, a bottle on ice, the pool in front of you.' });
  K.hot({ id: 'dj', kind: 'dj', x: 8.4, y: 1.4, z: -15.4, reach: 2.4, label: 'The DJ', sub: 'Ask for something', text: 'The DJ gives you a nod from the decks.' });
  K.hot({ id: 'dance', kind: 'dance', x: 0, y: 1.0, z: 1.85, reach: 3.2, label: "Dance at the water's edge", text: 'The whole pool is moving.' });
  K.hot({ id: 'wall', kind: 'wall', x: (SR.x0 + SR.x1) / 2, y: 1.4, z: 14.6, reach: 2.0, label: 'The step-and-repeat', sub: 'Stop for the photographers', text: 'A photographer waves you in front of the wall.' });
  K.hot({ id: 'door', kind: 'door', x: 0, y: 1.4, z: 15.0, reach: 2.2, label: 'The way out', sub: 'Back through the resort', text: 'The doors back into the resort.' });
  K.hot({ id: 'side', kind: 'door', side: true, x: 20.0, y: 1.4, z: 15.0, reach: 2.0, label: 'The service door', sub: 'A quieter way out', text: 'A corridor behind the bar, and a lift down.' });
  K.hot({ id: 'quiet', kind: 'quiet', x: -21.2, y: 1.0, z: 9.0, reach: 2.6, label: 'Sit out in the garden', look: V3(-21.2, 0.6, 10.0), text: night ? 'The fire, the grasses, the bass a little further off.' : 'Shade, the grasses moving, the bass a little further off.' });
  K.hot({ id: 'view', kind: 'moment', x: -23.4, y: 1.3, z: -5.0, reach: 2.2, label: 'Look out over the wall', look });
  K.hot({ id: 'photo', kind: 'photo', x: 4.4, y: 1.3, z: 2.0, reach: 2.4, label: 'Take a photo by the pool' });
  K.hot({ id: 'feet', kind: 'flavour', x: x1 + 0.5, y: 0.3, z: -6.0, reach: 2.0, label: 'Sit on the edge, feet in the water', text: night ? 'The water is warm, lit blue from below. The bass comes up through it.' : 'Warm as a bath by now. The light nets on the floor of the pool.' });
  K.area(DECK.x0 + 0.1, DECK.z0 + 0.2, DECK.x1 - 0.1, DECK.z1 - 0.1);
  K.hot({ id: 'towels', kind: 'flavour', x: 6.7, y: 1.0, z: 14.55, reach: 1.9, label: 'The towel stand', sub: 'Towels, and swim shorts to change into', text: 'Stacks of white towels, rolled.' });

  // ---- the zones (each an array of rects - ui/PartyVenues.js's ZL - the bounding rect on it as well) ---------------
  const zones = {
    floor: ZL(Rect(x0 - c, z0 - c, x1 + c, 2.6), Rect(8.2, -12.6, 11.4, -10.6), Rect(-11.4, -12.6, -8.2, -10.6)),
    dj: ZL(Rect(STAGE.x0, STAGE.z0, STAGE.x1, STAGE.z1, STAGE.h)),
    bar: ZL(Rect(BAR.x0 - 0.3, 10.6, BAR.x1 + 0.3, DECK.z1), Rect(ISLAND.x - 4.4, ISLAND.z - 3.6, ISLAND.x + 4.4, ISLAND.z + 3.6)),
    vip: ZL(Rect(-22.2, -14.0, -16.6, 4.0), Rect(16.6, -14.0, 22.2, 4.0), Rect(12.6, -11.2, 16.6, 0.8), Rect(-16.6, -11.2, -12.6, 0.8), Rect(BUNG.x0, BUNG.z0, BUNG.x1, BUNG.z1, BUNG.h), Rect(-BUNG.x1, BUNG.z0, -BUNG.x0, BUNG.z1, BUNG.h)),
    quiet: ZL(Rect(-23.9, 5.0, -18.4, 15.4)), door: ZL(Rect(-3.0, 12.6, 3.0, DECK.z1)), tables: ZL(Rect(-11.0, 2.6, 9.6, 10.4)), vestibule: ZL(), casino: ZL(), garage: ZL(),
  };
  const ZORD = ['dj', 'vip', 'floor', 'bar', 'quiet', 'door', 'tables'];
  const zoneOf = (x, z) => { for (const k of ZORD) for (const r of zones[k]) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return k; return 'room'; };

  // ---- who stands where ---------------------------------------------------------------------------------------------
  // (in the water only in swimwear: when People has none yet - or the night's wardrobe is the club's - everyone stays on
  // the deck, at the water's edge, on the daybeds, sitting on the coping with their feet in)
  const swim = swimKits('f').length > 0 || !!globalThis.__poolWet, wet = swim && (E.occ === 'pool' || !!globalThis.__poolWet);
  const F = POOL.deep, SP = (x, z, face, pose = 'stand', y = 0) => K.spot(x, z, face, pose, y, { zone: zoneOf(x, z) });
  const toward = (x, z, tx, tz) => facing(tx - x, tz - z), DBX = DAYBED_X - 0.42, EDGE = -0.4;
  const spots = {
    partner: [SP(MYCAB.x + 2.1, MYCAB.z + 0.75, toward(MYCAB.x + 2.1, MYCAB.z + 0.75, MYCAB.x, MYCAB.z)), SP(MYCAB.x + 2.0, MYCAB.z - 0.9, toward(MYCAB.x + 2.0, MYCAB.z - 0.9, MYCAB.x, MYCAB.z))],
    mate: [wet ? SP(x0 + 0.8, -5.0, facing(-1, 0), 'stand', F) : SP(x0 - 0.9, -5.0, facing(1, 0.1)), SP(ISLAND.x + 2.2, ISLAND.z - 2.8, facing(-0.3, 1))],
    rival: [SP(ISLAND.x - 1.6, ISLAND.z - 2.9, facing(0.4, 1)), SP(-6.9, 5.6, facing(1, -0.3))],
    exmate: [SP(-4.2, 5.2, facing(1, -0.2)), SP(-13.6, 11.5, facing(0.3, 1))],
    friend: [SP(x1 + 0.2, -4.6, facing(-1, 0), 'sit', EDGE), SP(6.2, 5.6, facing(-1, -0.3)), SP(x1 + 0.2, -3.7, facing(-1, 0), 'sit', EDGE)],
    celeb: [SP(DBX, DAYBED_Z[1] - 0.5, facing(-1, 0), 'sit'), wet ? SP(x1 - 0.8, -8.6, facing(1, 0), 'stand', F) : SP(-DBX, DAYBED_Z[2] + 0.5, facing(1, 0), 'sit'),
      wet ? SP(2.2, 0.1, facing(0, 1), 'stand', Lg) : SP(2.2, 1.95, facing(0, 1)), SP(CABANA_X - 2.2, CABANA_Z[1], facing(-1, 0.3)), SP(-DBX, DAYBED_Z[2] - 0.5, facing(1, 0), 'sit')],
    rep: [SP(15.2, BUNG.z1 - 0.9, facing(0, 1), 'stand', BUNG.h), SP(-15.2, BUNG.z1 - 0.9, facing(0, 1), 'stand', BUNG.h)],
    agent: [SP(9.8, -11.4, facing(-1, 0.4)), SP(-9.8, -11.4, facing(1, 0.4))],
    press: [SP(-11.2, 11.5, facing(0.3, -1)), SP(4.6, 7.4, facing(-0.4, -1))],
    infl: [wet ? SP(-2.6, 0.2, facing(0, -1), 'stand', Lg) : SP(-2.6, 1.95, facing(0, -1)), SP(-4.4, 4.6, facing(0.3, -1))],
    present: [SP(-15.4, 11.4, facing(1, -0.3)), SP(8.4, 5.8, facing(-1, -0.4))],
    dj: [SP(0, -15.75, facing(0, 1), 'stand', STAGE.h)],
    security: [SP(-2.9, 14.4, facing(0, -1)), SP(8.9, -16.0, facing(0, 1))],
    antagonist: [SP(-9.8, 11.5, facing(-1, -0.2)), SP(5.5, 4.6, facing(-1, -0.6))],
    boss: [],
  };
  // (the people you came with, on an ordinary evening: a date on a daybed with you, or at the water; a group at the
  // corner of the deck by the shallow end)
  const date = [spots.celeb[0], spots.friend[0], wet ? spots.celeb[1] : spots.celeb[4]];
  const group = [SP(x1 + 0.9, -0.9, facing(-0.4, -1)), SP(x1 + 1.6, 0.4, facing(-1, -0.2)), SP(x1 + 0.7, 1.9, facing(-0.3, -1))];

  // ---- the crowd's places: in the water (in swimwear), on the shelf, at the bars, on the daybeds and in the cabanas - at
  // most PartyCrowd's 96, the earliest hours first. With no swimwear the water is left to the floats and the crowd stands
  // round the pool's edge instead, facing the DJ
  const t0 = P.start ?? (night ? 23.75 : 13), CS = [], RN = rng(night ? 919 : 929);
  const cs = (x, z, o) => { const { look: L, ...r } = o, yaw = L ? facing(L.x - x, L.z - z) : +r.yaw || 0; CS.push({ y: 0, pose: 'stand', ...r, x: +x.toFixed(2), z: +z.toFixed(2), yaw: +yaw.toFixed(3) }); };
  const toDJ = { x: 0, z: -15.5 }, nearPod = (x, z) => Math.hypot(Math.abs(x) - 6.0, z + 6.2) < 1.35;
  if (swim) {
    // (the pool: the front half facing the DJ, packed; the back half in little groups, talking; the podiums kept clear)
    for (let iz = 0; iz < 4; iz++) for (let ix = 0; ix < 10; ix++) {
      const x = -9.4 + ix * 2.1 + (RN() - 0.5) * 0.9, z = -10.8 + iz * 1.3 + (RN() - 0.5) * 0.5;
      if (nearPod(x, z) || RN() < 0.12) continue;
      cs(x, z, { y: F, zone: 'floor', role: 'dancer', pose: 'dance', look: { x: x * 0.4 + toDJ.x, z: toDJ.z }, from: t0 + 0.15 + iz * 0.2 + RN() * 0.5 });
    }
    for (let k = 0; k < 5; k++) {
      const cx = -8.2 + k * 4.1 + (RN() - 0.5) * 0.8, cz = -3.0 + (RN() - 0.5) * 1.0, n = 2 + ((RN() * 2) | 0);
      for (let j = 0; j < n; j++) { const a = (j / n) * TAU + RN(), x = cx + Math.cos(a) * 0.55, z = cz + Math.sin(a) * 0.55; cs(x, z, { y: F, zone: 'floor', role: 'dancer', pose: 'talk', look: { x: cx, z: cz }, from: t0 + 0.5 + RN() * 1.2 }); }
    }
    for (const [x, z] of [[-5.2, 0.1], [4.9, 0.2], [0.6, -0.4]]) cs(x, z, { y: Lg, zone: 'floor', role: 'dancer', pose: 'dance', look: toDJ, from: t0 + 0.3 + RN() * 0.6 });
  } else {
    // (round the edge: two deep along the shallow end, a row down either side, all of them turned to the DJ)
    for (let k = 0; k < 15; k++) { const x = -9.8 + k * 1.4 + (RN() - 0.5) * 0.4, z = 1.75 + (k % 2) * 0.75 + (RN() - 0.5) * 0.2; cs(x, z, { zone: 'floor', role: 'dancer', pose: 'dance', look: { x: x * 0.5, z: toDJ.z }, from: t0 + 0.15 + RN() * 0.9 }); }
    for (const s of [-1, 1]) for (let k = 0; k < 6; k++) cs(s * (11.75 + (k % 2) * 0.35), -10.4 + k * 1.75 + (RN() - 0.5) * 0.3, { zone: 'floor', role: 'dancer', pose: 'dance', look: { x: s * 6, z: toDJ.z }, from: t0 + 0.25 + RN() * 0.9 });
  }
  for (const s of [-1, 1]) cs(s * 6.0, -6.2, { y: 0.65, zone: 'podium', role: 'performer', pose: 'dance', look: { x: 0, z: -2 }, from: t0 });
  // (the decks beside the stage, dancing)
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) cs(s * (9.4 + (k % 2) * 1.1) + (RN() - 0.5) * 0.4, -11.7 + Math.floor(k / 2) * 1.0 + (RN() - 0.5) * 0.3, { zone: 'floor', role: 'dancer', pose: 'dance', look: toDJ, from: t0 + 0.4 + RN() * 0.8 });
  // (the bars: along the long counter, round the island)
  for (let k = 0; k < 6; k++) { const x = BAR.x0 + 0.8 + k * 1.45; cs(x, BAR.z - 0.92 - RN() * 0.15, { zone: 'bar', role: 'bar', pose: k % 2 ? 'drink' : 'lean', lean: k % 2 === 0, look: { x, z: BAR.z }, from: t0 + RN() * 0.6 }); }
  for (const [dx, dz] of [[-2.2, -2.75], [0.4, -2.8], [3.75, -0.6], [-3.75, 0.8], [1.2, 2.75]]) cs(ISLAND.x + dx, ISLAND.z + dz, { zone: 'bar', role: 'bar', pose: 'drink', look: { x: ISLAND.x + dx * 0.6, z: ISLAND.z + dz * 0.6 }, from: t0 + RN() * 0.8 });
  // (the daybeds: two sitting on most, at the front of the mattress facing the pool)
  for (const s of [-1, 1]) DAYBED_Z.forEach((z, i) => { for (const dz of [-0.5, 0.5]) if (RN() < 0.62) cs(s * DBX, z + dz, { zone: 'vip', role: 'booth', pose: 'sit', seat: true, yaw: facing(-s, 0), from: t0 + 0.1 + RN() * 1.0 }); });
  // (the cabanas: on the sofa, now and then one standing in front)
  for (const s of [-1, 1]) CABANA_Z.forEach((z, i) => {
    if (s < 0 && i === 2) return;   // (yours)
    for (const dz of [-0.7, 0.7]) if (RN() < 0.6) cs(s * (CABANA_X + 0.97), z + dz, { y: 0.12, zone: 'vip', role: 'booth', pose: 'sit', seat: true, yaw: facing(-s, 0), from: t0 + 0.3 + RN() * 1.2 });
    if (RN() < 0.4) cs(s * (CABANA_X - 1.3), z + (RN() - 0.5) * 1.6, { y: 0.12, zone: 'vip', role: 'bar', pose: 'drink', look: { x: s * CABANA_X, z }, from: t0 + 0.5 + RN() * 1.0 });
  });
  // (the bungalows' decks: their guests on the sofas, one at the rail)
  for (const s of [-1, 1]) { for (const bx of [17.3, 21.6]) cs(s * bx, BUNG.z0 + 0.95, { y: BUNG.h, zone: 'vip', role: 'booth', pose: 'sit', seat: true, yaw: facing(0, 1), from: t0 + 0.4 + RN() }); cs(s * 17.4, BUNG.z1 - 0.6, { y: BUNG.h, zone: 'vip', role: 'bar', pose: 'drink', look: { x: s * 12, z: -6 }, from: t0 + 0.6 + RN() }); }
  // (the south deck: people standing about, by the tables and the loungers)
  for (const [x, z] of [[-3.2, 5.9], [3.2, 5.9], [2.5, 4.5], [-5.8, 7.8], [6.7, 6.3], [-8.4, 5.4]]) cs(x + (RN() - 0.5) * 0.3, z + (RN() - 0.5) * 0.3, { zone: 'tables', role: 'bar', pose: 'talk', look: { x: Math.round(x / 3) * 3, z: z - 0.8 }, from: t0 + RN() * 1.2 });
  // (the house: bottle-service servers, security at the doors and the stage, the house photographer)
  for (const [x, z, f] of [[-17.3, -5.0, 1], [17.3, -9.6, -1], [12.4, -6.0, 1]]) cs(x, z, { zone: 'vip', role: 'server', yaw: facing(0, f), from: t0 });
  for (const [x, z, f] of [[2.9, 14.6, -1], [-9.0, -15.6, 1], [11.4, -14.0, 1]]) cs(x, z, { zone: 'door', role: 'security', yaw: facing(0, f), from: t0 });
  cs(-4.0, 2.2, { zone: 'floor', role: 'photographer', pose: 'photo', look: { x: 0, z: -6 }, from: t0 });
  if (brand) for (const [x, z] of [[-5.6, 13.3], [-7.6, 13.4]]) cs(x, z, { zone: 'door', role: 'promo', look: { x: 0, z: 10 }, from: t0, brand: true });
  // (the stage: the DJ's friends dancing behind the decks)
  for (const [x, z] of [[-2.7, -16.6], [2.5, -16.8], [3.4, -16.2]]) cs(x, z, { y: STAGE.h, zone: 'dj', role: 'dancer', pose: 'dance', look: { x: 0, z: 0 }, from: t0 + 0.3 + RN() * 0.6 });
  // (nobody of the crowd within 0.75 m of anyone you can talk to, of the bartender or of your seats)
  const seats = [{ x: MYCAB.x - 0.97, z: MYCAB.z - 0.7, yaw: 0, eye: 1.3 }, { x: MYCAB.x - 0.97, z: MYCAB.z + 0.7, yaw: 0, eye: 1.3 }];
  const staff = { name: 'Dani', role: 'Bartender', x: -12.9, z: 13.75, face: facing(0, -1), hot: 'bar', look: { kit: 'knitpolo', color: '#111114', accent: '#111114', legs: '#141518', pose: 'talk', seed: 'tidewater-bartender' } };
  // (a party's people stand in their roles' spots; an ordinary evening's only in the date's and the group's)
  const heroes = [...(E.isParty ? Object.values(spots).flat() : []), ...date, ...group, ...seats, staff];
  const crowdSpots = CS.filter((s) => !heroes.some((h) => (h.x - s.x) ** 2 + (h.z - s.z) ** 2 < 0.5625));
  // (an ordinary evening has no DJ of the party's cast: the resident one at the decks, first in - so always there)
  if (!E.isParty) crowdSpots.unshift({ x: 0, z: -15.75, y: STAGE.h, yaw: +facing(0, 1).toFixed(3), zone: 'dj', role: 'dancer', pose: 'dance', from: t0 - 1 });
  // ---- the crowd's lives (world/PoolLife.js): where the bars are served, the queues, the floors, the seats, the water -
  // and the guests who fill the deck to ~170 at the peak, walking in at the door as the night fills
  const n0 = CS.length;
  {
    const more = (x, z, o) => { if (CS.length < n0 + 84) cs(x, z, o); };
    for (let k = 0; k < 22 && swim; k++) { const x = -9.6 + RN() * 19.2, z = -1.6 - RN() * 9.6; if (!nearPod(x, z)) more(x, z, { y: F, zone: 'floor', role: 'bar', pose: 'talk', yaw: RN() * TAU, from: t0 + 0.8 + RN() * 1.2 }); }
    for (let k = 0; k < 10 && swim; k++) more(-9.4 + RN() * 18.8, -0.7 + RN() * 1.4, { y: Lg, zone: 'floor', role: 'bar', pose: 'drink', yaw: RN() * TAU, from: t0 + 0.9 + RN() * 1.2 });
    for (let k = 0; k < 16; k++) { const s = RN() < 0.5 ? -1 : 1; more(s * (11.9 + RN() * 1.4), -10.5 + RN() * 11, { zone: 'floor', role: 'bar', pose: 'drink', yaw: facing(-s, 0), from: t0 + 0.7 + RN() * 1.3 }); }
    for (let k = 0; k < 18; k++) more(-10 + RN() * 20, 3.2 + RN() * 7.6, { zone: 'tables', role: 'bar', pose: RN() < 0.5 ? 'drink' : 'talk', yaw: RN() * TAU, from: t0 + 0.6 + RN() * 1.4 });
    for (let k = 0; k < 6; k++) more(-22.6 + RN() * 3.4, 6 + RN() * 2.2, { zone: 'quiet', role: 'bar', pose: 'talk', yaw: RN() * TAU, from: t0 + 1.0 + RN() });
    for (let k = 0; k < 8; k++) more(-6 + RN() * 12, 2.0 + RN() * 0.8, { zone: 'floor', role: 'dancer', pose: 'dance', look: toDJ, from: t0 + 0.9 + RN() });
  }
  crowdSpots.push(...CS.slice(n0).filter((s) => !heroes.some((h) => (h.x - s.x) ** 2 + (h.z - s.z) ** 2 < 0.5625)));
  const lifeVoid = (x, z, r = 0.9) => heroes.some((h) => (h.x - x) ** 2 + (h.z - z) ** 2 < r * r);
  const lifePlan = (() => {
    const fz = facing(0, 1), bz = facing(0, -1), L = [];
    // (the long bar: places at the counter either side of yours (where the bartender serves you), three deep behind)
    const longSlots = [], longQ = []; for (let x = BAR.x0 + 0.7; x < BAR.x1 - 0.4; x += 0.8) if (Math.abs(x + 12.9) > 0.7) longSlots.push({ x, z: 11.92, yaw: fz });   // (a place every 0.8 m: at a party the principals' own spots take some)
    for (let i = 0; i < 12; i++) longQ.push({ x: -13.1 + ((i % 4) - 1.5) * 1.15 + (i >> 2) * 0.3, z: 10.95 - (i >> 2) * 0.7, yaw: fz });
    const isl = ISLAND, islSlots = [], islQ = [];
    for (let x = isl.x - 2.7; x <= isl.x + 2.75; x += 1.05) { if (Math.abs(x - isl.x) > 0.7) islSlots.push({ x, z: isl.z - 2.65, yaw: fz }); islSlots.push({ x, z: isl.z + 2.65, yaw: bz }); }
    for (let z = isl.z - 1.5; z <= isl.z + 1.55; z += 1.0) { islSlots.push({ x: isl.x - 3.65, z, yaw: 0 }); islSlots.push({ x: isl.x + 3.65, z, yaw: Math.PI }); }
    for (let i = 0; i < 10; i++) islQ.push({ x: isl.x - 1.6 + (i % 4) * 1.1 + (i >> 2) * 0.3, z: isl.z - 3.7 - (i >> 2) * 0.7, yaw: fz });
    const bars = [{ id: 'long', slots: longSlots.filter((s) => !lifeVoid(s.x, s.z, 0.62)), queue: longQ }, { id: 'island', slots: islSlots.filter((s) => !lifeVoid(s.x, s.z, 0.62)), queue: islQ }];
    // (the floors: in the water before the DJ (swum in), along the shallow end, the decks beside the stage)
    const dance = [];
    for (let iz = 0; iz < 4; iz++) for (let ix = 0; ix < 9; ix++) { const x = -8.8 + ix * 2.2 + (iz % 2) * 0.6, z = -10.7 + iz * 1.25; if (!nearPod(x, z)) dance.push({ x, z, y: F, yaw: facing(-x * 0.6, toDJ.z - z), water: true }); }
    for (let k = 0; k < 16; k++) { const x = -9.6 + k * 1.28, z = 1.85 + (k % 2) * 0.7; dance.push({ x, z, y: 0, yaw: facing(-x * 0.5, toDJ.z - z) }); }
    for (const s of [-1, 1]) for (let k = 0; k < 6; k++) dance.push({ x: s * (8.9 + (k % 3) * 0.9), z: -11.9 + Math.floor(k / 3) * 0.9, y: 0, yaw: facing(-s * 0.4, 1) + Math.PI });
    // (where people stand and talk: the south deck, the pool's sides, the garden, the shelf and the deep end's back half)
    const chat = [];
    for (const [x, z] of [[-3.2, 6.1], [3.2, 6.1], [0, 7.6], [-6.6, 8.8], [6.6, 8.4], [-8.8, 4.6], [9.6, 4.6], [-1.6, 9.6], [2.4, 10.6], [-4.4, 11.2], [5.2, 12.0], [-10.4, 8.2], [10.6, 11.6], [-16.0, 6.8], [-15.4, 3.6], [16.2, 2.6], [-12.4, -2.0], [12.4, -4.6], [-12.4, -8.6], [12.4, -9.8], [-20.6, 7.2], [-21.8, 13.6], [19.0, 12.6], [18.6, 4.8], [-18.4, -12.8], [17.0, -12.4]]) if (!lifeVoid(x, z)) chat.push({ x, z });
    for (const [x, z] of [[-6.2, 0.0], [-2.0, -0.2], [2.6, 0.1], [6.0, -0.1], [-7.4, -3.2], [-3.0, -2.6], [1.6, -3.4], [7.8, -2.8], [-4.4, -5.0], [3.6, -4.4]]) chat.push({ x, z, water: true });
    // (seats: the daybeds, the cabanas (not yours), the loungers, the garden's sofas round the fire)
    const seats = [], fire = [], DB = DAYBED_X - 0.42;
    for (const s of [-1, 1]) DAYBED_Z.forEach((z) => { for (const dz of [-0.5, 0.5]) seats.push({ x: s * DB, z: z + dz, y: 0, yaw: facing(-s, 0), kind: 'daybed' }); });
    for (const s of [-1, 1]) CABANA_Z.forEach((z, i) => { if (s < 0 && i === 2) return; for (const dz of [-0.7, 0.7]) seats.push({ x: s * (CABANA_X + 0.97), z: z + dz, y: 0.12, yaw: facing(-s, 0), kind: 'cabana' }); });
    for (const s of [-1, 1]) for (const ax of [6.2, 7.6, 9.0]) seats.push({ x: s * ax + 0.15, z: 3.55, y: -0.05, yaw: bz, kind: 'lounger' });
    const qs = [[-22.85, 9.1, 0], [-22.85, 10.0, 0], [-22.85, 10.9, 0], [-21.8, 12.62, Math.PI / 2], [-20.6, 12.62, Math.PI / 2]];
    for (const [x, z, yaw] of qs) (night ? fire : seats).push({ x, z, y: 0, yaw, kind: 'sofa' });
    const S2 = seats.filter((q) => !lifeVoid(q.x, q.z));
    // (the deep water to swim and float in, the edges to jump from - each with the far wall to race to)
    const swimP = []; for (let k = 0; k < 24; k++) { const x = -9.4 + (k % 6) * 3.76, z = -10.6 + Math.floor(k / 6) * 2.6; if (!nearPod(x, z)) swimP.push({ x, z }); }
    const edge = [];
    for (const z of [-9.4, -6.0, -2.8]) { edge.push({ x: x1 + 0.75, z, ix: x1 - 1.2, iz: z, far: { x: x0 + 1.0, z } }); edge.push({ x: x0 - 0.75, z, ix: x0 + 1.2, iz: z, far: { x: x1 - 1.0, z } }); }
    const patrol = [[0, 13.0], [-10.6, 9.6], [-12.4, -4], [-10.5, -12.6], [10.5, -12.6], [12.4, -4], [11.6, 5.2], [18.2, 10.6], [3.2, 9.0], [-17.0, 12.6]].map(([x, z]) => ({ x, z }));
    const sun = [[-3.6, 3.4], [3.8, 3.2], [-9.6, 3.0], [9.8, 3.4], [-12.2, -6.4], [12.2, -7.4], [-12.3, 1.8], [12.4, 0.9]].map(([x, z]) => ({ x, z }));
    void L;
    return {
      K, deck: DECK, pool: POOL, night, wet, heightAt: (x, z) => V.heightAt(x, z), door: { x: 0, z: 15.1 }, host: { x: 1.9, z: 13.3 }, bars, service: { x: -7.9, z: 11.6 },
      towel: { x: 6.7, z: 14.05, yaw: fz }, dance, chat, seats: S2, fire, swim: swimP, edge, patrol, sun, birthday: { x: CABANA_X - 2.0, z: CABANA_Z[1] },
      blockW: [[6.0, -6.2, 1.05], [-6.0, -6.2, 1.05], [-3.4, -9.4, 0.65], [4.6, -10.2, 0.65], [-9.2, 0, 0.8], [-7.4, 0, 0.8], [7.4, 0, 0.8], [9.2, 0, 0.8]],
      djName: 'DJ Tavi', say: (t) => ledWall.say(t, 7), splash: (x, z, k) => life.splash(x, z, k),
      phase: () => (E.moodI >= 0 ? V.moods[E.moodI]?.name : null) || 'Peak time',
    };
  })();
  const crowdPools = { kind: 'club', pool: true, women: 0.58, seed: 'tidewater:' + (night ? 'night' : 'day'), occ: 0.6, cam: { x: 0, z: 12 }, ...(brand ? { brand: { name: brand.name, color: brand.color, accent: '#ffffff' } } : {}) };
  const crowdMake = (o = {}) => new PoolCrowd({ ...o, night, swim: true, life: globalThis.__poolStill ? null : lifePlan });

  // ---- the LED wall's message line (PartyPlay puts a name or a table number up): a band of its own over the wall -----
  const msgCv = document.createElement('canvas'); msgCv.width = 1024; msgCv.height = 128;
  const msgT = K.t(new THREE.CanvasTexture(msgCv)); msgT.colorSpace = THREE.SRGBColorSpace;
  const msg = K.obj(new THREE.Mesh(new THREE.PlaneGeometry(10.4, 1.3), new THREE.MeshBasicMaterial({ map: msgT, transparent: true, depthWrite: false, toneMapped: false, fog: false })));
  msg.position.copy(K.P(0, S.h + 2.75, -17.93)); msg.rotation.y = K.ry; msg.renderOrder = 3; msg.visible = false;
  let msgUntil = -1;
  const ledWall = {
    mesh: led, tex: ledT,
    say(text, secs = 6) {
      const x = msgCv.getContext('2d'), w = msgCv.width, h = msgCv.height; x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(4,2,10,.82)'; x.fillRect(0, 0, w, h);
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = '#ff2fa0'; x.shadowBlur = 16; x.fillStyle = '#ffffff'; x.font = "700 78px 'Segoe UI', Arial, sans-serif";
      x.fillText(String(text || '').toUpperCase().slice(0, 28), w / 2, h / 2 + 3); msgT.needsUpdate = true; msg.visible = true; msgUntil = (E.t || 0) + secs;
    },
  };
  K.anim(() => { if (msg.visible && (E.t || 0) > msgUntil) msg.visible = false; });
  const SRX = (SR.x0 + SR.x1) / 2;
  // (the cabanas' tables: yours first, the host's - a star's or a sponsor's - next)
  const booths = CABANA_Z.flatMap((z, i) => [-1, 1].map((s) => ({ id: `${s < 0 ? 'w' : 'e'}${i + 1}`, x: s * (CABANA_X - 0.35), z, y: 0.12, face: facing(-s, 0), mine: s < 0 && i === 2, host: s > 0 && i === 1 }))).sort((a, b) => b.mine - a.mine || b.host - a.host);

  const bpm = night ? 124 : 122;
  const V = {
    light: night ? { hemi: ['#46557e', '#5a3c22', 0.62], dir: ['#ffd6a8', 0.42, [2, 7, 5]], exposure: 1.0, bg: '#07070f' } : { hemi: ['#cfe0f6', '#d6c4a2', 1.0], dir: ['#fff2dc', 2.9, [-4, 9, 5]], exposure: 0.92, bg: '#8fb8e6' },
    lift: night ? 0.1 : 0,
    club: true, beat: { bpm },
    moods: night
      ? [{ name: 'Warm-up', music: 'clubmusic', hemi: 1, glow: 1, energy: 0.5, occ: 0.45, bpm: 122 }, { name: 'Peak time', music: 'clubmusic', hemi: 0.86, glow: 1.25, tint: '#7a6cff', energy: 1, occ: 1, bpm: 126 },
        { name: 'Throwbacks', music: 'clubmusic', hemi: 0.95, glow: 1.1, tint: '#ff9a50', energy: 0.8, occ: 0.85, bpm: 120 }, { name: 'Last hour', music: 'clubmusic', hemi: 0.8, glow: 0.85, energy: 0.6, occ: 0.55, bpm: 124 }, { name: 'Quiet', music: null, hemi: 0.95, glow: 0.9, energy: 0, occ: 0.5, bpm: 0 }]
      : [{ name: 'Warm-up', music: 'clubmusic', hemi: 1, glow: 1, energy: 0.5, occ: 0.5, bpm: 118 }, { name: 'Peak time', music: 'clubmusic', hemi: 1, glow: 1.1, energy: 1, occ: 1, bpm: 124 },
        { name: 'Throwbacks', music: 'clubmusic', hemi: 1, glow: 1, energy: 0.8, occ: 0.85, bpm: 118 }, { name: 'Last hour', music: 'clubmusic', hemi: 0.96, glow: 1, energy: 0.6, occ: 0.6, bpm: 122 }, { name: 'Quiet', music: null, hemi: 1, glow: 1, energy: 0, occ: 0.6, bpm: 0 }],
    start: { x: 0, z: 13.4, yaw: -Math.PI / 2 },
    date, group, seats, staff,
    paps: hosted ? [V3(60, 18, 40), V3(-70, 26, -20)] : [V3(64, 6, 70), V3(-80, 12, 30)], bed: 'city',
    where: 'at the edge of the pool',
    moment: night ? ['The pool lit from below, the bass coming up through the water, and over the palms the towers of the Strip glittering all the way down.', 'Warm air, the water glowing blue, and the whole of Las Vegas lit up beyond the wall.']
      : ['The desert sun on the water, the bass through the deck, and the resort’s bronze tower rising behind the DJ.', 'Heat shimmering off the deck, the mountains pale on the horizon, and the whole pool dancing.'],
    photoBack: night ? 'the pool and the lights' : 'the pool',
    zones, spots, crowdSpots, crowdPools, crowdMake,
    exits: { front: { x: 0, z: 14.7, yaw: Math.PI / 2 }, side: { x: 20.0, z: 14.7, yaw: Math.PI / 2 }, street: null },
    wall: { x: SRX, y: 1.35, z: SR.z, w: SR.x1 - SR.x0, h: 2.5, face: facing(0, -1), yaw: -Math.PI / 2, stand: { x: SRX, z: 14.6, yaw: -Math.PI / 2, face: facing(0, -1) }, cams: [V3(SRX - 1.4, 1.6, 12.25), V3(SRX, 1.6, 12.0), V3(SRX + 1.4, 1.6, 12.25)] },
    bartop: { x: -12.9, y: 1.09, z: 12.55 }, terrace: null, zoneLight: null,
    heightAt: (x, z) => (x > STAGE.x0 && x < STAGE.x1 && z > STAGE.z0 && z < STAGE.z1 ? STAGE.h : z > BUNG.z0 && z < BUNG.z1 && Math.abs(x) > BUNG.x0 && Math.abs(x) < BUNG.x1 ? BUNG.h : x > x0 && x < x1 && z > z0 && z < z1 ? (z > sz ? Lg : F) : 0),
    booths, service: { x: -12.9, z: 11.4 }, props: {},
    led: { wall: ledWall, floor: null, say: (t, s) => ledWall.say(t, s) },
    people: {
      dj: { name: 'DJ Tavi', look: { kit: 'casual', color: '#f2f0ea', accent: '#111114', legs: '#1b2440', shoe: 'trainer', shoes: '#ecebe6', pose: 'talk', seed: 'tidewater-resident-dj', acc: ['watch'] } },
      security: { name: 'Security', look: { kit: 'polo', color: '#0c0c0e', accent: '#0c0c0e', legs: '#0c0c0e', pose: 'cross', seed: 'tidewater-security', jitter: 0.02 } },
    },
    water: { mesh: water, level: POOL.wl, rects: rects.map((r) => r.slice()), caustics: cau, wet, fx: wstate }, screens: [ledWall],
  };

  // ---- you in the water, the guests' lines over their heads, E to talk to one (ui/PoolPlay.js; Hangout's pool hooks)
  const life = V.life = poolPlay(K, E, { pool: POOL, night, heightAt: V.heightAt, swimKit: (k) => { if (!k || ![...swimKits('f'), ...swimKits('m')].includes(k)) return null; const I = swimInfo(k); return I.shirt || I.cover ? 'shirt' : 'swim'; } });

  // ---- an ordinary evening (no party engine to run a crowd): the crowd built and run here, as Hangout does a party's -
  if (!E.isParty && Array.isArray(E.queue)) {
    try {
      const C = crowdMake({ bpm, patch: hosted ? E.lib?.roomPatch || null : null, keepKey: 'hgKeep', lift: night ? 0.1 : 0.05 }); K.obj(C.group);
      for (const st of C.build(crowdSpots, crowdPools)) E.queue.push(st);
      const cp = V3(0, 1.6, 0), fwd = { x: 0, z: -1 };
      let beat = 0; const MA = { i: -1, req: -9, ix: null };
      { const ix = (n) => V.moods.findIndex((m) => m.name === n); MA.ix = { warm: ix('Warm-up'), peak: ix('Peak time'), last: ix('Last hour') }; if (MA.ix.peak < 0) MA.ix = null; }
      K.anim((t, dt) => {
        if (!C.ready || !E.cam) return;
        cp.copy(E.cam.position); if (hosted && E._toL) E._toL(cp);
        fwd.x = Math.cos(E.yaw || 0); fwd.z = Math.sin(E.yaw || 0);
        // (an ordinary evening - no party's DJ to move the night on - the clock does, as PartyPlay's _autoMood: the warm-up
        // for the first 35 minutes, then the peak, the last hour once it is late; a set you picked holds 20 minutes)
        if (!E.party && !E.quiet && MA.ix && typeof E._moodSet === 'function' && E.moodI >= 0) {
          const hh = +E.clock || t0, ai = E.x?.late ? MA.ix.last : hh < t0 + 0.6 ? MA.ix.warm : MA.ix.peak;
          if (MA.i >= 0 && E.moodI !== MA.i) { MA.req = hh; MA.i = E.moodI; } else if (MA.i < 0) MA.i = E.moodI;
          if (ai >= 0 && hh - MA.req > 0.35 && E.moodI !== ai) { try { E._moodSet(ai); } catch (_) { /* */ } MA.i = E.moodI; }
        }
        const M = E.moodI >= 0 ? V.moods[E.moodI] : null, h = +E.clock || t0, occ = clamp(0.45 + (0.55 * (h - t0)) / 1.5, 0.3, 1) * (M?.music === null ? 0.5 : 1)
          * (!E.party && M && Number.isFinite(M.occ) ? 0.4 + 0.6 * M.occ : 1);   // (an ordinary evening: the set's own fill too - the peak full, the last hour thinning)
        // (as at the clubs' parties: the music's tempo and how hard the deck dances by the set playing - a warm-up's sway,
        // the peak's full swing, the quiet hour's stillness - eased, never snapped)
        const d = Math.min(0.1, Math.max(0, dt || 0)), en = M ? (Number.isFinite(M.energy) ? M.energy : 1) : 1;
        if (!beat) C.energy = en;
        beat += d * ((M ? M.bpm : bpm) || 0) / 60; C.energy += (en - C.energy) * Math.min(1, d * 1.5);
        C.update(dt, cp, beat, occ, fwd);
        if (!E.talk && !E.game && !E.moment && !E.seat && E.pos) C.push(E.pos.x, E.pos.z, 0.42);
      });
      E.crowd = E.crowd || C;
    } catch (e) { console.warn('PartyPool: the crowd could not be built', e); }
  }
  return V;
}
/** the bungalow's two sofas under its pergola, facing the pool */
function sofaRow(K, M, s, gx0, gx1, B) {
  const zc = B.z0 + 0.75, SM = { frame: M.sofaF, cushion: M.cushion, foot: M.steel };
  raised(K, B.h, () => { sofa(K, SM, (gx0 + gx1) / 2 - 1.8, zc, 3.0, facing(0, 1)); sofa(K, SM, (gx0 + gx1) / 2 + 1.8, zc, 3.0, facing(0, 1)); });
  K.box(M.teak2, (gx0 + gx1) / 2, B.h, zc + 1.2, 2.2, 0.36, 0.7); iceBucket(K, M, (gx0 + gx1) / 2 - 0.3, B.h + 0.36, zc + 1.2);
}
/** run fn with everything K adds lifted y (furniture on a raised deck) */
function raised(K, y, fn) { if (!y) return fn(); const add0 = K.add; K.add = (m, g, x, yy, z, ...r) => add0.call(K, m, g, x, (yy || 0) + y, z, ...r); try { return fn(); } finally { K.add = add0; } }
/** bottles along a shelf (the bar's back) */
function bottles(K, x0, x1, y, z, R, n) {
  const cols = ['#d8862a', '#9fbf4a', '#c23a3a', '#e8d9a0', '#5a8fa8', '#f0c040', '#13331f', '#e6e6e6'];
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + 0.5 + (R() - 0.5) * 0.3) * ((x1 - x0) / n), m = K.m(cols[(R() * cols.length) | 0], 0.18, 0.05), h = 0.18 + R() * 0.12, r = 0.03 + R() * 0.016;
    K.cyl(m, x, y, z, r, r, h, 10); K.cyl(m, x, y + h, z, r * 0.4, r * 0.85, 0.05, 8); K.cyl(m, x, y + h + 0.05, z, r * 0.35, r * 0.35, 0.05, 6);
  }
}
/**
 * Unhosted: the city painted round the club - the sky (the desert's by day, the lit night's), the mountains by day, the
 * street 16 m below the podium's roof, the resort's own pool wings and its curved bronze tower over the stage, the
 * Strip's towers all round, and far off to the south-west the Sphere
 */
function worldOf(K, E, night, R) {
  const sky = K.obj(new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.MeshBasicMaterial({ map: K.t(skyTex(night)), side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false })));
  sky.renderOrder = -1;
  if (!night) {
    const sun = K.obj(new THREE.Sprite(new THREE.SpriteMaterial({ map: K.soft, color: '#fff6e0', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })));
    sun.position.set(-4, 9, 5).normalize().multiplyScalar(1200); sun.scale.setScalar(260);
    const rg = new THREE.CylinderGeometry(1150, 1150, 120, 48, 1, true), rm = new THREE.MeshBasicMaterial({ map: K.t(ridgeTex(R)), transparent: true, side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false });
    const ridge = K.obj(new THREE.Mesh(rg, rm)); ridge.position.y = 30; ridge.renderOrder = -1;
  }
  K.plane(K.e('#ffffff', { map: K.t(groundTex(R, night)), fixed: true }), 0, -16, 0, 3000, 3000, 0, true, [12, 12]);
  // (the podium under the deck, down to the street, and the resort's two pool wings: south, where you come in, and north behind the stage)
  const fu = (w, hh) => [w / FAC_W, hh / FAC_H];
  const wingM = night ? K.e('#a2a2a2', { map: K.t(facadeTex(rng(320), true, 2)), fixed: true }) : K.mt(K.t(facadeTex(rng(300), false, 2)), 0.82);
  K.box(K.m('#d9d1c4', 0.85), 0, -16, (DECK.z0 + DECK.z1) / 2, 48.9, 14.7, DECK.z1 - DECK.z0 + 0.6);
  K.box(wingM, 0, -16, 21.0, 48.6, 30, 10.2, 0, fu(48.6, 30)); K.box(K.m('#e2dbcf', 0.8), 0, 14, 21.0, 48.8, 0.5, 10.4);
  // (the north wing low - two floors over the deck - so the tower rises straight up behind the stage, as Encore's does over its beach club)
  K.box(wingM, 0, -16, -24.2, 48.6, 23.6, 11.4, 0, fu(48.6, 23.6)); K.box(K.m('#e2dbcf', 0.8), 0, 7.6, -24.2, 48.8, 0.5, 11.6);
  // (the tower: a curved slab of bronze glass, its crown lit at night)
  const tm = night ? K.e('#a8957e', { map: K.t(facadeTex(rng(330), true, 1)), fixed: true }) : K.mt(K.t(facadeTex(rng(331), false, 1)), 0.25, 0.4);
  const tg = new THREE.CylinderGeometry(70, 70, 196, 28, 1, true, -0.36, 0.72); tg.translate(0, 98 - 16, -96); { const uv = tg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * ((70 * 0.72) / FAC_W), uv.getY(i) * (196 / FAC_H)); }
  K.add(tm, tg); const capG = new THREE.CylinderGeometry(70, 70, 1.2, 28, 1, false, -0.36, 0.72); capG.translate(0, 180.6, -96); K.add(K.m('#3a2c1e', 0.6), capG);
  for (const a of [-0.36, 0.36]) { const ex = Math.sin(a) * 70, ez = -96 + Math.cos(a) * 70; K.at(ex, ez, -a + Math.PI / 2, () => K.box(tm, 0, -16, -11, 0.6, 196, 22)); }
  if (night) { const crown = new THREE.CylinderGeometry(70.3, 70.3, 2.2, 28, 1, true, -0.36, 0.72); crown.translate(0, 176, -96); K.add(K.e('#ffcf8a', { fixed: true }), crown); const nameT = K.t(signTex('MERIDIAN GRAND', '', '#ffe2b0', 1024, 140)); K.plane(K.e('#ffffff', { map: nameT, blending: THREE.AdditiveBlending, fixed: true }), 0, 168, -25.5, 34, 4.6, 0); }
  // (the Strip's towers: east, west and south, near ones low, a few tall; none over the stage)
  const fm = [0, 1, 2].map((i) => (night ? K.e('#8e8e8e', { map: K.t(facadeTex(rng(340 + i), true, i === 1 ? 2 : 0)), fixed: true }) : K.mt(K.t(facadeTex(rng(350 + i), false, i)), 0.3, i === 2 ? 0 : 0.25)));
  const roof = K.m('#22232a', 0.9), red = K.e('#ff2a1a', { fixed: true });
  for (let i = 0; i < 46; i++) {
    const a = R() * TAU, d = 90 + R() * 620, x = Math.cos(a) * d, z = Math.sin(a) * d;
    if (z < -40 && Math.abs(x) < 120) continue;
    const w = 24 + R() * 40, dd = 24 + R() * 40, top = 10 + R() * (d > 300 ? 180 : 90), H = top + 16;
    const g = new THREE.BoxGeometry(w, H, dd); { const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * Math.max(1, Math.round(w / FAC_W)), uv.getY(k) * Math.max(1, Math.round(H / FAC_H))); }
    K.add(fm[i % 3], g, x, -16 + H / 2, z); K.box(roof, x, top, z, w + 0.4, 0.6, dd + 0.4); if (night && top > 60) K.sph(red, x, top + 2, z, 0.9, 6, 4);
  }
  // (the Sphere, far off: its show at night, a dim grey dome by day)
  const sphM = new THREE.MeshBasicMaterial({ color: night ? '#3a7bff' : '#6f747c', fog: false, toneMapped: false });
  const sph = K.obj(new THREE.Mesh(new THREE.SphereGeometry(78, 40, 24), sphM)); sph.position.set(-330, 40, 520);
  if (night) {
    const halo = K.obj(new THREE.Sprite(new THREE.SpriteMaterial({ map: K.soft, color: '#3a7bff', transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })));
    halo.position.copy(sph.position); halo.scale.setScalar(320);
    const SC = ['#2f6bff', '#b23cff', '#ff4f7a', '#ffb23a', '#2fe0c8'].map((c) => new THREE.Color(c));
    K.anim((t) => { const u = (t / 9) % SC.length, i = Math.floor(u), f = clamp((u - i - 0.55) / 0.45, 0, 1); sphM.color.copy(SC[i]).lerp(SC[(i + 1) % SC.length], f); halo.material.color.copy(sphM.color); });
  }
  E.scene.fog = new THREE.Fog(night ? '#120f22' : '#c6d6e4', 380, 2400);
}

// =====================================================================================================================
// the crowd in swimwear (world/PartyCrowd.js, its templates from world/Crowd.js): in the water and on the dance decks
// all in their swimwear - bikinis, bandeau sets, one-pieces and monokinis, swim shorts - and at the bars, on the daybeds
// and in the cabanas the same by day, a night swim's mix of swimwear and clubwear after dark. People's swimwear kits are
// read when it has them (People.SWIM_KITS / SWIM_KITS_M, People.SWIM_INFO); until then the night's club kits stand in.
// =====================================================================================================================
const SWIM_COL = ['#0d0d10', '#0d0d10', '#f4f1ea', '#b5121b', '#ff5a5f', '#e0218a', '#ff9e1b', '#ffd23a', '#21c4c8', '#1f3fae', '#0f6b4f', '#c9a46c', '#d4af37', '#7d5ba6', '#ff5ea8', '#9fd3c7', '#e85d2a', '#c0c0c8'];
const COVER_COL = ['#f4f1ea', '#f4f1ea', '#e9e2d0', '#d8c7a8', '#0d0d10', '#c9d8e8', '#f2c6c2', '#9fd3c7', '#e8dcc8'];
// (a cover-up's hem on a far body: world/PartyCrowd.js's heights)
const FAR_HEM = { micro: 0.8, mini: 0.74, thigh: 0.69, short: 0.64, knee: 0.5, midi: 0.34, floor: 0.08 };
const SHORTS_COL = ['#1b2440', '#0d0d10', '#f4f1ea', '#2a4d8f', '#b5121b', '#0f3b2e', '#e85d2a', '#21c4c8', '#c9bba0', '#5a5f66', '#ff9e1b'];
const HAIR_F = ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#7a5434', '#a77d4c', '#c9a46c', '#e3cf9e', '#8a3b1e', '#121212', '#d8c7a8'];
const HAIR_M = ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#121212', '#8f8f8f', '#7a5434'];
const HS_F = ['long', 'waves', 'highpony', 'ponytail', 'messybun', 'topknot', 'long', 'waves', 'bun', 'curlyLong', 'bob', 'curlybun', 'blowout'];
const HS_M = ['short', 'short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'locs'], FH_M = [null, null, null, 'stubble', 'stubble', 'beard'];
/** People's swimwear kits for a figure ('f' | 'm') -> [kit] (empty until People has them) */
export function swimKits(fig) {
  const L = fig === 'f' ? People.SWIM_KITS : People.SWIM_KITS_M, all = People.OUTFIT_KITS;
  return Array.isArray(L) ? L.filter((k) => !Array.isArray(all) || all.includes(k)) : [];
}
/** how a swimwear kit covers, for the colours and the far bodies: { mid: 'skin' (a bare midriff), shirt (a man's shirt over), cover (a cover-up's skirt hem) } */
function swimInfo(k) {
  const I = People.SWIM_INFO?.[k]; if (I) return I;
  const s = String(k).toLowerCase();
  if (/mono|cut/.test(s)) return { mid: 'skin' };
  if (/one|maillot|swimsuit|plunge/.test(s)) return {};
  if (/shirt/.test(s)) return { shirt: 1 };
  return { mid: 'skin' };
}
/** the pool's crowd: PartyCrowd's, its templates in swimwear when People has it (else the club's, unchanged). Given
 * o.life (ui/PartyPool.js's plan for world/PoolLife.js), every guest has a life: a wardrobe of their own kit in every pose
 * they need (walking, a drink, talking, dancing, sitting back), walked in at the door, up to 168 of them */
const LIFE_MAX = 168;
export class PoolCrowd extends PartyCrowd {
  constructor(o = {}) {
    super(o); this.swim = o.swim !== false; this.dayOut = o.night === false;
    this.lifePlan = o.life || null; this.life = null; if (this.lifePlan) { this.maxP = LIFE_MAX; this.walkIn = true; }
    this._Q2 = new THREE.Quaternion(); this._Z = new THREE.Vector3(0, 0, 1);
  }
  _plan(pools, R) {
    const SF = this.swim ? swimKits('f') : [], SM = this.swim ? swimKits('m') : [];
    if (!SF.length) return super._plan(pools, R);
    if (this.lifePlan) return this._planLife(pools, R, SF, SM);
    const T = [], day = this.dayOut, CK = People.CLUB_KITS || [], CM = People.CLUB_KITS_M || [];
    // (in the water - and dancing on the decks and the podiums - only what is swum in: the cover-ups, the open shirts and
    // the kaftans at the bars, on the daybeds and in the cabanas)
    const inW = (k) => { const I = swimInfo(k); return !I.cover && !I.shirt; }, WF = SF.some(inW) ? SF.filter(inW) : SF, WM = SM.some(inW) ? SM.filter(inW) : SM;
    const add = (role, fig, kit, pose, extra = {}) => { const t = { role, fig, kit, pose, hs: extra.hs, alt: null, w: extra.w ?? 1, spec: null, swim: SF.includes(kit) || SM.includes(kit), ...extra }; T.push(t); return t; };
    const left = SF.slice(), take = (from = SF) => { if (!left.some((k) => from.includes(k))) left.push(...from); const c = left.filter((k) => from.includes(k)), k = c[Math.floor(R() * c.length) % c.length]; left.splice(left.indexOf(k), 1); return k; };
    const hsF = () => pickR(R, HS_F), hsM = () => pickR(R, HS_M), fhM = () => pickR(R, FH_M), earF = () => ({ earrings: pickR(R, ['hoop', 'stud', 'drop']), chain: R() < 0.35 });
    const holdD = () => (R() < 0.55 ? pickR(R, ['glass', 'glass', 'flute']) : null);
    // (in the water and on the dance decks: always swimwear - a pair of poses for one of them, arms down and up)
    const kA = take(WF), a1 = add('dancer', 'f', kA, 'dance1', { hs: hsF(), hold: holdD(), w: 1.3 }), a2 = add('dancer', 'f', kA, 'dance2', { hs: a1.hs, hold: a1.hold, w: 0, pair: true }); a1.alt = a2;
    add('dancer', 'f', take(WF), 'dance3', { hs: hsF(), hold: holdD() }); add('dancer', 'f', take(WF), 'dance1', { hs: hsF(), hold: holdD() }); add('dancer', 'f', take(WF), 'drink', { hs: hsF(), hold: pickR(R, ['glass', 'flute']), w: 0.8 });
    // (at the bars and in the shade: swimwear by day; after dark half of them in their clubwear)
    const deckF = () => (!day && CK.length && R() < 0.5 ? pickR(R, CK) : take());
    add('bar', 'f', deckF(), 'drink', { hs: hsF(), hold: pickR(R, ['glass', 'coupe']) }); add('bar', 'f', deckF(), 'toast', { hs: hsF(), hold: 'flute' });
    add('booth', 'f', take(), 'sitBooth', { hs: hsF(), hold: pickR(R, ['flute', 'glass']), seat: true }); if (!day && CK.length) add('booth', 'f', pickR(R, CK), 'sitBooth', { hs: hsF(), hold: 'flute', seat: true });
    const mk = SM.slice(), takeM = (from = SM) => { if (!from.length) return pickR(R, CM.length ? CM : ['casual']); if (!mk.some((k) => from.includes(k))) mk.push(...from); const c = mk.filter((k) => from.includes(k)), k = c[Math.floor(R() * c.length) % c.length]; mk.splice(mk.indexOf(k), 1); return k; };
    const g1 = add('dancer', 'm', takeM(WM), 'dance1', { hs: hsM(), fh: fhM(), hold: R() < 0.5 ? 'glass' : null, w: 1.2 }), g2 = add('dancer', 'm', g1.kit, 'dance2', { hs: g1.hs, fh: g1.fh, hold: g1.hold, w: 0, pair: true }); g1.alt = g2;
    add('dancer', 'm', takeM(WM), 'dance3', { hs: hsM(), fh: fhM() });
    const deckM = () => (!day && CM.length && R() < 0.5 ? pickR(R, CM) : takeM());
    add('bar', 'm', deckM(), 'drink', { hs: hsM(), fh: fhM(), hold: 'glass' }); add('bar', 'm', deckM(), 'lean', { hs: hsM(), fh: fhM(), hold: 'glass', lean: true });
    // (sitting back on a daybed or a cabana's sofa, a drink in the hand - his as well as hers, as at the clubs)
    add('booth', 'm', deckM(), 'sitBooth', { hs: hsM(), fh: fhM(), hold: 'glass', seat: true });
    // (the house: a server in the club's black one-piece, a dancer on a podium, security and the photographer in black polos)
    const ONE = WF.filter((k) => !swimInfo(k).mid);
    add('server', 'f', pickR(R, ONE.length ? ONE : WF), 'drink', { hs: pickR(R, ['highpony', 'ponytail', 'long']), hold: 'bottle', staff: 1 });
    // (the podium dancers: a pair of poses, as the clubs' go-go dancers - their arms go up and come down with the music)
    const pf = add('performer', 'f', take(WF), 'dance1', { hs: pickR(R, ['long', 'waves', 'highpony']), staff: 1 });
    pf.alt = add('performer', 'f', pf.kit, 'dance2', { hs: pf.hs, staff: 1, w: 0, pair: true });
    add('security', 'm', 'polo', 'cross', { hs: pickR(R, ['buzz', 'short']), fh: pickR(R, [null, 'beard', 'stubble']), staff: 1 });
    add('photographer', 'm', 'polo', 'photo', { hs: hsM(), fh: fhM(), prop: 'photo', staff: 1 });
    for (const t of T) if (t.fig === 'f') t.jewel = earF();
    for (const t of T) {
      const fem = t.fig === 'f', seed = Math.floor(R() * 1e9);
      t.spec = { club: true, figure: fem ? 'f' : undefined, build: fem ? (R() < 0.6 ? 'slim' : 'average') : R() < 0.5 ? 'average' : 'athletic', kit: t.kit, pose: t.pose, hs: t.hs, fh: fem ? null : t.fh || null, cap: !!t.cap, hold: t.hold || undefined, prop: t.prop || undefined, acc: fem ? ['earrings'] : undefined, jewel: t.jewel, seed, q: 0.32, detail: 0.2 };
    }
    // (a pair's poses the same person: one seed, one build, the same earrings and glass)
    for (const t of T) if (t.alt) Object.assign(t.alt.spec, { seed: t.spec.seed, build: t.spec.build, jewel: t.spec.jewel, acc: t.spec.acc, fh: t.spec.fh, hold: t.spec.hold });
    return T;
  }
  /** the living crowd's templates: wardrobes - one kit (and hair, and build) in every pose its wearer needs; the
   * house's staff a few poses each. Each wardrobe { id, fig, water (may go in the water), w (its share), role, map (pose ->
   * template index), idx } on this.W */
  _planLife(pools, R, SF, SM) {
    const T = [], W = this.W = [], day = this.dayOut, CK = People.CLUB_KITS || [], CM = People.CLUB_KITS_M || [];
    const inW = (k) => { const I = swimInfo(k); return !I.cover && !I.shirt; };
    const WF = SF.filter(inW), CF = SF.filter((k) => swimInfo(k).cover), WM = SM.filter(inW), SHM = SM.filter((k) => swimInfo(k).shirt);
    const ONE = WF.filter((k) => !swimInfo(k).mid), TWO = WF.filter((k) => swimInfo(k).mid);
    const pk = (L, alt) => (L.length ? pickR(R, L) : pickR(R, alt.length ? alt : SF));
    const held = (pose, glass) => (pose === 'drink' || pose === 'toast' || pose === 'sitBooth' || pose === 'lean' ? glass : null);
    // (a wardrobe: one kit, one hair, one build in each pose - the dancing pair's two poses swapped on the beat)
    const wd = (id, fig, kit, poses, o = {}) => {
      const fem = fig === 'f', hs = o.hs || (fem ? pickR(R, HS_F) : pickR(R, HS_M)), fh = fem ? null : o.fh !== undefined ? o.fh : pickR(R, FH_M), glass = o.glass || (fem ? pickR(R, ['glass', 'flute', 'coupe']) : 'glass');
      const seed = Math.floor(R() * 1e9), build = fem ? (R() < 0.6 ? 'slim' : 'average') : R() < 0.5 ? 'average' : 'athletic', jewel = fem ? { earrings: pickR(R, ['hoop', 'stud', 'drop']), chain: R() < 0.35 } : undefined;
      const map = {}, idx = [];
      for (const pose of poses) {
        const role = o.role || (pose === 'dance1' ? 'dancer' : pose === 'drink' ? 'bar' : pose === 'sitBooth' ? 'booth' : 'x');
        const hold = o.hold || held(pose, glass), t = { role, fig, kit, pose, hs, alt: null, w: o.role ? (pose === poses[0] ? 1 : 0) : role === 'x' ? 0 : o.w ?? 1, spec: null, swim: SF.includes(kit) || SM.includes(kit), seat: pose === 'sitBooth', lean: pose === 'lean', rare: true, wd: id, staff: o.role ? 1 : 0 };
        t.spec = { club: true, figure: fem ? 'f' : undefined, build, kit, pose, hs, fh, cap: false, hold: hold || undefined, prop: o.prop || undefined, acc: fem ? ['earrings'] : undefined, jewel, seed, q: 0.32, detail: 0.2, shoe: o.water ? 'bare' : undefined };   // (what goes in the water goes barefoot: no slides or heels on a swimmer)
        map[pose] = T.length; idx.push(T.length); T.push(t);
      }
      if (map.dance1 != null && map.dance2 != null) { T[map.dance1].alt = T[map.dance2]; T[map.dance2].pair = true; }
      W.push({ id, fig, kit, water: !!o.water, w: o.share ?? 1, role: o.role || null, map, idx });
    };
    const P7 = ['walk1', 'walk3', 'drink', 'talk', 'dance1', 'dance2', 'sitBooth'], P6 = ['walk1', 'walk3', 'drink', 'talk', 'dance1', 'sitBooth'], P5 = ['walk1', 'walk3', 'drink', 'dance1', 'sitBooth'];
    // (hers: a bikini and a one-piece that go in the water, a third by day; a cover-up - or, after dark, her clubwear - that stays on the deck)
    wd('bikini', 'f', pk(TWO, WF), P7, { water: true, share: 1.3, hs: pickR(R, ['long', 'waves', 'curlyLong']) });
    wd('onepiece', 'f', pk(ONE, WF), P7, { water: true, share: 1.1, hs: pickR(R, ['highpony', 'ponytail', 'messybun']) });
    if (day) wd('swim3', 'f', pk(WF, SF), P6, { water: true, hs: pickR(R, ['topknot', 'bun', 'bob', 'blowout']) });
    else wd('club', 'f', pk(CK, SF), P6, { water: false, share: 0.8, hs: pickR(R, ['blowout', 'long', 'waves']) });
    wd('cover', 'f', pk(CF, SF), P6, { water: false, share: day ? 0.7 : 0.6, hs: pickR(R, ['long', 'bun', 'waves']) });
    // (his: swim shorts that go in, a second pair; an open shirt - or his clubwear after dark - that stays dry)
    wd('trunks', 'm', pk(WM, SM), P7, { water: true, share: 1.3 });
    if (day) wd('shorts2', 'm', pk(WM.length > 1 ? WM : SM, SM), P5, { water: true });
    else wd('clubm', 'm', CM.length ? pickR(R, CM) : pk(SHM, SM), P5, { water: false, share: 0.8 });
    wd('shirt', 'm', pk(SHM, SM), ['walk1', 'walk3', 'drink', 'talk', 'sitBooth'], { water: false, share: 0.8 });
    // (the house: a server in the club's black one-piece with a bottle, a podium dancer, security and the photographer in black polos)
    wd('server', 'f', pk(ONE, WF), ['drink', 'walk1', 'walk3'], { role: 'server', hold: 'bottle', hs: pickR(R, ['highpony', 'ponytail']) });
    wd('performer', 'f', pk(WF, SF), ['dance1', 'dance2'], { role: 'performer', hs: pickR(R, ['long', 'waves', 'highpony']) });
    wd('security', 'm', 'polo', ['cross', 'walk1', 'walk3'], { role: 'security', hs: pickR(R, ['buzz', 'short']), fh: pickR(R, [null, 'beard', 'stubble']) });
    wd('photographer', 'm', 'polo', ['photo', 'walk1', 'walk3'], { role: 'photographer', prop: 'photo' });
    return T;
  }
  /** a guest's own wardrobe (PartyCrowd.build's hook): which of this.W they wear - only one that is swum in for a spot in
   * the water - their pose in it, their colours for it; p.W (pose -> template), p.can (every template they may wear) */
  _wardrobe(p, t, s, R) {
    const WS = this.W; if (!WS) return;
    let w = null;
    if (p.staff) w = WS.find((x) => x.role === p.role) || null;
    else {
      const wet = (+s.y || 0) < -0.05, c = WS.filter((x) => !x.role && x.fig === p.fig && (!wet || x.water));
      let tot = 0; for (const x of c) tot += x.w; let u = R() * tot; for (const x of c) { u -= x.w; if (u <= 0) { w = x; break; } } w = w || c[0] || null;
    }
    if (!w) return;
    const M = w.map, pose = s.seat ? 'sitBooth' : t.pose, at = M[pose] ?? M[pose === 'lean' || pose === 'toast' ? 'drink' : pose === 'dance3' ? 'dance1' : 'drink'] ?? w.idx[0];
    p.W = M; p.wk = w.id; p.can = w.idx; p.water = w.water; p.t = at; p.alt = at === M.dance1 && M.dance2 != null ? M.dance2 : -1; p.swap = p.alt >= 0 && R() < 0.55;
    this._colours(p, this.tpl[at], this.pools || {}, R);
  }
  /** the meshes made: every one drawn whatever its bounds (people walk between re-packs), then the lives begun */
  _make() {
    super._make(); if (this.gone) return;
    for (const r of this.recs) r.mesh.frustumCulled = false;
    if (this.lifePlan && this.W && !this.life) { try { this.life = new PoolBrain(this, this.lifePlan); this.life.init(); } catch (e) { console.warn('PoolCrowd: no life for the crowd', e); this.life = null; } }
  }
  update(dt, cam, beat, occupancy = 1, fwd = null) {
    const L = this.life;
    if (L && this.ready && !this.gone) { try { L.energy = this.energy; L.pre(Math.min(0.1, Math.max(0, dt || 0))); } catch (e) { if (!this._lifeErr) console.warn('PoolCrowd: a life frame failed', e); this._lifeErr = (this._lifeErr || 0) + 1; } }
    super.update(dt, cam, beat, occupancy, fwd);
  }
  /** a swimmer laid flat at the surface (L.roll -pi/2, face down) or floating (+pi/2, face up): turned about their middle */
  _write(p, all = false) {
    const ro = p.L?.roll || 0; if (!ro || !p.mesh) return super._write(p, all);
    if (all) super._write(p, true);
    const { _M: M, _Q: Q, _P: P, _S: S, _Y: Y, _Q2: Q2, _Z: Z } = this, c = Math.cos(p.yaw), sn = Math.sin(p.yaw), k = ro < 0 ? -0.85 : 0.85;
    Q.setFromAxisAngle(Y, p.yaw).multiply(Q2.setFromAxisAngle(Z, ro));
    M.compose(P.set(p.x + c * k * p.scale, p.y, p.z - sn * k * p.scale), Q, S.setScalar(p.scale)); p.mesh.mesh.setMatrixAt(p.slot, M); p.mesh.moved = true;
  }
  push(x, z, r = 0.45) { const h = super.push(x, z, r); if (h > 0 && this.life) { try { this.life.bump(x, z, r); } catch (_) { /* */ } } return h; }
  stats() { const s = super.stats(); if (this.life) { s.acts = this.life.counts(); s.lifeMs = this.life.ms; } return s; }
  dispose() { this.life = null; super.dispose(); }
  _colours(p, t, pools, R) {
    if (!t.swim) return super._colours(p, t, pools, R);
    const c = new THREE.Color(), set = (k, v) => { c.set(v); p.cols[k * 3] = c.r; p.cols[k * 3 + 1] = c.g; p.cols[k * 3 + 2] = c.b; };
    const fem = t.fig === 'f', skin = pickR(R, SKINS), I = swimInfo(t.kit), role = p.role;
    const top = role === 'server' ? '#0b0b0e' : pickR(R, SWIM_COL), acc = role === 'server' ? '#0b0b0e' : R() < 0.7 ? top : pickR(R, SWIM_COL);
    // (a cover-up or an open shirt its own colour - white, cream, sand, black, a pastel - the swimwear beneath in the accent)
    if (fem) { set(0, skin); set(1, I.cover || I.shirt ? pickR(R, COVER_COL) : top); set(2, skin); set(3, pickR(R, HAIR_F)); set(4, acc); set(5, top); }
    else { const sh = pickR(R, SHORTS_COL); set(0, skin); set(1, I.shirt ? pickR(R, ['#f4f1ea', '#e9e2d0', '#9fd3c7', '#2a4d8f', '#d9a6b0']) : skin); set(2, sh); set(3, pickR(R, HAIR_M)); set(4, sh); set(5, sh); }
  }
  _farSpec(t, ht) {
    if (!t.swim) return super._farSpec(t, ht);
    const I = swimInfo(t.kit), fem = t.fig === 'f';
    return { club: true, far: true, figure: fem ? 'f' : undefined, kit: 'club', pose: t.pose, cap: false, skirt: I.cover && t.pose !== 'sitBooth' ? FAR_HEM[I.cover] || 0 : 0, arms: I.shirt ? 'short' : 'skin', mid: fem && I.mid ? 'skin' : undefined, hair: fem ? (['bob', 'pixie', 'topknot', 'bun', 'highpony', 'curlybun', 'messybun', 'ponytail'].includes(t.hs) ? 'short' : 'long') : undefined, ht };
  }
}

// =====================================================================================================================
// the data the party engine merges (ui/PartyVenues.js) - see the header
// =====================================================================================================================
export const POOL_PLACES = {
  poolclub: { name: 'Tidewater Beach Club', kind: 'Night swim · Meridian Grand', city: 'Las Vegas', where: 'lasvegas', privacy: 0.3, hc: '#19c3d6', start: 23.75, late: 27.5, close: 28.5, lastCall: null, rate: 18, cap: 8, sealed: false, age: 21, host: 'club', occasion: 'pool', bpm: 124, club: true, build: poolclub },
  dayclub: { name: 'Tidewater Beach Club', kind: 'Dayclub · Meridian Grand', city: 'Las Vegas', where: 'lasvegas', privacy: 0.25, hc: '#ffb21a', start: 13.0, late: 17.5, close: 18.5, lastCall: null, rate: 18, cap: 8, sealed: false, age: 21, host: 'club', occasion: 'pool', bpm: 122, club: true, day: true, night: false, build: poolclub },
};
// (never plain 'pool': that is the pool table's game)
export const POOL_ALIAS = { poolparty: 'poolclub', nightswim: 'poolclub', beachclub: 'dayclub', daypool: 'dayclub', tidewater: 'poolclub' };
// (open air on a podium roof: most of the world's own light gets in, the room's a little; the Sphere's glow at night)
export const POOL_HOSTED = {
  poolclub: { view: -1, world: 0.85, room: 0.5, sphere: 0.45, near: 0.12 },
  dayclub: { view: -1, world: 1, room: 0.35, sphere: 0, near: 0.12 },
};
// (the deck and its walls, the pool wings either end - the north one 30 m back from the middle)
export const POOL_FOOTPRINT = {
  poolclub: { front: 30, back: 26, side: 24.4, r: 30 },
  dayclub: { front: 30, back: 26, side: 24.4, r: 30 },
};
// (a pool club's drinks, real pours - PartyPlay's own kinds: champagne, cocktail, shot, beer, wine, water, soft)
export const POOL_ORDERS = {
  poolclub: [{ id: 'flute', label: 'A flute of champagne', kind: 'champagne', units: 1.5, cost: 0.00004 }, { id: 'cocktail', label: 'A frozen margarita', kind: 'cocktail', units: 2, cost: 0.000032 }, { id: 'shot', label: 'A tequila shot', kind: 'shot', units: 1.7, cost: 0.00002 }, { id: 'beer', label: 'A beer from the bucket', kind: 'beer', units: 2, cost: 0.000015 }, { id: 'water', label: 'Water, lots of ice', kind: 'water', units: 0, cost: 0.000008 }, { id: 'soft', label: 'A fresh lemonade', kind: 'soft', units: 0, cost: 0.00001 }],
};
POOL_ORDERS.dayclub = POOL_ORDERS.poolclub;
/** what a pool club calls for: the 'pool' wardrobe once Celebs has one (any star's wear.pool), else the club's */
export function poolOccasion() {
  try { const C = Celebs.CELEB || {}; for (const k in C) if (C[k]?.wear?.pool) return 'pool'; } catch (_) { /* no Celebs */ }
  return 'club';
}
/**
 * A man's clothes at the pool (h: his own number; day: a dayclub; dry: he keeps to the deck): People's swim shorts when it
 * has them - an open shirt over some, if dry - else a light silk or knitted shirt and pale trousers by day, the club's own
 * dark ones at night
 * -> makePerson's options
 */
export function poolDriverLook(h, day = false, dry = false) {
  const k = (L, s = 0) => L[(h >>> s) % L.length], S0 = swimKits('m'), SW = S0.filter((x) => !swimInfo(x).shirt), SM = dry || !SW.length ? S0 : SW;
  // (dry: he stays on the deck - an open shirt allowed; else he may be stood in the water: swim shorts only, slides)
  if (SM.length) { const kit = k(SM, 2), sh = k(SHORTS_COL, 5); return { kit, color: swimInfo(kit).shirt ? k(['#f4f1ea', '#e9e2d0', '#9fd3c7', '#2a4d8f'], 8) : sh, accent: sh, legs: sh, shoe: 'slide', shoes: k(['#111114', '#ecebe6', '#1b2440'], 11), acc: ['watch'] }; }
  const kit = k(['silkshirt', 'knitpolo'], 3);
  return day ? { kit, color: k(['#f4f1ea', '#e9e2d0', '#9fd3c7', '#c9d8e8', '#2a4d8f', '#e8dcc8'], 5), accent: '#f4f1ea', legs: k(['#e8dcc8', '#c9bba0', '#f1f0ec', '#1b2440'], 9), shoe: 'trainer', shoes: '#ecebe6', acc: ['watch'] }
    : { kit, color: k(['#111114', '#1b2440', '#f2f0ea', '#2e3a2c', '#5a1422'], 5), accent: '#f2f0ea', legs: k(['#111114', '#1c1f26', '#e8dcc8'], 9), shoe: k(['shoe', 'trainer'], 11), shoes: '#141416', acc: ['watch'] };
}
