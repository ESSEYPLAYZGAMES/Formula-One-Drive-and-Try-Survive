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
// Every word on a board is set into the free space it has there - between the star and the band, the chevrons, the
// end of the board - never at a fixed size alone: a wordmark sized for one face ran under the emblems in another
// ("UNITED STATES GRAND PRIX" lost its U under the blue band's star, "LAS VEGAS" its L and S under the chevrons, the
// Golden Knights' motto ran through their name), since "Segoe UI", "Helvetica Neue", Arial and a Linux fallback
// differ by a fifth in width and more at weight 900. The fit measures the INK (measureText's actual bounding box:
// the italic overhang and the letter-spacing in it) and shrinks the size, tracking with it, until it clears.
const M = PW * 0.02;   // the clear margin kept between a word and an emblem, a band or the board's end (24 px = 18 cm)
/** set s at `size` (o: weight, italic, font, spacing as at the nominal o.size) and measure its ink: reach left / right of the pen, width, height */
function ink(x, s, size, o) {
  x.font = `${o.italic ? 'italic ' : ''}${o.weight ?? 900} ${size}px ${o.font || F}`; x.textAlign = 'left'; x.textBaseline = 'middle';
  try { x.letterSpacing = `${(o.spacing || 0) * size / o.size}px`; } catch (e) { /* older engines: no tracking, and none measured either */ }
  const m = x.measureText(s);
  return { L: m.actualBoundingBoxLeft, R: m.actualBoundingBoxRight, A: m.actualBoundingBoxAscent, D: m.actualBoundingBoxDescent, w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent };
}
/** the largest size, o.size at most, at which s fits `w` px wide (and o.h tall, given) */
function fitSize(x, s, w, o) {
  let size = o.size;
  for (let k = 0; k < 12; k++) { const m = ink(x, s, size, o), f = Math.min(w / m.w, o.h ? o.h / m.h : 1); if (f >= 1) break; size *= Math.max(0.5, f * 0.995); }
  return size;
}
/**
 * s set in the box x0..x1 (less o.pad at each end) at o.size or smaller, placed by its ink - flush left, flush right
 * or centred (o.align) - with py the middle of the line. o.fixed sets it at exactly that size (one size shared by
 * several lines: fitSize). Returns where the ink lies, { l, r, t, b }, and the size used.
 */
function fit(x, s, x0, x1, py, color, o) {
  const pad = o.pad ?? 0, size = o.fixed ?? fitSize(x, s, x1 - x0 - 2 * pad, o), m = ink(x, s, size, o);
  const px = o.align === 'left' ? x0 + pad + m.L : o.align === 'right' ? x1 - pad - m.R : (x0 + x1) / 2 - (m.R - m.L) / 2;
  x.fillStyle = color; x.fillText(s, px, py);
  try { x.letterSpacing = '0px'; } catch (e) { /* noop */ }
  return { l: px - m.L, r: px + m.R, t: py - m.A, b: py + m.D, size };
}
/** words side by side ([{ s, color, size, weight, ... }]) `gap` px apart: the line centred in x0..x1, scaled down together to fit it */
function row(x, words, x0, x1, py, gap) {
  let k = 1, ws = [];
  for (let n = 0; n < 12; n++) {
    ws = words.map((t) => ink(x, t.s, t.size * k, t).w); const tot = ws.reduce((a, b) => a + b, 0) + gap * k * (words.length - 1);
    if (tot <= x1 - x0) break; k *= Math.max(0.5, (x1 - x0) / tot * 0.995);
  }
  let px = (x0 + x1) / 2 - (ws.reduce((a, b) => a + b, 0) + gap * k * (words.length - 1)) / 2;
  words.forEach((t, i) => { fit(x, t.s, px, px + ws[i], py, t.color, { ...t, fixed: t.size * k, align: 'left' }); px += ws[i] + gap * k; });
}

/** The individual panel painters (each draws into a PW x PH region at 0,0). */
const PANELS = [
  // 0 Heineken 0.0
  (x) => {
    x.fillStyle = '#0c7a3d'; x.fillRect(0, 0, PW * 0.62, PH); x.fillStyle = '#1e5bd6'; x.fillRect(PW * 0.62, 0, PW * 0.38, PH);
    const sx = PW * 0.545, sr = PH * 0.3; star(x, sx, PH * 0.5, sr, '#e8232a');
    fit(x, 'Heineken', PW * 0.04, sx - sr - M, PH * 0.5, '#ffffff', { size: PH * 0.64, weight: 800, italic: true, align: 'left' });
    const z = fit(x, '0.0', PW * 0.62 + M, PW * 0.86, PH * 0.42, '#ffffff', { size: PH * 0.66, align: 'left' });
    fit(x, '%', z.r + PW * 0.012, PW - M, PH * 0.4, '#ffffff', { size: PH * 0.34, weight: 700, align: 'left' });
    fit(x, 'ALCOHOL FREE', PW * 0.62 + M, PW - M, PH * 0.83, '#dbe6ff', { size: PH * 0.17, weight: 700, spacing: 3, align: 'left' });
  },
  // 1 Pirelli P ZERO
  (x) => {
    x.fillStyle = '#ffd500'; x.fillRect(0, 0, PW, PH);
    x.fillStyle = '#111'; x.fillRect(PW * 0.04, PH * 0.18, PW * 0.3, PH * 0.64); x.fillRect(PW * 0.83, PH * 0.3, PW * 0.13, PH * 0.4);
    fit(x, 'P ZERO', PW * 0.04, PW * 0.34, PH * 0.5, '#ffd500', { size: PH * 0.42, pad: M });
    fit(x, 'PIRELLI', PW * 0.34 + M, PW * 0.83 - M, PH * 0.5, '#111', { size: PH * 0.66, spacing: 6 });
    fit(x, 'F1', PW * 0.83, PW * 0.96, PH * 0.5, '#ffd500', { size: PH * 0.3, italic: true, pad: M / 2 });
  },
  // 2 Fabulous Las Vegas (the sparkles in the rows the words leave free above and below them)
  (x) => {
    x.fillStyle = '#4a1d8f'; x.fillRect(0, 0, PW, PH);
    const t = fit(x, 'FABULOUS LAS VEGAS', M, PW - M, PH * 0.52, '#ffffff', { size: PH * 0.6, italic: true, h: PH * 0.42 });
    for (let i = 0; i < 9; i++) { const up = i % 2, room = up ? t.t : PH - t.b; sparkle(x, PW * (0.03 + i * 0.118), up ? room / 2 : PH - room / 2, Math.min(PH * 0.07, room / 2 - 10), i % 3 ? '#ff5ec4' : '#ffd23a'); }
  },
  // 3 LAS VEGAS chevrons
  (x) => {
    x.fillStyle = '#12142a'; x.fillRect(0, 0, PW, PH);
    chevrons(x, PW * 0.02, PH * 0.18, PW * 0.2, PH * 0.64, 4, ['#ff5ec4', '#33e6ff', '#ffffff']);
    chevrons(x, PW * 0.78, PH * 0.18, PW * 0.2, PH * 0.64, 4, ['#33e6ff', '#ff5ec4', '#ffffff']);
    const g = x.createLinearGradient(PW * 0.24, 0, PW * 0.76, 0); g.addColorStop(0, '#ff5ec4'); g.addColorStop(1, '#33e6ff');
    fit(x, 'LAS VEGAS', PW * 0.22 + M, PW * 0.78 - M, PH * 0.52, g, { size: PH * 0.62, spacing: 8 });
  },
  // 4 Vegas Golden Knights (the motto in two lines at the right end, clear of the name)
  (x) => {
    x.fillStyle = '#111114'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#b4975a'; x.fillRect(0, PH * 0.9, PW, PH * 0.1);
    x.strokeStyle = '#b4975a'; x.lineWidth = 6; x.beginPath(); x.moveTo(PW * 0.08, PH * 0.15); x.lineTo(PW * 0.2, PH * 0.15); x.lineTo(PW * 0.2, PH * 0.55); x.lineTo(PW * 0.14, PH * 0.8); x.lineTo(PW * 0.08, PH * 0.55); x.closePath(); x.stroke();
    const mx = PW * 0.7, mo = { size: PH * 0.2, weight: 700, spacing: 3 }, ms = Math.min(fitSize(x, 'THE GREATEST', PW - M - mx, mo), fitSize(x, 'SHOW ON EARTH', PW - M - mx, mo));
    fit(x, 'THE GREATEST', mx, PW - M, PH * 0.34, '#8d8d94', { ...mo, fixed: ms, align: 'right' }); fit(x, 'SHOW ON EARTH', mx, PW - M, PH * 0.62, '#8d8d94', { ...mo, fixed: ms, align: 'right' });
    fit(x, 'VEGAS', PW * 0.25, mx - 2 * M, PH * 0.32, '#b4975a', { size: PH * 0.3, spacing: 6, align: 'left' });
    fit(x, 'GOLDEN KNIGHTS', PW * 0.25, mx - 2 * M, PH * 0.66, '#ffffff', { size: PH * 0.34, spacing: 4, align: 'left' });
  },
  // 5 aramco
  (x) => {
    const g = x.createLinearGradient(0, 0, PW, 0); g.addColorStop(0, '#00a19b'); g.addColorStop(1, '#0d5bb5'); x.fillStyle = g; x.fillRect(0, 0, PW, PH);
    fit(x, 'aramco', PW * 0.27 + M, PW * 0.73 - M, PH * 0.5, '#ffffff', { size: PH * 0.66, weight: 700, spacing: 2 });
    x.fillStyle = '#ffffff'; x.fillRect(PW * 0.13, PH * 0.4, PW * 0.14, 4); x.fillRect(PW * 0.73, PH * 0.4, PW * 0.14, 4);
  },
  // 6 Heineken Silver
  (x) => {
    x.fillStyle = '#1d8a8a'; x.fillRect(0, 0, PW, PH);
    const sx = PW * 0.09, sr = PH * 0.32; star(x, sx, PH * 0.5, sr, '#e8232a');
    fit(x, 'Heineken', sx + sr + M, PW * 0.64 - M, PH * 0.5, '#ffffff', { size: PH * 0.62, weight: 800, italic: true, align: 'left' });
    fit(x, 'SILVER', PW * 0.64, PW - M, PH * 0.5, '#d7f2f0', { size: PH * 0.44, weight: 300, spacing: 10, align: 'left' });
  },
  // 7 "When you drive never drink": the line between its two stars
  (x) => {
    x.fillStyle = '#0c7a3d'; x.fillRect(0, 0, PW, PH);
    const sr = PH * 0.26; star(x, PW * 0.05, PH * 0.5, sr, '#e8232a'); star(x, PW * 0.95, PH * 0.5, sr, '#e8232a');
    fit(x, 'WHEN YOU DRIVE NEVER DRINK', PW * 0.05 + sr + M, PW * 0.95 - sr - M, PH * 0.5, '#ffffff', { size: PH * 0.42, spacing: 2 });
  },
];
/** 8 T-Mobile (the T-Mobile Zone at Sphere: every barrier around the T5-T9 loop) */
PANELS.push((x) => {
  x.fillStyle = '#e20074'; x.fillRect(0, 0, PW, PH);
  const t = fit(x, 'T', PW * 0.035, PW * 0.11, PH * 0.5, '#ffffff', { size: PH * 0.7, align: 'left' });
  x.fillStyle = '#ffffff'; x.fillRect(t.r + 14, PH * 0.44, 12, 12); x.fillRect(t.r + 38, PH * 0.44, 12, 12);
  const m = fit(x, 'Mobile', t.r + 64, PW * 0.45, PH * 0.5, '#ffffff', { size: PH * 0.6, weight: 700, align: 'left' });
  // the zone's name in two lines between the wordmark and the light strip at the board's end
  const x0 = m.r + 2 * M, x1 = PW * 0.985 - M, zo = { size: PH * 0.27, weight: 800, spacing: 4 }, zs = Math.min(fitSize(x, 'T-MOBILE ZONE', x1 - x0, zo), fitSize(x, 'AT SPHERE', x1 - x0, zo));
  fit(x, 'T-MOBILE ZONE', x0, x1, PH * 0.33, '#ffd6ec', { ...zo, fixed: zs }); fit(x, 'AT SPHERE', x0, x1, PH * 0.69, '#ffd6ec', { ...zo, fixed: zs });
  x.fillStyle = 'rgba(255,255,255,0.25)'; x.fillRect(PW * 0.985, 0, PW * 0.015, PH);
});
export const TMOBILE_PANEL = 8;
// 9 SILVERSTONE, 10 British Grand Prix, 11 Qatar Airways (the British GP's title partner): the Silverstone set
PANELS.push((x) => {
  x.fillStyle = '#0b1f4d'; x.fillRect(0, 0, PW, PH);
  x.fillStyle = '#c8102e'; x.fillRect(0, 0, PW * 0.03, PH); x.fillRect(PW * 0.97, 0, PW * 0.03, PH);
  x.fillStyle = '#ffffff'; x.fillRect(PW * 0.03, 0, PW * 0.012, PH); x.fillRect(PW * 0.958, 0, PW * 0.012, PH);
  fit(x, 'SILVERSTONE', PW * 0.042 + M, PW * 0.958 - M, PH * 0.52, '#ffffff', { size: PH * 0.62, spacing: 12 });
});
PANELS.push((x) => {
  x.fillStyle = '#f4f5f7'; x.fillRect(0, 0, PW, PH);
  x.fillStyle = '#c8102e'; x.fillRect(0, PH * 0.84, PW, PH * 0.16); x.fillStyle = '#0b1f4d'; x.fillRect(0, 0, PW, PH * 0.16);
  fit(x, 'BRITISH GRAND PRIX', M, PW - M, PH * 0.5, '#0b1f4d', { size: PH * 0.46, italic: true, spacing: 4, h: PH * 0.56 });
});
PANELS.push((x) => {
  x.fillStyle = '#5c0632'; x.fillRect(0, 0, PW, PH);
  row(x, [{ s: 'QATAR', color: '#ffffff', size: PH * 0.56, weight: 800, spacing: 8 }, { s: 'AIRWAYS', color: '#d9c9d2', size: PH * 0.56, weight: 300, spacing: 8 }], PW * 0.1, PW * 0.9, PH * 0.5, PW * 0.035);
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
  for (const cx of [PW * 0.2, PW * 0.7]) { crown(x, cx, PH * 0.42, PH * 0.5, '#a37e2c'); fit(x, 'ROLEX', cx - PW * 0.12, cx + PW * 0.12, PH * 0.8, '#a37e2c', { size: PH * 0.22, weight: 700, spacing: 4 }); }
});
PANELS.push((x) => {   // 13 Grand Prix du Canada: the flag's red bands at the ends, the name between them
  const bw = PW * 0.13;
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#d52b1e'; x.fillRect(0, 0, bw, PH); x.fillRect(PW - bw, 0, bw, PH);
  maple(x, bw / 2, PH * 0.48, PH * 0.34, '#ffffff'); maple(x, PW - bw / 2, PH * 0.48, PH * 0.34, '#ffffff');
  fit(x, 'GRAND PRIX DU CANADA', bw + M, PW - bw - M, PH * 0.52, '#d52b1e', { size: PH * 0.4, spacing: 3 });
});
PANELS.push((x) => {   // 14 AWS: navy, the white letters and the orange smile
  x.fillStyle = '#232f3e'; x.fillRect(0, 0, PW, PH);
  for (const cx of [PW * 0.25, PW * 0.75]) {
    fit(x, 'aws', cx - PW * 0.18, cx + PW * 0.18, PH * 0.42, '#ffffff', { size: PH * 0.6, weight: 800 });
    x.strokeStyle = '#ff9900'; x.lineWidth = PH * 0.07; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - PH * 0.42, PH * 0.74); x.quadraticCurveTo(cx, PH * 0.94, cx + PH * 0.4, PH * 0.72); x.stroke();
  }
});
PANELS.push((x) => {   // 15 MONTRÉAL
  x.fillStyle = '#0b2a6b'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#d52b1e'; x.fillRect(0, PH * 0.86, PW, PH * 0.14);
  fit(x, 'MONTRÉAL', M, PW - M, PH * 0.46, '#ffffff', { size: PH * 0.6, spacing: 16, h: PH * 0.66 });
});
PANELS.push((x) => {   // 16 the Wall of Champions: the yellow concrete of the last chicane's exit and its welcome
  x.fillStyle = '#f2c230'; x.fillRect(0, 0, PW, PH); x.fillStyle = 'rgba(120,80,0,0.18)'; for (let i = 0; i < 40; i++) x.fillRect(Math.random() * PW, Math.random() * PH, 3 + Math.random() * 30, 2);
  x.fillStyle = 'rgba(30,30,30,0.35)'; for (let i = 0; i < 6; i++) x.fillRect(Math.random() * PW, PH * (0.55 + Math.random() * 0.35), 40 + Math.random() * 160, 3);   // tyre marks: everyone kisses it
  fit(x, 'BIENVENUE AU QUÉBEC', M, PW - M, PH * 0.5, '#1b3f94', { size: PH * 0.42, spacing: 6 });
});
PANELS.push((x) => {   // 17 Lenovo
  x.fillStyle = '#e2231a'; x.fillRect(0, 0, PW, PH);
  fit(x, 'Lenovo', M, PW - M, PH * 0.52, '#ffffff', { size: PH * 0.6, weight: 700, spacing: 2 });
});
PANELS.push((x) => {   // 18 Québec: the flag's cross in a square, the greeting beside it
  x.fillStyle = '#095797'; x.fillRect(0, 0, PW, PH);
  const fx = PW * 0.03, fs = PH * 0.6;
  x.strokeStyle = '#ffffff'; x.lineWidth = 6; x.strokeRect(fx, PH * 0.2, fs, fs); x.beginPath(); x.moveTo(fx + fs / 2, PH * 0.2); x.lineTo(fx + fs / 2, PH * 0.8); x.moveTo(fx, PH * 0.5); x.lineTo(fx + fs, PH * 0.5); x.stroke();
  fit(x, 'BONJOUR QUÉBEC', fx + fs + 3 + M, PW - M, PH * 0.52, '#ffffff', { size: PH * 0.44, weight: 800, spacing: 6 });
});
PANELS.push((x) => {   // 19 Crypto.com
  x.fillStyle = '#0d1b33'; x.fillRect(0, 0, PW, PH);
  fit(x, 'crypto.com', M, PW - M, PH * 0.52, '#ffffff', { size: PH * 0.54, weight: 700, spacing: 2 });
});
export const WOC_PANEL = 16;
PANELS.push((x) => {   // 20 TecPro: red and white blocks, a seam between each, the logo plate on the white ones
  const n = 6, w = PW / n;
  for (let k = 0; k < n; k++) {
    x.fillStyle = k % 2 ? '#f2f2f0' : '#d61f26'; x.fillRect(k * w, 0, w, PH);
    x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(k * w, 0, 4, PH); x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(k * w + 4, 0, w - 8, PH * 0.12);
    if (k % 2) fit(x, 'TECPRO', k * w + 4, (k + 1) * w, PH * 0.55, '#9a9a9a', { size: PH * 0.22, weight: 800, pad: w * 0.1 });
  }
});
export const TECPRO_PANEL = 20;
// ---- Austin (the Circuit of the Americas)
PANELS.push((x) => {   // 21 Archer: black board, the aircraft's silhouette and the white wordmark beside it, twice
  x.fillStyle = '#0a0a0b'; x.fillRect(0, 0, PW, PH);
  const pw = PH * 0.35, gap = M * 1.2, o = { size: PH * 0.5, weight: 800, spacing: 10 };
  for (const [h0, h1] of [[0, PW / 2], [PW / 2, PW]]) {
    // (the aircraft, a gap and the word as one group, centred in its half of the board)
    const size = fitSize(x, 'ARCHER', h1 - h0 - 2 * M - pw - gap, o), w = ink(x, 'ARCHER', size, o).w, a = (h0 + h1) / 2 - (pw + gap + w) / 2;
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(a, PH * 0.5); x.lineTo(a + PH * 0.3, PH * 0.38); x.lineTo(a + pw, PH * 0.5); x.lineTo(a + PH * 0.3, PH * 0.62); x.closePath(); x.fill();
    fit(x, 'ARCHER', a + pw + gap, a + pw + gap + w, PH * 0.53, '#ffffff', { ...o, fixed: size, align: 'left' });
  }
});
PANELS.push((x) => {   // 22 United States Grand Prix: white, the blue and red bands with a star each, the name between them
  const bw = PW * 0.11;
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#0a3161'; x.fillRect(0, 0, bw, PH); x.fillStyle = '#b31942'; x.fillRect(PW - bw, 0, bw, PH);
  star(x, bw / 2, PH * 0.5, PH * 0.3, '#ffffff'); star(x, PW - bw / 2, PH * 0.5, PH * 0.3, '#ffffff');
  fit(x, 'UNITED STATES GRAND PRIX', bw + M, PW - bw - M, PH * 0.53, '#0a3161', { size: PH * 0.38, spacing: 3 });
});
PANELS.push((x) => {   // 23 AUSTIN · TEXAS
  x.fillStyle = '#0a3161'; x.fillRect(0, 0, PW, PH); x.fillStyle = '#b31942'; x.fillRect(0, PH * 0.84, PW, PH * 0.16);
  fit(x, 'AUSTIN · TEXAS', M, PW - M, PH * 0.45, '#ffffff', { size: PH * 0.52, spacing: 12 });
});
PANELS.push((x) => {   // 24 MSC: navy, gold letters
  x.fillStyle = '#04174a'; x.fillRect(0, 0, PW, PH);
  for (const cx of [PW * 0.25, PW * 0.75]) fit(x, 'MSC', cx - PW * 0.2, cx + PW * 0.2, PH * 0.53, '#d6b46a', { size: PH * 0.62, spacing: 8 });
});
PANELS.push((x) => {   // 25 the red, white and blue stripes (the run-offs' colours on the tyre walls)
  const n = 9, w = PW / n; for (let k = 0; k < n; k++) { x.fillStyle = ['#b31942', '#ffffff', '#0a3161'][k % 3]; x.fillRect(k * w, 0, w + 1, PH); }
  star(x, PW * 0.5, PH * 0.5, PH * 0.32, '#ffffff');
});
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
