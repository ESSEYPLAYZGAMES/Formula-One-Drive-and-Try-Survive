// Dev only (not part of the game): measures a person's neck from its mesh - cuts of the skin perpendicular to the neck's
// axis (the axis from the centres of two level loops below the chin), the loop round the axis -> girth (its convex hull,
// a tape's), width x depth. In the page console: await import('/tools/neckmeasure.js'); __NM(def)
import * as THREE from 'three';
import * as P from '../src/world/People.js';

globalThis.__NKD = globalThis.__NKD || {};
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

/** the body's skin as world-space triangles (flat array, 9 per triangle) */
function skinTris(p) {
  p.group.updateMatrixWorld(true);
  const body = p.group.children[0]; let mesh = null;
  body.children.forEach((m) => { if (m.isMesh && m.material === p.mats.skin) mesh = m; });
  const g = mesh.geometry, pos = g.attributes.position, idx = g.index, n = idx ? idx.count : pos.count, out = new Float32Array(n * 3), v = V();
  for (let i = 0; i < n; i++) { const k = idx ? idx.getX(i) : i; v.fromBufferAttribute(pos, k).applyMatrix4(mesh.matrixWorld); out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z; }
  return out;
}
/** the plane n.x = d through the triangles -> closed loops (arrays of Vector3) */
function cut(T, n, d) {
  const key = (p) => `${Math.round(p.x * 1e5)},${Math.round(p.y * 1e5)},${Math.round(p.z * 1e5)}`;
  const segs = [], a = V(), b = V(), c = V();
  const edgePt = (p, q, sp, sq) => { // deterministic: from the lexicographically smaller end
    const ka = key(p), kb = key(q); if (ka > kb) { [p, q] = [q, p]; [sp, sq] = [sq, sp]; }
    return p.clone().lerp(q, sp / (sp - sq));
  };
  for (let i = 0; i < T.length; i += 9) {
    a.set(T[i], T[i + 1], T[i + 2]); b.set(T[i + 3], T[i + 4], T[i + 5]); c.set(T[i + 6], T[i + 7], T[i + 8]);
    const sa = a.dot(n) - d, sb = b.dot(n) - d, sc = c.dot(n) - d, P2 = [];
    for (const [p, q, sp, sq] of [[a, b, sa, sb], [b, c, sb, sc], [c, a, sc, sa]]) if ((sp < 0) !== (sq < 0)) P2.push(edgePt(p, q, sp, sq));
    if (P2.length === 2 && P2[0].distanceToSquared(P2[1]) > 1e-14) segs.push(P2);
  }
  const adj = new Map(), pt = new Map();
  segs.forEach(([p, q], i) => { for (const [x, y] of [[p, q], [q, p]]) { const k = key(x); pt.set(k, x); if (!adj.has(k)) adj.set(k, []); adj.get(k).push(key(y)); } });
  const used = new Set(), loops = [];
  for (const k0 of adj.keys()) {
    if (used.has(k0)) continue; const L = [pt.get(k0)]; used.add(k0); let prev = null, cur = k0;
    for (let s = 0; s < 100000; s++) { const nx = (adj.get(cur) || []).find((k) => k !== prev && !used.has(k)); if (!nx) break; used.add(nx); L.push(pt.get(nx)); prev = cur; cur = nx; }
    if (L.length > 4) loops.push(L);
  }
  return loops;
}
const hull2 = (Q) => { const s = Q.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []; for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (const p of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); } return lo.slice(0, -1).concat(up.slice(0, -1)); };
const perim = (Q) => Q.reduce((s, p, i) => s + Math.hypot(p[0] - Q[(i + 1) % Q.length][0], p[1] - Q[(i + 1) % Q.length][1]), 0);
const inside = (Q, x, y) => { let c = false; for (let i = 0, j = Q.length - 1; i < Q.length; j = i++) if ((Q[i][1] > y) !== (Q[j][1] > y) && x < ((Q[j][0] - Q[i][0]) * (y - Q[i][1])) / (Q[j][1] - Q[i][1]) + Q[i][0]) c = !c; return c; };
/** the loop round the point o in the plane (n, through o); u across, w forward -> { girth (hull), per (its own), W, D, cen } */
function ring(T, o, n, u, w) {
  const loops = cut(T, n, n.dot(o)); let best = null;
  for (const L of loops) {
    const Q = L.map((p) => { const q = p.clone().sub(o); return [q.dot(u), q.dot(w)]; });
    if (!inside(Q, 0, 0)) continue;
    const H = hull2(Q), g = perim(H); if (!best || g < best.girth) {
      let cx = 0, cy = 0, A = 0; for (let i = 0; i < Q.length; i++) { const [x0, y0] = Q[i], [x1, y1] = Q[(i + 1) % Q.length], cc = x0 * y1 - x1 * y0; A += cc; cx += (x0 + x1) * cc; cy += (y0 + y1) * cc; }
      const xs = Q.map((q) => q[0]), ys = Q.map((q) => q[1]);
      best = { girth: g, per: perim(Q), W: Math.max(...xs) - Math.min(...xs), D: Math.max(...ys) - Math.min(...ys), F: Math.max(...ys), B: -Math.min(...ys), cen: o.clone().addScaledVector(u, cx / (3 * A)).addScaledVector(w, cy / (3 * A)) };
    }
  }
  return best;
}
/**
 * def: makePerson options -> { HG, top (the girth of the neck's top ring, NK), rows: [{ at, girth, W, D, dk }] } in cm:
 * at: 'jaw-2' (2 cm under the chin's level), 'mid' (halfway from the chin's level to the collarbones' line - the larynx),
 * 'low' (three quarters of the way down)
 */
window.__NM = (def, keep = false) => {
  globalThis.__NKD = {}; const p = P.makePerson(def), K = globalThis.__NKD.last; p.group.updateMatrixWorld(true);
  const body = p.group.children[0], Mw = body.matrixWorld, sc = body.scale.x, T = skinTris(p);
  const W = (h) => K.nAt(h).applyMatrix4(Mw);
  const up = V(0, 1, 0), side = K.nSd.clone().transformDirection(Mw), fwd0 = K.fwN.clone().transformDirection(Mw);
  // (two level loops below the chin -> the axis)
  const chin = W(K.sChin), lv = (dy) => { const o = chin.clone().add(V(0, -dy, 0)), f = fwd0.clone().setY(0).normalize(); return ring(T, o, up, side.clone().setY(0).normalize(), f); };
  const L1 = lv(0.012), L2 = lv(0.035);
  const ax = L1 && L2 ? L1.cen.clone().sub(L2.cen).normalize() : K.an.clone().transformDirection(Mw);
  const u = side.clone().addScaledVector(ax, -side.dot(ax)).normalize(), w = new THREE.Vector3().crossVectors(u, ax).normalize();
  if (w.dot(fwd0) < 0) w.negate();
  const o0 = L1 ? L1.cen : chin, sOf = (p2) => p2.clone().sub(o0).dot(ax), sC = sOf(chin), sA = sOf(W(K.sAc)), sTop = sOf(W(K.sPiv));
  const at = (s) => o0.clone().addScaledVector(ax, s);
  const rows = [];
  for (const [nm, s] of [['top', sTop - 0.004], ['jaw-2', sC - 0.02], ['mid', 0.5 * (sC + sA)], ['low', sC + 0.75 * (sA - sC)]]) {
    const r = ring(T, at(s), ax, u, w); rows.push(r ? { at: nm, girth: +(100 * r.girth).toFixed(1), per: +(100 * r.per).toFixed(1), W: +(100 * r.W).toFixed(1), D: +(100 * r.D).toFixed(1), dk: +(r.D / r.W).toFixed(2), F: +(100 * r.F).toFixed(1), B: +(100 * r.B).toFixed(1) } : { at: nm, girth: null });
  }
  const res = { HG: +(100 * K.NK.HG * sc).toFixed(1), tgt: +(100 * K.NK.girth * sc).toFixed(1), chin2ac: +(100 * (sC - sA)).toFixed(1), tilt: +(Math.acos(ax.y) * 180 / Math.PI).toFixed(1), rows };
  if (!keep) p.dispose?.(); else res.p = p;
  return res;
};
/** a test set: women (bare necklines, covered), drivers (suit, off duty in a polo), generic men -> [[name, def]] */
window.__NMset = async (pose = 'talk') => {
  const Ce = await import('../src/career/Celebs.js'), { ROSTER } = await import('../src/race/Roster.js');
  const W = (id, kit) => { const d = Ce.celebLook(id, { occasion: 'evening' }); d.kit = kit; d.detail = 1; d.pose = pose; return [id.split('-')[0] + '/' + kit, d]; };
  const D = (nm, kit) => { const r = ROSTER.find((x) => x.name.includes(nm)); return [nm + '/' + kit, { pose, kit, color: r.color, accent: r.color2, driver: r.name, detail: 1 }]; };
  return [W('mira-vale', 'bardot'), W('lena-marsh', 'halter'), W('sasha-ivers', 'slip'), W('noor-haddad', 'gown'), W('ava-rennick', 'slitgown'), W('jade-okafor', 'blazerdress'), W('clara-voss', 'knit'), W('elena-marchetti', 'athleisure'), W('priya-raman', 'pantsuit'),
    D('Norris', 'suit'), D('Verstappen', 'suit'), D('Leclerc', 'suit'), D('Hamilton', 'suit'), D('Norris', 'polo'), D('Verstappen', 'polo'),
    ['man1/polo', { pose, kit: 'polo', seed: 'gm1', detail: 1 }], ['man2/jacket', { pose, kit: 'jacket', seed: 'gm2', detail: 1 }], ['man3/casual', { pose, kit: 'casual', seed: 'gm3', detail: 1 }], ['man4/marshal', { pose, kit: 'marshal', seed: 'gm4', detail: 1 }]];
};
window.__NMtab = (list) => list.map(([nm, def]) => { try { const r = __NM(def); return nm.padEnd(16) + ` HG ${r.HG} tgt ${r.tgt} c-ac ${r.chin2ac} | ` + r.rows.map((x) => `${x.at} ${x.girth} (${x.W}x${x.D})`).join(' | '); } catch (e) { return nm + ' ERR ' + e.message; } }).join('\n');
