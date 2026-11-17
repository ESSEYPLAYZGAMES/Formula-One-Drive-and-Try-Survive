// Sprint weekends (both careers): every third round of a season of four or more. Saturday: the sprint - a third of the
// race's distance, no stop to make, its grid from a sprint shoot-out - points to the first eight, 8-7-6-5-4-3-2-1;
// then qualifying and the Grand Prix as any weekend. Raced (main.js: the weekend's first race) or simulated with the
// weekend (career/Career.js simWeekend, the HQ's SIMULATE): the points the same way, the round not moved on by it.

export const SPRINT_PTS = [8, 7, 6, 5, 4, 3, 2, 1];
/** is the career's current round a sprint weekend? */
export const isSprintRound = (C) => !!C && (C.rounds || 0) >= 4 && C.round % 3 === 0 && C.round <= C.rounds;
/** the sprint's laps for a race of `laps` */
export const sprintLaps = (laps) => Math.max(3, Math.round(laps / 3));
/**
 * The sprint's result into the career: the points to the drivers and their teams (rows: [{ pos, car: { careerId, team,
 * retired, name } }]), the line in the news. -> [{ id, name, pos, pts }] of the points scorers
 */
export function applySprint(C, rows) {
  const out = [];
  for (const r of rows) {
    const d = C.drivers?.[r.car.careerId]; if (!d) continue;
    const pts = r.car.retired ? 0 : (SPRINT_PTS[r.pos - 1] || 0); if (!pts) continue;
    d.points = (d.points || 0) + pts; if (d.careerPts != null) d.careerPts += pts;
    const t = C.teams?.[r.car.team]; if (t) t.points = (t.points || 0) + pts;
    out.push({ id: d.id, name: d.name, pos: r.pos, pts });
  }
  const w = rows.find((r) => !r.car.retired);
  try { C.addNews?.(`Sprint, round ${C.round}: ${w ? `${w.car.name} wins` : 'run'}. Points to the first eight (8-7-6-5-4-3-2-1).`); } catch (e) { /* no news */ }
  C.sprintDone = { season: C.season, round: C.round };
  try { C.save?.(); } catch (e) { /* saved with the weekend */ }
  return out;
}
/** a simulated sprint: the entries by their pace, a little of the day in it, the odd retirement -> rows */
export function simSprintRows(C) {
  const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.012;
  const E = (C.entries?.() || []).map((e) => ({ e, s: (e.perf || 0) + (e.rating || 0.8) * 0.02 + g(), dnf: Math.random() < 0.012 }));
  return E.sort((a, b) => (a.dnf - b.dnf) || b.s - a.s).map((x, i) => ({ pos: i + 1, car: { careerId: x.e.careerId, team: x.e.team, name: x.e.name, retired: x.dnf, retireReason: x.dnf ? 'Mechanical' : null } }));
}
/** this round's sprint already run (raced, or simulated with the weekend)? */
export const sprintRun = (C) => !!C?.sprintDone && C.sprintDone.season === C.season && C.sprintDone.round === C.round;
