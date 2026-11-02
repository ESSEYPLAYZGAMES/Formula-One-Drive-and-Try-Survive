// The safety car's model (tools/sc_model.mjs -> assets/sc): the Aston Martin Vantage cut into its body, four wheels
// (about their hubs), the light bar's lamps and the tail lights, at three levels of detail. Decoded once (loadSCModel,
// at start-up); the single-file build carries it in <script id="sc-json|sc-bin|sc-tex-*"> (tools/bundle.py).
// Credit: based on "2021 | Aston Martin Vantage F1 Safety Car" by kevin (ケビン) (sketchfab.com/sohyalebret), CC BY 4.0.
import * as THREE from 'three';
import { gunzip, b64, decode } from './CarModel.js';

let MODEL = null, LOADING = null;
/** the model once loaded (null before, or if it could not be loaded) */
export function scModel() { return MODEL; }

const embedded = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);

/** load the model (once): geometry, textures, materials */
export function loadSCModel(base = 'assets/sc/') {
  return LOADING || (LOADING = (async () => {
    const ej = embedded('sc-json'), eb = embedded('sc-bin');
    const json = ej ? JSON.parse(ej.textContent) : await (await fetch(base + 'sc.json')).json();
    const gz = eb ? b64(eb.textContent) : new Uint8Array(await (await fetch(base + 'sc.bin.gz')).arrayBuffer());
    const bin = await gunzip(gz);
    const names = new Set(); for (const m of Object.values(json.mats)) { if (m.tex) names.add(m.tex); if (m.emtex) names.add(m.emtex); }
    const tex = {};
    await Promise.all([...names].map(async (n) => { tex[n] = await loadTexture(n, base); }));
    const mats = { _vc: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.3 }) }, flat = { _vc: mats._vc };
    for (const [k, m] of Object.entries(json.mats)) { mats[k] = material(m, tex); flat[k] = material({ ...m, color: m.flat, tex: null, emtex: null, clear: 0 }, tex); }
    // every part's levels: [[{ geo, mat }]]
    const parts = {};
    for (const [name, P] of Object.entries(json.parts)) {
      parts[name] = { pivot: P.pivot, lv: P.lv.map((L, i) => L.map((c) => ({ geo: decode(bin, c), mat: c.m, flat: i === 2 }))) };
    }
    MODEL = { json, parts, mats, flat, hubs: json.hubs, radius: json.radius, credit: json.credit };
    return MODEL;
  })().catch((e) => { console.warn('[safety car model]', e); return null; }));
}

function material(m, tex) {
  const P = {
    color: new THREE.Color(m.color[0], m.color[1], m.color[2]), metalness: m.metal, roughness: m.rough,
    map: m.tex ? tex[m.tex] : null, side: m.ds ? THREE.DoubleSide : THREE.FrontSide,
  };
  if (m.blend) Object.assign(P, { transparent: true, opacity: m.opacity, depthWrite: false });
  if (m.emtex || m.emissive.some((x) => x > 0)) Object.assign(P, { emissive: new THREE.Color(...m.emissive), emissiveIntensity: m.emI ?? 1, emissiveMap: m.emtex ? tex[m.emtex] : null });
  return m.clear ? new THREE.MeshPhysicalMaterial({ ...P, clearcoat: m.clear, clearcoatRoughness: 0.08 }) : new THREE.MeshStandardMaterial(P);
}

async function loadTexture(name, base) {
  const e = embedded('sc-tex-' + name), url = e ? 'data:image/webp;base64,' + e.textContent.trim() : `${base}tex/${name}.webp`;
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const t = new THREE.Texture(img); t.flipY = false; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  return t;
}
