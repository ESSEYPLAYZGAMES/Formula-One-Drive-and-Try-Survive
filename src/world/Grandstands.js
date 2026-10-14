// Temporary grandstands in the empty lots along the circuit: tiered seating with a canopy, packed with cheering
// fans (one InstancedMesh, bobbing in the vertex shader). Every candidate is rejected if any part of it would touch
// the racing corridor (track + pit lane + margin), a floodlight mast, a landmark or a generic building.
import * as THREE from 'three';
import { corridorSigned } from '../track/TrackBuilder.js';

const STAND = { len: 64, depth: 17, tiers: 11, tierD: 1.35, tierH: 0.48, base: 1.2, gap: 5.5 };   // gap = metres from the barrier to the first tier
const PALETTE = [0xff8000, 0xe8002d, 0x1e3a8a, 0x27f4d2, 0x00665e, 0x0a2aa8, 0xffffff, 0x111111, 0xff5fb0, 0xc9a86a, 0xffd400, 0x8899aa, 0xeeeeee, 0x222222, 0x33d17a];

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
    placed.push({ s: null, side: 0, x: ox, z: oz, ang: Math.atan2(ex[0], ex[1]), ex, ez, len: f.len, tiers: f.tiers, name: f.name, world: (lx, lz) => [ox + ex[0] * lx + ez[0] * lz, oz + ex[1] * lx + ez[1] * lz] });
  }

  // --- geometry: tiers, back wall, canopy, pillars
  const structure = [], canopies = [];
  const fanPos = [];   // [x, y, z, ang]
  for (const p of placed) {
    const LEN = p.len; const TIERS = p.tiers || STAND.tiers;
    const faceAng = Math.atan2(-p.ez[0], -p.ez[1]);   // a sheet's normal points at the track
    const place = (g, lx, ly, lz) => { g.rotateY(p.ang); const [x, z] = p.world(lx, lz); g.translate(x, ly, z); return g; };
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
        fanPos.push([x, y, z, faceAng + (Math.random() - 0.5) * 0.5, p, lx, t]);   // facing the track (sheet across the line of sight)
      }
    }
    const top = STAND.base + TIERS * STAND.tierH; const back = 0.8 + TIERS * STAND.tierD;
    p.depth = back + 0.6; p.height = top + 6;   // (its footprint, for the obstacles the cars can hit: world/Obstacles.js)
    structure.push(place(box(LEN, top + 1.2, 0.6), 0, (top + 1.2) / 2, back + 0.3));          // back wall
    structure.push(place(box(LEN, 3.0, 0.6), 0, top + 2.5, back + 0.3));                       // rear billboard band
    for (const lx of [-LEN / 2 + 2, -LEN / 6, LEN / 6, LEN / 2 - 2]) structure.push(place(new THREE.BoxGeometry(0.5, top + 5.5, 0.5), lx, (top + 5.5) / 2, back - 0.5));
    canopies.push(place(box(LEN + 1, 0.35, back * 0.75), 0, top + 5.5, back - back * 0.75 / 2 + 0.8));
  }
  const merge = (gs) => { const out = new THREE.BufferGeometry(); let pos = [], nrm = [], uv = []; for (const g of gs) { const a = g.toNonIndexed(); pos.push(...a.attributes.position.array); nrm.push(...a.attributes.normal.array); uv.push(...a.attributes.uv.array); } out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3)); out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return out; };
  if (structure.length) {
    group.add(new THREE.Mesh(merge(structure), new THREE.MeshStandardMaterial({ color: 0x8a8f99, roughness: 0.85, emissive: 0x0d0f14, emissiveIntensity: 1 })));
    group.add(new THREE.Mesh(merge(canopies), new THREE.MeshStandardMaterial({ color: 0xe8ecf2, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x1a1c22, emissiveIntensity: 1 })));
  }

  // --- fans: flat coloured sheets (one quad each, 2 triangles) as one InstancedMesh PER STAND so a stand that is
  //     off camera is culled as a whole; per-instance colour + wave phase, bobbing in the vertex shader
  let fansMat = null;
  const fanQuad = new THREE.PlaneGeometry(0.46, 1.5); fanQuad.translate(0, 0.75, 0);
  fansMat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  fansMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }; fansMat.userData.shader = shader;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aPhase; attribute float aWave; uniform float uTime;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n float bob = aWave * max(0.0, sin(uTime * 6.5 + aPhase)); transformed.y += bob * 0.28;');
  };
  fansMat.customProgramCacheKey = () => 'fans';
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3(); const col = new THREE.Color(); const up = new THREE.Vector3(0, 1, 0);
  // stands are grouped by 400 m map cell: neighbouring stands (Club A / Club B, the Village stands) share one mesh
  const cells = new Map(), meshes = [];
  for (const f of fanPos) { const p = f[4], key = Math.floor(p.x / 400) * 1000 + Math.floor(p.z / 400); let arr = cells.get(key); if (!arr) cells.set(key, (arr = [])); arr.push(f); }
  for (const mine of cells.values()) {
    const N = mine.length; if (!N) continue;
    const geo = fanQuad.clone();
    const fans = new THREE.InstancedMesh(geo, fansMat, N);
    const phase = new Float32Array(N), wave = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const [x, y, z, a] = mine[i];
      q.setFromAxisAngle(up, a); const s = 0.9 + Math.random() * 0.25; sc.set(s, s, 1); pos.set(x, y, z);
      m.compose(pos, q, sc); fans.setMatrixAt(i, m);
      col.setHex(PALETTE[(Math.random() * PALETTE.length) | 0]); if (Math.random() < 0.3) col.multiplyScalar(0.6); fans.setColorAt(i, col);
      phase[i] = Math.random() * 6.283; wave[i] = Math.random() < 0.7 ? 1 : 0;
    }
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
    geo.setAttribute('aWave', new THREE.InstancedBufferAttribute(wave, 1));
    fans.instanceMatrix.needsUpdate = true; fans.computeBoundingSphere(); fans.frustumCulled = true; group.add(fans);
    meshes.push({ fans, mine, orig: fans.instanceMatrix.array.slice(), hid: new Uint16Array(N) });   // (orig, hid: for hide - counted, so overlapping hides undo cleanly)
  }

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
