// The third batch of grid talk for ui/GridWalk.js (same shape as GridTalk.js). Every line is a pool.

export const TOPICS3 = {
  // ---- pressure, expectation ----------------------------------------------------------------------------------------------
  pressure: { who: ['driver', 'boss', 'press', 'eng'], w: 1, open: [
    "Big expectations on you today. Feel it?", "Everyone's watching {team} after the last race. No pressure.", "You've got the car to do something special today. Does that weigh on you?", "Your name's been in every paper this week. How do you shut it out?", "The board want points. I want you to enjoy it. Both, ideally." ],
    opts: [
      { tone: 'firm', t: ["Pressure is a privilege. I'd rather have it than not.", "I put more on myself than anyone else could.", "Expectations are just noise until the lights go out."], r: ["Strong answer.", "That's the mindset.", "Good."], then: { say: ["And if it goes wrong?", "What if you have a bad start?", "How do you reset mid-race?"], opts: [
        { tone: 'firm', t: ["Then I fix it on the next lap.", "Then I fight back. That's the job.", "Breathe, hit the next apex, carry on."], r: ["Good.", "Proper.", "Simple. Good."] },
        { tone: 'kind', t: ["Then we learn and come back stronger. Together.", "Then I own it and say sorry to the team.", "Then I talk to my engineer. That helps."], r: ["That's the right attitude.", "Mature.", "Good."], m: 1 },
        { tone: 'light', t: ["Then I blame the tyres. Classic.", "Then I hide in the motorhome.", "Then I tell everyone it was strategy."], r: ["Ha!", "Ha. Classic.", "Very good."] } ] } },
      { tone: 'kind', t: ["Honestly? I feel it. And I'm grateful for it.", "A bit. But the team takes most of it off my shoulders.", "It's nice that people believe in us."], r: ["That's an honest answer.", "Good team you've got.", "It is."], m: 2 },
      { tone: 'light', t: ["What pressure? I'm the calmest person here. Look at my hands. Don't.", "I read the papers. I'm apparently both a genius and finished.", "No pressure. Just two hours of everyone shouting."], r: ["Ha! Shaking.", "Ha. Both, probably.", "Ha."] },
      { tone: 'cold', t: ["I don't read any of it.", "Doesn't matter.", "Next question."], r: ["Fair enough.", "Right.", "Sure."] },
    ] },
  // ---- an old grudge with another driver --------------------------------------------------------------------------------------
  grudge: { who: ['driver', 'press', 'mech'], w: 0.9, open: [
    "Still annoyed with {X} about last time?", "{X} was talking about you in the drivers' briefing. Not nicely.", "Is it true you and {X} don't speak?", "Saw {X} looking over at your car earlier. Plotting something." ],
    opts: [
      { tone: 'kind', fx: 'about', t: ["No. It's racing. We shook hands after.", "I've got time for {X}. Hard but fair.", "We're fine. Honestly. People make it bigger than it is."], r: ["Good to hear.", "Mature of you.", "Glad you said it."], m: 2, then: { say: ["So no revenge plans for Turn 1?"], opts: [
        { tone: 'kind', t: ["None. Clean racing.", "Revenge is how people get hurt. No."], r: ["Good."] },
        { tone: 'light', t: ["Only revenge in the lap times.", "Revenge? I'll just overtake {X}. That's enough."], r: ["Ha. Fair."] } ] } },
      { tone: 'firm', t: ["I'll do my talking on the track.", "What {X} says isn't my problem."], r: ["Classic.", "Fair."], then: { say: ["Would you race {X} differently today?"], opts: [
        { tone: 'firm', t: ["Same as everyone. Hard and fair.", "No. Same rules for everyone."], r: ["Right answer."] },
        { tone: 'cruel', fx: 'about', t: ["I'll make sure {X} sees a lot of my gearbox.", "{X} can stay behind me where they belong."], r: ["Ooh. Spicy."], m: -2 } ] } },
      { tone: 'gossip', fx: 'about', t: ["{X} never apologised. Says a lot.", "{X} has been moaning about everyone this year. It's tiring.", "{X} talks to the stewards more than to the engineers."], r: ["Ha. Not wrong.", "Careful.", "Ha."] },
      { tone: 'cold', t: ["Not discussing {X}.", "Ask {X}."], r: ["Fair.", "Okay."] },
    ] },
  // ---- the car: a name, its quirks ----------------------------------------------------------------------------------------------
  carLife: { who: ['mech', 'driver', 'eng'], w: 1, open: [
    "The lads have started calling this chassis 'the beast'. Thoughts?", "Does this car have a personality yet? Ours always do.", "That rattle on the left sidepod is fixed. Swear on my toolbox.", "You patted the nose before you walked off. Superstition?" ],
    opts: [
      { tone: 'light', t: ["'The beast'? I was going with 'Gerald'.", "It has a personality. It sulks in slow corners.", "Swear on your toolbox? That's serious."], r: ["Gerald! It's Gerald now.", "Ha. Like its driver.", "My most sacred oath."], then: { say: ["Does a name actually make a difference?", "You think cars have feelings?"], opts: [
        { tone: 'light', t: ["If you're nice to it, it's nice to you.", "It definitely sulks. I've seen the data."], r: ["Ha. Science."] },
        { tone: 'kind', t: ["It makes us a team. That matters.", "Everything that brings us together matters."], r: ["Lovely."], m: 1 },
        { tone: 'firm', t: ["No. Downforce makes a difference.", "Only the lap time matters."], r: ["Very practical."] } ] } },
      { tone: 'kind', t: ["Always pat the nose. It's looked after me.", "I trust this car. That's down to you lot.", "It's a good car. Built by good people."], r: ["That's lovely.", "Thanks. Means a lot.", "Stop, you'll make the lads cry."], m: 2 },
      { tone: 'firm', t: ["It's a tool. A very fast tool.", "Personality is for road cars."], r: ["Cold. But fair.", "Ha. Right."] },
      { tone: 'cruel', t: ["It'll have a personality when it stops breaking.", "The beast? More like the bucket."], r: ["...The lads built that bucket.", "Ouch."], m: -3, then: { say: ["Want to tell the garage that?"], opts: [
        { tone: 'sorry', t: ["No. It's a great car. I'm just wound up."], r: ["Thought so."] },
        { tone: 'cold', t: ["Just make it reliable."], r: ["We're trying."] } ] } },
    ] },
  // ---- the engineer's data ------------------------------------------------------------------------------------------------------
  data: { who: ['eng'], w: 2, open: [
    "Sector two is where we're losing it - about a tenth in {corner}.", "Long-run pace looked strong on Friday. Better than the others, I think.", "Your throttle trace on the exit of {corner} is a bit lumpy. Smoother and you'll gain.", "Tyre deg on the long run was point-oh-six a lap. Manageable." ],
    opts: [
      { tone: 'firm', t: ["Copy. I'll brake a metre later and carry more speed.", "Smoother on the exit. Got it.", "Point-oh-six. Then we can push."], r: ["Exactly.", "That's it.", "Good."], then: { say: ["Want sector times on the radio?", "Want the deltas to the cars around you?"], opts: [
        { tone: 'firm', t: ["Only if I'm losing time.", "Every lap. I like the numbers."], r: ["Will do."] },
        { tone: 'kind', t: ["Whatever you think helps. I trust you.", "You decide. You see more than I do."], r: ["Good."], m: 2 },
        { tone: 'light', t: ["Only the good ones.", "Tell me when I'm the quickest. Lie if you have to."], r: ["Ha."] } ] } },
      { tone: 'kind', t: ["Thanks for staying up with the data. I know it was late.", "Good spot. You never miss anything."], r: ["Part of the job.", "Just doing my job."], m: 2 },
      { tone: 'light', t: ["Lumpy? My throttle foot is a precision instrument.", "A tenth? I'll find two. Easy. Probably."], r: ["The data disagrees.", "Ha. Go on then."] },
      { tone: 'cruel', t: ["Maybe if the car wasn't lumpy, the trace wouldn't be.", "Spare me the graphs."], r: ["...Noted.", "Fine."], m: -3 },
    ] },
  // ---- the boss: budget, the board, the rivals ------------------------------------------------------------------------------------
  politics: { who: ['boss'], w: 2, open: [
    "The cost cap means we brought one spare floor. Look after it.", "{XT} are protesting our wing again. Ignore it.", "The board are in the hospitality suite. They don't need to see you, but a wave helps.", "We're fighting {XT} for the constructors' place this year. Every point counts." ],
    opts: [
      { tone: 'firm', t: ["Understood. Floor stays on the car.", "Every point. Got it.", "Protest all they like. We're legal."], r: ["Good.", "That's the attitude.", "We are."], then: { say: ["And if {X} is in front of you late on?"], opts: [
        { tone: 'firm', t: ["Then I'm coming for them.", "Then I get them. Cleanly."], r: ["That's what I want to hear."] },
        { tone: 'kind', t: ["Then I'll be patient and take it when it's there.", "Then I'll race them fair."], r: ["Good."] },
        { tone: 'cruel', fx: 'about', t: ["Then they'd better move.", "They'll get out of the way. They always do."], r: ["Clean, please. No stewards."], m: -1 } ] } },
      { tone: 'kind', t: ["A wave? Of course. Happy to.", "Tell them thank you for the support. I mean it."], r: ["You're good at this.", "I'll pass it on."], m: 2 },
      { tone: 'light', t: ["One spare floor? I'll drive very gently. Ha.", "Should I wave with both hands, or is that too keen?"], r: ["You'd better.", "One hand. Dignified."] },
      { tone: 'cold', t: ["Politics is your job.", "I don't care what the board think."], r: ["...Noted.", "I'll pretend I didn't hear that."], m: -2 },
    ] },
  // ---- the mechanics' life ------------------------------------------------------------------------------------------------------
  mechLife: { who: ['mech'], w: 2, open: [
    "Three hours' sleep, cold pizza, best job in the world.", "My kid asked if I drive the car. I said I'm the one who makes it work.", "Twenty-four races and the gearbox crew still argue about the radio station.", "If we win today I'm getting the car number tattooed. Again." ],
    opts: [
      { tone: 'kind', t: ["You do make it work. None of this happens without you.", "Best crew I've ever had. I mean it.", "Thank you. For all the hours nobody sees."], r: ["Stop it. ...Thanks.", "We know. But it's nice to hear.", "Means a lot, that."], m: 3, then: { say: ["Will you come and see the lads after the race, whatever happens?"], opts: [
        { tone: 'kind', t: ["Always. Win or lose.", "Wouldn't miss it."], r: ["Good."] },
        { tone: 'light', t: ["Only if there's pizza left.", "Only if someone else is buying."], r: ["Ha. There won't be."] } ] } },
      { tone: 'light', t: ["Again? Where's left?", "Cold pizza is a breakfast of champions.", "What's the station? I'm on the losing side, aren't I."], r: ["My other arm.", "Ha. Exactly.", "You are."] },
      { tone: 'firm', t: ["Then let's give you a reason for that tattoo.", "Let's make the hours worth it."], r: ["That's what I like.", "Let's go."] },
      { tone: 'cruel', t: ["Maybe sleep more and drop fewer wheel nuts.", "You make it work? Most of the time."], r: ["...Okay then.", "Wow."], m: -4 },
    ] },
  // ---- after the race ------------------------------------------------------------------------------------------------------------
  after: { who: ['driver', 'celeb', 'mech', 'press'], w: 0.9, open: [
    "What are you doing after the race? There's a party at the hotel.", "Flying straight home tonight?", "If you win, what's the first thing you do?", "Any plans for the break after this one?" ],
    opts: [
      { tone: 'kind', t: ["Seeing the team, then calling home.", "Dinner with the mechanics. They've earned it.", "A quiet night. Family first."], r: ["Lovely.", "The lads will love that.", "Good."], m: 1 },
      { tone: 'light', t: ["Sleeping for eleven hours.", "Eating a burger the size of my helmet.", "Win? I'll cry. Then deny it."], r: ["Ha. Fair.", "Ha. Earned.", "Ha! Love it."], then: { say: ["Seriously, any big plans for the break?"], opts: [
        { tone: 'light', t: ["A beach, a book, and no phone.", "Learning to cook. Badly."], r: ["Sounds perfect."] },
        { tone: 'firm', t: ["Training. Next race starts now.", "Simulator. Then more simulator."], r: ["Relentless."] } ] } },
      { tone: 'firm', t: ["Debrief. Then debrief again.", "Back to the factory on Monday. No break."], r: ["Dedicated.", "Wow."] },
      { tone: 'cold', t: ["Haven't thought about it.", "Let's get through the race first."], r: ["Fair.", "Of course."] },
    ] },
  // ---- autographs, fans at the fence ---------------------------------------------------------------------------------------------
  autograph: { who: ['celeb', 'press', 'mech'], w: 0.9, open: [
    "There's a kid at the fence with your cap. Any chance of a quick wave?", "Can you sign this for my nephew? Sorry, I know you're busy.", "The fans in the grandstand have a banner with your name on. Seen it?" ],
    opts: [
      { tone: 'kind', t: ["Of course. Give it here.", "Absolutely. What's their name?", "I'll wave on the formation lap. Promise."], r: ["You're a star.", "Oh, thank you!", "They'll lose their minds."], m: 3, then: { say: ["Do you remember the first autograph you gave?", "Does it ever get old?"], opts: [
        { tone: 'kind', t: ["Never gets old. I was that kid once.", "In karting. Spelt my own name wrong."], r: ["Ha! Lovely."] },
        { tone: 'light', t: ["My first one was on a napkin. For my mum.", "It's my hand that gets old."], r: ["Ha!"] } ] } },
      { tone: 'firm', t: ["After the race. I'll come back, I promise.", "Two minutes, then I'm in the car."], r: ["Deal.", "Thank you!"] },
      { tone: 'cold', t: ["Not now.", "I'm working."], r: ["Oh. Of course.", "Sorry."], m: -1 },
      { tone: 'cruel', t: ["Do I look like I have time for this?", "Tell your nephew to buy a ticket."], r: ["...Right. Sorry.", "Wow."], m: -4 },
    ] },
  // ---- turn one: who'll get it wrong (racing only) ------------------------------------------------------------------------------
  turnOne: { who: ['driver', 'mech', 'eng', 'press'], w: 0.9, open: [
    "Who's going to be too brave into Turn 1 today?", "Odds on a clean first lap? I say one in three.", "Where does it go wrong on lap one here, usually?" ],
    opts: [
      { tone: 'kind', t: ["Nobody, I hope. Everyone home safe.", "I'm hoping for a clean one. For everyone.", "Everyone's sensible today. I can feel it."], r: ["Same. Fingers crossed.", "Yeah.", "Let's hope."], m: 1 },
      { tone: 'firm', t: ["{corner}. The braking is late and the track narrows.", "The run to Turn 1. Three wide and somebody blinks."], r: ["Agreed.", "Yeah."], then: { say: ["What's your plan through there?"], opts: [
        { tone: 'firm', t: ["Inside line, brake late, hold it.", "Outside and patient. Cut back on the exit."], r: ["Good."] },
        { tone: 'light', t: ["Close my eyes and hope.", "Follow the car in front and pray."], r: ["Ha."] } ] } },
      { tone: 'gossip', fx: 'about', t: ["{X}. Always {X}.", "My money's on {X} locking up."], r: ["Ha! Probably.", "Harsh. Possibly true."] },
      { tone: 'light', t: ["Me, probably.", "Whoever's next to me."], r: ["Ha!", "Great."] },
    ] },
  // ---- the tyres in their blankets --------------------------------------------------------------------------------------------------
  blankets: { who: ['mech', 'eng'], w: 1.2, open: [
    "Blankets are at seventy degrees. They'll come off at the five-minute board.", "The fronts lose heat fast here. Work them on the formation lap.", "Pressures are spot on. Don't let them cool behind the safety car, if there is one." ],
    opts: [
      { tone: 'firm', t: ["Copy. Weave hard on the formation lap.", "Got it. Keep the heat in.", "Five-minute board. Noted."], r: ["Good.", "That's it.", "Right."], then: { say: ["Want the pressures on the radio after the first lap?"], opts: [
        { tone: 'firm', t: ["Yes please.", "Only if they're out of the window."], r: ["Will do."] },
        { tone: 'light', t: ["Only if they're good news.", "Tell me they're perfect even if they aren't."], r: ["Ha. No."] } ] } },
      { tone: 'kind', t: ["Thanks. You lot think of everything.", "Appreciate it. Small things win races."], r: ["We try.", "They do."], m: 2 },
      { tone: 'light', t: ["Can I borrow a blanket? It's freezing.", "Seventy degrees? I'll sit in one."], r: ["Get in the car.", "Ha."] },
      { tone: 'cold', t: ["I know how tyres work.", "Fine."], r: ["Sure.", "Okay."] },
    ] },
};
