// Lace (world/People.js's): what a lace is made of and how it lies on her. Four laces, each painted once into a texture
// of its own and shared by everyone who wears it - a corded floral (an Alencon's: flowers and leaves in close-worked
// cloth on a fine hexagonal tulle, each outlined by a raised silk cord, openwork at their hearts, scrolling stems between
// them), a Chantilly (a finer, sheerer net, its sprays outlined by a flat cord round half-stitched petals, point d'esprit
// dots between them), a guipure (heavy motifs and no net at all, joined by corded bars) and an eyelet (a broderie
// anglaise: a cotton embroidered with eyelets in daisies, their rims raised). Each also has its edge - a scalloped border,
// worn at a hem, a cuff or a neckline. Their channels: R the relief (the cords standing proud), G how much of the light
// the lace stops there (the threads), B the cord itself (a silk cord's sheen). Mip-mapped, so far off each reads as its
// own average - a soft texture, never a shimmer.
// Where it lies on a lining (OF.lace.on: a lined dress's own cloth) it is drawn in that cloth's own shader (PPL_LACEON:
// the lace's colour carried by the vertices, the lining's the material's): no second layer standing off the dress, no
// halo at its edge, nothing of the lining through it, not a triangle more. Where it lies on the skin (sleeves, a yoke, a
// hem past the lining, a cover-up) it is its own sheer layer (PPL_LACE). Its place on her: each piece laid out as cloth
// is cut - round the body from the front, its pattern a little stretched where she is fuller, a seam down the back;
// round each limb on its own (never smeared round the body's axis), the tiles a whole number round it so its seam is
// unseen. Everything here is built once, as she is built: nothing per frame.
import * as THREE from 'three';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const ss3 = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
const rngOf = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

/**
 * The laces: W (the texture's side, pixels), tile (how much of her one repeat covers, m), edge (an edge's depth, m), seed,
 * h (its relief, m), r (its roughness over a lining: matt cotton, a silk's cord a little glossier)
 */
const KINDS = {
  corded: { W: 1024, tile: 0.15, edge: 0.0375, seed: 11, h: 0.00055, r: 0.8 },
  chantilly: { W: 1024, tile: 0.17, edge: 0.0425, seed: 23, h: 0.00035, r: 0.74 },
  guipure: { W: 1024, tile: 0.13, edge: 0.0325, seed: 37, h: 0.0007, r: 0.86 },
  eyelet: { W: 512, tile: 0.1, edge: 0.04, seed: 51, h: 0.0005, r: 0.88 },
};
/** the laces' names (OF.lace.kind) */
export const LACE_KINDS = Object.freeze(Object.keys(KINDS));
const kindOf = (k) => (KINDS[k] ? k : 'corded');

// ---- the patterns ------------------------------------------------------------------------------------------------------
// (painted channel by channel: 'lighten' raises a channel to at least its value and leaves the others - rgb(0, 255, 0)
// is thread, nothing else; 'darken' lowers them. In passes - the cloth of the motifs, then their openwork cut through it,
// then the net over all of it, the cords on top - so a net shows in a motif's holes and a cord crosses whatever is under it)
/** a canvas to paint a lace into (wrapY: a field's tile repeats both ways, an edge's only along it) */
function painter(W, H, wrapY) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.lineCap = 'round'; x.lineJoin = 'round';
  const pass = [[], [], [], [], []];
  // (each piece drawn wherever it reaches into the tile - again across each edge it crosses, so the tile repeats unseen)
  const at = (k, cx, cy, r, fn) => pass[k].push([cx, cy, r, fn]);
  const run = () => {
    for (const P of pass) for (const [cx, cy, r, fn] of P) {
      if (r === Infinity) { x.save(); fn(x); x.restore(); continue; }
      for (const dx of [-W, 0, W]) for (const dy of wrapY ? [-H, 0, H] : [0]) { const X = cx + dx, Y = cy + dy; if (X + r < 0 || X - r > W || Y + r < 0 || Y - r > H) continue; x.save(); x.translate(dx, dy); fn(x); x.restore(); }
    }
  };
  return { cv, x, at, run, W, H };
}
/** a channel's ink: raise (r, g, b) - or, cut, lower them */
const ink = (x, r, g, b) => { x.globalCompositeOperation = 'lighten'; x.fillStyle = x.strokeStyle = `rgb(${r | 0},${g | 0},${b | 0})`; };
const cut = (x, r, g, b) => { x.globalCompositeOperation = 'darken'; x.fillStyle = x.strokeStyle = `rgb(${r | 0},${g | 0},${b | 0})`; };
/** a cord along a path: raised and rounded - its crown the highest, a silk's sheen along it (B) */
const cordOn = (x, path, w, k = 1) => { ink(x, 150 * k, 255, 150 * k); x.lineWidth = w; x.stroke(path); ink(x, 255 * k, 255, 255 * k); x.lineWidth = Math.max(0.6, w * 0.45); x.stroke(path); };
/** a petal (or a leaf's half-width w), from its base at the origin out along +x to its tip; notched (a heart's) or pointed */
function petalPath(len, w, tip = 0) {
  const p = new Path2D(); p.moveTo(0, 0);
  if (tip > 0) { p.bezierCurveTo(len * 0.2, -w * 1.15, len * 0.8, -w * 1.05, len, -w * 0.3); p.quadraticCurveTo(len * 0.9, 0, len, w * 0.3); p.bezierCurveTo(len * 0.8, w * 1.05, len * 0.2, w * 1.15, 0, 0); }
  else if (tip < 0) { p.bezierCurveTo(len * 0.25, -w * 1.1, len * 0.7, -w * 0.8, len, 0); p.bezierCurveTo(len * 0.7, w * 0.8, len * 0.25, w * 1.1, 0, 0); }
  else { p.bezierCurveTo(len * 0.2, -w * 1.2, len * 0.95, -w * 1.1, len, 0); p.bezierCurveTo(len * 0.95, w * 1.1, len * 0.2, w * 1.2, 0, 0); }
  p.closePath(); return p;
}
/** a hexagonal tulle over the whole tile (s: a cell's side, px; lw: its thread; g: how much of the light a thread stops - a fine one, not all) - its period fitted to the tile, so it repeats unseen */
function tulle(P, s, lw, g = 175, h = 46) {
  const nx = Math.max(2, Math.round(P.W / (3 * s))), sx = P.W / (3 * nx), ny = Math.max(2, Math.round(P.H / (Math.sqrt(3) * sx))), hy = P.H / ny;
  P.at(2, 0, 0, Infinity, (x) => {
    ink(x, h, g, 0); x.lineWidth = lw; x.beginPath();
    for (let i = -1; i <= 2 * nx + 1; i++) for (let j = -1; j <= ny + 1; j++) {
      const cx = i * 1.5 * sx, cy = j * hy + (i & 1 ? hy / 2 : 0), v = (k) => [cx + sx * Math.cos(k * Math.PI / 3), cy - (hy / 2) * Math.sin(k * Math.PI / 3) / Math.sin(Math.PI / 3)];
      const [a, b, c, d] = [v(0), v(1), v(2), v(3)]; x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.lineTo(c[0], c[1]); x.lineTo(d[0], d[1]);
    }
    x.stroke();
  });
}
/**
 * The motifs a lace is made of, in the style st: { fill: [R, G] (its close-worked cloth), half (a Chantilly's half-stitch:
 * the cloth itself sheerer, finely striped), cw (the cord's width, px), open (openwork: the petals parted, holes round a
 * heart) }
 */
function motifs(P, R, st) {
  const fillA = (x) => ink(x, st.fill[0], st.fill[1], 0);
  // (a flower: five to eight petals, each its own length and turn, round a heart ringed by small holes; each petal
  // outlined by the cord, a vein down it)
  // (a corded lace's flowers each in its own work: most in close cloth stitch, some half-stitched - sheerer, finely
  // striped - as the lacemaker shaded them; a Chantilly's all half-stitched)
  const halfF = [st.fill[0] * 0.55, 150];
  const flower = (cx, cy, r) => {
    const k = 5 + Math.floor(R() * 4), rot = R() * 6.283, tip = R() < 0.4 ? 1 : R() < 0.5 ? -1 : 0, pt = [], half = st.half || R() < (st.halfP || 0);
    for (let i = 0; i < k; i++) { const a = rot + (i * 6.283) / k + (R() - 0.5) * 0.22, len = r * (0.8 + 0.25 * R()), w = r * (1.75 / k) * (0.85 + 0.25 * R()); pt.push([a, len, petalPath(len, w, tip)]); }
    const each = (x, fn) => { for (const [a, len, p] of pt) { x.save(); x.translate(cx, cy); x.rotate(a); x.translate(r * 0.14, 0); fn(p, len); x.restore(); } };
    P.at(0, cx, cy, r * 1.3, (x) => { if (half && !st.half) ink(x, halfF[0], halfF[1], 0); else fillA(x); each(x, (p) => x.fill(p)); if (half) { ink(x, 40, (st.half ? st.fill[1] : halfF[1]) + 70, 0); x.lineWidth = 1; each(x, (p, len) => { x.save(); x.clip(p); x.beginPath(); for (let t = -len; t < len * 2; t += 4) { x.moveTo(t, -len); x.lineTo(t + len, len); } x.stroke(); x.restore(); }); } });
    if (st.open) P.at(1, cx, cy, r * 1.3, (x) => {
      cut(x, 255, 70, 255); x.lineWidth = 1.2; each(x, (p, len) => { x.beginPath(); x.moveTo(len * 0.18, 0); x.lineTo(len * 0.72, 0); x.stroke(); });
      cut(x, 0, 0, 0); const hk = 7 + Math.floor(R() * 4); for (let i = 0; i < hk; i++) { const a = (i * 6.283) / hk; x.beginPath(); x.arc(cx + Math.cos(a) * r * 0.24, cy + Math.sin(a) * r * 0.24, Math.max(1.4, r * 0.045), 0, 6.283); x.fill(); }
    });
    P.at(3, cx, cy, r * 1.3, (x) => { each(x, (p) => cordOn(x, p, st.cw)); const c = new Path2D(); c.arc(cx, cy, r * 0.13, 0, 6.283); ink(x, 200, 255, 0); x.fill(c); cordOn(x, c, st.cw * 0.8); });
  };
  // (a rose: three rings of petals, each smaller and turned, each ring's cloth laid over the cords of the one beneath - only
  // their outer edges corded, as the cord follows each petal's own rim - the heart a spiral of cord)
  const rose = (cx, cy, r) => {
    const rings = [[6, 1, R() * 6.28], [5, 0.68, R() * 6.28], [4, 0.4, R() * 6.28]];
    const ring1 = (x, ring, fn) => { const [k, s, rot] = ring; for (let i = 0; i < k; i++) { const a = rot + (i * 6.283) / k, len = r * s * 0.9, w = r * s * (2.3 / k); x.save(); x.translate(cx, cy); x.rotate(a); x.translate(r * s * 0.08, 0); fn(petalPath(len, w, 1), s); x.restore(); } };
    const outerHalf = !st.half && R() < 0.55;
    P.at(3, cx, cy, r * 1.2, (x) => {
      for (const rg of rings) {
        const hs = st.half || (outerHalf && rg[1] > 0.9), fg = hs && !st.half ? halfF[1] : st.fill[1];
        x.globalCompositeOperation = 'source-over'; x.fillStyle = `rgb(${(st.fill[0] + 90 * (1 - rg[1])) | 0},${fg},0)`; ring1(x, rg, (p) => x.fill(p));
        if (hs) { ink(x, 40, fg + 70, 0); x.lineWidth = 1; ring1(x, rg, (p) => { x.save(); x.clip(p); x.beginPath(); for (let t = -r; t < r * 2; t += 4) { x.moveTo(t, -r); x.lineTo(t + r, r); } x.stroke(); x.restore(); }); }
        if (st.open && rg[1] > 0.9) { cut(x, 255, 90, 255); x.lineWidth = 1.1; ring1(x, rg, () => { x.beginPath(); x.moveTo(r * 0.3, -r * 0.08); x.quadraticCurveTo(r * 0.55, 0, r * 0.3, r * 0.08); x.stroke(); }); }
        ring1(x, rg, (p) => cordOn(x, p, st.cw * (0.75 + 0.25 * rg[1])));
      }
      const sp = new Path2D(); for (let t = 0; t < 14; t++) { const a = t * 0.75, q = r * 0.02 * t; t ? sp.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q) : sp.moveTo(cx, cy); } cordOn(x, sp, st.cw * 0.8);
    });
  };
  // (a spray of leaves fanned from one point - a fern's, a sprig's)
  const fan = (cx, cy, r) => { const a0 = R() * 6.283, k = 3 + Math.floor(R() * 3); for (let i = 0; i < k; i++) leaf(cx, cy, r * (0.75 + 0.35 * R()), a0 + (i - (k - 1) / 2) * 0.5, 0.33); };
  // (a leaf: close-worked, its midrib and side veins open lines, the cord round it)
  const leaf = (cx, cy, len, a, w = 0.36) => {
    const p = petalPath(len, len * w, -1), place = (x) => { x.translate(cx, cy); x.rotate(a); x.translate(-len * 0.1, 0); };
    P.at(0, cx, cy, len * 1.1, (x) => { x.save(); place(x); fillA(x); x.fill(p); if (st.half) { ink(x, 40, st.fill[1] + 70, 0); x.lineWidth = 1; x.clip(p); x.beginPath(); for (let t = -len; t < len * 2; t += 4) { x.moveTo(t, -len); x.lineTo(t - len * 0.6, len); } x.stroke(); } x.restore(); });
    if (st.open) P.at(1, cx, cy, len * 1.1, (x) => { x.save(); place(x); cut(x, 255, 60, 255); x.lineWidth = 1.1; x.beginPath(); for (let t = 0.25; t < 0.85; t += 0.16) { x.moveTo(len * t, 0); x.lineTo(len * (t + 0.12), -len * w * 0.55); x.moveTo(len * t, 0); x.lineTo(len * (t + 0.12), len * w * 0.55); } x.stroke(); x.restore(); });
    P.at(3, cx, cy, len * 1.1, (x) => { x.save(); place(x); cordOn(x, p, st.cw * 0.85); const m = new Path2D(); m.moveTo(len * 0.05, 0); m.lineTo(len * 0.8, 0); cordOn(x, m, st.cw * 0.45, 0.7); x.restore(); });
  };
  // (a stem: a scroll of cord from one flower toward the next, leaves along it, now and then a tendril curling off it)
  const stem = (ax, ay, bx, by, leaves = true) => {
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, b1 = (R() - 0.5) * 0.9 * L, b2 = (R() - 0.5) * 0.9 * L;
    const c1 = [ax + dx * 0.33 + nx * b1, ay + dy * 0.33 + ny * b1], c2 = [ax + dx * 0.66 + nx * b2, ay + dy * 0.66 + ny * b2];
    const bz = (t) => { const u = 1 - t; return [u * u * u * ax + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * bx, u * u * u * ay + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * by]; };
    const p = new Path2D(); p.moveTo(ax, ay); p.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], bx, by);
    const mx = (ax + bx) / 2, my = (ay + by) / 2, rr = L * 0.75;
    P.at(3, mx, my, rr, (x) => cordOn(x, p, st.cw * 1.1));
    if (!leaves) return;
    const nL = Math.max(1, Math.round(L / (st.leafGap || 46)));
    for (let i = 0; i < nL; i++) {
      const t = (i + 0.5 + (R() - 0.5) * 0.4) / nL, [qx, qy] = bz(t), [q2x, q2y] = bz(Math.min(1, t + 0.02)), ta = Math.atan2(q2y - qy, q2x - qx), side = i & 1 ? 1 : -1;
      if (R() < 0.82) leaf(qx, qy, (st.leafLen || 22) * (0.75 + 0.5 * R()), ta + side * (0.7 + 0.4 * R()));
      else { const tp = new Path2D(), tr = 5 + 4 * R(); tp.moveTo(qx, qy); for (let k = 1; k < 16; k++) { const a2 = ta + side * (0.9 + k * 0.45), q = tr * (1 - k / 18); tp.lineTo(qx + Math.cos(ta + side * 0.9) * tr * 1.4 + Math.cos(a2) * q, qy + Math.sin(ta + side * 0.9) * tr * 1.4 + Math.sin(a2) * q); } P.at(3, qx, qy, tr * 4, (x) => cordOn(x, tp, st.cw * 0.6)); }
    }
  };
  // (a spray: a few small leaves and a bud on a short stem; a picot dot)
  const sprig = (cx, cy, r) => { const a = R() * 6.283, ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r; stem(cx, cy, ex, ey, false); for (let i = 0; i < 3; i++) { const t = 0.3 + 0.3 * i; leaf(cx + (ex - cx) * t, cy + (ey - cy) * t, r * 0.45 * (1 - 0.2 * i), a + (i & 1 ? 0.9 : -0.9)); } flower(ex, ey, r * 0.32); };
  const dot = (cx, cy, r) => { P.at(3, cx, cy, r * 2, (x) => { const c = new Path2D(); c.arc(cx, cy, r, 0, 6.283); ink(x, 180, 255, 120); x.fill(c); }); };
  return { flower, rose, leaf, stem, sprig, dot, fan };
}
/** places scattered over the tile, none nearer another than their sizes allow (on the torus: across its edges too) -> [[x, y, r]] */
function scatter(P, R, n, r0, r1, keep = [], gap = 1) {
  const out = [], all = keep.slice(), d2 = (a, b) => { let dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]); dx = Math.min(dx, P.W - dx); dy = Math.min(dy, P.H - dy); return Math.hypot(dx, dy); };
  for (let t = 0; t < n * 60 && out.length < n; t++) { const c = [R() * P.W, R() * P.H, r0 + (r1 - r0) * R()]; if (all.every((q) => d2(c, q) > (c[2] + q[2]) * gap)) { out.push(c); all.push(c); } }
  return out;
}
/** the nearest copy of b to a on the torus */
const near = (P, a, b) => { let bx = b[0], by = b[1]; if (bx - a[0] > P.W / 2) bx -= P.W; else if (a[0] - bx > P.W / 2) bx += P.W; if (by - a[1] > P.H / 2) by -= P.H; else if (a[1] - by > P.H / 2) by += P.H; return [bx, by]; };

/** a lace's all-over field, painted -> canvas */
function paintField(kind) {
  const K = KINDS[kind], R = rngOf(K.seed), P = painter(K.W, K.W, true), W = K.W;
  if (kind === 'eyelet') {
    // (cotton, near opaque - a fine weave's slight unevenness in its relief - its eyelets cut through it, each rimmed by a
    // raised buttonhole stitch; daisies of oval eyelets round a round one, satin-stitched leaves, scattered small eyelets)
    P.at(0, 0, 0, Infinity, (x) => { ink(x, 64, 255, 0); x.fillRect(0, 0, W, W); ink(x, 74, 255, 0); x.lineWidth = 1; x.beginPath(); for (let t = 0; t < W; t += 3) { x.moveTo(t, 0); x.lineTo(t, W); } x.stroke(); });
    const D = scatter(P, R, 14, 25, 36, [], 1.05);
    for (const [cx, cy, r] of D) {
      const k = 6 + Math.floor(R() * 3), rot = R() * 6.283, holes = [[cx, cy, r * 0.2, r * 0.2, 0]];
      for (let i = 0; i < k; i++) { const a = rot + (i * 6.283) / k; holes.push([cx + Math.cos(a) * r * 0.58, cy + Math.sin(a) * r * 0.58, r * 0.27, r * 0.12, a]); }
      P.at(1, cx, cy, r * 1.1, (x) => { cut(x, 0, 0, 0); for (const [hx, hy, a1, b1, a] of holes) { x.beginPath(); x.ellipse(hx, hy, a1, b1, a, 0, 6.283); x.fill(); } });
      P.at(3, cx, cy, r * 1.1, (x) => { for (const [hx, hy, a1, b1, a] of holes) { const p = new Path2D(); p.ellipse(hx, hy, a1 + 1.4, b1 + 1.4, a, 0, 6.283); cordOn(x, p, 2.6); } });
      // (two leaves off each, satin-stitched: raised, their stitches slanting across them)
      for (let i = 0; i < 2; i++) {
        const a = rot + 0.5 + i * 3.1 + (R() - 0.5) * 0.6, lx = cx + Math.cos(a) * r * 1.05, ly = cy + Math.sin(a) * r * 1.05, lp = petalPath(r * 0.6, r * 0.2, -1);
        P.at(3, lx, ly, r, (x) => { x.save(); x.translate(lx, ly); x.rotate(a); ink(x, 190, 255, 90); x.fill(lp); ink(x, 235, 255, 140); x.lineWidth = 0.9; x.save(); x.clip(lp); x.beginPath(); for (let t = -r; t < r; t += 2.2) { x.moveTo(t, -r); x.lineTo(t + r * 0.5, r); } x.stroke(); x.restore(); x.restore(); });
      }
    }
    for (const [cx, cy, r] of scatter(P, R, 56, 5, 9, D.map(([a, b, c]) => [a, b, c * 1.2]), 1.2)) {
      P.at(1, cx, cy, r * 2, (x) => { cut(x, 0, 0, 0); x.beginPath(); x.arc(cx, cy, r * 0.55, 0, 6.283); x.fill(); });
      P.at(3, cx, cy, r * 2, (x) => { const p = new Path2D(); p.arc(cx, cy, r * 0.55 + 1.3, 0, 6.283); cordOn(x, p, 2.2); });
    }
    P.run(); return P.cv;
  }
  if (kind === 'guipure') {
    // (no net: heavy close-worked motifs - flowers, leaves, rounds of petals - joined by corded bars (brides), each bar
    // with a picot at its middle now and then; the bars between them make the open ground)
    const st = { fill: [140, 246], cw: 5, open: true, leafLen: 34, leafGap: 60 }, M = motifs(P, R, st);
    const B = scatter(P, R, 14, 64, 94, [], 0.94), S = scatter(P, R, 36, 22, 40, B, 0.94);
    for (const [cx, cy, r] of B) (R() < 0.5 ? M.rose : M.flower)(cx, cy, r);
    for (const [cx, cy, r] of S) R() < 0.55 ? M.flower(cx, cy, r) : M.leaf(cx, cy, r * 1.6, R() * 6.28, 0.42);
    const all = B.concat(S);
    for (const a of all) {
      const nb = all.filter((b) => b !== a).map((b) => { const [bx, by] = near(P, a, b); return [Math.hypot(bx - a[0], by - a[1]) - a[2] - b[2], bx, by, b[2]]; }).sort((u, v) => u[0] - v[0]).slice(0, 3);
      for (const [gap, bx, by, rb] of nb) {
        if (gap > 120) continue;
        const L = Math.hypot(bx - a[0], by - a[1]) || 1, ux = (bx - a[0]) / L, uy = (by - a[1]) / L, sx = a[0] + ux * a[2] * 0.85, sy = a[1] + uy * a[2] * 0.85, ex = bx - ux * rb * 0.85, ey = by - uy * rb * 0.85, w = (R() - 0.5) * 18;
        const p = new Path2D(); p.moveTo(sx, sy); p.quadraticCurveTo((sx + ex) / 2 - uy * w, (sy + ey) / 2 + ux * w, ex, ey);
        P.at(3, (sx + ex) / 2, (sy + ey) / 2, L, (x) => { cordOn(x, p, 8, 0.75); });
        if (R() < 0.5) M.dot((sx + ex) / 2 - uy * w * 0.5, (sy + ey) / 2 + ux * w * 0.5, 4);
      }
    }
    P.run(); return P.cv;
  }
  // (a corded floral on tulle; a Chantilly: finer, sheerer, its cord flat, its petals half-stitched - and between the
  // sprays, point d'esprit dots on the net)
  const ch = kind === 'chantilly', st = ch ? { fill: [60, 120], half: true, cw: 1.7, open: false, leafLen: 22, leafGap: 30 } : { fill: [110, 232], cw: 3.6, open: true, leafLen: 30, leafGap: 34, halfP: 0.35 };
  const M = motifs(P, R, st);
  // (the tulle fine and clear - a fifth of the light stopped by it, the lining's own colour through it)
  ch ? tulle(P, 4.2, 0.65) : tulle(P, 4.6, 0.8);
  // (close-set, as a real one is - about half of it worked, the net between: large flowers and roses, smaller ones and
  // leaf sprays between them, stems scrolling from each to its nearest, leaves along every stem)
  const B = scatter(P, R, ch ? 7 : 9, ch ? 80 : 74, ch ? 125 : 112, [], 1.08), Mid = scatter(P, R, ch ? 14 : 18, 26, 46, B, 1.02);
  for (const [cx, cy, r] of B) (R() < (ch ? 0.35 : 0.5) ? M.rose : M.flower)(cx, cy, r);
  // (each flower's stem scrolling off to one or two of its nearest - never a grid: their own bends, their own leaves)
  const all = B.concat(Mid);
  for (const a of B) {
    const nb = all.filter((b) => b !== a).map((b) => { const [bx, by] = near(P, a, b); return [Math.hypot(bx - a[0], by - a[1]), bx, by, b[2]]; }).sort((u, v) => u[0] - v[0]);
    for (const [, bx, by, rb] of nb.slice(0, R() < 0.4 ? 1 : 2)) { const L = Math.hypot(bx - a[0], by - a[1]) || 1, ux = (bx - a[0]) / L, uy = (by - a[1]) / L; M.stem(a[0] + ux * a[2] * 0.8, a[1] + uy * a[2] * 0.8, bx - ux * rb * 0.8, by - uy * rb * 0.8); }
  }
  for (const [cx, cy, r] of Mid) { const u = R(); if (u < 0.36) M.flower(cx, cy, r); else if (u < 0.62) M.sprig(cx, cy, r * 1.25); else M.fan(cx, cy, r * 1.3); }
  // (the smaller ones on stems of their own, to their nearest)
  for (const a of Mid) { const [d, bx, by, rb] = all.filter((b) => b !== a).map((b) => { const [bx, by] = near(P, a, b); return [Math.hypot(bx - a[0], by - a[1]), bx, by, b[2]]; }).sort((u, v) => u[0] - v[0])[0]; if (d < 260) { const ux = (bx - a[0]) / d, uy = (by - a[1]) / d; M.stem(a[0] + ux * a[2] * 0.8, a[1] + uy * a[2] * 0.8, bx - ux * rb * 0.8, by - uy * rb * 0.8); } }
  // (and leaf sprays and buds wherever the net is still bare)
  for (const [cx, cy, r] of scatter(P, R, ch ? 12 : 16, 16, 26, all, 1.0)) R() < 0.6 ? M.fan(cx, cy, r * 1.2) : M.flower(cx, cy, r * 0.8);
  for (const [cx, cy, r] of scatter(P, R, ch ? 60 : 18, ch ? 2.2 : 3, ch ? 3 : 4.5, all.map(([a, b, c]) => [a, b, c * 1.15]), 2)) M.dot(cx, cy, r);
  P.run(); return P.cv;
}
/** a lace's scalloped edge, painted: its top (v 0) the lace carried on from above, its scallops at the foot (v 1) -> canvas */
function paintEdge(kind) {
  const K = KINDS[kind], R = rngOf(K.seed + 5), W = K.W, H = W / 4, P = painter(W, H, false);
  const nS = kind === 'eyelet' ? 6 : 5, ws = W / nS, yE = (u) => H * (0.6 + 0.3 * Math.pow(Math.sin(Math.PI * u), 0.75));
  // (the scallops' line: an arch from cusp to cusp, its lowest at its middle)
  const edgeP = new Path2D(); edgeP.moveTo(0, yE(0)); for (let i = 1; i <= W; i += 2) { const u = (i % ws) / ws; edgeP.lineTo(i, yE(u)); }
  const below = new Path2D(); below.moveTo(-2, yE(0)); for (let i = 0; i <= W + 2; i += 2) below.lineTo(i, yE((i % ws) / ws)); below.lineTo(W + 2, H + 2); below.lineTo(-2, H + 2); below.closePath();
  if (kind === 'eyelet') {
    P.at(0, 0, 0, Infinity, (x) => { ink(x, 64, 255, 0); x.fillRect(0, 0, W, H); });
    for (let s = 0; s < nS; s++) {
      const cx = (s + 0.5) * ws, cy = H * 0.55, r = ws * 0.2;
      P.at(1, cx, cy, ws, (x) => { cut(x, 0, 0, 0); x.beginPath(); x.arc(cx, cy, r * 0.42, 0, 6.283); x.fill(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.62; x.beginPath(); x.ellipse(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05, r * 0.34, r * 0.15, a, 0, 6.283); x.fill(); } });
      P.at(3, cx, cy, ws, (x) => { const p = new Path2D(); p.arc(cx, cy, r * 0.42 + 1.3, 0, 6.283); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.62; p.moveTo(cx + Math.cos(a) * r * 1.05 + r * 0.36, cy + Math.sin(a) * r * 1.05); p.ellipse(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05, r * 0.34 + 1.3, r * 0.15 + 1.3, a, 0, 6.283); } cordOn(x, p, 2.4); });
    }
    // (the scallops' satin-stitched edge: a broad raised band along them, nothing past it)
    P.at(4, 0, 0, Infinity, (x) => { const clr = () => { x.save(); x.translate(0, 4); cut(x, 0, 0, 0); x.fill(below); x.restore(); }; clr(); ink(x, 235, 255, 200); x.lineWidth = 9; x.stroke(edgeP); clr(); ink(x, 255, 255, 255); x.lineWidth = 3; x.stroke(edgeP); });
    P.run(); return P.cv;
  }
  const gu = kind === 'guipure', ch = kind === 'chantilly', st = gu ? { fill: [140, 246], cw: 4.2, open: true, leafLen: 22, leafGap: 40 } : ch ? { fill: [60, 120], half: true, cw: 1.7, leafLen: 15, leafGap: 26 } : { fill: [110, 232], cw: 3.6, open: true, leafLen: 18, leafGap: 32 };
  const M = motifs(P, R, st);
  if (!gu) ch ? tulle(P, 4.2, 0.65) : tulle(P, 4.6, 0.8);
  // (in each scallop a flower and its leaves fanned toward the edge; above them a stem running along it, leaves and buds on it)
  for (let s = 0; s < nS; s++) {
    const cx = (s + 0.5) * ws, cy = H * 0.6;
    M.flower(cx, cy, ws * 0.2);
    M.leaf(cx - ws * 0.26, cy + H * 0.05, ws * 0.22, Math.PI * 0.85 + (R() - 0.5) * 0.3); M.leaf(cx + ws * 0.26, cy + H * 0.05, ws * 0.22, Math.PI * 0.15 + (R() - 0.5) * 0.3);
    if (gu) { const p = new Path2D(); p.moveTo(cx - ws * 0.5, H * 0.3); p.lineTo(cx, cy - ws * 0.2); p.moveTo(cx + ws * 0.5, H * 0.3); p.lineTo(cx, cy - ws * 0.2); P.at(3, cx, cy, ws, (x) => cordOn(x, p, 4.2, 0.75)); M.flower(cx + ws * 0.5, H * 0.24, ws * 0.13); }
  }
  for (let s = 0; s < nS * 2; s++) { const x0 = s * ws / 2, x1 = x0 + ws / 2, y0 = H * (0.22 + 0.06 * Math.sin(s * 1.7)), y1 = H * (0.22 + 0.06 * Math.sin((s + 1) * 1.7)); if (!gu) M.stem(x0, y0, x1, y1); }
  if (!gu) for (let s = 0; s < nS; s++) M.flower(s * ws + ws * 0.5 * R(), H * 0.12 + R() * H * 0.08, ws * 0.09);
  // (the edge itself: nothing past it - then its cord along the scallops, its picots (a Chantilly's fine eyelash threads
  // hanging from it))
  P.at(4, 0, 0, Infinity, (x) => {
    cut(x, 0, 0, 0); x.fill(below);
    cordOn(x, edgeP, gu ? 5 : ch ? 2.4 : 4.4);
    if (ch) { ink(x, 120, 255, 60); x.lineWidth = 0.8; x.beginPath(); for (let i = 0; i < W; i += 4.5) { const y = yE((i % ws) / ws) + 1, l = 5 + 9 * R(); x.moveTo(i, y); x.lineTo(i + (R() - 0.5) * 3, y + l); } x.stroke(); }
    else { ink(x, 180, 255, 120); for (let i = ws * 0.1; i < W; i += ws / 7) { const y = yE((i % ws) / ws) + (gu ? 5 : 4); x.beginPath(); x.arc(i, y, gu ? 3.2 : 2.4, 0, 6.283); x.fill(); } }
  });
  P.run(); return P.cv;
}
const TEX = {}, EDGE = {};
// (an edge read as painted: v 0 its top row - where it is attached - v 1 its scallops)
const texOf = (cv, wrapV) => { const t = new THREE.CanvasTexture(cv); t.wrapS = THREE.RepeatWrapping; t.wrapT = wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping; if (!wrapV) t.flipY = false; t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; return t; };
/** a lace's field, painted the first time it is worn and shared ever after (kind: LACE_KINDS) -> texture */
export function laceTex(kind) { const k = kindOf(kind); return TEX[k] || (TEX[k] = texOf(paintField(k), true)); }
/** its scalloped edge, the same way -> texture */
export function laceEdgeTex(kind) { const k = kindOf(kind); return EDGE[k] || (EDGE[k] = texOf(paintEdge(k), false)); }

// ---- how it answers the light ----------------------------------------------------------------------------------------
// (PPL_LACE: a sheer lace of its own - its threads from the pattern (three.js's own alphaMap: G), its cords standing
// proud (R: the relief, in metres - PPL_LACEH - tilting the normal by its slope across the pixel), a silk cord a little
// glossier than the cloth round it (B). PPL_LACEON: the same lace laid on a lining - the lining's own colour (the
// material's) under it, the lace's (pplLace, per vertex) wherever it covers, the lining a shade darker under its net; the
// lace's roughness (PPL_LACER) and relief where it covers, the lining's sheen and its satin's streaks only between. Both
// fade their relief out as a texel grows smaller than a pixel (PPL_LACEW: the texture's side) - far off a soft cloth,
// never a sparkle)
const SC = THREE.ShaderChunk;
if (!SC.color_pars_vertex.includes('PPL_LACEON')) SC.color_pars_vertex += `
#ifdef PPL_LACEON
attribute vec3 pplLace;
varying vec3 vPplLace;
#endif
`;
if (!SC.color_vertex.includes('PPL_LACEON')) SC.color_vertex += `
#ifdef PPL_LACEON
vPplLace = pplLace;
#endif
`;
if (!SC.color_pars_fragment.includes('PPL_LACEON')) SC.color_pars_fragment += `
#ifdef PPL_LACEON
varying vec3 vPplLace;
#endif
`;
if (!SC.alphamap_fragment.includes('PPL_LACE')) SC.alphamap_fragment += `
#if defined( USE_ALPHAMAP ) && ( defined( PPL_LACE ) || defined( PPL_LACEON ) )
vec4 pplLaceT = texture2D( alphaMap, vAlphaMapUv );
vec2 pplLaceFw = fwidth( vAlphaMapUv ) * PPL_LACEW;
float pplLaceFar = smoothstep( 1.2, 4.0, max( pplLaceFw.x, pplLaceFw.y ) ), pplLaceCov = pplLaceT.g, pplLaceCord = pplLaceT.b * ( 1.0 - pplLaceFar );
#ifdef PPL_LACEON
{
	vec3 pplShade = vec3( 1.0 );
	#if defined( USE_COLOR ) && !defined( USE_COLOR_ALPHA )
	pplShade = vColor;
	#endif
	diffuseColor.rgb = mix( diffuseColor.rgb * ( 1.0 - 0.14 * pplLaceCov ), ( vPplLace * ( 0.94 + 0.12 * pplLaceCord ) + 0.035 * pplLaceCord ) * pplShade, pplLaceCov );
}
#else
diffuseColor.rgb = diffuseColor.rgb * ( 0.93 + 0.14 * pplLaceCord ) + 0.035 * pplLaceCord;
#endif
#endif
`;
if (!SC.roughnessmap_fragment.includes('PPL_LACE')) SC.roughnessmap_fragment += `
#if defined( USE_ALPHAMAP ) && defined( PPL_LACEON )
roughnessFactor = mix( roughnessFactor, PPL_LACER - 0.24 * pplLaceCord, pplLaceCov );
#elif defined( USE_ALPHAMAP ) && defined( PPL_LACE )
roughnessFactor = max( 0.3, roughnessFactor - 0.26 * pplLaceCord );
#endif
`;
if (!SC.normal_fragment_maps.includes('PPL_LACE')) SC.normal_fragment_maps += `
#if defined( USE_ALPHAMAP ) && ( defined( PPL_LACE ) || defined( PPL_LACEON ) )
{
	float pplK = PPL_LACEH * ( 1.0 - pplLaceFar );
	if ( pplK > 0.0 ) {
		vec2 pplDx = dFdx( vAlphaMapUv ), pplDy = dFdy( vAlphaMapUv );
		float pplHx = texture2D( alphaMap, vAlphaMapUv + pplDx ).r - pplLaceT.r, pplHy = texture2D( alphaMap, vAlphaMapUv + pplDy ).r - pplLaceT.r;
		vec3 pplSx = dFdx( - vViewPosition ), pplSy = dFdy( - vViewPosition ), pplR1 = cross( pplSy, normal ), pplR2 = cross( normal, pplSx );
		float pplDet = dot( pplSx, pplR1 ) * faceDirection;
		if ( abs( pplDet ) > 1e-14 ) normal = normalize( abs( pplDet ) * normal - sign( pplDet ) * pplK * ( pplHx * pplR1 + pplHy * pplR2 ) );
	}
}
#endif
`;
// (a lining's own gloss under the lace laid on it: its threads matt, so the satin's sheen - the room's in it and the
// lamps' - only half seen through them; never a bright oval of bare satin printed over the lace)
if (!SC.lights_fragment_end.includes('PPL_LACEON')) SC.lights_fragment_end += `
#if defined( PPL_LACEON ) && defined( USE_ALPHAMAP )
reflectedLight.indirectSpecular *= 1.0 - 0.55 * pplLaceCov;
reflectedLight.directSpecular *= 1.0 - 0.45 * pplLaceCov;
#endif
`;
const defs = (m, k) => { const K = KINDS[k]; m.defines = { ...(m.defines || {}), PPL_LACEW: K.W.toFixed(1), PPL_LACEH: K.h.toFixed(5) }; return m; };
/** a sheer layer made a lace (kind): its threads, its cords, a little denser seen edge on - never a solid rim -> m */
export function laceSheer(m, kind) { const k = kindOf(kind); defs(m, k); m.alphaMap = laceTex(k); m.defines.PPL_LACE = ''; m.defines.PPL_SHEER = '0.3'; delete m.defines.PPL_NET; m.needsUpdate = true; return m; }
/** an edge's (a scalloped hem, a trim): the same, from the edge's own pattern, seen from either side -> m */
export function laceEdgeMat(m, kind) { const k = kindOf(kind); defs(m, k); m.alphaMap = laceEdgeTex(k); m.defines.PPL_LACE = ''; m.defines.PPL_SHEER = '0.3'; m.side = THREE.DoubleSide; m.needsUpdate = true; return m; }
/** a lining with the lace laid on it (its pieces carry the lace's colour: lacePiece) -> m */
export function laceOn(m, kind) { const k = kindOf(kind); defs(m, k); m.alphaMap = laceTex(k); m.defines.PPL_LACEON = ''; m.defines.PPL_LACER = KINDS[k].r.toFixed(2); m.needsUpdate = true; return m; }

// ---- its colours -------------------------------------------------------------------------------------------------------
/**
 * The lining under a lace (lace, lining: colours; near(c): whether c is near her skin's tone; tone: the kit's own wish -
 * the lace's own shade): never her skin's tone, and never so near the lace's own colour that the lace vanishes on it -
 * then a deeper shade of the lace (red over wine, emerald over forest, navy over midnight), a dark one a little lifted
 * (black over charcoal), a pale one over a deeper tone of itself (ivory over a warm taupe) or, near her skin, over black;
 * an eyelet's cotton over the same cotton a tone deeper, its eyelets read by their shadow -> colour
 */
export function liningOf(lace, lining, near0, kind, tone = false, skin = null) {
  const d = (a, b) => { const p = a.clone().convertLinearToSRGB(), q = b.clone().convertLinearToSRGB(); return Math.hypot(p.r - q.r, p.g - q.g, p.b - q.b); };
  // (near her skin's tone: People's test, and - her skin given - its hue, its depth and how strong it is all close to
  // hers: a charcoal, a wine or a forest green beside deep skin is cloth, never mistaken for it)
  const hsl = (c) => { const h = {}; c.clone().convertLinearToSRGB().getHSL(h); return h; }, sk = skin && hsl(skin);
  const near = (c) => { if (!near0(c)) return false; if (!sk) return true; const h = hsl(c), dh = Math.abs(((h.h - sk.h + 1.5) % 1) - 0.5); return h.s > 0.1 && dh < 0.06 && Math.abs(h.s - sk.s) < 0.35 && Math.abs(h.l - sk.l) < 0.14; };
  // (the lace's own shade: black over charcoal, a pale one over a deeper tone of itself, any other over its own depths)
  const toneOf = () => {
    const h = hsl(lace), s = new THREE.Color();
    if (kind === 'eyelet') return s.copy(lace).multiplyScalar(0.24);
    if (h.l < 0.12) return s.setHSL(h.h, h.s * 0.5, h.l + 0.2).convertSRGBToLinear();
    if (h.l > 0.62) return s.setHSL(h.h, Math.min(1, h.s * 1.1 + 0.05), h.l * 0.5).convertSRGBToLinear();
    return s.setHSL(h.h, Math.min(1, h.s * 1.1), h.l * 0.42).convertSRGBToLinear();
  };
  let c = tone || d(lace, lining) < 0.16 ? toneOf() : lining.clone();
  // (near her skin: the lace's own shade in its place - or, that too near, black; a black lace then over charcoal)
  if (near(c)) { const t = toneOf(); c = !near(t) && d(t, lace) >= 0.1 ? t : new THREE.Color('#141414'); }
  if (d(c, lace) < 0.1) c = toneOf();
  return c;
}

// ---- its place on her ------------------------------------------------------------------------------------------------
/** a loft's grid (world/People.js's loft: its uv j/M round, k/(K-1) along) -> { M, K } or null */
function loftGrid(g) {
  const uv = g.attributes.uv; if (!uv || !g.index) return null;
  let M = 0; while (M < uv.count && uv.getY(M) === 0) M++;
  if (M < 3 || uv.count % M || Math.abs(uv.getX(1) - 1 / M) > 1e-4) return null;
  return { M, K: uv.count / M };
}
/** g without its index - each triangle its own three vertices - its uv (U) carried over; a triangle across a seam (its
 *  u spanning more than half a period, per) given the far side's u (its own period: per(i)) -> a new geometry */
function unweld(g, U, per) {
  const ix = g.index ? g.index.array : null, n = ix ? ix.length : g.attributes.position.count, h = new THREE.BufferGeometry();
  for (const [k, a] of Object.entries(g.attributes)) { if (k === 'uv') continue; const s = a.itemSize, src = a.array, out = new Float32Array(n * s); for (let t = 0; t < n; t++) { const i = ix ? ix[t] : t; for (let c = 0; c < s; c++) out[t * s + c] = src[i * s + c]; } h.setAttribute(k, new THREE.BufferAttribute(out, s, a.normalized)); }
  const uv = new Float32Array(n * 2);
  for (let t = 0; t < n; t += 3) {
    const I = [0, 1, 2].map((q) => (ix ? ix[t + q] : t + q)), u = I.map((i) => U[i * 2]);
    const lo = Math.min(...u), hi = Math.max(...u), wrap = per && hi - lo > 0.5 * per(I[0]);
    for (let q = 0; q < 3; q++) { const i = I[q]; uv[(t + q) * 2] = wrap && u[q] < (lo + hi) / 2 ? u[q] + per(i) : u[q]; uv[(t + q) * 2 + 1] = U[i * 2 + 1]; }
  }
  h.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return h;
}
/**
 * A piece of her clothes laid out for its lace (T: her torso - A, q, H, sec; kind; col: the lace's colour when it lies on
 * this piece's lining) - round a limb (a loft whose rings are a limb's: a sleeve, a thigh sitting) on its own, the tiles
 * a whole number round it; round her body (its other lofts) from the front - a seam down the back, the pattern a little
 * wider where she is fuller; anything else from whichever side it faces -> a new geometry (non-indexed: uv - in tiles - and
 * pplLace given)
 */
export function lacePiece(g, T, kind, col = null) {
  const tile = KINDS[kindOf(kind)].tile, P = g.attributes.position, n = P.count, U = new Float32Array(n * 2), grid = loftGrid(g), q = V(), c = V();
  let mode = 'box', per = null;
  if (grid) {
    const { M, K } = grid; let mR = 0;
    for (let k = 0; k < K; k++) { c.set(0, 0, 0); for (let j = 0; j < M; j++) c.add(q.fromBufferAttribute(P, k * M + j)); c.multiplyScalar(1 / M); for (let j = 0; j < M; j++) mR = Math.max(mR, q.fromBufferAttribute(P, k * M + j).distanceTo(c)); }
    // (a skirt - a loft round her below the waist - laid out round its own rings too, as a skirt is cut: never smeared
    // where its cloth folds in at a slit; its seam at the back, its pattern whole across it)
    let yMax = -9; for (let i = 0; i < n; i++) yMax = Math.max(yMax, P.getY(i));
    const yW = q.set(0, T.H * 0.32 - 0.11, 0).applyQuaternion(T.q).add(T.A).y;
    mode = mR < 0.1 ? 'limb' : yMax < yW ? 'arc' : 'body';
    if (mode === 'limb' || mode === 'arc') {
      const C = new Float32Array(K), S = new Float32Array(n), a = V(), b = V(); let cs = 0, cn = 0;
      for (let k = 0; k < K; k++) { let s = 0; for (let j = 0; j < M; j++) { S[k * M + j] = s; s += a.fromBufferAttribute(P, k * M + j).distanceTo(b.fromBufferAttribute(P, k * M + ((j + 1) % M))); } C[k] = s; if (s > 0.03) { cs += s; cn++; } }
      const nT = Math.max(1, Math.round((cn ? cs / cn : 0.2) / tile));
      for (let j = 0; j < M; j++) { let v = 0; for (let k = 0; k < K; k++) { const i = k * M + j; if (k) v += a.fromBufferAttribute(P, i).distanceTo(b.fromBufferAttribute(P, i - M)); U[i * 2] = C[k] > 1e-4 ? (S[i] / C[k]) * nT : (j / M) * nT; U[i * 2 + 1] = v / tile; } }
      per = () => nT;
    }
  }
  if (mode === 'body') {
    // (in her torso's own frame: its height, and the angle round from the front - between the plain angle and the one
    // round her section's own ellipse, so the pattern keeps much the same width across her front as round her side)
    const qi = T.q.clone().invert(), f0 = T.sec(0.28), Rr = 0.5 * (f0[0] + f0[1]), PR = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      q.fromBufferAttribute(P, i).sub(T.A).applyQuaternion(qi);
      const f = Math.max(-0.08, Math.min(1, (q.y + 0.11) / T.H)), s = T.sec(f), x = q.x - s[2], z = q.z, th = 0.5 * (Math.atan2(z, x) + Math.atan2(z / s[0], x / s[1])), Re = Math.sqrt(Rr * 0.5 * (s[0] + s[1]));
      U[i * 2] = (th * Re) / tile; U[i * 2 + 1] = q.y / tile; PR[i] = (2 * Math.PI * Re) / tile;
    }
    per = (i) => PR[i];
  }
  if (mode === 'box') {
    // (whichever way each triangle faces: its two other axes)
    const h = unweld(g, U, null), Q = h.attributes.position, UV = h.attributes.uv, a = V(), b = V(), e = V();
    for (let t = 0; t < Q.count; t += 3) {
      a.fromBufferAttribute(Q, t); b.fromBufferAttribute(Q, t + 1); e.fromBufferAttribute(Q, t + 2); const nn = b.clone().sub(a).cross(e.clone().sub(a)), ax = Math.abs(nn.x), ay = Math.abs(nn.y), az = Math.abs(nn.z);
      for (let k = 0; k < 3; k++) { q.fromBufferAttribute(Q, t + k); const [u, v] = ax >= ay && ax >= az ? [q.z, q.y] : ay >= az ? [q.x, q.z] : [q.x, q.y]; UV.setXY(t + k, u / tile, v / tile); }
    }
    return withCol(h, col);
  }
  return withCol(unweld(g, U, per), col);
}
const withCol = (h, col) => { if (!col) return h; const n = h.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; } h.setAttribute('pplLace', new THREE.BufferAttribute(a, 3)); return h; };

/**
 * A lined lace dress's skirt where it comes out from under its bodice (g: its loft - People's skirt(), its top k rings
 * tucked up under the bodice): lit as the cloth just below them - one cloth over the waist, no bright ridge where it
 * rises out from under the bodice -> g
 */
export function laceWaist(g, k = 3) {
  const grid = loftGrid(g); if (!grid || grid.K <= k + 1) return g;
  const { M } = grid, N = g.attributes.normal;
  for (let r = 0; r < k; r++) for (let j = 0; j < M; j++) N.setXYZ(r * M + j, N.getX(k * M + j), N.getY(k * M + j), N.getZ(k * M + j));
  N.needsUpdate = true; return g;
}
/** rings of points (each a closed loop of M) into a strip, open at both ends, its uv round (u: arc share x nU) and down (v) - the seam's column twice, so the tiles meet whole -> geometry */
function stripOf(R, vOf, nU) {
  const K = R.length, M = R[0].length, pos = [], uv = [], idx = [];
  for (let k = 0; k < K; k++) {
    let C = 0; const S = [0]; for (let j = 0; j < M; j++) { C += R[k][j].distanceTo(R[k][(j + 1) % M]); S.push(C); }
    for (let j = 0; j <= M; j++) { const p = R[k][j % M]; pos.push(p.x, p.y, p.z); uv.push((S[j] / (C || 1)) * nU, vOf(k, j % M)); }
  }
  for (let k = 0; k < K - 1; k++) for (let j = 0; j < M; j++) { const a = k * (M + 1) + j, b = a + 1, c2 = a + M + 2, d = a + M + 1; idx.push(a, b, c2, a, c2, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  g.userData.laced = 1;   // (laid out already: People keeps its uv as it is)
  return g;
}
/**
 * A scalloped lace hem below a skirt (g: its loft, hem ring 4th from its end - People's skirt()), kind; o: { field (a band
 * of the lace itself above the edge, m - a slip's deep lace hem) }: hanging on down from the hem the way the skirt falls,
 * a hair over its turned edge -> { field (a geometry, or null), edge } (nothing when the hem is at the floor)
 */
export function laceHem(g, kind, o = {}) {
  const grid = loftGrid(g); if (!grid || grid.K < 6) return null;
  const K0 = KINDS[kindOf(kind)], { M, K } = grid, P = g.attributes.position, kh = K - 4, at = (k, j) => V().fromBufferAttribute(P, k * M + j);
  const H = [], D = [], c = V();
  for (let j = 0; j < M; j++) { const h = at(kh, j), p = at(kh - 1, j); D.push(h.clone().sub(p).normalize()); H.push(h); c.add(h); }
  c.multiplyScalar(1 / M);
  const fw = o.field || 0, w = fw + K0.edge; if (Math.min(...H.map((h) => h.y)) - w < 0.02) return null;
  const O = H.map((h) => h.clone().sub(c).setY(0).normalize());
  const ring = (d, k = 0.0012) => H.map((h, j) => h.clone().addScaledVector(O[j], k).addScaledVector(D[j], d));
  let C = 0; for (let j = 0; j < M; j++) C += H[j].distanceTo(H[(j + 1) % M]);
  const nU = Math.max(1, Math.round(C / K0.tile));
  const out = { field: null, edge: null };
  if (fw > 0) { const R = [ring(-0.003), ring(fw * 0.5), ring(fw + 0.001)]; out.field = stripOf(R, (k) => [-0.003, fw * 0.5, fw + 0.001][k] / K0.tile, nU); }
  const e0 = fw > 0 ? fw : -0.003, R = [0, 0.33, 0.66, 1].map((t) => ring(e0 + (fw + K0.edge - e0) * t));
  out.edge = stripOf(R, (k) => [0, 0.33, 0.66, 1][k], nU);
  return out;
}
/**
 * A lace trim along a neckline (T; band: People's band; nl(a): the neckline, f; out(f, a): the cloth's own surface there;
 * kind): a band of the lace's edge lying on the cloth just under its edge, its scallops along the neckline itself -> geometry
 */
export function laceTrim(T, band, nl, out, kind) {
  const K0 = KINDS[kindOf(kind)], wf = K0.edge / T.H, g = band(T, (a) => nl(a) - 0.003 - wf, (a) => nl(a) - 0.003, (f, a) => out(f, a) + 0.0014, { rows: 3, m: 72 });
  const grid = loftGrid(g); if (!grid) return null;
  const { M, K } = grid, P = g.attributes.position, R = [];
  for (let k = 0; k < K; k++) { const r = []; for (let j = 0; j < M; j++) r.push(V().fromBufferAttribute(P, k * M + j)); R.push(r); }
  let C = 0; for (let j = 0; j < M; j++) C += R[K - 1][j].distanceTo(R[K - 1][(j + 1) % M]);
  return stripOf(R, (k) => k / (K - 1), Math.max(1, Math.round(C / K0.tile)));
}

// ---- the lace kits ------------------------------------------------------------------------------------------------------
/**
 * The lace collection (merged into People's OUTFITS - their fields as theirs) - lace: { kind (LACE_KINDS), on ('top' or
 * 'accent': the lining it is laid on - the dress's own cloth, or the top beneath a jacket), col ('accent': the lace in
 * the accent colour; else her colour), lining ('accent' - the second colour; 'tone' - a shade of the lace's own: liningOf),
 * edge (a scalloped hem past the lining's), trim (its edge along the neckline, on the cloth), hemBand (a deep lace hem
 * below the cloth, m) } and the sheer layer's own (People's sheer, lace: 1 - over the skin: a yoke from the lining's
 * neckline up to sheer.neck, sleeves). Opaque wherever it covers her bust, her hips and between her legs: there the lace
 * always lies on its lining, never over skin
 */
export const LACE_OUTFITS = {
  // (a club's: black lace over a slip, its sleeves and its yoke sheer to a scoop; a black lace bustier mini, boned, its hem
  // scalloped; a lace corset worn as a top over leather trousers, or over wide ones; a lace bodysuit, its sleeves and yoke
  // sheer, under an open oversized blazer over wide trousers; a lace crop and its matching mini, the crop's long sleeves
  // and square yoke sheer, the midriff bare; a crepe bodycon mini with sheer lace sleeves and yoke to a crew neck)
  lacemini: { neck: 'sweet', sleeve: 0, lift: 1, skirt: { hem: 'mini', flare: 0, cling: 0.6 }, sheer: { neck: 'scoop', sleeve: 0.97, lace: 1 }, lace: { kind: 'corded', on: 'top', lining: 'accent', edge: 1 }, shoe: 'heel', fin: 'satin', rough: 0.4 },
  lacebustier: { neck: 'sweet', sleeve: 0, boned: 1, lift: 1, skirt: { hem: 'mini', flare: 0, cling: 0.6 }, lace: { kind: 'corded', on: 'top', lining: 'accent', edge: 1 }, shoe: 'heel', fin: 'satin', rough: 0.35 },
  lacecorset: { neck: 'sweet', sleeve: 0, boned: 1, lift: 1, hem: 0.1, point: 1, trousers: 'skinny', legFab: 'leather', lace: { kind: 'corded', on: 'top', lining: 'accent' }, shoe: 'heel', fin: 'satin', rough: 0.3 },
  lacecorsetwide: { neck: 'sweet', sleeve: 0, boned: 1, lift: 1, hem: 0.1, point: 1, trousers: 'wide', inseam: 1, lace: { kind: 'guipure', on: 'top', lining: 'accent' }, shoe: 'heel', fin: 'satin', rough: 0.3 },
  lacebody: { neck: 'sweet', sleeve: 0, lift: 1, hem: 0, jacket: 'oversize', trousers: 'wide', inseam: 1, sheer: { neck: 'scoop', sleeve: 0.97, lace: 1 }, lace: { kind: 'chantilly', on: 'accent', col: 'accent', lining: 'tone' }, shoe: 'heel', fin: 'crepe', accFin: 'jersey', rough: 0.62 },
  laceset: { neck: 'sweet', sleeve: 0, lift: 1, crop: 0.52, skirt: { hem: 'mini', flare: 0.02, cling: 0.55, rise: 0.2 }, sheer: { neck: 'square', sleeve: 0.97, lace: 1 }, lace: { kind: 'chantilly', on: 'top', lining: 'accent', edge: 1 }, shoe: 'heel', fin: 'jersey', rough: 0.6 },
  lacesleeve: { neck: 'sweet', sleeve: 0, lift: 1, skirt: { hem: 'mini', flare: 0, cling: 0.6 }, sheer: { neck: 'crew', sleeve: 0.97, lace: 1 }, lace: { kind: 'chantilly' }, shoe: 'heel', fin: 'crepe', rough: 0.8 },
  // (a gala's: a corded lace gown over its satin, slit high, its sleeves and its yoke to a high neck sheer; a lace midi
  // fitted close to the calf, lined in a contrast, its short sleeves lined too, its hem scalloped; a satin slip to the calf
  // trimmed in Chantilly - along its neckline, and a deep lace hem below its satin)
  lacegown: { neck: 'sweet', sleeve: 0, lift: 1, skirt: { hem: 'floor', flare: 0.2, slit: 1, cling: 0.42 }, sheer: { neck: 'crew', sleeve: 0.97, lace: 1 }, lace: { kind: 'corded', on: 'top', lining: 'accent' }, shoe: 'heel', fin: 'satin', rough: 0.3 },
  lacemidi: { neck: 'scoop', sleeve: 0.3, skirt: { hem: 'midi', flare: 0, cling: 0.62 }, lace: { kind: 'corded', on: 'top', lining: 'accent', edge: 1 }, shoe: 'heel', fin: 'crepe', rough: 0.7 },
  laceslip: { neck: 'slip', sleeve: 0, straps: 1, skirt: { hem: 'midi', flare: 0.1, cling: 0.3 }, lace: { kind: 'chantilly', col: 'accent', trim: 1, hemBand: 0.045 }, chain: 1, shoe: 'heel', fin: 'satin', rough: 0.24 },
  // (by day: a white broderie anglaise sundress on straps, square-necked, its skirt full to the knee and scalloped; a
  // satin cami trimmed with lace at its neckline, over jeans)
  eyelet: { neck: 'square', sleeve: 0, straps: 1, skirt: { hem: 'short', flare: 0.3, cling: 0.08 }, lace: { kind: 'eyelet', on: 'top', lining: 'tone', edge: 1 }, shoe: 'sandal', fin: 'cotton', rough: 0.86 },
  lacecami: { neck: 'cami', sleeve: 0, straps: 1, hem: -0.03, fit: 0.008, trousers: 'jeans', lace: { kind: 'chantilly', col: 'accent', trim: 1 }, shoe: 'heel', fin: 'silk', rough: 0.5 },
};
/** the club's lace kits (People's CLUB_KITS), the evening's, the day's */
export const LACE_CLUB = Object.freeze(['lacemini', 'lacebustier', 'lacecorset', 'lacecorsetwide', 'lacebody', 'laceset', 'lacesleeve']);
export const LACE_EVENING = Object.freeze(['lacegown', 'lacemidi', 'laceslip']);
export const LACE_DAY = Object.freeze(['eyelet', 'lacecami']);
/** a broderie's cotton (merged into People's FINISHES): matt; a cami's washed silk: a soft sheen, never a mirror, never one bright panel across a flat front */
export const LACE_FINISHES = Object.freeze({ cotton: { r: 0.88 }, silk: { r: 0.56, env: 0.14 } });
/** whether a kit is (or has) lace, and how: its lace, or a sheer layer that is a lace (a cover-up's) -> the lace spec or null */
export const laceOf = (OF) => OF?.lace || (OF?.sheer?.lace ? { kind: 'corded' } : null);
