// Timing loops and the engineer's briefings.
//
// Every car's time is taken at 20 loops round the lap (like the real timing loops), so a gap between two cars is
// the time between them passing the same point - not a distance guessed into seconds. Five times a lap the engineer
// tells the player the one thing that matters most right now, in this order of interest: penalties around them on
// corrected time ("4.2 ahead with 5 seconds: stay within 5 and you beat him"), places to be given back, a fight with
// the car ahead or behind (gap and whether it is closing), the tyres, rivals' stops, track-limit warnings, and
// otherwise the gaps either side. The same subject is not repeated twice running unless it is urgent.
const N = 20;              // timing loops per lap
const BRIEF_EVERY = 4;     // a briefing at every 4th loop: five a lap

export class RaceRadio {
  constructor(director) {
    this.d = director; this.loops = new Map(); this.lastCat = null; this.mem = new Map(); this.said = new Map();
  }
  update() {
    const d = this.d, L = d.track.length, seg = L / N;
    if (!d.world.racing) return;
    for (const c of d.cars) {
      if (c.retired || !isFinite(c.lapDist)) continue;
      const idx = Math.floor((c.lap * L + c.lapDist) / seg);
      let r = this.loops.get(c);
      if (!r) { this.loops.set(c, (r = { idx, t: new Map() })); continue; }
      if (idx <= r.idx) continue;
      if (idx - r.idx > 4) { r.idx = idx; continue; }   // (a jump: a reset, the pit lane cut across the line)
      for (let k = r.idx + 1; k <= idx; k++) r.t.set(k, d.time);
      r.idx = idx;
      if (r.t.size > 3 * N) for (const k of r.t.keys()) { if (k < idx - 3 * N) r.t.delete(k); else break; }
      if (c === d.player && idx % BRIEF_EVERY === 2) this.brief();
    }
  }
  /** time gap (s) from car a to car b: + when b is ahead of a; null when it is not known (yet) */
  gap(a, b) {
    const ra = this.loops.get(a), rb = this.loops.get(b); if (!ra || !rb) return null;
    if (rb.idx >= ra.idx) { const ta = ra.t.get(ra.idx), tb = rb.t.get(ra.idx); return ta != null && tb != null ? ta - tb : null; }
    const ta = ra.t.get(rb.idx), tb = rb.t.get(rb.idx); return ta != null && tb != null ? -(tb - ta) : null;
  }

  /** the briefing: candidates scored by how much they matter to the player now, the best one is said */
  brief() {
    const d = this.d, p = d.player, E = d.engineer;
    if (!E || !p || p.retired || p.finished || p.pitLane || p.inPit || d.mode !== 'race') return;
    if (d.time - (d.world.raceStart ?? 0) < 25) return;
    const pos = d.positions, i = pos.indexOf(p), L = d.track.length;
    const name = (c) => c.name.split(' ').pop(), f1 = (x) => Math.abs(x).toFixed(1);
    const near = pos.filter((c, k) => c !== p && !c.retired && Math.abs(k - i) <= 4);
    const items = [];
    // (a subject said in the last 75 s - the same category about the same car - drops well down the list: news
    //  first, the same reminder once a lap at most)
    const add = (cat, score, text, about = null) => {
      const key = `${cat}:${about ? about.short : ''}`, ago = d.time - (this.said.get(key) ?? -1e9);
      items.push({ cat, key, text, score: score - (cat === this.lastCat && score < 8 ? 3 : 0) - (ago < (score >= 5 ? 75 : 160) ? 6 : 0) });
    };

    // ---- penalties, on corrected time
    for (const o of near) {
      const g = this.gap(p, o); if (g == null || Math.abs(g) > 15) continue;
      const po = o.penalties || 0, pm = p.penalties || 0; if (!po && !pm) continue;
      const corr = g - po + pm;   // + : o still ahead after both penalties
      if (g > 0 && po > 0) add('pen', g < po + 4 ? 9 : 4, `${name(o)} is ${f1(g)} ahead but has ${po} seconds of penalty. ${corr < 0 ? `On corrected time you're ahead by ${f1(corr)}, just stay with him.` : `Get within ${po - pm > 0 ? po - pm : po} and that place is yours at the flag.`}`, o);
      else if (g < 0 && po > 0) add('pen', -g < 3 ? 6 : 3, `${name(o)}, ${f1(g)} behind, has a ${po} second penalty. He'd need to beat you by more than ${po} on the road.`, o);
      else if (g < 0 && pm > 0) add('pen', 9, `We've got ${pm} seconds to serve. ${name(o)} is ${f1(g)} behind, ${-g < pm ? `inside it, so he's ahead on corrected time. Push, we need ${f1(pm + g)} more.` : `keep the gap above ${pm} and we keep the place.`}`, o);
      else if (g > 0 && pm > 0 && g < 6) add('pen', 5, `Remember the ${pm} seconds. Passing ${name(o)} isn't enough, we need to be ${pm} clear of him.`, o);
    }
    // ---- places to be given back (the stewards' off-track rulings)
    for (const q of d.stewards.offPasses) {
      if (q.stage === 'order' && near.includes(q.passer) && q.passed !== p && q.passer !== p) add('give', 5, `${name(q.passer)} still has to give a place back to ${name(q.passed)}.`);
      if (q.stage === 'inv' && (q.passer === p)) add('give', 8, `They're looking at your move on ${name(q.passed)} off the track. If they tell us, we give it back.`);
    }
    // ---- the fight either side
    const ahead = pos[i - 1], behind = pos[i + 1];
    if (ahead && !ahead.retired) {
      const g = this.gap(p, ahead), m = this.trend('a', ahead, g);
      if (g != null && g < 1.6) add('fight', 7, `${name(ahead)} ${f1(g)} ahead${m != null ? `, ${m > 0.05 ? `you're ${f1(m)} quicker since the last call` : m < -0.05 ? `he's pulling away, ${f1(m)}` : 'gap steady'}` : ''}.${g < 1 ? ' DRS range, line it up for the straight.' : ''}`);
      else if (g != null && m != null && m > 0.25) add('fight', 5, `Gap to ${name(ahead)} ${f1(g)}, you're taking ${f1(m)} out of him.`);
    }
    if (behind && !behind.retired) {
      const g = this.gap(p, behind), m = this.trend('b', behind, g);
      if (g != null && -g < 1.2) add('fight', 7, `${name(behind)} ${f1(g)} behind${m != null && m < -0.05 ? `, closing ${f1(m)}` : ''}. ${-g < 0.8 ? 'He has DRS, protect the inside into the braking zones.' : 'Keep it clean, no mistakes.'}`);
      else if (g != null && m != null && m < -0.3) add('fight', 4, `${name(behind)} is ${f1(g)} behind and coming, ${f1(m)} quicker.`);
    }
    // ---- tyres
    const t = p.tyres, life = 1 - t.wear;
    if (t.wear > 0.6) add('tyres', t.wear > 0.7 ? 8 : 5, t.wear > 0.7 ? `Tyres are on the cliff. Box this lap if you can.` : `Tyres at ${Math.round(life * 100)} percent, the cliff isn't far. Think about the stop.`);
    else if (t.temp < 0.75 && (d.sc.phase === 'sc' || d.sc.phase === 'scIn' || d.sc.phase === 'vsc')) add('tyres', 6, t.temp < 0.6 ? `Tyre temps are well down. Weave, get some heat in them before the restart.` : `Tyres are cooling behind the safety car. Keep them warm, weave on the straights.`);
    else if (t.temp < 0.6) add('tyres', 4, t.compound === 'HARD' ? `Hards are still cold, they take a lap. Gently on the brakes.` : `Tyres are still cold, careful on the brakes.`);
    else add('tyres', 1, `Tyres at ${Math.round(life * 100)} percent, they're fine.`);
    // ---- rivals' strategies: an undercut on you (a car just ahead or behind gone in), a gambler staying out
    for (const o of near) {
      const g = this.gap(p, o), ai = o.ai;
      if (ai?.strat?.type === 'gamble' && o.pitStops === 0 && o.tyres.wear > 0.4) add('strat', 4, `${name(o)} still hasn't stopped. Looks like he's waiting for a safety car.`, o);
      else if (ai?.strat?.type === 'early' && o.pitStops === 0 && g != null && Math.abs(g) < 4 && o.tyres.wear > 0.35) add('strat', 4, `Expect ${name(o)} to stop early, he's on the softs.`, o);
    }
    // ---- stops around you
    for (const o of near) {
      if (o.pitStops < p.pitStops && t.wear < 0.5) { add('strat', 3, `${name(o)} hasn't stopped yet, he's still got that to do.`); break; }
      if (o.pitStops > p.pitStops) { const g = this.gap(p, o); add('strat', 3, `${name(o)} has stopped already${g != null ? `, he's ${f1(g)} ${g > 0 ? 'ahead' : 'behind'} on fresher tyres` : ''}.`); break; }
    }
    // ---- track limits
    const allowed = d.stewards.strikes, n = p.tlStrikes || 0;
    if (n > 0 && n >= allowed - 1) add('limits', n >= allowed ? 6 : 4, n >= allowed ? `We're on the black and white flag. Any more time gained off the track is a penalty.` : `${n} track-limit warnings, one more is the black and white flag.`);
    // ---- energy, engine
    if (p.engTemp > 0.85) add('car', 6, `Engine temperature is high, get out of the dirty air for a lap.`);
    if (p.ersEnergy < 0.15) add('car', 3, `Battery's low, harvest a bit before the next straight.`);
    // ---- the gaps (always something to say)
    const ga = ahead ? this.gap(p, ahead) : null, gb = behind ? this.gap(p, behind) : null;
    const lapN = Math.min(d.lapsTotal, p.lap + 1);
    add('gaps', 2, `P${i + 1}${lapN === d.lapsTotal ? ', final lap' : `, lap ${lapN} of ${d.lapsTotal}`}. ${ahead && ga != null ? `${name(ahead)} ${f1(ga)} ahead` : i === 0 ? 'Leading' : ''}${behind && gb != null ? `${ahead && ga != null || i === 0 ? ', ' : ''}${name(behind)} ${f1(gb)} behind` : ''}.`);

    items.sort((a, b) => b.score - a.score);
    const best = items[0]; if (!best) return;
    this.lastCat = best.cat; this.said.set(best.key, d.time);
    E.say(best.text, best.score >= 8 ? 2 : 1);
  }
  /** an AI car within three places of the player has turned into the pit lane: what it means (said at once) */
  pitCall(o) {
    const d = this.d, p = d.player, E = d.engineer; if (!E || !p || p.retired || p.finished || o === p) return;
    const pos = d.positions, me = pos.indexOf(p), k = pos.indexOf(o); if (Math.abs(k - me) > 3) return;
    const g = this.gap(p, o), last = o.name.split(' ').pop(), w = p.tyres.wear, why = o.ai?.pitReason;
    let txt = `${last} is boxing from P${k + 1}`;
    if (why === 'cheap') txt += ', a cheap stop under the safety car.';
    else if (g != null && Math.abs(g) < 3 && !p.pitRequested) txt += `${why === 'cover' ? ', covering' : ''}${g < 0 ? `, ${Math.abs(g).toFixed(1)} behind, that's the undercut` : ''}. ${w > 0.45 ? 'We can respond: box this lap, press P.' : 'Our tyres are good, we stay out.'}`;
    else txt += '.';
    E.say(txt, g != null && Math.abs(g) < 3 ? 2 : 1);
    this.said.set(`strat:${o.short}`, d.time);
  }
  /** change in a gap since the last briefing about the same car (+ : the player gained) */
  trend(key, car, g) {
    const m = this.mem.get(key); this.mem.set(key, { car, g });
    if (!m || m.car !== car || g == null || m.g == null) return null;
    return m.g - g;   // (ahead: a shrinking gap is a gain; behind, g < 0: one creeping toward 0 is a loss)
  }
}
