// The mourning screen's picture, live (ui/CareerHub.js showMourning): the helmet in black and white on a dark floor,
// the blood run off it, and a real candle beside it - wax, wick, a flame that is the light of the scene. The flame lights
// the shell, glints in its lacquer and in the visor, throws the helmet's shadow away from it across the floor; as you
// hold to leave it shrinks, gutters and goes out, and the helmet goes dark with it. Its own small WebGL view.
import * as THREE from 'three';
import { makeHelmet, bloodPool } from '../world/People.js';

/** canvas: where to draw; d: { name, helmet, color, number } -> { set(f, t), dispose() } or null (no WebGL) */
export function mourning3D(canvas, d) {
  let R; try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false }); } catch (e) { return null; }
  R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#000000');
  const grey = (c) => { const k = new THREE.Color(c || '#ffffff'); const l = 0.2126 * k.r + 0.7152 * k.g + 0.0722 * k.b; const v = Math.max(0.05, Math.min(0.8, l)); return '#' + new THREE.Color(v, v, v).getHexString(); };
  const h = makeHelmet(grey(d.helmet), grey(d.color || '#777777'), d.number, { blood: d.name, driver: d.name, mono: true }); sc.add(h);
  h.rotation.set(0, 0.22, 0.15);   // (tipped back a little: resting on the chin guard and the back of the shell)
  h.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  // reflections: a dim room for the lacquer to glimmer in (the candle is the light: this is only what is left in the dark)
  const env = new THREE.Scene(), box = (w, hh, pos, I) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ color: new THREE.Color(I, I, I), side: THREE.DoubleSide })); m.position.copy(pos); m.lookAt(0, 0, 0); env.add(m); };
  box(3, 3, new THREE.Vector3(-0.6, 4, 1.2), 1.4); box(0.5, 4, new THREE.Vector3(3.5, 0.6, -1.8), 1.0);
  const pm = new THREE.PMREMGenerator(R), envRT = pm.fromScene(env, 0.035); pm.dispose(); sc.environment = envRT.texture; sc.environmentIntensity = 0.35;
  // what light there is besides the flame: a faint cold one from high behind (the shell's outline in the dark)
  const rim = new THREE.DirectionalLight(0xc8d4ff, 0.5); rim.position.set(-1.4, 0.9, -1.2); sc.add(rim);
  sc.add(new THREE.AmbientLight(0xffffff, 0.02));
  const cold = new THREE.DirectionalLight(0xdfe6ff, 0.12); cold.position.set(0.8, 1.6, 1.4); sc.add(cold);   // (a breath of grey light: the black and white stays black and white)
  // the floor: dark stone, matte, where the candle's light pools
  const floorY = -0.134;
  const fl = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.MeshStandardMaterial({ color: '#2c2b2a', roughness: 0.82 }));
  fl.rotation.x = -Math.PI / 2; fl.position.y = floorY; fl.receiveShadow = true; sc.add(fl);
  const pool = bloodPool(d.name, floorY + 0.0006); pool.rotation.y = -0.73; pool.position.x = 0.07; pool.position.z = 0.07; pool.receiveShadow = true; sc.add(pool);
  // the candle: beside the helmet, a hand's width from it, a little nearer us (a church candle: ivory wax, a pool of melt at
  // the top, a black wick)
  const C = new THREE.Vector3(-0.12, floorY, 0.26), WH = 0.15, WR = 0.032;
  const waxM = new THREE.MeshPhysicalMaterial({ color: '#efe7d6', roughness: 0.55, transmission: 0.0, sheen: 0.4, sheenColor: new THREE.Color('#ffd9a0'), emissive: new THREE.Color('#ff9a40'), emissiveIntensity: 0 });
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(WR, WR * 1.03, WH, 40, 1), waxM); wax.position.set(C.x, floorY + WH / 2, C.z); wax.receiveShadow = true; sc.add(wax);
  const melt = new THREE.Mesh(new THREE.CircleGeometry(WR * 0.86, 32), new THREE.MeshStandardMaterial({ color: '#f6eedc', roughness: 0.15 })); melt.rotation.x = -Math.PI / 2; melt.position.set(C.x, floorY + WH - 0.003, C.z); sc.add(melt);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0022, 0.016, 8), new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.9 })); wick.position.set(C.x, floorY + WH + 0.006, C.z); wick.rotation.z = 0.12; sc.add(wick);
  const tipY = floorY + WH + 0.013;
  // the flame: a bright core inside a warm body, a faint blue at its foot, a soft halo - drawn additively, never shaded
  const fGeo = (r, hh) => { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(new THREE.Vector2(r * Math.sin(Math.PI * Math.pow(u, 0.7)) * (1 - u * 0.35), u * hh)); } return new THREE.LatheGeometry(pts, 20); };
  const add = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  const flame = new THREE.Group(); flame.position.set(C.x, tipY - 0.004, C.z); sc.add(flame);
  const body = new THREE.Mesh(fGeo(0.0085, 0.045), add('#ff9a2e', 0.75)), core = new THREE.Mesh(fGeo(0.0045, 0.028), add('#fff3d0', 1)), foot = new THREE.Mesh(fGeo(0.0055, 0.012), add('#3a6dff', 0.5));
  core.position.y = 0.003; flame.add(body, core, foot);
  const hc = document.createElement('canvas'); hc.width = hc.height = 128; const hx = hc.getContext('2d'), hg = hx.createRadialGradient(64, 64, 0, 64, 64, 64);
  hg.addColorStop(0, 'rgba(255,200,120,0.55)'); hg.addColorStop(0.3, 'rgba(255,160,70,0.18)'); hg.addColorStop(1, 'rgba(255,140,50,0)'); hx.fillStyle = hg; hx.fillRect(0, 0, 128, 128);
  const haloT = new THREE.CanvasTexture(hc), halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloT, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.setScalar(0.16); halo.position.set(C.x, tipY + 0.022, C.z); sc.add(halo);
  // the light of it: warm, close, falling off fast - it lights the shell, glints in the lacquer and the visor, and
  // throws the helmet's shadow back across the floor
  const L = new THREE.PointLight(0xffa456, 0.42, 2.2, 2); L.position.set(C.x, tipY + 0.02, C.z); L.castShadow = true;
  L.shadow.mapSize.set(1024, 1024); L.shadow.camera.near = 0.01; L.shadow.camera.far = 2.5; L.shadow.bias = -0.0008; L.shadow.radius = 4; sc.add(L);
  // the smoke when it goes out: a thin grey thread rising and curling away
  const smk = [], smM = new THREE.SpriteMaterial({ map: haloT, color: 0x9a9a9a, transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < 26; i++) { const s = new THREE.Sprite(smM.clone()); s.visible = false; sc.add(s); smk.push({ s, t0: i * 0.07 }); }
  const cam = new THREE.PerspectiveCamera(31, 1, 0.02, 20); cam.position.set(1.0, 0.22, 0.95); cam.lookAt(0.06, -0.03, 0.08);
  let out = -1;
  return {
    /** f: how much of the flame is left (1 lit, 0 out); t: seconds, for the flicker */
    set(f, t) {
      const w = canvas.clientWidth || 420, hh = canvas.clientHeight || 420;
      if (canvas.width !== Math.round(w * R.getPixelRatio())) { R.setSize(w, hh, false); cam.aspect = w / hh; cam.updateProjectionMatrix(); }
      // the flicker: a slow breathing and a quick tremble, more of both as it gutters
      const gut = f < 0.35 ? (0.35 - f) / 0.35 : 0, n = Math.sin(t * 7.1) * 0.5 + Math.sin(t * 13.7 + 1.3) * 0.3 + Math.sin(t * 23.3) * 0.2;
      const k = Math.max(0, f * (1 + n * (0.06 + 0.3 * gut)) * (gut > 0.6 && Math.random() < 0.08 ? 0.4 : 1));
      flame.visible = k > 0.01; flame.scale.set(0.35 + 0.65 * k, 0.2 + 0.8 * k, 0.35 + 0.65 * k);
      flame.rotation.z = Math.sin(t * 3.3) * 0.05 + n * 0.03 * (1 + gut); flame.rotation.x = Math.sin(t * 2.7) * 0.04;
      halo.material.opacity = k; halo.scale.setScalar(0.06 + 0.11 * k);
      L.intensity = 0.42 * k * k; L.position.x = C.x + flame.rotation.z * -0.01;
      waxM.emissiveIntensity = 0.16 * k;   // (the wax glowing through, under the flame)
      if (f <= 0.001 && out < 0) out = t;
      if (out >= 0) {
        for (const p of smk) {
          const a = t - out - p.t0; if (a < 0 || a > 2.6) { p.s.visible = false; continue; }
          p.s.visible = true; const u = a / 2.6;
          p.s.position.set(C.x + Math.sin(a * 2.2 + p.t0 * 9) * 0.012 * (1 + u * 3), tipY + a * 0.09, C.z + Math.cos(a * 1.7 + p.t0 * 7) * 0.008 * (1 + u * 3));
          p.s.scale.setScalar(0.01 + u * 0.05); p.s.material.opacity = 0.22 * (1 - u) * Math.min(1, a * 4);
        }
      }
      R.render(sc, cam);
    },
    dispose() {
      sc.traverse((m) => { if (m.geometry) m.geometry.dispose(); const ms = m.material ? [].concat(m.material) : []; for (const x of ms) { for (const v of Object.values(x)) if (v && v.isTexture) v.dispose(); x.dispose(); } });
      envRT.dispose(); R.dispose(); R.forceContextLoss?.();
    },
  };
}
