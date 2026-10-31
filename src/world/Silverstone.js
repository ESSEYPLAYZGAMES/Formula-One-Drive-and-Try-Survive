// Silverstone on British Grand Prix weekend: the old airfield in the Northamptonshire fields as the race fills it. The
// Silverstone Wing over the International pits - 380 m of glass in three levels of balconies under its layered white
// blades, red along their edges and undersides, sweeping up at the Club end (where the cars arrive) into the dark
// chequered prow with the podium balcony, the chequered panel and the F1 screen on its face, open steps beyond it; the
// glass footbridge from the hotel across the start; the grandstands by their real names on their real footprints, each
// its own build (Club's long white roof curving round the corner, Stowe's turquoise, the blue roofs at Copse and Village,
// grey cantilevers at Luffield and Hamilton Straight, Becketts' white skillion, the open stands with blue seats, flags on
// poles along their tops, the hoardings along their fronts) and packed - papaya above all, Union Flags waving; the
// general-admission banks behind the run-offs; the paddock behind the Wing, the Paddock Club, the National pits and the
// BRDC clubhouse, the infield's lake and the Stowe circuit, the hospitality marquees, the fan zone's big blue top and its
// wheel; and round it all the campsites, the car parks, Silverstone Park's sheds and the patchwork of fields, hedgerows,
// tree lines and woods. Everything instanced or merged (a few draw calls a kind, cells culled by distance: userData.cut).
//
// It replaces world/Venue.js for this circuit (main.js builds no venue for a circuit with scenery of its own): the same
// contract - the footprints it claims (so the generic extruder skips them) and the real stands' placements for
// world/Grandstands.js (which builds their tiers and their crowds; the roofs and the rest are dressed on here, in the same
// frame). Nothing here moves the road, the kerbs, the run-offs or a barrier: the crowds' own fences stand well behind the
// run-offs' and verges' caps (track.wallAt), so a car that leaves the road still runs out onto open grass.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { corridorSigned, ribbon, fenceTexture } from '../track/TrackBuilder.js';
import { footprintInfo } from '../core/GeoLoader.js';
import { fitRingOutsideCorridor } from './Landmarks.js';
import { standFootprints } from './Venue.js';
import { STAND } from './Grandstands.js';
import { fanMaterial, fanMesh, walkerMaterial, walkerMesh } from './FanCutouts.js';
import { FLAGART, buildHelicopters } from './CotaLife.js';
import { vnoise, fbm, ringRoad } from './Austin.js';
import { extrudeFootprint } from './Buildings.js';

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);
const keepPN = (g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };
const keepPNU = (g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); return g; };
/** a geometry with one colour on every vertex (non-indexed, position / normal / colour only: merges with its kind) */
const vc = (g, hex) => { g = keepPN(nonIdx(g)); const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let k = 0; k < n; k++) { a[k * 3] = c.r; a[k * 3 + 1] = c.g; a[k * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
const canvasTex = (w, h, draw, o = {}) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = o.aniso || 8; if (o.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; if (o.repeatS) t.wrapS = THREE.RepeatWrapping; return t; };
const VMAT = (o = {}) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.08, ...o });
const inRing = (x, z, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
const merged = (gs, mat, name, cut) => { const list = gs.filter((g) => g && g.attributes.position.count); if (!list.length) return null; const m = new THREE.Mesh(mergeGeometries(list), mat); m.name = name; if (cut) { m.geometry.computeBoundingSphere(); m.userData.cut = cut; } return m; };

// ---- the crowd: papaya above all (McLaren's home race, and the Dutch orange of Verstappen's fans), the Union Flag's navy,
//      red and white, the teams' colours, and the everyday; caps and bare heads (no Stetsons in Northamptonshire)
const UK_SHIRTS = [0xff8000, 0xff8000, 0xff8000, 0xff8000, 0xff8000, 0xf36c21, 0xf36c21, 0xee6a1a, 0x0a1f5c, 0x0a1f5c, 0x012169, 0xc8102e, 0xc8102e, 0xffffff, 0xf2f2ee, 0xe9e9e6,
  0x1c1c1e, 0x1c1c1e, 0x27f4d2, 0x00a19c, 0xe8002d, 0xdc0000, 0x229971, 0x1e41ff, 0x3671c6, 0x64c4ff, 0x23304a, 0x8d9096, 0x3b3d42, 0x8fb0cf, 0xb8a888, 0x5c6246, 0xd8c04a];
const UK_POSES = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6];
const MARSHAL = [0xf36c21, 0xf2731e];

// ---- the boards: one atlas, a row each - the sponsors' hoardings (two logos to a row, repeating along a board) and the
//      stands' names (one to a row)
const BRANDS = ['globant', 'qatar', 'dhl', 'emirates', 'santander', 'rolex', 'aramco', 'pirelli', 'heineken', 'msc', 'aws', 'crypto', 'silverstone', 'britishgp', 'paddock', 'lenovo'];
const NAMES = ['CLUB', 'VALE', 'STOWE', 'BECKETTS', 'CHAPEL', 'COPSE', 'STIRLING', 'NATIONAL PIT STRAIGHT', 'WOODCOTE', 'LUFFIELD', 'JIM CLARK', 'WELLINGTON', 'VILLAGE', 'FARM CURVE', 'ABBEY',
  'HAMILTON STRAIGHT', 'THE VIEW', 'INTERNATIONAL PADDOCK', 'SILVERSTONE SIX', 'SILVERSTONE', 'PADDOCK CLUB', 'FAN ZONE', 'BRDC'];
const ROWS = 40, RH = 48, BOARD_REPEAT = 23.5;   // (a row is 1024 x 48 px: 23.5 m of a 1.1 m board)
const rowOf = (name) => { const b = BRANDS.indexOf(name); return b >= 0 ? b : BRANDS.length + Math.max(0, NAMES.indexOf(name)); };
const rowV = (r) => [1 - (r + 1) / ROWS + 0.6 / (ROWS * RH), 1 - r / ROWS - 0.6 / (ROWS * RH)];
let BOARDS = null;
function boardAtlas() {
  if (BOARDS) return BOARDS;
  BOARDS = canvasTex(1024, ROWS * RH, (x) => {
    const F = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
    const txt = (t, cx, cy, size, col, o = {}) => { x.font = `${o.italic ? 'italic ' : ''}${o.weight || 900} ${size}px ${F}`; x.fillStyle = col; x.textAlign = o.align || 'center'; x.textBaseline = 'middle'; const w = x.measureText(t).width, m = o.max || 440; x.save(); x.translate(cx, cy); if (w > m) x.scale(m / w, 1); x.fillText(t, 0, 2); x.restore(); };
    const chev = (x0, y0, h, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + h * 0.35, y0); x.lineTo(x0 + h * 0.7, y0 + h / 2); x.lineTo(x0 + h * 0.35, y0 + h); x.lineTo(x0, y0 + h); x.lineTo(x0 + h * 0.35, y0 + h / 2); x.closePath(); x.fill(); };
    const paint = {
      globant: (y, h) => { x.fillStyle = '#0b0b0d'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) { txt('Globant', o + 230, y + h / 2, 34, '#ffffff', { weight: 700 }); chev(o + 340, y + 9, h - 18, '#bfd630'); } },
      qatar: (y, h) => { x.fillStyle = '#5c0632'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) { txt('QATAR', o + 190, y + h / 2, 30, '#ffffff', { max: 140 }); txt('AIRWAYS', o + 330, y + h / 2, 26, '#e9d7e1', { weight: 400, max: 130 }); } },
      dhl: (y, h) => { x.fillStyle = '#ffcc00'; x.fillRect(0, y, 1024, h); x.fillStyle = '#d40511'; for (let k = 0; k < 6; k++) x.fillRect(k * 180 + 10, y + h * 0.42, 60, 4); for (const o of [0, 512]) txt('DHL', o + 256, y + h / 2, 40, '#d40511', { italic: true, max: 200 }); },
      emirates: (y, h) => { x.fillStyle = '#d71921'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('Fly Emirates', o + 256, y + h / 2, 32, '#ffffff', { weight: 600, italic: true, max: 330 }); },
      santander: (y, h) => { x.fillStyle = '#ec0000'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('Santander', o + 256, y + h / 2, 34, '#ffffff', { weight: 700, max: 300 }); },
      rolex: (y, h) => { x.fillStyle = '#006039'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('ROLEX', o + 256, y + h / 2, 32, '#c8a45a', { weight: 700, max: 220 }); },
      aramco: (y, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) { txt('aramco', o + 270, y + h / 2, 34, '#0a5aa8', { weight: 600, max: 220 }); x.fillStyle = '#84bd00'; x.fillRect(o + 120, y + 12, 22, h - 24); x.fillStyle = '#00a3e0'; x.fillRect(o + 146, y + 12, 22, h - 24); } },
      pirelli: (y, h) => { x.fillStyle = '#0d0d0d'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('PIRELLI', o + 256, y + h / 2, 34, '#ffd500', { weight: 900, max: 260 }); },
      heineken: (y, h) => { x.fillStyle = '#0c7a3d'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('Heineken', o + 256, y + h / 2, 32, '#ffffff', { weight: 800, italic: true, max: 280 }); },
      msc: (y, h) => { x.fillStyle = '#0b1b3a'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('MSC CRUISES', o + 256, y + h / 2, 30, '#d8b25a', { max: 300 }); },
      aws: (y, h) => { x.fillStyle = '#232f3e'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) { txt('aws', o + 256, y + h / 2 - 4, 32, '#ffffff', { weight: 700 }); x.strokeStyle = '#ff9900'; x.lineWidth = 4; x.beginPath(); x.arc(o + 256, y + 6, 34, 0.35 * Math.PI, 0.65 * Math.PI); x.stroke(); } },
      crypto: (y, h) => { x.fillStyle = '#002d74'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('crypto.com', o + 256, y + h / 2, 30, '#ffffff', { weight: 600, max: 300 }); },
      silverstone: (y, h) => { x.fillStyle = '#0b1f4d'; x.fillRect(0, y, 1024, h); x.fillStyle = '#c8102e'; x.fillRect(0, y + h - 6, 1024, 6); for (const o of [0, 512]) txt('SILVERSTONE', o + 256, y + h / 2 - 2, 30, '#ffffff', { max: 330 }); },
      britishgp: (y, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, y, 1024, h); x.fillStyle = '#012169'; x.fillRect(0, y, 1024, 7); x.fillStyle = '#c8102e'; x.fillRect(0, y + h - 7, 1024, 7); for (const o of [0, 512]) txt('BRITISH GRAND PRIX', o + 256, y + h / 2, 26, '#012169', { max: 400 }); },
      paddock: (y, h) => { x.fillStyle = '#111214'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('PADDOCK CLUB', o + 256, y + h / 2, 28, '#ffffff', { weight: 600, max: 330 }); },
      lenovo: (y, h) => { x.fillStyle = '#e2231a'; x.fillRect(0, y, 1024, h); for (const o of [0, 512]) txt('Lenovo', o + 256, y + h / 2, 32, '#ffffff', { weight: 700, max: 220 }); },
    };
    BRANDS.forEach((b, k) => paint[b](k * RH, RH));
    NAMES.forEach((n, k) => { const y = (BRANDS.length + k) * RH; x.fillStyle = '#0b1f4d'; x.fillRect(0, y, 1024, RH); x.fillStyle = '#c8102e'; x.fillRect(0, y + RH - 5, 1024, 5); x.fillStyle = '#ffffff'; x.fillRect(0, y, 1024, 3); txt(n, 512, y + RH / 2 - 1, 32, '#ffffff', { max: 900 }); });
  }, { repeatS: true });
  return BOARDS;
}

// ---- the flags: Union Flags most of all, St George, the papaya, the Dutch orange, the teams' colours, the yellow ones on
//      the stands' poles (a 4 x 4 atlas; the crowds' from CotaLife's drawings where they share them)
const FW = 128, FH = 80;
const FLAG_DRAW = [
  FLAGART[5],                                                                                                                   // 0 the Union Flag
  (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#ce1124'; x.fillRect(0, h * 0.4, w, h * 0.2); x.fillRect(w * 0.44, 0, w * 0.12, h); },   /* 1 St George */
  (x, w, h) => { x.fillStyle = '#ff8000'; x.fillRect(0, 0, w, h); x.fillStyle = '#111'; x.fillRect(0, h * 0.8, w, h * 0.2); x.fillStyle = '#fff'; x.font = `900 ${h * 0.36}px Arial`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LN4', w / 2, h * 0.42); },   /* 2 papaya */
  FLAGART[4], FLAGART[3],                                                                                                       // 3 the Dutch orange, 4 the Netherlands
  (x, w, h) => { x.fillStyle = '#ffd500'; x.fillRect(0, 0, w, h); },                                                            /* 5 yellow */
  (x, w, h) => { x.fillStyle = '#005eb8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#fff'; x.lineWidth = h * 0.18; x.beginPath(); x.moveTo(0, 0); x.lineTo(w, h); x.moveTo(w, 0); x.lineTo(0, h); x.stroke(); },   /* 6 Scotland */
  (x, w, h) => { x.fillStyle = '#dc0000'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffeb00'; x.fillRect(w * 0.4, h * 0.22, w * 0.2, h * 0.5); x.fillStyle = '#111'; x.fillRect(w * 0.47, h * 0.3, w * 0.06, h * 0.32); },   /* 7 the scarlet team */
  (x, w, h) => { x.fillStyle = '#101214'; x.fillRect(0, 0, w, h); x.fillStyle = '#27f4d2'; x.fillRect(0, h * 0.62, w, h * 0.14); x.fillStyle = '#c0c4c8'; x.fillRect(0, h * 0.24, w, h * 0.1); },   /* 8 the silver arrows */
  FLAGART[10], FLAGART[8], FLAGART[2], FLAGART[14],                                                                             // 9 Spain, 10 Germany, 11 Mexico, 12 Australia
  (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h / 2); x.fillStyle = '#00b140'; x.fillRect(0, h / 2, w, h / 2); x.fillStyle = '#d30731'; x.beginPath(); x.ellipse(w / 2, h / 2, w * 0.2, h * 0.22, 0, 0, 7); x.fill(); },   /* 13 Wales */
  (x, w, h) => { const n = 8; for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#fff'; x.fillRect((i * w) / n, (j * h) / 5, w / n + 1, h / 5 + 1); } },   /* 14 the chequered flag */
  (x, w, h) => { x.fillStyle = '#00594f'; x.fillRect(0, 0, w, h); x.fillStyle = '#cedc00'; x.fillRect(0, h * 0.7, w, h * 0.12); },   /* 15 the green team */
];
const CROWD_FLAGS = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 2, 0];
let FLAGS = null;
function flagAtlas() { return FLAGS || (FLAGS = canvasTex(FW * 4, FH * 4, (x) => FLAG_DRAW.forEach((draw, k) => { x.save(); x.translate((k % 4) * FW, Math.floor(k / 4) * FH); x.beginPath(); x.rect(0, 0, FW, FH); x.clip(); draw(x, FW, FH); x.restore(); }), { aniso: 4 })); }
/** the waving flags (one instanced quad each, the tile of the atlas per instance: aTile), poles with them */
function flagMaterial() {
  const m = new THREE.MeshLambertMaterial({ map: flagAtlas(), side: THREE.DoubleSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = { value: 0 }; m.userData.shader = sh;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime; attribute float aTile;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\n vMapUv = vec2((mod(aTile, 4.0) + 0.02 + uv.x * 0.96) / 4.0, (3.0 - floor(aTile / 4.0) + 0.02 + uv.y * 0.96) / 4.0);')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n float fx = uv.x; transformed.z += fx * 0.24 * sin(uTime * 6.0 - fx * 5.0 + instanceMatrix[3][0] * 0.7 + instanceMatrix[3][2]);');
  };
  m.customProgramCacheKey = () => 'silverstone-flags';
  return m;
}

/** Douglas-Peucker: the polyline's corners within tol metres */
function simplify(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let bi = -1, bd = tol;
    const [ax, az] = pts[a], [bx, bz] = pts[b], dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz) || 1;
    for (let k = a + 1; k < b; k++) { const d = Math.abs((pts[k][0] - ax) * dz - (pts[k][1] - az) * dx) / l; if (d > bd) { bd = d; bi = k; } }
    if (bi > 0) { keep[bi] = 1; st.push([a, bi], [bi, b]); }
  }
  return pts.filter((_, k) => keep[k]);
}
/**
 * A polyline resampled every `step` metres, in the shape TrackBuilder's ribbon() takes (px, pz, nx, nz, s, n): its
 * normals turned to `away` ([x, z]: the side away from the track) - or given per point (normals)
 */
function sampler(pts, away, step = 3, normals = null) {
  const P = { px: [], pz: [], nx: [], nz: [], tx: [], tz: [], s: [], n: 0, closed: false };
  let acc = 0;
  for (let k = 0; k < pts.length - 1; k++) {
    const [ax, az] = pts[k], [bx, bz] = pts[k + 1], l = Math.hypot(bx - ax, bz - az), m = Math.max(1, Math.round(l / step));
    for (let j = 0; j < m; j++) { const t = j / m; P.px.push(ax + (bx - ax) * t); P.pz.push(az + (bz - az) * t); P.s.push(acc + l * t); if (normals) { const na = normals[k], nb = normals[k + 1], nx = na[0] + (nb[0] - na[0]) * t, nz = na[1] + (nb[1] - na[1]) * t, nl = Math.hypot(nx, nz) || 1; P.nx.push(nx / nl); P.nz.push(nz / nl); } }
    acc += l;
  }
  const e = pts[pts.length - 1]; P.px.push(e[0]); P.pz.push(e[1]); P.s.push(acc); if (normals) { const nn = normals[normals.length - 1], nl = Math.hypot(nn[0], nn[1]) || 1; P.nx.push(nn[0] / nl); P.nz.push(nn[1] / nl); }
  P.n = P.px.length; P.length = acc;
  for (let i = 0; i < P.n; i++) {
    const a = Math.max(0, i - 1), b = Math.min(P.n - 1, i + 1); let tx = P.px[b] - P.px[a], tz = P.pz[b] - P.pz[a]; const tl = Math.hypot(tx, tz) || 1; tx /= tl; tz /= tl;
    P.tx.push(tx); P.tz.push(tz);
    if (!normals) { let nx = -tz, nz = tx; if (nx * away[0] + nz * away[1] < 0) { nx = -nx; nz = -nz; } P.nx.push(nx); P.nz.push(nz); }
  }
  // (which way its boards' words run, seen from the track: along the right hand of someone facing them)
  P.read = P.tx[0] * -P.nz[0] + P.tz[0] * P.nx[0] >= 0 ? 1 : -1;
  return P;
}
/** a board standing along sampler P at offset d (m out from it), y0 to y1, painted with atlas row `row` repeating every `period` m */
function board(P, d, y0, y1, row, period = BOARD_REPEAT, mask = null) {
  const g = ribbon(P, () => d, () => d, y0, { closed: false, yB: y1, mask, uvFn: (i) => (P.read * P.s[i]) / period });
  const uv = g.attributes.uv, [v0, v1] = rowV(row);
  for (let k = 0; k < uv.count; k++) { const across = uv.getX(k), along = uv.getY(k); uv.setXY(k, along, v0 + (v1 - v0) * across); }
  return keepPNU(g);
}
/** a strip of sampler P between offsets a and b, from height ya to yb (a sloping roof's panel), all one colour */
function panel(P, a, b, ya, yb, hex, mask = null) {
  const c = new THREE.Color(hex), rgb = [c.r, c.g, c.b];
  const g = ribbon(P, () => a, () => b, ya, { closed: false, yB: yb, colorFn: () => rgb, mask });
  return keepPN(nonIdx(g));
}

// ---- the grandstands' builds, by their real names (the survey's footprints): roof 'cantilever' (a deck on columns at the
//      back, raked up to its front edge, stays from masts over it), 'flat' (columns front and back), 'skillion' (a steep
//      mono-pitch, white, Becketts'), 'arc' (a curved white shell, Club's), 'membrane' (fabric sails between masts) or
//      'none' (open to the sky); roofC its colour; seat (blue seats); flags on poles along its top ('uk', 'yellow',
//      'mixed'); brand (the hoarding along its front); screen (a big screen at one end: 'a' / 'b'); tiers (else from its
//      footprint's depth)
const DESIGN = {
  'Club B': { roof: 'arc', roofC: 0xf4f5f7, seat: 0x1f4fa8, brand: 'qatar', flags: 'uk', screen: 'b', name: 'CLUB' },
  'Club A': { roof: 'arc', roofC: 0xf4f5f7, seat: 0x1f4fa8, brand: 'qatar', flags: 'uk', name: 'CLUB' },
  Vale: { roof: 'none', seat: 0x1f4fa8, brand: 'santander', flags: 'yellow', name: 'VALE', screen: 'a' },
  'Stowe A': { roof: 'cantilever', roofC: 0x2fb3a0, seat: 0x2463b8, brand: 'dhl', flags: 'uk', name: 'STOWE', screen: 'a' },
  'Stowe C': { roof: 'none', seat: 0x2463b8, brand: 'rolex', flags: 'yellow', name: 'STOWE' },
  Becketts: { roof: 'skillion', roofC: 0xf2f3f5, seat: 0x1f4fa8, brand: 'aramco', flags: 'uk', name: 'BECKETTS', screen: 'b' },
  Chapel: { roof: 'flat', roofC: 0x2a62bf, seat: 0x1f4fa8, brand: 'globant', flags: 'yellow', name: 'CHAPEL' },
  'Copse A': { roof: 'cantilever', roofC: 0x8d949c, seat: 0x1f4fa8, brand: 'globant', flags: 'yellow', name: 'COPSE' },
  'Copse B': { roof: 'flat', roofC: 0x2a62bf, seat: 0x1f4fa8, brand: 'globant', flags: 'uk', name: 'COPSE' },
  'Copse C': { roof: 'flat', roofC: 0x2a62bf, seat: 0x1f4fa8, brand: 'heineken', flags: 'yellow', name: 'COPSE', screen: 'b' },
  'Copse D': { roof: 'none', seat: 0x1f4fa8, brand: 'heineken', flags: 'uk', name: 'COPSE' },
  'Stirling A': { roof: 'none', seat: 0x1f4fa8, brand: 'crypto', flags: 'uk', name: 'STIRLING' },
  'Stirling B': { roof: 'none', seat: 0x1f4fa8, brand: 'crypto', flags: 'yellow', name: 'STIRLING' },
  'National Pit Straight': { roof: 'flat', roofC: 0x2a62bf, seat: 0x1f4fa8, brand: 'msc', flags: 'uk', name: 'NATIONAL PIT STRAIGHT' },
  'Woodcote A': { roof: 'cantilever', roofC: 0x2456b0, seat: 0x1f4fa8, brand: 'pirelli', flags: 'uk', name: 'WOODCOTE', screen: 'a' },
  'Woodcote B': { roof: 'cantilever', roofC: 0x2456b0, seat: 0x1f4fa8, brand: 'pirelli', flags: 'yellow', name: 'WOODCOTE' },
  Luffield: { roof: 'cantilever', roofC: 0x8d949c, seat: 0x1f4fa8, brand: 'globant', flags: 'yellow', name: 'LUFFIELD', screen: 'b' },
  'Luffield Corner': { roof: 'none', seat: 0x1f4fa8, brand: 'qatar', flags: 'uk', name: 'LUFFIELD' },
  'Jim Clark': { roof: 'none', seat: 0x1f4fa8, brand: 'lenovo', flags: 'mixed', name: 'JIM CLARK' },
  Wellington: { roof: 'none', seat: 0x1f4fa8, brand: 'aws', flags: 'mixed', name: 'WELLINGTON' },
  'Silverstone Six': { roof: 'flat', roofC: 0x8d949c, seat: 0x1f4fa8, brand: 'aws', flags: 'uk', name: 'SILVERSTONE SIX' },
  'Village A': { roof: 'cantilever', roofC: 0x2456b0, seat: 0x1f4fa8, brand: 'aramco', flags: 'uk', name: 'VILLAGE' },
  'Village B': { roof: 'cantilever', roofC: 0x2456b0, seat: 0x1f4fa8, brand: 'aramco', flags: 'yellow', name: 'VILLAGE', screen: 'b' },
  'The View': { roof: 'membrane', roofC: 0xf6f6f2, seat: 0x1f4fa8, brand: 'rolex', flags: 'uk', name: 'THE VIEW' },
  'Farm Curve': { roof: 'none', seat: 0x1f4fa8, brand: 'santander', flags: 'mixed', name: 'FARM CURVE', screen: 'a' },
  Abbey: { roof: 'flat', roofC: 0x2fb3a0, seat: 0x1f4fa8, brand: 'globant', flags: 'uk', name: 'ABBEY' },
  'International Paddock': { roof: 'flat', roofC: 0xf2f3f5, seat: 0x1f4fa8, brand: 'emirates', flags: 'mixed', name: 'INTERNATIONAL PADDOCK' },
  'Hamilton Straight A': { roof: 'cantilever', roofC: 0x8d949c, seat: 0x1f4fa8, brand: 'qatar', flags: 'uk', name: 'HAMILTON STRAIGHT', screen: 'a' },
};
const POLE_FLAGS = { uk: [0, 0, 0, 1], yellow: [5], mixed: [0, 0, 1, 5, 2, 14] };
// (the rows: steeper than world/Grandstands.js's own - Silverstone's big stands climb at 32 degrees)
const TH = 0.66, TD = 1.05;

export function buildSilverstone(geo, track, def, pit) {
  const t0 = performance.now(), tr = track, group = new THREE.Group(); group.name = 'silverstone';
  const claimed = new Set(), rnd = rng(20260706);
  const cornerS = (n) => def.corners.find((c) => c.n === n)?.s;
  const solids = [];   // [{ ring, h }]: what the cars hit (main.js adds them to the obstacles)
  const solid = [];    // [x, z, r]: what the crowds, the tents and the trees keep clear of
  const corr = (x, z, m = 1.5) => corridorSigned(tr, pit, x, z, m);
  const q0 = {}, gapAt = (x, z) => { const q = tr.nearest(x, z, -1, q0); return Math.abs(q.d) - tr.wallAt(q.i, q.d > 0 ? 1 : -1); };
  // (an occupancy raster, 4 m cells: what already stands on the ground - footprints, stands, banks, buildings, roads)
  const OCC = new Set(), ok4 = (a, b) => a * 100003 + b;
  const occ = (x, z) => OCC.has(ok4(Math.floor(x / 4), Math.floor(z / 4)));
  const occDisc = (x, z, r) => { for (let a = Math.floor((x - r) / 4); a <= Math.floor((x + r) / 4); a++) for (let b = Math.floor((z - r) / 4); b <= Math.floor((z + r) / 4); b++) OCC.add(ok4(a, b)); };
  const occRing = (ring, pad = 2) => { let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const [x, z] of ring) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); } for (let x = x0 - pad; x <= x1 + pad; x += 2) for (let z = z0 - pad; z <= z1 + pad; z += 2) if (inRing(x, z, ring) || ring.some(([px, pz]) => Math.abs(px - x) < pad && Math.abs(pz - z) < pad)) OCC.add(ok4(Math.floor(x / 4), Math.floor(z / 4))); };
  const occPoly = (pts, w) => { for (let k = 0; k + 1 < pts.length; k++) { const [ax, az] = pts[k], [bx, bz] = pts[k + 1], l = Math.hypot(bx - ax, bz - az); for (let t = 0; t <= l; t += 2) occDisc(ax + (bx - ax) * t / l, az + (bz - az) * t / l, w / 2); } };
  // (the circles in a 100 m grid, rebuilt whenever more have been added since: queried tens of thousands of times by the land)
  const SG = new Map(); let sgN = -1;
  const hitSolid = (x, z, pad = 0) => {
    if (sgN !== solid.length) { SG.clear(); for (const e of solid) { const [sx, sz, r] = e; for (let a = Math.floor((sx - r - 20) / 100); a <= Math.floor((sx + r + 20) / 100); a++) for (let b = Math.floor((sz - r - 20) / 100); b <= Math.floor((sz + r + 20) / 100); b++) { const k = a * 100003 + b; let l = SG.get(k); if (!l) SG.set(k, (l = [])); l.push(e); } } sgN = solid.length; }
    const l = SG.get(Math.floor(x / 100) * 100003 + Math.floor(z / 100)); if (!l) return false;
    for (const [sx, sz, r] of l) if ((sx - x) ** 2 + (sz - z) ** 2 < (r + pad) ** 2) return true; return false;
  };
  const free = (x, z, pad = 0, m = 6) => corr(x, z, m) > 0 && !occ(x, z) && !hitSolid(x, z, pad);
  for (const b of geo.buildings) if (b.rings[0]?.length >= 3) occRing(b.rings[0], 3);   // (every footprint of the survey: the generic extruder's too)
  const byName = (n) => geo.buildings.find((b) => b.name === n);
  // the lap as a polygon (what is infield)
  const loop = []; for (let i = 0; i < tr.n; i += 4) loop.push([tr.px[i], tr.pz[i]]);
  let CX = 0, CZ = 0, LX0 = Infinity, LZ0 = Infinity, LX1 = -Infinity, LZ1 = -Infinity; for (const [x, z] of loop) { CX += x; CZ += z; LX0 = Math.min(LX0, x); LX1 = Math.max(LX1, x); LZ0 = Math.min(LZ0, z); LZ1 = Math.max(LZ1, z); } CX /= loop.length; CZ /= loop.length;
  // (rastered once, 8 m cells: asked tens of thousands of times)
  const INX = Math.ceil((LX1 - LX0) / 8 + 1), INF = new Uint8Array(INX * Math.ceil((LZ1 - LZ0) / 8 + 1));
  for (let b = 0; b * 8 <= LZ1 - LZ0; b++) for (let a = 0; a * 8 <= LX1 - LX0; a++) INF[b * INX + a] = inRing(LX0 + a * 8 + 4, LZ0 + b * 8 + 4, loop) ? 1 : 0;
  const infield = (x, z) => x >= LX0 && x <= LX1 && z >= LZ0 && z <= LZ1 && INF[Math.floor((z - LZ0) / 8) * INX + Math.floor((x - LX0) / 8)] === 1;

  // ---- materials
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f3f5, roughness: 0.45, metalness: 0.2, emissive: 0x18191c });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1d3142, roughness: 0.06, metalness: 0.85, envMapIntensity: 1.6, emissive: 0x22303e, emissiveIntensity: 0.7 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0xa9c3d3, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false });
  const vmat = VMAT(), vmatD = VMAT({ side: THREE.DoubleSide, roughness: 0.55 });
  const boardMat = new THREE.MeshStandardMaterial({ map: boardAtlas(), roughness: 0.55, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: boardAtlas(), emissiveIntensity: 0.16 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x0b1a2e, emissive: 0x2a5aa8, emissiveIntensity: 0.9, roughness: 0.3, side: THREE.DoubleSide });
  const fansMat = fanMaterial(), flagMat = flagMaterial();
  const sheets = [];    // the cut-out people standing about: [x, y, z, ang, variant]
  const flagsUp = [];   // the waving flags: [x, y, z, ang, tile, scale, poleLen]
  const boards = [];    // geometries painted from the board atlas
  const vparts = [];    // vertex-coloured static parts (one merged mesh a 1 km cell: vcell)
  const VCELL = new Map(), vcell = (x, z, g) => { const k = `${Math.floor(x / 1000)},${Math.floor(z / 1000)}`; let a = VCELL.get(k); if (!a) VCELL.set(k, (a = [])); a.push(g); };
  const screens = [];
  const boxAt = (w, h, d, x, y, z, ang, hex) => vc(new THREE.BoxGeometry(w, h, d).rotateY(ang).translate(x, y, z), hex);

  // ======================================================================================================================
  // ---- the Silverstone Wing: on its footprint (fitted outside the pit lane's corridor), in its own frame: u along it
  //      toward the end the cars arrive from (the Club end, where the prow rises), v across it from the garages' side (the
  //      track's) to the paddock behind, y up
  // ======================================================================================================================
  let wingFrame = null;
  const wingB = def.pitBuilding && byName(def.pitBuilding);
  if (wingB) {
    claimed.add(wingB.id);
    const ring = fitRingOutsideCorridor(wingB.rings[0], tr, pit, 2);
    const info = footprintInfo(ring), c = info.c;
    let ux = Math.cos(info.angle), uz = Math.sin(info.angle);
    { const L0 = info.length, sA = tr.nearest(c[0] - ux * L0 / 2, c[1] - uz * L0 / 2).s, sB = tr.nearest(c[0] + ux * L0 / 2, c[1] + uz * L0 / 2).s; if (tr.wrapS(sB - sA) < tr.length / 2) { ux = -ux; uz = -uz; } }   /* (+u: toward the end passed first) */
    let vx = -uz, vz = ux; { const q = tr.nearest(c[0], c[1]), f = tr.sample(q.s, 0); if ((c[0] - f.x) * vx + (c[1] - f.z) * vz < 0) { vx = -vx; vz = -vz; } }   /* (+v: away from the track) */
    let uMin = Infinity, uMax = -Infinity; for (const [x, z] of ring) { const u = (x - c[0]) * ux + (z - c[1]) * uz; uMin = Math.min(uMin, u); uMax = Math.max(uMax, u); }
    const vs = []; for (const [x, z] of ring) { const u = (x - c[0]) * ux + (z - c[1]) * uz; if (Math.abs(u - (uMin + uMax) / 2) < (uMax - uMin) * 0.4) vs.push((x - c[0]) * vx + (z - c[1]) * vz); }
    const fF = Math.min(...vs), fB = Math.max(fF + 16, Math.max(...vs));   // the front (the garages' side) and the back
    const M = new THREE.Matrix4().makeBasis(new THREE.Vector3(ux, 0, uz), new THREE.Vector3(0, 1, 0), new THREE.Vector3(vx, 0, vz)).setPosition(c[0], 0, c[1]);
    const flip = M.determinant() < 0;
    // (a geometry built in the Wing's frame, into the world: a mirrored frame turns its triangles back the right way)
    const W = (g) => { g = nonIdx(g); g.applyMatrix4(M); if (flip) { const p = g.attributes.position.array, nrm = g.attributes.normal?.array, cl = g.attributes.color?.array, uv = g.attributes.uv?.array; for (let k = 0; k < p.length; k += 9) for (const arr of [p, nrm, cl]) if (arr) for (let j = 0; j < 3; j++) { const t = arr[k + 3 + j]; arr[k + 3 + j] = arr[k + 6 + j]; arr[k + 6 + j] = t; } if (uv) for (let k = 0; k < uv.length; k += 6) for (let j = 0; j < 2; j++) { const t = uv[k + 2 + j]; uv[k + 2 + j] = uv[k + 4 + j]; uv[k + 4 + j] = t; } } return g; };
    const at = (u, v) => [c[0] + ux * u + vx * v, c[1] + uz * u + vz * v];
    // (a picture on a plane, read the right way round from the track in a mirrored frame too)
    const mirrorU = (g) => { if (flip) { const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, 1 - uv.getX(k)); } return g; };
    wingFrame = { c, ux, uz, vx, vz, uMin, uMax, fF, fB, at };
    const B = (u0, u1, y0, y1, v0, v1, hex) => vc(new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0).translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2), hex);
    const parts = [], glassG = [], railG = [];
    const PEAK = 40, uP = uMax - PEAK, L = uMax - uMin;
    const LV = [5.4, 9.8, 14.2], TOPY = 18.6;
    const WHITE = 0xf3f4f6, PALE = 0xdfe3e7, RED = 0xa8222c, DARK = 0x2b2f35;
    // the ground floor behind the garages, the floors with their balconies (3 m out past the glass), the roof deck
    parts.push(B(uMin, uP + 3, 0, 5.4, fF + 0.8, fB, PALE), B(uMin, uP + 3, 0.4, 5.0, fF + 0.6, fF + 0.8, DARK));
    for (const y of LV) parts.push(B(uMin, uP + 2, y, y + 0.55, fF - 3.0, fB, WHITE), B(uMin, uP + 2, y + 0.55, y + 0.85, fF - 3.0, fF - 2.85, WHITE));
    parts.push(B(uMin, uP + 2, TOPY, TOPY + 0.6, fF - 0.6, fB, WHITE));
    glassG.push(B(uMin + 0.4, uP + 2, 5.95, TOPY, fF + 0.35, fF + 0.6, 0xffffff));
    for (const y of LV) railG.push(B(uMin, uP + 2, y + 0.55, y + 1.65, fF - 2.98, fF - 2.9, 0xffffff));
    // the mullions every 3.6 m, the slender columns at the balconies' edge every 21.6 m
    for (let u = uMin + 1.8; u < uP + 1; u += 3.6) for (const y of LV) parts.push(B(u - 0.09, u + 0.09, y + 0.55, y + 4.4, fF + 0.15, fF + 0.4, 0xc9cfd5));
    for (let u = uMin + 3; u < uP; u += 21.6) parts.push(B(u - 0.22, u + 0.22, 5.95, TOPY + 0.6, fF - 2.75, fF - 2.3, WHITE));
    // the back (the paddock's side): panels and window bands, the north end's glass
    parts.push(B(uMin, uP + 2, 0, TOPY, fB - 0.4, fB, PALE));
    for (const y of [6.4, 10.8, 15.2]) parts.push(B(uMin + 2, uP, y, y + 2.4, fB, fB + 0.05, 0x34404c));
    parts.push(B(uMin - 0.4, uMin, 0, TOPY + 0.6, fF - 0.6, fB, WHITE)); glassG.push(B(uMin - 0.5, uMin - 0.4, 6, TOPY - 0.4, fF + 2, fB - 2, 0xffffff));
    // the roof: the blades - long thin wing sections side by side down the building, each overlapping the next and raked
    // up toward the prow end, so their leading edges step up like stacked aircraft wings; white on top, pale under the
    // back, dark red under the overhang and on the blades' ends
    {
      const K = Math.max(6, Math.round((uP - uMin) / 30)), step = (uP + 8 - uMin) / K, vL = fF - 7.5;
      const base = (u) => TOPY + 1.0 + 3.6 * Math.pow(Math.max(0, (u - uMin) / (uP - uMin)), 1.5);
      for (let k = 0; k < K; k++) {
        const a = uMin - 4 + k * step, b = a + step + 6, ya = base(a), yb = ya + 2.3, lead = vL + (k % 2 ? 1.2 : 0);
        // (the section, round from the leading edge over the top and back under: [v, dy, colour of the face after it])
        const S = [[lead, 0, WHITE], [fF - 1, 1.05, WHITE], [fF + 8, 1.5, WHITE], [fB + 2.5, 0.85, PALE], [fB + 2.5, 0.25, PALE], [fF + 8, -0.05, PALE], [fF + 0.5, -0.15, RED], [lead + 0.6, -0.12, RED]];
        const P = [], C = [], col = new THREE.Color();
        const vtx = (u, s) => [u, (u === a ? ya : yb) + s[1], s[0]];
        for (let j = 0; j < S.length; j++) {
          const s0 = S[j], s1 = S[(j + 1) % S.length], A0 = vtx(a, s0), A1 = vtx(a, s1), B0 = vtx(b, s0), B1 = vtx(b, s1);
          P.push(...A0, ...B0, ...B1, ...A0, ...B1, ...A1); col.setHex(s0[2]); for (let q = 0; q < 6; q++) C.push(col.r, col.g, col.b);
        }
        for (const [u, sgn] of [[a, -1], [b, 1]]) for (let j = 1; j < S.length - 1; j++) {   // (the ends: dark red)
          const p0 = vtx(u, S[0]), p1 = vtx(u, S[j]), p2 = vtx(u, S[j + 1]);
          if (sgn > 0) P.push(...p0, ...p1, ...p2); else P.push(...p0, ...p2, ...p1); col.setHex(RED); for (let q = 0; q < 3; q++) C.push(col.r, col.g, col.b);
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.computeVertexNormals(); parts.push(g);
        // (its struts: raked from the top floor's edge up under the blade's front)
        for (const t of [0.3, 0.75]) { const u = a + (b - a) * t, yTop = (u === a ? ya : ya + (yb - ya) * t) - 0.1, h = yTop - TOPY; const s = new THREE.CylinderGeometry(0.18, 0.18, Math.hypot(h, 4.2), 6); s.rotateX(-Math.atan2(4.2, h)); s.translate(u, TOPY + h / 2, fF - 2.6 - 2.1); parts.push(vc(s, 0xd8dde2)); }
      }
    }
    // the prow: the dark wedge at the Club end - from the ground up past the roof to a sharp tip 44 m up, leaning out over
    // the pit lane; grey checks over its black, a red edge up its leading arris
    {
      const uA = uP - 1, uB = uMax + 1;
      // (its sections where it leaves the roof and at its end: low at the back, the tip high over the front)
      const SA = [[fF, 0], [fB, 0], [fB, 24.2], [fF - 6, 23.4], [fF - 1, 18.5]], SB = [[fF + 1, 0], [fB - 6, 0], [fB - 6, 13], [fF - 16, 44], [fF - 4.5, 30]];
      const P = [], U = [];
      const quad = (p0, p1, p2, p3) => {
        // (box-mapped: each face takes the two axes it spans most, 4 m to a check)
        const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], e2 = [p3[0] - p0[0], p3[1] - p0[1], p3[2] - p0[2]], n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
        const ax = Math.abs(n[0]) > Math.abs(n[1]) && Math.abs(n[0]) > Math.abs(n[2]) ? [2, 1] : Math.abs(n[1]) > Math.abs(n[2]) ? [0, 2] : [0, 1];
        for (const p of [p0, p1, p2, p0, p2, p3]) { P.push(...p); U.push(p[ax[0]] / 4, p[ax[1]] / 4); }
      };
      const n = SA.length;
      for (let j = 0; j < n; j++) { const a0 = SA[j], a1 = SA[(j + 1) % n], b0 = SB[j], b1 = SB[(j + 1) % n]; quad([uA, a0[1], a0[0]], [uB, b0[1], b0[0]], [uB, b1[1], b1[0]], [uA, a1[1], a1[0]]); }
      for (const [u, S, sgn] of [[uA, SA, -1], [uB, SB, 1]]) {
        const tri = THREE.ShapeUtils.triangulateShape(S.map(([v, y]) => new THREE.Vector2(v, y)), []);
        for (const [i0, i1, i2] of tri) { const pts = (sgn > 0 ? [i0, i1, i2] : [i0, i2, i1]).map((i) => [u, S[i][1], S[i][0]]); for (const p of pts) { P.push(...p); U.push(p[2] / 4, p[1] / 4); } }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.computeVertexNormals();
      // (if the loft's winding came out inside-out, its normals point in: flip them by the prow's centre)
      { const p = g.attributes.position, nn = g.attributes.normal; let dot = 0; const cu = (uA + uB) / 2, cy = 16, cv = (fF + fB) / 2; for (let k = 0; k < p.count; k++) dot += (p.getX(k) - cu) * nn.getX(k) + (p.getY(k) - cy) * nn.getY(k) + (p.getZ(k) - cv) * nn.getZ(k); if (dot < 0) { const a = p.array; for (let k = 0; k < a.length; k += 9) for (let j = 0; j < 3; j++) { const t = a[k + 3 + j]; a[k + 3 + j] = a[k + 6 + j]; a[k + 6 + j] = t; } const uv = g.attributes.uv.array; for (let k = 0; k < uv.length; k += 6) for (let j = 0; j < 2; j++) { const t = uv[k + 2 + j]; uv[k + 2 + j] = uv[k + 4 + j]; uv[k + 4 + j] = t; } g.computeVertexNormals(); } }
      const chk = canvasTex(128, 128, (x) => { x.fillStyle = '#16181b'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#4a4f56'; x.fillRect(0, 0, 64, 64); x.fillRect(64, 64, 64, 64); x.fillStyle = 'rgba(255,255,255,0.06)'; x.fillRect(0, 62, 128, 4); x.fillRect(62, 0, 4, 128); }, { repeat: true });
      const prow = new THREE.Mesh(W(g), new THREE.MeshStandardMaterial({ map: chk, roughness: 0.35, metalness: 0.45, emissive: 0x0a0b0d, side: THREE.DoubleSide })); prow.name = 'silverstone:prow'; group.add(prow);
      // (the red arris up its leading edge, from the roof to the tip; and along the tip's underside)
      for (const [p, q] of [[[uA, SA[3][1], SA[3][0]], [uB, SB[3][1], SB[3][0]]], [[uB, SB[3][1], SB[3][0]], [uB, SB[4][1], SB[4][0]]], [[uA, SA[4][1], SA[4][0]], [uB, SB[4][1], SB[4][0]]]]) {
        const d = new THREE.Vector3(q[0] - p[0], q[1] - p[1], q[2] - p[2]), l = d.length(), t = new THREE.CylinderGeometry(0.32, 0.32, l, 6);
        t.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); t.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2); parts.push(vc(t, 0xb3212b));
      }
      // its face: the podium balcony at 11 m (its rail, the three steps of the podium on it), the red-and-white chequered
      // panel over it, the F1 screen beside that
      const ub0 = uMax - 27, ub1 = uMax - 9;
      parts.push(B(ub0, ub1, 11.1, 11.65, fF - 6.8, fF - 0.4, WHITE), B(ub0, ub1, 10.6, 11.1, fF - 6.8, fF - 6.3, RED));
      railG.push(B(ub0, ub1, 11.65, 12.75, fF - 6.75, fF - 6.65, 0xffffff));
      for (const [du, h, hex] of [[-2.2, 0.9, 0xe8e8e8], [0, 1.3, 0xe8e8e8], [2.2, 0.6, 0xe8e8e8]]) parts.push(B((ub0 + ub1) / 2 + du - 1.1, (ub0 + ub1) / 2 + du + 1.1, 11.65, 11.65 + h, fF - 4.2, fF - 2.6, hex));
      const chq = canvasTex(256, 128, (x) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? '#c8102e' : '#ffffff'; x.fillRect(i * 16, j * 16, 16, 16); } });
      const cp = new THREE.PlaneGeometry(13, 4.6); cp.rotateY(Math.PI); cp.translate(uMax - 30 + 6.5, 15.4, fF - 3.4);   // (facing the pit straight)
      const chqMesh = new THREE.Mesh(W(mirrorU(cp)), new THREE.MeshStandardMaterial({ map: chq, side: THREE.DoubleSide, roughness: 0.6, emissive: 0xffffff, emissiveMap: chq, emissiveIntensity: 0.12 })); group.add(chqMesh);
      const f1 = canvasTex(512, 288, (x) => {
        x.fillStyle = '#0a0a0c'; x.fillRect(0, 0, 512, 288); x.fillStyle = '#e10600';
        x.save(); x.translate(256, 120); x.transform(1, 0, -0.35, 1, 0, 0);
        x.fillRect(-150, -60, 170, 26); x.fillRect(-150, -24, 120, 24); x.fillRect(-150, -60, 30, 120); x.fillRect(40, -60, 34, 120); x.beginPath(); x.moveTo(-10, 0); x.lineTo(40, -60); x.lineTo(40, -26); x.lineTo(10, 10); x.closePath(); x.fill(); x.restore();
        x.fillStyle = '#ffffff'; x.font = '900 34px Arial'; x.textAlign = 'center'; x.fillText('BRITISH GRAND PRIX', 256, 236); x.fillStyle = '#c8102e'; x.fillRect(0, 270, 512, 18);
      });
      const sp = new THREE.PlaneGeometry(14, 7.9); sp.rotateY(Math.PI); sp.translate(uMax - 9.5, 17.2, fF - 6.2);
      group.add(new THREE.Mesh(W(mirrorU(sp)), new THREE.MeshStandardMaterial({ map: f1, emissive: 0xffffff, emissiveMap: f1, emissiveIntensity: 0.55, roughness: 0.3, side: THREE.DoubleSide })));
      parts.push(B(uMax - 29.5, uMax - 29, 13, 17.8, fF - 3.3, fF - 1, 0x15171a), B(uMax - 18, uMax - 17.5, 13, 17.8, fF - 3.3, fF - 1, 0x15171a), B(uMax - 16.9, uMax - 2.1, 12.8, 21.6, fF - 5.9, fF - 5.4, 0x15171a), B(uMax - 13, uMax - 12, 13, 21, fF - 5.4, fF - 1.5, 0x15171a), B(uMax - 7, uMax - 6, 13, 21, fF - 5.4, fF - 1.5, 0x15171a));
      for (let k = 0; k < 14; k++) { const [x, z, a] = wingWorld(ub0 + 1 + k * 1.2 + rnd() * 0.3, fF - 5.2 - rnd() * 1.2); sheets.push([x, 11.65, z, a + (rnd() - 0.5) * 0.4, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
    }
    function wingWorld(u, v) { const [x, z] = at(u, v); return [x, z, Math.atan2(-vx, -vz)]; }
    // the open steps beyond the prow: rows climbing away from the pit lane, blue seats, full - set back from the lane as
    //  far as it needs (the pit entry curves in past the building's end), as long as there is room
    {
      const u0 = uMax + 2.5, tD = 1.45, tH = 0.62;
      const okR = (ua, ub, va, vb) => { for (let u = ua; u <= ub + 0.01; u += Math.max(2, (ub - ua) / 6)) for (let v = va; v <= vb + 0.01; v += Math.max(2, (vb - va) / 5)) { const [x, z] = at(u, v); if (corr(x, z, 1) < 0) return false; } return true; };
      let fit = null;
      for (const dv of [1, 5, 9, 13, 17, 21, 24]) { const v0 = fF + dv, rows = Math.min(13, Math.floor((fB + 12 - v0) / tD)); if (rows < 7) break; for (const len of [26, 22, 18, 14, 11, 9]) if (okR(u0, u0 + len, v0, v0 + rows * tD + 1)) { fit = { v0, rows, len }; break; } if (fit) break; }
      console.info(`[silverstone] the open steps beyond the prow: ${fit ? `${fit.rows} rows, ${fit.len} m` : 'no room'}`);
      if (fit) {
        const { v0: vS, rows, len } = fit;
        for (let k = 0; k < rows; k++) {
          const v0 = vS + k * tD, y = 0.5 + k * tH;
          parts.push(B(u0, u0 + len, 0, y, v0, v0 + tD, 0xb9bcc0), B(u0 + 0.3, u0 + len - 0.3, y, y + 0.4, v0 + 0.3, v0 + 0.75, 0x1f4fa8));
          for (let u = u0 + 0.7; u < u0 + len - 0.5; u += 0.64 + rnd() * 0.12) if (rnd() < 0.9) { const [x, z, a] = wingWorld(u, v0 + 0.85); sheets.push([x, y, z, a + (rnd() - 0.5) * 0.4, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
        }
        parts.push(B(u0 + len, u0 + len + 0.6, 0, rows * tH + 1.6, vS, vS + rows * tD, PALE), B(u0, u0 + len, 0, rows * tH + 1.6, vS + rows * tD, vS + 0.6 + rows * tD, PALE));
        for (let u = u0 + 2; u < u0 + len; u += 6) { const [x, z] = at(u, vS + rows * tD + 0.2); flagsUp.push([x, rows * tH + 1.4, z, Math.atan2(vx, vz), 0, 1.4, 6]); }
        boards.push(...(() => { const [ax, az] = at(u0, vS - 0.06), [bx, bz] = at(u0 + len, vS - 0.06); return [board(sampler([[ax, az], [bx, bz]], [vx, vz], 3), 0, 0.05, 1.1, rowOf('rolex'))]; })());
      }
    }
    // the guests on the balconies (the Paddock Club along the Wing's levels), looking down on the pit lane
    for (const y of LV) for (let u = uMin + 4; u < uP; u += 0.75) { if (rnd() > 0.5) continue; const v = fF - 2.4 + rnd() * 1.6, [x, z, a] = wingWorld(u, v); sheets.push([x, y + 0.55, z, a + (rnd() - 0.5) * 0.5, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
    const wing = new THREE.Group(); wing.name = 'scene:wing';
    wing.add(new THREE.Mesh(mergeGeometries(parts.map(W)), vmatD));
    wing.add(new THREE.Mesh(mergeGeometries(glassG.map((g) => keepPN(W(g)))), glassMat));
    wing.add(new THREE.Mesh(mergeGeometries(railG.map((g) => keepPN(W(g)))), railMat));
    group.add(wing);
    solids.push({ ring, h: 30 }); occRing(ring, 4); solid.push([c[0], c[1], 8]);
    for (let u = uMin; u <= uMax + 30; u += 20) { const [x, z] = at(u, (fF + fB) / 2); occDisc(x, z, 22); }
    console.info(`[silverstone] the Wing: ${L.toFixed(0)} m x ${(fB - fF).toFixed(1)} m, the prow at the ${tr.nearest(...at(uMax, 0)).s.toFixed(0)} m end`);
  }

  // ---- the footbridge from the hotel over the start to the Wing (the survey's bridge, 14.5 - 18.5 m up): a glass tube in
  //      a white frame, the race's name along it
  for (const b of geo.buildings) {
    if (b.props.building !== 'bridge' || !b.rings[0]) continue;
    const info = footprintInfo(b.rings[0]), q = tr.nearest(info.c[0], info.c[1]);
    if (Math.abs(q.d) > tr.wallAt(q.i, q.d > 0 ? 1 : -1) + 40) continue;   // (the ones over the circuit only: the others stay as the extruder makes them)
    claimed.add(b.id);
    const y0 = parseFloat(b.props.min_height) || 14.5, y1 = parseFloat(b.props.height) || y0 + 4, L = info.length + 2, Wd = Math.max(3.4, info.width), ang = -info.angle;
    const G = new THREE.Group(); G.name = 'scene:footbridge'; G.position.set(info.c[0], 0, info.c[1]); G.rotation.y = ang;
    const fr = [];
    const bx = (w, h, d, x, y, z) => fr.push(keepPN(new THREE.BoxGeometry(w, h, d).translate(x, y, z)));
    bx(L, 0.6, Wd + 0.4, 0, y0, 0); bx(L, 0.5, Wd + 0.4, 0, y1, 0);
    for (let x = -L / 2; x <= L / 2 + 0.01; x += 3) for (const z of [-Wd / 2, Wd / 2]) bx(0.18, y1 - y0, 0.18, x, (y0 + y1) / 2, z);
    for (let x = -L / 2; x < L / 2 - 2.9; x += 6) for (const z of [-Wd / 2 - 0.05, Wd / 2 + 0.05]) { const g = new THREE.BoxGeometry(0.14, Math.hypot(6, y1 - y0), 0.14); g.rotateZ(Math.atan2(6, y1 - y0)); g.translate(x + 3, (y0 + y1) / 2, z); fr.push(keepPN(g)); }
    G.add(new THREE.Mesh(mergeGeometries(fr), white));
    const gl = new THREE.BoxGeometry(L - 0.2, y1 - y0 - 0.6, Wd - 0.1); gl.translate(0, (y0 + y1) / 2, 0); G.add(new THREE.Mesh(gl, glassMat));
    G.updateMatrixWorld(true);
    // (its name boards along both faces, just under its roof)
    for (const z of [-Wd / 2 - 0.3, Wd / 2 + 0.3]) { const a = new THREE.Vector3(-L / 2 + 1, 0, z).applyMatrix4(G.matrixWorld), e = new THREE.Vector3(L / 2 - 1, 0, z).applyMatrix4(G.matrixWorld), o = new THREE.Vector3(0, 0, 0).applyMatrix4(G.matrixWorld), w = new THREE.Vector3(0, 0, z).applyMatrix4(G.matrixWorld); const P = sampler([[a.x, a.z], [e.x, e.z]], [o.x - w.x, o.z - w.z], 4); boards.push(board(P, 0, y1 - 1.6, y1 - 0.25, rowOf('britishgp'), 30)); }
    group.add(G);
  }

  // ---- the start gantry over the line: its black frame, the lights, the title partner's name across it
  {
    const s = 2, i = tr.idxAtS(s), f = tr.sample(s, 0), wl = tr.wallAt(i, 1) + 0.6, wr = tr.wallAt(i, -1) + 0.6, span = wl + wr;
    const G = new THREE.Group(); G.name = 'scene:gantry'; G.position.set(f.x + f.nx * (wl - wr) / 2, 0, f.z + f.nz * (wl - wr) / 2); G.rotation.y = Math.atan2(-f.nz, f.nx);
    const g = [], b = (w, h, d, x, y, z) => g.push(keepPN(new THREE.BoxGeometry(w, h, d).translate(x, y, z)));
    for (const x of [-span / 2, span / 2]) b(0.9, 9.5, 0.9, x, 4.75, 0);
    b(span + 0.9, 2.4, 0.8, 0, 7.9, 0); b(3.6, 1.5, 0.7, 0, 9.85, 0);
    G.add(new THREE.Mesh(mergeGeometries(g), new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: 0.6, metalness: 0.4 })));
    group.add(G); G.updateMatrixWorld(true);
    for (const z of [-0.42, 0.42]) { const a = new THREE.Vector3(-span / 2, 0, z).applyMatrix4(G.matrixWorld), e = new THREE.Vector3(span / 2, 0, z).applyMatrix4(G.matrixWorld), o = new THREE.Vector3(0, 0, 0).applyMatrix4(G.matrixWorld), w = new THREE.Vector3(0, 0, z).applyMatrix4(G.matrixWorld); const P = sampler([[a.x, a.z], [e.x, e.z]], [o.x - w.x, o.z - w.z], 4); boards.push(board(P, 0, 6.75, 9.05, rowOf('qatar'), span / 2)); }   /* (its normal turned in: read from outside) */
    const lamp = new THREE.MeshStandardMaterial({ color: 0x3a0a0a, emissive: 0x2a0000, roughness: 0.3 });
    for (let k = 0; k < 5; k++) for (const z of [-0.36, 0.36]) { const l = new THREE.Mesh(new THREE.CircleGeometry(0.22, 12), lamp); l.position.set(-1.4 + k * 0.7, 9.85, z); if (z < 0) l.rotation.y = Math.PI; G.add(l); }
  }

  // ---- the pit wall's banners (DHL's yellow, the Emirates red) along its face to the track, the length of the garages
  if (pit) {
    const side = pit.sideSign, a = tr.idxAtS(pit.entryS + 40), b = tr.idxAtS(pit.exitS - 40), n = tr.n;
    const inB = (i) => (a <= b ? i >= a && i <= b : i >= a || i <= b);
    for (const [row, ph] of [[rowOf('dhl'), 0], [rowOf('emirates'), 1]]) {
      const g = ribbon(tr, (i) => side * (tr.wallAt(i, side) - 0.07), (i) => side * (tr.wallAt(i, side) - 0.07), 0.05, { yB: 1.15, mask: (i) => inB(i) && inB((i + 1) % n) && tr.pitWall?.[i] && Math.floor(tr.s[i] / 36) % 2 === ph && Math.floor(tr.s[(i + 1) % n] / 36) % 2 === ph, uvFn: (i) => (-side * tr.s[i]) / BOARD_REPEAT });
      const uv = g.attributes.uv, [v0, v1] = rowV(row); for (let k = 0; k < uv.count; k++) { const across = uv.getX(k), along = uv.getY(k); uv.setXY(k, along, v0 + (v1 - v0) * across); }
      if (g.index.count) boards.push(keepPNU(nonIdx(g)));
    }
  }

  // ======================================================================================================================
  // ---- the grandstands, from their footprints: each one's front edge (the side of its outline toward the track), a
  //      straight run or - where the stand curves round the corner, as Club's does - a chain of straight runs, each a
  //      stand of its own for world/Grandstands.js (tiers, crowd), dressed here as one: its roof over the whole chain
  // ======================================================================================================================
  const stands = [], standGroups = [];
  const roofG = [], steelG = [];
  for (const b of standFootprints(geo, def)) {
    const D = DESIGN[b.name] || { roof: 'none', seat: 0x1f4fa8, brand: 'silverstone', flags: 'uk', name: 'SILVERSTONE' };
    const ring = b.rings[0]; claimed.add(b.id);
    // (the outline's edge every 2 m, each point's place along the lap and its distance off it; per 4 m of the lap the
    //  nearest point is the stand's front, the furthest its back)
    const pts = []; for (let k = 0; k < ring.length; k++) { const [ax, az] = ring[k], [bx, bz] = ring[(k + 1) % ring.length], l = Math.hypot(bx - ax, bz - az), m = Math.max(1, Math.ceil(l / 2)); for (let j = 0; j < m; j++) pts.push([ax + (bx - ax) * j / m, az + (bz - az) * j / m]); }
    const Q = pts.map(([x, z]) => { const q = tr.nearest(x, z); return { x, z, s: q.s, d: Math.abs(q.d), sd: Math.sign(q.d) }; });
    const s0 = Q[0].s; for (const e of Q) { let u = e.s - s0; if (u > tr.length / 2) u -= tr.length; if (u < -tr.length / 2) u += tr.length; e.u = u; }
    const bins = new Map(); for (const e of Q) { const k = Math.floor(e.u / 4); const o = bins.get(k); if (!o) bins.set(k, { f: e, b: e }); else { if (e.d < o.f.d) o.f = e; if (e.d > o.b.d) o.b = e; } }
    const keys = [...bins.keys()].sort((p, q) => p - q);
    let front = keys.map((k) => [bins.get(k).f.x, bins.get(k).f.z]);
    const depths = keys.map((k) => bins.get(k).b.d - bins.get(k).f.d).sort((p, q) => p - q), depth = Math.max(8, Math.min(26, depths[depths.length >> 1] || 12));
    const info = footprintInfo(ring); if (info.length < 14 || info.width < 4) continue;
    front = simplify(front, 1.6);
    for (let it = 0; it < 6 && front.length > 2; it++) { let worst = -1, wl = 12; for (let k = 1; k < front.length - 1; k++) { const l = Math.min(Math.hypot(front[k][0] - front[k - 1][0], front[k][1] - front[k - 1][1]), Math.hypot(front[k + 1][0] - front[k][0], front[k + 1][1] - front[k][1])); if (l < wl) { wl = l; worst = k; } } if (worst < 0) break; front.splice(worst, 1); }
    if (front.length < 2) continue;
    // (away from the track: by the outline's middle against its nearest point of the lap)
    const qc = tr.nearest(info.c[0], info.c[1]), fc = tr.sample(qc.s, 0); let ax0 = info.c[0] - fc.x, az0 = info.c[1] - fc.z; { const l = Math.hypot(ax0, az0) || 1; ax0 /= l; az0 /= l; }
    // (its front clear of the barrier by 3 m: the whole chain slid back together until it is - as world/Venue.js did)
    for (let k = 0; k < 20; k++) { let worst = Infinity; for (let j = 0; j < front.length - 1; j++) { const [p, q] = [front[j], front[j + 1]], l = Math.hypot(q[0] - p[0], q[1] - p[1]); for (let t = 0; t <= l; t += 5) worst = Math.min(worst, corr(p[0] + (q[0] - p[0]) * t / l, p[1] + (q[1] - p[1]) * t / l, 3)); } if (worst >= 0) break; front = front.map(([x, z]) => [x + ax0 * 2, z + az0 * 2]); }
    const tiers = D.tiers || Math.max(12, Math.min(22, Math.round((depth - 1.4) / TD)));
    const style = { roof: 'none', seat: D.seat ?? 0x1f4fa8, fill: D.fill ?? 0.93, shirts: UK_SHIRTS, poses: UK_POSES, tierH: TH, tierD: TD };
    const segs = [];
    for (let j = 0; j < front.length - 1; j++) {
      const [p, q] = [front[j], front[j + 1]], l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l < 6) continue;
      const ex = [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; let ez = [-ex[1], ex[0]]; if (ez[0] * ax0 + ez[1] * az0 < 0) ez = [-ez[0], -ez[1]];
      const st = { x: (p[0] + q[0]) / 2, z: (p[1] + q[1]) / 2, ex, ez, len: l + (front.length > 2 ? 0.6 : 0), tiers, name: b.name, style };
      stands.push(st); segs.push(st);
    }
    if (!segs.length) continue;
    // (the chain's normals at its corners: the mean of the two runs')
    const normals = front.map((_, k) => { const a = segs[Math.max(0, Math.min(segs.length - 1, k - 1))].ez, c = segs[Math.min(segs.length - 1, k)].ez; return [a[0] + c[0], a[1] + c[1]]; });
    const P = sampler(front, [ax0, az0], 3, normals);
    standGroups.push({ name: b.name, D, P, tiers, segs, front });
    const top = STAND.base + tiers * TH, back = 0.8 + tiers * TD;
    for (const st of segs) { const r = [[st.x - st.ex[0] * st.len / 2, st.z - st.ex[1] * st.len / 2], [st.x + st.ex[0] * st.len / 2, st.z + st.ex[1] * st.len / 2]]; r.push([r[1][0] + st.ez[0] * (back + 1), r[1][1] + st.ez[1] * (back + 1)], [r[0][0] + st.ez[0] * (back + 1), r[0][1] + st.ez[1] * (back + 1)]); occRing(r, 3); solid.push([st.x + st.ez[0] * back / 2, st.z + st.ez[1] * back / 2, st.len / 2 + 4]); }
    dressStand(standGroups[standGroups.length - 1], top, back);
  }

  /** a stand's own build round its tiers: the roof and what holds it up, the boards (its sponsor's along its front, its
   *  name on the roof's edge or over its back), the flags on their poles along its top, a big screen, its crowd's flags */
  function dressStand(S, top, back) {
    const { D, P } = S, roof = D.roof, rc = D.roofC ?? 0xf2f3f5, n = P.n;
    const rot = (i) => Math.atan2(P.tx[i], P.tz[i]), pos = (i, lz) => [P.px[i] + P.nx[i] * lz, P.pz[i] + P.nz[i] * lz];
    const col = (i, lz, y0, y1, w = 0.6) => { const [x, z] = pos(i, lz); steelG.push(boxAt(w, y1 - y0, w, x, (y0 + y1) / 2, z, rot(i), 0x9aa1a8)); };
    const tube = (a, b, r, hex = 0x9aa1a8) => { const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), l = d.length(); if (l < 0.1) return; const g = new THREE.CylinderGeometry(r, r, l, 6); g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())); g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); steelG.push(vc(g, hex)); };
    const every = (m) => { const out = []; let next = 1.5; for (let i = 0; i < n; i++) if (P.s[i] >= next || i === n - 1) { out.push(i); next = P.s[i] + m; } return out; };
    const darker = new THREE.Color(rc).multiplyScalar(0.72).getHex();
    let fasciaY = null, roofBackY = top + 1.2;
    if (roof === 'cantilever') {
      const yb = top + 4.2, yf = top + 6.4, lf = -2.2, lb = back + 0.8;
      roofG.push(panel(P, lb, lf, yb, yf, rc), panel(P, lf, lf, yf - 0.9, yf + 0.15, darker), panel(P, lb, lb, yb - 0.6, yb + 0.1, darker));
      for (const i of every(13)) { col(i, back + 0.5, 0, top + 9.2); const [mx, mz] = pos(i, back + 0.5), [fx, fz] = pos(i, back * 0.25); tube([mx, top + 9.2, mz], [fx, yb + (yf - yb) * ((lb - back * 0.25) / (lb - lf)), fz], 0.12); }
      fasciaY = [yf - 0.85, yf + 0.1, lf - 0.06]; roofBackY = yb;
    } else if (roof === 'flat') {
      const y = top + 5.2, lf = -0.9, lb = back + 0.7;
      roofG.push(panel(P, lb, lf, y, y, rc), panel(P, lf, lf, y - 0.8, y + 0.2, darker));
      for (const i of every(15)) { col(i, back + 0.4, 0, y, 0.5); col(i, 0.35, 1.2, y, 0.3); }
      fasciaY = [y - 0.75, y + 0.15, lf - 0.06]; roofBackY = y;
    } else if (roof === 'skillion') {
      const yb = top + 3.2, yf = top + 8.8, lf = -2.6, lb = back + 0.9;
      roofG.push(panel(P, lb, lf, yb, yf, rc), panel(P, lf, lf, yf - 0.7, yf + 0.1, darker));
      for (const i of every(12)) { col(i, back + 0.5, 0, yb, 0.55); const [bx, bz] = pos(i, back + 0.5), [fx, fz] = pos(i, lf + 1.2); tube([bx, yb, bz], [fx, yf - 0.4, fz], 0.16); col(i, 1.6, 1.2, top + 0.4 + (yf - top) * 0.82, 0.22); }
      fasciaY = [yf - 0.65, yf + 0.05, lf - 0.06]; roofBackY = yb;
    } else if (roof === 'arc') {
      // (a shell curving up from the back over the crowd and down a little to its front edge, in five facets)
      const prof = [[back + 1, top + 3.2], [back * 0.72, top + 6.6], [back * 0.42, top + 8.2], [back * 0.12, top + 8.0], [-1.6, top + 7.0], [-3.2, top + 6.0]];
      for (let k = 0; k < prof.length - 1; k++) roofG.push(panel(P, prof[k][0], prof[k + 1][0], prof[k][1], prof[k + 1][1], k % 2 ? rc : new THREE.Color(rc).multiplyScalar(0.94).getHex()));
      roofG.push(panel(P, -3.2, -3.2, top + 5.2, top + 6.05, 0xc8102e));
      for (const i of every(14)) { col(i, back + 0.6, 0, top + 3.2, 0.55); const [bx, bz] = pos(i, back + 0.6), [mx, mz] = pos(i, back * 0.42); tube([bx, top + 10.5, bz], [mx, top + 8.2, mz], 0.12); col(i, back + 0.6, top + 3.2, top + 10.5, 0.35); }
      fasciaY = null; roofBackY = top + 3.2;
    } else if (roof === 'membrane') {
      const lb = back + 0.6, mastAt = every(20), sAt = mastAt.map((i) => P.s[i]);
      const sag = (i) => { const s = P.s[i]; let k = 0; while (k < sAt.length - 2 && sAt[k + 1] < s) k++; const a = sAt[k], b2 = sAt[Math.min(sAt.length - 1, k + 1)], u = b2 > a ? (s - a) / (b2 - a) : 0; return Math.sin(Math.PI * Math.max(0, Math.min(1, u))); };
      const L5 = [lb, lb * 0.75, lb * 0.5, lb * 0.25, 0, -1.5];
      for (let k = 0; k < L5.length - 1; k++) { const va = 1 - L5[k] / lb, vb = 1 - L5[k + 1] / lb; roofG.push(keepPN(nonIdx(ribbon(P, () => L5[k], () => L5[k + 1], (i) => top + 6.4 + 2.2 * va - 1.6 * sag(i) * (0.4 + 0.6 * va), { closed: false, yB: (i) => top + 6.4 + 2.2 * vb - 1.6 * sag(i) * (0.4 + 0.6 * vb), colorFn: () => { const c = new THREE.Color(rc); return [c.r, c.g, c.b]; } })))); }
      for (const i of mastAt) col(i, lb, 0, top + 10, 0.6);
      roofBackY = top + 6.4;
    }
    // the railings: along the front over the parapet, and up the aisles every 12 m, raked with the rows
    for (let j = 0; j < S.segs.length; j++) {
      const st = S.segs[j], W3 = (lx, y, lz) => [st.x + st.ex[0] * lx + st.ez[0] * lz, y, st.z + st.ex[1] * lx + st.ez[1] * lz];
      const a = W3(-st.len / 2, 2.25, 0.4), b = W3(st.len / 2, 2.25, 0.4); tube([a[0], a[1], a[2]], [b[0], b[1], b[2]], 0.05, 0xc9ced4);
      for (let lx = -st.len / 2 + 6; lx < st.len / 2 - 3; lx += 12) { const p0 = W3(lx, STAND.base + 1.0, 0.9), p1 = W3(lx, top + 1.0, back - 0.2); tube([p0[0], p0[1], p0[2]], [p1[0], p1[1], p1[2]], 0.045, 0xc9ced4); }
    }
    // the sponsor's hoarding along the front (over the parapet), the name on the roof's edge - or, open to the sky, on a
    // board over the back of the top tier
    boards.push(board(P, -0.06, 0.05, 1.15, rowOf(D.brand)));
    if (fasciaY) boards.push(board(P, fasciaY[2], fasciaY[0], fasciaY[1], rowOf(D.name), Math.max(24, Math.min(40, P.length / Math.max(1, Math.round(P.length / 34))))));
    else if (roof === 'none') {
      const mid = P.length / 2, w = Math.min(P.length * 0.6, 36), mask = (i) => Math.abs(P.s[i] - mid) < w / 2 && Math.abs(P.s[Math.min(n - 1, i + 1)] - mid) < w / 2;
      boards.push(board(P, back + 0.15, top + 1.6, top + 3.0, rowOf(D.name), w, mask));
      for (const s of [mid - w / 2, mid + w / 2]) { let i = 0; while (i < n - 1 && P.s[i] < s) i++; col(i, back + 0.35, top, top + 3.0, 0.2); }
    } else if (roof === 'arc') boards.push(board(P, -3.26, top + 5.2, top + 6.05, rowOf(D.name), Math.max(24, Math.min(40, P.length / Math.max(1, Math.round(P.length / 34))))));
    // the flags on their poles along the top (over the back of the roof, or the back of the top tier)
    const pf = POLE_FLAGS[D.flags] || POLE_FLAGS.uk;
    for (const i of every(roof === 'none' ? 7.5 : 9)) { const [x, z] = pos(i, back + 0.4); flagsUp.push([x, roofBackY + 0.2, z, rot(i) + (rnd() - 0.5) * 0.3, pf[(rnd() * pf.length) | 0], 1.5, 6.5]); }
    // the crowd's own flags: one in about forty waved over the heads, most in the front rows
    for (const st of S.segs) {
      const m = Math.round(st.len * S.tiers / 22);
      for (let k = 0; k < m; k++) {
        const t = Math.floor(Math.pow(rnd(), 1.6) * S.tiers), lx = (rnd() - 0.5) * (st.len - 2), lz = 0.8 + t * TD + 0.7;
        flagsUp.push([st.x + st.ex[0] * lx + st.ez[0] * lz, STAND.base + t * TH, st.z + st.ex[1] * lx + st.ez[1] * lz, Math.atan2(st.ex[0], st.ex[1]) + (rnd() - 0.5) * 0.9, CROWD_FLAGS[(rnd() * CROWD_FLAGS.length) | 0], 0.85, 2.7]);
      }
    }
    // a big screen at one end, on its legs, turned to the track
    if (D.screen) {
      const i = D.screen === 'a' ? 0 : n - 1, dir = D.screen === 'a' ? -1 : 1, [x0, z0] = pos(i, back * 0.5), x = x0 + P.tx[i] * dir * 10, z = z0 + P.tz[i] * dir * 10;
      if (corr(x, z, 2) > 0 && !occ(x, z)) {
        const face = Math.atan2(-P.nx[i], -P.nz[i]), y = top + 6;
        const g = new THREE.PlaneGeometry(12, 6.8); g.rotateY(face); g.translate(x - P.nx[i] * 0.4, y, z - P.nz[i] * 0.4); screens.push(g);
        steelG.push(boxAt(13, 7.8, 0.6, x, y, z, face, 0x1b1d22));
        for (const o of [-4, 4]) { const lx = x + Math.cos(face) * o, lz = z - Math.sin(face) * o; steelG.push(boxAt(0.5, y - 3.9, 0.5, lx, (y - 3.9) / 2, lz, face, 0x1b1d22)); }
        solid.push([x, z, 8]); occDisc(x, z, 8);
      }
    }
  }
  if (roofG.length) { const m = new THREE.Mesh(mergeGeometries(roofG), vmatD); m.name = 'silverstone:roofs'; group.add(m); }
  if (steelG.length) { const m = new THREE.Mesh(mergeGeometries(steelG), vmat); m.name = 'silverstone:steel'; group.add(m); }
  console.info(`[silverstone] grandstands: ${standGroups.length} stands in ${stands.length} runs (${standGroups.filter((s) => s.segs.length > 1).map((s) => `${s.name} ${s.segs.length}`).join(', ')} curve)`);

  // ---- the old National pits by the National pit lane (the survey's two long garage blocks): white, a canopy along the
  //      front, a roller door in each team's colours under it; and the BRDC's clubhouse at Woodcote - white over a band of
  //      glass, the club's name on its roof
  {
    const TC = [0xff8000, 0xe8002d, 0x1e41ff, 0x27f4d2, 0x229971, 0x0093cc, 0x64c4ff, 0x52e252, 0x6692ff, 0x0a1f5c, 0xb6babd, 0xc8102e];
    let nPits = 0;
    for (const b of geo.buildings) {
      if (!/^garages?$/.test(b.props.building || '') || !b.rings[0]) continue;
      const info = footprintInfo(b.rings[0]), q = tr.nearest(info.c[0], info.c[1]); if (Math.abs(q.d) > 70 || info.length < 40) continue;
      claimed.add(b.id); nPits++;
      const th = info.angle, ang = -th, f = tr.sample(q.s, 0); let vx = -Math.sin(th), vz = Math.cos(th); if ((f.x - info.c[0]) * vx + (f.z - info.c[1]) * vz < 0) { vx = -vx; vz = -vz; }   /* (v: toward the track) */
      const [cx, cz] = info.c, Lg = info.length, Wd = info.width, H = 5.4, fx = cx + vx * Wd / 2, fz = cz + vz * Wd / 2;
      vcell(cx, cz, boxAt(Lg, H, Wd, cx, H / 2, cz, ang, 0xeef0f2)); vcell(cx, cz, boxAt(Lg + 0.4, 0.5, Wd + 0.4, cx, H + 0.25, cz, ang, 0x9aa1a8));
      vcell(cx, cz, boxAt(Lg, 0.35, 4.2, fx + vx * 2.1, 4.6, fz + vz * 2.1, ang, 0xf8f8f8));
      for (let u = -Lg / 2 + 3; u < Lg / 2 - 2; u += 5) { const k = Math.floor((u + Lg / 2) / 5), x = fx + Math.cos(th) * u + vx * 0.06, z = fz + Math.sin(th) * u + vz * 0.06; vcell(cx, cz, boxAt(4, 3.4, 0.12, x, 1.7, z, ang, TC[k % TC.length])); }
      for (let u = -Lg / 2 + 1; u <= Lg / 2 - 1; u += 10) vcell(cx, cz, boxAt(0.25, 4.4, 0.25, fx + Math.cos(th) * u + vx * 4.0, 2.2, fz + Math.sin(th) * u + vz * 4.0, ang, 0xd8dde2));
      const P = sampler([[fx + vx * 4.25 - Math.cos(th) * Lg / 2, fz + vz * 4.25 - Math.sin(th) * Lg / 2], [fx + vx * 4.25 + Math.cos(th) * Lg / 2, fz + vz * 4.25 + Math.sin(th) * Lg / 2]], [-vx, -vz], 4);
      boards.push(board(P, 0, 4.45, 5.15, rowOf('silverstone'), 30));
    }
    const brdc = byName('BRDC Clubhouse');
    if (brdc?.rings[0]) {
      claimed.add(brdc.id);
      const ring = brdc.rings[0], body = extrudeFootprint([ring], 11.5), info = footprintInfo(ring), q = tr.nearest(info.c[0], info.c[1]), f = tr.sample(q.s, 0);
      if (body) { body.computeVertexNormals(); vcell(info.c[0], info.c[1], vc(body, 0xf1f2f4)); }
      const cc = info.c, grown = ring.map(([x, z]) => [cc[0] + (x - cc[0]) * 1.01, cc[1] + (z - cc[1]) * 1.01]);
      for (const y of [3.4, 7.4]) { const gb = extrudeFootprint([grown], 2.6, y); if (gb) { gb.computeVertexNormals(); vcell(cc[0], cc[1], vc(gb, 0x24384a)); } }
      let dx = f.x - cc[0], dz = f.z - cc[1]; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      const bx = cc[0] + dx * info.width * 0.3, bz = cc[1] + dz * info.width * 0.3, P = sampler([[bx - dz * 7, bz + dx * 7], [bx + dz * 7, bz - dx * 7]], [-dx, -dz], 2);
      boards.push(board(P, 0, 12.0, 14.2, rowOf('BRDC'), 14));
      for (const o of [-6, 6]) vcell(cc[0], cc[1], boxAt(0.2, 2.8, 0.2, bx - dz * o, 12.9, bz + dx * o, 0, 0x8a9096));
    }
    console.info(`[silverstone] the National pits: ${nPits} garage blocks dressed${brdc ? ', the BRDC clubhouse' : ''}`);
  }

  // the rest of the weekend round them
  const life = buildLife();

  // ---- build: the boards, the screens, the people, the flags
  if (boards.length) { const m = new THREE.Mesh(mergeGeometries(boards.map((g) => keepPNU(nonIdx(g)))), boardMat); m.name = 'silverstone:boards'; group.add(m); }
  if (screens.length) { const m = new THREE.Mesh(mergeGeometries(screens.map((g) => keepPN(g))), screenMat); m.name = 'silverstone:screens'; group.add(m); }
  for (const list of VCELL.values()) { const m = merged(list, vmat, 'silverstone:parts', 3200); if (m) group.add(m); }
  {
    const cells = new Map(); for (const sh of sheets) { const k = `${Math.floor(sh[0] / 800)},${Math.floor(sh[2] / 800)}`; let a = cells.get(k); if (!a) cells.set(k, (a = [])); a.push(sh); }
    for (const list of cells.values()) { const im = fanMesh(list, fansMat, rnd, { shirts: UK_SHIRTS }); im.name = 'silverstone:fans'; im.userData.cut = 2200; group.add(im); }
  }
  if (flagsUp.length) {
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(), p3 = new THREE.Vector3();
    const cells = new Map(); for (const f of flagsUp) { const k = `${Math.floor(f[0] / 1200)},${Math.floor(f[2] / 1200)}`; let a = cells.get(k); if (!a) cells.set(k, (a = [])); a.push(f); }
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xc9ccd0 });
    for (const list of cells.values()) {
      // (the flag's quad at the top of its pole; the pole a unit cylinder stretched to its length)
      const flagG = new THREE.PlaneGeometry(1.4, 0.9, 3, 1); flagG.translate(0.7, -0.45, 0);
      const poleG = new THREE.CylinderGeometry(0.035, 0.035, 1, 3, 1, true); poleG.translate(0, 0.5, 0);
      const fl = new THREE.InstancedMesh(flagG, flagMat, list.length), po = new THREE.InstancedMesh(poleG, poleMat, list.length), tile = new Float32Array(list.length);
      list.forEach(([x, y, z, a, t, s, pl], k) => {
        q4.setFromAxisAngle(up, a); m4.compose(p3.set(x, y + pl, z), q4, sc.set(s, s, s)); fl.setMatrixAt(k, m4);
        m4.compose(p3.set(x, y, z), q4, sc.set(1, pl, 1)); po.setMatrixAt(k, m4); tile[k] = t;
      });
      flagG.setAttribute('aTile', new THREE.InstancedBufferAttribute(tile, 1));
      for (const im of [fl, po]) { im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = 'silverstone:flags'; im.userData.cut = 1300; group.add(im); }
    }
  }
  const helis = buildHelicopters(group, tr);
  console.info(`[silverstone] ${sheets.length} people about, ${flagsUp.length} flags, ${solids.length} solid footprints - built in ${(performance.now() - t0).toFixed(0)} ms`);

  // ======================================================================================================================
  // ---- the life round the circuit (filled in below)
  // ======================================================================================================================
  function buildLife() {
    const L = tr.length, n = tr.n, inR = (s, a, b) => (a <= b ? s >= a && s <= b : s >= a || s <= b);
    const walkers = [];   // [ax, ay, az, bx, by, bz, speed]
    const sm = (v) => { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); };
    const TEAMC = [0xff8000, 0xe8002d, 0x1e41ff, 0x27f4d2, 0x229971, 0x0093cc, 0x64c4ff, 0x52e252, 0x6692ff, 0x0a1f5c, 0xc8102e, 0xffffff];

    // ==================================================================================================================
    // ---- the general-admission banks: both sides of the lap wherever nothing else stands - behind the run-off's or the
    //      verge's cap by GAP metres of open grass (a car off the road runs out onto grass as it always has, and meets the
    //      crowd's fence only far beyond), each 110-180 m long, its own depth, its own mound raked up from the fence
    // ==================================================================================================================
    const GAP = 13, zones = [];
    const pr = pit ? [tr.wrapS(pit.entryS - 70), tr.wrapS(pit.exitS + 70)] : null;
    // (where each stand stands along the lap: its run's ends and middle, as the lap passes them - a stand's own, not
    //  another part of the lap's it happens to be nearer to)
    const cover = standGroups.map((S) => { const m = tr.nearest(...S.front[S.front.length >> 1]), s0 = m.s; let a = 0, b = 0; for (const p of S.front) { const q = tr.nearest(p[0], p[1]); let u = q.s - s0; if (u > L / 2) u -= L; if (u < -L / 2) u += L; if (Math.abs(u) > S.P.length) continue; a = Math.min(a, u); b = Math.max(b, u); } return { side: Math.sign(m.d) || 1, a: tr.wrapS(s0 + a - 12), b: tr.wrapS(s0 + b + 12), name: S.name }; });
    if (wingFrame) { const qa = tr.nearest(...wingFrame.at(wingFrame.uMin, 0)), qb = tr.nearest(...wingFrame.at(wingFrame.uMax + 30, 0)); cover.push({ side: Math.sign(qa.d) || 1, a: tr.wrapS(qb.s - 40), b: tr.wrapS(qa.s + 40), name: 'the Wing' }); }   /* (the cars pass its prow end first) */
    const fdOf = {};
    for (const side of [1, -1]) {
      const raw = new Float32Array(n), fd = new Float32Array(n), ok = new Uint8Array(n);
      for (let i = 0; i < n; i++) raw[i] = Math.max(tr.wallAt(i, side) + GAP, tr.edgeAt(i, side) + tr.kerbWidth + 24);
      // (the line smoothed - never brought nearer: the most of its neighbours' over 24 m, then eased)
      const mx = new Float32Array(n); for (let i = 0; i < n; i++) { let m = 0; for (let k = -12; k <= 12; k++) m = Math.max(m, raw[(i + k + n) % n]); mx[i] = m; }
      for (let i = 0; i < n; i++) { let a = 0; for (let k = -8; k <= 8; k++) a += mx[(i + k + n) % n]; fd[i] = Math.max(raw[i], a / 17); }
      fdOf[side] = fd;
      for (let i = 0; i < n; i++) {
        const s = tr.s[i]; if (pr && side === pit.sideSign && inR(s, ...pr)) continue;
        if (cover.some((c) => c.side === side && inR(s, c.a, c.b))) continue;
        let c = 0; for (let k = -12; k <= 12; k++) c = Math.max(c, tr.curv[(i + k + n) % n] * side);
        if (c > 1e-4 && fd[i] + 34 > 1 / c - 14) continue;   /* (on the inside of a bend: never out past its centre) */
        let good = true;
        for (const dd of [0, 12, 24, 34]) { const d = fd[i] + dd, x = tr.px[i] + tr.nx[i] * side * d, z = tr.pz[i] + tr.nz[i] * side * d; if (corr(x, z, 4) <= 0 || occ(x, z)) { good = false; break; } }   /* (clear of the other parts of the lap, of what stands) */
        ok[i] = good ? 1 : 0;
      }
      let st = 0; while (st < n && ok[st]) st++; if (st >= n) st = 0;
      for (let k = 0; k < n;) {
        const i0 = (st + k) % n; if (!ok[i0]) { k++; continue; }
        let m = 0; while (m < n && ok[(i0 + m) % n]) m++;
        // (a run of open ground: cut into banks, a gap between each)
        let j = 0;
        while (j < m) {
          const sA = tr.s[(i0 + j) % n], len = 110 + vnoise(sA / 97, side, 5) * 70, cnt = Math.min(m - j, Math.round(len / tr.ds));
          if (cnt * tr.ds >= 50 && vnoise(sA / 150, side * 3, 7) > 0.2) zones.push({ i0: (i0 + j) % n, cnt, side, fd, s0: sA, depth: 10 + vnoise(sA / 210, side, 9) * 12, rise: 1.4 + vnoise(sA / 180, side, 11) * 2.6, fill: 0.62 + vnoise(sA / 160, side, 13) * 0.26, brand: BRANDS[(Math.floor(sA / 400) + (side > 0 ? 3 : 0)) % 12] });
          j += cnt + Math.round(10 / tr.ds);
        }
        k += m;
      }
    }
    // (each bank: its ground mesh, the crowd on it, its fence with the boards along its foot, the walkway and the stalls
    //  behind it - and its footprint for the cars: from the fence back, a solid)
    const berms = [], fenceG = [], pathG = [];
    let nBank = 0;
    for (const Z of zones) {
      const { side, fd, cnt, depth, rise } = Z, tot = depth + rise * 3, cr = depth / tot;
      const idx = (k) => (Z.i0 + k) % n, ptAt = (i, d) => [tr.px[i] + tr.nx[i] * side * d, tr.pz[i] + tr.nz[i] * side * d];
      const hAt = (k, u) => rise * (u < cr ? sm(u / cr) : sm((1 - u) / (1 - cr))) * sm(Math.min(k, cnt - 1 - k) * tr.ds / 22);
      Z.hAt = hAt;
      // the mound: from the fence up to its crest behind the last row, down again behind it
      const P = [], UV = [], I = [], rows = Math.ceil(tot / 3) + 1; let cols = 0;
      for (let k = 0; k < cnt; k += 2) { const i = idx(k); for (let r = 0; r < rows; r++) { const u = r / (rows - 1), [x, z] = ptAt(i, fd[i] + 0.3 + tot * u); P.push(x, hAt(k, u) + 0.04, z); UV.push(x / 7, z / 7); occDisc(x, z, 3); } cols++; }
      for (let c = 0; c < cols - 1; c++) for (let r = 0; r < rows - 1; r++) { const a = c * rows + r, b = a + 1, cc = a + rows, d = cc + 1; I.push(a, cc, b, b, cc, d); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); g.setIndex(I); g.computeVertexNormals(); berms.push(nonIdx(g));
      // the crowd: packed at the fence, thinning toward the back; groups sitting on the grass, flags, golf umbrellas
      for (let k = 0; k < cnt; k++) {
        if (k % 1 !== 0) continue;
        const i = idx(k), ang = Math.atan2(-tr.nx[i] * side, -tr.nz[i] * side);
        for (let w = 0; w < 3; w++) {
          for (let d = 1.2; d <= depth - 0.5; d += 1.1) {
            if (rnd() > Z.fill * (1.3 - 0.75 * d / depth) * 0.95) continue;
            const dd = fd[i] + 0.3 + d + (rnd() - 0.5) * 0.5, [x0, z0] = ptAt(i, dd), x = x0 + tr.tx[i] * (w - 1) * 0.68 + (rnd() - 0.5) * 0.3, z = z0 + tr.tz[i] * (w - 1) * 0.68 + (rnd() - 0.5) * 0.3, y = hAt(k, (d + 0.3) / tot);
            if (rnd() < 0.05) { for (let q = 0; q < 3; q++) sheets.push([x + (rnd() - 0.5) * 1.4, y + 0.02, z + (rnd() - 0.5) * 1.4, ang + (rnd() - 0.5) * 0.8, 8 + ((rnd() * 2) | 0)]); continue; }
            sheets.push([x, y, z, ang + (rnd() - 0.5) * 0.5, UK_POSES[(rnd() * UK_POSES.length) | 0]]);
            if (d < 5 && rnd() < 0.03) flagsUp.push([x, y, z, ang + Math.PI / 2 + (rnd() - 0.5) * 0.8, CROWD_FLAGS[(rnd() * CROWD_FLAGS.length) | 0], 0.9, 2.8]);
            else if (rnd() < 0.006) flagsUp.push([x, y, z, ang + Math.PI / 2 + (rnd() - 0.5), CROWD_FLAGS[(rnd() * CROWD_FLAGS.length) | 0], 1.2, 4.2]);
          }
        }
      }
      // the fence: the boards along its foot, the mesh over them
      const fp = []; for (let k = 0; k < cnt; k += 2) fp.push(ptAt(idx(k), fd[idx(k)] - 0.2)); fp.push(ptAt(idx(cnt - 1), fd[idx(cnt - 1)] - 0.2));
      const nrm = []; for (let k = 0; k < cnt; k += 2) nrm.push([tr.nx[idx(k)] * side, tr.nz[idx(k)] * side]); nrm.push([tr.nx[idx(cnt - 1)] * side, tr.nz[idx(cnt - 1)] * side]);
      const FP = sampler(fp, [0, 0], 3, nrm);
      boards.push(board(FP, 0, 0.02, 1.0, rowOf(Z.brand)));
      fenceG.push(keepPNU(nonIdx(ribbon(FP, () => 0.05, () => 0.05, 1.0, { closed: false, yB: 3.1, uvFn: (i) => FP.s[i] / 3 }))));
      // (the solid: from the fence to behind the crowd)
      const ring = []; for (let k = 0; k < cnt; k += 4) ring.push(ptAt(idx(k), fd[idx(k)] - 0.3)); ring.push(ptAt(idx(cnt - 1), fd[idx(cnt - 1)] - 0.3));
      for (let k = cnt - 1; k >= 0; k -= 4) ring.push(ptAt(idx(k), fd[idx(k)] + depth + 1.5)); ring.push(ptAt(idx(0), fd[idx(0)] + depth + 1.5));
      solids.push({ ring, h: 3.2 });
      // the walkway behind the bank, people along it, and the backs: food trucks, marquees, bars, the toilets, a flagpole
      // or a light tower between, now and then a big screen
      const wd = (i) => fd[i] + tot + 4, wp = []; for (let k = 0; k < cnt; k += 3) { const [x, z] = ptAt(idx(k), wd(idx(k))); if (corr(x, z, 6) > 0) wp.push([x, z]); }
      if (wp.length > 3) { pathG.push(sampler(wp, [0, 0], 4, wp.map((_, j) => { const i = idx(Math.min(cnt - 1, j * 3)); return [tr.nx[i] * side, tr.nz[i] * side]; }))); for (let j = 0; j + 1 < wp.length; j++) { const m = Math.round(Math.hypot(wp[j + 1][0] - wp[j][0], wp[j + 1][1] - wp[j][1]) * 0.25); for (let q = 0; q < m; q++) { const o = (rnd() - 0.5) * 3; walkers.push([wp[j][0] + tr.nx[idx(j * 3)] * o, 0.02, wp[j][1] + tr.nz[idx(j * 3)] * o, wp[j + 1][0], 0.02, wp[j + 1][1], 0.8 + rnd() * 0.6]); } } }
      for (let k = 6; k < cnt - 6; k += Math.round((14 + rnd() * 14) / tr.ds)) {
        const i = idx(k), [x, z] = ptAt(i, wd(i) + 7), ang = Math.atan2(tr.tx[i], tr.tz[i]), face = Math.atan2(-tr.nx[i] * side, -tr.nz[i] * side);
        if (corr(x, z, 6) <= 0 || hitSolid(x, z, 4)) continue;
        const r = rnd(), hex = TEAMC[(rnd() * TEAMC.length) | 0];
        if (r < 0.32) { vcell(x, z, boxAt(2.6, 3.0, 7, x, 1.6, z, ang, hex)); vcell(x, z, boxAt(1.6, 0.1, 6, x - tr.nx[i] * side * 2.0, 2.8, z - tr.nz[i] * side * 2.0, ang, 0xf4f4f2)); for (let q = 0; q < 5; q++) sheets.push([x - tr.nx[i] * side * (2.6 + q * 0.8), 0, z - tr.nz[i] * side * (2.6 + q * 0.8), face + Math.PI, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
        else if (r < 0.6) { vcell(x, z, boxAt(6, 2.6, 6, x, 1.3, z, ang, 0xf4f4f2)); vcell(x, z, vc(new THREE.ConeGeometry(4.3, 2, 4).rotateY(Math.PI / 4 + ang).translate(x, 3.6, z), hex === 0xffffff ? 0xc8102e : hex)); for (let q = 0; q < 6; q++) sheets.push([x - tr.nx[i] * side * (3.6 + rnd() * 2), 0, z - tr.nz[i] * side * (3.6 + rnd() * 2) + (rnd() - 0.5) * 4, face + Math.PI, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
        else if (r < 0.78) { for (let q = 0; q < 8; q++) { const o = (q - 3.5) * 1.42; vcell(x, z, boxAt(1.3, 2.3, 1.3, x + tr.tx[i] * o, 1.15, z + tr.tz[i] * o, ang, 0x2a62b8)); } }
        else if (r < 0.92) { flagsUp.push([x, 0, z, ang, CROWD_FLAGS[(rnd() * CROWD_FLAGS.length) | 0], 2.4, 9]); flagsUp.push([x + tr.tx[i] * 4, 0, z + tr.tz[i] * 4, ang, 0, 2.4, 9]); }
        else { vcell(x, z, boxAt(1.6, 1.1, 3.2, x, 0.8, z, ang, 0xe8c21a)); vcell(x, z, boxAt(0.25, 9, 0.25, x, 5.8, z, ang, 0x9aa0a6)); vcell(x, z, boxAt(2.6, 0.9, 0.5, x, 10.4, z, ang, 0x2a2a2a)); }
        solid.push([x, z, 5]); occDisc(x, z, 5);
      }
      if (nBank % 3 === 1) {
        const k = cnt >> 1, i = idx(k), [x, z] = ptAt(i, wd(i) + 2), face = Math.atan2(-tr.nx[i] * side, -tr.nz[i] * side);
        if (corr(x, z, 4) > 0) { const y = 11.5, g = new THREE.PlaneGeometry(13, 7.4); g.rotateY(face); g.translate(x - tr.nx[i] * side * 0.4, y, z - tr.nz[i] * side * 0.4); screens.push(g); vcell(x, z, boxAt(14, 8.4, 0.6, x, y, z, face, 0x1b1d22)); for (const o of [-4.5, 4.5]) vcell(x, z, boxAt(0.5, y - 4.2, 0.5, x + Math.cos(face) * o, (y - 4.2) / 2, z - Math.sin(face) * o, face, 0x1b1d22)); solid.push([x, z, 8]); }
      }
      nBank++;
    }
    {
      const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), r2 = rng(71);
      x.fillStyle = '#4f7a35'; x.fillRect(0, 0, 256, 256);
      for (let k = 0; k < 4200; k++) { const t2 = r2(); x.fillStyle = t2 < 0.45 ? '#5a8a3c' : t2 < 0.8 ? '#466e2e' : '#6f8f48'; x.fillRect(r2() * 256, r2() * 256, 1 + r2() * 2, 1 + r2() * 2); }
      for (let k = 0; k < 16; k++) { const px = r2() * 256, py = r2() * 256, rr = 8 + r2() * 22, gr = x.createRadialGradient(px, py, 0, px, py, rr); gr.addColorStop(0, 'rgba(128,116,80,0.7)'); gr.addColorStop(1, 'rgba(128,116,80,0)'); x.fillStyle = gr; x.fillRect(px - rr, py - rr, rr * 2, rr * 2); }
      for (let k = 0; k < 120; k++) { x.fillStyle = r2() < 0.7 ? 'rgba(240,240,236,0.9)' : 'rgba(255,128,0,0.9)'; x.fillRect(r2() * 256, r2() * 256, 2, 2); }
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      if (berms.length) { const m = new THREE.Mesh(mergeGeometries(berms.map(keepPNU)), new THREE.MeshStandardMaterial({ map: t, roughness: 1, side: THREE.DoubleSide })); m.name = 'silverstone:banks'; group.add(m); }
    }
    if (pathG.length) { const m = new THREE.Mesh(mergeGeometries(pathG.map((P) => keepPN(nonIdx(ribbon(P, () => -2.2, () => 2.2, 0.06, { closed: false, colorFn: () => [0.62, 0.58, 0.48] }))))), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); m.name = 'silverstone:walkways'; group.add(m); }
    if (fenceG.length) { const m = new THREE.Mesh(mergeGeometries(fenceG), new THREE.MeshStandardMaterial({ map: fenceTexture(), alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.4, emissive: 0x15171a })); m.name = 'silverstone:fences'; m.geometry.computeBoundingSphere(); group.add(m); }

    // ---- trackside: the marshal posts on the grass behind the run-offs (a white hut, its orange roof, its number, two or
    //      three marshals in orange) and the TV towers on the outside of the corners
    {
      let k = 0;
      for (let s = 60; s < L - 60; s += 240 + rnd() * 60, k++) {
        const side = k % 2 ? 1 : -1; if (pr && side === pit.sideSign && inR(s, ...pr)) continue;
        const i = tr.idxAtS(s), w = tr.wallAt(i, side), f = tr.sample(s, 0), d = w + (tr.barL[i] && side > 0 || tr.barR[i] && side < 0 ? 3.5 : 3.2), x = f.x + f.nx * side * d, z = f.z + f.nz * side * d, ang = Math.atan2(f.tx, f.tz);
        if (corr(x, z, 0.5) <= 0 || occ(x, z)) continue;
        vcell(x, z, boxAt(2.6, 2.3, 2.4, x, 1.15, z, ang, 0xeeeeea)); vcell(x, z, boxAt(3.2, 0.25, 3.0, x, 2.45, z, ang, 0xf36c21)); vcell(x, z, boxAt(0.12, 2.2, 0.12, x - f.nx * side * 1.8, 1.1, z - f.nz * side * 1.8, ang, 0x30343a)); vcell(x, z, boxAt(0.18, 0.75, 1.1, x - f.nx * side * 1.8, 2.45, z - f.nz * side * 1.8, ang, 0x111214));
        const face = Math.atan2(-f.nx * side, -f.nz * side);
        for (let j = 0; j < 2 + ((rnd() * 2) | 0); j++) sheets.push([x - f.nx * side * 1.6 + f.tx * (j - 1) * 1.1, 0, z - f.nz * side * 1.6 + f.tz * (j - 1) * 1.1, face + (rnd() - 0.5) * 0.4, [0, 1, 4, 6][(rnd() * 4) | 0]]);
        solid.push([x, z, 3]);
      }
      for (const Zc of tr.cornerZones) {
        if (!Zc.dir) continue; const side = -Zc.dir, i = Math.round(Zc.a + ((Zc.b - Zc.a + n) % n) * 0.4) % n, s = tr.s[i];
        if (pr && side === pit.sideSign && inR(s, ...pr)) continue;
        const f = tr.sample(s, 0), w = tr.wallAt(i, side), x = f.x + f.nx * side * (w + 7), z = f.z + f.nz * side * (w + 7), ang = Math.atan2(f.tx, f.tz), top = 7.5;
        if (corr(x, z, 2) <= 0 || occ(x, z)) continue;
        for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) vcell(x, z, boxAt(0.1, top, 0.1, x + Math.cos(ang) * a * 1.1 + Math.sin(ang) * b * 1.1, top / 2, z - Math.sin(ang) * a * 1.1 + Math.cos(ang) * b * 1.1, ang, 0x9aa0a6));
        for (let y = 1.7; y < top; y += 1.7) vcell(x, z, boxAt(2.3, 0.07, 2.3, x, y, z, ang, 0x9aa0a6));
        vcell(x, z, boxAt(2.6, 0.12, 2.6, x, top, z, ang, 0x6b6f75)); vcell(x, z, vc(new THREE.ConeGeometry(1.25, 0.45, 8, 1, true).translate(x, top + 2.25, z), 0x1e3a8a)); vcell(x, z, boxAt(0.35, 0.4, 0.7, x - f.nx * side * 0.6, top + 0.8, z - f.nz * side * 0.6, ang, 0x1a1b1e));
        sheets.push([x, top + 0.06, z, Math.atan2(-f.nx * side, -f.nz * side), 0]); solid.push([x, z, 3]); occDisc(x, z, 3);
      }
    }

    // ---- the other tracks on the site: the Stowe circuit in the infield (and its pit road), the National pit lane by
    //      the old pits, the Porsche Experience's handling circuits - asphalt, white-lined; wherever they meet the Grand
    //      Prix circuit they give way to it
    const asphalt = [];
    {
      const gp = new Set(def.ways), skip = new Set([def.pitLaneWayId]);
      for (const r of geo.roads) {
        if (r.highway !== 'raceway' || gp.has(r.id) || skip.has(r.id) || r.pts.length < 2) continue;
        const w = /national pit/i.test(r.name) ? 12 : /stowe/i.test(r.name) ? 10 : 8;
        const P = sampler(r.pts, [1, 0], 2), clear = P.px.map((x, i) => gapAt(x, P.pz[i]) > w / 2 + 1), mask = (i) => clear[i] && clear[Math.min(P.n - 1, i + 1)];
        asphalt.push(ribbon(P, () => -w / 2, () => w / 2, 0.035, { closed: false, mask, colorFn: () => [0.32, 0.33, 0.35] }));
        for (const e of [-1, 1]) asphalt.push(ribbon(P, () => e * (w / 2 - 0.5), () => e * (w / 2 - 0.25), 0.045, { closed: false, mask, colorFn: () => [0.85, 0.85, 0.82] }));
        occPoly(r.pts, w + 6);
      }
      if (asphalt.length) { const m = new THREE.Mesh(mergeGeometries(asphalt.filter((g) => g.index?.count).map((g) => keepPN(nonIdx(g)))), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); m.name = 'silverstone:tracks'; group.add(m); }
    }

    // ---- the paddock behind the Wing: its paving, the teams' motorhomes in a row (glass, white, a band of each team's
    //      colour), their trucks behind, the broadcast compound's white trucks and dishes
    if (wingFrame) {
      const { at, uMin, uMax, fB, ux, uz } = wingFrame, ang = Math.atan2(ux, uz);
      const pave = []; for (let u = uMin; u <= uMax - 40; u += 10) for (let v = fB + 2; v < fB + 100; v += 10) { const [x, z] = at(u + 5, v + 5); if (corr(x, z, 6) > 0 && !occ(x, z)) pave.push(new THREE.PlaneGeometry(10.2, 10.2).rotateX(-Math.PI / 2).rotateY(ang).translate(x, 0.05, z)); }
      if (pave.length) { const m = new THREE.Mesh(mergeGeometries(pave.map(keepPN)), new THREE.MeshStandardMaterial({ color: 0x9fa09c, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); m.name = 'silverstone:paddock'; group.add(m); }
      const span = uMax - 60 - uMin;
      for (let k = 0; k < 10; k++) {
        const u = uMin + 12 + (k + 0.5) * span / 10, hex = TEAMC[k], [x, z] = at(u, fB + 16);
        if (corr(x, z, 6) <= 0) continue;
        vcell(x, z, boxAt(12, 9.6, 20, x, 4.8, z, ang, 0x2a3540)); vcell(x, z, boxAt(12.6, 0.6, 20.6, x, 3.3, z, ang, 0xf4f4f2)); vcell(x, z, boxAt(12.6, 0.6, 20.6, x, 6.5, z, ang, 0xf4f4f2)); vcell(x, z, boxAt(13, 1.3, 21, x, 9.9, z, ang, hex));
        for (const o of [-3.6, 3.6]) { const [tx, tz] = at(u + o, fB + 40); vcell(tx, tz, boxAt(2.6, 4.0, 16.5, tx, 2.35, tz, ang + Math.PI / 2, hex)); }
        for (let q = 0; q < 8; q++) { const [px, pz] = at(u + (rnd() - 0.5) * 22, fB + 26 + rnd() * 6); sheets.push([px, 0, pz, rnd() * 6.28, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
        occDisc(x, z, 12); solid.push([x, z, 12]);
      }
      for (let k = 0; k < 12; k++) { const [x, z] = at(uMin + 20 + k * span / 12, fB + 66 + (k % 2) * 12); if (corr(x, z, 6) <= 0 || occ(x, z)) continue; vcell(x, z, boxAt(13, 3.8, 2.5, x, 2.2, z, ang, k % 3 ? 0xf2f2f2 : 0xd9dde2)); vcell(x, z, vc(new THREE.CylinderGeometry(1.4, 1.4, 0.15, 12).rotateX(1.0).translate(x, 5.2, z), 0xeeeeee)); occDisc(x, z, 7); }
    }

    // ---- the Paddock Club: two storeys of glass in a white frame by the Wing's north end, beyond the pit exit, its name
    //      along the front, the guests on its roof terrace
    let pcAt = null;
    if (wingFrame) {
      const { at, uMin, fB, fF } = wingFrame, cands = [];
      for (let du = 60; du <= 360; du += 20) for (const dv of [fB + 30, fB + 60, fF - 70, fB + 100]) cands.push(at(uMin - du, dv));
      for (const [x, z] of cands) {
        const q = tr.nearest(x, z), f = tr.sample(q.s, 0), ang = Math.atan2(f.tx, f.tz), side = Math.sign(q.d) || 1, nx = f.nx * side, nz = f.nz * side;
        let good = true; for (let a = -60; a <= 60 && good; a += 10) for (let b = -13; b <= 13; b += 6.5) { const px = x + f.tx * a + nx * b, pz = z + f.tz * a + nz * b; if (corr(px, pz, 10) <= 0 || occ(px, pz)) { good = false; break; } }
        if (good) { pcAt = { x, z, ang, nx, nz, f }; break; }
      }
      if (pcAt) {
        const { x, z, ang, nx, nz, f } = pcAt, face = Math.atan2(-nx, -nz);
        vcell(x, z, boxAt(24, 0.5, 120, x, 0.25, z, ang, 0x8a8c8e)); vcell(x, z, boxAt(22, 3.6, 118, x + nx * 0.8, 2.3, z + nz * 0.8, ang, 0x22313d));
        vcell(x, z, boxAt(24, 0.55, 120, x, 4.4, z, ang, 0xf4f4f2)); vcell(x, z, boxAt(21, 3.4, 117, x + nx * 1.2, 6.3, z + nz * 1.2, ang, 0x2a3b4a)); vcell(x, z, boxAt(24.6, 0.6, 121, x, 8.3, z, ang, 0xf4f4f2));
        for (let a = -58; a <= 58; a += 6) vcell(x, z, boxAt(0.3, 8, 0.3, x - nx * 11.6 + f.tx * a, 4.2, z - nz * 11.6 + f.tz * a, ang, 0xf4f4f2));
        const P = sampler([[x - nx * 12.1 - f.tx * 58, z - nz * 12.1 - f.tz * 58], [x - nx * 12.1 + f.tx * 58, z - nz * 12.1 + f.tz * 58]], [nx, nz], 4);
        boards.push(board(P, 0, 4.25, 5.1, rowOf('paddock'), 29), board(P, -0.02, 8.15, 9.25, rowOf('PADDOCK CLUB'), 29));
        for (let k = 0; k < 140; k++) { const a = (rnd() - 0.5) * 112, b = -10 + rnd() * 18; sheets.push([x + f.tx * a + nx * b, 8.6, z + f.tz * a + nz * b, face + (rnd() - 0.5) * 1.2, UK_POSES[(rnd() * UK_POSES.length) | 0]]); }
        for (let a = -50; a <= 50; a += 25) vcell(x, z, vc(new THREE.ConeGeometry(5.6, 1.6, 4, 1, true).rotateY(Math.PI / 4 + ang).translate(x + f.tx * a, 11, z + f.tz * a), 0xf6f6f4));
        const ring = [[-60, -12.5], [60, -12.5], [60, 12.5], [-60, 12.5]].map(([a, b]) => [x + f.tx * a + nx * b, z + f.tz * a + nz * b]); solids.push({ ring, h: 9 }); occRing(ring, 6); solid.push([x, z, 30]);
      }
    }

    // ---- the lake in the infield (the most open ground there is: as far as it goes from the tracks and the buildings),
    //      its reeds, the willows round it
    let lakeAt = null;
    {
      let best = null;
      for (let x = CX - 700; x <= CX + 700; x += 15) for (let z = CZ - 900; z <= CZ + 900; z += 15) {
        if (!infield(x, z) || occ(x, z) || gapAt(x, z) < 50) continue;
        const fits = (r) => { for (let a = 0; a < 12; a++) { const px = x + Math.cos(a * Math.PI / 6) * r, pz = z + Math.sin(a * Math.PI / 6) * r; if (occ(px, pz) || !infield(px, pz) || gapAt(px, pz) < 35) return false; } return true; };
        const r0 = best ? best.r + 6 : 20; if (r0 > 95 || !fits(r0)) continue;   // (no bigger than the best already found: next)
        let r = r0; while (r + 6 <= 95 && fits(r + 6)) r += 6;
        best = { x, z, r };
      }
      if (best && best.r >= 32) {
        const R = best.r - 10, el = 1.35, rot = rnd() * Math.PI, pts = [];
        for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2, rr = R * (0.82 + 0.3 * vnoise(Math.cos(a) * 2 + 5, Math.sin(a) * 2 + 5, 3)), px = Math.cos(a) * rr * el / Math.sqrt(el), pz = Math.sin(a) * rr / Math.sqrt(el); pts.push([best.x + px * Math.cos(rot) - pz * Math.sin(rot), best.z + px * Math.sin(rot) + pz * Math.cos(rot)]); }
        const shape = (k) => { const s = new THREE.Shape(); pts.forEach(([x, z], j) => { const px = best.x + (x - best.x) * k, pz = best.z + (z - best.z) * k; if (j) s.lineTo(px, -pz); else s.moveTo(px, -pz); }); return s; };
        const bank = new THREE.ShapeGeometry(shape(1.12)); bank.rotateX(-Math.PI / 2); bank.translate(0, 0.05, 0);
        const water = new THREE.ShapeGeometry(shape(1)); water.rotateX(-Math.PI / 2); water.translate(0, 0.08, 0);
        const bm = new THREE.Mesh(bank, new THREE.MeshStandardMaterial({ color: 0x5d6b3a, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
        const wm = new THREE.Mesh(water, new THREE.MeshStandardMaterial({ color: 0x2c4c58, roughness: 0.06, metalness: 0.55, envMapIntensity: 1.3, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
        bm.name = 'silverstone:lakebank'; wm.name = 'scene:lake'; group.add(bm, wm);
        lakeAt = { x: best.x, z: best.z, r: R * 1.15, pts };
        occDisc(best.x, best.z, R * 1.25); solid.push([best.x, best.z, R * 1.2]);
      }
    }

    // ---- the hospitality villages: big white marquees in rows (their gables to the walkway, a flag at each), in the open
    //      ground near the corners where there is room for a village
    const marq = [];
    {
      const gable = (x, z, ang, w, d, h0, h1, hex) => {
        vcell(x, z, boxAt(w, h0, d, x, h0 / 2, z, ang, 0xf4f4f2));
        const P = [-w / 2, h0, -d / 2, w / 2, h0, -d / 2, 0, h1, -d / 2, -w / 2, h0, d / 2, w / 2, h0, d / 2, 0, h1, d / 2], I = [0, 1, 2, 5, 4, 3, 0, 2, 5, 0, 5, 3, 1, 4, 5, 1, 5, 2];
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); g.rotateY(ang); g.translate(x, 0, z); vcell(x, z, vc(g, hex));
      };
      const centres = [];
      for (let x = CX - 1300; x <= CX + 1300; x += 40) for (let z = CZ - 1500; z <= CZ + 1500; z += 40) { const g = gapAt(x, z); if (g > 45 && g < 240 && !occ(x, z) && vnoise(x / 260, z / 260, 41) > 0.55) centres.push([x, z, vnoise(x / 260, z / 260, 41) + (infield(x, z) ? 0.15 : 0)]); }
      centres.sort((a, b) => b[2] - a[2]);
      const chosen = [];
      for (const [x, z] of centres) {
        if (chosen.length >= 7) break; if (chosen.some(([a, b]) => (a - x) ** 2 + (b - z) ** 2 < 380 * 380)) continue;
        const q = tr.nearest(x, z), f = tr.sample(q.s, 0), ang = Math.atan2(f.tx, f.tz), side = Math.sign(q.d) || 1;
        let placed = 0;
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
          const a = (c - 1.5) * 30, b = r * 22, px = x + f.tx * a + f.nx * side * b, pz = z + f.tz * a + f.nz * side * b;
          let good = true; for (const [da, db] of [[-12, -7], [12, -7], [-12, 7], [12, 7], [0, 0]]) { const qx = px + f.tx * da + f.nx * side * db, qz = pz + f.tz * da + f.nz * side * db; if (corr(qx, qz, 10) <= 0 || occ(qx, qz) || hitSolid(qx, qz)) { good = false; break; } }
          if (!good) continue;
          gable(px, pz, ang, 14, 24, 3.4, 6.6, 0xf6f6f4); placed++; marq.push([px, pz]);
          flagsUp.push([px - f.nx * side * 8, 0, pz - f.nz * side * 8, ang, [0, 1, 14, 0][placed % 4], 1.6, 7]);
          for (let k = 0; k < 10; k++) sheets.push([px - f.nx * side * (8.5 + rnd() * 3) + f.tx * (rnd() - 0.5) * 20, 0, pz - f.nz * side * (8.5 + rnd() * 3) + f.tz * (rnd() - 0.5) * 20, rnd() * 6.28, UK_POSES[(rnd() * UK_POSES.length) | 0]]);
          const ring = [[-7.5, -12.5], [7.5, -12.5], [7.5, 12.5], [-7.5, 12.5]].map(([u, v]) => [px + f.nx * side * u + f.tx * v, pz + f.nz * side * u + f.tz * v]);
          solids.push({ ring, h: 6.6 }); occRing(ring, 3); solid.push([px, pz, 14]);
        }
        if (placed >= 4) chosen.push([x, z]);
      }
    }

    // ---- the fan zone: the big blue top (blue and white canvas round its two king poles), the big wheel turning beside
    //      it, the stage and its screen, the stalls round the edge, the crowd milling
    let wheel = null, fanAt = null;
    {
      let best = null; const cands = [];
      for (let x = CX - 1100; x <= CX + 1100; x += 25) for (let z = CZ - 1300; z <= CZ + 1500; z += 25) {
        if (occ(x, z)) continue; const g = gapAt(x, z); if (g < 70 || g > 420) continue;
        cands.push({ x, z, score: (z - CZ) / 600 + (infield(x, z) ? 0.6 : 0) - g / 600 });   /* (to the south, in the infield if it can be) */
      }
      cands.sort((a, b) => b.score - a.score);
      for (const c of cands) {
        let good = true; for (let a = 0; a < 12 && good; a++) for (const r of [30, 60, 85]) { const px = c.x + Math.cos(a * Math.PI / 6) * r, pz = c.z + Math.sin(a * Math.PI / 6) * r; if (occ(px, pz) || gapAt(px, pz) < 30) { good = false; break; } }
        if (good) { best = c; break; }
      }
      if (best) {
        const { x, z } = best; fanAt = [x, z];
        const SEG = 32, P = [], C = [], col = new THREE.Color(), prof = [[25, 0], [25, 7.5], [19, 12], [11, 17.5], [4, 22], [1.2, 23.5]];
        for (let j = 0; j < SEG; j++) {
          const a0 = (j / SEG) * Math.PI * 2, a1 = ((j + 1) / SEG) * Math.PI * 2; col.setHex(j % 2 ? 0x1f4fbf : 0xf2f4f8);
          for (let k = 0; k < prof.length - 1; k++) {
            const [r0, y0] = prof[k], [r1, y1] = prof[k + 1], p = (r, y, a) => [x + Math.cos(a) * r * (1 + (k > 1 ? 0.04 * Math.cos(a * 2) : 0)), y, z + Math.sin(a) * r];
            const A = p(r0, y0, a0), B2 = p(r0, y0, a1), C2 = p(r1, y1, a1), D2 = p(r1, y1, a0); P.push(...A, ...D2, ...C2, ...A, ...C2, ...B2); for (let q = 0; q < 6; q++) C.push(col.r, col.g, col.b);
          }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.computeVertexNormals();
        const top = new THREE.Mesh(g, vmatD); top.name = 'scene:bigtop'; group.add(top);
        for (const o of [-4, 4]) { vcell(x, z, boxAt(0.6, 28, 0.6, x + o, 14, z, 0, 0xd8dde2)); flagsUp.push([x + o, 28, z, 0.3, 0, 2.2, 1]); }
        solids.push({ ring: Array.from({ length: 16 }, (_, k) => [x + Math.cos(k * Math.PI / 8) * 25.5, z + Math.sin(k * Math.PI / 8) * 25.5]), h: 20 }); occDisc(x, z, 30); solid.push([x, z, 30]);
        // the wheel: 22 m across on its A-frame, twenty gondolas (turned to hang level every frame)
        const wa = Math.atan2(CZ - z, CX - x), wx = x + Math.cos(wa) * 58, wz = z + Math.sin(wa) * 58, R = 17, H = R + 3;
        const W2 = new THREE.Group(); W2.position.set(wx, H, wz); W2.rotation.y = wa; W2.name = 'scene:wheel';
        const rimG = [];
        for (const zo of [-1.2, 1.2]) { const t = new THREE.TorusGeometry(R, 0.25, 5, 48); t.translate(0, 0, zo); rimG.push(vc(t, 0xf2f2f2)); }
        for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; for (const zo of [-1.2, 1.2]) { const sp = new THREE.CylinderGeometry(0.07, 0.07, R, 4); sp.translate(0, R / 2, 0); sp.rotateZ(a); sp.translate(0, 0, zo); rimG.push(vc(sp, 0xd8dde2)); } }
        rimG.push(vc(new THREE.CylinderGeometry(0.7, 0.7, 3.2, 10).rotateX(Math.PI / 2), 0x8a9096));
        const spin = new THREE.Mesh(mergeGeometries(rimG), vmat); W2.add(spin); group.add(W2);
        for (const zo of [-2.4, 2.4]) for (const sx of [-1, 1]) { const leg = new THREE.CylinderGeometry(0.35, 0.45, Math.hypot(H, 9), 6); leg.rotateZ(sx * Math.atan2(9, H)); leg.translate(sx * 4.5, H / 2, zo); leg.rotateY(wa); leg.translate(wx, 0, wz); vcell(wx, wz, vc(leg, 0xb3212b)); }
        const gond = new THREE.InstancedMesh(mergeGeometries([vc(new THREE.BoxGeometry(1.8, 1.7, 1.6).translate(0, -1.5, 0), 0xffffff), vc(new THREE.BoxGeometry(2.0, 0.15, 1.8).translate(0, -0.55, 0), 0xffffff)]), VMAT(), 20);
        for (let k = 0; k < 20; k++) gond.setColorAt(k, new THREE.Color(TEAMC[k % TEAMC.length]));
        gond.frustumCulled = false; group.add(gond);
        wheel = { spin, gond, W2, R, wa, wx, wz, H };
        solid.push([wx, wz, 14]); occDisc(wx, wz, 14);
        // the stalls round it, the stage, the crowd
        for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2 + 0.17, px = x + Math.cos(a) * 46, pz = z + Math.sin(a) * 46; if (occ(px, pz) && Math.hypot(px - wx, pz - wz) < 20) continue; const face = Math.atan2(x - px, z - pz), hex = TEAMC[k % TEAMC.length]; if (k % 2) vcell(px, pz, boxAt(7, 3, 2.6, px, 1.6, pz, face + Math.PI / 2, hex)); else { vcell(px, pz, boxAt(6, 2.6, 6, px, 1.3, pz, face, 0xf4f4f2)); vcell(px, pz, vc(new THREE.ConeGeometry(4.3, 2, 4).rotateY(Math.PI / 4 + face).translate(px, 3.6, pz), hex)); } }
        { const sa = wa + Math.PI, sx = x + Math.cos(sa) * 62, sz = z + Math.sin(sa) * 62, face = Math.atan2(x - sx, z - sz); vcell(sx, sz, boxAt(18, 1.4, 9, sx, 0.7, sz, face, 0x1c1d21)); vcell(sx, sz, boxAt(19, 0.6, 10, sx, 9, sz, face, 0x2d3035)); const sg = new THREE.PlaneGeometry(11, 6); sg.rotateY(face); sg.translate(sx - Math.sin(face) * 3.5, 5.4, sz - Math.cos(face) * 3.5); screens.push(sg); for (let k = 0; k < 600; k++) { const u = (rnd() - 0.5) * 34, v = 8 + Math.pow(rnd(), 0.7) * 26; sheets.push([sx + Math.sin(face) * v + Math.cos(face) * u, 0, sz + Math.cos(face) * v - Math.sin(face) * u, face + Math.PI + (rnd() - 0.5) * 0.4, rnd() < 0.35 ? 3 : UK_POSES[(rnd() * UK_POSES.length) | 0]]); } solid.push([sx, sz, 12]); }
        for (let k = 0; k < 1400; k++) { const a = rnd() * Math.PI * 2, r = 28 + rnd() * 36, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (Math.hypot(px - wx, pz - wz) < 12) continue; if (k % 3) sheets.push([px, 0, pz, rnd() * 6.28, UK_POSES[(rnd() * UK_POSES.length) | 0]]); else { const b = a + (rnd() - 0.5) * 1.4, r2 = 28 + rnd() * 36; walkers.push([px, 0.02, pz, x + Math.cos(b) * r2, 0.02, z + Math.sin(b) * r2, 0.6 + rnd() * 0.6]); } }
        const P2 = sampler([[x + Math.cos(wa + 2) * 25.8 - Math.sin(wa + 2) * 8, z + Math.sin(wa + 2) * 25.8 + Math.cos(wa + 2) * 8], [x + Math.cos(wa + 2) * 25.8 + Math.sin(wa + 2) * 8, z + Math.sin(wa + 2) * 25.8 - Math.cos(wa + 2) * 8]], [-Math.cos(wa + 2), -Math.sin(wa + 2)], 4);
        boards.push(board(P2, -0.2, 8.2, 10.2, rowOf('FAN ZONE'), 16));
      }
    }
    console.info(`[silverstone] the weekend: ${zones.length} general-admission banks, ${marq.length} marquees, the lake ${lakeAt ? `${lakeAt.r.toFixed(0)} m` : 'none'}, the fan zone ${fanAt ? 'up' : 'nowhere'}, the Paddock Club ${pcAt ? 'up' : 'nowhere'}`);

    // ==================================================================================================================
    // ---- the land: the perimeter road and the roads in; then a patchwork of fields (~170 m, their corners jittered) out to
    //      2.3 km - near the circuit the campsites (north and west: tents, caravans, the odd car, Union Flags on poles)
    //      and the car parks (east and south, the infield's too), Silverstone Park's sheds to the west, and beyond them
    //      farmland: wheat and barley, beans, pasture with its sheep, ploughed earth - hedgerows round every field, trees in
    //      them, and the woods
    // ==================================================================================================================
    const RR = ringRoad(tr, 300), road = [...RR.ring, RR.ring[0]];
    occPoly(road, 18);
    const roads = [road];
    for (let k = 0; k < 7; k++) {
      const p = RR.ring[Math.floor((k + 0.4) * RR.ring.length / 7)], dx = CX - p[0], dz = CZ - p[1], dl = Math.hypot(dx, dz), poly = [p];
      for (let t = 6; t < dl; t += 6) { const x = p[0] + dx / dl * t, z = p[1] + dz / dl * t; if (gapAt(x, z) < 60 || hitSolid(x, z, 10)) break; poly.push([x, z]); }
      if (poly.length > 8) { roads.push(poly); occPoly(poly, 14); }
    }
    {
      const rt = canvasTex(64, 256, (x) => { x.fillStyle = '#4b4d51'; x.fillRect(0, 0, 64, 256); const r2 = rng(3); for (let k = 0; k < 500; k++) { x.fillStyle = r2() < 0.5 ? 'rgba(90,92,96,0.5)' : 'rgba(55,56,60,0.5)'; x.fillRect(r2() * 64, r2() * 256, 2, 2); } x.fillStyle = '#e6e6df'; x.fillRect(2, 0, 2, 256); x.fillRect(60, 0, 2, 256); for (let y = 0; y < 256; y += 64) x.fillRect(31, y, 2, 30); }, { repeat: true });
      const rg = roads.map((poly) => keepPNU(nonIdx(ribbon(sampler(poly, [1, 0], 6), () => -5, () => 5, 0.06, { closed: false, uvFn: (i) => i * 6 / 24 }))));
      const m = new THREE.Mesh(mergeGeometries(rg), new THREE.MeshStandardMaterial({ map: rt, roughness: 0.85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })); m.name = 'silverstone:roads'; group.add(m);
    }
    let bx0 = Infinity, bx1 = -Infinity, bz0 = Infinity, bz1 = -Infinity; for (let i = 0; i < n; i += 5) { bx0 = Math.min(bx0, tr.px[i]); bx1 = Math.max(bx1, tr.px[i]); bz0 = Math.min(bz0, tr.pz[i]); bz1 = Math.max(bz1, tr.pz[i]); }
    const FS = 170, MG = 2300, X0 = bx0 - MG, Z0 = bz0 - MG, NX = Math.ceil((bx1 - bx0 + 2 * MG) / FS), NZ = Math.ceil((bz1 - bz0 + 2 * MG) / FS);
    const h2 = (i, j, s) => { const h = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
    const corner = (i, j) => [X0 + i * FS + (h2(i, j, 1) - 0.5) * FS * 0.5, Z0 + j * FS + (h2(i, j, 2) - 0.5) * FS * 0.5];
    const CROP = { sheds: 0x8d9088, wheat: 0xc6ad62, barley: 0xd4c27f, rape: 0x8f8a4c, beans: 0x55722f, pasture: 0x5e8a3b, pasture2: 0x6c9944, silage: 0xa6b25e, plough: 0x86684c, maize: 0x4c7a2c, camp: 0x7a9150, park: 0x83955a };
    const CROPS = ['wheat', 'wheat', 'barley', 'barley', 'rape', 'beans', 'pasture', 'pasture', 'pasture2', 'silage', 'plough', 'maize'];
    const fields = [];
    // (the small things - tents, caravans, cars, sheep - in 750 m cells, so their short cut-offs bite; the trees and the
    //  sheds, seen from much further, in 1.5 km cells: fewer draw calls)
    const CH = new Map(), SM = new Map();
    const chunk = (x, z) => {
      const kb = `${Math.floor(x / 1500)},${Math.floor(z / 1500)}`, ks = `${Math.floor(x / 750)},${Math.floor(z / 750)}`;
      let b = CH.get(kb); if (!b) CH.set(kb, (b = { tree: [], far: [], pine: [], shed: [] }));
      let c = SM.get(ks); if (!c) SM.set(ks, (c = { dome: [], van: [], car: [], sheep: [] }));
      return { tree: b.tree, far: b.far, pine: b.pine, shed: b.shed, dome: c.dome, van: c.van, car: c.car, sheep: c.sheep };
    };
    const TCOL = [0x3f5a2a, 0x46612d, 0x365026, 0x4d6a31, 0x3a5528, 0x52703a], TENTC = [0xff7a1a, 0x2f7d3a, 0x2456b0, 0xc8202e, 0xf2c12e, 0x8a9096, 0xe9e9e6, 0x1f2c5a, 0x6a3a8a, 0x2fa3a0, 0xff8000, 0x3b6e2a];
    const CARC = [0xf2f2f2, 0xf2f2f2, 0x111111, 0x111111, 0x8a9096, 0xc7cbd0, 0xc7cbd0, 0x1f3f7a, 0x8a1c1c, 0x2d4a2a, 0xb0a48a, 0x4b4f55, 0x274a6e, 0xff8000];
    const tree = (x, z, h, far, pine) => { const c = chunk(x, z); (pine ? c.pine : far ? c.far : c.tree).push([x, z, h, rnd() * 6.28, TCOL[(rnd() * TCOL.length) | 0]]); };
    let nCamp = 0, nPark = 0, nTents = 0, nCars = 0, nSheds = 0;
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      const A = corner(i, j), B2 = corner(i + 1, j), C2 = corner(i + 1, j + 1), D2 = corner(i, j + 1), cx = (A[0] + B2[0] + C2[0] + D2[0]) / 4, cz = (A[1] + B2[1] + C2[1] + D2[1]) / 4;
      const gC = gapAt(cx, cz); let gMin = gC; for (const p of [A, B2, C2, D2, [(A[0] + B2[0]) / 2, (A[1] + B2[1]) / 2], [(B2[0] + C2[0]) / 2, (B2[1] + C2[1]) / 2], [(C2[0] + D2[0]) / 2, (C2[1] + D2[1]) / 2], [(D2[0] + A[0]) / 2, (D2[1] + A[1]) / 2]]) gMin = Math.min(gMin, gapAt(p[0], p[1]));
      const inf = infield(cx, cz), dN = CZ - cz, dW = CX - cx, dist = gC;
      let type;
      if (inf) type = gMin > 40 && vnoise(cx / 300, cz / 300, 17) > 0.55 ? 'park' : 'grass';
      else if (dist < 640) {
        const shedZone = cx < bx0 - 120 && cz > bz0 + 200 && cz < bz1 - 300;
        if (shedZone && h2(i, j, 9) < 0.55) type = 'sheds';
        else if ((dN > 700 || dW > 560) && h2(i, j, 5) < 0.62) type = 'camp';
        else if (dist < 480 && h2(i, j, 6) < 0.36) type = 'park';
        else type = h2(i, j, 6) < 0.7 ? 'pasture' : CROPS[Math.floor(h2(i, j, 7) * CROPS.length)];
      } else {
        const wood = fbm(cx / 600, cz / 600, 23) + (cx < CX && cz > CZ ? 0.06 : 0);
        type = wood > 0.66 ? 'wood' : CROPS[Math.floor(h2(i, j, 7) * CROPS.length)];
      }
      const F = { i, j, A, B: B2, C: C2, D: D2, cx, cz, gMin, type, inf, crop: CROP[type] ?? CROP.pasture, ang: h2(i, j, 8) * Math.PI, out: gMin > 50 && !inf };
      fields.push(F);
      const bil = (a, b) => [A[0] + (B2[0] - A[0]) * a + (D2[0] - A[0]) * b + (A[0] - B2[0] + C2[0] - D2[0]) * a * b, A[1] + (B2[1] - A[1]) * a + (D2[1] - A[1]) * b + (A[1] - B2[1] + C2[1] - D2[1]) * a * b];
      const eu = Math.hypot(B2[0] - A[0], B2[1] - A[1]), ev = Math.hypot(D2[0] - A[0], D2[1] - A[1]), axU = Math.atan2(B2[0] - A[0], B2[1] - A[1]);
      const far = gMin > 105, okHere = (x, z) => (far || gapAt(x, z) > 45) && !occ(x, z) && !hitSolid(x, z, 1);   // (the clearance changes by at most a metre a metre: a field this far off has 45 m everywhere)
      if (type === 'camp') {
        nCamp++;
        for (let a = 0.03; a < 0.97; a += 7.2 / eu) for (let b = 0.03; b < 0.97; b += 8 / ev) {
          const [x0, z0] = bil(a, b), x = x0 + (rnd() - 0.5) * 2.4, z = z0 + (rnd() - 0.5) * 2.4, r = rnd(); if (r > 0.8 || fbm(x / 70, z / 70, 81) < 0.36 || !okHere(x, z)) continue;
          const c = chunk(x, z), rot = axU + (rnd() - 0.5) * 0.5;
          if (r < 0.68) { c.dome.push([x, z, rot, TENTC[(rnd() * TENTC.length) | 0], 0.85 + rnd() * 0.6]); nTents++; }
          else if (r < 0.77) c.van.push([x, z, rot, rnd() < 0.8 ? 0xf2f0e8 : 0xd8d2c0, rnd() < 0.3 ? 1.35 : 1]);
          else { c.car.push([x, z, rot + Math.PI / 2, CARC[(rnd() * CARC.length) | 0], 1]); nCars++; }
          if (rnd() < 0.025) flagsUp.push([x + 2, 0, z, rnd() * 6.28, CROWD_FLAGS[(rnd() * CROWD_FLAGS.length) | 0], 1.5, 5.5]);
          if (rnd() < 0.06) sheets.push([x + 2.2, 0, z + (rnd() - 0.5) * 2, rnd() * 6.28, rnd() < 0.3 ? 8 : UK_POSES[(rnd() * UK_POSES.length) | 0]]);
        }
      } else if (type === 'park') {
        nPark++;
        for (let b = 0.04; b < 0.96; b += 7.4 / ev) { const face = Math.floor(b * ev / 7.4) % 2 ? 0 : Math.PI; for (let a = 0.03; a < 0.97; a += 2.7 / eu) { if (rnd() > 0.64) continue; const [x, z] = bil(a, b); if (fbm(x / 90, z / 90, 83) < 0.5 || !okHere(x, z)) continue; chunk(x, z).car.push([x, z, axU + Math.PI / 2 + face + (rnd() - 0.5) * 0.06, CARC[(rnd() * CARC.length) | 0], rnd() < 0.3 ? 1.22 : 1]); nCars++; } }
      } else if (type === 'sheds') {
        for (let k = 0; k < 3; k++) { const [x, z] = bil(0.25 + (k % 2) * 0.45 + (rnd() - 0.5) * 0.1, 0.3 + Math.floor(k / 2) * 0.45), w = 40 + rnd() * 45, d = 24 + rnd() * 22; let good = true; for (const [da, db] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2], [0, 0]]) { const px = x + Math.sin(axU) * da + Math.cos(axU) * db, pz = z + Math.cos(axU) * da - Math.sin(axU) * db; if (!okHere(px, pz) || gapAt(px, pz) < 80) good = false; } if (!good) continue; chunk(x, z).shed.push([x, z, axU, w, d, 8 + rnd() * 5, rnd() < 0.5 ? 0xd9dcdf : 0x9aa0a6]); occDisc(x, z, Math.hypot(w, d) / 2); solid.push([x, z, Math.hypot(w, d) / 2]); nSheds++; }
        for (let b = 0.06; b < 0.94; b += 0.3) for (let a = 0.06; a < 0.94; a += 2.7 / eu) { if (rnd() > 0.5) continue; const [x, z] = bil(a, b); if (!okHere(x, z)) continue; chunk(x, z).car.push([x, z, axU + Math.PI / 2, CARC[(rnd() * CARC.length) | 0], 1]); nCars++; }
      } else if (type === 'wood') {
        for (let a = 0.02; a < 0.98; a += 13 / eu) for (let b = 0.02; b < 0.98; b += 13 / ev) { const [x0, z0] = bil(a, b), x = x0 + (rnd() - 0.5) * 8, z = z0 + (rnd() - 0.5) * 8; if (rnd() > 0.94 || !okHere(x, z)) continue; tree(x, z, 14 + rnd() * 9, dist > 750, rnd() < 0.2); }
      } else if (type === 'pasture' || type === 'pasture2') {
        if (rnd() < 0.5) { const n2 = 8 + ((rnd() * 30) | 0), [hx, hz] = bil(0.3 + rnd() * 0.4, 0.3 + rnd() * 0.4); for (let k = 0; k < n2; k++) { const x = hx + (rnd() - 0.5) * 60, z = hz + (rnd() - 0.5) * 60; if (okHere(x, z)) chunk(x, z).sheep.push([x, z, rnd() * 6.28, rnd() < 0.85 ? 0xeeeae0 : 0x3a3530, 1]); } }
        for (let k = 0; k < 2; k++) if (rnd() < 0.5) { const [x, z] = bil(0.15 + rnd() * 0.7, 0.15 + rnd() * 0.7); if (okHere(x, z)) tree(x, z, 12 + rnd() * 8, false, false); }
      } else if (type === 'grass' && inf && vnoise(cx / 200, cz / 200, 29) > 0.62) {
        for (let k = 0; k < 14; k++) { const x = cx + (rnd() - 0.5) * 90, z = cz + (rnd() - 0.5) * 90; if (okHere(x, z) && gapAt(x, z) > 60) tree(x, z, 9 + rnd() * 8, false, rnd() < 0.15); }
      }
    }
    // the hedgerows: along every field's edge out in the country (gates left in them), an oak in them now and then; and
    // tree lines along the roads
    const hedges = [];
    const fAt = (i, j) => (i >= 0 && j >= 0 && i < NX && j < NZ ? fields[j * NX + i] : null);
    const edge = (p, q, Fa, Fb) => {
      if (!Fa?.out && !Fb?.out) return;
      const L2 = Math.hypot(q[0] - p[0], q[1] - p[1]), ang = Math.atan2(q[0] - p[0], q[1] - p[1]), gate = 0.2 + h2(Math.floor(p[0]), Math.floor(p[1]), 4) * 0.6;
      if (Math.hypot((p[0] + q[0]) / 2 - CX, (p[1] + q[1]) / 2 - CZ) > 2400) return;   // (the furthest fields: their hedges lost in the haze)
      for (let t = 0; t < L2; t += 30) {
        const u = (t + 15) / L2; if (Math.abs(u - gate) < 0.1) continue;
        const x = p[0] + (q[0] - p[0]) * u, z = p[1] + (q[1] - p[1]) * u; if (gapAt(x, z) < 50 || occ(x, z)) continue;
        hedges.push([x, z, ang, 30.6, 1.8 + rnd() * 1.4]);
        if (rnd() < 0.15) tree(x + (rnd() - 0.5) * 2, z + (rnd() - 0.5) * 2, 12 + rnd() * 8, Math.hypot(x - CX, z - CZ) > 2200, false);
      }
    };
    for (let j = 0; j <= NZ; j++) for (let i = 0; i < NX; i++) edge(corner(i, j), corner(i + 1, j), fAt(i, j), fAt(i, j - 1));
    for (let j = 0; j < NZ; j++) for (let i = 0; i <= NX; i++) edge(corner(i, j), corner(i, j + 1), fAt(i, j), fAt(i - 1, j));
    for (const poly of roads) for (let k = 0; k + 1 < poly.length; k += 3) { const [x, z] = poly[k], [x2, z2] = poly[k + 1], l = Math.hypot(x2 - x, z2 - z) || 1, nx = -(z2 - z) / l, nz = (x2 - x) / l; for (const s of [-1, 1]) { if (rnd() > 0.55) continue; const tx = x + nx * s * 13, tz = z + nz * s * 13; if (gapAt(tx, tz) > 50 && !occ(tx, tz) && !hitSolid(tx, tz, 2)) tree(tx, tz, 10 + rnd() * 7, false, false); } }
    // the field surfaces: one mesh, each field its crop's colour (mottled), the drill lines or the mowing stripes of a
    // shared texture turned to its own way
    {
      const P = [], U = [], C = [], col = new THREE.Color();
      for (const F of fields) {
        if (!F.out || F.type === 'grass') continue;
        const base = new THREE.Color(F.crop), sc = F.type.startsWith('pasture') || F.type === 'camp' || F.type === 'park' ? 1 / 14 : F.type === 'wood' ? 1 / 30 : 1 / 3.2, ca = Math.cos(F.ang), sa = Math.sin(F.ang);
        const at2 = (a, b) => [F.A[0] + (F.B[0] - F.A[0]) * a + (F.D[0] - F.A[0]) * b + (F.A[0] - F.B[0] + F.C[0] - F.D[0]) * a * b, F.A[1] + (F.B[1] - F.A[1]) * a + (F.D[1] - F.A[1]) * b + (F.A[1] - F.B[1] + F.C[1] - F.D[1]) * a * b];
        const N = 3;
        for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
          const Q = [[a / N, b / N], [a / N, (b + 1) / N], [(a + 1) / N, (b + 1) / N], [a / N, b / N], [(a + 1) / N, (b + 1) / N], [(a + 1) / N, b / N]];
          for (const [u, v] of Q) { const [x, z] = at2(u, v); P.push(x, 0.03, z); U.push((x * ca - z * sa) * sc, (x * sa + z * ca) * sc); const m = 0.86 + 0.26 * fbm(x / 70, z / 70, 61); col.copy(base).multiplyScalar(m); C.push(col.r, col.g, col.b); }
        }
      }
      const tex = canvasTex(128, 128, (x) => { x.fillStyle = '#d9d9d9'; x.fillRect(0, 0, 128, 128); const r2 = rng(13); for (let k = 0; k < 1800; k++) { const t = r2(); x.fillStyle = t < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(90,90,90,0.25)'; x.fillRect(r2() * 128, r2() * 128, 1 + r2() * 2, 1 + r2() * 2); } for (let y = 0; y < 128; y += 16) { x.fillStyle = 'rgba(70,70,70,0.32)'; x.fillRect(0, y, 128, 5); x.fillStyle = 'rgba(255,255,255,0.22)'; x.fillRect(0, y + 8, 128, 4); } }, { repeat: true, aniso: 8 });
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.computeVertexNormals();
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, vertexColors: true, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })); m.name = 'silverstone:fields'; group.add(m);
    }
    // the instanced kinds, per 1 km cell (whole cells cull by distance)
    const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), scv = new THREE.Vector3(), p3 = new THREE.Vector3(), cl = new THREE.Color();
    const lam = new THREE.MeshLambertMaterial({ vertexColors: true });
    const G = {
      dome: (() => { const g = new THREE.ConeGeometry(1.25, 1.3, 5, 1, true); g.translate(0, 0.65, 0); g.scale(1, 1, 1.3); return vc(g, 0xffffff); })(),
      van: vc(new THREE.BoxGeometry(2.3, 2.5, 6).translate(0, 1.5, 0), 0xffffff),
      car: (() => { const g = new THREE.BoxGeometry(1.85, 1.3, 4.5).translate(0, 0.75, 0); g.setIndex(Array.from(g.index.array).filter((_, k) => Math.floor(k / 6) !== 3)); return vc(g, 0xffffff); })(),   /* (a box a car, no underside: from the track they are rows of colour) */
      sheep: vc(new THREE.BoxGeometry(0.55, 0.6, 1.0).translate(0, 0.45, 0), 0xffffff),
      tree: (() => { const t = new THREE.CylinderGeometry(0.04, 0.06, 0.4, 5, 1, true).translate(0, 0.2, 0), c = new THREE.IcosahedronGeometry(0.42, 0).scale(1.15, 0.85, 1.15).translate(0, 0.62, 0); return mergeGeometries([vc(t, 0x5b4a38), vc(c, 0xffffff)]); })(),
      far: vc(new THREE.OctahedronGeometry(0.5, 0).scale(1.15, 0.8, 1.15).translate(0, 0.55, 0), 0xffffff),
      pine: (() => { const c = new THREE.ConeGeometry(0.32, 0.9, 6).translate(0, 0.6, 0), t = new THREE.CylinderGeometry(0.03, 0.04, 0.2, 4, 1, true).translate(0, 0.1, 0); return mergeGeometries([vc(t, 0x5b4a38), vc(c, 0xffffff)]); })(),
      hedge: (() => { const g = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0); g.setIndex(Array.from(g.index.array).filter((_, k) => Math.floor(k / 6) !== 3)); return vc(g, 0xffffff); })(),   /* (no underside) */
    };
    const inst = (geo, list, set, name, cut) => { if (!list.length) return; const im = new THREE.InstancedMesh(geo, lam, list.length); list.forEach((e, k) => set(im, e, k)); im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); im.name = name; im.userData.cut = cut; group.add(im); };
    const put = (im, k, x, y, z, a, sx, sy, sz, hex) => { m4.compose(p3.set(x, y, z), qt.setFromAxisAngle(up, a), scv.set(sx, sy, sz)); im.setMatrixAt(k, m4); im.setColorAt(k, cl.setHex(hex)); };
    let nTrees = 0;
    for (const c of SM.values()) {
      inst(G.dome, c.dome, (im, [x, z, a, hex, s], k) => put(im, k, x, 0, z, a, s, s, s, hex), 'silverstone:tents', 1200);
      inst(G.van, c.van, (im, [x, z, a, hex, s], k) => put(im, k, x, 0, z, a, 1, 1, s, hex), 'silverstone:caravans', 1250);
      inst(G.car, c.car, (im, [x, z, a, hex, s], k) => put(im, k, x, 0, z, a, 1, s, 1, hex), 'silverstone:cars', 950);
      inst(G.sheep, c.sheep, (im, [x, z, a, hex], k) => put(im, k, x, 0, z, a, 1, 1, 1, hex), 'silverstone:sheep', 1000);
    }
    for (const c of CH.values()) {
      for (const K of ['tree', 'far', 'pine']) { nTrees += c[K].length; inst(G[K], c[K], (im, [x, z, h, r, hex], k) => { const w = h * (0.75 + rnd() * 0.3); put(im, k, x, 0, z, r, w, h, w, hex); im.setColorAt(k, cl.setHex(hex).multiplyScalar(0.85 + rnd() * 0.3)); }, `silverstone:${K}`, K === 'far' ? 3200 : 2000); }
      if (c.shed.length) {
        const gs = [];
        for (const [x, z, a, w, d, h, hex] of c.shed) {
          gs.push(vc(new THREE.BoxGeometry(w, h, d).rotateY(a + Math.PI / 2).translate(x, h / 2, z), hex));
          const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute([-w / 2, h, -d / 2, w / 2, h, -d / 2, w / 2, h, d / 2, -w / 2, h, d / 2, -w / 2, h + d * 0.16, 0, w / 2, h + d * 0.16, 0], 3)); rg.setIndex([0, 4, 1, 1, 4, 5, 3, 2, 5, 3, 5, 4, 0, 3, 4, 1, 5, 2]); rg.computeVertexNormals(); rg.rotateY(a + Math.PI / 2); rg.translate(x, 0, z); gs.push(vc(rg, 0x8f969c));
        }
        const m = merged(gs, vmatD, 'silverstone:sheds', 4500); if (m) group.add(m);
      }
    }
    { const hc = new Map(); for (const e of hedges) { const k = `${Math.floor(e[0] / 2500)},${Math.floor(e[1] / 2500)}`; let a = hc.get(k); if (!a) hc.set(k, (a = [])); a.push(e); } for (const list of hc.values()) inst(G.hedge, list, (im, [x, z, a, l, h], k) => put(im, k, x, 0, z, a, 2.4, h, l, [0x3c5a2a, 0x34502a, 0x44602f][k % 3]), 'silverstone:hedges', 2300); }
    console.info(`[silverstone] the land: ${fields.length} fields, ${nCamp} campsites (${nTents} tents), ${nPark} car parks (${nCars} cars), ${nSheds} sheds, ${nTrees} trees, ${hedges.length} lengths of hedge, roads ${(roads.reduce((a, p) => a + p.length, 0) * 6 / 1000).toFixed(1)} km`);

    // ---- the people walking (one draw a cell), and the wheel's turn
    const wMat = walkerMaterial();
    { const cells = new Map(); for (const w of walkers) { const k = `${Math.floor(w[0] / 500)},${Math.floor(w[2] / 500)}`; let a = cells.get(k); if (!a) cells.set(k, (a = [])); a.push(w); } for (const list of cells.values()) { const im = walkerMesh(list, wMat, rnd, { shirts: UK_SHIRTS }); im.name = 'silverstone:walkers'; im.userData.cut = 1500; group.add(im); } }
    const gm = new THREE.Matrix4(), gq = new THREE.Quaternion(), gs = new THREE.Vector3(1, 1, 1), gp = new THREE.Vector3();
    return {
      update(t) {
        const sh = wMat.userData.shader; if (sh) sh.uniforms.uTime.value = t;
        if (wheel) {
          const a0 = t * 0.12; wheel.spin.rotation.z = a0;
          gq.setFromAxisAngle(up, wheel.wa);
          for (let k = 0; k < 20; k++) { const a = a0 + k / 20 * Math.PI * 2, lx = -Math.sin(a) * wheel.R, ly = Math.cos(a) * wheel.R; gp.set(wheel.wx + Math.cos(wheel.wa) * lx, wheel.H + ly, wheel.wz - Math.sin(wheel.wa) * lx); gm.compose(gp, gq, gs); wheel.gond.setMatrixAt(k, gm); }
          wheel.gond.instanceMatrix.needsUpdate = true;
        }
      },
    };
  }

  // (the Wing's whole extent, its roof's overhang over the garages and the steps beyond its prow included)
  const wingHull = wingFrame ? [[wingFrame.uMin - 2, wingFrame.fF - 9], [wingFrame.uMax + 14, wingFrame.fF - 9], [wingFrame.uMax + 14, wingFrame.fB + 3], [wingFrame.uMin - 2, wingFrame.fB + 3]].map(([u, v]) => wingFrame.at(u, v)) : null;
  let tPrev = null;
  return {
    group, claimed, stands, solids, wing: wingFrame,
    /** something of the scenery standing at (x, z) (where an evening's venue cannot go: main.js footClear) */
    blocked: (x, z) => (wingHull && inRing(x, z, wingHull)) || hitSolid(x, z) || solids.some((o) => inRing(x, z, o.ring)),
    update(t, cam, focus) {
      const dt = tPrev == null ? 0 : Math.max(0, Math.min(0.2, t - tPrev)); tPrev = t;
      for (const m of [fansMat, flagMat]) { const sh = m.userData.shader; if (sh) sh.uniforms.uTime.value = t; }
      life.update(t, dt);
      helis.update(t, dt, cam, focus);
    },
    setTime() {},
  };
}
