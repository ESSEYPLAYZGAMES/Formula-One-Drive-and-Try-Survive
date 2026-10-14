// Dev only (temporary test helper for the hair/people refix; safe to delete): framing presets and quick defs on top of lineup.js
await import('/tools/lineup.js');
const VW = { f: 0, q: -0.65, s: -Math.PI / 2, qb: -2.45, b: Math.PI, qr: 0.65, sr: Math.PI / 2, qbr: 2.45 };
const FR = {
  head: { w: 2400, h: 700, gap: 0.42, dist: 1.55, cy: 1.62, ty: 1.62 },
  xhead: { w: 2400, h: 700, gap: 0.36, dist: 1.0, cy: 1.63, ty: 1.63 },
  torso: { w: 2400, h: 760, gap: 0.6, dist: 2.9, cy: 1.36, ty: 1.3 },
  full: { w: 2400, h: 1000, gap: 0.7 },
  shoulder: { w: 2400, h: 900, gap: 0.6, dist: 3.4, cy: 1.35, ty: 1.3 },
  feet: { w: 2400, h: 700, gap: 0.7, dist: 3.0, cy: 0.35, ty: 0.15 },
};
const celeb = (id, occasion = 'evening', vary = 0, x = {}) => { const L = __LP.Ce.celebLook(id, { occasion, vary, night: x.night }); L.detail = 1; delete x.night; return Object.assign(L, x, x.style ? { style: Object.assign({}, L.style, x.style) } : {}); };
const W = (hs, x = {}) => Object.assign({ figure: 'f', pose: 'talk', kit: 'slip', color: '#2a5fbf', skin: '#e3b994', hair: '#2b1d14', seed: 'w-' + hs, detail: 1, style: { hs, lip: true } }, x, { style: Object.assign({ hs, lip: true }, x.style || {}) });
const Mn = (hs, x = {}) => Object.assign({ figure: 'm', pose: 'talk', kit: 'jacket', color: '#2b2e35', skin: '#cf9a72', hair: '#2b1d14', seed: 'm-' + hs, detail: 1, style: { hs } }, x, { style: Object.assign({ hs }, x.style || {}) });
let ppl = [], last = null;
/** builds defs in a row (the lineup's own way) and renders the views; o.pre(people) runs before rendering */
const shot = async (defs, name, views = ['f', 'q', 's', 'b'], fr = 'head', o = {}) => {
  const { THREE, P, R, S } = __LP, F = Object.assign({}, typeof fr === 'string' ? FR[fr] : fr, o);
  for (const c of [...S.children]) if (c.userData.isPerson) S.remove(c);
  for (const p of ppl) p.dispose?.(); ppl = [];
  const gap = F.gap || 0.85;
  defs.forEach((d, i) => { const p = P.makePerson(d); p.group.position.set(0, 0, (i - (defs.length - 1) / 2) * gap); S.add(p.group); ppl.push(p); });
  if (F.pre) F.pre(ppl);
  last = { n: defs.length }; return render(name, views, F);
};
const render = async (name, views, F) => {
  const { THREE, R, S } = __LP, w = F.w || 2400, h = F.h || 1100, gap = F.gap || 0.85, fov = F.fov || 20, t = Math.tan(fov / 2 * Math.PI / 180); R.setSize(w, h, false);
  const cam = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100), span = (ppl.length - 1) * gap + 0.8, dist = F.dist || Math.max(2.1 / (2 * t), span / (2 * t * (w / h)));
  for (const v of views) { for (const p of ppl) p.group.rotation.y = VW[v]; cam.position.set(dist, F.cy ?? 1.0, F.cz ?? 0); cam.lookAt(0, F.ty ?? 0.9, F.cz ?? 0); R.render(S, cam); await fetch('http://127.0.0.1:8768/save?name=' + name + '_' + v, { method: 'POST', body: R.domElement.toDataURL('image/jpeg', 0.9) }); }
  return views.length;
};
/** the same people rendered again (after tweaking their materials, say) */
const again = (name, views = ['f'], fr = 'head', o = {}) => render(name, views, Object.assign({}, typeof fr === 'string' ? FR[fr] : fr, o));
const mats = () => { const s = new Set(); for (const p of ppl) p.group.traverse((m) => { if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => s.add(x)); }); return [...s]; };
const tris = () => ppl.map((p) => { let n = 0; p.group.traverse((m) => { if (m.isMesh) n += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; }); return Math.round(n); });
window.__H = { VW, FR, celeb, W, Mn, shot, again, mats, tris, ppl: () => ppl };
