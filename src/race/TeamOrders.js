// Team orders: the pit wall's word between its two cars, and the drama around it.
//
// Who has priority: a contracted number one (career contracts: role 'lead' / 'support'); else - any AI team, and every
// team outside a career - the clearly better-rated driver (0.02 or more). Your own career team on equal terms has none:
// it decides by the race (the car behind clearly quicker and stuck) and by the title (15 points or more ahead in the
// standings comes first).
//
// The orders:
//  * swap - the car ahead lets its team-mate through: the number two holding up the number one (within 1.5 s for 15 s),
//    the title, or on equal terms the quicker car stuck behind (25 s, half a second a lap quicker; one time in two). You
//    are told on the radio (Y: copy, N: refuse) and have about a lap to do it - and you can ask for your team-mate ahead
//    to be moved over (G), which the team does if you have priority or the pace and the standings back you.
//  * hold - late in the race, both cars in the points within 2 s: no racing each other. Passing anyway breaks it.
// An AI driver obeys or not by its standing in the team, the standings (the contradiction: told to give way to a
// team-mate it leads in the championship), what is at stake (the win, a podium), its temper and - toward you - what it
// thinks of you (Paddock Rapport, a feud). One that refuses holds its team-mate up on purpose for a while (AIDriver: a
// grudge - every corner covered, no room, leaning on it alongside), and the one held up races it harder: contact
// between team-mates is watched, and with a grudge in it, it is dirty. A team-mate who has fallen out with you badly
// may hold you up without being told to.
// At the flag the stories: an order obeyed (above all one against the standings), refused or ignored, a hold broken, a
// car held up, team-mates colliding - for the results (main.js raceFacts), the paddock news, the press (career/PR.js
// HL.orders), Paddock Rapport and morale (career/Career.js applyRace) and the post-race interview (ui/Interview.js).

const sur = (c) => String(c?.name || '').split(' ').pop();
const STUCK_LEAD = 15, STUCK_TITLE = 18, STUCK_FAST = 25;   // seconds stuck behind before the pit wall acts
const COOL = 60;        // seconds after an order before the next one for that pair
const GRUDGE_T = 75;    // seconds a refusal is raced on

/** a story's side for the press and the interview, from the player's seat: 'youRefused', 'mateObeyed', ... | null */
export function orderSub(x) {
  if (!x || !x.me) return null;
  const you = x.me === 'actor';
  switch (x.kind) {
    case 'obeyed': return you ? (x.contra ? 'youSacrificed' : 'youObeyed') : 'mateObeyed';
    case 'refused': return you ? 'youRefused' : 'mateRefused';
    case 'holdBroken': return you ? 'youBrokeHold' : 'mateBrokeHold';
    case 'heldUp': return you ? 'youHeldUp' : 'mateHeldUp';
    case 'clash': return !x.blame ? 'clash' : you ? 'youHit' : 'mateHit';
    default: return null;
  }
}

export class TeamOrders {
  constructor(d) { this.d = d; this.pairs = null; this.done = []; this.clashes = []; this.ask = null; this._acc = 0; this._reqT = -99; }

  /** the two cars of every team, and who has priority between them */
  setup() {
    const by = new Map();
    for (const c of this.d.cars) { if (c.isSC || !c.team) continue; if (!by.has(c.team)) by.set(c.team, []); by.get(c.team).push(c); }
    this.pairs = [];
    for (const [team, cs] of by) {
      if (cs.length !== 2) continue;
      const [a, b] = cs, own = (a.isPlayer || b.isPlayer) && (a.role != null || b.role != null);   // (your career team: its contracts say it)
      let lead = a.role === 'lead' || b.role === 'support' ? a : b.role === 'lead' || a.role === 'support' ? b : null;
      const ra = a.rating ?? 0.9, rb = b.rating ?? 0.9;
      if (!lead && !own && Math.abs(ra - rb) >= 0.02) lead = ra > rb ? a : b;
      this.pairs.push({ team, a, b, lead, order: null, stuck: 0, cool: 0, swaps: 0, held: false, rolled: false, spite: false, heldT: new Map() });
    }
  }
  pairOf(c) { return this.pairs?.find((P) => P.a === c || P.b === c) || null; }
  /** your team-mate's priority over you: 'lead' (theirs), 'support' (yours), 'equal' | null (no team-mate) */
  standing(c) { const P = this.pairOf(c); if (!P) return null; return !P.lead ? 'equal' : P.lead === c ? 'support' : 'lead'; }
  human(c) { return !!c?.isPlayer && !c.autopilot; }
  away(c) { return !c || c.retired || c.finished || c.inPit || c.pitLane || c.isSC; }
  posOf(c) { return this.d.positions.indexOf(c) + 1; }
  lapT() { return this.d.world?.lapT || this.d.lapT || 90; }
  aiOf(c) { return c.ai || this.d.ai?.find((x) => x.car === c) || null; }
  /** an AI-driven car races `on` hard for a while (AIDriver: covered, no room, leant on) - a human's grudge is their own */
  grudge(c, on, k, T = GRUDGE_T) { if (c && on && (!c.isPlayer || c.autopilot)) c._grudge = { car: on, k, until: this.d.time + T }; }
  say(text, pr = 3, delay = 0) { this.d.engineer?.say(text, pr, delay); }

  update(dt) {
    const d = this.d; if (d.mode !== 'race' || !d.world.racing || d.done) return;
    if (!this.pairs) this.setup();
    this._acc += dt; if (this._acc < 0.25) return; const st = this._acc; this._acc = 0;
    const green = !d.sc || d.sc.phase === 'green';
    for (const P of this.pairs) this.pair(P, st, green);
    this.judgeClashes();
  }

  pair(P, st, green) {
    const d = this.d, t = d.time, { a, b } = P;
    if (P.order) this.follow(P, st, green);
    if (a.retired || b.retired) return;
    const ahead = d.positions.indexOf(a) < d.positions.indexOf(b) ? a : b, behind = ahead === a ? b : a;
    const g = this.away(ahead) || this.away(behind) ? null : d.radio?.gap(behind, ahead);   // (+: ahead is ahead)
    const close = g != null && g > 0 && g < 1.2;
    // (held up: the time the car behind spends within 1.2 s of a team-mate that has it in for it, or that refused to let it
    //  by - after the order, not while it was still to be done)
    const pending = P.order?.type === 'swap' && P.order.Y === ahead;
    const blk = (ahead._grudge?.car === behind && t < ahead._grudge.until) || (P.block?.car === ahead && P.block.on === behind && t < P.block.until);
    if (close && blk && !pending) P.heldT.set(ahead, (P.heldT.get(ahead) || 0) + st);
    P.stuck = g != null && g > 0 && g < 1.5 ? P.stuck + st : 0;
    if (P.order || !green || t < P.cool || a.lap < 1 || b.lap < 1 || g == null) return;
    const left = d.lapsTotal - Math.max(a.lap, b.lap); if (left < 1) return;
    // a team-mate who has fallen out with you badly holds you up without being told to
    if (this.human(behind) && !this.human(ahead) && (ahead.rapport ?? 0) <= -35 && P.stuck > 20 && !P.spite) {
      P.spite = true; this.grudge(ahead, behind, 0.55);
      this.say(`${sur(ahead)} is holding you up on purpose. We're on it.`, 2);
    }
    // priority: the number one; else the title (15 points ahead); else none
    const pa = ahead.champPts ?? null, pb = behind.champPts ?? null;
    const pri = P.lead || (pa != null && pb != null && Math.abs(pa - pb) >= 15 ? (pa > pb ? ahead : behind) : null);
    if (pri === behind && P.swaps < 2 && P.stuck > (P.lead ? STUCK_LEAD : STUCK_TITLE)) { this.swap(P, ahead, behind, P.lead ? 'number1' : 'title'); return; }
    // equal footing: the car behind clearly quicker and stuck - let it go (decided once a race)
    if (!pri && !P.rolled && P.swaps < 1 && P.stuck > STUCK_FAST) {
      const la = ahead.lapTimes?.[ahead.lapTimes.length - 1], lb = behind.lapTimes?.[behind.lapTimes.length - 1];
      if (la && lb && la - lb >= 0.5) { P.rolled = true; if (Math.random() < 0.5) { this.swap(P, ahead, behind, 'faster'); return; } }
    }
    // late on, both in the points and close: hold position (more often at the front of the grid)
    if (!P.held && pri !== behind && left <= Math.max(2, Math.round(d.lapsTotal * 0.3)) && this.posOf(behind) <= 10 && g < 2) {
      P.held = true; if (Math.random() < ((ahead.tier ?? 2) <= 1 ? 0.7 : 0.45)) this.hold(P, ahead, behind);
    }
  }

  /** how likely an AI driver Y does as it is told and gives way to (or stays behind) its team-mate B */
  obeyChance(Y, B, why, P) {
    let p = 0.84;
    if (Y.role === 'support' || P.lead === B) p += 0.08;
    if (why === 'faster') p -= 0.15;
    if (Y.champPts != null && B.champPts != null && Y.champPts > B.champPts) p -= 0.3;   // (the contradiction)
    const pos = this.posOf(Y); if (pos === 1) p -= 0.15; else if (pos <= 3) p -= 0.07;
    p -= 0.3 * ((this.aiOf(Y)?.aggression ?? 0.5) - 0.5);
    if (B.isPlayer) p += Math.max(-0.4, Math.min(0.12, (Y.rapport ?? 0) / 200)) - 0.35 * (Y.feud || 0);
    return Math.max(0.08, Math.min(0.96, p));
  }

  /** order Y (ahead) to let its team-mate B through */
  swap(P, Y, B, why, asked = false) {
    const d = this.d, t = d.time, contra = Y.champPts != null && B.champPts != null && Y.champPts > B.champPts;
    const o = { type: 'swap', Y, B, why, asked, t0: t, lap: Y.lap + 1, contra, pos: this.posOf(Y), state: 'asked', deadline: t + Math.max(30, 1.15 * this.lapT()) };
    P.order = o; P.swaps++; P.stuck = 0;
    if (this.human(Y)) {
      this.ask = o;
      this.say(why === 'faster' ? `${sur(B)} is quicker. Let them through, it's a team order.` : why === 'title' ? `${sur(B)} is ahead of you in the championship. Let them through, please.` : `${sur(B)} has priority today. Let them through, that's a team order.`, 3);
      if (contra) this.say(`We know you're ahead of ${sur(B)} in the standings. The order stands.`, 2, 8);
      d.hud?.msg(`TEAM ORDER · LET ${sur(B).toUpperCase()} THROUGH\nY COPY · N REFUSE`, 'warn', 5);
      return o;
    }
    const obey = Math.random() < this.obeyChance(Y, B, why, P);
    if (obey) { o.state = 'yielding'; Y._yieldTo = B; Y._yieldUntil = o.deadline; }
    else { o.state = 'refused'; o.refusedT = t; this.grudge(Y, B, 0.55); this.grudge(B, Y, 0.3, 45); }
    if (this.human(B)) {
      this.say(`We've told ${sur(Y)} to let you through.`, 3);
      if (!obey) this.say(`${sur(Y)} is refusing to move over. You'll have to pass them yourself.`, 3, 9);
    }
    return o;
  }

  /** order the car behind (Bk) to hold position behind its team-mate F */
  hold(P, F, Bk) {
    const o = { type: 'hold', F, Bk, t0: this.d.time, lap: F.lap + 1, pos: this.posOf(F), state: 'on' };
    P.order = o;
    if (this.human(F) || this.human(Bk)) { this.say('Hold position, both cars. No racing each other from here.', 3); this.d.hud?.msg('TEAM ORDER · HOLD POSITION', 'warn', 4); }
    if (!this.human(Bk)) { if (Math.random() < Math.min(0.97, this.obeyChance(Bk, F, 'hold', P) + 0.05)) Bk._holdFor = F; else { o.defy = true; this.grudge(Bk, F, 0.3, 60); } }
    return o;
  }

  /** an order under way: done, refused, ignored, broken - or moot */
  follow(P, st, green) {
    const d = this.d, t = d.time, o = P.order;
    const end = (state) => {
      o.state = state; o.t1 = t; P.order = null; P.cool = t + COOL; if (this.ask === o) this.ask = null;
      if (o.Y && o.Y._yieldTo === o.B) o.Y._yieldTo = null;
      if (o.Bk && o.Bk._holdFor === o.F) o.Bk._holdFor = null;
      if (state !== 'moot' || o.refusedT) this.done.push(o);
      if ((state === 'refused' || state === 'ignored') && o.Y) P.block = { car: o.Y, on: o.B, until: t + 150 };
    };
    if (o.type === 'swap') {
      const { Y, B } = o;
      if (Y.retired || B.retired || Y.inPit || B.inPit || Y.pitLane || B.pitLane) return end(o.refusedT ? 'refused' : 'moot');
      if (d.positions.indexOf(B) < d.positions.indexOf(Y)) {
        if (o.refusedT) return end('refused');   // (it got by in the end, on its own)
        end('obeyed');
        if (this.human(Y)) this.say('Thank you. Good team work.', 2); else if (this.human(B)) this.say('There you go. Go get them.', 2);
        return;
      }
      const g = d.radio?.gap(B, Y);
      if (g != null && g > 3.5 && !o.refusedT) return end('moot');   // (fallen back: no longer a question)
      if (!green) { o.deadline += st; return; }                       // (frozen under the safety car)
      if (t > o.deadline) {
        if (o.refusedT) return end('refused');
        if (this.human(Y)) { this.say(`You were told to let ${sur(B)} through. We'll talk about this after the race.`, 3); this.grudge(B, Y, 0.45); }
        return end('ignored');
      }
      if (this.human(Y) && !o.refusedT && !o.nag && t > o.t0 + (o.deadline - o.t0) * 0.55) { o.nag = true; this.say(`Let ${sur(B)} through now, please.`, 3); d.hud?.msg(`LET ${sur(B).toUpperCase()} THROUGH`, 'warn', 3); }
      return;
    }
    const { F, Bk } = o;
    if (F.retired || Bk.retired) return end('moot');
    // (void: the car ahead in trouble - pitting, spun, damaged, a puncture)
    if (F.pitLane || F.inPit || Bk.pitLane || Bk.inPit || F.spinning || t - (F._lastSpin ?? -99) < 5 || F.punct != null || (F.damageTotal?.() || 0) > 0.35) return end('moot');
    if (d.positions.indexOf(Bk) < d.positions.indexOf(F)) {
      end('broken');
      if (this.human(Bk)) this.say("We said hold position! That's not what we asked for.", 3);
      else if (this.human(F)) this.say(`${sur(Bk)} has ignored the hold order. We'll deal with it after the race.`, 3);
      this.grudge(F, Bk, 0.4, 60);
    }
  }

  /** your answer on the radio to an order to let your team-mate through: Y (copy) or N (refuse) */
  reply(car, yes) {
    const o = this.ask; if (!o || o.Y !== car || o.state !== 'asked') return false;
    if (yes) { o.state = 'copied'; this.d.hud?.msg(`COPIED · LET ${sur(o.B).toUpperCase()} BY`, '', 2); }
    else { o.state = 'refused'; o.refusedT = this.d.time; this.ask = null; this.say('Understood. This will be discussed after the race.', 3); this.grudge(o.B, car, 0.45); this.d.hud?.msg('ORDER REFUSED', 'bad', 2); }
    return true;
  }

  /** you ask for your team-mate ahead to be moved over (G) */
  request(car) {
    const d = this.d, t = d.time; if (!this.pairs || d.mode !== 'race' || !d.world.racing || d.done || t - this._reqT < 20) return false;
    this._reqT = t;
    const P = this.pairOf(car), mate = P ? (P.a === car ? P.b : P.a) : null;
    if (!mate || mate.retired) { this.say('Negative. There is nobody to swap with.', 2); return false; }
    if (P.order) { this.say(P.order.type === 'swap' ? 'We are already on it.' : 'Negative. Hold position.', 2); return false; }
    if (d.sc && d.sc.phase !== 'green') { this.say('Not under the safety car.', 2); return false; }
    const g = d.radio?.gap(car, mate);
    if (!(d.positions.indexOf(mate) < d.positions.indexOf(car)) || g == null || g > 1.5) { this.say(`You need to be right behind ${sur(mate)} for that.`, 2); return false; }
    const pts = mate.champPts != null && car.champPts != null ? mate.champPts - car.champPts : 0;
    const la = mate.lapTimes?.[mate.lapTimes.length - 1], lb = car.lapTimes?.[car.lapTimes.length - 1], quicker = !!(la && lb && la - lb >= 0.3);
    const ok = P.lead === car || (!P.lead && pts < 15 && (quicker || pts <= -15));
    this.say("Copy. Let's see.", 1);
    if (!ok) { this.say(P.lead === mate ? `Negative. ${sur(mate)} has priority. Race them if you can.` : "Negative, we're not swapping the cars. Race them.", 3, 4); return false; }
    this.swap(P, mate, car, P.lead === car ? 'number1' : pts <= -15 ? 'title' : 'faster', true);
    return true;
  }

  /** contact between team-mates (RaceDirector.collisions, after the stewards have seen it) */
  contact(a, b, into) {
    const d = this.d; if (d.mode !== 'race' || !d.world.racing || into < 2 || a.isSC || b.isSC) return;
    const t = d.time, pr = d.stewards?.pending?.find((q) => (q.culprit === a && q.victim === b) || (q.culprit === b && q.victim === a));
    const same = this.clashes.find((x) => ((x.a === a && x.b === b) || (x.a === b && x.b === a)) && t - x.t < 4);
    if (same) { same.into = Math.max(same.into, into); if (pr && !same.culprit) { same.culprit = pr.culprit; same.victim = pr.victim; } return; }
    const gr = (x, y) => x._grudge?.car === y && t < x._grudge.until, grudger = gr(a, b) ? a : gr(b, a) ? b : null;
    this.clashes.push({ a, b, t, lap: Math.max(a.lap, b.lap) + 1, into, culprit: pr?.culprit || null, victim: pr?.victim || null, grudger, d0a: a.damageTotal?.() || 0, d0b: b.damageTotal?.() || 0, spun: false, done: false });
  }
  judgeClashes() {
    const t = this.d.time;
    for (const x of this.clashes) {
      if (x.done) continue;
      if (x.a.spinning || x.b.spinning || x.a.air || x.b.air) x.spun = true;
      if (t - x.t < 3) continue;
      x.done = true; x.out = x.a.retired || x.b.retired;
      const dmg = Math.max((x.a.damageTotal?.() || 0) - x.d0a, (x.b.damageTotal?.() || 0) - x.d0b);
      x.sev = Math.max(x.out ? 1 : 0, x.spun ? 0.7 : 0, Math.min(1, dmg * 1.8), Math.min(0.6, x.into / 20));
      if (!x.culprit && x.grudger) { x.culprit = x.grudger; x.victim = x.grudger === x.a ? x.b : x.a; }   // (leaning on a team-mate it has it in for)
      x.dirty = !!x.grudger && x.culprit === x.grudger;
    }
  }

  /** the race's team-order stories, the biggest first: [{ kind, actor, other, good, score, text, mine, me, team, ... }] */
  stories() {
    const d = this.d, out = []; if (!this.pairs) return out;
    const fin = (c) => d.positions.indexOf(c) + 1;
    const add = (kind, actor, other, good, score, text, o = {}) => out.push({ kind, actor, other, good, text, team: actor.team,
      score: score + (fin(actor) <= 10 || fin(other) <= 10 ? 2 : 0) + (actor.isPlayer || other.isPlayer ? 6 : 0),
      mine: !!(actor.isPlayer || other.isPlayer), me: actor.isPlayer ? 'actor' : other.isPlayer ? 'other' : null, ...o });
    for (const o of this.done) {
      const stake = o.pos === 1 ? ' for the lead' : o.pos <= 3 ? ' for a podium place' : '', big = o.pos <= 3 ? 2 : 0;
      if (o.type === 'swap') {
        const { Y, B } = o;
        if (o.state === 'obeyed') add('obeyed', Y, B, true, 2 + (o.contra ? 3 : 0) + big, `Team orders at ${Y.team}: ${sur(Y)} lets ${sur(B)} through${stake}${o.contra ? `, though ${sur(Y)} leads ${sur(B)} in the championship` : ''}`, { contra: o.contra, why: o.why });
        else if (o.state === 'refused' || o.state === 'ignored') add('refused', Y, B, false, 6 + big + (o.contra ? 1 : 0), `${sur(Y)} ${o.state === 'refused' ? 'refuses' : 'ignores'} ${Y.team}'s order to let ${sur(B)} through${stake}`, { contra: o.contra, why: o.why, how: o.state });
      } else if (o.state === 'broken') add('holdBroken', o.Bk, o.F, false, 5 + big, `${sur(o.Bk)} ignores ${o.Bk.team}'s order to hold position and passes ${sur(o.F)}`);
    }
    // held up on purpose: 20 s or more stuck behind a team-mate with it in for it
    for (const P of this.pairs) for (const [holder, s] of P.heldT) {
      if (s < 20) continue;
      const v = holder === P.a ? P.b : P.a, laps = Math.max(1, Math.round(s / this.lapT()));
      add('heldUp', holder, v, false, 4 + Math.min(4, s / 20), `${sur(holder)} holds up team-mate ${sur(v)} for ${laps > 1 ? `${laps} laps` : 'a lap'}`, { n: laps });
    }
    for (const x of this.clashes) {
      if (!x.done || x.sev < (x.lap <= 1 ? 0.7 : 0.3) || (x.lap <= 1 && !x.culprit && !x.out)) continue;   // (the opening lap's pack: only a real clash is a story)
      if (x.culprit) add('clash', x.culprit, x.victim, false, 5 + x.sev * 4 + (x.dirty ? 3 : 0), `${x.culprit.team} team-mates collide: ${sur(x.culprit)} ${x.out ? 'takes out' : 'hits'} ${sur(x.victim)}${x.dirty ? ' after a bitter fight' : ''}`, { blame: true, dirty: x.dirty, sev: x.sev, out: x.out });
      else add('clash', x.a, x.b, false, 4 + x.sev * 4, `${x.a.team} team-mates ${sur(x.a)} and ${sur(x.b)} collide`, { blame: false, sev: x.sev, out: x.out });
    }
    // (one story of a kind between the same two cars: a second swap the same way is the same story)
    out.sort((p, q) => q.score - p.score);
    return out.filter((x, i) => out.findIndex((y) => y.kind === x.kind && y.actor === x.actor && y.other === x.other) === i);
  }
}
