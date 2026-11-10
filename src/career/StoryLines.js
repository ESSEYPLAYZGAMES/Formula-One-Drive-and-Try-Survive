// The story's words (career/ManagerStory.js): the invented people of the paddock - rival team principals, each with a
// manner; three journalists; the chairs of the boards - and what they say, built from what happened: lines that know
// the streaks and the firsts (facts), the social feed's posts, the press's questions that remember your answers.
// No real team principal, journalist or executive is named: every one here is made up.
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (a, seed) => a[hash(seed) % a.length];
export const sur = (n) => String(n || '').trim().split(/\s+/).pop() || '';
const ordw = (n) => ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n);
const nth = (n) => ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'][n] ?? `${n}th`;

const PRINCIPALS = ['Viktor Brandt', 'Elena Marchetti', 'Alastair Royce', 'Tomasz Nowak', 'Camille Laurent', 'Rafael Ortega', 'Henrik Solberg', 'Dev Malhotra', 'Greta Lindqvist', 'Oscar Whitlock', 'Yuki Tanabe', 'Bruno Carvalho'];
/** how a rival principal carries himself: what he says when he beats you, when you beat him, when he wants your driver */
export const STYLES = {
  needler: { name: 'Needler', beat: (t) => `Lovely to see ${t} back there. Somebody has to make up the numbers.`, lost: (t) => `Even a stopped clock, as they say. Well done ${t}.`, poach: 'Talent should be with a team that can use it.', protest: 'They protest because they cannot overtake.' },
  statesman: { name: 'Statesman', beat: (t) => `${t} are a serious team having a difficult spell. It will not last.`, lost: (t) => `Credit where it is due: ${t} deserved that one.`, poach: 'I would never comment on another team\'s driver. Publicly.', protest: 'We respect the process and we are confident in our car.' },
  schemer: { name: 'Schemer', beat: (t) => `Interesting result. I wonder what ${t} will tell their board.`, lost: (t) => `${t} found a lot of time very quickly. People will ask how.`, poach: 'Contracts are there to be read. Carefully.', protest: 'We have asked the FIA some questions. We are sure the answers will be illuminating.' },
  purist: { name: 'Purist', beat: (t) => `We raced them hard and fair. ${t} will come back at us.`, lost: (t) => `They were quicker. No excuses. We go and find it.`, poach: 'A driver goes where the car is. That is the sport.', protest: 'Let the stewards do their job.' },
};
export function principalOf(team) { const name = pick(PRINCIPALS, `tp|${team}`), style = pick(Object.keys(STYLES), `st|${team}`); return { name, style, heat: 0 }; }
export const JOURNALISTS = [{ name: 'Marta Voss', outlet: 'The Paddock Wire', lean: 'hostile' }, { name: 'Jonah Ellery', outlet: 'Grid Weekly', lean: 'friendly', female: false }, { name: 'Dee Okafor', outlet: 'Pitlane Confidential', lean: 'tabloid' }];
const CHAIRS = ['Lord Ashcombe', 'Isabella Ferrante', 'Marcus Hale', 'Annelise Krug', 'Giorgio Santoro', 'Catherine Moreau'];
export const chairOf = (team) => pick(CHAIRS, `chair|${team}`);
export const TRAITS = {
  hot: { name: 'Hot-headed', what: 'Rows flare quickly; an order he dislikes may be ignored.' },
  political: { name: 'Political', what: 'Plays the paddock: listens when another team calls.' },
  loyal: { name: 'Loyal', what: 'Slow to complain, slow to leave.' },
  mercenary: { name: 'Money-driven', what: 'A better offer is a better offer.' },
  perfectionist: { name: 'Perfectionist', what: 'Hard on the team after a mistake, harder on himself.' },
  team: { name: 'Team player', what: 'Takes an order; expects the same back.' },
};
export const traitFor = (id) => pick(Object.keys(TRAITS), `trait|${id}`);

/**
 * What a result means in the season's own terms. F: facts (ManagerStory.facts) -> a phrase or '' - "a third DNF in
 * four races", "the first points since Montreal", "five races in the points".
 */
export function factLine(F, who = 'the team') {
  if (!F) return '';
  if (F.dnfNow && F.dnfIn4 >= 2) return `${ordw(F.dnfIn4)} retirements in ${F.span} races for ${who}`;
  if (F.firstWin) return `the first win for ${who}${F.season ? ' this season' : ''}`;
  if (F.winNow && F.winStreak >= 2) return `${ordw(F.winStreak)} wins in a row for ${who}`;
  if (F.firstPodium) return `the first podium of the season for ${who}`;
  if (F.pointsNow && F.dryBefore >= 2) return `the first points for ${who} since ${F.lastPointsAt || `${ordw(F.dryBefore)} races ago`}`;
  if (F.pointsNow && F.pointsStreak >= 4) return `${ordw(F.pointsStreak)} races in a row in the points for ${who}`;
  if (!F.pointsNow && F.dry >= 2) return `${ordw(F.dry)} races without a point for ${who}`;
  if (F.bestNow) return `the best finish of the season for ${who}`;
  return '';
}
const cap1 = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** a driver's line by his trait, for a moment: 'launch' | 'feudA' | 'feudB' | 'refuse' | 'doc' | 'seat' */
export function driverLine(trait, kind, x = {}) {
  const B = {
    launch: { hot: 'It looks fast. If it is not, somebody will hear about it.', political: 'A beautiful car. I am grateful to everyone who made it possible.', loyal: 'This team gave me my chance. I intend to pay it back.', mercenary: 'I am paid to win. Give me the car to do it.', perfectionist: 'It looks right. Looking right is not a lap time.', team: 'Two cars, one garage. That is how we do it this year.' },
    feudA: { hot: 'You saw me. You saw me there and you turned in anyway!', political: 'I will not say it out here. But you know what you did.', loyal: 'I have always given you room. Always. And that is what I get.', mercenary: 'That cost me points. Points are money. You owe me.', perfectionist: 'Look at the data. Then tell me again it was a racing incident.', team: 'We are supposed to be on the same side.' },
    feudB: { hot: 'It was my corner. Shout all you like.', political: 'I think we should let the team decide who was at fault. Do you not?', loyal: 'I would never put you in the wall. You know that.', mercenary: 'I am not paid to wave you through.', perfectionist: 'I was a tenth quicker all afternoon. Do the sum.', team: 'I raced you like anyone else. That is all.' },
    refuse: { hot: 'No. I am quicker. Let me race.', political: 'I did not hear that. The radio is breaking up.', loyal: 'Do not ask me that. Please. Not today.', mercenary: 'Check my contract and ask me again.', perfectionist: 'Negative. That is the wrong call and you know it.', team: 'If you make me do this, you do it for me next time.' },
    doc: { hot: 'People think I am angry. I am not angry. I am fast and I am being held up.', political: 'Everybody in this paddock smiles. Count the ones who mean it.', loyal: 'I could have left. Twice. I am still here.', mercenary: 'It is a short career. Nobody remembers who was nice.', perfectionist: 'I replay the laps at night. Every one. I cannot stop.', team: 'You win as a team. You are blamed on your own.' },
    seat: { hot: 'I have been waiting two years for this phone call. Do not expect me to be polite with it.', political: 'I am just here to help the team while he recovers. Of course.', loyal: 'I have swept this garage. Now I get to drive out of it.', mercenary: 'A race seat. We can talk about the number after.', perfectionist: 'Give me the simulator tonight. All of it.', team: 'I will bring it home. That is all I will promise.' },
  };
  return (B[kind] || {})[trait] || (B[kind] || {}).team || '';
}

/**
 * The social feed after a race: posts from what happened. e: { team, mine: [{ name, pos, dnf }], fans (0..100), fact,
 * win, podium, double, order (a swap was ordered), refused, row, rival: { name, team, line } } -> [{ who, h, text, kind }]
 */
export function feedPosts(e, seed) {
  const out = [], T = e.team, mood = e.fans ?? 50, s = (k) => `${seed}|${k}`;
  const fan = pick(['@apexhunter', '@box_box_bella', '@sector3sam', '@lollipop_man', '@undercut_andy', '@gravel_trap'], s('f1')), fan2 = pick(['@tifosa_91', '@pitlane_pete', '@dirtyair', '@softs_only', '@drsdave'], s('f2'));
  if (e.win) out.push({ who: 'Fan', h: fan, kind: 'fan', text: `${T.toUpperCase()} WIN. I am not crying. You are crying. ${sur(e.mine.find((m) => m.pos === 1)?.name)} you absolute hero.` });
  else if (e.podium) out.push({ who: 'Fan', h: fan, kind: 'fan', text: `A ${T} on the podium. I had forgotten what the champagne looked like.` });
  else if (e.double) out.push({ who: 'Fan', h: fan, kind: 'fan', text: `Both ${T} cars out. I set an alarm for this. I took a day off for this.` });
  else out.push({ who: 'Fan', h: fan, kind: 'fan', text: mood >= 60 ? `${e.mine.map((m) => `${sur(m.name)} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ')}. We take it and we go again. Forza ${T}.` : `${e.mine.map((m) => `${sur(m.name)} ${m.dnf ? 'DNF' : `P${m.pos}`}`).join(', ')}. Is this the plan? Is there a plan?` });
  if (e.fact) out.push({ who: 'Grid Stats', h: '@gridstats', kind: 'pundit', text: `${cap1(e.fact)}.` });
  if (e.order) out.push({ who: 'Fan', h: fan2, kind: 'fan', text: `Team orders at ${T}. On lap ${e.order.lap || '?'}. I pay to watch them race, not swap.` });
  if (e.refused) out.push({ who: 'Pitlane Confidential', h: '@pitlaneconf', kind: 'press', text: `Hearing ${sur(e.refused)} ignored an instruction from the pit wall today. ${T} "will discuss it internally". We bet they will.` });
  if (e.row) out.push({ who: 'Pitlane Confidential', h: '@pitlaneconf', kind: 'press', text: `Raised voices in the ${T} garage after the flag. Mechanics studying their shoes. More soon.` });
  if (e.rival?.line) out.push({ who: e.rival.name, h: `@${String(e.rival.team).toLowerCase().replace(/[^a-z]/g, '')}_tp`, kind: 'rival', text: e.rival.line });
  if (e.botch) out.push({ who: 'Fan', h: fan2, kind: 'fan', text: `${e.botch.toFixed(1)} seconds in the box. I could have changed that tyre and I have a bad shoulder.` });
  return out;
}

/**
 * The press's question with a memory. x: { team, topic ('broken' | 'slump' | 'feud' | 'win' | 'rival' | 'plain'), j
 * (the journalist), claim (what you said before: { text, track, ago }), fact, a, b (your drivers' surnames), rival:
 * { name, team, said } } -> { q, opts: [{ id, label, reply, head, fx: { fans, cred, buzz, morale, heat, claim } }] }
 */
export function pressQuestion(x) {
  const T = x.team, j = x.j || JOURNALISTS[0];
  const o = (id, label, reply, head, fx = {}) => ({ id, label, reply, head, fx });
  if (x.topic === 'broken' && x.claim) return { q: `At ${x.claim.track || 'the last race'} you told this room: "${x.claim.text}" That was ${ordw(x.claim.ago)} race${x.claim.ago === 1 ? '' : 's'} ago. It has not happened. Why should anyone believe the next thing you say?`, opts: [
    o('own', 'Own it: you were wrong', 'Because I am telling you now that I was wrong. I said it, it did not happen, that is on me.', `"I was wrong": ${T} boss comes clean`, { cred: 6, fans: 2 }),
    o('excuse', 'Explain what changed', 'When I said it, the upgrade was working in the tunnel. The track had other ideas.', `${T} blame the tunnel`, { cred: -3 }),
    o('double', 'Promise again, with a date', 'Write this down instead: points at the next race. Both cars.', `${T} boss doubles down`, { cred: -2, fans: 1, claim: { kind: 'points', n: 1, text: 'Points at the next race. Both cars.' } })] };
  if (x.topic === 'slump') return { q: `${cap1(x.fact || `another weekend without a result for ${T}`)}. ${j.lean === 'friendly' ? 'What do you say to the people in the factory tonight?' : 'How long does the board let this go on?'}`, opts: [
    o('promise', 'Promise points within two races', 'We score within two races. I am certain of it.', `${T} boss: "points in two races"`, { fans: 2, claim: { kind: 'points', n: 2, text: 'We score within two races. I am certain of it.' } }),
    o('car', 'Say the car is the problem', 'The drivers are getting everything out of it. There is not enough in it.', `${T} boss points at his own car`, { morale: 3, fans: -1, cred: 2 }),
    o('back', 'Back everyone and ask for time', 'Nobody here has forgotten how to do their job. Give them the time.', `${T} close ranks`, { morale: 2 })] };
  if (x.topic === 'feud') return { q: `${x.a} and ${x.b} were not looking at each other in the pen. People heard shouting in your garage. Is there a problem between your drivers?`, opts: [
    o('deny', 'Deny it', 'There is no problem. They are two racing drivers. They are supposed to want to beat each other.', `${T}: "no problem" between drivers`, { claim: { kind: 'peace', n: 3, text: 'There is no problem between my drivers.' } }),
    o('admit', 'Admit it and say it is handled', 'They had words. I have had words with both of them. It is finished.', `${T} boss confirms garage row`, { cred: 4, morale: -2, fans: 1 }),
    o('joke', 'Laugh it off', 'If they were friends I would be worried about their lap times.', `${T} boss laughs off the row`, { buzz: 0.02, fans: 1 })] };
  if (x.topic === 'win') return { q: `${cap1(x.fact || `a big result for ${T}`)}. ${j.lean === 'hostile' ? 'One swallow, though. Can you do it again?' : 'Is this the start of something?'}`, opts: [
    o('humble', 'Keep it calm', 'It is one result. We enjoy it tonight and we start again on Monday.', `${T} keep feet on the ground`, { cred: 2 }),
    o('bold', 'Say you are coming for more', 'We are not done. Tell the teams ahead of us to look in their mirrors.', `${T} boss: "look in your mirrors"`, { fans: 4, buzz: 0.03, heat: 6, claim: { kind: 'podium', n: 3, text: 'We are not done. Look in your mirrors.' } }),
    o('crew', 'Give it to the crew', 'That was won in the pit lane and at the factory. Put their names in your piece, not mine.', `${T} boss: "it belongs to the crew"`, { crew: 1, cred: 3 })] };
  if (x.topic === 'rival' && x.rival) return { q: `${x.rival.name} said this about you today: "${x.rival.said}" Do you want to answer that?`, opts: [
    o('bite', 'Bite back', `${sur(x.rival.name)} should worry about ${x.rival.team}. I hear the board there reads the newspapers too.`, `${T} boss hits back at ${sur(x.rival.name)}`, { heat: 10, buzz: 0.03, fans: 2 }),
    o('ignore', 'Rise above it', 'I did not hear it and I will not be reading it.', `${T} boss refuses the bait`, { cred: 2 }),
    o('nice', 'Be generous', `${sur(x.rival.name)} runs a very good team. I would say so even if he had not been rude.`, `${T} boss kills ${sur(x.rival.name)} with kindness`, { heat: -6, cred: 3 })] };
  return { q: `${cap1(x.fact || `a weekend like many others for ${T}`)}. What is the honest summary?`, opts: [
    o('honest', 'Honest', 'We got what the car had in it. No more. That is the honest answer.', `${T}: "what the car had in it"`, { cred: 3 }),
    o('up', 'Upbeat', 'There is more to come, and it is coming soon.', `${T} promise "more to come"`, { fans: 1, claim: { kind: 'points', n: 2, text: 'There is more to come, and it is coming soon.' } }),
    o('short', 'Short', 'We were where we were. Next question.', `${T} boss keeps it short`, {})] };
}

/** a rumour's text: kind 'out' (yours to them), 'in' (theirs to you), 'swap', 'boss' */
export function rumourText(r) {
  if (r.kind === 'out') return `${r.name} to ${r.to}? Sources say talks have happened "more than once".`;
  if (r.kind === 'in') return `${r.name} has been seen in the ${r.to} motorhome. A seat for next season is "being discussed".`;
  if (r.kind === 'boss') return `${r.name}'s position at ${r.to} is "under review", the paddock whispers. The board meets this month.`;
  return `A straight swap, ${r.name} for ${r.other}? "Not impossible," says someone who would know.`;
}
/** a documentary episode's name from what it is about */
export const episodeName = (topic, seed) => pick({ feud: ['Team Mates', 'Same Colours', 'The Other Garage'], board: ['Vote of Confidence', 'The Fourth Floor', 'Borrowed Time'], win: ['Champagne', 'The Long Way Up', 'Sunday'], slump: ['Nowhere', 'Monday Morning', 'The Gap'], poach: ['The Handshake', 'Phone Calls', 'Silly Season'], plain: ['The Middle of the Season', 'Half Distance', 'Twelve Down'] }[topic] || ['Pit Wall'], seed);
export { nth, ordw, cap1 };
