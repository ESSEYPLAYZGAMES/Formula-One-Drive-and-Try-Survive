// Four-wheel chassis: per-wheel vertical loads from a sprung body (heave, pitch and roll on springs, dampers and
// anti-roll bars), load-sensitive tyres of different sizes front and rear, and the road under each wheel (kerbs,
// grass, gravel; elevation later). The yaw / lateral dynamics stay planar (Car.js integrates them); this module
// supplies the loads, the tyre capacities, and the steady-state cornering limit the AI and the speed profile use.
//
// Body frame: x forward, y LEFT, z up. Wheels FL, FR, RL, RR. Pitch pt > 0 nose up, roll rl > 0 left side up.

/**
 * A 2026 F1 car: narrower tyres on 18" rims (the car model's: ~330 mm front / 415 mm rear across the bulge), 1.55 /
 * 1.47 m between the hubs, very stiff in roll with the front axle carrying most of the roll stiffness (57 %) - at the
 * limit the front lets go first: the rear has 4.3 % in hand in a slow corner, 5.2 % at 160 km/h and 5.9 % at 270 (the
 * 2022-25 car had 4.6, 6.1 and 7.3: it pushed more the faster the corner). Nearer neutral than that and the car snaps
 * when a driver lifts at 4 g in a fast direction change (Montreal's Turn 3-4: the drag's 0.5 g takes the load off the
 * rear). Wheel rates are spring and tyre in series (~4 Hz heave). Ride height ~30 mm under aero load.
 */
export const CH = {
  tf: 1.55, tr: 1.472,                  // track widths (m): the car model's hubs
  kF: 110000, kR: 130000,               // corner wheel rates (N/m)
  cF: 4500, cR: 5300,                   // corner dampers (N s/m)
  arbF: 76000, arbR: 43000,             // anti-roll bars (N/m of left-right deflection difference): 57 % of the roll stiffness at the front
  Ipitch: 950, Iroll: 400,              // sprung body inertias (kg m^2)
  lsK: 0.09,                            // tyre load sensitivity: grip ~ Fz^-0.09 (twice the load, 6 % less friction)
  fz0F: 3300, fz0R: 4400,               // nominal tyre loads (N): the rear is a third wider
  muF: 1.88, muR: 1.88,                 // friction at nominal load: 2.35 g at 100 km/h, 5.45 g at 290 km/h; the rear axle has 4.3 % (slow) to 5.9 % (fast) in hand
  bF: 19, bR: 21,                       // lateral force curve stiffness (peak ~7 deg front, ~6 deg rear)
  envTau: 0.012,                        // tyre envelopment: how fast a wheel follows a step in the road (s)
  lsdLock: 0.6,                         // limited-slip diff: share of the drive the loaded rear wheel takes over
};
// wheel positions [x, y] for lf, lr filled in by the car (CAR.lf / CAR.lr)
export const WHEELS = 4;

/** peak force a tyre can make at vertical load fz (N): mu(fz) * fz with load sensitivity */
export function tyreCap(fz, front) {
  if (fz <= 0) return 0;
  const f0 = front ? CH.fz0F : CH.fz0R, mu = front ? CH.muF : CH.muR;
  return mu * f0 * Math.pow(fz / f0, 1 - CH.lsK);
}

/** roll stiffness (N m / rad) of each axle: the corner springs plus the bar */
export function rollStiffness() {
  const kf = CH.kF * CH.tf * CH.tf / 2 + CH.arbF * CH.tf * CH.tf, kr = CH.kR * CH.tr * CH.tr / 2 + CH.arbR * CH.tr * CH.tr;
  return { kf, kr, front: kf / (kf + kr) };
}

/**
 * Steady-state cornering limit at speed v (m/s), no braking or drive: lateral load transfer split by the roll
 * stiffness, each axle's two tyres against that axle's share of the lateral force.
 * @returns { a: limit lateral acceleration (m/s^2), aF, aR: where each axle would saturate (aR > aF: understeer) }
 */
export function lateralLimit(v, car, grip = 1) {
  const m = car.mass, g = 9.81, L = car.wheelbase, q = 0.5 * car.rho * v * v, df = q * car.clA;
  const FzF = m * g * car.lr / L + df * car.aeroFrontShare, FzR = m * g * car.lf / L + df * (1 - car.aeroFrontShare);
  const { front } = rollStiffness(), h = car.cgH;
  const capAt = (ay, isF) => {
    const Fz = isF ? FzF : FzR, t = isF ? CH.tf : CH.tr, dF = m * ay * h * (isF ? front : 1 - front) / t;
    return grip * (tyreCap(Fz / 2 - dF, isF) + tyreCap(Fz / 2 + dF, isF));
  };
  const solve = (isF) => {   // largest ay the axle can hold: capacity(ay) >= its share of m ay
    const share = isF ? car.lr / L : car.lf / L;
    let lo = 0, hi = 80;
    for (let it = 0; it < 40; it++) { const mid = (lo + hi) / 2; if (capAt(mid, isF) >= m * mid * share) lo = mid; else hi = mid; }
    return lo;
  };
  const aF = solve(true), aR = solve(false);
  return { a: Math.min(aF, aR), aF, aR };
}

/**
 * The effective friction and downforce of the whole car, fitted to lateralLimit over the speed range:
 * aLat(v) ~ mu (g + dfm v^2). The racing line's speed profile and the AI's grip model use these.
 */
export function fitGrip(car) {
  // least squares of a = A + B v^2 over 15..90 m/s
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let v = 15; v <= 90; v += 5) { const x = v * v, y = lateralLimit(v, car).a; n++; sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const B = (n * sxy - sx * sy) / (n * sxx - sx * sx), A = (sy - B * sx) / n;
  const mu = A / 9.81;
  return { mu, dfm: B / mu };   // dfm: downforce per unit mass per (m/s)^2, as "extra g"
}

/**
 * What the road does under one wheel: height (m) above the plain road surface. Kerbs rise toward their outer
 * edge (as the kerb meshes) with ridges along them; grass and gravel are rough. (Elevation from survey data is
 * relative to the plane of the car and will be added here.)
 */
export function roadHeight(track, i, d, s, surf) {
  if (surf === 1) {
    if (!track.inCorner[i]) return 0;                        // (a street circuit's painted edge outside the corners)
    const t = Math.min(1, Math.max(0, (Math.abs(d) - track.edgeAt(i, d > 0 ? 1 : -1)) / track.kerbWidth));
    return 0.02 + 0.03 * t + 0.005 * Math.sin(s * 7.85);    // ~0.8 m ridges
  }
  if (surf === 3) return 0.012 * (Math.sin(s * 2.1 + d * 1.7) * 0.6 + Math.sin(s * 5.3 - d * 3.1) * 0.4);   // grass: lumpy
  if (surf === 4) return 0.02 * (Math.sin(s * 3.7 + d * 2.3) * 0.5 + Math.sin(s * 9.1 + d * 5.7) * 0.5);    // gravel
  return 0;
}
