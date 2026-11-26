// The afterlife (the driver career: your driver killed, mourned, weighed - ui/Reckoning.js - and sent on). A 3D place
// you walk in as the spirit you are now: HEAVEN - a floor of cloud under a sky of white gold, a marble way through it,
// pillars of light, motes drifting up, golden gates standing open at its end - or HELL - black rock split by rivers of
// lava, spires with red-hot tips, flames along the cracks, embers rising into a sky of smoke and blood. Your spirit: a
// glow with a heart of light and a trail (W/S or the up/down arrows to go, A/D or left/right to turn; the camera
// follows). At the end of the way, a portal for each of the drivers you could become - your team's, standing in its
// colours inside a ring of light - each held by spirits that are not theirs. Walk into one (E or Enter when close) and
// the exorcism begins (ui/Exorcism.js): cast them out and the body is yours - your career goes on as that driver. Fail
// and you are thrown back onto the way, to try again.
// What you hear and see on the way (career/Echoes.js, audio/AfterSound.js): in HELL, snippets of the arguments you were
// in, recalled - an accusing voice and your own answering, robotic, broken, from somewhere in the dark around you, their
// words hanging where they were said and flickering out (the deeds that sent you there first). In HEAVEN, nothing: no
// sound at all - only the newspapers that praised you, drifting along the way (come close to one to read it).
// showAfterlife({ heaven, sum, name, good, bad, life: { wins, podiums, starts }, mate, candidates: [{ id, name, number,
//   team, color, color2 }], audio, onDone(id | null) })
import * as THREE from 'three';
import { makePerson } from '../world/People.js';
import { runExorcism } from './Exorcism.js';
import { afterSound } from '../audio/AfterSound.js';
import { hellEchoes, spite, headlines } from '../career/Echoes.js';

const CSS = `
#afterlife { position: fixed; inset: 0; z-index: 62; background: #000; opacity: 0; transition: opacity 1.6s ease; overflow: hidden; font-family: Georgia, 'Times New Roman', serif; color: #fff; }
#afterlife.show { opacity: 1; }
#afterlife canvas.al3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#afterlife .al-title { position: absolute; left: 0; right: 0; top: 34%; text-align: center; font-size: clamp(40px, 9vw, 88px); letter-spacing: .3em; opacity: 0; transition: opacity 2.4s ease; pointer-events: none; }
#afterlife.heaven .al-title { color: #fffaf0; text-shadow: 0 0 30px rgba(255,236,170,.9), 0 2px 8px rgba(90,66,16,.5); -webkit-text-stroke: 1px rgba(138,106,32,.6); }
#afterlife.hell .al-title { color: #ff6a2a; text-shadow: 0 0 26px rgba(255,60,0,.85); }
#afterlife .al-title.in { opacity: 1; }
#afterlife .al-hint { position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); padding: 10px 18px; border-radius: 8px; font: 600 13px/1.4 system-ui, sans-serif; letter-spacing: .04em; text-align: center; max-width: min(640px, 92vw);
  background: rgba(0,0,0,.42); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(6px); transition: opacity .4s; }
#afterlife.heaven .al-hint { color: #3a2e14; background: rgba(255,250,235,.62); border-color: rgba(138,106,32,.35); }
#afterlife .al-hint b { color: inherit; } #afterlife .al-hint kbd { font: 700 11px/1 system-ui; padding: 3px 6px; border-radius: 4px; border: 1px solid currentColor; margin: 0 2px; background: transparent; color: inherit; box-shadow: none; }
#afterlife .al-near { position: absolute; left: 50%; top: 18%; transform: translateX(-50%); padding: 10px 16px; border-radius: 10px; text-align: center; font: 700 14px/1.4 system-ui, sans-serif; background: rgba(0,0,0,.55); border: 1px solid var(--c, #fff); box-shadow: 0 0 24px -4px var(--c, #fff); opacity: 0; transition: opacity .3s; pointer-events: none; }
#afterlife .al-near.in { opacity: 1; } #afterlife .al-near small { display: block; font-weight: 500; opacity: .8; margin-top: 3px; }
#afterlife.exo .al-hint, #afterlife.exo .al-near, #afterlife.exo .al-paper { opacity: 0 !important; visibility: hidden; }
#afterlife .al-paper { position: absolute; left: 50%; bottom: 92px; transform: translate(-50%, 10px); width: min(560px, 90vw); padding: 16px 22px 18px; border-radius: 4px; color: #1d1a14; background: #f4efe2; box-shadow: 0 18px 50px -12px rgba(90,66,16,.55), 0 0 0 1px rgba(90,66,16,.25); opacity: 0; transition: opacity .5s, transform .5s; pointer-events: none; }
#afterlife .al-paper.in { opacity: 1; transform: translate(-50%, 0); }
#afterlife .al-paper i { display: block; font: 700 11px/1 Georgia, serif; letter-spacing: .3em; text-align: center; padding-bottom: 8px; border-bottom: 3px double #1d1a14; }
#afterlife .al-paper b { display: block; margin: 12px 0 8px; font: 900 clamp(20px, 2.6vw, 28px)/1.1 Georgia, 'Times New Roman', serif; }
#afterlife .al-paper span { display: block; font: italic 15px/1.45 Georgia, serif; color: #4a4232; }
#afterlife .al-fade { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; transition: opacity .8s ease; }
#afterlife.hell .al-fade { background: #300; }
#afterlife .al-fade.in { opacity: 1; }
`;
let injected = false;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

/** a soft round sprite texture (a cloud's puff, a mote, an ember, a flame) */
function softTex(inner, outer = 'rgba(255,255,255,0)') {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(1, outer); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** a name over a portal */
function labelTex(name, sub, col) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; const g = cv.getContext('2d');
  g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.shadowColor = col; g.shadowBlur = 18; g.fillStyle = '#ffffff'; g.fillText(name, 256, 64);
  g.font = '28px system-ui, sans-serif'; g.shadowBlur = 8; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText(sub, 256, 108);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** a remembered line, as it hangs in the dark: broken into colours, the accuser's red, your own a cold white -> { tex, w } */
function echoTex(text, you) {
  const cv = document.createElement('canvas'), g = cv.getContext('2d'), font = `${you ? 'italic 600' : '700'} 50px ${you ? 'Georgia, serif' : '"Courier New", monospace'}`;
  g.font = font; const w = Math.min(2048, Math.ceil(g.measureText(text).width) + 60); cv.width = w; cv.height = 112; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.globalAlpha = 0.55; g.fillStyle = '#00e5ff'; g.fillText(text, w / 2 - 4, 56); g.fillStyle = '#ff0030'; g.fillText(text, w / 2 + 4, 58);
  g.globalAlpha = 1; g.shadowColor = you ? '#9fd8ff' : '#ff2000'; g.shadowBlur = 16; g.fillStyle = you ? '#e8f4ff' : '#ff5a3a'; g.fillText(text, w / 2, 56);
  for (let k = 0; k < 5; k++) { const y = Math.random() * 112; g.clearRect(0, y, w, 1 + Math.random() * 3); }   // (torn: lines of it missing)
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return { tex: t, w };
}
/** a newspaper's front page: its name, the headline, a picture, the columns */
function paperTex(P, name) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 680; const g = cv.getContext('2d');
  g.fillStyle = '#f4efe2'; g.fillRect(0, 0, 512, 680); const vg = g.createRadialGradient(256, 340, 200, 256, 340, 460); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(120,90,30,.22)'); g.fillStyle = vg; g.fillRect(0, 0, 512, 680);
  g.fillStyle = '#1d1a14'; g.textAlign = 'center'; g.font = '900 40px Georgia, serif'; g.fillText(P.paper, 256, 62);
  g.fillRect(28, 76, 456, 3); g.fillRect(28, 82, 456, 1); g.font = 'italic 15px Georgia, serif'; g.fillText('SPECIAL EDITION · IN MEMORIAM', 256, 102); g.fillRect(28, 112, 456, 1);
  // (the headline, wrapped)
  g.font = '900 38px Georgia, serif'; g.textAlign = 'left'; const words = P.head.split(' '), lines = []; let l = '';
  for (const w of words) { const t = l ? `${l} ${w}` : w; if (g.measureText(t).width > 450 && l) { lines.push(l); l = w; } else l = t; } lines.push(l);
  let y = 156; for (const L of lines.slice(0, 4)) { g.fillText(L, 30, y); y += 42; }
  // (the picture: a helmet in a frame)
  y += 6; g.fillStyle = '#cfc6b0'; g.fillRect(30, y, 200, 150); g.fillStyle = '#5a5240'; g.beginPath(); g.arc(130, y + 82, 46, Math.PI, 0); g.lineTo(176, y + 112); g.lineTo(84, y + 112); g.fill();
  g.fillStyle = '#f4efe2'; g.fillRect(96, y + 70, 64, 12); g.fillStyle = '#1d1a14'; g.font = 'italic 12px Georgia, serif'; g.fillText(name, 30, y + 168);
  // (the standfirst, then the columns of grey)
  g.font = 'italic 17px Georgia, serif'; const sw = P.sub.split(' '); let sl = '', sy = y + 16; const sL = [];
  for (const w of sw) { const t = sl ? `${sl} ${w}` : w; if (g.measureText(t).width > 236 && sl) { sL.push(sl); sl = w; } else sl = t; } sL.push(sl);
  for (const L of sL.slice(0, 7)) { g.fillText(L, 246, sy); sy += 21; }
  g.fillStyle = 'rgba(40,34,24,.35)'; for (let c = 0; c < 3; c++) for (let r = 0; r < 12; r++) { const yy = y + 196 + r * 14; if (yy > 660) break; g.fillRect(30 + c * 154, yy, 140 - (r % 5 === 4 ? 50 : Math.random() * 12), 6); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
/** the sky: a dome, its colour by height */
function skyDome(top, mid, bottom) {
  const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { a: { value: new THREE.Color(top) }, b: { value: new THREE.Color(mid) }, c: { value: new THREE.Color(bottom) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 a; uniform vec3 b; uniform vec3 c; varying vec3 vP; void main(){ float h = vP.y; vec3 col = h > 0.0 ? mix(b, a, pow(h, 0.6)) : mix(b, c, pow(-h, 0.5)); gl_FragColor = vec4(col, 1.0); }' });
  return new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), m);
}
/** a paper lit by its own page (the emissive the page itself, so it reads in the fog) */
function emissiveMap(m) { m.material.emissiveMap = m.material.map; m.material.emissive = new THREE.Color(0xffffff); m.material.emissiveIntensity = 0.35; }
/** HELL's floor: black rock, cracks full of moving lava */
function lavaFloor() {
  const m = new THREE.ShaderMaterial({ uniforms: { t: { value: 0 } },
    vertexShader: 'varying vec2 vU; varying vec3 vW; void main(){ vU = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform float t; varying vec3 vW;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      void main(){ vec2 p = vW.xz * 0.18; float a = n(p + vec2(t * 0.05, 0.0)) * 0.6 + n(p * 2.3 - vec2(0.0, t * 0.08)) * 0.4;
        float crack = smoothstep(0.47, 0.5, a) - smoothstep(0.5, 0.53, a); float glow = crack + 0.35 * smoothstep(0.3, 0.5, 1.0 - abs(a - 0.5) * 4.0) * (0.6 + 0.4 * sin(t * 2.0 + vW.x));
        vec3 rock = mix(vec3(0.05, 0.02, 0.02), vec3(0.12, 0.05, 0.04), n(p * 6.0));
        vec3 lava = mix(vec3(1.0, 0.25, 0.02), vec3(1.0, 0.75, 0.2), crack);
        float fade = smoothstep(150.0, 40.0, length(vW.xz));
        gl_FragColor = vec4(mix(rock, lava, clamp(glow, 0.0, 1.0)) * (0.35 + 0.65 * fade), 1.0); }` });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), m); g.rotation.x = -Math.PI / 2; return g;
}
/** a portal: a ring of light, a swirl inside it, the driver standing in it, spirits round them, the name over it */
function portal(c, i) {
  const G = new THREE.Group(), col = new THREE.Color(c.color || '#ffffff');
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.12, 12, 64), new THREE.MeshBasicMaterial({ color: col }));
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.42, 12, 64), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  const swirl = new THREE.Mesh(new THREE.CircleGeometry(2.1, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, c: { value: col } },
    vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform float t; uniform vec3 c; varying vec2 vU; void main(){ vec2 p = vU - 0.5; float r = length(p) * 2.0, a = atan(p.y, p.x); float s = 0.5 + 0.5 * sin(a * 5.0 + r * 9.0 - t * 2.5); gl_FragColor = vec4(mix(c, vec3(1.0), s * (1.0 - r) * 0.6), (0.25 + 0.35 * s) * smoothstep(1.0, 0.6, r)); }' }));
  ring.position.y = halo.position.y = swirl.position.y = 2.4; G.add(halo, ring, swirl);
  let P = null; try { P = makePerson({ pose: 'talk', kit: 'suit', color: c.color, accent: c.color2 || '#ffffff', cap: false, driver: c.name, teamName: c.team, jitter: 0 }); } catch (e) { P = null; }
  if (P) { P.group.position.set(0, 0.6, 0.3); P.group.rotation.y = Math.PI; G.add(P.group); }
  // (the spirits that hold the body: dark wisps going round it)
  const wisps = []; for (let k = 0; k < 5; k++) { const w = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex('rgba(30,0,20,.95)', 'rgba(60,0,30,0)'), transparent: true, depthWrite: false })); w.scale.setScalar(0.7); w.userData.ph = k / 5; G.add(w); wisps.push(w); }
  const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex(c.name, `#${c.number ?? ''} · ${c.team || ''}`, c.color || '#fff'), transparent: true, depthWrite: false })); lab.scale.set(5.2, 1.3, 1); lab.position.y = 5.4; G.add(lab);
  const light = new THREE.PointLight(col, 6, 12, 1.6); light.position.set(0, 2.4, 1); G.add(light);
  return { G, swirl, wisps, person: P, cand: c, i };
}

export function showAfterlife(o) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const heaven = !!o.heaven, el = document.createElement('div'); el.id = 'afterlife'; el.className = heaven ? 'heaven' : 'hell';
  el.innerHTML = `<canvas class="al3d"></canvas><div class="al-title">${heaven ? 'HEAVEN' : 'HELL'}</div><div class="al-near"></div><div class="al-paper"></div><div class="al-hint"></div><div class="al-fade"></div>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
  const hint = el.querySelector('.al-hint'), near = el.querySelector('.al-near'), fade = el.querySelector('.al-fade');
  let R; try { R = new THREE.WebGLRenderer({ canvas: el.querySelector('canvas'), antialias: true }); } catch (e) { R = null; }
  const finish = (id) => { cleanup(); el.classList.remove('show'); setTimeout(() => { el.remove(); o.onDone?.(id ?? null); }, 1500); };
  if (!R) { setTimeout(() => finish(o.candidates?.[0]?.id ?? null), 1200); return; }   // (no WebGL: straight on)
  R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
  sc.fog = heaven ? new THREE.Fog(0xfff3dc, 40, 190) : new THREE.Fog(0x1a0402, 25, 150);
  sc.add(heaven ? skyDome('#fff6dc', '#ffe3a8', '#ffffff') : skyDome('#0a0204', '#5a0c06', '#120202'));
  sc.add(new THREE.HemisphereLight(heaven ? 0xfff8e8 : 0xff6a3a, heaven ? 0xd8c8a0 : 0x200404, heaven ? 1.6 : 0.9));
  const sun = new THREE.DirectionalLight(heaven ? 0xfff0c8 : 0xff4a1a, heaven ? 2.2 : 1.2); sun.position.set(-30, 60, -40); sc.add(sun);
  const dyn = [];   // (what moves: { obj, f(t, dt) })
  const tex = heaven ? softTex('rgba(255,255,255,.95)') : softTex('rgba(255,140,40,1)', 'rgba(255,40,0,0)');
  if (heaven) {
    // the cloud floor: great soft puffs, drifting; the marble way through them; pillars of light; the gates; motes
    const cloud = softTex('rgba(255,255,255,.9)', 'rgba(255,250,240,0)');
    for (let k = 0; k < 260; k++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloud, transparent: true, depthWrite: false, opacity: 0.85, fog: true })); const r = 6 + Math.random() * 120, a = Math.random() * Math.PI * 2;
      s.position.set(Math.cos(a) * r, -1.2 - Math.random() * 2.5, Math.sin(a) * r - 30); if (Math.abs(s.position.x) < 16 && s.position.z > -100 && s.position.z < 12) s.position.x += Math.sign(s.position.x || 1) * 16; s.scale.setScalar(8 + Math.random() * 14); sc.add(s); dyn.push({ obj: s, f: (t) => { s.position.x += Math.sin(t * 0.1 + k) * 0.004; } }); }
    const way = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 90), new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.25, metalness: 0.1, emissive: 0x6a5a30, emissiveIntensity: 0.25 })); way.position.set(0, -0.15, -40); sc.add(way);
    for (let z = -6; z > -80; z -= 12) for (const x of [-6, 6]) { const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 40, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); pl.position.set(x, 19, z); sc.add(pl);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 6, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })); col.position.set(x, 3, z); sc.add(col); }
    const gold = new THREE.MeshStandardMaterial({ color: 0xd9b24a, metalness: 0.9, roughness: 0.25, emissive: 0x6a4a10, emissiveIntensity: 0.5 });
    for (const sx of [-1, 1]) { const arch = new THREE.Mesh(new THREE.TorusGeometry(7, 0.35, 12, 48, Math.PI), gold); arch.position.set(0, 9, -96); sc.add(arch);
      const door = new THREE.Group(); for (let b = 0; b < 7; b++) { const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9, 8), gold); bar.position.set(sx * (0.5 + b * 0.95), 4.5, 0); door.add(bar); }
      door.position.set(sx * 0.2, 0, -96); door.rotation.y = sx * 1.25; sc.add(door); }
  } else {
    // the rock and its lava; spires with red-hot tips; flames along the cracks; embers rising
    const floor = lavaFloor(); sc.add(floor); dyn.push({ obj: floor, f: (t) => { floor.material.uniforms.t.value = t; } });
    const rock = new THREE.MeshStandardMaterial({ color: 0x1a0a08, roughness: 0.95, emissive: 0x2a0400, emissiveIntensity: 0.4 });
    for (let k = 0; k < 70; k++) { const h = 6 + Math.random() * 26, sp = new THREE.Mesh(new THREE.ConeGeometry(1.2 + Math.random() * 3, h, 7), rock); const a = Math.random() * Math.PI * 2, r = 14 + Math.random() * 110;
      sp.position.set(Math.cos(a) * r, h / 2 - 0.5, Math.sin(a) * r - 30); if (Math.abs(sp.position.x) < 8 && sp.position.z < 4 && sp.position.z > -95) continue; sc.add(sp); }
    const flame = softTex('rgba(255,200,80,1)', 'rgba(255,30,0,0)');
    for (let k = 0; k < 90; k++) { const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true })); const x = (Math.random() - 0.5) * 120, z = -Math.random() * 120 + 10;
      if (Math.abs(x) < 4) continue; f.position.set(x, 1, z); const s0 = 1.5 + Math.random() * 2.5; sc.add(f); dyn.push({ obj: f, f: (t) => { const k2 = 0.75 + 0.25 * Math.sin(t * 9 + x * 3) + 0.1 * Math.sin(t * 23 + z); f.scale.set(s0 * 0.7, s0 * 1.6 * k2, 1); f.position.y = s0 * 0.7 * k2; } }); }
    const path = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 90), new THREE.MeshStandardMaterial({ color: 0x140806, roughness: 0.9, emissive: 0x3a0800, emissiveIntensity: 0.6 })); path.position.set(0, 0.1, -40); sc.add(path);
    const iron = new THREE.MeshStandardMaterial({ color: 0x2a1a16, metalness: 0.8, roughness: 0.5, emissive: 0x5a0a00, emissiveIntensity: 0.4 });
    const arch = new THREE.Mesh(new THREE.TorusGeometry(7, 0.5, 8, 24, Math.PI), iron); arch.position.set(0, 9, -96); sc.add(arch);
  }
  // what you hear (Hell: its air, and the echoes - the arguments you were in) and what you read (Heaven: the papers)
  const snd = afterSound(o.audio), echoes = heaven ? [] : hellEchoes({ bad: o.bad, name: o.name, mate: o.mate }), lines = [];
  let echoAt = 3.6, echoK = 0;
  if (!heaven) snd.drone(0.6);
  const papers = [];
  if (heaven) {
    const H = headlines({ good: o.good, name: o.name, life: o.life || {} });
    for (let i = 0; i < Math.max(8, H.length * 2) && i < 14; i++) {
      const P = H[i % H.length], side = i % 2 ? 1 : -1, m = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.8), new THREE.MeshStandardMaterial({ map: paperTex(P, o.name || ''), side: THREE.DoubleSide, roughness: 0.9, emissive: 0xffffff, emissiveIntensity: 0.12 }));
      emissiveMap(m); m.position.set(side * (3.9 + Math.random() * 1.8), 2 + Math.random() * 1.3, -6 - i * 6.2 - Math.random() * 2); m.rotation.y = -side * 0.75; sc.add(m);
      const ph = Math.random() * 6, y0 = m.position.y, r0 = m.rotation.y; papers.push({ m, P });
      dyn.push({ obj: m, f: (t) => { m.position.y = y0 + Math.sin(t * 0.7 + ph) * 0.25; m.rotation.y = r0 + Math.sin(t * 0.4 + ph) * 0.25; m.rotation.z = Math.sin(t * 1.3 + ph) * 0.06; m.rotation.x = Math.sin(t * 0.9 + ph) * 0.08; } });
    }
  }
  // the motes or embers, rising
  const N = heaven ? 300 : 420, pos = new Float32Array(N * 3), vel = new Float32Array(N);
  for (let k = 0; k < N; k++) { pos[k * 3] = (Math.random() - 0.5) * 140; pos[k * 3 + 1] = Math.random() * 30; pos[k * 3 + 2] = -Math.random() * 130 + 20; vel[k] = (heaven ? 0.3 : 1.5) + Math.random() * (heaven ? 0.6 : 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ map: tex, size: heaven ? 0.5 : 0.32, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: heaven ? 0xffe7a0 : 0xff7a2a })); sc.add(pts);
  // your spirit
  const me = new THREE.Group(); const core = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), new THREE.MeshBasicMaterial({ color: heaven ? 0xffffff : 0xffd0b0 }));
  const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(heaven ? 'rgba(255,240,200,.95)' : 'rgba(200,230,255,.9)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); aura.scale.setScalar(2.6);
  const glow = new THREE.PointLight(heaven ? 0xfff0c0 : 0xbfe0ff, 4, 9, 1.8); me.add(core, aura, glow); me.position.set(0, 1.4, 4); sc.add(me);
  const trail = []; for (let k = 0; k < 14; k++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: aura.material.map, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 * (1 - k / 14) })); s.scale.setScalar(1.4 * (1 - k / 16)); sc.add(s); trail.push(s); }
  // the portals: in an arc at the end of the way
  const C = o.candidates || [], ports = C.map((c, i) => { const p = portal(c, i), n = C.length; p.G.position.set((i - (n - 1) / 2) * 7.5, 0.3, -62 - Math.abs(i - (n - 1) / 2) * 2); p.G.lookAt(0, 0.3, 4); sc.add(p.G); return p; });   // (across the end of the way, facing you)
  // the controls
  const keys = new Set(); let heading = Math.PI, mode = 'walk', t = 0, last = performance.now(), raf = 0, nearP = null;
  const kd = (e) => { if (mode !== 'walk') return; const k = e.key.toLowerCase(); keys.add(k); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault(); if ((k === 'e' || k === 'enter') && nearP) enter(nearP); e.stopPropagation(); };
  const ku = (e) => { keys.delete(e.key.toLowerCase()); };
  window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);
  const fit = () => { const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; fit(); addEventListener('resize', fit);
  const setHint = () => { hint.innerHTML = C.length ? `Your spirit is not finished. Walk to the one you will become: <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the arrows - <kbd>E</kbd> at a portal.${heaven ? '' : ' Here, they will not let go easily.'}` : 'There is nobody left to become. <kbd>E</kbd> to let go.'; };
  setHint(); setTimeout(() => el.querySelector('.al-title').classList.add('in'), 600); setTimeout(() => el.querySelector('.al-title').classList.remove('in'), 4200);
  const camPos = new THREE.Vector3(0, 4, 12), look = new THREE.Vector3(0, 1.5, -10);
  el.__al = { place: (x, z) => { me.position.set(x, 1.4, z); }, echo: () => { echoAt = 0; } };   // (a test's: the spirit put somewhere; an echo now)
  const right = new THREE.Vector3();
  /** an echo: the next argument, said around you - each line from near the last, the accuser and you in turn */
  function playEcho() {
    const X = echoes[echoK++ % echoes.length]; if (!X) return 6;
    const a = Math.random() < 0.75 ? Math.PI / 2 - heading + (Math.random() - 0.5) * 2 : Math.random() * Math.PI * 2, d = 7 + Math.random() * 8, f0 = 120 + Math.random() * 70;   // (mostly ahead of you, where the words can be seen; sometimes behind)
    const base = new THREE.Vector3(me.position.x + Math.cos(a) * d, 2 + Math.random() * 2.5, me.position.z + Math.sin(a) * d);
    let at = 0;
    X.forEach(([who, line], i) => {
      const you = who === 'you', p = base.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 4));
      cam.getWorldDirection(right); right.cross(cam.up).normalize(); const rel = p.clone().sub(cam.position), dist = rel.length(), pan = Math.max(-1, Math.min(1, rel.normalize().dot(right) * 1.3));
      const len = snd.voice(line, { f0: you ? 92 : f0, rate: you ? 0.95 : 1.05, ring: you ? 63 : 34, dist: you ? 0.9 : 0.65, gain: 0.55 * Math.min(1.2, 9 / Math.max(4, dist)), pan, delay: at, say: i === 0 }) || (0.4 + line.length * 0.055);
      const { tex, w } = echoTex(line, you), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0, fog: false })); sp.scale.set(0.8 * w / 112, 0.8, 1); sp.position.copy(p); sc.add(sp);
      lines.push({ sp, t0: t + at, t1: t + at + len + 1.4 });
      at += Math.max(0.5, len - 0.25);   // (they talk over each other: an argument)
    });
    return at + 3 + Math.random() * 4;
  }

  const exo = { v: 0, phase: 'ritual', u: 0, flies: [] };
  /** a spirit going into the body, or out of it, as it pleases (after the exorcism) */
  function fly(p) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(heaven ? 'rgba(40,30,60,.85)' : 'rgba(30,0,10,.95)', 'rgba(60,0,30,0)'), transparent: true, depthWrite: false })); s.scale.setScalar(0.9);
    const a = Math.random() * Math.PI * 2, far = new THREE.Vector3(Math.cos(a) * 3.5, 1.5 + Math.random() * 2.5, Math.sin(a) * 3.5 + 0.3), body = new THREE.Vector3(0, 1.7, 0.3), into = Math.random() < 0.5;
    p.G.add(s); exo.flies.push({ s, from: into ? far : body, to: into ? body : far, t0: t, d: 1.1 + Math.random() * 0.6 });
  }
  function enter(p) {
    exo.v = 0; exo.phase = 'ritual'; exo.u = 0;
    mode = 'exorcism'; keys.clear(); near.classList.remove('in'); hint.style.opacity = '0'; el.classList.add('exo'); me.visible = false; for (const s of trail) s.visible = false;
    runExorcism({ host: el, heaven, sum: o.sum || 0, name: p.cand.name, color: p.cand.color, audio: o.audio, snd, spite: spite({ bad: o.bad, heaven, name: o.name, body: p.cand.name }),
      onSpirit: (k) => { const w = p.wisps[k % p.wisps.length]; if (w) w.userData.gone = t; },
      onLevel: (v, ph, u) => { if (ph === 'spirit') { fly(p); return; } exo.v = v; exo.phase = ph; exo.u = u; },
      onDone: (ok) => {
        if (ok) { fade.classList.add('in'); setTimeout(() => finish(p.cand.id), 900); return; }
        for (const w of p.wisps) w.userData.gone = null;
        exo.v = 0; exo.phase = 'ritual'; if (p.person) { p.person.group.rotation.set(0, Math.PI, 0); p.person.group.position.set(0, 0.6, 0.3); } echoAt = 2.5;
        mode = 'walk'; hint.style.opacity = '1'; el.classList.remove('exo'); me.visible = true; for (const s of trail) s.visible = true; me.position.set(0, 1.4, 4); heading = Math.PI; setHint();
        hint.innerHTML = `The spirits held on. You are thrown back. ${hint.innerHTML}`;
      } });
  }
  if (!C.length) { const kOnce = (e) => { if (e.key === 'e' || e.key === 'Enter') { window.removeEventListener('keydown', kOnce, true); finish(null); } }; window.addEventListener('keydown', kOnce, true); }
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (mode === 'walk') {
      const turn = (keys.has('a') || keys.has('arrowleft') ? 1 : 0) - (keys.has('d') || keys.has('arrowright') ? 1 : 0), go = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 0.6 : 0);
      heading += turn * dt * 1.9; const sp = 9 * go * dt; me.position.x += Math.sin(heading) * sp; me.position.z += Math.cos(heading) * sp;
      me.position.x = Math.max(-40, Math.min(40, me.position.x)); me.position.z = Math.max(-100, Math.min(14, me.position.z));
      me.position.y = 1.4 + Math.sin(t * 2.2) * 0.15;
      // the camera: behind and above, easing after
      const want = new THREE.Vector3(me.position.x - Math.sin(heading) * 7, me.position.y + 2.6, me.position.z - Math.cos(heading) * 7);
      camPos.lerp(want, 1 - Math.exp(-dt * 4)); look.lerp(new THREE.Vector3(me.position.x + Math.sin(heading) * 6, 1.6, me.position.z + Math.cos(heading) * 6), 1 - Math.exp(-dt * 5));
      // the nearest portal within reach
      nearP = null; let best = 6.5; for (const p of ports) { const d = Math.hypot(p.G.position.x - me.position.x, p.G.position.z - me.position.z); if (d < best) { best = d; nearP = p; } }
      if (nearP) { near.style.setProperty('--c', nearP.cand.color || '#fff'); near.innerHTML = `${esc(nearP.cand.name)}<small>E to take this body</small>`; near.classList.add('in'); } else near.classList.remove('in');
      // (Hell: the next echo, when it is time; Heaven: the paper you are next to, read)
      if (echoes.length) { echoAt -= dt; if (echoAt <= 0) echoAt = playEcho(); }
      if (papers.length) { let bp = null, bd = 4.6; for (const q of papers) { const dd = Math.hypot(q.m.position.x - me.position.x, q.m.position.z - me.position.z); if (dd < bd) { bd = dd; bp = q; } }
        const pe = el.querySelector('.al-paper'); if (bp && !nearP) { if (pe.dataset.k !== bp.P.head) { pe.dataset.k = bp.P.head; pe.innerHTML = `<i>${esc(bp.P.paper)}</i><b>${esc(bp.P.head)}</b><span>${esc(bp.P.sub)}</span>`; } pe.classList.add('in'); } else pe.classList.remove('in'); }
    } else if (mode === 'exorcism' && nearP) {
      // (close on the body being fought for)
      const p = nearP.G.position, f = new THREE.Vector3(0, 0, 1).applyQuaternion(nearP.G.quaternion);
      const close = exo.phase === 'ritual' ? 6.5 - exo.v * 1.6 : exo.phase === 'top' ? 4.4 : 4.8;   // (closing in as it builds)
      camPos.lerp(new THREE.Vector3(p.x + f.x * close, 2.6 + (exo.phase === 'top' ? -0.3 : 0), p.z + f.z * close), 1 - Math.exp(-dt * 2.5)); look.lerp(new THREE.Vector3(p.x, 2.1, p.z), 1 - Math.exp(-dt * 3));
    }
    // (the body fought for: shaking with the ritual, thrashing at its top; then slumped, weak, a tremble, slowly lifting)
    if (mode === 'exorcism' && nearP?.person) {
      const B = nearP.person.group, v = exo.v, q = exo.phase;
      if (q === 'ritual' || q === 'top' || q === 'fail') {
        const a = v * v * (q === 'top' ? 0.32 : 0.2), j = () => (Math.random() - 0.5) * 2;
        B.position.set(j() * a, 0.6 + Math.abs(j()) * a * 0.8, 0.3 + j() * a * 0.5); B.rotation.set(j() * a * 1.6, Math.PI + j() * a * 2.2, j() * a * 1.8);
      } else {
        const slump = q === 'fizzle' ? Math.min(1, exo.u / 1.2) : Math.max(0.25, 1 - exo.u * 0.16), tr = (Math.random() - 0.5) * 0.012 * (q === 'fizzle' ? 1 - exo.u / 3 : 1);
        B.position.set(tr, 0.6 - slump * 0.32, 0.3 + slump * 0.12); B.rotation.set(slump * 0.42 + tr, Math.PI + tr, tr * 2);
      }
      nearP.wisps.forEach((w) => { if (w.userData.gone == null) w.scale.setScalar(0.7 + v * 0.6); });
      const sh = v * v * (exo.phase === 'top' ? 0.35 : 0.12); camPos.x += (Math.random() - 0.5) * sh; camPos.y += (Math.random() - 0.5) * sh;
    }
    cam.position.copy(camPos); cam.lookAt(look);
    // (the echoes' words: fading in, flickering, out; the spirits coming and going)
    for (let k = lines.length - 1; k >= 0; k--) { const L = lines[k], u = t - L.t0; if (u < 0) continue; const left = L.t1 - t;
      if (left <= 0) { sc.remove(L.sp); L.sp.material.map.dispose(); L.sp.material.dispose(); lines.splice(k, 1); continue; }
      L.sp.material.opacity = Math.min(1, u * 4, left / 0.8) * (Math.random() < 0.08 ? 0.15 : 0.75 + Math.random() * 0.25); L.sp.position.y += dt * 0.12; }
    for (let k = exo.flies.length - 1; k >= 0; k--) { const F = exo.flies[k], u = (t - F.t0) / F.d; if (u >= 1) { F.s.parent?.remove(F.s); F.s.material.map.dispose(); F.s.material.dispose(); exo.flies.splice(k, 1); continue; }
      F.s.position.lerpVectors(F.from, F.to, u * u * (3 - 2 * u)); F.s.material.opacity = Math.sin(u * Math.PI) * 0.95; }
    for (let k = trail.length - 1; k > 0; k--) trail[k].position.copy(trail[k - 1].position); trail[0].position.copy(me.position);
    aura.material.rotation = t * 0.3; aura.scale.setScalar(2.4 + Math.sin(t * 3) * 0.2);
    for (let k = 0; k < N; k++) { pos[k * 3 + 1] += vel[k] * dt; if (!heaven) pos[k * 3] += Math.sin(t * 2 + k) * dt * 0.6; if (pos[k * 3 + 1] > 32) pos[k * 3 + 1] = 0; } pg.attributes.position.needsUpdate = true;
    for (const p of ports) {
      p.swirl.material.uniforms.t.value = t;
      p.wisps.forEach((w, k) => { const g = w.userData.gone; if (g != null) { const u = Math.min(1, (t - g) / 1.2); w.position.y += dt * 6; w.material.opacity = 1 - u; return; }
        const a = t * (heaven ? 1.2 : 2.2) * (mode === 'exorcism' && p === nearP ? 1 + exo.v * 3 : 1) + w.userData.ph * Math.PI * 2; w.position.set(Math.cos(a) * 0.9, 1.6 + Math.sin(a * 2) * 0.6 + 0.6, Math.sin(a) * 0.9 + 0.3); w.material.opacity = 0.9; });
      if (p.person && !(mode === 'exorcism' && p === nearP)) p.person.group.position.y = 0.6 + Math.sin(t * 1.4 + p.i) * 0.08;
    }
    for (const d of dyn) d.f(t, dt);
    R.render(sc, cam); raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  function cleanup() {
    snd.stop(1.2); cancelAnimationFrame(raf); window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true); removeEventListener('resize', fit);
    sc.traverse((m) => { m.geometry?.dispose?.(); const ms = m.material ? [].concat(m.material) : []; for (const x of ms) { x.map?.dispose?.(); x.dispose?.(); } });
    R.dispose(); R.forceContextLoss?.();
  }
}
