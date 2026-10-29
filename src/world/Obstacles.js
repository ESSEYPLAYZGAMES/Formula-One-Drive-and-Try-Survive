// Solid things beside the circuit: every building footprint and grandstand, as polygons in a spatial grid. A car (on its
// wheels, tumbling, or half of one) that runs into one hits it like a wall - nothing drives or flies through a stand or
// a building. Queries are cheap: a 24 m grid, a bounding box per polygon, point-in-polygon only for the few nearby.
const CELL = 24;

export class Obstacles {
  constructor() { this.grid = new Map(); this.polys = []; }
  /** a footprint (ring [[x, z], ...]) standing h metres tall */
  add(ring, h = 12) {
    if (!ring || ring.length < 3) return;
    let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity, cx = 0, cz = 0;
    for (const [x, z] of ring) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); cx += x; cz += z; }
    const poly = { ring, h, x0, z0, x1, z1, cx: cx / ring.length, cz: cz / ring.length };
    this.polys.push(poly);
    for (let gx = Math.floor(x0 / CELL); gx <= Math.floor(x1 / CELL); gx++) for (let gz = Math.floor(z0 / CELL); gz <= Math.floor(z1 / CELL); gz++) {
      const k = gx * 100000 + gz; let a = this.grid.get(k); if (!a) this.grid.set(k, (a = [])); a.push(poly);
    }
  }
  /**
   * Drop every obstacle that reaches onto the circuit (a landmark's bounding box can span the road): the track's
   * centreline and both verges, every sample, must be clear. Returns how many were dropped.
   */
  clearTrack(track, margin = 4) {
    const bad = new Set(), h = {};
    for (let i = 0; i < track.n; i++) for (const d of [-track.hw[i] - margin, -track.hw[i] / 2, 0, track.hw[i] / 2, track.hw[i] + margin]) {
      const x = track.px[i] + track.nx[i] * d, z = track.pz[i] + track.nz[i] * d;
      if (this.hit(x, z, 0, h)) bad.add(h.poly);
    }
    if (!bad.size) return 0;
    this.polys = this.polys.filter((p) => !bad.has(p));
    for (const [k, a] of this.grid) this.grid.set(k, a.filter((p) => !bad.has(p)));
    return bad.size;
  }
  /** a rectangle: centre-front (ox, oz), along-axis ex, outward axis ez, length, depth (a grandstand) */
  addRect(ox, oz, ex, ez, len, depth, h) {
    const w = (lx, lz) => [ox + ex[0] * lx + ez[0] * lz, oz + ex[1] * lx + ez[1] * lz];
    this.add([w(-len / 2, 0), w(len / 2, 0), w(len / 2, depth), w(-len / 2, depth)], h);
  }
  /**
   * Is the point (x, y, z) inside an obstacle? -> out { nx, nz (the way out, unit), pen (m) } and true, or false.
   * The way out is through the nearest edge.
   */
  hit(x, z, y = 0, out = {}) {
    const a = this.grid.get(Math.floor(x / CELL) * 100000 + Math.floor(z / CELL)); if (!a) return false;
    for (const p of a) {
      if (y > p.h || x < p.x0 || x > p.x1 || z < p.z0 || z > p.z1) continue;
      const r = p.ring; let inside = false;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > z) !== (r[j][1] > z) && x < (r[j][0] - r[i][0]) * (z - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) inside = !inside;
      if (!inside) continue;
      // the nearest edge, and its outward normal
      let best = Infinity, bnx = 0, bnz = 0;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const ax = r[j][0], az = r[j][1], ex = r[i][0] - ax, ez = r[i][1] - az, l2 = ex * ex + ez * ez || 1;
        const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / l2)), qx = ax + ex * t, qz = az + ez * t, dd = Math.hypot(x - qx, z - qz);
        if (dd < best) {
          best = dd; const l = Math.sqrt(l2); let nx = ez / l, nz = -ex / l;
          if ((qx - p.cx) * nx + (qz - p.cz) * nz < 0) { nx = -nx; nz = -nz; }   // (pointing away from the inside)
          bnx = nx; bnz = nz;
        }
      }
      out.nx = bnx; out.nz = bnz; out.pen = best; out.poly = p; return true;
    }
    return false;
  }
}
