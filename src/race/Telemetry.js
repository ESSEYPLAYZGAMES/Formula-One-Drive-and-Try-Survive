// Lap telemetry: records the player's car at 30 Hz and every AI car at 10 Hz (a lighter channel set), cut into laps at
// the timing line, and analyses a lap against a reference (the fastest AI lap, else the ideal lap of the speed
// profile): delta time, corner-by-corner braking points / minimum speeds / time, and a JSON export for offline work.

/** player channels, in export order */
export const CHANNELS = ['t', 'd', 'x', 'z', 'lat', 'v', 'thr', 'brk', 'steer', 'gear', 'rpm', 'gLong', 'gLat', 'surf', 'ers', 'ersE', 'slipF', 'slipR', 'tyreT', 'tyreW',
  'kerb', 'pitch', 'roll', 'ride', 'fzFL', 'fzFR', 'fzRL', 'fzRR'];   // chassis: wheels on a kerb (bitmask FL 1 FR 2 RL 4 RR 8), body pitch / roll (deg), heave (mm), wheel loads (kN)
const AI_CHANNELS = ['t', 'd', 'v', 'thr', 'brk', 'lat'];
const G = 9.81;

function newLap(n, start, channels) { const s = {}; for (const c of channels) s[c] = []; return { n, start, time: null, valid: true, flags: [], offTrack: 0, samples: s }; }

export class Telemetry {
  /**
   * @param track, line, profile  the circuit, its racing line and speed profile (m/s per sample)
   * @param cars all cars of the session; player: the player's car (may be null)
   */
  constructor({ track, line, profile, cars, player, mode, settings }) {
    Object.assign(this, { track, line, profile, cars, player, mode, settings });
    this.laps = [];                 // the player's laps (complete and the one in progress)
    this.cur = null; this.curStart = null; this.lastT = -1; this.lastResets = 0;
    this.ai = new Map();            // car -> { cur, best }
    this.lastAiT = -1;
  }

  /** call once per frame with the session time */
  update(time) {
    const p = this.player;
    if (time < Math.max(this.lastT, this.lastAiT) - 1e-6) this._rewind(time);
    if (p && time - this.lastT >= 1 / 30) { this.lastT = time; this._player(p, time); }
    if (time - this.lastAiT >= 0.1) { this.lastAiT = time; for (const c of this.cars) if (c !== p) this._ai(c, time); }
  }

  /**
   * A flashback: the clock went back to `time`, and what was recorded after it never happened. The samples past it are
   * dropped (a lap begun after it is not begun yet; a lap finished after it is open again), so a lap is the one driven -
   * not the abandoned attempt up to the rewind followed by the retry from where the clock caught up again.
   */
  _rewind(time) {
    const cut = (L) => { const s = L.samples, t0 = time - L.start; let k = s.t.length; while (k > 0 && s.t[k - 1] > t0) k--; for (const ch in s) s[ch].length = k; };
    while (this.laps.length) {
      const L = this.laps[this.laps.length - 1];
      if (L.start > time) { this.laps.pop(); continue; }
      cut(L); if (L.time != null && L.start + L.time > time) L.time = null;
      break;
    }
    const last = this.laps[this.laps.length - 1];
    this.cur = last && last.time == null ? last : null; this.curStart = this.cur ? this.cur.start : this.curStart;
    for (const rec of this.ai.values()) {
      if (rec.cur && rec.cur.start > time) { rec.cur = null; rec.start = null; } else if (rec.cur) cut(rec.cur);
      if (rec.best && rec.best.start + rec.best.time > time) rec.best = rec.prevBest && rec.prevBest.start + rec.prevBest.time <= time ? rec.prevBest : null;
    }
    this.lastT = this.lastAiT = time - 1;
  }

  _player(c, time) {
    // a lap closes when the timing posts its time; a new one starts when the timing line restarts the clock
    if (this.cur && c.lapTimes.length > (this.nTimes || 0)) { this.cur.time = c.lapTimes[c.lapTimes.length - 1]; this.cur.sectors = this._sectors(this.cur); this._reference(this.cur); this.cur = null; }
    this.nTimes = c.lapTimes.length;
    if (c.lapStart !== this.curStart) {
      // a lap restarted before it was completed (the clock on the grid before lights out) is no lap: drop it
      if (this.cur && this.cur.time == null) this.laps.splice(this.laps.indexOf(this.cur), 1);
      this.curStart = c.lapStart;
      if (c.lapStart >= 0) { this.cur = newLap(c.lap + 1, c.lapStart, CHANNELS); this.laps.push(this.cur); } else this.cur = null;
    }
    const L = this.cur; if (!L || c.finished) return;
    if ((c.resets || 0) !== this.lastResets) { this.lastResets = c.resets || 0; L.valid = false; if (!L.flags.includes('reset')) L.flags.push('reset'); }
    if (c.pitLane && !L.flags.includes('pit')) { L.flags.push('pit'); L.valid = false; }
    if (c.offTrack) L.offTrack += 1 / 30;
    const s = L.samples;
    s.t.push(time - c.lapStart); s.d.push(c.lapDist); s.x.push(c.x); s.z.push(c.z); s.lat.push(c.d - this.line.offsetAt(c.s));
    s.v.push(c.speed * 3.6); s.thr.push(c.throttle); s.brk.push(c.brake); s.steer.push(c.steer); s.gear.push(c.gear); s.rpm.push(c.rpm);
    s.gLong.push(c.ax / G); s.gLat.push(c.ay / G); s.surf.push(c.surf || 0); s.ers.push(c.ers > 0 ? 1 : 0); s.ersE.push(c.ersEnergy);
    s.slipF.push(c.slipF || 0); s.slipR.push(c.slipR || 0); s.tyreT.push(c.tyres.temp); s.tyreW.push(c.tyres.wear);
    const W = c.wh; let kerb = 0; for (let k = 0; k < 4; k++) if (W.surf[k] === 1) kerb |= 1 << k;
    s.kerb.push(kerb); s.pitch.push(c.pt * 57.3); s.roll.push(c.rl * 57.3); s.ride.push(c.hv * 1000);
    s.fzFL.push(W.fz[0] / 1000); s.fzFR.push(W.fz[1] / 1000); s.fzRL.push(W.fz[2] / 1000); s.fzRR.push(W.fz[3] / 1000);
  }

  /**
   * The live delta's reference: the player's best flying lap (from the timing line, not a standing start or a lap
   * through the pits), as its time at every 5 m of the lap.
   */
  _reference(L) {
    const s = L.samples, n0 = s.d.length;
    if (!L.valid || n0 < 20 || s.d[0] > 50 || s.d[0] < -20 || (this.refLap && L.time >= this.refLap.time)) return;
    const len = this.track.length, n = Math.ceil(len / 5) + 1, tab = new Float32Array(n).fill(NaN);
    let j = 0;
    for (let k = 0; k < n; k++) {
      const x = k * 5; if (x < s.d[0]) continue;
      while (j < n0 - 2 && s.d[j + 1] < x) j++;
      if (s.d[j + 1] < x) break;
      const f = (x - s.d[j]) / Math.max(1e-6, s.d[j + 1] - s.d[j]); tab[k] = s.t[j] + (s.t[j + 1] - s.t[j]) * f;
    }
    this.refLap = L; this.refTab = tab;
  }
  /** live delta to the player's best lap at the same distance (s, + slower), or null (no best yet, the lap's start) */
  liveDelta(c, time) {
    if (c !== this.player || !this.refTab || !this.cur || c.finished || c.pitLane || c.inPit || c.lapDist < 25) return null;
    const x = c.lapDist / 5, k = Math.floor(x), T = this.refTab; if (k + 1 >= T.length) return null;
    const tb = T[k] + (T[k + 1] - T[k]) * (x - k); if (!isFinite(tb)) return null;
    return (time - c.lapStart) - tb;
  }

  _ai(c, time) {
    let rec = this.ai.get(c); if (!rec) { rec = { cur: null, start: null, best: null, nTimes: 0 }; this.ai.set(c, rec); }
    if (rec.cur && c.lapTimes.length > rec.nTimes) {
      rec.cur.time = c.lapTimes[c.lapTimes.length - 1];
      if (rec.cur.valid && rec.cur.samples.d[0] < 50 && (!rec.best || rec.cur.time < rec.best.time)) { rec.prevBest = rec.best; rec.best = rec.cur; }   // (a standing-start lap is no reference)
      rec.cur = null;
    }
    rec.nTimes = c.lapTimes.length;
    if (c.lapStart !== rec.start) {
      rec.start = c.lapStart; rec.cur = c.lapStart >= 0 ? newLap(0, c.lapStart, AI_CHANNELS) : null;
      if (rec.cur) rec.resets = c.resets || 0;
    }
    const L = rec.cur; if (!L || c.retired || c.finished) return;
    if ((c.resets || 0) !== rec.resets || c.pitLane || c.inPit) L.valid = false;
    const s = L.samples; s.t.push(time - c.lapStart); s.d.push(c.lapDist); s.v.push(c.speed * 3.6); s.thr.push(c.throttle); s.brk.push(c.brake); s.lat.push(c.d - this.line.offsetAt(c.s));
  }

  /** split times at thirds of the lap */
  _sectors(L) {
    const len = this.track.length, out = [];
    for (const f of [1 / 3, 2 / 3]) out.push(timeAt(L, len * f));
    out.push(L.time);
    return [out[0], out[1] - out[0], out[2] - out[1]];
  }

  completeLaps() { return this.laps.filter((l) => l.time != null); }
  bestLap() { let b = null; for (const l of this.completeLaps()) if (l.valid && (!b || l.time < b.time)) b = l; return b || this.completeLaps().sort((a, b2) => a.time - b2.time)[0] || null; }

  /** the reference lap: the fastest clean AI lap of the session, else the ideal lap of the speed profile */
  reference() {
    let best = null, who = null;
    for (const [car, rec] of this.ai) if (rec.best && (!best || rec.best.time < best.time)) { best = rec.best; who = car; }
    if (best) return { kind: 'ai', label: `${who.short} (fastest AI lap)`, lap: best };
    return { kind: 'ideal', label: 'ideal lap (speed profile)', lap: this.idealLap() };
  }

  /** the speed profile driven with the real power / drag balance (same model as RaceDirector.estimateLap) */
  idealLap() {
    if (this._ideal) return this._ideal;
    const tr = this.track, p = this.profile, n = tr.n, ds = tr.ds, L = newLap(0, 0, AI_CHANNELS);
    const P = 865000, M = 798, drag = 0.5 * 1.18 * 1.35;
    let v = p[0], t = 0;
    for (let c = 0; c < 2 * n; c++) {
      const a = Math.min(P / (M * Math.max(8, v)), 14) - (drag * v * v + 300) / M, j = (c + 1) % n;
      const vn = Math.min(p[j], Math.sqrt(Math.max(64, v * v + 2 * a * ds)));
      if (c >= n) {
        const i = c - n;
        if (i % 2 === 0) { const s = L.samples; s.t.push(t); s.d.push(i * ds); s.v.push(v * 3.6); s.thr.push(vn > v + 0.01 ? 1 : 0); s.brk.push(vn < v - 0.05 ? 1 : 0); s.lat.push(0); }
        t += ds / ((v + vn) / 2);
      }
      v = vn;
    }
    L.time = t; this._ideal = L; return L;
  }

  /** delta time of lap A against lap B every `step` metres: [{d, dt}] (dt > 0: A is behind) */
  delta(A, B, step = 10) {
    const out = [], len = this.track.length;
    for (let d = 0; d <= len; d += step) out.push({ d, dt: timeAt(A, d) - timeAt(B, d) });
    return out;
  }

  /**
   * Corner by corner, lap A against lap B: brake point (metres before the apex where the brake first passes 30 %),
   * minimum speed, time gained / lost from 150 m before the apex to 80 m after it.
   */
  corners(A, B) {
    const len = this.track.length, rows = [];
    for (const c of this.track.def.corners || []) {
      if (c.s == null) continue;
      const apex = c.s, a = apex - 150, b = apex + 80;
      if (a < 0 || b > len) continue;   // (a corner across the line: skipped, its window would wrap)
      const one = (L) => {
        if (!L) return null;
        let vMin = Infinity, dMin = apex, brakeD = null; const s = L.samples;
        for (let i = 0; i < s.d.length; i++) {
          const d = s.d[i]; if (d < a || d > b) continue;
          if (s.v[i] < vMin) { vMin = s.v[i]; dMin = d; }
          if (brakeD == null && d < apex + 10 && s.brk[i] > 0.3) brakeD = d;
        }
        return { vMin, dMin, brake: brakeD == null ? null : apex - brakeD, time: timeAt(L, b) - timeAt(L, a) };
      };
      const ya = one(A), yb = one(B);
      rows.push({ n: c.n, name: c.name || `Turn ${c.n}`, apex, you: ya, ref: yb, dt: ya && yb ? ya.time - yb.time : null });
    }
    return rows;
  }

  /** everything, for an offline look (rounded: a lap is a few hundred kB) */
  exportJSON(meta = {}) {
    const r = (x, k) => Math.round(x * k) / k, pack = (L, ch) => {
      const o = {}; for (const c of ch) { const k = c === 'x' || c === 'z' || c === 'd' || c === 'pitch' || c === 'roll' || c.startsWith('fz') ? 100 : c === 'v' || c === 'rpm' || c === 'ride' ? 10 : 1000; o[c] = L.samples[c].map((x) => r(x, k)); } return o;
    };
    const ref = this.reference(), tr = this.track;
    const prof = []; for (let i = 0; i < tr.n; i += 5) prof.push(r(this.profile[i] * 3.6, 10));
    return JSON.stringify({
      format: 'f1sim-telemetry/2', created: new Date().toISOString(), ...meta,
      track: { id: tr.def.id, name: tr.def.name, length: r(tr.length, 10), corners: (tr.def.corners || []).map((c) => ({ n: c.n, name: c.name || null, s: c.s == null ? null : r(c.s, 10) })) },
      settings: this.settings, channels: CHANNELS,
      laps: this.completeLaps().map((l) => ({ n: l.n, time: r(l.time, 1000), valid: l.valid, flags: l.flags, offTrack: r(l.offTrack, 100), sectors: l.sectors.map((x) => r(x, 1000)), samples: pack(l, CHANNELS) })),
      reference: { kind: ref.kind, label: ref.label, time: ref.lap ? r(ref.lap.time, 1000) : null, channels: AI_CHANNELS, samples: ref.lap ? pack(ref.lap, AI_CHANNELS) : null },
      profile: { every: r(tr.ds * 5, 100), kmh: prof },
    });
  }
}

/** lap time at lap distance d (linear between samples; the lap's distances only grow) */
export function timeAt(L, d) {
  const D = L.samples.d, T = L.samples.t, n = D.length;
  if (!n) return 0;
  if (d <= D[0]) return T[0]; if (d >= D[n - 1]) return T[n - 1];
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (D[m] <= d) lo = m; else hi = m; }
  const f = (d - D[lo]) / ((D[hi] - D[lo]) || 1); return T[lo] + (T[hi] - T[lo]) * f;
}
/** any channel at lap distance d */
export function valueAt(L, ch, d) {
  const D = L.samples.d, V = L.samples[ch], n = D.length;
  if (!n || !V) return null;
  if (d <= D[0]) return V[0]; if (d >= D[n - 1]) return V[n - 1];
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (D[m] <= d) lo = m; else hi = m; }
  const f = (d - D[lo]) / ((D[hi] - D[lo]) || 1); return V[lo] + (V[hi] - V[lo]) * f;
}
