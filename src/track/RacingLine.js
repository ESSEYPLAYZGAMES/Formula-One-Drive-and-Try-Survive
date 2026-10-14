// Racing line (lateral offset per sample, out-in-out) and a speed profile from
// grip + downforce with forward/backward acceleration limits.

function smoothArr(a, n, r, closed = true) {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let acc = 0, cnt = 0;
    for (let k = -r; k <= r; k++) { let j = i + k; if (closed) j = (j + n) % n; else if (j < 0 || j >= n) continue; acc += a[j]; cnt++; }
    out[i] = acc / cnt;
  }
  return out;
}

/**
 * Minimum-curvature line: the lateral offsets that minimise the p-norm of the driven path's curvature (second
 * differences of evenly spaced path points, box-constrained to the usable width). p = 2 is the classic minimum-
 * curvature line with a peaked apex; a higher p flattens the peak toward a constant-radius arc, and the peak is what
 * sets the minimum corner speed. This is what opens a 90 m centreline radius into a 130 m corner: out wide, apex,
 * all of the exit.
 * Solver: projected Gauss-Seidel on a coarse-to-fine grid (40 / 20 / 10 m). The quadratic problem is solved first
 * (over-relaxed), then the p-norm by coordinate-wise Newton steps (the re-weighted update damped by 1 / (p - 1)).
 */
function minCurvatureOffsets(track, maxOffset, p = 6) {
  const n = track.n; let off = new Float32Array(n);
  for (const spacing of [40, 20, 10]) {
    const m = Math.round(n * track.ds / spacing);
    // grid points at exact fractional sample positions: uneven spacing would read as curvature
    const CX = new Float64Array(m), CZ = new Float64Array(m), NX = new Float64Array(m), NZ = new Float64Array(m);
    const d = new Float64Array(m), X = new Float64Array(m), Z = new Float64Array(m);
    for (let j = 0; j < m; j++) {
      const u = j * n / m, i0 = Math.floor(u) % n, i1 = (i0 + 1) % n, f = u - Math.floor(u);
      CX[j] = track.px[i0] + (track.px[i1] - track.px[i0]) * f; CZ[j] = track.pz[i0] + (track.pz[i1] - track.pz[i0]) * f;
      const ax = track.nx[i0] + (track.nx[i1] - track.nx[i0]) * f, az = track.nz[i0] + (track.nz[i1] - track.nz[i0]) * f, l = Math.hypot(ax, az) || 1;
      NX[j] = ax / l; NZ[j] = az / l;
      d[j] = off[i0] + (off[i1] - off[i0]) * f; X[j] = CX[j] + d[j] * NX[j]; Z[j] = CZ[j] + d[j] * NZ[j];
    }
    const e2 = (0.002 * spacing * spacing) ** 2, ex = (p - 2) / 2;   // weight floor at R = 500 m keeps the straights well conditioned
    const wt = (a, j, b) => Math.pow((X[a] - 2 * X[j] + X[b]) ** 2 + (Z[a] - 2 * Z[j] + Z[b]) ** 2 + e2, ex);
    const QP = 400, sweeps = QP + (p > 2 ? 3000 : 0);
    for (let it = 0; it < sweeps; it++) {
      const nl = it >= QP, om = nl ? 1 / (p - 1) : 1.7;
      for (let j = 0; j < m; j++) {
        const a = (j + m - 1) % m, b = (j + 1) % m, a2 = (j + m - 2) % m, b2 = (j + 2) % m;
        const wa = nl ? wt(a2, a, j) : 1, wj = nl ? wt(a, j, b) : 1, wb = nl ? wt(j, b, b2) : 1, den = wa + 4 * wj + wb;
        const qx = (wa * (2 * X[a] - X[a2]) + 2 * wj * (X[a] + X[b]) + wb * (2 * X[b] - X[b2])) / den;
        const qz = (wa * (2 * Z[a] - Z[a2]) + 2 * wj * (Z[a] + Z[b]) + wb * (2 * Z[b] - Z[b2])) / den;
        const best = (qx - CX[j]) * NX[j] + (qz - CZ[j]) * NZ[j];
        const dj = Math.max(-maxOffset, Math.min(maxOffset, d[j] + om * (best - d[j])));
        d[j] = dj; X[j] = CX[j] + dj * NX[j]; Z[j] = CZ[j] + dj * NZ[j];
      }
    }
    off = new Float32Array(n);
    for (let i = 0; i < n; i++) {   // back onto the track samples (periodic Catmull-Rom)
      const u = i * m / n, j = Math.floor(u), f = u - j;
      const p0 = d[(j - 1 + m) % m], p1 = d[j % m], p2 = d[(j + 1) % m], p3 = d[(j + 2) % m];
      const v = 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (3 * p1 - p0 - 3 * p2 + p3) * f * f * f);
      off[i] = Math.max(-maxOffset, Math.min(maxOffset, v));
    }
  }
  return off;
}

/** Signed curvature of the offset path, measured through samples i-w, i, i+w (same sign convention as track.curv). */
function pathCurvature(track, off, w) {
  const n = track.n, k = new Float32Array(n);
  const X = new Float32Array(n), Z = new Float32Array(n);
  for (let i = 0; i < n; i++) { X[i] = track.px[i] + off[i] * track.nx[i]; Z[i] = track.pz[i] + off[i] * track.nz[i]; }
  let agree = 0;
  for (let i = 0; i < n; i++) {
    const a = (i - w + n) % n, c = (i + w) % n;
    const abx = X[i] - X[a], abz = Z[i] - Z[a], bcx = X[c] - X[i], bcz = Z[c] - Z[i], acx = X[c] - X[a], acz = Z[c] - Z[a];
    k[i] = 2 * (abx * bcz - abz * bcx) / (Math.hypot(abx, abz) * Math.hypot(bcx, bcz) * Math.hypot(acx, acz) || 1);
    agree += k[i] * track.curv[i];
  }
  if (agree < 0) for (let i = 0; i < n; i++) k[i] = -k[i];
  return k;
}

/**
 * Tyre braking deceleration (m/s^2, whole car) at which the rear axle reaches `margin` of its grip while the car
 * corners at lateral acceleration aLat. (rearBrake a)^2 + (rearStatic aLat)^2 = (margin mu (fzRear - transfer a))^2.
 * @param fzRear rear axle load per unit car mass without load transfer: rearStatic g + rear downforce / mass
 * @param ax { rearStatic: lf / wheelbase, transfer: cgH / wheelbase, rearBrake: 1 - brake bias }
 */
export function rearBrakeLimit(mu, fzRear, aLat, margin, ax) {
  let a = 0;
  const lat2 = (ax.rearStatic * aLat) ** 2;
  for (let it = 0; it < 6; it++) {
    const cap = margin * mu * (fzRear - ax.transfer * a), rem = cap * cap - lat2;
    a = 0.5 * a + 0.5 * (rem > 0 ? Math.sqrt(rem) / ax.rearBrake : 0);
  }
  return a;
}

export class RacingLine {
  /** @param optimal true: minimum-curvature line over the usable width (permanent circuits with fast corners) */
  constructor(track, { optimal = false, maxOffset = track.halfWidth - (optimal ? 1.5 : 3.4) } = {}) {
    this.track = track;
    const n = track.n, ds = track.ds;
    if (optimal) {
      this.offset = smoothArr(minCurvatureOffsets(track, maxOffset), n, Math.round(6 / ds));
      this.lineCurv = smoothArr(pathCurvature(track, this.offset, Math.round(10 / ds)), n, 3);
      return;
    }
    const ks = smoothArr(track.curv, n, Math.round(30 / ds));
    // out-in-out: inside at the apex (offset toward +curv side), outside before / after. A loose, realistic line:
    // the car drifts to the outside for the entry rather than pinning itself to the wall well before the corner
    // (shorter look distance, gentler outward pull, longer smoothing, and a wider margin to the edge)
    const look = Math.round(52 / ds);
    const raw = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const kApex = ks[i];
      const kAhead = ks[(i + look) % n], kBehind = ks[(i - look + n) % n];
      raw[i] = 380 * kApex - 230 * (kAhead + kBehind);
    }
    const sm = smoothArr(raw, n, Math.round(30 / ds));
    this.offset = new Float32Array(n);
    for (let i = 0; i < n; i++) this.offset[i] = Math.max(-maxOffset, Math.min(maxOffset, sm[i]));
    // curvature of the actual line (offset path): kappa_line ~ kappa / (1 - kappa*d) with a numeric derivative correction
    this.lineCurv = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const k = track.curv[i], d = this.offset[i];
      const den = 1 - k * d;
      const d2 = (this.offset[(i + 1) % n] - 2 * d + this.offset[(i - 1 + n) % n]) / (ds * ds);
      this.lineCurv[i] = k / (Math.abs(den) < 0.2 ? 0.2 * Math.sign(den || 1) : den) + d2;
    }
    this.lineCurv = smoothArr(this.lineCurv, n, 3);
  }

  offsetAt(s) {
    const t = this.track; const u = t.wrapS(s) / t.ds; const i0 = Math.floor(u) % t.n, i1 = (i0 + 1) % t.n, f = u - Math.floor(u);
    return this.offset[i0] + (this.offset[i1] - this.offset[i0]) * f;
  }

  /**
   * Speed profile for a car: v(s) limited by lateral grip (with downforce), braking and traction.
   * @param {object} p { mu, mass, dfCoef (N/(m/s)^2 usable downforce), dragCoef (N/(m/s)^2), vMax, brakeG, accel(v) -> m/s^2,
   *                     axle: { rearStatic, transfer, rearBrake, dfRear (N/(m/s)^2) } for the trail-braking limit }
   */
  speedProfile(p) {
    const t = this.track, n = t.n, ds = t.ds, g = 9.81;
    this.grip = { mu: p.mu, dfm: p.dfCoef / p.mass, axle: p.axle };   // what this profile assumed (the AI re-solves corner limits for its own grip)
    const v = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const k = Math.abs(this.lineCurv[i]) + 1e-5;
      // v^2 k = mu (g + (D/m) v^2)  ->  v^2 (k - mu D/m) = mu g
      const a = k - p.mu * p.dfCoef / p.mass;
      v[i] = a > 1e-6 ? Math.min(p.vMax, Math.sqrt(p.mu * g / a)) : p.vMax;
    }
    // friction circle: the longitudinal grip left over once the lateral load at a sample is being used
    const longAvail = (i, vi) => {
      const aMax = Math.min(p.brakeG * g, p.mu * (g + p.dfCoef * vi * vi / p.mass)) * 0.95;
      const aLat = vi * vi * Math.abs(this.lineCurv[i]);
      return Math.sqrt(Math.max(0.12 * aMax * aMax, aMax * aMax - aLat * aLat));
    };
    // Braking while cornering: the rear axle carries its share of the brake force, unloads under braking and still
    // has to hold the car's tail in the corner, so it lets go long before the whole-car friction circle is used up.
    // With cornering load on, the stop is limited to what keeps the rear at 80 % (plus the aero drag, 0.8 g at
    // 320 km/h): the big stop happens while the car is still straight, the corner is entered on a trailing brake.
    const dragM = (p.dragCoef || 0) / p.mass, ax = p.axle;
    const brakeAvail = (i, vi) => {
      const circle = longAvail(i, vi);
      if (!ax) return circle;
      const aLat = vi * vi * Math.abs(this.lineCurv[i]);
      const load = Math.min(1, 2 * aLat / (p.mu * (g + p.dfCoef * vi * vi / p.mass)));
      const rear = rearBrakeLimit(p.mu, ax.rearStatic * g + ax.dfRear * vi * vi / p.mass, aLat, p.rearMargin ?? 0.8, ax) + dragM * vi * vi;
      return circle + (Math.min(circle, rear) - circle) * load;
    };
    // backward pass: braking limit (friction scales with downforce, shrinks with the cornering load: trail braking, no spins)
    for (let pass = 0; pass < 2; pass++) {
      for (let c = 2 * n; c >= 0; c--) {
        const i = c % n, j = (i + 1) % n;
        const vj = v[j];
        const aB = brakeAvail(j, vj);
        v[i] = Math.min(v[i], Math.sqrt(vj * vj + 2 * aB * ds));
      }
      // forward pass: traction (rear axle share of the remaining grip) / power limit
      for (let c = 0; c <= 2 * n; c++) {
        const i = c % n, j = (i + 1) % n;
        const aA = Math.min(p.accel(v[i]), 0.72 * longAvail(i, v[i]));
        v[j] = Math.min(v[j], Math.sqrt(v[i] * v[i] + 2 * aA * ds));
      }
    }
    return v;
  }
}
