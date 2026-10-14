// Synthesised engine + effects via WebAudio, and a few recorded sounds (assets/audio: the crowd, its gasp and groan, the
// strings under the mourning screen) played on their own bus.
/** the short recorded sounds (assets/audio/<name>.mp3), decoded up front; the long ones (atmos1-3, strings) are streamed by music() */
export const SAMPLES = ['crowd', 'gasp', 'groan', 'horror'];

export class AudioEngine {
  constructor() { this.ctx = null; this.muted = false; this.ready = false; }
  init() {
    if (this.ready) return;
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ctx = this.ctx = new C();
    // the world's mix goes through a low-pass the crash camera closes (everything muffled); the crash's own sounds
    // (the punch, the crunches, the ticks) go round it, through fx, at full range
    this.master = ctx.createGain(); this.master.gain.value = 0.35;
    this.muffle = ctx.createBiquadFilter(); this.muffle.type = 'lowpass'; this.muffle.frequency.value = 20000; this.muffle.Q.value = 0.7;
    this.master.connect(this.muffle); this.muffle.connect(ctx.destination);
    this.fx = ctx.createGain(); this.fx.gain.value = 0.45; this.fx.connect(ctx.destination);
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
    // recorded sounds: their own bus, outside silence() (the mourning screen's strings play in the silence)
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.6; this.sfx.connect(ctx.destination);
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
  quiet(tc = 0.3) { if (!this.ready) return; const t = this.ctx.currentTime; this.engGain.gain.setTargetAtTime(0, t, tc); this.noiseGain.gain.setTargetAtTime(0, t, tc); }
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
    this.engGain.gain.setTargetAtTime((0.12 + car.throttle * 0.22 + rpmN * 0.1) * dmg, t, 0.05);
    const wind = Math.min(1, car.speed / 90);
    this.noiseGain.gain.setTargetAtTime(wind * 0.08 + car.slip * 0.03 + (car.offTrack ? 0.06 : 0), t, 0.08);
    this.noiseFilter.frequency.setTargetAtTime(600 + wind * 1800 + car.slip * 600, t, 0.1);
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
