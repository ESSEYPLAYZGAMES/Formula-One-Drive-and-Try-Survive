// Synthesised engine + effects via WebAudio, and a few recorded sounds (assets/audio: the crowd, its gasp and groan, the
// strings under the mourning screen) played on their own bus.
/** the short recorded sounds (assets/audio/<name>.mp3), decoded up front; the long ones (atmos1-3, strings) are streamed by music() */
import { ENGINE_WORKLET } from './EngineWorklet.js';

export const SAMPLES = ['crowd', 'gasp', 'groan', 'horror', 'radio'];   // (radio: the team radio's beep - a replay offered, TVExtras)

export class AudioEngine {
  constructor() {
    this.ctx = null; this.muted = false; this.ready = false;
    // the master volume (settings: 0-1, kept in the browser): one gain in front of the speakers, after every bus
    let v = 0.8; try { const s = localStorage.getItem('f1.volume'); if (s != null && isFinite(+s)) v = Math.max(0, Math.min(1, +s)); } catch (e) { /* storage off */ }
    this.volume = v;
  }
  /** set the master volume (0-1) and remember it */
  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, +v || 0));
    try { localStorage.setItem('f1.volume', String(this.volume)); } catch (e) { /* storage off */ }
    if (this.out) this.out.gain.setTargetAtTime(this.volume * this.volume, this.ctx.currentTime, 0.03);   // (squared: the slider's middle sounds like half)
  }
  init() {
    if (this.ready) return;
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ctx = this.ctx = new C();
    // the world's mix goes through a low-pass the crash camera closes (everything muffled); the crash's own sounds
    // (the punch, the crunches, the ticks) go round it, through fx, at full range
    this.out = ctx.createGain(); this.out.gain.value = this.volume * this.volume; this.out.connect(ctx.destination);   // (the master volume)
    this.master = ctx.createGain(); this.master.gain.value = 0.35;
    this.muffle = ctx.createBiquadFilter(); this.muffle.type = 'lowpass'; this.muffle.frequency.value = 20000; this.muffle.Q.value = 0.7;
    this.master.connect(this.muffle); this.muffle.connect(this.out);
    this.fx = ctx.createGain(); this.fx.gain.value = 0.45; this.fx.connect(this.out);
    this.noiseBuf = null;
    // engine: two detuned saws + sub square through a lowpass
    this.osc1 = ctx.createOscillator(); this.osc1.type = 'sawtooth';
    this.osc2 = ctx.createOscillator(); this.osc2.type = 'sawtooth'; this.osc2.detune.value = 7;
    this.sub = ctx.createOscillator(); this.sub.type = 'square';
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass'; this.filter.Q.value = 2;
    this.engGain = ctx.createGain(); this.engGain.gain.value = 0;
    const subGain = ctx.createGain(); subGain.gain.value = 0.35;
    this.osc1.connect(this.filter); this.osc2.connect(this.filter); this.sub.connect(subGain); subGain.connect(this.filter);
    this.filter.connect(this.engGain); this.engGain.connect(this.master);
    this.osc1.start(); this.osc2.start(); this.sub.start();
    // wind/tyre noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noise = ctx.createBufferSource(); this.noise.buffer = buf; this.noise.loop = true;
    this.noiseFilter = ctx.createBiquadFilter(); this.noiseFilter.type = 'bandpass'; this.noiseFilter.frequency.value = 900;
    this.noiseGain = ctx.createGain(); this.noiseGain.gain.value = 0;
    this.noise.connect(this.noiseFilter); this.noiseFilter.connect(this.noiseGain); this.noiseGain.connect(this.master); this.noise.start();
    // the engines (audio/EngineWorklet.js: every car near the microphone, firing by firing) - the oscillators above are
    // only what is heard where an AudioWorklet cannot run
    this.engBus = ctx.createGain(); this.engBus.gain.value = 0; this.engBus.connect(this.master);
    this.wk = null; this.slots = new Map(); this.motion = new Map(); this._L = null;
    if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
      // (from a data: URL - the single file opened from disk has a null origin, and a blob: URL from it will not load as a
      //  worklet; the blob as a second try)
      const dataUrl = 'data:application/javascript;charset=utf-8,' + encodeURIComponent(ENGINE_WORKLET);
      ctx.audioWorklet.addModule(dataUrl).catch(() => ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([ENGINE_WORKLET], { type: 'application/javascript' })))).then(() => {
        this.wk = new AudioWorkletNode(ctx, 'f1-engines', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [2] }); this.wk.connect(this.engBus);
      }).catch((e) => console.warn('[audio] the engines: no worklet, the old oscillators', e));
    }
    // the tyres and the road, for the car you are in (or the shot's subject, close to the camera): a squeal when they
    // slide, the kerb's stripes drummed through the chassis, the gravel's crunch
    const loop = (q) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random(); s.start(0, q); return s; };
    this.sqF = ctx.createBiquadFilter(); this.sqF.type = 'bandpass'; this.sqF.frequency.value = 1250; this.sqF.Q.value = 9;
    this.sqG = ctx.createGain(); this.sqG.gain.value = 0; loop(0.3).connect(this.sqF); this.sqF.connect(this.sqG); this.sqG.connect(this.master);
    this.kb = ctx.createOscillator(); this.kb.type = 'square'; this.kb.frequency.value = 40;
    this.kbF = ctx.createBiquadFilter(); this.kbF.type = 'lowpass'; this.kbF.frequency.value = 260; this.kbG = ctx.createGain(); this.kbG.gain.value = 0;
    this.kb.connect(this.kbF); this.kbF.connect(this.kbG); this.kbG.connect(this.master); this.kb.start();
    this.grF = ctx.createBiquadFilter(); this.grF.type = 'lowpass'; this.grF.frequency.value = 900; this.grF.Q.value = 0.5;
    this.grG = ctx.createGain(); this.grG.gain.value = 0; loop(1.1).connect(this.grF); this.grF.connect(this.grG); this.grG.connect(this.master);
    // the rain: a hiss of drops (louder on a visor)
    const rh = ctx.createBiquadFilter(); rh.type = 'highpass'; rh.frequency.value = 600; const rl = ctx.createBiquadFilter(); rl.type = 'lowpass'; rl.frequency.value = 7000;
    this.rnG = ctx.createGain(); this.rnG.gain.value = 0; loop(0.7).connect(rh); rh.connect(rl); rl.connect(this.rnG); this.rnG.connect(this.master);
    // recorded sounds: their own bus, outside silence() (the mourning screen's strings play in the silence)
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.6; this.sfx.connect(this.out);
    this.ready = true;
    // (the tab in the background or the window minimised: every sound stops, and carries on when you are back)
    document.addEventListener('visibilitychange', () => { if (document.hidden) ctx.suspend?.(); else ctx.resume?.(); });
    for (const n of SAMPLES) this.sample(n);   // (decoded now, ready when they are needed)
    // (a test page - ?mute in its address, or the dev origin's own 'f1sim-mute' flag in localStorage - starts silent: the
    // automated play-tests run in the background and nobody wants to hear them)
    // (the dev server on localhost is only ever the play-tests' - the game itself is played from the published page or the
    // single file - so it starts silent there too, unless ?sound asks for it; test runs clear localStorage, hence both)
    const dev = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && !/[?&]sound\b/.test(location.search);
    let quiet = dev || /[?&]mute\b/.test(location.search); try { quiet = quiet || localStorage.getItem('f1sim-mute') === '1'; } catch (e) { /* no storage */ }
    if (quiet && !this.muted) this.toggleMute();
  }
  /**
   * A recorded sound -> its AudioBuffer (cached; null if it cannot be had). From assets/audio/<name>.mp3, or in the
   * single-file build from the base64 the bundler embeds as <script id="audio-<name>">.
   */
  sample(name) {
    if (!this.ready) return Promise.resolve(null);
    const S = this._samples || (this._samples = new Map());
    if (!S.has(name)) S.set(name, (async () => {
      const buf = await (await fetch(this._src(name))).arrayBuffer();
      return await this.ctx.decodeAudioData(buf);
    })().catch(() => null));
    return S.get(name);
  }
  /** a recorded sound's URL: the embedded base64 as a blob (the single-file build), else the file beside the page */
  _src(name) {
    const C = this._urls || (this._urls = new Map()); if (C.has(name)) return C.get(name);
    const el = document.getElementById('audio-' + name); let url = `assets/audio/${name}.mp3`;
    if (el) { const b = atob(el.textContent.trim()), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); url = URL.createObjectURL(new Blob([u], { type: 'audio/mpeg' })); el.textContent = ''; }
    C.set(name, url); return url;
  }
  /**
   * A long piece (the dark beds under the news, the strings), streamed through an <audio> element rather than decoded
   * whole. o: { gain, loop, offset (s), fadeIn, onEnd }. -> a handle: to(gain, tc), stop(fade).
   */
  music(name, o = {}) {
    if (!this.ready) return null;
    const ctx = this.ctx, el = new Audio(); el.preload = 'auto'; el.loop = !!o.loop; el.src = this._src(name);
    const node = ctx.createMediaElementSource(el), g = ctx.createGain(); g.gain.value = 0; node.connect(g); g.connect(this.sfx);
    const end = () => { try { el.pause(); el.removeAttribute('src'); el.load(); } catch (e) { /* gone */ } node.disconnect(); g.disconnect(); };
    const H = { el, g, stopped: false,
      to: (v, tc = 0.6) => { if (!H.stopped) g.gain.setTargetAtTime(this.muted ? 0 : v, ctx.currentTime, tc); },
      stop: (fade = 1.5) => { if (H.stopped) return; H.stopped = true; const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + fade); setTimeout(end, fade * 1000 + 100); } };
    if (o.offset) el.addEventListener('loadedmetadata', () => { if (isFinite(el.duration)) el.currentTime = (o.offset % Math.max(1, el.duration - 2)); }, { once: true });
    el.addEventListener('ended', () => { if (H.stopped) return; H.stopped = true; end(); o.onEnd?.(); });
    el.play().then(() => { const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(this.muted ? 0 : (o.gain ?? 1), t + (o.fadeIn || 0.05)); }).catch(() => { /* not allowed to play yet */ });
    return H;
  }
  /**
   * Play a recorded sound. o: { gain, loop, offset (s, or 'random'), rate, lowpass (Hz: through a phone's microphone),
   * delay, fadeIn }. -> a handle: to(gain, tc) eases its level, stop(fade) fades it out and ends it.
   */
  play(name, o = {}) {
    if (!this.ready) return null;
    const ctx = this.ctx, g = ctx.createGain(); g.gain.value = 0; g.connect(this.sfx);
    let input = g;
    if (o.lowpass) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lowpass; f.Q.value = 0.9; const h = ctx.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = 280; f.connect(h); h.connect(g); input = f; }
    const H = { g, src: null, stopped: false,
      to: (v, tc = 0.5) => { if (!H.stopped) g.gain.setTargetAtTime(this.muted ? 0 : v, ctx.currentTime, tc); },
      stop: (fade = 0.6) => { if (H.stopped) return; H.stopped = true; const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + fade); setTimeout(() => { try { H.src?.stop(); } catch (e) { /* already ended */ } g.disconnect(); }, fade * 1000 + 100); } };
    this.sample(name).then((b) => {
      if (!b || H.stopped) return;
      const s = ctx.createBufferSource(); s.buffer = b; s.loop = !!o.loop; s.playbackRate.value = o.rate || 1; s.connect(input); H.src = s;
      const t = ctx.currentTime + (o.delay || 0), v = this.muted ? 0 : (o.gain ?? 1), off = o.offset === 'random' ? Math.random() * b.duration * 0.8 : (o.offset || 0);
      g.gain.setValueAtTime(0, ctx.currentTime);
      if (o.fadeIn) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + o.fadeIn); } else g.gain.setValueAtTime(v, t);
      s.start(t, off % b.duration);
    });
    return H;
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume(); }   // (not while the tab is in the background)
  toggleMute() { this.muted = !this.muted; if (this.master) this.master.gain.value = this.muted ? 0 : 0.35; if (this.fx) this.fx.gain.value = this.muted ? 0 : 0.45; if (this.sfx) this.sfx.gain.value = this.muted ? 0 : 0.6; return this.muted; }
  /** the car's engine and wind noise faded out (a cut-away, a pause): tc the fade's time constant (s) */
  quiet(tc = 0.3) { if (!this.ready) return; const t = this.ctx.currentTime; for (const g of [this.engGain, this.noiseGain, this.engBus, this.sqG, this.kbG, this.grG, this.rnG]) g.gain.setTargetAtTime(0, t, tc); }
  /** everything silent (the mourning screen), or back */
  silence(on) { if (!this.ready) return; const t = this.ctx.currentTime; this.master.gain.setTargetAtTime(on || this.muted ? 0 : 0.35, t, 0.4); this.fx.gain.setTargetAtTime(on || this.muted ? 0 : 0.45, t, 0.4); }
  /** the world muffled (0: clear .. 1: under water) */
  setMuffle(k) { if (!this.ready) return; this.muffle.frequency.setTargetAtTime(k > 0 ? 18000 * Math.pow(1 - k, 3) + 380 : 20000, this.ctx.currentTime, k > 0 ? 0.03 : 0.25); }
  _noise(dur) {
    const ctx = this.ctx, n = Math.ceil(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.5);
    const s = ctx.createBufferSource(); s.buffer = b; return s;
  }
  /** the moment of the crash: a low explosive thump and a burst of noise */
  punch(k = 1) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.45);
    const g = ctx.createGain(); g.gain.setValueAtTime(1.2 * k, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6); o.connect(g); g.connect(this.fx); o.start(t); o.stop(t + 0.62);
    const n = this._noise(0.5), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2600, t); f.frequency.exponentialRampToValueAtTime(200, t + 0.5);
    const ng = ctx.createGain(); ng.gain.value = 0.9 * k; n.connect(f); f.connect(ng); ng.connect(this.fx); n.start(t);
  }
  /** a firework shell bursting dist metres away: heard when the sound gets here (343 m/s), a soft thump and a crackle */
  firework(dist = 300) {
    if (!this.ready || this.muted) return;
    const k = Math.min(1, 160 / Math.max(80, dist));
    setTimeout(() => {
      if (!this.ready || this.muted) return;
      const ctx = this.ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.5);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.55 * k, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.7); o.connect(g); g.connect(this.fx); o.start(t); o.stop(t + 0.72);
      const n = this._noise(0.9), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.8);
      const ng = ctx.createGain(); ng.gain.value = 0.35 * k; n.connect(f); f.connect(ng); ng.connect(this.fx); n.start(t);
      // the crackle: a scatter of tiny high clicks over the next second
      for (let i = 0; i < 10; i++) {
        const c = this._noise(0.025), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
        const cg = ctx.createGain(); cg.gain.value = 0.08 * k; c.connect(hp); hp.connect(cg); cg.connect(this.fx); c.start(t + 0.35 + Math.random() * 1.1);
      }
    }, (dist / 343) * 1000);
  }
  /** carbon and metal: a tearing crunch with a ringing edge, bigger with the hit */
  crunch(sev = 0.5) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime, dur = 0.12 + 0.3 * sev;
    const n = this._noise(dur), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900 + Math.random() * 2600; bp.Q.value = 1.4;
    const g = ctx.createGain(); g.gain.value = 0.35 + 0.8 * sev; n.connect(bp); bp.connect(g); g.connect(this.fx); n.start(t);
    for (let k = 0; k < 2; k++) {   // the metal: two detuned partials, struck and decaying
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 260 + Math.random() * 900;
      const og = ctx.createGain(); og.gain.setValueAtTime(0.12 + 0.2 * sev, t); og.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.6);
      o.connect(og); og.connect(this.fx); o.start(t); o.stop(t + dur * 1.6 + 0.02);
    }
  }
  /** the crash's ticking counter */
  tick() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime, o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 2300;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.02); o.connect(g); g.connect(this.fx); o.start(t); o.stop(t + 0.03);
  }
  /** the crash is over: a last bright chord */
  resolve() { if (!this.ready || this.muted) return; this.beep(784, 0.5, 0.12); setTimeout(() => this.beep(1175, 0.7, 0.1), 70); }

  update(car, dt, external = 0) {
    if (!this.ready || !car) return;
    const rpmN = (car.rpm - 3000) / 9500;
    const f = 40 + rpmN * 260;
    const t = this.ctx.currentTime;
    this.osc1.frequency.setTargetAtTime(f, t, 0.03); this.osc2.frequency.setTargetAtTime(f * 1.002, t, 0.03); this.sub.frequency.setTargetAtTime(f / 2, t, 0.03);
    this.filter.frequency.setTargetAtTime(400 + rpmN * 3200 + car.throttle * 800, t, 0.05);
    const dmg = 1 - car.dmg.eng * 0.3;
    // (external: metres from a camera that is not on the car - the broadcast's trackside and helicopter shots: the
    //  engine fades with the distance; 0, as everywhere else: on board)
    const far = external > 0 ? Math.max(0.1, Math.min(1, 30 / external)) : 1;
    this.engGain.gain.setTargetAtTime((0.12 + car.throttle * 0.22 + rpmN * 0.1) * dmg * far, t, 0.05);
    const wind = Math.min(1, car.speed / 90);
    this.noiseGain.gain.setTargetAtTime((wind * 0.08 + car.slip * 0.03 + (car.offTrack ? 0.06 : 0)) * far, t, 0.08);
    this.noiseFilter.frequency.setTargetAtTime(600 + wind * 1800 + car.slip * 600, t, 0.1);
  }

  /**
   * The cars as a microphone hears them, every frame. o: { cam (the camera: its position, and its right for the stereo),
   * cars, own (the car the microphone is in or on - always heard), inside (the microphone is on board: its engine from
   * the airbox, in the middle), mic ({x, y, z}: where the microphone is, if not at the camera - a helicopter's picture
   * is heard from the trackside), sc (the safety car: a V8), motion (true: the cars' revs and throttle from how they
   * move - a replay, posed from its record), dt }.
   * Each car near enough gets a voice (eight at most, the loudest; your own always): its engine's revs, throttle, ERS,
   * shifts and limiters; the level by its distance (and quieter from in front: the exhaust is at its tail); the air's
   * lowpass by its distance; its place left or right; and the Doppler shift - its speed toward the microphone and the
   * microphone's toward it (343 m/s).
   */
  listen(o) {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime, cam = o.cam, P = o.mic || cam.position, dt = Math.max(1e-3, o.dt || 0.016);
    if (!this.wk) {   // (no worklet: the old engine, for the car you are in or the nearest)
      let c = o.own, d = 0; if (!c || !o.inside) { let best = Infinity; for (const x of o.cars) { if (!x) continue; const dd = Math.hypot(x.x - P.x, x.z - P.z); if (dd < best) { best = dd; c = x; } } d = best + 1; }
      this.update(c, dt, o.inside ? 0 : d); return;
    }
    this.engGain.gain.setTargetAtTime(0, t, 0.05); this.engBus.gain.setTargetAtTime(this.muted ? 0 : 2.5, t, 0.05);   // (2.5: level with the old engine - measured)
    // the microphone: where, and how fast (a cut is not a speed)
    const e = cam.matrixWorld.elements, rl = Math.hypot(e[0], e[2]) || 1, rx = e[0] / rl, rz = e[2] / rl;
    const L = this._L || (this._L = { x: P.x, y: P.y, z: P.z, vx: 0, vy: 0, vz: 0 });
    let vx = (P.x - L.x) / dt, vy = (P.y - L.y) / dt, vz = (P.z - L.z) / dt; if (Math.hypot(vx, vy, vz) > 130) { vx = 0; vy = 0; vz = 0; }
    const kv = Math.min(1, dt * 8); L.vx += (vx - L.vx) * kv; L.vy += (vy - L.vy) * kv; L.vz += (vz - L.vz) * kv; L.x = P.x; L.y = P.y; L.z = P.z;
    // the cars worth a voice
    const C = [], all = o.sc ? [...o.cars, o.sc] : o.cars;
    for (const c of all) {
      if (!c || c.hiddenAway || c._povHide) continue;
      const own = c === o.own, dx = c.x - P.x, dy = (c.y ?? 0) + 0.45 - P.y, dz = c.z - P.z, d = Math.hypot(dx, dy, dz);
      if (!own && d > 420) continue;
      const M = this._move(c, dt, o.motion); if (!M.alive && !own) continue;
      C.push({ c, own, dx, dy, dz, d, M, loud: own && o.inside ? 1e9 : (0.3 + M.thr) * 40 / (d + 6) + (own ? 1 : 0) });
    }
    C.sort((a, b) => b.loud - a.loud); const take = C.slice(0, 8), on = new Set(take.map((x) => x.c)), msgs = [];
    // (a voice to each - the same slot while it stays heard; a car no longer heard fades and its slot is free after)
    for (const [c, sl] of this.slots) if (!on.has(c)) { if (!sl.off) { sl.off = t; msgs.push({ i: sl.i, seed: sl.seed, kind: sl.kind, rpm: 4000, thr: 0, gain: 0, pan: 0, lp: 2000, ob: 0, dop: 1, ers: 0, lim: 0, plim: 0, up: sl.up, down: sl.down }); } else if (t - sl.off > 0.3) this.slots.delete(c); }
    const used = new Set([...this.slots.values()].map((s) => s.i));
    for (const x of take) {
      const c = x.c, M = x.M; let sl = this.slots.get(c);
      if (sl && sl.off) { sl.off = 0; }
      if (!sl) { let i = 0; while (used.has(i)) i++; if (i > 11) continue; used.add(i); sl = { i, seed: ((typeof c.id === 'number' ? c.id : String(c.id || c.name || '').split('').reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)) & 0xffff) + 1, kind: c === o.sc ? 1 : 0, gear: M.gear, up: 0, down: 0, off: 0 }; this.slots.set(c, sl); }
      if (M.gear > sl.gear) sl.up++; else if (M.gear < sl.gear && M.gear > 0) sl.down++; sl.gear = M.gear;
      let gain, pan = 0, lp, ob = 0, dop = 1;
      if (x.own && o.inside) { gain = 0.62; lp = 9500; ob = 1; }
      else {
        const d = Math.max(1.5, x.d), ux = -x.dx / d, uy = -x.dy / d, uz = -x.dz / d;   // (from the car to the microphone)
        const fx = Math.cos(c.th || 0), fz = Math.sin(c.th || 0), hd = Math.hypot(ux, uz) || 1, front = (fx * ux + fz * uz) / hd;   // (+1: the microphone in front of it)
        gain = 1.25 * 9 / (d + 9) * (0.78 - 0.22 * front);
        lp = (1600 + 16500 * Math.exp(-d / 170)) * (1 - 0.3 * Math.max(0, front));
        pan = Math.max(-0.75, Math.min(0.75, -(ux * rx + uz * rz) * Math.min(1, d / 4)));
        const vs = M.vx * ux + M.vz * uz, vr = -(L.vx * ux + L.vy * uy + L.vz * uz);   // (each one's speed toward the other)
        dop = Math.max(0.55, Math.min(1.7, (343 + vr) / (343 - Math.min(300, vs))));
        if (x.own) ob = Math.max(0, 0.45 - d / 30);   // (a chase camera: some of the airbox still)
      }
      if (c.engineDead || c.retired && !(M.spd > 2)) gain = 0;
      msgs.push({ i: sl.i, seed: sl.seed, kind: sl.kind, rpm: M.rpm, thr: M.thr, gain, pan, lp, ob, dop, ers: M.ers, lim: M.lim ? 1 : 0, plim: M.plim ? 1 : 0, up: sl.up, down: sl.down });
    }
    if (msgs.length) this.wk.port.postMessage({ v: msgs });
    // the tyres and the road: the car you are in, or one the camera is right by
    const near = o.inside ? C.find((x) => x.own) : C.filter((x) => x.d < 25).sort((a, b) => a.d - b.d)[0], nc = near?.c;
    const far = near ? (o.inside ? 1 : Math.min(1, 6 / (near.d + 1))) : 0, spd = nc ? near.M.spd : 0;
    const sq = nc && !o.motion ? Math.max(0, Math.min(1, ((nc.slip || 0) - 0.75) * 0.9)) * Math.min(1, spd / 12) * (nc.surf >= 3 ? 0.2 : 1) : 0;
    this.sqG.gain.setTargetAtTime(sq * 0.16 * far, t, 0.06); this.sqF.frequency.setTargetAtTime(1050 + 500 * Math.min(1, sq) + 120 * Math.sin(t * 7), t, 0.05);
    const kerb = nc && nc.onKerb && spd > 4 ? 1 : 0; this.kbG.gain.setTargetAtTime(kerb * 0.12 * far, t, 0.02); if (kerb) this.kb.frequency.setTargetAtTime(Math.max(12, spd / 1.1), t, 0.03);
    const gr = nc && nc.offTrack && nc.surf >= 3 && spd > 2 ? Math.min(1, spd / 30) : 0; this.grG.gain.setTargetAtTime(gr * (nc?.surf === 4 ? 0.22 : 0.1) * far * (0.7 + 0.6 * Math.random()), t, 0.03);
    // the wind: the car you are in
    const wn = o.inside && nc ? Math.min(1, spd / 90) : 0;
    this.noiseGain.gain.setTargetAtTime(wn * 0.07, t, 0.08); this.noiseFilter.frequency.setTargetAtTime(600 + wn * 1800, t, 0.1);
    this.rnG.gain.setTargetAtTime(Math.min(1, o.rain || 0) * (o.inside ? 0.11 : 0.06), t, 0.4);
  }
  /** a car's engine as it is now - from its state, or (motion) from how it moves: revs, throttle, gear, ERS, limiters */
  _move(c, dt, motion) {
    let m = this.motion.get(c); const vw = !motion && c.worldVel ? c.worldVel() : null;
    if (!m) { m = { x: c.x, z: c.z, vx: 0, vz: 0, spd: 0, gear: 1, rpm: 4000, thr: 0, ers: 0, lim: false, plim: false, alive: true }; this.motion.set(c, m); }
    let vx = (c.x - m.x) / dt, vz = (c.z - m.z) / dt; m.x = c.x; m.z = c.z;
    if (Math.hypot(vx, vz) > 140) { vx = m.vx; vz = m.vz; }   // (a car put somewhere else - a replay's first frame: not a speed)
    if (vw) { vx = vw[0]; vz = vw[1]; } else { const k = Math.min(1, dt * 10); vx = m.vx + (vx - m.vx) * k; vz = m.vz + (vz - m.vz) * k; }
    const spd0 = m.spd; m.vx = vx; m.vz = vz; m.spd = Math.hypot(vx, vz);
    if (!motion && c.rpm != null) {
      m.rpm = c.rpm; m.thr = c.throttle || 0; m.gear = c.gear || 1;
      m.ers = c.ersDeploying ? 1 : c.ersHarvesting && (c.brake || 0) > 0.3 ? -1 : 0;
      m.lim = c.gear === 8 && c.rpm >= 11950 && m.thr > 0.5; m.plim = !!c.pitLane && m.spd > 17 && !c.inPit;
      m.alive = !c.engineDead && !(c.retired && m.spd < 2);
    } else {
      // (from the motion: the gear the speed is in, the revs in it; the throttle from the acceleration)
      const kmh = m.spd * 3.6, T = [68, 104, 140, 176, 212, 248, 290, 348]; let g = 0; while (g < 7 && kmh > T[g] * 0.97) g++;
      m.gear = g + 1; m.rpm = Math.max(4000, Math.min(12000, kmh / T[g] * 12000));
      const acc = (m.spd - spd0) / dt; m.thr += ((acc > 0.6 ? 1 : acc < -3 ? 0 : 0.45) - m.thr) * Math.min(1, dt * 6);
      m.ers = acc < -8 ? -1 : acc > 1 ? 1 : 0; m.lim = false; m.plim = !!c.pitLane && m.spd > 17; m.alive = m.spd > 0.5 || !c.retired;
    }
    return m;
  }
  /**
   * A wheel gun at (x, z), for dur seconds: the air motor's hammering (a ratchet at ~45 blows a second through a bright
   * metal band), its whine spinning up, the air's hiss - quieter with the distance from the microphone (listen)
   */
  gun(x, z, dur = 0.3) {
    if (!this.ready || this.muted || !this._L) return;
    const d = Math.hypot(x - this._L.x, z - this._L.z); if (d > 140) return;
    const ctx = this.ctx, t = ctx.currentTime + Math.random() * 0.04, k = Math.min(1, 9 / (d + 5)), e = t + dur;
    const n = this._noise(dur + 0.15), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2900; bp.Q.value = 1.6;
    const am = ctx.createGain(); am.gain.value = 0.5; const lfo = ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 42 + Math.random() * 8;
    const lg = ctx.createGain(); lg.gain.value = 0.5; lfo.connect(lg); lg.connect(am.gain);   // (the blows: the level beating 0 .. 1)
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.55 * k, t + 0.015); g.gain.setValueAtTime(0.55 * k, e); g.gain.exponentialRampToValueAtTime(0.001, e + 0.06);
    n.connect(bp); bp.connect(am); am.connect(g); g.connect(this.master); n.start(t); lfo.start(t); lfo.stop(e + 0.1);
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(760, t + dur * 0.7);
    const of = ctx.createBiquadFilter(); of.type = 'bandpass'; of.frequency.value = 1500; of.Q.value = 2;
    const og = ctx.createGain(); og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.08 * k, t + 0.03); og.gain.setValueAtTime(0.08 * k, e); og.gain.exponentialRampToValueAtTime(0.001, e + 0.05);
    o.connect(of); of.connect(og); og.connect(this.master); o.start(t); o.stop(e + 0.08);
  }
  /** a car hitting something at (x, z): its thud (and a crunch, a hard one) by the distance from the microphone */
  impactAt(x, z, sev) {
    if (!this.ready || this.muted || !this._L) return; const d = Math.hypot(x - this._L.x, z - this._L.z); if (d > 160) return;
    const k = Math.min(1, 10 / (d + 6)); this.impact(sev * k); if (sev > 0.35 && k > 0.15) this.crunch(Math.min(1, sev) * k);
  }
  /** short impact thud scaled by severity */
  impact(sev) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.25);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5 * Math.min(1, sev + 0.2), t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.32);
  }
  /** two-tone radio chime before an engineer message */
  chime() { this.beep(1046, 0.09, 0.18); setTimeout(() => this.beep(1318, 0.14, 0.18), 110); }
  beep(freq = 880, dur = 0.12, vol = 0.25) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
}
