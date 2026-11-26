// The afterlife's sound (ui/Afterlife.js, ui/Exorcism.js), synthesised on the game's AudioContext and sent straight to
// its master volume (round the race's buses - the mourning's silence() does not touch it; mute does):
//   voice(text)  - a robotic voice: a buzzing throat (a saw, its pitch wandering) ring-modulated into metal, through
//                  three formant filters that move from vowel to vowel of the text as it is "spoken", the consonants
//                  bursts of hiss; distorted, panned. Not words - the shape of words (the caption carries them) - with
//                  the browser's own speech, pitched right down, under it when it can (say: true).
//   drone(v)     - Hell's air: two low saws beating, and a rumble.
//   chant(v)     - a choir of those throats on a minor chord, pulsing VA-DE, VA-DE.
//   machine(v)   - the robotic noise: crushed static, a sweeping filter, stutters, metal hits (tick() fires them).
//   heart(), breath() - the body afterwards, weak.
//   fizzle(s)    - everything collapses: the pitch of every voice falls away (a tape stopping), the filter closes.
//   stop(s)      - all of it faded and released.
// afterSound(audio) -> that object; without a running context (no audio yet, a test) every call does nothing.

const NOOP = new Proxy({}, { get: (_, k) => (k === 'live' ? false : () => NOOP) });
/** the formants (F1, F2, F3 in Hz) of a vowel */
const VOW = { a: [760, 1250, 2600], e: [500, 1850, 2550], i: [300, 2250, 3000], o: [500, 880, 2500], u: [330, 850, 2300], y: [300, 2100, 2900] };

export function afterSound(audio) {
  const ctx = audio?.ready && audio.ctx; if (!ctx || !audio.out) return NOOP;
  const T = () => ctx.currentTime;
  const bus = ctx.createGain(); bus.gain.value = audio.muted ? 0 : 1;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 18000; lp.Q.value = 0.8;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2;
  bus.connect(lp); lp.connect(comp); comp.connect(audio.out);
  const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const crush = ctx.createWaveShaper(); { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.round(Math.tanh(x * 3) * 6) / 6; } crush.curve = c; }   // (hard, stepped: a voice through a broken machine)
  const oscs = new Set();   // (every pitched thing still sounding: fizzle() drops them all)
  const track = (o, stopAt) => { oscs.add(o); o.onended = () => oscs.delete(o); if (stopAt) { const go = o.start.bind(o); o.start = (w) => { go(w); o.stop(stopAt); }; } return o; };   // (stopped when started)
  const gainAt = (v) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const loops = new Set(), noise = () => { const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true; s.loopStart = Math.random(); loops.add(s); s.onended = () => loops.delete(s); return s; };
  let alive = true;

  /** a robotic voice speaking the shape of text -> its length (s). o: f0, rate, gain, pan (-1..1), ring (Hz), dist (0..1), say */
  function voice(text, o = {}) {
    if (!alive) return 0;
    const t0 = T() + (o.delay || 0), rate = o.rate || 1, f0 = o.f0 || 110, str = String(text || '');
    // (the syllables: each vowel group, the consonants before it)
    const syl = []; let cons = 0; for (const m of str.toLowerCase().matchAll(/([^aeiouy]*)([aeiouy]+)/g)) { cons = m[1].replace(/[^a-z]/g, '').length; syl.push({ v: m[2][0], cons, pause: /[.,!?;:-]/.test(m[1]) }); }
    if (!syl.length) syl.push({ v: 'a', cons: 1 });
    const loud = /!|[A-Z]{3,}/.test(str) ? 1.35 : 1, ask = /\?\s*$/.test(str);
    const sd = 0.15 / rate, dur = syl.reduce((s, x) => s + sd + (x.pause ? 0.14 / rate : 0), 0) + 0.15;
    const src = track(ctx.createOscillator(), t0 + dur + 0.1); src.type = 'sawtooth';
    const sub = track(ctx.createOscillator(), t0 + dur + 0.1); sub.type = 'square'; sub.frequency.value = f0 / 2;
    const ring = track(ctx.createOscillator(), t0 + dur + 0.1); ring.frequency.value = o.ring ?? 47;
    const rm = gainAt(0); ring.connect(rm.gain); src.connect(rm); const subG = gainAt(0.25); sub.connect(subG); subG.connect(rm);
    const dry = gainAt(0.5); src.connect(dry);   // (some of the throat untouched, so it is still a voice)
    const F = [0, 1, 2].map((k) => { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = [9, 12, 14][k]; return f; });
    const fsum = gainAt(1); for (const f of F) { rm.connect(f); dry.connect(f); f.connect(fsum); }
    const sh = ctx.createWaveShaper(); sh.curve = crush.curve; const pre = gainAt(1 + (o.dist ?? 0.6) * 5); fsum.connect(pre); pre.connect(sh);
    const env = gainAt(0), pan = ctx.createStereoPanner(); pan.pan.value = Math.max(-1, Math.min(1, o.pan || 0));
    const out = gainAt((o.gain ?? 0.5) * loud * 0.6); sh.connect(env); env.connect(out); out.connect(pan); pan.connect(bus);
    // (the hiss of the consonants)
    const hs = noise(), hf = ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 3200; const hg = gainAt(0); hs.connect(hf); hf.connect(hg); hg.connect(pan); hs.start(t0); hs.stop(t0 + dur + 0.1);
    let t = t0; const fp = src.frequency; fp.setValueAtTime(f0, t0);
    syl.forEach((s, i) => {
      if (s.pause) { env.gain.setTargetAtTime(0, t, 0.02); t += 0.14 / rate; }
      const V = VOW[s.v] || VOW.a, j = 1 + (Math.random() - 0.5) * 0.12;
      if (s.cons) { hg.gain.setValueAtTime(0, t); hg.gain.linearRampToValueAtTime(0.05 * Math.min(3, s.cons) * (o.gain ?? 0.5), t + 0.012); hg.gain.linearRampToValueAtTime(0, t + 0.05); }
      F.forEach((f, k) => f.frequency.setTargetAtTime(V[k] * j, t, 0.025));
      // (the pitch: falling through a sentence, rising at a question, a wobble on every syllable)
      const k = i / Math.max(1, syl.length - 1), p = f0 * (ask ? 0.95 + k * 0.4 : 1.12 - k * 0.3) * (1 + (Math.random() - 0.5) * 0.14);
      fp.setTargetAtTime(p, t, 0.03); sub.frequency.setTargetAtTime(p / 2, t, 0.03);
      env.gain.setTargetAtTime(1, t + (s.cons ? 0.03 : 0), 0.015); env.gain.setTargetAtTime(0.25, t + sd * 0.7, 0.03);
      t += sd;
    });
    env.gain.setTargetAtTime(0, t, 0.05);
    src.start(t0); sub.start(t0); ring.start(t0);
    if (o.say) speak(str, o);
    return dur + (o.delay || 0);
  }
  /** the browser's own voice, pitched right down, under the robot (one at a time; none if muted) */
  function speak(str, o) {
    try {
      const S = window.speechSynthesis; if (!S || audio.muted || S.speaking) return;
      const u = new SpeechSynthesisUtterance(str); u.pitch = o.ttsPitch ?? 0.05; u.rate = o.ttsRate ?? 0.78; u.volume = Math.min(1, (audio.volume ?? 0.8) * (o.ttsGain ?? 0.55));
      S.speak(u);
    } catch (e) { /* no speech */ }
  }

  // HELL's air
  let droneN = null;
  function drone(v) {
    if (!alive) return;
    if (!droneN) {
      const g = gainAt(0), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; f.connect(g); g.connect(bus);
      const os = []; for (const hz of [41.2, 41.9, 61.7]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz; const og = gainAt(0.3); o.connect(og); og.connect(f); o.start(); os.push(o); }
      const r = noise(), rf = ctx.createBiquadFilter(); rf.type = 'lowpass'; rf.frequency.value = 110; const rg = gainAt(1.6); r.connect(rf); rf.connect(rg); rg.connect(g); r.start();
      droneN = { g, r, os };
    }
    droneN.g.gain.setTargetAtTime(v * 0.5, T(), 0.8);
  }

  // the CHOIR: four throats on D minor, a vowel pulse - VA-DE, VA-DE
  let ch = null;
  function chant(v) {
    if (!alive) return;
    if (!ch) {
      const g = gainAt(0), voices = [], stops = [];
      for (const hz of [73.4, 87.3, 110, 146.8, 55]) {
        const o = track(ctx.createOscillator()); o.type = 'sawtooth'; o.frequency.value = hz * (1 + (Math.random() - 0.5) * 0.01);
        const vib = track(ctx.createOscillator()); vib.frequency.value = 4.5 + Math.random(); const vg = gainAt(hz * 0.012); vib.connect(vg); vg.connect(o.frequency);
        const F = [0, 1].map((k) => { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 7; f.frequency.value = VOW.a[k]; return f; });
        const s = gainAt(1); for (const f of F) { o.connect(f); f.connect(s); } s.connect(g); o.start(); vib.start(); voices.push({ o, F }); stops.push(o, vib);
      }
      const pg = gainAt(1); g.connect(pg); pg.connect(bus);
      ch = { g, pg, voices, stops, beat: 0, t: 0 };
    }
    ch.g.gain.setTargetAtTime(v * 0.5, T(), 0.5); ch.v = v;
  }

  // the MACHINE: crushed static through a sweeping filter, its stutters and metal hits fired by tick()
  let mc = null;
  function machine(v) {
    if (!alive) return;
    if (!mc) {
      const s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4; f.frequency.value = 900;
      const pre = gainAt(4), sh = ctx.createWaveShaper(); sh.curve = crush.curve; const stut = gainAt(1), g = gainAt(0);
      s.connect(f); f.connect(pre); pre.connect(sh); sh.connect(stut); stut.connect(g); g.connect(bus); s.start();
      mc = { f, g, stut, v: 0, stops: [s] };
    }
    mc.g.gain.setTargetAtTime(v * 0.1, T(), 0.25); mc.v = v;
  }
  /** a hit of metal: a short ring-modulated clang, panned */
  function clang(gain = 0.4) {
    const t = T(), o = track(ctx.createOscillator(), t + 0.6), r = track(ctx.createOscillator(), t + 0.6); o.type = 'square'; o.frequency.value = 180 + Math.random() * 500; r.frequency.value = 700 + Math.random() * 1600;
    const rm = gainAt(0); r.connect(rm.gain); o.connect(rm); const e = gainAt(gain), p = ctx.createStereoPanner(); p.pan.value = Math.random() * 2 - 1;
    e.gain.setValueAtTime(gain, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.5); rm.connect(e); e.connect(p); p.connect(bus); o.start(t); r.start(t);
  }
  /** each frame: the chant's pulse, the machine's sweeps and stutters, the odd clang - by how loud they are now */
  function tick(dt) {
    if (!alive) return;
    if (ch && ch.v > 0.01) {
      ch.t += dt; const beat = Math.floor(ch.t * (1.4 + ch.v * 1.6));   // (the chant quickening as it builds)
      if (beat !== ch.beat) { ch.beat = beat; const V = beat % 2 ? VOW.e : VOW.a, t = T();
        for (const x of ch.voices) x.F.forEach((f, k) => f.frequency.setTargetAtTime(V[k], t, 0.04));
        ch.pg.gain.setValueAtTime(0.35, t); ch.pg.gain.linearRampToValueAtTime(1, t + 0.05); }
    }
    if (mc && mc.v > 0.01) {
      if (Math.random() < dt * 12) mc.f.frequency.setTargetAtTime(200 + Math.random() * 4000, T(), 0.02);
      if (Math.random() < dt * 5 * mc.v) { const t = T(), n = 3 + ((Math.random() * 6) | 0), w = 0.02 + Math.random() * 0.04; for (let i = 0; i < n; i++) { mc.stut.gain.setValueAtTime(0, t + i * w * 2); mc.stut.gain.setValueAtTime(1, t + i * w * 2 + w); } }
      if (Math.random() < dt * 1.6 * mc.v) clang(0.2 + mc.v * 0.3);
    }
  }
  /** a rat's squeal: a thin chirp wobbling up, now and then a trill */
  function squeak(pan = 0, gain = 0.12) {
    if (!alive) return; const t = T(), n = Math.random() < 0.3 ? 3 : 1;
    for (let i = 0; i < n; i++) { const t0 = t + i * 0.07, o = track(ctx.createOscillator(), t0 + 0.14), f = 2600 + Math.random() * 2400; o.type = 'triangle';
      o.frequency.setValueAtTime(f, t0); o.frequency.linearRampToValueAtTime(f * 1.35, t0 + 0.05); o.frequency.linearRampToValueAtTime(f * 0.9, t0 + 0.11);
      const e = gainAt(0), p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(gain, t0 + 0.01); e.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
      o.connect(e); e.connect(p); p.connect(bus); o.start(t0); }
  }
  /** a click in a throat, a joint cracking (a stalker twitching) */
  function click(pan = 0, gain = 0.3) {
    if (!alive) return; const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400 + Math.random() * 1600; f.Q.value = 6;
    const e = gainAt(0), p = ctx.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan));
    for (let i = 0; i < 3; i++) { const ti = t + i * (0.02 + Math.random() * 0.03); e.gain.setValueAtTime(gain, ti); e.gain.setValueAtTime(0, ti + 0.006); }
    s.connect(f); f.connect(e); e.connect(p); p.connect(bus); s.start(t); s.stop(t + 0.2);
  }
  /** a wet hit: a thump and a smack (blood on the rock, flesh) */
  function splat(gain = 0.4) {
    if (!alive) return; const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.18);
    const e = gainAt(0); e.gain.setValueAtTime(gain, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.25); s.connect(f); f.connect(e); e.connect(bus); s.start(t); s.stop(t + 0.3);
    const o = track(ctx.createOscillator(), t + 0.2); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15); const og = gainAt(0); og.gain.setValueAtTime(gain * 1.2, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.18); o.connect(og); og.connect(bus); o.start(t);
  }
  /** a shriek - the thing in your face: a torn voice up high, noise, metal */
  function shriek(gain = 0.7) {
    if (!alive) return; voice('IIIIIAAAAAAH', { f0: 420, rate: 0.5, gain, ring: 140, dist: 1 }); voice('AAAAAAAAH', { f0: 95, rate: 0.55, gain: gain * 0.8, ring: 33, dist: 1 }); clang(gain * 0.8);
    const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800; const e = gainAt(gain * 0.5); e.gain.setValueAtTime(gain * 0.5, t); e.gain.exponentialRampToValueAtTime(0.001, t + 1.1); s.connect(f); f.connect(e); e.connect(bus); s.start(t); s.stop(t + 1.2);
  }
  /**
   * A portal's hum, to be found by in the dark: a low chord beating, a whisper of noise over it -> { set(pan, gain), stop() }
   * (the closer, the louder; panned to where it is)
   */
  function hum() {
    if (!alive) return { set() {}, stop() {} };
    const g = gainAt(0), p = ctx.createStereoPanner(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700; f.connect(g); g.connect(p); p.connect(bus);
    const os = [65.4, 98.3, 130.1, 155.8].map((hz) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz * (1 + (Math.random() - 0.5) * 0.008); const og = gainAt(0.18); o.connect(og); og.connect(f); o.start(); return o; });
    const lfo = ctx.createOscillator(), lg = gainAt(300); lfo.frequency.value = 0.3 + Math.random() * 0.3; lfo.connect(lg); lg.connect(f.frequency); lfo.start(); os.push(lfo);
    const w = noise(), wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 2200; wf.Q.value = 2; const wg = gainAt(0.25); w.connect(wf); wf.connect(wg); wg.connect(g); w.start();
    return { set(pan, gain) { const t = T(); p.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)), t, 0.1); g.gain.setTargetAtTime(gain, t, 0.15); },
      stop() { const t = T(); g.gain.setTargetAtTime(0, t, 0.2); setTimeout(() => { for (const o of os) { try { o.stop(); } catch (e) { /* stopped */ } } try { w.stop(); } catch (e) { /* stopped */ } }, 1200); } };
  }
  /** a heartbeat - weak (two thumps) */
  function heart(gain = 0.5) {
    const t = T(); for (const [d, g] of [[0, 1], [0.22, 0.6]]) { const o = track(ctx.createOscillator(), t + d + 0.3); o.frequency.setValueAtTime(62, t + d); o.frequency.exponentialRampToValueAtTime(34, t + d + 0.22);
      const e = gainAt(0); e.gain.setValueAtTime(0, t + d); e.gain.linearRampToValueAtTime(gain * g, t + d + 0.02); e.gain.exponentialRampToValueAtTime(0.001, t + d + 0.25); o.connect(e); e.connect(bus); o.start(t + d); }
  }
  /** a breath - thin, catching */
  function breath(gain = 0.12, dur = 1.4) {
    const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 0.8; const e = gainAt(0);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(gain, t + dur * 0.4); e.gain.linearRampToValueAtTime(0, t + dur); s.connect(f); f.connect(e); e.connect(bus); s.start(t); s.stop(t + dur + 0.05);
  }
  /**
   * It all collapses over s seconds: every pitch falls away (a tape stopping), the filter closes, the noise thins to
   * nothing - and the choir and the machine are let go (made afresh if called again). all: Hell's air with them.
   */
  function fizzle(s = 2.4, o = {}) {
    const t = T(), drop = [...oscs, ...(o.all && droneN ? droneN.os : [])];
    for (const x of drop) { try { x.frequency.cancelScheduledValues(t); x.frequency.setValueAtTime(Math.max(1, x.frequency.value), t); x.frequency.exponentialRampToValueAtTime(Math.max(1, x.frequency.value * 0.08), t + s); } catch (e) { /* gone */ } }
    lp.frequency.cancelScheduledValues(t); lp.frequency.setValueAtTime(lp.frequency.value, t); lp.frequency.exponentialRampToValueAtTime(140, t + s);
    const gone = [ch, mc].filter(Boolean); for (const n of gone) { n.g.gain.cancelScheduledValues(t); n.g.gain.setTargetAtTime(0, t + s * 0.4, s * 0.25); }
    if (o.all && droneN) droneN.g.gain.setTargetAtTime(0, t + s * 0.4, s * 0.25);
    ch = null; mc = null;
    setTimeout(() => { for (const n of gone) for (const x of n.stops) { try { x.stop(); } catch (e) { /* stopped */ } }
      if (alive) lp.frequency.setTargetAtTime(18000, T(), 0.05); }, s * 1000 + 300);   // (open again for what comes after: the heart, the breath)
  }
  function stop(s = 1) {
    if (!alive) return; alive = false; const t = T(); bus.gain.setTargetAtTime(0, t, s / 4);
    try { window.speechSynthesis?.cancel(); } catch (e) { /* none */ }
    setTimeout(() => { for (const o of [...oscs, ...loops, ...(droneN?.os || [])]) { try { o.stop(); } catch (e) { /* stopped */ } } try { bus.disconnect(); comp.disconnect(); } catch (e) { /* gone */ } }, s * 1000 + 200);
  }
  return { live: true, voice, drone, chant, machine, clang, tick, heart, breath, fizzle, stop, squeak, click, splat, shriek, hum, mute: (m) => bus.gain.setTargetAtTime(m ? 0 : 1, T(), 0.05) };
}
