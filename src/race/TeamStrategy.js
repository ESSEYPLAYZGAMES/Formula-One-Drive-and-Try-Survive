// The team principal's strategy during the race (main.js TP, ui/PitWall.js):
//
// RE-PLAN. The rest of the race worked out again from where the car is: the set it is on and its wear, the laps left,
// the sets still in its allocation, the track's wetness, the stop the rules still want - no stop, one or two, each timed
// lap by lap with the tyre model the cars race on (vehicle/Tyres.js) - and the quickest of each offered in turn.
//
// THE STRATEGIST'S ALERTS (for a car whose calls are yours or the plan's - the AI strategist acts on its own): the
// undercut on the car ahead is on (the AI's own sums: AIDriver.undercutOn); a rival just behind has stopped (cover it?:
// AIDriver.watchRivals); the rain is coming, the track is wet enough for intermediates, or dry enough for slicks
// (race/Weather.js outlook). Each a question on the car's card: YES boxes the car for the tyre named.
import { COMPOUNDS, lapLoss, outLapLoss, RATE_NOM } from '../vehicle/Tyres.js';

const LET = { SOFT: 'S', MEDIUM: 'M', HARD: 'H', INTER: 'I', WET: 'W' };
const basePace = (comp, lapT, W) => { const s = COMPOUNDS[comp], grip = s.grip * (1 - W) + s.wetGrip * W * s.grip, g = 1 - grip; return lapT * (0.405 * g + 1.53 * g * g); };
/**
 * The plans from here. o: { car, d (RaceDirector), sets, pitLoss, mustStop } -> [{ label, stops, time, stints }] the
 * quickest with no stop, one and two (those possible), quickest first; stints as the pit wall's plan has them (one per
 * stop already made, then the rest: { compound, start, end } - end: the lap it boxes on)
 */
export function replan(o) {
  const c = o.car, d = o.d, L = d.track.length, lapT = d.world.lapT || 90, rl = c.raceLaps || d.lapsTotal, TS = Object.getPrototypeOf(c.tyres).constructor;
  const left = d.lapsTotal - c.lap, lapNow = c.lap + 1, W = d.weather ? d.weather.tyreWet : 0;
  const comps = (W > 0.62 ? ['WET', 'INTER'] : W > 0.27 ? ['INTER', 'WET'] : ['SOFT', 'MEDIUM', 'HARD']).filter((k) => (o.sets?.[k] || []).length);
  const per = (comp) => (RATE_NOM * 1.05 / (new TS(comp, rl, L).lifeMeters / L)) * (c.wearMul || 1) * (COMPOUNDS[comp].dryWear && W < COMPOUNDS[comp].wetFrom ? 1 + (COMPOUNDS[comp].dryWear - 1) * (1 - W / COMPOUNDS[comp].wetFrom) : 1);
  const cur = c.tyres.compound, p0 = c.ai?._wPerLap > 0 && c.ai._wTyres === c.tyres ? c.ai._wPerLap : per(cur);
  // a stint's time over n laps from wear w0 (a set worn through is not a plan)
  const stint = (comp, w0, p, n, fresh) => { let t = fresh ? outLapLoss(comp, lapT) : 0; for (let j = 1; j <= n; j++) { const w = w0 + j * p; if (w > 0.97) return Infinity; t += lapLoss(comp, w - p * 0.5, rl) + basePace(comp, lapT, W); } return t; };
  const setW = (comp, used = []) => { const a = (o.sets?.[comp] || []).slice().sort((x, y) => x - y); return a[used.filter((u) => u === comp).length]; };
  const out = [];
  const add = (stops, time) => { if (isFinite(time)) out.push({ stops, time }); };
  if (left <= 0) return [];
  if (!o.mustStop) add([], stint(cur, c.tyres.wear, p0, left, false));
  for (let k = 0; k < left; k++) for (const X of comps) {
    const wx = setW(X); if (wx == null) continue;
    const t1 = stint(cur, c.tyres.wear, p0, k, false) + o.pitLoss + stint(X, wx, per(X), left - k, true);
    add([{ lap: lapNow + k, compound: X }], t1);
    if (left - k >= 4) for (let j = k + 2; j < left; j++) for (const Y of comps) {
      const wy = setW(Y, [X]); if (wy == null) continue;
      add([{ lap: lapNow + k, compound: X }, { lap: lapNow + j, compound: Y }], stint(cur, c.tyres.wear, p0, k, false) + o.pitLoss + stint(X, wx, per(X), j - k, true) + o.pitLoss + stint(Y, wy, per(Y), left - j, true));
    }
  }
  const best = [0, 1, 2].map((n) => out.filter((x) => x.stops.length === n).sort((a, b) => a.time - b.time)[0]).filter(Boolean).sort((a, b) => a.time - b.time);
  return best.map((x, i) => {
    const stints = Array.from({ length: c.pitStops }, () => ({ compound: cur, start: 1, end: 0 }));
    let from = lapNow, comp = cur;
    for (const s of x.stops) { stints.push({ compound: comp, start: from, end: s.lap }); from = s.lap + 1; comp = s.compound; }
    stints.push({ compound: comp, start: from, end: d.lapsTotal });
    const label = x.stops.length ? x.stops.map((s) => `box lap ${s.lap} for ${LET[s.compound]}`).join(', then ') : 'no stop: to the flag on this set';
    return { name: `Re-plan ${'ABC'[i]}`, label, stops: x.stops, time: x.time, delta: x.time - best[0].time, stints };
  });
}

/**
 * The strategist's questions, twice a second. o: { d, cars, sets(car), ask(car, { key, text, yes, comp }), say(who, text) }
 * - ask puts the question on the car's card (once per key); say is the radio
 */
export function alerts(o) {
  const d = o.d; if (d.mode !== 'race' || !d.world.racing || d.done) return;
  const wx = d.weather, W = wx ? wx.tyreWet : 0, green = !d.sc || d.sc.phase === 'green';
  // ---- the sky, for the whole pit wall
  if (wx && !wx.fixed) {
    const O = wx.outlook(300), T = o.state;
    if (O.p >= 0.4 && O.eta > 20 && W < 0.2 && (T.rainAt == null || d.time - T.rainAt > 150)) {
      T.rainAt = d.time; const laps = O.eta / (d.world.lapT || 90);
      o.say('Weather', `Rain ${laps < 0.8 ? 'within the lap' : `in about ${laps.toFixed(laps < 3 ? 1 : 0)} laps`}: ${Math.round(O.p * 100)}% on the radar${O.peak > 0.5 ? ', and heavy' : ''}${O.at ? `, first at Turn ${O.at}` : ''}.`);
    }
  }
  for (const c of o.cars) {
    const m = c.mgr; if (!m || c.retired || c.finished || c.inPit || c.pitLane || c.pitRequested || m.alert) continue;
    const ai = c.ai, left = d.lapsTotal - c.lap, rain = c.tyres.compound === 'INTER' || c.tyres.compound === 'WET', sets = o.sets(c) || {};
    const has = (k) => (sets[k] || []).length > 0;
    // ---- the wrong tyre for the track
    if (left >= 1.5) {
      if (!rain && W > 0.3) { const k = W > 0.62 && has('WET') ? 'WET' : has('INTER') ? 'INTER' : null; if (k) { o.ask(c, { key: `wet${c.pitStops}`, text: `The track is wet enough for ${k === 'WET' ? 'full wets' : 'intermediates'}. Box?`, comp: k }); continue; } }
      if (rain && W < 0.18 && !(wx && wx.outlook(120).p > 0.5)) { const k = ai?.slickFor ? ai.slickFor(left) : 'MEDIUM', kk = has(k) ? k : ['SOFT', 'MEDIUM', 'HARD'].find(has); if (kk) { o.ask(c, { key: `dry${c.pitStops}`, text: `A dry line: time for slicks (${kk.toLowerCase()}s). Box?`, comp: kk }); continue; } }
    }
    if (m.calls === 'ai' || !ai || !green || left < 2.5) continue;
    // ---- the undercut on the car ahead; a rival's stop to cover (the AI's own sums)
    if (!ai.strat) continue;
    const next = (() => { const k = ai.nextCompound(left); return has(k) ? k : ['SOFT', 'MEDIUM', 'HARD', 'INTER', 'WET'].find(has); })();
    if (!next) continue;
    const u = ai.undercutOn(d.world, left);
    if (u) { const g = ai.lastUndercut; o.ask(c, { key: `uc${c.lap}|${u.name}`, text: `The undercut on ${u.name.split(' ').pop()} is on: about ${Math.max(0.1, g.gain - g.gap).toFixed(1)} s in hand. Box for ${next.toLowerCase()}s?`, comp: next }); continue; }
    if (ai.watchRivals(d.world, left)) { const r = ai.coverOf; o.ask(c, { key: `cv${c.lap}`, text: `${r ? r.name.split(' ').pop() : 'The car behind'} has boxed behind us. Cover the undercut (${next.toLowerCase()}s)?`, comp: next }); }
  }
}
