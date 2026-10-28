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

  // ---- the Observation Tower over the amphitheatre's stage (the survey's outline: 'Germania Insurance Amphiteater')
  const amph = byName(/amphi/i);
  let towerAt = null;
  if (amph) {
    claimed.add(amph.id);
    const info = footprintInfo(amph.rings[0]);
    // (the tower stands at the back of the stage, the veil falls toward the plaza: away from the circuit's nearest part)
    const q = tr.nearest(info.c[0], info.c[1]), f = tr.sample(q.s, 0); let ax = info.c[0] - f.x, az = info.c[1] - f.z; const al = Math.hypot(ax, az) || 1; ax /= al; az /= al;
    const tx = info.c[0] + ax * 30, tz = info.c[1] + az * 30; towerAt = [tx, tz];
    const T = new THREE.Group(); T.name = 'scene:tower'; T.position.set(tx, 0, tz); T.rotation.y = Math.atan2(-az, ax) + Math.PI;   // (local +x: toward the stage and the circuit)
    // the shaft: the lift and the stairs in a glass column 8 m square, white steel at its corners, its floors banded in
    // colour (by night the rainbow, by day pale glass)
    const bands = document.createElement('canvas'); bands.width = 64; bands.height = 512; const bx = bands.getContext('2d');
    for (let k = 0; k < 32; k++) { bx.fillStyle = `hsl(${(k * 360 / 11) % 360}, 90%, 58%)`; bx.fillRect(0, k * 16, 64, 13); bx.fillStyle = '#e8ecf0'; bx.fillRect(0, k * 16 + 13, 64, 3); }
    const bandTex = new THREE.CanvasTexture(bands); bandTex.colorSpace = THREE.SRGBColorSpace;
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xbfd2e0, roughness: 0.1, metalness: 0.6, emissive: 0xffffff, emissiveMap: bandTex, emissiveIntensity: 0.25, envMapIntensity: 1.4 });
    shaftMat.userData.towerGlow = true;
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(8, 68, 8), shaftMat); shaft.position.y = 34; T.add(shaft);
    const legs = []; for (const [x, z] of [[-4.3, -4.3], [4.3, -4.3], [-4.3, 4.3], [4.3, 4.3]]) { const g = new THREE.BoxGeometry(0.9, 72, 0.9); g.translate(x, 36, z); legs.push(g); }
    for (let y = 6; y < 70; y += 6) for (const [x, z, w, d] of [[0, -4.3, 9.4, 0.4], [0, 4.3, 9.4, 0.4], [-4.3, 0, 0.4, 9.4], [4.3, 0, 0.4, 9.4]]) { const g = new THREE.BoxGeometry(w, 0.35, d); g.translate(x, y, z); legs.push(g); }
    T.add(new THREE.Mesh(mergeGeometries(legs), steel));
    // the observation deck: an oval of glass 70 m up, its floor partly glass, under a white lid
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5, 32), glass); deck.scale.set(10, 1, 7); deck.position.set(1.5, 70.5, 0); T.add(deck);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.8, 32), white); lid.scale.set(10.6, 1, 7.6); lid.position.set(1.5, 73.4, 0); T.add(lid);
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.6, 32), steel); floor.scale.set(10.4, 1, 7.4); floor.position.set(1.5, 67.8, 0); T.add(floor);
    // the veil: red steel cables from the top, over the deck and down the tower's side, then out over the stage
    const red = new THREE.MeshStandardMaterial({ color: 0xd3202b, roughness: 0.45, metalness: 0.4, emissive: 0x4a0a0e });
    const cables = [], N = 26;
    for (let j = 0; j < N; j++) {
      const u = (j / (N - 1)) * 2 - 1;
      const pts = [[-9, 76.5, 0], [-2, 78.5, 0], [6, 77, 0], [11, 70, 0], [12.5, 52, 0], [13.5, 32, 0], [17, 15, 0], [27, 9, 0], [48, 7.4, 0], [74, 6.8, 0]]
        .map(([x, y], k) => new THREE.Vector3(x, y, u * (5.5 + Math.max(0, k - 3) * 1.6)));
      cables.push(keepPN(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.14, 5, false)));
    }
    T.add(new THREE.Mesh(mergeGeometries(cables), red));
    // the stage under the veil's end: its white canopy, the stage itself, and the lawn bowl rising away from it
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 0.6, 24, 1, false, 0, Math.PI), white); canopy.rotation.y = Math.PI / 2; canopy.position.set(52, 13, 0); T.add(canopy);
    const stage = new THREE.Mesh(new THREE.BoxGeometry(18, 1.6, 30), new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.8 })); stage.position.set(54, 0.8, 0); T.add(stage);
    for (const [x, z] of [[40, -18], [40, 18], [66, -18], [66, 18]]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 13, 0.8), steel); m.position.set(x, 6.5, z); T.add(m); }
    const lawn = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 1, 32, 1, false, -Math.PI / 2.6, Math.PI / 1.3), new THREE.MeshStandardMaterial({ color: 0x5e7a36, roughness: 1 }));
    lawn.position.set(60, -0.45, 0); lawn.rotation.y = -Math.PI / 2; lawn.scale.set(1, 1, 1); T.add(lawn);
    group.add(T);
    solid.push([tx, tz, 22], [tx + Math.cos(T.rotation.y) * 55, tz - Math.sin(T.rotation.y) * 55, 50]);
  }

  // ---- the Texas flag on its pole by the Turn 15 stands: 18 x 12 m, waving
  const t15 = byName(/turn 15 grand/i);
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
    setTime(mode) { for (const m of glow) m.emissiveIntensity = mode === 'day' ? 0.25 : 1.6; },
  };
}
