// The race stewards: penalties for clear offences, for the player and the AI alike, at a strictness the menu sets
// (0 off, lenient ... harsh). Time penalties go onto the car (`penalties`, served at the next stop or added to the
// finishing time); the scorebug shows what is still to serve.
//
//  * track limits - only where it saved time: every trip off the road (all four wheels over the white line, not
//    forced off by a contact or a spin) is timed, from where it left to 100 m after it came back, against the time the
//    car's own current pace says that stretch takes. A cut across the inside of a corner that gains a tenth is a
//    strike; running wide on the outside only when it really gained (half a second at Standard); a big cut (1.5 s)
//    is 5 s straight away. Strikes: warnings, the black and white flag, then 5 s each;
//  * an overtake made off the track (passed while off, or within 100 m of coming back on): race control takes 6-14 s
//    to look at it, then orders the place given back - 30 s to do it, else 5 s;
//  * causing a collision: who was at fault (the nose that ran into a gearbox or a sidepod, the car that moved across
//    into one alongside) and what it did to the other car (spun, damaged, out of the race); lap 1 gets more leeway;
//  * overtaking under the safety car (and not giving the place back);
//  * a jump start.
//
// Most penalties also carry superlicence penalty points (how many is the game's table, career/Licence.js - in reality
// the stewards decide case by case; track limits carry none). They are kept on the car for the race (c.penPts and
// the log c.ppLog, which a flashback rewinds with the car) and put on the driver's licence after the flag; twelve
// within twelve months is a one-race ban, and the engineer says so the moment it happens.
import { pointsFor, LICENCE_MAX } from '../career/Licence.js';

const GIVE_BACK = 8;   // seconds to hand back a place taken under yellow flags / the safety car / the VSC
const INVESTIGATE = [6, 14];   // seconds race control takes to rule on an overtake made off the track
const GIVE_BACK_OFF = 30;      // ... and then to give that place back
const AFTER = 100;             // metres after rejoining that still count as part of a trip off the road

export class Stewards {
  /** @param director the RaceDirector; strictness 0..100 (0: no penalties at all) */
  constructor(director, strictness = 50) {
    this.d = director; this.s = Math.max(0, Math.min(1, strictness / 100)); this.off = strictness <= 0;
    this.pending = [];      // collisions awaiting their consequences
    this.scPasses = [];     // places taken under the safety car, awaiting being given back
    this.offPasses = [];    // overtakes made off the track: under investigation, then to be given back
    this.log = [];
    this.deep = false; this.cases = []; this.caseN = 0; this.onCase = null; this.onReview = null; this.onVerdict = null;   // (deep: investigations that take their time - openCase)
  }
  /** track-limit strikes allowed before the first penalty (and a penalty for every one after) */
  get strikes() { return Math.round(4 - 2 * this.s); }

  /**
   * A time penalty (the one place every penalty passes through, SafetyCar's delta rule included) and the penalty
   * points that come with it: on the car for this race, the log replaced (never pushed into) so a flashback
   * snapshot's copy is never changed under it
   */
  award(c, sec, reason) {
    if (this.off || c.retired) return;
    c.penalties += sec; c.penaltyCount = (c.penaltyCount || 0) + 1;
    if (this.deep && c.finished && c.finishTime != null) c.finishTime += sec;   // (given after the flag: on its time, and its place with it)
    const pts = pointsFor(reason, sec);
    if (pts) { c.penPts = (c.penPts || 0) + pts; c.ppLog = [...(c.ppLog || []), { pts, reason }]; }
    this.log.push({ t: this.d.time, car: c.short, sec, reason, pts });
    if (c.isPlayer) {
      // (the licence the car started with - car.licencePts, set by main.js: the driver actually racing, a stand-in's
      //  own - plus today's; standing in for a banned driver it is never the banned one's)
      const lic = c.outWhy === 'ban' && (c.licencePts || 0) >= LICENCE_MAX ? 0 : c.licencePts || 0, tot = lic + (c.penPts || 0), was = tot - pts;
      const pp = (n) => `${n} penalty point${n === 1 ? '' : 's'}`;
      this.d.hud?.msg(`${sec} SECOND TIME PENALTY\n${reason.toUpperCase()}${pts ? `\n+${pp(pts).toUpperCase()} (${tot}/${LICENCE_MAX})` : ''}`, 'bad', 4);
      this.d.engineer?.say(`We have a ${sec} second penalty for ${reason}${pts ? `, and ${pp(pts)} on the licence` : ''}. Serve it at the stop or keep a gap.`, 3);
      if (pts && was < LICENCE_MAX && tot >= LICENCE_MAX) this.d.engineer?.say(`That takes you to ${tot} points on the licence. Twelve means a one-race ban: you'll sit out the next race.`, 3, 5);
      else if (pts && was < 9 && tot >= 9) this.d.engineer?.say(`That's ${tot} penalty points on the licence now. Twelve is a race ban, so keep it clean from here.`, 2, 5);
    }
    else if (this.d.player && this.d.engineer) {
      const p = this.d.player, pos = this.d.positions, me = pos.indexOf(p), them = pos.indexOf(c);
      if (Math.abs(me - them) <= 3) {
        const g = this.d.radio?.gap(p, c), who = c.name.split(' ').pop();
        let txt = `${who} has a ${sec} second penalty, ${reason}.`;
        if (g != null && g > 0 && g < c.penalties + 4) txt += g < c.penalties - p.penalties ? ` He's ${g.toFixed(1)} ahead, so you're ahead of him on corrected time.` : ` He's ${g.toFixed(1)} ahead: get within ${c.penalties} and you beat him.`;
        else if (g != null && g < 0 && -g < c.penalties + 4) txt += ` He's ${(-g).toFixed(1)} behind, he'd need to finish ${c.penalties} seconds ahead of you.`;
        this.d.engineer.say(txt, 2);
      }
    }
  }

  update(dt) {
    if (this.off || !this.d.world.racing) return;
    const d = this.d, t = d.time, hw = d.track.halfWidth;
    const inf = d.pit?.infield;
    for (const c of d.cars) {
      // (a paved infield beside a last chicane - Montreal's: the lane's escape stretch short of the pit wall's nose is off
      //  the road, not the pit lane. A car that cuts across it and back onto the circuit has that trip timed like any
      //  other; one that carries on past the nose into the lane is pitting, and the trip is dropped)
      const viaInfield = !!inf && c.pitLane && !c.inPit && c.pitI < inf.iB;
      if ((c.pitLane && !viaInfield) || c.inPit) c._pitT = t;
      if (c.retired || c.finished || (c.pitLane && !viaInfield) || c.inPit || c.air || c.wreck || c.ghost > 0) { c._ex = null; c._paceS = null; continue; }
      if (c.spinning) c._lastSpin = t;
      // the car's current pace against the speed profile (a ~20 s window of running on the road): what a stretch
      // "should" take this car
      const ds = c._paceS == null ? 0 : d.planDs(c._paceS, c.s); c._paceS = c.s;
      const W = c.wh, sg = Math.sign(W.dw[0]);
      let allOut = sg !== 0;
      for (let k = 0; k < 4 && allOut; k++) if (Math.sign(W.dw[k]) !== sg || Math.abs(W.dw[k]) < d.track.edgeAt(c.trackIdx, sg) + 0.1) allOut = false;
      if (!c._ex && !c.offTrack && ds > 0 && ds < 60) {
        const kd = Math.exp(-dt / 20); c._refT = (c._refT || 0) * kd + ds / Math.max(8, d.profile[c.trackIdx]); c._actT = (c._actT || 0) * kd + dt;
      }
      // ---- a trip off the road: timed (and who was just ahead, for an overtake made out there)
      if (allOut && !c._ex) {
        // (not one: forced off by a contact or a spin, crawling, or merging from the pit lane's exit road)
        const forced = t - (c._lastHit ?? -9) < 2 || t - (c._lastSpin ?? -9) < 3 || c.speed < 15 || c.spinning || t - (c._pitT ?? -99) < 8 || (!!d.pit?.isGapS(c.s) && !d.track.pitInfield?.[c.trackIdx]);
        const k = c._actT > 3 ? Math.max(0.55, Math.min(1.15, c._refT / c._actT)) : 0.9;
        const ahead = d.cars.filter((o) => o !== c && !o.retired && !o.pitLane && !o.inPit && d.planDs(c.s, o.s) > 0 && d.planDs(c.s, o.s) < 60 && Math.abs(d.progress(o) - d.progress(c)) < 300);
        c._ex = { s0: c.s, t0: t, side: sg, forced, k, refT: 0, dist: 0, lastS: c.s, back: null, ahead };
        c._exT = t;
      }
      if (c._ex) {
        const ex = c._ex, x = Math.max(0, d.planDs(ex.lastS, c.s)); ex.lastS = c.s;
        if (x < 60) { ex.refT += x / Math.max(8, d.profile[c.trackIdx]); ex.dist += x; }
        if (c.spinning || t - (c._lastHit ?? -9) < 1) ex.forced = true;
        if (allOut) ex.back = null; else if (ex.back == null) ex.back = ex.dist;
        if ((ex.back != null && ex.dist - ex.back >= AFTER) || t - ex.t0 > 25) { this.judgeTrip(c, ex); c._ex = null; }
      }
    }
    // ---- collisions: judged on what they did, a few seconds on
    this.pending = this.pending.filter((p) => {
      if (p.victim.spinning || p.victim.air) p.spun = true;
      if (t - p.t < 2.5) return true;
      const out = p.victim.retired || p.victim.air || p.victim.wreck;
      const dmg = Math.max(0, p.victim.damageTotal() - p.dmg0);
      // what it did (out, spun, damaged) - or how hard it was: a nose into a gearbox at 30 km/h is a penalty even when
      // the other car gets away with it
      const hard = p.into / (p.kind === 'rear' || p.kind === 'tbone' ? 18 : p.kind === 'clip' ? 26 : 14);
      const sev = Math.max(out ? 1 : 0, p.spun ? 0.7 : 0, dmg * 1.8, Math.min(0.8, hard));
      // lenient: only putting someone out; harsh: any real damage. Lap 1: more leeway, the pack is a pack. (Standard:
      // spinning someone or real damage; a hard knock that did nothing much is let go)
      const need = 1.0 - 0.7 * this.s + (p.lap1 ? 0.3 * (1 - this.s) : 0);
      if (this.deep) { if (sev >= 0.32) this.openCase(p, sev, need); return false; }   // (the team principal's race: a case, with its time - openCase; a touch that did nothing is not race control's business)
      if (sev >= need) this.award(p.culprit, sev >= 1 ? 10 : 5, 'causing a collision');
      return false;
    });
    if (this.deep) this.caseTick();
    this.offTrackPasses(t);
    // ---- safety car / yellows: a place taken has GIVE_BACK seconds to be handed back (the passer is told: `_owes`)
    this.scPasses = this.scPasses.filter((p) => {
      const x = d.planDs(p.passed.s, p.passer.s), gone = p.passed.retired || p.passed.pitLane || p.passer.pitLane || p.passer.retired;
      if (x < -2 || gone) { if (p.passer._owes === p.passed) p.passer._owes = null; return false; }   // given back (or moot)
      if (t - p.t < GIVE_BACK) return true;
      // (still ahead of it on the road: the place was not given back)
      if (x > 0 && x < 300) this.award(p.passer, 5, p.why || 'overtaking under the safety car');
      if (p.passer._owes === p.passed) p.passer._owes = null;
      return false;
    });
  }

  /**
   * A trip off the road is over (100 m after the car came back): how much time did it save against the car's own
   * pace over the same stretch, and did it pass anyone out there?
   */
  judgeTrip(c, ex) {
    const d = this.d, t = d.time;
    if (ex.forced || ex.dist < 15) return;
    const gain = ex.refT / ex.k - (t - ex.t0);
    const tr = d.track, z = tr.inCornerZone(tr.idxAtS(ex.s0)) || tr.inCornerZone(tr.idxAtS(ex.s0 + 30));
    const inside = !!z && z.dir === ex.side;   // (the escape area is on the outside: -dir)
    const need = (inside ? 0.12 : 0.45) * (1.6 - this.s);
    c.lastTrip = { t, gain, inside };
    if (gain > need) this.strike(c, gain, inside);
    // overtakes made out there: anyone who was just ahead and is now behind (not one that spun, went off itself or
    // went into the pits)
    for (const o of ex.ahead) {
      if (o.retired || o.pitLane || o.inPit || o.speed < 15 || d.planDs(c.s, o.s) >= 0) continue;
      if (t - (o._lastSpin ?? -9) < 5 || (o._exT != null && o._exT > ex.t0 - 3)) continue;
      if (this.offPasses.some((p) => p.passer === c && p.passed === o)) continue;
      this.offPasses.push({ passer: c, passed: o, t, stage: 'inv', decideAt: this.deep ? t + (INVESTIGATE[0] + Math.random() * (INVESTIGATE[1] - INVESTIGATE[0])) * 2.6 : t + INVESTIGATE[0] + Math.random() * (INVESTIGATE[1] - INVESTIGATE[0]) });
      if (c.isPlayer || o.isPlayer) d.hud?.msg(`INCIDENT NOTED · ${c.short} / ${o.short}\nOVERTAKE OFF TRACK`, 'warn', 3);
      this.radioNear(c, o, `${this.last(c)} and ${this.last(o)}, overtake off the track, it's under investigation.`, 1);
    }
  }
  /** a time-saving trip off the road: a warning, the black and white flag, then 5 s - or 5 s at once for a big cut */
  strike(c, gain, inside) {
    const d = this.d, E = c.isPlayer ? d.engineer : null;
    c.tlStrikes = (c.tlStrikes || 0) + 1;
    const n = c.tlStrikes, allowed = this.strikes, gs = `${gain.toFixed(1)}s`;
    if (gain >= 1.5) { this.award(c, 5, 'leaving the track and gaining an advantage'); return; }
    if (n > allowed) { this.award(c, 5, 'track limits'); return; }
    if (!c.isPlayer) return;
    d.hud?.msg(`TRACK LIMITS · ${inside ? 'CUT' : 'OFF TRACK'} · ${gs} GAINED\n${n === allowed ? 'BLACK & WHITE FLAG' : `WARNING ${n}/${allowed}`}`, 'warn', 3);
    E?.say(n === allowed ? `That's the black and white flag. Next time you gain off the track it's a penalty.` : `Track limits warning, you gained ${gs} there. ${allowed - n} left before the flag.`, 2);
  }
  /** overtakes made off the track: race control decides, then the place has to go back */
  offTrackPasses(t) {
    const d = this.d;
    this.offPasses = this.offPasses.filter((p) => {
      const { passer: a, passed: b } = p, ahead = d.progress(a) > d.progress(b);
      const clear = () => { if (a._owes === b) a._owes = null; };
      if (a.retired || b.retired || a.pitLane || b.pitLane || a.inPit || b.inPit || a.finished || b.finished) { clear(); return false; }
      if (p.stage === 'inv') {
        if (!ahead) {   // handed back before the ruling
          if (a.isPlayer || b.isPlayer) d.hud?.msg(`${a.short} / ${b.short} · NO FURTHER ACTION`, '', 2);
          return false;
        }
        if (t < p.decideAt) return true;
        p.stage = 'order'; p.deadline = t + GIVE_BACK_OFF; a._owes = b;
        if (a.isPlayer) { d.hud?.msg(`RACE CONTROL · GIVE THE POSITION BACK\nTO ${b.short} WITHIN ${GIVE_BACK_OFF}s`, 'bad', 4); d.engineer?.say(`Race control says give the place back to ${this.last(b)}. We have ${GIVE_BACK_OFF} seconds.`, 3); }
        else if (b.isPlayer) { d.hud?.msg(`RACE CONTROL · ${a.short} TO GIVE THE POSITION BACK`, 'good', 3); d.engineer?.say(`${this.last(a)} has been told to give the place back to you. Don't fight him for it.`, 3); }
        else this.radioNear(a, b, `${this.last(a)} has to give the place back to ${this.last(b)}.`, 1);
        return true;
      }
      if (!ahead) {
        clear();
        if (a.isPlayer) d.hud?.msg('POSITION RETURNED', 'good', 2);
        if (b.isPlayer) d.engineer?.say(`${this.last(a)} has given the place back.`, 1);
        return false;
      }
      if (a.isPlayer && !p.warned && p.deadline - t < 10) { p.warned = true; d.hud?.msg(`GIVE THE POSITION BACK · ${Math.ceil(p.deadline - t)}s`, 'bad', 2.5); d.engineer?.say(`Ten seconds to give that place back to ${this.last(b)} or it's a penalty.`, 3); }
      if (t >= p.deadline) { clear(); this.award(a, 5, 'leaving the track and gaining an advantage'); return false; }
      return true;
    });
  }
  // ---- the stewards' room, as it really is (deep: the team principal's race - main.js sets it) -----------------------
  // A collision is not judged in the moment. Race control is busy: the incident is NOTED some seconds on (longer on
  // the first lap, longer the more it has in hand); most are then put UNDER INVESTIGATION - the stewards look at the
  // pictures (onReview: the broadcast shows them too) - for half a minute or, where it is not clear, a first-lap
  // tangle, a car put out, two or three minutes; a late one, or one still open at the flag, is INVESTIGATED AFTER THE
  // RACE. What comes of it: a RACING INCIDENT (nobody wholly or predominantly to blame - the pack into Turn 1, a car
  // that moved over too, a wet road), NO FURTHER ACTION (to blame, but nothing came of it), five or ten seconds, or a
  // drive-through for putting a car out with no excuse. `blame` is the stewards' reading of the contact, 0..1.
  /** a contact whose consequences are known (update: 2.5 s on) -> a case, with its timetable */
  openCase(p, sev, need) {
    const d = this.d, t = d.time, a = p.culprit, b = p.victim, U = (x, y) => x + Math.random() * (y - x);
    // (the same two again while their case is open: one incident, the heavier reading of it)
    { const q = this.cases.find((k) => !k.done && ((k.a === a && k.b === b) || (k.a === b && k.b === a)) && t - k.t0 < 40); if (q) { if (sev > q.sev && q.a === a) { q.sev = sev; q.need = need; q.into = Math.max(q.into, p.into); } return q; } }
    let blame = { rear: 0.9, tbone: 0.85, clip: 0.62 }[p.kind] ?? 0.72;
    if (p.lap1) { const pack = d.cars.filter((c) => c !== a && c !== b && !c.retired && Math.hypot(c.x - a.x, c.z - a.z) < 30).length; blame -= pack >= 2 ? 0.3 : 0.15; }
    if (p.kind === 'rear' && (p.vAx ?? 0) < -28) blame -= 0.25;            // (the car ahead was hard on its brakes)
    if (p.moved) blame -= 0.2;                                               // (the other car was coming across too)
    if ((d.weather?.tyreWet ?? a.wetness ?? 0) > 0.3) blame -= 0.1;
    if (p.into > 20) blame += 0.1;
    if ((this.log || []).some((e) => e.car === a.short && /collision/.test(e.reason))) blame += 0.12;   // (not his first today)
    blame = Math.max(0, Math.min(1, blame));
    const thr = 0.62 - 0.3 * (this.s - 0.5), busy = this.cases.filter((k) => !k.done).length;
    const tough = p.lap1 || sev >= 1 || Math.abs(blame - thr) < 0.14 || this.cases.some((k) => !k.done && t - k.t0 < 8 && (k.a === a || k.b === a || k.a === b || k.b === b));
    const k = { id: ++this.caseN, kind: 'col', a, b, t0: p.t, lap: Math.max(1, (a.lap || 0) + 1), lap1: !!p.lap1, sev, need, blame, thr, into: p.into, tough, stage: 'seen', done: false, verdict: null,
      noteAt: t + U(6, 15) + (p.lap1 ? U(6, 14) : 0) + busy * 4 };
    // (plainly nothing in it: noted, and no investigation necessary)
    k.quick = blame < thr - 0.22 && sev < 1;
    k.invAt = k.quick ? null : k.noteAt + U(9, 20); k.decideAt = k.quick ? k.noteAt + U(10, 22) : k.invAt + (tough ? U(70, 170) : U(28, 60));
    try { const z = d.track.inCornerZone?.(d.track.idxAtS(a.s)); k.where = z?.turn != null ? `TURN ${z.turn}` : null; } catch (e) { k.where = null; }
    this.cases.push(k); this.onCase?.(k);
    return k;
  }
  /** what the stewards make of a case -> { kind: 'racing' | 'nfa' | 'none' | 'pen' | 'dt', sec } */
  rule(k) {
    if (k.quick) return { kind: 'none', sec: 0 };
    if (k.blame < k.thr) return { kind: 'racing', sec: 0 };
    if (k.sev < k.need) return { kind: 'nfa', sec: 0 };
    if (k.sev >= 1 && k.blame >= 0.9 && (k.into >= 24 || (this.log || []).some((e) => e.car === k.a.short && /collision/.test(e.reason)))) return { kind: 'dt', sec: 0 };
    return { kind: 'pen', sec: k.sev >= 1 ? 10 : 5 };
  }
  /** a case decided (post: after the flag - a drive-through is twenty seconds then); bump: a protest heard (the blame read again, harder) */
  decide(k, post = false, bump = 0) {
    if (bump) { k.blame = Math.min(1, k.blame + bump); k.quick = false; }
    let v = this.rule(k); if (v.kind === 'dt' && (post || k.a.finished || k.a.retired)) v = { kind: 'pen', sec: 20 };
    k.verdict = v; k.done = true; k.stage = 'done'; k.doneAt = this.d.time;
    if (v.kind === 'pen') this.award(k.a, v.sec, 'causing a collision'); else if (v.kind === 'dt') this.driveThrough(k.a, 'causing a collision');
    this.onVerdict?.(k);
    return v;
  }
  /** the cases as the race goes on: noted, under investigation (the pictures looked at), decided - or left for after the flag */
  caseTick() {
    const d = this.d, t = d.time, left = d.lapsTotal - (d.positions[0]?.lap || 0);
    for (const k of this.cases) {
      if (k.done || k.stage === 'post') continue;
      if (k.a.retired && k.stage === 'seen' && !k.b.retired && k.sev < 1) { k.done = true; k.stage = 'done'; k.verdict = { kind: 'gone', sec: 0 }; continue; }   // (out of the race, and nothing much done: not pursued)
      if (k.stage === 'seen' && t >= k.noteAt) { k.stage = 'noted'; k.notedAt = t; if (!k.quick && (left <= 1.3 || d.leaderFinished)) { k.stage = 'post'; k.postAt = t; } continue; }
      if (k.stage === 'noted' && !k.quick && t >= k.invAt) { k.stage = 'inv'; k.invAt = t; this.onReview?.(k); continue; }
      if ((k.stage === 'inv' || (k.quick && k.stage === 'noted')) && t >= k.decideAt) { this.decide(k); continue; }
      if (k.stage === 'inv' && d.leaderFinished) { k.stage = 'post'; k.postAt = t; }   // (the flag has fallen on it: after the race)
    }
    // drive-throughs: three laps to come in, or twenty seconds instead
    for (const c of d.cars) if (c.driveThrough > 0 && !c.dtRun && (c.finished || (c.lap || 0) > (c.dtBy ?? 1e9))) { c.driveThrough--; c.dtCalled = false; this.award(c, 20, 'drive-through not served'); }
  }
  /** the cases still open (at the flag: for the stewards' room after it) */
  openCases() { return this.cases.filter((k) => !k.done); }
  /** a drive-through: through the pit lane without stopping, within three laps (an AI car is called in for it at once) */
  driveThrough(c, reason) {
    if (this.off || c.retired) return;
    c.driveThrough = (c.driveThrough || 0) + 1; c.dtBy = (c.lap || 0) + 2;   /* (this lap and the two after it) */ c.penaltyCount = (c.penaltyCount || 0) + 1;
    const pts = pointsFor(reason, 10); if (pts) { c.penPts = (c.penPts || 0) + pts; c.ppLog = [...(c.ppLog || []), { pts, reason }]; }
    this.log.push({ t: this.d.time, car: c.short, sec: 0, dt: true, reason, pts });
    if (c.ai && !c.mgr && !c.isPlayer) { c.pitRequested = true; c.dtCalled = true; c.ai.pitPlan = { compound: c.tyres.compound, repair: 'none' }; c.ai.pitReason = 'penalty'; }
  }
  /** it has been through the lane */
  dtServed(c) { this.log.push({ t: this.d.time, car: c.short, sec: 0, dtServed: true, reason: 'drive-through served', pts: 0 }); }
  last(c) { return c.name.split(' ').pop(); }
  /** a radio call about other cars, when one of them is within three places of the player */
  radioNear(a, b, text, prio) {
    const d = this.d, p = d.player; if (!p || !d.engineer || a.isPlayer || b.isPlayer) return;
    const pos = d.positions, me = pos.indexOf(p);
    if (Math.min(Math.abs(pos.indexOf(a) - me), Math.abs(pos.indexOf(b) - me)) <= 3) d.engineer.say(text, prio);
  }

  /**
   * A car-to-car contact (from RaceDirector.collisions): find who caused it, if anyone, and wait to see what it did.
   * @param hit the contact's kind ('rear' | 'tbone' | 'clip' | 'wheels' | 'wheel-side' | 'rub' | 'body'), zA / zB the
   *        parts that touched, n the contact normal (from a to b), into the closing speed (m/s)
   */
  contact(a, b, kind, zA, zB, nx, nz, into) {
    if (a.isSC || b.isSC) return;
    a._lastHit = b._lastHit = this.d.time;
    if (this.off || !this.d.world.racing || into < 1.5) return;
    const front = (z) => z === 'nose' || z === 'wing';
    let culprit = null, victim = null;
    if (kind === 'rear' || kind === 'tbone' || kind === 'clip') {
      if (front(zA) && !front(zB)) { culprit = a; victim = b; } else if (front(zB) && !front(zA)) { culprit = b; victim = a; }
    } else {
      // side by side: the one that moved across into the other
      const [vax, vaz] = a.worldVel(), [vbx, vbz] = b.worldVel();
      const aIn = vax * nx + vaz * nz, bIn = -(vbx * nx + vbz * nz);   // each one's sideways speed toward the other
      const tr = this.d.track, ia = a.trackIdx, ib = b.trackIdx;
      const aLat = (vax * tr.nx[ia] + vaz * tr.nz[ia]) * Math.sign(b.d - a.d), bLat = (vbx * tr.nx[ib] + vbz * tr.nz[ib]) * Math.sign(a.d - b.d);
      if (aIn > 1.5 && aLat > 1.2 && bLat < 0.4) { culprit = a; victim = b; } else if (bIn > 1.5 && bLat > 1.2 && aLat < 0.4) { culprit = b; victim = a; }
    }
    if (!culprit || culprit.retired || victim.ghost > 0) return;
    // a car out of control (spinning, or knocked into it by someone else a moment ago) is not to blame
    if (culprit.spinning || this.d.time - (culprit._lastSpin ?? -9) < 3 || this.d.time - (culprit._victimT ?? -9) < 4) return;
    // the car hit from behind was not brake-testing, nor spinning in front of it
    if (victim.spinning || (kind === 'rear' && victim.ax < -45)) return;
    victim._victimT = this.d.time;
    const same = this.pending.find((p) => p.culprit === culprit && p.victim === victim);
    if (same) { same.into = Math.max(same.into, into); return; }
    // (deep: how the other car was moving, for the stewards' reading of it - no part of the judgement in any other race)
    const moved = this.deep && kind !== 'rear' && kind !== 'tbone' && kind !== 'clip' ? (() => { try { const tr = this.d.track, [vx, vz] = victim.worldVel(), i = victim.trackIdx; return (vx * tr.nx[i] + vz * tr.nz[i]) * Math.sign(culprit.d - victim.d) > 0.25; } catch (e) { return false; } })() : false;
    this.pending.push({ culprit, victim, kind, into, t: this.d.time, dmg0: victim.damageTotal(), spun: false, lap1: this.d.time - (this.d.world.raceStart ?? 0) < 35, moved, vAx: victim.ax });
  }

  /** the safety car is out: a car that went past another running car (not one in the pits, spinning or stopped) */
  scPass(passer, passed) {
    if (this.off || passed.retired || passed.pitLane || passed.spinning || passed.speed < 10 || passer.pitLane) return;
    if (this.scPasses.some((p) => p.passer === passer && p.passed === passed)) return;
    const ph = this.d.sc?.phase, why = ph === 'yellow' ? 'overtaking under yellow flags' : ph === 'vsc' || ph === 'vscEnd' ? 'overtaking under the VSC' : ph === 'restart' ? 'overtaking before the control line' : 'overtaking under the safety car';
    this.scPasses.push({ passer, passed, t: this.d.time, why });
    passer._owes = passed;   // (an AI car lifts to let it back by; the car it passed may go by again)
    if (passer.isPlayer) { this.d.hud?.msg(`${ph === 'yellow' ? 'YELLOW FLAG' : 'NO OVERTAKING'} · GIVE THE PLACE BACK`, 'bad', 3); this.d.engineer?.say(`Give the place back to ${passed.name.split(' ').pop()}, quickly.`, 3); }
  }

  jumpStart(c) {
    if (this.off) return;
    this.award(c, 5, 'a jump start');
  }
}
