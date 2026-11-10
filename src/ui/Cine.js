// The cinematic engine: a cutscene as a list of shots over a set built for it. A scene (ui/CineScenes*.js) builds its
// set with the kit handed to it - rooms from boxes and planes, screens painted with the season's own numbers, the
// people (world/People.js, in a pose, alive: breathing, a head that turns to whoever speaks), the crew (the skinned
// rig: world/PersonRig.js - they walk, kneel, work), a car in its livery - and returns its shots: each a camera move
// (a dolly from one framing to another, its lens, an arc, a hand-held tremble), a cut or a dip to black into it, the
// subtitles spoken over it, a lower third, an overlay (a security camera's stamp, a replay's bug). The picture is
// letterboxed (2.39:1 where the screen allows), graded, vignetted; a title card opens it while the set is built.
// Space / Enter / a click: the next shot. Esc or SKIP: the end (a decision the scene asks for is still asked). A scene
// may end on a choice (the picture holds, the options over it) - playCine resolves with { choice } - or be a room to
// look round (browse: stations the camera glides between, left and right).
// One renderer of its own, freed with everything built when it ends. Test hook: window.__cine (step, state).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makePerson } from '../world/People.js';
import { makePersonRig } from '../world/PersonRig.js';
import { POSE, gait, blendPose } from '../world/CrewRig.js';
import { CarMesh } from '../vehicle/CarMesh.js';
import { carModel, loadCarModel } from '../vehicle/CarModel.js';
import { ensureMotion, reduced } from './Motion.js';

const CSS = `
#cine { position: fixed; inset: 0; z-index: 90; background: #000; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; user-select: none; }
#cine canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#cine .bar { position: absolute; left: 0; right: 0; background: #000; height: var(--bar, 0px); transition: height .9s cubic-bezier(.2,.7,.2,1); pointer-events: none; }
#cine .bar.t { top: 0; } #cine .bar.b { bottom: 0; }
#cine .vig { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.5) 100%); }
#cine .fade { position: absolute; inset: 0; background: #000; pointer-events: none; opacity: 1; }
#cine .card { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; opacity: 0; transition: opacity .5s; padding: 0 6vw; }
#cine .card.on { opacity: 1; }
#cine .card small { font: 700 clamp(10px, 1.1vw, 14px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .5em; color: var(--acc, #e10600); margin-bottom: 16px; text-transform: uppercase; }
#cine .card b { font: 300 clamp(26px, 4.6vw, 62px)/1.08 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
#cine .card span { margin-top: 16px; font: 400 clamp(12px, 1.3vw, 17px)/1.4 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; color: rgba(255,255,255,.72); max-width: 56ch; }
#cine .sub { position: absolute; left: 50%; bottom: calc(var(--bar, 0px) + 3.2vh); transform: translateX(-50%); width: min(86vw, 900px); text-align: center; pointer-events: none; opacity: 0; transition: opacity .22s; text-shadow: 0 2px 10px rgba(0,0,0,.9), 0 0 2px rgba(0,0,0,.9); }
#cine .sub.on { opacity: 1; }
#cine .sub i { display: block; font: 800 clamp(9px, 1vw, 12px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .28em; font-style: normal; margin-bottom: 6px; text-transform: uppercase; }
#cine .sub p { margin: 0; font: 500 clamp(14px, 1.75vw, 23px)/1.32 'Segoe UI', Arial, sans-serif; }
#cine .low { position: absolute; left: 5vw; bottom: calc(var(--bar, 0px) + 13vh); pointer-events: none; opacity: 0; transform: translateX(-14px); transition: opacity .35s, transform .45s cubic-bezier(.2,.7,.2,1); border-left: 4px solid var(--lc, #e10600); padding: 4px 0 4px 12px; text-shadow: 0 2px 10px rgba(0,0,0,.85); }
#cine .low.on { opacity: 1; transform: none; }
#cine .low b { display: block; font: 800 clamp(14px, 1.7vw, 22px)/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: .05em; text-transform: uppercase; }
#cine .low span { display: block; margin-top: 4px; font: 600 clamp(9px, 1vw, 12px)/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; color: rgba(255,255,255,.8); text-transform: uppercase; }
#cine .hud { position: absolute; inset: var(--bar, 0px) 0; pointer-events: none; display: none; font: 600 clamp(10px, 1.1vw, 14px)/1.3 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .08em; }
#cine .hud.on { display: block; }
#cine .hud .tl { position: absolute; left: 3vw; top: 2.4vh; } #cine .hud .tr { position: absolute; right: 3vw; top: 2.4vh; text-align: right; } #cine .hud .bl { position: absolute; left: 3vw; bottom: 2.4vh; }
#cine .hud .rec::before { content: ''; display: inline-block; width: .7em; height: .7em; border-radius: 50%; background: #ff2a2a; margin-right: .5em; animation: cine-rec 1s steps(2) infinite; }
#cine .hud.replay .tl { font: 800 clamp(11px, 1.2vw, 15px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; background: #e10600; padding: 6px 10px; }
#cine .hud.cctv::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px); }
@keyframes cine-rec { 50% { opacity: .15; } }
#cine .skip { position: absolute; right: 16px; top: calc(var(--bar, 0px) + 12px); background: rgba(0,0,0,.35); color: rgba(255,255,255,.85); border: 1px solid rgba(255,255,255,.28); border-radius: 8px; font: 700 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .22em; padding: 8px 11px; cursor: pointer; opacity: .0; transition: opacity .4s; }
#cine.live .skip { opacity: .75; } #cine .skip:hover { opacity: 1; }
#cine .prog { position: absolute; left: 0; bottom: var(--bar, 0px); height: 2px; background: var(--acc, #e10600); width: 0; opacity: .7; pointer-events: none; }
#cine .choice { position: absolute; left: 50%; bottom: calc(var(--bar, 0px) + 5vh); transform: translate(-50%, 16px); width: min(92vw, 880px); opacity: 0; pointer-events: none; transition: opacity .45s, transform .5s cubic-bezier(.2,.7,.2,1); }
#cine .choice.on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#cine .choice h4 { margin: 0 0 12px; text-align: center; font: 600 clamp(13px, 1.5vw, 19px)/1.3 'Segoe UI', Arial, sans-serif; text-shadow: 0 2px 10px rgba(0,0,0,.9); }
#cine .choice .ops { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
#cine .choice button { flex: 1 1 200px; max-width: 290px; text-align: left; background: rgba(12,13,17,.82); color: #fff; border: 1px solid rgba(255,255,255,.22); border-left: 4px solid var(--acc, #e10600); border-radius: 8px; padding: 11px 13px; cursor: pointer; font: 700 clamp(11px, 1.15vw, 14px)/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; backdrop-filter: blur(6px); }
#cine .choice button:hover, #cine .choice button:focus-visible { background: rgba(40,42,52,.92); border-color: rgba(255,255,255,.5); outline: none; }
#cine .choice button small { display: block; margin-top: 5px; font: 400 clamp(10px, 1vw, 12px)/1.35 'Segoe UI', Arial, sans-serif; letter-spacing: 0; color: rgba(255,255,255,.72); }
#cine .choice button kbd { float: right; font: 700 10px/1 'Segoe UI', Arial, sans-serif; opacity: .6; border: 1px solid rgba(255,255,255,.35); border-radius: 4px; padding: 2px 5px; margin-left: 8px; }
#cine .ask { position: absolute; left: 50%; bottom: calc(var(--bar, 0px) + 4vh); transform: translate(-50%, 14px); width: min(92vw, 860px); opacity: 0; pointer-events: none; transition: opacity .25s, transform .3s cubic-bezier(.2,.7,.2,1); }
#cine .ask.on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#cine .ask h4 { margin: 0 0 8px; text-align: center; font: 700 clamp(10px, 1.05vw, 13px)/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .24em; text-transform: uppercase; color: rgba(255,255,255,.85); text-shadow: 0 2px 10px rgba(0,0,0,.9); }
#cine .ask .ops { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
#cine .ask button { flex: 1 1 180px; max-width: 280px; text-align: left; background: rgba(12,13,17,.8); color: #fff; border: 1px solid rgba(255,255,255,.25); border-radius: 8px; padding: 9px 12px; cursor: pointer; font: 600 clamp(11px, 1.15vw, 14px)/1.25 'Segoe UI', Arial, sans-serif; backdrop-filter: blur(6px); }
#cine .ask button:hover, #cine .ask button:focus-visible { background: rgba(48,50,62,.92); border-color: #fff; outline: none; }
#cine .ask button kbd { float: right; font: 700 10px/1 'Segoe UI', Arial, sans-serif; opacity: .6; border: 1px solid rgba(255,255,255,.35); border-radius: 4px; padding: 2px 5px; margin-left: 8px; }
#cine .ask .tm { height: 3px; margin-top: 9px; background: rgba(255,255,255,.18); border-radius: 2px; overflow: hidden; }
#cine .ask .tm i { display: block; height: 100%; background: var(--acc, #e10600); transform-origin: 0 50%; }
#cine .qte { position: absolute; left: 50%; bottom: calc(var(--bar, 0px) + 7vh); transform: translateX(-50%); width: min(70vw, 420px); text-align: center; opacity: 0; pointer-events: none; transition: opacity .18s; text-shadow: 0 2px 10px rgba(0,0,0,.9); }
#cine .qte.on { opacity: 1; }
#cine .qte b { display: inline-block; font: 800 clamp(11px, 1.2vw, 14px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .22em; text-transform: uppercase; }
#cine .qte b kbd { font: 800 clamp(10px, 1.1vw, 13px)/1 'Segoe UI', Arial, sans-serif; border: 1.5px solid #fff; border-radius: 6px; padding: 4px 9px; margin-right: 10px; background: rgba(0,0,0,.45); }
#cine .qte .trk { position: relative; height: 10px; margin-top: 12px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.4); border-radius: 6px; overflow: hidden; }
#cine .qte .trk .zone { position: absolute; top: 0; bottom: 0; background: rgba(255,255,255,.3); }
#cine .qte .trk .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 100%; background: var(--acc, #e10600); transform-origin: 0 50%; transform: scaleX(0); }
#cine .qte .trk .mk { position: absolute; top: -3px; bottom: -3px; width: 4px; margin-left: -2px; background: #fff; border-radius: 2px; box-shadow: 0 0 8px #fff; }
#cine .qte .res { display: block; margin-top: 9px; font: 800 clamp(11px, 1.2vw, 15px)/1 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; min-height: 1em; }
#cine .nav { position: absolute; left: 50%; bottom: calc(var(--bar, 0px) + 3vh); transform: translateX(-50%); display: none; gap: 10px; align-items: center; }
#cine.browse .nav { display: flex; }
#cine .nav button { background: rgba(12,13,17,.8); color: #fff; border: 1px solid rgba(255,255,255,.3); border-radius: 8px; padding: 9px 14px; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; cursor: pointer; }
#cine .nav span { font: 600 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; color: rgba(255,255,255,.7); min-width: 60px; text-align: center; }
#cine .plq { position: absolute; left: 5vw; top: calc(var(--bar, 0px) + 6vh); max-width: min(40vw, 420px); pointer-events: none; opacity: 0; transition: opacity .4s; border-left: 4px solid var(--acc, #e10600); padding-left: 14px; text-shadow: 0 2px 12px rgba(0,0,0,.9); }
#cine .plq.on { opacity: 1; }
#cine .plq small { display: block; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; color: var(--acc, #e10600); margin-bottom: 8px; text-transform: uppercase; }
#cine .plq b { display: block; font: 300 clamp(20px, 2.6vw, 34px)/1.1 'Segoe UI', Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
#cine .plq p { margin: 10px 0 0; font: 400 clamp(12px, 1.2vw, 15px)/1.45 'Segoe UI', Arial, sans-serif; color: rgba(255,255,255,.85); white-space: pre-line; }
`;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const EASE = { lin: (u) => u, io: (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2), out: (u) => 1 - Math.pow(1 - u, 3), in: (u) => u * u * u, soft: (u) => u * u * (3 - 2 * u) };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export const rng = (seed) => { let s = seed >>> 0 || 1; return () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; s ^= s >>> 12; return (s >>> 0) / 4294967296; }; };
const GRADE = { neutral: 'none', warm: 'saturate(1.08) contrast(1.05) sepia(.08)', cold: 'saturate(.82) contrast(1.06) hue-rotate(-8deg)', mono: 'grayscale(1) contrast(1.25) brightness(.92)', doc: 'saturate(.9) contrast(1.08)', gold: 'saturate(1.12) sepia(.16) contrast(1.04)' };
const FONT = '"Segoe UI", Roboto, Arial, sans-serif';
let LIVE = null;
export const cineLive = () => !!LIVE;

/**
 * The kit a scene builds with. Everything made through it is freed when the scene ends.
 * Facing: an angle about y, 0 looking down +z (toward a camera at +z), PI/2 down +x.
 */
function makeKit(R, S, cam, def, o) {
  const own = [], people = [], actors = [], cars = [], mats = new Map(), tick = [];
  const rnd = rng(hash(`${def.id}|${o.seed ?? ''}`));
  const k = { R, S, cam, rnd, o, actors, THREE, FONT, t: 0, org: new THREE.Vector3() };
  /** where the next things are built (a second set, far from the first, in the one scene); shots(list): those shots moved there too */
  k.at = (x = 0, y = 0, z = 0) => { k.org.set(x, y, z); return k; };
  k.shots = (list) => { const O = k.org.clone(), mv = (a) => (a ? [a[0] + O.x, a[1] + O.y, a[2] + O.z] : a); return list.filter(Boolean).map((sh) => ({ ...sh, p: mv(sh.p), l: mv(sh.l), p2: mv(sh.p2), l2: mv(sh.l2), focus: mv(sh.focus), focus2: mv(sh.focus2) })); };
  k.own = (x) => { own.push(x); return x; };
  k.add = (x, parent = S) => { parent.add(x); return x; };
  /** a standard material (shared by its look) */
  k.m = (color, rough = 0.7, metal = 0, ex = null) => {
    const key = ex ? null : `${color}|${rough}|${metal}`;
    if (key && mats.has(key)) return mats.get(key);
    const m = k.own(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...(ex || {}) })); if (key) mats.set(key, m); return m;
  };
  /** a glowing one (a lamp's face, a strip light): seen whatever the light */
  k.glow = (color, I = 1) => k.own(new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(I), toneMapped: I <= 1 }));
  const mesh = (g, m, x, y, z, sh = true) => { const b = new THREE.Mesh(k.own(g), m); b.position.set(x + k.org.x, y + k.org.y, z + k.org.z); b.castShadow = sh; b.receiveShadow = true; S.add(b); return b; };
  k.box = (w, h, d, m, x = 0, y = 0, z = 0, ry = 0) => { const b = mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z); b.rotation.y = ry; return b; };
  k.cyl = (r0, r1, h, m, x = 0, y = 0, z = 0, seg = 20) => mesh(new THREE.CylinderGeometry(r0, r1, h, seg), m, x, y, z);
  k.ball = (r, m, x = 0, y = 0, z = 0) => mesh(new THREE.SphereGeometry(r, 20, 14), m, x, y, z);
  /** an upright plane facing `face`; flat: lying on the floor */
  k.plane = (w, h, m, x = 0, y = 0, z = 0, face = 0, flat = false) => { const b = mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, false); if (flat) b.rotation.x = -Math.PI / 2; else b.rotation.y = face; return b; };
  k.floor = (w, d, m, y = 0, x = 0, z = 0) => k.plane(w, d, m, x, y, z, 0, true);
  /** a painted texture: draw(ctx, W, H) */
  k.tex = (W, H, draw) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); draw(x, W, H); const t = k.own(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, R.capabilities.getMaxAnisotropy?.() || 1); return t; };
  /** a screen: a painted picture that lights itself (w x h m); bright: how hard it glows */
  k.screen = (w, h, draw, x, y, z, face = 0, bright = 1, px = 640) => {
    const t = k.tex(px, Math.max(64, Math.round(px * h / w)), draw), m = k.own(new THREE.MeshBasicMaterial({ map: t, color: new THREE.Color(bright, bright, bright), toneMapped: false }));
    const b = k.plane(w, h, m, x, y, z, face); b.userData.tex = t;
    /** the picture painted again (a replay's next frame, a table's next row) */
    b.redraw = (fn) => { const c = t.image, x2 = c.getContext('2d'); fn(x2, c.width, c.height); t.needsUpdate = true; };
    return b;
  };
  /** a painted sign that takes the room's light (a wall's lettering, a banner, a framed print) */
  k.sign = (w, h, draw, x, y, z, face = 0, px = 512, ex = null) => k.plane(w, h, k.own(new THREE.MeshStandardMaterial({ map: k.tex(px, Math.max(32, Math.round(px * h / w)), draw), roughness: 0.8, ...(ex || {}) })), x, y, z, face);
  k.light = {
    hemi: (sky, ground, I) => k.add(new THREE.HemisphereLight(sky, ground, I)),
    key: (color, I, p, t = [0, 1, 0], shadow = true, span = 9) => {
      const L = new THREE.DirectionalLight(color, I); L.position.set(...p).add(k.org); L.target.position.set(...t).add(k.org); S.add(L, L.target);
      if (shadow && !o.lite) { L.castShadow = true; L.shadow.mapSize.set(1536, 1536); Object.assign(L.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 0.5, far: 60 }); L.shadow.bias = -0.0005; L.shadow.radius = 5; }
      return L;
    },
    spot: (color, I, p, t, angle = 0.5, pen = 0.6, shadow = false) => { const L = new THREE.SpotLight(color, I, 0, angle, pen, 1.6); L.position.set(...p).add(k.org); L.target.position.set(...t).add(k.org); if (shadow && !o.lite) { L.castShadow = true; L.shadow.mapSize.set(1024, 1024); L.shadow.bias = -0.0006; } S.add(L, L.target); return L; },
    point: (color, I, p, dist = 0) => { const L = new THREE.PointLight(color, I, dist, 1.8); L.position.set(...p).add(k.org); S.add(L); return L; },
  };
  /** a studio for paint and metal to reflect (soft boxes overhead and to the sides) */
  k.env = (I = 0.8, tint = 0.5) => {
    const env = new THREE.Scene(), bx = (w, h, x, y, z, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
    env.background = new THREE.Color(tint * 0.2, tint * 0.21, tint * 0.23); bx(8, 8, 0, 9, 0, 3.0); bx(10, 3, 9, 3, 2, 2.0); bx(10, 3, -9, 3, -2, 2.0); bx(6, 3, 0, 2, 9, 1.2);
    const pm = new THREE.PMREMGenerator(R), rt = pm.fromScene(env, 0.04); S.environment = rt.texture; S.environmentIntensity = I; own.push(rt.texture, pm);
    env.traverse((x) => { if (x.isMesh) { x.geometry.dispose(); x.material.dispose(); } });
  };
  /**
   * A person (world/People.js options: pose, kit, color, accent, driver, seed, cap, teamName ...). -> an actor:
   * { g, P, look (a point their head turns to; null: ahead), bounce (0..1: jumping for joy), nod, shake (the head),
   *   sway, face(x, z) (the body turned to a point), at(x, y, z) }
   */
  k.person = (opts, at = [0, 0, 0], face = 0) => {
    let P = null; try { P = makePerson({ jitter: 0.004, ...opts }); } catch (e) { console.warn('[cine] person', e); return null; }
    at = [at[0] + k.org.x, at[1] + k.org.y, at[2] + k.org.z];
    const g = P.group; g.position.set(at[0], at[1], at[2]); g.rotation.y = face - Math.PI / 2; g.userData.person = true;
    g.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = false; } });
    S.add(g); people.push(P);
    const a = { g, P, y0: at[1], yaw: face, look: null, bounce: 0, nod: 0, shake: 0, sway: 1, ph: rnd() * 6.28, hy: 0, hz: 0, kind: 'person',
      face(x, z) { this.yaw = Math.atan2(x - g.position.x, z - g.position.z); g.rotation.y = this.yaw - Math.PI / 2; return this; },
      at(x, y, z) { g.position.set(x, y, z); this.y0 = y; return this; },
      get head() { const v = new THREE.Vector3(0, 1.62, 0); return g.localToWorld(v); } };
    actors.push(a); return a;
  };
  /**
   * A crew member (the skinned rig: a race suit and a crew helmet in the team's colours). -> an actor: { g, rig,
   * pose (a CrewRig pose's name, blended to), walk([[x, z], ...], speed) (along a path, then its pose again), face() }
   */
  k.crew = (opts, at = [0, 0, 0], face = 0) => {
    let rig = null; try { rig = makePersonRig({ build: opts.build || 'broad', team: opts.color || '#555b66', accent: opts.accent || '#ffffff' }); } catch (e) { console.warn('[cine] crew', e); return null; }
    const g = new THREE.Group(); g.add(rig.mesh); rig.mesh.castShadow = true; g.position.set(at[0] + k.org.x, at[1] + k.org.y, at[2] + k.org.z); g.rotation.y = face - Math.PI / 2; S.add(g); own.push(rig);
    const a = { g, rig, kind: 'crew', pose: opts.pose || 'stand', cur: {}, path: null, speed: 1.4, ph: rnd() * 6.28, yaw: face, work: opts.work || 0,
      face(x, z) { this.yaw = Math.atan2(x - g.position.x, z - g.position.z); g.rotation.y = this.yaw - Math.PI / 2; return this; },
      walk(path, speed = 1.4, then = null) { this.path = path.map((p) => [...p]); this.speed = speed; if (then) this.then = then; return this; } };
    blendPose(a.cur, POSE[a.pose] || POSE.stand, 1); rig.apply(a.cur);
    actors.push(a); return a;
  };
  /** the car: { color, color2, team, livery, number, driver } on its wheels at `at`, its nose toward `face` */
  k.car = (c, at = [0, 0, 0], face = Math.PI / 2, compound = 'SOFT') => {
    if (!carModel()) return null;
    let m = null; try { m = new CarMesh(c.color, compound, { color2: c.color2, team: c.team, livery: c.livery || null, helmet: c.helmet, number: c.number, driver: c.driver }); } catch (e) { console.warn('[cine] car', e); return null; }
    m.group.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.frustumCulled = false; } });
    if (m.shadow) m.shadow.visible = false; if (m.shadowFar) m.shadowFar.visible = false;
    m.group.position.set(at[0] + k.org.x, at[1] + k.org.y, at[2] + k.org.z); m.group.rotation.y = face - Math.PI / 2; S.add(m.group); cars.push(m); return m;
  };
  /** lettering painted for a sign: lines [[text, size, colour, weight]] centred on a ground colour */
  k.letters = (lines, bg = '#101114', align = 'center') => (x, W, H) => {
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, W, H); }
    const tot = lines.reduce((s, l) => s + l[1] * 1.25, 0); let y = (H - tot) / 2;
    x.textAlign = align; x.textBaseline = 'middle';
    for (const [text, size, col = '#ffffff', wt = 800] of lines) { x.font = `${wt} ${size}px ${FONT}`; x.fillStyle = col; let s = String(text); while (x.measureText(s).width > W * 0.92 && s.length > 4) s = s.slice(0, -2); x.fillText(s === String(text) ? s : s + '…', align === 'center' ? W / 2 : W * 0.05, y + size * 0.62); y += size * 1.25; }
  };
  /** something of the scene's own to run each frame: fn(t, dt) */
  k.each = (fn) => { tick.push(fn); };
  k._tick = (t, dt) => {
    k.t = t;
    for (const a of actors) {
      if (a.kind === 'person') {
        const g = a.g, br = Math.sin(t * 1.7 + a.ph);
        g.position.y = a.y0 + (a.bounce ? Math.abs(Math.sin(t * 6.2 + a.ph)) * 0.07 * a.bounce : 0);
        g.rotation.y = a.yaw - Math.PI / 2 + Math.sin(t * 0.6 + a.ph) * 0.012 * a.sway; g.rotation.z = br * 0.004 * a.sway;
        // the head: to whoever it is looking at (within what a neck allows), a nod, a shake
        let hy = 0, hz = 0;
        if (a.look) { const dx = a.look.x - g.position.x, dz = a.look.z - g.position.z, want = Math.atan2(dx, dz) - a.yaw; hy = clamp(Math.atan2(Math.sin(want), Math.cos(want)), -1.0, 1.0); const d = Math.hypot(dx, dz) || 1; hz = clamp(Math.atan2((a.look.y ?? 1.6) - 1.62, d), -0.5, 0.5); }
        hy += Math.sin(t * 7.5 + a.ph) * 0.22 * a.shake + Math.sin(t * 0.45 + a.ph * 2) * 0.03; hz += Math.sin(t * 5.2 + a.ph) * 0.1 * a.nod;
        const f = 1 - Math.exp(-dt * 5); a.hy += (hy - a.hy) * f; a.hz += (hz - a.hz) * f;
        if (a.P.head) { a.P.head.rotation.y = a.hy; a.P.head.rotation.z = a.hz; }
      } else {
        // a crew member: along their path at a walk or a run, then their pose
        if (a.path && a.path.length) {
          const [tx, tz] = a.path[0], dx = tx - a.g.position.x, dz = tz - a.g.position.z, d = Math.hypot(dx, dz), st = a.speed * dt;
          if (d <= st) { a.g.position.x = tx; a.g.position.z = tz; a.path.shift(); if (!a.path.length && a.then) { a.pose = a.then; a.then = null; } }
          else { a.g.position.x += dx / d * st; a.g.position.z += dz / d * st; a.yaw = Math.atan2(dx, dz); a.g.rotation.y = a.yaw - Math.PI / 2; }
          a.ph += dt * a.speed * 4.4; blendPose(a.cur, gait(a.ph, clamp(a.speed / 3.2, 0.35, 1)), 1 - Math.exp(-dt * 12));
        } else {
          blendPose(a.cur, POSE[a.pose] || POSE.stand, 1 - Math.exp(-dt * 6));
          if (a.work) { const w = Math.sin(t * 9 + a.ph) * 0.06 * a.work; a.cur.shL = a.cur.shL || [0, 0, 0]; a.cur.shR = a.cur.shR || [0, 0, 0]; a.cur.shL[2] += w; a.cur.shR[2] -= w; }
        }
        a.rig.apply(a.cur);
      }
    }
    for (const fn of tick) { try { fn(t, dt); } catch (e) { /* (a scene's own flourish: never the scene) */ } }
  };
  k._dispose = () => {
    for (const P of people) { try { P.dispose(); } catch (e) { /* gone */ } }
    for (const c of cars) { try { S.remove(c.group); c.dispose(); } catch (e) { /* gone */ } }
    for (const x of own) { try { x.dispose?.(); } catch (e) { /* gone */ } }
    S.traverse((x) => { if (x.isLight && x.shadow?.map) x.shadow.map.dispose(); });
    S.clear();
  };
  return k;
}

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
/** what a subtitle needs to be read (s) */
const readTime = (s) => 1.1 + String(s || '').split(/\s+/).length * 0.3;

/**
 * Play a scene. def: { id, kicker, title, sub (the title card), accent, grade, bg, fog: [near, far], exposure,
 * build(k, ctx) -> { shots, choice?, browse? } }, where a shot is { d (s), p, l (the camera and what it looks at),
 * f (the lens: its vertical angle), p2, l2, f2 (where the move ends), focus, focus2 (what is sharp, if not what it
 * looks at: a pull of focus from one to the other), dof (how shallow: 1 as the lens gives, 0 everything sharp), e (ease: io | out | in | lin), arc ([x, y, z]: the
 * move bows by this at its middle), shake (0..1 hand-held), roll, cut ('dip': through black), grade, hud ('cctv' |
 * 'replay'), hudText, sub ({ who, text, c }, several, or a function of what has been answered), low ({ name, role, c }),
 * card ({ kicker, title, sub }: a title on black, no picture), on(k) (as the shot starts), run(k, u) (each frame of it),
 * when(res) (the shot only if it returns true: a scene's branches), ask ({ id, prompt, options: [{ id, label }], time (s),
 * def (the answer when the time is gone), onPick(id, k) }: asked while the shot runs on - the scene never stops), qte
 * ({ id, kind: 'time' (a press as the marker crosses the zone) | 'hold' | 'mash', prompt, from, len (s), sweet, need,
 * onProgress(p, k), onDone('good' | 'ok' | 'miss', k) }) }. res: { picks: { [ask id]: option id }, qte: { [id]: grade } }.
 * o: { ctx, audio, seed, lite }. -> Promise<{ choice, picks, qte, skipped }>
 */
export function playCine(def, o = {}) {
  return new Promise((resolve) => {
    if (LIVE) { resolve({ skipped: true, busy: true }); return; }
    ensureMotion();
    if (!document.getElementById('cine-css')) { const st = document.createElement('style'); st.id = 'cine-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = document.createElement('div'); el.id = 'cine'; el.style.setProperty('--acc', def.accent || '#e10600');
    el.innerHTML = `<canvas></canvas><div class="vig"></div><div class="hud"><div class="tl"></div><div class="tr"></div><div class="bl"></div></div><div class="fade"></div><div class="bar t"></div><div class="bar b"></div>
      <div class="card"><small></small><b></b><span></span></div><div class="low"><b></b><span></span></div><div class="plq"><small></small><b></b><p></p></div><div class="sub"><i></i><p></p></div>
      <div class="choice"><h4></h4><div class="ops"></div></div><div class="ask"><h4></h4><div class="ops"></div><div class="tm"><i></i></div></div><div class="qte"><b></b><div class="trk"><div class="zone"></div><div class="fill"></div><div class="mk"></div></div><span class="res"></span></div><div class="nav"><button data-n="-1">◂</button><span></span><button data-n="1">▸</button><button data-n="0">LEAVE</button></div>
      <div class="prog"></div><button class="skip">SKIP ▸</button>`;
    document.body.appendChild(el);
    const $ = (s) => el.querySelector(s), cv = $('canvas');
    const end = (res) => { if (!LIVE) return; LIVE = null; window.__cine = null; resolve(res); };
    let R; try { R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); } catch (e) { el.remove(); resolve({ skipped: true, failed: true }); return; }
    LIVE = { id: def.id };
    R.setPixelRatio(Math.min(o.lite ? 1 : 1.5, devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = def.exposure ?? 1.0;
    R.shadowMap.enabled = !o.lite; R.shadowMap.type = THREE.PCFSoftShadowMap;
    const S = new THREE.Scene(); S.background = new THREE.Color(def.bg || '#07080b'); if (def.fog) S.fog = new THREE.Fog(def.fogColor || def.bg || '#07080b', def.fog[0], def.fog[1]);
    const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 400);
    const k = makeKit(R, S, cam, def, o);
    // the lens: a shallow depth of field (what the shot looks at is sharp, the room behind it soft) - not on a light
    // machine's setting, nor where the passes cannot be made
    let comp = null, bokeh = null;
    if (!o.lite && def.dof !== false) { try { comp = new EffectComposer(R); comp.addPass(new RenderPass(S, cam)); bokeh = new BokehPass(S, cam, { focus: 5, aperture: 0.0008, maxblur: 0.007 }); comp.addPass(bokeh); comp.addPass(new OutputPass()); } catch (e) { comp = null; bokeh = null; } }
    const focusAt = new THREE.Vector3();
    // (a lamp by the lens: a little light on whatever the shot looks at, so a face in a dim room still reads)
    const eye = new THREE.PointLight(0xfff4e8, 0, 0, 2); S.add(eye);
    const draw = (sh) => {
      if (!comp || sh?.dof === 0) { R.render(S, cam); return; }
      // (sharp at what the shot looks at, or at its own focus - pulled from one subject to another over the shot;
      //  a long lens throws the background further out than a wide one)
      const d = cam.position.distanceTo(focusAt), f = cam.fov;
      bokeh.uniforms.focus.value = d; bokeh.uniforms.aperture.value = (sh?.dof ?? 1) * 0.00042 * Math.pow(34 / f, 1.6) * Math.min(1.6, 5 / Math.max(1.5, d)); bokeh.uniforms.maxblur.value = 0.0075;
      comp.render();
    };
    const card = $('.card'), sub = $('.sub'), low = $('.low'), hud = $('.hud'), fade = $('.fade'), prog = $('.prog'), plq = $('.plq');
    const showCard = (c) => { if (!c) { card.classList.remove('on'); return; } card.querySelector('small').textContent = c.kicker || ''; card.querySelector('b').textContent = c.title || ''; card.querySelector('span').textContent = c.sub || ''; card.classList.add('on'); };
    showCard({ kicker: def.kicker, title: def.title, sub: def.sub });
    const amb = def.sound && o.audio?.play ? (() => { try { return o.audio.play(def.sound.name, { gain: def.sound.gain ?? 0.4, loop: true, offset: 'random', fadeIn: 1.2 }); } catch (e) { return null; } })() : null;

    const picks = {}, qres = {}, res = { picks, qte: qres }; let askOn = null, qteOn = null, down = false;
    let shots = [], choice = null, browse = null, built = false, on = true, t = 0, i = -1, t0 = 0, last = performance.now(), held = false, total = 0, station = 0, bFrom = null, bU = 1, picked = null, ending = 0, openT = 0;
    const size = () => {
      const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight;
      const bar = Math.max(0, Math.round((h - w / (def.aspect || 2.39)) / 2)), b = Math.min(bar, Math.round(h * 0.16));
      el.style.setProperty('--bar', (built ? b : 0) + 'px');
      if (cv.width !== Math.round(w * R.getPixelRatio()) || cv.height !== Math.round(h * R.getPixelRatio())) { R.setSize(w, h, false); comp?.setSize(w, h); }
      cam.aspect = w / h;
    };
    const subs = (sh) => (sh.sub ? [].concat(sh.sub) : []);
    const setSub = (s) => { if (!s) { sub.classList.remove('on'); return; } sub.querySelector('i').textContent = s.who || ''; sub.querySelector('i').style.color = s.c || def.accent || '#ffd76a'; sub.querySelector('p').textContent = s.text || ''; sub.classList.add('on'); };
    const ok = (sh) => { try { return !sh.when || !!sh.when(res); } catch (e) { return true; } };
    /** the next shot after n that this telling of the scene has (a shot may depend on what was answered); -1: none */
    const after = (n) => { for (let j = n + 1; j < shots.length; j++) if (ok(shots[j])) return j; return -1; };
    const enter = (n) => {
      i = n; t0 = t; const sh = shots[i]; if (!sh) return;
      closeAsk(); closeQte();
      sh._subs = [].concat((typeof sh.sub === 'function' ? sh.sub(res) : sh.sub) || []).filter(Boolean);
      sh._sd = Math.max(sh.d0 ?? sh.d ?? 3, sh._subs.reduce((a, x) => a + readTime(x.text), 0)); sh.d0 = sh.d0 ?? sh.d ?? 3; sh.d = sh._sd; sh._cut = 0;
      if (sh.ask) { sh.ask._at = sh.ask.at ?? Math.max(0.5, sh._subs.reduce((a, x) => a + readTime(x.text), 0)); sh.ask.time = sh.ask.time || 6; sh.d = Math.max(sh.d, sh.ask._at + sh.ask.time + 0.3); sh._asked = false; }
      if (sh.qte) { const Q = sh.qte; Q.from = Q.from ?? 0.6; Q.len = Q.len ?? 2.6; Q._p = 0; Q._n = 0; sh._q = false; sh.d = Math.max(sh.d, Q.from + Q.len + (Q.after ?? 0.9)); }
      showCard(sh.card || null);
      if (sh.low) { low.style.setProperty('--lc', sh.low.c || def.accent || '#e10600'); low.querySelector('b').textContent = sh.low.name || ''; low.querySelector('span').textContent = sh.low.role || ''; low.classList.add('on'); } else low.classList.remove('on');
      hud.className = 'hud' + (sh.hud ? ` on ${sh.hud}` : '');
      if (sh.hud) { const T = sh.hudText || {}; hud.querySelector('.tl').innerHTML = sh.hud === 'cctv' ? `<span class="rec">REC</span> ${esc(T.tl || 'CAM 04')}` : esc(T.tl || 'REPLAY'); hud.querySelector('.tr').textContent = T.tr || ''; hud.querySelector('.bl').textContent = T.bl || ''; }
      cv.style.filter = GRADE[sh.grade || def.grade || 'neutral'] || 'none';
      try { sh.on?.(k, res); } catch (e) { console.warn('[cine] shot', e); }
      if (sh.sfx && o.audio) { try { sh.sfx(o.audio); } catch (e) { /* no sound */ } }
    };
    const askEl = $('.ask'), qEl = $('.qte');
    const closeAsk = () => { askOn = null; askEl.classList.remove('on'); };
    const closeQte = () => { qteOn = null; qEl.classList.remove('on'); };
    const openAsk = (sh) => {
      const A = sh.ask; askOn = sh; askEl.querySelector('h4').textContent = A.prompt || '';
      askEl.querySelector('.ops').innerHTML = A.options.map((x, n) => `<button data-a="${esc(x.id)}"><kbd>${n + 1}</kbd>${esc(x.label)}</button>`).join('');
      askEl.classList.add('on'); setSub(null);
    };
    /** an answer given (or the time gone: the scene's own default) - the shot runs out a moment after, never stops */
    const pickAsk = (id, late = false) => {
      const sh = askOn; if (!sh) return; const A = sh.ask; picks[A.id] = id; sh._asked = true; closeAsk();
      try { A.onPick?.(id, k, late); } catch (e) { console.warn('[cine] answer', e); }
      if (sh.d - (t - t0) > 0.5) sh._cut = t + 0.45;
    };
    const openQte = (sh) => {
      const Q = sh.qte; qteOn = sh; const tap = 'ontouchstart' in window;
      qEl.querySelector('b').innerHTML = `<kbd>${tap ? 'TAP' : 'SPACE'}</kbd>${esc(Q.prompt || (Q.kind === 'hold' ? 'Hold' : Q.kind === 'mash' ? 'Tap fast' : 'Now'))}`;
      const z = qEl.querySelector('.zone'), mk = qEl.querySelector('.mk'), fill = qEl.querySelector('.fill'), sw = Q.sweet || [0.62, 0.8];
      z.style.display = Q.kind === 'time' ? 'block' : 'none'; mk.style.display = Q.kind === 'time' ? 'block' : 'none'; fill.style.display = Q.kind === 'time' ? 'none' : 'block';
      z.style.left = `${sw[0] * 100}%`; z.style.width = `${(sw[1] - sw[0]) * 100}%`; qEl.querySelector('.res').textContent = ''; qEl.classList.add('on');
    };
    const doneQte = (grade) => {
      const sh = qteOn; if (!sh) return; const Q = sh.qte; qres[Q.id] = grade; sh._q = true; qteOn = null;
      const r = qEl.querySelector('.res'); r.textContent = (Q.words || { good: 'PERFECT', ok: 'GOOD', miss: 'MISSED' })[grade] || ''; r.style.color = grade === 'good' ? '#7dffa0' : grade === 'ok' ? '#ffffff' : '#ff8a8a';
      setTimeout(() => { if (!qteOn) qEl.classList.remove('on'); }, 800);
      try { Q.onDone?.(grade, k); } catch (e) { console.warn('[cine] qte', e); }
      if (o.audio?.beep) { try { o.audio.beep(grade === 'miss' ? 220 : 880, 0.1, 0.15); } catch (e) { /* no sound */ } }
    };
    /** the key (or a tap) during a quick-time event */
    const press = () => {
      const sh = qteOn; if (!sh) return false; const Q = sh.qte, x = clamp(((t - t0) - Q.from) / Q.len, 0, 1);
      if (Q.kind === 'time') { const sw = Q.sweet || [0.62, 0.8], m = (sw[1] - sw[0]) * 0.75; doneQte(x >= sw[0] && x <= sw[1] ? 'good' : x >= sw[0] - m && x <= sw[1] + m ? 'ok' : 'miss'); }
      else if (Q.kind === 'mash') { Q._n++; Q._p = Math.min(1, Q._n / (Q.need || 8)); try { Q.onProgress?.(Q._p, k); } catch (e) { /* its flourish */ } if (Q._p >= 1) doneQte('good'); }
      return true;
    };
    /** everything still to be answered or done, settled as the scene would without you (a skip) */
    const settle = () => {
      closeAsk(); closeQte();
      for (let j = Math.max(0, i); j >= 0 && j < shots.length; j = after(j)) {
        const sh = shots[j]; if (j > i && !ok(sh)) continue;
        if (sh.ask && picks[sh.ask.id] == null) { const A = sh.ask, id = A.def ?? A.options[A.options.length - 1].id; picks[A.id] = id; try { A.onPick?.(id, k, true); } catch (e) { /* skipped */ } }
        if (sh.qte && qres[sh.qte.id] == null) { qres[sh.qte.id] = 'ok'; try { sh.qte.onProgress?.(1, k); sh.qte.onDone?.('ok', k); } catch (e) { /* skipped */ } }
        if (after(j) < 0) break;
      }
    };
    const finish = (skipped = false) => {
      if (!on || ending) return;
      if (choice && !picked && !browse) { askChoice(); return; }
      ending = 1; el.classList.remove('live'); amb?.stop?.(0.8);
      fade.style.transition = 'opacity .55s'; fade.style.opacity = '1'; sub.classList.remove('on'); low.classList.remove('on'); $('.choice').classList.remove('on'); plq.classList.remove('on');
      setTimeout(() => {
        on = false; window.removeEventListener('keydown', key, true); window.removeEventListener('keyup', keyUp, true); window.removeEventListener('resize', size);
        try { k._dispose(); comp?.dispose?.(); bokeh?.dispose?.(); R.dispose(); R.forceContextLoss?.(); } catch (e) { /* gone */ }
        el.remove(); end({ choice: picked, picks, qte: qres, skipped });
      }, reduced() ? 60 : 600);
    };
    const askChoice = () => {
      if (held) return; held = true; sub.classList.remove('on'); low.classList.remove('on');
      if (typeof choice === 'function') { try { choice = choice(res); } catch (e) { choice = null; } if (!choice) { held = false; picked = '-'; finish(); return; } }
      const box = $('.choice'); box.querySelector('h4').textContent = choice.prompt || '';
      box.querySelector('.ops').innerHTML = choice.options.map((x, n) => `<button data-c="${esc(x.id)}"><kbd>${n + 1}</kbd>${esc(x.label)}${x.hint ? `<small>${esc(x.hint)}</small>` : ''}</button>`).join('');
      box.classList.add('on'); $('.skip').style.display = 'none';
      box.onclick = (e) => { const b = e.target.closest('button[data-c]'); if (b) { picked = b.dataset.c; finish(); } };
    };
    const next = () => { if (!built || ending || held || browse) return; if (qteOn) { press(); return; } if (askOn || shots[i]?.ask && !shots[i]._asked || shots[i]?.qte && !shots[i]._q) return; const n = after(i); if (n < 0) finish(); else { fade.style.transition = 'none'; enter(n); } };
    const skipAll = () => { settle(); if (choice && !picked) { let n = i; for (let j = after(i); j >= 0; j = after(j)) n = j; enter(n); shots[n]._asked = true; shots[n]._q = true; t0 = t - shots[n].d; askChoice(); } else finish(true); };
    const go = (dn) => {
      if (!browse || ending) return; if (dn === 0) { finish(); return; }
      const n = (station + dn + browse.length) % browse.length; bFrom = { p: cam.position.clone(), l: lookNow.clone(), f: cam.fov }; station = n; bU = 0; plaque();
    };
    const plaque = () => { const b = browse[station]; plq.classList.remove('on'); setTimeout(() => { plq.querySelector('small').textContent = b.kicker || ''; plq.querySelector('b').textContent = b.title || ''; plq.querySelector('p').textContent = b.text || ''; plq.classList.add('on'); $('.nav span').textContent = `${station + 1} / ${browse.length}`; }, 260); };
    const key = (e) => {
      if (held && choice) { const n = +e.key; if (n >= 1 && n <= choice.options.length) { e.preventDefault(); e.stopPropagation(); picked = choice.options[n - 1].id; finish(); } if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); } return; }
      if (browse) { if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); e.stopPropagation(); go(-1); } else if (e.code === 'ArrowRight' || e.code === 'KeyD' || e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); go(1); } else if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(); } return; }
      if (e.code === 'Escape') { e.preventDefault(); e.stopPropagation(); skipAll(); return; }
      if (askOn) { const n = +e.key, A = askOn.ask; if (n >= 1 && n <= A.options.length) { e.preventDefault(); e.stopPropagation(); pickAsk(A.options[n - 1].id); } else if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); } return; }
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) { down = true; next(); } }
    };
    const keyUp = (e) => { if (e.code === 'Space' || e.code === 'Enter') down = false; };
    window.addEventListener('keydown', key, true); window.addEventListener('keyup', keyUp, true); window.addEventListener('resize', size);
    el.addEventListener('pointerdown', (e) => { if (qteOn && !e.target.closest('button')) down = true; }); el.addEventListener('pointerup', () => { down = false; }); el.addEventListener('pointercancel', () => { down = false; });
    askEl.onclick = (e) => { const b = e.target.closest('button[data-a]'); if (b) { e.stopPropagation(); pickAsk(b.dataset.a); } };
    $('.skip').onclick = (e) => { e.stopPropagation(); skipAll(); };
    $('.nav').onclick = (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); go(+b.dataset.n); } };
    cv.onclick = () => next();

    const lookNow = new THREE.Vector3(), pA = new THREE.Vector3(), lA = new THREE.Vector3(), up = new THREE.Vector3();
    const frameCam = (sh, u) => {
      const e = (EASE[sh.e || 'soft'] || EASE.soft)(clamp(u, 0, 1)), p1 = V(sh.p), l1 = V(sh.l);
      pA.copy(p1); lA.copy(l1);
      if (sh.p2) pA.lerp(V(sh.p2), e); else pA.addScaledVector(l1.clone().sub(p1), 0.02 * e * (sh.lock ? 0 : 1));   // (never quite still: a breath of a push-in)
      if (sh.l2) lA.lerp(V(sh.l2), e);
      if (sh.arc) { const s = Math.sin(Math.PI * e); pA.x += sh.arc[0] * s; pA.y += sh.arc[1] * s; pA.z += sh.arc[2] * s; }
      const f = sh.f2 != null ? sh.f + (sh.f2 - sh.f) * e : sh.f || 30, d = pA.distanceTo(lA), hh = (sh.shake ?? 0.12) * (reduced() ? 0 : 1);
      // (hand-held: slow drifts of the aim, a faster tremble under them - scaled by the lens so a long one shakes more)
      lA.x += (Math.sin(t * 1.3 + i) * 0.6 + Math.sin(t * 3.1 + i * 2) * 0.25 + Math.sin(t * 7.7) * 0.08 * hh) * 0.012 * d * hh;
      lA.y += (Math.sin(t * 1.7 + i * 3) * 0.6 + Math.sin(t * 4.3 + i) * 0.25 + Math.sin(t * 9.1) * 0.08 * hh) * 0.009 * d * hh;
      cam.position.copy(pA); cam.fov = f; const roll = (sh.roll || 0) + (sh.roll2 != null ? (sh.roll2 - (sh.roll || 0)) * e : 0) + Math.sin(t * 0.9 + i) * 0.004 * hh;
      up.set(Math.sin(roll), Math.cos(roll), 0); cam.up.copy(up); cam.lookAt(lA); lookNow.copy(lA); cam.updateProjectionMatrix();
      if (sh.focus) { focusAt.set(sh.focus[0], sh.focus[1], sh.focus[2]); if (sh.focus2) focusAt.lerp(V(sh.focus2), e); } else focusAt.copy(lA);
      { const fd = cam.position.distanceTo(focusAt); eye.position.copy(cam.position); eye.position.y += 0.25; eye.intensity = (sh.fill ?? def.fill ?? 1) * 1.1 * fd * fd; }
    };
    const step = (dt) => {
      if (!on) return; t += dt; size();
      if (!built) { R.setClearColor(0x000000); return; }
      k._tick(t, dt);
      if (browse) {
        const b = browse[station]; bU = Math.min(1, bU + dt / 1.6);
        const e = EASE.io(bU), sh = bFrom ? { p: bFrom.p.toArray(), l: bFrom.l.toArray(), f: bFrom.f, p2: b.p, l2: b.l, f2: b.f || 30, e: 'lin', shake: 0.08, lock: true } : { p: b.p, l: b.l, f: b.f || 30, shake: 0.08, lock: true };
        frameCam(sh, bFrom ? e : 1); if (bFrom) cam.position.y += Math.sin(Math.PI * e) * 0.25;
        fade.style.opacity = String(clamp(1 - (t - openT) / 0.8, 0, 1)); draw(null); return;
      }
      let sh = shots[i]; if (!sh) return;
      let u = (t - t0) / sh.d;
      if ((u >= 1 || (sh._cut && t >= sh._cut)) && !held) {
        if (askOn) pickAsk(askOn.ask.def ?? askOn.ask.options[askOn.ask.options.length - 1].id, true);
        if (qteOn) { const Q = qteOn.qte; doneQte(Q.kind === 'time' ? 'miss' : Q._p >= 1 ? 'good' : Q._p >= 0.6 ? 'ok' : 'miss'); }
        const n = after(i);
        if (n < 0) { if (choice && !picked) askChoice(); else finish(); u = Math.min(u, 1); } else { enter(n); sh = shots[i]; u = 0; }
      }
      const into0 = t - t0;
      // the subtitle of this moment (several in a shot share it out by their length)
      const L = sh._subs || [];
      if (L.length && !held && !askOn) { const tot = L.reduce((s, x) => s + readTime(x.text), 0); let acc = 0, cur = null; const at = into0 / sh._sd * tot; for (const x of L) { acc += readTime(x.text); if (at < acc) { cur = x; break; } } setSub(into0 > sh._sd * 0.985 ? null : cur); }
      else if (!held && !askOn) setSub(null);
      // a question asked while the scene runs on: its time is the shot's own, a default answer when it is gone
      if (sh.ask && !sh._asked && !held) {
        const A = sh.ask; if (into0 >= A._at && !askOn) openAsk(sh);
        if (askOn) { const left = 1 - (into0 - A._at) / A.time; askEl.querySelector('.tm i').style.transform = `scaleX(${clamp(left, 0, 1)})`; if (left <= 0) pickAsk(A.def ?? A.options[A.options.length - 1].id, true); }
      }
      // a quick-time event: a press in the zone, a hold, a flurry - what it earned goes on with the scene
      if (sh.qte && !sh._q && !held) {
        const Q = sh.qte, x = (into0 - Q.from) / Q.len;
        if (x >= 0 && !qteOn) openQte(sh);
        if (qteOn) {
          if (Q.kind === 'time') qEl.querySelector('.mk').style.left = `${clamp(x, 0, 1) * 100}%`;
          else { if (Q.kind === 'hold' && down) { Q._p = Math.min(1, Q._p + dt / (Q.need || 1.6)); try { Q.onProgress?.(Q._p, k); } catch (e) { /* its flourish */ } } qEl.querySelector('.fill').style.transform = `scaleX(${Q._p})`; if (Q._p >= 1) doneQte('good'); }
          if (qteOn && x >= 1) doneQte(Q.kind === 'time' ? 'miss' : Q._p >= 0.6 ? 'ok' : 'miss');
        }
      }
      try { sh.run?.(k, clamp(u, 0, 1), t - t0, res); } catch (e) { /* (a shot's flourish) */ }
      if (!sh.card) frameCam(sh, held ? 1 : u);
      // fades: out of black at the start, through black into a shot marked dip, to black at the very end
      let fo = 0; const into = t - t0, left = sh._cut ? sh._cut - t : sh.d - into, nxi = after(i), nx = nxi >= 0 ? shots[nxi] : null;
      if (i === 0 || sh.cut === 'dip') fo = Math.max(fo, 1 - into / 0.5);
      if (!held && nx && nx.cut === 'dip') fo = Math.max(fo, 1 - left / 0.4);
      if (sh.card) fo = 1;
      if (!ending) { fade.style.transition = 'none'; fade.style.opacity = String(clamp(fo, 0, 1)); }
      prog.style.width = `${clamp((shots.slice(0, i).reduce((s, x) => s + x.d, 0) + Math.min(into, sh.d)) / total, 0, 1) * 100}%`;
      if (!sh.card) draw(sh);
    };
    const loop = (now) => { if (!on) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt); requestAnimationFrame(loop); };

    // the set built behind the title card (a frame first, so the card is up), then the first shot out of black
    const build = async () => {
      try {
        if (def.needsCar && !carModel()) await loadCarModel().catch(() => {});
        await new Promise((r) => setTimeout(r, 60));
        const out = def.build(k, o.ctx || {}) || {};
        shots = (out.shots || []).filter(Boolean); choice = out.choice || def.choice || null; browse = out.browse || null;
        for (const sh of shots) { sh.d = sh.d || 3; sh.d0 = sh.d; }
        total = shots.reduce((s, x) => s + x.d, 0) || 1;
        if (!shots.length && !browse) throw new Error('no shots');
        try { R.compile(S, cam); } catch (e) { /* compiled as drawn */ }
      } catch (e) { console.error('[cine] scene', def.id, e); on = false; try { k._dispose(); comp?.dispose?.(); bokeh?.dispose?.(); R.dispose(); R.forceContextLoss?.(); } catch (e2) { /* gone */ } window.removeEventListener('keydown', key, true); window.removeEventListener('resize', size); el.remove(); end({ skipped: true, failed: true, error: String(e?.message || e) }); return; }
      const hold = reduced() || o.fast ? 250 : def.title ? 1500 : 300;
      setTimeout(() => {
        if (!on) return; built = true; el.classList.add('live'); showCard(null); size(); openT = t;
        if (browse) { el.classList.add('browse'); $('.skip').style.display = 'none'; prog.style.display = 'none'; station = 0; bU = 1; plaque(); }
        else enter(ok(shots[0]) ? 0 : Math.max(0, after(0)));
      }, hold);
    };
    window.__cine = { id: def.id, step, next, finish, skip: skipAll, pick: (id) => { picked = id; finish(); }, answer: (id) => pickAsk(id), press, hold: (v) => { down = !!v; }, res, go, get state() { return { built, i, n: shots.length, t, held, ending, browse: browse?.length || 0, station, choice: choice && choice.options ? choice.options.map((x) => x.id) : choice ? ['?'] : null, ask: askOn ? askOn.ask.options.map((x) => x.id) : null, qte: qteOn ? qteOn.qte.kind : null, sub: sub.classList.contains('on') ? sub.querySelector('p').textContent : '', shots: shots.map((s) => s.d) }; }, jump(n, u = 0.5) { if (!built) return; enter(clamp(n, 0, shots.length - 1)); t0 = t - shots[i].d * u; } };
    size(); requestAnimationFrame((now) => { last = now; requestAnimationFrame(loop); });
    build();
  });
}

/** scenes one after another (each a def, its options): the results in order */
export async function playCines(list) { const out = []; for (const [def, o] of list) out.push(await playCine(def, o)); return out; }
