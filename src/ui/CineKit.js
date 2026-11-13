// What a cutscene's set is made of (ui/Cine.js hands these to a scene as part of its kit): shapes with their edges
// rounded and their curves round (a box is never a bare cube, a cylinder never a hexagon), surfaces with a grain
// (concrete, carpet, wood, cloth, brushed metal ... painted once and tiled by the metre), things turned on a lathe or
// run along a curve (a cup, a cable), markings that lie ON a floor or a wall without fighting it for the same depth
// (decals), a soft shadow under whatever stands on the floor, a crowd of real figures (world/Crowd.js) - and a batch:
// everything put into it is welded into one mesh a material, so a set can be dense without a draw call a prop.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { Crowd, crowdMaterial } from '../world/Crowd.js';

const PI = Math.PI;
const E = new THREE.Euler(), Q = new THREE.Quaternion(), M4 = new THREE.Matrix4(), ONE = new THREE.Vector3(1, 1, 1), P0 = new THREE.Vector3();

/** uv by the metre, from whichever way each face looks (so a surface's grain is the same size on every box) */
function boxUV(g) {
  const P = g.attributes.position, uv = new Float32Array(P.count * 2), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < P.count; i += 3) {
    a.fromBufferAttribute(P, i); b.fromBufferAttribute(P, i + 1).sub(a); c.fromBufferAttribute(P, i + 2).sub(a); b.cross(c);
    const ax = Math.abs(b.x), ay = Math.abs(b.y), az = Math.abs(b.z), k = ax >= ay && ax >= az ? 0 : ay >= az ? 1 : 2;
    for (let j = i; j < i + 3; j++) { const x = P.getX(j), y = P.getY(j), z = P.getZ(j); uv[j * 2] = k === 0 ? z : x; uv[j * 2 + 1] = k === 1 ? z : y; }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}
/** a box w x h x d with its edges rounded to r (s: the segments round an edge) */
export function roundBox(w, h, d, r = 0, s = 1) {
  r = Math.min(r, w / 2, h / 2, d / 2);
  if (r < 0.0008) return boxUV(new THREE.BoxGeometry(w, h, d).toNonIndexed());
  const n = s * 2 + 1, g = new THREE.BoxGeometry(1, 1, 1, n, n, n).toNonIndexed(), P = g.attributes.position, N = g.attributes.normal, hs = 0.5 / n, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i), sx = Math.sign(x), sy = Math.sign(y), sz = Math.sign(z);
    v.set(x - sx * hs, y - sy * hs, z - sz * hs).normalize();
    P.setXYZ(i, (w / 2 - r) * sx + v.x * r, (h / 2 - r) * sy + v.y * r, (d / 2 - r) * sz + v.z * r); N.setXYZ(i, v.x, v.y, v.z);
  }
  return boxUV(g);
}

// ---- surfaces: a grain painted once (a height: light is high), tiled by the metre ------------------------------------
const fill = (x, W, H, c) => { x.fillStyle = c; x.fillRect(0, 0, W, H); };
/** fn(cx, cy) drawn so that what crosses an edge comes back in at the other (the tile has no seam) */
const wrap = (W, H, cx, cy, R, fn) => { for (const ox of [0, cx < R ? W : cx > W - R ? -W : null]) for (const oy of [0, cy < R ? H : cy > H - R ? -H : null]) if (ox != null && oy != null) fn(cx + ox, cy + oy); };
const blots = (x, W, H, r, n, a, R0 = 0.06, R1 = 0.22) => { for (let i = 0; i < n; i++) { const R = W * (R0 + r() * (R1 - R0)), cx = r() * W, cy = r() * H, v = r() < 0.5 ? 0 : 255, al = a * (0.4 + r() * 0.6); wrap(W, H, cx, cy, R, (px, py) => { const g = x.createRadialGradient(px, py, 0, px, py, R); g.addColorStop(0, `rgba(${v},${v},${v},${al})`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); x.fillStyle = g; x.fillRect(px - R, py - R, R * 2, R * 2); }); } };
const specks = (x, W, H, r, n, sz, a) => { for (let i = 0; i < n; i++) { const v = r() < 0.5 ? 0 : 255; x.fillStyle = `rgba(${v},${v},${v},${a * r()})`; const s = 1 + r() * sz; x.fillRect(r() * W, r() * H, s, s); } };
const joints = (x, W, H, nx, ny, a = 0.5, lw = 2) => { x.fillStyle = `rgba(0,0,0,${a})`; for (let i = 0; i < nx; i++) x.fillRect(Math.round(i * W / nx) - lw / 2, 0, lw, H); for (let j = 0; j < ny; j++) x.fillRect(0, Math.round(j * H / ny) - lw / 2, W, lw); x.fillStyle = `rgba(255,255,255,${a * 0.35})`; for (let i = 0; i < nx; i++) x.fillRect(Math.round(i * W / nx) + lw / 2, 0, 1, H); for (let j = 0; j < ny; j++) x.fillRect(0, Math.round(j * H / ny) + lw / 2, W, 1); };
const grain = (x, W, H, r, n, a) => { for (let i = 0; i < n; i++) { const y0 = r() * H, amp = 1 + r() * 5, k = 1 + ((r() * 3) | 0), ph = r() * 6.3, v = r() < 0.6 ? 0 : 255; x.strokeStyle = `rgba(${v},${v},${v},${a * (0.3 + r() * 0.7)})`; x.lineWidth = 0.6 + r() * 1.8; for (const oy of [0, y0 < 8 ? H : y0 > H - 8 ? -H : null]) { if (oy == null) continue; x.beginPath(); for (let px = 0; px <= W; px += 8) { const py = y0 + oy + Math.sin(px / W * 6.2832 * k + ph) * amp; if (px) x.lineTo(px, py); else x.moveTo(px, py); } x.stroke(); } } };
/** kind: { size (m a tile; [x, y] if not square), amt (how much of it shows in the colour), bump, rough, metal, paint } */
const SURF = {
  concrete: { size: 2.4, amt: 0.55, bump: 1.2, rough: 0.72, paint(x, W, H, r) { fill(x, W, H, '#b9b9b9'); blots(x, W, H, r, 60, 0.16); specks(x, W, H, r, 12000, 1.6, 0.16); joints(x, W, H, 1, 1, 0.45, 3); } },
  epoxy: { size: 3, amt: 0.5, bump: 0.35, rough: 0.3, paint(x, W, H, r) { fill(x, W, H, '#c4c4c4'); blots(x, W, H, r, 50, 0.13, 0.08, 0.3); specks(x, W, H, r, 5000, 1.2, 0.08); x.lineCap = 'round'; for (let i = 0; i < 9; i++) { x.strokeStyle = `rgba(0,0,0,${0.05 + r() * 0.07})`; x.lineWidth = 6 + r() * 10; const cx = r() * W, cy = r() * H; x.beginPath(); x.arc(cx, cy, W * (0.2 + r() * 0.5), r() * 6, r() * 6 + 0.5 + r()); x.stroke(); } } },
  asphalt: { size: 2, amt: 0.8, bump: 2.2, rough: 0.92, paint(x, W, H, r) { fill(x, W, H, '#a8a8a8'); blots(x, W, H, r, 40, 0.14); specks(x, W, H, r, 30000, 2.2, 0.3); } },
  paving: { size: 1.2, amt: 0.6, bump: 1.6, rough: 0.85, paint(x, W, H, r) { fill(x, W, H, '#b6b6b6'); blots(x, W, H, r, 30, 0.14); specks(x, W, H, r, 14000, 1.6, 0.2); joints(x, W, H, 2, 4, 0.5, 3); } },
  carpet: { size: 1, amt: 0.75, bump: 1.6, rough: 1, paint(x, W, H, r) { fill(x, W, H, '#b0b0b0'); specks(x, W, H, r, 60000, 1.4, 0.34); blots(x, W, H, r, 14, 0.07); joints(x, W, H, 2, 2, 0.16, 2); } },
  plaster: { size: 2, amt: 0.3, bump: 0.5, rough: 0.92, paint(x, W, H, r) { fill(x, W, H, '#c8c8c8'); blots(x, W, H, r, 40, 0.07); specks(x, W, H, r, 9000, 1.3, 0.09); } },
  panel: { size: [1.2, 2.4], amt: 0.6, bump: 1.2, rough: 0.6, paint(x, W, H, r) { fill(x, W, H, '#c6c6c6'); blots(x, W, H, r, 14, 0.06); specks(x, W, H, r, 3000, 1.2, 0.06); joints(x, W, H, 1, 1, 0.6, 4); } },
  tile: { size: 0.6, amt: 0.6, bump: 1.4, rough: 0.9, paint(x, W, H, r) { fill(x, W, H, '#cdcdcd'); specks(x, W, H, r, 5000, 2.4, 0.14); joints(x, W, H, 1, 1, 0.6, 5); } },
  wood: { size: 1.6, amt: 0.85, bump: 0.6, rough: 0.42, paint(x, W, H, r) { fill(x, W, H, '#b4b4b4'); blots(x, W, H, r, 16, 0.1, 0.1, 0.4); grain(x, W, H, r, 150, 0.28); } },
  planks: { size: 1.8, amt: 0.85, bump: 1.0, rough: 0.5, paint(x, W, H, r) { fill(x, W, H, '#b4b4b4'); for (let j = 0; j < 9; j++) { const v = 150 + r() * 70; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(0, j * H / 9, W, H / 9); } grain(x, W, H, r, 170, 0.24); joints(x, W, H, 0, 9, 0.5, 2); for (let j = 0; j < 9; j++) { x.fillStyle = 'rgba(0,0,0,.5)'; x.fillRect(r() * W, j * H / 9, 2, H / 9); } } },
  slats: { size: 0.8, amt: 0.9, bump: 3, rough: 0.55, paint(x, W, H, r) { fill(x, W, H, '#161616'); for (let i = 0; i < 8; i++) { const v = 170 + r() * 50, g = x.createLinearGradient(i * W / 8, 0, (i + 0.72) * W / 8, 0); g.addColorStop(0, '#666'); g.addColorStop(0.15, `rgb(${v},${v},${v})`); g.addColorStop(0.85, `rgb(${v},${v},${v})`); g.addColorStop(1, '#666'); x.fillStyle = g; x.fillRect(i * W / 8, 0, W / 8 * 0.72, H); } x.save(); x.rotate(PI / 2); x.translate(0, -W); grain(x, H, W, r, 120, 0.2); x.restore(); } },
  cloth: { size: 0.35, amt: 0.7, bump: 1.4, rough: 0.95, paint(x, W, H, r) { fill(x, W, H, '#b8b8b8'); for (let i = 0; i < W; i += 4) { x.fillStyle = `rgba(0,0,0,${0.1 + r() * 0.12})`; x.fillRect(i, 0, 1.5, H); x.fillRect(0, i, W, 1.5); } specks(x, W, H, r, 14000, 1.2, 0.16); } },
  leather: { size: 0.5, amt: 0.6, bump: 1.2, rough: 0.5, paint(x, W, H, r) { fill(x, W, H, '#bdbdbd'); blots(x, W, H, r, 900, 0.22, 0.006, 0.02); specks(x, W, H, r, 6000, 1.2, 0.1); } },
  brushed: { size: 0.6, amt: 0.5, bump: 0.5, rough: 0.34, metal: 0.85, paint(x, W, H, r) { fill(x, W, H, '#c2c2c2'); for (let i = 0; i < 1400; i++) { const v = r() < 0.5 ? 0 : 255; x.fillStyle = `rgba(${v},${v},${v},${0.05 + r() * 0.1})`; x.fillRect(0, r() * H, W, 1); } } },
  perf: { size: 0.3, amt: 0.85, bump: 1.6, rough: 0.5, metal: 0.4, paint(x, W, H) { fill(x, W, H, '#c8c8c8'); x.fillStyle = '#1c1c1c'; for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) { x.beginPath(); x.arc((i + (j % 2 ? 0.5 : 0) + 0.25) * W / 16, (j + 0.5) * H / 16, W / 80, 0, 6.3); x.fill(); } } },
  grass: { size: 2, amt: 0.9, bump: 1.6, rough: 1, paint(x, W, H, r) { fill(x, W, H, '#b0b0b0'); blots(x, W, H, r, 40, 0.2); specks(x, W, H, r, 50000, 2, 0.34); } },
  canvas: { size: 0.7, amt: 0.5, bump: 0.8, rough: 0.9, paint(x, W, H, r) { fill(x, W, H, '#c4c4c4'); blots(x, W, H, r, 20, 0.08); specks(x, W, H, r, 16000, 1.2, 0.12); } },
};

/**
 * The shapes, the surfaces, the batch, the decals, the crowd - put on the kit k (which has own, m, tex, rnd, org, S, R).
 * A shape's last argument o: { r (its edges rounded by; a box only), s, rx, rz (tilted: about its own x after its turn
 * about y, then its own z), ry (a cylinder's turn), sh (false: casts no shadow) }.
 */
export function kitShapes(k) {
  const S = k.S, G = new Map(), TX = new Map(), SM = new Map(), DC = new Map();
  const geo = (key, make) => { let g = G.get(key); if (!g) { g = k.own(make()); G.set(key, g); } return g; };
  const autoR = (w, h, d, o) => (o && o.r != null ? o.r : Math.max(w, h, d) >= 3 || Math.min(w, h, d) < 0.016 ? 0 : Math.min(0.012, Math.min(w, h, d) * 0.22));
  const G_box = (w, h, d, o) => { const r = autoR(w, h, d, o), s = o?.s || (r > 0.04 ? 3 : r > 0.02 ? 2 : 1); return geo(`b|${w}|${h}|${d}|${r}|${s}`, () => roundBox(w, h, d, r, s)); };
  const segs = (s) => (s <= 8 ? Math.max(s * 2, 12) : Math.min(64, Math.max(28, Math.round(s * 1.5))));
  const G_cyl = (r0, r1, h, s, open) => geo(`c|${r0}|${r1}|${h}|${s}|${open ? 1 : 0}`, () => new THREE.CylinderGeometry(r0, r1, h, segs(s), 1, !!open));
  const G_ball = (r, o) => { const n = o?.seg || 32, a = o?.cut || null; return geo(`s|${r}|${n}|${a ? a.join(',') : ''}`, () => (a ? new THREE.SphereGeometry(r, n, Math.round(n * 0.7), a[0], a[1], a[2], a[3]) : new THREE.SphereGeometry(r, n, Math.round(n * 0.7)))); };
  const G_lathe = (pts, seg) => geo(`l|${seg}|${pts.join(';')}`, () => new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(Math.max(0.0001, p[0]), p[1])), seg));
  const G_torus = (R, r, arc) => geo(`t|${R}|${r}|${arc}`, () => new THREE.TorusGeometry(R, r, 12, Math.max(12, Math.round(40 * arc / 6.283)), arc));
  const tube = (pts, r, closed, seg) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0] + k.org.x, p[1] + k.org.y, p[2] + k.org.z)), !!closed, 'catmullrom', 0.5), seg || Math.max(8, pts.length * 7), r, 8, !!closed);
  const turn = (b, ry, o) => { b.rotation.set(o?.rx || 0, ry || 0, o?.rz || 0, 'YXZ'); return b; };
  const mesh = (g, m, x, y, z, sh = true) => { const b = new THREE.Mesh(g, m); b.position.set(x + k.org.x, y + k.org.y, z + k.org.z); b.castShadow = sh; b.receiveShadow = true; S.add(b); return b; };

  k.box = (w, h, d, m, x = 0, y = 0, z = 0, ry = 0, o = null) => turn(mesh(G_box(w, h, d, o), m, x, y, z, o?.sh !== false), ry, o);
  k.cyl = (r0, r1, h, m, x = 0, y = 0, z = 0, seg = 20, o = null) => turn(mesh(G_cyl(r0, r1, h, seg, o?.open), m, x, y, z, o?.sh !== false), o?.ry, o);
  k.ball = (r, m, x = 0, y = 0, z = 0, o = null) => { const b = mesh(G_ball(r, o), m, x, y, z, o?.sh !== false); if (o?.sc) b.scale.set(...o.sc); return turn(b, o?.ry, o); };
  /** turned on a lathe: pts [[radius, height], ...] from the bottom up */
  k.lathe = (pts, m, x = 0, y = 0, z = 0, seg = 36, o = null) => turn(mesh(G_lathe(pts, seg), m, x, y, z, o?.sh !== false), o?.ry, o);
  k.torus = (R, r, m, x = 0, y = 0, z = 0, o = null) => turn(mesh(G_torus(R, r, o?.arc || 6.2832), m, x, y, z, o?.sh !== false), o?.ry, o);
  /** run along a curve through pts [[x, y, z], ...] (a cable, a hose, a rail), r thick */
  k.tube = (pts, r, m, o = null) => { const b = new THREE.Mesh(k.own(tube(pts, r, o?.closed, o?.seg)), m); b.castShadow = o?.sh !== false; b.receiveShadow = true; S.add(b); return b; };
  /** an upright plane facing `face`; flat: lying on the floor (its uv by the metre then, for a surface's grain) */
  k.plane = (w, h, m, x = 0, y = 0, z = 0, face = 0, flat = false) => {
    const g = flat ? geo(`f|${w}|${h}`, () => { const q = new THREE.PlaneGeometry(w, h), u = q.attributes.uv; for (let i = 0; i < u.count; i++) u.setXY(i, u.getX(i) * w, u.getY(i) * h); return q; }) : geo(`p|${w}|${h}`, () => new THREE.PlaneGeometry(w, h));
    const b = mesh(g, m, x, y, z, false); if (flat) b.rotation.x = -PI / 2; else b.rotation.y = face; return b;
  };
  /** the same material lying ON another surface: drawn over it whatever the depth buffer makes of the two (layer: which is on top) */
  k.decal = (m, layer = 1) => { const key = `${m.uuid}|${layer}`; let d = DC.get(key); if (!d) { d = k.own(m.clone()); d.polygonOffset = true; d.polygonOffsetFactor = -1.5 * layer; d.polygonOffsetUnits = -3 * layer; DC.set(key, d); } return d; };
  /** a floor; one laid a few millimetres over another (a painted line, a mat) is a decal on it */
  k.floor = (w, d, m, y = 0, x = 0, z = 0) => { const lay = y > 0 && y < 0.03 ? Math.max(1, Math.round(y * 400)) : 0, b = k.plane(w, d, lay ? k.decal(m, lay) : m, x, y, z, 0, true); if (lay) b.renderOrder = lay; return b; };

  /** a surface with a grain: kind (SURF), its colour; o: { rough, metal, size (m a tile), bump, amt } */
  k.surf = (kind, color, o = {}) => {
    const D = SURF[kind] || SURF.plaster, key = `${kind}|${color}|${o.rough ?? ''}|${o.metal ?? ''}|${o.size ?? ''}|${o.bump ?? ''}|${o.amt ?? ''}`;
    if (SM.has(key)) return SM.get(key);
    const amt = o.amt ?? D.amt, size = [].concat(o.size ?? D.size), tk = `${kind}|${amt}|${size.join('x')}`;
    let T = TX.get(tk);
    if (!T) {
      const W = 512, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); D.paint(x, W, H, k.rnd);
      const a = document.createElement('canvas'); a.width = W; a.height = H; const y = a.getContext('2d'); y.fillStyle = '#ffffff'; y.fillRect(0, 0, W, H); y.globalAlpha = amt; y.globalCompositeOperation = 'multiply'; y.drawImage(c, 0, 0); y.globalCompositeOperation = 'source-over'; y.globalAlpha = amt * 0.5; y.fillStyle = '#ffffff'; y.fillRect(0, 0, W, H);
      const mk = (cv, srgb) => { const t = k.own(new THREE.CanvasTexture(cv)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / size[0], 1 / (size[1] ?? size[0])); t.anisotropy = Math.min(8, k.R.capabilities.getMaxAnisotropy?.() || 1); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
      // (the grain's own average taken out of the colour: a surface asked for in a colour is that colour, not a shade darker)
      const px = y.getImageData(0, 0, W, H).data; let sum = 0, cnt = 0; for (let i = 0; i < px.length; i += 4 * 97) { sum += Math.pow(px[i] / 255, 2.2); cnt++; }
      T = { map: mk(a, true), bump: mk(c, false), gain: Math.min(1.5, 1 / Math.max(0.3, sum / cnt)) }; TX.set(tk, T);
    }
    const m = k.own(new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(T.gain || 1), roughness: o.rough ?? D.rough, metalness: o.metal ?? D.metal ?? 0, map: T.map, bumpMap: T.bump, bumpScale: o.bump ?? D.bump }));
    SM.set(key, m); return m;
  };

  /** a soft shadow lying on the floor under something (rx, rz: its half sizes; a: how dark) -> the mesh (move it with its owner) */
  let blobT = null, blobG = null; const blobMs = new Map();
  const blobM = (a) => {
    if (!blobT) { blobT = k.tex(128, 128, (c, W, H) => { const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.45, 'rgba(0,0,0,.62)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.clearRect(0, 0, W, H); c.fillStyle = g; c.fillRect(0, 0, W, H); }); blobG = k.own(new THREE.PlaneGeometry(1, 1)); }
    const ak = Math.round(a * 20) / 20; let m = blobMs.get(ak);
    if (!m) { m = k.own(new THREE.MeshBasicMaterial({ map: blobT, color: 0x000000, transparent: true, opacity: ak, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 })); m.userData.order = 6; blobMs.set(ak, m); }
    return m;
  };
  k.blob = (x, z, rx = 0.35, rz = rx, a = 0.5, y = 0.004) => {
    const m = blobM(a), b = new THREE.Mesh(blobG, m); b.rotation.x = -PI / 2; b.scale.set(rx * 2, rz * 2, 1); b.position.set(x + k.org.x, y + k.org.y, z + k.org.z); b.renderOrder = 6; S.add(b); return b;
  };

  /**
   * A batch: the same shapes (box, cyl, ball, lathe, torus, tube), nothing returned - all of it welded into one mesh a
   * material by done(). For what stands still. Everything else of the kit is the batch's too (m, surf, glow, screen ...).
   */
  k.batch = () => {
    const by = new Map(), b = Object.create(k);
    const put = (g0, m, x, y, z, ry, o, fresh = false) => {
      const g = fresh ? g0 : g0.index ? g0.toNonIndexed() : g0.clone(); if (fresh && g.index) { const n = g.toNonIndexed(); g.dispose(); return put(n, m, x, y, z, ry, o, true); }
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal' && a !== 'uv') g.deleteAttribute(a);
      if (o?.sc) g.scale(o.sc[0], o.sc[1], o.sc[2]);
      E.set(o?.rx || 0, ry || 0, o?.rz || 0, 'YXZ'); g.applyMatrix4(M4.compose(P0.set(x + k.org.x, y + k.org.y, z + k.org.z), Q.setFromEuler(E), ONE));
      const key = o?.sh === false ? 0 : 1; let L = by.get(m); if (!L) { L = [[], []]; by.set(m, L); } L[key].push(g);
    };
    b.box = (w, h, d, m, x = 0, y = 0, z = 0, ry = 0, o = null) => put(G_box(w, h, d, o), m, x, y, z, ry, o);
    b.cyl = (r0, r1, h, m, x = 0, y = 0, z = 0, seg = 20, o = null) => put(G_cyl(r0, r1, h, seg, o?.open), m, x, y, z, o?.ry, o);
    b.ball = (r, m, x = 0, y = 0, z = 0, o = null) => put(G_ball(r, o), m, x, y, z, o?.ry, o);
    b.blob = (x, z, rx = 0.35, rz = rx, a = 0.5, y = 0.004, ry = 0) => { blobM(a); put(blobG, blobM(a), x, y, z, ry, { rx: -PI / 2, sc: [rx * 2, rz * 2, 1], sh: false }); };
    b.lathe = (pts, m, x = 0, y = 0, z = 0, seg = 36, o = null) => put(G_lathe(pts, seg), m, x, y, z, o?.ry, o);
    b.torus = (R, r, m, x = 0, y = 0, z = 0, o = null) => put(G_torus(R, r, o?.arc || 6.2832), m, x, y, z, o?.ry, o);
    b.tube = (pts, r, m, o = null) => { const O = k.org.clone(); k.org.set(0, 0, 0); const g = tube(pts.map((p) => [p[0] + O.x, p[1] + O.y, p[2] + O.z]), r, o?.closed, o?.seg); put(g, m, 0, 0, 0, 0, o, true); k.org.copy(O); };
    b.done = () => {
      for (const [m, L] of by) L.forEach((list, cast) => { if (!list.length) return; const g = k.own(mergeGeometries(list)); list.forEach((q) => q.dispose()); const me = new THREE.Mesh(g, m); me.castShadow = !!cast && !m.transparent; me.receiveShadow = !m.userData.order; if (m.userData.order) me.renderOrder = m.userData.order; S.add(me); });
      by.clear(); return b;
    };
    return b;
  };

  /**
   * People who are only there (an audience, a paddock's passers-by): real figures, drawn as one mesh a kind.
   * list: [{ x, z, y, face, pose ('sit' | 'talk' | 'cross' | 'hips' | 'phone' | 'photo' | 'record' | 'cheer' | 'tvcam'),
   * kit ('jacket' | 'polo'), cap, top, legs, hair, skin, scale }]; o: { shadow }
   */
  k.crowd = (list, o = {}) => {
    const HS = ['short', 'side', 'quiff', 'swept', 'curly', 'wavy', 'buzz', 'short'], FH = [null, null, 'stubble', 'beard', null];
    const TOP = ['#1d2330', '#2b2e35', '#3a3f4a', '#e7e4dc', '#5b6470', '#283548', '#4a2f2a', '#11151c', '#6f7782', '#2f3b2f'], LEG = ['#16181d', '#22262e', '#2b3140', '#3a3a3a', '#4b4033'];
    const C = new Crowd({}), R0 = Math.random, lift = crowdMaterial().userData.lift.value, g = new THREE.Group(); Math.random = k.rnd;
    try {
      for (const p of list) {
        const v = (k.rnd() * 3) | 0, pose = p.pose || 'talk', spec = { pose, kit: p.kit || (v ? 'jacket' : 'polo'), cap: !!p.cap, hs: HS[(k.rnd() * HS.length) | 0], fh: FH[(k.rnd() * FH.length) | 0], prop: pose === 'photo' ? 'photo' : pose === 'phone' ? 'phone' : pose === 'tvcam' ? 'tvcam' : p.prop || null, q: o.q || 0.36, detail: 0.22 };
        C.add(spec, p.x + k.org.x, p.z + k.org.z, (p.face ?? 0) - PI / 2, { top: p.top || TOP[(k.rnd() * TOP.length) | 0], legs: p.legs || LEG[(k.rnd() * LEG.length) | 0], hair: p.hair, skin: p.skin, acc: p.acc || '#d9dce1', team: p.team }, p.scale || 0.96 + k.rnd() * 0.08, (p.y || 0) + k.org.y, 0);
      }
      C.build(g);
    } catch (e) { console.warn('[cine] crowd', e); } finally { Math.random = R0; crowdMaterial().userData.lift.value = lift; }
    for (const m of C.meshes) { k.own(m.geometry); m.castShadow = o.shadow !== false; m.receiveShadow = false; m.frustumCulled = false; }
    S.add(g); return C;
  };
  return k;
}

/**
 * The glow of what is brighter than the picture can show (a lamp's face, a strip light, the sun on chrome): what is
 * over `threshold` taken out at half size, spread wide, laid back over the picture. A pass for the lens's composer,
 * before its tone mapping.
 */
export class GlowPass extends Pass {
  constructor(strength = 0.5, threshold = 1.5) {
    super(); this.strength = strength; this.threshold = threshold;
    const rt = () => new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, depthBuffer: false }); this.a = rt(); this.b = rt();
    const VS = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
    this.hi = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, th: { value: threshold } }, vertexShader: VS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D t; uniform float th; varying vec2 vUv; void main() { vec3 c = texture2D(t, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(min(c, vec3(8.0)) * smoothstep(th, th * 1.6, l), 1.0); }' });
    this.blur = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, d: { value: new THREE.Vector2() } }, vertexShader: VS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D t; uniform vec2 d; varying vec2 vUv; void main() { vec3 c = texture2D(t, vUv).rgb * 0.227; c += (texture2D(t, vUv + d * 1.38).rgb + texture2D(t, vUv - d * 1.38).rgb) * 0.316; c += (texture2D(t, vUv + d * 3.23).rgb + texture2D(t, vUv - d * 3.23).rgb) * 0.07; gl_FragColor = vec4(c, 1.0); }' });
    this.mix = new THREE.ShaderMaterial({ uniforms: { t: { value: null }, g: { value: null }, k: { value: strength } }, vertexShader: VS, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D t; uniform sampler2D g; uniform float k; varying vec2 vUv; void main() { vec4 c = texture2D(t, vUv); gl_FragColor = vec4(c.rgb + texture2D(g, vUv).rgb * k, c.a); }' });
    this.q = new FullScreenQuad(this.hi);
  }
  setSize(w, h) { this.a.setSize(Math.max(2, w >> 1), Math.max(2, h >> 1)); this.b.setSize(Math.max(2, w >> 1), Math.max(2, h >> 1)); }
  render(R, write, read) {
    const q = this.q, W = this.a.width, H = this.a.height;
    this.hi.uniforms.t.value = read.texture; this.hi.uniforms.th.value = this.threshold; q.material = this.hi; R.setRenderTarget(this.a); q.render(R);
    for (const sp of [1, 2.2, 4.4]) { q.material = this.blur; this.blur.uniforms.t.value = this.a.texture; this.blur.uniforms.d.value.set(sp / W, 0); R.setRenderTarget(this.b); q.render(R); this.blur.uniforms.t.value = this.b.texture; this.blur.uniforms.d.value.set(0, sp / H); R.setRenderTarget(this.a); q.render(R); }
    this.mix.uniforms.t.value = read.texture; this.mix.uniforms.g.value = this.a.texture; this.mix.uniforms.k.value = this.strength; q.material = this.mix; R.setRenderTarget(this.renderToScreen ? null : write); q.render(R);
  }
  dispose() { this.a.dispose(); this.b.dispose(); this.hi.dispose(); this.blur.dispose(); this.mix.dispose(); this.q.dispose(); }
}
