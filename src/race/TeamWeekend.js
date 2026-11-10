// The team principal's race weekend beyond the set-up (main.js TP, ui/Setup.js):
//
// TYRE SETS. Each car has an allocation for the weekend - 3 sets of softs, 2 of mediums, 2 of hards, 2 intermediates,
// 2 wets - and every set remembers its wear. Practice runs and qualifying laps go on a set and leave it used; the race
// starts on, and every stop fits, the freshest set of that compound - a set once raced is gone. No set left of a
// compound: it cannot be called for (the strategist, calling for one anyway, gets the best used set there is). The other
// teams' sets are not counted.
//
// WHAT PRACTICE TEACHES. A tyre run on a compound tells the pit wall how long it lasts here (without it the laps-to-the
// -cliff on the wall are an estimate, off by up to a quarter either way - the same way all weekend); a race simulation
// tells it the fuel the car really burns (without it the burn is up to 4 % off what the wall assumes, and the fuel
// figure is shown as approximate).
//
// QUALIFYING. Runs: two (two sets of softs used) or one (a set saved for the race, a little pace lost for want of a
// second try). Timing: early (a clear track) or late (more grip - and one time in seven, traffic or a yellow flag and a
// lap lost). A tow: one car gives the other its slipstream down the straights (the towed car quicker, the other slower).
export const ALLOCATION = { SOFT: 3, MEDIUM: 2, HARD: 2, INTER: 2, WET: 2 };
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return (h >>> 0) / 4294967295; };

export const newSets = () => Object.fromEntries(Object.entries(ALLOCATION).map(([k, n]) => [k, Array.from({ length: n }, () => 0)]));
/** sets left of a compound, and how many of them are new */
export const setsLeft = (sets, comp) => (sets?.[comp] || []).length;
export const setsNewLeft = (sets, comp) => (sets?.[comp] || []).filter((w) => w < 0.01).length;
/** a set used and put back (practice, qualifying): the most used one that still has life, `add` more wear on it -> its wear before */
export function useSet(sets, comp, add, fresh = false) {
  const a = sets?.[comp]; if (!a || !a.length) return null;
  let i = -1; if (!fresh) for (let k = 0; k < a.length; k++) if (a[k] < 0.5 && (i < 0 || a[k] > a[i])) i = k;
  if (i < 0) i = a.indexOf(Math.min(...a));   // (fresh: a new set - a qualifying run)
  const was = a[i]; a[i] = Math.min(0.95, a[i] + add); return was;
}
/** a set fitted for the race (the start, a stop): the freshest of the compound, gone from the allocation -> its wear, or null (none left) */
export function fitSet(sets, comp) {
  const a = sets?.[comp]; if (!a || !a.length) return null;
  const i = a.indexOf(Math.min(...a)), w = a[i]; a.splice(i, 1); return w;
}
/** how far off the pit wall's idea of a compound's life is without a tyre run on it (a factor on the laps to the cliff: 0.75 .. 1.3) */
export const lifeBias = (track, name, comp, round = 0) => 0.75 + 0.55 * hash(`${track}|${name}|${comp}|${round}|life`);
/** how far the fuel the car really burns is off what the wall assumes, without a race simulation (a factor: 0.96 .. 1.04) */
export const burnBias = (track, name, round = 0) => 0.96 + 0.08 * hash(`${track}|${name}|${round}|burn`);

export const QUALI = {
  runs: { two: { name: 'Two runs', perf: 1, sets: 2, title: 'Two timed runs, a new set of softs for each' }, one: { name: 'One run', perf: 0.9988, sets: 1, title: 'One run: a set of softs saved for the race - and no second try' } },
  timing: { early: { name: 'Early', title: 'Out first: a clear track, less rubber down' }, late: { name: 'Late', title: 'Out last: the most grip - and now and then traffic or a yellow flag' } },
  tow: { none: { name: 'No tow' }, give: { name: 'Tows the other car', title: 'This car gives its team-mate a slipstream: the team-mate quicker, this one slower' } },
};
export const defaultQuali = () => ({ runs: 'two', timing: 'early', tow: 'none' });
/**
 * The qualifying plans onto the two cars: cars [car, car], plans { name: { runs, timing, tow } }, sets { name: sets }
 * -> lines for the pit wall (what happened)
 */
export function applyQuali(cars, plans, sets) {
  const out = [];
  for (const c of cars) {
    const p = plans?.[c.name] || defaultQuali(), R = QUALI.runs[p.runs] || QUALI.runs.two, sur = c.name.split(' ').pop();
    let k = R.perf;
    if (p.timing === 'late') { if (Math.random() < 0.15) { k *= 0.995; out.push(`${sur}: caught in traffic on the late run.`); } else { k *= 1.0012; out.push(`${sur}: the late run found the grip.`); } }
    const mate = cars.find((x) => x !== c), mp = mate && (plans?.[mate.name] || defaultQuali());
    if (p.tow === 'give' && mate) k *= 0.9992;
    if (mp?.tow === 'give' && p.tow !== 'give') { k *= 1.0012; out.push(`${sur} gets a tow from ${mate.name.split(' ').pop()}.`); }
    c.perf *= k;
    for (let i = 0; i < R.sets; i++) useSet(sets?.[c.name], c.tyres.compound, 0.12, true);
    if (R.sets === 1) out.push(`${sur}: one run, a set of softs saved.`);
  }
  return out;
}
