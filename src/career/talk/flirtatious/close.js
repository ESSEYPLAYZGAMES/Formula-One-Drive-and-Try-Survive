// FLIRTATIOUS - in person, stage 'close' (dating: the blush scoreboard, missing you, heat, the rule they broke). Slots 1-9 x mood.
// Plain data, no imports.
export const DATA = [
  // ==== slot 1: officially together - "I've never been anyone's actual person" ====
  {
    id: 'flirtatious-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "So. We're officially a thing, and you've already gone frosty on me. Lovely start. I'm still yours, annoyingly. Make it worth it.",
    opts: [
      { tone: 'cold', t: "Don't be dramatic.", r: "Dramatic is my love language. One of them. You're speaking the other one very badly right now.", opts: [
        { tone: 'cold', t: "Then stop talking.", r: "Stopping. Sulking. Being yours from a distance. It's very unsatisfying. Well done." },
        { tone: 'passive', t: "Sorry. Long week. I'm glad we're a thing.", r: "Glad. Good. I'll take glad. I'll upgrade it to thrilled by Sunday." },
        { tone: 'flirty', t: "Come here and be dramatic at me properly.", r: "Properly. Mm. That's the spirit. Lean in, Trouble. Let me remind you why you said yes." },
      ] },
      { tone: 'passive', t: "I'm still getting used to it.", r: "So am I. I've never been anyone's actual person. I keep checking it's real. It's mortifying.", opts: [
        { tone: 'cold', t: "Maybe it isn't real.", m: -4, r: "Ouch. That one went in deep. ...I'll pretend you didn't say it. Don't say it again." },
        { tone: 'passive', t: "It's real.", r: "It's real. Okay. Say it once a day. I'm a slow learner with this one." },
        { tone: 'flirty', t: "It's very real. Want proof?", r: "Proof. Yes. Always. Bring it in person. I'll check it thoroughly." },
        { tone: 'risque', t: "Let me spend tonight proving it.", r: "All night? Mm. Thorough. I like thorough. Bring your evidence and your toothbrush." },
      ] },
      { tone: 'flirty', t: "Worth it? I'm going to spoil you rotten.", r: "Rotten. Mm. Promise? Nobody's ever spoiled me. They usually just admire me and leave.", opts: [
        { tone: 'cold', t: "Don't expect too much.", r: "Too late. I expect everything. Fine. I'll spoil myself. In front of you. Pointedly." },
        { tone: 'passive', t: "I'm staying put this time.", r: "This time. And next time. I'll be keeping a list. It's a short list. You're on it." },
        { tone: 'flirty', t: "Admire you, stay, and spoil you.", r: "All three. Greedy. In my direction. That's my favourite kind of greedy." },
        { tone: 'risque', t: "Starting tonight. Breakfast in bed included.", r: "Breakfast in bed. I'm awful at mornings - but I'd make an exception. Don't burn anything." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "I woke up thinking about you. Rude, frankly. I don't wake up thinking about anyone. I've never been anyone's actual person before.",
    opts: [
      { tone: 'cold', t: "It'll wear off.", r: "Will it. Mm. Romantic. I'll wait for it to wear off, then. Don't hold your breath.", opts: [
        { tone: 'cold', t: "I won't hold it.", r: "No, you won't. Fine. Tomorrow I'll wake up thinking about breakfast instead." },
        { tone: 'passive', t: "Sorry. I'm bad at this too.", r: "Are you? Oh, good. Two people bad at this. We'll muddle through. Beautifully." },
        { tone: 'flirty', t: "I hope it never wears off.", r: "Never. Mm. That's a long time. I'm suddenly fine with long times." },
      ] },
      { tone: 'passive', t: "What were you thinking?", r: "That I'd text you. Then I didn't. Then I stared at the ceiling, smiling. Mortifying.", opts: [
        { tone: 'cold', t: "That's a bit much.", r: "Everything about me is a bit much. You picked it. Live with it. Or don't." },
        { tone: 'passive', t: "That's sweet.", r: "It's not sweet. It's a crisis. A lovely one. You're the crisis." },
        { tone: 'flirty', t: "Text me next time. I'll be smiling too.", r: "Will you? Mm. Then I'll text you at six. I've never seen six. I'll see it for you." },
        { tone: 'risque', t: "Next time, wake up next to me instead.", r: "Next to you. Mm. I'd have to be up early. I'd wake you very slowly, to make it fair." },
      ] },
      { tone: 'flirty', t: "Good. I woke up thinking about you too.", r: "Did you. Mm. Then we're both doomed. Stay doomed with me, Trouble.", opts: [
        { tone: 'cold', t: "Only for a second.", r: "One second. I had a whole morning. Uneven. Fine. I'll be doomed alone." },
        { tone: 'passive', t: "Happily doomed.", r: "Happily doomed. Put it on a cushion. Vivi would." },
        { tone: 'flirty', t: "Doomed together. Sounds perfect.", r: "Perfect. Mm. You keep saying perfect things. I'm not used to being the one blushing." },
        { tone: 'risque', t: "Then wake up with me tomorrow.", r: "Tomorrow. Mm. My place. Lights low tonight. And no alarm. Not ever." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "Look at us. Officially together. I keep saying 'my person' to the mirror. I'm a disgrace, Trouble. Kiss me so I stop talking.",
    opts: [
      { tone: 'cold', t: "Not here.", r: "Not here. Spoilsport. Fine. I'll keep talking. Forever. About you. In public.", opts: [
        { tone: 'cold', t: "Please don't.", r: "Please don't. Fine. Mouth shut. Hands to myself. Deeply, publicly sulking." },
        { tone: 'passive', t: "Somewhere quieter. I promise.", r: "Quieter. You promised. I'm writing it down. In ink. On my wrist." },
        { tone: 'flirty', t: "Fine. One. Quickly.", r: "One. Quickly. ...That wasn't quick. You lied. I love it." },
      ] },
      { tone: 'passive', t: "My person. I like that.", r: "Do you? I've never said it out loud to anyone. It feels like a tooth I keep poking.", opts: [
        { tone: 'cold', t: "Bit soppy.", r: "It is soppy. I'm soppy now. You did that. Deal with it. From over there, apparently." },
        { tone: 'passive', t: "Say it again.", r: "My person. ...Okay. It's getting easier. Don't make me say it in front of Vivi." },
        { tone: 'flirty', t: "You're my person too. Officially.", r: "Officially. Mm. Then I'm putting you on the guest list for everything. Permanently." },
        { tone: 'risque', t: "Say it again. Slowly. Somewhere private.", r: "Somewhere private. Mm. I'll say it a lot of ways there. You'll lose count." },
      ] },
      { tone: 'flirty', t: "Kiss you to shut you up? Gladly.", r: "Gladly. Mm. ...See? Quiet. Completely quiet. You're the only one who's ever managed that.", opts: [
        { tone: 'cold', t: "That's enough for now.", r: "For now. Fine. I'll be quiet in a corner, thinking about it. Loudly." },
        { tone: 'passive', t: "Better?", r: "Much better. Infinitely better. Now I'm not talking, I'm just smiling stupidly." },
        { tone: 'flirty', t: "Shall I keep you quiet a bit longer?", r: "Longer. Yes. Much longer. I've got nowhere to be. Ever again." },
        { tone: 'risque', t: "Keep talking. I'll keep shutting you up.", r: "Then I'll never stop. Mm. Two more words, Trouble: my place." },
      ] },
      { tone: 'risque', t: "Kiss you? I'll take you home and keep you speechless.", r: "Speechless. Mm. Big claim, for someone who's met me. Take me home and try.", opts: [
        { tone: 'cold', t: "Actually, let's just get dinner.", r: "Dinner. Of course. Spoken like someone very afraid of me. Fine. Starters." },
        { tone: 'passive', t: "After dinner.", r: "After dinner. Fine. I'll be eating very, very quickly." },
        { tone: 'flirty', t: "Challenge accepted.", r: "Accepted. Mm. I'll talk all the way home. You'll have work to do." },
        { tone: 'risque', t: "Speechless till morning.", r: "Till morning. Mm. Then fade out, Trouble. I'll find my words again at noon." },
      ] },
    ],
  },
  // ==== slot 2: the blush scoreboard - who made whom blush (an in-joke from here on) ====
  {
    id: 'flirtatious-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "I've started a scoreboard: who made whom blush. You're winning, which annoys me. And you were frosty. Minus one, Trouble.",
    opts: [
      { tone: 'cold', t: "Childish.", r: "Childish? It's a sport. I'm very competitive. Fine. Minus two. You're losing now.", opts: [
        { tone: 'cold', t: "Don't care.", r: "You don't care. Minus three. I'll be over here winning by default. Unbearably." },
        { tone: 'passive', t: "Okay, what's the score?", r: "Seven to five. You. I've never been behind on anything. It's humiliating. I love it." },
        { tone: 'flirty', t: "Watch me win it back.", r: "Win it back? Mm. Go on. Make me blush. ...Dammit. Seven to six." },
      ] },
      { tone: 'passive', t: "Who's counting?", r: "Me. Obviously. Seven to five. To you. I'm not used to blushing, Trouble. I want a rematch.", opts: [
        { tone: 'cold', t: "Rematch denied.", r: "Denied? You can't deny a rematch. That's... fine. I'll sulk. Visibly. Pink." },
        { tone: 'passive', t: "How do you score it?", r: "One point per blush. Two if it's in public. Three if Vivi sees. Nobody's scored a three yet." },
        { tone: 'flirty', t: "You're blushing now. Eight.", r: "I am not. ...Eight. Fine. Eight. Stop looking at me." },
        { tone: 'risque', t: "Let me get to ten tonight.", r: "Ten. Tonight. Mm. You'd need to work very hard. I'd let you." },
      ] },
      { tone: 'flirty', t: "Minus one? I'll earn it back.", r: "Earn it. Go on. You've got about ten seconds before I decide to sulk properly.", opts: [
        { tone: 'cold', t: "Not playing.", r: "Not playing. You're forfeiting. Minus two. And I'm sulking properly now." },
        { tone: 'passive', t: "You look lovely today.", r: "Oh. Simple. Sneaky. ...Plus one. Don't you dare look smug." },
        { tone: 'flirty', t: "You're the most gorgeous thing in any room.", r: "Plus two. Stop. I'm blushing. That's a point. Stop scoring!" },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Confession: I keep a scoreboard. Who made whom blush. You're winning seven to four. Nobody's ever been ahead of me, Trouble.",
    opts: [
      { tone: 'cold', t: "Bit sad to keep score.", r: "Sad? It's tender. Competitively tender. Fine. You're winning anyway. Minus one for 'sad.'", opts: [
        { tone: 'cold', t: "Whatever.", r: "'Whatever.' Minus two. I'll catch up. I'm very motivated by spite." },
        { tone: 'passive', t: "Okay, it's a bit cute.", r: "Cute. That's a blush. Plus one to you. You're cheating by being nice." },
        { tone: 'flirty', t: "Fine. Let me score again.", r: "Go on. I'm braced. ...Oh, don't look at me like that. Eight." },
      ] },
      { tone: 'passive', t: "Seven? When did I score seven?", r: "Dinner. The car park. The thing you said on the phone. I don't blush, Trouble. Except at you.", opts: [
        { tone: 'cold', t: "Sounds made up.", r: "Made up? I have dates and times. Fine. I'll keep the evidence to myself." },
        { tone: 'passive', t: "Which was the best one?", r: "The phone one. You said goodnight like you meant it. I hid under a pillow. Don't tell anyone." },
        { tone: 'flirty', t: "Let me make it eight.", r: "Make it eight. ...Oh, you only had to smile. That's unfair. Eight." },
        { tone: 'risque', t: "I'll take it to double figures tonight.", r: "Double figures. Mm. Brave. I'll lose on purpose. Several times." },
      ] },
      { tone: 'flirty', t: "Seven to four? I'm just getting started.", r: "Just getting started. Mm. That's terrifying. Do your worst. I'm ready. I'm not ready.", opts: [
        { tone: 'cold', t: "Actually, I'll give you a break.", r: "A break? From winning? Minus one for mercy. I don't do mercy, Trouble." },
        { tone: 'passive', t: "Tell me how to score a point.", r: "Be honest at me. That's the trick. Nobody's honest at me. Except you." },
        { tone: 'flirty', t: "You're blushing already. Eight.", r: "Am not. ...Am. Eight. You haven't even said anything. Unbelievable." },
        { tone: 'risque', t: "Then let me score where nobody can see.", r: "Where nobody can see. Mm. I'll keep a separate scoreboard for that. Private." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "I keep a scoreboard now: who's made whom blush. You lead seven to five. I'm planning a comeback. Brace yourself, Trouble.",
    opts: [
      { tone: 'cold', t: "I'll pass on the game.", r: "You'll pass. Then I win by forfeit. That's the worst way to win. Thanks.", opts: [
        { tone: 'cold', t: "Take the win.", r: "Taken. Hollowly. Unsatisfyingly. Seven to six, and I hate it." },
        { tone: 'passive', t: "Okay, go on. Comeback.", r: "Right. Ahem. You look very good when you're concentrating. ...Why am I the one blushing?" },
        { tone: 'flirty', t: "Fine. I'm braced.", r: "Braced. Mm. ...Your eyes are distracting me. Oh no. That's a blush. Eight to you." },
      ] },
      { tone: 'passive', t: "What counts as a blush?", r: "Anything pink. Ears count. My grandmother Vivi says ears are the most honest part of a person.", opts: [
        { tone: 'cold', t: "Mine don't blush.", r: "They're pink right now. Liar. Fine. I won't count it. I'm generous. Seven to five." },
        { tone: 'passive', t: "So you're watching my ears.", r: "Constantly. It's a whole hobby. Don't be weird about it." },
        { tone: 'flirty', t: "Watch them now.", r: "...Pink. Eight to you. No. Wait. That's mine going pink. Seven to six." },
        { tone: 'risque', t: "Make me blush everywhere, then.", r: "Everywhere. Mm. You're asking for a long night of scoring, Trouble. I accept." },
      ] },
      { tone: 'flirty', t: "Comeback? You'll have to work for it.", r: "Work for it. Mm. Watch. ...You're gorgeous when you're winning. There. Blush. Seven to six.", opts: [
        { tone: 'cold', t: "Didn't blush.", r: "You did. It's on the scoreboard. In pen. You can appeal in writing." },
        { tone: 'passive', t: "Okay, that one was good.", r: "Good? It was devastating. I'm back in it. Watch yourself." },
        { tone: 'flirty', t: "Seven to six. Now watch me.", r: "...Oh, that's cruel. You just looked at me. That's all. Eight to six." },
        { tone: 'risque', t: "Let's settle it somewhere private.", r: "Private. Mm. No referee. No witnesses. I'll still cheat." },
      ] },
      { tone: 'risque', t: "Come home with me and we'll see who blushes.", r: "Come home with you. Mm. That's a three-pointer, Trouble. And you know it.", opts: [
        { tone: 'cold', t: "Kidding.", r: "Kidding. Minus one. You've just teased the scoreboard. That's a foul." },
        { tone: 'passive', t: "Tomorrow, maybe.", r: "Tomorrow. I'll warm up. Stretch. Practise not blushing. It won't help." },
        { tone: 'flirty', t: "Three points. Then let's go for more.", r: "More. Greedy. The scoreboard isn't built for this. We'll need a bigger one." },
        { tone: 'risque', t: "Lights off. No scoreboard. No rules.", r: "No scoreboard. Mm. Then we both win. Fade out, Trouble." },
      ] },
    ],
  },
  // ==== slot 3: you've been away - they counted the days, and they never count ====
  {
    id: 'flirtatious-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "You were away eleven days and you barely called. I counted. I never count. I'm furious. I missed you. Both. Deal with it.",
    opts: [
      { tone: 'cold', t: "I was racing. I was busy.", r: "Busy. Again. Everyone's busy. I made time to miss you. It's exhausting.", opts: [
        { tone: 'cold', t: "That's not my fault.", r: "No. It's mine, for caring. I'll stop. Watch me stop. ...Not yet. But soon." },
        { tone: 'passive', t: "I know. I'm sorry. It was the same for me.", r: "Did you. Then say it more. In the middle of the night. I'm awake anyway." },
        { tone: 'flirty', t: "I missed you every night.", r: "Every night. Mm. Then call me every night. I'll answer in my most dangerous voice." },
      ] },
      { tone: 'passive', t: "Eleven days? I missed you too.", r: "Did you? You hid it brilliantly. I danced alone in the kitchen to the slow song. Twice. Pathetic.", opts: [
        { tone: 'cold', t: "That's quite tragic.", r: "It was very tragic. I was magnificent and sad. You missed both. Your loss." },
        { tone: 'passive', t: "Next time I'll call more.", r: "You will. I'll make sure. I'll text you photos of your empty side of the sofa." },
        { tone: 'flirty', t: "Dance with me now. Make up for it.", r: "Now? Here? ...Fine. Sway. Slowly. Mm. Eleven days forgiven. Nearly." },
        { tone: 'risque', t: "Let me make up for all eleven tonight.", r: "All eleven. That's a lot of nights in one. I hope you're well rested." },
      ] },
      { tone: 'flirty', t: "You counted? That's adorable.", r: "It's not adorable. It's a symptom. I've caught something and its name is you.", opts: [
        { tone: 'cold', t: "Get over it.", r: "Get over it. Mm. Cold. Fine. I'll get over it. In about a hundred years." },
        { tone: 'passive', t: "I'll try not to be gone so long.", r: "Try. Mm. I'll take try. I'll also take you, now, for at least an hour." },
        { tone: 'flirty', t: "Catch it worse. I'm staying.", r: "Worse. Mm. I'm already a lost cause. ...Don't laugh. It's a compliment." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "Embarrassing confession: when you're away I sleep on your side. It smells like you. I've never done that for anyone, Trouble.",
    opts: [
      { tone: 'cold', t: "That's a bit weird.", r: "It's not weird. It's love-adjacent. Fine. I'll sleep in the middle. Pointedly.", opts: [
        { tone: 'cold', t: "Whatever helps.", r: "Whatever helps. Wow. I'll put that on a pillow. A cold one." },
        { tone: 'passive', t: "Okay. It's a bit sweet.", r: "A bit. Thank you. I'll be sweet in private. It's safer." },
        { tone: 'flirty', t: "I steal your pillow too, when I can.", r: "Do you? Mm. Then we're both disgusting. I've never been happier." },
      ] },
      { tone: 'passive', t: "I miss you when I'm away too.", r: "Do you? You never say. You just text 'landed.' Landed! I want paragraphs, Trouble.", opts: [
        { tone: 'cold', t: "I'm not a paragraph person.", r: "No. You're a full-stop person. I'll do the paragraphs for both of us." },
        { tone: 'passive', t: "I'll write you paragraphs.", r: "Promise? Long ones. With feelings in. I'll read them in the bath." },
        { tone: 'flirty', t: "Landed. Missed you. Coming straight to you.", r: "That's three sentences. Look at you. Paragraph-adjacent. Come straight to me, then." },
        { tone: 'risque', t: "I'll text you a paragraph about what I'll do when I'm back.", r: "Mm. Send it. Then don't. I'd rather hear it whispered. Late. In person." },
      ] },
      { tone: 'flirty', t: "My side? Then you'd better keep it warm.", r: "Warm. Mm. It's the warmest it's ever been. Come home and check.", opts: [
        { tone: 'cold', t: "I'll be late tonight.", r: "Late. Fine. I'll keep it warm and then be cross. Equal measures." },
        { tone: 'passive', t: "I'll be home Sunday.", r: "Sunday. I'll count the hours. Ugh. I count things now. You did this." },
        { tone: 'flirty', t: "Keep it warm for me.", r: "Always. Mm. I'll be in the middle when you get back. You'll have to negotiate." },
        { tone: 'risque', t: "Keep it warm. I'll make it warmer.", r: "Warmer. Mm. Come home, then. I'll be waiting in the dark. Fade out, Trouble." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "You've been gone forever, Trouble. Ten days. Forever. Come here. I missed you in ways I can't say in public.",
    opts: [
      { tone: 'cold', t: "It was only ten days.", r: "Only ten. You'd say 'only' about a fire. Fine. I missed you. You apparently didn't.", opts: [
        { tone: 'cold', t: "I was focused.", r: "Focused. On everything but me. Fine. I'll focus on someone grateful. My balcony. My plants." },
        { tone: 'passive', t: "I missed you. I'm just bad at saying it.", r: "Then show me. That's easier. Start with a hug. A long one." },
        { tone: 'flirty', t: "Ten days of wanting you. Better?", r: "Better. Much. Say it slower and I'll forget the ten days entirely." },
      ] },
      { tone: 'passive', t: "Ten days is a lot. Same here.", r: "It's a lot. I hated it. I'm not built for missing people. I'm built for being missed.", opts: [
        { tone: 'cold', t: "It gets easier.", r: "Easier. I don't want to get used to it. I want you here. Never mind." },
        { tone: 'passive', t: "Next time come with me.", r: "Come with you? To {track}? ...Don't tempt me. I'll pack tonight." },
        { tone: 'flirty', t: "Let me make you feel missed now.", r: "Now. Mm. I feel missed. Very. Keep going." },
        { tone: 'risque', t: "Whisper the things you can't say in public.", r: "Come closer. ...Mm. That's the tamest one. The rest need a locked door." },
      ] },
      { tone: 'flirty', t: "Ways you can't say in public? Say them in private.", r: "In private. Oh, I will. In detail. You'll want to sit down for it.", opts: [
        { tone: 'cold', t: "Later. I'm tired.", r: "Tired. After ten days. Fine. I'll whisper at the ceiling instead." },
        { tone: 'passive', t: "Tonight, then.", r: "Tonight. My place. I'll put the slow record on and tell you all of it." },
        { tone: 'flirty', t: "I'll sit down. You come closer.", r: "Closer. Mm. ...You missed me too. I can tell. Your ears are pink. Point to me." },
        { tone: 'risque', t: "Show me instead of saying.", r: "Show you. Mm. Come home. Door shut. Lights low. I'll show you all ten days." },
      ] },
      { tone: 'risque', t: "Take me home and miss me properly.", r: "Properly. Mm. I've had ten days to plan it. You won't sleep, Trouble.", opts: [
        { tone: 'cold', t: "Actually, I need sleep.", r: "Sleep. After ten days. Wow. Fine. Sleep. I'll lie there missing you, right beside you. Loudly." },
        { tone: 'passive', t: "Home first. Then we'll see.", r: "We'll see. Mm. We both know what we'll see. Come on. Home." },
        { tone: 'flirty', t: "I don't need sleep. I need you.", r: "Need. Mm. That's my favourite word from you. Let's go." },
        { tone: 'risque', t: "No sleep. Just you. Fade to black.", r: "Fade to black. Mm. I'll lock the door. You turn off the lights. Welcome home." },
      ] },
    ],
  },
  // ==== slot 4: jealousy - "I don't get jealous. So what is this?" ====
  {
    id: 'flirtatious-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "Someone had a hand on your arm for ten whole seconds the other night. I counted. I don't get jealous. So what is this burning?",
    opts: [
      { tone: 'cold', t: "You're being ridiculous.", r: "I'm being ridiculous. Yes. Thank you for confirming. It doesn't stop the burning, Trouble.", opts: [
        { tone: 'cold', t: "Then deal with it.", r: "Deal with it. Mm. I will. Coldly. Far away. With very good posture." },
        { tone: 'passive', t: "It meant nothing. Honestly.", r: "Honestly. Okay. I believe you. I hate that it bothered me. That's new." },
        { tone: 'flirty', t: "It's cute. You're cute jealous.", r: "Cute. I'm not cute. I'm smouldering. ...With jealousy. Fine. Cute. Kiss me." },
      ] },
      { tone: 'passive', t: "It was just a fan. It's nothing.", r: "I know it's nothing. My chest didn't get the memo. I've never been jealous. I don't like it.", opts: [
        { tone: 'cold', t: "Comes with the job.", r: "Your job. Fine. My job is pretending it doesn't sting. I'm very professional." },
        { tone: 'passive', t: "You don't need to be. I'm yours.", r: "Yours. Say it again. Slowly. ...Okay. The burning's stopped. Mostly." },
        { tone: 'flirty', t: "Jealous looks good on you.", r: "It looks fantastic on me. Feels terrible, though. Make it up to me." },
        { tone: 'risque', t: "Come home and I'll prove whose I am.", r: "Prove it. Mm. Thoroughly. Repeatedly. I'm very hard to convince tonight." },
      ] },
      { tone: 'flirty', t: "Ten seconds? You counted?", r: "Of course I counted. I count everything about you now. It's a sickness. You did this.", opts: [
        { tone: 'cold', t: "Stop counting.", r: "Stop counting. Fine. I'll guess. I'll guess high. You won't like it." },
        { tone: 'passive', t: "Okay. I'll keep my arms to myself.", r: "Not to yourself. To me. That's the correction. Thank you." },
        { tone: 'flirty', t: "Count how long I spend on you instead.", r: "Oh, I will. I'll need a much bigger number. Start now." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "I'll be honest. Someone was all over you after the race and I wanted to throw something. I don't get jealous, Trouble. Help.",
    opts: [
      { tone: 'cold', t: "You don't own me.", r: "I know I don't. I never wanted to own anyone. I just want to be the one you leave with.", opts: [
        { tone: 'cold', t: "Then don't act like it.", r: "Noted. Hands off. Heart... also off. Somewhere. I'll find it later." },
        { tone: 'passive', t: "You are the one I leave with.", r: "I am. Okay. Breathing. I just needed to hear that out loud." },
        { tone: 'flirty', t: "Always. Every time.", r: "Every time. Mm. That fixes everything. Mostly. Kiss me and it fixes the rest." },
      ] },
      { tone: 'passive', t: "It was nothing. I promise.", r: "I know. I believe you. It's me who's broken. I've caught feelings and they have teeth.", opts: [
        { tone: 'cold', t: "Not my problem.", r: "No. It's mine. I'll handle it. Gracefully. Badly. Alone." },
        { tone: 'passive', t: "Feelings with teeth. That's new for you.", r: "Very new. I used to be the one with teeth. Now I'm the one getting bitten." },
        { tone: 'flirty', t: "Bite me, then. Get it out of your system.", r: "Mm. Tempting. Not here. Later, though. I'll get very thoroughly out of my system." },
        { tone: 'risque', t: "Let me take your mind off it. Tonight.", r: "Tonight. Mm. Take my mind off it. Then off everything else. Improvise." },
      ] },
      { tone: 'flirty', t: "You're jealous? Best news I've had all week.", r: "Best news? It's terrible news. I'm a disaster, Trouble. A gorgeous, green disaster.", opts: [
        { tone: 'cold', t: "Disaster's a strong word.", r: "It's the right word. I'll be a disaster somewhere quieter. Without you." },
        { tone: 'passive', t: "You're allowed to feel it.", r: "Allowed. Am I. Okay. I'm feeling it. It's horrible. Hold my hand while I do." },
        { tone: 'flirty', t: "I'll make sure you never need to be.", r: "Never. Mm. That's a lovely promise. Keep looking at me like that and I'll believe it." },
        { tone: 'risque', t: "Come home and I'll make you forget anyone else exists.", r: "Forget anyone else. Mm. You'd have to be very convincing. All-night convincing." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "Someone flirted with you tonight and I watched. My heart went green, Trouble. I didn't know it could. Make it go back.",
    opts: [
      { tone: 'cold', t: "Not my job to fix.", r: "Not your job. Nothing's your job tonight. Fine. I'll go green alone.", opts: [
        { tone: 'cold', t: "Go green, then.", r: "Green, cross and gorgeous. Over there. Not looking at you. Constantly looking at you." },
        { tone: 'passive', t: "Sorry. It was nothing.", r: "Nothing. Okay. My heart's arguing. It'll calm down. Give it a minute." },
        { tone: 'flirty', t: "Come here. I'll fix it.", r: "Fix it, then. ...Mm. Colour's coming back. Do that again." },
      ] },
      { tone: 'passive', t: "It was nothing. I only see you.", r: "Only me. Mm. Say it once more. Slower. I need it to sink in.", opts: [
        { tone: 'cold', t: "I've said it once.", r: "Once. Once is a lot for you. I'll take once. Grumpily." },
        { tone: 'passive', t: "Only you. Every time.", r: "Every time. Okay. Green fading. Pink arriving. That's a point to you, by the way." },
        { tone: 'flirty', t: "Only you. And I'll keep saying it.", r: "Keep saying it. Forever. Well. Until morning. Then again after breakfast." },
        { tone: 'risque', t: "Only you. And tonight I'll prove it.", r: "Prove it. Mm. I'll need a lot of proof. An unreasonable amount. All night." },
      ] },
      { tone: 'flirty', t: "Green suits you. But I'll make it go back.", r: "How? Show me. I'm very curious and very jealous and very, very yours.", opts: [
        { tone: 'cold', t: "Later.", r: "Later. You keep saying later. Later's where I live now. Fine." },
        { tone: 'passive', t: "Like this. A hug. A long one.", r: "Long. Longer. ...Okay. Green gone. You're good at this. Annoyingly." },
        { tone: 'flirty', t: "By reminding you who I go home with.", r: "Me. You go home with me. Mm. Say it again on the way home." },
        { tone: 'risque', t: "By taking you home right now.", r: "Now. Yes. Mm. Green's gone. Everything's going red. Let's go." },
      ] },
      { tone: 'risque', t: "Let me kiss the jealousy right out of you.", r: "Kiss it out. Mm. It's very stubborn, my jealousy. You'll need several attempts.", opts: [
        { tone: 'cold', t: "One attempt. That's it.", r: "One. ...Ugh. It worked. I hate that it worked. I'm still sulking, on principle." },
        { tone: 'passive', t: "As many as it takes.", r: "That's the most romantic thing anyone's said to me in public." },
        { tone: 'flirty', t: "Starting now. Hold still.", r: "Holding still. ...Mm. Again. I'm still slightly green. There. Gone." },
        { tone: 'risque', t: "Then let me take you home and kiss the rest away.", r: "The rest. Mm. Let's go. Right now. I'll be quiet in the car. Barely." },
      ] },
    ],
  },
  // ==== slot 5: tenderness - you've seen them without the show; Vivi wants to meet you ====
  {
    id: 'flirtatious-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "You've seen me without the show now. Morning hair. No lines. And then you went frosty. It's not fair, Trouble. I'm unarmoured.",
    opts: [
      { tone: 'cold', t: "You're overthinking it.", r: "Am I? You know my morning face and my burnt toast. And you're frosty. I'm thinking exactly enough.", opts: [
        { tone: 'cold', t: "Then stop.", r: "Stop thinking. Sure. Armour back on. It doesn't fit anymore, you know. You did that." },
        { tone: 'passive', t: "Sorry. I didn't mean to be cold.", r: "I know. I just feel everything now. It's terribly inconvenient. Hug me." },
        { tone: 'flirty', t: "I love the morning hair.", r: "You love the morning hair. Oh. Okay. It's staying. Forever. Ugh. Thank you." },
      ] },
      { tone: 'passive', t: "I like you without the show.", m: 2, r: "Do you? Most people want the show. You keep asking for the quiet. I don't know what to do with that.", opts: [
        { tone: 'cold', t: "Don't make it a big deal.", r: "It is a big deal. To me. Fine. I'll make it a small deal. A tiny, secret, enormous deal." },
        { tone: 'passive', t: "You don't have to do anything with it.", r: "Don't I? ...Okay. I'll just keep it. Like your sunglasses. Did I ever give those back?" },
        { tone: 'flirty', t: "Give it to me. I'll keep it safe.", r: "Keep it safe. Mm. Then I'll give you the quiet. And the snort-laugh. Lucky you." },
        { tone: 'risque', t: "No show. No armour. Just you, in my shirt, on a Sunday.", r: "In your shirt. On a Sunday. Mm. That's the most dangerous thing anyone's ever offered me." },
      ] },
      { tone: 'flirty', t: "Unarmoured looks good on you.", r: "Don't. I'm trying to be cross. You're making it very hard with that face.", opts: [
        { tone: 'cold', t: "Be cross, then.", r: "I will. For four minutes. Then I'll forgive you. I'm weak now. It's appalling." },
        { tone: 'passive', t: "I'll wait till you're done being cross.", r: "Done. That was quick. You're very good at waiting. I'm very bad at being cross with you." },
        { tone: 'flirty', t: "Be cross in my arms.", r: "In your arms. Mm. Fine. I'm very cross. I'm staying here. Crossly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "My grandmother Vivi wants to meet you. Properly. Tea, cards, interrogation. I've never brought anyone to Vivi, Trouble. Ever.",
    opts: [
      { tone: 'cold', t: "That's a big step.", r: "It is. I know. If you're not ready, say. I'd rather know now than at her door.", opts: [
        { tone: 'cold', t: "I'm not ready.", r: "Okay. Thanks for being straight with me. I'll tell her next year. Or never. Fine." },
        { tone: 'passive', t: "I'm nervous, but yes.", r: "Nervous is fine. She'll eat you alive and then knit you a scarf. That's how she loves." },
        { tone: 'flirty', t: "Big steps are my thing.", r: "On track. Off track you hesitate. But you're not hesitating now. Oh. Okay. Wow." },
      ] },
      { tone: 'passive', t: "I'd love to meet her.", m: 2, r: "You would? ...Okay. She cheats at cards. She'll ask about your intentions. Lie beautifully.", opts: [
        { tone: 'cold', t: "Let's keep it short.", r: "Short. She'll hate that. So do I. Fine. One cup of tea. One interrogation." },
        { tone: 'passive', t: "What are my intentions?", r: "To make me laugh. To stay for the encore. To keep me up too late. I'm told they're good." },
        { tone: 'flirty', t: "I'll charm her. Then her grandchild.", r: "Already charmed, the grandchild. Thoroughly. She'll be easier. She likes a rogue." },
        { tone: 'risque', t: "I'll tell her my intentions are thoroughly improper.", r: "Improper. Mm. She'll laugh till she wheezes. Then she'll ask for details. Don't give her any." },
      ] },
      { tone: 'flirty', t: "Ever? I'm honoured. And terrified.", r: "Be both. She's had three husbands and she grades all my choices. You'll score high.", opts: [
        { tone: 'cold', t: "Can we wait a bit?", r: "Wait a bit. Okay. I'll tell her you're shy. She won't believe it. Nobody would." },
        { tone: 'passive', t: "Any tips?", r: "Compliment her waltzing. Lose at cards. Look at me the way you do. She'll see it." },
        { tone: 'flirty', t: "I'll look at you like that all afternoon.", r: "All afternoon. She'll swoon. I'll swoon. We'll need a lie-down. Separately." },
        { tone: 'risque', t: "And afterwards I'm taking you home.", r: "Afterwards. Mm. Tea, cards, then you. In that order. Vivi would approve. Quietly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "You've seen me without the show, Trouble. Burnt toast, no lines, my snort-laugh. And you're still here. Nobody's ever stayed for that.",
    opts: [
      { tone: 'cold', t: "Don't make a speech.", r: "No speech. Fine. Bullet points: you stayed, I'm terrified, I'm happy. There.", opts: [
        { tone: 'cold', t: "Okay. Thanks.", r: "'Okay, thanks.' Romance is on mute tonight. I'll turn it up later." },
        { tone: 'passive', t: "You don't have to be terrified.", r: "I do. It's new. It'll settle. Stay close while I do." },
        { tone: 'flirty', t: "Happy's my favourite bullet point.", r: "Mine too. Don't tell anyone. My reputation's in pieces." },
      ] },
      { tone: 'passive', t: "I like the real you best.", m: 2, r: "Best. Not just 'also.' Best. ...Oh. Trouble. I need to stand somewhere you can't see my face.", opts: [
        { tone: 'cold', t: "Don't be dramatic about it.", r: "I'm always dramatic. This is the quietest I've ever been. Fine. I'm composed." },
        { tone: 'passive', t: "Stand here. I'll look away.", r: "You'll look away? You never look away. ...That's how I know you mean it." },
        { tone: 'flirty', t: "I want to see your face. Especially now.", r: "Now. It's doing something soft and stupid. Look, then. Only you." },
        { tone: 'risque', t: "Show me the real you all night.", r: "All night. Mm. Including the snort. And other things. Lights low, Trouble." },
      ] },
      { tone: 'flirty', t: "Still here. Not going anywhere.", r: "You keep saying it like it's easy. It's the hardest thing anyone's ever done for me.", opts: [
        { tone: 'cold', t: "It's not that hard.", r: "Not for you. For me it's everything. Never mind. You wouldn't understand. Yet." },
        { tone: 'passive', t: "It's easy with you.", r: "Easy. With me. That's a first. I'm a lot. You make it sound like a little." },
        { tone: 'flirty', t: "You're worth staying for.", r: "Worth it. Mm. Write that down. I'll read it at two a.m. when I'm being silly." },
        { tone: 'risque', t: "I'm staying. Tonight and every night.", r: "Every night. Then I'd better buy a second pillow. And lock the door." },
      ] },
      { tone: 'risque', t: "Burnt toast and the snort. Now show me the rest.", r: "The rest. Mm. You've seen most of it. The best bit only comes out after midnight. Door shut.", opts: [
        { tone: 'cold', t: "Maybe later.", r: "Later. Of course. You love later. Later loves you less." },
        { tone: 'passive', t: "No rush. I like this part too.", r: "This part. The talking. Mm. You're very good at this part. Rare." },
        { tone: 'flirty', t: "After midnight, then. I'll wait up.", r: "You'll wait up. You. That's love, that is. Or madness." },
        { tone: 'risque', t: "Door shut. Lights low. Show me.", r: "Mm. Come here, then. ...No. Closer. Fade out, Trouble. Don't tell Vivi." },
      ] },
    ],
  },
  // ==== slot 6: heat - cancel your plans; a night in, lights low, fade to black ====
  {
    id: 'flirtatious-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "You've been cold on me all week. So, revenge: I've cleared my whole evening. Lights low, door locked. Come over and regret it.",
    opts: [
      { tone: 'cold', t: "I have plans.", r: "Plans. Of course. Go to your plans. Think of me. Lights low. Door locked. Alone. Your choice.", opts: [
        { tone: 'cold', t: "I'll manage.", r: "You'll manage. I'll smoulder. Unseen. What a waste of a good evening." },
        { tone: 'passive', t: "Maybe after my plans?", r: "After. Fine. I'll still be awake. I'm always awake. Knock twice." },
        { tone: 'flirty', t: "Cancelled. They were boring anyway.", r: "Boring. Unlike me. Good choice. I'll leave the door on the latch." },
      ] },
      { tone: 'passive', t: "What's the plan?", r: "No plan. Just me, a slow record, very low lights and you, being sorry. Slowly.", opts: [
        { tone: 'cold', t: "Sounds like a lot.", r: "That was the point. Fine. Low lights for one, then." },
        { tone: 'passive', t: "I'll bring dinner.", r: "Bring dinner. We won't eat it. But it's thoughtful." },
        { tone: 'flirty', t: "I'll be very, very sorry.", r: "Very sorry. Mm. I'll need you to demonstrate. At length." },
        { tone: 'risque', t: "Make me regret it until morning.", r: "Until morning. Mm. That's the plan now. Clear tomorrow too." },
      ] },
      { tone: 'flirty', t: "Regret it? Revenge sounds promising.", r: "Promising. Mm. It is. I've been planning it for four days. You should be nervous.", opts: [
        { tone: 'cold', t: "Not tonight. Sorry.", r: "Not tonight. Fine. Revenge postponed. It'll be worse later. Much, much worse. You'll love it." },
        { tone: 'passive', t: "Should I bring anything?", r: "Yourself. And your phone off. And your best apologies." },
        { tone: 'flirty', t: "I'm nervous. Delightfully.", r: "Delightfully nervous. Perfect. That's exactly where I want you." },
        { tone: 'risque', t: "Do your worst. All night.", r: "My worst. All night. Mm. I'll lock the door now. Get here quickly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "Cancel your plans tonight, Trouble. I've cancelled mine. Slow record, low lights, nowhere to be until noon. Say yes.",
    opts: [
      { tone: 'cold', t: "Can't tonight.", r: "Can't. Or won't? Mm. Fine. I'll have a long bath and think about you. Your punishment is imagining it.", opts: [
        { tone: 'cold', t: "Enjoy the bath.", r: "I will. Thoroughly. And you won't know a thing about it. Goodnight." },
        { tone: 'passive', t: "Tomorrow? Promise.", r: "Tomorrow. Promise. I'll hold the record on the turntable. And the mood." },
        { tone: 'flirty', t: "Save the slow record for me.", r: "Saved. It's waiting. So am I. Not patiently." },
      ] },
      { tone: 'passive', t: "Yes. What should I bring?", r: "Nothing. Absolutely nothing. You won't need it. ...I mean a toothbrush. Bring a toothbrush.", opts: [
        { tone: 'cold', t: "I'll probably leave early.", r: "Early. Of course. Fine. I'll be dazzling until you leave, and sulky after." },
        { tone: 'passive', t: "Toothbrush. Got it.", r: "Got it. Good. Practical. I like practical. I'll be impractical for both of us." },
        { tone: 'flirty', t: "Just a toothbrush. Noted.", r: "Just a toothbrush. Mm. You've made that sound much worse than I meant. I love it." },
        { tone: 'risque', t: "I'll bring a toothbrush and no intention of leaving.", r: "No intention of leaving. Mm. I'll make sure you don't want to. Lights low. Door locked." },
      ] },
      { tone: 'flirty', t: "Until noon? You're spoiling me.", r: "Spoiling you. Mm. Thoroughly. Hours of it. I've been planning this since breakfast.", opts: [
        { tone: 'cold', t: "That's a lot of hours.", r: "It's not enough hours. But fine. I'll compress. It'll be less fun and more intense." },
        { tone: 'passive', t: "I'll be there at eight.", r: "Eight. Sharp. I'll be the one in the doorway. Looking at you like that." },
        { tone: 'flirty', t: "Spoil me. I've earned it.", r: "You've earned it. And then some. Get here. I'll start at the door." },
        { tone: 'risque', t: "Noon? Make it the afternoon.", r: "The afternoon. Mm. Greedy. I adore greedy. Lights low, Trouble. Fade out." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "I've been thinking about you all day in very unhelpful ways. Come home with me. Now. I'm not asking twice. Well. I'd ask twice.",
    opts: [
      { tone: 'cold', t: "Not now. I'm busy.", r: "Busy. With all this on offer? Fine. Go be busy. I'll be unhelpfully thinking until you're done.", opts: [
        { tone: 'cold', t: "Think away.", r: "Oh, I will. In detail. You'll feel it. Like a draught." },
        { tone: 'passive', t: "An hour. Then I'm yours.", r: "An hour. I'll count the minutes. I'll count them out loud. Hurry." },
        { tone: 'flirty', t: "Ask me twice.", r: "Home. With me. Please. ...See? Asked twice. You're obliged now." },
      ] },
      { tone: 'passive', t: "Unhelpful how?", r: "Come closer and I'll whisper. ...Mm. That's the polite version. The impolite one's at home.", opts: [
        { tone: 'cold', t: "Polite's enough for me.", r: "Polite. Fine. Tea and a handshake, then. I'm devastated." },
        { tone: 'passive', t: "That's the polite one?", r: "The polite one. Yes. You're blushing. Point to me. I'm catching up." },
        { tone: 'flirty', t: "I want the impolite version.", r: "Naturally. Home. Now. I'll tell you every word." },
        { tone: 'risque', t: "Show me the impolite one. Tonight.", r: "Tonight. Mm. Door locked. Phones off. You won't remember what day it is." },
      ] },
      { tone: 'flirty', t: "You don't need to ask twice.", r: "I know. But I like hearing you say yes. Say it again. Slower.", opts: [
        { tone: 'cold', t: "Once is enough.", r: "Once. Fine. Grudgingly accepted. We're still going." },
        { tone: 'passive', t: "Yes. Let's go.", r: "Let's go. Coat. Keys. You. Done." },
        { tone: 'flirty', t: "Yes. Slower. Yes.", r: "Mm. There it is. My favourite word, in my favourite voice. Home." },
        { tone: 'risque', t: "Yes. And I'm not letting you sleep.", r: "Not sleep. Mm. Good. I wasn't planning to. Lights low, Trouble. Fade to black." },
      ] },
      { tone: 'risque', t: "Lead the way. And don't plan on sleeping.", r: "Sleeping? Darling, I've never once slept on a night like this. Come on.", opts: [
        { tone: 'cold', t: "Actually, I need an early night.", r: "An early night. You'll be the end of me. Fine. Early night. Separately. Grumpily." },
        { tone: 'passive', t: "Lead on.", r: "Leading. Hold my hand. Don't let go till the door." },
        { tone: 'flirty', t: "Never letting go.", r: "Never. Mm. Good. I'm walking very quickly now. Keep up." },
        { tone: 'risque', t: "Door shut. Lights out. No more talking.", r: "No more talking. Mm. ...Shh. Fade to black, Trouble." },
      ] },
    ],
  },
  // ==== slot 7: the fear - terrible at the part where it matters; will you stay? ====
  {
    id: 'flirtatious-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "You were cold and I panicked, Trouble. Properly. I nearly put the armour back on. I'm terrible at the part where it matters.",
    opts: [
      { tone: 'cold', t: "Then maybe don't do this.", m: -5, r: "...Okay. That's the thing I was scared you'd say. I'll go. Don't follow. I couldn't bear it.", opts: [
        { tone: 'cold', t: "Fine. Go.", r: "Going. ...I meant what I said, you know. All of it. Goodnight, Trouble." },
        { tone: 'passive', t: "I didn't mean it. I'm sorry.", r: "You didn't mean it. Okay. Breathe. I'll stay. My heart's still pounding. It'll slow down." },
        { tone: 'flirty', t: "Ignore that. Come here.", r: "Come here. ...Okay. I'm here. Never again, please. I'm not built for it." },
      ] },
      { tone: 'passive', t: "I'm sorry. I was tired, not leaving.", m: 2, r: "Not leaving. Okay. I'm fine. I'm not fine. I'm learning. Slowly. Badly.", opts: [
        { tone: 'cold', t: "You need to calm down.", r: "Calm down. I'm trying. That doesn't help. Fine. I'll calm down on my own." },
        { tone: 'passive', t: "You're doing fine at it.", r: "Am I? It feels like walking a balcony rail. In socks. In the dark." },
        { tone: 'flirty', t: "I'll stay. Even when you panic.", r: "Even then. Mm. That's the bit nobody's ever done. Thank you, Trouble." },
        { tone: 'risque', t: "Let me stay tonight. I'll prove I'm not going.", r: "Tonight. Mm. Stay. Don't let go once. Not even in your sleep." },
      ] },
      { tone: 'flirty', t: "Terrible? You're doing beautifully.", r: "Beautifully. Don't lie to me in that voice. I'll believe you.", opts: [
        { tone: 'cold', t: "I wasn't lying. Don't push it.", r: "Don't push it. Fine. I'll stop. Shaky but upright. Mostly upright." },
        { tone: 'passive', t: "I mean it. Every word.", r: "Every word. Okay. I'll keep them. I keep everything you say now." },
        { tone: 'flirty', t: "Believe me, then. I'm right here.", r: "Right here. Mm. Okay. Armour stays off. Your fault." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "I need to tell you something. Sometimes I want to run. Not from you - from how much this matters. I'm bad at this part, Trouble.",
    opts: [
      { tone: 'cold', t: "Then run.", m: -5, r: "...Right. I said the scariest thing I've ever said, and you said 'then run.' I'll go for a walk.", opts: [
        { tone: 'cold', t: "Go.", r: "Going. Slowly. In case you change your mind. ...You didn't. Okay." },
        { tone: 'passive', t: "Wait. Sorry. That was awful.", r: "It was awful. Thank you for saying so. I'm still here. Shaking a bit. Still here." },
        { tone: 'flirty', t: "Don't run. Run here.", r: "Here. ...Okay. Okay. I'm here. Don't do that again. Ever." },
      ] },
      { tone: 'passive', t: "I'm bad at it too. We'll be bad at it together.", m: 2, r: "Together. Two disasters. That's... the nicest thing anyone's said to me. Don't laugh.", opts: [
        { tone: 'cold', t: "Don't get emotional.", r: "Too late. I'm a puddle. A very attractive one. I'll mop myself up somewhere else." },
        { tone: 'passive', t: "I'm not laughing.", r: "No. You're not. You never laugh at the real stuff. That's why I'm still here." },
        { tone: 'flirty', t: "Two gorgeous disasters.", r: "Gorgeous. Of course. We'd never be anything else. Hold my hand, disaster." },
        { tone: 'risque', t: "Let's be disasters somewhere with a lock.", r: "A lock. Mm. You're very good at fixing my moods. Wildly unfair technique. Lead on." },
      ] },
      { tone: 'flirty', t: "If you run, I'll chase. I'm very fast.", r: "You are very fast. Mm. My rule was always make them chase. I never meant it like this.", opts: [
        { tone: 'cold', t: "Don't make me chase too far.", r: "I won't run far. Just round the block. I'll be back before you miss me." },
        { tone: 'passive', t: "You don't need to run.", r: "I know. I just feel it. It passes. It passes faster when you're here." },
        { tone: 'flirty', t: "Run. I'll catch you every time.", r: "Every time. Mm. Then I'll run slowly. In circles. Near you. Like at the very start." },
        { tone: 'risque', t: "Run straight into my arms. Tonight.", r: "Your arms. Tonight. Mm. Fastest I've ever run. Don't let go." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "I keep waiting for this to go wrong, Trouble. That's my trick: I flirt, they love the show, they leave. You're breaking my trick.",
    opts: [
      { tone: 'cold', t: "Maybe I'll leave too.", m: -5, r: "...Don't joke about that. That's the one thing. Please. Not that.", opts: [
        { tone: 'cold', t: "I wasn't joking.", r: "Okay. Then I'll put the armour on and go home. Don't call tonight. I couldn't take it." },
        { tone: 'passive', t: "I was joking. Badly. I'm sorry.", r: "Badly. Very badly. Okay. I forgive you. Hold me for a second. I need to stop shaking." },
        { tone: 'flirty', t: "Joking. I'm never leaving. Ever.", r: "Ever. Mm. Okay. Don't scare me like that. I'm fragile now. It's your fault." },
      ] },
      { tone: 'passive', t: "I'm not leaving. That's a promise.", m: 2, r: "A promise. I've had promises. ...But yours sound different. Like you're already staying.", opts: [
        { tone: 'cold', t: "Don't make me repeat it.", r: "Once is enough. Okay. I'll hold onto it. Very tightly. Like a railing." },
        { tone: 'passive', t: "I am already staying.", r: "You are. Your mug's in my cupboard. Your jacket's on my chair. Oh. You've been staying for weeks." },
        { tone: 'flirty', t: "Your trick's broken. Get a new one.", r: "A new trick. Mm. How about: I fall in love and see what happens. ...I said that out loud." },
        { tone: 'risque', t: "I'll prove it. Tonight. And tomorrow.", r: "And tomorrow. Mm. And the day after. Bring your toothbrush. Leave it here." },
      ] },
      { tone: 'flirty', t: "Break the trick. I'll stay for every encore.", r: "Every encore. Mm. There are a lot. I do a lot of encores. Some are very late at night.", opts: [
        { tone: 'cold', t: "Don't overdo it.", r: "Overdo it. Me? Always. Fine. Fewer encores. Better ones." },
        { tone: 'passive', t: "I'll be there for all of them.", r: "All of them. Okay. Then I'll stop counting exits. I'll just watch you." },
        { tone: 'flirty', t: "The late ones are my favourite.", r: "Of course they are. Mm. You're a night person now. I've converted you." },
        { tone: 'risque', t: "Do one for me tonight. Private show.", r: "Private show. Mm. Front row. Lights low. No interval. You're going to love the ending." },
      ] },
    ],
  },
  // ==== slot 8: Vivi's verdict - "smitten"; the rule was never fall first, and they fell first ====
  {
    id: 'flirtatious-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "You've been cold, and I hate that it hurts. My grandmother Vivi's rule was never fall first. I broke it. Ages ago. Now you know.",
    opts: [
      { tone: 'cold', t: "That's your choice.", m: -4, r: "My choice. Yes. I chose you. I'll un-choose it in a hundred years or so. Thanks for the warmth.", opts: [
        { tone: 'cold', t: "Up to you.", r: "Up to me. Lovely. I'll stand here, fallen, alone. Very elegantly." },
        { tone: 'passive', t: "Sorry. I'm glad you did.", r: "Glad. Okay. Glad is good. Glad is a soft landing. I'll take it." },
        { tone: 'flirty', t: "I fell too. I was just slower to say it.", r: "Slower. You? The fast one? ...Okay. Then nobody's alone down here." },
      ] },
      { tone: 'passive', t: "What did Vivi say?", r: "That I'm smitten. Smitten! I've never been smitten in my life. She laughed for ten minutes.", opts: [
        { tone: 'cold', t: "Grandmothers say things.", r: "Grandmothers say things. Yes. Thank you. Very helpful. I'll go and be smitten alone." },
        { tone: 'passive', t: "Smitten's a good word.", r: "It's a terrible word. It's a word for people in old films. I'm in an old film. Help." },
        { tone: 'flirty', t: "I'm smitten too. Completely.", r: "Completely. Mm. Then we're both ridiculous. Vivi will be unbearable. Kiss me." },
        { tone: 'risque', t: "Smitten. Let me show you how smitten.", r: "Show me. Mm. Thoroughly. And then I'll tell Vivi nothing. She'll know anyway." },
      ] },
      { tone: 'flirty', t: "You fell first? Good. I'll catch you.", r: "Catch me. Mm. That's the one thing I never let anyone do. ...Okay. Catch me.", opts: [
        { tone: 'cold', t: "I'll try.", r: "Try. Lovely. Some catch. I'll bring a cushion, just in case." },
        { tone: 'passive', t: "I've got you.", r: "You've got me. Mm. Yes. You really have. That's terrifying. And lovely. Both." },
        { tone: 'flirty', t: "Caught. Not letting go.", r: "Not letting go. Mm. Good. I was getting tired of falling. This is much nicer." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "My grandmother Vivi rang. I said you're fine. She said, 'You're smitten.' Her oldest rule is never fall first. I fell first, Trouble.",
    opts: [
      { tone: 'cold', t: "Rules are silly anyway.", r: "Silly? That rule kept me safe for years. Fine. It's silly. I'm unsafe and you're flippant.", opts: [
        { tone: 'cold', t: "It's not that serious.", r: "Not that serious. I said I fell for you and you said 'overreacting.' Got it. Back in my box." },
        { tone: 'passive', t: "Sorry. I know it matters.", r: "It matters. You matter. That's the whole problem. Come here. Sit." },
        { tone: 'flirty', t: "Silly rule. Worth breaking. For me.", r: "For you. Mm. Yes. Worth it. I'd break all the others too. Watch." },
      ] },
      { tone: 'passive', t: "When did you fall?", r: "Honestly? The first time you didn't blink. Or the time you stayed for the quiet bit. Both. Ages ago.", opts: [
        { tone: 'cold', t: "That's a long time to hide it.", r: "It is. I'm very good at hiding. It's my entire act. Fine. I'll hide it again." },
        { tone: 'passive', t: "I'm glad you told me.", r: "I'm glad I told you. I think. Ask me after I stop shaking." },
        { tone: 'flirty', t: "I fell the first time you looked at me.", r: "The first time? Then you fell first. Oh. Oh, Vivi's going to be furious. I'm thrilled." },
        { tone: 'risque', t: "Fall into my arms, then. Tonight.", r: "Tonight. Mm. I've already fallen. This is just the landing. Make it soft." },
      ] },
      { tone: 'flirty', t: "Smitten. I like it on you.", r: "I like it on me too. It's horrid. I'm grinning at lamp posts. Trouble, look what you've done.", opts: [
        { tone: 'cold', t: "Stop grinning, then.", r: "Stop grinning. I can't. You can't make me. Fine. I'll grin elsewhere." },
        { tone: 'passive', t: "I'm grinning too.", r: "Are you? ...You are. Look at us. Two idiots. Vivi would take a photo." },
        { tone: 'flirty', t: "Grin at me instead of lamp posts.", r: "At you. Gladly. Lamp posts never look back like that." },
        { tone: 'risque', t: "Grin at me all night.", r: "All night. Mm. The grinning will turn into other things. You know that, right?" },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "Big news: I broke my grandmother Vivi's oldest rule - never fall first. I've fallen. Hopelessly. You did it, Trouble. Congratulations.",
    opts: [
      { tone: 'cold', t: "That's a lot of pressure.", r: "Pressure. Mm. It's not pressure, it's a fact. Facts are just very heavy, sometimes. Never mind.", opts: [
        { tone: 'cold', t: "It's too much for me.", r: "Too much. Okay. I hear you. I'll carry it myself. I'm stronger than I look. Barely." },
        { tone: 'passive', t: "Sorry. I'm glad. I'm just surprised.", r: "Surprised? I've been obvious for weeks. Everyone knew. Even the waiters." },
        { tone: 'flirty', t: "It's the best pressure.", r: "The best. Mm. Then I'll lean on you a little harder. Gladly." },
      ] },
      { tone: 'passive', t: "Hopelessly? That's a big word for you.", r: "It's accurate. No hope at all. I'm completely gone. I keep humming in public.", opts: [
        { tone: 'cold', t: "It'll pass.", r: "Pass. It won't. You'd like it to? Fine. I'll hum quietly." },
        { tone: 'passive', t: "I like the humming.", r: "Do you? It's the slow song. I hum it in queues. People stare. I don't care." },
        { tone: 'flirty', t: "I'm gone too. Completely.", r: "Completely. Mm. Then neither of us fell first. We jumped. Vivi can't argue with that." },
        { tone: 'risque', t: "Hum it for me tonight. In the dark.", r: "In the dark. Mm. Humming, then... less humming. You know how it goes." },
      ] },
      { tone: 'flirty', t: "Congratulations to me. I'll take my prize now.", r: "Your prize. Mm. It's me. Hopelessly fallen me. No refunds, Trouble.", opts: [
        { tone: 'cold', t: "Maybe I'll take a refund.", r: "No refunds. ...You're joking. You're joking? Don't do that to me. Not today." },
        { tone: 'passive', t: "No refunds needed.", r: "No refunds needed. Okay. I'll stop panicking now. Mostly." },
        { tone: 'flirty', t: "Best prize there's ever been.", r: "Best ever. Mm. Say it to Vivi. She'll frame it." },
        { tone: 'risque', t: "I'll unwrap my prize later.", r: "Unwrap. Mm. Carefully. Slowly. I'm fragile, and I've waited all season." },
      ] },
      { tone: 'risque', t: "Fallen? Then let me catch you. All night.", r: "All night. Mm. I've never been caught before. I think I'll like it. Very much.", opts: [
        { tone: 'cold', t: "Maybe just the evening.", r: "The evening. Fine. I'll fall slowly to make it last." },
        { tone: 'passive', t: "However long you need.", r: "However long. That might be years. You'd better be strong." },
        { tone: 'flirty', t: "Caught. Holding on.", r: "Holding on. Mm. Don't let go. I'm still falling. I think I always will be." },
        { tone: 'risque', t: "All night, and then breakfast in bed.", r: "Breakfast in bed. Mm. You know I'll burn it. Lights low, Trouble. Fade out." },
      ] },
    ],
  },
  // ==== slot 9: end of the chapter - the future, and the one line they've never said ====
  {
    id: 'flirtatious-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "You were cold last time and I lay awake. Not angry. Scared. Because I'm in love with you, Trouble. There. The worst timing ever.",
    opts: [
      { tone: 'cold', t: "That's a lot to drop on me.", m: -4, r: "It is. I know. I've never said it before. I'll take it back if you want. I won't mean it.", opts: [
        { tone: 'cold', t: "I need time.", r: "Time. Okay. I'll give you time. Balcony. Not breathing much. Take your time." },
        { tone: 'passive', t: "Don't take it back. I'm just surprised.", r: "Surprised. Okay. I'll stay surprising. Just... say something when you can." },
        { tone: 'flirty', t: "Keep it. Because I love you as well.", r: "You... Okay. Oh. Okay. Say it again. Slowly. I'm making a recording in my head." },
      ] },
      { tone: 'passive', t: "I love you. I'm sorry I was cold.", m: 3, r: "You do? ...Say it again. I've never heard it from someone I believed.", opts: [
        { tone: 'cold', t: "Don't make me say it twice.", r: "Once. Okay. Once is enough. I'll hear it in my head on repeat." },
        { tone: 'passive', t: "I really do love you.", r: "You really do. Oh. It sounds different when you say it. Like it's going to stay." },
        { tone: 'flirty', t: "I love you. Every annoying, gorgeous bit.", r: "Every bit. Mm. Even the snort? ...Even the snort. Okay. I'm crying. Don't look." },
        { tone: 'risque', t: "I love you. Let me show you how much.", r: "Show me. Mm. All night. Then tell me again in the morning. I'll be awake for that." },
      ] },
      { tone: 'flirty', t: "Worst timing? Best news I've ever had.", r: "Best news. Mm. You're supposed to be cross. I'm supposed to be cool. We're both terrible at this.", opts: [
        { tone: 'cold', t: "Let's not get carried away.", r: "Not carried away. Fine. Feet on the ground. Heart... somewhere over the city." },
        { tone: 'passive', t: "I love you too, you know.", r: "I know. ...I didn't know. I hoped. Thank you, Trouble." },
        { tone: 'flirty', t: "Terrible together. Forever.", r: "Forever. That's a long word. I've never wanted a long word before. I do now." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "Where do you see us in a year, Trouble? I see us at a corner table, still having a staring contest. And me still not blinking.",
    opts: [
      { tone: 'cold', t: "I don't plan that far.", r: "No. You plan corners. I plan us. Fine. I'll plan for two and you can turn up.", opts: [
        { tone: 'cold', t: "Don't plan for me.", r: "Don't plan for you. Okay. I'll plan for one and leave a seat. Just in case." },
        { tone: 'passive', t: "A year sounds good, though.", r: "Good. There it is again, your 'good.' I'll take it. I'll always take it." },
        { tone: 'flirty', t: "Plan it. I'll be there.", r: "You'll be there. Mm. Then I'll plan everything. You'll love it." },
      ] },
      { tone: 'passive', t: "Same table. Same contest. I'll win eventually.", r: "You'll never win. But you'll keep trying. That's the most annoying, wonderful thing about you.", opts: [
        { tone: 'cold', t: "We'll see about that.", r: "We'll see. Mm. You'll see. I'll be there. Not blinking." },
        { tone: 'passive', t: "And in ten years?", r: "Ten years. Same table. A slow record. Probably your sunglasses, still. I never gave them back, did I?" },
        { tone: 'flirty', t: "In a year, I'll make you blink.", r: "You've already made me do worse. I'm in love with you, Trouble. ...There. I blinked." },
        { tone: 'risque', t: "In a year: same table, then home early.", r: "Home early. Mm. Some things never change. I'll be counting on it." },
      ] },
      { tone: 'flirty', t: "In a year? Still making you blush.", r: "Still. Mm. Probably more. I love you, you know. I've never said that first. I just did. Ugh.", opts: [
        { tone: 'cold', t: "Bit soon for that.", m: -4, r: "Soon. Okay. It doesn't feel soon to me. Never mind. I'll hold it. You can catch up." },
        { tone: 'passive', t: "Me too. I love you.", r: "You... okay. One more time. I want to remember exactly how it sounds." },
        { tone: 'flirty', t: "Say it again. I'll never get tired of it.", r: "I love you. ...I love you. Okay, I'll stop. I won't stop." },
        { tone: 'risque', t: "Say it again later. In the dark.", r: "In the dark. Mm. I'll say it a hundred ways. Some of them without words." },
      ] },
    ],
  },
  {
    id: 'flirtatious-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "I've said a lot of things to a lot of people, Trouble. Lines, dares, whispers. I've never said this one. I'm in love with you.",
    opts: [
      { tone: 'cold', t: "Okay.", m: -4, r: "Okay. That's... okay. I'll take okay. I'll be over there, having said the biggest thing of my life.", opts: [
        { tone: 'cold', t: "I'm not there yet.", r: "Not there yet. Okay. I'll wait. Patiently. Shaking slightly. Waiting." },
        { tone: 'passive', t: "Sorry. I'm stunned. Give me a second.", r: "A second. Take two. Take a hundred. I'll be right here, mortified." },
        { tone: 'flirty', t: "Okay meant I love you too.", r: "Okay meant... You. Infuriating. Wonderful. Say the long version. Now." },
      ] },
      { tone: 'passive', t: "Same. No line. I love you.", m: 4, r: "No line. No show, no game, no rules. Just that. Oh. That's the best thing I've ever heard.", opts: [
        { tone: 'cold', t: "Don't make a fuss.", r: "No fuss. Fine. Just quiet. Just us. A small, enormous moment. Done." },
        { tone: 'passive', t: "So what now?", r: "Now? Now we go home. Same as always. Except everything's different. Lovely." },
        { tone: 'flirty', t: "I'll say it every day. A different line every time.", r: "Every day. Mm. Make them good. I'm a professional. I'll be grading." },
        { tone: 'risque', t: "Let me say it again. Somewhere quieter. All night.", r: "All night. Mm. A slow record, lights low, no rules. I love you, Trouble. Fade out." },
      ] },
      { tone: 'flirty', t: "Finally. I've loved you for ages.", r: "Ages? And you let me go first? You let me break Vivi's rule. Oh. You let me fall first on purpose.", opts: [
        { tone: 'cold', t: "Don't read into it.", r: "Too late. It's my favourite book now. Fine. I'll read it quietly." },
        { tone: 'passive', t: "I wanted you to know it was safe.", r: "Safe. Oh. That's... the kindest thing. Nobody's ever made it safe before." },
        { tone: 'flirty', t: "I'd let you win every time.", r: "Every time. Mm. Don't. I'll get lazy. ...Okay, sometimes. I love you." },
        { tone: 'risque', t: "Now let me show you ages' worth.", r: "Ages' worth. Mm. That'll take years. Good. Start tonight. Lights low." },
      ] },
      { tone: 'risque', t: "Say it again. Then come home and say it differently.", r: "Differently. Mm. I've got a hundred ways. You'll hear all of them. I love you. That's one.", opts: [
        { tone: 'cold', t: "Once is plenty for tonight.", r: "Plenty. Okay. I'll ration them. One a day. You'll be begging by Friday." },
        { tone: 'passive', t: "I love you. That's all I want to hear.", r: "Then that's all you'll hear. Over and over. Simple. Me. You. That." },
        { tone: 'flirty', t: "I love you. That's two.", r: "Two. Mm. We'll be into the thousands by spring. Come here." },
        { tone: 'risque', t: "All hundred ways. Tonight.", r: "Tonight. Mm. We'll lose count. Doors locked. I love you. Fade out, Trouble." },
      ] },
    ],
  },
];
