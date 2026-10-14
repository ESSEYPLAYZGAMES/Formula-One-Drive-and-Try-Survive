// The fourth batch of grid talk for ui/GridWalk.js (same shape as GridTalk.js: who, w, when, open, opts with t / r /
// then; every line is a pool), for the people the driver-life update brings onto the grid.
// The stars (kind 'star': the twelve celebrities of career/Celebs.js - every one made up, every one an adult): saying
// hello for the first time, small talk about her work and the race, compliments, a little flirting, asking her to
// dinner after the race, a word with your partner before you get in ("don't do anything stupid out there"), an
// awkward hello with an ex, and a frosty one when your partner has heard you were flirting - plus a topic of her own
// each, the things only she would bring up. The drivers with something against you (last race, what you said about
// them earlier on the grid, a stirrer winding you up): their hostile branches can end in [Give him a shove] (fx 'jab'),
// which closes the talk and starts the shove. The crew and the reporter on the week's stories: a scuffle, penalty
// points, the tabloids, your partner, a slump, a great drive.
// On top of GridTalk.js's tokens: {her} the star's first name, {job} what she does (only ever inside quotes, as her pass
// shows it, so its capital letter reads right), {herWork} something she is busy with (only in your [action] lines: the
// pool is written about her: 'her Friday-night radio show'), {partner} your partner's first name. fx is a string or a list (meet, flirt,
// askout, charm, partner, press, pressAbout, jab). when(x, n) reads n.celebId / n.stage / n.grieving and x.partner /
// x.L / x.crisis / x.points / x.brawled - and, where the walk provides them, x.flirted (you flirted with another star
// while seeing someone), x.brawled.walkedAway, n.accepted (she said yes to a date you have not had) and n.jabbed (you
// shoved him earlier on this walk). Romance stays PG - compliments, dinners, being seen together - and a scuffle is a
// shove, nothing more. On a memorial weekend (x.L) there is no flirting, no banter and no shoving, only quiet words;
// nor with someone who is grieving. Nobody wishes anyone harm.

const st = (n) => n.stage || 'stranger';
const at = (n, ...s) => s.includes(st(n));
/** an ordinary day for her: not a memorial weekend, and she is not grieving -> bool */
const calm = (x, n) => !x.L && !n.grieving;
/** her own topic: this star, on an ordinary day, and not an ex -> a when() */
const own = (id) => (x, n) => n.celebId === id && calm(x, n) && st(n) !== 'ex';
/** a driver can be squared up to: no memorial, no scuffle on this walk already -> bool */
const heated = (x) => !x.L && !x.brawled;
/** there was a shoving match on this walk (not one you walked away from) -> bool */
const scuffled = (x) => !!x.brawled && !x.brawled.walkedAway;
/** he is the one you scuffled with -> bool */
const foe = (x, n) => !!x.brawled && (n.name === x.brawled.name || (!!n.did && n.did === x.brawled.did));
/** one of the three who like trouble (Celebs traits.wreck), on an ordinary day, while you are with someone else who is not her -> bool */
const TROUBLE = ['ava-rennick', 'zoe-hartley', 'elena-marchetti'];
const trouble = (x, n) => TROUBLE.includes(n.celebId) && calm(x, n) && !!x.partner && !!x.partnerName && !String(n.name || '').startsWith(x.partnerName);

// the action that ends a hostile talk in a shove (the topics carrying it are gated on !x.L as well)
const SHOVE = { tone: 'cruel', t: ["[Give him a shove]"], fx: 'jab', when: (x) => !x.L };
const WALK = { tone: 'leave', t: ["[Walk away]"], end: true };
// her answer to being asked out comes after the race (Celebs.askOut, a toast): until then she keeps you guessing
const MAYBE = { say: ["I'll think about it while you're driving. Don't do anything daft.", "Check your phone after the race. That's all I'm saying."], opts: [
  { tone: 'kind', t: ["Take all the time you need.", "No pressure. Honestly."], r: ["...Okay. Good.", "That helps, actually."] },
  { tone: 'flirt', fx: 'flirt', t: ["That's going to be a very long race.", "Then I'll drive faster."], r: ["Ha. Go on, then.", "Good. Go."] },
  { tone: 'light', t: ["I'll be checking it on the cool-down lap.", "My engineer is going to be furious."], r: ["Don't you dare.", "Ha. Worth it."] },
  { tone: 'show', t: ["Then I'd better win something worth celebrating.", "You'll want a winner at dinner. I'll sort that out."], r: ["Hm. We'll see.", "No pressure, then."] } ] };
// your partner, as you go to the car
const PARTING = { say: ["I'll be in the garage. Wave if you can - don't if you can't.", "I'm going to stand with your mechanics and pretend I understand the screens."], opts: [
  { tone: 'kind', t: ["I'll find you after. Whatever happens.", "I'll come straight to you after."], r: ["You'd better.", "Good."] },
  { tone: 'firm', t: ["I'll bring it home. Promise.", "Clean and quick. Promise."], r: ["I know you will.", "Good. I'm holding you to it."] },
  { tone: 'light', t: ["If I wave, it's to you. If I don't, it's still to you.", "Ask the mechanics to explain the screens. Then explain them to me."], r: ["Ha. Go on, you.", "Ha. Deal."] },
  { tone: 'flirt', fx: 'flirt', t: ["I'll miss you for about two hours.", "Save me the first hug after."], r: ["Two hours. I'm counting.", "It's yours. Go."] } ] };
// after a jealous moment: what she asks of you
const STRAIGHT = { say: ["We'll talk properly after. Just don't make me find things out from a newspaper.", "I need you to be straight with me. Always. That's all."], opts: [
  { tone: 'kind', t: ["Always. I promise.", "You'll hear everything from me first."], r: ["Okay. Go and race.", "...Okay. Go on."] },
  { tone: 'firm', t: ["You won't have to. Ever.", "Straight. Always."], r: ["Good.", "Good. Go."] },
  { tone: 'light', t: ["I'll start a newsletter. One subscriber: you.", "From now on, daily updates. Very boring ones."], r: ["...Idiot. Go on.", "Ha. Fine. Go."] },
  { tone: 'cold', t: ["Fine.", "Okay."], r: ["...Right.", "Right."] } ] };

// =====================================================================================================================
// the topics
// =====================================================================================================================
export const TOPICS4 = [
  // ---- the stars: the first hello --------------------------------------------------------------------------------------
  { id: 'starMeet', who: ['star'], w: 7, when: (x, n) => calm(x, n) && st(n) === 'stranger', open: [
    "Hi! I'm {her}. My pass says '{job} · guest', which makes me sound like a parcel. I'm allowed to say hello, apparently.", "So you're the one everybody keeps pointing at. Hello. I'm {her}.", "I've been standing here ten minutes working up the nerve to say hello. So. Hello. I'm {her}.", "Am I in the way? Everyone here walks like they're late for something." ],
    opts: [
      { tone: 'kind', fx: 'meet', t: ["Hello, {her}. Lovely to meet you - and nobody minds a hello.", "Hi, {her}. Welcome to the grid. You're very welcome here."], r: ["Oh, good. Everyone else looks terrifying.", "Thank you. You're friendlier than your helmet."], then: { say: ["Do you get nervous, or is that a stupid question?", "Are you nervous? Right now? Sorry - is that a stupid question?"], opts: [
        { tone: 'kind', t: ["A bit, every time. Then I get busy - engineers, belts, radio checks.", "Busy, then nervous, then very calm. In that order."], r: ["That's oddly reassuring.", "Very calm. I could never."] },
        { tone: 'light', t: ["Only about where I parked.", "My knees get nervous. The rest of me is a professional."], r: ["Ha! Good to know you're human.", "Ha. I'll keep an eye on you."] },
        { tone: 'show', t: ["Nervous? Beating this grid is routine stuff.", "Nervous? No. Watch the start and you'll see why."], r: ["Wow. Modest, too.", "I'll be watching. Closely."] },
        { tone: 'flirt', fx: 'flirt', t: ["A bit less, now you're here.", "Not if you're still here for the start."], r: ["Smooth. Do they teach that at driving school?", "I've got a very good seat. We'll see."] } ] } },
      { tone: 'light', fx: 'meet', t: ["You're only in the way if you're a car. Are you a car?", "Don't worry - we all walk like that. It's the boots."], r: ["Ha! Good. I'll stop apologising, then.", "Ha. Then I'll walk faster and look important."], then: { say: ["So what do I actually watch? Everyone keeps saying 'the start' like it's obvious.", "What should I watch for? I don't want to cheer at the wrong moment."], opts: [
        { tone: 'kind', t: ["The start, the first three corners, then the pit stops. That's most of the race.", "The start, then the pit wall's faces. They tell you everything."], r: ["Start, corners, stops. Got it.", "Ha. Faces. I'm good at faces."] },
        { tone: 'light', t: ["Watch the pit wall. They look worried for a living.", "Cheer when everyone else does. Nobody will know."], r: ["Ha! Worried for a living.", "Ha. That's my plan for most things."] },
        { tone: 'flirt', fx: 'flirt', t: ["Watch my car. Purely for research.", "Watch me. I'll try to make it worth your while."], r: ["For research. Of course.", "Big promise."] },
        { tone: 'cold', t: ["Just watch the screens.", "The screens. They show everything."], r: ["Right. Thanks.", "Okay. Thanks."] } ] } },
      { tone: 'show', fx: 'meet', t: ["They point because I'm quick. You've got good instincts.", "You've found the best driver on the grid. Well done."], r: ["Do you say that to everyone who says hello?", "Is that a fact or a sales pitch?"], then: { say: ["Go on, then. Convince me.", "Prove it, then."], opts: [
        { tone: 'show', t: ["Watch the first lap. That's my whole argument.", "Stay for the podium. That's the proof."], r: ["Fine. One lap.", "I might."] },
        { tone: 'kind', t: ["Honestly? The car's the team's work. I just try not to waste it.", "I'm joking. Mostly. The team do the hard part."], r: ["That's a much nicer answer.", "I like that better."] },
        { tone: 'flirt', fx: 'flirt', t: ["Stay for the podium and find out.", "Have dinner with me some time and I'll show you the data."], r: ["Bold. I'll think about it.", "The data. How romantic."] },
        { tone: 'light', t: ["I can't. I've just heard myself.", "I can't. My engineer would laugh."], r: ["Ha. Good. Self-awareness.", "Ha. Honest, at least."] } ] } },
      { tone: 'cold', fx: 'meet', t: ["Sorry - I'm a bit busy.", "Can we do this after the race?"], r: ["Oh - of course. Sorry.", "Right. Good luck, then."] },
    ] },
  // ---- the stars: new to all this, or a fan -----------------------------------------------------------------------------
  { id: 'starFan', who: ['star'], w: 5, when: (x, n) => calm(x, n) && st(n) === 'stranger', open: [
    "Confession: I know nothing about Formula 1. My manager told me to smile and nod.", "My dad's your biggest fan. He made me promise to come and say hello - and not to touch anything. So... hello!", "First time on a grid. I've been told not to step on any cables. Which ones are cables?" ],
    opts: [
      { tone: 'kind', fx: 'meet', t: ["Hello! Ask me anything - there are no stupid questions on a grid.", "Welcome! Stick with me a minute and I'll show you round."], r: ["Oh, you're lovely. Okay. I've got about forty questions.", "Really? Okay. Don't let me touch anything expensive."], then: { say: ["First question: why are the tyres different colours?", "Okay - the tyres. Why are they all different colours?"], opts: [
        { tone: 'kind', t: ["Different rubber. The soft is quick but wears out; the hard lasts but it's slower.", "The softer the tyre, the faster it is - and the sooner it's finished."], r: ["Like heels and trainers. Got it.", "So it's a trade-off. I can do trade-offs."] },
        { tone: 'light', t: ["So the people at home can tell who's on what. And because it looks nice.", "Fashion. Purely fashion."], r: ["Ha. I'll pretend I believe you.", "I knew it."] },
        { tone: 'show', t: ["Doesn't matter. I'm fast on all of them.", "Ask me which one I'm best on. Trick question: all of them."], r: ["Right. Of course you are.", "Hm. Modest."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'll explain properly over a coffee some time.", "Long story. Better told over dinner."], r: ["Is that a tyre lesson or an invitation?", "Smooth. Very smooth."] } ] } },
      { tone: 'light', fx: 'meet', t: ["Rule one: if it's hot, don't touch it. Rule two: everything's hot.", "Don't worry - half the people here are just smiling and nodding."], r: ["Ha. Noted. I'm {her}, by the way. My pass says '{job}'. Everyone else here says 'lost'.", "Ha! I'm {her}, by the way. It says '{job}' on my pass, but today I'm mostly a tourist."] },
      { tone: 'show', fx: 'meet', t: ["You've found the right driver, then. I'm the interesting one.", "Stick with me. I'll be the one at the front."], r: ["Are you, now?", "Everyone's said that to me this morning. Everyone."] },
      { tone: 'cold', fx: 'meet', t: ["Sorry - not now.", "Maybe after the race."], r: ["Oh. Of course.", "Right. Sorry."] },
    ] },
  // ---- the stars: hello again --------------------------------------------------------------------------------------------
  { id: 'starHello', who: ['star'], w: 5, when: (x, n) => calm(x, n) && at(n, 'met', 'friendly', 'flirting'), open: [
    "Hello again! I was hoping I'd bump into you.", "We keep ending up by the same car. People will talk.", "You again! I told my friends I know a racing driver now. Don't make me a liar." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["[Ask {her} how {herWork} is going]", "[Ask {her} about {herWork} - properly]"], r: ["You remembered! It's... a lot. Good, but a lot.", "Oh, that's nice of you to ask. It's going. Slowly. Beautifully. Slowly.", "Nobody ever asks about that. Thank you. It's hard, and I love it."], then: { say: ["Do you ever get a day off, or is that a myth?", "How do you switch off from all this? Do you?"], opts: [
        { tone: 'kind', t: ["Not often. When I do, I call home and sleep.", "A walk with no phone. Best hour of the week."], r: ["That sounds perfect.", "I should try that."] },
        { tone: 'light', t: ["A day off is when I only go to the gym once.", "I switch off by watching other people race. Very healthy."], r: ["Ha. Tragic.", "Ha. Very healthy."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'd take a day off for the right company.", "I'm working on it. This is helping."], r: ["Careful. I might hold you to that.", "Is it? Good."] },
        { tone: 'firm', t: ["Not really. It's one long race until the winter.", "I don't. Not during a season."], r: ["That's a lot.", "Wow. Okay."] } ] } },
      { tone: 'light', t: ["We have to stop meeting like this. Actually - we don't.", "Hello again. I was told the grid would be boring. Nobody mentioned you."], r: ["Ha. No, we don't.", "Ha. Boring's overrated."] },
      { tone: 'flirt', fx: 'flirt', t: ["I was hoping the same. Don't tell anyone.", "I may have walked past this car three times on purpose."], r: ["Your secret's safe. Mostly.", "Three times? I counted four."] },
      { tone: 'cold', t: ["Hi. Sorry, can't stop.", "Hey. I've got to get ready."], r: ["Oh. Okay. Good luck.", "Right. Sure."] },
    ] },
  // ---- the stars: her work -----------------------------------------------------------------------------------------------
  { id: 'starWork', who: ['star'], w: 3, when: (x, n) => calm(x, n) && !at(n, 'stranger', 'ex'), open: [
    "Work has eaten my whole week. Talk to me about anything else. Please.", "Can I moan about work for a minute? Nobody here knows what I do. It's bliss.", "Everyone keeps asking me about work today. You're not going to, are you?" ],
    opts: [
      { tone: 'light', t: ["[Ask {her} about {herWork} anyway]", "[Ask about {herWork}, with a straight face]"], r: ["You monster. ...Fine. It's going well. Don't tell anyone I said so.", "Unbelievable. ...It's good, actually. Really good. Happy now?"] },
      { tone: 'kind', fx: 'charm', t: ["Moan away. I'm a very good listener until the five-minute board.", "Talk about anything you like. I'm all yours till they call us to the cars."], r: ["You might regret that offer.", "That's... actually really nice. Thank you."], then: { say: ["What do you do when the job gets too much?", "How do you switch off, when it's all too much?"], opts: [
        { tone: 'kind', t: ["Call home. It puts everything back in proportion.", "Walk somewhere with no phone. Works every time."], r: ["I like that.", "I should try that."] },
        { tone: 'light', t: ["Go karting. The job, but smaller and sillier.", "Eat an entire cake. Professionally."], r: ["Ha! I love that.", "Ha. Respect."] },
        { tone: 'flirt', fx: 'flirt', t: ["Talk to someone like you, ideally.", "This. This is helping."], r: ["Good answer.", "Is it? I'm glad."] },
        { tone: 'firm', t: ["I don't, really. Not mid-season.", "I train. It's the only off switch I've got."], r: ["That sounds exhausting.", "Remind me never to be a racing driver."] } ] } },
      { tone: 'light', t: ["Anything else? Right. Let me tell you about tyre pressures for an hour.", "I won't ask. I'll just nod wisely."], r: ["Oh no. Actually - go on, it's weirdly soothing.", "Ha. Perfect. Keep nodding."] },
      { tone: 'show', t: ["Try being up at four for the simulator.", "At least nobody times you to the thousandth of a second."], r: ["Oh, is this a competition now?", "Okay. You win. Is that what you wanted?"], m: -1 },
      { tone: 'cold', t: ["Sorry - I need to get my head in the race.", "Not really my area, sorry."], r: ["Of course. Sorry.", "Fair enough."] },
    ] },
  // ---- the stars: your chances today ---------------------------------------------------------------------------------------
  { id: 'starRace', who: ['star'], w: 3, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "Be honest: what are your chances today?", "My friends have a bet on where you'll finish. What do I tell them?", "Are you going to win? I need to know how loudly to cheer." ],
    opts: [
      { tone: 'firm', t: ["From {pos}? Points at least. More if the start goes right.", "Good, if the {start}s last until lap {stop}."], r: ["I understood about half of that. Sounds good.", "I'll pretend I know what that means. Sounds good."], then: { say: ["What's the bit that worries you?", "What could go wrong?"], opts: [
        { tone: 'firm', t: ["Turn 1. Everyone wants the same piece of road.", "The first stint. If the tyres go early, it's a long afternoon."], r: ["Turn 1. Noted.", "I'll cross my fingers for the tyres."] },
        { tone: 'kind', t: ["Honestly? Nothing, as long as everyone gets home safe.", "Not much. The team's done everything right."], r: ["That's a lovely answer.", "Good."] },
        { tone: 'light', t: ["My start. My strategy. My face on the big screen.", "Everything. Fun, isn't it?"], r: ["Ha!", "Ha. Very fun."] },
        { tone: 'flirt', fx: 'flirt', t: ["You being here. It's very distracting.", "Nothing. Unless you wave at the wrong moment."], r: ["Then I'll stand very still.", "I'll wave at the right moment."] } ] } },
      { tone: 'kind', t: ["Tell them a clean race and points. That's a good day.", "Cheer for the whole team. They've earned it."], r: ["Sensible. Boring, but sensible.", "I'll cheer for all of them. Loudly."] },
      { tone: 'flirt', fx: 'flirt', t: ["Cheer as loudly as you like. I'll hear it.", "Tell them to bet on me. You're my lucky charm now."], r: ["I'm very loud. Be warned.", "No pressure, then."] },
      { tone: 'show', t: ["Win. Tell your friends to bet the house.", "Win. Cheer as loudly as you can manage."], r: ["Confident. I like it.", "Okay. If you don't, I'm blaming you."] },
    ] },
  // ---- the stars: this place -------------------------------------------------------------------------------------------------
  { id: 'starVenue', who: ['star'], w: 2.5, when: (x, n) => calm(x, n) && st(n) !== 'ex', open: [
    "First time in {city}. I keep stopping to stare at everything.", "Is it always like this here? The noise, the people - all of it?", "I got lost on the way in. Twice. Is there a map for this place?" ],
    opts: [
      { tone: 'kind', t: ["{venueLove}", "One of my favourite weekends of the year. Every year."], r: ["I can see why.", "I think it might be one of mine, too."], then: { say: ["What's your favourite bit? Not the track. The rest of it.", "If I had one free hour here, where should I go?"], opts: [
        { tone: 'kind', t: ["The people. Find a grandstand and just listen to them.", "Somewhere quiet with good coffee. Ask the mechanics - they always know."], r: ["That's a lovely answer.", "Noted. I'll ask."] },
        { tone: 'light', t: ["The hotel breakfast. Don't judge me.", "Anywhere the photographers aren't."], r: ["Ha. Honest.", "Ha. Good luck with that."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'll show you after the race. If you'd like.", "Stick with me and you'll find out."], r: ["I might hold you to that.", "Smooth."] },
        { tone: 'firm', t: ["Honestly? I only see the hotel, the paddock and the car.", "I've never looked. I'm here for the lap."], r: ["That's sad. And a bit impressive.", "You should look up sometimes."] } ] } },
      { tone: 'light', t: ["{venueJoke}", "I've been coming here for years and I still get lost."], r: ["Ha!", "That makes me feel much better."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll show you round properly after the race. If you'd like.", "Stick with me. I know all the shortcuts."], r: ["I might hold you to that.", "Do you, though?"] },
      { tone: 'firm', t: ["From the cockpit it's the lap. That's all I see.", "I see the hotel, the paddock and the car. In that order."], r: ["That's sad. And a bit impressive.", "You should look up sometimes."] },
    ] },
  // ---- the stars: compliments --------------------------------------------------------------------------------------------------
  { id: 'starCompliment', who: ['star'], w: 3, when: (x, n) => calm(x, n) && at(n, 'friendly', 'flirting', 'dating', 'partner'), open: [
    "Your helmet's beautiful. Who designed it? Tell me it was you.", "You look different in the overalls. Taller. More serious.", "Everyone keeps telling me you're the nicest driver on the grid. I'm checking." ],
    opts: [
      { tone: 'kind', t: ["That's kind of you. Thank you.", "Thank you - that's a lovely thing to say."], r: ["I mean it.", "You're welcome. It's true."] },
      { tone: 'flirt', fx: 'flirt', t: ["You look lovely today. If that's allowed on a grid.", "And you're the best thing I've seen all weekend."], r: ["It's allowed. Just about.", "Careful. People are watching."], then: { say: ["Do you say that to everyone on the grid?", "Is that a line? It sounds like a line."], opts: [
        { tone: 'flirt', fx: 'flirt', t: ["Only the ones I mean it about.", "It's not a line. Lines are on the track."], r: ["Hm. I'll allow it.", "Ha. Okay, that was a line."] },
        { tone: 'kind', t: ["Only to you, today. Honestly.", "No. I mean it."], r: ["...Okay. Thank you.", "That's sweet."] },
        { tone: 'light', t: ["Only to the mechanics. They love it.", "Mostly to my engineer. It makes the debriefs awkward."], r: ["Ha!", "Ha. Poor engineer."] },
        { tone: 'cold', t: ["Forget I said anything.", "Never mind."], r: ["Oh. Okay.", "Right."] } ] } },
      { tone: 'show', t: ["The overalls do some of the work. The rest is natural.", "Wait till you see me on the podium. Even better."], r: ["And modest, apparently.", "Hm. We'll see."] },
      { tone: 'light', t: ["Careful - compliments go straight to my lap times.", "Say that louder. My engineer's listening."], r: ["Then I'll keep them coming.", "Ha! Fine. You're wonderful. There."] },
    ] },
  // ---- the stars: a little flirting ---------------------------------------------------------------------------------------------
  { id: 'starFlirt', who: ['star'], w: 4, when: (x, n) => calm(x, n) && !x.partner && at(n, 'friendly', 'flirting'), open: [
    "You keep looking over here. Should I be flattered or worried?", "I've caught you looking over here three times now. I'm counting.", "Is there a reason you keep finding excuses to walk past?" ],
    opts: [
      { tone: 'flirt', fx: 'flirt', t: ["Flattered. Definitely flattered.", "Guilty. I'll stop. Actually, I won't."], r: ["Good answer.", "Hm. I'm not complaining."], then: { say: ["Is this what you do on every grid?", "Do you say that to everyone you meet on a grid?"], opts: [
        { tone: 'flirt', fx: 'flirt', t: ["Not every grid. Not everyone.", "Only when someone's worth getting distracted for."], r: ["Good answer.", "Smooth."] },
        { tone: 'kind', t: ["No. Honestly - I'm usually terrible at this.", "No. You're the first person I've wanted to talk to all weekend."], r: ["That's sweet.", "...Oh. Okay."] },
        { tone: 'light', t: ["Only at the races I'm losing.", "Usually I just stare at the tyres."], r: ["Ha!", "Lucky tyres."] },
        { tone: 'show', t: ["Every grid has a fan. Today it's you.", "Most people come over to me. You're making me work."], r: ["Is that what I am?", "Poor you."] } ] } },
      { tone: 'light', t: ["Worried. I've been told I have a staring problem.", "I'm checking the car's still there. It's behind you."], r: ["Ha. Is it serious?", "Ha. Very convincing."] },
      { tone: 'show', t: ["Most people are flattered. It's the overalls.", "People look at me all day. Nice to return the favour."], r: ["Most people, hm.", "How generous of you."] },
      { tone: 'cold', t: ["Sorry - miles away. Race face.", "Just thinking about the start."], r: ["Oh. Right.", "Of course. Sorry."] },
    ] },
  // ---- the stars: flirting with you, who are spoken for ------------------------------------------------------------------------
  { id: 'starFlirtTaken', who: ['star'], w: 4, when: (x, n) => calm(x, n) && !!x.partner && at(n, 'met', 'friendly', 'flirting'), open: [
    "I hear you're seeing someone. Lucky her.", "So the rumours are true? You're taken?", "Everyone says you're off the market. Shame, really." ],
    opts: [
      { tone: 'kind', t: ["I am. {partner}'s wonderful. You'd like her.", "Yes - and very happy about it."], r: ["Good for you. Honestly.", "That's lovely. She's lucky."], then: { say: ["How did you two meet?", "So how did it happen, you and {partner}?"], opts: [
        { tone: 'kind', t: ["On a grid, believe it or not. A lot like this.", "She said hello. I forgot my own name."], r: ["Ha. That's sweet.", "Aw."] },
        { tone: 'light', t: ["She was lost. I pretended to know the way.", "She laughed at my jokes. Nobody does that."], r: ["Ha!", "Classic."] },
        { tone: 'firm', t: ["That stays between us.", "I'd rather keep that private."], r: ["Of course.", "Fair."] },
        { tone: 'cold', t: ["Long story.", "Not really something I talk about."], r: ["Okay.", "Right."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Being taken doesn't mean I can't say you look great.", "Lucky me, I'd say. But you're very good company."], r: ["Careful. Cameras.", "Careful, racing driver."] },
      { tone: 'light', t: ["Off the market? I was never on it. I was in the garage.", "Taken. By my engineer, mostly."], r: ["Ha!", "Ha. Poor engineer."] },
      { tone: 'cold', t: ["I'd rather not talk about my private life.", "Let's keep it to the racing."], r: ["Of course. Sorry.", "Fair enough."] },
    ] },
  // ---- the stars: asking her out ------------------------------------------------------------------------------------------------
  { id: 'starAskOut', who: ['star'], w: 6, when: (x, n) => calm(x, n) && !x.partner && st(n) === 'flirting' && !n.accepted, open: [
    "So. Are you one of those drivers who vanishes straight after the race?", "I'm in town until Tuesday, by the way. Just so you know.", "Everyone keeps asking what I'm doing after the race. I keep saying 'nothing yet'." ],
    opts: [
      { tone: 'flirt', fx: ['askout', 'flirt'], t: ["Then let's fix that. Dinner, after the race? Somewhere without a single engine.", "Coffee after the race? I'll even wash my face first."], r: ["Are you asking me out on a grid, in front of forty cameras?", "Bold. Very bold."], then: MAYBE },
      { tone: 'kind', fx: 'askout', t: ["Would you like to have dinner with me some time? No cameras, no fuss.", "I'd really like to see you away from all this. Dinner?"], r: ["...That's very sweet.", "That's the nicest thing anyone's said to me all week."], then: MAYBE },
      { tone: 'light', fx: 'askout', t: ["If I finish in the points, dinner's on me. If I don't, dinner's still on me.", "I'm not one of those drivers. I'm one of the ones who buys dinner."], r: ["Ha. Is that an invitation?", "That's either very smooth or very clumsy."], then: MAYBE },
      { tone: 'cold', t: ["Straight to the airport, sorry. Debrief.", "We're on a plane by midnight, sadly."], r: ["Shame.", "Oh. Right. Of course."] },
    ] },
  // ---- the stars: she said yes, and you have not called yet (the date is arranged in THE WEEK) -----------------------------------
  { id: 'starAccepted', who: ['star'], w: 9, when: (x, n) => calm(x, n) && !!n.accepted && !at(n, 'dating', 'partner', 'ex'), open: [
    "So. I said yes. Then nothing. Are you always this slow off the line?", "I've kept an evening free, by the way. I'm not saying which one.", "I keep checking my phone. Not for you. Mostly for you." ],
    opts: [
      { tone: 'sorry', fx: 'charm', t: ["You're right - the week ran away with me. This week. I promise.", "I've been hopeless. Let me make it up to you - somewhere good."], r: ["...This week. I'm holding you to it.", "Hm. It had better be very good."], then: { say: ["So where are you taking me? Don't say a simulator.", "Go on, then. What did you have in mind?"], opts: [
        { tone: 'kind', t: ["Somewhere quiet, with good food and no cameras.", "Wherever you like. You choose, I'll book."], r: ["Good answer.", "Dangerous offer. I like it."] },
        { tone: 'light', t: ["Karting. You'd beat me, and I'd have to live with it.", "A simulator. ...I'm joking. Mostly."], r: ["Ha! Don't tempt me.", "Ha. You'd better be joking."] },
        { tone: 'flirt', fx: 'flirt', t: ["It's a surprise. A good one. I've had all week to plan it.", "Somewhere with a view you won't forget."], r: ["All week? Then it had better be perfect.", "...Okay. I'm intrigued."] },
        { tone: 'show', t: ["Somewhere they'll give us the best table. They know me.", "The best place in town. I'll make a call."], r: ["Hm. Let's hope they do.", "We'll see if they answer."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["I was saving it for after a good result. Wish me one.", "I wanted it to be perfect. It's nearly perfect."], r: ["Then go and get one. Quickly.", "Nearly. Hm. Hurry up."] },
      { tone: 'light', t: ["My calendar's run by a team of forty engineers. I'm negotiating.", "I was building up the courage. It's a slow build."], r: ["Ha. Tell them I outrank them.", "Ha. Build faster."] },
      { tone: 'cold', t: ["It's been a busy week.", "I'll sort it. Not now."], r: ["...Right. Busy.", "Okay. If you say so."], m: -2 },
    ] },
  // ---- the stars: seeing each other ---------------------------------------------------------------------------------------------
  { id: 'starDating', who: ['star'], w: 7, when: (x, n) => calm(x, n) && st(n) === 'dating', open: [
    "So. Last time was nice. Just so you know.", "My sister wants to know if you're 'a nice one'. I told her the jury's out.", "I told my agent I'm not working this weekend. I'm 'watching a friend'." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'm really glad you came. That's all.", "I've been looking forward to seeing you all week."], r: ["Me too. Don't make it weird.", "...Good. Me too."], then: { say: ["The photographers have started guessing about us. Are we telling people?", "Does your team know about us? Your engineer keeps smiling at me."], opts: [
        { tone: 'kind', t: ["When you're ready. Not a minute before.", "Whenever you want. I'm in no hurry."], r: ["Thank you. Really.", "Good. Me neither."] },
        { tone: 'firm', t: ["Let them guess. It's nobody's business yet.", "They'll find out when we tell them."], r: ["I like that.", "Good."] },
        { tone: 'light', t: ["My mechanics knew before I did.", "Everyone knows. My engineer can't keep a secret."], r: ["Ha! Of course they did.", "Ha. I'd noticed."] },
        { tone: 'flirt', fx: 'flirt', t: ["Let them look. I'm not hiding you.", "Let them guess. I'll just keep smiling."], r: ["...Good.", "Stop it. People are watching."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["You look happy. I'd like to think that's me.", "I'd like to spend a lot more time with you. If that's alright."], r: ["Maybe it is. A bit.", "...That's alright."] },
      { tone: 'light', t: ["Tell everyone I'm on my best behaviour.", "I've been told I'm 'a lot'. I'm working on it."], r: ["Ha. Sure.", "Ha. I'll be the judge of that."] },
      { tone: 'cold', t: ["Can we do this after? My head's in the race.", "Not now. Please."], r: ["...Of course. Sorry.", "Right. Fine."], m: -2 },
    ] },
  // ---- your partner, before you get in ------------------------------------------------------------------------------------------
  { id: 'starPartner', who: ['star'], w: 9, when: (x, n) => calm(x, n) && st(n) === 'partner', open: [
    "You've got that look again. Come here. ...Don't do anything stupid out there.", "I'm not saying good luck - apparently it's bad luck. So: don't do anything stupid.", "I've been told I'm not allowed to hug you in the overalls. I'm going to anyway." ],
    opts: [
      { tone: 'kind', fx: 'partner', t: ["[Take her hand]", "[Squeeze her hand]", "[Rest a hand on her arm]"], r: ["...There. That's better. Now go and be brilliant.", "Okay. You've got this. I've got you.", "...Okay. Go on, then. I'll be right here."], then: PARTING },
      { tone: 'flirt', fx: 'partner', t: ["Nothing stupid. Unless you count how much I'll miss you.", "I'll be quick. I'd like to get back to you."], r: ["Stop it. Go.", "...Good answer. Go on."], then: PARTING },
      { tone: 'firm', fx: 'partner', t: ["Nothing stupid. Just fast. I promise.", "I'll be careful. And quick."], r: ["Good. I'm holding you to that.", "Good. Go on, then."] },
      { tone: 'cold', t: ["Not now - I need to focus.", "I can't do this right now. Later."], r: ["...Right. Sorry. Go.", "Okay. Okay, I'll go."], m: -2 },
    ] },
  { id: 'starPartnerTalk', who: ['star'], w: 6, when: (x, n) => calm(x, n) && st(n) === 'partner', open: [
    "I brought you something. Don't laugh. It's a lucky... thing.", "Your mum texted me. Twice. She says eat something.", "I've watched last year's start six times. I still close my eyes for it." ],
    opts: [
      { tone: 'kind', fx: 'partner', t: ["Thank you for being here. It makes a difference.", "Having you here makes all of this easier."], r: ["Where else would I be?", "Good. I'm not going anywhere."], then: { say: ["Promise me you'll be careful.", "Come and find me after, whatever happens."], opts: [
        { tone: 'kind', t: ["I promise.", "Always. Whatever happens."], r: ["Good.", "Good. Go on."] },
        { tone: 'light', t: ["Careful is my middle name. My first name is 'late on the brakes'.", "I'll find you before I find the engineers."], r: ["Ha. Go on.", "Ha. They'll be thrilled."] },
        { tone: 'firm', t: ["Careful and quick. Like always.", "I'll be there."], r: ["Good.", "I know."] },
        { tone: 'flirt', fx: 'flirt', t: ["You first, then the champagne.", "You're the first thing I'll look for."], r: ["...Good answer.", "Good. Go, before I get soppy."] } ] } },
      { tone: 'light', fx: 'partner', t: ["If I'm nervous, it's your fault for being distracting.", "Whatever happens, at least one of us looks good today."], r: ["Ha. I'll take the blame.", "Ha. Flattery. Go on, then."] },
      { tone: 'flirt', fx: 'partner', t: ["Best thing on this grid is standing right in front of me.", "You're my lucky thing. You know that?"], r: ["Smooth. Very smooth.", "...Okay. That was nice."] },
      { tone: 'cold', t: ["Not now, please.", "Later. I need to think."], r: ["Okay. Sorry.", "Right. Later."], m: -2 },
    ] },
  // ---- the stars: an ex ------------------------------------------------------------------------------------------------------------
  { id: 'starEx', who: ['star'], w: 14, when: (x, n) => calm(x, n) && st(n) === 'ex', open: [
    "Oh. Hi. I didn't know you'd be... well. Obviously you'd be here.", "So. This is awkward. My publicist said to smile and keep walking.", "Hello. I wasn't going to come over. Then I thought not coming over was worse." ],
    opts: [
      { tone: 'kind', t: ["It's good to see you. Honestly.", "I'm glad you came over. Really."], r: ["...Yeah. You too.", "Okay. Good. That's... good."], then: { say: ["Are you doing alright? Really?", "Are you okay? Honestly?"], opts: [
        { tone: 'kind', t: ["Getting there. I hope you are too.", "I think so. Give it time."], r: ["...Yeah. Me too.", "Time. Yeah."] },
        { tone: 'light', t: ["Normal's overrated. This is nearly normal.", "We're managing a conversation. That's a start."], r: ["Ha. Fair.", "It is, I suppose."] },
        { tone: 'sorry', t: ["I'm sorry about how it ended. I handled it badly.", "I should have said this before: I'm sorry."], r: ["...Thank you. That helps.", "Okay. Thank you."] },
        { tone: 'firm', t: ["I'm fine. Focused on the season.", "I'm alright. Busy, but alright."], r: ["Good. That's good.", "Right. Good."] } ] } },
      { tone: 'sorry', t: ["I'm sorry. About how it all ended.", "I owe you an apology. A proper one."], r: ["...Thank you. I didn't expect that.", "Maybe. Not here, though."], then: { say: ["Can we just... be okay? Eventually?", "Maybe a coffee some time. As friends. Eventually."], opts: [
        { tone: 'kind', t: ["I'd like that. Whenever you're ready.", "Eventually sounds right."], r: ["Okay.", "Okay. Good."] },
        { tone: 'firm', t: ["Let's see how the season goes.", "Maybe. Let's not rush it."], r: ["Fair.", "Okay."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'd like that more than I should.", "A coffee sounds nice. Just a coffee."], r: ["Don't. Not yet.", "...Just a coffee."], m: -1 },
        { tone: 'cold', t: ["I don't think so.", "Probably not."], r: ["Right. Okay.", "...Okay."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["You look well. Really well.", "I've missed this. Talking to you."], r: ["Don't. Not here.", "...Please don't do that."], m: -1 },
      { tone: 'cold', t: ["Hi.", "I've got a race to get ready for."], r: ["Right. Good luck.", "Of course you have."] },
    ] },
  // ---- your partner heard you were flirting (a tabloid story, or the grid itself) ---------------------------------------------------
  { id: 'starJealous', who: ['star'], w: 25, when: (x, n) => calm(x, n) && at(n, 'partner', 'dating') && (x.crisis === 'scandal' || !!x.flirted), open: [
    "So. Anything you want to tell me before the photographers do?", "I've had three messages about you this morning. None of them were from you.", "Having fun today? You looked like you were having fun." ],
    opts: [
      { tone: 'sorry', fx: 'charm', t: ["I'm sorry. It was nothing, but I can see how it looked. That's on me.", "You're right to be upset. I'm sorry."], r: ["...Okay. Thank you for not pretending.", "Okay. I believe you. I think."], then: STRAIGHT },
      { tone: 'firm', t: ["It was a conversation. That's all it was.", "Nothing happened. Nothing's going to."], r: ["Then why does it feel like something?", "...Okay. If you say so."], then: STRAIGHT },
      { tone: 'light', t: ["You're the only one I'd buy a terrible lucky charm for.", "The photographers can make a sandwich look like a scandal."], r: ["Don't make me laugh. I'm annoyed.", "...That's a bit funny. I'm still annoyed."] },
      { tone: 'cold', t: ["Not now. I've got a race.", "Can we not do this here?"], r: ["Of course. The race.", "Fine. Later, then."], m: -2 },
    ] },
  // ---- the stars: the photographers ------------------------------------------------------------------------------------------------
  { id: 'starPhotographers', who: ['star'], w: 3, when: (x, n) => calm(x, n) && at(n, 'dating', 'partner'), open: [
    "There's a man with a very long lens who's followed me since the paddock gate.", "The Paddock Post rang my agent again. They've got a name for us. It's terrible.", "Every time I stand near you, forty cameras go off. Is that normal?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'll ask the team to keep them back. You shouldn't have to put up with that.", "I'm sorry. That comes with me, and it isn't fair on you."], r: ["...Thank you. That means a lot.", "It's alright. Well, it isn't. But thank you."], then: { say: ["Does it ever stop bothering you?", "How do you put up with it every week?"], opts: [
        { tone: 'kind', t: ["I think about the people I care about, not the lens.", "I remember they'll all be gone by Monday."], r: ["That helps.", "Monday. Okay."] },
        { tone: 'light', t: ["I pull a face in every photo. They've stopped using them.", "I wave. It confuses them."], r: ["Ha!", "Ha. I'm trying that."] },
        { tone: 'firm', t: ["You stop noticing. Mostly.", "You get used to it. You have to."], r: ["I'm not sure I will.", "Hm."] },
        { tone: 'flirt', fx: 'flirt', t: ["Easy. I look at you instead.", "I've got something better to look at."], r: ["...Smooth.", "Stop it."] } ] } },
      { tone: 'firm', t: ["Let them look. We're not hiding.", "Let them print what they like. We know what's true."], r: ["...I like that.", "Okay. Yes."] },
      { tone: 'light', t: ["Wave. It confuses them.", "Pull a face in every photo. They'll give up."], r: ["Ha! I'm doing that.", "Ha. They'll print that too."] },
      { tone: 'cold', t: ["It comes with the job.", "You'll get used to it."], r: ["I'm not sure I will.", "Will I?"], m: -1 },
    ] },
  // ---- the stars: she saw the scuffle ----------------------------------------------------------------------------------------------
  { id: 'starScuffle', who: ['star'], w: 8, when: (x, n) => calm(x, n) && scuffled(x), open: [
    "Was that you? Shoving someone by the cars? Everyone's talking about it.", "I just watched half the grid pull you two apart. Are you alright?", "Please tell me that wasn't what it looked like." ],
    opts: [
      { tone: 'sorry', t: ["It was stupid. I'm sorry you saw that.", "Not my finest moment. I'm fine. Honestly."], r: ["Okay. Just... breathe.", "As long as you're alright."], then: { say: ["What was it even about?", "Is it over now? Properly?"], opts: [
        { tone: 'kind', t: ["It's over. I'll shake his hand after the race.", "Nothing worth it. That's the stupid part."], r: ["Good.", "Okay."] },
        { tone: 'firm', t: ["It's done. I need to focus now.", "Over. Done. Racing."], r: ["Okay.", "Okay. Go."] },
        { tone: 'light', t: ["Who brakes later. The usual.", "A very passionate disagreement about Turn 1."], r: ["Ha. Unbelievable.", "Ha. Of course it was."] },
        { tone: 'cold', t: ["Doesn't matter.", "Leave it."], r: ["...Okay.", "Right."] } ] } },
      { tone: 'firm', t: ["It's sorted. I need to focus now.", "Things got heated. It's over."], r: ["Okay. If you say so.", "...Okay."] },
      { tone: 'light', t: ["We were discussing the racing line. Passionately.", "Just a frank exchange of views. And a bit of shoving."], r: ["Ha. That's one way of putting it.", "Don't make me laugh. That was scary."] },
      { tone: 'show', t: ["Don't worry. I held my ground.", "I didn't back down. You'd have been proud."], r: ["Is that supposed to impress me?", "Hm. I'm not sure 'proud' is the word."] },
    ] },
  // ---- the stars: she saw you walk away from one --------------------------------------------------------------------------------------
  { id: 'starRestraint', who: ['star'], w: 8, when: (x, n) => calm(x, n) && !!x.brawled?.walkedAway, open: [
    "I saw him shove you. And you just... walked away. That was impressive, actually.", "Are you alright? He went for you, and you didn't even shove back.", "Everyone's talking about the shove. Nobody's talking about you walking away. I am." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["It wasn't worth it. Nothing on a grid is.", "I'm fine. Honestly. He's having a bad day."], r: ["That's very grown-up of you.", "Kinder than he deserves."], then: { say: ["Weren't you tempted? Even a bit?", "How did you stay so calm?"], opts: [
        { tone: 'kind', t: ["Tempted, yes. Then I thought about the team.", "I thought about who'd be watching. Including you."], r: ["Good answer.", "...Oh. Well. Good."] },
        { tone: 'light', t: ["I counted to ten. I got to three, but it worked.", "Breathing exercises. Very manly ones."], r: ["Ha! Three's enough.", "Ha. Very manly."] },
        { tone: 'firm', t: ["The place to settle it is Turn 1. Cleanly.", "I'll do my answering on track."], r: ["Cleanly, please.", "That's the right place."] },
        { tone: 'flirt', fx: 'flirt', t: ["I had better things to do. Like this.", "Someone told me not to do anything stupid today. I listened."], r: ["...Smooth.", "Did they? Good."] } ] } },
      { tone: 'firm', t: ["Not today. I've got a race to win.", "The stewards can deal with him. I'm racing."], r: ["Good.", "Good. Go and do that."] },
      { tone: 'light', t: ["Racer, not a shover. It's on my business cards.", "I've seen what the stewards charge. Too expensive."], r: ["Oh no. That was terrible. ...I'm smiling, though.", "Ha. Sensible."] },
      { tone: 'show', t: ["Didn't need to. He knows who'll be in front.", "Walking away takes more nerve. I've got plenty."], r: ["Hm. Don't spoil it.", "And there it goes. Nearly perfect."] },
    ] },
  // ---- the stars on a memorial weekend: quiet words only ----------------------------------------------------------------------------
  { id: 'starCondolence', who: ['star'], w: 6, when: (x, n) => !!x.L && !n.grieving && st(n) !== 'partner', open: [
    "I wasn't sure whether I should come today. After the news.", "I'm so sorry. I don't really know what to say.", "Everyone's so quiet today. I didn't want to just walk past you." ],
    opts: [
      { tone: 'kind', t: ["Thank you for coming. It helps, seeing people here.", "There isn't anything to say. Being here is enough."], r: ["Okay. I'm glad I came, then.", "Thank you. Look after yourself today."], then: { say: ["How are you holding up? Honestly.", "Are you alright? Honestly?"], opts: [
        { tone: 'kind', t: ["Not really. But I'm glad you're here.", "Some moments better than others. Thank you for asking."], r: ["Of course.", "Take care of yourself."] },
        { tone: 'firm', t: ["I'll be alright. I'll get in and drive. It's what we do.", "Holding on. The race helps, strangely."], r: ["I understand. I think.", "Of course."] },
        { tone: 'kind', t: ["Thinking about the family, mostly. That's where my head is.", "Better for seeing a kind face. Thank you."], r: ["Of course. Me too.", "I'm glad. Look after yourself."] },
        { tone: 'cold', t: ["I'd rather not talk about it, if that's okay.", "Can we leave it there?"], r: ["Of course. I'm sorry.", "Of course."], m: 0 } ] } },
      { tone: 'firm', t: ["We race. It's what we do. But thank you.", "Today's about doing it properly. For everyone."], r: ["I think I understand.", "Of course."] },
      { tone: 'cold', t: ["Thanks.", "I'd rather not talk today, if that's alright."], r: ["Of course. I'll leave you be.", "Of course. Sorry."], m: 0 },
    ] },
  { id: 'starCondolencePartner', who: ['star'], w: 9, when: (x, n) => !!x.L && !n.grieving && st(n) === 'partner', open: [
    "Hey. I'm here. Whatever today is, I'm here.", "I didn't know if you'd want me here today. I came anyway.", "You don't have to say anything. I just wanted to see you before you get in." ],
    opts: [
      { tone: 'kind', t: ["[Take her hand]", "[Hold her hand for a moment]"], r: ["...I'm right here.", "Okay. I've got you."], then: { say: ["I'll be in the garage with the team. Take care of yourself out there.", "Whatever happens today, I'm proud of you."], opts: [
        { tone: 'kind', t: ["Thank you. For being here.", "I'm glad you came. I mean it."], r: ["Always.", "I'm not going anywhere."] },
        { tone: 'firm', t: ["I will. I promise.", "I'll be careful."], r: ["Okay.", "I know."] },
        { tone: 'kind', t: ["[Hold her hand a moment longer]"], r: ["...Go on. I'll be right here."] },
        { tone: 'cold', t: ["I need a minute on my own before the start.", "I need to be quiet for a bit."], r: ["Of course. Take all the time you need.", "Of course. I'll be close by."], m: 0 } ] } },
      { tone: 'kind', t: ["I'm glad you're here. I mean it.", "Stay in the garage today? I'd like to know you're there."], r: ["Of course I will.", "I'm not going anywhere."] },
      { tone: 'firm', t: ["I'll be alright. I need to drive.", "I'm okay. I'll get in and do my job."], r: ["I know. Just look after yourself.", "Okay. I'll be watching."] },
      { tone: 'cold', t: ["I need to be on my own for a bit.", "Not now. Sorry. I can't."], r: ["Of course. I'll be close by.", "That's alright. I understand."], m: 0 },
    ] },
  // ---- a star who has lost someone close (career/Celebs.js grieve): nothing but kindness -----------------------------------------
  { id: 'starGrieving', who: ['star'], w: 30, when: (x, n) => !!n.grieving, open: [
    "This is my first time back on a grid. I wasn't sure I could.", "Everyone's been so kind today. It still doesn't feel real.", "I keep looking down the pit lane for a face that isn't there." ],
    opts: [
      { tone: 'kind', t: ["It's good to see you here. I'm so sorry.", "I'm so sorry. You're among friends here, always."], r: ["Thank you. It helps to hear that.", "Thank you. I think it was right to come."], then: { say: ["Look after yourself out there. Please.", "Everyone here was so good to us. I wanted to say thank you."], opts: [
        { tone: 'kind', t: ["Thank you for coming back. It means a lot to all of us.", "We will. Thank you."], r: ["...Thank you.", "Thank you."] },
        { tone: 'firm', t: ["We look after each other. Always.", "We will. All of us."], r: ["I know.", "I know you will."] },
        { tone: 'kind', t: ["If you ever want to talk about them, I'm here.", "Come and sit with the team after the race, if you'd like."], r: ["...I'd like that. Thank you.", "Thank you. I might."] },
        { tone: 'cold', t: ["Thanks.", "I will."], r: ["Of course.", "Of course."], m: 0 } ] } },
      { tone: 'firm', t: ["The whole paddock's with you.", "Whatever you need, just ask. Anyone here would help."], r: ["...Thank you.", "I know. I can feel it."] },
      { tone: 'cold', t: ["I'm sorry. I need to get ready.", "Thanks for coming."], r: ["Of course. Go.", "Of course."], m: 0 },
    ] },

  // =====================================================================================================================
  // the stars, one each: the things only she would bring up
  // =====================================================================================================================
  // ---- Mira Vale, singer: perfect pitch, and your engine is in her head -------------------------------------------------------
  { id: 'sigMira', who: ['star'], w: 6, when: own('mira-vale'), open: [
    "Your engine idles somewhere around a B flat. I've been humming along to it all morning. Sorry.", "Did you know your downshifts are almost in tune? Almost. It's driving me mad.", "I recorded your car going past in practice. I've been trying to find the key ever since.", "I write everything on a battered old piano at home. I've already got your engine's idle on it. B flat, give or take." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Wait - you can actually hear the notes? That's amazing.", "That's brilliant. Do you hear music in everything?"], r: ["Everything. Kettles, lifts, your team radio. It's a curse.", "Perfect pitch. Great at parties, terrible in lifts."], then: { say: ["If it ends up in a song, will you mind?", "Would it be strange if I put your engine in a song?"], opts: [
        { tone: 'kind', t: ["I'd be honoured. Put the mechanics in the credits.", "Not strange at all. I'd love that."], r: ["Done. 'Featuring the pit crew.'", "Good. It's already half written."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if I get to hear it first.", "Only if you sing it to me."], r: ["We'll see. Behave out there.", "Ha. Maybe. If you're lucky."] },
        { tone: 'light', t: ["The engine will want royalties. It's very expensive.", "Fine, but my engineer will want a writing credit."], r: ["Ha! Fair.", "Ha. Everyone wants a credit."] },
        { tone: 'show', t: ["Make it a big one. Something for a podium.", "Make it the single. It deserves it."], r: ["Win first. Then we'll talk singles.", "Hm. Confident engine, confident driver."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["If the engine's a B flat, what note am I?", "What note would you give me, then?"], r: ["You? Slightly sharp. In a good way.", "Something warm. Don't let it go to your head."], then: { say: ["Is it terrible that I find the noise romantic?", "Is it strange that I find it romantic? The noise?"], opts: [
        { tone: 'flirt', fx: 'flirt', t: ["Not terrible. I'll make it sound good for you.", "Not strange. I'll do a lap just for you, then."], r: ["Ha. Deal.", "Careful. I'll be listening."] },
        { tone: 'kind', t: ["Not at all. It's the best sound in the world.", "Not terrible. It's music to me too."], r: ["I knew you'd understand.", "Good. I'm not mad, then."] },
        { tone: 'light', t: ["Wait till you hear it on the rev limiter. Very romantic.", "My engineer finds it romantic too. Don't tell anyone."], r: ["Ha!", "Ha. Your secret's safe."] },
        { tone: 'cold', t: ["It's just noise to me, honestly.", "It's an engine."], r: ["...Oh. Right.", "Right. Of course."] } ] } },
      { tone: 'light', t: ["Tell my engineer. That's worth a tenth for every semitone.", "Don't listen to me on the radio, then. I'm never in tune."], r: ["Ha! I'll send the team the sheet music.", "Ha. I'll take my chances."] },
      { tone: 'show', t: ["Wait till you hear it at full revs. That's the real show.", "Every car here has an engine. Mine has a voice."], r: ["Is that right? I sell out arenas, you know.", "That's either very poetic or very smug."] },
    ] },
  // ---- Lena Marsh, Olympic sprinter: starts, and reaction times ------------------------------------------------------------------
  { id: 'sigLena', who: ['star'], w: 6, when: own('lena-marsh'), open: [
    "What's your reaction time off the lights? In athletics, anything under a tenth of a second counts as a false start.", "I watched your start in the last race. You were a fraction late. I notice these things.", "Sprinters and racing drivers: we both win or lose it at the start. How quick are you off the lights?" ],
    opts: [
      { tone: 'firm', t: ["About two tenths when it goes right. Lights out is a different animal.", "A good one's about two tenths. A bad one, you hear about on the radio."], r: ["Two tenths? I'd be last out of the blocks. Then again, I don't have a clutch.", "Two tenths. Not bad. For a sitting-down sport."], then: { say: ["Do you train it? Your reactions?", "How do you train for that? Seriously."], opts: [
        { tone: 'firm', t: ["Every day. Lights on a screen, a button, over and over.", "Reaction boards, the sim, and a lot of practice starts."], r: ["Same as us. Boring, isn't it? It works.", "Same as us. Boring works."] },
        { tone: 'kind', t: ["Not as much as you do. Teach me something.", "Not enough. Got any tips?"], r: ["Don't listen for it. Watch. Let your body go before your brain argues.", "Stop waiting. Watch, and let your body go first."] },
        { tone: 'show', t: ["I don't need to. It's natural.", "Never needed to. Some of us are born with it."], r: ["Everyone says that. Then they meet a starting pistol.", "Hm. Everyone's born with it until they aren't."] },
        { tone: 'light', t: ["My reactions are fine. My clutch needs the coaching.", "My trainer throws tennis balls at my head. Does that count?"], r: ["Ha. I'll allow it.", "Ha. That counts. Just."] } ] } },
      { tone: 'kind', fx: 'charm', t: ["You're the expert. What am I doing wrong?", "Go on - you'd know better than anyone. Any advice?"], r: ["You're waiting for the lights. Don't wait. Watch.", "You're thinking. Stop thinking. Your body's quicker than your brain."], then: { say: ["Seriously, come and train with us one day. You'd hate it.", "You'd last about a week on our programme. Want to try?"], opts: [
        { tone: 'kind', t: ["I'd love to. I'll bring the coffee.", "Yes. Absolutely. Name the day."], r: ["Deal. Six in the morning.", "Six in the morning. Don't be late."] },
        { tone: 'light', t: ["A week? I'd last a warm-up.", "Only if there's a sofa at the finish line."], r: ["Ha. Probably.", "Ha. There isn't."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if you're the one shouting at me.", "I'd turn up every single morning if you were there."], r: ["Careful. I shout a lot.", "Hm. We'll find out."] },
        { tone: 'firm', t: ["Bring it on. I'm fitter than I look.", "I'd last. Easily."], r: ["We'll see.", "Everyone says that."] } ] } },
      { tone: 'flirt', fx: 'flirt', t: ["Race you to the end of the grid. Best of three.", "I'd chase you down the pit lane, but you'd win."], r: ["In those boots? I'd be finished before you'd started.", "Ha. Nice try. I'd win easily."] },
      { tone: 'light', t: ["Quick enough. My clutch is slower than me, though.", "Quicker than my engineer on the radio, anyway."], r: ["Ha. Blame the equipment. Classic.", "Ha. I'll allow it."] },
    ] },
  // ---- Sasha Ivers, film director: the film nobody has got right yet -------------------------------------------------------------
  { id: 'sigSasha', who: ['star'], w: 6, when: own('sasha-ivers'), open: [
    "Every racing film gets one thing wrong. Tell me what it is.", "I want to make a film about this. The bit before the start. Nobody's ever got it right.", "I've been watching the grid for an hour. Nobody's ever filmed this properly. What are they missing?", "I'm shooting a documentary about the crews who build a night race. Everyone else films the drivers. What do they always get wrong about you?" ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["The quiet. Right before the lights. Nobody ever gets the quiet right.", "The waiting. Everyone films the racing. Nobody films the waiting."], r: ["Oh, that's good. I'm stealing that.", "Yes. That's the film. That's exactly the film."], then: { say: ["What does it sound like in the car, right before?", "What do you hear, in that last second?"], opts: [
        { tone: 'kind', t: ["My own breathing. The engine idling under me. That's it.", "My heartbeat, louder than the engine."], r: ["Oh. That's the opening shot.", "That's the opening shot. Right there."] },
        { tone: 'firm', t: ["Nothing. Just the lights.", "Nothing at all. The lights are all there is."], r: ["Silence. Good.", "Perfect. Silence."] },
        { tone: 'flirt', fx: 'flirt', t: ["Come and stand by the car and find out. Until they make you leave.", "Right now? Your voice. It's a good one."], r: ["Careful. I'll put you in the film.", "Hm. Careful."] },
        { tone: 'light', t: ["My engineer telling me not to over-rev. Every time.", "Someone in the crowd shouting my name wrong."], r: ["Ha. That's going in.", "Ha. Comic relief."] } ] } },
      { tone: 'light', t: ["In films we're always shouting. In real life we mostly say 'copy'.", "They change up about nine times on one straight. We've only got eight gears."], r: ["Ha! Noted. That's going in the script.", "Ha. You're hired as a consultant."] },
      { tone: 'flirt', fx: 'flirt', t: ["Put me in it. I'll work for coffee.", "If you're filming me, get my good side. It's the helmet."], r: ["Careful. I'm always casting.", "Hm. You might photograph well."] },
      { tone: 'show', t: ["Film my start. That's the only film you'll need.", "Point the camera at me. It saves time."], r: ["Everyone says that. Very few mean it.", "Hm. Let's see the start first."] },
    ] },
  // ---- Noor Haddad, fashion designer: the overalls -------------------------------------------------------------------------------
  { id: 'sigNoor', who: ['star'], w: 6, when: own('noor-haddad'), open: [
    "Fireproof fabric that still breathes. Do you know how hard that is to cut? I'm obsessed with your overalls.", "The collar on these race suits is a crime. Who signs off a collar like that?", "I've been sketching your overalls all morning. Don't look so worried - they're fascinating.", "My race-jacket collection sold out in an afternoon. Then I saw a real race suit up close and wanted to start all over again." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Go on, then - what would you change?", "Tell me what you'd do with them. I'm curious."], r: ["Everything above the shoulders. And the stitching.", "The cut at the back. You all look like you're wearing a sleeping bag."], then: { say: ["If I designed you a suit, would you wear it?", "Would you let me design you one? A proper one?"], opts: [
        { tone: 'kind', t: ["If the FIA approves it, in a heartbeat.", "Yes - as long as it passes the FIA's fire tests."], r: ["Rules. Always rules. Fine.", "I love a brief with rules."] },
        { tone: 'flirt', fx: 'flirt', t: ["I'd wear it to dinner. With you.", "Only if you come to the fitting."], r: ["Hm. Maybe I would.", "Careful. My fittings take hours."] },
        { tone: 'light', t: ["Only if it has pockets. Nobody gives us pockets.", "Only if it's in a colour my team principal hates."], r: ["Ha. Now you're speaking my language.", "Ha. I'll see what I can do."] },
        { tone: 'show', t: ["I make anything look good. It's a gift.", "Whatever you design, I'll make it look fast."], r: ["And modest. I'll design around the ego.", "Hm. We'll see."] } ] } },
      { tone: 'light', t: ["The collar's for safety. The ugliness is a bonus.", "Fireproof, sweat-proof - and style-proof."], r: ["Style-proof. That's exactly it.", "Ha. I'm writing to someone about it."] },
      { tone: 'flirt', fx: 'flirt', t: ["You'd look better in them than I do.", "Design me something and I'll wear it on the podium."], r: ["Flattery. It works on me, unfortunately.", "Hm. I'll think about it. Win something first."] },
      { tone: 'cold', t: ["It's a race suit. It does the job.", "I don't really think about it."], r: ["...Right. Fair enough.", "Clearly."] },
    ] },
  // ---- Ava Rennick, actress: learning to drive for a part -----------------------------------------------------------------------------
  { id: 'sigAva', who: ['star'], w: 6, when: own('ava-rennick'), open: [
    "I'm playing a rally driver next year. My stunt coordinator says I brake like a nervous pigeon.", "Six weeks of driving lessons for a part, and I still can't heel-and-toe. Show me with your hands.", "My next character drives for a living, so I've been studying you all. You walk like you've lost something.", "I do my own stunts when the insurers let me. For the rally part next year they've said absolutely not. So teach me something." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Happy to help. Brake hard first, then ease off as you turn in. Squeeze, don't stamp.", "Here - brake with the ball of your foot, blip the throttle with the side of it. Like this."], r: ["I'm writing that on my hand. Literally.", "Oh, that's so much easier when someone actually explains it."], then: { say: ["What would an actor get wrong about you? Be honest.", "What's the bit everyone gets wrong about drivers?"], opts: [
        { tone: 'kind', t: ["That we're fearless. We're not. We're careful.", "That it's all bravado. Most of it's homework."], r: ["Careful, not fearless. That's the character.", "Homework. I can play homework."] },
        { tone: 'light', t: ["We don't wink at the camera before overtaking. Sadly.", "We don't take the helmet off in slow motion. Not usually."], r: ["Ha! There goes my best scene.", "Ha. Not usually?"] },
        { tone: 'flirt', fx: 'flirt', t: ["You won't get anything wrong. You've done your research.", "Study me a bit longer. For accuracy."], r: ["For accuracy. Of course.", "Hm. Thorough research."] },
        { tone: 'firm', t: ["That it's glamorous. It's mostly data and early nights.", "The noise. Nobody gets the noise right."], r: ["Noted. Very noted.", "Noted."] } ] } },
      { tone: 'light', t: ["Play it with a lot of frowning at screens. That's ninety per cent of us.", "Tip one: complain about the tyres. Constantly."], r: ["Ha! I'm brilliant at frowning.", "Ha. Method acting."] },
      { tone: 'flirt', fx: 'flirt', t: ["I'll give you lessons. In return, I want a cameo.", "Study me as long as you like. For the part."], r: ["Ha. I'll think about it.", "Careful. I take research very seriously."] },
      { tone: 'show', t: ["Base the character on me. Just be brilliant and quick.", "Watch my onboards. Everything you need is in there."], r: ["And modest. I'll write that in.", "Hm. I've watched them. You talk to yourself a lot."] },
    ] },
  // ---- the ones who like trouble: she knows about {partner}, and does not mind in the slightest -------------------------------------
  { id: 'troubleTaken', who: ['star'], w: 7, when: (x, n) => trouble(x, n) && at(n, 'met', 'friendly', 'flirting'), open: [
    "So. {partner}. How is that going? Honestly.", "I saw you and {partner} in the papers. Cute. Very... sensible.", "Does {partner} know you talk to me like this?", "{partner}'s lovely. Everybody says so. Isn't that a bit boring?" ],
    opts: [
      { tone: 'flirt', fx: 'flirt', t: ["Honestly? I'd rather talk about you.", "She doesn't need to know everything."], r: ["Now that's more like it.", "Oh, I like you much better already."] },
      { tone: 'light', t: ["It's going well, thanks. Nice try.", "You're trouble, you know that?"], r: ["I know. It's my best quality.", "Ha. Everyone says that like it's a bad thing."] },
      { tone: 'firm', t: ["I'm with {partner}. That's the end of it.", "Leave {partner} out of this."], r: ["For now.", "Fine. She can't come up every time we talk, though."] },
      { tone: 'cold', t: ["Is this really what you came over for?", "I've got a race to get ready for."], r: ["Touchy. I'll find you later.", "Go on, then. I'll be watching."] } ] },
  { id: 'troubleSecret', who: ['star'], w: 8, when: (x, n) => trouble(x, n) && at(n, 'dating'), open: [
    "When are you going to tell {partner} about us? I'm not asking again for ever.", "{partner}'s here today, isn't she? This is going to be fun.", "I could just walk over and say hello to {partner}. Should I?" ],
    opts: [
      { tone: 'sorry', t: ["Soon. I promise. Just not today.", "Give me a bit more time. Please."], r: ["You said that last time.", "Mm. Time is the one thing I'm short of."] },
      { tone: 'flirt', fx: 'flirt', t: ["Not here. Later - somewhere with fewer cameras.", "Behave. For an hour. Then I'm all yours."], r: ["An hour. I'm counting.", "Fewer cameras. Fine. Somewhere better."] },
      { tone: 'firm', t: ["Don't. Not today, not here.", "You're not walking anywhere near her."], r: ["Relax. I'm only teasing. Mostly.", "Fine. Today."] },
      { t: ["[Glance round for cameras]", "[Step back a little]"], tone: 'light', r: ["Oh, don't look so guilty. It's a dead giveaway.", "Ha. You're terrible at this."] } ] },
  // ---- Jade Okafor, DJ: your engine in her set --------------------------------------------------------------------------------------
  { id: 'sigJade', who: ['star'], w: 6, when: own('jade-okafor'), open: [
    "I recorded your downshifts in practice. They're going in my set after the race. You're welcome.", "Quick maths: twelve thousand revs is two hundred a second. My kick drum can't keep up.", "I'm playing the party after the race. If you win, you pick the last track." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["That's brilliant. I'd love to hear it.", "Seriously? That's the best thing I've heard all week."], r: ["You will. Loudly.", "Come and hear it live, then."], then: { say: ["So are you coming to the set after, or are you an early-night driver?", "Will you come down after the race? Or is it debrief and bed?"], opts: [
        { tone: 'kind', t: ["I'll come. Even if it's just for one track.", "I'll be there. I might just stand at the back."], r: ["One track. I'll make it count.", "The back's fine. I'll find you."] },
        { tone: 'flirt', fx: 'flirt', t: ["Save me a spot by the decks.", "Only if you play something for me."], r: ["Maybe. Don't be late.", "Hm. Maybe I will."] },
        { tone: 'firm', t: ["Debrief, then bed. Sorry. It's the job.", "Early night. The debrief starts at eight."], r: ["Boring. Respect, but boring.", "Boring. I'll save you a recording."] },
        { tone: 'light', t: ["I'll be there. Dancing like an engineer.", "If I win, I'll dance. Nobody wants that."], r: ["Ha. I've seen engineers dance. Brave.", "Ha. I want that."] } ] } },
      { tone: 'light', t: ["Credit the engine, though. It's in a union.", "Two hundred a second and it still can't keep a beat."], r: ["Ha! 'Featuring: V6.' Done.", "Ha. Noted."] },
      { tone: 'flirt', fx: 'flirt', t: ["Play something slow at the end. I'll find you.", "If I win, the last track's for you."], r: ["Careful. I'll hold you to that.", "Hm. We'll see if you can dance."] },
      { tone: 'show', t: ["Wait till you hear it when I win. Better beat.", "Put my engine on last. Nobody can follow that."], r: ["Big words from someone in a fireproof onesie.", "Hm. We'll see if it gets a reaction."] },
    ] },
  // ---- Clara Voss, tennis champion: athlete to athlete ---------------------------------------------------------------------------------
  { id: 'sigClara', who: ['star'], w: 6, when: own('clara-voss'), open: [
    "My first serve is quicker than your pit-lane speed limit. Just so you know who you're talking to.", "Your hands look like mine. Calluses in all the wrong places. The steering wheel?", "I bounce the ball seven times before a second serve. You've got a ritual like that, haven't you? Everyone does." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Respect. What you do is all nerve and timing. Same as us, really.", "Honestly? I couldn't do what you do. All that pressure, all on your own."], r: ["See? You get it.", "It's the same thing, isn't it? Just with more tyres."], then: { say: ["Go on - what's your ritual? Before you get in?", "Everyone has a ritual. What's yours?"], opts: [
        { tone: 'kind', t: ["Left glove first. Always. Then a tap on the halo.", "A photo from home, taped inside the cockpit."], r: ["See? We're all the same.", "That's lovely."] },
        { tone: 'light', t: ["I never step on a white line on the grid. It's very hard.", "I count the wheel nuts. Out loud. The mechanics love it."], r: ["Ha! I knew it.", "Ha. They must adore you."] },
        { tone: 'firm', t: ["No ritual. Preparation.", "Nothing. Superstition is for people who aren't ready."], r: ["Says everyone, until it goes wrong.", "Hm. Brave."] },
        { tone: 'flirt', fx: 'flirt', t: ["New ritual: say hello to you first.", "As of today, talking to you. It seems to work."], r: ["Ha. I'll allow it.", "Hm. We'll see if it works."] } ] } },
      { tone: 'light', t: ["My serve's terrible. I'd lose to a ball machine. Possibly to a ball.", "Tennis and racing: mostly sweating and pretending you're calm."], r: ["Ha! We should swap tips.", "Ha. That's the whole job, isn't it?"] },
      { tone: 'flirt', fx: 'flirt', t: ["Play me some time. I'll lose gracefully.", "Teach me to serve and I'll teach you to start."], r: ["Deal. You'll lose, though.", "Ha. I'm a very strict teacher."] },
      { tone: 'show', t: ["Quick serve. My car does three hundred and forty.", "My reactions are better than any line judge's."], r: ["Hm. Come and prove it on a court.", "Show-off. I like a show-off. Sometimes."] },
    ] },
  // ---- Elena Marchetti, TV presenter: she wants you on the show ------------------------------------------------------------------------
  { id: 'sigElena', who: ['star'], w: 6, when: own('elena-marchetti'), open: [
    "I need you on the show. Ten minutes, a sofa, no cars. And a cake. There's always a cake.", "I've presented live through a broken autocue, a runaway goat and a fire alarm. You'll be easy. I need you on the show.", "My producer's in my ear asking for 'a moment' with you. I told him you're working. He says so am I." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["I'd love to. Tell your producer to call the team.", "Happy to - whenever the season lets me."], r: ["Wonderful. He'll cry. He cries a lot.", "Perfect. I'll save you a slice."], then: { say: ["So what should I ask you? Give me something nobody's heard.", "Give me one story nobody's heard. For the show."], opts: [
        { tone: 'kind', t: ["Ask me about my first kart. It was held together with tape.", "Ask me about my first race. I cried at the end. Happy tears."], r: ["Oh, that's perfect. The audience will love it.", "Perfect. Bring tissues."] },
        { tone: 'light', t: ["Ask me how many times I've got lost in the paddock.", "Ask me about the time I tried to cook for the team."], r: ["Ha. Now that's television.", "Ha. That's the clip."] },
        { tone: 'flirt', fx: 'flirt', t: ["Ask me what I'm doing after the race.", "Ask me anything. On camera or off."], r: ["Careful. I'll do it live.", "Hm. Off camera, maybe."] },
        { tone: 'firm', t: ["Ask me about racing. I'll give you a straight answer.", "Ask me anything about the car. I'll tell you the truth."], r: ["Fine. Straight answers. Rare on my show.", "Deal. No spin."] } ] } },
      { tone: 'light', t: ["Live TV terrifies me. At least nobody can edit a start.", "Is there a cake? Then yes. To anything."], r: ["Ha. You'd be a natural.", "Ha. I'm writing that down."] },
      { tone: 'flirt', fx: 'flirt', t: ["Only if you're the one asking the questions.", "A sofa and you? I'd clear my diary."], r: ["Careful. I'll have the cameras rolling.", "Smooth. My producer just gasped."] },
      { tone: 'cold', t: ["I don't really do TV.", "My manager handles all of that."], r: ["Oh. Right. Pity.", "Oh. Shame."] },
    ] },
  // ---- Priya Raman, model (and a part-time astrophysics student): orbits, and the sky nobody here looks at ------------------------------
  { id: 'sigPriya', who: ['star'], w: 6, when: own('priya-raman'), open: [
    "I've got an exam on orbital mechanics on Monday. Watching you all go round in circles is weirdly good revision.", "I study astrophysics part-time. Don't look so shocked - shoots have a lot of waiting around in them.", "I study astrophysics on the side. So: downforce is just gravity you can buy, isn't it? I've been dying to ask someone." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Physics on top of everything else? That's brilliant. What got you into it?", "You study it? Properly? What got you hooked?"], r: ["A school trip to an observatory. I saw Saturn's rings, and that was that.", "My dad's telescope, on the roof, when I was nine. Saturn. I've never got over it."], then: { say: ["When did you last look at the night sky? Properly, I mean.", "Have you ever looked up? Properly? Somewhere really dark?"], opts: [
        { tone: 'kind', t: ["Not for years. Will you show me some time?", "Not properly. I'd like to, though."], r: ["I'll bring the telescope. Saturn's worth the trip.", "Somewhere dark, a small telescope, Saturn's rings. You never forget the first time."] },
        { tone: 'light', t: ["I look up when I've been spun round in the gravel.", "Only at the big screens, to see where I finished."], r: ["Ha! That counts. Just.", "Ha. That's not the sky."] },
        { tone: 'flirt', fx: 'flirt', t: ["Show me Saturn some time and I'll show you the quickest way round {track}.", "I've got something better to look at right now."], r: ["That's a very good trade.", "...Smooth. Annoyingly smooth."] },
        { tone: 'firm', t: ["Never. My head's down all season.", "No. The season doesn't stop for stargazing."], r: ["That's a shame. It puts everything in proportion.", "Hm. You should. It helps."] } ] } },
      { tone: 'light', t: ["Here's some physics: downforce is gravity you can buy. Very expensive gravity.", "The faster we go, the harder the air pushes the car into the road. It's basically getting heavier. Sort of."], r: ["Ha! I love that.", "Ha. That's going in my revision notes."] },
      { tone: 'flirt', fx: 'flirt', t: ["Astrophysics and that smile. That's not fair on the rest of us.", "You're the most interesting person on this grid, and it isn't close."], r: ["Flattery. Go on, though.", "...Okay. That was a good one."] },
      { tone: 'show', t: ["Five g through the fast corners. I've felt more physics than your lecturers.", "Ask me anything about downforce. I'm basically a textbook on wheels."], r: ["Felt it, yes. Calculated it?", "Is that a fact or a feeling?"] },
    ] },
  // ---- Tessa Kealoha, surfer: reading the water, reading the track --------------------------------------------------------------------
  { id: 'sigTessa', who: ['star'], w: 6, when: own('tessa-kealoha'), open: [
    "Reading the track is like reading a wave, right? You see it before you feel it.", "I was in the water at dawn. It's the first time all week I've been on dry land this long.", "I hold my breath for a living, more or less. Do you hold yours through the fast corners?", "Honestly? Your start looks scarier than any wave I've ridden. And I've ridden some big ones." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Teach me to read the sea and I'll teach you to read a track.", "Show me a wave some time and I'll show you a lap."], r: ["Deal. Dawn, though. No complaining.", "Deal. You'll hate the cold water."], then: { say: ["Do you ever get the perfect lap? Like the perfect wave?", "Is there such a thing as a perfect lap?"], opts: [
        { tone: 'kind', t: ["Maybe once a season. You remember it for years.", "Once or twice. You never forget them."], r: ["Same with waves. Exactly the same.", "Same with waves."] },
        { tone: 'firm', t: ["Every lap I try. Nearly never.", "No. There's always a tenth somewhere."], r: ["That's very you.", "Hm. Never satisfied."] },
        { tone: 'light', t: ["Mine usually end in the gravel.", "Only on the sim. With the pause button."], r: ["Ha. That's a wipe-out, then.", "Ha. Cheating."] },
        { tone: 'flirt', fx: 'flirt', t: ["Today might be the day. You're here.", "Maybe today. I've got a lucky charm watching."], r: ["Ha. No pressure.", "Hm. Go and find out."] } ] } },
      { tone: 'light', t: ["Board, car - same thing. Both are expensive and both want to throw you off.", "Biggest difference: the sea doesn't have stewards."], r: ["Ha! Not wrong.", "Ha. I'll give you that."] },
      { tone: 'flirt', fx: 'flirt', t: ["Take me out on a board some time. I'll be terrible, you'll laugh.", "I'd swap the car for the sea for a day. If you're teaching."], r: ["Terrible is fine. Everyone starts terrible.", "One day. Dawn. No complaining."] },
      { tone: 'show', t: ["Waves don't do three hundred kilometres an hour.", "I'd surf. I'd be good at it. I'm good at most things."], r: ["You haven't seen the big ones.", "Hm. The sea's very good at humbling people."] },
    ] },
  // ---- Maya Lindqvist, chef: what you eat ----------------------------------------------------------------------------------------------
  { id: 'sigMaya', who: ['star'], w: 6, when: own('maya-lindqvist'), open: [
    "I had a look at your team's menu. Plain rice, plain chicken. Who hurt you?", "I've been baking since four. Cardamom buns for your garage - don't tell your nutritionist.", "Your engineer says you eat the same pasta before every race. Same sauce? Same bowl? I need to know." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Save me something. I'll hide it from the nutritionist.", "Cook for us one day? The whole garage would adopt you."], r: ["Leave it with me.", "Ha. Deal - one condition: nobody asks for plain rice."], then: { say: ["What's the first thing you eat after a race?", "If you could eat anything right now, what would it be?"], opts: [
        { tone: 'kind', t: ["Whatever the mechanics are eating. Win or lose.", "Something someone made with love. Not from a tray."], r: ["Good answer.", "Now we're talking."] },
        { tone: 'light', t: ["A burger the size of my helmet.", "Pudding. Just pudding. Several."], r: ["Ha. Now we're talking.", "Ha. Respect."] },
        { tone: 'flirt', fx: 'flirt', t: ["Something you cooked. If that's an offer.", "Anything, if you're cooking."], r: ["Careful. I'm a very good cook.", "Hm. It might be."] },
        { tone: 'firm', t: ["Nothing until the debrief's done.", "Rice and chicken. Habit."], r: ["That's the saddest thing I've heard all week.", "Oh, that hurts me."] } ] } },
      { tone: 'light', t: ["My nutritionist has spies everywhere. Including you, probably.", "Plain food, plain head. It's a philosophy. A sad one."], r: ["Ha. We'll see about that.", "Ha. I'm going to change your life."] },
      { tone: 'flirt', fx: 'flirt', t: ["Cook for me some time. I promise not to ask for plain rice.", "I'd break every rule in the diet for your cooking."], r: ["Careful. I'm a very good cook.", "Hm. We'll see if you can keep up."] },
      { tone: 'cold', t: ["Food's fuel. I don't really think about it.", "The nutritionist knows what she's doing."], r: ["Oh. Right. That hurts a bit.", "Hm. Fair enough."] },
    ] },
  // ---- Zoe Hartley, racing streamer: live, with forty thousand people watching -------------------------------------------------------
  { id: 'sigZoe', who: ['star'], w: 6, when: own('zoe-hartley'), open: [
    "Chat says hi. Chat also says you brake too early into {corner}.", "I did eight hundred laps of this place on my rig this week. I know where you're losing time.", "Wave at the camera? There are forty thousand people watching me ask you to wave at the camera." ],
    opts: [
      { tone: 'kind', fx: 'charm', t: ["Hello, chat! Go on, then - where am I losing time?", "Hi, everyone. Right - tell me where I'm slow."], r: ["{corner}. You lift. Chat says you don't need to lift.", "{corner}. You're on the brakes a car's length too early. Chat's very sure."], then: { say: ["Would you race me on the rig some time? On stream?", "Chat wants a sim race. You against me. Yes or yes?"], opts: [
        { tone: 'kind', t: ["I'd love to. Fair warning: I'm rubbish with a controller.", "Yes. Fair warning: I'll be rubbish at the start."], r: ["Chat's going absolutely mad.", "Chat's going mad. Thank you."] },
        { tone: 'flirt', fx: 'flirt', t: ["Only if it's just us. No chat.", "Yes. Loser buys dinner."], r: ["Chat heard that. Chat is screaming.", "Hm. Deal. Chat is screaming."] },
        { tone: 'show', t: ["Yes. You'd be very brave to lose to me live.", "Yes. I'll go easy on you. A bit."], r: ["Ha. Chat's clipping that.", "Ha. Chat's clipping that already."] },
        { tone: 'light', t: ["Only if chat promises to be nice about my lap times.", "Only if I can blame the lag."], r: ["Ha. Chat promises nothing.", "Ha. Chat says no excuses."] } ] } },
      { tone: 'light', t: ["Tell chat I brake early on purpose. It's called strategy.", "Tell chat to come and drive it, then."], r: ["Chat says 'cope'. Sorry. That's chat.", "Ha. Chat's typing very fast."] },
      { tone: 'flirt', fx: 'flirt', t: ["Turn the camera off for a second. I want to talk to you, not chat.", "Chat can wait. Hello, {her}."], r: ["...Off. Chat's furious. Hi.", "Ha. Chat's spamming hearts. Ignore them."] },
      { tone: 'show', t: ["Eight hundred laps on a sim. Cute. I do the real thing.", "Tell chat I'll beat their lap record. Live."], r: ["Chat's split. Half love it, half are booing.", "Chat's clipping that. You can't take it back."] },
    ] },

  // =====================================================================================================================
  // the drivers with something against you (never on a memorial weekend, never twice in one walk)
  // =====================================================================================================================
  // ---- he blames you for last time ---------------------------------------------------------------------------------------------------
  { id: 'driverBlame', who: ['driver'], w: 5, when: (x, n) => heated(x) && !n.mate && n.mood <= -1, open: [
    "You ran me off the road last time. Still waiting for that apology.", "You've got some nerve, walking up to me after last time.", "Don't. Just don't. Not after what you did last time." ],
    opts: [
      { tone: 'sorry', t: ["You're right. I got it wrong last time. I'm sorry.", "Fair. That was on me. Sorry."], r: ["...Fine. Took you long enough.", "Okay. I didn't expect that."], then: { say: ["Just give me room into Turn 1. That's all I want.", "Don't do it again. That's all I'm saying."], opts: [
        { tone: 'kind', t: ["You'll get a car's width. Every time.", "You have my word."], r: ["Good. Then we're fine.", "Okay. Shake on it."] },
        { tone: 'firm', t: ["Room, yes. Gifts, no.", "Fair and hard. That's all I'll promise."], r: ["That's all I'm asking.", "Fine."] },
        { tone: 'light', t: ["I'll leave so much room you'll get lonely.", "I'll indicate. Like a road car."], r: ["Ha. Fine.", "Ha. Idiot. Fine."] },
        { tone: 'cold', t: ["We'll see.", "Depends on you."], r: ["Unbelievable.", "Right."] } ] } },
      { tone: 'firm', t: ["It was a racing incident. The stewards looked at it.", "That was racing. You'd have done the same."], r: ["Racing. Right. Tell that to my front wing.", "I'd have left you room. That's the difference."], then: { say: ["Do that again today and see what happens.", "Try it again and see what happens."], opts: [
        { tone: 'firm', t: ["I'll race you like I race anyone.", "Hard and fair. Same as always."], r: ["We'll see.", "Your idea of fair, maybe."] },
        { tone: 'sorry', t: ["Okay. Point taken. I'll give you room.", "Fine. I hear you. Clean race."], r: ["Good.", "...Good."] },
        { tone: 'cruel', t: ["Is that a threat? Cute.", "Go on, then. Show me."], r: ["It's a promise.", "Oh, I will. On track."] },
        SHOVE ] } },
      { tone: 'cruel', t: ["Then stay out of my way.", "Maybe learn to use your mirrors."], r: ["Say that again. Closer.", "Want to say that a bit closer?"], then: { say: ["Go on. Say it again.", "Well? I'm listening."], opts: [
        { tone: 'sorry', t: ["...Forget it. It's not worth it.", "No. Sorry. Leave it."], r: ["Thought so.", "Yeah. Leave it."] },
        { tone: 'cruel', t: ["You heard me the first time.", "I said what I said."], r: ["Right.", "You're unbelievable."] },
        WALK, SHOVE ] } },
      { tone: 'cold', t: ["Not doing this now.", "Save it for after the race."], r: ["Course you're not.", "Fine. After."] },
    ] },
  // ---- word got back to him: what you said about him earlier on the grid ------------------------------------------------------------
  { id: 'driverFeud', who: ['driver'], w: 8, when: (x, n) => heated(x) && !n.mate && (n.car?.feud || 0) >= 0.35, open: [
    "Heard what you've been saying about me. Want to say it to my face?", "Somebody told me what you said about me. Go on, then. Say it again.", "Funny how brave people get behind my back." ],
    opts: [
      { tone: 'sorry', t: ["It wasn't fair, what I said. I'm sorry.", "I shouldn't have said it. That's on me."], r: ["...At least you own it.", "Okay. Next time, say it to me."], then: { say: ["So are we clear for the start?", "Are we done, then?"], opts: [
        { tone: 'kind', t: ["We're clear. Good luck out there.", "Done. Race you clean."], r: ["Yeah. You too.", "Fine. Clean."] },
        { tone: 'firm', t: ["Clear. But I'm not giving you an inch on track.", "Done talking. Not done racing."], r: ["Wouldn't want you to.", "Good."] },
        { tone: 'light', t: ["Clear. I'll save my opinions for my engineer.", "Done. I'll moan to my engineer like a normal person."], r: ["Ha. Fine.", "Ha. Do that."] } ] } },
      { tone: 'firm', t: ["I said it. I'll stand by it on track.", "I'll say it to anyone. Nobody's above criticism."], r: ["Then I'll see you at Turn 1.", "Big words."], then: { say: ["Is that all you've got?", "Want to take this any further?"], opts: [
        { tone: 'firm', t: ["I've got a race to drive. So have you.", "The track's where we settle it."], r: ["Fine. Turn 1.", "We'll see."] },
        { tone: 'sorry', t: ["No. You're right. That was too much. Sorry.", "No. Let's leave it. Sorry."], r: ["...Okay.", "Fine."] },
        WALK, SHOVE ] } },
      { tone: 'cruel', t: ["Every word. I'd say worse.", "Every word. And it's true."], r: ["Right. Remember this.", "You'll regret that. On track."], then: { say: ["Go on. Say it again. Right here.", "Come on, then. I'm right here."], opts: [
        { tone: 'cruel', t: ["You're not worth repeating it for.", "I don't repeat myself."], r: ["Unbelievable.", "Right."] },
        { tone: 'sorry', t: ["...No. That's enough. Sorry.", "Leave it. I was out of line."], r: ["Yeah. You were.", "Fine."] },
        WALK, SHOVE ] } },
      { tone: 'cold', t: ["People say all sorts of things.", "Believe what you like."], r: ["I believe them.", "I will."] },
    ] },
  // ---- a stirrer, winding you up -----------------------------------------------------------------------------------------------------
  { id: 'driverWindUp', who: ['driver'], w: 3, when: (x, n) => heated(x) && !n.mate && n.persona === 'stirrer' && n.mood <= 0, open: [
    "Nice overalls. Did someone iron them for you?", "I've been watching your onboards. Very educational. On what not to do.", "Oh, it's you. The stewards' favourite customer." ],
    opts: [
      { tone: 'light', t: ["Funny. Did you write that in the car on the way here?", "That's good. Did your engineer write it for you?"], r: ["Ha. Okay, that was decent.", "Ha! Fair. Maybe."], then: { say: ["Seriously, though. Stay out of my way into Turn 1.", "Seriously - give me room into Turn 1, yeah?"], opts: [
        { tone: 'light', t: ["I'll wave as I go past.", "I'll leave you a gap. A small one."], r: ["Ha. Cheeky.", "Ha! Fine."] },
        { tone: 'firm', t: ["Room for both of us, if you leave it.", "Same as always: hard and fair."], r: ["We'll see.", "Hm."] },
        { tone: 'kind', t: ["Good luck out there. Genuinely.", "Have a good one. Keep it clean."], r: ["...Yeah. You too.", "Ugh. You're too nice for this."] },
        { tone: 'cruel', t: ["Stay out of my mirrors and we'll be fine.", "You'll be too far behind to worry about it."], r: ["Ooh. Touchy.", "Charming."] } ] } },
      { tone: 'firm', t: ["Talk all you like. I'll be in front.", "Save it for the track."], r: ["Ooh. Serious today.", "Touchy, touchy."], then: { say: ["What are you going to do about it?", "Or what?"], opts: [
        { tone: 'light', t: ["Beat you. Then smile about it.", "Overtake you. Then wave."], r: ["Ha. We'll see.", "In your dreams."] },
        { tone: 'cold', t: ["Nothing. You're not worth it.", "Nothing at all."], r: ["Boring.", "Suit yourself."] },
        WALK, SHOVE ] } },
      { tone: 'cruel', t: ["Funny. Shame your lap times aren't.", "Shame your driving's not as sharp as your mouth."], r: ["Oh, there it is.", "Ha. Struck a nerve, have I?"], then: { say: ["Come on, then. What are you going to do?", "Go on. I dare you."], opts: [
        { tone: 'light', t: ["Laugh at you on the cool-down lap.", "Nothing. I'll let the driving talk."], r: ["Ha. Boring.", "Fine."] },
        { tone: 'cruel', t: ["Nothing you'd notice from behind me.", "You're not worth the stewards' time."], r: ["Big talk.", "Right."] },
        WALK, SHOVE ] } },
      { tone: 'cold', t: ["Not interested.", "Go and bother someone else."], r: ["Ha. Boring.", "Suit yourself."] },
    ] },
  // ---- your penalty points, rubbed in -------------------------------------------------------------------------------------------------
  { id: 'driverPoints', who: ['driver'], w: 3, when: (x, n) => heated(x) && !n.mate && (x.points || 0) >= 8 && (n.persona === 'stirrer' || n.mood <= -1), open: [
    "How many penalty points is it now? Careful. One more nudge and you're watching from the sofa.", "I hear the stewards have your number on speed dial.", "Go on, try something at Turn 1. I'd love a race weekend without you." ],
    opts: [
      { tone: 'firm', t: ["I know exactly where I stand. Clean race today.", "I'll worry about my licence. You worry about your lap times."], r: ["Clean. You. Right.", "Ooh."], then: { say: ["Bet you can't go a whole race without a penalty.", "Bet you can't keep it clean for a whole race."], opts: [
        { tone: 'firm', t: ["Watch me.", "Bet I can."], r: ["We'll see.", "Ha. Fine."] },
        { tone: 'light', t: ["Drama's overrated. Points are better.", "I'll be so clean the stewards will get bored."], r: ["Ha.", "Says you."] },
        { tone: 'cold', t: ["Not interested in bets.", "Find your drama somewhere else."], r: ["Boring.", "Fine."] } ] } },
      { tone: 'light', t: ["The stewards and I are on first-name terms. It's very cosy.", "Worried about me? That's sweet."], r: ["Ha! Okay, that was good.", "Ha. Don't flatter yourself."] },
      { tone: 'cold', t: ["Not discussing my licence with you.", "Worry about yourself."], r: ["Touchy.", "I'm not the one who should be worried."] },
      { tone: 'cruel', t: ["Keep talking and the stewards will have something new to look at.", "If I sit one out, at least I won't have to listen to you."], r: ["Go on, then. Do something stupid. I dare you.", "Go on. Make my weekend."], then: { say: ["Well? I'm waiting.", "Go on, then."], opts: [
        { tone: 'firm', t: ["Not worth it. Not for you.", "You'd love that, wouldn't you? No."], r: ["Thought not.", "Shame."] },
        WALK, SHOVE ] } },
    ] },
  // ---- your team-mate, still sore -----------------------------------------------------------------------------------------------------
  { id: 'mateClash', who: ['driver'], w: 4, when: (x, n) => heated(x) && n.mate && n.mood <= -1, open: [
    "You ignored the team call last time. In front of everyone.", "We need to talk about what happened between us last time. Properly.", "The boss wants us to shake hands before the start. I'm not sure I want to." ],
    opts: [
      { tone: 'sorry', t: ["You're right to be angry. I got it wrong last time. Sorry.", "That was on me, last time. I'm sorry."], r: ["...Okay. Good. That matters.", "Fine. Thank you."], then: { say: ["Both cars home today, then?", "So we race each other clean today?"], opts: [
        { tone: 'kind', t: ["Both cars home. That's the job.", "Clean. You have my word."], r: ["Good.", "Okay. Good."] },
        { tone: 'firm', t: ["Both home, but I'm still racing you.", "Clean and hard."], r: ["Wouldn't want anything else.", "Fine."] },
        { tone: 'light', t: ["Both home. Me slightly first.", "Clean. I'll even indicate."], r: ["Ha. Dream on.", "Ha."] } ] } },
      { tone: 'firm', t: ["I raced you. That's what they pay us for.", "I'd do the same again. That's racing."], r: ["They pay us to be team players too.", "Then we've got a problem."], then: { say: ["One of us is going to have to give, and it won't be me.", "This is going to cost the team, you know that?"], opts: [
        { tone: 'firm', t: ["Then let the stopwatch decide.", "Then beat me. That settles it."], r: ["Fine.", "We'll see."] },
        { tone: 'sorry', t: ["...Okay. Let's sort it with the boss after the race.", "Fair. Let's talk properly after the race."], r: ["Fine. After.", "...Okay."] },
        { tone: 'cruel', t: ["The team was fine until you got here.", "Maybe you should've been quicker."], r: ["Wow. Right.", "Unbelievable."] },
        SHOVE ] } },
      { tone: 'cold', t: ["Not here. Not now.", "Let's do this in the debrief."], r: ["Of course. The debrief.", "Fine."] },
      { tone: 'cruel', t: ["If you'd been quicker, there'd have been nothing to talk about.", "Funny how it's only a problem when you're behind."], r: ["And there it is.", "Right. Good to know."], then: { say: ["Want to say that in front of the garage?", "Say that again."], opts: [
        { tone: 'sorry', t: ["No. Sorry. That was out of order.", "...No. Leave it. Sorry."], r: ["Yeah. It was.", "Fine."] },
        { tone: 'cruel', t: ["Happily.", "You heard."], r: ["Unbelievable.", "Right."] },
        WALK, SHOVE ] } },
    ] },
  // ---- after a scuffle: the rest of the grid saw it ------------------------------------------------------------------------------------
  { id: 'driverHandbags', who: ['driver'], w: 4, when: (x, n) => !x.L && scuffled(x) && !foe(x, n), open: [
    "Handbags on the grid. Very classy. What was that about?", "Half the paddock just watched you two go at it. Feel better?", "You know Race Control saw that, right? Everyone saw that." ],
    opts: [
      { tone: 'sorry', t: ["Not my finest moment. I know.", "It got out of hand. My fault as much as anyone's."], r: ["At least you know.", "Happens. Not usually on the grid."], then: { say: ["You alright to race, though?", "Head straight for the start?"], opts: [
        { tone: 'firm', t: ["Fine. Focused.", "It's done. I'm racing."], r: ["Good.", "Good. Me too."] },
        { tone: 'kind', t: ["Yeah. Thanks for asking.", "Getting there. Thanks."], r: ["No worries.", "Good."] },
        { tone: 'light', t: ["My heart rate's never been higher. Great for the start.", "Fully warmed up, at least."], r: ["Ha.", "Ha. Silver linings."] } ] } },
      { tone: 'firm', t: ["It's sorted. It's done.", "Things got heated. That's all."], r: ["Didn't look sorted.", "Heated's one word for it."] },
      { tone: 'light', t: ["We were discussing the racing line. Passionately.", "A frank exchange of views. With some shoving."], r: ["Ha! Passionately.", "Ha. Frank. Right."] },
      { tone: 'cold', t: ["Not your business.", "Don't."], r: ["Fair enough.", "Fine."] },
    ] },
  // ---- after a scuffle: the one you scuffled with, still bristling (no second round: the officials are watching) ------------------
  { id: 'driverFoe', who: ['driver'], w: 30, when: (x, n) => !x.L && scuffled(x) && foe(x, n), open: [
    "Stay away from me. The stewards are already looking at both of us.", "Haven't you done enough for one afternoon?", "What now? Come to say sorry, or come for round two?" ],
    opts: [
      { tone: 'sorry', t: ["[Offer your hand]", "[Hold out a hand]"], r: ["...Fine. Clean race. That's all.", "...Fine. Not because I want to."], then: { say: ["This doesn't make us friends.", "Turn 1. Give me room and we're square."], opts: [
        { tone: 'kind', t: ["Fair enough. Good luck out there.", "Room. You have my word."], r: ["...Yeah. You too.", "Good."] },
        { tone: 'firm', t: ["Square. Now let's race.", "Understood. Hard and fair from here."], r: ["Fine.", "Fine. Hard and fair."] },
        { tone: 'light', t: ["Friends is a big word. Colleagues who shove?", "Noted. Acquaintances who've been to the stewards together."], r: ["Ha. Don't push it.", "...Ha. Fine."] } ] } },
      { tone: 'sorry', t: ["That got out of hand. I'm sorry. My part of it, anyway.", "I lost my head. That's on me."], r: ["...Yeah. Mine too, maybe.", "At least you can say it."] },
      { tone: 'cold', t: ["Just keep out of my way.", "Nothing to say."], r: ["Gladly.", "Good."] },
      { tone: 'cruel', t: ["You started it. I finished it.", "Next time, pick on someone slower."], r: ["Big talk, with the stewards watching.", "Keep talking. The stewards are listening."], m: -3 },
    ] },
  // ---- he felt your shove earlier on this walk: he took it as a joke -------------------------------------------------------------
  { id: 'driverJabbedLaugh', who: ['driver'], w: 10, when: (x, n) => !x.L && (n.jabbed || 0) >= 1 && n.mood >= 1, open: [
    "Was that a shove or a hug? Hard to tell with you.", "You've got a strong arm for someone who brakes that early.", "If that's how you say hello, I'd hate to see goodbye." ],
    opts: [
      { tone: 'light', t: ["That was a hug. A very efficient one.", "Racing drivers' handshake. You wouldn't know it."], r: ["Ha! Do that in Turn 1 and we'll have words.", "Ha. Learn a normal one."], then: { say: ["Seriously, though. Good luck out there.", "Clean race today?"], opts: [
        { tone: 'kind', t: ["You too. Genuinely.", "Clean. Always, with you."], r: ["Cheers.", "Good."] },
        { tone: 'firm', t: ["Clean and quick. Me in front.", "Clean. Not gentle."], r: ["Ha. We'll see.", "Fair."] },
        { tone: 'light', t: ["Clean. No hugs on track.", "Only if you promise not to hug me back."], r: ["Ha. Deal.", "Ha. Deal."] } ] } },
      { tone: 'kind', t: ["Just saying hello. Good to see you.", "Couldn't resist. Have a good one today."], r: ["You too, idiot.", "Ha. You too."] },
      { tone: 'firm', t: ["Just checking you're awake. Turn 1's going to be busy.", "Testing your balance. You'll need it later."], r: ["Wide awake. Watch your mirrors.", "Ha. Balance is fine."] },
      { tone: 'cold', t: ["Don't read anything into it.", "Forget it."], r: ["Okay...", "Bit weird, but okay."] },
    ] },
  // ---- he felt your shove earlier on this walk: he did not like it -------------------------------------------------------------
  { id: 'driverJabbedCross', who: ['driver'], w: 10, when: (x, n) => heated(x) && (n.jabbed || 0) >= 1 && n.mood < 1, open: [
    "Do that again and we've got a problem.", "What was that shove for? Seriously.", "Keep your hands to yourself. I mean it." ],
    opts: [
      { tone: 'sorry', t: ["You're right. That was out of order. Sorry.", "My fault. Nerves. Sorry."], r: ["...Fine. Don't do it again.", "Okay. Just - don't."], then: { say: ["Save it for the track, yeah?", "We good for the start?"], opts: [
        { tone: 'kind', t: ["Track only. Good luck.", "We're good. Clean race."], r: ["Yeah. You too.", "Good."] },
        { tone: 'firm', t: ["On track I won't be apologising.", "Good for the start. Not giving you an inch, mind."], r: ["Wouldn't expect you to.", "Fine."] },
        { tone: 'light', t: ["Track only. Promise. Hands on the wheel.", "Good. I'll keep my hands in my gloves."], r: ["Ha. Do that.", "Ha. Fine."] } ] } },
      { tone: 'light', t: ["Relax. It was a friendly one.", "That was me being nice."], r: ["Didn't feel friendly.", "Then I'd hate to see you angry."], then: { say: ["Try it again and see what happens.", "Do it again and you'll find out."], opts: [
        { tone: 'sorry', t: ["Okay, okay. Point taken.", "Fine. Hands off. Sorry."], r: ["Good.", "Thank you."] },
        { tone: 'firm', t: ["I won't need to. I'll be in front.", "No need. See you at Turn 1."], r: ["We'll see.", "Hm."] },
        WALK, SHOVE ] } },
      { tone: 'firm', t: ["You were in my way.", "You'll survive."], r: ["In your way? It's a grid.", "That's not the point."], then: { say: ["Something you want to say?", "Got a problem with me?"], opts: [
        { tone: 'cold', t: ["No. Nothing.", "Not one I'll talk about."], r: ["Thought so.", "Right."] },
        { tone: 'sorry', t: ["No. Sorry. I'm wound up today.", "No. That was out of order."], r: ["Fine.", "...Fine."] },
        WALK, SHOVE ] } },
      { tone: 'cold', t: ["Whatever.", "Not now."], r: ["Unbelievable.", "Right."] },
    ] },

  // =====================================================================================================================
  // the crew on the week's stories
  // =====================================================================================================================
  // ---- the scuffle: your own people --------------------------------------------------------------------------------------------------
  { id: 'crewScuffle', who: ['boss', 'eng', 'mech'], w: 8, when: (x) => !x.L && scuffled(x) && x.brawled.started !== false, open: [
    "What on earth was that? Race Control are already asking questions.", "Tell me I didn't just watch my driver in a shoving match on the grid.", "Everyone saw that. The stewards, the cameras, the sponsors. Everyone." ],
    opts: [
      { tone: 'sorry', t: ["It was stupid. I'm sorry. It won't happen again.", "I lost my head. That's on me, not the team."], r: ["...Okay. Thank you for owning it.", "Right. We'll talk properly later."], then: { say: ["Can you drive? Honestly? Head straight?", "Put it in a box until the flag. Can you do that?"], opts: [
        { tone: 'firm', t: ["Yes. It's done. I'm focused.", "Boxed. Gone. Let's race."], r: ["Good. Show me.", "Good."] },
        { tone: 'kind', t: ["Yes. And thanks for not shouting.", "I can. Thanks for having my back."], r: ["Go on. Get in the car.", "Always. Now go."] },
        { tone: 'light', t: ["My heart rate's perfect for a start.", "I'm very warmed up, if that helps."], r: ["It does not help.", "Not funny. ...A bit funny."] } ] } },
      { tone: 'firm', t: ["It's done. Whoever started it, it's finished.", "It's dealt with. I'm focused."], r: ["Who started it won't matter to the stewards.", "It had better be."], then: { say: ["There'll be penalty points for that. You know that?", "The stewards will want a word. You know that?"], opts: [
        { tone: 'firm', t: ["I know. I'll take what's coming.", "Then I'll talk to them. Calmly."], r: ["Good. Calmly.", "Good."] },
        { tone: 'sorry', t: ["I know. I'm sorry for the trouble.", "I know. I've let the team down."], r: ["Then make it up to them on track.", "Make it up to them on track."] },
        { tone: 'cold', t: ["Let them.", "Fine."], r: ["That attitude won't help.", "...Right."] } ] } },
      { tone: 'light', t: ["Just a frank exchange of views.", "We were discussing the racing line. Passionately."], r: ["The stewards won't see it that way.", "Funny. Nobody's laughing."], m: -1 },
      { tone: 'cold', t: ["Not now. I need to get in the car.", "Leave it."], r: ["We'll talk after the race.", "This isn't over."] },
    ] },
  // ---- the scuffle: he came at you first --------------------------------------------------------------------------------------------
  { id: 'crewProvoked', who: ['boss', 'eng', 'mech'], w: 9, when: (x) => !x.L && scuffled(x) && x.brawled.started === false, open: [
    "I saw him come at you first. Are you alright?", "He started it - I saw it, the cameras saw it. Doesn't make it any prettier, mind.", "You didn't start that. I'll make sure Race Control know it." ],
    opts: [
      { tone: 'kind', t: ["I'm fine. Thanks for having my back.", "I'm alright. Honestly. Thanks."], r: ["Always. That's what we're here for.", "Good. Now breathe."], then: { say: ["You could have walked away, you know. Next time, walk away.", "Next time someone tries that, walk away. Let the stewards deal with it."], opts: [
        { tone: 'sorry', t: ["You're right. I should have.", "I know. I'll do better."], r: ["Good. Lesson learnt.", "That's all I ask."] },
        { tone: 'firm', t: ["I wasn't going to just stand there.", "He needed to know I won't be pushed around."], r: ["The stewards won't care about that.", "Hm. On track, fine. Not here."] },
        { tone: 'light', t: ["I was walking away. Backwards. With my arms out.", "I'll walk away faster next time. Promise."], r: ["Ha. Very convincing.", "Ha. Do that."] } ] } },
      { tone: 'firm', t: ["He wanted a reaction. He got one. It's done.", "He picked the wrong day. It's over."], r: ["Done is good. Keep it done.", "Make sure it is."], then: { say: ["Use it in the car. Not on the grid.", "Turn it into lap time. Nothing else."], opts: [
        { tone: 'firm', t: ["Copy. Lap time.", "That's the plan."], r: ["Good.", "Good."] },
        { tone: 'kind', t: ["I will. Thanks for keeping me calm.", "Thanks. I needed that."], r: ["Any time.", "Go on, then."] },
        { tone: 'cold', t: ["I know what to do.", "Fine."], r: ["Right.", "...Okay."] } ] } },
      { tone: 'light', t: ["I've had firmer handshakes.", "It's fine. I've been shoved harder by my mechanics."], r: ["Ha. Not funny. ...A bit funny.", "Oi. Only in a pit stop."] },
      { tone: 'cold', t: ["Not now.", "I don't want to talk about it."], r: ["Fair enough. Get your head right.", "Okay. I'm here if you do."] },
    ] },
  // ---- he came at you, and you walked away ----------------------------------------------------------------------------------------
  { id: 'crewRestraint', who: ['boss', 'eng', 'mech'], w: 9, when: (x) => !x.L && !!x.brawled?.walkedAway, open: [
    "Saw you walk away from that. Took more nerve than shoving back would have.", "He wanted a reaction and you didn't give him one. Proper.", "Good call, walking away. The stewards will have seen who started it." ],
    opts: [
      { tone: 'kind', t: ["It wasn't worth it. Not for the team.", "Thanks. I thought about all of you."], r: ["That's why you're in this car.", "We noticed. All of us."], then: { say: ["How are you feeling? Honestly?", "Head still right for the start?"], opts: [
        { tone: 'firm', t: ["Calm. Calmer than him, anyway.", "Focused. Let's race."], r: ["Good.", "That's my driver."] },
        { tone: 'light', t: ["Very calm. Inside I'm shouting.", "Calm. Ask me again at Turn 1."], r: ["Ha. Keep the shouting inside.", "Ha. Will do."] },
        { tone: 'kind', t: ["Better for hearing that. Thank you.", "Good. You lot keep me steady."], r: ["Go on. Get in.", "Any time."] } ] } },
      { tone: 'firm', t: ["I'll answer him on track.", "The place to settle it is Turn 1. Cleanly."], r: ["Cleanly. That's the word.", "That's it."] },
      { tone: 'light', t: ["I've seen what the stewards charge. Too expensive.", "Walking away is my new thing. Very mature."], r: ["Ha. Very mature.", "Ha. Long may it last."] },
      { tone: 'cold', t: ["Just don't make a fuss about it.", "Let's move on."], r: ["Fair enough.", "Right you are."] },
    ] },
  // ---- the penalty points: keep it clean ------------------------------------------------------------------------------------------------
  { id: 'crewPoints', who: ['boss', 'eng'], w: 4, when: (x) => !x.L && (x.points || 0) >= 8, open: [
    "You're carrying a lot of penalty points. Twelve and you sit out a race. Keep it clean today.", "Race Control will have their eye on you. Don't give them a reason.", "No lunges, no weaving, no arguments with the stewards. Not today." ],
    opts: [
      { tone: 'firm', t: ["Understood. Clean and patient.", "Nothing silly. I know where I am."], r: ["Good. Patience wins today.", "That's what I want to hear."], then: { say: ["If someone dives on you, let it go. You can get it back later.", "We'll tell you if anyone near you is on a warning. Use it."], opts: [
        { tone: 'firm', t: ["Copy. Patient, and keep me informed.", "Copy. Clean, patient, and tell me everything."], r: ["Good.", "Will do."] },
        { tone: 'kind', t: ["Thanks for looking out for me.", "Appreciate it. Really."], r: ["It's the job. And I like you. Mostly.", "Any time."], m: 2 },
        { tone: 'light', t: ["I'll drive like there's a cake on the passenger seat.", "I'll be so clean they'll send me a thank-you card."], r: ["Ha. Do that.", "Ha. I'd frame it."] } ] } },
      { tone: 'kind', t: ["I know. Some of those were my fault. It stops now.", "I hear you. I'll be sensible."], r: ["Good. Just be smart.", "Good."] },
      { tone: 'light', t: ["I'm collecting them. Twelve and I get a free weekend off.", "Clean. Like a road-safety advert."], r: ["That's not funny. ...It's a bit funny. It's not funny.", "Please."] },
      { tone: 'cruel', t: ["Half of them were rubbish decisions anyway.", "Tell the stewards to do their job properly, then."], r: ["Maybe. They still count.", "I'll pretend I didn't hear that."], m: -2 },
    ] },
  // ---- your partner, as the garage sees it -----------------------------------------------------------------------------------------------
  { id: 'crewPartner', who: ['mech', 'eng', 'boss'], w: 2.5, when: (x) => !x.L && !!x.partner, open: [
    "How's {partner}? The lads keep asking. Well - they keep asking me to ask.", "{partner} sent the garage a box of pastries last week. You're officially the team's favourite driver now.", "Saw you and {partner} in the paper. The lads have printed it out. It's on the fridge." ],
    opts: [
      { tone: 'kind', t: ["She's great. Tell the lads she says hello.", "She's brilliant. And she asks about all of you."], r: ["They'll be insufferable now.", "Don't tell them that, they'll get ideas."], then: { say: ["Bring her round after the race. The lads will behave. Probably.", "She's welcome in the garage any time. You know that."], opts: [
        { tone: 'kind', t: ["I will. She'd love that.", "Thanks. That means a lot to her."], r: ["Good.", "Good. Tell her."] },
        { tone: 'light', t: ["I'll warn her about the jelly beans.", "Only if someone cleans the coffee machine."], r: ["Ha. No promises.", "Ha. Never."] },
        { tone: 'firm', t: ["After the debrief. Work first.", "Maybe. After the race."], r: ["Fair.", "Fair enough."] } ] } },
      { tone: 'light', t: ["The lads are worse gossips than the Paddock Post.", "Tell the lads to mind their own business. Lovingly."], r: ["Ha. Guilty.", "Ha. We'll try. We won't."] },
      { tone: 'firm', t: ["Private life stays private. Even from the lads.", "Let's keep the garage about the car."], r: ["Fair enough.", "Understood. Sorry."] },
      { tone: 'cold', t: ["Not your concern.", "Can we not?"], r: ["...Right.", "Sorry."], m: -1 },
    ] },

  // =====================================================================================================================
  // the reporter (Paddock Weekly) on the week's stories
  // =====================================================================================================================
  // ---- the scuffle -----------------------------------------------------------------------------------------------------------------------
  { id: 'pressScuffle', who: ['press'], w: 8, when: (x) => !x.L && (scuffled(x) || (x.crisis === 'brawl' && !x.brawled)), open: [
    "The scuffle on the grid - everyone's asking about it. What happened?", "Some are calling it handbags, some are calling it a disgrace. Which is it?", "Will you be apologising for the scenes on the grid?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["It shouldn't have happened. I apologise - to him and to the fans.", "I let my emotions get the better of me. I'm sorry."], r: ["Thank you. That's a clear answer.", "Noted. Thank you."], then: { say: ["Will you speak to him after the race?", "Will you be talking to him after the race?"], opts: [
        { tone: 'kind', fx: 'press', t: ["Yes. We'll shake hands and move on.", "Of course. We're adults. We'll sort it."], r: ["Thank you.", "Good to hear."] },
        { tone: 'firm', fx: 'press', t: ["That's between us. But yes.", "Privately, yes."], r: ["Fair.", "Understood."] },
        { tone: 'cold', t: ["That's all I'll say about it.", "No more on that."], r: ["Of course.", "Understood."] } ] } },
      { tone: 'firm', fx: 'press', t: ["Things got heated. It's dealt with. I'm focused on the race.", "We're competitors. Sometimes it boils over. It's over now."], r: ["Some would say it's not acceptable.", "Fair enough."] },
      { tone: 'light', fx: 'press', t: ["We were discussing the racing line. Passionately.", "Handbags. Nobody was hurt, apart from some pride."], r: ["The stewards may not see the funny side.", "That's going in."] },
      { tone: 'cruel', fx: 'press', t: ["Ask him what he said first.", "I'm not apologising for standing up for myself."], r: ["That's my headline.", "Strong words."], m: -2 },
      { tone: 'cold', t: ["No comment.", "Next question."], r: ["Of course.", "Worth a try."] },
    ] },
  // ---- the shove you walked away from ------------------------------------------------------------------------------------------------
  { id: 'pressRestraint', who: ['press'], w: 8, when: (x) => !x.L && !!x.brawled?.walkedAway, open: [
    "You were shoved on the grid and you walked away. What went through your head?", "Plenty of drivers would have shoved back just now. Why didn't you?", "Our photographer caught that shove - and you walking away. Any message for the driver involved?" ],
    opts: [
      { tone: 'kind', fx: 'press', t: ["It's not worth it. Not on a grid, not anywhere.", "There are kids watching. That matters more than my pride."], r: ["That's a mature answer.", "Thank you. Readers will like that."], then: { say: ["Will you be speaking to the stewards about it?", "Do you expect him to be penalised?"], opts: [
        { tone: 'firm', fx: 'press', t: ["That's for the stewards. I'm here to race.", "It's not my call. I've said what I saw."], r: ["Fair.", "Understood."] },
        { tone: 'kind', fx: 'press', t: ["I'd rather we just shook hands after the race.", "I hope not. Everyone has a bad moment."], r: ["Generous.", "That's generous."] },
        { tone: 'cold', t: ["No more on that.", "That's all I'll say."], r: ["Of course.", "Understood."] } ] } },
      { tone: 'firm', fx: 'press', t: ["I'll answer him on track. Cleanly.", "The place to settle anything is Turn 1."], r: ["Strong.", "We'll be watching."] },
      { tone: 'light', fx: 'press', t: ["I've seen what the stewards charge. Too expensive.", "I'm a racer, not a wrestler."], r: ["Ha!", "Ha. That's going in."] },
      { tone: 'cruel', fx: 'press', t: ["He'll need more than a shove to rattle me.", "That's what you do when you can't beat someone on track."], r: ["That'll sting.", "That's my headline."], m: -2 },
    ] },
  // ---- penalty points, a ban in sight ------------------------------------------------------------------------------------------------------
  { id: 'pressPoints', who: ['press'], w: 5, when: (x) => !x.L && (x.points || 0) >= 8, open: [
    "You're closing in on twelve penalty points - a race ban. Will that change how you drive today?", "One more bad afternoon and you could be watching a race from the sofa. Worried?", "The stewards have been busy with you lately. Are you too aggressive?" ],
    opts: [
      { tone: 'firm', fx: 'press', t: ["I know where I stand. I'll race hard and clean.", "It won't change anything. I've always raced fair."], r: ["We'll see.", "Clear enough."], then: { say: ["Do you think the points system is fair?", "Have the stewards been harsh on you?"], opts: [
        { tone: 'firm', fx: 'press', t: ["It's the same rules for all of us. I accept them.", "Some calls I disagree with. That's racing."], r: ["Diplomatic.", "Fair."] },
        { tone: 'cruel', fx: 'press', t: ["Some of those decisions were a joke. Everyone knows it.", "Ask the stewards. I've stopped trying to understand them."], r: ["They won't like that.", "That's going in."], m: -1 },
        { tone: 'light', fx: 'press', t: ["I'd like a loyalty card, at least.", "They know me by name now. That's something."], r: ["Ha!", "Ha. I'll print that."] } ] } },
      { tone: 'sorry', fx: 'press', t: ["Some of those were my mistakes. I've learnt from them.", "I've been too eager at times. I own that."], r: ["Honest.", "That's refreshing."] },
      { tone: 'light', fx: 'press', t: ["Worried? I've started driving my road car like a saint.", "I'd rather watch the next race from the cockpit, thanks."], r: ["Ha!", "I'll print that."] },
      { tone: 'cold', t: ["I'm not discussing my licence.", "No comment."], r: ["Of course.", "Fair enough."] },
    ] },
  // ---- a busy afternoon with the stewards last time ----------------------------------------------------------------------------------------
  { id: 'pressReckless', who: ['press'], w: 5, when: (x) => !x.L && x.crisis === 'reckless' && (x.points || 0) < 8, open: [
    "The stewards were busy with you last time out. Too aggressive?", "Some are calling your last race reckless. Is that fair?", "Several penalties in one race - what went wrong last time?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["Fair criticism. I was too eager, and I paid for it.", "Not my best afternoon. I've watched it back and I know where I went wrong."], r: ["Honest.", "That's refreshing."], then: { say: ["What changes today?", "How do you make sure it doesn't happen again?"], opts: [
        { tone: 'firm', fx: 'press', t: ["Patience. The move will still be there a lap later.", "Pick the right fights. Not every gap is a gap."], r: ["Clear.", "Noted."] },
        { tone: 'kind', fx: 'press', t: ["Respect the people around me. That's the lesson.", "Give everyone room. It costs nothing."], r: ["Good to hear.", "Thank you."] },
        { tone: 'light', fx: 'press', t: ["I've been told to count to three before every overtake. I've reached two.", "Deep breaths. Lots of them."], r: ["Ha!", "Ha. Good luck."] } ] } },
      { tone: 'firm', fx: 'press', t: ["I race hard. Sometimes the stewards see it differently. That's racing.", "I'd rather be called aggressive than anonymous."], r: ["Some would call that reckless.", "Strong words."] },
      { tone: 'light', fx: 'press', t: ["The stewards and I are getting to know each other.", "I was trying to collect the full set."], r: ["Ha. They might not want to.", "Ha. Don't."] },
      { tone: 'cold', t: ["It's done. Next question.", "No comment."], r: ["Of course.", "Fair enough."] },
    ] },
  // ---- your partner ----------------------------------------------------------------------------------------------------------------------
  { id: 'pressPartner', who: ['press'], w: 4, when: (x) => !x.L && !!x.partner && x.crisis !== 'scandal', open: [
    "You and {partner} - the photographers can't get enough. Is it serious?", "Does having {partner} in your life change anything on track?", "Our readers want to know: how did you and {partner} meet?" ],
    opts: [
      { tone: 'kind', fx: 'press', t: ["I'm very happy. That's all anyone needs to know.", "She makes the hard weekends easier. That's the honest answer."], r: ["That's lovely.", "Thank you. That's sweet."], then: { say: ["Will we see more of her on the grid?", "Will she be at more races this season?"], opts: [
        { tone: 'light', fx: 'press', t: ["Ask her. She's busier than I am.", "If she can stand the noise."], r: ["Ha!", "Ha. Fair."] },
        { tone: 'firm', t: ["That's for us to know.", "That stays between us."], r: ["Fair.", "Of course."] },
        { tone: 'kind', fx: 'press', t: ["Whenever she can. She's always welcome.", "I hope so. It's better with her here."], r: ["Thank you.", "Lovely."] } ] } },
      { tone: 'firm', t: ["My private life stays private.", "I'll talk about the racing. That's my job."], r: ["Of course.", "Understood."] },
      { tone: 'light', fx: 'press', t: ["She's the famous one. I'm just the driver.", "She's heard me sing and she's still here. Make of that what you will."], r: ["Ha!", "That's going in."] },
      { tone: 'cold', t: ["No comment.", "Not today."], r: ["Of course.", "Worth a try."] },
    ] },
  // ---- the tabloid story ----------------------------------------------------------------------------------------------------------------
  { id: 'pressScandal', who: ['press'], w: 7, when: (x) => !x.L && x.crisis === 'scandal', open: [
    "The Paddock Post are running photographs of you this week. Their word is 'cosy'. Anything to say?", "There's a story doing the rounds about your private life. Is it true?", "Your people haven't commented on the photographs. Will you?" ],
    opts: [
      { tone: 'firm', fx: 'press', t: ["A photograph of a conversation is just a conversation.", "There's nothing in it. I'd ask people to leave it there."], r: ["Clear enough.", "Noted."], then: { say: ["Has it been a distraction this weekend?", "Has the story affected your preparation?"], opts: [
        { tone: 'firm', fx: 'press', t: ["No. My focus is the race.", "Not at all. The car doesn't read the papers."], r: ["Noted.", "Ha. Fair."] },
        { tone: 'kind', fx: 'press', t: ["It's harder on the people around me than on me.", "Only in that I wish people would be kinder."], r: ["Fair point.", "Understood."] },
        { tone: 'cold', t: ["Next question.", "I've said what I'm going to say."], r: ["Of course.", "Understood."] } ] } },
      { tone: 'sorry', fx: 'press', t: ["If anyone's been hurt by it, I'm sorry. That matters more than the headlines.", "I'll talk to the people it affects. Not to the papers."], r: ["Thank you.", "That's a dignified answer."] },
      { tone: 'light', fx: 'press', t: ["The Post can make me eating a sandwich look cosy.", "Cosy? I was cold. It's a grid."], r: ["Ha. They probably could.", "Ha. I'll pass it on."] },
      { tone: 'cold', t: ["I don't discuss my private life.", "No comment."], r: ["Of course.", "Understood."] },
    ] },
  // ---- the night out -------------------------------------------------------------------------------------------------------------------
  { id: 'pressNightout', who: ['press'], w: 6, when: (x) => !x.L && x.crisis === 'nightout', open: [
    "There are photographs of you leaving a club at three in the morning. Ideal preparation?", "Some fans think you've been partying more than training. Fair?", "Pictures of your night out are all over the internet. Has the team said anything?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["It was a late one. Too late. Lesson learnt.", "Bad timing on my part. I've said sorry to the team."], r: ["Honest.", "Fair enough."] },
      { tone: 'firm', fx: 'press', t: ["One night off. My preparation hasn't changed.", "Judge me on what I do on track."], r: ["We will.", "Noted."], then: { say: ["And if the result isn't there today?", "And if today goes badly?"], opts: [
        { tone: 'firm', fx: 'press', t: ["Then it won't be because of one night out.", "Then I'll own it. Like always."], r: ["Noted.", "Fair."] },
        { tone: 'kind', fx: 'press', t: ["Then I'll apologise to the team and work harder.", "Then that's on me, and I'll fix it."], r: ["Honest.", "Thank you."] },
        { tone: 'light', fx: 'press', t: ["Then I'll blame the DJ.", "Then I'll stay in next time. Probably."], r: ["Ha!", "Ha. Probably."] } ] } },
      { tone: 'light', fx: 'press', t: ["I was dancing. It's cardio.", "In my defence, the music was very good."], r: ["Ha!", "I'll tell the readers."] },
      { tone: 'cold', t: ["No comment.", "That's my business."], r: ["Of course.", "Fair."] },
    ] },
  // ---- a war of words with another driver -------------------------------------------------------------------------------------------------
  { id: 'pressFeud', who: ['press'], w: 6, when: (x) => !x.L && x.crisis === 'feud', open: [
    "There's been a lot of noise about you and another driver this week. Is this a feud now?", "The war of words has been everywhere this week. Do you regret any of it?", "Your rival's camp say you've crossed a line. What do you say to that?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["Some of what I said was out of order. I've said so privately, and I'll say it here.", "I'd take some of it back. We're all competitors, and we should respect each other."], r: ["That's a big thing to say.", "Thank you."] },
      { tone: 'firm', fx: 'press', t: ["I race hard and I speak honestly. That isn't a feud.", "I said what I thought. We'll settle the rest on track."], r: ["Some would call that a feud.", "Fair enough."], then: { say: ["Will you shake hands before the start?", "Is there any respect left between you?"], opts: [
        { tone: 'kind', fx: 'press', t: ["Of course. There's always respect.", "Yes. Respect doesn't stop because we argue."], r: ["Good to hear.", "Thank you."] },
        { tone: 'firm', fx: 'press', t: ["On track, we'll see.", "Respect is earned. Both ways."], r: ["Noted.", "Fair."] },
        { tone: 'cold', t: ["That's between us.", "No comment."], r: ["Of course.", "Understood."] } ] } },
      { tone: 'light', fx: 'press', t: ["A feud? We just disagree about who should be in front.", "Everyone's very sensitive this year."], r: ["Ha.", "Hm. That'll go down well."] },
      { tone: 'cold', t: ["Next question.", "I've said all I'm going to say."], r: ["Of course.", "Understood."] },
    ] },
  // ---- something you said on camera ---------------------------------------------------------------------------------------------------------
  { id: 'pressCruel', who: ['press'], w: 6, when: (x) => !x.L && x.crisis === 'cruel', open: [
    "That clip of you on camera last time has been everywhere. Do you stand by what you said?", "A lot of people didn't like what the cameras caught you saying. Any regrets?", "Some in the paddock say that remark crossed a line. What do you say to them?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["It was out of order. I've apologised privately, and I'll say it here: I'm sorry.", "I'd take it back if I could. That's not who I want to be."], r: ["That's a big thing to say.", "Thank you. That's clear."], then: { say: ["What have you learnt from it?", "Will it change how you speak to people?"], opts: [
        { tone: 'kind', fx: 'press', t: ["Think before I speak. Especially with a camera nearby. Especially without one.", "That everyone on a grid is a person first."], r: ["Thank you.", "Well said."] },
        { tone: 'firm', fx: 'press', t: ["It's a lesson. I've learnt it.", "I'll let my driving do the talking from now on."], r: ["Noted.", "We'll see."] },
        { tone: 'cold', t: ["I've said what I need to say.", "That's enough on it."], r: ["Of course.", "Understood."] } ] } },
      { tone: 'firm', fx: 'press', t: ["It was taken out of context. I'll leave it there.", "I said it in the heat of the moment. It's dealt with."], r: ["Some won't accept that.", "Fair enough."] },
      { tone: 'light', fx: 'press', t: ["Note to self: the microphones are everywhere.", "I've been told to talk only about tyres from now on. So: tyres."], r: ["Ha. They are.", "Ha. Very good."] },
      { tone: 'cold', t: ["No comment.", "Next question."], r: ["Of course.", "Worth a try."] },
    ] },
  // ---- a collision the stewards gave you ten seconds for --------------------------------------------------------------------------------------
  { id: 'pressClash', who: ['press'], w: 6, when: (x) => !x.L && x.crisis === 'clash', open: [
    "Ten seconds from the stewards for that collision last time. Was it your fault?", "That contact last time out still has people talking. Have you two spoken since?", "The stewards came down hard on you last time. Fair call?" ],
    opts: [
      { tone: 'sorry', fx: 'press', t: ["It was my mistake. I misjudged it, and I've told him so.", "My fault. I've apologised to him and to both teams."], r: ["Honest.", "That's a clear answer."], then: { say: ["Will it make you more cautious today?", "Does it change how you'll race him today?"], opts: [
        { tone: 'firm', fx: 'press', t: ["No. Same racer, better judgement.", "I'll race him hard. And give him room."], r: ["Noted.", "Fair."] },
        { tone: 'kind', fx: 'press', t: ["I'll give everyone a car's width. That's the lesson.", "Respect first. That's how it should always be."], r: ["Good to hear.", "Thank you."] },
        { tone: 'light', fx: 'press', t: ["I've had my mirrors cleaned. Both of them.", "I'll be indicating at every corner."], r: ["Ha!", "Ha. I'll print that."] } ] } },
      { tone: 'firm', fx: 'press', t: ["Racing incident, for me. The stewards saw it differently. I accept it.", "I don't agree with it, but it's done. I've moved on."], r: ["Diplomatic.", "Fair enough."] },
      { tone: 'cruel', fx: 'press', t: ["He left the door open and then shut it on me. Look again.", "Ask him why he turned in like I wasn't there."], r: ["He won't like that.", "That's my headline."], m: -2 },
      { tone: 'cold', t: ["The stewards have decided. That's the end of it.", "No comment."], r: ["Of course.", "Understood."] },
    ] },
  // ---- a slump: questions over your seat -------------------------------------------------------------------------------------------------
  { id: 'pressSlump', who: ['press'], w: 5, when: (x) => !x.L && x.crisis === 'slump', open: [
    "Three difficult races in a row. Are you worried about your seat?", "There's talk your team are looking at other drivers. How do you respond?", "What's gone wrong lately? The car, or you?" ],
    opts: [
      { tone: 'firm', fx: 'press', t: ["I know what I can do. Results will come.", "I've been here before. I know the way out."], r: ["Confident.", "We'll see."], then: { say: ["What needs to change?", "What's the fix?"], opts: [
        { tone: 'firm', fx: 'press', t: ["Execution. Mine and ours. We're working on it.", "Qualifying. Start further up and the races look after themselves."], r: ["Clear.", "Noted."] },
        { tone: 'kind', fx: 'press', t: ["The team have backed me every day. I want to repay that.", "We'll come through it together. That's how this team works."], r: ["Thank you.", "Good to hear."] },
        { tone: 'light', fx: 'press', t: ["My luck. If anyone's found it, send it to the garage.", "My socks. I've changed my socks."], r: ["Ha.", "Ha. Science."] } ] } },
      { tone: 'kind', fx: 'press', t: ["It's been hard. The team deserve better from me, and I'll give it.", "I'm not hiding from it. I need to be better, and I will be."], r: ["Honest.", "Thank you for being straight."] },
      { tone: 'cruel', fx: 'press', t: ["Look at the car before you look at me.", "Ask the strategists."], r: ["That'll go down well at the factory.", "Strong words."], m: -2 },
      { tone: 'cold', t: ["No comment on contracts.", "Ask the team."], r: ["Of course.", "Fair enough."] },
    ] },
  // ---- a great drive last time ---------------------------------------------------------------------------------------------------------------
  { id: 'pressMoment', who: ['press'], w: 5, when: (x) => !x.L && x.crisis === 'moment', open: [
    "After last time out, everyone's talking about you. How does it feel?", "The fans loved your drive last time. Did you see the messages?", "That drive last time - the best of your career?" ],
    opts: [
      { tone: 'kind', fx: 'press', t: ["It meant a lot. That drive was for the whole team.", "The support's been amazing. Thank you to everyone who sent a message."], r: ["Lovely.", "Thank you."] },
      { tone: 'firm', fx: 'press', t: ["Good, but I want more. That's the standard now.", "One good race. I want ten in a row."], r: ["Ambitious.", "Strong."], then: { say: ["Can you do it again today?", "What's the target today?"], opts: [
        { tone: 'firm', fx: 'press', t: ["That's the plan.", "Every weekend. That's the job."], r: ["Noted.", "Clear."] },
        { tone: 'kind', fx: 'press', t: ["If the car's there, yes. The team deserve it.", "We'll give it everything. Same as last time."], r: ["Thank you.", "Good luck."] },
        { tone: 'light', fx: 'press', t: ["Ask me in two hours.", "If not, I'll blame the hype."], r: ["Ha!", "Ha. Will do."] } ] } },
      { tone: 'light', fx: 'press', t: ["Ask me again after this one. I might have a better answer.", "I've read every message. My thumb hurts."], r: ["Ha!", "Ha. Lovely."] },
      { tone: 'show', fx: 'press', t: ["The best? Probably. I'll beat it today.", "That's what I can do. Everyone else is just noticing."], r: ["Confident.", "That'll fire up the others."] },
    ] },
];

/** a star's goodbye, by how things stand with her (for ui/GridWalk.js's _farewell, if it wants them) */
export const FAREWELL4 = {
  star: ["Good luck! I'll be watching.", "Lovely to meet you. Good luck out there.", "Go on, then. Go and be fast."],
  warm: ["Go on. Be brilliant. Find me after?", "Good luck. I mean it.", "Don't keep me waiting after the race."],
  partner: ["Nothing stupid. Go.", "Go. I'll be in the garage. Don't look for me. Look anyway.", "Come and find me after. Whatever happens."],
  cold: ["Right. Good luck, I suppose.", "Okay. Bye, then.", "...Good luck."],
  ex: ["Good luck. Really.", "Take care of yourself.", "Bye."],
  quiet: ["Take care of yourself today.", "I'll be thinking of you all.", "Look after each other out there."],
};
