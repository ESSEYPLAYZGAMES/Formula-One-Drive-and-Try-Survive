// Contract talks, at the table (a career): you are the driver, talking terms for your own contract. The team's
// motorhome in 3D - its team principal across the table from you with its sporting director, coffee, the contract
// between you, the team's colours on the wall - your agent at your side (heard, not seen: the camera is your eyes), and
// the sheet beside it: your terms. A contract is the whole deal: salary, years, your standing in the garage (number
// one, equal, number two), a win bonus and a release clause (what another team would have to pay to take you while it
// runs - the team wants it high, your agent low). It starts at the team's own offer; you ask, the team answers - the
// career's rules (career/Say.js talkProfile, talkEval, talkRespond): how far it will move is your bargaining power with
// it (career/Seat.js leverage), and a counter names the term most in the way; ask too much and its patience goes,
// twice as fast for an insult, until it ends the talks (its offer stands as it was). WALK AWAY leaves the table - a team
// that wants you badly enough may call your agent back. The camera cuts to whoever speaks; the principal nods, or
// shakes his head. A deal is signed on the table.
// The sheet fits the screen: the controls in the middle, their read, the cost and the two actions pinned at its foot.
// Talk lines can be hurried (a click on the line or Space finishes it, a second goes on), and the sheet stays usable
// while the agent talks - only MAKE OFFER waits. No frosted glass over the 3D (the laptop's GPU). Given the hub's
// renderer (o.renderer), the room borrows its canvas rather than opening a second WebGL context, and hands it back.
import * as THREE from 'three';
import { makePerson } from '../world/People.js';
import { ensureMotion, reduced, keys, seg } from './Motion.js';
import { talkProfile, talkEval, talkRespond, termsText } from '../career/Say.js';
import { leverageParts, agentOf } from '../career/Seat.js';

const CSS = `
#nego { position: fixed; inset: 0; z-index: 46; background: #15161a; color: #151a22; font-family: var(--k-font); opacity: 0; transition: opacity var(--m-slow) ease; --tc: #e10600; }
#nego.show { opacity: 1; }
/* (the room comes up out of a slight push: a scene reveal - opacity and transform only, never a blur over the canvas) */
#nego .ng-3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; filter: none; opacity: 0; transform: scale(1.04); transition: opacity .5s ease, transform .9s cubic-bezier(.2,.8,.2,1); }
#nego.show .ng-3d { opacity: 1; transform: none; }
#nego .tag { position: absolute; left: 22px; top: 18px; display: flex; gap: 8px; font: 800 12px/1 var(--k-font); letter-spacing: .16em; color: #fff; }
#nego .tag b { background: var(--tc); padding: 7px 10px; border-radius: 6px; } #nego .tag span { background: rgba(0,0,0,.6); padding: 7px 10px; border-radius: 6px; }
#nego .glass { background: rgba(255,255,255,.95); border-radius: 22px; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
/* the offer sheet: its height is its content's (centred on the right), the actions always in sight at its foot */
#nego .sheet { position: absolute; right: 20px; top: 20px; bottom: 20px; margin: auto 0; height: max-content; max-height: calc(100% - 40px); width: min(380px, calc(100vw - 40px));
  display: flex; flex-direction: column; overflow: hidden; padding: 18px 18px 14px; opacity: 0; }
#nego.show .sheet { opacity: 1; animation: m-in-right var(--m-slow) var(--ease-out) 120ms both; }
#nego h2 { margin: 0; font: 800 20px/1.15 var(--k-font); letter-spacing: .02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#nego .sub { color: #5d6675; font-size: 12px; margin: 3px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#nego .body { flex: 1 1 auto; min-height: 0; overflow: hidden; padding-top: 10px; }
@media (max-height: 699px) { #nego .body { overflow-y: auto; overscroll-behavior: contain; } }
#nego .wants { display: flex; flex-wrap: nowrap; gap: 6px; overflow: hidden; }
#nego .wants span { flex: none; font: 600 11px/1 var(--k-font); padding: 5px 7px; border-radius: 999px; background: rgba(21,26,34,.06); color: #3a4350; white-space: nowrap; }
#nego .wants span i { font-style: normal; font-size: 8px; color: var(--tc); letter-spacing: -1.5px; margin-left: 4px; vertical-align: 1px; }
#nego .lbl { display: flex; align-items: center; gap: 8px; height: 16px; margin: 12px 0 4px; font: 700 10.5px/1 var(--k-font); letter-spacing: .16em; color: #6b7480; text-transform: uppercase; }
#nego .lbl > span:first-child { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#nego .lbl b { flex: none; color: #151a22; letter-spacing: .04em; font-size: 13px; }
#nego input[type=range] { display: block; width: 100%; height: 18px; margin: 0; padding: 0; border: 0; background: none; accent-color: var(--tc); }
#nego .line { display: grid; grid-template-columns: 64px minmax(0,1fr); align-items: center; gap: 8px; margin-top: 10px; }
#nego .line > span { display: grid; justify-items: start; gap: 3px; font: 700 10.5px/1.2 var(--k-font); letter-spacing: .16em; color: #6b7480; text-transform: uppercase; }
#nego .k-seg { display: grid; width: 100%; }
#nego .k-seg > button { min-height: 32px; padding: 0 6px; font: 700 12px/1 var(--k-font); cursor: pointer; }
#nego .k-seg > button.want { box-shadow: inset 0 0 0 1.5px #f5b400; }
#nego .two { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 14px; }
/* (what they asked for: an amber chip on that control's row - one click meets it) */
#nego .mt { flex: none; display: none; align-items: center; height: 18px; padding: 0 7px; margin: 0; border: 0; border-radius: 9px; background: #fff3cf; box-shadow: inset 0 0 0 1px #f5b400; color: #8a5a00;
  font: 800 10px/1 var(--k-font); letter-spacing: .04em; text-transform: none; white-space: nowrap; cursor: pointer; }
#nego .mt.on { display: inline-flex; animation: m-pop var(--m-base) var(--ease-pop) both; }
#nego .foot { flex: none; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(21,26,34,.08); }
#nego .readrow { display: grid; grid-template-columns: minmax(0,1fr) auto auto; align-items: center; gap: 10px; }
#nego .meter { position: relative; height: 10px; border-radius: 5px; background: linear-gradient(90deg, #e5484d, #f5b400 50%, #1fae64); overflow: hidden; }
#nego .meter i { position: absolute; inset: 0; transform: translate3d(calc(var(--v, .5) * 100% - 2px), 0, 0); transition: transform var(--m-slow) var(--ease-out); }
#nego .meter i::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 2px; background: #151a22; box-shadow: 0 0 0 2px #fff; }
#nego .read { min-width: 74px; font-size: 12px; font-weight: 600; color: #3a4350; white-space: nowrap; }
#nego .pips { display: inline-flex; gap: 4px; } #nego .pips i { width: 9px; height: 9px; border-radius: 50%; background: #151a22; transition: background-color var(--m-slow), transform var(--m-slow); } #nego .pips i.gone { background: #d6dbe3; transform: scale(.7); }
#nego .cost { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; margin-top: 10px; padding: 8px 10px; border-radius: 12px; background: rgba(21,26,34,.05); }
#nego .cost small { display: block; font: 700 9.5px/1.2 var(--k-font); letter-spacing: .14em; color: #6b7480; text-transform: uppercase; white-space: nowrap; }
#nego .cost b { display: block; margin-top: 2px; font-size: 13px; color: #151a22; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#nego .cost .bad { color: #d6202e; }
#nego .cost .bo { grid-column: 1 / -1; font-size: 11.5px; color: #3a4350; }
#nego .acts { display: flex; gap: 8px; margin-top: 10px; }
#nego .acts button { position: relative; flex: 1; height: 44px; font: 800 12px/1 var(--k-font); letter-spacing: .1em; padding: 0 10px; border-radius: 12px; border: 1px solid #d6dbe3; background: #fff; color: #1d2430; cursor: pointer;
  transition: transform var(--m-fast) var(--ease-out), opacity var(--m-fast); }
#nego .acts button:hover:not(:disabled) { transform: translate3d(0,-1px,0); }
#nego .acts button:active:not(:disabled) { transform: scale(.97); }
#nego .acts button.go { background: var(--tc); border-color: var(--tc); color: #fff; }
#nego .acts button:disabled { opacity: .45; cursor: default; }
#nego .talk { position: absolute; left: 22px; bottom: 22px; width: min(620px, calc(100vw - 440px)); padding: 14px 18px 16px; cursor: pointer; transform: translate3d(0,20px,0); opacity: 0;
  transition: transform var(--m-slow) var(--ease-out), opacity var(--m-base) ease; }
#nego .talk.on { transform: none; opacity: 1; }
#nego .talk small { display: flex; align-items: center; justify-content: space-between; gap: 10px; font: 800 10.5px/1 var(--k-font); letter-spacing: .18em; color: #6b7480; text-transform: uppercase; margin-bottom: 7px; }
#nego .talk small kbd { letter-spacing: .04em; text-transform: none; }
#nego .talk p { margin: 0; font: 500 clamp(16px, 1.7vw, 20px)/1.4 Georgia, 'Times New Roman', serif; min-height: 1.4em; }
html.m-off #nego .ng-3d { transition: opacity 1ms; transform: none; }
@media (prefers-reduced-motion: reduce) { #nego .ng-3d { transition: opacity 1ms; transform: none; } }
@media (max-width: 860px) { #nego .sheet { top: auto; bottom: 10px; right: 10px; left: 10px; width: auto; height: auto; max-height: 62vh; margin: 0; } #nego .talk { left: 10px; right: 10px; width: auto; bottom: calc(62vh + 20px); } }
`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pick = (a) => a[(Math.random() * a.length) | 0];
const money = (m) => `$${(Math.round(m * 10) / 10).toFixed(1)}M`;
// (your agent is the paddock's own - career/Seat.js agentOf, the one who texts you; the team principal and the sporting
// director across the table are generic and unnamed: no real team's people are ever depicted)

/** the motorhome's meeting room, in 3D: two people across the table (o.seatA, o.seatB), the camera cutting between them */
class MeetingRoom {
  constructor(host, o) {
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    let R;
    if (o.renderer) {
      // (the hub's renderer, lent: its canvas moves in here, its settings are noted to be put back on dispose)
      R = this.renderer = o.renderer; this.canvas = R.domElement; this.shared = true;
      this.back = { parent: this.canvas.parentNode, next: this.canvas.nextSibling, cls: this.canvas.className, tm: R.toneMapping, ex: R.toneMappingExposure, size: R.getSize(new THREE.Vector2()) };
      this.canvas.className = 'ng-3d'; host.prepend(this.canvas);
    } else {
      this.canvas = document.createElement('canvas'); this.canvas.className = 'ng-3d'; host.prepend(this.canvas);
      R = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
      R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    }
    R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.08;
    const S = this.scene = new THREE.Scene(); S.background = new THREE.Color('#1b1c20');
    this.people = [];
    const tc = new THREE.Color(o.color || '#e10600');
    // the room: a warm floor, a pale back wall in the team's colours with its name, a window onto the paddock
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ color: '#6f5642', roughness: 0.55 })); floor.rotation.x = -Math.PI / 2; S.add(floor);
    const wallM = new THREE.MeshStandardMaterial({ color: '#e9e6e1', roughness: 0.9 });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallM); back.position.set(-2.3, 2, 0); back.rotation.y = Math.PI / 2; S.add(back);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallM); side.position.set(1, 2, -2.6); S.add(side);
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.16), new THREE.MeshBasicMaterial({ color: tc })); stripe.position.set(-2.29, 1.25, 0); stripe.rotation.y = Math.PI / 2; S.add(stripe);
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 256; const x = cv.getContext('2d');
    x.font = '900 120px "Segoe UI", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#' + tc.getHexString(); x.fillText(String(o.team || '').toUpperCase(), 512, 130);
    const wt = new THREE.CanvasTexture(cv); wt.colorSpace = THREE.SRGBColorSpace;
    const word = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.85), new THREE.MeshBasicMaterial({ map: wt, transparent: true, opacity: 0.85 })); word.position.set(-2.28, 2.35, -0.2); word.rotation.y = Math.PI / 2; S.add(word);
    const wcv = document.createElement('canvas'); wcv.width = 256; wcv.height = 256; const wx = wcv.getContext('2d'), g = wx.createLinearGradient(0, 0, 0, 256);
    if (o.night) { g.addColorStop(0, '#0b1230'); g.addColorStop(0.7, '#3a2a55'); g.addColorStop(1, '#f2a65a'); } else { g.addColorStop(0, '#8ec5ff'); g.addColorStop(0.75, '#dcefff'); g.addColorStop(1, '#a7b3a0'); }
    wx.fillStyle = g; wx.fillRect(0, 0, 256, 256);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wcv) })); win.position.set(0.6, 1.75, -2.59); S.add(win);
    // the table, the chairs
    const wood = new THREE.MeshStandardMaterial({ color: '#2b2d33', roughness: 0.35, metalness: 0.2 }), steel = new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.3, metalness: 0.8 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.05, 2.3), wood); top.position.set(0, 0.715, 0.1); S.add(top);
    for (const [lx, lz] of [[-0.5, -0.95], [0.5, -0.95], [-0.5, 1.15], [0.5, 1.15]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), steel); leg.position.set(lx, 0.35, lz); S.add(leg); }
    const seatM = new THREE.MeshStandardMaterial({ color: '#1d1f24', roughness: 0.7 });
    const chair = (cx, cz, face) => { const g2 = new THREE.Group(); const s = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.5), seatM); s.position.y = 0.46; const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.48), seatM); b.position.set(-0.24, 0.78, 0); const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.44, 8), steel); p.position.y = 0.22; g2.add(s, b, p); g2.position.set(cx, 0, cz); g2.rotation.y = face; S.add(g2); };
    chair(-1.0, -0.35, 0); chair(-1.0, 0.6, 0); chair(1.0, -0.35, Math.PI); chair(1.0, 0.6, Math.PI);
    // the two across the table (seatA, seatB: their makePerson looks - the team principal and its sporting director in
    // your own talks; else, as the owner's talks had it, a driver in their team's polo and their agent beside them)
    this.driver = makePerson({ pose: 'sit', ...(o.seatA || { kit: o.dColor ? 'polo' : 'jacket', color: o.dColor || '#2d3340', accent: o.dColor2 || '#ffffff', driver: o.driver, jitter: 0.01, teamName: o.dTeam || null }) });
    this.driver.group.position.set(-1.0, 0, -0.35); S.add(this.driver.group); this.people.push(this.driver);
    this.agent = makePerson({ pose: 'sit', ...(o.seatB || { kit: 'jacket', color: '#1c2a44', jitter: 0.015, ...(o.agentLook || {}) }) });
    this.agent.group.position.set(-1.0, 0, 0.6); S.add(this.agent.group); this.people.push(this.agent);
    // on the table: the contract and a pen, coffee, a folder on your side
    const pcv = document.createElement('canvas'); pcv.width = 256; pcv.height = 360; const px = pcv.getContext('2d');
    px.fillStyle = '#fbfbf8'; px.fillRect(0, 0, 256, 360); px.fillStyle = '#151a22'; px.font = '800 18px "Segoe UI", Arial'; px.fillText('DRIVER AGREEMENT', 22, 40); px.fillStyle = '#' + tc.getHexString(); px.fillRect(22, 50, 80, 4);
    px.fillStyle = '#b8bcc4'; for (let i = 0; i < 14; i++) px.fillRect(22, 78 + i * 16, 180 + (i * 37) % 30, 5); px.fillStyle = '#151a22'; px.fillRect(22, 320, 110, 2);
    const pt = new THREE.CanvasTexture(pcv); pt.colorSpace = THREE.SRGBColorSpace;
    this.paper = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.34), new THREE.MeshStandardMaterial({ map: pt, roughness: 0.8 })); this.paper.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); this.paper.position.set(0.32, 0.743, -0.25); S.add(this.paper);
    this.pen = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 8), new THREE.MeshStandardMaterial({ color: '#111', metalness: 0.6, roughness: 0.3 })); this.pen.rotation.set(0, 0, Math.PI / 2); this.pen.rotation.y = 0.5; this.pen.position.set(0.42, 0.75, -0.05); S.add(this.pen);
    const cup = (cx, cz) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.035, 0.09, 16), new THREE.MeshStandardMaterial({ color: '#f4f4f2', roughness: 0.4 })); c.position.set(cx, 0.786, cz); const co = new THREE.Mesh(new THREE.CircleGeometry(0.038, 16), new THREE.MeshStandardMaterial({ color: '#3b2416', roughness: 0.2 })); co.rotation.x = -Math.PI / 2; co.position.set(cx, 0.825, cz); S.add(c, co); };
    cup(-0.35, -0.6); cup(-0.38, 0.85); cup(0.4, 0.55);
    const folder = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.02, 0.36), new THREE.MeshStandardMaterial({ color: tc, roughness: 0.5 })); folder.position.set(0.42, 0.75, 0.25); folder.rotation.y = 0.15; S.add(folder);
    // the light: the room's warm ceiling lights, the window, a soft fill on the faces
    S.add(new THREE.HemisphereLight(0xfff1e0, 0x3a3027, 1.05));
    const key = new THREE.DirectionalLight(0xfff0dc, 1.7); key.position.set(1.8, 3.2, 1.5); key.target.position.set(-0.8, 1, 0); S.add(key, key.target);
    const winL = new THREE.DirectionalLight(o.night ? 0x8a8fe0 : 0xd8ecff, o.night ? 0.5 : 1.1); winL.position.set(0.6, 2, -3); S.add(winL);
    const lamp = new THREE.PointLight(0xffd9a8, 6, 5, 2); lamp.position.set(-0.2, 2.4, 0.1); S.add(lamp);
    this.cam = new THREE.PerspectiveCamera(32, 1, 0.05, 40);
    this.shots = {
      open: { p: V3(3.6, 2.1, 2.6), l: V3(-0.6, 0.95, 0.1), f: 34 },
      wide: { p: V3(2.3, 1.55, 1.55), l: V3(-0.6, 0.95, 0.15), f: 34 },
      driver: { p: V3(0.55, 1.22, 0.25), l: V3(-0.92, 1.1, -0.35), f: 30 },
      agent: { p: V3(0.55, 1.22, 0.05), l: V3(-0.92, 1.1, 0.6), f: 30 },
      table: { p: V3(0.75, 1.35, 0.25), l: V3(0.05, 0.74, -0.2), f: 38 },
    };
    this.shot = 'wide'; this.cur = { p: this.shots.open.p.clone(), l: this.shots.open.l.clone() }; this.t = 0; this.on = true;
    this.talking = null; this.talkT = 0; this.react = null; this.reactT = 0; this.signT = -1;
    const loop = (now) => { if (!this.on) return; this.frame(Math.min(0.05, (now - (this.last || now)) / 1000)); this.last = now; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  /** cut (a new shot at once) or glide to a shot */
  cut(name, glide = false) { this.shot = name; if (!glide) { const s = this.shots[name]; this.cur.p.copy(s.p); this.cur.l.copy(s.l); } }
  say(who, secs) { this.talking = who; this.talkT = secs; }
  /** the reaction of the one in seat A (a driver, or the team principal): 'nod', 'shake', 'lean' (back in the chair) */
  reaction(kind) { this.react = kind; this.reactT = 1.4; }
  sign() { this.signT = 0; }
  frame(dt) {
    this.t += dt; const t = this.t, c = this.canvas, w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight;
    if (c.width !== Math.round(w * this.renderer.getPixelRatio()) || c.height !== Math.round(h * this.renderer.getPixelRatio())) { this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
    const s = this.shots[this.shot], k = 1 - Math.exp(-dt * 1.6);
    this.cur.p.lerp(s.p, k); this.cur.l.lerp(s.l, k);
    this.cam.position.copy(this.cur.p).add(new THREE.Vector3(Math.sin(t * 0.6) * 0.01, Math.sin(t * 0.9) * 0.007, Math.sin(t * 0.5) * 0.008));
    this.cam.lookAt(this.cur.l);
    if (Math.abs(this.cam.fov - s.f) > 0.01) { this.cam.fov += (s.f - this.cam.fov) * k; this.cam.updateProjectionMatrix(); }
    // the camera's frame shifted left of the offer sheet on a wide screen
    if (w > 860) this.cam.setViewOffset(w, h, Math.min(220, w * 0.14), 0, w, h); else this.cam.setViewOffset(w, h, 0, h * 0.2, w, h);
    // talking: the head moving with the words; listening: still, breathing
    this.talkT = Math.max(0, this.talkT - dt); this.reactT = Math.max(0, this.reactT - dt);
    for (const [who, P] of [['driver', this.driver], ['agent', this.agent]]) {
      const H = P.head, talk = this.talkT > 0 && this.talking === who;
      H.rotation.z = P.bow + (talk ? 0.05 * Math.sin(t * 6.1) * Math.max(0, Math.sin(t * 1.9)) : 0.012 * Math.sin(t * 0.7 + (who === 'agent' ? 1 : 0)));
      H.rotation.y = (talk ? 0.07 * Math.sin(t * 1.3) : 0.03 * Math.sin(t * 0.35)) + (who === 'agent' && !talk ? 0.18 : 0);   // (the agent glances at the driver)
    }
    if (this.reactT > 0) {
      const H = this.driver.head, e = this.reactT / 1.4;
      if (this.react === 'shake') H.rotation.y = Math.sin(t * 11) * 0.2 * e;
      else if (this.react === 'nod') H.rotation.z = this.driver.bow - Math.abs(Math.sin(t * 7)) * 0.16 * e;
      else if (this.react === 'lean') this.driver.group.position.x = -1.0 - 0.06 * Math.sin((1 - e) * Math.PI);
    }
    // signing: the contract slides across to the driver, the pen follows it
    if (this.signT >= 0) {
      this.signT += dt; const u = Math.min(1, this.signT / 1.2), e = u * u * (3 - 2 * u);
      this.paper.position.set(0.32 - 0.62 * e, 0.743, -0.25 + 0.0 * e); this.paper.rotation.z = -Math.PI / 2 + Math.PI * e;
      this.pen.position.set(0.42 - 0.66 * e, 0.75 + (u >= 1 ? 0.01 * Math.abs(Math.sin(this.signT * 14)) * Math.max(0, 1 - (this.signT - 1.2) / 1.2) : 0), -0.05 - 0.18 * e);
    }
    this.renderer.render(this.scene, this.cam);
  }
  dispose() {
    this.on = false;
    for (const p of this.people) p.dispose?.();
    this.scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.map?.dispose(); o.material.dispose?.(); } });
    if (this.shared) {
      // (the lent renderer goes home as it came: its canvas back in its place, its tone and its size; never lost)
      const R = this.renderer, B = this.back, c = this.canvas;
      c.className = B.cls; R.toneMapping = B.tm; R.toneMappingExposure = B.ex;
      const home = B.parent?.isConnected ? B.parent : document.getElementById('career');
      if (home) { if (B.next && B.next.parentNode === home) home.insertBefore(c, B.next); else home.prepend(c); } else c.remove();
      R.setSize(B.size.x, B.size.y, false);
    } else { this.renderer.dispose(); this.renderer.forceContextLoss?.(); this.canvas.remove(); }
  }
}


// ---- what is said: the team principal ('boss', seat A), its sporting director ('exec', seat B), your agent ('agent', heard) ----
const ROLE_TXT = { lead: 'number-one status', equal: 'equal status', support: 'the number-two seat' };
/** the team's answer in words, by what it is about (r: career/Say.js talkRespond) */
function lines(F, team, r) {
  const w = r.want || {};
  if (r.result === 'accept') return [['boss', pick([`Done. Welcome${r.renew ? ' back' : ''}, ${F}.`, 'We can live with that. Let\'s put it in writing.', `That works for ${team}. Where do you sign?`])], ['agent', pick(['Pleasure doing business.', 'Good. That\'s a fair deal.'])]];
  if (r.result === 'walk') return [['boss', pick(['I think we\'ve gone as far as we can. Our offer stands as it was - take it or leave it.', 'We\'re not moving again. The original offer is on the table. That\'s it.', 'Enough. You know what we offered. It\'s still there, until it isn\'t.'])]];
  if (r.insult) return [['exec', pick(['With respect, that isn\'t a serious number.', 'Are we in the same negotiation?', 'I\'m going to pretend I didn\'t read that.'])], ['boss', 'Try again. Something we can actually say yes to.']];
  switch (r.focus) {
    case 'salary': return [['boss', pick([`The money is the problem. ${money(w.salary)} a year is as far as we go right now.`, `We can do ${money(w.salary)} a year. Not more.`, `${money(w.salary)}. Everything else, we can talk about.`])]];
    case 'role': return w.role === 'lead' ? [['boss', 'Number one... we can live with that, if the rest is reasonable.']]
      : [['boss', pick([`${ROLE_TXT[w.role] ? `${ROLE_TXT[w.role][0].toUpperCase()}${ROLE_TXT[w.role].slice(1)}` : 'Equal status'} - that's what we can give you.`, 'Number one? Not here, not yet. Earn it on track.'])], ['exec', 'The car gets developed for whoever is quicker. That is the deal.']];
    case 'years': return [['exec', w.years >= 3 ? 'We want you for the long term. Three years.' : w.years === 1 ? 'One year. Let\'s see how it goes.' : pick(['Two years works for us. Not more, not less.', 'Two years. That\'s our plan.'])]];
    case 'winBonus': return [['exec', `We can go to ${money(w.winBonus)} a win. Win races and you'll be paid for them.`]];
    default: return [['boss', pick([`The release clause stays at ${money(w.releaseClause)} at least. We don't train drivers for other teams.`, `${money(w.releaseClause)} on the clause. If someone wants you, they pay.`])], ['agent', 'He wants to know he isn\'t trapped.']];
  }
}

/**
 * The talks over an offer to you. o: { c (the career), offer (career/Seat.js makeOffer: negotiable), look: { team,
 * color, color2, night }, renderer (optional: the hub's, lent and handed back), done(result) } -> result: { signed
 * (the team agreed your terms), terms ({ salary, years, role, winBonus, releaseClause }: signed with Career.acceptOffer),
 * walked (you left the table: Career.walkAway), ended (the team ended the talks: its offer stands as made) }
 */
export function showNegotiation(o) {
  ensureMotion();
  if (!document.getElementById('nego-css')) { const st = document.createElement('style'); st.id = 'nego-css'; st.textContent = CSS; document.head.appendChild(st); }
  const { c, offer: of } = o, T = c.teams[of.team] || { name: of.team, color: o.look?.color, color2: o.look?.color2 }, P = talkProfile(c, of), B = P.base;
  const me = c.drivers[c.playerId], F = String(me?.name || 'You').split(' ')[0], A = agentOf(c), agentName = A?.name || 'Your agent', renew = of.kind === 'renewal';
  const LP = leverageParts(c, of.team);
  const el = document.createElement('div'); el.id = 'nego'; el.className = 'k-light'; el.style.setProperty('--tc', o.look?.color || T.color || '#e10600'); document.body.appendChild(el);
  // (across the table: the team principal in the team's polo, its sporting director in a jacket - generic, unnamed)
  const seatA = { kit: 'polo', color: T.color || '#1c1f26', accent: T.color2 || '#ffffff', teamName: T.name, hair: '#8f8f8f', style: { hs: 'side', fh: 'stubble' }, seed: `boss|${T.name}`, jitter: 0.01 };
  const seatB = { kit: 'jacket', color: '#23262d', accent: T.color || '#ffffff', seed: `director|${T.name}`, hair: '#3a2c22', jitter: 0.015 };
  let room = null; try { room = new MeetingRoom(el, { ...(o.look || {}), team: T.name, renderer: o.renderer || null, seatA, seatB }); } catch (e) { room = null; }
  window.__negoRoom = room;   // (for the test console)
  const ui = document.createElement('div'); el.appendChild(ui);
  const ask = { salary: B.salary, years: B.years, role: B.role === 'reserve' ? 'equal' : B.role, winBonus: B.winBonus, releaseClause: B.releaseClause };
  // (busy: your ask is out and they are answering - PUT IT TO THEM waits; ending: the talks are over - nothing more)
  const total = P.patience; let busy = false, ending = false, want = null, jitter = (Math.random() - 0.5) * 0.06, pend = 0;
  const YEARS = [1, 2, 3], ROLES = [['lead', 'Number one'], ['equal', 'Equal'], ['support', 'Number two']];
  const salMax = Math.max(4, Math.ceil(Math.max(B.salary * 2, P.salaryMax * 1.4))), wbMax = Math.max(2, Math.ceil(Math.max(B.winBonus * 3, P.winBonusMax * 1.5) * 4) / 4), rcMax = Math.max(10, Math.ceil(B.releaseClause * 1.5));
  const same = () => ask.salary === B.salary && ask.years === B.years && ask.role === B.role && ask.winBonus === B.winBonus && ask.releaseClause === B.releaseClause;
  ui.innerHTML = `<div class="tag"><b>MOTORHOME</b><span>${renew ? 'CONTRACT RENEWAL' : 'CONTRACT TALKS'} · ${esc(T.name.toUpperCase())}</span></div>
    <div class="talk glass" role="button" tabindex="-1" aria-label="Next line"><small><span class="who"></span><kbd class="k-kbd">Space</kbd></small><p></p></div>
    <div class="sheet glass" role="dialog" aria-label="Your terms">
      <h2>${esc(T.name)}</h2><div class="sub">Their offer: ${esc(termsText(B))}</div>
      <div class="body">
        <div class="wants" title="Your bargaining power with ${esc(T.name)}: what makes it">${[`<span>Bargaining power <b>${LP.v}</b> · ${esc(LP.label)}</span>`, ...LP.parts.slice(0, 3).map((x) => `<span title="${esc(x.text)}">${esc(x.text)} <i style="letter-spacing:0;font-size:10px">${x.d > 0 ? '+' : ''}${x.d}</i></span>`)].join('')}</div>
        <div class="lbl"><span>Salary a year</span><button class="mt" data-meet="salary"></button><b data-v="salary"></b></div><input type="range" data-k="salary" min="0.5" max="${salMax}" step="0.5" aria-label="Salary a year">
        <div class="line"><span>Length<button class="mt" data-meet="years"></button></span><div class="k-seg" data-seg="years">${YEARS.map((y) => `<button data-y="${y}">${y} season${y > 1 ? 's' : ''}</button>`).join('')}</div></div>
        <div class="line"><span>Status<button class="mt" data-meet="role"></button></span><div class="k-seg" data-seg="role">${ROLES.map(([k, n]) => `<button data-r="${k}">${n}</button>`).join('')}</div></div>
        <div class="two">
          <div><div class="lbl" title="Paid for every race you win"><span>Win bonus</span><button class="mt" data-meet="winBonus"></button><b data-v="winBonus"></b></div><input type="range" data-k="winBonus" min="0" max="${wbMax}" step="0.25" aria-label="Win bonus"></div>
          <div><div class="lbl" title="Release clause: what another team must pay to take you while the contract runs - the team wants it high, your agent low"><span>Clause</span><button class="mt" data-meet="releaseClause"></button><b data-v="releaseClause"></b></div><input type="range" data-k="releaseClause" min="0.5" max="${rcMax}" step="0.5" aria-label="Release clause"></div>
        </div>
      </div>
      <div class="foot">
        <div class="readrow"><div class="meter" title="How your terms look to them"><i></i></div><span class="read" data-read></span><span class="pips" title="Their patience">${Array.from({ length: Math.ceil(total) }, () => '<i></i>').join('')}</span></div>
        <div class="cost"></div>
        <div class="acts"><button data-a="walk">WALK AWAY</button><button class="go" data-a="offer">PUT IT TO THEM</button></div>
      </div>
    </div>`;
  const $ = (s) => ui.querySelector(s);
  const body = $('.body');
  // (below 700 px of height the controls may scroll - the only place on this screen that can)
  const mq = window.matchMedia?.('(max-height: 699px)'), fit = () => body.toggleAttribute('data-scroll-ok', !!mq?.matches);
  fit(); mq?.addEventListener?.('change', fit);
  const paint = () => {
    for (const k of ['salary', 'winBonus', 'releaseClause']) { $(`[data-k="${k}"]`).value = ask[k]; $(`[data-v="${k}"]`).textContent = k === 'winBonus' && !ask[k] ? 'none' : money(ask[k]); }
    seg($('[data-seg="years"]'), YEARS.indexOf(ask.years)); seg($('[data-seg="role"]'), ROLES.findIndex(([k]) => k === ask.role));
    // how your terms look to them: their own offer at the right, the edge of what they would give in the middle (a read, not a number: a little off either way)
    const E = talkEval(c, of, ask), v = Math.max(0, Math.min(1, 0.5 + E.u * 0.5 + jitter));
    $('.meter i').style.setProperty('--v', v.toFixed(3));
    $('[data-read]').textContent = same() ? 'Their offer' : E.over ? 'Past their limit' : E.ok ? (E.u > 0.5 ? 'They\'d sign' : 'Just about') : E.u > -0.5 ? 'A stretch' : 'No chance';
    $('[data-read]').title = E.over ? `Further than ${T.name} will go on ${{ salary: 'the money', role: 'your status', years: 'the length', winBonus: 'the win bonus', clause: 'the release clause' }[E.over]}` : '';
    ui.querySelectorAll('.pips i').forEach((p, i) => p.classList.toggle('gone', i >= Math.ceil(P.patience)));
    $('.cost').innerHTML = `<div><small>A year</small><b>${money(ask.salary)}</b></div><div><small>Over the deal</small><b>${money(ask.salary * ask.years)}</b></div><div><small>A win</small><b>${ask.winBonus ? `+${money(ask.winBonus)}` : '-'}</b></div>`
      + `<div class="bo">${esc(renew ? 'Your new contract would start next season.' : of.kind === 'midseason' ? `From the next race${of.buyoutFee ? `: ${T.name} pay your ${money(of.buyoutFee)} release clause` : ''}.` : of.next ? `From next season${of.buyoutFee ? `: ${T.name} pay your ${money(of.buyoutFee)} release clause` : ''}.` : 'From the next race.')}</div>`;
    const go = $('[data-a="offer"]'); go.disabled = busy || ending; go.textContent = busy || ending ? '…' : same() ? 'SIGN AS OFFERED' : 'PUT IT TO THEM';
    $('[data-a="walk"]').disabled = ending;
  };
  /** what they would do, picked out on the sheet with a chip that meets it (null: none) */
  const showWant = (w) => {
    want = w; ui.querySelectorAll('.want').forEach((x) => x.classList.remove('want'));
    ui.querySelectorAll('.mt').forEach((m) => { m.classList.remove('on'); m.textContent = ''; });
    if (!w) return;
    const k = Object.keys(w)[0], m = ui.querySelector(`.mt[data-meet="${k}"]`); if (!m) return;
    if (k === 'years') ui.querySelector(`[data-y="${w.years}"]`)?.classList.add('want');
    else if (k === 'role') ui.querySelector(`[data-r="${w.role}"]`)?.classList.add('want');
    m.textContent = `TAKE: ${k === 'salary' || k === 'winBonus' || k === 'releaseClause' ? money(w[k]) : k === 'years' ? `${w.years}y` : w.role === 'lead' ? 'No. 1' : w.role === 'support' ? 'No. 2' : 'Equal'}`;
    m.title = `Their counter: ${k === 'salary' ? money(w.salary) + ' a year' : k === 'years' ? w.years + ' seasons' : k === 'role' ? ROLE_TXT[w.role] || 'equal status' : k === 'winBonus' ? money(w.winBonus) + ' a win' : `a ${money(w.releaseClause)} release clause`}`;
    m.classList.add('on');
  };
  // the conversation: lines one after another, typed out, the camera on whoever speaks (your agent: the table); a
  // click on the line or Space finishes it, a second goes on to the next
  const talk = $('.talk'), who = talk.querySelector('.who'), txt = talk.querySelector('p');
  const SHOT = { boss: 'driver', exec: 'agent', agent: 'wide' }, NAME = { boss: `${T.name} · team principal`, exec: `${T.name} · sporting director`, agent: `${agentName} · your agent` };
  let speech = null;
  const hush = () => { const s = speech; if (!s) return; clearInterval(s.iv); clearTimeout(s.hold); speech = null; };
  const speak = (seq, then) => {
    hush();
    const s = { iv: 0, hold: 0, typing: false, line: '' }; speech = s; let i = 0;
    s.next = () => {
      if (speech !== s) return;
      clearInterval(s.iv); clearTimeout(s.hold);
      if (i >= seq.length) { speech = null; then?.(); return; }
      const [w, line] = seq[i++];
      who.textContent = NAME[w] || w;
      room?.cut(SHOT[w] || 'wide'); if (w !== 'agent') room?.say(w === 'boss' ? 'driver' : 'agent', Math.min(4, 0.6 + line.length * 0.035));
      talk.classList.add('on'); txt.textContent = ''; s.line = line; s.typing = true;
      let n = 0; s.iv = setInterval(() => { n += 2; txt.textContent = line.slice(0, n); if (n >= line.length) s.held(); }, 22);
    };
    s.held = () => { if (speech !== s) return; clearInterval(s.iv); s.typing = false; txt.textContent = s.line; clearTimeout(s.hold); s.hold = setTimeout(s.next, 600 + s.line.length * 15); };
    s.next();
  };
  const advance = () => { const s = speech; if (!s) return false; if (s.typing) s.held(); else s.next(); return true; };
  let gone = false;
  const finish = (res) => {
    if (gone) return; gone = true;
    window.removeEventListener('keydown', onKey, true); unkeys(); mq?.removeEventListener?.('change', fit); hush(); clearTimeout(pend);
    el.classList.remove('show');
    setTimeout(() => { room?.dispose(); el.remove(); o.done?.({ signed: false, walked: false, ended: false, terms: null, ...res }); }, reduced() ? 0 : 280);
  };
  const send = () => {
    if (busy || ending || gone) return;
    if ($('[data-a="offer"]').disabled) return;
    busy = true; showWant(null);
    const r = talkRespond(c, of, ask); r.renew = renew; jitter = (Math.random() - 0.5) * 0.06;
    if (r.result === 'accept' || r.result === 'walk') ending = true;
    paint();
    room?.reaction(r.result === 'accept' ? 'nod' : r.result === 'counter' ? 'lean' : 'shake');
    room?.cut('wide', true);
    pend = setTimeout(() => speak(lines(F, T.name, r), () => {
      if (r.result === 'accept') { room?.cut('table'); room?.sign(); setTimeout(() => finish({ signed: true, terms: { ...ask } }), 3000); return; }
      if (r.result === 'walk') { setTimeout(() => finish({ ended: true }), 900); return; }
      busy = false;
      showWant(r.want || null);
      room?.cut('wide', true); paint();
    }), 250);
  };
  const walk = () => {
    if (ending || gone) return;
    ending = true; busy = true; clearTimeout(pend); showWant(null); paint();
    speak([['agent', pick(['We\'re going. Thank you for your time.', `Come on, ${F}. We have other calls to make.`, 'We\'ll think about it. Don\'t wait by the phone.'])], ['boss', pick(['Your call.', 'The door is open. For now.', 'Fine. You know where we are.'])]], () => finish({ walked: true }));
  };
  ui.addEventListener('input', (e) => { const k = e.target.dataset.k; if (k && !ending) { ask[k] = +e.target.value; paint(); } });
  ui.addEventListener('click', (e) => {
    if (e.target.closest('.talk')) { advance(); return; }
    const b = e.target.closest('button'); if (!b || b.disabled || ending) return;
    if (b.dataset.y) ask.years = +b.dataset.y; else if (b.dataset.r) ask.role = b.dataset.r;
    else if (b.dataset.a === 'offer') { send(); return; }
    else if (b.dataset.a === 'walk') { walk(); return; }
    else if (b.dataset.meet && want) { Object.assign(ask, want); showWant(null); }
    paint();
  });
  // keys: Enter puts your terms to them, Esc walks away (not mid-answer), Space moves the talk on; and nothing under this
  // screen (the hub) hears a key while it is up
  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
    else if (e.key === 'Escape') { e.preventDefault(); if (!busy && !ending) walk(); }
    else if (e.key === ' ' && !/^(INPUT|BUTTON|TEXTAREA|SELECT)$/.test(e.target?.tagName || '') && speech) { e.preventDefault(); advance(); }
  };
  window.addEventListener('keydown', onKey, true);
  const unkeys = keys(el, {});
  paint();
  requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 40);
  // the opening: the room, then the team sets out its offer - and your agent, what you have in hand
  setTimeout(() => { room?.cut('wide', true); }, 200);
  const riv = LP.parts.find((x) => x.k === 'rivals');
  const open = [['boss', renew ? pick([`${F}. We want to keep you. Here's what we have in mind.`, `Let's talk about next year, ${F}. You know our offer.`]) : pick([`${F}, thanks for coming. We want you in our car - here's the offer.`, `We've followed you closely, ${F}. Here's what we can do.`])]];
  open.push(['agent', riv ? `Before we start: ${riv.text.replace(/: offers? in hand| want you| has asked about you| have asked about you/g, '')} ${/offer/.test(riv.text) ? 'have made an offer too' : 'have been on the phone'}. Just so we all know where we are.` : P.lev >= 60 ? 'You know what he\'s worth. Let\'s not waste each other\'s time.' : 'Let\'s see what we can do.']);
  pend = setTimeout(() => { if (!busy && !ending) speak(open); }, 700);
}
