// Dev only (not part of the game or the bundle): the party crowd's lab - world/PartyCrowd.js and the club templates of
// world/Crowd.js on their own, rendered and saved through the scratch screenshot server on 8768. From any page of the
// dev server (no game boot needed: it brings its own import map if the page has none):
//   await import('/tools/crowdlab.js')
//   await __G([{ spec, cols, misc }], 'name', [['f', 0], ['s', -Math.PI / 2]])   a row of templates (club material, unlit by the beat)
//   await __CLUB({ occ: 1, cam: [x, y, z], look: [x, y, z], beat, name, kind: 'club' | 'team' })   a 24 x 18 m club full of people
//   __CLUB.crowd.stats(), __CLUB.step(dt, beat)
import * as THREE from 'three';
import * as C from '../src/world/Crowd.js';
import * as PP from '../src/world/People.js';
import * as PC from '../src/world/PartyCrowd.js';

const cv = document.createElement('canvas'), R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
const save = async (name) => (await fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: cv.toDataURL('image/jpeg', 0.9) })).status;

// ---- a row of templates ----------------------------------------------------------------------------------------------------
const S = new THREE.Scene(); S.background = new THREE.Color('#5d6470');
S.add(new THREE.HemisphereLight('#dfe8ff', '#4a4038', 1.2)); { const a = new THREE.DirectionalLight('#fff3e2', 2.0); a.position.set(4, 6, 3); S.add(a); const b = new THREE.DirectionalLight('#c8d8ff', 0.8); b.position.set(-4, 3, -3); S.add(b); }
{ const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: '#2a2a30', roughness: 0.9 })); fl.rotation.x = -Math.PI / 2; S.add(fl); }
let row = [];
const col = new THREE.Color();
window.__G = async (list, name, views = [['f', 0]], o = {}) => {
  for (const m of row) { S.remove(m); m.geometry.dispose(); } row = [];
  const w = o.w || 2400, h = o.h || 1100, gap = o.gap || 0.85, fov = o.fov || 20; R.setSize(w, h, false);
  const mat = PC.clubMaterial(null, false); mat.userData.u.uLift.value = o.lift ?? 0; mat.userData.u.uBeat.value = o.beat ?? 0; mat.userData.u.uEnergy.value = o.energy ?? 0;
  list.forEach((it, i) => {
    const src = it.geo || (it.spec.far ? C.bakeFarTemplate(it.spec) : C.templateOf(it.spec)), g = new THREE.BufferGeometry(); for (const a in src.attributes) g.setAttribute(a, src.attributes[a]); if (src.index) g.setIndex(src.index);
    const c = it.cols || {}, A = (v) => { col.set(v); return new THREE.InstancedBufferAttribute(new Float32Array([col.r, col.g, col.b]), 3); };
    g.setAttribute('iSkin', A(c.skin || '#c99a72')); g.setAttribute('iTop', A(c.top || '#b5121b')); g.setAttribute('iLegs', A(c.legs || c.skin || '#c99a72')); g.setAttribute('iHair', A(c.hair || '#2a1e17')); g.setAttribute('iAcc', A(c.acc || '#0d0d10')); g.setAttribute('iTeam', A(c.team || c.top || '#b5121b'));
    g.setAttribute('iMisc', new THREE.InstancedBufferAttribute(new Float32Array(it.misc || [0, 1, 0.08, 0.6]), 4));
    const m = new THREE.InstancedMesh(g, mat, 1); m.setMatrixAt(0, new THREE.Matrix4()); m.position.set(0, 0, (i - (list.length - 1) / 2) * gap); m.frustumCulled = false; S.add(m); row.push(m);
  });
  const cam = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100), t = Math.tan(fov / 2 * Math.PI / 180);
  const span = (list.length - 1) * gap + 0.8, dist = o.dist || Math.max(2.1 / (2 * t), span / (2 * t * (w / h)));
  const st = [];
  for (const [v, yaw] of views) { for (const m of row) m.rotation.y = yaw; cam.position.set(dist, o.cy ?? 1.0, o.cz ?? 0); cam.lookAt(0, o.ty ?? 0.9, o.cz ?? 0); R.render(S, cam); st.push(await save(name + '_' + v)); }
  return st;
};

// ---- a leak check: her legs blue, the cloth green, the rest red, orthographic from 8 sides - any blue with the cloth
// below it in its column is a thigh through the skirt -> { worst (pixels), at (degrees) } -------------------------------
const cv2 = document.createElement('canvas'), R2 = new THREE.WebGLRenderer({ canvas: cv2, preserveDrawingBuffer: true }); R2.setSize(300, 600, false); R2.setPixelRatio(1);
const S2 = new THREE.Scene(); S2.background = new THREE.Color(0, 0, 0); S2.add(new THREE.AmbientLight('#ffffff', 2.5));
const ocam = new THREE.OrthographicCamera(-0.5, 0.5, 2.0, 0, 0.1, 20), buf = new Uint8Array(300 * 600 * 4);
window.__LEAK = async (spec, name) => {
  const mat = PC.clubMaterial(null, false); mat.userData.u.uLift.value = 0; mat.userData.u.uEnergy.value = 0;
  const src = spec.far ? C.bakeFarTemplate(spec) : C.templateOf(spec), g = new THREE.BufferGeometry(); for (const a in src.attributes) g.setAttribute(a, src.attributes[a]); if (src.index) g.setIndex(src.index);
  const A = (r, gg, b) => new THREE.InstancedBufferAttribute(new Float32Array([r, gg, b]), 3);
  g.setAttribute('iSkin', A(1, 0, 0)); g.setAttribute('iTop', A(0, 1, 0)); g.setAttribute('iLegs', A(0, 0, 1)); g.setAttribute('iHair', A(1, 0, 0)); g.setAttribute('iAcc', A(0, 1, 0)); g.setAttribute('iTeam', A(0, 1, 0)); g.setAttribute('iMisc', new THREE.InstancedBufferAttribute(new Float32Array([0, 0, 0, 0]), 4));
  const m = new THREE.InstancedMesh(g, mat, 1); m.setMatrixAt(0, new THREE.Matrix4()); m.frustumCulled = false; S2.add(m);
  let worst = 0, at = null; const isB = (i) => buf[i + 2] > 60 && buf[i + 2] > 2 * buf[i] && buf[i + 2] > 2 * buf[i + 1], isG = (i) => buf[i + 1] > 60 && buf[i + 1] > 2 * buf[i] && buf[i + 1] > 2 * buf[i + 2];
  for (let a = 0; a < 8; a++) {
    const th = a * Math.PI / 4; ocam.position.set(Math.cos(th) * 5, 0, -Math.sin(th) * 5); ocam.lookAt(0, 0, 0); ocam.updateMatrixWorld();
    R2.render(S2, ocam); const gl = R2.getContext(); gl.readPixels(0, 0, 300, 600, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    let n = 0;
    for (let x = 0; x < 300; x++) { let seenG = false, run = 0; for (let y = 0; y < 330; y++) { const i = (y * 300 + x) * 4; if (isG(i)) { seenG = true; n += run; run = 0; } else if (isB(i) && seenG) run++; else run = 0; } }
    if (n > worst) { worst = n; at = a * 45; if (name) await (async () => (await fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: cv2.toDataURL('image/png') })).status)(); }
  }
  S2.remove(m); g.dispose();
  return { worst, at };
};

// ---- hero people (makePerson at full detail) in a row, every view stacked into one image ---------------------------------------
let heroes = [];
window.__HL = async (defs, name, views = [['f', 0], ['s', -Math.PI / 2], ['b', Math.PI]], o = {}) => {
  for (const p of heroes) { S.remove(p.group); p.dispose?.(); } heroes = [];
  const w = o.w || 2400, h = o.h || 760, gap = o.gap || 0.8, fov = o.fov || 20; R.setSize(w, h, false);
  defs.forEach((d, i) => { const p = PP.makePerson(d); p.group.position.set(0, d.y || 0, (i - (defs.length - 1) / 2) * gap); S.add(p.group); heroes.push(p); });
  const cam = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100), t = Math.tan(fov / 2 * Math.PI / 180);
  const span = (defs.length - 1) * gap + 0.8, dist = o.dist || Math.max(2.0 / (2 * t), span / (2 * t * (w / h)));
  const out = document.createElement('canvas'); out.width = w; out.height = h * views.length; const x = out.getContext('2d');
  views.forEach(([v, yaw], k) => { for (const p of heroes) p.group.rotation.y = yaw; cam.position.set(dist, o.cy ?? 0.95, 0); cam.lookAt(0, o.ty ?? 0.92, 0); R.render(S, cam); x.drawImage(cv, 0, k * h); });
  return (await fetch('http://127.0.0.1:8768/save?name=' + name, { method: 'POST', body: out.toDataURL('image/jpeg', 0.88) })).status;
};

// ---- a club, full ------------------------------------------------------------------------------------------------------------
/** a 24 x 18 m room (x along its length, the DJ at +x): a 9 x 7 m floor in the middle, the bar along -z, booths at -x, the door at +z */
function clubSpots(kind) {
  const S = [], R = (a, b) => a + Math.random() * (b - a);
  if (kind === 'team') {
    for (let i = 0; i < 26; i++) S.push({ x: R(-7, 7), z: R(-4.5, 4.5), yaw: R(0, 6.28), zone: i < 8 ? 'bar' : 'tables', from: 22 + i * 0.05 });
    for (let i = 0; i < 10; i++) S.push({ x: R(4, 7), z: R(-4.5, 4.5), yaw: Math.PI, zone: 'garage', role: 'mechanic', from: 24.5 });
    S.push({ x: -6, z: 4, yaw: 0, zone: 'bar', role: 'server', from: 0 }, { x: 0, z: -5, yaw: Math.PI / 2, zone: 'door', role: 'photographer', from: 0 });
    return S;
  }
  // the floor: in rough rows facing the DJ (+x), a little loose
  for (let i = 0; i < 52; i++) { const x = R(-4.2, 4.2), z = R(-3.3, 3.3); S.push({ x, z, look: { x: 11, z: z * 0.3 }, zone: 'floor', from: 23.5 + (Math.abs(x) + Math.abs(z)) * 0.1 + R(0, 1) }); }
  // the bar along -z: facing it, at the counter (lean) or a step back with a drink
  for (let i = 0; i < 16; i++) { const x = -8 + i * 1.0, back = i % 3 === 2; S.push({ x, z: -7.6 + (back ? 0.9 : 0), yaw: -Math.PI / 2 + R(-0.3, 0.3), zone: 'bar', lean: !back, from: 23 + R(0, 2) }); }
  // booths at -x: sitting, and standing about the tables
  for (let b = 0; b < 4; b++) { const z = -5 + b * 3.2; for (let k = 0; k < 2; k++) S.push({ x: -10.4, z: z - 0.5 + k, yaw: 0, zone: 'vip', seat: true, y: 0.45, from: 23.5 + R(0, 2) }); S.push({ x: -8.7, z, yaw: Math.PI, zone: 'vip', y: 0.45, from: 24 + R(0, 2) }); }
  S.push({ x: 9.4, z: -4, yaw: Math.PI, zone: 'podium', y: 1.0, from: 0 }, { x: 9.4, z: 4, yaw: Math.PI, zone: 'podium', y: 1.0, from: 0 });
  S.push({ x: 4, z: 8.3, yaw: -Math.PI / 2, zone: 'door', role: 'security', from: 0 }, { x: -6, z: -6.4, yaw: 0, zone: 'bar', role: 'photographer', from: 0 }, { x: 6, z: 7.5, yaw: -2.5, zone: 'door', role: 'photographer', from: 0 });
  for (let i = 0; i < 3; i++) S.push({ x: -7.5 + i * 0.6, z: -1 + i * 2, yaw: 0, zone: 'vip', role: 'server', from: 0 });
  for (let i = 0; i < 2; i++) S.push({ x: 7.5, z: -1 + i * 2, yaw: Math.PI, zone: 'floor', role: 'promo', from: 0 });
  return S;
}
const W = new THREE.Scene(); W.background = new THREE.Color('#07060c');
const hemi = new THREE.HemisphereLight('#7a6cff', '#1a1020', 0.9), key = new THREE.DirectionalLight('#ffd2e8', 1.1); key.position.set(3, 6, 2); W.add(hemi, key);
{
  const m = (c, r = 0.8) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), m('#141218', 0.5)); fl.rotation.x = -Math.PI / 2; W.add(fl);
  const df = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), new THREE.MeshBasicMaterial({ color: '#2a1440' })); df.rotation.x = -Math.PI / 2; df.position.y = 0.005; W.add(df);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(14, 1.08, 0.7), m('#1c1a20', 0.4)); bar.position.set(-1, 0.54, -8.4); W.add(bar);
  for (let b = 0; b < 4; b++) { const z = -5 + b * 3.2; const s = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.48, 2.2), m('#3a1020', 0.9)); s.position.set(-10.55, 0.45 + 0.24, z); W.add(s); const bk = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 2.2), m('#3a1020', 0.9)); bk.position.set(-10.95, 0.45 + 0.6, z); W.add(bk); const tb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 1.0), m('#222', 0.3)); tb.position.set(-9.6, 0.45 + 0.22, z); W.add(tb); }
  const plat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.45, 16), m('#18161c')); plat.position.set(-10, 0.225, 0); W.add(plat);
  for (const z of [-4, 4]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.0, 20), m('#d0d0d8', 0.2)); p.position.set(9.4, 0.5, z); W.add(p); }
  const dj = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 3), m('#101014', 0.3)); dj.position.set(10.8, 0.55, 0); W.add(dj);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(18, 5.5), new THREE.MeshBasicMaterial({ color: '#3b1a7a' })); wall.rotation.y = -Math.PI / 2; wall.position.set(11.99, 2.75, 0); W.add(wall);
}
window.__CLUB = async (o = {}) => {
  const c = __CLUB;
  if (!c.crowd || o.rebuild) {
    c.crowd?.dispose();
    const crowd = c.crowd = new PC.PartyCrowd({ night: true, bpm: 124, patch: null, lift: 0.08 });
    const t0 = performance.now(), steps = crowd.build(clubSpots(o.kind || 'club'), { kind: o.kind || 'club', brand: { name: 'Ampwave', color: '#14e0c8', accent: '#0d0d10' }, team: { color: '#1e3a8a', accent: '#f4f1ea' }, seed: o.seed, occ: o.occ ?? 1, cam: { x: o.cam?.[0] ?? -2, z: o.cam?.[2] ?? 6 } });
    c.stepTimes = []; for (const f of steps) { const t = performance.now(); f(); c.stepTimes.push(Math.round(performance.now() - t)); }
    c.buildMs = Math.round(performance.now() - t0); c.steps = steps.length;
    W.add(crowd.group);
  }
  const w = o.w || 1536, h = o.h || 864; R.setSize(w, h, false);
  const cam = c.cam || (c.cam = new THREE.PerspectiveCamera(60, w / h, 0.05, 100)); cam.aspect = w / h; cam.updateProjectionMatrix();
  const P = o.cam || [-2, 1.66, 6], L = o.look || [3, 1.3, 0]; cam.position.set(...P); cam.lookAt(...L);
  const fwd = new THREE.Vector3(); cam.getWorldDirection(fwd);
  c.crowd.update(1 / 60, cam.position, o.beat ?? 0.25, o.occ ?? 1, { x: fwd.x, z: fwd.z }); c.crowd.snap();
  R.info.reset(); R.render(W, cam);
  const st = { calls: R.info.render.calls, tris: R.info.render.triangles, crowd: c.crowd.stats(), programs: R.info.programs.length, buildMs: c.buildMs, steps: c.steps, stepTimes: c.stepTimes };
  if (o.name) st.saved = await save(o.name);
  return st;
};
__CLUB.step = (dt, beat, occ = 1) => __CLUB.crowd.update(dt, __CLUB.cam.position, beat, occ);
window.__LAB = { THREE, C, PP, PC, R, S, W };
