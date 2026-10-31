// What people say to each other off the clock (ui/Hangout.js): the talk for an evening out between race weekends - a
// sim-racing lounge, a village pub near Silverstone, a rooftop lounge over the Strip, your flat, a private dining room,
// an indoor karting hall. Walk up to someone and press E and one of these topics comes up; each guest can be talked to
// three times in an evening, with something fresh each time. With the other drivers it is the stuff of a night off:
// the last race, sim racing and games, food, music, training, travel, nerves, team life, silly-season gossip about
// people nobody has heard of, a rivalry kept on the track, pranks, the winter - and trash talk over the darts, the pool
// table, the sim rigs and the karts. At these seven evening venues (the rooftop, the pub, the sim lounge, your flat, the
// dining room, the karting hall and the grave week's café) the drivers are real people, so they only ever talk about the
// job and the evening in front of them: nothing about their private lives, their families or anyone they love, and their
// tastes ('likes somewhere quiet') are the game's, not facts about them. With the celebrities (all twelve made up, all
// adults) a date is a date: her work, where she wants to go next, home, what she sees in racing, the harder
// conversations ('what are we?'), making it official - and, if you are seeing more than one of them, the sneaky side: a
// phone that will not stop buzzing, a cover story, a question you cannot dodge for ever. She notices, she has a mind of
// her own, and she can walk out. It stays PG: compliments, laughter, a hand held across a table. At those seven the
// drinks are coffee, juice, mocktails and soft drinks (it is a weeknight between races: everyone is in season). In a
// grave week there is no banter and no flirting - only a quiet coffee and kind words (the topics marked quiet) - and a
// celebrity who has lost someone hears nothing but kindness. Nobody wishes anyone harm.
//
// The after-party is different (ui/PartyTalk.js: the team's hospitality, a casino-resort club on the Strip, a members'
// club in Mayfair - race night, never in a grave week): realistic adult F1 nightlife, as it really happens and not
// sanitised, and never sexual. Champagne, cocktails, shots and what follows - a loose line about the car, a row, the
// ex walking in with somebody new, a drunk stranger, a scuffle broken up by security; PG romance with the twelve stars
// (a dance, a kiss shown as a cut-away, leaving together). Never: nudity or anything sexual, drugs of any kind (not even
// implied), drink-driving, anyone under age drinking (21 in Nevada, 18 in England), anyone hurt. The real drivers come,
// network, toast with a glass, dance, banter and argue about the race - and are never drunk, never in a romance or a
// scandal, never in a fight; drunkenness, romance and scandal fall only on you, the stars and the invented people. At a
// party venue the pool is PartyTalk's PARTY_TOPICS plus the evening topics its PARTY_KEEP lets through, a guest can be
// a 'person' (a rep, an agent, the columnist, an influencer, the DJ, security, the team principal, your PR manager, an
// antagonist), and PartyTalk's contract block has the rest (x.party, roles, the new fx, dramas, loose lines).
//
// The data is the grid talk's shape (ui/GridTalk.js: who, w, when, open, opts with t / r / m / end / then; every line a
// pool), plus id, where (venue ids: rooftop, pub, simlounge, apartment, restaurant, karting), quiet (fit for a grave
// week) and crowd (one of hers that still works with others at the table). who is any of 'driver', 'celeb', 'group'
// (three or more of you: the guest you are talking to is {first}, the other is {other}) and, at a party, 'person' (with
// role: the person's role). Tones are the walk's: kind, firm, light, cold, cruel, sorry, gossip, leave, flirt, show; m
// overrides the tone's weight, as on the walk (hangoutMood) - and may be a function (x, n) of the guest (a rep's taste).
// fx is a string or a list: flirt, charm, deep (a real conversation), cover (a cover story), confess (owning up), invite
// (another evening, the garage at the next race, a day out) and the party's network, loose, provoke, dance, together,
// kiss, clear, selfie, shoey, calm, water; ui/Hangout.js turns them into the evening's result. An answer may also carry
// when (x, n) (offered only then), act, out and leak (the party's: see PartyTalk). An answer's t and r pools of the same
// length are pairs: draw them with one index (buildHangout does).
// Tokens: {name} the guest's name, {first} their first name, {team} their team (a driver), {venue} where you are,
// {track} this round's circuit, {result} your last result ('the win', 'P6', 'the retirement'), {her} her first name,
// {job} her job, {herWork} something she is busy with (always in her own voice: 'my documentary'), {partner} your
// public partner's first name (else 'her'), {other} the other guest's first name - and at a party {brand} {product}
// {club} {city} {gp} {mate} {mateResult} {rival} {winner} {dj} {client} {client2} {ex} {exnew} {me} {sur} {title}
// {outlet}.
// The evening x: { venue, venueName, track, night, date (a date rather than a hangout), lastPos (null: no race yet,
// 0: a retirement), lastDnf, result, grave, other / others (names), guests (how many), late (winding down), moment (the
// quiet minute at the window or on the balcony), played ('pool' | 'darts' | 'sim' | 'karting' | 'cooking' | 'arcade')
// and won, privacy (the venue's, 0..1), secret (a secret date), buzz (your phone has buzzed), seeing (how many you are
// seeing), partner (you have a public partner), partnerId, partnerName, points (licence points), crisis (a pending PR
// crisis kind), and at a party meName and party (PartyTalk's x.party) }. The guest n: { kind ('driver' | 'celeb' |
// 'person'), name, first, team, mate (your team-mate), stage (a driver's friendship: acquaintance, friendly, friend,
// mate, best - or her bond's stage), rapport, tastes, celebId, job, work / herWork, public, secret, suspicion (0..100),
// free (0..1), dates, grieving, other, talks, and at a party cid, role, real, under, present (and a person's own fields:
// PartyTalk.partyGuest) }. Every field is optional: a missing one only hides the topics that need it, and the quiet
// topics never need more than x.grave / n.grieving.
// hangoutEvening(c, o) and hangoutGuest(c, g, x) read both from the career; hangoutTalk(x, n, used) picks and builds a
// fresh topic; hangoutBye(x, n, dm) is the guest's line as a conversation closes; at a party hangoutDrama(x, n, id)
// builds a drama's talk and hangoutLoose(x, n) one loose line (an answer PartyPlay can swap in).
import { CELEB } from '../career/Celebs.js';
import { personaTalk, TONE_TAG } from '../career/Persona.js';
import { activePoints } from '../career/Licence.js';
import { PARTY_TOPICS, PARTY_KEEP, PARTY_VENUE_WORD, PARTY_PRIVACY, isPartyVenue, partyGuest, partyEvening, partyBye, partyLooseFor, realDriver, partyUnder, dramaId } from './PartyTalk.js';
/** an evening that is a party (x from hangoutEvening): the pool club is an ordinary evening too - a party only with the night's x.party */
const isPartyX = (x) => isPartyVenue(x?.venue) && (x.venue !== 'poolclub' || !!x.party);

// ---- small helpers ---------------------------------------------------------------------------------------------------
const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : a);
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((p, q) => p[0] - q[0]).map((v) => v[1]);
const firstOf = (s) => String(s || '').trim().split(' ')[0];
const lastOf = (s) => String(s || '').trim().split(' ').pop();
// (the fx a talk can carry into the evening's result: the evening's own six, then the party's - PartyTalk's contract)
const FX = ['flirt', 'charm', 'deep', 'cover', 'confess', 'invite', 'network', 'loose', 'provoke', 'dance', 'together', 'kiss', 'clear', 'selfie', 'shoey', 'calm', 'water'];
// (how the guest refers to the place, mid-sentence)
const VENUE = { rooftop: 'the rooftop', pub: 'the pub', simlounge: 'the sim lounge', apartment: 'your flat', restaurant: 'this place', karting: 'the karting hall', poolclub: 'Tidewater', dayclub: 'Tidewater', ...PARTY_VENUE_WORD };

// ---- who, and how things stand ------------------------------------------------------------------------------------------
/** a celebrity (the hangout's 'celeb', or the grid walk's 'star') -> bool */
const isStar = (n) => n.kind === 'celeb' || n.kind === 'star' || !!n.celebId;
/** where things stand: a driver's friendship stage, or her bond's (a date when nobody says) */
const st = (n) => n.stage || (isStar(n) ? 'dating' : 'friendly');
const at = (n, ...s) => s.includes(st(n));
/** an ordinary week: nothing grave this round -> bool */
const ok = (x) => !x.grave;
/** an ordinary evening with her: not a grave week, and she is not grieving -> bool */
const calm = (x, n) => !x.grave && !n.grieving;
/** more than friendship with her -> bool */
const rom = (n) => at(n, 'flirting', 'dating', 'partner');
/** a real friend by now (a driver) -> bool */
const close = (n) => at(n, 'friend', 'mate', 'best');
/** her own topic: this celebrity, on an ordinary evening, not an ex -> a when() */
const own = (id) => (x, n) => n.celebId === id && calm(x, n) && st(n) !== 'ex';
/** one of their tastes (the game's, hashed from the id - never a fact about the person); unknown tastes fit everything */
const likes = (n, t) => !Array.isArray(n.tastes) || n.tastes.includes(t);
/** your last finishing position (null: none yet; 0: a retirement) */
const pos = (x) => (typeof x.lastPos === 'number' ? x.lastPos : null);
const podium = (x) => !x.lastDnf && pos(x) >= 1 && pos(x) <= 3;
const midfield = (x) => !x.lastDnf && pos(x) >= 4 && pos(x) <= 12;
/** a race to forget: a retirement, or well down the order -> bool */
const rough = (x, p = 13) => !!x.lastDnf || pos(x) === 0 || pos(x) >= p;
const sus = (n) => n.suspicion || 0;
/** a secret evening: a secret date, or a relationship you are keeping quiet -> bool */
const sneaky = (x, n) => !!(x.secret || n.secret);
/** your public partner is someone else (so she can ask about her) -> bool */
const otherHer = (x, n) => !!x.partner && (x.partnerId ? x.partnerId !== n.celebId : !!x.partnerName && firstOf(x.partnerName) !== (n.first || firstOf(n.name)));

// =====================================================================================================================
// the topics
// =====================================================================================================================
export const HANGOUT_TOPICS = [
  // =====================================================================================================================
  // the drivers: a night off (light and generic - the job, the evening, never their private lives)
  // =====================================================================================================================
  // ---- arriving: a night off at last -----------------------------------------------------------------------------------
  { id: 'dShout', who: ['driver'], w: 3, when: (x, n) => ok(x) && !(n.talks > 0), open: [
    "Good shout, coming to {venue}. I haven't had a proper night off since the start of the season.", "You actually found somewhere with no cameras. Impressive.", "Right, I'm here. My phone's on silent. That's a big moment for me.", "So this is what normal people do on a weeknight?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Glad you came. It's good to see you away from the paddock.", "Thanks for coming. It's nice to talk about something other than tyres."], r: ["Yeah. Same. It's weird seeing you without a helmet on.", "Agreed. Nobody mention tyres."], then: { say: ["So what's the plan? I'm terrible at relaxing.", "What do we do now? Is there a schedule? I need a schedule.", "What's the plan? Everyone at {team} says I'm hopeless at switching off."], opts: [
        { tone: 'light', t: ["No plan. That's the whole plan.", "There's a schedule. Item one: sit down."], r: ["Terrifying. I love it.", "Ha. I can do item one."] },
        { tone: 'kind', t: ["Eat something, talk rubbish, home at a sensible hour. Perfect evening.", "Whatever you fancy. You're the guest."], r: ["Sold.", "Careful - I fancy a lot."] },
        { tone: 'firm', t: ["One rule: nobody talks about setup.", "Home by eleven. We've both got races coming."], r: ["Deal. That's going to be hard.", "Sensible. Boring, but sensible."] },
        { tone: 'show', t: ["Watch and learn. I'm very good at nights off.", "I've planned it to the minute. Like a qualifying lap."], r: ["Of course you have.", "Ha. Course you have."] } ] } },
      { tone: 'light', t: ["On silent? Steady. Don't go wild.", "Normal people? I wouldn't know. I'm copying a film."], r: ["Baby steps.", "Ha. Which film? I want to know how it ends."] },
      { tone: 'firm', t: ["You needed it. We all do, this far into the year.", "Everyone needs a night off. Even us."], r: ["Yeah. I didn't realise how much until I sat down.", "Don't tell the team, but yeah."] },
      { tone: 'cold', t: ["It's just an evening out. Don't make it a thing.", "It's food. Relax."], r: ["...Right. Okay.", "Okay, okay."] },
    ] },
  // ---- the last race: a podium -------------------------------------------------------------------------------------------
  { id: 'dPodium', who: ['driver'], w: 4, when: (x) => ok(x) && podium(x), open: [
    "Go on, then. How does {result} feel a few days later?", "Look at you. Still smiling about {result}?", "I watched the replay of your last stint. Annoyingly good.", "Where's the trophy living? Please say the kitchen table." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Still unreal. The team earned that one, honestly.", "Mostly relief. Then I couldn't sleep for two nights."], r: ["That's the right answer.", "Ha. The not-sleeping is the best bit."], then: { say: ["What's the moment you'll keep? The one bit?", "What was the bit you'll remember?"], opts: [
        { tone: 'kind', t: ["The in-lap. Every marshal waving.", "The radio after the flag. My engineer lost his voice."], r: ["Yeah. Those are the ones.", "Ha. Brilliant."] },
        { tone: 'firm', t: ["The restart. I knew I had them.", "One lap in the middle. Everything just clicked."], r: ["Proper racer's answer.", "I know that feeling. Rare, isn't it?"] },
        { tone: 'light', t: ["The cool-down lap. I sang. Badly.", "Finding out the trophy doesn't fit in my bag."], r: ["Ha! On the radio?", "Ha. Classic."] },
        { tone: 'show', t: ["All of it. I'd watch it again tonight.", "The podium. Best view in the sport."], r: ["Course you would.", "It is. Don't get used to it."] } ] } },
      { tone: 'show', t: ["Feels like the first of many.", "Feels normal, to be honest. Get used to it."], r: ["Ooh. Listen to this one.", "Get used to it? Steady on."] },
      { tone: 'light', t: ["The trophy's on the kitchen table. I eat breakfast with it.", "It's in the downstairs loo. Pride of place."], r: ["Ha! Of course it is.", "Ha. Everyone who visits has to see it."] },
      { tone: 'firm', t: ["It's done. The next one's the one that matters.", "Enjoyed it for a night. Back to work."], r: ["Proper answer. Boring, but proper.", "Fair. That's the job."] },
    ] },
  // ---- the last race: a quiet one in the pack -----------------------------------------------------------------------------
  { id: 'dMidfield', who: ['driver'], w: 3, when: (x) => ok(x) && midfield(x), open: [
    "{result} last time. Decent. Bit of a quiet one, though?", "Solid points last time. What was the limit - you or the car?", "Your middle stint last time was mega. Nobody saw it on TV, obviously." ],
    opts: [
      { tone: 'firm', t: ["The car. I had nothing more to give it.", "Me in the first stint, the car after that."], r: ["Honest.", "Yeah, I could see you fighting it."], then: { say: ["What would you change, if you could?", "What's the fix, then?"], opts: [
        { tone: 'firm', t: ["Qualifying. Start higher and the race looks after itself.", "The first stint. I was too careful."], r: ["Always qualifying.", "Too careful's better than the gravel."] },
        { tone: 'kind', t: ["Honestly? Nothing. We got everything out of it.", "Not much. The team did a good job."], r: ["Then that's a good day.", "Fair."] },
        { tone: 'light', t: ["The strategy, the setup, the weather and the driver.", "The car. And the colour of the car."], r: ["Ha. Just those, then.", "Ha. Very scientific."] } ] } },
      { tone: 'kind', t: ["Points are points. The team needed them.", "Every point counts by the end of the year."], r: ["True. They add up.", "Yeah. They do."] },
      { tone: 'light', t: ["Quiet? I was shouting in my helmet the whole race.", "Nobody saw it? Perfect. I can exaggerate."], r: ["Ha! I bet you were.", "Ha. Go on, then."] },
      { tone: 'show', t: ["Ten more laps and I'd have been on the podium.", "That stint was the best driving on the grid. Write it down."], r: ["Ten more laps. Sure.", "Noted. In very small writing."] },
    ] },
  // ---- the last race: a bad day ----------------------------------------------------------------------------------------------
  { id: 'dRough', who: ['driver'], w: 4, when: (x) => ok(x) && rough(x), open: [
    "Sorry about {result}. Rotten luck.", "You alright after last time? Looked like a long afternoon.", "I saw what happened last time. You okay?", "I'm not going to ask about the last race. ...How was the last race?" ],
    opts: [
      { tone: 'kind', t: ["I'm alright. Being out helps, honestly.", "Better now. Thanks for asking."], r: ["Good. That's what tonight's for.", "Course."], then: { say: ["How do you let one like that go?", "Do you replay it, or switch it off?"], opts: [
        { tone: 'kind', t: ["Talk it through with the team, then switch off. Like now.", "Find one thing to learn and leave the rest at the track."], r: ["Good way to do it.", "Wish I could do that."] },
        { tone: 'firm', t: ["Find the one thing to fix. Ignore everything else.", "Switch it off. It's gone."], r: ["Fair.", "Easier said than done."] },
        { tone: 'light', t: ["Ice cream. A lot of ice cream.", "I watch it back until it's funny. Takes a while."], r: ["Ha. Science.", "Ha. Is it funny yet?"] },
        { tone: 'kind', fx: 'deep', t: ["I don't, really. I carry them all. Is that normal?", "Honestly? I replay every one. For weeks."], r: ["Probably. I think we all do. You just get better at carrying them.", "Same. Nobody says it, but same."] } ] } },
      { tone: 'firm', t: ["Gone. Forgotten. Next one.", "It happens. You go again."], r: ["Right attitude.", "That's the only way."] },
      { tone: 'light', t: ["I've watched it back twice. It doesn't get any better.", "Long afternoon? It felt like a week."], r: ["Ha. Stop watching it.", "Ha. Fair."] },
      { tone: 'cold', t: ["I'd rather not talk about it.", "Can we not?"], r: ["Course. Sorry.", "Yeah. Fair enough."] },
    ] },
  // ---- sim racing -------------------------------------------------------------------------------------------------------------
  { id: 'dSim', who: ['driver'], w: 1.2, when: (x, n) => ok(x) && likes(n, 'gaming'), open: [
    "Are you still on the sim every night? Your online times are scary.", "What rig have you got at home? Be honest. Is it a nice one?", "I did three hundred laps on the sim this week and I'm still braking too late into one corner." ],
    opts: [
      { tone: 'kind', t: ["Every night. It's the only quiet I get.", "Too much. My neighbours think I'm a DJ."], r: ["Ha. Same.", "Ha! Brilliant."], then: { say: ["Do you race online for fun, or is that weird?", "Do you ever just race strangers online?"], opts: [
        { tone: 'light', t: ["Under a fake name. Teenagers beat me constantly.", "Sometimes. I get told I'm slow by people called things like 'Turbo Gav'."], r: ["Ha! Humbling.", "Ha. Turbo Gav. Legend."] },
        { tone: 'kind', t: ["Sometimes. It's the only racing where nobody knows who I am.", "Yeah. It reminds me it's meant to be fun."], r: ["I like that.", "Fair."] },
        { tone: 'firm', t: ["No. If I'm driving, I'm working.", "Only practice. Never for fun."], r: ["Proper.", "Very serious."] },
        { tone: 'show', t: ["Fun is winning. So, yes.", "I hold a few lap records. Nobody knows they're mine."], r: ["Course it is.", "Ooh. Mysterious."] } ] } },
      { tone: 'light', t: ["My rig's a chair, a wheel and a lot of gaffer tape.", "It wobbles. I call it realism."], r: ["Ha! Heritage.", "Ha. Very authentic."] },
      { tone: 'show', t: ["It moves. It's got a fan for the wind. It's ridiculous.", "It cost more than my first car. Worth every penny."], r: ["A fan for the wind? I need one.", "Ha. Course it did."] },
      { tone: 'firm', t: ["Only for work. Once I'm home, I'm off it.", "The team's sim is the one that counts. Mine's a toy."], r: ["Healthy.", "Fair point."] },
    ] },
  // ---- games on the road -------------------------------------------------------------------------------------------------------
  { id: 'dGames', who: ['driver'], w: 1.5, when: (x, n) => ok(x) && likes(n, 'gaming'), open: [
    "Be honest: what are you playing at the moment? Not racing games.", "Cards on the plane, or are you a headphones-and-sleep person?", "I need a new game for the flights. Recommend something. Not chess." ],
    opts: [
      { tone: 'kind', t: ["Cards. Always cards. It's how you get to know the crew.", "A card game my grandad taught me. Takes a month to learn."], r: ["Teach me, then.", "A month? Go on."], then: { say: ["Go on - teach me. I'm a quick learner.", "What's the trick to it?"], opts: [
        { tone: 'kind', t: ["You'll lose for a month, then you'll love it.", "Patience. It's all patience."], r: ["Sounds about right.", "Not my strength. Teach me anyway."] },
        { tone: 'light', t: ["The rules change depending on whether I'm winning.", "The trick is to deal."], r: ["Ha! Cheat.", "Ha. Noted."] },
        { tone: 'firm', t: ["Next flight. Bring coins.", "Next flight. No mercy."], r: ["Deal.", "Bring it."] } ] } },
      { tone: 'light', t: ["A farming game. It's very calming. Don't laugh.", "A puzzle game about sorting socks. I'm hooked."], r: ["Ha! A farming game. I love that.", "Socks? Ha. Okay."] },
      { tone: 'show', t: ["Whatever it is, I'm better at it than you.", "Name any game. I'll beat you at it."], r: ["We'll see.", "Big words."] },
      { tone: 'firm', t: ["Sleep. Every flight. I'm a professional.", "Headphones. I don't talk to anyone till we land."], r: ["Respect.", "Wise."] },
    ] },
  // ---- food -----------------------------------------------------------------------------------------------------------------
  { id: 'dFood', who: ['driver'], w: 1.5, when: (x, n) => ok(x) && (likes(n, 'food') || likes(n, 'coffee')), open: [
    "I'm starving. What's good here? Don't say salad.", "What's the rule for you in season - anything, or nothing fun?", "The coffee in our hospitality is getting worse. Where do you get yours?" ],
    opts: [
      { tone: 'kind', t: ["Share something? I always want what the other person ordered.", "Order two things and we'll split them."], r: ["Deal. I'm the same.", "Best idea I've heard all week."], then: { say: ["Best thing you've eaten on the calendar? Anywhere.", "Proper question: favourite meal on the road?"], opts: [
        { tone: 'kind', t: ["A street stall the night before a race. Can't remember the city. Can't forget the noodles.", "Whatever the mechanics are cooking on the last night. Every time."], r: ["That's the good stuff.", "Yeah. Nothing beats that."] },
        { tone: 'light', t: ["My nutritionist's porridge. ...I'm joking. Please don't tell her.", "Airport sandwich, four in the morning. It was emotional."], r: ["Ha! Your secret's safe.", "Ha. We've all been there."] },
        { tone: 'firm', t: ["Plain pasta. Every race. It's not about taste.", "Rice and chicken. I'm a joy to eat with."], r: ["Disciplined.", "Ha. Very joyful."] } ] } },
      { tone: 'light', t: ["Order the biggest thing on the menu and blame the training.", "Salad's for people who haven't done a neck session today."], r: ["Ha. I like your thinking.", "Ha. True."] },
      { tone: 'firm', t: ["Lean protein, rice, vegetables. In season, that's it.", "Nothing fun till the winter."], r: ["Grim. Respect.", "Brutal."] },
      { tone: 'show', t: ["I know the best coffee in every paddock. Ask me anything.", "Leave the ordering to me. I'm very good at this."], r: ["Go on, then. Prove it.", "Okay. Impress me."] },
    ] },
  // ---- music -----------------------------------------------------------------------------------------------------------------
  { id: 'dMusic', who: ['driver'], w: 1.4, when: (x, n) => ok(x) && likes(n, 'music'), open: [
    "What's on your pre-race playlist? Don't say classical.", "Who's choosing the music tonight? Because it shouldn't be you.", "Heard you sing on the team radio once. Brave." ],
    opts: [
      { tone: 'light', t: ["Eighties power ballads. Every race. It's a lucky thing.", "Film soundtracks. I pretend I'm in a car chase."], r: ["Ha! Love that.", "Ha. You are in a car chase."], then: { say: ["Go on, one song. The one you'd never admit to.", "Worst song on the playlist. Go."], opts: [
        { tone: 'light', t: ["...A boy band. A big one. That's all you're getting.", "A song from a children's film. Every single race."], r: ["Ha! Respect.", "Ha. Which one? You have to say."] },
        { tone: 'kind', t: ["Something from the car rides to karting as a kid.", "Something that reminds me of home."], r: ["That's nice, actually.", "Yeah. That's a good reason."] },
        { tone: 'firm', t: ["Not telling. It's a secret weapon.", "Classified. Team secret."], r: ["Ha. Fair.", "Spoilsport."] } ] } },
      { tone: 'show', t: ["My playlist's the best in the paddock. People ask for it.", "My taste is impeccable. You're welcome."], r: ["Do they, though?", "Ha. We'll see."] },
      { tone: 'kind', t: ["Whatever calms me down. It changes every year.", "Something slow. My heart rate's high enough."], r: ["Sensible.", "Fair point."] },
      { tone: 'cold', t: ["I don't really do music before races.", "Silence. That's my playlist."], r: ["Oh. Fair enough.", "Very intense."] },
    ] },
  // ---- training -------------------------------------------------------------------------------------------------------------
  { id: 'dFitness', who: ['driver'], w: 1.2, when: (x) => ok(x), open: [
    "Still doing the neck work every morning? I've never had a neck this big.", "How many push-ups can you actually do? Honest number.", "My trainer's found a new torture device. It's a sort of tilting chair." ],
    opts: [
      { tone: 'firm', t: ["Every morning, half six. No excuses.", "Every day. Even on the road."], r: ["Proper.", "Discipline."], then: { say: ["How do you keep it up when you're travelling?", "What do you do in hotels?"], opts: [
        { tone: 'firm', t: ["Bands in the suitcase. Hotel stairs.", "Same routine everywhere. The body likes routine."], r: ["Smart.", "Makes sense."] },
        { tone: 'light', t: ["I pretend the hotel corridor's a straight and sprint it.", "Room service, then guilt, then press-ups."], r: ["Ha! Very professional.", "Ha. Honest."] },
        { tone: 'kind', t: ["Someone keeps me honest. My trainer messages at six.", "I train with whoever's around. It's more fun."], r: ["Good trainer.", "Nice."] } ] } },
      { tone: 'light', t: ["My neck's got its own postcode now.", "Shirts don't fit any more. It's a crisis."], r: ["Ha! Same.", "Ha. Tailored overalls it is."] },
      { tone: 'show', t: ["More than you. Want me to prove it right here?", "Fifty. Easy. Want to watch?"], r: ["Not on this floor, thanks.", "Maybe later."] },
      { tone: 'kind', t: ["Not as many as I should. The travel kills the routine.", "Honest number? Fewer than you think."], r: ["Same.", "Ha. Thanks for being honest."] },
    ] },
  // ---- travel ----------------------------------------------------------------------------------------------------------------
  { id: 'dTravel', who: ['driver'], w: 1.2, when: (x) => ok(x), open: [
    "Which time zone are you in right now? Because I genuinely don't know mine.", "Airport tip: what's yours? Mine is: never trust the moving walkway.", "Best place we go, would you say? Not the track. The place." ],
    opts: [
      { tone: 'kind', t: ["Somewhere with the sea and no schedule. Any of them.", "Anywhere the food's good and nobody's in a hurry."], r: ["Yeah. Those are rare.", "Agreed."], then: { say: ["Do you ever actually see the cities?", "Do you get time to look around?"], opts: [
        { tone: 'kind', t: ["One walk per city. That's my rule.", "I try. A morning, at least."], r: ["Good rule.", "I should do that."] },
        { tone: 'light', t: ["I've seen a lot of airports. Lovely airports.", "I've seen the inside of a lot of hotels."], r: ["Ha. Same.", "Ha. Glamorous."] },
        { tone: 'firm', t: ["Not really. Hotel, circuit, airport. It's the job.", "No. Maybe when I retire."], r: ["Yeah. Same.", "Fair."] } ] } },
      { tone: 'light', t: ["I'm in the time zone of whatever the hotel breakfast says.", "Moving walkways are for people who've given up."], r: ["Ha. Same.", "Ha! Exactly."] },
      { tone: 'firm', t: ["Body clock on race time from Monday. Every trip.", "Same routine everywhere. Sleep, eat, train."], r: ["Disciplined.", "Respect."] },
      { tone: 'show', t: ["Lounge access everywhere. It changes your life.", "I never get jet lag. Never."], r: ["Ha. Course you do.", "Liar."] },
    ] },
  // ---- nerves: the real stuff (a friend, or the quiet minute at the window) -----------------------------------------------------
  { id: 'dNerves', who: ['driver'], w: 2.5, when: (x, n) => ok(x) && (close(n) || !!x.moment), open: [
    "Can I ask you something? Do you still get nervous? Properly nervous?", "Does it ever get to you - the pressure? Not the racing. All of it.", "Honest question: what do you do the night before, when you can't sleep?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Every time. I just got better at hiding it.", "All the time. Anyone who says they don't is lying."], r: ["Good. I thought it was just me.", "Yeah. Glad you said it."], then: { say: ["What helps? Actually helps?", "How do you deal with it?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Talking about it. Like this. It's half the weight already.", "Remembering I'd rather be nervous here than calm anywhere else."], r: ["Yeah. It is, isn't it?", "...That's a good way to see it."] },
        { tone: 'firm', t: ["Routine. Same things, same order. The body knows what's coming.", "Breathing. Boring, but it works."], r: ["Makes sense.", "Boring works."] },
        { tone: 'light', t: ["I count the corners with my eyes shut. Asleep by the chicane, usually.", "I watch cooking programmes. Very soothing."], r: ["Ha. I'm trying that.", "Ha. I'll try it."] },
        { tone: 'cold', t: ["I just get on with it.", "Don't really think about it."], r: ["Right.", "Fair enough."] } ] } },
      { tone: 'firm', t: ["No. It's a car and a lap. I've done thousands.", "Not nervous. Ready."], r: ["...Really? Lucky you.", "Must be nice."] },
      { tone: 'light', t: ["I lie awake running lap one. I've won it four hundred times.", "I reorganise my sock drawer. Very calming."], r: ["Ha. Only four hundred?", "Ha. That's a lot of socks."] },
      { tone: 'cold', t: ["I don't really talk about that stuff.", "Not really my thing."], r: ["Yeah. Fair. Sorry.", "Okay. No worries."] },
    ] },
  // ---- team life --------------------------------------------------------------------------------------------------------------
  { id: 'dTeamLife', who: ['driver'], w: 1.3, when: (x) => ok(x), open: [
    "Are your engineers as obsessed with spreadsheets as ours?", "Who's the best person in your garage? Not the boss. The real one.", "Debriefs. How long do yours go on? Be honest." ],
    opts: [
      { tone: 'kind', t: ["Our number one mechanic. Knows everything, says nothing.", "The lady who runs our kitchen. The whole garage would follow her anywhere."], r: ["Every team's got one.", "Ha. Ours too."], then: { say: ["Do you ever feel like it all rests on you? All those people?", "All those people - does that get to you?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Every day. That's why I try to thank them all.", "Sometimes. Then I remember they chose this too."], r: ["Yeah. Same.", "Good way to see it."] },
        { tone: 'firm', t: ["It rests on all of us. That's what a team is.", "No. We win together, we lose together."], r: ["Right answer.", "Fair."] },
        { tone: 'light', t: ["It rests on whoever's on the wheel gun. I just turn up.", "It rests on the coffee machine."], r: ["Ha. True.", "Ha. Respect to the coffee machine."] } ] } },
      { tone: 'light', t: ["Ours have a spreadsheet for the spreadsheets.", "Three hours. I've learnt to sleep with my eyes open."], r: ["Ha! Of course they do.", "Ha. Skill."] },
      { tone: 'firm', t: ["Our engineers are the best in the pit lane. I'd race anyone with them.", "As long as it takes. That's where the time is."], r: ["Loyal.", "Proper."] },
      { tone: 'gossip', t: ["Ours had a row about tyre blankets last week. Lasted three days.", "Two of our engineers haven't agreed on anything since the summer."], r: ["Ha! Over blankets?", "Ha. Sounds like ours."] },
    ] },
  // ---- silly season (the gossip is about made-up people: a junior and an agent nobody has met) -----------------------------------
  { id: 'dSilly', who: ['driver'], w: 1.1, when: (x) => ok(x), open: [
    "Heard about that kid in the junior series - Elio Brandt? Three teams want him, apparently.", "There's an agent going round the paddock pitching the same teenager to everyone. Rafe Calloway. Met him yet?", "Silly season's started early. Somebody's cousin's friend says a midfield team's signing a junior nobody's heard of." ],
    opts: [
      { tone: 'gossip', t: ["I heard Brandt's already signed. With two teams. At once.", "Calloway pitched him to me. I'm not even a team."], r: ["Ha! Bold kid.", "Ha! That tracks."], then: { say: ["Where are you hearing all this?", "Who told you that?"], opts: [
        { tone: 'light', t: ["The coffee machine. It knows everything.", "The catering truck. Best source in the paddock."], r: ["Ha. True.", "Ha. Always is."] },
        { tone: 'gossip', t: ["A mechanic. They always know first.", "A hospitality runner. They hear everything."], r: ["Course they do.", "Ha. They do."] },
        { tone: 'sorry', t: ["Actually - forget I said it. Not fair on a kid who's just starting.", "Ignore me. It's probably rubbish."], r: ["Yeah. Fair. Poor kid.", "Probably."] } ] } },
      { tone: 'kind', t: ["Good luck to the kid. We were all him once.", "Hope it works out for him. It's a brutal ladder."], r: ["Yeah. True.", "It is."] },
      { tone: 'light', t: ["A junior nobody's heard of? Sounds like me, five years ago.", "If Calloway calls me, I'm pretending to be my own agent."], r: ["Ha! Fair.", "Ha. Brilliant."] },
      { tone: 'cold', t: ["I don't really listen to silly-season stuff.", "Not interested in rumours."], r: ["Fair. Most of it's nonsense.", "Fair enough."] },
    ] },
  // ---- the rivalry, kept on the track ---------------------------------------------------------------------------------------------
  { id: 'dRivalry', who: ['driver'], w: 1.3, when: (x, n) => ok(x) && !n.mate, open: [
    "That move last time. You know the one. Still thinking about it?", "I owe you one for the last race, by the way. On track, obviously.", "I'll say this once: you defend really annoyingly." ],
    opts: [
      { tone: 'kind', t: ["Hard but fair. That's the best kind of racing.", "Racing you's the fun bit, honestly.", "Fair play to {team} - that car's quick now. Racing you's the fun bit."], r: ["Yeah. It is.", "...Yeah. Same.", "...Cheers. Same."], then: { say: ["Same again next time, then?", "Next time, then?"], opts: [
        { tone: 'firm', t: ["Same again. A car's width, always.", "Same again. May the quicker one win."], r: ["Deal.", "Deal."] },
        { tone: 'light', t: ["Only if you leave the door open again.", "Same again. You'll still be behind."], r: ["Ha. Never.", "Ha. We'll see."] },
        { tone: 'kind', t: ["Always. Shake on it.", "Every time. Good racing."], r: ["Shaken.", "Good racing."] } ] } },
      { tone: 'light', t: ["I think about it most nights. Fondly.", "Annoyingly is my best way of defending."], r: ["Ha. Course you do.", "Ha. It works, unfortunately."] },
      { tone: 'show', t: ["You'll get used to the view of my gearbox.", "Annoying? That's called being good at it."], r: ["We'll see.", "Ha. We'll see."] },
      { tone: 'sorry', t: ["Yeah, I squeezed you a bit. Sorry about that.", "That one was tight. My fault."], r: ["Appreciated. Water under the bridge.", "Cheers. Respect."] },
    ] },
  // ---- pranks ---------------------------------------------------------------------------------------------------------------------
  { id: 'dPranks', who: ['driver'], w: 1, when: (x) => ok(x), open: [
    "Best prank you've ever pulled in a garage. Go.", "If you had to prank your engineer, what would you do? I need ideas.", "Has anyone ever got you properly? A real prank?" ],
    opts: [
      { tone: 'light', t: ["Swapped all the labels on the tyre blankets. Two hours of chaos.", "Filled the race engineer's office with balloons. Hundreds of them."], r: ["Ha! Evil.", "Ha. Brilliant."], then: { say: ["Revenge, though. Do they get you back?", "Did they ever get you back?"], opts: [
        { tone: 'light', t: ["Still waiting. It's been months. I'm scared.", "Jelly beans in my race boots. Every pair."], r: ["Ha. It's coming.", "Ha! Classic."] },
        { tone: 'kind', t: ["Never. They're too nice. I feel bad now.", "No. I bought them all breakfast instead."], r: ["Aw.", "That's the best revenge."] },
        { tone: 'show', t: ["Nobody gets me. I'm too careful.", "They wouldn't dare."], r: ["Famous last words.", "Ha. They're planning it now."] } ] } },
      { tone: 'kind', t: ["A birthday cake in the debrief room. Not really a prank. They loved it.", "I'm not a prankster. I'm the one who gets pranked."], r: ["That's lovely.", "Ha. Somebody has to be."] },
      { tone: 'show', t: ["I'd never get caught. That's the whole trick.", "My pranks are legendary. Nobody knows they were mine."], r: ["Very mysterious.", "Ha. Sure."] },
      { tone: 'firm', t: ["Not at the track. That's work.", "Leave the engineer alone. We need him calm."], r: ["Fair.", "Ha. Fair."] },
    ] },
  // ---- the winter ------------------------------------------------------------------------------------------------------------------
  { id: 'dWinter', who: ['driver'], w: 1, when: (x) => ok(x), open: [
    "What are you doing in the winter break? Please say something that isn't training.", "Do you ever properly switch off after the last race?", "Skiing in the off-season: yes, or absolutely not?" ],
    opts: [
      { tone: 'kind', t: ["Seeing everyone I've missed all year. That's the whole plan.", "Going home. Doing nothing. With people I like."], r: ["Best plan there is.", "Perfect."], then: { say: ["How long before you miss it? The racing?", "How long till you're itching to get back?"], opts: [
        { tone: 'light', t: ["About four days. Then I'm on the sim at midnight.", "A week. Then I'm unbearable."], r: ["Ha. Same.", "Ha. Sounds right."] },
        { tone: 'kind', t: ["Longer every year. I think that's healthy.", "A couple of weeks. Then I'm ready."], r: ["Probably is.", "Good."] },
        { tone: 'firm', t: ["I don't stop missing it. I just rest.", "The day after the last race."], r: ["Proper racer.", "Ha. Of course."] } ] } },
      { tone: 'light', t: ["Sleeping. December's for sleeping.", "Learning to cook one thing. Just one."], r: ["Ha. Fair.", "Ha. Ambitious."] },
      { tone: 'firm', t: ["Two weeks off, then straight back in the gym.", "Skiing? Absolutely not. Not mid-contract."], r: ["Brutal.", "Sensible. Your team would never allow it."] },
      { tone: 'show', t: ["Somewhere hot with no phone signal. I've earned it.", "Somewhere very expensive. I've earned it."], r: ["Ha. Fair enough.", "Ha. Listen to this."] },
    ] },
  // ---- favourite circuits ------------------------------------------------------------------------------------------------------
  { id: 'dCircuits', who: ['driver'], w: 1.1, when: (x) => ok(x), open: [
    "Favourite track on the calendar. Go. No diplomatic answers.", "If you could add one circuit to the calendar, anywhere, what would it be?", "Which corner do you love most? The one that makes you grin in the helmet." ],
    opts: [
      { tone: 'firm', t: ["Anywhere with fast corners and gravel. Proper old-school.", "The fast ones. Where you have to trust the car."], r: ["Proper answer.", "Same. Nothing like it."], then: { say: ["And the one you'd happily never see again?", "Which one would you quietly drop?"], opts: [
        { tone: 'light', t: ["Any street track with a hairpin you could park a bus in.", "Whichever one I crashed at last."], r: ["Ha. I know the one.", "Ha. Long list?"] },
        { tone: 'kind', t: ["None. We're lucky to race anywhere.", "None of them. Even the bad ones are special."], r: ["Diplomatic. But nice.", "Fair."] },
        { tone: 'firm', t: ["Not saying. They might hear me.", "I'll tell you when I've retired."], r: ["Ha. Wise.", "Ha. I'll hold you to that."] } ] } },
      { tone: 'kind', t: ["Wherever the crowd's loudest. That's the one.", "Anywhere the fans camp out all weekend. You feel it."], r: ["Yeah. That's the best bit.", "Agreed."] },
      { tone: 'light', t: ["Whichever one I win at next.", "A circuit round my local supermarket. I know every apex."], r: ["Ha. Classic.", "Ha! I'd race that."] },
      { tone: 'show', t: ["{track}. I'm quick there. Ask anyone.", "Any of them, as long as I'm on pole."], r: ["We'll see about that.", "Ha. Course."] },
    ] },
  // ---- karting days (in general terms) ---------------------------------------------------------------------------------------------
  { id: 'dKarting', who: ['driver'], w: 1, when: (x) => ok(x), open: [
    "Do you miss karting? Honestly?", "Karting weekends, though. Everyone in vans, everyone covered in grease. Simpler times.", "What's the bravest thing you did as a kid in a kart?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Every day. It was pure. Nobody cared about anything but the racing.", "Loads. That's where I fell in love with all this."], r: ["Yeah. Nothing quite like it.", "Same. It's still in there somewhere."], then: { say: ["Do you still go? In the winter?", "Ever go back to a kart track?"], opts: [
        { tone: 'light', t: ["When I can. The ten-year-olds are terrifying now.", "Sometimes. I lose to kids who can't see over the wheel."], r: ["Ha. They really are.", "Ha. Humbling."] },
        { tone: 'kind', t: ["Sometimes. It reminds me why I started.", "Every winter. It keeps me honest."], r: ["Good.", "Nice."] },
        { tone: 'firm', t: ["No. Too much to lose mid-contract.", "Not any more. Different job now."], r: ["Sensible.", "Fair."] } ] } },
      { tone: 'light', t: ["I once lapped my own dad. He's never got over it.", "Rain races in a kart. No grip, no fear, no sense."], r: ["Ha! Brutal.", "Ha. Best races there are."] },
      { tone: 'firm', t: ["Rain, every time. That's where you learn car control.", "Racing older kids and not backing down."], r: ["True.", "Proper."] },
      { tone: 'show', t: ["I won everything. Ask anyone at my old club.", "Bravest? Every lap. I was fearless."], r: ["Course you did.", "Ha. Sure."] },
    ] },
  // ---- media, fans, the noise ---------------------------------------------------------------------------------------------------------
  { id: 'dMedia', who: ['driver'], w: 1.1, when: (x) => ok(x), open: [
    "How many interviews did you do last weekend? I lost count at nine.", "Do you read the comments? I read the comments. Big mistake.", "What's the weirdest thing a fan's ever asked you to sign?" ],
    opts: [
      { tone: 'light', t: ["A forehead. With a permanent marker. I still think about it.", "A banana. I signed the banana."], r: ["Ha! Forehead!", "Ha. Did they eat it?"], then: { say: ["Does any of it get to you? The noise online?", "Do you ever let it get to you?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Some days. Then I remember they don't actually know me.", "Sometimes. Usually when I'm tired."], r: ["Good way to see it.", "Yeah. Same."] },
        { tone: 'firm', t: ["No. The stopwatch is the only opinion that counts.", "No. I don't read it."], r: ["Strong.", "Wise."] },
        { tone: 'light', t: ["My mum replies to all of them for me. Furiously.", "I've got a friend who reads them and only tells me the nice ones."], r: ["Ha! Mums.", "Ha. Good system."] } ] } },
      { tone: 'kind', t: ["A kid's school book. Best autograph I've ever done.", "The fans are the best bit. Even the odd ones."], r: ["That's lovely.", "Yeah. They are."] },
      { tone: 'firm', t: ["I don't read anything. Rule one.", "Interviews are part of the job. I do them and go home."], r: ["Wise.", "Fair."] },
      { tone: 'show', t: ["My comments are mostly people telling me I'm brilliant.", "Nine? I did fourteen. They love me."], r: ["Mostly.", "Ha. Sure."] },
    ] },
  // ---- somewhere quiet (their taste, or a quiet place) ----------------------------------------------------------------------------------
  { id: 'dQuiet', who: ['driver'], w: 1.6, when: (x, n) => ok(x) && (likes(n, 'quiet') || (x.privacy || 0) >= 0.8), open: [
    "This is nice. Nobody filming, nobody asking for a photo.", "I like this. Quiet. I forget what quiet sounds like.", "Do you ever get tired of being looked at? Just a bit?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["All the time. That's why I wanted somewhere small.", "Yeah. Sometimes I just want to be a person."], r: ["Same. Thanks for this.", "Yeah. Exactly that."], then: { say: ["Do you think you'll miss it when it's over? All the attention?", "Will you miss it, one day? Being someone everyone knows?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["The racing, yes. The rest - I don't think so.", "I'll miss the people. Not the cameras."], r: ["Yeah. Same.", "Good answer."] },
        { tone: 'light', t: ["I'll hire someone to follow me round with a camera.", "I'll start a podcast. Nobody will listen."], r: ["Ha! Please don't.", "Ha. I'd listen."] },
        { tone: 'firm', t: ["Not thinking about the end. Not yet.", "Ask me in ten years."], r: ["Fair.", "Deal."] } ] } },
      { tone: 'light', t: ["I've had this cap on all night and nobody's recognised me. Victory.", "Quiet's my favourite sound. Apart from an engine."], r: ["Ha. Master of disguise.", "Ha. Fair."] },
      { tone: 'firm', t: ["It comes with the job. But yeah. This helps.", "It's part of it. You learn to switch off."], r: ["Yeah.", "Wish I could."] },
      { tone: 'show', t: ["I don't mind it. Someone's got to be interesting.", "I like being looked at. Is that bad?"], r: ["Ha. Course you don't.", "Honest, at least."] },
    ] },
  // ---- a view (their taste, or the quiet minute outside) ----------------------------------------------------------------------------------
  { id: 'dViews', who: ['driver'], w: 1.6, when: (x, n) => ok(x) && (likes(n, 'views') || !!x.moment) && x.venue !== 'karting', open: [
    "Come and look at this. Seriously. Thirty seconds.", "Do you ever just stop and look at where this job takes us?", "I could stand here all night. Don't tell anyone I said that." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Not often enough. Thanks for making me.", "Hardly ever. We should, though."], r: ["Yeah. Me neither.", "We should."], then: { say: ["Where's the best view you've ever had? Anywhere.", "Best view you've ever had?"], opts: [
        { tone: 'kind', t: ["From a podium. All those faces.", "From the grid, before the start. All those people."], r: ["Yeah. That's the one.", "Yeah. Gives me goosebumps."] },
        { tone: 'light', t: ["From the passenger seat of a road car at a test day. Very scenic. Very slow.", "My hotel window last month. A car park. Stunning."], r: ["Ha. Very glamorous.", "Ha. Gorgeous."] },
        { tone: 'firm', t: ["From the cockpit, over the crest of a fast corner. Half a second of sky.", "From the car, every lap. Nothing else comes close."], r: ["Proper.", "Yeah. Nothing does."] } ] } },
      { tone: 'light', t: ["It's lovely. Shame we can't race on it.", "Very nice. Where's the braking point?"], r: ["Ha. You would.", "Ha. Typical."] },
      { tone: 'firm', t: ["I'd rather be looking at a data trace. ...No, I wouldn't.", "Thirty seconds. I'm timing it."], r: ["Ha. Liar.", "Ha. Go on, then."] },
      { tone: 'cold', t: ["It's a view.", "Seen one, seen them all."], r: ["...Okay, then.", "Wow. Romantic."] },
    ] },
  // ---- competition: a bet on anything (their taste) --------------------------------------------------------------------------------------
  { id: 'dBet', who: ['driver'], w: 1.6, when: (x, n) => ok(x) && likes(n, 'competition'), open: [
    "Fancy a bet on something? Anything. I get bored when I'm not competing.", "I can't relax unless there's a scoreboard. Is that a problem?", "Loser buys the coffees tomorrow. On what? Doesn't matter. Pick something." ],
    opts: [
      { tone: 'show', t: ["Name the game. I'll win it.", "Pick anything in this room. I'll beat you at it."], r: ["Big words.", "Ooh. Okay."], then: { say: ["And if I win, you tell the whole grid on race day.", "If I win, I get bragging rights. In public."], opts: [
        { tone: 'light', t: ["Deal. I'll take out an advert.", "Deal. I'll do it over the radio."], r: ["Ha. Perfect.", "Ha! Do it."] },
        { tone: 'firm', t: ["Deal. You won't win.", "Fine. You won't need them."], r: ["We'll see.", "Ha. We'll see."] },
        { tone: 'kind', t: ["Deal. Gladly. You'd deserve it.", "If you win, I'll tell them myself."], r: ["Respect.", "Good sport."] } ] } },
      { tone: 'light', t: ["Bet you can't go five minutes without mentioning lap times.", "Bet I can eat more chips than you. Silently."], r: ["...Okay, that's hard.", "Ha. You're on."] },
      { tone: 'kind', t: ["Coffees are on me anyway. Let's just play.", "No bet. Just play for fun. Remember fun?"], r: ["Fun. What's fun?", "Ha. Vaguely."] },
      { tone: 'firm', t: ["Whatever's here. First to three wins.", "Best of three. No excuses."], r: ["Deal.", "You're on."] },
    ] },
  // ---- your team-mate, off duty ------------------------------------------------------------------------------------------------------------
  { id: 'dMate', who: ['driver'], w: 4, when: (x, n) => ok(x) && !!n.mate, open: [
    "Funny seeing you somewhere without the boss watching.", "Right, team-mate. No data, no debrief. Promise?", "I reckon the garage is happier when we get on. Do you?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Much happier. I think we're a better team when we're like this.", "I think so too. And I think we're quicker for it."], r: ["Yeah. Me too.", "...Yeah. I reckon we are."], then: { say: ["Both cars home next time. Deal?", "Next race: both cars home, both in the points?"], opts: [
        { tone: 'kind', t: ["Deal. Both cars, both in the points.", "Deal. For the garage."], r: ["Shake on it.", "For the garage."] },
        { tone: 'firm', t: ["Deal. And may the quicker one win.", "Deal. But I'm still racing you."], r: ["Wouldn't want anything else.", "Good."] },
        { tone: 'light', t: ["Deal. You first. Just this once.", "Deal. I'll even wave as I go past."], r: ["Ha. I'll hold you to that.", "Ha. Cheeky."] } ] } },
      { tone: 'light', t: ["Promise. ...But your braking into the hairpin, though.", "No data. Except one tiny bit. About your throttle trace."], r: ["Two minutes! You lasted two minutes.", "Ha. Unbelievable."] },
      { tone: 'firm', t: ["We race each other hard and we're fine. That's the deal.", "On track we're rivals. Here, we're not."], r: ["Fair.", "Good."] },
      { tone: 'show', t: ["The garage is happiest when I'm in front. Sorry.", "They're happy. I'm quicker. Everyone wins."], r: ["Ha. We'll see about that.", "Steady."] },
    ] },
  // ---- clearing the air with someone you have clashed with ----------------------------------------------------------------------------------
  { id: 'dClearAir', who: ['driver'], w: 5, when: (x, n) => ok(x) && (n.rapport || 0) <= -15, open: [
    "Honestly, I wasn't sure about coming tonight. After everything.", "Look - I know we haven't exactly got on, on track.", "So we're doing this. Same table. Okay." ],
    opts: [
      { tone: 'sorry', fx: 'deep', t: ["I'm sorry about how things have been. I'd like to clear the air.", "Some of that was on me. I wanted to say so properly."], r: ["...Yeah. Me too, actually.", "...Okay. That means something."], then: { say: ["So where did it go wrong, you reckon?", "What happened? Between us, I mean."], opts: [
        { tone: 'kind', t: ["Too much pride on both sides. Mostly mine.", "We're both too competitive. That's all it ever was."], r: ["...Mostly yours. I'll take that.", "Yeah. That's fair."] },
        { tone: 'firm', t: ["On track. That's where it should have stayed.", "Racing. It's just racing. It got personal and it shouldn't have."], r: ["Agreed.", "Yeah. It shouldn't."] },
        { tone: 'light', t: ["Somewhere around Turn 1. Every race.", "The day they put us next to each other on the grid."], r: ["Ha. Every time.", "Ha. Fair."] } ] } },
      { tone: 'firm', t: ["We race hard. Doesn't mean we can't share a table.", "We're rivals. We can still eat together."], r: ["...Fair.", "Yeah. Okay."] },
      { tone: 'light', t: ["Neutral ground. No stewards. Just snacks.", "If it helps, I've told the waiter not to let us near the cutlery."], r: ["Ha. Okay. Snacks I can do.", "Ha. Wise."] },
      { tone: 'cold', t: ["I'm here, aren't I?", "Let's just get through it."], r: ["Barely.", "...Right."] },
    ] },
  // ---- best mates ---------------------------------------------------------------------------------------------------------------------------
  { id: 'dBest', who: ['driver'], w: 3, when: (x, n) => ok(x) && at(n, 'mate', 'best'), open: [
    "You know what? This is the best bit of my week.", "Remember when we barely said hello? Look at us now.", "Honestly, it helps knowing there's someone on the grid I can talk to." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Same. I don't say it enough - I'm glad we're mates.", "It helps me too. More than you know."], r: ["...Yeah. Me too. Don't make it weird.", "Good. Then we're even."], then: { say: ["Promise me something: whatever happens on track, this stays.", "Whatever happens out there, we're still good. Yeah?"], opts: [
        { tone: 'kind', t: ["Promise. Whatever happens.", "Always. Even if we end up fighting for a title."], r: ["Good.", "Ha. That'd be the dream."] },
        { tone: 'firm', t: ["On track I'll race you like anyone. Off it, always.", "Racing is racing. This is this."], r: ["Exactly that.", "Good."] },
        { tone: 'light', t: ["Promise. Unless you beat me at darts again.", "Only if you keep paying for the coffees."], r: ["Ha. No promises there.", "Ha. Deal."] } ] } },
      { tone: 'light', t: ["You still owe me for the last time we played pool.", "Look at us. Practically a sitcom."], r: ["Ha. I'll pay you in coffee.", "Ha. A good one, though."] },
      { tone: 'firm', t: ["Whatever happens on track, this stays. Right?", "We look out for each other. That's the deal."], r: ["Right.", "Always."] },
      { tone: 'show', t: ["You're lucky to have me. I'm a great mate.", "I'm a brilliant friend. Ask anyone."], r: ["Ha. And modest.", "I'm asking. They said 'okay'."] },
    ] },
  // ---- advice, driver to driver -------------------------------------------------------------------------------------------------------------
  { id: 'dAdvice', who: ['driver'], w: 1, when: (x) => ok(x), open: [
    "Can I ask your opinion on something? Racing stuff.", "How do you handle it when you and your engineer disagree?", "What's the one thing you'd tell a driver in their first season?" ],
    opts: [
      { tone: 'kind', t: ["Listen first. Argue after the data.", "Ask questions. Everyone here wants to help, mostly."], r: ["Good rule.", "Mostly. Ha."], then: { say: ["And if they're right and you're wrong?", "What if you're the one who's wrong?"], opts: [
        { tone: 'kind', t: ["Then I say so. Out loud. On the radio if I have to.", "Then I say thank you and buy the coffees."], r: ["Respect.", "Ha. Fair."] },
        { tone: 'light', t: ["Then I pretend it was my idea all along.", "That's never happened. Ask my engineer. Actually, don't."], r: ["Ha. Classic.", "Ha!"] },
        { tone: 'firm', t: ["Then we're both right. That's a team.", "Then I learn. That's the job."], r: ["Good answer.", "Yeah."] } ] } },
      { tone: 'firm', t: ["Change one thing at a time. Always.", "Trust the process. Don't chase a feeling."], r: ["Wise.", "Makes sense."] },
      { tone: 'light', t: ["Bribe them. Pastries work.", "Find the good coffee machine on day one. That's it."], r: ["Ha. Noted.", "Ha. Valuable."] },
      { tone: 'show', t: ["I usually just do it my way. It works.", "Be as quick as me. Simple."], r: ["Does it, though?", "Ha. Thanks."] },
    ] },
  // ---- your love life, from a friend (when you are keeping something quiet) ---------------------------------------------------------------------
  { id: 'dWingman', who: ['driver'], w: 4, when: (x) => ok(x) && (!!x.secret || !!x.buzz || (x.seeing || 0) >= 2), open: [
    "So. Who's the mystery person you keep texting under the table?", "Your phone's been buzzing all night. Popular, are we?", "The paddock's whispering about you and somebody. I'm not asking. ...I'm asking." ],
    opts: [
      { tone: 'firm', fx: 'cover', t: ["Just my engineer. Tyre data.", "The family group chat. It never stops."], r: ["Tyre data. At this time of night. Sure.", "Course it is."] },
      { tone: 'kind', fx: 'deep', t: ["It's... complicated. Keep it between us?", "Can I trust you with something? Properly?"], r: ["Course. Vault.", "Always. Go on."], then: { say: ["Is it serious? Are you alright?", "Do you know what you're doing? Honestly?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["I don't know yet. That's the problem.", "No. Not really. I'm working it out."], r: ["Sort it before the papers do.", "Be careful. People get hurt by this stuff."] },
        { tone: 'sorry', t: ["I'm making a mess of it, aren't I?", "Probably not. I've got myself in a tangle."], r: ["A bit. You'll sort it. Be straight with people.", "Yeah. Honesty, mate. It's quicker in the end."] },
        { tone: 'light', t: ["Ask me next week. Or next year.", "I'll tell you when I've worked it out myself."], r: ["Ha. Fair.", "Ha. Good luck."] },
        { tone: 'firm', t: ["It's handled. Honestly.", "I know what I'm doing."], r: ["If you say so.", "Hm. Okay."] } ] } },
      { tone: 'light', t: ["Very popular. It's my mum. She's got thoughts about my qualifying.", "My fan club. All three of them."], r: ["Ha. Course it is.", "Ha. Sure."] },
      { tone: 'cold', t: ["Not your business, mate.", "Leave it."], r: ["Fair enough. Touchy, though.", "Alright, alright."] },
    ] },
  // ---- the end of the evening ---------------------------------------------------------------------------------------------------------------
  { id: 'dLate', who: ['driver'], w: 6, when: (x) => ok(x) && !!x.late, open: [
    "Right, I'd better go. Early start. This was good, though.", "Is it that time already? Really good night, this.", "My phone says it's late. My phone's a killjoy.", "I'm coming back to {venue}, you know. Best night I've had in weeks." ],
    opts: [
      { tone: 'kind', fx: 'invite', t: ["We should do this again. Properly. Soon.", "Same again soon? I mean it."], r: ["Yeah. I'd like that.", "Definitely."], then: { say: ["Your choice next time, then.", "Where next time?"], opts: [
        { tone: 'kind', fx: 'invite', t: ["Karting. You and me. Loser buys breakfast.", "Somewhere with a pool table. I want a rematch."], r: ["You're on.", "Deal."] },
        { tone: 'light', t: ["Somewhere with a darts board. I want revenge.", "Somewhere with a sofa. I'm exhausted."], r: ["Ha. Fair.", "Ha. Agreed."] },
        { tone: 'firm', t: ["I'll send you a list. A short one.", "After the next race. Whoever finishes ahead picks."], r: ["Ha. Good.", "Ooh. Deal."] } ] } },
      { tone: 'light', fx: 'invite', t: ["Same time next week? Loser picks the place.", "Next week. I'm bringing a rematch."], r: ["Ha. Deal.", "Bring it."] },
      { tone: 'firm', t: ["Go on. Sleep. See you on the grid.", "Get some rest. See you at the track."], r: ["See you there.", "Yeah. See you there."] },
      { tone: 'show', fx: 'invite', t: ["Next time I'm choosing. Somewhere much nicer.", "Next time I'll take you somewhere properly fancy."], r: ["Ooh. Listen to this.", "Ha. Can't wait."] },
    ] },
  // ---- penalty points, as a friend sees them -----------------------------------------------------------------------------------------------------
  { id: 'dPoints', who: ['driver'], w: 2, when: (x) => ok(x) && (x.points || 0) >= 8, open: [
    "How many penalty points are you on now? Sorry. Nosy.", "You're one bad lap from a weekend on the sofa, aren't you?", "Careful at the next one. The stewards are watching you like hawks." ],
    opts: [
      { tone: 'firm', t: ["I know. Clean and patient from now on.", "I know exactly where I am. No silly moves."], r: ["Good.", "Sensible."], then: { say: ["Want a tip? Leave a car's width even when you don't have to.", "Tip: if it's fifty-fifty, let it go. You'll get it back."], opts: [
        { tone: 'kind', t: ["Thanks. I mean that.", "Good advice. Thank you."], r: ["Any time.", "Any time."] },
        { tone: 'firm', t: ["That's the plan.", "Already on it."], r: ["Good.", "Good."] },
        { tone: 'light', t: ["A car's width. And a bit. Like a bus.", "I'll give everyone so much room they'll get lonely."], r: ["Ha. Do that.", "Ha. Perfect."] } ] } },
      { tone: 'light', t: ["I'm collecting them. Twelve and you get a free weekend off.", "The stewards send me a card at Christmas."], r: ["Ha. Not funny. A bit funny.", "Ha. I bet they do."] },
      { tone: 'kind', t: ["Thanks for not making a joke of it. Most people do.", "It's on my mind. Thanks for asking."], r: ["Course.", "You'll be fine. Just be patient."] },
      { tone: 'cold', t: ["Not talking about my licence tonight.", "Let's leave that at the track."], r: ["Fair enough.", "Yeah. Fair."] },
    ] },
  // ---- a story in the papers --------------------------------------------------------------------------------------------------------------------
  { id: 'dCrisis', who: ['driver'], w: 2.5, when: (x) => ok(x) && !!x.crisis && x.crisis !== 'moment', open: [
    "Saw the papers this week. You alright?", "Ignore the headlines. Everyone does, eventually.", "If you need someone to say something decent about you to the press, just ask." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["It's been a lot. Thanks for asking. Really.", "Not great, honestly. Thanks for saying something."], r: ["Course. That's what mates are for.", "Course."], then: { say: ["For what it's worth, nobody in the paddock believes half of it.", "It'll be fish-and-chip paper by next week."], opts: [
        { tone: 'kind', t: ["That means more than you know.", "Thanks. Genuinely."], r: ["Any time.", "Any time."] },
        { tone: 'light', t: ["Only half? Which half?", "Fish and chips. That's all it's good for."], r: ["Ha. The bad half.", "Ha. Exactly."] },
        { tone: 'firm', t: ["Good. Neither do I.", "I'll let the driving answer it."], r: ["That's the way.", "Good."] } ] } },
      { tone: 'firm', t: ["It'll blow over. It always does.", "Next week it'll be someone else."], r: ["It will.", "True."] },
      { tone: 'light', t: ["I'm framing the worst headline. For the loo.", "My mum's written to the editor. Twice."], r: ["Ha. Good.", "Ha! Mums."] },
      { tone: 'cold', t: ["I'd rather not, tonight.", "Can we talk about anything else?"], r: ["Course.", "Course. Anything."] },
    ] },

  // =====================================================================================================================
  // a grave week: a quiet coffee with a friend (no jokes, no banter - and nothing here is ever a story)
  // =====================================================================================================================
  { id: 'gvCoffee', who: ['driver', 'group'], w: 6, quiet: true, when: (x) => !!x.grave, open: [
    "I didn't really want to be on my own this week. Thanks for the coffee.", "It doesn't feel right to do anything this week. This is about all I can manage.", "Everyone's so quiet. I keep thinking about the family." ],
    opts: [
      { tone: 'kind', t: ["Me neither. I'm glad you came.", "It's enough. Just sitting here is enough."], r: ["Yeah. It is.", "...Yeah."], then: { say: ["How are you, really? Not the media answer.", "Are you sleeping?"], opts: [
        { tone: 'kind', t: ["Some nights are better than others. Talking helps.", "Not much. But I'm alright. I think."], r: ["Yeah. It does.", "Be kind to yourself."] },
        { tone: 'firm', t: ["I'll be okay. We look after each other.", "Getting through it. One day at a time."], r: ["We do.", "That's all any of us can do."] },
        { tone: 'kind', fx: 'deep', t: ["Can we talk about something normal for a minute? Is that alright?", "Honestly? I don't know. It's good to say that to someone."], r: ["Please. Yes. Anything.", "...Thank you for saying it."] },
        { tone: 'cold', t: ["Can we just sit for a bit?", "I don't really want to talk about me."], r: ["Course we can.", "That's alright."], m: 0 } ] } },
      { tone: 'firm', t: ["We'll race for them. That's what we can do.", "We get back in the car. Carefully. Together."], r: ["Yeah. We will.", "Yeah."] },
      { tone: 'kind', fx: 'deep', t: ["I keep thinking about them too. All of them.", "I think about the family every day this week."], r: ["...Yeah. Me too.", "Me too."] },
      { tone: 'cold', t: ["I don't really want to talk. Is that okay?", "I just needed to be out of the house."], r: ["Course. We'll just drink the coffee.", "That's alright. Me too."], m: 0 },
    ] },
  { id: 'gvTalk', who: ['driver', 'group'], w: 5, quiet: true, when: (x) => !!x.grave, open: [
    "Do you want to talk about it? We don't have to.", "I keep thinking about how quickly everything can change.", "The whole paddock feels it. You can see it in everyone's faces." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I think I need to. If that's alright.", "A bit. Then maybe not."], r: ["Course it is. Take your time.", "Whatever you need."], then: { say: ["What's the hardest part, for you?", "What's been hardest?"], opts: [
        { tone: 'kind', t: ["Thinking about the people at home.", "Knowing what the family must be going through."], r: ["Yeah. Me too.", "Yeah."] },
        { tone: 'firm', t: ["Getting back in the car. Knowing I will.", "Not knowing what to say to anyone."], r: ["We all feel that.", "Nobody does. Being there is enough."] },
        { tone: 'kind', t: ["Remembering that everyone in this sport knows the risk, and does it anyway.", "Seeing how much everyone cares. It's hard and it helps."], r: ["Yeah. It's why we look after each other.", "It does help."] },
        { tone: 'cold', t: ["I don't know yet.", "I can't really put it into words."], r: ["That's alright.", "You don't have to."], m: 0 } ] } },
      { tone: 'firm', t: ["Not yet. But thank you for asking.", "Maybe another time. Thank you."], r: ["Whenever you're ready.", "Any time."] },
      { tone: 'kind', t: ["We look after each other. That's what this is.", "I'm glad we're not on our own with it."], r: ["Yeah. It is.", "Me too."] },
      { tone: 'cold', t: ["Not tonight.", "I'd rather not."], r: ["That's alright.", "Okay."], m: 0 },
    ] },
  { id: 'gvCare', who: ['driver', 'group'], w: 4, quiet: true, when: (x) => !!x.grave, open: [
    "Look after yourself this week. I mean it.", "The team's got people you can talk to, you know. That's what they're there for.", "Have you eaten today? Properly?" ],
    opts: [
      { tone: 'kind', t: ["I will. And the same goes for you.", "Thank you. You too. Please."], r: ["Deal.", "I will."], then: { say: ["Call me if it gets bad. Any time. I mean any time.", "If you need someone at three in the morning, ring me."], opts: [
        { tone: 'kind', t: ["Thank you. Same for you.", "I will. Thank you."], r: ["Good.", "Good."] },
        { tone: 'firm', t: ["I will. I promise.", "I'll ring. I won't pretend I'm fine."], r: ["Good.", "Good. Don't."] },
        { tone: 'kind', fx: 'deep', t: ["I didn't expect this tonight. Thank you.", "It helps more than you know, hearing that."], r: ["That's what we're here for.", "Any time."] } ] } },
      { tone: 'firm', t: ["I've spoken to them already. It helped.", "I will. Talking to someone is part of looking after yourself."], r: ["Good. Really good.", "It is."] },
      { tone: 'kind', fx: 'deep', t: ["Not properly, no. Thanks for noticing.", "Not really. Shall we order something?"], r: ["Let's order something.", "Yeah. Let's eat."] },
      { tone: 'cold', t: ["I'm fine.", "Don't worry about me."], r: ["Okay. The offer stands.", "I'll worry a bit. That's allowed."], m: 0 },
    ] },

  // =====================================================================================================================
  // the places
  // =====================================================================================================================
  // ---- the pub: darts --------------------------------------------------------------------------------------------------------------
  { id: 'vPubDarts', who: ['driver', 'group'], where: ['pub'], w: 3, when: (x) => ok(x), open: [
    "Right. Darts. I've been told I'm terrible. I've been told wrong.", "Coffee money says I hit the bull before you do.", "These darts look like they've been here since the seventies. Perfect." ],
    opts: [
      { tone: 'show', t: ["I don't miss. Ever. Ask the dartboard.", "I was born on the oche. Stand back."], r: ["Ooh. We'll see.", "Ha. Big talk."], then: { say: ["Proper rules or pub rules?", "What are we playing? Proper darts?"], opts: [
        { tone: 'firm', t: ["Proper. Double to finish. No mercy.", "Three hundred and one, double out."], r: ["Ooh. Serious.", "Okay. Game on."] },
        { tone: 'light', t: ["Pub rules. Whatever the dog by the fire says.", "Closest to the middle wins. Simple."], r: ["Ha. The dog's very fair.", "Ha. My kind of darts."] },
        { tone: 'kind', t: ["Your rules. I'll lose either way.", "You pick. You're the guest."], r: ["Ha. Gracious.", "Okay. Prepare to lose."] } ] } },
      { tone: 'light', t: ["I'll aim for the board. That's the whole strategy.", "Stand well back. Like, behind the bar."], r: ["Ha. Ambitious.", "Ha. That bad?"] },
      { tone: 'kind', t: ["Go on, you throw first. I'll watch and learn.", "Show me how it's done."], r: ["Wise. Watch closely.", "Gladly."] },
      { tone: 'cruel', t: ["Bet you throw like you brake. Late, and all over the place.", "I've seen your racing lines. I'm standing well clear of the board."], r: ["Wow. Okay. Game on, then.", "Rude. Accurate, maybe. Rude."], m: -2 },
    ] },
  // ---- the pub: rain on the windows, a fire, proper food ----------------------------------------------------------------------------
  { id: 'vPubFire', who: ['driver', 'celeb', 'group'], where: ['pub'], w: 2.5, when: (x, n) => calm(x, n), open: [
    "Listen to that rain. Perfect night to sit by a fire.", "I love a proper pub. Wood, fire, terrible carpet.", "They do a Sunday roast here, apparently. On a weeknight. I'm in." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["This is exactly what I needed. Thanks for coming.", "Two hot chocolates by the fire? We're living dangerously."], r: ["Yeah. Me too.", "Ha. Wild. Yes, please."], then: { say: ["Do you get rain like this where you grew up?", "Is this what home feels like for you? Rain and a fire?"], opts: [
        { tone: 'kind', t: ["All year. This feels like home.", "Pretty much. Rain on the window, people you like."], r: ["That's nice.", "Lovely."] },
        { tone: 'light', t: ["Sideways rain. This is a light drizzle.", "This? This is a nice day where I'm from."], r: ["Ha. Brutal.", "Ha! Tough crowd."] },
        { tone: 'firm', t: ["Rain is rain. You race in it.", "Rain's my favourite. In a car, anyway."], r: ["Proper racer.", "Ha. Course it is."] } ] } },
      { tone: 'light', t: ["The carpet's my favourite bit. It's seen things.", "The carpet's older than both of us. Respect the carpet."], r: ["Ha. It really has.", "Ha. Respect the carpet."] },
      { tone: 'firm', t: ["Rain like this, I'd want intermediates through Copse.", "Rain like this tomorrow and the race is a lottery."], r: ["Ha. Always on.", "True."] },
      { tone: 'show', t: ["I found this place. You're welcome.", "Best pub in the county. I've checked."], r: ["Ha. Fine. Good find.", "You've checked all of them?"] },
    ] },
  // ---- the pub: the quiz -----------------------------------------------------------------------------------------------------------------
  { id: 'vPubQuiz', who: ['driver', 'group'], where: ['pub'], w: 2, when: (x) => ok(x), open: [
    "There's a quiz on tonight. Shall we? We'd be unbeatable on the sport round.", "Quiz team name. Go. It has to be terrible.", "If there's a question about one of us in the sport round, do we answer honestly?" ],
    opts: [
      { tone: 'light', t: ["Team name: 'Track Limits Exceeded'.", "Team name: 'Box Box Box'."], r: ["Ha! Perfect.", "Ha. Brilliant."], then: { say: ["Geography round. Capital of Australia?", "Quick - capital of Australia?"], opts: [
        { tone: 'firm', t: ["Canberra. Everyone says Sydney.", "Canberra. Final answer."], r: ["Correct. Annoyingly.", "Canberra. Nice."] },
        { tone: 'light', t: ["Melbourne. ...It's not Melbourne, is it?", "Sydney. Obviously. ...Why are you making that face?"], r: ["It's not. It's Canberra.", "It's Canberra."] },
        { tone: 'kind', t: ["No idea. You answer, I'll nod confidently.", "Your call. I trust you."], r: ["Canberra. Nod.", "Canberra. Good nodding."] } ] } },
      { tone: 'show', t: ["Sport round's ours. Everything else, I'll guess with total confidence.", "We'll win. I'm a genius at quizzes."], r: ["Total confidence is half of it.", "We'll see."] },
      { tone: 'kind', t: ["Count me in. I'm useless at geography, though.", "Yes. Let's lose gloriously."], r: ["Perfect. So am I.", "Ha. Gloriously."] },
      { tone: 'firm', t: ["Only if we're playing to win.", "Only if nobody looks things up on their phone."], r: ["Always.", "Fair."] },
    ] },
  // ---- the rooftop: the Strip below -------------------------------------------------------------------------------------------------------
  { id: 'vRoofStrip', who: ['driver', 'group'], where: ['rooftop'], w: 2.5, when: (x) => ok(x), open: [
    "You can see the circuit from up here. Look - that's the straight.", "The Strip at night. I still can't get over it.", "All those lights. It's like being inside a pinball machine." ],
    opts: [
      { tone: 'kind', t: ["It's something else, isn't it? Never gets old.", "Mad place. I love it, though."], r: ["Never.", "Yeah. Me too."], then: { say: ["Do you reckon anyone down there knows we're up here?", "Funny to think we'll be racing down there."], opts: [
        { tone: 'light', t: ["Wave. See what happens.", "One of them's definitely my engineer, checking I'm in bed."], r: ["Ha. Nothing.", "Ha. Hide."] },
        { tone: 'kind', t: ["Doesn't matter. Nice to be just another person for one night.", "Nice, isn't it? Being nobody for an evening."], r: ["Yeah. It is.", "Yeah."] },
        { tone: 'firm', t: ["They will on race night.", "Down there, at three hundred an hour. Can't wait."], r: ["Ha. True.", "Same."] } ] } },
      { tone: 'light', t: ["Somewhere down there is my braking point. I'm waving at it.", "A pinball machine where we're the balls."], r: ["Ha. Say hello.", "Ha. Accurate."] },
      { tone: 'firm', t: ["That's where I'll pass you on race night. Just there.", "I can see three overtaking spots from here."], r: ["Ha. In your dreams.", "Show me. I'll defend them."] },
      { tone: 'show', t: ["I'll be the fastest light down there on race night.", "I've got the best lap of anyone down there. Just saying."], r: ["Ha. We'll see.", "Ha. Sure."] },
    ] },
  // ---- the rooftop: the Sphere --------------------------------------------------------------------------------------------------------------
  { id: 'vRoofSphere', who: ['driver', 'celeb', 'group'], where: ['rooftop'], w: 2, when: (x, n) => calm(x, n), open: [
    "Is the Sphere changing colour, or is that just me?", "That giant glowing ball. Every time I look up it's a different planet.", "I've lost a whole minute staring at the Sphere. Don't tell anyone." ],
    opts: [
      { tone: 'kind', t: ["It's beautiful, though. Mad, but beautiful.", "I could watch it all night."], r: ["It is.", "Same."], then: { say: ["What would you put on it, if you could?", "If you got to choose what's on it - what?"], opts: [
        { tone: 'kind', t: ["A thank-you to every marshal and mechanic in the paddock.", "Something for the fans who sleep outside the circuit."], r: ["...That's lovely, actually.", "Nice."] },
        { tone: 'light', t: ["My lap time. Massive. All week.", "A giant photo of my engineer looking stressed."], r: ["Ha! Of course.", "Ha. Iconic."] },
        { tone: 'firm', t: ["The start lights. Make everyone nervous.", "A countdown to race night."], r: ["Ha. Evil.", "Ha. Tense."] } ] } },
      { tone: 'light', t: ["Now it's an eyeball. I feel watched.", "It's an emoji now. A winking one. Rude."], r: ["Ha. It's watching you.", "Ha. Cheeky ball."] },
      { tone: 'firm', t: ["As far as I'm concerned it's a braking marker.", "It's a reference point. That's all I see."], r: ["Ha. Course it is.", "Ha. Typical driver."] },
      { tone: 'show', t: ["I've seen it at full speed from the car. That's the best view.", "Best view of it is mine. From the cockpit."], r: ["Ha. Show-off.", "Fair."] },
    ] },
  // ---- the sim lounge: a lap to beat ----------------------------------------------------------------------------------------------------------
  { id: 'vSimLap', who: ['driver', 'group'], where: ['simlounge'], w: 3, when: (x) => ok(x), open: [
    "These rigs are nicer than mine at home. That's offensive.", "Bet you a coffee you can't beat my lap on that rig.", "Who set the lap record on this machine? It says 'GAZ'. Who's Gaz?" ],
    opts: [
      { tone: 'show', t: ["I'll be top of that board before you've adjusted the seat.", "One lap. Watch the board change."], r: ["Ooh. Okay.", "Go on, then."], then: { say: ["What do you change first? Pedals? Force feedback?", "Do you fiddle with the settings, or just drive?"], opts: [
        { tone: 'firm', t: ["Brake pedal. Always stiffer.", "Seat position, then the brake. Nothing else."], r: ["Proper.", "Smart."] },
        { tone: 'light', t: ["The seat. Then I complain about the seat.", "Everything. Then I put it all back."], r: ["Ha. Same.", "Ha. Classic."] },
        { tone: 'kind', t: ["Nothing. Drive what you're given.", "Whatever you'd change. Show me."], r: ["Respect.", "Okay. Watch this."] } ] } },
      { tone: 'light', t: ["Gaz is a legend. We don't beat Gaz.", "Gaz has clearly been here every night for a year."], r: ["Ha. All hail Gaz.", "Ha. Poor Gaz."] },
      { tone: 'kind', t: ["Go on, then. Show me your lines and I'll show you mine.", "Let's both do a lap and compare. No ego."], r: ["Deal.", "No ego. Ha. Sure."] },
      { tone: 'firm', t: ["One lap. No resets. Winner takes it.", "One lap. Clean. Track limits count."], r: ["You're on.", "Track limits. Serious."] },
    ] },
  // ---- the sim lounge: the arcade cabinet ------------------------------------------------------------------------------------------------------
  { id: 'vSimArcade', who: ['driver', 'celeb', 'group'], where: ['simlounge'], w: 2, when: (x, n) => calm(x, n), open: [
    "There's an arcade machine in the corner. Retro. I'm going to destroy it.", "That arcade high score's been there for years. Somebody has to beat it.", "Are you any good at those old arcade games? Honestly." ],
    opts: [
      { tone: 'show', t: ["Top of the board in ten minutes. Watch.", "Reflexes are my job. This is easy."], r: ["Ha. Ten minutes.", "We'll see."], then: { say: ["What name do you put on the board? Three letters.", "Three letters for the high-score table. Go."], opts: [
        { tone: 'light', t: ["'LOL'. Every time. Very mature.", "'ACE'. Even when I'm not."], r: ["Ha. Classic.", "Ha. Confident."] },
        { tone: 'show', t: ["My initials. Obviously.", "The same three I put on every board."], r: ["Course.", "Ha. Of course."] },
        { tone: 'kind', t: ["Whoever I'm with. It's a team effort.", "Yours. You're the one who found it."], r: ["Aw.", "That's sweet."] } ] } },
      { tone: 'light', t: ["I'm brilliant until anyone's watching.", "I'm terrible. Gloriously terrible."], r: ["Ha. I'm watching.", "Ha. Show me."] },
      { tone: 'kind', t: ["Let's go together. Two players.", "Doubles? I'll carry you. Or you'll carry me."], r: ["Yes!", "Ha. Deal."] },
      { tone: 'firm', t: ["Reflexes are reflexes. I'll be fine.", "It's just a reaction game. Lights out, basically."], r: ["Okay, then.", "Ha. Fair."] },
    ] },
  // ---- your flat: cooking ------------------------------------------------------------------------------------------------------------------------
  { id: 'vFlatCook', who: ['driver', 'group'], where: ['apartment'], w: 3, when: (x) => ok(x), open: [
    "Right, chef. What are we making? I can chop. That's about it.", "Your kitchen's tidier than our garage. Suspicious.", "Is this pasta from scratch? Who are you?" ],
    opts: [
      { tone: 'kind', t: ["Pasta. You chop, I stir, we both pretend we know what we're doing.", "Something simple. You're on garlic duty."], r: ["Perfect. I'm a great pretender.", "Garlic duty. Honoured."], then: { say: ["How much garlic is too much garlic?", "How long does it need? I'm starving."], opts: [
        { tone: 'light', t: ["There's no such thing.", "About four minutes longer than you'd like."], r: ["Ha. Correct.", "Ha. Brutal."] },
        { tone: 'kind', t: ["However much you like. It's your evening too.", "Not long. Help yourself to bread."], r: ["Generous.", "Lifesaver."] },
        { tone: 'firm', t: ["Two cloves. I've got media tomorrow.", "Exactly ten minutes. I timed it."], r: ["Ha. Sensible.", "Ha. Course you did."] } ] } },
      { tone: 'light', t: ["It's from a jar. The jar's from scratch.", "The kitchen's tidy because I've never used it."], r: ["Ha! Honest.", "Ha. That explains it."] },
      { tone: 'show', t: ["I'm a brilliant cook. Prepare yourself.", "Watch this. I've practised."], r: ["Ooh. Okay.", "Ha. Go on."] },
      { tone: 'firm', t: ["Carbs and protein. It's race week. Sorry.", "Rice, chicken, greens. The nutritionist's menu."], r: ["Ha. Grim. Fine.", "Ha. Living the dream."] },
    ] },
  // ---- your flat: the place itself, the record player --------------------------------------------------------------------------------------------
  { id: 'vFlatPlace', who: ['driver', 'group'], where: ['apartment'], w: 2, when: (x) => ok(x), open: [
    "Nice place. Very... tidy. Do you actually live here?", "You've got a record player? Of course you've got a record player.", "Come on, show me the trophy shelf. Everyone's got one." ],
    opts: [
      { tone: 'kind', t: ["Make yourself at home. Shoes off, feet up.", "Put a record on. Anything you like."], r: ["Don't mind if I do.", "Okay. Brave of you."], then: { say: ["What's playing, then? Your choice.", "Go on, what's your favourite record in here?"], opts: [
        { tone: 'kind', t: ["Something old. You'll like it.", "The first record I ever bought. Don't laugh."], r: ["Go on.", "I won't. ...Much."] },
        { tone: 'light', t: ["The only record I own. Twice.", "A sea shanty compilation. It's a vibe."], r: ["Ha!", "Ha. Is it, though?"] },
        { tone: 'show', t: ["Everything in here's a classic. My taste is perfect.", "Pick any. They're all brilliant."], r: ["Ha. We'll see.", "Ha. Bold."] } ] } },
      { tone: 'light', t: ["I live in airports. This is where I keep my socks.", "I'm here about four nights a month. The plants are fake."], r: ["Ha. Sad.", "Ha. Smart, though."] },
      { tone: 'show', t: ["The trophy shelf's being extended. Builders are in next week.", "Trophy room's through there. Wipe your feet."], r: ["Ha. Course it is.", "Ha. Steady."] },
      { tone: 'firm', t: ["I'm hardly here. It's a place to sleep.", "It's tidy because I'm never in it."], r: ["Yeah. Same.", "Fair."] },
    ] },
  // ---- the private dining room ------------------------------------------------------------------------------------------------------------------
  { id: 'vDining', who: ['driver', 'group'], where: ['restaurant'], w: 3, when: (x) => ok(x), open: [
    "A private room? Listen to you. Very fancy.", "I can't read half this menu. Is that a fish or a place?", "The waiter's looked at us twice. Either he knows who we are or he wants us to order." ],
    opts: [
      { tone: 'kind', t: ["My treat tonight. Order whatever you like.", "It's on me. You've earned a nice dinner."], r: ["Ooh. Generous.", "Cheers. Really."], then: { say: ["What are you drinking? I'm on sparkling water. Living the dream.", "Drinks? I'm thinking something with a tiny umbrella."], opts: [
        { tone: 'light', t: ["A mocktail with an umbrella in it. All style.", "Whatever's the most colourful thing on the menu."], r: ["Ha. Good choice.", "Ha. Yes."] },
        { tone: 'kind', t: ["Fresh orange juice. Very rock and roll.", "Same as you. Let's be boring together."], r: ["Ha. Wild.", "Ha. Deal."] },
        { tone: 'firm', t: ["Water. Race coming up.", "Still water. No ice. Race week."], r: ["Sensible.", "Proper."] } ] } },
      { tone: 'light', t: ["No idea. Point at something and be brave.", "I'm ordering by price. The middle one. Always the middle one."], r: ["Ha. Brave it is.", "Ha. Very scientific."] },
      { tone: 'show', t: ["I booked the best table. They know me here.", "The chef owes me a favour. Watch the starters."], r: ["Ooh. Listen to you.", "Ha. Go on, then."] },
      { tone: 'firm', t: ["Order the fish. You can't go wrong with the fish.", "Fish and vegetables. Nutritionist's orders."], r: ["Fish it is.", "Ha. Fine."] },
    ] },
  // ---- the karting hall: before the race ---------------------------------------------------------------------------------------------------------
  { id: 'vKartTrash', who: ['driver', 'group'], where: ['karting'], w: 3, when: (x) => ok(x), open: [
    "Right. Karts. This is where I find out if you're actually any good.", "I'm taking kart seven. Kart seven's the quick one. I can tell.", "Helmet on. No excuses. Indoor karting is pure talent." ],
    opts: [
      { tone: 'show', t: ["I was beating people in these before I could ride a bike.", "Kart seven won't save you."], r: ["Ooh. Okay.", "We'll see."], then: { say: ["Rules: no blocking, no brake-testing. Agreed?", "Clean racing. Agreed?"], opts: [
        { tone: 'firm', t: ["Agreed. Clean racing.", "Agreed. A kart's width, always."], r: ["Good.", "Good."] },
        { tone: 'light', t: ["Agreed. Mostly.", "Agreed. Unless you're in front."], r: ["Ha. Mostly.", "Ha. Rude."] },
        { tone: 'show', t: ["Agreed. You won't get close enough to block anyway.", "Agreed. You'll be watching my bumper all night."], r: ["Big words.", "We'll see."] } ] } },
      { tone: 'light', t: ["I'll be the one in the tyre wall, waving.", "I've already lost. I'm just here for the helmet hair."], r: ["Ha. Probably.", "Ha. Good look."] },
      { tone: 'kind', t: ["Whatever happens, it's going to be brilliant.", "Let's just enjoy it. Like when we were kids."], r: ["Yeah. It is.", "Yeah. Exactly."] },
      { tone: 'cruel', t: ["Hope you're quicker in this than in qualifying.", "Try not to get lapped. It's a short track."], r: ["Wow. Okay. It's on now.", "Rude. Now I'm motivated."], m: -2 },
    ] },
  // ---- the karting hall: where it all starts ----------------------------------------------------------------------------------------------------------
  { id: 'vKartRoots', who: ['driver', 'group'], where: ['karting'], w: 2, when: (x) => ok(x), open: [
    "Smell that? Rubber and fuel. Takes me straight back.", "Funny - this is where it all starts. Some kid on a Tuesday night.", "Look at the little ones on the junior session. They're so serious." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["This is where I fell in love with it. Places like this.", "Every one of us started somewhere like this."], r: ["Yeah. Same.", "Yeah. We did."], then: { say: ["Would you do it all again? All of it?", "If you could go back, would you change anything?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Every lap. Every early morning.", "Nothing. Even the bad bits made me."], r: ["Yeah. Me too.", "Good answer."] },
        { tone: 'light', t: ["Maybe with fewer trips into the tyre wall.", "I'd tell myself to stop wearing that awful helmet."], r: ["Ha. Fair.", "Ha. I remember that helmet."] },
        { tone: 'firm', t: ["Without hesitating.", "Yes. Same choices."], r: ["Yeah.", "Same."] } ] } },
      { tone: 'light', t: ["That kid in the blue's going to beat us both in ten years.", "Look at that one. Already arguing with his dad about tyre pressures."], r: ["Ha. Probably.", "Ha. Future champion."] },
      { tone: 'firm', t: ["Every one of them thinks they'll make it. A few will.", "It's a hard ladder. Hope they enjoy the climb."], r: ["Yeah.", "Yeah. They should."] },
      { tone: 'show', t: ["I was that serious. And that fast.", "I'd have beaten all of them. Easily."], r: ["Course you were.", "Ha. Sure."] },
    ] },

  // =====================================================================================================================
  // after a game (darts, pool, the sim, the karts, the cooking, the arcade)
  // =====================================================================================================================
  { id: 'gWon', who: ['driver', 'celeb', 'group'], w: 5, when: (x, n) => calm(x, n) && !!x.played && x.won === true, open: [
    "Fine. You won. I want a rematch.", "Don't look so pleased with yourself.", "Lucky. That was lucky. Say it was lucky." ],
    opts: [
      { tone: 'kind', t: ["You were close. Honestly. Next time.", "That was tight. Well played."], r: ["...Thanks. It was close, wasn't it?", "Cheers. Next time."], then: { say: ["Rematch. Next time. Somewhere I'm good at.", "I want a rematch. Somewhere else."], opts: [
        { tone: 'kind', fx: 'invite', t: ["Deal. You pick the place.", "Any time. You choose."], r: ["Oh, I'll choose carefully.", "Deal."] },
        { tone: 'show', t: ["Pick anything. I'll still win.", "Anywhere you like. Same result."], r: ["We'll see.", "Ha. We'll see."] },
        { tone: 'light', t: ["Is there anywhere you're good at? Name it.", "Somewhere with a sofa. You can beat me at sitting."], r: ["Rude. ...Fair.", "Ha. I would, too."] } ] } },
      { tone: 'show', t: ["Lucky? That was skill. Pure skill.", "Luck had nothing to do with it."], r: ["Ugh. Unbearable.", "Hm. Enjoy it while it lasts."] },
      { tone: 'light', t: ["I'd like to thank my team, my family and the snacks.", "Acceptance speech coming. Get comfortable."], r: ["Ha! Please don't.", "Ha. No."] },
      { tone: 'firm', t: ["Rematch any time. Same result.", "Best of three, if you want."], r: ["Oh, it's on.", "Fine. Best of three."] },
    ] },
  { id: 'gLost', who: ['driver', 'celeb', 'group'], w: 5, when: (x, n) => calm(x, n) && !!x.played && x.won === false, open: [
    "And that is how it's done.", "I'd say unlucky, but it wasn't luck.", "Shall I go easy on you next time? Be honest." ],
    opts: [
      { tone: 'kind', t: ["Fair. You were better. Well played.", "Well played. Genuinely."], r: ["Thanks. That was fun.", "Good sport."], then: { say: ["Want a rematch?", "Again?"], opts: [
        { tone: 'firm', t: ["Yes. Now.", "Best of three. Go."], r: ["Ha. Okay.", "You're on."] },
        { tone: 'kind', t: ["Later. I'll practise in secret.", "Next time. I'll get you then."], r: ["Ha. I'll be waiting.", "We'll see."] },
        { tone: 'light', t: ["Only if you play with your eyes shut.", "Only if you use the wrong hand."], r: ["Ha. Still win.", "Ha. Deal."] } ] } },
      { tone: 'light', t: ["I let you win. It's called hospitality.", "I was warming up. That was the warm-up."], r: ["Sure you did.", "Ha. Course."] },
      { tone: 'show', t: ["Best of three. I always start slowly.", "Rematch. I'll win the next two."], r: ["Ha. Okay.", "Ha. Bring it."] },
      { tone: 'cold', t: ["Whatever. It's a game.", "Doesn't matter."], r: ["...Okay. Sore loser.", "Right."] },
    ] },

  // =====================================================================================================================
  // three or more of you ({first}: the one you are talking to; {other}: the one listening in)
  // =====================================================================================================================
  { id: 'grBanter', who: ['group'], w: 3, when: (x) => ok(x), open: [
    "{other} reckons you're the worst parallel parker in the paddock. Defend yourself.", "{other} says you cried at a film on the plane. True?", "So {other} and I have a bet about you. Don't ask what." ],
    opts: [
      { tone: 'light', t: ["{other} has never seen me park. That's slander.", "I cried once. It was a very sad film about a dog."], r: ["Ha. {other}, explain yourself.", "Ha! Which film?"], then: { say: ["{other}? Back me up here.", "Go on, {other}, tell them."], opts: [
        { tone: 'light', t: ["{other}'s legally obliged to agree with me.", "{other} can't say anything. I know about the karting."], r: ["Ha. Fair.", "Ha. What about the karting?"] },
        { tone: 'kind', t: ["Leave {other} out of it. They've been lovely all night.", "{other}'s been the best company tonight."], r: ["Ha. Fine.", "Aw."] },
        { tone: 'show', t: ["{other} knows I'm right.", "Ask anyone. I'm the best parker on the grid."], r: ["Ha. Sure.", "Ha. Nobody's asking."] } ] } },
      { tone: 'kind', t: ["Guilty. It was a very good film.", "Guilty on all counts. I'm a softie."], r: ["Aw. Respect.", "Ha. Knew it."] },
      { tone: 'show', t: ["I can park anything. Put a car there and watch.", "A bet about me? I'm flattered. What are the odds?"], r: ["Ha. Not tonight.", "Long."] },
      { tone: 'firm', t: ["I'm not dignifying that with an answer.", "No comment. My lawyer's on holiday."], r: ["Ha. Guilty, then.", "Ha. Very guilty."] },
    ] },
  { id: 'grDebate', who: ['group'], w: 2.5, when: (x) => ok(x), open: [
    "Settle this. {other} says the best era of cars was the V10s. I say now.", "Which is harder: a street circuit or a proper old-school track? {other} and I can't agree.", "Greatest overtake you've ever seen - not yours. {other} thinks my answer's wrong." ],
    opts: [
      { tone: 'firm', t: ["The V10s. The noise. End of discussion.", "Old-school tracks. Every mistake costs you, and the fast corners never stop."], r: ["See? {other}, told you.", "Strong answer."], then: { say: ["{other}? Your turn. Pick a side.", "Right, {other}, you've heard it."], opts: [
        { tone: 'kind', t: ["{other}'s got a point too. I hate saying it.", "Honestly, you're both right."], r: ["Diplomatic.", "Boring answer."] },
        { tone: 'light', t: ["I'm with whoever's buying the next round of juices.", "I'm with {other}. They've got the chips."], r: ["Ha. Bribery.", "Ha. Fair."] },
        { tone: 'firm', t: ["I'm not moving on this.", "That's my answer and I'm keeping it."], r: ["Stubborn.", "Fair enough."] } ] } },
      { tone: 'kind', t: ["Today's cars. We're spoiled and we forget it.", "Every era was the best to the people in it."], r: ["Hm. Wise.", "Very wise. Annoyingly."] },
      { tone: 'light', t: ["Whichever one I'm driving, obviously.", "Street tracks. The hotels are closer."], r: ["Ha. Obviously.", "Ha. Priorities."] },
      { tone: 'show', t: ["Greatest overtake? Mine. You know the one.", "The best era is now, because I'm in it."], r: ["Ha. Course.", "Ha. Steady."] },
    ] },
  { id: 'grOrder', who: ['group'], w: 2.5, when: (x) => ok(x) && x.venue !== 'karting', open: [
    "Who's ordering for the table? Because if it's {other}, we'll get nine starters.", "Right, I'm getting juices for everyone. Orange or apple? It's race week, nobody's having anything stronger.", "Can we just order everything and share? {other}'s already eyeing your plate." ],
    opts: [
      { tone: 'kind', t: ["I'll get them. My shout tonight.", "Let me. You two got the last ones."], r: ["Legend.", "Cheers. Really."], then: { say: ["Mocktails? There's one with a tiny umbrella.", "What's everyone having? I'm on lime and soda."], opts: [
        { tone: 'light', t: ["Two umbrellas for me.", "Whatever's the most ridiculous colour."], r: ["Ha. Yes.", "Ha. Bright blue it is."] },
        { tone: 'kind', t: ["Whatever everyone's having.", "Same as you. Easy."], r: ["Easy.", "Done."] },
        { tone: 'firm', t: ["Sparkling water. I'm boring.", "Water. Race in a few days."], r: ["Sensible.", "Proper."] } ] } },
      { tone: 'light', t: ["Nine starters sounds perfect, actually.", "Order everything. I'll explain it to my nutritionist."], r: ["Ha. Agreed.", "Ha. Good luck."] },
      { tone: 'firm', t: ["Sharing's fine. Nobody touches my chips.", "Order what you want. I'm having the pasta."], r: ["Ha. Noted.", "Fair."] },
      { tone: 'show', t: ["Leave it to me. I know exactly what's good here.", "I'll order. I've got impeccable taste."], r: ["Go on, then.", "Ha. Prove it."] },
    ] },
  { id: 'grToast', who: ['group'], w: 2, when: (x) => ok(x), open: [
    "Glasses up. Orange juice counts. To...?", "We should toast something. {other}, you're good at speeches.", "Right, a toast. Keep it short. {other} gets emotional." ],
    opts: [
      { tone: 'kind', t: ["To clean racing, and everyone home safe.", "To the people who make our cars go. The mechanics."], r: ["To that.", "To the mechanics."], then: { say: ["That's a good one. Another?", "Go on, one more."], opts: [
        { tone: 'kind', t: ["To nights like this.", "To friends on the grid. Rare and good."], r: ["To nights like this.", "...Yeah. To that."] },
        { tone: 'light', t: ["To {other}'s parking.", "To the chips. The real heroes."], r: ["Ha! Rude.", "Ha. To the chips."] },
        { tone: 'firm', t: ["To the next race. Points for all of us.", "To a clean first lap."], r: ["To that.", "To a clean first lap."] } ] } },
      { tone: 'light', t: ["To {other}'s parking.", "To this table, which is slightly wobbly.", "To {name}: good company, shocking parker."], r: ["Ha! Rude.", "Ha. To the table.", "Ha! Slander. ...To me."] },
      { tone: 'show', t: ["To me finally beating you lot on race day.", "To me. Why not?"], r: ["Ha. We'll drink to the attempt.", "Ha. Fine. To you."] },
      { tone: 'firm', t: ["To the next one. Points for all of us.", "To hard racing and clean racing."], r: ["To the next one.", "Hear, hear."] },
    ] },
  { id: 'grTeams', who: ['group'], w: 2, when: (x) => ok(x) && x.venue !== 'restaurant', open: [
    "Doubles next game. I'm picking teams. {other}, you're with me.", "Me and {other} against you. Fair's fair - you're the ringer.", "If I lose this next one, {other} has to carry my coat home." ],
    opts: [
      { tone: 'show', t: ["Two against one? Still not fair. On you.", "Fine. I'll beat you both."], r: ["Ooh. Okay.", "Ha. We'll see."], then: { say: ["Loser does what?", "What's the forfeit?"], opts: [
        { tone: 'light', t: ["Loser sings on the team radio on race day.", "Loser wears the other team's cap for a day."], r: ["Ha! Deal.", "Ha. Brutal. Deal."] },
        { tone: 'kind', t: ["Loser buys the coffees. Simple.", "Loser books the next night out."], r: ["Deal.", "Good. Deal."] },
        { tone: 'firm', t: ["No forfeits. Just pride.", "Bragging rights. That's enough."], r: ["Pride's the worst forfeit.", "Fair."] } ] } },
      { tone: 'light', t: ["I'll play with my weaker hand. Both of them.", "The ringer? I'm flattered. And terrible."], r: ["Ha. Both?", "Ha. Sure you are."] },
      { tone: 'kind', t: ["Teams are fine. Let's just enjoy it.", "Whatever's fair. I'm just glad we're all here."], r: ["Aw.", "Yeah. Same."] },
      { tone: 'firm', t: ["Swap. I'll take {other}. Then we'll see.", "Pick again. That's rigged."], r: ["Ha. Fine.", "Ha. Rigged? Never."] },
    ] },
  { id: 'grRadio', who: ['group'], w: 2, when: (x) => ok(x), open: [
    "Worst thing you've ever said on the team radio. {other} wants to know.", "We're swapping embarrassing radio stories. Your turn.", "{other} reckons you once asked your engineer what lap it was. On the last lap." ],
    opts: [
      { tone: 'light', t: ["I asked what lap it was. On the last lap. It's true.", "I once said 'is that rain?' It was a pigeon."], r: ["Ha! It's true!", "Ha. A pigeon!"], then: { say: ["Nobody's topping that.", "Go on, {other}. Top that."], opts: [
        { tone: 'light', t: ["Your turn now, {first}.", "Come on, {first}. We all know you've got one."], r: ["Absolutely not.", "...Fine. One. Later."] },
        { tone: 'kind', t: ["We've all been there.", "That's the best bit of the job, honestly."], r: ["We have.", "Ha. It is."] },
        { tone: 'firm', t: ["That's enough radio for one night.", "What's said on the radio stays on the radio."], r: ["Ha. Fair.", "Ha. Wise."] } ] } },
      { tone: 'kind', t: ["I thanked the wrong team. Twice.", "I told my engineer I loved him. Meant to say 'copy'."], r: ["Ha! Twice!", "Ha. Aw."] },
      { tone: 'show', t: ["All my radio's legendary. Pick one.", "My radio is the best on the grid. People make videos of it."], r: ["Ha. Course.", "Ha. Do they?"] },
      { tone: 'firm', t: ["What's said on the radio stays on the radio.", "Not telling. Ever."], r: ["Boring.", "Spoilsport."] },
    ] },
  { id: 'grPhoto', who: ['group'], w: 1.5, when: (x) => ok(x), open: [
    "Photo? One for the group chat. Nobody posts it.", "We need a picture of this. {other}, squeeze in.", "Quick photo before the food comes. Come on." ],
    opts: [
      { tone: 'kind', t: ["Go on. One for us.", "Yeah. Come here, everyone."], r: ["Nice. Look at us.", "Lovely."], then: { say: ["Can I post it? Just the stories.", "Can I put it up? Everyone looks good."], opts: [
        { tone: 'kind', fx: 'invite', t: ["Go on. Tag us all.", "Post it. Proof we have friends."], r: ["Done.", "Ha. Done."] },
        { tone: 'firm', t: ["Keep it in the group chat.", "Not tonight. Just for us."], r: ["Fair.", "Fair."] },
        { tone: 'light', t: ["Only if I look good. Check first.", "Only if you crop out my chips."], r: ["Ha. You look great.", "Ha. Fine."] } ] } },
      { tone: 'light', t: ["Only if I can stand on something. I want to look taller.", "Wait - let me do my podium face."], r: ["Ha. Go on.", "Ha. Very serious."] },
      { tone: 'show', t: ["I'll take it. I know my angles.", "Give me the phone. I'm a brilliant photographer."], r: ["Ha. Go on.", "Ha. Fine."] },
      { tone: 'cold', t: ["No photos tonight, please.", "Can we not? Just tonight."], r: ["Course.", "Fair enough."] },
    ] },

  // =====================================================================================================================
  // the celebrities: a date (all of them made up, all of them adults; PG)
  // =====================================================================================================================
  // ---- a first date --------------------------------------------------------------------------------------------------------------
  { id: 'cFirstDate', who: ['celeb'], w: 7, when: (x, n) => calm(x, n) && x.date !== false && st(n) !== 'ex' && (at(n, 'met', 'friendly', 'flirting') || n.dates === 0), open: [
    "So. This is a date. Isn't it? I wasn't completely sure.", "I changed outfits three times. Don't tell anyone.", "I nearly cancelled. Not because of you. Because I was nervous.", "I've been looking forward to this all week. Is that too much to say?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'm really glad you came, {her}. Really.", "Not too much at all. I've been looking forward to it too."], r: ["...Me too.", "Oh, good. That's a relief."], then: { say: ["So what do you do on a night off? When you're not being a racing driver?", "Tell me something about you that isn't on the internet."], opts: [
        { tone: 'kind', fx: 'deep', t: ["This, honestly. Not nearly often enough.", "I'm a terrible cook and a very good listener."], r: ["Then we'll do it more often.", "Good. I'm a good talker."] },
        { tone: 'light', t: ["Fall asleep on the sofa by nine. Wild.", "I still can't whistle. Years of trying."], r: ["Ha! Rock and roll.", "Ha. Show me. ...Oh no."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'm hoping this becomes a regular thing.", "Honestly? I've been thinking about this evening since you said yes."], r: ["...Okay. That's a good answer.", "Smooth. I'll allow it."] },
        { tone: 'firm', t: ["Train, sleep, study the data. I'm a lot of fun.", "Not much. This season is everything."], r: ["Ha. We'll work on that.", "Then I'm honoured."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["It's definitely a date. And you look lovely.", "Three outfits, and you picked the right one."], r: ["...Okay. Good. It's a date.", "Ha. You'd have said that about any of them."] },
      { tone: 'light', t: ["I nearly cancelled too. Then I remembered you'd tell everyone.", "Nervous? I've changed my shirt twice since I sat down."], r: ["Ha! I would have.", "Ha. You haven't."] },
      { tone: 'show', t: ["Nervous? With me? Understandable.", "Of course it's a date. I don't do half measures."], r: ["Wow. Okay. Confident.", "Hm. We'll see how it goes."] },
    ] },
  // ---- her work -------------------------------------------------------------------------------------------------------------------
  { id: 'cWork', who: ['celeb'], w: 3, crowd: true, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "I've been buried in {herWork} all week. Ask me anything except how it's going.", "Can I tell you about {herWork}? Nobody else wants to hear about it.", "Sorry I'm late. It's {herWork}. It's always something." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Tell me everything. Start at the beginning.", "I want to hear about it. Properly."], r: ["You'll regret that offer.", "...Really? Okay. Brace yourself."], then: { say: ["Do you ever get tired of it? The thing you love turning into a job?", "Does it still feel like yours? The racing? Or does it belong to everyone now?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Sometimes. Then I sit in the car and it's mine again.", "Every so often. Then a good lap fixes it."], r: ["That's lovely.", "I know exactly what you mean."] },
        { tone: 'firm', t: ["No. I'm lucky. I remind myself every day.", "It's mine. Nobody can take the driving off me."], r: ["Good.", "I like that."] },
        { tone: 'light', t: ["Only on Mondays. And Tuesdays.", "Only when the alarm goes off at five."], r: ["Ha. Same.", "Ha. Five is criminal."] },
        { tone: 'flirt', fx: 'flirt', t: ["Not tonight. Tonight I don't care about any of it.", "Right now it feels a long way away. In a good way."], r: ["...Good answer.", "Good."] } ] } },
      { tone: 'light', t: ["Anything except that? Right. Favourite biscuit.", "Okay. Most embarrassing thing you've ever said on live TV."], r: ["Ha! Ginger nut. Obviously.", "Ha. Not telling. Yet."] },
      { tone: 'firm', t: ["You'll get there. From what I hear, you always do.", "Sounds like you're nearly there. Keep going."], r: ["...Thanks. That actually helps.", "Thank you. I needed that."] },
      { tone: 'show', t: ["Try having twenty cameras watching you change tyres.", "At least nobody times your job to the thousandth."], r: ["Is this a competition now?", "Okay. You win. Happy?"], m: -1 },
    ] },
  // ---- what people think her job is -------------------------------------------------------------------------------------
  { id: 'cJob', who: ['celeb'], w: 2, crowd: true, when: (x, n) => calm(x, n) && !!n.job && st(n) !== 'ex', open: [
    "People hear '{job}' and picture red carpets. My week was {herWork}, two cancelled flights and a sandwich on an airport floor.", "Everyone thinks they know what my days look like. Nobody ever guesses the waiting around.", "Go on - guess the least glamorous part of my job. You won't get it." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Nobody sees the hours. It's the same with racing - they see two hours on a Sunday.", "The waiting. It has to be the waiting. We're the same."], r: ["...Yes. Exactly that. Nobody sees the hours.", "...The waiting. Yes. You get it."], then: { say: ["Do you ever wish you'd done something ordinary? Nine to five?", "Would you swap it? For a normal job?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Never. But I like that you asked.", "Some mornings. Never for long."], r: ["...Same. Never for long.", "...Me too. Some mornings."] },
        { tone: 'light', t: ["I'd be the worst accountant alive. I round everything up.", "I'd be a postman. Very fast deliveries."], r: ["Ha. Please never do my taxes.", "Ha. Terrifying postman."] },
        { tone: 'firm', t: ["No. This is what I'm for.", "Never. Not for a second."], r: ["...I like that you're sure.", "Good. Me neither."] },
        { tone: 'flirt', fx: 'flirt', t: ["If you were in the office next door, maybe.", "Only if you came with it."], r: ["...Smooth. Ordinary would be wasted on you.", "...Stop it."] } ] } },
      { tone: 'light', t: ["The airport sandwich. It's always the airport sandwich.", "Is it the hotel hairdryers? It's the hotel hairdryers."], r: ["Ha! It's always the sandwich.", "Ha. They're all broken. Every one."] },
      { tone: 'firm', t: ["It's still work. Turning up when you don't feel like it is the whole job.", "Glamour's a word for the people watching. The job's the hours."], r: ["...Yes. That's exactly it.", "...That's very true."] },
      { tone: 'show', t: ["Glamorous? Try two hours in a cockpit at fifty degrees.", "At least you don't do yours at three hundred an hour."], r: ["Is this a competition now?", "...Okay. You win. This round."], m: -1 },
    ] },
  // ---- where she wants to go ------------------------------------------------------------------------------------------------------------
  { id: 'cAmbition', who: ['celeb'], w: 2.5, when: (x, n) => calm(x, n) && at(n, 'friendly', 'flirting', 'dating', 'partner'), open: [
    "Where do you want to be in five years? Not racing. Life.", "Do you ever think about what comes after? When the racing stops?", "I've got a list of things I want to do before I'm forty. Do you have one?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Somewhere I can see the sea, with people I love round a table.", "Happy. Settled. Still a bit fast."], r: ["...That's lovely. Really.", "Still a bit fast. Ha. I like that."], then: { say: ["And the racing? Is the title the dream?", "What's on your list, then? The real one?"], opts: [
        { tone: 'firm', t: ["The title. Once. Then I can breathe.", "One title. That's the whole list."], r: ["Clear. I like clear.", "Then go and get it."] },
        { tone: 'kind', fx: 'deep', t: ["It's the dream. But it's not the whole of me.", "Learn a language. Run a marathon. See my family more."], r: ["Good. It shouldn't be.", "That's a good list."] },
        { tone: 'light', t: ["The title, and a dog. In that order.", "See the northern lights. Learn to whistle."], r: ["Ha. What sort of dog?", "Ha. The whistling's harder."] },
        { tone: 'flirt', fx: 'flirt', t: ["Depends who's waiting at the finish.", "I'm adding things to it tonight."], r: ["...Careful.", "Oh, are you?"] } ] } },
      { tone: 'firm', t: ["Champion. Nothing less. Then we'll see.", "Winning. Then everything else."], r: ["Clear. I like that.", "Focused."] },
      { tone: 'light', t: ["My list has one thing on it: sleep.", "My list is mostly snacks."], r: ["Ha! Ambitious.", "Ha. Relatable."] },
      { tone: 'cold', t: ["I don't really plan that far ahead.", "I try not to think about after."], r: ["...Right. Fair.", "Okay."] },
    ] },
  // ---- home --------------------------------------------------------------------------------------------------------------------------
  { id: 'cHome', who: ['celeb'], w: 2.5, crowd: true, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "Where's home, for you? Really home.", "Do you ever get homesick? I'm in a different city every week.", "I miss home today. Silly. I don't know why." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Tell me about yours. What would we do there?", "What do you miss most about it?"], r: ["Oh - we'd walk. Everywhere. And eat far too much.", "The people. The noise in the kitchen. My own bed."], then: { say: ["You'd like it there. I think. Would you come?", "Would you come and see it? One day?"], opts: [
        { tone: 'kind', fx: 'invite', t: ["I'd love to. After the season.", "Yes. Show me everything."], r: ["...I'll hold you to that.", "I will."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if you're the tour guide.", "Anywhere, if you're there."], r: ["Deal. I'm a very strict tour guide.", "...Stop it."] },
        { tone: 'firm', t: ["One day. When the calendar lets me.", "When the season's done, yes."], r: ["One day, then.", "Okay. Winter."] },
        { tone: 'light', t: ["Only if there's no airport involved.", "If the food's as good as you say."], r: ["Ha. You'll have to swim.", "Better."] } ] } },
      { tone: 'kind', fx: 'deep', t: ["Wherever my family is. The rest is just hotels.", "All the time. I don't say it much."], r: ["...Yeah. That's how I feel too.", "You can say it to me."] },
      { tone: 'light', t: ["Home is wherever the phone charger is.", "Home is the airport lounge with the good sofas."], r: ["Ha. Tragic.", "Ha. That's bleak."] },
      { tone: 'firm', t: ["I don't let myself think about it mid-season.", "I switch that off until the winter."], r: ["Does that work?", "Hm. I couldn't."] },
    ] },
  // ---- her family, and yours (in general terms) -----------------------------------------------------------------------------------------
  { id: 'cFamily', who: ['celeb'], w: 2.5, when: (x, n) => calm(x, n) && at(n, 'dating', 'partner'), open: [
    "My family want to meet you. Well - my mum does. My dad's pretending not to care.", "Do your family watch the races? Mine have started watching. For some reason.", "My sister thinks you're 'trouble'. I told her she's probably right." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'd love to meet them. Honestly.", "Tell them I'd love to. Whenever they like."], r: ["Careful. My mum asks a lot of questions.", "...Really? They'll be thrilled. Terrifyingly thrilled."], then: { say: ["What would you tell them about us?", "What would you say if they asked about us?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["That I'm happier than I've been in a long time.", "The truth. That I'm lucky."], r: ["...Okay. That's the right answer.", "...You're going to make my mum cry."] },
        { tone: 'light', t: ["That I'm a very safe driver. On ordinary roads.", "That I brought biscuits. Always bring biscuits."], r: ["Ha! Very reassuring.", "Ha. Smart."] },
        { tone: 'firm', t: ["Whatever they ask, they'll get a straight answer.", "That I'm serious about you."], r: ["Good.", "...Good."] } ] } },
      { tone: 'light', t: ["Trouble? Me? I indicate on the motorway.", "Your dad's going to grill me about lap times, isn't he?"], r: ["Ha! Very reassuring.", "Ha. Probably."] },
      { tone: 'firm', t: ["Tell her I'm on my best behaviour.", "Tell your sister she's wrong. Mostly."], r: ["She won't believe it.", "Mostly."] },
      { tone: 'cold', t: ["Let's not rush the family stuff.", "I'd rather keep families out of it for now."], r: ["...Okay. Sure.", "Right. Okay."], m: -2 },
    ] },
  // ---- what she sees in racing -------------------------------------------------------------------------------------------------------------
  { id: 'cWhyRacing', who: ['celeb'], w: 2, crowd: true, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "What do you actually love about it? Not the winning. The driving.", "I watched the start on TV last time and forgot to breathe. Is it like that inside the car?", "Explain it to me like I'm not a fan. Why this?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["The moment the lights go out. Everything goes quiet in my head.", "Being right on the edge, and knowing exactly where it is."], r: ["...That's beautiful, actually.", "That sounds terrifying and wonderful."], then: { say: ["Doesn't it scare you? Even a bit?", "Are you ever frightened?"], opts: [
        { tone: 'kind', t: ["Yes. Respecting that is part of the job.", "Sometimes. That's what keeps us careful."], r: ["...I'm glad you said that.", "Good. Stay careful."] },
        { tone: 'firm', t: ["Scared, no. Careful, always.", "There's no room for fear in the car. Only focus."], r: ["Okay.", "Hm. Focus, then."] },
        { tone: 'light', t: ["Only of the press conferences.", "Only of my engineer when I've ignored him."], r: ["Ha!", "Ha. Sensible."] } ] } },
      { tone: 'light', t: ["Free travel and unlimited energy drinks.", "The overalls. Obviously. Very flattering."], r: ["Ha! Liar.", "Ha. Very."] },
      { tone: 'firm', t: ["Being the best at one thing, on one day, in front of everyone.", "The stopwatch. It never lies."], r: ["That's intense. I like it.", "Hm. Brutal."] },
      { tone: 'show', t: ["Being faster than everyone. Every week.", "Being good at it. Very good."], r: ["Hm. And when you're not?", "Modest, too."] },
    ] },
  // ---- she watched the last race: a podium -------------------------------------------------------------------------------------------------
  { id: 'cSawWin', who: ['celeb'], w: 4, crowd: true, when: (x, n) => calm(x, n) && podium(x) && st(n) !== 'ex', open: [
    "I watched you on the podium last time. I screamed. Out loud. In a café.", "Congratulations on {result}. I was so proud, and I don't even understand the rules.", "My whole group chat watched {result}. They want to meet you now. Don't." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["That means a lot. Honestly. Thank you.", "You watched? That's the best bit of it."], r: ["I mean it.", "Every lap."], then: { say: ["What did it feel like? Up there?", "What's it like, standing up there?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Like all the early mornings were worth it.", "Like the whole team was up there with me."], r: ["...That's lovely.", "I could see that on your face."] },
        { tone: 'light', t: ["Loud. Very loud. Wonderful.", "Like my face was going to break from smiling."], r: ["Ha. It looked loud.", "Ha. It nearly did."] },
        { tone: 'flirt', fx: 'flirt', t: ["Better, knowing you were watching.", "Good. Not as good as this, though."], r: ["...Stop it.", "Smooth."] },
        { tone: 'firm', t: ["Like the start of something.", "Like I want to do it again. Soon."], r: ["Then do it again.", "I believe you."] } ] } },
      { tone: 'light', t: ["You screamed in a café? I need to see the footage.", "Tell your group chat I'm very busy. And very shy."], r: ["There is footage. You're not seeing it.", "Ha. Shy. Sure."] },
      { tone: 'show', t: ["Get used to it. There's more where that came from.", "That was just the warm-up."], r: ["Oh, is there?", "Hm. Big words."] },
      { tone: 'flirt', fx: 'flirt', t: ["I looked for you in the crowd. Just so you know.", "I'd have got up there faster if I'd known you were watching."], r: ["...Stop it.", "Ha. Liar. Keep going."] },
    ] },
  // ---- she watched the last race: a bad one -----------------------------------------------------------------------------------------------
  { id: 'cSawBad', who: ['celeb'], w: 4, crowd: true, when: (x, n) => calm(x, n) && rough(x, 11) && st(n) !== 'ex', open: [
    "I saw the last race. I'm sorry. I wanted to text, but I didn't know what to say.", "Are you alright? After last time? You looked so cross on TV.", "I don't know much about racing, but I know that wasn't the day you wanted." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I'm alright now. This helps. You help.", "It was a rough one. Thank you for asking."], r: ["Good. That's what I'm here for.", "Of course."], then: { say: ["Do you want to talk about it, or not at all?", "Talk about it, or forget it for a night?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["A bit. Then never again.", "Maybe a little. It helps saying it out loud."], r: ["Okay. A bit.", "Then say it."] },
        { tone: 'light', t: ["Not at all. Tell me something silly instead.", "Forget it. What's the silliest thing that happened to you this week?"], r: ["Okay. I fell up a staircase on Tuesday.", "Ha. I walked into a glass door. Twice."] },
        { tone: 'firm', t: ["It's done. Next one.", "Nothing to talk about. I'll fix it on track."], r: ["Okay.", "Okay. I believe you."] },
        { tone: 'flirt', fx: 'flirt', t: ["Not at all. I'd rather just look at you.", "Forget it. You're much better company than a race."], r: ["...Okay. That works too.", "Hm. Good answer."] } ] } },
      { tone: 'firm', t: ["It happens. You learn and go again.", "One bad day. It won't be the last, or the worst."], r: ["That's very grown-up of you.", "Okay."] },
      { tone: 'light', t: ["Cross? I was furious. With a sandwich, mostly.", "I wasn't cross. That's just my face in a helmet."], r: ["Ha! Poor sandwich.", "Ha. It's a cross face."] },
      { tone: 'cold', t: ["I'd rather not talk about racing tonight.", "Can we not?"], r: ["Of course. Sorry.", "Of course."] },
    ] },
  // ---- compliments ---------------------------------------------------------------------------------------------------------------------
  { id: 'cCompliment', who: ['celeb'], w: 3, when: (x, n) => calm(x, n) && rom(n), open: [
    "You scrub up well, for a racing driver.", "You're quieter than I thought you'd be. In a good way.", "Okay, I'll admit it - you're funnier than you are on TV." ],
    opts: [
      { tone: 'flirt', fx: 'flirt', t: ["And you're even better company than I hoped.", "You're the best thing about this whole week."], r: ["Smooth. Very smooth.", "...Okay. That was good."], then: { say: ["Do you say that to everyone?", "Is that a line? It sounds like a line."], opts: [
        { tone: 'flirt', fx: 'flirt', t: ["Only to you.", "It's not a line. Lines are on the track."], r: ["Hm. I'll allow it.", "Ha. Okay, that one was a line."] },
        { tone: 'kind', t: ["No. I'm usually terrible at this.", "No. I mean it."], r: ["...That's sweet.", "...Okay."] },
        { tone: 'light', t: ["Only to my engineer. He blushes.", "Mostly to the mechanics. They love it."], r: ["Ha! Poor man.", "Ha. Of course."] } ] } },
      { tone: 'kind', fx: 'charm', t: ["Thank you. That's really nice to hear.", "That's kind. You're easy to talk to."], r: ["It's true.", "So are you."] },
      { tone: 'light', t: ["On TV I've got a helmet on. Big disadvantage.", "Scrub up well? I had a shower. That's the secret."], r: ["Ha! True.", "Ha. Revolutionary."] },
      { tone: 'show', t: ["I'm funnier in person. And faster. And better-looking.", "Wait till you see me in a suit."], r: ["And modest. So modest.", "Hm. We'll see."] },
    ] },
  // ---- teasing ---------------------------------------------------------------------------------------------------------------------------
  { id: 'cTease', who: ['celeb'], w: 2, when: (x, n) => calm(x, n) && at(n, 'friendly', 'flirting', 'dating', 'partner'), open: [
    "Be honest: how many times have you checked your lap times on your phone tonight?", "You're doing the thing with your hands. The steering thing. You know you do that?", "Do racing drivers ever just... sit still?" ],
    opts: [
      { tone: 'light', t: ["Twice. Three times. Four.", "My hands are doing a lap of {track}. They can't help it."], r: ["Ha! I knew it.", "Ha. Which corner are they on?"], then: { say: ["Give me the phone. I'm keeping it till dessert.", "Phone. Hand it over. You'll get it back later."], opts: [
        { tone: 'kind', fx: 'charm', t: ["Here. It's yours.", "Take it. You've got my full attention."], r: ["Good.", "...Good."] },
        { tone: 'light', t: ["Keep it. If it rings, it's my engineer. Tell him I'm busy.", "Fine. But if it buzzes, don't read it. It's tyre data."], r: ["Ha. I'll tell him you're mine tonight.", "Ha. I won't. Probably."] },
        { tone: 'cold', t: ["No. Sorry. I need it.", "I'll keep it, thanks."], r: ["...Right.", "Okay. Fine."], m: -2 } ] } },
      { tone: 'kind', fx: 'charm', t: ["Caught. I'll put it away. You've got my full attention.", "Sorry. Old habits. I'm all yours."], r: ["Good. Keep it that way.", "Good."] },
      { tone: 'flirt', fx: 'flirt', t: ["Not when I'm sitting with you.", "I sit very still when I'm looking at you."], r: ["...Okay. Smooth.", "You're not, though. Your foot's tapping."] },
      { tone: 'show', t: ["I'm always racing. It's a gift.", "Still? Never. Champions don't sit still."], r: ["It's a lot.", "Hm. Champions."] },
    ] },
  // ---- what are we? ------------------------------------------------------------------------------------------------------------------------
  { id: 'cUs', who: ['celeb'], w: 4, when: (x, n) => calm(x, n) && st(n) === 'dating', open: [
    "Can I ask you something? What are we doing, you and me?", "I like this. Us. I'm just not sure what 'this' is yet.", "My friends keep asking what we are. I keep saying 'nice'." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I like you. A lot. I want to see where it goes.", "Something good. I don't want to rush it, and I don't want to lose it."], r: ["...Okay. Good. Me too.", "...That's exactly how I feel."], then: { say: ["So we're... a thing?", "So what do I tell my friends?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["We're a thing. If you want to be.", "Tell them we're happy."], r: ["...I want to be.", "Happy. Okay. I like that."] },
        { tone: 'flirt', fx: 'flirt', t: ["We're a very good thing.", "Tell them I'm very charming."], r: ["Ha. We are.", "Ha. I'll tell them you're 'alright'."] },
        { tone: 'firm', t: ["Let's keep enjoying it and not label it yet.", "Tell them it's early days."], r: ["...Okay. Early days.", "Fine. Early days."] } ] } },
      { tone: 'firm', t: ["Let's not rush it. I like where it's going.", "One step at a time. I'm in no hurry."], r: ["...Okay. Slow is fine.", "Okay. Me neither."] },
      { tone: 'light', t: ["We're 'nice'. I'm putting it on a T-shirt.", "Tell them we're 'very nice'. It's an upgrade."], r: ["Ha! Don't you dare.", "Ha. Very nice. Okay."] },
      { tone: 'cold', t: ["Do we have to define it?", "Can we just not, tonight?"], r: ["...No. I suppose not.", "Right. Okay."], m: -2 },
    ] },
  // ---- going public? (the hub makes it official; this is the conversation) ------------------------------------------------------------------
  { id: 'cOfficial', who: ['celeb'], w: 4, when: (x, n) => calm(x, n) && st(n) === 'dating' && (n.dates || 0) >= 2 && !n.public, open: [
    "My publicist asked if we're 'going public'. I said I'd ask you.", "People have started guessing about us. Do we tell them?", "I'd like to stop hiding behind menus every time someone gets a phone out." ],
    opts: [
      { tone: 'kind', fx: ['deep', 'charm'], t: ["Let's do it. I'm proud of us.", "I'd like everyone to know. If you would."], r: ["...Really? Okay. Wow. Okay.", "...I would. I really would."], then: { say: ["How do we do it, then? A photo? A statement?", "So how do we tell people?"], opts: [
        { tone: 'kind', t: ["Just turn up together somewhere. Let them work it out.", "Come to the next race. Stand with me in the garage."], r: ["I like that. No fuss.", "...In front of everyone? Okay. Yes."] },
        { tone: 'light', t: ["A press release. Very formal. Signed by us both.", "Skywriting. Over the circuit."], r: ["Ha. Please don't.", "Ha! Absolutely not."] },
        { tone: 'firm', t: ["Nothing dramatic. No interviews.", "Quietly. On our terms."], r: ["Our terms. Good.", "Good."] } ] } },
      { tone: 'firm', t: ["When we're both ready. No rush.", "Soon. Let's just pick the moment."], r: ["...Okay. That's fair.", "Okay. Soon."] },
      { tone: 'firm', t: ["Not yet. Let's keep it ours a little longer.", "Can it be just ours for a bit? I like that it's ours."], r: ["...Ours. I can live with that. For now.", "For a bit. Not for ever."] },
      { tone: 'light', t: ["Hide behind menus? I'll order a bigger menu.", "We could wear disguises. Fake moustaches."], r: ["Ha! Coward.", "Ha. You first."] },
    ] },
  // ---- your partner: how are you, really? ----------------------------------------------------------------------------------------------------
  { id: 'cPartner', who: ['celeb'], w: 5, when: (x, n) => calm(x, n) && st(n) === 'partner', open: [
    "How are you, really? Not the racing answer.", "I missed you this week. Is that soppy?", "You've been somewhere else all evening. Where are you?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Better now. Honestly, this week was a lot.", "Tired. Happy you're here. In that order. No - the other order."], r: ["Tell me. All of it.", "Ha. Nice save."], then: { say: ["Do you ever let anyone help? Or do you carry it all yourself?", "You know you can tell me things. The hard ones too."], opts: [
        { tone: 'kind', fx: 'deep', t: ["I'm learning to. You make it easier.", "I know. I'm getting better at it."], r: ["Good. Keep learning.", "Good."] },
        { tone: 'firm', t: ["I carry it. That's the job.", "Some things stay at the track."], r: ["...Not all of it. Please.", "Okay. Not everything, though."] },
        { tone: 'light', t: ["I carry it, then I complain to you. It works.", "I tell my engineer. Then I tell you the edited version."], r: ["Ha. It does.", "Ha. I want the full version."] },
        { tone: 'flirt', fx: 'flirt', t: ["You're the help. You just don't know it.", "Sitting here with you is the help."], r: ["...You can't just say that.", "...Okay. Good."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["I missed you too. More than I'd say in public.", "Not soppy. I counted the days."], r: ["...Soppy. I love it.", "You did not. ...Did you?"] },
      { tone: 'light', t: ["In my head I'm still braking for Turn 1.", "Somewhere around the second sector. I'm back now."], r: ["Come back. I'm right here.", "Ha. Welcome back."] },
      { tone: 'cold', t: ["I'm fine. Just tired.", "Nowhere. Leave it."], r: ["Okay. If you say so.", "...Okay."], m: -1 },
    ] },
  // ---- the quiet minute at the window (or on the balcony) -----------------------------------------------------------------------------------
  { id: 'cMoment', who: ['celeb'], w: 5, when: (x, n) => calm(x, n) && !!x.moment && rom(n), open: [
    "Thank you for bringing me out here. It's the first quiet minute I've had in weeks.", "Can we just stand here for a bit? Not talk about anything?", "This is nice. Just us. Nobody watching." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["Me too. I don't get many of these.", "We can stand here as long as you like."], r: ["...Good.", "Okay. A long time, then."], then: { say: ["Can I tell you something I don't tell people?", "Do you ever feel like everyone knows you and nobody does?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Anything. It stays here.", "All the time. Except right now."], r: ["...I get scared it'll all stop one day. The work. The people.", "...Yeah. Except right now."] },
        { tone: 'firm', t: ["Go on. I'm listening.", "You can tell me."], r: ["...I'm happier with you than I expected to be. That's all.", "...Thank you. Another time, maybe."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'd like to be the one who knows you.", "I want to know the version nobody sees."], r: ["...You're getting there.", "...Careful. You might."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Nobody watching. Good.", "Just us. My favourite kind of evening."], r: ["...Good.", "Mine too."] },
      { tone: 'light', t: ["Just us. And that pigeon. He's very interested.", "Not a word. Starting now. ...Is this weird?"], r: ["Ha. Ignore the pigeon.", "Ha. A bit. It's nice, though."] },
      { tone: 'firm', t: ["As long as you like. I'm not going anywhere.", "Take your time."], r: ["...Thank you.", "Okay."] },
    ] },
  // ---- the end of the evening -----------------------------------------------------------------------------------------------------------------
  { id: 'cInvite', who: ['celeb'], w: 6, when: (x, n) => calm(x, n) && !!x.late && st(n) !== 'ex', open: [
    "I don't want tonight to end. That's annoying.", "It's late. I should go. I don't really want to go.", "So when do I see you again?", "I loved {venue}. I loved all of tonight, actually. So when's the next one?" ],
    opts: [
      { tone: 'kind', fx: 'invite', t: ["Come to the next race. Watch from the garage.", "Come to the next race. I'd like you there."], r: ["...Really? I'd love that.", "...I'd like that too."], then: { say: ["Won't I be in the way?", "What do I wear to a garage? Is there a dress code?"], opts: [
        { tone: 'kind', t: ["Never. The mechanics will adopt you.", "Wear whatever you like. You'll be the best thing in there."], r: ["Good.", "...Okay. I'll come."] },
        { tone: 'light', t: ["Only if you touch the tyres. Don't touch the tyres.", "Ear defenders. That's the whole dress code."], r: ["Ha. Noted.", "Ha. Very glamorous."] },
        { tone: 'flirt', fx: 'flirt', t: ["You'll be my lucky charm.", "I'll be looking for you on the grid."], r: ["No pressure, then.", "...I'll be there."] } ] } },
      { tone: 'flirt', fx: ['flirt', 'invite'], t: ["Same time next week? I'll find somewhere even better.", "Soon. Very soon. I'm already planning it."], r: ["It's a date. Again.", "...Good."] },
      { tone: 'firm', t: ["Soon. I'll call you after the race.", "After the race. I'll ring you."], r: ["You'd better.", "Okay."] },
      { tone: 'light', t: ["I'll send you a very detailed schedule.", "My engineer will email you a plan. With graphs."], r: ["Ha! Romantic.", "Ha. Can't wait."] },
    ] },
  // ---- a photo -----------------------------------------------------------------------------------------------------------------------------
  { id: 'cPhoto', who: ['celeb'], w: 2, when: (x, n) => calm(x, n) && rom(n), open: [
    "Can we take a photo? For me. Not for the internet.", "We should get a picture. For when we're old and boring.", "One photo. I'll delete it if it's terrible." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Of course. Come here.", "Yes. Closer. There."], r: ["...That's a good one. Look at us.", "...Oh, I like that one."], then: { say: ["Can I post it?", "It's a really nice one. Can I put it up?"], opts: [
        { tone: 'kind', fx: 'invite', t: ["Go on. I don't mind who sees.", "Post it. I'm proud of it."], r: ["...Okay. Done.", "Done. Everyone's going to see."] },
        { tone: 'firm', fx: 'cover', t: ["Can we keep it ours for now?", "Not yet. When we're ready."], r: ["...Okay. Ours.", "Okay. When we're ready."] },
        { tone: 'light', t: ["Only with a very good caption.", "Only if you crop out my hair."], r: ["Ha. I'll think of something.", "Ha. Your hair's fine."] } ] } },
      { tone: 'firm', fx: 'cover', t: ["Just for you, though. Not online. Not yet.", "One for us. Nobody else."], r: ["...Not online. Okay.", "Just for us. Okay."] },
      { tone: 'light', t: ["Only if I can do my podium face.", "Wait - let me find my good side. It's the helmet."], r: ["Ha. Go on, then.", "Ha. Stop it."] },
      { tone: 'flirt', fx: 'flirt', t: ["One photo, and I get a copy.", "Only if I can keep one on my phone."], r: ["Deal.", "...Deal."] },
    ] },
  // ---- the cameras (a low-privacy place) ------------------------------------------------------------------------------------------------------
  { id: 'cPaps', who: ['celeb'], w: 3, when: (x, n) => calm(x, n) && rom(n) && typeof x.privacy === 'number' && x.privacy < 0.5, open: [
    "There's a man with a camera across the road. Don't look.", "Someone just took a photo of us. I'm sure of it.", "This place is lovely, but it's very... visible." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Want to go somewhere quieter? Your call.", "Say the word and we'll move."], r: ["...Not yet. Let them look.", "...Maybe. In a bit."], then: { say: ["And if it's in the papers tomorrow?", "What if they print it?"], opts: [
        { tone: 'kind', t: ["Then it's a nice photo of us.", "Then everyone sees I'm lucky."], r: ["...Okay. Yes.", "...Smooth."] },
        { tone: 'firm', fx: 'cover', t: ["Then we were talking about a charity event.", "Then it was a work dinner. Very boring."], r: ["...If you say so.", "Hm. Okay."] },
        { tone: 'light', t: ["Then I hope they got my good side.", "Then my mum will finally have a nice photo."], r: ["Ha. You haven't got one.", "Ha. True."] } ] } },
      { tone: 'firm', fx: 'cover', t: ["[Hold the menu up] Just two friends having a meeting. Very boring.", "Sit back a bit. From over there we're two people discussing a charity gala."], r: ["Ha. Very convincing.", "Ha. Riveting."] },
      { tone: 'firm', t: ["Let them. We're not doing anything wrong.", "Let them look. I don't care."], r: ["...You're right. We're not.", "...Good."] },
      { tone: 'flirt', fx: 'flirt', t: ["Then let's give them a good photo.", "Then smile. You look great."], r: ["Behave.", "...Stop it."] },
    ] },
  // ---- an ex: friends, maybe ---------------------------------------------------------------------------------------------------------------
  { id: 'cExCoffee', who: ['celeb'], w: 8, when: (x, n) => calm(x, n) && st(n) === 'ex', open: [
    "This is strange, isn't it? Good strange, I think.", "I wasn't sure I'd come. I'm glad I did. I think.", "Friends, then. We can do friends. Can't we?" ],
    opts: [
      { tone: 'kind', t: ["I'd like that. Friends. Properly.", "We can. I'd like to try."], r: ["...Okay. Friends.", "Okay. Me too."], then: { say: ["Are you happy? Honestly?", "Are you doing alright?"], opts: [
        { tone: 'kind', t: ["Getting there. I hope you are too.", "Mostly. I hope you are."], r: ["Getting there. Yeah.", "...Mostly. Yeah."] },
        { tone: 'firm', t: ["I'm fine. Busy with the season.", "Focused. That's enough for now."], r: ["Good. That's good.", "Okay."] },
        { tone: 'light', t: ["I've taken up whistling. Badly.", "My engineer says I'm 'emotionally available'. He means for debriefs."], r: ["Ha. Still can't, then.", "Ha. Of course he does."] } ] } },
      { tone: 'sorry', fx: 'deep', t: ["I'm sorry for how it ended. I handled it badly.", "I owe you an apology. A proper one."], r: ["...Thank you. That helps.", "...Okay. Thank you."] },
      { tone: 'flirt', fx: 'flirt', t: ["I miss you. Is that allowed?", "You look really well. I've missed this."], r: ["Don't. Not yet. Maybe not ever.", "...Please don't."], m: -2 },
      { tone: 'firm', t: ["Let's just enjoy the coffee. No history.", "One coffee. No looking back."], r: ["No history. I can do that.", "Okay. One coffee."] },
    ] },
  { id: 'cExCatch', who: ['celeb'], w: 5, when: (x, n) => calm(x, n) && st(n) === 'ex', open: [
    "So how's the season going? Really, not the press version.", "I still watch the races, you know. Old habit.", "Tell me something good that's happened since. Anything." ],
    opts: [
      { tone: 'kind', t: ["Up and down. Better for seeing you, oddly.", "Good, mostly. The team's been brilliant."], r: ["...Oddly. Ha. Thanks.", "Good. I'm glad."], then: { say: ["And {herWork}? You haven't asked.", "You haven't asked about me yet."], opts: [
        { tone: 'kind', fx: 'charm', t: ["Sorry. Tell me. How's it going?", "You're right. Go on - I want to know."], r: ["...It's going well. Really well.", "...Okay. It's good. Thank you for asking."] },
        { tone: 'light', t: ["I was getting to it. Very slowly.", "I was saving it for dessert."], r: ["Ha. Of course you were.", "Ha. Sure."] },
        { tone: 'cold', t: ["I assumed you'd tell me.", "Didn't think you'd want to talk about it."], r: ["...Right.", "Hm. Okay."] } ] } },
      { tone: 'light', t: ["Something good: I finally learnt to fold a fitted sheet.", "I parked first time this morning. Big week."], r: ["Ha! Big news.", "Ha. Huge."] },
      { tone: 'firm', t: ["It's going fine. Focused on the racing.", "It's a long season. We'll see."], r: ["Okay. Good.", "Fair."] },
      { tone: 'cold', t: ["Do we have to talk about racing?", "I'd rather not, honestly."], r: ["...Fine.", "Okay."] },
    ] },

  // ---- the places, with her ---------------------------------------------------------------------------------------------------------------
  { id: 'cCook', who: ['celeb'], where: ['apartment'], w: 4, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "You're cooking? For me? I'm impressed already.", "What are we making? I'm a brilliant sous-chef. I stir with confidence.", "Your kitchen's suspiciously clean. Do you ever use it?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["My one proper dish. I've been practising all week.", "Something simple. I wanted you to have a quiet night."], r: ["All week? That's adorable.", "...That's really thoughtful."], then: { say: ["Can I help? Give me a job.", "Put me to work. I mean it."], opts: [
        { tone: 'kind', t: ["Chop the herbs. You're in charge of flavour.", "Taste everything. That's the most important job."], r: ["Flavour. I can do flavour.", "The best job. Thank you."] },
        { tone: 'flirt', fx: 'flirt', t: ["Stay right there and keep me company.", "Just stand there. You're very distracting, but stay."], r: ["...I can do that.", "Ha. Okay."] },
        { tone: 'firm', t: ["Just relax. Tonight's on me.", "Sit down. I've got this."], r: ["Okay. Bossy. I like it.", "Okay, chef."] } ] } },
      { tone: 'light', t: ["It's from a recipe video. I've watched it nine times.", "It's clean because I've never used it."], r: ["Ha! Nine times. Brave.", "Ha. Honest."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll cook, you sit there and look lovely.", "You stir with confidence, I'll cook with hope."], r: ["I can do that.", "Ha. Perfect team."] },
      { tone: 'show', t: ["Prepare to be amazed. I'm basically a chef.", "I'm a very good cook. You'll see."], r: ["Basically. Hm.", "Okay. Amaze me."] },
    ] },
  { id: 'cCandle', who: ['celeb'], where: ['restaurant'], w: 4, when: (x, n) => calm(x, n) && rom(n), open: [
    "Candles. A private room. You've gone to some trouble.", "I've never been anywhere this quiet with you. I like it.", "Is it strange that I'm nervous? We've done this before." ],
    opts: [
      { tone: 'flirt', fx: 'flirt', t: ["You're worth the trouble.", "Not strange. I'm nervous too. In a good way."], r: ["...Okay, that was good.", "...Good. Then we're even."], then: { say: ["What shall we order? You choose.", "You order for both of us. Surprise me."], opts: [
        { tone: 'kind', t: ["Whatever you'd like. Order everything.", "The things you'll love. Trust me."], r: ["Everything. Okay.", "...I do."] },
        { tone: 'light', t: ["The thing I can pronounce.", "Dessert first. It's the rules."], r: ["Ha. Fair.", "Ha. Good rules."] },
        { tone: 'firm', t: ["The fish. Trust me.", "The chef's choice. They know best."], r: ["Okay. The fish.", "Okay."] } ] } },
      { tone: 'kind', fx: 'charm', t: ["I wanted somewhere we could actually talk.", "I wanted one evening where nobody interrupts us."], r: ["Then let's talk.", "...Thank you. Really."] },
      { tone: 'light', t: ["I told them I was a food critic. Watch the service.", "The candles were included. I'm taking the credit."], r: ["Ha! You didn't.", "Ha. Fine. Credit given."] },
      { tone: 'show', t: ["Only the best table. They know me here.", "I booked the whole room. Obviously."], r: ["Hm. Do they?", "Obviously."] },
    ] },
  { id: 'cRoof', who: ['celeb'], where: ['rooftop'], w: 4, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "Look at it. The whole city, lit up like a stage.", "It's so loud down there and so quiet up here.", "Is that the circuit? Down there? Where you race?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["That's the straight. I'll think of tonight when I'm flat out down it.", "That's it. Funny seeing it from up here, all lit up."], r: ["...You'll think of me at three hundred an hour?", "It looks so small from here."], then: { say: ["Will you look up? When you go past here?", "Will you know where I am, from the car?"], opts: [
        { tone: 'kind', t: ["Every lap I can.", "I'll know. I always know where the people I care about are."], r: ["...Good.", "...Okay."] },
        { tone: 'light', t: ["I'll wave. My engineer will ask why.", "I'd flash my headlights, but we haven't got any. I'll think it at you."], r: ["Ha. Tell him it's me.", "Ha. Thinking counts."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'll be thinking about you either way.", "I'll be looking for this rooftop every lap."], r: ["...Concentrate, though.", "...Careful. Eyes on the road."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Best view in the city. And I don't mean the city.", "I'm not really looking at the city."], r: ["Ha! Terrible. Lovely. Terrible.", "...Stop it."] },
      { tone: 'light', t: ["Down there somewhere is the hotel where I lost my key card. Twice.", "It's like a giant pinball machine. And I'm the ball on race night."], r: ["Ha. Twice.", "Ha. Don't bounce off anything."] },
      { tone: 'firm', t: ["That's where I'll win on race night. Just there.", "That's the braking zone. I know every bump in it."], r: ["I'll hold you to that.", "Of course you do."] },
    ] },
  { id: 'cKart', who: ['celeb'], where: ['karting'], w: 4, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "Right. I've never done this. Go easy on me. Actually, don't.", "Do I get a head start? I feel like I deserve a head start.", "If I beat you, I'm telling everyone. Everyone." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Brake before the corner, not in it. You'll be flying.", "Look where you want to go, not at the wall. That's the whole secret."], r: ["Before, not in. Got it.", "Look where I want to go. Okay."], then: { say: ["Any last advice?", "What if I spin?"], opts: [
        { tone: 'kind', t: ["Smooth is fast. Don't fight it.", "Then you laugh and go again. Everyone spins."], r: ["Smooth. Okay.", "...Okay. Laugh and go again."] },
        { tone: 'light', t: ["Keep your elbows in. And your dignity.", "Then you blame the kart. That's what I do."], r: ["Ha. The dignity's gone already.", "Ha. Noted."] },
        { tone: 'flirt', fx: 'flirt', t: ["Don't look at me in your mirrors. It's distracting.", "Enjoy it. I'll be right behind you. Admiring the view."], r: ["Ha! I'll try.", "...Behave."] } ] } },
      { tone: 'show', t: ["You'd need a head start of about a lap.", "Head start? Take two. Won't matter."], r: ["Oh, it's on.", "Wow. Okay. It's on."] },
      { tone: 'light', t: ["If you beat me, I'm retiring. Today.", "If you beat me, I'll tell everyone myself."], r: ["Ha. Deal.", "Ha. Deal. Loudly."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll let you win. Probably.", "I'll be right behind you. Purely for the view."], r: ["Don't you dare let me win.", "...Behave."] },
    ] },
  { id: 'cPub', who: ['celeb'], where: ['pub'], w: 4, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "This is the most British place I've ever been. I love it.", "There's a dog asleep by the fire. I'm not leaving.", "They asked if I wanted 'the usual'. I've never been here in my life." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I knew you'd like it. It's my favourite place near the circuit.", "I wanted to show you somewhere real. No velvet ropes."], r: ["I can see why.", "...I love that. Thank you."], then: { say: ["What do you order here? I want the most local thing.", "What's good? Don't say salad."], opts: [
        { tone: 'kind', t: ["The pie. Always the pie.", "Whatever the landlord recommends. He's never wrong."], r: ["Pie it is.", "Okay. Trusting the landlord."] },
        { tone: 'light', t: ["Something with gravy. Everything with gravy.", "The sticky toffee pudding. Then another one."], r: ["Ha. Perfect.", "Ha. Two puddings. Yes."] },
        { tone: 'flirt', fx: 'flirt', t: ["Two spoons and one pudding.", "Order two of everything. I'm not sharing you with anyone else tonight."], r: ["...Okay. One pudding.", "Ha. Greedy."] } ] } },
      { tone: 'light', t: ["The dog's the landlord. We all answer to the dog.", "'The usual' means they like you. Very rare."], r: ["Ha. I'll be nice to him.", "Ha. Good."] },
      { tone: 'flirt', fx: 'flirt', t: ["You fit right in. Everyone's looking at you.", "Best-looking person this pub's ever had in. Fact."], r: ["They're looking at you, racing driver.", "Ha. The dog's quite handsome."] },
      { tone: 'firm', t: ["Proper food, no fuss. That's the whole appeal.", "Good food, a fire, nobody bothering us."], r: ["I can see that.", "Perfect."] },
    ] },
  { id: 'cSimRig', who: ['celeb'], where: ['simlounge'], w: 4, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "Teach me to drive one of these. I'll probably crash it. Into nothing.", "So this is where you spend your evenings? Sitting in a fake car?", "Is it embarrassing if I'm better at this than you?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Sit here. Hands at quarter to three. Gentle on the brake.", "Here - seat forward a bit. Now squeeze the throttle, don't stamp."], r: ["Quarter to three. Got it. ...Oh, it moves!", "Squeeze. Okay. ...Oh! It's actually hard."], then: { say: ["Is this what you do all week?", "Do you actually learn things on these?"], opts: [
        { tone: 'firm', t: ["Hours of it. It's how we learn the tracks.", "Every corner of every circuit. Before we ever get there."], r: ["That's mad.", "Every corner. Wow."] },
        { tone: 'light', t: ["Mostly I lose to teenagers online.", "Mostly I shout at it."], r: ["Ha. Humbling.", "Ha. I can see that."] },
        { tone: 'kind', fx: 'deep', t: ["It's where I go to think, honestly.", "It's quiet in there. Just me and a lap."], r: ["...I get that.", "I like that."] } ] } },
      { tone: 'show', t: ["Watch me first. Learn from the best.", "Embarrassing for you. Not for me."], r: ["Hm. Go on, then.", "We'll see."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll sit right next to you and coach.", "If you're better than me, I'll buy dinner. Either way, I'm buying dinner."], r: ["...Okay. Coach me.", "Ha. Sneaky."] },
      { tone: 'light', t: ["The crash button's the one you'll find on your own.", "If you crash, blame the set-up. That's what we do."], r: ["Ha. Very helpful.", "Ha. Noted."] },
    ] },

  // =====================================================================================================================
  // the sneaky side: more than one of them (fictional drama, PG - she notices, she asks, and she can walk out)
  // =====================================================================================================================
  // ---- a secret date ------------------------------------------------------------------------------------------------------------------
  { id: 'cSecret', who: ['celeb'], w: 6, when: (x, n) => calm(x, n) && sneaky(x, n) && rom(n), open: [
    "Nobody knows we're here, do they? It's quite exciting. And quite strange.", "I keep looking at the door. Is that silly?", "Are we ever going to go somewhere with windows?" ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I just want something that's ours for a while. Away from all of it.", "I like that this is just ours. For now."], r: ["...Okay. I get that.", "...For now."], then: { say: ["But not for ever. Right?", "How long do we keep doing this? The back doors and the private rooms?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["Not for ever. I promise.", "Not much longer. I want to do this properly."], r: ["...Okay. I'm holding you to that.", "Properly. Okay."] },
        { tone: 'firm', fx: 'cover', t: ["When the time's right. The press would make it a circus.", "Until the season calms down. It's better for both of us."], r: ["...The season never calms down.", "...Okay. If you say so."] },
        { tone: 'sorry', fx: 'confess', t: ["There's something I should have told you. There's someone else. I'm sorry.", "You deserve the truth. I'm seeing someone else as well."], r: ["...Thank you for telling me. I need a minute.", "...Right. I think I knew. I hate that I knew."], m: -2 },
        { tone: 'flirt', fx: 'flirt', t: ["Don't you like having a secret?", "Isn't it a bit fun, though? Just us?"], r: ["...A bit. Not for ever.", "...A bit."] } ] } },
      { tone: 'light', t: ["Windows are overrated. This place has a lovely wall.", "It's not silly. That door's very suspicious."], r: ["Ha. It is a lovely wall.", "Ha. Stop it."] },
      { tone: 'firm', fx: 'cover', t: ["It's just easier with the press. It's nothing to do with you.", "The photographers would never leave us alone. This is better."], r: ["...Okay. If you say so.", "...Is it, though?"] },
      { tone: 'flirt', fx: 'flirt', t: ["Somewhere secret suits us.", "I like having you all to myself."], r: ["Hm. It does, a bit.", "...Careful."] },
    ] },
  // ---- she knows about your public partner -------------------------------------------------------------------------------------------------
  { id: 'cTheOther', who: ['celeb'], w: 7, when: (x, n) => calm(x, n) && otherHer(x, n) && rom(n), open: [
    "Does {partner} know you're here tonight?", "I saw {partner} in a magazine this morning. Smiling. With you.", "I'm not stupid. I know about {partner}. What I don't know is what this is." ],
    opts: [
      { tone: 'firm', fx: 'cover', t: ["She thinks I'm at the simulator. It's... complicated.", "It's complicated with {partner}. It's not what it looks like."], r: ["Complicated. That's one word for it.", "It's exactly what it looks like."], then: { say: ["So what am I? The simulator?", "So where does that leave me?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["You're the best part of my week. I mean that.", "Somewhere I want to be. That's the truth."], r: ["...That's not an answer. But it's nice.", "...That's not an answer."] },
        { tone: 'firm', fx: 'cover', t: ["You're the one I'd choose. I just need time.", "Give me a little time. I'll sort it out."], r: ["...Time. Everyone always needs time.", "...Don't make me wait too long."] },
        { tone: 'sorry', fx: 'confess', t: ["I don't know. That's the honest answer. I'm sorry.", "I don't know, and that isn't fair on you."], r: ["...At least it's honest.", "...No. It isn't."] },
        { tone: 'cold', t: ["Do we have to do this tonight?", "Can we not? Please?"], r: ["Yes. Actually. We do.", "No. We need to."], m: -3 } ] } },
      { tone: 'sorry', fx: 'confess', t: ["No. She doesn't. And I hate that. You deserve better than a secret.", "No. And that's on me, not you."], r: ["...At least you said it out loud.", "...Yes. It is."] },
      { tone: 'firm', t: ["That's between me and her. This is between me and you.", "Let's keep her out of tonight."], r: ["That's not how it works, and you know it.", "She's in it whether you like it or not."], m: -2 },
      { tone: 'flirt', fx: 'flirt', t: ["Tonight I'm only thinking about you.", "Right now there's nobody else in the room."], r: ["That's a line. A good one. Still a line.", "...That's not what I asked."], m: -1 },
    ] },
  // ---- the phone that will not stop buzzing ----------------------------------------------------------------------------------------------------
  { id: 'cWhoTexting', who: ['celeb'], w: 14, when: (x, n) => calm(x, n) && !!x.buzz && rom(n), open: [
    "Who keeps texting you? That's the fourth time.", "Your phone's buzzed all night. Someone really wants you.", "Go on, answer it. I don't mind. ...I do mind a bit." ],
    opts: [
      { tone: 'firm', fx: 'cover', t: ["My engineer. Tyre pressures. He never sleeps.", "Work. The team's sending me data."], r: ["At this hour? Wow. Dedicated.", "Data. Right."], then: { say: ["Can I see?", "Show me, then."], opts: [
        { tone: 'light', fx: 'cover', t: ["Only if you want to read about tyre pressures for an hour.", "Trust me, it's graphs. Hundreds of graphs."], r: ["...Fine. Keep your graphs.", "...Fine."] },
        { tone: 'kind', fx: 'charm', t: ["[Switch the phone off] There. Tonight's just us.", "[Put the phone away] Forget the data. You've got my attention."], r: ["...Okay. That was nice.", "...Good."] },
        { tone: 'sorry', fx: 'confess', t: ["...No. And you should know why. I'm seeing someone else. I'm sorry.", "No. Because it isn't work. I'm sorry. There's someone else."], r: ["...Wow. Okay. Thank you for not lying to my face. I need some air.", "...I knew it. I hate that I knew it."], m: -2 },
        { tone: 'cold', t: ["No. It's private.", "No."], r: ["...Private. Right.", "...Right."], m: -3 } ] } },
      { tone: 'kind', fx: 'charm', t: ["[Switch the phone off] There. It's just you and me tonight.", "[Put the phone in your pocket] Sorry. You've got all of me now."], r: ["...Okay. That was nice.", "...Good."] },
      { tone: 'sorry', fx: 'confess', t: ["I owe you the truth. There's someone else. I'm sorry.", "I can't lie to you about this. I'm seeing someone else."], r: ["...Thank you for not lying to my face. I don't know what happens now.", "...Okay. Okay. I need to think."], m: -2 },
      { tone: 'light', fx: 'cover', t: ["My mum. She's got opinions about my qualifying.", "The team group chat. Someone's sharing photos of a cake."], r: ["Your mum. At this time of night. Okay.", "...A cake. Right."] },
    ] },
  // ---- she has started to wonder --------------------------------------------------------------------------------------------------------------
  { id: 'cHints', who: ['celeb'], w: 6, when: (x, n) => calm(x, n) && rom(n) && !x.buzz && sus(n) >= 30 && sus(n) < 60, open: [
    "You've been a bit... distant lately. Is everything alright?", "Someone said they saw you out last week. I said they were wrong. Were they?", "You never say where you are on Thursdays. I've noticed." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'm sorry. It's been a mad few weeks. I'm here now.", "You're right. I've been all over the place. I'm here."], r: ["...Okay. Be here, then.", "...Okay. Good."] },
      { tone: 'firm', fx: 'cover', t: ["The simulator. It's always the simulator.", "Team stuff. Endless team stuff."], r: ["...Right. The simulator.", "...Right."], then: { say: ["You'd tell me, wouldn't you? If there was something?", "There's nothing I should know about?"], opts: [
        { tone: 'firm', fx: 'cover', t: ["Course I would. There's nothing to tell.", "Nothing. I promise."], r: ["...Okay.", "...Okay. I believe you."] },
        { tone: 'sorry', fx: 'confess', t: ["...I would. And there is. I'm sorry - I should have said sooner.", "There is something. I'm sorry. I'm seeing someone else."], r: ["...I had a feeling. Thank you for telling me.", "...Right. Thank you for saying it, at least."], m: -2 },
        { tone: 'kind', fx: 'cover', t: ["Always. You've got nothing to worry about.", "You can always ask me. Always."], r: ["Okay. Good.", "...Okay."] } ] } },
      { tone: 'sorry', fx: 'confess', t: ["You're right to ask. I haven't been straight with you.", "I owe you an honest answer. There's someone else."], r: ["...I had a feeling. Go on, then. All of it.", "...Okay. Thank you. That hurts, but thank you."], m: -2 },
      { tone: 'light', fx: 'cover', t: ["Thursdays I'm in a secret choir. Don't tell anyone.", "Thursdays are for the sim. And snacks. Mostly snacks."], r: ["...Ha. Fine. Keep your secrets.", "...Snacks. Okay."] },
    ] },
  // ---- the question you cannot dodge for ever ---------------------------------------------------------------------------------------------------
  { id: 'cHonest', who: ['celeb'], w: 12, when: (x, n) => calm(x, n) && rom(n) && sus(n) >= 60, open: [
    "I need you to be honest with me. Is there someone else?", "I'm going to ask once and I want the truth. Are you seeing someone?", "People are talking. I don't want to hear it from them. I want to hear it from you." ],
    opts: [
      { tone: 'sorry', fx: 'confess', t: ["Yes. I should have told you. I'm sorry.", "Yes. There is. You deserved to hear it from me first."], r: ["...Thank you for not lying. I need to think.", "...Okay. Thank you. I don't know what happens now."], m: -2 },
      { tone: 'firm', fx: 'cover', t: ["No. There's no one else. It's you.", "Nobody. People talk rubbish."], r: ["...I want to believe that.", "...Okay. I'll believe you. This time."], then: { say: ["Look at me and say it again.", "Then say it again. Slowly. Looking at me."], opts: [
        { tone: 'firm', fx: 'cover', t: ["There's no one else.", "It's you. Only you."], r: ["...Okay. Okay. Don't ever make me ask again.", "...Okay. I'm choosing to believe you."] },
        { tone: 'sorry', fx: 'confess', t: ["...I can't. I'm sorry. There is someone.", "I can't say it again. Because it isn't true. I'm sorry."], r: ["...Thank you for stopping. I'm going to go.", "...I knew it. At least you couldn't do it twice."], m: -2 },
        { tone: 'kind', fx: 'cover', t: ["[Take her hand] I'm here. With you. Tonight and after.", "You've got nothing to worry about. I mean that."], r: ["...That isn't quite what I asked. But okay.", "...Okay."] },
        { tone: 'cold', end: true, t: ["I've answered you. I'm not doing it twice.", "I'm not on trial."], r: ["No. You're not. Goodnight.", "...Right. Goodnight."], m: -4 } ] } },
      { tone: 'light', fx: 'cover', t: ["The papers make things up. You know that better than anyone.", "Someone else? I barely have time for you."], r: ["Don't. Don't make a joke of this.", "...That's not funny."], m: -3 },
      { tone: 'cold', end: true, t: ["I'm not doing this tonight.", "I don't have to answer that."], r: ["Then I am. Goodnight.", "No. You don't. Goodnight."], m: -4 },
    ] },
  // ---- her rule (you are seeing someone else; she does not know) -------------------------------------------------------------------------------
  { id: 'cRules', who: ['celeb'], w: 4, when: (x, n) => calm(x, n) && st(n) === 'dating' && (x.seeing || 0) >= 2 && (n.free || 0) < 0.6 && sus(n) < 60, open: [
    "Just so we're clear: I don't do sharing. If there's someone else, I'm out.", "I've been messed around before. I'm not doing it again. Okay?", "One rule. Be honest with me. That's it. That's the rule." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["That's fair. You deserve that.", "Understood. That's completely fair."], r: ["Good.", "Good. Then we're fine."] },
      { tone: 'sorry', t: ["Then I need to tell you something now, before this goes any further.", "Then there's something you should hear from me. Tonight."], r: ["...Okay. That doesn't sound good.", "...Go on."], then: { say: ["Go on. I'm listening.", "Go on."], opts: [
        { tone: 'sorry', fx: 'confess', t: ["I've been seeing someone else. It isn't fair on you.", "There's someone else. I should have said at the start."], r: ["...Right. Thank you for telling me. I'm going to go home.", "...Okay. I need some time."], m: -2 },
        { tone: 'sorry', fx: 'confess', t: ["There's someone else. I'm ending it. This week.", "I've been seeing someone. It stops now. I promise."], r: ["...Then end it. And then call me. Not before.", "...We'll see. Prove it."] },
        { tone: 'firm', fx: 'cover', t: ["...Actually, it's nothing. Forget it.", "Never mind. It's nothing."], r: ["You can't say that and then say nothing.", "...Right. Nothing."], m: -3 } ] } },
      { tone: 'firm', fx: 'cover', t: ["There's no one else. You don't need to worry.", "You don't need to worry about that with me."], r: ["Good. Then we're fine.", "Good."] },
      { tone: 'light', fx: 'cover', t: ["Honest? I once said I liked olives. That's my whole record.", "Honesty's easy. Ask me anything. Except my lap times."], r: ["Ha. Olives. Okay.", "Ha. Noted."] },
    ] },
  // ---- she does not need you to be hers alone (her trait) - only not to be lied to ----------------------------------------------------------------
  { id: 'cFree', who: ['celeb'], w: 4, when: (x, n) => calm(x, n) && rom(n) && (n.free || 0) >= 0.6 && (x.seeing || 0) >= 2, open: [
    "I'm not looking for anything serious. I just like you. Is that okay?", "I don't need to know where you are every night. Just don't lie to me if I ask.", "I'm not the jealous type. I'm the 'don't make a fool of me' type." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["That's okay. And I won't lie to you.", "I like that. And you'll always get the truth."], r: ["Good. That's all I want.", "Good."], then: { say: ["So go on, then. Truth: is there anyone else?", "Then I'll ask. Just once. Is there someone else?"], opts: [
        { tone: 'sorry', fx: 'confess', t: ["Yes. There is. I'd rather you heard it from me.", "There is. I'm sorry I didn't say so sooner."], r: ["...Okay. Thank you. That's how this works. I'm still here.", "...Thank you. I mean it. Honest is all I asked for."] },
        { tone: 'firm', fx: 'cover', t: ["No. Just you.", "Nobody. Promise."], r: ["Okay. Remember you said that.", "Good. Then we're fine."] },
        { tone: 'light', fx: 'cover', t: ["Only my engineer. We're very close.", "My simulator. It's needy."], r: ["Ha. That's not an answer. But fine.", "...Ha. Okay."] } ] } },
      { tone: 'sorry', fx: 'confess', t: ["Then you should know - I'm seeing someone else too.", "In that case, honestly: there's someone else as well."], r: ["...Okay. Thank you. That's... actually fine, I think. Just don't let me find out from a magazine.", "...Thank you for telling me. That's how this works."] },
      { tone: 'flirt', fx: 'flirt', t: ["I like you too. A lot.", "Simple suits me. I like you."], r: ["Good. Keep it simple.", "Good."] },
      { tone: 'firm', fx: 'cover', t: ["There's nothing to lie about.", "You'll never need to ask."], r: ["Hm. Good.", "Hm. Okay."] },
    ] },

  // =====================================================================================================================
  // her, in a grave week, or grieving herself: nothing but kindness (quiet)
  // =====================================================================================================================
  { id: 'cQuiet', who: ['celeb'], w: 6, quiet: true, when: (x, n) => !!x.grave && !n.grieving, open: [
    "I wasn't sure if you'd still want to come. After this week.", "I'm so sorry about what happened. We don't have to talk.", "I just wanted to see that you're alright." ],
    opts: [
      { tone: 'kind', t: ["Thank you for being here. It helps more than I can say.", "I'm glad you came. Really."], r: ["Of course.", "Of course I came."], then: { say: ["Is there anything you need?", "What can I do?"], opts: [
        { tone: 'kind', t: ["Just this. Quiet company.", "Nothing. Being here is enough."], r: ["I can do that.", "Then I'll stay."] },
        { tone: 'firm', t: ["Time, I think.", "Just some time."], r: ["Take all of it.", "Take as long as you need."] },
        { tone: 'kind', fx: 'deep', t: ["Talk about something ordinary for a bit.", "Tell me about your week. Something normal."], r: ["Okay. Something ordinary. I burnt the toast this morning. Twice.", "Okay. Something normal. I've been learning a new recipe."] },
        { tone: 'cold', t: ["Nothing. But thank you.", "I don't know."], r: ["Okay.", "That's alright."], m: 0 } ] } },
      { tone: 'kind', fx: 'deep', t: ["It's been a hard week. I'm glad you're here.", "I keep thinking about the family. I'm glad I'm not on my own tonight."], r: ["I'm not going anywhere.", "...Of course. Me too."] },
      { tone: 'firm', t: ["I'm alright. I'll be alright.", "Getting through it. Thank you for asking."], r: ["Okay. I'm here if you're not.", "Okay."] },
      { tone: 'cold', t: ["I'd rather not talk tonight.", "Can we just sit?"], r: ["That's fine. We'll just sit.", "Of course."], m: 0 },
    ] },
  { id: 'cQuietWalk', who: ['celeb'], w: 5, quiet: true, when: (x, n) => !!x.grave && !n.grieving, open: [
    "Shall we just walk for a bit? We don't have to say anything.", "I brought you a coffee. I didn't know what else to do.", "Everyone's being so careful around you. I'll just be normal. Is that okay?" ],
    opts: [
      { tone: 'kind', t: ["I'd like that.", "Thank you. That's kind."], r: ["Okay.", "Of course."], then: { say: ["How's the team? Is everyone holding up?", "How is everyone at the track?"], opts: [
        { tone: 'kind', t: ["They're looking after each other. It's good to see.", "Quiet. Kind to each other."], r: ["Good.", "Good. That matters."] },
        { tone: 'firm', t: ["Working. It's how we get through it.", "Getting on with it, carefully."], r: ["I understand.", "Of course."] },
        { tone: 'kind', fx: 'deep', t: ["It's hard. Everyone's hurting. But nobody's on their own.", "Everyone's struggling. We're leaning on each other."], r: ["...That's something.", "...That's how it should be."] } ] } },
      { tone: 'firm', t: ["Normal's good. Normal's what I need.", "Normal, please. That's exactly right."], r: ["Normal it is.", "Okay. Normal."] },
      { tone: 'kind', fx: 'deep', t: ["I keep thinking about the family. I can't stop.", "I keep thinking about the people at home."], r: ["...Of course you do. That's the right thing to think about.", "...Of course."] },
      { tone: 'cold', t: ["Can we just sit?", "I'm not up to much tonight."], r: ["Of course.", "That's alright."], m: 0 },
    ] },
  { id: 'cGrieving', who: ['celeb'], w: 8, quiet: true, when: (x, n) => !!n.grieving, open: [
    "Thank you for the coffee. I haven't been out since... well. Since.", "Everyone treats me like I might break. You don't. Thank you.", "I keep thinking about everything. Is that alright to say?" ],
    opts: [
      { tone: 'kind', t: ["Of course it is. Say whatever you need to.", "You can say anything here."], r: ["...Thank you.", "...Thank you."], then: { say: ["Do you think it gets easier?", "Does it get easier, do you think?"], opts: [
        { tone: 'kind', t: ["I think it gets different. Slowly.", "I think it changes shape. Slowly."], r: ["Different. Yeah. I think so.", "...Slowly. Okay."] },
        { tone: 'kind', t: ["I don't know. But you won't be on your own with it.", "I don't know. I'll be around, though."], r: ["...Thank you.", "...That helps."] },
        { tone: 'firm', t: ["People say so. I hope they're right.", "I hope so. For you."], r: ["Me too.", "Me too."] },
        { tone: 'cold', t: ["I don't know.", "I'm not sure anyone knows."], r: ["No. Nobody does.", "No."], m: 0 } ] } },
      { tone: 'firm', t: ["Whatever you need, the paddock's still here for you.", "Everyone at the track still asks after you."], r: ["I know. I can feel it.", "...That's kind of them."] },
      { tone: 'kind', fx: 'deep', t: ["We don't have to talk about anything. I'm just glad you came.", "No pressure tonight. Just company."], r: ["Me too.", "...Company. Yes."] },
      { tone: 'cold', t: ["I'm not very good at this. Sorry.", "I don't really know what to say."], r: ["Nobody is. It's alright.", "You don't have to say anything."], m: 0 },
    ] },
  { id: 'cGrievingTalk', who: ['celeb'], w: 6, quiet: true, when: (x, n) => !!n.grieving, open: [
    "Tell me something ordinary. Please. Anything.", "Can we talk about something else for a bit? Not because I want to forget. Just for a bit.", "I went for a walk this morning. First time in a while. It helped." ],
    opts: [
      { tone: 'kind', t: ["Of course. Anything you like.", "Of course. Let's talk about anything."], r: ["...Thank you.", "...Thank you."], then: { say: ["What's the most ordinary thing you did this week?", "Tell me about your week. The boring bits."], opts: [
        { tone: 'kind', t: ["Watered a plant that might be fake. I'm still not sure.", "Burnt some toast. Opened a window. Started again."], r: ["...That's exactly what I needed.", "...That's perfect. Thank you."] },
        { tone: 'kind', t: ["Went for a walk with no phone. Like you.", "Sat in a park for an hour. Did nothing."], r: ["...Good. We should both do more of that.", "...That sounds nice."] },
        { tone: 'firm', t: ["Trained, slept, trained. Very boring.", "Work, mostly. Same as always."], r: ["Boring sounds nice.", "Same as always. Good."] } ] } },
      { tone: 'kind', fx: 'deep', t: ["A walk helps. Little steps.", "That's good. One small thing at a time."], r: ["Little steps. Yeah.", "One thing at a time."] },
      { tone: 'firm', t: ["Whatever helps. There's no right way to do this.", "There's no wrong way through it."], r: ["...Thank you for saying that.", "...Thank you."] },
      { tone: 'cold', t: ["I'm not sure what to say.", "I don't know what to talk about."], r: ["You don't have to say anything.", "That's alright."], m: 0 },
    ] },

  // =====================================================================================================================
  // the twelve, one each: the things only she would bring up (career/Celebs.js has who they are)
  // =====================================================================================================================
  // ---- Mira Vale, singer: the sea at home in Cork, the residency, a song on a plane ----------------------------------------------------------
  { id: 'sigMira', who: ['celeb'], w: 6, crowd: true, when: own('mira-vale'), open: [
    "I swam in the sea at home last week. Cork, in October. I've never been so awake.", "I wrote half a song on the plane. It's about waiting for someone. Don't read into it.", "I've done the residency every night this week. Same song a hundred times, and I still well up at the bridge." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Cold-water swimming? You're braver than any driver I know.", "In October? That's properly brave."], r: ["It's the only thing that switches my head off.", "It's the only time my head goes quiet."], then: { say: ["Would you come in with me one day? I'll warn you now, it's freezing.", "Come swimming at home with me some time? You'll scream. Everyone screams."], opts: [
        { tone: 'kind', fx: 'invite', t: ["Yes. Scream included.", "I'd love to. I'll bring the towels."], r: ["Good. I'm holding you to it.", "Big towels. You'll need them."] },
        { tone: 'light', t: ["I'll hold your towel. Bravely. From the beach.", "I'll cheer from the car. With the heater on."], r: ["Ha! Coward.", "Ha. Coward."] },
        { tone: 'flirt', fx: 'flirt', t: ["For you, I'd go in the Atlantic in January.", "With you there? I'd manage."], r: ["...Careful. I'll take you up on that.", "...We'll see how brave you are."] },
        { tone: 'firm', t: ["After the season. My team would never forgive me now.", "In the winter. Not mid-season."], r: ["Winter. Even colder. Deal.", "Deal. Bring a hat."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Who's the song about, then?", "Waiting for someone? Anyone I know?"], r: ["I said don't read into it. ...Maybe.", "...Maybe."] },
      { tone: 'light', t: ["Same song a hundred times? Same lap a thousand times. We're the same.", "I well up at the chequered flag. Every single time."], r: ["Ha! We're both just going round in circles.", "Ha. Two softies."] },
      { tone: 'show', t: ["Put me in a song. I'm very lyrical.", "Write one about me. I'll make it a hit."], r: ["You're very something.", "Ha. The ego on you."] },
    ] },
  // ---- Lena Marsh, Olympic sprinter: the Mini, reaction times, a two-seater ---------------------------------------------------------------------
  { id: 'sigLena', who: ['celeb'], w: 6, crowd: true, when: own('lena-marsh'), open: [
    "My dad and I finally got the Mini running. A seventies Mini. It does sixty. Downhill.", "My best reaction off the blocks this season was one-three-eight. Anything under one hundred is a false start. What's yours off the lights?", "Be honest - would you take me round in a two-seater? I've been asking people for years." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["A seventies Mini? I'd love to see it.", "You restored it yourselves? That's brilliant."], r: ["You'd have to help push. It's part of the experience.", "Every bolt. Dad did the grumbling, I did the bolts."], then: { say: ["Have you ever built anything with your hands? Properly?", "What did you build, growing up? Everyone builds something."], opts: [
        { tone: 'kind', t: ["Karts. With my family, every weekend.", "Rebuilt a kart engine on the kitchen table. Nobody was thrilled."], r: ["See? Same thing.", "Ha. Kitchen-table engineering. The best kind."] },
        { tone: 'light', t: ["A flat-pack wardrobe. It leans.", "A sandwich. A very good one."], r: ["Ha. Everything leans a bit.", "Ha. It counts."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'd help with the Mini. If you're there.", "Show me the Mini. I'll hand you spanners."], r: ["Spanners and tea. Deal.", "...Deal."] },
        { tone: 'firm', t: ["No time. One day.", "No. Just cars I'm not allowed to touch."], r: ["One day, then.", "Ha. Fair."] } ] } },
      { tone: 'firm', t: ["About two tenths off the lights. You'd have me.", "Two tenths, on a good day. You'd win."], r: ["I'd have you. Every time.", "I'd win. But you'd have the car."] },
      { tone: 'flirt', fx: 'flirt', t: ["A two-seater? Absolutely. I'll even go gently.", "I'll take you round myself. Hold on tight."], r: ["Don't you dare go gently.", "...I'll hold on."] },
      { tone: 'show', t: ["Off the lights, I'm the quickest there is.", "Nobody beats me off the line."], r: ["Prove it. Lights out - the salt shaker.", "Ha. Race me to the door."] },
    ] },
  // ---- Sasha Ivers, film director: black-and-white film, the people nobody films --------------------------------------------------------------------
  { id: 'sigSasha', who: ['celeb'], w: 6, crowd: true, when: own('sasha-ivers'), open: [
    "I've been shooting black-and-white film all week. Real film. I develop it in the hotel bathroom.", "The documentary's nearly done. The riggers, the caterers, the crews who build a race overnight. Nobody films them.", "I notice everything, you know. You hold your fork like a steering wheel." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["The people nobody films - that's a film I'd watch.", "Tell me about them. The crews."], r: ["Then you'll be at the premiere.", "They're the best people I've ever filmed. Nobody thanks them."], then: { say: ["Who would you put in it? From your side of things?", "Who's the person in your team nobody ever sees?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["The mechanics. Up at four, home at midnight, never on TV.", "The truck crews. They build the garage before we arrive and take it down after we've gone."], r: ["Yes. Exactly them.", "...I'm writing that down."] },
        { tone: 'firm', t: ["The marshals. They're the reason we're safe out there.", "The marshals. Volunteers, most of them."], r: ["...Yes. They deserve a film.", "I didn't know that. They do."] },
        { tone: 'light', t: ["The coffee machine in our garage. The real hero.", "Our hospitality chef. Terrifying and wonderful."], r: ["Ha. A cameo, then.", "Ha. Introduce me."] },
        { tone: 'show', t: ["Me. I'm very photogenic.", "Just point it at me. Saves time."], r: ["...You'd be insufferable about it.", "Hm. No."] } ] } },
      { tone: 'light', t: ["The hotel bathroom? Housekeeping must love you.", "A fork like a steering wheel. ...I'm going to think about that all night now."], r: ["They've stopped knocking.", "Good. You should."] },
      { tone: 'flirt', fx: 'flirt', t: ["Take my picture. Black and white. Very moody.", "You notice everything? What have you noticed about me?"], r: ["You'd be insufferable about it. ...Maybe.", "...That you're nervous. And that it's sweet."] },
      { tone: 'cold', t: ["Film's a bit old-fashioned, isn't it?", "Isn't it easier on a phone?"], r: ["So's a steering wheel.", "Easier isn't better."], m: -2 },
    ] },
  // ---- Noor Haddad, fashion designer: sketching strangers, the jackets, your shoulders ------------------------------------------------------------------
  { id: 'sigNoor', who: ['celeb'], w: 6, crowd: true, when: own('noor-haddad'), open: [
    "I sketched four strangers in a café this morning. One was a mechanic from your team - I could tell by the hands.", "The race-jacket capsule sold out in an afternoon. I'm still in shock.", "Your jacket's the wrong cut for your shoulders. Sorry. I can't switch it off." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Show me the sketches?", "Can I see your sketchbook?"], r: ["...Only if you don't laugh.", "...Nobody sees the sketchbook. ...Fine. One page."], then: { say: ["Would you sit for me? Ten minutes. Stay still for once.", "Let me sketch you. Ten minutes. Don't fidget."], opts: [
        { tone: 'kind', t: ["For you, I'll sit still. It'll be a first.", "Go on. I'll try."], r: ["Good. Chin up.", "Good. Don't move."] },
        { tone: 'light', t: ["Ten minutes? I can't sit still for ten seconds.", "Only if you draw me taller."], r: ["Ha. I'll draw you fidgeting.", "Ha. Taller. Fine."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if I get to keep the sketch.", "As long as I get to watch you draw."], r: ["...Maybe.", "...That's distracting."] },
        { tone: 'firm', t: ["After the season. When I can sit.", "In the winter. I promise."], r: ["I'll hold you to it.", "Winter, then."] } ] } },
      { tone: 'light', t: ["The wrong cut? It came with the job. Free.", "Fix it, then. I'll stand very still."], r: ["It shows.", "Ha. Hold still."] },
      { tone: 'flirt', fx: 'flirt', t: ["Then dress me. I'm all yours.", "Design me something for the podium."], r: ["Careful. I'll take you up on that.", "Win something first."] },
      { tone: 'show', t: ["Everything looks good on me. Even this.", "I make this jacket look good."], r: ["Hm. Almost everything.", "The jacket makes you look adequate."] },
    ] },
  // ---- Ava Rennick, actress: climbing, her own stunts, the cereal advert ----------------------------------------------------------------------------------
  { id: 'sigAva', who: ['celeb'], w: 6, crowd: true, when: own('ava-rennick'), open: [
    "I went climbing this morning. Indoor wall. I've still got chalk on my hands.", "They let me do my own stunts on the last one. The insurers had a meltdown.", "I got recognised in a lift today. From a cereal advert I did at nineteen." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Climbing? Take me some time. I'll be terrible.", "Teach me to climb? I'm good at holding on."], r: ["You'd be fine. You're used to holding on.", "Ha. You'd be good. Strong hands."], then: { say: ["What's the scariest thing you've ever done? Outside the car.", "What scares you? Not racing. Life."], opts: [
        { tone: 'kind', t: ["Speaking at a school assembly. Five hundred children.", "Singing at a friend's birthday. Solo."], r: ["Ha. Terrifying.", "Ha. Braver than any stunt."] },
        { tone: 'flirt', fx: 'flirt', t: ["Asking you out, if I'm honest.", "This. Tonight. A bit."], r: ["...Stop it.", "...Good."] },
        { tone: 'firm', t: ["Not much. The car's the scary bit.", "Nothing off track comes close."], r: ["Hm. Brave.", "Of course."] },
        { tone: 'light', t: ["Eating something my engineer cooked.", "My first press conference. I said 'yeah' forty times."], r: ["Ha! Brave.", "Ha. I've seen it."] } ] } },
      { tone: 'light', t: ["A cereal advert? I need to see it. Now.", "Which cereal? I need to know which cereal."], r: ["Absolutely not. It's been destroyed.", "Ha. Never."] },
      { tone: 'show', t: ["Stunts? I do them at three hundred an hour every race weekend.", "My stunts are live. No second take."], r: ["Ha. Fine. You win. This once.", "...Okay, that's fair."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'd recognise you anywhere.", "I'd have recognised you in that lift too."], r: ["...Smooth. I've still got chalk on my hands, though.", "Ha. Would you?"] },
    ] },
  // ---- Jade Okafor, DJ: vinyl, pirate radio, the after-party ------------------------------------------------------------------------------------------------
  { id: 'sigJade', who: ['celeb'], w: 6, crowd: true, when: own('jade-okafor'), open: [
    "Found a box of old dub records in a shop this morning. Best fiver I've ever spent.", "I started on pirate radio at fifteen. Bedroom studio, aerial on the roof. Mum went mad.", "I'm playing the after-party on race weekend. Tell me your walk-on song. Everyone's got one." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Pirate radio at fifteen? That's brilliant.", "Tell me about the radio days."], r: ["It was illegal and brilliant.", "...Best years. Terrible sound. Best years."], then: { say: ["What's your guilty-pleasure song? I won't judge. I will judge.", "Guilty-pleasure song. Go. No lying."], opts: [
        { tone: 'light', t: ["A sea shanty. A long one.", "A boy band. A very big one."], r: ["Ha! I'm playing it.", "Ha. Judged."] },
        { tone: 'kind', t: ["Something from the car rides to karting.", "Something my family played on long drives."], r: ["Aw. That's the best kind.", "That counts. That's not guilty."] },
        { tone: 'show', t: ["My taste has no guilty pleasures. It's all perfect.", "Nothing. Everything I like is great."], r: ["Ha. Liar.", "Everyone's got one."] },
        { tone: 'flirt', fx: 'flirt', t: ["Whatever you'd put on for me.", "I'll tell you if you play it later."], r: ["...Careful.", "Deal."] } ] } },
      { tone: 'light', t: ["My walk-on song is the pit-lane speed-limiter beep.", "My walk-on song is my engineer saying 'copy'."], r: ["Ha! I'm sampling that.", "Ha. Beautiful."] },
      { tone: 'flirt', fx: 'flirt', t: ["Play me something after this. Just us.", "Save me one song at the after-party."], r: ["Careful. I might.", "...Maybe."] },
      { tone: 'cold', t: ["I don't really listen to much music.", "Music's not really my thing."], r: ["...Wow. I'm going to fix you.", "...I'll pretend I didn't hear that."], m: -1 },
    ] },
  // ---- Clara Voss, tennis champion: the notebook, the secret chess name, cards -------------------------------------------------------------------------------
  { id: 'sigClara', who: ['celeb'], w: 6, crowd: true, when: own('clara-voss'), open: [
    "I keep a notebook of every match I've ever lost. Every one. Is that unhealthy?", "I play chess online under a name nobody knows. Last night I lost to a twelve-year-old.", "Cards after dinner? I should warn you, I hate losing. At anything." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["A notebook of losses? That's why you win.", "That's not unhealthy. That's how champions think."], r: ["...That's the nicest thing anyone's said about it.", "...Okay. I like you."], then: { say: ["Do you keep one? Of the races you lost?", "Do you remember yours? Every one?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["In my head. Every one. Like you.", "Every one. They're the ones that teach you."], r: ["...I knew it.", "Yes. Exactly."] },
        { tone: 'firm', t: ["No. I let them go. Mostly.", "I keep the lessons. Not the races."], r: ["Mostly.", "Hm. Wise."] },
        { tone: 'light', t: ["Mine would need a bookshelf.", "Mine's a filing cabinet. It's full."], r: ["Ha. Honest.", "Ha."] },
        { tone: 'show', t: ["I don't lose often enough to need one.", "I'd need a very thin notebook."], r: ["Hm. Brave.", "We'll see about that at cards."] } ] } },
      { tone: 'light', t: ["A twelve-year-old? I'd retire.", "What's the secret name? I won't tell."], r: ["I nearly did.", "Never. Not even you."] },
      { tone: 'show', t: ["Cards? I'll take your coffee money.", "Deal me in. I don't lose either."], r: ["We'll see. I remember every card.", "Then one of us is in trouble."] },
      { tone: 'flirt', fx: 'flirt', t: ["Teach me chess. Slowly. Over several dinners.", "Play me at chess. If I lose, I buy dinner. If I win, I buy dinner."], r: ["...Several dinners. That's a long game.", "...You've thought about this."] },
    ] },
  // ---- Elena Marchetti, TV presenter: Sunday lunch for twenty, and she knows a line when she hears one ---------------------------------------------------------
  { id: 'sigElena', who: ['celeb'], w: 6, crowd: true, when: own('elena-marchetti'), open: [
    "Sunday lunch at mine is twenty people and four courses. You'd last about an hour.", "I can tell when a driver's giving me a line, you know. Within a sentence.", "My producer wants you on the show. I told him you're off duty. Are you off duty?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Twenty people? I'd love to come.", "Invite me. I'll last two hours. Maybe."], r: ["You'd be eaten alive. Lovingly.", "Ha. Two hours. Brave."], then: { say: ["What would you bring? Rules: you have to bring something.", "You'd have to bring something. What?"], opts: [
        { tone: 'kind', t: ["Something from home. A family recipe.", "Flowers for your mother. Obviously."], r: ["Good answer. She'd adore you.", "Ha. My mother would adopt you."] },
        { tone: 'light', t: ["A dessert from a shop, in a dish, pretending.", "My appetite. It's enormous."], r: ["Ha. Everyone does that.", "Ha. Perfect guest."] },
        { tone: 'flirt', fx: 'flirt', t: ["Myself. Is that enough?", "Just me, on my best behaviour."], r: ["...Hm. That was a line. A good one.", "...Your best behaviour. I'd like to see it."] },
        { tone: 'firm', t: ["Flowers, and my best manners.", "A very good bottle of sparkling water."], r: ["Good.", "Ha. Very rock and roll."] } ] } },
      { tone: 'light', t: ["Off duty. Ask me my favourite colour. It's a trap.", "Off duty. Unless there's cake on the show."], r: ["Ha! What is it?", "There's always cake."] },
      { tone: 'flirt', fx: 'flirt', t: ["Is this a line? You look wonderful tonight.", "Go on, then. Test this one: I've been looking forward to tonight all week."], r: ["...That one isn't. I'd know.", "...That one isn't. Annoyingly."] },
      { tone: 'firm', t: ["Ask me anything. No lines. Just answers.", "Test me. No lines tonight."], r: ["Dangerous offer.", "Okay. I will."] },
    ] },
  // ---- Priya Raman, model (and astrophysics student): the school, black holes, Saturn ------------------------------------------------------------------------------
  { id: 'sigPriya', who: ['celeb'], w: 6, crowd: true, when: own('priya-raman'), open: [
    "I'm back on the astrophysics coursework. Black holes. They're less complicated than the fashion industry.", "My charity's opening a new school next month. Girls who'd never have had the chance. I can't stop smiling.", "If you look past the lights tonight you can just about see Saturn. I checked before I came out." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["A new school? That's amazing. Tell me about it.", "Tell me about the school. All of it."], r: ["...You actually want to know? Okay. Brace yourself.", "...Okay. It's got a library. A proper one."], then: { say: ["Would you come and see it one day? The girls would go mad for a racing driver.", "Would you visit? It would mean a lot to them."], opts: [
        { tone: 'kind', fx: 'invite', t: ["I'd love to. Name the day.", "Yes. In the winter. I'll bring a helmet for them to try on."], r: ["...Really? Okay. I'm going to cry.", "...They'll lose their minds."] },
        { tone: 'light', t: ["Only if they promise not to ask how drivers go to the toilet.", "Only if they don't beat me at maths."], r: ["They will ask. Every one of them.", "They will. Badly."] },
        { tone: 'firm', t: ["After the season. I promise.", "Yes. Put it in the diary."], r: ["I'll hold you to that.", "Done."] } ] } },
      { tone: 'light', t: ["Black holes? I've got one in my bank account. It's called a sim rig.", "Less complicated than tyre strategy? I doubt it."], r: ["Ha! Terrible.", "Ha. Nothing's more complicated than tyre strategy."] },
      { tone: 'flirt', fx: 'flirt', t: ["You're the most interesting person I've ever met. It isn't close.", "Astrophysics and a charity. You make the rest of us look lazy. I don't mind."], r: ["...You've met a lot of people.", "...Okay. Keep going."] },
      { tone: 'firm', t: ["How far away is Saturn, then?", "Show me Saturn. How far is it?"], r: ["Over a billion kilometres. Its light takes more than an hour to reach us.", "More than a billion kilometres. You'd be seeing light that left it over an hour ago."] },
    ] },
  // ---- Tessa Kealoha, surfer: the board she shaped, the start that scares her ---------------------------------------------------------------------------------------
  { id: 'sigTessa', who: ['celeb'], w: 6, crowd: true, when: own('tessa-kealoha'), open: [
    "I shaped a new board last week. In my garage. It's the best thing I've ever made.", "People think waves are scary. Your race start's scarier. Twenty cars and one corner.", "I was in the water at dawn. I'm not built for evenings out. I'm doing my best." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Teach me to surf. I'll be hopeless.", "Show me how you shape a board one day?"], r: ["Everyone's hopeless. That's the fun.", "...You'd be covered in foam dust. I'd love it."], then: { say: ["Would you, though? Get in the water with me?", "Would you come out to the North Shore? In the winter?"], opts: [
        { tone: 'kind', fx: 'invite', t: ["In the winter. Yes.", "Yes. Teach me everything."], r: ["...Okay. I'm holding you to it.", "Everything takes years. We'll start with standing up."] },
        { tone: 'light', t: ["I'll stand on the beach and cheer. Loudly.", "I'll mind the towels. Professionally."], r: ["Ha! Coward.", "Ha. Coward."] },
        { tone: 'flirt', fx: 'flirt', t: ["If you hold my hand on the first wave.", "With you? I'd paddle out anywhere."], r: ["...Deal.", "...Careful. The sea's honest."] },
        { tone: 'firm', t: ["When the season's over. Promise.", "After the last race."], r: ["Promise accepted.", "Okay. After."] } ] } },
      { tone: 'light', t: ["The start's fine. It's Turn 1 that's scary.", "At least the sea doesn't have stewards."], r: ["Ha! Same with waves.", "Ha. Not wrong."] },
      { tone: 'show', t: ["I'd be good at surfing. I'm good at most things.", "Waves don't do three hundred an hour."], r: ["The ocean loves humbling people like you.", "You haven't seen the big ones."] },
      { tone: 'cold', t: ["Surfing's not really a sport, is it?", "Isn't it just standing on a board?"], r: ["Wow. Okay. Say that to a twenty-foot wave.", "...Come and try it, then."], m: -3 },
    ] },
  // ---- Maya Lindqvist, chef: foraging, two stars, your half-empty plate -------------------------------------------------------------------------------------------------
  { id: 'sigMaya', who: ['celeb'], w: 6, crowd: true, when: own('maya-lindqvist'), open: [
    "I went foraging this morning. Mushrooms. Don't worry - I know exactly which ones to leave alone.", "Two stars, and I still get nervous when somebody tastes my food.", "You've left half your plate. I've noticed. I always notice." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Show me how to forage some time? Carefully.", "Teach me? I'll do exactly what you say."], r: ["Carefully is the only way. Rule one: if you're not sure, you leave it.", "Good. Rule one: if you're not completely sure, you leave it."], then: { say: ["Would you come? It's early. Very early. And muddy.", "Come with me one morning? Bring boots."], opts: [
        { tone: 'kind', fx: 'invite', t: ["Early and muddy sounds perfect.", "Yes. I'll bring boots and coffee."], r: ["...Okay. Six o'clock.", "Coffee. Good. You can come."] },
        { tone: 'light', t: ["I'll bring wellies and terrible jokes.", "I'll carry the basket. I'm very good at carrying."], r: ["Ha. The jokes stay in the car.", "Ha. Basket duty, then."] },
        { tone: 'flirt', fx: 'flirt', t: ["With you? Any time.", "I'd get up at five for you."], r: ["Careful. I'll hold you to five.", "...Five. Okay."] },
        { tone: 'firm', t: ["After the season. I'll be there.", "In the winter. Promise."], r: ["Winter has its own. Fewer, but good.", "Okay. Winter."] } ] } },
      { tone: 'sorry', t: ["Sorry. I'll finish it. It's brilliant. I'm just nervous.", "Sorry - it's not the food. It's lovely. It's me."], r: ["Nervous? Of me? ...Good.", "...Okay. Forgiven. Eat."] },
      { tone: 'light', t: ["Half a plate? That's a nutritionist's plate. I'm being good.", "My nutritionist has spies. Possibly you."], r: ["Your nutritionist has no soul.", "Ha. I'm on your side."] },
      { tone: 'show', t: ["My cooking's better. Not in front of you, obviously.", "I'm a brilliant cook myself, you know."], r: ["Obviously. Prove it.", "Hm. Prove it."] },
    ] },
  // ---- Zoe Hartley, racing streamer: the rig (again), chat, Stowe ------------------------------------------------------------------------------------------------------------
  { id: 'sigZoe', who: ['celeb'], w: 6, crowd: true, when: own('zoe-hartley'), open: [
    "I'm rebuilding my sim rig. Again. Third time this year.", "My chat's convinced you brake too early at Stowe. I've defended you. Mostly.", "I did a lap of every circuit on the calendar this week. In my head. On the bus." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Tell your chat I'll work on my braking. For them.", "Tell me what chat says. All of it."], r: ["They'll clip that. They'll frame it.", "...You'll regret that. Okay. Turn 1 first."], then: { say: ["Race me on stream some time? Chat would lose their minds.", "Would you come on the stream? Just once?"], opts: [
        { tone: 'kind', fx: 'invite', t: ["Yes. Name the night.", "I'd love to. Fair warning: I'm rubbish with a controller."], r: ["...Chat's going to explode.", "Good. Chat loves rubbish."] },
        { tone: 'light', t: ["Only if chat promises to be nice.", "Only if I can blame the lag."], r: ["Ha. Chat promises nothing.", "Ha. Chat says no excuses."] },
        { tone: 'show', t: ["Yes. And I'll win.", "Yes. Bring your best lap."], r: ["Ha. Chat's clipping that already.", "Oh, it's on."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if it's just us. No chat.", "Yes. Loser buys dinner."], r: ["...Chat would hate that. I don't.", "Deal. Chat's screaming."] } ] } },
      { tone: 'light', t: ["Third time? Your rig's having a better season than me.", "Your rig's been rebuilt more times than our floor."], r: ["Ha! It's got better downforce than you, too.", "Ha. Rude. True."] },
      { tone: 'show', t: ["My braking's perfect. Chat's wrong.", "Tell chat I'll show them at Stowe."], r: ["Chat's never wrong. Chat's just loud.", "Ha. Chat's holding you to it."] },
      { tone: 'flirt', fx: 'flirt', t: ["You've been thinking about me on the bus?", "Every circuit? Which one was I on?"], r: ["...I was thinking about the lap. You were... on it.", "...All of them. Shut up."] },
    ] },

  // ---- her favourite kind of evening (the places that suit her) ------------------------------------------------------------------------------------------------------------
  // (Priya on the rooftop: the telescope)
  { id: 'sigPriyaRoof', who: ['celeb'], where: ['rooftop'], w: 9, when: own('priya-raman'), open: [
    "I brought a telescope. A small one. Look - just there, above the lights. That's Saturn.", "Saturn's out tonight. I set the telescope up before you got here.", "Up here you can almost forget the city. Almost. Look up." ],
    opts: [
      { tone: 'kind', fx: 'deep', t: ["I can see the rings. I didn't know you could, from a city.", "That's really Saturn? With the rings?"], r: ["Most people never look up.", "The rings. Every time, they get me."], then: { say: ["Doesn't it make everything feel small? In a good way?", "Do you ever feel tiny? I love feeling tiny."], opts: [
        { tone: 'kind', fx: 'deep', t: ["Even the championship.", "Everything. In a good way."], r: ["...Exactly.", "Yes. That."] },
        { tone: 'light', t: ["Even my lap times. Especially my lap times.", "Even my ego. A bit."], r: ["Ha. Especially.", "Ha. A bit."] },
        { tone: 'flirt', fx: 'flirt', t: ["Not everything. Not this.", "Everything except you."], r: ["...That's cheesy. I'm keeping it.", "...Stop."] },
        { tone: 'firm', t: ["Small, yes. I still want to win, though.", "Small. But I still want the title."], r: ["Ha. Of course you do.", "Of course."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Best view in the city's right here. And it isn't Saturn.", "I'm not really looking at Saturn."], r: ["...That's cheesy. I'm keeping it.", "...Look at the planet."] },
      { tone: 'light', t: ["Can we see my house from here?", "Is that a star or a helicopter?"], r: ["Ha. No.", "Helicopter. ...Sorry."] },
      { tone: 'firm', t: ["How far away is it?", "How long does its light take to get here?"], r: ["Over a billion kilometres. Its light takes more than an hour to reach us.", "More than an hour. You're looking into the past."] },
    ] },
  // (Maya at your flat: you cook for a chef)
  { id: 'sigMayaFlat', who: ['celeb'], where: ['apartment'], w: 9, when: own('maya-lindqvist'), open: [
    "You're cooking for me? For a chef? That's either very brave or very silly.", "Let me see your knife. ...Okay. We need to talk about your knives.", "Don't watch me watching you cook. I can't help it." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Brave. Definitely brave. Be gentle with your review.", "Very brave. It's my best dish. My only dish."], r: ["I'm always gentle. To start with.", "Your only dish. Okay. I'm excited."], then: { say: ["Salt. It needs more salt. Sorry. I had to.", "It's good. Really. A little more salt?"], opts: [
        { tone: 'kind', t: ["Thank you, chef.", "Yes, chef."], r: ["Ha. Good.", "Ha. Good."] },
        { tone: 'light', t: ["That's going on the wall: 'needs salt'.", "Your second note tonight. I'm framing them both."], r: ["Ha. Frame it.", "Ha. Only two."] },
        { tone: 'flirt', fx: 'flirt', t: ["You could just stand here and season everything.", "Stay. Season everything I make from now on."], r: ["...Careful.", "...That's quite a job offer."] },
        { tone: 'show', t: ["It's seasoned perfectly. It's an artistic choice.", "Salt is for people who can't cook."], r: ["Hm. Brave.", "...Take that back."] } ] } },
      { tone: 'light', t: ["Silly. Definitely silly. I've made this twice.", "Very silly. I learnt it from a video."], r: ["Twice. Wonderful. I'm in good hands.", "Ha. One video."] },
      { tone: 'flirt', fx: 'flirt', t: ["I wanted to cook for someone who'd notice.", "I wanted you to see me nervous. It's rare."], r: ["...Oh. Okay. I'll notice everything.", "...It's sweet."] },
      { tone: 'show', t: ["I'm actually quite good. You'll be surprised.", "Surprises are my speciality."], r: ["I'm rarely surprised. Surprise me.", "Go on, then."] },
    ] },
  // (Mira at your flat: the record player)
  { id: 'sigMiraFlat', who: ['celeb'], where: ['apartment'], w: 8, when: own('mira-vale'), open: [
    "You've got a record player! Can I choose? I'm choosing.", "Your flat's so quiet. I like quiet. It's rare for me.", "Is this your taste? These records? I'm judging. Kindly." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Choose anything. I'd love to hear what you'd pick.", "Pick something. Your choice."], r: ["...Something old. Something with a crackle.", "...This one. It's perfect."], then: { say: ["Do you dance? In kitchens, I mean?", "Will you dance? Badly is fine."], opts: [
        { tone: 'kind', t: ["Badly. Willingly.", "Badly. But yes."], r: ["Perfect.", "Good. Badly's the best."] },
        { tone: 'light', t: ["Only when nobody's looking. Look away.", "Like an engineer at a wedding."], r: ["Ha! I'm looking.", "Ha. Show me."] },
        { tone: 'flirt', fx: 'flirt', t: ["With you? I'd try anything.", "One song. Then you sing the next one."], r: ["...Okay. One song.", "...Deal."] },
        { tone: 'firm', t: ["No. I'll watch.", "I'm a watcher, not a dancer."], r: ["...Boring. Fine.", "Hm. We'll see."] } ] } },
      { tone: 'light', t: ["Please don't judge my records. Half were presents.", "Be kind. Some of those were bought at airports."], r: ["I'm judging. Lovingly.", "Ha. Airport records. Brave."] },
      { tone: 'flirt', fx: 'flirt', t: ["Choose something, and sing it. Just once.", "Sing something? Just for me?"], r: ["...Just once. Don't tell anyone.", "...One verse."] },
      { tone: 'show', t: ["My collection's brilliant. You'll be amazed.", "Best record collection in the paddock."], r: ["I've seen a lot of record collections.", "Hm. We'll see."] },
    ] },
  // (Zoe at the karting hall: real karts, not a rig)
  { id: 'sigZoeKart', who: ['celeb'], where: ['karting'], w: 9, when: own('zoe-hartley'), open: [
    "I've studied the track map. I know every apex. This is a fair fight.", "Real karts. Not a rig. I'm shaking. Good shaking.", "If I beat you, chat gets the footage. Those are the rules." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["You'll be quick. You already know the lines.", "You'll be great. The lines are the hard part, and you've got them."], r: ["Knowing and doing. Different sports.", "...Thanks. I needed that."], then: { say: ["Any tips? Real ones?", "Go on. One real tip."], opts: [
        { tone: 'kind', t: ["Trust the grip. There's more than you think.", "Look through the corner, not at it."], r: ["More than I think. Okay.", "Through, not at. Got it."] },
        { tone: 'light', t: ["Don't look at me. I'll be in your mirrors.", "Don't wave at chat mid-corner."], r: ["Ha. Not for long.", "Ha. No promises."] },
        { tone: 'show', t: ["Follow me. You'll learn more.", "Watch my lines. Copy them."], r: ["Oh, I'll follow you. Right up to the pass.", "Copy, then overtake."] },
        { tone: 'firm', t: ["Brake in a straight line. Every time.", "Smooth hands. Don't fight the kart."], r: ["Straight line. Okay.", "Smooth. Okay."] } ] } },
      { tone: 'show', t: ["A fair fight? Against me? Brave.", "You've studied the map. I've driven the real thing."], r: ["I've beaten better. Online.", "We'll see."] },
      { tone: 'flirt', fx: 'flirt', t: ["If you beat me, I'll take you to dinner. If I win, same.", "Beat me and I'll say it on your stream."], r: ["So I win either way. Good.", "...Chat would never recover."] },
      { tone: 'light', t: ["If I lose, the footage mysteriously disappears.", "If I lose, I'm blaming the kart. Loudly."], r: ["Footage never disappears. Ask chat.", "Ha. Chat will love that."] },
    ] },
  // (Elena in the private dining room: she knows the owner, the chef and the best table)
  { id: 'sigElenaDinner', who: ['celeb'], where: ['restaurant'], w: 9, when: own('elena-marchetti'), open: [
    "I know the owner, the chef and the best table here. This is the second-best table.", "Order the risotto. Trust me. I've interviewed the chef.", "I've eaten here a hundred times and I've never been this nervous." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Then you choose for both of us.", "Introduce me to the chef later?"], r: ["Good answer. The risotto, then the fish.", "...Of course. He'll ask you about tyres."], then: { say: ["So. Tell me something you've never said in an interview.", "Off the record: what's the thing you never tell journalists?"], opts: [
        { tone: 'kind', fx: 'deep', t: ["That I still get nervous before every start.", "That I miss home more than I say."], r: ["...Off the record. Thank you.", "...That stays with me."] },
        { tone: 'light', t: ["That I sing on the in-lap. Badly.", "That I still can't parallel park."], r: ["Ha! I knew it.", "Ha. Off the record. For now."] },
        { tone: 'flirt', fx: 'flirt', t: ["That I'd rather be here than anywhere.", "That I've been nervous all evening because of you."], r: ["...That's not a line. I'd know.", "...I believe you. Annoyingly."] },
        { tone: 'firm', t: ["Nothing. I say the same in interviews as I do here.", "There isn't one. What you see is it."], r: ["Hm. Rare.", "I believe you. I think."] } ] } },
      { tone: 'light', t: ["Second-best? I'm insulted. Mildly.", "Get us moved. I'll wait."], r: ["Ha. Next time you'll earn the best one.", "Ha. Patience."] },
      { tone: 'flirt', fx: 'flirt', t: ["Second-best table. Best company.", "I don't care about the table."], r: ["...That one I'll allow.", "...Good."] },
      { tone: 'show', t: ["Next time, I'll book the best table.", "They'll give me the best one next time. Watch."], r: ["Hm. We'll see.", "Ha. Big words."] },
    ] },
];

// =====================================================================================================================
// the conversation: picking a topic, building its tree, the guest's goodbye
// =====================================================================================================================
/** how a tone lands with the person (the grid walk's TONE, plus flirt and show) */
export const HANGOUT_TONE = { kind: 2, firm: 1, light: 1, cold: -1, cruel: -5, sorry: 3, gossip: 0, leave: -1, flirt: 1, show: 0, passive: 0, flirty: 1, risque: 2 };
/** the option's tag (tone), as on the grid walk */
export const HANGOUT_TAG = { kind: 'KIND', firm: 'FIRM', light: 'LIGHT', cold: 'COLD', cruel: 'CRUEL', sorry: 'APOLOGISE', gossip: 'BEHIND THEIR BACK', leave: '', flirt: 'FLIRT', show: 'SHOW OFF', ...TONE_TAG };
/** a second tag for the options that carry weight (fx), so a cover story always reads as one */
export const HANGOUT_FX_TAG = { cover: 'COVER STORY', confess: 'OWN UP', deep: 'OPEN UP', invite: 'INVITE', flirt: '', charm: '',
  network: 'NETWORK', loose: 'LOOSE', provoke: 'ESCALATE', dance: 'DANCE', together: 'LEAVE TOGETHER', kiss: 'KISS', clear: 'CLEAR THE AIR', selfie: 'PHOTO', shoey: 'SHOEY', calm: '', water: 'WATER' };
/** what an answer does to the guest's mood: its own m, else its tone's weight (the grid walk's rule) -> number */
export function hangoutMood(o) { return o ? o.m ?? HANGOUT_TONE[o.tone] ?? 0 : 0; }

/** the tokens a line can carry, read from the evening (x) and the guest (n); null falls back */
const TOKENS = {
  name: (x, n) => n.name, first: (x, n) => n.first || firstOf(n.name), team: (x, n) => n.team,
  venue: (x) => VENUE[x.venue] || x.venueName, track: (x) => x.track || x.trackName, result: (x) => x.result || resultOf(x),
  her: (x, n) => n.first || firstOf(n.name), job: (x, n) => jobOf(n.job), herWork: (x, n) => mine(pick(n.herWork || n.work || null)),
  partner: (x) => (x.partnerName ? firstOf(x.partnerName) : null), other: (x, n) => otherOf(x, n),
  // (the party's: x.party from PartyTalk.partyEvening, a person's fields from PartyTalk.partyGuest)
  brand: (x, n) => n.brandName || x.party?.brandName, product: (x, n) => n.product, club: (x) => (isPartyVenue(x.venue) ? x.venueName : null), city: (x) => x.party?.city, gp: (x) => x.party?.gp,
  mate: (x) => (x.party?.mateName ? firstOf(x.party.mateName) : null), mateResult: (x) => (x.party?.mateDnf ? 'the retirement' : x.party?.matePos ? `P${x.party.matePos}` : null),
  rival: (x) => (x.party?.foughtName ? firstOf(x.party.foughtName) : null), winner: (x) => (x.party?.winnerName ? lastOf(x.party.winnerName) : null), dj: (x) => x.party?.djName,
  client: (x, n) => (Array.isArray(n.clients) ? n.clients[0] : null), client2: (x, n) => (Array.isArray(n.clients) ? n.clients[1] : null),
  ex: (x) => (x.party?.exName ? firstOf(x.party.exName) : null), exnew: (x) => (x.party?.exNew ? firstOf(x.party.exNew) : null),
  me: (x) => (x.meName ? firstOf(x.meName) : null), sur: (x) => (x.meName ? lastOf(x.meName) : null), title: (x, n) => jobOf(n.title), outlet: (x, n) => n.outlet,
};
/** her work pool is written about her ('her documentary', 'a racket she is not sure about'); in her own mouth it is hers */
const mine = (s) => (s ? String(s).replace(/\bher\b/g, 'my').replace(/\bshe is\b/g, "I'm").replace(/\bshe's\b/g, "I'm").replace(/\bshe\b/g, 'I') : s);
const FALLBACK = { name: 'you', first: 'mate', team: 'the team', venue: 'this place', track: 'the next race', result: 'the last race', her: '', job: 'work', herWork: 'work', partner: 'her', other: 'the others',
  brand: 'the brand', product: 'product', club: 'this place', city: 'the city', gp: 'the race', mate: 'your team-mate', mateResult: 'a result', rival: 'him', winner: 'the winner', dj: 'the DJ',
  client: 'one of my lads', client2: 'another', ex: 'her', exnew: 'him', me: 'you', sur: 'you', title: 'marketing', outlet: 'the Post' };
/** your last result in words: 'the win', 'P6', 'the retirement' (null: no race yet) */
const resultOf = (x) => { const p = pos(x); return x.lastDnf || p === 0 ? 'the retirement' : p == null ? null : p === 1 ? 'the win' : `P${p}`; };
/** her job, mid-sentence ('singer', but 'DJ', 'TV presenter', 'Olympic sprinter') */
const jobOf = (j) => (!j ? null : /^[A-Z]{2}|^Olympic/.test(j) ? j : j[0].toLowerCase() + j.slice(1));
/** the other guest's first name (a group): n.other, x.other, or whoever in x.others is not n */
const otherOf = (x, n) => { const o = n.other || x.other || (Array.isArray(x.others) ? x.others.find((s) => s && s !== n.name) : null); return o ? firstOf(o) : null; };
/** fx (a string or a list) -> merged flags { flirt, charm, deep, cover, confess, invite } or undefined */
const flags = (fx) => { if (!fx) return undefined; const o = {}; for (const k of [].concat(fx)) if (FX.includes(k)) o[k] = true; return Object.keys(o).length ? o : undefined; };
/** a when() that throws (a field missing in an odd way) simply does not fit */
const fits = (d, x, n) => { try { return !d.when || !!d.when(x, n); } catch (e) { return false; } };

/** a line with its tokens filled in from the evening (x) and the guest (n) -> string */
export function fillHangout(s, x = {}, n = {}) {
  const out = String(s).replace(/\{(\w+)\}/g, (m, k) => {
    const v = TOKENS[k] ? TOKENS[k](x, n) : null;
    return v == null || v === '' ? (FALLBACK[k] ?? '') : String(v);
  });
  // (a token that came out empty leaves no stray comma, and a token that opens the line still gets its capital letter)
  return out.replace(/,\s*(?=[.!?])/g, '').replace(/ {2,}/g, ' ').replace(/^(\[?(?:\.\.\.)?)([a-z])/, (m, b, ch) => b + ch.toUpperCase());
}

/**
 * Who a topic suits: a driver gets the driver topics (and, with someone else at the table, the group ones); she gets
 * hers, and with others listening only those fit for company (crowd), the shared ones and the quiet ones - plus the
 * group-only talk, never a driver's own (she has never sat in a kart, let alone qualified one).
 */
// (at a party a person has topics of their own - who 'person', matched on role - and any topic may name the roles it is
// for: role, a role or a list, against n.role)
const roleOk = (d, n) => !d.role || [].concat(d.role).includes(n.role);
const suits = (d, kind, group, n = {}) => roleOk(d, n) && (kind === 'person' ? d.who.includes('person')
  : kind === 'celeb'
    ? (d.who.includes('celeb') ? !group || !!d.crowd || !!d.quiet || d.who.includes('group') : group && d.who.length === 1 && d.who[0] === 'group')
    : d.who.includes('driver') || (group && d.who.includes('group')));

// ---- the party (PartyTalk): its own pool, its privacy rule and its dramas ------------------------------------------------
let PARTY_POOL = null;
/** PartyTalk's topics plus the evening topics PARTY_KEEP lets through (a keep can add its own when()) -> [defs] */
const partyPool = () => PARTY_POOL || (PARTY_POOL = PARTY_TOPICS.concat(HANGOUT_TOPICS.filter((d) => PARTY_KEEP[d.id]).map((d) => {
  const k = PARTY_KEEP[d.id]; return typeof k === 'function' ? { ...d, when: (x, n) => (!d.when || d.when(x, n)) && k(x, n) } : d;
})));
/** in company at a party: x.party.private decides when PartyPlay has said (true: private), else anyone else named means company */
const partyGroup = (x, n) => { const p = x.party ? x.party.private : undefined; return p === true ? false : p === false ? true : !!otherOf(x, n); };
/** the drama PartyPlay has open on this guest (x.party.drama, aimed at x.party.dramaCid or at whoever is talked to) -> id | null */
// (either spelling of an id: career/Party.js's planner ids, or PartyPlay's talk ids - tabex, selfie, overhear, sidedoor)
const dramaOf = (x, n) => { const P = x.party; if (!P || !P.drama) return null; return !P.dramaCid || P.dramaCid === n.cid ? dramaId(P.drama) : null; };
const kindOf = (n) => (n.kind === 'person' ? 'person' : isStar(n) ? 'celeb' : 'driver');

/** the topics that fit this moment with this guest, minus the ones already used tonight (ids) -> [defs] */
export function hangoutTopics(x = {}, n = {}, used = []) {
  const party = isPartyX(x), kind = kindOf(n), group = party ? partyGroup(x, n) : !!otherOf(x, n), hush = !!x.grave || (kind === 'celeb' && !!n.grieving);
  const dr = party ? dramaOf(x, n) : null;
  // (a drama happens wherever it happens - in company too: its topics need only the guest's kind and role)
  // (affection hook: a no tonight / too drunk / already kissed - ui/Affection.js sets n.affHold, n.affLeave - no kiss topics; no leaving together)
  const hasFx = (os, k) => (os || []).some((o) => [].concat(o.fx || []).includes(k) || hasFx(o.then?.opts, k));
  const held = (d) => (n.affHold && hasFx(d.opts, 'kiss')) || (n.affLeave && hasFx(d.opts, 'together'));
  const pass = (d, drama) => !used.includes(d.id) && !held(d) && (d.drama ? d.drama === drama : !drama) && (d.drama ? d.who.includes(kind) && roleOk(d, n) : suits(d, kind, group, n)) && (!d.where || d.where.includes(x.venue)) && (!hush || d.quiet) && fits(d, x, n);
  const L = (party ? partyPool() : HANGOUT_TOPICS).filter((d) => pass(d, dr));
  // (a drama with nothing that fits this guest is simply not had: the ordinary talk instead - the tree carries no .drama)
  return L.length || !dr ? L : partyPool().filter((d) => pass(d, null));
}

/**
 * A topic's tree for this conversation (GridTalk's shape; fx become flags) -> { id, say, opts: [{ t, tone, r, m, end,
 * fx, then, act?, out?, leak?, quote? }], drama? }. An answer and its reaction are drawn as a pair (the same index when the two
 * pools are the same length: 'A farming game' gets the farming-game laugh, never the one about socks). An answer with
 * its own when() is offered only when it fits; an m that is a function is worked out for this guest.
 */
export function buildHangout(def, x = {}, n = {}) {
  const f = (s) => fillHangout(pick(s), x, n);
  const can = (o) => { try { return !o.when || !!o.when(x, n); } catch (e) { return false; } };
  const mOf = (o) => { if (typeof o.m !== 'function') return o.m; try { const v = o.m(x, n); return typeof v === 'number' && isFinite(v) ? v : undefined; } catch (e) { return undefined; } };
  const opt = (o) => {
    const T = [].concat(o.t), R = o.r == null ? [] : [].concat(o.r), i = (Math.random() * T.length) | 0;
    const b = { t: fillHangout(T[i], x, n), tone: o.tone, r: R.length ? fillHangout(R.length === T.length ? R[i] : pick(R), x, n) : '', m: mOf(o), end: o.end, fx: flags(o.fx),
      then: o.then ? { say: f(o.then.say), opts: shuffle(o.then.opts.filter(can)).slice(0, 4).map(opt) } : undefined };
    if (o.act) b.act = o.act; if (o.out) b.out = o.out; if (o.leak) b.leak = true; if (o.quote != null) b.quote = !!o.quote;
    return b;
  };
  const tree = { id: def.id, say: f(def.open), opts: shuffle(def.opts.filter(can)).slice(0, 4).map(opt) };
  if (def.drama) tree.drama = def.drama;
  return tree;
}

// (the topics that move a romance on - a cover story, owning up, an invitation, leaving together, a kiss: still had with
//  someone whose talk is their personality's, as the third conversation of an evening)
const PLOT = new Set(['cover', 'confess', 'invite', 'together', 'kiss']);
const plotOf = (os) => (os || []).some((o) => [].concat(o.fx || []).some((k) => PLOT.has(k)) || plotOf(o.then?.opts));
const pickW = (L) => { let r = Math.random() * L.reduce((s, d) => s + (d.w || 1), 0); for (const d of L) if ((r -= d.w || 1) <= 0) return d; return L[L.length - 1]; };
/** one conversation with a guest: a fresh topic picked by weight and built -> { id, say, opts } | null (nothing fresh left) */
export function hangoutTalk(x = {}, n = {}, used = []) {
  // (someone you could date talks as who they are (career/Persona.js), opening in the mood you left them in - except in a
  //  grave week, in grief, as an ex, in a party's drama, or when the evening's third talk has the romance to move on)
  if (n.persona && !x.grave && !n.grieving && n.stage !== 'ex' && !(isPartyX(x) && dramaOf(x, n))) {
    const plot = (n.talks || 0) >= 2 ? hangoutTopics(x, n, used).filter((d) => plotOf(d.opts)) : [];
    if (plot.length) return buildHangout(pickW(plot), x, n);
    try { const t = n.persona.talk(x); if (t) return t; } catch (e) { console.warn('HangoutTalk: the personality talk failed', e); }
  }
  const L = hangoutTopics(x, n, used);
  if (!L.length) return null;
  let r = Math.random() * L.reduce((s, d) => s + (d.w || 1), 0);
  for (const d of L) if ((r -= d.w || 1) <= 0) return buildHangout(d, x, n);
  return buildHangout(L[L.length - 1], x, n);
}

/**
 * At a party: a drama's own talk with this guest (PartyTalk's PARTY_DRAMA ids - its topics marked drama: id that suit
 * the guest's kind and role), picked and built -> { id, say, opts, drama } | null (none fits this guest). PartyPlay's
 * director can open it directly, or set x.party.drama / dramaCid and let hangoutTalk offer it.
 */
export function hangoutDrama(x = {}, n = {}, id = null, used = []) {
  id = dramaId(id); if (!id) return null;
  const kind = kindOf(n), L = PARTY_TOPICS.filter((d) => d.drama === id && !used.includes(d.id) && d.who.includes(kind) && roleOk(d, n) && (!d.where || d.where.includes(x.venue)) && fits(d, x, n));
  return L.length ? buildHangout(pick(L), x, n) : null;
}
/**
 * At a party: one loose line to swap in for an answer (tipsy: one option; drunk: one pick in four) -> { t, tone, r, m,
 * fx: { loose: true }, leak, loose } | null. leak: it gave away car information.
 */
export function hangoutLoose(x = {}, n = {}) {
  const L = partyLooseFor(x, n); if (!L) return null;
  return { t: fillHangout(L.t, x, n), tone: L.tone, r: fillHangout(L.r, x, n), m: L.m, fx: { loose: true }, leak: L.leak, loose: L.id };
}

/** the guest's line as a conversation closes, by how it went (dm: what it moved) */
export const HANGOUT_BYE = {
  good: ["Good chat. Proper good.", "This was great. Same again soon?", "Cheers. I needed that.", "Right. Don't go anywhere - I'm coming back."],
  ok: ["Right. I'm going to grab another juice.", "Back in a bit.", "Good stuff. Give me a minute."],
  bad: ["...Right. I'm going to get some air.", "Okay. Let's leave it there for now.", "Fine."],
  warm: ["Don't go far.", "Come and find me in a minute.", "I'll be right here. Don't be long."],
  cold: ["...I need a minute.", "I'm going to get some air. On my own.", "Right. Okay."],
  quiet: ["Thanks for this. Really.", "Take care of yourself this week.", "I'm glad we did this."],
};
/** a goodbye for this guest after a conversation that moved dm -> string */
export function hangoutBye(x = {}, n = {}, dm = 0) {
  if (x.grave || (isStar(n) && n.grieving)) return pick(HANGOUT_BYE.quiet);
  // (a party has its own: nobody there is going to 'grab another juice')
  if (isPartyX(x)) { try { const s = partyBye(x, n, dm); if (s) return fillHangout(s, x, n); } catch (e) { /* the evening's pools */ } }
  if (isStar(n)) return pick(dm < 0 ? HANGOUT_BYE.cold : HANGOUT_BYE.warm);
  return pick(dm >= 3 ? HANGOUT_BYE.good : dm >= 0 ? HANGOUT_BYE.ok : HANGOUT_BYE.bad);
}

// =====================================================================================================================
// the evening and the guests, read from the career (plain JSON reads only - nothing here changes the career)
// =====================================================================================================================
const TRACK = { lasvegas: 'Las Vegas', silverstone: 'Silverstone', montreal: 'Montreal', austin: 'Austin' };
// (each venue's privacy as career/Social.js's VENUES has it - for a caller that does not pass the venue's own)
const PRIVACY = { rooftop: 0.2, pub: 0.5, simlounge: 0.6, apartment: 0.95, restaurant: 0.8, karting: 0.4, poolclub: 0.3, dayclub: 0.25, ...PARTY_PRIVACY };
/** rounds since a { season, round } stamp (99: never) */
const ago = (c, s) => (s && s.season != null ? (c.season - s.season) * (c.rounds || 6) + (c.round - s.round) : 99);
/** a driver's friendship stage from its level (Social's thresholds) */
const friendStageOf = (v) => (v >= 85 ? 'best' : v >= 60 ? 'mate' : v >= 35 ? 'friend' : v >= 15 ? 'friendly' : 'acquaintance');
/** an id from an id or an object carrying one ({ id } or a track with its def) */
const idOf = (v) => (v && typeof v === 'object' ? v.id || v.def?.id || null : v || null);
const isCelebGuest = (g) => !!g && (g.kind === 'celeb' || g.kind === 'star' || (g.kind !== 'driver' && !!CELEB[g.celebId || g.id]));

/**
 * The evening (x) as the topics read it, from the career (c; null for a quick evening) and the scene: o = { venue (id
 * or { id, name, privacy }), guests: [{ kind, id, name }], track (id, { id, name } or a track with its def; else the
 * career's next race), night, privacy, date, secret, grave } plus whatever the scene already knows of late, moment,
 * played, won and buzz. Keep the object and set those on it as the evening goes on. Career reads: the last race (report
 * or log), a grave week (as career/Celebs.js judges it), licence points, a pending crisis, your public partner, how many
 * you are seeing, a secret date. At a party venue also x.meName and x.party (PartyTalk.partyEvening: from o.party - the
 * launch, pass it - else the career's c.party), which PartyPlay then keeps current. -> x
 */
export function hangoutEvening(c, o = {}) {
  const v = o.venue, venue = idOf(v), gs = (Array.isArray(o.guests) ? o.guests : []).filter(Boolean), party = isPartyVenue(venue) && (venue !== 'poolclub' || !!o.isParty || !!o.party);
  const tid = idOf(o.track) || (c?.calendar?.length ? c.calendar[(c.round - 1) % c.calendar.length] : null);
  const nameOf = (g) => g.name || (isCelebGuest(g) ? CELEB[g.celebId || g.id]?.name : c?.drivers?.[g.id]?.name) || null;
  const x = { venue, venueName: (v && typeof v === 'object' && v.name) || null, track: (o.track && typeof o.track === 'object' && o.track.name) || TRACK[tid] || null, night: !!o.night,
    privacy: typeof o.privacy === 'number' ? o.privacy : typeof v?.privacy === 'number' ? v.privacy : PRIVACY[venue] ?? null,
    date: o.date ?? gs.some(isCelebGuest), others: gs.map(nameOf).filter(Boolean), guests: gs.length, grave: !!o.grave, secret: !!o.secret,
    lastPos: null, lastDnf: false, points: 0, crisis: null, partner: false, partnerId: null, partnerName: null, seeing: 0 };
  for (const k of ['late', 'moment', 'played', 'won', 'buzz']) if (o[k] != null) x[k] = o[k];
  if (!c) { if (party) { try { x.party = partyEvening(null, o.party || null, x); } catch (e) { console.warn('HangoutTalk: could not read the party', e); } partyLast(x); } return x; }
  try {
    const me = c.drivers?.[c.playerId], s = c.celebs || {}, B = s.bonds || {}, rep = c.report, L = c.log;
    const last = rep && rep.pos != null ? { pos: rep.pos, dnf: !!rep.dnf } : L && L.length && L[L.length - 1].you != null ? { pos: L[L.length - 1].you, dnf: false } : null;
    if (last) { x.lastDnf = last.dnf; x.lastPos = last.dnf ? 0 : last.pos; }
    x.grave = x.grave || !!c.pr?.ctx?.grave || (c.lost || []).some((l) => ago(c, l) <= 0);
    try { x.points = me ? activePoints(c, me) : 0; } catch (e) { x.points = 0; }
    x.crisis = c.pr?.crisis?.kind || null;
    const pid = s.partner && CELEB[s.partner] ? s.partner : null;
    Object.assign(x, { partner: !!pid, partnerId: pid, partnerName: pid ? CELEB[pid].name : null });
    x.seeing = Object.keys(B).filter((id) => CELEB[id] && (B[id].stage === 'dating' || B[id].stage === 'partner')).length;
    x.secret = x.secret || gs.some((g) => isCelebGuest(g) && !!B[g.celebId || g.id]?.secret);
  } catch (e) { console.warn('HangoutTalk: could not read the career for the evening', e); }
  if (party) {
    try { x.meName = c.drivers?.[c.playerId]?.name || null; x.party = partyEvening(c, o.party || null, x); } catch (e) { console.warn('HangoutTalk: could not read the party', e); }
    partyLast(x);
  }
  return x;
}
/** at a party the last race is the one the party follows (x.party: the launch's race), whatever the career has filed yet */
function partyLast(x) {
  const P = x.party; if (!P) return;
  if (P.dnf === true) { x.lastDnf = true; x.lastPos = 0; } else if (typeof P.pos === 'number' && P.pos > 0) { x.lastDnf = false; x.lastPos = P.pos; }
}

/**
 * One guest (n) as the topics read them, from the scene's guest ({ kind: 'driver'|'celeb', id, name, team }) and the
 * career: a driver's team, whether he is your team-mate, his friendship stage and tastes (c.social) and your rapport;
 * her celebId, job, work, her free trait and the bond (stage, dates, public, secret, suspicion, grieving). n.other is
 * the first other guest (x from hangoutEvening). Count n.talks up after each conversation with them. At a party pass
 * the launch guest whole ({ kind: 'driver'|'celeb'|'person', id, cid, name, team, role, age, under, real, talk, brand,
 * title, clients, ... }): n gains cid, role, real (a real person: the talk keeps them to the job), under (below the
 * venue's drinking age), present (one conversation) - and a person is read by PartyTalk.partyGuest. -> n
 */
export function hangoutGuest(c, g = {}, x = {}) {
  if (g.kind === 'person' || /^[px]:/.test(String(g.cid || ''))) return partyGuest(c, g, x);
  const star = isCelebGuest(g), id = (star ? g.celebId || g.id : g.id) || null, C = star ? CELEB[id] : null;
  const name = g.name || (star ? C?.name : c?.drivers?.[id]?.name) || '', n = { kind: star ? 'celeb' : 'driver', id, name, first: firstOf(name), talks: g.talks || 0 };
  const others = (Array.isArray(x.others) ? x.others : []).filter((s) => s && s !== name);
  if (others.length) n.other = others[0];
  // (the party's: who they are tonight, and the content line - a real driver stays a real driver)
  n.cid = g.cid || (star ? 'c:' : 'd:') + (id || name);
  if (g.role) n.role = g.role;
  if (g.talk === 1 || g.role === 'present') n.present = true;
  try {
    if (star) {
      const b = c?.celebs?.bonds?.[id];
      Object.assign(n, { celebId: id, job: C?.job || g.job || null, work: C?.work || g.work || null, free: C?.traits?.free || 0, real: false });
      if (b) Object.assign(n, { stage: b.stage, dates: b.dates || 0, public: !!b.public, secret: !!b.secret, suspicion: b.suspicion || 0, grieving: !!b.grieving });
      // (who she is: her personality's conversations, the tokens as the evening has them)
      if (c) n.persona = { talk: (x2) => { const tk = (k) => { const v = fillHangout(`x {${k}}`, x2, n).slice(2); return v.includes('{') ? '' : v; };   /* (mid-sentence: never the capital a line's first word gets) */ return personaTalk(c, n.cid, { party: isPartyX(x2), T: { name: n.name, job: n.job, work: tk('herWork'), track: tk('track'), result: tk('result'), venue: tk('venue') } }); } };
    } else {
      const d = c?.drivers?.[id], f = c?.social?.friends?.[id];
      n.team = g.team || d?.team || null; n.mate = !!(c && d && d.team === c.myTeam && id !== c.playerId);
      if (f) { n.stage = f.stage || friendStageOf(f.level || 0); if (Array.isArray(f.tastes)) n.tastes = f.tastes; }
      if (c?.rapport && c.rapport[id] != null) n.rapport = c.rapport[id];
      n.real = typeof g.real === 'boolean' ? g.real : realDriver(d);
      const lim = x.party?.age || 21;
      // (at a party a driver the launch did not mark is checked against the birthdays on the race's date)
      n.under = typeof g.soft === 'boolean' ? g.soft : typeof g.under === 'boolean' ? g.under : typeof g.age === 'number' ? g.age < lim : isPartyX(x) && !!id ? partyUnder(c, id, x) : false;
    }
  } catch (e) { console.warn('HangoutTalk: could not read the career for a guest', g, e); }
  return n;
}
