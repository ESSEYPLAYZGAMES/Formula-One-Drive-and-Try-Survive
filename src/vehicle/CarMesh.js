// The F1 car: the 2026 model (vehicle/CarModel.js - its parts and their levels of detail, shared by the whole field) in
// a team's livery (vehicle/Livery.js), its wheels turning and steering, the DRS flap working, losing its wings, its
// wheels and its shape in a crash, coming apart. Forward = +x, y up, z to the right; the ground is y = 0, the body
// frame's origin sits CG_X ahead of the group's (the physics' centre of gravity).
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
import { helmetTexture } from '../world/HelmetDesigns.js';
import { TERRAIN } from '../world/Terrain.js';
import { carModel } from './CarModel.js';
import { liveryFor, liveryUniforms, paintWith } from './Livery.js';

/** the car's states by distance from the camera (m, at the default lens) */
const D_ULTRA = 9, D_HIGH = 38, LOD_FAR = 95, LOD_MIN = 260;
let DEBRIS = null;
/** the scene's debris system (world/Debris.js): broken parts and shards are thrown into it */
export function setDebris(d) { DEBRIS = d; }
let FIRE = null, CHUNKS = null;
/** the fire / smoke particles (world/Fire.js) and the free halves of split cars (world/Chunks.js) */
export function setFire(f) { FIRE = f; }
export function setChunks(c) { CHUNKS = c; }
const SPLIT_X = -0.62;   // body frame: where a car tears in two - behind the survival cell, ahead of the engine
const CG_X = 0.16, R_TYRE = 0.354;
const _sv = new THREE.Vector3(), _m4 = new THREE.Matrix4(), _m4b = new THREE.Matrix4(), _wp = new THREE.Vector3(), _gr = [0, 0], _up = new THREE.Vector3(0, 1, 0);

/**
 * Cut a geometry by the plane x = X (its own frame): [front (x >= X), back] as two new non-indexed geometries, every
 * triangle that crosses the plane clipped along it (all attributes interpolated), so the tear is a clean edge.
 */
function cutGeometry(geo, X) {
  const g = geo.index ? geo.toNonIndexed() : geo, names = Object.keys(g.attributes), atts = names.map((n) => g.attributes[n]);
  const sizes = atts.map((a) => a.itemSize), stride = sizes.reduce((a, b) => a + b, 0), posOff = sizes.slice(0, names.indexOf('position')).reduce((a, b) => a + b, 0);
  const vert = (i) => { const v = new Float32Array(stride); let o = 0; atts.forEach((a, k) => { for (let j = 0; j < sizes[k]; j++) v[o + j] = a.getComponent ? a.getComponent(i, j) : a.array[i * sizes[k] + j]; o += sizes[k]; }); return v; };
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
    atts.forEach((a, k) => { const sz = sizes[k], arr = new Float32Array(list.length * sz); list.forEach((v, j) => { for (let q = 0; q < sz; q++) arr[j * sz + q] = v[o + q]; }); ng.setAttribute(names[k], new THREE.BufferAttribute(arr, sz, a.normalized && !(a.array instanceof Float32Array) ? false : a.normalized)); o += sz; });
    ng.computeBoundingSphere(); return ng;
  };
  return [F.length ? build(F) : null, B.length ? build(B) : null];
}

// ---- shared parts: the punctured tyre's (the wrecked tyre and the bare rim), the helmet, the blob shadow
const TYRE_WF = 0.346, TYRE_WR = 0.402, R_RIM = 0.2286;
const rimF = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WF - 0.02, 20); rimF.rotateX(Math.PI / 2);
const rimR = new THREE.CylinderGeometry(R_RIM, R_RIM, TYRE_WR - 0.02, 20); rimR.rotateX(Math.PI / 2);
const helmetGeo = new THREE.SphereGeometry(0.145, 28, 20), helmetFar = new THREE.SphereGeometry(0.145, 8, 5), visorBandGeo = new THREE.SphereGeometry(0.13, 16, 8, -0.75, 1.5, 1.15, 0.5);
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
const SHARED_GEO = new Set([rimF, rimR, helmetGeo, helmetFar, visorBandGeo, shadowGeo, flangeGeo, carcassGeo, tatterGeo, cordGeo]);
const SHARED_MAT = new Set([rubber, shadowMat, visorMat, bareRimMat, cordMat]);

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
    MAT[k] = new THREE.MeshStandardMaterial(o); SHARED_MAT.add(MAT[k]);
  }
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
    const paint = new Map(), far = new Map();
    // (one per part with a pivot of its own, and the wing it is on: the wing layers paint the wings by their flag)
    const paintMat = (pv, part = 0) => { const k = pv.join(',') + '|' + part; if (!paint.has(k)) { const m = paintWith(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: spec.finish?.rough ?? 0.3, metalness: spec.finish?.metal ?? 0.15, envMapIntensity: 0.9 }), U, pv, 'paint', part); own.add(m); paint.set(k, m); } return paint.get(k); };
    const farMat = (pv, part = -1) => { const k = pv.join(',') + '|' + part; if (!far.has(k)) { const m = paintWith(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.2 }), U, pv, 'far', part); own.add(m); far.set(k, m); } return far.get(k); };
    const wingOf = (name) => (name === 'fw' || name === 'fwL' || name === 'fwR' ? 1 : name === 'rw' || name === 'drs' ? 2 : 0);
    this._farMat = farMat;
    this.tcamMat = new THREE.MeshStandardMaterial({ color: opts.tcamColor ?? 0xffd400, roughness: 0.45, metalness: 0.1 }); own.add(this.tcamMat);
    const lightMat = new THREE.MeshStandardMaterial({ map: M.tex.light, color: 0x501010, emissive: 0xff1010, emissiveMap: M.tex.light, emissiveIntensity: 0.8 }); own.add(lightMat);
    this.rearLight = { material: lightMat };
    this.wheelDisp = new THREE.MeshStandardMaterial({ color: 0x0b1016, emissive: 0x1d8fd0, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.2 }); own.add(this.wheelDisp);   // (the steering wheel's display, lit)
    let numMat = null;
    if (opts.number != null) {
      const N = spec.num || { c: '#ffffff', edge: '#000000' };
      numMat = new THREE.MeshStandardMaterial({ map: numberTexture(opts.number, opts.driver, opts.driver ? opts.driver.split(' ').pop().slice(0, 3).toUpperCase() : '', N.c, N.edge), transparent: true, alphaTest: 0.3, roughness: 0.35, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
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
    this.lv = [[], [], []];
    /** a part's meshes, levels 0-2 (those it has), into parent (its pivot's frame) */
    const put = (parent, name, levels = [0, 1, 2]) => {
      const P = M.geo[name]; if (!P) return;
      for (const lv of levels) {
        const L = P[lv]; if (!L) continue;
        for (const [k, g] of Object.entries(L)) {
          const mat = matFor(name, k, lv); if (!mat) continue;
          const m = new THREE.Mesh(g, mat); m.userData.lod = lv; m.userData.part = name; if (k === 'tyre' && lv < 2) m.userData.tyre = true;
          parent.add(m); this.lv[lv].push(m);
        }
      }
    };
    const at = (name) => { const g = new THREE.Group(); g.position.set(...(M.pivots[name] || [0, 0, 0])); return g; };

    // ---- the static body (the tub, nose, sidepods, engine cover, floor, suspension), its T-cam, number and rain lights
    put(body, 'body'); put(body, 'tcam'); put(body, 'light'); if (numMat) put(body, 'number', [0, 1]);
    // the halo (toggled with H)
    this.halo = at('halo'); put(this.halo, 'halo'); body.add(this.halo);

    // ---- the driver: the helmet (their own design if they have one - world/HelmetDesigns.js - else one colour; u = 0
    //      turned to face forward), the visor's dark band, the shoulders and arms out to the wheel, the gloves on it
    const HX = 0.2, HY = 0.79;
    const hmap = opts.driver ? helmetTexture(opts.driver, { size: 512 }) : null;
    const helmet = new THREE.Mesh(helmetGeo, new THREE.MeshStandardMaterial(hmap ? { map: hmap, roughness: 0.22, metalness: 0.12 } : { color: new THREE.Color(opts.helmet || '#ffffff'), roughness: 0.25, metalness: 0.15 }));
    own.add(helmet.material);
    if (hmap) helmet.rotation.y = Math.PI;
    helmet.scale.setScalar(0.9); helmet.position.set(HX, HY, 0); helmet.userData.role = 'helmet';
    body.add(helmet); this.helmet = helmet;
    const visor = new THREE.Mesh(visorBandGeo, visorMat); visor.position.copy(helmet.position); body.add(visor); this.visor = visor;   // (ULTRA and HIGH)
    const suit = new THREE.Color(opts.glove || opts.color2 || spec.base);
    const suitMat = new THREE.MeshStandardMaterial({ color: suit, roughness: 0.8 }); own.add(suitMat);
    const swP = M.pivots.sw || [0.72, 0.61, 0];
    const driver = new THREE.Group();
    { const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.28, 4, 10).rotateZ(Math.PI / 2).scale(1, 0.75, 1.25).translate(HX - 0.02, 0.6, 0), suitMat); driver.add(torso); }
    // (the arms: from the shoulders to the grips, following them round as the wheel turns - _arms)
    this.arms = [];
    for (const σ of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 1, 8), suitMat); driver.add(arm);
      this.arms.push({ m: arm, sh: new THREE.Vector3(HX + 0.04, 0.64, σ * 0.19), off: new THREE.Vector3(-0.035, -0.005, σ * 0.115) });
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
          const m = new THREE.Mesh(g, matFor(part, k, lv)); m.userData.lod = lv; if (k === 'tyre' && lv < 2) m.userData.tyre = true;
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
    this.spin = 0; this.lost = {}; this.mangled = false;

    // ---- the far states: one mesh each (shared geometry), their own blob shadows
    this.far = new THREE.Group(); this.farMesh = new THREE.Mesh(farGeometry(3, () => true), farMat([0, 0, 0])); this.farMesh.position.x = CG_X; this.shadowFar = new THREE.Mesh(shadowGeo, shadowMat); this.shadowFar.position.x = CG_X; this.far.add(this.farMesh, this.shadowFar);
    this.min = new THREE.Group(); this.minMesh = new THREE.Mesh(farGeometry(4, () => true), farMat([0, 0, 0])); this.minMesh.position.x = CG_X; this.shadowMin = new THREE.Mesh(shadowGeo, shadowMat); this.shadowMin.position.x = CG_X; this.min.add(this.minMesh, this.shadowMin);
    this.group.addLevel(body, 0); this.group.addLevel(this.far, LOD_FAR); this.group.addLevel(this.min, LOD_MIN);
    this._sig = this._signature();
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
      this.visor.visible = lv <= 1;
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
  _drop(kind, o, car, color, kick) {
    if (!DEBRIS) return; const p = this._wpos(o); const [vx, vz] = car.air ? [car.wvx, car.wvz] : car.worldVel();
    DEBRIS.part(kind, p.x, Math.max(0.2, p.y), p.z, vx, vz, color, kick);
  }
  /** the big one: the bodywork crumples and is scorched (which parts come off is the physics' call: wheelK events, wing damage) */
  _mangle(car) {
    if (this.mangled) return; this.mangled = true;
    this.U.uLivBurn.value = 0.7; this.livery.color.multiplyScalar(0.62); this.accent.color.multiplyScalar(0.62);
    this.body.scale.set(0.96, 1, 1.03); this.body.rotation.x = (Math.random() - 0.5) * 0.08;   // crumpled, twisted tub (height kept: the physics' contact points are on it)
    this.halo.rotation.z = (Math.random() - 0.5) * 0.2;
    if (DEBRIS) { const [vx, vz] = car.worldVel(); DEBRIS.burst(car.x, car.z, vx, vz, 24, this.livery.color.getHex()); }
  }
  /**
   * The car torn in two (Car.splitApart): everything aft of SPLIT_X - the rear wing, the rear wheels, the back of the
   * tub and engine cover (its meshes cut triangle by triangle: the HIGH state's, which this car now keeps) - moves into a
   * group of its own that world/Chunks.js flies as a rigid body; this mesh keeps the front half. The far states go.
   */
  split(car) {
    if (this.splitDone || !CHUNKS) return; this.splitDone = true;
    // (from now on the HIGH state: cutting the finest one, a hundred thousand triangles, held the frame up)
    this._lockLv = 1; this._lvNow = -1; this.detail(this.group.position, this._zoom);
    const body = this.body; this.group.updateMatrixWorld(true);
    // the half's centre (body frame) and the group that carries it
    const C = new THREE.Vector3((SPLIT_X - 2.6) / 2, 0.45, 0), root = new THREE.Group(); root.name = 'car-half';
    body.localToWorld(root.position.copy(C)); body.getWorldQuaternion(root.quaternion); root.updateMatrixWorld(true);
    const inv = _m4b.copy(root.matrixWorld).invert();
    const adopt = (o) => { o.updateMatrixWorld(true); _m4.multiplyMatrices(inv, o.matrixWorld); o.parent?.remove(o); _m4.decompose(o.position, o.quaternion, o.scale); root.add(o); };
    // whole parts
    adopt(this.rearWing);
    for (const w of this.wheels) if (!w.front) { adopt(w.hub); w.gone = true; }
    // the body's meshes (its own frame: the body's), cut in two
    const cut = [];
    for (const o of body.children) if (o.isMesh && o.userData.part && o.userData.part !== 'number' && o.userData.lod === 1) cut.push(o);
    for (const o of body.children) if (o.isMesh && o.userData.part && o.userData.lod !== 1) o.visible = false;
    for (const o of cut) {
      const [front, rear] = cutGeometry(o.geometry, SPLIT_X);
      if (!rear) continue;
      const back = new THREE.Mesh(rear, o.material); back.userData.ownGeo = true; body.add(back); adopt(back);
      if (front) { o.geometry = front; o.userData.ownGeo = true; } else o.visible = false;
    }
    // (no whole-car far states any more)
    for (const k of ['far', 'min']) { const o = this[k]; if (!o) continue; const L = this.group.levels, i = L.findIndex((l) => l.object === o); if (i >= 0) L.splice(i, 1); this.group.remove(o); this[k] = null; }
    this.body.visible = true;
    // its motion: the car's, plus the tear (backwards and up) and a tumble
    const v = car.v ? car.v : [...car.worldVel().slice(0, 1), 0, car.worldVel()[1]], c = Math.cos(car.th), s = Math.sin(car.th), r = () => Math.random() - 0.5;
    this.half = root;   // (the rear half: its flight is remembered for the news replay, main.js)
    CHUNKS.add(root, [v[0] - c * 4, (v[1] || 0) + 2 + Math.random() * 3, v[2] - s * 4], [r() * 6, r() * 8, r() * 6], [1.0, 0.45, 0.85], 260);
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
  /** wheel k (FL FR RL RR) torn off: it flies on as debris */
  _loseWheel(k, car) {
    const order = [[true, -1], [true, 1], [false, -1], [false, 1]][k];
    const w = this.wheels.find((x) => x.front === order[0] && x.side === order[1]) || this.wheels[k];
    if (!w || w.gone) return; this._drop('tyre', w.hub, car, 0x141414, 9); w.hub.visible = false; w.gone = true;
  }

  update(car, dt) {
    if (this.wheelSteer) { const a = -(car.steer || 0) * 1.5; this.wheelSteer.rotation.x = a; if (this._lvNow === 0) this._arms(a); this.wheelDisp.emissiveIntensity = car.retired || car.wreck ? 0 : 0.55; }   // (the steering wheel, turned by the driver - arms and all; its display dead with the car)
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
    // (the far states: the geometry of what it still has, once that has changed - a lost wing or wheel, a crumpled car)
    const sig = this._signature(); if (sig !== this._sig) { this._sig = sig; this._bake(); }
  }
}
