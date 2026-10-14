// GeoJSON ingestion: parses OSM features, builds a road graph and chains the
// circuit centerline from a track definition (ordered legs of allowed road names).
import { Projection } from './Projection.js';

const key = (c) => `${c[0].toFixed(7)},${c[1].toFixed(7)}`;

export class GeoWorld {
  constructor(geojson, def) {
    this.def = def;
    this.features = geojson.features;
    this.proj = new Projection(def.origin[0], def.origin[1]);
    this.roads = [];       // { name, highway, id, pts:[[x,z]...] }
    this.buildings = [];   // { name, props, rings:[[[x,z]...]], height }
    this.points = [];
    this.graph = new Map();  // nodeKey -> { p:[x,z], lonlat, edges:[{to, w, name}] }
    this._ingest();
  }

  _ingest() {
    for (const f of this.features) {
      const g = f.geometry; if (!g) continue;
      const p = f.properties || {};
      const fid = f.id || p['@id'];
      if (g.type === 'LineString') {
        const pts = g.coordinates.map((c) => this.proj.toXZ(c[0], c[1]));
        this.roads.push({ id: fid, name: p.name || '', highway: p.highway || '', props: p, pts, lonlat: g.coordinates });
        if (p.highway) this._addToGraph(g.coordinates, pts, p.name || '');
      } else if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
        const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        for (const poly of polys) {
          const rings = poly.map((ring) => ring.map((c) => this.proj.toXZ(c[0], c[1])));
          this.buildings.push({ id: fid, name: p.name || '', props: p, rings, height: this.buildingHeight(p) });
        }
      } else if (g.type === 'Point') {
        this.points.push({ id: fid, props: p, p: this.proj.toXZ(g.coordinates[0], g.coordinates[1]), lonlat: g.coordinates });
      }
    }
  }

  /** feature.properties.height -> building:levels * 3.5 -> 12 m */
  buildingHeight(p) {
    if (p.height != null) {
      const h = parseFloat(String(p.height).replace(/[^\d.]/g, ''));
      if (isFinite(h) && h > 0) return h;
    }
    if (p['building:levels'] != null) {
      const lv = parseFloat(p['building:levels']);
      if (isFinite(lv) && lv > 0) return lv * 3.5;
    }
    return this.def.defaultBuildingHeight || 12;
  }

  _addToGraph(coords, pts, name) {
    for (let i = 0; i < coords.length - 1; i++) {
      const ka = key(coords[i]), kb = key(coords[i + 1]);
      const a = this._node(ka, pts[i], coords[i]), b = this._node(kb, pts[i + 1], coords[i + 1]);
      const w = Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1]);
      a.edges.push({ to: kb, w, name });
      b.edges.push({ to: ka, w, name });
    }
  }
  _node(k, p, lonlat) {
    let n = this.graph.get(k);
    if (!n) { n = { k, p, lonlat, edges: [] }; this.graph.set(k, n); }
    return n;
  }

  nearestNode(lon, lat, roads = null) {
    const [x, z] = this.proj.toXZ(lon, lat);
    let best = null, bd = Infinity;
    for (const n of this.graph.values()) {
      if (roads && !n.edges.some((e) => roads.has(e.name))) continue;
      const d = (n.p[0] - x) ** 2 + (n.p[1] - z) ** 2;
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }

  /** Dijkstra restricted to a set of road names. Returns {path:[nodes], reached:boolean}. */
  route(srcKey, dstKey, roads) {
    const dist = new Map([[srcKey, 0]]);
    const prev = new Map();
    const open = [[0, srcKey]];
    const done = new Set();
    while (open.length) {
      // small graph: linear extraction is fine
      let bi = 0; for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
      const [d, u] = open.splice(bi, 1)[0];
      if (done.has(u)) continue; done.add(u);
      if (u === dstKey) break;
      for (const e of this.graph.get(u).edges) {
        if (!roads.has(e.name)) continue;
        const nd = d + e.w;
        if (nd < (dist.get(e.to) ?? Infinity)) { dist.set(e.to, nd); prev.set(e.to, u); open.push([nd, e.to]); }
      }
    }
    let end = dstKey, reached = true;
    if (!dist.has(dstKey)) {
      // unreachable (export clipped): take the reachable node closest to the target, caller bridges the gap
      reached = false;
      const t = this.graph.get(dstKey).p; let bd = Infinity;
      for (const k of dist.keys()) {
        const p = this.graph.get(k).p; const d = (p[0] - t[0]) ** 2 + (p[1] - t[1]) ** 2;
        if (d < bd) { bd = d; end = k; }
      }
    }
    const path = [end];
    while (path[path.length - 1] !== srcKey) path.push(prev.get(path[path.length - 1]));
    path.reverse();
    return { path: path.map((k) => this.graph.get(k)), reached };
  }

  /**
   * Chains the closed circuit centerline from def.legs: [{ roads:[names], to:[lon,lat] }].
   * Returns { pts:[[x,z]...] (closed, no duplicate end), bridges:[...], legStarts:[index] }
   */
  buildCircuit() {
    const def = this.def;
    if (def.ways) return this.buildCircuitFromWays(def.ways);
    let cur = this.nearestNode(def.chainStart[0], def.chainStart[1]);
    const pts = [cur.p];
    const bridges = [];
    const legStarts = [];
    for (const leg of def.legs) {
      legStarts.push(pts.length - 1);
      if (leg.via) {
        // explicit waypoints (sections missing from the export): straight bridges between them
        for (const ll of leg.via) { const p = this.proj.toXZ(ll[0], ll[1]); bridges.push({ from: pts[pts.length - 1], to: p, leg: 'via' }); pts.push(p); }
        const last = leg.via[leg.via.length - 1];
        const node = this.nearestNode(last[0], last[1]);
        const lp = pts[pts.length - 1];
        if (Math.hypot(node.p[0] - lp[0], node.p[1] - lp[1]) > 0.5) pts.push(node.p);
        cur = node;
        continue;
      }
      const roads = new Set(leg.roads);
      const target = this.nearestNode(leg.to[0], leg.to[1]);
      const { path, reached } = this.route(cur.k, target.k, roads);
      for (let i = 1; i < path.length; i++) pts.push(path[i].p);
      if (!reached) {
        bridges.push({ from: path[path.length - 1].p, to: target.p, leg: leg.roads.join('/') });
        pts.push(target.p);
      }
      cur = target;
    }
    // close: drop the duplicated final node if it coincides with the start
    const a = pts[0], b = pts[pts.length - 1];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.5) pts.pop();
    // dedupe consecutive
    const out = [pts[0]];
    for (const p of pts.slice(1)) { const q = out[out.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05) out.push(p); }
    return { pts: out, bridges, legStarts };
  }

  /**
   * Permanent circuits: the lap is an ordered list of raceway way ids. Each way is appended in the direction that
   * continues from the previous one (reversed if needed); a gap between consecutive ways is bridged and reported.
   */
  buildCircuitFromWays(ids) {
    const pts = [], bridges = [], legStarts = [];
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    ids.forEach((id, k) => {
      const w = this.roadById(id); if (!w) throw new Error(`circuit way ${id} is not in the GeoJSON export`);
      let p = w.pts;
      if (pts.length) {
        const last = pts[pts.length - 1];
        if (d(last, p[p.length - 1]) < d(last, p[0])) p = [...p].reverse();
        if (d(last, p[0]) > 1) bridges.push({ from: last, to: p[0], leg: id });
      } else if (ids.length > 1) {   // orient the first way so that it ends where the second begins
        const nx = this.roadById(ids[1]); if (nx && Math.min(d(p[0], nx.pts[0]), d(p[0], nx.pts[nx.pts.length - 1])) < Math.min(d(p[p.length - 1], nx.pts[0]), d(p[p.length - 1], nx.pts[nx.pts.length - 1]))) p = [...p].reverse();
      }
      legStarts.push(pts.length);
      for (const q of p) if (!pts.length || d(pts[pts.length - 1], q) > 0.05) pts.push(q);
    });
    if (d(pts[0], pts[pts.length - 1]) < 0.5) pts.pop();
    return { pts, bridges, legStarts };
  }

  roadById(id) { return this.roads.find((r) => r.id === id); }

  roadsByHighway(types) { return this.roads.filter((r) => types.has(r.highway)); }
}

export async function loadGeoJSON(url) {
  // single-file build: every track's GeoJSON is embedded in the page as <script id="geojson-<name>"> (fetch is
  // not allowed from file://)
  const stem = url.split('/').pop().replace(/\.geojson$/, '');
  const inline = typeof document !== 'undefined' && document.getElementById(`geojson-${stem}`);
  if (inline) return JSON.parse(inline.textContent);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GeoJSON load failed: ${res.status}`);
  return res.json();
}

// ---- polygon helpers -------------------------------------------------------
export function ringArea(r) {
  let a = 0;
  for (let i = 0, n = r.length; i < n; i++) { const p = r[i], q = r[(i + 1) % n]; a += p[0] * q[1] - q[0] * p[1]; }
  return a / 2;
}
export function ringCentroid(r) {
  let cx = 0, cz = 0, a = 0;
  for (let i = 0, n = r.length; i < n; i++) {
    const p = r[i], q = r[(i + 1) % n]; const c = p[0] * q[1] - q[0] * p[1];
    a += c; cx += (p[0] + q[0]) * c; cz += (p[1] + q[1]) * c;
  }
  if (Math.abs(a) < 1e-6) { // degenerate: average
    const n = r.length; return [r.reduce((s, p) => s + p[0], 0) / n, r.reduce((s, p) => s + p[1], 0) / n];
  }
  a *= 3; return [cx / a, cz / a];
}
/** Principal axis via 2D covariance: returns { c:[x,z], angle (rad, of long axis), length, width } */
export function footprintInfo(ring) {
  const c = ringCentroid(ring);
  let sxx = 0, szz = 0, sxz = 0;
  for (const p of ring) { const dx = p[0] - c[0], dz = p[1] - c[1]; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
  const angle = 0.5 * Math.atan2(2 * sxz, sxx - szz);
  const ca = Math.cos(angle), sa = Math.sin(angle);
  let minL = Infinity, maxL = -Infinity, minW = Infinity, maxW = -Infinity;
  for (const p of ring) {
    const dx = p[0] - c[0], dz = p[1] - c[1];
    const l = dx * ca + dz * sa, w = -dx * sa + dz * ca;
    if (l < minL) minL = l; if (l > maxL) maxL = l; if (w < minW) minW = w; if (w > maxW) maxW = w;
  }
  return { c, angle, length: maxL - minL, width: maxW - minW, area: Math.abs(ringArea(ring)) };
}
