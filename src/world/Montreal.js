// Montreal: everything around the Circuit Gilles Villeneuve that the OpenStreetMap export does not carry. The
// circuit sits on Ile Notre-Dame, a man-made island in the St. Lawrence: the Olympic rowing basin (2.2 km x 110 m)
// along its east side behind the pits and the Casino straight, the Seaway canal beyond it, the lake and its beach
// inside the Senna end of the lap, the Chenal Le Moyne along the west side with wooded Ile Sainte-Hélène across it
// (the Biosphère, Buckminster Fuller's dome of Expo 67), Old Montreal's skyline and Mount Royal to the west, the
// Jacques Cartier Bridge to the north.
//
// The water and the shores are drawn by hand (lon/lat via the anchor below), placed against the buildings the export
// does carry: the pit building (Paddocks), the rowing club's boathouses and finish tower, the beach chalet, the
// Ile Sainte-Hélène pavilions. Also here: the casino (the French and Quebec pavilions of Expo 67), the new pit
// building, the hairpin's screen, the trees (silver and sugar maples, green ash, Lombardy poplars along the basin,
// weeping willows on the shores, white spruce on Sainte-Hélène), the grandstands by their real numbers, and the
// sponsors painted on the grass and the run-offs (Rolex, AWS, Shell, the maple leaf), and the Wall of Champions'
// green strip.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ribbon, corridorSigned } from '../track/TrackBuilder.js';
import { runoffTextTexture } from '../track/Branding.js';
import { footprintInfo } from '../core/GeoLoader.js';
import { extrudeFootprint, makeWindowMaterial } from './Buildings.js';
import { fitRingOutsideCorridor } from './Landmarks.js';

// Hand-drawn shapes are in metres from this anchor (the start node of the circuit's raceway way, just before the last
// chicane), +x east, +z NORTH. L() turns them into the world frame of the loaded circuit.
const ANCHOR = [-73.5236035, 45.5045625];
const KX = 6378137 * Math.PI / 180 * Math.cos(ANCHOR[1] * Math.PI / 180), KZ = 6378137 * Math.PI / 180;

// ---- the water: the river around the islands, the islands as holes in it, the rowing basin and the lake on top --------
// (the rowing basin runs parallel to the pit building, 35 m east of it: x = 88 - 0.213 (z + 190) on its west bank)
const bankW = (z) => 88 - 0.213 * (z + 190);
const BASIN = [[bankW(-880), -880], [bankW(-880) + 110, -880], [bankW(1310) + 110, 1310], [bankW(1310), 1310]];
// the river: between the Montreal shore (Old Port, Cité du Havre) and the South Shore (the Seaway's dike)
const shoreE = (z) => 400 - 0.213 * (z + 190);
const RIVER = [[-2700, -2800], [-2050, -1300], [-1480, -700], [-1700, -520], [-1880, -60], [-1960, 600], [-1880, 1250], [-1760, 1950], [-1560, 2650], [-1250, 3400],
  [150, 3700], [520, 3100], [shoreE(1900) + 40, 1900], [shoreE(1400), 1400], [shoreE(700), 700], [shoreE(0), 0], [shoreE(-900), -900], [700, -1500], [1000, -2800]];
// Ile Notre-Dame: the east shore is the strip between the basin and the Seaway (50 m), then round the Senna end, the west
// shore along the Chenal Le Moyne and the north tip past the rowing club
const eastND = (z) => bankW(z) + 160;
const NOTRE_DAME = [[eastND(1450), 1450], [eastND(700), 700], [eastND(0), 0], [eastND(-900), -900], [300, -965], [150, -968], [0, -930], [-160, -840], [-300, -670], [-430, -430],
  [-528, -200], [-548, 0], [-545, 300], [-522, 430], [-405, 620], [-372, 800], [-376, 1000], [-382, 1250], [-405, 1450], [-260, 1520]];
// Ile Sainte-Hélène (the Biosphère, the Jean-Drapeau metro, the aquatic centre, the Tour de Lévis on its hill)
const STE_HELENE = [[-545, 1700], [-545, 1300], [-547, 1050], [-572, 850], [-648, 600], [-702, 400], [-704, 200], [-722, 0], [-800, -240], [-950, -360],
  [-1150, -210], [-1100, 300], [-1050, 800], [-1010, 1200], [-960, 1520], [-900, 1820], [-760, 2010], [-610, 1960]];
// Lac de l'Ile Notre-Dame (the swimming lake: the beach at its south-east end, the nautical pavilion on its west shore)
const LAKE = [[-30, -390], [-120, -363], [-190, -404], [-198, -470], [-172, -545], [-130, -640], [-80, -690], [-40, -700], [-15, -650], [-10, -520], [-20, -430]];
const BEACH = [[-80, -690], [-40, -700], [-15, -650], [12, -676], [-14, -744], [-96, -730], [-132, -660]];
// the paddock: the asphalt between the pit building and the basin (motorhomes, hospitality)
const PADDOCK = [[bankW(-170) - 33, -170], [bankW(-170) - 3, -170], [bankW(-560) - 3, -560], [bankW(-560) - 33, -560]];

// ---- grandstands, by their real numbers: on a side of the track at a corner (side +1 left / -1 right of the racing
//      direction), or explicitly (at: the front edge's midpoint, face: the point the seats look at)
const STANDS = [
  { name: 'Grandstand 1 (Gold)', s: 30, side: -1, len: 190, tiers: 16 },          // the pit straight, facing the garages
  { name: 'Platinum', turn: 14, along: 55, side: -1, len: 90, tiers: 14 },          // behind the Wall of Champions
  { name: 'Grandstand 11', turn: 1, along: -150, side: -1, len: 80, tiers: 16 },    // the Senna S: down the approach ...
  { name: 'Grandstand 12', turn: 2, along: 150, side: 1, len: 70, tiers: 14 },       // ... and round the outside of the exit
  { name: 'Grandstand 15', turn: 2, along: 70, side: 1, len: 90, tiers: 14 },
  { name: 'Grandstand 21', turn: 3, along: -50, side: 1, len: 70, tiers: 12 },
  { name: 'Grandstand 24', turn: 6, along: -45, side: -1, len: 64, tiers: 12 },
  { name: 'Grandstand 31', turn: 8, along: -90, side: 1, len: 90, tiers: 14 },
  { name: 'Grandstand 33', turn: 9, along: 60, side: 1, len: 70, tiers: 12 },
  { name: 'Grandstand 34', turn: 9, along: 140, side: -1, len: 80, tiers: 12 },
  { name: 'Grandstand 46', turn: 10, along: -170, side: 1, len: 100, tiers: 14 },   // the hairpin: the approach ...
  { name: 'Grandstand 47', turn: 10, along: 245, side: 1, len: 150, tiers: 18 },    // ... the big covered stand along the exit, by the basin
  { name: 'Grandstand 47B', turn: 10, along: 420, side: 1, len: 120, tiers: 11 },
  { name: 'Hairpin infield', at: [-232, 655], face: [-262, 1000], len: 110, tiers: 16 },   // between the straights, looking up at L'Epingle
];

// ---- paint on the grass and the run-offs (TV logos): at a corner (along = metres from its apex, side, lateral = metres
//      beyond the kerb to the near edge), w across x l along the track
const ADS = [
  { logo: 'dhl', turn: 1, along: -55, side: 1, lateral: 5, w: 13, l: 38 },       // the lawn inside the Senna S
  { logo: 'dhl', turn: 2, along: 30, side: -1, lateral: 5, w: 10, l: 28 },
  { logo: 'aws', turn: 1, along: -20, side: -1, lateral: 6, w: 16, l: 30 },      // the T1 escape area
  { logo: 'rolex', turn: 8, along: -18, side: -1, lateral: 3, w: 16, l: 30 },     // inside T8, the Biosphère behind it
  { logo: 'pzero', turn: 10, along: 5, side: -1, lateral: 2.5, w: 11, l: 34 },    // the hairpin's black-painted infield
  { logo: 'aws', turn: 10, along: 25, side: 1, lateral: 8, w: 18, l: 34 },        // ... and its escape area
  { logo: 'shell', turn: 13, along: 8, side: 1, lateral: 4, w: 16, l: 18 },       // the last chicane's escape road
  { logo: 'shell', turn: 13, along: -55, side: -1, lateral: 2.5, w: 12, l: 13 },  // ... and the grass before it
  { logo: 'canada', turn: 5, along: 0, side: 1, lateral: 3, w: 9, l: 34 },
  { logo: 'rolex', turn: 6, along: 10, side: 1, lateral: 3, w: 11, l: 22 },
  { logo: 'maple', turn: 3, along: 10, side: -1, lateral: 4, w: 14, l: 16 },
];

// ---- trees: species (unit-height model built once) and where they grow
const SPECIES = {
  maple: { h: [13, 20], col: [0x3f6b2a, 0x4d7a2f, 0x5a8634, 0x355f25] },   // silver / sugar / Norway maple
  ash: { h: [11, 16], col: [0x6a8f3a, 0x7a9c45, 0x5f8536] },               // green ash, honey locust: airy, pale
  poplar: { h: [19, 26], col: [0x4a7a34, 0x55843a, 0x3f6e2e] },            // Lombardy poplar: the columns along the basin
  willow: { h: [9, 14], col: [0x8fae4a, 0x9cb955, 0x86a444] },             // weeping willow, on the shores
  spruce: { h: [12, 21], col: [0x2c4a33, 0x30513a, 0x274430] },            // white spruce, on Sainte-Hélène's hill
};

/** trees nearer the camera than TREE_NEAR (m) get the detailed model; the split is redone every TREE_STEP of camera travel */
const TREE_NEAR = 300, TREE_STEP = 30;

// ---------------------------------------------------------------------------------------------------------------------
const rnd = (() => { let s = 1234567; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
const hash2 = (x, z) => { const h = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return h - Math.floor(h); };
/** smooth value noise in [0, 1] at cell size c (clumps of trees, glades) */
function vnoise(x, z, c) {
  const u = x / c, v = z / c, i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j, su = fu * fu * (3 - 2 * fu), sv = fv * fv * (3 - 2 * fv);
  const a = hash2(i, j), b = hash2(i + 1, j), cc = hash2(i, j + 1), d = hash2(i + 1, j + 1);
  return a + (b - a) * su + (cc - a) * sv + (a - b - cc + d) * su * sv;
}
function inRing(x, z, r) {
  let hit = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) if ((r[i][1] > z) !== (r[j][1] > z) && x < (r[j][0] - r[i][0]) * (z - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) hit = !hit;
  return hit;
}
function distToRing(x, z, r) {
  let best = Infinity;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const ax = r[j][0], az = r[j][1], bx = r[i][0], bz = r[i][1], dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L2)); best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return best;
}
/** flat polygon (outer ring + holes, world [x, z]) at height y */
function flat(outer, holes, y) {
  const shape = new THREE.Shape(outer.map((p) => new THREE.Vector2(p[0], -p[1])));
  for (const h of holes) shape.holes.push(new THREE.Path(h.map((p) => new THREE.Vector2(p[0], -p[1]))));
  const g = new THREE.ShapeGeometry(shape, 1); g.rotateX(-Math.PI / 2); g.translate(0, y, 0);
  const p = g.attributes.position, uv = g.attributes.uv; for (let k = 0; k < p.count; k++) uv.setXY(k, p.getX(k) / 40, p.getZ(k) / 40);
  return g;
}
/** a strip `w` wide just inside a closed ring (stone banks, sand edges), world coordinates */
function edgeStrip(ring, w, y) {
  const pos = [], idx = [], n = ring.length; let cx = 0, cz = 0; for (const p of ring) { cx += p[0]; cz += p[1]; } cx /= n; cz /= n;
  let area = 0; for (let i = 0; i < n; i++) { const a = ring[i], b = ring[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
  const sgn = area > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const a = ring[(i - 1 + n) % n], p = ring[i], b = ring[(i + 1) % n];
    let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    const nx = -tz * sgn, nz = tx * sgn;   // inward normal
    pos.push(p[0], y, p[1], p[0] + nx * w, y, p[1] + nz * w);
  }
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; idx.push(i * 2, j * 2, i * 2 + 1, i * 2 + 1, j * 2, j * 2 + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const nr = g.attributes.normal; for (let k = 0; k < nr.count; k++) nr.setXYZ(k, 0, 1, 0);
  return g;
}
/** densify a ring to `step` metres (shores read as curves, not as polygons) and round its corners */
function smoothRing(r, step = 25, passes = 2) {
  let out = [];
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length], d = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(d / step)); for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); }
  for (let p = 0; p < passes; p++) out = out.map((q, i) => { const a = out[(i - 1 + out.length) % out.length], b = out[(i + 1) % out.length]; return [(a[0] + 2 * q[0] + b[0]) / 4, (a[1] + 2 * q[1] + b[1]) / 4]; });
  return out;
}
function canvasTex(c, repeat = false) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
const vcolor = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); if (g.attributes.uv) g.deleteAttribute('uv'); return g; };
const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);

// ---- the water's surface: a slow ripple normal map, the colour of the St. Lawrence by day, black glass at night
function rippleTexture() {
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'), img = x.createImageData(S, S), d = img.data;
  const h = new Float32Array(S * S);
  for (let k = 0; k < 6; k++) { const fx = (1 + k * 2) * 2 * Math.PI / S, fz = (2 + k) * 2 * Math.PI / S, ph = rnd() * 6.28, a = 1 / (1 + k); for (let i = 0; i < S * S; i++) { const u = i % S, v = (i / S) | 0; h[i] += a * Math.sin(u * fx + v * fz * (k % 2 ? 1 : -1) + ph); } }
  for (let i = 0; i < S * S; i++) {
    const u = i % S, v = (i / S) | 0, dx = h[v * S + ((u + 1) % S)] - h[v * S + ((u - 1 + S) % S)], dz = h[((v + 1) % S) * S + u] - h[((v - 1 + S) % S) * S + u];
    const nx = -dx * 0.6, nz = -dz * 0.6, l = Math.hypot(nx, nz, 1); d[i * 4] = (nx / l * 0.5 + 0.5) * 255; d[i * 4 + 1] = (nz / l * 0.5 + 0.5) * 255; d[i * 4 + 2] = (1 / l * 0.5 + 0.5) * 255; d[i * 4 + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); return t;
}

// ---- the paint on the grass ------------------------------------------------------------------------------------------
function shellPath(x, cx, cy, r) {   // the pecten: a fan of ribs on a scalloped edge
  x.beginPath(); x.moveTo(cx - r * 0.42, cy + r * 0.72);
  for (let k = 0; k <= 7; k++) { const a = Math.PI * (1.08 + k * 0.84 / 7) - 0.0; const px = cx + Math.cos(a) * r, py = cy + 0.15 * r + Math.sin(a) * r; x.quadraticCurveTo(cx + Math.cos(a - 0.06) * r * 1.08, cy + 0.15 * r + Math.sin(a - 0.06) * r * 1.08, px, py); }
  x.lineTo(cx + r * 0.42, cy + r * 0.72); x.lineTo(cx + r * 0.25, cy + r * 0.92); x.lineTo(cx - r * 0.25, cy + r * 0.92); x.closePath();
}
function adTexture(logo) {
  const W = 512, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  // drawn across: the logo reads along the track's length (v), the canvas is portrait (u across, v along)
  x.translate(0, H); x.scale(1, -1);   // (seen from above the decal's v runs against the canvas's y: unmirrored)
  x.translate(W / 2, H / 2); x.rotate(-Math.PI / 2); x.translate(-H / 2, -W / 2);   // now draw in an H x W landscape box
  const LW = H, LH = W;
  const grassy = (ctx) => { for (let i = 0; i < 2600; i++) { ctx.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.06})`; ctx.fillRect(rnd() * LW, rnd() * LH, 2, 4 + rnd() * 6); } };   // the turf shows through the paint
  if (logo === 'rolex') {
    x.fillStyle = '#0a6b3d'; x.beginPath(); x.roundRect?.(8, 8, LW - 16, LH - 16, 30); if (!x.roundRect) x.rect(8, 8, LW - 16, LH - 16); x.fill();
    x.fillStyle = '#c9a43b'; const cx = LW * 0.5, cy = LH * 0.38, h = LH * 0.42, w = h * 1.3;
    x.beginPath(); x.moveTo(cx - w * 0.42, cy + h * 0.32); x.lineTo(cx - w * 0.5, cy - h * 0.18);
    for (let k = 0; k < 5; k++) { const px = cx - w * 0.5 + k * w * 0.25; x.lineTo(px + w * 0.06, cy - h * 0.05); x.lineTo(px + w * 0.125, cy - h * (k === 2 ? 0.5 : 0.36)); }
    x.lineTo(cx + w * 0.42, cy + h * 0.32); x.closePath(); x.fill();
    for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(cx - w * 0.375 + k * w * 0.25 - w * 0.0, cy - h * (k === 2 ? 0.58 : 0.44), h * 0.07, 0, 7); x.fill(); }
    x.font = `700 ${LH * 0.2}px Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; try { x.letterSpacing = '18px'; } catch (e) { /* */ }
    x.fillText('ROLEX', LW * 0.5, LH * 0.8);
  } else if (logo === 'aws') {
    x.fillStyle = '#1f3c88'; x.beginPath(); x.ellipse(LW / 2, LH / 2, LW * 0.48, LH * 0.46, 0, 0, 7); x.fill();
    x.lineWidth = 18; x.strokeStyle = '#c9d93a'; x.setLineDash([46, 46]); x.stroke(); x.setLineDash([]); x.lineWidth = 8; x.strokeStyle = '#3fae5a'; x.stroke();
    x.fillStyle = '#ffffff'; x.font = `800 ${LH * 0.5}px Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('aws', LW * 0.45, LH * 0.44);
    x.strokeStyle = '#ffffff'; x.lineWidth = LH * 0.07; x.lineCap = 'round'; x.beginPath(); x.moveTo(LW * 0.28, LH * 0.72); x.quadraticCurveTo(LW * 0.48, LH * 0.88, LW * 0.68, LH * 0.66); x.stroke();
    x.beginPath(); x.moveTo(LW * 0.62, LH * 0.64); x.lineTo(LW * 0.69, LH * 0.65); x.lineTo(LW * 0.67, LH * 0.72); x.stroke();
  } else if (logo === 'shell') {
    const r = LH * 0.44; shellPath(x, LW / 2, LH * 0.47, r); x.fillStyle = '#dd1d21'; x.fill();
    shellPath(x, LW / 2, LH * 0.5, r * 0.82); x.fillStyle = '#fbce07'; x.fill();
    x.strokeStyle = '#dd1d21'; x.lineWidth = 9; for (let k = 0; k < 7; k++) { const a = Math.PI * (1.15 + k * 0.7 / 6); x.beginPath(); x.moveTo(LW / 2, LH * 0.86); x.lineTo(LW / 2 + Math.cos(a) * r * 0.78, LH * 0.62 + Math.sin(a) * r * 0.78); x.stroke(); }
  } else if (logo === 'maple') {
    const P = [[0, -1], [0.14, -0.72], [0.3, -0.8], [0.25, -0.38], [0.52, -0.62], [0.58, -0.48], [0.86, -0.54], [0.76, -0.24], [0.9, -0.16], [0.46, 0.2], [0.52, 0.36], [0.06, 0.3], [0.08, 0.78], [-0.08, 0.78], [-0.06, 0.3], [-0.52, 0.36], [-0.46, 0.2], [-0.9, -0.16], [-0.76, -0.24], [-0.86, -0.54], [-0.58, -0.48], [-0.52, -0.62], [-0.25, -0.38], [-0.3, -0.8], [-0.14, -0.72]];
    x.fillStyle = '#d52b1e'; x.beginPath(); P.forEach(([px, py], k) => (k ? x.lineTo : x.moveTo).call(x, LW / 2 + px * LH * 0.48, LH * 0.5 + py * LH * 0.48)); x.closePath(); x.fill();
  } else if (logo === 'dhl') {   // the yellow block, the red italic letters with their speed lines
    x.fillStyle = '#ffcc00'; x.fillRect(10, LH * 0.12, LW - 20, LH * 0.76);
    x.fillStyle = '#d40511'; x.save(); x.transform(1, 0, -0.22, 1, LH * 0.1, 0); x.font = `900 italic ${LH * 0.56}px Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('DHL', LW * 0.5, LH * 0.52);
    for (let k = 0; k < 3; k++) { x.fillRect(LW * 0.06, LH * (0.36 + k * 0.12), LW * 0.18, LH * 0.05); x.fillRect(LW * 0.76, LH * (0.36 + k * 0.12), LW * 0.18, LH * 0.05); }
    x.restore();
  } else if (logo === 'pzero') {   // black paint, the yellow P ZERO
    x.fillStyle = '#111214'; x.beginPath(); x.ellipse(LW / 2, LH / 2, LW * 0.49, LH * 0.47, 0, 0, 7); x.fill();
    x.fillStyle = '#ffd500'; x.font = `900 ${LH * 0.38}px Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; try { x.letterSpacing = '24px'; } catch (e) { /* */ } x.fillText('P ZERO', LW * 0.5, LH * 0.52);
  } else if (logo === 'canada') {
    x.fillStyle = '#ffffff'; x.font = `900 ${LH * 0.42}px Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; try { x.letterSpacing = '22px'; } catch (e) { /* */ } x.fillText('CANADA', LW * 0.5, LH * 0.52);
  }
  if (logo !== 'canada') grassy(x);
  return canvasTex(c);
}

// ---------------------------------------------------------------------------------------------------------------------
/**
 * @returns { group, claimed:Set<id>, stands:[fixed grandstand placements for Grandstands.js], update(t), setTime(mode) }
 */
export function buildMontreal(geo, track, def, pit) {
  const group = new THREE.Group(); group.name = 'montreal';
  const claimed = new Set();
  const [ax, az] = geo.proj.toXZ(ANCHOR[0], ANCHOR[1]);
  const L = (p) => { const [x, z] = geo.proj.toXZ(ANCHOR[0] + p[0] / KX, ANCHOR[1] + p[1] / KZ); return [x, z]; };
  const LR = (r) => r.map(L);
  const tr = track, hw = tr.halfWidth, kw = tr.kerbWidth;
  const cornerS = (n) => def.corners.find((c) => c.n === n)?.s;
  void ax; void az;

  // ---- water and shores ---------------------------------------------------------------------------------------------
  const river = LR(smoothRing(RIVER, 60, 3)), notreDame = LR(smoothRing(NOTRE_DAME, 25, 3)), steHelene = LR(smoothRing(STE_HELENE, 30, 3));
  const basin = LR(BASIN), lake = LR(smoothRing(LAKE, 12, 3)), beach = LR(smoothRing(BEACH, 12, 2)), paddock = LR(PADDOCK);
  const ripple = rippleTexture(); ripple.repeat.set(1, 1);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d6f86, roughness: 0.12, metalness: 0.35, normalMap: ripple, normalScale: new THREE.Vector2(0.35, 0.35), envMapIntensity: 1.25,
    polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 4 });
  waterMat.userData.timeSkip = true;
  const waters = [flat(river, [notreDame, steHelene], -0.02), flat(basin, [], -0.02), flat(lake, [], -0.02)];
  const water = new THREE.Mesh(mergeGeometries(waters), waterMat); water.name = 'mtl:water'; water.renderOrder = 1; group.add(water);
  // stone banks (rip-rap) along every shore, sand at the beach, the paddock's asphalt
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8b877c, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 3 });
  group.add(new THREE.Mesh(mergeGeometries([edgeStrip(notreDame, -4, -0.015), edgeStrip(steHelene, -4, -0.015), edgeStrip(basin, 3, -0.015), edgeStrip(lake, 2, -0.015)].map((g) => { g.deleteAttribute('normal'); g.computeVertexNormals(); const n = g.attributes.normal; for (let k = 0; k < n.count; k++) n.setXYZ(k, 0, 1, 0); return g; })), stoneMat));
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xd9c49a, roughness: 1, polygonOffset: true, polygonOffsetFactor: 3, polygonOffsetUnits: 6 });
  group.add(new THREE.Mesh(flat(beach, [], -0.03), sandMat));
  const tarmac = new THREE.MeshStandardMaterial({ color: 0x55585e, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 });
  group.add(new THREE.Mesh(flat(paddock, [], -0.01), tarmac));
  const isWater = (x, z) => inRing(x, z, basin) || inRing(x, z, lake) || (inRing(x, z, river) && !inRing(x, z, notreDame) && !inRing(x, z, steHelene));
  const shoreDist = (x, z) => Math.min(distToRing(x, z, notreDame), distToRing(x, z, steHelene), distToRing(x, z, basin), distToRing(x, z, lake));

  // ---- the buildings the export carries, made into what they are --------------------------------------------------
  const solid = [];   // [x, z, r, small building's id | null, footprint ring | null]: what the stands and the trees keep clear of
  /** the solid thing at (x, z), `pad` metres around it (a footprint's ring when it has one, else its circle) */
  const hitSolid = (x, z, pad, bigOnly = false) => solid.find(([sx, sz, r, small, ring]) => (!bigOnly || !small) && (ring ? (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2 && (inRing(x, z, ring) || distToRing(x, z, ring) < pad) : (sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2));
  const byId = (id) => geo.buildings.find((b) => b.id === id);
  const metal = new THREE.MeshStandardMaterial({ color: 0xd6dade, roughness: 0.35, metalness: 0.7, emissive: 0x15171a });
  const white = new THREE.MeshStandardMaterial({ color: 0xf0f2f4, roughness: 0.5, metalness: 0.1, emissive: 0x18191c });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1c2a36, roughness: 0.08, metalness: 0.8, envMapIntensity: 1.5, emissive: 0x2a3644, emissiveIntensity: 0.8 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe0b75a, roughness: 0.3, metalness: 0.6, envMapIntensity: 1.6, emissive: 0x3a2c10 });

  // the Biosphère: a 76 m geodesic sphere, 62 m tall (three-quarters of a sphere above the ground), Fuller's double
  // layer of struts: two lattices, drawn as the edges of an icosphere in the fragment shader (see-through, no struts)
  const bio = byId('way/26288030');
  if (bio) {
    claimed.add(bio.id);
    const info = footprintInfo(bio.rings[0]), R = 38, cy = 62 - R;
    const latticeMat = (alpha) => {
      const m = new THREE.MeshStandardMaterial({ color: 0xc9ced4, roughness: 0.35, metalness: 0.75, side: THREE.DoubleSide, transparent: true, depthWrite: false, opacity: alpha, emissive: 0x202428 });
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 aBary; varying vec3 vBary;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvBary = aBary;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vBary;')
          .replace('#include <alphatest_fragment>', '#include <alphatest_fragment>\n{ vec3 w = fwidth(vBary); vec3 e = smoothstep(vec3(0.0), w * 1.6, vBary); float edge = 1.0 - min(min(e.x, e.y), e.z); if (edge < 0.05) discard; diffuseColor.a *= edge; }');
      };
      m.customProgramCacheKey = () => `bio${alpha}`;
      return m;
    };
    const shell = (r, detail) => { const g = nonIdx(new THREE.IcosahedronGeometry(r, detail)); const n = g.attributes.position.count, b = new Float32Array(n * 3); for (let i = 0; i < n; i++) b[i * 3 + (i % 3)] = 1; g.setAttribute('aBary', new THREE.BufferAttribute(b, 3)); return g; };
    const dome = new THREE.Group(); dome.name = 'mtl:biosphere';
    const outer = new THREE.Mesh(shell(R, 9), latticeMat(1)); outer.position.set(info.c[0], cy, info.c[1]); outer.rotation.y = 0.3;
    const inner = new THREE.Mesh(shell(R - 1.6, 5), latticeMat(0.85)); inner.position.copy(outer.position); inner.rotation.y = 0.9;
    // the museum inside (the 1990s building on its platforms) and a pale skin where the acrylic panels burned in 1976
    const core = new THREE.Mesh(new THREE.CylinderGeometry(18, 22, 20, 18), white); core.position.set(info.c[0], 10, info.c[1]);
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(30, 30, 1.2, 28), metal); deck.position.set(info.c[0], 21, info.c[1]);
    dome.add(core, deck, outer, inner); outer.renderOrder = 3; inner.renderOrder = 3;
    group.add(dome); solid.push([info.c[0], info.c[1], 45]);
  }

  // the casino: the French pavilion (white aluminium fins round a glass body, terraces stepping up) and the Quebec
  // pavilion (a gold glass cube) of Expo 67, joined
  const fr = byId('way/26698931'), qc = byId('way/439917766');
  if (fr || qc) {
    const cas = new THREE.Group(); cas.name = 'mtl:casino';
    if (fr) {
      claimed.add(fr.id); const ring = fr.rings[0], info = footprintInfo(ring);
      const body = new THREE.Mesh(extrudeFootprint([ring], 22), glass); body.geometry.computeVertexNormals(); cas.add(body);
      // the fins: aluminium blades on the perimeter, leaning out, every 2.6 m
      const fins = [];
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i], b = ring[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(len / 2.6)), ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
        for (let j = 0; j < k; j++) {
          const t = (j + 0.5) / k, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t, ox = x - info.c[0], oz = z - info.c[1], ol = Math.hypot(ox, oz) || 1;
          const g = new THREE.BoxGeometry(0.35, 30, 2.4); g.translate(0, 15, 0); g.rotateZ(-0.08); g.rotateY(ang + Math.PI / 2); g.translate(x + ox / ol * 1.5, 0, z + oz / ol * 1.5); fins.push(g);
        }
      }
      if (fins.length) cas.add(new THREE.Mesh(mergeGeometries(fins), metal));
      for (const [y, s] of [[8, 1.08], [15, 1.04], [22, 0.94]]) {   // the terraces' white slabs
        const r2 = ring.map((p) => [info.c[0] + (p[0] - info.c[0]) * s, info.c[1] + (p[1] - info.c[1]) * s]);
        const slab = new THREE.Mesh(extrudeFootprint([r2], 0.9, y), white); slab.geometry.computeVertexNormals(); cas.add(slab);
      }
      solid.push([info.c[0], info.c[1], Math.max(info.length, info.width) / 2 + 10, null, ring]);
    }
    if (qc) {
      claimed.add(qc.id); const ring = qc.rings[0], info = footprintInfo(ring);
      const cube = new THREE.Mesh(extrudeFootprint([ring], 26), gold); cube.geometry.computeVertexNormals(); cas.add(cube);
      solid.push([info.c[0], info.c[1], Math.max(info.length, info.width) / 2 + 10, null, ring]);
    }
    group.add(cas);
  }

  // the pit building (2019): a long two-storey white block with dark glass, the Paddock Club on its roof under a canopy
  const pb = byId('way/42229671');
  if (pb) {
    claimed.add(pb.id);
    const ring = fitRingOutsideCorridor(pb.rings[0], track, pit, 2), info = footprintInfo(ring);
    const pg = new THREE.Group(); pg.name = 'mtl:pits';
    const body = new THREE.Mesh(extrudeFootprint([ring], 9), white); body.geometry.computeVertexNormals(); pg.add(body);
    const grow = (s) => ring.map((p) => [info.c[0] + (p[0] - info.c[0]) * s, info.c[1] + (p[1] - info.c[1]) * (1 + (s - 1) * 4)]);
    const band = new THREE.Mesh(extrudeFootprint([grow(1.003)], 3.2, 4.6), glass); band.geometry.computeVertexNormals(); pg.add(band);
    const club = new THREE.Mesh(extrudeFootprint([grow(0.98)], 4, 9), glass); club.geometry.computeVertexNormals(); pg.add(club);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(info.length * 1.02, 0.6, info.width * 1.5), white);
    roof.rotation.y = -info.angle; roof.position.set(info.c[0], 14.2, info.c[1]); pg.add(roof);
    const posts = []; for (let u = -0.48; u <= 0.481; u += 0.08) { const g = new THREE.CylinderGeometry(0.25, 0.25, 5.2, 6); g.translate(info.c[0] + Math.cos(info.angle) * info.length * u, 11.6, info.c[1] + Math.sin(info.angle) * info.length * u); posts.push(g); }
    pg.add(new THREE.Mesh(mergeGeometries(posts), metal));
    group.add(pg); solid.push([info.c[0], info.c[1], info.length / 2 + 15, null, ring]);
  }

  // the Tour de Lévis: the stone water tower of 1936 on Sainte-Hélène's hill, 30 m, with its look-out
  const lev = byId('way/433277863');
  if (lev) {
    claimed.add(lev.id); const info = footprintInfo(lev.rings[0]);
    const stone = new THREE.MeshStandardMaterial({ color: 0x9b8f7e, roughness: 0.95 });
    const t = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 7.2, 28, 16), stone); t.position.set(info.c[0], 14, info.c[1]);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(7.6, 6.4, 3, 16), stone); crown.position.set(info.c[0], 29.5, info.c[1]);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(6.5, 6, 16), new THREE.MeshStandardMaterial({ color: 0x4a5d52, roughness: 0.7, metalness: 0.4 })); cap.position.set(info.c[0], 34, info.c[1]);
    const lt = new THREE.Group(); lt.name = 'mtl:levis'; lt.add(t, crown, cap); group.add(lt); solid.push([info.c[0], info.c[1], 12]);
  }
  // every other footprint; the small ones (kiosks, toilets, sheds under 16 m) give way to a grandstand (and are not built)
  for (const b of geo.buildings) { if (claimed.has(b.id) || !b.rings[0]) continue; const info = footprintInfo(b.rings[0]), big = Math.max(info.length, info.width); solid.push([info.c[0], info.c[1], big / 2 + 5, big < 16 ? b.id : null, b.rings[0]]); }

  // ---- the hairpin's giant screen: a red lattice tower in the infield, the screen facing the stands to the south ----
  {
    const s10 = cornerS(10);
    if (s10 != null) {
      // the infield: from the apex toward the middle of the two straights 150 m back
      const a = tr.sample(s10 - 150, 0), b = tr.sample(s10 + 150, 0), mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, apex = tr.sample(s10, 0);
      let dx = mx - apex.x, dz = mz - apex.z; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      // up the infield from the apex until the pole stands clear of both walls (the screen up on it can overhang them)
      let px = null, pz = null;
      for (let u = 10; u < 260 && px == null; u += 4) { const x = apex.x + dx * u, z = apex.z + dz * u; if (corridorSigned(tr, pit, x, z, 1.5) > 1.2) { px = x; pz = z; } }
      if (px != null) {
        const red = new THREE.MeshStandardMaterial({ color: 0xc8202a, roughness: 0.5, metalness: 0.3 });
        const sc = new THREE.Group(); sc.name = 'mtl:screen';
        const mast = new THREE.Mesh(new THREE.BoxGeometry(1.6, 16, 1.6), red); mast.position.set(0, 8, 0); sc.add(mast);
        const frame = new THREE.Mesh(new THREE.BoxGeometry(13, 8, 0.8), red); frame.position.set(0, 20, 0); sc.add(frame);
        const c = document.createElement('canvas'); c.width = 512; c.height = 300; const x = c.getContext('2d');
        x.fillStyle = '#05070c'; x.fillRect(0, 0, 512, 300); x.fillStyle = '#e10600'; x.fillRect(0, 0, 512, 46);
        x.fillStyle = '#fff'; x.font = '900 34px Arial'; x.fillText('GRAND PRIX DU CANADA', 16, 34);
        ['VER', 'NOR', 'LEC', 'RUS', 'HAM', 'PIA', 'ALO', 'STR'].forEach((n, i) => { x.fillStyle = i % 2 ? '#141a26' : '#0c111a'; x.fillRect(0, 52 + i * 30, 512, 30); x.fillStyle = '#fff'; x.font = '700 22px Arial'; x.fillText(`${i + 1}  ${n}`, 20, 74 + i * 30); x.fillStyle = '#ffd400'; x.fillText(i ? `+${(i * 1.37).toFixed(3)}` : 'LEADER', 380, 74 + i * 30); });
        const tex = canvasTex(c);
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshBasicMaterial({ map: tex })); panel.position.set(0, 20, 0.45); sc.add(panel);
        sc.position.set(px, 0, pz); sc.rotation.y = Math.atan2(dx, dz);   // the screen's face (+z) looks away from the apex, at the stands
        group.add(sc); solid.push([px, pz, 10]);
      }
    }
  }

  // ---- distant: Old Montreal's and downtown's towers, Mount Royal and its cross, Habitat 67, the Jacques Cartier Bridge
  {
    const sky = []; const winMat = makeWindowMaterial({ base: 0x56606c, litProb: 0.3, cellW: 3.2, cellH: 3.6, useVertexColor: true });
    const tower = (ll, w, d, h, rot = 0, tint = 1) => { const [x, z] = geo.proj.toXZ(ll[0], ll[1]); const g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0); g.rotateY(rot); g.translate(x, 0, z); vcolor(g, new THREE.Color(tint, tint, tint * 1.04)); sky.push(nonIdx(g)); return [x, z]; };
    // the named ones (lon, lat): Place Ville Marie's cross, 1000 de La Gauchetière (its copper roof below), 1250
    // René-Lévesque, Tour de la Bourse, the CIBC tower, Tour Deloitte, Victoria sur le Parc
    tower([-73.5693, 45.5017], 60, 18, 188, 0.6); tower([-73.5693, 45.5017], 18, 60, 188, 0.6, 0.95);
    const gau = tower([-73.5631, 45.4985], 44, 44, 182, 0.2, 1.1);
    tower([-73.5703, 45.4980], 42, 34, 199, 0.5, 0.9); tower([-73.5605, 45.5005], 38, 38, 190, 0.6, 0.55); tower([-73.5716, 45.4999], 34, 34, 187, 0.6, 0.7);
    tower([-73.5665, 45.4975], 36, 30, 145, 0.6, 1.05); tower([-73.5617, 45.5005], 30, 30, 170, 0.6, 0.8);
    for (let k = 0; k < 60; k++) {   // the rest of downtown and Old Montreal: lower toward the river
      const lon = -73.5525 - rnd() * 0.026, lat = 45.4955 + rnd() * 0.0135, near = Math.max(0, Math.min(1, (-73.5525 - lon) / 0.026));
      tower([lon, lat], 18 + rnd() * 26, 18 + rnd() * 26, 20 + near * (40 + rnd() * 120) + rnd() * 20, 0.6 + (rnd() - 0.5) * 0.2, 0.75 + rnd() * 0.4);
    }
    const city = new THREE.Mesh(mergeGeometries(sky), winMat); city.name = 'mtl:skyline'; group.add(city);
    const copper = new THREE.Mesh(new THREE.ConeGeometry(31, 24, 4), new THREE.MeshStandardMaterial({ color: 0x4f8d79, roughness: 0.6, metalness: 0.5 })); copper.position.set(gau[0], 194, gau[1]); copper.rotation.y = Math.PI / 4 + 0.2; group.add(copper);
    // Mount Royal: 233 m, its east summit with the illuminated cross (placed a little in from its true 5 km, inside the sky)
    const [mx0, mz0] = geo.proj.toXZ(-73.5878, 45.5045), ox = geo.proj.toXZ(-73.5236, 45.5045);
    const dirx = mx0 - ox[0], dirz = mz0 - ox[1], dl = Math.hypot(dirx, dirz) || 1, Rm = Math.min(dl, 4300);
    const mx = ox[0] + dirx / dl * Rm, mz = ox[1] + dirz / dl * Rm;
    const hill = new THREE.SphereGeometry(1, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2); hill.scale(1300, 230, 900); hill.translate(mx, -8, mz);
    const pos = hill.attributes.position; for (let k = 0; k < pos.count; k++) { const y = pos.getY(k); if (y > 0) pos.setY(k, y * (0.85 + 0.3 * hash2(pos.getX(k) * 0.01, pos.getZ(k) * 0.01))); } hill.computeVertexNormals();
    const mount = new THREE.Mesh(hill, new THREE.MeshLambertMaterial({ color: 0x3e5a35 })); mount.name = 'mtl:mountroyal'; group.add(mount);
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xf2f2ff }); crossMat.userData.glow = true;
    const cr = new THREE.Group(); cr.add(new THREE.Mesh(new THREE.BoxGeometry(3, 31, 3), crossMat), new THREE.Mesh(new THREE.BoxGeometry(11, 2.5, 2.5), crossMat)); cr.children[1].position.y = 6;
    cr.position.set(mx + dirz / dl * 300, 222 + 15, mz - dirx / dl * 300); group.add(cr);
    // Habitat 67 on the Cité du Havre: Safdie's stacked concrete boxes
    { const [hx, hz] = geo.proj.toXZ(-73.5452, 45.4996); const boxes = [];
      for (let k = 0; k < 150; k++) { const u = rnd() * 220 - 110, lvl = Math.floor(rnd() * Math.max(1, 12 - Math.abs(u) / 14)); const g = new THREE.BoxGeometry(11.7, 3, 5.3); g.rotateY(rnd() < 0.5 ? 0 : Math.PI / 2); g.translate(hx + u * 0.82 + (rnd() - 0.5) * 12, 1.5 + lvl * 3, hz + u * 0.57 + (rnd() - 0.5) * 12); vcolor(g, 0xcfc8bb); boxes.push(nonIdx(g)); }
      const hab = new THREE.Mesh(mergeGeometries(boxes), new THREE.MeshLambertMaterial({ vertexColors: true })); hab.name = 'mtl:habitat67'; group.add(hab); }
    // the Jacques Cartier Bridge: Montreal (De Lorimier) to Sainte-Hélène to Longueuil, a steel cantilever truss over the
    // main channel (its arch-like top chord 80 m up), girder spans on piers over the islands, painted a weathered green
    const steel = new THREE.MeshStandardMaterial({ color: 0x6c7f72, roughness: 0.6, metalness: 0.5 });
    const legs = [[[-73.5466, 45.5250], [-73.5338, 45.5205]], [[-73.5338, 45.5205], [-73.5176, 45.5276]]], parts = [];
    legs.forEach(([p, q], li) => {
      const [x0, z0] = geo.proj.toXZ(p[0], p[1]), [x1, z1] = geo.proj.toXZ(q[0], q[1]), len = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(x1 - x0, z1 - z0);
      const at = (u, y, g) => { g.rotateY(ang); g.translate(x0 + (x1 - x0) * u, y, z0 + (z1 - z0) * u); parts.push(nonIdx(g)); };
      const deckY = (u) => (li === 0 ? 30 + 18 * Math.sin(Math.PI * Math.min(1, u * 1.2)) : 30 * (1 - u) + 12 * u);
      for (let u = 0; u < 1; u += 12 / len) at(u + 6 / len, deckY(u), new THREE.BoxGeometry(22, 1.4, 12.5));
      for (let u = 0.04; u < 1; u += 70 / len) { const y = deckY(u); at(u, y / 2, new THREE.BoxGeometry(4, y, 4)); }
      if (li === 0) {   // the cantilever: top chords rising to 80 m over the main span, verticals and diagonals
        for (let u = 0.12; u < 0.62; u += 10 / len) {
          const t = (u - 0.12) / 0.5, top = 30 + 18 + 32 * Math.sin(Math.PI * t), y0 = deckY(u);
          for (const side of [-9, 9]) { const g = new THREE.BoxGeometry(0.9, top - y0, 0.9); g.translate(side, (top - y0) / 2, 0); at(u, y0, g); const c = new THREE.BoxGeometry(1.2, 1.2, 10.5); c.translate(side, 0, 0); at(u, top, c); }
        }
      }
    });
    const jc = new THREE.Mesh(mergeGeometries(parts), steel); jc.name = 'mtl:jacquescartier'; group.add(jc);
  }

  // ---- the near bridges over the Chenal Le Moyne (the Pont des Iles, the Cosmos footbridge) and the boats -----------
  {
    const parts = [], conc = new THREE.MeshStandardMaterial({ color: 0xb8b4aa, roughness: 0.85 });
    for (const [a, b, w, y] of [[[-775, -125], [-520, -112], 16, 7], [[-582, 760], [-362, 770], 8, 6], [[-1545, -690], [-930, -330], 22, 12]]) {
      const [x0, z0] = L(a), [x1, z1] = L(b), len = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(x1 - x0, z1 - z0);
      const d = new THREE.BoxGeometry(w, 1.2, len); d.rotateY(ang); d.translate((x0 + x1) / 2, y, (z0 + z1) / 2); parts.push(nonIdx(d));
      for (let u = 0; u <= 1.001; u += 40 / len) { const p = new THREE.BoxGeometry(w * 0.6, y, 2); p.rotateY(ang); p.translate(x0 + (x1 - x0) * u, y / 2, z0 + (z1 - z0) * u); parts.push(nonIdx(p)); }
    }
    group.add(new THREE.Mesh(mergeGeometries(parts), conc));
    const boats = [], hull = new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.4 });
    for (const [x, z, r, l] of [[-610, 240, 0.3, 11], [-640, 520, 2.9, 8], [-600, 980, 0.2, 14], [-1300, 600, 0.8, 30], [-700, -500, 1.2, 9], [240, 300, 2.9, 7]]) {
      const [wx, wz] = L([x, z]); if (!isWater(wx, wz)) continue;
      const g = new THREE.BoxGeometry(l * 0.32, 1.4, l); g.rotateY(r); g.translate(wx, 0.5, wz); boats.push(nonIdx(g));
      const c = new THREE.BoxGeometry(l * 0.24, 1.2, l * 0.35); c.rotateY(r); c.translate(wx, 1.6, wz); boats.push(nonIdx(c));
    }
    // the rowing basin's pontoons and its start/finish buoys line
    for (const z of [1180, 1200, 1220]) { const [x0, z0] = L([bankW(z), z]), [x1, z1] = L([bankW(z) + 26, z]); const g = new THREE.BoxGeometry(Math.hypot(x1 - x0, z1 - z0), 0.5, 2.2); g.rotateY(Math.atan2(z0 - z1, x1 - x0)); g.translate((x0 + x1) / 2, 0.15, (z0 + z1) / 2); boats.push(nonIdx(g)); }
    if (boats.length) group.add(new THREE.Mesh(mergeGeometries(boats), hull));
  }

  // ---- grandstands -----------------------------------------------------------------------------------------------------
  const stands = [], standBoxes = [];
  const okAt = (x, z) => !isWater(x, z) && !hitSolid(x, z, 2, true);
  for (const S of STANDS) {
    let ox, oz, ex, ez;
    if (S.at) {
      const [x, z] = L(S.at), [fx, fz] = L(S.face); let dx = fx - x, dz = fz - z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      ox = x; oz = z; ez = [-dx, -dz]; ex = [dz, -dx];
    } else {
      const s0 = S.s != null ? S.s : (cornerS(S.turn) ?? null) + (S.along || 0); if (!isFinite(s0)) continue;
      const f = tr.sample(s0, 0); let wall = 0; for (let ds = -S.len / 2; ds <= S.len / 2; ds += 4) wall = Math.max(wall, tr.wallAt(tr.idxAtS(s0 + ds), S.side));
      ox = f.x + f.nx * S.side * (wall + 5.5); oz = f.z + f.nz * S.side * (wall + 5.5); ex = [f.tx, f.tz]; ez = [f.nx * S.side, f.nz * S.side];
    }
    // slide it back (up to 40 m) until no part of it touches the racing corridor or the pit lane
    let why = ''; const DEPTH = 0.8 + S.tiers * 1.35 + 1;
    const clear = () => { for (let u = -S.len / 2; u <= S.len / 2; u += 5) for (let v = 0; v <= DEPTH; v += 6) { const x = ox + ex[0] * u + ez[0] * v, z = oz + ex[1] * u + ez[1] * v; if (corridorSigned(tr, pit, x, z, 3) < 0) { why = `the circuit at u ${u} v ${v}`; return false; } if (!okAt(x, z)) { const hit = hitSolid(x, z, 2, true); why = `${isWater(x, z) ? 'water' : `a building (${hit?.slice(0, 3).map(Math.round)})`} at u ${u} v ${v}`; return false; } } return true; };
    let k = 0; while (k < 20 && !clear()) { ox += ez[0] * 2; oz += ez[1] * 2; k++; }
    if (k >= 20) { console.info(`[montreal] no room for ${S.name} (${why})`); continue; }
    stands.push({ x: ox, z: oz, ex, ez, len: S.len, tiers: S.tiers, name: S.name });
    for (const q of solid) if (q[3] && Math.abs((q[0] - ox) * ex[0] + (q[1] - oz) * ex[1]) < S.len / 2 + 3 && ((q[0] - ox) * ez[0] + (q[1] - oz) * ez[1]) > -3 && ((q[0] - ox) * ez[0] + (q[1] - oz) * ez[1]) < DEPTH + 3) claimed.add(q[3]);
    standBoxes.push([ox + ez[0] * DEPTH / 2, oz + ez[1] * DEPTH / 2, S.len / 2 + 8]);
  }
  // hospitality: white marquees along the Casino straight's run to the last chicane and behind the Senna stands
  {
    const tents = [];
    for (const [turn, along, side, n] of [[13, -260, 1, 5], [13, -420, -1, 4], [1, -200, -1, 3]]) {
      const s0 = cornerS(turn); if (s0 == null) continue;
      for (let j = 0; j < n; j++) {
        const s = s0 + along + j * 24, f = tr.sample(s, 0), w = tr.wallAt(tr.idxAtS(s), side) + 12, x = f.x + f.nx * side * w, z = f.z + f.nz * side * w;
        if (corridorSigned(tr, pit, x, z, 3) < 8 || !okAt(x, z) || standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r)) continue;
        const ang = Math.atan2(f.tx, f.tz);
        const body = new THREE.BoxGeometry(14, 3.2, 20); body.translate(0, 1.6, 0); const roof = new THREE.ConeGeometry(12.2, 3.2, 4); roof.rotateY(Math.PI / 4); roof.scale(1, 1, 1.42); roof.translate(0, 4.8, 0);
        for (const g of [body, roof]) { g.rotateY(ang); g.translate(x, 0, z); tents.push(nonIdx(g)); }
        solid.push([x, z, 16]);
      }
    }
    if (tents.length) { const m = new THREE.Mesh(mergeGeometries(tents.map((g) => { g.deleteAttribute('uv'); return g; })), white); m.name = 'mtl:tents'; group.add(m); }
  }

  // ---- paint on the grass: the logos, and the Wall of Champions' green strip ------------------------------------------
  {
    const decals = new Map();
    for (const A of ADS) {
      const s0 = cornerS(A.turn); if (s0 == null) continue;
      const sC = s0 + A.along, f = tr.sample(sC, 0);
      let lat = hw + kw + A.lateral + A.w / 2;
      // never on the road or a kerb: slide it out until every corner of it is clear
      const corners = (lt) => [[-1, -1], [1, -1], [1, 1], [-1, 1], [0, 0]].map(([a, b]) => { const p = tr.sample(sC + b * A.l / 2, A.side * (lt + a * A.w / 2)); return [p.x, p.z]; });
      let tries = 0; const clearOf = (pts) => pts.every(([x, z]) => Math.abs(tr.nearest(x, z).d) > hw + kw + 0.4 && !isWater(x, z));
      while (tries < 20 && !clearOf(corners(lat))) { lat += 1.5; tries++; }
      if (tries >= 20) continue;
      // the quad follows the track's frame at its centre (u across, v along)
      const P = tr.sample(sC, A.side * lat); const g = new THREE.PlaneGeometry(A.w, A.l); g.rotateX(-Math.PI / 2);
      g.rotateY(Math.atan2(P.tx, P.tz)); g.translate(P.x, 0.02, P.z);
      if (!decals.has(A.logo)) decals.set(A.logo, []); decals.get(A.logo).push(g);
      void f;
    }
    for (const [logo, gs] of decals) {
      const m = new THREE.MeshStandardMaterial({ map: adTexture(logo), transparent: true, alphaTest: 0.08, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, depthWrite: false });
      const mesh = new THREE.Mesh(mergeGeometries(gs), m); mesh.name = `mtl:paint:${logo}`; mesh.renderOrder = 1; group.add(mesh);
    }
    // the Wall of Champions: the green strip between the T14 exit kerb and the wall, its name painted along it in white
    for (const p of tr.pins || []) {
      const inP = (i) => { const s = tr.s[i]; return p.a <= p.b ? s >= p.a && s <= p.b : s >= p.a || s <= p.b; };
      const greenG = ribbon(tr, () => p.side * (hw + kw), (i) => p.side * Math.max(hw + kw + 0.2, tr.wallAt(i, p.side) - 0.05), 0.007, { mask: (i) => inP(i) && inP((i + 1) % tr.n) });
      const gm = new THREE.MeshStandardMaterial({ color: 0x23803a, roughness: 0.75, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      if (greenG.index.count) group.add(new THREE.Mesh(greenG, gm));
      const len = 16, a0 = tr.wrapS(p.a + 20), inT = (i) => { const u = tr.wrapS(tr.s[i] - a0); return u >= 0 && u <= len; };
      // (turned so the letters' tops point at the wall: it reads from the car, as the real paint does)
      const tex = runoffTextTexture('WALL OF\nCHAMPIONS', p.side > 0);
      const tg = ribbon(tr, () => p.side * (hw + kw + 0.12), () => p.side * (hw + kw + 1.5), 0.011, { mask: (i) => inT(i) && inT((i + 1) % tr.n), uvFn: (i) => tr.wrapS(tr.s[i] - a0) / len });
      if (tg.index.count) { const tm = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 })); tm.name = 'mtl:woc'; group.add(tm); }
    }
  }

  // ---- trees ------------------------------------------------------------------------------------------------------------
  const treeGeo = buildTreeGeometries(), treeFar = buildTreeGeometries(true);
  const plant = { maple: [], ash: [], poplar: [], willow: [], spruce: [] };
  const busy = (x, z, r) => !!hitSolid(x, z, r) || standBoxes.some(([sx, sz, sr]) => (sx - x) ** 2 + (sz - z) ** 2 < (sr + r) ** 2)
    || inRing(x, z, paddock) || inRing(x, z, beach);
  const add = (sp, x, z, scale = 1) => { const [h0, h1] = SPECIES[sp].h; plant[sp].push([x, z, (h0 + rnd() * (h1 - h0)) * scale, rnd() * 6.283, SPECIES[sp].col[(rnd() * SPECIES[sp].col.length) | 0]]); };
  // the Lombardy poplars: rows along both banks of the rowing basin and down the Seaway's strip
  for (let z = -840; z < 1300; z += 11) for (const off of [-9, 119]) {
    const [x, wz] = L([bankW(z) + off, z]); if (corridorSigned(tr, pit, x, wz, 1.5) < 5 || busy(x, wz, 3) || isWater(x, wz)) continue; if (rnd() < 0.85) add('poplar', x, wz);
  }
  // the parkland: a grid with jitter, clumped by noise, thicker on Sainte-Hélène's hill, willows near the water
  const bbox = [-1150, -1000, 450, 2000];
  for (let gz = bbox[1]; gz < bbox[3]; gz += 9) for (let gx = bbox[0]; gx < bbox[2]; gx += 9) {
    const lx = gx + (rnd() - 0.5) * 8, lz = gz + (rnd() - 0.5) * 8, [x, z] = L([lx, lz]);
    const onSH = inRing(x, z, steHelene), onND = inRing(x, z, notreDame); if (!onSH && !onND) continue;
    if (isWater(x, z)) continue;
    const n = vnoise(lx, lz, 70) * 0.7 + vnoise(lx, lz, 23) * 0.3;
    const dens = onSH ? (n > 0.45 ? 0.55 : 0.05) : (n > 0.55 ? 0.36 : 0.025);
    if (rnd() > dens) continue;
    if (corridorSigned(tr, pit, x, z, 1.5) < (onSH ? 6 : 4) || busy(x, z, 4)) continue;
    const sd = shoreDist(x, z), r = rnd();
    if (sd < 16 && r < 0.55) add('willow', x, z);
    else if (onSH) add(r < 0.24 ? 'spruce' : r < 0.72 ? 'maple' : r < 0.9 ? 'ash' : 'poplar', x, z);
    else add(r < 0.55 ? 'maple' : r < 0.8 ? 'ash' : r < 0.9 ? 'poplar' : 'spruce', x, z);
  }
  const treeMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  treeMat.onBeforeCompile = (sh) => {   // a breeze in the crowns (the higher the vertex, the more it sways)
    sh.uniforms.uTime = { value: 0 }; treeMat.userData.shader = sh;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n{ float ph = instanceMatrix[3][0] * 0.13 + instanceMatrix[3][2] * 0.07; transformed.x += position.y * position.y * 0.018 * sin(uTime * 1.3 + ph); transformed.z += position.y * position.y * 0.012 * cos(uTime * 1.1 + ph); }');
  };
  treeMat.customProgramCacheKey = () => 'mtlTrees';
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), v3 = new THREE.Vector3(), sc = new THREE.Vector3(), col = new THREE.Color();
  // every tree of a species in two instanced meshes - the detailed model for the trees within TREE_NEAR of the camera,
  // the stand-in for the rest - refilled from the species' own arrays when the camera has moved TREE_STEP (no
  // allocation: the arrays are made once). Ten draw calls for every tree on the islands.
  let treeCount = 0;
  const trees = new THREE.Group(); trees.name = 'mtl:trees';
  const kinds = [];
  for (const sp of Object.keys(plant)) {
    const list = plant[sp], n = list.length; if (!n) continue;
    const M = new Float32Array(n * 16), C = new Float32Array(n * 3), P = new Float32Array(n * 2);
    list.forEach(([x, z, h, rot, c], i) => {
      q.setFromAxisAngle(up, rot); const w = h * (sp === 'poplar' ? 1 : 0.9 + rnd() * 0.25); sc.set(w, h, w); v3.set(x, 0, z); m4.compose(v3, q, sc); m4.toArray(M, i * 16);
      col.setHex(c); col.multiplyScalar(0.9 + rnd() * 0.2); C[i * 3] = col.r; C[i * 3 + 1] = col.g; C[i * 3 + 2] = col.b; P[i * 2] = x; P[i * 2 + 1] = z;
    });
    const near = new THREE.InstancedMesh(treeGeo[sp], treeMat, n), far = new THREE.InstancedMesh(treeFar[sp], treeMat, n);
    for (const im of [near, far]) { im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); im.frustumCulled = false; im.count = 0; trees.add(im); }
    kinds.push({ n, M, C, P, near, far }); treeCount += n;
  }
  const lastPos = new THREE.Vector3(1e9, 0, 1e9);
  const placeTrees = (cx, cz) => {
    const R2 = TREE_NEAR * TREE_NEAR;
    for (const K of kinds) {
      const nm = K.near.instanceMatrix.array, fm = K.far.instanceMatrix.array, nc = K.near.instanceColor.array, fc = K.far.instanceColor.array;
      let a = 0, b = 0;
      for (let i = 0; i < K.n; i++) {
        const dx = K.P[i * 2] - cx, dz = K.P[i * 2 + 1] - cz, isNear = dx * dx + dz * dz < R2;
        const dm = isNear ? nm : fm, dc = isNear ? nc : fc, k = isNear ? a++ : b++;
        for (let j = 0; j < 16; j++) dm[k * 16 + j] = K.M[i * 16 + j];
        dc[k * 3] = K.C[i * 3]; dc[k * 3 + 1] = K.C[i * 3 + 1]; dc[k * 3 + 2] = K.C[i * 3 + 2];
      }
      K.near.count = a; K.far.count = b;
      for (const im of [K.near, K.far]) { im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; }
    }
  };
  placeTrees(0, 0);
  group.add(trees);
  console.info(`[montreal] ${stands.length} grandstands, ${treeCount} trees (${Object.entries(plant).map(([k, v]) => `${k} ${v.length}`).join(', ')})`);

  let wt = 0;
  return {
    group, claimed, stands, trees: treeCount,
    /** water, or something of the scenery standing at (x, z) (where an evening's venue cannot go: main.js footClear) */
    blocked: (x, z) => isWater(x, z) || !!hitSolid(x, z, 2) || standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r),
    /** t: the session clock; cam: the camera (the trees of a cell nearer than TREE_NEAR get the detailed model) */
    update(t, cam) {
      if (cam && (cam.position.x - lastPos.x) ** 2 + (cam.position.z - lastPos.z) ** 2 > TREE_STEP * TREE_STEP) { lastPos.copy(cam.position); placeTrees(lastPos.x, lastPos.z); }
      const sh = treeMat.userData.shader; if (sh) sh.uniforms.uTime.value = t; const d = t - wt; wt = t; if (d > 0 && d < 1) { ripple.offset.x += d * 0.004; ripple.offset.y += d * 0.0025; } },
    setTime(mode) { const day = mode === 'day'; waterMat.color.set(day ? 0x3d6f86 : 0x0b1622); waterMat.roughness = day ? 0.12 : 0.06; },
  };
}

/** unit-height tree models (vertex-coloured: trunk brown, crown white so the instance colour tints it); far: the ~30-
 *  triangle stand-ins for the trees of a cell beyond TREE_NEAR */
function buildTreeGeometries(far = false) {
  const crown = (g) => vcolor(nonIdx(g), 0xffffff), trunk = (h, r) => { const g = new THREE.CylinderGeometry(r * 0.7, r, h, far ? 3 : 5, 1, true); g.translate(0, h / 2, 0); return vcolor(nonIdx(g), 0x5a4632); };
  const blob = (r, x, y, z, sx = 1, sy = 1, sz = 1, detail = 1) => { const g = new THREE.IcosahedronGeometry(r, detail); const p = g.attributes.position; for (let k = 0; k < p.count; k++) { const f = 0.85 + 0.3 * hash2(p.getX(k) * 9 + x * 3, p.getY(k) * 9 + p.getZ(k) * 5); p.setXYZ(k, p.getX(k) * f, p.getY(k) * f, p.getZ(k) * f); } g.scale(sx, sy, sz); g.translate(x, y, z); g.computeVertexNormals(); return crown(g); };
  const merge = (gs) => { const g = mergeGeometries(gs.map((x) => { for (const k of Object.keys(x.attributes)) if (!['position', 'normal', 'color'].includes(k)) x.deleteAttribute(k); return x; })); return g; };
  // a darker underside to every crown: self-shading without shadows
  const shade = (g) => { const p = g.attributes.position, c = g.attributes.color; for (let k = 0; k < p.count; k++) { const f = 0.62 + 0.38 * Math.min(1, Math.max(0, (p.getY(k) - 0.3) / 0.6)); if (c.getX(k) > 0.9) c.setXYZ(k, f, f, f); } return g; };
  if (far) return {
    maple: shade(merge([trunk(0.5, 0.035), blob(0.34, 0, 0.7, 0, 1.15, 0.9, 1.15, 0)])),
    ash: shade(merge([trunk(0.55, 0.03), blob(0.27, 0, 0.74, 0, 1.15, 0.85, 1.15, 0)])),
    poplar: shade(merge([trunk(0.2, 0.025), blob(0.5, 0, 0.56, 0, 0.22, 0.95, 0.22, 0)])),
    willow: shade(merge([trunk(0.45, 0.045), blob(0.42, 0, 0.6, 0, 1.15, 0.85, 1.15, 0)])),
    spruce: (() => { const c = new THREE.ConeGeometry(0.32, 0.85, 6, 1, true); c.translate(0, 0.15 + 0.425, 0); return shade(merge([trunk(0.2, 0.03), crown(c)])); })(),
  };
  return {
    maple: shade(merge([trunk(0.5, 0.035), blob(0.3, 0, 0.64, 0, 1.1, 0.85, 1.1), blob(0.22, 0.17, 0.76, 0.08, 1, 1, 1, 0), blob(0.21, -0.15, 0.74, -0.1, 1, 1, 1, 0)])),
    ash: shade(merge([trunk(0.55, 0.03), blob(0.19, 0.12, 0.66, 0.05, 1, 0.8, 1, 0), blob(0.18, -0.13, 0.7, -0.06, 1, 0.8, 1, 0), blob(0.17, 0.0, 0.84, 0.12, 1, 0.8, 1, 0), blob(0.16, -0.02, 0.78, -0.16, 1, 0.8, 1, 0)])),
    poplar: shade(merge([trunk(0.2, 0.025), blob(0.5, 0, 0.56, 0, 0.22, 0.95, 0.22)])),
    willow: (() => {
      const skirt = new THREE.CylinderGeometry(0.33, 0.5, 0.55, 9, 1, true); const p = skirt.attributes.position;
      for (let k = 0; k < p.count; k++) if (p.getY(k) < 0) p.setY(k, p.getY(k) - 0.08 * hash2(p.getX(k) * 13, p.getZ(k) * 17));
      skirt.translate(0, 0.42, 0); skirt.computeVertexNormals();
      return shade(merge([trunk(0.45, 0.045), blob(0.36, 0, 0.72, 0, 1.15, 0.6, 1.15), crown(skirt)]));
    })(),
    spruce: (() => { const gs = [trunk(0.25, 0.03)]; [[0.3, 0.42, 0.08], [0.24, 0.36, 0.34], [0.17, 0.3, 0.56], [0.1, 0.24, 0.76]].forEach(([r, h, y]) => { const c = new THREE.ConeGeometry(r, h, 7, 1, true); c.translate(0, y + h / 2, 0); gs.push(crown(c)); }); return shade(merge(gs)); })(),
  };
}
