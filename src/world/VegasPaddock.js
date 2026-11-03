// Las Vegas: the start/finish straight and Turn 1 as they are on race night (2023-).
//  * The Grand Prix Plaza - the pit and paddock building: four storeys over the garages, white slabs with glass
//    balustrades and lit hospitality suites on every floor looking down the pit lane, a roof terrace, and the red
//    F1-logo canopy on its roof at the south-west end. Its edges carry running LED strips (magenta, cyan, white).
//  * The Heineken Silver main grandstand opposite the pits: a two-deck stand with black seats, the white lighting
//    truss in front of its upper deck (towers down through the lower one, red lamps along it), and the glass
//    hospitality pavilion on top under a white roof, washed pink.
//  * Turn 1: the left hairpin round the building's north-east tip, with its big asphalt run-off (tracks.js
//    openCorners) painted with the race's own design - Heineken green, the blue 0.0, LAS VEGAS and red chevrons -
//    and the Turn 1 grandstand: one straight, rectangular stand on the outside of the run back from Turn 2 toward
//    Turn 3, along the plaza's north-west side (as the aerials from beyond Turn 1 show it).
//  * Light: lamps on the truss, the plaza's roof edge and the Turn 1 grandstand, aimed at the track (baked into the
//    floodlight field with the masts: world/Lighting.js) - the straight lit like day, as it is.
// The stands' tiers and crowds are world/Grandstands.js's (returned here as fixed placements); this module adds what
// makes them these stands, and everything else.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { corridorSigned } from '../track/TrackBuilder.js';
import { STAND } from './Grandstands.js';
import { FLOOD } from './Lighting.js';

const FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';
const MAIN = { tiers: 38, tierH: 0.6, tierD: 0.98, gap: 4.5 };     // the main grandstand (two decks: Grandstands levels 2) - a big one
const T1S = { tiers: 26, tierH: 0.55, tierD: 0.95, gap: 3.0 };     // the Turn 1 grandstand

function canvasTex(w, h, draw, repeat = false) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
/** a hospitality suite, lit from inside: warm rooms, people at the glass and at the bar, screens (u along, v up) */
function suitesTexture(seed = 1) {
  let a = seed; const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  return canvasTex(1024, 256, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff1d8'); g.addColorStop(0.25, '#ffd29a'); g.addColorStop(1, '#c9875a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let k = 0; k < 16; k++) { x.fillStyle = 'rgba(255,255,240,.95)'; x.fillRect(k * 64 + 20, 10, 24, 6); }   // ceiling lights
    for (let k = 0; k < 4; k++) {   // screens and the bar's backlit shelves
      const sx = k * 256 + 30 + rnd() * 120; x.fillStyle = '#1a1c28'; x.fillRect(sx, 40, 70, 42); x.fillStyle = ['#e10600', '#2aa8ff', '#ff2d9a', '#33d17a'][k]; x.fillRect(sx + 4, 44, 62, 34);
      x.fillStyle = 'rgba(255,90,200,.55)'; x.fillRect(k * 256 + 150, 96, 90, 8);
    }
    // people: dark figures against the light, some at the glass, some in groups
    for (let k = 0; k < 70; k++) {
      const px = rnd() * W, sc = 0.75 + rnd() * 0.5, y0 = H - 6, hgt = 120 * sc;
      x.fillStyle = `rgba(${20 + rnd() * 40},${15 + rnd() * 25},${20 + rnd() * 30},${0.75 + rnd() * 0.25})`;
      x.beginPath(); x.ellipse(px, y0 - hgt + 12 * sc, 9 * sc, 11 * sc, 0, 0, 6.283); x.fill();
      x.beginPath(); x.moveTo(px - 15 * sc, y0); x.lineTo(px - 12 * sc, y0 - hgt + 30 * sc); x.quadraticCurveTo(px, y0 - hgt + 20 * sc, px + 12 * sc, y0 - hgt + 30 * sc); x.lineTo(px + 15 * sc, y0); x.fill();
      if (rnd() < 0.4) { x.fillStyle = ['#ff2d9a', '#ffffff', '#e10600', '#1e90ff'][(rnd() * 4) | 0]; x.fillRect(px - 10 * sc, y0 - hgt + 34 * sc, 20 * sc, 28 * sc); }
    }
    // mullions
    x.fillStyle = 'rgba(40,40,46,.85)'; for (let k = 0; k <= 8; k++) x.fillRect(k * 128 - 3, 0, 6, H);
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
/** Heineken Silver: the stand ends' signs */
function heinekenTexture() {
  return canvasTex(512, 256, (x, W, H) => {
    x.fillStyle = '#0d7a3a'; x.fillRect(0, 0, W, H); x.fillStyle = '#0a5c2c'; x.fillRect(0, H - 40, W, 40);
    x.fillStyle = '#e1001a'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 16 : 38; (j ? x.lineTo : x.moveTo).call(x, W / 2 + Math.cos(a) * r, 62 + Math.sin(a) * r); } x.fill();
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `italic 800 74px ${FONT}`; x.fillText('Heineken', W / 2, 140);
    x.font = `700 30px ${FONT}`; x.fillText('S I L V E R', W / 2, H - 20);
  });
}
/** Turn 1's run-off, the band along the kerb round the hairpin: Heineken green with the red star, the blue 0.0% ALCOHOL
 *  FREE, the green tip (u along the corner, v across: 0 at the kerb) - the lettering upright seen from outside the corner */
function runoffBandTexture() {
  return canvasTex(4096, 384, (x, W, H) => {
    x.fillStyle = '#119a47'; x.fillRect(0, 0, W * 0.6, H);
    x.fillStyle = '#1c5fd4'; x.beginPath(); x.moveTo(W * 0.6, 0); x.lineTo(W * 0.95, 0); x.lineTo(W * 0.92, H); x.lineTo(W * 0.6, H); x.closePath(); x.fill();
    x.fillStyle = '#119a47'; x.beginPath(); x.moveTo(W * 0.95, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * 0.92, H); x.closePath(); x.fill();
    x.fillStyle = '#ffffff'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.font = `italic 900 270px Georgia, "Times New Roman", serif`; x.fillText('Heineken', W * 0.3, H * 0.52);
    x.fillStyle = '#e1001a'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 62 : 150; (j ? x.lineTo : x.moveTo).call(x, W * 0.6 + Math.cos(a) * r, H * 0.5 + Math.sin(a) * r); } x.fill();
    x.fillStyle = '#ffffff'; x.font = `900 220px ${FONT}`; x.fillText('-0.0%', W * 0.77, H * 0.42); x.font = `700 64px ${FONT}`; x.fillText('ALCOHOL FREE', W * 0.77, H * 0.8);
  });
}
/** the letters further out on Turn 1's run-off: LAS VEGAS in outline (white, a pink glow) and chevrons, on the bare asphalt */
function runoffLettersTexture() {
  return canvasTex(4096, 640, (x, W, H) => {
    x.clearRect(0, 0, W, H); x.lineJoin = 'round';
    const out = (draw) => { x.strokeStyle = 'rgba(255,90,170,.85)'; x.lineWidth = 34; draw(); x.strokeStyle = '#ffffff'; x.lineWidth = 14; draw(); };
    x.font = `300 430px ${FONT}`; x.textBaseline = 'middle'; x.textAlign = 'center';
    out(() => x.strokeText('LAS VEGAS', W * 0.6, H * 0.5));
    for (let k = 0; k < 3; k++) { const cx = W * 0.06 + k * 230; out(() => { x.beginPath(); x.moveTo(cx, H * 0.22); x.lineTo(cx + 160, H * 0.5); x.lineTo(cx, H * 0.78); x.stroke(); }); }
  });
}
/** a roof terrace seen from above: warm lit decking, people (dark heads and shoulders), a few parasols */
function terraceTexture() {
  let a = 5; const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  return canvasTex(512, 256, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#ffb24a'); g.addColorStop(1, '#ff8a2a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let k = 0; k < 140; k++) { x.fillStyle = `rgba(${30 + rnd() * 40},${20 + rnd() * 20},${20 + rnd() * 30},.9)`; x.beginPath(); x.arc(rnd() * W, rnd() * H, 3 + rnd() * 3, 0, 6.283); x.fill(); }
    for (let k = 0; k < 6; k++) { x.fillStyle = ['#ffffff', '#ff2d9a', '#1c1c22'][k % 3]; x.beginPath(); x.arc(rnd() * W, rnd() * H, 14, 0, 6.283); x.fill(); }
  }, true);
}
/** Heineken Silver, the main grandstand's end wall: teal, the star, the name */
function silverEndTexture() {
  return canvasTex(1024, 768, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0fb3a8'); g.addColorStop(1, '#087a76'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#e1001a'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 22 : 54; (j ? x.lineTo : x.moveTo).call(x, W * 0.5 + Math.cos(a) * r, H * 0.32 + Math.sin(a) * r); } x.fill();
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `italic 900 150px Georgia, serif`; x.fillText('Heineken', W / 2, H * 0.5);
    x.font = `700 70px ${FONT}`; x.fillText('S I L V E R', W / 2, H * 0.68);
  });
}
/** the run-off at Turn 1 as it is painted: Heineken green with the star, the blue 0.0, LAS VEGAS, red and white chevrons
 *  (u along the run-off, v across it from the kerb out) */
function runoffTexture() {
  return canvasTex(4096, 512, (x, W, H) => {
    x.fillStyle = '#26282d'; x.fillRect(0, 0, W, H);
    const seg = (a, b, col) => { x.fillStyle = col; x.fillRect(a, 0, b - a, H); };
    seg(0, 1300, '#0e8a40'); seg(1300, 1750, '#1f5fd0'); seg(1750, 3300, '#1a1a20'); seg(3300, W, '#c8102e');
    x.save(); x.translate(0, H); x.scale(1, -1);   // (v grows from the kerb: the lettering reads from the track)
    x.fillStyle = '#ffffff'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.font = `italic 900 300px ${FONT}`; x.fillText('Heineken', 640, H / 2 + 10);
    x.fillStyle = '#e1001a'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 40 : 96; (j ? x.lineTo : x.moveTo).call(x, 1215 + Math.cos(a) * r, H / 2 + Math.sin(a) * r); } x.fill();
    x.fillStyle = '#ffffff'; x.font = `900 280px ${FONT}`; x.fillText('0.0', 1525, H / 2 + 10);
    x.font = `900 250px ${FONT}`; x.fillText('LAS VEGAS', 2525, H / 2 + 10);
    x.fillStyle = '#ffffff';
    for (let k = 0; k < 4; k++) { const cx = 3420 + k * 160; x.beginPath(); x.moveTo(cx, 60); x.lineTo(cx + 110, H / 2); x.lineTo(cx, H - 60); x.lineTo(cx + 55, H - 60); x.lineTo(cx + 165, H / 2); x.lineTo(cx + 55, 60); x.closePath(); x.fill(); }
    x.restore();
  });
}

/** the race's banner on the stands' backs: night-blue, LAS VEGAS GRAND PRIX, a pink stripe (tiles along) */
function bannerTexture() {
  return canvasTex(1024, 256, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#120a2e'); g.addColorStop(1, '#2a0b3a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#ff2d9a'; x.fillRect(0, H * 0.78, W, 10); x.fillStyle = '#22d3ff'; x.fillRect(0, H * 0.84, W, 4);
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 ${H * 0.3}px ${FONT}`; x.fillText('LAS VEGAS GRAND PRIX', W / 2, H * 0.42);
    x.fillStyle = '#e10600'; x.font = `italic 900 ${H * 0.16}px ${FONT}`; x.fillText('F1', W - 70, H * 0.42);
  }, true);
}
/**
 * The running LEDs: a strip's colour slides between two along the world (x + z) and with time - one material for every
 * strip of a kind, its clock moved by update(t). Brighter at night (FLOOD.floodOn: the floodlights are on).
 */
function ledMaterial(a, b, speed = 1.6, scale = 0.045) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color(a) }, uB: { value: new THREE.Color(b) }, uBoost: { value: 1 }, uSpeed: { value: speed }, uScale: { value: scale } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float uTime, uBoost, uSpeed, uScale; uniform vec3 uA, uB; varying vec3 vW;
      void main(){ float k = 0.5 + 0.5 * sin((vW.x + vW.z) * uScale - uTime * uSpeed); vec3 c = mix(uA, uB, smoothstep(0.2, 0.8, k)); gl_FragColor = vec4(c * uBoost, 1.0); }`,
    side: THREE.DoubleSide,
  });
}

/**
 * @param track, pit, def (tracks.js lasvegas)
 * @param rings building footprints [[x, z]...] (the city's: the stands keep off them)
 * @returns { group, stands (fixed placements for buildGrandstands), lights (extra floodlights for the bake), boxes,
 *            solids [{ ring, h }], update(t) }
 */
export function buildVegasPaddock(track, pit, def, rings = []) {
  const tr = track, group = new THREE.Group(); group.name = 'vegas-paddock';
  const stands = [], lights = [], solids = [], anims = [], club = [];
  const L = tr.length, f = {}, f2 = {};
  const cornerS = (n) => def.corners.find((c) => c.n === n)?.s;
  const c1 = cornerS(1), c2 = cornerS(2), c3 = cornerS(3);

  const inRing = (x, z, r) => { let k = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const xi = r[i][0], zi = r[i][1], xj = r[j][0], zj = r[j][1]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) k = !k; } return k; };
  // ---- materials
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f2f4, roughness: 0.45, metalness: 0.05, emissive: 0x231a24, side: THREE.DoubleSide });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide });
  const glass = new THREE.MeshStandardMaterial({ color: 0x9cc4d8, roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
  const suites = new THREE.MeshBasicMaterial({ map: suitesTexture(7), color: 0xffffff, side: THREE.DoubleSide });
  const suitesDim = new THREE.MeshBasicMaterial({ map: suitesTexture(11), color: 0x9a8a80, side: THREE.DoubleSide });
  const red = new THREE.MeshStandardMaterial({ color: 0xff2a5c, roughness: 0.4, metalness: 0.2, emissive: 0xff2a6a, emissiveIntensity: 1.6, side: THREE.DoubleSide });   // (the logo: lit hot pink-red at night)
  const ledPink = ledMaterial(0xff2d9a, 0xb84dff), ledCyan = ledMaterial(0x22d3ff, 0xff2d9a, 1.1, 0.03), ledWhite = ledMaterial(0xfff4e0, 0xffc7ec, 0.8, 0.02);
  const lamp = new THREE.MeshBasicMaterial({ color: 0xff2a20 }), flood = new THREE.MeshBasicMaterial({ color: 0xfffbf0 });
  const truss = new THREE.MeshBasicMaterial({ map: trussTexture(), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xe8eaf0 });
  const hnk = new THREE.MeshStandardMaterial({ map: heinekenTexture(), emissive: 0xffffff, emissiveMap: null, emissiveIntensity: 0.0, roughness: 0.5, side: THREE.DoubleSide });
  hnk.emissiveMap = hnk.map; hnk.emissiveIntensity = 0.85;
  const banner = new THREE.MeshStandardMaterial({ map: bannerTexture(), roughness: 0.7, emissive: 0xffffff, emissiveIntensity: 0.0, side: THREE.DoubleSide });
  banner.emissiveMap = banner.map; banner.emissiveIntensity = 0.55;
  const plazaSign = new THREE.MeshBasicMaterial({ map: canvasTex(1024, 288, (x, W, H) => {
    x.fillStyle = '#0b0b10'; x.fillRect(0, 0, W, H); x.fillStyle = '#e10600'; x.font = `italic 900 150px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('F1', W / 2, H * 0.36);
    x.fillStyle = '#ffffff'; x.font = `800 58px ${FONT}`; x.fillText('GRAND PRIX PLAZA', W / 2, H * 0.78); x.fillStyle = '#ff2d9a'; x.fillRect(0, H - 10, W, 10);
  }), side: THREE.DoubleSide });
  const roofDark = new THREE.MeshStandardMaterial({ color: 0x34363d, roughness: 0.75, metalness: 0.2, side: THREE.DoubleSide });
  const pave = new THREE.MeshStandardMaterial({ color: 0x9a9286, roughness: 0.85, emissive: 0x4a3218, side: THREE.DoubleSide });   // (the paddock's paving under its warm lights)
  const warmLamp = new THREE.MeshBasicMaterial({ color: 0xffd28a });
  const roofGrey = new THREE.MeshStandardMaterial({ color: 0x8a8678, roughness: 0.8, metalness: 0.1, side: THREE.DoubleSide });
  const maroon = new THREE.MeshStandardMaterial({ color: 0x7a1a2a, roughness: 0.6, metalness: 0.2, emissive: 0x3a0610, side: THREE.DoubleSide });
  const terrace = new THREE.MeshBasicMaterial({ map: terraceTexture(), side: THREE.DoubleSide });
  const tent = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.55, emissive: 0x2c2a2e, side: THREE.DoubleSide });
  const greyBox = new THREE.MeshStandardMaterial({ color: 0x4a4e57, roughness: 0.7, metalness: 0.25, side: THREE.DoubleSide });
  const fence = new THREE.MeshStandardMaterial({ map: canvasTex(1024, 128, (x, W, H) => { x.fillStyle = '#0f8a42'; x.fillRect(0, 0, W, H); x.fillStyle = '#ffffff'; x.font = `italic 900 70px Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; for (let k = 0; k < 2; k++) x.fillText('Heineken', W * (0.25 + 0.5 * k), H / 2); }, true), emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide });
  fence.emissiveMap = fence.map; fence.emissiveIntensity = 0.45;
  const silverEnd = new THREE.MeshStandardMaterial({ map: silverEndTexture(), emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide }); silverEnd.emissiveMap = silverEnd.map; silverEnd.emissiveIntensity = 0.75;
  const geos = new Map(); const put = (mat, g) => { if (!geos.has(mat)) geos.set(mat, []); geos.get(mat).push(g); };

  // ---- geometry along a line of samples S (the circuit or the pit lane): a quad strip between two edges, each given
  //      per sample as [lateral offset (along S's normal), height]; u along the line (m / tile), v from edge A to B
  const strip = (S, ia, ib, A, B, tile = 0) => {
    const pos = [], uv = [], idx = []; let n = 0;
    for (let i = ia; i <= ib; i++) {
      const [oa, ya] = A(i), [ob, yb] = B(i), u = tile ? (S.s[i] - S.s[ia]) / tile : 0;
      pos.push(S.px[i] + S.nx[i] * oa, ya, S.pz[i] + S.nz[i] * oa, S.px[i] + S.nx[i] * ob, yb, S.pz[i] + S.nz[i] * ob);
      uv.push(u, 0, u, 1);
      if (i > ia) { const a = n - 2, b = n - 1, c = n, d = n + 1; idx.push(a, c, b, b, c, d); }
      n += 2;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    return g;
  };
  /** a box in a local frame: centre (x, y, z), size along ex (lx), up (ly) and ez (lz) */
  const boxAt = (x, y, z, ex, lx, ly, lz) => { const g = new THREE.BoxGeometry(lx, ly, lz); g.rotateY(Math.atan2(-ex[1], ex[0])); g.translate(x, y, z); return g; };

  // =============================================================================================================
  // the Grand Prix Plaza: on the pit lane's garage side, over the garages (world/PitLane.js builds them: 5.4 m high,
  // their front hw + 1.2 m from the lane's centre)
  // =============================================================================================================
  if (pit) {
    const ps = pit.samples, gs = -pit.trackSide, hw = pit.halfWidth, fr = hw + 1.2, lip = fr - 1.8, bk = fr + 24;
    // (the building is dead straight: it stands over the straight part of the lane only, not round its curves in and out
    //  - the longest run of samples within 1.5 degrees of the lane's heading in the middle of the walled stretch)
    let ia = Math.max(2, pit.wallStartI + 3), ib = Math.min(ps.n - 3, pit.wallEndI - 3);
    {
      const m = (ia + ib) >> 1, h0 = Math.atan2(ps.tz[m], ps.tx[m]), ok = (i) => Math.abs(Math.atan2(Math.sin(Math.atan2(ps.tz[i], ps.tx[i]) - h0), Math.cos(Math.atan2(ps.tz[i], ps.tx[i]) - h0))) < 0.07;
      let a = m, b = m; while (a > ia && ok(a - 1)) a--; while (b < ib && ok(b + 1)) b++;
      console.info(`[vegas] plaza over the lane's straight: ${(ps.s[b] - ps.s[a]).toFixed(0)} m of ${(ps.s[ib] - ps.s[ia]).toFixed(0)} m walled`);
      ia = a + 1; ib = b - 1;
    }
    const O = (off) => gs * off;   // (an offset on the garage side)
    const H0 = 5.4, FLOOR = 4.7, LEVELS = [H0, H0 + FLOOR, H0 + 2 * FLOOR], ROOF = H0 + 3 * FLOOR;
    for (const y of [...LEVELS, ROOF]) {
      put(y === ROOF ? roofDark : white, strip(ps, ia, ib, () => [O(lip), y + 0.55], () => [O(bk), y + 0.55]));        // the slab's top (the roof: dark, as from the air)
      put(white, strip(ps, ia, ib, () => [O(lip), y], () => [O(fr + 0.6), y]));               // its underside where it overhangs
      put(white, strip(ps, ia, ib, () => [O(lip), y], () => [O(lip), y + 0.55]));             // its front edge
      put(y === ROOF ? ledCyan : ledPink, strip(ps, ia, ib, () => [O(lip - 0.03), y + 0.14], () => [O(lip - 0.03), y + 0.36]));   // the LED line along it
      put(glass, strip(ps, ia, ib, () => [O(lip + 0.15), y + 0.55], () => [O(lip + 0.15), y + 1.7]));   // glass balustrade
      put(ledWhite, strip(ps, ia, ib, () => [O(lip + 0.15), y + 1.66], () => [O(lip + 0.15), y + 1.74]));   // its lit handrail
      if (y < ROOF) {
        put(glass, strip(ps, ia, ib, () => [O(fr + 0.9), y + 0.55], () => [O(fr + 0.9), y + FLOOR], 24));   // the curtain wall
        put(suites, strip(ps, ia, ib, () => [O(fr + 1.3), y + 0.55], () => [O(fr + 1.3), y + FLOOR], 30));   // the suites behind it
        put(suitesDim, strip(ps, ia, ib, () => [O(bk - 0.05), y + 0.55], () => [O(bk - 0.05), y + FLOOR], 30));   // the paddock side's
      }
    }
    put(white, strip(ps, ia, ib, () => [O(fr + 6), 0], () => [O(bk), 0.02]));                 // (the paddock floor behind the garages)
    put(white, strip(ps, ia, ib, () => [O(bk), 0], () => [O(bk), H0]));                       // the ground floor's back wall
    // the two ends: white, the full height
    for (const i of [ia, ib]) {
      const a = [ps.px[i] + ps.nx[i] * O(lip), ps.pz[i] + ps.nz[i] * O(lip)], b = [ps.px[i] + ps.nx[i] * O(bk), ps.pz[i] + ps.nz[i] * O(bk)];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ex = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      put(white, boxAt((a[0] + b[0]) / 2, (ROOF + 0.55) / 2, (a[1] + b[1]) / 2, ex, len, ROOF + 0.55, 0.6));
      put(ledPink, boxAt((a[0] + b[0]) / 2, ROOF - 0.4, (a[1] + b[1]) / 2, ex, len, 0.3, 0.7));
      // (the end walls: the plaza's name lit across them, facing out along the straight)
      if (i === ib) {   // (the Turn 1 end: open - a balcony on every floor round the end, suites behind glass, as on the aerials)
        const tx = ps.tx[i], tz = ps.tz[i], cx = (a[0] + b[0]) / 2, cz = (a[1] + b[1]) / 2;
        for (const y of [...LEVELS, ROOF]) {
          put(white, boxAt(cx + tx * 1.2, y + 0.3, cz + tz * 1.2, ex, len, 0.6, 2.4)); put(ledPink, boxAt(cx + tx * 2.42, y + 0.25, cz + tz * 2.42, ex, len, 0.22, 0.05));
          const g = new THREE.PlaneGeometry(len, 1.1); g.rotateY(Math.atan2(tx, tz)); g.translate(cx + tx * 2.3, y + 1.15, cz + tz * 2.3); put(glass, g);
          if (y < ROOF) { const h = new THREE.PlaneGeometry(len - 1, FLOOR - 0.6); const uv = h.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * len / 30); h.rotateY(Math.atan2(tx, tz)); h.translate(cx + tx * 0.35, y + 0.6 + (FLOOR - 0.6) / 2, cz + tz * 0.35); put(suites, h); }
        }
      }
      if (i === ia) { const out = -1, g = new THREE.PlaneGeometry(len * 0.86, 7.5), tx = ps.tx[i] * out, tz = ps.tz[i] * out;   // (the south-west end only: the Turn 1 end has none)
        g.rotateY(Math.atan2(tx, tz)); g.translate((a[0] + b[0]) / 2 + tx * 0.35, 11, (a[1] + b[1]) / 2 + tz * 0.35); put(plazaSign, g); }
    }
    // the roof terrace: a lounge's lights in a row, and the F1 logo canopy over the south-west end (the lane's start)
    const at = (i, off, y) => new THREE.Vector3(ps.px[i] + ps.nx[i] * O(off), y, ps.pz[i] + ps.nz[i] * O(off));
    for (let i = ia + 4; i < ib - 4; i += Math.round(9 / ps.ds)) put(ledWhite, boxAt(at(i, fr + 8, 0).x, ROOF + 1.1, at(i, fr + 8, 0).z, [ps.tx[i], ps.tz[i]], 0.4, 1.0, 0.4));
    // (the lit roof terraces: warm decks of people between dark plant rooms, every ~50 m)
    for (let i = ia + Math.round(70 / ps.ds); i < ib - Math.round(30 / ps.ds); i += Math.round(52 / ps.ds)) {
      const j = Math.min(ib, i + Math.round(26 / ps.ds));
      put(terrace, strip(ps, i, j, () => [O(fr + 2), ROOF + 0.6], () => [O(bk - 3), ROOF + 0.6], 26));
      const m = at(j + 3, (fr + bk) / 2, 0); put(roofDark, boxAt(m.x, ROOF + 3.4, m.z, [ps.tx[j], ps.tz[j]], 9, 5.6, 14));
    }
    const li = Math.min(ib - 4, ia + Math.round(34 / ps.ds)), lc = at(li, (lip + bk) / 2, ROOF + 5.2), lang = Math.atan2(-ps.tz[li], ps.tx[li]);
    const F1 = new THREE.Shape();
    // (the logo, laid flat: the F's sweep with its rounded top corner, the F's middle bar, the 1 - 46 x 11 units)
    F1.moveTo(0, 0); F1.lineTo(6, 0); F1.lineTo(13, 7); F1.lineTo(33, 7); F1.lineTo(36, 11); F1.lineTo(15.5, 11); F1.quadraticCurveTo(10.5, 11, 8, 8.5); F1.lineTo(0, 0);
    const mid = new THREE.Shape(); mid.moveTo(9, 0); mid.lineTo(15, 0); mid.lineTo(18.5, 3.5); mid.lineTo(28.5, 3.5); mid.lineTo(30.5, 5.6); mid.lineTo(14.6, 5.6); mid.lineTo(9, 0);
    const one = new THREE.Shape(); one.moveTo(33.5, 0); one.lineTo(38.5, 0); one.lineTo(46, 11); one.lineTo(41, 11); one.lineTo(33.5, 0);
    const logo = new THREE.ExtrudeGeometry([F1, mid, one], { depth: 1.1, bevelEnabled: false });
    logo.translate(-23, -5.5, 0); logo.scale(1.15 * gs, 1.15, 1); logo.rotateX(-Math.PI / 2); logo.rotateY(lang); logo.translate(lc.x, lc.y, lc.z);
    put(red, logo);
    for (const [dl, dc] of [[-20, -4], [-20, 4], [0, -4], [0, 4], [20, -4], [20, 4]]) {   // its columns
      const j = Math.max(ia, Math.min(ib, li + Math.round(dl / ps.ds))), p = at(j, (lip + bk) / 2 + dc, 0);
      put(white, boxAt(p.x, ROOF + 0.55 + 2.3, p.z, [ps.tx[j], ps.tz[j]], 0.5, 4.6, 0.5));
    }
    // floodlights along the roof edge, over the pit lane and the straight (the bake: Lighting.js)
    for (let i = ia + 2; i < ib; i += Math.round(20 / ps.ds)) {
      const p = at(i, lip, ROOF + 2.4); put(flood, boxAt(p.x, p.y, p.z, [ps.tx[i], ps.tz[i]], 1.6, 0.5, 0.7));
      const q = tr.nearest(p.x, p.z), aim = tr.sample(q.s, 0, f);
      lights.push({ x: p.x, y: p.y, z: p.z, tx: aim.x * 0.6 + ps.px[i] * 0.4, tz: aim.z * 0.6 + ps.pz[i] * 0.4 });
    }
    // ---- the plaza's north-east end, round the hairpin: where the lane curves away toward Turn 2 the building follows it
    //      (its front on the lane, as deep as the ground inside the corner allows): three lower storeys of suites and
    //      terraces looking out at Turn 1, a green Heineken fence along its foot, a dark grey stair tower
    const laneD = (x, z) => { let m = Infinity; for (let i = 0; i < ps.n; i += 2) { const d = (ps.px[i] - x) ** 2 + (ps.pz[i] - z) ** 2; if (d < m) m = d; } return Math.sqrt(m); };
    const freeAt = (i, from, to) => { let d = from; for (; d <= to; d += 1) { const p = at(i, d, 0); if (corridorSigned(tr, pit, p.x, p.z, 2.5) < 0) break; } return d - 1 - from; };
    const ie = (() => { let j = ib; while (j < ps.n - 4 && freeAt(j + 1, fr, fr + 30) >= 9) j++; return j; })();
    console.info(`[vegas] the plaza's club round the hairpin: ${((ps.s[ie] - ps.s[ib]) || 0).toFixed(0)} m`);
    if (ie > ib + 3) {
      const dep = new Float32Array(ps.n); for (let i = ib; i <= ie; i++) dep[i] = Math.min(24, freeAt(i, fr, fr + 30));
      const back = (i) => fr + dep[i];
      const CL = [H0, H0 + FLOOR], CR = H0 + 2 * FLOOR;
      put(fence, strip(ps, ib, ie, () => [O(fr - 0.4), 0], () => [O(fr - 0.4), 2.4], 12));
      for (const y of [...CL, CR]) {
        put(y === CR ? roofDark : white, strip(ps, ib, ie, () => [O(lip), y + 0.55], (i) => [O(back(i)), y + 0.55]));
        put(white, strip(ps, ib, ie, () => [O(lip), y], () => [O(lip), y + 0.55]));
        put(ledPink, strip(ps, ib, ie, () => [O(lip - 0.03), y + 0.14], () => [O(lip - 0.03), y + 0.36]));
        put(glass, strip(ps, ib, ie, () => [O(lip + 0.15), y + 0.55], () => [O(lip + 0.15), y + 1.7]));
        if (y < CR) put(suites, strip(ps, ib, ie, () => [O(fr + 1.3), y + 0.55], () => [O(fr + 1.3), y + FLOOR], 30));
      }
      put(suites, strip(ps, ib, ie, () => [O(fr + 1.3), 0.3], () => [O(fr + 1.3), H0], 30));   // (its ground floor: open, lit)
      put(white, strip(ps, ib, ie, (i) => [O(back(i)), 0], (i) => [O(back(i)), CR + 0.55]));
      const e = ie; { const a = at(e, lip, 0), b = at(e, back(e), 0), len = Math.hypot(b.x - a.x, b.z - a.z); put(white, boxAt((a.x + b.x) / 2, (CR + 0.55) / 2, (a.z + b.z) / 2, [(b.x - a.x) / len, (b.z - a.z) / len], len, CR + 0.55, 0.6)); }
      const tm = Math.round((ib + ie) / 2), tp = at(tm, fr + dep[tm] * 0.55, 0); put(greyBox, boxAt(tp.x, 12, tp.z, [ps.tx[tm], ps.tz[tm]], 12, 24, 9));
      put(terrace, strip(ps, ib + 2, ie - 2, () => [O(fr + 2), CR + 0.62], (i) => [O(Math.max(fr + 3, back(i) - 2)), CR + 0.62], 24));
      for (let i = ib + 2; i < ie; i += Math.round(18 / ps.ds)) { const p = at(i, lip, CR + 2.2); const q = tr.nearest(p.x, p.z), aim = tr.sample(q.s, 0, f); lights.push({ x: p.x, y: p.y, z: p.z, tx: aim.x, tz: aim.z }); put(flood, boxAt(p.x, p.y, p.z, [ps.tx[i], ps.tz[i]], 1.6, 0.5, 0.7)); }
      const ring = []; for (let i = ib; i <= ie; i += 2) { const p = at(i, fr, 0); ring.push([p.x, p.z]); } for (let i = ie; i >= ib; i -= 2) { const p = at(i, back(i), 0); ring.push([p.x, p.z]); }
      solids.push({ ring, h: CR + 1 }); club.push(ring);
    }
    // ---- the paddock behind it, filling the ground inside the loop out to the return leg: team hospitality (dark flat
    //      roofs, lit glass fronts, people on the roof terraces), white marquees, a grey service block or two - in rows
    //      parallel to the plaza, each checked clear of the circuit, the lane and the club
    {
      const A = at(ia, 0, 0), Bp = at(ib, 0, 0), Lb = Math.hypot(Bp.x - A.x, Bp.z - A.z), ux = (Bp.x - A.x) / Lb, uz = (Bp.z - A.z) / Lb;
      const nm = Math.round((ia + ib) / 2), vx = ps.nx[nm] * gs, vz = ps.nz[nm] * gs;
      const W2 = (u, v) => [A.x + ux * u + vx * v, A.z + uz * u + vz * v];
      let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const clear = (u0, v0, du, dv) => {
        for (let a = 0; a <= 4; a++) for (let b = 0; b <= 3; b++) {
          const [x, z] = W2(u0 + du * a / 4, v0 + dv * b / 3); const q = tr.nearest(x, z);
          if (q.d <= 0 || corridorSigned(tr, pit, x, z, 3) < 0 || laneD(x, z) < hw + 4 || club.some((r) => inRing(x, z, r))) return false;
        }
        return true;
      };
      let nB = 0;
      for (let v = bk + 5, row = 0; v < bk + 130; v += row === 0 ? 30 : 22, row++) {
        for (let u = -20; u < Lb + 90;) {
          // (the first row: the long dark-roofed halls right behind the plaza; then hospitality, marquees, service blocks)
          let kind = rnd(), du = kind < 0.3 ? 24 + rnd() * 14 : 36 + rnd() * 30, dv = 18;
          if (row === 0) { kind = 2; du = 120 + rnd() * 40; dv = 24; if (!clear(u, v, du, dv)) du = 60; if (!clear(u, v, du, dv)) du = 30; }
          if (!clear(u, v, du, dv)) { u += 6; continue; }
          const [cx, cz] = W2(u + du / 2, v + dv / 2), ex = [ux, uz];
          if (kind === 2) {   // a long hall: dark roof, a lit band of glass along its plaza side, a lit terrace or two on top
            const h = 11; put(roofDark, boxAt(cx, h / 2, cz, ex, du, h, dv));
            const [fx, fz] = W2(u + du / 2, v - 0.05);
            for (const vv of [v - 0.05, v + dv + 0.05]) for (const yy of [2.6, 7.4]) { const [gx, gz] = W2(u + du / 2, vv); const g = new THREE.PlaneGeometry(du - 1, 3.4); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * du / 30); g.rotateY(Math.atan2(-uz, ux)); g.translate(gx, yy, gz); put(suites, g); }
            for (let t = 0; t < du - 20; t += 70) { const [tx, tz] = W2(u + 8 + t + 6, v + dv / 2); const tg = new THREE.PlaneGeometry(12, dv - 6); tg.rotateX(-Math.PI / 2); tg.rotateY(Math.atan2(-uz, ux)); tg.translate(tx, h + 0.05, tz); put(terrace, tg); }
            put(ledPink, boxAt(fx, h - 0.25, fz, ex, du, 0.22, 0.22));
          } else if (kind < 0.35) {   // a white marquee: a gabled fabric roof on a low wall
            put(tent, boxAt(cx, 1.6, cz, ex, du, 3.2, dv));
            const g = new THREE.CylinderGeometry(dv * 0.62, dv * 0.62, du, 3, 1); g.rotateZ(Math.PI / 2); g.scale(1, 0.38, 1); g.rotateY(Math.atan2(-uz, ux)); g.translate(cx, 3.2, cz); put(tent, g);
          } else if (kind < 0.85) {   // team hospitality: two storeys, a flat roof (dark, or light grey), a terrace on some
            const h = 7 + rnd() * 3.5; put(rnd() < 0.5 ? roofGrey : roofDark, boxAt(cx, h / 2, cz, ex, du, h, dv));
            const [fx, fz] = W2(u + du / 2, v - 0.05);
            for (const vv of [v - 0.05, v + dv + 0.05]) { const [gx, gz] = W2(u + du / 2, vv); const g = new THREE.PlaneGeometry(du - 1, h - 1.5); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * du / 30); g.rotateY(Math.atan2(-uz, ux)); g.translate(gx, h / 2, gz); put(suites, g); }   // (lit glass on both long sides)
            if (rnd() < 0.22) { const tg = new THREE.PlaneGeometry(du * 0.35, dv - 6); tg.rotateX(-Math.PI / 2); tg.rotateY(Math.atan2(-uz, ux)); tg.translate(cx, h + 0.05, cz); put(terrace, tg); }
            put(ledPink, boxAt(fx, h - 0.2, fz, ex, du, 0.2, 0.2));
          } else {   // a grey service block, taller
            put(greyBox, boxAt(cx, 9, cz, ex, du * 0.6, 18, dv * 0.8));
          }
          nB++; u += du + 4 + rnd() * 10;
        }
      }
      // (the paddock's paving between them, lit warm, and lamp posts: every 10 m square of the loop's ground that is clear)
      const paving = [];
      for (let v = bk + 1; v < bk + 135; v += 10) for (let u = -20; u < Lb + 90; u += 10) {
        if (!clear(u, v, 10, 10)) continue;
        const [cx, cz] = W2(u + 5, v + 5), g = new THREE.PlaneGeometry(10.05, 10.05); g.rotateX(-Math.PI / 2); g.rotateY(Math.atan2(-uz, ux)); g.translate(cx, 0.03, cz); paving.push(g);
        if (((u / 10) | 0) % 3 === 0 && ((v / 10) | 0) % 3 === 0) { put(white, boxAt(cx, 4, cz, [ux, uz], 0.25, 8, 0.25)); put(warmLamp, boxAt(cx, 8.1, cz, [ux, uz], 0.9, 0.35, 0.9)); }
      }
      for (const g of paving) put(pave, g);
      console.info(`[vegas] paddock: ${nB} hospitality units and marquees inside the loop, ${paving.length} squares of paving`);
    }
    { const p = at(ib - Math.round(10 / ps.ds), bk - 7, 0); put(greyBox, boxAt(p.x, 14, p.z, [ps.tx[ib], ps.tz[ib]], 14, 28, 12)); }   // (the dark grey tower at the plaza's Turn 1 end)
    // the pit lane itself, lit: cyan LED along the garages' feet and the pit wall's top (the lane glows on the aerials)
    put(ledCyan, strip(ps, ia, ib, () => [O(fr - 0.02), 0.05], () => [O(fr - 0.02), 0.32]));
    const ring = []; for (let i = ia; i <= ib; i += 4) ring.push([ps.px[i] + ps.nx[i] * O(fr), ps.pz[i] + ps.nz[i] * O(fr)]);
    for (let i = ib; i >= ia; i -= 4) ring.push([ps.px[i] + ps.nx[i] * O(bk), ps.pz[i] + ps.nz[i] * O(bk)]);
    solids.push({ ring, h: ROOF + 1 });
  }

  // =============================================================================================================
  // grandstands along the outside of the straight and of Turn 1: placements in straight sections following the line
  // the barrier keeps (+ the gap), checked against the circuit, the pit lane and the city's buildings
  // =============================================================================================================
  const side = -1;   // the right of the cars on the straight: opposite the pits, and the outside of Turns 1-3
  const near = rings.filter((r) => r.some(([x, z]) => { const q = tr.nearest(x, z); return Math.abs(q.d) < 200; }));
  const chain = (sA, sB, segLen, S, style, tag) => {
    // the stand's front line: the barrier here plus the gap, every 2 m of the lap
    const pts = [];
    for (let s = sA; s <= sB; s += 2) { const i = tr.idxAtS(s); tr.sample(s, side * (tr.wallAt(i, side) + S.gap), f); pts.push([f.x, f.z]); }
    // walked by arc length: a chord every segLen m
    const out = []; let a = pts[0], acc = 0;
    for (let k = 1; k < pts.length; k++) {
      const b = pts[k]; acc = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (acc < segLen && !(k === pts.length - 1 && acc > 14)) continue;   // (the last, shorter one too: the stand runs to its end)
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, ex = [(b[0] - a[0]) / acc, (b[1] - a[1]) / acc];
      const q = tr.nearest(mx, mz), t = tr.sample(q.s, 0, f2); let ez = [-ex[1], ex[0]]; if (ez[0] * (mx - t.x) + ez[1] * (mz - t.z) < 0) ez = [ex[1], -ex[0]];
      const len = acc - 0.4, depth = 0.8 + S.tiers * S.tierD + 0.6;
      const world = (lx, lz) => [mx + ex[0] * lx + ez[0] * lz, mz + ex[1] * lx + ez[1] * lz];
      let ok = true, why = '';
      for (let lx = -len / 2; lx <= len / 2 && ok; lx += 3) for (let lz = 0; lz <= depth && ok; lz += 3) {
        const [x, z] = world(lx, lz);
        if (corridorSigned(tr, pit, x, z, 1.0) < 0) { ok = false; why = `corridor at lx ${lx.toFixed(0)} lz ${lz.toFixed(0)} (s ${tr.nearest(x, z).s.toFixed(0)})`; }
        else for (const r of near) if (inRing(x, z, r)) { ok = false; why = 'building'; break; }
      }
      if (!ok) console.info(`[vegas] ${tag}: a section at s ${tr.nearest(mx, mz).s.toFixed(0)} left out - ${why}`);
      if (ok) out.push({ x: mx, z: mz, ex, ez, len, tiers: S.tiers, style, name: tag, depth, world });
      a = b;
    }
    return out;
  };
  const MAIN_STYLE = { tierH: MAIN.tierH, tierD: MAIN.tierD, roof: 'none', levels: 2, seat: 0x16171c, fill: 0.86 };
  const T1_STYLE = { tierH: T1S.tierH, tierD: T1S.tierD, roof: 'none', seat: 0x16171c, fill: 0.92 };
  const main = chain(-172, c1 - 38, 42, MAIN, MAIN_STYLE, 'Heineken Silver Main Grandstand');   // (from Turn 17's exit, s < 0: before the line)
  // the Turn 1 grandstand (the aerials from beyond Turn 1): one straight, rectangular stand on the outside of the run back
  // from Turn 2 toward Turn 3, along the plaza's north-west side, facing the track - no stand round the hairpin itself.
  // Fitted to the straightest stretch of that run: the longest window whose front line stays within 3 m of a straight
  // chord, the stand on that chord pushed out to the furthest point of the line (never closer than the barrier + gap)
  const straightStand = (sA, sB, S, maxLen, style, tag) => {
    const pts = []; for (let s = sA; s <= sB; s += 2) { const i = tr.idxAtS(s); tr.sample(s, side * (tr.wallAt(i, side) + S.gap), f); pts.push([f.x, f.z]); }
    let best = null;
    for (let a = 0; a < pts.length; a++) for (let b = pts.length - 1; b > a + 10; b--) {
      const A = pts[a], B = pts[b], len = Math.hypot(B[0] - A[0], B[1] - A[1]); if (len > maxLen || (best && len <= best.len)) continue;
      const ex = [(B[0] - A[0]) / len, (B[1] - A[1]) / len]; let ez = [-ex[1], ex[0]];
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], q = tr.nearest(M[0], M[1]), t = tr.sample(q.s, 0, f2); if (ez[0] * (M[0] - t.x) + ez[1] * (M[1] - t.z) < 0) ez = [ex[1], -ex[0]];
      let out = 0, lo = Infinity; for (let k = a; k <= b; k++) { const d = (pts[k][0] - A[0]) * ez[0] + (pts[k][1] - A[1]) * ez[1]; out = Math.max(out, d); lo = Math.min(lo, d); }
      if (out - lo > 6) continue;
      best = { len, ex, ez, x: M[0] + ez[0] * out, z: M[1] + ez[1] * out };
    }
    if (!best) return [];
    const depth = 0.8 + S.tiers * S.tierD + 0.6, len = best.len - 0.4, world = (lx, lz) => [best.x + best.ex[0] * lx + best.ez[0] * lz, best.z + best.ex[1] * lx + best.ez[1] * lz];
    for (let lx = -len / 2; lx <= len / 2; lx += 3) for (let lz = 0; lz <= depth; lz += 3) { const [x, z] = world(lx, lz); if (corridorSigned(tr, pit, x, z, 1.0) < 0 || near.some((r) => inRing(x, z, r))) return []; }
    return [{ x: best.x, z: best.z, ex: best.ex, ez: best.ez, len, tiers: S.tiers, style, name: tag, depth, world }];
  };
  const t1 = straightStand(c2 - 10, c3 - 20, T1S, 180, T1_STYLE, 'Turn 1 Grandstand');
  for (const p of [...main, ...t1]) stands.push(p);

  // ---- the main grandstand's own: the lighting truss on its towers, the hospitality pavilion on top, the signs
  const mTop = STAND.base + MAIN.tiers * MAIN.tierH, mBack = 0.8 + MAIN.tiers * MAIN.tierD, lowT = Math.round(MAIN.tiers / 2);
  const trussY = STAND.base + lowT * MAIN.tierH + 4.2, trussZ = 0.8 + lowT * MAIN.tierD - 1.2;
  main.forEach((p, k) => {
    const W = (lx, y, lz) => { const [x, z] = p.world(lx, lz); return [x, y, z]; };
    const B = (lx, y, lz, sx, sy, sz, mat) => { const [x, yy, z] = W(lx, y, lz); put(mat, boxAt(x, yy, z, p.ex, sx, sy, sz)); };
    // the truss: a lattice beam 1.8 m deep, front and back faces, the length of the stand; its towers every ~42 m
    for (const dz of [-0.6, 0.6]) { const g = new THREE.PlaneGeometry(p.len, 1.8); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 7); const [x, y, z] = W(0, trussY, trussZ + dz); g.rotateY(Math.atan2(-p.ex[1], p.ex[0])); g.translate(x, y, z); put(truss, g); }
    { const g = new THREE.PlaneGeometry(p.len, 1.2); g.rotateX(-Math.PI / 2); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 7); const [x, y, z] = W(0, trussY + 0.9, trussZ); g.rotateY(Math.atan2(-p.ex[1], p.ex[0])); g.translate(x, y, z); put(truss, g); }
    B(-p.len / 2 + 1, trussY / 2, trussZ, 1.2, trussY, 1.2, white);
    // red lamps along it, and floodlights on it aimed at the track
    for (let lx = -p.len / 2 + 4; lx < p.len / 2; lx += 10.5) B(lx, trussY - 1.15, trussZ - 0.7, 0.9, 0.5, 0.5, lamp);
    for (let lx = -p.len / 2 + 7; lx < p.len / 2; lx += 21) {
      B(lx, trussY + 1.25, trussZ - 0.7, 1.8, 0.6, 0.9, flood);
      const [x, y, z] = W(lx, trussY + 1.2, trussZ - 0.7), q = tr.nearest(x, z), aim = tr.sample(q.s, 0, f);
      lights.push({ x, y, z, tx: aim.x, tz: aim.z });
    }
    // the hospitality pavilion: two glazed storeys at the back of the top, a white roof reaching forward over the upper deck
    const pz0 = mBack - 9.5, pzc = mBack - 4.5;
    B(0, mTop + 0.25, pzc, p.len, 0.5, 10, white);
    for (const [y0, y1] of [[mTop + 0.5, mTop + 4.0], [mTop + 4.5, mTop + 8.0]]) {
      const g = new THREE.PlaneGeometry(p.len, y1 - y0); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 30);
      const [x, y, z] = W(0, (y0 + y1) / 2, pz0 + 0.4); g.rotateY(Math.atan2(-p.ex[1], p.ex[0])); g.translate(x, y, z); put(suites, g);
      const gg = new THREE.PlaneGeometry(p.len, y1 - y0); const [x2, y2, z2] = W(0, (y0 + y1) / 2, pz0); gg.rotateY(Math.atan2(-p.ex[1], p.ex[0])); gg.translate(x2, y2, z2); put(glass, gg);
    }
    B(0, mTop + 4.25, pzc, p.len, 0.5, 10, white); B(0, mTop + 4.25, pz0 - 0.05, p.len, 0.25, 0.1, ledPink);
    B(0, mTop + 8.4, pzc - 3.5, p.len + 1, 0.6, 17, white);   // the roof: white beneath ...
    B(0, mTop + 8.75, (mBack * 0.42 + mBack + 1) / 2, p.len + 1, 0.2, mBack + 1 - mBack * 0.42, maroon);   // ... maroon on top, over the upper deck (as from the air)
    for (let lx = -p.len / 2; lx <= p.len / 2; lx += 6) B(lx, mTop + 8.9, (mBack * 0.42 + mBack + 1) / 2, 0.25, 0.12, mBack + 1 - mBack * 0.42, white);
    B(0, mTop + 8.25, pzc - 12.05, p.len + 1, 0.3, 0.12, ledPink); B(0, mTop + 8.6, pzc - 12.05, p.len + 1, 0.25, 0.12, ledWhite);
    for (let lx = -p.len / 2 + 2; lx <= p.len / 2 - 2; lx += Math.max(8, (p.len - 4) / 4)) B(lx, mTop + 4.2, pz0 - 0.4, 0.35, 8.4, 0.35, white);
    B(0, mTop * 0.5, mBack + 0.35, p.len, mTop, 0.4, dark);   // (its back, dark: the lit faces read)
    // the floodlights along its front (on the catch-fence posts, 11 m up): the straight's own light, close over the road
    for (let lx = -p.len / 2 + 5; lx < p.len / 2; lx += 14) {
      const [x, y, z] = W(lx, 11, -2.2); B(lx, 5.5, -2.2, 0.35, 11, 0.35, white); B(lx, 11.2, -2.2, 1.6, 0.5, 0.8, flood);
      const q = tr.nearest(x, z), aim = tr.sample(q.s, 2, f); lights.push({ x, y, z, tx: aim.x, tz: aim.z });
    }
    // the floodlights on the roof's front edge, at the upper deck and the track
    for (let lx = -p.len / 2 + 12; lx < p.len / 2; lx += 21) { const [x, y, z] = W(lx, mTop + 8.0, pzc - 11.5); const q = tr.nearest(x, z), aim = tr.sample(q.s, side * 6, f); lights.push({ x, y, z, tx: aim.x, tz: aim.z }); }
    // Heineken Silver on the stand's two ends
    // (the end walls, the whole profile of the stand: teal Heineken Silver, reading the right way round from outside either end)
    if (k === 0 || k === main.length - 1) for (const e of k === 0 ? [-1] : [1]) {
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(mBack + 1, 0); sh.lineTo(mBack + 1, mTop + 9); sh.lineTo(mBack * 0.42, mTop + 9); sh.lineTo(-0.5, STAND.base + 2); sh.lineTo(-0.5, 0);
      const g = new THREE.ShapeGeometry(sh), P2 = g.attributes.position, uv = g.attributes.uv, pos = [];
      for (let j = 0; j < P2.count; j++) { const lz = P2.getX(j), y = P2.getY(j); uv.setXY(j, e > 0 ? 1 - lz / (mBack + 1) : lz / (mBack + 1), y / (mTop + 9)); const [x, z] = p.world(e * (p.len / 2 + 0.7), lz); pos.push(x, y, z); }
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); put(silverEnd, g);
    }
  });
  // ---- the Turn 1 grandstand: a pink LED along its front, floodlights on its canopy
  const tTop = STAND.base + T1S.tiers * T1S.tierH, tBack = 0.8 + T1S.tiers * T1S.tierD;
  t1.forEach((p, k) => {
    const [x, z] = p.world(0, -0.2); put(ledPink, boxAt(x, STAND.base + 0.2, z, p.ex, p.len, 0.18, 0.12));
    const [cx, cz] = p.world(0, tBack + 0.4); put(ledCyan, boxAt(cx, tTop + 1.4, cz, p.ex, p.len, 0.5, 0.3));   // (its back rail, lit cyan)
    for (let ax = -p.len / 2 + 6; ax < p.len / 2; ax += 18) { const [lx, lz] = p.world(ax, tBack + 0.3); put(flood, boxAt(lx, tTop + 7, lz, p.ex, 1.6, 0.5, 0.7)); put(white, boxAt(lx, (tTop + 7) / 2, lz, p.ex, 0.4, tTop + 7, 0.4)); const q = tr.nearest(lx, lz), aim = tr.sample(q.s, 0, f); lights.push({ x: lx, y: tTop + 7, z: lz, tx: aim.x, tz: aim.z }); }
    // (its back, the side the city sees: the race's banner, lit pink along the top)
    const g = new THREE.PlaneGeometry(p.len, tTop + 1.2); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 60);
    const [bx, bz] = p.world(0, tBack + 0.68); g.rotateY(Math.atan2(-p.ex[1], p.ex[0])); g.translate(bx, (tTop + 1.2) / 2, bz); put(banner, g);
    const [tx, tz] = p.world(0, tBack + 0.72); put(ledPink, boxAt(tx, tTop + 1.0, tz, p.ex, p.len, 0.22, 0.1));
  });
  // ---- searchlights: pale beams sweeping the sky from the plaza's roof and the main grandstand (the party)
  const beamMat = new THREE.ShaderMaterial({
    uniforms: { uBoost: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'varying float vY; void main(){ vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float uBoost; varying float vY; void main(){ gl_FragColor = vec4(vec3(0.75, 0.82, 1.0) * (1.0 - vY) * 0.16 * uBoost, 1.0); }',
  });
  const beams = [];
  const beamAt = (x, y, z, ph) => {
    const g = new THREE.CylinderGeometry(9, 0.5, 900, 12, 1, true); g.translate(0, 450, 0);
    const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setY(j, 1 - uv.getY(j));   // (bright at the lamp, gone at the top)
    const m = new THREE.Mesh(g, beamMat); m.position.set(x, y, z); m.frustumCulled = false; m.renderOrder = 6; m.userData.ph = ph; group.add(m); beams.push(m);
  };
  if (pit) {
    const ps = pit.samples, gs = -pit.trackSide, off = pit.halfWidth + 1.2 + 12;
    for (let k = 0; k < 4; k++) { const i = Math.round(ps.n * (0.3 + 0.12 * k)); beamAt(ps.px[i] + ps.nx[i] * gs * off, 20.5, ps.pz[i] + ps.nz[i] * gs * off, k * 1.7); }
  }
  for (const [k, p] of main.entries()) if (k % 2 === 1) { const [x, z] = p.world(0, mBack - 3); beamAt(x, mTop + 9, z, k * 2.3 + 0.8); }

  // =============================================================================================================
  // the run-off at Turn 1: the painted design on the asphalt outside the corner, kerb to (nearly) the barrier
  // =============================================================================================================
  const band = (sA, sB, i0, i1, map, transparent) => {
    const ia = tr.idxAtS(sA), n = Math.round((sB - sA) / tr.ds), ids = [];
    for (let k = 0; k <= n; k++) ids.push((ia + k) % tr.n);
    const T = { px: [], pz: [], nx: [], nz: [], s: [] };
    for (const i of ids) { T.px.push(tr.px[i]); T.pz.push(tr.pz[i]); T.nx.push(tr.nx[i]); T.nz.push(tr.nz[i]); T.s.push(T.s.length * tr.ds); }
    const base = (k) => tr.edgeAt(ids[k], side) + tr.kerbWidth, wallIn = (k) => tr.wallAt(ids[k], side) - 1.5;
    const inner = (k) => Math.min(base(k) + i0, wallIn(k) - 1), outer = (k) => Math.max(inner(k) + 0.5, Math.min(base(k) + i1, wallIn(k)));
    const g = strip(T, 0, ids.length - 1, (k) => [side * inner(k), 0.018], (k) => [side * outer(k), 0.018], 0);
    const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, T.s[k >> 1] / (n * tr.ds), 1 - uv.getY(k));   // (upright seen from outside the corner, reading the way the cars go)
    group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map, transparent, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide, emissive: 0x161616, depthWrite: !transparent })));
  };
  // (floodlight towers along the run-off's outer wall, round the hairpin, aimed at the corner)
  for (let s0 = c1 - 60; s0 <= c2 + 70; s0 += 11) { const i = tr.idxAtS(s0); const p = tr.sample(s0, side * (tr.wallAt(i, side) + 2.5), {}); const aim = tr.sample(s0, side * 4, f); put(white, boxAt(p.x, 9, p.z, [1, 0], 0.5, 18, 0.5)); put(flood, boxAt(p.x, 18.2, p.z, [aim.x - p.x, aim.z - p.z].map((v, _, a) => v / Math.hypot(a[0], a[1])), 0.8, 0.6, 2.2)); lights.push({ x: p.x, y: 18, z: p.z, tx: aim.x, tz: aim.z }); }
  // (the inside of the hairpin: the green Heineken fence along the wall, as on the aerials)
  {
    const sA = c1 - 70, sB = c2 + 60, ia = tr.idxAtS(sA), n = Math.round((sB - sA) / tr.ds), ids = []; for (let k = 0; k <= n; k++) ids.push((ia + k) % tr.n);
    const T = { px: [], pz: [], nx: [], nz: [], s: [] }; for (const i of ids) { T.px.push(tr.px[i]); T.pz.push(tr.pz[i]); T.nx.push(tr.nx[i]); T.nz.push(tr.nz[i]); T.s.push(T.s.length * tr.ds); }
    put(fence, strip(T, 0, ids.length - 1, (k) => [tr.wallAt(ids[k], 1) + 0.35, 0.9], (k) => [tr.wallAt(ids[k], 1) + 0.35, 3.1], 12));
  }
  band(c1 - 45, c2 + 45, 0.6, 7.6, runoffBandTexture(), false);          // Heineken / 0.0%, along the kerb round the hairpin
  band(c1 - 30, c2 + 25, 9.5, 21, runoffLettersTexture(), true);         // LAS VEGAS and the chevrons, further out
  if (false) {
    const sA = c1 - 125, sB = c1 + 45, ia = tr.idxAtS(sA), n = Math.round((sB - sA) / tr.ds), ids = [];
    for (let k = 0; k <= n; k++) ids.push((ia + k) % tr.n);
    const T = { px: [], pz: [], nx: [], nz: [], s: [] };
    for (const i of ids) { T.px.push(tr.px[i]); T.pz.push(tr.pz[i]); T.nx.push(tr.nx[i]); T.nz.push(tr.nz[i]); T.s.push(T.s.length * tr.ds); }
    const inner = (k) => tr.edgeAt(ids[k], side) + tr.kerbWidth + 0.8, outer = (k) => Math.max(inner(k) + 1, Math.min(inner(k) + 14, tr.wallAt(ids[k], side) - 1.5));
    const g = strip(T, 0, ids.length - 1, (k) => [side * inner(k), 0.016], (k) => [side * outer(k), 0.016], 0);
    const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, (T.s[k >> 1] / (n * tr.ds)));
    const m = new THREE.MeshStandardMaterial({ map: runoffTexture(), roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide, emissive: 0x111111 });
    group.add(new THREE.Mesh(g, m));
  }

  // ---- one mesh per material (the static world: a handful of draw calls)
  for (const [mat, gs] of geos) {
    const clean = gs.map((g) => { const h = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(h.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') h.deleteAttribute(k); if (!h.attributes.uv) h.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(h.attributes.position.count * 2), 2)); if (!h.attributes.normal) h.computeVertexNormals(); return h; });
    const mesh = new THREE.Mesh(mergeGeometries(clean), mat); mesh.name = 'vp'; if (mat === glass) mesh.renderOrder = 3; group.add(mesh);
  }
  const leds = [ledPink, ledCyan, ledWhite];
  const boxes = [new THREE.Box3().setFromObject(group)].filter((b) => !b.isEmpty());
  // (and the whole section, from Turn 17's exit to Turn 3, 120 m round: no auto-placed stand in it - only the real ones)
  { const b = new THREE.Box3(); for (let x = -260; x <= c3; x += 10) { tr.sample(x, 0, f); b.expandByPoint(new THREE.Vector3(f.x, 0, f.z)); } b.expandByVector(new THREE.Vector3(120, 0, 120)); b.max.y = 30; boxes.push(b); }
  // (the boxes the auto-placed stands must keep out of: all of this, and each stand of ours)
  for (const p of stands) { const r = [p.world(-p.len / 2, 0), p.world(p.len / 2, 0), p.world(p.len / 2, p.depth), p.world(-p.len / 2, p.depth)]; const b = new THREE.Box3(); for (const [x, z] of r) b.expandByPoint(new THREE.Vector3(x, 0, z)); b.max.y = 20; boxes.push(b); }
  console.info(`[vegas] paddock: plaza ${pit ? 'built' : 'no pit lane'}, main grandstand ${main.length} sections, Turn 1 grandstand ${t1.length ? `${t1[0].len.toFixed(0)} m` : 'none (no room)'}, ${lights.length} lamps`);
  return {
    group, stands, lights, boxes, solids,
    update(t) {
      const night = FLOOD.floodOn.value > 0.5; for (const m of leds) { m.uniforms.uTime.value = t; m.uniforms.uBoost.value = night ? 1.25 : 0.45; } red.emissiveIntensity = night ? 1.6 : 0.25;
      beamMat.uniforms.uBoost.value = night ? 1 : 0; for (const b of beams) { b.visible = night; b.rotation.set(0.32 * Math.sin(t * 0.21 + b.userData.ph), 0, 0.32 * Math.cos(t * 0.17 + b.userData.ph * 1.3)); }
    },
  };
}
