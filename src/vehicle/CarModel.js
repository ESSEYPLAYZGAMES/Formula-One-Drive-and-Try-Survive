// The car model (tools/car_model.mjs, tools/car_textures.py -> assets/car): its parts at five levels of detail, decoded
// once and shared by every car - a car only has its own paint (vehicle/Livery.js), number and T-cam colour. Loaded at
// start-up (loadCarModel); the single-file build carries it in <script id="car-json|car-bin|car-tex-*"> (tools/bundle.py).
// Credit: the model is based on "2026 Redbull RB22" by Dave Love (sketchfab.com/Tyler_Dave), CC BY 4.0 - its livery,
// decals and numbers are not used.
import * as THREE from 'three';

let MODEL = null, LOADING = null;
/** the model once loaded (null before) */
export function carModel() { return MODEL; }

const embedded = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);
async function gunzip(bytes) {
  const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
const b64 = (s) => { const t = atob(s.trim()), a = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) a[i] = t.charCodeAt(i); return a; };

/** load the model (once): geometry and textures */
export function loadCarModel(base = 'assets/car/') {
  return LOADING || (LOADING = (async () => {
    const ej = embedded('car-json'), eb = embedded('car-bin');
    const json = ej ? JSON.parse(ej.textContent) : await (await fetch(base + 'car.json')).json();
    const gz = eb ? b64(eb.textContent) : new Uint8Array(await (await fetch(base + 'car.bin.gz')).arrayBuffer());
    const bin = await gunzip(gz);
    const geo = {};
    for (const [name, P] of Object.entries(json.parts)) geo[name] = P.lv.map((L) => Object.fromEntries(Object.entries(L).map(([k, c]) => [k, decode(bin, c)])));
    const tex = {};
    await Promise.all(Object.keys(TEX_FILES).map(async (n) => { tex[n] = await loadTexture(n, base); }));
    MODEL = { json, geo, tex, pivots: json.pivots, hubs: json.hubs, credit: json.credit };
    return MODEL;
  })());
}

/** a chunk of car.bin -> a BufferGeometry (positions about the part's pivot) */
function decode(bin, c) {
  const g = new THREE.BufferGeometry(), n = c.n, [mn, mx] = c.box;
  const q = new Uint16Array(bin.buffer, bin.byteOffset + c.pos, n * 3), pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) { const j = i % 3; pos[i] = mn[j] + (q[i] / 65535) * (mx[j] - mn[j]); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const qn = new Int8Array(bin.buffer, bin.byteOffset + c.nrm, n * 4), nrm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { let x = qn[i * 4] / 127, y = qn[i * 4 + 1] / 127, z = qn[i * 4 + 2] / 127; const l = Math.hypot(x, y, z) || 1; nrm[i * 3] = x / l; nrm[i * 3 + 1] = y / l; nrm[i * 3 + 2] = z / l; }
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  if (c.uv != null) {
    const qu = new Uint16Array(bin.buffer, bin.byteOffset + c.uv, n * 2), uv = new Float32Array(n * 2), [u0, v0, u1, v1] = c.uvr;
    for (let i = 0; i < n; i++) { uv[i * 2] = u0 + (qu[i * 2] / 65535) * (u1 - u0); uv[i * 2 + 1] = v0 + (qu[i * 2 + 1] / 65535) * (v1 - v0); }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  }
  if (c.col != null) g.setAttribute('color', new THREE.BufferAttribute(new Uint8Array(bin.slice(c.col, c.col + n * 4)), 4, true));
  const I = c.i32 ? new Uint32Array(bin.buffer.slice(bin.byteOffset + c.idx, bin.byteOffset + c.idx + c.t * 12)) : new Uint16Array(bin.buffer.slice(bin.byteOffset + c.idx, bin.byteOffset + c.idx + c.t * 6));
  g.setIndex(new THREE.BufferAttribute(I, 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}

// ---- textures
const TEX_FILES = { carbon3: 1, carbon3_n: 1, carbon1: 1, carbon2: 1, detail: 1, generic: 1, light: 1, glass: 1, disc: 1, rim: 1, tyre: 1, tyre_n: 1, swheel: 1, swdecal: 1 };
const NON_COLOR = new Set(['carbon3_n', 'tyre_n']);
async function loadTexture(name, base) {
  const e = embedded('car-tex-' + name), url = e ? 'data:image/webp;base64,' + e.textContent.trim() : `${base}tex/${name}.webp`;
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const t = new THREE.Texture(img); t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  if (!NON_COLOR.has(name)) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true; t.userData.img = img;
  return t;
}
