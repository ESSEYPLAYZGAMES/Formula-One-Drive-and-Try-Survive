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

// ---- grandstands, by their real places: on a side of the track at a corner (side +1 left / -1 right of the racing
//      direction), or from the survey (named outlines)
const STANDS = [
  { name: 'Main Grandstand', s: -40, side: -1, len: 300, tiers: 24 },              // the main straight, facing the pits
  { name: 'Turn 1 Grandstand', turn: 1, along: -70, side: -1, len: 170, tiers: 22 }, // up the hill, on the outside
  { name: 'Turn 1 Hill', turn: 2, along: -40, side: -1, len: 90, tiers: 12 },
  { name: 'Esses Bleachers', turn: 4, along: 0, side: -1, len: 110, tiers: 12 },
  { name: 'Turn 6 Bleachers', turn: 6, along: -30, side: 1, len: 80, tiers: 10 },
  { name: 'Turn 9 Grandstand', turn: 9, along: -20, side: -1, len: 90, tiers: 12 },
  { name: 'Turn 11 Bleachers', turn: 11, along: -90, side: -1, len: 80, tiers: 10 },
  { name: 'Turn 12 Grandstand', turn: 12, along: -110, side: -1, len: 150, tiers: 18 },
  { name: 'Turn 15 Grandstands', outline: 'Turn 15 Grandstands', len: 120, tiers: 18 },
  { name: 'Turn 19 Grandstand', turn: 19, along: 0, side: -1, len: 100, tiers: 14 },
];

const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const nonIdx = (g) => (g.index ? g.toNonIndexed() : g);
const vcolor = (g, hex) => { const c = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let k = 0; k < n; k++) { a[k * 3] = c.r; a[k * 3 + 1] = c.g; a[k * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
const keepPN = (g) => { for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(k)) g.deleteAttribute(k); return g; };

/**
 * The fans' atlas: ten people side by side (48 x 144 px each, the figure's 1.7 m from 16 px down to the bottom), drawn
 * as masks the shader colours per person: red = the shading, green = skin (face, neck, forearms, hands), blue = the top
 * of the head (hair, or a hat); everything else is clothes, coloured by height (the shirt above the waist, the trousers
 * below, the shoes at the bottom). 0 arms down, 1 hands on hips, 2 a fist in the air, 3 both arms up, 4 filming on a
 * phone, 5 long hair, 6 a cap, 7 a Stetson, 8 sitting cross-legged, 9 sitting with the knees up.
 */
function fanAtlas() {
  const W = 48, H = 144, c = document.createElement('canvas'); c.width = W * 10; c.height = H; const x = c.getContext('2d');
  const body = (s) => `rgb(${s},0,0)`, skin = (s) => `rgb(${s},255,0)`, head = (s) => `rgb(${s},0,255)`;
  const R = (f, a, b, w, h) => { x.fillStyle = f; x.fillRect(a, b, w, h); };
  const limb = (f, x0, y0, x1, y1, w) => { x.strokeStyle = f; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); };
  const disc = (f, cx, cy, r, a0 = 0, a1 = Math.PI * 2) => { x.fillStyle = f; x.beginPath(); x.arc(cx, cy, r, a0, a1); x.fill(); };
  for (let v = 0; v < 10; v++) {
    x.save(); x.translate(v * W, 0);
    const sit = v >= 8, dy = sit ? 46 : 0, cx = 24;
    // legs and shoes (standing), or folded in front (sitting)
    if (!sit) { R(body(205), 15, 80, 8, 58); R(body(185), 25, 80, 8, 58); R(body(60), 13, 137, 10, 7); R(body(60), 25, 137, 10, 7); }
    else if (v === 8) { R(body(200), 6, 124, 36, 12); R(body(170), 6, 132, 36, 6); }
    else { limb(body(200), 16, 128, 22, 112, 9); limb(body(185), 32, 128, 26, 112, 9); R(body(60), 12, 134, 10, 6); R(body(60), 27, 134, 10, 6); }
    // torso (a little lighter down its middle)
    x.fillStyle = body(190); x.beginPath(); x.moveTo(14, 36 + dy); x.lineTo(34, 36 + dy); x.lineTo(33, 81 + dy); x.lineTo(15, 81 + dy); x.closePath(); x.fill();
    R(body(225), 19, 38 + dy, 10, 42);
    // arms: a sleeve to the elbow, then the forearm and the hand
    const arm = (sx, ex, ey, hx, hy) => { limb(body(175), sx, 39 + dy, ex, ey, 6); limb(skin(200), ex, ey, hx, hy, 5); disc(skin(210), hx, hy, 3); };
    if (v === 1) { arm(13, 7, 56 + dy, 14, 74 + dy); arm(35, 41, 56 + dy, 34, 74 + dy); }
    else if (v === 2) { arm(13, 10, 58 + dy, 11, 77 + dy); arm(35, 40, 22, 40, 5); }
    else if (v === 3) { arm(13, 7, 22, 10, 4); arm(35, 41, 22, 38, 4); }
    else if (v === 4) { arm(13, 10, 58 + dy, 11, 77 + dy); arm(35, 39, 30, 33, 16); R(body(25), 30, 9, 7, 11); }
    else if (sit) { arm(13, 10, 62 + dy, 16, 76 + dy); arm(35, 38, 62 + dy, 32, 76 + dy); }
    else { arm(13, 10, 58 + dy, 11, 78 + dy); arm(35, 38, 58 + dy, 37, 78 + dy); }
    // neck and head: the face skin, the top of the head the hair or the hat
    R(skin(200), 21, 31 + dy, 6, 6);
    disc(skin(215), cx, 24 + dy, 8);
    if (v === 5) { R(head(200), 15, 20 + dy, 4, 26); R(head(200), 29, 20 + dy, 4, 26); disc(head(210), cx, 22 + dy, 8.6, Math.PI, Math.PI * 2); }
    else if (v === 6) { disc(head(215), cx, 22 + dy, 8.8, Math.PI, Math.PI * 2); R(head(190), 24, 20 + dy, 12, 3); }
    else if (v === 7) { x.fillStyle = head(205); x.beginPath(); x.ellipse(cx, 19 + dy, 15, 3, 0, 0, Math.PI * 2); x.fill(); R(head(220), 17, 9 + dy, 14, 10); }
    else disc(head(205), cx, 21 + dy, 8.4, Math.PI * 1.05, Math.PI * 1.95);
    x.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; return t;
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
  //      inside the loop of Turns 16-18: 76.5 m to the top of its veil, the deck at 70 m. The stage at its foot under the
  //      veil's run, the lawn bowl rising away from it, and beyond, the Grand Plaza toward the Turn 15 stands and its
  //      reflecting pool at the far end
  const amph = byName(/amphi/i), t15 = byName(/turn 15 grand/i);
  let towerAt = null;
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
    // the shaft: a white steel frame 9 m square - four corner columns, a landing every 3.5 m and the stairs zigzagging
    // up inside it - round the lift's glass core (by day pale glass, by night lit floor by floor in the rainbow)
    const bands = document.createElement('canvas'); bands.width = 64; bands.height = 512; const bx = bands.getContext('2d');
    for (let k = 0; k < 32; k++) { bx.fillStyle = `hsl(${(k * 360 / 11) % 360}, 90%, 58%)`; bx.fillRect(0, k * 16, 64, 13); bx.fillStyle = '#e8ecf0'; bx.fillRect(0, k * 16 + 13, 64, 3); }
    const bandTex = new THREE.CanvasTexture(bands); bandTex.colorSpace = THREE.SRGBColorSpace;
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xc9d6e0, roughness: 0.12, metalness: 0.55, emissive: 0xffffff, emissiveMap: bandTex, emissiveIntensity: 0, envMapIntensity: 1.3 });
    shaftMat.userData.towerGlow = true;
    const core = new THREE.Mesh(new THREE.BoxGeometry(4.2, 70, 4.2), shaftMat); core.position.y = 33; T.add(core);   // (down 2 m into the ground: no gap on a slope)
    const frame = [], box = (w, h, d, x, y, z, rz = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (rz) g.rotateZ(rz); g.translate(x, y, z); frame.push(g); };
    for (const [x, z] of [[-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]]) box(0.8, 70, 0.8, x, 33, z);
    for (let y = 3.5, k = 0; y < 66; y += 3.5, k++) {
      box(9.8, 0.3, 9.8, 0, y, 0);
      box(9.8, 1.1, 0.12, 0, y + 0.6, -4.9); box(9.8, 1.1, 0.12, 0, y + 0.6, 4.9); box(0.12, 1.1, 9.8, -4.9, y + 0.6, 0); box(0.12, 1.1, 9.8, 4.9, y + 0.6, 0);
      box(7.6, 0.25, 1.4, 0, y + 1.75, k % 2 ? 3.6 : -3.6, k % 2 ? 0.43 : -0.43);
    }
    T.add(new THREE.Mesh(mergeGeometries(frame.map((g) => keepPN(g))), white));
    // the observation deck at 70 m: a white oval with its glass band and the glass floor
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.4, 32), glass); deck.scale.set(7.5, 1, 6.5); deck.position.set(0, 71.4, 0); T.add(deck);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.0, 32), white); lid.scale.set(8, 1, 7); lid.position.set(0, 73.6, 0); T.add(lid);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.8, 32), white); floor.scale.set(8, 1, 7); floor.position.set(0, 69.6, 0); T.add(floor);
    // the veil: a band of red steel 7 m wide - over the top in a hook (76.5 m), down the tower's side, then out across the
    // stage at 12 m on white posts
    const red = new THREE.MeshStandardMaterial({ color: 0xd3202b, roughness: 0.45, metalness: 0.35, emissive: 0x3a080b, side: THREE.DoubleSide });
    const path = new THREE.CatmullRomCurve3([[-7, 72.5], [-5, 75.4], [0, 76.5], [6, 75.4], [8.5, 70.5], [9, 60], [9, 40], [9.2, 24], [10.5, 16], [15, 12.6], [24, 12], [40, 12], [58, 12], [70, 12]].map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
    const NS = 160, W = 7, P = [], I = [];
    for (let k = 0; k <= NS; k++) { const q = path.getPoint(k / NS); P.push(q.x, q.y, -W / 2, q.x, q.y, W / 2); if (k < NS) { const a = k * 2; I.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    const veil = new THREE.BufferGeometry(); veil.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); veil.setIndex(I); veil.computeVertexNormals();
    T.add(new THREE.Mesh(veil, red));
    const posts = []; for (let x = 22; x <= 70; x += 12) for (const z of [-3.2, 3.2]) { const g = new THREE.BoxGeometry(0.5, 14, 0.5); g.translate(x, 5, z); posts.push(keepPN(g)); }
    T.add(new THREE.Mesh(mergeGeometries(posts), white));
    group.add(T);
    // the stage, its canopy under the veil's run, the lawn bowl and the plaza: on the ground (raised with the world)
    const Pz = new THREE.Group(); Pz.name = 'scene:plaza'; Pz.position.set(tx, 0, tz); Pz.rotation.y = yaw;
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 0.6, 24, 1, false, 0, Math.PI), white); canopy.rotation.y = Math.PI / 2; canopy.position.set(34, 10.5, 0); Pz.add(canopy);
    const stage = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 26), new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.8 })); stage.position.set(30, 0.8, 0); Pz.add(stage);
    const lawn = new THREE.Mesh(new THREE.CylinderGeometry(75, 75, 0.3, 40, 1, false, -Math.PI / 2.5, Math.PI / 1.25), new THREE.MeshStandardMaterial({ color: 0x5e7a36, roughness: 1 }));
    lawn.position.set(38, 0.05, 0); lawn.rotation.y = -Math.PI / 2; Pz.add(lawn);
    // the Grand Plaza: pale concrete beyond the lawn, and the long reflecting pool at its far end
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(150, 0.2, 60), new THREE.MeshStandardMaterial({ color: 0xc9c4b8, roughness: 0.85 })); plaza.position.set(190, 0.08, 0); Pz.add(plaza);
    const pool = new THREE.Mesh(new THREE.BoxGeometry(80, 0.25, 14), new THREE.MeshStandardMaterial({ color: 0x3f6f8e, roughness: 0.08, metalness: 0.5, envMapIntensity: 1.6 })); pool.position.set(225, 0.12, 0); Pz.add(pool);
    // (the plaza and the pool only where there is room inside the loop)
    for (const m of [plaza, pool]) { const c = new THREE.Vector3(m.position.x, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); if (corridorSigned(tr, pit, tx + c.x, tz + c.z, 40) < 0) m.visible = false; }
    group.add(Pz);
    solid.push([tx, tz, 16]);
    const at = (u) => [tx + Math.cos(yaw) * u, tz - Math.sin(yaw) * u]; solid.push([...at(35), 45], [...at(190), 70]);
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
    stands.push({ x: ox, z: oz, ex, ez, len: S.len, tiers: S.tiers, name: S.name });
    const cx = ox + ez[0] * DEPTH / 2, cz = oz + ez[1] * DEPTH / 2; standBoxes.push([cx, cz, S.len / 2 + 8]); solid.push([cx, cz, S.len / 2 + 6]);
  }

  // ---- the stars on the blue of the Turn 1 run-off (its stripes: tracks.js runoffPaint): white five-pointed stars,
  //      3 m across, in rows on the blue bands outside the hairpin
  {
    const s1 = cornerS(1), stars = [];
    if (s1 != null) {
      const shape = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 0.62 : 1.5; (k ? shape.lineTo : shape.moveTo).call(shape, Math.cos(a) * r, Math.sin(a) * r); }
      const base = new THREE.ShapeGeometry(shape); base.rotateX(-Math.PI / 2);
      const hw = tr.halfWidth, kw = tr.kerbWidth;
      for (let s = s1 - 110; s <= s1 + 70; s += 6.5) {
        const i = tr.idxAtS(s);
        for (const side of [1, -1]) {
          const wall = tr.wallAt(i, side); if (wall < hw + kw + 10 || (side > 0 ? tr.surfL[i] : tr.surfR[i]) !== 1) continue;
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
    const bank = (s0, s1, side, d0, d1, rise, fill = 0.72) => {
      const P = [], I = [], rows = Math.ceil((d1 - d0) / 3) + 1; let cols = 0;
      for (let s = s0; s <= s1 + 0.1; s += 4) {
        const i = tr.idxAtS(s), w = tr.wallAt(i, side), f = tr.sample(s, 0);
        for (let r = 0; r < rows; r++) { const u = r / (rows - 1), d = w + d0 + (d1 - d0) * u, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d; P.push(x, rise * u * u * (3 - 2 * u), z); }
        cols++;
      }
      for (let c = 0; c < cols - 1; c++) for (let r = 0; r < rows - 1; r++) { const a = c * rows + r, b = a + 1, cc = a + rows, d = cc + 1; if (side > 0) I.push(a, cc, b, b, cc, d); else I.push(a, b, cc, b, d, cc); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); berms.push(g);
      for (let s = s0; s <= s1; s += 0.75) {
        const i = tr.idxAtS(s), w = tr.wallAt(i, side), f = tr.sample(s, 0), ang = Math.atan2(-f.nx * side, -f.nz * side);
        for (let d = d0 + 1.2; d <= d1 - 0.5; d += 1.15) {
          if (rnd() > fill) continue;
          const dd = w + d + (rnd() - 0.5) * 0.5, x = f.x + f.nx * side * dd + (rnd() - 0.5) * 0.4, z = f.z + f.nz * side * dd + (rnd() - 0.5) * 0.4;
          if (!free(x, z, 0.5)) continue;
          const u = (d - d0) / (d1 - d0), y = rise * u * u * (3 - 2 * u);
          if (rnd() < 0.07) { picnic(x, y, z, ang); d += 1.2; continue; }
          sheets.push([x, y, z, ang + (rnd() - 0.5) * 0.5, stander()]);
        }
      }
    };
    const S = (n, a = 0) => (cornerS(n) ?? 0) + a;
    bank(S(1, -420), S(1, -170), -1, 6, 44, 7);      // the run up to Turn 1, the big hill on the right
    bank(S(1, 25), S(1, 130), -1, 6, 40, 6);         // round the outside of Turn 1
    bank(S(1, -260), S(1, -60), 1, 8, 30, 3, 0.5);   // and the left of the run, under the flag
    bank(S(2, -30), S(2, 140), 1, 6, 36, 4);         // the hill down to Turn 2
    bank(S(3, -20), S(6, 40), -1, 6, 34, 5);          // the Esses
    bank(S(9, -80), S(10, 40), 1, 6, 28, 3, 0.6);    // Turns 9 and 10
    bank(S(11, -160), S(11, 50), -1, 6, 34, 4);      // the hairpin
    bank(S(12, -90), S(12, 60), 1, 6, 30, 4);        // Turn 12's inside
    bank(S(15, -40), S(16, 30), 1, 6, 26, 3, 0.65);  // the stadium
    bank(S(19, -120), S(20, 20), -1, 6, 32, 4);      // Turns 19 and 20
    // the Grand Plaza and the amphitheatre's lawn: milling, every which way (and facing the stage on the lawn)
    if (towerAt) {
      const Pz = group.getObjectByName('scene:plaza'), yaw = Pz ? Pz.rotation.y : 0, cy = Math.cos(yaw), sy = Math.sin(yaw);
      const L = (u, v) => [towerAt[0] + cy * u + sy * v, towerAt[1] - sy * u + cy * v];
      for (let k = 0; k < 2600; k++) {   // (the lawn: a fan of people facing back to the stage)
        const a = (rnd() - 0.5) * Math.PI * 0.75, r = 18 + Math.sqrt(rnd()) * 52, u = 38 + Math.cos(a) * r, v = Math.sin(a) * r, [x, z] = L(u, v);
        if (corridorSigned(tr, pit, x, z, 4) <= 0) continue;
        const face = yaw + Math.PI / 2 + a + Math.PI + (rnd() - 0.5) * 0.3;
        if (rnd() < 0.12) picnic(x, 0, z, face); else sheets.push([x, 0, z, face, stander()]);
      }
      for (let k = 0; k < 1800; k++) { const [x, z] = L(110 + rnd() * 160, (rnd() - 0.5) * 70); if (corridorSigned(tr, pit, x, z, 4) > 0) sheets.push([x, 0, z, rnd() * Math.PI * 2, stander()]); }
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
        const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 22, 12, 1, true), m); cone.geometry.translate(0, -11, 0);
        const piv = new THREE.Group(); const lx = sx + sy * (k - 2.5) * 4, lz = sz + cy * (k - 2.5) * 4; piv.position.set(lx, 10 + TERRAIN.at(lx, lz), lz); piv.userData.onTerrain = true; piv.add(cone); piv.rotation.z = Math.PI * 0.75; group.add(piv);   // (swept every frame: placed on the ground here, not raised with the world) fest.stageLights.push(piv);
      }
    }
    // the fans: one instanced quad each (one mesh per 400 m cell: whole cells cull), cut out of fanAtlas - ten people,
    // standing, cheering, filming, in a cap or a Stetson, sitting - each with their own shirt, trousers, skin and hair or
    // hat, from everyday colours (team shirts among them, not every one); the cheering ones bounce
    const SHIRT = [0xe9e9e6, 0xe9e9e6, 0xe9e9e6, 0x1c1c1e, 0x1c1c1e, 0x1c1c1e, 0x23304a, 0x23304a, 0x8d9096, 0x8d9096, 0x3b3d42, 0x8fb0cf, 0xb8a888, 0x5c6246, 0x6e2a33,
      0xd0702c, 0xd0702c, 0xd0702c, 0xa82a32, 0xa82a32, 0x1f2c5a, 0x3fa596, 0x1f5a4c, 0x2b4f9e, 0xb5551a, 0xb5551a, 0xc98aa2, 0xcdb75a, 0xf2e6d0];
    const PANTS = [0x3b4d6b, 0x3b4d6b, 0x2f3c55, 0x52688a, 0x52688a, 0xa89a7a, 0xa89a7a, 0x1f1f22, 0x1f1f22, 0x5a5d63, 0x6b6b4e, 0xcfc7b5];
    const SKIN = [0xf0cfb4, 0xe7c0a0, 0xdcae8a, 0xc99572, 0xb07b55, 0x8f5d3e, 0x6b432b, 0x523221];
    const HAIR = [0x231811, 0x2e2018, 0x4a3221, 0x6b4a2e, 0x9c7b52, 0xc4a473, 0x141414, 0x7d7a76];
    const HAT = [0xd0702c, 0x1c1c1e, 0xe9e9e6, 0xa82a32, 0x23304a, 0x8d9096], STETSON = [0xc9a97a, 0xe2d6bc, 0x6e5238, 0x2a2a2a];
    fest.sheetMat = new THREE.MeshLambertMaterial({ color: 0xffffff, map: fanAtlas(), side: THREE.DoubleSide, alphaTest: 0.45 });
    fest.sheetMat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = { value: 0 }; fest.sheetMat.userData.shader = sh;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aPhase; attribute float aVar; attribute vec3 aPants; attribute vec3 aSkin; attribute vec3 aHead; uniform float uTime; varying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
        .replace('#include <uv_vertex>', '#include <uv_vertex>\n vYr = uv.y; vMapUv = vec2((uv.x + aVar) / 10.0, uv.y); vWaist = aVar > 7.5 ? 0.19 : 0.444; vPants = aPants; vSkin = aSkin; vHead = aHead;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n float cheer = (abs(aVar - 2.5) < 1.0 ? 1.0 : 0.0) * step(0.4, fract(aPhase * 7.13)); transformed.y += 0.16 * cheer * max(0.0, sin(uTime * 5.5 + aPhase));');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vYr; varying float vWaist; varying vec3 vPants; varying vec3 vSkin; varying vec3 vHead;')
        .replace('#include <map_fragment>', `vec4 T = texture2D( map, vMapUv );
          vec3 body = mix( vec3( 0.06 ), vPants, smoothstep( 0.03, 0.05, vYr ) );
          body = mix( body, vColor, smoothstep( vWaist - 0.012, vWaist + 0.012, vYr ) );
          vec3 c = mix( body, vSkin, T.g );
          c = mix( c, vHead, T.b );
          diffuseColor.rgb = c * ( 0.5 + 0.5 * T.r ); diffuseColor.a = T.a;`)
        .replace('#include <color_fragment>', '');
    };
    fest.sheetMat.customProgramCacheKey = () => 'austin-fans-2';
    const quad = new THREE.PlaneGeometry(0.64, 1.91); quad.translate(0, 0.955, 0);
    const cells = new Map(); for (const sh of sheets) { const k = Math.floor(sh[0] / 400) * 1000 + Math.floor(sh[2] / 400); let a = cells.get(k); if (!a) cells.set(k, (a = [])); a.push(sh); }
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), col = new THREE.Color();
    const pickC = (a) => col.setHex(a[(rnd() * a.length) | 0]).offsetHSL(0, (rnd() - 0.5) * 0.06, (rnd() - 0.5) * 0.06);
    for (const list of cells.values()) {
      const n = list.length, g = quad.clone(), im = new THREE.InstancedMesh(g, fest.sheetMat, n), ph = new Float32Array(n), vr = new Float32Array(n), pa = new Float32Array(n * 3), sk = new Float32Array(n * 3), hd = new Float32Array(n * 3);
      list.forEach(([x, y, z, a, v], i) => {
        const s = 0.9 + rnd() * 0.18; m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(up, a), sc.set(s, s, 1)); im.setMatrixAt(i, m4);
        im.setColorAt(i, pickC(SHIRT)); pickC(PANTS).toArray(pa, i * 3); pickC(SKIN).toArray(sk, i * 3);
        (v === 6 ? pickC(HAT) : v === 7 ? pickC(STETSON) : pickC(HAIR)).toArray(hd, i * 3);
        ph[i] = rnd() * 6.283; vr[i] = v;
      });
      g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(ph, 1)); g.setAttribute('aVar', new THREE.InstancedBufferAttribute(vr, 1));
      g.setAttribute('aPants', new THREE.InstancedBufferAttribute(pa, 3)); g.setAttribute('aSkin', new THREE.InstancedBufferAttribute(sk, 3)); g.setAttribute('aHead', new THREE.InstancedBufferAttribute(hd, 3));
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = 'austin:fans'; group.add(im);
    }
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
    if (berms.length) group.add(new THREE.Mesh(mergeGeometries(berms), new THREE.MeshStandardMaterial({ color: 0x6f8240, roughness: 1, side: THREE.DoubleSide })));
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
      const hw = tr.halfWidth, red = [0.5, 0.06, 0.1];
      const strip = (side) => ribbon(tr, (i) => (side > 0 ? hw + 0.05 : -(hw + 6.5)), (i) => (side > 0 ? hw + 6.5 : -(hw + 0.05)), 0.012, { mask: (i) => { const s = tr.s[i], d = tr.wrapS(s - (s1 - 520)); return d < 470; }, colorFn: () => red });
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
        const s = sA - 90 - m, i = tr.idxAtS(s), f = tr.sample(s, 0), d = -(tr.halfWidth + 3.2), x = f.x + f.nx * d, z = f.z + f.nz * d;
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

  // ---- the car parks in the fields: rows of cars, every colour, on the far side of the stands and round the outside
  {
    const lots = [[20, 260, -1, 5, 34], [1, -380, -1, 6, 40], [11, 0, 1, 5, 30], [11, -400, -1, 6, 30], [7, 0, -1, 4, 28], [17, 0, 1, 4, 26]];
    const carG = keepPN(new THREE.BoxGeometry(1.8, 1.4, 4.4)); carG.translate(0, 0.7, 0);
    const M = [], C = [], col = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(1, 1, 1), p3 = new THREE.Vector3();
    const PAINT = [0xf2f2f2, 0x111111, 0x8a9096, 0xc7cbd0, 0x1f3f7a, 0x8a1c1c, 0x2d4a2a, 0xb0a48a, 0x4b4f55, 0xd8d2c4];
    for (const [turn, along, side, rows, back] of lots) {
      const s0 = (cornerS(turn) ?? 0) + along;
      for (let r = 0; r < rows; r++) for (let k = 0; k < 40; k++) {
        const s = s0 + k * 3.2, f = tr.sample(s, 0), d = tr.wallAt(tr.idxAtS(s), side) + back + 40 + r * 9, x = f.x + f.nx * side * d, z = f.z + f.nz * side * d;
        if (rnd() < 0.18 || !free(x, z, 3)) continue;
        q.setFromAxisAngle(up, Math.atan2(f.nx, f.nz) + (rnd() - 0.5) * 0.08); m4.compose(p3.set(x, 0, z), q, sc); M.push(m4.clone());
        C.push(col.setHex(PAINT[(rnd() * PAINT.length) | 0]).clone());
      }
    }
    if (M.length) {
      const im = new THREE.InstancedMesh(carG, new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.5 }), M.length);
      M.forEach((m, i) => { im.setMatrixAt(i, m); im.setColorAt(i, C[i]); });
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = 'austin:cars'; group.add(im);
    }
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

  // ---- trees: live oaks (wide, low, dark crowns), cedar elms, Ashe junipers (the "cedars": dense dark cones) and
  //      mesquite (feathery, small) - in clumps along the creek lines and the field edges, a few in the infield
  {
    const crown = (r, x, y, z, sx, sy, sz, detail = 1) => { const g = new THREE.IcosahedronGeometry(r, detail); g.scale(sx, sy, sz); g.translate(x, y, z); const p = g.attributes.position; for (let k = 0; k < p.count; k++) { const f = 0.88 + 0.24 * Math.abs(Math.sin(p.getX(k) * 9 + p.getZ(k) * 7)); p.setXYZ(k, p.getX(k) * f, p.getY(k), p.getZ(k) * f); } return vcolor(nonIdx(g), 0xffffff); };
    const trunk = (h, r) => { const g = new THREE.CylinderGeometry(r * 0.7, r, h, 5, 1, true); g.translate(0, h / 2, 0); return vcolor(nonIdx(g), 0x5b4a38); };
    const shade = (g) => { const p = g.attributes.position, c = g.attributes.color; for (let k = 0; k < p.count; k++) { const f = 0.6 + 0.4 * Math.min(1, Math.max(0, (p.getY(k) - 0.25) / 0.6)); if (c.getX(k) > 0.9) c.setXYZ(k, f, f, f); } return g; };
    const merge = (gs) => shade(mergeGeometries(gs.map((g) => { g.deleteAttribute('uv'); return g; })));
    const KINDS = {
      oak: { geo: merge([trunk(0.32, 0.06), crown(0.42, 0, 0.5, 0, 1.6, 0.55, 1.5), crown(0.3, 0.38, 0.46, 0.1, 1.2, 0.5, 1.1, 0), crown(0.3, -0.36, 0.44, -0.12, 1.2, 0.5, 1.1, 0)]), col: [0x3c4a26, 0x46552b, 0x34411f], h: [7, 12] },
      elm: { geo: merge([trunk(0.45, 0.04), crown(0.3, 0, 0.66, 0, 1.0, 0.85, 1.0), crown(0.22, 0.15, 0.78, 0.05, 1, 0.9, 1, 0)]), col: [0x55642e, 0x5e6c35], h: [8, 14] },
      juniper: { geo: (() => { const c = new THREE.ConeGeometry(0.34, 0.85, 7, 2); c.translate(0, 0.55, 0); return merge([trunk(0.2, 0.04), vcolor(nonIdx(c), 0xffffff)]); })(), col: [0x2c3a24, 0x34432a], h: [4, 8] },
      mesquite: { geo: merge([trunk(0.35, 0.035), crown(0.28, 0.12, 0.55, 0, 1.4, 0.5, 1.3, 0), crown(0.24, -0.14, 0.6, 0.06, 1.3, 0.45, 1.2, 0)]), col: [0x6b7340, 0x737a46], h: [3.5, 6] },
    };
    const plant = { oak: [], elm: [], juniper: [], mesquite: [] };
    // clumps: around the outside of the lap (beyond the stands and the car parks), along a few creek lines across the
    // fields, a scatter in the infield
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (let i = 0; i < tr.n; i += 10) { x0 = Math.min(x0, tr.px[i]); x1 = Math.max(x1, tr.px[i]); z0 = Math.min(z0, tr.pz[i]); z1 = Math.max(z1, tr.pz[i]); }
    const pickKind = () => { const r = rnd(); return r < 0.45 ? 'oak' : r < 0.6 ? 'elm' : r < 0.82 ? 'juniper' : 'mesquite'; };
    for (let c = 0; c < 140; c++) {
      const cx = x0 - 500 + rnd() * (x1 - x0 + 1000), cz = z0 - 500 + rnd() * (z1 - z0 + 1000), inside = cx > x0 && cx < x1 && cz > z0 && cz < z1;
      const n = inside ? 3 + ((rnd() * 5) | 0) : 8 + ((rnd() * 22) | 0), R = inside ? 18 : 30 + rnd() * 50, kind = pickKind();
      for (let k = 0; k < n; k++) {
        const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * R, x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
        if (!free(x, z, 6)) continue;
        const K = rnd() < 0.7 ? kind : pickKind(), spec = KINDS[K];
        plant[K].push([x, z, spec.h[0] + rnd() * (spec.h[1] - spec.h[0]), rnd() * Math.PI * 2, spec.col[(rnd() * spec.col.length) | 0]]);
      }
    }
    const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 });
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), sc = new THREE.Vector3(), p3 = new THREE.Vector3(), col = new THREE.Color();
    let count = 0;
    for (const [K, list] of Object.entries(plant)) {
      if (!list.length) continue;
      const im = new THREE.InstancedMesh(KINDS[K].geo, treeMat, list.length);
      list.forEach(([x, z, h, rot, c], i) => { q.setFromAxisAngle(up, rot); const w = h * (0.9 + rnd() * 0.25); m4.compose(p3.set(x, 0, z), q, sc.set(w, h, w)); im.setMatrixAt(i, m4); im.setColorAt(i, col.setHex(c).multiplyScalar(0.9 + rnd() * 0.2)); });
      im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = `austin:${K}`; group.add(im); count += list.length;
    }
    console.info(`[austin] ${stands.length} grandstands, ${count} trees (${Object.entries(plant).map(([k, v]) => `${k} ${v.length}`).join(', ')})${towerAt ? ', the tower' : ''}`);
  }

  // the tower's glass: the rainbow by night, pale by day
  const glow = []; group.traverse((o) => { if (o.material?.userData?.towerGlow) glow.push(o.material); });
  return {
    group, claimed, stands,
    /** something of the scenery standing at (x, z) (where an evening's venue cannot go: main.js footClear) */
    blocked: (x, z) => standBoxes.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r) || solid.some(([sx, sz, r]) => (sx - x) ** 2 + (sz - z) ** 2 < r * r),
    update(t) {
      for (const m of [flagMat, fest.sheetMat, fest.flagMat, fest.usFlag]) { const sh = m?.userData.shader; if (sh) sh.uniforms.uTime.value = t; }
      fest.stageLights.forEach((p, k) => { p.rotation.z = Math.PI * 0.78 + 0.3 * Math.sin(t * 0.9 + k * 1.3); p.rotation.x = 0.35 * Math.sin(t * 0.7 + k * 2.1); });
    },
    setTime(mode) { for (const m of glow) m.emissiveIntensity = mode === 'day' ? 0 : 1.6; },
  };
}
