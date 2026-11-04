// Dynamic weather: rain that comes and goes during a session, a track that gets wet corner by corner and dries again,
// a dry line that the cars clear, and a forecast that is sometimes wrong.
//
//  * The sky is a set of rain CELLS, each a soft disc of rain drifting across the circuit on the wind. A cell is born,
//    grows over a minute or two, rains and dies away. Where its path crosses the circuit decides what gets wet: one
//    that passes off to the side clips a corner or two, or misses entirely; a big slow one covers everything. A wet race
//    is one huge cell over the whole map that eases off at a time of its own.
//  * The TRACK is held every 10 m of the lap as two water levels: off the line, and on the racing line. Rain raises
//    both toward a level its strength allows - gradually: a drizzle takes minutes to make a track damp, a downpour a
//    minute or so to soak it. The sun and the wind dry both, slower at night; and every car through a stretch on the
//    line pushes water off it - the dry line, a ribbon of grip a car's width wide with wet asphalt either side of it.
//    Some stretches drain worse than others (the dips, the kerbs' edges): they stay wet longest.
//  * The FORECAST is what the teams believe: the real cells, each with its timing a few minutes out, some never seen
//    until the radar picks them up (little notice), and showers that only exist in the forecast and break up before
//    they arrive. The radar firms a cell up as it comes within a few minutes.
//
// Everything here is the race director's (it is a flashback anchor: rewound with the race). Read by the cars' physics
// (wetAt: the water under a car), the AI (its strategy and its plan), the HUD, the engineer and the road's shader.
import * as THREE from 'three';

const BIN = 10;                 // m of lap per track cell
const LINE_W = 1.5;             // the dry line's half width (m, a gaussian's sigma)
const TICK = 0.25;              // s between track updates
export const WX_LABEL = { dry: 'Dry', damp: 'Damp', wet: 'Wet', changeable: 'Changeable' };

/** a small seeded random (mulberry32): the weather of a session is the same however often it is rewound */
function rng(seed) {
  let a = (seed >>> 0) || 1;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/**
 * The weekend's weather, drawn once: what race day really brings (kind) and what was forecast for it. A career's
 * forecast was drawn with the calendar and is not always right; a chosen quick race is the weather chosen.
 *   kind: 'dry' | 'damp' | 'wet' | 'changeable'   seed: the sky of each session is drawn from it
 *   start: the track's wetness at the start (0 dry .. 1 flooded) - the starting tyres are chosen on it
 */
export function weatherPlan(kind, { forecast = null, night = false } = {}) {
  kind = WX_LABEL[kind] ? kind : 'dry';
  let truth = kind;
  if (forecast) {   // (race day against its forecast: mostly as said, now and then not)
    const r = Math.random();
    truth = kind === 'dry' ? (r < 0.84 ? 'dry' : r < 0.97 ? 'changeable' : 'damp')
      : kind === 'changeable' ? (r < 0.62 ? 'changeable' : r < 0.84 ? 'dry' : 'damp')
      : kind === 'damp' ? (r < 0.58 ? 'damp' : r < 0.8 ? 'changeable' : r < 0.9 ? 'dry' : 'wet')
      : (r < 0.7 ? 'wet' : r < 0.88 ? 'damp' : 'changeable');
  }
  const seed = (Math.random() * 2 ** 31) | 0, R = rng(seed);
  const start = truth === 'wet' ? 0.72 + 0.1 * R() : truth === 'damp' ? 0.3 + 0.1 * R() : truth === 'changeable' && R() < 0.3 ? 0.12 + 0.1 * R() : 0;
  return { kind: truth, said: kind, seed, start: +start.toFixed(2), night };
}

/** the start's wetness a weather name means, before any plan is drawn (the menus' preview, the title screen) */
export const nameWetness = (w) => (w === 'wet' ? 0.75 : w === 'damp' ? 0.35 : 0);

export class Weather {
  /**
   * @param o { track, line, plan (weatherPlan), duration (s the session should take), session: 'race'|'quali'|'practice'|'tt',
   *            fixed: true - the start's wetness held all session (time trial, the calibration runs) }
   */
  constructor(o) {
    this.track = o.track; this.line = o.line;
    const plan = o.plan || weatherPlan('dry'), tr = o.track, L = tr.length;
    this.kind = plan.kind; this.said = plan.said || plan.kind; this.fixed = !!o.fixed; this.night = !!plan.night;
    this.dur = Math.max(240, o.duration || 900); this.session = o.session || 'race';
    this.time = 0; this.acc = 0; this.n = Math.max(8, Math.ceil(L / BIN)); this.bl = L / this.n;   // (a track cell's length: the lap in n equal cells)
    const n = this.n, R = rng(plan.seed + ({ race: 0, quali: 7919, practice: 104729, tt: 1299709 }[this.session] || 0));
    // ---- the circuit's geometry under the cells (static: never part of a flashback - Flashback SKIP '_g')
    const g = this._g = { x: new Float32Array(n), z: new Float32Array(n), off: new Float32Array(n), drain: new Float32Array(n), corner: new Array(n), L, D: 1, cx: 0, cz: 0 };
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    const f = {}, corners = (tr.def.corners || []).filter((c) => c.s != null);
    const ph = [R() * 6.28, R() * 6.28, R() * 6.28];
    for (let i = 0; i < n; i++) {
      const s = (i + 0.5) * L / n; tr.sample(s, 0, f); g.x[i] = f.x; g.z[i] = f.z; g.off[i] = this.line ? this.line.offsetAt(s) : 0;
      x0 = Math.min(x0, f.x); x1 = Math.max(x1, f.x); z0 = Math.min(z0, f.z); z1 = Math.max(z1, f.z);
      // (how well a stretch drains: low spots and flat ones hold water - a smooth noise round the lap, 0.55 .. 1.35)
      const u = s / L * 6.283;
      g.drain[i] = 0.95 + 0.22 * Math.sin(u * 3 + ph[0]) + 0.13 * Math.sin(u * 7 + ph[1]) + 0.06 * Math.sin(u * 17 + ph[2]);
      let best = null, bd = 260; for (const c of corners) { let dd = Math.abs(c.s - s); dd = Math.min(dd, L - dd); if (dd < bd) { bd = dd; best = c; } }
      g.corner[i] = best ? (best.name || `Turn ${best.n}`) : null;
    }
    g.cx = (x0 + x1) / 2; g.cz = (z0 + z1) / 2; g.D = Math.max(400, Math.hypot(x1 - x0, z1 - z0));
    // ---- the track's water: off the line and on it, every BIN m
    this.water = new Float32Array(n); this.lineW = new Float32Array(n); this.rainB = new Float32Array(n);
    const w0 = plan.start || 0;
    for (let i = 0; i < n; i++) {
      const pud = clamp01(w0 * (0.75 + 0.35 * (g.drain[i] - 0.4)));
      this.water[i] = pud; this.lineW[i] = clamp01(pud * (w0 > 0.5 ? 0.9 : 0.78));
    }
    // ---- the sky
    this.cells = this.fixed ? [] : this._sky(R, plan);
    for (const c of this.cells) this._path(c);
    // ---- the forecast: the real cells as believed (timing off, some unseen) and showers that never come
    this.believed = [];
    this._forecast(R);
    // ---- what has happened (for the engineer and the AI): the wettest it has been, the radio's memory
    this.everWet = w0 > 0.25; this.peakRain = 0; this.said0 = false; this.saidAt = -100; this.news = []; this.secWas = [w0, w0, w0];
    this.rainNow = 0; this.avgLine = 0; this.avgOff = 0; this.summary();
    // ---- the road's shader texture: per track cell [off-line water, line water, line offset, rain]
    const data = new Uint8Array(n * 4);
    this.tex = new THREE.DataTexture(data, n, 1, THREE.RGBAFormat); this.tex.magFilter = THREE.LinearFilter; this.tex.minFilter = THREE.LinearFilter;
    this.tex.wrapS = THREE.RepeatWrapping; this.tex.needsUpdate = true; this._texData = data; this.fillTex();
  }

  // ---- the sky -----------------------------------------------------------------------------------------------------
  /** the session's cells, by what the day is (times in s from the session's start, T its length) */
  _sky(R, plan) {
    const T = this.dur, D = this._g.D, out = [], wind = () => { const a = R() * 6.283, v = 5 + R() * 8; return [Math.cos(a) * v, Math.sin(a) * v]; };
    const cell = (o) => { const [vx, vz] = o.wind || wind(); out.push({ tC: o.tC, R: o.R, peak: o.peak, vx, vz, miss: o.miss ?? 0, life: o.life, grow: o.grow ?? 90 + R() * 90, fade: o.fade ?? 80 + R() * 80, wob: R() * 6.28, sneaky: !!o.sneaky, phantom: false }); };
    const k = plan.kind;
    if (k === 'damp') {
      const r = R();
      if (r < 0.28) cell({ tC: -60, R: D * 3, peak: 0.12 + 0.12 * R(), miss: 0, life: 260 + R() * T * 0.5, wind: [1 + R(), 1 + R()] });   // (a drizzle hanging on at the start)
      else if (r < 0.5) cell({ tC: T * (0.3 + 0.45 * R()), R: D * (0.5 + 0.6 * R()), peak: 0.45 + 0.45 * R(), miss: D * (R() - 0.5) * 0.8, life: 0, sneaky: R() < 0.3 });
    } else if (k === 'wet') {
      // (the rain over the whole map: steady, easing at its own time - before the end, or not at all)
      const r = R(), ease = r < 0.42 ? T * (0.25 + 0.35 * R()) : r < 0.85 ? T * (1.05 + 0.6 * R()) : T * (0.55 + 0.3 * R());
      cell({ tC: 0, R: D * 4, peak: 0.55 + 0.25 * R(), miss: 0, life: 2 * ease + 240, grow: 30, fade: 150 + R() * 150, wind: [0.6 * (R() - 0.5), 0.6 * (R() - 0.5)] });
      out[out.length - 1].t0 = -300; out[out.length - 1].t1 = ease;
      if (r >= 0.85) cell({ tC: T * (0.3 + 0.3 * R()), R: D * (0.6 + 0.5 * R()), peak: 0.9 + 0.1 * R(), miss: D * (R() - 0.5) * 0.4, life: 0 });   // (and a downpour on top of it)
    } else if (k === 'changeable') {
      const m = 1 + (R() < 0.55 ? 1 : 0) + (R() < 0.25 ? 1 : 0);
      for (let j = 0; j < m; j++) {
        const Rr = D * (0.45 + 0.9 * R());
        cell({ tC: T * (0.12 + 0.75 * R()), R: Rr, peak: 0.35 + 0.65 * R(), miss: (R() < 0.5 ? -1 : 1) * Rr * Math.pow(R(), 0.8) * 1.6, life: 0, sneaky: R() < 0.3 });
      }
    }
    return out;
  }
  /**
   * A cell's path over the circuit: its start and end (the times it lives), where its centre is at time t, and from
   * a sweep of its life: when the first drop reaches the track (tArrive), when the last leaves it, how much of the lap
   * it covers, and the corner it reaches first
   */
  _path(c) {
    const g = this._g, v = Math.hypot(c.vx, c.vz) || 1, ux = c.vx / v, uz = c.vz / v;
    // (the centre crosses the line through the circuit's middle at tC, `miss` m to the side of it)
    c.ax = g.cx - uz * c.miss; c.az = g.cz + ux * c.miss;
    if (c.t0 == null) {
      const cross = (2 * c.R + g.D) / v;   // (from first touching the map to leaving it)
      c.life = c.life || cross + c.grow + c.fade;
      c.t0 = c.tC - c.life / 2; c.t1 = c.tC + c.life / 2;
    }
    let first = null, last = null, firstBin = -1, hit = 0;
    const seen = new Uint8Array(this.n);
    for (let t = c.t0; t <= c.t1; t += 5) {
      for (let i = 0; i < this.n; i += 2) {
        if (this.cellAt(c, g.x[i], g.z[i], t) > 0.05) { if (first == null) { first = t; firstBin = i; } last = t; if (!seen[i]) { seen[i] = 1; hit++; } }
      }
    }
    c.tArrive = first; c.tLeave = last; c.cover = hit / Math.ceil(this.n / 2); c.firstAt = firstBin >= 0 ? g.corner[firstBin] : null;
    c.from = this.compass(-c.vx, -c.vz);
  }
  /** a cell's rain at (x, z) at time t: 0 .. its peak */
  cellAt(c, x, z, t) {
    if (t < c.t0 || t > c.t1) return 0;
    const env = smooth(c.t0, c.t0 + c.grow, t) * (1 - smooth(c.t1 - c.fade, c.t1, t));
    if (env <= 0) return 0;
    const cx = c.ax + c.vx * (t - c.tC), cz = c.az + c.vz * (t - c.tC), d = Math.hypot(x - cx, z - cz) / c.R;
    if (d >= 1) return 0;
    // (soft edges, and heavier and lighter bands inside it that move with it)
    const core = 1 - smooth(0.45, 1, d), band = 0.78 + 0.22 * Math.sin((x - cx) * 0.004 + (z - cz) * 0.003 + c.wob + t * 0.01);
    return c.peak * env * core * band;
  }
  /** the rain at a point now (the camera's: the drops on screen and the light) */
  rainAt(x, z, t = this.time) { let r = 0; for (const c of this.cells) r = Math.max(r, this.cellAt(c, x, z, t)); return r; }
  /** cloud: how dark the sky is at a point - rain nearby darkens it before it arrives */
  cloudAt(x, z, t = this.time) {
    let k = 0;
    for (const c of this.cells) {
      if (t < c.t0 - 60 || t > c.t1 + 60) continue;
      const env = smooth(c.t0 - 60, c.t0 + c.grow, t) * (1 - smooth(c.t1 - c.fade, c.t1 + 60, t));
      const cx = c.ax + c.vx * (t - c.tC), cz = c.az + c.vz * (t - c.tC), d = Math.hypot(x - cx, z - cz) / c.R;
      k = Math.max(k, env * (1 - smooth(0.6, 1.9, d)) * Math.min(1, 0.45 + c.peak));
    }
    return k;
  }
  compass(x, z) { const a = Math.atan2(x, -z) * 180 / Math.PI, k = Math.round(((a + 360) % 360) / 45) % 8; return ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][k]; }

  // ---- the forecast ------------------------------------------------------------------------------------------------
  /**
   * What the pit walls believe: each real cell with its timing off by a few minutes and its chance of hitting not quite
   * right (or, sneaky, unseen until the radar has it a minute or two out); and a shower or two that never comes
   */
  _forecast(R) {
    const T = this.dur;
    for (const c of this.cells) {
      if (c.tArrive == null && !(c.t0 < 0)) { /* (a cell that never reaches the track: believed anyway, a near miss) */ }
      const hits = c.tArrive != null;
      this.believed.push({ c, sneaky: c.sneaky, seen: !c.sneaky, shift: (R() - 0.5) * 2 * (90 + 150 * R()), p: hits ? 0.45 + 0.35 * R() : 0.25 + 0.35 * R(), peak: c.peak * (0.7 + 0.6 * R()), gone: false });
    }
    // (a false alarm: in a changeable or damp day, now and then on a dry one)
    const pFalse = this.kind === 'changeable' ? 0.55 : this.kind === 'damp' ? 0.35 : this.kind === 'dry' && !this.fixed ? 0.22 : this.kind === 'wet' ? 0.15 : 0;
    if (!this.fixed && R() < pFalse) {
      const tC = T * (0.2 + 0.7 * R());
      this.believed.push({ c: null, phantom: true, tA: tC - 120, tL: tC + 240, shift: 0, p: 0.35 + 0.4 * R(), peak: 0.4 + 0.5 * R(), seen: true, gone: false, from: this.compass(R() - 0.5, R() - 0.5), firstAt: this._g.corner[(R() * this.n) | 0] });
    }
  }
  /** a believed cell's arrival and departure as the pit wall has them now */
  _bel(b) {
    if (b.phantom) return { a: b.tA, l: b.tL };
    const c = b.c; if (c.tArrive == null) return { a: c.tC - 120 + b.shift, l: c.tC + 120 + b.shift };
    return { a: c.tArrive + b.shift, l: c.tLeave + b.shift };
  }
  /** the radar: a cell within a few minutes is seen as it really is; a shower that is not there breaks up */
  _radar(dt) {
    const t = this.time;
    for (const b of this.believed) {
      if (b.gone) continue;
      const { a } = this._bel(b), eta = a - t;
      if (b.phantom) {
        if (eta < 200) { b.p = Math.max(0, b.p - dt / 90); if (b.p <= 0.02) { b.gone = true; this.note('broke', b); } }
        continue;
      }
      const c = b.c, range = b.sneaky ? 110 : 420;
      if (!b.seen && eta < range && c.tArrive != null) { b.seen = true; this.note('popup', b); }
      if (b.seen && eta < range) {
        const k = Math.min(1, dt / 40);
        b.shift += (0 - b.shift) * k; b.p += ((c.tArrive != null ? 0.92 : 0.05) - b.p) * k; b.peak += (c.peak - b.peak) * k;
        if (!b.radar && eta < range * 0.8) { b.radar = true; this.note('radar', b); }
      }
      if (c.tLeave != null && t > c.tLeave + 30) b.gone = true;
      if (c.tArrive == null && t > c.tC + 60) { b.gone = true; if (b.seen) this.note('missed', b); }
    }
  }
  /**
   * The outlook as the pit wall has it: { p (chance of rain at the track within `ahead` s), eta (s, the likeliest
   * shower's), peak (how hard), lasts (s), from, at (the corner it reaches first) } - the strongest believed shower in the
   * window. Raining now counts as p 1, eta 0.
   */
  outlook(ahead = 240) {
    const t = this.time; let best = { p: 0, eta: null, peak: 0, lasts: 0, from: null, at: null };
    if (this.rainNow > 0.05) best = { p: 1, eta: 0, peak: this.rainNow, lasts: this.rainLeft(), from: null, at: null };
    for (const b of this.believed) {
      if (b.gone || (!b.seen && !b.phantom && b.sneaky)) continue;
      const { a, l } = this._bel(b); if (l < t || a > t + ahead) continue;
      const p = b.p * (a > t ? 1 : 0.9);
      if (p > best.p || (best.eta === 0 && p > 0.3 && b.peak > best.peak && a > t)) {
        if (best.eta === 0 && a > t) { best.next = { p, eta: Math.max(0, a - t), peak: b.peak }; continue; }
        best = { p, eta: Math.max(0, a - t), peak: b.peak, lasts: Math.max(0, l - Math.max(a, t)), from: b.phantom ? b.from : b.c.from, at: b.phantom ? b.firstAt : b.c.firstAt };
      }
    }
    return best;
  }
  /** s until the rain falling on the track now stops, as far as the pit wall can tell */
  rainLeft() {
    const t = this.time; let l = 0;
    for (const b of this.believed) { if (b.gone || b.phantom) continue; const c = b.c; if (c.tArrive == null || t < c.tArrive || t > c.tLeave) continue; l = Math.max(l, c.tLeave + b.shift * 0.3 - t); }
    return Math.max(0, l);
  }
  /** the forecast strip: the chance of rain in each of `k` windows of `step` s from now (the HUD) */
  strip(k = 5, step = 120) {
    const t = this.time, out = [];
    for (let j = 0; j < k; j++) {
      const a0 = t + j * step, a1 = a0 + step; let q = 1, peak = 0;
      if (j === 0 && this.rainNow > 0.05) { q = 0; peak = this.rainNow; }
      for (const b of this.believed) {
        if (b.gone || (!b.seen && !b.phantom && b.sneaky)) continue;
        const { a, l } = this._bel(b); if (l < a0 || a > a1) continue;
        q *= 1 - b.p; peak = Math.max(peak, b.peak * b.p);
      }
      out.push({ p: 1 - q, peak });
    }
    return out;
  }

  // ---- the track ---------------------------------------------------------------------------------------------------
  /** a step of the session: the sky moves on, the track wets and dries, the cars clear the line */
  update(dt, cars) {
    this.time += dt; this.acc += dt;
    for (const c of cars || []) this._clear(c);
    if (this.acc < TICK) return;
    const h = this.acc; this.acc = 0;
    if (this.fixed) { this.summary(); return; }
    const g = this._g, t = this.time, dryK = (this.night ? 0.0006 : 0.0011);
    let rainSum = 0;
    for (let i = 0; i < this.n; i++) {
      const r = this.cells.length ? this.rainAt(g.x[i], g.z[i], t) : 0; this.rainB[i] = r; rainSum += r;
      const drain = g.drain[i];
      // (rain: toward the level its strength holds - a drizzle a damp track, a downpour standing water - at a pace by
      //  its strength; the sun and the wind: drying, none of it while it rains, slower where it drains badly)
      const eq = r > 0.02 ? Math.min(1, 0.22 + 0.85 * r) * (0.85 + 0.15 * (2 - drain)) : 0;
      const wet = r > 0.02 ? 0.018 * (0.2 + 0.8 * r) : 0, dry = dryK * drain * Math.max(0, 1 - 6 * r);
      let w = this.water[i], l = this.lineW[i];
      if (w < eq) w += (eq - w) * wet * h; w -= dry * h * (w > 0.85 ? 0.6 : 1);
      if (l < eq) l += (eq - l) * wet * h; l -= dry * h * 1.15;
      this.water[i] = clamp01(w); this.lineW[i] = Math.min(clamp01(l), this.water[i]);
    }
    this.rainNow = rainSum / this.n;
    this._radar(h);
    this.summary(); this.fillTex();
  }
  /** a car through a stretch on the line clears water off it (a car's tyres throw it aside): the dry line */
  _clear(c) {
    if (c.isSC || c.inPit || c.pitLane || c.retired || c.held) { c._wxS = null; return; }
    const s = c.s, ps = c._wxS; c._wxS = s;
    if (ps == null || c.speed < 15 || this.fixed) return;
    const L = this._g.L, bl = this.bl; let ds = s - ps; if (ds < -L / 2) ds += L; if (ds <= 0 || ds > 200) return;
    const k = 0.024 * Math.min(1.4, c.speed / 55);   // (a field of twenty: the line about 40 % drier each lap than the rain and the sun leave it)
    const i0 = Math.floor(ps / bl), i1 = Math.floor(s / bl) + (s < ps ? this.n : 0);
    for (let j = i0 + 1; j <= i1; j++) {
      const i = ((j % this.n) + this.n) % this.n, off = Math.abs(c.d - this._g.off[i]);
      if (off < 2.2) this.lineW[i] *= 1 - k * (1 - off / 2.6);
      else if (off < 5) this.water[i] *= 1 - 0.0025;   // (a line of its own off the dry one: a little, never a second dry line)
    }
  }
  /** the track's wetness under a point (lap distance s, lateral offset d): on the line, off it, or between */
  wetAt(s, d) {
    const n = this.n, L = this._g.L, u = (((s % L) + L) % L) / this.bl - 0.5, i0 = ((Math.floor(u) % n) + n) % n, i1 = (i0 + 1) % n, f = u - Math.floor(u);
    const off = this._g.off[i0] + (this._g.off[i1] - this._g.off[i0]) * f;
    const w = this.water[i0] + (this.water[i1] - this.water[i0]) * f, l = this.lineW[i0] + (this.lineW[i1] - this.lineW[i0]) * f;
    const e = (d - off) / LINE_W, gk = Math.exp(-0.5 * e * e);
    return w + (l - w) * gk;
  }
  /** the two water levels at s: { line, off } */
  levelsAt(s) { const L = this._g.L, i = Math.floor(((((s % L) + L) % L) / this.bl)) % this.n; return { line: this.lineW[i], off: this.water[i] }; }
  /** the wetness a car meets on the line over the lap, and its sectors (what the tyres are chosen on) */
  summary() {
    const n = this.n; let a = 0, b = 0, hi = 0; const sec = [0, 0, 0], k3 = n / 3;
    const sorted = this._sorted || (this._sorted = new Float32Array(n));
    for (let i = 0; i < n; i++) { const l = this.lineW[i]; a += l; b += this.water[i]; sec[Math.min(2, Math.floor(i / k3))] += l; sorted[i] = l; }
    this.avgLine = a / n; this.avgOff = b / n;
    sorted.sort(); hi = sorted[Math.floor(n * 0.8)];
    this.p80 = hi; this.sec = sec.map((x) => x / k3);
    // (the wetness the tyre choice is made on: the lap's average, pulled toward its wet stretches - two damp corners
    //  on slicks are where the race is lost)
    this.tyreWet = 0.6 * this.avgLine + 0.4 * hi;
    if (this.tyreWet > 0.25) this.everWet = true;
    this.peakRain = Math.max(this.peakRain, this.rainNow);
    return this.tyreWet;
  }
  /** the lap's wetness the race model uses (RaceDirector.simulateRest) */
  lapWet() { return this.tyreWet; }
  /** the condition in words */
  label() {
    const w = this.tyreWet, r = this.rainNow;
    if (r > 0.6) return 'HEAVY RAIN'; if (r > 0.25) return 'RAIN'; if (r > 0.05) return 'LIGHT RAIN';
    if (w > 0.6) return 'WET'; if (w > 0.3) return 'DAMP'; if (this.avgOff - this.avgLine > 0.12 && this.avgLine < 0.2) return 'DRY LINE'; if (w > 0.08) return 'DRYING';
    return 'DRY';
  }
  /** the tyre the track wants now: slicks, inters or full wets */
  idealTyre(w = this.tyreWet) { return w > 0.62 ? 'WET' : w > 0.27 ? 'INTER' : 'SLICK'; }
  fillTex() {
    const D = this._texData, g = this._g;
    for (let i = 0; i < this.n; i++) {
      D[i * 4] = Math.round(this.water[i] * 255); D[i * 4 + 1] = Math.round(this.lineW[i] * 255);
      D[i * 4 + 2] = Math.round(clamp01((g.off[i] + 20) / 40) * 255); D[i * 4 + 3] = Math.round(clamp01(this.rainB[i]) * 255);
    }
    this.tex.needsUpdate = true;
  }

  // ---- the engineer ------------------------------------------------------------------------------------------------
  note(kind, b) { this.news.push({ kind, b, t: this.time }); if (this.news.length > 12) this.news.shift(); }
  /** the corner that is wettest on the line now, and the sector */
  wettest() { let k = 0; for (let i = 1; i < this.n; i++) if (this.lineW[i] > this.lineW[k]) k = i; return { at: this._g.corner[k], w: this.lineW[k], sec: Math.min(2, Math.floor(k / (this.n / 3))) }; }
  firstRainAt() { let k = 0; for (let i = 1; i < this.n; i++) if (this.rainB[i] > this.rainB[k]) k = i; return this._g.corner[k]; }
  /**
   * The weather on the radio for player `p` (RaceDirector.update): the forecast at the start, the radar as showers come
   * and go, the first drops and where, the track going and the dry line coming, the tyres the track wants against
   * the ones on the car. Spoken through `E` (race/Engineer.js), each kind of call rate-limited.
   */
  radio(E, p, lapT) {
    if (!E || !p || p.retired || p.finished || this.fixed) return;
    const t = this.time, mins = (s) => { const m = Math.max(1, Math.round(s / 60)); return m === 1 ? 'a minute' : `${m} minutes`; };
    const pc = (x) => `${Math.round(Math.min(0.95, x) * 10) * 10} percent`;
    const heavy = (x) => (x > 0.75 ? 'heavy' : x > 0.45 ? 'moderate' : 'light');
    const tyre = p.tyres.compound, rainT = tyre === 'INTER' || tyre === 'WET';
    if (!this.said0 && t > 4) {
      this.said0 = true;
      const o = this.outlook(this.dur);
      if (this.rainNow > 0.05) E.say(`Weather: it's raining${this.rainLeft() > 0 && this.rainLeft() < this.dur ? `, radar has it easing in about ${mins(this.rainLeft())}` : ', and it is set in for a while'}. Track is ${this.label().toLowerCase()}.`, 1, 3);
      else if (o.p > 0.15) E.say(`Weather: ${pc(o.p)} chance of rain, in about ${mins(o.eta)}. We'll keep you posted.`, 1, 3);
      else if (this.tyreWet > 0.15) E.say(`Track is ${this.label().toLowerCase()}, no more rain forecast. It will dry, the line first.`, 1, 3);
      else E.say('Weather looks settled, dry for the whole race.', 1, 6);
    }
    for (const ev of this.news.splice(0)) {
      const b = ev.b, at = b.phantom ? b.firstAt : b.c.firstAt, from = b.phantom ? b.from : b.c.from, { a } = this._bel(b), eta = a - t;
      if (ev.kind === 'radar' && eta > 30) E.say(`Rain on the radar, ${heavy(b.peak)}, about ${mins(eta)} out, coming from the ${from}.${at ? ` Should hit ${at} first.` : ''} ${pc(b.p)} it reaches us.`, 2);
      else if (ev.kind === 'popup') E.say(`Heads up, a shower has popped up on the radar, ${eta > 20 ? `${mins(eta)} away` : 'right on top of us'}${at ? `, around ${at}` : ''}. Didn't see that one coming.`, 3);
      else if (ev.kind === 'broke') E.say('That shower on the radar has broken up. It will not reach us.', 2);
      else if (ev.kind === 'missed') E.say('The rain has gone past to the side of us. Track stays as it is.', 1);
    }
    // (the first drops, and where)
    if (this.rainNow > 0.04 && !this._raining && t - (this._rainOffT ?? -100) > 60) { this._raining = true; const at = this.firstRainAt(); E.say(`Rain is starting${at ? ` at ${at}` : ''}. ${this.rainNow > 0.3 ? 'It is coming down properly.' : 'Light for now.'}`, 3); }
    else if (this.rainNow < 0.01 && this._raining) { this._raining = false; this._rainOffT = t; if (this.tyreWet > 0.15) E.say('Rain has stopped. The track will come back to us, line first.', 2); }
    // (a sector going wet)
    for (let k = 0; k < 3; k++) {
      const w = this.sec[k], was = this.secWas[k];
      if (w > 0.28 && was <= 0.28 && t > 20) { const W = this.wettest(); E.say(`Sector ${k + 1} is getting wet${W.sec === k && W.at ? `, ${W.at} especially` : ''}. Careful off the line.`, 2); }
      this.secWas[k] = w;
    }
    // (the tyre the track wants against yours: once a call, again a lap later if nothing changed)
    if (t - this.saidAt > Math.max(45, lapT || 90) && !p.pitRequested && !p.pitLane) {
      const want = this.idealTyre(), o = this.outlook(lapT * 1.5 || 120);
      let msg = null;
      if (!rainT && want !== 'SLICK') msg = `Track is ${want === 'WET' ? 'flooded' : 'wet enough for inters'} now. ${want === 'WET' ? 'Full wets' : 'Inters'} are the tyre. Box when you're ready.`;
      else if (!rainT && o.p > 0.65 && o.eta < (lapT || 90) && o.peak > 0.5) msg = `Big rain coming, ${mins(o.eta)}. Your call: box early for inters and gamble, or stay out and see.`;
      else if (rainT && want === 'SLICK' && this.rainNow < 0.03 && o.p < 0.45) msg = `Dry line is there. Slicks are quicker now, the off-line is still wet though. Box when you want them.`;
      else if (tyre === 'INTER' && want === 'WET') msg = 'Standing water now, the inters are aquaplaning. Full wets would be safer.';
      else if (tyre === 'WET' && want === 'INTER') msg = 'Track is coming to the inters. The wets will overheat soon.';
      if (msg) { this.saidAt = t; E.say(msg, 3); }
    }
  }
}
