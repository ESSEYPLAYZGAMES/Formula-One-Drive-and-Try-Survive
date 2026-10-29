// Temporary grandstands in the empty lots along the circuit: tiered seating with a canopy, packed with cheering
// fans (one InstancedMesh, bobbing in the vertex shader). Every candidate is rejected if any part of it would touch
// the racing corridor (track + pit lane + margin), a floodlight mast, a landmark or a generic building.
import * as THREE from 'three';
import { corridorSigned } from '../track/TrackBuilder.js';
import { TERRAIN } from './Terrain.js';
import { fanMaterial, fanMesh, FAN_COLOURS, STANDING } from './FanCutouts.js';

const STAND = { len: 64, depth: 17, tiers: 11, tierD: 1.35, tierH: 0.48, base: 1.2, gap: 5.5 };   // gap = metres from the barrier to the first tier
// (a grandstand's shirts: the everyday ones and more of the teams' than out on the grass)
const STAND_SHIRTS = [...FAN_COLOURS.SHIRT, 0xd0702c, 0xd0702c, 0xa82a32, 0xa82a32, 0x1f2c5a, 0x3fa596, 0x1c1c1e, 0x1f5a4c, 0x2b4f9e, 0xd8c04a];

/** the Stars and Stripes, for a stand's end (art 'stars') */
let STARS = null;
function starsTexture() {
  if (STARS) return STARS;
  const c = document.createElement('canvas'); c.width = 512; c.height = 320; const x = c.getContext('2d');
  for (let k = 0; k < 7; k++) { x.fillStyle = k % 2 ? '#ffffff' : '#b31942'; x.fillRect(0, k * 320 / 7, 512, 320 / 7 + 1); }
  x.fillStyle = '#0a3161'; x.beginPath(); x.moveTo(0, 0); x.lineTo(300, 0); x.lineTo(200, 320); x.lineTo(0, 320); x.closePath(); x.fill();
  x.fillStyle = '#ffffff'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 26 : 64; (j ? x.lineTo : x.moveTo).call(x, 120 + Math.cos(a) * r, 150 + Math.sin(a) * r); } x.fill();
  STARS = new THREE.CanvasTexture(c); STARS.colorSpace = THREE.SRGBColorSpace; return STARS;
}
function pointInRing(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], zi = ring[i][1], xj = ring[j][0], zj = ring[j][1];
    if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * @param track, pit
 * @param obstacles { rings: [[x,z]...][], boxes: THREE.Box3[], masts: [{x,z}] }
 * @returns { group, update(t), count }
 */
export function buildGrandstands(track, pit, obstacles, opts = {}) {
  const { auto = true, fixed = [] } = opts;   // fixed: real grandstand placements [{x, z (front-edge midpoint), ex, ez, len, tiers}]
  const group = new THREE.Group(); group.name = 'grandstands';
  const tr = track;
  const rings = obstacles.rings || [], boxes = obstacles.boxes || [], masts = obstacles.masts || [];
  const inPitRange = (s) => pit && (() => { const a = tr.wrapS(pit.entryS - 60), b = tr.wrapS(pit.exitS + 60); return a <= b ? s >= a && s <= b : s >= a || s <= b; })();

  // --- candidate rectangles: local frame x along the track, z outward from the barrier
  const placed = [];
  const tryPlace = (s, side, len = STAND.len) => {
    if (pit && side === pit.sideSign && inPitRange(s)) return false;
    const f = tr.sample(s, 0); const ang = Math.atan2(f.tx, f.tz);
    // behind the barrier as it stands here (pushed back where there is a run-off), at its furthest over the stand's length
    let wall = 0; for (let ds = -len / 2; ds <= len / 2; ds += 4) wall = Math.max(wall, tr.wallAt(tr.idxAtS(s + ds), side));
    const ox = f.x + f.nx * side * (wall + STAND.gap), oz = f.z + f.nz * side * (wall + STAND.gap);
    const ex = [f.tx, f.tz], ez = [f.nx * side, f.nz * side];   // local axes
    const world = (lx, lz) => [ox + ex[0] * lx + ez[0] * lz, oz + ex[1] * lx + ez[1] * lz];
    const hl = len / 2;
    // test points: a grid over the footprint (+1 m skirt) against corridor, masts, landmark boxes and building rings
    for (let lx = -hl - 1; lx <= hl + 1; lx += 4) for (let lz = -1; lz <= STAND.depth + 1; lz += 4) {
      const [x, z] = world(lx, lz);
      if (corridorSigned(tr, pit, x, z, 3.0) < 0) return false;
      for (const m of masts) if ((m.x - x) ** 2 + (m.z - z) ** 2 < 5 * 5) return false;
      for (const b of boxes) if (x >= b.min.x - 2 && x <= b.max.x + 2 && z >= b.min.z - 2 && z <= b.max.z + 2) return false;
      for (const r of rings) if (pointInRing(x, z, r)) return false;
    }
    // building vertices inside the footprint (small buildings that the grid could straddle)
    for (const r of rings) for (const p of r) { const dx = p[0] - ox, dz = p[1] - oz; const lx = dx * ex[0] + dz * ex[1], lz = dx * ez[0] + dz * ez[1]; if (lx > -hl - 2 && lx < hl + 2 && lz > -2 && lz < STAND.depth + 2) return false; }
    for (const p of placed) if ((p.x - ox) ** 2 + (p.z - oz) ** 2 < 90 * 90) return false;   // spread them out
    placed.push({ s, side, x: ox, z: oz, ang, ex, ez, world, len });
    return true;
  };
  if (auto) for (let s = 60; s < tr.length - 60 && placed.length < 12; s += 80) for (const side of [1, -1]) { if (!tryPlace(s, side, STAND.len)) tryPlace(s, side, 40); }
  // real stands (OSM footprints): placed exactly where they are, each with its own length and number of tiers
  for (const f of fixed) {
    const ox = f.x, oz = f.z, ex = f.ex, ez = f.ez;
    placed.push({ s: null, side: 0, x: ox, z: oz, ang: Math.atan2(ex[0], ex[1]), ex, ez, len: f.len, tiers: f.tiers, name: f.name, style: f.style || null, world: (lx, lz) => [ox + ex[0] * lx + ez[0] * lz, oz + ex[1] * lx + ez[1] * lz] });
  }

  // --- geometry: tiers, back wall, canopy, pillars
  // (a stand's style - p.style, a real stand's own: roof 'canopy' (the default) | 'membrane' (translucent fabric) |
  //  'none'; frame 'red' (the red steel tubes outlining it); levels (decks, a glass band of suites between them);
  //  art 'stars' (the Stars and Stripes across its top end); color (the structure's))
  const structure = [], canopies = [], membranes = [], reds = [], glass = [], plinths = [], arts = [];
  const fanPos = [];   // [x, y, z, ang]
  for (const p of placed) {
    const LEN = p.len; const TIERS = p.tiers || STAND.tiers, ST = p.style || {};
    const faceAng = Math.atan2(-p.ez[0], -p.ez[1]);   // a sheet's normal points at the track
    // (on a circuit that is not flat, level on its own ground: the front edge's highest point, a concrete plinth down
    //  into the slope under the rest - world/Terrain.js)
    // (a long stand on a slope leans with it: the whole stand sheared along its length to the ground's trend under its
    //  front edge - one stand climbing the hill, Turn 1's, not a deck held level at its top end)
    p.y0 = 0; p.k = 0;
    if (TERRAIN.on) {
      const [ax, az] = p.world(-LEN / 2, 0), [bx, bz] = p.world(LEN / 2, 0); p.k = (TERRAIN.at(bx, bz) - TERRAIN.at(ax, az)) / LEN;
      let y = -Infinity; for (let lx = -LEN / 2; lx <= LEN / 2; lx += 6) { const [x, z] = p.world(lx, 0); y = Math.max(y, TERRAIN.at(x, z) - p.k * lx); } p.y0 = y;
    }
    const lxOf = (x, z) => (x - p.x) * p.ex[0] + (z - p.z) * p.ex[1];
    const shear = (g) => { if (!p.k) return g; const P = g.attributes.position; for (let j = 0; j < P.count; j++) P.setY(j, P.getY(j) + p.k * lxOf(P.getX(j), P.getZ(j))); return g; };
    const place = (g, lx, ly, lz) => { g.rotateY(p.ang); const [x, z] = p.world(lx, lz); g.translate(x, ly + p.y0, z); return shear(g); };
    // (in the stand's own frame - lx along it, y up, lz back from its front edge - straight to the world: a tube from one
    //  point to another, a surface over a grid)
    const W = (lx, y, lz) => { const [x, z] = p.world(lx, lz); return new THREE.Vector3(x, y + p.y0 + p.k * lx, z); };
    const tube = (a, b, r) => { const A = W(...a), B = W(...b), d = new THREE.Vector3().subVectors(B, A), g = new THREE.CylinderGeometry(r, r, d.length(), 8); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate((A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2); return g; };
    const surface = (lx0, lx1, lz0, lz1, yFn, nu = 12, nv = 10) => {
      const P = [], I = [];
      for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const lx = lx0 + (lx1 - lx0) * i / nu, lz = lz0 + (lz1 - lz0) * j / nv, v = W(lx, yFn(lx, lz), lz); P.push(v.x, v.y, v.z); }
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; I.push(a, b, c, b, d, c); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((P.length / 3) * 2), 2)); g.setIndex(I); g.computeVertexNormals(); return g;
    };
    // BoxGeometry local x = along the track (after rotateY(ang) the box's +z is the track tangent, so build with z = along)
    const box = (w, h, d) => new THREE.BoxGeometry(d, h, w);   // w along the track -> local z; d across -> local x
    structure.push(place(box(LEN, STAND.base, 0.8), 0, STAND.base / 2, 0.4));                 // front parapet
    for (let t = 0; t < TIERS; t++) {
      const y = STAND.base + t * STAND.tierH; const z0 = 0.8 + t * STAND.tierD;
      structure.push(place(box(LEN, STAND.tierH, STAND.tierD), 0, y + STAND.tierH / 2 - STAND.tierH, z0 + STAND.tierD / 2));   // step
      // a row of fans standing on this tier
      for (let lx = -LEN / 2 + 0.6; lx < LEN / 2 - 0.6; lx += 0.62 + Math.random() * 0.15) {
        if (Math.random() < 0.08) continue;   // empty seats
        const [x, z] = p.world(lx + (Math.random() - 0.5) * 0.2, z0 + 0.55 + Math.random() * 0.3);
        fanPos.push([x, y + p.y0 + p.k * lx, z, faceAng + (Math.random() - 0.5) * 0.5, p, lx, t]);   // facing the track (sheet across the line of sight)
      }
    }
    const top = STAND.base + TIERS * STAND.tierH; const back = 0.8 + TIERS * STAND.tierD;
    p.depth = back + 0.6; p.height = top + 6;   // (its footprint, for the obstacles the cars can hit: world/Obstacles.js)
    if (TERRAIN.on) {
      // (under a stand on a slope, its steel frame down to the ground wherever that falls away behind the front edge:
      //  columns and cross-bracing, seen through - not a wall)
      let lo = p.y0; for (let lx = -LEN / 2; lx <= LEN / 2; lx += 6) for (let lz = 0; lz <= back; lz += 6) { const [x, z] = p.world(lx, lz); lo = Math.min(lo, TERRAIN.at(x, z) - p.k * lx); }
      const drop = Math.max(1.5, p.y0 - lo + 1.5), g = box(LEN + 0.6, drop, back + 1.2), uv = g.attributes.uv, dims = [[back + 1.2, drop], [back + 1.2, drop], [LEN + 0.6, back + 1.2], [LEN + 0.6, back + 1.2], [LEN + 0.6, drop], [LEN + 0.6, drop]];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const j = f * 4 + k; uv.setXY(j, uv.getX(j) * dims[f][0] / 5, uv.getY(j) * dims[f][1] / 5); }
      plinths.push(place(g, 0, -drop / 2, back / 2));
    }
    structure.push(place(box(LEN, top + 1.2, 0.6), 0, (top + 1.2) / 2, back + 0.3));          // back wall
    const roof = ST.roof || 'canopy';
    if (roof !== 'none') structure.push(place(box(LEN, 3.0, 0.6), 0, top + 2.5, back + 0.3));   // rear billboard band
    if (roof === 'canopy') {
      for (const lx of [-LEN / 2 + 2, -LEN / 6, LEN / 6, LEN / 2 - 2]) structure.push(place(new THREE.BoxGeometry(0.5, top + 5.5, 0.5), lx, (top + 5.5) / 2, back - 0.5));
      canopies.push(place(box(LEN + 1, 0.35, back * 0.75), 0, top + 5.5, back - back * 0.75 / 2 + 0.8));
    } else if (roof === 'membrane') {
      // (a translucent fabric roof over the whole depth on masts behind, a little rise to its front edge)
      const n = Math.max(3, Math.round(LEN / 24));
      for (let k = 0; k <= n; k++) { const lx = -LEN / 2 + 1 + k * (LEN - 2) / n; (ST.frame === 'red' ? reds : structure).push(place(new THREE.BoxGeometry(0.7, top + 9, 0.7), lx, (top + 9) / 2, back + 0.6)); }
      // (one sail between each pair of masts: high at the back, dipping in the middle, lifting to the front edge)
      for (let k = 0; k < n; k++) { const a = -LEN / 2 + 1 + k * (LEN - 2) / n, b = a + (LEN - 2) / n; membranes.push(surface(a, b, -1.5, back + 0.6, (lx, lz) => { const u = (lx - a) / (b - a), v = lz / (back + 0.6); return top + 6.4 + 2.2 * v - 1.6 * Math.sin(Math.PI * u) * (0.4 + 0.6 * v); })); }
    }
    if (ST.frame === 'red') {
      // the red steel tubes: along the front at the top tier's height, along the roof's edge, down the ends
      reds.push(tube([-LEN / 2 - 0.4, top + 1.4, 0.3], [LEN / 2 + 0.4, top + 1.4, 0.3], 0.28), tube([-LEN / 2 - 0.4, top + 8.6, back + 0.6], [LEN / 2 + 0.4, top + 8.6, back + 0.6], 0.28));
      for (const lx of [-LEN / 2 - 0.4, LEN / 2 + 0.4]) reds.push(tube([lx, 0, 0.3], [lx, top + 1.4, 0.3], 0.28), tube([lx, top + 1.4, 0.3], [lx, top + 8.6, back + 0.6], 0.28), tube([lx, 0, back + 0.6], [lx, top + 8.6, back + 0.6], 0.28));
    }
    if (ST.levels > 1) for (let k = 1; k < ST.levels; k++) {   // (the suites: a glass band across the stand between its decks)
      const t = Math.round((TIERS * k) / ST.levels), y = STAND.base + t * STAND.tierH, z0 = 0.8 + t * STAND.tierD;
      glass.push(place(box(LEN, 2.4, 0.4), 0, y + 1.2, z0 + 0.2)); structure.push(place(box(LEN, 0.45, 2.2), 0, y + 2.6, z0 + 1.0));
    }
    if (ST.art === 'stars') { const g = new THREE.PlaneGeometry(back * 0.95, top * 0.75); arts.push(place(g, LEN / 2 + 0.45, top * 0.62, back * 0.52)); }
  }
  const merge = (gs) => { const out = new THREE.BufferGeometry(); let pos = [], nrm = [], uv = []; for (const g of gs) { const a = g.toNonIndexed(); pos.push(...a.attributes.position.array); nrm.push(...a.attributes.normal.array); uv.push(...a.attributes.uv.array); } out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return out; };
  if (structure.length) {
    group.add(new THREE.Mesh(merge(structure), new THREE.MeshStandardMaterial({ color: 0x8a8f99, roughness: 0.85, emissive: 0x0d0f14, emissiveIntensity: 1 })));
    if (canopies.length) group.add(new THREE.Mesh(merge(canopies), new THREE.MeshStandardMaterial({ color: 0xe8ecf2, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x1a1c22, emissiveIntensity: 1 })));
    if (membranes.length) group.add(new THREE.Mesh(merge(membranes), new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.5, side: THREE.DoubleSide, transparent: true, opacity: 0.85, emissive: 0x7a7a76, depthWrite: false })));
    if (reds.length) group.add(new THREE.Mesh(merge(reds), new THREE.MeshStandardMaterial({ color: 0xc8202b, roughness: 0.45, metalness: 0.35, emissive: 0x2a0608 })));
    if (glass.length) group.add(new THREE.Mesh(merge(glass), new THREE.MeshStandardMaterial({ color: 0x2b3d4e, roughness: 0.1, metalness: 0.7, emissive: 0x1d2a36 })));
    if (plinths.length) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
      x.strokeStyle = '#8f969e'; x.lineWidth = 9; x.strokeRect(0, 0, 128, 128); x.lineWidth = 4; x.beginPath(); x.moveTo(0, 0); x.lineTo(128, 128); x.moveTo(128, 0); x.lineTo(0, 128); x.stroke();
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      group.add(new THREE.Mesh(merge(plinths), new THREE.MeshStandardMaterial({ map: t, alphaTest: 0.5, transparent: false, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.4 })));
    }
    if (arts.length) group.add(new THREE.Mesh(merge(arts), new THREE.MeshStandardMaterial({ map: starsTexture(), side: THREE.DoubleSide, roughness: 0.7 })));
  }

  // --- fans: the cut-out people (world/FanCutouts.js), one InstancedMesh per 400 m map cell (a stand off camera culls
  //     as a whole), standing in their rows; the cheering ones bounce
  const fansMat = fanMaterial();
  const cells = new Map(), meshes = [];
  for (const f of fanPos) { const p = f[4], key = Math.floor(p.x / 400) * 1000 + Math.floor(p.z / 400); let arr = cells.get(key); if (!arr) cells.set(key, (arr = [])); arr.push(f); }
  for (const mine of cells.values()) {
    if (!mine.length) continue;
    const fans = fanMesh(mine.map(([x, y, z, a]) => [x, y, z, a, STANDING[(Math.random() * STANDING.length) | 0]]), fansMat, Math.random, { shirts: STAND_SHIRTS });
    group.add(fans);
    meshes.push({ fans, mine, orig: fans.instanceMatrix.array.slice(), hid: new Uint16Array(mine.length) });   // (orig, hid: for hide - counted, so overlapping hides undo cleanly)
  }
  group.userData.onTerrain = true;   // (built on its ground already: world/Terrain.js leaves it be)

  return {
    group, count: placed.length, stands: placed, fans: fanPos.length,
    update(t) { const sh = fansMat && fansMat.userData.shader; if (sh) sh.uniforms.uTime.value = t; },
    /** every seat (standing place) of stand p: { x, y (the tier's floor), z, ang (the sheet's turn: it faces the track), lx, tier } */
    seats(p) { return fanPos.filter((f) => f[4] === p).map((f) => ({ x: f[0], y: f[1], z: f[2], ang: f[3], lx: f[5], tier: f[6] })); },
    /** hide the sheet fans where test(stand, lx, tier) says (a block of full-detail people stands there instead: ui/PreRace.js) -> undo() */
    hide(test) {
      const saved = [], zero = new THREE.Matrix4().makeScale(0, 0, 0);
      for (const M of meshes) { let any = false; M.mine.forEach((f, i) => { if (test(f[4], f[5], f[6])) { if (M.hid[i]++ === 0) { M.fans.setMatrixAt(i, zero); any = true; } saved.push([M, i]); } }); if (any) M.fans.instanceMatrix.needsUpdate = true; }
      let done = false;
      return () => {
        if (done) return; done = true; const touched = new Set();
        for (const [M, i] of saved) if (M.hid[i] > 0 && --M.hid[i] === 0) { M.fans.instanceMatrix.array.set(M.orig.subarray(i * 16, i * 16 + 16), i * 16); touched.add(M); }
        for (const M of touched) M.fans.instanceMatrix.needsUpdate = true;
      };
    },
  };
}
