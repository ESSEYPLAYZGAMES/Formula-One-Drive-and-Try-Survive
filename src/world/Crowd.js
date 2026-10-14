// A crowd of people on foot (the grid before the start): a few dozen body templates - pose, kit, hair, facial hair,
// cap, a prop (a phone, a camera, a TV camera) - each built once by world/People.js at a light segment count and
// baked into one geometry whose vertices know which part they are (skin, shirt, trousers, hair, ...). Each template
// is one InstancedMesh; every person in it has their own colours (per-instance attributes, picked by part in the
// shader), so three hundred people are a couple of dozen draw calls and look like three hundred different people.
// A club's crowd (world/PartyCrowd.js) bakes its own templates through the same two bakers with spec.club set: women
// and men in their clubwear (figure, build, the kit's shoes, cut and fabric, earrings and a chain), a drink in the hand,
// kept indexed and with an 'aux' attribute per vertex - the cloth's own shading (a lining's shadow, lace, sequins), and
// how much of each vertex is the head's with the neck it turns about, so a head nods on its own neck (hers too) with no
// tear. Without spec.club everything here is exactly as it was (the grid's, the stands' and the podium's crowds).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makePerson, jointsOf } from './People.js';

// (metal: earrings, a chain, a bottle's foil; lipF: her lips, coloured; glass: a glass and its drink; flame: a sparkler's)
const PART = { skin: 0, top: 1, legs: 2, hair: 3, feat: 3, beard: 3, shoe: 4, accent: 5, bottom: 5, acc: 5, team: 6, white: 7, iris: 8, lip: 9, visor: 10, prop: 11, metal: 12, metal2: 12, lipF: 13, glass: 14, flame: 15 };
export const SKINS = ['#f1d3bd', '#e7bf9f', '#d8a47f', '#c18a63', '#a4704c', '#8a5a3b', '#6b442c', '#4f3122', '#f5dccb', '#cf9e7c'];
export const HAIRS = ['#1b1512', '#2a1e17', '#3b2a1e', '#5a3d27', '#7a5434', '#a77d4c', '#c9a46c', '#8f8f8f', '#d8d3c8', '#121212', '#4a2a1a'];
const HS = ['short', 'short', 'buzz', 'side', 'quiff', 'swept', 'curly', 'wavy', 'mullet', 'locs'];
const FH = [null, null, null, 'stubble', 'beard', 'mustache'];
const pick = (a) => a[(Math.random() * a.length) | 0];

/** a prop in the template's own frame (facing +x), for a pose */
function prop(kind) {
  const B = (w, h, d, x, y, z, rz = 0) => new THREE.BoxGeometry(w, h, d).rotateZ(rz).translate(x, y, z);
  if (kind === 'phone') return [B(0.012, 0.15, 0.075, 0.42, 1.56, -0.11)];
  if (kind === 'selfie') return [B(0.012, 0.15, 0.075, 0.46, 1.69, -0.24, 0.35)];
  if (kind === 'photo') {
    const lens = new THREE.CylinderGeometry(0.038, 0.042, 0.16, 10).rotateZ(Math.PI / 2).translate(0.47, 1.52, 0);
    return [B(0.1, 0.1, 0.15, 0.35, 1.53, 0), lens];
  }
  if (kind === 'tvcam') {
    const lens = new THREE.CylinderGeometry(0.06, 0.07, 0.22, 10).rotateZ(Math.PI / 2).translate(0.5, 1.6, -0.17);
    return [B(0.5, 0.22, 0.16, 0.12, 1.62, -0.17), lens, B(0.1, 0.06, 0.06, 0.0, 1.76, -0.17)];
  }
  if (kind === 'lanyard') return [B(0.06, 0.09, 0.012, 0.15, 1.12, 0.0)];
  if (kind === 'flag') {
    // a team flag on a short pole held up in the right hand (the flag pose), the cloth in the team's colour
    const pole = new THREE.CylinderGeometry(0.011, 0.011, 0.95, 6).translate(0.13, 2.18, -0.24);
    const cloth = new THREE.PlaneGeometry(0.62, 0.4, 3, 1).rotateY(Math.PI / 2).translate(0.13, 2.43, -0.56);
    const cp = cloth.attributes.position; for (let i = 0; i < cp.count; i++) cp.setX(i, cp.getX(i) + Math.sin(cp.getZ(i) * 9) * 0.04);
    cloth.computeVertexNormals(); cloth.userData.part = PART.team; const back = cloth.clone().rotateY(0); back.userData.part = PART.team;
    return [pole, cloth];
  }
  return [];
}
/**
 * What a club's crowd holds in the right hand, upright, about h (the middle of the hand's grip, the template's frame):
 * 'glass' (a highball, its drink in it), 'coupe' (a cocktail's), 'flute' (champagne, held by the stem), 'bottle' (a
 * champagne bottle, its foil), 'sparkler' (the bottle with a sparkler burning on its neck - bottle service) -> parts
 */
function handProp(kind, h) {
  const P = (g, part) => { g.translate(h.x, h.y, h.z); g.userData.part = part; return g; };
  const C = (rt, rb, ht, y, seg = 10, part = PART.glass) => P(new THREE.CylinderGeometry(rt, rb, ht, seg).translate(0, y, 0), part);
  if (kind === 'glass') return [C(0.033, 0.03, 0.115, 0.025)];
  if (kind === 'coupe') return [C(0.05, 0.012, 0.045, 0.085), C(0.004, 0.004, 0.07, 0.03, 5), C(0.028, 0.028, 0.004, -0.006)];
  if (kind === 'flute') return [C(0.024, 0.017, 0.115, 0.1), C(0.004, 0.004, 0.07, 0.01, 5), C(0.03, 0.03, 0.004, -0.026)];
  if (kind === 'bottle' || kind === 'sparkler') {
    const b = [C(0.044, 0.044, 0.2, -0.02, 12, PART.prop), C(0.015, 0.043, 0.08, 0.12, 10, PART.prop), C(0.017, 0.016, 0.06, 0.18, 8, PART.metal)];
    if (kind === 'sparkler') {
      // (a fountain of sparks on a stick in the neck: its burning end a few crossed cards of light)
      b.push(C(0.003, 0.003, 0.1, 0.25, 4, PART.prop));
      for (let i = 0; i < 3; i++) b.push(P(new THREE.PlaneGeometry(0.07, 0.16).rotateY(i * Math.PI / 3).translate(0, 0.37, 0), PART.flame));
    }
    return b;
  }
  return [];
}

/**
 * A distant person: the same pose (its joints), the same parts and colours, built of a few simple tubes - a torso, the
 * limbs, a head under its hair (or cap), the shoes, the prop - some 300 triangles instead of thousands. For anyone
 * more than ~20 m away (world/CrowdLife.js).
 */
export function bakeFarTemplate(spec) {
  const J = jointsOf(spec.pose), V3 = THREE.Vector3, UP = new V3(0, 1, 0), parts = [], fem = spec.figure === 'f', club = !!spec.club;
  // (hers: the knees and feet nearer together, the arms nearer the body - as world/People.js stands her)
  if (fem) for (const s of ['R', 'L']) { J['hip' + s].z *= 0.85; J['knee' + s].z *= 0.8; J['ankle' + s].z *= 0.75; J['el' + s].z *= 0.94; J['wr' + s].z *= 0.94; }
  // (club: each vertex its shading (none), and whether it is the head's - turned about the neck when it nods)
  let inHead = false;
  const tag = (g, part) => {
    g = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal') g.deleteAttribute(a);
    const n = g.attributes.position.count; g.setAttribute('part', new THREE.BufferAttribute(new Float32Array(n).fill(part), 1));
    if (club) { const ax = new Float32Array(n * 4); for (let i = 0; i < n; i++) { ax[i * 4] = 1; ax[i * 4 + 1] = inHead ? 1 : 0; ax[i * 4 + 2] = J.neck.x; ax[i * 4 + 3] = J.neck.y; } g.setAttribute('aux', new THREE.BufferAttribute(ax, 4)); }
    parts.push(g);
  };
  const tube = (a, b, r1, r2, part, sx = 1, sz = 1) => { const d = new V3().subVectors(b, a), L = Math.max(0.01, d.length()); const g = new THREE.CylinderGeometry(r2, r1, L, 6, 1, false).translate(0, L / 2, 0).scale(sx, 1, sz); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, d.normalize())); g.translate(a.x, a.y, a.z); tag(g, part); };
  const ball = (p, r, part, w = 6, h = 4) => tag(new THREE.SphereGeometry(r, w, h).translate(p.x, p.y, p.z), part);
  const polo = spec.kit === 'polo';
  // (a club's: arms bare ('skin'), in short sleeves ('short') or long ones ('long'); a bare midriff (mid 'skin'); a skirt
  // to its hem (skirt: the hem's height on a man's frame) in the top's colour or the accent's (skirtPart 'accent'))
  const arms = spec.arms || null, top0 = J.torsoA.clone().add(new V3(0, -0.08, 0)), top1 = J.torsoB.clone().add(new V3(0, 0.06, 0)), rT = fem ? [0.135, 0.15, 0.7, 1.0] : [0.15, 0.17, 0.72, 1.1];
  if (spec.mid === 'skin') {
    const a = top0.clone().lerp(top1, 0.3), b = top0.clone().lerp(top1, 0.52);
    tube(top0, a, rT[0], rT[0] * 0.97, PART.top, rT[2], rT[3]); tube(a, b, rT[0] * 0.97, rT[0] * 0.98, PART.skin, rT[2], rT[3]); tube(b, top1, rT[0] * 0.98, rT[1], PART.top, rT[2], rT[3]);
  } else tube(top0, top1, rT[0], rT[1], PART.top, rT[2], rT[3]);
  tube(J.hipR, J.hipL, fem ? 0.115 : 0.12, fem ? 0.115 : 0.12, spec.skirt ? PART.top : PART.legs);
  if (spec.skirt) { const hem = new V3(J.pelvis.x + 0.01, spec.skirt, J.pelvis.z), wa = new V3(J.pelvis.x, J.pelvis.y + 0.07, J.pelvis.z), f = Math.min(1, (wa.y - hem.y) / 0.7); tube(hem, wa, 0.17 + 0.06 * f, 0.15, spec.skirtPart === 'accent' ? PART.accent : PART.top, 0.82, 1.08); }
  for (const s of ['R', 'L']) {
    tube(J['hip' + s], J['knee' + s], fem ? 0.075 : 0.08, fem ? 0.055 : 0.06, PART.legs); tube(J['knee' + s], J['ankle' + s], fem ? 0.052 : 0.058, fem ? 0.04 : 0.045, PART.legs);
    tag(new THREE.BoxGeometry(fem ? 0.21 : 0.24, 0.08, fem ? 0.08 : 0.1).translate(J['ankle' + s].x + 0.07, 0.045, J['ankle' + s].z), PART.shoe);
    const sh = J['sh' + s].clone().setZ(J['sh' + s].z * (fem ? 0.8 : 0.84));
    const upP = arms === 'skin' ? PART.skin : arms ? PART.top : spec.kit === 'jacket' ? PART.team : PART.top, loP = arms === 'skin' || arms === 'short' ? PART.skin : arms ? PART.top : polo ? PART.skin : PART.top;
    tube(sh, J['el' + s], fem ? 0.047 : 0.055, fem ? 0.039 : 0.045, upP); tube(J['el' + s], J['wr' + s], fem ? 0.036 : 0.042, fem ? 0.028 : 0.034, loP);
    ball(J['wr' + s].clone().add(new V3().subVectors(J['wr' + s], J['el' + s]).normalize().multiplyScalar(0.05)), fem ? 0.033 : 0.038, PART.skin, 5, 3);
  }
  tube(J.torsoB, J.neck, fem ? 0.042 : 0.05, fem ? 0.038 : 0.045, PART.skin);
  const hc = J.head.clone(), hr = fem ? 0.1 : 0.105;
  inHead = true;
  ball(hc, hr, PART.skin, 7, 5);
  tag(new THREE.SphereGeometry(hr + 0.007, 7, 3, 0, Math.PI * 2, 0, Math.PI * 0.45).translate(hc.x - 0.008, hc.y + 0.008, hc.z), spec.cap ? PART.team : PART.hair);
  // (hers worn long: down the back of the head to the shoulders)
  if (fem && spec.hair !== 'short') tube(new V3(hc.x - 0.07, J.neck.y - 0.16, hc.z), new V3(hc.x - 0.05, hc.y + 0.03, hc.z), 0.085, 0.1, PART.hair, 0.55, 1.1);
  if (spec.cap) tag(new THREE.BoxGeometry(0.11, 0.01, 0.2).translate(hc.x + 0.1, hc.y + 0.04, hc.z), PART.accent);
  inHead = false;
  for (const kind of [].concat(spec.prop || [])) for (const pg of prop(kind)) tag(pg, pg.userData.part ?? PART.prop);
  const geo = mergeGeometries(parts); parts.forEach((g) => g.dispose());
  // (as tall as the near body it stands in for (spec.ht: the height of its neck) - no step in height as somebody comes nearer)
  if (spec.ht) { const k = spec.ht / Math.max(0.5, J.neck.y); geo.scale(k, k, k); if (club) { const ax = geo.attributes.aux; for (let i = 0; i < ax.count; i++) { ax.setZ(i, ax.getZ(i) * k); ax.setW(i, ax.getW(i) * k); } } }
  geo.computeBoundingSphere();
  if (club) geo.userData.club = true;
  return geo;
}

/**
 * one template: a person baked to a single geometry with a part per vertex. spec: { pose, kit, cap, hs, fh, prop, props,
 * q (segments' share), detail } - and a club's (spec.club): figure, build, acc, jewel, fabric, shoe, cut, seed (as
 * makePerson's), hold (a drink in the right hand: handProp). A sheer layer is left off (the dress beneath it is what a
 * crowd shows)
 */
export function bakeTemplate(spec) {
  const club = !!spec.club, o = { pose: spec.pose, kit: spec.kit, cap: spec.cap, style: { hs: spec.hs, fh: spec.fh }, jitter: spec.jitter ?? 0.02, segQ: spec.q ?? 0.32, detail: spec.detail ?? 0.2, hair: '#000', skin: '#fff' };
  if (club) for (const k of ['figure', 'build', 'acc', 'jewel', 'fabric', 'shoe', 'cut', 'seed']) if (spec[k] != null) o[k] = spec[k];
  // (a club's seeded: its near and its mid template the same person - the same small turns of each joint - so nothing
  // shifts as somebody comes nearer; Math.random is the seed's only for the build, then given back)
  const R0 = Math.random;
  if (club && spec.seed != null) { let a = (spec.seed >>> 0) || 1; Math.random = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let p; try { p = makePerson(o); } finally { Math.random = R0; }
  p.group.updateMatrixWorld(true);
  const keyOf = new Map(Object.entries(p.mats).map(([k, m]) => [m, k]));
  const parts = [], fem = spec.figure === 'f', byKey = {};
  // (club: the head's meshes - they nod - and the neck they turn about, in the template's frame)
  const body = p.group.children[0], head = new Set(); p.head?.traverse((m) => { if (m.isMesh) head.add(m); });
  const piv = club && p.neck && body ? body.localToWorld(p.neck.clone()) : new THREE.Vector3(0.03, 1.46, 0);
  /** club: each vertex's own shading (its colour's lightness - an accessory's colours are its own, not shading), its share of the head */
  const aux = (g, src, k, hd) => {
    const n = g.attributes.position.count, ax = new Float32Array(n * 4), col = src?.attributes.color, si = src?.attributes.skinIndex, sw = src?.attributes.skinWeight;
    for (let i = 0; i < n; i++) {
      ax[i * 4] = col && k !== 'acc' ? Math.min(1.6, 0.2126 * col.getX(i) + 0.7152 * col.getY(i) + 0.0722 * col.getZ(i)) : 1;
      ax[i * 4 + 1] = hd ? 1 : si && sw ? (si.getY(i) === 1 ? sw.getY(i) : si.getX(i) === 1 ? sw.getX(i) : 0) : 0;
      ax[i * 4 + 2] = piv.x; ax[i * 4 + 3] = piv.y;
    }
    g.setAttribute('aux', new THREE.BufferAttribute(ax, 4));
  };
  // (club templates stay indexed - a vertex shared is shaded once - so every part needs an index to merge)
  const seqIndex = (g) => { if (!g.index) { const n = g.attributes.position.count, ix = n > 65535 ? new Uint32Array(n) : new Uint16Array(n); for (let i = 0; i < n; i++) ix[i] = i; g.setIndex(new THREE.BufferAttribute(ix, 1)); } return g; };
  p.group.traverse((m) => {
    if (!m.isMesh) return;
    const k = keyOf.get(m.material); if (k == null || k === 'sheer') return;   // (a chest name: not in a crowd; a sheer layer: the dress beneath shows)
    let g = club ? m.geometry.clone() : m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld);
    if (club) aux(g, g, k, head.has(m));
    for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal' && a !== 'aux') g.deleteAttribute(a);
    if (!g.attributes.normal) g.computeVertexNormals();
    g.setAttribute('part', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(club && fem && k === 'lip' ? PART.lipF : PART[k] ?? 1), 1));
    parts.push(club ? seqIndex(g) : g); if (club) (byKey[k] = byKey[k] || []).push(g);
  });
  // (her bare legs under a skirt: the thighs drawn in a little from their own middles, from the hem up - at a crowd's few
  // segments the skirt's cloth would otherwise let a thigh's front show through it; below the hem nothing changes)
  if (club && fem && byKey.legs && p.mats.legs?.defines && 'PPL_SKIN' in p.mats.legs.defines) {
    let hem = Infinity; for (const k of ['top', 'bottom']) for (const g of byKey[k] || []) { const P = g.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i); if (y < hem && y > 0.2 && Math.abs(P.getZ(i)) < 0.3) hem = y; } }
    if (hem < 0.95) {
      // (each thigh's middle a line through its own vertices - x and z against y, fitted - from below the hem to the hip)
      const y0 = hem - 0.12, y1 = Math.min(hem + 0.36, 0.94), ss = (a, b, x) => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
      let zs = 0, zn = 0; for (const g of byKey.legs) { const P = g.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i); if (y > y0 && y < y1) { zs += P.getZ(i); zn++; } } }
      const zm = zn ? zs / zn : 0, F = [0, 1].map(() => ({ n: 0, y: 0, yy: 0, x: 0, xy: 0, z: 0, zy: 0 }));
      for (const g of byKey.legs) { const P = g.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i); if (y <= y0 || y >= y1) continue; const f = F[P.getZ(i) > zm ? 1 : 0], x = P.getX(i), z = P.getZ(i); f.n++; f.y += y; f.yy += y * y; f.x += x; f.xy += x * y; f.z += z; f.zy += z * y; } }
      const line = F.map((f) => { if (f.n < 6) return null; const d = f.n * f.yy - f.y * f.y || 1e-9, bx = (f.n * f.xy - f.y * f.x) / d, bz = (f.n * f.zy - f.y * f.z) / d; return { bx, ax: (f.x - bx * f.y) / f.n, bz, az: (f.z - bz * f.y) / f.n }; });
      for (const g of byKey.legs) {
        const P = g.attributes.position;
        for (let i = 0; i < P.count; i++) {
          const y = P.getY(i); if (y <= hem - 0.02 || y >= y1) continue; const L = line[P.getZ(i) > zm ? 1 : 0]; if (!L) continue;
          const s = 1 - 0.2 * ss(hem - 0.015, hem + 0.035, y) * ss(y1, y1 - 0.05, y), cx = L.ax + L.bx * y, cz = L.az + L.bz * y;
          P.setX(i, cx + (P.getX(i) - cx) * s); P.setZ(i, cz + (P.getZ(i) - cz) * s);
        }
      }
    }
  }
  const extra = [];
  for (const kind of [].concat(spec.prop || [], spec.props || [])) for (const pg of prop(kind)) extra.push([pg, pg.userData.part ?? (kind === 'lanyard' ? PART.accent : PART.prop)]);
  // (a drink in the right hand, upright: a share of the hand's length out from the wrist along the forearm, a little
  // toward the body - the fingers round it)
  if (spec.hold && body && p.wrR) {
    const J = jointsOf(spec.pose), d = (J.fingR ? J.fingR.clone() : J.wrR.clone().sub(J.elR)).normalize(), w = body.localToWorld(p.wrR.clone());
    const hc = w.addScaledVector(d, fem ? 0.06 : 0.065).add(new THREE.Vector3(0, -0.01, 0.028));
    for (const pg of handProp(spec.hold, hc)) extra.push([pg, pg.userData.part ?? PART.prop]);
  }
  for (const [pg, part] of extra) {
    let g = club ? pg : pg.index ? pg.toNonIndexed() : pg; for (const a of Object.keys(g.attributes)) if (a !== 'position' && a !== 'normal') g.deleteAttribute(a);
    if (club) { aux(g, null, 'prop', false); seqIndex(g); }
    g.setAttribute('part', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(part), 1)); parts.push(g);
  }
  p.dispose();
  const geo = mergeGeometries(parts); parts.forEach((g) => g.dispose());
  geo.computeBoundingSphere();
  if (club) { geo.computeBoundingBox(); geo.userData.club = true; }
  return geo;
}

let MAT = null;
export function crowdMaterial() {
  if (MAT) return MAT;
  const m = new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0 });
  m.userData.lift = { value: 0 }; m.userData.time = { value: 0 }; m.side = THREE.DoubleSide;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uLift = m.userData.lift; sh.uniforms.uTime = m.userData.time;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float part; attribute vec3 iSkin; attribute vec3 iTop; attribute vec3 iLegs; attribute vec3 iHair; attribute vec3 iAcc; attribute vec3 iTeam; attribute vec4 iMisc; uniform float uTime; varying vec3 vPC;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vec3 pc = vec3(0.03);
        if (part < 0.5) pc = iSkin; else if (part < 1.5) pc = iTop; else if (part < 2.5) pc = iLegs; else if (part < 3.5) pc = iHair;
        else if (part < 4.5) pc = vec3(0.02); else if (part < 5.5) pc = iAcc; else if (part < 6.5) pc = iTeam; else if (part < 7.5) pc = vec3(0.82, 0.8, 0.76);
        else if (part < 8.5) pc = vec3(0.03, 0.022, 0.015); else if (part < 9.5) pc = iSkin * 0.5; else if (part < 10.5) pc = vec3(0.01); else pc = vec3(0.025);
        vPC = pc;
        transformed.y += iMisc.y * abs(sin(uTime * 5.5 + iMisc.x)) * 0.09;   // (a fan jumping, cheering)
        // (a nod: the head turned about the neck - talking, listening)
        float nd = iMisc.z * sin(uTime * 2.3 + iMisc.x * 1.7) + iMisc.w;
        if (transformed.y > 1.42) { vec2 q = transformed.xy - vec2(0.03, 1.46); float cs = cos(-nd), sn = sin(-nd); transformed.xy = vec2(q.x * cs - q.y * sn, q.x * sn + q.y * cs) + vec2(0.03, 1.46); }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPC; uniform float uLift;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n  diffuseColor.rgb *= vPC;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  totalEmissiveRadiance += vPC * uLift;');
  };
  m.customProgramCacheKey = () => 'crowd-v3';
  MAT = m; return m;
}

/** the crowd's clock (the fans' jumping) */
export function crowdTime(t) { crowdMaterial().userData.time.value = t; }
const TPL = new Map(), ROLES = {};   // (templates baked once and kept; the role pools shared, so chunks reuse them)
const CLUB_CAP = 180;   // (club templates kept at most - a party's three sets of a kind, ~150 at ~0.15 MB each: past it the least lately used, if nobody wears it now, is let go)
/**
 * A template by its spec (Crowd.key), baked the first time and kept for the session - a second party bakes nothing it
 * has had before. Club templates (spec.club) are kept most-lately-used last, and past CLUB_CAP the oldest not in use
 * (geometry.userData.users, counted by world/PartyCrowd.js) is given back -> the template's geometry (shared: never
 * dispose it, never add attributes to it)
 */
export function templateOf(spec) {
  const k = Crowd.key(spec); let g = TPL.get(k);
  if (g) { if (spec.club) { TPL.delete(k); TPL.set(k, g); } return g; }
  g = spec.far ? bakeFarTemplate(spec) : bakeTemplate(spec); TPL.set(k, g);
  if (spec.club) {
    let n = 0; for (const t of TPL.values()) if (t.userData.club) n++;
    for (const [kk, t] of TPL) { if (n <= CLUB_CAP) break; if (t.userData.club && !(t.userData.users > 0)) { TPL.delete(kk); t.dispose(); n--; } }
  }
  return g;
}
/** whether a template is baked already (nothing to build for it) */
export function hasTemplate(spec) { return TPL.has(Crowd.key(spec)); }
/**
 * The crowd: add(spec, x, z, rotY, colours) people, then build(group). Specs that look alike share a template.
 * colours: { skin, top, legs, hair, acc, team } (any CSS colour; missing ones made up).
 */
export class Crowd {
  constructor(o = {}) { this.list = []; this.templates = new Map(); this.night = !!o.night; this.meshes = []; }
  static key(s) {
    // (a distant body: hair style, beard and mesh quality do not show; a club's by figure, pose, skirt, sleeves, midriff
    // and height - not by kit: its colours are each person's)
    if (s.far) return ['far', s.pose, s.kit, s.cap ? 1 : 0, s.prop || '-', ...(s.club ? ['c', s.figure || 'm', s.skirt || 0, s.skirtPart || '-', s.arms || '-', s.mid || '-', s.hair || '-', s.ht ? s.ht.toFixed(2) : '-'] : [])].join('|');
    return [s.pose, s.kit, s.cap ? 1 : 0, s.hs, s.fh || '-', s.prop || '-', (s.props || []).join('+'), s.q || 0.32, ...(s.club ? ['c', s.figure || 'm', s.build || '-', [].concat(s.acc || []).join('+'), s.jewel ? JSON.stringify(s.jewel) : '-', s.fabric || '-', s.shoe || '-', s.cut ? JSON.stringify(s.cut) : '-', s.hold || '-', s.detail ?? '-', s.seed ?? '-'] : [])].join('|');
  }
  /** a template spec for a role, drawn so that there are only so many distinct ones (n per role) */
  spec(role, n = 6) {
    const R = ROLES;
    if (!R[role]) {
      const make = () => {
        const s = { hs: pick(HS), fh: pick(FH) };
        if (role === 'crew') Object.assign(s, { kit: 'polo', pose: pick(['talk', 'cross', 'hips', 'mourn', 'talk', 'reach']), cap: Math.random() < 0.55 });
        else if (role === 'guest') Object.assign(s, { kit: pick(['jacket', 'polo', 'jacket']), pose: pick(['talk', 'phone', 'cross', 'hips', 'phone', 'mourn', 'talk']), cap: Math.random() < 0.15, prop: Math.random() < 0.4 ? 'lanyard' : null });
        else if (role === 'photo') Object.assign(s, { kit: pick(['polo', 'jacket']), pose: 'photo', cap: Math.random() < 0.4, prop: 'photo' });
        else if (role === 'tv') Object.assign(s, { kit: 'polo', pose: 'tvcam', cap: Math.random() < 0.5, prop: 'tvcam' });
        else if (role === 'fanF' || role === 'fanB') {
          const pose = pick(['cheer', 'cheer', 'flag', 'talk', 'phone', 'hips', 'cross', 'mourn', 'cheer', 'talk']);
          Object.assign(s, { kit: Math.random() < 0.6 ? 'polo' : 'jacket', pose, cap: Math.random() < 0.4, prop: pose === 'flag' ? 'flag' : null, q: role === 'fanF' ? 0.3 : 0.22, detail: role === 'fanF' ? 0.2 : 0.16 });
        }
        else Object.assign(s, { kit: 'jacket', pose: 'talk', cap: false });
        if (s.pose === 'phone') s.prop = 'phone';
        return s;
      };
      R[role] = Array.from({ length: n }, make);
    }
    return pick(R[role]);
  }
  add(spec, x, z, rotY, col = {}, scale = 1, y = 0, bob = 0) { this.list.push({ spec, x, z, rotY, col, scale, y, bob }); }
  /** build the instanced meshes into group -> the number of templates built */
  build(group) {
    const by = new Map();
    for (const e of this.list) { const k = Crowd.key(e.spec); if (!by.has(k)) by.set(k, []); by.get(k).push(e); }
    const mat = crowdMaterial(); mat.userData.lift.value = this.night ? 0.2 : 0;
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), c = new THREE.Color();
    for (const [k, list] of by) {
      if (!TPL.has(k)) TPL.set(k, list[0].spec.far ? bakeFarTemplate(list[0].spec) : bakeTemplate(list[0].spec));
      const geo = TPL.get(k).clone();
      const N = list.length, A = {}; for (const a of ['iSkin', 'iTop', 'iLegs', 'iHair', 'iAcc', 'iTeam']) A[a] = new Float32Array(N * 3);
      const misc = new Float32Array(N * 4);
      const mesh = new THREE.InstancedMesh(geo, mat, N);
      list.forEach((e, i) => {
        M.compose(P.set(e.x, e.y || 0, e.z), Q.setFromAxisAngle(Y, e.rotY), S.setScalar(e.scale)); mesh.setMatrixAt(i, M); e.mesh = mesh; e.i = i;   // (where they are drawn: world/StandCrowds.js moves people out of a camera's way)
        misc[i * 4] = Math.random() * 6.283; misc[i * 4 + 1] = e.bob || 0;
        const C = e.col, set = (a, v) => { c.set(v); A[a][i * 3] = c.r; A[a][i * 3 + 1] = c.g; A[a][i * 3 + 2] = c.b; };
        set('iSkin', C.skin || pick(SKINS)); set('iHair', C.hair || pick(HAIRS)); set('iTop', C.top || '#2b2e35'); set('iLegs', C.legs || '#23262c'); set('iAcc', C.acc || '#ffffff'); set('iTeam', C.team || C.top || '#2b2e35');
      });
      for (const a in A) geo.setAttribute(a, new THREE.InstancedBufferAttribute(A[a], 3));
      geo.setAttribute('iMisc', new THREE.InstancedBufferAttribute(misc, 4));
      mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); mesh.frustumCulled = true; mesh.name = 'crowd:' + k;
      group.add(mesh); this.meshes.push(mesh);
    }
    return by.size;
  }
}
