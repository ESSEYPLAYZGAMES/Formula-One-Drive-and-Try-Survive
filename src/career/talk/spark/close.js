// The Spark - in person, stage 'close' (dating: in-jokes, missing each other, jealousy, the future, heat). Plain data.
export const DATA = [
  // ---- cold: you were cold last time - hurt first, then sulky; you have to earn the sparkle back ---------------------
  {
    id: 'spark-close-cold-1', stage: 'close', mood: 'cold',
    say: "Hey. You were weird with me last time. Properly weird. I cried in a taxi and the driver gave me a mint.",
    opts: [
      { tone: 'cold', t: "You're overreacting.", r: "Overreacting? A total stranger gave me a mint! Nobody gets a mint for overreacting! ...And you're doing it again.", opts: [
        { tone: 'cold', t: "I just need some space.", r: "Space. Okay. Have all of it. The whole sky. I'll be somewhere else, being fun without you." },
        { tone: 'passive', t: "Sorry. I didn't mean it like that.", r: "You never mean it, but you always say it. Okay. I'm listening. Explain properly this time." },
        { tone: 'flirty', t: "C'mere. I owe you a cuddle.", r: "No! You don't get to cash that in yet. ...Okay, fine. A quick one. Very quick. I'm still cross." },
      ] },
      { tone: 'passive', t: "I'm sorry. I was stressed about the race.", r: "I know you get like that. But I'm on your team too, you know? Not the pit crew. The other team.", opts: [
        { tone: 'cold', t: "I can't promise it won't happen again.", r: "Then I can't promise I'll keep being this sweet about it. Think about that on your out-lap." },
        { tone: 'passive', t: "Next time, I'll tell you before I go quiet.", r: "Deal. A warning. A flare. A smoke signal. Anything. I'll bring snacks and keep my distance." },
        { tone: 'flirty', t: "You're my favourite team.", r: "Ugh, why are you good at this? Favourite team. Do we get matching jackets? We're getting matching jackets." },
      ] },
      { tone: 'flirty', t: "I'm sorry. Can I buy you a lifetime of mints?", r: "A lifetime of mints? That's stupid. That's so stupid. I'm smiling, and I'm furious about it.", opts: [
        { tone: 'cold', t: "Fine. Forget I asked.", r: "And there's the cold shoulder again. Two in a row! You're on a streak. Not a good one." },
        { tone: 'passive', t: "Seriously, I'm sorry. I hate making you sad.", r: "I know. And I'm terrible at sad, it doesn't suit me. Let's not do it again. Pinky promise. A real one." },
        { tone: 'flirty', t: "And a lifetime of me, if you still want it.", r: "Stop it, you'll make me cry again and this time there's no mint. ...Yes. Obviously yes. Idiot." },
      ] },
    ],
  },
  {
    id: 'spark-close-cold-2', stage: 'close', mood: 'cold',
    say: "Oh, hi. Didn't see you there. I was too busy NOT checking my phone for the reply you never sent.",
    opts: [
      { tone: 'cold', t: "I said I'd be busy.", r: "You did. And I said 'okay' with a heart, and then you vanished. You ghosted a heart, {me}! A heart!", opts: [
        { tone: 'cold', t: "It's a heart. It'll get over it.", r: "It's having a terrible week, thanks for asking. No more hearts for you. Thumbs up only. Cold ones." },
        { tone: 'passive', t: "You're right. I should've replied.", r: "One word would've done it! 'Hi'! I'd have lived on a 'hi' for days. I'm very low-maintenance. Ish." },
        { tone: 'flirty', t: "I'll send you a hundred hearts tonight.", r: "A hundred? I'll count them. If it's ninety-nine, you're in trouble. ...Okay. You're forgiven-ish." },
      ] },
      { tone: 'passive', t: "Sorry. Testing ran late every night.", r: "Every night? Even the night I sent you the duck in the bowtie? That was important. That was urgent.", opts: [
        { tone: 'cold', t: "Not as important as testing.", r: "The duck would be devastated. I'm devastated. On the duck's behalf. And a bit on mine." },
        { tone: 'passive', t: "Show me the duck now.", r: "Here. Look at its little bowtie. ...See? You're smiling. That smile was owed to me three days ago." },
        { tone: 'flirty', t: "Dinner tomorrow, my treat. Forgive me?", r: "Dinner? Tomorrow? Fine. But I'm ordering the most expensive thing. And wearing a bowtie. In tribute." },
      ] },
      { tone: 'flirty', t: "I was saving it all up for when I saw you.", r: "Saving it up? Like coins in a jar? Then tip out the whole jar, because I'm still annoyed.", opts: [
        { tone: 'cold', t: "Forget it. You're clearly cross.", r: "I'm cross? You're cross! We're both cross! Fine! I'll take my crossness elsewhere!" },
        { tone: 'passive', t: "I missed you this week. That's the whole jar.", r: "One coin? It's a good coin. Small, but shiny. ...I missed you too. Obviously." },
        { tone: 'flirty', t: "I thought about you every single lap.", r: "Every lap? Even the slow ones? That's annoyingly romantic. I'm un-annoyed. Almost entirely." },
      ] },
    ],
  },
  {
    id: 'spark-close-cold-3', stage: 'close', mood: 'cold',
    say: "So. That person you were laughing with in the paddock last week. Very funny, were they? Funnier than me?",
    opts: [
      { tone: 'cold', t: "That's none of your business.", r: "Oh. None of my business. Cool. Cool cool cool. I'll be over here, not business-ing.", opts: [
        { tone: 'cold', t: "Good.", r: "Good! Great! Lovely! I'll go and laugh with someone very funny, too. Very, very loudly." },
        { tone: 'passive', t: "They're a sponsor. That's all.", r: "A sponsor. Right. I may have overreacted. Slightly. I'd made up a whole story. It had a villain." },
        { tone: 'flirty', t: "Nobody's funnier than you. Come on.", r: "Am I, though? Say it again. Slower. ...Okay, fine, I believe you. But I'm keeping an eye on them." },
      ] },
      { tone: 'passive', t: "That was my engineer's cousin. Relax.", r: "Your engineer's cousin. Of course. Totally knew that. I'm completely relaxed. See how relaxed I am?", opts: [
        { tone: 'cold', t: "You're being ridiculous.", r: "Ridiculous? You laughed at their joke and it wasn't even good! I heard it from the hospitality tent!" },
        { tone: 'passive', t: "Were you jealous?", r: "Jealous? Me? No! ...A little. A smidge. You laugh with your whole face. It's unfair to share it." },
        { tone: 'flirty', t: "You're cute when you're jealous.", r: "I'm not jealous! I'm vigilant. Fine, a bit jealous. Stop looking so smug. It suits you, which is worse." },
      ] },
      { tone: 'flirty', t: "Nobody makes me laugh like you do.", r: "Mm-hm. Prove it. Laugh at this: why don't racing drivers ever get lost? They only go in circles.", opts: [
        { tone: 'cold', t: "That's not funny.", r: "It's hilarious and you know it! I take back every nice thing I was about to say. Every single one." },
        { tone: 'passive', t: "Okay. That was a little funny.", r: "A little! See? Funniest person you know. Write it down. Sign it. Stick it on the fridge." },
        { tone: 'flirty', t: "I'm laughing because I love you.", r: "You can't say that mid-joke! That's cheating! ...Say it again, slower. I want to remember this one." },
      ] },
    ],
  },
  {
    id: 'spark-close-cold-4', stage: 'close', mood: 'cold',
    say: "You forgot our heist-iversary. The night we got banned from the go-kart place? I made a cake. It's shaped like a kart.",
    opts: [
      { tone: 'cold', t: "That's not a real anniversary.", r: "It's real to me! And to the cake! The cake is very real and very upset. ...I'm upset. Mostly me.", opts: [
        { tone: 'cold', t: "Then eat it yourself.", r: "Watch me. The whole kart, wheels first, while your race plays on mute. Take that." },
        { tone: 'passive', t: "Okay. I'm sorry I forgot.", r: "You should be. It has liquorice wheels. ...Do you want a slice? The apology slice? It's the biggest." },
        { tone: 'flirty', t: "Save me the steering wheel?", r: "The steering wheel's the best bit! ...Fine. But I'm feeding it to you, and you'll look very silly." },
      ] },
      { tone: 'passive', t: "I'm sorry. Is it too late to celebrate?", r: "It's never too late to celebrate. That's my whole philosophy. But you have to wear the party hat.", opts: [
        { tone: 'cold', t: "No party hats.", r: "No hat, no cake. Those are the rules. I don't make the rules. I do, actually. I made that one just now." },
        { tone: 'passive', t: "Fine. One hat, one slice.", r: "One hat, one slice, one terrible photo for my lock screen. You agreed to all three. Too late now." },
        { tone: 'flirty', t: "I'll wear anything if you're sharing that cake.", r: "Anything? There's a feather boa in my bag. Why? Emergencies. This is one. Put it on, gorgeous." },
      ] },
      { tone: 'flirty', t: "I didn't forget. I was planning the sequel.", r: "The sequel? You're bluffing, I can always tell. ...But go on. It'd better be something we're not allowed to do.", opts: [
        { tone: 'cold', t: "Never mind. There isn't one.", r: "There isn't? You hauled my hopes all the way up just to drop them. That's very cold, babe." },
        { tone: 'passive', m: 3, t: "Bumper boats. Saturday.", r: "Bumper boats!! Forgiven! Completely! Saturday! I'm bringing a pirate hat. Non-negotiable." },
        { tone: 'flirty', m: 4, t: "Something we'll get banned for again. Together.", r: "Banned together! Most romantic thing anyone can say. I love you. Right. Cake. Now." },
      ] },
    ],
  },

  // ---- passive: the easy everyday of dating them - schemes, the imaginary dog, the routine --------------------------
  {
    id: 'spark-close-passive-1', stage: 'close', mood: 'passive',
    say: [
      "Babe! Big question. If we ran away tomorrow, no phones, no team, where would you take me? First answer. Go!",
      "Pop quiz! We disappear tomorrow. No phones, no paddock, nobody. Where are you taking me? Three seconds!",
    ],
    opts: [
      { tone: 'cold', t: "Nowhere. I've got a race.", r: "Oh. Right. The race. Always the race. ...That fell flat, and so did I, a bit. Humour me next time?", opts: [
        { tone: 'cold', t: "Humouring you isn't my job.", r: "Clearly. I'll plan the escape alone, then, and send you postcards. Mean ones. With bad drawings of you." },
        { tone: 'passive', t: "Okay. Somewhere hot, with a beach.", r: "A beach! A little hut, terrible wifi, nobody we know. Yes. I'm packing. Mentally. For now." },
        { tone: 'flirty', t: "Anywhere you are, I'm already happy.", r: "That's such a cop-out. A beautiful cop-out. I'll allow it, and steal it for your next birthday card." },
      ] },
      { tone: 'passive', t: "A mountain hut. Snowed in.", r: "Snowed in! Board games, a fire, me losing every game and flipping the board. Perfect. I'm in.", opts: [
        { tone: 'cold', t: "You'd be bored in a day.", r: "Bored? With you, snowed in? ...That's what you think of me? I'd build a snow you. It'd be friendlier." },
        { tone: 'passive', t: "And you'd cheat at every game.", r: "Obviously I'd cheat. It's not a holiday without a bit of cheating. I'd cheat lovingly, though." },
        { tone: 'flirty', t: "Just us, a fire, and nowhere to be.", r: "Nowhere to be. Oh, I want that so badly. Promise me we'll do it. Properly. I'll bring the hot chocolate." },
      ] },
      { tone: 'flirty', t: "Somewhere nobody knows us, so I can kiss you whenever I want.", r: "Whenever you want? We'd never leave the hotel room. The hotel! I meant the hotel. The lobby. Lovely lobby.", opts: [
        { tone: 'cold', t: "On second thought, you'd talk too much.", r: "Too much? I'd talk the perfect amount! ...Okay, that stung. You're lucky I like you. Usually." },
        { tone: 'passive', t: "Okay, seriously. Where?", r: "Somewhere with a night market and a funny little boat. And no cameras. Can we? One day? Please?" },
        { tone: 'flirty', t: "You'd be blushing in every lobby on the planet.", r: "Every lobby! I'd be famous for it. 'The Blusher.' You love making me blush. Admit it. Admit it!" },
      ] },
    ],
  },
  {
    id: 'spark-close-passive-2', stage: 'close', mood: 'passive',
    say: "Okay, so I told my friends we're getting a dog. We're not. But now they keep asking for photos. Help.",
    opts: [
      { tone: 'cold', t: "That's your problem, not mine.", r: "I thought this was an 'us' problem. Turns out it's a me-and-my-imaginary-dog problem. Thanks.", opts: [
        { tone: 'cold', t: "Just tell them the truth.", r: "The truth?! Fine. I'll tell them the dog left me. For someone less grumpy. Which won't be hard." },
        { tone: 'passive', t: "Fine. Send them a photo of a stranger's dog.", r: "Evil, but genius. We'll call it Turbo. ...What? It's a great dog name. You've been demoted from Turbo." },
        { tone: 'flirty', t: "Or we could actually get one.", r: "Wait, really? Don't joke! A real dog! With you! I'm naming it, don't argue. I'm already crying a bit." },
      ] },
      { tone: 'passive', t: "What kind of dog do we have?", r: "A very fluffy one called Pancake. Scared of the hoover. Sleeps on your side of the bed.", opts: [
        { tone: 'cold', t: "Pancake is not sleeping on my side.", r: "Pancake sleeps where Pancake likes. You're being very harsh on our imaginary dog. Pancake has feelings." },
        { tone: 'passive', t: "Pancake sounds great, honestly.", r: "Pancake IS great. Best thing that's never happened to us. We should get a real Pancake one day." },
        { tone: 'flirty', t: "My side of the bed's reserved for you.", r: "Oh, is it? Then Pancake's on the floor. Sorry, Pancake. Some spots are taken. Permanently." },
      ] },
      { tone: 'flirty', t: "Tell them it looks just like you. Cute and chaotic.", r: "Ha! That's going in my bio. You're very good at summing me up, you know. Suspiciously good.", opts: [
        { tone: 'cold', t: "Mostly chaotic.", r: "Mostly?! The cute was doing all the heavy lifting there. Rude. I'll be chaotic at you all week now." },
        { tone: 'passive', t: "So are we getting one or not?", r: "After the season. A rescue. I'm already looking at pictures. I've got a folder. A big folder." },
        { tone: 'flirty', t: "I've already got one cute chaotic thing. You.", r: "Stop. I'm grinning in public again. People will think I've won something. I suppose I have. You." },
      ] },
    ],
  },
  {
    id: 'spark-close-passive-3', stage: 'close', mood: 'passive', where: 'evening',
    say: "I've made dinner! Well. I've assembled dinner. From four different takeaways. It's a fusion. Don't judge.",
    opts: [
      { tone: 'cold', t: "I wanted to cook tonight.", r: "Oh. I thought this was a nice surprise. Clearly it's an annoying surprise. I'll put the noodles away.", opts: [
        { tone: 'cold', t: "Fine. Leave it on the counter.", r: "On the counter. Very romantic. I'll eat mine on the balcony. The pigeons appreciate me." },
        { tone: 'passive', t: "Sorry. Long day. This is actually perfect.", r: "Is it? You're not just saying that? ...Okay. Sit. Try the curry-pizza thing. Trust me." },
        { tone: 'flirty', t: "No, stay. I'll cook tomorrow. Tonight you spoil me.", r: "Spoiling you is my favourite hobby, and I'm terrible at it, which makes it better. Open wide, noodle incoming." },
      ] },
      { tone: 'passive', t: "Is that pizza next to the sushi?", r: "It is! It's a journey! Start with the sushi, finish with the pizza, cry a little at dessert. It's that good.", opts: [
        { tone: 'cold', t: "That's disgusting.", r: "Disgusting?! It's fusion! Right, no dessert for you. The crying dessert is mine now. Every spoonful." },
        { tone: 'passive', t: "Okay. I'm trying it.", r: "Well? Your face is doing something. Is it a good something? It's a good something. I knew it." },
        { tone: 'flirty', t: "Best chef I've ever dated.", r: "Best chef! Out of how many? Don't answer that! Eat your pizza-sushi and gaze at me adoringly." },
      ] },
      { tone: 'flirty', t: "You're the only dessert I need.", r: "That's so cheesy it should come with crackers. ...You're getting dessert anyway. And me. Combo deal.", opts: [
        { tone: 'cold', t: "That was a joke.", r: "Oh, a joke. Hilarious. I'll laugh later. Alone. With the dessert you're not getting now." },
        { tone: 'passive', t: "Okay, okay. Let's eat.", r: "Sit, sit! I've put a film on that neither of us will watch, because I'll talk the whole way through it." },
        { tone: 'flirty', t: "Combo deal. Best offer I've had all week.", r: "All week? I should hope so! Dinner's going cold and I don't care even slightly." },
      ] },
    ],
  },
  {
    id: 'spark-close-passive-4', stage: 'close', mood: 'passive', where: 'party',
    say: "Babe! There's a dance-off and I've put our names down. Before you say anything: yes, we're doing the routine.",
    opts: [
      { tone: 'cold', t: "I'm not doing the routine.", r: "But the routine! We practised in the kitchen! Twice! ...Ow. In front of everyone at {venue}, too.", opts: [
        { tone: 'cold', t: "Do it with someone else.", r: "Maybe I will! Someone with actual rhythm. You'll be sorry when we win the little trophy." },
        { tone: 'passive', t: "Okay. Just the first half.", r: "The first half is the boring half! Fine. First half. Then you'll get into it. You always do." },
        { tone: 'flirty', t: "Fine. But only because you look this good tonight.", r: "Flattery and a routine? You're spoiling me. Come on, music's starting. Big finish, like we practised." },
      ] },
      { tone: 'passive', t: "The one with the spin?", r: "Yes! Spin and all! And the bit where you pretend to trip. That bit always gets a cheer. Come on!", opts: [
        { tone: 'cold', t: "I'm skipping the tripping bit.", r: "Then it's not the routine! That's the whole point! ...Fine. We'll improvise. Badly. On your head be it." },
        { tone: 'passive', t: "Alright. Let's get it over with.", r: "'Get it over with'! You'll love it in thirty seconds. You always pretend you won't, then you're the star." },
        { tone: 'flirty', t: "Only if we end it with a dip.", r: "A dip! A proper dip! I'm going to scream. We're going to win. We're going to win so hard." },
      ] },
      { tone: 'flirty', t: "I'd do any routine with you. Even the chicken arms.", r: "THE CHICKEN ARMS! You remembered! Okay, we're winning this. Drink up, partner, we're on next.", opts: [
        { tone: 'cold', t: "Actually, I'm not feeling it.", r: "Not feeling the chicken arms? They're always a feeling! ...Fine. I'll do them alone. Tragically. Beautifully." },
        { tone: 'passive', t: "Okay. Let's warm up first.", r: "Like a pro! Shoulder rolls, finger snaps, terrifying stare at the competition. Go!" },
        { tone: 'flirty', t: "And after we win, you're all mine.", r: "I'm already all yours, and you're all mine, and the trophy will be all ours. Chicken arms, go!" },
      ] },
    ],
  },

  // ---- flirty: you left it flirty - they pick up the heat and push it further, cheekily ----------------------------
  {
    id: 'spark-close-flirty-1', stage: 'close', mood: 'flirty',
    say: "Mm, there you are. I woke up thinking about what you said on the phone last night and I've been useless all day.",
    opts: [
      { tone: 'cold', t: "What thing? I don't remember.", r: "You don't remember? That's a cold bucket on a hot day. I remembered it word for word. Every word.", opts: [
        { tone: 'cold', t: "Can't have been important.", r: "Not important. Got it. I'll stop being useless, then. I'll go and be useful. Somewhere else." },
        { tone: 'passive', t: "Sorry, I was half asleep. Remind me?", r: "You said you'd marry me if I learned to cook. I'm signing up for a class. ...I'm not. I might." },
        { tone: 'flirty', t: "Okay. I remember. And I meant every word.", r: "Every word? Even the bit about the balcony? Right. Now I'm useless again. Thanks for that." },
      ] },
      { tone: 'passive', t: "Good useless or bad useless?", r: "The best useless! Sugar in my soup. Shoes on the wrong feet. I sang in a meeting. All your fault.", opts: [
        { tone: 'cold', t: "Sounds like a you problem.", r: "A me problem? It's an us problem! You started it! ...Fine. I'll be useless on my own. Sulkily." },
        { tone: 'passive', t: "I'll try to be less distracting.", r: "Don't you dare. Being distracted by you is my favourite way to be bad at things." },
        { tone: 'flirty', t: "Good. I want to be all you think about.", r: "Oh, you are. Completely. It's very annoying. And very nice. Mostly nice. Get over here." },
        { tone: 'risque', t: "Then let me remind you exactly how I said it.", r: "Here? Now? With people around? ...Okay. Whisper it. Slowly. Oh, I'm in trouble. We're both in trouble." },
      ] },
      { tone: 'flirty', t: "I'll say it again, then. In person this time.", r: "You wouldn't. Not here, with all these people... You would, wouldn't you? Do it. I double-dare you.", opts: [
        { tone: 'cold', t: "Maybe later. Not here.", r: "Later. Always later. You wind me up like a toy and put me back on the shelf. Fine. Shelf time." },
        { tone: 'passive', t: "You're even cuter in person.", r: "Cuter than on the phone? Good. On the phone I had a green face mask on. Very glamorous." },
        { tone: 'flirty', t: "Come closer. I don't want anyone else to hear.", r: "Closer... closer... I'm basically standing on your shoes. Say it. ...Oh, you're terrible. I love it." },
        { tone: 'risque', t: "I'll say it, then show you what I meant.", r: "Show me? Right, that's it, we're leaving. Now. I'm saying goodbye to nobody. Go, go, go." },
      ] },
    ],
  },
  {
    id: 'spark-close-flirty-2', stage: 'close', mood: 'flirty', where: 'party',
    say: "Dance with me. Properly, not like before. I've had two drinks, I'm brave, and you're the best-looking person here.",
    opts: [
      { tone: 'cold', t: "I'm not in a dancing mood.", r: "Oh. You said you'd dance with me tonight. You promised. That hurts a bit. ...Okay, a lot.", opts: [
        { tone: 'cold', t: "I'm just tired of parties.", r: "Tired of parties, or tired of me at parties? ...Fine. I'll dance with the drinks table. It never says no." },
        { tone: 'passive', t: "One song. I'm sorry. I'm just drained.", r: "One song. No spins, just swaying. Like two lamp posts in a breeze. I'll be gentle with you." },
        { tone: 'flirty', t: "For you, I'll find the mood.", r: "Find it fast, I'm already on the floor! Ha. There. That's better. Isn't that better?" },
      ] },
      { tone: 'passive', t: "Two drinks, huh? I'll get you some water.", r: "Water! The most romantic drink there is. ...No, you're right. You're always right. Then a dance? Promise?", opts: [
        { tone: 'cold', t: "No dancing. Water, then home.", r: "Home already? Boo. The party's barely started. Fine. But I'm singing all the way back. Very loudly." },
        { tone: 'passive', t: "Water, then a dance. Deal.", r: "Deal! I'll drink it in one go. ...Done! Now dance! A deal's a deal. You can't argue with a deal." },
        { tone: 'flirty', t: "Water, a dance, then you're all mine.", r: "All yours. I love that order. Hurry with the water, I'm getting impatient and very, very affectionate." },
        { tone: 'risque', t: "Water, one dance, then I'm taking you home.", r: "Taking me home! Yes. One dance. A speedy one. Half a dance. Let's just skip to the home bit." },
      ] },
      { tone: 'flirty', t: "You're the best-looking person here and you know it.", r: "I do know it! But I like hearing it. Say it again while we dance. Close dance. Very close.", opts: [
        { tone: 'cold', t: "I've said it once.", r: "Once?! You're rationing compliments now? Fine. I'll dance with the confetti. It adores me." },
        { tone: 'passive', t: "Come on, then. One song.", r: "One song, then another, then another. I know how this goes. You're terrible at leaving." },
        { tone: 'flirty', t: "Closer than this?", r: "Mm-hm. ...Yes. Oh, you're good at this. Don't let anyone else dance with you. Ever." },
        { tone: 'risque', t: "After this song, let's find a quiet corner.", r: "A quiet corner? Here? There's a cupboard by the coats. I'm joking. I'm not joking. Come on." },
      ] },
      { tone: 'risque', t: "Dance with me, then come home with me.", r: "Both? Dance first? I've never danced so fast in my life. Two songs, then we're gone.", opts: [
        { tone: 'cold', t: "Actually, just the dance.", r: "Just the dance? You dangled 'home' and snatched it back. Fine. One dance, then I'll dance alone." },
        { tone: 'passive', t: "Let's see how the dancing goes first.", r: "It'll go brilliantly, I'm an excellent dancer. You'll see. Then you'll be the one begging to leave." },
        { tone: 'flirty', t: "Two songs. I'm counting.", r: "Count out loud. And no checking the time. Just look at me. Yes. Like that. Exactly like that." },
        { tone: 'risque', t: "Forget the songs. Coats. Now.", r: "Coats! Now! I love it when you're bossy. Goodbye, party! Nobody look at us! Everybody look at us!" },
      ] },
    ],
  },
  {
    id: 'spark-close-flirty-3', stage: 'close', mood: 'flirty',
    say: "I stole your hoodie. I'm wearing it. I'm not giving it back. I'm telling you now so we don't fight about it later.",
    opts: [
      { tone: 'cold', t: "Give it back. That's my lucky one.", r: "Your lucky one? Oh. ...Here, then. I thought it'd be cute. Turns out it's just theft. Sorry.", opts: [
        { tone: 'cold', t: "Thanks. Finally.", r: "'Finally.' Not even a hug for the return. Okay. I'll go and be cold. Hoodie-less and cold." },
        { tone: 'passive', t: "Sorry. Keep it till race day.", r: "Till race day! Then it goes back smelling of me. Your lucky hoodie, full of me. Try racing with that." },
        { tone: 'flirty', t: "It looks better on you anyway.", r: "It does, doesn't it? Time-share, then. Weekdays mine, race days yours. Deal? Deal. Kiss on it." },
      ] },
      { tone: 'passive', t: "That's fine. It suits you.", r: "It suits me so much. I look like a tiny racing legend. I've been doing your podium pose in the mirror.", opts: [
        { tone: 'cold', t: "Don't do my pose.", r: "Too late, I've perfected it. Mine's better. You'd have to steal it back, but you're grumpy, so never mind." },
        { tone: 'passive', t: "Show me the pose.", r: "Okay. Arms up... chin up... and a wink. ...See? I'm basically you, but louder. Way louder." },
        { tone: 'flirty', t: "Wear it to my next race. Front row.", r: "Front row, your hoodie, glitter on my cheeks. You'll be so distracted. Good. Win for me anyway." },
        { tone: 'risque', t: "Keep it on. Later, I might come and claim it back.", r: "Claim it back? Ooh. Try it. I'll put up a fight. A very short fight. I'm a terrible fighter." },
      ] },
      { tone: 'flirty', t: "Keep it. I'll steal you instead.", r: "Steal me? I'm a terrible thing to steal! I'm loud, I eat in bed, I hog the blanket. ...Do it anyway.", opts: [
        { tone: 'cold', t: "Never mind. Too much hassle.", r: "Hassle? I'm premium hassle! ...That stung. I'll go and sulk in your hoodie. It smells of you. Traitor." },
        { tone: 'passive', t: "You do hog the blanket.", r: "I do! It's a love language. Mine. It's not in any book, I made it up just now. Still counts." },
        { tone: 'flirty', t: "Loud, messy and all mine.", r: "Loud, messy and all yours. That's going on a cushion. A huge, embarrassing cushion. On our sofa." },
        { tone: 'risque', t: "Then I'm stealing you tonight and keeping you till morning.", r: "Overnight? That's a kidnapping and I'm a very willing hostage. Pack snacks. And yourself, mostly." },
      ] },
    ],
  },
  {
    id: 'spark-close-flirty-4', stage: 'close', mood: 'flirty', where: 'evening',
    say: "Okay, I've lit about forty candles in your flat and one of them smells like a bakery. Too much? Don't answer. Come here.",
    opts: [
      { tone: 'cold', t: "Forty candles? That's a fire hazard.", r: "I was going for romantic and you've gone for safety inspector. Lovely. I'll blow them out. All forty. Sadly.", opts: [
        { tone: 'cold', t: "Good. Thank you.", r: "You're welcome. It's very dark now. You can't even see me sulking, which is a shame. It's a great sulk." },
        { tone: 'passive', t: "Okay. Leave ten. Ten's romantic.", r: "Ten is very romantic. Okay, ten. The bakery one stays, it's my favourite. Sit with me." },
        { tone: 'flirty', t: "Leave them. I'll keep an eye on them. And on you.", r: "On me? Both eyes, please. I've dressed up for a sofa night. That's a big deal. Look at me." },
      ] },
      { tone: 'passive', t: "It smells amazing in here.", r: "That's the bakery one. It's called Midnight Croissant. I bought it for the name. Sit. Shoes off.", opts: [
        { tone: 'cold', t: "I'm too tired for a big night.", r: "Who said big night? I said candles! A tiny night. ...Fine. You sleep. I'll sit here and glow." },
        { tone: 'passive', t: "Midnight Croissant. Is there a real croissant?", r: "There are four. I ate one. So, three. I'm sharing them very reluctantly." },
        { tone: 'flirty', t: "Not as amazing as you look by candlelight.", r: "Candlelight's my best light! Sit closer. I want to see if you look good in it too. ...You do. Unfair." },
        { tone: 'risque', t: "Blow most of them out. We won't need the light.", r: "Won't need the light? Oh, I like where this is going. I'll keep one. The croissant one. For the mood." },
      ] },
      { tone: 'flirty', t: "Not too much. Just enough. Like you.", r: "Just enough? I'm never just enough! I'm extra, always. Still, I accept. Come here, you smooth thing.", opts: [
        { tone: 'cold', t: "Okay, maybe too much.", r: "Oh. You had me all melty and then you said that. I'm a candle that's just been blown out." },
        { tone: 'passive', t: "So what's the plan for tonight?", r: "No plan. Sofa, croissants, a film I'll talk over, and you falling asleep on my shoulder. Bliss." },
        { tone: 'flirty', t: "Come here yourself. I've missed you all week.", r: "All week? I've missed you since you left this morning. Is that bad? Shh. Just hold on to me." },
        { tone: 'risque', t: "Forget the film. Let's skip to the good part.", r: "The good part? Ooh. Film's off, croissants can wait, the candles can mind themselves. Come here, trouble." },
      ] },
      { tone: 'risque', t: "Forty candles and you. I'm not leaving this flat till Monday.", r: "Monday? It's Thursday! ...I can make Monday work. I've got croissants for days. Two days. Barely.", opts: [
        { tone: 'cold', t: "I'm joking. I've got the sim tomorrow.", r: "The sim. Of course. Monday's cancelled. Go to bed early. I'll eat the croissants alone, by candlelight." },
        { tone: 'passive', t: "We'll need more croissants.", r: "I'll order more. I'll order a whole bakery. Everything's on the table this weekend. Except the candles." },
        { tone: 'flirty', t: "Two days of just you sounds perfect.", r: "Just me. No team, no phone, no paddock. You'll get sick of me. You won't. Nobody does." },
        { tone: 'risque', t: "Then turn your phone off and lock the door.", r: "Phone off. Door locked. Candles staying. Oh, this is the best plan you've ever had. Kiss me." },
      ] },
    ],
  },
];
