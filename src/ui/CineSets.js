// The sets the cutscenes are shot on (ui/Cine.js builds them with its kit): the garage, the pit wall's stand, the
// boardroom, the team principal's office, the press room, the launch stage, the cool-down room, the stewards' room, a
// documentary's interview chair, the paddock, the factory's four halls, the trophy room. Each is built at the kit's
// origin out of what stands in such a room (ui/CineProps.js: furniture, lamps, plants, the garage's and the stage's
// kit) on surfaces with a grain (ui/CineKit.js), most of it welded into a few meshes (a batch); the screens carry the
// season's own numbers (painters below); the people who are only there are real figures (k.crowd). Each has its own
// light, and returns where things stand in it. Facing: 0 looks down +z, PI/2 down +x (Cine.js).
// T: a team { name, color, color2 }.
import * as PR from './CineProps.js';

const PI = Math.PI;
const FONT = '"Segoe UI", Roboto, Arial, sans-serif';
const ink = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '')); const v = m ? parseInt(m[1], 16) : 0x888888; const L = (0.2126 * (v >> 16 & 255) + 0.7152 * (v >> 8 & 255) + 0.0722 * (v & 255)) / 255; return L > 0.55 ? '#101216' : '#ffffff'; };

// ---- painters (ctx, W, H) --------------------------------------------------------------------------------------------
/** a table: title, rows [{ a, b, c, hi, col }] (a: place, b: name, c: figure; hi: the row lit; col: its stripe) */
export const paintTable = (title, rows, acc = '#e10600', o = {}) => (x, W, H) => {
  x.fillStyle = o.bg || '#0b0d12'; x.fillRect(0, 0, W, H); x.fillStyle = acc; x.fillRect(0, 0, W, H * 0.018);
  const hh = H * 0.15; x.fillStyle = '#ffffff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = `800 ${hh * 0.42}px ${FONT}`; x.fillText(String(title).toUpperCase(), W * 0.04, hh * 0.58);
  if (o.note) { x.textAlign = 'right'; x.font = `600 ${hh * 0.28}px ${FONT}`; x.fillStyle = 'rgba(255,255,255,.6)'; x.fillText(o.note, W * 0.96, hh * 0.6); }
  const n = Math.max(rows.length, o.min || 6), rh = (H - hh - H * 0.03) / n;
  rows.forEach((r, i) => {
    const y = hh + i * rh;
    if (r.hi) { x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(W * 0.02, y + 1, W * 0.96, rh - 2); }
    if (r.line) { x.fillStyle = acc; x.fillRect(W * 0.02, y - 1, W * 0.96, 2); }
    x.fillStyle = r.col || '#555b66'; x.fillRect(W * 0.1, y + rh * 0.2, W * 0.008, rh * 0.6);
    x.textAlign = 'right'; x.font = `700 ${rh * 0.46}px ${FONT}`; x.fillStyle = 'rgba(255,255,255,.7)'; x.fillText(String(r.a ?? ''), W * 0.085, y + rh * 0.54);
    x.textAlign = 'left'; x.font = `${r.hi ? 800 : 600} ${rh * 0.48}px ${FONT}`; x.fillStyle = '#ffffff'; x.fillText(String(r.b ?? ''), W * 0.125, y + rh * 0.54);
    x.textAlign = 'right'; x.font = `700 ${rh * 0.48}px ${FONT}`; x.fillStyle = r.cc || '#ffffff'; x.fillText(String(r.c ?? ''), W * 0.96, y + rh * 0.54);
  });
};
/** a newspaper / site headline: { paper, head, deck, col } */
export const paintHeadline = (h) => (x, W, H) => {
  x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, W, H); x.fillStyle = h.col || '#c8102e'; x.fillRect(0, 0, W, H * 0.13);
  x.fillStyle = '#ffffff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = `900 ${H * 0.075}px ${FONT}`; x.fillText(String(h.paper || 'PADDOCK DAILY').toUpperCase(), W * 0.04, H * 0.07);
  x.fillStyle = '#14161a'; x.font = `900 ${H * 0.11}px Georgia, serif`; const words = String(h.head || '').split(' '); let line = '', y = H * 0.27;
  for (const w of words) { if (x.measureText(line + w).width > W * 0.9 && line) { x.fillText(line.trim(), W * 0.04, y); y += H * 0.125; line = ''; } line += w + ' '; }
  x.fillText(line.trim(), W * 0.04, y); y += H * 0.12;
  x.fillStyle = '#4a4f58'; x.font = `400 ${H * 0.052}px Georgia, serif`; line = '';
  for (const w of String(h.deck || '').split(' ')) { if (x.measureText(line + w).width > W * 0.9 && line) { x.fillText(line.trim(), W * 0.04, y); y += H * 0.068; line = ''; } line += w + ' '; }
  x.fillText(line.trim(), W * 0.04, y);
};
/** an incident as the stewards see it: two cars at a corner, their paths, the lap; { a, b, ca, cb, where, lap, note } */
export const paintIncident = (q, u = 1) => (x, W, H) => {
  x.fillStyle = '#10141b'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#3b4250'; x.lineWidth = H * 0.2; x.lineCap = 'round'; x.beginPath(); x.moveTo(-W * 0.05, H * 0.78); x.quadraticCurveTo(W * 0.55, H * 0.8, W * 0.72, H * 0.2); x.stroke();
  x.strokeStyle = '#e9e9e9'; x.lineWidth = 2; x.setLineDash([10, 10]); x.beginPath(); x.moveTo(-W * 0.05, H * 0.78); x.quadraticCurveTo(W * 0.55, H * 0.8, W * 0.72, H * 0.2); x.stroke(); x.setLineDash([]);
  const at = (s, off) => { const t = s, mx = (1 - t) * (1 - t) * (-W * 0.05) + 2 * (1 - t) * t * W * 0.55 + t * t * W * 0.72, my = (1 - t) * (1 - t) * H * 0.78 + 2 * (1 - t) * t * H * 0.8 + t * t * H * 0.2; return [mx + off, my - off * 0.6]; };
  const car = (s, off, col, lab) => { const [cx, cy] = at(s, off); x.save(); x.translate(cx, cy); x.rotate(-0.25 - s * 0.9); x.fillStyle = col; x.fillRect(-W * 0.035, -H * 0.022, W * 0.07, H * 0.044); x.restore(); x.fillStyle = '#ffffff'; x.font = `800 ${H * 0.05}px ${FONT}`; x.textAlign = 'center'; x.fillText(lab, cx, cy - H * 0.06); };
  car(0.35 + 0.3 * u, H * 0.03 * (1 - u * 0.9), q.ca || '#e10600', q.a || 'A'); car(0.32 + 0.33 * u, -H * 0.035 * (1 - u * 0.9), q.cb || '#27f4d2', q.b || 'B');
  if (u > 0.92) { const [cx, cy] = at(0.655, 0); x.strokeStyle = '#ffd400'; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, H * 0.09, 0, 6.3); x.stroke(); }
  x.fillStyle = '#e10600'; x.fillRect(0, 0, W, H * 0.11); x.fillStyle = '#ffffff'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.font = `800 ${H * 0.055}px ${FONT}`; x.fillText(`${q.where || 'TURN 4'} · LAP ${q.lap || 1}`.toUpperCase(), W * 0.03, H * 0.058);
  if (q.note) { x.textAlign = 'right'; x.fillText(String(q.note).toUpperCase(), W * 0.97, H * 0.058); }
};

// ---- what the sets share ---------------------------------------------------------------------------------------------
const skyTex = (k, top, bot, stars = false) => k.tex(64, 256, (x, W, H) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, W, H); if (stars) { x.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) x.fillRect(k.rnd() * W, k.rnd() * H * 0.6, 1, 1); } });
const backdrop = (k, w, h, x, y, z, face, top, bot, stars) => { const m = k.own(new k.THREE.MeshBasicMaterial({ map: skyTex(k, top, bot, stars), fog: false })); return k.plane(w, h, m, x, y, z, face); };
/** a skyline at dusk or night behind a window: the sky, a far row of towers in the haze, a near row with lit windows */
const skyline = (k, night) => k.tex(2048, 640, (x, W, H) => {
  const g = x.createLinearGradient(0, 0, 0, H); if (night) { g.addColorStop(0, '#05070f'); g.addColorStop(0.7, '#141b33'); g.addColorStop(1, '#27304f'); } else { g.addColorStop(0, '#263a66'); g.addColorStop(0.55, '#b9785a'); g.addColorStop(0.8, '#eeb476'); g.addColorStop(1, '#f6d59a'); } x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (night) { x.fillStyle = '#ffffff'; for (let i = 0; i < 160; i++) { x.globalAlpha = 0.2 + k.rnd() * 0.6; x.fillRect(k.rnd() * W, k.rnd() * H * 0.5, 1.5, 1.5); } x.globalAlpha = 1; }
  for (let L = 0; L < 3; L++) {
    const far = L === 0, mid = L === 1, n = far ? 46 : mid ? 34 : 22;
    for (let i = 0; i < n; i++) {
      const w = (far ? 26 : mid ? 44 : 70) + k.rnd() * (far ? 50 : 90), h = (far ? 90 : mid ? 130 : 110) + k.rnd() * (far ? 170 : mid ? 300 : 260), bx = k.rnd() * W - w / 2, top = H - h;
      x.fillStyle = night ? (far ? '#101731' : mid ? '#0b1022' : '#070a15') : (far ? '#6f6a7c' : mid ? '#3b3f55' : '#1c2233'); x.fillRect(bx, top, w, h);
      if (k.rnd() < 0.3) x.fillRect(bx + w * 0.4, top - 18 - k.rnd() * 30, 3, 50);
      const cw = far ? 4 : 6, ch = far ? 5 : 8, lit = night ? (far ? 0.14 : 0.22) : 0.12;
      for (let j = 0; j < h / ch - 1; j++) for (let q = 0; q < w / cw - 1; q++) if (k.rnd() < lit) { x.fillStyle = night ? ['rgba(255,214,140,.9)', 'rgba(210,228,255,.8)', 'rgba(255,190,110,.75)'][(k.rnd() * 3) | 0] : 'rgba(255,226,170,.6)'; x.fillRect(bx + 3 + q * cw, top + 4 + j * ch, cw - 2.5, ch - 4); }
      if (night && !far && k.rnd() < 0.25) { x.fillStyle = 'rgba(255,60,60,.9)'; x.fillRect(bx + w / 2, top - 3, 3, 3); }
    }
    if (far) { const hz = x.createLinearGradient(0, H * 0.5, 0, H); hz.addColorStop(0, 'rgba(0,0,0,0)'); hz.addColorStop(1, night ? 'rgba(40,52,90,.5)' : 'rgba(246,200,150,.5)'); x.fillStyle = hz; x.fillRect(0, H * 0.5, W, H * 0.5); }
  }
});
/** a room's shell: its floor (o.floor), ceiling (o.ceil; null: none), walls (o.wall, or one a side: o.n, o.s, o.w, o.e; o.open: the sides left out), skirting */
function shell(k, b, W, D, H, o = {}) {
  const wl = o.wall || b.surf('plaster', '#d9d6cf'), open = o.open || '', sk = o.skirt === undefined ? b.m('#1a1b1f', 0.5) : o.skirt;
  k.floor(W, D, o.floor || b.surf('concrete', '#8f949c'));
  if (o.ceil !== null) b.box(W + 0.4, 0.2, D + 0.4, o.ceil || b.surf('tile', '#e6e6e2'), 0, H + 0.1, 0, 0, { sh: false, r: 0 });
  if (!open.includes('n')) { b.box(W + 0.4, H, 0.2, o.n || wl, 0, H / 2, -D / 2 - 0.1, 0, { r: 0 }); if (sk) PR.rail(b, -W / 2, -D / 2 + 0.01, W / 2, -D / 2 + 0.01, 0.05, 0.1, 0.02, sk); }
  if (!open.includes('s')) { b.box(W + 0.4, H, 0.2, o.s || wl, 0, H / 2, D / 2 + 0.1, 0, { r: 0 }); if (sk) PR.rail(b, -W / 2, D / 2 - 0.01, W / 2, D / 2 - 0.01, 0.05, 0.1, 0.02, sk); }
  if (!open.includes('w')) { b.box(0.2, H, D, o.w || wl, -W / 2 - 0.1, H / 2, 0, 0, { r: 0 }); if (sk) PR.rail(b, -W / 2 + 0.01, -D / 2, -W / 2 + 0.01, D / 2, 0.05, 0.1, 0.02, sk); }
  if (!open.includes('e')) { b.box(0.2, H, D, o.e || wl, W / 2 + 0.1, H / 2, 0, 0, { r: 0 }); if (sk) PR.rail(b, W / 2 - 0.01, -D / 2, W / 2 - 0.01, D / 2, 0.05, 0.1, 0.02, sk); }
}
/** a row of lamps let into a ceiling */
const downlights = (b, y, xs, zs, col, I) => { for (const x of xs) for (const z of zs) PR.downlight(b, x, y, z, col, I); };
/** a print for a frame: the team's stripes, a number, a word (never a photograph: there is none) */
const paintPoster = (T, word, n = 0) => (x, W, H) => {
  x.fillStyle = n % 2 ? '#101216' : '#eceae4'; x.fillRect(0, 0, W, H); x.save(); x.translate(W / 2, H / 2); x.rotate(-0.42);
  x.fillStyle = T.color; x.fillRect(-W, -H * 0.16, W * 2, H * 0.2); x.fillStyle = T.color2 || '#888888'; x.fillRect(-W, H * 0.07, W * 2, H * 0.035); x.fillStyle = n % 2 ? '#eceae4' : '#101216'; x.fillRect(-W, H * 0.13, W * 2, H * 0.012); x.restore();
  x.fillStyle = n % 2 ? '#ffffff' : '#101216'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.font = `900 ${H * 0.2}px ${FONT}`; x.fillText(String(word).toUpperCase().slice(0, 9), W * 0.07, H * 0.9);
};
/** a grandstand seen from far off: its steps full of people (a speckle of colour), its roof, its columns; along x at z, facing `face` */
function grandstand(k, b, x, z, w, face, col, night) {
  const s = Math.cos(face) >= 0 ? 1 : -1, crowd = k.tex(1024, 256, (c, W, H) => { c.fillStyle = night ? '#0d0f15' : '#3a3f48'; c.fillRect(0, 0, W, H); const C = [col, '#f2f2ef', '#1b1d22', '#d9c7a3', '#b04a4a', '#2d4a6b', col, '#e7e4dc']; for (let r = 0; r < 26; r++) { c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, r * H / 26, W, 2); for (let i = 0; i < 230; i++) { c.fillStyle = C[(k.rnd() * C.length) | 0]; c.globalAlpha = night ? 0.5 : 0.9; c.fillRect(k.rnd() * W, r * H / 26 + 3, 3, H / 26 - 4); } c.globalAlpha = 1; } });
  const st = k.plane(w, 10, k.own(new k.THREE.MeshStandardMaterial({ map: crowd, roughness: 1 })), x, 6.4, z + s * 0, face); st.rotation.x = -s * 0.5;
  b.box(w, 2.0, 0.4, b.surf('concrete', '#c9ccd1'), x, 1.0, z + s * 4.3, 0, { r: 0, sh: false }); b.box(w, 0.6, 0.3, b.m(col, 0.6), x, 2.3, z + s * 4.35, 0, { r: 0, sh: false });
  b.box(w + 2, 0.3, 11, b.m('#e4e6ea', 0.7), x, 12.2, z - s * 1.5, 0, { r: 0, sh: false, rx: -s * 0.08 }); b.box(w + 2, 0.7, 0.3, b.m('#22252b', 0.6), x, 11.6, z + s * 3.9, 0, { r: 0, sh: false });
  for (let i = 0; i <= Math.round(w / 9); i++) { const px = x - w / 2 + i * w / Math.round(w / 9); b.cyl(0.18, 0.18, 12, b.m('#c9ccd1', 0.5, 0.4), px, 6, z - s * 5.2, 10, { sh: false }); }
}

// ---- the sets --------------------------------------------------------------------------------------------------------
/**
 * The garage: open to the pit lane at +z, the car's bay in the middle (nose out), the team's name across the back
 * wall over a bank of screens (o.screens: up to three painters) and the engineers' bench, cabinets, tyres in their
 * blankets, a spare wing, the lights' truss and the light box over the bay. o: { night, fia (the scrutineering bay:
 * grey, no team), screens, banner }
 */
export function garage(k, T, o = {}) {
  const col = o.fia ? '#3a4150' : T.color, col2 = o.fia ? '#c9ccd1' : T.color2 || '#ffffff', b = k.batch(), wall = b.surf('panel', o.fia ? '#d3d6db' : '#e3e5e9'), dk = b.m('#17181c', 0.55, 0.3);
  // the room: an epoxy floor with the bay marked on it, panelled walls with the team's band at the foot, a dark ceiling
  k.floor(14, 10, b.surf('epoxy', '#858a92', { rough: 0.26 })); const line = b.m(col, 0.45);
  k.floor(14, 0.22, line, 0.004, 0, 4.6); k.floor(0.14, 9.2, line, 0.004, -3.2, 0); k.floor(0.14, 9.2, line, 0.004, 3.2, 0); k.floor(1.6, 0.1, b.m('#f2f2ef', 0.5), 0.004, 0, 3.0); k.floor(0.1, 0.8, b.m('#f2f2ef', 0.5), 0.004, 0, 2.6);
  for (const sx of [-1, 1]) { k.floor(0.5, 0.5, b.m('#f2f2ef', 0.5), 0.004, sx * 1.02, 1.9); k.floor(0.5, 0.5, b.m('#f2f2ef', 0.5), 0.004, sx * 1.02, -1.5); }
  b.box(14.4, 4.4, 0.2, wall, 0, 2.2, -5.1, 0, { r: 0 }); b.box(0.2, 4.4, 10, wall, -7.1, 2.2, 0, 0, { r: 0 }); b.box(0.2, 4.4, 10, wall, 7.1, 2.2, 0, 0, { r: 0 }); b.box(14.4, 0.2, 10.4, b.m('#15171b', 0.9), 0, 4.5, 0, 0, { sh: false, r: 0 });
  const foot = b.m('#22252b', 0.4, 0.3); b.box(14, 0.8, 0.03, foot, 0, 0.4, -4.985, 0, { r: 0, sh: false }); b.box(0.03, 0.8, 10, foot, -6.985, 0.4, 0, 0, { r: 0, sh: false }); b.box(0.03, 0.8, 10, foot, 6.985, 0.4, 0, 0, { r: 0, sh: false });
  b.box(14, 0.07, 0.035, b.m(col, 0.4), 0, 0.84, -4.983, 0, { r: 0, sh: false }); b.box(0.035, 0.07, 10, b.m(col, 0.4), -6.983, 0.84, 0, 0, { r: 0, sh: false }); b.box(0.035, 0.07, 10, b.m(col, 0.4), 6.983, 0.84, 0, 0, { r: 0, sh: false }); void col2;
  k.sign(9, 1.15, k.letters([[o.banner || (o.fia ? 'SCRUTINEERING' : T.name).toUpperCase(), 150, o.fia ? '#ffffff' : ink(col), 900]], col), 0, 3.45, -4.985, 0, 1536); b.box(9.16, 1.31, 0.05, dk, 0, 3.45, -5.01, 0, { r: 0, sh: false });
  b.box(14, 0.5, 0.25, b.m(col, 0.45), 0, 4.15, 4.9, 0, { r: 0.02 }); k.sign(5, 0.3, k.letters([[(o.fia ? 'PARC FERME' : T.name).toUpperCase(), 64, ink(col), 800]], col), 0, 4.15, 4.77, PI, 768);
  // the screens over the engineers' bench
  const def = [paintTable('TIMING', [], col), paintTable('SECTORS', [], col), paintTable('TYRES', [], col)], scr = [];
  b.box(7.4, 1.55, 0.06, dk, 0, 2.05, -4.97, 0, { r: 0.01, sh: false });
  [-2.4, 0, 2.4].forEach((sx, i) => { b.box(2.1, 1.25, 0.05, b.m('#0d0e11', 0.5), sx, 2.05, -4.93, 0, { r: 0.012, sh: false }); scr.push(k.screen(1.96, 1.1, (o.screens || [])[i] || def[i], sx, 2.05, -4.9, 0, 1.15)); });
  PR.table(b, 6.6, 0.5, 0, -4.68, 1.02, b.m('#1c1e23', 0.5, 0.2), 0, { kind: 'panel' });
  for (const sx of [-2.6, -0.9, 0.9, 2.6]) { PR.laptop(b, sx, 1.02, -4.66, (k.rnd() - 0.5) * 0.3); if (k.rnd() < 0.7) PR.mug(b, sx + 0.3, 1.02, -4.6, '#eceef0'); }
  PR.headset(b, -1.75, 1.11, -4.62, 0.4, '#17181c'); PR.headset(b, 1.7, 1.11, -4.64, -0.3, col); PR.bottle(b, 0.2, 1.02, -4.7); PR.bottle(b, -3.1, 1.02, -4.72, '#b7e0c0'); PR.papers(b, 0.0, 1.02, -4.55, 0.2, 3);
  // along the walls: cabinets, the tyres, the cases, a spare wing, the gas for the guns
  PR.cabinet(b, -5.6, -4.5, 0, o.fia ? '#59606c' : col); PR.cabinet(b, -4.15, -4.5, 0, '#2a2d33'); PR.cabinet(b, 4.3, -4.5, 0, '#2a2d33'); PR.cabinet(b, 5.75, -4.5, 0, o.fia ? '#59606c' : col);
  if (!o.fia) {
    PR.tyres(b, -6.2, 1.2, 4, col); PR.tyres(b, -6.2, 2.1, 4, col); PR.tyres(b, -5.4, 1.7, 3, col); PR.tyres(b, 6.2, 1.4, 4, col); PR.tyres(b, 6.2, 2.3, 3, col); PR.tyres(b, 5.45, 3.0, 2, col, { bare: true, band: '#f2f2ef' });
    PR.wingStand(b, 6.35, -1.6, -PI / 2, col, '#111318'); PR.gasBottle(b, -6.55, -3.3, '#2d6cdf'); PR.gasBottle(b, -6.55, -2.95, '#2d6cdf');
  }
  PR.flightCase(b, 6.2, -3.4, -PI / 2, 1.1, 0.7, 0.6, '#17181c'); PR.flightCase(b, 6.2, -3.4, -PI / 2, 0.8, 0.45, 0.55, '#22252b', 0.82); PR.flightCase(b, -6.3, -0.6, PI / 2, 1.2, 0.8, 0.6, '#17181c'); PR.extinguisher(b, -6.98, 3.6, PI / 2, 0.1); PR.extinguisher(b, 6.98, 4.0, -PI / 2, 0.1);
  // on the side walls: boards of tools, the partners' boards, the trunking
  for (const s of [-1, 1]) {
    b.box(0.03, 1.3, 2.6, b.surf('perf', '#3a3d44'), s * 6.985, 1.75, -1.0, 0, { r: 0, sh: false });
    for (let i = 0; i < 6; i++) PR.headset(b, s * 6.93, 2.2, -2.1 + i * 0.42, -s * PI / 2, i % 2 ? col : '#17181c');
    for (let i = 0; i < 7; i++) b.box(0.03, 0.26 + (i % 3) * 0.1, 0.05, i % 2 ? b.m('#c9ccd1', 0.3, 0.8) : b.m('#e0a100', 0.5), s * 6.95, 1.55, -2.1 + i * 0.36, 0, { r: 0.01, sh: false });
    for (let i = 0; i < 3; i++) k.sign(1.5, 0.5, k.letters([[['PARTNER', 'TECHNICAL', 'OFFICIAL'][i], 90, i === 1 ? ink(col) : '#16181d', 900]], i === 1 ? col : '#f2f2ef'), s * 6.96, 3.1, -2.6 + i * 2.4, -s * PI / 2, 512);
    b.box(0.12, 0.08, 9.6, b.m('#c9ccd1', 0.4, 0.6), s * 6.92, 3.95, 0, 0, { r: 0.01, sh: false }); b.tube([[s * 6.9, 3.9, -4.4], [s * 6.86, 3.5, -4.5], [s * 6.88, 1.2, -4.75]], 0.012, b.m('#101114', 0.7), { sh: false });
    PR.vent(b, s * 6.99, 3.5, 3.3, -s * PI / 2, 0.8, 0.3);
  }
  PR.door(b, -3.6, -4.99, 0, { col: '#cfd2d7', h: 2.0, w: 0.85 }); if (!o.fia) k.sign(0.5, 0.16, k.letters([['ENGINEERS', 40, '#ffffff', 800]], '#16181d'), -3.6, 2.2, -4.975, 0, 256);
  // overhead: the truss and its lamps, the light box over the bay, the boom with its lines down to the car
  for (const z of [-2.6, 0.2, 3]) { PR.truss(b, -6.9, 4.05, z, 6.9, z, 0.26, b.m('#2a2d33', 0.5, 0.6)); PR.linear(b, -4.6, 3.86, z, 3.6, false, '#f4f7ff', 2.3); PR.linear(b, 4.6, 3.86, z, 3.6, false, '#f4f7ff', 2.3); }
  b.box(3.3, 0.14, 5.6, b.m('#22252b', 0.5, 0.5), 0, 3.72, 0.2, 0, { r: 0.03, sh: false }); b.box(3.1, 0.02, 5.4, b.glow('#f4f8ff', 1.9), 0, 3.64, 0.2, 0, { sh: false }); for (const sx of [-1.4, 1.4]) for (const sz of [-2.2, 2.6]) b.cyl(0.012, 0.012, 0.6, b.m('#8d9198', 0.4, 0.8), sx, 4.1, sz, 6, { sh: false });
  b.box(0.16, 0.16, 5.2, b.m(col, 0.4, 0.3), 2.25, 3.3, 0.6, 0, { r: 0.03, sh: false }); b.box(0.16, 0.16, 5.2, b.m(col, 0.4, 0.3), -2.25, 3.3, 0.6, 0, { r: 0.03, sh: false });
  for (const [hx, hz] of [[2.25, 2.4], [-2.25, 2.4], [2.25, -1.2], [-2.25, -1.2]]) { b.torus(0.16, 0.035, b.m('#e0a100', 0.6), hx, 3.12, hz, { rx: PI / 2, sh: false }); const sg = hx > 0 ? 1 : -1; b.tube([[hx, 3.1, hz], [hx + sg * 0.2, 2.75, hz + 0.08], [hx + sg * 0.32, 2.55, hz]], 0.014, b.m('#e0a100', 0.6), { sh: false }); b.cyl(0.045, 0.045, 0.2, b.m('#2a2d33', 0.35, 0.7), hx + sg * 0.33, 2.45, hz, 12, { sh: false }); b.box(0.04, 0.05, 0.14, b.m('#e0a100', 0.5), hx + sg * 0.33, 2.47, hz + 0.08, 0, { r: 0.012, sh: false }); }
  // outside: the pit lane and its lines, the pit wall and its fence, a stand beyond the track, the sky
  k.floor(60, 14, b.surf('asphalt', o.night ? '#2a2d34' : '#62666d'), -0.01, 0, 12); k.floor(60, 0.16, b.m('#f2f2ef', 0.6), 0.004, 0, 8.6); k.floor(60, 0.16, b.m('#e0a100', 0.6), 0.004, 0, 5.3); k.floor(8, 0.14, b.m(col, 0.5), 0.004, 0, 7.9);
  b.box(60, 1.05, 0.35, b.surf('concrete', '#c9ccd1'), 0, 0.525, 17, 0, { r: 0 }); for (let i = -8; i <= 8; i++) b.cyl(0.04, 0.04, 2.5, b.m('#8d9198', 0.4, 0.7), i * 3.5, 2.3, 17, 6, { sh: false });
  b.box(60, 2.4, 0.04, b.m('#3d424b', 0.6, 0.4, { transparent: true, opacity: 0.3 }), 0, 2.25, 17, 0, { r: 0, sh: false });
  grandstand(k, b, 0, 34, 70, PI, col, o.night);
  backdrop(k, 160, 50, 0, 20, 46, PI, o.night ? '#05070f' : '#6fa3dc', o.night ? '#141a2e' : '#cfe1f2', o.night);
  b.done();
  k.light.hemi(0xffffff, 0x5a5f68, o.night ? 0.5 : 0.75); k.light.key(0xffffff, o.night ? 1.3 : 1.8, [3.5, 9, 6], [0, 0, -0.5], true, 9); k.light.key(0xfff1e0, o.night ? 0.35 : 0.7, [-6, 3, 9], [0, 1.4, 2], false);
  k.light.point(col, 4, [-5.5, 2.4, -3.8], 7); k.light.point(col, 4, [5.5, 2.4, -3.8], 7); k.light.point(0xdfe8ff, 14, [0, 3.4, 0.5], 12); k.env(0.5);
  return { car: [0, 0, 0.3], carFace: 0, screens: scr, col };
}
/**
 * The pit wall's stand: five stools under the canopy (the team's name on its fascia), the screens before them, the
 * track in front (+z) behind its fence, the pit lane and the garages behind. People on it face +z. o: { night, screens }
 */
export function pitwall(k, T, o = {}) {
  const col = T.color, b = k.batch(), st = b.m('#c9ccd1', 0.4, 0.6), dk = b.m('#17181c', 0.5, 0.3), XS = [-2.4, -1.2, 0, 1.2, 2.4];
  // the ground: the pit lane (its fast lane's line, the boxes), the track (its edge, the grid's slots)
  k.floor(70, 18.6, b.surf('asphalt', o.night ? '#25282e' : '#5b5f66'), 0, 0, -7.7); k.floor(70, 16, b.surf('asphalt', o.night ? '#1c1e23' : '#44474d'), 0, 0, 9.6);
  k.floor(70, 0.16, b.m('#f2f2ef', 0.6), 0.004, 0, -4.2); k.floor(70, 0.16, b.m('#e0a100', 0.6), 0.004, 0, -11.2); k.floor(70, 0.2, b.m('#ffffff', 0.6), 0.004, 0, 2.05);
  for (let i = -4; i <= 4; i++) { k.floor(5.6, 0.12, b.m(i ? '#f2f2ef' : col, 0.6), 0.004, i * 7.6, -11.9); k.floor(0.12, 3.6, b.m(i ? '#f2f2ef' : col, 0.6), 0.004, i * 7.6 - 2.8, -13.7); k.floor(0.12, 3.6, b.m(i ? '#f2f2ef' : col, 0.6), 0.004, i * 7.6 + 2.8, -13.7); }
  for (let i = -3; i <= 3; i++) { const gx = i * 8 + (i % 2 ? 0 : 0), gz = i % 2 ? 6.2 : 11.4; k.floor(0.14, 2.2, b.m('#ffffff', 0.6), 0.004, gx, gz); k.floor(0.9, 0.14, b.m('#ffffff', 0.6), 0.004, gx - 0.45, gz - 1.1); k.floor(0.9, 0.14, b.m('#ffffff', 0.6), 0.004, gx - 0.45, gz + 1.1); }
  // the wall and its fence (open before the stand)
  b.box(70, 1.05, 0.35, b.surf('concrete', '#c9ccd1'), 0, 0.525, 1.35, 0, { r: 0 }); b.box(70, 0.12, 0.4, b.m(col, 0.5), 0, 1.11, 1.35, 0, { r: 0, sh: false });
  for (let i = -10; i <= 10; i++) { const px = i * 3.4; if (Math.abs(px) < 4.4) continue; b.cyl(0.045, 0.045, 2.6, st, px, 2.4, 1.45, 8); b.cyl(0.045, 0.045, 0.7, st, px, 3.9, 1.22, 8, { rx: -0.7 }); }
  const mesh = k.tex(256, 256, (c, W, H) => { c.clearRect(0, 0, W, H); c.strokeStyle = 'rgba(190,196,204,.8)'; c.lineWidth = 2; for (let i = -8; i <= 16; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32 + H, H); c.stroke(); c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32 - H, H); c.stroke(); } }); mesh.wrapS = mesh.wrapT = k.THREE.RepeatWrapping;
  for (const sx of [-1, 1]) { const t = mesh.clone(); k.own(t); t.needsUpdate = true; t.repeat.set(30.6 / 0.5, 2.6 / 0.5); const m = k.own(new k.THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, side: k.THREE.DoubleSide, color: o.night ? 0x8a8f98 : 0xd9dce1 })); k.plane(30.6, 2.6, m, sx * 19.7, 2.4, 1.45, 0).renderOrder = 3; }
  // the stand: its deck and steps, the desk and the screens, the stools, the canopy
  b.box(7.2, 0.25, 2.0, b.m('#2b2e35', 0.6, 0.2), 0, 0.125, 0, 0, { r: 0.01 }); b.box(7.1, 0.012, 1.9, b.surf('perf', '#3a3d44'), 0, 0.256, 0, 0, { r: 0, sh: false });
  for (const sx of [-1, 1]) { b.box(0.5, 0.125, 0.9, b.m('#2b2e35', 0.6, 0.2), sx * 3.85, 0.0625, -0.4, 0, { r: 0.008 }); b.tube([[sx * 3.55, 0.25, -0.95], [sx * 3.55, 1.25, -0.95], [sx * 3.55, 1.25, 0.2]], 0.02, st); }
  b.box(7.0, 0.07, 0.62, b.m('#17181c', 0.4, 0.3), 0, 1.3, 0.62, 0, { r: 0.015 }); b.box(7.0, 1.02, 0.05, b.m(col, 0.45), 0, 0.77, 0.9, 0, { r: 0.008 });
  const scr = [];
  XS.forEach((sx, i) => {
    PR.stool(b, sx, -0.2, 0, '#1b1d22', 0.84, 0.25);
    b.box(0.64, 0.42, 0.05, b.m('#0d0e11', 0.5), sx, 1.5, 0.725, 0, { r: 0.012, sh: false }); scr.push(k.screen(0.56, 0.34, (o.screens || [])[i] || paintTable(['GAPS', 'TYRES', 'TIMING', 'WEATHER', 'FUEL'][i], [], col), sx, 1.5, 0.695, PI, 1.2, 256));
    b.cyl(0.02, 0.02, 0.2, dk, sx, 1.4, 0.76, 8, { sh: false });
    b.box(0.34, 0.012, 0.12, b.m('#26282e', 0.7), sx, 1.342, 0.5, 0, { r: 0.004, sh: false }); for (let q = 0; q < 4; q++) b.cyl(0.012, 0.012, 0.012, b.glow(['#ff3b30', '#ffd400', '#34c759', '#ffffff'][q], 1.3), sx - 0.24 + q * 0.035, 1.342, 0.38, 8, { sh: false });
    if (i % 2) PR.bottle(b, sx + 0.42, 1.335, 0.5, '#9fd0e8', 0.9); else PR.headset(b, sx + 0.45, 1.39, 0.6, 0.5, '#17181c');
  });
  for (const [px, pz] of [[-3.5, -0.9], [3.5, -0.9], [-3.5, 0.9], [3.5, 0.9]]) b.cyl(0.05, 0.05, 2.75, st, px, 1.6, pz, 10);
  b.box(7.5, 0.1, 2.3, b.m(col, 0.5), 0, 3.0, 0, 0, { r: 0.02, sh: false }); b.box(7.5, 0.44, 0.05, b.m(col, 0.5), 0, 2.74, 1.13, 0, { r: 0, sh: false }); b.box(7.5, 0.44, 0.05, b.m(col, 0.5), 0, 2.74, -1.13, 0, { r: 0, sh: false });
  k.sign(7.4, 0.42, k.letters([[T.name.toUpperCase(), 110, ink(col), 900]], col), 0, 2.74, 1.16, 0, 1536); k.sign(7.4, 0.42, k.letters([[T.name.toUpperCase(), 110, ink(col), 900]], col), 0, 2.74, -1.16, PI, 1536);
  PR.linear(b, 0, 2.9, 0, 6.6, false, '#fff6e6', 1.7); b.box(0.5, 0.3, 0.3, dk, 3.2, 2.75, 0.5, 0, { r: 0.02, sh: false }); b.cyl(0.02, 0.02, 1.4, st, -3.2, 3.7, 0, 6, { sh: false }); b.ball(0.05, b.glow('#ff3b30', 1.5), -3.2, 4.42, 0, { seg: 10, sh: false });
  // behind: the garages (their doors, the lit bays, yours named), what stands in the lane
  b.box(70, 6.2, 0.4, b.surf('panel', '#e0e2e6'), 0, 3.1, -17.2, 0, { r: 0 }); b.box(70, 0.9, 0.5, b.m('#22252b', 0.6), 0, 6.4, -17.15, 0, { r: 0, sh: false }); b.box(70, 1.1, 0.06, b.m('#1a2633', 0.1, 0.6), 0, 5.0, -16.97, 0, { r: 0, sh: false });
  for (let i = -4; i <= 4; i++) { const gx = i * 7.6; b.box(6.2, 3.4, 0.08, b.m('#0c0d10', 0.8), gx, 1.7, -16.97, 0, { r: 0, sh: false }); b.box(5.6, 0.5, 0.06, b.glow(i ? '#dfe6f2' : '#ffffff', i ? 0.55 : 0.9), gx, 3.0, -16.92, 0, { sh: false }); b.box(6.4, 0.5, 0.1, b.m(i ? ['#27f4d2', '#ff8000', '#3671c6', '#229971', '#6692ff', '#b6babd', '#52e252', '#ff87bc'][(i + 8) % 8] : col, 0.5), gx, 3.75, -16.95, 0, { r: 0, sh: false }); if (i) PR.tyres(b, gx - 2.4, -15.9, 3, '#2a2d33'); }
  k.sign(10, 1.1, k.letters([[T.name.toUpperCase(), 150, ink(col), 900]], col), 0, 4.5, -16.93, 0, 1024); PR.tyres(b, -2.6, -15.8, 4, col); PR.tyres(b, 2.6, -15.8, 4, col); PR.flightCase(b, 4.1, -15.9, 0, 1.2, 0.8, 0.6);
  const lane = []; for (let i = 0; i < 9; i++) lane.push({ x: -30 + i * 7.6 + k.rnd() * 3, z: -15.2 + k.rnd() * 1.4, face: k.rnd() * 6.28, pose: ['talk', 'cross', 'hips', 'talk'][i % 4], kit: 'polo', top: i % 3 ? '#2a2d33' : col }); k.crowd(lane, { shadow: false });
  // before: the far barrier and its boards, the stand full of people, the sky
  b.box(70, 1.1, 0.3, b.surf('concrete', '#c9ccd1'), 0, 0.55, 17.6, 0, { r: 0 }); for (let i = -4; i <= 4; i++) k.sign(7.4, 0.9, k.letters([[i % 2 ? T.name.toUpperCase() : 'GRAND PRIX', 120, i % 2 ? ink(col) : '#16181d', 900]], i % 2 ? col : '#f2f2ef'), i * 7.6, 0.6, 17.42, PI, 768);
  grandstand(k, b, 0, 26, 70, PI, col, o.night);
  backdrop(k, 160, 50, 0, 20, 40, PI, o.night ? '#04060d' : '#5f97d6', o.night ? '#161c33' : '#cfe1f2', o.night); backdrop(k, 160, 50, 0, 20, -34, 0, o.night ? '#04060d' : '#5f97d6', o.night ? '#161c33' : '#cfe1f2', o.night);
  if (o.night) for (let i = -2; i <= 2; i++) { b.cyl(0.12, 0.16, 16, st, i * 16, 8, 19.5, 8, { sh: false }); b.box(2.4, 1.0, 0.2, b.glow('#f4f8ff', 2.6), i * 16, 16.2, 19.4, 0, { sh: false, rx: 0.4 }); }
  b.done();
  k.light.hemi(o.night ? 0x8fa0ff : 0xffffff, 0x4a4d55, o.night ? 0.5 : 1.0); k.light.key(o.night ? 0xdfe8ff : 0xfff3df, o.night ? 1.6 : 2.2, [5, 10, 9], [0, 1, 0], true, 9);
  k.light.point(0xbfd4ff, 5, [0, 1.5, 0.3], 3.5); k.env(0.4, o.night ? 0.3 : 0.7);
  return { seats: XS.map((sx) => [sx, 0.62, -0.2]), stand: XS.map((sx) => [sx, 0.25, -0.55]), screens: scr, col };
}
/**
 * The boardroom: the long table (along x), eight chairs and one at each end, a wall of windows on the city (z = -4),
 * a screen on the end wall (x = -6: o.screen, a painter) over a sideboard, the door and the pictures. o: { night }
 */
export function boardroom(k, T, o = {}) {
  const b = k.batch(), oak = '#4a3423', dkw = b.surf('slats', '#3d2c20'), br = b.m('#b08d57', 0.3, 0.85);
  shell(k, b, 12.4, 8.4, 3.4, { open: 'n', floor: b.surf('carpet', '#2a2d36'), w: dkw, wall: b.surf('plaster', '#d6d2c9'), ceil: b.surf('plaster', '#eeeeea') });
  k.floor(8.6, 4.4, b.surf('cloth', '#3b3f4b', { size: 0.5 }), 0.004, 0, 0);
  // the windows: the city beyond them, the mullions, the sill, the blinds drawn up
  k.plane(15, 4.7, k.own(new k.THREE.MeshBasicMaterial({ map: skyline(k, o.night), fog: false })), 0, 1.9, -5.6, 0);
  for (let i = -6; i <= 6; i += 2) b.box(0.08, 3.4, 0.14, b.m('#17181c', 0.5, 0.4), i, 1.7, -4.2, 0, { r: 0.01 }); b.box(12.4, 0.5, 0.2, b.m('#17181c', 0.5, 0.4), 0, 0.25, -4.2, 0, { r: 0 }); b.box(12.4, 0.035, 0.34, b.surf('wood', oak), 0, 0.518, -4.14, 0, { r: 0.008 }); b.box(12.4, 0.16, 0.16, b.m('#d9d6cf', 0.6), 0, 3.32, -4.2, 0, { r: 0.02, sh: false });
  b.box(12.4, 3.4, 0.012, b.m('#9fb4c8', 0.04, 0.2, { transparent: true, opacity: 0.1 }), 0, 1.7, -4.26, 0, { r: 0, sh: false });
  // the table and what is on it, the chairs
  PR.table(b, 6.6, 1.5, 0, 0, 0.78, oak, 0, { kind: 'ped', rough: 0.26 }); b.box(3.2, 0.006, 0.26, b.m('#17181c', 0.5, 0.3), 0, 0.783, 0, 0, { r: 0, sh: false });
  const seats = []; for (const sx of [-2.4, -0.8, 0.8, 2.4]) { PR.chair(b, sx, -1.2, 0, '#1b1d22', 0.46, { high: true }); PR.chair(b, sx, 1.2, PI, '#1b1d22', 0.46, { high: true }); seats.push([sx, 0, -1.2, 0], [sx, 0, 1.2, PI]);
    for (const sz of [-0.5, 0.5]) { const q = k.rnd(); if (q < 0.55) PR.papers(b, sx + 0.05, 0.78, sz, sz > 0 ? PI : 0, 2 + ((k.rnd() * 3) | 0)); else PR.laptop(b, sx, 0.78, sz * 0.9, sz > 0 ? PI : 0, null); PR.glass(b, sx + 0.33, 0.78, sz * 0.75); } }
  PR.chair(b, -3.9, 0, PI / 2, '#1b1d22', 0.46, { high: true }); PR.chair(b, 3.9, 0, -PI / 2, '#1b1d22', 0.46, { high: true });
  for (const sx of [-1.4, 1.4]) { b.lathe([[0, 0], [0.16, 0], [0.16, 0.012], [0, 0.012]], b.m('#c9ccd1', 0.25, 0.85), sx, 0.78, 0, 28); PR.bottle(b, sx - 0.05, 0.792, 0.04, '#9fd0e8', 1.15); PR.bottle(b, sx + 0.06, 0.792, -0.03, '#b7e0c0', 1.15); PR.glass(b, sx + 0.02, 0.792, 0.1); }
  b.lathe([[0, 0], [0.13, 0], [0.11, 0.03], [0.04, 0.045], [0, 0.045]], b.m('#101114', 0.4, 0.3), 0, 0.786, 0, 3, { ry: 0.5 });
  // the end wall: the screen over a sideboard; the other end: pictures, a second sideboard, the door
  b.box(0.08, 2.0, 3.5, b.m('#0d0e11', 0.5), -5.96, 1.95, 0, 0, { r: 0.012, sh: false }); const scr = k.screen(3.3, 1.86, o.screen || paintTable('CONSTRUCTORS', [], T.color), -5.91, 1.95, 0, PI / 2, 1.1, 768);
  b.box(0.45, 0.62, 3.6, b.surf('wood', oak, { rough: 0.3 }), -5.76, 0.37, 0, 0, { r: 0.01 }); for (const sz of [-1.2, 0, 1.2]) b.box(0.012, 0.03, 0.3, br, -5.53, 0.5, sz, 0, { r: 0.004 }); PR.deskLamp(b, -5.76, 0.68, -1.5, PI / 2); PR.cup(b, -5.76, 1.45, 0.68, b.m('#d9b04a', 0.22, 0.95), 0.6);
  PR.picture(b, 5.99, 1.75, -1.5, -PI / 2, 1.5, 1.0, paintPoster(T, T.name, 0)); PR.picture(b, 5.99, 1.75, 0.5, -PI / 2, 1.5, 1.0, paintPoster(T, 'Est.', 1));
  b.box(0.45, 0.9, 1.8, b.surf('wood', oak, { rough: 0.3 }), 5.76, 0.45, -0.5, 0, { r: 0.01 }); b.box(0.3, 0.34, 0.24, b.m('#101114', 0.3, 0.5), 5.76, 1.07, -1.0, 0, { r: 0.03 }); for (let i = 0; i < 5; i++) PR.mug(b, 5.72 + (i % 2) * 0.1, 0.9, -0.5 + i * 0.12, '#f1efe8'); PR.bottle(b, 5.76, 0.9, 0.2, '#b7e0c0', 1.2);
  PR.door(b, 3.6, 4.19, PI, { wood: true, col: oak, h: 2.2 }); PR.picture(b, -1.8, 1.8, 4.19, PI, 2.2, 1.1, paintPoster(T, `${T.name}`, 1), '#17181c', 512); PR.picture(b, 1.2, 1.8, 4.19, PI, 1.1, 1.1, paintPoster(T, '01', 0));
  PR.plant(b, -5.4, 3.5, 1.7); PR.plant(b, 5.5, 3.4, 1.4, '#22252b'); PR.plant(b, 5.5, -3.5, 1.6, '#22252b'); PR.bin(b, 5.2, 2.2);
  // the ceiling: a raft of slats over the table and its lamps, lamps let in round the room
  b.box(7.4, 0.1, 2.3, b.surf('slats', '#5a4030'), 0, 3.1, 0, 0, { r: 0, sh: false }); for (const sx of [-3.4, 3.4]) for (const sz of [-0.9, 0.9]) b.cyl(0.01, 0.01, 0.3, br, sx, 3.28, sz, 6, { sh: false });
  for (const sx of [-2, 0, 2]) { PR.pendant(b, sx, 2.2, 0, 3.05, '#17181c', '#ffe2b0', 0.26); k.light.point(0xffd9a0, 9, [sx, 2.1, 0], 7); }
  downlights(b, 3.4, [-5, -2.5, 2.5, 5], [-3, 3], '#ffe9c8', 1.8);
  b.done();
  k.light.hemi(o.night ? 0x6b78a8 : 0xffe6c4, 0x2a2622, o.night ? 0.35 : 0.6); k.light.key(o.night ? 0x8fa6ff : 0xffb880, o.night ? 0.7 : 1.3, [0, 4, -9], [0, 1, 0], true, 8); k.env(0.3, 0.4);
  return { seats, head: [3.9, 0, 0, -PI / 2], foot: [-3.9, 0, 0, PI / 2], screen: scr };
}
/**
 * The team principal's office: the desk (you behind it, facing +z), two chairs before it, a window on the city
 * (z = -3.5), a wall screen (x = -4: o.screen), shelves of books and of what the team has won (o.cups), a sofa by the
 * door. o: { night }
 */
export function office(k, T, o = {}) {
  const b = k.batch(), wal = '#3a2a1e';
  shell(k, b, 8.4, 7.4, 3.2, { open: 'n', floor: b.surf('planks', '#4a3829'), w: b.surf('slats', '#33261c'), wall: b.surf('plaster', '#cfccc5'), ceil: b.surf('plaster', '#ecebe7') });
  k.floor(4.4, 3.4, b.surf('cloth', '#5a5248', { size: 0.6 }), 0.004, 0, -0.7);
  k.plane(11, 4.4, k.own(new k.THREE.MeshBasicMaterial({ map: skyline(k, o.night !== false), fog: false })), 0, 1.8, -5.2, 0);
  for (let i = -4; i <= 4; i += 2) b.box(0.07, 3.2, 0.12, b.m('#17181c', 0.5, 0.4), i, 1.6, -3.7, 0, { r: 0.01 }); b.box(8.4, 0.45, 0.2, b.m('#17181c', 0.5, 0.4), 0, 0.225, -3.7, 0, { r: 0 }); b.box(8.4, 0.035, 0.32, b.surf('wood', wal), 0, 0.468, -3.64, 0, { r: 0.008 });
  b.box(8.4, 3.2, 0.012, b.m('#9fb4c8', 0.04, 0.2, { transparent: true, opacity: 0.1 }), 0, 1.6, -3.76, 0, { r: 0, sh: false });
  // the desk and what is on it
  PR.table(b, 2.3, 0.95, 0, -1.0, 0.78, wal, 0, { kind: 'panel', rough: 0.3 }); PR.chair(b, 0, -1.85, 0, '#15161a', 0.46, { high: true }); PR.chair(b, -0.7, 0.35, PI, '#1b1d22', 0.46); PR.chair(b, 0.7, 0.35, PI, '#1b1d22', 0.46);
  const lamp = PR.deskLamp(b, -0.92, 0.78, -1.2, 0.5); k.light.point(0xffc98a, 7, [lamp[0] - k.org.x * 0, lamp[1] + 0.05, lamp[2]], 6);
  PR.laptop(b, -0.3, 0.78, -1.0, PI + 0.15, '#9fc0ff'); PR.phone(b, -0.02, 0.78, -0.66, 0.3); PR.mug(b, -0.62, 0.78, -0.72, '#17181c'); PR.papers(b, 0.86, 0.78, -1.22, 0.25, 4); b.box(0.26, 0.05, 0.32, b.m('#2a1f16', 0.5), -0.78, 0.805, -0.95, 0.1, { r: 0.008 });
  // the wall screen over a sideboard; the shelves; the sofa, the door
  b.box(0.08, 1.95, 3.3, b.m('#0d0e11', 0.5), -3.96, 1.75, 0.4, 0, { r: 0.012, sh: false }); const scr = k.screen(3.1, 1.76, o.screen || paintTable('CONSTRUCTORS', [], T.color), -3.91, 1.75, 0.4, PI / 2, 1.05, 768);
  b.box(0.42, 0.55, 2.8, b.surf('wood', wal, { rough: 0.3 }), -3.78, 0.33, 0.4, 0, { r: 0.01 }); PR.helmet(b, -3.78, -0.5, 0.605, T.color, PI / 2, T.color2 || '#ffffff'); PR.binder(b, -3.78, 0.605, 1.2, 0.2, '#2a3a5a'); PR.binder(b, -3.78, 0.65, 1.22, -0.1, '#5a2a2a');
  PR.shelves(b, 3.99, -0.6, -PI / 2, 3.3, { h: 2.35, rows: 5, cups: Math.min(7, o.cups || 0), cupRow: 3, wood: wal });
  PR.sofa(b, -1.9, 3.05, PI, 2.1, '#3a3d44', { leather: true, pillow: T.color }); PR.roundTable(b, -1.9, 1.95, 0.4, 0.42, '#2a1f16'); PR.mug(b, -1.8, 0.42, 1.9, '#f1efe8'); PR.door(b, 2.6, 3.69, PI, { wood: true, col: wal });
  PR.picture(b, -1.9, 1.85, 3.69, PI, 1.8, 0.9, paintPoster(T, T.name, 1), '#17181c', 512); PR.picture(b, 0.6, 1.85, 3.69, PI, 0.8, 0.9, paintPoster(T, '01', 0)); PR.clock(b, 2.6, 2.6, 3.69, PI, 0.15);
  PR.plant(b, 3.5, -3.0, 1.7, '#22252b'); PR.floorLamp(b, -3.5, -3.05, 1.65); k.light.point(0xffc98a, 5, [-3.4, 1.6, -3.0], 5); PR.plant(b, 3.6, 3.1, 1.2); PR.bin(b, 1.5, -1.5);
  downlights(b, 3.2, [-2.6, 0, 2.6], [-2, 1.2], '#ffe9c8', 1.6);
  b.done();
  k.light.hemi(0x7f8cc0, 0x2a2622, 0.4); k.light.key(0x9fb4ff, 0.8, [1, 4, -8], [0, 1, 0], true, 6); k.light.spot(0xfff0dc, 26, [0, 3.0, 1.6], [0, 1.0, -1.2], 0.7, 0.8); k.env(0.28, 0.35);
  return { you: [0, 0, -1.85, 0], guests: [[-0.7, 0, 0.35, PI], [0.7, 0, 0.35, PI]], stand: [[-1.6, 0, 0.9, PI * 0.85], [1.6, 0, 0.9, -PI * 0.85]], screen: scr };
}
/**
 * The press room: the table on its low stage (three places, facing +z), the board of sponsors behind it (o.names: the
 * names printed on it) between its drapes, the press in rows before it - seated, the photographers down the sides, the
 * television cameras at the back - their flashes. o: { names, rows }
 */
export function pressroom(k, T, o = {}) {
  const b = k.batch(), col = T.color, drape = b.surf('cloth', '#161a26', { size: 0.6 }), pan = b.surf('cloth', '#232733', { size: 0.5 });
  k.floor(16, 12.4, b.surf('carpet', '#23262e'), 0, 0, 2.9); b.box(16.4, 0.2, 12.6, b.m('#0c0d10', 0.9), 0, 4.2, 2.9, 0, { sh: false, r: 0 });
  b.box(16.4, 4.1, 0.2, b.surf('plaster', '#15171c'), 0, 2.05, -3.3, 0, { r: 0 }); b.box(0.2, 4.1, 12.4, b.surf('plaster', '#181a20'), -8.1, 2.05, 2.9, 0, { r: 0 }); b.box(0.2, 4.1, 12.4, b.surf('plaster', '#181a20'), 8.1, 2.05, 2.9, 0, { r: 0 }); b.box(16.4, 4.1, 0.2, b.surf('plaster', '#181a20'), 0, 2.05, 9.2, 0, { r: 0 });
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) b.box(0.07, 2.0, 1.5, pan, s * 7.96, 2.0, -1.6 + i * 1.8, 0, { r: 0.03, sh: false });
  // the board, framed, between drapes; lamps on the floor washing it
  const names = (o.names && o.names.length ? o.names : [T.name]).slice(0, 6);
  b.box(8.24, 3.24, 0.08, b.m('#101114', 0.5, 0.4), 0, 2.0, -2.95, 0, { r: 0.01 }); for (const sx of [-3.9, 3.9]) b.box(0.08, 0.5, 0.6, b.m('#101114', 0.5, 0.4), sx, 0.25, -2.95, 0, { r: 0.01 });
  k.sign(8, 3, (x, W, H) => { x.fillStyle = '#f3f4f6'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const n = (r + c) % (names.length + 1), t = n === 0 ? T.name : names[n - 1]; x.font = `900 ${H * 0.062}px ${FONT}`; x.fillStyle = n === 0 ? T.color : '#1a1c21'; x.fillText(String(t).toUpperCase().slice(0, 14), W * (0.1 + c * 0.2), H * (0.1 + r * 0.2)); } }, 0, 2.0, -2.9, 0, 1536, { color: '#9da1a8' });
  for (const s of [-1, 1]) { for (let i = 0; i < 20; i++) b.cyl(0.1, 0.1, 3.9, drape, s * (4.35 + i * 0.185), 1.95, -3.08 + (i % 2) * 0.05, 8, { sh: false }); b.box(0.12, 3.6, 0.12, b.glow(col, 1.3), s * 4.18, 1.9, -2.98, 0, { sh: false, r: 0.02 }); }
  // the stage, the table in its cloth, the three places
  b.box(6.4, 0.3, 2.5, b.m('#2b2e35', 0.8), 0, 0.15, -1.65, 0, { r: 0.012 }); b.box(6.3, 0.012, 2.4, b.surf('carpet', '#34373f'), 0, 0.306, -1.65, 0, { r: 0, sh: false }); b.box(1.2, 0.15, 0.4, b.m('#2b2e35', 0.8), 3.9, 0.075, -1.0, 0, { r: 0.008 });
  b.box(4.6, 0.77, 0.7, b.surf('cloth', col, { size: 0.5 }), 0, 0.685, -1.1, 0, { r: 0.012 }); b.box(4.7, 0.05, 0.8, b.m('#17181c', 0.4, 0.2), 0, 1.07, -1.1, 0, { r: 0.012 });
  k.sign(2.6, 0.34, k.letters([[T.name.toUpperCase(), 96, ink(col), 900]], col), 0, 0.72, -0.742, 0, 768);
  const seats = [-1.3, 0, 1.3].map((sx) => { PR.chair(b, sx, -1.85, 0, '#1b1d22', 0.46, { y: 0.3 }); PR.mic(b, sx, 1.095, -0.95, PI, 0.24); PR.bottle(b, sx + 0.36, 1.095, -1.0); PR.glass(b, sx + 0.27, 1.095, -1.12); b.box(0.3, 0.085, 0.012, b.m('#f3f1ea', 0.8), sx - 0.3, 1.14, -0.84, 0, { rx: -0.3, r: 0.003 }); return [sx, 0.3, -1.85, 0]; });
  // the press: rows of chairs, most of them taken; photographers down the sides; cameras at the back
  const R = o.rows ?? 4, press = [], ppl = [];
  for (let r = 0; r < R; r++) for (let c = -4; c <= 4; c++) { const x = c * 0.78 + (r % 2) * 0.3, z = 1.6 + r * 1.0; PR.seat(b, x, z, PI, '#20232a'); if (k.rnd() < 0.12) continue; press.push({ x, z, face: PI }); ppl.push({ x, z: z + 0.02, face: PI + (k.rnd() - 0.5) * 0.2, pose: k.rnd() < 0.3 ? 'sitLean' : 'sit' }); }
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const x = s * (5.0 + i * 0.7 + k.rnd() * 0.2), z = 0.2 + i * 1.1 + k.rnd() * 0.4; ppl.push({ x, z, face: Math.atan2(-x, -1.5 - z), pose: i === 1 ? 'record' : 'photo', kit: 'polo' }); }
  for (const tx of [-5.2, -2.1, 2.6, 5.4]) { PR.tvCamera(b, tx, 6.2, PI + tx * 0.04); ppl.push({ x: tx + 0.45, z: 6.6, face: PI, pose: 'cross', kit: 'polo' }); }
  ppl.push({ x: -6.6, z: 7.4, face: 2.2, pose: 'talk' }, { x: -5.9, z: 7.9, face: -1.6, pose: 'phone' }, { x: 6.5, z: 5.2, face: PI, pose: 'hips' });
  k.crowd(ppl); PR.cables(b, -5.2, 6.4, -7.6, 8.6, 3); PR.cables(b, 2.6, 6.4, 7.6, 8.4, 2);
  // overhead: a truss of lamps on the stage; the doors at the back
  PR.truss(b, -7.8, 3.9, 2.6, 7.8, 2.6, 0.26, b.m('#2a2d33', 0.5, 0.6)); for (let i = 0; i < 6; i++) PR.stageLamp(b, -5 + i * 2, 3.78, 2.6, (i - 2.5) * 0.8, -1.4, i % 2 ? '#fff3df' : '#dfe8ff', 2.4);
  PR.speaker(b, -6.6, 3.6, -2.6, 0.3, 2); PR.speaker(b, 6.6, 3.6, -2.6, -0.3, 2);
  PR.door(b, -5.5, 9.09, PI, { col: '#2a2d33', exit: true }); PR.door(b, 5.5, 9.09, PI, { col: '#2a2d33', exit: true }); PR.table(b, 2.2, 0.7, 0, 8.3, 0.9, b.m('#17181c', 0.5), 0, { kind: 'panel' }); PR.laptop(b, -0.4, 0.9, 8.3, 0); PR.laptop(b, 0.5, 0.9, 8.3, 0.1, '#9fffc0');
  // the flashes: lamps that fire at random
  const fl = [0, 1, 2, 3].map(() => k.light.point(0xffffff, 0, [0, 1.5, 3], 14));
  k.each((t) => { fl.forEach((L, i) => { const ph = Math.floor(t * 3.1 + i * 1.7), on = ((ph * 2654435761) >>> 0) % 5 === 0 && (t * 3.1 + i * 1.7) % 1 < 0.12; L.intensity = on ? 60 : 0; if (on) L.position.set(k.org.x + ((ph * 7) % 9) - 4, 1.5, k.org.z + 2 + (ph % 4)); }); });
  b.done();
  k.light.hemi(0xffffff, 0x2a2622, 0.32); k.light.spot(0xfff3df, 80, [0, 3.8, 2.4], [0, 1.2, -1.6], 0.75, 0.6, true); k.light.spot(0xdfe8ff, 30, [-4, 3.6, 0], [0, 1.3, -1.6], 0.6, 0.8); k.light.spot(0xfff0dc, 26, [0, 3.9, 6], [0, 0.5, 3.4], 0.9, 0.9); k.env(0.2, 0.3);
  return { seats, press };
}
/**
 * The launch stage: the hall dark, the turntable, the wall of light behind it (o.wall: a painter), the rig of lamps and
 * its beams, the guests behind their barrier, their phones up. o: { wall, guests (0..1: how full the hall is) }
 */
export function stage(k, T, o = {}) {
  const b = k.batch(), col = T.color, dk = b.m('#0c0d11', 0.4, 0.4);
  k.floor(44, 34, b.m('#07080b', 0.32, 0.25)); b.box(15, 0.5, 6.4, b.m('#0e0f13', 0.25, 0.3), 0, 0.25, -1.2, 0, { r: 0.02 }); b.box(15, 0.05, 0.03, b.glow(col, 1.7), 0, 0.3, 2.02, 0, { sh: false });
  for (const s of [-1, 1]) for (let i = 0; i < 2; i++) b.box(1.4, 0.17 * (2 - i), 0.5, b.m('#0e0f13', 0.3, 0.3), s * 6.2, 0.085 * (2 - i), 2.25 + i * 0.5, 0, { r: 0.01 });
  b.lathe([[0, 0], [2.95, 0], [2.95, 0.05], [2.86, 0.08], [0, 0.08]], b.m('#191b21', 0.2, 0.5), 0, 0.5, -1.0, 72);
  const ring = k.cyl(2.97, 2.97, 0.03, k.glow(col, 2.5), 0, 0.545, -1.0, 64, { open: true, sh: false });
  b.box(13.3, 4.9, 0.2, b.m('#050506', 0.6), 0, 3.1, -4.45, 0, { r: 0 }); const wall = k.screen(13, 4.6, o.wall || k.letters([[T.name.toUpperCase(), 190, '#ffffff', 900]], '#050506'), 0, 3.1, -4.3, 0, 0.9, 2048);
  for (const s of [-1, 1]) { b.box(0.22, 5.4, 0.22, b.glow(col, 1.5), s * 6.95, 2.9, -4.3, 0, { sh: false, r: 0.03 }); b.box(0.22, 5.4, 0.22, b.glow('#cfd8ff', 0.9), s * 7.5, 2.9, -4.0, 0, { sh: false, r: 0.03 }); }
  // the rig: two trusses on their towers, the lamps, the loudspeakers
  for (const z of [-2.6, 2.4]) { PR.truss(b, -9, 8.3, z, 9, z, 0.42); for (let i = 0; i < 9; i++) PR.stageLamp(b, -8 + i * 2, 8.1, z, (i - 4) * 0.7, z < 0 ? -1 : 0, i % 2 ? col : '#cfd8ff', 2.6); }
  for (const s of [-1, 1]) { for (const z of [-2.6, 2.4]) for (const q of [-0.2, 0.2]) for (const w of [-0.2, 0.2]) b.cyl(0.025, 0.025, 8.5, b.m('#8d9198', 0.4, 0.8), s * 9.2 + q, 4.25, z + w, 6, { sh: false }); PR.speaker(b, s * 8.4, 7.4, 1.9, 0, 5); PR.speaker(b, s * 4.2, 0.63, 1.5, PI, 1); }
  const beams = []; for (let i = 0; i < 6; i++) {
    const g = k.own(new k.THREE.ConeGeometry(1.1, 9, 24, 1, true)); g.translate(0, -4.5, 0);
    const bm = new k.THREE.Mesh(g, k.own(new k.THREE.MeshBasicMaterial({ color: i % 2 ? T.color : '#cfd8ff', transparent: true, opacity: 0.09, depthWrite: false, side: k.THREE.DoubleSide, blending: k.THREE.AdditiveBlending })));
    bm.position.set(k.org.x - 6 + i * 2.4, 8.2, k.org.z - 2.5); bm.renderOrder = 8; k.S.add(bm); beams.push(bm);
  }
  k.each((t) => beams.forEach((bm, i) => { bm.rotation.z = Math.sin(t * 0.5 + i * 1.1) * 0.35; bm.rotation.x = 0.15 + Math.cos(t * 0.37 + i) * 0.2; }));
  // the guests behind the barrier, phones up; the cameras' platform at the back
  PR.barrier(b, -9.9, 3.1, 9.9, 3.1, b.m('#3a3d44', 0.4, 0.7));
  const full = o.guests ?? 0.8, heads = [], ppl = [], PZ = ['talk', 'record', 'cross', 'phone', 'record', 'hips', 'talk', 'photo'];
  for (let r = 0; r < 6; r++) for (let c = -9; c <= 9; c++) { if (k.rnd() > full) continue; const x = c * 0.72 + (r % 2) * 0.35 + (k.rnd() - 0.5) * 0.2, z = 3.75 + r * 0.95 + (k.rnd() - 0.5) * 0.25, pose = PZ[(k.rnd() * PZ.length) | 0]; heads.push({ x, z, face: PI }); ppl.push({ x, z, face: PI + (k.rnd() - 0.5) * 0.5, pose, top: ['#0f1116', '#1a1d25', '#22252d', '#2a2420', '#d9d6cf', '#14171d'][(k.rnd() * 6) | 0] }); if (pose === 'record') b.box(0.07, 0.13, 0.008, b.glow('#cfe0ff', 1.6), x + 0.1, 1.74, z - 0.34, 0, { sh: false }); }
  b.box(3.4, 0.7, 2.2, dk, 0, 0.35, 11.2, 0, { r: 0.01 }); PR.tvCamera(b, -0.9, 11.0, PI, 1.55, 0.7); PR.tvCamera(b, 0.9, 11.0, PI, 1.55, 0.7); ppl.push({ x: -0.45, z: 11.6, y: 0.7, face: PI, pose: 'cross', kit: 'polo' }, { x: 1.4, z: 11.6, y: 0.7, face: PI, pose: 'hips', kit: 'polo' });
  k.crowd(ppl, { shadow: false }); PR.cables(b, 0, 10, 7.8, 2.6, 3);
  b.done();
  k.light.hemi(0x5566aa, 0x000000, 0.18); const key = k.light.spot(0xffffff, 0, [0, 9, 4], [0, 0.8, -1], 0.42, 0.5, true); const rimL = k.light.spot(T.color, 0, [-6, 5, -3.6], [0, 0.8, -1], 0.7, 0.7), rimR = k.light.spot(0xbfd0ff, 0, [6, 5, -3.6], [0, 0.8, -1], 0.7, 0.7);
  k.light.spot(0x8fa0d8, 22, [0, 8, 9], [0, 1, 6], 0.9, 0.9);
  void ring; return { car: [0, 0.58, -1.0], wall, key, rimL, rimR, beams, heads };
}
/**
 * The cool-down room: the screen on the wall (z = -3: o.screen), the three who watch it, the sofa, the fridge, the
 * caps on the table - and the camera in the corner they forget. Small and bright.
 */
export function cooldown(k, T, o = {}) {
  const b = k.batch();
  shell(k, b, 7.4, 6.4, 3.0, { floor: b.surf('planks', '#9a8a74'), n: b.surf('plaster', '#1c1e24'), wall: b.surf('panel', '#e7e8eb', { size: [1.2, 3.0] }), ceil: b.surf('tile', '#f1f2f3') });
  k.floor(4.2, 3.0, b.surf('cloth', '#3a3d46', { size: 0.5 }), 0.004, 0, 0.2);
  b.box(2.9, 1.7, 0.07, b.m('#0d0e11', 0.5), 0, 1.75, -3.165, 0, { r: 0.012, sh: false }); const scr = k.screen(2.74, 1.54, o.screen || paintIncident({}), 0, 1.75, -3.125, 0, 1.25, 768);
  b.box(1.8, 0.09, 0.1, b.m('#17181c', 0.5), 0, 0.78, -3.14, 0, { r: 0.02, sh: false }); b.box(3.2, 0.05, 0.36, b.surf('wood', '#3a2a1e'), 0, 0.5, -3.0, 0, { r: 0.01 }); for (const sx of [-1.4, 1.4]) b.box(0.05, 0.5, 0.3, b.m('#17181c', 0.5), sx, 0.25, -3.0, 0, { r: 0.008 });
  for (let i = 0; i < 4; i++) PR.bottle(b, -1.2 + i * 0.11, 0.525, -3.0, i % 2 ? '#9fd0e8' : '#b7e0c0'); PR.plant(b, 3.15, -2.6, 1.5, '#22252b');
  k.sign(2.4, 0.3, k.letters([['COOL DOWN ROOM', 70, '#ffffff', 800]], '#e10600'), -2.2, 2.62, -3.19, 0, 512); b.box(7.4, 0.04, 0.02, b.m('#e10600', 0.5), 0, 1.05, 3.185, 0, { r: 0, sh: false }); b.box(0.02, 0.04, 6.4, b.m('#e10600', 0.5), -3.685, 1.05, 0, 0, { r: 0, sh: false }); b.box(0.02, 0.04, 6.4, b.m('#e10600', 0.5), 3.685, 1.05, 0, 0, { r: 0, sh: false });
  k.sign(2.4, 0.9, k.letters([['1   2   3', 150, '#16181d', 900]], '#f2f2ef'), -3.69, 2.0, 0.6, PI / 2, 512); PR.clock(b, 3.69, 2.4, 0.4, -PI / 2, 0.16);
  // the sofa and its towels, the fridge, the table of caps and bottles, the door
  PR.sofa(b, 0, 2.5, PI, 2.6, '#23262d', { leather: true }); for (const sx of [-0.8, 0.9]) b.box(0.34, 0.1, 0.26, b.surf('cloth', '#f1f2f3'), sx, 0.52, 2.36, 0.2 * sx, { r: 0.04, s: 2 });
  b.box(0.72, 1.85, 0.64, b.surf('brushed', '#c9ccd1'), 3.3, 0.925, 1.6, 0, { r: 0.02 }); b.box(0.02, 1.5, 0.5, b.glow('#bfe4ff', 1.1), 2.935, 1.0, 1.6, 0, { sh: false }); for (let r = 0; r < 4; r++) { b.box(0.03, 0.015, 0.5, b.m('#8d9198', 0.4, 0.7), 2.92, 0.36 + r * 0.38, 1.6, 0, { sh: false }); for (let i = 0; i < 6; i++) b.cyl(0.028, 0.028, 0.17, b.m(['#1f6fb5', '#2f8f5a', '#c8102e'][(r + i) % 3], 0.3), 2.915, 0.455 + r * 0.38, 1.4 + i * 0.08, 8, { sh: false }); }
  b.box(0.012, 1.56, 0.56, b.m('#dfeaf2', 0.05, 0.1, { transparent: true, opacity: 0.2 }), 2.895, 1.0, 1.6, 0, { sh: false, r: 0 });
  PR.table(b, 1.3, 0.5, -3.0, 0.4, 0.85, b.m('#2a2d33', 0.5, 0.2), PI / 2);
  [o.c1 || '#ffd400', o.c2 || '#c0c5cc', o.c3 || '#b0703a'].forEach((c, i) => { const m = b.surf('cloth', c, { size: 0.2 }); b.lathe([[0, 0], [0.098, 0], [0.1, 0.04], [0.075, 0.085], [0, 0.1]], m, -3.0, 0.85, 0.05 + i * 0.32, 24); b.box(0.1, 0.008, 0.15, m, -2.9, 0.856, 0.05 + i * 0.32, 0, { r: 0.004 }); });
  for (let i = 0; i < 4; i++) PR.bottle(b, -3.1, 0.85, -0.14 - (i % 2) * 0.08 + i * 0.0, i % 2 ? '#9fd0e8' : '#cfe8f4', 0.9 + (i % 2) * 0.1);
  PR.door(b, 3.69, -1.5, -PI / 2, { col: '#d9dbde', glass: true });
  // the camera in the corner (its lamp red: it is on), the lamps
  b.box(0.06, 0.06, 0.3, b.m('#22252b', 0.5, 0.5), -3.5, 2.75, -3.05, -0.8, { r: 0.01, sh: false }); b.box(0.12, 0.1, 0.24, b.m('#17181c', 0.4, 0.3), -3.38, 2.68, -2.92, -0.8, { r: 0.015, rx: 0.3, sh: false }); b.ball(0.012, b.glow('#ff2a2a', 2.5), -3.3, 2.69, -2.82, { seg: 8, sh: false });
  PR.linear(b, 0, 2.93, 0.4, 5, false, '#ffffff', 2); downlights(b, 3.0, [-2.6, 2.6], [-2, 2.2], '#ffffff', 1.6); PR.vent(b, 0, 2.6, 3.19, PI, 0.7, 0.28);
  b.done();
  k.light.hemi(0xffffff, 0x777a82, 0.95); k.light.key(0xffffff, 1.3, [2, 6, 4], [0, 1, 0], true, 6); k.light.point(0xffffff, 9, [0, 2.6, 0.4], 9); const tv = k.light.point(0x9fc0ff, 9, [0, 1.7, -2.2], 6); k.env(0.45, 0.7);
  return { screen: scr, tv, spots: [[-0.95, 0, 0.1], [0, 0, -0.2], [0.95, 0, 0.1]] };
}
/**
 * The stewards' room: the three behind their bench (facing +z) under the flags, the screen on the side wall (x = 5:
 * o.screen), the files along the other, the floor before them where the teams stand, the chairs where they wait.
 */
export function stewards(k, T, o = {}) {
  const b = k.batch(), oak = '#4a3423';
  shell(k, b, 10.4, 8.4, 3.3, { floor: b.surf('carpet', '#2d2823'), n: b.surf('slats', '#4a3525'), wall: b.surf('plaster', '#d2cfc8'), ceil: b.surf('tile', '#ecebe7') });
  k.sign(3.6, 0.45, k.letters([['RACE STEWARDS', 84, '#e9e2d0', 800]], '#2a1f16'), 0, 2.75, -4.185, 0, 768); b.box(3.76, 0.6, 0.03, b.m('#b08d57', 0.3, 0.85), 0, 2.75, -4.19, 0, { r: 0.006, sh: false });
  PR.flag(b, -3.5, -3.75, '#1f3b8a', 2.9, 0.4); PR.flag(b, 3.3, -3.75, '#f2f2ef', 2.9, 0.2);
  // the bench on its step: the desk, the three chairs, what each has before them
  b.box(5.4, 0.3, 1.8, b.m('#2b2e35', 0.8), 0, 0.15, -2.95, 0, { r: 0.012 }); b.box(5.3, 0.012, 1.74, b.surf('carpet', '#3a332c'), 0, 0.306, -2.93, 0, { r: 0, sh: false });
  b.box(4.8, 0.87, 0.7, b.surf('wood', oak, { rough: 0.34 }), 0, 0.725, -2.45, 0, { r: 0.012 }); b.box(4.9, 0.05, 0.8, b.surf('wood', '#2a1f16', { rough: 0.3 }), 0, 1.16, -2.45, 0, { r: 0.012 }); b.box(4.5, 0.5, 0.012, b.surf('wood', '#3a2a1e'), 0, 0.72, -2.094, 0, { r: 0, sh: false });
  const bench = [-1.4, 0, 1.4].map((sx, i) => { PR.chair(b, sx, -3.15, 0, '#15161a', 0.46, { y: 0.3, high: true }); PR.papers(b, sx, 1.185, -2.42, 0.1 * (i - 1), 3); PR.mic(b, sx + 0.3, 1.185, -2.2, PI, 0.22); PR.glass(b, sx - 0.36, 1.185, -2.3); if (i !== 1) PR.binder(b, sx - 0.42, 1.185, -2.58, 0.2, i ? '#2a3a5a' : '#5a2a2a'); else PR.laptop(b, sx - 0.5, 1.185, -2.5, PI + 0.3, null); return [sx, 0.3, -3.15, 0]; });
  PR.bottle(b, 0.75, 1.185, -2.55, '#9fd0e8', 1.1); PR.bottle(b, -0.7, 1.185, -2.6, '#9fd0e8', 1.1);
  // the screen on the side wall; the files; the chairs for those who wait; the door
  b.box(0.07, 1.95, 3.3, b.m('#0d0e11', 0.5), 5.165, 1.8, -0.4, 0, { r: 0.012, sh: false }); const scr = k.screen(3.1, 1.76, o.screen || paintIncident({}), 5.12, 1.8, -0.4, -PI / 2, 1.1, 768);
  b.box(0.4, 0.55, 2.6, b.surf('wood', oak), 4.98, 0.3, -0.4, 0, { r: 0.01 }); PR.shelves(b, -5.19, -0.6, PI / 2, 3.2, { h: 2.3, rows: 5, wood: oak });
  for (let i = 0; i < 6; i++) PR.seat(b, -2.4 + i * 0.6 + (i > 2 ? 1.2 : 0), 3.75, PI, '#2a2d33'); PR.door(b, 4.2, 4.19, PI, { wood: true, col: oak, glass: true }); PR.clock(b, 0, 2.7, 4.19, PI, 0.17); PR.plant(b, -4.6, 3.6, 1.6, '#22252b'); PR.plant(b, 4.6, -3.6, 1.3); PR.bin(b, -4.5, -3.6);
  PR.picture(b, -2.4, 1.9, 4.19, PI, 1.2, 0.8, (x, W, H) => { x.fillStyle = '#e9e4d6'; x.fillRect(0, 0, W, H); x.strokeStyle = '#2a1f16'; x.lineWidth = 6; x.lineJoin = 'round'; x.beginPath(); x.moveTo(W * 0.2, H * 0.7); x.bezierCurveTo(W * 0.1, H * 0.2, W * 0.5, H * 0.1, W * 0.6, H * 0.35); x.bezierCurveTo(W * 0.7, H * 0.55, W * 0.9, H * 0.3, W * 0.82, H * 0.75); x.bezierCurveTo(W * 0.7, H * 0.95, W * 0.3, H * 0.9, W * 0.2, H * 0.7); x.stroke(); });
  for (const sx of [-2.2, 2.2]) { PR.linear(b, sx, 3.24, -1, 1.6, false, '#fff1d6', 2); PR.linear(b, sx, 3.24, 2, 1.6, false, '#fff1d6', 1.6); }
  b.done();
  k.light.hemi(0xfff1dc, 0x2a2622, 0.55); k.light.key(0xfff3df, 1.2, [-3, 6, 5], [0, 1, -1], true, 7); k.light.spot(0xfff0dc, 30, [0, 3.1, -0.6], [0, 1.2, -3], 0.8, 0.8); k.env(0.28, 0.4);
  return { bench, screen: scr, floor: [[-1.5, 0, 0.9, PI], [-0.6, 0, 1.3, PI], [1.6, 0, 0.9, PI], [2.5, 0, 1.3, PI]] };
}
/** A documentary's interview: a chair in the dark, a wash of the team's colour behind, the lamps and the camera that make it. -> { seat } */
export function studio(k, T, o = {}) {
  const b = k.batch(), col = o.color || T.color;
  k.floor(16, 16, b.m('#0a0b0e', 0.45, 0.2));
  k.plane(7, 4, k.own(new k.THREE.MeshBasicMaterial({ map: k.tex(256, 256, (x, W, H) => { const g = x.createRadialGradient(W * 0.4, H * 0.5, 4, W * 0.4, H * 0.5, W * 0.7); g.addColorStop(0, col); g.addColorStop(1, '#000000'); x.fillStyle = g; x.fillRect(0, 0, W, H); }), color: 0x777777 })), -0.6, 1.8, -3.6, 0);
  b.tube([[-4.2, 0.02, -3.7], [-4.2, 4.0, -3.7], [3.0, 4.0, -3.7], [3.0, 0.02, -3.7]], 0.022, b.m('#17181c', 0.5, 0.6), { seg: 40, sh: false });
  for (let i = 0; i < 9; i++) b.ball(0.07 + k.rnd() * 0.07, b.glow(i % 3 ? '#ffd9a0' : col, 1.6), -3.5 + k.rnd() * 7, 0.8 + k.rnd() * 2.2, -5 - k.rnd() * 3, { seg: 12, sh: false });
  for (const [tx, th, tc] of [[-2.9, 1.9, col], [-2.5, 1.4, '#ffd9a0'], [2.4, 1.7, col]]) { b.cyl(0.022, 0.022, th, b.glow(tc, 1.8), tx, th / 2 + 0.05, -2.9, 10, { sh: false }); b.cyl(0.07, 0.09, 0.05, b.m('#17181c', 0.5), tx, 0.025, -2.9, 12); }
  PR.chair(b, 0, 0, 0.18, '#15161a', 0.5, { arms: false }); PR.roundTable(b, -0.75, -0.15, 0.2, 0.52, '#17181c'); PR.glass(b, -0.75, 0.52, -0.15);
  PR.softbox(b, 3.3, 1.5, Math.atan2(-3.3, -1.5), 2.1, 0.95, '#fff0dc', 2.2); PR.softbox(b, -2.9, -2.2, Math.atan2(2.9, 2.2), 2.0, 0.7, col, 1.5);
  PR.tvCamera(b, -2.7, 3.6, Math.atan2(2.7, -3.6), 1.4); PR.flightCase(b, -4.4, -0.8, 0.4, 1.1, 0.6, 0.6); PR.flightCase(b, -4.5, 0.6, -0.2, 0.8, 0.5, 0.5, '#22252b'); PR.cables(b, 3.3, 1.5, 5.5, 4.5, 2); PR.cables(b, -2.7, 3.6, -5, 5, 2); PR.cables(b, -2.9, -2.2, -4.4, -0.8, 2);
  b.done();
  k.light.hemi(0x6677aa, 0x000000, 0.12); k.light.spot(0xfff0dc, 60, [2.2, 2.6, 2.6], [0, 1.25, 0], 0.5, 0.9, true); k.light.spot(col, 40, [-2.6, 2.4, -2.2], [0, 1.3, 0], 0.6, 0.8); k.light.point(0xbfd0ff, 2, [-1.5, 1.2, 2], 5);
  return { seat: [0, 0.05, 0, 0.18] };
}
/**
 * The paddock by day: the lane (along x), your motorhome on one side (z = -5.5) and another team's opposite (o.other:
 * { name, color }), tables under parasols between, hedges, flags, people about. -> { yours, theirs, tables }
 */
export function paddock(k, T, o = {}) {
  const U = o.other || { name: 'Rival', color: '#27f4d2' }, b = k.batch(), gl = b.m('#3a5068', 0.06, 0.75), st = b.m('#d5d9de', 0.35, 0.7);
  k.floor(90, 34, b.surf('paving', '#9a9ea5')); k.floor(90, 0.5, b.surf('concrete', '#7d8189'), 0.004, 0, 0);
  backdrop(k, 180, 50, 0, 20, -34, 0, '#5f97d6', '#dbe8f4'); backdrop(k, 180, 50, 0, 20, 34, PI, '#5f97d6', '#dbe8f4'); backdrop(k, 70, 50, 46, 20, 0, -PI / 2, '#5f97d6', '#dbe8f4'); backdrop(k, 70, 50, -46, 20, 0, PI / 2, '#5f97d6', '#dbe8f4');
  /** a motorhome: two floors of glass behind their mullions, a deck above its door, the team's name across its brow */
  const home = (C, z, s, x = 0, w = 16) => {   // (s: +1 its front toward +z)
    const f = s > 0 ? 0 : PI, fz = z + s * 2.5, body = b.m('#f1f2f4', 0.5, 0.1), cm = b.m(C.color, 0.45, 0.1);
    b.box(w, 6.46, 5, body, x, 3.23, z, 0, { r: 0 }); b.box(w + 0.3, 1.4, 5.3, cm, x, 5.8, z, 0, { r: 0.04 }); b.box(w + 0.6, 0.14, 6.2, b.m('#22252b', 0.5, 0.3), x, 6.57, z + s * 0.4, 0, { r: 0.02 });
    k.sign(Math.min(9, w * 0.6), 1.0, k.letters([[String(C.name).toUpperCase(), 130, ink(C.color), 900]], C.color), x, 5.8, z + s * 2.66, f, 1280);
    b.box(w - 1.2, 2.5, 0.06, gl, x, 1.5, fz + s * 0.01, 0, { r: 0, sh: false }); b.box(w - 1.2, 1.5, 0.06, gl, x, 4.15, fz + s * 0.01, 0, { r: 0, sh: false }); b.box(w, 0.28, 0.5, b.m('#22252b', 0.5, 0.3), x, 3.0, fz + s * 0.2, 0, { r: 0.02 });
    for (let i = 0; i <= 8; i++) { const mx = x - (w - 1.2) / 2 + (i * (w - 1.2)) / 8; b.box(0.07, 2.6, 0.1, b.m('#22252b', 0.5, 0.4), mx, 1.5, fz + s * 0.04, 0, { r: 0.01, sh: false }); b.box(0.07, 1.6, 0.1, b.m('#22252b', 0.5, 0.4), mx, 4.15, fz + s * 0.04, 0, { r: 0.01, sh: false }); }
    b.box(w - 1.2, 0.05, 1.3, b.m('#22252b', 0.5, 0.3), x, 3.16, fz + s * 0.65, 0, { r: 0.01 }); b.box(w - 1.2, 0.9, 0.02, b.m('#cfe1f2', 0.05, 0.3, { transparent: true, opacity: 0.25 }), x, 3.65, fz + s * 1.28, 0, { r: 0, sh: false }); b.cyl(0.02, 0.02, w - 1.2, st, x, 4.12, fz + s * 1.28, 6, { rz: PI / 2, sh: false });
    b.box(2.2, 2.7, 0.14, b.m('#17181c', 0.5), x + 3.5, 1.35, fz + s * 0.06, 0, { r: 0.01 }); b.box(0.9, 2.3, 0.05, b.m('#2a3a4a', 0.1, 0.6), x + 3.0, 1.2, fz + s * 0.14, 0, { r: 0, sh: false }); b.box(0.9, 2.3, 0.05, b.m('#2a3a4a', 0.1, 0.6), x + 4.0, 1.2, fz + s * 0.14, 0, { r: 0, sh: false });
    b.box(3.2, 0.1, 1.6, cm, x + 3.5, 2.85, fz + s * 0.8, 0, { r: 0.02, rx: s * 0.06 }); for (const q of [-1.5, 1.5]) b.cyl(0.03, 0.03, 2.8, st, x + 3.5 + q, 1.4, fz + s * 1.5, 8);
    b.box(3.0, 0.12, 1.2, b.surf('concrete', '#8a8e95'), x + 3.5, 0.06, fz + s * 0.6, 0, { r: 0.01 }); k.floor(2.4, 1.6, b.surf('cloth', C.color, { size: 0.4 }), 0.012, x + 3.5, fz + s * 2.0);
    PR.planter(b, x - w / 2 + 0.6, fz + s * 0.5, x + 1.6, fz + s * 0.5, '#2a2d33'); PR.planter(b, x + 5.4, fz + s * 0.5, x + w / 2 - 0.4, fz + s * 0.5, '#2a2d33');
    for (const q of [-1, 1]) PR.flag(b, x + q * (w / 2 - 1.2), z - s * 2.9, C.color, 10.5, q > 0 ? 0 : 0.3);
    for (const q of [-1, 1]) b.box(0.3, 7.2, 1.3, cm, x + q * (w / 2 + 0.05), 3.6, z + s * 1.9, 0, { r: 0.04 });
  };
  home(T, -6.5, 1); home(U, 6.5, -1);
  for (const [hx, C] of [[-22, { name: 'Hospitality', color: '#3671c6' }], [22, { name: 'Paddock Club', color: '#b6babd' }]]) { home(C, -6.5, 1, hx, 14); home({ name: hx < 0 ? 'Media' : 'Partners', color: hx < 0 ? '#ff8000' : '#229971' }, 6.5, -1, hx, 14); }
  // the tables under their parasols, the chairs round them, what is on them
  const tables = []; for (const [tx, tz, c] of [[-3, -2.6, T.color], [1.5, -2.9, T.color], [-1.5, 2.8, U.color], [3.4, 2.6, U.color]]) {
    PR.roundTable(b, tx, tz, 0.45, 0.74, '#f1f2f4'); PR.parasol(b, tx + 0.02, tz + 0.02, c, 1.3, 2.5); for (const q of [-0.5, 0.5]) PR.seat(b, tx + q, tz - Math.sign(tz) * 0.74, Math.sign(tz) > 0 ? -q * 0.8 : PI + q * 0.8, '#f1f2f4');
    PR.mug(b, tx + 0.18, 0.74, tz + 0.1, '#ffffff'); PR.mug(b, tx - 0.2, 0.74, tz - 0.08, '#ffffff'); PR.glass(b, tx, 0.74, tz + 0.25); tables.push([tx, tz]);
  }
  // people about, the lane's barriers and bins, trees beyond the motorhomes
  const ppl = [], KP = ['talk', 'phone', 'cross', 'hips', 'talk', 'record'];
  for (let i = 0; i < 20; i++) { const x = -26 + i * 2.7 + k.rnd() * 1.6, z = (k.rnd() - 0.5) * 3.4; if (Math.abs(x) < 7 || (x < 0 && z < 0.8)) continue;   /* (the middle of the lane is the scene's; the near side of its far end the camera's) */ ppl.push({ x, z, face: k.rnd() * 6.28, pose: KP[i % KP.length], kit: i % 3 ? 'polo' : 'jacket', top: i % 4 === 0 ? T.color : i % 4 === 2 ? U.color : undefined, prop: 'lanyard' }); if (i % 3 === 0) ppl.push({ x: x + 0.7, z: z + 0.3, face: Math.atan2(-0.7, -0.3), pose: 'talk', kit: 'polo', prop: 'lanyard' }); }
  for (const [x, z] of [[9.6, 3.1], [10.5, 3.3], [10.1, 2.4], [12.5, -3.0], [13.2, -2.6]]) ppl.push({ x, z, face: k.rnd() * 6.28, pose: 'talk', kit: 'jacket' });
  k.crowd(ppl); PR.ropes(b, 8.6, 3.7, 8.6, 1.2, '#1b2a55'); PR.barrier(b, -14.2, 3.9, -14.2, -3.9); PR.bin(b, 6.4, -3.6, '#2a2d33');
  for (let i = 0; i < 14; i++) { const tx = -40 + i * 6.2 + k.rnd() * 2, s = i % 2 ? 1 : -1, tz = s * (11 + k.rnd() * 2), h = 7 + k.rnd() * 3; b.cyl(0.16, 0.22, h * 0.5, b.m('#4a3a2c', 0.9), tx, h * 0.25, tz, 8, { sh: false }); for (let j = 0; j < 5; j++) b.ball(1.6 + k.rnd() * 1.1, b.m(j % 2 ? '#3c6f41' : '#2f5a35', 0.95), tx + (k.rnd() - 0.5) * 2, h * 0.6 + k.rnd() * 2.4, tz + (k.rnd() - 0.5) * 2, { seg: 10, sh: false }); }
  b.done();
  k.light.hemi(0xffffff, 0x8a8f96, 1.0); k.light.key(0xfff1d6, 2.6, [8, 14, 5], [0, 0, 0], true, 14); k.env(0.4, 0.9);
  return { yours: [0, 0, -3.6], theirs: [0, 0, 3.6], tables, other: U };
}
/**
 * The factory, four halls in a row along x (each 12 m, centred on x = 0, 12, 24, 36): the design office and machine
 * shop, the partners' lounge, the simulator, the pit crew's practice bay. o: { sponsors }. lv: { factory, hosp, dil, pitc }
 * (1..5: how much stands in each - a level not yet built is a taped outline on the floor). -> { bays }
 */
export function factory(k, T, lv = {}, o = {}) {
  const col = T.color, L = (id) => Math.max(1, Math.min(5, lv[id] || 1)), b = k.batch(), st = b.m('#c9ccd1', 0.4, 0.6), dk = b.m('#17181c', 0.5, 0.3), wh = b.m('#e9ebee', 0.45, 0.05), ms = b.surf('brushed', '#d0d3d8');
  // the building: an epoxy floor with its walkway lines, panelled walls, the roof's trusses, ducts and lamps
  k.floor(56, 16, b.surf('epoxy', '#a2a6ad', { rough: 0.3 }), 0, 18, 0); b.box(56.6, 8, 0.3, b.surf('panel', '#e4e6ea', { size: [2, 4] }), 18, 4, -8.15, 0, { r: 0 }); b.box(56.6, 0.3, 16.4, b.m('#1b1d22', 0.9), 18, 8.15, 0, 0, { sh: false, r: 0 }); b.box(0.3, 8, 16, b.surf('panel', '#e4e6ea', { size: [2, 4] }), -10.15, 4, 0, 0, { r: 0 }); b.box(0.3, 8, 16, b.surf('panel', '#e4e6ea', { size: [2, 4] }), 46.15, 4, 0, 0, { r: 0 });
  k.floor(56, 0.3, b.m(col, 0.5), 0.004, 18, 5.5); k.floor(56, 0.12, b.m('#ffd400', 0.5), 0.004, 18, 4.9); b.box(56, 1.0, 0.04, b.m('#22252b', 0.5, 0.2), 18, 0.5, -7.98, 0, { r: 0, sh: false }); b.box(56, 0.06, 0.045, b.m(col, 0.5), 18, 1.03, -7.975, 0, { r: 0, sh: false });
  for (let x = -6; x <= 42; x += 6) { PR.linear(b, x, 7.0, -2, 4.4, false, '#f4f7ff', 2.4, 0.5); PR.linear(b, x, 7.0, 3, 4.4, false, '#f4f7ff', 2.4, 0.5); b.box(0.3, 8, 0.3, st, x + 3, 4, -7.85, 0, { r: 0.02 }); PR.truss(b, x + 3, 7.7, -7.8, x + 3, 7.9, 0.4, b.m('#8d9198', 0.4, 0.7)); }
  b.cyl(0.36, 0.36, 56, ms, 18, 6.7, -6.4, 20, { rz: PI / 2, sh: false }); for (let x = -8; x <= 44; x += 4) b.torus(0.37, 0.025, st, x, 6.7, -6.4, { ry: PI / 2, sh: false }); [['#c8102e', 6.2], ['#2d6cdf', 6.05], ['#e0a100', 5.9]].forEach(([c, y]) => b.cyl(0.045, 0.045, 56, b.m(c, 0.5, 0.2), 18, y, -7.75, 8, { rz: PI / 2, sh: false }));
  for (const gx of [6, 18, 30]) { b.box(0.05, 3.0, 5.2, b.m('#bcd4e6', 0.05, 0.2, { transparent: true, opacity: 0.16 }), gx, 1.6, -5.3, 0, { r: 0, sh: false }); b.box(0.09, 0.09, 5.3, dk, gx, 3.12, -5.3, 0, { r: 0.01, sh: false }); b.box(0.09, 0.1, 5.3, dk, gx, 0.05, -5.3, 0, { r: 0.01, sh: false }); b.box(0.09, 3.1, 0.09, dk, gx, 1.55, -2.7, 0, { r: 0.01 }); }
  const names = { factory: 'DESIGN & MANUFACTURING', hosp: 'HOSPITALITY', dil: 'SIMULATOR', pitc: 'PIT CREW CENTRE' };
  const tape = (x, z, w, d, lab) => { for (const [a, bz, c, e] of [[x, z - d / 2, w, 0.08], [x, z + d / 2, w, 0.08], [x - w / 2, z, 0.08, d], [x + w / 2, z, 0.08, d]]) k.floor(c, e, b.m('#ffd400', 0.6), 0.006, a, bz); k.sign(w * 0.7, 0.5, k.letters([[lab, 60, '#ffd400', 800]], null), x, 0.012, z, 0, 512, { transparent: true }).rotation.x = -PI / 2; };
  ['factory', 'hosp', 'dil', 'pitc'].forEach((id, i) => k.sign(7, 0.8, k.letters([[names[id], 84, ink(col), 800], [`LEVEL ${L(id)}`, 44, ink(col), 600]], col), i * 12, 6.4, -7.975, 0, 1024));
  const cad = (x, W, H) => { x.fillStyle = '#0f1420'; x.fillRect(0, 0, W, H); x.strokeStyle = col; x.lineWidth = 2; x.beginPath(); for (let q = 0; q < 14; q++) { x.moveTo(W * 0.1, H * (0.2 + q * 0.045)); x.bezierCurveTo(W * 0.4, H * (0.1 + k.rnd() * 0.5), W * 0.6, H * (0.4 + k.rnd() * 0.4), W * 0.92, H * (0.5 + q * 0.02)); } x.stroke(); x.fillStyle = 'rgba(255,255,255,.35)'; for (let q = 0; q < 5; q++) x.fillRect(W * 0.04, H * (0.08 + q * 0.07), W * 0.12, H * 0.025); };
  // hall 1: desks with CAD screens (two per level), a five-axis mill and an autoclave from level 3, a wing on its stand
  const f = L('factory');
  for (let i = 0; i < 5; i++) {
    const dx = -4 + (i % 3) * 3.4, dz = -5.2 + Math.floor(i / 3) * 2.6;
    if (i < f) { PR.table(b, 2.6, 0.9, dx, dz, 0.75, wh, 0, { kind: 'legs', leg: st }); for (const s of [-0.6, 0.6]) { PR.monitor(b, dx + s, 0.75, dz - 0.25, 0, 0.56, 0.36, cad); PR.keyboard(b, dx + s, 0.75, dz + 0.12, 0); PR.chair(b, dx + s, dz + 0.72, PI, '#2a2d33', 0.46, { cloth: true }); } PR.mug(b, dx, 0.75, dz + 0.2, col); if (i % 2) PR.papers(b, dx + 1.1, 0.75, dz + 0.1, 0.3, 3); }
    else tape(dx, dz, 2.8, 1.6, `PHASE ${i + 1}`);
  }
  if (f >= 3) {
    b.box(2.4, 2.6, 2.2, ms, -5.5, 1.34, 1.5, 0, { r: 0.05, s: 2 }); b.box(2.5, 0.08, 2.3, b.m('#e0a100', 0.5), -5.5, 0.04, 1.5, 0, { r: 0.01 }); b.box(1.3, 1.15, 0.04, b.m('#16222e', 0.06, 0.6), -5.75, 1.6, 2.6, 0, { r: 0.02, sh: false }); b.box(0.04, 0.5, 0.04, st, -5.0, 1.6, 2.64, 0, { r: 0.012 });
    b.box(0.42, 0.56, 0.1, dk, -4.0, 1.5, 2.75, -0.5, { r: 0.02 }); b.box(0.34, 0.26, 0.004, b.glow('#7fd0ff', 1.2), -4.02, 1.6, 2.805, -0.5, { sh: false }); b.cyl(0.03, 0.03, 0.5, st, -4.15, 1.0, 2.7, 8); b.cyl(0.04, 0.04, 0.1, b.glow('#39d98a', 2), -4.6, 2.72, 2.3, 10, { sh: false }); PR.bin(b, -3.7, 2.3, '#3d6fd6');
  } else tape(-5.5, 1.5, 2.6, 2.4, 'FIVE-AXIS MILL');
  if (f >= 4) {
    b.cyl(1.2, 1.2, 4.0, ms, 2.4, 1.5, 1.5, 28, { rz: PI / 2 }); b.lathe([[0, 0], [1.2, 0], [1.24, 0.1], [0.95, 0.32], [0, 0.42]], b.m('#b9bdc4', 0.3, 0.7), 4.4, 1.5, 1.5, 36, { rz: -PI / 2 }); b.lathe([[0, 0], [1.2, 0], [0.95, 0.24], [0, 0.32]], b.m('#b9bdc4', 0.3, 0.7), 0.4, 1.5, 1.5, 36, { rz: PI / 2 });
    b.torus(1.23, 0.05, b.m(col, 0.4, 0.3), 4.42, 1.5, 1.5, { ry: PI / 2 }); b.torus(0.3, 0.025, dk, 4.86, 1.5, 1.5, { ry: PI / 2 }); for (let q = 0; q < 3; q++) b.cyl(0.018, 0.018, 0.6, dk, 4.86, 1.5, 1.5, 6, { rx: q * 1.047 }); for (const sx of [1.0, 3.6]) b.box(0.3, 0.5, 2.2, dk, sx, 0.25, 1.5, 0, { r: 0.02 });
    b.box(0.6, 1.5, 0.4, wh, 5.3, 0.75, 3.0, 0, { r: 0.02 }); b.box(0.36, 0.24, 0.004, b.glow('#ffb347', 1.2), 5.3, 1.2, 3.203, 0, { sh: false });
  } else tape(2.5, 1.5, 4.4, 2.6, 'AUTOCLAVE');
  PR.wingStand(b, -8.6, 3.4, PI / 2, col, '#111318'); PR.flightCase(b, -8.9, -6.6, PI / 2, 1.2, 0.8, 0.6); PR.plant(b, 5.2, -7.2, 1.8, '#22252b');
  // hall 2: hospitality - the partners' lounge: sofas and tables (more with each level), the bar, the wall of names
  const w = L('hosp'); k.floor(10.5, 9, b.surf('planks', '#5a4636'), 0.006, 12, -2.5);
  k.sign(8, 1.6, (x, W, H) => { x.fillStyle = '#17181c'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; const N = (o.sponsors && o.sponsors.length ? o.sponsors : ['YOUR PARTNERS HERE']).slice(0, 6); N.forEach((n, i2) => { x.font = `800 ${H * 0.16}px ${FONT}`; x.fillStyle = i2 % 2 ? '#d9b04a' : '#ffffff'; x.fillText(String(n).toUpperCase().slice(0, 16), W * (0.2 + (i2 % 3) * 0.3), H * (0.32 + Math.floor(i2 / 3) * 0.36)); }); }, 12, 3.2, -7.975, 0, 1024);
  b.box(5, 1.1, 0.7, b.surf('slats', '#3a2a1e'), 12, 0.55, -6.6, 0, { r: 0.01 }); b.box(5.1, 0.05, 0.8, b.m('#d9b04a', 0.3, 0.8), 12, 1.125, -6.6, 0, { r: 0.012 }); b.box(5, 0.9, 0.16, b.glow(col, 0.9), 12, 1.9, -7.7, 0, { sh: false }); b.box(5, 0.04, 0.3, dk, 12, 1.42, -7.75, 0, { r: 0.008, sh: false });
  for (let i = 0; i < 4 + w * 2; i++) PR.bottle(b, 9.9 + i * 0.32, 1.44, -7.72, ['#9fd0e8', '#6a8a4a', '#b0703a'][i % 3], 1.25); for (let i = 0; i < Math.min(5, w + 1); i++) PR.stool(b, 10.2 + i * 0.9, -5.85, PI, '#2a2d33', 0.74); for (let i = 0; i < 3; i++) PR.glass(b, 10.6 + i * 1.1, 1.15, -6.5);
  for (let i = 0; i < 5; i++) { const sx = 8.2 + (i % 3) * 3.6, sz = -3.4 + Math.floor(i / 3) * 3.4; if (i < w) { PR.sofa(b, sx, sz, 0, 2.0, '#e7e2d6', { pillow: col }); PR.roundTable(b, sx, sz + 1.15, 0.4, 0.44, '#3a2a1e'); PR.mug(b, sx + 0.1, 0.44, sz + 1.1, '#ffffff'); } else tape(sx, sz + 0.3, 2.4, 2.2, `SUITE ${i + 1}`); }
  for (const sx of [9, 12, 15]) { PR.pendant(b, sx, 4.3, -2.5, 8.0, '#17181c', '#ffe2b0', 0.4); k.light.point(0xffd9a0, 8, [sx, 4.1, -2.5], 9); } PR.plant(b, 7.0, -7.0, 1.9); PR.plant(b, 17.0, -7.0, 1.6, '#22252b');
  // hall 3: the simulator - the tub on its legs, the screen wrapped round it; the operators' desk; the racks
  const s = L('dil'); b.lathe([[0, 0], [1.9, 0], [1.9, 0.22], [1.6, 0.3], [0, 0.3]], b.m('#2a2d33', 0.5, 0.4), 24, 0, -2, 40);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; b.cyl(0.07, 0.07, 1.3, b.m('#c9ccd1', 0.3, 0.8), 24 + Math.cos(a) * 1.0, 0.85, -2 + Math.sin(a) * 1.0, 10, { rz: Math.cos(a) * 0.35, rx: -Math.sin(a) * 0.35 }); b.cyl(0.1, 0.1, 0.5, dk, 24 + Math.cos(a) * 1.16, 0.5, -2 + Math.sin(a) * 1.16, 10, { rz: Math.cos(a) * 0.35, rx: -Math.sin(a) * 0.35 }); }
  const tub = k.box(1.0, 0.7, 2.6, k.m(col, 0.3, 0.3), 24, 1.75, -2, 0, { r: 0.2, s: 3 });
  for (const m of [k.box(0.56, 0.1, 1.0, k.m('#0c0d10', 0.6), 24, 2.08, -1.7, 0, { r: 0.04 }), k.box(0.5, 0.34, 0.2, k.m('#111318', 0.4, 0.3), 24, 2.2, -2.5, 0, { r: 0.06 }), k.box(0.6, 0.22, 1.1, k.m(col, 0.3, 0.3), 24, 1.62, -0.35, 0, { r: 0.1, s: 2 }), k.torus(0.13, 0.02, k.m('#17181c', 0.5), 24, 2.16, -1.25)]) tub.attach(m);
  k.each((t) => { tub.rotation.z = Math.sin(t * 1.3) * 0.05 * s; tub.rotation.x = Math.sin(t * 0.9) * 0.04 * s; });
  if (s >= 2) { const wrap = new k.THREE.Mesh(k.own(new k.THREE.CylinderGeometry(3.3, 3.3, 2.6, 48, 1, true, PI * (0.5 + 0.5 - s * 0.09), PI * s * 0.18)), k.own(new k.THREE.MeshBasicMaterial({ map: k.tex(1024, 256, (x, W, H) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7fb2e6'); g.addColorStop(0.55, '#cfe1f2'); g.addColorStop(0.56, '#4a4d55'); g.addColorStop(1, '#2a2d33'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#e10600'; for (let i = 0; i < 24; i++) x.fillRect(i * 44, H * 0.5, 22, H * 0.06); x.fillStyle = '#f2f2ef'; for (let i = 0; i < 24; i++) x.fillRect(i * 44 + 22, H * 0.5, 22, H * 0.06); }), side: k.THREE.BackSide }))); wrap.position.set(k.org.x + 24, 2.0, k.org.z - 2); k.S.add(wrap); b.cyl(3.36, 3.36, 0.12, dk, 24, 3.34, -2, 48, { open: true, sh: false }); } else tape(24, -5, 5, 1.2, 'WRAP SCREEN');
  for (let i = 0; i < 3; i++) { const ox = 21.8 + i * 2.2; if (i < Math.ceil(s / 2)) { PR.table(b, 1.8, 0.8, ox, 3.2, 0.75, wh, 0, { kind: 'legs', leg: st }); PR.monitor(b, ox, 0.75, 3.0, 0, 0.66, 0.41, paintTable('LAP', [{ b: 'S1', c: '28.4' }, { b: 'S2', c: '35.1' }, { b: 'S3', c: '24.9' }], col, { min: 3 })); PR.keyboard(b, ox, 0.75, 3.35, 0); PR.chair(b, ox, 3.95, PI, '#2a2d33', 0.46, { cloth: true }); PR.headset(b, ox + 0.6, 0.84, 3.2, 0.4); } else tape(ox, 3.2, 1.9, 1.2, 'OPS'); }
  for (let i = 0; i < 1 + Math.ceil(s / 2); i++) { const rx = 27.6 + i * 0.75; b.box(0.7, 2.1, 0.9, b.m('#111318', 0.5, 0.4), rx, 1.05, -7.3, 0, { r: 0.012 }); b.box(0.6, 1.9, 0.012, b.surf('perf', '#1b1c20'), rx, 1.05, -6.845, 0, { sh: false }); for (let q = 0; q < 9; q++) b.box(0.3, 0.008, 0.004, b.glow(q % 3 ? '#39d98a' : '#7fb0ff', 1.6), rx - 0.08, 0.3 + q * 0.2, -6.836, 0, { sh: false }); }
  // hall 4: the practice bay - the box painted on the floor, the gantry and its lines, the tyres, the guns, the gym from level 3
  const p = L('pitc'); k.floor(5.6, 2.6, b.m('#3d4046', 0.8), 0.005, 36, -1.5); for (const [a, bz, c, e] of [[36, -2.8, 5.6, 0.1], [36, -0.2, 5.6, 0.1], [33.2, -1.5, 0.1, 2.6], [38.8, -1.5, 0.1, 2.6]]) k.floor(c, e, b.m('#ffffff', 0.6), 0.008, a, bz);
  b.box(0.2, 3.6, 0.2, st, 33, 1.8, -3.4, 0, { r: 0.02 }); b.box(0.2, 3.6, 0.2, st, 39, 1.8, -3.4, 0, { r: 0.02 }); b.box(6.4, 0.3, 0.44, b.m(col, 0.5, 0.2), 36, 3.55, -3.4, 0, { r: 0.04 }); b.box(6.0, 0.2, 0.2, b.m(col, 0.5, 0.2), 36, 3.5, -1.5, 0, { r: 0.03, sh: false }); for (const sx of [33.1, 38.9]) b.box(0.16, 0.16, 2.0, b.m(col, 0.5, 0.2), sx, 3.5, -2.45, 0, { r: 0.03, sh: false });
  for (let i = 0; i < p; i++) { const hx = 33.6 + i * 1.2; b.tube([[hx, 3.4, -1.5], [hx + 0.1, 2.9, -1.45], [hx + 0.18, 2.6, -1.5]], 0.014, b.m('#e0a100', 0.6), { sh: false }); b.cyl(0.045, 0.045, 0.2, b.m('#2a2d33', 0.35, 0.7), hx + 0.19, 2.5, -1.5, 12, { sh: false }); }
  b.box(0.5, 0.26, 0.012, b.glow('#ff3b30', 1.4), 36, 3.56, -3.17, 0, { sh: false, r: 0.004 });
  for (let i = 0; i < 4; i++) { if (i < p) PR.tyres(b, 41.5, -5.5 + i * 0.9, 3, col, { bare: true, band: ['#e10600', '#ffd400', '#f2f2ef', '#39d98a'][i] }); }
  PR.wheelGun(b, 34.0, 0.0, 0.4, 0.6); PR.wheelGun(b, 38.2, 0.0, -3.0, -0.8); PR.cables(b, 34.0, 0.5, 33.1, -3.2, 1, '#e0a100'); b.box(0.5, 0.1, 1.5, dk, 36, 0.06, 1.2, 0.1, { r: 0.02 }); b.tube([[36.05, 0.1, 1.7], [36.2, 0.7, 2.6], [36.25, 0.95, 2.9]], 0.02, st); PR.flightCase(b, 40.9, 1.4, -PI / 2, 1.2, 0.8, 0.6, '#17181c'); PR.gasBottle(b, 32.6, -4.6, '#2d6cdf'); PR.gasBottle(b, 32.6, -5.0, '#2d6cdf');
  if (p >= 3) {
    k.floor(6.2, 2.6, b.m('#22252b', 0.95), 0.006, 35, 4.3);
    for (let i = 0; i < p - 1; i++) { const gx = 33 + i * 1.3; b.box(0.36, 0.07, 1.3, b.surf('leather', '#17181c'), gx, 0.46, 4.5, 0, { r: 0.03, s: 2 }); for (const sz of [-0.5, 0.5]) b.box(0.3, 0.42, 0.05, st, gx, 0.21, 4.5 + sz, 0, { r: 0.01 }); for (const sx of [-0.38, 0.38]) b.cyl(0.02, 0.02, 1.1, st, gx + sx, 0.55, 3.85, 8); b.cyl(0.014, 0.014, 1.5, b.m('#c9ccd1', 0.3, 0.8), gx, 1.06, 3.85, 8, { rz: PI / 2 }); for (const sx of [-0.62, 0.62]) for (let q = 0; q < 2; q++) b.cyl(0.17 - q * 0.03, 0.17 - q * 0.03, 0.035, b.m(q ? '#22252b' : col, 0.6), gx + sx + (sx > 0 ? 1 : -1) * q * 0.04, 1.06, 3.85, 20, { rz: PI / 2 }); }
    for (let i = 0; i < 4; i++) { b.ball(0.09 + i * 0.012, b.m('#111318', 0.5, 0.3), 37.4 + i * 0.3, 0.1 + i * 0.012, 3.5, { seg: 16 }); b.torus(0.05, 0.012, b.m('#111318', 0.5, 0.3), 37.4 + i * 0.3, 0.22 + i * 0.024, 3.5, { arc: PI }); }
  } else tape(35, 4.4, 5, 2, 'CREW GYM');
  b.done();
  k.light.hemi(0xffffff, 0x80858e, 0.8); k.light.key(0xffffff, 1.6, [10, 14, 10], [16, 0, 0], true, 30); k.env(0.5, 0.6);
  return { bays: { factory: [0, -2], hosp: [12, -2], dil: [24, -2], pitc: [36, -1.5] }, tub, col };
}
/**
 * The trophy room: a gallery (along x), a plinth under its own lamp for each thing won or kept - items: [{ kind:
 * 'cup' | 'plate' | 'helmet' | 'board', title, text, kicker, tint, paint (a board's painter) }] (up to 14). -> { stations }
 */
export function trophyRoom(k, T, items, o = {}) {
  const n = Math.max(1, Math.min(14, items.length)), W = Math.max(12, n * 2.4 + 4), x0 = -(n - 1) * 1.2, b = k.batch(), brass = b.m('#b08d57', 0.28, 0.9);
  k.floor(W + 2, 9, b.surf('planks', '#2a211b', { rough: 0.22 })); b.box(W + 2.4, 4.6, 0.2, b.surf('slats', '#2a2320'), 0, 2.3, -3.2, 0, { r: 0 }); b.box(W + 2.4, 0.2, 9.4, b.m('#0c0d10', 0.9), 0, 4.7, 0, 0, { sh: false, r: 0 }); b.box(0.2, 4.6, 9, b.surf('plaster', '#1f2127'), -W / 2 - 1.1, 2.3, 0, 0, { r: 0 }); b.box(0.2, 4.6, 9, b.surf('plaster', '#1f2127'), W / 2 + 1.1, 2.3, 0, 0, { r: 0 }); b.box(W + 2.4, 4.6, 0.2, b.surf('plaster', '#1f2127'), 0, 2.3, 4.6, 0, { r: 0 });
  k.sign(Math.min(W - 2, 9), 0.7, k.letters([[`${T.name.toUpperCase()} · ROLL OF HONOUR`, 96, '#d9b04a', 800]], null), 0, 3.9, -3.085, 0, 1536, { transparent: true });
  k.floor(W + 2, 0.5, b.m(T.color, 0.5), 0.005, 0, -2.2); k.floor(W + 2, 2.2, b.surf('cloth', '#3a1218', { size: 0.5 }), 0.004, 0, 1.2);
  PR.rail(b, -W / 2 - 1, -3.09, W / 2 + 1, -3.09, 0.09, 0.18, 0.03, b.m('#15120f', 0.4)); b.box(W + 2, 0.06, 0.1, brass, 0, 4.25, -3.06, 0, { r: 0.015, sh: false });
  const gold = b.m('#d9b04a', 0.22, 0.95), silver = b.m('#c9ccd1', 0.2, 0.95), bronze = b.m('#b0703a', 0.3, 0.9), glassM = b.m('#dfeaf2', 0.03, 0.1, { transparent: true, opacity: 0.1 }), stations = [];
  items.slice(0, 14).forEach((it, i) => {
    const x = x0 + i * 2.4, z = -1.4, board = it.kind === 'board';
    k.light.spot(0xfff0d0, 26, [x, 4.4, z + 1.0], [x, 1.2, z], 0.36, 0.7); b.cyl(0.05, 0.07, 0.16, b.m('#101114', 0.5, 0.5), x, 4.5, z + 1.0, 12, { rx: -0.3, sh: false }); b.cyl(0.045, 0.045, 0.006, b.glow('#fff0d0', 2.5), x, 4.425, z + 0.976, 12, { rx: -0.3, sh: false });
    const mt = it.tint === 'silver' ? silver : it.tint === 'bronze' ? bronze : gold;
    if (!board) {
      b.box(0.7, 1.0, 0.7, b.m('#eceae4', 0.45), x, 0.5, z, 0, { r: 0.012 }); b.box(0.74, 0.06, 0.74, b.m('#15120f', 0.4), x, 0.03, z, 0, { r: 0.01 }); b.box(0.3, 0.09, 0.006, brass, x, 0.72, z + 0.352, 0, { r: 0.003, sh: false });
      b.box(0.62, 0.78, 0.62, glassM, x, 1.39, z, 0, { r: 0.004, sh: false }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(0.012, 0.78, 0.012, brass, x + sx * 0.31, 1.39, z + sz * 0.31, 0, { r: 0, sh: false });
      if (it.kind === 'cup') PR.cup(b, x, z, 1.0, mt, 0.92); else if (it.kind === 'plate') PR.plate(b, x, z, 1.0, mt, 0.8); else PR.helmet(b, x, z, 1.0, it.color || T.color, 0.3, T.color2 || '#ffffff');
      b.blob(x, z, 0.55, 0.55, 0.5);
    } else { PR.picture(b, x, 1.9, -3.09, 0, 1.4, 0.9, (c, Wd, Hd) => { c.fillStyle = '#0d0e11'; c.fillRect(0, 0, Wd, Hd); }, '#b08d57', 64); k.screen(1.4, 0.9, it.paint || paintTable(it.title || '', it.rows || [], T.color, { min: 3 }), x, 1.9, -3.07, 0, 0.9, 512); }
    if (i < n - 1) b.box(0.16, 4.3, 0.08, b.m('#15120f', 0.5), x + 1.2, 2.25, -3.07, 0, { r: 0.01, sh: false });
    stations.push({ p: [x + 0.9, board ? 1.8 : 1.5, z + (board ? 3.4 : 2.3)], l: [x, board ? 1.85 : 1.3, board ? -2.9 : z], f: board ? 30 : 24, kicker: it.kicker, title: it.title, text: it.text });
  });
  PR.ropes(b, x0 - 1.0, -0.55, x0 + (n - 1) * 2.4 + 1.0, -0.55, '#7a1420');
  for (let i = 0; i < Math.max(1, Math.round(W / 6)); i++) { const bx = -W / 2 + 3 + i * 6; b.box(1.8, 0.1, 0.5, b.surf('leather', '#2a1f1a'), bx, 0.44, 3.6, 0, { r: 0.04, s: 2 }); for (const sx of [-0.75, 0.75]) b.box(0.06, 0.4, 0.44, brass, bx + sx, 0.2, 3.6, 0, { r: 0.01 }); b.blob(bx, 3.6, 1.0, 0.4, 0.4); PR.picture(b, bx, 2.0, 4.49, PI, 1.6, 1.0, paintPoster(T, i % 2 ? 'Pole' : T.name, i), '#b08d57', 384); }
  PR.plant(b, -W / 2 - 0.4, 3.9, 2.0, '#15120f'); PR.plant(b, W / 2 + 0.4, 3.9, 2.0, '#15120f');
  b.done();
  k.light.hemi(0x6f7aa8, 0x000000, 0.22); void o;
  return { stations };
}
