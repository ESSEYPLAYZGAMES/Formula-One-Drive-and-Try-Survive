// Canvas-drawn Sphere content (projected on the track-facing hemisphere, mirrored onto the far side for
// two-sided shows): the golden emoji, its Grand Prix helmet variant and the "Welcome to Fabulous Las Vegas"
// neon sign. Backgrounds are flat so the canvas edge, the far side and the poles all share one colour.
// Layout note: the shader stretches the canvas over the VISIBLE part of the shell only (canvas bottom = ground
// level, canvas top = the top of the Sphere), so the whole canvas is above ground; nothing is buried.
import * as THREE from 'three';

const SIZE = 1024;
export const SHOW_BG = { smiley: 0xf7b21c, helmet: 0xdbeeff, sign: 0x05061a, marquee: 0x9b0f2e, champion: 0x080b16 };
/** how many faces each show is repeated on around the Sphere (1 = one-sided, 2 = front/back, 4 = quadrants) */
export const SIDES = { smiley: 2, helmet: 2, sign: 4, marquee: 2, champion: 2 };

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
    if (mode === 'sign') this.sign(c, t); else if (mode === 'marquee') this.marquee(c, t); else if (mode === 'helmet') this.helmet(c, t); else if (mode === 'champion') this.champion(c, t, this.championInfo); else this.face(c, t, false);
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

  // ---- the Grand Prix helmet emoji (as on the real Sphere): a white / sky-blue race helmet with the visor up,
  //      "LAS VEGAS GRAND PRIX" across the visor strip, the F1 mark on the crown, and the golden face peeking out
  //      of the opening with big glossy eyes; the expression changes every few seconds ---------------------------
  helmet(c, t) {
    const S = SIZE, cx = S * 0.5;
    c.fillStyle = '#f7b21c'; c.fillRect(0, 0, S, S);                         // face colour everywhere (flat, no seams)
    // helmet shell: covers everything except the face opening
    const shell = c.createLinearGradient(0, 0, 0, S * 0.8); shell.addColorStop(0, '#f4f9ff'); shell.addColorStop(0.5, '#dbeeff'); shell.addColorStop(1, '#8cc8f0');
    // (the opening is appended to the current path - no beginPath - so the even-odd fill / clip covers everything but it)
    const opening = () => { this.rrectPath(c, S * 0.2, S * 0.42, S * 0.6, S * 0.5, S * 0.16); };
    c.save(); c.beginPath(); c.rect(0, 0, S, S); opening(); c.fillStyle = shell; c.fill('evenodd'); c.restore();
    // sky-blue swooshes on the crown and cheeks
    c.save(); c.beginPath(); c.rect(0, 0, S, S); opening(); c.clip('evenodd');
    c.strokeStyle = '#4fb2ea'; c.lineCap = 'round';
    for (let k = 0; k < 3; k++) { c.lineWidth = 26 - k * 6; c.beginPath(); c.moveTo(S * (0.06 + k * 0.03), S * (0.36 - k * 0.07)); c.quadraticCurveTo(cx, S * (0.02 + k * 0.04), S * (0.94 - k * 0.03), S * (0.36 - k * 0.07)); c.stroke(); }
    c.fillStyle = '#2b8fd6'; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(cx + sx * S * 0.34, S * 0.5); c.lineTo(cx + sx * S * 0.48, S * 0.42); c.lineTo(cx + sx * S * 0.48, S * 0.8); c.lineTo(cx + sx * S * 0.34, S * 0.78); c.closePath(); c.fill(); }
    c.restore();
    // F1 mark on the crown
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#e10600'; c.font = `italic 900 ${S * 0.09}px "Segoe UI", Arial Black, sans-serif`; c.fillText('F1', cx, S * 0.14);
    // the raised visor: dark navy band with the event name
    c.fillStyle = '#12244a'; this.rrect(c, S * 0.1, S * 0.27, S * 0.8, S * 0.11, S * 0.04); c.fill();
    c.fillStyle = '#ffffff'; c.font = `900 ${S * 0.052}px "Segoe UI", Arial, sans-serif`; c.fillText('LAS VEGAS GRAND PRIX', cx, S * 0.326);
    c.fillStyle = 'rgba(255,255,255,0.35)'; this.rrect(c, S * 0.13, S * 0.285, S * 0.74, S * 0.012, 4); c.fill();   // visor edge glint
    // helmet rim around the opening
    c.strokeStyle = '#3b3f4a'; c.lineWidth = 9; c.beginPath(); opening(); c.stroke();

    // ---- the face: big glossy eyes that blink, brows, and a cycling expression
    const expr = Math.floor(t / 5) % 5;                               // 0 surprised, 1 grin, 2 wink, 3 tongue, 4 nervous
    const blinkPh = t % 4.2; const blink = blinkPh > 3.7 && blinkPh < 3.9 ? Math.max(0.1, 1 - Math.sin((blinkPh - 3.7) / 0.2 * Math.PI)) : 1;
    const lookX = Math.sin(t * 0.7) * 10, lookY = Math.cos(t * 0.5) * 6;
    const eyeY = S * 0.57;
    for (const sx of [-1, 1]) {
      const ex = cx + sx * S * 0.13;
      const closed = expr === 2 && sx > 0;                            // wink with the right eye
      if (closed) { c.strokeStyle = '#2a1a06'; c.lineWidth = S * 0.014; c.lineCap = 'round'; c.beginPath(); c.arc(ex, eyeY - S * 0.01, S * 0.05, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke(); continue; }
      const eh = S * 0.075 * blink;
      c.fillStyle = '#1a1208'; c.beginPath(); c.ellipse(ex + lookX, eyeY + lookY, S * 0.058, eh, 0, 0, 6.28); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(ex + lookX - S * 0.018, eyeY + lookY - eh * 0.4, S * 0.02, eh * 0.28, 0, 0, 6.28); c.fill();
      c.beginPath(); c.arc(ex + lookX + S * 0.02, eyeY + lookY + eh * 0.3, S * 0.008, 0, 6.28); c.fill();
      // brows: raised (surprised), relaxed (grin / tongue), angled (nervous)
      const tilt = expr === 4 ? sx * 0.35 : 0; const lift = expr === 0 ? S * 0.03 : 0;
      c.save(); c.translate(ex, eyeY - S * 0.105 - lift); c.rotate(tilt); c.fillStyle = '#4a2f10'; this.rrect(c, -S * 0.06, -S * 0.012, S * 0.12, S * 0.026, S * 0.012); c.fill(); c.restore();
    }
    const my = S * 0.7; c.lineCap = 'round';
    if (expr === 0) {           // surprised "o"
      c.fillStyle = '#3a1d08'; c.beginPath(); c.ellipse(cx, my, S * 0.035, S * 0.045, 0, 0, 6.28); c.fill();
    } else if (expr === 1) {    // wide grin with teeth
      c.fillStyle = '#3a1d08'; c.beginPath(); c.moveTo(cx - S * 0.11, my - S * 0.02); c.quadraticCurveTo(cx, my + S * 0.09, cx + S * 0.11, my - S * 0.02); c.closePath(); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(cx - S * 0.095, my - S * 0.015); c.quadraticCurveTo(cx, my + S * 0.02, cx + S * 0.095, my - S * 0.015); c.closePath(); c.fill();
    } else if (expr === 2) {    // wink + smirk
      c.strokeStyle = '#3a1d08'; c.lineWidth = S * 0.016; c.beginPath(); c.moveTo(cx - S * 0.06, my); c.quadraticCurveTo(cx + S * 0.02, my + S * 0.05, cx + S * 0.08, my - S * 0.02); c.stroke();
    } else if (expr === 3) {    // tongue out
      c.fillStyle = '#3a1d08'; c.beginPath(); c.moveTo(cx - S * 0.09, my - S * 0.01); c.quadraticCurveTo(cx, my + S * 0.07, cx + S * 0.09, my - S * 0.01); c.closePath(); c.fill();
      c.fillStyle = '#ff5a7a'; c.beginPath(); c.ellipse(cx + S * 0.02, my + S * 0.035, S * 0.035, S * 0.03, 0.2, 0, 6.28); c.fill();
    } else {                    // nervous gritted teeth
      c.fillStyle = '#ffffff'; this.rrect(c, cx - S * 0.1, my - S * 0.02, S * 0.2, S * 0.045, S * 0.015); c.fill();
      c.strokeStyle = '#3a1d08'; c.lineWidth = 5; this.rrect(c, cx - S * 0.1, my - S * 0.02, S * 0.2, S * 0.045, S * 0.015); c.stroke();
      for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(cx - S * 0.1 + k * S * 0.033, my - S * 0.02); c.lineTo(cx - S * 0.1 + k * S * 0.033, my + S * 0.025); c.stroke(); }
    }
    // blush
    c.fillStyle = 'rgba(255,120,80,0.28)'; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(cx + sx * S * 0.2, S * 0.66, S * 0.035, S * 0.02, 0, 0, 6.28); c.fill(); }
  }

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

  // ---- golden emoji ----------------------------------------------------------
  face(c, t, helmet) {
    const S = SIZE;
    c.fillStyle = '#f7b21c'; c.fillRect(0, 0, S, S);                       // flat gold everywhere (no divides)
    c.fillStyle = 'rgba(255,255,255,0.07)'; c.beginPath(); c.ellipse(S * 0.36, S * 0.42, S * 0.11, S * 0.07, -0.5, 0, 6.28); c.fill();

    const blinkPh = t % 4.2; const blink = blinkPh > 3.7 && blinkPh < 3.9 ? Math.max(0.08, 1 - Math.sin((blinkPh - 3.7) / 0.2 * Math.PI)) : 1;
    const lookX = Math.sin(t * 0.6) * 14 + Math.sin(t * 1.7) * 6, lookY = Math.cos(t * 0.45) * 8;
    const eyeY = helmet ? S * 0.52 : S * 0.47, eyeW = S * 0.18, eyeH = S * 0.12 * blink;
    const brow = '#4a2f10';
    for (const sx of [-1, 1]) {
      const ex = S * 0.5 + sx * S * 0.18;
      c.fillStyle = '#fff6f0'; this.rrect(c, ex - eyeW / 2, eyeY - eyeH / 2, eyeW, eyeH, Math.min(eyeW, eyeH) * 0.32); c.fill();
      c.strokeStyle = 'rgba(120,80,20,0.35)'; c.lineWidth = 4; c.stroke();
      c.save(); this.rrect(c, ex - eyeW / 2, eyeY - eyeH / 2, eyeW, eyeH, Math.min(eyeW, eyeH) * 0.32); c.clip();
      c.fillStyle = '#141414'; c.beginPath(); c.arc(ex + lookX, eyeY + lookY, S * 0.038, 0, 6.28); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(ex + lookX - 10, eyeY + lookY - 12, S * 0.01, 0, 6.28); c.fill();
      c.restore();
      // eyebrows: raised/sceptical on the emoji, furrowed (angled inward) under the helmet
      const raise = helmet ? 0 : (Math.sin(t * 0.35) > 0.2 ? 1 : 0);
      const tilt = helmet ? -sx * 0.3 : (sx > 0 ? -0.18 * raise : 0);
      const by = eyeY - S * 0.105 - (sx > 0 ? raise * S * 0.035 : 0) + (helmet ? S * 0.015 : 0);
      c.save(); c.translate(ex, by); c.rotate(tilt); c.fillStyle = brow; this.rrect(c, -eyeW * 0.55, -S * 0.02, eyeW * 1.1, S * 0.042, S * 0.02); c.fill(); c.restore();
    }
    // mouth: small smile (emoji) or the surprised "o" (helmet)
    c.strokeStyle = brow; c.lineWidth = S * 0.018; c.lineCap = 'round';
    if (helmet) { c.fillStyle = brow; c.beginPath(); c.ellipse(S * 0.5, S * 0.68, S * 0.035, S * 0.045, 0, 0, 6.28); c.fill(); }
    else { c.beginPath(); c.arc(S * 0.5, S * 0.585, S * 0.065, 0.25 * Math.PI, 0.75 * Math.PI); c.stroke(); }

    if (helmet) {
      // Grand Prix helmet: sky-blue dome over the top (edge pixels extend across the pole), white band,
      // dark visor slot with the event name, red F1 mark on the crown
      const domeBottom = S * 0.30;
      const hg = c.createLinearGradient(0, 0, 0, domeBottom); hg.addColorStop(0, '#9fdcf6'); hg.addColorStop(1, '#3fa9df');
      c.fillStyle = hg; c.fillRect(0, 0, S, domeBottom);
      c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 5; for (let i = 0; i <= 6; i++) { c.beginPath(); c.moveTo(S * (0.05 + i * 0.15), 0); c.lineTo(S * (0.05 + i * 0.15), domeBottom); c.stroke(); }
      c.fillStyle = '#ffffff'; c.fillRect(0, domeBottom, S, S * 0.045);
      c.fillStyle = '#12244a'; c.fillRect(0, domeBottom + S * 0.045, S, S * 0.09);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = '#ffffff'; c.font = `900 ${S * 0.055}px "Segoe UI", Arial, sans-serif`; c.fillText('LAS VEGAS GRAND PRIX', S * 0.5, domeBottom + S * 0.09);
      c.fillStyle = '#e10600'; c.font = `italic 900 ${S * 0.085}px "Segoe UI", Arial, sans-serif`; c.fillText('F1', S * 0.5, S * 0.14);
      c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(0, domeBottom + S * 0.135, S, S * 0.015);
    }
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
export const SPHERE_SEQUENCE = ['eyeball', 'planet', 'smiley', 'basketball', 'sign', 'lava', 'helmet', 'broadcast', 'marquee', 'clouds', 'off'];
export const SHOW_ID = { eyeball: 0, planet: 1, basketball: 2, lava: 3, off: 4, smiley: 5, broadcast: 6, clouds: 7, sign: 8, helmet: 9, marquee: 10, champion: 11 };   // champion is never in the loop: forced at the end of a session
export const CANVAS_SHOWS = new Set(['smiley', 'sign', 'helmet', 'marquee']);
export const SHOW_SECONDS = 24;
