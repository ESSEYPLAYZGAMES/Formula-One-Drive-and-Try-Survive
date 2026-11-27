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

const NOOP = new Proxy({}, { get: (_, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'live' ? false : () => NOOP) });   // (no sound: every call nothing - and nothing as a number too)
/** the formants (F1, F2, F3 in Hz) of a vowel */
const VOW = { a: [760, 1250, 2600], e: [500, 1850, 2550], i: [300, 2250, 3000], o: [500, 880, 2500], u: [330, 850, 2300], y: [300, 2100, 2900] };

export function afterSound(audio) {
  const ctx = audio?.ready && audio.ctx; if (!ctx || !audio.out) return NOOP;
  const T = () => ctx.currentTime;
  const bus = ctx.createGain(); bus.gain.value = audio.muted ? 0 : 1;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 18000; lp.Q.value = 0.8;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2;
  bus.connect(lp); lp.connect(comp); comp.connect(audio.out);
  // (the SPACE: a long dark reverb - a cave - fed from everything; space(w) how much of it)
  const conv = ctx.createConvolver(); { const n = Math.floor(ctx.sampleRate * 3.6), ir = ctx.createBuffer(2, n, ctx.sampleRate); for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < n; i++) { const u = i / n; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - u, 1.9) * Math.min(1, i / (ctx.sampleRate * 0.012)); } } conv.buffer = ir; }
  const wet = ctx.createGain(); wet.gain.value = 0; bus.connect(wet); wet.connect(conv); conv.connect(comp);
  // (the BED: drone, choir, machine, hums, the tone, the risers - on a gain of their own, to be pulled out from under you)
  const amb = ctx.createGain(); amb.connect(bus);
  const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const crush = ctx.createWaveShaper(); { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.round(Math.tanh(x * 3) * 6) / 6; } crush.curve = c; }   // (hard, stepped: a voice through a broken machine)
  const oscs = new Set();   // (every pitched thing still sounding: fizzle() drops them all)
  const track = (o, stopAt) => { oscs.add(o); o.onended = () => oscs.delete(o); if (stopAt) { const go = o.start.bind(o); o.start = (w) => { go(w); o.stop(stopAt); }; } return o; };   // (stopped when started)
  const gainAt = (v) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const loops = new Set(), noise = () => { const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true; s.loopStart = Math.random(); loops.add(s); s.onended = () => loops.delete(s); return s; };
  let alive = true;

  /**
   * A robotic voice speaking the shape of text -> its length (s). o: f0, rate, gain, pan (-1..1) or pos (a point round you),
   * ring (Hz), dist (0..1), say, delay, and:
   *   kind - which machine it is:  'grind' (a throat ring-modulated into metal, the default) | 'buzz' (a square wave
   *          crushed to a few steps, ringing high - a broken intercom) | 'whisper' (breath through the vowels, no pitch,
   *          gated - a voice made of static) | 'choir' (three throats a quarter-tone apart and an octave down - many
   *          mouths at once) | 'glitch' (every syllable stuttered, jumping pitch - a recording skipping) | 'shriek' (high,
   *          tearing, the vibrato wide);
   *   urgent - faster, louder, the pitch climbing through the line instead of falling (panic), the attacks hard.
   */
  const KINDS = ['grind', 'buzz', 'whisper', 'choir', 'glitch', 'shriek'];
  function voice(text, o = {}) {
    if (!alive) return 0;
    const kind = o.kind === 'any' ? KINDS[(Math.random() * KINDS.length) | 0] : (o.kind || 'grind'), urg = !!o.urgent;
    const t0 = T() + (o.delay || 0), rate = (o.rate || 1) * (urg ? 1.45 : 1) * (kind === 'glitch' ? 0.9 : 1), f0 = (o.f0 || 110) * (kind === 'shriek' ? 3.2 : kind === 'buzz' ? 1.4 : 1), str = String(text || '');
    // (the syllables: each vowel group, the consonants before it)
    const syl = []; let cons = 0; for (const m of str.toLowerCase().matchAll(/([^aeiouy]*)([aeiouy]+)/g)) { cons = m[1].replace(/[^a-z]/g, '').length; syl.push({ v: m[2][0], cons, pause: /[.,!?;:-]/.test(m[1]) }); }
    if (!syl.length) syl.push({ v: 'a', cons: 1 });
    const loud = (/!|[A-Z]{3,}/.test(str) ? 1.35 : 1) * (urg ? 1.3 : 1), ask = /\?\s*$/.test(str);
    const sd = 0.15 / rate, dur = syl.reduce((s, x) => s + sd + (x.pause ? 0.14 / rate : 0), 0) + 0.15, end = t0 + dur + 0.1;
    // the throat(s)
    const srcs = [], mul = kind === 'choir' ? [1, 1.029, 0.5] : [1];
    for (const m of mul) { const sx = track(ctx.createOscillator(), end); sx.type = kind === 'buzz' ? 'square' : 'sawtooth'; srcs.push({ o: sx, m }); }
    const sub = track(ctx.createOscillator(), end); sub.type = 'square'; sub.frequency.value = f0 / 2;
    const ring = track(ctx.createOscillator(), end); ring.frequency.value = kind === 'buzz' ? 260 + Math.random() * 380 : kind === 'shriek' ? 90 + Math.random() * 60 : (o.ring ?? 47);
    const rm = gainAt(0); ring.connect(rm.gain); const dry = gainAt(kind === 'buzz' ? 0.2 : 0.5);
    if (kind === 'whisper') { const n = noise(); n.connect(rm); n.connect(dry); n.start(t0); n.stop(end); }   // (no pitch: breath, made to speak)
    else { for (const x of srcs) { x.o.connect(rm); x.o.connect(dry); } const subG = gainAt(kind === 'shriek' ? 0 : 0.25); sub.connect(subG); subG.connect(rm); }
    // (the shriek's wide vibrato)
    if (kind === 'shriek') { const vb = track(ctx.createOscillator(), end), vg = gainAt(f0 * 0.06); vb.frequency.value = 7 + Math.random() * 4; vb.connect(vg); for (const x of srcs) vg.connect(x.o.frequency); vb.start(t0); }
    const F = [0, 1, 2].map((k) => { const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = (kind === 'whisper' ? [5, 7, 9] : [9, 12, 14])[k]; return f; });
    const fsum = gainAt(kind === 'whisper' ? 3 : 1); for (const f of F) { rm.connect(f); dry.connect(f); f.connect(fsum); }
    const sh = ctx.createWaveShaper(); sh.curve = crush.curve; const pre = gainAt(1 + (o.dist ?? 0.6) * (kind === 'buzz' ? 9 : 5)); fsum.connect(pre); pre.connect(sh);
    const env = gainAt(0), pan = o.pos ? p3(o.pos) : ctx.createStereoPanner(); if (!o.pos) pan.pan.value = Math.max(-1, Math.min(1, o.pan || 0));   // (o.pos: there, in the space round you)
    const out = gainAt((o.gain ?? 0.5) * loud * 0.6 * (kind === 'buzz' ? 0.7 : 1)); sh.connect(env); env.connect(out); out.connect(pan); pan.connect(bus);
    // (the hiss of the consonants)
    const hs = noise(), hf = ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 3200; const hg = gainAt(0); hs.connect(hf); hf.connect(hg); hg.connect(pan); hs.start(t0); hs.stop(end);
    let t = t0; for (const x of srcs) x.o.frequency.setValueAtTime(f0 * x.m, t0);
    syl.forEach((s, i) => {
      if (s.pause) { env.gain.setTargetAtTime(0, t, 0.02); t += 0.14 / rate; }
      const V = VOW[s.v] || VOW.a, j = 1 + (Math.random() - 0.5) * 0.12;
      if (s.cons) { hg.gain.setValueAtTime(0, t); hg.gain.linearRampToValueAtTime(0.05 * Math.min(3, s.cons) * (o.gain ?? 0.5) * (urg ? 1.6 : 1), t + 0.012); hg.gain.linearRampToValueAtTime(0, t + 0.05); }
      F.forEach((f, k) => f.frequency.setTargetAtTime(V[k] * j, t, 0.025));
      // (the pitch: calm - falling through a sentence, rising at a question; urgent - climbing all the way, panicking;
      //  glitch - jumping about between syllables)
      const k = i / Math.max(1, syl.length - 1);
      let p = f0 * (urg ? 0.92 + k * 0.6 : ask ? 0.95 + k * 0.4 : 1.12 - k * 0.3) * (1 + (Math.random() - 0.5) * (urg ? 0.22 : 0.14));
      if (kind === 'glitch') p *= Math.pow(2, ((Math.random() * 10) | 0) / 12 - 0.4);
      for (const x of srcs) x.o.frequency.setTargetAtTime(p * x.m, t, urg ? 0.015 : 0.03); sub.frequency.setTargetAtTime(p / 2, t, 0.03);
      if (kind === 'glitch') { const n = 2 + ((Math.random() * 3) | 0), w = sd / (n * 2); for (let q = 0; q < n; q++) { env.gain.setValueAtTime(1, t + q * 2 * w); env.gain.setValueAtTime(0, t + q * 2 * w + w); } }   // (the syllable skipping, over and over)
      else { env.gain.setTargetAtTime(1, t + (s.cons ? 0.03 : 0), urg ? 0.006 : 0.015); env.gain.setTargetAtTime(urg ? 0.55 : 0.25, t + sd * 0.7, 0.03); }
      t += sd;
    });
    env.gain.setTargetAtTime(0, t, 0.05);
    for (const x of srcs) x.o.start(t0); sub.start(t0); ring.start(t0);
    if (o.say) speak(str, o);
    return dur + (o.delay || 0);
  }
  /**
   * The same line, said by several of them at once, over each other - a little apart, in different machines, at
   * different pitches, from different places -> its length. o as voice(); o.n how many (default 3).
   */
  function mob(text, o = {}) {
    let L = 0; const n = o.n || 3;
    for (let k = 0; k < n; k++) L = Math.max(L, voice(text, { ...o, kind: o.kinds ? o.kinds[k % o.kinds.length] : 'any', f0: (o.f0 || 110) * (0.75 + Math.random() * 0.6), delay: (o.delay || 0) + k * (0.05 + Math.random() * 0.12), pan: o.pos ? undefined : Math.random() * 2 - 1, gain: (o.gain ?? 0.5) * (k ? 0.65 : 1), say: !k && o.say }));
    return L;
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
      const g = gainAt(0), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220; f.connect(g); g.connect(amb);
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
      const pg = gainAt(1); g.connect(pg); pg.connect(amb);
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
      s.connect(f); f.connect(pre); pre.connect(sh); sh.connect(stut); stut.connect(g); g.connect(amb); s.start();
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
    for (const C of choirs) { if (C.frozen) continue; C.t += dt; if (C.t > 7.5) { C.t = 0; C.k = (C.k + 1) % C.PROG.length; C.retune(); } }   // (the next chord, every few breaths)
    for (const Rr of risers) { Rr.ph = (Rr.ph + Rr.dir * Rr.speed * dt + Rr.N) % Rr.N; const t = T();
      Rr.os.forEach((x, i) => { const oct = (Rr.ph + i) % Rr.N, hz = 32 * Math.pow(2, oct), a = Math.exp(-Math.pow((oct - Rr.N / 2) / 1.3, 2)); x.o.frequency.setTargetAtTime(hz, t, 0.03); x.og.gain.setTargetAtTime(a, t, 0.03); }); }
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
  function click(pan = 0, gain = 0.3, pos = null) {
    if (!alive) return; const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400 + Math.random() * 1600; f.Q.value = 6;
    const e = gainAt(0), p = pos ? p3(pos) : ctx.createStereoPanner(); if (!pos) p.pan.value = Math.max(-1, Math.min(1, pan));
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
    const g = gainAt(0), p = ctx.createStereoPanner(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700; f.connect(g); g.connect(p); p.connect(amb);
    const os = [65.4, 98.3, 130.1, 155.8].map((hz) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz * (1 + (Math.random() - 0.5) * 0.008); const og = gainAt(0.18); o.connect(og); og.connect(f); o.start(); return o; });
    const lfo = ctx.createOscillator(), lg = gainAt(300); lfo.frequency.value = 0.3 + Math.random() * 0.3; lfo.connect(lg); lg.connect(f.frequency); lfo.start(); os.push(lfo);
    const w = noise(), wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 2200; wf.Q.value = 2; const wg = gainAt(0.25); w.connect(wf); wf.connect(wg); wg.connect(g); w.start();
    return { set(pan, gain) { const t = T(); p.pan.setTargetAtTime(Math.max(-1, Math.min(1, pan)), t, 0.1); g.gain.setTargetAtTime(gain, t, 0.15); },
      stop() { const t = T(); g.gain.setTargetAtTime(0, t, 0.2); setTimeout(() => { for (const o of os) { try { o.stop(); } catch (e) { /* stopped */ } } try { w.stop(); } catch (e) { /* stopped */ } }, 1200); } };
  }
  /**
   * THE STINGER - a jumpscare's sound, as loud as the game goes: round the compressor (nothing holds it down), a slam of
   * noise and a sub dropping out of the floor, a scream torn up through the top, a metal shriek - all in the same instant.
   */
  const loud = ctx.createGain(); loud.gain.value = audio.muted ? 0 : 1; const lsh = ctx.createWaveShaper(); { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(x * 2.2); } lsh.curve = c; }
  loud.connect(lsh); lsh.connect(audio.out);
  function stinger(gain = 1) {
    if (!alive) return; const t = T();
    const s = noise(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(9000, t); f.frequency.exponentialRampToValueAtTime(400, t + 0.9);
    const e = gainAt(0); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(1.1 * gain, t + 0.008); e.gain.exponentialRampToValueAtTime(0.001, t + 1.2); s.connect(f); f.connect(e); e.connect(loud); s.start(t); s.stop(t + 1.3);
    const o = track(ctx.createOscillator(), t + 1.3); o.type = 'sawtooth'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.1);
    const og = gainAt(0); og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(0.9 * gain, t + 0.01); og.gain.exponentialRampToValueAtTime(0.001, t + 1.2); o.connect(og); og.connect(loud); o.start(t);
    for (const [f0, f1, g] of [[900, 2400, 0.45], [1300, 3100, 0.35], [660, 1900, 0.3]]) { const q = track(ctx.createOscillator(), t + 1); q.type = 'square'; q.frequency.setValueAtTime(f0, t); q.frequency.exponentialRampToValueAtTime(f1, t + 0.35); q.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.9);
      const qg = gainAt(0); qg.gain.setValueAtTime(0, t); qg.gain.linearRampToValueAtTime(g * gain, t + 0.01); qg.gain.exponentialRampToValueAtTime(0.001, t + 0.95); q.connect(qg); qg.connect(loud); q.start(t); }
    voice('IIIIIIAAAAAAAH', { f0: 380, rate: 0.6, gain: 0.9 * gain, ring: 160, dist: 1 }); clang(0.9 * gain);
  }
  /** porcelain and wood rattling: a burst of hard little knocks */
  function rattle(gain = 0.3, dur = 0.4) {
    if (!alive) return; const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 900; f.Q.value = 5;
    const e = gainAt(0), n = Math.round(dur * 40); for (let i = 0; i < n; i++) { const ti = t + i * dur / n + Math.random() * 0.01; e.gain.setValueAtTime(gain * 2.6 * (0.5 + Math.random() * 0.5), ti); e.gain.setValueAtTime(0, ti + 0.012); }
    const p = ctx.createStereoPanner(); p.pan.value = Math.random() * 1.2 - 0.6; s.connect(f); f.connect(e); e.connect(p); p.connect(bus); s.start(t); s.stop(t + dur + 0.05);
  }
  /** a screech - the thing in the doll, through its little mouth */
  function screech(gain = 0.6) {
    if (!alive) return; voice(['IIIIIIIEEEEEE', 'AAAAAIIIIIIIH', 'EEEEEEAAAAH', 'NNNNIIIIIIAAAAH'][(Math.random() * 4) | 0], { f0: 300 + Math.random() * 260, rate: 0.55 + Math.random() * 0.3, gain, ring: 90 + Math.random() * 120, dist: 1, pan: Math.random() * 1.4 - 0.7 });
  }
  /** a pure tone, high and thin, hanging in the air (the false Heaven's only sound) -> { set(gain, sour 0..1), stop() } */
  function tone(hz = 1568) {
    if (!alive) return { set() {}, stop() {} };
    const a = ctx.createOscillator(), b = ctx.createOscillator(), g = gainAt(0); a.type = b.type = 'sine'; a.frequency.value = hz; b.frequency.value = hz * 1.0005;
    a.connect(g); b.connect(g); g.connect(amb); a.start(); b.start();
    return { set(gain, sour = 0) { const t = T(); g.gain.setTargetAtTime(gain, t, 0.4); b.frequency.setTargetAtTime(hz * (1.0005 + sour * 0.058), t, 0.6); },   // (sour: the second voice sliding a semitone off - the beating turning to a grind)
      stop() { const t = T(); g.gain.setTargetAtTime(0, t, 0.05); setTimeout(() => { try { a.stop(); b.stop(); } catch (e) { /* stopped */ } }, 400); } };
  }
  /** a point in the space round you (HRTF: in front, behind, above, below - and how far) */
  function p3(pos) {
    const p = ctx.createPanner(); p.panningModel = 'HRTF'; p.distanceModel = 'inverse'; p.refDistance = 1.5; p.rolloffFactor = 1.1; p.maxDistance = 80;
    if (p.positionX) { p.positionX.value = pos.x; p.positionY.value = pos.y; p.positionZ.value = pos.z; } else p.setPosition(pos.x, pos.y, pos.z);
    p.connect(bus); return p;
  }
  /** where your ears are, and which way they face (the camera) */
  function listen(pos, fwd, up) {
    const L = ctx.listener, t = T();
    if (L.positionX) { L.positionX.setTargetAtTime(pos.x, t, 0.02); L.positionY.setTargetAtTime(pos.y, t, 0.02); L.positionZ.setTargetAtTime(pos.z, t, 0.02); L.forwardX.setTargetAtTime(fwd.x, t, 0.02); L.forwardY.setTargetAtTime(fwd.y, t, 0.02); L.forwardZ.setTargetAtTime(fwd.z, t, 0.02); L.upX.setTargetAtTime(up.x, t, 0.02); L.upY.setTargetAtTime(up.y, t, 0.02); L.upZ.setTargetAtTime(up.z, t, 0.02); }
    else { L.setPosition(pos.x, pos.y, pos.z); L.setOrientation(fwd.x, fwd.y, fwd.z, up.x, up.y, up.z); }
  }
  /** how much of the cave there is (0..1) */
  function space(w) { wet.gain.setTargetAtTime(w, T(), 0.3); }
  /** the bed pulled out from under you - all of it, at once - for dur seconds, then let back in slowly */
  function duck(dur = 1, to = 0) { const t = T(); amb.gain.cancelScheduledValues(t); amb.gain.setTargetAtTime(to, t, 0.03); amb.gain.setTargetAtTime(1, t + dur, 0.8); }
  /** the intake: a breath of air drawn backwards, rising to nothing - and the hit lands where it stops (dur seconds on) */
  function suck(dur = 0.6, gain = 0.5) {
    if (!alive) return; const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(5000, t + dur);
    const e = gainAt(0); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(gain, t + dur); e.gain.setValueAtTime(0, t + dur + 0.005); s.connect(f); f.connect(e); e.connect(loud); s.start(t); s.stop(t + dur + 0.05);
  }
  /**
   * The SHEPARD tone: octaves of sine gliding forever up (dir 1) or forever down (dir -1) - it never arrives, never stops
   * rising (or falling). -> { set(level, speed) }; moved on by tick()
   */
  const risers = [];
  function riser(dir = 1) {
    if (!alive) return { set() {} };
    const N = 7, g = gainAt(0), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3500; f.connect(g); g.connect(amb);
    const os = Array.from({ length: N }, () => { const o = ctx.createOscillator(), og = gainAt(0); o.type = 'sine'; o.connect(og); og.connect(f); o.start(); return { o, og }; });
    const R0 = { g, os, ph: Math.random(), speed: 0.06, dir, N, stop() { for (const x of os) { try { x.o.stop(); } catch (e) { /* stopped */ } } },
      set(level, speed) { g.gain.setTargetAtTime(level * 0.11, T(), 0.25); if (speed != null) R0.speed = speed; } };
    risers.push(R0); return R0;
  }
  /** a footfall: something heavy and long put down on rock, a scrape after it - there (pos) */
  function step(pos, gain = 0.5) {
    if (!alive) return; const t = T(), out = p3(pos); gain *= 1.6;
    const o = track(ctx.createOscillator(), t + 0.2); o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12); const og = gainAt(0); og.gain.setValueAtTime(gain, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.16); o.connect(og); og.connect(out); o.start(t);
    const s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 1.5; const e = gainAt(0); e.gain.setValueAtTime(0, t + 0.04); e.gain.linearRampToValueAtTime(gain * 0.25, t + 0.08); e.gain.exponentialRampToValueAtTime(0.001, t + 0.3); s.connect(f); f.connect(e); e.connect(out); s.start(t); s.stop(t + 0.32);
  }
  /** a creak: a joint bending further than it should - wood, gristle - there (pos) */
  function creak(pos, gain = 0.35) {
    if (!alive) return; const t = T(), d = 0.35 + Math.random() * 0.5, out = pos ? p3(pos) : bus;
    const o = track(ctx.createOscillator(), t + d + 0.05); o.type = 'sawtooth'; const f0 = 60 + Math.random() * 60; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * (0.7 + Math.random() * 0.8), t + d);
    const lfo = track(ctx.createOscillator(), t + d + 0.05); lfo.frequency.value = 20 + Math.random() * 30; const lg = gainAt(0); lfo.connect(lg.gain);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900 + Math.random() * 900; bp.Q.value = 9; const e = gainAt(0); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(gain, t + 0.05); e.gain.setValueAtTime(gain, t + d - 0.08); e.gain.linearRampToValueAtTime(0, t + d);
    o.connect(lg); lg.connect(bp); bp.connect(e); e.connect(out); o.start(t); lfo.start(t);
  }
  /**
   * THE CHOIR of Heaven: six voices singing 'ah' - each a soft throat through two vowel formants, a slow vibrato, a breath
   * of swell of its own - moving gently through a long progression (I - vi - IV - V - I - iii - IV - V), every chord
   * sliding into the next. -> { set(level), freeze(on) (one chord held, unchanging, forever), sour(k) (the voices drifting
   * off their notes, out of tune with each other), stop() }
   */
  const choirs = [];
  function angels() {
    if (!alive) return { set() {}, freeze() {}, sour() {}, stop() {} };
    const PROG = [[48, 55, 60, 64, 67, 72], [45, 52, 57, 60, 64, 69], [41, 53, 57, 60, 65, 69], [43, 55, 59, 62, 67, 71], [48, 55, 60, 64, 67, 76], [40, 52, 55, 59, 64, 67], [41, 48, 57, 60, 65, 72], [43, 50, 59, 62, 67, 74]];
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12), g = gainAt(0); g.connect(amb);
    const V = PROG[0].map((m, i) => {
      const o = ctx.createOscillator(), o2 = ctx.createOscillator(); o.type = 'sawtooth'; o2.type = 'sine'; o.frequency.value = o2.frequency.value = mtof(m);
      const vib = ctx.createOscillator(), vg = gainAt(mtof(m) * 0.006); vib.frequency.value = 4.6 + Math.random() * 0.8; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
      const f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), f3 = ctx.createBiquadFilter(); f1.type = f2.type = f3.type = 'bandpass'; f1.frequency.value = 730; f2.frequency.value = 1090; f3.frequency.value = 2440; f1.Q.value = 7; f2.Q.value = 9; f3.Q.value = 12;
      const sw = gainAt(0.6), lfo = ctx.createOscillator(), lg = gainAt(0.35); lfo.frequency.value = 0.08 + Math.random() * 0.07; lfo.connect(lg); lg.connect(sw.gain);   // (each voice breathing on its own)
      const mix = gainAt(i < 2 ? 0.55 : 0.4), pan = ctx.createStereoPanner(); pan.pan.value = (i / 5) * 1.4 - 0.7;
      o.connect(f1); o.connect(f2); o.connect(f3); const sg = gainAt(0.5); o2.connect(sg); sg.connect(sw); f1.connect(sw); f2.connect(sw); const f3g = gainAt(0.4); f3.connect(f3g); f3g.connect(sw);
      sw.connect(mix); mix.connect(pan); pan.connect(g); for (const x of [o, o2, vib, lfo]) x.start();
      return { o, o2, vg, m, stops: [o, o2, vib, lfo], off: (Math.random() - 0.5) * 2 };
    });
    const C = { g, V, k: 0, t: 0, frozen: false, sourK: 0, PROG, mtof,
      set(level) { g.gain.setTargetAtTime(level * 0.14, T(), 1.2); },
      freeze(on) { C.frozen = !!on; },
      sour(k) { C.sourK = k; C.retune(); },
      retune() { const t = T(); C.V.forEach((v, i) => { const hz = C.mtof(C.PROG[C.k][i] + v.off * C.sourK * 0.9); v.o.frequency.setTargetAtTime(hz, t, C.frozen ? 0.8 : 1.6); v.o2.frequency.setTargetAtTime(hz, t, C.frozen ? 0.8 : 1.6); }); },
      stop() { const t = T(); g.gain.setTargetAtTime(0, t, 0.05); setTimeout(() => { for (const v of C.V) for (const x of v.stops) { try { x.stop(); } catch (e) { /* stopped */ } } }, 600); } };
    choirs.push(C); return C;
  }
  /** a heartbeat - weak (two thumps) */
  function heart(gain = 0.5) {
    const t = T(); for (const [d, g] of [[0, 1], [0.22, 0.6]]) { const o = track(ctx.createOscillator(), t + d + 0.3); o.frequency.setValueAtTime(62, t + d); o.frequency.exponentialRampToValueAtTime(34, t + d + 0.22);
      const e = gainAt(0); e.gain.setValueAtTime(0, t + d); e.gain.linearRampToValueAtTime(gain * g, t + d + 0.02); e.gain.exponentialRampToValueAtTime(0.001, t + d + 0.25); o.connect(e); e.connect(bus); o.start(t + d); }
  }
  /** a breath - thin, catching */
  function breath(gain = 0.12, dur = 1.4, pos = null) {
    const t = T(), s = noise(), f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = pos ? 700 : 1100; f.Q.value = 0.8; const e = gainAt(0);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(gain, t + dur * 0.4); e.gain.linearRampToValueAtTime(0, t + dur); s.connect(f); f.connect(e); e.connect(pos ? p3(pos) : bus); s.start(t); s.stop(t + dur + 0.05);
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
    if (!alive) return; alive = false; const t = T(); bus.gain.setTargetAtTime(0, t, s / 4); loud.gain.setTargetAtTime(0, t, s / 4);
    try { window.speechSynthesis?.cancel(); } catch (e) { /* none */ }
    setTimeout(() => { for (const Rr of risers) Rr.stop(); for (const C of choirs) C.stop(); for (const o of [...oscs, ...loops, ...(droneN?.os || [])]) { try { o.stop(); } catch (e) { /* stopped */ } } try { bus.disconnect(); comp.disconnect(); } catch (e) { /* gone */ } }, s * 1000 + 200);
  }
  return { live: true, voice, drone, chant, machine, clang, tick, heart, breath, fizzle, stop, squeak, click, splat, shriek, hum, stinger, rattle, screech, tone, angels, mob, listen, space, duck, suck, riser, step, creak, mute: (m) => bus.gain.setTargetAtTime(m ? 0 : 1, T(), 0.05) };
}
