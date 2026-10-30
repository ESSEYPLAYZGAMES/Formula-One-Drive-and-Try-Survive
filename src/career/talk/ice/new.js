// The Ice - in person, stage 'new': first impressions. Coldness earns grudging respect here; eagerness reads as cheap.
export const DATA = [
  // ---- new / cold: you were cool last time; they are clipped and make you earn it --------------------------------
  {
    id: 'ice-new-cold-1', stage: 'new', mood: 'cold',
    say: "You again. Last time you barely looked at me. I've decided to find that interesting rather than rude.",
    opts: [
      { tone: 'cold', t: "I looked. I just didn't stare.", r: "A distinction. Good. Everyone stares. It gets tedious by the second minute.", m: 2, opts: [
        { tone: 'cold', t: "Then I'll keep not staring.", r: "Do. I'll notice regardless. Off you go.", m: 1 },
        { tone: 'passive', t: "What do people usually stare at?", r: "The cheekbones, then the shoes. Then they mention the weather. Spare me all three, and good evening." },
        { tone: 'flirty', t: "Maybe I was saving the staring for later.", r: "Presumptuous. There may be no later. ...There may. Don't build anything on it." },
      ] },
      { tone: 'passive', t: "Fair. I was distracted. How's your evening going?", r: "Distracted by what? Choose carefully. It's the only answer I'll remember.", opts: [
        { tone: 'cold', t: "Things that weren't you.", r: "Honest. I can use honest. Go back to your things, then.", m: 1 },
        { tone: 'passive', t: "The race. My head doesn't switch off straight away.", r: "Obsession. The one excuse I accept. You may try again another night." },
        { tone: 'flirty', t: "Working out how to talk to you, honestly.", r: "Rehearsed spontaneity. I've seen it done better, by actors. Paid ones.", m: -1 },
      ] },
      { tone: 'flirty', t: "I was playing it cool. You're hard to look away from.", r: "And there it goes. The cool lasted one whole conversation. Was that a record?", m: -1, opts: [
        { tone: 'cold', t: "Forget it. Wasn't worth the effort.", r: "There's the voice from last time. Keep that one. Leave now, while it's working.", m: 1 },
        { tone: 'passive', t: "Fine. Let's just talk like normal people.", r: "Normal suits you. Practise it, and come back when you're fluent." },
        { tone: 'flirty', t: "Still hard to look away. That isn't changing.", r: "Persistence. A virtue in drivers, a warning in everyone else. I'll decide which you are." },
      ] },
    ],
  },
  {
    id: 'ice-new-cold-2', stage: 'new', mood: 'cold',
    say: ["Two minutes. You were curt with me last time, so I'm being efficient.", "Ah. The curt one. I've allotted you two minutes."],
    opts: [
      { tone: 'cold', t: "Two minutes is generous. I'll need one.", r: "Confident, or rude. Annoyingly, I can't tell which, and I can always tell.", m: 2, opts: [
        { tone: 'cold', t: "Then I'll leave you guessing.", r: "Fine. Go. I won't watch you walk away. I'll glance, once.", m: 1 },
        { tone: 'passive', t: "Rude wasn't the plan. I'm running on empty.", r: "Tired I understand. Sleep. We'll see what's left of you at {track}." },
        { tone: 'flirty', t: "Use the second minute to look at me, then.", r: "I used the first one for that. The verdict is pending. Stop fidgeting." },
      ] },
      { tone: 'passive', t: "Sorry about last time. It was a long day.", r: "Apology received. Not yet accepted. Those are different departments.", opts: [
        { tone: 'cold', t: "Take it or leave it.", r: "I'll leave it on the desk. Someone might file it eventually.", m: 1 },
        { tone: 'passive', t: "Then let me start again. Hi. I'm {me}.", r: "I know who you are. But that was correct. Start like that next time, too." },
        { tone: 'flirty', t: "What would it take to get it accepted?", r: "More than a smile. Less than you'd think. That's the only hint you get." },
      ] },
      { tone: 'flirty', t: "Two minutes with you? I'd take two seconds.", r: "So eager it went past sweet and came out the other side as cheap.", m: -1, opts: [
        { tone: 'cold', t: "Fine. Keep your two minutes.", r: "I will. Ninety seconds left over. I'll spend them on someone who waits.", m: 1 },
        { tone: 'passive', t: "Alright, too much. How are you, actually?", r: "Well. Observant, mostly. You may go while that's the last thing said." },
        { tone: 'flirty', t: "I stand by it. Even cheap, it was true.", r: "True and cheap. Like most things worth having, apparently. Time's up." },
      ] },
    ],
  },
  {
    id: 'ice-new-cold-3', stage: 'new', mood: 'cold', where: 'party',
    say: "You left the last party without a word. Exits are where people show their manners. Yours were absent.",
    opts: [
      { tone: 'cold', t: "I didn't think you'd notice.", r: "I notice everything. I simply don't comment on most of it. You were the exception.", m: 2, opts: [
        { tone: 'cold', t: "Then stop commenting.", r: "Gladly. There. Silence. Enjoy your drink, and the view of my back.", m: 1 },
        { tone: 'passive', t: "Fine. I'll say goodbye properly next time.", r: "You assume there'll be a next time. ...There might. Say it properly." },
        { tone: 'flirty', t: "So you were watching the door for me.", r: "I was watching the door for the waiter. You were in the way. Very much in the way." },
      ] },
      { tone: 'passive', t: "You're right, that was rude. Can I get you a drink?", r: "Something cold, nothing pink. Let's see if you can follow instructions.", opts: [
        { tone: 'cold', t: "On second thoughts, get it yourself.", r: "I generally do. You've just reminded me why. Excuse me." },
        { tone: 'passive', t: "Here. Cold, not pink.", r: "Correct on both counts. You listen. That's rarer than talent in this room. Thank you." },
        { tone: 'flirty', t: "I'd have brought two, but I want you to come back for the second.", r: "A drink with a hook in it. Clumsy. I'll keep the drink and throw back the hook.", m: -1 },
      ] },
      { tone: 'flirty', t: "I left early so you'd miss me.", r: "A strategy. A poor one. If I missed anything, it was the canapés.", m: -1, opts: [
        { tone: 'cold', t: "Clearly it didn't work. Never mind.", r: "Never minded. Go and find someone who needs a strategy.", m: 1 },
        { tone: 'passive', t: "Honestly? I just get tired after races.", r: "That I believe. The truth always sounds dull. That's how you spot it. Rest." },
        { tone: 'flirty', t: "But you remembered I left. That's something.", r: "It's a footnote. Footnotes do get read, occasionally. Don't make me regret reading." },
      ] },
    ],
  },
  {
    id: 'ice-new-cold-4', stage: 'new', mood: 'cold',
    say: "You told me last time you weren't here to make friends. Neither am I. So why are you standing here?",
    opts: [
      { tone: 'cold', t: "Because this is where I was standing.", r: "Territorial. Simple. I can work with simple, briefly.", m: 2, opts: [
        { tone: 'cold', t: "Briefly is plenty.", r: "Agreed. I'll take the next spot over. We'll ignore each other expertly.", m: 1 },
        { tone: 'passive', t: "I can move, if you'd rather.", r: "Stay. Moving would be a concession. I'd think less of you, and I've only just started thinking." },
        { tone: 'flirty', t: "And now I'm standing near you. Lucky coincidence.", r: "Coincidence is a lazy writer. I don't believe in it, and I don't believe you. Nice try." },
      ] },
      { tone: 'passive', t: "Fair point. I was in a mood. I'm {me}, by the way.", r: "I know. Your face is on a banner outside. It's less moody than the original.", opts: [
        { tone: 'cold', t: "The banner doesn't have to talk to you.", r: "Lucky banner. We're both excused, then.", m: 1 },
        { tone: 'passive', t: "And you're {first}. I asked around.", r: "You asked others. Not me. Next time ask me. I'm shorter, but far more accurate." },
        { tone: 'flirty', t: "The original improves up close.", r: "Does it. I'm squinting. The jury is still out, and it has taken all the good chairs.", m: -1 },
      ] },
      { tone: 'flirty', t: "Maybe I'm here to make one exception.", r: "Exceptions are earned. You've earned a raised eyebrow. That's the first rung.", m: -1, opts: [
        { tone: 'cold', t: "Forget it. The rung's not worth the climb.", r: "Then stay on the ground. It's crowded down there. You'll fit right in.", m: 1 },
        { tone: 'passive', t: "Alright. What's the second rung?", r: "Patience. Which you've just shown by asking instead of assuming. Look at you, climbing." },
        { tone: 'flirty', t: "I'm a very good climber.", r: "Everyone says that from the bottom. Report back from somewhere higher." },
      ] },
    ],
  },

  // ---- new / passive: a neutral first look; they test, notice, rate ---------------------------------------------------
  {
    id: 'ice-new-passive-1', stage: 'new', mood: 'passive',
    say: ["So you're the one who drives in circles for a living.", "You drive in circles, very fast, for money. I'm still deciding if that's impressive."],
    opts: [
      { tone: 'cold', t: "Better than standing in one spot judging people.", r: "It bites. Good. I was beginning to think you only came in polite.", m: 2, opts: [
        { tone: 'cold', t: "I'll skip your review, then.", r: "Wise. It wasn't finished anyway. These things take a few more encounters. Or none.", m: 1 },
        { tone: 'passive', t: "Alright. What's the verdict so far?", r: "Promising. Underdressed for it. I'll revise after the next race, or the next conversation." },
        { tone: 'flirty', t: "I'd rather be judged up close.", r: "Everyone would. Distance is where I'm kindest. Remember that.", m: -1 },
      ] },
      { tone: 'passive', t: "It's more corners than circles, but yes.", r: "A pedant. I like precision. It's the only thing that never looks desperate.", opts: [
        { tone: 'cold', t: "Glad I passed the test.", r: "Passed is a strong word. You've been noted. Go and be noted somewhere else.", m: 1 },
        { tone: 'passive', t: "And what does a {job} do on a race weekend?", r: "Watches. Takes notes. Leaves before the speeches. You'll see me leave." },
        { tone: 'flirty', t: "I notice details too. Like your smile, just then.", r: "That wasn't a smile. That was my face resisting one. Learn the difference." },
      ] },
      { tone: 'flirty', t: "Come to a race and decide in person.", r: "An invitation in the first minute. Bold, or rehearsed. I suspect both.", m: -1, opts: [
        { tone: 'cold', t: "Or don't. Up to you.", r: "Better. Indifference suits you. I may come. I may not tell you.", m: 2 },
        { tone: 'passive', t: "No pressure. It's loud. You might hate it.", r: "Honest marketing. Refreshing. Send the details. I'll ignore them thoughtfully." },
        { tone: 'flirty', t: "I'd drive faster knowing you were watching.", r: "You'd drive exactly the same. Every driver says that to everyone. I've asked." },
      ] },
    ],
  },
  {
    id: 'ice-new-passive-2', stage: 'new', mood: 'passive',
    say: "Your cuff is folded under. Someone dressed you in a hurry, or you did it yourself in the dark.",
    opts: [
      { tone: 'cold', t: "Does it matter?", r: "Everything matters. Most people simply aren't looking. I always am.", m: 2, opts: [
        { tone: 'cold', t: "Then look somewhere else.", r: "Done. You'll find it's colder over here. That was your choice." },
        { tone: 'passive', t: "Fair. Fixed. Anything else?", r: "Collar fine. Posture good. Timing poor. Two out of three. Come back with three." },
        { tone: 'flirty', t: "Keep looking. I don't mind.", r: "You'd mind if you could read what I'm writing in my head. Go fix the cuff." },
      ] },
      { tone: 'passive', t: "Fixed. Thanks. You don't miss much, do you?", r: "Nothing. It's exhausting. Imagine reading every room like a menu.", opts: [
        { tone: 'cold', t: "Sounds like your problem.", r: "It is. And you were just a line item on it. Enjoy your evening.", m: 1 },
        { tone: 'passive', t: "What did you read when I walked in?", r: "Nerves, well hidden. Ambition, badly hidden. You'll do for a conversation." },
        { tone: 'flirty', t: "Then read me. I'm an easy menu.", r: "Easy menus are the dangerous ones. Too many sauces, nothing fresh.", m: -1 },
      ] },
      { tone: 'flirty', t: "Maybe I wanted you to fix it for me.", r: "A cuff ploy. Novel, at least. Still a ploy. Do it yourself.", m: -1, opts: [
        { tone: 'cold', t: "Fine. Done it myself.", r: "Self-sufficient. That's more attractive than anything you've said so far.", m: 2 },
        { tone: 'passive', t: "Kidding. Mostly.", r: "Mostly is where the truth hides. I'll leave it there. Neatly folded." },
        { tone: 'flirty', t: "Next time I'll leave both undone.", r: "Then next time I'll stand further away. Ambition is admirable. Strategy isn't your gift." },
      ] },
    ],
  },
  {
    id: 'ice-new-passive-3', stage: 'new', mood: 'passive',
    say: "Everyone here wants a photo with you. I'm trying to work out why.",
    opts: [
      { tone: 'cold', t: "Let me know if you figure it out.", r: "I will. Slowly. With footnotes. Don't hold your breath.", m: 2, opts: [
        { tone: 'cold', t: "I won't.", r: "Good. Breathing is underrated. So is leaving on a short line. Well done.", m: 1 },
        { tone: 'passive', t: "Honestly, I don't get it either.", r: "Modesty. Either real or well trained. Both are rare here. I'll keep watching." },
        { tone: 'flirty', t: "Take one with me. Then you'll know.", r: "A photo is a commitment. I don't commit in the first week. Ask me in a month." },
      ] },
      { tone: 'passive', t: "They want the car, really. I just come with it.", r: "Self-aware. That's unusual in someone with a fan club.", opts: [
        { tone: 'cold', t: "It's not a fan club. It's a queue.", r: "A queue you're ignoring to talk to me. I won't make the same mistake. Go on.", m: 1 },
        { tone: 'passive', t: "What about you? No photo?", r: "I don't do photos. I do memories, selectively. You might qualify." },
        { tone: 'flirty', t: "You're not in the queue, I notice.", r: "I don't queue. People come to me. You did. Note the direction of travel." },
      ] },
      { tone: 'flirty', t: "Maybe it's the smile. Want to see it up close?", r: "I've seen it on a billboard. It was larger and said less.", m: -1, opts: [
        { tone: 'cold', t: "Suit yourself.", r: "I always do. It's the only tailoring that fits.", m: 1 },
        { tone: 'passive', t: "Fair. The billboard does the talking.", r: "Badly. Find better lines, then come back and try them on me." },
        { tone: 'flirty', t: "Then let the real one say more.", r: "It's saying a great deal. Nothing I haven't read before. Get a new author." },
      ] },
    ],
  },
  {
    id: 'ice-new-passive-4', stage: 'new', mood: 'passive', where: 'evening',
    say: "You found the only quiet corner of {venue}. That was mine. I'm deciding whether to share it.",
    opts: [
      { tone: 'cold', t: "I'm not moving.", r: "Good. People who move for me are tiresome. Sit. Don't talk yet.", m: 2, opts: [
        { tone: 'cold', t: "Wasn't going to talk.", r: "Then we understand each other. Rare. Enjoy the silence. It's mine, on loan.", m: 1 },
        { tone: 'passive', t: "Can I talk now?", r: "One sentence. ...No, that was it. That was your sentence. Sleep well." },
        { tone: 'flirty', t: "Quiet suits you. So does this light.", r: "Light is a tool. You noticed it. Don't think I didn't notice you noticing." },
      ] },
      { tone: 'passive', t: "I can go. I just needed a minute away from the noise.", r: "Stay. A minute is exactly what this corner is for. I'll even share the bench.", opts: [
        { tone: 'cold', t: "I'll take the minute and go.", r: "Efficient. I'll pretend I never offered the bench.", m: 1 },
        { tone: 'passive', t: "What brought you up here?", r: "Too many people saying too little. Same as you. You've been tolerable company." },
        { tone: 'flirty', t: "Sharing a bench? That's practically a date.", r: "It's practically a bench. Don't upgrade things without asking.", m: -1 },
      ] },
      { tone: 'flirty', t: "Maybe I followed you here.", r: "Then you've been obvious for two flights of stairs. Sit down, detective.", opts: [
        { tone: 'cold', t: "Kidding. I came for the view.", r: "The view. Of course. It doesn't look back. That must be restful for you.", m: 1 },
        { tone: 'passive', t: "Kidding. I just needed air.", r: "Air is free up here. The company isn't. Take your fill, then go." },
        { tone: 'flirty', t: "Not kidding. You looked worth following.", r: "Looked. Past tense. Up close is another matter. Goodnight, detective." },
      ] },
    ],
  },

  // ---- new / flirty: you left it flirty; they're amused, magnetic and one step ahead ----------------------------------
  {
    id: 'ice-new-flirty-1', stage: 'new', mood: 'flirty',
    say: "You were almost charming last time. I've been wondering whether it was an accident.",
    opts: [
      { tone: 'cold', t: "Probably. Don't expect a repeat.", r: "Good answer. An accident I can't predict is more interesting than a habit.", m: 2, opts: [
        { tone: 'cold', t: "Then stay interested from a distance.", r: "Distance is my natural habitat. It's where I'm most dangerous. Enjoy your night.", m: 1 },
        { tone: 'passive', t: "Alright, maybe not entirely an accident.", r: "Partly deliberate. Like a good haircut. Fine. Keep the parts that work." },
        { tone: 'flirty', t: "Unless you want one.", r: "Want is a strong word. Let's say I'd watch. Closely. For quite some time." },
      ] },
      { tone: 'passive', t: "Accident or not, it was nice talking to you.", r: "Nice. That's the word you chose. I handed you an entire language.", opts: [
        { tone: 'cold', t: "Fine. It was adequate.", r: "Adequate. Better. At least it has an opinion. Off you go, adequately.", m: 1 },
        { tone: 'passive', t: "Alright. It was the best part of my weekend.", r: "Either a compliment or a very sad weekend. I'll take it as both." },
        { tone: 'flirty', t: "Enjoyable. Distracting. A little dangerous.", r: "Three adjectives, one of them true. Keep going like that and you'll find out which." },
      ] },
      { tone: 'flirty', t: "No accident. I was trying. Still am.", r: "I could tell. You tilt your head when you try. It's very nearly working.", opts: [
        { tone: 'cold', t: "Then I'll stop trying.", r: "Pity. Trying is half your charm. The other half lives in the car." },
        { tone: 'passive', t: "Very nearly is a start.", r: "It's a start line. I hear you know about those. Don't stall." },
        { tone: 'flirty', t: "What happens when it fully works?", r: "You'll know. I won't say a word. That's how you'll know." },
      ] },
    ],
  },
  {
    id: 'ice-new-flirty-2', stage: 'new', mood: 'flirty',
    say: ["You're late. I wasn't waiting. I was standing very still, on purpose.", "Ah. There you are. Not that I was looking."],
    opts: [
      { tone: 'cold', t: "I'm not late. You're early.", r: "A correction, delivered flat. Very good. That one I'll let stand.", m: 2, opts: [
        { tone: 'cold', t: "You don't have to let anything stand.", r: "I know. That's what made it generous. You've just spent it. Go on, then.", m: 1 },
        { tone: 'passive', t: "Anyway. How's your weekend been?", r: "Busy, and better for the last minute. Don't quote me. I'll deny it in writing." },
        { tone: 'flirty', t: "Early for me. I'll take that.", r: "Take it. Don't frame it. A step ahead of you, as usual." },
      ] },
      { tone: 'passive', t: "Sorry. Got stuck with the team.", r: "Apology and context. Very professional. I'm almost charmed. Almost is my limit, this early.", opts: [
        { tone: 'cold', t: "Comes with the job.", r: "So does punctuality, in mine. We'll compare notes another time.", m: 1 },
        { tone: 'passive', t: "I'll be on time next time.", r: "Next time. You keep planning those. I'm noting the habit." },
        { tone: 'flirty', t: "Almost charmed? I'll take almost.", r: "Almost is the most interesting word I own. Spend it wisely." },
      ] },
      { tone: 'flirty', t: "Standing still for me? I'm flattered.", r: "You should be. I don't stand still for just anyone. Take the compliment before I take it back.", opts: [
        { tone: 'cold', t: "Don't flatter yourself either.", r: "Touché. I'll go and stand still somewhere else, then.", m: 1 },
        { tone: 'passive', t: "Well, I'm here now.", r: "You are. Let's not make a ceremony of it. Next time, be early." },
        { tone: 'flirty', t: "Then I'll make it worth the wait.", r: "Waiting implies I'd do it again. I would. Tell no one." },
      ] },
    ],
  },
  {
    id: 'ice-new-flirty-3', stage: 'new', mood: 'flirty', where: 'party',
    say: "You owe me a dance. I don't dance. Consider it a debt, accruing interest.",
    opts: [
      { tone: 'cold', t: "I don't dance either. Debt cancelled.", r: "Cancelled. Just like that. I didn't expect the backbone. It's been noted.", m: 2, opts: [
        { tone: 'cold', t: "Note it and move on.", r: "Moving on is something I'm extremely good at. Watch.", m: 1 },
        { tone: 'passive', t: "Fine. One song. Badly.", r: "Badly is honest. Honest I can dance to. One song. Then you're back in debt." },
        { tone: 'flirty', t: "Unless you're the one leading.", r: "I always lead. That's the only rule. You'd resent it. You'd be back next week." },
      ] },
      { tone: 'passive', t: "What's the interest rate?", r: "Steep. One conversation a week until repaid. You've already fallen behind.", opts: [
        { tone: 'cold', t: "I'll default.", r: "Defaulters get blacklisted. You'd be surprised how short my list is. Bye.", m: 1 },
        { tone: 'passive', t: "Then this is my first payment.", r: "Accepted. Barely. The receipt is that I haven't walked away. Enjoy it." },
        { tone: 'flirty', t: "I'll pay in instalments. Slowly.", r: "Slow payments. You've grasped how I like things. Begin." },
      ] },
      { tone: 'flirty', t: "I'd pay it off right now if you'd let me.", r: "Eager. That was the first sip of your drink talking. Don't let the second one speak.", m: -1, opts: [
        { tone: 'cold', t: "Never mind, then.", r: "Good. The debt stands. I'll collect when you're less thirsty.", m: 1 },
        { tone: 'passive', t: "Fair. Let's just talk for now.", r: "For now. You're learning. Talk is the deposit. Make it a decent one." },
        { tone: 'flirty', t: "I'm not thirsty. Just interested.", r: "Interested has a better ring. Keep the glass half full and your eyes where they are." },
      ] },
    ],
  },
  {
    id: 'ice-new-flirty-4', stage: 'new', mood: 'flirty',
    say: "I told someone about you. Don't preen. It was a very short story.",
    opts: [
      { tone: 'cold', t: "Short is probably accurate.", r: "Concise. Not modest, concise. I like that better than modest.", m: 2, opts: [
        { tone: 'cold', t: "Then keep it short.", r: "One line, then. 'Drove off without looking back.' Accurate enough?", m: 1 },
        { tone: 'passive', t: "What did you tell them?", r: "That you're quieter than your posters. That you listen. The rest is classified." },
        { tone: 'flirty', t: "Give it a sequel.", r: "Sequels are usually worse. Make me the exception. I'll be reading." },
      ] },
      { tone: 'passive', t: "Was it a good story, at least?", r: "It had a beginning. The middle is pending. Endings, I'm told, are where people fall apart.", opts: [
        { tone: 'cold', t: "Don't wait up for the middle.", r: "I never wait up. I wake early and find out. Until then.", m: 1 },
        { tone: 'passive', t: "Let's work on the middle, then.", r: "Practical. Write the next chapter at {track}. I'll be there, critically." },
        { tone: 'flirty', t: "I'll give you a better middle.", r: "A promise in narrative form. I'm a hard editor. Very well. Draft something." },
      ] },
      { tone: 'flirty', t: "A short story? Let's make it a long one.", r: "There it is. The pitch. You've been waiting all night to say that.", opts: [
        { tone: 'cold', t: "Or not. Your call.", r: "Everything is my call. That's the whole charm of me. Good evening." },
        { tone: 'passive', t: "Alright, that was a bit much.", r: "A bit. Not fatal. I've edited it in my head. It reads better already." },
        { tone: 'flirty', t: "I've waited longer for less.", r: "So have I. Tonight wasn't one of those nights. ...Pretend I didn't say that." },
      ] },
    ],
  },
];
