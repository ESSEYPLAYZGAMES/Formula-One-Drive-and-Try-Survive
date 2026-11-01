// Walking up to a stranger: the first words with someone from a crowd (career/Extras.js: a dancer on a club's floor,
// someone at the bar, a guest milling about the team party, a face on the grid, the next table on an evening out). You
// have never met; she has a personality of her own (career/Persona.js's nine - her lines in career/talk/<id>/
// stranger.js, written per place and per how it goes), and she may not be available: here with someone, about to
// leave with her friends, working, or simply not interested in you. It plays as one of her personality's talks - her
// opener, your answer in a tone (cold, passive, flirty, and risque with the two who take one from a stranger), her
// reaction, then what the moment turns into and your second answer - so ui/Hangout.js and ui/GridWalk.js open it like
// any other (tree.persona set: they hand the tones to tree.done when it closes).
// What decides it, all of it seeded (the same stranger, the same night, the same answers come out the same way):
//   - who she is tonight: taken (about one in seven, for the season - never the Fling), busy (her friends are leaving, a
//     taxi is outside, she is working: likelier on the grid, where the guests are herded off before the start), or free;
//   - how your line lands with her personality (Persona's own TAKE: the Aloof one rewards restraint, the Rude one a
//     comeback, the Sweet one kindness, the Flirtatious one a flirt), plus a chemistry of the two of you, your fame, a win
//     tonight, what she likes in someone, how much you have had to drink, a public partner of yours she has read about,
//     and how many numbers you have already collected tonight (she notices: after three, nobody else is interested);
//   - then your second answer: ask for her number, or walk away cool - which some of them reward.
// Only a swapped number makes her someone you know (the promotion decision is this module's, not the scene's): she is
// registered and met (Extras.promoteExtra, Celebs: stage 'met', where you met her, affection by how it went, any flirt
// counted), her personality picks up in the mood you left her in, and her first text ('met': Persona) lands in your
// phone. Anything else leaves nothing in the save - a scene that took her into the game early is undone (Social.
// forgetStranger) - and talking to her again the same night gets a short second try ('again'), remembered for the
// session only. Everyone is an invented adult; in person there is no alcohol in the lines, nothing explicit, no shared
// past (it is a first meeting), and a no from either of you is respected.
//
// strangerTalk(extra, ctx) -> tree | null (a man, a grave week or a memorial day, no extra)
//   extra  Extras.extraFor(seed): { id, seed, name, first, fem, age, job, look, persona, vibe, lid, local }
//   ctx    { c | career, place ('club' | 'party' | 'grid' | 'hangout') or where ('grid' | 'party' | 'evening' |
//          'hangout') + venueId / venue / scope ('club:vegasclub', 'party:teamparty:<team>', 'pool:poolclub',
//          'grid:<track>', 'hangout:<venue>'), venue (an id or the place's name), track (a name or an id), level (your
//          drink, 0..3) or tier ('sober' | 'merry' | 'tipsy' | 'drunk'), quiet / memorial, me: { name, first, fame } }
//   tree   { id, say, opts: [{ t, tone, r, m, fx, then: { say, opts: [{ t, tone, r, m, fx }] } }], persona, stranger:
//          true, seed, lid, cid, done(tones) -> result, result } - an 'again' tree is one level deep; someone you
//          already know (a regular met on an earlier night) gets her own personality's talk instead (Persona.personaTalk,
//          tree.known true, tree.result already set)
//   result { outcome: 'number' | 'interested' | 'polite' | 'busy' | 'taken' | 'full' | 'again' | 'known', promote (she
//          is a met local now), lid, cid, kind, tones, mood, stage, delta (affection), line (a toast), applied (the
//          career was changed), where (the 'met at' words) }
// strangerPlan(extra, ctx) -> what the tree would be built from (tests): { place, vid, night, avail, base, full, kinds }
import { toneWorth, moodAfter, psOf, personaIncoming, personaTalk } from '../career/Persona.js';
import * as Celebs from '../career/Celebs.js';
import { promoteExtra } from '../career/Extras.js';
import { localId } from '../career/Locals.js';
import { pushText, forgetStranger, metLine } from '../career/Social.js';
import { fameIndex } from '../career/PR.js';
import { DATA as spark } from '../career/talk/spark/stranger.js';
import { DATA as ice } from '../career/talk/ice/stranger.js';
import { DATA as sunny } from '../career/talk/sunny/stranger.js';
import { DATA as flirtatious } from '../career/talk/flirtatious/stranger.js';
import { DATA as emotional } from '../career/talk/emotional/stranger.js';
import { DATA as rude } from '../career/talk/rude/stranger.js';
import { DATA as dominant } from '../career/talk/dominant/stranger.js';
import { DATA as shy } from '../career/talk/shy/stranger.js';
import { DATA as fling } from '../career/talk/fling/stranger.js';

/** her side of a first meeting, by personality (career/talk/<id>/stranger.js) */
export const STRANGER = { spark, ice, sunny, flirtatious, emotional, rude, dominant, shy, fling };
export const STRANGER_PLACES = ['club', 'party', 'grid', 'hangout'];
/** what the moment turns into: keen (numbers are on the table), polite (nice, but no), rushed (she has to go, but liked you), busy (she has to go), taken, full (you have collected enough numbers tonight) */
export const STRANGER_KINDS = ['keen', 'polite', 'rushed', 'busy', 'taken', 'full'];
// (who hears a risque line from someone they have only just met - Persona's own rule for the 'new' stage)
const RISQUE_NEW = new Set(['flirtatious', 'dominant']);
const TAKEN = 15, BUSY = { club: 22, party: 18, grid: 35, hangout: 20 }, FLING_BUSY = 12, NIGHT_CAP = 3, LAND = 2;
// (after dark - a club's floor, the team's after-party - people are open to the small things: a line lands easier, a
// drink or two helps rather than hurts, nobody counts how many numbers you have taken until it is a lot, and a flirt
// that lands can turn straight into a dance, a kiss, leaving together. The life of a racing driver at the after-party:
// nothing shown, plenty implied)
const NIGHT = new Set(['club', 'party']), LAND_NIGHT = 1, CAP_NIGHT = 6;
// (what a flirt that landed turns into, after dark: her last line, then this - touches, closeness, the cut-away)
const CLOSE = {
  dance: ["She takes your hand and pulls you onto the floor without another word.", "Her fingers lace through yours, and she leads you into the crowd.",
    "She steps in close, one hand on your chest, and starts to move to the music.", "She hooks a finger in your collar and walks you backwards onto the dance floor.",
    "Her hand finds the back of your neck. The next song, the two of you barely move apart.", "She turns her back to you and leans in, your hands settling on her hips as the beat drops."],
  kiss: ["She looks at your mouth, then back up at you, and closes the gap.", "She pulls you in by your shirt and kisses you, slow, like the room isn't there.",
    "Her hand slides along your jaw. The kiss lasts longer than either of you meant it to.", "She laughs against your lips, then kisses you again, properly this time.",
    "A kiss at the edge of the dance floor, her arms around your neck, the bass in your chest."],
  leave: ["'Get me out of here,' she says in your ear, her hand already in yours.", "She tucks her number into your pocket, her fingers lingering. 'Or we could skip the texting.'",
    "Her lips brush your ear. 'Your hotel or mine?'", "She slips her arm through yours. 'I'm bored of this place. I'm not bored of you.'",
    "'One more drink here,' she says, 'or somewhere quieter.' She doesn't mean the bar."],
};
const closeOf = (R, t, place) => { const u = R(); if (t === 'risque') return u < 0.6 ? 'leave' : 'kiss'; const L = place === 'club' ? 0.22 : 0.15, K = place === 'club' ? 0.62 : 0.5; return u < L ? 'leave' : u < K ? 'kiss' : 'dance'; };
// (a chemistry of the two of you: mostly middling, now and then none at all, now and then a spark)
const CHEM = [-2, -1, -1, 0, 0, 0, 1, 1, 1, 2, 2, 3];

// ---- your side ---------------------------------------------------------------------------------------------------------
// (your first words as you walk up, by place and tone - written to follow any of her openers there)
const YOU = {
  club: {
    cold: ["Don't mind me. I just needed somewhere to stand that isn't the dance floor.", "I'm not here to chat anyone up. The view's just better from this spot.",
      "Relax. I came over because it's the only quiet corner in {venue}.", "I'm hiding from my team, if you must know. You'll do as cover.",
      "Honestly? I was told to circulate. This is me circulating.", "I'd say hello properly, but I can't hear myself think in here."],
    passive: ["Hi. I'm {me}. I thought I'd come and say hello.", "Sorry, I didn't mean to stare. I'm {me}. Having a good night?",
      "Hey. Is it always this loud in {venue}, or is it just tonight?", "Hi. I'm {me}. I don't really know anyone here, so I'm being brave.",
      "Hey, I'm {me}. Mind if I stand here for a bit? My lot have vanished.", "Hi. Long day. I promised myself one conversation that isn't about tyres."],
    flirty: ["I saw you from across the room and my feet made the decision for me.", "I was going to dance, but you looked like the better idea.",
      "I've been trying to think of a clever opener for ten minutes. I've got nothing. Hi.", "Tell me you're not leaving soon. I've only just worked up the nerve.",
      "Everyone in {venue} is watching the dance floor. I wasn't.", "I'm {me}. I've had a good day, and I'd like it to end with your name."],
    risque: ["I came over to find out if you're as much trouble as you look.", "I'm leaving in an hour. I'd like a very good reason to stay.",
      "Let's skip the small talk. I want to know what you're like after midnight.", "Dance with me, and I'll tell you what I was thinking from over there."],
  },
  party: {
    cold: ["Don't worry, I'm not here to talk about the race. I've done enough of that.", "I needed five minutes away from the debrief crowd. This corner's free.",
      "I'm meant to be mingling. I'm terrible at mingling.", "Ignore me. I'm avoiding the team principal's speech.",
      "If you're about to ask me about the car, I'll walk straight back out.", "I'm only here because the team said I had to be."],
    passive: ["Hi, I'm {me}. I don't think we've met. Are you with the team?", "Hey. I'm {me}. I'm trying to put names to faces tonight. Who are you here with?",
      "Hi. Thanks for coming tonight. I'm {me}, one of the drivers.", "Hey. Mind if I hide over here? Everyone wants a word about {track}.",
      "Hi. I'm {me}. Is this your first team party?", "Hey, I'm {me}. I promise I'm better company than my race engineer."],
    flirty: ["Nobody told me the best-dressed person in the paddock would be here tonight.", "I've shaken a hundred hands tonight. Yours is the one I actually wanted.",
      "I was meant to be celebrating with the team. This is a much better celebration.", "I've been in the garage all day. You're the best thing I've seen since the chequered flag.",
      "I'm {me}. Tell me you're staying for the whole party.", "I didn't come over for small talk. I came over because you smiled."],
    risque: ["The team's watching, so I'll be good. For about ten minutes.", "I know a quieter corner of the hospitality. I'll show you if you're curious.",
      "I raced all afternoon. I'm saving my last burst of energy for you.", "Careful. I'm in a reckless mood and you're standing very close."],
  },
  grid: {
    cold: ["I've got a race in twenty minutes. I'm only walking this way to stretch my legs.", "Don't take it personally if I wander off. My head's already in turn one.",
      "I'm not stopping long. I just needed to get away from the cameras.", "I'm meant to be focusing. You're standing in my walking line.",
      "Quick hello. The engineers will have my head if I'm late back.", "I'm on the grid. I'm allowed to be a bit short with people."],
    passive: ["Hi. I'm {me}. Enjoying the grid?", "Hey. Is this your first time on the grid? It's mad, isn't it?", "Hi, I'm {me}. I'm driving the car over there, for my sins.",
      "Hey. Sorry, I'm a bit wired. It's always like this before the start.", "Hi. Did they give you a good spot to watch from?", "Hey. I've got a few minutes before they strap me in. I'm {me}."],
    flirty: ["Forget the cars. You're the best thing on this grid.", "I'm supposed to be thinking about the start. You're not helping.",
      "I've walked this grid a hundred times. First time I've stopped for anyone.", "I need a good luck charm for {track}. You're hired.",
      "One smile from you and I'll take pole off the lot of them next time.", "I'm {me}. I'd like your name before they strap me into a car for the afternoon."],
    risque: ["Wish me luck properly and I'll come and find you after the flag.", "If I win today, you're celebrating with me. That's the deal.",
      "My heart rate's already up. You're not helping it come down.", "Stand where I can see you from the car, and I'll drive like I've got something to prove."],
  },
  hangout: {
    cold: ["Don't worry, I'm not here to be recognised. I'm just here for a quiet evening.", "I'm only over here because my table's being loud.",
      "I'd rather not talk racing tonight, if that's alright.", "I'm hiding from my friends for a minute. You're not a fan, are you?",
      "I'm off duty tonight, so if you recognise me, keep it quiet.", "Tell me you're not about to ask me about racing."],
    passive: ["Hi. I'm {me}. Is anyone standing here?", "Hey. Sorry to interrupt. I'm {me}. Do you come to {venue} often?", "Hi. My friends are late, so I'm being sociable. I'm {me}.",
      "Hey, I'm {me}. First time here. Any recommendations?", "Hi. You looked like the only person here having a good time.", "Hey. I'm {me}. A night off is so rare I've forgotten how to do it."],
    flirty: ["I nearly walked straight past {venue} tonight. Very glad I didn't.", "I've been trying to catch your eye for ten minutes. I'm better at overtaking.",
      "You've got the best smile in {venue}. I had to come and say so.", "I came out for a quiet night. Then you walked in.",
      "I'm {me}. If you're about to leave, please don't.", "This is the best evening I've had in weeks, and I've only just said hello."],
    risque: ["I'm meant to be home early. Give me a reason to be very late.", "I'm off duty tonight, and I'm in the mood to break a few rules.",
      "Stand with me. I'll be on my best behaviour. Mostly.", "Here's my bad decision for the night: coming over to you."],
  },
};
// (your second answer, by what the moment has turned into - anywhere)
const YOU2 = {
  keen: {
    cold: ["Maybe I'll see you around.", "I should get back. Enjoy your night.", "Let's see if we bump into each other again.", "I'm not going to ask for your number. I'm not that easy."],
    passive: ["Can I get your number?", "I'd like to do this again. Can I give you my number?", "Would it be weird if I asked for your number?", "Swap numbers? I'd like to keep talking."],
    flirty: ["Give me your number before someone else asks for it.", "I'm not leaving without your number.", "Put your number in my phone and make my week.",
      "I'd like to text you something better than this conversation."],
    risque: ["Put your number in my phone. I'll use it before the sun's up.", "Give me your number and I'll tell you the rest of my plans for tonight.", "Your number. And the name of somewhere quieter."],
  },
  polite: {
    cold: ["Your loss.", "Fine. Enjoy your evening.", "Right. I'll leave you to it."],
    passive: ["Of course. It was nice to meet you, {first}.", "No problem. Have a good night.", "Fair enough. Thanks for the chat."],
    flirty: ["One more try: can I get your number?", "Shame. Are you sure I can't change your mind?", "I'll take that as a 'not yet'. Number, just in case?"],
    risque: ["Shame. I was going to ask you to stay until closing.", "Pity. I'd have made it a night worth remembering."],
  },
  rushed: {
    cold: ["Go on, then. Don't keep them waiting.", "Off you go. Maybe another time.", "Fine. I won't hold you up."],
    passive: ["Quick, then: can I get your number?", "Before you go, can we swap numbers?", "I'll be quick. Number?"],
    flirty: ["Leave me your number and I'll let you go.", "Give me your number and I'll pretend I'm not disappointed.", "Thirty seconds. That's long enough to put your number in my phone."],
    risque: ["Give me your number and I'll find you later.", "Your number, and I'll tell you what you missed."],
  },
  busy: {
    cold: ["Fine.", "Right. Bye, then."],
    passive: ["No problem. Enjoy the rest of your night.", "Of course. Nice to meet you anyway.", "Go. Have fun."],
    flirty: ["Shame. Another time?", "Leave me your number, at least?", "If I see you again, I'm asking for your number."],
    risque: ["If you change your mind, come and find me. I'll be easy to spot.", "Shame. I'd have been the best part of your night."],
  },
  taken: {
    cold: ["Right. Enjoy your night.", "Should have led with that.", "Fine. Back to my evening, then."],
    passive: ["Lucky them. It was nice to meet you.", "Of course. Sorry, I didn't mean to intrude.", "No problem at all. Have a lovely evening."],
    flirty: ["Shame. They're a lucky person.", "If that ever changes, you know where to find me.", "Tell them they've got competition. I'm joking. Mostly."],
    risque: ["Pity. I'd have been trouble worth getting into.", "Shame. Tell them to keep a closer eye on you."],
  },
};
// (a second try the same night: your few words, whatever she said the first time)
const AGAIN = {
  cold: ["Just passing.", "Don't worry, I'm not stopping."],
  passive: ["Sorry. I just wanted to say goodnight.", "I didn't mean to bother you again."],
  flirty: ["Had to see if you'd changed your mind.", "One last smile before I go?"],
};
/** your lines, for the validator and the tests */
export const STRANGER_YOU = { first: YOU, second: YOU2, again: AGAIN };

// ---- small helpers -----------------------------------------------------------------------------------------------------
const arr = (a) => (Array.isArray(a) ? a : []);
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const firstOf = (s) => String(s || '').trim().split(/\s+/)[0] || '';
const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
/** a seeded random (mulberry32): the same words for the same stranger, the same night */
const rngOf = (s) => { let a = hash(s) || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const pickR = (R, a) => { const L = arr(a); return L.length ? L[(R() * L.length) | 0] : ''; };
/** draw without repeats from a pool (the options of one step never say the same thing twice) */
const drawer = (R) => { const used = new Set(); return (a) => { const L = arr(a).filter((s) => !used.has(s)); const s = L.length ? L[(R() * L.length) | 0] : pickR(R, a); used.add(s); return s; }; };
const TONES = ['cold', 'passive', 'flirty', 'risque'];
const tonesFor = (p) => (RISQUE_NEW.has(p) ? TONES : TONES.slice(0, 3));
const safe = (what, f, d = null) => { try { return f(); } catch (e) { console.warn(`StrangerTalk: ${what}`, e); return d; } };

// ---- where you are -------------------------------------------------------------------------------------------------------
const CLUBS = ['vegasclub', 'londonclub', 'poolclub'];
// (the place mid-sentence, for {venue}; where you met, for the phone)
const WORD = { vegasclub: 'the Halo Room', londonclub: 'the Vault', poolclub: 'Tidewater', teamparty: 'the team party', rooftop: 'the rooftop', pub: 'the pub', simlounge: 'the sim lounge',
  karting: 'the karting hall', restaurant: 'this place', coffee: 'the café', apartment: 'your flat', dayclub: 'Tidewater' };
const MET_AT = { vegasclub: 'the Halo Room, Las Vegas', londonclub: 'the Ormond Vault, London', poolclub: 'Tidewater, Las Vegas', dayclub: 'Tidewater, Las Vegas', rooftop: 'the rooftop over the Strip',
  pub: 'the village pub at Silverstone', simlounge: 'the sim-racing lounge', karting: 'the karting hall', restaurant: 'a restaurant', coffee: 'a café' };
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal', austin: 'Austin' };
const trackName = (t) => (t ? TRACK[t] || String(t) : '');
const careerOf = (ctx) => (ctx.c && typeof ctx.c === 'object' ? ctx.c : ctx.career && typeof ctx.career === 'object' ? ctx.career : null);
/** the venue's id, from whichever field has one */
const venueIdOf = (ctx) => { for (const v of [ctx.venueId, ctx.venue, String(ctx.scope || '').split(':')[1]]) if (typeof v === 'string' && (WORD[v] || MET_AT[v])) return v; return null; };
/** club | party | grid | hangout */
function placeOf(ctx, vid) {
  if (STRANGER_PLACES.includes(ctx.place)) return ctx.place;
  const sc = String(ctx.scope || '');
  if (ctx.where === 'grid' || sc.startsWith('grid:')) return 'grid';
  if (vid === 'teamparty' || sc.startsWith('party:')) return 'party';
  if (sc.startsWith('club:') || sc.startsWith('pool:')) return 'club';
  if (ctx.where === 'party' || ctx.party === true) return CLUBS.includes(vid) || !vid ? 'club' : 'party';
  return 'hangout';
}
/** this race weekend's circuit as the moment knows it: the one just run on a race night, else the one coming up */
function trackOf(c, ctx, place) {
  if (ctx.track) return trackName(ctx.track);
  const S = c?.party?.race;
  if ((place === 'club' || place === 'party') && S?.track) return trackName(S.track);
  const L = c?.calendar; return L?.length ? trackName(L[(Math.max(1, c.round) - 1) % L.length]) : '';
}
/** the race round the meeting belongs to (a race night's is the race just run, though the career has moved on) */
function roundOf(c, place) {
  const S = c?.party?.race;
  if ((place === 'club' || place === 'party') && S && S.season === c.season && S.round != null) return { season: S.season, round: S.round };
  return { season: c?.season ?? 1, round: c?.round ?? 1 };
}
/** where you met, in words for the phone: 'the Halo Room, Las Vegas' / 'the grid at Austin' / 'the team party at Silverstone' */
function whereOf(ctx, place, vid, track) {
  track = String(track || '').replace(/ Circuit$/, '');   /* ('Silverstone Circuit': the grid at Silverstone) */
  if (place === 'grid') return track ? `the grid at ${track}` : 'the grid';
  if (place === 'party') return track ? `the team party at ${track}` : 'the team party';
  if (vid && MET_AT[vid]) return MET_AT[vid];
  const v = typeof ctx.venue === 'string' && !WORD[ctx.venue] ? ctx.venue.replace(/^The\b/, 'the') : '';
  return v || (track ? `a night out at ${track}` : 'a night out');
}
/** a line for a grid in daylight (the lines anywhere are written for an evening): 'Goodnight' a goodbye, tonight today */
const dayOf = (s) => s.replace(/\b([Gg])oodnight\b/g, (m, g) => `${g}oodbye`).replace(/\b([Tt])onight\b/g, (m, t) => (t === 'T' ? 'Today' : 'today')).replace(/\bnight\b(?! (creature|out))/g, 'day').replace(/\bevening\b/g, 'day');
/** the night as a key: who you met and how many numbers you took are counted by it */
const nightKey = (c, place, vid) => (c ? `${c.season}.${c.round}|${place}|${vid || ''}` : `q${Math.floor(Date.now() / 864e5)}|${place}|${vid || ''}`);
/** how much you have had: 0 sober .. 3 drunk */
const levelOf = (ctx) => { const v = num(ctx.level); if (v != null) return v; const t = ctx.tier || ctx.x?.party?.tier; return { sober: 0, merry: 1, tipsy: 2, drunk: 3 }[t] || 0; };

// ---- the session's memory (never saved: an evening's second try, the numbers taken tonight) ----------------------------------
const MEMO = new Map(), TONIGHT = new Map();
const remember = (k, v) => { MEMO.set(k, v); if (MEMO.size > 600) MEMO.delete(MEMO.keys().next().value); };
/** forget the session's memory (a new career, the tests): nobody remembers a second try */
export function strangerReset() { MEMO.clear(); TONIGHT.clear(); }
/** the numbers you have taken tonight (the career's own record, else this session's) */
function numbersTonight(c, night) {
  let n = TONIGHT.get(night) || 0;
  const B = c?.celebs?.bonds; if (B) { let k = 0; for (const b of Object.values(B)) if (b?.met0?.k === night) k++; n = Math.max(n, k); }
  return n;
}

// ---- who she is tonight, and what the two of you have -------------------------------------------------------------------
/** taken (for the season), busy (tonight) or free */
function availOf(p, seed, season, night, place) {
  if (p !== 'fling' && hash(`taken|${seed}|${season}`) % 100 < TAKEN) return 'taken';
  return hash(`busy|${seed}|${night}`) % 100 < (BUSY[place] ?? 20) + (p === 'fling' ? FLING_BUSY : 0) ? 'busy' : 'free';
}
/** your edge with her tonight, on top of the chemistry: fame, a win, her tastes, the drink, a partner she has read about */
function edgeOf(c, ctx, place, e) {
  let v = 0;
  const fame = c?.pr ? fameIndex(c.pr.fame ?? 0.4) : num(ctx.me?.fame) ?? 40, T = e.local?.traits || {}, likes = arr(T.likes), dislikes = arr(T.dislikes);
  v += fame >= 75 ? 1 : fame >= 55 ? 0.5 : 0;
  const S = c?.party?.race, night = place === 'club' || place === 'party';
  if (night && S && S.season === c.season) v += S.won ? 1 + (likes.includes('winner') ? 0.5 : 0) : S.podium ? 0.5 : 0;
  if (likes.includes('confident') && fame >= 55) v += 0.5;
  if (likes.includes('humble') && fame >= 80) v -= 0.5;
  const lv = levelOf(ctx); v -= lv >= 3 ? 1.5 : night ? (lv === 1 || lv === 2 ? -0.5 : 0) : lv >= 2 ? 0.5 : 0;   /* (after dark a drink or two loosens everyone up; drunk never helps) */
  const pid = c?.celebs?.partner, pub = !!pid && !!c.celebs.bonds?.[pid]?.public && pid !== e.lid;
  if (pub) v -= dislikes.includes('scandal') ? 1.5 : 0.75;
  return v;
}
/**
 * Everything the tree is built from (the tests read it) -> { place, vid, night, avail, chem, base, full, n (numbers
 * tonight), kinds: { tone: kind } } | null
 */
export function strangerPlan(e, ctx = {}) {
  if (!e || !e.fem || !STRANGER[e.persona]) return null;
  const c = careerOf(ctx), vid = venueIdOf(ctx), place = placeOf(ctx, vid), night = nightKey(c, place, vid), p = e.persona, seed = e.seed >>> 0;
  const me = c?.playerId || ctx.me?.name || 'you', chem = CHEM[hash(`chem|${seed}|${me}`) % CHEM.length], n = numbersTonight(c, night), dark = NIGHT.has(place), full = n >= (dark ? CAP_NIGHT : NIGHT_CAP);
  const base = chem + edgeOf(c, ctx, place, e) - (dark ? 0.35 : 0.75) * n, avail = availOf(p, seed, roundOf(c, place).season, night, place), kinds = {};
  for (const t of tonesFor(p)) {
    const landed = !full && base + toneWorth(p, 'new', t) >= (dark ? LAND_NIGHT : LAND);
    kinds[t] = full ? 'full' : avail === 'taken' ? 'taken' : avail === 'busy' ? (landed ? 'rushed' : 'busy') : landed ? 'keen' : 'polite';
  }
  return { place, vid, night, avail, chem, base, full, n, kinds, dark, land: dark ? LAND_NIGHT : LAND };
}
const OUTCOME = { keen: 'interested', polite: 'polite', rushed: 'busy', busy: 'busy', taken: 'taken', full: 'full' };
/** does your second answer get her number: always (yes only), never (no only), or with enough between you (both: need) */
const swaps = (X, kind, base, worth, land = LAND) => kind !== 'full' && arr(X?.yes).length > 0 && (!arr(X?.no).length || base + worth >= land + (X.need ?? 0));
/** her last-word pool for a moment and a tone (a missing one: the polite one's) */
const endOf = (D, kind, tone) => D.end?.[kind === 'full' ? 'polite' : kind]?.[tone] || D.end?.polite?.[tone] || { no: D.end?.polite?.passive?.no || [] };
const turnOf = (D, kind, place) => { const T = D.turn?.[kind] || D.turn?.polite; return arr(T?.[place]).length ? T[place] : arr(T?.any).length ? T.any : arr(D.turn?.polite?.[place]); };
const flirtFx = (t, swap, close = null) => { const o = {}; if (t === 'flirty' || t === 'risque') o.flirt = true; if (swap) o.number = true; if (close === 'dance') o.dance = true; if (close === 'kiss') o.kiss = true; if (close === 'leave') { o.kiss = true; o.together = true; } return Object.keys(o).length ? o : undefined; };

// ---- the talk ------------------------------------------------------------------------------------------------------------
/**
 * The first words with a stranger from a crowd -> a talk tree (see the header) | null (a man, nobody, a grave week or a
 * memorial day: the scene's own few words instead)
 */
export function strangerTalk(e, ctx = {}) {
  if (!e || !e.fem || !STRANGER[e.persona]) return null;
  const c = careerOf(ctx);
  if (ctx.quiet || ctx.memorial || ctx.grave || c?.pr?.ctx?.grave) return null;
  const lid = e.lid || localId(e.seed), cid = `c:${lid}`;
  // (a regular you already know - met here on an earlier night: her own personality's talk, as a met local's)
  if (c && known(c, lid)) {
    const vid = venueIdOf(ctx), pl = placeOf(ctx, vid);
    const t = safe('her own talk', () => personaTalk(c, cid, { party: pl === 'club' || pl === 'party', where: pl === 'grid' ? 'grid' : undefined, T: { name: e.name, job: e.job, venue: WORD[vid] || (pl === 'grid' ? 'the grid' : '') } }));
    if (t) { t.known = true; t.lid = lid; t.cid = cid; t.result = { outcome: 'known', known: true, promote: true, lid, cid, stage: c.celebs?.bonds?.[lid]?.stage || 'met', applied: false, line: '' }; return t; }
  }
  const P = strangerPlan(e, ctx); if (!P) return null;
  const p = e.persona, D = STRANGER[p], seed = e.seed >>> 0, memo = MEMO.get(`${P.night}|${seed}`);
  const R = rngOf(`${seed}|${P.night}|${memo ? `again${memo.n}` : 'first'}`), track = trackOf(c, ctx, P.place);
  const T = { me: firstOf(ctx.me?.first || ctx.me?.name || c?.drivers?.[c?.playerId]?.name) || 'you', first: e.first || firstOf(e.name), job: String(e.job || '').toLowerCase(),
    venue: WORD[P.vid] || (P.place === 'grid' ? 'the grid' : typeof ctx.venue === 'string' && !WORD[ctx.venue] ? ctx.venue.replace(/^The\b/, 'the') : 'here'), track: track || 'this race' };
  // (no name for you - a test, a scene that passed none: your introductions just leave it out)
  const noMe = /^you$/i.test(T.me), unme = (s) => (noMe ? String(s || '').replace(/ I'm \{me\}\./g, '').replace(/^I'm \{me\}\. /, '').replace(/I'm \{me\}, /g, "I'm ").replace(/^(Hi|Hey), (?=[A-Z])/, '$1. ') : s);
  const day = P.place === 'grid' && ctx.night !== true, fill0 = (s) => String(unme(s) || '').replace(/\{(\w+)\}/g, (m, k) => T[k] ?? '').replace(/ {2,}/g, ' '), fill = day ? (s) => dayOf(fill0(s)) : fill0;
  const M = { e, c, ctx, seed, lid, cid, p, plan: P, track, where: whereOf(ctx, P.place, P.vid, track), scope: ctx.scope || (P.vid ? `${P.place}:${P.vid}` : P.place) };
  const tree = memo ? againTree(M, D, R, fill, memo) : firstTree(M, D, R, fill);
  tree.persona = p; tree.stranger = true; tree.seed = seed; tree.lid = lid; tree.cid = cid; tree.result = null;
  tree.done = (tones) => (tree.result ||= settle(M, tree, arr(tones)));
  return tree;
}
/** the meeting proper: her opener, your answers, her reaction, the turn, your second answers, her last word */
function firstTree(M, D, R, fill) {
  const { p, plan: P } = M, draw1 = drawer(R), draw2 = drawer(R), branch = {};
  const opts = tonesFor(p).map((t) => {
    const kind = P.kinds[t], landed = kind === 'keen' || kind === 'rushed' || (kind === 'taken' && P.base + toneWorth(p, 'new', t) >= P.land);
    const r = fill(pickR(R, D.react?.[t]?.[landed ? 'yes' : 'no'])), say = fill(draw1(turnOf(D, kind, P.place))), sub = {};
    const k2 = kind === 'full' ? 'polite' : kind;
    const then = tonesFor(p).map((t2) => {
      const X = endOf(D, kind, t2), w = toneWorth(p, 'new', t2), swap = swaps(X, kind, P.base, w, P.land);
      // (after dark, a flirt that gets her number can turn straight into something: a dance, a kiss, leaving together)
      const close = P.dark && swap && kind === 'keen' && (t2 === 'flirty' || t2 === 'risque') ? closeOf(R, t2, P.place) : null;
      sub[t2] = { swap, close };
      const r2 = fill(pickR(R, swap ? X.yes : X.no)) + (close ? ` ${pickR(R, CLOSE[close])}` : '');
      return { t: fill(draw2(YOU2[k2]?.[t2] || YOU2.polite[t2])), tone: t2, r: r2, m: w + (swap ? 1 : 0) + (close ? 1 : 0), fx: flirtFx(t2, swap, close) };
    });
    branch[t] = { kind, sub };
    return { t: fill(draw1(YOU[P.place][t])), tone: t, r, m: toneWorth(p, 'new', t), fx: flirtFx(t, false), then: { say, opts: then } };
  });
  M.branch = branch;
  return { id: `stranger:${p}:${P.place}`, say: fill(pickR(R, D.open?.[P.place])), opts };
}
/**
 * A second try the same night: one who was keen, but you walked off, still has the question open (her keen line, your
 * second answers); anyone else remembers her answer (her line, your few words, her last)
 */
function againTree(M, D, R, fill, memo) {
  const { p, plan: P } = M, draw = drawer(R), sub = {};
  if (memo.outcome === 'interested' && !P.full) {
    const opts = tonesFor(p).map((t) => { const X = endOf(D, 'keen', t), w = toneWorth(p, 'new', t), swap = swaps(X, 'keen', P.base, w, P.land); sub[t] = { swap }; return { t: fill(draw(YOU2.keen[t])), tone: t, r: fill(pickR(R, swap ? X.yes : X.no)), m: w + (swap ? 1 : 0), fx: flirtFx(t, swap) }; });
    M.again = { kind: 'keen', sub };
    return { id: `stranger:${p}:again`, say: fill(pickR(R, turnOf(D, 'keen', P.place))), opts };
  }
  const ends = drawer(R), opts = ['cold', 'passive', 'flirty'].map((t) => { sub[t] = { swap: false }; return { t: fill(pickR(R, AGAIN[t])), tone: t, r: fill(ends(D.again?.end)), m: t === 'cold' ? -1 : 0, fx: flirtFx(t, false) }; });
  M.again = { kind: 'again', sub };
  return { id: `stranger:${p}:again`, say: fill(pickR(R, D.again?.say)), opts };
}

// ---- what it comes to ----------------------------------------------------------------------------------------------------
/** the talk closed (tones: your answers, in order) -> the result, applied to the career when there is one */
function settle(M, tree, tones) {
  const { p, plan: P, lid, cid, e } = M, f = e.first || firstOf(e.name);
  let kind, swap = false, close = null;
  if (M.again) { kind = M.again.kind; swap = !!M.again.sub[tones[0]]?.swap; }
  else { const b = M.branch?.[tones[0]]; kind = b?.kind || 'polite'; swap = !!(b && tones[1] && b.sub[tones[1]]?.swap); close = (swap && b.sub[tones[1]]?.close) || null; }
  const outcome = swap ? 'number' : kind === 'again' ? 'again' : OUTCOME[kind] || 'polite';
  const res = { outcome, promote: swap, close, lid, cid, kind, tones: tones.slice(0, 2), mood: moodAfter(tones) || 'passive', persona: p, stage: 'stranger', delta: 0, applied: false, where: M.where,
    line: swap ? `Swapped numbers with ${f}` : outcome === 'interested' ? `${f} was interested. You left it there` : outcome === 'taken' ? `${f} is seeing someone` : outcome === 'busy' ? `${f} had to go`
      : outcome === 'full' ? `${f} saw you collecting numbers all night` : outcome === 'again' ? `${f} has not changed her mind` : `${f} wasn't interested` };
  if (!swap) { const k = `${P.night}|${M.seed}`, was = MEMO.get(k); remember(k, { outcome: outcome === 'again' ? was?.outcome || 'polite' : outcome, n: (was?.n || 0) + 1 }); }
  else TONIGHT.set(P.night, (TONIGHT.get(P.night) || 0) + 1);
  const c = M.c; if (!c) return res;
  if (swap) safe('her number', () => promote(M, res));
  else safe('letting her go', () => { if (forgetStranger(c, lid, { fresh: true })) res.released = true; });
  return res;
}
/**
 * She gave you her number: the local her seed already is, met here (stage 'met', where and when, affection for how the
 * talk went, a flirt counted, trust for a straight answer), her personality's mood from the way you left it, and her
 * first text in your phone
 */
function promote(M, res) {
  const { c, e, ctx, lid: lid0, cid, p, plan: P, where } = M;
  const lid = promoteExtra(c, M.seed, { scope: M.scope }) || lid0, C = Celebs.CELEB[lid]; if (!C) return;
  const b = Celebs.bondOf(c, lid), at = roundOf(c, P.place), f = firstOf(C.name), tones = res.tones;
  if (b.stage === 'stranger') b.stage = 'met';
  if (!b.met0) b.metAt = at;   /* (a scene that met her as you walked up stamped the career's round; this is the race's) */
  if (Array.isArray(c.celebs?.met) && !c.celebs.met.includes(lid)) c.celebs.met.push(lid);
  // (where and when: the phone's 'met at', and the night's count of numbers)
  b.met0 = { k: P.night, at: where, place: P.place, s: at.season, r: at.round };
  const rk = `${c.season}|${c.round}`; if (b.talkRound !== rk) { b.talkRound = rk; b.talks = (b.talks || 0) + 1; }
  b.last = { season: c.season, round: c.round }; b.idle = 0;
  const w = tones.reduce((s, t, i) => s + toneWorth(p, 'new', t) * (i ? 0.5 : 1), 0);
  res.delta = Celebs.relateCeleb(c, lid, 5 + Math.max(0, Math.min(8, Math.round(w))), `Met ${C.name} (${String(C.job).toLowerCase()}) at ${where}. You swapped numbers`);
  const fl = tones.filter((t) => t === 'flirty' || t === 'risque').length; for (let i = 0; i < Math.min(2, fl); i++) Celebs.flirt(c, lid);
  // (after dark it went further than a number - a dance, a kiss, leaving together: you are flirting already)
  if (res.close && (b.stage === 'met' || b.stage === 'friendly')) b.stage = 'flirting';
  if (tones.includes('passive')) Celebs.trustCeleb(c, lid, 2);
  // (her personality: the story starts at its first slot, in the mood the meeting left her in)
  const s = psOf(c, cid); if (s) { s.mood = res.mood; s.last = { mood: res.mood, how: 'met', at: `${c.season}:${c.round}` }; }
  // (and her first text: 'met', in her own voice - the one the phone waits on you to answer)
  const L = c.calendar, next = L?.length ? trackName(L[(Math.max(1, c.round) - 1) % L.length]) : '';
  const txt = personaIncoming(c, cid, 'met', { name: C.name, job: C.job, work: '', track: next, last: M.track, me: firstOf(c.drivers?.[c.playerId]?.name) });
  if (txt) pushText(c, cid, txt, { kind: 'persona' });
  Object.assign(res, { lid, cid: `c:${lid}`, stage: b.stage, applied: true, met: metLine(c, lid) });
  res.line = res.close === 'leave' ? `${f} wants to leave with you` : res.close === 'kiss' ? `${f} kissed you` : res.close === 'dance' ? `${f} pulled you onto the dance floor` : `${f} put her number in your phone`;
}
/** someone already known to the career (not just taken into tonight's scene): a bond past a stranger's with any history */
function known(c, lid) {
  const b = c?.celebs?.bonds?.[lid]; if (!b || b.stage === 'stranger') return false;
  return !forgetStranger(c, lid, { fresh: true, dry: true });
}
