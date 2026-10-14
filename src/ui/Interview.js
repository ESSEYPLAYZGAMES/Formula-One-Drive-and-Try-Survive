// The post-race interview (a career): three questions from a reporter, picked for the day you had - the result, the
// contact you had with someone, your team-mate, the championship, a new part on the car, the paddock - each with four
// short answers. What you say about a driver changes your Paddock Rapport with them (career/Career.js): praise helps,
// blame and digs hurt, and some questions make you choose a name. When someone was hurt or killed in the race, you are
// asked about them first - and what you say about them (support, or a cruel joke) is heard by their team-mate and the
// grid. It all happens in the media pen, in 3D (MediaPen, below), the camera cutting between the journalist and you.
// Every answer also has a tone (humble, confident, diplomatic, cruel, funny, evasive) that the press hears: the career's
// PR desk turns it into headlines and a public image through onTone - never for a question about someone hurt or lost,
// never after a race that hurt someone, never on the way back from an injury. Off the track, the weekend can bring its
// own questions: a scuffle on the grid, the woman you were seen with (what you say reaches her too: onLife), a licence
// full of penalty points.
import * as THREE from 'three';
import { makePerson, makeMic, makePhone, makeArm, makeHelmet } from '../world/People.js';

const CSS = `
#interview { position: fixed; inset: 0; z-index: 45; background: #1d2026; color: #151a22; font-family: 'Segoe UI', Roboto, Arial, sans-serif; opacity: 0; transition: opacity .6s; }
#interview.show { opacity: 1; }
#interview .pen-3d { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#interview .bug { position: absolute; left: 22px; top: 18px; display: flex; gap: 8px; align-items: center; font: 800 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .14em; color: #fff; }
#interview .bug b { background: #c8102e; padding: 6px 9px; border-radius: 4px; } #interview .bug span { background: rgba(0,0,0,.45); padding: 6px 9px; border-radius: 4px; }
#interview .box { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); width: min(880px, calc(100vw - 28px)); background: rgba(255,255,255,.88); backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3); border: 1px solid rgba(255,255,255,.95); border-radius: 18px; box-shadow: 0 16px 50px rgba(0,0,0,.35); padding: 16px 18px 14px; animation: ivIn .4s ease both; }
@keyframes ivIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
#interview .who { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
#interview .mic { width: 34px; height: 34px; border-radius: 50%; background: #c8102e; color: #fff; display: flex; align-items: center; justify-content: center; font: 800 10px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .04em; }
#interview .who b { display: block; font-size: 14px; } #interview .who small { color: #5d6675; font-size: 11.5px; letter-spacing: .12em; }
#interview .n { margin-left: auto; color: #5d6675; font: 700 12px/1 'Segoe UI', Arial, sans-serif; letter-spacing: .2em; }
#interview .q { font: 600 clamp(18px, 2.2vw, 24px)/1.3 Georgia, 'Times New Roman', serif; margin-bottom: 12px; }
#interview .ans { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
#interview .ans button { text-align: left; background: #fff; border: 1px solid #d6dbe3; color: #151a22; border-radius: 11px; padding: 12px 14px; font: 500 15px/1.3 'Segoe UI', Arial, sans-serif; cursor: pointer; transition: transform .12s, box-shadow .12s, border-color .12s; }
#interview .ans button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(25,35,60,.14); border-color: #b9c1cc; }
#interview .ans button i { font-style: normal; color: #6b7480; font-weight: 700; margin-right: 10px; }
#interview .ans button.pick { border-color: #151a22; box-shadow: 0 0 0 2px #151a22; }
#interview .ans button:disabled { cursor: default; } #interview .ans button:disabled:not(.pick) { opacity: .5; }
#interview .react { margin-top: 10px; min-height: 1.5em; color: #3a4350; font: italic 15px/1.45 Georgia, serif; }
#interview .fx { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; min-height: 22px; }
#interview .fx span { font: 700 11.5px/1 'Segoe UI', Arial, sans-serif; padding: 5px 8px; border-radius: 6px; letter-spacing: .04em; }
#interview .fx .up { background: #e3f6ec; color: #16794a; } #interview .fx .down { background: #fde8e8; color: #b42318; }
@media (max-width: 600px) { #interview .ans { grid-template-columns: 1fr; } }
`;
const pick = (a) => a[(Math.random() * a.length) | 0];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const last = (d) => d.name.split(' ').pop();
const first = (d) => d.name.split(' ')[0];
const REPORTERS = [['Sophie Kerr', 'GP TV'], ['Marco Bellini', 'RACE 24'], ['Jess Okafor', 'F1 NEWS'], ['Tom Hale', 'APEX'], ['Ines Duarte', 'PIT LANE'], ['Lukas Weber', 'GRID FM']];
const NEUTRAL = ['Fair enough.', 'Noted.', 'Straight to the point.', 'Plenty to think about, then.', 'Short and sweet.', 'Understood.'];
const NEXT = ['Moving on -', 'One more for you -', "Let's talk about something else -", 'Quickly -', 'Changing the subject -'];

/**
 * An answer: its words, its effects on rapport ([[driverId, delta]]), the pen's reaction (null: a neutral one) and its
 * tone for the press ('humble' | 'confident' | 'diplomatic' | 'cruel' | 'funny' | 'evasive') -> { t, fx, react, tone }
 */
const A = (t, fx = [], react = null, tone = 'diplomatic') => ({ t, fx, react: react || pick(NEUTRAL), tone });
/** an answer about the woman you were seen with: what it tells her (life: 'confirm' | 'private' | 'deny') */
const L = (a, life) => ({ ...a, life });
/**
 * The questions for the day: ctx = { me, teammate, pos, retired, crashed, track, winner, ahead (the car just ahead at
 * the flag), contacts: [{ d, sev, crash }], leader, champGap (you to the leader, + behind), nearest: [d] (the
 * championship around you), grid: [d] (everyone else racing), juniors: [d], upgrade: name | null, grave (a race that
 * hurt someone: no press, nothing off the track), brawl: { d, result, started, escalated, walkedAway } | null (a
 * scuffle on the grid), partner: { id, name, first, public, secret } | null (a woman you are seeing, at the race),
 * points: { n, ban, next, max } | null (8+ penalty points, or a ban to come), tonight: { team, club, city, lean } | null
 * (the night's invitations, career/Party.js: a winner is asked how he will celebrate, and the answer sets lean) }.
 * Drivers are { id, name }.
 * -> [{ k (the topic), q, grave?, about?, answers: [{ t, fx: [[id, delta]], react, tone, life? }] }] (three of them)
 */
/**
 * Back from injury (ctx.comeback: { rounds, at }): before the race, the pen wants to know how you are, what you remember,
 * and what you want from the day. -> three questions
 */
function comebackQuestions(ctx) {
  const { me, teammate: tm, track } = ctx, F = first(me), cb = ctx.comeback || {}, n = cb.rounds || 1, at = cb.at || 'the accident';
  return [
    { k: 'back', q: pick([`${F}, welcome back. How are you feeling?`, `Good to see you back, ${F}. How is the body?`, `${F} - back in the car after ${n === 1 ? 'a race' : `${n} races`} out. How are you?`]), answers: [
      A('Good. Still a bit stiff, but the doctors cleared me and I am ready.', [], 'Good to hear.', 'diplomatic'),
      A('Grateful, more than anything. To the marshals, the medics, the hospital staff.', [], 'A lovely thing to say.', 'humble'),
      A("Like I never left. Let's go racing.", [], 'Straight back to business.', 'confident'),
      A("Nervous, honestly. I'd be lying if I said otherwise.", [], 'Honest.', 'humble')] },
    { k: 'crash', grave: true, q: pick([`Do you remember much of the accident at ${at}?`, 'Have you watched the accident back?', `What went through your mind, in the moments after the crash at ${at}?`]), answers: [
      A('Bits. I watched it back once. That was enough.', [], 'Understandable.', 'diplomatic'),
      A('Every second of it. And it does not scare me.', [], 'Remarkable.', 'confident'),
      A('The halo and the barrier did their job. That is the only reason I am standing here.', [], 'A reminder of why the safety work matters.', 'humble'),
      A("I'd rather not relive it today, if that's okay.", [], 'Of course.', 'evasive')] },
    { k: 'aim', q: pick([`What do you want from today at ${track}?`, 'Any fear getting back in?', `How hard was it watching${tm ? ` ${last(tm)} race` : ''} from home?`]), answers: [
      A('Finish. Get the miles in. The rest will come.', [], 'Sensible.', 'humble'),
      A("Points. I've had enough of watching.", [], 'Hungry.', 'confident'),
      A('Respect, not fear. That is how it should be in this car.', [], 'Well put.', 'diplomatic'),
      ...(tm ? [A(`${last(tm)} kept the team going. I owe them one.`, [[tm.id, 6]], 'The garage will like that.', 'humble')] : [A('Hard. I shouted at the TV more than I should admit.', [], 'Ha. Human.', 'funny')])] },
  ];
}
function questions(ctx) {
  if (ctx.comeback) return comebackQuestions(ctx);
  const { me, teammate: tm, pos, track } = ctx, Q = [];
  // ---- the result (always first) ----
  if (ctx.crashed) Q.push({ k: 'result', q: pick([`Big accident today, ${first(me)}. First of all - are you okay?`, 'That was a heavy one. How are you feeling?', `${first(me)}, what happened out there?`]), answers: [
    A("Sore, but I'm fine. Thanks.", [], null, 'diplomatic'), A('Shaken. That one really hurt.', [], 'Understandable.', 'humble'),
    ...(ctx.contacts[0] ? [A(`${last(ctx.contacts[0].d)} gave me nowhere to go.`, [[ctx.contacts[0].d.id, -12]], 'That will not end the argument.', 'confident')] : [A('The car snapped. No warning at all.', [], null, 'diplomatic')]),
    A("My mistake. I'll own that one.", [], 'Honest, at least.', 'humble')] });
  else if (ctx.retired) Q.push({ k: 'result', q: pick(['A retirement today. How frustrating is that?', `Out of the race at ${track}. What happened?`, 'Another DNF - how do you take that?']), answers: [
    A('Gutted. Reliability has to improve.', [], null, 'confident'), A('It hurts, but these things happen.', [], null, 'diplomatic'), A('The car let us down badly.', [], 'The factory will hear that.', 'confident'), A('Already thinking about the next one.', [], null, 'humble')] });
  else if (pos === 1) Q.push({ k: 'result', q: pick([`A win at ${track}! What made the difference?`, `${first(me)}, race winner! How does that feel?`, 'Victory today. Where did you find the pace?']), answers: [
    A('The team gave me a rocket.', tm ? [[tm.id, 3]] : [], 'The garage will love that.', 'humble'), A('Pure commitment. Nobody wanted it more.', [], 'Confidence in spades.', 'confident'),
    ...(ctx.nearest[0] ? [A(`${last(ctx.nearest[0])} pushed me all the way. Respect.`, [[ctx.nearest[0].id, 8]], 'Gracious in victory.', 'humble')] : [A('Credit to everyone back at the factory.', [], null, 'humble')]),
    A('The others made too many mistakes.', ctx.grid.slice(0, 4).map((d) => [d.id, -4]), "That won't go down well elsewhere.", 'confident')] });
  else if (pos <= 3) Q.push({ k: 'result', q: pick([`P${pos} today. Happy, or does missing the win sting?`, `A podium at ${track} - how do you rate it?`, `P${pos}. Was there more in it?`]), answers: [
    A('Thrilled. The car came alive today.', [], null, 'humble'), A('It stings. I wanted the top step.', [], null, 'confident'),
    ...(ctx.winner ? [A(`${last(ctx.winner)} was just faster. Fair play.`, [[ctx.winner.id, 8]], 'Sporting.', 'humble'), A(`${last(ctx.winner)} got lucky, nothing more.`, [[ctx.winner.id, -10]], 'Ouch.', 'cruel')] : [A('There was a little more in it.', [], null, 'confident'), A("We'll take it and move on.", [], null, 'diplomatic')])] });
  else if (pos <= 10) Q.push({ k: 'result', q: pick([`P${pos} and points on the board. Fair result?`, `Points at ${track}. Satisfied?`, `P${pos} today - is that the maximum?`]), answers: [
    A('Every point counts for us right now.', [], null, 'diplomatic'), A('We maximised everything. Proud of the team.', tm ? [[tm.id, 3]] : [], null, 'humble'), A('Should have been higher, honestly.', [], null, 'confident'),
    ...(ctx.ahead ? [A(`${last(ctx.ahead)} held me up for ages.`, [[ctx.ahead.id, -6]], 'A pointed remark.', 'confident')] : [A('Traffic cost us a lot today.', [], null, 'diplomatic')])] });
  else Q.push({ k: 'result', q: pick(['A quiet afternoon out of the points. What went wrong?', `P${pos} today. Where was the pace?`, `No points at ${track}. How do you explain that?`]), answers: [
    A('We lacked pace. Simple as that.', [], null, 'humble'), A("Strategy hurt us. We'll review it.", [], null, 'diplomatic'),
    ...(ctx.ahead ? [A(`${last(ctx.ahead)} blocked me for laps. Poor racing.`, [[ctx.ahead.id, -8]], 'Strong words.', 'confident')] : [A('Too much traffic, too many compromises.', [], null, 'diplomatic')]),
    A('Not our day. We go again.', [], null, 'humble')] });

  // ---- someone hurt or killed in the race: always asked, the worst first (support them - or not; the pen hears it)
  const H = (ctx.hurt || []).slice().sort((x, y) => (y.dead ? 1 : 0) - (x.dead ? 1 : 0))[0];
  if (H) {
    const X = H.d, M = H.mate, grid = ctx.grid.filter((d) => d.id !== X.id && (!M || d.id !== M.id)), all = (v) => grid.map((d) => [d.id, v]);
    const mate = (v) => (M ? [[M.id, v]] : []);
    if (H.dead) Q.unshift({ k: 'loss', grave: true, q: pick([`${first(X)} lost his life today. What would you like to say?`, `The paddock has lost ${X.name}. Your thoughts?`, `How does anyone race on after losing ${first(X)}?`, `${X.name} is gone. What was he like?`]), answers: [
      A('Rest in peace, brother. We race for you.', [...mate(10), ...all(3)], 'The pen falls silent. Somebody wipes their eyes.', 'humble'),
      A("I can't talk about it. I'm sorry.", mate(4), 'A long silence, and the press officer leads him away for a moment.', 'evasive'),
      H.contact ? A('It was a racing incident. Nothing more.', [...mate(-14), ...all(-2)], 'Some of the journalists look at each other.', 'diplomatic') : A("It's the risk we all sign up for.", mate(-8), 'Some of the journalists look at each other.', 'diplomatic'),
      A('He took risks nobody else would. Predictable.', [...mate(-35), ...all(-10)], 'Gasps. The press officer steps in: "That\'s enough." By tonight it is everywhere.', 'cruel')] });
    else Q.push({ k: 'hurt', grave: true, q: H.contact ? pick([`You collided with ${last(X)}, who is now in hospital. Thoughts?`, `${first(X)} is in hospital after your clash. Anything to say?`]) : pick([`${first(X)} is in hospital. Any message for him?`, `Have you heard anything about ${first(X)}?`, `${last(X)} was hurt today. How are you feeling?`]), answers: [
      A('Get well soon, mate. We need you back.', [[X.id, 10], ...mate(4)], 'Warm, and it sounds meant.', 'humble'),
      H.contact ? A("That one's on me. I'm truly sorry.", [[X.id, 16], ...mate(6)], 'Honest. It will be noticed in his garage.', 'humble') : A("Scary to watch. Thank God he's conscious.", [[X.id, 6]], 'Relief, plainly.', 'humble'),
      A("He'll be fine. These things happen.", [[X.id, -4]], 'A shrug that does not land well.', 'diplomatic'),
      A(H.contact ? 'Maybe now he\'ll learn to leave space.' : 'Ha. He had that coming.', [[X.id, -26], ...mate(-12), ...all(-4)], 'The pen goes quiet. That will travel.', 'cruel')] });
  }

  // ---- off the track (only after a race that hurt nobody: a day with someone in hospital keeps to that)
  const calm = !ctx.grave && !(ctx.hurt || []).length, B = calm ? ctx.brawl : null, P = calm ? ctx.partner : null, N = calm ? ctx.points : null;
  // (a scuffle on the grid is the story of the day: always asked, right after the result)
  if (B?.d) {
    const X = B.d;
    if (B.walkedAway) Q.push({ k: 'brawl', about: X, q: pick([`${first(X)} shoved you on the grid and you walked away. Why not stand your ground?`, `There was a shove from ${last(X)} before the start, and you turned your back on it. Was that hard?`]), answers: [
      A('There was a race to run. That is where it counts.', [[X.id, 3]], 'Measured.', 'humble'),
      A("It wasn't worth it. We'll sort it out like adults.", [[X.id, 5]], 'A cool head.', 'diplomatic'),
      A('I answered him on the track. That is the only answer that matters.', [[X.id, -4]], 'A pointed one.', 'confident'),
      A('My engineer told me to save my energy for the start.', [], 'A laugh from the back of the pen.', 'funny')] });
    else Q.push({ k: 'brawl', about: X, q: pick([`What happened with ${last(X)} before the start?`, `${first(X)} and you had to be pulled apart on the grid. What was that about?`, `The cameras caught you and ${last(X)} squaring up before the race. Your side of it?`]), answers: [
      A(B.started ? 'I lost my head. That is not who I want to be, and I will say sorry to him.' : 'I should have walked away. I am not proud of it.', [[X.id, 8]], 'Contrite. It will be noticed.', 'humble'),
      Math.random() < 0.5 ? A("Heat of the moment. It's done - we've shaken hands.", [[X.id, 3]], 'Diplomatic.', 'diplomatic') : A(B.result === 'lost' ? 'Handbags. My pride came off worse than my overalls.' : 'Handbags. Neither of us will be giving up the day job.', [[X.id, 2]], 'The pen laughs. The stewards may not.', 'funny'),
      A(B.started ? 'He knows what he did on track. I am not going to pretend otherwise.' : 'He came at me. I was not going to stand there and take it.', [[X.id, -8]], 'No backing down.', 'confident'),
      A("Maybe now he'll think twice before he chops across me.", [[X.id, -14]], 'That will run and run.', 'cruel')] });
  }

  // ---- the rest: a pool for the day ----
  const pool = [], hurt = new Set((ctx.hurt || []).map((h) => h.d?.id));
  for (const c of ctx.contacts.slice(0, 2)) {
    // (the driver you touched is the one in hospital: about him, nothing for the press)
    const X = c.d, gr = hurt.has(X.id);
    if (c.crash) pool.push({ k: 'clash', grave: gr, w: 5, q: pick([`${first(X)} is out after your clash. Any regrets?`, `You and ${last(X)} collided and ${first(X)} retired. Your view?`]), answers: [
      A("Of course. I'll speak to him.", [[X.id, 12]], 'Bridges mended, maybe.', 'humble'), A("No regrets. That's racing.", [[X.id, -10]], 'He may see it differently.', 'confident'),
      A('He turned in on me. Not my fault.', [[X.id, -16]], 'This one will run.', 'confident'), A("Hope he's okay. That's what matters.", [[X.id, 8]], 'A human answer.', 'humble')] });
    else pool.push({ k: 'contact', grave: gr, w: 4, q: pick([`You and ${last(X)} touched out there. Whose fault?`, `There was contact with ${first(X)}. How did you see it?`, `${last(X)} - racing incident, or something more?`]), answers: [
      A("Racing incident. Nobody's fault.", [[X.id, 6]], 'Diplomatic.', 'diplomatic'), A('He left me no room at all.', [[X.id, -12]], "That'll add fuel to the fire.", 'confident'),
      A("My fault. I'll apologise to him.", [[X.id, 14]], 'Big of you to admit.', 'humble'), A("Ask him. I'm done talking about it.", [[X.id, -6]], 'Clearly a sore point.', 'evasive')] });
  }
  if (tm) {
    pool.push({ k: 'teammate', w: 2, q: pick([`How's the atmosphere with ${first(tm)} right now?`, `Rate your relationship with ${last(tm)}.`, `Are you and ${first(tm)} getting on?`]), answers: [
      A("Best team-mate I've ever had.", [[tm.id, 14]], 'High praise.', 'humble'), A('We push each other hard. Healthy.', [[tm.id, 5]], null, 'diplomatic'),
      A('He needs to find more pace.', [[tm.id, -14]], "He'll read that.", 'cruel'), A('No comment on that one.', [[tm.id, -4]], 'Telling.', 'evasive')] });
    if (ctx.tmAhead) pool.push({ k: 'teammate', w: 3, q: pick([`${first(tm)} finished ahead today. Does that worry you?`, `Beaten by your team-mate today - thoughts?`]), answers: [
      A('Credit to him, he was faster.', [[tm.id, 8]], 'Fair.', 'humble'), A("Different strategies. It'll even out.", [], null, 'diplomatic'), A('The team gave him the better strategy.', [[tm.id, -8]], 'Trouble in the garage?', 'confident'), A("Not at all. I'm not worried.", [[tm.id, -2]], null, 'confident')] });
    // choose a name: replace your team-mate
    const cands = shuffle(ctx.grid.filter((d) => d.id !== tm.id)).slice(0, 3);
    if (cands.length === 3) pool.push({ k: 'replace', w: 2, q: pick(['If you could replace your team-mate, who would it be?', `Hypothetically - who would you rather have than ${first(tm)}?`]), answers: [
      ...cands.map((d) => A(`${d.name}, without a doubt.`, [[d.id, 10], [tm.id, -20]], `${first(tm)} won't enjoy that.`, 'confident')), A(`Nobody. ${first(tm)} is my guy.`, [[tm.id, 12]], 'Loyal.', 'humble')] });
  }
  // choose a name: the best on the grid, the toughest rival, the young talent, trust, the dirtiest
  const top = shuffle(ctx.grid.slice(0, 6)).slice(0, 3);
  if (top.length === 3) pool.push({ k: 'best', w: 2, q: pick(["Who's the best driver on the grid right now?", 'Name the driver you rate most highly.', 'Best on the grid - excluding yourself?']), answers: [
    ...top.map((d) => A(`${d.name}. The complete package.`, [[d.id, 10]], 'A compliment he will hear.', 'humble')), A('Me. Next question.', top.map((d) => [d.id, -3]), 'Of course.', 'funny')] });
  const near = ctx.nearest.slice(0, 3);
  if (near.length === 3) pool.push({ k: 'rival', w: 2, q: pick(["Who's your toughest opponent this season?", 'Which rival worries you most?']), answers: [
    ...near.map((d) => A(`${last(d)}. Never makes it easy.`, [[d.id, 6]], 'Respect.', 'diplomatic')), A('Only myself, honestly.', [], 'Philosophical.', 'diplomatic')] });
  const jr = shuffle(ctx.juniors).slice(0, 3);
  if (jr.length === 3) pool.push({ k: 'juniors', w: 1, q: pick(['Which young driver impresses you most?', 'Who is the next big thing?']), answers: [
    ...jr.map((d) => A(`${d.name}. Real talent there.`, [[d.id, 12]], 'He will remember that.', 'humble')), A('None of them yet, honestly.', jr.map((d) => [d.id, -4]), 'Harsh.', 'confident')] });
  const trust = shuffle(ctx.grid).slice(0, 3);
  if (trust.length === 3) pool.push({ k: 'trust', w: 1, q: pick(['Who would you trust wheel-to-wheel at 300 km/h?', 'Whose racecraft do you trust most?']), answers: [
    ...trust.map((d) => A(`${d.name}. Always fair.`, [[d.id, 10]], 'Nice.', 'humble')), A('Nobody. You never fully trust anyone.', [], 'Spoken like a racer.', 'confident')] });
  const dirty = (ctx.hostile.length >= 3 ? ctx.hostile : shuffle(ctx.grid)).slice(0, 3);
  if (dirty.length === 3) pool.push({ k: 'dirty', w: 1, q: pick(["Who's the dirtiest racer out there?", 'Is there anyone you just can\'t race cleanly with?']), answers: [
    ...dirty.map((d) => A(`${d.name}. Everyone knows it.`, [[d.id, -18]], 'That will make headlines.', 'cruel')), A("Nobody. It's a clean grid.", [], 'Diplomatic.', 'diplomatic')] });
  // the championship
  if (ctx.leader && ctx.champGap > 0 && ctx.champGap <= 60) pool.push({ k: 'title', w: 3, q: pick([`${last(ctx.leader)} leads you by ${ctx.champGap} points. Can you catch him?`, `${ctx.champGap} points to ${first(ctx.leader)}. Realistic?`]), answers: [
    A(`${last(ctx.leader)} is beatable. Watch this space.`, [[ctx.leader.id, -4]], 'Fighting talk.', 'confident'), A("He's the benchmark. Huge respect.", [[ctx.leader.id, 8]], null, 'humble'),
    A('One race at a time for us.', [], null, 'diplomatic'), A('His car is doing the work.', [[ctx.leader.id, -10]], 'He will not like that.', 'cruel')] });
  if (ctx.leading && near.length >= 3) pool.push({ k: 'title', w: 3, q: pick(['You lead the championship. Biggest threat?', 'Top of the table - who can stop you?']), answers: [
    ...near.map((d) => A(`${last(d)}. Fast and relentless.`, [[d.id, 6]], null, 'diplomatic')), A('Nobody can stop us now.', near.map((d) => [d.id, -4]), 'Bold.', 'confident')] });
  // the car, the team
  if (ctx.upgrade) pool.push({ k: 'upgrade', w: 2, q: pick([`The new ${ctx.upgrade} - did it make a difference?`, `How much did the ${ctx.upgrade} bring?`]), answers: [
    A('Massive step. The factory delivered.', [], null, 'humble'), A("Small gain, but we're learning.", [], null, 'diplomatic'), A('Too early to tell, honestly.', [], null, 'evasive'), A('We need more, and faster.', [], null, 'confident')] });
  pool.push({ k: 'owner', w: 1, q: pick(['As the owner, are you spending enough on the car?', 'Driver and owner - how do you balance it?']), answers: [
    A('Every penny goes into speed.', [], null, 'confident'), A("We're building for the long term.", [], null, 'diplomatic'), A("The budget's tight. We'll be smart.", [], null, 'humble'), A('Ask the accountants, not me.', [], 'Ha.', 'funny')] });
  // the woman you were seen with (what you say, she hears too; a new story is more of one than a known couple)
  if (P) pool.push({ k: 'partner', w: P.public ? 3 : 5, q: P.public ? pick([`${P.first} was in the garage for you today. How much does that support mean?`, `We saw ${P.name} cheering you on. Is she good for your racing?`])
    : pick([`You were seen with ${P.name} this weekend - anything to tell us?`, `${P.name} was here today, and not for the first time. Are you two together?`, `The photographers spotted you with ${P.name}. Is there something you want to share?`]), answers: P.public ? [
    L(A('Everything. She keeps my feet on the ground.', [], 'Warm, and it sounds meant.', 'humble'), 'confirm'),
    L(A('She is the reason I can switch off away from the track.', [], 'A rare glimpse behind the visor.', 'diplomatic'), 'confirm'),
    L(A("I'd rather keep that part of my life to myself.", [], 'Fair enough.', 'diplomatic'), 'private'),
    L(A("She says I'm quieter after a bad race. I say she's wrong.", [], 'A smile from the pen.', 'funny'), 'confirm')] : [
    L(A("Yes, we're together - and we're happy.", [], 'That will be on every front page tomorrow.', 'confident'), 'confirm'),
    L(A("That's private, and I'd like to keep it that way.", [], 'Polite, and firm.', 'diplomatic'), 'private'),
    L(A("We're friends. That's all.", [], 'Not everyone in the pen looks convinced.', 'evasive'), 'deny'),
    L(A('She was lost. I showed her the way to the garage.', [], 'Laughter - and no answer.', 'funny'), 'private')] });
  // the licence: a ban to come (a story of the day: always asked when the day leaves room for it), or close to one
  // (twelve points within twelve months is a one-race ban)
  const max = N?.max || 12;
  if (N?.ban) (Q.length < 3 ? Q : pool).push({ k: 'points', w: 6, q: pick([`${Math.max(max, N.n)} penalty points: you will miss ${N.next || 'the next race'}. How do you feel?`, `That takes you to ${N.n} points and a one-race ban. What do you say to the team?`]), answers: [
    A('I let the team down. I will learn from it, and I will be back.', [], 'Contrite.', 'humble'),
    A('Rules are rules. I accept it.', [], 'No arguments, then.', 'diplomatic'),
    A('Some of those calls were harsh, but I will come back stronger.', [], 'A little defiance.', 'confident'),
    A("I'd rather not talk about it today.", [], 'He clearly would not.', 'evasive')] });
  else if (N && N.n >= 8) pool.push({ k: 'points', w: 3, q: pick([`You're on ${N.n} penalty points. Worried about a ban?`, `${N.n} points on the licence - ${Math.max(1, max - N.n)} more and you sit a race out. Does that change how you drive?`]), answers: [
    A('Yes. I have to clean it up, starting now.', [], 'Honest.', 'humble'),
    A('No. I race hard, and the stewards do their job.', [], 'Unrepentant.', 'confident'),
    A("I'll be careful. Nobody wants to miss a race.", [], 'Sensible.', 'diplomatic'),
    A('I have been told to drive like my grandmother. She is quicker than you would think.', [], 'Laughter in the pen.', 'funny')] });
  // the night ahead: a winner with somewhere to go tonight is asked last how he will celebrate (what he says opens the
  // hub's TONIGHT sheet on that card)
  const T = calm && pos === 1 && !ctx.retired && Q.length < 3 && ctx.tonight && (ctx.tonight.team || ctx.tonight.club) ? tonightQuestion(ctx) : null;
  // two more, weighted, different (one, when the night ahead takes the last place)
  const picked = [];
  for (let k = 0; k < 3 - Q.length - (T ? 1 : 0) && pool.length; k++) {
    const tot = pool.reduce((a, p) => a + p.w, 0); let x = Math.random() * tot, i = 0;
    for (; i < pool.length - 1; i++) { x -= pool[i].w; if (x <= 0) break; }
    picked.push(pool.splice(i, 1)[0]);
  }
  return [...Q, ...picked, ...(T ? [T] : [])].map((q) => ({ ...q, answers: shuffle(q.answers) }));
}
/**
 * 'How will you celebrate tonight?' - ctx.tonight: { team (the team's celebration is open to you), club (a club night is),
 * city }. Each answer carries night: 'team' | 'club' | 'hotel', the card it leans to (ctx.tonight.lean once answered).
 */
function tonightQuestion(ctx) {
  const T = ctx.tonight, city = String(T.city || ''), vegas = /vegas/i.test(city), london = /london/i.test(city);
  const N = (a, night) => ({ ...a, night }), ans = [];
  if (T.team) ans.push(N(A('With the team. They built this car - tonight is theirs as much as mine.', [], 'The garage will be loud tonight.', 'humble'), 'team'));
  if (T.club) ans.push(N(A(vegas ? "It's Vegas. Nobody sleeps here tonight - me included." : london ? 'Into London. I am told Mayfair stays open late.' : 'Out. A night like this does not come round often.', [], 'A cheer from the back of the pen.', 'confident'), 'club'));
  ans.push(N(A('Dinner, then an early night. The next one starts tomorrow.', [], 'Ever the professional.', 'diplomatic'), 'hotel'));
  ans.push(N(A('My engineer has a list of rules for tonight. I have not read it.', [], 'Laughter. The press officer is not laughing.', 'funny'), T.club ? 'club' : 'team'));
  if (ans.length < 4) ans.push(N(A('A quiet drink with my family. They flew out for this one.', [], 'A softer side.', 'humble'), 'hotel'));
  return { k: 'tonight', q: pick(['How will you celebrate tonight?', 'Big night ahead - how are you celebrating?', `${first(ctx.me)}, what does tonight look like?`]), answers: ans };
}
/** a follow-up to a strong answer about one driver (blame or praise): it takes the next question's place */
function followUp(X, neg) {
  if (neg) return { k: 'follow', follow: true, q: pick([`Strong words about ${last(X)}. Is a feud starting?`, `Those are pointed comments. ${first(X)} will hear them.`, `Do you expect ${last(X)} to answer that?`, `Would you say that to ${first(X)}'s face?`]), answers: shuffle([
    A('Let him talk. My driving answers.', [[X.id, -4]], 'Defiant.', 'confident'), A('Maybe I went too far there.', [[X.id, 8]], 'A step back.', 'humble'),
    A('Every word stands. No regrets.', [[X.id, -8]], 'No backing down, then.', 'confident'), A("We'll sort it out face to face.", [[X.id, 4]], 'Sensible.', 'diplomatic')]) };
  return { k: 'follow', follow: true, q: pick([`Kind words for ${last(X)}. A friendship there?`, `Would you want ${first(X)} as a team-mate?`, `Has ${last(X)} earned your respect this year?`]), answers: shuffle([
    A('Absolutely. We go back years.', [[X.id, 6]], 'Warm.', 'humble'), A('Respect, yes. Friends, not really.', [], 'Measured.', 'diplomatic'),
    A('On track, nobody is my friend.', [[X.id, -3]], 'Old-school.', 'confident'), A("He'd always be welcome with us.", [[X.id, 8]], 'An open door.', 'humble')]) };
}

/**
 * The media pen, in 3D (its own small WebGL view behind the questions): your driver in the team's race suit and cap
 * behind the waist-high barrier, the sponsors' step-and-repeat board behind, the journalists on the other side with
 * their microphones and phones pushed in under the chin, a TV camera and its light. The camera cuts like a TV crew's:
 * on the journalist asking, in close on you while you answer, wide between questions.
 */
class MediaPen {
  constructor(host, look) {
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    this.canvas = document.createElement('canvas'); this.canvas.className = 'pen-3d'; host.prepend(this.canvas);
    const R = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
    const S = this.scene = new THREE.Scene(); S.background = new THREE.Color('#1d2026'); S.fog = new THREE.Fog('#1d2026', 7, 22);
    this.people = [];
    const add = (p, x, z, face) => { p.group.position.set(x, 0, z); p.group.rotation.y = face; S.add(p.group); this.people.push(p); return p; };
    // the floor and the board behind you: white, the logos repeated (made-up media and the team)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: '#3a3d44', roughness: 0.9 })); floor.rotation.x = -Math.PI / 2; S.add(floor);
    const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 1024; const x = cv.getContext('2d');
    x.fillStyle = '#f6f7f9'; x.fillRect(0, 0, 2048, 1024);
    const logos = [['F1 NEWS', '#c8102e'], [String(look.team || '').toUpperCase(), look.color], ['GRID', '#151a22'], ['PIT LANE', '#1aa34a'], ['APEX', '#d4002a'], ['RACE 24', '#0b3d91']];
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) { const [t, col] = logos[(r * 2 + c) % logos.length]; x.fillStyle = col === '#ffffff' || !col ? '#151a22' : col; x.font = `900 ${t.length > 9 ? 44 : 58}px "Segoe UI", Arial, sans-serif`; x.fillText(t, 150 + c * 300 + (r % 2) * 150, 90 + r * 170); }
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.35 })); board.position.set(0, 1.75, -0.95); S.add(board);
    // the barrier between you and them: posts, a top rail, a printed panel
    const steel = new THREE.MeshStandardMaterial({ color: '#9aa0a8', roughness: 0.35, metalness: 0.7 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(6, 0.05, 0.05), steel); rail.position.set(0, 1.02, 0.55); S.add(rail);
    for (const px of [-2.8, -1.4, 0, 1.4, 2.8]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.02, 0.05), steel); post.position.set(px, 0.51, 0.55); S.add(post); }
    const pcv = document.createElement('canvas'); pcv.width = 1024; pcv.height = 128; const px2 = pcv.getContext('2d'); px2.fillStyle = look.color || '#e10600'; px2.fillRect(0, 0, 1024, 128); px2.fillStyle = '#ffffff'; px2.font = '900 64px "Segoe UI", Arial, sans-serif'; px2.textAlign = 'center'; px2.textBaseline = 'middle'; px2.fillText(`${String(look.team || '').toUpperCase()} · MEDIA`, 512, 66);
    const ptex = new THREE.CanvasTexture(pcv); ptex.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(6, 0.45), new THREE.MeshStandardMaterial({ map: ptex, roughness: 0.6 })); panel.position.set(0, 0.78, 0.58); S.add(panel);
    // you: the race suit in the team's colours, the cap; talking to them
    this.me = add(makePerson({ pose: 'talk', kit: 'suit', color: look.color, accent: look.color2 || '#ffffff', cap: true, jitter: 0.01, driver: look.driver, teamName: look.team }), 0, 0, -Math.PI / 2);
    this.me.group.traverse((m) => { if (m.isMesh && m.material.emissive) m.material.emissive.copy(m.material.color).multiplyScalar(0.12); });
    // your helmet (your own design), carried at your side
    const hel = makeHelmet(look.helmet || '#ffffff', look.color || '#777', look.number ?? '', { driver: look.driver });
    hel.position.set(0.27, 1.02, 0.1); hel.rotation.set(0.15, -1.2, -0.35); S.add(hel);
    // the journalists, on the other side, a little lower (leaning in), each with a microphone or a phone held in
    const mouth = V3(0, 1.55, 0), SK = ['#f1d2b6', '#e3b994', '#cf9a72', '#8d5a3b'], CL = ['#2b2e35', '#3a3f48', '#1c2a44', '#4a4a4a', '#5a2e2e', '#2e4a3a'];
    const flags = shuffle([['#c8102e', 'F1 NEWS'], ['#0b3d91', 'GP TV'], ['#f2c200', 'RACE 24', '#111'], ['#ffffff', 'APEX', '#d4002a'], ['#1aa34a', 'PIT LANE'], ['#6a1b9a', 'GRID FM']]);
    this.reporters = [];
    [-1.05, -0.45, 0.2, 0.8, 1.35].forEach((rx, i) => {
      const p = add(makePerson({ pose: 'talk', kit: pick(['polo', 'jacket']), color: pick(CL), jitter: 0.025 }), rx, 1.05 + (i % 2) * 0.25, Math.PI / 2 + Math.atan2(rx, 1.1) * 0.6);
      this.reporters.push(p);
      // a microphone in under your chin (or a phone recording), on an arm reaching from their shoulder
      const shoulder = V3(rx * 0.92 + (rx > 0 ? -0.18 : 0.18), 1.32, 1.0 + (i % 2) * 0.25);
      const off = (i - 2) * 0.075, head = mouth.clone().add(V3(off, -0.1 - Math.random() * 0.06, 0.16 + Math.random() * 0.06));
      if (i === 4) { const ph = makePhone(); ph.position.copy(head).add(V3(0.05, 0.04, 0.05)); ph.lookAt(0, 1.55, 3); S.add(ph); S.add(makeArm(shoulder, ph.position.clone().add(V3(0, -0.05, 0.04)), pick(CL), pick(SK))); return; }
      const [col, label, ink] = flags[i % flags.length];
      const mic = makeMic(col, label, ink); mic.position.copy(head); mic.lookAt(mouth); mic.rotateY(-Math.PI / 2); mic.rotateX((Math.random() - 0.5) * 0.4); S.add(mic);
      S.add(makeArm(shoulder, head.clone().add(V3(0, -0.08, 0.2)), pick(CL), pick(SK)));
    });
    // the press officer at your shoulder - upright, recording it on a phone in both hands, the head bowed to it as the
    // pose holds it (its neck bent to match: never a head turned against its own neck) - the TV camera on its tripod
    // and its light
    {
      const po = add(makePerson({ pose: 'record', kit: 'polo', color: look.color, jitter: 0.01 }), -0.75, -0.35, -Math.PI / 2 + 0.6), b = po.group.children[0]; po.group.updateMatrixWorld(true);
      const ph = makePhone(); ph.position.copy(b.localToWorld(po.wrR.clone().setZ(0).add(V3(0.035, 0.035, 0)))); ph.lookAt(b.localToWorld(po.neck.clone())); S.add(ph);
    }
    const dark = new THREE.MeshStandardMaterial({ color: '#16181c', roughness: 0.5 });
    const tv = new THREE.Group(); tv.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.5), dark)); const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.22, 16).rotateX(Math.PI / 2), dark); lens.position.z = -0.34; tv.add(lens);
    for (const a of [0, 2.1, 4.2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6), steel); leg.position.set(Math.cos(a) * 0.25, -0.75, Math.sin(a) * 0.25); leg.rotation.set(Math.sin(a) * 0.2, 0, -Math.cos(a) * 0.2); tv.add(leg); }
    tv.position.set(1.7, 1.6, 2.4); tv.lookAt(0, 1.5, 0); S.add(tv);
    // the light: the paddock's evening, the camera light on you, the board lit
    S.add(new THREE.HemisphereLight(0xdfe6ff, 0x30333a, 1.25));
    const back = new THREE.DirectionalLight(0xfff1e0, 1.4); back.position.set(0.5, 3.2, -2.5); back.target.position.set(0, 1.3, 1.2); S.add(back, back.target);   // (the pen's own floodlights, over your shoulder onto the journalists)
    const key = new THREE.SpotLight(0xfff3e4, 26, 12, 0.5, 0.8, 1.5); key.position.set(1.2, 2.4, 2.6); key.target.position.set(0, 1.45, 0); S.add(key, key.target);
    const fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(-2, 3, 2); S.add(fill);
    // a photographer's flash now and then, from somewhere in the pack
    this.flashL = new THREE.PointLight(0xffffff, 0, 6, 2); S.add(this.flashL); this.flashT = 1 + Math.random() * 2; this.flashOn = 0;
    this.cam = new THREE.PerspectiveCamera(32, 1, 0.05, 60);
    this.shots = { wide: { p: V3(0.9, 1.75, 3.6), l: V3(0, 1.4, 0), f: 34 }, me: { p: V3(-0.12, 1.6, 0.92), l: V3(0, 1.5, 0), f: 34 } };
    this.shot = 'wide'; this.asker = 0; this.talk = 0; this.t = 0; this.on = true; this.cur = { p: this.shots.wide.p.clone(), l: this.shots.wide.l.clone(), f: 34 };
    const loop = (now) => { if (!this.on) return; this.frame(Math.min(0.05, (now - (this.last || now)) / 1000)); this.last = now; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  /** cut to: 'wide', 'me' (you, close), 'asker' (over your shoulder to the journalist asking: i) */
  cut(shot, i = 0) {
    this.shot = shot; this.asker = i;
    const s = this.target(); this.cur.p.copy(s.p); this.cur.l.copy(s.l); this.cur.f = s.f;   // (a cut, not a pan)
  }
  target() {
    if (this.shot !== 'asker') return this.shots[this.shot];
    const r = this.reporters[this.asker % this.reporters.length].group.position;
    return { p: new THREE.Vector3(-0.78, 1.72, -0.32), l: new THREE.Vector3(r.x, 1.5, r.z), f: 30 };   // (over your shoulder, your cap at the edge of the frame)
  }
  frame(dt) {
    this.t += dt; const t = this.t, c = this.canvas, w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight;
    if (c.width !== Math.round(w * this.renderer.getPixelRatio())) { this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
    const s = this.target(), k = Math.min(1, dt * 1.2);
    this.cur.p.lerp(s.p, k * 0.3); this.cur.l.lerp(s.l, k * 0.3);
    // (handheld: a small drift and breathing in the shot)
    this.cam.position.copy(this.cur.p).add(new THREE.Vector3(Math.sin(t * 0.7) * 0.012, Math.sin(t * 1.1) * 0.008, 0));
    this.cam.lookAt(this.cur.l); this.cam.rotateZ(0.01 * Math.sin(t * 0.45));
    if (Math.abs(this.cam.fov - s.f) > 0.01) { this.cam.fov = s.f; this.cam.updateProjectionMatrix(); }
    // you: talking (the head nodding with the words) or listening (still, a slight tilt)
    this.talk = Math.max(0, this.talk - dt);
    const H = this.me.head; H.rotation.z = this.talk > 0 ? 0.05 * Math.sin(t * 6.3) * Math.max(0, Math.sin(t * 2.1)) - 0.02 : -0.03 + 0.015 * Math.sin(t * 0.6); H.rotation.y = this.talk > 0 ? 0.08 * Math.sin(t * 1.3) : 0.04 * Math.sin(t * 0.4);
    this.flashT -= dt; this.flashOn = Math.max(0, this.flashOn - dt);
    if (this.flashT <= 0) { this.flashT = 1.2 + Math.random() * 3.5; this.flashOn = 0.07; const r = pick(this.reporters).group.position; this.flashL.position.set(r.x + (Math.random() - 0.5) * 0.4, 1.9, r.z + 0.3); }
    this.flashL.intensity = this.flashOn > 0 ? 9 : 0;
    this.reporters.forEach((r, i) => { r.head.rotation.z = (i === this.asker && this.shot === 'asker' ? 0.05 * Math.sin(t * 5.5) : 0) + 0.01 * Math.sin(t * 0.8 + i); });
    this.renderer.render(this.scene, this.cam);
  }
  dispose() {
    this.on = false;
    for (const p of this.people) p.dispose?.();
    this.scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.map?.dispose(); o.material.dispose?.(); } });
    this.renderer.dispose(); this.renderer.forceContextLoss?.(); this.canvas.remove();
  }
}

/**
 * The interview, in the media pen: ctx (above, with look: { team, color, color2 } for your kit), relate(id, delta, why)
 * for each effect, nameOf(id), done(); onTone(tone, topic, outletName, about) for what the press makes of each answer
 * (about: the driver a scuffle question was about, { id, name }), onLife(kind) for what the partner question tells her
 * ('confirm' | 'private' | 'deny' -> her affection's change, for the chip). Neither is called for a question about
 * someone hurt or lost (q.grave), after a race that hurt someone (ctx.grave) or in the comeback interview. Each
 * question: the camera on the journalist asking, then on you; your answer spoken (you, close), the pen's reaction, what
 * it does to your standing with them; wide between questions.
 */
export function showInterview(ctx, relate, nameOf, done, onTone = null, onLife = null) {
  if (!document.getElementById('interview-css')) { const st = document.createElement('style'); st.id = 'interview-css'; st.textContent = CSS; document.head.appendChild(st); }
  const [rn, outlet] = pick(REPORTERS), Qs = questions(ctx);
  const who = new Map(); for (const d of [ctx.teammate, ctx.winner, ctx.ahead, ctx.leader, ctx.brawl?.d, ...ctx.contacts.map((c) => c.d), ...ctx.nearest, ...ctx.grid, ...ctx.juniors]) if (d) who.set(d.id, d);
  const el = document.createElement('div'); el.id = 'interview'; document.body.appendChild(el);
  let pen = null; try { pen = new MediaPen(el, ctx.look || {}); } catch (e) { pen = null; }   // (no WebGL: the questions alone)
  const ui = document.createElement('div'); el.appendChild(ui);
  let i = 0, askers = shuffle([0, 1, 2, 3, 4]);
  const show = () => {
    const q = Qs[i];
    ui.innerHTML = `<div class="bug"><b>MEDIA PEN</b><span>${esc(ctx.track || '')} · ${esc(ctx.label || 'POST-RACE')}</span></div>
      <div class="box"><div class="who"><div class="mic">${esc(outlet.split(' ')[0].slice(0, 4))}</div><div><b>${esc(rn)}</b><small>${esc(outlet)}</small></div><div class="n">${i + 1} / ${Qs.length}</div></div>
      <div class="q">${i && !q.follow && !q.grave ? `<span style="color:#6b7480">${pick(NEXT)}</span> ` : ''}${esc(q.q)}</div>
      <div class="ans">${q.answers.map((a, k) => `<button data-k="${k}"><i>${k + 1}</i>${esc(a.t)}</button>`).join('')}</div>
      <div class="react"></div><div class="fx"></div></div>`;
    pen?.cut('asker', askers[i % askers.length]); setTimeout(() => { if (!el.dataset.busy && pen?.shot === 'asker') pen.cut('me'); }, 2200);
    requestAnimationFrame(() => el.classList.add('show')); setTimeout(() => el.classList.add('show'), 30);
  };
  const choose = (k) => {
    const q = Qs[i], a = q.answers[k]; if (!a || el.dataset.busy) return; el.dataset.busy = '1';
    ui.querySelectorAll('.ans button').forEach((b, j) => { b.disabled = true; if (j === k) b.classList.add('pick'); });
    if (pen) { pen.cut('me'); pen.talk = 1.8; }
    ui.querySelector('.react').textContent = a.react;
    const fx = ui.querySelector('.fx'), got = [];
    for (const [id, dv] of a.fx) { const g = relate(id, dv, dv <= -12 ? 'after what you said in an interview' : null); if (g) got.push([id, g]); }
    got.sort((x, y) => Math.abs(y[1]) - Math.abs(x[1]));
    for (const [id, g] of got.slice(0, 5)) fx.insertAdjacentHTML('beforeend', `<span class="${g > 0 ? 'up' : 'down'}">${esc(nameOf(id))} ${g > 0 ? '+' : ''}${g}</span>`);
    if (got.length > 5) fx.insertAdjacentHTML('beforeend', `<span class="${got[5][1] > 0 ? 'up' : 'down'}">+${got.length - 5} more drivers</span>`);
    // (the press hears the tone of it, and she hears what you said about the two of you - none of it about the hurt or
    //  the lost, after a race that hurt someone, or on the way back from an injury)
    const quiet = q.grave || ctx.grave || ctx.comeback;
    let life = 0;
    if (!quiet) {
      try { if (a.tone) onTone?.(a.tone, q.k || 'general', outlet, q.about || null); } catch (e) { console.warn('interview: tone', e); }
      try { if (a.life && onLife) life = +onLife(a.life) || 0; } catch (e) { console.warn('interview: life', e); }
      if (a.night && ctx.tonight) ctx.tonight.lean = a.night;   // (the night ahead: main.js keeps it for the TONIGHT sheet)
    }
    if (life) fx.insertAdjacentHTML('beforeend', `<span class="${life > 0 ? 'up' : 'down'}">${esc(ctx.partner?.first || 'Her')} ${life > 0 ? '+' : ''}${life}</span>`);
    // (a strong answer about one driver: the reporter follows it up - never in place of the question about someone hurt
    //  or lost, nor of the scuffle or the licence)
    const one = a.fx.length === 1 && Math.abs(a.fx[0][1]) >= 10 && who.get(a.fx[0][0]);
    if (one && !q.follow && i + 1 < Qs.length && !Qs[i + 1].grave && Qs[i + 1].k !== 'brawl' && Qs[i + 1].k !== 'points' && Qs[i + 1].k !== 'tonight' && Math.random() < 0.65) Qs[i + 1] = followUp(one, a.fx[0][1] < 0);
    const long = a.fx.length || life;
    setTimeout(() => { pen?.cut('wide'); }, long ? 2300 : 1700);
    setTimeout(() => { delete el.dataset.busy; i++; if (i < Qs.length) show(); else finish(); }, long ? 3000 : 2400);
  };
  const finish = () => { window.removeEventListener('keydown', key, true); el.classList.remove('show'); setTimeout(() => { pen?.dispose(); el.remove(); done?.(); }, 600); };
  const key = (e) => { const n = +e.key; if (n >= 1 && n <= 4) { e.preventDefault(); choose(n - 1); } };
  ui.addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (b) choose(+b.dataset.k); });
  window.addEventListener('keydown', key, true);
  show();
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
