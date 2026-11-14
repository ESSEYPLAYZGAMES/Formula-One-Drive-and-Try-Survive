// The theatre: a finished race watched again from its tape (race/RaceTape.js) - the whole of it on a timeline to play,
// pause, run fast or slow and drag through; any driver to follow, from the fence, behind the car, on board, from the
// nose, from in front or from the air; the race's moments (the start, every pass for position, contacts and crashes,
// stops, retirements, the flag) marked on the timeline and listed to jump to, and played one after another as a reel
// (ALL, OVERTAKES, INCIDENTS); the running order at that moment down the side; and, paused on any frame, the photo
// mode. main.js owns the world: it gives this the tape, puts the cars where a frame says (host.pose), draws, and takes
// the screen back when it is closed.
import * as THREE from 'three';
import { F } from '../race/RaceTape.js';

const CSS = `
#theatre { position: fixed; inset: 0; z-index: 40; pointer-events: none; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #fff; user-select: none; }
#theatre.hide > * { opacity: 0; pointer-events: none !important; }
#theatre > * { transition: opacity .25s; }
#theatre button { font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .12em; color: #fff; background: rgba(14,16,22,.82); border: 1px solid rgba(255,255,255,.22); border-radius: 6px; padding: 8px 10px; cursor: pointer; pointer-events: auto; }
#theatre button:hover { border-color: #fff; } #theatre button.on { background: #e10600; border-color: #e10600; }
#theatre .top { position: absolute; left: 16px; top: 14px; display: flex; gap: 10px; align-items: center; }
#theatre .tag { font: 800 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .3em; background: #e10600; padding: 7px 10px; border-radius: 4px; }
#theatre .who { font: 300 20px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,.8); }
#theatre .who small { font: 600 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; opacity: .8; margin-left: 10px; }
#theatre .cap { position: absolute; left: 50%; top: 58px; transform: translateX(-50%); font: 700 12px/1.2 'Segoe UI', Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; background: rgba(14,16,22,.82); border-left: 4px solid #e10600; padding: 8px 12px; border-radius: 4px; opacity: 0; }
#theatre .cap.in { opacity: 1; }
#theatre .tower { position: absolute; left: 16px; top: 58px; width: 150px; background: rgba(12,14,20,.78); border-radius: 6px; padding: 5px 0; pointer-events: auto; max-height: calc(100vh - 190px); overflow: auto; }
#theatre .tower div { display: flex; align-items: center; gap: 7px; font: 700 11px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; padding: 3.5px 9px; cursor: pointer; }
#theatre .tower div:hover { background: rgba(255,255,255,.12); } #theatre .tower div.on { background: rgba(225,6,0,.55); } #theatre .tower div.out { opacity: .4; }
#theatre .tower i { width: 4px; height: 12px; border-radius: 1px; display: inline-block; } #theatre .tower b { width: 16px; text-align: right; opacity: .75; font-weight: 600; }
#theatre .list { position: absolute; right: 16px; top: 14px; width: min(300px, 30vw); max-height: calc(100vh - 150px); background: rgba(12,14,20,.84); border-radius: 8px; padding: 10px; pointer-events: auto; display: none; flex-direction: column; gap: 8px; }
#theatre.moments .list { display: flex; }
#theatre .list .f { display: flex; gap: 5px; flex-wrap: wrap; } #theatre .list .f button { padding: 6px 8px; font-size: 10px; }
#theatre .list .rows { overflow: auto; display: flex; flex-direction: column; gap: 2px; }
#theatre .list .rows div { display: flex; gap: 8px; font: 500 12px/1.25 'Segoe UI', Arial, sans-serif; padding: 6px 7px; border-radius: 5px; cursor: pointer; border-left: 3px solid var(--k, #888); }
#theatre .list .rows div:hover { background: rgba(255,255,255,.12); } #theatre .list .rows div.now { background: rgba(255,255,255,.16); }
#theatre .list .rows small { opacity: .7; min-width: 40px; font-variant-numeric: tabular-nums; }
#theatre .thbar { position: absolute; left: 16px; right: 16px; bottom: 14px; background: rgba(12,14,20,.84); border-radius: 8px; padding: 10px 12px; pointer-events: auto; }
#theatre .thbar .throw { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
#theatre .thbar .tm { font: 700 13px/1 ui-monospace, Menlo, Consolas, monospace; min-width: 132px; }
#theatre .thbar .sp { flex: 1; }
#theatre .thtl { position: relative; height: 22px; margin: 9px 0 2px; cursor: pointer; }
#theatre .thtl .bg { position: absolute; left: 0; right: 0; top: 9px; height: 4px; background: rgba(255,255,255,.2); border-radius: 2px; }
#theatre .thtl .fg { position: absolute; left: 0; top: 9px; height: 4px; background: #e10600; border-radius: 2px; }
#theatre .thtl .hd { position: absolute; top: 4px; width: 4px; height: 14px; margin-left: -2px; background: #fff; border-radius: 2px; box-shadow: 0 0 8px rgba(255,255,255,.8); }
#theatre .thtl .ev { position: absolute; top: 2px; width: 2px; height: 7px; margin-left: -1px; background: var(--k, #888); opacity: .9; }
#theatre .thtl .lap { position: absolute; top: 15px; font: 600 9px/1 'Segoe UI', Arial, sans-serif; opacity: .55; transform: translateX(-50%); }
#theatre .hint { font: 500 10px/1.3 'Segoe UI', Arial, sans-serif; letter-spacing: .06em; opacity: .6; margin-top: 6px; }
@media (max-width: 900px) { #theatre .tower { display: none; } #theatre .hint { display: none; } }
`;
const KIND = { start: '#ffffff', pass: '#39d98a', hit: '#ffd400', crash: '#ff3b30', pit: '#7fb0ff', out: '#ff8a8a', fastest: '#c77dff', sc: '#ffd400', green: '#39d98a', flag: '#ffffff' };
export const CAMS = [['tv', 'TRACKSIDE'], ['chase', 'CHASE'], ['tcam', 'T-CAM'], ['nose', 'NOSE'], ['front', 'FRONT'], ['heli', 'HELICOPTER']];
const SPEEDS = [0.25, 0.5, 1, 2, 4, 8];
const FILTERS = { all: ['THE RACE', (e) => e.kind !== 'pit' && e.kind !== 'green' && e.kind !== 'hit' && (e.kind !== 'pass' || e.w >= 2)], pass: ['OVERTAKES', (e) => e.kind === 'pass'], inc: ['INCIDENTS', (e) => e.kind === 'hit' || e.kind === 'crash' || e.kind === 'out' || e.kind === 'sc'], pit: ['STOPS', (e) => e.kind === 'pit'] };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clock = (s) => { s = Math.max(0, s); const m = Math.floor(s / 60); return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };

export class Theatre {
  /**
   * host: { camera, track, terrain: { at(x, z) }, clear(px, py, pz, tx, ty, tz) (a line of sight), pose(i, sample, T, jumped),
   *   group(i) (car i's model: an Object3D), render(), photo(on), onClose(), keys: { pressed(code), keys: Set } }
   */
  constructor(host, tape, o = {}) {
    this.h = host; this.tape = tape; this.T0 = tape.N ? tape.time(0) : 0; this.T1 = tape.N ? tape.time(tape.N - 1) : 0;
    const start = tape.events.find((e) => e.kind === 'start'); this.T = Math.max(this.T0, (start ? start.t : this.T0) - 3);
    this.k = tape.seek(this.T); this.play = true; this.speed = 1; this.car = Math.max(0, o.car ?? 0); this.cam = 'tv'; this.tv = null; this.filter = 'all'; this.reel = null; this.ui = true; this.jump = true; this.capT = 0;
    this.s = { x: 0, y: 0, z: 0, qx: 0, qy: 0, qz: 0, qw: 1, spin: 0, v: 0, steer: 0, flags: 0, tyre: 'SOFT' }; this.look = new THREE.Vector3(); this.pos = new THREE.Vector3(); this.first = true; this.drag = false;
    if (!document.getElementById('theatre-css')) { const st = document.createElement('style'); st.id = 'theatre-css'; st.textContent = CSS; document.head.appendChild(st); }
    const el = this.el = document.createElement('div'); el.id = 'theatre';
    el.innerHTML = `<div class="top"><span class="tag">REPLAY</span><span class="who"></span></div><div class="cap"></div><div class="tower"></div>
      <div class="list"><div class="f">${Object.entries(FILTERS).map(([k, v]) => `<button data-f="${k}">${v[0]}</button>`).join('')}</div><button data-a="reel" class="on">▶ PLAY THESE ONE AFTER ANOTHER</button><div class="rows"></div></div>
      <div class="thbar"><div class="throw"><button data-a="play">❚❚</button><button data-a="back">◂ 5 s</button><button data-a="fwd">5 s ▸</button><button data-a="slow">−</button><span class="tm"></span><button data-a="fast">+</button>
        <span class="sp"></span><button data-a="prev">◂ DRIVER</button><button data-a="next">DRIVER ▸</button><button data-a="cam"></button><button data-a="moments">MOMENTS</button><button data-a="photo">PHOTO</button><button data-a="close">CLOSE</button></div>
        <div class="thtl"><div class="bg"></div><div class="fg"></div><div class="marks"></div><div class="hd"></div></div>
        <div class="hint">SPACE play · ← → 5 s (SHIFT 30 s) · , . one frame · − + speed · ↑ ↓ driver · C camera · M moments · N / B next / last moment · TAB photo · H hide · ESC close</div></div>`;
    document.body.appendChild(el);
    const $ = (q) => el.querySelector(q);
    this.$who = $('.who'); this.$cap = $('.cap'); this.$tower = $('.tower'); this.$rows = $('.list .rows'); this.$t = $('.thbar .tm'); this.$fg = $('.thtl .fg'); this.$hd = $('.thtl .hd'); this.$tl = $('.thtl'); this.$cam = $('[data-a="cam"]'); this.$play = $('[data-a="play"]');
    // the timeline's marks: the moments, the laps
    const dur = Math.max(1, this.T1 - this.T0), M = $('.marks'); let h = '', lap = -1;
    for (const e of tape.events) if (e.kind !== 'green') h += `<div class="ev" style="left:${((e.t - this.T0) / dur * 100).toFixed(2)}%;--k:${KIND[e.kind] || '#888'}" title="${esc(e.text)}"></div>`;
    for (const o2 of tape.order) if (o2.lap !== lap && o2.lap > 0) { lap = o2.lap; if (lap > 1) h += `<div class="lap" style="left:${((o2.t - this.T0) / dur * 100).toFixed(2)}%">L${lap}</div>`; }
    M.innerHTML = h;
    el.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'), r = ev.target.closest('.rows div'), tw = ev.target.closest('.tower div');
      if (tw) { this.follow(+tw.dataset.i); return; }
      if (r) { this.reel = null; this.toEvent(this.shown[+r.dataset.i]); return; }
      if (!b) return; const a = b.dataset.a;
      if (b.dataset.f) { this.filter = b.dataset.f; this.reel = null; this.list(); return; }
      if (a === 'play') this.toggle(); else if (a === 'back') this.seek(this.T - 5); else if (a === 'fwd') this.seek(this.T + 5); else if (a === 'slow') this.rate(-1); else if (a === 'fast') this.rate(1);
      else if (a === 'prev') this.step(-1); else if (a === 'next') this.step(1); else if (a === 'cam') this.nextCam(); else if (a === 'moments') el.classList.toggle('moments');
      else if (a === 'photo') this.h.photo(true); else if (a === 'close') this.h.onClose(); else if (a === 'reel') this.startReel();
    });
    const at = (ev) => { const r = this.$tl.getBoundingClientRect(); this.reel = null; this.seek(this.T0 + Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * dur); };
    this.$tl.addEventListener('pointerdown', (ev) => { this.drag = true; this.$tl.setPointerCapture(ev.pointerId); at(ev); }); this.$tl.addEventListener('pointermove', (ev) => { if (this.drag) at(ev); }); this.$tl.addEventListener('pointerup', () => { this.drag = false; });
    el.classList.add('moments'); this.list(); this.follow(this.car);
  }
  dispose() { this.el.remove(); }
  toggle() { this.play = !this.play; if (this.play && this.T >= this.T1 - 0.05) this.seek(this.T0); }
  rate(d) { const i = Math.max(0, Math.min(SPEEDS.length - 1, SPEEDS.indexOf(this.speed) + d)); this.speed = SPEEDS[i]; }
  seek(T) { this.T = Math.max(this.T0, Math.min(this.T1, T)); this.k = this.tape.seek(this.T); this.jump = true; this.tv = null; }
  follow(i) { const n = this.tape.cars.length; this.car = ((i % n) + n) % n; this.tv = null; this.first = true; }
  /** the next driver up or down the running order as it is now */
  step(d) { const O = this.tape.orderAt(this.T), o = O ? Array.from(O.o) : this.tape.cars.map((_, i) => i), at = Math.max(0, o.indexOf(this.car)); this.follow(o[(at + d + o.length) % o.length]); }
  nextCam() { const i = CAMS.findIndex((c) => c[0] === this.cam); this.cam = CAMS[(i + 1) % CAMS.length][0]; this.tv = null; this.first = true; }
  toEvent(e, lead = 4) { if (!e) return; this.seek(e.t - lead); if (e.cars?.length) this.follow(e.cars[0]); this.cam = 'tv'; this.play = true; this.speed = 1; this.caption(e.text); }
  caption(t, hold = 4.5) { this.$cap.textContent = t; this.$cap.classList.add('in'); this.capT = hold; }
  startReel() { const L = this.shown.slice().sort((a, b) => a.t - b.t); if (!L.length) return; this.reel = { L, i: 0 }; this.toEvent(L[0]); this.caption(`${FILTERS[this.filter][0]} 1/${L.length} · ${L[0].text}`, 6); }
  list() {
    const f = FILTERS[this.filter][1]; this.shown = this.tape.events.filter(f);
    for (const b of this.el.querySelectorAll('.list .f button')) b.classList.toggle('on', b.dataset.f === this.filter);
    this.$rows.innerHTML = this.shown.map((e, i) => `<div data-i="${i}" style="--k:${KIND[e.kind] || '#888'}"><small>${clock(e.t - this.T0)}</small><span>${esc(e.text)}</span></div>`).join('') || '<div style="cursor:default;border:none;opacity:.7">Nothing of that kind in this race.</div>';
  }
  /** a frame: the keys, the tape moved on, the cars posed, the camera, what is written on the screen, the picture */
  frame(dt) {
    const K = this.h.keys, P = (c) => K.pressed(c), shift = K.keys.has('ShiftLeft') || K.keys.has('ShiftRight');
    if (P('Escape')) { this.h.onClose(); return; }
    if (P('Space')) this.toggle(); if (P('ArrowLeft')) { this.reel = null; this.seek(this.T - (shift ? 30 : 5)); } if (P('ArrowRight')) { this.reel = null; this.seek(this.T + (shift ? 30 : 5)); }
    if (P('Comma')) { this.play = false; this.seek(this.T - 1 / this.tape.hz); } if (P('Period')) { this.play = false; this.seek(this.T + 1 / this.tape.hz); }
    if (P('Minus') || P('NumpadSubtract')) this.rate(-1); if (P('Equal') || P('NumpadAdd')) this.rate(1);
    if (P('ArrowUp')) this.step(-1); if (P('ArrowDown')) this.step(1); if (P('KeyC')) this.nextCam(); if (P('KeyM')) this.el.classList.toggle('moments');
    if (P('KeyH')) { this.ui = !this.ui; this.el.classList.toggle('hide', !this.ui); } if (P('Tab')) { this.h.photo(true); return; }
    if (P('KeyN') || P('KeyB')) { const d = P('KeyN') ? 1 : -1, L = this.shown.slice().sort((a, b) => a.t - b.t), e = d > 0 ? L.find((x) => x.t > this.T + 4.5) : L.slice().reverse().find((x) => x.t < this.T + 2); this.reel = null; if (e) this.toEvent(e); }
    if (this.play) { this.T += dt * this.speed; if (this.T >= this.T1) { this.T = this.T1; this.play = false; } const tp = this.tape; while (this.k < tp.N - 2 && tp.time(this.k + 1) <= this.T) this.k++; }
    // a reel: on to the next moment three seconds after this one
    if (this.reel) { const R = this.reel, e = R.L[R.i]; if (this.T > e.t + 3.2 || !this.play) { R.i++; if (R.i >= R.L.length || !this.play) { this.reel = null; this.play = false; } else { this.toEvent(R.L[R.i]); this.caption(`${FILTERS[this.filter][0]} ${R.i + 1}/${R.L.length} · ${R.L[R.i].text}`, 6); } } }
    const tp = this.tape, n = tp.n, s = this.s;
    for (let i = 0; i < n; i++) this.h.pose(i, tp.sample(i, this.T, this.k, s), this.T, this.jump);
    this.camera(dt); this.jump = false;
    if (this.capT > 0) { this.capT -= dt; if (this.capT <= 0) this.$cap.classList.remove('in'); }
    this.draw(); if (!this.noDraw) this.h.render();   /* (noDraw: a test stepping the tape without drawing every frame) */
  }
  /** the camera on the car followed (its model is where the frame put it: on the ground, tilted with it) */
  camera(dt) {
    const g = this.h.group(this.car), cam = this.h.camera; if (!g) return;
    const p = g.position, f = _f.set(1, 0, 0).applyQuaternion(g.quaternion), u = _u.set(0, 1, 0).applyQuaternion(g.quaternion), snap = this.first || this.jump, q = snap ? 1 : Math.min(1, dt * 7);
    let fov = 60; cam.up.set(0, 1, 0);
    if (this.cam === 'tcam' || this.cam === 'nose') {
      const nose = this.cam === 'nose'; cam.position.copy(p).addScaledVector(u, nose ? 0.4 : 1.03).addScaledVector(f, nose ? 1.85 : -0.2); cam.up.copy(u);
      cam.lookAt(_a.copy(cam.position).addScaledVector(f, 10).addScaledVector(u, nose ? 0 : -0.9)); fov = nose ? 82 : 76;
    } else if (this.cam === 'chase' || this.cam === 'front' || this.cam === 'heli') {
      const want = this.cam === 'chase' ? _a.copy(p).addScaledVector(f, -6.6).setY(p.y + 2.4) : this.cam === 'front' ? _a.copy(p).addScaledVector(f, 8.5).setY(p.y + 1.35) : _a.copy(p).addScaledVector(f, -30).setY(p.y + 40);
      const gy = this.h.terrain.at(want.x, want.z) + 0.5; if (want.y < gy) want.y = gy;
      if (snap) this.pos.copy(want); else this.pos.lerp(want, Math.min(1, dt * (this.cam === 'heli' ? 1.6 : 5.5)));
      cam.position.copy(this.pos); const lt = this.cam === 'chase' ? _b.copy(p).addScaledVector(f, 5).setY(p.y + 0.9) : _b.copy(p).setY(p.y + 0.6);
      if (snap) this.look.copy(lt); else this.look.lerp(lt, q); cam.lookAt(this.look); fov = this.cam === 'chase' ? 62 : this.cam === 'front' ? 38 : 26;
    } else {
      // from the fence: a camera a little way up the road with a clear sight of the car, kept until the car is well past
      const tr = this.h.track, tv = this.tv, d = tv ? Math.hypot(tv.x - p.x, tv.z - p.z) : 0;
      if (tv) { tv.age += dt; if ((d > tv.d0 + 25 && tv.age > 1.2) || d > 330) this.tv = null; else if (d < tv.near) tv.near = d; if (this.tv && d > tv.near + 90 && tv.age > 2) this.tv = null; }
      if (!this.tv) {
        const nq = tr.nearest(p.x, p.z, -1, _nq), s0 = nq.s, dir = this.s2 != null && ((s0 - this.s2 + tr.length * 1.5) % tr.length) - tr.length / 2 < -0.5 ? -1 : 1; let best = null;
        for (const [sd, ah, hh] of [[1, 130, 6], [-1, 130, 6], [1, 70, 5], [-1, 70, 5], [1, 200, 9], [-1, 200, 9], [1, 30, 12], [-1, 30, 12]]) {
          const sq = tr.wrapS(s0 + ah * dir), iq = tr.idxAtS(sq), w = tr.wallAt(iq, sd), pt = tr.sample(sq, sd * ((isFinite(w) ? Math.min(w, 28) : 14) + 0.6)), y = this.h.terrain.at(pt.x, pt.z) + hh;
          if (this.h.clear(pt.x, y, pt.z, p.x, p.y + 0.8, p.z)) { best = { x: pt.x, y, z: pt.z }; break; }
        }
        if (!best) best = { x: p.x + 20, y: p.y + 45, z: p.z + 20 };
        this.tv = { ...best, age: 0, d0: Math.hypot(best.x - p.x, best.z - p.z), near: 1e9 }; this.first = true;
      }
      this.s2 = tr.nearest(p.x, p.z, -1, _nq).s;
      const t2 = this.tv; cam.position.set(t2.x, t2.y, t2.z); const lt = _b.copy(p).setY(p.y + 0.7); if (this.first || this.jump) this.look.copy(lt); else this.look.lerp(lt, Math.min(1, dt * 9)); cam.lookAt(this.look);
      fov = Math.max(7, Math.min(48, 1500 / Math.max(20, Math.hypot(t2.x - p.x, t2.z - p.z))));
    }
    this.first = false;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = snap ? fov : cam.fov + (fov - cam.fov) * Math.min(1, dt * 5); cam.updateProjectionMatrix(); }
  }
  draw() {
    const tp = this.tape, M = tp.meta, O = tp.orderAt(this.T), dur = Math.max(1, this.T1 - this.T0), u = (this.T - this.T0) / dur;
    this.$fg.style.width = `${u * 100}%`; this.$hd.style.left = `${u * 100}%`;
    const key = `${Math.floor(this.T)}|${this.speed}|${this.play}|${this.cam}|${this.car}|${O ? O.t : 0}`; if (key === this._key) return; this._key = key;
    this.$t.textContent = `${clock(this.T - this.T0)} / ${clock(dur)} · ${this.speed}×`; this.$play.textContent = this.play ? '❚❚' : '▶'; this.$cam.textContent = `CAMERA · ${CAMS.find((c) => c[0] === this.cam)[1]}`;
    const pos = O ? Array.from(O.o).indexOf(this.car) + 1 : 0;
    this.$who.innerHTML = `${esc(M.names[this.car])}<small>${pos ? `P${pos} · ` : ''}${O && M.laps ? `LAP ${Math.min(M.laps, Math.max(1, O.lap))}/${M.laps}` : ''}</small>`;
    if (O) { const k2 = tp.seek(this.T), C = tp.chunks[k2 >> 8], b = (k2 & 255) * tp.n; this.$tower.innerHTML = Array.from(O.o).map((i, k) => `<div data-i="${i}" class="${i === this.car ? 'on' : ''}${C.f[b + i] & F.OUT ? ' out' : ''}"><b>${k + 1}</b><i style="background:${M.colors[i]}"></i>${esc(M.shorts[i])}${C.f[b + i] & F.PIT ? ' · PIT' : ''}</div>`).join(''); }
    const now = this.shown.findIndex((e) => Math.abs(e.t - this.T) < 2.5); for (const r of this.$rows.children) r.classList.toggle('now', +r.dataset.i === now);
  }
}
const _f = new THREE.Vector3(), _u = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _nq = {};
