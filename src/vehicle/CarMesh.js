// Procedural modern-era F1 car (forward = +x, y up): lathe monocoque + nose, undercut sidepods,
// engine cover with shark fin, airbox + T-cam pod, halo, 3-element front wing, rear wing with DRS flap and
// beam wing, wishbone suspension, rimmed wheels with compound stripes, mirrors, race number decals.
// Draw-call budget: every static part is merged per material (~38 meshes per car instead of ~68), and beyond
// 110 m the car switches to a 4-mesh LOD (THREE.LOD), so a 23-car field costs a fraction of the submissions.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COMPOUNDS } from './Tyres.js';
import { helmetTexture } from '../world/HelmetDesigns.js';

const carbon = new THREE.MeshStandardMaterial({ color: 0x17181c, roughness: 0.42, metalness: 0.35 });
const carbonMatte = new THREE.MeshStandardMaterial({ color: 0x0f1013, roughness: 0.85, metalness: 0.1 });
const rubber = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0x2a2c31, roughness: 0.35, metalness: 0.85 });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false }); shadowMat.userData.glow = false;
const visorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.15, metalness: 0.9 });
const LOD_FAR = 80;
let DEBRIS = null;
/** the scene's debris system (world/Debris.js): broken parts and shards are thrown into it */
export function setDebris(d) { DEBRIS = d; }
let FIRE = null, CHUNKS = null;
/** the fire / smoke particles (world/Fire.js) and the free halves of split cars (world/Chunks.js) */
export function setFire(f) { FIRE = f; }
export function setChunks(c) { CHUNKS = c; }
const SPLIT_X = -0.62;   // body frame: where a car tears in two - behind the survival cell, ahead of the engine
const _sv = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _m4b = new THREE.Matrix4();
/**
 * Cut a geometry by the plane x = X (its own frame): [front (x >= X), back] as two new non-indexed geometries, every
 * triangle that crosses the plane clipped along it (all attributes interpolated), so the tear is a clean edge.
 */
function cutGeometry(geo, X) {
  const g = geo.index ? geo.toNonIndexed() : geo, names = Object.keys(g.attributes), atts = names.map((n) => g.attributes[n]);
  const sizes = atts.map((a) => a.itemSize), stride = sizes.reduce((a, b) => a + b, 0), posOff = sizes.slice(0, names.indexOf('position')).reduce((a, b) => a + b, 0);
  const vert = (i) => { const v = new Float32Array(stride); let o = 0; atts.forEach((a, k) => { for (let j = 0; j < sizes[k]; j++) v[o + j] = a.array[i * sizes[k] + j]; o += sizes[k]; }); return v; };
  const lerp = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
  const F = [], B = [], n = g.attributes.position.count / 3;
  for (let t = 0; t < n; t++) {
    const V = [vert(t * 3), vert(t * 3 + 1), vert(t * 3 + 2)], d = V.map((v) => v[posOff] - X), inF = d.map((x) => x >= 0), nF = inF.filter(Boolean).length;
    if (nF === 3) { F.push(...V); continue; } if (nF === 0) { B.push(...V); continue; }
    const lone = inF.findIndex((f) => f === (nF === 1)), i1 = (lone + 1) % 3, i2 = (lone + 2) % 3;
    const Q1 = lerp(V[lone], V[i1], d[lone] / (d[lone] - d[i1])), Q2 = lerp(V[lone], V[i2], d[lone] / (d[lone] - d[i2]));
    const L = nF === 1 ? F : B, O = nF === 1 ? B : F;
    L.push(V[lone], Q1, Q2); O.push(Q1, V[i1], V[i2], Q1, V[i2], Q2);
  }
  const build = (list) => {
    const ng = new THREE.BufferGeometry(); let o = 0;
    atts.forEach((a, k) => { const sz = sizes[k], arr = new Float32Array(list.length * sz); list.forEach((v, j) => { for (let q = 0; q < sz; q++) arr[j * sz + q] = v[o + q]; }); ng.setAttribute(names[k], new THREE.BufferAttribute(arr, sz)); o += sz; });
    ng.computeBoundingSphere(); return ng;
  };
  return [F.length ? build(F) : null, B.length ? build(B) : null];
}
const _wp = new THREE.Vector3();

// Real dimensions (2022-25 regulations): 720 mm tyres on 18 inch rims, 305 mm wide at the front and 405 mm at the
// rear, 2.0 m over the tyres, 3.6 m wheelbase, 5.66 m long, 0.97 m tall, rear wing top at 0.9 m.
const TYRE_WF = 0.305, TYRE_WR = 0.405, HUB_ZF = 1.0 - TYRE_WF / 2, HUB_ZR = 1.0 - TYRE_WR / 2;
const FRONT_AXLE = 1.8, REAR_AXLE = -1.8, CG_X = 0.16;   // the physics has its centre of gravity 1.96 m behind the front axle

// shared geometries
const tyreF = new THREE.CylinderGeometry(0.36, 0.36, TYRE_WF, 28); tyreF.rotateX(Math.PI / 2);
const tyreR = new THREE.CylinderGeometry(0.36, 0.36, TYRE_WR, 28); tyreR.rotateX(Math.PI / 2);
const shoulder = new THREE.TorusGeometry(0.31, 0.055, 8, 28);
const rimF = new THREE.CylinderGeometry(0.2286, 0.2286, TYRE_WF + 0.02, 20); rimF.rotateX(Math.PI / 2);
const rimR = new THREE.CylinderGeometry(0.2286, 0.2286, TYRE_WR + 0.02, 20); rimR.rotateX(Math.PI / 2);
const stripeGeo = new THREE.TorusGeometry(0.335, 0.016, 6, 32);
const helmetGeo = new THREE.SphereGeometry(0.145, 28, 20);
const faceGeo = new THREE.CircleGeometry(0.23, 20);
const shadowGeo = new THREE.PlaneGeometry(5.6, 2.3); shadowGeo.rotateX(-Math.PI / 2); shadowGeo.translate(0, 0.01, 0);
/** one rubber geometry per axle: tyre + both shoulders (was three meshes) */
const rubberGeo = (front) => {
  const width = front ? TYRE_WF : TYRE_WR;
  const s1 = shoulder.clone(); s1.translate(0, 0, width / 2 - 0.02); const s2 = shoulder.clone(); s2.translate(0, 0, -width / 2 + 0.02);
  return mergeGeometries([front ? tyreF.clone() : tyreR.clone(), s1, s2]);
};
const rubberF = rubberGeo(true), rubberR = rubberGeo(false);
const wheelMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0.3 });
// a wheel with its tyre gone: bare machined metal (a touch of its own light so it reads silver at night too)
const bareRimMat = new THREE.MeshStandardMaterial({ color: 0xe4e7ec, roughness: 0.3, metalness: 0.45, emissive: 0x50545b, emissiveIntensity: 0.55 });
// a tyre coming apart: the rim's flanges, the torn band of carcass left on it, a strip of tread hinged at one end
const flangeGeo = new THREE.TorusGeometry(0.232, 0.014, 6, 28);
const carcassGeo = new THREE.TorusGeometry(0.243, 0.028, 6, 24, Math.PI * 1.3);
const tatterGeo = new THREE.BoxGeometry(0.42, 0.02, 1); tatterGeo.translate(0.21, 0, 0);
// where the tread has peeled away: the carcass's cords showing through, a pale band on the tyre
const cordGeo = new THREE.TorusGeometry(0.352, 0.02, 4, 24, Math.PI * 0.8);
const cordMat = new THREE.MeshStandardMaterial({ color: 0x8a8074, roughness: 0.95 });
const farMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.3 });   // the far LOD of every car
const swMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.2 });   // the steering wheel (plate, grips, gloves)
/** a copy of a geometry in one vertex colour (for merging differently coloured parts into one mesh) */
function painted(src, hex) {
  const g = src.index ? src.toNonIndexed() : src.clone(), c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
}
const SHARED_GEO = new Set([tyreF, tyreR, shoulder, rimF, rimR, stripeGeo, helmetGeo, faceGeo, shadowGeo, rubberF, rubberR, flangeGeo, carcassGeo, tatterGeo, cordGeo]);
const SHARED_MAT = new Set([carbon, carbonMatte, rubber, rimMat, shadowMat, visorMat, wheelMat, farMat, bareRimMat, cordMat, swMat]);
/** one wheel as a single vertex-coloured geometry: tyre, rim and the compound stripe on the outer sidewall (side: -1 left, +1 right) */
function wheelGeo(front, side, stripeHex) {
  const paint = (src, hex) => {
    const g = src.index ? src.toNonIndexed() : src.clone(); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g;
  };
  const width = front ? TYRE_WF : TYRE_WR;
  const tyre = paint(front ? rubberF : rubberR, 0x141414), rim = paint(front ? rimF : rimR, 0x2a2c31);
  const st = stripeGeo.clone(); st.translate(0, 0, side * (width / 2 - 0.04)); const stripe = paint(st, stripeHex);
  const g = mergeGeometries([tyre, rim, stripe]);
  g.userData.stripe = [tyre.attributes.position.count + rim.attributes.position.count, stripe.attributes.position.count];
  return g;
}

let rimTex = null;
function rimTexture() {
  if (rimTex) return rimTex;
  const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = '#1b1d22'; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#9aa0ad'; ctx.lineWidth = 6;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; ctx.beginPath(); ctx.moveTo(64 + Math.cos(a) * 14, 64 + Math.sin(a) * 14); ctx.lineTo(64 + Math.cos(a) * 58, 64 + Math.sin(a) * 58); ctx.stroke(); }
  ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.arc(64, 64, 12, 0, Math.PI * 2); ctx.fill();
  rimTex = new THREE.CanvasTexture(c); rimTex.colorSpace = THREE.SRGBColorSpace; return rimTex;
}
let faceMat = null, faceBareMat = null;
/** the wheel face with no tyre round it: bright machined spokes */
function bareFaceTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = '#8c929b'; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#f4f6f8'; ctx.lineWidth = 10;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; ctx.beginPath(); ctx.moveTo(64 + Math.cos(a) * 14, 64 + Math.sin(a) * 14); ctx.lineTo(64 + Math.cos(a) * 60, 64 + Math.sin(a) * 60); ctx.stroke(); }
  ctx.strokeStyle = '#dfe2e7'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(64, 64, 59, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#f4f5f7'; ctx.beginPath(); ctx.arc(64, 64, 13, 0, Math.PI * 2); ctx.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function numberTexture(num, color, bg) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128; const ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = color; ctx.font = 'italic 900 88px "Segoe UI", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(num), 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** box geometry placed in car space (rotation about z first, then translation) */
function bxg(w, h, d, x, y, z, rz = 0) { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); g.translate(x, y, z); return g; }
function strutGeo(a, b, r) {
  const d = new THREE.Vector3().subVectors(b, a); const l = d.length();
  const g = new THREE.CylinderGeometry(r, r, l, 6); g.translate(0, l / 2, 0);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  g.applyQuaternion(q); g.translate(a.x, a.y, a.z); return g;
}
/** Lathe body: profile of [x along car, radius] pairs, revolved around the car axis, squashed to an ellipse. */
function latheGeo(profile, yScale, zScale, yBase) {
  const pts = profile.map(([x, r]) => new THREE.Vector2(r, x));
  const g = new THREE.LatheGeometry(pts, 24); g.rotateZ(-Math.PI / 2);   // revolve axis y -> x
  g.scale(1, yScale, zScale); g.translate(0, yBase, 0); return g;
}
const merged = (geos, mat) => new THREE.Mesh(mergeGeometries(geos.map((p) => (p.index ? p.toNonIndexed() : p))), mat);

// ---- real-car proportions. The parts below are laid out by eye on a body 6.25 m long and 1.3 m tall; the remap
// pulls them onto the real envelope: the cabin stays where it is, the overhangs are shortened (front axle to nose
// 1.25 m, rear axle to wing 0.8 m), and everything above the cockpit sides comes down to a 0.97 m roll hoop.
const gx = (x) => (x >= 1.75 ? FRONT_AXLE + (x - 1.75) * 0.85 : x >= 0 ? x * (FRONT_AXLE / 1.75) : x >= REAR_AXLE ? x : REAR_AXLE + (x - REAR_AXLE) * 0.66);
const sx = (x) => (x >= 1.75 ? 0.85 : x >= 0 ? FRONT_AXLE / 1.75 : x >= REAR_AXLE ? 1 : 0.66);
const yMap = (pivot, k, top = Infinity, k2 = k) => ({
  g: (y) => (y <= pivot ? y : y <= top ? pivot + (y - pivot) * k : pivot + (top - pivot) * k + (y - top) * k2),
  s: (y) => (y <= pivot ? 1 : y <= top ? k : k2),
});
// body: cockpit sides stay at 0.55-0.65 m, the halo ring lands at 0.86 m, the roll hoop / T-cam at 0.97 m
const Y_BODY = yMap(0.55, 0.69, 1.0, 0.344), Y_WING = yMap(0.41, 0.77);
/** remap a mesh's vertices (in the body frame: its own position is the only transform allowed) and its normals */
function fitMesh(mesh, Y) {
  const p = mesh.position, pos = mesh.geometry.attributes.position, nor = mesh.geometry.attributes.normal;
  const px = p.x, py = p.y, nx0 = gx(px), ny0 = Y.g(py);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + px, y = pos.getY(i) + py;
    pos.setXY(i, gx(x) - nx0, Y.g(y) - ny0);
    if (nor) { const a = nor.getX(i) / sx(x), b = nor.getY(i) / Y.s(y), c = nor.getZ(i), l = Math.hypot(a, b, c) || 1; nor.setXYZ(i, a / l, b / l, c / l); }
  }
  p.x = nx0; p.y = ny0; pos.needsUpdate = true; mesh.geometry.computeBoundingBox(); mesh.geometry.computeBoundingSphere();
}

export class CarMesh {
  constructor(color, compound = 'SOFT', opts = {}) {
    this.group = new THREE.LOD(); this.group.userData.isCar = true;
    const body = new THREE.Group(); this.body = body;
    const col = new THREE.Color(color);
    const col2 = new THREE.Color(opts.color2 || col.clone().offsetHSL(0, -0.1, -0.3));
    const livery = new THREE.MeshStandardMaterial({ color: col, roughness: 0.32, metalness: 0.35, envMapIntensity: 0.9 });
    const accent = new THREE.MeshStandardMaterial({ color: col2, roughness: 0.35, metalness: 0.35 });
    this.livery = livery; this.accent = accent;
    const P = { livery: [], accent: [], carbon: [], matte: [], visor: [] };   // static parts, merged per material

    // ---- floor + bargeboards + wishbones + ducts (carbon)
    const floorShape = new THREE.Shape();
    floorShape.moveTo(-2.2, -0.55); floorShape.lineTo(1.1, -0.75); floorShape.lineTo(1.7, -0.45); floorShape.lineTo(1.7, 0.45); floorShape.lineTo(1.1, 0.75); floorShape.lineTo(-2.2, 0.55); floorShape.lineTo(-2.2, -0.55);
    const floor = new THREE.ExtrudeGeometry(floorShape, { depth: 0.05, bevelEnabled: false }); floor.rotateX(Math.PI / 2); floor.translate(0, 0.09, 0); P.carbon.push(floor);
    for (const z of [0.78, -0.78]) P.carbon.push(bxg(0.5, 0.28, 0.02, 1.05, 0.22, z));
    const wb = (x, z, front) => {
      const hub = new THREE.Vector3(x, 0.36, z); const inZ = Math.sign(z) * (front ? 0.3 : 0.42);
      P.carbon.push(strutGeo(new THREE.Vector3(x + 0.22, 0.5, inZ), hub.clone().setY(0.5), 0.016), strutGeo(new THREE.Vector3(x - 0.22, 0.5, inZ), hub.clone().setY(0.5), 0.016));
      P.carbon.push(strutGeo(new THREE.Vector3(x + 0.18, 0.2, inZ), hub.clone().setY(0.22), 0.016), strutGeo(new THREE.Vector3(x - 0.18, 0.2, inZ), hub.clone().setY(0.22), 0.016));
      P.carbon.push(strutGeo(new THREE.Vector3(x, 0.62, inZ), hub.clone().setY(0.25), 0.014));
      P.carbon.push(bxg(0.34, 0.5, 0.06, x, 0.36, z - Math.sign(z) * 0.24));   // brake duct
    };
    wb(1.75, HUB_ZF, true); wb(1.75, -HUB_ZF, true); wb(-1.8, HUB_ZR, false); wb(-1.8, -HUB_ZR, false);
    for (const z of [0.62, -0.62]) { P.carbon.push(bxg(0.03, 0.03, 0.22, 0.95, 0.78, z)); P.visor.push(bxg(0.06, 0.09, 0.16, 0.93, 0.8, z * 1.226)); }   // mirror stalks + mirrors

    // ---- monocoque + nose (lathe), livery
    P.livery.push(latheGeo([[3.15, 0.045], [2.8, 0.08], [2.3, 0.13], [1.75, 0.2], [1.35, 0.27], [0.6, 0.31], [-0.1, 0.31], [-0.7, 0.28], [-1.4, 0.22], [-2.0, 0.13], [-2.35, 0.06], [-2.45, 0.02]], 0.78, 1.15, 0.42));
    P.accent.push(bxg(0.55, 0.06, 0.2, 2.55, 0.16, 0));                       // nose vanes / pylons
    for (const z of [0.72, -0.72]) {                                          // sidepods with undercut
      const sp = new THREE.BoxGeometry(1.85, 0.34, 0.5); sp.rotateX(Math.sign(z) * 0.08); sp.translate(-0.4, 0.4, z); P.livery.push(sp);
      P.livery.push(bxg(1.5, 0.16, 0.42, -0.45, 0.24, z * 0.95));
      P.matte.push(bxg(0.06, 0.28, 0.4, 0.55, 0.42, z));                      // inlet
      P.accent.push(bxg(1.2, 0.05, 0.56, -0.7, 0.58, z));                     // accent stripe along the sidepod top
    }
    P.accent.push(bxg(1.15, 0.36, 0.03, -1.55, 0.86, 0), bxg(0.3, 0.12, 0.03, -2.1, 0.66, 0));   // engine cover spine + shark fin
    P.livery.push(bxg(0.5, 0.3, 0.36, -0.3, 1.02, 0));                                        // airbox
    P.matte.push(bxg(0.06, 0.24, 0.3, -0.03, 1.02, 0), bxg(0.12, 0.1, 0.3, -0.28, 1.24, 0));   // airbox lip + T-cam pod
    const tcamTab = new THREE.Mesh(bxg(0.13, 0.03, 0.08, -0.28, 1.3, 0), new THREE.MeshStandardMaterial({ color: opts.tcamColor || 0xffd400, roughness: 0.5 })); body.add(tcamTab);

    // ---- cockpit + driver
    P.matte.push(bxg(0.9, 0.12, 0.62, 0.2, 0.64, 0), bxg(0.4, 0.14, 0.5, -0.05, 0.72, 0));   // cockpit rim, shoulders / headrest
    // (the driver's own helmet design if they have one - world/HelmetDesigns.js - else one colour; u = 0 turned to face forward)
    const hmap = opts.driver ? helmetTexture(opts.driver, { size: 512 }) : null;
    const helmet = new THREE.Mesh(helmetGeo, new THREE.MeshStandardMaterial(hmap ? { map: hmap, roughness: 0.22, metalness: 0.12 } : { color: new THREE.Color(opts.helmet || '#ffffff'), roughness: 0.25, metalness: 0.15 }));
    if (hmap) helmet.rotation.y = Math.PI;
    helmet.position.set(0.12, 0.85, 0); body.add(helmet); this.helmet = helmet;
    P.visor.push(bxg(0.09, 0.07, 0.2, 0.25, 0.86, 0));
    // halo (one mesh, toggled with H)
    const ring = new THREE.TorusGeometry(0.46, 0.036, 8, 28); ring.rotateX(Math.PI / 2); ring.scale(1.3, 1, 1); ring.translate(0.15, 0.99, 0);
    this.halo = merged([ring, bxg(0.06, 0.44, 0.045, 0.73, 0.79, 0, -0.32), bxg(0.05, 0.3, 0.05, -0.42, 0.9, 0.4), bxg(0.05, 0.3, 0.05, -0.42, 0.9, -0.4)], carbon); body.add(this.halo);

    // ---- front wing (3 elements + endplates); the endplates keep their own meshes (damage visuals)
    this.frontWing = new THREE.Group();
    this.frontWing.add(merged([bxg(0.55, 0.035, 1.95, 2.95, 0.09, 0), bxg(0.22, 0.025, 1.8, 2.56, 0.23, 0, 0.5)], livery));
    this.frontWing.add(new THREE.Mesh(bxg(0.3, 0.03, 1.9, 2.72, 0.16, 0, 0.32), accent));
    this.frontWing.add(merged([bxg(0.08, 0.14, 0.05, 2.45, 0.2, 0.22), bxg(0.08, 0.14, 0.05, 2.45, 0.2, -0.22)], carbon));
    const endplate = (side) => { const m = merged([new THREE.BoxGeometry(0.9, 0.3, 0.025), bxg(0.5, 0.02, 0.18, 0.1, -0.14, -side * 0.09)], carbon); m.position.set(2.75, 0.22, side * 0.985); return m; };   // footplate inboard: the wing is 2.0 m wide, no more
    this.fwL = endplate(1); this.fwR = endplate(-1); this.frontWing.add(this.fwL, this.fwR); body.add(this.frontWing);

    // ---- rear wing (main plane, DRS flap, endplates, beam wing, pylon)
    this.rearWing = new THREE.Group();
    this.rearWing.add(new THREE.Mesh(bxg(0.5, 0.04, 1.02, -2.55, 0.9, 0, 0.28), livery));
    this.drs = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 1.0), accent); this.drs.position.set(-2.78, 1.03, 0); this.drs.rotation.z = 0.5; this.rearWing.add(this.drs);
    this.rearWing.add(merged([bxg(0.86, 0.62, 0.025, -2.6, 0.72, 0.53), bxg(0.86, 0.62, 0.025, -2.6, 0.72, -0.53), bxg(0.32, 0.03, 0.9, -2.45, 0.58, 0, 0.25), bxg(0.1, 0.42, 0.06, -2.35, 0.5, 0)], carbon));
    body.add(this.rearWing);
    // rear light + diffuser
    this.rearLight = new THREE.Mesh(bxg(0.06, 0.14, 0.3, -2.62, 0.4, 0), new THREE.MeshStandardMaterial({ color: 0x300000, emissive: 0xff2020, emissiveIntensity: 2 })); body.add(this.rearLight);
    P.matte.push(bxg(0.5, 0.18, 1.1, -2.15, 0.16, 0));

    // ---- the merged static meshes
    body.add(merged(P.carbon, carbon), merged(P.matte, carbonMatte), merged(P.livery, livery), merged(P.accent, accent), merged(P.visor, visorMat));

    // ---- race number decals (engine cover sides), one mesh
    if (opts.number != null) {
      const tex = numberTexture(opts.number, '#' + col2.getHexString(), '#' + col.getHexString());
      const planes = [];
      for (const z of [0.3, -0.3]) { const p = new THREE.PlaneGeometry(0.34, 0.34); p.rotateX(-Math.sign(z) * 0.5); if (z < 0) p.rotateY(Math.PI); p.translate(-1.0, 0.62, z); planes.push(p); }
      const dm = new THREE.MeshBasicMaterial({ map: tex }); dm.userData.glow = false; body.add(merged(planes, dm));
    }

    // ---- everything so far onto the real car's envelope (see gx / yMap above); the rear wing keeps more of its height
    body.traverse((o) => {
      if (!o.isMesh || o === helmet || o === this.drs) return;
      let wing = false; for (let q = o; q; q = q.parent) if (q === this.rearWing) wing = true;
      fitMesh(o, wing ? Y_WING : Y_BODY);
    });
    this.drs.geometry.scale(0.66, 1, 1); this.drs.position.set(gx(-2.78), Y_WING.g(1.03), 0);
    helmet.scale.setScalar(0.9); helmet.position.set(gx(0.12), 0.755, 0);
    // the steering wheel in front of the driver (seen from the cockpit and through the visor): a carbon plate, its two
    // grips, the display lit, the driver's gloves on it; tilted back toward them, turning with the steering
    // (two meshes: the plate, grips and gloves vertex-coloured in one, the lit display and its buttons in the other)
    const swTilt = new THREE.Group(), sw = new THREE.Group(); swTilt.add(sw);
    const solid = [painted(new THREE.BoxGeometry(0.03, 0.12, 0.2), 0x17181c)], lit = [];
    for (const z of [-0.125, 0.125]) {
      solid.push(painted(new THREE.BoxGeometry(0.045, 0.12, 0.05).translate(0, -0.005, z), 0x0f1013));
      solid.push(painted(new THREE.BoxGeometry(0.08, 0.085, 0.07).translate(-0.025, 0.005, z * 1.02), opts.glove || col2));
    }
    lit.push(painted(new THREE.PlaneGeometry(0.085, 0.045).rotateY(-Math.PI / 2).translate(-0.017, 0.02, 0), 0x2bb6ff));
    for (const [y, z, c] of [[-0.035, -0.06, 0xff3b30], [-0.035, 0.06, 0x30d158], [0.045, -0.07, 0xffd60a], [0.045, 0.07, 0xffffff]]) lit.push(painted(new THREE.CylinderGeometry(0.008, 0.008, 0.01, 10).rotateZ(Math.PI / 2).translate(-0.017, y, z), c));
    sw.add(new THREE.Mesh(mergeGeometries(solid), swMat));
    this.wheelDisp = new THREE.MeshBasicMaterial({ vertexColors: true }); sw.add(new THREE.Mesh(mergeGeometries(lit), this.wheelDisp));
    swTilt.position.set(helmet.position.x + 0.4, 0.71, 0); swTilt.rotation.z = 0.25; body.add(swTilt); this.wheelSteer = sw;
    // (only ever seen from close by: not drawn beyond a few car lengths - see detail())
    this.details = [swTilt]; this._near = true;
    body.position.x = CG_X;

    // ---- wheels (hub steers, wheel spins): tyre + rim + compound stripe in one vertex-coloured mesh, and the spoked
    //      hub face: 2 draw calls a wheel
    this.wheels = [];
    if (!faceMat) { faceMat = new THREE.MeshStandardMaterial({ map: rimTexture(), roughness: 0.4, metalness: 0.6 }); SHARED_MAT.add(faceMat); }
    for (const [x, z, front] of [[FRONT_AXLE, HUB_ZF, true], [FRONT_AXLE, -HUB_ZF, true], [REAR_AXLE, HUB_ZR, false], [REAR_AXLE, -HUB_ZR, false]]) {
      const hub = new THREE.Group(); hub.position.set(x, 0.36, z);
      const width = front ? TYRE_WF : TYRE_WR;
      const w = new THREE.Mesh(wheelGeo(front, Math.sign(z), COMPOUNDS[compound].color), wheelMat);
      const face = new THREE.Mesh(faceGeo, faceMat); face.position.z = Math.sign(z) * (width / 2 + 0.005); if (z < 0) face.rotation.y = Math.PI;
      hub.add(w, face); body.add(hub);
      this.wheels.push({ hub, mesh: w, face, front, side: Math.sign(z), state: 0 });
    }
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat); body.add(this.shadow);   // blob shadow
    this.spin = 0; this.lost = {}; this.mangled = false;

    // ---- far LOD: the whole car baked into ONE vertex-coloured mesh (livery, accent, carbon) + its blob shadow:
    //      2 draw calls for a car beyond 80 m
    body.updateMatrixWorld(true);
    const far = new THREE.Group(), parts = [], cLiv = livery.color, cAcc = accent.color, cDark = new THREE.Color(0x17181c);
    body.traverse((o) => {
      if (!o.isMesh || o.material === shadowMat || (o.material.isMeshBasicMaterial && o.material.map)) return;   // no shadow / number decals in the far LOD
      let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
      for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
      const c = o.material === livery ? cLiv : o.material === accent || o.material === tcamTab.material ? cAcc : cDark, n = g.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      g.setAttribute('color', new THREE.BufferAttribute(a, 3)); parts.push(g);
    });
    this.shadowFar = new THREE.Mesh(shadowGeo, shadowMat);
    far.add(new THREE.Mesh(mergeGeometries(parts), farMat), this.shadowFar); this.far = far;
    this.group.addLevel(body, 0); this.group.addLevel(far, LOD_FAR);
  }

  /** the close-up details shown only within 15 m of the camera (cam: world position) */
  detail(cam) {
    const p = this.group.position, near = (p.x - cam.x) ** 2 + (p.y - cam.y) ** 2 + (p.z - cam.z) ** 2 < 225;
    if (near !== this._near) { this._near = near; for (const o of this.details) o.visible = near; }
  }

  /** free this car's own geometries, materials and number texture (the module-level shared ones stay) */
  dispose() {
    this.group.traverse((o) => {
      if (!o.isMesh) return;
      if (!SHARED_GEO.has(o.geometry)) o.geometry.dispose();
      if (!SHARED_MAT.has(o.material)) { o.material.map?.dispose(); o.material.dispose(); }
    });
  }

  setCompound(c) {
    const col = new THREE.Color(COMPOUNDS[c].color);
    for (const w of this.wheels) {
      const g = w.mesh.geometry, a = g.attributes.color, [start, count] = g.userData.stripe;
      for (let i = start; i < start + count; i++) a.setXYZ(i, col.r, col.g, col.b);
      a.needsUpdate = true;
    }
  }
  setHalo(v) { this.halo.visible = v; }   // (the far LOD keeps it: at 80 m+ it is a few pixels)

  /** world position of one of this car's parts (last frame's transforms: one frame late is invisible) */
  _wpos(o) { return o.getWorldPosition(_wp); }
  _drop(kind, o, car, color, kick) {
    if (!DEBRIS) return; const p = this._wpos(o); const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel();
    DEBRIS.part(kind, p.x, Math.max(0.2, p.y), p.z, vx, vz, color, kick);
  }
  /** the big one: the bodywork crumples and is scorched (which parts come off is the physics' call: wheelK events, wing damage) */
  _mangle(car) {
    if (this.mangled) return; this.mangled = true;
    this.livery.color.multiplyScalar(0.62); this.accent.color.multiplyScalar(0.62);
    this.body.scale.set(0.96, 1, 1.03); this.body.rotation.x = (Math.random() - 0.5) * 0.08;   // crumpled, twisted tub (height kept: the physics' contact points are on it)
    this.halo.rotation.z = (Math.random() - 0.5) * 0.2;
    if (DEBRIS) { const [vx, vz] = car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 24, this.livery.color.getHex()); }
  }
  /**
   * The car torn in two (Car.splitApart): everything aft of SPLIT_X - the rear wing, the rear wheels, the back of the
   * tub and engine cover (the merged meshes are cut triangle by triangle) - moves into a group of its own that
   * world/Chunks.js flies as a rigid body; this mesh keeps the front half. The far LOD (a whole car) goes.
   */
  split(car) {
    if (this.splitDone || !CHUNKS) return; this.splitDone = true;
    const body = this.body; this.group.updateMatrixWorld(true);
    // the half's centre (body frame) and the group that carries it
    const C = new THREE.Vector3((SPLIT_X - 2.9) / 2, 0.45, 0), root = new THREE.Group(); root.name = 'car-half';
    body.localToWorld(root.position.copy(C)); body.getWorldQuaternion(root.quaternion); root.updateMatrixWorld(true);
    const inv = _m4b.copy(root.matrixWorld).invert();
    const adopt = (o) => { o.updateMatrixWorld(true); _m4.multiplyMatrices(inv, o.matrixWorld); o.parent?.remove(o); _m4.decompose(o.position, o.quaternion, o.scale); root.add(o); };
    // whole parts
    adopt(this.rearWing); adopt(this.rearLight);
    for (const w of this.wheels) if (!w.front) { adopt(w.hub); w.gone = true; }
    // the merged static meshes, cut in two
    const cut = [];
    for (const o of body.children) if (o.isMesh && o !== this.helmet && o !== this.halo && o !== this.shadow && o.geometry.attributes.position) cut.push(o);
    for (const o of cut) {
      const [front, rear] = cutGeometry(o.geometry, (SPLIT_X - o.position.x) / (o.scale.x || 1));
      if (!rear) continue;
      const back = new THREE.Mesh(rear, o.material); back.position.copy(o.position); back.rotation.copy(o.rotation); back.scale.copy(o.scale); back.userData.ownGeo = true; body.add(back); adopt(back);
      const old = o.geometry; if (front) o.geometry = front; else o.visible = false; if (!SHARED_GEO.has(old) && old !== o.geometry) old.dispose();
    }
    root.traverse((m) => { if (m.isMesh && m.userData.ownGeo == null) m.userData.ownGeo = !SHARED_GEO.has(m.geometry); });
    // (no whole-car far LOD any more)
    if (this.far) { const L = this.group.levels, i = L.findIndex((l) => l.object === this.far); if (i >= 0) L.splice(i, 1); this.group.remove(this.far); this.far = null; this.body.visible = true; }
    // its motion: the car's, plus the tear (backwards and up) and a tumble
    const v = car.v ? car.v : [...car.worldVel().slice(0, 1), 0, car.worldVel()[1]], c = Math.cos(car.th), s = Math.sin(car.th), r = () => Math.random() - 0.5;
    this.half = root;   // (the rear half: its flight is remembered for the news replay, main.js)
    CHUNKS.add(root, [v[0] - c * 4, (v[1] || 0) + 2 + Math.random() * 3, v[2] - s * 4], [r() * 6, r() * 8, r() * 6], [1.15, 0.45, 0.85], 260);
    if (FIRE) FIRE.add((out) => { out.set(0.7, 0.2, 0).applyMatrix4(root.matrixWorld); return true; }, 'smoke', 0.9);
    if (DEBRIS) { const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 30, this.livery.color.getHex()); }
  }
  /** a fire / smoke source on this car (body frame point), alive while the car's mesh is */
  _source(kind, bx, by, k, car) {
    if (!FIRE) return; if (kind === 'fire') car._burned = true;   // (the news replays it: ui/NewsBroadcast.js)
    FIRE.add((out) => { if (!this.group.parent) return false; this.body.localToWorld(out.set(bx, by, 0)); return true; }, kind, k, () => car.speed < 1 || car.wreck);
  }
  /** the parts of a tyre coming apart, built the first time this wheel punctures (hidden until then) */
  _buildRuin(w) {
    const R = new THREE.Group(), width = w.front ? TYRE_WF : TYRE_WR, rnd = Math.random;
    const rim = new THREE.Group(); rim.add(new THREE.Mesh(w.front ? rimF : rimR, bareRimMat));
    for (const s of [-1, 1]) { const f = new THREE.Mesh(flangeGeo, bareRimMat); f.position.z = s * (width / 2 + 0.005); rim.add(f); }
    const carcass = new THREE.Mesh(carcassGeo, rubber); carcass.rotation.z = rnd() * 6.28; carcass.scale.z = 0.3 * width / 0.028;
    const tatters = [];
    // (each strip two pieces: the half still stuck to the tyre and a loose end that curls back and whips)
    for (let i = 0; i < 6; i++) {
      const pivot = new THREE.Group(), a = new THREE.Mesh(tatterGeo, rubber), joint = new THREE.Group(), b = new THREE.Mesh(tatterGeo, rubber);
      joint.add(b); pivot.add(a, joint);
      pivot.userData = { a: i * 1.05 + rnd() * 0.6, z: (rnd() - 0.5) * width * 0.5, len: 0.36 + rnd() * 0.4, wd: 0.08 + rnd() * 0.12, base: 0.05 + rnd() * 0.25, curl: -0.3 - rnd() * 0.7, f: 16 + rnd() * 14, ph: rnd() * 6.28, tw: (rnd() - 0.5) * 1.6, seg: [a, joint, b] };
      a.scale.z = b.scale.z = pivot.userData.wd; R.add(pivot); tatters.push(pivot);
    }
    const cords = [0, 1].map((j) => { const m = new THREE.Mesh(cordGeo, cordMat); m.rotation.z = j * 3.4 + rnd(); m.position.z = (rnd() - 0.5) * width * 0.3; m.scale.z = 0.28 * width / 0.02; R.add(m); return m; });
    R.add(rim, carcass); R.visible = false; R.userData = { rim, carcass, tatters, cords };
    w.hub.add(R); w.ruin = R;
    if (!faceBareMat) { faceBareMat = new THREE.MeshStandardMaterial({ map: bareFaceTexture(), roughness: 0.35, metalness: 0.3, emissive: 0xffffff, emissiveMap: bareFaceTexture(), emissiveIntensity: 0.22 }); SHARED_MAT.add(faceBareMat); }
  }
  /**
   * A punctured tyre, in stages as it comes apart (P: Failures' punctP, 0 -> 1 with the distance driven on it; -1 a
   * sound tyre): flat (to 0.35) - squashed at the bottom; delaminating (to 0.8) - the tread peeling off in strips that
   * flail as the wheel turns, the tyre sagging lower; coming off (to 1) - the tyre gone but for a torn band of carcass
   * and a few strips, the bare rim on the road; shredded (1) - the bare silver rim and the odd tatter.
   */
  _tyre(w, P, car, dt) {
    if (P < 0) {
      if (w.state) { w.state = 0; w.mesh.visible = true; w.face.material = faceMat; w.hub.scale.set(1, 1, 1); if (w.ruin) w.ruin.visible = false; }
      return;
    }
    if (!w.ruin) this._buildRuin(w);
    const R = w.ruin, U = R.userData, bare = P >= 0.8, st = P < 0.35 ? 1 : P < 0.8 ? 2 : P < 1 ? 3 : 4;
    if (st !== w.state) {
      w.state = st; w.mesh.visible = !bare; R.visible = st > 1; U.rim.visible = bare; U.carcass.visible = bare;
      U.cords[1].visible = st === 3;
      w.face.material = bare ? faceBareMat : faceMat;
    }
    const sq = bare ? 1 : P < 0.35 ? 0.82 : 0.82 - 0.08 * (P - 0.35) / 0.45;   // (a sagging tyre; a rim is round)
    if (w.hub.scale.y !== sq) w.hub.scale.set(1, sq, 1);
    if (!R.visible) return;
    R.rotation.z = -this.spin;
    U.cords[0].visible = st === 3 || (st === 2 && P > 0.42); if (st === 2) U.cords[1].visible = P > 0.62;
    // the strips of tread: more and more of them peel off; once it is down to the rim a few short ones are left
    const n = st === 2 ? 1 + Math.floor((P - 0.35) / 0.45 * 4.99) : st === 3 ? 6 : 3;
    const hinge = bare ? 0.25 : 0.335, fl = Math.min(1, car.speed / 40), tt = (this._tt = (this._tt || 0) + dt);
    U.tatters.forEach((o, i) => {
      o.visible = i < n; if (!o.visible) return;
      const u = o.userData, [a, joint, b] = u.seg;
      // thrown outward by the spin and whipped by the air (more the faster it goes), the loose end curling and
      // flailing on its own, a little twist
      const beta = u.base + fl * (0.4 + 0.3 * Math.sin(tt * u.f + u.ph)) + (Math.random() - 0.5) * 0.25 * fl;
      o.position.set(Math.cos(u.a) * hinge, Math.sin(u.a) * hinge, u.z);
      o.rotation.z = u.a + Math.PI / 2 - beta;
      const L = (st === 4 ? 0.5 : st === 3 ? 0.9 : 0.55 + 0.45 * (P - 0.35) / 0.45) * u.len / 2;   // (each piece)
      a.scale.x = b.scale.x = L / 0.42; joint.position.set(L, 0, 0);
      joint.rotation.z = u.curl * (1 - 0.5 * fl) + fl * 0.7 * Math.sin(tt * u.f * 1.7 + u.ph * 2) + (Math.random() - 0.5) * 0.4 * fl;
      a.rotation.x = u.tw; b.rotation.x = u.tw + Math.sin(tt * u.f * 0.6 + u.ph) * 0.4 * fl;
    });
  }

  /** wheel k (FL FR RL RR) torn off: it flies on as debris */
  _loseWheel(k, car) {
    const order = [[true, -1], [true, 1], [false, -1], [false, 1]][k];
    const w = this.wheels.find((x) => x.front === order[0] && x.side === order[1]) || this.wheels[k];
    if (!w || w.gone) return; this._drop('tyre', w.hub, car, 0x141414, 9); w.hub.visible = false; w.gone = true;
  }

  update(car, dt) {
    if (this.wheelSteer) { this.wheelSteer.rotation.x = -(car.steer || 0) * 1.5; this.wheelDisp.color.setHex(car.retired || car.wreck ? 0x08090b : 0xffffff); }   // (the steering wheel, turned by the driver; its display and lights dead with the car)
    // ---- debris from this car's impacts, and the parts it has lost
    if (car.events.length) {
      for (const e of car.events) {
        if (e.kind === 'mangle') this._mangle(car);
        else if (e.kind === 'split') this._splitNow = true;   // (done after this frame's pose is set: below)
        else if (e.kind === 'fire') this._source('fire', car.split ? SPLIT_X + 0.3 : -1.3, 0.55, e.sev, car);
        else if (e.kind === 'smoke') this._source('smoke', -2.0, 0.7, e.sev, car);
        else if (e.kind.startsWith('puncture')) { if (DEBRIS) for (let k = 0; k < 3; k++) DEBRIS.part('strip', e.x, 0.25, e.z, e.vx, e.vz, 0x0c0c0c, 2.5); if (FIRE) this._source('puff', 0, 0.2, 1, car); }
        else if (e.kind.startsWith('wheel')) this._loseWheel(+e.kind[5], car);
        else if (DEBRIS) DEBRIS.burst(e.x, e.z, e.vx, e.vz, Math.min(16, 2 + Math.round(e.sev * 16)), this.livery.color.getHex());
      }
      car.events.length = 0;
    }
    const L = this.lost, dm = car.dmg;
    if (dm.fwL >= 0.6 && !L.fwL) { L.fwL = true; this._drop('endplate', this.fwL, car, 0x16171b, 5); } else if (dm.fwL < 0.6) L.fwL = false;
    if (dm.fwR >= 0.6 && !L.fwR) { L.fwR = true; this._drop('endplate', this.fwR, car, 0x16171b, 5); } else if (dm.fwR < 0.6) L.fwR = false;
    const fwGone = dm.fwL > 0.95 && dm.fwR > 0.95;
    if (fwGone && !L.fw && this.frontWing.visible) { L.fw = true; this._drop('plate', this.frontWing, car, this.livery.color.getHex(), 5); } else if (!fwGone) L.fw = false;
    if (dm.rw >= 0.85 && !L.rw && this.rearWing.visible) { L.rw = true; this._drop('rearwing', this.rearWing, car, this.livery.color.getHex(), 5); } else if (dm.rw < 0.85) L.rw = false;

    // ---- pose: on the ground a yaw; airborne / wrecked the full attitude, turned about the body's centre
    if ((car.air || car.wreck) && car.q) {
      const q = car.q; this.group.quaternion.set(q[0], q[1], q[2], q[3]);
      _wp.set(0, 0.48, 0).applyQuaternion(this.group.quaternion);   // the body turns about its centre, 0.48 m above the mesh origin
      this.group.position.set(car.p[0] - _wp.x, car.p[1] - _wp.y, car.p[2] - _wp.z);
      this.shadow.visible = this.shadowFar.visible = false;   // the blob shadow is a ground decal: not on a tumbling body
    } else {
      // the sprung body: heave, pitch (nose up = +z rotation in the mesh frame) and roll (left side up = +x)
      this.group.rotation.set(car.rl, -car.th, car.pt, 'YZX');
      this.group.position.set(car.x, car.hv, car.z);
    }
    const dMax = Math.max(0.055, 0.38 * (1 - car.speed / 118));
    this.spin += car.vLong / 0.36 * dt;
    const onGround = !car.air && !car.wreck, W = car.wh;
    for (const w of this.wheels) {
      if (w.gone) continue;
      if (w.front) w.hub.rotation.y = car.steer * dMax * 1.2;
      w.mesh.rotation.z = -this.spin;
      // each wheel stays on the road under it (kerb, grass) while the body moves on its springs
      const k = (w.front ? 0 : 2) + (w.side < 0 ? 0 : 1), flat = car.punct === k;
      // a puncture: the tyre's state as it comes apart (_tyre), the wheel lower and lower on the road
      const P = flat ? (car.punctShred ? 1 : Math.min(0.999, car.punctP || 0)) : -1;
      this._tyre(w, P, car, dt);
      if (onGround) w.hub.position.y = 0.36 + Math.max(-0.05, Math.min(0.1, W.def[k])) - (P < 0 ? 0 : P < 0.8 ? 0.07 + 0.03 * Math.max(0, (P - 0.35) / 0.45) : 0.115);
      // it throws strips of tread as it goes; once metal touches the road, sparks - by speed, and brightest from a
      // bare rim
      if (P >= 0 && car.speed > 6) {
        const p = this._wpos(w.hub), [vx, vz] = car.worldVel();
        const strips = P < 0.35 ? 0.5 : P < 0.8 ? 1.4 : P < 1 ? 0.9 : 0;   // a second
        if (DEBRIS && strips && Math.random() < dt * strips) DEBRIS.part('strip', p.x, 0.2, p.z, vx, vz, 0x0c0c0c, 2);
        const metal = W.surf[k] >= 2 ? 0 : P >= 1 ? 1 : P >= 0.8 ? 0.55 : P > 0.65 ? 0.12 : 0;   // (asphalt and kerbs: no sparks off grass or gravel)
        if (FIRE?.grind && metal) FIRE.grind(p.x, 0.02, p.z, vx, vz, car.speed, metal, dt, w);
      }
    }
    // the DRS flap: open when the car's DRS is (RaceDirector / DRS.js)
    const drsOpen = !!car.drs;
    this.drs.rotation.z += ((drsOpen ? 0.05 : 0.5) - this.drs.rotation.z) * Math.min(1, dt * 8);
    // damage visuals
    const d = car.dmg;
    this.fwL.visible = d.fwL < 0.6; this.fwR.visible = d.fwR < 0.6;
    this.fwL.rotation.x = d.fwL * 0.6; this.fwR.rotation.x = -d.fwR * 0.6;
    this.frontWing.visible = !(d.fwL > 0.95 && d.fwR > 0.95);
    this.rearWing.visible = d.rw < 0.85; this.rearWing.rotation.x = d.rw * 0.5;
    // a bent front wing droops on its damaged side, a broken wishbone leans its wheel
    this.frontWing.rotation.x = (d.fwR - d.fwL) * 0.12; this.frontWing.rotation.z = -Math.max(d.fwL, d.fwR) * 0.08;
    if (d.susp > 0.3) { const w = this.wheels[car.suspSide > 0 ? 0 : 1]; w.hub.rotation.z = d.susp * 0.35; }
    this.rearLight.material.emissiveIntensity = car.brake > 0.3 || car.wetness > 0.3 ? 3 : 0.8;
    // (a recovered wreck stays where the marshals set it down, for the rest of the race)
    if (this._splitNow) { this._splitNow = false; this.split(car); }
    this.group.visible = !(car.ghost > 0 && Math.floor(car.ghost * 8) % 2 === 0);
  }
}
