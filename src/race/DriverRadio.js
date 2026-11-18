// Your two drivers on the radio (the team principal's race, main.js tpRadio): they talk back. A stop that cost them
// places to a rival who stopped first ("he undercut me, we were too late") or one that won them some ("great call");
// stuck behind the team-mate and quicker, they ask to be let by - the question on the pit wall (SWAP / NO), a no not
// forgotten; an order to give way or hold, taken in their own way; a place won or lost on the road; the flag, against
// what the car could do. What they say is their manner (career/StoryLines.js TRAITS: hot-headed, political, loyal,
// money-driven, perfectionist, team player) in their mood (the career's morale and their form - the marks: up, flat,
// down). In a career a few of the moments move the morale a little: a stop that cost them, a request refused.

const sur = (c) => String(c?.name || '').split(' ').pop();
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const fill = (t, x) => t.replace(/\{(\w+)\}/g, (_, k) => x[k] ?? '');

// the lines: by moment, then mood (up | flat | down); a trait's own line for some moments (T), said one time in two
const L = {
  stopBad: {
    up: ['{r} got us on the stop. Fine, I will get him back.', 'We lost {r} in the stops. Plenty of race left.'],
    flat: ['{r} undercut me. We were a lap too late.', 'How is {r} ahead now? We left it too long.'],
    down: ['Again! {r} stopped first and now he is ahead. Who made that call?', 'We gave that to {r}. Every time, we are too late.'],
    T: { hot: 'Unbelievable. {r} jumped us in the pits. Wake up out there!', perfectionist: 'We lost {r} by a lap. That is a strategy mistake, write it down.', mercenary: 'That stop just cost me points. {r} says thank you.', loyal: '{r} got us. It happens. Let us get it back.' },
  },
  stopGood: {
    up: ['Yes! We jumped {r}. Great call, guys.', 'That is how you do a stop. {r} is behind!'],
    flat: ['Good stop. {r} is behind us now.', 'Nice, we got {r} in the stops.'],
    down: ['Okay, we got {r}. Finally something works.', 'Good. {r} is behind. Keep it like that.'],
    T: { team: 'Great job by the crew. We got {r}, that is a team result.', political: 'Please thank the strategists for me. {r} will not be happy.' },
  },
  letBy: {
    up: ['I am quicker than {m}. Can we swap? I will give it back if I cannot pull away.', '{m} is holding me up a bit. Let me have a go at the car ahead.'],
    flat: ['I am stuck behind {m}. I have more pace, let me by.', 'Can you ask {m} to move over? I am losing time here.'],
    down: ['Why am I still behind {m}? I am much quicker. Do something!', 'I am wasting my race behind {m}. Let me through.'],
    T: { hot: 'Tell {m} to get out of the way or I go round the outside!', political: 'I think it would be best for the team if {m} let me by. Your call, of course.', mercenary: 'I am quicker and my points pay the same as his. Swap us.', loyal: 'If it helps the team, I can go after the car ahead. Only if you agree.' },
  },
  refused: {
    up: ['Okay, understood. I stay here.', 'Copy. I will race him then.'],
    flat: ['Copy... not happy, but copy.', 'Understood. We will talk about this later.'],
    down: ['Of course. Why would anyone listen to me.', 'Great. Brilliant. I stay behind then.'],
    T: { hot: 'Then I race him. Do not complain if it gets close.', team: 'Understood. Team first.', perfectionist: 'Noted. I think it is the wrong decision.' },
  },
  yield: {
    up: ['Copy, letting {b} through. Make it worth it.', 'Okay, {b} can go. He owes me one.'],
    flat: ['Copy. Letting {b} by.', 'Understood, {b} through on the straight.'],
    down: ['Really? Fine. {b} can go.', 'So I am the number two now. Copy.'],
    T: { team: 'No problem, {b} goes through. Team first.', hot: 'I do this once. Once!', political: 'Of course. Happy to help {b}.', mercenary: 'I hope someone is counting what this costs me.' },
  },
  thanks: {
    up: ['Thanks, guys. Now let me get the car ahead.', 'Thank you. And thank {y}.'],
    flat: ['Thanks. Pushing now.', 'Copy, past {y}. Going after the next one.'],
    down: ['About time. Okay, pushing.', 'Finally. Let us go.'],
  },
  held: {
    up: ['Copy, holding position. Good result for the team.', 'Understood, I will bring it home behind {f}.'],
    flat: ['Copy. Holding.', 'Understood. No racing {f}.'],
    down: ['I am quicker than {f} and you tell me to hold. Okay.', 'Hold position. Of course.'],
    T: { hot: 'You are tying my hands here.', loyal: 'For the team. Copy.' },
  },
  pass: {
    up: ['Got him! {r} done.', 'Yes! Past {r}. Who is next?'],
    flat: ['Past {r}.', 'That is {r}. Okay.', '{r} done. Next one.', 'Got {r} into the braking zone.'],
    down: ['Finally past {r}.', 'Got {r}. Took long enough.'],
  },
  passed: {
    up: ['{r} got me. I will be back at him.', 'Lost one to {r}. No drama.'],
    flat: ['{r} is through. The tyres are not there.', 'Lost a place to {r}.', '{r} had the tow, could not hold him.', 'Lost one to {r}. He is quicker on the straights.'],
    down: ['{r} just drove past. This car has nothing!', 'I cannot hold {r}. There is nothing in the car.'],
    T: { hot: '{r} pushed me off! Did you see that?', perfectionist: 'My mistake. {r} got the run on me.' },
  },
  flagGood: {
    up: ['P{p}! Amazing job, everyone. Thank you!', 'Yes! P{p}! What a car today!'],
    flat: ['P{p}. Good job, guys. Good points.', 'P{p}. That is a good day. Thanks, team.'],
    down: ['P{p}. Okay. That helps. Thanks.', 'P{p}. We needed that.'],
    T: { loyal: 'P{p}! For this team. Thank you, everyone.', political: 'P{p}. Please thank the factory for me.' },
  },
  flagOk: {
    up: ['P{p}. We take it.', 'P{p}. Not bad, we learn from today.'],
    flat: ['P{p}. That is about what we had.', 'P{p}. Okay.'],
    down: ['P{p}. Nothing more in it.', 'P{p}. Another one like that.'],
  },
  flagBad: {
    up: ['P{p}. Not our day. We go again.', 'P{p}. We need to look at that one.'],
    flat: ['P{p}. That was not good enough.', 'P{p}. We left a lot out there.'],
    down: ['P{p}. Terrible. We need to talk.', 'P{p}. I do not even know what to say.'],
    T: { hot: 'P{p}! That is a joke. A joke!', perfectionist: 'P{p}. I want to see all of the data tonight.', mercenary: 'P{p}. That is not what I am here for.' },
  },
};

/** the line for a moment: by the driver's manner and mood (x: the names to fill in) */
export function radioLine(kind, trait, mood, x = {}, seed = '') {
  const K = L[kind]; if (!K) return '';
  const own = K.T?.[trait], h = hash(`${seed}|${kind}`);
  const pool = K[mood] || K.flat; const t = own && h % 2 === 0 ? own : pool[h % pool.length];
  return fill(t, x);
}
/** a driver's mood from the career: morale and form (the marks) -> 'up' | 'flat' | 'down' */
export function moodOf(d, form) {
  if (!d) return 'flat';
  const m = d.morale ?? 60, f = form ?? 6.3;
  return m >= 68 || (m >= 55 && f >= 7.3) ? 'up' : m < 40 || (m < 55 && f <= 5.2) ? 'down' : 'flat';
}

/**
 * The radio, polled from the race (o: { d, cars (yours), say(who, text), ask(car, q) - a question on the car's card,
 * C (the career, or null), traitOf(car), formOf(car), now (the race clock) }). State kept on this object, one a race.
 */
export class DriverRadio {
  constructor(d) { this.d = d; this.s = new Map(); this.t0 = null; }
  st(c) { let s = this.s.get(c); if (!s) this.s.set(c, (s = { last: -99, lane: false, snap: null, pos: null, stuck: 0, asked: -999, flag: false, said: {} })); return s; }
  update(o) {
    const d = this.d; if (d.mode !== 'race' || !d.world.racing) return;
    // (twice a race second - at any pace of the race: x16 too)
    if (this.t0 == null) this.t0 = d.time; const step = d.time - this.t0; if (step < 0.5) return; this.t0 = d.time;
    const P = d.positions, now = d.time, idx = (c) => P.indexOf(c);
    for (const c of o.cars) {
      const s = this.st(c), dv = o.C?.drivers?.[c.careerId], mood = moodOf(dv, o.formOf?.(c)), trait = o.traitOf?.(c) || 'team';
      const say = (kind, x, force = false) => { if (!force && now - s.last < 22) return false; const t = radioLine(kind, trait, mood, x, `${c.name}|${now.toFixed(0)}`); if (!t) return false; s.last = now; o.say(sur(c), t); return true; };
      const mor = (n) => { if (dv) dv.morale = Math.round(Math.max(0, Math.min(100, (dv.morale ?? 60) + n))); };
      if (c.retired) continue;
      // the flag: the place against what the car could do (its grid slot, as a stand-in) - said once
      if (c.finished && !s.flag) {
        s.flag = true; const p = idx(c) + 1, e = c.gridPos || p;
        say(p <= 3 || p <= e - 3 ? 'flagGood' : p >= e + 3 ? 'flagBad' : 'flagOk', { p }, true); continue;
      }
      if (c.finished) continue;
      // a stop: the cars around it when it went in, against where they are a lap after it came out - the ones that
      // stopped too (a fair comparison): behind before and ahead now (an undercut), ahead before and behind now
      const lane = !!(c.pitLane || c.inPit);
      if (lane && !s.lane) {
        const i = idx(c), near = P.slice(Math.max(0, i - 4), i + 5).filter((x) => x !== c && !x.retired);
        s.snap = { lap: null, at: now, near: near.map((x) => ({ x, ahead: idx(x) < i, stops: x.pitStops || 0 })) };
      }
      if (!lane && s.lane && s.snap) s.snap.lap = c.lap;
      s.lane = lane;
      if (s.snap?.lap != null && c.lap >= s.snap.lap + 1) {
        const i = idx(c), sn = s.snap; s.snap = null;
        const stopped = sn.near.filter((n) => !n.x.retired && (n.x.pitStops || 0) > n.stops);
        const lost = stopped.filter((n) => !n.ahead && idx(n.x) < i), won = stopped.filter((n) => n.ahead && idx(n.x) > i);
        if (lost.length && !won.length) { if (say('stopBad', { r: sur(lost[0].x) }, true)) mor(mood === 'down' ? -2 : -1); }
        else if (won.length && !lost.length) { if (say('stopGood', { r: sur(won[0].x) }, true)) mor(1); }
      }
      // stuck behind the team-mate and quicker: ask (once in four laps at most; not while an order is on)
      const mate = o.cars.find((x) => x !== c && !x.retired && !x.finished);
      const pair = d.orders?.pairOf?.(c), ordered = !!pair?.order;
      if (mate && !lane && !mate.pitLane && !mate.inPit && !ordered && (!d.sc || d.sc.phase === 'green') && idx(mate) === idx(c) - 1) {
        const g = d.radio?.gap?.(c, mate);
        s.stuck = g != null && g > 0 && g < 1.0 ? s.stuck + step : 0;
        const la = c.lapTimes?.[c.lapTimes.length - 1], lm = mate.lapTimes?.[mate.lapTimes.length - 1];
        if (s.stuck > 18 && la && lm && lm - la > 0.25 && c.lap - s.asked >= 4 && c.lap < d.lapsTotal - 1) {
          s.asked = c.lap; s.stuck = 0;
          say('letBy', { m: sur(mate) }, true);
          o.ask?.(c, { key: `letby${c.lap}`, text: `${sur(c)} asks to be let past ${sur(mate)}`, yes: 'SWAP', no: 'NO',
            onYes: () => o.order?.('swap'),
            onNo: () => { this.st(c).last = -99; say('refused', { m: sur(mate) }, true); mor(trait === 'hot' || mood === 'down' ? -3 : -1); } });
        }
      } else s.stuck = 0;
      // a place won or lost on the road (not in the pits, not on the opening lap): now and then
      const p = idx(c);
      if (s.pos != null && p !== s.pos && !lane && c.lap >= 1 && Math.abs(p - s.pos) === 1) {
        const other = P[p < s.pos ? p + 1 : p - 1];
        if (other && !other.pitLane && !other.inPit && !other.retired && other !== mate && hash(`${c.name}|${now.toFixed(0)}`) % 3 === 0) say(p < s.pos ? 'pass' : 'passed', { r: sur(other) });
      }
      s.pos = p;
    }
  }
  /** an order given on the wall (main.js tpAct): how the two take it - o: the order (Y yields to B; Bk holds behind F) */
  onOrder(type, ord, o) {
    const d = this.d, line = (c, kind, x) => { if (!c || c.retired) return; const s = this.st(c), dv = o.C?.drivers?.[c.careerId];
      const t = radioLine(kind, o.traitOf?.(c) || 'team', moodOf(dv, o.formOf?.(c)), x, `${c.name}|${d.time.toFixed(0)}|${kind}`); if (t) { s.last = d.time; o.say(sur(c), t); } };
    if (type === 'swap' && ord?.Y) { line(ord.Y, 'yield', { b: sur(ord.B) }); setTimeout(() => line(ord.B, 'thanks', { y: sur(ord.Y) }), 2500); }
    if (type === 'hold' && ord?.Bk) line(ord.Bk, 'held', { f: sur(ord.F) });
  }
}
