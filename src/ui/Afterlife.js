// The afterlife (the driver career: your driver killed, mourned, weighed - ui/Reckoning.js - and sent on). A 3D place
// you walk in as the spirit you are now: HEAVEN - a floor of cloud under a sky of white gold, a marble way through it,
// pillars of light, motes drifting up, golden gates standing open at its end - or HELL - black rock split by rivers of
// lava, spires with red-hot tips, flames along the cracks, embers rising into a sky of smoke and blood. Your spirit: a
// glow with a heart of light and a trail (W/S or the up/down arrows to go, A/D or left/right to turn; the camera
// follows). At the end of the way, a portal for each of the drivers you could become - your team's, standing in its
// colours inside a ring of light - each held by spirits that are not theirs. Walk into one (E or Enter when close) and
// the exorcism begins (ui/Exorcism.js): cast them out and the body is yours - your career goes on as that driver. Fail
// and you are thrown back onto the way, to try again.
// HELL is not a way but a place (ui/HellLife.js): no path - an open dark of rock and lava, the portals somewhere in it,
// found by their hum (louder as you near one, panned to where it is). The damned hang on chains from the dark, dripping
// into pools of blood; bones in heaps; rats running over the rock in packs, scattering from you, squealing. And THEY are
// there: tall, thin, black, a pale mask for a face - turning their heads to follow you, all the way round; still while
// you look at them, closer each time you look away; too close, and one is in your face. What you hear (career/Echoes.js,
// audio/AfterSound.js): snippets of the arguments you were in, recalled - an accusing voice and your own answering,
// robotic, broken, from somewhere in the dark around you (sound only, no words on the screen). In HEAVEN, nothing: no
// sound at all - only the newspapers that praised you, drifting along the way.
// showAfterlife({ heaven, sum, name, good, bad, life: { wins, podiums, starts }, mate, candidates: [{ id, name, number,
//   team, color, color2 }], audio, onDone(id | null) })
import * as THREE from 'three';
import { runExorcism } from './Exorcism.js';
import { afterSound } from '../audio/AfterSound.js';
import { stalker, rats, gore, doll, monsterHead, faceCanvas } from './HellLife.js';
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
#afterlife .al-scare { position: absolute; inset: 0; pointer-events: none; opacity: 0; background: radial-gradient(circle at 50% 50%, rgba(160,0,0,.05) 25%, rgba(90,0,0,.92) 95%); }
#afterlife .al-scare.on { animation: alScare .8s steps(4) both; }
@keyframes alScare { 0% { opacity: 1; background-color: rgba(255,255,255,.35); } 25% { opacity: 1; background-color: rgba(160,0,0,.35); } 50% { opacity: .2; } 75% { opacity: .9; background-color: rgba(120,0,0,.25); } 100% { opacity: 0; } }
/* (HELL on tape: grain, scanlines, a tracking bar rolling through, the picture tearing at a scare) */
#afterlife .al-vhs { position: absolute; inset: 0; pointer-events: none; display: none; }
#afterlife.hell .al-vhs, #afterlife.exo .al-vhs { display: block; }
#afterlife .al-vhs canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .07; mix-blend-mode: screen; }
#afterlife .al-vhs::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(180deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.65) 100%); }
#afterlife .al-vhs .trk { position: absolute; left: 0; right: 0; height: 9%; top: -12%; background: linear-gradient(180deg, transparent, rgba(255,255,255,.1) 40%, rgba(255,255,255,.18) 50%, rgba(255,255,255,.08) 60%, transparent); filter: blur(1px); }
#afterlife .al-vhs .trk.on { animation: alTrk 1.6s linear; }
@keyframes alTrk { from { top: -12%; } to { top: 108%; } }
#afterlife.glitch canvas.al3d { animation: alGl .18s steps(3) 2; }
@keyframes alGl { 0% { transform: translate(-14px, 0) skewX(6deg); filter: contrast(1.8) hue-rotate(40deg) saturate(2); } 50% { transform: translate(10px, 3px) skewX(-4deg); filter: contrast(2.2) invert(.15); } 100% { transform: none; filter: none; } }
#afterlife canvas.al-sub { position: absolute; left: 50%; top: 50%; height: 118vh; transform: translate(-50%, -50%); pointer-events: none; opacity: 0; filter: contrast(1.6) brightness(1.1); }
#afterlife canvas.al-sub.on { opacity: 1; }
#afterlife .al-hint.gone { opacity: 0 !important; transition: opacity 2s; }
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
  // (the driver as a doll: ball-jointed porcelain in their racing suit, their number on it, hanging on a marionette's strings)
  const D = doll({ color: c.color, color2: c.color2, number: c.number }); D.G.position.set(0, 0.75, 0.3); G.add(D.G);
  // (the spirits that hold the body: dark wisps going round it)
  const wisps = []; for (let k = 0; k < 5; k++) { const w = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex('rgba(30,0,20,.95)', 'rgba(60,0,30,0)'), transparent: true, depthWrite: false })); w.scale.setScalar(0.7); w.userData.ph = k / 5; G.add(w); wisps.push(w); }
  const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex(c.name, `#${c.number ?? ''} · ${c.team || ''}`, c.color || '#fff'), transparent: true, depthWrite: false })); lab.scale.set(5.2, 1.3, 1); lab.position.y = 5.4; G.add(lab);
  const light = new THREE.PointLight(col, 6, 12, 1.6); light.position.set(0, 2.4, 1); G.add(light);
  return { G, swirl, wisps, doll: D, cand: c, i, frame: [ring, halo, swirl, lab] };
}

export function showAfterlife(o) {
  if (!injected) { const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); injected = true; }
  const heaven = !!o.heaven, el = document.createElement('div'); el.id = 'afterlife'; el.className = heaven ? 'heaven' : 'hell';
  el.innerHTML = `<canvas class="al3d"></canvas><div class="al-title">${heaven ? 'HEAVEN' : 'HELL'}</div><div class="al-near"></div><div class="al-hint"></div><div class="al-scare"></div><div class="al-vhs"><canvas></canvas><i class="trk"></i></div><canvas class="al-sub"></canvas><div class="al-fade"></div>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
  const hint = el.querySelector('.al-hint'), near = el.querySelector('.al-near'), fade = el.querySelector('.al-fade');
  let R; try { R = new THREE.WebGLRenderer({ canvas: el.querySelector('canvas'), antialias: true }); } catch (e) { R = null; }
  const finish = (id) => { cleanup(); el.classList.remove('show'); setTimeout(() => { el.remove(); o.onDone?.(id ?? null); }, 1500); };
  if (!R) { setTimeout(() => finish(o.candidates?.[0]?.id ?? null), 1200); return; }   // (no WebGL: straight on)
  R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
  sc.fog = heaven ? new THREE.Fog(0xfff3dc, 40, 190) : new THREE.Fog(0x160302, 6, 68);
  // (Hell: the portals somewhere in the dark, spread round you - not ahead of you, not at the end of anything)
  const C = o.candidates || [], a0 = Math.random() * Math.PI * 2;
  const spots = heaven ? null : C.map((c, i) => { const a = a0 + i * (Math.PI * 2 / Math.max(2, C.length)) + (Math.random() - 0.5) * 0.8, r = 34 + Math.random() * 18; return [Math.sin(a) * r, Math.cos(a) * r]; });
  const rocks = [];   // (Hell's spires [x, z, base radius, height]: the spirit goes round them, the camera never inside one)
  /** inside a spire at height y (with a margin)? */
  const inRock = (x, z, y, m = 0.4) => rocks.some(([rx, rz, rb, h]) => { const rr = rb * Math.max(0, 1 - (y + 0.5) / h) + m; return Math.abs(x - rx) < rr && Math.hypot(x - rx, z - rz) < rr; });
  const clear = (x, z, r = 7) => Math.hypot(x, z - 4) < r || (spots || []).some(([px, pz]) => Math.hypot(x - px, z - pz) < r);
  sc.add(heaven ? skyDome('#fff6dc', '#ffe3a8', '#ffffff') : skyDome('#0a0204', '#5a0c06', '#120202'));
  const hemi = new THREE.HemisphereLight(heaven ? 0xfff8e8 : 0xff6a3a, heaven ? 0xd8c8a0 : 0x200404, heaven ? 1.6 : 0.9); sc.add(hemi);
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
    for (let k = 0; k < 85; k++) { const h = 6 + Math.random() * 26, rb = 1.2 + Math.random() * 3, sp = new THREE.Mesh(new THREE.ConeGeometry(rb, h, 7), rock); const a = Math.random() * Math.PI * 2, r = 9 + Math.random() * 100;
      sp.position.set(Math.cos(a) * r, h / 2 - 0.5, Math.sin(a) * r); if (clear(sp.position.x, sp.position.z, 9)) continue; sc.add(sp); rocks.push([sp.position.x, sp.position.z, rb, h]); }
    const flame = softTex('rgba(255,200,80,1)', 'rgba(255,30,0,0)');
    for (let k = 0; k < 90; k++) { const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flame, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true })); const x = (Math.random() - 0.5) * 140, z = (Math.random() - 0.5) * 140;
      if (clear(x, z, 5)) continue; f.position.set(x, 1, z); const s0 = 1.5 + Math.random() * 2.5; sc.add(f); dyn.push({ obj: f, f: (t) => { const k2 = 0.75 + 0.25 * Math.sin(t * 9 + x * 3) + 0.1 * Math.sin(t * 23 + z); f.scale.set(s0 * 0.7, s0 * 1.6 * k2, 1); f.position.y = s0 * 0.7 * k2; } }); }
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
  // HELL's own (ui/HellLife.js): the blood, the hanging dead, the bones; the rats; the things that watch
  const G0 = heaven ? null : gore(sc, (x, z) => clear(x, z, 6));
  const RAT = heaven ? null : rats(170, { r: 62 }); if (RAT) sc.add(RAT.mesh);
  const ST = heaven ? [] : Array.from({ length: 7 }, () => { const m = stalker(); let x = 0, z = 0; for (let k = 0; k < 30; k++) { const a = Math.random() * Math.PI * 2, r = 16 + Math.random() * 40; x = Math.sin(a) * r; z = Math.cos(a) * r; if (!clear(x, z, 8)) break; } m.G.position.set(x, 0, z); sc.add(m.G); return m; });
  let scareCool = 14, scare = null, breathAt = 2, squeakAt = 1;
  // (the faces in the dark: pale masks hanging in the fog at head height everywhere, watching - gone when you come near)
  const FACES = [];
  if (!heaven) { const ft = new THREE.CanvasTexture(faceCanvas()); ft.colorSpace = THREE.SRGBColorSpace;
    for (let k = 0; k < 46; k++) { const a = Math.random() * Math.PI * 2, r = 22 + Math.random() * 46, f = new THREE.Sprite(new THREE.SpriteMaterial({ map: ft, transparent: true, depthWrite: false, fog: false, opacity: 0 }));
      f.position.set(Math.sin(a) * r, 3.2 + Math.random() * 3, Math.cos(a) * r); f.scale.set(0.5, 0.67, 1); f.userData.o = 0.25 + Math.random() * 0.45; sc.add(f); FACES.push(f); } }
  // (the scares' clocks: a face flashing on the screen, one standing at the edge of the light, the dark, your name in your ear)
  let subAt = 9 + Math.random() * 10, appearAt = 18 + Math.random() * 15, blackAt = 25 + Math.random() * 20, earAt = 14 + Math.random() * 12, heartAt = 1, black = 0, appear = null, trkAt = 3;
  const subEl = el.querySelector('canvas.al-sub'), vhsC = el.querySelector('.al-vhs canvas'), trkEl = el.querySelector('.al-vhs .trk');
  { const fc = faceCanvas(); subEl.width = fc.width; subEl.height = fc.height; subEl.getContext('2d').drawImage(fc, 0, 0); }
  vhsC.width = 320; vhsC.height = 180; const vg = vhsC.getContext('2d'), vimg = vg.createImageData(320, 180);
  /** the face, on the screen, for a moment (a frame or two); now and then inverted */
  const subliminal = (ms = 70) => { subEl.style.filter = Math.random() < 0.3 ? 'invert(1) contrast(1.8)' : 'contrast(1.6) brightness(1.1)'; subEl.classList.add('on'); glitch(); setTimeout(() => subEl.classList.remove('on'), ms); };
  /** the picture tearing */
  const glitch = () => { el.classList.remove('glitch'); void el.offsetWidth; el.classList.add('glitch'); trkEl.classList.remove('on'); void trkEl.offsetWidth; trkEl.classList.add('on'); };
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
  const ports = C.map((c, i) => { const p = portal(c, i), n = C.length;
    if (heaven) { p.G.position.set((i - (n - 1) / 2) * 7.5, 0.3, -62 - Math.abs(i - (n - 1) / 2) * 2); p.G.lookAt(0, 0.3, 4); }   // (Heaven: across the end of the way, facing you)
    else { p.G.position.set(spots[i][0], 0.3, spots[i][1]); p.G.lookAt(0, 0.3, 4);   // (Hell: somewhere in the dark - a dim column of light over it, and its hum)
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.6, 60, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0x8a1010, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); col.position.y = 30; p.G.add(col); p.frame.push(col); }
    sc.add(p.G); return p; });
  const hums = heaven ? [] : ports.map(() => snd.hum());
  // the controls
  const keys = new Set(); let heading = Math.PI, mode = 'walk', t = 0, last = performance.now(), raf = 0, nearP = null;
  const kd = (e) => { if (mode !== 'walk') return; const k = e.key.toLowerCase(); keys.add(k); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault(); if ((k === 'e' || k === 'enter') && nearP) enter(nearP); e.stopPropagation(); };
  const ku = (e) => { keys.delete(e.key.toLowerCase()); };
  window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);
  const fit = () => { const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; fit(); addEventListener('resize', fit);
  const setHint = () => { hint.innerHTML = C.length ? '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> &nbsp; <kbd>E</kbd>' : '<kbd>E</kbd>'; hint.classList.remove('gone'); clearTimeout(hint._t); hint._t = setTimeout(() => hint.classList.add('gone'), 7000); };
  setHint(); setTimeout(() => el.querySelector('.al-title').classList.add('in'), 600); setTimeout(() => el.querySelector('.al-title').classList.remove('in'), 4200);
  const camPos = new THREE.Vector3(0, 4, 12), look = new THREE.Vector3(0, 1.5, -10);
  el.__al = { dbg: () => ({ me: [me.position.x, me.position.z], near: nearP?.cand?.name || null, t, mode }), phase: () => (mode === 'exorcism' ? exo.phase : mode), place: (x, z) => { me.position.set(x, 1.4, z); camPos.set(x, 4, z + 7); }, echo: () => { echoAt = 0; }, ports: () => ports.map((p) => [p.G.position.x, p.G.position.z]), face: (x, z) => { heading = Math.atan2(x - me.position.x, z - me.position.z); }, stalkers: ST, show: (i = 1, d = 6) => { const m = ST[i]; if (m) m.G.position.set(me.position.x + Math.sin(heading) * d, 0, me.position.z + Math.cos(heading) * d); }, scare: () => { scareCool = 0; const s0 = ST[0]; if (s0) { s0.G.position.set(me.position.x + 1.5, 0, me.position.z + 1.5); } } };   // (a test's handles)
  const fwd = new THREE.Vector3(), FR = new THREE.Frustum(), PM = new THREE.Matrix4(), BX = new THREE.Vector3();
  const right = new THREE.Vector3();
  /** an echo: the next argument, said around you - each line from near the last, the accuser and you in turn */
  function playEcho() {
    const X = echoes[echoK++ % echoes.length]; if (!X) return 6;
    const a = Math.random() * Math.PI * 2, d = 7 + Math.random() * 10, f0 = 120 + Math.random() * 70;   // (from anywhere round you, in the dark)
    const base = new THREE.Vector3(me.position.x + Math.cos(a) * d, 2 + Math.random() * 2.5, me.position.z + Math.sin(a) * d);
    let at = 0;
    X.forEach(([who, line], i) => {
      const you = who === 'you', p = base.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 4));
      cam.getWorldDirection(right); right.cross(cam.up).normalize(); const rel = p.clone().sub(cam.position), dist = rel.length(), pan = Math.max(-1, Math.min(1, rel.normalize().dot(right) * 1.3));
      const len = snd.voice(line, { f0: you ? 92 : f0, rate: you ? 0.95 : 1.05, ring: you ? 63 : 34, dist: you ? 0.9 : 0.65, gain: 0.55 * Math.min(1.2, 9 / Math.max(4, dist)), pan, delay: at, say: i === 0 }) || (0.4 + line.length * 0.055);
      at += Math.max(0.5, len - 0.25);   // (they talk over each other: an argument)
    });
    return at + 3 + Math.random() * 4;
  }

  const exo = { v: 0, phase: 'still', u: 0, flies: [], snap: 0, sr: 0, punch: 0, mon: null, lunge: null };
  const bloodMat = new THREE.MeshStandardMaterial({ color: 0x3a0202, roughness: 0.12, metalness: 0.25, emissive: 0x1a0000, emissiveIntensity: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
  /** the body's blood: a pool under it, and the drops flung off it (in the portal's frame: +z towards you) */
  function bleed(p) {
    if (p.bl) return p.bl;
    const pool = new THREE.Mesh(new THREE.CircleGeometry(1, 28), bloodMat); pool.rotation.x = -Math.PI / 2; pool.position.set(0, -0.27, 0.3); pool.scale.setScalar(0.05); p.G.add(pool);
    const N = 220, pos = new Float32Array(N * 3).fill(-99), vel = new Float32Array(N * 3), live = new Uint8Array(N);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x7a0606, size: 0.07, transparent: true, opacity: 0.95 })); pts.frustumCulled = false; p.G.add(pts);
    p.bl = { pool, pos, vel, live, g, N, k: 0, want: 0.05,
      emit(n, hard = 1) { for (let j = 0; j < n; j++) { const i = this.k = (this.k + 1) % N; live[i] = 1;
        pos.set([(Math.random() - 0.5) * 0.15, 2.05 + Math.random() * 0.3, 0.3 + (Math.random() - 0.5) * 0.15], i * 3);
        vel.set([(Math.random() - 0.5) * 2.6 * hard, (0.8 + Math.random() * 2.4) * hard, (0.6 + Math.random() * 2.2) * hard], i * 3); } },
      update(dt) { for (let i = 0; i < N; i++) { if (!live[i]) continue; vel[i * 3 + 1] -= 9.8 * dt; pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        if (pos[i * 3 + 1] < -0.25) { pos[i * 3 + 1] = -0.25; live[i] = 0; this.want = Math.min(2.6, this.want + 0.012); } }
        g.attributes.position.needsUpdate = true; pool.scale.setScalar(pool.scale.x + (this.want - pool.scale.x) * Math.min(1, dt * 0.8)); } };
    return p.bl;
  }
  /** the ones that watch it done: in an arc behind the portal, facing you (in Heaven, two come for it) */
  function gather(p) {
    if (heaven && ST.length < 2) for (let k = 0; k < 2; k++) { const m = stalker(); sc.add(m.G); ST.push(m); }
    const P = p.G.position, f = new THREE.Vector3(0, 0, 1).applyQuaternion(p.G.quaternion), base = Math.atan2(-f.x, -f.z);
    const H = ST.slice().sort((a, b) => a.G.position.distanceTo(P) - b.G.position.distanceTo(P)).slice(0, heaven ? 2 : 5);
    H.forEach((m, i) => { const a = base + (H.length > 1 ? (i / (H.length - 1) - 0.5) * 2.3 : 0), r = 6.2 + (i % 2) * 1.5;   // (far enough back that their faces, high up, are in the picture)
      m.held = true; m.trip = null; m.home = new THREE.Vector3(P.x + Math.sin(a) * r, 0, P.z + Math.cos(a) * r); m.G.position.copy(m.home); m.G.scale.setScalar(1); m.G.visible = true; m.inside = false; });
    return H;
  }
  /** one of them going into the body, or coming out of it, as it pleases */
  function trip(p) {
    const H = ST.filter((m) => m.held && !m.trip); if (!H.length) return;
    const m = H[(Math.random() * H.length) | 0], body = new THREE.Vector3(0, 0, 0.3).applyMatrix4(p.G.matrixWorld); body.y = 0;
    m.trip = { t0: t, d: 1.5, into: !m.inside, from: m.inside ? body : m.home.clone(), to: m.inside ? m.home.clone() : body };
  }
  /** a spirit going into the body, or out of it, as it pleases (after the exorcism) */
  function fly(p) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(heaven ? 'rgba(40,30,60,.85)' : 'rgba(30,0,10,.95)', 'rgba(60,0,30,0)'), transparent: true, depthWrite: false })); s.scale.setScalar(0.9);
    const a = Math.random() * Math.PI * 2, far = new THREE.Vector3(Math.cos(a) * 3.5, 1.5 + Math.random() * 2.5, Math.sin(a) * 3.5 + 0.3), body = new THREE.Vector3(0, 1.7, 0.3), into = Math.random() < 0.5;
    p.G.add(s); exo.flies.push({ s, from: into ? far : body, to: into ? body : far, t0: t, d: 1.1 + Math.random() * 0.6 });
  }
  let tries = 0;
  function enter(p) {
    tries++; exo.mon = null; exo.punch = 0; exo.lunge = null; exo.spin = null; exo.last = null; appear = null; black = 0;
    exo.v = 0; exo.phase = 'still'; exo.u = 0; for (const h of hums) h.set(0, 0); bleed(p); exo.held = gather(p);
    for (const x of p.frame) x.visible = false;   // (the ring of light, the swirl, the name gone: nothing between you and the body)
    if (heaven && !p.rats) { p.rats = rats(36, { packs: 2, r: 7 }); p.rats.mesh.position.set(p.G.position.x, 0, p.G.position.z); sc.add(p.rats.mesh); }
    mode = 'exorcism'; keys.clear(); near.classList.remove('in'); hint.style.opacity = '0'; el.classList.add('exo'); me.visible = false; for (const s of trail) s.visible = false;
    // (it gives - in Heaven always; in Hell not the first time: it fights you off, and you come back for it)
    runExorcism({ host: el, heaven, sum: o.sum || 0, name: p.cand.name, color: p.cand.color, audio: o.audio, snd, spite: spite({ bad: o.bad, heaven, name: o.name, body: p.cand.name }), win: heaven || tries > 1,
      onScare: (kind) => { if (kind === 'flash') { subliminal(80); return; } if (kind === 'spin') { exo.spin = t; snd.click(0, 0.6); snd.rattle(0.5, 0.25); return; }
        exo.punch = 1; glitch(); if (kind === 'last') { exo.last = t; subliminal(120); return; }
        if (kind === 'snap') p.doll.possess();
        if (kind === 'reveal') { const M = exo.mon = monsterHead(); p.doll.head.getWorldPosition(M.G.position); M.t0 = t; M.from = M.G.position.clone(); sc.add(M.G); p.bl?.emit(120, 2.2); }
        if (kind === 'lunge') exo.lunge = { t0: t, from: p.doll.G.position.clone() }; },
      onSpirit: (k) => { const w = p.wisps[k % p.wisps.length]; if (w) w.userData.gone = t;
        // (a spirit torn out: blood off the body, the rats pouring out of it)
        p.bl?.emit(heaven ? 30 : 60, 1.6); snd.splat(0.6); const at = new THREE.Vector3(0, 0, 0.3).applyMatrix4(p.G.matrixWorld);
        if (RAT) RAT.burst(at, 26); else p.rats?.burst(new THREE.Vector3(0, 0, 0.3).applyQuaternion(p.G.quaternion), 14);
        for (let q = 0; q < 6; q++) setTimeout(() => snd.squeak(Math.random() * 2 - 1, 0.14), q * 70); },
      onLevel: (v, ph, u) => { if (ph === 'spirit') { fly(p); trip(p); return; } if (ph === 'top' && exo.phase !== 'top') { p.bl?.emit(90, 2); snd.splat(0.8); } exo.v = v; exo.phase = ph; exo.u = u; },
      onDone: (ok) => {
        if (ok) { fade.classList.add('in'); setTimeout(() => finish(p.cand.id), 900); return; }
        for (const w of p.wisps) w.userData.gone = null;
        exo.v = 0; exo.phase = 'still'; p.doll.reset(); p.doll.G.position.set(0, 0.75, 0.3); exo.lunge = null; if (exo.mon) { sc.remove(exo.mon.G); exo.mon.dispose(); exo.mon = null; } echoAt = 2.5;
        for (const x of p.frame) x.visible = true;
        for (const m of ST) { if (m.held) { m.held = false; m.trip = null; m.reach = 0; m.G.scale.setScalar(1); m.G.visible = true; m.inside = false; } }
        mode = 'walk'; hint.style.opacity = '1'; el.classList.remove('exo'); me.visible = true; for (const s of trail) s.visible = true; me.position.set(0, 1.4, 4); heading = Math.PI; setHint();
      } });
  }
  if (!C.length) { const kOnce = (e) => { if (e.key === 'e' || e.key === 'Enter') { window.removeEventListener('keydown', kOnce, true); finish(null); } }; window.addEventListener('keydown', kOnce, true); }
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    if (mode === 'walk') {
      const turn = (keys.has('a') || keys.has('arrowleft') ? 1 : 0) - (keys.has('d') || keys.has('arrowright') ? 1 : 0), go = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 0.6 : 0);
      heading += turn * dt * 1.9; const sp = 9 * go * dt; me.position.x += Math.sin(heading) * sp; me.position.z += Math.cos(heading) * sp;
      if (heaven) { me.position.x = Math.max(-40, Math.min(40, me.position.x)); me.position.z = Math.max(-100, Math.min(14, me.position.z)); }
      else { const rr = Math.hypot(me.position.x, me.position.z); if (rr > 70) { me.position.x *= 70 / rr; me.position.z *= 70 / rr; }   // (Hell: a round dark, no end to walk to)
        for (const [rx, rz, rb, h] of rocks) { const R0 = rb * Math.max(0, 1 - 1.9 / h) + 0.6, dx = me.position.x - rx, dz = me.position.z - rz, d = Math.hypot(dx, dz); if (d < R0 && d > 1e-3) { me.position.x = rx + dx / d * R0; me.position.z = rz + dz / d * R0; } } }   // (round the spires, not through them)
      me.position.y = 1.4 + Math.sin(t * 2.2) * 0.15;
      // the camera: behind and above, easing after
      // (Hell: drawn in when a spire stands behind you - never inside the rock)
      // (the whole line from the camera to your spirit clear of rock, not just the camera's own spot)
      const blocked = (c) => [1, 0.75, 0.5, 0.3].some((f) => inRock(me.position.x - Math.sin(heading) * c * f, me.position.z - Math.cos(heading) * c * f, me.position.y + 2.6 * c * f / 7, f === 1 ? 0.6 : 0.2));
      let cd = 7; if (rocks.length) while (cd > 1.6 && blocked(cd)) cd -= 0.4;
      const want = new THREE.Vector3(me.position.x - Math.sin(heading) * cd, me.position.y + 2.6 * cd / 7 + 0.3 * (1 - cd / 7), me.position.z - Math.cos(heading) * cd);
      camPos.lerp(want, 1 - Math.exp(-dt * 4)); look.lerp(new THREE.Vector3(me.position.x + Math.sin(heading) * 6, 1.6, me.position.z + Math.cos(heading) * 6), 1 - Math.exp(-dt * 5));
      // the nearest portal within reach
      nearP = null; let best = 6.5; for (const p of ports) { const d = Math.hypot(p.G.position.x - me.position.x, p.G.position.z - me.position.z); if (d < best) { best = d; nearP = p; } }
      if (nearP) { near.style.setProperty('--c', nearP.cand.color || '#fff'); near.innerHTML = `${esc(nearP.cand.name)}<small><kbd>E</kbd></small>`; near.classList.add('in'); } else near.classList.remove('in');
      // (Hell: the next echo, when it is time)
      if (echoes.length) { echoAt -= dt; if (echoAt <= 0) echoAt = playEcho(); }
    } else if (mode === 'exorcism' && nearP) {
      // (close on the body being fought for)
      const p = nearP.G.position, f = new THREE.Vector3(0, 0, 1).applyQuaternion(nearP.G.quaternion);
      const q = exo.phase, close = (q === 'still' ? 3.8 : q === 'fight' ? 3.6 - exo.v * 0.9 : q === 'top' || q === 'reveal' ? 2.7 : 3.2) - exo.punch * 1.1;   // (close, closing in as it builds; thrown in at a scare)
      exo.punch = Math.max(0, exo.punch - dt * 2.2); cam.fov = 62 - exo.punch * 30; cam.updateProjectionMatrix();   // (a scare: the lens slammed in on its face)
      camPos.lerp(new THREE.Vector3(p.x + f.x * close, 2.25 + (q === 'top' ? -0.3 : 0), p.z + f.z * close), 1 - Math.exp(-dt * (exo.punch > 0.5 ? 14 : 3))); look.lerp(new THREE.Vector3(p.x, q === 'frail' || q === 'fizzle' ? 1.0 : 2.1, p.z), 1 - Math.exp(-dt * 3));
    }
    // (the doll fought for: still, then its head up at you; rattling on its strings, lifted, bent; the face splitting and
    //  the thing in it coming out at you; then off its strings, crumpled - or, when it does not give, flying at you)
    if (mode === 'exorcism' && nearP?.doll) {
      const D = nearP.doll, B = D.G, v = exo.v, q = exo.phase, j = () => (Math.random() - 0.5) * 2;
      if (q === 'still') D.idle(t, dt, 0);
      else if ((q === 'frail' || q === 'fizzle') && exo.last != null) { D.head.lookAt(cam.position); D.head.rotateZ(j() * 0.2); D.jaw.scale.y = 1.4; D.eyes.forEach((e) => e.scale.setScalar(1.6)); }   // (the last one: its head up at you, after all)
      else if (q === 'snap') { D.head.rotation.set(-0.25 + j() * 0.05, j() * 0.05, 0); D.jaw.scale.y = 1.3; D.strings(); }
      else if (q === 'fight' || q === 'top' || q === 'reveal') {
        D.rattle(q === 'fight' ? v : 1.4, t, dt);
        if (exo.spin != null && t - exo.spin < 0.45) D.head.rotation.y = ((t - exo.spin) / 0.45) * Math.PI * 2;   // (its head turned right round)
        const lift = q === 'fight' ? v * 0.45 : 0.8;
        B.position.set(j() * 0.04 * (1 + v), 0.75 + lift + Math.sin(t * 9) * 0.04 * v, 0.3 + j() * 0.03);
        B.rotation.set(q === 'fight' ? j() * 0.12 * v : -0.6 + j() * 0.15, j() * 0.25 * v + (q === 'top' ? Math.sin(t * 13) * 0.9 : 0), j() * 0.18 * v);
        if (Math.random() < dt * 3 * v) { snd.click(j() * 0.5, 0.3 * v); }
      } else if (q === 'fizzle' || q === 'frail') { D.crumple(Math.min(1, exo.u / 0.4), t); if (q === 'frail' && Math.random() < dt * 0.7) { D.J.armR.B.rotation.x = j() * 1.2; snd.rattle(0.12, 0.15); } }
      else if (q === 'lunge' && exo.lunge) {
        // (straight at you: its world position pulled to just in front of your eyes)
        const L = exo.lunge, u = Math.min(1, (t - L.t0) / 0.3), to = nearP.G.worldToLocal(cam.position.clone().addScaledVector(new THREE.Vector3().subVectors(cam.position, look).normalize(), -0.55));
        to.y -= 1.45; B.position.lerpVectors(L.from, to, u * u); D.rattle(1.5, t, dt); D.jaw.scale.y = 1.4;
      }
      // (the thing inside, out of the doll's face and at you)
      if (exo.mon) { const M = exo.mon, u = Math.min(1, (t - M.t0) / 0.32), eye = cam.position.clone().addScaledVector(new THREE.Vector3().subVectors(look, cam.position).normalize(), 0.75);
        M.G.position.lerpVectors(M.from, eye, u * u); M.G.scale.setScalar(0.4 + u * 1.6); M.G.lookAt(cam.position); M.G.rotateZ(j() * 0.3);
        for (const x of M.tend) x.m.rotation.z = Math.sin(t * 20 + x.ph) * 0.4;
        if (q === 'fizzle' || q === 'frail' || q === 'still') { sc.remove(M.G); M.dispose(); exo.mon = null; } }
      nearP.wisps.forEach((w) => { if (w.userData.gone == null) w.scale.setScalar(0.7 + v * 0.6); });
      // (the blood: off the body as it shakes - a spray at the top - into the pool under it)
      const bl = nearP.bl; if (bl) { if (q === 'fight' || q === 'top') { const n = Math.random() < dt * (q === 'top' ? 90 : 30 * v * v) ? (q === 'top' ? 4 : 1) : 0; if (n) bl.emit(n, q === 'top' ? 1.8 : 1); } bl.update(dt); }
      // (the watchers: reaching for it as it builds)
      for (const m of exo.held || []) { m.reach = q === 'top' || q === 'reveal' ? 0.9 + Math.random() * 0.2 : q === 'fight' ? v * 0.6 : 0.15;
        // (closing in on you as it builds: from behind the doll round to either side of you)
        if (!m.trip && !m.inside && m.home && (q === 'fight' || q === 'top' || q === 'reveal')) { const k = q === 'fight' ? v * 0.55 : 0.8; BX.lerpVectors(m.home, new THREE.Vector3(camPos.x + (m.home.x - nearP.G.position.x) * 0.35, 0, camPos.z + (m.home.z - nearP.G.position.z) * 0.35), k); m.G.position.x += (BX.x - m.G.position.x) * Math.min(1, dt * 2); m.G.position.z += (BX.z - m.G.position.z) * Math.min(1, dt * 2); } }
      const sh = v * v * (q === 'top' || q === 'reveal' ? 0.35 : 0.12) + exo.punch * 0.25; camPos.x += (Math.random() - 0.5) * sh; camPos.y += (Math.random() - 0.5) * sh;
    }
    cam.position.copy(camPos); cam.lookAt(look);
    hellTick(dt);
    // (the spirits coming and going)
    for (let k = exo.flies.length - 1; k >= 0; k--) { const F = exo.flies[k], u = (t - F.t0) / F.d; if (u >= 1) { F.s.parent?.remove(F.s); F.s.material.map.dispose(); F.s.material.dispose(); exo.flies.splice(k, 1); continue; }
      F.s.position.lerpVectors(F.from, F.to, u * u * (3 - 2 * u)); F.s.material.opacity = Math.sin(u * Math.PI) * 0.95; }
    for (let k = trail.length - 1; k > 0; k--) trail[k].position.copy(trail[k - 1].position); trail[0].position.copy(me.position);
    aura.material.rotation = t * 0.3; aura.scale.setScalar(2.4 + Math.sin(t * 3) * 0.2);
    for (let k = 0; k < N; k++) { pos[k * 3 + 1] += vel[k] * dt; if (!heaven) pos[k * 3] += Math.sin(t * 2 + k) * dt * 0.6; if (pos[k * 3 + 1] > 32) pos[k * 3 + 1] = 0; } pg.attributes.position.needsUpdate = true;
    for (const p of ports) {
      p.swirl.material.uniforms.t.value = t;
      p.wisps.forEach((w, k) => { const g = w.userData.gone; if (g != null) { const u = Math.min(1, (t - g) / 1.2); w.position.y += dt * 6; w.material.opacity = 1 - u; return; }
        const a = t * (heaven ? 1.2 : 2.2) * (mode === 'exorcism' && p === nearP ? 1 + exo.v * 3 : 1) + w.userData.ph * Math.PI * 2; w.position.set(Math.cos(a) * 0.9, 1.6 + Math.sin(a * 2) * 0.6 + 0.6, Math.sin(a) * 0.9 + 0.3); w.material.opacity = 0.9; });
      if (!(mode === 'exorcism' && p === nearP)) p.doll.idle(t, dt, p.i * 2);   // (the dolls waiting on their strings, twitching now and then)
    }
    for (const d of dyn) d.f(t, dt);
    R.render(sc, cam); raf = requestAnimationFrame(tick);
  };
  /**
   * Hell, each frame: the blood dripping, the rats running (squealing when you are near them), the portals' hums; and
   * them - each turning its head to you; still while it is in your sight, coming closer while it is not; one too close
   * is in your face (a shriek, the screen torn red) and then gone, somewhere else in the dark.
   */
  function hellTick(dt) {
    // (the tape's grain)
    if (!heaven || mode === 'exorcism') { const d = vimg.data; for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } vg.putImageData(vimg, 0, 0);
      trkAt -= dt; if (trkAt <= 0) { trkEl.classList.remove('on'); void trkEl.offsetWidth; trkEl.classList.add('on'); trkAt = 4 + Math.random() * 7; } }
    if (!heaven) hellScares(dt);
    G0?.update(dt, t);
    if (RAT) { RAT.update(dt, t, me.position); squeakAt -= dt; if (RAT.near < 14 && squeakAt <= 0) { snd.squeak(Math.random() * 1.6 - 0.8, 0.04 + 0.12 * (1 - RAT.near / 14)); squeakAt = 0.12 + Math.random() * 0.5; } }
    for (const p of ports) p.rats?.update(dt, t, new THREE.Vector3(cam.position.x - p.G.position.x, 0, cam.position.z - p.G.position.z));
    cam.updateMatrixWorld(); PM.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); FR.setFromProjectionMatrix(PM);
    cam.getWorldDirection(fwd); right.crossVectors(fwd, cam.up).normalize();
    const panOf = (v3) => { BX.copy(v3).sub(cam.position).normalize(); return Math.max(-1, Math.min(1, BX.dot(right) * 1.3)); };
    if (mode === 'walk') hums.forEach((h, i) => { const P = ports[i].G.position, d = Math.hypot(P.x - me.position.x, P.z - me.position.z); h.set(panOf(P), Math.min(0.32, 3.2 / Math.max(4, d))); });
    let nearest = 99, nearM = null; scareCool -= dt;
    for (const m of ST) {
      if (!m.onTwitch) m.onTwitch = (mm) => { if (mm.d < 24 && mm.G.visible) snd.click(panOf(mm.G.position), 0.35 * (1 - mm.d / 24)); };
      m.update(dt, t, cam.position);
      if (m.trip) {
        const T = m.trip, u = Math.min(1, (t - T.t0) / T.d); m.G.position.lerpVectors(T.from, T.to, u);
        m.G.scale.setScalar(T.into ? (u < 0.6 ? 1 : Math.max(0.03, 1 - (u - 0.6) / 0.4)) : (u < 0.4 ? Math.max(0.03, u / 0.4) : 1));
        if (u >= 1) { m.inside = T.into; m.G.visible = !T.into; m.trip = null; if (!T.into) m.G.scale.setScalar(1); }
        continue;
      }
      if (m.held) { m.frozen = true; continue; }
      if (scare?.m === m) continue;
      const ds = Math.hypot(m.G.position.x - me.position.x, m.G.position.z - me.position.z);   // (from your spirit, not the camera behind it)
      BX.copy(m.G.position); BX.y = 2.6; const seen = m.d < 48 && FR.containsPoint(BX); m.frozen = seen;
      if (mode === 'walk' && !seen && ds > 2.5 && ds < 64) {   // (out of your sight: closer)
        const dx = me.position.x - m.G.position.x, dz = me.position.z - m.G.position.z, L = Math.hypot(dx, dz) || 1, v = (ds > 22 ? 5 : 2.4) * dt;
        m.G.position.x += (dx / L) * v; m.G.position.z += (dz / L) * v;
      }
      if (ds < nearest) { nearest = ds; nearM = m; }
      if (mode === 'walk' && !scare && scareCool <= 0 && ds < 3.4) { scare = { m, t0: t }; snd.shriek(0.75); snd.stinger(1); glitch(); const sx = el.querySelector('.al-scare'); sx.classList.remove('on'); void sx.offsetWidth; sx.classList.add('on'); }
    }
    // (in your face: right in front of your eyes for a moment, then gone - somewhere else in the dark)
    if (scare) {
      const m = scare.m, u = t - scare.t0, k = m.H / 3.8, j = () => (Math.random() - 0.5) * 2;
      // (its face where you are looking, a metre off, square on - shaking)
      BX.copy(cam.position).addScaledVector(fwd, 0.95); m.G.position.set(BX.x, BX.y - 4.05 * k, BX.z);
      m.G.rotation.y = Math.atan2(cam.position.x - BX.x, cam.position.z - BX.z); m.head.lookAt(cam.position); m.head.rotateZ(j() * 0.25); m.head.rotateX(j() * 0.12);
      near.classList.remove('in');
      if (u > 0.75) { const a = Math.random() * Math.PI * 2, r = 34 + Math.random() * 22; m.G.position.set(me.position.x + Math.sin(a) * r, 0, me.position.z + Math.cos(a) * r); scare = null; scareCool = 12 + Math.random() * 10; }
    }
    // (one close: its breathing)
    breathAt -= dt; if (mode === 'walk' && nearM && nearest < 10 && breathAt <= 0) { snd.voice('hhhhaaaaahhhh', { f0: 46, rate: 0.45, gain: 0.05 + 0.14 * (1 - nearest / 10), ring: 21, dist: 0.3, pan: panOf(nearM.G.position) }); breathAt = 2.2 + Math.random() * 2.5; }
  }
  /**
   * HELL's slower fear, on the walk: your heart (faster the nearer they are; your breath catching when one is close); the
   * faces in the dark fading as you come near them; the light flickering and, now and then, going out altogether - only
   * the faces left; one of them standing at the edge of the light ahead of you, gone the moment you have seen it; the face
   * flashed on the screen for a frame; your own name whispered in one ear.
   */
  function hellScares(dt) {
    let nearest = 99; for (const m of ST) if (m.G.visible && !m.held) nearest = Math.min(nearest, Math.hypot(m.G.position.x - me.position.x, m.G.position.z - me.position.z));
    heartAt -= dt; if (heartAt <= 0) { const k = Math.max(0, Math.min(1, 1 - (nearest - 3) / 20)); snd.heart(0.15 + k * 0.4); if (k > 0.75 && Math.random() < 0.5) snd.breath(0.12, 0.6); heartAt = 60 / (62 + k * 95); }
    for (const f of FACES) { const d = Math.hypot(f.position.x - me.position.x, f.position.z - me.position.z); f.material.opacity += ((d > 18 ? f.userData.o : 0) * (black > 0 ? 1.4 : 1) - f.material.opacity) * Math.min(1, dt * (d > 18 ? 0.5 : 4)); }
    if (mode !== 'walk') { hemi.intensity = 0.9; sun.intensity = 1.2; return; }
    // (the light: a flicker; the dark)
    blackAt -= dt; if (blackAt <= 0) { black = 0.6 + Math.random() * 1.4; blackAt = 30 + Math.random() * 30; snd.voice('hhhhhhhaaaaaaaahhhh', { f0: 40, rate: 0.4, gain: 0.2, ring: 18, dist: 0.3, pan: Math.random() * 2 - 1 }); }
    if (black > 0) { black -= dt; hemi.intensity = 0.02; sun.intensity = 0; if (black <= 0) glitch(); }
    else { const fl = Math.random() < dt * 1.5 ? 0.25 : 1; hemi.intensity = 0.9 * fl; sun.intensity = 1.2 * fl; }
    // (a face on the screen, for a frame)
    subAt -= dt; if (subAt <= 0) { subliminal(Math.random() < 0.5 ? 60 : 110); if (Math.random() < 0.4) snd.click(0, 0.4); subAt = 14 + Math.random() * 22; }
    // (your name, in your ear)
    earAt -= dt; if (earAt <= 0) { const nm = String(o.name || '').split(' ')[0] || 'you'; snd.voice(`${nm}... ${nm}...`, { f0: 58 + Math.random() * 20, rate: 0.45, gain: 0.32, ring: 26, dist: 0.25, pan: Math.random() < 0.5 ? -1 : 1 }); earAt = 22 + Math.random() * 20; }
    // (one of them at the edge of the light ahead, still, facing you - gone the moment you have looked at it)
    if (!appear) { appearAt -= dt; if (appearAt <= 0) { const m = ST.find((x) => !x.held && !x.trip && scare?.m !== x); if (m) { const a = heading + (Math.random() - 0.5) * 0.5; m.G.position.set(me.position.x + Math.sin(a) * 13, 0, me.position.z + Math.cos(a) * 13); appear = { m, seen: 0 }; } appearAt = 25 + Math.random() * 25; } }
    else { const m = appear.m; BX.copy(m.G.position); BX.y = 2.6; if (FR.containsPoint(BX)) appear.seen += dt;
      if (appear.seen > 1.1) { const a = Math.random() * Math.PI * 2; m.G.position.set(me.position.x + Math.sin(a) * 45, 0, me.position.z + Math.cos(a) * 45); glitch(); snd.click(0, 0.5); appear = null; } }
  }
  raf = requestAnimationFrame(tick);
  function cleanup() {
    for (const h of hums) h.stop(); RAT?.dispose(); for (const p of ports) p.doll.dispose(); exo.mon?.dispose(); for (const p of ports) p.rats?.dispose(); for (const m of ST) m.dispose();
    snd.stop(1.2); cancelAnimationFrame(raf); window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true); removeEventListener('resize', fit);
    sc.traverse((m) => { m.geometry?.dispose?.(); const ms = m.material ? [].concat(m.material) : []; for (const x of ms) { x.map?.dispose?.(); x.dispose?.(); } });
    R.dispose(); R.forceContextLoss?.();
  }
}
