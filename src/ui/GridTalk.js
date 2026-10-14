// More to talk about on the grid (ui/GridWalk.js): topics written as data - who they come up with (who), when
// (when), the person's openers (open), your answers in a tone each (opts: t, the reaction r, and their follow-up then
// with your answers to that). Every line is a pool: one is drawn each time, and tokens are filled in from where you
// are: {me} your first name, {team} your team, {pos} your grid slot, {X} / {XT} another driver and their team,
// {track}, {corner} a corner of this circuit, {plan} / {start} / {stop} your race strategy, {laps}, {who} the
// person's first name - and for the stars (GridTalk4.js) {her} her first name, {job} what her pass says, {herWork}
// something she is busy with (ui/WalkFx.js gives each star her work), {partner} your partner's first name ('her' when
// there is none). Built into the same tree as GridWalk's own topics: { say, opts: [{ t, tone, r, m, fx, then }] }. An
// answer's fx is one word or a list of them (press, about, pressAbout, jab, meet, flirt, askout, charm, partner), made
// into the flags the walk reads; an answer with a when(x, n) of its own is only offered when it fits, and a shove only
// at someone who can be shoved (x.jabbable, from ui/WalkFx.js).
// Gossip stays about racing; nobody wishes anyone harm.

const pick = (a) => (Array.isArray(a) ? a[(Math.random() * a.length) | 0] : a);
const first = (s) => String(s || '').split(' ')[0];
// (what an answer can do after it, besides press and about: a shove, meeting a star, a flirt, asking her out, a charm, your partner's good luck)
const FX = ['press', 'jab', 'meet', 'flirt', 'askout', 'charm', 'partner'];
const fxHas = (fx, k) => (Array.isArray(fx) ? fx.includes(k) : fx === k);

/** a topic's tree for this conversation (x: the context, n: the person) */
export function buildTopic(def, x, n) {
  const f = (s) => fill(pick(s), x, n);
  const ok = (o) => (!o.when || o.when(x, n)) && !(x.jabbable && fxHas(o.fx, 'jab') && !x.jabbable(n));
  const opt = (o) => ({ t: f(o.t), tone: o.tone, r: o.r ? f(o.r) : '', m: o.m, end: o.end, fx: fxOf(o.fx, x), then: o.then ? { say: f(o.then.say), opts: shuffle(o.then.opts.filter(ok)).slice(0, 4).map(opt) } : undefined });
  return { say: f(def.open), opts: shuffle(def.opts.filter(ok)).slice(0, 4).map(opt) };
}
/** an answer's fx (a word, a list of words, or flags already) -> one set of flags | undefined ('about' needs someone to be about) */
function fxOf(fx, x) {
  if (!fx) return undefined;
  if (typeof fx === 'object' && !Array.isArray(fx)) return { ...fx };
  const o = {};
  for (const k of Array.isArray(fx) ? fx : [fx]) {
    if (k === 'about' || k === 'pressAbout') { if (x.X) { o.about = x.X; if (k === 'pressAbout') o.press = true; } }
    else if (FX.includes(k)) o[k] = true;
  }
  return Object.keys(o).length ? o : undefined;
}
function shuffle(a) { return a.map((v) => [Math.random(), v]).sort((p, q) => p[0] - q[0]).map((v) => v[1]); }
function fill(s, x, n) {
  return String(s).replace(/\{(\w+)\}/g, (_, k) => {
    const v = { weather: x.weatherText, mate: x.mate, me: x.meFirst, team: x.me?.team, pos: x.me?.gridPos ? `P${x.me.gridPos}` : 'the back', X: x.X ? x.X.name.split(' ').pop() : 'the guy in front', XT: x.X?.team || 'their team', track: x.trackName, corner: pick(x.corners), plan: x.planText, start: x.startTyre, stop: x.stopLap, laps: x.laps, who: n?.name?.split(' ')[0] || '', city: x.city,
      her: first(n?.name), job: n?.job || '', herWork: n?.work?.length ? pick(n.work) : 'her work', partner: x.partnerName || 'her' }[k];
    return v ?? (x.venue && x.venue[k] ? pick(x.venue[k]) : '');
  });
}

// =====================================================================================================================
// the topics
// =====================================================================================================================
export const TOPICS = {
  // ---- the race strategy (ties to the plan you picked) ----------------------------------------------------------------
  strategyDriver: { who: ['driver'], w: 2, open: [
    "Go on then. What are you starting on?", "Everyone's talking one-stop. You?", "Heard you were up late with the strategists. Anything good?", "How long do you reckon the softs last here?" ],
    opts: [
      { tone: 'firm', t: ["{start}s. And I'm not telling you the rest.", "Whatever's quickest. You'll find out in the pit lane."], r: ["Worth a try.", "Ha. Fair enough."], then: { say: ["You going to undercut me if you get the chance?", "So you're going long, then?"], opts: [
        { tone: 'firm', t: ["If it's on, it's on.", "Only if you leave the door open."], r: ["Then I won't."] },
        { tone: 'light', t: ["I'll undercut you, overcut you, whatever's going.", "I'm going to stay out until the tyres are canvas."], r: ["Ha! Mad."] },
        { tone: 'cold', t: ["Ask my engineer.", "Strategy's not my department."], r: ["Very helpful."] } ] } },
      { tone: 'kind', t: ["Honestly? {plan}. Box around lap {stop} if it holds.", "We're on the {plan}. Nothing clever."], r: ["Same as most of us, I think.", "Honest answer. Didn't expect that."], m: 2, then: { say: ["You think the safety car comes and ruins it?", "What if it rains?"], opts: [
        { tone: 'kind', t: ["Then we all get a cheap stop and start again.", "Then we adapt. Like always."], r: ["Yeah. Good luck with it."] },
        { tone: 'light', t: ["Then I blame the engineer.", "Then I pretend that was the plan all along."], r: ["Classic."] },
        { tone: 'firm', t: ["We've got a plan for that too.", "We've got three plans. I've read all of them."], r: ["Course you have."] } ] } },
      { tone: 'light', t: ["Starting on whatever's left in the truck.", "Square ones. Faster on the straights."], r: ["Ha! Useful.", "Brilliant. Thanks."], then: { say: ["Seriously though, how are they wearing?"], opts: [
        { tone: 'kind', t: ["The fronts go first here. Look after them in {corner}.", "The rears, through the traction zones. Be gentle."], r: ["Cheers. I'll remember that."] },
        { tone: 'cold', t: ["You'll find out.", "Same as yours, I'd guess."], r: ["Right."] } ] } },
      { tone: 'cruel', t: ["Doesn't matter what I start on, I'll still be in front of you.", "Why, you planning to copy us again?"], r: ["Charming.", "We'll see on lap one."], m: -3, then: { say: ["Is that how it's going to be all race?"], opts: [
        { tone: 'sorry', t: ["Nah. Sorry. Nerves. Good luck out there."], r: ["Yeah. You too."] },
        { tone: 'cruel', t: ["All race and all season."], r: ["Noted."] } ] } },
    ] },
  strategyBoss: { who: ['boss', 'eng'], w: 3, open: [
    "We're happy with the {plan}. Any doubts, now's the time.", "Box window opens around lap {stop}. We'll call it - don't argue on the radio.", "The {start} start is the right call. You agree?", "If there's a safety car before lap {stop}, we're boxing. Be ready." ],
    opts: [
      { tone: 'firm', t: ["No doubts. Let's execute.", "Agreed. Clean in, clean out."], r: ["Good.", "That's what I like to hear."], then: { say: ["And if the tyres go off early?", "Want us to tell you the gaps to the cars behind?"], opts: [
        { tone: 'firm', t: ["Then call me in. I'll trust it.", "Every lap. I want to know."], r: ["Will do."] },
        { tone: 'kind', t: ["Thanks for all the work on this. Really.", "You lot did the hard part. I just drive."], r: ["Appreciated."], m: 2 },
        { tone: 'cold', t: ["I'll know before you do.", "Only if I ask."], r: ["Understood."] } ] } },
      { tone: 'kind', t: ["One thing - can we keep Plan B ready in case it rains?", "Happy. Just keep me posted if the others gamble."], r: ["Already on it.", "We always do."], m: 1, then: { say: ["Anything else you want from us today?"], opts: [
        { tone: 'kind', t: ["Just a calm voice on the radio.", "A quick stop. You always give me one."], r: ["You'll get both."] },
        { tone: 'light', t: ["A faster car, ideally.", "Wings. Rocket boosters. The usual."], r: ["Next season. Maybe."] } ] } },
      { tone: 'light', t: ["Plan A, Plan B, Plan Z: drive faster.", "As long as Plan A isn't 'hope'."], r: ["Ha. Plan Z is our favourite.", "Hope is Plan C."], then: { say: ["Seriously - you're comfortable with lap {stop}?"], opts: [
        { tone: 'firm', t: ["Comfortable.", "If the tyres say so."], r: ["Good."] },
        { tone: 'cold', t: ["I'll tell you on lap {stop}."], r: ["Fine."] } ] } },
      { tone: 'cruel', t: ["Last time you called it, we dropped four places.", "I'll believe it when it works."], r: ["That's fair. And harsh.", "Noted. Let's prove you wrong."], m: -3, then: { say: ["Do you want to call it yourself, then?"], opts: [
        { tone: 'sorry', t: ["No. Sorry. You call it, I'll drive."], r: ["That's the deal."] },
        { tone: 'cruel', t: ["Maybe I should."], r: ["We'll talk after the race."] } ] } },
    ] },
  strategyPress: { who: ['press'], w: 2, open: [
    "Strategy looks open today. One stop or two for you?", "Some teams are gambling on the hard start. Tempted?", "Your team have been quiet about strategy. Anything you can share?" ],
    opts: [
      { tone: 'firm', fx: 'press', t: ["We've got a plan. You'll see it on lap {stop}.", "We'll be flexible. That's all I'll say."], r: ["Cryptic!", "Fair enough."], then: { say: ["Is tyre management going to decide this race?"], opts: [
        { tone: 'firm', fx: 'press', t: ["It always does here.", "Tyres, and whoever stays out of trouble on lap one."], r: ["Thanks."] },
        { tone: 'light', fx: 'press', t: ["That and the coffee.", "That, and luck. Mostly luck."], r: ["Ha!"] } ] } },
      { tone: 'kind', fx: 'press', t: ["The team's done brilliant work. I trust them completely.", "We'll start on {start}s and see. Honest answer."], r: ["Refreshingly open.", "Thanks for that."], then: { say: ["And {X}? What do you expect from them?"], opts: [
        { tone: 'kind', fx: 'pressAbout', t: ["{X}'s quick. Expect them in the fight.", "Strong. Always are."], r: ["Generous."] },
        { tone: 'cruel', fx: 'pressAbout', t: ["Expect them to cry to the stewards.", "Not much."], r: ["That's my headline."], m: -1 } ] } },
      { tone: 'cold', t: ["No comment on strategy.", "Ask the pit wall."], r: ["Of course.", "Worth a try."] },
      { tone: 'light', fx: 'press', t: ["We're doing a nine-stop. Revolutionary.", "Strategy? I just turn left and right."], r: ["Ha. I'll print that.", "Very good."] },
    ] },
  // ---- the weather / conditions -------------------------------------------------------------------------------------
  weather: { who: ['driver', 'eng', 'boss', 'mech', 'celeb', 'press'], w: 1.2, open: [
    "{weather}", "Track temperature's dropped again. The tyres will hate it.", "Did you see the forecast? Nobody agrees.", "Wind's picked up. Feel it on the straight?" ],
    opts: [
      { tone: 'firm', t: ["Same for everyone. Adapt or go home.", "It's racing. You deal with what you get."], r: ["True.", "Yeah."], then: { say: ["Does it change how you'll start?"], opts: [
        { tone: 'firm', t: ["Careful for a lap. Then flat out.", "No. Same plan."], r: ["Sensible."] },
        { tone: 'light', t: ["I'll start in a raincoat.", "Only my choice of gloves."], r: ["Ha."] } ] } },
      { tone: 'kind', t: ["Hope everyone keeps it on the road out there.", "Let's just all get through the first lap clean."], r: ["Amen to that.", "Yeah. That's the main thing."], m: 2, then: { say: ["You worried about the first lap?"], opts: [
        { tone: 'kind', t: ["A bit. Always. That's healthy.", "Everyone is. The ones who say they aren't are lying."], r: ["Honest."] },
        { tone: 'firm', t: ["No. I know where the grip is.", "Worried? No. Ready."], r: ["Good."] } ] } },
      { tone: 'light', t: ["I've brought an umbrella for the cockpit.", "If it rains I'm swapping to a boat."], r: ["Ha!", "Good luck steering that."] },
      { tone: 'cold', t: ["Weather's weather.", "Can't change it, can't talk about it."], r: ["Fine.", "Right."] },
    ] },
  // ---- this circuit ------------------------------------------------------------------------------------------------
  circuit: { who: ['driver', 'eng', 'celeb', 'press', 'mech'], w: 1.4, open: [
    "What's the trick to {corner}? I lose time there every lap.", "Love this place or hate it? {track}, I mean.", "Where's the overtaking going to happen today?", "Grip's different from yesterday in {corner}. Noticed?" ],
    opts: [
      { tone: 'kind', t: ["Brake a touch earlier, carry it through the middle. That's all.", "It's all about the exit. Give up the entry."], r: ["Huh. Thanks. Really.", "Might try that."], m: 2, then: { say: ["Why are you helping me?", "Seriously? You're telling me that?"], opts: [
        { tone: 'kind', t: ["Because racing's better when everyone's quick.", "You'd do the same."], r: ["Would I? ...Yeah. Maybe."] },
        { tone: 'light', t: ["Because I've already found the next trick.", "Who says it's the right advice?"], r: ["Ha. Of course."] },
        { tone: 'cruel', t: ["Doesn't matter. You'll still get it wrong.", "Because I'm not worried about you."], r: ["Wow."], m: -3 } ] } },
      { tone: 'firm', t: ["Into {corner}, on the brakes. Late and committed.", "End of the long straight. DRS does the rest."], r: ["Same thought.", "Yeah, if you get the run."], then: { say: ["You'd try it there on lap one?"], opts: [
        { tone: 'firm', t: ["If the gap's there.", "Only if it's on."], r: ["Fair."] },
        { tone: 'light', t: ["On lap one I try it everywhere.", "Lap one is for heroes."], r: ["Heroes and gravel."] } ] } },
      { tone: 'light', t: ["The trick is a faster car.", "Close your eyes and hope."], r: ["Very useful.", "Ha."] },
      { tone: 'cold', t: ["Work it out yourself.", "Not giving that away."], r: ["Suit yourself.", "Fair."], m: -1 },
    ] },
  // ---- form, the last race -------------------------------------------------------------------------------------------
  form: { who: ['driver', 'boss', 'press', 'mech'], w: 1.3, open: [
    "Good weekend so far for you?", "How did you feel about last time out?", "You've looked sharp this weekend. Something change?", "Rough couple of races. Head in the right place?" ],
    opts: [
      { tone: 'kind', t: ["The team's done an amazing job. It's on them.", "Feels like everything's clicking."], r: ["Good to hear.", "Long may it last."], then: { say: ["What changed?"], opts: [
        { tone: 'firm', t: ["Setup. We finally understood the car.", "Me. I stopped overthinking it."], r: ["Makes sense."] },
        { tone: 'light', t: ["New lucky socks.", "Less sleep, more coffee."], r: ["Ha. Science."] } ] } },
      { tone: 'firm', t: ["Last race is gone. Only today matters.", "I've moved on. Head down, eyes up."], r: ["Right answer.", "That's the mindset."] },
      { tone: 'light', t: ["Good? I'm still here, aren't I?", "Ask me again in two hours."], r: ["Ha. Will do.", "Deal."] },
      { tone: 'cruel', t: ["Better than yours.", "Why, worried?"], r: ["Okay then.", "Wow."], m: -2 },
    ] },
  // ---- fitness, the neck, the heat, the cold --------------------------------------------------------------------------
  fitness: { who: ['driver', 'celeb'], w: 1, open: [
    "How's the neck holding up? This place is brutal.", "Did your trainer make you do that horrible ice bath again?", "How much do you lose in a race? Weight, I mean.", "Are you actually as fit as they say?" ],
    opts: [
      { tone: 'kind', t: ["Sore. Worth it.", "Hurts every Monday. Every single one."], r: ["Same. Ice and painkillers.", "Ha. Glad it's not just me."], then: { say: ["What's the worst part of the training?"], opts: [
        { tone: 'light', t: ["The neck harness. Like being strangled by a gym.", "The cardio. I hate cardio."], r: ["Ha. Brutal."] },
        { tone: 'kind', t: ["Being away from home so much.", "The early mornings. Every day."], r: ["Yeah. That's the bit nobody sees."] } ] } },
      { tone: 'firm', t: ["Fitter than I've ever been.", "Trained for exactly this."], r: ["Good for you.", "It shows."] },
      { tone: 'light', t: ["My neck has its own neck now.", "Two or three kilos. And all my patience."], r: ["Ha!", "That tracks."] },
      { tone: 'cold', t: ["Fine.", "Not something I talk about."], r: ["Right.", "Fair."] },
    ] },
  // ---- rituals, superstition ---------------------------------------------------------------------------------------
  ritual: { who: ['driver', 'mech', 'celeb', 'press'], w: 1, open: [
    "Do you still do the left glove first thing?", "Any lucky charm in the car today?", "What's your last thought before the visor goes down?", "Got a pre-race playlist?" ],
    opts: [
      { tone: 'kind', t: ["Left glove, left boot, right boot. Every time.", "A photo of my family, taped inside the cockpit."], r: ["That's lovely.", "Ha. I knew it."], then: { say: ["What happens if you get it wrong?"], opts: [
        { tone: 'light', t: ["I start again from the boots.", "Disaster. Absolute disaster."], r: ["Ha. Fair."] },
        { tone: 'firm', t: ["Nothing. It's just a habit.", "I race anyway."], r: ["Sensible."] } ] } },
      { tone: 'firm', t: ["No charms. Just preparation.", "My last thought is turn one. Nothing else."], r: ["Very focused.", "Respect."] },
      { tone: 'light', t: ["Whatever's playing in my head. Usually something terrible.", "That I forgot to go to the toilet."], r: ["Ha!", "Every time."] },
      { tone: 'cold', t: ["I don't do superstition.", "Why does everyone ask that?"], r: ["Sorry.", "Okay."] },
    ] },
  // ---- the future, contracts, silly season -------------------------------------------------------------------------------
  future: { who: ['driver', 'boss', 'press'], w: 1.2, open: [
    "Heard any whispers about next year?", "{XT} are supposedly looking around. You heard that?", "Your contract talk going well?", "Lot of seats moving this year. Nervous?" ],
    opts: [
      { tone: 'firm', t: ["Focused on this year. Results sort the rest.", "My future is the next two hours."], r: ["Classic answer.", "Fair."], then: { say: ["But if a top team called?"], opts: [
        { tone: 'firm', t: ["I'd listen. Anyone would.", "Then I'd make sure they had a reason to."], r: ["Honest."] },
        { tone: 'kind', t: ["I'm happy at {team}. They've backed me.", "Loyalty counts for something."], r: ["Nice to hear."], m: 1 } ] } },
      { tone: 'gossip', fx: 'about', t: ["I heard {X}'s seat isn't as safe as {X} thinks.", "{XT} aren't happy with {X}. Everyone knows."], r: ["Ooh. Careful.", "You didn't hear it from me."], then: { say: ["Where'd you hear that?"], opts: [
        { tone: 'light', t: ["The coffee machine knows everything.", "A mechanic. They always know."], r: ["Ha. True."] },
        { tone: 'sorry', t: ["Forget I said it. Not fair on {X}."], r: ["Said what?"] } ] } },
      { tone: 'light', t: ["Next year? I'll be a commentator.", "I've applied to drive the safety car."], r: ["Ha!", "You'd be good at it."] },
      { tone: 'cold', t: ["Not discussing it.", "Ask my manager."], r: ["Fine.", "Right."] },
    ] },
  // ---- sim racing, gaming --------------------------------------------------------------------------------------------
  sim: { who: ['driver', 'celeb', 'mech'], w: 0.9, open: [
    "Were you on the sim all night again?", "Saw you online last week. You were terrible at that shooter.", "Does the simulator actually help here?" ],
    opts: [
      { tone: 'kind', t: ["Every lap of this place, twice over.", "It helps. Learnt the new layout of {corner} there."], r: ["Dedication.", "Interesting."], then: { say: ["Is the sim harder than the real thing?"], opts: [
        { tone: 'firm', t: ["No. The real one bites back.", "Different hard. No fear on a sim."], r: ["That makes sense."] },
        { tone: 'light', t: ["The sim doesn't have a neck workout.", "The sim lets me crash for free."], r: ["Ha."] } ] } },
      { tone: 'light', t: ["I was carrying the team. They just didn't know.", "My controller was broken. Obviously."], r: ["Sure it was.", "Classic excuse."] },
      { tone: 'firm', t: ["Prep is prep. It all counts.", "It's a tool. I use it."], r: ["Fair."] },
      { tone: 'cold', t: ["I don't really game.", "No time for that."], r: ["Fair enough."] },
    ] },
  // ---- the fans, the crowd ---------------------------------------------------------------------------------------------
  fans: { who: ['driver', 'celeb', 'press', 'boss', 'mech'], w: 1.1, open: [
    "Have you seen the grandstands? Packed.", "A kid had your helmet design painted on their face by the fence.", "The fans have been waiting outside the hotel since six.", "Hear that? They're louder than the engines." ],
    opts: [
      { tone: 'kind', t: ["That's why we do it. For them.", "Gives me goosebumps every time."], r: ["Yeah. Same.", "Never gets old."], m: 1, then: { say: ["Anything you want to say to them?"], opts: [
        { tone: 'kind', fx: 'press', t: ["Thank you. Genuinely. We'll give you a show.", "Stay safe, enjoy it, make some noise."], r: ["Lovely."] },
        { tone: 'light', fx: 'press', t: ["Cheer louder when I overtake.", "Bring earplugs."], r: ["Ha."] } ] } },
      { tone: 'firm', t: ["Best way to thank them is a result.", "Then let's give them something to shout about."], r: ["Exactly.", "Love it."] },
      { tone: 'light', t: ["Most of them are here for the other guy.", "They're cheering for the hot dogs."], r: ["Ha. Probably.", "Can't blame them."] },
      { tone: 'cold', t: ["I don't really look at the stands.", "Can't hear them in the car anyway."], r: ["Shame.", "Fair."] },
    ] },
  // ---- safety (any day; not about the lost) ------------------------------------------------------------------------------
  safety: { who: ['driver', 'press', 'boss'], w: 0.8, open: [
    "Drivers' briefing went long. You agree with the new track limits?", "That run-off at {corner} still looks tight to me.", "Ever think about how fast we're actually going?" ],
    opts: [
      { tone: 'firm', t: ["Track limits are track limits. Respect them.", "It needs looking at. I'll raise it again."], r: ["Fair.", "I'll back you."], m: 1, then: { say: ["You'd push the FIA on it?"], opts: [
        { tone: 'firm', t: ["Every meeting until it's fixed.", "Yes. Loudly."], r: ["Good."] },
        { tone: 'kind', t: ["All of us should. Together.", "Safety's everyone's job."], r: ["Count me in."] } ] } },
      { tone: 'kind', t: ["Every day. That's why I respect everyone out there.", "We look after each other. That's the deal."], r: ["Good to hear someone say it.", "Yeah."], m: 2 },
      { tone: 'light', t: ["I try not to. Makes me want a smaller car.", "Fast? I'm on the limiter half the weekend."], r: ["Ha."] },
      { tone: 'cold', t: ["Not today.", "Talk to the stewards."], r: ["Right."] },
    ] },
  // ---- the media, social ---------------------------------------------------------------------------------------------------
  media: { who: ['driver', 'boss', 'celeb'], w: 0.9, open: [
    "Your video from yesterday's everywhere.", "How many interviews today? I've done eleven.", "Did you see what they wrote about you this week?" ],
    opts: [
      { tone: 'light', t: ["Twelve. I win.", "I've said 'we'll see' forty times today."], r: ["Ha. Champion.", "Same."] },
      { tone: 'kind', t: ["Part of the job. People want to know us.", "It's nice that people care, honestly."], r: ["Healthy attitude.", "Yeah."], then: { say: ["Do you read the comments?"], opts: [
        { tone: 'firm', t: ["Never. Rule one.", "Only the nice ones. Allegedly."], r: ["Wise."] },
        { tone: 'light', t: ["Only to find new nicknames.", "My mum reads them for me."], r: ["Ha."] } ] } },
      { tone: 'cold', t: ["I don't read it.", "Don't care."], r: ["Probably best.", "Fair."] },
      { tone: 'cruel', t: ["Unlike you, people want to interview me.", "Most of it was true. About you."], r: ["Ouch.", "Okay then."], m: -3 },
    ] },
  // ---- your team-mate (from someone else's mouth) ----------------------------------------------------------------------------
  mateTalk: { who: ['boss', 'eng', 'mech', 'press'], w: 1, when: (x) => !!x.mate, open: [
    "{mate} has been quick all weekend. Feel the pressure?", "You and {mate} - all good between you?", "We need both cars home. You and {mate} clear on that?" ],
    opts: [
      { tone: 'kind', t: ["{mate}'s been great. Pushes me every day.", "We get on. Honestly."], r: ["Good. That's how it should be.", "Glad to hear it."], m: 2 },
      { tone: 'firm', t: ["Pressure's good. Today I'm in front.", "Clear. Both cars home. Me first."], r: ["Ha. Fair.", "I'll take that."] },
      { tone: 'gossip', t: ["{mate} gets the better parts. Everyone can see it.", "{mate} talks a lot for someone that slow."], r: ["That's not true and you know it.", "Careful."], m: -2 },
      { tone: 'light', t: ["{mate} owes me dinner from the last bet.", "We're fine. {mate} just snores in the briefings."], r: ["Ha!", "Don't let them hear that."] },
    ] },
  // ---- the car, upgrades ---------------------------------------------------------------------------------------------------
  upgrades: { who: ['boss', 'eng', 'mech', 'driver', 'press'], w: 1, open: [
    "New floor's on. Feel any different?", "The lads were up till three fitting the new wing.", "Your car looked stable through {corner}. New parts?", "Is the upgrade working or not? Honestly." ],
    opts: [
      { tone: 'kind', t: ["It's working. Massive thanks to the factory.", "Feels planted. Huge effort from everyone."], r: ["They'll be glad to hear it.", "Good."], m: 2, then: { say: ["Where do you feel it most?"], opts: [
        { tone: 'firm', t: ["High speed. {corner} is flat now.", "Braking. It's so much more stable."], r: ["That's what we hoped."] },
        { tone: 'light', t: ["In my bank balance, hopefully.", "In my confidence. And my lap times."], r: ["Ha."] } ] } },
      { tone: 'firm', t: ["Small step. Right direction.", "Too early to say. Ask me after the race."], r: ["Fair.", "We'll see."] },
      { tone: 'light', t: ["It's faster. Mostly in the garage.", "Feels the same, just more expensive."], r: ["Ha. Don't tell the boss.", "Very good."] },
      { tone: 'cruel', t: ["It's a nice paperweight.", "Took them long enough."], r: ["...Right.", "They worked all night for that."], m: -3 },
    ] },
  // ---- the pit stops (the mechanics, the engineer) -------------------------------------------------------------------------
  pitPractice: { who: ['mech', 'eng', 'boss'], w: 1.2, open: [
    "We did eighty practice stops yesterday. Best was 1.9.", "Rear left gun was sticking. Fixed now. Probably.", "Come in straight on the marks and we'll do the rest." ],
    opts: [
      { tone: 'kind', t: ["You lot are the best crew in the pit lane.", "I'll hit my marks. Promise."], r: ["Get off. ...Thanks.", "You'd better."], m: 2, then: { say: ["Sub two seconds today, then?"], opts: [
        { tone: 'light', t: ["Sub two and the drinks are on me.", "Sub two and I'll learn everyone's name. Properly."], r: ["Deal. Everyone heard that!"] },
        { tone: 'firm', t: ["Clean is better than quick.", "Just no mistakes."], r: ["Clean it is."] } ] } },
      { tone: 'light', t: ["'Probably' isn't the word I wanted to hear.", "If it sticks, I'm blaming you on the radio."], r: ["Ha. It's fine. Probably.", "Fair."] },
      { tone: 'firm', t: ["Good. Every tenth counts today.", "Then we win it in the box."], r: ["That's the plan."] },
      { tone: 'cruel', t: ["Last time I sat there for five seconds.", "Try not to lose a wheel this time."], r: ["...That wasn't my gun.", "We know."], m: -3 },
    ] },
  // ---- the guests' extra questions -------------------------------------------------------------------------------------------
  celebQ: { who: ['celeb'], w: 2.5, open: [
    "Who's your favourite driver? Apart from you.", "Can I sit in it? Just for a second?", "What do all the buttons on the wheel do?", "How do you go to the toilet in there? Sorry. I have to know.", "Is it scarier at night?", "What do you think about right before the lights go out?" ],
    opts: [
      { tone: 'kind', t: ["Ha. Let me show you something on the wheel instead.", "Great question. Honestly? Everyone asks."], r: ["Oh, amazing!", "I knew it!"], m: 1, then: { say: ["Is it true you feel five g in the corners?", "Do you ever get to enjoy it? The speed?"], opts: [
        { tone: 'kind', t: ["About five, yes. Your head weighs a small person.", "On the out-lap. Then it's work."], r: ["Unbelievable."] },
        { tone: 'light', t: ["Five g, two hot dogs. The usual.", "Only when I'm winning."], r: ["Ha!"] },
        { tone: 'firm', t: ["Every lap. That's why we do it.", "Enjoy it? I live for it."], r: ["I can see that."] } ] } },
      { tone: 'light', t: ["You don't want to know. Trust me.", "The answer is 'you hold it'. Very bravely."], r: ["Oh no.", "I wish I hadn't asked."] },
      { tone: 'firm', t: ["Sorry - no sitting in the car before the race. Rules.", "Ask me after the race. I'll show you."], r: ["Of course. Sorry!", "Deal!"] },
      { tone: 'cruel', t: ["Do you ask every driver stupid questions?", "Please don't touch the car."], r: ["Oh. Sorry.", "...Okay."], m: -3 },
    ] },
  // ---- the press's extra questions ----------------------------------------------------------------------------------------------
  pressQ: { who: ['press'], w: 2.5, open: [
    "Is this the best car you've ever driven?", "There's talk of a team-orders row at {team}. True?", "What would a podium mean today?", "The rookies have impressed this year. Any you'd rate?", "Your team principal says you're the future of {team}. Pressure?" ],
    opts: [
      { tone: 'kind', fx: 'press', t: ["Everyone at {team} deserves a good day. That's what I want.", "It would mean everything to the people back at the factory."], r: ["Lovely.", "Thank you."], then: { say: ["And for you personally?"], opts: [
        { tone: 'kind', fx: 'press', t: ["Proof that the work is paying off.", "A phone call to my family I'll never forget."], r: ["Thank you."] },
        { tone: 'firm', fx: 'press', t: ["Just the start.", "That I belong here."], r: ["Strong words."] } ] } },
      { tone: 'firm', fx: 'press', t: ["No row. We race hard and we talk.", "Pressure is a privilege. I'll take it."], r: ["Good answer.", "Noted."] },
      { tone: 'light', fx: 'press', t: ["Best car? It's the only one they'd give me.", "A podium would mean a very loud night."], r: ["Ha!", "I'll hold you to that."] },
      { tone: 'cruel', fx: 'pressAbout', t: ["Ask {X} about team orders. They know all about losing.", "The rookies? Some of them should still be in karts."], r: ["I'll print that.", "Strong."], m: -2 },
      { tone: 'cold', t: ["No comment.", "Next question."], r: ["Of course.", "Thank you."] },
    ] },
  // ---- the engineer: the start, the warm-up, the radio ---------------------------------------------------------------------------
  engStart: { who: ['eng'], w: 2, open: [
    "Start procedure as practised: bite point, then hold it. Don't over-rev.", "Formation lap: two hard brake tests, weave on the straights, temps up front.", "If the radio goes quiet on lap one, that's on purpose. Drive.", "Code for the rain plan is 'Plan Charlie'. Remember it." ],
    opts: [
      { tone: 'firm', t: ["Copy. Bite point, hold.", "Two brake tests, weave, temps. Got it."], r: ["Good.", "That's it."], then: { say: ["Anything you want me to keep off the radio?"], opts: [
        { tone: 'firm', t: ["The gaps behind, unless they're closing.", "Lap times. Just tell me if I'm slow."], r: ["Will do."] },
        { tone: 'kind', t: ["Nothing. I like hearing you. Keeps me calm.", "Just keep talking to me. It helps."], r: ["You got it."], m: 2 } ] } },
      { tone: 'light', t: ["Plan Charlie: drive like Charlie would.", "What if I forget the code for the code?"], r: ["Ha. Please don't.", "Then I'll say it slowly."] },
      { tone: 'kind', t: ["Thanks for all the work this weekend. Seriously.", "We've got this. Proud of us."], r: ["Thank the whole team when you win.", "We have."], m: 2 },
      { tone: 'cruel', t: ["I've done more starts than you've had hot dinners.", "Just don't mess up the strategy call this time."], r: ["...Copy.", "Noted."], m: -3 },
    ] },
};

/** the weather line for the opener, from the conditions */
export function weatherLine(x) {
  if (x.wet > 0.5) return "This rain isn't stopping. Spray's going to be horrible at the start.";
  if (x.wet > 0.2) return "Damp in places. Off the line will be a lottery.";
  return x.night ? "Cold tonight. The tyres are going to be like ice on the formation lap." : "Track's hot. The rears are going to suffer.";
}
