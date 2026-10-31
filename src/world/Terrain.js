// The ground's height, for a circuit that is not flat (tracks.js def.elevation: the circuit way in its GeoJSON carries
// each point's height as a third coordinate - Austin's hill up to Turn 1). Everything else in the game is laid out flat,
// on (x, z): the physics, the AI, the barriers, the stands. The heights are added on top of that, in one place:
//   * the circuit's own heights, along the lap (smoothed, relative to the start/finish line);
//   * a height field over the whole venue: the road and a strip either side of it held at the circuit's height, and the
//     ground between the parts of the lap and out to the horizon a harmonic surface through them (each point the mean of
//     its neighbours: no bumps, no steps - the slopes run smoothly from one part of the circuit to the next and level out
//     towards the edge), solved coarse-to-fine on a grid;
//   * the static world raised onto it once it is built (elevateWorld: every vertex of the road, the kerbs, the barriers,
//     the stands and the buildings by the ground under it; every instance - a tree, a fan - by the ground under its foot);
//     a ground mesh of its own (terrainGround) replaces the flat plane near the circuit;
//   * what moves reads it every frame: the car models (height, pitch and roll from the slope: CarMesh), the camera (main.js
//     renderView: lifted with what it looks at), the physics (gravity along the slope: Car).
// With no elevation TERRAIN.on is false and at() is 0: nothing changes anywhere.
import * as THREE from 'three';

const CELL = 8;          // the height field's grid (m)
const HOLD = 9;          // metres of ground either side of the road held at the circuit's height (the verge, the kerbs)
const PLATEAU = 90;      // ... and at most this far out, where the run-off and the barrier behind it reach
const FLAT = 260;        // how far out the land is held level with the nearest part of the lap (where nothing else is near)
const GRADE = 0.07;      // the steepest the land between two parts of the lap at different heights is let slope
const MARGIN = 1400;     // how far the field reaches beyond the circuit (then the flat plane, at the field's edge height)

/** the venue's ground: on, at(x, z) (bilinear), grad(x, z) -> [dh/dx, dh/dz], edge (the height the field levels out to) */
export const TERRAIN = { on: false, edge: 0, at: () => 0, grad: (x, z, out = [0, 0]) => { out[0] = out[1] = 0; return out; } };

/** the circuit's heights along the lap: per track sample, from the circuit way's third coordinates, smoothed (sigma
 *  20 m) and relative to the start/finish line -> Float32Array | null */
export function trackHeights(track, pts, sigma = 20) {
  if (!pts || pts.length < 4 || pts.every((p) => p[2] == null)) return null;
  const n = track.n, raw = new Float32Array(n);
  // (each sample: the height of the nearest point of the way, interpolated along the segment it is nearest)
  for (let i = 0; i < n; i++) {
    const x = track.px[i], z = track.pz[i]; let best = Infinity, h = 0;
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1], dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L2)), qx = a[0] + dx * t - x, qz = a[1] + dz * t - z, d2 = qx * qx + qz * qz;
      if (d2 < best) { best = d2; h = (a[2] ?? 0) + ((b[2] ?? a[2] ?? 0) - (a[2] ?? 0)) * t; }
    }
    raw[i] = h;
  }
  const r = Math.ceil((3 * sigma) / track.ds), out = new Float32Array(n);
  for (let i = 0; i < n; i++) { let s = 0, w = 0; for (let k = -r; k <= r; k++) { const g = Math.exp(-((k * track.ds) ** 2) / (2 * sigma * sigma)); s += raw[(i + k + n) % n] * g; w += g; } out[i] = s / w; }
  const h0 = out[0]; for (let i = 0; i < n; i++) out[i] -= h0;
  return out;
}

/**
 * The height field over the venue: the road, its run-off and the land round it at the circuit's height (the nearest part
 * of the lap), harmonic between parts of the lap at different heights and out to the field's border (itself at the height of
 * the circuit nearest it). Solved on
 * a 32 m grid, then 16 m, then 8 m (each level started from the one before), Gauss-Seidel with over-relaxation.
 */
export function buildHeightField(track, h) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, mean = 0;
  for (let i = 0; i < track.n; i++) { x0 = Math.min(x0, track.px[i]); x1 = Math.max(x1, track.px[i]); z0 = Math.min(z0, track.pz[i]); z1 = Math.max(z1, track.pz[i]); mean += h[i]; }
  mean /= track.n; let lo = Infinity; for (let i = 0; i < track.n; i++) lo = Math.min(lo, h[i]); const edge = lo - 1.5;   // (the far edge: below the lowest point of the lap - the flat plane beyond it must never stand over the road)
  x0 -= MARGIN; z0 -= MARGIN; x1 += MARGIN; z1 += MARGIN;
  // (how far out from each sample the ground is held at its height: the verge, and the whole of the run-off out to its
  //  barrier and a little past it - flat, the way a paved apron is; then the slopes start. Held too narrowly, a hilltop
  //  corner's aprons fell away off the hill behind it)
  const holdS = new Float32Array(track.n); let hold = 0;
  for (let i = 0; i < track.n; i++) { const e = track.hw ? track.hw[i] : track.halfWidth, w = Math.max(track.wallL?.[i] ?? 0, track.wallR?.[i] ?? 0); holdS[i] = Math.min(PLATEAU, Math.max(e + HOLD, e + 30, w + 8)); hold = Math.max(hold, holdS[i]); }
  track.holdS = holdS;
  const level = (cell, prev) => {
    const nx = Math.ceil((x1 - x0) / cell) + 1, nz = Math.ceil((z1 - z0) / cell) + 1, H = new Float32Array(nx * nz), fixed = new Uint8Array(nx * nz);
    // (the start: the coarser level's solution, or the mean)
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) H[j * nx + i] = prev ? prev.at(x0 + i * cell, z0 + j * cell) : mean;
    // (the circuit's strip: every cell within its nearest sample's hold takes that sample's height exactly - the road, the
    //  run-off, the barrier. Beyond it the land is held level with the nearest part of the lap too, as far as FLAT m out -
    //  a venue is graded, nothing falls away behind a run-off - except where two parts of the lap at different heights
    //  meet (the other leg of a hairpin, the next straight over, the inside of a climbing bend): there the held land would
    //  step from one height to the other, so it is let go either side of the seam, over a band wide enough that the
    //  harmonic fill across it never slopes more than GRADE)
    const best = new Float32Array(nx * nz).fill(Infinity), near = new Int32Array(nx * nz).fill(-1), r = Math.ceil(FLAT / cell) + 1;
    for (let s = 0; s < track.n; s++) {
      const ci = Math.round((track.px[s] - x0) / cell), cj = Math.round((track.pz[s] - z0) / cell);
      for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) {
        const i = ci + di, j = cj + dj; if (i < 0 || j < 0 || i >= nx || j >= nz) continue;
        const d2 = (x0 + i * cell - track.px[s]) ** 2 + (z0 + j * cell - track.pz[s]) ** 2, k = j * nx + i;
        if (d2 <= FLAT * FLAT && d2 < best[k]) { best[k] = d2; near[k] = s; }
      }
    }
    for (let k = 0; k < nx * nz; k++) { const s1 = near[k]; if (s1 < 0) continue; H[k] = h[s1]; fixed[k] = Math.sqrt(best[k]) <= holdS[s1] ? 1 : 3; }
    const seams = [];
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i; if (!fixed[k]) continue;
      for (const q of [i + 1 < nx ? k + 1 : -1, j + 1 < nz ? k + nx : -1]) if (q >= 0 && fixed[q] && Math.abs(H[k] - H[q]) > GRADE * cell * 1.5) seams.push(i, j, Math.abs(H[k] - H[q]));
    }
    for (let e = 0; e < seams.length; e += 3) {
      const R = seams[e + 2] / (2 * GRADE) + cell, rr = Math.ceil(R / cell), ci = seams[e], cj = seams[e + 1];
      for (let dj = -rr; dj <= rr; dj++) for (let di = -rr; di <= rr; di++) {
        const i = ci + di, j = cj + dj; if (i < 0 || j < 0 || i >= nx || j >= nz || (di * di + dj * dj) * cell * cell > R * R) continue;
        if (fixed[j * nx + i] === 3) fixed[j * nx + i] = 0;
      }
    }
    for (let k = 0; k < nx * nz; k++) if (!fixed[k] && prev) H[k] = prev.at(x0 + (k % nx) * cell, z0 + Math.floor(k / nx) * cell);
    // (the field's border: at the height of the circuit nearest it, weighted by distance - the land runs out level from
    //  each part of the lap, the way a graded venue does, instead of being pulled down to one far height all round: a
    //  hilltop corner like Turn 1 stood on a cone with its sides falling away 20 % beyond the run-off)
    const rim = (x, z) => { let sw = 0, sh = 0; for (let s = 0; s < track.n; s += 4) { const d2 = (x - track.px[s]) ** 2 + (z - track.pz[s]) ** 2 + 1, w = 1 / (d2 * d2); sw += w; sh += w * h[s]; } return sh / sw; };
    for (let i = 0; i < nx; i++) { fixed[i] = fixed[(nz - 1) * nx + i] = 2; H[i] = rim(x0 + i * cell, z0); H[(nz - 1) * nx + i] = rim(x0 + i * cell, z0 + (nz - 1) * cell); }
    for (let j = 0; j < nz; j++) { fixed[j * nx] = fixed[j * nx + nx - 1] = 2; H[j * nx] = rim(x0, z0 + j * cell); H[j * nx + nx - 1] = rim(x0 + (nx - 1) * cell, z0 + j * cell); }
    const iters = prev ? 160 : 700, w = 1.85;
    for (let it = 0; it < iters; it++) {
      for (let j = 1; j < nz - 1; j++) for (let i = 1; i < nx - 1; i++) {
        const k = j * nx + i; if (fixed[k]) continue;
        H[k] += w * ((H[k - 1] + H[k + 1] + H[k - nx] + H[k + nx]) * 0.25 - H[k]);
      }
    }
    const F = field(H, nx, nz, cell); F.fixed = fixed; return F;
  };
  const field = (H, nx, nz, cell) => ({
    H, nx, nz, cell, x0, z0,
    at(x, z) {
      const u = Math.max(0, Math.min(nx - 1.001, (x - x0) / cell)), v = Math.max(0, Math.min(nz - 1.001, (z - z0) / cell));
      const i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, k = j * nx + i;
      return (H[k] * (1 - fu) + H[k + 1] * fu) * (1 - fv) + (H[k + nx] * (1 - fu) + H[k + nx + 1] * fu) * fv;
    },
  });
  let F = null; for (const cell of [CELL * 4, CELL * 2, CELL]) F = level(cell, F);
  // (far out, past the venue, the land comes down gently to the flat plane beyond the field - which lies under the lowest
  //  point of the lap, so it can never stand over the road)
  const bx0 = x0 + MARGIN, bx1 = x1 - MARGIN, bz0 = z0 + MARGIN, bz1 = z1 - MARGIN;
  for (let j = 0; j < F.nz; j++) for (let i = 0; i < F.nx; i++) {
    const x = x0 + i * F.cell, z = z0 + j * F.cell, out = Math.max(bx0 - x, x - bx1, bz0 - z, z - bz1), t = Math.max(0, Math.min(1, (out - (MARGIN - 700)) / 600)), k = j * F.nx + i;
    if (t > 0 && F.fixed[k] !== 1) F.H[k] += (edge + 0.3 - F.H[k]) * t * t * (3 - 2 * t);
  }
  F.edge = edge;
  return F;
}

/** switch the venue's ground on (a height field) or off (null) */
export function setTerrain(F, track = null) {
  TERRAIN.tint = null; TERRAIN.halfRoadAt = null; TERRAIN.sink = null;   // (a venue's ground colouring, (x, z) -> [r, g, b]: set by its scenery after this)
  if (!F) { TERRAIN.on = false; TERRAIN.edge = 0; TERRAIN.at = () => 0; TERRAIN.grad = (x, z, out = [0, 0]) => { out[0] = out[1] = 0; return out; }; TERRAIN.field = null; TERRAIN.road = null; return; }
  TERRAIN.on = true; TERRAIN.edge = F.edge; TERRAIN.field = F;
  // near the circuit, its own height exactly (the grid's 8 m cells would let the ground cut corners off the road over a
  // crest or into a dip): by the nearest point of the lap, out to the edge of the strip held at its height, then
  // blended into the field over the last 6 m of it
  const h = track?.h, q = {}, HS = track?.holdS, hold = HS ? HS.reduce((a, b) => Math.max(a, b), 0) : (track?.maxHalfWidth || track?.halfWidth || 0) + HOLD;
  const nearStrip = (x, z) => { const i = Math.floor((x - F.x0) / F.cell), j = Math.floor((z - F.z0) / F.cell); if (i < 0 || j < 0 || i >= F.nx - 1 || j >= F.nz - 1) return false; const k = j * F.nx + i; return F.fixed[k] === 1 || F.fixed[k + 1] === 1 || F.fixed[k + F.nx] === 1 || F.fixed[k + F.nx + 1] === 1; };
  TERRAIN.road = h ? (x, z, out = q) => {   // -> { h (the circuit's height there), d (offset from the centreline), s } | null
    if (!nearStrip(x, z)) return null;
    // (no hint: one shared between every caller - the cars, the cameras, the people - sent a query to whichever part of the
    //  lap the last one was on, and near where two parts of it come close it took that part's height, up to 3 m off)
    track.nearest(x, z, -1, out); if (!(Math.abs(out.d) <= hold)) return null;
    const u = track.wrapS(out.s) / track.ds, i0 = Math.floor(u) % track.n, f = u - Math.floor(u); out.h = h[i0] + (h[(i0 + 1) % track.n] - h[i0]) * f; return out;
  } : null;
  TERRAIN.at = (x, z) => {
    const fv = F.at(x, z), r = TERRAIN.road?.(x, z); if (!r) return fv;
    const hl = HS ? HS[r.i] : (track.hw ? track.hw[r.i] : track.halfWidth) + HOLD, w = Math.max(0, Math.min(1, (Math.abs(r.d) - (hl - 8)) / 8)); return r.h + (fv - r.h) * w * w * (3 - 2 * w);
  };
  // the slope (what the cars pitch and roll with, and what gravity pulls along): near the circuit the slope of its own
  // smoothed height profile along the lap, which changes gently from one metre to the next; the 8 m grid's bilinear cells
  // have a slope that jumps at every cell line (the onboard cameras shook on the climb to Turn 1). Further out the field's,
  // differenced over most of a cell so it too runs on without steps
  const dh = h ? new Float32Array(track.n) : null, qg = {}, ef = 6;
  if (dh) for (let i = 0; i < track.n; i++) dh[i] = (h[(i + 1) % track.n] - h[(i - 1 + track.n) % track.n]) / (2 * track.ds);
  TERRAIN.grad = (x, z, out = [0, 0]) => {
    const fx = (F.at(x + ef, z) - F.at(x - ef, z)) / (2 * ef), fz = (F.at(x, z + ef) - F.at(x, z - ef)) / (2 * ef), r = TERRAIN.road?.(x, z, qg);
    if (!r) { out[0] = fx; out[1] = fz; return out; }
    const u = track.wrapS(r.s) / track.ds, i0 = Math.floor(u) % track.n, i1 = (i0 + 1) % track.n, f = u - Math.floor(u);
    const sl = dh[i0] + (dh[i1] - dh[i0]) * f, tx = track.tx[i0] + (track.tx[i1] - track.tx[i0]) * f, tz = track.tz[i0] + (track.tz[i1] - track.tz[i0]) * f;
    const hl = HS ? HS[r.i] : (track.hw ? track.hw[r.i] : track.halfWidth) + HOLD, w0 = Math.max(0, Math.min(1, (Math.abs(r.d) - (hl - 8)) / 8)), w = w0 * w0 * (3 - 2 * w0);
    out[0] = sl * tx + (fx - sl * tx) * w; out[1] = sl * tz + (fz - sl * tz) * w; return out;
  };
}

// ---- the static world onto the ground ---------------------------------------------------------------------------------
const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _m = new THREE.Matrix4(), _mi = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();

/** a flat, large mesh (a car park, an apron drawn as a few big triangles) is cut up first, so it can follow the ground:
 *  every edge longer than `max` metres split in two, as often as it takes (an indexed geometry: position, normal, uv) */
function tessellate(g, max, mw) {
  if (!g.index || g.morphAttributes?.position) return g;
  const attrs = Object.keys(g.attributes), P = g.attributes.position;
  const data = Object.fromEntries(attrs.map((a) => [a, Array.from(g.attributes[a].array)])), size = Object.fromEntries(attrs.map((a) => [a, g.attributes[a].itemSize]));
  let tris = Array.from(g.index.array), changed = false;
  const wp = (k) => _w.set(data.position[k * 3], data.position[k * 3 + 1], data.position[k * 3 + 2]).applyMatrix4(mw).clone();
  const mid = new Map(), split = (a, b) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`; let m = mid.get(key); if (m != null) return m;
    m = data.position.length / 3; for (const at of attrs) { const s = size[at]; for (let c = 0; c < s; c++) data[at].push((data[at][a * s + c] + data[at][b * s + c]) / 2); }
    mid.set(key, m); return m;
  };
  for (let pass = 0; pass < 6; pass++) {
    const out = []; let any = false;
    for (let t = 0; t < tris.length; t += 3) {
      const a = tris[t], b = tris[t + 1], c = tris[t + 2], A = wp(a), B = wp(b), C = wp(c);
      const ab = Math.hypot(A.x - B.x, A.z - B.z), bc = Math.hypot(B.x - C.x, B.z - C.z), ca = Math.hypot(C.x - A.x, C.z - A.z), L = Math.max(ab, bc, ca);
      if (L <= max || data.position.length > 3 * 400000) { out.push(a, b, c); continue; }
      any = true;
      if (L === ab) { const m = split(a, b); out.push(a, m, c, m, b, c); } else if (L === bc) { const m = split(b, c); out.push(a, b, m, a, m, c); } else { const m = split(c, a); out.push(a, b, m, m, b, c); }
    }
    tris = out; if (!any) break; changed = true;
  }
  if (!changed) return g;
  const ng = new THREE.BufferGeometry();
  for (const at of attrs) ng.setAttribute(at, new THREE.Float32BufferAttribute(data[at], size[at]));
  ng.setIndex(tris); for (const gr of g.groups) ng.addGroup(gr.start, gr.count, gr.materialIndex);
  return ng;
}

/**
 * Raise the static world onto the ground: every object under `roots` that is not already on it (userData.onTerrain) or
 * kept off it (userData.noTerrain). A mesh by its own vertices (each by the ground under it, in world space - so a long
 * grandstand follows the slope it stands on; a shared geometry by the ground under the mesh's origin instead); an
 * instanced mesh by each instance's origin; a light, a sprite or a point by where it is. Groups are never moved (only the
 * leaves): each thing exactly once.
 */
export function elevateWorld(roots) {
  if (!TERRAIN.on) return 0;
  const users = new Map(), done = new Set(); let n = 0;   // (done: vertex buffers already raised - spatialChunks' tiles share one)
  for (const r of roots) r.traverse((o) => { if (o.isMesh && o.geometry && !o.isInstancedMesh) users.set(o.geometry, (users.get(o.geometry) || 0) + 1); });
  const lift = (o) => {   // (an object's own position: by the ground under its world position)
    o.getWorldPosition(_p); const dy = TERRAIN.at(_p.x, _p.z);
    _v.copy(_p); _v.y += dy; if (o.parent) o.parent.worldToLocal(_v); o.position.copy(_v); o.updateMatrixWorld(true);
  };
  for (const r of roots) {
    r.updateMatrixWorld(true);
    const stack = [r];
    while (stack.length) {
      const o = stack.pop();
      if (o.userData?.noTerrain || o.userData?.onTerrain) continue;
      if (o.isInstancedMesh) {
        const N = o.count, M = o.instanceMatrix;
        for (let k = 0; k < N; k++) {
          o.getMatrixAt(k, _m); _m.decompose(_p, _q, _s);
          _v.copy(_p).applyMatrix4(o.matrixWorld); const dy = TERRAIN.at(_v.x, _v.z);
          _w.copy(_v); _w.y += dy; _mi.copy(o.matrixWorld).invert(); _w.applyMatrix4(_mi);
          _m.compose(_w, _q, _s); o.setMatrixAt(k, _m);
        }
        M.needsUpdate = true; o.computeBoundingSphere?.(); o.computeBoundingBox?.(); n++;
      } else if (o.isMesh && o.geometry?.attributes?.position && !o.isSkinnedMesh) {
        if ((users.get(o.geometry) || 0) > 1) { lift(o); n++; }
        else {
          o.updateMatrixWorld(true);
          // (a flat mesh with long edges is cut up first: a big triangle cannot bend over the ground)
          const g0 = o.geometry, ranged = isFinite(g0.drawRange.count) || done.has(g0.attributes.position.array);
          let g = g0;
          if (!ranged) { g0.computeBoundingBox?.(); const bb = g0.boundingBox; if (bb && (bb.max.y - bb.min.y) < 2.5) { g = tessellate(g0, 10, o.matrixWorld); if (g !== g0) { o.geometry = g; g0.dispose(); } } }
          const P = g.attributes.position;
          if (!done.has(P.array)) {
            done.add(P.array); _mi.copy(o.matrixWorld).invert();
            for (let k = 0; k < P.count; k++) { _v.fromBufferAttribute(P, k).applyMatrix4(o.matrixWorld); _v.y += TERRAIN.at(_v.x, _v.z); _v.applyMatrix4(_mi); P.setXYZ(k, _v.x, _v.y, _v.z); }
            P.needsUpdate = true;
          }
          if (isFinite(g.drawRange.count) && g.index) {   // (a tile: its own bounds, over its own triangles)
            const I = g.index.array, bb = new THREE.Box3();
            for (let i = g.drawRange.start; i < g.drawRange.start + g.drawRange.count; i++) bb.expandByPoint(_v.fromBufferAttribute(P, I[i]));
            g.boundingBox = bb; g.boundingSphere = bb.getBoundingSphere(new THREE.Sphere()); g.boundingSphere.radius += 1;
          } else { g.computeBoundingBox(); g.computeBoundingSphere(); }
          n++;
        }
        o.userData.onTerrain = true;
      } else if (o.isLight || o.isSprite || o.isPoints) {
        if (!(o.isDirectionalLight || o.isHemisphereLight || o.isAmbientLight)) { lift(o); if (o.target && o.target.parent == null) { o.target.position.y += TERRAIN.at(o.target.position.x, o.target.position.z); o.target.updateMatrixWorld(); } n++; }
      }
      if (!o.isInstancedMesh) for (const c of o.children) stack.push(c);
    }
  }
  return n;
}

/** the ground near the circuit as a mesh on the height field (the flat plane beyond it is lowered to the field's edge):
 *  the same material and the same texture coordinates as the plane (12 km across, centred on the origin), in tiles of
 *  64 x 64 cells so the off-screen ones cull */
const _rq = {};
export function terrainGround(F, material, planeSize = 12000) {
  const group = new THREE.Group(); group.name = 'terrain'; group.userData.onTerrain = true;
  // (a venue's own colouring of its ground - dry patches, scrub, mown verges - in the vertex colours of a copy of the
  //  ground's material, which keeps following the original's day / night texture)
  const tinted = TERRAIN.tint ? material.clone() : null;
  if (tinted) { tinted.vertexColors = true; group.userData.sync = () => { if (tinted.map !== material.map) { tinted.map = material.map; tinted.color.copy(material.color); tinted.needsUpdate = true; } }; }
  const T = 64;
  for (let tj = 0; tj < F.nz - 1; tj += T) for (let ti = 0; ti < F.nx - 1; ti += T) {
    const ni = Math.min(T, F.nx - 1 - ti), nj = Math.min(T, F.nz - 1 - tj), pos = [], uv = [], idx = [];
    for (let j = 0; j <= nj; j++) for (let i = 0; i <= ni; i++) {
      const x = F.x0 + (ti + i) * F.cell, z = F.z0 + (tj + j) * F.cell;
      // (under the road and its kerbs the grass is kept 15 cm down: no cell of it can show through the asphalt)
      const r = TERRAIN.road?.(x, z, _rq), under = r && Math.abs(r.d) < (TERRAIN.halfRoadAt ? TERRAIN.halfRoadAt(r.i, r.d > 0 ? 1 : -1) : TERRAIN.halfRoad || 9);
      pos.push(x, (r ? TERRAIN.at(x, z) : F.H[(tj + j) * F.nx + ti + i]) - (under ? 0.15 : 0.05) - (TERRAIN.sink ? TERRAIN.sink(x, z, r) : 0), z); uv.push(x / planeSize + 0.5, -z / planeSize + 0.5);
    }
    for (let j = 0; j < nj; j++) for (let i = 0; i < ni; i++) { const a = j * (ni + 1) + i, b = a + 1, c = a + ni + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    if (tinted) { const col = new Float32Array(pos.length); for (let k = 0; k < pos.length; k += 3) col.set(TERRAIN.tint(pos[k], pos[k + 2]), k); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
    const m = new THREE.Mesh(g, tinted || material); if (tinted) m.onBeforeRender = group.userData.sync; m.receiveShadow = true; m.renderOrder = 1; m.userData.onTerrain = true; group.add(m);
  }
  return group;
}
