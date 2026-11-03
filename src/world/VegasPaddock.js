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
const MAIN = { tiers: 38, tierH: 0.6, tierD: 0.98, gap: 1.5 };     // the main grandstand (two decks: Grandstands levels 2) - a big one

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
/** Turn 1's band along the outside kerb, one repeat (24 m): Heineken green with the name, the red star on the join,
 *  the blue -0.0 - as painted round the hairpin (u along the lap; the canvas's top at the kerb) */
function bandTileTexture() {
  return canvasTex(2048, 320, (x, W, H) => {
    const J = W * 0.64;
    x.fillStyle = '#12a24a'; x.fillRect(0, 0, J, H); x.fillStyle = '#1f5ad6'; x.fillRect(J, 0, W - J, H);
    x.fillStyle = '#ffffff'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.font = `italic 900 210px Georgia, "Times New Roman", serif`; x.fillText('Heineken', J * 0.5, H * 0.53);
    x.font = `900 190px ${FONT}`; x.fillText('-0.0', J + (W - J) * 0.5, H * 0.53);
    const star = (cx, cy, r0, r1, col) => { x.fillStyle = col; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? r0 : r1; (j ? x.lineTo : x.moveTo).call(x, cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill(); };
    star(J, H * 0.5, 52, 124, '#ffffff'); star(J, H * 0.5, 40, 100, '#e1001a');
  }, true);
}
/** the race's wordmark and the two arrows on Turn 1's run-off: white outlines on the asphalt (x across the run-off from
 *  the straight's side, the top toward the corner) */
function lvgpRunoffTexture() {
  return canvasTex(4096, 1024, (x, W, H) => {
    x.clearRect(0, 0, W, H); x.lineJoin = 'round'; x.lineCap = 'round'; x.strokeStyle = '#f4f6fa';
    // (the wordmark: a joined, sloping lowercase script, outlined - LasVegasGP)
    x.save(); x.translate(W * 0.34, H * 0.55); x.transform(1, 0, -0.18, 1, 0, 0); x.scale(1.12, 1);
    x.font = `italic 600 360px "Brush Script MT", "Segoe Script", "Comic Sans MS", ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 15; x.strokeText('LasVegasGP', 0, 0); x.restore();
    // (the two arrows: outlined chevrons, nested, pointing on round the corner)
    for (let k = 0; k < 2; k++) {
      const cx = W * 0.66 + k * 330, t = 150, top = H * 0.08, bot = H * 0.92, mid = H * 0.5, run = 520;
      x.lineWidth = 15; x.beginPath(); x.moveTo(cx, top); x.lineTo(cx + t, top); x.lineTo(cx + t + run, mid); x.lineTo(cx + t, bot); x.lineTo(cx, bot); x.lineTo(cx + run, mid); x.closePath(); x.stroke();
    }
  });
}
/** the boards along the inside wall round the hairpin: Heineken green, WHEN YOU DRIVE NEVER DRINK */
function neverDrinkTexture() {
  return canvasTex(1024, 96, (x, W, H) => {
    x.fillStyle = '#16a34a'; x.fillRect(0, 0, W, H); x.fillStyle = '#0b6e30'; x.fillRect(0, 0, W, 6); x.fillRect(0, H - 6, W, 6);
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 46px ${FONT}`; x.fillText('WHEN YOU DRIVE NEVER DRINK', W * 0.5, H * 0.53);
    x.fillStyle = '#e1001a'; for (const cx of [26, W - 26]) { x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 7 : 17; (j ? x.lineTo : x.moveTo).call(x, cx + Math.cos(a) * r, H / 2 + Math.sin(a) * r); } x.fill(); }
  }, true);
}
/** Red Bull along the Turn 3 stand's front: navy boards, the name in red, the yellow sun between two charging bulls
 *  (drawn as red wedges) - as on the race's render of the stand (one repeat: 8 m) */
function redBullBoardTexture() {
  return canvasTex(1024, 160, (x, W, H) => {
    x.fillStyle = '#0b1f5c'; x.fillRect(0, 0, W, H); x.fillStyle = '#c9d2e8'; x.fillRect(0, H - 6, W, 6);
    const cx = W * 0.22, cy = H * 0.5; x.fillStyle = '#ffcc00'; x.beginPath(); x.arc(cx, cy, 34, 0, 6.283); x.fill();
    x.fillStyle = '#d6001c'; for (const d of [-1, 1]) { x.beginPath(); x.moveTo(cx + d * 22, cy + 6); x.lineTo(cx + d * 92, cy - 22); x.lineTo(cx + d * 100, cy + 30); x.lineTo(cx + d * 30, cy + 34); x.closePath(); x.fill(); }
    x.fillStyle = '#d6001c'; x.font = `italic 900 92px ${FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('Red Bull', W * 0.42, H * 0.54);
  }, true);
}
/** the Turn 3 stand's end walls: navy, the sun and the bulls, the name */
function redBullEndTexture() {
  return canvasTex(1024, 768, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#13307e'); g.addColorStop(1, '#081845'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const cx = W * 0.5, cy = H * 0.42; x.fillStyle = '#ffcc00'; x.beginPath(); x.arc(cx, cy, 90, 0, 6.283); x.fill();
    x.fillStyle = '#d6001c'; for (const d of [-1, 1]) { x.beginPath(); x.moveTo(cx + d * 50, cy + 14); x.lineTo(cx + d * 250, cy - 60); x.lineTo(cx + d * 270, cy + 80); x.lineTo(cx + d * 70, cy + 92); x.closePath(); x.fill(); }
    x.fillStyle = '#d6001c'; x.font = `italic 900 150px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Red Bull', cx, H * 0.75);
  });
}
/** the painted strip outside Turn 4 (the race's render): the red F1 logo, FORMULA 1 * HEINEKEN SILVER over LAS VEGAS GRAND
 *  PRIX in white outline - mirrored, since the strip's u runs against the way it reads from the outside */
function f1StripTexture() {
  return canvasTex(4096, 512, (x, W, H) => {
    x.clearRect(0, 0, W, H); x.save(); x.translate(W, 0); x.scale(-1, 1); x.lineJoin = 'round';
    x.fillStyle = '#e10600'; x.font = `italic 900 330px ${FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('F1', 90, H * 0.5);
    x.strokeStyle = '#f4f6fa'; x.lineWidth = 9; x.font = `800 170px ${FONT}`;
    x.strokeText('FORMULA 1', 700, H * 0.3); x.strokeText('HEINEKEN SILVER', 1900, H * 0.3); x.strokeText('LAS VEGAS GRAND PRIX', 700, H * 0.72);
    x.fillStyle = '#e1001a'; x.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 26 : 64; (j ? x.lineTo : x.moveTo).call(x, 1750 + Math.cos(a) * r, H * 0.3 + Math.sin(a) * r); } x.fill();
    x.restore();
  });
}
/** a dark street facade (32 m x 28 m a repeat): dark walls and darker glass, a few rooms lit warm or cool, a balcony rail
 *  here and there catching the light - the rest left to the dark, as the backs of Koval Lane are from the track */
function darkFacadeTexture(seed = 3, litK = 1) {
  let a = seed; const rnd = () => ((a = (a * 16807) % 2147483647) / 2147483647);
  return canvasTex(1024, 1024, (x, W, H) => {
    x.fillStyle = '#131418'; x.fillRect(0, 0, W, H);
    const FL = 8, fh = H / FL, cols = 14, cw = W / cols;
    for (let f = 0; f < FL; f++) {
      x.fillStyle = '#1d1f25'; x.fillRect(0, f * fh, W, 7);   // the floor slab
      const balcony = rnd() < 0.22;
      for (let c = 0; c < cols; c++) {
        const lit = rnd(), wx = c * cw + 9, wy = f * fh + 20, ww = cw - 18, wh = fh - 34;
        const l2 = lit / litK; x.fillStyle = l2 < 0.05 ? '#ffcf8a' : l2 < 0.075 ? '#bfe0ff' : l2 < 0.09 ? '#ff9ad8' : '#0a0c11'; x.fillRect(wx, wy, ww, wh);
        if (l2 < 0.09) { x.fillStyle = 'rgba(30,20,20,0.5)'; x.fillRect(wx + ww * 0.6, wy, ww * 0.1, wh); }   // (a figure, a curtain)
      }
      if (balcony) { x.fillStyle = '#4a4d55'; x.fillRect(0, f * fh + fh - 26, W, 5); x.fillStyle = 'rgba(160,170,185,0.35)'; x.fillRect(0, f * fh + fh - 46, W, 20); }
    }
  }, true);
}
/** the screen by the Sphere: the broadcast - a car on the night track, the timing tower, the race's name */
function broadcastTexture() {
  return canvasTex(1024, 576, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0f2a'); g.addColorStop(0.55, '#1a1440'); g.addColorStop(0.56, '#2a2b33'); g.addColorStop(1, '#17181d'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#3d65ff'; x.beginPath(); x.arc(W * 0.78, H * 0.32, 120, 0, 6.283); x.fill();   // (the Sphere, behind)
    x.fillStyle = '#e8e8ec'; x.fillRect(0, H * 0.75, W, 6);
    x.fillStyle = '#c8102e'; x.beginPath(); x.moveTo(W * 0.3, H * 0.7); x.lineTo(W * 0.62, H * 0.66); x.lineTo(W * 0.66, H * 0.7); x.lineTo(W * 0.64, H * 0.74); x.lineTo(W * 0.3, H * 0.75); x.closePath(); x.fill();
    x.fillStyle = '#111'; for (const u of [0.35, 0.6]) { x.beginPath(); x.arc(W * u, H * 0.75, 26, 0, 6.283); x.fill(); }
    x.fillStyle = 'rgba(10,10,20,0.85)'; x.fillRect(24, 24, 210, 300); x.fillStyle = '#ffffff'; x.font = `700 26px ${FONT}`;
    ['1  LEC', '2  VER', '3  NOR', '4  PIA', '5  HAM', '6  RUS', '7  SAI', '8  ALO'].forEach((t, k) => { x.fillText(t, 40, 64 + k * 34); x.fillStyle = ['#e10600', '#1e41ff', '#ff8000', '#ff8000', '#00d2be', '#00d2be', '#e10600', '#006f62'][k]; x.fillRect(30, 44 + k * 34, 5, 26); x.fillStyle = '#ffffff'; });
    x.fillStyle = '#e10600'; x.font = `italic 900 44px ${FONT}`; x.fillText('F1', W - 180, H - 40); x.fillStyle = '#ffffff'; x.font = `800 30px ${FONT}`; x.fillText('LAS VEGAS GRAND PRIX', W - 560, H - 44);
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
  const maroon = new THREE.MeshStandardMaterial({ color: 0x4e121c, roughness: 0.75, metalness: 0.15, emissive: 0x1c0408, side: THREE.DoubleSide });
  const terrace = new THREE.MeshBasicMaterial({ map: terraceTexture(), side: THREE.DoubleSide });
  const tent = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.55, emissive: 0x2c2a2e, side: THREE.DoubleSide });
  const greyBox = new THREE.MeshStandardMaterial({ color: 0x4a4e57, roughness: 0.7, metalness: 0.25, side: THREE.DoubleSide });
  const fence = new THREE.MeshStandardMaterial({ map: canvasTex(1024, 128, (x, W, H) => { x.fillStyle = '#0f8a42'; x.fillRect(0, 0, W, H); x.fillStyle = '#ffffff'; x.font = `italic 900 70px Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; for (let k = 0; k < 2; k++) x.fillText('Heineken', W * (0.25 + 0.5 * k), H / 2); }, true), emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide });
  fence.emissiveMap = fence.map; fence.emissiveIntensity = 0.45;
  const silverEnd = new THREE.MeshStandardMaterial({ map: silverEndTexture(), emissive: 0xffffff, emissiveIntensity: 0, side: THREE.DoubleSide }); silverEnd.emissiveMap = silverEnd.map; silverEnd.emissiveIntensity = 0.75;
  const ledBlue = ledMaterial(0x2a6cff, 0x22d3ff, 0.9, 0.025);
  const rbBoard = new THREE.MeshStandardMaterial({ map: redBullBoardTexture(), emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.5, side: THREE.DoubleSide }); rbBoard.emissiveMap = rbBoard.map; rbBoard.emissiveIntensity = 0.6;
  const rbEnd = new THREE.MeshStandardMaterial({ map: redBullEndTexture(), emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.6, side: THREE.DoubleSide }); rbEnd.emissiveMap = rbEnd.map; rbEnd.emissiveIntensity = 0.55;
  const f1Sign = new THREE.MeshBasicMaterial({ map: canvasTex(256, 768, (x, W, H) => { x.fillStyle = '#c80000'; x.fillRect(0, 0, W, H); x.fillStyle = '#ffffff'; x.save(); x.translate(W / 2, H / 2); x.rotate(-Math.PI / 2); x.font = `italic 900 190px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('F1', 0, 8); x.restore(); }), side: THREE.DoubleSide });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b5a44, roughness: 0.9 }), frondMat = new THREE.MeshStandardMaterial({ color: 0x2f6b34, roughness: 0.8, emissive: 0x0a2010, side: THREE.DoubleSide });
  /** a palm: a slim leaning trunk, a crown of drooping fronds */
  const palm = (x, z, h) => {
    const tg = new THREE.CylinderGeometry(0.18, 0.3, h, 6); tg.translate(x, h / 2, z); put(trunkMat, tg);
    for (let j = 0; j < 9; j++) {
      const a = (j / 9) * Math.PI * 2, L = 3.6, fg = new THREE.PlaneGeometry(L, 0.9); fg.translate(L / 2, 0, 0); fg.rotateX(Math.PI / 2); fg.rotateZ(-0.45); fg.rotateY(a); fg.translate(x, h, z); put(frondMat, fg);
    }
  };
  const scaffoldMat = new THREE.MeshStandardMaterial({ map: (() => { const t = trussTexture(); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })(), alphaTest: 0.5, color: 0x9ea3ab, roughness: 0.6, metalness: 0.4, side: THREE.DoubleSide });
  const gantryBanner = new THREE.MeshBasicMaterial({ map: canvasTex(1536, 160, (x, W, H) => { x.fillStyle = '#0b0b0d'; x.fillRect(0, 0, W, H); x.fillStyle = '#e10600'; x.font = `italic 900 120px ${FONT}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText('F1', 40, H * 0.55); x.fillStyle = '#ffffff'; x.font = `800 84px ${FONT}`; x.fillText('LAS VEGAS GRAND PRIX', 250, H * 0.55); }), side: THREE.FrontSide });
  const dYellow = new THREE.MeshBasicMaterial({ color: 0xd4ae1c, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  const scrim = new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.95, side: THREE.DoubleSide });
  const bodyDark = new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.9, side: THREE.DoubleSide });
  const facadeGarage = new THREE.MeshStandardMaterial({ map: darkFacadeTexture(9, 0.2), emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.9, side: THREE.DoubleSide }); facadeGarage.emissiveMap = facadeGarage.map; facadeGarage.emissiveIntensity = 0.6;
  const facadeDark = new THREE.MeshStandardMaterial({ map: darkFacadeTexture(5), emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.85, side: THREE.DoubleSide }); facadeDark.emissiveMap = facadeDark.map; facadeDark.emissiveIntensity = 0.9;
  const merchFront = new THREE.MeshBasicMaterial({ map: canvasTex(256, 128, (x, W, H) => { x.fillStyle = '#fff3dc'; x.fillRect(0, 0, W, H); for (let k = 0; k < 9; k++) { x.fillStyle = ['#e10600', '#1b1b1f', '#e20074', '#ffffff', '#1e41ff'][k % 5]; x.fillRect(10 + k * 27, 30 + (k % 2) * 10, 20, 40); } x.fillStyle = '#e10600'; x.font = `800 24px ${FONT}`; x.fillText('F1 STORE', 70, H - 14); }), side: THREE.DoubleSide });
  const awningPink = new THREE.MeshStandardMaterial({ color: 0xe20074, emissive: 0x40001a, roughness: 0.6 }), awningWhite = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, emissive: 0x202020, roughness: 0.6 });
  const screenMat = new THREE.MeshBasicMaterial({ map: broadcastTexture(), fog: false, side: THREE.DoubleSide });
  const bridgeDark = new THREE.MeshStandardMaterial({ color: 0x1b1c22, roughness: 0.8, metalness: 0.2 });
  const bridgeSign = new THREE.MeshBasicMaterial({ fog: false, side: THREE.DoubleSide, map: canvasTex(2048, 160, (x, W, H) => { x.fillStyle = '#121218'; x.fillRect(0, 0, W, H); x.fillStyle = '#c69bff'; x.shadowColor = '#b06bff'; x.shadowBlur = 18; x.font = `800 104px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LAS VEGAS GRAND PRIX', W / 2, H * 0.54); }) });
  const lampWhite = new THREE.MeshBasicMaterial({ color: 0xfffaf0, fog: false });
  const aisleLit = new THREE.MeshBasicMaterial({ color: 0xdfe6ff, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const neverDrink = new THREE.MeshStandardMaterial({ map: neverDrinkTexture(), emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.5, side: THREE.DoubleSide }); neverDrink.emissiveMap = neverDrink.map; neverDrink.emissiveIntensity = 0.7;
  const bandMat = new THREE.MeshStandardMaterial({ map: bandTileTexture(), roughness: 0.6, emissive: 0xffffff, emissiveIntensity: 0, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }); bandMat.emissiveMap = bandMat.map; bandMat.emissiveIntensity = 0.32;
  // (the run-off's asphalt: lighter where the cars have run wide and the lamps are brightest, by the kerb, darkening out
  //  to the walls - v 0 at the kerb, 1 at the wall)
  const runoffGrad = canvasTex(8, 256, (x, W, H) => { const g = x.createLinearGradient(0, H, 0, 0); g.addColorStop(0, '#74767c'); g.addColorStop(0.35, '#5a5c62'); g.addColorStop(1, '#3a3c41'); x.fillStyle = g; x.fillRect(0, 0, W, H); });
  const runoffAsph = new THREE.MeshStandardMaterial({ map: runoffGrad, color: 0xffffff, roughness: 0.85, emissive: 0x16171a, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, side: THREE.DoubleSide });
  const trussTall = new THREE.MeshBasicMaterial({ map: trussTexture(), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xe8eaf0 });
  const kerbRW = new THREE.MeshStandardMaterial({ map: canvasTex(256, 64, (x, W, H) => { x.fillStyle = '#d8262b'; x.fillRect(0, 0, W / 2, H); x.fillStyle = '#f3f1ec'; x.fillRect(W / 2, 0, W / 2, H); }, true), roughness: 0.6, emissive: 0x2a1010, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
  const chevBlue = new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (x, W, H) => { x.fillStyle = '#1d4fd8'; x.fillRect(0, 0, W, H); x.fillStyle = '#f2f4f8'; x.beginPath(); x.moveTo(W * 0.15, 0); x.lineTo(W * 0.6, H * 0.5); x.lineTo(W * 0.15, H); x.lineTo(W * 0.42, H); x.lineTo(W * 0.87, H * 0.5); x.lineTo(W * 0.42, 0); x.closePath(); x.fill(); }, true), roughness: 0.7, emissive: 0x0a1430, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, side: THREE.DoubleSide });
  const pinkGlass = new THREE.MeshStandardMaterial({ color: 0xff3da0, emissive: 0xff2a90, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide });
  const laneFloor = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, roughness: 0.7, emissive: 0x2c2e34, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, side: THREE.DoubleSide });
  const glowPurple = new THREE.MeshBasicMaterial({ map: canvasTex(256, 256, (x, W, H) => { const g = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); g.addColorStop(0, 'rgba(150,70,230,0.55)'); g.addColorStop(0.45, 'rgba(110,35,190,0.25)'); g.addColorStop(1, 'rgba(90,20,160,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const glowPink = new THREE.MeshBasicMaterial({ map: canvasTex(256, 256, (x, W, H) => { const g = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2); g.addColorStop(0, 'rgba(240,70,160,0.5)'); g.addColorStop(0.5, 'rgba(200,40,130,0.22)'); g.addColorStop(1, 'rgba(160,20,100,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const tentLit = new THREE.MeshStandardMaterial({ color: 0xe8e2f0, emissive: 0x5a2a90, emissiveIntensity: 0.6, roughness: 0.5, side: THREE.DoubleSide });
  const roadAsph = new THREE.MeshStandardMaterial({ color: 0x2a2b30, roughness: 0.9, side: THREE.DoubleSide });
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
    const li = Math.min(ib - 4, ia + Math.round(34 / ps.ds)), lc = at(li, (lip + bk) / 2, ROOF + 6.4), lang = Math.atan2(-ps.tz[li], ps.tx[li]);
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
            const h = 9; put(roofDark, boxAt(cx, h / 2, cz, ex, du, h, dv));
            for (const [ox, oz, lx2, lz2] of [[0, -dv / 2, du, 0.35], [0, dv / 2, du, 0.35], [-du / 2, 0, 0.35, dv], [du / 2, 0, 0.35, dv]]) { const [px, pz] = W2(u + du / 2 + ox, v + dv / 2 + oz); put(white, boxAt(px, h + 0.3, pz, ex, lx2, 0.6, lz2)); }
            const [fx, fz] = W2(u + du / 2, v - 0.05);
            for (const vv of [v - 0.05, v + dv + 0.05]) for (const yy of [2.4, 6.4]) { const [gx, gz] = W2(u + du / 2, vv); const g = new THREE.PlaneGeometry(du - 1, 3.4); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * du / 30); g.rotateY(Math.atan2(-uz, ux)); g.translate(gx, yy, gz); put(suites, g); }
            for (let t = 0; t < du - 20; t += 70) { const [tx, tz] = W2(u + 8 + t + 6, v + dv / 2); const tg = new THREE.PlaneGeometry(12, dv - 6); tg.rotateX(-Math.PI / 2); tg.rotateY(Math.atan2(-uz, ux)); tg.translate(tx, h + 0.05, tz); put(terrace, tg); }
            put(ledPink, boxAt(fx, h - 0.25, fz, ex, du, 0.22, 0.22));
          } else if (kind < 0.35) {   // a white marquee: a gabled fabric roof on a low wall
            put(tent, boxAt(cx, 1.6, cz, ex, du, 3.2, dv));
            const g = new THREE.CylinderGeometry(dv * 0.62, dv * 0.62, du, 3, 1); g.rotateZ(Math.PI / 2); g.scale(1, 0.38, 1); g.rotateY(Math.atan2(-uz, ux)); g.translate(cx, 3.2, cz); put(tent, g);
          } else if (kind < 0.85) {   // team hospitality: two storeys, a flat roof (dark, or light grey), a terrace on some
            const h = 5.5 + rnd() * 2.5; put(rnd() < 0.5 ? roofGrey : roofDark, boxAt(cx, h / 2, cz, ex, du, h, dv));
            for (const [ox, oz, lx2, lz2] of [[0, -dv / 2, du, 0.35], [0, dv / 2, du, 0.35], [-du / 2, 0, 0.35, dv], [du / 2, 0, 0.35, dv]]) { const [px, pz] = W2(u + du / 2 + ox, v + dv / 2 + oz); put(white, boxAt(px, h + 0.3, pz, ex, lx2, 0.6, lz2)); }   // (a white parapet round its roof)
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
    // ---- the roof as the aerials show it: not one slab - plant rooms and stair heads of different heights between the
    //      lit terraces, and at the south-west end the raised glass pavilion under the logo, lit pink
    for (const [t, len, h, dep] of [[0.18, 16, 5.5, 12], [0.36, 22, 3.6, 16], [0.55, 12, 7.5, 10], [0.7, 26, 4.2, 15], [0.86, 14, 6, 11]]) {
      const i = Math.round(ia + (ib - ia) * t), p = at(i, fr + 4 + dep / 2, 0); put(roofDark, boxAt(p.x, ROOF + 0.55 + h / 2, p.z, [ps.tx[i], ps.tz[i]], len, h, dep));
    }
    { const i = Math.min(ib, li), p = at(i, (lip + bk) / 2, 0); put(pinkGlass, boxAt(p.x, ROOF + 0.55 + 2.4, p.z, [ps.tx[i], ps.tz[i]], 44, 4.8, bk - lip - 6)); }
    // the pit lane itself, bright as it is under the lights: a pale floor between the pit wall and the garages, a white
    // light line along the garage fronts, lamps over the lane
    put(laneFloor, strip(ps, ia - 6, ib + 4, () => [O(-hw + 0.4), 0.012], () => [O(fr - 0.3), 0.012], 8));
    put(ledWhite, strip(ps, ia, ib, () => [O(fr - 0.05), 4.6], () => [O(fr - 0.05), 4.9]));
    for (let i = ia; i <= ib; i += Math.round(14 / ps.ds)) { const p = at(i, fr - 1, 8.5); lights.push({ x: p.x, y: p.y, z: p.z, tx: ps.px[i], tz: ps.pz[i] }); }
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
  const chain = (sA, sB, segLen, S, style, tag, margin = 1.0) => {
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
        if (corridorSigned(tr, pit, x, z, margin) < 0) { ok = false; why = `corridor at lx ${lx.toFixed(0)} lz ${lz.toFixed(0)} (s ${tr.nearest(x, z).s.toFixed(0)})`; }
        else for (const r of near) if (inRing(x, z, r)) { ok = false; why = 'building'; break; }
      }
      if (!ok) console.info(`[vegas] ${tag}: a section at s ${tr.nearest(mx, mz).s.toFixed(0)} left out - ${why}`);
      if (ok) out.push({ x: mx, z: mz, ex, ez, len, tiers: S.tiers, style, name: tag, depth, world });
      a = b;
    }
    return out;
  };
  const MAIN_STYLE = { tierH: MAIN.tierH, tierD: MAIN.tierD, roof: 'none', levels: 2, seat: 0x16171c, fill: 0.86 };
  const main = chain(cornerS(17) - L + 45, c1 - 45, 42, MAIN, MAIN_STYLE, 'Heineken Silver Main Grandstand', -0.4);   // (from Turn 17's exit - s < 0, before the line - to Turn 1's braking)
  // the general-admission stand round the inside of Turns 2-4: PG2 along the return leg, PG3 round Turn 3, PG4 on to
  // Turn 4 (the official seating map). One stand, as the onboard footage and the race's render of Turn 3 show it - big,
  // open, its sections fanning round the bend with wedge-shaped aisles between them; nothing beside the leg for the first
  // ~95 m out of Turn 2 (the onboard: only the fence there, the stand ahead), and nothing past Turn 4. Each section the longest chord of the barrier's line (+ the gap) that is clear
  // of the circuit, the city and the section before it: 24 m on the straight, shorter round the bend.
  const WRAP = { tiers: 30, tierH: 0.55, tierD: 0.92, gap: 1.5 };
  const wrapStand = (sA, sB, S) => {
    const pts = []; for (let s = sA; s <= sB; s += 1) { const i = tr.idxAtS(s); tr.sample(s, side * (tr.wallAt(i, side) + S.gap), f); pts.push([f.x, f.z]); }
    const depth = 0.8 + S.tiers * S.tierD + 0.6, out = [];
    const make = (a, b) => {
      const l0 = Math.hypot(b[0] - a[0], b[1] - a[1]), ex = [(b[0] - a[0]) / l0, (b[1] - a[1]) / l0], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      const q = tr.nearest(mx, mz), t = tr.sample(q.s, 0, f2); let ez = [-ex[1], ex[0]]; if (ez[0] * (mx - t.x) + ez[1] * (mz - t.z) < 0) ez = [ex[1], -ex[0]];
      return { x: mx, z: mz, ex, ez, len: l0 - 0.4, depth, s: q.s, world: (lx, lz) => [mx + ex[0] * lx + ez[0] * lz, mz + ex[1] * lx + ez[1] * lz] };
    };
    const within = (p, x, z) => { const dx = x - p.x, dz = z - p.z, lx = dx * p.ex[0] + dz * p.ex[1], lz = dx * p.ez[0] + dz * p.ez[1]; return Math.abs(lx) < p.len / 2 + 0.8 && lz > -0.5 && lz < p.depth + 0.5; };
    const clear = (p) => {
      for (let lx = -p.len / 2; lx <= p.len / 2 + 0.01; lx += 2) for (let lz = 0; lz <= p.depth + 0.01; lz += 2) {
        const [x, z] = p.world(lx, lz); if (corridorSigned(tr, pit, x, z, -0.4) < 0 || near.some((r) => inRing(x, z, r)) || (out.length && within(out[out.length - 1], x, z))) return false;
      }
      return true;
    };
    let k = 0;
    while (k < pts.length - 10) {
      let got = null;
      for (let k0 = k; k0 < Math.min(pts.length - 10, k + 24) && !got; k0++) for (const L of [24, 18, 13]) { if (k0 + L >= pts.length) continue; const p = make(pts[k0], pts[k0 + L]); if (clear(p)) { got = p; k = k0 + L; break; } }
      if (got) out.push(got); else k += 4;
    }
    return out;
  };
  const wrap = wrapStand(c2 + 95, cornerS(4) - 8, WRAP).map((p) => ({
    ...p, tiers: WRAP.tiers, name: `General admission ${p.s < c3 - 40 ? 'PG2' : p.s < c3 + 70 ? 'PG3' : 'PG4'}`,
    // (navy seats; the block of orange ones by the apex, as on the render)
    style: { tierH: WRAP.tierH, tierD: WRAP.tierD, roof: 'none', seat: p.s > c3 - 15 && p.s < c3 + 35 ? 0xd2691e : 0x1b2a6b, fill: 0.95 },
  }));
  for (const p of [...main, ...wrap]) stands.push(p);

  // ---- the main grandstand's own: the lighting truss on its towers, the hospitality suites at the top, the roof, the
  //      teal ends, the scaffold at its Turn 1 end
  const mTop = STAND.base + MAIN.tiers * MAIN.tierH, mBack = 0.8 + MAIN.tiers * MAIN.tierD, lowT = Math.round(MAIN.tiers / 2);
  const trussY = STAND.base + lowT * MAIN.tierH + 4.2, trussZ = 0.8 + lowT * MAIN.tierD - 1.2;
  // (the roof: one dark red sheet over most of the seats - from a fifth of the way back, rising to the back - its front
  //  on a white edge beam; seen from the air only the lower front rows show)
  const RF = { front: mBack * 0.2, yF: mTop + 5.2, yB: mTop + 10.5 };
  const quad = (a, b, c, d, mat, ur = 1) => {   // (a b along the front edge, d c along the back: a flat sheet)
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, ur, 0, ur, 1, 0, 0, ur, 1, 0, 1], 2)); g.computeVertexNormals(); put(mat, g);
  };
  main.forEach((p, k) => {
    const W = (lx, y, lz) => { const [x, z] = p.world(lx, lz); return [x, y, z]; };
    const B = (lx, y, lz, sx, sy, sz, mat) => { const [x, yy, z] = W(lx, y, lz); put(mat, boxAt(x, yy, z, p.ex, sx, sy, sz)); };
    const ang = Math.atan2(-p.ex[1], p.ex[0]);
    // the truss: a lattice beam 1.8 m deep across the front of the upper deck, front and back faces and its top
    for (const dz of [-0.6, 0.6]) { const g = new THREE.PlaneGeometry(p.len, 1.8); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 7); const [x, y, z] = W(0, trussY, trussZ + dz); g.rotateY(ang); g.translate(x, y, z); put(truss, g); }
    { const g = new THREE.PlaneGeometry(p.len, 1.2); g.rotateX(-Math.PI / 2); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 7); const [x, y, z] = W(0, trussY + 0.9, trussZ); g.rotateY(ang); g.translate(x, y, z); put(truss, g); }
    B(-p.len / 2 + 1, trussY / 2, trussZ, 1.2, trussY, 1.2, white);
    for (let lx = -p.len / 2 + 4; lx < p.len / 2; lx += 10.5) B(lx, trussY - 1.15, trussZ - 0.7, 0.9, 0.5, 0.5, lamp);   // (its red lamps)
    for (let lx = -p.len / 2 + 7; lx < p.len / 2; lx += 21) {   // (its floodlights, aimed at the track)
      B(lx, trussY + 1.25, trussZ - 0.7, 1.8, 0.6, 0.9, flood);
      const [x, y, z] = W(lx, trussY + 1.2, trussZ - 0.7), q = tr.nearest(x, z), aim = tr.sample(q.s, 0, f); lights.push({ x, y, z, tx: aim.x, tz: aim.z });
    }
    // the hospitality suites: two glazed storeys at the back of the top, under the roof
    const pz0 = mBack - 9.5, pzc = mBack - 4.5;
    B(0, mTop + 0.25, pzc, p.len, 0.5, 10, white);
    for (const [y0, y1] of [[mTop + 0.5, mTop + 4.0], [mTop + 4.5, mTop + 8.0]]) {
      const g = new THREE.PlaneGeometry(p.len, y1 - y0); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 30);
      const [x, y, z] = W(0, (y0 + y1) / 2, pz0 + 0.4); g.rotateY(ang); g.translate(x, y, z); put(suites, g);
      const gg = new THREE.PlaneGeometry(p.len, y1 - y0); const [x2, y2, z2] = W(0, (y0 + y1) / 2, pz0); gg.rotateY(ang); gg.translate(x2, y2, z2); put(glass, gg);
    }
    B(0, mTop + 4.25, pzc, p.len, 0.5, 10, white); B(0, mTop + 4.25, pz0 - 0.05, p.len, 0.25, 0.1, ledPink);
    // the roof: dark red on top, white beneath, on a white edge beam, its back on columns
    const e0 = -p.len / 2 - 0.3, e1 = p.len / 2 + 0.3, rb = mBack + 1;
    quad(W(e0, RF.yF + 0.25, RF.front), W(e1, RF.yF + 0.25, RF.front), W(e1, RF.yB + 0.25, rb), W(e0, RF.yB + 0.25, rb), maroon, p.len / 6);
    quad(W(e0, RF.yF, RF.front), W(e1, RF.yF, RF.front), W(e1, RF.yB, rb), W(e0, RF.yB, rb), white);
    B(0, RF.yF - 0.3, RF.front, p.len + 0.6, 1.0, 0.9, white);                       // the edge beam
    B(0, RF.yF - 0.85, RF.front - 0.46, p.len + 0.6, 0.14, 0.06, ledPink);           // (a pink line under it)
    for (let lx = -p.len / 2 + 2; lx <= p.len / 2 - 2; lx += Math.max(10, (p.len - 4) / 3)) B(lx, RF.yB / 2, rb - 0.4, 0.6, RF.yB, 0.6, white);   // back columns
    B(0, mTop * 0.5, mBack + 0.35, p.len, mTop, 0.4, dark);   // (its back, dark: the lit faces read)
    // light from its front: the roof's edge beam and the catch-fence line (lamps, no posts in the way)
    for (let lx = -p.len / 2 + 6; lx < p.len / 2; lx += 14) {
      { const [x, y, z] = W(lx, RF.yF - 0.9, RF.front - 0.3), q = tr.nearest(x, z), aim = tr.sample(q.s, 0, f); lights.push({ x, y, z, tx: aim.x, tz: aim.z }); B(lx, RF.yF - 0.95, RF.front - 0.2, 1.4, 0.35, 0.6, flood); }
      { const [x, , z] = W(lx, 0, -1.2), q = tr.nearest(x, z), aim = tr.sample(q.s, 2, f); lights.push({ x, y: 12.5, z, tx: aim.x, tz: aim.z }); }
    }
    // the end walls: the whole profile of the stand under its roof, teal Heineken Silver, reading the right way round
    // from outside either end
    if (k === 0 || k === main.length - 1) for (const e of k === 0 ? [-1] : [1]) {
      const sh = new THREE.Shape(); sh.moveTo(-0.5, 0); sh.lineTo(rb, 0); sh.lineTo(rb, RF.yB + 0.3); sh.lineTo(RF.front, RF.yF + 0.3); sh.lineTo(-0.5, STAND.base + 2); sh.lineTo(-0.5, 0);
      const g = new THREE.ShapeGeometry(sh), P2 = g.attributes.position, uv = g.attributes.uv, pos = [];
      for (let j = 0; j < P2.count; j++) { const lz = P2.getX(j), y = P2.getY(j); uv.setXY(j, e > 0 ? 1 - lz / rb : lz / rb, y / (RF.yB + 0.3)); const [x, z] = p.world(e * (p.len / 2 + 0.7), lz); pos.push(x, y, z); }
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); put(silverEnd, g);
      if (e > 0) {   // the white scaffold at the Turn 1 end: a lattice frame the height of the stand, in front of its end
        const sx0 = p.len / 2 + 1.2, sx1 = p.len / 2 + 7.2, sz0 = -0.5, sz1 = 9, hh = mTop * 0.92;
        for (const [ax, az] of [[sx0, sz0], [sx1, sz0], [sx1, sz1], [sx0, sz1]]) B(ax, hh / 2, az, 0.35, hh, 0.35, white);
        const face = (a, b) => { const [x0, , z0] = W(a[0], 0, a[1]), [x1, , z1] = W(b[0], 0, b[1]), len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.PlaneGeometry(len, hh); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * len / 7, uv.getY(j) * hh / 1.8 * 0.25); g.rotateY(Math.atan2(-(z1 - z0), x1 - x0)); g.translate((x0 + x1) / 2, hh / 2, (z0 + z1) / 2); put(trussTall, g); };
        face([sx0, sz0], [sx1, sz0]); face([sx1, sz0], [sx1, sz1]); face([sx1, sz1], [sx0, sz1]); face([sx0, sz1], [sx0, sz0]);
      }
    }
  });
  // ---- the Turns 2-4 stand's own (the race's render): navy fascia with the Red Bull boards along its front, a blue light
  //      line over it, lit aisles down the rake, a row of white cabanas along the top under floodlights, navy Red Bull
  //      end walls, the race's banner on its back
  const wTop = STAND.base + WRAP.tiers * WRAP.tierH, wBack = 0.8 + WRAP.tiers * WRAP.tierD;
  const dressRB = (p, k, all) => {
    const W = (lx, y, lz) => { const [x, z] = p.world(lx, lz); return [x, y, z]; };
    const n0 = [-p.ex[1], p.ex[0]], ang = Math.atan2(-p.ex[1], p.ex[0]), face = ang + (n0[0] * p.ez[0] + n0[1] * p.ez[1] > 0 ? Math.PI : 0);   // (a plane facing the track)
    const plane = (lx, y, lz, w, h, mat, rep = 1, rot = face) => { const g = new THREE.PlaneGeometry(w, h); if (rep !== 1) { const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * rep); } g.rotateY(rot); const [x, yy, z] = W(lx, y, lz); g.translate(x, yy, z); put(mat, g); };
    plane(0, (STAND.base + 0.1) / 2, -0.3, p.len, STAND.base + 0.1, rbBoard, p.len / 8);
    { const [x, z] = p.world(0, -0.32); put(ledBlue, boxAt(x, STAND.base + 0.16, z, p.ex, p.len, 0.14, 0.1)); }
    // (the aisles: lit stairs from the front row to the top, every ~8 m and at each end)
    const nA = Math.max(1, Math.round(p.len / 8));
    for (let a = 0; a <= nA; a++) { const lx = -p.len / 2 + 0.5 + (p.len - 1) * a / nA; quad(W(lx - 0.55, STAND.base + 0.18, 0.8), W(lx + 0.55, STAND.base + 0.18, 0.8), W(lx + 0.55, wTop + 0.18, wBack - 0.4), W(lx - 0.55, wTop + 0.18, wBack - 0.4), aisleLit); }
    // (the top: a deck along the back, the white cabanas on it, lit inside, peaked roofs; floodlights over them)
    { const [x, z] = p.world(0, wBack - 1.6); put(white, boxAt(x, wTop + 0.2, z, p.ex, p.len, 0.4, 4.2)); }
    for (let lx = -p.len / 2 + 3; lx <= p.len / 2 - 3; lx += 6.5) {
      const [x, z] = p.world(lx, wBack - 1.8); put(tent, boxAt(x, wTop + 1.9, z, p.ex, 5, 3, 3.2));
      const r = new THREE.ConeGeometry(3.6, 1.6, 4); r.rotateY(Math.PI / 4 + ang); r.translate(x, wTop + 4.2, z); put(tent, r);
      plane(lx, wTop + 1.7, wBack - 3.45, 4.4, 2.4, suites, 0.25);
    }
    for (let lx = -p.len / 2 + 5; lx < p.len / 2; lx += 12) { const [x, y, z] = W(lx, wTop + 5.4, wBack - 1.0); put(flood, boxAt(x, y, z, p.ex, 1.4, 0.35, 0.6)); const q = tr.nearest(x, z), aim = tr.sample(q.s, 0, f); lights.push({ x, y, z, tx: aim.x, tz: aim.z }); }
    // (its back, dark under the banner)
    const g = new THREE.PlaneGeometry(p.len, wTop + 0.4); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * p.len / 60);
    { const [bx, bz] = p.world(0, wBack + 0.4); g.rotateY(face + Math.PI); g.translate(bx, (wTop + 0.4) / 2, bz); put(banner, g); }
    // (its two ends: the scaffold the rake stands on, open, grey - with the navy Red Bull panel at the foot of each end, as
    //  on the render)
    for (const e of [k === 0 ? -1 : 0, k === all.length - 1 ? 1 : 0]) {
      if (!e) continue;
      const ex = e * (p.len / 2 + 0.3);
      for (const [lz, hh] of [[0.8, STAND.base + 0.4], [wBack * 0.5, (STAND.base + wTop) / 2], [wBack - 0.3, wTop]]) { const [x, z] = p.world(ex, lz); put(greyBox, boxAt(x, hh / 2, z, p.ex, 0.3, hh, 0.3)); }
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(wBack, 0); sh.lineTo(wBack, wTop); sh.lineTo(0.8, STAND.base); sh.lineTo(0, STAND.base); sh.lineTo(0, 0);
      const g2 = new THREE.ShapeGeometry(sh), P2 = g2.attributes.position, uv2 = g2.attributes.uv, pos2 = [];
      for (let j = 0; j < P2.count; j++) { const lz = P2.getX(j), y = P2.getY(j); uv2.setXY(j, lz / 6, y / 1.6); const [x, z] = p.world(ex, lz); pos2.push(x, y, z); }
      g2.setAttribute('position', new THREE.Float32BufferAttribute(pos2, 3)); g2.computeVertexNormals(); put(scaffoldMat, g2);
      const g3 = new THREE.PlaneGeometry(9, 5.5); g3.rotateY(Math.atan2(-p.ez[1], p.ez[0]) + (e > 0 ? Math.PI : 0)); { const [x, z] = p.world(ex + e * 0.05, 5.4); g3.translate(x, 2.75 + 0.2, z); } put(rbEnd, g3);
    }
  };
  wrap.forEach(dressRB);
  const beams = [];

  // =============================================================================================================
  // Turns 1-2: the U as it is painted - plain red and white kerbs round it, blue and white chevrons inside it, and on
  // the escape beyond it the Heineken band laid straight across the run-off along the bottom of the U, LAS VEGAS and
  // the chevrons further out
  // =============================================================================================================
  const sub = (sA, sB) => { const ia = tr.idxAtS(sA), n = Math.round((sB - sA) / tr.ds), ids = []; for (let k = 0; k <= n; k++) ids.push((ia + k) % tr.n); const T = { px: [], pz: [], nx: [], nz: [], s: [] }; for (const i of ids) { T.px.push(tr.px[i]); T.pz.push(tr.pz[i]); T.nx.push(tr.nx[i]); T.nz.push(tr.nz[i]); T.s.push(T.s.length * tr.ds); } return { T, ids }; };
  {
    const { T, ids } = sub(c1 - 75, c2 + 45), kw = tr.kerbWidth, n = ids.length - 1;
    put(kerbRW, strip(T, 0, n, (k) => [tr.edgeAt(ids[k], 1) - 0.02, 0.075], (k) => [tr.edgeAt(ids[k], 1) + kw, 0.035], 3));
    put(kerbRW, strip(T, 0, n, (k) => [-tr.edgeAt(ids[k], -1) - kw, 0.035], (k) => [-tr.edgeAt(ids[k], -1) + 0.02, 0.075], 3));
    // (inside the U, beyond the kerb: the blue chevrons, as far as the wall allows)
    const ci = (k) => tr.edgeAt(ids[k], 1) + kw + 0.1, co = (k) => Math.max(ci(k) + 0.2, Math.min(ci(k) + 2.6, tr.wallAt(ids[k], 1) - 0.4));
    put(chevBlue, strip(T, 8, n - 8, (k) => [ci(k), 0.02], (k) => [co(k), 0.02], 4));
    // (the inside wall round the hairpin: the green WHEN YOU DRIVE NEVER DRINK boards along it, and over it the white
    //  lighting truss on its posts, its lamps aimed at the corner)
    put(neverDrink, strip(T, 0, n, (k) => [tr.wallAt(ids[k], 1) + 0.32, 0.15], (k) => [tr.wallAt(ids[k], 1) + 0.32, 1.25], 9));
    const tw = (k) => tr.wallAt(ids[k], 1) + 1.4, TY = 6.8, k0 = Math.round(20 / tr.ds), k1 = n - Math.round(30 / tr.ds);
    if (k1 > k0) {
      for (const dz of [-0.45, 0.45]) put(trussTall, strip(T, k0, k1, (k) => [tw(k) + dz, TY - 0.9], (k) => [tw(k) + dz, TY + 0.9], 7));
      put(trussTall, strip(T, k0, k1, (k) => [tw(k) - 0.45, TY + 0.9], (k) => [tw(k) + 0.45, TY + 0.9], 7));
      for (let k = k0; k <= k1; k += Math.round(22 / tr.ds)) {
        const i = ids[k], p = tr.sample(tr.s[i], tw(k), {});
        put(white, boxAt(p.x, TY / 2, p.z, [tr.tx[i], tr.tz[i]], 0.5, TY, 0.5));
        const q = tr.sample(tr.s[i], tw(k) - 1.0, {}), aim = tr.sample(tr.s[i], -4, {});
        put(flood, boxAt(q.x, TY - 1.1, q.z, [tr.tx[i], tr.tz[i]], 1.6, 0.4, 0.7)); lights.push({ x: q.x, y: TY - 1.1, z: q.z, tx: aim.x, tz: aim.z });
      }
    }
  }
  // Turn 1's run-off (Track.escapes: the straight carried on past the hairpin to a wall across its end): the Heineken
  // band straight across it past the hairpin's kerb, LAS VEGAS and the chevrons beyond, its end wall carrying lamps
  const EB = (tr.escapeBoxes || []).find((e) => e.turn === 1);
  if (EB) {
    const UW = (u, w, y) => [EB.o[0] + EB.along[0] * u + EB.left[0] * w, y, EB.o[1] + EB.along[1] * u + EB.left[1] * w];
    const kw = tr.kerbWidth, sd = -1;
    // (the run-off's samples: round the hairpin, wherever the barrier on the outside stands well back from the kerb)
    const { T, ids } = sub(c1 - 140, c2 + 200), wide = (k) => tr.wallAt(ids[k], sd) - tr.edgeAt(ids[k], sd) - kw > 9;
    let ka = ids.findIndex((_, k) => wide(k)), kb = ids.length - 1; while (kb > ka && !wide(kb)) kb--;
    if (ka >= 0 && kb > ka + 4) {
      // the asphalt itself, out to the walls, lit like the track (swept along the normals the walls were pushed out on)
      put(runoffAsph, strip(T, Math.max(0, ka - 4), Math.min(ids.length - 1, kb + 4), (k) => [-(tr.edgeAt(ids[k], sd) + kw - 0.05), 0.01], (k) => [-(tr.wallAt(ids[k], sd) - 0.15), 0.01]));
      // the Heineken / -0.0 band right behind the kerb, all the way round (its lettering upright from outside the corner)
      put(bandMat, strip(T, ka, kb, (k) => [-(tr.edgeAt(ids[k], sd) + kw + 7.0), 0.03], (k) => [-(tr.edgeAt(ids[k], sd) + kw + 0.4), 0.03], 24));
    }
    // (a flat decal on the run-off: x along +w (left to right seen from the run-off's end), its top toward the corner)
    const decal = (u0, u1, w0, w1, map, transparent) => {
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...UW(u0, w0, 0.04), ...UW(u0, w1, 0.04), ...UW(u1, w1, 0.04), ...UW(u0, w0, 0.04), ...UW(u1, w1, 0.04), ...UW(u1, w0, 0.04)], 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0], 2)); g.computeVertexNormals();
      group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map, transparent, roughness: 0.7, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.35, depthWrite: !transparent })));
    };
    const ul = EB.uOut + 9.5, uh = ul + Math.min(24, (EB.uEnd - ul) - 4), wa = EB.wR + 3, wb = Math.min(EB.wExit(ul), EB.wExit(uh)) - 3;   // (beyond the band, wall to wall less a few metres, inside the slant)
    decal(ul, uh, wa, wb, lvgpRunoffTexture(), true);
    // the walls round it: white lattice light towers on the catch-fence line, along its end and the exit side, their
    // lamps aimed back over the run-off at the corner
    const tower = (u, w, aimU, aimW) => {
      const [x, , z] = UW(u, w, 0), H = 13, a = [EB.along[0], EB.along[1]];
      for (const [ox, oz] of [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]]) { const [px, , pz] = UW(u + ox, w + oz, 0); put(white, boxAt(px, H / 2, pz, a, 0.14, H, 0.14)); }
      for (const [ou, ow, rot] of [[0, -0.6, 0], [0, 0.6, 0], [-0.6, 0, 1], [0.6, 0, 1]]) {
        const g = new THREE.PlaneGeometry(1.2, H), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getY(j) * H / 5, uv.getX(j));
        const [px, , pz] = UW(u + ou, w + ow, 0); g.rotateY(Math.atan2(-a[1], a[0]) + (rot ? Math.PI / 2 : 0)); g.translate(px, H / 2, pz); put(trussTall, g);
      }
      const [tx, , tz] = UW(aimU, aimW, 0); put(flood, boxAt(x, H + 0.4, z, a, 2.2, 0.6, 1.0)); lights.push({ x, y: H + 0.4, z, tx, tz });
    };
    // (and the barrier itself along the end and the exit side: concrete under the Heineken / 0.0 boards - the track's own
    //  wall line, drawn here as the race dresses it; the catch fence over it is the track's: TrackBuilder streetFence)
    const run = (a, b) => {   // (a, b: [u, w] ends of a straight run of barrier)
      const [x0, , z0] = UW(a[0], a[1], 0), [x1, , z1] = UW(b[0], b[1], 0), len = Math.hypot(x1 - x0, z1 - z0), ex = [(x1 - x0) / len, (z1 - z0) / len], ang = Math.atan2(-ex[1], ex[0]);
      const panel = (y0, y1, mat, rep, off = 0) => { const g = new THREE.PlaneGeometry(len, y1 - y0), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * rep); g.rotateY(ang); g.translate((x0 + x1) / 2 + ex[1] * off, (y0 + y1) / 2, (z0 + z1) / 2 - ex[0] * off); put(mat, g); };
      put(greyBox, boxAt((x0 + x1) / 2, 0.6, (z0 + z1) / 2, ex, len, 1.2, 0.6));
      panel(0.1, 1.15, bandMat, len / 24, 0.32); panel(0.1, 1.15, bandMat, len / 24, -0.32);
    };
    run([EB.uEnd + 0.4, EB.wR], [EB.uEnd + 0.4, EB.wEnd + 0.4]);
    run([EB.exitA[0], EB.exitA[1] + 0.4], [EB.uEnd + 0.4, EB.wEnd + 0.4]);   // (the exit side: the return leg's wall carried on at its slant)
    // (the Heineken / 0.0 boards along the top of the catch fence on the outside of the braking zone, facing the track)
    for (const ds of [-150, -95]) {
      const s0 = c1 + ds, i = tr.idxAtS(s0), d = -(tr.wallAt(i, -1) + 0.5), a = tr.sample(s0 - 5, d, {}), b = tr.sample(s0 + 5, d, {}), len = Math.hypot(b.x - a.x, b.z - a.z), ex = [(b.x - a.x) / len, (b.z - a.z) / len];
      const g = new THREE.PlaneGeometry(len, 1.8), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * len / 24); g.rotateY(Math.atan2(-ex[1], ex[0])); g.translate((a.x + b.x) / 2, 5.6, (a.z + b.z) / 2); put(bandMat, g);
      for (const p of [a, b]) put(white, boxAt(p.x, 3.3, p.z, ex, 0.2, 6.6, 0.2));
    }
    for (let w = EB.wR + 6; w < EB.wEnd - 2; w += 20) tower(EB.uEnd + 1.2, w, EB.uOut, w);
    for (let u = EB.uEnd - 4; u > EB.exitA[0]; u -= 22) tower(u, EB.wExit(u) + 1.2, u - 10, (EB.wR + EB.wExit(u)) / 2);
    console.info(`[vegas] Turn 1 run-off: ${(EB.uEnd - EB.uOut).toFixed(0)} m past the kerb, ${(EB.wL - EB.wR).toFixed(0)} m across at the kerb, ${(EB.wEnd - EB.wR).toFixed(0)} m at its end wall (the exit side slanting in at ${(Math.atan(-EB.slope) * 180 / Math.PI).toFixed(0)} deg)`);
  }
  // (even light over the whole section: lamps along both sides at the catch-fence line, every 16 m, the start/finish
  //  straight to Turn 5 - the straight down to Turn 5 lit evenly grey, as the onboards show it)
  for (let s0 = cornerS(17) - L + 20; s0 <= cornerS(5) + 10; s0 += s0 > cornerS(4) + 40 ? 32 : 16) for (const sd of [1, -1]) {
    if (pit && sd === pit.sideSign && s0 < c1 - 40) continue;   // (the pit side of the straight: the plaza's roof lights it)
    const i = tr.idxAtS(s0), p = tr.sample(s0, sd * (tr.wallAt(i, sd) + 0.5), {}), aim = tr.sample(s0, 0, f); lights.push({ x: p.x, y: 12, z: p.z, tx: aim.x, tz: aim.z });
  }

  // =============================================================================================================
  // around it: the fan zone behind the main grandstand (purple and pink light, marquees, screens), laid in its stand's
  // own frame
  // =============================================================================================================
  {
    let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const ok = (x, z) => corridorSigned(tr, pit, x, z, 4) >= 0 && !near.some((r) => inRing(x, z, r)) && !stands.some((p) => { const dx = x - p.x, dz = z - p.z, lx = dx * p.ex[0] + dz * p.ex[1], lz = dx * p.ez[0] + dz * p.ez[1]; return Math.abs(lx) < p.len / 2 + 3 && lz > -3 && lz < (p.depth || 20) + 4; });
    for (const p of main) for (let lx = -p.len / 2; lx < p.len / 2; lx += 22) for (let lz = mBack + 10; lz < mBack + 110; lz += 24) {
      const [x, z] = p.world(lx + (rnd() - 0.5) * 10, lz + rnd() * 8); if (!ok(x, z) || rnd() < 0.45) continue;
      const r = 7 + rnd() * 9, g = new THREE.PlaneGeometry(r * 2, r * 2); g.rotateX(-Math.PI / 2); g.translate(x, 0.05 + rnd() * 0.02, z); put(rnd() < 0.6 ? glowPurple : glowPink, g);
      if (rnd() < 0.45) { const tw = 8 + rnd() * 8; put(tentLit, boxAt(x, 1.5, z, p.ex, tw, 3, tw * 0.8)); const roof = new THREE.ConeGeometry(tw * 0.62, 2.6, 4); roof.rotateY(Math.PI / 4 + Math.atan2(-p.ex[1], p.ex[0])); roof.translate(x, 4.3, z); put(tentLit, roof); }
      else if (rnd() < 0.3) { put(ledPink, boxAt(x, 6, z, p.ex, 7, 4, 0.3)); put(dark, boxAt(x, 2, z, p.ex, 0.4, 4, 0.4)); }   // (a screen)
    }
  }
  // =============================================================================================================
  // the outside of Turns 3-4 (the onboard footage: from the return leg, past Turn 3 and out of Turn 4; the race's render
  // of Turn 3): along the run west out of Turn 4, behind its barrier, the painted strip - the red F1, FORMULA 1 * HEINEKEN
  // SILVER, LAS VEGAS GRAND PRIX - then palms, then the long hospitality building (four floors of white slabs and glass
  // balconies over a lit ground floor, a red F1 sign at its west end), and back toward Turn 3 the lower building with blue
  // light along its edges. Laid in the frame of that run: u along it from 40 m past Turn 4's apex, v out from its barrier.
  // =============================================================================================================
  {
    const c4 = cornerS(4), so = 1;
    const blocked = (x, z) => corridorSigned(tr, pit, x, z, 1) < 0 || near.some((r) => inRing(x, z, r)) || stands.some((p) => { const dx = x - p.x, dz = z - p.z, lx = dx * p.ex[0] + dz * p.ex[1], lz = dx * p.ez[0] + dz * p.ez[1]; return Math.abs(lx) < p.len / 2 + 2 && lz > -2 && lz < (p.depth || 20) + 2; });
    // (a frame on the ground: origin o, u along t, v along nv - the side facing the track is -v)
    const frame = (o, t, nv) => {
      const F = (u, v) => [o[0] + t[0] * u + nv[0] * v, o[1] + t[1] * u + nv[1] * v], angT = Math.atan2(-t[1], t[0]);
      return {
        F, t,
        free: (u0, u1, v0, v1) => { for (let u = u0; u <= u1 + 0.01; u += 3) for (let v = v0; v <= v1 + 0.01; v += 3) if (blocked(...F(u, v))) return false; return true; },
        B: (u0, u1, v0, v1, y0, y1, mat) => { const [x, z] = F((u0 + u1) / 2, (v0 + v1) / 2); put(mat, boxAt(x, (y0 + y1) / 2, z, t, u1 - u0, y1 - y0, v1 - v0)); },
        face: (u0, u1, v, y0, y1, mat, rep = 1, toTrack = true) => {   // (a vertical plane along u at v, facing -v (the track) or away)
          const g = new THREE.PlaneGeometry(u1 - u0, y1 - y0); if (rep !== 1) { const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * rep); }
          const n0 = [-t[1], t[0]], away = n0[0] * nv[0] + n0[1] * nv[1] > 0; g.rotateY(angT + ((away === toTrack) ? Math.PI : 0)); const [x, z] = F((u0 + u1) / 2, v); g.translate(x, (y0 + y1) / 2, z); put(mat, g);
        },
      };
    };
    // the run west out of Turn 4: u along it from 40 m past Turn 4's apex, v out from its outside barrier
    const s0 = c4 + 40, i0 = tr.idxAtS(s0), o0 = tr.sample(s0, 0, {}), w0 = tr.wallAt(i0, so), nv0 = [tr.nx[i0] * so, tr.nz[i0] * so];
    const R4 = frame([o0.x + nv0[0] * w0, o0.z + nv0[1] * w0], [tr.tx[i0], tr.tz[i0]], nv0);
    // the return leg carried on past Turn 3 (the leg turns right through Turns 3-4, 116 degrees): u across it (to the
    // leg's left), v along it - the far side of the bend, facing back up the leg
    const sL = c3 - 30, iL = tr.idxAtS(sL), oL = tr.sample(sL, 0, {}), hd = [tr.tx[iL], tr.tz[iL]], lf = [tr.nx[iL], tr.nz[iL]];
    const RL = frame([oL.x + hd[0] * 95, oL.z + hd[1] * 95], [-lf[0], -lf[1]], hd);
    const { F, free, B, face, t } = R4;
    const made = [];
    // the painted strip, on dark asphalt just behind the barrier, along the run out of Turn 4
    {
      const { T, ids } = sub(c4 + 6, c4 + 150), n = ids.length - 1, wv = (k) => tr.wallAt(ids[k], so);
      if (free(-34, 104, 2, 17)) {
        put(roadAsph, strip(T, 0, n, (k) => [so * (wv(k) + 0.8), 0.012], (k) => [so * (wv(k) + 18), 0.012]));
        const g = strip(T, 0, n, (k) => [so * (wv(k) + 16.5), 0.03], (k) => [so * (wv(k) + 2.5), 0.03], n * tr.ds);
        group.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: f1StripTexture(), transparent: true, depthWrite: false, roughness: 0.7, emissive: 0xffffff, emissiveMap: null, emissiveIntensity: 0, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, side: THREE.DoubleSide })));
        { const m = group.children[group.children.length - 1].material; m.emissiveMap = m.map; m.emissiveIntensity = 0.4; }
        put(fence, strip(T, 0, n, (k) => [so * (wv(k) + 18.4), 0.1], (k) => [so * (wv(k) + 18.4), 1.3], 12));   // (its back fence: the Heineken boards)
        made.push('the painted strip');
      } else console.info('[vegas] Turn 4: no room for the painted strip');
    }
    // the buildings: white slabs and glass balconies over a lit ground floor, facing the track - the long one out beyond
    // the bend, square to the return leg (the onboard: straight ahead down the leg, then on the left into Turn 3), the
    // lower one along the run out of Turn 4 with the red F1 sign at its end and palms in front of it (on the left out of
    // Turn 4), and behind the first, further from the track, the dark one with blue light along its edges
    const block = (Fr, bu0, bu1, bv0, bv1, NF, name, extra) => {
      const { F, free, B, face, t } = Fr, H0 = 5, FL = 4.3, top = H0 + NF * FL;
      if (!free(bu0 - 2, bu1 + 2, bv0 - 3, bv1)) { console.info(`[vegas] Turns 3-4: no room for ${name}`); return null; }
      face(bu0, bu1, bv0 + 1.5, 0.2, H0 - 0.2, suites, (bu1 - bu0) / 30);
      for (let k = 0; k <= NF; k++) {
        const y = H0 + k * FL; B(bu0 - 1, bu1 + 1, bv0 - 2.2, bv1, y - 0.5, y, white);
        if (k < NF) {
          face(bu0, bu1, bv0 - 2.1, y, y + 1.15, glass);
          { const [x, z] = F((bu0 + bu1) / 2, bv0 - 2.15); put(ledWhite, boxAt(x, y + 1.15, z, t, bu1 - bu0, 0.08, 0.08)); }
          face(bu0, bu1, bv0 + 0.6, y, y + FL - 0.5, k % 2 ? suitesDim : suites, (bu1 - bu0) / 30);
        }
      }
      B(bu0 - 1, bu0, bv0, bv1, 0, top, white); B(bu1, bu1 + 1, bv0, bv1, 0, top, white); B(bu0, bu1, bv1 - 1, bv1, 0, top, white);
      B(bu0 + 6, bu0 + 6 + (bu1 - bu0) * 0.25, bv0 + 6, bv1 - 4, top, top + 3.2, roofDark);
      for (let u = bu0 + 6; u < bu1; u += 18) { const [x, z] = F(u, bv0 - 1.6); const q = tr.nearest(x, z), aim = tr.sample(q.s, 0, f); lights.push({ x, y: top + 0.6, z, tx: aim.x, tz: aim.z }); put(flood, boxAt(x, top + 0.6, z, t, 1.4, 0.35, 0.6)); }
      solids.push({ ring: [F(bu0 - 1, bv0 - 2.2), F(bu1 + 1, bv0 - 2.2), F(bu1 + 1, bv1), F(bu0 - 1, bv1)], h: top + 1 });
      extra?.(top); made.push(`${name} ${(bu1 - bu0).toFixed(0)} m, ${NF + 1} floors`); return top;
    };
    block(RL, -78, 2, 0, 22, 4, 'the hospitality building beyond the bend');
    block(R4, 4, 78, 26, 44, 3, 'the hospitality building out of Turn 4', (top) => {
      face(72, 76.5, 26 - 2.4, top - 12, top + 2, f1Sign);   // (the red F1 sign up its far end, facing the track)
      for (let u = 8; u <= 74; u += 13) { const [x, z] = F(u, 21.5); palm(x, z, 8 + ((u * 7) % 5)); }
    });
    { const { F, free, B, face } = RL, lu0 = -124, lu1 = -80, lv0 = 34, lv1 = 56, LH = 4.4, LN = 3;   // (behind it and to the leg's left)
      if (free(lu0, lu1, lv0, lv1)) {
        B(lu0, lu1, lv0, lv1, 0, LN * LH, dark);
        for (let k = 0; k < LN; k++) face(lu0 + 0.5, lu1 - 0.5, lv0 - 0.05, k * LH + 0.6, (k + 1) * LH - 0.4, suitesDim, (lu1 - lu0) / 30);
        for (let k = 1; k <= LN; k++) B(lu0 - 0.1, lu1 + 0.1, lv0 - 0.15, lv0, k * LH - 0.12, k * LH + 0.12, ledBlue);
        for (const u of [lu0, lu1]) B(u - 0.12, u + 0.12, lv0 - 0.15, lv0 + 0.1, 0, LN * LH, ledBlue);
        solids.push({ ring: [F(lu0, lv0), F(lu1, lv0), F(lu1, lv1), F(lu0, lv1)], h: LN * LH + 1 });
        made.push('the blue-lit building behind');
      } else console.info('[vegas] Turns 3-4: no room for the blue-lit building');
    }
    console.info(`[vegas] Turns 3-4, outside: ${made.join(', ')}`);
  }
  // =============================================================================================================
  // the trackside kit the onboard footage shows round Turns 2-5: the recovery crane truck and the yellow telehandler
  // behind the fence outside Turn 2 (the aerial from beyond Turn 1 has the yellow machine there too), a yellow boom lift
  // by the building beyond the bend, a TV camera tower on scaffolding where the stand begins, and the lattice gantry
  // across the track on the run out of Turn 4 with the race's banner hung from it
  // =============================================================================================================
  {
    const yellow = new THREE.MeshStandardMaterial({ color: 0xf2b705, roughness: 0.5, metalness: 0.2, emissive: 0x2a1e00 });
    const craneRed = new THREE.MeshStandardMaterial({ color: 0xc8161d, roughness: 0.5, metalness: 0.2, emissive: 0x240404 });
    const tyreM = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.9 });
    const yaw = (ex) => Math.atan2(-ex[1], ex[0]);
    const boom = (x, y, z, ex, L, w, tilt, mat) => { const g = new THREE.BoxGeometry(L, w, w); g.translate(L / 2, 0, 0); g.rotateZ(tilt); g.rotateY(yaw(ex)); g.translate(x, y, z); put(mat, g); };
    const wheels = (x, z, ex, len, wid, n) => { const nz = [-ex[1], ex[0]]; for (let a = 0; a < n; a++) for (const sd of [-1, 1]) { const u = -len / 2 + 0.8 + (len - 1.6) * a / Math.max(1, n - 1), g = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 10); g.rotateX(Math.PI / 2); g.rotateY(yaw(ex)); g.translate(x + ex[0] * u + nz[0] * sd * wid / 2, 0.5, z + ex[1] * u + nz[1] * sd * wid / 2); put(tyreM, g); } };
    const at = (s0, d, along = 0) => { const i = tr.idxAtS(s0), p = tr.sample(s0 + along, d, {}); return { x: p.x, z: p.z, ex: [tr.tx[i], tr.tz[i]] }; };
    const clearAt = (x, z, r) => { for (let a = 0; a < 8; a++) { const xx = x + Math.cos(a) * r, zz = z + Math.sin(a) * r; if (corridorSigned(tr, pit, xx, zz, 0.5) < 0 || near.some((q) => inRing(xx, zz, q))) return false; } return corridorSigned(tr, pit, x, z, 0.5) >= 0; };
    const kit = [];
    // the recovery crane truck: white cab, red crane on its bed, the boom raised; the telehandler beside it
    { const i = tr.idxAtS(c2 + 30), d = -(tr.wallAt(i, -1) + 7), q = at(c2 + 30, d);
      if (clearAt(q.x, q.z, 6)) {
        const ex = q.ex, f2x = (u) => [q.x + ex[0] * u, q.z + ex[1] * u];
        { const [x, z] = f2x(4.2); put(white, boxAt(x, 1.9, z, ex, 2.4, 2.8, 2.5)); }
        { const [x, z] = f2x(-1.2); put(craneRed, boxAt(x, 1.4, z, ex, 8, 1.2, 2.5)); put(craneRed, boxAt(x - ex[0] * 1.5, 2.6, z - ex[1] * 1.5, ex, 2.2, 1.4, 2.0)); boom(x - ex[0] * 1.5, 3.2, z - ex[1] * 1.5, [-ex[0], -ex[1]], 11, 0.55, 0.62, craneRed); }
        wheels(q.x - ex[0] * 0.5, q.z - ex[1] * 0.5, ex, 10, 2.3, 4);
        const t2 = at(c2 + 30, d - 6, -9); put(yellow, boxAt(t2.x, 1.5, t2.z, t2.ex, 5, 1.8, 2.3)); boom(t2.x, 2.4, t2.z, t2.ex, 9, 0.6, 0.7, yellow); wheels(t2.x, t2.z, t2.ex, 5, 2.4, 2);
        kit.push('the recovery truck and the telehandler outside Turn 2');
      }
    }
    // the TV camera tower: scaffolding to a platform with a rail, a camera on it, where the stand begins
    { const s0 = c2 + 86, i = tr.idxAtS(s0), q = at(s0, -(tr.wallAt(i, -1) + 3));
      if (clearAt(q.x, q.z, 2.2)) {
        const H = 7; for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { const nz = [-q.ex[1], q.ex[0]]; put(greyBox, boxAt(q.x + q.ex[0] * a * 1.3 + nz[0] * b * 1.3, H / 2, q.z + q.ex[1] * a * 1.3 + nz[1] * b * 1.3, q.ex, 0.12, H, 0.12)); }
        put(greyBox, boxAt(q.x, H, q.z, q.ex, 3, 0.2, 3)); put(dark, boxAt(q.x, H + 0.9, q.z, q.ex, 0.6, 0.6, 1.0));
        for (const [w2, h2] of [[3, 1.1], [3, 0.6]]) { const g = new THREE.BoxGeometry(w2, 0.05, 3); g.rotateY(yaw(q.ex)); g.translate(q.x, H + h2, q.z); put(greyBox, g); }
        kit.push('the camera tower');
      }
    }
    // the yellow boom lift in front of the building beyond the bend
    { const sL = c3 - 30, iL = tr.idxAtS(sL), oL = tr.sample(sL, 0, {}), hd = [tr.tx[iL], tr.tz[iL]], lf = [tr.nx[iL], tr.nz[iL]];
      const x = oL.x + hd[0] * 88 + lf[0] * 30, z = oL.z + hd[1] * 88 + lf[1] * 30;
      if (clearAt(x, z, 3)) { put(yellow, boxAt(x, 1.0, z, hd, 4, 1.4, 2.2)); boom(x, 1.8, z, [-hd[0], -hd[1]], 13, 0.45, 0.75, yellow); const bx = x - hd[0] * 13 * Math.cos(0.75), bz = z - hd[1] * 13 * Math.cos(0.75); put(yellow, boxAt(bx, 1.8 + 13 * Math.sin(0.75) + 0.6, bz, hd, 1.6, 1.1, 1.0)); wheels(x, z, hd, 4, 2.2, 2); kit.push('the boom lift'); }
    }
    // the gantry across the run out of Turn 4: lattice towers outside the walls, a lattice span over the track, the
    // race's banner hung from it on both faces, lamps under it
    { const s0 = cornerS(4) + 190, i = tr.idxAtS(s0), wl = tr.wallAt(i, 1) + 2.2, wr = tr.wallAt(i, -1) + 2.2, Y0 = 7.2, Y1 = 9.4;
      const A = tr.sample(s0, wl, {}), Bq = tr.sample(s0, -wr, {}), span = Math.hypot(A.x - Bq.x, A.z - Bq.z), ax = [(A.x - Bq.x) / span, (A.z - Bq.z) / span];
      if (clearAt(A.x, A.z, 1.5) && clearAt(Bq.x, Bq.z, 1.5)) {
        const tow = (P) => { for (const [a, b] of [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]]) put(white, boxAt(P.x + ax[0] * a - ax[1] * b, Y1 / 2, P.z + ax[1] * a + ax[0] * b, ax, 0.18, Y1, 0.18)); };
        tow(A); tow(Bq);
        const mx = (A.x + Bq.x) / 2, mz = (A.z + Bq.z) / 2, nn = [-ax[1], ax[0]], ang = Math.atan2(-ax[1], ax[0]);
        for (const sd of [-1, 1]) { const g = new THREE.PlaneGeometry(span, Y1 - Y0); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * span / 7); g.rotateY(ang); g.translate(mx + nn[0] * sd * 0.8, (Y0 + Y1) / 2, mz + nn[1] * sd * 0.8); put(trussTall, g); }
        { const g = new THREE.PlaneGeometry(span, 1.6); g.rotateX(-Math.PI / 2); const uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, uv.getX(j) * span / 7); g.rotateY(ang); g.translate(mx, Y1, mz); put(trussTall, g); }
        const bw = Math.min(span - 4, 22);
        for (const sd of [-1, 1]) { const g = new THREE.PlaneGeometry(bw, 2.2); g.rotateY(ang + (sd > 0 ? 0 : Math.PI)); g.translate(mx + nn[0] * sd * 0.85, Y0 - 1.0, mz + nn[1] * sd * 0.85); put(gantryBanner, g); }
        for (const u of [-0.3, 0, 0.3]) { const x = mx + ax[0] * u * span, z = mz + ax[1] * u * span; put(flood, boxAt(x, Y0 - 0.1, z, ax, 1.4, 0.3, 0.6)); const q2 = tr.nearest(x, z), aim = tr.sample(q2.s - 20, 0, f); lights.push({ x, y: Y0, z, tx: aim.x, tz: aim.z }); }
        kit.push(`the gantry ${(s0 - cornerS(4)).toFixed(0)} m past Turn 4`);
      }
    }
    console.info(`[vegas] trackside kit: ${kit.join(', ')}`);
  }
  // =============================================================================================================
  // the straight from Turn 4 to Turn 5 (Koval Lane; the 2024 onboards): the public road's double yellow down its middle;
  // its left side the bare dark wall with a dark scrim over the fence; both sides lined with dark buildings - a few
  // rooms lit, a balcony here and there catching the light, the rest left to the dark; toward its end, on the Sphere's
  // side, the merch stalls behind the fence and the big screen showing the race; and across it the dark footbridge with
  // the purple-lit sign along its face and a row of lamps under it, the Sphere beyond. The screen, the sign and the
  // lamps take no fog: lit things carry down a straight at night, there from the moment the straight opens out.
  // =============================================================================================================
  {
    const c4 = cornerS(4), c5 = cornerS(5); let seed = 21; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const okAt = (x, z, m = 1) => corridorSigned(tr, pit, x, z, m) >= 0 && !near.some((r) => inRing(x, z, r)) && !solids.some((o) => inRing(x, z, o.ring));
    const frameAt = (sm, side) => { const i = tr.idxAtS(sm), w = tr.wallAt(i, side), t = [tr.tx[i], tr.tz[i]], nv = [tr.nx[i] * side, tr.nz[i] * side], o = tr.sample(sm, 0, {}); return { t, nv, P: (u, v) => [o.x + t[0] * u + nv[0] * (w + v), o.z + t[1] * u + nv[1] * (w + v)] }; };
    const facing = (dir) => Math.atan2(dir[0], dir[1]);   // (rotateY for a plane whose face looks along dir)
    const quadV = (P0, P1, y0, y1, dir, mat, uvs = [1, 1], off = [0, 0]) => { const L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), g = new THREE.PlaneGeometry(L, y1 - y0), uv = g.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) * uvs[0] + off[0], uv.getY(j) * uvs[1] + off[1]); g.rotateY(facing(dir)); g.translate((P0[0] + P1[0]) / 2, (y0 + y1) / 2, (P0[1] + P1[1]) / 2); put(mat, g); };
    const made = [];
    // the double yellow
    { const { T, ids } = sub(c4 + 70, c5 - 70), n = ids.length - 1;
      for (const [a, b] of [[0.08, 0.2], [-0.2, -0.08]]) put(dYellow, strip(T, 0, n, () => [a, 0.013], () => [b, 0.013])); made.push(`the double yellow ${((n * tr.ds)).toFixed(0)} m`); }
    // the scrim over the left fence
    { const { T, ids } = sub(c4 + 40, c5 - 90), n = ids.length - 1; put(scrim, strip(T, 0, n, (k) => [tr.wallAt(ids[k], 1) + 0.4, 1.25], (k) => [tr.wallAt(ids[k], 1) + 0.4, 4.55])); }
    // the dark buildings either side
    let nB = 0;
    // (the left: one tall dark mass close behind the fence - the backs of the resorts' garages, as the onboards show it,
    //  hardly a light in it; the right, low and broken up, more of it lit - the Sphere over it all the way down)
    for (const side of [1, -1]) for (let s0 = c4 + 90; s0 < c5 - 160;) {
      const L1 = side > 0, len = L1 ? 34 + rnd() * 30 : 14 + rnd() * 22, dep = 12 + rnd() * 10, h = L1 ? 11 + rnd() * 5 : 4.5 + rnd() * 5, back = L1 ? 3.2 + rnd() * 1.2 : 6 + rnd() * 8, F = frameAt(s0 + len / 2, side);
      let ok = true; for (let u = -len / 2; u <= len / 2 + 0.01 && ok; u += 3) for (let v = back - 1; v <= back + dep + 0.01 && ok; v += 3) if (!okAt(...F.P(u, v))) ok = false;
      if (!ok) { s0 += 6; continue; }
      const [cx, cz] = F.P(0, back + dep / 2), toTrack = [-F.nv[0], -F.nv[1]];
      put(bodyDark, boxAt(cx, h / 2, cz, F.t, len, h, dep));
      quadV(F.P(-len / 2, back - 0.05), F.P(len / 2, back - 0.05), 0, h, toTrack, L1 ? facadeGarage : facadeDark, [len / 32, h / 28], [rnd(), rnd()]);
      if (!L1 && rnd() < 0.3) {   // (balconies: slabs out over the street, a lit glass rail on each)
        for (let y = 3.5; y < h - 1; y += 3.5) { const [bx, bz] = F.P(0, back - 0.7); put(greyBox, boxAt(bx, y, bz, F.t, len - 2, 0.16, 1.4)); quadV(F.P(-len / 2 + 1, back - 1.38), F.P(len / 2 - 1, back - 1.38), y + 0.08, y + 1.05, toTrack, glass); }
      }
      if (!L1 && rnd() < 0.35) quadV(F.P(-len / 2 + 2, back - 0.1), F.P(-len / 2 + 2 + Math.min(10, len - 4), back - 0.1), 0.3, 3.2, toTrack, suites, [0.4, 1]);   // (a lit ground floor)
      solids.push({ ring: [F.P(-len / 2, back), F.P(len / 2, back), F.P(len / 2, back + dep), F.P(-len / 2, back + dep)], h: h + 1 }); nB++;
      s0 += len + (L1 ? 0.2 : 4 + rnd() * 10);
    }
    made.push(`${nB} dark buildings`);
    // the merch stalls behind the right fence toward the end, white boxes with lit fronts and striped awnings
    let nS = 0;
    for (let s0 = c5 - 340; s0 < c5 - 205; s0 += 13) {
      const F = frameAt(s0, -1), [x, z] = F.P(0, 4.2);
      if (!okAt(x, z, 1.5) || !okAt(...F.P(0, 6))) continue;
      put(white, boxAt(x, 1.35, z, F.t, 3.4, 2.7, 3));
      quadV(F.P(-1.5, 2.66), F.P(1.5, 2.66), 0.7, 2.2, [-F.nv[0], -F.nv[1]], merchFront);
      { const [ax, az] = F.P(0, 2.4); put(nS % 2 ? awningPink : awningWhite, boxAt(ax, 2.85, az, F.t, 3.6, 0.12, 1.2)); }
      nS++;
    }
    made.push(`${nS} merch stalls`);
    // the big screen, on its truss, angled to the cars coming down the straight
    { const F = frameAt(c5 - 190, -1), [x, z] = F.P(0, 9);
      if (okAt(x, z, 2)) {
        const dir = [-F.t[0] * 0.8 - F.nv[0] * 0.6, -F.t[1] * 0.8 - F.nv[1] * 0.6], L = Math.hypot(...dir), d = [dir[0] / L, dir[1] / L], ax = [d[1], -d[0]];
        for (const e of [-6, 6]) put(white, boxAt(x + ax[0] * e, 4, z + ax[1] * e, ax, 0.5, 8, 0.5));
        put(dark, boxAt(x - d[0] * 0.4, 11, z - d[1] * 0.4, ax, 14.4, 8.4, 0.6));
        quadV([x + ax[0] * -7, z + ax[1] * -7], [x + ax[0] * 7, z + ax[1] * 7], 7, 15, d, screenMat);
        made.push('the big screen');
      }
    }
    // the footbridge across the straight near its end
    { const s0 = c5 - 150, i = tr.idxAtS(s0), wl = tr.wallAt(i, 1) + 4, wr = tr.wallAt(i, -1) + 4, A = tr.sample(s0, wl, {}), Bq = tr.sample(s0, -wr, {});
      const span = Math.hypot(A.x - Bq.x, A.z - Bq.z), ax = [(A.x - Bq.x) / span, (A.z - Bq.z) / span], t = [tr.tx[i], tr.tz[i]], Y0 = 6.8, Y1 = 10.6, D = 7;
      if (okAt(A.x, A.z, 0.5) && okAt(Bq.x, Bq.z, 0.5)) {
        const mx = (A.x + Bq.x) / 2, mz = (A.z + Bq.z) / 2;
        put(bridgeDark, boxAt(mx, (Y0 + Y1) / 2, mz, ax, span + 8, Y1 - Y0, D));
        for (const P of [A, Bq]) { const o = P === A ? 1 : -1; put(bridgeDark, boxAt(P.x + ax[0] * o * 4, Y1 / 2, P.z + ax[1] * o * 4, ax, 7, Y1, D + 2)); }   // (its stair towers)
        for (const sd of [-1, 1]) {
          const [fx, fz] = [mx + t[0] * sd * (D / 2 + 0.05), mz + t[1] * sd * (D / 2 + 0.05)];
          quadV([fx - ax[0] * span * 0.45, fz - ax[1] * span * 0.45], [fx + ax[0] * span * 0.45, fz + ax[1] * span * 0.45], Y1 - 2.4, Y1 - 0.6, [t[0] * sd, t[1] * sd], bridgeSign, [1, 1]);
          for (let u = -span / 2; u <= span / 2; u += 2.6) { const lx = mx + ax[0] * u + t[0] * sd * (D / 2 - 0.4), lz = mz + ax[1] * u + t[1] * sd * (D / 2 - 0.4); put(lampWhite, boxAt(lx, Y0 - 0.12, lz, ax, 0.9, 0.18, 0.5)); }
        }
        for (let u = -span / 3; u <= span / 3; u += span / 3) { const x = mx + ax[0] * u, z = mz + ax[1] * u, q = tr.sample(s0 - 30, 0, f); lights.push({ x, y: Y0 - 0.3, z, tx: q.x, tz: q.z }); }
        made.push(`the footbridge ${(c5 - s0).toFixed(0)} m before Turn 5`);
      }
    }
    console.info(`[vegas] Turn 4 to Turn 5: ${made.join(', ')}`);
  }
  // ---- one mesh per material (the static world: a handful of draw calls)
  for (const [mat, gs] of geos) {
    const clean = gs.map((g) => { const h = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(h.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') h.deleteAttribute(k); if (!h.attributes.uv) h.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(h.attributes.position.count * 2), 2)); if (!h.attributes.normal) h.computeVertexNormals(); return h; });
    const mesh = new THREE.Mesh(mergeGeometries(clean), mat); mesh.name = 'vp'; if (mat === glass) mesh.renderOrder = 3; if (mat === glowPurple || mat === glowPink) { mesh.renderOrder = 2; mesh.userData.glowZone = true; } group.add(mesh);
  }
  const leds = [ledPink, ledCyan, ledWhite, ledBlue];
  for (const m of [glowPurple, glowPink]) m.userData.timeSkip = true;
  const boxes = [new THREE.Box3().setFromObject(group)].filter((b) => !b.isEmpty());
  // (and the whole section, from Turn 17's exit to Turn 3, 120 m round: no auto-placed stand in it - only the real ones)
  { const b = new THREE.Box3(); for (let x = cornerS(17) - L - 60; x <= c3; x += 10) { tr.sample(x, 0, f); b.expandByPoint(new THREE.Vector3(f.x, 0, f.z)); } b.expandByVector(new THREE.Vector3(120, 0, 120)); b.max.y = 30; boxes.push(b); }
  // (the boxes the auto-placed stands must keep out of: all of this, and each stand of ours)
  for (const p of stands) { const r = [p.world(-p.len / 2, 0), p.world(p.len / 2, 0), p.world(p.len / 2, p.depth), p.world(-p.len / 2, p.depth)]; const b = new THREE.Box3(); for (const [x, z] of r) b.expandByPoint(new THREE.Vector3(x, 0, z)); b.max.y = 20; boxes.push(b); }
  console.info(`[vegas] paddock: plaza ${pit ? 'built' : 'no pit lane'}, main grandstand ${main.length} sections, the Turns 2-4 stand ${wrap.length} sections (${['PG2', 'PG3', 'PG4'].map((n) => `${n} ${wrap.filter((p) => p.name.endsWith(n)).reduce((a, p) => a + p.len, 0).toFixed(0)} m`).join(', ')}), ${lights.length} lamps`);
  return {
    group, stands, lights, boxes, solids,
    update(t) {
      const night = FLOOD.floodOn.value > 0.5; for (const m of leds) { m.uniforms.uTime.value = t; m.uniforms.uBoost.value = night ? 1.25 : 0.45; } red.emissiveIntensity = night ? 1.6 : 0.25;
    },
  };
}
