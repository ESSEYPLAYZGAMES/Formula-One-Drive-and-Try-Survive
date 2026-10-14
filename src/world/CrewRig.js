// A pit-crew member who can move: one skinned mesh (one draw call) on a skeleton of seventeen bones - hips, spine,
// chest, neck, head, shoulders, elbows, hands, hips, knees, ankles - in a fireproof race suit in the team's colours
// (an accent band, black gloves and boots) and a helmet with a dark visor. Built standing, facing +x (left: +z).
// Poses are joint angles (pose(), blended by the caller): about z swings a limb forward (a leg or arm hanging down)
// or leans the spine back; about x takes an arm out to the side (negative for the left, positive for the right).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const BONES = ['hips', 'spine', 'chest', 'neck', 'head', 'shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'thL', 'knL', 'anL', 'thR', 'knR', 'anR'];
const BI = Object.fromEntries(BONES.map((b, i) => [b, i]));
// rest positions, relative to the parent bone
const REST = {
  hips: [null, 0, 0.95, 0], spine: ['hips', 0, 0.08, 0], chest: ['spine', 0, 0.24, 0], neck: ['chest', 0, 0.17, 0], head: ['neck', 0, 0.09, 0],
  shL: ['chest', 0, 0.11, 0.19], elL: ['shL', 0, -0.29, 0.01], haL: ['elL', 0, -0.26, 0],
  shR: ['chest', 0, 0.11, -0.19], elR: ['shR', 0, -0.29, -0.01], haR: ['elR', 0, -0.26, 0],
  thL: ['hips', 0, -0.03, 0.1], knL: ['thL', 0, -0.42, 0], anL: ['knL', 0, -0.41, 0],
  thR: ['hips', 0, -0.03, -0.1], knR: ['thR', 0, -0.42, 0], anR: ['knR', 0, -0.41, 0],
};
const V = (x, y, z) => new THREE.Vector3(x, y, z), UP = V(0, 1, 0);
// (colour slots: 0 suit, 1 accent, 2 black, 3 helmet, 4 visor)
function tag(g, bone, slot) {
  g = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal') g.deleteAttribute(a);
  const n = g.attributes.position.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), sl = new Float32Array(n);
  for (let i = 0; i < n; i++) { si[i * 4] = BI[bone]; sw[i * 4] = 1; sl[i] = slot; }
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); g.setAttribute('slot', new THREE.BufferAttribute(sl, 1));
  return g;
}
function limb(a, b, r1, r2, seg = 9) {
  const d = V().subVectors(b, a), L = Math.max(0.001, d.length());
  const tube = new THREE.CylinderGeometry(r2, r1, L, seg, 1, true).translate(0, L / 2, 0); tube.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize())); tube.translate(a.x, a.y, a.z);
  const j1 = new THREE.SphereGeometry(r1, seg, 6).translate(a.x, a.y, a.z), j2 = new THREE.SphereGeometry(r2, seg, 6).translate(b.x, b.y, b.z);
  return mergeGeometries([tube, j1, j2].map((g) => g.index ? g.toNonIndexed() : g));
}
let BASE = null;
/** the geometry, in the rest pose (built once, shared) */
function baseGeometry() {
  if (BASE) return BASE;
  const W = {}; for (const b of BONES) { const [p, x, y, z] = REST[b]; W[b] = V(x, y, z).add(p ? W[p] : V()); }
  const G = [];
  const add = (g, bone, slot) => G.push(tag(g, bone, slot));
  // pelvis, belly, chest (deeper than wide), a band of the accent at the waist and across the chest, shoulders
  add(new THREE.CapsuleGeometry(0.125, 0.12, 4, 10).rotateX(Math.PI / 2).scale(0.85, 1, 1).translate(0, 0.93, 0), 'hips', 0);
  add(new THREE.CapsuleGeometry(0.12, 0.15, 4, 10).scale(0.78, 1, 1.02).translate(0.005, 1.1, 0), 'spine', 0);
  add(new THREE.CylinderGeometry(0.127, 0.127, 0.045, 12, 1, true).scale(0.8, 1, 1.04).translate(0.005, 1.02, 0), 'spine', 1);
  add(new THREE.CapsuleGeometry(0.14, 0.13, 4, 12).scale(0.74, 1, 1.05).translate(0.01, 1.3, 0), 'chest', 0);
  add(new THREE.CylinderGeometry(0.147, 0.147, 0.06, 12, 1, true).scale(0.76, 1, 1.06).translate(0.01, 1.31, 0), 'chest', 1);
  for (const s of [1, -1]) add(new THREE.SphereGeometry(0.062, 10, 7).scale(0.95, 0.8, 1).translate(0, 1.38, s * 0.155), 'chest', 1);
  add(limb(W.chest.clone().add(V(0, 0.1, 0)), W.neck.clone().add(V(0.01, 0.06, 0)), 0.062, 0.055), 'neck', 0);
  // the helmet: a shell in the team's colour, the dark visor across the front, an accent stripe over the top
  const hc = W.head.clone().add(V(0.01, 0.08, 0));
  add(new THREE.SphereGeometry(0.131, 14, 10).scale(1.06, 1.04, 0.95).translate(hc.x, hc.y, hc.z), 'head', 3);
  add(new THREE.SphereGeometry(0.135, 12, 6, -0.9, 1.8, Math.PI * 0.36, Math.PI * 0.22).scale(1.06, 1.04, 0.95).translate(hc.x, hc.y, hc.z), 'head', 4);
  add(new THREE.SphereGeometry(0.1335, 14, 4, 0, Math.PI * 2, 0, Math.PI * 0.5).scale(1.06, 1.04, 0.2).translate(hc.x, hc.y + 0.002, hc.z), 'head', 1);
  // arms (a cuff of the accent at the wrist), black gloves
  for (const s of ['L', 'R']) {
    const sh = W['sh' + s], el = W['el' + s], ha = W['ha' + s];
    add(limb(sh, el, 0.058, 0.047), 'sh' + s, 0);
    add(limb(el, ha.clone().add(V(0, 0.02, 0)), 0.046, 0.039), 'el' + s, 0);
    add(new THREE.CylinderGeometry(0.042, 0.042, 0.035, 9, 1, true).translate(ha.x, ha.y + 0.035, ha.z), 'el' + s, 1);
    add(new THREE.CapsuleGeometry(0.036, 0.07, 3, 8).scale(1.05, 1, 0.7).translate(ha.x + 0.005, ha.y - 0.04, ha.z), 'ha' + s, 2);
    // legs, black boots (toe forward)
    const th = W['th' + s], kn = W['kn' + s], an = W['an' + s];
    add(limb(th, kn, 0.088, 0.064), 'th' + s, 0);
    add(limb(kn, an.clone().add(V(0, 0.03, 0)), 0.061, 0.045), 'kn' + s, 0);
    add(new THREE.CapsuleGeometry(0.052, 0.17, 3, 9).rotateZ(Math.PI / 2).scale(1, 0.8, 1).translate(an.x + 0.06, 0.05, an.z), 'an' + s, 2);
  }
  BASE = mergeGeometries(G); G.forEach((g) => g.dispose());
  BASE.computeBoundingSphere();
  return BASE;
}

/** a crew member: { mesh (add to the scene; move/turn it), b (bones by name), recolor(team, accent), dispose() } */
export function makeCrewRig(o = {}) {
  const geo = baseGeometry().clone();
  const n = geo.attributes.position.count; geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0.05 });
  const b = {}, bones = BONES.map((k) => { const x = new THREE.Bone(); x.name = k; b[k] = x; return x; });
  for (const k of BONES) { const [p, x, y, z] = REST[k]; b[k].position.set(x, y, z); if (p) b[p].add(b[k]); }
  const mesh = new THREE.SkinnedMesh(geo, mat); mesh.add(b.hips); mesh.frustumCulled = false; mesh.name = 'crew-rig';
  mesh.updateMatrixWorld(true); mesh.bind(new THREE.Skeleton(bones));
  const rec = (team, accent) => {
    const C = [new THREE.Color(team), new THREE.Color(accent || '#ffffff'), new THREE.Color('#0d0e10'), new THREE.Color(team), new THREE.Color('#07080a')];
    C[0].multiplyScalar(0.92);
    const sl = geo.attributes.slot.array, col = geo.attributes.color.array;
    for (let i = 0; i < n; i++) { const c = C[sl[i]]; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    geo.attributes.color.needsUpdate = true;
  };
  rec(o.team || '#555b66', o.accent || '#ffffff');
  if (o.night) { mat.emissive.set('#ffffff'); mat.emissiveIntensity = 0.0; }
  return { mesh, b, recolor: rec, dispose() { geo.dispose(); mat.dispose(); } };
}

// ---- poses ---------------------------------------------------------------------------------------------------------
// A pose: { y (hips down from standing, m), [bone]: [rx, ry, rz] }. The ankles keep the feet flat unless given.
const P = (o) => o;
export const POSE = {
  stand: P({ y: 0, shL: [-0.1, 0, 0.05], shR: [0.1, 0, 0.05], elL: [0, 0, 0.12], elR: [0, 0, 0.12] }),
  // waiting for the car: crouched, weight forward, hands on the knees, looking up the lane
  ready: P({ y: 0.13, thL: [0, 0, 0.6], thR: [0, 0, 0.6], knL: [0, 0, -1.0], knR: [0, 0, -1.0], spine: [0, 0, -0.4], chest: [0, 0, -0.15], neck: [0, 0, 0.3], head: [0, 0, 0.15], shL: [-0.15, 0, 0.6], shR: [0.15, 0, 0.6], elL: [0, 0, 0.35], elR: [0, 0, 0.35] }),
  // a gunner on one knee at the wheel, the gun in both hands at the hub
  gun: P({ y: 0.42, thL: [0, 0, 1.45], knL: [0, 0, -1.5], thR: [0, 0, -0.1], knR: [0, 0, -1.5], anR: [0, 0, 0.0], spine: [0, 0, -0.42], chest: [0, 0, -0.18], neck: [0, 0, 0.32], head: [0, 0, 0.1], shL: [-0.18, 0, 1.15], shR: [0.18, 0, 1.15], elL: [0, 0, 0.45], elR: [0, 0, 0.45] }),
  // done: still kneeling, the right hand up
  gunUp: P({ y: 0.42, thL: [0, 0, 1.45], knL: [0, 0, -1.5], thR: [0, 0, -0.1], knR: [0, 0, -1.5], spine: [0, 0, -0.2], neck: [0, 0, 0.2], shL: [-0.18, 0, 1.1], elL: [0, 0, 0.45], shR: [0.25, 0, 2.95], elR: [0, 0, 0.15] }),
  // a tyre held in front at hub height, crouched, hands either side of it
  hold: P({ y: 0.2, thL: [0, 0, 0.85], thR: [0, 0, 0.85], knL: [0, 0, -1.35], knR: [0, 0, -1.35], spine: [0, 0, -0.45], chest: [0, 0, -0.15], neck: [0, 0, 0.35], shL: [-0.42, 0, 1.0], shR: [0.42, 0, 1.0], elL: [0, 0, 0.15], elR: [0, 0, 0.15] }),
  // a tyre carried at the waist, upright
  carry: P({ y: 0.02, spine: [0, 0, 0.08], shL: [-0.38, 0, 0.55], shR: [0.38, 0, 0.55], elL: [0, 0, 0.95], elR: [0, 0, 0.95] }),
  // a jack: the handle at waist height in both hands, braced
  jack: P({ y: 0.06, thL: [0, 0, 0.4], thR: [0, 0, 0.05], knL: [0, 0, -0.55], knR: [0, 0, -0.2], spine: [0, 0, -0.25], neck: [0, 0, 0.2], shL: [-0.15, 0, 0.8], shR: [0.15, 0, 0.8], elL: [0, 0, 0.25], elR: [0, 0, 0.25] }),
  // a jack pulled down: leaning back on it
  jackUp: P({ y: 0.14, thL: [0, 0, 0.55], thR: [0, 0, 0.25], knL: [0, 0, -0.9], knR: [0, 0, -0.6], spine: [0, 0, 0.18], neck: [0, 0, -0.05], shL: [-0.12, 0, 0.55], shR: [0.12, 0, 0.55], elL: [0, 0, 0.05], elR: [0, 0, 0.05] }),
  // holding the car steady: leaning in, both hands on the bodywork
  steady: P({ y: 0.08, thL: [0, 0, 0.45], thR: [0, 0, 0.2], knL: [0, 0, -0.6], knR: [0, 0, -0.3], spine: [0, 0, -0.6], chest: [0, 0, -0.2], neck: [0, 0, 0.45], shL: [-0.2, 0, 1.15], shR: [0.2, 0, 1.15], elL: [0, 0, 0.3], elR: [0, 0, 0.3] }),
  // kneeling low at the front wing
  wing: P({ y: 0.44, thL: [0, 0, 1.4], knL: [0, 0, -1.55], thR: [0, 0, -0.05], knR: [0, 0, -1.5], spine: [0, 0, -0.55], chest: [0, 0, -0.2], neck: [0, 0, 0.4], shL: [-0.25, 0, 1.0], shR: [0.25, 0, 1.0], elL: [0, 0, 0.5], elR: [0, 0, 0.5] }),
  // a wing carried between two, at thigh height, walking
  wingCarry: P({ y: 0.08, thL: [0, 0, 0.3], thR: [0, 0, 0.3], knL: [0, 0, -0.5], knR: [0, 0, -0.5], spine: [0, 0, -0.3], shL: [-0.3, 0, 0.75], shR: [0.3, 0, 0.75], elL: [0, 0, 0.2], elR: [0, 0, 0.2] }),
  // the chief: standing, the left arm out to release the car
  release: P({ y: 0, shL: [-0.2, 0, 1.55], elL: [0, 0, 0.05], shR: [0.1, 0, 0.05], neck: [0, -0.5, 0] }),
};
/** a run (or a walk: k = 0.5) at phase ph; arms swinging unless given */
export function gait(ph, k = 1, arms = true) {
  const s = Math.sin(ph), c = Math.cos(ph);
  const o = {
    y: 0.03 * k + 0.035 * k * Math.abs(Math.sin(ph)),
    thL: [0, 0, 0.12 * k + 0.7 * k * s], thR: [0, 0, 0.12 * k - 0.7 * k * s],
    knL: [0, 0, -0.25 * k - 1.0 * k * Math.max(0, -Math.sin(ph - 0.7))], knR: [0, 0, -0.25 * k - 1.0 * k * Math.max(0, Math.sin(ph - 0.7))],
    spine: [0, 0, -0.22 * k], neck: [0, 0, 0.18 * k],
  };
  if (arms) Object.assign(o, { shL: [-0.12, 0, -0.65 * k * s], shR: [0.12, 0, 0.65 * k * s], elL: [0, 0, 0.4 + 0.9 * k], elR: [0, 0, 0.4 + 0.9 * k] });
  void c; return o;
}
const ZERO = [0, 0, 0];
/** cur := cur moved toward pose by f (0..1); returns cur. Missing bones go to zero. */
export function blendPose(cur, pose, f) {
  cur.y = (cur.y || 0) + ((pose.y || 0) - (cur.y || 0)) * f;
  for (const k of BONES) { const a = cur[k] || (cur[k] = [0, 0, 0]), t = pose[k] || ZERO; for (let i = 0; i < 3; i++) a[i] += (t[i] - a[i]) * f; }
  return cur;
}
/** a pose onto a rig (feet kept flat on the ground unless the pose sets the ankles) */
export function applyPose(rig, p) {
  const b = rig.b;
  b.hips.position.y = REST.hips[2] - (p.y || 0);
  for (const k of BONES) { if (k === 'hips') continue; const r = p[k] || ZERO; b[k].rotation.set(r[0], r[1], r[2]); }
  for (const s of ['L', 'R']) {
    const t = p['th' + s] || ZERO, kk = p['kn' + s] || ZERO, a = p['an' + s];
    b['an' + s].rotation.z = a && (a[2] || a[0]) ? a[2] : -(t[2] + kk[2]);
  }
}
