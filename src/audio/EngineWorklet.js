// The engines, synthesised firing by firing in an AudioWorklet (audio/Audio.js loads it from a Blob).
//
// A 1.6 litre V6 turbo-hybrid fires three times a crank revolution: at 12 000 rpm the note's fundamental is 600 Hz
// (the old engine: two saw-tooth oscillators from 40 to 300 Hz, a truck an octave and more too low). Each firing is a
// pressure pulse into the exhaust: a sharp bark (the pulse itself, shaped), a burst of turbulent noise riding it, and
// the pipe's resonances it rings (fixed in frequency - the firing's harmonics sweep through them as the revs rise,
// which is what makes an engine sound like an engine and not a synthesiser). Each cylinder fires a little differently
// (its own strength, a few per cent of jitter every time): the half and the sixth orders - the rasp, the life in it.
// On the throttle the pulses are hard and bright; off it (the overrun) soft and dull, with the odd pop of unburnt fuel.
// Over it: the turbo's whistle (with the boost; a breath from the wastegate when the throttle shuts), the MGU-K's
// electric whine (deploying, harvesting under braking), the straight-cut gears. An upshift is an ignition cut - a
// crack and 40 ms of near silence; a downshift a blip and a crackle. The rev limiter stutters at 18 Hz, the pit-lane
// limiter at 9. The safety car is a front-engined V8 (four firings a revolution, a lower, rounder pipe).
//
// Voices: up to 8 at once (the car you are in or on, the cars round the microphone). Each: its own lowpass (the air
// over distance), gain, stereo position and Doppler (a factor on every frequency of it).
//
// Messages (port): { v: [{ i (slot), rpm, thr, gain, pan, lp, ob (0 outside .. 1 on board), dop, ers (-1 harvest ..
// 1 deploy), lim, plim, kind (0 F1, 1 V8), seed, up, down (counters: a change is a shift) }] }

export const ENGINE_WORKLET = `
const SR = sampleRate, TAU = Math.PI * 2;
// the pipe's resonances { f, q, g }: outside (the exhaust), on board (the airbox over the driver's head, the block)
const F1_OUT = [[230, 2.6, 0.75], [560, 3.5, 1.0], [820, 3.0, 0.7], [1180, 4.5, 0.9], [2350, 4.0, 0.62], [4300, 3.0, 0.24], [7600, 2.5, 0.05]];
const F1_IN = [[160, 2.2, 1.0], [420, 3.0, 0.95], [880, 3.5, 0.7], [1750, 3.5, 0.4], [3600, 2.5, 0.16]];
const V8 = [[110, 2.0, 1.0], [300, 2.6, 0.9], [720, 3.0, 0.55], [1500, 3.0, 0.3], [3200, 2.4, 0.1]];
function rng(s) { let x = (s * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) / 4294967296); }; }
class Voice {
  constructor(seed, kind) {
    this.kind = kind; this.r = rng(seed + 7); const r = this.r;
    this.nFire = kind === 1 ? 8 : 6;
    this.cyl = []; for (let k = 0; k < this.nFire; k++) this.cyl.push(1 + (r() - 0.5) * (kind === 1 ? 0.34 : 0.18));   // (each cylinder its own)
    this.ph = r(); this.next = Math.floor(this.ph * this.nFire) + 1; this.carry = 0;
    this.pulse = 0; this.noiseEnv = 0; this.pop = 0; this.popLp = 0; this.hp1 = 0; this.hp0 = 0;
    this.res = (kind === 1 ? V8 : F1_OUT).map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0, b0: 0, a1: 0, a2: 0, g: 0 }));
    this.resIn = (kind === 1 ? V8 : F1_IN).map(() => ({ x1: 0, x2: 0, y1: 0, y2: 0, b0: 0, a1: 0, a2: 0, g: 0 }));
    this.lp1 = 0; this.lp2 = 0; this.intake = 0; this.lp0x = 0; this.hpy = 0; this.idle = 0;
    this.tph = 0; this.mph = 0; this.gph = 0; this.boost = 0; this.gate = 0; this.lastThr = 0;
    this.cut = 0; this.blip = 0; this.popWin = 0; this.limPh = 0; this.up = -1; this.down = -1;
    // what it is now (c) and what it is asked to be (t)
    this.c = { rpm: 4000, thr: 0, gain: 0, pan: 0, lp: 12000, ob: 0, dop: 1, ers: 0 }; this.t = { ...this.c, lim: 0, plim: 0 };
    this.on = true; this.dead = false;
  }
  coeffs(set, R, dop, ob) {
    for (let i = 0; i < set.length; i++) {
      const f = Math.min(SR * 0.45, set[i][0] * dop), q = set[i][1], w = TAU * f / SR, al = Math.sin(w) / (2 * q), a0 = 1 + al;
      const z = R[i]; z.b0 = al / a0; z.a1 = -2 * Math.cos(w) / a0; z.a2 = (1 - al) / a0; z.g = set[i][2] * (i % 2 ? -1 : 1);   // (every other one inverted: between two of them they add, not cancel - no notch)
    }
  }
}
class Engines extends AudioWorkletProcessor {
  constructor() {
    super(); this.V = new Map(); this.n = 0;
    this.port.onmessage = (e) => {
      const L = e.data && e.data.v; if (!L) return;
      for (const m of L) {
        let v = this.V.get(m.i);
        if (!v || v.kind !== (m.kind | 0) || v.seed !== m.seed) { v = new Voice(m.seed | 0, m.kind | 0); v.seed = m.seed; v.up = m.up; v.down = m.down; v.c.rpm = m.rpm; v.c.dop = m.dop || 1; v.c.pan = m.pan || 0; v.c.lp = m.lp || 12000; v.c.ob = m.ob || 0; this.V.set(m.i, v); }
        const t = v.t; t.rpm = m.rpm; t.thr = m.thr; t.gain = m.gain; t.pan = m.pan; t.lp = m.lp; t.ob = m.ob; t.dop = m.dop; t.ers = m.ers; t.lim = m.lim; t.plim = m.plim;
        if (m.up !== v.up) { if (v.up >= 0 && m.up > v.up) v.cut = 0.042 * SR | 0; v.up = m.up; }
        if (m.down !== v.down) { if (v.down >= 0 && m.down > v.down) { v.blip = 0.07 * SR | 0; v.popWin = 0.35 * SR | 0; } v.down = m.down; }
      }
    };
  }
  process(_, outputs) {
    const out = outputs[0], L = out[0], R = out[1] || out[0], N = L.length;
    for (let j = 0; j < N; j++) { L[j] = 0; R[j] = 0; }
    const bt = N / SR;
    for (const [id, v] of this.V) {
      const c = v.c, t = v.t, r = v.r;
      // (a block's targets: the gain and the place eased, the revs eased fast - a shift is a step, not a slide)
      const kq = 1 - Math.exp(-bt / 0.035), kr = 1 - Math.exp(-bt / 0.012), ks = 1 - Math.exp(-bt / 0.06);
      const rpm0 = c.rpm, g0 = c.gain, p0 = c.pan;
      c.rpm += (t.rpm - c.rpm) * kr; c.thr += (t.thr - c.thr) * ks; c.gain += (t.gain - c.gain) * kq; c.pan += (t.pan - c.pan) * kq;
      c.lp += (t.lp - c.lp) * kq; c.ob += (t.ob - c.ob) * kq; c.dop += (t.dop - c.dop) * kq; c.ers += (t.ers - c.ers) * ks;
      if (c.gain < 1e-4 && t.gain < 1e-4) { if (++v.idle > 40) this.V.delete(id); continue; } v.idle = 0;
      const dop = c.dop, ob = c.ob, thr = c.thr, V8k = v.kind === 1;
      v.coeffs(V8k ? V8 : F1_OUT, v.res, dop, ob); v.coeffs(V8k ? V8 : F1_IN, v.resIn, dop, ob);
      const rN = Math.max(0, Math.min(1.1, (c.rpm - (V8k ? 900 : 4000)) / (V8k ? 6000 : 8000)));
      // the boost: up slowly with throttle and revs, down quickly - and the wastegate's breath when the throttle shuts
      const bT = thr * Math.min(1, rN * 1.2); v.boost += (bT - v.boost) * (1 - Math.exp(-bt / (bT > v.boost ? 0.35 : 0.12)));
      if (v.lastThr > 0.65 && thr < 0.25 && v.boost > 0.4) v.gate = Math.max(v.gate, v.boost); v.lastThr = thr;
      const amp = (0.32 + 0.68 * thr) * (0.55 + 0.45 * Math.min(1, rN)), bright = 0.35 + 0.65 * thr;
      const shapeA = Math.exp(-1 / (SR * (0.00018 + 0.00035 * (1 - thr)))), lpA = Math.exp(-TAU * Math.max(300, Math.min(18000, c.lp)) / SR);
      const hpA = Math.exp(-TAU * 45 / SR), turbF = (V8k ? 0 : 1) * (1700 + 5600 * v.boost) * dop, mguF = c.rpm / 60 * 11 * dop, gearF = c.rpm / 60 * 7.3 * dop;
      const overrun = thr < 0.15 && rN > 0.3, limOn = t.lim > 0.5, plOn = t.plim > 0.5;
      for (let j = 0; j < N; j++) {
        const u = j / N, rpm = rpm0 + (c.rpm - rpm0) * u, gain = g0 + (c.gain - g0) * u, pan = p0 + (c.pan - p0) * u;
        // the crank: one cycle is 720 degrees (two revolutions), nFire firings in it
        const fc = rpm / 120 * dop, dph = fc / SR; v.ph += dph; if (v.ph >= 1) { v.ph -= 1; v.next -= v.nFire; }
        let ex = v.carry; v.carry = 0;
        // (the limiters: whole firings cut - the rev limiter at 18 Hz, the pit lane's at 9 and gentler)
        v.limPh += (limOn ? 18 : plOn ? 9 : 0) / SR; if (v.limPh > 1) v.limPh -= 1;
        const gateK = limOn ? (v.limPh < 0.3 ? 0.05 : 1) : plOn ? (v.limPh < 0.42 ? 0.3 : 1) : 1;
        if (v.ph * v.nFire >= v.next) {
          const k = ((v.next % v.nFire) + v.nFire) % v.nFire; v.next++;
          const frac = (v.ph * v.nFire - (v.next - 1)) / (dph * v.nFire);   // (how far into this sample it fell: shared with the next - no aliasing hiss from the timing)
          let a = amp * v.cyl[k] * (1 + (r() - 0.5) * 0.09) * gateK;
          if (v.cut > 0) a *= v.cut > 0.036 * SR ? 2.6 : 0.1;          // (the cut: one crack, then near nothing)
          if (v.blip > 0) a *= 1.35;
          if ((overrun || plOn) && rN > 0.25 && r() < (v.popWin > 0 ? 0.07 : plOn ? 0.035 : 0.003)) v.pop = Math.max(v.pop, 0.6 + r() * 0.8);   // (unburnt fuel lighting in the pipe)
          if (overrun) a *= 0.6;
          ex += a * Math.min(1, frac); v.carry += a * Math.max(0, 1 - frac);
        }
        if (v.cut > 0) v.cut--; if (v.blip > 0) v.blip--; if (v.popWin > 0) v.popWin--;
        // the pulse (its bark) and the noise that rides it
        v.pulse = v.pulse * shapeA + ex;
        v.noiseEnv = v.noiseEnv * 0.9965 + ex * 0.6;
        const wn = r() * 2 - 1, turb = wn * v.noiseEnv * (0.22 + 0.3 * (1 - thr));
        const x = v.pulse * 0.5 + turb;
        // the pipe (outside) and the airbox and block (on board)
        let yo = 0, yi = 0;
        for (let i = 0; i < v.res.length; i++) { const z = v.res[i], y = z.b0 * (x - z.x2) - z.a1 * z.y1 - z.a2 * z.y2; z.x2 = z.x1; z.x1 = x; z.y2 = z.y1; z.y1 = y; yo += y * z.g * (i >= 4 ? bright : 1); }
        for (let i = 0; i < v.resIn.length; i++) { const z = v.resIn[i], y = z.b0 * (x - z.x2) - z.a1 * z.y1 - z.a2 * z.y2; z.x2 = z.x1; z.x1 = x; z.y2 = z.y1; z.y1 = y; yi += y * z.g; }
        // the intake's roar on board: noise breathing with the firings
        v.intake = v.intake * 0.995 + Math.abs(ex) * 0.02;
        let s = (yo * 3.2 + v.pulse * 0.35 * bright) * (1 - ob * 0.55) + (yi * 3.4 + wn * v.intake * 1.6 * thr) * ob * (V8k ? 0 : 1) + (V8k ? yi * 2.2 * ob : 0);
        // the pop: a bang of noise, dulled
        if (v.pop > 0.002) { v.popLp += ((r() * 2 - 1) * v.pop - v.popLp) * 0.25; s += v.popLp * 1.4; v.pop *= 0.9975; }
        // the turbo's whistle, the wastegate's breath, the MGU-K, the gears
        if (turbF > 0) { v.tph += turbF / SR; if (v.tph > 1) v.tph -= 1; s += Math.sin(TAU * v.tph) * 0.018 * v.boost * (0.4 + 0.6 * ob); }
        if (v.gate > 0.002) { v.hp1 = wn - v.hp0 + 0.9 * v.hp1; v.hp0 = wn; s += v.hp1 * v.gate * 0.05; v.gate *= 0.99985; }
        if (!V8k) {
          v.mph += mguF / SR; if (v.mph > 1) v.mph -= 1; const e = Math.abs(c.ers);
          if (e > 0.01) s += (Math.sin(TAU * v.mph) + 0.4 * Math.sin(TAU * v.mph * 1.5)) * e * (c.ers < 0 ? 0.03 : 0.018) * (0.35 + 0.65 * ob);
          v.gph += gearF / SR; if (v.gph > 1) v.gph -= 1; s += Math.sin(TAU * v.gph) * 0.006 * (0.3 + ob);
        }
        // DC out, the air's lowpass (two poles), the level and the place
        const hp = s - v.lp0x + hpA * v.hpy; v.lp0x = s; v.hpy = hp;
        v.lp1 = v.lp1 * lpA + hp * (1 - lpA); v.lp2 = v.lp2 * lpA + v.lp1 * (1 - lpA);
        const o = v.lp2 * gain, a = (pan + 1) * Math.PI / 4;
        L[j] += o * Math.cos(a); R[j] += o * Math.sin(a);
      }
    }
    // the bus: a soft knee, never a hard clip
    for (let j = 0; j < N; j++) { L[j] = Math.tanh(L[j]); R[j] = Math.tanh(R[j]); }
    return true;
  }
}
registerProcessor('f1-engines', Engines);
`;
