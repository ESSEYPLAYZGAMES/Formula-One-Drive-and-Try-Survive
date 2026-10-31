// Strategy calls, the race's and every team's: what each car set out to do (its plan on the grid - the gamble on a
// safety car above all), every stop (when, why, onto what, from where), and the calls a pit wall got wrong (a car left
// out a lap too long, a set fitted that would not last - AIDriver.strategy rolls them by the team's tier, main.js
// strategyCalls for your own pit wall). At the flag the stories are worked out: a gamble that paid or backfired, a stop
// a lap before the safety car, an undercut that worked or fell short, the late call and the wrong tyres and what they
// cost. They go to the results (main.js raceFacts), the paddock news and the press (career/Career.js applyRace) and the
// post-race interview (ui/Interview.js) when the story is yours.

/** how likely a pit wall gets a call wrong at a stop, by the team's tier (1: the front-runners) */
export const FAULT_P = { 1: 0.05, 2: 0.09, 3: 0.14 };

const sur = (c) => String(c?.name || '').split(' ').pop();

export class StrategyCalls {
  constructor(d) { this.d = d; this.plans = []; this.stops = []; this.faults = []; this.pos = new Map(); this.gaps = new Map(); }
  /** a car's plan on the grid (AIDriver.planRace) */
  plan(car, type, comp) { this.plans.push({ car, type, comp }); }
  /** a car's place now and its gap to the car ahead (every lap it completes, RaceDirector.onLine) */
  lap(car) {
    let a = this.pos.get(car), g = this.gaps.get(car); if (!a) this.pos.set(car, a = []); if (!g) this.gaps.set(car, g = []);
    const i = this.d.positions.indexOf(car), ahead = this.d.positions[i - 1]; a[car.lap] = i + 1;
    g[car.lap] = ahead ? this.d.radio?.gap(car, ahead) ?? null : null;
  }
  /** a stop begins: why, onto what, from where */
  stop(car, o = {}) {
    this.stops.push({ car, lap: car.lap + 1, at: this.d.time, reason: o.reason || 'tyres', from: car.tyres.compound, to: o.to || car.tyres.compound, wear: car.tyres.wear,
      before: this.d.positions.indexOf(car) + 1, rival: o.rival || null, neutral: this.d.sc && this.d.sc.phase !== 'green' });
  }
  /** a call a pit wall got wrong: 'late' (left out a lap too long), 'tyre' (a set that will not last) */
  fault(car, what, o = {}) { if (!this.faults.some((f) => f.car === car && f.what === what && f.lap === car.lap + 1)) this.faults.push({ car, what, lap: car.lap + 1, before: this.d.positions.indexOf(car) + 1, ...o }); }

  /** the car you were chasing when you stopped, if it stopped 1-4 laps after you on the same tyres' stint and you were within 2.5 s */
  ownUndercut(c, s) {
    const k = s.lap - 1, a = this.pos.get(c), g = this.gaps.get(c), p0 = a?.[k];
    if (!p0 || p0 < 2 || !(g?.[k] > 0 && g[k] < 2.5)) return null;
    let r = null; for (const [o, b] of this.pos) if (o !== c && b[k] === p0 - 1) { r = o; break; }
    if (!r || r.retired) return null;
    const n = (car, t) => this.stops.filter((x) => x.car === car && x.at < t).length;
    if (n(r, s.at) !== n(c, s.at)) return null;
    const rs = this.stops.find((x) => x.car === r && x.at > s.at);
    return rs && rs.lap - s.lap >= 1 && rs.lap - s.lap <= 4 && !rs.neutral ? r : null;
  }
  /** the race's strategy stories, the biggest first: [{ kind, car, good, score, text, mine, team, pos, n?, rival?, comp?, extra? }] */
  stories() {
    const d = this.d, out = [], fin = (c) => d.positions.indexOf(c) + 1, L = d.lapsTotal;
    const scAt = (d.sc?.log || []).filter((e) => /SAFETY CAR DEPLOYED|VIRTUAL SAFETY CAR/.test(e[1])).map((e) => e[0]);
    const stopsOf = (c) => this.stops.filter((s) => s.car === c);
    const posAt = (c, lap) => { const a = this.pos.get(c) || []; for (let k = Math.min(lap, a.length - 1); k >= 0; k--) if (a[k]) return a[k]; return c.gridPos || fin(c); };
    // (o: what the press needs to tell it - n places won or lost, pos at the flag, the rival, the compound)
    const add = (car, kind, good, score, text, o = {}) => { if (!car || car.isSC) return; out.push({ kind, car, good, score: score + (fin(car) <= 10 ? 2 : 0) + (car.isPlayer ? 6 : 0), text, mine: !!car.isPlayer, team: car.team, pos: fin(car), ...o }); };
    for (const c of d.cars) {
      if (c.retired && c.lap < L * 0.6) continue;   // (out early: whatever the plan was, it never played out)
      const S = stopsOf(c), p = fin(c), grid = c.gridPos || p, plan = this.plans.find((x) => x.car === c);
      // the gamble on a safety car
      if (plan?.type === 'gamble') {
        const cheap = S.find((s) => s.reason === 'cheap' || s.neutral);
        if (cheap && grid - p >= 3) add(c, 'gamblePaid', true, 4 + (grid - p), `${c.team}'s safety-car gamble pays off: ${sur(c)} from P${grid} to P${p} on one cheap stop`, { n: grid - p });
        else if (!cheap) { const last = S[S.length - 1]; if (last && last.lap >= L - 2 && p - last.before >= 3) add(c, 'gambleFailed', false, 3 + (p - last.before), `No safety car for ${sur(c)}: ${c.team}'s gamble ends with a last-lap stop, P${last.before} to P${p}`, { n: p - last.before }); }
      }
      for (const s of S) {
        // (your own stops carry no plan: one made from close behind a car that pitted a lap or more later was an undercut)
        if (c.isPlayer && !s.rival && s.reason !== 'undercut' && !s.neutral) { const r = this.ownUndercut(c, s); if (r) { s.reason = 'undercut'; s.rival = r; } }
        // a stop a lap before the safety car came out (and no second, cheap one under it)
        const ts = scAt.find((t) => t > s.at && t - s.at < 60);
        if (ts != null && !s.neutral && !S.some((o) => o !== s && o.at > ts && o.at - ts < 120) && p - s.before >= 2) add(c, 'unlucky', false, 2 + (p - s.before), `Bad timing for ${sur(c)}: pitted just before the safety car and dropped from P${s.before} to P${p}`, { n: p - s.before });
        // the undercut: ahead of the car it went for once that car has stopped too?
        if (s.reason === 'undercut' && s.rival && !s.rival.retired) {
          const r = s.rival, rs = stopsOf(r).find((o) => o.at > s.at);
          if (rs) { const ahead = fin(c) < fin(r); add(c, ahead ? 'undercutWon' : 'undercutFailed', ahead, ahead ? 3 : 2, ahead ? `${c.team}'s undercut works: ${sur(c)} jumps ${sur(r)} in the stops` : `${sur(c)}'s undercut on ${sur(r)} falls short`, { rival: r }); }
        }
      }
      // the pit wall's mistakes, and what they cost
      for (const f of this.faults.filter((x) => x.car === c)) {
        const s = S.find((o) => o.lap >= f.lap), lost = (s ? posAt(c, s.lap + 2) : p) - f.before;
        if (f.what === 'late') add(c, 'late', false, 2 + Math.max(0, lost) * 1.5, lost >= 1 ? `${c.team} leave ${sur(c)} out a lap too long - ${lost} place${lost > 1 ? 's' : ''} gone` : `${c.team} keep ${sur(c)} out a lap too long on worn tyres`, lost >= 1 ? { n: lost } : {});
        else if (f.what === 'tyre') { const extra = S.filter((o) => o.lap > f.lap).length; add(c, 'tyre', false, 2 + extra * 2 + Math.max(0, p - f.before), `Wrong tyres from ${c.team}: ${sur(c)}'s ${String(f.comp || 'new').toLowerCase()}s fall away${extra ? ', an extra stop' : ''} (P${p})`, { comp: f.comp, extra }); }
      }
    }
    return out.sort((a, b) => b.score - a.score);
  }
}
