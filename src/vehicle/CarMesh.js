// The F1 car: the 2026 model (vehicle/CarModel.js - its parts and their levels of detail, shared by the whole field) in
// a team's livery (vehicle/Livery.js), its wheels turning and steering, the DRS flap working, and its damage
// (vehicle/Damage.js): the bodywork crumpled where it was hit, the parts that broke off flying and lying where they
// fell, the car torn in two along a ragged line. Forward = +x, y up, z to the right; the ground is y = 0, the body
// frame's origin sits CG_X ahead of the group's (the physics' centre of gravity).
//
// The damage is the car's own record (Car.dents, .lost, .pieces - with the race time of each), so this mesh can be
// rebuilt or rewound at any moment and show it exactly as it was: a flashback, a replay (replay(car, t)).
//
// Detail by distance, the car's states (detail(cam, zoom): the distances scale with the lens, so a long lens brings
// the detail in with the car):
//   ULTRA  (< 9 m)   the model at its finest (~125k triangles, textured), the cockpit's own: the steering wheel, the
//                    driver's arms and gloves
//   HIGH   (< 38 m)  the model at ~47k triangles, textured
//   MED    (< 95 m)  ~16k, its colours in the vertices (the paint still the livery's own)
//   FAR    (< 260 m) ONE mesh (~7k, vertex-coloured, the livery painted where the paint is) and its blob shadow (2 draw
//                    calls); its geometry is shared - the car whole, or without the wings or wheels it has lost
//   MIN    (beyond)  the same at ~5k
// A car only has its own paint (the livery's uniforms), number, T-cam colour and lights.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COMPOUNDS } from './Tyres.js';
import { helmetTexture, helmetDesign } from '../world/HelmetDesigns.js';
import { TERRAIN } from '../world/Terrain.js';
import { floodlit } from '../world/Lighting.js';
import { carModel } from './CarModel.js';
import { liveryFor, liveryUniforms, paintWith } from './Livery.js';
import { REGIONS, REGION_BIT, partGeo, hasRegions, regionGeo, fragGeo, centreOf, dentWith, dentUniforms, NO_DENTS, ownCopy, uploadDents, prepareDamage } from './Damage.js';

/** the car's states by distance from the camera (m, at the default lens) */
const D_ULTRA = 9, D_HIGH = 38, LOD_FAR = 95, LOD_MIN = 260;
let DEBRIS = null;
/** the scene's debris system (world/Debris.js): broken parts and shards are thrown into it */
export function setDebris(d) { DEBRIS = d; }
let FIRE = null, CHUNKS = null;
/** the fire / smoke particles (world/Fire.js) and the free halves of split cars (world/Chunks.js) */
export function setFire(f) { FIRE = f; }
export function setChunks(c) { CHUNKS = c; }
const SPLIT_X = -0.62;   // body frame: where a car tears in two - behind the survival cell, ahead of the engine (Damage.js TEAR_X: the ragged line)
const CG_X = 0.151, R_TYRE = 0.354;   // (CG_X: the centre of mass is this far behind the axles' midpoint - Car.js CAR.lf / lr)
const _sv = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _m4b = new THREE.Matrix4(), _wp = new THREE.Vector3(), _gr = [0, 0], _up = new THREE.Vector3(0, 1, 0);
const EMPTY = new THREE.BufferGeometry();   // (a part with every triangle gone)
/** the box round a geometry's own triangles (a piece shares its whole part's vertex buffer) */
function triBox(g) {
  if (g.userData.triBox) return g.userData.triBox;
  const P = g.attributes.position.array, I = g.index?.array, b = new THREE.Box3();
  if (I) for (let k = 0; k < I.length; k++) { const a = I[k] * 3; b.expandByPoint(_sv.set(P[a], P[a + 1], P[a + 2])); } else b.setFromBufferAttribute(g.attributes.position);
  return (g.userData.triBox = b);
}
/**
 * A piece where its record has it at race time t: rec.tr [t, x, y, z, qx, qy, qz, qw] at 20 Hz while it flies; then,
 * if it came to rest on the racing surface, rec.sweep [t, x0, z0, x1, z1]: the marshals dragging it off to the verge.
 */
const _pq0 = new THREE.Quaternion(), _pq1 = new THREE.Quaternion();
const SWEEP_AFTER = 14, SWEEP_T = 2.5;   // (as world/Debris.js: on the road this long, then dragged off over this long)
function posePiece(o, rec, t) {
  const tr = rec.tr, n = tr.length / 8; if (!n) return;
  let k = 0; while (k < n - 1 && tr[(k + 1) * 8] <= t) k++;
  const a = k * 8, b = Math.min(n - 1, k + 1) * 8, u = tr[b] > tr[a] ? Math.max(0, Math.min(1, (t - tr[a]) / (tr[b] - tr[a]))) : 0;
  o.position.set(tr[a + 1] + (tr[b + 1] - tr[a + 1]) * u, tr[a + 2] + (tr[b + 2] - tr[a + 2]) * u, tr[a + 3] + (tr[b + 3] - tr[a + 3]) * u);
  o.quaternion.copy(_pq0.set(tr[a + 4], tr[a + 5], tr[a + 6], tr[a + 7])).slerp(_pq1.set(tr[b + 4], tr[b + 5], tr[b + 6], tr[b + 7]), u);
  const S = rec.sweep;
  if (S && S.length > 1 && t > S[0]) { const v = Math.min(1, (t - S[0]) / SWEEP_T), e = v * v * (3 - 2 * v); o.position.x = S[1] + (S[3] - S[1]) * e; o.position.z = S[2] + (S[4] - S[2]) * e; }
}

// ---- shared parts: the punctured tyre's (the wrecked tyre and the bare rim), the helmet, the blob shadow
const TYRE_WF = 0.346, TYRE_WR = 0.402, R_RIM = 0.2286;
const rimF = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WF - 0.02, 20); rimF.rotateX(Math.PI / 2);
const rimR = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WR - 0.02, 20); rimR.rotateX(Math.PI / 2);
// the driver's head and shoulders (shared): a real helmet's shell - a little longer than wide, open at the neck, its lower
// front swept down into the chin guard (world/People.js makeHelmet, the same shape) - its visor, the spoiler on top at
// the back; a low one for the medium state; the neck in its balaclava, the shoulders, the HANS collar on them
const HR = 0.145, HSX = 1.12, HSZ = 0.92;
const helmetGeo = (() => {
  const g = new THREE.SphereGeometry(HR, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.78), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); if (x < -0.04 && y < 0) p.setY(i, y * (1 + Math.min(0.35, (-x - 0.04) * 4))); }   // (the chin guard: the front is -x here, turned below)
  g.computeVertexNormals(); g.scale(HSX, 1, HSZ); g.rotateY(Math.PI); return g;   // (front to +x; a design's u = 0 faces forward)
})();
const helmetFar = new THREE.SphereGeometry(HR, 10, 7); helmetFar.scale(HSX, 1, HSZ);
const visorBandGeo = new THREE.SphereGeometry(HR * 1.012, 40, 10, Math.PI - 1.1, 2.2, 1.0, 0.5); visorBandGeo.scale(HSX, 1, HSZ);   // (centred on +x: the front)
const spoilerGeo = new THREE.BoxGeometry(0.06, 0.01, 0.12).rotateZ(-0.25).translate(-0.13, 0.105, 0);
const neckGeo = new THREE.CylinderGeometry(0.052, 0.06, 0.1, 14).translate(-0.01, -0.1, 0);
// (the head's frame: the helmet's centre, scaled 0.9. The shoulders just over the cockpit's rim either side of the neck:
//  two deltoids - flattened, sloping down and out - and the yoke between them, not one round bolster)
const shouldersGeo = (() => {
  const parts = [];
  for (const sd of [-1, 1]) { const d = new THREE.SphereGeometry(1, 32, 20); d.scale(0.075, 0.05, 0.088); d.rotateX(-sd * 0.35); d.translate(-0.06, -0.03, sd * 0.19); parts.push(d); }
  const yoke = new THREE.CylinderGeometry(0.052, 0.06, 0.3, 24, 1); yoke.rotateX(Math.PI / 2); yoke.scale(1.25, 0.8, 1); yoke.translate(-0.075, -0.05, 0); parts.push(yoke);
  return mergeGeometries(parts);   // (each piece keeps its own smooth normals)
})();
const hansGeo = (() => { const g = new THREE.TorusGeometry(0.1, 0.022, 8, 24, Math.PI * 1.25); g.rotateX(Math.PI / 2); g.rotateY(-Math.PI * 0.375); g.scale(1, 1, 1.15); g.translate(-0.045, -0.012, 0); return g; })();   // (on the shoulders, round the back of the neck)   // (a collar round the back of the neck, open at the front, its arms down onto the shoulders)
const hansMat = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.55, metalness: 0.2 });
const shadowGeo = new THREE.PlaneGeometry(5.5, 2.15); shadowGeo.rotateX(-Math.PI / 2); shadowGeo.translate(0, 0.01, 0);
const flangeGeo = new THREE.TorusGeometry(0.232, 0.014, 6, 28);
const carcassGeo = new THREE.TorusGeometry(0.243, 0.028, 6, 24, Math.PI * 1.3);
const tatterGeo = new THREE.BoxGeometry(0.42, 0.02, 1); tatterGeo.translate(0.21, 0, 0);
const cordGeo = new THREE.TorusGeometry(0.345, 0.02, 4, 24, Math.PI * 0.8);
const rubber = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }); shadowMat.userData.glow = false;
if (typeof document !== 'undefined') {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 256, 128); x.filter = 'blur(10px)'; x.fillStyle = '#fff'; x.beginPath(); x.roundRect(30, 26, 196, 76, 30); x.fill();
  shadowMat.alphaMap = new THREE.CanvasTexture(c);
}
const visorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.12, metalness: 0.9 });
// a wheel with its tyre gone: bare machined metal (a touch of its own light so it reads silver at night too)
const bareRimMat = new THREE.MeshStandardMaterial({ color: 0xe4e7ec, roughness: 0.3, metalness: 0.45, emissive: 0x50545b, emissiveIntensity: 0.55 });
const cordMat = new THREE.MeshStandardMaterial({ color: 0x8a8074, roughness: 0.95 });
const SHARED_GEO = new Set([rimF, rimR, helmetGeo, helmetFar, visorBandGeo, spoilerGeo, neckGeo, shouldersGeo, hansGeo, shadowGeo, flangeGeo, carcassGeo, tatterGeo, cordGeo]);
const SHARED_MAT = new Set([rubber, shadowMat, visorMat, bareRimMat, cordMat, hansMat]);

// ---- the model's shared materials (built once it is loaded): textured for the near states; the tyres one per compound
let MAT = null;
const PER_CAR = new Set(['paint', 'tcam', 'number', 'light', 'tyre', 'swlcd']);
function materials() {
  if (MAT) return MAT;
  const M = carModel(); MAT = {};
  for (const [k, m] of Object.entries(M.json.materials)) {
    if (PER_CAR.has(k)) continue;
    const o = { roughness: m.rough, metalness: m.metal };
    if (m.tex) o.map = M.tex[m.tex]; else if (m.color) o.color = new THREE.Color().setRGB(...m.color);
    if (m.nrm) { o.normalMap = M.tex[m.nrm]; o.normalScale = new THREE.Vector2(0.6, 0.6); }
    if (m.alpha) { o.transparent = true; o.alphaTest = 0.25; o.depthWrite = false; }
    if (k === 'mirror') o.envMapIntensity = 1.6;
    MAT[k] = dentWith(new THREE.MeshStandardMaterial(o), NO_DENTS); MAT[k].name = 'car-' + k; SHARED_MAT.add(MAT[k]);   // (no dents: a car that is hit gets its own copies, the same program)
  }
  prepareDamage();
  return MAT;
}
const TYRE = {};
/** the tyre for a compound (shared): the sidewall with its lettering in the compound's colour */
function tyreMat(compound) {
  if (TYRE[compound]) return TYRE[compound];
  const M = carModel(), img = M.tex.tyre.userData.img, c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), p = d.data, col = new THREE.Color(COMPOUNDS[compound]?.color || '#ffffff'), cr = col.r * 255, cg = col.g * 255, cb = col.b * 255;
  for (let i = 0; i < p.length; i += 4) { const a = p[i + 3] / 255; p[i] += (cr - p[i]) * a; p[i + 1] += (cg - p[i + 1]) * a; p[i + 2] += (cb - p[i + 2]) * a; p[i + 3] = 255; }
  x.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  const m = new THREE.MeshStandardMaterial({ map: t, normalMap: M.tex.tyre_n, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.82, metalness: 0 });
  SHARED_MAT.add(m); return (TYRE[compound] = m);
}

// ---- a wheel at speed: its face as a camera sees it, motion-blurred - the rim a smooth dark disc with the spokes' light
//      smeared round, the sidewall's lettering a ring of the compound's colour (per compound, shared)
const blurGeo = new THREE.CircleGeometry(0.355, 40);
const BLUR = {};
function blurTex(compound) {
  if (BLUR[compound]) return BLUR[compound];
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), C = S / 2, R = (r) => (r / 0.355) * C;
  const g = x.createRadialGradient(C, C, 0, C, C, C);
  g.addColorStop(0, 'rgba(120,124,130,1)'); g.addColorStop(R(0.035) / C, 'rgba(70,73,78,1)'); g.addColorStop(R(0.06) / C, 'rgba(34,36,40,1)'); g.addColorStop(R(0.2) / C, 'rgba(46,48,53,1)');
  g.addColorStop(R(0.228) / C, 'rgba(86,90,96,1)'); g.addColorStop(R(0.236) / C, 'rgba(22,22,24,1)'); g.addColorStop(R(0.345) / C, 'rgba(20,20,22,1)'); g.addColorStop(1, 'rgba(20,20,22,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  const col = new THREE.Color(COMPOUNDS[compound]?.color || '#ffffff');
  x.strokeStyle = `rgba(${col.r * 255 | 0},${col.g * 255 | 0},${col.b * 255 | 0},0.55)`; x.lineWidth = R(0.022); x.beginPath(); x.arc(C, C, R(0.3), 0, Math.PI * 2); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return (BLUR[compound] = t);
}

// ---- the far states' geometry: the parts' level 3 / 4 meshes merged in the body frame, one per set of parts still on
//      the car (shared: a whole car's is everyone's)
const FAR_PARTS = ['body', 'halo', 'tcam', 'light', 'fw', 'fwL', 'fwR', 'rw', 'drs', 'wFL', 'wFR', 'wRL', 'wRR', 'wFLs', 'wFRs', 'wRLs', 'wRRs'];
const _q = new THREE.Quaternion();
const FARG = new Map();
function farGeometry(level, has) {
  const key = level + '|' + FAR_PARTS.filter(has).join(',');
  if (FARG.has(key)) return FARG.get(key);
  const M = carModel(), list = [];
  for (const name of FAR_PARTS) {
    if (!has(name)) continue;
    const L = M.geo[name]?.[level]; if (!L) continue;
    // (a wheel's parts are in its own frame - about its hub, its axis along z: turned by its camber and put on its hub)
    const H = name[0] === 'w' ? M.hubs[name.slice(0, 3)] : null, p = H ? H.c : M.pivots[name] || [0, 0, 0];
    for (const g of Object.values(L)) { const c = g.clone(); if (H) c.applyQuaternion(_q.set(...H.q)); c.translate(p[0], p[1], p[2]); list.push(c); }
  }
  const g = list.length ? mergeGeometries(list) : new THREE.BufferGeometry(); list.forEach((x) => x.dispose());
  g.computeBoundingSphere(); SHARED_GEO.add(g); FARG.set(key, g); return g;
}

/** a group with one small mesh of each of the materials a car only shows once it is hurt (the bare rim, the carcass,
 *  the cords): main.js compiles them with everything else at the start of a session, not at the first puncture */
export function prewarmParts() {
  const g = new THREE.Group();
  for (const m of [rubber, bareRimMat, cordMat, visorMat]) { const o = new THREE.Mesh(tatterGeo, m); o.position.set(0, -50, 0); o.scale.setScalar(0.01); g.add(o); }
  return g;
}
/** the number decals' atlas (the model's layout: the driver's name over the number), in the livery's number colours */
function numberTexture(num, name, short, c, edge) {
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S; const x = cv.getContext('2d');
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  const txt = (s, cx, cy, size, w, font = '800') => { x.font = `${font} ${size}px "Segoe UI", Arial, sans-serif`; const k = Math.min(1, w / x.measureText(s).width); x.save(); x.translate(cx, cy); x.scale(k, 1); x.lineWidth = size * 0.14; x.strokeStyle = edge; x.strokeText(s, 0, 0); x.fillStyle = c; x.fillText(s, 0, 0); x.restore(); };
  if (short) txt(short, 256, 68, 54, 360);
  if (name) txt(name.toUpperCase(), 256, 152, 52, 400, '600');
  txt(String(num ?? ''), 256, 398, 230, 190, 'italic 900');
  const t = new THREE.CanvasTexture(cv); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;   // (the plates' uvs run past 0..1: repeated, as the model's own texture was)
}

export class CarMesh {
  /**
   * color: the team's colour; compound: the tyres; opts: { color2, team, livery (a design: Livery.designLivery), helmet,
   * driver (the name: their helmet design), number, glove, tcamColor }
   */
  constructor(color, compound = 'SOFT', opts = {}) {
    const M = carModel(); if (!M) throw new Error('CarMesh: the car model is not loaded (CarModel.loadCarModel)');
    const shared = materials();
    this.group = new THREE.LOD(); this.group.userData.isCar = true;
    const body = new THREE.Group(); this.body = body;
    // ---- the livery: its uniforms, shared by every painted material of this car
    const spec = this.spec = liveryFor(opts.team, color, opts.color2, opts.livery);
    const U = this.U = liveryUniforms(spec);
    U.uLivComp.value.set(COMPOUNDS[compound]?.color || '#ffffff');
    U.uLivTcam.value.set(opts.tcamColor ?? 0xffd400);
    this.livery = { color: new THREE.Color(spec.base) }; this.accent = { color: new THREE.Color(opts.color2 || spec.layers[0]?.c || spec.base) };   // (what debris and the replays take the car's colour from)
    this.compound = compound;
    const own = this._own = new Set();   // (this car's own materials: freed with it)
    const DU = this.DU = dentUniforms();   // (its dents: every one of its materials bends by them - Damage.js)
    const paint = new Map(), far = new Map();
    // (one per part with a pivot of its own, and the wing it is on: the wing layers paint the wings by their flag)
    const paintMat = (pv, part = 0) => { const k = pv.join(',') + '|' + part; if (!paint.has(k)) { const m = dentWith(paintWith(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: spec.finish?.rough ?? 0.3, metalness: spec.finish?.metal ?? 0.15, envMapIntensity: 0.9 }), U, pv, 'paint', part), DU, pv); own.add(m); paint.set(k, m); } return paint.get(k); };
    const farMat = (pv, part = -1) => { const k = pv.join(',') + '|' + part; if (!far.has(k)) { const m = dentWith(paintWith(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.2 }), U, pv, 'far', part), DU, pv); own.add(m); far.set(k, m); } return far.get(k); };
    const wingOf = (name) => (name === 'fw' || name === 'fwL' || name === 'fwR' ? 1 : name === 'rw' || name === 'drs' ? 2 : 0);
    // (the paint without this car's dents: a new part on it - the pit crew's spare wing: undented)
    const clean = new Map();
    this._paintClean = (name) => { const pv = M.pivots[name] || [0, 0, 0], k = pv.join(',') + '|' + wingOf(name); if (!clean.has(k)) { const m = dentWith(paintWith(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: spec.finish?.rough ?? 0.3, metalness: spec.finish?.metal ?? 0.15, envMapIntensity: 0.9 }), U, pv, 'paint', wingOf(name)), NO_DENTS, pv); floodlit(m, true); own.add(m); clean.set(k, m); } return clean.get(k); };
    this._farMat = farMat;
    this.tcamMat = dentWith(new THREE.MeshStandardMaterial({ color: opts.tcamColor ?? 0xffd400, roughness: 0.45, metalness: 0.1 }), DU); own.add(this.tcamMat);
    const lightMat = dentWith(new THREE.MeshStandardMaterial({ map: M.tex.light, color: 0x501010, emissive: 0xff1010, emissiveMap: M.tex.light, emissiveIntensity: 0.8 }), DU); own.add(lightMat);
    this.rearLight = { material: lightMat };
    this.wheelDisp = new THREE.MeshStandardMaterial({ color: 0x0b1016, emissive: 0x1d8fd0, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.2 }); own.add(this.wheelDisp);   // (the steering wheel's display, lit)
    let numMat = null;
    if (opts.number != null) {
      const N = spec.num || { c: '#ffffff', edge: '#000000' };
      numMat = dentWith(new THREE.MeshStandardMaterial({ map: numberTexture(opts.number, opts.driver, opts.driver ? opts.driver.split(' ').pop().slice(0, 3).toUpperCase() : '', N.c, N.edge), transparent: true, alphaTest: 0.3, roughness: 0.35, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), DU);
      own.add(numMat);
    }
    this._compoundMats = [];
    /** a part's material: its level's (2: the vertex colours), the paint, this car's own, or the model's shared */
    const matFor = (name, k, lv) => {
      const pv = M.pivots[name] || [0, 0, 0];
      if (lv >= 2) return farMat(pv, wingOf(name));
      if (k === 'paint') return paintMat(pv, wingOf(name));
      if (k === 'tcam') return this.tcamMat;
      if (k === 'light') return lightMat;
      if (k === 'number') return numMat;
      if (k === 'tyre') return tyreMat(compound);
      if (k === 'swlcd') return this.wheelDisp;
      return shared[k] || shared.black;
    };
    this._matFor = matFor;
    this.lv = [[], [], []];
    /** a part's meshes, levels 0-2 (those it has), into parent (its pivot's frame) */
    const put = (parent, name, levels = [0, 1, 2]) => {
      const P = M.geo[name]; if (!P) return;
      for (const lv of levels) {
        const L = P[lv]; if (!L) continue;
        for (const [k, g] of Object.entries(L)) {
          const mat = matFor(name, k, lv); if (!mat) continue;
          const m = new THREE.Mesh(g, mat); m.userData.lod = lv; m.userData.part = name; m.userData.mk = k; if (k === 'tyre' && lv < 2) m.userData.tyre = true;
          parent.add(m); this.lv[lv].push(m);
        }
      }
    };
    const at = (name) => { const g = new THREE.Group(); g.position.set(...(M.pivots[name] || [0, 0, 0])); return g; };

    // ---- the static body (the tub, nose, sidepods, engine cover, floor, suspension), its T-cam, number and rain lights
    put(body, 'body'); if (numMat) put(body, 'number', [0, 1]);
    this.tcamG = new THREE.Group(); put(this.tcamG, 'tcam'); body.add(this.tcamG);
    this.lightG = new THREE.Group(); put(this.lightG, 'light'); body.add(this.lightG);
    // the halo (toggled with H)
    this.halo = at('halo'); put(this.halo, 'halo'); body.add(this.halo);

    // ---- the driver: the helmet (their own design if they have one - world/HelmetDesigns.js - else one colour) with its
    //      visor (tinted toward the design's iridium) and spoiler; the neck, the shoulders and the HANS collar under it;
    //      the arms out to the wheel, the gloves on it. (this.helmet: the whole head - hidden for a view from inside it)
    const HX = 0.2, HY = 0.79;
    const hmap = opts.driver ? helmetTexture(opts.driver, { size: 512 }) : null, HD = opts.driver ? helmetDesign(opts.driver) : null;
    const helmetMat = new THREE.MeshStandardMaterial(hmap ? { map: hmap, roughness: 0.2, metalness: 0.12 } : { color: new THREE.Color(opts.helmet || '#ffffff'), roughness: 0.22, metalness: 0.15 }); own.add(helmetMat);
    const visorTint = new THREE.MeshStandardMaterial({ color: new THREE.Color('#08090c').lerp(new THREE.Color(HD?.visor || '#1a2a44'), HD ? 0.3 : 0.25), roughness: 0.04, metalness: 0.8 }); own.add(visorTint);
    const suit = new THREE.Color(opts.glove || opts.color2 || spec.base);
    const suitMat = new THREE.MeshStandardMaterial({ color: suit, roughness: 0.8 }); own.add(suitMat);
    const helmet = new THREE.Group(); helmet.scale.setScalar(0.9); helmet.position.set(HX, HY, 0); helmet.userData.role = 'helmet';
    const shell = new THREE.Mesh(helmetGeo, helmetMat), shellLo = new THREE.Mesh(helmetFar, helmetMat);
    const head = new THREE.Group();   // (ULTRA and HIGH: the shell, the visor, the spoiler, the neck, shoulders and HANS)
    head.add(shell, new THREE.Mesh(visorBandGeo, visorTint), new THREE.Mesh(spoilerGeo, hansMat), new THREE.Mesh(neckGeo, suitMat), new THREE.Mesh(shouldersGeo, suitMat), new THREE.Mesh(hansGeo, hansMat));
    helmet.add(head, shellLo); shellLo.visible = false;
    body.add(helmet); this.helmet = helmet; this.visor = head; this._headLo = shellLo;
    const swP = M.pivots.sw || [0.72, 0.61, 0];
    const driver = new THREE.Group();
    { const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.3, 4, 10).rotateZ(Math.PI / 2 - 0.35).scale(1, 0.7, 1.35).translate(HX + 0.02, 0.5, 0), suitMat); driver.add(torso); }   // (the chest, reclined, down in the tub)
    // (the arms: from the shoulders to the grips, following them round as the wheel turns - _arms)
    this.arms = [];
    for (const σ of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 1, 8), suitMat); driver.add(arm);
      this.arms.push({ m: arm, sh: new THREE.Vector3(HX - 0.03, 0.64, σ * 0.17), off: new THREE.Vector3(-0.035, -0.005, σ * 0.115) });   // (from the shoulders: the deltoids)
    }
    this._swP = new THREE.Vector3(...swP); this._swAxis = new THREE.Vector3(...(M.pivots.swAxis || [1, 0, 0])).normalize(); this._arms(0);
    body.add(driver);
    this.details = [driver]; this._lvNow = 0; this._gy = 0; this._zoom = 1;

    // ---- front wing (its outer thirds - the endplates - keep their own groups: damage)
    this.frontWing = at('fw'); put(this.frontWing, 'fw');
    const third = (n) => { const g = at(n); g.position.sub(this.frontWing.position); put(g, n); return g; };
    this.fwL = third('fwL'); this.fwR = third('fwR'); this.frontWing.add(this.fwL, this.fwR); body.add(this.frontWing);
    // (a spare like it, centred on the pit crew's holder - world/PitCrew.js)
    this.fwHold = new THREE.Vector3(-0.42, 0.0, 0);

    // ---- rear wing; its top flap turns about its leading edge (DRS)
    this.rearWing = at('rw'); put(this.rearWing, 'rw');
    this.drs = at('drs'); this.drs.position.sub(this.rearWing.position); put(this.drs, 'drs'); this.rearWing.add(this.drs);
    body.add(this.rearWing);

    // ---- the steering wheel (ULTRA only: turned by the driver about its column - through the middle of its display,
    //      along the display's normal)
    const swTilt = at('sw'), sw = new THREE.Group(), swIn = new THREE.Group();
    swTilt.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(...(M.pivots.swAxis || [1, 0, 0])).normalize());
    swIn.quaternion.copy(swTilt.quaternion).invert(); swTilt.add(sw); sw.add(swIn); put(swIn, 'sw', [0]);
    body.add(swTilt); this.wheelSteer = sw; this.details.push(swTilt);
    body.position.x = CG_X;

    // ---- wheels: the hub (on its hub centre: it steers, rides the springs) > its camber (the model's own: the axis the
    //      wheel turns about) > the hub's static work (the upright, the duct) and `spin` (turning: the tyre in its
    //      compound's colour, the rim and its cover, the brake disc)
    this.wheels = [];
    // (the blurred face at speed: this car's own - its opacity is by its speed - on the compound's shared texture)
    this.blurMat = new THREE.MeshStandardMaterial({ map: blurTex(compound), transparent: true, opacity: 0, depthWrite: false, roughness: 0.7, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    this.blurMat.userData.sharedMap = true; own.add(this.blurMat);
    for (const [name, front, s] of [['wFR', true, 1], ['wFL', true, -1], ['wRR', false, 1], ['wRL', false, -1]]) {
      const H = M.hubs[name], hub = new THREE.Group(), camber = new THREE.Group(), spin = new THREE.Group(), tyre = new THREE.Group(), face = new THREE.Group();
      hub.position.set(...H.c); camber.quaternion.set(...H.q);
      hub.add(camber); camber.add(spin); spin.add(tyre, face);
      for (const [part, into] of [[name, null], [name + 's', camber]]) {
        const P = M.geo[part]; if (!P) continue;
        for (const lv of [0, 1, 2]) for (const [k, g] of Object.entries(P[lv] || {})) {
          const m = new THREE.Mesh(g, matFor(part, k, lv)); m.userData.lod = lv; m.userData.wheel = true; if (k === 'tyre' && lv < 2) m.userData.tyre = true;
          (into || (k === 'tyre' || lv >= 2 ? tyre : face)).add(m); this.lv[lv].push(m);
        }
      }
      // (the motion-blurred face over its outer side, faded in with speed: update)
      const blur = new THREE.Mesh(blurGeo, this.blurMat); blur.position.z = s * (H.w / 2 + 0.004); if (s < 0) blur.rotation.y = Math.PI; blur.visible = false; blur.renderOrder = 2; camber.add(blur);
      body.add(hub);
      this.wheels.push({ hub, camber, spin, mesh: tyre, face, blur, decals: [], front, side: s, state: 0, y0: H.c[1], dy: 0 });
    }
    for (let l = 1; l < 3; l++) for (const o of this.lv[l]) o.visible = false;
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat); body.add(this.shadow);   // blob shadow
    this.spin = 0; this.mangled = false;
    // (the damage as drawn: the parts gone, the regions' mask, the half of a torn car, the dents uploaded, the pieces)
    this._gone = {}; this._mask = 0; this._half = 0; this._dentRef = null; this._dentVer = -1; this._pieces = new Map(); this._piecesRef = null;

    // ---- the far states: one mesh each (shared geometry), their own blob shadows
    this.far = new THREE.Group(); this.farMesh = new THREE.Mesh(farGeometry(3, () => true), farMat([0, 0, 0])); this.farMesh.position.x = CG_X; this.shadowFar = new THREE.Mesh(shadowGeo, shadowMat); this.shadowFar.position.x = CG_X; this.far.add(this.farMesh, this.shadowFar);
    this.min = new THREE.Group(); this.minMesh = new THREE.Mesh(farGeometry(4, () => true), farMat([0, 0, 0])); this.minMesh.position.x = CG_X; this.shadowMin = new THREE.Mesh(shadowGeo, shadowMat); this.shadowMin.position.x = CG_X; this.min.add(this.minMesh, this.shadowMin);
    this.group.addLevel(body, 0); this.group.addLevel(this.far, LOD_FAR); this.group.addLevel(this.min, LOD_MIN);
    this._sig = this._signature();
    // (lit as a car is in a session - the floodlights, the Sphere's glow: world/Lighting.js - from the start, so a car
    //  made mid-session, a flashback's or a replay's, draws with the programs compiled at its start)
    this.group.traverse((o) => { if (o.material) floodlit(o.material, true); });
  }

  /**
   * The car's state by distance (cam: world position, on the flat plan - the camera is lifted onto the ground only for
   * the frame, main.js terrainLift; the car model already stands on it, so its height above the ground is what counts:
   * measured from its own, a car on the hill to Turn 1 lost its steering wheel). zoom: how much the lens magnifies
   * against the default (tan of half the default field of view over tan of half this one) - the distances scale by it.
   */
  detail(cam, zoom = 1) {
    const p = this.group.position, d = Math.sqrt((p.x - cam.x) ** 2 + (p.y - this._gy - cam.y) ** 2 + (p.z - cam.z) ** 2) / zoom;
    const lv = this._lockLv ?? (d < D_ULTRA ? 0 : d < D_HIGH ? 1 : 2);
    if (lv !== this._lvNow) {
      this._lvNow = lv;
      for (let l = 0; l < 3; l++) for (const o of this.lv[l]) o.visible = l === lv;
      for (const o of this.details) o.visible = lv === 0;
      this.visor.visible = lv <= 1; this._headLo.visible = lv > 1;   // (the head up close; a plain shell further off)
    }
    if (zoom !== this._zoom) { this._zoom = zoom; for (const l of this.group.levels) l.distance = l.object === this.far ? LOD_FAR * zoom : l.object === this.min ? LOD_MIN * zoom : 0; }
  }

  /** what the far states show of the car: its wings, its wheels, crumpled or not */
  _signature() {
    let s = (this.frontWing.visible ? 1 : 0) | (this.fwL.visible ? 2 : 0) | (this.fwR.visible ? 4 : 0) | (this.rearWing.visible ? 8 : 0) | (this.mangled ? 16 : 0);
    this.wheels.forEach((w, k) => { if (!w.gone && w.hub.visible && w.mesh.visible) s |= 32 << k; });
    return s;
  }
  /** the far states as the car stands now: the shared geometry of the parts it still has, crumpled as the body is */
  _bake() {
    if (!this.far && !this.min) return;
    const has = (n) => {
      if (n === 'fw') return this.frontWing.visible;
      if (n === 'fwL') return this.frontWing.visible && this.fwL.visible;
      if (n === 'fwR') return this.frontWing.visible && this.fwR.visible;
      if (n === 'rw' || n === 'drs') return this.rearWing.visible;
      const k = { wFR: 0, wFL: 1, wRR: 2, wRL: 3 }[n.slice(0, 3)]; if (k != null) { const w = this.wheels[k]; return !w.gone && w.hub.visible && (n.length > 3 || w.mesh.visible); }
      return true;
    };
    if (this.far) { this.farMesh.geometry = farGeometry(3, has); this.farMesh.scale.copy(this.body.scale); this.farMesh.rotation.copy(this.body.rotation); }
    if (this.min) { this.minMesh.geometry = farGeometry(4, has); this.minMesh.scale.copy(this.body.scale); }
  }

  /** free this car's own materials and textures (the model's geometry and shared materials stay) */
  dispose() {
    for (const P of this._pieces.values()) this._dropPiece(P); this._pieces.clear();
    for (const m of this._own) { if (!m.userData.sharedMap) m.map?.dispose?.(); m.dispose(); }
    this.U.uTxtMap.value?.dispose?.();
    this.group.traverse((o) => { if (o.isMesh && o.userData.ownGeo) o.geometry.dispose(); });
  }

  setCompound(c) {
    this.compound = c;
    this.U.uLivComp.value.set(COMPOUNDS[c]?.color || '#ffffff');
    const m = tyreMat(c);
    for (const w of this.wheels) w.mesh.traverse((o) => { if (o.userData.tyre) o.material = m; });
    this.blurMat.map = blurTex(c);
  }
  setHalo(v) { this.halo.visible = v; }   // (the far states keep it: at 95 m+ it is a few pixels)

  /** world position of one of this car's parts (last frame's transforms: one frame late is invisible) */
  _wpos(o) { return o.getWorldPosition(_wp); }
  /** the big one: the bodywork crumples and is scorched (which parts come off is the physics' call: wheelK events, wing damage) */
  _mangle(car) {
    if (this.mangled) return; this.mangled = true;
    this.U.uLivBurn.value = 0.7; this.livery.color.multiplyScalar(0.62); this.accent.color.multiplyScalar(0.62);
    this.body.scale.set(0.96, 1, 1.03); this.body.rotation.x = (Math.random() - 0.5) * 0.08;   // crumpled, twisted tub (height kept: the physics' contact points are on it)
    this.halo.rotation.z = (Math.random() - 0.5) * 0.2;
    if (DEBRIS) { const [vx, vz] = car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 24, this.livery.color.getHex()); }
  }
  /**
   * The car torn in two (Car.splitApart): everything behind the tear - the rear wing, the rear wheels, the rain light
   * and the bodywork behind the ragged line (Damage.js sorted every triangle at start-up: nothing is cut now, the HIGH
   * state's triangles behind it are simply drawn by meshes of their own) - goes into a body of its own that
   * world/Chunks.js flies; this mesh keeps the front, at every level. The far states go. The half is one of the car's
   * pieces, its flight recorded (rec: its record - the car rebuilt by a flashback or a replay - instead of a new tear).
   */
  split(car, rec = null, replay = false) {
    if (this.splitDone) return; this.splitDone = true; this._half = 1;
    this._ownMats();
    const body = this.body; this.group.updateMatrixWorld(true);
    // the half's centre (body frame) and the group that carries it
    const C = new THREE.Vector3((SPLIT_X - 2.6) / 2, 0.45, 0), root = new THREE.Group(); root.name = 'car-half';
    body.localToWorld(root.position.copy(C)); body.getWorldQuaternion(root.quaternion); root.updateMatrixWorld(true);
    const inv = _m4b.copy(root.matrixWorld).invert();
    const adopt = (o) => { o.updateMatrixWorld(true); _m4.multiplyMatrices(inv, o.matrixWorld); o.parent?.remove(o); _m4.decompose(o.position, o.quaternion, o.scale); root.add(o); };
    // whole parts
    adopt(this.rearWing);
    for (const w of this.wheels) if (!w.front) { adopt(w.hub); w.gone = true; w.half = true; w.hub.visible = !this._gone['w' + (w.side < 0 ? 2 : 3)]; }
    // the bodywork behind the tear (and the rain light): the HIGH state's
    const back = new THREE.Group(); body.add(back);
    for (const o of this.lv[1]) if (o.userData.part === 'body') { const g = partGeo('body', 1, o.userData.mk, this._mask, 2); if (g) back.add(new THREE.Mesh(g, o.material)); }
    for (const o of this.lightG.children) if (o.userData.lod === 1) back.add(new THREE.Mesh(o.geometry, o.material));
    for (let l = 0; l < 3; l++) this.lv[l] = this.lv[l].filter((o) => o.userData.part !== 'light');
    body.remove(this.lightG);
    adopt(back);
    this._regions();   // (the front: in front of the tear, at every level)
    // (no whole-car far states any more)
    for (const k of ['far', 'min']) { const o = this[k]; if (!o) continue; const L = this.group.levels, i = L.findIndex((l) => l.object === o); if (i >= 0) L.splice(i, 1); this.group.remove(o); this[k] = null; }
    this.body.visible = true;
    this.half = root;
    if (replay) { root.userData.replay = true; (this.group.parent)?.add(root); const P = { rec, obj: root, ch: null, n: 0 }; this._pieces.set(rec.id, P); return; }
    if (rec) {   // (rebuilt: where its record has it, flying on from there if it still was)
      const P = { rec, obj: root, ch: CHUNKS ? CHUNKS.add(root, [0, 0, 0], [0, 0, 0], [1.0, 0.45, 0.85], 260) : null, n: 0 };
      this._pieces.set(rec.id, P); this._resume(P); return;
    }
    // its motion: the car's, plus the tear (backwards and up) and a tumble
    const v = car.v ? car.v : [...car.worldVel().slice(0, 1), 0, car.worldVel()[1]], c = Math.cos(car.th), s = Math.sin(car.th), r = () => Math.random() - 0.5;
    const R = { id: 'half@' + (car.splitT ?? car._now ?? 0), key: 'half@' + (car.splitT ?? 0), part: 'half', f: 0, n: 1, t0: car.splitT ?? car._now ?? 0, tr: [], done: false };
    (car.pieces || (car.pieces = [])).push(R); this._piecesRef = car.pieces;
    const ch = CHUNKS ? CHUNKS.add(root, [v[0] - c * 4, (v[1] || 0) + 2 + Math.random() * 3, v[2] - s * 4], [r() * 6, r() * 8, r() * 6], [1.0, 0.45, 0.85], 260) : null;
    this._pieces.set(R.id, { rec: R, obj: root, ch, n: 0 });
    if (FIRE) FIRE.add((out) => { if (!root.parent) return false; out.set(0.7, 0.2, 0).applyMatrix4(root.matrixWorld); return true; }, 'smoke', 0.9);
    if (DEBRIS) { const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 30, this.livery.color.getHex()); }
  }

  // ---- the damage, drawn from the car's record ----------------------------------------------------------------------
  /** this car's own copies of the shared materials (once it is dented: they bend by its dents - the same programs) */
  _ownMats() {
    if (this._owned) return;
    const M = carModel(), own = this._owned = new Map();
    this._ownOf = (mat, pv) => { const k = mat.uuid + '|' + pv.join(','); let m = own.get(k); if (!m) { m = ownCopy(mat, this.DU, pv); floodlit(m, true); this._own.add(m); own.set(k, m); } return m; };
    for (let l = 0; l < 3; l++) for (const o of this.lv[l]) {
      if (o.userData.wheel || o.userData.part === 'sw' || !SHARED_MAT.has(o.material)) continue;
      o.material = this._ownOf(o.material, M.pivots[o.userData.part] || [0, 0, 0]);
    }
  }
  /** a material for a piece of part `part` (its level-1 one: the paint, or this car's own copy of a shared one) */
  _pieceMat(part, mk) {
    const m = this._matFor(part, mk, 1);
    if (!SHARED_MAT.has(m) || part[0] === 'w') return m;   // (a wheel: never dented)
    this._ownMats(); return this._ownOf(m, carModel().pivots[part] || [0, 0, 0]);
  }
  /** every body and rear-wing mesh without the regions that have come off (and in front of the tear, once torn) */
  _regions() {
    for (let l = 0; l < 3; l++) for (const o of this.lv[l]) {
      const part = o.userData.part; if (!hasRegions(part) || !o.parent) continue;
      o.geometry = partGeo(part, l, o.userData.mk, this._mask, part === 'body' ? this._half : 0) || EMPTY;
    }
  }
  /** wheel k of the physics (FL FR RL RR) */
  _wheel(k) { const [f, sd] = [[true, -1], [true, 1], [false, -1], [false, 1]][k]; return this.wheels.find((w) => w.front === f && w.side === sd); }
  /**
   * The damage as the car's record has it at race time t (live: all of it) - the dents, what has come off, the car
   * torn in two, the pieces (replay: posed from their records, nothing thrown or flown). Cheap when nothing changed.
   */
  _sync(car, t = Infinity, replay = false) {
    // ---- the dents (the car's own materials from the first one)
    const D = car.dents;
    if (D && (D !== this._dentRef || car.dentVer !== this._dentVer || replay)) {
      this._dentRef = D; this._dentVer = car.dentVer;
      if (uploadDents(this.DU, D, t)) this._ownMats();
    }
    // ---- what has come off by then
    const L = car.lost || {}, gone = (k) => !!L[k] && L[k].t <= t + 1e-6, G = this._gone;
    let mask = 0; for (const R of REGIONS) if (gone(R[0])) mask |= REGION_BIT[R[0]];
    if (mask !== this._mask) { this._mask = mask; this._regions(); }
    for (const k of ['fw', 'fwL', 'fwR', 'rw', 'tcam', 'w0', 'w1', 'w2', 'w3']) G[k] = gone(k);
    this.fwL.visible = !G.fwL; this.fwR.visible = !G.fwR; this.frontWing.visible = !G.fw; this.rearWing.visible = !G.rw; this.tcamG.visible = !G.tcam;
    for (let k = 0; k < 4; k++) { const w = this._wheel(k); if (!w || w.half) continue; w.gone = G['w' + k]; w.hub.visible = !w.gone; }
    // ---- torn in two
    const halfRec = (car.pieces || []).find((r) => r.part === 'half');
    if (car.split && (car.splitT ?? 0) <= t + 1e-6 && !this.splitDone) this.split(car, halfRec || (replay ? { id: 'half', part: 'half', t0: car.splitT ?? 0, tr: [] } : null), replay);
    // ---- the pieces
    this._syncPieces(car, t, replay);
  }
  /** the pieces: new losses thrown, a rewound record (a flashback) taking its piece back to where it was then */
  _syncPieces(car, t, replay) {
    const recs = car.pieces || (car.pieces = []);
    if (replay) {
      for (const rec of recs) {
        let P = this._pieces.get(rec.id);
        if (rec.part === 'half') { P = this._pieces.get(rec.id) || this._pieces.get('half'); if (P && P.obj) posePiece(P.obj, rec, t); continue; }
        if (rec.t0 > t + 1e-6) { if (P) P.obj.visible = false; continue; }
        if (!P) { P = this._makePiece(rec, car); if (!P) continue; this._pieces.set(rec.id, P); P.obj.userData.replay = true; this.group.parent?.add(P.obj); }
        P.obj.visible = this._showPieces !== false && rec.tr.length > 0; posePiece(P.obj, rec, t);
      }
      return;
    }
    if (recs !== this._piecesRef) {   // (a snapshot restored, or this mesh new for a car that has lost things before)
      this._piecesRef = recs; const ids = new Set(recs.map((r) => r.id));
      for (const [id, P] of this._pieces) if (!ids.has(id)) { this._dropPiece(P); this._pieces.delete(id); }
      for (const rec of recs) {
        if (rec.part === 'half') { const P = this._pieces.get(rec.id); if (P) { P.rec = rec; this._resume(P); } continue; }
        let P = this._pieces.get(rec.id);
        if (!P) { P = this._makePiece(rec, car); if (!P) continue; this._pieces.set(rec.id, P); P.ch = CHUNKS ? CHUNKS.add(P.obj, [0, 0, 0], [0, 0, 0], P.half, P.mass) : null; }
        P.rec = rec; this._resume(P);
      }
    }
    // the parts that have come off since: thrown, in pieces (the harder the hit, the more)
    const L = car.lost || {};
    for (const [part, e] of Object.entries(L)) {
      if (part === 'half') continue;
      const key = part + '@' + e.t; if (recs.some((r) => r.key === key)) continue;
      const small = part === 'tcam' || part.startsWith('mir') || part === 'crash' || part[0] === 'w' && part.length === 2 || part === 'fwL' || part === 'fwR';
      const n = small ? 1 : e.v > 24 ? 3 : e.v > 13 ? 2 : 1;
      for (let f = 0; f < n; f++) {
        const rec = { id: key + '#' + f, key, part, f, n, t0: e.t, tr: [], done: false };
        const P = this._makePiece(rec, car); if (!P) { if (f === n - 1 && !recs.some((r) => r.key === key)) recs.push({ ...rec, done: true }); continue; }   // (a cell with no triangles: no piece; the loss is still marked as thrown)
        recs.push(rec); this._pieces.set(rec.id, P); this._throw(P, car, e.v);
      }
    }
    this._piecesRef = recs;
  }
  /** a piece's object (shared geometry, this car's materials), placed where that part is on the car now */
  _makePiece(rec, car) {
    const M = carModel(), part = rec.part, obj = new THREE.Group(); obj.name = 'car-piece';
    const meshes = [];   // [geometry, material, offset (model frame), quaternion]
    let C = null;
    if (part[0] === 'w' && part.length === 2) {
      const name = ['wFL', 'wFR', 'wRL', 'wRR'][+part[1]], H = M.hubs[name];
      for (const pn of [name, name + 's']) for (const [mk, g] of Object.entries(M.geo[pn]?.[1] || {})) meshes.push([g, this._pieceMat(pn, mk), [0, 0, 0], H.q]);
      C = H.c;
    } else {
      const ri = REGIONS.findIndex((R) => R[0] === part), list = [];
      if (ri >= 0) { const pn = REGIONS[ri][1]; for (const mk of Object.keys(M.geo[pn][1])) { const g = regionGeo(ri, 1, mk, rec.n > 1 ? rec.f : -1, rec.n); if (g) list.push([g, this._pieceMat(pn, mk), M.pivots[pn] || [0, 0, 0]]); } }
      else for (const pn of part === 'rw' ? ['rw', 'drs'] : [part]) for (const mk of Object.keys(M.geo[pn]?.[1] || {})) { const g = fragGeo(pn, 1, mk, rec.n > 1 ? rec.f : 0, rec.n); if (g) list.push([g, this._pieceMat(pn, mk), M.pivots[pn] || [0, 0, 0]]); }
      if (!list.length) return null;
      C = centreOf(list.map((x) => x[0]), list[0][2]);
      for (const [g, m, pv] of list) meshes.push([g, m, [pv[0] - C[0], pv[1] - C[1], pv[2] - C[2]], null]);
    }
    if (!meshes.length) return null;
    const box = new THREE.Box3();
    for (const [g, m, off, q] of meshes) {
      const o = new THREE.Mesh(g, m); o.position.set(...off); if (q) o.quaternion.set(...q); obj.add(o);
      box.union(triBox(g).clone().applyMatrix4(o.matrix.compose(o.position, o.quaternion, o.scale)));
    }
    // (where it is on the car now: the body's frame, at the piece's centre)
    this.group.updateMatrixWorld(true);
    obj.position.set(C[0], C[1], C[2]).applyMatrix4(this.body.matrixWorld); this.body.getWorldQuaternion(obj.quaternion);
    const sz = box.getSize(_sv), half = [Math.max(0.03, sz.x / 2), Math.max(0.03, sz.y / 2), Math.max(0.03, sz.z / 2)];
    return { rec, obj, ch: null, n: 0, half, mass: Math.max(0.6, Math.min(30, sz.x * sz.y * sz.z * 90)), C };
  }
  /** a new piece thrown off the car: its velocity there, flung outward and up (harder the harder the hit), tumbling */
  _throw(P, car, v) {
    if (!CHUNKS) return;
    const o = P.obj, r = () => Math.random() - 0.5;
    let vx, vy, vz, cx, cy, cz;
    if (car.p && (car.air || car.wreck) && car.v) { [vx, vy, vz] = car.v; [cx, cy, cz] = car.p; const w = car.w || [0, 0, 0], rx = o.position.x - cx, ry = o.position.y - cy, rz = o.position.z - cz; vx += w[1] * rz - w[2] * ry; vy += w[2] * rx - w[0] * rz; vz += w[0] * ry - w[1] * rx; }
    else { [vx, vz] = car.worldVel(); vy = 0; cx = car.x; cy = 0.4; cz = car.z; }
    const ox = o.position.x - cx, oz = o.position.z - cz, ol = Math.hypot(ox, oz) || 1, k = 1.5 + Math.min(8, (v || 0) * 0.18) * (0.6 + 0.8 * Math.random());
    P.ch = CHUNKS.add(o, [vx + ox / ol * k + r() * 2, vy + 1.2 + Math.random() * (1 + (v || 0) * 0.08), vz + oz / ol * k + r() * 2], [r() * 14, r() * 14, r() * 14], P.half, P.mass);
  }
  /** a piece rewound (a flashback) or rebuilt: back where its record last had it, flying on from there if it was still */
  _resume(P) {
    const rec = P.rec, tr = rec.tr, n = tr.length / 8;
    if (n) posePiece(P.obj, rec, Infinity);
    P.n = n;
    if (!P.ch) return;
    P.ch.done = !!rec.done; P.ch.rest = 0;
    if (n >= 2) { const a = (n - 2) * 8, b = (n - 1) * 8, dt = Math.max(1e-3, tr[b] - tr[a]); P.ch.v.set((tr[b + 1] - tr[a + 1]) / dt, (tr[b + 2] - tr[a + 2]) / dt, (tr[b + 3] - tr[a + 3]) / dt); }
    else P.ch.v.set(0, 0, 0);
    P.ch.w.set(0, 0, 0);
  }
  _dropPiece(P) { if (P.ch && CHUNKS) CHUNKS.remove(P.ch); P.obj.parent?.remove(P.obj); if (P.obj === this.half) this.half = null; }
  /** (live) the pieces' flight into their records, 20 times a second, until they lie still; one left on the racing
   *  surface is dragged off to the verge a while later (world/Debris.js sweep: where to) */
  _record(car) {
    const now = car._now || 0;
    for (const P of this._pieces.values()) {
      const rec = P.rec; if (!rec) continue;
      if (rec.done) {
        if (!rec.sweep && P.obj !== this.half && DEBRIS?.sweep && rec.tr.length && now - rec.tr[rec.tr.length - 8] > SWEEP_AFTER) {
          const o = P.obj.position, to = DEBRIS.sweep(o.x, o.z);
          rec.sweep = to ? [+now.toFixed(3), +o.x.toFixed(3), +o.z.toFixed(3), +to[0].toFixed(3), +to[1].toFixed(3)] : [now];   // ([now]: off the road already)
        }
        if (rec.sweep?.length > 1 && now - rec.sweep[0] < SWEEP_T + 0.2) posePiece(P.obj, rec, now);
        continue;
      }
      if (!P.ch) continue;
      const tr = rec.tr, last = tr.length ? tr[tr.length - 8] : -1;
      if (now - last < 0.05 && !P.ch.done) continue;
      const o = P.obj, p = o.position, q = o.quaternion;
      tr.push(+now.toFixed(3), +p.x.toFixed(3), +p.y.toFixed(3), +p.z.toFixed(3), +q.x.toFixed(4), +q.y.toFixed(4), +q.z.toFixed(4), +q.w.toFixed(4)); P.n++;
      if (P.ch.done || now - rec.t0 > 8) { rec.done = true; P.ch.done = true; }
    }
  }
  /** mesh o's material without this car's dents (a new part on it: the pit crew's spare wing) */
  undented(o) {
    const m = o.material; if (!m?.userData?.dents || m.userData.dents === NO_DENTS) return m;
    if (m.userData.src) return m.userData.src;                        // (a car's own copy of a shared material)
    if (m.userData.livery && !m.vertexColors) return this._paintClean(o.userData.part || 'body');
    return m;
  }
  /** show or hide this car's pieces (a replay draws its own) */
  showPieces(v) { this._showPieces = v; for (const P of this._pieces.values()) P.obj.visible = v; }
  /**
   * A replica in a replay (ui/NewsBroadcast.js, main.js' POV): car's damage as it was at race time t - dents, parts
   * gone, torn in two, the pieces where their records had them. (A replica torn in two cannot be made whole again:
   * the replay makes a new one when it runs again from before the tear - splitDone.)
   */
  replay(car, t) { this._sync(car, t, true); }

  /** a fire / smoke source on this car (body frame point), alive while the car's mesh is */
  _source(kind, bx, by, k, car) {
    if (!FIRE) return; if (kind === 'fire') car._burned = true;   // (the news replays it: ui/NewsBroadcast.js)
    FIRE.add((out) => { if (!this.group.parent) return false; this.body.localToWorld(out.set(bx, by, 0)); return true; }, kind, k, () => car.speed < 1 || car.wreck);
  }
  /** the parts of a tyre coming apart, built the first time this wheel punctures (hidden until then) */
  _buildRuin(w) {
    const R = new THREE.Group(), width = w.front ? TYRE_WF : TYRE_WR, rnd = Math.random;
    const rim = new THREE.Group(); rim.add(new THREE.Mesh(w.front ? rimF : rimR, bareRimMat));
    for (const s of [-1, 1]) { const f = new THREE.Mesh(flangeGeo, bareRimMat); f.position.z = s * (width / 2 - 0.01); rim.add(f); }
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
    w.camber.add(R); w.ruin = R;
  }
  /**
   * A punctured tyre, in stages as it comes apart (P: Failures' punctP, 0 -> 1 with the distance driven on it; -1 a
   * sound tyre): flat (to 0.35) - squashed at the bottom; delaminating (to 0.8) - the tread peeling off in strips that
   * flail as the wheel turns, the tyre sagging lower; coming off (to 1) - the tyre gone but for a torn band of carcass
   * and a few strips, the bare rim on the road; shredded (1) - the bare silver rim and the odd tatter.
   */
  _tyre(w, P, car, dt) {
    if (P < 0) {
      if (w.state) { w.state = 0; w.mesh.visible = true; w.hub.scale.set(1, 1, 1); if (w.ruin) w.ruin.visible = false; }
      return;
    }
    if (!w.ruin) this._buildRuin(w);
    const R = w.ruin, U = R.userData, bare = P >= 0.8, st = P < 0.35 ? 1 : P < 0.8 ? 2 : P < 1 ? 3 : 4;
    if (st !== w.state) {
      w.state = st; w.mesh.visible = !bare; R.visible = st > 1; U.rim.visible = bare; U.carcass.visible = bare;
      U.cords[1].visible = st === 3;
    }
    const sq = bare ? 1 : P < 0.35 ? 0.82 : 0.82 - 0.08 * (P - 0.35) / 0.45;   // (a sagging tyre; a rim is round)
    if (w.hub.scale.y !== sq) w.hub.scale.set(1, sq, 1);
    if (!R.visible) return;
    R.rotation.z = -this.spin;
    U.cords[0].visible = st === 3 || (st === 2 && P > 0.42); if (st === 2) U.cords[1].visible = P > 0.62;
    // the strips of tread: more and more of them peel off; once it is down to the rim a few short ones are left
    const n = st === 2 ? 1 + Math.floor((P - 0.35) / 0.45 * 4.99) : st === 3 ? 6 : 3;
    const hinge = bare ? 0.25 : 0.33, fl = Math.min(1, car.speed / 40), tt = (this._tt = (this._tt || 0) + dt);
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

  /** the driver's arms out to the grips of a wheel turned by a (rad, about its column) */
  _arms(a) {
    const q = _q.setFromAxisAngle(this._swAxis, a);
    for (const A of this.arms) {
      const g = _wp.copy(A.off).applyQuaternion(q).add(this._swP), d = _sv.copy(g).sub(A.sh), len = d.length();
      A.m.position.copy(A.sh).add(g).multiplyScalar(0.5); A.m.quaternion.setFromUnitVectors(_up, d.divideScalar(len)); A.m.scale.set(1, len, 1);
    }
  }
  update(car, dt) {
    if (this.wheelSteer) { const a = -(car.steer || 0) * 1.5; this.wheelSteer.rotation.x = a; if (this._lvNow === 0) this._arms(a); this.wheelDisp.emissiveIntensity = car.retired || car.wreck ? 0 : 0.55; }   // (the steering wheel, turned by the driver - arms and all; its display dead with the car)
    // ---- debris from this car's impacts, and the parts it has lost
    if (car.events.length) {
      for (const e of car.events) {
        if (e.kind === 'mangle') this._mangle(car);
        else if (e.kind === 'fire') this._source('fire', car.split ? SPLIT_X + 0.3 : -1.3, 0.55, e.sev, car);
        else if (e.kind === 'smoke') this._source('smoke', -2.0, 0.7, e.sev, car);
        else if (e.kind.startsWith('puncture')) { if (DEBRIS) for (let k = 0; k < 3; k++) DEBRIS.part('strip', e.x, 0.25, e.z, e.vx, e.vz, 0x0c0c0c, 2.5); if (FIRE) this._source('puff', 0, 0.2, 1, car); }
        else if (e.kind.startsWith('wheel') || e.kind === 'split') { /* (the car's record: _sync) */ }
        else if (DEBRIS) DEBRIS.burst(e.x, e.z, e.vx, e.vz, Math.min(16, 2 + Math.round(e.sev * 16)), this.livery.color.getHex());
      }
      car.events.length = 0;
    }
    // ---- pose: on the ground a yaw; airborne / wrecked the full attitude, turned about the body's centre
    if ((car.air || car.wreck) && car.q) {
      const q = car.q; this.group.quaternion.set(q[0], q[1], q[2], q[3]);
      _wp.set(0, 0.48, 0).applyQuaternion(this.group.quaternion);   // the body turns about its centre, 0.48 m above the mesh origin
      this._gy = TERRAIN.at(car.p[0], car.p[2]); this.group.position.set(car.p[0] - _wp.x, car.p[1] - _wp.y + this._gy, car.p[2] - _wp.z);
      this.shadow.visible = false; if (this.shadowFar) this.shadowFar.visible = false; if (this.shadowMin) this.shadowMin.visible = false;   // the blob shadow is a ground decal: not on a tumbling body
    } else {
      // the sprung body: heave, pitch (nose up = +z rotation in the mesh frame) and roll (left side up = +x)
      // (on a circuit that is not flat: on the ground under it, nose up the slope it is climbing and leaning with the
      //  camber across it - world/Terrain.js)
      let gy = 0, gp = 0, gr = 0;
      if (TERRAIN.on) { const g = TERRAIN.grad(car.x, car.z, _gr), c = Math.cos(car.th), s = Math.sin(car.th); gy = TERRAIN.at(car.x, car.z); gp = Math.atan(g[0] * c + g[1] * s); gr = Math.atan(g[0] * s - g[1] * c); }
      this.group.rotation.set(car.rl + gr, -car.th, car.pt + gp, 'YZX');
      this.group.position.set(car.x, car.hv + gy, car.z); this._gy = gy;
    }
    const dMax = Math.max(0.055, 0.38 * (1 - car.speed / 118));
    // (the wheels' turn as drawn: never more than half a spoke's spacing a frame - beyond it the ten spokes strobed and
    //  stood still, or ran backwards; past ~25 km/h a blurred disc fades in over the rim and the lettering, as a camera
    //  sees a wheel at speed)
    { const da = car.vLong / R_TYRE * dt; this.spin += Math.sign(da) * Math.min(Math.abs(da), 0.3); }
    const blur = this._lvNow < 2 ? Math.max(0, Math.min(0.88, (Math.abs(car.vLong) - 7) / 30)) : 0;
    this.blurMat.opacity = blur; for (const w of this.wheels) if (w.blur) w.blur.visible = blur > 0.01 && w.mesh.visible;
    const onGround = !car.air && !car.wreck, W = car.wh;
    for (const w of this.wheels) {
      if (w.gone) continue;
      if (w.front) w.hub.rotation.y = car.steer * dMax * 1.2;
      w.spin.rotation.z = -this.spin;
      // each wheel stays on the road under it (kerb, grass) while the body moves on its springs
      const k = (w.front ? 0 : 2) + (w.side < 0 ? 0 : 1), flat = car.punct === k;
      // a puncture: the tyre's state as it comes apart (_tyre), the wheel lower and lower on the road
      const P = flat ? (car.punctShred ? 1 : Math.min(0.999, car.punctP || 0)) : -1;
      this._tyre(w, P, car, dt);
      // (the wheel's travel on its springs against the body: a few centimetres, smoothed - read raw, the physics' step to
      //  step jitter shook the wheel against its suspension)
      if (onGround) { w.dy += (Math.max(-0.035, Math.min(0.06, W.def[k])) - w.dy) * Math.min(1, dt * 18); w.hub.position.y = w.y0 + w.dy - (P < 0 ? 0 : P < 0.8 ? 0.07 + 0.03 * Math.max(0, (P - 0.35) / 0.45) : 0.115); }
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
    // the DRS flap: open (its trailing edge lifted, the slot wide) when the car's DRS is (RaceDirector / DRS.js), shut else
    const drsOpen = !!car.drs;
    this.drs.rotation.z += ((drsOpen ? -0.42 : 0) - this.drs.rotation.z) * Math.min(1, dt * 8);
    // damage: what has come off, the dents, the pieces (the car's record: _sync); a bent wing droops
    const d = car.dmg;
    this._sync(car); if (dt > 0) this._record(car);
    this.fwL.rotation.x = d.fwL * 0.6; this.fwR.rotation.x = -d.fwR * 0.6; this.rearWing.rotation.x = d.rw * 0.5;
    // a bent front wing droops on its damaged side, a broken wishbone leans its wheel
    this.frontWing.rotation.x = (d.fwR - d.fwL) * 0.12; this.frontWing.rotation.z = -Math.max(d.fwL, d.fwR) * 0.08;
    if (d.susp > 0.3) { const w = this.wheels[car.suspSide > 0 ? 0 : 1]; w.hub.rotation.z = d.susp * 0.35; }
    this.rearLight.material.emissiveIntensity = car.brake > 0.3 || car.wetness > 0.3 ? 3 : 0.8;
    // (a recovered wreck stays where the marshals set it down, for the rest of the race)
    this.group.visible = !(car.ghost > 0 && Math.floor(car.ghost * 8) % 2 === 0);
    // (the far states: the geometry of what it still has, once that has changed - a lost wing or wheel, a crumpled car)
    const sig = this._signature(); if (sig !== this._sig) { this._sig = sig; this._bake(); }
  }
}
