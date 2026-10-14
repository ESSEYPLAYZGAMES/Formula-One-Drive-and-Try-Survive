// Every F1 driver's own helmet (the 2026 designs, simplified to their colours and the shape of their graphics): a
// painted texture for a sphere's UVs - u round the head from the front (u = 0 / 1) to the back (0.5), v from the crown
// down - shared by the helmet in the cockpit (vehicle/CarMesh.js) and the helmet on its own (world/People.js
// makeHelmet: the mourning screen, the memorial). F2 drivers, reserves and juniors keep a plain helmet in one colour.
import * as THREE from 'three';

/**
 * style: how the graphic is laid out; c: the colours (the base first); visor: the iridium tint of the visor.
 * squiggle (a maze of black doodles), gradient (top to bottom, slashed with stripes), stripes (pinstripes round the
 * shell), tricolor (a crown and bands of colour low on the sides), wedges (angular panels sweeping back), split (one
 * colour above a swoosh, another below), solid (one colour, a thin accent), crown (a cap of colour over the rest),
 * swirl (flowing lines on a dark shell), marble (blots of colour on white).
 */
export const HELMET_DESIGNS = {
  'Lando Norris': { style: 'squiggle', c: ['#c8f03c', '#111111'], visor: '#c9a227' },
  'Oscar Piastri': { style: 'gradient', c: ['#ff8a1f', '#e83a1e', '#1a1a1a', '#111111'], visor: '#d4552a' },
  'George Russell': { style: 'stripes', c: ['#63bde9', '#0d2b55', '#ffffff'], visor: '#2d7fd6' },
  'Kimi Antonelli': { style: 'tricolor', c: ['#f2f2f2', '#1fb3a8', '#1a9a4a', '#d8282e'], visor: '#20262e' },
  'Max Verstappen': { style: 'wedges', c: ['#f4f4f4', '#d6202e', '#16235e', '#f2c200'], visor: '#1b2e6b' },
  'Isack Hadjar': { style: 'wedges', c: ['#12204a', '#b8e23a', '#d6202e', '#2a6be0'], visor: '#2d5fd6' },
  'Charles Leclerc': { style: 'split', c: ['#d6202e', '#ffffff', '#111111'], visor: '#c85a6a' },
  'Lewis Hamilton': { style: 'solid', c: ['#f6d21a', '#d6202e', '#ffffff'], visor: '#c9a227' },
  'Carlos Sainz': { style: 'crown', c: ['#e94e2a', '#1e4fbf', '#ffffff', '#ffd400'], visor: '#e0592a' },
  'Alexander Albon': { style: 'swirl', c: ['#f4f4f4', '#0e1a3a', '#111111'], visor: '#20262e' },
  'Liam Lawson': { style: 'marble', c: ['#fbfbfb', '#f28dc0', '#1e41ff', '#d6202e'], visor: '#c870a0' },
  'Arvid Lindblad': { style: 'wedges', c: ['#1f5fd6', '#ffb21f', '#2cc7c0', '#ffe14a'], visor: '#2d7fd6' },
  'Fernando Alonso': { style: 'split', c: ['#1f6fd8', '#ffd400', '#ffffff'], visor: '#2d7fd6' },
  'Lance Stroll': { style: 'solid', c: ['#0f0f10', '#00a86b', '#2b2b2e'], visor: '#20262e' },
  'Esteban Ocon': { style: 'stripes', c: ['#e2332b', '#b8231d', '#ffffff'], visor: '#20262e' },
  'Oliver Bearman': { style: 'wedges', c: ['#12245a', '#f4d21a', '#ffffff', '#d6202e'], visor: '#2d5fd6' },
  'Nico Hulkenberg': { style: 'wedges', c: ['#e8e8ea', '#111111', '#d6202e', '#9a9aa0'], visor: '#20262e' },
  'Gabriel Bortoleto': { style: 'crown', c: ['#1a9a4a', '#f4f4f4', '#ffd400', '#0e2a6b'], visor: '#6a4a8a' },
  'Pierre Gasly': { style: 'stripes', c: ['#7cc6ea', '#e8f6fc', '#2f8fc4'], visor: '#1b4f8a' },
  'Franco Colapinto': { style: 'tricolor', c: ['#f4f4f4', '#6fc3ea', '#0e2a6b', '#d6202e'], visor: '#5a4ab0' },
  'Valtteri Bottas': { style: 'swirl', c: ['#0e1424', '#2b7de0', '#9cc8ff'], visor: '#20262e' },
  'Sergio Perez': { style: 'split', c: ['#111111', '#c6f03a', '#ffffff'], visor: '#2d5fd6' },
};
export const helmetDesign = (name) => HELMET_DESIGNS[name] || null;
// (a design of your own - a custom driver's, from the career's look: career/Avatar.js - registered by name like the
// grid's; the grid's own designs can never be replaced, and clearing takes away only those set this way)
const BUILTIN = new Set(Object.keys(HELMET_DESIGNS)), MINE = new Set();
/** name's design: D { style, c: [base, a, b, c], visor } (null: none again) -> false for one of the grid's own names */
export function setHelmetDesign(name, D) {
  if (!name || BUILTIN.has(name)) return false;
  if (D && Array.isArray(D.c) && D.c.length) { HELMET_DESIGNS[name] = { style: D.style || 'solid', c: [...D.c], visor: D.visor || '#20262e' }; MINE.add(name); }
  else { delete HELMET_DESIGNS[name]; MINE.delete(name); }
  return true;
}
/** every design set with setHelmetDesign taken away */
export function clearHelmetDesigns() { for (const n of MINE) delete HELMET_DESIGNS[n]; MINE.clear(); }

const seeded = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; };

/** the painted texture of a driver's helmet (W x W/2, equirectangular); mono: in greys (the black-and-white photograph) */
export function helmetTexture(name, { size = 1024, mono = false } = {}) {
  const D = helmetDesign(name); if (!D) return null;
  const W = size, H = size / 2, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const rnd = seeded(name), [c0, a, b, c] = D.c, k = W / 1024;
  x.fillStyle = c0; x.fillRect(0, 0, W, H);
  // (a line round the head at height y, dipping by dip toward the back; filled below it)
  const below = (y, col, dip = 0.06, wav = 0) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= W; i += 8) { const u = i / W; x.lineTo(i, (y - dip * Math.cos(u * Math.PI * 2) + wav * Math.sin(u * Math.PI * 6)) * H); } x.lineTo(W, H); x.closePath(); x.fill(); };
  const above = (y, col, dip = 0.05) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, 0); for (let i = 0; i <= W; i += 8) { const u = i / W; x.lineTo(i, (y + dip * Math.cos(u * Math.PI * 2)) * H); } x.lineTo(W, 0); x.closePath(); x.fill(); };
  const ring = (y, col, w, dip = 0.06, amp = 0, f = 2, ph = 0) => { x.strokeStyle = col; x.lineWidth = w * k; x.beginPath(); for (let i = 0; i <= W; i += 6) { const u = i / W, yy = (y - dip * Math.cos(u * Math.PI * 2) + amp * Math.sin(u * Math.PI * 2 * f + ph)) * H; i ? x.lineTo(i, yy) : x.moveTo(i, yy); } x.stroke(); };
  // (a shape drawn on one side, mirrored onto the other: u -> 1 - u)
  const sym = (fn) => { fn(); x.save(); x.translate(W, 0); x.scale(-1, 1); fn(); x.restore(); };
  const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); pts.forEach(([u, v], i) => (i ? x.lineTo(u * W, v * H) : x.moveTo(u * W, v * H))); x.closePath(); x.fill(); };
  switch (D.style) {
    case 'squiggle': {
      x.lineCap = x.lineJoin = 'round'; x.strokeStyle = a;
      for (let s = 0; s < 150; s++) {
        let px = rnd() * W, py = (0.04 + rnd() * 0.74) * H, ang = rnd() * 6.28; x.lineWidth = (5 + rnd() * 5) * k; x.beginPath(); x.moveTo(px, py);
        for (let j = 0; j < 8 + rnd() * 14; j++) { ang += (rnd() - 0.5) * 1.6; px += Math.cos(ang) * 14 * k; py += Math.sin(ang) * 14 * k; x.lineTo(px, py); }
        x.stroke();
      }
      break;
    }
    case 'gradient': {
      const g = x.createLinearGradient(0, 0, 0, H * 0.8); g.addColorStop(0, c0); g.addColorStop(0.5, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H);
      sym(() => { for (let i = 0; i < 5; i++) { const u0 = 0.12 + i * 0.07; poly([[u0, 0.75], [u0 + 0.03, 0.75], [u0 + 0.12, 0.08], [u0 + 0.09, 0.08]], c); } });
      break;
    }
    case 'stripes': {
      below(0.68, a, 0.04);
      for (let i = 0; i < 9; i++) ring(0.12 + i * 0.06, i % 3 === 2 ? b : a, i % 3 === 2 ? 5 : 2.5, 0.05, 0.012, 3, i);
      ring(0.68, b, 6, 0.04);
      break;
    }
    case 'tricolor': {
      above(0.17, a, 0.04);
      below(0.5, b, 0.07); below(0.57, c0, 0.07); below(0.6, c, 0.07); below(0.67, b, 0.07);
      ring(0.17, b, 4, -0.04);
      break;
    }
    case 'wedges': {
      sym(() => {
        poly([[0.06, 0.78], [0.2, 0.78], [0.46, 0.2], [0.4, 0.14]], a);
        poly([[0.18, 0.78], [0.28, 0.78], [0.5, 0.36], [0.46, 0.3]], b);
        poly([[0.1, 0.5], [0.16, 0.5], [0.3, 0.1], [0.26, 0.08]], c || b);
      });
      above(0.08, a, 0.02);
      break;
    }
    case 'split': {
      below(0.4, a, 0.08, 0.015); ring(0.4, b, 7, 0.08, 0.015, 3); ring(0.47, b, 3, 0.08, 0.015, 3);
      break;
    }
    case 'solid': {
      ring(0.42, a, 6, 0.07); ring(0.46, b, 3, 0.07); below(0.68, a, 0.04);
      sym(() => poly([[0.2, 0.62], [0.24, 0.62], [0.36, 0.3], [0.33, 0.3]], a));
      break;
    }
    case 'crown': {
      above(0.24, a, 0.06); ring(0.24, b, 6, -0.06); below(0.58, a, 0.06); ring(0.58, c, 5, 0.06);
      sym(() => poly([[0.14, 0.58], [0.2, 0.58], [0.34, 0.26], [0.29, 0.26]], c));
      break;
    }
    case 'swirl': {
      x.lineCap = 'round';
      for (let i = 0; i < 26; i++) ring(0.08 + i * 0.027, i % 4 ? a : b, 2 + (i % 3) * 2, 0.08, 0.04 + rnd() * 0.04, 1 + (i % 3), rnd() * 6.28);
      break;
    }
    case 'marble': {
      x.filter = `blur(${3 * k}px)`;
      for (let i = 0; i < 40; i++) { x.fillStyle = a; x.beginPath(); x.ellipse(rnd() * W, (0.3 + rnd() * 0.5) * H, (20 + rnd() * 60) * k, (10 + rnd() * 30) * k, rnd() * 3, 0, Math.PI * 2); x.fill(); }
      x.filter = 'none'; ring(0.3, b, 5, 0.06); ring(0.34, c, 3, 0.06);
      break;
    }
  }
  // the lower edge: the rubber trim
  x.fillStyle = '#141414'; x.fillRect(0, H * 0.772, W, H * 0.228);
  if (mono) {
    const im = x.getImageData(0, 0, W, H), d = im.data;
    for (let i = 0; i < d.length; i += 4) { const l = Math.max(14, Math.min(205, 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2])); d[i] = d[i + 1] = d[i + 2] = l; }
    x.putImageData(im, 0, 0);
  }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}
