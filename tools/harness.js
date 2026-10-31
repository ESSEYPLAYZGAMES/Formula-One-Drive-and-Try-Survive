// Headless test helpers for the browser console (dev only, not part of the game or the bundle):
//   await import('/tools/harness.js');  __soloRun(240, 20);  __gridRun(150, 5);
//   __race.start(5); __race.run(120); __race.run(120); __race.report()   (chunked: each call stays under the tool limit)
// They fast-forward the simulation with __F1.stepSim and report laps, spins, offs, contacts and overtakes.
const F = window.__F1;

function watch(d, cars, secs, step = 0.25) {
  const st = new Map(cars.map((c) => [c, { spinning: false }]));
  const ev = [], imp = [], errs = [];
  let off = 0;
  d.world.onAIError = (car, type, zone) => { if (st.has(car)) errs.push(`${car.short}:${type}@T${zone.turn}`); };
  const oi = d.world.onImpact;
  d.world.onImpact = (car, sev, kind) => { if (st.has(car)) imp.push(`${car.short}@${Math.round(car.s)}/${sev.toFixed(2)}/${kind}`); if (oi) oi(car, sev, kind); };
  for (let k = 0; k < secs / step && !d.done; k++) {
    F.stepSim(step);
    for (const c of cars) {
      const s = st.get(c), sp = c.spinning || (Math.abs(c.r) > 1.4 && c.speed > 6);
      if (sp && !s.spinning) ev.push(`SPIN ${c.short}@${Math.round(c.s)} L${c.lap}`);
      s.spinning = sp;
      if (c.offTrack && !c.retired) { off++; const key = `OFF ${c.short}@${Math.round(c.s / 100) * 100} L${c.lap}`; if (ev[ev.length - 1] !== key && !ev.includes(key)) ev.push(key); }
    }
  }
  return { ev, imp, errs, off };
}

/** One AI car alone on track (everyone else parked out of the way) for `secs` seconds of a `len`-lap race. */
window.__soloRun = function (secs, len = 20) {
  F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = len; F.restart();
  const d = F.S.director, solo = d.cars.filter((c) => !c.isPlayer)[0];
  for (const c of d.cars) if (c !== solo) { if (c.isPlayer) { c.ghost = 1e9; c.placeOnTrack(c.s, 40, 0); } else { c.retired = true; c.placeOnTrack(c.s, 30, 0); } }
  window.__solo = solo;
  const w = watch(d, [solo], secs);
  return { track: F.W.track.def.id, drv: `${solo.short} r${solo.rating}`, laps: solo.lapTimes.map((x) => +x.toFixed(2)).join(' '), est: +d.estimateLap().toFixed(1),
    off: w.off, ev: w.ev.join(' | '), imp: w.imp.join(' '), errs: w.errs.join(' '), dmg: Object.values(solo.dmg).map((x) => x.toFixed(2)).join(','), pits: solo.pitStops };
};

/** Full grid race start (player parked at the back as a ghost) for `secs` seconds. */
window.__gridRun = function (secs, len = 5) {
  F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = len; F.restart();
  const d = F.S.director, ai = d.cars.filter((c) => !c.isPlayer);
  for (const c of d.cars) if (c.isPlayer) { c.ghost = 1e9; c.placeOnTrack(c.s, 40, 0); }
  const w = watch(d, ai, secs);
  const best = ai.map((c) => c.bestLap).filter(isFinite).sort((a, b) => a - b);
  return { track: F.W.track.def.id, t: Math.round(d.time), laps: ai.map((c) => c.lap).join(','), retired: ai.filter((c) => c.retired).map((c) => `${c.short}:${c.retireReason}`).join(' '),
    best: best.slice(0, 3).map((x) => x.toFixed(2)).join(' '), median: best.length ? best[best.length >> 1].toFixed(2) : '-', est: +d.estimateLap().toFixed(1),
    spins: w.ev.filter((e) => e.startsWith('SPIN')).length, offEvents: w.ev.filter((e) => e.startsWith('OFF')).length, impacts: w.imp.length,
    ev: w.ev.slice(0, 40).join(' | '), imp: w.imp.slice(0, 40).join(' '), errs: w.errs.join(' '), pits: ai.reduce((a, c) => a + c.pitStops, 0) };
};

/**
 * Crash tests (g-forces): a session must be running. Each test takes one or two cars off the grid, sets them up and
 * runs the physics (and the car-to-car contacts) alone for a few seconds, then reports the peak g each car took, the
 * pulses over 10 g, and how the car ended up (driving on / wrecked, split).
 *   __crash.wall(kmh, angleDeg)   into the barrier on the nearest side
 *   __crash.tbone(kmh)            nose into the side of a car stopped across the track
 *   __crash.rear(kmh)             into the back of a car at half that speed
 *   __crash.roll(kmh)             sliding sideways off the road into the run-off
 */
window.__crash = {
  setup(n) {
    const d = F.S.director, tr = d.track, cars = d.cars.filter((c) => !c.isPlayer).slice(0, n);
    for (const c of cars) { Object.assign(c, { air: false, wreck: false, retired: false, split: false, peakG: 0, ghost: 0, held: false, p: null, q: null, v: null, w: null, dmgCooldown: 0, gLog: [], _clock: 0 }); c.wheelsOn = [true, true, true, true]; for (const k in c.dmg) c.dmg[k] = 0; c.ai && (c.ai.reaction = 1e9); }
    d.simCars = cars; d.world.racing = true; return { d, tr, cars };
  },
  run(d, cars, secs = 4) {
    const SUB = 1 / 120;
    for (let k = 0; k < secs / SUB; k++) { for (const c of cars) { c._clock = k * SUB; c.throttle = 0; c.brake = 0; c.steer = 0; c.step(SUB, d.world); } d.collisions(); }
    d.simCars = null;
    return cars.map((c) => ({ car: c.short, peakG: +(c.peakG || 0).toFixed(1), pulses: c.gLog.filter((p) => p.g >= 10).slice(0, 6).map((p) => `${p.kind} ${p.g}g`).join(', '), end: c.split ? 'SPLIT' : c.wreck || c.retired ? `OUT (${c.retireReason})` : c.air ? 'still airborne' : 'drives on' }));
  },
  // a straight stretch: the sample with the least curvature in the first half of the lap
  straight(tr) { let best = 0, bk = 1; for (let i = 50; i < tr.n / 2; i += 5) { let k = 0; for (let j = -30; j <= 30; j++) k += Math.abs(tr.curv[(i + j + tr.n) % tr.n]); if (k < bk && tr.barL[i] && tr.barR[i]) { bk = k; best = i; } } return tr.s[best]; },
  wall(kmh, deg) {
    const { d, tr, cars } = this.setup(1), c = cars[0], s = this.straight(tr);
    c.placeOnTrack(s, -tr.halfWidth + 2, kmh / 3.6); c.th += deg * Math.PI / 180;   // pointed at the left barrier
    return { test: `wall ${kmh} km/h at ${deg} deg (${['none', 'armco', 'tyres', 'wall'][tr.barL[tr.idxAtS(s)]]})`, ...this.run(d, cars)[0] };
  },
  tbone(kmh) {
    const { d, tr, cars } = this.setup(2), [a, b] = cars, s = this.straight(tr);
    a.placeOnTrack(s + 40, 0, 0); a.th += Math.PI / 2; b.placeOnTrack(s + 40 - 2.8 - 4, 0, kmh / 3.6);
    return { test: `T-bone ${kmh} km/h`, result: this.run(d, cars) };
  },
  rear(kmh) {
    const { d, tr, cars } = this.setup(2), [a, b] = cars, s = this.straight(tr);
    a.placeOnTrack(s + 40, 0, kmh / 7.2); b.placeOnTrack(s + 40 - 6.5, 0, kmh / 3.6);
    return { test: `rear-end ${kmh} km/h into a car at ${kmh / 2}`, result: this.run(d, cars) };
  },
  roll(kmh) {
    const { d, tr, cars } = this.setup(1), c = cars[0];
    // a corner's escape area (gravel on a permanent circuit): sliding sideways toward it
    const z = tr.cornerZones.find((z) => z.runoff > 10) || tr.cornerZones[0], side = -z.dir, i = z.a;
    c.placeOnTrack(tr.s[i], side * (tr.halfWidth - 1), 0); c.vLat = side * kmh / 3.6; c.vLong = 8;   // (vLat + : sliding left)
    return { test: `sideways slide ${kmh} km/h off the road`, ...this.run(d, cars, 6)[0] };
  },
};

/**
 * Pit loss: every AI car boxes on lap 2 (same compound, no repairs). The time over a stretch from 300 m before the
 * pit entry to 300 m past the lane's merge on the stop lap, against the same car's clean laps over it, is the time a
 * stop costs; also the time from the lane's first metre to its last, between the speed lines, and stationary.
 *   __pitLoss.start(4); __pitLoss.run(200); __pitLoss.run(200); __pitLoss.report()
 */
window.__pitLoss = {
  start(len = 4) {
    window.__race.start(len);
    const d = F.S.director, P = d.pit, tr = d.track, ps = P.samples, iM = Math.min(ps.n - 1, Math.round(P.mergeU / ps.ds));
    this.d = d; this.sA = tr.wrapS(P.entryS - 300); this.sB = tr.wrapS(tr.nearest(ps.px[iM], ps.pz[iM]).s + 300); this.rec = new Map();
    return { sA: Math.round(this.sA), sB: Math.round(this.sB), limit: [Math.round(P.limitFrom), Math.round(P.limitTo)], lane: [Math.round(P.divergeU), Math.round(P.mergeU)] };
  },
  run(secs) {
    const d = this.d, step = 0.05, crossed = (a, b, x) => d.planDs(a, x) > 0 && d.planDs(b, x) <= 0 && Math.abs(d.planDs(a, b)) < 50;
    for (let k = 0; k < secs / step && !d.done; k++) {
      const prev = new Map(d.cars.map((c) => [c, c.s]));
      F.stepSim(step);
      for (const c of d.cars) {
        if (c.isPlayer || c.retired) continue;
        let r = this.rec.get(c); if (!r) this.rec.set(c, (r = { tA: null, segs: [], lane: [], lim: [], stop: [] }));
        // (staggered over laps 2-4, a third of the field each time: a clean stop, not a queue in the lane)
        if (c.lap === 1 + (c.id % 3) && !r.asked && c.s > 1200 && c.s < 3500) { r.asked = true; c.pitRequested = true; c.ai.pitPlan = { compound: c.tyres.compound, repair: 'none' }; }
        const s0 = prev.get(c);
        if (crossed(s0, c.s, this.sA)) { r.tA = d.time; r.stops0 = c.pitStops; }
        if (crossed(s0, c.s, this.sB) && r.tA != null) { r.segs.push({ t: d.time - r.tA, pit: c.pitStops > r.stops0 }); r.tA = null; }
        if (c.pitLane && r.laneT0 == null) r.laneT0 = d.time; if (!c.pitLane && r.laneT0 != null) { r.lane.push(d.time - r.laneT0); r.laneT0 = null; }
        if (c.pitLimiter && r.limT0 == null) r.limT0 = d.time; if (!c.pitLimiter && r.limT0 != null && !c.pitLane) { r.lim.push(d.time - r.limT0); r.limT0 = null; }
        if (c.held && c.pitLaneState === 'stop') { if (r.stT0 == null) r.stT0 = d.time; } else if (r.stT0 != null) { r.stop.push(d.time - r.stT0); r.stT0 = null; }
      }
    }
    return Math.round(d.time);
  },
  report() {
    const med = (a) => { const b = [...a].sort((x, y) => x - y); return b.length ? +b[b.length >> 1].toFixed(2) : null; };
    const deltas = [], lane = [], lim = [], stop = [];
    for (const [c, r] of this.rec) {
      const clean = r.segs.filter((s) => !s.pit).map((s) => s.t), pit = r.segs.filter((s) => s.pit).map((s) => s.t);
      if (clean.length && pit.length) deltas.push(pit[0] - clean.reduce((a, b) => a + b, 0) / clean.length);
      lane.push(...r.lane); lim.push(...r.lim); stop.push(...r.stop);
    }
    return { cars: deltas.length, loss: med(deltas), lossRange: deltas.length ? [Math.min(...deltas), Math.max(...deltas)].map((x) => +x.toFixed(1)) : null, laneTime: med(lane), limiterZoneTime: med(lim), stationary: med(stop), stops: stop.length };
  },
};

/**
 * A full-grid race in chunks: __race.start(laps), then __race.run(seconds) as often as needed, then __race.report().
 * Counts spins (with or without contact in the 1.5 s before), cars going airborne, car-to-car contact (impulse steps
 * and damaging hits), on-track overtakes between running cars (not through the pits, not of a stopped car) and
 * retirements.
 */
window.__race = {
  start(len = 5) {
    F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = len; F.restart();
    const d = F.S.director; this.d = d;
    for (const c of d.cars) if (c.isPlayer) { c.ghost = 1e9; c.placeOnTrack(c.s, 40, 0); }
    this.ai = d.cars.filter((c) => !c.isPlayer);
    this.spinning = new Map(); this.air = new Set(); this.ev = []; this.lastHit = new Map(); this.contactSteps = 0; this.hits = 0; this.overtakes = 0; this.passLog = [];
    const proto = Object.getPrototypeOf(this.ai[0]), self = this;
    if (!proto.__hImp) proto.__hImp = proto.impulseAt;
    proto.impulseAt = function (...a) { if (a[4] !== undefined) { self.lastHit.set(this, d.time); self.contactSteps++; } return proto.__hImp.apply(this, a); };
    // (the director reports car-to-car hits through its own onImpact)
    const oi = d.onImpact.bind(d); this.hitLog = []; d.onImpact = (car, sev, kind) => { if (kind === 'car' && sev > 0.05) { self.hits++; if (self.hitLog.length < 30) self.hitLog.push(`${car.short}@${Math.round(car.s)}/${sev.toFixed(2)}`); } return oi(car, sev, kind); };
    this.order = null;
    return 'started';
  },
  _ordering() {
    // running order by distance, only cars racing normally (no pit lane, not stopped / retired / airborne)
    // (by lap and lap distance: on the grid the cars sit just behind the line, where s is nearly a whole lap)
    const L = this.d.track.length, prog = (c) => c.lap * L + c.lapDist;
    return this.ai.filter((c) => !c.retired && !c.inPit && !c.pitLane && !c.air && !c.wreck && c.speed > 15 && isFinite(c.lapDist)).sort((a, b) => prog(b) - prog(a));
  },
  run(secs) {
    const d = this.d, step = 0.1;
    for (let k = 0; k < secs / step && !d.done; k++) {
      F.stepSim(step);
      for (const c of this.ai) {
        const sp = !!c.spinning;
        if (sp && !this.spinning.get(c)) { const h = this.lastHit.get(c); this.ev.push(`SPIN ${c.short}@${Math.round(c.s)} L${c.lap} ${h != null && d.time - h < 1.5 ? 'contact' : 'solo'}`); }
        this.spinning.set(c, sp);
        if (c.air && !this.air.has(c)) { this.air.add(c); this.ev.push(`AIR ${c.short}@${Math.round(c.s)} L${c.lap}`); }
      }
      // overtakes: a pair of running cars whose order swapped since the last check, both still running
      if (d.world.racing && d.time - (d.world.raceStart || 0) > 15) {   // (not the getaway from the grid)
        const now = this._ordering(), idx = new Map(now.map((c, i) => [c, i]));
        // a swap counts once the new order has held for 3 s (side-by-side flicker through a corner is not a pass)
        const L = this.d.track.length, prog = (c) => c.lap * L + c.lapDist;
        if (this.order) for (let i = 0; i < this.order.length; i++) for (let j = i + 1; j < this.order.length; j++) {
          const a = this.order[i], b = this.order[j]; if (!idx.has(a) || !idx.has(b)) continue;
          if (idx.get(b) < idx.get(a) && Math.abs(prog(a) - prog(b)) < 60) (this.pending || (this.pending = [])).push({ a, b, t: d.time, s: b.s });
        }
        if (this.pending) this.pending = this.pending.filter((p) => {
          if (d.time - p.t < 3) return true;
          if (prog(p.b) > prog(p.a) && !p.a.retired && !p.a.inPit && !p.a.spinning) { this.overtakes++; if (this.passLog.length < 40) this.passLog.push(`${p.b.short}>${p.a.short}@${Math.round(p.s)}`); }
          return false;
        });
        this.order = now;
      }
    }
    return Math.round(d.time);
  },
  report() {
    const best = this.ai.map((c) => c.bestLap).filter(isFinite).sort((a, b) => a - b);
    const spins = this.ev.filter((e) => e.startsWith('SPIN'));
    return { track: F.W.track.def.id, t: Math.round(this.d.time), done: this.d.done,
      best: best.slice(0, 3).map((x) => x.toFixed(2)).join(' '), median: best.length ? best[best.length >> 1].toFixed(2) : '-',
      spins: spins.length, spinsSolo: spins.filter((e) => e.endsWith('solo')).length, airborne: this.air.size,
      contactSteps: this.contactSteps, damagingHits: this.hits, overtakes: this.overtakes, defences: this.ai.reduce((a, c) => a + (c.ai?.defences || 0), 0),
      retired: this.ai.filter((c) => c.retired).map((c) => `${c.short}:${c.retireReason}`).join(' '),
      pits: this.ai.reduce((a, c) => a + c.pitStops, 0), ev: this.ev.slice(0, 30).join(' | '), passes: this.passLog.slice(0, 20).join(' '), hits: this.hitLog.join(' ') };
  },
};

/**
 * AI calibration run (tools/ai_train.mjs, tools/ai_fit.mjs): one AI car alone, as __soloRun, for `laps` flying laps
 * with calibration `cal` (ai/Calibration.js shape; undefined = the circuit's own, null = none), mistakes off unless
 * opts.mistakes. Per numbered corner with an arc length: its window [apex - 220, apex + 120] on every flying lap - the
 * time through it, the minimum speed (km/h), where the brake first went past 0.3 before the apex (m before it) - and
 * every off, impact or spin inside it. Leaves the circuit's own calibration applied afterwards.
 */
window.__calRun = function (laps = 3, cal = undefined, opts = {}) {
  const tr = F.W.track, own = F.AI_CAL[tr.def.id];
  // (a calibration with a driver's line or lap rebuilds the racing line and the AI's speeds on it: main.js rebuildLine)
  const use = cal === undefined ? own : cal, lapCal = (c) => !!(c && (c.line || c.speed || c.lineFrom));
  if (lapCal(use) || lapCal(own)) F.rebuildLine(use); else F.applyCalibration(tr, use);
  const errBase = F.AI_TUNE.errBase; if (!opts.mistakes) F.AI_TUNE.errBase = 0;
  // (seeded: the same calibration gives the same laps to the millisecond, so two runs differ only by what was changed)
  const rand = Math.random; let seed = opts.seed ?? 20260615; Math.random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const diff0 = F.settings.diff; if (opts.diff != null) F.settings.diff = opts.diff;   // (the difficulty slider: 100 is the AI at its quickest)
  F.settings.grid = 'pick'; F.settings.slot = 22; F.settings.len = laps + 3; F.settings.weather = opts.weather || 'dry'; F.settings.tyre = 'SOFT'; F.settings.sc = 'off'; F.settings.fail = 'off'; F.settings.time = 'day'; F.restart();
  const d = F.S.director, solo = d.cars.filter((c) => !c.isPlayer)[opts.car || 0];
  for (const c of d.cars) if (c !== solo) { if (c.isPlayer) { c.ghost = 1e9; c.placeOnTrack(c.s, 40, 0); } else { c.retired = true; c.placeOnTrack(c.s, 30, 0); } }
  if (!opts.form) solo.form = null;   // (the driver's form on the day moves between sessions: neutral, so runs compare)
  // (and its tyres: the race plan picks a compound at random - softs unless asked, the grippiest and the hardest to keep clean)
  if (solo.tyres.compound !== (opts.tyre || 'SOFT')) solo.fitTyres(opts.tyre || 'SOFT');
  solo.tyres.temp = 0.35; solo.tyres.wear = 0;
  solo.ai.strat = { type: 'long', wear: 9, cover: 0 };   // (and never a stop: laps to compare, not a race)
  const C = (tr.def.corners || []).filter((c) => c.s != null).map((c) => ({ n: c.n, apex: c.s, a: tr.wrapS(c.s - 220), b: tr.wrapS(c.s + 120) }));
  const trace = [], ev = [];
  const oi = d.world.onImpact; d.world.onImpact = (car, sev, kind) => { if (car === solo) ev.push({ k: 'impact', s: car.s, lap: car.lap, sev, d: +car.d.toFixed(1) }); if (oi) oi(car, sev, kind); };
  let spinning = false, wasOff = false;
  const step = 0.05;
  let lapSeen = solo.lap;
  for (let k = 0; k < (laps + 1.6) * 200 / step && !d.done && solo.lap < laps + 2; k++) {
    F.stepSim(step);
    // (opts.fresh: the tyres as new at every line - laps that compare, not a stint wearing them out)
    if (opts.fresh && solo.lap !== lapSeen) { lapSeen = solo.lap; solo.tyres.wear = 0; }
    const sp = Math.abs(solo.r) > 1.4 && solo.speed > 6; if (sp && !spinning) ev.push({ k: 'spin', s: solo.s, lap: solo.lap }); spinning = sp;
    // (an off: where it left the road, and how far past the white line the car's centre went - over the kerb's edge on a
    //  line that rides the kerbs is not a car lost)
    const off = !!solo.offTrack; if (off && !wasOff) ev.push({ k: 'off', s: solo.s, lap: solo.lap, over: 0 }); wasOff = off;
    if (off) { const e = ev[ev.length - 1], over = Math.abs(solo.d) - tr.edgeAt(solo.trackIdx, Math.sign(solo.d) || 1); if (e?.k === 'off') e.over = Math.max(e.over, +over.toFixed(1)); }
    trace.push([d.time, solo.lap, solo.s, solo.speed * 3.6, solo.brake, solo.throttle]);
    if (opts.probe && solo.lap === opts.probe[2] && solo.s > opts.probe[0] && solo.s < opts.probe[1]) (window.__probe = window.__probe || []).push([Math.round(solo.s), Math.round(solo.speedKmh), +solo.d.toFixed(2), +solo.brake.toFixed(2), +solo.throttle.toFixed(2), +solo.steer.toFixed(3), +solo.r.toFixed(2), +F.W.line.offsetAt(solo.s).toFixed(2), solo.surf, (solo.wh?.surf || []).join('')]);
  }
  d.world.onImpact = oi; F.AI_TUNE.errBase = errBase; Math.random = rand; F.settings.diff = diff0;
  const inWin = (s, a, b) => (a <= b ? s >= a && s <= b : s >= a || s <= b);
  const fwd = (a, b) => { const L = tr.length; let x = (b - a) % L; if (x < 0) x += L; return x; };
  const flying = (lap) => lap >= 1 && lap <= laps;   // (lap counter: 0 on the standing start lap)
  const out = C.map((c) => {
    // every pass through the window, in order: in within 25 m of its start, out within 25 m past its end; a pass counts
    // once the standing-start lap is behind the car (its lap counter at 1 or more)
    const runs = []; let cur = null;
    for (let i = 1; i < trace.length; i++) {
      const [t, lp, s, v, br] = trace[i], sp = trace[i - 1][2], tp = trace[i - 1][0];
      const now = inWin(s, c.a, c.b), was = inWin(sp, c.a, c.b);
      if (now && !was) cur = fwd(c.a, s) < 25 ? { t0: t, lap: lp, vmin: Infinity, brake: null } : null;
      // (the minimum speed of the corner itself: within 70 m before its apex and 50 m after - a chicane's other half is not this one)
      if (cur && now) { const toApex = fwd(s, c.apex), past = fwd(c.apex, s); if (toApex <= 70 || past <= 50) cur.vmin = Math.min(cur.vmin, v); if (cur.brake == null && br > 0.3 && toApex > 0 && toApex <= 220) cur.brake = Math.round(toApex); }
      if (cur && !now && was) { if (fwd(c.b, s) < 25 && cur.lap >= 1) runs.push({ t: +(tp - cur.t0).toFixed(3), vmin: +cur.vmin.toFixed(1), brake: cur.brake }); cur = null; }
    }
    void flying;
    const here = ev.filter((e) => inWin(e.s, c.a, c.b));
    return { n: c.n, runs, t: runs.length ? +(runs.reduce((a, r) => a + r.t, 0) / runs.length).toFixed(3) : null, vmin: runs.length ? Math.min(...runs.map((r) => r.vmin)) : null,
      brake: runs.find((r) => r.brake != null)?.brake ?? null, incidents: here.map((e) => `${e.k}@${Math.round(e.s)}`) };
  });
  if (lapCal(use) || lapCal(own)) F.rebuildLine(own); else F.applyCalibration(tr, own);
  // (opts.trace: the last flying lap's speed every 5 m of the lap, km/h - for lining telemetry up against it)
  let prof = null;
  if (opts.trace) {
    const lapN = Math.max(1, laps), n = Math.ceil(tr.length / 5), v = new Array(n).fill(null);
    for (const [, lp, s, sp] of trace) if (lp === lapN) { const k = Math.floor(s / 5); if (k < n) v[k] = v[k] == null ? sp : Math.min(v[k], sp); }
    for (let k = 0; k < n; k++) if (v[k] == null) v[k] = v[(k - 1 + n) % n] ?? 0;
    prof = v.map((x) => +x.toFixed(1));
  }
  return { track: tr.def.id, length: +tr.length.toFixed(1), drv: `${solo.short} r${solo.rating}`, laps: solo.lapTimes.map((x) => +x.toFixed(3)), corners: out, events: ev.map((e) => `${e.k}@${Math.round(e.s)}${e.d != null ? `(d${e.d})` : ''}${e.over != null ? `(+${e.over}m)` : ''} L${e.lap}`), ev, trace: prof };
};
