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
import { corridorSigned } from '../track/TrackBuilder.js';
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
    update(t) { const sh = flagMat?.userData.shader; if (sh) sh.uniforms.uTime.value = t; },
    setTime(mode) { for (const m of glow) m.emissiveIntensity = mode === 'day' ? 0 : 1.6; },
  };
}
