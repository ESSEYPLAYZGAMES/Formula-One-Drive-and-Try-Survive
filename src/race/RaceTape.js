// The whole race on tape, for the theatre after the flag (main.js): every car's pose as its mesh is drawn, how far its
// wheels have turned and how they are steered, its speed, whether it is braking, its DRS, its tyres, whether it is in
// the pits or out of the race - ten to fifteen times a second from the lights to the end - with the running order
// each second, the safety car, and the race's moments as they happened (the start, every pass for position, contacts
// and crashes, stops, retirements, fastest laps, the safety car, the flag) for the timeline and the highlights list.
// And what was round the cars: what was burning or smoking on which car each second (the sources of world/Fire.js),
// every burst of debris, the water on the road every few seconds with the sky's showers (race/Weather.js), how wet
// the road was under each car (its spray), and every pit stop (when, how long, which tyres, a wing or not) for the
// crews. save() writes all of it to a file, RaceTape.load() reads one back: a tape with stand-in cars.
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
    this.fx = []; this.srcs = []; this.stops = []; this.wx = null; this.sources = o.sources || null; this._wxT = -9;   // (sources: set by the game - () => the fire's emitters)
    this.spin = new Float64Array(this.n); this.lastT = null; this._st = cars.map((c) => ({ pos: 0, pit: false, out: false, best: Infinity, hit: -9, stopAt: c._stopAt ?? null })); this._ordT = -9; this._sc = false; this._racing = false; this._flag = false; this._pend = []; this.tStart = null;
    this.meta = { track: o.track || '', time: o.time || '', laps: o.laps || 0, names: cars.map((c) => c.name), shorts: cars.map((c) => c.short || c.name.slice(0, 3).toUpperCase()), colors: cars.map((c) => c.color), teams: cars.map((c) => c.team) };
  }
  get duration() { return this.N ? this.time(this.N - 1) - this.time(0) : 0; }
  time(k) { return this.chunks[k >> 8].t[k & 255]; }
  _chunk() { const n = this.n; return { t: new Float64Array(CH), p: new Float32Array(CH * n * 3), q: new Int16Array(CH * n * 4), w: new Float32Array(CH * n * 2), s: new Int8Array(CH * n), f: new Uint8Array(CH * n), c: new Uint8Array(CH * n), x: new Uint8Array(CH * n) }; }
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
      C.x[b] = sc ? 0 : Math.round(255 * Math.max(0, Math.min(1, c.wetness || 0)));
    }
    this.N = k + 1;
    // the running order, a second apart (the tower in the theatre)
    if (time - this._ordT >= 1) this._sources(time);
    if (d.weather && time - this._wxT >= 4) { this._wxT = time; this._water(time, d.weather); }
    if (time - this._ordT >= 1) { this._ordT = time; this.order.push({ t: time, lap: d.leaderLap ?? Math.max(0, ...cars.map((c) => c.lap || 0)), o: Uint8Array.from(d.positions || cars, (c) => cars.indexOf(c)) }); }
  }
  /** what is burning or smoking on which car now (world/Fire.js: the sources CarMesh puts on a car) - written when it is not what it was */
  _sources(time) {
    const L = [], cars = this.cars;
    for (const e of this.sources?.() || []) { if (e.dead || !e.car) continue; const i = cars.indexOf(e.car); if (i >= 0) L.push([i, Math.max(0, SRC.indexOf(e.kind)), Math.round(Math.max(0, e.k) * 100), e.bx || 0, e.by || 0, e.out ? 1 : 0]); }
    const last = this.srcs[this.srcs.length - 1], key = JSON.stringify(L); if (!last ? !L.length : last.key === key) return;
    this.srcs.push({ t: time, e: L, key });
  }
  /** the water on the road now (the weather's texture: per stretch, off the line and on it, and the rain) - kept when it has changed */
  _water(time, wx) {
    if (!this.wx) this.wx = { fixed: !!wx.fixed, night: !!wx.night, n: wx.n, cells: wx.cells || [], snaps: [] };
    const D = wx._texData, S = this.wx.snaps, last = S[S.length - 1]; if (!D) return;
    if (last) { let same = true; for (let i = 0; i < D.length; i++) if (D[i] !== last.d[i]) { same = false; break; } if (same) return; }
    S.push({ t: time, wt: wx.time, avg: wx.avgOff || 0, d: D.slice() });
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
      // (what flew off it: the car's own events, as its model reads them - each once)
      if (c.events && c.events.length) for (const e of c.events) {
        if (e._tp) continue; e._tp = 1; const kd = String(e.kind || '');
        if (kd === 'fire' || kd === 'smoke' || kd.startsWith('wheel') || kd === 'split') continue;
        if (kd === 'mangle') { const v = c.air ? [c.wvx, c.wvz] : c.worldVel(); this.fx.push({ t, i, k: 'burst', x: c.x, z: c.z, vx: v[0] || 0, vz: v[1] || 0, n: 24 }); }
        else if (kd.startsWith('puncture')) this.fx.push({ t, i, k: 'strip', x: e.x, z: e.z, vx: e.vx || 0, vz: e.vz || 0, n: 3 });
        else if (e.x != null) this.fx.push({ t, i, k: 'burst', x: e.x, z: e.z, vx: e.vx || 0, vz: e.vz || 0, n: Math.min(16, 2 + Math.round((e.sev || 0) * 16)) });
      }
      // (a stop: the moment it stood still in its box, how long, what was done - the crews' script)
      if (c._stopAt != null && c._stopAt !== S.stopAt) { S.stopAt = c._stopAt; this.stops.push({ i, t: c._stopAt, dur: c._stopDur || 2.2, serve: c._stopServe || 0, rep: c._stopPlan?.repair || 'none', comp: c._stopPlan?.compound || c.tyres?.compound || 'SOFT', old: c.tyres?.compound || 'SOFT', x: c.x, z: c.z, th: c.th }); }
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
    this.fx = this.fx.filter((e) => e.t <= time); this.srcs = this.srcs.filter((e) => e.t <= time); this.stops = this.stops.filter((e) => e.t <= time);
    if (this.wx) { this.wx.snaps = this.wx.snaps.filter((e) => e.t <= time); this._wxT = this.wx.snaps.length ? this.wx.snaps[this.wx.snaps.length - 1].t : -9; }
    this._st.forEach((S, i) => { S.pos = 0; S.hit = Math.min(S.hit, time); const st = this.stops.filter((q) => q.i === i).pop(); S.stopAt = st ? st.t : this.cars[i]._stopAt ?? null; }); this._pend = [];
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
    out.flags = A.f[a]; out.tyre = COMPOUNDS[A.c[a]] || 'SOFT'; out.wet = A.x ? A.x[a] / 255 : 0;
    return out;
  }
  /** the running order at race time T -> { lap, o: [car indices, first to last] } */
  orderAt(T) { const O = this.order; if (!O.length) return null; let a = 0, b = O.length - 1; while (a < b) { const m = (a + b + 1) >> 1; if (O[m].t <= T) a = m; else b = m - 1; } return O[a]; }
  /** what was burning or smoking at race time T -> [[car, kind (SRC), strength x100, x, y on the body, being put out], ...] */
  srcAt(T) { const L = this.srcs; let a = -1; for (let i = L.length - 1; i >= 0; i--) if (L[i].t <= T) { a = i; break; } return a < 0 ? EMPTY : L[a].e; }
  /** the road's water at race time T -> { t, wt (the weather's own clock then), avg, d: the texture's bytes } or null */
  waterAt(T) { const L = this.wx?.snaps; if (!L || !L.length) return null; let a = 0; for (let i = L.length - 1; i > 0; i--) if (L[i].t <= T) { a = i; break; } return L[a]; }
  /** car i's stop it is coming to (within `lead` s), in, or just out of at race time T -> the stop or null */
  stopAt(i, T, lead = 24) { for (const s of this.stops) if (s.i === i && T >= s.t - lead && T < s.t + s.dur) return s; return null; }
  /** megabytes held */
  get size() { const n = this.n; return this.chunks.length * CH * (8 + n * (12 + 8 + 8 + 1 + 1 + 1 + 1)) / 1048576; }

  // ---- to a file and back ------------------------------------------------------------------------------------------
  /** the whole tape as one file (gzip where the browser can): a header (JSON) and the frames' arrays end to end */
  async save() {
    const N = this.N, n = this.n, nc = this.cars.length, W = this.wx;
    const json = (v, d) => { try { return JSON.parse(JSON.stringify(v ?? d)); } catch (e) { return d; } };
    const head = { v: 1, hz: this.hz, n, N, t0: this.t0, tStart: this.tStart, meta: this.meta, events: this.events, fx: this.fx, stops: this.stops, srcs: this.srcs.map((s) => ({ t: s.t, e: s.e })),
      order: this.order.map((o) => [o.t, o.lap]), wx: W ? { fixed: W.fixed, night: W.night, n: W.n, cells: json(W.cells, []), snaps: W.snaps.map((s) => [s.t, s.wt, s.avg]) } : null,
      cars: this.cars.map((c) => ({ name: c.name, short: c.short, team: c.team, color: c.color, color2: c.color2, number: c.number, id: c.id, boxIdx: c.boxIdx ?? null, livery: json(c.livery, null), helmet: json(c.helmet, null), isPlayer: !!c.isPlayer,
        compound: c.tyres?.compound || 'SOFT', dents: json(c.dents, []), lost: json(c.lost, {}), pieces: json(c.pieces, []), split: !!c.split, splitT: c.splitT ?? null, dentVer: c.dentVer || 0 })) };
    const hb = new TextEncoder().encode(JSON.stringify(head)), parts = [new TextEncoder().encode(MAGIC), new Uint32Array([hb.length]), hb];
    for (const [key, per] of SECTIONS) for (let ci = 0; ci * CH < N; ci++) { const cnt = Math.min(CH, N - ci * CH) * (key === 't' ? 1 : n) * per, a = this.chunks[ci][key]; parts.push(a ? a.slice(0, cnt) : new Uint8Array(cnt)); }
    for (const o of this.order) { const a = new Uint8Array(nc); a.set(Array.from(o.o).slice(0, nc)); parts.push(a); }
    if (W) for (const s of W.snaps) parts.push(s.d);
    const raw = new Blob(parts);
    if (typeof CompressionStream === 'undefined') return raw;
    try { return await new Response(raw.stream().pipeThrough(new CompressionStream('gzip'))).blob(); } catch (e) { return raw; }
  }
  /** a tape read back from a file (a Blob / File): stand-in cars carrying what a model needs (colours, number, the damage record) */
  static async load(blob) {
    let buf = await blob.arrayBuffer(); const u8 = new Uint8Array(buf);
    if (u8[0] === 0x1f && u8[1] === 0x8b) buf = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    const B = new Uint8Array(buf), dec = new TextDecoder(); if (dec.decode(B.subarray(0, MAGIC.length)) !== MAGIC) throw new Error('not a replay file');
    const hl = new DataView(buf).getUint32(MAGIC.length, true); let off = MAGIC.length + 4;
    const H = JSON.parse(dec.decode(B.subarray(off, off + hl))); off += hl;
    const cars = H.cars.map((c) => ({ ...c, tyres: { compound: c.compound }, events: [], dmg: {}, x: 0, z: 0, p: [0, 0, 0], v: [0, 0, 0], w: [0, 0, 0], _now: 0, air: false, wreck: false, speed: 0, worldVel: () => [0, 0] }));
    const tp = new RaceTape(cars, { hz: H.hz }); tp.meta = H.meta; tp.N = H.N; tp.t0 = H.t0; tp.tStart = H.tStart; tp.events = H.events || []; tp.fx = H.fx || []; tp.stops = H.stops || []; tp.srcs = H.srcs || []; tp.loaded = true;
    const n = tp.n, N = H.N, nc = cars.length, TYPES = { t: Float64Array, p: Float32Array, q: Int16Array, w: Float32Array, s: Int8Array, f: Uint8Array, c: Uint8Array, x: Uint8Array };
    for (let ci = 0; ci * CH < N; ci++) tp.chunks[ci] = tp._chunk();
    for (const [key, per] of SECTIONS) for (let ci = 0; ci * CH < N; ci++) { const T = TYPES[key], cnt = Math.min(CH, N - ci * CH) * (key === 't' ? 1 : n) * per, bytes = cnt * T.BYTES_PER_ELEMENT; tp.chunks[ci][key].set(new T(buf.slice(off, off + bytes))); off += bytes; }
    tp.order = (H.order || []).map(([t, lap]) => { const o = B.slice(off, off + nc); off += nc; return { t, lap, o }; });
    if (H.wx) { const W = H.wx, len = W.n * 4; tp.wx = { fixed: W.fixed, night: W.night, n: W.n, cells: W.cells || [], snaps: W.snaps.map(([t, wt, avg]) => { const d = B.slice(off, off + len); off += len; return { t, wt, avg, d }; }) }; }
    return tp;
  }
}
const EMPTY = [], MAGIC = 'F1TAPE01';
/** the frames' arrays in the file's order: [chunk key, values per slot (per frame for t)] */
const SECTIONS = [['t', 1], ['p', 3], ['q', 4], ['w', 2], ['s', 1], ['f', 1], ['c', 1], ['x', 1]];
/** the kinds of source on a car (world/Fire.js) */
export const SRC = ['fire', 'smoke', 'puff'];
