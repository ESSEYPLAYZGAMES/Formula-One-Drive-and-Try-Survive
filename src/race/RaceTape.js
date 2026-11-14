// The whole race on tape, for the theatre after the flag (main.js): every car's pose as its mesh is drawn, how far its
// wheels have turned and how they are steered, its speed, whether it is braking, its DRS, its tyres, whether it is in
// the pits or out of the race - ten to fifteen times a second from the lights to the end - with the running order
// each second, the safety car, and the race's moments as they happened (the start, every pass for position, contacts
// and crashes, stops, retirements, fastest laps, the safety car, the flag) for the timeline and the highlights list.
// It only reads the race: nothing in it draws a random number or touches a car, so a race with the tape running is
// the race without it. A flashback winds it back with the race (what was rewound never happened).
import { carPose } from './Replay.js';

const CH = 256, TWO = Math.PI * 2, WRAP = TWO * 64, R_TYRE = 0.33;
export const COMPOUNDS = ['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'];
/** flags of a car in a frame */
export const F = { BRAKE: 1, DRS: 2, PIT: 4, OUT: 8, AIR: 16, HIDE: 32 };

export class RaceTape {
  /** cars: the field (its order is the tape's); o: { hz, laps, lapTime (s, a guess: a long race is taped slower) } */
  constructor(cars, o = {}) {
    this.cars = cars; this.n = cars.length + 1;   // (the last slot: the safety car)
    const dur = (o.laps || 5) * (o.lapTime || 95);
    this.hz = o.hz || (dur > 4800 ? 7.5 : dur > 2400 ? 10 : 15);
    this.chunks = []; this.N = 0; this.acc = 0; this.t0 = null; this.events = []; this.order = []; this.tyres = [];
    this.spin = new Float64Array(this.n); this.lastT = null; this._st = cars.map(() => ({ pos: 0, pit: false, out: false, best: Infinity, hit: -9 })); this._ordT = -9; this._sc = false; this._racing = false; this._flag = false; this._pend = []; this.tStart = null;
    this.meta = { track: o.track || '', laps: o.laps || 0, names: cars.map((c) => c.name), shorts: cars.map((c) => c.short || c.name.slice(0, 3).toUpperCase()), colors: cars.map((c) => c.color), teams: cars.map((c) => c.team) };
  }
  get duration() { return this.N ? this.time(this.N - 1) - this.time(0) : 0; }
  time(k) { return this.chunks[k >> 8].t[k & 255]; }
  _chunk() { const n = this.n; return { t: new Float64Array(CH), p: new Float32Array(CH * n * 3), q: new Int16Array(CH * n * 4), w: new Float32Array(CH * n * 2), s: new Int8Array(CH * n), f: new Uint8Array(CH * n), c: new Uint8Array(CH * n) }; }
  /** a step of the race (d: the director): the wheels turned on, a frame when one is due, the moments noticed */
  record(dt, d) {
    const time = d.time, cars = this.cars, n = this.n;
    if (this.lastT != null && time < this.lastT - 1e-6) this._rewind(time);
    this.lastT = time;
    for (let i = 0; i < cars.length; i++) this.spin[i] += (cars[i].vLong || 0) / R_TYRE * dt;
    this._events(d);
    this.acc += dt; if (this.acc < 1 / this.hz) return; this.acc %= 1 / this.hz;
    const k = this.N, ci = k >> 8, o = k & 255; if (!this.chunks[ci]) this.chunks[ci] = this._chunk();
    const C = this.chunks[ci], tmp = this._tmp || (this._tmp = new Float32Array(7)); C.t[o] = time; if (this.t0 == null) this.t0 = time;
    for (let i = 0; i < n; i++) {
      const sc = i === n - 1, c = sc ? (d.sc ? d.sc.car || d.sc.body : null) : cars[i], b = o * n + i;
      if (!c) { C.f[b] = F.HIDE; continue; }
      carPose(c, tmp, 0);
      C.p[b * 3] = tmp[0]; C.p[b * 3 + 1] = tmp[1]; C.p[b * 3 + 2] = tmp[2];
      C.q[b * 4] = tmp[3] * 32767; C.q[b * 4 + 1] = tmp[4] * 32767; C.q[b * 4 + 2] = tmp[5] * 32767; C.q[b * 4 + 3] = tmp[6] * 32767;
      if (sc) this.spin[i] += (c.vLong || c.speed || 0) / R_TYRE / this.hz;
      C.w[b * 2] = ((this.spin[i] % WRAP) + WRAP) % WRAP; C.w[b * 2 + 1] = c.vLong ?? c.speed ?? 0;
      C.s[b] = Math.max(-127, Math.min(127, Math.round((c.steer || 0) * 100)));
      C.f[b] = (c.brake > 0.3 ? F.BRAKE : 0) | (c.drs ? F.DRS : 0) | (c.pitLane || c.inPit ? F.PIT : 0) | (c.retired ? F.OUT : 0) | (c.air || c.wreck ? F.AIR : 0) | (sc && !d.sc?.car ? F.HIDE : 0) | (c.hiddenAway ? F.HIDE : 0);
      C.c[b] = sc ? 0 : Math.max(0, COMPOUNDS.indexOf(c.tyres?.compound));
    }
    this.N = k + 1;
    // the running order, a second apart (the tower in the theatre)
    if (time - this._ordT >= 1) { this._ordT = time; this.order.push({ t: time, lap: d.leaderLap ?? Math.max(0, ...cars.map((c) => c.lap || 0)), o: Uint8Array.from(d.positions || cars, (c) => cars.indexOf(c)) }); }
  }
  /** what happened since the last step: the moments of the race, as they are */
  _events(d) {
    const cars = this.cars, P = d.positions || cars, t = d.time, E = this.events, sur = (c) => String(c.name || '').split(' ').pop();
    if (!this._racing && d.world?.racing) { this._racing = true; this.tStart = t; E.push({ t, kind: 'start', text: 'Lights out', cars: [Math.max(0, cars.indexOf(P[0]))], w: 3 }); }
    if (!this._racing) return;
    const scOn = !!d.sc?.active; if (scOn !== this._sc) { this._sc = scOn; const ph = String(d.sc?.phase || ''); E.push({ t, kind: scOn ? 'sc' : 'green', text: scOn ? (ph === 'red' ? 'Red flag' : ph.startsWith('vsc') ? 'Virtual safety car' : 'Safety car') : 'Green flag', cars: [cars.indexOf(P[0])], w: 2 }); }
    if (!this._flag && d.leaderFinished) { this._flag = true; E.push({ t, kind: 'flag', text: `${sur(P[0])} wins`, cars: [cars.indexOf(P[0])], w: 3 }); }
    // (the passes noted three seconds ago: the ones that have stood - and not the same two again within twenty seconds)
    for (const q of [...this._pend]) {
      if (t - q.t < 4) continue; this._pend.splice(this._pend.indexOf(q), 1);
      const a = cars[q.i], b = cars[q.j]; if (P.indexOf(a) > P.indexOf(b) || a.retired || b.retired || a.pitLane || a.inPit || b.pitLane || b.inPit) continue;
      if (E.some((e) => e.kind === 'pass' && q.t - e.t < 20 && e.cars.includes(q.i) && e.cars.includes(q.j))) continue;
      const pos = P.indexOf(a) + 1; E.push({ t: q.t, kind: 'pass', text: `${sur(a)} passes ${sur(b)} for P${pos}`, cars: [q.i, q.j], pos, w: pos <= 3 ? 3 : pos <= 10 ? 2 : 1 }); E.sort((x, y) => x.t - y.t);
    }
    for (let k = 0; k < P.length; k++) {
      const c = P[k], i = cars.indexOf(c), S = this._st[i]; if (!S) continue; const pos = k + 1, pit = !!(c.pitLane || c.inPit);
      // a pass for position: one place up on a car that was right ahead a moment ago, neither in the pits nor out -
      // noted, and a moment of the race only if it still stands three seconds on (two cars side by side swap places
      // with every metre; the run to the first corner is the start, not twenty passes)
      if (S.pos && pos === S.pos - 1 && !pit && !c.retired && !c.finished && t - (this.tStart ?? t) > 25) {
        const o = P[k + 1], j = o ? cars.indexOf(o) : -1, So = j >= 0 ? this._st[j] : null;
        if (o && So && So.pos === pos && !(o.pitLane || o.inPit) && !o.retired && !So.pit && !o.offTrack && Math.abs(o.speed || 0) > 0.6 * Math.abs(c.speed || 0) && Math.hypot(o.x - c.x, o.z - c.z) < 60 && !this._pend.some((q) => (q.i === i && q.j === j) || (q.i === j && q.j === i))) this._pend.push({ t, i, j, pos });
      }
      if (pit && !S.pit) E.push({ t, kind: 'pit', text: `${sur(c)} pits from P${pos}`, cars: [i], w: 1 });
      if (c.retired && !S.out) E.push({ t, kind: 'out', text: `${sur(c)} is out${c.retireReason ? `: ${String(c.retireReason).toLowerCase()}` : ''}`, cars: [i], w: 2 });
      const g = c.pulseG || 0;
      if (g > 7 && t - S.hit > 8) { S.hit = t; E.push({ t, kind: g > 18 ? 'crash' : 'hit', text: g > 18 ? `${sur(c)} crashes (${Math.round(g)} g)` : `${sur(c)}: contact`, cars: [i], w: g > 18 ? 3 : 1 }); }
      if (isFinite(c.bestLap) && c.bestLap < S.best - 1e-4) { const was = S.best; S.best = c.bestLap; if (isFinite(was) && c.bestLap <= Math.min(...this._st.map((x) => x.best)) + 1e-6) E.push({ t, kind: 'fastest', text: `${sur(c)}: fastest lap`, cars: [i], w: 1 }); }
      S.pos = pos; S.pit = pit; S.out = !!c.retired;
    }
  }
  /** the race went back to `time` (a flashback): the tape with it */
  _rewind(time) {
    let k = this.N; while (k > 0 && this.time(k - 1) > time + 1e-6) k--; this.N = k;
    this.events = this.events.filter((e) => e.t <= time); this.order = this.order.filter((o) => o.t <= time); this._ordT = this.order.length ? this.order[this.order.length - 1].t : -9;
    for (const S of this._st) { S.pos = 0; S.hit = Math.min(S.hit, time); } this._pend = [];
  }
  /** the frame at or before race time T -> its index (clamped) */
  seek(T) { let a = 0, b = this.N - 1; if (b < 0) return 0; while (a < b) { const m = (a + b + 1) >> 1; if (this.time(m) <= T) a = m; else b = m - 1; } return a; }
  /**
   * Slot i at race time T (between frame k = seek(T) and the next) -> out { x, y, z, qx, qy, qz, qw, spin, v, steer,
   * flags, tyre }: the pose interpolated, the wheels' turn carried on by the speed
   */
  sample(i, T, k, out) {
    const n = this.n, k1 = Math.min(this.N - 1, k + 1), A = this.chunks[k >> 8], B = this.chunks[k1 >> 8], a = (k & 255) * n + i, b = (k1 & 255) * n + i;
    const ta = A.t[k & 255], tb = B.t[k1 & 255], u = tb > ta ? Math.max(0, Math.min(1, (T - ta) / (tb - ta))) : 0;
    out.x = A.p[a * 3] + (B.p[b * 3] - A.p[a * 3]) * u; out.y = A.p[a * 3 + 1] + (B.p[b * 3 + 1] - A.p[a * 3 + 1]) * u; out.z = A.p[a * 3 + 2] + (B.p[b * 3 + 2] - A.p[a * 3 + 2]) * u;
    // (the attitude: the shorter way round between the two, normalised)
    let ax = A.q[a * 4], ay = A.q[a * 4 + 1], az = A.q[a * 4 + 2], aw = A.q[a * 4 + 3], bx = B.q[b * 4], by = B.q[b * 4 + 1], bz = B.q[b * 4 + 2], bw = B.q[b * 4 + 3];
    if (ax * bx + ay * by + az * bz + aw * bw < 0) { bx = -bx; by = -by; bz = -bz; bw = -bw; }
    const qx = ax + (bx - ax) * u, qy = ay + (by - ay) * u, qz = az + (bz - az) * u, qw = aw + (bw - aw) * u, L = Math.hypot(qx, qy, qz, qw) || 1;
    out.qx = qx / L; out.qy = qy / L; out.qz = qz / L; out.qw = qw / L;
    let ds = B.w[b * 2] - A.w[a * 2]; if (ds > WRAP / 2) ds -= WRAP; else if (ds < -WRAP / 2) ds += WRAP;
    out.spin = A.w[a * 2] + ds * u; out.v = A.w[a * 2 + 1] + (B.w[b * 2 + 1] - A.w[a * 2 + 1]) * u; out.steer = (A.s[a] + (B.s[b] - A.s[a]) * u) / 100;
    out.flags = A.f[a]; out.tyre = COMPOUNDS[A.c[a]] || 'SOFT';
    return out;
  }
  /** the running order at race time T -> { lap, o: [car indices, first to last] } */
  orderAt(T) { const O = this.order; if (!O.length) return null; let a = 0, b = O.length - 1; while (a < b) { const m = (a + b + 1) >> 1; if (O[m].t <= T) a = m; else b = m - 1; } return O[a]; }
  /** megabytes held */
  get size() { const n = this.n; return this.chunks.length * CH * (8 + n * (12 + 8 + 8 + 1 + 1 + 1)) / 1048576; }
}
