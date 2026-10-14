// Tributes to drivers lost, in 3D: bouquets and candles laid along a line, cloth banners, and banners held up in the
// grandstands' front rows (the pre-race show after a death: ui/PreRace.js).
import * as THREE from 'three';

const pick = (a) => a[(Math.random() * a.length) | 0];

/**
 * Bouquets and candles laid along a line: at(along, lateral, y) -> a Vector3 places them (along -spanA..spanA, lateral
 * 0..spanL; the candles a little in front, at negative lateral). n bouquets, nc candles. -> the candle flames.
 */
export function tribute(group, at, n, spanL, spanA, nc) {
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S3 = new THREE.Vector3(), E = new THREE.Euler(), col = new THREE.Color();
  const wraps = new THREE.InstancedMesh(new THREE.ConeGeometry(0.06, 0.32, 8, 1, true).rotateZ(-Math.PI / 2).translate(0.16, 0, 0), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 }), n);
  const blooms = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ roughness: 0.7 }), n * 10);
  const BLOOM = ['#f4f1ea', '#f4f1ea', '#d7263d', '#f7d6e0', '#f2c14e', '#9b5de5', '#ffffff', '#e8a0bf'], WRAP = ['#efe6d2', '#f5f5f5', '#d9c4a5', '#e9e1f2', '#1c1c1c'];
  let bi = 0;
  for (let i = 0; i < n; i++) {
    const p = at((Math.random() - 0.5) * 2 * spanA, Math.random() * spanL, 0.06 + Math.random() * 0.05);
    Q.setFromEuler(E.set((Math.random() - 0.5) * 0.4, Math.random() * 6.28, (Math.random() - 0.5) * 0.3)); const base = M4.compose(p, Q, S3.set(1, 1, 1)).clone();
    wraps.setMatrixAt(i, base); wraps.setColorAt(i, col.set(pick(WRAP)));
    const tone = pick(BLOOM);
    for (let b = 0; b < 10; b++) { const r = 0.016 + Math.random() * 0.014, a = Math.random() * 6.28, rr = Math.random() * 0.055; blooms.setMatrixAt(bi, base.clone().multiply(M4.compose(S3.set(0.31 + Math.random() * 0.06, Math.cos(a) * rr, Math.sin(a) * rr), Q.identity(), new THREE.Vector3(r, r, r)))); blooms.setColorAt(bi++, col.set(Math.random() < 0.7 ? tone : pick(BLOOM))); }
  }
  group.add(wraps, blooms);
  const candles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.028, 0.03, 1, 10).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: '#f3eee2', roughness: 0.6, emissive: '#3a2a10', emissiveIntensity: 0.4 }), nc);
  const flameMat = new THREE.MeshBasicMaterial({ color: '#ffc46b' }), flames = [];
  for (let i = 0; i < nc; i++) {
    const h = 0.07 + Math.random() * 0.1, p = at((Math.random() - 0.5) * 2 * spanA, -0.25 - Math.random() * 0.4, 0);
    candles.setMatrixAt(i, M4.compose(p, Q.identity(), S3.set(1, h, 1)));
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), flameMat); f.position.set(p.x, h + 0.02, p.z); f.scale.y = 1.8; f.userData.ph = i * 1.7; group.add(f); flames.push(f);
  }
  group.add(candles);
  return flames;
}

/** a cloth banner: two lines of text, the colour along the top, a black band along the bottom; w x h metres */
export function clothBanner(lines, color, w, h) {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * h / w); const x = cv.getContext('2d');
  x.fillStyle = '#f6f4ef'; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = color; x.fillRect(0, 0, cv.width, cv.height * 0.12); x.fillStyle = '#111'; x.fillRect(0, cv.height * 0.88, cv.width, cv.height * 0.12);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach((L, i) => { let s = i ? 96 : 76; do { x.font = `900 ${s}px "Segoe UI", Arial, sans-serif`; s -= 4; } while (x.measureText(L).width > cv.width * 0.9 && s > 24); x.fillStyle = i ? color : '#16171a'; x.fillText(L, cv.width / 2, cv.height * (0.32 + i * 0.34)); });
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const g = new THREE.PlaneGeometry(w, h, 16, 1), pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 2.1) * 0.025);   // (a little slack in the cloth)
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25 }));
}

/**
 * Banners held up in the front rows of the grandstands nearest a point, for the drivers lost (Ds: [{ first, last,
 * number, color }]) -> [{ pos, stand, f }] (f: along the stand, -0.5..0.5). stands: world/Grandstands.js's list.
 */
export function standBanners(group, stands, near, Ds, per = 4) {
  const list = (stands || []).map((p) => ({ p, d: Math.hypot(p.x - near.x, p.z - near.z) })).sort((a, b) => a.d - b.d).slice(0, 3), out = [];
  list.forEach(({ p }, si) => {
    for (let j = 0; j < per; j++) {
      const D = Ds[(si + j) % Ds.length], f = -0.36 + j * (0.72 / Math.max(1, per - 1)) + (Math.random() - 0.5) * 0.06, row = 1 + (j % 3);
      const F = D.first.toUpperCase(), L = D.last.toUpperCase(), N = `#${D.number ?? ''}`;
      const lines = [[`FOREVER ${N}`, L], [`RIP ${F}`, N], ['NEVER FORGET', L], [F, 'IN OUR HEARTS'], ['RACE IN PEACE', `${F} ${N}`]][(si * 2 + j) % 5];
      const [x, z] = p.world(f * p.len, 0.8 + (row + 0.5) * 1.35), [tx, tz] = p.world(f * p.len, -40), y = 1.2 + row * 0.48 + 1.7;
      const b = clothBanner(lines, D.color, 2.6, 0.74); b.position.set(x, y, z); b.lookAt(tx, y, tz); b.rotateZ((Math.random() - 0.5) * 0.1); group.add(b); out.push({ pos: b.position.clone(), stand: p, f });
    }
  });
  return out;
}

/** free everything under a group built from these (geometries, materials, their textures) */
export function disposeGroup(group) {
  group.traverse((o) => { if (o.isMesh || o.isInstancedMesh) { o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose(); x.emissiveMap?.dispose(); x.dispose(); }); } });
}
