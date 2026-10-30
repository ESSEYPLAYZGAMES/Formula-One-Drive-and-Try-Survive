// A pit-crew member who is a person (world/People.js: the race suit, the build, the hands and boots, an open-face crew
// helmet) and who moves like the crew rig (world/CrewRig.js): the person built once in its bind pose - standing, the arms
// out at 40 degrees, clear of the body - and every vertex skinned to the rig's seventeen bones by how near it lies to
// each bone's segment (a blend between a bone and its neighbour at the joints, so an elbow bends without a crease). One
// skinned mesh, one draw call, coloured per vertex (recolor: the team's colours, as the rig's). The same API as
// makeCrewRig - { mesh, b, recolor, dispose }, posed with CrewRig's poses: applyPose takes the bind pose's arms back
// to hanging (rig.apply).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makePerson, jointsOf } from './People.js';
import { BONES } from './CrewRig.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const PARENT = { hips: null, spine: 'hips', chest: 'spine', neck: 'chest', head: 'neck', shL: 'chest', elL: 'shL', haL: 'elL', shR: 'chest', elR: 'shR', haR: 'elR', thL: 'hips', knL: 'thL', anL: 'knL', thR: 'hips', knR: 'thR', anR: 'knR' };
const BI = Object.fromEntries(BONES.map((b, i) => [b, i]));
// (colour slots: 0 the suit (the team's colour), 1 the legs (a shade darker), 2 the accent, 3 as built - boots, visor; 4 gloves and balaclava)
const SLOT = { top: 0, team: 0, band: 0, legs: 1, accent: 2, skin: 4 };
const GLOVE = new THREE.Color('#17181b');

const TEMPLATES = new Map();
/** the skinned geometry of one build, in the bind pose, and the bones' places in it (built once, shared) */
function template(build) {
  if (TEMPLATES.has(build)) return TEMPLATES.get(build);
  const p = makePerson({ pose: 'rig', kit: 'suit', color: '#ffffff', accent: '#ffffff', crewHelmet: true, jitter: 0, build, segQ: 0.6 });
  const J = jointsOf('rig');
  // the bones' heads (in the bind pose): the hips at the pelvis, the spine at the waist, the chest below the shoulders,
  // the neck at its base, the head where the person's head turns; the limbs at their joints
  const W = {
    hips: J.pelvis, spine: J.torsoA, chest: V(0, 1.22, 0), neck: V(0, 1.43, 0), head: p.neck.clone(),
    shL: J.shL, elL: J.elL, haL: J.wrL, shR: J.shR, elR: J.elR, haR: J.wrR,
    thL: J.hipL, knL: J.kneeL, anL: J.ankleL, thR: J.hipR, knR: J.kneeR, anR: J.ankleR,
  };
  const along = (a, b, k) => b.clone().sub(a).multiplyScalar(k).add(b);
  // each bone's segment and how thick the body is about it (distances are measured in its own thickness: a vertex of
  // the chest's side by the arm is the chest's, though it lies nearer the arm's line)
  const SEG = {
    hips: [V(0, 0.84, 0), J.torsoA, 0.15], spine: [J.torsoA, W.chest, 0.15], chest: [W.chest, W.neck, 0.16], neck: [W.neck, W.head, 0.07], head: [W.head, W.head.clone().add(V(0, 0.25, 0)), 0.13],
    shL: [W.shL, W.elL, 0.06], elL: [W.elL, W.haL, 0.05], haL: [W.haL, along(W.elL, W.haL, 0.8), 0.045],
    shR: [W.shR, W.elR, 0.06], elR: [W.elR, W.haR, 0.05], haR: [W.haR, along(W.elR, W.haR, 0.8), 0.045],
    thL: [W.thL, W.knL, 0.085], knL: [W.knL, W.anL, 0.06], anL: [W.anL, W.anL.clone().add(V(0.2, -0.05, 0)), 0.05],
    thR: [W.thR, W.knR, 0.085], knR: [W.knR, W.anR, 0.06], anR: [W.anR, W.anR.clone().add(V(0.2, -0.05, 0)), 0.05],
  };
  const adj = (a, b) => PARENT[a] === b || PARENT[b] === a;
  const keyOf = new Map(Object.entries(p.mats).map(([k, m]) => [m, k]));
  const inHead = (o) => { for (let q = o; q; q = q.parent) if (q === p.head) return true; return false; };
  p.group.updateMatrixWorld(true);
  const parts = [], ab = V(0, 0, 0), ap = V(0, 0, 0), v = V(0, 0, 0);
  p.group.traverse((o) => {
    if (!o.isMesh) return;
    const g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld);
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') g.deleteAttribute(k);
    if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
    const n = g.attributes.position.count, P = g.attributes.position, C = g.attributes.color;
    const key = keyOf.get(o.material), slot = SLOT[key] ?? 3, mc = o.material.color;
    const base = new Float32Array(n * 3), sl = new Float32Array(n), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
    const head = inHead(o);
    for (let i = 0; i < n; i++) {
      // (its shade as built - the baked light and dark of it - times the material's colour, for the fixed parts)
      const r = C ? C.getX(i) : 1, gg = C ? C.getY(i) : 1, bb = C ? C.getZ(i) : 1;
      if (slot === 3) { base[i * 3] = r * mc.r; base[i * 3 + 1] = gg * mc.g; base[i * 3 + 2] = bb * mc.b; } else { base[i * 3] = r; base[i * 3 + 1] = gg; base[i * 3 + 2] = bb; }
      sl[i] = slot;
      if (head) { si[i * 4] = BI.head; sw[i * 4] = 1; continue; }
      v.fromBufferAttribute(P, i);
      let b1 = null, d1 = Infinity, b2 = null, d2 = Infinity;
      for (const k of BONES) {
        const [a, b, rr] = SEG[k]; ab.subVectors(b, a); ap.subVectors(v, a);
        const t = Math.max(0, Math.min(1, ap.dot(ab) / Math.max(1e-9, ab.lengthSq()))), d = ap.addScaledVector(ab, -t).length() / rr;
        if (d < d1) { b2 = b1; d2 = d1; b1 = k; d1 = d; } else if (d < d2) { b2 = k; d2 = d; }
      }
      si[i * 4] = BI[b1];
      if (b2 && adj(b1, b2)) { const w = 1 / (1 + Math.exp(-(d2 - d1) * 9)); sw[i * 4] = w; si[i * 4 + 1] = BI[b2]; sw[i * 4 + 1] = 1 - w; } else sw[i * 4] = 1;
    }
    if (g.attributes.color) g.deleteAttribute('color');
    g.setAttribute('base', new THREE.BufferAttribute(base, 3)); g.setAttribute('slot', new THREE.BufferAttribute(sl, 1));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
    parts.push(g);
  });
  const geo = mergeGeometries(parts); parts.forEach((g) => g.dispose()); p.dispose();
  geo.computeBoundingSphere();
  // the arms' angle out from hanging in the bind pose (applyPose turns them back)
  const out = (s) => Math.atan2(Math.abs(W['el' + s].z - W['sh' + s].z), W['sh' + s].y - W['el' + s].y);
  const T = { geo, W, aL: out('L'), aR: out('R') };
  TEMPLATES.set(build, T); return T;
}

const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _c = new THREE.Quaternion(), _ci = new THREE.Quaternion();
/** a crew member who is a person: { mesh, b, recolor(team, accent), apply(pose), dispose() } (o.build: 'broad' | 'athletic' | 'average') */
export function makePersonRig(o = {}) {
  const T = template(o.build || 'broad'), geo = T.geo.clone();
  const n = geo.attributes.position.count; geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0.04 });
  const b = {}, bones = BONES.map((k) => { const x = new THREE.Bone(); x.name = k; b[k] = x; return x; });
  for (const k of BONES) { const p = PARENT[k]; b[k].position.copy(T.W[k]).sub(p ? T.W[p] : V(0, 0, 0)); if (p) b[p].add(b[k]); }
  const mesh = new THREE.SkinnedMesh(geo, mat); mesh.add(b.hips); mesh.frustumCulled = false; mesh.name = 'crew-person';
  mesh.updateMatrixWorld(true); mesh.bind(new THREE.Skeleton(bones));
  const hipsY = T.W.hips.y;
  // (the arms' correction: the bind pose's arm out at angle a about x; a pose's rotations are for an arm hanging)
  const CL = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), -T.aL), CR = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), T.aR);   // (CrewRig: about -x the left arm goes out)
  const rec = (team, accent) => {
    const tc = new THREE.Color(team).multiplyScalar(0.92), C = [tc, tc.clone().multiplyScalar(0.82), new THREE.Color(accent || '#ffffff'), null, GLOVE];
    const sl = geo.attributes.slot.array, bs = geo.attributes.base.array, col = geo.attributes.color.array;
    for (let i = 0; i < n; i++) { const c = C[sl[i]], k = i * 3; if (c) { col[k] = bs[k] * c.r; col[k + 1] = bs[k + 1] * c.g; col[k + 2] = bs[k + 2] * c.b; } else { col[k] = bs[k]; col[k + 1] = bs[k + 1]; col[k + 2] = bs[k + 2]; } }
    geo.attributes.color.needsUpdate = true;
  };
  rec(o.team || '#555b66', o.accent || '#ffffff');
  const ZERO = [0, 0, 0];
  /** a CrewRig pose onto the person: the same joint angles; the arms taken from the bind pose's to hanging first */
  const apply = (p) => {
    b.hips.position.y = hipsY - (p.y || 0);
    for (const k of BONES) {
      if (k === 'hips') continue;
      const r = p[k] || ZERO; _e.set(r[0], r[1], r[2]); _q.setFromEuler(_e);
      const s = k.endsWith('L') && k.length === 3 && (k[0] === 's' || k[0] === 'e' || k[0] === 'h') ? CL : k.endsWith('R') && k.length === 3 && (k[0] === 's' || k[0] === 'e' || k[0] === 'h') ? CR : null;
      if (!s) { b[k].quaternion.copy(_q); continue; }
      // shoulder: the pose then the bind pose undone (P C^-1); elbow, hand: the pose in the hanging arm's frame (C P C^-1)
      _ci.copy(s).invert();
      if (k[0] === 's') b[k].quaternion.copy(_q).multiply(_ci); else b[k].quaternion.copy(s).multiply(_q).multiply(_ci);
    }
    for (const s of ['L', 'R']) {
      const t = p['th' + s] || ZERO, kk = p['kn' + s] || ZERO, a = p['an' + s];
      _e.set(0, 0, a && (a[2] || a[0]) ? a[2] : -(t[2] + kk[2])); b['an' + s].quaternion.setFromEuler(_e);
    }
  };
  void _c;
  return { mesh, b, recolor: rec, apply, dispose() { geo.dispose(); mat.dispose(); } };
}
/** the templates built ahead (a session's start, not the first stop) */
export function warmPersonRigs() { for (const k of ['broad', 'athletic', 'average']) template(k); }
