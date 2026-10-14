// Clubwear: the made details of a night out's clothes (world/People.js's club kits) - a bandeau's gathers, a midriff's
// own gentle form under a cropped top, jeans' waistband with its loops, button and pockets, a bralette's band and cups'
// seams, a cut-out's bound edge with its straps and ring. Each built once, against the person's own torso (T: torsoOf's -
// T.pt(f, angle, out), T.c(f), T.sec(f), T.H; angle 0 the front, +-pi the back; f a share of the torso's length), every
// measure a share of hers - nothing drawn per frame, nothing to change how she is made beyond what the cloth shows.
import * as THREE from 'three';
import { strip, cord, oRing, button, bow, twist as twistOf } from './Trims.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const ss3 = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
const gau = (x, s) => Math.exp(-((x / s) ** 2));
const clamp01 = (x) => Math.max(0, Math.min(1, x));

/** a grid on the torso: rows f from lo to hi (functions of the angle allowed; us: the rows' shares of the way, if not even),
 * columns at angs; out(f, a) -> geometry with colours */
function grid(T, lo, hi, angs, rows, out, col, us = null) {
  const L = typeof lo === 'function' ? lo : () => lo, U = typeof hi === 'function' ? hi : () => hi, W = angs.length, pos = [], cols = [], idx = [];
  if (us) rows = us.length - 1;
  for (let i = 0; i <= rows; i++) for (let j = 0; j < W; j++) {
    const a = angs[j], f = L(a) + (U(a) - L(a)) * (us ? us[i] : i / rows), p = T.pt(f, a, out(f, a)), c = col ? col(f, a) : [1, 1, 1];
    pos.push(p.x, p.y, p.z); cols.push(c[0], c[1], c[2]);
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < W - 1; j++) { const a = i * W + j, b = a + 1, c = a + W + 1, d = a + W; idx.push(a, b, c, a, c, d); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.setIndex(idx); g.computeVertexNormals();
  // (facing out: the middle vertex's normal away from the section's middle)
  const m = (rows >> 1) * W + (W >> 1), P = g.attributes.position, N = g.attributes.normal, f0 = (L(0) + U(0)) / 2, c0 = T.c(f0);
  if ((P.getX(m) - c0.x) * N.getX(m) + (P.getZ(m) - c0.z) * N.getZ(m) < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } g.computeVertexNormals(); }
  return g;
}
/** angles round the torso, closer together across the front (dense 0..0.8), m of them, a seam closed at the back */
const angsOf = (m, dense = 0.5) => Array.from({ length: m + 1 }, (_, j) => { const u = (j / m) * 2 * Math.PI - Math.PI; return u - dense * Math.sin(u); });
/** rows from lo to hi spaced sp(f) apart (a share of the torso's length; k: the detail's share) -> their shares of the way, 0..1 */
function rowsOf(lo, hi, sp, k = 1) {
  const N = 64, cum = [0];
  // (a spacing never below a share of the finest the detail asks for: never zero or less - rows bunched to nothing, the
  // piece collapsed to a line)
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + (hi - lo) / N / (Math.max(0.004, sp(lo + (hi - lo) * (i - 0.5) / N)) / k));
  const R = Math.max(3, Math.round(cum[N])), us = [];
  for (let r = 0; r <= R; r++) { const t = cum[N] * r / R; let i = 1; while (i < N && cum[i] < t) i++; us.push(Math.min(1, (i - 1 + (t - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])) / N)); }
  return us;
}

/**
 * Her bare midriff between a cropped top and what is worn below it (lo: their top, f; hi: the top's hem): the torso's own
 * surface with its quiet form - the navel a small dimple a little below the waist's narrowest, a soft hood of skin over
 * it; the faint line down the middle of the belly (linea alba) to it; the lower belly's gentle round under it; low on the
 * hips, where low-rise trousers show them, the hip bones' slight rise either side. All a few millimetres, shares of her
 * torso's length (T.H) - natural, never sculpted. lum: her skin's luminance (the shadows warm, a share of her own colour).
 * ctx: { n (detail's count), Q } -> geometry (colours: the shading, multiplied on the skin's material)
 */
export function midriff(T, lo, hi, lum = 0.35, ctx = {}) {
  const n = ctx.n || ((k) => k), hk = T.H / 0.66, fN = 0.235, aW = 0.8;
  // (nothing of it under the waistband tucked on to it (lo): faded out over the last couple of centimetres; the hip bones
  // just above a low one only - none under a high waist)
  const fHB = Math.max(0.15, lo + 0.045), hbOn = lo < 0.2 ? 1 : 0;
  // (its rows close together only where its form is fine - about the navel, over the hip bones - a couple of centimetres
  // apart elsewhere; its columns closest across the front. Where the two meet - a low rise, the hip bones just under the
  // navel - the finer of the two, not their sum: summed they asked for less than nothing between rows and the whole
  // midriff collapsed to its lowest row - twistset's waist open through)
  const M = n(48, 16), angs = angsOf(M, 0.6), us = rowsOf(lo, hi, (f) => Math.min(0.03 - 0.021 * gau((f - fN) / 0.03, 1), 0.03 - hbOn * 0.012 * gau((f - fHB) / 0.035, 1)), n(100, 25) / 100);
  const out = (f, a) => {
    const b = Math.abs(a), fade = ss3(lo + 0.004, lo + 0.024, f);
    return fade * outRaw(f, a, b);
  };
  const outRaw = (f, a, b) => {
    // (the navel: a small round dimple, deepest a touch below its middle; its hood - a soft fold of skin over its top)
    const nv = -0.0042 * hk * gau(a / 0.07, 1) * gau((f - fN + 0.003) / 0.012, 1) + 0.0011 * hk * gau(a / 0.11, 1) * gau((f - fN - 0.017) / 0.012, 1);
    // (the linea alba: a faint groove up from it toward the ribs; the lower belly's round below; either side of the
    // middle the abdomen's soft rounds - the obliques' line easing in toward the hips)
    const la = -0.0007 * hk * gau(a / 0.05, 1) * ss3(fN + 0.02, fN + 0.06, f) * ss3(0.48, 0.38, f);
    const lb = 0.0018 * hk * gau(a / 0.55, 1) * gau((f - 0.17) / 0.06, 1);
    const ob = -0.0012 * hk * gau((b - 1.05) / 0.22, 1) * gau((f - 0.3) / 0.08, 1);
    // (the hip bones (anterior iliac spines): a slight rise, toward the sides, low)
    const hb = hbOn * 0.0016 * hk * gau((b - aW) / 0.16, 1) * gau((f - fHB) / 0.03, 1);
    return nv + la + lb + ob + hb;
  };
  // (its shade: the navel's hollow darker at its heart, a faint line down the middle, the hip bones' light; warm - the
  // skin's own red kept - and never near black)
  const sMin = 0.45 + 0.12 * ss3(0.3, 0.08, lum);
  const col = (f, a) => {
    const d = gau(a / 0.05, 1) * gau((f - fN + 0.004) / 0.008, 1), l = 0.06 * gau(a / 0.035, 1) * ss3(fN + 0.02, fN + 0.06, f) * ss3(0.46, 0.38, f);
    const s0 = 1 - 0.5 * d - l, s = s0 + sMin * (1 - s0) ** 2.4, h = 1 + hbOn * 0.04 * gau((Math.abs(a) - aW) / 0.14, 1) * gau((f - fHB - 0.005) / 0.025, 1);
    return [s ** 0.8 * h, s * h, s ** 1.18 * h];
  };
  return grid(T, lo, hi, angs, 0, out, col, us);
}

/**
 * Gathers worked into a piece of cloth on the torso (g: a band or a panel, indexed; its normals recomputed): fine folds
 * running across it, drawn in toward a point (the centre front, or a side: s) - a ruched bandeau's, its cloth hugging her
 * between them; each a millimetre or so proud, the furrows between them a shade darker. o: { f0, f1 (the piece's span), at
 * (the angle it is drawn toward), k (how many folds), amp (m) } -> g
 */
export function ruche(g, T, o = {}) {
  const P = g.attributes.position, C = g.attributes.color || (() => { const c = new Float32Array(P.count * 3).fill(1); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g.attributes.color; })();
  if (!g.attributes.normal) g.computeVertexNormals();
  const N = g.attributes.normal, qi = T.q.clone().invert(), v = V(), f0 = o.f0 ?? 0.5, f1 = o.f1 ?? 0.7, at = o.at ?? 0, k = o.k ?? 7, amp = (o.amp ?? 0.0012) * T.H / 0.66;
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i).sub(T.A).applyQuaternion(qi);
    const f = (v.y + 0.11) / T.H, sc = T.sec(f), a = Math.atan2(v.z, v.x - sc[2]), da = Math.atan2(Math.sin(a - at), Math.cos(a - at));
    // (each fold's line: level at the sides, drawn together toward the gathering point - a fan of soft curves)
    const u = clamp01((f - f0) / Math.max(1e-4, f1 - f0)), fan = (u - 0.5) * (1 - 0.55 * gau(da / 0.5, 1)) + 0.5, ph = fan * k * 2 * Math.PI;
    const edge = ss3(0, 0.12, u) * ss3(1, 0.88, u), r = (0.5 + 0.5 * Math.cos(ph)) * edge * (0.75 + 0.25 * Math.cos(da * 3.1 + 0.7)), d = amp * (r - 0.35 * edge);
    P.setXYZ(i, P.getX(i) + N.getX(i) * d, P.getY(i) + N.getY(i) * d, P.getZ(i) + N.getZ(i) * d);
    const c = 1 - 0.12 * (1 - r) * edge; C.setXYZ(i, C.getX(i) * c, C.getY(i) * c, C.getZ(i) * c);
  }
  g.computeVertexNormals(); return g;
}

/**
 * Jeans' (or trousers') waistband where it shows - low on the hips (top: f), level all round on the hip bones: the band
 * itself (a shade darker, a hair proud), five belt loops, the shank button at the front, the fly's stitched placket to one
 * side curving in at its foot, and the front pockets' curved openings either side. out(f, a): the cloth's own lift there.
 * ctx: { n, Q } -> { band: [geometry] (the trousers' cloth), metal: [geometry] (the button, the rivets) }
 */
export function waistband(T, top, out, ctx = {}) {
  const n = ctx.n || ((k) => k), Q = ctx.Q ?? 1, O = typeof out === 'function' ? out : () => out, hb = 0.036, band = [], metal = [];
  const angs = angsOf(n(48, 12), 0.3), on = (f, a) => O(f, a) + 0.0018;
  // (the band: level, a hair proud of the cloth below it, its top edge turned in)
  band.push(grid(T, top - hb, top, angs, 2, on, (f) => { const k = 0.86 - 0.08 * ss3(top - 0.004, top, f); return [k, k, k]; }));
  if (Q < 0.6) return { band, metal };
  // (tailored (ctx.tailored - wide trousers in a suiting cloth): the same band, its loops and its button; the fly; slanted
  // pockets - a straight slash from the band down toward the side seam - and no rivets)
  if (ctx.tailored) {
    for (const a of [-0.55, 0.55, -1.55, 1.55, Math.PI]) {
      const pts = [], nr = [];
      for (let i = 0; i <= 4; i++) { const f = top + 0.003 - (hb + 0.008) * (i / 4), p = T.pt(f, a, on(f, a) + 0.0011); pts.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
      band.push(strip(pts, nr, 0.0075, 0.0016));
    }
    const bp = T.pt(top - hb / 2, 0, on(top - hb / 2, 0) + 0.0016); metal.push(button(bp, bp.clone().sub(T.c(top - hb / 2)).setY(0).normalize(), 0.0058));
    const fly = [], fn = [];
    for (let i = 0; i <= 8; i++) { const u = i / 8, f = top - hb - 0.12 * u, a = 0.07 * (1 - ss3(0.7, 1, u)), p = T.pt(f, a, O(f, a) + 0.0012); fly.push(p); fn.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
    band.push(tintG(strip(fly, fn, 0.0014, 0.0008), 0.6));
    for (const s of [-1, 1]) {
      const pts = [], nr = [];
      for (let i = 0; i <= 6; i++) { const u = i / 6, f = top - hb - 0.002 - 0.1 * u, a = s * (0.5 + 0.5 * u), p = T.pt(f, a, O(f, a) + 0.0012); pts.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
      band.push(tintG(strip(pts, nr, 0.002, 0.001), 0.62));
    }
    return { band, metal };
  }
  // (belt loops: short straps over the band - one either side of the front, two at the sides, one at the back)
  for (const a of [-0.55, 0.55, -1.55, 1.55, Math.PI]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 4; i++) { const f = top + 0.004 - (hb + 0.012) * (i / 4), p = T.pt(f, a, on(f, a) + 0.0012); pts.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
    band.push(strip(pts, nr, 0.0085, 0.0018));
  }
  // (the button, at the front middle of the band; the rivets at the pockets' corners)
  const bp = T.pt(top - hb / 2, 0, on(top - hb / 2, 0) + 0.0018); metal.push(button(bp, bp.clone().sub(T.c(top - hb / 2)).setY(0).normalize(), 0.0065));
  // (the fly: its stitched placket - a fine darker line down one side of the front, curving in at its foot)
  const fly = [], fn = [];
  for (let i = 0; i <= 8; i++) { const u = i / 8, f = top - hb - 0.13 * u, a = 0.075 * (1 - ss3(0.7, 1, u)), p = T.pt(f, a, on(f, a) - 0.0006); fly.push(p); fn.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
  band.push(tintG(strip(fly, fn, 0.0016, 0.0008), 0.55));
  // (the front pockets: each opening a soft curve from the band near the front down to the side seam)
  for (const s of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 10; i++) { const u = i / 10, f = top - hb - 0.005 - 0.09 * Math.sin(u * Math.PI / 2) ** 1.4, a = s * (0.42 + 0.95 * u ** 1.3), p = T.pt(f, a, on(f, a) - 0.0004); pts.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
    band.push(tintG(strip(pts, nr, 0.0022, 0.001), 0.6));
    const rp = pts[pts.length - 1]; metal.push(button(rp, nr[nr.length - 1], 0.0024));
  }
  return { band, metal };
}

/**
 * How far a shell of cloth (g: wide trousers' one piece, a skirt's - standing off her by more than her torso shows, round
 * the legs) lies off her torso at (f, a): found along the way out from her there, the shell's outer face the first met
 * coming in -> out(f, a) (base where the shell is not there). Built once, for the made pieces on it (a waistband); nothing
 * per frame
 */
export function shellOut(T, g, base = 0.0035) {
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })), rc = new THREE.Raycaster(), d = V(), o = V(), R = 0.3, hits = [];
  g.computeBoundingSphere();
  return (f, a) => {
    const p = T.pt(f, a, 0), c = T.c(f); d.copy(p).sub(c); d.y = 0; if (d.lengthSq() < 1e-8) return base; d.normalize();
    o.copy(p).addScaledVector(d, R); rc.set(o, d.clone().negate()); rc.far = R + 0.02;
    hits.length = 0; m.raycast(rc, hits); let t = Infinity; for (const h of hits) t = Math.min(t, h.distance);
    return t < Infinity ? Math.max(base, R - t) : base;
  };
}

/**
 * A bralette under an open blazer (neck(a): its cups' upper edge, f, by angle; lo: its band's foot): the band under the
 * bust - level, a little proud - the gore between the cups down to it, and each cup's seam from the band up over its round
 * to the strap. out(f, a): the bodice's lift -> [geometry] (the bodice's cloth; their colour a shade darker)
 */
export function bralette(T, neck, lo, out, ctx = {}) {
  const n = ctx.n || ((k) => k), Q = ctx.Q ?? 1, O = typeof out === 'function' ? out : () => out, G = [], bh = 0.04;
  // (the band: under the bust, level all round, a shade darker - its elastic)
  G.push(grid(T, lo, lo + bh, angsOf(n(44, 12), 0.5), 2, (f, a) => O(f, a) + 0.0016, () => [0.8, 0.8, 0.8]));
  if (Q < 0.6) return G;
  // (the gore: a narrow strip down the breastbone between the cups, from where they meet to the band)
  // (a gore is short - a few centimetres, from the band to where the cups meet: never up past it)
  const g0 = lo + bh, g1 = Math.min(g0 + 0.07, Math.max(g0 + 0.02, neck(0) - 0.004)), gp = [], gn = [];
  for (let i = 0; i <= 4; i++) { const f = g0 + (g1 - g0) * i / 4, p = T.pt(f, 0, O(f, 0) + 0.0012); gp.push(p); gn.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
  G.push(tintG(strip(gp, gn, 0.007, 0.0012), 0.82));
  // (each cup's seam: from the band up over the round's middle toward its strap)
  for (const s of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 10; i++) { const u = i / 10, a = s * (0.48 + 0.04 * Math.sin(u * Math.PI)), f = g0 + (neck(a) - 0.006 - g0) * u, p = T.pt(f, a, O(f, a) + 0.0009); pts.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
    G.push(tintG(strip(pts, nr, 0.0018, 0.0008), 0.7));
  }
  return G;
}

/**
 * A cut-out's finished edge (H: People's HOLES - each { f0, f1, c(u), w(u) }): a bound edge - a fine round cord of the
 * cloth all round each hole, lying on it (out(f, a)); cross: straps criss-crossing the hole (that many), lying across the
 * skin; ring: a metal O-ring at the hole's middle with the straps to it -> { cloth: [geometry], metal: [geometry] }
 */
export function bindHoles(T, H, out, o = {}, ctx = {}) {
  const Q = ctx.Q ?? 1, O = typeof out === 'function' ? out : () => out, cloth = [], metal = [];
  for (const h of H) {
    const at = (u, side) => { const q = clamp01(u), f = h.f0 + (h.f1 - h.f0) * q; return [f, h.c(q) + side * h.w(q)]; };
    // (its edge: up one side and down the other, round its ends where w closes to nothing)
    // (closer together toward its ends, where it turns; each end's point once - a closed loop with no doubled point, so no
    // kink or loop where it closes)
    const E = []; const K = Q >= 0.6 ? 14 : 8, uu = (i) => 0.5 - 0.5 * Math.cos(Math.PI * i / K);
    for (let i = 0; i <= K; i++) E.push(at(uu(i), 1));
    for (let i = K - 1; i >= 1; i--) E.push(at(uu(i), -1));
    const pts = E.filter((e, i) => i === 0 || Math.hypot(e[0] - E[i - 1][0], e[1] - E[i - 1][1]) > 1e-4).map(([f, a]) => T.pt(f, a, O(f, a) + 0.0012));
    if (pts.length > 4) cloth.push(cord(pts, 0.0019, Q >= 0.6 ? 5 : 3, true));
    if (o.cross && Q >= 0.6) {
      // (straps across it: from one side's edge to the other's, criss-crossed - lying on the skin between)
      const k = o.cross;
      for (let i = 0; i < k; i++) {
        const uA = (i + 0.5) / k, uB = (k - i - 0.5) / k, [fa, aa] = at(uA, -1), [fb, ab] = at(uB, 1), pts2 = [], nr = [];
        for (let j = 0; j <= 6; j++) { const t = j / 6, f = fa + (fb - fa) * t, a = aa + (ab - aa) * t, p = T.pt(f, a, 0.0016 + 0.0012 * Math.sin(Math.PI * t)); pts2.push(p); nr.push(p.clone().sub(T.c(f)).setY(0).normalize()); }
        cloth.push(strip(pts2, nr, 0.0065, 0.0016));
      }
    }
    if (o.ring && Q >= 0.6) {
      const fm = (h.f0 + h.f1) / 2, am = h.c(0.5), p = T.pt(fm, am, 0.004), nn = p.clone().sub(T.c(fm)).setY(0).normalize(), r = Math.min(0.016, 0.45 * (h.f1 - h.f0) * T.H);
      metal.push(oRing(p, nn, r, 0.0024));
      // (a short strap from each side's edge to the ring)
      for (const s of [-1, 1]) {
        const [f0, a0] = at(0.5, s), pts2 = [], nr = [];
        for (let j = 0; j <= 4; j++) { const t = j / 4, f = f0 + (fm - f0) * t, a = a0 + (am + s * r / (T.sec(fm)[0] || 0.12) - a0) * t, q = T.pt(f, a, O(f, a) * (1 - t) + 0.0035 * t); pts2.push(q); nr.push(q.clone().sub(T.c(f)).setY(0).normalize()); }
        cloth.push(strip(pts2, nr, 0.007, 0.0016));
      }
    }
  }
  return { cloth, metal };
}

/**
 * Bandeaus' necklines (f by the angle round from the front, as People's NECK): straight - level across the upper bust,
 * easing a little lower under the arms and across the back; twist - the same dipping softly to a twist knot at the
 * middle; tiefront - a soft sweetheart, its middle drawn down toward the knot below it
 */
const BAND_TOP = (a) => { const b = Math.abs(a); return 0.756 - 0.016 * ss3(0.6, 1.5, b) - 0.022 * ss3(1.8, 2.8, b); };
export const BAND_NECKS = Object.freeze({
  straight: BAND_TOP,
  twist: (a) => BAND_TOP(a) - 0.034 * gau(a / 0.3, 1),
  tiefront: (a) => { const b = Math.abs(a), u = Math.min(1, b / 0.42); return BAND_TOP(a) - 0.05 * (1 - u * (2 - u)) - 0.012 * gau((b - 0.42) / 0.1, 1) + 0.008 * gau((b - 0.45) / 0.2, 1); },
  // (a bralette's: from the gore between its cups - low, at the middle - up each cup's inner edge to its strap's point,
  // down its outer edge under the arm, and level round the back on its band)
  bralette: (a) => { const b = Math.abs(a); return b < 0.5 ? 0.6 + 0.175 * (b / 0.5) ** 0.85 : b < 1.35 ? 0.775 - 0.125 * ss3(0.5, 1.35, b) : 0.65 - 0.055 * ss3(1.35, 2.2, b); },
});
/**
 * A knot at the front of a top (f: its height on her, out: the cloth's lift there): 'twist' - the cloth twisted round
 * itself at the neckline's dip; 'tie' - the hem's two ends tied at the middle, a short knot and two tails hanging from it
 * -> [geometry] (the top's own cloth)
 */
export function frontKnot(T, f, out, kind = 'twist') {
  const p = T.pt(f, 0, out + 0.002), nn = p.clone().sub(T.c(f)).setY(0).normalize(), up = V(0, 1, 0).applyQuaternion(T.q);
  if (kind === 'twist') return twistOf(T.pt(f, 0, out + 0.004), nn, up, 0.05 * T.H / 0.66, 0.032 * T.H / 0.66);
  // (a tie: a small round knot, its two tails hanging and parting a little - short, the hem's own ends)
  // (the knot: a soft flattened round a couple of centimetres across, lying on the cloth; its two tails short and broad -
  // the hem's own ends - falling from it and parting, each easing out to its side as it hangs, its cut end narrower)
  const kh = T.H / 0.66, G = [], S = V().crossVectors(up, nn).normalize(), kn = new THREE.SphereGeometry(0.0115 * kh, 12, 9); kn.scale(1.35, 0.95, 0.55);
  kn.applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(S, up.clone().addScaledVector(nn, -up.dot(nn)).normalize(), nn)));
  kn.translate(...p.clone().addScaledVector(nn, 0.003).toArray()); G.push(tintG(kn, 0.92));
  for (const s of [-1, 1]) {
    const pts = [], nr = [];
    for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push(p.clone().addScaledVector(S, s * (0.006 + 0.022 * u ** 1.3) * kh).addScaledVector(up, -0.036 * u * kh).addScaledVector(nn, 0.004 - 0.0015 * u)); nr.push(nn.clone().addScaledVector(S, s * 0.25 * u).normalize()); }
    G.push(tintG(strip(pts, nr, 0.019 * kh, 0.0022, (u) => 1 - 0.35 * u), 0.88));
  }
  return G;
}
/**
 * A bow tied at the back of the neck (f: its height, out: the cloth's lift there) - an open back's ties, its tails
 * falling a little down the bare back -> [geometry] (the dress's cloth)
 */
export function napeBow(T, f, out) {
  const kh = T.H / 0.66, p = T.pt(f, Math.PI, out + 0.002), nn = p.clone().sub(T.c(f)).setY(0).normalize(), up = V(0, 1, 0).applyQuaternion(T.q);
  return bow(p, nn, up, 0.03 * kh, 0.075 * kh).map((g) => tintG(g, 0.9));
}
/** a geometry's colour set to k (all its vertices, multiplied on its material) -> g */
function tintG(g, k) { const P = g.attributes.position, C = new Float32Array(P.count * 3).fill(k); g.setAttribute('color', new THREE.BufferAttribute(C, 3)); return g; }

/**
 * A hem's length for a skirt (People's skirt(): kn, the knees' middle; Lt, the thigh's length; Ls, the shin's): micro (a
 * hand's breadth under the seat's fold), mini, thigh (mid-thigh), short (above the knee), knee, midi, floor -> y, or null
 */
export function hemY(h, kn, Lt, Ls) {
  return { micro: kn + 0.6 * Lt, mini: kn + 0.5 * Lt, thigh: kn + 0.36 * Lt, short: kn + 0.16 * Lt, knee: kn - 0.12 * Ls, midi: kn - 0.46 * Ls, floor: 0.035 }[h] ?? null;
}
export const HEM_KEYS = Object.freeze(['micro', 'mini', 'thigh', 'short', 'knee', 'midi', 'floor']);
