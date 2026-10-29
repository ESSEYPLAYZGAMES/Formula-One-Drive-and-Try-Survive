// Austin: around the Circuit of the Americas, what the survey does not carry. The circuit sits in rolling ranch land
// south-east of the city: the hill up to Turn 1 (the line is 27 m below its top), the Esses running down from it, the
// long back straight out to the Turn 11 hairpin, the "stadium" section of Turns 12-15 round the Grand Plaza, and the
// Observation Tower over the plaza's amphitheatre - 77 m of white steel and glass, lit like a rainbow at night, with
// its veil of red steel cables falling from the top over the stage's canopy. A Texas flag the size of a tennis court
// on its pole by the Turn 15 stands; the grandstands by their real places; the white hospitality marquees; the car
// parks in the fields; the live oaks, cedar elms and mesquite of the Texas prairie; and the stars on the blue of the
// Turn 1 run-off (its red and white stripes: tracks.js runoffPaint). Built flat like the rest of the world and raised
// onto the ground's height with it (world/Terrain.js elevateWorld).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { corridorSigned, ribbon } from '../track/TrackBuilder.js';
import { footprintInfo } from '../core/GeoLoader.js';
import { makeWindowMaterial } from './Buildings.js';
import { TERRAIN } from './Terrain.js';
import { fanMaterial, fanMesh } from './FanCutouts.js';

// ---- grandstands, by their real places: on a side of the track at a corner (side +1 left / -1 right of the racing
//      direction), or from the survey (named outlines)
const STANDS = [
  { name: 'Main Grandstand', s: -40, side: -1, len: 300, tiers: 27, style: { roof: 'membrane', frame: 'red', levels: 3 } },              // the main straight, facing the pits
  { name: 'Turn 1 Grandstand', turn: 1, along: -70, side: -1, len: 170, tiers: 22, style: { roof: 'none', art: 'stars' } }, // up the hill, on the outside
  { name: 'Turn 1 Hill', turn: 2, along: -40, side: -1, len: 90, tiers: 12, style: { roof: 'none' } },
  { name: 'Esses Bleachers', turn: 4, along: 0, side: -1, len: 110, tiers: 12, style: { roof: 'none' } },
  { name: 'Turn 6 Bleachers', turn: 6, along: -30, side: 1, len: 80, tiers: 10, style: { roof: 'none' } },
  { name: 'Turn 9 Grandstand', turn: 9, along: -20, side: -1, len: 90, tiers: 12 },
  { name: 'Turn 11 Bleachers', turn: 11, along: -90, side: -1, len: 80, tiers: 10, style: { roof: 'none' } },
  { name: 'Turn 12 Grandstand', turn: 12, along: -110, side: -1, len: 150, tiers: 18, style: { roof: 'none', art: 'stars' } },
  { name: 'Turn 15 Grandstands', outline: 'Turn 15 Grandstands', len: 120, tiers: 18, style: { roof: 'none' } },
  { name: 'Turn 19 Grandstand', turn: 19, along: 0, side: -1, len: 100, tiers: 14, style: { roof: 'canopy' } },
];

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);
const vcolor = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let k = 0; k < n; k++) { a[k * 3] = c.r; a[k * 3 + 1] = c.g; a[k * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
const keepPN = (g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };

// ---- value noise: the land's patchwork (the scrub, the car parks, the dry ground)
const hash2 = (i, j, s) => { const h = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
const vnoise = (x, z, s = 0) => { const i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j, u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz), a = hash2(i, j, s), b = hash2(i + 1, j, s), c = hash2(i, j + 1, s), d = hash2(i + 1, j + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
const fbm = (x, z, s = 0) => 0.5 * vnoise(x, z, s) + 0.3 * vnoise(x * 2.07, z * 2.07, s + 1) + 0.2 * vnoise(x * 4.3, z * 4.3, s + 2);

/**
 * The general-admission areas all round the lap: both sides of the road everywhere but along the pit lane, in pieces of
 * 120-200 m, each its own depth (8-24 m of crowd behind the fence), its low viewing mound and how packed it is. main.js
 * hands them to the track (TrackBuilder guardZones: a barrier and a catch fence in front of every one) before the
 * barriers are drawn; buildAustin lays the crowd on them.
 */
export function austinCrowdZones(tr, def, pit) {
  const zones = [], L = tr.length, inR = (s, a, b) => (a <= b ? s >= a && s <= b : s >= a || s <= b);
  const pr = pit ? [tr.wrapS(pit.entryS - 80), tr.wrapS(pit.exitS + 60)] : null;
  for (const side of [1, -1]) {
    for (let s = 0; s < L - 40;) {
      const len = 120 + vnoise(s / 97, side, 5) * 80, s1 = Math.min(L, s + len), mid = (s + s1) / 2;
      const blocked = pr && side === pit.sideSign && (inR(s, ...pr) || inR(s1, ...pr) || inR(mid, ...pr));
      if (!blocked && vnoise(s / 140, side * 3, 7) > 0.1) zones.push({ s0: s, s1: s1 - 6, side, depth: 8 + vnoise(s / 210, side, 9) * 16, rise: 0.5 + vnoise(s / 180, side, 11) * 1.1, fill: 0.55 + vnoise(s / 160, side, 13) * 0.25 });
      s = s1;
    }
  }
  return zones;
}

/** the dry Texas grass of the banks and the lawn: a speckled canvas, tiled in world space (one, shared) */
let GRASS = null;
function grassTex() {
  if (GRASS) return GRASS;
  const c = document.createElement('canvas'); c.width = c.height = 128; const g2 = c.getContext('2d'), r2 = rng(77);
  g2.fillStyle = '#8c9450'; g2.fillRect(0, 0, 128, 128);
  for (let k = 0; k < 2600; k++) { const t2 = r2(); g2.fillStyle = t2 < 0.45 ? '#7a8a40' : t2 < 0.8 ? '#a19a5c' : '#6b7a3a'; g2.fillRect(r2() * 128, r2() * 128, 1 + r2() * 2, 1 + r2() * 2); }
  GRASS = new THREE.CanvasTexture(c); GRASS.wrapS = GRASS.wrapT = THREE.RepeatWrapping; GRASS.colorSpace = THREE.SRGBColorSpace; return GRASS;
}

/** the picnic blankets: red gingham, a blue tartan, a green check, a striped towel (four 128 px tiles) */
function mattAtlas() {
  const S = 128, c = document.createElement('canvas'); c.width = S * 4; c.height = S; const x = c.getContext('2d');
  const check = (o, a, b, n) => { x.fillStyle = a; x.fillRect(o, 0, S, S); x.fillStyle = b; for (let i = 0; i < n; i++) { x.globalAlpha = 0.55; x.fillRect(o + i * S / n, 0, S / n / 2, S); x.fillRect(o, i * S / n, S, S / n / 2); } x.globalAlpha = 1; };
  check(0, '#f2efe8', '#b3262f', 8); check(S, '#1d3557', '#3d6fa8', 6); x.fillStyle = 'rgba(240,210,90,0.5)'; for (let i = 0; i < 6; i++) { x.fillRect(S + i * S / 6 + 9, 0, 2, S); x.fillRect(S, i * S / 6 + 9, S, 2); }
  check(S * 2, '#e9eadf', '#4d7a3e', 7);
  ['#e94e3c', '#f4f1ea', '#2f7fb8', '#f2c14e', '#f4f1ea'].forEach((col, i) => { x.fillStyle = col; x.fillRect(S * 3, i * S / 5, S, S / 5 + 1); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildAustin(geo, track, def, pit) {
  const tr = track, group = new THREE.Group(); group.name = 'austin';
  const claimed = new Set(), rnd = rng(20261019);
  const cornerS = (n) => def.corners.find((c) => c.n === n)?.s;
  const solid = [];   // [x, z, r]: what the trees, the tents and the car parks keep clear of
  const free = (x, z, pad = 0) => corridorSigned(tr, pit, x, z, 8 + pad) > 0 && !solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2);
  const byName = (re) => geo.buildings.find((b) => re.test(b.name || ''));
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f3f5, roughness: 0.45, metalness: 0.2, emissive: 0x18191c });
  const steel = new THREE.MeshStandardMaterial({ color: 0xdfe3e8, roughness: 0.3, metalness: 0.75, emissive: 0x15171a });
  const glass = new THREE.MeshStandardMaterial({ color: 0x24384a, roughness: 0.08, metalness: 0.8, envMapIntensity: 1.5, emissive: 0x2a3644, emissiveIntensity: 0.6 });

  // ---- the Observation Tower over the amphitheatre (the survey's outline: 'Germania Insurance Amphiteater', the stage),
  //      inside the loop of Turns 16-18: twenty storeys of cream-white steel round the stairs (419 steps), the deck at
  //      69 m cantilevered out over one side, and the veil - red steel pipes arching over the deck's roof, falling down
  //      the tower's other face and sweeping out over the amphitheatre's stage as its canopy. The amphitheatre: its
  //      bowl of red seats fanning out from the stage, the lawn above them, and beyond, the Grand Plaza toward the
  //      Turn 15 stands and its reflecting pool at the far end
  const amph = byName(/amphi/i), t15 = byName(/turn 15 grand/i);
  let towerAt = null; const amphi = { C: 36, seats: [], lawn: [] };   // (seat and lawn spots in the tower's frame: [u, v, y])
  if (amph) {
    claimed.add(amph.id);
    const info = footprintInfo(amph.rings[0]);
    // (the plaza's way: from the stage toward the Turn 15 stands; the tower stands behind the stage, the other way)
    let ax = 1, az = 0;
    if (t15) { const i2 = footprintInfo(t15.rings[0]); ax = i2.c[0] - info.c[0]; az = i2.c[1] - info.c[1]; } else { const q = tr.nearest(info.c[0], info.c[1]), f = tr.sample(q.s, 0); ax = info.c[0] - f.x; az = info.c[1] - f.z; }
    const al = Math.hypot(ax, az) || 1; ax /= al; az /= al;
    const tx = info.c[0] - ax * 26, tz = info.c[1] - az * 26; towerAt = [tx, tz];
    const yaw = Math.atan2(-az, ax);   // (local +x: from the tower over the stage to the plaza)
    // the tower itself: one rigid piece on the ground under its foot (not bent over the slope like the stands)
    const T = new THREE.Group(); T.name = 'scene:tower'; T.position.set(tx, TERRAIN.at(tx, tz), tz); T.rotation.y = yaw; T.userData.onTerrain = true;
    const FH = 3.45, NF = 20, SW = 9, SD = 11, TOP = NF * FH;   // (the deck's floor at 69 m)
    // the shaft's faces: per storey a stair flight climbing across the left half (the next one back the other way), the
    // landing's two dark openings on the right, the floor plate's bright edge and its shadow line under it
    const fc = document.createElement('canvas'); fc.width = 128; fc.height = 256; const fx = fc.getContext('2d');
    for (let k = 0; k < 2; k++) {
      const y0 = k * 128;
      fx.fillStyle = '#e9e2d2'; fx.fillRect(0, y0, 128, 128);
      fx.fillStyle = '#d9d1c0'; fx.fillRect(66, y0, 2, 128);
      fx.fillStyle = '#30353c'; fx.fillRect(72, y0 + 30, 20, 66); fx.fillRect(98, y0 + 30, 20, 66);
      fx.fillStyle = '#f8f6f1'; fx.fillRect(70, y0 + 26, 50, 4); fx.fillRect(82, y0 + 30, 2, 66); fx.fillRect(108, y0 + 30, 2, 66);
      fx.fillStyle = '#cfc6b3'; fx.beginPath(); const X = (x) => (k ? 64 - x : x);
      fx.moveTo(X(4), y0 + 106); fx.lineTo(X(16), y0 + 106); fx.lineTo(X(62), y0 + 22); fx.lineTo(X(50), y0 + 22); fx.closePath(); fx.fill();
      fx.fillStyle = '#b8b09f'; fx.fillRect(0, y0 + 104, 128, 4); fx.fillStyle = '#fbfaf6'; fx.fillRect(0, y0 + 108, 128, 20);
    }
    const faceTex = new THREE.CanvasTexture(fc); faceTex.colorSpace = THREE.SRGBColorSpace; faceTex.wrapS = faceTex.wrapT = THREE.RepeatWrapping; faceTex.repeat.set(1, NF / 2); faceTex.anisotropy = 4;
    // (by night lit floor by floor in the rainbow)
    const bands = document.createElement('canvas'); bands.width = 16; bands.height = 512; const bx = bands.getContext('2d');
    for (let k = 0; k < NF; k++) { bx.fillStyle = `hsl(${(k * 360 / 11) % 360}, 90%, 58%)`; bx.fillRect(0, 512 - (k + 1) * 512 / NF, 16, 512 / NF - 4); }
    const bandTex = new THREE.CanvasTexture(bands); bandTex.colorSpace = THREE.SRGBColorSpace;
    const shaftMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.55, metalness: 0.1, emissive: 0xffffff, emissiveMap: bandTex, emissiveIntensity: 0 });
    shaftMat.userData.towerGlow = true;
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(SW, TOP, SD), shaftMat); shaft.position.y = TOP / 2; T.add(shaft);
    const frame = [], box = (w, h, d, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); frame.push(keepPN(g)); };
    box(SW + 0.6, 3, SD + 0.6, 0, -1, 0);                                                   // (the foot: into the ground on a slope)
    for (let k = 1; k < NF; k++) box(SW + 0.5, 0.3, SD + 0.5, 0, k * FH, 0);                 // the floor plates' edges
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(0.75, TOP, 0.75, x * SW / 2, TOP / 2, z * SD / 2);
    // the deck: a rounded slab cantilevered out past the shaft (away from the veil's fall), a band of glass behind white
    // mullions, the roof over it
    const rr = (w, d, r) => { const s = new THREE.Shape(), x0 = -w / 2, z0 = -d / 2; s.moveTo(x0 + r, z0); s.lineTo(x0 + w - r, z0); s.quadraticCurveTo(x0 + w, z0, x0 + w, z0 + r); s.lineTo(x0 + w, z0 + d - r); s.quadraticCurveTo(x0 + w, z0 + d, x0 + w - r, z0 + d); s.lineTo(x0 + r, z0 + d); s.quadraticCurveTo(x0, z0 + d, x0, z0 + d - r); s.lineTo(x0, z0 + r); s.quadraticCurveTo(x0, z0, x0 + r, z0); return s; };
    const slab = (shape, y, h, dx) => { const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 6 }); g.rotateX(-Math.PI / 2); g.translate(dx, y, 0); return keepPN(g); };
    const DX = -2.5, deckS = rr(18, 15, 3.5);
    frame.push(slab(deckS, TOP, 0.9, DX), slab(deckS, TOP + 4.3, 0.7, DX), slab(rr(19, 16, 4), TOP + 5.0, 0.25, DX));
    for (const p of rr(17.6, 14.6, 3.3).getSpacedPoints(44)) box(0.16, 3.4, 0.16, p.x + DX, TOP + 2.6, -p.y);
    T.add(new THREE.Mesh(mergeGeometries(frame.map(nonIdx)), white));
    T.add(new THREE.Mesh(slab(rr(17.2, 14.2, 3.1), TOP + 0.9, 3.4, DX), glass));
    // the veil: twenty-two red steel pipes side by side (the outer two heavier) - from a tip past the deck's far edge,
    // arching over its roof (77 m), down the tower's face a few metres off it on white struts, and out over the stage
    const red = new THREE.MeshStandardMaterial({ color: 0xd3202b, roughness: 0.4, metalness: 0.4, emissive: 0x3a080b });
    const VX = SW / 2 + 6;
    const path = new THREE.CatmullRomCurve3([[-13, TOP + 5.6], [-10.5, TOP + 6.8], [-4, TOP + 8], [3, TOP + 8], [VX - 2.4, TOP + 7], [VX - 0.3, TOP + 4], [VX, TOP - 2], [VX, 45], [VX, 28], [VX + 0.4, 20], [VX + 2.2, 15.2], [VX + 7, 12.8], [VX + 15, 12.1], [VX + 25, 11.8], [VX + 33, 11.2]].map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
    const wAt = (q) => (q.x > VX + 0.5 && q.y < 30 ? 8 + Math.min(1, (q.x - VX - 0.5) / 26) * 18 : 8 + Math.min(1, Math.max(0, (q.y - TOP) / 4)) * 5);
    const lift = (q, u) => (q.x > VX + 3 ? Math.cos(u * Math.PI) * 1.2 * Math.min(1, (q.x - VX - 3) / 20) : q.y > TOP + 3 ? Math.cos(u * Math.PI) * 0.5 : 0);
    const pipes = [], NP = 22, PS = [];
    for (let k = 0; k <= 120; k++) PS.push(path.getPoint(k / 120));
    for (let j = 0; j < NP; j++) {
      const u = j / (NP - 1) - 0.5, pts = PS.map((q) => new THREE.Vector3(q.x, q.y + lift(q, u), u * wAt(q)));
      pipes.push(keepPN(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 150, j === 0 || j === NP - 1 ? 0.24 : 0.11, 6, false)));
    }
    const ties = [], struts = [], tb = (arr, w, h, d, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); arr.push(keepPN(g)); };
    for (let k = 6; k < NF; k++) { tb(ties, 0.16, 0.16, 8, VX, k * FH, 0); if (k % 2 === 0) for (const z of [-3.4, 3.4]) tb(struts, VX - SW / 2, 0.2, 0.2, (VX + SW / 2) / 2, k * FH, z); }
    T.add(new THREE.Mesh(mergeGeometries([...pipes, ...ties]), red));
    // under the veil's sweep, the stage's white fabric roof, on slim white columns
    const memb = [], MP = [], MI = []; let rows = 0;
    for (const q of PS) { if (q.x < VX + 2.5) continue; for (let c = 0; c <= 12; c++) { const u = c / 12 - 0.5; MP.push(q.x, q.y + lift(q, u) - 0.5, u * wAt(q) * 0.98); } rows++; }
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < 12; c++) { const a = r * 13 + c; MI.push(a, a + 13, a + 1, a + 1, a + 13, a + 14); }
    const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.Float32BufferAttribute(MP, 3)); mg.setIndex(MI); mg.computeVertexNormals(); memb.push(mg);
    T.add(new THREE.Mesh(mg, new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.75, side: THREE.DoubleSide, emissive: 0x1a1a1a })));
    for (const x of [VX + 12, VX + 26]) for (const z of [-1, 1]) { const w = 8 + Math.min(1, (x - VX - 0.5) / 26) * 18, g = new THREE.CylinderGeometry(0.22, 0.28, 14, 8); g.translate(x, 4.5, z * w * 0.44); struts.push(keepPN(g)); }
    T.add(new THREE.Mesh(mergeGeometries(struts), white));
    group.add(T);
    // the stage, the bowl, the lawn and the plaza: on the ground (raised with the world)
    const Pz = new THREE.Group(); Pz.name = 'scene:plaza'; Pz.position.set(tx, 0, tz); Pz.rotation.y = yaw;
    const dark = new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: 0.8 });
    const stage = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 26), dark); stage.position.set(26, 0.8, 0); Pz.add(stage);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1, 11, 28), dark); back.position.set(18, 5, 0); Pz.add(back);
    for (const z of [-1, 1]) { const st = new THREE.Mesh(new THREE.BoxGeometry(3, 9, 3), dark); st.position.set(31, 4.5, z * 15); Pz.add(st); }
    // the bowl: forty rows of red seats round the stage (a cross aisle half way up, six wedges between the stairs), on
    // stepped concrete; the lawn rising behind the top row, and the concrete walls closing its sides
    const C = amphi.C, A = (78 * Math.PI) / 180, R0 = 8, RD = 0.9, NR = 40, rise = 0.22, yR = (k) => 0.25 + k * rise, RT = R0 + NR * RD, YT = yR(NR - 1);
    const conc = { P: [] }, seat = { P: [], C: [] }, lawn = { P: [], U: [] };
    const quad = (o, a, b, c, d) => o.P.push(...a, ...b, ...c, ...a, ...c, ...d);
    const pt = (r, th, y) => [C + r * Math.cos(th), y, r * Math.sin(th)];
    const SEG = 48;
    for (let k = 0; k < NR; k++) {
      const r = R0 + k * RD, y = yR(k), yp = k ? yR(k - 1) : 0;
      for (let j = 0; j < SEG; j++) {
        const a0 = -A + (2 * A * j) / SEG, a1 = -A + (2 * A * (j + 1)) / SEG;
        quad(conc, pt(r, a0, y), pt(r, a1, y), pt(r + RD, a1, y), pt(r + RD, a0, y));       // the tread
        quad(conc, pt(r, a0, yp), pt(r, a1, yp), pt(r, a1, y), pt(r, a0, y));               // the riser
      }
      if (k === 18) continue;   // (the cross aisle)
      for (let w = 0; w < 6; w++) {
        const h = 0.75 / r, b0 = -A + (2 * A * w) / 6 + (w ? h : 0.02), b1 = -A + (2 * A * (w + 1)) / 6 - (w < 5 ? h : 0.02), n = Math.max(2, Math.round(((b1 - b0) * r) / 2));
        const tint = 0.85 + ((k * 7 + w * 3) % 5) * 0.04;
        for (let j = 0; j < n; j++) {
          const a0 = b0 + ((b1 - b0) * j) / n, a1 = b0 + ((b1 - b0) * (j + 1)) / n;
          quad(seat, pt(r + 0.12, a0, y + 0.42), pt(r + 0.12, a1, y + 0.42), pt(r + 0.52, a1, y + 0.42), pt(r + 0.52, a0, y + 0.42));
          quad(seat, pt(r + 0.12, a0, y), pt(r + 0.12, a1, y), pt(r + 0.12, a1, y + 0.42), pt(r + 0.12, a0, y + 0.42));
          quad(seat, pt(r + 0.52, a0, y + 0.42), pt(r + 0.52, a1, y + 0.42), pt(r + 0.62, a1, y + 0.9), pt(r + 0.62, a0, y + 0.9));   // (the backs)
          for (let q = 0; q < 18; q++) seat.C.push(0.62 * tint, 0.08 * tint, 0.12 * tint);
        }
        for (let a = b0 + 0.3 / r; a < b1; a += 0.56 / r) amphi.seats.push([C + (r + 0.35) * Math.cos(a), (r + 0.35) * Math.sin(a), y, a]);
      }
    }
    // the lawn: from the top row up a gentle slope, then down the bank behind to the ground
    const lawnY = (r) => (r < 66 ? YT + (r - RT) * 0.07 : Math.max(0, (YT + (66 - RT) * 0.07) * (1 - (r - 66) / 9)));
    const LR = []; for (let r = RT; r <= 75.01; r += 1.5) LR.push(r);
    for (let i = 0; i < LR.length - 1; i++) for (let j = 0; j < SEG; j++) {
      const a0 = -A + (2 * A * j) / SEG, a1 = -A + (2 * A * (j + 1)) / SEG, p = [pt(LR[i], a0, lawnY(LR[i])), pt(LR[i], a1, lawnY(LR[i])), pt(LR[i + 1], a1, lawnY(LR[i + 1])), pt(LR[i + 1], a0, lawnY(LR[i + 1]))];
      quad(lawn, ...p); for (const v of [p[0], p[1], p[2], p[0], p[2], p[3]]) lawn.U.push(v[0] / 9, v[2] / 9);
    }
    for (let r = RT + 1; r < 70; r += 1.1) for (let a = -A + 0.02; a < A; a += 1.0 / r) amphi.lawn.push([C + r * Math.cos(a), r * Math.sin(a), lawnY(r), a]);
    for (const s of [-1, 1]) {   // (its flanks: grass banks from the bowl's edge down to the ground, as steep as a lawn mows)
      const prof = []; for (let k = 0; k < NR; k++) prof.push([R0 + k * RD + RD / 2, yR(k)]); for (const r of LR) prof.push([r, lawnY(r)]);
      for (let i = 0; i < prof.length - 1; i++) {
        const [ra, ha] = prof[i], [rb, hb] = prof[i + 1], p = [pt(ra, s * A, ha), pt(rb, s * A, hb), pt(rb, s * (A + (hb * 2.6) / rb), -0.05), pt(ra, s * (A + (ha * 2.6) / ra), -0.05)];
        quad(lawn, ...p); for (const v of [p[0], p[1], p[2], p[0], p[2], p[3]]) lawn.U.push(v[0] / 9, v[2] / 9);
      }
    }
    const geoOf = (o, extra) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(o.P, 3)); if (extra) extra(g); g.computeVertexNormals(); return g; };
    Pz.add(new THREE.Mesh(geoOf(conc), new THREE.MeshStandardMaterial({ color: 0xc9c3b6, roughness: 0.9, side: THREE.DoubleSide })));
    Pz.add(new THREE.Mesh(geoOf(seat, (g) => g.setAttribute('color', new THREE.Float32BufferAttribute(seat.C, 3))), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide })));
    Pz.add(new THREE.Mesh(geoOf(lawn, (g) => g.setAttribute('uv', new THREE.Float32BufferAttribute(lawn.U, 2))), new THREE.MeshStandardMaterial({ map: grassTex(), color: 0xb8d090, roughness: 1, side: THREE.DoubleSide })));
    group.add(Pz);
    solid.push([tx, tz, 16]);
    const at = (u) => [tx + Math.cos(yaw) * u, tz - Math.sin(yaw) * u]; solid.push([...at(30), 22], [...at(C + 30), 50]);
  }

  // ---- the pit building: the garages below (world/PitLane.js), and over them the Paddock Club - three open terraces
  //      stacked up the front, people along every rail, glass behind them, the yellow banner along the first floor's
  //      edge, and over it all the white roof's deep overhang, the plant on top. Along the straight part of the lane
  //      (the lane's curve in from Turn 20 keeps just its garages); the red block at its Turn 20 end
  const paddockFans = [];
  if (pit) {
    const ps = pit.samples, gs = -pit.trackSide, hw = pit.halfWidth;
    const mid = pit.boxes[Math.floor(pit.boxes.length / 2)].i, h0 = Math.atan2(ps.tz[mid], ps.tx[mid]);
    const straight = (i) => { let d = Math.atan2(ps.tz[i], ps.tx[i]) - h0; d = Math.atan2(Math.sin(d), Math.cos(d)); return Math.abs(d) < 0.035; };
    let i0 = mid, i1 = mid; while (i0 > pit.wallStartI + 3 && straight(i0 - 1)) i0--; while (i1 < pit.wallEndI - 3 && straight(i1 + 1)) i1++;
    const inB = (i) => i >= i0 && i <= i1;
    const R = (a, b, y, o = {}) => ribbon(ps, () => gs * a, () => gs * b, y, { closed: false, mask: inB, uvV: 4, ...o });
    const D = hw + 1.2, BK = D + 23;   // (the garages' front; the building's back)
    const LV = [[5.4, 6.0, D - 1.1, D + 3.2], [9.6, 10.2, D - 1.3, D + 3.8], [13.8, 14.4, D - 1.5, D + 4.4]];   // [slab bottom, top, front edge, glass line]
    const slabs = [], fasc = [], glassW = [], rails = [], roof = [], yellow = [];
    LV.forEach(([y0, y1, f, g], k) => {
      slabs.push(R(f, BK, y1), R(f, BK, y0));                          // (the floor, its soffit)
      (k ? fasc : yellow).push(R(f, f, y0, { yB: y1 + (k ? 0 : 0.25), uvFn: k ? null : (i) => -ps.s[i] / 18 }));
      glassW.push(R(g, g, y1, { yB: k < 2 ? LV[k + 1][0] : 18.2 }));
      rails.push(R(f + 0.12, f + 0.12, y1, { yB: y1 + 1.05 }));
      for (let i = i0 + 2; i <= i1 - 2; i++) for (let r = 0; r < 3; r++) {
        if (((i * 7 + r * 13 + k * 5) % 10) > 6) continue;
        const d = f + 0.7 + r * 0.8 + ((i * 31 + r) % 7) * 0.05; if (d > g - 0.4) continue;
        paddockFans.push([ps.px[i] + ps.nx[i] * gs * d, y1, ps.pz[i] + ps.nz[i] * gs * d, Math.atan2(-gs * ps.nx[i], -gs * ps.nz[i]) + (((i * 17 + r) % 9) - 4) * 0.05]);
      }
    });
    roof.push(R(D - 4.2, BK + 0.6, 19.6), R(D - 4.2, BK + 0.6, 18.2), R(D - 4.2, D - 4.2, 18.2, { yB: 19.6 }), R(BK, BK, 0, { yB: 19.6 }));
    const clean = (gs2) => mergeGeometries(gs2.filter((g) => g.index?.count).map((g) => { for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k); if (!g.attributes.normal) g.computeVertexNormals(); return g; }));
    const wmat = new THREE.MeshStandardMaterial({ color: 0xf2f2ef, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x18181a });
    group.add(new THREE.Mesh(clean([...slabs, ...fasc, ...roof]), wmat));
    group.add(new THREE.Mesh(clean(glassW), new THREE.MeshStandardMaterial({ color: 0x25333f, roughness: 0.1, metalness: 0.8, emissive: 0x1d2a35, side: THREE.DoubleSide })));
    group.add(new THREE.Mesh(clean(rails), new THREE.MeshStandardMaterial({ color: 0x9fb8c8, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false })));
    {   // the yellow banner along the first floor's edge
      const c = document.createElement('canvas'); c.width = 64; c.height = 512; const x = c.getContext('2d');
      x.fillStyle = '#f5c400'; x.fillRect(0, 0, 64, 512); x.fillStyle = '#111'; x.fillRect(0, 0, 6, 512); x.fillRect(58, 0, 6, 512);
      x.save(); x.translate(32, 256); x.rotate(Math.PI / 2); x.font = '900 38px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PIRELLI  ·  P ZERO', 0, 2); x.restore();
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
      group.add(new THREE.Mesh(clean(yellow), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6, side: THREE.DoubleSide, emissive: 0x111111 })));
    }
    // the columns (every 16 m, at the terraces' front) and the plant on the roof
    const cols = [], plant = [], put = (arr, w, h, d, i, off, y, rot = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.rotateY(Math.atan2(ps.tx[i], ps.tz[i]) + rot); g.translate(ps.px[i] + ps.nx[i] * gs * off, y, ps.pz[i] + ps.nz[i] * gs * off); arr.push(keepPN(g)); };
    const step = Math.max(1, Math.round(16 / ps.ds));
    for (let i = i0 + 1; i <= i1; i += step) put(cols, 0.45, 13.2, 0.45, i, D - 0.6, 12.0);
    for (let i = i0 + 4; i <= i1 - 4; i += Math.max(1, Math.round(9 / ps.ds))) { const k = (i * 13) % 7; put(plant, 4 + k * 0.5, 2.2 + (k % 3) * 0.6, 3 + (k % 2) * 2, i, D + 9 + (k % 4) * 2.5, 19.6 + 1.1 + (k % 3) * 0.3); }
    group.add(new THREE.Mesh(mergeGeometries(cols), white));
    group.add(new THREE.Mesh(mergeGeometries(plant), new THREE.MeshStandardMaterial({ color: 0xc9cdd1, roughness: 0.6, metalness: 0.3 })));
    // the red block at the Turn 20 end, behind the garages: its name across the front
    {
      const e = Math.max(0, i0 - Math.round(30 / ps.ds)), i = e, ang = Math.atan2(ps.tx[i], ps.tz[i]), off = D + 6 + 9, len = 28;
      const B = new THREE.Group(); B.position.set(ps.px[i] + ps.nx[i] * gs * off, 0, ps.pz[i] + ps.nz[i] * gs * off); B.rotation.y = ang;
      const body = new THREE.Mesh(new THREE.BoxGeometry(18, 15, len), new THREE.MeshStandardMaterial({ color: 0xd2232e, roughness: 0.5 })); body.position.y = 6.5; B.add(body);
      const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#d2232e'; x.fillRect(0, 0, 512, 128); x.fillStyle = '#fff'; x.font = '900 78px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Lenovo', 256, 68);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      const front = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.8, len * 0.2), new THREE.MeshBasicMaterial({ map: t })); front.position.set(-gs * 9.05, 10.5, 0); front.rotation.y = -gs * Math.PI / 2; B.add(front);
      group.add(B); solid.push([B.position.x, B.position.z, 18]);
    }
    // the paddock behind it: paved, the teams' three-storey motorhomes in a row (glass, white, each in its colours), their
    // trucks parked up behind, and the broadcast compound's white trucks and dishes at the far side
    {
      const PD = BK + 96, pave = R(BK + 0.6, PD, 0.045);
      if (pave.index?.count) { for (const k of Object.keys(pave.attributes)) if (k !== 'position' && k !== 'normal') pave.deleteAttribute(k); group.add(new THREE.Mesh(pave, new THREE.MeshStandardMaterial({ color: 0xa9a8a3, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide }))); }
      const TEAMC = [0xe8002d, 0x1e41ff, 0x27f4d2, 0xff8000, 0x229971, 0x0093cc, 0x64c4ff, 0xb6babd, 0x52e252, 0x6692ff];
      const parts = [], box2 = (w, h, d, i, off, y, hex, along = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(0, y, along); g.rotateY(Math.atan2(ps.tx[i], ps.tz[i])); g.translate(ps.px[i] + ps.nx[i] * gs * off, 0, ps.pz[i] + ps.nz[i] * gs * off); parts.push(vcolor(keepPN(nonIdx(g)), hex)); };
      const N = TEAMC.length, span = i1 - i0;
      for (let k = 0; k < N; k++) {
        const i = Math.round(i0 + (k + 0.5) * span / N), tc = TEAMC[k];
        box2(12, 9.6, 20, i, BK + 17, 4.8, 0x2a3540);                     // (the glass box)
        box2(12.6, 0.6, 20.6, i, BK + 17, 3.3, 0xf4f4f2); box2(12.6, 0.6, 20.6, i, BK + 17, 6.5, 0xf4f4f2); box2(13, 1.3, 21, i, BK + 17, 9.9, tc);
        box2(11, 1.0, 19, i, BK + 17, 0.5, 0xf4f4f2);
        for (const o of [-1, 1]) { box2(2.6, 4.0, 16.5, i, BK + 40 + o * 3.6, 2.35, tc, 1.5); box2(2.5, 3.2, 2.6, i, BK + 40 + o * 3.6, 1.9, 0xf2f2f2, -8.6); }   // (the trucks: trailer, cab)
      }
      for (let k = 0; k < 14; k++) {
        const i = Math.round(i0 + (k + 0.5) * span / 14), off = BK + 66 + (k % 2) * 12;
        box2(2.5, 3.8, 13, i, off, 2.2, k % 3 ? 0xf2f2f2 : 0xd9dde2);
        const dish = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 14); dish.rotateX(1.0); dish.translate(0, 5.2, -3); dish.rotateY(Math.atan2(ps.tx[i], ps.tz[i])); dish.translate(ps.px[i] + ps.nx[i] * gs * off, 0, ps.pz[i] + ps.nz[i] * gs * off); parts.push(vcolor(keepPN(nonIdx(dish)), 0xeeeeee));
      }
      const m = new THREE.Mesh(mergeGeometries(parts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.2 })); m.name = 'austin:paddock'; group.add(m);
      for (let i = i0; i <= i1; i += Math.max(1, Math.round(30 / ps.ds))) solid.push([ps.px[i] + ps.nx[i] * gs * (BK + 48), ps.pz[i] + ps.nz[i] * gs * (BK + 48), 52]);
    }
  }

  // ---- the start gantry over the line: the MSC banner across the track on its black frame, the five lights over it
  {
    const s = 3, i = tr.idxAtS(s), f = tr.sample(s, 0), wl = tr.wallAt(i, 1) + 0.6, wr = tr.wallAt(i, -1) + 0.6, span = wl + wr;
    const G = new THREE.Group(); G.name = 'scene:gantry'; G.position.set(f.x + f.nx * (wl - wr) / 2, TERRAIN.at(f.x, f.z), f.z + f.nz * (wl - wr) / 2); G.rotation.y = Math.atan2(-f.nz, f.nx); G.userData.onTerrain = true;
    const blk = new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: 0.6, metalness: 0.4 }), g = [], b = (w, h, d, x, y, z) => { const q = new THREE.BoxGeometry(w, h, d); q.translate(x, y, z); g.push(keepPN(q)); };
    for (const x of [-span / 2, span / 2]) b(0.9, 9.5, 0.9, x, 4.75, 0);
    b(span + 0.9, 2.4, 0.8, 0, 7.9, 0); b(3.6, 1.5, 0.7, 0, 9.85, 0);
    G.add(new THREE.Mesh(mergeGeometries(g), blk));
    const c = document.createElement('canvas'); c.width = 1024; c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#0b1830'; x.fillRect(0, 0, 1024, 128);
    for (let k = 0; k < 4; k++) { const cx = 128 + k * 256; x.strokeStyle = '#d9dde4'; x.lineWidth = 5; x.beginPath(); x.arc(cx - 66, 64, 26, 0, Math.PI * 2); x.stroke(); x.fillStyle = '#ffffff'; x.font = '900 54px Arial'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('MSC', cx - 30, 58); x.font = '700 15px Arial'; x.fillText('CRUISES', cx - 26, 96); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    for (const z of [-0.42, 0.42]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(span, 2.2), new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.25, roughness: 0.5 })); p.position.set(0, 7.9, z); if (z < 0) p.rotation.y = Math.PI; G.add(p); }
    const lamp = new THREE.MeshStandardMaterial({ color: 0x3a0a0a, emissive: 0x2a0000, roughness: 0.3 });
    for (let k = 0; k < 5; k++) for (const z of [-0.36, 0.36]) { const l = new THREE.Mesh(new THREE.CircleGeometry(0.22, 12), lamp); l.position.set(-1.4 + k * 0.7, 9.85, z); if (z < 0) l.rotation.y = Math.PI; G.add(l); }
    group.add(G);
  }

  // ---- the paint on the run-offs: the Texas flag, the size of a football pitch, straight on past Turn 12 where the back
  //      straight's braking ends; red stars down the outside of the stadium's long right (Turns 16-18) and Turn 19
  {
    const hw = tr.halfWidth, kw = tr.kerbWidth, q0 = {};
    const onRunoff = (x, z, pad = 0.8) => { const q = tr.nearest(x, z, -1, q0), side = q.d > 0 ? 1 : -1, a = Math.abs(q.d); return a > tr.hw[q.i] + kw + pad && a < tr.wallAt(q.i, side) - pad && (side > 0 ? tr.surfL[q.i] : tr.surfR[q.i]) === 1; };
    const paintMat = (opts) => new THREE.MeshStandardMaterial({ roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, ...opts });
    const s12 = cornerS(12);
    if (s12 != null) {
      // (laid where the run-off is widest round the corner's outside: the spot, along the kerb, that holds most of it)
      const W = 40, H = 24, CELL = 1.6, nu = Math.round(W / CELL), nv = Math.round(H / CELL), i12 = tr.idxAtS(s12), side = tr.wallAt(i12, 1) > tr.wallAt(i12, -1) ? 1 : -1;
      let fa = null, cx = 0, cz = 0, best = -1;
      const wpOf = (f, x0, z0) => (u, v) => [x0 + f.tx * (u - 0.5) * W + f.nx * (v - 0.5) * H, z0 + f.tz * (u - 0.5) * W + f.nz * (v - 0.5) * H];
      for (let ds = -70; ds <= 70; ds += 10) for (let dd = 0; dd <= 24; dd += 4) {
        const f = tr.sample(s12 + ds, side * (tr.hw[tr.idxAtS(s12 + ds)] + kw + 2 + H / 2 + dd)), wp = wpOf(f, f.x, f.z); let n = 0;
        for (let a2 = 0; a2 < nu; a2 += 2) for (let b2 = 0; b2 < nv; b2 += 2) { const m = wp((a2 + 0.5) / nu, (b2 + 0.5) / nv); if (onRunoff(m[0], m[1], 1.2)) n++; }
        if (n > best) { best = n; fa = f; cx = f.x; cz = f.z; }
      }
      const c = document.createElement('canvas'); c.width = 768; c.height = 480; const x = c.getContext('2d');
      x.fillStyle = '#eceae4'; x.fillRect(256, 0, 512, 240); x.fillStyle = '#b3242f'; x.fillRect(256, 240, 512, 240); x.fillStyle = '#163a78'; x.fillRect(0, 0, 256, 480);
      x.fillStyle = '#eceae4'; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 34 : 86; (k ? x.lineTo : x.moveTo).call(x, 128 + Math.cos(a) * r, 240 + Math.sin(a) * r); } x.closePath(); x.fill();
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const P = [], U = [], wp = wpOf(fa, cx, cz);
      for (let a = 0; a < nu; a++) for (let b2 = 0; b2 < nv; b2++) {
        const u0 = a / nu, u1 = (a + 1) / nu, v0 = b2 / nv, v1 = (b2 + 1) / nv, m = wp((u0 + u1) / 2, (v0 + v1) / 2);
        if (!onRunoff(m[0], m[1], 1.2)) continue;
        const C4 = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
        for (const k of [0, 2, 1, 0, 3, 2]) { const [u, v] = C4[k], p = wp(u, v); P.push(p[0], 0.03, p[1]); U.push(1 - u, v); }
      }
      if (P.length) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.computeVertexNormals(); group.add(new THREE.Mesh(g, paintMat({ map: tex, side: THREE.DoubleSide }))); }
      console.info(`[austin] the Turn 12 flag: ${P.length / 18} of ${nu * nv} cells on the run-off`);
    }
    const shape = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 0.4 : 1; (k ? shape.lineTo : shape.moveTo).call(shape, Math.cos(a) * r, Math.sin(a) * r); }
    const base = new THREE.ShapeGeometry(shape); base.rotateX(-Math.PI / 2);
    const stars = [];
    for (const [t0, a0, t1, a1, side, size, gap] of [[16, -20, 18, 40, 1, 2.6, 13], [19, -60, 19, 50, -1, 2.4, 12], [20, -30, 20, 30, -1, 2.2, 11]]) {
      const sA = cornerS(t0), sB = cornerS(t1); if (sA == null || sB == null) continue;
      for (let s = sA + a0; s <= sB + a1; s += gap) {
        const i = tr.idxAtS(s), wall = tr.wallAt(i, side), hw = tr.hw[i]; if (wall < hw + kw + size * 2 + 3) continue;
        const d = Math.min(wall - size - 1.5, hw + kw + 2 + size + 3.4), f = tr.sample(s, side * d);
        if (!onRunoff(f.x, f.z, size)) continue;
        const g = base.clone(); g.scale(size, 1, size); g.rotateY(Math.atan2(f.tx, f.tz)); g.translate(f.x, 0.035, f.z); stars.push(keepPN(g));
      }
    }
    if (stars.length) group.add(new THREE.Mesh(mergeGeometries(stars), paintMat({ color: 0xc0202e })));
  }

  // ---- the Tecovas hat: the giant cowboy hat on the plaza (crown 5 m, brim 18 m across on four black posts, the
  //      boot-maker's name on its front) where the fans shelter out of the sun
  if (towerAt) {
    const Pz = group.getObjectByName('scene:plaza'), yaw = Pz.rotation.y, cy = Math.cos(yaw), sy = Math.sin(yaw);
    const L = (u, v) => [towerAt[0] + cy * u + sy * v, towerAt[1] - sy * u + cy * v];
    const spot = [[112, -58], [112, 58], [-34, 44], [-34, -44], [130, -48]].map(([u, v]) => L(u, v)).find(([x, z]) => corridorSigned(tr, pit, x, z, 14) > 0 && free(x, z, 10));
    if (spot) {
      const [hx, hz] = spot, q = tr.nearest(hx, hz), f = tr.sample(q.s, 0);
      const H = new THREE.Group(); H.name = 'scene:hat'; H.position.set(hx, TERRAIN.at(hx, hz), hz); H.rotation.y = Math.atan2(f.x - hx, f.z - hz); H.userData.onTerrain = true;
      const felt = new THREE.MeshStandardMaterial({ color: 0xe3d2aa, roughness: 0.85, side: THREE.DoubleSide });
      const BY = 4.4, OZ = 0.84;
      const crown = new THREE.LatheGeometry([[0.01, BY + 4.6], [1.6, BY + 5.0], [3.0, BY + 5.15], [3.75, BY + 4.7], [4.0, BY + 3.6], [4.12, BY + 1.8], [4.22, BY + 0.05]].map(([r, y]) => new THREE.Vector2(r, y)), 32); crown.scale(1, 1, OZ);
      const brimP = [[4.15, BY + 0.02], [5.5, BY - 0.08], [7.2, BY - 0.02], [8.6, BY + 0.2], [9.2, BY + 0.45]].map(([r, y]) => new THREE.Vector2(r, y)), brim = new THREE.LatheGeometry(brimP, 48);
      const bp = brim.attributes.position; for (let k = 0; k < bp.count; k++) { const X = bp.getX(k), Z = bp.getZ(k), r = Math.hypot(X, Z), e = Math.max(0, (r - 4.2) / 5); bp.setY(k, bp.getY(k) + 2.2 * (X / r) ** 2 * e * e); bp.setZ(k, Z * 0.9); } brim.computeVertexNormals();
      H.add(new THREE.Mesh(crown, felt), new THREE.Mesh(brim, felt));
      const band = new THREE.Mesh(new THREE.CylinderGeometry(4.24, 4.26, 0.7, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.7 })); band.scale.z = OZ; band.position.y = BY + 0.4; H.add(band);
      const c = document.createElement('canvas'); c.width = 512; c.height = 96; const x = c.getContext('2d'); x.fillStyle = '#4a2f1c'; x.font = '700 76px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TECOVAS', 256, 52);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      const word = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1.1, 24, 1, true, -0.75, 1.5), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 })); word.scale.z = OZ * 1.004; word.scale.x = 1.004; word.position.y = BY + 2.3; H.add(word);
      const posts = []; for (const [px, pz] of [[-5.6, -4.2], [5.6, -4.2], [-5.6, 4.2], [5.6, 4.2]]) { const g = new THREE.CylinderGeometry(0.18, 0.2, BY + 0.6, 8); g.translate(px, (BY + 0.6) / 2 - 0.5, pz); posts.push(keepPN(g)); }
      H.add(new THREE.Mesh(mergeGeometries(posts), new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.5, metalness: 0.5 })));
      group.add(H); solid.push([hx, hz, 11]);
    }
  }

  // ---- the pedestrian bridges over the track: at Turn 3 (across the whole circuit) and at Turn 16 (into the infield) -
  //      a white steel truss 6 m over the road, a stair tower at each end beyond the barriers
  {
    const parts = [];
    for (const [turn, along] of [[3, -60], [16, 70]]) {
      const s0 = cornerS(turn); if (s0 == null) continue;
      const s = s0 + along, i = tr.idxAtS(s), f = tr.sample(s, 0), wl = tr.wallAt(i, 1) + 4, wr = tr.wallAt(i, -1) + 4, span = wl + wr;
      const B = new THREE.Group(); B.name = `scene:bridge${turn}`; const y0 = TERRAIN.at(f.x, f.z);
      B.position.set(f.x + f.nx * (wl - wr) / 2, y0, f.z + f.nz * (wl - wr) / 2); B.rotation.y = Math.atan2(-f.nz, f.nx); B.userData.onTerrain = true;   // (local +x across the track)
      const g = [], b = (w, h, d, x, y, z, rz = 0) => { const q = new THREE.BoxGeometry(w, h, d); if (rz) q.rotateZ(rz); q.translate(x, y, z); g.push(keepPN(q)); };
      b(span, 0.5, 4.2, 0, 6.2, 0);                                     // (the deck)
      for (const z of [-2.1, 2.1]) { b(span, 0.25, 0.25, 0, 8.6, z); b(span, 0.25, 0.25, 0, 6.5, z); for (let x = -span / 2; x <= span / 2; x += 3) b(0.18, 2.2, 0.18, x, 7.5, z, ((x / 3) | 0) % 2 ? 0.6 : -0.6); }
      for (const side of [-1, 1]) {   // (the stair towers: down past the ground's dip, so they stand on it wherever it is)
        const x = side * (span / 2 + 3); b(6, 14, 6, x, -0.5, 0); for (let k = 0; k < 4; k++) b(5.6, 0.25, 1.4, x, 1.4 + k * 1.6, k % 2 ? 2.2 : -2.2, k % 2 ? 0.5 : -0.5);
      }
      B.add(new THREE.Mesh(mergeGeometries(g), white)); group.add(B);
    }
  }

  // ---- the Texas flag on its pole by the Turn 15 stands: 18 x 12 m, waving
  let flagMat = null;
  {
    let fx, fz;
    if (t15) { const i = footprintInfo(t15.rings[0]); fx = i.c[0]; fz = i.c[1]; } else { const f = tr.sample(cornerS(15) ?? 0, 60); fx = f.x; fz = f.z; }
    // (behind the stands, away from the track)
    const q = tr.nearest(fx, fz), f = tr.sample(q.s, 0); let dx = fx - f.x, dz = fz - f.z; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
    const px = fx + dx * 45, pz = fz + dz * 45;
    const F = new THREE.Group(); F.name = 'scene:flag'; F.position.set(px, 0, pz);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 42, 10), steel); pole.position.y = 21; F.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd8b25a, metalness: 0.8, roughness: 0.3 })); ball.position.y = 42.4; F.add(ball);
    const c = document.createElement('canvas'); c.width = 768; c.height = 512; const x = c.getContext('2d');
    x.fillStyle = '#ffffff'; x.fillRect(256, 0, 512, 256); x.fillStyle = '#bf0a30'; x.fillRect(256, 256, 512, 256); x.fillStyle = '#002868'; x.fillRect(0, 0, 256, 512);
    x.fillStyle = '#ffffff'; x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 36 : 90; (k ? x.lineTo : x.moveTo).call(x, 128 + Math.cos(a) * r, 256 + Math.sin(a) * r); } x.closePath(); x.fill();
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    flagMat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.8 });
    flagMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = { value: 0 }; flagMat.userData.shader = sh;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat fk = uv.x; transformed.z += fk * (0.9 * sin(uTime * 2.6 - uv.x * 7.0) + 0.35 * sin(uTime * 4.1 - uv.x * 13.0 + uv.y * 3.0)); transformed.y -= fk * fk * 0.8;');
    };
    flagMat.customProgramCacheKey = () => 'texasflag';
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(18, 12, 36, 12), flagMat); flag.geometry.translate(9, 0, 0); flag.position.set(0.4, 35.5, 0);
    flag.rotation.y = Math.atan2(dz, -dx) * 0;   // (it flies with the prevailing southerly)
    F.add(flag); group.add(F); solid.push([px, pz, 14]);
  }

  // ---- grandstands
  const stands = [], standBoxes = [];
  for (const S of STANDS) {
    let ox, oz, ex, ez;
    if (S.outline) {
      const b = byName(new RegExp(S.outline, 'i')); if (!b) continue; claimed.add(b.id);
      const info = footprintInfo(b.rings[0]), q = tr.nearest(info.c[0], info.c[1]), f = tr.sample(q.s, 0); let dx = info.c[0] - f.x, dz = info.c[1] - f.z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      ox = info.c[0] - dx * 10; oz = info.c[1] - dz * 10; ez = [dx, dz]; ex = [dz, -dx];
    } else {
      const s0 = S.s != null ? S.s : (cornerS(S.turn) ?? NaN) + (S.along || 0); if (!isFinite(s0)) continue;
      const f = tr.sample(s0, 0); let wall = 0; for (let ds = -S.len / 2; ds <= S.len / 2; ds += 4) wall = Math.max(wall, tr.wallAt(tr.idxAtS(s0 + ds), S.side));
      ox = f.x + f.nx * S.side * (wall + 5.5); oz = f.z + f.nz * S.side * (wall + 5.5); ex = [f.tx, f.tz]; ez = [f.nx * S.side, f.nz * S.side];
    }
    const DEPTH = 0.8 + S.tiers * 1.35 + 1;
    const clear = () => { for (let u = -S.len / 2; u <= S.len / 2; u += 5) for (let v = 0; v <= DEPTH; v += 6) { const x = ox + ex[0] * u + ez[0] * v, z = oz + ex[1] * u + ez[1] * v; if (corridorSigned(tr, pit, x, z, 3) < 0) return false; } return true; };
    let k = 0; while (k < 24 && !clear()) { ox += ez[0] * 2; oz += ez[1] * 2; k++; }
    if (k >= 24) { console.info(`[austin] no room for ${S.name}`); continue; }
    // (on a slope a long stand steps down the hill in sections, each level on its own short plinth - Turn 1's climbs
    //  with the road - instead of one deck held up at its highest point over a wall at its lowest)
    let hLo = Infinity, hHi = -Infinity; if (TERRAIN.on) for (let u = -S.len / 2; u <= S.len / 2; u += 5) { const h = TERRAIN.at(ox + ex[0] * u, oz + ex[1] * u); hLo = Math.min(hLo, h); hHi = Math.max(hHi, h); }
    const K = TERRAIN.on ? Math.max(1, Math.min(8, Math.ceil((hHi - hLo) / 1.8))) : 1, segL = S.len / K;
    for (let j = 0; j < K; j++) { const u = -S.len / 2 + segL * (j + 0.5), st = S.style ? { ...S.style, art: j === K - 1 ? S.style.art : undefined } : null; stands.push({ x: ox + ex[0] * u, z: oz + ex[1] * u, ex, ez, len: K > 1 ? segL - 1.2 : S.len, tiers: S.tiers, name: S.name, style: st }); }
    const cx = ox + ez[0] * DEPTH / 2, cz = oz + ez[1] * DEPTH / 2; standBoxes.push([cx, cz, S.len / 2 + 8]); solid.push([cx, cz, S.len / 2 + 6]);
  }

  // ---- the Grand Plaza: the round lawn at the heart of the fan zone (a grey oval of a stage in the middle) in a wide ring
  //      of pale paving, near the amphitheatre - wherever round it there is room for all 160 m of it - and the red
  //      peaked marquees at its edge
  let plazaAt = null;
  if (towerAt) {
    const blds = geo.buildings.filter((b) => b.rings[0] && !claimed.has(b.id)).map((b) => { const f = footprintInfo(b.rings[0]); let r = 0; for (const [x, z] of b.rings[0]) r = Math.max(r, Math.hypot(x - f.c[0], z - f.c[1])); return [f.c[0], f.c[1], r, b.id]; });
    const fits = (x, z) => corridorSigned(tr, pit, x, z, 86) > 0 && !solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + 80) ** 2 && r < 60) && !standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + 82) ** 2);
    for (const r of [150, 180, 210, 250, 290, 340]) { for (let k = 0; k < 24 && !plazaAt; k++) { const a = (k * Math.PI) / 12, x = towerAt[0] + Math.cos(a) * r, z = towerAt[1] + Math.sin(a) * r; if (fits(x, z)) plazaAt = [x, z]; } if (plazaAt) break; }
    if (plazaAt) {
      const G = new THREE.Group(); G.name = 'scene:grandplaza'; G.position.set(plazaAt[0], 0, plazaAt[1]);
      const flat = (g, y) => { g.rotateX(-Math.PI / 2); g.translate(0, y, 0); return g; };
      G.add(new THREE.Mesh(flat(new THREE.CircleGeometry(80, 64), 0.06), new THREE.MeshStandardMaterial({ color: 0xd2cdc2, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })));
      G.add(new THREE.Mesh(flat(new THREE.CircleGeometry(54, 64), 0.1), new THREE.MeshStandardMaterial({ map: grassTex(), color: 0x9cc070, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })));
      const ov = flat(new THREE.CircleGeometry(20, 40), 0.14); ov.scale(1.55, 1, 1);
      G.add(new THREE.Mesh(ov, new THREE.MeshStandardMaterial({ color: 0x8e9196, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })));
      // (the walks out across the paving, and the red marquees on its edge toward the amphitheatre)
      const toT = Math.atan2(towerAt[1] - plazaAt[1], towerAt[0] - plazaAt[0]), T = [];
      for (let k = 0; k < 5; k++) { const a = toT + 0.75 + (k - 2) * 0.16, x = Math.cos(a) * 92, z = Math.sin(a) * 92; T.push(vcolor(keepPN(nonIdx(new THREE.BoxGeometry(12.5, 3, 12).rotateY(-a).translate(x, 1.5, z))), 0xf2f2f0), vcolor(keepPN(nonIdx(new THREE.ConeGeometry(8.6, 5.5, 4).rotateY(Math.PI / 4 - a).translate(x, 5.75, z))), 0xd21f2f)); }
      G.add(new THREE.Mesh(mergeGeometries(T), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })));
      group.add(G); solid.push([plazaAt[0], plazaAt[1], 84]);
      for (const [bx, bz, r, id] of blds) if ((bx - plazaAt[0]) ** 2 + (bz - plazaAt[1]) ** 2 < (r + 84) ** 2) claimed.add(id);   // (the sheds standing where it goes give way to it)
    }
  }

  // ---- the stars on the blue of the Turn 1 run-off (its stripes: tracks.js runoffPaint): white five-pointed stars,
  //      3 m across, in rows on the blue bands outside the hairpin
  {
    const s1 = cornerS(1), stars = [];
    if (s1 != null) {
      const shape = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 0.62 : 1.5; (k ? shape.lineTo : shape.moveTo).call(shape, Math.cos(a) * r, Math.sin(a) * r); }
      const base = new THREE.ShapeGeometry(shape); base.rotateX(-Math.PI / 2);
      const kw = tr.kerbWidth;
      for (let s = s1 - 110; s <= s1 + 70; s += 6.5) {
        const i = tr.idxAtS(s);
        for (const side of [1, -1]) {
          const wall = tr.wallAt(i, side), hw = tr.hw[i]; if (wall < hw + kw + 10 || (side > 0 ? tr.surfL[i] : tr.surfR[i]) !== 1) continue;
          for (let r = 0; r < 3; r++) {
            const d = hw + kw + 1.6 + r * 3.1 + ((Math.round(s / 6.5) % 2) ? 1.5 : 0); if (d > Math.min(wall - 3, hw + kw + 9.2)) continue;
            const f = tr.sample(s, side * d), g = base.clone(); g.rotateY(Math.atan2(f.tx, f.tz)); g.translate(f.x, 0.014, f.z); stars.push(keepPN(g));
          }
        }
      }
      if (stars.length) group.add(new THREE.Mesh(mergeGeometries(stars), new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })));
    }
  }

  // ---- white hospitality marquees: the paddock behind the pits, the Turn 1 hill, the Grand Plaza
  {
    const tents = [];
    const tent = (x, z, ang, w, d) => {
      const b = new THREE.BoxGeometry(w, 3.2, d); b.translate(0, 1.6, 0); const r = new THREE.ConeGeometry(Math.hypot(w, d) / 2, 2.2, 4, 1); r.rotateY(Math.PI / 4); r.scale(w / Math.hypot(w, d) * 1.414, 1, d / Math.hypot(w, d) * 1.414); r.translate(0, 4.3, 0);
      for (const g of [b, r]) { g.rotateY(ang); g.translate(x, 0, z); tents.push(keepPN(nonIdx(g))); }
    };
    for (const [turn, along, side, n, back] of [[20, 140, 1, 6, 70], [1, -230, 1, 5, 60], [1, 60, -1, 4, 70], [12, 80, 1, 5, 80], [16, -60, -1, 4, 60]]) {
      const s0 = (cornerS(turn) ?? 0) + along;
      for (let k = 0; k < n; k++) {
        const s = s0 + k * 26, f = tr.sample(s, 0), d = back + rnd() * 10, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d;
        if (!free(x, z, 10)) continue; tent(x, z, Math.atan2(f.tx, f.tz), 20, 12); solid.push([x, z, 14]);
      }
    }
    if (tents.length) group.add(new THREE.Mesh(mergeGeometries(tents), white));
  }

  // ---- the big screens: over the Turn 1 stand, the Turn 12 stand, the stadium
  {
    const scr = [], frame = [];
    for (const [turn, along, side] of [[1, -40, -1], [12, -40, -1], [15, 30, 1], [19, 40, -1]]) {
      const s = (cornerS(turn) ?? 0) + along, i = tr.idxAtS(s), f = tr.sample(s, 0), d = tr.wallAt(i, side) + 30, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d;
      if (!free(x, z, 2)) continue;
      const ang = Math.atan2(-f.nx * side, -f.nz * side);
      const p = new THREE.PlaneGeometry(14, 8); p.rotateY(ang); p.translate(x, 12, z); scr.push(keepPN(p));
      const b = new THREE.BoxGeometry(15, 9, 0.6); b.rotateY(ang); b.translate(x - Math.sin(ang) * 0.35, 12, z - Math.cos(ang) * 0.35); frame.push(keepPN(nonIdx(b)));
      for (const o of [-5, 5]) { const l = new THREE.BoxGeometry(0.5, 8, 0.5); l.translate(o, 4, 0); l.rotateY(ang); l.translate(x - Math.sin(ang) * 0.4, 0, z - Math.cos(ang) * 0.4); frame.push(keepPN(nonIdx(l))); }
      solid.push([x, z, 9]);
    }
    if (scr.length) {
      group.add(new THREE.Mesh(mergeGeometries(scr), new THREE.MeshStandardMaterial({ color: 0x0b1a2e, emissive: 0x2a5aa8, emissiveIntensity: 0.9, roughness: 0.3 })));
      group.add(new THREE.Mesh(mergeGeometries(frame), new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.6 })));
    }
  }

  // ---- the festival: a race weekend here is a hundred thousand people a day. General admission on the grass banks
  //      (raked up away from the fence, packed), the Grand Plaza and the lawn full, flags in the crowd, food trucks and
  //      merchandise tents, a concert on the amphitheatre's stage, the Stars and Stripes over the run to Turn 1, the red
  //      paint along that run, the braking boards, the TV cranes
  const fest = { sheetMat: null, flagMat: null, stageLights: [] };
  {
    const sheets = [], mats = [], brollies = [], coolers = [];   // sheets: [x, y, z, ang, variant] (fanAtlas: 0-7 standing, 8-9 sitting)
    const STAND = [0, 0, 0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7];
    const stander = () => STAND[(rnd() * STAND.length) | 0];
    // (a group on a picnic blanket: two to four sitting on it, now and then a sun umbrella and a cooler beside it)
    const picnic = (x, y, z, ang) => {
      mats.push([x, y, z, ang + (rnd() - 0.5) * 0.4, (rnd() * 4) | 0]);
      const n = 2 + ((rnd() * 3) | 0), ca = Math.cos(ang), sa = Math.sin(ang);
      for (let k = 0; k < n; k++) { const u = (k - (n - 1) / 2) * 0.62 + (rnd() - 0.5) * 0.15, v = (rnd() - 0.5) * 0.7; sheets.push([x + ca * u + sa * v, y + 0.02, z - sa * u + ca * v, ang + (rnd() - 0.5) * 0.6, 8 + ((rnd() * 2) | 0)]); }
      if (rnd() < 0.3) brollies.push([x + sa * 1.3, y, z + ca * 1.3, rnd() * 6.3]);
      if (rnd() < 0.5) coolers.push([x - ca * 1.3, y, z + sa * 1.3, ang]);
    };
    const berms = [];
    // (a bank: from `d0` m past the barrier to `d1`, along s0..s1 on a side, rising `rise` m away from the track; the
    //  grass under it and the people on it - every place clear of the stands, the tents and the track's corridor)
    const bank = (s0, s1, side, d0, d1, rise, fill = 0.72, clear = 8) => {
      // (a real hill, not a wedge: up from the grass to a crest 3/4 of the way back, down again behind it, and eased
      //  into the ground over its last 30 m at either end - no cliffs or edges to see from the track)
      const sm = (v) => { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); };
      const qq = {}, hAt0 = (s, u) => rise * (u < 0.75 ? sm(u / 0.75) : sm((1 - u) / 0.25)) * sm(Math.min(s - s0, s1 - s) / 30);
      // (and flat wherever it comes back near the track - inside a tight corner its offsets cross over the road's)
      const hAt = (s, u, x, z) => { const q = tr.nearest(x, z, -1, qq), gap = Math.abs(q.d) - tr.wallAt(q.i, Math.sign(q.d) || 1); return hAt0(s, u) * sm((gap - 2) / 6); };
      const P = [], UV = [], I = [], rows = Math.ceil((d1 - d0) / 3) + 1; let cols = 0;
      for (let s = s0; s <= s1 + 0.1; s += 4) {
        const i = tr.idxAtS(s), w = tr.wallAt(i, side), f = tr.sample(s, 0);
        for (let r = 0; r < rows; r++) { const u = r / (rows - 1), d = w + d0 + (d1 - d0) * u, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d; P.push(x, hAt(s, u, x, z) - 0.05, z); UV.push(x / 9, z / 9); }
        cols++;
      }
      for (let c = 0; c < cols - 1; c++) for (let r = 0; r < rows - 1; r++) { const a = c * rows + r, b = a + 1, cc = a + rows, d = cc + 1; if (side > 0) I.push(a, cc, b, b, cc, d); else I.push(a, b, cc, b, d, cc); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I); g.computeVertexNormals(); berms.push(g);
      for (let s = s0; s <= s1; s += 0.75) {
        const i = tr.idxAtS(s), w = tr.wallAt(i, side), f = tr.sample(s, 0), ang = Math.atan2(-f.nx * side, -f.nz * side);
        for (let d = d0 + 1.2; d <= d1 - 0.5; d += 1.15) {
          if (rnd() > fill) continue;
          const dd = w + d + (rnd() - 0.5) * 0.5, x = f.x + f.nx * side * dd + (rnd() - 0.5) * 0.4, z = f.z + f.nz * side * dd + (rnd() - 0.5) * 0.4;
          if (!(corridorSigned(tr, pit, x, z, clear) > 0 && !solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r))) continue;
          const u = (d - d0) / (d1 - d0), y = hAt(s, u, x, z);
          if (rnd() < 0.07) { picnic(x, y, z, ang); d += 1.2; continue; }
          sheets.push([x, y, z, ang + (rnd() - 0.5) * 0.5, stander()]);
        }
      }
    };
    // every general-admission area round the lap (austinCrowdZones): behind its fence (2.5 m back from the barrier line), on
    // its low mound - no hills thrown up round the corners, the ground is the hill country's own
    for (const z of tr.crowdZones || []) bank(z.s0, z.s1, z.side, 3, 3 + z.depth, z.rise, z.fill, 2.5);
    // the Grand Plaza and the amphitheatre's lawn: milling, every which way (and facing the stage on the lawn)
    if (towerAt) {
      const Pz = group.getObjectByName('scene:plaza'), yaw = Pz ? Pz.rotation.y : 0, cy = Math.cos(yaw), sy = Math.sin(yaw);
      const L = (u, v) => [towerAt[0] + cy * u + sy * v, towerAt[1] - sy * u + cy * v];
      // (in the bowl's seats, sitting, and on the lawn above: all facing the stage)
      const face = (a) => { const dx = -Math.cos(a), dz = -Math.sin(a); return Math.atan2(cy * dx + sy * dz, -sy * dx + cy * dz); };
      for (const [u, v, y, a] of amphi.seats) { if (rnd() > 0.55) continue; const [x, z] = L(u, v); sheets.push([x, y + 0.05, z, face(a) + (rnd() - 0.5) * 0.2, 8 + ((rnd() * 2) | 0)]); }
      for (const [u, v, y, a] of amphi.lawn) {
        if (rnd() > 0.6) continue; const [x, z] = L(u + (rnd() - 0.5) * 0.6, v + (rnd() - 0.5) * 0.6);
        if (rnd() < 0.1) picnic(x, y, z, face(a)); else sheets.push([x, y, z, face(a) + (rnd() - 0.5) * 0.3, stander()]);
      }
      if (plazaAt) for (let k = 0; k < 5600; k++) { const a = rnd() * Math.PI * 2, r = rnd() < 0.7 ? 55 + rnd() * 24 : 24 + rnd() * 29, x = plazaAt[0] + Math.cos(a) * r, z = plazaAt[1] + Math.sin(a) * r; if (corridorSigned(tr, pit, x, z, 4) > 0) sheets.push([x, 0, z, rnd() * Math.PI * 2, stander()]); }
      // food trucks and merchandise tents along the plaza's edges
      const trucks = [], tents = [], awnings = [];
      for (let k = 0; k < 18; k++) {
        const u = 115 + k * 9, v = (k % 2 ? 1 : -1) * 33, [x, z] = L(u, v); if (corridorSigned(tr, pit, x, z, 6) < 0) continue;
        const g = new THREE.BoxGeometry(6.5, 3, 2.6); g.translate(0, 1.6, 0); g.rotateY(yaw); g.translate(x, 0, z); trucks.push(keepPN(vcolor(nonIdx(g), [0xf2f2f2, 0xd8263c, 0x2a5aa8, 0xffc21a, 0x2a2a2a, 0x2fa36b][k % 6])));
        const aw = new THREE.BoxGeometry(6.5, 0.12, 1.6); aw.translate(0, 2.9, (k % 2 ? -1 : 1) * 2.0); aw.rotateY(yaw); aw.translate(x, 0, z); awnings.push(vcolor(keepPN(nonIdx(aw)), [0xb31942, 0xffffff, 0x0a3161][k % 3]));
      }
      for (let k = 0; k < 10; k++) {
        const [x, z] = L(300 + (k % 5) * 12, (k < 5 ? -1 : 1) * 22); if (corridorSigned(tr, pit, x, z, 8) < 0) continue;
        const r = new THREE.ConeGeometry(6, 3.5, 4); r.rotateY(Math.PI / 4); r.translate(0, 4.6, 0); r.translate(x, 0, z); tents.push(vcolor(keepPN(nonIdx(r)), [0xe8002d, 0xff8000, 0x1e3a8a, 0x27f4d2, 0xffffff][k % 5]));
        const b = new THREE.BoxGeometry(8.4, 2.9, 8.4); b.translate(x, 1.45, z); tents.push(vcolor(keepPN(nonIdx(b)), 0xf4f4f4));
      }
      const vmat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 });
      if (trucks.length) group.add(new THREE.Mesh(mergeGeometries(trucks), vmat));
      if (awnings.length) group.add(new THREE.Mesh(mergeGeometries(awnings), vmat));
      if (tents.length) group.add(new THREE.Mesh(mergeGeometries(tents), vmat));
      // the concert on the stage: the light rig's beams (cones of coloured light, swept in time) and a band's backdrop
      const [sx, sz] = L(30, 0);
      for (let k = 0; k < 6; k++) {
        const m = new THREE.MeshBasicMaterial({ color: [0xff2266, 0x22ccff, 0xffcc22, 0x9944ff, 0x22ff88, 0xff6622][k], transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
        const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 9.5, 12, 1, true), m); cone.geometry.translate(0, -4.75, 0);
        const piv = new THREE.Group(); const lx = sx + sy * (k - 2.5) * 4, lz = sz + cy * (k - 2.5) * 4; piv.position.set(lx, 9.5 + TERRAIN.at(lx, lz), lz); piv.userData.onTerrain = true; piv.add(cone); piv.visible = false; group.add(piv); fest.stageLights.push(piv);   // (swept every frame: placed on the ground here, not raised with the world; lit after dark)
      }
    }
    // the fans: one instanced quad each (one mesh per 400 m cell: whole cells cull), cut out of fanAtlas - ten people,
    // standing, cheering, filming, in a cap or a Stetson, sitting - each with their own shirt, trousers, skin and hair or
    // hat, from everyday colours (team shirts among them, not every one); the cheering ones bounce
    for (const [x, y, z, a] of paddockFans) sheets.push([x, y, z, a, stander()]);
    fest.sheetMat = fanMaterial();
    const cells = new Map(); for (const sh of sheets) { const k = Math.floor(sh[0] / 400) * 1000 + Math.floor(sh[2] / 400); let a = cells.get(k); if (!a) cells.set(k, (a = [])); a.push(sh); }
    for (const list of cells.values()) { const im = fanMesh(list, fest.sheetMat, rnd); im.name = 'austin:fans'; group.add(im); }
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), col = new THREE.Color();
    // the picnic blankets (four patterns: red gingham, a blue plaid, a green check, a striped beach towel), the sun
    // umbrellas, the coolers
    if (mats.length) {
      const mt = mattAtlas();
      const g = new THREE.PlaneGeometry(2.2, 1.7); g.rotateX(-Math.PI / 2); g.translate(0, 0.03, 0);
      const mm = new THREE.MeshLambertMaterial({ map: mt, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      mm.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aVar;').replace('#include <uv_vertex>', '#include <uv_vertex>\n vMapUv = vec2((uv.x + aVar) / 4.0, uv.y);'); };
      mm.customProgramCacheKey = () => 'austin-mats';
      const im = new THREE.InstancedMesh(g, mm, mats.length), vr = new Float32Array(mats.length);
      mats.forEach(([x, y, z, a, v], i) => { m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(up, a), sc.set(1, 1, 1)); im.setMatrixAt(i, m4); vr[i] = v; });
      g.setAttribute('aVar', new THREE.InstancedBufferAttribute(vr, 1)); im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); group.add(im);
    }
    if (brollies.length) {
      const top = new THREE.ConeGeometry(1.15, 0.45, 8, 1, true); top.translate(0, 2.05, 0);
      const pole = new THREE.CylinderGeometry(0.02, 0.02, 2.1, 4); pole.translate(0, 1.05, 0);
      const BR = [0x23304a, 0xe9e9e6, 0xa82a32, 0x2f6b4a, 0xd8c8a0, 0xd0702c];
      for (const [geo, color] of [[top, null], [pole, 0xdddddd]]) {
        const im = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide }), brollies.length);
        brollies.forEach(([x, y, z, a], i) => { m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(up, a), sc.set(1, 1, 1)); im.setMatrixAt(i, m4); im.setColorAt(i, col.setHex(color ?? BR[(rnd() * BR.length) | 0])); });
        im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); group.add(im);
      }
    }
    if (coolers.length) {
      const box = new THREE.BoxGeometry(0.62, 0.4, 0.4); box.translate(0, 0.2, 0);
      const CO = [0xb8232d, 0x2b4f9e, 0xe9e9e6, 0xd0702c, 0x3a6b46];
      const im = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial({ color: 0xffffff }), coolers.length);
      coolers.forEach(([x, y, z, a], i) => { m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(up, a), sc.set(1, 1, 1)); im.setMatrixAt(i, m4); im.setColorAt(i, col.setHex(CO[(rnd() * CO.length) | 0])); });
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); group.add(im);
    }
    if (berms.length) {
      group.add(new THREE.Mesh(mergeGeometries(berms), new THREE.MeshStandardMaterial({ map: grassTex(), roughness: 1, side: THREE.DoubleSide })));
    }
    // flags in the crowd: team colours, the Stars and Stripes, the Lone Star - on poles above the banks, waving
    {
      const spots = []; for (let k = 0; k < sheets.length; k += 90) spots.push(sheets[(k + ((rnd() * 60) | 0)) % sheets.length]);
      const flagG = new THREE.PlaneGeometry(1.4, 0.9, 6, 1); flagG.translate(0.7, 3.2, 0);
      const poleG = new THREE.CylinderGeometry(0.02, 0.02, 3.7, 4); poleG.translate(0, 1.85, 0);
      fest.flagMat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      fest.flagMat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = { value: 0 }; fest.flagMat.userData.shader = sh;
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n float fx = max(0.0, position.x) / 1.4; transformed.z += fx * 0.22 * sin(uTime * 6.0 - position.x * 4.0 + instanceMatrix[3][0]);');
      };
      fest.flagMat.customProgramCacheKey = () => 'austin-crowdflags';
      const fl = new THREE.InstancedMesh(flagG, fest.flagMat, spots.length), po = new THREE.InstancedMesh(poleG, new THREE.MeshLambertMaterial({ color: 0x222222 }), spots.length);
      const FLAG = [0xff8000, 0xe8002d, 0x1e3a8a, 0x0a3161, 0xb31942, 0xffffff, 0x27f4d2, 0x00665e, 0xffd400];
      spots.forEach(([x, y, z, a], i) => { m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(up, a + rnd() * 0.8), sc.set(1, 1, 1)); fl.setMatrixAt(i, m4); po.setMatrixAt(i, m4); fl.setColorAt(i, col.setHex(FLAG[(rnd() * FLAG.length) | 0])); });
      for (const im of [fl, po]) { im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); group.add(im); }
    }
    console.info(`[austin] the festival: ${sheets.length} fans on the banks and in the plaza, ${mats.length} picnic blankets, ${brollies.length} umbrellas`);
  }
  // the Stars and Stripes over the run to Turn 1 (left of the track, by the hill): 40 m up, 20 x 11 m
  {
    const s = (cornerS(1) ?? 0) - 230, i = tr.idxAtS(s), f = tr.sample(s, 0), d = tr.wallAt(i, 1) + 14, x = f.x + f.nx * d, z = f.z + f.nz * d;
    const c = document.createElement('canvas'); c.width = 760; c.height = 400; const g = c.getContext('2d');
    for (let k = 0; k < 13; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#b31942'; g.fillRect(0, k * 400 / 13, 760, 400 / 13 + 1); }
    g.fillStyle = '#0a3161'; g.fillRect(0, 0, 304, 215); g.fillStyle = '#ffffff';
    for (let r = 0; r < 9; r++) for (let k = 0; k < (r % 2 ? 5 : 6); k++) { const cx = 25 + k * 50 + (r % 2 ? 25 : 0), cy = 13 + r * 23; g.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, rr = j % 2 ? 3.6 : 9; (j ? g.lineTo : g.moveTo).call(g, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.fill(); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.8 });
    mat.onBeforeCompile = (sh) => { sh.uniforms.uTime = { value: 0 }; mat.userData.shader = sh; sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;').replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat fk = uv.x; transformed.z += fk * (1.0 * sin(uTime * 2.4 - uv.x * 7.0) + 0.4 * sin(uTime * 3.9 - uv.x * 12.0 + uv.y * 3.0)); transformed.y -= fk * fk * 0.9;'); };
    mat.customProgramCacheKey = () => 'usflag';
    const F = new THREE.Group(); F.name = 'scene:usflag'; F.position.set(x, 0, z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.55, 48, 10), steel); pole.position.y = 24; F.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(20, 10.5, 40, 12), mat); flag.geometry.translate(10, 0, 0); flag.position.set(0.4, 42, 0); F.add(flag);
    group.add(F); fest.usFlag = mat; solid.push([x, z, 10]);
  }
  // the red paint along the run to Turn 1, both sides, the white braking boards (150, 100, 50) there and before the
  // hairpin, Turn 12 and Turn 20, and the TV cranes
  {
    const s1 = cornerS(1);
    if (s1 != null) {
      const HW = tr.hw, red = [0.5, 0.06, 0.1];
      const strip = (side) => ribbon(tr, (i) => (side > 0 ? HW[i] + 0.05 : -(HW[i] + 6.5)), (i) => (side > 0 ? HW[i] + 6.5 : -(HW[i] + 0.05)), 0.012, { mask: (i) => { const s = tr.s[i], d = tr.wrapS(s - (s1 - 520)); return d < 470; }, colorFn: () => red });
      const g = mergeGeometries([strip(1), strip(-1)].filter((x) => x.index?.count));
      if (g) group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })));
    }
    const boards = [], c = document.createElement('canvas'); c.width = 384; c.height = 128; const x2 = c.getContext('2d');
    ['150', '100', '50'].forEach((t, k) => { x2.fillStyle = '#ffffff'; x2.fillRect(k * 128 + 6, 6, 116, 116); x2.fillStyle = '#111'; x2.font = '900 54px Arial'; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillText(t, k * 128 + 64, 66); });
    const btex = new THREE.CanvasTexture(c); btex.colorSpace = THREE.SRGBColorSpace;
    for (const n of [1, 11, 12, 20]) {
      const sA = cornerS(n); if (sA == null) continue;
      // (the brake point of a corner is where the speed profile starts to fall: the boards count down to it)
      [150, 100, 50].forEach((m, k) => {
        const s = sA - 90 - m, i = tr.idxAtS(s), f = tr.sample(s, 0), d = -(tr.hw[i] + 3.2), x = f.x + f.nx * d, z = f.z + f.nz * d;
        const p = new THREE.PlaneGeometry(1.0, 1.0); const uv = p.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, (k + uv.getX(j)) / 3);
        p.translate(0, 1.2, 0); p.rotateY(Math.atan2(-f.tx, -f.tz)); p.translate(x, 0, z); boards.push(p);
      });
    }
    if (boards.length) group.add(new THREE.Mesh(mergeGeometries(boards), new THREE.MeshBasicMaterial({ map: btex, side: THREE.DoubleSide })));
    // the cranes: a yellow boom over the fence with the camera on its end (Turn 1, the Esses, the stadium)
    const yel = new THREE.MeshStandardMaterial({ color: 0xf2b417, roughness: 0.5, metalness: 0.4 }), crane = [];
    for (const [n, a, side] of [[1, -120, 1], [4, 0, -1], [15, 0, 1]]) {
      const sA = cornerS(n); if (sA == null) continue; const s = sA + a, i = tr.idxAtS(s), f = tr.sample(s, 0), d = tr.wallAt(i, side) + 7, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d;
      if (!free(x, z, 1)) continue;
      const mast = new THREE.BoxGeometry(0.8, 14, 0.8); mast.translate(0, 7, 0);
      const boom = new THREE.BoxGeometry(0.5, 0.5, 16); boom.rotateX(-0.5); boom.translate(0, 17.5, -6.5);
      const cam = new THREE.BoxGeometry(1, 0.8, 1.3); cam.translate(0, 21, -13.6);
      const yaw = Math.atan2(f.nx * side, f.nz * side);
      for (const g of [mast, boom, cam]) { g.rotateY(yaw); g.translate(x, 0, z); crane.push(keepPN(nonIdx(g))); }
      solid.push([x, z, 4]);
    }
    if (crane.length) group.add(new THREE.Mesh(mergeGeometries(crane), yel));
  }

  // ---- downtown Austin on the horizon: 18 km to the north-north-west, brought in to 4.5 km along its true bearing and
  //      scaled up (bolder than true: it stands out over the trees, a skyline you can read from the track) - the
  //      Sixth and Guadalupe tower, the Independent's stacked blocks, the Austonian, the Frost Bank Tower's crown, 360,
  //      the Google tower's sail, the Capitol's dome, the UT Tower, and the rest of downtown round them
  {
    let cx = 0, cz = 0; for (let i = 0; i < tr.n; i++) { cx += tr.px[i]; cz += tr.pz[i]; } cx /= tr.n; cz /= tr.n;
    const DT = geo.proj.toXZ(-97.7430, 30.2672), dd = Math.hypot(DT[0] - cx, DT[1] - cz), K = 4500 / dd, HK = K * 2.4;
    const sky = [], at = (lon, lat) => { const [x, z] = geo.proj.toXZ(lon, lat); return [cx + (x - cx) * K, cz + (z - cz) * K]; };
    const blk = (lon, lat, w, d, h, rot = 0.1, tint = 1, y0 = 0) => { const [x, z] = at(lon, lat), g = new THREE.BoxGeometry(w * HK, h * HK, d * HK); g.translate(0, (y0 + h / 2) * HK, 0); g.rotateY(rot); g.translate(x, 0, z); vcolor(g, new THREE.Color(tint, tint, tint * 1.05)); sky.push(keepPN(nonIdx(g))); return [x, z]; };
    blk(-97.7457, 30.2689, 34, 34, 270, 0.1, 0.8);                      // Sixth and Guadalupe
    for (let k = 0; k < 6; k++) blk(-97.7491 + (k % 2 ? 0.00006 : -0.00006), 30.2669, 30, 26, 35, 0.1 + (k % 2) * 0.2, 1.05, k * 35);   // the Independent ("the Jenga tower")
    blk(-97.7449, 30.2648, 30, 30, 208, 0.12, 0.7);                     // the Austonian
    const frost = blk(-97.7414, 30.2665, 34, 34, 140, 0.785, 0.9);    // the Frost Bank Tower (its crown below)
    blk(-97.7489, 30.2675, 32, 28, 171, 0.3, 1.0);                      // 360
    blk(-97.7466, 30.2665, 40, 30, 179, 0.1, 0.65);                     // the Google tower
    blk(-97.7385, 30.2593, 30, 30, 160, 0.4, 1.1);                      // 70 Rainey
    for (let k = 0; k < 46; k++) {   // the rest of downtown: lower toward its edges
      const lon = -97.752 + rnd() * 0.017, lat = 30.258 + rnd() * 0.015, core = 1 - Math.min(1, Math.hypot((lon + 97.744) / 0.009, (lat - 30.266) / 0.008));
      blk(lon, lat, 18 + rnd() * 24, 18 + rnd() * 24, 30 + core * (60 + rnd() * 90) + rnd() * 20, rnd() * 0.6, 0.7 + rnd() * 0.45);
    }
    blk(-97.7394, 30.2861, 26, 26, 94, 0.1, 1.15);                      // the UT Tower
    const city = new THREE.Mesh(mergeGeometries(sky), makeWindowMaterial({ base: 0x6a7480, litProb: 0.25, cellW: 3.2, cellH: 3.6, useVertexColor: true }));
    city.name = 'scene:skyline';
    const crown = new THREE.Mesh(new THREE.ConeGeometry(18 * HK, 34 * HK, 4), new THREE.MeshStandardMaterial({ color: 0xbfc6cc, roughness: 0.4, metalness: 0.5 })); crown.rotation.y = Math.PI / 4; crown.position.set(frost[0], 157 * HK, frost[1]);
    // the Capitol (a pink granite dome, 92 m) and the UT Tower, north of downtown
    const [kx, kz] = at(-97.7404, 30.2747), cap = new THREE.Group();
    const granite = new THREE.MeshStandardMaterial({ color: 0xd8b9a8, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(170 * HK, 30 * HK, 90 * HK), granite); body.position.y = 15 * HK; cap.add(body);
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(20 * HK, 22 * HK, 30 * HK, 20), granite); drum.position.y = 45 * HK; cap.add(drum);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(20 * HK, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), granite); dome.position.y = 60 * HK; cap.add(dome);
    cap.position.set(kx, 0, kz);
    const sk = new THREE.Group(); sk.name = 'scene:city'; sk.add(city, crown, cap); sk.position.y = TERRAIN.on ? TERRAIN.edge - 0.5 : 0; sk.userData.onTerrain = true; group.add(sk);
  }

  // ---- the land round the circuit, as dense as it is from the air: the perimeter road (the boulevard and its kin) a
  //      lap round the whole venue and the access roads in from it; inside it the paved car parks, striped and full,
  //      their lamp posts and the odd white service building; beyond it the grass overflow lots, worn to straw, and the
  //      cedar-and-oak scrub of the hill country - and the ground under all of it dry here, green there, dark under the
  //      scrub (TERRAIN.tint: the ground mesh's vertex colours)
  {
    // the road: the lap's convex hull, rounded out 170 m, wandering a little
    const pts = []; for (let i = 0; i < tr.n; i += 6) pts.push([tr.px[i], tr.pz[i]]);
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const crs = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = []; for (const p of pts) { while (lo.length >= 2 && crs(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let k = pts.length - 1; k >= 0; k--) { const p = pts[k]; while (hi.length >= 2 && crs(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    const hull = lo.slice(0, -1).concat(hi.slice(0, -1)), RR = 175, raw = [];
    for (let k = 0; k < hull.length; k++) {
      const p = hull[k], a = hull[(k - 1 + hull.length) % hull.length], b = hull[(k + 1) % hull.length];
      const a0 = Math.atan2(-(p[0] - a[0]), p[1] - a[1]); let a1 = Math.atan2(-(b[0] - p[0]), b[1] - p[1]); while (a1 < a0) a1 += Math.PI * 2;
      for (let t = a0; t <= a1 + 1e-6; t += 0.06) raw.push([p[0] + Math.cos(t) * RR, p[1] + Math.sin(t) * RR]);
    }
    const resample = (poly, step, closed) => { const out = [poly[0]]; let carry = 0; const n = poly.length, m = closed ? n : n - 1; for (let k = 0; k < m; k++) { const a = poly[k], b = poly[(k + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); let t = step - carry; while (t <= l) { out.push([a[0] + (b[0] - a[0]) * t / l, a[1] + (b[1] - a[1]) * t / l]); t += step; } carry = l - (t - step); } return out; };
    let ring = resample(raw, 6, true);
    { let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= ring.length; cz /= ring.length; let L = 0;
      ring = ring.map((p, k) => { if (k) L += 6; const dx = p[0] - cx, dz = p[1] - cz, dl = Math.hypot(dx, dz) || 1, w = (vnoise(L / 380, 0.5, 91) - 0.5) * 70; return [p[0] + dx / dl * w, p[1] + dz / dl * w]; });
      for (let it = 0; it < 3; it++) ring = ring.map((p, k) => { const a = ring[(k - 2 + ring.length) % ring.length], b = ring[(k + 2) % ring.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]; }); }
    // (where the road runs: a coarse hash of its points, for "how far from the road")
    const RH = new Map(), rkey = (x, z) => `${Math.floor(x / 50)},${Math.floor(z / 50)}`, roadPts = [];
    const addRoad = (poly) => { for (const p of poly) { const k = rkey(p[0], p[1]); let a = RH.get(k); if (!a) RH.set(k, (a = [])); a.push(p); roadPts.push(p); } };
    const roadDist = (x, z) => { let bd = Infinity; const i = Math.floor(x / 50), j = Math.floor(z / 50); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (const p of RH.get(`${i + a},${j + b}`) || []) bd = Math.min(bd, (p[0] - x) ** 2 + (p[1] - z) ** 2); return Math.sqrt(bd); };
    addRoad(ring);
    const inPoly = (poly, x, z) => { let c = false; for (let k = 0, j = poly.length - 1; k < poly.length; j = k++) { const a = poly[k], b = poly[j]; if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    // the access roads: in from the ring toward the circuit, stopping short of it (and of anything standing)
    let gx = 0, gz = 0; for (const p of hull) { gx += p[0]; gz += p[1]; } gx /= hull.length; gz /= hull.length;
    const spokes = [];
    for (let k = 0; k < 7; k++) {
      const p = ring[Math.floor((k + 0.3) * ring.length / 7)], dx = gx - p[0], dz = gz - p[1], dl = Math.hypot(dx, dz), poly = [p];
      for (let t = 6; t < dl; t += 6) { const x = p[0] + dx / dl * t, z = p[1] + dz / dl * t; if (corridorSigned(tr, pit, x, z, 40) < 0 || solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < (r + 12) ** 2)) break; poly.push([x, z]); }
      if (poly.length > 8) { spokes.push(poly); addRoad(poly); }
    }
    const roadTex = (lanes) => {
      const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d'), r2 = rng(lanes * 13);
      x.fillStyle = '#4e5054'; x.fillRect(0, 0, 128, 256);
      for (let k = 0; k < 1400; k++) { x.fillStyle = r2() < 0.5 ? 'rgba(90,92,96,0.5)' : 'rgba(60,61,64,0.5)'; x.fillRect(r2() * 128, r2() * 256, 2, 2); }
      x.fillStyle = '#d8d8d2'; x.fillRect(4, 0, 3, 256); x.fillRect(121, 0, 3, 256);
      x.fillStyle = '#d9b22e'; x.fillRect(60, 0, 3, 256); x.fillRect(66, 0, 3, 256);
      if (lanes > 2) { x.fillStyle = '#d8d8d2'; for (let y = 0; y < 256; y += 64) { x.fillRect(32, y, 2, 24); x.fillRect(95, y, 2, 24); } }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
    };
    const strip = (poly, w, y, period) => {
      const P = [], U = [], I = [], n = poly.length, A = 4; let len = 0;
      for (let k = 0; k < n; k++) {
        const p = poly[k], a = poly[Math.max(0, k - 1)], b = poly[Math.min(n - 1, k + 1)];
        let tx = b[0] - a[0], tz = b[1] - a[1]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
        if (k) len += Math.hypot(p[0] - poly[k - 1][0], p[1] - poly[k - 1][1]);
        for (let c = 0; c <= A; c++) { const u = c / A, o = (u - 0.5) * w; P.push(p[0] + tz * o, y, p[1] - tx * o); U.push(u, len / period); }
      }
      for (let k = 0; k < n - 1; k++) for (let c = 0; c < A; c++) { const r0 = k * (A + 1) + c, r1 = r0 + A + 1; I.push(r0, r1, r0 + 1, r0 + 1, r1, r1 + 1); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); g.computeVertexNormals(); return g;
    };
    const roadMat = (lanes) => new THREE.MeshStandardMaterial({ map: roadTex(lanes), roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const ringMesh = new THREE.Mesh(strip([...ring, ring[0]], 16, 0.1, 24), roadMat(4)); ringMesh.name = 'austin:road'; group.add(ringMesh);
    if (spokes.length) group.add(new THREE.Mesh(mergeGeometries(spokes.map((p) => strip(p, 9, 0.11, 24))), roadMat(2)));

    // the patchwork: a 24 m grid over the venue and 1.5 km round it, each cell a car park, an overflow lot, scrub or
    // open grass, by where it lies (inside the road or out, how far from the circuit) and the noise of the land
    let bx0 = Infinity, bx1 = -Infinity, bz0 = Infinity, bz1 = -Infinity; for (let i = 0; i < tr.n; i += 5) { bx0 = Math.min(bx0, tr.px[i]); bx1 = Math.max(bx1, tr.px[i]); bz0 = Math.min(bz0, tr.pz[i]); bz1 = Math.max(bz1, tr.pz[i]); }
    const CS = 24, GX0 = bx0 - 1500, GZ0 = bz0 - 1500, NX = Math.ceil((bx1 - bx0 + 3000) / CS), NZ = Math.ceil((bz1 - bz0 + 3000) / CS);
    const kind = new Uint8Array(NX * NZ), gapA = new Float32Array(NX * NZ), qq = {};
    const chunks = new Map(), chunk = (x, z) => { const k = `${Math.floor(x / 400)},${Math.floor(z / 400)}`; let c = chunks.get(k); if (!c) chunks.set(k, (c = { lot: [], lotU: [], field: [], fieldU: [], cars: [], poles: [], bld: [], fans: [], kit: [], trees: { oak: [], elm: [], juniper: [], mesquite: [], far: [] } })); return c; };
    const tile = (P, U, x0, z0, s, y, uw, vh) => { const n = 3, d = s / n; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) { const xa = x0 + a * d, za = z0 + b * d, Q = [[xa, za], [xa, za + d], [xa + d, za + d], [xa, za], [xa + d, za + d], [xa + d, za]]; for (const [x, z] of Q) { P.push(x, y, z); U.push(x / uw, z / vh); } } };
    const PAINT = [0xf2f2f2, 0xf2f2f2, 0x111111, 0x111111, 0x8a9096, 0xc7cbd0, 0xc7cbd0, 0x1f3f7a, 0x8a1c1c, 0x2d4a2a, 0xb0a48a, 0x4b4f55, 0xd8d2c4, 0x6b2020, 0x274a6e];
    const KW = { oak: 0.4, elm: 0.12, juniper: 0.33, mesquite: 0.15 }, pickKind = () => { const r = rnd(); return r < KW.oak ? 'oak' : r < KW.oak + KW.elm ? 'elm' : r < KW.oak + KW.elm + KW.juniper ? 'juniper' : 'mesquite'; };
    const TCOL = { oak: [0x3c4a26, 0x46552b, 0x34411f, 0x4a5530], elm: [0x55642e, 0x5e6c35], juniper: [0x2c3a24, 0x34432a, 0x3a4630], mesquite: [0x6b7340, 0x737a46] }, TH = { oak: [6, 11], elm: [8, 13], juniper: [4, 8], mesquite: [3.5, 6] };
    const plantTree = (c, x, z, far) => { const K = pickKind(), h = TH[K][0] + rnd() * (TH[K][1] - TH[K][0]), col = TCOL[K][(rnd() * TCOL[K].length) | 0]; (far ? c.trees.far : c.trees[K]).push([x, z, h, rnd() * 6.28, col, K === 'juniper' ? 0.55 : 1]); };
    let nLot = 0, nField = 0, nWood = 0, nCars = 0;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const x0 = GX0 + i * CS, z0 = GZ0 + j * CS, cx = x0 + CS / 2, cz = z0 + CS / 2, id = j * NX + i;
      const q = tr.nearest(cx, cz, -1, qq), gap = Math.abs(q.d) - tr.wallAt(q.i, Math.sign(q.d) || 1); gapA[id] = gap;
      if (gap < 28) continue;
      const rd = roadDist(cx, cz); if (rd < 16) { kind[id] = 4; continue; }
      if (corridorSigned(tr, pit, cx, cz, 22) < 0 || solid.some(([sx, sz, r]) => (sx - cx) ** 2 + (sz - cz) ** 2 < (r + 16) ** 2) || standBoxes.some(([sx, sz, r]) => (sx - cx) ** 2 + (sz - cz) ** 2 < (r + 14) ** 2)) continue;
      const inside = inPoly(ring, cx, cz), nl = fbm(cx / 230, cz / 230, 11), nw = fbm(cx / 300, cz / 300, 23), nf = fbm(cx / 380, cz / 380, 37);
      const c = chunk(cx, cz);
      if (inside && gap > 50 && nl > 0.5) {
        kind[id] = 1; nLot++;
        tile(c.lot, c.lotU, x0, z0, CS, 0.05, 21.6, 18);
        if (rnd() < 0.035) { const w = 16 + rnd() * 12, d = 10 + rnd() * 6, h = 5 + rnd() * 3; c.bld.push([cx, cz, w, d, h]); continue; }
        if ((i + 2 * j) % 4 === 0) c.poles.push([x0, z0]);
        for (const zr of [2.75, 15.25]) for (let zz = Math.floor(z0 / 18) * 18 + zr; zz < z0 + CS; zz += 18) { if (zz < z0) continue; for (let xx = Math.ceil(x0 / 2.7 - 0.5) * 2.7 + 1.35; xx < x0 + CS; xx += 2.7) if (rnd() < 0.74) { c.cars.push([xx, zz, (zr < 9 ? 0 : Math.PI) + (rnd() - 0.5) * 0.05, PAINT[(rnd() * PAINT.length) | 0], 0.9 + rnd() * 0.3, rnd() < 0.3 ? 1.25 : 1]); nCars++; } }
      } else if (!inside && rd > 30 && rd < 650 && nf > 0.58) {
        kind[id] = 2; nField++;
        tile(c.field, c.fieldU, x0, z0, CS, 0.04, 40, 40);
        for (let zz = Math.floor(z0 / 8) * 8 + 4; zz < z0 + CS; zz += 8) { if (zz < z0) continue; for (let xx = x0 + 1.4; xx < x0 + CS; xx += 2.8) if (rnd() < 0.62) { c.cars.push([xx + (rnd() - 0.5) * 0.4, zz + (rnd() - 0.5) * 0.8, (rnd() < 0.5 ? 0 : Math.PI) + (rnd() - 0.5) * 0.25, PAINT[(rnd() * PAINT.length) | 0], 0.9 + rnd() * 0.35, rnd() < 0.35 ? 1.25 : 1]); nCars++; } }
      } else if (gap > 70 && nw > 0.47 - Math.min(0.08, (gap - 70) / 3000) && rnd() < Math.min(1, Math.min(i, j, NX - 1 - i, NZ - 1 - j) / 14)) {   // (thinning out toward the edge of it all)
        kind[id] = 3; nWood++;
        const far = gap > 320, n = far ? 2 + ((rnd() * 3) | 0) : 3 + ((rnd() * 3) | 0);
        for (let k = 0; k < n; k++) plantTree(c, x0 + rnd() * CS, z0 + rnd() * CS, far);
      } else {
        // open ground near the circuit: the fan village spills out over it - people about, marquees, food trucks, the
        // rows of portable toilets - and the odd tree
        if (gap < 150) {
          const r = rnd(), px = x0 + 4 + rnd() * (CS - 8), pz = z0 + 4 + rnd() * (CS - 8), a = rnd() * Math.PI;
          if (r < 0.1) c.kit.push(['tent', px, pz, a, [0xf4f4f2, 0xf4f4f2, 0xd21f2f, 0x1e3a8a, 0xff8000][(rnd() * 5) | 0]]);
          else if (r < 0.16) c.kit.push(['truck', px, pz, a, PAINT[(rnd() * PAINT.length) | 0]]);
          else if (r < 0.2) c.kit.push(['loos', px, pz, a, 0x2a62b8]);
          if (rnd() < 0.7) { const n = 4 + ((rnd() * (gap < 80 ? 22 : 10)) | 0); for (let k = 0; k < n; k++) c.fans.push([x0 + rnd() * CS, 0, z0 + rnd() * CS, rnd() * 6.28, (rnd() * 8) | 0]); }
        }
        if (gap > 50 && rnd() < (inside ? 0.06 : 0.16)) plantTree(c, x0 + rnd() * CS, z0 + rnd() * CS, gap > 320);
      }
    }
    // the ground's own colour, cell by cell (blended between cells) with the dry patches and a little mottling over it
    const CC = new Float32Array(NX * NZ * 3);
    for (let id = 0; id < NX * NZ; id++) { const t = kind[id], g = gapA[id], c = t === 3 ? [0.7, 0.75, 0.62] : t === 2 ? [1.12, 1.03, 0.8] : t === 1 || t === 4 ? [1.0, 0.98, 0.9] : g < 70 ? [0.93, 1.05, 0.88] : [1.04, 1.0, 0.88]; CC.set(c, id * 3); }
    TERRAIN.tint = (x, z) => {
      const fx = Math.max(0, Math.min(NX - 1.001, (x - GX0) / CS - 0.5)), fz = Math.max(0, Math.min(NZ - 1.001, (z - GZ0) / CS - 0.5)), i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, out = [0, 0, 0];
      for (let k = 0; k < 3; k++) { const a = CC[(j * NX + i) * 3 + k], b = CC[(j * NX + i + 1) * 3 + k], c = CC[((j + 1) * NX + i) * 3 + k], d = CC[((j + 1) * NX + i + 1) * 3 + k]; out[k] = (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v; }
      const dry = fbm(x / 130, z / 130, 51), m = 0.9 + 0.2 * fbm(x / 35, z / 35, 61);
      if (dry > 0.55) { const k = Math.min(1, (dry - 0.55) * 7); out[0] += 0.17 * k; out[1] += 0.06 * k; out[2] -= 0.06 * k; }
      return [out[0] * m, out[1] * m, out[2] * m];
    };
    // the textures: a car park's asphalt and its stall lines (one tile: 21.6 x 18 m, eight stalls each side of an
    // aisle), an overflow lot's worn grass and tyre ruts
    const lotTex = (() => {
      const c = document.createElement('canvas'); c.width = 480; c.height = 400; const x = c.getContext('2d'), r2 = rng(5), sx = 480 / 21.6, sz = 400 / 18;
      x.fillStyle = '#8a8c8e'; x.fillRect(0, 0, 480, 400);
      for (let k = 0; k < 5000; k++) { x.fillStyle = r2() < 0.5 ? 'rgba(110,112,114,0.45)' : 'rgba(70,72,75,0.4)'; x.fillRect(r2() * 480, r2() * 400, 2, 2); }
      for (let k = 0; k < 14; k++) { x.fillStyle = 'rgba(40,40,40,0.18)'; x.beginPath(); x.ellipse(r2() * 480, (r2() < 0.5 ? 2.75 : 15.25) * sz, 20, 32, 0, 0, 7); x.fill(); }   // (oil stains in the stalls)
      x.fillStyle = '#ecebe4';
      for (let k = 0; k <= 8; k++) { x.fillRect(k * 2.7 * sx - 1.5, 0, 3, 5.5 * sz); x.fillRect(k * 2.7 * sx - 1.5, 12.5 * sz, 3, 5.5 * sz); }
      x.fillRect(0, 5.5 * sz - 1, 480, 2); x.fillRect(0, 12.5 * sz - 1, 480, 2);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
    })();
    const fieldTex = (() => {
      const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d'), r2 = rng(9);
      x.fillStyle = '#a99c6f'; x.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 6000; k++) { const t2 = r2(); x.fillStyle = t2 < 0.4 ? 'rgba(140,138,84,0.55)' : t2 < 0.75 ? 'rgba(190,172,128,0.5)' : 'rgba(120,110,80,0.45)'; x.fillRect(r2() * 256, r2() * 256, 2 + r2() * 3, 2 + r2() * 3); }
      x.fillStyle = 'rgba(120,104,78,0.35)'; for (let k = 0; k < 256; k += 51) { x.fillRect(0, k + 20, 256, 6); x.fillRect(0, k + 30, 256, 6); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; return t;
    })();
    const lotMat = new THREE.MeshStandardMaterial({ map: lotTex, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const fieldMat = new THREE.MeshStandardMaterial({ map: fieldTex, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    // the cars (a body and a cabin: sedans, and taller pickups and SUVs - this is Texas), the lamp posts, the trees
    const carG = mergeGeometries([new THREE.BoxGeometry(1.85, 0.75, 4.6).translate(0, 0.62, 0), new THREE.BoxGeometry(1.65, 0.62, 2.5).translate(0, 1.3, -0.25)].map((g) => keepPN(g)));
    const poleG = mergeGeometries([new THREE.CylinderGeometry(0.12, 0.18, 12, 6).translate(0, 6, 0), new THREE.BoxGeometry(2.6, 0.3, 0.6).translate(0, 12, 0)].map((g) => keepPN(nonIdx(g))));
    const crownG = (r, x, y, z, sx, sy, sz, detail = 1) => { const g = new THREE.IcosahedronGeometry(r, detail); g.scale(sx, sy, sz); g.translate(x, y, z); const p = g.attributes.position; for (let k = 0; k < p.count; k++) { const f = 0.88 + 0.24 * Math.abs(Math.sin(p.getX(k) * 9 + p.getZ(k) * 7)); p.setXYZ(k, p.getX(k) * f, p.getY(k), p.getZ(k) * f); } return vcolor(nonIdx(g), 0xffffff); };
    const trunk = (h, r) => { const g = new THREE.CylinderGeometry(r * 0.7, r, h, 5, 1, true); g.translate(0, h / 2, 0); return vcolor(nonIdx(g), 0x5b4a38); };
    const shade = (g) => { const p = g.attributes.position, c = g.attributes.color; for (let k = 0; k < p.count; k++) { const f = 0.6 + 0.4 * Math.min(1, Math.max(0, (p.getY(k) - 0.25) / 0.6)); if (c.getX(k) > 0.9) c.setXYZ(k, f, f, f); } return g; };
    const tmerge = (gs) => shade(mergeGeometries(gs.map((g) => { g.deleteAttribute('uv'); return g; })));
    const TREE = {
      oak: tmerge([trunk(0.32, 0.06), crownG(0.42, 0, 0.5, 0, 1.6, 0.55, 1.5), crownG(0.3, 0.38, 0.46, 0.1, 1.2, 0.5, 1.1, 0), crownG(0.3, -0.36, 0.44, -0.12, 1.2, 0.5, 1.1, 0)]),
      elm: tmerge([trunk(0.45, 0.04), crownG(0.3, 0, 0.66, 0, 1.0, 0.85, 1.0), crownG(0.22, 0.15, 0.78, 0.05, 1, 0.9, 1, 0)]),
      juniper: (() => { const c = new THREE.ConeGeometry(0.34, 0.85, 7, 2); c.translate(0, 0.55, 0); return tmerge([trunk(0.2, 0.04), vcolor(nonIdx(c), 0xffffff)]); })(),
      mesquite: tmerge([trunk(0.35, 0.035), crownG(0.28, 0.12, 0.55, 0, 1.4, 0.5, 1.3, 0), crownG(0.24, -0.14, 0.6, 0.06, 1.3, 0.45, 1.2, 0)]),
      far: (() => { const g = new THREE.OctahedronGeometry(0.5, 0); g.scale(1.3, 0.75, 1.2); g.translate(0, 0.5, 0); return tmerge([vcolor(nonIdx(g), 0xffffff)]); })(),   // (far off: eight faces do)
    };
    const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }), carMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.5 }), poleMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.5, metalness: 0.6 });
    const bldMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 });
    const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), col = new THREE.Color();
    const inst = (geo, mat, list, set, name, cut) => { if (!list.length) return; const im = new THREE.InstancedMesh(geo, mat, list.length); list.forEach((e, k) => set(im, e, k)); im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); im.name = name; im.userData.cut = cut; group.add(im); };
    let nTrees = 0;
    for (const c of chunks.values()) {
      const surf = (P, U, mat, name) => { if (!P.length) return; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.computeVertexNormals(); const m = new THREE.Mesh(g, mat); m.name = name; m.userData.cut = 3000; group.add(m); };
      surf(c.lot, c.lotU, lotMat, 'austin:lots'); surf(c.field, c.fieldU, fieldMat, 'austin:fields');
      inst(carG, carMat, c.cars, (im, [x, z, a, hex, s, h], k) => { m4.compose(p3.set(x, 0, z), qt.setFromAxisAngle(up, a), sc.set(1, h, s)); im.setMatrixAt(k, m4); im.setColorAt(k, col.setHex(hex)); }, 'austin:cars', 2200);
      inst(poleG, poleMat, c.poles, (im, [x, z], k) => { m4.compose(p3.set(x, 0, z), qt.identity(), sc.set(1, 1, 1)); im.setMatrixAt(k, m4); }, 'austin:poles', 2200);
      for (const [K, list] of Object.entries(c.trees)) { nTrees += list.length; inst(TREE[K], treeMat, list, (im, [x, z, h, r, hex, wf], k) => { const w = h * (0.9 + rnd() * 0.25) * wf; m4.compose(p3.set(x, 0, z), qt.setFromAxisAngle(up, r), sc.set(w, h, w)); im.setMatrixAt(k, m4); im.setColorAt(k, col.setHex(hex).multiplyScalar(0.88 + rnd() * 0.24)); }, `austin:${K}`, 3200); }
      if (c.fans.length) { const im = fanMesh(c.fans, fest.sheetMat, rnd); im.name = 'austin:fans'; im.userData.cut = 1600; group.add(im); }
      if (c.kit.length) {
        const gk = [];
        for (const [kind2, x, z, a, hex] of c.kit) {
          const put = (g, h2) => gk.push(vcolor(keepPN(nonIdx(g.rotateY(a).translate(x, 0, z))), h2));
          if (kind2 === 'tent') { put(new THREE.BoxGeometry(6, 2.6, 6).translate(0, 1.3, 0), 0xf2f2f0); put(new THREE.ConeGeometry(4.3, 2.2, 4).rotateY(Math.PI / 4).translate(0, 3.7, 0), hex); }
          else if (kind2 === 'truck') { put(new THREE.BoxGeometry(2.5, 3, 6.5).translate(0, 1.6, 0), hex); put(new THREE.BoxGeometry(1.8, 0.12, 6.5).translate(1.9, 2.8, 0), 0xb31942); }
          else for (let k = 0; k < 6; k++) put(new THREE.BoxGeometry(1.2, 2.3, 1.2).translate((k - 2.5) * 1.35, 1.15, 0), hex);
        }
        const m = new THREE.Mesh(mergeGeometries(gk), bldMat); m.name = 'austin:village'; m.userData.cut = 2000; group.add(m);
      }
      if (c.bld.length) {
        const gs2 = [];
        for (const [x, z, w, d, h] of c.bld) { gs2.push(vcolor(keepPN(nonIdx(new THREE.BoxGeometry(w, h, d).translate(x, h / 2 - 0.5, z))), 0xe9e8e3), vcolor(keepPN(nonIdx(new THREE.BoxGeometry(w + 0.6, 0.5, d + 0.6).translate(x, h - 0.25, z))), 0x9aa1a8)); solid.push([x, z, Math.hypot(w, d) / 2 + 2]); }
        const m = new THREE.Mesh(mergeGeometries(gs2), bldMat); m.name = 'austin:sheds'; m.userData.cut = 2600; group.add(m);
      }
    }
    console.info(`[austin] the land: ${nLot} car-park cells, ${nField} overflow-lot cells, ${nWood} scrub cells, ${nCars} parked cars, ${nTrees} trees, the ring road ${(ring.length * 6 / 1000).toFixed(1)} km and ${spokes.length} access roads`);
  }

  // the tower's glass: the rainbow by night, pale by day
  const glow = []; group.traverse((o) => { if (o.material?.userData?.towerGlow) glow.push(o.material); });
  return {
    group, claimed, stands,
    /** something of the scenery standing at (x, z) (where an evening's venue cannot go: main.js footClear) */
    blocked: (x, z) => standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r) || solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r),
    update(t) {
      for (const m of [flagMat, fest.sheetMat, fest.flagMat, fest.usFlag]) { const sh = m?.userData.shader; if (sh) sh.uniforms.uTime.value = t; }
      fest.stageLights.forEach((p, k) => { p.rotation.z = 0.35 * Math.sin(t * 0.9 + k * 1.3); p.rotation.x = 0.3 * Math.sin(t * 0.7 + k * 2.1); });
    },
    setTime(mode) { for (const m of glow) m.emissiveIntensity = mode === 'day' ? 0 : 1.6; fest.stageLights.forEach((p) => { p.visible = mode !== 'day'; }); },
  };
}
