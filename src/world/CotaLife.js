// The Circuit of the Americas on a race weekend, alive: what world/Austin.js lays out (the circuit's buildings, the
// stands, the crowds on the hillsides, the car parks), set moving and joined up.
//   * trackside (buildTrackside, before the crowds): the marshal posts behind the barriers every few hundred metres,
//     their marshals in orange and the light panels on the barrier; the TV camera platforms on the outside of the corners;
//   * the walkways (the outer perimeter walkway behind the spectator banks all round the lap, and the links from it to
//     the gates and the bridges), and people walking along them - thousands, each on its own stretch at its own pace
//     (FanCutouts walkerMaterial: all of it moving in the vertex shader);
//   * the gates, by their real names - Main Grandstand, Turn 1, Turn 3 (its pedestrian bridge over the track), Turn 11 and
//     the Grand Plaza, the main entrance off the boulevard where the shuttles drop off - each an arch over its forecourt,
//     bag-check tents, queuing lanes full of people;
//   * the fan villages: food trucks with their queues, merchandise tents, picnic tables full under the shades, a stage
//     and its screen with a crowd in front of it, light towers, flags along the aisles, the toilets and their queues; the
//     F1 Fan Zone round the Grand Plaza (simulators, merchandise, food);
//   * the free internal tram along the outer perimeter between the Grand Plaza, the Main Grandstand and Turn 1;
//   * the TV helicopters: one over the action (it keeps station near the camera, circling), one high over the circuit.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { corridorSigned } from '../track/TrackBuilder.js';
import { TERRAIN } from './Terrain.js';
import { fanMesh, walkerMesh, walkerMaterial, STANDING } from './FanCutouts.js';

const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);
const keepPN = (g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };
const vc = (g, hex) => { g = keepPN(nonIdx(g)); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let k = 0; k < n; k++) { a[k * 3] = c.r; a[k * 3 + 1] = c.g; a[k * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
/** a box in a local frame (x across, z along) placed at (x, z) turned by ang (radians about y) */
const boxAt = (w, h, d, lx, ly, lz, ang, x, z, hex) => vc(new THREE.BoxGeometry(w, h, d).translate(lx, ly, lz).rotateY(ang).translate(x, 0, z), hex);
const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
const VMAT = () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.08 });
const ORANGE = [0xf36c21, 0xf2731e, 0xee6a1a];
const TEAMS = [0xff8000, 0xe8002d, 0x1e41ff, 0x27f4d2, 0x229971, 0x0093cc, 0x64c4ff, 0xb6babd, 0x52e252, 0x6692ff, 0x0a3161, 0xb31942, 0xffffff];

/** a flat strip along a polyline [[x, z], ...]: w wide, y up, its texture repeating every `period` m along it */
function strip(poly, w, y, period) {
  const P = [], U = [], I = [], n = poly.length, A = 2; let len = 0;
  for (let k = 0; k < n; k++) {
    const p = poly[k], a = poly[Math.max(0, k - 1)], b = poly[Math.min(n - 1, k + 1)];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    if (k) len += Math.hypot(p[0] - poly[k - 1][0], p[1] - poly[k - 1][1]);
    for (let c = 0; c <= A; c++) { const u = c / A, o = (u - 0.5) * w; P.push(p[0] + tz * o, y, p[1] - tx * o); U.push(u, len / period); }
  }
  for (let k = 0; k < n - 1; k++) for (let c = 0; c < A; c++) { const r0 = k * (A + 1) + c, r1 = r0 + A + 1; I.push(r0, r1, r0 + 1, r0 + 1, r1, r1 + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals(); return g;
}

/**
 * Trackside, before the crowds are placed (they keep clear of it: C.solid): the marshal posts, the light panels, the
 * camera platforms. C: { tr, pit, group, solid, rnd, fanMat }
 */
export function buildTrackside(C) {
  const { tr, pit, group, solid, rnd } = C, n = tr.n, kw = tr.kerbWidth;
  const inR = (s, a, b) => (a <= b ? s >= a && s <= b : s >= a || s <= b), pr = pit ? [tr.wrapS(pit.entryS - 60), tr.wrapS(pit.exitS + 40)] : null;
  const parts = [], marshals = [], boards = [], panels = [];
  const posts = [];
  for (let s = 40, k = 0; s < tr.length - 40; s += 230 + rnd() * 70, k++) {
    const side = k % 2 ? 1 : -1;
    if (pr && side === pit.sideSign && inR(s, ...pr)) continue;
    const i = tr.idxAtS(s), bar = side > 0 ? tr.barL[i] : tr.barR[i];
    if (!bar || bar === 3) continue;   // (on a barrier, never the concrete pit wall)
    posts.push({ s, side, i, n: posts.length + 1 });
  }
  const NB = posts.length, cols = 8, rows = Math.ceil(NB / cols) || 1;
  const btex = canvasTex(cols * 128, rows * 64, (x) => {
    posts.forEach((p, k) => { const ox = (k % cols) * 128, oy = Math.floor(k / cols) * 64; x.fillStyle = '#f36c21'; x.fillRect(ox + 2, oy + 2, 124, 60); x.fillStyle = '#ffffff'; x.fillRect(ox + 8, oy + 8, 112, 48); x.fillStyle = '#111'; x.font = '900 40px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(`${p.n}`, ox + 64, oy + 34); });
  });
  for (const p of posts) {
    const f = tr.sample(p.s, 0), w = tr.wallAt(p.i, p.side), ang = Math.atan2(f.tx, f.tz), out = (d) => [f.x + f.nx * p.side * d, f.z + f.nz * p.side * d];
    const [hx, hz] = out(w + 3.4);
    // the hut: white, its orange roof, the door toward the track; the post's number on a board beside it
    parts.push(boxAt(2.6, 2.3, 2.4, 0, 1.15, 0, ang, hx, hz, 0xeeeeea), boxAt(3.2, 0.25, 3.0, 0, 2.45, 0, ang, hx, hz, 0xf36c21), boxAt(2.7, 0.35, 2.5, 0, 0.1, 0, ang, hx, hz, 0x8a8a86));
    const k = p.n - 1, u0 = (k % cols) / cols, v1 = 1 - Math.floor(k / cols) / rows, u1 = u0 + 1 / cols, v0 = v1 - 1 / rows;
    const [bx, bz] = out(w + 1.6); const bg = new THREE.PlaneGeometry(1.4, 0.7); const uv = bg.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) ? u1 : u0, uv.getY(j) ? v1 : v0);
    bg.translate(0, 2.0, 0).rotateY(Math.atan2(-f.nx * p.side, -f.nz * p.side)).translate(bx, 0, bz); boards.push(bg);
    // the light panel on its post at the barrier (dark until it shows a flag; a green strip lit)
    const [lx, lz] = out(w + 0.5); parts.push(boxAt(0.12, 2.2, 0.12, 0, 1.1, 0, ang, lx, lz, 0x30343a), boxAt(0.18, 0.75, 1.1, 0, 2.45, 0, ang, lx, lz, 0x111214)); panels.push([lx, lz, ang, p.side, f]);
    // the marshals: two or three in orange, behind the barrier, facing the track
    const m = 2 + ((rnd() * 2) | 0);
    for (let j = 0; j < m; j++) { const [mx, mz] = out(w + 1.4 + rnd() * 1.2); const a = Math.atan2(-f.nx * p.side, -f.nz * p.side); marshals.push([mx + f.tx * (j - 1) * 1.1, 0, mz + f.tz * (j - 1) * 1.1, a + (rnd() - 0.5) * 0.4, [0, 1, 4, 6][(rnd() * 4) | 0]]); }
    solid.push([hx, hz, 4]);
  }
  // the TV camera platforms: a scaffold tower on the outside of every corner, the camera on its head and the operator
  // under an umbrella
  const ops = [];
  for (const z of tr.cornerZones) {
    if (!z.dir) continue;
    const side = -z.dir, i = Math.round(z.a + ((z.b - z.a + n) % n) * 0.35) % n, s = tr.s[i];
    if (pr && side === pit.sideSign && inR(s, ...pr)) continue;
    const f = tr.sample(s, 0), w = tr.wallAt(i, side), x = f.x + f.nx * side * (w + 7), zz = f.z + f.nz * side * (w + 7);
    if (corridorSigned(tr, pit, x, zz, 2) < 0 || solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - zz) ** 2 < r * r)) continue;
    const ang = Math.atan2(f.tx, f.tz), face = Math.atan2(-f.nx * side, -f.nz * side);
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) parts.push(boxAt(0.1, 5.2, 0.1, a * 1.1, 2.6, b * 1.1, ang, x, zz, 0x9aa0a6));
    for (const y of [1.7, 3.4]) for (const a of [-1, 1]) { parts.push(boxAt(2.3, 0.07, 0.07, 0, y, a * 1.1, ang, x, zz, 0x9aa0a6), boxAt(0.07, 0.07, 2.3, a * 1.1, y, 0, ang, x, zz, 0x9aa0a6)); }
    parts.push(boxAt(2.6, 0.12, 2.6, 0, 5.2, 0, ang, x, zz, 0x6b6f75));
    for (const a of [-1, 1]) parts.push(boxAt(2.6, 0.06, 0.06, 0, 6.2, a * 1.3, ang, x, zz, 0xd8d8d0), boxAt(0.06, 0.06, 2.6, a * 1.3, 6.2, 0, ang, x, zz, 0xd8d8d0));
    const cx = x - f.nx * side * 0.6, cz = zz - f.nz * side * 0.6;
    parts.push(vc(new THREE.BoxGeometry(0.35, 0.4, 0.6).rotateY(face).translate(cx, 6.0, cz), 0x1a1b1e), vc(new THREE.CylinderGeometry(0.11, 0.11, 0.9, 8).rotateX(Math.PI / 2).rotateY(face).translate(cx - f.nx * side * 0.6, 6.05, cz - f.nz * side * 0.6), 0xe8e8e2));
    parts.push(vc(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 4).translate(x, 6.3, zz), 0x444444), vc(new THREE.ConeGeometry(1.25, 0.45, 8, 1, true).translate(x, 7.45, zz), [0xf2f2f0, 0x1e3a8a, 0xd21f2f][(rnd() * 3) | 0]));
    ops.push([x + f.nx * side * 0.4, 5.26, zz + f.nz * side * 0.4, face, 0]);
    solid.push([x, zz, 3]);
  }
  if (parts.length) { const m = new THREE.Mesh(mergeGeometries(parts), VMAT()); m.name = 'cota:trackside'; group.add(m); }
  if (boards.length) group.add(new THREE.Mesh(mergeGeometries(boards), new THREE.MeshBasicMaterial({ map: btex, side: THREE.DoubleSide })));
  if (panels.length) {
    const lit = panels.map(([x, z, ang, side, f]) => new THREE.PlaneGeometry(0.9, 0.12).translate(0, 2.25, 0).rotateY(Math.atan2(-f.nx * side, -f.nz * side)).translate(x - f.nx * side * 0.1, 0, z - f.nz * side * 0.1));
    group.add(new THREE.Mesh(mergeGeometries(lit), new THREE.MeshBasicMaterial({ color: 0x3dff6a, side: THREE.DoubleSide })));
  }
  if (marshals.length) { const im = fanMesh(marshals, C.fanMat, rnd, { shirts: ORANGE, pants: ORANGE }); im.name = 'cota:marshals'; group.add(im); }
  if (ops.length) { const im = fanMesh(ops, C.fanMat, rnd, { shirts: [0x1c1c1e, 0x23304a] }); im.name = 'cota:camops'; group.add(im); }
  console.info(`[cota] trackside: ${posts.length} marshal posts, ${marshals.length} marshals, ${ops.length} camera platforms`);
}

/**
 * The rest, once the crowds are on their banks. C: { tr, pit, def, group, solid, standBoxes, stands, rnd, cornerS, towerAt,
 * plazaAt, ring, sinkAt, fanMat, bridges: [{ a: [x, y, z], b: [x, y, z] }] } -> { update(t, camera), nearPath(x, z, r) }
 */
export function buildCotaLife(C) {
  const { tr, pit, group, solid, standBoxes, rnd, ring, sinkAt } = C, kw = tr.kerbWidth;
  const H = (x, z) => TERRAIN.at(x, z);
  const hitSolid = (x, z, pad = 0) => solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2) || standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2);
  const walkers = [];   // [ax, ay, az, bx, by, bz, speed]
  const standing = [];  // fanMesh entries [x, y, z, ang, variant]
  const parts = [];     // vertex-coloured static geometry
  // (a walker on the ground between two points, a little to one side of the way)
  const walk = (ax, az, bx, bz, lat = 0, sp = 0.9 + rnd() * 0.7) => { const dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1, ox = (-dz / l) * lat, oz = (dx / l) * lat; walkers.push([ax + ox, H(ax + ox, az + oz) + 0.02, az + oz, bx + ox, H(bx + ox, bz + oz) + 0.02, bz + oz, sp]); };
  const walkChords = (poly, perM, width, chord = 8) => {   // (people all along a polyline: chords of `chord` points)
    for (let k = 0; k + 1 < poly.length; k += chord) {
      const a = poly[k], b = poly[Math.min(poly.length - 1, k + chord)], l = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.round(l * perM * (0.6 + rnd() * 0.8));
      for (let j = 0; j < m; j++) walk(a[0], a[1], b[0], b[1], (rnd() - 0.5) * width);
    }
  };

  // ---- the walkways: the outer perimeter walkway behind the spectator banks, both sides of the lap wherever there is
  //      room (a fence's depth of crowd and 5 m behind it), in decomposed granite like the circuit's paths
  const PH = new Map(), pkey = (x, z) => `${Math.floor(x / 20)},${Math.floor(z / 20)}`;
  const addPath = (poly) => { for (const p of poly) { const k = pkey(p[0], p[1]); let a = PH.get(k); if (!a) PH.set(k, (a = [])); a.push(p); sinkAt(p[0], p[1], 3.5); } };
  const nearPath = (x, z, r) => { const i = Math.floor(x / 20), j = Math.floor(z / 20); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const p of PH.get(`${i + a},${j + b}`) || []) if ((p[0] - x) ** 2 + (p[1] - z) ** 2 < r * r) return true; return false; };
  const paths = [];
  const zoneAt = (s, side) => (tr.crowdZones || []).find((z) => z.side === side && (z.s0 <= z.s1 ? s >= z.s0 && s <= z.s1 : s >= z.s0 || s <= z.s1));
  for (const side of [1, -1]) {
    const N = Math.floor(tr.length / 6), off = new Float32Array(N);
    for (let k = 0; k < N; k++) { const s = k * 6, i = tr.idxAtS(s), z = zoneAt(s, side); off[k] = tr.wallAt(i, side) + 3 + (z ? z.depth + z.rise * 3 : 6) + 4; }
    const sm = new Float32Array(N); for (let k = 0; k < N; k++) { let a = 0, c = 0; for (let j = -7; j <= 7; j++) { a += off[(k + j + N) % N]; c++; } sm[k] = a / c; }
    let cur = [];
    const flush = () => { if (cur.length > 10) { for (let it = 0; it < 2; it++) cur = cur.map((p, k) => (k && k < cur.length - 1 ? [(cur[k - 1][0] + 2 * p[0] + cur[k + 1][0]) / 4, (cur[k - 1][1] + 2 * p[1] + cur[k + 1][1]) / 4] : p)); paths.push(cur); } cur = []; };
    for (let k = 0; k < N; k++) {
      const f = tr.sample(k * 6, side * sm[k]), ok = corridorSigned(tr, pit, f.x, f.z, 3) > 0 && !hitSolid(f.x, f.z, 3);
      if (ok) cur.push([f.x, f.z]); else flush();
    }
    flush();
  }
  const dg = canvasTex(64, 128, (x, w, h) => { x.fillStyle = '#b9a47c'; x.fillRect(0, 0, w, h); for (let k = 0; k < 1600; k++) { const t = Math.random(); x.fillStyle = t < 0.4 ? 'rgba(150,128,92,0.55)' : t < 0.75 ? 'rgba(212,196,160,0.5)' : 'rgba(120,104,80,0.5)'; x.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } x.fillStyle = 'rgba(110,120,70,0.5)'; x.fillRect(0, 0, 4, h); x.fillRect(w - 4, 0, 4, h); });
  dg.wrapT = THREE.RepeatWrapping;
  const dgMat = new THREE.MeshStandardMaterial({ map: dg, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const pathGeos = [];
  for (const p of paths) { addPath(p); pathGeos.push(strip(p, 5, 0.07, 10)); walkChords(p, 0.8, 3.6); }

  // ---- the gates, by their real names: an arch over the forecourt, the bag-check tents, the queuing lanes; the link from
  //      each to the nearest walkway, people streaming along it
  const ringNear = (x, z) => { let bi = 0, bd = Infinity; for (let k = 0; k < ring.length; k++) { const d = (ring[k][0] - x) ** 2 + (ring[k][1] - z) ** 2; if (d < bd) { bd = d; bi = k; } } return bi; };
  const cAt = (n) => { const s = C.cornerS(n); return s == null ? null : tr.sample(s, 0); };
  const gates = [];
  const mainGS = C.stands.find((s) => /main grandstand/i.test(s.name));
  const gateSpecs = [
    { name: 'GRAND PLAZA', at: C.plazaAt, shuttles: true },
    { name: 'MAIN GRANDSTAND', at: mainGS ? [mainGS.x + mainGS.ez[0] * 60, mainGS.z + mainGS.ez[1] * 60] : null },
    { name: 'TURN 1', at: (() => { const f = cAt(1); return f && [f.x, f.z]; })() },
    { name: 'TURN 3', at: (() => { const f = cAt(3); return f && [f.x, f.z]; })() },
    { name: 'TURN 11', at: (() => { const f = cAt(11); return f && [f.x, f.z]; })() },
  ];
  let gcx = 0, gcz = 0; for (const p of ring) { gcx += p[0]; gcz += p[1]; } gcx /= ring.length; gcz /= ring.length;
  const signTex = canvasTex(1024, 128 * 5, (x) => {
    gateSpecs.forEach((g, k) => { const oy = k * 128; x.fillStyle = '#0a2a5c'; x.fillRect(0, oy, 1024, 128); x.fillStyle = '#c8102e'; x.fillRect(0, oy + 104, 1024, 24); x.fillStyle = '#ffffff'; x.font = '900 60px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(`${g.name} ENTRANCE`, 512, oy + 56); });
  });
  const signs = [];
  gateSpecs.forEach((g, gi) => {
    if (!g.at) return;
    const ri = ringNear(g.at[0], g.at[1]), r0 = ring[ri], r1 = ring[(ri + 3) % ring.length];
    let tx = r1[0] - r0[0], tz = r1[1] - r0[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    let nx = -tz, nz = tx; if ((gcx - r0[0]) * nx + (gcz - r0[1]) * nz < 0) { nx = -nx; nz = -nz; }   // (inward, toward the venue)
    const gx = r0[0] + nx * 26, gz = r0[1] + nz * 26, ang = Math.atan2(tx, tz);   // (the arch spans along the road)
    if (corridorSigned(tr, pit, gx, gz, 6) < 0) return;
    gates.push({ name: g.name, x: gx, z: gz, nx, nz, tx, tz });
    { const mk = new THREE.Object3D(); mk.name = `scene:gate${gi}`; mk.position.set(gx, H(gx, gz), gz); mk.userData.onTerrain = true; group.add(mk); }
    // the forecourt's paving, the arch (two truss towers and the header with the gate's name), the tents either side
    const pave = new THREE.PlaneGeometry(46, 30); pave.rotateX(-Math.PI / 2); pave.rotateY(ang); pave.translate(gx - nx * 6, 0.06, gz - nz * 6); pathGeos.push(pave); sinkAt(gx - nx * 6, gz - nz * 6, 24);
    for (const o of [-9, 9]) parts.push(boxAt(1.4, 9, 1.4, o, 4.5, 0, ang + Math.PI / 2, gx, gz, 0x3a3f46));
    parts.push(boxAt(19.4, 2.6, 1.2, 0, 8.6, 0, ang + Math.PI / 2, gx, gz, 0x2a2e34));
    const sg = new THREE.PlaneGeometry(18, 2.25); const uv = sg.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setY(j, 1 - (gi + 1 - uv.getY(j)) / 5);
    for (const side of [1, -1]) { const q = sg.clone(); q.rotateY(Math.atan2(-nx * side, -nz * side)).translate(gx - nx * side * 0.62, 8.6, gz - nz * side * 0.62); signs.push(q); }
    for (const o of [-1, 1]) for (let k = 0; k < 4; k++) { const ox = o * (13 + k * 4.6), x = gx + tx * ox, z = gz + tz * ox; parts.push(boxAt(4.2, 0.18, 4.2, 0, 2.8, 0, ang, x, z, 0xf4f4f2)); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) parts.push(boxAt(0.06, 2.8, 0.06, a * 2, 1.4, b * 2, ang, x, z, 0x9a9a9a)); parts.push(boxAt(2.4, 0.9, 0.8, 0, 0.45, 0, ang, x, z, 0x2b2b2b)); }
    // the queuing lanes: low crowd barriers from the road side to the arch, people in every lane facing the gate
    const face = Math.atan2(nx, nz);
    for (let k = 0; k <= 6; k++) { const o = -7.2 + k * 2.4; parts.push(vc(new THREE.BoxGeometry(0.05, 1.05, 18).translate(0, 0.52, -9).rotateY(face).translate(gx + tx * o, 0, gz + tz * o), 0x9aa0a6)); }
    for (let k = 0; k < 6; k++) {
      const o = -6 + k * 2.4;
      for (let q = 0; q < 16; q++) if (rnd() < 0.85) { const d = 1.5 + q * 1.05 + rnd() * 0.3, w = o + (rnd() - 0.5) * 0.6; standing.push([gx + tx * w - nx * d, 0, gz + tz * w - nz * d, face + (rnd() - 0.5) * 0.3, STANDING[(rnd() * STANDING.length) | 0]]); }
    }
    // a crowd through the gate: walking in from the road, and on into the venue
    for (let k = 0; k < 90; k++) walk(gx - nx * 18 + tx * (rnd() - 0.5) * 30, gz - nz * 18 + tz * (rnd() - 0.5) * 30, gx + nx * 14 + tx * (rnd() - 0.5) * 16, gz + nz * 14 + tz * (rnd() - 0.5) * 16, 0, 0.8 + rnd() * 0.6);
    // the link to the nearest walkway
    let best = null, bd = Infinity; for (const p of paths) for (const q of p) { const d = (q[0] - gx) ** 2 + (q[1] - gz) ** 2; if (d < bd) { bd = d; best = q; } }
    if (best && bd < 600 * 600) {
      const poly = [], L = Math.sqrt(bd); let ok = true;
      for (let t = 0; t <= L; t += 6) { const x = gx + (best[0] - gx) * t / L, z = gz + (best[1] - gz) * t / L; if (corridorSigned(tr, pit, x, z, 2) < 0) { ok = false; break; } poly.push([x, z]); }
      if (ok && poly.length > 2) { poly.push(best); addPath(poly); pathGeos.push(strip(poly, 6, 0.07, 10)); walkChords(poly, 0.9, 4.5, 6); }
    }
    // the shuttles at the main entrance: a line of coaches along the boulevard's verge
    if (g.shuttles) for (let k = 0; k < 7; k++) { const ox = (k - 3) * 15, x = r0[0] + nx * 11 + tx * ox, z = r0[1] + nz * 11 + tz * ox; parts.push(boxAt(2.55, 3.1, 12.2, 0, 1.75, 0, ang, x, z, 0xf2f2f0), boxAt(2.6, 0.9, 11.6, 0, 2.3, -0.1, ang, x, z, 0x1b2430), boxAt(2.58, 0.25, 12.22, 0, 0.55, 0, ang, x, z, 0x0a3161)); }
    solid.push([gx, gz, 30]);
  });
  if (signs.length) group.add(new THREE.Mesh(mergeGeometries(signs), new THREE.MeshStandardMaterial({ map: signTex, side: THREE.DoubleSide, roughness: 0.5, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.25 })));

  // ---- the bridges' decks: people crossing over the track
  for (const b of C.bridges || []) for (let k = 0; k < 40; k++) { const l = (rnd() - 0.5) * 2.6; walkers.push([b.a[0] + b.n[0] * l, b.a[1], b.a[2] + b.n[2] * l, b.b[0] + b.n[0] * l, b.b[1], b.b[2] + b.n[2] * l, 0.9 + rnd() * 0.6]); }

  // ---- the fan villages: in the open ground behind the spectator banks, by the corners where the crowds are (Turn 1, the
  //      Esses, Turns 11-12, Turns 15-20), each laid out on its aisle
  const villages = [];
  const blds = C.buildings || [];   // [x, z, r]: the venue's own buildings (the survey's footprints)
  const fits = (x, z, W, D, ang) => { const ca = Math.cos(ang), sa = Math.sin(ang); for (let u = -W / 2; u <= W / 2; u += 10) for (let v = -D / 2; v <= D / 2; v += 10) { const px = x + sa * v + ca * u, pz = z + ca * v - sa * u; if (corridorSigned(tr, pit, px, pz, 8) < 0 || hitSolid(px, pz, 2) || blds.some(([bx, bz, r]) => (bx - px) ** 2 + (bz - pz) ** 2 < (r + 4) ** 2)) return false; } return true; };
  const hot = [[1, -200, 260], [2, 0, 200], [3, -40, 260], [6, -60, 220], [9, -80, 220], [11, -150, 200], [12, -60, 200], [15, -40, 220], [17, -60, 200], [19, -80, 220], [20, -40, 160]];
  for (const [turn, a, len] of hot) {
    const s0 = C.cornerS(turn); if (s0 == null) continue;
    let placed = null;
    for (let tries = 0; tries < 90 && !placed; tries++) {
      const s = s0 + a + rnd() * len, side = rnd() < 0.5 ? 1 : -1, i = tr.idxAtS(s), z = zoneAt(s, side), f = tr.sample(s, 0);
      const d = tr.wallAt(i, side) + 3 + (z ? z.depth + z.rise * 3 : 6) + 12 + 28 + rnd() * 40, x = f.x + f.nx * side * d, zz = f.z + f.nz * side * d, ang = Math.atan2(f.tx, f.tz);
      if (fits(x, zz, 96, 60, ang)) placed = { x, z: zz, ang, facing: side };
    }
    if (placed) { villages.push(placed); solid.push([placed.x, placed.z, 58]); const mk = new THREE.Object3D(); mk.name = `scene:village${villages.length - 1}`; mk.position.set(placed.x, H(placed.x, placed.z), placed.z); mk.userData.onTerrain = true; group.add(mk); }
  }
  const lightTowers = [];
  for (const V of villages) buildVillage(V);
  function buildVillage({ x, z, ang }) {
    const ca = Math.cos(ang), sa = Math.sin(ang), P = (u, v) => [x + sa * v + ca * u, z + ca * v - sa * u];   // (u across the aisle, v along it)
    const W = 96, D = 60;
    // the ground: rubber matting down the aisle, artificial turf under the tables
    const floor = (u, v, w, d, hex, y) => { const g = new THREE.PlaneGeometry(w, d); g.rotateX(-Math.PI / 2); g.rotateY(ang); const [px, pz] = P(u, v); g.translate(px, y, pz); parts.push(vc(g, hex)); sinkAt(px, pz, Math.max(w, d) / 2); };
    floor(0, 0, 12, W - 6, 0x4a4b4e, 0.06); floor(-22, 8, 20, W - 30, 0x3f8f3a, 0.06);
    // food trucks down one side of the aisle, serving windows to it, a queue at each
    for (let k = 0; k < 9; k++) {
      const v = -W / 2 + 10 + k * 8.6, [px, pz] = P(9.5, v), hex = TEAMS[(rnd() * TEAMS.length) | 0];
      parts.push(boxAt(2.6, 3.0, 7, 0, 1.6, 0, ang, px, pz, hex), boxAt(1.7, 0.1, 6.2, -2.1, 2.7, 0, ang, px, pz, [0xb31942, 0xf4f4f2, 0x0a3161][k % 3]), boxAt(0.05, 0.9, 3.4, -1.32, 1.9, 0, ang, px, pz, 0x15171a));
      const q = 4 + ((rnd() * 8) | 0); for (let j = 0; j < q; j++) { const [qx, qz] = P(7.2 - j * 0.85, v + (rnd() - 0.5) * 0.7); standing.push([qx, 0, qz, ang + Math.PI / 2 + (rnd() - 0.5) * 0.3, STANDING[(rnd() * STANDING.length) | 0]]); }
    }
    // merchandise tents down the other side: white peaks, team-coloured valances, people browsing
    for (let k = 0; k < 10; k++) {
      const v = -W / 2 + 8 + k * 8, [px, pz] = P(-10, v), hex = TEAMS[(rnd() * TEAMS.length) | 0];
      parts.push(boxAt(6, 0.5, 6, 0, 2.6, 0, ang, px, pz, hex), vc(new THREE.ConeGeometry(4.3, 1.8, 4).rotateY(Math.PI / 4 + ang).translate(px, 3.75, pz), 0xf6f6f4), boxAt(4.5, 1.0, 1.2, 1.2, 0.5, 0, ang, px, pz, 0xdedad0));
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) parts.push(boxAt(0.07, 2.4, 0.07, a * 2.9, 1.2, b * 2.9, ang, px, pz, 0xbbbbbb));
      for (let j = 0; j < 5; j++) { const [qx, qz] = P(-6 + rnd() * 2.5, v + (rnd() - 0.5) * 5); standing.push([qx, 0, qz, ang - Math.PI / 2 + (rnd() - 0.5) * 1.2, STANDING[(rnd() * STANDING.length) | 0]]); }
    }
    // the picnic tables on the turf, full, under shade sails
    for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) {
      const [px, pz] = P(-30 + r * 4.6, -W / 2 + 22 + k * 6.2);
      parts.push(boxAt(0.85, 0.08, 2.2, 0, 0.75, 0, ang, px, pz, 0x8a6a48), boxAt(0.3, 0.06, 2.2, 0.75, 0.45, 0, ang, px, pz, 0x7a5c3c), boxAt(0.3, 0.06, 2.2, -0.75, 0.45, 0, ang, px, pz, 0x7a5c3c));
      for (const o of [-0.75, 0.75]) for (const w of [-0.7, 0, 0.7]) if (rnd() < 0.75) { const [qx, qz] = P(-30 + r * 4.6 + o, -W / 2 + 22 + k * 6.2 + w); standing.push([qx, 0.05, qz, ang + (o < 0 ? Math.PI / 2 : -Math.PI / 2), 8]); }
      if (k % 3 === 0) parts.push(vc(new THREE.ConeGeometry(3.4, 0.6, 4, 1, true).rotateY(Math.PI / 4 + ang).translate(px, 3.2, pz), [0xf2f2f0, 0xd21f2f, 0x1e3a8a][r % 3]), boxAt(0.08, 3.0, 0.08, 0, 1.5, 0, ang, px, pz, 0x888888));
    }
    // the stage at the far end: deck, truss roof, its screen and speakers; a crowd packed in front of it
    {
      const [px, pz] = P(0, W / 2 - 4), sAng = ang + Math.PI;
      parts.push(boxAt(16, 1.4, 8, 0, 0.7, 0, ang, px, pz, 0x1c1d21), boxAt(17, 0.6, 9, 0, 8.4, 0, ang, px, pz, 0x2d3035));
      for (const a of [-8, 8]) for (const b of [-4, 4]) parts.push(boxAt(0.5, 8.4, 0.5, a, 4.2, b, ang, px, pz, 0x3a3d42));
      for (const a of [-7, 7]) parts.push(boxAt(1.4, 4, 1.4, a, 3.4, -2, ang, px, pz, 0x111214));
      const [scx, scz] = P(0, W / 2); const scr = new THREE.PlaneGeometry(10, 5.6); scr.rotateY(sAng).translate(scx, 4.9, scz); lightTowers.push({ screen: scr });
      for (let j = 0; j < 520; j++) { const u = (rnd() - 0.5) * 30, v = W / 2 - 12 - Math.pow(rnd(), 0.7) * 30, [qx, qz] = P(u, v); standing.push([qx, 0, qz, sAng + Math.PI + (rnd() - 0.5) * 0.4, rnd() < 0.3 ? 3 : rnd() < 0.5 ? 2 : STANDING[(rnd() * STANDING.length) | 0]]); }
    }
    // toilets in a row at the near end, a queue at each block
    for (let k = 0; k < 10; k++) { const [px, pz] = P(-26 + k * 1.45, -W / 2 + 4); parts.push(boxAt(1.3, 2.3, 1.3, 0, 1.15, 0, ang, px, pz, 0x2a62b8), boxAt(1.32, 0.12, 1.32, 0, 2.36, 0, ang, px, pz, 0xe8e8e8)); }
    for (let j = 0; j < 14; j++) { const [qx, qz] = P(-24 + j * 0.9, -W / 2 + 7.5 + (rnd() - 0.5) * 0.8); standing.push([qx, 0, qz, ang + Math.PI + (rnd() - 0.5) * 0.4, STANDING[(rnd() * STANDING.length) | 0]]); }
    // light towers at the corners, flags down the aisle
    for (const [u, v] of [[-W / 2 + 14, -W / 2 + 4], [26, -W / 2 + 6], [-30, W / 2 - 8], [26, W / 2 - 10]]) { const [px, pz] = P(u, v); parts.push(boxAt(1.6, 1.1, 3.2, 0, 0.8, 0, ang, px, pz, 0xe8c21a), boxAt(0.25, 9, 0.25, 0, 5.8, 0, ang, px, pz, 0x9aa0a6), boxAt(2.4, 0.9, 0.4, 0, 10.4, 0, ang, px, pz, 0x2a2a2a)); lightTowers.push({ x: px, z: pz }); }
    for (let k = 0; k < 14; k++) { const v = -W / 2 + 6 + k * 6.6, [px, pz] = P(k % 2 ? 5.6 : -5.6, v), hex = [0x0a3161, 0xb31942, 0xf4f4f2, 0xff8000, 0x27f4d2][k % 5]; parts.push(boxAt(0.06, 4.2, 0.06, 0, 2.1, 0, ang, px, pz, 0x555555), boxAt(0.04, 2.6, 0.8, 0, 2.9, 0.42, ang, px, pz, hex)); }
    // and the aisle itself, crowded: people up and down it, and milling round the tables and the tents
    for (let j = 0; j < 220; j++) { const u = (rnd() - 0.5) * 9, [ax, az] = P(u, -W / 2 + 4 + rnd() * 10), [bx, bz] = P(u + (rnd() - 0.5) * 3, W / 2 - 18 - rnd() * 10); walk(ax, az, bx, bz, 0, 0.7 + rnd() * 0.6); }
    for (let j = 0; j < 140; j++) { const [ax, az] = P(-36 + rnd() * 50, -W / 2 + rnd() * W), [bx, bz] = P(-36 + rnd() * 50, -W / 2 + rnd() * W); walk(ax, az, bx, bz, 0, 0.6 + rnd() * 0.5); }
  }
  // the screens over the villages' stages: one lit material
  const scrGeos = lightTowers.filter((l) => l.screen).map((l) => l.screen);
  if (scrGeos.length) group.add(new THREE.Mesh(mergeGeometries(scrGeos), new THREE.MeshStandardMaterial({ color: 0x0b1a2e, emissive: 0x2f6fd0, emissiveIntensity: 1.0, roughness: 0.3, side: THREE.DoubleSide })));

  // ---- the F1 Fan Zone round the Grand Plaza: the simulators under their canopy, merchandise and food round the edge
  //      of the paving, the walks across it busy
  if (C.plazaAt) {
    const [px0, pz0] = C.plazaAt;
    for (let k = 0; k < 26; k++) {
      const a = (k / 26) * Math.PI * 2, r = 74, x = px0 + Math.cos(a) * r, z = pz0 + Math.sin(a) * r, face = Math.atan2(-Math.cos(a), -Math.sin(a)), hex = TEAMS[k % TEAMS.length];
      if (k % 2) { parts.push(vc(new THREE.BoxGeometry(2.6, 3, 7).rotateY(face + Math.PI / 2).translate(x, 1.6, z), hex)); for (let j = 0; j < 6; j++) standing.push([x - Math.cos(a) * (3 + j * 0.8), 0, z - Math.sin(a) * (3 + j * 0.8), face + Math.PI + (rnd() - 0.5) * 0.3, STANDING[(rnd() * STANDING.length) | 0]]); }
      else { parts.push(vc(new THREE.BoxGeometry(6, 0.5, 6).rotateY(face).translate(x, 2.6, z), hex), vc(new THREE.ConeGeometry(4.3, 1.8, 4).rotateY(Math.PI / 4 + face).translate(x, 3.75, z), 0xf6f6f4)); }
    }
    // (the simulators: three rows of rigs, each a seat and its screen, under one canopy on the paving)
    const sa = Math.atan2(gcz - pz0, gcx - px0) + 2.2, sx = px0 + Math.cos(sa) * 64, sz = pz0 + Math.sin(sa) * 64, sang = sa + Math.PI / 2;
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { const u = (k - 2.5) * 2.6, v = (r - 1) * 3.4, x = sx + Math.cos(sang) * u + Math.sin(sang) * v, z = sz - Math.sin(sang) * u + Math.cos(sang) * v; parts.push(vc(new THREE.BoxGeometry(0.9, 0.7, 1.6).rotateY(sang).translate(x, 0.35, z), 0x1a1a1d), vc(new THREE.BoxGeometry(1.4, 0.8, 0.08).rotateY(sang).translate(x + Math.sin(sang) * 1.0, 1.1, z + Math.cos(sang) * 1.0), 0x223a66)); standing.push([x, 0.25, z, sang + Math.PI, 8]); }
    parts.push(vc(new THREE.BoxGeometry(18, 0.4, 13).rotateY(sang).translate(sx, 4.2, sz), 0xf2f2f0));
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) parts.push(vc(new THREE.BoxGeometry(0.2, 4.2, 0.2).translate(a * 8.8, 2.1, b * 6.3).rotateY(sang).translate(sx, 0, sz), 0x9a9a9a));
    for (let k = 0; k < 900; k++) { const a = rnd() * Math.PI * 2, b = a + (rnd() - 0.5) * 1.2, r1 = 55 + rnd() * 22, r2 = 55 + rnd() * 22; walk(px0 + Math.cos(a) * r1, pz0 + Math.sin(a) * r1, px0 + Math.cos(b) * r2, pz0 + Math.sin(b) * r2, 0, 0.6 + rnd() * 0.6); }
  }

  // ---- build: the static parts, the walkways, the people standing and the people walking (per 400 m cell: cells cull)
  if (parts.length) { const m = new THREE.Mesh(mergeGeometries(parts), VMAT()); m.name = 'cota:life'; m.userData.cut = 2600; group.add(m); }
  if (pathGeos.length) { const m = new THREE.Mesh(mergeGeometries(pathGeos.map((g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); if (g.index) g = g.toNonIndexed(); return g; })), dgMat); m.name = 'cota:paths'; group.add(m); }
  const cellOf = (x, z) => `${Math.floor(x / 400)},${Math.floor(z / 400)}`;
  const byCell = (list, xi, zi) => { const m = new Map(); for (const e of list) { const k = cellOf(e[xi], e[zi]); let a = m.get(k); if (!a) m.set(k, (a = [])); a.push(e); } return m.values(); };
  for (const list of byCell(standing, 0, 2)) { const im = fanMesh(list, C.fanMat, rnd); im.name = 'cota:people'; im.userData.cut = 1800; group.add(im); }
  const wMat = walkerMaterial();
  for (const list of byCell(walkers, 0, 2)) { const im = walkerMesh(list, wMat, rnd); im.name = 'cota:walkers'; im.userData.cut = 1500; group.add(im); }

  // ---- the internal tram: along the outer perimeter between the Grand Plaza, the Main Grandstand and Turn 1 - a tractor
  //      and three open carriages, two of them back and forth all day
  const trams = [];
  const gP = gates.find((g) => g.name === 'GRAND PLAZA'), gM = gates.find((g) => g.name === 'MAIN GRANDSTAND'), g1 = gates.find((g) => g.name === 'TURN 1');
  let route = null;
  if (gP && g1) {
    const a = ringNear(gP.x, gP.z), b = ringNear(g1.x, g1.z), m = gM ? ringNear(gM.x, gM.z) : null, N = ring.length;
    const fwd = []; for (let k = a; ; k = (k + 1) % N) { fwd.push(ring[k]); if (k === b || fwd.length > N) break; }
    const back = []; for (let k = a; ; k = (k - 1 + N) % N) { back.push(ring[k]); if (k === b || back.length > N) break; }
    const has = (arr) => m == null || arr.some((p) => p === ring[m]);
    route = has(fwd) && (!has(back) || fwd.length < back.length) ? fwd : back;
    // (in the inner lane, toward the venue)
    let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= N; cz /= N;
    route = route.map((p, k) => { const q = route[Math.min(route.length - 1, k + 1)], o = route[Math.max(0, k - 1)]; let tx = q[0] - o[0], tz = q[1] - o[1]; const l = Math.hypot(tx, tz) || 1; let nx = -tz / l, nz = tx / l; if ((cx - p[0]) * nx + (cz - p[1]) * nz < 0) { nx = -nx; nz = -nz; } return [p[0] + nx * 4.5, p[1] + nz * 4.5]; });
    const L = []; let acc = 0; route.forEach((p, k) => { if (k) acc += Math.hypot(p[0] - route[k - 1][0], p[1] - route[k - 1][1]); L.push(acc); }); route.len = L; route.total = acc;
    const tramGeo = (() => {
      const g = [vc(new THREE.BoxGeometry(1.9, 1.6, 2.6).translate(0, 1.2, 0), 0xf2f2f0), vc(new THREE.BoxGeometry(1.95, 0.15, 2.7).translate(0, 2.2, 0), 0x0a3161)];
      for (let c = 1; c <= 3; c++) { const z = -c * 4.6; g.push(vc(new THREE.BoxGeometry(2.0, 0.5, 4.0).translate(0, 0.7, z), 0x0a3161), vc(new THREE.BoxGeometry(2.1, 0.1, 4.2).translate(0, 2.6, z), 0xf2f2f0)); for (const a of [-1, 1]) for (const b of [-1, 1]) g.push(vc(new THREE.BoxGeometry(0.08, 1.6, 0.08).translate(a * 0.95, 1.8, z + b * 1.9), 0xcccccc)); for (let r = 0; r < 4; r++) for (const a of [-0.5, 0.5]) g.push(vc(new THREE.BoxGeometry(0.42, 0.55, 0.36).translate(a, 1.25, z - 1.5 + r), TEAMS[(c * 5 + r * 3 + (a > 0 ? 1 : 0)) % TEAMS.length]), vc(new THREE.SphereGeometry(0.15, 6, 4).translate(a, 1.68, z - 1.5 + r), 0xc99572)); }
      return mergeGeometries(g);
    })();
    for (let k = 0; k < 2; k++) { const m = new THREE.Mesh(tramGeo, VMAT()); m.userData.onTerrain = true; m.name = 'cota:tram'; group.add(m); trams.push({ m, s0: k * route.total / 2 }); }
  }

  // ---- the TV helicopters: one keeps station over the action (circling near the camera, 110 m up, the camera ball on
  //      it), one wide and high over the circuit
  const heliGeo = (() => {
    const g = [];
    const body = new THREE.SphereGeometry(1, 16, 10); body.scale(1.15, 1.05, 2.5); g.push(vc(body.translate(0, 1.6, 0), 0xf2f2f0));
    const glass = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.2); glass.scale(1.0, 0.9, 1.3); glass.rotateX(1.2); g.push(vc(glass.translate(0, 1.8, 1.25), 0x1a2733));
    g.push(vc(new THREE.CylinderGeometry(0.22, 0.32, 6.2, 8).rotateX(Math.PI / 2).translate(0, 1.95, -4.6), 0xf2f2f0), vc(new THREE.BoxGeometry(0.12, 1.5, 1.0).translate(0, 2.6, -7.5), 0x0a3161), vc(new THREE.BoxGeometry(1.8, 0.1, 0.6).translate(0, 2.0, -7.1), 0x0a3161));
    g.push(vc(new THREE.BoxGeometry(2.2, 0.3, 4.6).translate(0, 0.95, -0.2), 0x0a3161));
    for (const a of [-1, 1]) g.push(vc(new THREE.BoxGeometry(0.1, 0.1, 3.4).translate(a * 1.05, 0.1, 0), 0x2a2a2a), vc(new THREE.BoxGeometry(0.08, 0.8, 0.08).translate(a * 0.95, 0.5, 0.9), 0x2a2a2a), vc(new THREE.BoxGeometry(0.08, 0.8, 0.08).translate(a * 0.95, 0.5, -0.9), 0x2a2a2a));
    g.push(vc(new THREE.SphereGeometry(0.38, 10, 8).translate(0, 0.65, 2.2), 0x222222), vc(new THREE.CylinderGeometry(0.18, 0.25, 0.8, 8).translate(0, 2.9, 0), 0x333333));
    return mergeGeometries(g);
  })();
  const rotorGeo = mergeGeometries([vc(new THREE.BoxGeometry(11, 0.06, 0.35), 0x222222), vc(new THREE.BoxGeometry(0.35, 0.06, 11), 0x222222)]);
  const tailGeo = mergeGeometries([vc(new THREE.BoxGeometry(0.05, 1.7, 0.18), 0x222222), vc(new THREE.BoxGeometry(0.05, 0.18, 1.7), 0x222222)]);
  const heliMat = VMAT(); heliMat.roughness = 0.35; heliMat.metalness = 0.3;
  const helis = [0, 1].map((k) => {
    const G = new THREE.Group(); G.name = 'cota:heli'; G.userData.onTerrain = true;
    const b = new THREE.Mesh(heliGeo, heliMat), r = new THREE.Mesh(rotorGeo, heliMat), t = new THREE.Mesh(tailGeo, heliMat);
    r.position.y = 3.35; t.position.set(0.25, 2.6, -7.6); G.add(b, r, t); G.scale.setScalar(1.1); group.add(G);
    return { G, r, t, k, pos: new THREE.Vector3(), vel: new THREE.Vector3(), init: false };
  });
  let cx0 = 0, cz0 = 0; for (let i = 0; i < tr.n; i++) { cx0 += tr.px[i]; cz0 += tr.pz[i]; } cx0 /= tr.n; cz0 /= tr.n;

  console.info(`[cota] life: ${paths.length} walkways, ${gates.length} gates (${gates.map((g) => g.name).join(', ')}), ${villages.length} fan villages, ${walkers.length} people walking, ${standing.length} standing about, ${trams.length} trams`);

  let tPrev = null; const tgt = new THREE.Vector3();
  return {
    nearPath,
    update(t, cam) {
      const dt = tPrev == null ? 0 : Math.max(0, Math.min(0.2, t - tPrev)); tPrev = t;
      const sh = wMat.userData.shader; if (sh) sh.uniforms.uTime.value = t;
      // the trams, there and back along their route at a walking-and-a-half pace
      if (route) for (const T of trams) {
        const L = route.total, u = ((t * 4.2 + T.s0) % (2 * L) + 2 * L) % (2 * L), s = u < L ? u : 2 * L - u, dir = u < L ? 1 : -1;
        let k = 1; while (k < route.length - 1 && route.len[k] < s) k++;
        const a = route[k - 1], b = route[k], f = (s - route.len[k - 1]) / Math.max(1e-3, route.len[k] - route.len[k - 1]), x = a[0] + (b[0] - a[0]) * f, z = a[1] + (b[1] - a[1]) * f;
        T.m.position.set(x, H(x, z), z); T.m.rotation.y = Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir);
      }
      // the helicopters
      for (const h of helis) {
        if (h.k === 0 && cam) { const a = t * 0.045, R = 150; tgt.set(cam.position.x + Math.cos(a) * R, 0, cam.position.z + Math.sin(a) * R); tgt.y = H(tgt.x, tgt.z) + 105; }
        else { const a = t * 0.026 + 2, R = 620; tgt.set(cx0 + Math.cos(a) * R, 0, cz0 + Math.sin(a) * R * 0.8); tgt.y = H(tgt.x, tgt.z) + 210; }
        if (!h.init) { h.pos.copy(tgt); h.init = true; }
        const k = 1 - Math.exp(-dt * (h.k === 0 ? 0.35 : 1)); const px = h.pos.x, pz = h.pos.z; h.pos.lerp(tgt, k);
        const vx = dt > 0 ? (h.pos.x - px) / dt : 0, vz = dt > 0 ? (h.pos.z - pz) / dt : 0; h.vel.set(vx, 0, vz);
        h.G.position.copy(h.pos);
        const look = h.k === 0 && cam ? Math.atan2(cam.position.x - h.pos.x, cam.position.z - h.pos.z) : Math.atan2(vx, vz);
        h.G.rotation.set(0, 0, 0); h.G.rotation.y = look;
        const sp = Math.hypot(vx, vz); h.G.rotateX(Math.min(0.18, sp * 0.004)); h.G.rotateZ(Math.sin(t * 0.3 + h.k) * 0.03);
        h.r.rotation.y = t * 38; h.t.rotation.x = t * 60;
      }
    },
  };
}
