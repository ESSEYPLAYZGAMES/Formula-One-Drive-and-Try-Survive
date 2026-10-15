// Per-circuit AI calibration: how hard the AI commits, corner by corner, on top of the physics (the planner's corner
// speed from the car's grip and downforce, its braking from the friction circle). The physics is the same everywhere;
// what differs per corner is what a driver dares - a kerb that can be ridden, a wall that cannot be touched, a chicane
// whose second part decides the first. Every number is a multiplier (1 = the physics as it stands):
//   v      corner speed over the zone (the planner's speed limit around the apex)
//   b      braking commitment into it (how late the stop: the deceleration the plan assumes)
//   err    how often a mistake happens there
//   scrape the share of mistakes there that end with the car brushing the outside wall (the Wall of Champions)
// The numbers come from training: tools/ai_train.mjs (headless laps, every corner tried faster and slower, kept where
// the lap gains and the car stays clean) and tools/ai_fit.mjs (real telemetry: each corner's minimum speed and braking
// point, relative to the lap, fitted onto the sim's car). AI_CAL[track].source says which made them.
export const AI_CAL = {
  // <cal:montreal>
  montreal: {
    source: "trained: tools/ai_train.mjs (2026-10-15), seeded 3-lap solo runs on softs, mistakes off; flying lap 78.09 s -> 77.28 s (sim/real 1.09 against the 2025 pole, 70.9 s: the ratio Silverstone runs at); no telemetry fitted yet",
    corners: {
      1: { v: 1.067, b: 1 },
      2: { v: 1.067, b: 1 },
      3: { v: 1.06, b: 0.975 },
      4: { v: 1.06, b: 0.975 },
      5: { v: 1.022, b: 0.975 },
      6: { v: 1.06, b: 1 },
      7: { v: 1.06, b: 1 },
      8: { v: 1.06, b: 1.038 },
      9: { v: 1.06, b: 1.038 },
      10: { v: 1.067, b: 1.038 },
      13: { v: 1.028, b: 1 },
      14: { v: 1.028, b: 1, err: 1.3, scrape: 0.35 },
    },
  },
  // </cal:montreal>
};

/** the window a corner's numbers apply over (m, from its apex): the speed around the apex, the braking before it */
const V_WIN = [-45, 35], B_WIN = [-220, 0], EASE = 15;

/**
 * Per-sample multipliers on the track (track.aiV, track.aiB) from a calibration ({ corners: { n: { v, b } } }, or
 * AI_CAL[track.def.id]). Overlapping windows (the two halves of a chicane) take the product's nearest-to-1 blend: the
 * value of the corner whose apex is closer. Call after the corners have their arc lengths (main.js labelCorners).
 */
export function applyCalibration(track, cal = AI_CAL[track.def.id]) {
  const n = track.n, V = new Float32Array(n).fill(1), B = new Float32Array(n).fill(1), dist = new Float32Array(n).fill(Infinity);
  track.aiCal = cal || null; track.aiV = V; track.aiB = B;
  if (!cal || !cal.corners) return track;
  for (const c of track.def.corners || []) {
    const k = cal.corners[c.n]; if (!k || c.s == null) continue;
    const put = (arr, win, val) => {
      if (val == null || val === 1) return;
      for (let x = win[0] - EASE; x <= win[1] + EASE; x += track.ds) {
        const i = track.idxAtS(c.s + x), t = x < win[0] ? (x - win[0] + EASE) / EASE : x > win[1] ? (win[1] + EASE - x) / EASE : 1, w = t * t * (3 - 2 * t);
        const d = Math.abs(x); if (arr === V && d > dist[i] && V[i] !== 1) continue;   // (a chicane: the nearer apex wins)
        arr[i] = 1 + (val - 1) * w; if (arr === V) dist[i] = d;
      }
    };
    put(V, V_WIN, k.v); put(B, B_WIN, k.b);
  }
  return track;
}
/** the mistake numbers of the corner zone `zone` (over all its numbered turns: the largest), or null */
export function zoneCal(track, zone) {
  const C = track.aiCal?.corners; if (!C || !zone) return null;
  let out = null;
  for (const t of zone.turns || [zone.turn]) { const k = C[t]; if (!k) continue; out = out || { err: 1, scrape: 0 }; out.err = Math.max(out.err, k.err ?? 1); out.scrape = Math.max(out.scrape, k.scrape ?? 0); }
  return out;
}
