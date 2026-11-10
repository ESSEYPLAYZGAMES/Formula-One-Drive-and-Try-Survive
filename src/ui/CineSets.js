// The sets the cutscenes are shot on (ui/Cine.js builds them with its kit): the garage, the pit wall's stand, the
// boardroom, the team principal's office, the press room, the launch stage, the cool-down room, the stewards' room, a
// documentary's interview chair, the paddock, the factory's four halls, the trophy room. Each is built at the kit's
// origin from boxes, planes and painted screens - the screens carry the season's own numbers (painters below) - with
// its own light, and returns where things stand in it. Facing: 0 looks down +z, PI/2 down +x (Cine.js).
// T: a team { name, color, color2 }.
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

// ---- furniture -------------------------------------------------------------------------------------------------------
export function chair(k, x, z, face = 0, col = '#1b1d22', h = 0.46) {
  const m = k.m(col, 0.6), s = Math.sin(face), c = Math.cos(face);
  k.box(0.46, 0.07, 0.46, m, x, h, z, face); k.box(0.46, 0.52, 0.06, m, x - s * 0.22, h + 0.3, z - c * 0.22, face);
  k.cyl(0.03, 0.03, h, k.m('#8a8f98', 0.3, 0.8), x, h / 2, z, 8); k.cyl(0.24, 0.26, 0.03, k.m('#8a8f98', 0.3, 0.8), x, 0.015, z, 14);
}
export function table(k, w, d, x, z, h = 0.75, col = '#3a2a1e', ry = 0) { k.box(w, 0.06, d, k.m(col, 0.35, 0.05), x, h, z, ry); k.box(w * 0.86, h - 0.06, d * 0.5, k.m('#17181c', 0.7), x, (h - 0.06) / 2, z, ry); }
/** someone in an audience, far or dark: a body and a head (no face - never in focus) */
export function sil(k, x, z, face = PI, col = '#16181d', seated = false, y = 0) {
  const m = k.m(col, 0.9), hY = seated ? 1.22 : 1.62, b = k.cyl(0.17, 0.2, seated ? 0.6 : 0.9, m, x, y + (seated ? 0.78 : 1.02), z, 10); b.castShadow = false;
  const hd = k.ball(0.105, k.m('#2a2320', 0.8), x, y + hY, z); hd.castShadow = false;
  if (!seated) { const l = k.cyl(0.15, 0.12, 0.6, m, x, y + 0.3, z, 8); l.castShadow = false; }
  return { x, z, face };
}
/** a stack of tyres in their blankets */
export function tyres(k, x, z, n = 4, col = '#22252b') { for (let i = 0; i < n; i++) k.cyl(0.36, 0.36, 0.3, k.m(i % 2 ? col : '#17181b', 0.85), x, 0.16 + i * 0.31, z, 22); }
/** a tool cabinet: drawers, a worktop */
export function cabinet(k, x, z, face = 0, col = '#b3141b', w = 1.3) { k.box(w, 0.92, 0.55, k.m(col, 0.4, 0.3), x, 0.46, z, face); k.box(w + 0.04, 0.04, 0.6, k.m('#1a1b1f', 0.5, 0.2), x, 0.94, z, face); const s = Math.sin(face), c = Math.cos(face); for (let i = 0; i < 4; i++) k.box(w * 0.86, 0.02, 0.02, k.m('#d7dade', 0.3, 0.8), x + s * 0.285, 0.2 + i * 0.2, z + c * 0.285, face); }
/** a strip light: the tube that glows and the light it gives */
export function strip(k, x, y, z, len = 4, alongZ = false, col = '#f4f7ff', I = 2.2) { k.box(alongZ ? 0.12 : len, 0.05, alongZ ? len : 0.12, k.glow(col, I), x, y, z).castShadow = false; }
const skyTex = (k, top, bot, stars = false) => k.tex(64, 256, (x, W, H) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, W, H); if (stars) { x.fillStyle = '#ffffff'; for (let i = 0; i < 40; i++) x.fillRect(k.rnd() * W, k.rnd() * H * 0.6, 1, 1); } });
const backdrop = (k, w, h, x, y, z, face, top, bot, stars) => { const m = k.own(new k.THREE.MeshBasicMaterial({ map: skyTex(k, top, bot, stars), fog: false })); return k.plane(w, h, m, x, y, z, face); };
/** a skyline at dusk or night behind a window: the sky, towers with lit windows */
const skyline = (k, night) => k.tex(1024, 384, (x, W, H) => {
  const g = x.createLinearGradient(0, 0, 0, H); if (night) { g.addColorStop(0, '#070a16'); g.addColorStop(1, '#1b2340'); } else { g.addColorStop(0, '#2b3d66'); g.addColorStop(0.6, '#c9805a'); g.addColorStop(1, '#f1c27a'); } x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i++) { const w = 24 + k.rnd() * 60, h = 60 + k.rnd() * 220, bx = k.rnd() * W; x.fillStyle = night ? '#0a0d18' : '#1c2233'; x.fillRect(bx, H - h, w, h); x.fillStyle = night ? 'rgba(255,214,140,.85)' : 'rgba(255,224,170,.55)'; for (let j = 0; j < h / 9; j++) for (let q = 0; q < w / 8; q++) if (k.rnd() < 0.3) x.fillRect(bx + 3 + q * 8, H - h + 4 + j * 9, 3, 4); }
});

// ---- the sets --------------------------------------------------------------------------------------------------------
/**
 * The garage: open to the pit lane at +z, the car's bay in the middle (nose out), the team's name across the back
 * wall over a bank of screens (o.screens: up to three painters), cabinets, tyres in their blankets, the lights' truss.
 * o: { night, fia (the scrutineering bay: grey, no team), screens, banner }
 */
export function garage(k, T, o = {}) {
  const col = o.fia ? '#3a4150' : T.color, wall = k.m(o.fia ? '#d9dce1' : '#e9ebee', 0.7);
  k.floor(14, 10, k.m('#8f949c', 0.28, 0.05)); k.floor(14, 0.25, k.m(col, 0.4), 0.004, 0, 4.6); k.floor(0.2, 10, k.m(col, 0.4), 0.004, -3.2, 0); k.floor(0.2, 10, k.m(col, 0.4), 0.004, 3.2, 0);
  k.box(14, 4.4, 0.2, wall, 0, 2.2, -5.1); k.box(0.2, 4.4, 10, wall, -7.1, 2.2, 0); k.box(0.2, 4.4, 10, wall, 7.1, 2.2, 0); k.box(14.4, 0.2, 10.4, k.m('#191b20', 0.9), 0, 4.5, 0).castShadow = false;
  k.sign(9, 1.15, k.letters([[o.banner || (o.fia ? 'SCRUTINEERING' : T.name).toUpperCase(), 150, o.fia ? '#ffffff' : ink(col), 900]], col), 0, 3.45, -4.98, 0, 1536);
  k.box(14, 0.5, 0.25, k.m(col, 0.5), 0, 4.15, 4.9);
  const def = [paintTable('TIMING', [], col), paintTable('SECTORS', [], col), paintTable('TYRES', [], col)], scr = [];
  [-2.4, 0, 2.4].forEach((sx, i) => { k.box(2.1, 1.25, 0.08, k.m('#0d0e11', 0.5), sx, 2.05, -4.95); scr.push(k.screen(1.96, 1.1, (o.screens || [])[i] || def[i], sx, 2.05, -4.9, 0, 1.15)); });
  cabinet(k, -5.6, -4.5, 0, o.fia ? '#59606c' : '#b3141b'); cabinet(k, -4.1, -4.5, 0, '#2a2d33'); cabinet(k, 4.3, -4.5, 0, '#2a2d33'); cabinet(k, 5.8, -4.5, 0, o.fia ? '#59606c' : '#b3141b');
  if (!o.fia) { tyres(k, -6.2, 1.2, 4, col); tyres(k, -6.2, 2.1, 4, col); tyres(k, -5.4, 1.7, 3, col); tyres(k, 6.2, 1.4, 4, col); tyres(k, 6.2, 2.3, 3, col); }
  for (const z of [-2.6, 0.2, 3]) { k.box(13, 0.12, 0.12, k.m('#2a2d33', 0.5, 0.6), 0, 4.05, z).castShadow = false; strip(k, -3.4, 3.96, z, 4.2); strip(k, 3.4, 3.96, z, 4.2); }
  // outside: the pit lane, the pit wall's fence, the sky
  k.floor(60, 14, k.m(o.night ? '#23262d' : '#5d6168', 0.85), -0.01, 0, 12); k.box(60, 1.0, 0.3, k.m('#c9ccd1', 0.8), 0, 0.5, 17); k.box(60, 2.4, 0.04, k.m('#3d424b', 0.6, 0.4, { transparent: true, opacity: 0.35 }), 0, 2.2, 17).castShadow = false;
  backdrop(k, 120, 40, 0, 14, 40, PI, o.night ? '#05070f' : '#6fa3dc', o.night ? '#141a2e' : '#cfe1f2', o.night);
  k.light.hemi(0xffffff, 0x5a5f68, o.night ? 0.55 : 0.8); k.light.key(0xffffff, o.night ? 1.5 : 1.9, [3.5, 9, 6], [0, 0, -0.5], true, 9);
  k.light.point(col, 14, [-5.5, 2.4, -3.8], 9); k.light.point(col, 14, [5.5, 2.4, -3.8], 9); k.light.point(0xdfe8ff, 10, [0, 3.6, 0.5], 12);
  return { car: [0, 0, 0.3], carFace: 0, screens: scr, col };
}
/**
 * The pit wall's stand: five stools under the canopy (the team's name on its fascia), the screens before them, the
 * track in front (+z), the pit lane and the garages behind. People on it face +z. o: { night, screens }
 */
export function pitwall(k, T, o = {}) {
  const col = T.color;
  k.floor(70, 16, k.m(o.night ? '#22252b' : '#55595f', 0.9), 0, 0, -9); k.floor(70, 16, k.m(o.night ? '#1b1d22' : '#3d4046', 0.75), 0, 0, 9.4);
  k.box(70, 1.05, 0.35, k.m('#c9ccd1', 0.8), 0, 0.52, 1.35); k.floor(70, 0.18, k.m('#ffffff', 0.6), 0.004, 0, 2.0);
  k.box(7.2, 0.25, 2.0, k.m('#2b2e35', 0.6), 0, 0.125, 0); k.box(7.0, 0.08, 0.6, k.m('#17181c', 0.4, 0.3), 0, 1.3, 0.62);
  const scr = []; [-2.4, -1.2, 0, 1.2, 2.4].forEach((sx, i) => {
    k.cyl(0.035, 0.035, 0.82, k.m('#8a8f98', 0.3, 0.8), sx, 0.66, -0.2, 8); k.cyl(0.19, 0.19, 0.06, k.m('#1b1d22', 0.6), sx, 1.08, -0.2, 16);
    k.box(0.62, 0.4, 0.05, k.m('#0d0e11', 0.5), sx, 1.56, 0.72); scr.push(k.screen(0.56, 0.34, (o.screens || [])[i] || paintTable(['GAPS', 'TYRES', 'TIMING', 'WEATHER', 'FUEL'][i], [], col), sx, 1.56, 0.69, PI, 1.2, 256));
  });
  for (const [px, pz] of [[-3.5, -0.9], [3.5, -0.9], [-3.5, 0.9], [3.5, 0.9]]) k.cyl(0.05, 0.05, 2.75, k.m('#c9ccd1', 0.4, 0.6), px, 1.6, pz, 8);
  k.box(7.5, 0.1, 2.3, k.m(col, 0.5), 0, 3.0, 0).castShadow = false; k.sign(7.4, 0.42, k.letters([[T.name.toUpperCase(), 110, ink(col), 900]], col), 0, 2.74, 1.16, 0, 1536); k.sign(7.4, 0.42, k.letters([[T.name.toUpperCase(), 110, ink(col), 900]], col), 0, 2.74, -1.16, PI, 1536);
  strip(k, 0, 2.92, 0, 6.6, false, '#fff6e6', 1.6);
  // the garages behind, the far side of the track: a wall, a stand full of people (a speckle of colour)
  k.box(70, 5, 0.4, k.m('#e4e6ea', 0.8), 0, 2.5, -17.2); k.sign(10, 1.1, k.letters([[T.name.toUpperCase(), 150, ink(col), 900]], col), 0, 4.1, -16.95, 0, 1024);
  k.box(70, 1.1, 0.3, k.m('#c9ccd1', 0.8), 0, 0.55, 17.3);
  const crowd = k.tex(512, 128, (x, W, H) => { x.fillStyle = o.night ? '#0d0f15' : '#3a3f48'; x.fillRect(0, 0, W, H); const C = [col, '#f2f2ef', '#1b1d22', '#d9c7a3', '#b04a4a', '#2d4a6b', col]; for (let i = 0; i < 2600; i++) { x.fillStyle = C[(k.rnd() * C.length) | 0]; x.globalAlpha = o.night ? 0.55 : 0.9; x.fillRect(k.rnd() * W, k.rnd() * H, 3, 4); } });
  const st = k.plane(70, 9, k.own(new k.THREE.MeshStandardMaterial({ map: crowd, roughness: 1 })), 0, 6.2, 21, PI); st.rotation.x = 0.5;
  backdrop(k, 160, 50, 0, 20, 34, PI, o.night ? '#04060d' : '#5f97d6', o.night ? '#161c33' : '#cfe1f2', o.night); backdrop(k, 160, 50, 0, 20, -34, 0, o.night ? '#04060d' : '#5f97d6', o.night ? '#161c33' : '#cfe1f2', o.night);
  k.light.hemi(o.night ? 0x8fa0ff : 0xffffff, 0x4a4d55, o.night ? 0.5 : 1.0); k.light.key(o.night ? 0xdfe8ff : 0xfff3df, o.night ? 1.6 : 2.2, [5, 10, 9], [0, 1, 0], true, 8);
  k.light.point(0xbfd4ff, 5, [0, 1.5, 0.3], 3.5);
  return { seats: [-2.4, -1.2, 0, 1.2, 2.4].map((sx) => [sx, 0.62, -0.2]), stand: [-2.4, -1.2, 0, 1.2, 2.4].map((sx) => [sx, 0.25, -0.55]), screens: scr, col };
}
/**
 * The boardroom: the long table (along x), eight chairs and one at each end, a wall of windows on the city (z = -4),
 * a screen on the end wall (x = -6: o.screen, a painter). o: { night }
 */
export function boardroom(k, T, o = {}) {
  k.floor(12.4, 8.4, k.m('#23252b', 0.95)); k.box(12.4, 0.2, 8.4, k.m('#f1f2f4', 0.9), 0, 3.5, 0).castShadow = false;
  k.box(0.2, 3.4, 8.4, k.m('#2b2e36', 0.8), -6.1, 1.7, 0); k.box(0.2, 3.4, 8.4, k.m('#d9d6cf', 0.9), 6.1, 1.7, 0); k.box(12.4, 3.4, 0.2, k.m('#d9d6cf', 0.9), 0, 1.7, 4.1);
  k.plane(13, 3.6, k.own(new k.THREE.MeshBasicMaterial({ map: skyline(k, o.night), fog: false })), 0, 1.8, -4.6, 0);
  for (let i = -6; i <= 6; i += 2) k.box(0.08, 3.4, 0.12, k.m('#17181c', 0.5, 0.4), i, 1.7, -4.05); k.box(12.4, 0.5, 0.14, k.m('#17181c', 0.5, 0.4), 0, 0.25, -4.05);
  table(k, 6.6, 1.5, 0, 0, 0.75, '#4a3423');
  const seats = []; for (const sx of [-2.4, -0.8, 0.8, 2.4]) { chair(k, sx, -1.2, 0, '#1b1d22'); chair(k, sx, 1.2, PI, '#1b1d22'); seats.push([sx, 0, -1.2, 0], [sx, 0, 1.2, PI]); }
  chair(k, -3.9, 0, PI / 2, '#1b1d22'); chair(k, 3.9, 0, -PI / 2, '#1b1d22');
  k.box(3.5, 2.0, 0.08, k.m('#0d0e11', 0.5), -5.98, 1.95, 0, PI / 2); const scr = k.screen(3.3, 1.86, o.screen || paintTable('CONSTRUCTORS', [], T.color), -5.92, 1.95, 0, PI / 2, 1.1, 768);
  k.box(1.6, 0.5, 0.02, k.m(T.color, 0.5), 6.0, 2.3, 0, -PI / 2);
  for (const sx of [-2, 0, 2]) { k.box(1.3, 0.05, 0.3, k.glow('#ffe2b0', 2.4), sx, 2.35, 0).castShadow = false; k.light.point(0xffd9a0, 9, [sx, 2.2, 0], 7); }
  k.light.hemi(o.night ? 0x6b78a8 : 0xffe6c4, 0x2a2622, o.night ? 0.35 : 0.6); k.light.key(o.night ? 0x8fa6ff : 0xffb880, o.night ? 0.7 : 1.3, [0, 4, -9], [0, 1, 0], true, 8);
  return { seats, head: [3.9, 0, 0, -PI / 2], foot: [-3.9, 0, 0, PI / 2], screen: scr };
}
/**
 * The team principal's office: the desk (you behind it, facing +z), two chairs before it, a window on the factory
 * (z = -3.5), a wall screen (x = -4: o.screen), a shelf of what the team has won (o.cups). o: { night }
 */
export function office(k, T, o = {}) {
  k.floor(8.4, 7.4, k.m('#2a2622', 0.85)); k.box(8.4, 0.2, 7.4, k.m('#ecebe7', 0.9), 0, 3.2, 0).castShadow = false;
  k.box(0.2, 3.1, 7.4, k.m('#2f333b', 0.85), -4.1, 1.55, 0); k.box(0.2, 3.1, 7.4, k.m('#cfccc5', 0.9), 4.1, 1.55, 0); k.box(8.4, 3.1, 0.2, k.m('#cfccc5', 0.9), 0, 1.55, 3.6);
  k.plane(9, 3.3, k.own(new k.THREE.MeshBasicMaterial({ map: skyline(k, o.night !== false), fog: false })), 0, 1.65, -4.1, 0);
  for (let i = -4; i <= 4; i += 2) k.box(0.07, 3.1, 0.1, k.m('#17181c', 0.5, 0.4), i, 1.55, -3.55);
  table(k, 2.3, 0.95, 0, -1.0, 0.75, '#3a2a1e'); chair(k, 0, -1.85, 0, '#15161a'); chair(k, -0.7, 0.35, PI, '#1b1d22'); chair(k, 0.7, 0.35, PI, '#1b1d22');
  k.cyl(0.03, 0.05, 0.4, k.m('#b08d57', 0.3, 0.8), -0.85, 0.98, -1.15, 10); k.cyl(0.16, 0.1, 0.16, k.glow('#ffd9a0', 2.2), -0.85, 1.22, -1.15, 16).castShadow = false; k.light.point(0xffc98a, 7, [-0.85, 1.25, -1.1], 6);
  k.box(0.42, 0.02, 0.3, k.m('#1a1b1f', 0.4, 0.4), 0.25, 0.79, -0.95); k.screen(0.4, 0.26, (x, W, H) => { x.fillStyle = '#101622'; x.fillRect(0, 0, W, H); x.fillStyle = T.color; x.fillRect(0, 0, W, H * 0.12); x.fillStyle = 'rgba(255,255,255,.5)'; for (let i = 0; i < 6; i++) x.fillRect(W * 0.06, H * (0.22 + i * 0.12), W * (0.4 + k.rnd() * 0.45), H * 0.05); }, 0.25, 0.93, -1.08, 0, 1, 256).rotation.x = -0.2;
  k.box(3.3, 1.95, 0.08, k.m('#0d0e11', 0.5), -3.98, 1.75, 0.4, PI / 2); const scr = k.screen(3.1, 1.76, o.screen || paintTable('CONSTRUCTORS', [], T.color), -3.92, 1.75, 0.4, PI / 2, 1.05, 768);
  // the shelf: a cup for each of the team's wins (up to seven), the rest of it books
  k.box(0.35, 0.05, 3.2, k.m('#3a2a1e', 0.5), 3.85, 1.25, -0.6); k.box(0.35, 0.05, 3.2, k.m('#3a2a1e', 0.5), 3.85, 1.95, -0.6);
  const gold = k.m('#d9b04a', 0.25, 0.9); for (let i = 0; i < Math.min(7, o.cups || 0); i++) { k.cyl(0.07, 0.03, 0.2, gold, 3.85, 1.4 + (i > 3 ? 0.7 : 0), -1.9 + (i % 4) * 0.42, 14); }
  for (let i = 0; i < 9; i++) k.box(0.22, 0.26 + k.rnd() * 0.08, 0.05, k.m(['#5a2a2a', '#2a3a5a', '#3b3b3b', '#6a5a3a'][i % 4], 0.8), 3.85, 1.42, 0.1 + i * 0.07);
  k.light.hemi(0x7f8cc0, 0x2a2622, 0.4); k.light.key(0x9fb4ff, 0.8, [1, 4, -8], [0, 1, 0], true, 6); k.light.spot(0xfff0dc, 26, [0, 3.0, 1.6], [0, 1.0, -1.2], 0.7, 0.8);
  return { you: [0, 0, -1.85, 0], guests: [[-0.7, 0, 0.35, PI], [0.7, 0, 0.35, PI]], stand: [[-1.6, 0, 0.9, PI * 0.85], [1.6, 0, 0.9, -PI * 0.85]], screen: scr };
}
/**
 * The press room: the table on its low stage (three places, facing +z), the board of sponsors behind it (o.names: the
 * names printed on it), the press in rows before it, their cameras' flashes. o: { names, rows }
 */
export function pressroom(k, T, o = {}) {
  k.floor(16, 14, k.m('#1d1f25', 0.95)); k.box(16, 0.2, 14, k.m('#101114', 0.9), 0, 4.1, 0).castShadow = false; k.box(16, 4, 0.2, k.m('#15171c', 0.9), 0, 2, -3.2); k.box(0.2, 4, 14, k.m('#15171c', 0.9), -8, 2, 0); k.box(0.2, 4, 14, k.m('#15171c', 0.9), 8, 2, 0);
  const names = (o.names && o.names.length ? o.names : [T.name]).slice(0, 6);
  k.sign(8, 3, (x, W, H) => { x.fillStyle = '#f3f4f6'; x.fillRect(0, 0, W, H); x.textAlign = 'center'; x.textBaseline = 'middle'; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const n = (r + c) % (names.length + 1), t = n === 0 ? T.name : names[n - 1]; x.font = `900 ${H * 0.062}px ${FONT}`; x.fillStyle = n === 0 ? T.color : '#1a1c21'; x.fillText(String(t).toUpperCase().slice(0, 14), W * (0.1 + c * 0.2), H * (0.1 + r * 0.2)); } }, 0, 2.0, -2.9, 0, 1536);
  k.box(6, 0.3, 2.2, k.m('#2b2e35', 0.8), 0, 0.15, -1.6); k.box(4.6, 0.75, 0.7, k.m(T.color, 0.6), 0, 0.68, -1.1); k.box(4.7, 0.05, 0.8, k.m('#17181c', 0.4), 0, 1.07, -1.1);
  const seats = [-1.3, 0, 1.3].map((sx) => { chair(k, sx, -1.85, 0, '#1b1d22', 0.76); k.cyl(0.012, 0.012, 0.22, k.m('#111', 0.4, 0.6), sx, 1.2, -0.95, 6); k.ball(0.035, k.m('#222', 0.9), sx, 1.32, -0.95); return [sx, 0.3, -1.85, 0]; });
  const R = o.rows ?? 4, press = [];
  for (let r = 0; r < R; r++) for (let c = -4; c <= 4; c++) { if (k.rnd() < 0.12) continue; press.push(sil(k, c * 0.78 + (r % 2) * 0.3, 1.6 + r * 1.0, PI, ['#16181d', '#1f2229', '#2a2420', '#1b2230'][(r + c + 8) % 4], true)); }
  for (const tx of [-5.2, 5.4, -2.1, 2.6]) { k.cyl(0.02, 0.05, 1.5, k.m('#111', 0.5, 0.5), tx, 0.75, 6.2, 6); k.box(0.3, 0.24, 0.5, k.m('#17181c', 0.5), tx, 1.6, 6.15); }
  // the flashes: lamps that fire at random
  const fl = [0, 1, 2, 3].map(() => k.light.point(0xffffff, 0, [0, 1.5, 3], 14));
  k.each((t) => { fl.forEach((L, i) => { const ph = Math.floor(t * 3.1 + i * 1.7), on = ((ph * 2654435761) >>> 0) % 5 === 0 && (t * 3.1 + i * 1.7) % 1 < 0.12; L.intensity = on ? 60 : 0; if (on) L.position.set(k.org.x + ((ph * 7) % 9) - 4, 1.5, k.org.z + 2 + (ph % 4)); }); });
  k.light.hemi(0xffffff, 0x2a2622, 0.35); k.light.spot(0xfff3df, 80, [0, 3.8, 2.4], [0, 1.2, -1.6], 0.75, 0.6, true); k.light.spot(0xdfe8ff, 30, [-4, 3.6, 0], [0, 1.3, -1.6], 0.6, 0.8);
  return { seats, press };
}
/**
 * The launch stage: the hall dark, the turntable, the wall of light behind it (o.wall: a painter), the beams, the
 * guests' heads and their phones. o: { wall, guests (0..1: how full the hall is) }
 */
export function stage(k, T, o = {}) {
  k.floor(40, 30, k.m('#08090c', 0.5, 0.1)); k.box(15, 0.5, 6.4, k.m('#0e0f13', 0.25, 0.3), 0, 0.25, -1.2); k.cyl(2.9, 2.95, 0.08, k.m('#191b21', 0.2, 0.5), 0, 0.54, -1.0, 64);
  const ring = k.cyl(2.96, 2.96, 0.03, k.glow(T.color, 2.5), 0, 0.56, -1.0, 64); ring.castShadow = false;
  const wall = k.screen(13, 4.6, o.wall || k.letters([[T.name.toUpperCase(), 190, '#ffffff', 900]], '#050506'), 0, 3.1, -4.3, 0, 0.9, 2048);
  const beams = []; for (let i = 0; i < 6; i++) {
    const g = k.own(new k.THREE.ConeGeometry(1.1, 9, 20, 1, true)); g.translate(0, -4.5, 0);
    const b = new k.THREE.Mesh(g, k.own(new k.THREE.MeshBasicMaterial({ color: i % 2 ? T.color : '#cfd8ff', transparent: true, opacity: 0.09, depthWrite: false, side: k.THREE.DoubleSide, blending: k.THREE.AdditiveBlending })));
    b.position.set(k.org.x - 6 + i * 2.4, 8.4, k.org.z - 2.5); k.S.add(b); beams.push(b);
  }
  k.each((t) => beams.forEach((b, i) => { b.rotation.z = Math.sin(t * 0.5 + i * 1.1) * 0.35; b.rotation.x = 0.15 + Math.cos(t * 0.37 + i) * 0.2; }));
  const full = o.guests ?? 0.8, heads = [];
  for (let r = 0; r < 6; r++) for (let c = -9; c <= 9; c++) { if (k.rnd() > full) continue; const s = sil(k, c * 0.72 + (r % 2) * 0.35, 3.6 + r * 0.95, PI, '#0c0d11', false); heads.push(s); if (k.rnd() < 0.3) { const ph = k.box(0.07, 0.13, 0.01, k.glow('#cfe0ff', 1.6), s.x + 0.12, 1.72, s.z - 0.18); ph.castShadow = false; } }
  k.light.hemi(0x5566aa, 0x000000, 0.18); const key = k.light.spot(0xffffff, 0, [0, 9, 4], [0, 0.8, -1], 0.42, 0.5, true); const rimL = k.light.spot(T.color, 0, [-6, 5, -3.6], [0, 0.8, -1], 0.7, 0.7), rimR = k.light.spot(0xbfd0ff, 0, [6, 5, -3.6], [0, 0.8, -1], 0.7, 0.7);
  return { car: [0, 0.58, -1.0], wall, key, rimL, rimR, beams, heads };
}
/**
 * The cool-down room: the screen on the wall (z = -3: o.screen), the three who watch it, the bench, the fridge, the
 * caps on the table. Small and bright.
 */
export function cooldown(k, T, o = {}) {
  k.floor(7.4, 6.4, k.m('#30333a', 0.6)); k.box(7.4, 0.2, 6.4, k.m('#f3f4f6', 0.9), 0, 3.0, 0).castShadow = false; k.box(7.4, 2.9, 0.2, k.m('#1c1e24', 0.8), 0, 1.45, -3.1); k.box(0.2, 2.9, 6.4, k.m('#e7e8eb', 0.9), -3.7, 1.45, 0); k.box(0.2, 2.9, 6.4, k.m('#e7e8eb', 0.9), 3.7, 1.45, 0); k.box(7.4, 2.9, 0.2, k.m('#e7e8eb', 0.9), 0, 1.45, 3.1);
  k.box(2.9, 1.7, 0.08, k.m('#0d0e11', 0.5), 0, 1.75, -2.98); const scr = k.screen(2.74, 1.54, o.screen || paintIncident({}), 0, 1.75, -2.93, 0, 1.25, 768);
  k.sign(2.4, 0.3, k.letters([['COOL DOWN ROOM', 70, '#ffffff', 800]], '#e10600'), -2.2, 2.6, -2.98, 0, 512);
  k.box(2.6, 0.45, 0.5, k.m('#1b1d22', 0.6), 0, 0.225, 2.2); k.box(0.7, 1.7, 0.6, k.m('#d7dade', 0.3, 0.6), 3.2, 0.85, 1.6); k.box(0.6, 0.6, 0.02, k.glow('#bfe4ff', 1.2), 2.84, 1.2, 1.6, -PI / 2).castShadow = false;
  table(k, 1.2, 0.5, -2.9, 0.4, 0.8, '#2a2d33', PI / 2); [o.c1 || '#ffd400', o.c2 || '#c0c5cc', o.c3 || '#b0703a'].forEach((c, i) => k.cyl(0.11, 0.115, 0.09, k.m(c, 0.7), -2.9, 0.88, 0.05 + i * 0.32, 16));
  for (let i = 0; i < 5; i++) k.cyl(0.03, 0.03, 0.2, k.m('#9fd0e8', 0.2, 0.1, { transparent: true, opacity: 0.7 }), -2.9, 0.93, 1.1 + i * 0.09, 8);
  strip(k, 0, 2.86, 0.4, 5, false, '#ffffff', 2); k.light.hemi(0xffffff, 0x555860, 0.75); k.light.key(0xffffff, 1.3, [2, 6, 4], [0, 1, 0], true, 6); const tv = k.light.point(0x9fc0ff, 9, [0, 1.7, -2.2], 6);
  return { screen: scr, tv, spots: [[-0.95, 0, 0.1], [0, 0, -0.2], [0.95, 0, 0.1]] };
}
/**
 * The stewards' room: the three behind their bench (facing +z), the screen on the side wall (x = 5: o.screen), the
 * floor before them where the teams stand.
 */
export function stewards(k, T, o = {}) {
  k.floor(10.4, 8.4, k.m('#2b2622', 0.9)); k.box(10.4, 0.2, 8.4, k.m('#ecebe7', 0.9), 0, 3.3, 0).castShadow = false;
  k.box(10.4, 3.2, 0.2, k.m('#3a2c20', 0.7), 0, 1.6, -4.1); k.box(0.2, 3.2, 8.4, k.m('#d2cfc8', 0.9), -5.1, 1.6, 0); k.box(0.2, 3.2, 8.4, k.m('#d2cfc8', 0.9), 5.1, 1.6, 0); k.box(10.4, 3.2, 0.2, k.m('#d2cfc8', 0.9), 0, 1.6, 4.1);
  k.sign(3.6, 0.45, k.letters([['RACE STEWARDS', 84, '#e9e2d0', 800]], '#2a1f16'), 0, 2.75, -3.98, 0, 768);
  k.box(5.2, 0.3, 1.6, k.m('#2b2e35', 0.8), 0, 0.15, -2.9); k.box(4.8, 0.85, 0.7, k.m('#4a3423', 0.5), 0, 0.72, -2.45); k.box(4.9, 0.05, 0.8, k.m('#2a1f16', 0.4), 0, 1.16, -2.45);
  const bench = [-1.4, 0, 1.4].map((sx) => { chair(k, sx, -3.15, 0, '#15161a', 0.76); k.box(0.3, 0.02, 0.22, k.m('#f1efe8', 0.9), sx, 1.2, -2.4); return [sx, 0.3, -3.15, 0]; });
  k.box(3.3, 1.95, 0.08, k.m('#0d0e11', 0.5), 4.98, 1.8, -0.4, -PI / 2); const scr = k.screen(3.1, 1.76, o.screen || paintIncident({}), 4.92, 1.8, -0.4, -PI / 2, 1.1, 768);
  for (const sx of [-2.2, 2.2]) { k.box(1.6, 0.05, 0.3, k.glow('#fff1d6', 2), sx, 3.15, -1).castShadow = false; }
  k.light.hemi(0xfff1dc, 0x2a2622, 0.55); k.light.key(0xfff3df, 1.2, [-3, 6, 5], [0, 1, -1], true, 7); k.light.spot(0xfff0dc, 30, [0, 3.1, -0.6], [0, 1.2, -3], 0.8, 0.8);
  return { bench, screen: scr, floor: [[-1.5, 0, 0.9, PI], [-0.6, 0, 1.3, PI], [1.6, 0, 0.9, PI], [2.5, 0, 1.3, PI]] };
}
/** A documentary's interview: a chair in the dark, a wash of the team's colour behind, lamps out of focus. -> { seat } */
export function studio(k, T, o = {}) {
  k.floor(14, 14, k.m('#0a0b0e', 0.6, 0.1)); const col = o.color || T.color;
  k.plane(7, 4, k.own(new k.THREE.MeshBasicMaterial({ map: k.tex(256, 256, (x, W, H) => { const g = x.createRadialGradient(W * 0.4, H * 0.5, 4, W * 0.4, H * 0.5, W * 0.7); g.addColorStop(0, col); g.addColorStop(1, '#000000'); x.fillStyle = g; x.fillRect(0, 0, W, H); }), color: 0x777777 })), -0.6, 1.8, -3.6, 0);
  for (let i = 0; i < 9; i++) { const b = k.ball(0.07 + k.rnd() * 0.07, k.glow(i % 3 ? '#ffd9a0' : col, 1.6), -3.5 + k.rnd() * 7, 0.8 + k.rnd() * 2.2, -5 - k.rnd() * 3); b.castShadow = false; }
  chair(k, 0, 0, 0.18, '#15161a', 0.5);
  k.light.hemi(0x6677aa, 0x000000, 0.12); k.light.spot(0xfff0dc, 60, [2.2, 2.6, 2.6], [0, 1.25, 0], 0.5, 0.9, true); k.light.spot(col, 40, [-2.6, 2.4, -2.2], [0, 1.3, 0], 0.6, 0.8); k.light.point(0xbfd0ff, 2, [-1.5, 1.2, 2], 5);
  return { seat: [0, 0.05, 0, 0.18] };
}
/**
 * The paddock by day: the lane (along x), your motorhome on one side (z = -5.5) and another team's opposite (o.other:
 * { name, color }), tables under parasols between. -> { yours, theirs, tables }
 */
export function paddock(k, T, o = {}) {
  const U = o.other || { name: 'Rival', color: '#27f4d2' };
  k.floor(70, 30, k.m('#8b8f96', 0.9)); backdrop(k, 160, 50, 0, 20, -30, 0, '#5f97d6', '#dbe8f4'); backdrop(k, 160, 50, 0, 20, 30, PI, '#5f97d6', '#dbe8f4'); backdrop(k, 60, 50, 40, 20, 0, -PI / 2, '#5f97d6', '#dbe8f4'); backdrop(k, 60, 50, -40, 20, 0, PI / 2, '#5f97d6', '#dbe8f4');
  const home = (C, z, face) => { k.box(16, 6.5, 5, k.m('#f1f2f4', 0.6), 0, 3.25, z); k.box(16.1, 1.4, 5.1, k.m(C.color, 0.5), 0, 5.6, z); k.sign(9, 1.0, k.letters([[String(C.name).toUpperCase(), 130, ink(C.color), 900]], C.color), 0, 5.6, z + (face ? -2.57 : 2.57), face, 1280); k.box(5, 2.6, 0.1, k.m('#20242c', 0.15, 0.5, { transparent: true, opacity: 0.7 }), -3, 1.5, z + (face ? -2.52 : 2.52)); k.box(1.4, 2.4, 0.12, k.m('#17181c', 0.5), 3.5, 1.2, z + (face ? -2.52 : 2.52)); };
  home(T, -6.5, 0); home(U, 6.5, PI);
  const tables = []; for (const [tx, tz, c] of [[-3, -2.6, T.color], [1.5, -2.9, T.color], [-1.5, 2.8, U.color], [3.4, 2.6, U.color]]) { k.cyl(0.45, 0.45, 0.04, k.m('#f1f2f4', 0.5), tx, 0.74, tz, 20); k.cyl(0.03, 0.03, 2.3, k.m('#c9ccd1', 0.4, 0.5), tx, 1.15, tz, 8); k.cyl(1.25, 0.05, 0.35, k.m(c, 0.7), tx, 2.4, tz, 8); tables.push([tx, tz]); }
  for (let i = 0; i < 7; i++) sil(k, -16 + i * 5.3 + k.rnd() * 2, (k.rnd() - 0.5) * 3, k.rnd() * 6, ['#2a2d33', '#3b4a66', '#5a2a2a', '#444'][i % 4]);
  k.light.hemi(0xffffff, 0x8a8f96, 1.1); k.light.key(0xfff1d6, 2.6, [8, 14, 5], [0, 0, 0], true, 14);
  return { yours: [0, 0, -3.6], theirs: [0, 0, 3.6], tables, other: U };
}
/**
 * The factory, four halls in a row along x (each 12 m, centred on x = 0, 12, 24, 36): the design office and machine
 * shop, the wind tunnel and its model, the simulator, the pit crew's practice bay. lv: { factory, hosp, dil, pitc }
 * (1..5: how much stands in each - a level not yet built is a taped outline on the floor). -> { bays }
 */
export function factory(k, T, lv = {}, o = {}) {
  const col = T.color, L = (id) => Math.max(1, Math.min(5, lv[id] || 1));
  k.floor(56, 16, k.m('#aeb2b9', 0.3, 0.05), 0, 18, 0); k.box(56, 8, 0.3, k.m('#e6e8ec', 0.8), 18, 4, -8.1); k.box(56, 0.3, 16.4, k.m('#22252b', 0.9), 18, 8.1, 0).castShadow = false; k.box(0.3, 8, 16, k.m('#e6e8ec', 0.8), -10, 4, 0); k.box(0.3, 8, 16, k.m('#e6e8ec', 0.8), 46, 4, 0);
  k.floor(56, 0.3, k.m(col, 0.5), 0.004, 18, 5.5); k.floor(56, 0.12, k.m('#ffd400', 0.5), 0.004, 18, 4.9);
  for (let x = -6; x <= 42; x += 6) { strip(k, x, 7.8, -2, 4.4, false, '#f4f7ff', 2.4); strip(k, x, 7.8, 3, 4.4, false, '#f4f7ff', 2.4); k.box(0.25, 8, 0.25, k.m('#c9ccd1', 0.5, 0.4), x + 3, 4, -7.8); }
  const names = { factory: 'DESIGN & MANUFACTURING', hosp: 'WIND TUNNEL', dil: 'SIMULATOR', pitc: 'PIT STOP PRACTICE' };
  const tape = (x, z, w, d, lab) => { for (const [a, b, c, e] of [[x, z - d / 2, w, 0.08], [x, z + d / 2, w, 0.08], [x - w / 2, z, 0.08, d], [x + w / 2, z, 0.08, d]]) k.floor(c, e, k.m('#ffd400', 0.6), 0.006, a, b); k.sign(w * 0.7, 0.5, k.letters([[lab, 60, '#ffd400', 800]], null), x, 0.012, z, 0, 512, { transparent: true }).rotation.x = -PI / 2; };
  ['factory', 'hosp', 'dil', 'pitc'].forEach((id, i) => k.sign(7, 0.8, k.letters([[names[id], 84, ink(col), 800], [`LEVEL ${L(id)}`, 44, ink(col), 600]], col), i * 12, 6.4, -7.9, 0, 1024));
  // hall 1: desks with CAD screens (two per level), a five-axis mill and an autoclave from level 3
  const f = L('factory');
  for (let i = 0; i < 5; i++) { const dx = -4 + (i % 3) * 3.4, dz = -5.2 + Math.floor(i / 3) * 2.6; if (i < f) { table(k, 2.6, 0.9, dx, dz, 0.75, '#e9ebee'); for (const s of [-0.6, 0.6]) { k.box(0.6, 0.4, 0.04, k.m('#0d0e11', 0.5), dx + s, 1.12, dz - 0.25); k.screen(0.56, 0.36, (x, W, H) => { x.fillStyle = '#0f1420'; x.fillRect(0, 0, W, H); x.strokeStyle = col; x.lineWidth = 2; x.beginPath(); for (let q = 0; q < 14; q++) { x.moveTo(W * 0.1, H * (0.2 + q * 0.045)); x.bezierCurveTo(W * 0.4, H * (0.1 + k.rnd() * 0.5), W * 0.6, H * (0.4 + k.rnd() * 0.4), W * 0.92, H * (0.5 + q * 0.02)); } x.stroke(); }, dx + s, 1.12, dz - 0.22, 0, 1.1, 256); chair(k, dx + s, dz + 0.7, PI, '#2a2d33'); } } else tape(dx, dz, 2.8, 1.6, `PHASE ${i + 1}`); }
  if (f >= 3) { k.box(2.4, 2.6, 2.2, k.m('#d7dade', 0.35, 0.5), -5.5, 1.3, 1.5); k.box(1.2, 1.2, 0.05, k.m('#20242c', 0.1, 0.5, { transparent: true, opacity: 0.6 }), -5.5, 1.5, 2.63); } else tape(-5.5, 1.5, 2.6, 2.4, 'FIVE-AXIS MILL');
  if (f >= 4) { const a = k.cyl(1.2, 1.2, 4.2, k.m('#c9ccd1', 0.3, 0.7), 2.5, 1.4, 1.5, 28); a.rotation.z = PI / 2; } else tape(2.5, 1.5, 4.4, 2.6, 'AUTOCLAVE');
  // hall 2: the tunnel - a contraction, the working section in glass with the model in it, the fan
  const w = L('hosp'); k.box(6.5, 3.2, 3.4, k.m('#20242c', 0.1, 0.4, { transparent: true, opacity: 0.28 }), 12, 1.9, -2); k.box(6.7, 0.25, 3.6, k.m('#2a2d33', 0.5), 12, 0.25, -2); k.box(6.7, 0.2, 3.6, k.m('#2a2d33', 0.5), 12, 3.6, -2);
  const cone = k.cyl(2.6, 1.7, 3.2, k.m('#d7dade', 0.4, 0.5), 7.2, 1.9, -2, 24); cone.rotation.z = PI / 2; const fan = k.cyl(1.9, 1.9, 0.5, k.m('#17181c', 0.5, 0.5), 16.4, 1.9, -2, 24); fan.rotation.z = PI / 2;
  const blades = []; for (let i = 0; i < (w >= 2 ? 8 : 4); i++) { const b = k.box(0.06, 1.7, 0.34, k.m('#8a8f98', 0.3, 0.8), 16.1, 1.9, -2); b.geometry.translate(0, 0.85, 0); b.rotation.x = i / (w >= 2 ? 8 : 4) * 6.283; blades.push(b); }
  k.each((t) => blades.forEach((b, i) => { b.rotation.x = i / blades.length * 6.283 + t * (2 + w); }));
  for (let i = 0; i < 4; i++) { if (i < w - 1) { table(k, 1.8, 0.8, 9.4 + i * 2.1, 3, 0.75, '#e9ebee'); k.box(0.7, 0.45, 0.04, k.m('#0d0e11', 0.5), 9.4 + i * 2.1, 1.14, 2.8); k.screen(0.66, 0.41, paintTable('CFD', [{ a: '', b: 'Cz', c: (3.1 + w * 0.12 + i * 0.01).toFixed(2) }, { a: '', b: 'Cx', c: (1.02 - w * 0.02).toFixed(2) }, { a: '', b: 'L/D', c: (3 + w * 0.2).toFixed(2) }], col, { min: 3 }), 9.4 + i * 2.1, 1.14, 2.83, 0, 1.1, 256); } else tape(9.4 + i * 2.1, 3, 1.9, 1.2, 'RIG'); }
  // hall 3: the simulator - the tub on its legs, the screen wrapped round it; the operators' desk
  const s = L('dil'); k.cyl(1.6, 1.9, 0.3, k.m('#2a2d33', 0.5, 0.4), 24, 0.15, -2, 24);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283, l = k.cyl(0.07, 0.07, 1.3, k.m('#c9ccd1', 0.3, 0.8), 24 + Math.cos(a) * 1.0, 0.85, -2 + Math.sin(a) * 1.0, 8); l.rotation.z = Math.cos(a) * 0.35; l.rotation.x = -Math.sin(a) * 0.35; }
  const tub = k.box(1.0, 0.7, 2.6, k.m(col, 0.3, 0.3), 24, 1.75, -2); k.each((t) => { tub.rotation.z = Math.sin(t * 1.3) * 0.05 * s; tub.rotation.x = Math.sin(t * 0.9) * 0.04 * s; });
  if (s >= 2) { const wrap = new k.THREE.Mesh(k.own(new k.THREE.CylinderGeometry(3.3, 3.3, 2.6, 40, 1, true, PI * (0.5 + 0.5 - s * 0.09), PI * s * 0.18)), k.own(new k.THREE.MeshBasicMaterial({ map: k.tex(512, 128, (x, W, H) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7fb2e6'); g.addColorStop(0.55, '#cfe1f2'); g.addColorStop(0.56, '#4a4d55'); g.addColorStop(1, '#2a2d33'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#e10600'; for (let i = 0; i < 12; i++) x.fillRect(i * 44, H * 0.5, 22, H * 0.06); }), side: k.THREE.BackSide }))); wrap.position.set(k.org.x + 24, 2.0, k.org.z - 2); k.S.add(wrap); } else tape(24, -5, 5, 1.2, 'WRAP SCREEN');
  for (let i = 0; i < 3; i++) { if (i < Math.ceil(s / 2)) { table(k, 1.8, 0.8, 21.8 + i * 2.2, 3.2, 0.75, '#e9ebee'); k.box(0.7, 0.45, 0.04, k.m('#0d0e11', 0.5), 21.8 + i * 2.2, 1.14, 3.0); k.screen(0.66, 0.41, paintTable('LAP', [{ b: 'S1', c: '28.4' }, { b: 'S2', c: '35.1' }, { b: 'S3', c: '24.9' }], col, { min: 3 }), 21.8 + i * 2.2, 1.14, 3.03, 0, 1.1, 256); } else tape(21.8 + i * 2.2, 3.2, 1.9, 1.2, 'OPS'); }
  // hall 4: the practice bay - the box painted on the floor, the gantry and its lights, the wheel-gun rack, the gym from level 3
  const p = L('pitc'); k.floor(5.6, 2.6, k.m('#3d4046', 0.8), 0.005, 36, -1.5); for (const [a, b, c, e] of [[36, -2.8, 5.6, 0.1], [36, -0.2, 5.6, 0.1], [33.2, -1.5, 0.1, 2.6], [38.8, -1.5, 0.1, 2.6]]) k.floor(c, e, k.m('#ffffff', 0.6), 0.008, a, b);
  k.box(0.2, 3.6, 0.2, k.m('#c9ccd1', 0.4, 0.6), 33, 1.8, -3.4); k.box(0.2, 3.6, 0.2, k.m('#c9ccd1', 0.4, 0.6), 39, 1.8, -3.4); k.box(6.2, 0.25, 0.4, k.m(col, 0.5), 36, 3.5, -3.4); for (let i = 0; i < p; i++) k.cyl(0.03, 0.03, 1.6, k.m('#17181c', 0.5), 34 + i, 2.6, -3.4, 6);
  for (let i = 0; i < 4; i++) { if (i < p) tyres(k, 41.5, -5.5 + i * 0.9, 3, col); }
  if (p >= 3) { for (let i = 0; i < p - 1; i++) { k.box(0.5, 0.06, 1.6, k.m('#17181c', 0.6), 33 + i * 1.3, 0.45, 4.4); k.cyl(0.02, 0.02, 1.5, k.m('#c9ccd1', 0.3, 0.8), 33 + i * 1.3, 1.1, 3.8, 6).rotation.z = PI / 2; } } else tape(35, 4.4, 5, 2, 'CREW GYM');
  k.light.hemi(0xffffff, 0x80858e, 0.9); k.light.key(0xffffff, 1.6, [10, 14, 10], [16, 0, 0], true, 30);
  return { bays: { factory: [0, -2], hosp: [12, -2], dil: [24, -2], pitc: [36, -1.5] }, tub, col };
}
/**
 * The trophy room: a gallery (along x), a plinth under its own lamp for each thing won or kept - items: [{ kind:
 * 'cup' | 'plate' | 'helmet' | 'board', title, text, kicker, tint, paint (a board's painter) }] (up to 14). -> { stations }
 */
export function trophyRoom(k, T, items, o = {}) {
  const n = Math.max(1, Math.min(14, items.length)), W = Math.max(12, n * 2.4 + 4), x0 = -(n - 1) * 1.2;
  k.floor(W + 2, 9, k.m('#15161a', 0.25, 0.2)); k.box(W + 2, 4.6, 0.2, k.m('#1f2127', 0.9), 0, 2.3, -3.1); k.box(W + 2, 0.2, 9, k.m('#0c0d10', 0.9), 0, 4.7, 0).castShadow = false; k.box(0.2, 4.6, 9, k.m('#1f2127', 0.9), -W / 2 - 1, 2.3, 0); k.box(0.2, 4.6, 9, k.m('#1f2127', 0.9), W / 2 + 1, 2.3, 0);
  k.sign(Math.min(W - 2, 9), 0.7, k.letters([[`${T.name.toUpperCase()} · ROLL OF HONOUR`, 96, '#d9b04a', 800]], null), 0, 3.9, -2.98, 0, 1536, { transparent: true });
  k.floor(W + 2, 0.5, k.m(T.color, 0.5), 0.005, 0, -2.2);
  const gold = k.m('#d9b04a', 0.22, 0.95), silver = k.m('#c9ccd1', 0.2, 0.95), bronze = k.m('#b0703a', 0.3, 0.9), stations = [];
  items.slice(0, 14).forEach((it, i) => {
    const x = x0 + i * 2.4, z = -1.4;
    k.box(0.7, 1.0, 0.7, k.m('#f1f2f4', 0.5), x, 0.5, z); k.light.spot(0xfff0d0, 26, [x, 4.4, z + 1.0], [x, 1.2, z], 0.36, 0.7);
    const mt = it.tint === 'silver' ? silver : it.tint === 'bronze' ? bronze : gold;
    if (it.kind === 'cup') { k.cyl(0.13, 0.16, 0.06, k.m('#17181c', 0.4), x, 1.03, z, 20); k.cyl(0.03, 0.06, 0.2, mt, x, 1.16, z, 14); k.cyl(0.19, 0.06, 0.34, mt, x, 1.43, z, 22); for (const s of [-1, 1]) { const h = new k.THREE.Mesh(k.own(new k.THREE.TorusGeometry(0.09, 0.014, 8, 16, PI)), mt); h.position.set(k.org.x + x + s * 0.19, 1.45, k.org.z + z); h.rotation.z = -s * PI / 2; k.S.add(h); } }
    else if (it.kind === 'plate') { const d = k.cyl(0.3, 0.3, 0.025, mt, x, 1.36, z, 36); d.rotation.x = PI / 2 - 0.25; k.cyl(0.02, 0.02, 0.3, k.m('#17181c', 0.4), x, 1.15, z - 0.05, 8); }
    else if (it.kind === 'helmet') { const h = k.ball(0.17, k.m(it.color || T.color, 0.25, 0.3), x, 1.2, z); h.scale.set(1.1, 1, 1); k.box(0.2, 0.07, 0.3, k.m('#111318', 0.1, 0.6), x, 1.22, z + 0.1); }
    else { k.box(1.5, 1.0, 0.05, k.m('#0d0e11', 0.5), x, 1.9, -2.96); k.screen(1.4, 0.9, it.paint || paintTable(it.title || '', [], T.color), x, 1.9, -2.92, 0, 0.9, 512); }
    const board = it.kind === 'board';
    stations.push({ p: [x + 0.9, board ? 1.8 : 1.5, z + (board ? 3.4 : 2.3)], l: [x, board ? 1.85 : 1.3, board ? -2.9 : z], f: board ? 30 : 24, kicker: it.kicker, title: it.title, text: it.text });
  });
  k.light.hemi(0x6f7aa8, 0x000000, 0.22);
  return { stations };
}
