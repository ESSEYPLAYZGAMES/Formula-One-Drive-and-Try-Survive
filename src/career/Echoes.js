// What the afterlife says back to you (ui/Afterlife.js, ui/Exorcism.js), drawn from the life just weighed
// (career/Conscience.js judge): the deeds on the scales, the driver's name, the team-mate.
//   HELL - echoes: snippets of arguments you were in, recalled wrong - a voice accusing, your own answering - heard
//          from somewhere in the dark as you walk (the deeds that sent you there first, then the ones anyone could hear).
//   The EXORCISM - spite: the spirits' words, thrown all at once as you fight for the body (in Hell, your own deeds).
//   HEAVEN - headlines: no voices at all; the papers that praised you, drifting by.
// Only your own driver's deeds are ever used, never anything about the real drivers beyond their name.

const pick = (L) => L[(Math.random() * L.length) | 0];
const shuffle = (L) => { const a = L.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const keys = (L) => (L || []).map((e) => e.key || keyOf(e.label)).filter(Boolean);
/** a deed's key from its label (judge's entries carry the label; the key is not kept on them) */
function keyOf(label) {
  const l = String(label || '').toLowerCase();
  return [['started a fight', 'brawlStart'], ['traded blows', 'brawl'], ['goaded', 'jab'], ['penalised', 'penalty'], ['caused a crash', 'crashBlame'], ['banned', 'ban'], ['defied', 'defied'],
    ['broke a hold', 'brokeHold'], ['held a team-mate', 'heldUp'], ['took out a team-mate', 'hitMate'], ['charity', 'donate'], ['good cause', 'charity'], ['fans', 'fans'], ['walked away', 'restraint'],
    ['did as the team', 'obeyed'], ['gave way', 'sacrifice'], ['raced clean', 'clean']].find(([k]) => l.includes(k))?.[1] || null;
}

/** HELL's echoes: a list of exchanges, each [[who ('them' | 'you'), line], ...], the worst deeds' first */
export function hellEchoes({ bad = [], name = 'you', mate = 'your team-mate' } = {}) {
  const N = String(name).split(' ').pop();
  const BY = {
    brawlStart: [[['them', 'Get your hands off me!'], ['you', 'You had it coming.'], ['them', 'My daughter saw that. She saw it.']], [['them', 'You swung first. Everyone saw.'], ['you', 'He started it.'], ['them', 'No. You did.']]],
    brawl: [[['them', 'Look at you. Bleeding in a car park.'], ['you', 'He hit me!'], ['them', 'And you hit back. Again. And again.']]],
    jab: [[['them', 'Say it again. Into the microphone.'], ['you', 'I meant every word.'], ['them', 'They cried in the motorhome, you know.']]],
    penalty: [[['them', 'Five seconds. Again.'], ['you', 'The stewards are blind.'], ['them', 'You are the only one who never saw it.']]],
    crashBlame: [[['them', 'There was no room!'], ['you', 'The door was open.'], ['them', 'They are in the wall. Because of you.']], [['them', 'Are they moving? Is anyone moving?'], ['you', 'It was a racing incident.'], ['them', 'It was you.']]],
    ban: [[['them', 'Banned. Do you understand what you did?'], ['you', 'Everyone drives like that.'], ['them', 'No. Only you.']]],
    defied: [[['them', 'Let him by. Let him by!'], ['you', 'No.'], ['them', 'Then you are on your own.']]],
    brokeHold: [[['them', 'Hold position. Hold position!'], ['you', 'I am faster.'], ['them', 'You gave your word.']]],
    heldUp: [[['them', 'You held them up on purpose.'], ['you', 'Prove it.'], ['them', 'The whole garage watched you do it.']]],
    hitMate: [[['them', 'That is your team-mate. Your team-mate!'], ['you', 'They turned in on me.'], ['them', `${mate} will not even look at you.`]]],
  };
  const ANY = [
    [['them', 'You never listened.'], ['them', 'Was it worth it?']],
    [['them', 'Nobody is coming for you.']],
    [['you', 'I did what I had to.'], ['them', 'You did what you wanted.']],
    [['them', 'Look at me when I talk to you.'], ['you', 'Leave me alone!']],
    [['them', `${N}... ${N}...`]],
    [['them', 'They cheered for you once.'], ['you', 'They still do.'], ['them', 'No.']],
    [['you', 'It was not my fault.'], ['them', 'It never is. Is it?']],
    [['them', 'Your mother watched every race.'], ['them', 'Every one.']],
  ];
  const mine = keys(bad).flatMap((k) => shuffle(BY[k] || []));
  return [...mine, ...shuffle(ANY)];
}

/** the EXORCISM's spite: the words the spirits throw (short; layered all at once) - in Hell, your own deeds among them */
export function spite({ bad = [], heaven = false, name = 'you', body = 'them' } = {}) {
  const B = String(body).split(' ').pop();
  const BY = { brawlStart: ['ANIMAL', 'You hit first'], brawl: ['Brawler', 'Blood on your hands'], jab: ['COWARD', 'Big mouth'], penalty: ['CHEAT', 'Cheat. Cheat.'],
    crashBlame: ['You put them in the wall', 'WRECKER'], ban: ['DISGRACED', 'Banned'], defied: ['LIAR', 'You never listen'], brokeHold: ['You broke your word', 'LIAR'],
    heldUp: ['Spiteful', 'SNAKE'], hitMate: ['TRAITOR', 'You hit your own'] };
  const ALL = ['GET OUT', 'NOT YOURS', 'DISGUSTING', 'LOOK AT YOU', 'SHAME', `Leave ${B}`, 'WE KNOW YOU', 'WE REMEMBER', 'Worthless', 'Thief', 'You rot', `${B} is ours`, 'Filth', 'Nobody wants you'];
  const HEAVEN = ['You think you are good?', 'Pretender', 'Saint? Ha', 'Not ready', 'Not yours', 'GO BACK', 'Thief of bodies', 'We were here first'];
  return [...(heaven ? [] : keys(bad).flatMap((k) => BY[k] || [])), ...(heaven ? HEAVEN : []), ...ALL];
}

/** HEAVEN's papers: [{ paper, head, sub }] - what was said about you, by what you did and what you won */
export function headlines({ good = [], name = 'The driver', life = {} } = {}) {
  const NAME = String(name).toUpperCase(), N = String(name).split(' ').pop(), w = life.wins | 0, p = life.podiums | 0, s = life.starts | 0;
  const PAPERS = ['THE PADDOCK TIMES', 'GRAND PRIX GAZETTE', 'THE EVENING CHEQUER', 'MOTOR WORLD DAILY', 'THE PIT LANE POST', 'THE SUNDAY GRID'];
  const BY = {
    donate: [`${NAME}'S QUIET GIFT`, 'The children\'s ward that bears a racer\'s kindness. Staff remember the visits nobody photographed.'],
    charity: [`A DAY GIVEN, NOT TAKEN`, `${N} spent a race week at the shelter. "No cameras," they said. "Just help."`],
    fans: ['ALWAYS ONE MORE AUTOGRAPH', `The driver who stayed until the last fan went home. "${N} knew my name," says a boy of nine.`],
    restraint: ['WALKED AWAY', `How ${N} chose peace over a fight - and showed the paddock what a racer can be.`],
    obeyed: ['THE TEAM PLAYER', `${N} did what the team needed, every time. Engineers call it rare.`],
    sacrifice: ['GAVE IT UP FOR THE TEAM', `${N} let a result go so others could win. Nobody in the garage has forgotten.`],
    clean: ['HARD, BUT ALWAYS FAIR', `Rivals pay tribute: "You always knew where you stood racing ${N}. Wheel to wheel, never over the line."`],
  };
  const out = keys(good).map((k) => BY[k]).filter(Boolean);
  if (w) out.push([`${w} ${w === 1 ? 'WIN' : 'WINS'}, NOT ONE OF THEM DIRTY`, `${N}'s victories, remembered for how they were won as much as that they were.`]);
  if (p) out.push([`${p} ${p === 1 ? 'PODIUM' : 'PODIUMS'} AND A HANDSHAKE FOR EVERY RIVAL`, 'Second or third, the first to congratulate the winner.']);
  out.push([`PADDOCK FALLS SILENT FOR ${NAME}`, 'Mechanics from every team lined the pit lane. Not one of them was asked to.']);
  if (s) out.push([`${s} STARTS. EVERY ONE OF THEM HONEST.`, `${N} leaves the sport better than they found it.`]);
  out.push(['A RACER, AND A GOOD ONE', 'Those who knew them best speak of a kindness that never made the headlines - until now.']);
  return out.map(([head, sub], i) => ({ paper: PAPERS[i % PAPERS.length], head, sub }));
}

export { pick };
