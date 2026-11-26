// The rival pit walls against you. Every car has its own plan (ai/AIDriver.js strategy: when its tyres say so, a
// cover, an undercut, the safety car) - made for the race as a whole, the same against anyone. This is what a rival
// team does about YOU: your car in a race you drive, your two cars in a race you run from the pit wall.
//   - Your crew comes out (a stop called, the car still on the road): the car just ahead of you is called in on the
//     same lap to cover - by a sharp pit wall nearly always, by a dull one now and then. Call the stop off and a sharp
//     wall calls theirs off too, if there is road left before the pit entry; the others come in for nothing (the
//     dummy), and a wall that has bitten once looks twice the next time.
//   - You stop, a rival close behind: it stays out and pushes for a lap or two on the clear road (the overcut), then
//     stops for a tyre a step softer than yours where one reaches the flag.
//   - A rival held up behind you: it stops early to get past in the pits (the undercut), sooner than its own plan
//     would; its team-mate behind it is left out long - two cars, two races against yours.
//   - Under the safety car, the rival right behind you does the opposite of what you do.
//   - The stop that covers yours takes your tyre where it reaches the flag.
// How sharp a wall is: the team's strategist in a team principal's career (career/Rivals.js), else the team's tier.
// It draws random numbers only when one of these comes up (a race you take no part in is the race without this), and
// says what it did: d.onRivalMove(text, kind, rival, yours) - the engineer in the car, the pit wall's radio.
import { cliffLaps, lapLoss } from '../vehicle/Tyres.js';

const SOFTER = { HARD: 'MEDIUM', MEDIUM: 'SOFT' };
const sur = (c) => String(c.name || '').split(' ').pop();

export class RivalWall {
  constructor(d) { this.d = d; this.t = 0; this.calls = new Map(); this.bitten = new Map(); this.log = []; this.scN = null; this.scSeen = new Map(); }
  /** how sharp this car's pit wall is, 0.3 .. 0.95 */
  sharp(c) { return Math.max(0.3, Math.min(0.95, c.stratK ?? [0.85, 0.7, 0.55, 0.45][c.tier] ?? 0.6)); }
  /** your cars still racing (never a car parked or laps down: a race you are not in is left alone) */
  yours() {
    const d = this.d, lead = d.positions?.[0]?.lap ?? 0;
    return d.cars.filter((c) => (c.isPlayer || c.mgr || c.rwTarget) && !c.retired && !c.finished && !(c.ghost > 60) && !c.hiddenAway && (c.lap ?? 0) >= lead - 1);   // (rwTarget: a test's stand-in for you)
  }
  say(text, kind, c, T) { this.log.push({ t: this.d.time, kind, c: c.short, T: T.short, text }); if (this.log.length > 60) this.log.shift(); this.d.onRivalMove?.(text, kind, c, T); }
  st(c) { return c._rw || (c._rw = { stuck: 0, stuckOn: null }); }

  update(dt) {
    const d = this.d, W = d.world; if (!W || !W.racing || d.done || d.mode !== 'race' || !d.pit) return;
    this.t -= dt; if (this.t > 0) return; this.t = 0.5;
    const Y = this.yours(); if (!Y.length) return;
    const green = !d.sc || !d.sc.phase || d.sc.phase === 'green', L = d.track.length, lapT = W.lapT || 90, loss = W.pitLoss || 22;
    const rivals = d.cars.filter((c) => !c.isPlayer && !c.mgr && !c.rwTarget && c.ai && !c.ai.isSC && !c.retired && !c.finished && !c.inPit && !c.pitLane);
    const toEntry = (c) => { let x = d.pit.entryS - c.s; x = ((x % L) + L) % L; return x; };
    for (const T of Y) {
      const lapsLeft = W.lapsTotal - T.lap; if (lapsLeft < 1.5) continue;
      // ---- your crew is out: a stop called, the car still on the road
      const calling = T.pitRequested && !T.pitLane && !T.inPit && !T.dtCalled;   // (not a drive-through: nothing to cover)
      let call = this.calls.get(T);
      if (calling && !call && green) { call = { t: d.time, stops: T.pitStops, took: [], long: [] }; this.calls.set(T, call); this.crewOut(T, call, rivals, toEntry, lapsLeft, lapT); }
      else if (!calling && call) {
        this.calls.delete(T);
        if (T.pitLane || T.inPit || T.pitStops > call.stops) this.stopped(T, call, rivals, lapsLeft);
        else this.dummy(T, call, toEntry);
      }
      if (!green) { this.safetyCar(T, rivals, toEntry, lapsLeft); continue; }
      // ---- held up behind you: the undercut, sooner than its plan; its team-mate behind it left out long
      for (const c of rivals) {
        const S = this.st(c), g = W.gap?.(c, T);   // (+: you are ahead of it by g)
        if (g == null || g <= 0 || g > 1.6 || c.pitStops !== T.pitStops || c.pitRequested) { if (S.stuckOn === T) { S.stuck = 0; S.stuckOn = null; } continue; }
        S.stuckOn = T; S.stuck += 0.5;
        const k = this.sharp(c), a = c.ai, t = c.tyres;
        if (S.stuck < 55 - 30 * k || S.triedLap === c.lap || t.wear < 0.22 || lapsLeft < 3 || !a.strat || a.strat.type === 'gamble') continue;
        S.triedLap = c.lap;
        // (its own sums - AIDriver.undercutOn - with the bar a pit wall sets for a car going nowhere: any gain at all)
        const keep = [a.strat.under, a.strat.wear]; a.strat.under = 0.25 - 0.5 * k; a.strat.wear = Math.min(a.strat.wear, t.wear + 0.2);
        let on = null; try { on = a.undercutOn(W, W.lapsTotal - c.lap); } finally { a.strat.under = keep[0]; a.strat.wear = keep[1]; }
        if (on !== T || toEntry(c) < 150) continue;
        c.pitRequested = true; a.pitReason = 'undercut'; a.pitPlan = { compound: this.tyreFor(c, W.lapsTotal - c.lap, null), repair: 'none' }; S.stuck = 0;
        this.say(`${sur(c)} is coming in from behind ${T.isPlayer ? 'us' : sur(T)}: ${c.team} are going for the undercut.`, 'undercut', c, T);
        const mate = rivals.find((m) => m !== c && m.team === c.team && m.pitStops === c.pitStops && !m.pitRequested && (W.gap?.(m, T) ?? -1) > 0 && (W.gap?.(m, T) ?? 99) < 6);
        if (mate && mate.ai.strat && mate.tyres.wear < 0.5) { mate.ai.strat.wear = Math.max(mate.ai.strat.wear, 0.7); mate.ai.strat.under = null; mate.ai.strat.cover = 0; this.say(`${c.team} have split their cars: ${sur(mate)} stays out long.`, 'split', mate, T); }
      }
    }
    // ---- the overcut's push, while it lasts; the softer tyre for the stop after yours
    for (const c of rivals) {
      const S = c._rw; if (!S) continue;
      if (S.pushUntil != null && (d.time > S.pushUntil || !green)) { S.pushUntil = null; c.wallPace = 1; }
      if (S.softerThan && c.pitRequested && c.ai.pitPlan && !S.softDone) {
        S.softDone = true; const want = SOFTER[S.softerThan], left = W.lapsTotal - c.lap;
        if (want && !['INTER', 'WET'].includes(c.ai.pitPlan.compound) && cliffLaps(want, c.raceLaps) >= left - 0.3 && want !== c.tyres.compound) c.ai.pitPlan.compound = want;
        S.softerThan = null;
      }
    }
  }

  /** the dry tyre for a rival's stop now: yours where it reaches the flag (mirror), else the softest that does */
  tyreFor(c, lapsLeft, mirror) {
    const own = c.ai.nextCompound(lapsLeft); if (own === 'INTER' || own === 'WET') return own;
    if (mirror && mirror !== 'INTER' && mirror !== 'WET' && cliffLaps(mirror, c.raceLaps) >= lapsLeft - 0.3 && (c.pitStops > 0 || mirror !== c.tyres.compound)) return mirror;
    if (c.pitStops === 0 && own === c.tyres.compound) return own === 'HARD' ? 'MEDIUM' : own === 'MEDIUM' ? 'HARD' : 'MEDIUM';   // (two compounds in a dry race)
    return own;
  }

  /** your crew has come out: who is called in to cover */
  crewOut(T, call, rivals, toEntry, lapsLeft, lapT) {
    const d = this.d, W = d.world, mine = T.pitPlan?.compound || null;
    if (lapsLeft < 2 || toEntry(T) < 200) return;   // (called at the pit entry: no one has time to answer)
    // (the nearest first; one car a team: its other car is left out - two cars, two answers)
    const near = rivals.map((c) => [c, W.gap?.(T, c)]).filter((x) => x[1] != null && x[1] > 0 && x[1] <= 3.5).sort((x, y) => x[1] - y[1]);
    for (const [c, g] of near) {
      if (c.pitStops !== T.pitStops || c.pitRequested || call.took.some((x) => x.team === c.team)) continue;
      const a = c.ai, t = c.tyres, k = this.sharp(c), left = W.lapsTotal - c.lap;
      if (t.wear < 0.2 || left < 2 || toEntry(c) < 180 || a.strat?.type === 'gamble') continue;
      // (does your stop threaten it? its old set's loss and the compounds against the gap - as it reckons any undercut)
      const theirs = mine || a.nextCompound(left);
      const threat = a.basePace(t.compound, lapT) - a.basePace(theirs, lapT) + lapLoss(t.compound, t.wear + 0.5 * a.perLap(), t.raceLaps) - lapLoss(theirs, 0.03, c.raceLaps);
      if (threat < g - 0.6) continue;
      // (a wall that has bitten on a dummy of yours looks twice)
      const p = (0.2 + 0.75 * k) * (this.bitten.get(c.team) ? 0.4 : 1);
      if (Math.random() > p) continue;
      c.pitRequested = true; a.pitReason = 'cover'; a.coverOf = T; a.pitPlan = { compound: this.tyreFor(c, left, mine), repair: 'none' };
      call.took.push(c);
      this.say(`${c.team} have seen ${T.isPlayer ? 'our' : `${sur(T)}'s`} crew come out: ${sur(c)} is called in to cover.`, 'cover', c, T);
    }
  }
  /** you called it off: the sharp ones call theirs off too, the others have stopped for nothing */
  dummy(T, call, toEntry) {
    for (const c of call.took) {
      if (c.retired || !c.ai) continue;
      if (!c.pitRequested || c.pitLane || c.inPit) { this.bit(c, T); continue; }
      if (toEntry(c) > 220 && Math.random() < this.sharp(c)) { c.pitRequested = false; c.ai.pitPlan = null; c.ai.pitReason = null; this.say(`${sur(c)} stays out as well: ${c.team} were not fooled.`, 'called-off', c, T); }
      else this.bit(c, T);
    }
  }
  bit(c, T) { this.bitten.set(c.team, (this.bitten.get(c.team) || 0) + 1); this.say(`${sur(c)} is in the pits and ${T.isPlayer ? 'we' : sur(T)} stayed out: ${c.team} took the dummy.`, 'dummy', c, T); }
  /** you really stopped: the rivals close behind stay out and push (the overcut), and stop later for a softer tyre */
  stopped(T, call, rivals, lapsLeft) {
    const d = this.d, W = d.world, lapT = W.lapT || 90;
    this.bitten.clear();
    const mine = T.pitPlan?.compound || T.ai?.pitPlan?.compound || T._stopPlan?.compound || T.tyres?.compound || null;
    for (const c of rivals) {
      if (call.took.includes(c) || c.pitRequested || c.pitStops !== call.stops) continue;
      const g = W.gap?.(c, T);   // (+: you were ahead of it by g) - you are in the lane now: by the order
      const P = d.positions, behind = P.indexOf(c) > P.indexOf(T) ? P.indexOf(c) - P.indexOf(T) : 0;
      if (!((g != null && g > 0 && g < 3) || (g == null && behind > 0 && behind <= 1))) continue;
      const a = c.ai, t = c.tyres, k = this.sharp(c), S = this.st(c);
      if (!a.strat || t.wear > 0.5 || W.lapsTotal - c.lap < 3 || Math.random() > 0.35 + 0.5 * k) continue;
      // (out for a lap or two more, flat out on the clear road: a little pace for its tyres)
      a.strat.cover = 0; a.strat.wear = Math.max(a.strat.wear, Math.min(0.72, t.wear + 0.22)); a._coverK = 1;
      c.wallPace = 1 + 0.003 + 0.003 * k; S.pushUntil = d.time + lapT * 1.6; S.softerThan = mine; S.softDone = false;
      this.say(`${sur(c)} stays out behind ${T.isPlayer ? 'us' : sur(T)} and is pushing: ${c.team} are trying the overcut.`, 'overcut', c, T);
    }
  }
  /** the safety car: the rival right behind you does the opposite of what you do, once a neutralisation */
  safetyCar(T, rivals, toEntry, lapsLeft) {
    const d = this.d, W = d.world, sc = W.sc; if (!sc?.cheapStop || lapsLeft < 2) return;
    if (this.scN !== sc.neutralT) { this.scN = sc.neutralT; this.scSeen.clear(); }
    const seen = this.scSeen.get(T) || {}; this.scSeen.set(T, seen);
    const te = toEntry(T), inLane = T.pitLane || T.inPit;
    let doing = null;
    // (staying out is read as you come up to the entry with no crew in your box: once you are past it the car behind is past its own chance)
    if (inLane || (T.pitRequested && te < 600)) doing = 'pit'; else if (!T.pitRequested && te < 270 && te > 50) doing = 'stay';
    seen.te = te; if (!doing || seen.done) return; seen.done = true;
    const P = d.positions, me = P.indexOf(T), c = P.slice(me + 1, me + 3).find((x) => rivals.includes(x));
    if (!c) return; const a = c.ai, t = c.tyres, k = this.sharp(c), left = W.lapsTotal - c.lap;
    if (Math.random() > 0.25 + 0.6 * k) return;
    const owes = !!W.stopRule && c.pitStops === 0 && !c.usedRain && !W.weather?.everWet;
    if (doing === 'pit') {
      if (owes || t.wear > 0.45 || t.wear + a.perLap() * left > 0.8) return;   // (it needs the stop itself)
      if (c.pitRequested && a.pitReason === 'cheap' && toEntry(c) > 120) { c.pitRequested = false; a.pitPlan = null; a.pitReason = null; }
      else if (c.pitRequested) return;
      a._stopN = sc.neutralT;   // (no cheap stop for it under this one: AIDriver.scStop)
      this.say(`${sur(c)} stays out as ${T.isPlayer ? 'we' : sur(T)} stop${T.isPlayer ? '' : 's'}: ${c.team} take the track position.`, 'sc-stay', c, T);
    } else {
      if (c.pitRequested || t.wear < 0.15 || left < 3 || toEntry(c) < 150 || a._stopN === sc.neutralT) return;
      c.pitRequested = true; a.pitReason = 'cheap'; a.pitPlan = { compound: this.tyreFor(c, left, null), repair: 'none' };
      this.say(`${sur(c)} is in behind ${T.isPlayer ? 'us' : sur(T)} for new tyres: ${c.team} do the opposite.`, 'sc-pit', c, T);
    }
  }
}
