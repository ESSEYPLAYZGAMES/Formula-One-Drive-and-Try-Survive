// Live sector times, as the timing screens show them: the lap in thirds (the same split as the telemetry), each sector
// timed as the car crosses into the next (interpolated back to the moment it crossed), coloured against the session -
// purple: the fastest anyone has done it, green: the driver's own best, yellow: neither. A sector that went through
// the pit lane (a shorter path, a different clock) is shown but never a best.
export class Sectors {
  constructor(director) {
    this.d = director; this.best = [Infinity, Infinity, Infinity]; this.bestBy = [null, null, null]; this.cars = new Map();
  }
  /** a car's sectors: { cur: [t | null] x3 this lap, col: ['purple' | 'green' | 'yellow'] x3, last: the lap before, pb } */
  of(c) { return this.cars.get(c) || null; }

  update() {
    const d = this.d, L = d.track.length, third = L / 3, now = d.simNow ?? d.time;
    for (const c of d.cars) {
      if (c.isSC || c.retired) continue;
      let st = this.cars.get(c);
      if (!st) { st = { k: null, t0: null, lapStart: c.lapStart, cur: [null, null, null], col: [null, null, null], last: null, lastCol: null, pb: [Infinity, Infinity, Infinity] }; this.cars.set(c, st); }
      // a new lap started (the timing line): the last sector is done, the next lap's begin
      if (c.lapStart !== st.lapStart) {
        if (st.k === 2 && st.t0 != null && c.lapStart > st.t0) this.done(c, st, 2, c.lapStart - st.t0);
        st.lapStart = c.lapStart;
        if (st.k != null) { st.last = st.cur; st.lastCol = st.col; }
        st.cur = [null, null, null]; st.col = [null, null, null];
        st.k = c.lapStart >= 0 ? 0 : null; st.t0 = c.lapStart >= 0 ? c.lapStart : null;
      }
      if (c.inPit || c.pitLane) st.pit = true;
      if (st.k == null || st.k >= 2) continue;
      const k = Math.floor(c.lapDist / third);
      if (k === st.k + 1) {
        const past = c.lapDist - k * third, t = now - Math.min(0.05, past / Math.max(10, Math.abs(c.speed)));
        this.done(c, st, st.k, t - st.t0); st.t0 = t; st.k = k;
      }
    }
  }
  done(c, st, k, t) {
    const pit = st.pit; st.pit = !!(c.inPit || c.pitLane);
    if (!(t > 0.5)) return;
    st.cur[k] = t;
    if (pit) { st.col[k] = 'yellow'; return; }
    let col = 'yellow';
    if (t < this.best[k]) { this.best[k] = t; this.bestBy[k] = c; col = 'purple'; }
    else if (t < st.pb[k]) col = 'green';
    if (t < st.pb[k]) st.pb[k] = t;
    st.col[k] = col;
  }
}

/**
 * On-track overtakes (for the results: Driver of the Day, the race's facts). A car's place counts once it has held it
 * for 3 s and is clear of the car it passed by a car length or so (not two cars side by side down a straight, the nose
 * swapping back and forth); every car that was ahead of it and now is not is a pass - unless that car was in the pit
 * lane, retired, spinning or crawling (a place gained, not an overtake). c.overtakes.
 */
export class Passes {
  constructor(director) { this.d = director; this.st = new Map(); }
  update() {
    const d = this.d; if (d.mode !== 'race' || !d.world.racing) return;
    const pos = d.positions, now = d.time;
    for (let i = 0; i < pos.length; i++) {
      const c = pos[i]; let s = this.st.get(c);
      if (!s) { this.st.set(c, { idx: i, since: now, stable: i, ahead: new Set(pos.slice(0, i)) }); c.overtakes = 0; continue; }
      if (i !== s.idx) { s.idx = i; s.since = now; continue; }
      if (i === s.stable || now - s.since < 3) continue;
      const ahead = new Set(pos.slice(0, i));
      if (i < s.stable) {
        // (still alongside the car it got ahead of: not settled yet - look again next frame)
        let close = false; for (const o of s.ahead) if (!ahead.has(o) && d.progress(c) - d.progress(o) < 8) close = true;
        if (close) continue;
        if (!c.inPit && !c.pitLane && !c.retired) for (const o of s.ahead) if (!ahead.has(o) && !o.retired && !o.inPit && !o.pitLane && !o.spinning && o.speed > 15) c.overtakes = (c.overtakes || 0) + 1;
      }
      s.stable = i; s.ahead = ahead;
    }
  }
}
