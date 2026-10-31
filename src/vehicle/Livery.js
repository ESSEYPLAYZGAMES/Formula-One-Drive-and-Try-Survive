// Liveries: a team's paint as layers over the car's shape (vehicle/CarModel.js), worked out on the GPU from where a
// point is on the car - the body frame: x forward from the axles' midpoint, y up from the ground, z to the right - so a
// line runs on unbroken over every panel. A livery: { base, layers: [...], text: [...], finish, num } (colours '#hex').
//   layers (painted in order, each over the last; x/y knots in metres, a curve through up to 4 [x, y] points):
//     below { c, pts }        under a curve (a waterline): the lower body
//     above { c, pts }        over a curve
//     band  { c, lo, hi, x0?, x1? }  between two curves (a stripe along the side), from x0 to x1
//     pin   { c, pts, w }     a pinstripe along a curve (w: half its width)
//     spine { c, pts, y0 }    a stripe down the middle of the top (pts: its half-width along x), over y0
//     block { c, x0, x1, y0?, y1? }  a box along the car
//     fadeX { c, c2, x0, x1 } / fadeY { c, c2, y0, y1 }  a blend from c to c2 (the base under everything after)
//     nose  { c, x0 }         the nose ahead of x0
//     wingF { c } / wingR { c }  the front / rear wing's painted parts (their endplates)
//     halo  { c }             the halo and the cockpit's rim
//     top   { c, x0, x1 }     the surfaces facing up between x0 and x1
//   every layer: side ('both' | 'side' | 'top': only the surfaces facing that way), soft (m: a blurred edge)
//   text: [{ s, at: 'side' | 'top', x, y (side) or z (top), h, c, font?, w? }] wordmarks, at most four
//   finish: { rough, metal }; num: { c, edge } (the race number's colours)
import * as THREE from 'three';

export const MAX_LAYERS = 12, MAX_TEXT = 4;
const T = { below: 1, above: 2, band: 3, pin: 4, spine: 5, block: 6, fadeX: 7, fadeY: 8, nose: 9, wingF: 10, wingR: 11, halo: 12, top: 13 };
const SIDE = { both: 0, side: 1, top: 2 };

// ---- the 2026 grid (after the teams' launch liveries: the main colours, where they meet, the wordmarks - no logos)
// (the curves: x from the rear wing, -2.4, to the nose tip, 2.9; the sidepods' tops are at about 0.68 m, the engine
//  cover runs down from the airbox, 1.0 m, at x = 0 to 0.62 m at -1.9; the nose from 0.58 m at x = 0.9 to 0.36 m at 2.8)
export const TEAM_LIVERIES = {
  McLaren: { base: '#ff8000', finish: { rough: 0.3, metal: 0.15 }, num: { c: '#ffffff', edge: '#1b1b1f' },
    layers: [
      { t: 'below', c: '#1c1d21', pts: [[-2.4, 0.52], [-0.9, 0.5], [0.6, 0.46], [2.9, 0.4]], soft: 0.01 },   // the anthracite lower body
      { t: 'pin', c: '#1c1d21', pts: [[-2.0, 0.6], [-0.9, 0.58], [0.6, 0.55], [2.9, 0.44]], w: 0.012 },
      { t: 'halo', c: '#1c1d21' },
      { t: 'wingR', c: '#1c1d21' }, { t: 'wingF', c: '#ff8000' },
      { t: 'nose', c: '#1c1d21', x0: 2.62 },
    ],
    text: [{ s: 'McLAREN', at: 'side', x: -0.95, y: 0.7, h: 0.1, c: '#1c1d21', font: 'italic 900' }, { s: 'Gemini', at: 'side', x: -0.3, y: 0.4, h: 0.1, c: '#ffffff', font: '700' }] },
  Ferrari: { base: '#d40000', finish: { rough: 0.22, metal: 0.1 }, num: { c: '#ffffff', edge: '#7a0000' },
    layers: [
      { t: 'pin', c: '#ffffff', pts: [[-1.45, 0.3], [-0.6, 1.15]], w: 0.24 },   // HP's white band, slanting up over the engine cover
      { t: 'below', c: '#121212', pts: [[-2.4, 0.42], [-0.6, 0.36], [0.6, 0.33], [2.9, 0.26]], soft: 0.01 },
      { t: 'pin', c: '#ffffff', pts: [[-0.4, 0.43], [0.4, 0.4], [1.2, 0.42], [2.6, 0.36]], w: 0.01 },
      { t: 'wingR', c: '#d40000' }, { t: 'wingF', c: '#ffffff' },
      { t: 'halo', c: '#d40000' },
    ],
    text: [{ s: 'HP', at: 'side', x: -0.88, y: 0.76, h: 0.15, c: '#1a1a1a', font: '900' }, { s: 'Shell', at: 'side', x: 0.25, y: 0.5, h: 0.08, c: '#ffd400', font: '900' }] },
  'Red Bull Racing': { base: '#1b2448', finish: { rough: 0.58, metal: 0.05 }, num: { c: '#ffffff', edge: '#e2142d' },
    layers: [
      { t: 'band', c: '#e2142d', lo: [[-1.6, 0.72], [-0.9, 0.62], [-0.3, 0.62], [0.2, 0.7]], hi: [[-1.6, 0.8], [-0.9, 0.9], [-0.3, 0.95], [0.2, 0.86]], x0: -1.7, x1: 0.25, soft: 0.02 },   // the red flank under the airbox
      { t: 'nose', c: '#ffc906', x0: 2.35 },
      { t: 'spine', c: '#e2142d', pts: [[-1.9, 0.03], [-1.0, 0.05], [-0.4, 0.06], [0.0, 0.06]], y0: 0.7 },
      { t: 'wingR', c: '#1b2448' }, { t: 'wingF', c: '#e2142d' },
      { t: 'pin', c: '#ffc906', pts: [[0.6, 0.47], [1.2, 0.5], [2.0, 0.45], [2.4, 0.42]], w: 0.012 },
    ],
    text: [{ s: 'ORACLE', at: 'side', x: -0.3, y: 0.47, h: 0.13, c: '#ffffff', font: '600' }, { s: 'Mobil 1', at: 'side', x: -2.15, y: 0.77, h: 0.1, c: '#ffffff', font: '800' }] },
  Mercedes: { base: '#111316', finish: { rough: 0.32, metal: 0.35 }, num: { c: '#ffffff', edge: '#00d2be' },
    layers: [
      { t: 'fadeX', c: '#111316', c2: '#a9adb3', x0: -0.6, x1: 1.4 },   // black at the back, silver over the nose
      { t: 'below', c: '#111316', pts: [[-2.4, 0.45], [0.4, 0.42], [1.4, 0.4], [2.9, 0.3]], soft: 0.03 },
      { t: 'pin', c: '#00d2be', pts: [[-1.8, 0.66], [-0.8, 0.6], [0.4, 0.52], [2.6, 0.4]], w: 0.014 },
      { t: 'wingR', c: '#111316' }, { t: 'wingF', c: '#00d2be' },
      { t: 'halo', c: '#111316' },
    ],
    text: [{ s: 'PETRONAS', at: 'side', x: -0.35, y: 0.47, h: 0.1, c: '#00d2be', font: '800' }, { s: 'PETRONAS', at: 'side', x: -2.15, y: 0.78, h: 0.08, c: '#ffffff', font: '800' }] },
  'Aston Martin': { base: '#00594f', finish: { rough: 0.34, metal: 0.25 }, num: { c: '#cedc00', edge: '#002b26' },
    layers: [
      { t: 'below', c: '#0b1210', pts: [[-2.4, 0.42], [-0.6, 0.38], [0.6, 0.35], [2.9, 0.3]], soft: 0.01 },
      { t: 'pin', c: '#cedc00', pts: [[-2.0, 0.66], [-0.9, 0.62], [0.6, 0.5], [2.9, 0.42]], w: 0.016 },
      { t: 'wingF', c: '#cedc00' }, { t: 'wingR', c: '#00594f' },
      { t: 'spine', c: '#cedc00', pts: [[0.9, 0.012], [1.6, 0.012], [2.3, 0.012], [2.8, 0.012]], y0: 0.3 },
    ],
    text: [{ s: 'aramco', at: 'side', x: -0.35, y: 0.47, h: 0.13, c: '#ffffff', font: '700' }, { s: 'ARAMCO', at: 'side', x: -2.15, y: 0.78, h: 0.08, c: '#cedc00', font: '800' }] },
  Williams: { base: '#0a1f6e', finish: { rough: 0.35, metal: 0.2 }, num: { c: '#ffffff', edge: '#00a3e0' },
    layers: [
      { t: 'fadeY', c: '#071442', c2: '#1652d8', y0: 0.3, y1: 0.85 },
      { t: 'band', c: '#00a3e0', lo: [[-1.9, 0.6], [-0.8, 0.54], [0.6, 0.46], [2.9, 0.38]], hi: [[-1.9, 0.63], [-0.8, 0.575], [0.6, 0.49], [2.9, 0.405]], soft: 0.004 },
      { t: 'wingF', c: '#00a3e0' }, { t: 'wingR', c: '#0a1f6e' },
      { t: 'nose', c: '#ffffff', x0: 2.7 },
    ],
    text: [{ s: 'Atlassian', at: 'side', x: -0.35, y: 0.46, h: 0.11, c: '#ffffff', font: '700' }, { s: 'KOMATSU', at: 'side', x: 1.1, y: 0.52, h: 0.06, c: '#ffffff', font: '900' }] },
  'Racing Bulls': { base: '#f4f6fa', finish: { rough: 0.3, metal: 0.1 }, num: { c: '#1534cc', edge: '#ffffff' },
    layers: [
      { t: 'fadeX', c: '#1534cc', c2: '#f4f6fa', x0: -0.6, x1: 0.5 },
      { t: 'below', c: '#13204d', pts: [[-2.4, 0.4], [-0.6, 0.36], [0.6, 0.33], [2.9, 0.26]], soft: 0.01 },
      { t: 'pin', c: '#e1251b', pts: [[-1.6, 0.68], [-0.6, 0.6], [0.6, 0.5], [2.8, 0.4]], w: 0.012 },
      { t: 'wingR', c: '#1534cc' }, { t: 'wingF', c: '#e1251b' },
      { t: 'nose', c: '#1534cc', x0: 2.6 },
    ],
    text: [{ s: 'VISA', at: 'side', x: -0.85, y: 0.5, h: 0.15, c: '#ffffff', font: 'italic 900' }, { s: 'VISA', at: 'side', x: -2.15, y: 0.78, h: 0.11, c: '#ffffff', font: 'italic 900' }] },
  Haas: { base: '#f2f2f2', finish: { rough: 0.3, metal: 0.1 }, num: { c: '#e10600', edge: '#ffffff' },
    layers: [
      { t: 'below', c: '#141414', pts: [[-2.4, 0.5], [-0.6, 0.42], [0.6, 0.4], [2.9, 0.32]], soft: 0.01 },
      { t: 'band', c: '#e10600', lo: [[-2.0, 0.5], [-0.6, 0.42], [0.6, 0.4], [2.9, 0.32]], hi: [[-2.0, 0.56], [-0.6, 0.48], [0.6, 0.46], [2.9, 0.37]], soft: 0.004 },
      { t: 'wingR', c: '#e10600' }, { t: 'wingF', c: '#141414' },
      { t: 'spine', c: '#e10600', pts: [[-1.9, 0.04], [-1.0, 0.06], [-0.3, 0.07], [0.0, 0.05]], y0: 0.7 },
    ],
    text: [{ s: 'TGR', at: 'side', x: -0.3, y: 0.47, h: 0.13, c: '#141414', font: '900' }, { s: 'HAAS', at: 'side', x: -2.15, y: 0.8, h: 0.09, c: '#ffffff', font: '900' }] },
  Alpine: { base: '#0a5bd6', finish: { rough: 0.3, metal: 0.2 }, num: { c: '#ffffff', edge: '#ff5fb0' },
    layers: [
      { t: 'fadeX', c: '#0a5bd6', c2: '#ff6fb5', x0: -0.9, x1: 0.9 },
      { t: 'below', c: '#0d0f1c', pts: [[-2.4, 0.38], [-0.6, 0.34], [0.6, 0.32], [2.9, 0.26]], soft: 0.01 },
      { t: 'pin', c: '#ffffff', pts: [[-2.0, 0.64], [-0.8, 0.58], [0.6, 0.5], [2.8, 0.41]], w: 0.008 },
      { t: 'wingR', c: '#ff6fb5' }, { t: 'wingF', c: '#0a5bd6' },
    ],
    text: [{ s: 'BWT', at: 'side', x: -0.35, y: 0.5, h: 0.2, c: '#ffffff', font: '900' }, { s: 'BWT', at: 'side', x: -2.15, y: 0.78, h: 0.13, c: '#ffffff', font: '900' }] },
  Audi: { base: '#c3c6ca', finish: { rough: 0.26, metal: 0.55 }, num: { c: '#ffffff', edge: '#f50537' },
    layers: [
      { t: 'block', c: '#16171a', x0: -3, x1: -0.55 },   // titanium ahead, black behind
      { t: 'below', c: '#16171a', pts: [[-2.4, 0.42], [-0.6, 0.38], [0.6, 0.36], [2.9, 0.3]], soft: 0.01 },
      { t: 'band', c: '#f50537', lo: [[-0.75, 0.4], [-0.6, 0.4], [-0.5, 0.4], [-0.35, 0.4]], hi: [[-0.75, 1.1], [-0.6, 1.1], [-0.5, 1.1], [-0.35, 1.1]], x0: -0.75, x1: -0.55 },   // the red line where they meet
      { t: 'wingR', c: '#16171a' }, { t: 'wingF', c: '#f50537' },
      { t: 'halo', c: '#16171a' },
    ],
    text: [{ s: 'AUDI', at: 'side', x: -1.0, y: 0.5, h: 0.11, c: '#ffffff', font: '900', track: 0.2 }, { s: 'Revolut', at: 'side', x: 0.1, y: 0.48, h: 0.1, c: '#16171a', font: '700' }] },
  Cadillac: { base: '#f4f4f2', finish: { rough: 0.28, metal: 0.2 }, num: { c: '#111111', edge: '#c9a86a' },
    layers: [
      { t: 'below', c: '#0d0d0f', pts: [[-2.4, 0.95], [-1.2, 0.72], [0.2, 0.5], [2.9, 0.36]], soft: 0.01 },   // black sweeping up to the back
      { t: 'pin', c: '#c9a86a', pts: [[-2.4, 0.97], [-1.2, 0.74], [0.2, 0.52], [2.9, 0.38]], w: 0.01 },
      { t: 'wingR', c: '#0d0d0f' }, { t: 'wingF', c: '#0d0d0f' },
      { t: 'halo', c: '#0d0d0f' },
    ],
    text: [{ s: 'CADILLAC', at: 'side', x: 1.35, y: 0.47, h: 0.06, c: '#0d0d0f', font: '700', track: 0.25 }, { s: 'TWG', at: 'side', x: -0.6, y: 0.45, h: 0.13, c: '#f4f4f2', font: '900' }] },
};

// ---- the player's own team: a design (the career's custom team: Career custom.livery) from a pattern and four colours
export const PATTERNS = {
  classic: 'Classic: two-tone with a pinstripe',
  arrow: 'Arrow: a stripe rising nose to tail',
  fade: 'Fade: one colour into the other',
  split: 'Split: dark sweep from the back',
  stripes: 'Stripes: twin racing stripes',
  blade: 'Blade: a band through the sidepods',
};
/** a livery from a design { pattern, c1 (main), c2 (second), c3 (accent), c4 (detail), finish: 'gloss'|'matte'|'metal', text, num } */
export function designLivery(d) {
  const c1 = d.c1 || '#00d4ff', c2 = d.c2 || '#ffffff', c3 = d.c3 || '#111318', c4 = d.c4 || c2;
  const finish = d.finish === 'matte' ? { rough: 0.6, metal: 0.05 } : d.finish === 'metal' ? { rough: 0.24, metal: 0.6 } : { rough: 0.26, metal: 0.15 };
  const L = [];
  const water = [[-2.4, 0.46], [-0.6, 0.42], [0.6, 0.38], [2.9, 0.32]], pin = [[-2.0, 0.64], [-0.8, 0.58], [0.6, 0.5], [2.8, 0.41]];
  switch (d.pattern) {
    case 'arrow':
      L.push({ t: 'below', c: c3, pts: water, soft: 0.01 });
      L.push({ t: 'band', c: c2, lo: [[-2.0, 0.78], [-0.8, 0.58], [0.6, 0.46], [2.9, 0.36]], hi: [[-2.0, 0.92], [-0.8, 0.7], [0.6, 0.54], [2.9, 0.42]], soft: 0.005 });
      L.push({ t: 'pin', c: c4, pts: [[-2.0, 0.93], [-0.8, 0.715], [0.6, 0.555], [2.9, 0.425]], w: 0.008 });
      L.push({ t: 'wingR', c: c2 }, { t: 'wingF', c: c2 });
      break;
    case 'fade':
      L.push({ t: 'fadeX', c: c2, c2: c1, x0: -1.0, x1: 1.2 });
      L.push({ t: 'below', c: c3, pts: water, soft: 0.04 });
      L.push({ t: 'pin', c: c4, pts: pin, w: 0.01 });
      L.push({ t: 'wingR', c: c2 }, { t: 'wingF', c: c1 });
      break;
    case 'split':
      L.push({ t: 'below', c: c3, pts: [[-2.4, 0.95], [-1.2, 0.72], [0.2, 0.5], [2.9, 0.36]], soft: 0.01 });
      L.push({ t: 'pin', c: c2, pts: [[-2.4, 0.975], [-1.2, 0.745], [0.2, 0.525], [2.9, 0.385]], w: 0.012 });
      L.push({ t: 'nose', c: c4, x0: 2.55 });
      L.push({ t: 'wingR', c: c3 }, { t: 'wingF', c: c2 });
      break;
    case 'stripes':
      L.push({ t: 'below', c: c3, pts: water, soft: 0.01 });
      L.push({ t: 'spine', c: c2, pts: [[-1.9, 0.11], [-0.5, 0.11], [0.9, 0.11], [2.9, 0.08]], y0: 0.3 });
      L.push({ t: 'spine', c: c1, pts: [[-1.9, 0.05], [-0.5, 0.05], [0.9, 0.05], [2.9, 0.035]], y0: 0.3 });
      L.push({ t: 'wingR', c: c2 }, { t: 'wingF', c: c2 });
      L.push({ t: 'halo', c: c4 });
      break;
    case 'blade':
      L.push({ t: 'below', c: c3, pts: water, soft: 0.01 });
      L.push({ t: 'band', c: c2, lo: [[-1.7, 0.5], [-0.8, 0.48], [0.3, 0.46], [0.9, 0.5]], hi: [[-1.7, 0.56], [-0.8, 0.64], [0.3, 0.66], [0.9, 0.62]], x0: -1.75, x1: 0.95, soft: 0.006 });
      L.push({ t: 'nose', c: c2, x0: 2.5 });
      L.push({ t: 'pin', c: c4, pts: pin, w: 0.008 });
      L.push({ t: 'wingR', c: c3 }, { t: 'wingF', c: c2 });
      break;
    default:   // classic
      L.push({ t: 'below', c: c2, pts: water, soft: 0.01 });
      L.push({ t: 'pin', c: c3, pts: [[-2.4, 0.475], [-0.6, 0.435], [0.6, 0.395], [2.9, 0.335]], w: 0.012 });
      L.push({ t: 'nose', c: c4, x0: 2.6 });
      L.push({ t: 'wingR', c: c2 }, { t: 'wingF', c: c3 });
  }
  const text = [];
  if (d.text) text.push({ s: d.text, at: 'side', x: -0.45, y: 0.55, h: 0.075, c: d.textC || c4, font: '900' }, { s: d.text, at: 'side', x: -2.15, y: 0.78, h: 0.055, c: d.textC || c4, font: '900' });
  return { base: c1, layers: L, text, finish, num: d.num || { c: c4, edge: c3 } };
}

/** a livery for a car: its team's, a design, or (an unknown team) a two-tone from its colours */
export function liveryFor(team, color, color2, design) {
  if (design) return designLivery(design);
  if (TEAM_LIVERIES[team]) return TEAM_LIVERIES[team];
  return designLivery({ pattern: 'classic', c1: color || '#00d4ff', c2: color2 || '#ffffff', c3: '#121418', c4: color2 || '#ffffff' });
}

// ---------------------------------------------------------------------------------------------------------------------
// the shader: uniforms from a livery, and the chunk that paints it
const col = (h) => new THREE.Color(h);
/** the curve's knots as two vec4s (padded to four by repeating the last) */
function knots(pts) { const p = pts.slice(0, 4); while (p.length < 4) p.push(p[p.length - 1]); return [new THREE.Vector4(...p.map((q) => q[0])), new THREE.Vector4(...p.map((q) => q[1]))]; }
/** a livery's wordmarks drawn into one atlas (one row each): its texture and each text's place in it */
function textAtlas(text) {
  if (!text?.length || typeof document === 'undefined') return null;
  const W = 1024, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H * MAX_TEXT; const x = c.getContext('2d');
  const rects = [];
  text.slice(0, MAX_TEXT).forEach((t, i) => {
    x.font = `${t.font || '800'} ${H * 0.72}px "Segoe UI", Arial, sans-serif`; x.textBaseline = 'middle'; x.textAlign = 'center';
    const track = (t.track || 0) * H; let w = x.measureText(t.s).width + track * Math.max(0, t.s.length - 1);
    const sx = Math.min(1, (W - 16) / w); x.save(); x.translate(W / 2, i * H + H / 2); x.scale(sx, 1); x.fillStyle = t.c || '#ffffff';
    if (track) { let p = -w / 2; for (const ch of t.s) { const cw = x.measureText(ch).width; x.fillText(ch, p + cw / 2, 0); p += cw + track; } } else x.fillText(t.s, 0, 0);
    x.restore(); w *= sx;
    rects.push({ u0: (W / 2 - w / 2) / W, u1: (W / 2 + w / 2) / W, v0: 1 - (i * H + H) / (H * MAX_TEXT), v1: 1 - (i * H) / (H * MAX_TEXT), aspect: w / (H * 0.8) });
  });
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return { tex, rects };
}

/** the uniforms that hold a livery (shared by every material of one car) */
export function liveryUniforms(L) {
  const n = Math.min(MAX_LAYERS, L.layers.length);
  const U = {
    uLivBase: { value: col(L.base) }, uLivN: { value: n }, uLivBurn: { value: 0 },
    uLivA: { value: [] }, uLivC: { value: [] }, uLivC2: { value: [] }, uLivX: { value: [] }, uLivY: { value: [] }, uLivY2: { value: [] },
    uTxtN: { value: 0 }, uTxtP: { value: [] }, uTxtR: { value: [] }, uTxtM: { value: [] }, uTxtMap: { value: null },
    uLivComp: { value: new THREE.Color('#e10600') }, uLivTcam: { value: new THREE.Color('#ffd400') },
  };
  for (let i = 0; i < MAX_LAYERS; i++) {
    const l = L.layers[i] || {}, ty = T[l.t] || 0;
    let X = new THREE.Vector4(), Y = new THREE.Vector4(), Y2 = new THREE.Vector4();
    if (l.pts) [X, Y] = knots(l.pts);
    if (l.lo) { [X, Y] = knots(l.lo); [, Y2] = knots(l.hi); }
    // (the boxes and blends: their bounds in X; a band's x range in Y2 when it has curves - see the shader)
    if (ty === T.block) X.set(l.x0 ?? -9, l.x1 ?? 9, l.y0 ?? -9, l.y1 ?? 9);
    if (ty === T.fadeX) X.set(l.x0, l.x1, 0, 0);
    if (ty === T.fadeY) X.set(l.y0, l.y1, 0, 0);
    if (ty === T.nose) X.set(l.x0, 0, 0, 0);
    if (ty === T.top) X.set(l.x0 ?? -9, l.x1 ?? 9, 0, 0);
    // a: type, edge softness, which surfaces, a parameter (pin: half width; spine: lowest y; band: x0 / x1 packed)
    const p = ty === T.pin ? l.w ?? 0.01 : ty === T.spine ? l.y0 ?? 0.3 : 0;
    U.uLivA.value.push(new THREE.Vector4(ty, l.soft ?? 0, SIDE[l.side || 'both'], p));
    U.uLivC.value.push(col(l.c || '#ffffff')); U.uLivC2.value.push(col(l.c2 || l.c || '#ffffff'));
    U.uLivX.value.push(X); U.uLivY.value.push(Y); U.uLivY2.value.push(Y2);
    // (a band: its x range - x1 in a.w, x0 in its second colour's red, which a band has no use for)
    if (ty === T.band) { U.uLivA.value[i].w = l.x1 ?? 9; U.uLivC2.value[i].setRGB(l.x0 ?? -9, 0, 0, THREE.LinearSRGBColorSpace); }
  }
  const A = textAtlas(L.text);
  if (A) {
    U.uTxtMap.value = A.tex; U.uTxtN.value = A.rects.length;
    L.text.slice(0, MAX_TEXT).forEach((t, i) => {
      const r = A.rects[i], h = t.h || 0.08, w = t.w || h * r.aspect;
      U.uTxtP.value.push(new THREE.Vector4(t.x ?? 0, t.at === 'top' ? t.z ?? 0 : t.y ?? 0.5, w, h));
      U.uTxtR.value.push(new THREE.Vector4(r.u0, r.v0, r.u1, r.v1));
      U.uTxtM.value.push(new THREE.Vector4(t.at === 'top' ? 1 : 0, 0, 0, 0));
    });
  }
  for (let i = U.uTxtP.value.length; i < MAX_TEXT; i++) { U.uTxtP.value.push(new THREE.Vector4()); U.uTxtR.value.push(new THREE.Vector4()); U.uTxtM.value.push(new THREE.Vector4()); }
  return U;
}

const GLSL = /* glsl */`
#define LIV_N ${MAX_LAYERS}
#define TXT_N ${MAX_TEXT}
uniform vec3 uLivBase; uniform int uLivN; uniform float uLivBurn;
uniform vec4 uLivA[LIV_N]; uniform vec3 uLivC[LIV_N]; uniform vec3 uLivC2[LIV_N]; uniform vec4 uLivX[LIV_N]; uniform vec4 uLivY[LIV_N]; uniform vec4 uLivY2[LIV_N];
uniform int uTxtN; uniform vec4 uTxtP[TXT_N]; uniform vec4 uTxtR[TXT_N]; uniform vec4 uTxtM[TXT_N]; uniform sampler2D uTxtMap;
uniform vec3 uLivOff; uniform vec3 uLivComp; uniform vec3 uLivTcam; uniform float uLivPart;
varying vec3 vLivP; varying vec3 vLivN;
float livCurve(float x, vec4 X, vec4 Y) {
  if (x <= X.x) return Y.x;
  if (x <= X.y) return mix(Y.x, Y.y, (x - X.x) / max(1e-4, X.y - X.x));
  if (x <= X.z) return mix(Y.y, Y.z, (x - X.y) / max(1e-4, X.z - X.y));
  if (x <= X.w) return mix(Y.z, Y.w, (x - X.z) / max(1e-4, X.w - X.z));
  return Y.w;
}
// coverage of a signed distance (> 0 inside, metres), anti-aliased over a pixel plus the layer's softness
float livEdge(float d, float soft) { float w = max(fwidth(d), 1e-4) * 0.75 + soft; return smoothstep(-w, w, d); }
vec3 liveryColour(vec3 p, vec3 n) {
  vec3 c = uLivBase;
  float az = abs(p.z);
  for (int i = 0; i < LIV_N; i++) {
    if (i >= uLivN) break;
    vec4 A = uLivA[i]; int t = int(A.x + 0.5); float soft = A.y; vec4 X = uLivX[i];
    float side = floor(A.z + 0.5);
    float m = side < 0.5 ? 1.0 : side < 1.5 ? smoothstep(0.25, 0.45, abs(n.z)) : smoothstep(0.35, 0.6, n.y);
    float d = -1.0;
    if (t == 1) d = livCurve(p.x, X, uLivY[i]) - p.y;
    else if (t == 2) d = p.y - livCurve(p.x, X, uLivY[i]);
    else if (t == 3) { float x0 = uLivC2[i].r, x1 = A.w; d = min(min(p.y - livCurve(p.x, X, uLivY[i]), livCurve(p.x, X, uLivY2[i]) - p.y), min(p.x - x0, x1 - p.x)); }
    else if (t == 4) d = min(A.w - abs(p.y - livCurve(p.x, X, uLivY[i])), min(p.x - X.x, X.w - p.x));
    else if (t == 5) d = min(livCurve(p.x, X, uLivY[i]) - az, min(p.y - A.w, min(p.x - X.x, X.w - p.x)));
    else if (t == 6) d = min(min(p.x - X.x, X.y - p.x), min(p.y - X.z, X.w - p.y));
    else if (t == 7) { c = mix(uLivC[i], uLivC2[i], smoothstep(X.x, X.y, p.x)); continue; }
    else if (t == 8) { c = mix(uLivC[i], uLivC2[i], smoothstep(X.x, X.y, p.y)); continue; }
    else if (t == 9) d = p.x - X.x;
    else if (t == 10) d = uLivPart > -0.5 ? (abs(uLivPart - 1.0) < 0.5 ? 1.0 : -1.0) : min(p.x - 1.98, 0.46 - p.y);   // (the part's own flag; merged far meshes by where it is)
    else if (t == 11) d = uLivPart > -0.5 ? (abs(uLivPart - 2.0) < 0.5 ? 1.0 : -1.0) : min(-1.84 - p.x, p.y - 0.36);
    else if (t == 12) d = min(min(p.x + 0.35, 0.98 - p.x), min(p.y - 0.73, 0.55 - az));
    else if (t == 13) d = min(min(p.x - X.x, X.y - p.x), n.y - 0.5);
    c = mix(c, uLivC[i], livEdge(d, soft) * m);
  }
  // the wordmarks: on the sides (read from the back toward the front on the right, the other way on the left), or on
  // top (across the car, upright seen from behind)
  for (int i = 0; i < TXT_N; i++) {
    if (i >= uTxtN) break;
    vec4 P = uTxtP[i], Rr = uTxtR[i]; vec2 uv;
    if (uTxtM[i].x < 0.5) { if (abs(n.z) < 0.3) continue; uv = vec2((p.x - P.x) / P.z * (p.z > 0.0 ? 1.0 : -1.0) + 0.5, (p.y - P.y) / P.w + 0.5); }
    else { if (n.y < 0.4) continue; uv = vec2((p.z - P.y) / P.z + 0.5, (p.x - P.x) / P.w + 0.5); }
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) continue;
    vec4 s = texture2D(uTxtMap, vec2(mix(Rr.x, Rr.z, uv.x), mix(Rr.y, Rr.w, uv.y)));
    c = mix(c, s.rgb, s.a);
  }
  return c * (1.0 - 0.55 * uLivBurn);
}
`;

/**
 * Make a MeshStandardMaterial paint the livery (U: liveryUniforms - shared; off: the part's pivot in the body frame;
 * part: 1 the front wing, 2 the rear wing, 0 the rest, -1 not known - a merged far mesh: the wing layers by position).
 * mode 'paint': the livery everywhere; 'far': vertex colours, the livery where their alpha flags the paint (1), the
 * compound's colour (0.5: a tyre's band), the T-cam's (0.25).
 */
export function paintWith(mat, U, off = [0, 0, 0], mode = 'paint', part = -1) {
  const own = { uLivOff: { value: new THREE.Vector3(...off) }, uLivPart: { value: part } };
  mat.userData.livery = U;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U, own);
    // (the far mode's flag - what a vertex is: paint, a tyre's band, the T-cam - not blended across a triangle: blended,
    //  the edge of a tyre's band passed through the T-cam's value and came out yellow)
    const far = mode === 'far';
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLivP; varying vec3 vLivN; uniform vec3 uLivOff;' + (far ? '\nflat out float vLivFlag;' : ''))
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLivP = transformed + uLivOff; vLivN = objectNormal;' + (far ? '\nvLivFlag = color.a;' : ''));
    if (far) sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nflat in float vLivFlag;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + GLSL)
      .replace('#include <color_fragment>', mode === 'far'
        ? `#include <color_fragment>
          { float fl = vLivFlag; vec3 P = vLivP, N = normalize(vLivN);
            diffuseColor.rgb = fl > 0.75 ? liveryColour(P, N) : fl > 0.4 ? mix(vColor.rgb, uLivComp, 0.85) : fl > 0.15 ? uLivTcam : vColor.rgb;
            diffuseColor.a = 1.0; }`
        : `#include <color_fragment>
          diffuseColor.rgb *= liveryColour(vLivP, normalize(vLivN));`);
  };
  mat.customProgramCacheKey = () => 'livery-' + mode;
  return mat;
}
