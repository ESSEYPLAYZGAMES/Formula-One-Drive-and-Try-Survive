// Canvas-drawn Sphere content (projected on the track-facing hemisphere, mirrored onto the far side for
// two-sided shows): the golden emoji, its Grand Prix helmet variant and the "Welcome to Fabulous Las Vegas"
// neon sign. Backgrounds are flat so the canvas edge, the far side and the poles all share one colour.
// Layout note: the shader stretches the canvas over the VISIBLE part of the shell only (canvas bottom = ground
// level, canvas top = the top of the Sphere), so the whole canvas is above ground; nothing is buried.
import * as THREE from 'three';

const SIZE = 1024;
/** the shell's normal.y where it meets its base (world/Landmarks.js: an 8.5 m base under a 78.5 m shell centred 33.5 m up) */
export const SPHERE_UG = (8.5 - 33.5) / 78.5;
export const SHOW_BG = { smiley: 0xf7b21c, helmet: 0xdbeeff, sign: 0x05061a, marquee: 0x9b0f2e, champion: 0x080b16, sponsor: 0x1d3cf0, gp: 0xc8102e };
/** how many faces each show is repeated on around the Sphere (1 = one-sided, 2 = front/back, 4 = quadrants) */
export const SIDES = { smiley: 2, helmet: 2, sign: 4, marquee: 2, champion: 2, sponsor: 2, gp: 2 };

export class SphereShow {
  constructor() {
    this.canvas = document.createElement('canvas'); this.canvas.width = this.canvas.height = SIZE;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas); this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.last = -1; this.lastMode = null;
    this.stars = Array.from({ length: 160 }, () => [Math.random() * SIZE, Math.random() * SIZE, 1 + Math.random() * 2.5, Math.random() * 6.28]);
  }

  /** mode: 'smiley' | 'helmet' | 'sign' | 'marquee'; t seconds */
  draw(mode, t) {
    if (mode === this.lastMode && t - this.last < 0.05) return;
    this.last = t; this.lastMode = mode;
    const c = this.ctx; c.setTransform(1, 0, 0, 1, 0, 0);
    if (mode === 'sign') this.sign(c, t); else if (mode === 'marquee') this.marquee(c, t); else if (mode === 'helmet') this.helmet(c, t); else if (mode === 'champion') this.champion(c, t, this.championInfo); else if (mode === 'sponsor') this.sponsor(c, t); else if (mode === 'gp') this.gp(c, t); else this.face(c, t, false);
    this.texture.needsUpdate = true;
  }

  // ---- race-end tribute: "RACE WINNER" / "POLE POSITION" with the driver, the team and the number, in the team's
  //      colours on a dark gold-lit field (as the Sphere did for the 2024 champion) --------------------------------
  champion(c, t, info) {
    const S = SIZE, cx = S * 0.5; info = info || { title: 'RACE WINNER', name: 'Driver', team: 'Team', number: 1, color: '#e10600', color2: '#ffffff' };
    const bg = c.createLinearGradient(0, 0, 0, S); bg.addColorStop(0, '#05070f'); bg.addColorStop(1, '#0b1020');
    c.fillStyle = bg; c.fillRect(0, 0, S, S);
    // golden light rays from the bottom
    c.save(); c.globalAlpha = 0.16; for (let i = 0; i < 18; i++) { const a = -Math.PI * (0.15 + 0.7 * i / 17) + Math.sin(t * 0.3 + i) * 0.02; c.strokeStyle = i % 2 ? '#ffd76a' : info.color; c.lineWidth = 60; c.beginPath(); c.moveTo(cx, S * 0.98); c.lineTo(cx + Math.cos(a) * S, S * 0.98 + Math.sin(a) * S); c.stroke(); } c.restore();
    // team colour side panels
    c.fillStyle = info.color; c.fillRect(0, S * 0.36, S * 0.09, S * 0.3); c.fillRect(S * 0.91, S * 0.36, S * 0.09, S * 0.3);
    c.fillStyle = info.color2; c.fillRect(S * 0.09, S * 0.36, S * 0.012, S * 0.3); c.fillRect(S * 0.898, S * 0.36, S * 0.012, S * 0.3);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.font = `700 ${S * 0.034}px "Segoe UI", Arial, sans-serif`; c.fillText('2026  LAS VEGAS  GRAND PRIX', cx, S * 0.16);
    // big gold title with a dark outline
    c.save(); c.shadowColor = '#c89b2a'; c.shadowBlur = 30; c.lineWidth = 8; c.strokeStyle = '#3a2a08';
    const tg = c.createLinearGradient(0, S * 0.22, 0, S * 0.34); tg.addColorStop(0, '#fff2b0'); tg.addColorStop(0.5, '#e9b949'); tg.addColorStop(1, '#a9761a');
    c.font = `italic 900 ${S * 0.1}px "Segoe UI", Arial Black, sans-serif`; c.strokeText(info.title, cx, S * 0.28); c.fillStyle = tg; c.fillText(info.title, cx, S * 0.28); c.restore();
    // huge faint number behind the name
    c.save(); c.globalAlpha = 0.14; c.fillStyle = info.color2; c.font = `italic 900 ${S * 0.42}px "Segoe UI", Arial Black, sans-serif`; c.fillText(String(info.number), cx, S * 0.55); c.restore();
    // driver name (fit to width) and team band
    c.fillStyle = '#ffffff'; let size = S * 0.085; c.font = `900 ${size}px "Segoe UI", Arial, sans-serif`;
    const w = c.measureText(info.name.toUpperCase()).width; if (w > S * 0.74) { size *= S * 0.74 / w; c.font = `900 ${size}px "Segoe UI", Arial, sans-serif`; }
    c.fillText(info.name.toUpperCase(), cx, S * 0.5);
    c.fillStyle = info.color; this.rrect(c, S * 0.24, S * 0.585, S * 0.52, S * 0.085, 16); c.fill();
    const lum = 0.299 * parseInt(info.color.slice(1, 3), 16) + 0.587 * parseInt(info.color.slice(3, 5), 16) + 0.114 * parseInt(info.color.slice(5, 7), 16);
    c.fillStyle = lum > 150 ? '#101218' : '#ffffff'; c.font = `800 ${S * 0.042}px "Segoe UI", Arial, sans-serif`; c.fillText(info.team.toUpperCase(), cx, S * 0.63);
    // sparkles
    for (let i = 0; i < 26; i++) { const x = (i * 199) % S, y = (i * 313) % (S * 0.75); if (Math.abs(x - cx) < S * 0.36 && y > S * 0.2 && y < S * 0.68) continue; this.sparkle(c, x, y, 8 + (i % 3) * 5, i % 2 ? '#ffd76a' : '#ffffff', 0.5 + 0.5 * Math.sin(t * 2.5 + i)); }
  }

  // ---- race week (the aerial at sunset, 2024): the shell red, a white triangular lattice over all of it, and on its face
  //      the race's title in a dark panel - FORMULA 1 / HEINEKEN SILVER / LAS VEGAS / GRAND PRIX under the F1 mark ----
  gp(c, t) {
    const S = SIZE; c.fillStyle = '#c8102e'; c.fillRect(0, 0, S, S);
    const g = c.createRadialGradient(S * 0.5, S * 0.45, S * 0.1, S * 0.5, S * 0.5, S * 0.8); g.addColorStop(0, 'rgba(255,90,110,0.35)'); g.addColorStop(1, 'rgba(90,0,20,0.25)'); c.fillStyle = g; c.fillRect(0, 0, S, S);
    // (the lattice: rows of triangles, its lines white and lit, a slow sparkle running along them)
    const a = S / 9, h = a * 0.866; c.strokeStyle = 'rgba(255,240,245,0.95)'; c.lineWidth = 4;
    for (let r = -1; r * h < S + h; r++) {
      const y = r * h, off = (r % 2) * a / 2; c.beginPath(); c.moveTo(0, y); c.lineTo(S, y); c.stroke();
      for (let k = -1; k * a < S + a; k++) { const x = k * a + off; c.beginPath(); c.moveTo(x, y); c.lineTo(x + a / 2, y + h); c.moveTo(x, y); c.lineTo(x - a / 2, y + h); c.stroke(); }
    }
    for (let k = 0; k < 14; k++) { const x = ((k * 211 + t * 60) % S), y = (k * 137) % S; this.sparkle(c, x, y, 10, '#ffffff', 0.5 + 0.5 * Math.sin(t * 3 + k)); }
    // (the panel: dark, rounded, the title in white, the F1 mark and the red star)
    const px = S * 0.24, py = S * 0.33, pw = S * 0.52, ph = S * 0.34;
    c.fillStyle = 'rgba(20,4,10,0.92)'; this.rrect(c, px, py, pw, ph, S * 0.03); c.fill(); c.strokeStyle = '#ff2d4a'; c.lineWidth = 6; c.stroke();
    c.fillStyle = '#e10600'; c.font = `italic 900 ${S * 0.06}px "Segoe UI", Arial, sans-serif`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('F1', px + pw * 0.06, py + ph * 0.14);
    c.fillStyle = '#d6001c'; c.beginPath(); for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? S * 0.011 : S * 0.026; c.lineTo(px + pw * 0.56 + Math.cos(an) * rr, py + ph * 0.14 + Math.sin(an) * rr); } c.closePath(); c.fill();
    c.fillStyle = '#ffffff'; c.font = `italic 700 ${S * 0.03}px Georgia, serif`; c.fillText('Heineken', px + pw * 0.62, py + ph * 0.12); c.font = `700 ${S * 0.016}px "Segoe UI", Arial, sans-serif`; c.fillText('S I L V E R', px + pw * 0.64, py + ph * 0.2);
    c.font = `900 ${S * 0.045}px "Segoe UI", Arial, sans-serif`;
    ['FORMULA 1', 'HEINEKEN SILVER', 'LAS VEGAS', 'GRAND PRIX'].forEach((l, i) => c.fillText(l, px + pw * 0.06, py + ph * (0.33 + i * 0.18)));
  }

  // ---- race weekend: the sponsor's takeover (the 2024 onboards: the shell royal blue, LED-bright, the Red Bull mark -
  //      the yellow sun between the two charging bulls - and the name across its face; a slow shimmer runs over it) ----
  sponsor(c, t) {
    const S = SIZE, cx = S * 0.5, cy = S * 0.5;
    const g = c.createRadialGradient(cx, cy * 0.9, S * 0.05, cx, cy, S * 0.75); g.addColorStop(0, '#3a63ff'); g.addColorStop(1, '#1d3cf0'); c.fillStyle = g; c.fillRect(0, 0, S, S);
    c.save(); c.globalAlpha = 0.12; c.fillStyle = '#ffffff'; for (let k = 0; k < 6; k++) { const x = ((t * 40 + k * 190) % (S + 200)) - 100; c.fillRect(x, 0, 40, S); } c.restore();
    const sy = cy * 0.82; c.fillStyle = '#ffcc00'; c.beginPath(); c.arc(cx, sy, S * 0.09, 0, 6.283); c.fill();
    c.fillStyle = '#d6001c';
    for (const d of [-1, 1]) { c.beginPath(); c.moveTo(cx + d * S * 0.05, sy + S * 0.02); c.lineTo(cx + d * S * 0.25, sy - S * 0.07); c.lineTo(cx + d * S * 0.27, sy + S * 0.07); c.lineTo(cx + d * S * 0.07, sy + S * 0.09); c.closePath(); c.fill(); }
    c.font = `italic 900 ${S * 0.13}px "Segoe UI", Arial, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = S * 0.012; c.strokeStyle = '#ffffff'; c.strokeText('Red Bull', cx, cy * 1.22); c.fillText('Red Bull', cx, cy * 1.22);
  }

  // ---- the Grand Prix helmet emoji (the Sphere at race week): the face in its race helmet - emoji() ----------------
  helmet(c, t) { this.emoji(c, t, true); }

  // ---- old-Vegas marquee: the chaotic casino-sign look (red field, golden bulb fans, purple ribbons, a
  //      vertical VEGAS blade with chasing bulbs, sparkles everywhere) ------------------------------------
  marquee(c, t) {
    const S = SIZE, cx = S * 0.5, cy = S * 0.5;
    c.fillStyle = '#9b0f2e'; c.fillRect(0, 0, S, S);
    // golden bulb fans radiating from the bottom corners and the centre (like the sign's sunburst trim)
    const fan = (fx, fy, r0, r1, a0, a1, rays) => {
      for (let i = 0; i <= rays; i++) {
        const a = a0 + (a1 - a0) * i / rays; const on = (i + Math.floor(t * 6)) % 3 === 0;
        c.strokeStyle = on ? '#fff0a8' : '#e0a72c'; c.lineWidth = on ? 9 : 5; c.beginPath(); c.moveTo(fx + Math.cos(a) * r0, fy + Math.sin(a) * r0); c.lineTo(fx + Math.cos(a) * r1, fy + Math.sin(a) * r1); c.stroke();
        for (let k = 0; k < 5; k++) { const rr = r0 + (r1 - r0) * (k + 0.5) / 5; c.fillStyle = ((k + i + Math.floor(t * 4)) % 2) ? '#fff3b0' : '#ffb400'; c.beginPath(); c.arc(fx + Math.cos(a) * rr, fy + Math.sin(a) * rr, 7, 0, 6.28); c.fill(); }
      }
    };
    fan(S * 0.12, S * 0.78, S * 0.08, S * 0.36, -1.6, 0.2, 9);
    fan(S * 0.88, S * 0.78, S * 0.08, S * 0.36, 2.9, 4.7, 9);
    fan(cx, S * 0.9, S * 0.3, S * 0.52, 3.5, 5.9, 12);
    // purple / blue neon ribbons swooshing across the field
    for (let k = 0; k < 4; k++) {
      c.strokeStyle = k % 2 ? '#7a3cff' : '#2f7bff'; c.lineWidth = 26 - k * 4; c.shadowColor = c.strokeStyle; c.shadowBlur = 20;
      c.beginPath(); c.moveTo(-40, S * (0.25 + k * 0.12)); c.bezierCurveTo(S * 0.3, S * (0.05 + k * 0.12) + Math.sin(t + k) * 20, S * 0.7, S * (0.45 + k * 0.12), S + 40, S * (0.2 + k * 0.12)); c.stroke();
    }
    c.shadowBlur = 0;
    // the vertical VEGAS blade in the middle: gold frame, chasing bulbs, red letters on cream
    const bw = S * 0.2, bh = S * 0.72, bx = cx - bw / 2, by = cy - bh / 2;
    c.fillStyle = '#e0a72c'; this.rrect(c, bx - 18, by - 18, bw + 36, bh + 36, 30); c.fill();
    c.fillStyle = '#fff4d6'; this.rrect(c, bx, by, bw, bh, 22); c.fill();
    const bulbs = 34;
    for (let i = 0; i < bulbs; i++) {
      const u = i / bulbs; const on = (i + Math.floor(t * 8)) % 4 === 0;
      for (const sx of [bx - 9, bx + bw + 9]) { c.fillStyle = on ? '#fffbe0' : '#ff9a00'; c.beginPath(); c.arc(sx, by + u * bh + 10, on ? 9 : 6, 0, 6.28); c.fill(); }
    }
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#d5122f'; c.font = `900 ${S * 0.12}px "Segoe UI", Arial Black, sans-serif`;
    'VEGAS'.split('').forEach((ch, i) => c.fillText(ch, cx, by + bh * (0.12 + i * 0.19)));
    // side words and sparkles
    c.save(); c.fillStyle = '#ffd23a'; c.shadowColor = '#ffb400'; c.shadowBlur = 18; c.font = `italic 900 ${S * 0.07}px Georgia, serif`;
    c.fillText('Fabulous', S * 0.22, S * 0.2); c.fillText('Fabulous', S * 0.78, S * 0.2); c.restore();
    for (let i = 0; i < 40; i++) { const x = (i * 263) % S, y = (i * 419) % S; if (Math.abs(x - cx) < bw * 0.8) continue; this.sparkle(c, x, y, 10 + (i % 4) * 5, i % 3 ? '#fff3b0' : '#ff5ec4', 0.5 + 0.5 * Math.sin(t * 3 + i)); }
    // playing-card suits scattered along the bottom band
    c.fillStyle = '#fff4d6'; c.font = `${S * 0.06}px serif`;
    '♠♥♣♦♠♥♣♦'.split('').forEach((ch, i) => c.fillText(ch, S * (0.06 + i * 0.125), S * 0.93 + Math.sin(t * 2 + i) * 6));
  }

  // ---- the Sphere's emoji (its signature show) and its race-week helmet --------------------------------------------
  face(c, t, helmet) { this.emoji(c, t, !!helmet); }

  /**
   * The emoji as the Sphere shows it (the photos): glossy yellow, two tall white eyes with big black pupils, thick
   * dark-brown brows, a small mouth - its expressions in turn (a sly smile, wide-eyed awe with an "o", one brow up and
   * curious, a happy squint), blinking now and then, its eyes following the car (this.look: -1..1 across, down < 0).
   * Drawn in the shell's own measure: the canvas lies on the visible shell front-on (x = the shell's sideways unit r,
   * y = its height n.y from the base's top at UG to the crown at 1 - world/Landmarks.js sphereShader), so shapes drawn in
   * those units come out round on the Sphere. helmet: in its race helmet - the sky-blue shell, the white visor band with
   * LAS VEGAS GRAND PRIX, the navy crown panel with the red F1 and its wave lines, the visor pivots, the chin guard.
   */
  emoji(c, t, helmet) {
    const S = SIZE, UG = SPHERE_UG, ax = 0.62 * S, ay = 0.96 * S / (1 - UG);
    const U = () => c.setTransform(ax, 0, 0, -ay, 0.5 * S, S * 0.98 + ay * UG);   // (sphere units, y up)
    const txt = (str, x, y, size, col, font, maxW) => {   // (text upright, square in shell units: size = cap height in units)
      c.save(); c.setTransform(ax / 1000, 0, 0, ay / 1000, 0.5 * S + ax * x, S * 0.98 - ay * (y - UG)); c.font = `${font} ${size * 1000}px "Arial Black", "Segoe UI", Arial, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
      const w = c.measureText(str).width; if (maxW && w > maxW * 1000) c.scale(maxW * 1000 / w, 1); c.fillStyle = col; c.fillText(str, 0, 0); c.restore();
    };
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = helmet ? '#1d9fe0' : '#f2a10c'; c.fillRect(0, 0, S, S); U();
    // (the look, eased; and the expression: four held in turn, 4 s each, blending over 0.5 s)
    const lk = this.look || { x: 0, y: -0.5 }; this._lk = this._lk || { x: 0, y: -0.5 }; this._lk.x += (lk.x - this._lk.x) * 0.25; this._lk.y += (lk.y - this._lk.y) * 0.25;
    const EX = helmet
      ? [{ ew: 0.150, eh: 0.150, pr: 0.105, bl: 0.10, br: 0.10, tl: 0.10, tr: -0.10, m: 1, ms: 1.0, sq: 0 }, { ew: 0.135, eh: 0.140, pr: 0.085, bl: 0.13, br: 0.04, tl: 0.05, tr: 0.32, m: 1, ms: 0.75, sq: 0 },
        { ew: 0.150, eh: 0.150, pr: 0.105, bl: 0.12, br: 0.12, tl: 0.12, tr: -0.12, m: 1, ms: 1.2, sq: 0 }, { ew: 0.140, eh: 0.145, pr: 0.092, bl: 0.07, br: 0.07, tl: -0.08, tr: 0.08, m: 0, ms: 1.0, sq: 0 }]
      : [{ ew: 0.105, eh: 0.140, pr: 0.074, bl: 0.05, br: 0.05, tl: 0.03, tr: -0.03, m: 0, ms: 0.8, sq: 0 }, { ew: 0.125, eh: 0.155, pr: 0.088, bl: 0.12, br: 0.12, tl: 0.10, tr: -0.10, m: 1, ms: 1.0, sq: 0 },
        { ew: 0.110, eh: 0.145, pr: 0.076, bl: 0.13, br: 0.03, tl: 0.06, tr: 0.30, m: 1, ms: 0.7, sq: 0 }, { ew: 0.110, eh: 0.140, pr: 0.074, bl: 0.07, br: 0.07, tl: -0.06, tr: 0.06, m: 0, ms: 1.3, sq: 1 }];
    const ph = (t / 4) % EX.length, k0 = Math.floor(ph), fr = ph - k0, bl = Math.min(1, Math.max(0, (fr - 0.875) / 0.125)), A = EX[k0], B = EX[(k0 + 1) % EX.length], e = bl * bl * (3 - 2 * bl);
    const P = {}; for (const key of Object.keys(A)) P[key] = A[key] + (B[key] - A[key]) * e;
    const blink = (t % 3.3) < 0.14 ? 0.12 : 1, open = Math.min(blink, 1 - P.sq * 0.85);
    // ---- the face: glossy yellow, its light from the upper left
    const EY = helmet ? 0.15 : 0.27, EX0 = helmet ? 0.215 : 0.2;
    const face = () => {
      const g = c.createRadialGradient(-0.32, 0.55, 0.02, -0.1, 0.2, 1.35); g.addColorStop(0, '#ffe766'); g.addColorStop(0.42, '#ffc61c'); g.addColorStop(1, '#ee9a08'); c.fillStyle = g;
      c.fillRect(-1, UG - 0.05, 2, 1.2 - UG);
      if (!helmet) { c.fillStyle = 'rgba(255,255,255,0.22)'; c.beginPath(); c.ellipse(-0.5, 0.55, 0.09, 0.06, 0.5, 0, 6.283); c.fill(); c.beginPath(); c.ellipse(-0.42, 0.18, 0.05, 0.035, 0.4, 0, 6.283); c.fill(); }
    };
    // ---- the helmet round it (drawn first where it lies behind the face's edge, then the opening)
    if (helmet) {
      const g = c.createLinearGradient(0, 1, 0, UG); g.addColorStop(0, '#3fc8f6'); g.addColorStop(0.45, '#14a6ea'); g.addColorStop(1, '#0a7fcc'); c.fillStyle = g; c.fillRect(-1.2, UG - 0.05, 2.4, 1.2 - UG);
      // (the crown: the navy panel over the top, its wave lines, the red F1 at its front)
      c.fillStyle = '#1b2a6b'; c.beginPath(); c.ellipse(0, 0.9, 0.64, 0.33, 0, 0, 6.283); c.fill();
      c.lineCap = 'round'; for (let k = 0; k < 4; k++) { c.strokeStyle = k % 2 ? '#8fe3ff' : '#ffffff'; c.lineWidth = 0.016; c.beginPath(); c.ellipse(0, 1.16, 0.2 + k * 0.075, 0.12 + k * 0.05, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke(); }
      this.f1(c, 0, 0.72, 0.34, '#e10600');
      // (the side stripes: navy and white, sweeping from the visor pivots down round the face)
      for (const sx of [-1, 1]) {
        for (const [col, w, o] of [['#ffffff', 0.032, 0.0], ['#1b2a6b', 0.085, 0.06]]) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(sx * (0.8 + o), 0.5); c.quadraticCurveTo(sx * (1.0 + o), 0.05, sx * (0.66 + o * 0.5), UG + 0.02); c.stroke(); }
      }
      // (the opening: a wide rounded window from the band down to the chin guard, its white trim)
      const ox = 0.8, oy0 = -0.15, oy1 = 0.41, rr = 0.17;
      c.save(); c.beginPath(); this.rrectPath(c, -ox, oy0, 2 * ox, oy1 - oy0, rr); c.clip(); face(); this.features(c, P, EX0, EY, open, true); c.restore();
      c.strokeStyle = '#f1efff'; c.lineWidth = 0.02; c.beginPath(); this.rrectPath(c, -ox, oy0, 2 * ox, oy1 - oy0, rr); c.stroke();
      // (the chin guard: lilac-white, its dark vent in the middle)
      c.fillStyle = '#ebe8fb'; c.beginPath(); this.rrectPath(c, -0.62, UG - 0.04, 1.24, oy0 - UG + 0.02, 0.06); c.fill();
      c.fillStyle = '#1b2a6b'; c.beginPath(); c.moveTo(-0.16, oy0 - 0.03); c.lineTo(0.16, oy0 - 0.03); c.lineTo(0.11, UG + 0.03); c.lineTo(-0.11, UG + 0.03); c.closePath(); c.fill();
      c.strokeStyle = '#c9c4ea'; c.lineWidth = 0.012; for (let k = -2; k <= 2; k++) { if (!k) continue; c.beginPath(); c.moveTo(k * 0.11 + (k > 0 ? 0.08 : -0.08), oy0 - 0.05); c.lineTo(k * 0.11 + (k > 0 ? 0.08 : -0.08), UG + 0.05); c.stroke(); }
      // (the visor band: white, LAS VEGAS GRAND PRIX in navy across it)
      c.fillStyle = '#f4f2ff'; c.fillRect(-0.86, oy1 - 0.005, 1.72, 0.135); c.fillStyle = 'rgba(120,110,190,0.35)'; c.fillRect(-0.86, oy1 - 0.005, 1.72, 0.016);
      txt('LAS VEGAS GRAND PRIX', 0.0, oy1 + 0.066, 0.085, '#1b2456', '900', 1.42);
      // (the visor's pivots: navy discs with a white rim and mark)
      for (const sx of [-1, 1]) { const px = sx * 0.83, py = oy1 + 0.066; c.fillStyle = '#1b2a6b'; c.beginPath(); c.ellipse(px, py, 0.075, 0.075, 0, 0, 6.283); c.fill(); c.strokeStyle = '#ffffff'; c.lineWidth = 0.014; c.stroke(); c.fillStyle = '#ffffff'; c.beginPath(); this.rrectPath(c, px - 0.022, py - 0.022, 0.044, 0.044, 0.01); c.fill(); }
      // (its gloss)
      c.fillStyle = 'rgba(255,255,255,0.25)'; c.beginPath(); c.ellipse(-0.45, 0.78, 0.16, 0.05, 0.55, 0, 6.283); c.fill();
    } else { face(); this.features(c, P, EX0, EY, open, false); }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** the face's features at the expression P: eyes (ew x eh, pupils pr) at +-ex, ey, brows (raised bl/br, tilted tl/tr),
   *  the mouth (m 0 a small smile, 1 an "o"; ms its size), squint sq (happy closed arcs); open < 1 while blinking */
  features(c, P, ex, ey, open, helmet) {
    const ink = helmet ? '#141414' : '#3a2414', lk = this._lk;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const sx of [-1, 1]) {
      const x0 = sx * ex, eh = P.eh * open;
      if (P.sq > 0.5) {   // (a happy squint: the eyes closed upward arcs)
        c.strokeStyle = ink; c.lineWidth = 0.03; c.beginPath(); c.ellipse(x0, ey - 0.03, P.ew * 0.95, P.eh * 0.55, 0, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
      } else {
        c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x0, ey, P.ew, Math.max(0.008, eh), 0, 0, 6.283); c.fill();
        c.strokeStyle = 'rgba(40,24,10,0.55)'; c.lineWidth = 0.008; c.stroke();
        if (open > 0.5) {
          c.save(); c.beginPath(); c.ellipse(x0, ey, P.ew, eh, 0, 0, 6.283); c.clip();
          const px = x0 + lk.x * (P.ew - P.pr * 0.75) * 0.95, py = ey + lk.y * (eh - P.pr * 0.85) * 0.9;
          c.fillStyle = '#0d0d0d'; c.beginPath(); c.ellipse(px, py, P.pr, P.pr * 1.06, 0, 0, 6.283); c.fill();
          c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.ellipse(px - P.pr * 0.35, py + P.pr * 0.38, P.pr * 0.22, P.pr * 0.22, 0, 0, 6.283); c.fill();
          c.restore();
        }
      }
      // (the brow: a thick rounded bar over the eye, raised and tilted with the expression)
      const by = ey + P.eh + 0.06 + (sx < 0 ? P.bl : P.br) * 0.6, tilt = sx < 0 ? P.tl : -P.tr;
      c.save(); c.translate(x0, by); c.rotate(tilt * sx * -1); c.fillStyle = ink; c.beginPath(); this.rrectPath(c, -P.ew * 1.15, -0.022, P.ew * 2.3, 0.046, 0.023); c.fill(); c.restore();
    }
    // (the mouth)
    const my = ey - P.eh - (helmet ? 0.1 : 0.12);
    if (P.m > 0.5) { c.fillStyle = ink; c.beginPath(); c.ellipse(0, my, 0.032 * P.ms, 0.042 * P.ms, 0, 0, 6.283); c.fill(); }
    else { c.strokeStyle = ink; c.lineWidth = 0.022; c.beginPath(); c.ellipse(0.02, my + 0.045 * P.ms, 0.07 * P.ms, 0.05 * P.ms, 0.12, 1.2 * Math.PI, 1.82 * Math.PI); c.stroke(); }   // (y up: the lower arc - a smile)
  }

  /** the F1 logo (the F's sweep, its middle bar, the 1) centred at x, y, w wide, in shell units (y up) */
  f1(c, x, y, w, col) {
    const k = w / 46, P = (px, py) => [x + (px - 23) * k, y + (py - 5.5) * k];
    c.fillStyle = col;
    const poly = (pts) => { c.beginPath(); pts.forEach(([a, b], i) => { const [u, v] = P(a, b); i ? c.lineTo(u, v) : c.moveTo(u, v); }); c.closePath(); c.fill(); };
    poly([[0, 0], [6, 0], [13, 7], [33, 7], [36, 11], [15.5, 11], [10.5, 10.4], [8, 8.5]]);
    poly([[9, 0], [15, 0], [18.5, 3.5], [28.5, 3.5], [30.5, 5.6], [14.6, 5.6]]);
    poly([[33.5, 0], [38.5, 0], [46, 11], [41, 11]]);
  }

  // ---- neon "Welcome to Fabulous Las Vegas" -------------------------------------
  sign(c, t) {
    const S = SIZE;
    c.fillStyle = '#05061a'; c.fillRect(0, 0, S, S);
    for (const [x, y, r, ph] of this.stars) { const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + ph)); c.fillStyle = `rgba(255,240,200,${a})`; c.beginPath(); c.arc(x, y, r, 0, 6.28); c.fill(); }
    for (let i = 0; i < 26; i++) { const x = (i * 197) % S, y = (i * 331) % S; if (Math.abs(x - S / 2) < S * 0.36 && Math.abs(y - S * 0.5) < S * 0.3) continue; this.sparkle(c, x, y, 14 + (i % 3) * 6, i % 2 ? '#ff5ec4' : '#b58cff', 0.6 + 0.4 * Math.sin(t * 2 + i)); }
    c.save(); c.fillStyle = '#ff5ea8'; c.shadowColor = '#ff2d9a'; c.shadowBlur = 24; c.font = `900 ${S * 0.07}px "Segoe UI", Arial, sans-serif`; c.textAlign = 'center';
    'VEGAS'.split('').forEach((ch, i) => c.fillText(ch, S * 0.11, S * 0.3 + i * S * 0.085)); c.restore();
    const cx = S * 0.52, cy = S * 0.48, w = S * 0.66, h = S * 0.42;
    c.save(); c.shadowColor = '#ffffff'; c.shadowBlur = 30; c.strokeStyle = '#f4f6ff'; c.lineWidth = 10; c.fillStyle = 'rgba(10,20,60,0.85)';
    c.beginPath(); c.moveTo(cx - w * 0.28, cy - h / 2); c.lineTo(cx + w * 0.28, cy - h / 2); c.lineTo(cx + w / 2, cy); c.lineTo(cx + w * 0.28, cy + h / 2); c.lineTo(cx - w * 0.28, cy + h / 2); c.lineTo(cx - w / 2, cy); c.closePath(); c.fill(); c.stroke(); c.restore();
    for (let i = 0; i < 7; i++) { const on = Math.floor(t * 4) % 7 === i; c.fillStyle = on ? '#fff3a0' : '#ffd23a'; c.beginPath(); c.arc(cx - w * 0.24 + i * w * 0.08, cy - h / 2 - 22, on ? 16 : 12, 0, 6.28); c.fill(); }
    this.sparkle(c, cx, cy - h / 2 - 90, 44, '#ff3b3b', 1);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#1e3f9a'; this.rrect(c, cx - w * 0.27, cy - h * 0.42, w * 0.54, h * 0.16, 18); c.fill();
    c.fillStyle = '#ffffff'; c.font = `900 ${S * 0.05}px "Segoe UI", Arial, sans-serif`; c.fillText('W E L C O M E', cx, cy - h * 0.34);
    c.save(); c.shadowColor = '#ff2a2a'; c.shadowBlur = 18; c.fillStyle = '#ff3b3b'; c.font = `italic 700 ${S * 0.055}px Georgia, "Times New Roman", serif`; c.fillText('to Fabulous', cx, cy - h * 0.12);
    c.font = `900 ${S * 0.115}px "Segoe UI", Arial Black, sans-serif`; c.fillText('LAS VEGAS', cx, cy + h * 0.1); c.restore();
    c.fillStyle = '#ffffff'; c.font = `700 ${S * 0.04}px "Segoe UI", Arial, sans-serif`; c.fillText('N E V A D A', cx, cy + h * 0.33);
    c.fillStyle = '#ffd23a'; c.font = `${S * 0.05}px serif`; c.fillText('🐫', cx, cy + h * 0.62);
    c.fillStyle = '#ff5ec4'; c.font = `${S * 0.045}px serif`; c.fillText('🎲', S * 0.12, S * 0.17); c.fillText('♠ ♥', S * 0.88, S * 0.2);
  }

  sparkle(c, x, y, r, color, a) {
    c.save(); c.globalAlpha = a; c.fillStyle = color; c.shadowColor = color; c.shadowBlur = 16;
    c.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, rr = i % 2 ? r * 0.35 : r; c.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } c.closePath(); c.fill(); c.restore();
  }
  rrect(c, x, y, w, h, r) { c.beginPath(); this.rrectPath(c, x, y, w, h, r); }
  rrectPath(c, x, y, w, h, r) { c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath(); }
}

/** Show order on the Sphere (24 s each); canvas shows never sit next to each other so crossfades stay clean. */
export const SPHERE_SEQUENCE = ['eyeball', 'planet', 'smiley', 'basketball', 'sign', 'lava', 'helmet', 'sponsor', 'broadcast', 'marquee', 'clouds', 'gp', 'off'];
export const SHOW_ID = { eyeball: 0, planet: 1, basketball: 2, lava: 3, off: 4, smiley: 5, broadcast: 6, clouds: 7, sign: 8, helmet: 9, marquee: 10, champion: 11, sponsor: 12, gp: 13 };   // champion is never in the loop: forced at the end of a session
export const CANVAS_SHOWS = new Set(['smiley', 'sign', 'helmet', 'marquee', 'sponsor', 'gp']);
export const SHOW_SECONDS = 24;

/**
 * The broadcast's graphics on the Sphere's one big screen (as at the 2024 race: the world feed's onboard across the
 * face, a timing tower down each side, the car's caption low on the picture). A 2:1 canvas laid over the whole screen
 * (the shader's frame, world/Landmarks.js): transparent over the picture, the towers and the caption drawn in.
 * The picture itself sits at x 0.14 .. 0.86 and y 0.06 .. 0.90 of it (from the top: 0.10 .. 0.94).
 */
export class BroadcastOverlay {
  constructor() {
    this.canvas = document.createElement('canvas'); this.canvas.width = 1024; this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas); this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.last = -1;
  }
  /**
   * info: { rows: [{ pos, code, gap, color }] (the order), cap: { pos, name, team, color } | null (the car on the
   * screen), lap, laps } - redrawn twice a second at most
   */
  draw(info, t) {
    if (t - this.last < 0.5 && t >= this.last) return; this.last = t;
    const c = this.ctx, W = 1024, H = 512; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
    // the frame round the picture: black, as the Sphere's screen is round the feed
    c.fillStyle = '#020204'; c.fillRect(0, 0, W, H * 0.1); c.fillRect(0, H * 0.94, W, H * 0.06); c.fillRect(0, 0, W * 0.14, H); c.fillRect(W * 0.86, 0, W * 0.14, H);
    const rows = info?.rows || [];
    // the two towers: P1-P10 on the left, P11-P20 on the right, the lap on top of the left one
    const tower = (x0, from, head) => {
      const w = W * 0.11, y0 = H * 0.13, rh = (H * 0.76) / 11;
      c.fillStyle = '#e10600'; c.fillRect(x0, y0, w, rh * 0.9);
      c.fillStyle = '#ffffff'; c.font = `800 ${rh * 0.5}px "Segoe UI", Arial, sans-serif`; c.textBaseline = 'middle'; c.textAlign = 'center';
      c.fillText(head, x0 + w / 2, y0 + rh * 0.45);
      for (let i = 0; i < 10; i++) {
        const r = rows[from + i]; if (!r) break; const y = y0 + rh * (i + 1);
        c.fillStyle = i % 2 ? 'rgba(18,18,26,0.96)' : 'rgba(30,30,40,0.96)'; c.fillRect(x0, y, w, rh * 0.96);
        c.fillStyle = r.color || '#888'; c.fillRect(x0 + w * 0.2, y + rh * 0.15, w * 0.035, rh * 0.66);
        c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.font = `700 ${rh * 0.46}px "Segoe UI", Arial, sans-serif`;
        c.fillText(String(r.pos), x0 + w * 0.04, y + rh * 0.5);
        c.font = `800 ${rh * 0.48}px "Segoe UI", Arial, sans-serif`; c.fillText(r.code, x0 + w * 0.29, y + rh * 0.5);
        c.textAlign = 'right'; c.fillStyle = '#d8d8e0'; c.font = `600 ${rh * 0.38}px "Segoe UI", Arial, sans-serif`; c.fillText(r.gap, x0 + w * 0.97, y + rh * 0.5);
      }
    };
    const lapTxt = info?.laps ? `LAP ${Math.min(info.laps, info.lap)}/${info.laps}` : 'F1';
    tower(W * 0.017, 0, lapTxt); tower(W * 0.873, 10, 'LAS VEGAS');
    // the caption: position, the driver, the team's colour, over the picture's lower left
    const cp = info?.cap;
    if (cp) {
      const x = W * 0.165, y = H * 0.82, h = H * 0.07;
      c.fillStyle = 'rgba(12,12,18,0.92)'; c.fillRect(x, y, W * 0.27, h);
      c.fillStyle = '#ffffff'; c.fillRect(x, y, h, h); c.fillStyle = '#101018'; c.textAlign = 'center'; c.font = `900 ${h * 0.62}px "Segoe UI", Arial, sans-serif`; c.fillText(String(cp.pos), x + h / 2, y + h * 0.54);
      c.fillStyle = cp.color || '#e10600'; c.fillRect(x + h, y, W * 0.007, h);
      c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.font = `800 ${h * 0.5}px "Segoe UI", Arial, sans-serif`; c.fillText(String(cp.name || '').toUpperCase(), x + h + W * 0.016, y + h * 0.38);
      c.fillStyle = '#b8b8c4'; c.font = `600 ${h * 0.3}px "Segoe UI", Arial, sans-serif`; c.fillText(String(cp.team || '').toUpperCase(), x + h + W * 0.016, y + h * 0.78);
      // ("ONBOARD" tag, top right of the picture, and the F1 mark)
      c.fillStyle = '#e10600'; c.fillRect(W * 0.76, H * 0.12, W * 0.085, H * 0.05); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = `800 ${H * 0.03}px "Segoe UI", Arial, sans-serif`; c.fillText('ONBOARD', W * 0.8025, H * 0.147);
    }
    this.texture.needsUpdate = true;
  }
}
