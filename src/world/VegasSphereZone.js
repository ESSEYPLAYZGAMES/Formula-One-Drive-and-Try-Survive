// Las Vegas: the T-Mobile Zone at Sphere on race night (2024) - Turns 5 to 9, the loop round the Sphere.
//  * The chicane's run-off on the way in (Turns 7-8, its outside: TrackBuilder escapes band): painted the race's red with
//    its mark written large across it (the race's render of the chicane); aramco's boards on the walls round it.
//  * The white lattice lighting gantries: one along the inside wall of the chicane, its lamps on the track and the
//    aramco banner hung from it; light towers along the run-off's outer wall.
//  * The T-Mobile grandstands round the loop: magenta-clad scaffold stands outside the south leg, round Turn 6 and
//    along the run-off, the big lit T-Mobile cube over them, marshals' posts on the run-off's wall.
//  * The fan zone inside the loop between the track and the Sphere: white marquees, the stage and its screen,
//    magenta container bars, light towers.
// The stands' tiers and crowds are world/Grandstands.js's (returned as fixed placements, as VegasPaddock's are).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { corridorSigned } from '../track/TrackBuilder.js';
import { STAND } from './Grandstands.js';

const FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
function canvasTex(w, h, draw, repeat = false) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
/** the T-Mobile T: the bar, the stem, a square either side of the stem */
function tmoT(x, cx, cy, h, col) {
  x.fillStyle = col; const w = h * 0.9, t = h * 0.22; x.fillRect(cx - w / 2, cy - h / 2, w, t); x.fillRect(cx - t / 2, cy - h / 2, t, h);
  for (const d of [-1, 1]) x.fillRect(cx + d * (t / 2 + t * 0.9) - t * 0.35, cy + h * 0.02, t * 0.7, t * 0.7);
}
/** the run-off's paint, in world metres (6 m a tile): the race's red (its render of the chicane), a fine grain of wear */
function runoffTexture() {
  return canvasTex(256, 256, (x, W, H) => {
    x.fillStyle = '#c8102e'; x.fillRect(0, 0, W, H);
    for (let k = 0; k < 1400; k++) { const v = Math.random(); x.fillStyle = v < 0.5 ? `rgba(255,255,255,${0.02 + Math.random() * 0.035})` : `rgba(60,0,10,${0.03 + Math.random() * 0.05})`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  }, true);
}
/** the race's mark written across the run-off, white: the F1 logo, LAS VEGAS GRAND PRIX beside it */
function aramcoWordTexture() {
  return canvasTex(2048, 512, (x, W, H) => {
    x.clearRect(0, 0, W, H); x.fillStyle = 'rgba(255,255,255,0.93)'; x.textBaseline = 'middle';
    x.font = `italic 900 ${H * 0.62}px ${FONT}`; x.textAlign = 'left'; const fw = x.measureText('F1').width;
    x.font = `800 ${H * 0.27}px ${FONT}`; const tw = Math.max(x.measureText('LAS VEGAS').width, x.measureText('GRAND PRIX').width), x0 = (W - fw - H * 0.12 - tw) / 2;
    x.font = `italic 900 ${H * 0.62}px ${FONT}`; x.fillText('F1', x0, H * 0.53);
    x.font = `800 ${H * 0.27}px ${FONT}`; x.fillText('LAS VEGAS', x0 + fw + H * 0.12, H * 0.36); x.fillText('GRAND PRIX', x0 + fw + H * 0.12, H * 0.68);
  });
}
/** the T-Mobile cladding of the stands: magenta, the T and the name (u along, v up) */
function tmoWallTexture() {
  return canvasTex(1024, 256, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff1f8e'); g.addColorStop(1, '#c4005f'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (const c of [0.12, 0.62]) { tmoT(x, W * c, H * 0.5, H * 0.5, '#ffffff'); x.fillStyle = '#ffffff'; x.font = `800 ${H * 0.34}px ${FONT}`; x.textBaseline = 'middle'; x.fillText('T-Mobile', W * (c + 0.07), H * 0.52); }
  }, true);
}
/** a white lattice truss face (alpha-tested): two chords and the diagonals */
function trussTexture() {
  return canvasTex(256, 64, (x, W, H) => {
    x.clearRect(0, 0, W, H); x.strokeStyle = '#f4f4f6'; x.lineWidth = 7;
    x.beginPath(); x.moveTo(0, 5); x.lineTo(W, 5); x.moveTo(0, H - 5); x.lineTo(W, H - 5); x.stroke();
    x.lineWidth = 4; x.beginPath(); for (let k = 0; k <= 4; k++) { const a = k * 64; x.moveTo(a, 5); x.lineTo(a + 32, H - 5); x.lineTo(a + 64, 5); } x.stroke();
  }, true);
}
/** the aramco banner hung on the gantry: the green board and the blue one, white names */
function aramcoBannerTexture() {
  return canvasTex(2048, 200, (x, W, H) => {
    x.fillStyle = '#13a24a'; x.fillRect(0, 0, W * 0.62, H); x.fillStyle = '#1479d6'; x.fillRect(W * 0.62, 0, W * 0.38, H);
    x.fillStyle = '#ffffff'; x.font = `600 ${H * 0.66}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('aramco', W * 0.31, H * 0.54); x.fillText('aramco', W * 0.81, H * 0.54);
  });
}
/** the stage's screen: the race on it (the world feed's colours, the timing) */
function stageScreenTexture() {
  return canvasTex(512, 256, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1430'); g.addColorStop(0.55, '#24304a'); g.addColorStop(1, '#3a3d44'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#555a62'; x.beginPath(); x.moveTo(W * 0.42, H * 0.55); x.lineTo(W * 0.58, H * 0.55); x.lineTo(W, H); x.lineTo(0, H); x.closePath(); x.fill();
    x.fillStyle = '#ff8a00'; x.fillRect(W * 0.43, H * 0.66, W * 0.14, H * 0.12); x.fillStyle = '#e20074'; x.fillRect(W * 0.02, H * 0.05, W * 0.16, H * 0.9);
    x.fillStyle = '#fff'; x.font = `800 ${H * 0.07}px ${FONT}`; for (let k = 0; k < 10; k++) x.fillText(`${k + 1}  ${['VER', 'NOR', 'LEC', 'PIA', 'SAI', 'HAM', 'RUS', 'PER', 'ALO', 'GAS'][k]}`, W * 0.03, H * (0.12 + k * 0.083));
    x.fillStyle = '#e10600'; x.font = `italic 900 ${H * 0.12}px ${FONT}`; x.fillText('F1', W * 0.86, H * 0.14);
  });
}

/**
 * -> { group, stands, lights, boxes, solids } (lights: { x, y, z, tx, tz } lamps for the floodlight field; boxes: kept
 * clear of the auto-placed stands and the city's infill; solids: { ring, h } the cars can hit)
 */
export function buildSphereZone(track, pit, def, near = []) {
  const tr = track, group = new THREE.Group(); group.name = 'vegas-sphere-zone';
  const stands = [], lights = [], solids = [], boxes = [], made = [];
  const cornerS = (n) => def.corners.find((c) => c.n === n)?.s;
  const c5 = cornerS(5), c6 = cornerS(6), c7 = cornerS(7), c8 = cornerS(8), c9 = cornerS(9), c10 = cornerS(10);
  if ([c5, c6, c7, c8, c9, c10].some((v) => v == null)) return { group, stands, lights, boxes, solids };
  const f = {}, f2 = {}, kw = tr.kerbWidth;
  const inRing = (x, z, r) => { let k = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const xi = r[i][0], zi = r[i][1], xj = r[j][0], zj = r[j][1]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) k = !k; } return k; };
  const okAt = (x, z, m = 1) => corridorSigned(tr, pit, x, z, m) >= 0 && !near.some((r) => inRing(x, z, r));

  // ---- materials
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f2f4, roughness: 0.45, metalness: 0.05, emissive: 0x231a24, side: THREE.DoubleSide });
  const truss = new THREE.MeshBasicMaterial({ map: trussTexture(), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xe8eaf0 });
  const flood = new THREE.MeshBasicMaterial({ color: 0xfffbf0 });
  const lit = (map, k = 0.6, extra = {}) => { const m = new THREE.MeshStandardMaterial({ map, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: k, roughness: 0.6, side: THREE.DoubleSide, ...extra }); return m; };
  const runoff = lit(runoffTexture(), 0.3, { roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const word = lit(aramcoWordTexture(), 0.55, { transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  const tmoWall = lit(tmoWallTexture(), 0.75);
  const cube = new THREE.MeshBasicMaterial({ map: canvasTex(256, 256, (x, W, H) => { const g = x.createRadialGradient(W / 2, H / 2, W * 0.1, W / 2, H / 2, W * 0.75); g.addColorStop(0, '#ff3ea0'); g.addColorStop(1, '#d0006a'); x.fillStyle = g; x.fillRect(0, 0, W, H); tmoT(x, W / 2, H * 0.5, H * 0.56, '#ffffff'); }), color: 0xffffff });
  const banner = lit(aramcoBannerTexture(), 0.8);
  const numbers = lit(canvasTex(1024, 256, (x, W, H) => { x.clearRect(0, 0, W, H); x.fillStyle = '#ffffff'; x.font = `800 ${H * 0.36}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; for (let n = 0; n < 16; n++) x.fillText(String(n + 1).padStart(2, '0'), (n % 8 + 0.5) * W / 8, (Math.floor(n / 8) + 0.5) * H / 2); }), 0.8, { transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const tunnel = new THREE.MeshBasicMaterial({ map: canvasTex(128, 96, (x, W, H) => { x.fillStyle = '#0c0a10'; x.fillRect(0, 0, W, H); const g = x.createLinearGradient(0, H, 0, 0); g.addColorStop(0, 'rgba(255,220,240,0.55)'); g.addColorStop(1, 'rgba(255,220,240,0)'); x.fillStyle = g; x.fillRect(W * 0.15, H * 0.2, W * 0.7, H * 0.8); }), side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const screen = new THREE.MeshBasicMaterial({ map: stageScreenTexture(), side: THREE.DoubleSide });
  const black = new THREE.MeshStandardMaterial({ color: 0x141418, roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide });
  const tent = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.55, emissive: 0x3a3440, side: THREE.DoubleSide });
  const container = lit(canvasTex(512, 128, (x, W, H) => { x.fillStyle = '#e20074'; x.fillRect(0, 0, W, H); x.fillStyle = 'rgba(0,0,0,0.18)'; for (let k = 0; k < 32; k++) x.fillRect(k * 16, 0, 3, H); tmoT(x, W * 0.2, H * 0.5, H * 0.5, '#fff'); x.fillStyle = '#fff'; x.font = `800 ${H * 0.34}px ${FONT}`; x.textBaseline = 'middle'; x.fillText('T-Mobile', W * 0.3, H * 0.52); }), 0.55);
  const orange = new THREE.MeshStandardMaterial({ color: 0xff6a10, emissive: 0x6a2004, roughness: 0.6 });
  const grey = new THREE.MeshStandardMaterial({ color: 0x4a4e57, roughness: 0.7, metalness: 0.25 });
  const geos = new Map(); const put = (mat, g) => { if (!geos.has(mat)) geos.set(mat, []); geos.get(mat).push(g); };
  /** a box: centre (x, y, z), size lx along ex, ly up, lz across */
  const boxAt = (x, y, z, ex, lx, ly, lz) => { const g = new THREE.BoxGeometry(lx, ly, lz); g.rotateY(Math.atan2(-ex[1], ex[0])); g.translate(x, y, z); return g; };
  /** a lattice mast: four white chords and the truss faces between them, h tall, 0.9 m square */
  const mast = (x, z, h, ex = [1, 0]) => {
    const ez = [-ex[1], ex[0]];
    for (const [a, b] of [[-0.45, -0.45], [0.45, -0.45], [0.45, 0.45], [-0.45, 0.45]]) put(white, boxAt(x + ex[0] * a + ez[0] * b, h / 2, z + ex[1] * a + ez[1] * b, ex, 0.12, h, 0.12));
    for (const [ou, ow, rot] of [[0, -0.45, 0], [0, 0.45, 0], [-0.45, 0, 1], [0.45, 0, 1]]) {
      const g = new THREE.PlaneGeometry(0.9, h), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getY(j) * h / 4, uv.getX(j));
      g.rotateY(Math.atan2(-ex[1], ex[0]) + (rot ? Math.PI / 2 : 0)); g.translate(x + ex[0] * ou + ez[0] * ow, h / 2, z + ex[1] * ou + ez[1] * ow); put(truss, g);
    }
  };
  /** a horizontal box truss from a to b at height y (0.9 m deep) */
  const beam = (a, b, y) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ex = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], ez = [-ex[1], ex[0]], ang = Math.atan2(-ex[1], ex[0]), mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
    for (const [dy, dz, rotX] of [[0, -0.45, 0], [0, 0.45, 0], [0.45, 0, 1], [-0.45, 0, 1]]) {
      const g = new THREE.PlaneGeometry(L, 0.9), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * L / 4);
      if (rotX) g.rotateX(Math.PI / 2); g.rotateY(ang); g.translate(mx + ez[0] * dz, y + dy, mz + ez[1] * dz); put(truss, g);
    }
  };

  // =============================================================================================================
  // the chicane's run-off: its paint out to the walls, the name along its widest part
  // =============================================================================================================
  const EB = (tr.escapeBands || []).find((e) => e.turn === 7);
  if (EB) {
    // (one polygon: the wall's arc from end to end, back along the kerb's outer edge - the wall samples themselves fold
    //  over one another on the inside of Turn 8, where the normals they were pushed out along converge)
    const sd = EB.side, arc = EB.outer, edge = [];
    for (let s = EB.sB; s >= EB.sA - 0.01; s -= 2) { const i = tr.idxAtS(s); tr.sample(s, sd * (tr.edgeAt(i, sd) + kw - 0.05), f); edge.push([f.x, f.z]); }
    const poly = [...arc, ...edge], shp = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
    { const g = new THREE.ShapeGeometry(shp); g.rotateX(-Math.PI / 2); g.translate(0, 0.03, 0); const P = g.attributes.position, uv = g.attributes.uv; for (let j = 0; j < P.count; j++) uv.setXY(j, P.getX(j) / 6, P.getZ(j) / 6); g.computeVertexNormals(); put(runoff, g); }
    // (the race's mark: across its middle, along the line between the arc's ends, its foot toward the grandstand behind it)
    {
      const { A, B } = EB.arc, mid = arc[arc.length >> 1], iM = tr.idxAtS((EB.sA + EB.sB) / 2); tr.sample((EB.sA + EB.sB) / 2, sd * (tr.edgeAt(iM, sd) + kw), f);
      const w = Math.hypot(mid[0] - f.x, mid[1] - f.z), c = [(mid[0] + f.x) / 2, (mid[1] + f.z) / 2], CL = Math.hypot(B[0] - A[0], B[1] - A[1]);
      let t = [(B[0] - A[0]) / CL, (B[1] - A[1]) / CL]; const out = [(mid[0] - f.x) / (w || 1), (mid[1] - f.z) / (w || 1)];
      // (u along t, the letters left to right for someone at the stand facing the track: facing -out, their right hand is
      //  (out.z, -out.x), so t is turned to it - its left normal is then out)
      const nl = [-t[1], t[0]]; if (nl[0] * out[0] + nl[1] * out[1] < 0) t = [-t[0], -t[1]];
      const L = Math.min(72, CL * 0.42, w * 2.4), Wd = L / 4, up = [-out[0], -out[1]];
      const P = (u, v) => [c[0] + t[0] * u + up[0] * v, 0.05, c[1] + t[1] * u + up[1] * v];
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...P(-L / 2, -Wd / 2), ...P(L / 2, -Wd / 2), ...P(L / 2, Wd / 2), ...P(-L / 2, -Wd / 2), ...P(L / 2, Wd / 2), ...P(-L / 2, Wd / 2)], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2)); g.computeVertexNormals(); group.add(new THREE.Mesh(g, word));
      made.push(`run-off ${(EB.sB - EB.sA).toFixed(0)} m long, ${w.toFixed(0)} m deep at its middle, its wall's straight run ${CL.toFixed(0)} m end to end`);
    }
    // (nothing stands in it or on its wall: its light comes from the stands' lamps behind it and the gantry across the
    //  track) - marshals' posts at its two ends, behind the wall
    for (const s of [EB.sA + 8, EB.sB - 6]) {
      const i = tr.idxAtS(s), ex = [tr.tx[i], tr.tz[i]], p = tr.sample(s, sd * (tr.wallAt(i, sd) + 1.4), f);
      put(white, boxAt(p.x, 1.6, p.z, ex, 3.0, 3.2, 1.8)); put(grey, boxAt(p.x, 3.3, p.z, ex, 3.4, 0.2, 2.2));
      for (const k of [-0.8, 0.6]) { const q = tr.sample(s + k, sd * (tr.wallAt(i, sd) + 0.5), f2); put(orange, boxAt(q.x, 0.9, q.z, ex, 0.5, 1.6, 0.32)); put(orange, boxAt(q.x, 1.85, q.z, ex, 0.24, 0.26, 0.24)); }
    }
  }

  // =============================================================================================================
  // the lighting gantry along the chicane's inside wall: lattice masts, the truss over the fence, lamps on the track,
  // the aramco banner hung from it (the photos from the stands across the run-off)
  // =============================================================================================================
  {
    const sd = -(EB ? EB.side : -1), sA = c7 - 40, sB = c9 - 10, H = 11.5, pts = [];
    for (let s = sA; s <= sB; s += 24) { const i = tr.idxAtS(s), p = tr.sample(s, sd * (tr.wallAt(i, sd) + 1.8), f); if (!okAt(p.x, p.z, 0.5)) continue; pts.push([p.x, p.z, s, i]); }
    for (let k = 0; k < pts.length; k++) {
      const [x, z, s, i] = pts[k]; mast(x, z, H + 0.5, [tr.tx[i], tr.tz[i]]);
      if (k) beam(pts[k - 1], pts[k], H);
      for (const da of [-6, 6]) { const q = tr.sample(s + da, sd * (tr.wallAt(i, sd) + 1.0), f), aim = tr.sample(s + da, -sd * 3, f2); put(flood, boxAt(q.x, H - 0.8, q.z, [tr.tx[i], tr.tz[i]], 1.6, 0.4, 0.7)); lights.push({ x: q.x, y: H - 0.8, z: q.z, tx: aim.x, tz: aim.z }); }
    }
    // (the banner: under the truss in its middle span, facing the track)
    if (pts.length > 3) {
      const k = pts.length >> 1, a = pts[k - 1], b = pts[k], L = Math.hypot(b[0] - a[0], b[1] - a[1]), ex = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      const g = new THREE.PlaneGeometry(L - 2, 2.2); g.rotateY(Math.atan2(-ex[1], ex[0])); g.translate((a[0] + b[0]) / 2, H - 2.2, (a[1] + b[1]) / 2); put(banner, g);
    }
    made.push(`gantry ${pts.length} masts`);
  }

  // =============================================================================================================
  // the T-Mobile grandstands: scaffold stands clad in magenta, round the outside of the loop
  // =============================================================================================================
  const STD = { tiers: 18, tierH: 0.55, tierD: 0.9, gap: 1.6 };
  const EBring = EB ? [...EB.outer, ...(() => { const r = []; for (let s = EB.sB; s >= EB.sA; s -= 4) { tr.sample(s, 0, f); r.push([f.x, f.z]); } return r; })()] : null;
  const placed = [];   // (every stand of the zone so far: none may stand in another, whichever chain it belongs to)
  const chain = (sA, sB, side, S, tag, given = null) => {
    const pts = given || []; if (!given) for (let s = sA; s <= sB; s += 1) { const i = tr.idxAtS(s); tr.sample(s, side * (tr.wallAt(i, side) + S.gap), f); pts.push([f.x, f.z]); }
    const depth = 0.8 + S.tiers * S.tierD + 0.6, out = [];
    const make = (a, b) => {
      const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), ex = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      const q = tr.nearest(mx, mz), t = tr.sample(q.s, 0, f2); let ez = [-ex[1], ex[0]]; if (ez[0] * (mx - t.x) + ez[1] * (mz - t.z) < 0) ez = [ex[1], -ex[0]];
      return { x: mx, z: mz, ex, ez, len: l0 - 0.4, depth, s: q.s, world: (lx, lz) => [mx + ex[0] * lx + ez[0] * lz, mz + ex[1] * lx + ez[1] * lz] };
    };
    const within = (p, x, z) => { const dx = x - p.x, dz = z - p.z, lx = dx * p.ex[0] + dz * p.ex[1], lz = dx * p.ez[0] + dz * p.ez[1]; return Math.abs(lx) < p.len / 2 + 0.8 && lz > -0.5 && lz < p.depth + 0.5; };
    const clear = (p) => {
      // (and the other way: no corner or edge of a stand already there inside this one)
      for (const o of [...placed, ...out]) for (const [lx, lz] of [[-1, 0], [1, 0], [-1, 1], [1, 1], [0, 0], [0, 1], [-1, 0.5], [1, 0.5]]) { const [x, z] = o.world(lx * o.len / 2, lz * o.depth); if (within(p, x, z)) return false; }
      for (let lx = -p.len / 2; lx <= p.len / 2 + 0.01; lx += 2) for (let lz = 0; lz <= p.depth + 0.01; lz += 2) {
        const [x, z] = p.world(lx, lz);
        if (corridorSigned(tr, pit, x, z, -0.4) < 0 || near.some((r) => inRing(x, z, r)) || out.some((o) => within(o, x, z)) || placed.some((o) => within(o, x, z))) return false;
        // (and never inside the barriers: a run-off is the cars' - the stand stands behind its wall)
        // (beside the run-off its outline decides - the wall samples there were pushed out along normals that converge on
        //  the inside of Turn 8, so one sample's wall says nothing about the point next to it)
        const q = tr.nearest(x, z, -1, f2), byBand = EB && q.s > EB.sA - 15 && q.s < EB.sB + 15 && Math.sign(q.d) === EB.side;
        if (!byBand && Math.abs(q.d) < tr.wallAt(q.i, q.d >= 0 ? 1 : -1) + 0.8) return false;
        if (EBring && inRing(x, z, EBring)) return false;
      }
      return true;
    };
    let k = 0;
    while (k < pts.length - 10) {
      let got = null;
      for (let k0 = k; k0 < Math.min(pts.length - 10, k + 24) && !got; k0++) for (const L of [30, 22, 15]) { if (k0 + L >= pts.length) continue; const p = make(pts[k0], pts[k0 + L]); if (clear(p)) { got = p; k = k0 + L + 1; break; } }
      if (got) out.push(got); else k += 4;
    }
    placed.push(...out);
    for (const p of out) Object.assign(p, { tiers: S.tiers, name: tag, style: { tierH: S.tierH, tierD: S.tierD, roof: 'none', seat: 0x22232a, fill: 0.93 } });
    made.push(`${tag} ${out.length} sections (${out.reduce((a, p) => a + p.len, 0).toFixed(0)} m)`);
    return out;
  };
  const south = chain(c5 + 45, c6 - 70, -1, STD, 'T-Mobile Zone south grandstand');
  const corner = chain(c6 - 55, c6 + 60, -1, STD, 'T-Mobile Zone Turn 6 grandstand');
  // (the chicane's stand: behind the run-off's wall, along its arc - not the wall samples, folded on the inside of Turn 8)
  let east = [];
  if (EB) {
    const arc = EB.outer, pts = [], S2 = { ...STD, tiers: 22 };
    for (let k = 0; k < arc.length - 1; k++) {
      const [x0, z0] = arc[k], [x1, z1] = arc[k + 1], L = Math.hypot(x1 - x0, z1 - z0), q = tr.nearest(x0, z0), o = tr.sample(q.s, 0, f2);
      let nx = -(z1 - z0) / L, nz = (x1 - x0) / L; if (nx * (x0 - o.x) + nz * (z0 - o.z) < 0) { nx = -nx; nz = -nz; }
      for (let u = 0; u < L; u += 1) pts.push([x0 + (x1 - x0) * u / L + nx * S2.gap, z0 + (z1 - z0) * u / L + nz * S2.gap]);
    }
    east = chain(0, 0, EB.side, S2, 'T-Mobile Zone chicane grandstand', pts.slice(Math.round(pts.length * 0.12), Math.round(pts.length * 0.9)));
    // (and out of Turn 8, where there is no run-off: the stand right behind the wall beside the road, to Turn 9)
    east.push(...chain(EB.sB + 4, c9 - 8, EB.side, S2, 'T-Mobile Zone chicane exit grandstand'));
  }
  const all = [...south, ...corner, ...east];
  // (their magenta, as the race's renders show them: the cladding under and behind the seats - the back wall up to the
  //  top row, the section's number on it and a tunnel through it, and at the ends of a stand its side, following the
  //  rake down to the front: nothing standing above the seats or across the view along the stand between sections)
  let num = 0;
  for (const chainOf of [south, corner, east]) chainOf.forEach((p, k) => {
    const TOP = STAND.base + p.tiers * STD.tierH, back = p.depth;
    const plane = (lx0, lx1, lz, y0, y1, mat, u = [0, Math.max(1, Math.round(p.len / 14))], v = [0, 1]) => {
      const [x0, z0] = p.world(lx0, lz), [x1, z1] = p.world(lx1, lz), g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute([x0, y0, z0, x1, y0, z1, x1, y1, z1, x0, y0, z0, x1, y1, z1, x0, y1, z0], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([u[0], v[0], u[1], v[0], u[1], v[1], u[0], v[0], u[1], v[1], u[0], v[1]], 2)); g.computeVertexNormals(); put(mat, g);
    };
    plane(-p.len / 2, p.len / 2, back + 0.05, 0, TOP, tmoWall);
    // (its number high on the back, the tunnel in, lit, under it)
    num++; const cell = (num - 1) % 16, cu = (cell % 8) / 8, cv = 1 - Math.floor(cell / 8) / 2;
    plane(-p.len / 2 + 1.5, -p.len / 2 + 5.5, back + 0.12, TOP - 4.2, TOP - 1.2, numbers, [cu, cu + 1 / 8], [cv - 0.5, cv]);
    plane(-2.2, 2.2, back + 0.12, 0, 3.2, tunnel, [0, 1], [0, 1]);
    const ends = [];
    if (k === 0 || Math.hypot(...((a, b) => [a[0] - b[0], a[1] - b[1]])(chainOf[k - 1].world(chainOf[k - 1].len / 2, 0), p.world(-p.len / 2, 0))) > 3) ends.push(-1);
    if (k === chainOf.length - 1 || Math.hypot(...((a, b) => [a[0] - b[0], a[1] - b[1]])(chainOf[k + 1].world(-chainOf[k + 1].len / 2, 0), p.world(p.len / 2, 0))) > 3) ends.push(1);
    for (const e of ends) {
      const lx = e * (p.len / 2 + 0.02), [x0, z0] = p.world(lx, 0), [x1, z1] = p.world(lx, back + 0.05), g = new THREE.BufferGeometry(), r = back / 14;
      g.setAttribute('position', new THREE.Float32BufferAttribute([x0, 0, z0, x1, 0, z1, x1, TOP, z1, x0, 0, z0, x1, TOP, z1, x0, STAND.base, z0], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, r, 0, r, 1, 0, 0, r, 1, 0, STAND.base / TOP], 2)); g.computeVertexNormals(); put(tmoWall, g);
    }
    const [lx, lz] = p.world(0, back - 0.4), q = tr.nearest(lx, lz), aim = tr.sample(q.s, 0, f);
    lights.push({ x: lx, y: TOP + 3, z: lz, tx: aim.x, tz: aim.z }); put(flood, boxAt(lx, TOP + 3, lz, p.ex, 1.4, 0.35, 0.6));
    { const [x, z] = p.world(0, back - 0.3); put(white, boxAt(x, (TOP + 3) / 2, z, p.ex, 0.25, TOP + 3, 0.25)); }
    stands.push(p);
  });
  // the T-Mobile cube: lit magenta, the T on each face, on its lattice mast over the chicane stand
  if (east.length) {
    const p = east[Math.min(east.length - 1, east.length >> 1)], [x, z] = p.world(-p.len / 2 + 2, p.depth + 4);
    if (okAt(x, z)) { mast(x, z, 24, p.ex); const g = new THREE.BoxGeometry(7, 7, 7); g.rotateY(Math.atan2(-p.ex[1], p.ex[0])); g.translate(x, 28, z); put(cube, g); solids.push({ ring: [[x - 1, z - 1], [x + 1, z - 1], [x + 1, z + 1], [x - 1, z + 1]], h: 31 }); made.push('the T-Mobile cube'); }
  }

  // =============================================================================================================
  // the fan zone inside the loop, between the track and the Sphere: marquees, the stage, container bars, light towers
  // =============================================================================================================
  {
    const sp = tr.nearest(-17, -1331);   // (the Sphere: world/Landmarks.js, from its footprint)
    const SPH = [-17, -1331], R = 96;
    const free = (x, z, r = 4) => { for (const [dx, dz] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) { const px = x + dx, pz = z + dz; if (Math.hypot(px - SPH[0], pz - SPH[1]) < R || !okAt(px, pz, 4)) return false; } return true; };
    let nT = 0, nC = 0;
    // (marquees in rows: the white peaked tents, 10 m square)
    for (let x = -70; x <= 90; x += 15) for (let z = -1160; z >= -1245; z -= 15) {
      if (!free(x, z, 7)) continue; const h = 3;
      if (Math.round((x + 70) / 15 - (z + 1160) / 15) % 3 === 2) {   // (every third a bar: two magenta containers, a canopy)
        for (const dz of [-1.5, 1.5]) put(container, boxAt(x, 1.3, z + dz, [1, 0], 6.1, 2.6, 2.4)); nC++; continue;
      }
      put(tent, boxAt(x, h / 2, z, [1, 0], 10, h, 10));
      const roof = new THREE.ConeGeometry(7.07, 3, 4, 1); roof.rotateY(Math.PI / 4); roof.translate(x, h + 1.5, z); put(tent, roof); nT++;
      solids.push({ ring: [[x - 5, z - 5], [x + 5, z - 5], [x + 5, z + 5], [x - 5, z + 5]], h: 6 });
    }
    // (the stage: on the Sphere's side of the zone, facing the track, its screen and lighting truss)
    { const x = 40, z = -1255; if (free(x, z, 3)) {
      put(black, boxAt(x, 0.8, z, [1, 0], 22, 1.6, 10)); put(screen, (() => { const g = new THREE.PlaneGeometry(16, 9); g.translate(x, 7.2, z - 4.6); return g; })());
      for (const dx of [-11, 11]) mast(x + dx, z - 3, 13, [1, 0]); beam([x - 11, z - 3], [x + 11, z - 3], 13);
      for (const dx of [-7, 0, 7]) { put(flood, boxAt(x + dx, 12.2, z - 3, [1, 0], 1.2, 0.4, 0.6)); lights.push({ x: x + dx, y: 12.2, z: z - 3, tx: x + dx, tz: z + 25 }); }
      solids.push({ ring: [[x - 11, z - 5], [x + 11, z - 5], [x + 11, z + 5], [x - 11, z + 5]], h: 14 }); made.push('the stage');
    } }
    // (light towers over the zone)
    for (const [x, z] of [[-55, -1175], [20, -1170], [85, -1200], [80, -1280]]) if (free(x, z, 1.5)) { mast(x, z, 16); put(flood, boxAt(x, 16.4, z, [1, 0], 2.0, 0.5, 1.0)); lights.push({ x, y: 16.4, z, tx: x, tz: z - 20 }); }
    made.push(`fan zone ${nT} marquees, ${nC} container bars (the Sphere at s ${sp.s.toFixed(0)})`);
  }
  // (the boxes the city's infill and the auto-placed stands keep out of: the loop's inside and the strips outside it)
  const bx = (x0, z0, x1, z1) => { const b = new THREE.Box3(new THREE.Vector3(x0, 0, z0), new THREE.Vector3(x1, 40, z1)); boxes.push(b); };
  bx(-215, -1480, 125, -1140); bx(125, -1520, 260, -1100); bx(-215, -1140, 140, -1060);
  // (lamps along both walls round the loop, every 30 m)
  for (let s = c5 + 20; s <= c10 - 20; s += 30) for (const sd of [1, -1]) { const i = tr.idxAtS(s), p = tr.sample(s, sd * (tr.wallAt(i, sd) + 0.5), f), aim = tr.sample(s, 0, f2); lights.push({ x: p.x, y: 12, z: p.z, tx: aim.x, tz: aim.z }); }

  // ---- one mesh per material
  for (const [mat, gs] of geos) {
    const clean = gs.map((g) => { const h = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(h.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') h.deleteAttribute(k); if (!h.attributes.uv) h.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(h.attributes.position.count * 2), 2)); if (!h.attributes.normal) h.computeVertexNormals(); return h; });
    const mesh = new THREE.Mesh(mergeGeometries(clean), mat); mesh.name = 'sz'; group.add(mesh);
  }
  console.info(`[vegas] Sphere zone: ${made.join(', ')}, ${lights.length} lamps`);
  return { group, stands, lights, boxes, solids };
}
