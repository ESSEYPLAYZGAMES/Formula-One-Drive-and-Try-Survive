// Circuit dressing: the card-suit kerbs, the sponsor panels on every barrier and the "LAS VEGAS" paint on the
// run-off strips outside the braking zones, all drawn on canvases.
import * as THREE from 'three';

const F = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

function canvasTex(c, { repeat = false, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  return t;
}

// ---------------------------------------------------------------------------
// kerbs: red / white blocks, each block carrying a playing-card suit (white suits on red, black suits on white)
// ---------------------------------------------------------------------------
/** Texture tile of 4 kerb blocks (2.5 m each -> 10 m per repeat). u runs across the kerb, v along it. */
export function kerbTexture(style = 'cards') {
  const W = 128, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const suits = ['♠', '♥', '♣', '♦'];
  for (let k = 0; k < 4; k++) {
    const red = k % 2 === 0; const y0 = k * (H / 4);
    x.fillStyle = red ? '#d8262b' : '#f3f1ec'; x.fillRect(0, y0, W, H / 4);
    // paint wear / dirt streaks
    x.fillStyle = red ? 'rgba(80,10,10,0.18)' : 'rgba(60,60,60,0.12)';
    for (let i = 0; i < 6; i++) x.fillRect(Math.random() * W, y0 + Math.random() * H / 4, 2 + Math.random() * 4, 30 + Math.random() * 90);
    if (style !== 'cards') continue;   // 'redwhite': the classic plain kerb of a permanent circuit
    x.save(); x.translate(W / 2, y0 + H / 8); x.rotate(-Math.PI / 2);
    x.fillStyle = red ? '#fbfbfb' : '#161616'; x.font = `900 ${W * 0.78}px ${F}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(suits[k], 0, 6); x.restore();
    // the little drainage squares the real kerbs have
    x.fillStyle = '#111'; x.fillRect(W * 0.78, y0 + H / 8 - 5, 9, 9);
  }
  return canvasTex(c, { repeat: true, aniso: 16 });
}

// ---------------------------------------------------------------------------
// barrier sponsor panels
// ---------------------------------------------------------------------------
const PW = 1200, PH = 160;   // one panel: 1.2 m tall x 9 m long on the wall
function star(x, cx, cy, r, color) {
  x.save(); x.fillStyle = color; x.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  x.closePath(); x.fill(); x.restore();
}
function sparkle(x, cx, cy, r, color) {
  x.save(); x.fillStyle = color; x.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.3 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  x.closePath(); x.fill(); x.restore();
}
function chevrons(x, x0, y0, w, h, n, colors, dir = 1) {
  const cw = w / n;
  for (let i = 0; i < n; i++) {
    const cx = x0 + i * cw; x.fillStyle = colors[i % colors.length]; x.beginPath();
    if (dir > 0) { x.moveTo(cx, y0); x.lineTo(cx + cw * 0.55, y0); x.lineTo(cx + cw, y0 + h / 2); x.lineTo(cx + cw * 0.55, y0 + h); x.lineTo(cx, y0 + h); x.lineTo(cx + cw * 0.45, y0 + h / 2); }
    else { x.moveTo(cx + cw, y0); x.lineTo(cx + cw * 0.45, y0); x.lineTo(cx, y0 + h / 2); x.lineTo(cx + cw * 0.45, y0 + h); x.lineTo(cx + cw, y0 + h); x.lineTo(cx + cw * 0.55, y0 + h / 2); }
    x.closePath(); x.fill();
  }
}
const text = (x, s, px, py, size, color, { weight = 900, italic = false, align = 'left', font = F, spacing = 0 } = {}) => {
  x.fillStyle = color; x.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`; x.textAlign = align; x.textBaseline = 'middle';
  if (spacing) { try { x.letterSpacing = `${spacing}px`; } catch (e) { /* older engines */ } }
  x.fillText(s, px, py); if (spacing) { try { x.letterSpacing = '0px'; } catch (e) { /* noop */ } }
};

/** The individual panel painters (each draws into a PW x PH region at 0,0). */
const PANELS = [
  // 0 Heineken 0.0
  (x) => {
    x.fillStyle = '#0c7a3d'; x.fillRect(0, 0, PW * 0.62, PH); x.fillStyle = '#1e5bd6'; x.fillRect(PW * 0.62, 0, PW * 0.38, PH);
    text(x, 'Heineken', PW * 0.05, PH * 0.5, PH * 0.64, '#ffffff', { weight: 800, italic: true });
    star(x, PW * 0.545, PH * 0.5, PH * 0.3, '#e8232a');
    text(x, '0.0', PW * 0.665, PH * 0.42, PH * 0.66, '#ffffff', { weight: 900 }); text(x, '%', PW * 0.84, PH * 0.4, PH * 0.34, '#ffffff', { weight: 700 });
    text(x, 'ALCOHOL FREE', PW * 0.665, PH * 0.83, PH * 0.17, '#dbe6ff', { weight: 700, spacing: 3 });
  },
  // 1 Pirelli P ZERO
  (x) => {
    x.fillStyle = '#ffd500'; x.fillRect(0, 0, PW, PH);
    x.fillStyle = '#111'; x.fillRect(PW * 0.04, PH * 0.18, PW * 0.3, PH * 0.64);
    text(x, 'P ZERO', PW * 0.19, PH * 0.5, PH * 0.42, '#ffd500', { weight: 900, align: 'center' });
    text(x, 'PIRELLI', PW * 0.4, PH * 0.5, PH * 0.66, '#111', { weight: 900, spacing: 6 });
    x.fillStyle = '#111'; x.fillRect(PW * 0.83, PH * 0.3, PW * 0.13, PH * 0.4); text(x, 'F1', PW * 0.895, PH * 0.5, PH * 0.3, '#ffd500', { align: 'center', italic: true });
  },
  // 2 Fabulous Las Vegas
  (x) => {
    x.fillStyle = '#4a1d8f'; x.fillRect(0, 0, PW, PH);
    for (let i = 0; i < 9; i++) sparkle(x, PW * (0.03 + i * 0.118), PH * (i % 2 ? 0.2 : 0.8), PH * 0.09, i % 3 ? '#ff5ec4' : '#ffd23a');
    text(x, 'FABULOUS LAS VEGAS', PW * 0.5, PH * 0.52, PH * 0.6, '#ffffff', { weight: 900, italic: true, align: 'center' });
  },
  // 3 LAS VEGAS chevrons
  (x) => {
    x.fillStyle = '#12142a'; x.fillRect(0, 0, PW, PH);
    chevrons(x, PW * 0.02, PH * 0.18, PW * 0.24, PH * 0.64, 4, ['#ff5ec4', '#33e6ff', '#ffffff']);
    chevrons(x, PW * 0.74, PH * 0.18, PW * 0.24, PH * 0.64, 4, ['#33e6ff', '#ff5ec4', '#ffffff']);
    const g = x.createLinearGradient(PW * 0.3, 0, PW * 0.7, 0); g.addColorStop(0, '#ff5ec4'); g.addColorStop(1, '#33e6ff');
    text(x, 'LAS VEGAS', PW * 0.5, PH * 0.52, PH * 0.62, g, { weight: 900, align: 'center', spacing: 8 });
  },
  // 4 Vegas Golden Knights
  (x) => {
    x.fillStyle = '#111114'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#b4975a'; x.fillRect(0, PH * 0.9, PW, PH * 0.1);
    x.strokeStyle = '#b4975a'; x.lineWidth = 6; x.beginPath(); x.moveTo(PW * 0.08, PH * 0.15); x.lineTo(PW * 0.2, PH * 0.15); x.lineTo(PW * 0.2, PH * 0.55); x.lineTo(PW * 0.14, PH * 0.8); x.lineTo(PW * 0.08, PH * 0.55); x.closePath(); x.stroke();
    text(x, 'VEGAS', PW * 0.25, PH * 0.32, PH * 0.3, '#b4975a', { weight: 900, spacing: 6 });
    text(x, 'GOLDEN KNIGHTS', PW * 0.25, PH * 0.66, PH * 0.34, '#ffffff', { weight: 900, spacing: 4 });
    text(x, 'THE GREATEST SHOW ON EARTH', PW * 0.97, PH * 0.5, PH * 0.16, '#8d8d94', { weight: 700, align: 'right', spacing: 3 });
  },
  // 5 aramco
  (x) => {
    const g = x.createLinearGradient(0, 0, PW, 0); g.addColorStop(0, '#00a19b'); g.addColorStop(1, '#0d5bb5'); x.fillStyle = g; x.fillRect(0, 0, PW, PH);
    text(x, 'aramco', PW * 0.5, PH * 0.5, PH * 0.66, '#ffffff', { weight: 700, align: 'center', spacing: 2 });
    x.fillStyle = '#ffffff'; x.fillRect(PW * 0.13, PH * 0.4, PW * 0.14, 4); x.fillRect(PW * 0.73, PH * 0.4, PW * 0.14, 4);
  },
  // 6 Heineken Silver
  (x) => {
    x.fillStyle = '#1d8a8a'; x.fillRect(0, 0, PW, PH);
    star(x, PW * 0.09, PH * 0.5, PH * 0.32, '#e8232a');
    text(x, 'Heineken', PW * 0.17, PH * 0.5, PH * 0.62, '#ffffff', { weight: 800, italic: true });
    text(x, 'SILVER', PW * 0.66, PH * 0.5, PH * 0.44, '#d7f2f0', { weight: 300, spacing: 10 });
  },
  // 7 "When you drive never drink"
  (x) => {
    x.fillStyle = '#0c7a3d'; x.fillRect(0, 0, PW, PH);
    star(x, PW * 0.05, PH * 0.5, PH * 0.26, '#e8232a');
    text(x, 'WHEN YOU DRIVE NEVER DRINK', PW * 0.1, PH * 0.5, PH * 0.42, '#ffffff', { weight: 900, spacing: 2 });
    star(x, PW * 0.95, PH * 0.5, PH * 0.26, '#e8232a');
  },
];
/** 8 T-Mobile (the T-Mobile Zone at Sphere: every barrier around the T5-T9 loop) */
PANELS.push((x) => {
  x.fillStyle = '#e20074'; x.fillRect(0, 0, PW, PH);
  text(x, 'T', PW * 0.045, PH * 0.5, PH * 0.7, '#ffffff', { weight: 900 });
  x.fillStyle = '#ffffff'; x.fillRect(PW * 0.115, PH * 0.44, 12, 12); x.fillRect(PW * 0.135, PH * 0.44, 12, 12);
  text(x, 'Mobile', PW * 0.155, PH * 0.5, PH * 0.6, '#ffffff', { weight: 700 });
  text(x, 'T-MOBILE ZONE AT SPHERE', PW * 0.62, PH * 0.5, PH * 0.3, '#ffd6ec', { weight: 800, spacing: 4 });
  x.fillStyle = 'rgba(255,255,255,0.25)'; x.fillRect(PW * 0.985, 0, PW * 0.015, PH);
});
export const TMOBILE_PANEL = 8;
// 9 SILVERSTONE, 10 British Grand Prix, 11 Qatar Airways (the British GP's title partner): the Silverstone set
PANELS.push((x) => {
  x.fillStyle = '#0b1f4d'; x.fillRect(0, 0, PW, PH);
  x.fillStyle = '#c8102e'; x.fillRect(0, 0, PW * 0.03, PH); x.fillRect(PW * 0.97, 0, PW * 0.03, PH);
  x.fillStyle = '#ffffff'; x.fillRect(PW * 0.03, 0, PW * 0.012, PH); x.fillRect(PW * 0.958, 0, PW * 0.012, PH);
  text(x, 'SILVERSTONE', PW * 0.5, PH * 0.52, PH * 0.62, '#ffffff', { weight: 900, align: 'center', spacing: 12 });
});
PANELS.push((x) => {
  x.fillStyle = '#f4f5f7'; x.fillRect(0, 0, PW, PH);
  x.fillStyle = '#c8102e'; x.fillRect(0, PH * 0.84, PW, PH * 0.16); x.fillStyle = '#0b1f4d'; x.fillRect(0, 0, PW, PH * 0.16);
  text(x, 'BRITISH GRAND PRIX', PW * 0.5, PH * 0.5, PH * 0.46, '#0b1f4d', { weight: 900, align: 'center', italic: true, spacing: 4 });
});
PANELS.push((x) => {
  x.fillStyle = '#5c0632'; x.fillRect(0, 0, PW, PH);
  text(x, 'QATAR', PW * 0.2, PH * 0.5, PH * 0.56, '#ffffff', { weight: 800, spacing: 8 });
  text(x, 'AIRWAYS', PW * 0.53, PH * 0.5, PH * 0.56, '#d9c9d2', { weight: 300, spacing: 8 });
});
// 12 Rolex, 13 Grand Prix du Canada, 14 AWS, 15 MONTRÉAL, 16 the Wall of Champions' yellow, 17 Lenovo, 18 Tourisme
// Québec, 19 Crypto.com: the Montreal set (the walls of Ile Notre-Dame as the TV pictures show them)
function crown(x, cx, cy, h, color) {
  x.save(); x.fillStyle = color; x.beginPath();
  const w = h * 1.25, b = cy + h * 0.32;
  x.moveTo(cx - w * 0.42, b); x.lineTo(cx - w * 0.5, cy - h * 0.18);
  for (let k = 0; k < 5; k++) { const px = cx - w * 0.5 + k * w * 0.25; x.lineTo(px + w * 0.06, cy - h * 0.05); x.lineTo(px + w * 0.125, cy - h * (k === 2 ? 0.5 : 0.36)); }
  x.lineTo(cx + w * 0.42, b); x.closePath(); x.fill();
  for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(cx - w * 0.5 + w * 0.125 + k * w * 0.25 - w * 0.0, cy - h * (k === 2 ? 0.58 : 0.44), h * 0.07, 0, Math.PI * 2); x.fill(); }
  x.fillRect(cx - w * 0.42, b + h * 0.05, w * 0.84, h * 0.1);
  x.restore();
}
function maple(x, cx, cy, r, color) {
  // the eleven-point leaf of the flag, as a polygon (unit coordinates, y down)
  const P = [[0, -1], [0.14, -0.72], [0.3, -0.8], [0.25, -0.38], [0.52, -0.62], [0.58, -0.48], [0.86, -0.54], [0.76, -0.24], [0.9, -0.16], [0.46, 0.2], [0.52, 0.36], [0.06, 0.3], [0.08, 0.78], [-0.08, 0.78], [-0.06, 0.3], [-0.52, 0.36], [-0.46, 0.2], [-0.9, -0.16], [-0.76, -0.24], [-0.86, -0.54], [-0.58, -0.48], [-0.52, -0.62], [-0.25, -0.38], [-0.3, -0.8], [-0.14, -0.72]];
  x.save(); x.fillStyle = color; x.beginPath(); P.forEach(([px, py], k) => (k ? x.lineTo : x.moveTo).call(x, cx + px * r, cy + py * r)); x.closePath(); x.fill(); x.restore();
}
PANELS.push((x) => {   // 12 Rolex: the green board with the gold crown
  x.fillStyle = '#006039'; x.fillRect(0, 0, PW, PH);
  crown(x, PW * 0.2, PH * 0.42, PH * 0.5, '#a37e2c'); text(x, 'ROLEX', PW * 0.2, PH * 0.8, PH * 0.22, '#a37e2c', { weight: 700, align: 'center', spacing: 4 });
  crown(x, PW * 0.7, PH * 0.42, PH * 0.5, '#a37e2c'); text(x, 'ROLEX', PW * 0.7, PH * 0.8, PH * 0.22, '#a37e2c', { weight: 700, align: 'center', spacing: 4 });
});
PANELS.push((x) => {   // 13 Grand Prix du Canada
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#d52b1e'; x.fillRect(0, 0, PW * 0.16, PH); x.fillRect(PW * 0.84, 0, PW * 0.16, PH);
  maple(x, PW * 0.08, PH * 0.48, PH * 0.34, '#ffffff'); maple(x, PW * 0.92, PH * 0.48, PH * 0.34, '#ffffff');
  text(x, 'GRAND PRIX DU CANADA', PW * 0.5, PH * 0.52, PH * 0.4, '#d52b1e', { weight: 900, align: 'center', spacing: 3 });
});
PANELS.push((x) => {   // 14 AWS: navy, the white letters and the orange smile
  x.fillStyle = '#232f3e'; x.fillRect(0, 0, PW, PH);
  for (const cx of [PW * 0.25, PW * 0.75]) {
    text(x, 'aws', cx, PH * 0.42, PH * 0.6, '#ffffff', { weight: 800, align: 'center' });
    x.strokeStyle = '#ff9900'; x.lineWidth = PH * 0.07; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - PH * 0.42, PH * 0.74); x.quadraticCurveTo(cx, PH * 0.94, cx + PH * 0.4, PH * 0.72); x.stroke();
  }
});
PANELS.push((x) => {   // 15 MONTRÉAL
  x.fillStyle = '#0b2a6b'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#d52b1e'; x.fillRect(0, PH * 0.86, PW, PH * 0.14);
  text(x, 'MONTRÉAL', PW * 0.5, PH * 0.46, PH * 0.6, '#ffffff', { weight: 900, align: 'center', spacing: 16 });
});
PANELS.push((x) => {   // 16 the Wall of Champions: the yellow concrete of the last chicane's exit and its welcome
  x.fillStyle = '#f2c230'; x.fillRect(0, 0, PW, PH); x.fillStyle = 'rgba(120,80,0,0.18)'; for (let i = 0; i < 40; i++) x.fillRect(Math.random() * PW, Math.random() * PH, 3 + Math.random() * 30, 2);
  x.fillStyle = 'rgba(30,30,30,0.35)'; for (let i = 0; i < 6; i++) x.fillRect(Math.random() * PW, PH * (0.55 + Math.random() * 0.35), 40 + Math.random() * 160, 3);   // tyre marks: everyone kisses it
  text(x, 'BIENVENUE AU QUÉBEC', PW * 0.5, PH * 0.5, PH * 0.42, '#1b3f94', { weight: 900, align: 'center', spacing: 6 });
});
PANELS.push((x) => {   // 17 Lenovo
  x.fillStyle = '#e2231a'; x.fillRect(0, 0, PW, PH);
  text(x, 'Lenovo', PW * 0.5, PH * 0.52, PH * 0.6, '#ffffff', { weight: 700, align: 'center', spacing: 2 });
});
PANELS.push((x) => {   // 18 Québec
  x.fillStyle = '#095797'; x.fillRect(0, 0, PW, PH);
  x.strokeStyle = '#ffffff'; x.lineWidth = 6; x.strokeRect(PW * 0.03, PH * 0.2, PH * 0.6, PH * 0.6); x.beginPath(); x.moveTo(PW * 0.03 + PH * 0.3, PH * 0.2); x.lineTo(PW * 0.03 + PH * 0.3, PH * 0.8); x.moveTo(PW * 0.03, PH * 0.5); x.lineTo(PW * 0.03 + PH * 0.6, PH * 0.5); x.stroke();
  text(x, 'BONJOUR QUÉBEC', PW * 0.55, PH * 0.52, PH * 0.44, '#ffffff', { weight: 800, align: 'center', spacing: 6 });
});
PANELS.push((x) => {   // 19 Crypto.com
  x.fillStyle = '#0d1b33'; x.fillRect(0, 0, PW, PH);
  text(x, 'crypto.com', PW * 0.5, PH * 0.52, PH * 0.54, '#ffffff', { weight: 700, align: 'center', spacing: 2 });
});
export const WOC_PANEL = 16;
/** sponsor per 180 m wall zone (both sides use the same sequence, offset on the right so they don't mirror) */
export const ZONE_SEQ = [0, 3, 1, 2, 0, 4, 5, 7, 1, 6, 0, 2, 3, 0, 1, 5];
export const ZONE_LEN = 180;
export const PANEL_LEN = 9;   // metres of wall per panel

/**
 * One repeating texture per sponsor panel, rotated so that u runs up the wall and the panel reads
 * left-to-right in the direction of DEcreasing v. Wall ribbons therefore use v = -s/PANEL_LEN on the left
 * barrier (a viewer on the track has +s to their right) and v = +s/PANEL_LEN on the right barrier.
 */
export function barrierPanels() {
  return PANELS.map((paint) => canvasTex(panelCanvas(paint), { repeat: true, aniso: 16 }));
}
function panelCanvas(paint) {
  const c = document.createElement('canvas'); c.width = PH; c.height = PW; const x = c.getContext('2d');
  x.save(); x.translate(PH, 0); x.rotate(Math.PI / 2);   // panel (px, py) -> texture (PH - py, px)
  paint(x);
  x.fillStyle = 'rgba(0,0,0,0.55)'; x.fillRect(0, 0, 7, PH); x.fillRect(PW - 7, 0, 7, PH);   // dark seams between panels
  x.restore();
  return c;
}
/**
 * Every sponsor panel in one texture: the panels side by side along u (the wall's height), v repeating along the
 * wall. One material for all the barrier branding: a stretch of wall is one draw call whatever its sponsors.
 * Use atlasU(k, u) for the u of panel k.
 */
export const PANEL_COUNT = PANELS.length;
export function barrierAtlas() {
  const n = PANELS.length, c = document.createElement('canvas'); c.width = PH * n; c.height = PW; const x = c.getContext('2d');
  PANELS.forEach((paint, k) => x.drawImage(panelCanvas(paint), k * PH, 0));
  const t = canvasTex(c, { repeat: true, aniso: 16 }); t.wrapS = THREE.ClampToEdgeWrapping; return t;
}
export const atlasU = (k, u) => (k + 0.03 + u * 0.94) / PANELS.length;   // a few texels in from each tile edge (no bleed from the neighbours)

// ---------------------------------------------------------------------------
// paint on the run-off strips (never on the racing surface)
// ---------------------------------------------------------------------------
export const RUNOFF_DECAL_LEN = 22;   // metres of run-off one "LAS VEGAS" occupies (the strip is ~2.8 m wide)
/**
 * "LAS VEGAS" in the pink-to-cyan event gradient, drawn along the long axis of a 256 x 2048 canvas so it maps onto
 * a 2.8 x 22 m run-off strip (u across the strip, v along it). The text is scaled to fit with a margin, so it can
 * never be clipped. `mirror` flips the reading direction (the two sides of the road need opposite directions to
 * read left-to-right from outside the barrier).
 */
export function runoffTextTexture(label = 'LAS VEGAS', mirror = false) {
  const W = 256, H = 2048, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.clearRect(0, 0, W, H);
  x.save(); x.translate(W / 2, H / 2);
  x.rotate(Math.PI / 2);                              // text runs along the strip
  if (mirror) x.scale(-1, 1);                         // reversed reading direction for the other side
  x.scale(1, -1);                                     // letters' tops point toward the road (u = 0 edge)
  const size = W * 0.78;
  x.font = `900 ${size}px ${F}`; try { x.letterSpacing = '30px'; } catch (e) { /* older engines */ }
  if (String(label).includes('\n')) x.font = `900 ${size * 0.5}px ${F}`;
  const len = Math.max(...String(label).split('\n').map((r) => x.measureText(r).width)); const fit = Math.min(1, (H * 0.92) / len); x.scale(fit, fit);
  const g = x.createLinearGradient(-len / 2, 0, len / 2, 0);
  if (label.startsWith('WALL OF')) { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffffff'); }
  else if (label === 'LAS VEGAS') { g.addColorStop(0, '#ff5ec4'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#33e6ff'); }
  else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e8eef8'); }   // plain white paint elsewhere
  x.fillStyle = g; x.textAlign = 'center'; x.textBaseline = 'middle';
  // two lines ('WALL OF\nCHAMPIONS'): stacked across the strip, each at half the height
  const rows = String(label).split('\n');
  if (rows.length > 1) { x.font = `900 ${size * 0.5}px ${F}`; rows.forEach((r, i) => x.fillText(r, 0, (i - (rows.length - 1) / 2) * size * 0.56)); }
  else x.fillText(label, 0, 0);
  x.restore();
  return canvasTex(c);
}
