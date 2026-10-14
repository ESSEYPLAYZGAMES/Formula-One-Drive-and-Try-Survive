// Dev only (not part of the game): renders people from world/People.js in a lineup and saves the shots through the
// scratch screenshot server on 8768. In the page console: await import('/tools/lineup.js'); await __L(defs, 'name', [['f', 0], ['s', -Math.PI / 2]])
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as P from '../src/world/People.js';
import * as Ce from '../src/career/Celebs.js';

const cv = document.createElement('canvas'), R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
const S = new THREE.Scene(); S.background = new THREE.Color('#8f98a6');
S.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), 0.04).texture; S.environmentIntensity = 0.5;
S.add(new THREE.HemisphereLight('#dfe8ff', '#4a4038', 0.9)); const sun = new THREE.DirectionalLight('#fff3e2', 2.2); sun.position.set(4, 6, 3); S.add(sun);
let ppl = [];
/** defs: makePerson options each; views: [[suffix, yaw]]; o: { w, h, gap, dist, cy, ty, fov } -> statuses */
window.__L = async (defs, name, views = [['f', 0]], o = {}) => {
  for (const p of ppl) { S.remove(p.group); p.dispose?.(); } ppl = [];
  const w = o.w || 2400, h = o.h || 1100, gap = o.gap || 0.85, fov = o.fov || 20; R.setSize(w, h, false);
  const cam = new THREE.PerspectiveCamera(fov, w / h, 0.1, 100), t = Math.tan(fov / 2 * Math.PI / 180);
  defs.forEach((d, i) => { const p = P.makePerson(d); p.group.position.set(0, 0, (i - (defs.length - 1) / 2) * gap); S.add(p.group); ppl.push(p); });
  const span = (defs.length - 1) * gap + 0.8, dist = o.dist || Math.max(2.1 / (2 * t), span / (2 * t * (w / h)));
  const st = [];
  for (const [v, yaw] of views) { for (const p of ppl) p.group.rotation.y = yaw; cam.position.set(dist, o.cy ?? 1.0, o.cz ?? 0); cam.lookAt(0, o.ty ?? 0.9, o.cz ?? 0); R.render(S, cam); st.push((await fetch('http://127.0.0.1:8768/save?name=' + name + '_' + v, { method: 'POST', body: cv.toDataURL('image/jpeg', 0.9) })).status); }
  return st;
};
window.__LP = { THREE, P, Ce, R, S, tris: () => ppl.map((p) => { let n = 0; p.group.traverse((m) => { if (m.isMesh) n += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; }); return Math.round(n); }) };
