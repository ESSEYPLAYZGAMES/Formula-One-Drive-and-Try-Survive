// Still more to talk about on the grid: the second batch of topics for ui/GridWalk.js, in the same shape as
// GridTalk.js (who, w, open, opts with t / r / then). Every line is a pool.

export const TOPICS2 = {
  // ---- home, family, life away from it ----------------------------------------------------------------------------------
  home: { who: ['driver', 'celeb', 'mech', 'eng'], w: 1.1, open: [
    "Do you ever get home these days?", "My kid made me a drawing of the car this morning. Wheels the wrong way round.", "How many weeks since you slept in your own bed?", "Calling home before the start, or after?", "Does your family watch, or can't they?" ],
    opts: [
      { tone: 'kind', t: ["Not enough. I miss them every weekend.", "Two days in the last month. They're very patient.", "They watch every lap. Mum hides behind the sofa for the start."], r: ["Yeah. It's the hardest part.", "That's lovely, honestly.", "Same in our house."], m: 2, then: { say: ["Do they ever come to races?", "What do you do on your one day off?", "Is it worth it? All the time away?"], opts: [
        { tone: 'kind', t: ["Once a year. It's the best weekend of the season.", "Sleep, then see them, then sleep again.", "On the good days, yes. On the bad ones I wonder."], r: ["Honest answer.", "Ha. Sounds right.", "Yeah. I get that."] },
        { tone: 'light', t: ["They come for the free food.", "Lie on the sofa and refuse to drive anywhere.", "Ask me after the race. Depends on the result."], r: ["Ha!", "Fair.", "Ha. Of course."] },
        { tone: 'firm', t: ["It's worth it. It's what I've worked for my whole life.", "We all signed up for this. No complaints."], r: ["Respect.", "Fair enough."] },
        { tone: 'cold', t: ["Not talking about my family on the grid.", "Let's keep that private."], r: ["Of course. Sorry.", "Fair."] } ] } },
      { tone: 'light', t: ["Home? Is that the place with the fridge?", "My dog doesn't recognise me any more.", "Wheels the wrong way? Might be faster. Send the drawing to the factory."], r: ["Ha! Same.", "That's tragic. And funny.", "Ha. I'll tell the engineers."], then: { say: ["Seriously though, how do you cope with it?", "What's the first thing you do when you get back?"], opts: [
        { tone: 'kind', t: ["Video calls. Lots of them.", "Hug everyone. Then sleep for a day."], r: ["Nice.", "Sounds perfect."] },
        { tone: 'firm', t: ["You get used to it. You have to.", "Routine. Same thing every trip."], r: ["Makes sense."] },
        { tone: 'light', t: ["Eat everything in the house.", "Complain about the jet lag for a week."], r: ["Ha."] } ] } },
      { tone: 'firm', t: ["After. During the build-up I'm in my own head.", "Before. Same message every time."], r: ["Makes sense.", "Nice ritual."], then: { say: ["What do you say to them?"], opts: [
        { tone: 'kind', t: ["That I love them. And I'll see them soon.", "Nothing clever. Just 'see you after'."], r: ["That's lovely."], m: 1 },
        { tone: 'cold', t: ["That's between me and them.", "Private."], r: ["Of course."] } ] } },
      { tone: 'cold', t: ["Let's not do personal stuff now.", "I keep home and this separate."], r: ["Fair enough.", "Sorry, didn't mean to pry."] },
    ] },
  // ---- how it started: karting, the first F1 race ---------------------------------------------------------------------
  origins: { who: ['driver', 'press', 'celeb', 'mech'], w: 1, open: [
    "Remember your first race in F1? I was sick in my helmet.", "Did you think you'd make it, back in karting?", "Who got you into racing?", "What would the eight-year-old you say if they saw this?", "You still race karts in the winter?" ],
    opts: [
      { tone: 'kind', t: ["My dad, a borrowed kart and an empty car park.", "My grandma. She watched every race on a tiny TV.", "A neighbour who raced on weekends. I owe them everything."], r: ["That's a great story.", "Lovely.", "Everyone needs someone like that."], m: 2, then: { say: ["Are they here today?", "Do they still follow it?"], opts: [
        { tone: 'kind', t: ["Every race, from home. Every single one.", "In the grandstand somewhere. Probably shouting."], r: ["Wave to them on the parade lap."] },
        { tone: 'firm', t: ["They're the reason I'm still pushing.", "They taught me never to lift."], r: ["Respect."] },
        { tone: 'light', t: ["They're still telling me I brake too early.", "They text me my mistakes before the engineer does."], r: ["Ha! Brilliant."] } ] } },
      { tone: 'firm', t: ["I knew. From the first lap I ever did.", "Didn't think, just worked. Every day."], r: ["Confident.", "That's the way."], then: { say: ["Ever close to giving up?"], opts: [
        { tone: 'kind', t: ["Once. No money, no seat. Someone took a chance on me.", "Plenty of times. You keep going anyway."], r: ["Glad you didn't."] },
        { tone: 'firm', t: ["Never.", "Not once."], r: ["Of course not."] } ] } },
      { tone: 'light', t: ["Eight-year-old me would ask where the sweets are.", "Sick in the helmet? Amateur. I was sick before I got in.", "Karting in winter? My hands are still frozen from the last time."], r: ["Ha!", "Ha. Glad it's not just me.", "Brutal."] },
      { tone: 'cold', t: ["Ancient history.", "I don't look back much."], r: ["Fair.", "Okay."] },
      { tone: 'cruel', t: ["At least I got here on talent.", "Some of us didn't need a rich dad to get here."], r: ["...That's a dig, isn't it.", "Nice. Very nice."], m: -3, then: { say: ["Who's that aimed at?"], opts: [
        { tone: 'sorry', t: ["No one. That was out of line. Sorry."], r: ["Okay."] },
        { tone: 'cruel', t: ["Whoever it fits."], r: ["Unbelievable."] } ] } },
    ] },
  // ---- this place: the Strip at night, the old airfield ---------------------------------------------------------------
  venue: { who: ['driver', 'celeb', 'press', 'mech', 'boss'], w: 1.1, open: [
    "{venueOpen}", "Have you had a look around the town at all?", "What do you think of the crowd here compared to last year?", "Best place on the calendar, or worst?" ],
    opts: [
      { tone: 'kind', t: ["{venueLove}", "One of the best weekends of the year. Every year."], r: ["Couldn't agree more.", "Yeah, it's special."], m: 1, then: { say: ["What makes it special for you?"], opts: [
        { tone: 'kind', t: ["The people. Always the people.", "The history. You feel it in the walls."], r: ["Lovely answer."] },
        { tone: 'light', t: ["The food truck by the paddock gate.", "The hotel has a really good shower."], r: ["Ha. Priorities."] },
        { tone: 'firm', t: ["The lap. Nothing else like it.", "That last sector. Flat out, nowhere to hide."], r: ["Proper driver answer."] } ] } },
      { tone: 'light', t: ["{venueJoke}", "Seen the inside of the hotel and the paddock. Lovely."], r: ["Ha!", "Same."] },
      { tone: 'firm', t: ["It's a racetrack. I'm here to race.", "Haven't looked up from the data all weekend."], r: ["Very focused.", "Fair."] },
      { tone: 'cold', t: ["Every track's the same from the cockpit.", "Not much of a sightseer."], r: ["Shame.", "Right."] },
    ] },
  // ---- the start: launches, lights, turn one --------------------------------------------------------------------------
  start: { who: ['driver', 'eng', 'celeb'], w: 1.2, open: [
    "How are you feeling about the start? Clutch has been grabby for us.", "Five red lights. What goes through your head?", "Heard the grip off the line is terrible on the dirty side.", "Who gets the best starts on this grid, would you say?" ],
    opts: [
      { tone: 'firm', t: ["Nothing. Empty head. Just the lights.", "Watch the fourth light, then go on feel.", "Clean side's mine today. Lucky me."], r: ["Proper.", "Interesting.", "Lucky you indeed."], then: { say: ["What if you bog down?", "And the run to Turn 1?"], opts: [
        { tone: 'firm', t: ["Then I stay calm and pick them off.", "Then I go late on the brakes and hold my line."], r: ["Good plan."] },
        { tone: 'light', t: ["Then I pretend it was strategy.", "Then I close my eyes and hope."], r: ["Ha. Classic."] },
        { tone: 'kind', t: ["Then I make sure nobody gets hurt in the shuffle.", "Then patience. It's a long race."], r: ["Sensible."] } ] } },
      { tone: 'kind', t: ["Nervous. Always. It means I care.", "Heart rate through the roof. Every time."], r: ["Same. Glad you said it.", "Yeah. Me too."], m: 1, then: { say: ["Does it ever go away?"], opts: [
        { tone: 'kind', t: ["The second the car moves. Then it's just work.", "I hope not. It keeps me sharp."], r: ["Good way to see it."] },
        { tone: 'light', t: ["It goes away in about two hours.", "When I retire, maybe."], r: ["Ha."] } ] } },
      { tone: 'light', t: ["{X}. They've had practice starting from the back.", "Me. Obviously. Watch."], r: ["Ha! Harsh.", "We'll see."] },
      { tone: 'gossip', fx: 'about', t: ["{X} jumps the start every time and gets away with it.", "{X} weaves so much off the line it should be illegal."], r: ["Ha. Not wrong.", "Careful saying that."] },
    ] },
  // ---- racecraft: how hard is too hard -------------------------------------------------------------------------------
  racecraft: { who: ['driver', 'press', 'boss'], w: 1, open: [
    "Where's the line for you? Hard but fair - what does that mean?", "The stewards have been tough this year. Too tough?", "Would you rather win a clean race or a dirty one?", "Last time someone ran you wide, you didn't complain. Why?" ],
    opts: [
      { tone: 'kind', t: ["Leave a car's width. Always. That's the line.", "If you'd be angry if it was done to you, don't do it."], r: ["Good rule.", "Wish everyone thought like that."], m: 2, then: { say: ["Even with a title on the line?"], opts: [
        { tone: 'kind', t: ["Especially then.", "A title won dirty isn't worth having."], r: ["Respect."] },
        { tone: 'firm', t: ["Hard, yes. Dangerous, never.", "Hard but fair. No exceptions."], r: ["Fair."] } ] } },
      { tone: 'firm', t: ["Racing is racing. Let us race.", "The stewards should leave more to us."], r: ["Plenty agree.", "Bold."], fx: 'press' },
      { tone: 'light', t: ["A clean one. Dirty ones need too much paperwork.", "I never complain. I just get them back later."], r: ["Ha!", "Noted. I'll watch my mirrors."] },
      { tone: 'cruel', t: ["The line is wherever I put my car.", "If they can't take it, they shouldn't be here."], r: ["That's how people get hurt.", "Wow."], m: -4, then: { say: ["You really mean that?"], opts: [
        { tone: 'sorry', t: ["No. Bad joke. Nobody should get hurt.", "No. I take that back."], r: ["Good."] },
        { tone: 'cruel', t: ["I mean it."], r: ["Then I'll give you room. And remember it."] } ] } },
    ] },
  // ---- food, sleep, jet lag ---------------------------------------------------------------------------------------------
  body: { who: ['driver', 'mech', 'eng', 'celeb', 'boss'], w: 0.9, open: [
    "Did you eat? You look like you didn't eat.", "Jet lag's killing me. You?", "How much sleep did you get last night?", "What's the pre-race meal? I've always wanted to know." ],
    opts: [
      { tone: 'light', t: ["Pasta. Always pasta. Since I was ten.", "Four hours. Three of them were the alarm.", "Jet lag? I've stopped knowing what day it is."], r: ["Ha. Classic.", "Rough.", "Same."], then: { say: ["How do you stay sharp like that?", "Coffee or no coffee?"], opts: [
        { tone: 'firm', t: ["Routine. And a nap at two.", "Adrenaline does the rest."], r: ["Fair."] },
        { tone: 'light', t: ["Coffee. An irresponsible amount.", "Never coffee. Fear is enough."], r: ["Ha."] } ] } },
      { tone: 'kind', t: ["Ate with the team. Best part of the weekend.", "Slept well, actually. Feeling good."], r: ["Good to hear.", "Nice."] },
      { tone: 'firm', t: ["Everything's planned to the gram.", "Same routine every race. No surprises."], r: ["Very disciplined.", "Respect."] },
      { tone: 'cold', t: ["I'm fine.", "Don't worry about me."], r: ["Okay.", "Just checking."] },
    ] },
  // ---- team banter: pranks, culture ---------------------------------------------------------------------------------------
  banter: { who: ['mech', 'eng', 'boss'], w: 1.3, open: [
    "Somebody filled your race boots with jelly beans. Not me.", "The lads have a bet on your finishing position. I'm not saying who has what.", "You owe the gearbox crew a round. Remember the bet?", "Did you see the team photo? You blinked. Again." ],
    opts: [
      { tone: 'light', t: ["Not you. Sure. I'll remember that.", "What's the bet? I want in.", "Put it on my tab. My very long tab."], r: ["Ha! Innocent until proven guilty.", "Can't tell you. Bad luck.", "We know about the tab."], then: { say: ["Seriously, the lads would love a win.", "Any message for the garage?"], opts: [
        { tone: 'kind', t: ["Tell them I'll give everything. For them.", "Tell them they're the best crew in the pit lane."], r: ["They'll hear it on the radio, too."], m: 2 },
        { tone: 'firm', t: ["Tell them to have the champagne ready.", "Just a clean stop. I'll do the rest."], r: ["Will do."] },
        { tone: 'light', t: ["Tell them the jelly beans were delicious.", "Tell them I'm watching the bets."], r: ["Ha!"] } ] } },
      { tone: 'kind', t: ["Love this team. Honestly. You lot make it.", "Best atmosphere I've ever been part of."], r: ["Get off. ...Thanks.", "We feel the same."], m: 2 },
      { tone: 'cold', t: ["Can we focus, please.", "Not now."], r: ["Sorry. Focusing.", "Right."], m: -1 },
      { tone: 'cruel', t: ["If you spent this much time on the car we'd be winning.", "Pranks? Try fixing the pit stops."], r: ["...Wow. Okay.", "That stung."], m: -4, then: { say: ["Want to say that to the whole garage?"], opts: [
        { tone: 'sorry', t: ["No. That was out of order. Sorry. You lot work miracles."], r: ["Apology accepted. This time."] },
        { tone: 'cold', t: ["Just get the car right."], r: ["Yep."] } ] } },
    ] },
  // ---- sponsors, hospitality --------------------------------------------------------------------------------------------
  sponsors: { who: ['boss', 'driver', 'celeb'], w: 0.8, open: [
    "The sponsor's guests want a photo before you get in. Two minutes.", "You were brilliant at the sponsor dinner. They loved you.", "How many hospitality events did they make you do?", "Our title sponsor's chairman is in the garage. Be nice." ],
    opts: [
      { tone: 'kind', t: ["Of course. Two minutes, happy to.", "They keep the lights on. Least I can do."], r: ["You're a star.", "Exactly the attitude."], m: 2 },
      { tone: 'light', t: ["I'm always nice. Mostly.", "Four. I've said 'the car feels good' four hundred times."], r: ["Ha. Mostly is the worry.", "Ha!"] },
      { tone: 'firm', t: ["After the race. I'm in the zone now.", "One minute. Then I'm gone."], r: ["Fair, I'll tell them.", "One minute it is."] },
      { tone: 'cold', t: ["Not now.", "That's not my job today."], r: ["...I'll handle it.", "Fine."], m: -2 },
    ] },
  // ---- the setup: wing, balance, the details -------------------------------------------------------------------------------
  setup: { who: ['eng', 'driver', 'mech'], w: 1.1, open: [
    "We took a click of front wing out overnight. Feel it on the laps to the grid?", "Tyre pressures are on the high side - the cold will bring them down.", "You're running less wing than us. Brave on this layout.", "Brake balance: start at fifty-seven and move it as the fuel burns." ],
    opts: [
      { tone: 'firm', t: ["Felt it. Better in the slow stuff, a bit lazy in {corner}.", "Fifty-seven, move it rearward as we go. Copy."], r: ["Exactly what we expected.", "That's it."], then: { say: ["Want anything changed at the stop?", "Happy with it as it is?"], opts: [
        { tone: 'firm', t: ["A click of front wing back at the stop.", "Leave it. I'll drive around it."], r: ["Noted."] },
        { tone: 'kind', t: ["Happy. Good work on it.", "You nailed it. Thank you."], r: ["Good."], m: 2 },
        { tone: 'light', t: ["Can you add a cup holder?", "More speed, less understeer, thanks."], r: ["Next upgrade."] } ] } },
      { tone: 'kind', t: ["It feels great. You lot nailed it.", "Best the car's felt all weekend."], r: ["Good. We'll take that.", "Music to my ears."], m: 2 },
      { tone: 'light', t: ["Brave, or I forgot to ask for more.", "Less wing, more prayer."], r: ["Ha.", "Bold strategy."] },
      { tone: 'cruel', t: ["You lot changed it again without asking?", "Next time ask me before you touch my car."], r: ["We did ask. You said yes.", "Noted."], m: -3, then: { say: ["Do you want it back how it was?"], opts: [
        { tone: 'sorry', t: ["No. Sorry. It's fine. I'm wound up."], r: ["Understood."] },
        { tone: 'cold', t: ["Leave it."], r: ["Okay."] } ] } },
    ] },
  // ---- advice: rookies, the young ones ----------------------------------------------------------------------------------
  advice: { who: ['driver', 'celeb', 'press'], w: 0.9, open: [
    "Any advice for a rookie? Honestly asking.", "What do you wish someone had told you in your first season?", "The young drivers coming through - scary quick, aren't they?" ],
    opts: [
      { tone: 'kind', t: ["Don't try to win it at Turn 1. Finish the lap first.", "Enjoy it. It goes by so fast.", "Ask questions. Everyone here wants to help, mostly."], r: ["Thanks. Really.", "I'll remember that.", "That's good advice."], m: 2, then: { say: ["What about the media side?", "How do you deal with a bad weekend?"], opts: [
        { tone: 'kind', t: ["Be yourself. People can tell when you aren't.", "Talk to your engineer, then switch off. Monday is a new week."], r: ["Thanks."] },
        { tone: 'light', t: ["Say 'we'll see' a lot. It works.", "Eat a lot of ice cream."], r: ["Ha."] } ] } },
      { tone: 'firm', t: ["Work harder than everyone. That's it.", "Nobody gives you anything. Take it."], r: ["Old school.", "Got it."] },
      { tone: 'light', t: ["Never trust a mechanic's jelly beans.", "Find the good coffee machine on day one."], r: ["Ha! Noted.", "Valuable."] },
      { tone: 'cruel', t: ["Advice? Find another sport.", "Stay out of my way. That's my advice."], r: ["...Thanks. Really.", "Wow."], m: -4 },
    ] },
  // ---- the season so far ---------------------------------------------------------------------------------------------------
  season: { who: ['boss', 'press', 'driver', 'eng'], w: 1, open: [
    "Where do you think we are, honestly? In the pecking order.", "How would you rate your season so far?", "Is this the year {team} take a real step?", "What's the target for the rest of the year?" ],
    opts: [
      { tone: 'firm', t: ["Better than people think. Watch the next few races.", "We're in the fight. That's all I want."], r: ["Good.", "That's the spirit."], fx: 'press', then: { say: ["What's been the biggest change?"], opts: [
        { tone: 'kind', fx: 'press', t: ["The people. Everyone pulling the same way.", "Trust. Between me and the engineers."], r: ["Lovely."] },
        { tone: 'firm', fx: 'press', t: ["Consistency. Points every weekend.", "The car. Finally doing what we ask."], r: ["Makes sense."] } ] } },
      { tone: 'kind', t: ["Seven out of ten. Room to grow, proud of the team.", "Up and down, but we're learning every week."], r: ["Honest.", "Fair."], fx: 'press' },
      { tone: 'light', t: ["Ten out of ten. Modest, too.", "Ask me in December."], r: ["Ha!", "I will."], fx: 'press' },
      { tone: 'cruel', fx: 'pressAbout', t: ["Better than {X}'s. That's a low bar, but still.", "At least we're not {XT}."], r: ["That'll go down well.", "Ouch."], m: -1 },
    ] },
  // ---- charity, causes, giving back ------------------------------------------------------------------------------------------
  causes: { who: ['celeb', 'press', 'driver'], w: 0.7, open: [
    "I saw your helmet auction raised a fortune. That was lovely.", "Is it true you fund a karting programme back home?", "The sport's talking about sustainability a lot. Real, or just talk?" ],
    opts: [
      { tone: 'kind', fx: 'press', t: ["Anyone who gets the chance to give back should.", "Kids who can't afford it deserve a go. I got lucky."], r: ["That's wonderful.", "Lovely."], m: 2, then: { say: ["Any of them any good?"], opts: [
        { tone: 'kind', fx: 'press', t: ["One of them is quicker than I was at that age.", "They're all good. That's the point."], r: ["Ha. Watch out, then."] },
        { tone: 'light', fx: 'press', t: ["One of them beat me last winter. I'm still upset.", "Too good. I'm worried for my job."], r: ["Ha!"] } ] } },
      { tone: 'firm', fx: 'press', t: ["Real, if we keep pushing. I'll keep pushing.", "It has to be real. No other option."], r: ["Good answer.", "Agreed."] },
      { tone: 'cold', t: ["I'd rather not make a show of it.", "That's private."], r: ["Understood. Respect.", "Of course."] },
    ] },
  // ---- music, hobbies -------------------------------------------------------------------------------------------------------
  hobbies: { who: ['celeb', 'driver', 'mech'], w: 0.9, open: [
    "What do you do when you're not racing?", "Saw you on the golf course in practice week. How bad was it?", "What are you listening to before the start?", "You still play guitar? You were terrible last year." ],
    opts: [
      { tone: 'light', t: ["Golf. Badly. Very badly.", "I'm learning the piano. My neighbours hate me.", "Video games and naps. Elite athlete."], r: ["Ha!", "Brilliant.", "Living the dream."], then: { say: ["Ever thought about doing that instead?"], opts: [
        { tone: 'light', t: ["After I retire. I'll be terrible at it full-time.", "Only if they invent a golf car."], r: ["Ha."] },
        { tone: 'firm', t: ["Never. Racing's all I want.", "No. This is it."], r: ["Proper racer."] } ] } },
      { tone: 'kind', t: ["Time with friends. People who don't care about racing.", "Walking the dog. Clears the head."], r: ["That sounds healthy.", "Lovely."], m: 1 },
      { tone: 'firm', t: ["Training. There isn't time for much else.", "Nothing. This is the job, all year."], r: ["Dedicated.", "Wow."] },
      { tone: 'cold', t: ["Not much.", "Why do you want to know?"], r: ["Just curious.", "Sorry."] },
    ] },
  // ---- the risk: fear, the halo (said with care) ------------------------------------------------------------------------------
  risk: { who: ['celeb', 'press', 'driver'], w: 0.7, open: [
    "Do you ever think about the danger? Sorry if that's a strange thing to ask.", "Has the halo changed how you feel in the car?", "What would you say to a parent worried about their kid starting karting?" ],
    opts: [
      { tone: 'kind', t: ["I think about it, and I respect it. Then I trust the people who make it safer.", "The halo has saved lives. I'm grateful for it every time I get in."], r: ["That's a thoughtful answer.", "Thank you for saying that."], m: 2, then: { say: ["Is it safer now than when you started?"], opts: [
        { tone: 'kind', t: ["Much. But never safe. We keep working.", "Yes. And it should keep getting safer."], r: ["I hope so."] },
        { tone: 'firm', t: ["Safer. Not safe. Never safe.", "We push the FIA every year. Rightly."], r: ["Good."] } ] } },
      { tone: 'firm', t: ["You can't drive scared. Careful, yes.", "Tell them to find a good club, good kit and good people."], r: ["Wise.", "Good advice."] },
      { tone: 'cold', t: ["I'd rather not think about it before a race.", "Not today, please."], r: ["Of course. Sorry.", "Understood."] },
    ] },
  // ---- the radio --------------------------------------------------------------------------------------------------------------
  radio: { who: ['eng', 'mech', 'boss'], w: 1.1, open: [
    "Keep it clean on the radio today - the broadcast picks everything up.", "If I say 'multi function, strat five', you know what to do.", "Last time you went silent for ten laps. Talk to me if something's wrong.", "Your radio check was crackly. We've swapped the loom." ],
    opts: [
      { tone: 'firm', t: ["Copy. Strat five, multi function.", "I'll tell you the moment something's off."], r: ["Good.", "That's all I ask."], then: { say: ["And if I tell you to let your team-mate by?"], opts: [
        { tone: 'firm', t: ["Then you'll have a good reason. I'll ask after.", "Tell me why and I'll do it."], r: ["Fair."] },
        { tone: 'kind', t: ["Then I do it. Team first.", "Then we both get points. That's the job."], r: ["Good answer."], m: 2 },
        { tone: 'cruel', t: ["Then I pretend the radio's broken.", "Try it and see."], r: ["...We'll talk about that."], m: -3 } ] } },
      { tone: 'light', t: ["Clean? I'll try. No promises at Turn 1.", "Silent was me concentrating. Or sulking. Hard to tell."], r: ["Ha. Try harder.", "Ha!"] },
      { tone: 'kind', t: ["Thanks for fixing it. Small things matter.", "I like hearing you. Keeps me calm."], r: ["Anytime.", "Good."], m: 2 },
      { tone: 'cold', t: ["I know how the radio works.", "Just don't talk in the braking zones."], r: ["Copy.", "Noted."] },
    ] },
};

/** the venue's lines (the tokens {venueOpen}, {venueLove}, {venueJoke}) */
export function venueLines(id) {
  if (id === 'austin') return { venueOpen: ["Austin. Up the hill to Turn 1 - you can't see the apex until you're on it.", "Texas does everything big. The flag, the tower, the run-offs."], venueLove: ["The Esses, flat-ish, left right left right. Gets your heart going every lap.", "The crowd here's half cowboy hats, half team shirts. Love it."], venueJoke: ["Had brisket for breakfast. The nutritionist's not speaking to me.", "That tower's taller than my whole career plan."] };
  if (id === 'montreal') return { venueOpen: ["Montreal. The crowd here is something else.", "The island, the walls, the hairpin. Proper old-school."], venueLove: ["The fans here are mad for it. Every grandstand's full on Friday.", "Getting the last chicane right, inches off the wall. Best feeling there is."], venueJoke: ["Had poutine three nights running. The engineers are worried about the weight.", "Somebody's always going to kiss the Wall of Champions. Just not me, please."] };
  return id === 'silverstone'
    ? { venueOpen: ["Silverstone. Doesn't matter how many times, it gets you.", "The old airfield. Still the fastest corners we do all year."], venueLove: ["Maggotts and Becketts. Nothing like it anywhere.", "The crowd here knows racing. You feel it."], venueJoke: ["I've seen a field. And another field. Lovely fields.", "Took two hours to get out of the car park last night."] }
    : { venueOpen: ["Racing down the Strip at night. Still feels unreal.", "Did you see the Sphere at the start of practice? Mad."], venueLove: ["The lights, the Strip, the Sphere. There's nowhere like it.", "Racing past the casinos at three hundred an hour never gets old."], venueJoke: ["I went to a casino. Lost my phone. Not even gambling.", "Seen a lot of neon. My eyes need a holiday."] };
}
