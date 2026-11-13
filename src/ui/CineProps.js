// What stands in a cutscene's set (ui/CineSets.js): chairs with their bases and casters, tables on their legs, what lies
// on a desk, lamps, plants, doors, shelves of books, cups turned on a lathe, the garage's cabinets, tyres in their
// blankets, flight cases, trusses and their lamps, cameras on their tripods. Each is put into a batch (ui/CineKit.js:
// b.box, b.cyl, b.lathe ... welded into one mesh a material) at x, z on the floor, facing `f` (0: toward +z).
const PI = Math.PI;
/** where a thing's own (lx: to its right, lz: to its front) is in the set, for a thing at x, z facing f */
const loc = (x, z, f) => { const s = Math.sin(f), c = Math.cos(f); return (lx, lz) => [x + lx * c + lz * s, z - lx * s + lz * c]; };
/** the batch's shapes in a thing's own frame: box(w, h, d, m, lx, y, lz, o, turn), cyl(r0, r1, h, m, lx, y, lz, seg, o) ... */
export function part(b, x, z, f = 0) {
  const P = loc(x, z, f);
  return {
    P, f,
    box(w, h, d, m, lx = 0, y = 0, lz = 0, o = null, turn = 0) { const [px, pz] = P(lx, lz); b.box(w, h, d, m, px, y, pz, f + turn, o); },
    cyl(r0, r1, h, m, lx = 0, y = 0, lz = 0, seg = 20, o = null) { const [px, pz] = P(lx, lz); b.cyl(r0, r1, h, m, px, y, pz, seg, { ...(o || {}), ry: f + (o?.ry || 0) }); },
    ball(r, m, lx = 0, y = 0, lz = 0, o = null) { const [px, pz] = P(lx, lz); b.ball(r, m, px, y, pz, { ...(o || {}), ry: f + (o?.ry || 0) }); },
    lathe(pts, m, lx = 0, y = 0, lz = 0, seg = 32, o = null) { const [px, pz] = P(lx, lz); b.lathe(pts, m, px, y, pz, seg, { ...(o || {}), ry: f + (o?.ry || 0) }); },
    torus(R, r, m, lx = 0, y = 0, lz = 0, o = null) { const [px, pz] = P(lx, lz); b.torus(R, r, m, px, y, pz, { ...(o || {}), ry: f + (o?.ry || 0) }); },
    tube(pts, r, m, o = null) { b.tube(pts.map(([lx, y, lz]) => { const [px, pz] = P(lx, lz); return [px, y, pz]; }), r, m, o); },
  };
}
const steel = (b) => b.m('#9aa0a8', 0.32, 0.85), dark = (b) => b.m('#15161a', 0.55, 0.2), black = (b) => b.m('#0b0c0e', 0.6), white = (b) => b.m('#eceef0', 0.6), chrome = (b) => b.m('#d5d9de', 0.16, 0.95);

// ---- seats -----------------------------------------------------------------------------------------------------------
/** a task or an executive chair on its five-star base. o: { h (the seat's height), col, arms, high (a tall back), cloth } */
export function chair(b, x, z, f = 0, col = '#1b1d22', h = 0.46, o = {}) {
  const p = part(b, x, z, f), up = o.cloth ? b.surf('cloth', col) : b.surf('leather', col, { rough: 0.55 }), st = o.gold ? b.m('#b08d57', 0.3, 0.85) : steel(b), bh = o.high ? 0.74 : 0.5, y = o.y || 0;
  for (let i = 0; i < 5; i++) { const a = i * 1.2566 + 0.3; p.box(0.3, 0.028, 0.05, st, Math.sin(a) * 0.15, y + 0.075, Math.cos(a) * 0.15, { r: 0.012 }, a + PI / 2); p.ball(0.028, black(b), Math.sin(a) * 0.29, y + 0.03, Math.cos(a) * 0.29, { seg: 12 }); }
  p.cyl(0.024, 0.03, h - 0.15, st, 0, y + (h - 0.15) / 2 + 0.07, 0, 12); p.box(0.24, 0.045, 0.26, dark(b), 0, y + h - 0.065, 0, { r: 0.01 });
  p.box(0.5, 0.09, 0.48, up, 0, y + h, 0.01, { r: 0.04, s: 2 });
  p.box(0.46, bh, 0.075, up, 0, y + h + 0.1 + bh / 2, -0.245 - bh * 0.06, { r: 0.035, s: 2, rx: -0.13 }); p.box(0.07, 0.2, 0.03, dark(b), 0, y + h + 0.07, -0.25, { r: 0.008, rx: -0.13 });
  if (o.arms !== false) for (const s of [-1, 1]) { p.box(0.055, 0.03, 0.3, dark(b), s * 0.275, y + h + 0.2, -0.03, { r: 0.013 }); p.cyl(0.013, 0.013, 0.2, st, s * 0.275, y + h + 0.09, -0.06, 8); }
  b.blob(x, z, 0.42, 0.42, 0.45, y + 0.004);
}
/** a stacking chair (a press room's, a canteen's): four legs, a seat, a back */
export function seat(b, x, z, f = 0, col = '#1b1d22', h = 0.45, y = 0) {
  const p = part(b, x, z, f), st = b.m('#1c1d21', 0.4, 0.6), up = b.surf('cloth', col);
  for (const sx of [-0.19, 0.19]) { p.cyl(0.011, 0.011, h, st, sx, y + h / 2, 0.18, 6); p.cyl(0.011, 0.011, h + 0.42, st, sx, y + (h + 0.42) / 2, -0.19, 6, { rx: -0.07 }); }
  p.box(0.43, 0.045, 0.42, up, 0, y + h, 0, { r: 0.018, s: 2 }); p.box(0.41, 0.26, 0.035, up, 0, y + h + 0.33, -0.215, { r: 0.016, s: 2, rx: -0.1 });
  b.blob(x, z, 0.32, 0.32, 0.35, y + 0.004);
}
/** a pit wall's stool: a disc on a column, a foot ring, a low back */
export function stool(b, x, z, f = 0, col = '#1b1d22', h = 0.62, y = 0) {
  const p = part(b, x, z, f), st = steel(b);
  p.lathe([[0, 0], [0.2, 0], [0.2, 0.012], [0.05, 0.035], [0.03, 0.05]], st, 0, y, 0, 28); p.cyl(0.028, 0.028, h - 0.1, st, 0, y + (h - 0.1) / 2 + 0.03, 0, 12); p.torus(0.16, 0.011, st, 0, y + 0.24, 0, { rx: PI / 2 });
  p.lathe([[0, 0], [0.17, 0], [0.2, 0.025], [0.2, 0.06], [0.17, 0.085], [0, 0.09]], b.surf('leather', col), 0, y + h - 0.07, 0, 28);
  p.box(0.34, 0.16, 0.04, b.surf('leather', col), 0, y + h + 0.2, -0.19, { r: 0.02, s: 2, rx: -0.1 }); p.cyl(0.012, 0.012, 0.2, st, 0, y + h + 0.08, -0.185, 6);
}
/** a sofa w wide (an armchair at w = 0.95) */
export function sofa(b, x, z, f = 0, w = 2, col = '#d9d2c3', o = {}) {
  const p = part(b, x, z, f), up = o.leather ? b.surf('leather', col) : b.surf('cloth', col), n = Math.max(1, Math.round((w - 0.3) / 0.75)), cw = (w - 0.32) / n;
  p.box(w, 0.22, 0.86, up, 0, 0.21, 0, { r: 0.04, s: 2 }); p.box(w, 0.5, 0.2, up, 0, 0.55, -0.35, { r: 0.07, s: 2, rx: -0.08 });
  for (const s of [-1, 1]) { p.box(0.17, 0.42, 0.86, up, s * (w / 2 - 0.085), 0.42, 0, { r: 0.06, s: 2 }); for (const lz of [-0.34, 0.34]) p.cyl(0.02, 0.015, 0.1, dark(b), s * (w / 2 - 0.1), 0.05, lz, 8); }
  for (let i = 0; i < n; i++) { const lx = -w / 2 + 0.16 + cw * (i + 0.5); p.box(cw - 0.02, 0.15, 0.62, up, lx, 0.39, 0.08, { r: 0.06, s: 3 }); p.box(cw - 0.03, 0.36, 0.15, up, lx, 0.63, -0.22, { r: 0.065, s: 3, rx: -0.2 }); }
  if (o.pillow) p.box(0.4, 0.4, 0.13, b.surf('cloth', o.pillow), -w / 2 + 0.42, 0.62, 0.02, { r: 0.06, s: 3, rx: -0.35, rz: 0.2 });
  b.blob(x, z, w / 2 + 0.15, 0.6, 0.5, 0.004, f);
}

// ---- tables ----------------------------------------------------------------------------------------------------------
/** a table w x d: its top (m: a material or a wood's colour), on legs ('legs'), panels ('panel'), a pedestal ('ped') or trestles */
export function table(b, w, d, x, z, h = 0.75, m = '#3a2a1e', f = 0, o = {}) {
  const p = part(b, x, z, f), top = typeof m === 'string' ? b.surf('wood', m, { rough: o.rough ?? 0.36 }) : m, leg = o.leg || b.m('#17181c', 0.5, 0.5), kind = o.kind || 'legs';
  p.box(w, 0.045, d, top, 0, h - 0.0225, 0, { r: 0.012, s: 2 });
  if (kind === 'legs') { for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(0.05, h - 0.045, 0.05, leg, sx * (w / 2 - 0.07), (h - 0.045) / 2, sz * (d / 2 - 0.07), { r: 0.008 }); p.box(w - 0.2, 0.06, 0.025, leg, 0, h - 0.085, d / 2 - 0.07); p.box(w - 0.2, 0.06, 0.025, leg, 0, h - 0.085, -d / 2 + 0.07); }
  else if (kind === 'panel') { for (const sx of [-1, 1]) p.box(0.04, h - 0.045, d - 0.1, leg, sx * (w / 2 - 0.1), (h - 0.045) / 2, 0, { r: 0.006 }); p.box(w - 0.24, h * 0.5, 0.025, leg, 0, h - 0.045 - h * 0.25, -d / 2 + 0.12, { r: 0.004 }); }
  else if (kind === 'ped') { const n = Math.max(1, Math.round(w / 2.4)); for (let i = 0; i < n; i++) { const lx = n === 1 ? 0 : -w / 2 + w * (i + 0.5) / n; p.box(Math.min(1.1, w * 0.3), 0.04, d * 0.7, leg, lx, 0.02, 0, { r: 0.01 }); p.box(Math.min(0.8, w * 0.2), h - 0.085, d * 0.3, leg, lx, (h - 0.085) / 2 + 0.04, 0, { r: 0.02, s: 2 }); } }
  else { for (const sx of [-1, 1]) { p.box(0.04, h - 0.045, 0.04, leg, sx * (w / 2 - 0.2), (h - 0.045) / 2, d / 2 - 0.12, { rx: 0.14 }); p.box(0.04, h - 0.045, 0.04, leg, sx * (w / 2 - 0.2), (h - 0.045) / 2, -d / 2 + 0.12, { rx: -0.14 }); } }
  b.blob(x, z, w / 2 + 0.1, d / 2 + 0.1, 0.45, 0.004, f);
}
/** a round table (a cafe's, a lounge's): r, on a column and a foot */
export function roundTable(b, x, z, r = 0.45, h = 0.74, top = '#f1f2f4', o = {}) {
  const m = typeof top === 'string' ? b.m(top, 0.4, 0.05) : top, st = o.leg || steel(b);
  b.lathe([[0, 0], [r, 0], [r + 0.008, 0.012], [r, 0.026], [0, 0.026]], m, x, h - 0.026, z, 40); b.cyl(0.03, 0.03, h - 0.04, st, x, (h - 0.04) / 2 + 0.01, z, 12); b.lathe([[0, 0], [r * 0.55, 0], [r * 0.55, 0.012], [0.05, 0.04], [0.03, 0.06]], st, x, 0, z, 28); b.blob(x, z, r + 0.1, r + 0.1, 0.4);
}

// ---- what lies on a desk ---------------------------------------------------------------------------------------------
/** a laptop, open (its screen glowing: lit) */
export function laptop(b, x, y, z, f = 0, lit = '#9fc0ff') {
  const p = part(b, x, z, f), al = b.m('#8d9198', 0.35, 0.8), t = 0.32;
  p.box(0.32, 0.014, 0.22, al, 0, y + 0.007, 0, { r: 0.005 }); p.box(0.27, 0.002, 0.1, black(b), 0, y + 0.0152, -0.03); p.box(0.1, 0.002, 0.06, b.m('#7d8188', 0.3, 0.8), 0, y + 0.0152, 0.065);
  p.box(0.32, 0.21, 0.008, al, 0, y + 0.014 + 0.105 * Math.cos(t), -0.11 - 0.105 * Math.sin(t), { r: 0.003, rx: -t });
  if (lit) p.box(0.296, 0.186, 0.002, b.glow(lit, 1.5), 0, y + 0.014 + 0.105 * Math.cos(t) + 0.005 * Math.sin(t), -0.11 - 0.105 * Math.sin(t) + 0.005 * Math.cos(t), { rx: -t, sh: false });
}
/** a monitor on its stand (w x h m): -> the screen (a k.screen: redraw) */
export function monitor(b, x, y, z, f = 0, w = 0.6, h = 0.36, draw = null, bright = 1.1, px = 256) {
  const p = part(b, x, z, f);
  p.box(0.24, 0.012, 0.18, dark(b), 0, y + 0.006, -0.02, { r: 0.005 }); p.box(0.045, 0.16 + h * 0.3, 0.03, dark(b), 0, y + 0.08 + h * 0.15, -0.045, { r: 0.008 });
  p.box(w + 0.024, h + 0.024, 0.028, b.m('#0d0e11', 0.5, 0.2), 0, y + 0.13 + h / 2, 0, { r: 0.008 });
  const [sx, sz] = p.P(0, 0.016); return b.screen(w, h, draw || ((c, W, H) => { c.fillStyle = '#0c1220'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(160,190,255,.5)'; for (let i = 0; i < 7; i++) c.fillRect(W * 0.06, H * (0.14 + i * 0.11), W * (0.3 + b.rnd() * 0.55), H * 0.05); }), sx, y + 0.13 + h / 2, sz, f, bright, px);
}
export function keyboard(b, x, y, z, f = 0) { const p = part(b, x, z, f); p.box(0.38, 0.014, 0.125, dark(b), 0, y + 0.007, 0, { r: 0.005 }); p.box(0.35, 0.004, 0.1, b.m('#26282e', 0.7), 0, y + 0.016, 0); p.ball(0.03, dark(b), 0.29, y + 0.012, 0.01, { sc: [1, 0.55, 1.5], seg: 12 }); }
export function mug(b, x, y, z, col = '#eceef0') { b.lathe([[0, 0], [0.034, 0], [0.038, 0.01], [0.04, 0.092], [0.034, 0.092], [0.032, 0.012], [0, 0.012]], b.m(col, 0.35), x, y, z, 20); b.torus(0.024, 0.006, b.m(col, 0.35), x + 0.045, y + 0.048, z, { arc: PI, rz: -PI / 2 }); }
export function bottle(b, x, y, z, col = '#9fd0e8', s = 1) { b.lathe([[0, 0], [0.03, 0], [0.033, 0.02], [0.033, 0.14], [0.014, 0.19], [0.013, 0.215]].map((q) => [q[0] * s, q[1] * s]), b.m(col, 0.12, 0.05, { transparent: true, opacity: 0.72 }), x, y, z, 18); b.cyl(0.015 * s, 0.015 * s, 0.022 * s, b.m('#f1f2f4', 0.5), x, y + 0.226 * s, z, 10); }
export function glass(b, x, y, z) { b.lathe([[0, 0], [0.028, 0], [0.034, 0.11], [0.031, 0.11], [0.026, 0.012], [0, 0.012]], b.m('#dfeaf2', 0.08, 0.05, { transparent: true, opacity: 0.4 }), x, y, z, 18); }
/** a stack of papers (n sheets; a pen across them) */
export function papers(b, x, y, z, f = 0, n = 3, pen = true) { const m = b.m('#f3f1ea', 0.9); for (let i = 0; i < n; i++) b.box(0.21, 0.0025, 0.297, m, x + (b.rnd() - 0.5) * 0.02, y + 0.0015 + i * 0.0026, z + (b.rnd() - 0.5) * 0.02, f + (b.rnd() - 0.5) * 0.3); if (pen) b.cyl(0.005, 0.005, 0.14, b.m('#1b2a55', 0.3, 0.4), x + 0.03, y + 0.008 + n * 0.0026, z, 8, { rx: PI / 2, ry: f + 0.6 }); }
export function binder(b, x, y, z, f = 0, col = '#2a3a5a', lying = true) { if (lying) b.box(0.25, 0.045, 0.31, b.m(col, 0.6), x, y + 0.0225, z, f, { r: 0.006 }); else b.box(0.06, 0.31, 0.25, b.m(col, 0.6), x, y + 0.155, z, f, { r: 0.006 }); }
export function phone(b, x, y, z, f = 0, lit = null) { b.box(0.072, 0.008, 0.15, black(b), x, y + 0.004, z, f, { r: 0.0035 }); if (lit) b.box(0.064, 0.001, 0.138, b.glow(lit, 1.3), x, y + 0.0087, z, f, { sh: false }); }
/** a table microphone on its gooseneck, leaning toward f */
export function mic(b, x, y, z, f = 0, h = 0.26) {
  const p = part(b, x, z, f); p.lathe([[0, 0], [0.045, 0], [0.045, 0.012], [0.012, 0.022]], dark(b), 0, y, 0, 20);
  p.tube([[0, y + 0.02, 0], [0, y + h * 0.6, 0.01], [0, y + h * 0.92, 0.06], [0, y + h, 0.13]], 0.005, dark(b)); p.cyl(0.012, 0.01, 0.06, dark(b), 0, y + h + 0.004, 0.155, 10, { rx: 1.25 }); p.ball(0.02, b.m('#101114', 0.95), 0, y + h + 0.012, 0.19, { seg: 14 });
}
/** a headset (hung up or lying): the band, two cups, a boom */
export function headset(b, x, y, z, f = 0, col = '#17181c') { const p = part(b, x, z, f), m = b.m(col, 0.5); p.torus(0.09, 0.009, m, 0, y, 0, { arc: PI }); for (const s of [-1, 1]) p.cyl(0.042, 0.042, 0.035, m, s * 0.09, y - 0.01, 0, 16, { rz: PI / 2 }); p.tube([[-0.09, y - 0.02, 0.01], [-0.085, y - 0.07, 0.06], [-0.04, y - 0.085, 0.1]], 0.004, m); }
/** a desk lamp: -> where its light is */
export function deskLamp(b, x, y, z, f = 0, col = '#b08d57') {
  const p = part(b, x, z, f), m = b.m(col, 0.3, 0.85); p.lathe([[0, 0], [0.075, 0], [0.075, 0.015], [0.015, 0.03]], m, 0, y, 0, 24);
  p.tube([[0, y + 0.03, 0], [0, y + 0.3, -0.02], [0, y + 0.42, 0.06], [0, y + 0.4, 0.18]], 0.008, m); p.lathe([[0.02, 0.09], [0.035, 0.07], [0.085, 0], [0.09, 0], [0.04, 0.075], [0.022, 0.095]], m, 0, y + 0.31, 0.2, 24, { rx: 0.35 }); p.ball(0.03, b.glow('#ffd9a0', 2.4), 0, y + 0.345, 0.205, { seg: 12, sh: false });
  const [lx, lz] = p.P(0, 0.22); return [lx, y + 0.3, lz];
}

// ---- lamps, plants, the room's own things -----------------------------------------------------------------------------
/** a lamp let into a ceiling at y (its face glowing) */
export function downlight(b, x, y, z, col = '#fff1d6', I = 2.2, r = 0.07) { b.cyl(r + 0.015, r + 0.015, 0.012, b.m('#d9dce1', 0.4, 0.5), x, y - 0.006, z, 20, { sh: false }); b.cyl(r, r, 0.006, b.glow(col, I), x, y - 0.014, z, 20, { sh: false }); }
/** a lamp hung on its cord from `top` down to y: a dome, the bulb glowing under it */
export function pendant(b, x, y, z, top, col = '#17181c', glow = '#ffe2b0', r = 0.22) { b.cyl(0.004, 0.004, top - y - 0.14, black(b), x, (top + y + 0.14) / 2, z, 6, { sh: false }); b.lathe([[r + 0.006, 0], [r * 0.72, 0.078], [0.055, 0.158], [0.02, 0.168], [0.02, 0.16], [0.05, 0.15], [r * 0.7, 0.07], [r, 0]], b.m(col, 0.4, 0.4), x, y, z, 32); b.ball(0.04, b.glow(glow, 3), x, y + 0.04, z, { seg: 12, sh: false }); }
/** a strip light on its housing, hung at y (len along x, or along z) */
export function linear(b, x, y, z, len = 4, alongZ = false, col = '#f4f7ff', I = 2.2, drop = 0) {
  const w = alongZ ? 0.16 : len, d = alongZ ? len : 0.16; b.box(w, 0.06, d, b.m('#22252b', 0.5, 0.5), x, y + 0.03, z, 0, { sh: false, r: 0.01 }); b.box(alongZ ? 0.11 : len - 0.06, 0.012, alongZ ? len - 0.06 : 0.11, b.glow(col, I), x, y - 0.005, z, 0, { sh: false });
  if (drop) for (const s of [-0.4, 0.4]) b.cyl(0.004, 0.004, drop, steel(b), x + (alongZ ? 0 : s * len), y + 0.06 + drop / 2, z + (alongZ ? s * len : 0), 6, { sh: false });
}
/** a floor lamp: a pole, a drum shade glowing */
export function floorLamp(b, x, z, h = 1.6, glow = '#ffd9a0') { b.lathe([[0, 0], [0.15, 0], [0.15, 0.015], [0.02, 0.035]], dark(b), x, 0, z, 24); b.cyl(0.012, 0.012, h - 0.25, dark(b), x, (h - 0.25) / 2 + 0.03, z, 8); b.cyl(0.17, 0.2, 0.28, b.glow(glow, 1.7), x, h - 0.1, z, 28, { open: true, sh: false }); b.blob(x, z, 0.22, 0.22, 0.4); }
/** a plant in its pot: h tall, big leaves on bowed stems */
export function plant(b, x, z, h = 1.5, pot = '#d9d6cf', leaf = '#2f5a35') {
  const s = Math.min(1.2, h / 1.5), L = b.m(leaf, 0.55), L2 = b.m('#3c6f41', 0.5), St = b.m('#3a2f24', 0.8);
  b.lathe([[0, 0], [0.15, 0], [0.2, 0.36], [0.215, 0.4], [0.19, 0.4], [0.18, 0.37], [0, 0.37]].map((q) => [q[0] * s, q[1] * s]), b.m(pot, 0.6), x, 0, z, 28); b.cyl(0.178 * s, 0.178 * s, 0.02, b.m('#2a2018', 1), x, 0.372 * s, z, 20);   /* (the soil: over the pot's own floor, not level with it) */
  const n = Math.round(9 + h * 4);
  for (let i = 0; i < n; i++) {
    const a = i * 2.4 + b.rnd() * 0.5, u = (i + 1) / n, reach = (0.16 + 0.42 * Math.sin(u * PI * 0.85)) * s, top = 0.4 * s + (h - 0.4 * s) * (0.3 + 0.7 * u), dx = Math.sin(a), dz = Math.cos(a), ex = x + dx * reach, ez = z + dz * reach;
    b.tube([[x + dx * 0.03, 0.37 * s, z + dz * 0.03], [x + dx * reach * 0.35, top * 0.72, z + dz * reach * 0.35], [ex, top, ez]], 0.007 * s, St, { seg: 8 });
    b.ball(1, i % 3 ? L : L2, ex + dx * 0.1 * s, top - 0.02, ez + dz * 0.1 * s, { seg: 10, sc: [0.085 * s, 0.01, 0.2 * s], ry: a, rx: 0.5 + b.rnd() * 0.5 });
  }
  b.blob(x, z, 0.45 * s, 0.45 * s, 0.45);
}
/** a skirting board (or a rail) along a wall from one point to another */
export function rail(b, x0, z0, x1, z1, y = 0.05, h = 0.1, t = 0.02, m = null) { const L = Math.hypot(x1 - x0, z1 - z0); b.box(L, h, t, m || white(b), (x0 + x1) / 2, y, (z0 + z1) / 2, Math.atan2(-(z1 - z0), x1 - x0), { sh: false, r: 0 }); }
/** a door in its frame, standing against a wall at x, z (f: the way it faces into the room). o: { w, h, col, glass, sign } */
export function door(b, x, z, f = 0, o = {}) {
  const p = part(b, x, z, f), w = o.w || 0.95, h = o.h || 2.1, fr = b.m(o.frame || '#2a2c31', 0.5, 0.3), lf = o.wood ? b.surf('wood', o.col || '#5a4030') : b.m(o.col || '#d9dbde', 0.5);
  p.box(0.07, h + 0.07, 0.09, fr, -w / 2 - 0.035, (h + 0.07) / 2, 0.045, { r: 0.006 }); p.box(0.07, h + 0.07, 0.09, fr, w / 2 + 0.035, (h + 0.07) / 2, 0.045, { r: 0.006 }); p.box(w + 0.14, 0.07, 0.09, fr, 0, h + 0.035, 0.045, { r: 0.006 });
  p.box(w, h, 0.045, lf, 0, h / 2, 0.035, { r: 0.004 }); p.box(w - 0.02, 0.2, 0.004, steel(b), 0, 0.11, 0.06); p.cyl(0.011, 0.011, 0.05, chrome(b), w / 2 - 0.08, 1.02, 0.08, 8, { rx: PI / 2 }); p.box(0.13, 0.02, 0.02, chrome(b), w / 2 - 0.135, 1.02, 0.1, { r: 0.008 });
  if (o.glass) { p.box(w * 0.34, h * 0.4, 0.006, b.m('#1a2633', 0.08, 0.6), -w * 0.08, h * 0.68, 0.058); }
  if (o.exit) { p.box(0.34, 0.14, 0.03, b.glow('#39d98a', 1.5), 0, h + 0.2, 0.05, { sh: false, r: 0.006 }); }
}
/** a vent's grille on a wall */
export function vent(b, x, y, z, f = 0, w = 0.6, h = 0.3) { const p = part(b, x, z, f), m = b.m('#c9ccd1', 0.5, 0.5); p.box(w, h, 0.02, m, 0, y, 0.01, { r: 0.004, sh: false }); for (let i = 0; i < Math.round(h / 0.045); i++) p.box(w - 0.05, 0.006, 0.02, dark(b), 0, y - h / 2 + 0.04 + i * 0.045, 0.022, { rx: 0.5, sh: false }); }
/** a clock on a wall */
export function clock(b, x, y, z, f = 0, r = 0.17) { const p = part(b, x, z, f); p.cyl(r, r, 0.03, dark(b), 0, y, 0.015, 32, { rx: PI / 2, sh: false }); p.cyl(r - 0.015, r - 0.015, 0.006, white(b), 0, y, 0.031, 32, { rx: PI / 2, sh: false }); p.box(0.012, r * 0.62, 0.004, black(b), 0.02, y + r * 0.26, 0.036, { rz: -0.35, sh: false }); p.box(0.01, r * 0.85, 0.004, black(b), -0.045, y + r * 0.2, 0.037, { rz: 0.9, sh: false }); }
/** a picture in its frame on a wall (w x h m; draw: its painter) */
export function picture(b, x, y, z, f, w, h, draw, col = '#17181c', px = 384) {
  const p = part(b, x, z, f), m = b.m(col, 0.45, 0.2), t = 0.035;
  p.box(w + t * 2, t, 0.04, m, 0, y + h / 2 + t / 2, 0.02, { r: 0.005, sh: false }); p.box(w + t * 2, t, 0.04, m, 0, y - h / 2 - t / 2, 0.02, { r: 0.005, sh: false }); p.box(t, h, 0.04, m, -w / 2 - t / 2, y, 0.02, { r: 0.005, sh: false }); p.box(t, h, 0.04, m, w / 2 + t / 2, y, 0.02, { r: 0.005, sh: false });
  const [sx, sz] = p.P(0, 0.012); return b.sign(w, h, draw, sx, y, sz, f, px);
}
/** a fire extinguisher on its bracket */
export function extinguisher(b, x, z, f = 0, y = 0.55) { const p = part(b, x, z, f); p.lathe([[0, 0], [0.075, 0], [0.078, 0.02], [0.078, 0.4], [0.04, 0.47], [0.03, 0.5]], b.m('#c8102e', 0.3, 0.2), 0, y, 0.09, 20); p.box(0.07, 0.05, 0.04, black(b), 0, y + 0.52, 0.09, { r: 0.008 }); p.tube([[0.03, y + 0.5, 0.09], [0.11, y + 0.42, 0.1], [0.1, y + 0.2, 0.1]], 0.008, black(b)); }
/** a bin */
export function bin(b, x, z, col = '#2a2d33') { b.lathe([[0, 0], [0.13, 0], [0.16, 0.36], [0.165, 0.37], [0.15, 0.37], [0.125, 0.02], [0, 0.02]], b.m(col, 0.5, 0.4), x, 0, z, 24); b.blob(x, z, 0.2, 0.2, 0.4); }
/** shelves against a wall, w wide, rows of books and things. o: { h, d, rows, wood, cups (how many of the things are cups) } */
export function shelves(b, x, z, f = 0, w = 1.6, o = {}) {
  const p = part(b, x, z, f), h = o.h || 2.1, d = o.d || 0.32, rows = o.rows || 5, wood = b.surf('wood', o.wood || '#3a2a1e'), BK = ['#5a2a2a', '#2a3a5a', '#3b3b3b', '#6a5a3a', '#1f3b33', '#7a6a55', '#22252b', '#8a3a2a', '#d9d2c3'], gap = (h - 0.1) / rows;
  p.box(0.035, h, d, wood, -w / 2 + 0.0175, h / 2, d / 2); p.box(0.035, h, d, wood, w / 2 - 0.0175, h / 2, d / 2); p.box(w - 0.03, h - 0.02, 0.012, b.m('#1a1512', 0.8), 0, h / 2, 0.008);
  let cups = o.cups || 0;
  for (let r = 0; r <= rows; r++) {
    const y = 0.05 + r * gap; p.box(w - 0.07, 0.03, d, wood, 0, y, d / 2); if (r === rows) break;
    if (r === (o.cupRow ?? 2) && cups > 0) { const n = cups; for (let i = 0; i < n; i++) cup(b, ...p.P(-w / 2 + (w * (i + 0.5)) / n, d / 2), y + 0.015, b.m('#d9b04a', 0.22, 0.95), Math.min(0.62, (gap - 0.08) / 0.48)); cups = 0; continue; }
    let lx = -w / 2 + 0.07; const end = w / 2 - 0.07;
    while (lx < end - 0.08) {
      const q = b.rnd();
      if (q < 0.16 && lx < end - 0.3) { if (cups > 0) { cup(b, ...p.P(lx + 0.13, d / 2), y + 0.015, b.m('#d9b04a', 0.22, 0.95), 0.55); cups--; } else if (b.rnd() < 0.5) p.box(0.2, 0.14, 0.2, b.m(BK[(b.rnd() * BK.length) | 0], 0.7), lx + 0.12, y + 0.085, d / 2, { r: 0.01 }); lx += 0.3; continue; }
      const n = 3 + ((b.rnd() * 6) | 0), lean = b.rnd() < 0.2;
      for (let i = 0; i < n && lx < end - 0.04; i++) { const t = 0.022 + b.rnd() * 0.03, bh = Math.min(gap - 0.07, 0.2 + b.rnd() * 0.1), bd = 0.15 + b.rnd() * 0.07; p.box(t, bh, bd, b.m(BK[(b.rnd() * BK.length) | 0], 0.75), lx + t / 2, y + 0.015 + bh / 2, d - bd / 2 - 0.02, { r: 0.003, rz: lean && i === n - 1 ? 0.18 : 0 }); lx += t + 0.002; }
      lx += 0.03 + b.rnd() * 0.12;
    }
  }
}
/** a cup turned on a lathe (m: its metal; s: its size), its handles, on a dark base */
export function cup(b, x, z, y, m, s = 1, handles = true) {
  const S = (pts) => pts.map((q) => [q[0] * s, q[1] * s]);
  b.lathe(S([[0, 0], [0.11, 0], [0.11, 0.05], [0.095, 0.06], [0, 0.06]]), b.m('#15120f', 0.35, 0.1), x, y, z, 28);
  b.lathe(S([[0, 0.06], [0.075, 0.06], [0.07, 0.075], [0.03, 0.09], [0.018, 0.13], [0.03, 0.17], [0.022, 0.19], [0.05, 0.215], [0.11, 0.27], [0.142, 0.36], [0.15, 0.46], [0.158, 0.47], [0.146, 0.47], [0.135, 0.365], [0.1, 0.28], [0, 0.225]]), m, x, y, z, 40);
  if (handles) for (const sd of [-1, 1]) b.torus(0.062 * s, 0.009 * s, m, x + sd * 0.16 * s, y + 0.37 * s, z, { arc: PI * 1.1, rz: sd > 0 ? -PI * 0.55 : PI * 0.45 });
}
/** a plate on its stand (a podium's second and third) */
export function plate(b, x, z, y, m, s = 1) { b.lathe([[0, 0], [0.1 * s, 0], [0.1 * s, 0.03 * s], [0, 0.03 * s]], b.m('#15120f', 0.35, 0.1), x, y, z, 24); b.cyl(0.012 * s, 0.012 * s, 0.26 * s, b.m('#15120f', 0.35, 0.1), x, y + 0.15 * s, z - 0.05 * s, 8, { rx: -0.2 }); b.lathe([[0, 0], [0.12, 0], [0.2, 0.012], [0.3, 0.035], [0.31, 0.04], [0.3, 0.047], [0.2, 0.024], [0.12, 0.012], [0, 0.012]].map((q) => [q[0] * s, q[1] * s]), m, x, y + 0.36 * s, z, 44, { rx: PI / 2 - 0.25 }); }
/** a helmet on show: the shell, its visor, a stripe over the top */
export function helmet(b, x, z, y, col = '#e10600', f = 0, acc = '#ffffff') {
  b.lathe([[0, 0], [0.1, 0], [0.11, 0.02], [0.1, 0.03], [0, 0.03]], b.m('#15120f', 0.35), x, y, z, 24); return b.helmet(col, acc, [x, y + 0.145, z], f);
}

// ---- the garage's ----------------------------------------------------------------------------------------------------
/** a tool cabinet on casters: drawers with their pulls, a worktop and what lies on it */
export function cabinet(b, x, z, f = 0, col = '#b3141b', w = 1.3, o = {}) {
  const p = part(b, x, z, f), body = b.m(col, 0.3, 0.35), n = 5, dh = 0.7 / n;
  p.box(w, 0.8, 0.55, body, 0, 0.5, 0, { r: 0.014, s: 2 }); p.box(w + 0.04, 0.035, 0.6, b.m('#15161a', 0.75), 0, 0.9175, 0, { r: 0.01 }); p.box(w + 0.04, 0.03, 0.02, steel(b), 0, 0.95, -0.29, { r: 0.006 });
  for (let i = 0; i < n; i++) { const y = 0.16 + (i + 0.5) * dh; p.box(w - 0.07, dh - 0.016, 0.014, body, 0, y, 0.279, { r: 0.004 }); p.box(w - 0.22, 0.014, 0.022, b.surf('brushed', '#c9ccd1'), 0, y + dh * 0.22, 0.294, { r: 0.005 }); }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { p.cyl(0.045, 0.045, 0.035, black(b), sx * (w / 2 - 0.1), 0.045, sz * 0.19, 12, { rz: PI / 2 }); p.box(0.05, 0.03, 0.05, steel(b), sx * (w / 2 - 0.1), 0.095, sz * 0.19); }
  p.tube([[w / 2 + 0.01, 0.55, -0.16], [w / 2 + 0.06, 0.58, -0.16], [w / 2 + 0.06, 0.58, 0.16], [w / 2 + 0.01, 0.55, 0.16]], 0.011, steel(b));
  if (o.top !== false) { const q = b.rnd(); if (q < 0.4) { const [qx, qz] = p.P(-w * 0.2, 0); laptop(b, qx, 0.935, qz, f + (b.rnd() - 0.5) * 0.4); } p.box(0.3, 0.05, 0.2, b.m('#2a2d33', 0.6), w * 0.22, 0.96, 0.05, { r: 0.008 }, 0.2); p.cyl(0.03, 0.03, 0.16, b.m(['#e0a100', '#2d6cdf', '#d9dce1'][(b.rnd() * 3) | 0], 0.4), w * 0.02, 1.015, -0.14, 12); p.torus(0.045, 0.014, b.m('#c9a46c', 0.8), w * 0.38, 0.95, -0.15, { rx: PI / 2 }); p.cyl(0.011, 0.011, 0.34, chrome(b), -w * 0.05, 0.946, 0.16, 8, { rz: PI / 2, ry: 0.3 }); }
  b.blob(x, z, w / 2 + 0.12, 0.42, 0.55, 0.004, f);
}
/** a stack of tyres in their blankets (n high), a cable down from one; bare: racing tyres, the compound's band on the wall */
export function tyres(b, x, z, n = 4, col = '#22252b', o = {}) {
  const cloth = b.surf('canvas', col), cloth2 = b.surf('canvas', '#191a1e'), rub = b.m('#111214', 0.85), band = b.m(o.band || '#e10600', 0.5);
  for (let i = 0; i < n; i++) {
    const y = i * 0.315;
    if (o.bare) { b.lathe([[0.2, 0.01], [0.31, 0], [0.355, 0.03], [0.365, 0.15], [0.355, 0.27], [0.31, 0.3], [0.2, 0.29]], rub, x, y, z, 36); b.torus(0.285, 0.008, band, x, y + 0.3, z, { rx: PI / 2 }); b.cyl(0.2, 0.2, 0.26, b.m('#2a2c31', 0.35, 0.8), x, y + 0.15, z, 24); }
    else { b.lathe([[0.2, 0.015], [0.33, 0], [0.37, 0.035], [0.378, 0.155], [0.37, 0.275], [0.33, 0.31], [0.2, 0.295]], i % 2 ? cloth : cloth2, x, y, z, 36); b.cyl(0.38, 0.38, 0.03, black(b), x, y + 0.155, z, 28, { open: true }); b.cyl(0.2, 0.2, 0.27, black(b), x, y + 0.155, z, 20); b.box(0.07, 0.05, 0.03, b.m('#2a2d33', 0.5), x + 0.37, y + 0.09, z, 0, { r: 0.008 }); }
  }
  if (!o.bare) b.tube([[x + 0.39, (n - 1) * 0.315 + 0.09, z], [x + 0.47, (n - 1) * 0.3 * 0.5, z + 0.05], [x + 0.5, 0.02, z + 0.12], [x + 0.72, 0.012, z + 0.3]], 0.008, b.m('#e0a100', 0.6));
  b.blob(x, z, 0.5, 0.5, 0.55);
}
/** a flight case: its edges in aluminium, its catches, on casters. w x h x d */
export function flightCase(b, x, z, f = 0, w = 1.1, h = 0.7, d = 0.6, col = '#17181c', y = 0.1) {
  const p = part(b, x, z, f), al = b.surf('brushed', '#b9bdc4'), e = 0.022;
  p.box(w, h, d, b.m(col, 0.6, 0.1), 0, y + h / 2, 0, { r: 0.004 });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.box(e, h + 0.006, e, al, sx * (w / 2 - e / 2 + 0.003), y + h / 2, sz * (d / 2 - e / 2 + 0.003));
  for (const sy of [0, 1]) { for (const sz of [-1, 1]) p.box(w + 0.006, e, e, al, 0, y + sy * h + (sy ? -1 : 1) * (e / 2 - 0.003), sz * (d / 2 - e / 2 + 0.003)); for (const sx of [-1, 1]) p.box(e, e, d + 0.006, al, sx * (w / 2 - e / 2 + 0.003), y + sy * h + (sy ? -1 : 1) * (e / 2 - 0.003), 0); }
  for (const sx of [-0.3, 0.3]) p.box(0.07, 0.09, 0.012, al, sx * w, y + h * 0.72, d / 2 + 0.005, { r: 0.004 }); p.box(0.16, 0.035, 0.03, black(b), 0, y + h * 0.45, d / 2 + 0.012, { r: 0.01 });
  if (y > 0.05) for (const sx of [-1, 1]) for (const sz of [-1, 1]) p.cyl(0.045, 0.045, 0.035, black(b), sx * (w / 2 - 0.1), 0.045, sz * (d / 2 - 0.1), 12, { rz: PI / 2 });
  b.blob(x, z, w / 2 + 0.1, d / 2 + 0.1, 0.5, 0.004, f);
}
/** a front wing on its stand (a spare, in the team's colour) */
export function wingStand(b, x, z, f = 0, col = '#e10600', col2 = '#111318') {
  const p = part(b, x, z, f), m = b.m(col, 0.25, 0.3), c = b.m(col2, 0.3, 0.3), st = steel(b);
  for (const sx of [-0.45, 0.45]) { p.cyl(0.014, 0.014, 0.8, st, sx, 0.4, 0, 8); p.box(0.05, 0.02, 0.5, st, sx, 0.012, 0, { r: 0.006 }); } p.cyl(0.012, 0.012, 0.9, st, 0, 0.5, 0, 8, { rz: PI / 2 });
  p.box(1.9, 0.02, 0.34, c, 0, 0.86, 0, { r: 0.008, rx: -0.12 }); p.box(1.8, 0.016, 0.2, m, 0, 0.93, -0.1, { r: 0.006, rx: -0.3 }); p.box(1.7, 0.014, 0.14, m, 0, 0.99, -0.17, { r: 0.006, rx: -0.5 });
  for (const sx of [-1, 1]) p.box(0.016, 0.24, 0.42, m, sx * 0.955, 0.93, -0.03, { r: 0.006 }); p.box(0.2, 0.12, 0.6, m, 0, 0.9, 0.12, { r: 0.05, s: 2, rx: -0.1 });
  b.blob(x, z, 1.0, 0.35, 0.4, 0.004, f);
}
/** a gas bottle on its trolley (the wheel guns' nitrogen) */
export function gasBottle(b, x, z, col = '#2d6cdf') { b.lathe([[0, 0], [0.11, 0], [0.115, 0.02], [0.115, 1.15], [0.09, 1.28], [0.035, 1.34], [0.03, 1.4]], b.m(col, 0.35, 0.4), x, 0.04, z, 24); b.cyl(0.04, 0.04, 0.06, b.m('#c9a46c', 0.3, 0.8), x, 1.47, z, 10); b.box(0.3, 0.03, 0.3, dark(b), x, 0.025, z, 0, { r: 0.008 }); b.blob(x, z, 0.22, 0.22, 0.5); }
/** a wheel gun lying, its hose off to (hx, hz) on the floor */
export function wheelGun(b, x, y, z, f = 0, col = '#e0a100') { const p = part(b, x, z, f); p.cyl(0.045, 0.045, 0.2, b.m('#2a2d33', 0.35, 0.7), 0, y + 0.05, 0, 14, { rx: PI / 2 }); p.cyl(0.03, 0.03, 0.09, chrome(b), 0, y + 0.05, 0.14, 10, { rx: PI / 2 }); p.box(0.04, 0.14, 0.05, b.m(col, 0.5), 0, y + 0.05, -0.06, { r: 0.012, rx: 1.2 }); }
/** a box truss between two points (level), s square */
export function truss(b, x0, y, z0, x1, z1, s = 0.3, m = null) {
  const L = Math.hypot(x1 - x0, z1 - z0), f = Math.atan2(-(z1 - z0), x1 - x0), p = part(b, (x0 + x1) / 2, (z0 + z1) / 2, f), al = m || b.m('#8d9198', 0.4, 0.8), n = Math.max(2, Math.round(L / (s * 1.4)));
  for (const sy of [-1, 1]) for (const sz of [-1, 1]) p.cyl(0.022, 0.022, L, al, 0, y + sy * s / 2, sz * s / 2, 8, { rz: PI / 2, sh: false });
  for (let i = 0; i < n; i++) { const lx = -L / 2 + L * (i + 0.5) / n, a = Math.atan2(s, L / n); for (const sz of [-1, 1]) p.cyl(0.011, 0.011, Math.hypot(s, L / n), al, lx, y, sz * s / 2, 6, { rz: (i % 2 ? 1 : -1) * (PI / 2 - a), sh: false }); p.cyl(0.011, 0.011, Math.hypot(s, L / n), al, lx, y + s / 2, 0, 6, { rz: PI / 2, ry: (i % 2 ? 1 : -1) * a, sh: false }); }
}
/** a stage lamp hung under a truss at x, y, z, aimed down toward (ax, az) on the floor; -> nothing (its lens glows in col) */
export function stageLamp(b, x, y, z, ax = x, az = z, col = '#cfd8ff', I = 3) {
  const f = Math.atan2(ax - x, az - z), tilt = Math.atan2(Math.hypot(ax - x, az - z), y), p = part(b, x, z, f), m = black(b);
  p.cyl(0.02, 0.02, 0.12, m, 0, y - 0.06, 0, 6, { sh: false }); p.box(0.3, 0.05, 0.05, m, 0, y - 0.13, 0, { sh: false, r: 0.01 }); for (const s of [-1, 1]) p.box(0.025, 0.22, 0.05, m, s * 0.14, y - 0.24, 0, { sh: false, r: 0.008 });
  p.cyl(0.1, 0.12, 0.3, m, 0, y - 0.3, 0, 18, { rx: -tilt, sh: false }); p.cyl(0.095, 0.095, 0.012, b.glow(col, I), 0, y - 0.3 - Math.cos(tilt) * 0.152, Math.sin(tilt) * 0.152, 18, { rx: -tilt, sh: false });
}
/** a loudspeaker (a monitor wedge lying, or a stack of n line-array boxes hung at y) */
export function speaker(b, x, y, z, f = 0, n = 1) { const p = part(b, x, z, f); for (let i = 0; i < n; i++) { p.box(0.7, 0.26, 0.4, b.m('#101114', 0.7), 0, y - i * 0.275, i * i * 0.012, { r: 0.012, rx: i * 0.07 }); p.box(0.62, 0.2, 0.006, b.surf('perf', '#1b1c20'), 0, y - i * 0.275 - i * 0.012, 0.203 + i * i * 0.012 + i * 0.005, { rx: i * 0.07, sh: false }); } }
/** a broadcast camera on its tripod, looking toward f; -> nothing */
export function tvCamera(b, x, z, f = 0, h = 1.55, y = 0) {
  const p = part(b, x, z, f), m = dark(b);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5; p.cyl(0.016, 0.012, h * 1.03, m, Math.sin(a) * 0.3, y + h / 2 - 0.04, Math.cos(a) * 0.3, 6, { rx: -Math.cos(a) * 0.36, rz: Math.sin(a) * 0.36 }); }
  p.cyl(0.05, 0.05, 0.08, m, 0, y + h - 0.04, 0, 12); p.box(0.2, 0.22, 0.46, b.m('#1b1d22', 0.5, 0.3), 0, y + h + 0.13, -0.03, { r: 0.015 }); p.cyl(0.065, 0.075, 0.24, m, 0, y + h + 0.13, 0.31, 16, { rx: PI / 2 }); p.cyl(0.062, 0.062, 0.01, b.m('#1a2a44', 0.05, 0.8), 0, y + h + 0.13, 0.434, 16, { rx: PI / 2 });
  p.box(0.13, 0.09, 0.03, m, 0.02, y + h + 0.31, -0.2, { r: 0.006 }); p.box(0.11, 0.07, 0.002, b.glow('#8fb0ff', 1.2), 0.02, y + h + 0.31, -0.2165, { sh: false }); p.tube([[-0.06, y + h, -0.1], [-0.3, y + h - 0.12, -0.42], [-0.34, y + h - 0.2, -0.5]], 0.009, m); p.box(0.02, 0.008, 0.008, b.glow('#ff2a2a', 2), 0, y + h + 0.25, 0.2, { sh: false });
  b.blob(x, z, 0.4, 0.4, 0.4, y + 0.004);
}
/** a lamp on a stand with a soft box (an interview's key light), looking toward f */
export function softbox(b, x, z, f = 0, h = 2.0, w = 0.9, col = '#fff0dc', I = 2.2) {
  const p = part(b, x, z, f), m = black(b);
  for (let i = 0; i < 3; i++) { const a = i * 2.094; p.cyl(0.011, 0.011, 0.6, m, Math.sin(a) * 0.24, 0.2, Math.cos(a) * 0.24, 6, { rx: -Math.cos(a) * 0.85, rz: Math.sin(a) * 0.85 }); } p.cyl(0.014, 0.014, h - 0.3, m, 0, (h - 0.3) / 2 + 0.3, 0, 8);
  p.box(w, w * 0.75, 0.04, m, 0, h, 0.12, { r: 0.01, rx: 0.15 }); p.box(w - 0.06, w * 0.75 - 0.06, 0.006, b.glow(col, I), 0, h - 0.004, 0.142, { rx: 0.15, sh: false }); p.lathe([[0.05, 0], [w * 0.36, 0.1]], m, 0, h, 0.06, 4, { rx: PI / 2 + 0.15, ry: PI / 4 });
  b.blob(x, z, 0.3, 0.3, 0.3);
}
/** a crowd barrier (a pedestrian one: a frame and its bars), from one point to another */
export function barrier(b, x0, z0, x1, z1, m = null) {
  const L = Math.hypot(x1 - x0, z1 - z0), f = Math.atan2(-(z1 - z0), x1 - x0), p = part(b, (x0 + x1) / 2, (z0 + z1) / 2, f), st = m || steel(b), n = Math.max(1, Math.round(L / 2.2)), w = L / n;
  for (let i = 0; i < n; i++) { const c = -L / 2 + w * (i + 0.5); p.tube([[c - w / 2 + 0.04, 0.02, 0], [c - w / 2 + 0.04, 1.02, 0], [c - w / 2 + 0.1, 1.08, 0], [c + w / 2 - 0.1, 1.08, 0], [c + w / 2 - 0.04, 1.02, 0], [c + w / 2 - 0.04, 0.02, 0]], 0.018, st, { seg: 30 }); p.cyl(0.014, 0.014, w - 0.1, st, c, 0.2, 0, 6, { rz: PI / 2 }); for (let j = 1; j < 12; j++) p.cyl(0.007, 0.007, 0.87, st, c - w / 2 + 0.04 + (w - 0.08) * j / 12, 0.64, 0, 6); for (const s of [-1, 1]) p.box(0.04, 0.012, 0.5, st, c + s * (w / 2 - 0.2), 0.008, 0); }
}
/** a rope between posts (a paddock's, a gallery's) along a line */
export function ropes(b, x0, z0, x1, z1, col = '#7a1420', n = 0) {
  const L = Math.hypot(x1 - x0, z1 - z0), k = n || Math.max(2, Math.round(L / 1.6) + 1), brass = b.m('#b08d57', 0.25, 0.9);
  for (let i = 0; i < k; i++) { const u = i / (k - 1), px = x0 + (x1 - x0) * u, pz = z0 + (z1 - z0) * u; b.lathe([[0, 0], [0.15, 0], [0.15, 0.015], [0.03, 0.04], [0.022, 0.06], [0.022, 0.92], [0.04, 0.95], [0.03, 1.0], [0, 1.01]], brass, px, 0, pz, 20); if (i) { const qx = x0 + (x1 - x0) * (i - 1) / (k - 1), qz = z0 + (z1 - z0) * (i - 1) / (k - 1); b.tube([[qx, 0.93, qz], [(qx + px) / 2, 0.76, (qz + pz) / 2], [px, 0.93, pz]], 0.016, b.surf('cloth', col), { seg: 14 }); } }
}
/** a parasol over a table: its pole, its ribs, its cloth in col */
export function parasol(b, x, z, col = '#1f8f6f', r = 1.35, h = 2.45) {
  const st = b.m('#d5d9de', 0.35, 0.7); b.cyl(0.022, 0.022, h, st, x, h / 2, z, 10); b.lathe([[0, 0], [0.22, 0], [0.22, 0.03], [0.05, 0.06], [0, 0.06]], dark(b), x, 0, z, 20);
  const cv = b.m(col, 0.85, 0, { side: 2 }); b.lathe([[r, 0], [r * 0.66, 0.2], [r * 0.33, 0.36], [0.03, 0.46], [0, 0.47]], cv, x, h - 0.42, z, 8, { ry: PI / 8 }); b.cyl(r * 0.995, r * 0.995, 0.11, cv, x, h - 0.47, z, 8, { open: true, ry: PI / 8, sh: false });
  for (let i = 0; i < 8; i++) { const a = i * PI / 4 + PI / 8; b.cyl(0.007, 0.007, r * 0.75, st, x + Math.sin(a) * r * 0.36, h - 0.36, z + Math.cos(a) * r * 0.36, 6, { rz: PI / 2 - 0.45, ry: a - PI / 2, sh: false }); }
  b.ball(0.03, st, x, h + 0.06, z, { seg: 10 });
}
/** a planter box with a hedge in it (a paddock's edge), from one point to another */
export function planter(b, x0, z0, x1, z1, col = '#2a2d33', leaf = '#2f5a35') {
  const L = Math.hypot(x1 - x0, z1 - z0), f = Math.atan2(-(z1 - z0), x1 - x0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, p = part(b, cx, cz, f);
  p.box(L, 0.5, 0.45, b.m(col, 0.6, 0.2), 0, 0.25, 0, { r: 0.012 }); const n = Math.round(L / 0.22);
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) p.ball(0.2 + b.rnd() * 0.08, b.m(j ? leaf : '#3c6f41', 0.9), -L / 2 + 0.15 + (L - 0.3) * (i + b.rnd() * 0.6) / n, 0.62 + b.rnd() * 0.22, (j - 0.5) * 0.16, { seg: 9, sc: [1, 0.9 + b.rnd() * 0.3, 1] });
  b.blob(cx, cz, L / 2 + 0.15, 0.4, 0.5, 0.004, f);
}
/** a flag on its pole (the cloth hanging, a fold in it) */
export function flag(b, x, z, col = '#e10600', h = 5.5, f = 0) {
  const p = part(b, x, z, f); p.cyl(0.03, 0.04, h, b.m('#d5d9de', 0.35, 0.7), 0, h / 2, 0, 10); p.ball(0.05, b.m('#d9b04a', 0.3, 0.9), 0, h + 0.03, 0, { seg: 10 });
  for (let i = 0; i < 6; i++) p.box(0.22, 1.25 - i * 0.03, 0.012, b.surf('canvas', col), 0.13 + i * 0.2, h - 0.72 - i * 0.045, Math.sin(i * 1.3) * 0.05, { rz: -0.12, r: 0.004 }, Math.cos(i * 1.3) * 0.25);
}
/** cables lying across a floor from a to b (n of them, wandering) */
export function cables(b, x0, z0, x1, z1, n = 3, col = '#101114') { for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 0.05, w = 0.2 + b.rnd() * 0.3; b.tube([[x0 + o, 0.012, z0], [x0 + (x1 - x0) * 0.33 + (b.rnd() - 0.5) * w, 0.012, z0 + (z1 - z0) * 0.33 + (b.rnd() - 0.5) * w], [x0 + (x1 - x0) * 0.66 + (b.rnd() - 0.5) * w, 0.012, z0 + (z1 - z0) * 0.66 + (b.rnd() - 0.5) * w], [x1 + o, 0.012, z1]], 0.011, b.m(i % 3 === 1 ? '#e0a100' : col, 0.7), { seg: 24, sh: false }); } }
