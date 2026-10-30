// The Spark - in person, stage 'new' (just met: first impressions, teasing, dares). Plain data, no imports.
export const DATA = [
  // ---- cold: you were cold last time - pouty, sassy, making you work for it -------------------------------------
  {
    id: 'spark-new-cold-1', stage: 'new', mood: 'cold',
    say: [
      "Oh look, it's the one who yawned at me last time. I've been working on my material since. Brace yourself.",
      "You! You yawned at me last time. Mid-story! My best story! I've decided you get exactly one more chance.",
    ],
    opts: [
      { tone: 'cold', t: "I wasn't yawning. I was bored.", r: "Oof. Straight for the throat. I get told I'm a lot, you know. Usually as a compliment.", opts: [
        { tone: 'cold', t: "It isn't one this time.", r: "Noted. Setting it on fire later. Enjoy your quiet little corner, racer." },
        { tone: 'passive', t: "Sorry. I'm fried this weekend, that's all.", r: "Fried I can work with. Grumpy I can't. Next time, warn a person before you go full storm cloud." },
        { tone: 'flirty', t: "Okay. It was a little bit a compliment.", r: "Ha! Knew it. You're one of those slow-burn types. Infuriating. Luckily I love a puzzle." },
      ] },
      { tone: 'passive', t: "Sorry about that. Long day at the track.", r: "Apology accepted, on one condition: you laugh at my next joke. Even if it's terrible. Especially then.", opts: [
        { tone: 'cold', t: "I don't do fake laughs.", r: "Then you'll never hear it, and it was a great bad joke. Your loss. Truly. Off you go, then." },
        { tone: 'passive', t: "Deal. Hit me with it.", r: "Why did the racer bring a ladder? For the podium. ...You smiled! Smiles count! We're square." },
        { tone: 'flirty', t: "I'll laugh at all of them if you keep standing this close.", r: "Oh! There it is! A personality, hiding under all that sulk. Hello. Nice to meet you properly." },
      ] },
      { tone: 'flirty', t: "I was trying to play it cool. I overdid it.", r: "Overdid it? You were a glacier in a team jacket! ...Okay, that's a tiny bit cute. Tiny.", opts: [
        { tone: 'cold', t: "Don't read too much into it.", r: "Warm, then frosty, in under a minute. You should do the weather. The grumpy weather." },
        { tone: 'passive', t: "So we start over?", r: "We start over. New rule: one frosty face per weekend, maximum. I'm counting. I have a little notebook." },
        { tone: 'flirty', t: "Teach me how to warm up, then.", r: "Lesson one: dance badly with me at some point this season. Homework's mandatory, hotshot. I'll check." },
      ] },
    ],
  },
  {
    id: 'spark-new-cold-2', stage: 'new', mood: 'cold',
    say: "You again! Last time I got one-word answers. One word! I counted. Today I'm aiming for two. Ambitious, I know.",
    opts: [
      { tone: 'cold', t: "Hi.", r: "One word! Again! Now you're doing it on purpose, which is almost a game. Do you even like games?", opts: [
        { tone: 'cold', t: "Not really.", r: "Fun police, table for one. I'll be over there with literally everyone else." },
        { tone: 'passive', t: "Depends on the game.", r: "Ooh, a careful answer. Suspiciously careful. Fine, I'll come back with a good one and you'll be sorry." },
        { tone: 'flirty', t: "Depends who's playing.", r: "Three words! And one was flirty! Record smashed. I'm telling everyone. I'm getting it engraved." },
      ] },
      { tone: 'passive', t: "Hello. Sorry, I'm better at this without a helmet on.", r: "That's a whole sentence! I'm framing it. So what are you like with the helmet on? Chatty? Screaming?", opts: [
        { tone: 'cold', t: "Quiet. Which is what I'm after now.", r: "Oof. Message received. Loudly, ironically. I'll leave you to your thrilling silence, then." },
        { tone: 'passive', t: "Mostly singing, badly, on the straights.", r: "Stop. You sing in the car?! Best thing I've heard all week. What song? No, don't tell me, I'll guess." },
        { tone: 'flirty', t: "Stick around and you might get the full concert.", r: "Oh, I'm sticking. I'm glue now. You've done it. I'm your loudest fan and I own a megaphone." },
      ] },
      { tone: 'flirty', t: "I was saving the good words for when you came back.", r: "Liar! Gorgeous liar. Okay, I'll allow it. Spend them, then. Every last one. I'm all ears.", opts: [
        { tone: 'cold', t: "That was most of them.", r: "That was the whole vault? Tragic. Come and find me when you've restocked. I won't hold my breath." },
        { tone: 'passive', t: "So. How's your weekend been?", r: "Chaos, obviously. I got lost in the paddock twice and someone thought I was a mechanic. I was thrilled." },
        { tone: 'flirty', t: "You're trouble. Two words, for free.", r: "Trouble! I'm putting it on a T-shirt. You're getting the first one. Wear it on the grid. I dare you." },
      ] },
    ],
  },
  {
    id: 'spark-new-cold-3', stage: 'new', mood: 'cold', where: 'party',
    say: "Oh, it's the frosty one. Come to frown at the dance floor again? I've saved you a corner. It's very sulky.",
    opts: [
      { tone: 'cold', t: "I'm here for the team. Not for you.", r: "Ouch! Strange thing to say to someone holding two drinks, one of them yours. Was yours.", opts: [
        { tone: 'cold', t: "Keep them both. I'm going.", r: "Bye, then! Mind you don't trip over all that charm on the way out. ...Rude. Two drinks for me, then." },
        { tone: 'passive', t: "Sorry. That came out harsher than I meant.", r: "It did, a bit. Here. The one with the little umbrella. Peace offering. Don't make me regret it." },
        { tone: 'flirty', t: "Was mine? So one of those was for me?", r: "Was. Past tense. ...Fine, but you have to earn the umbrella. It's a very nice umbrella." },
      ] },
      { tone: 'passive', t: "I don't really dance.", r: "Everybody dances. You just haven't been bullied into it by the right person. Hi. I'm the right person.", opts: [
        { tone: 'cold', t: "Still a no. Find someone else.", r: "Fine! Shame for you. I'd have made you look amazing out there. Off I go. Unbullied. Tragic." },
        { tone: 'passive', t: "I'll watch. Someone has to hold your bag.", r: "A spectator! I can work with a spectator. Clap at the right bits. Film nothing. Okay, film a little." },
        { tone: 'flirty', t: "If you're leading, maybe.", r: "I'm always leading! Quick, before you change your mind. Try to keep up, pole-sitter." },
      ] },
      { tone: 'flirty', t: "I was waiting for someone to drag me out of the corner.", r: "Wait, really? You only had to say! I'm an elite dragger. World class. Give me your hand.", opts: [
        { tone: 'cold', t: "Actually, never mind.", r: "You can't wave a hand at me and take it back! That's against every rule. ...Okay. Sulk away, then." },
        { tone: 'passive', t: "One song. Then back to the corner.", r: "One song is a contract. You've signed it. But you'll want another. They always want another." },
        { tone: 'flirty', t: "Drag away. I'll follow you anywhere tonight.", r: "Anywhere? Dangerous thing to tell me. I once ended a party on a fishing boat. Come on, trouble!" },
      ] },
    ],
  },
  {
    id: 'spark-new-cold-4', stage: 'new', mood: 'cold',
    say: "Well, well. The one who walked off mid-sentence. My sentence! It had a really good ending, you know.",
    opts: [
      { tone: 'cold', t: "I didn't miss much.", r: "Oh. That pinched. Well, now you'll never know how it ended. It had a twist and everything.", opts: [
        { tone: 'cold', t: "I'll live.", r: "You'll live boringly, but sure. Off you go. I'll tell the ending to someone who deserves it." },
        { tone: 'passive', t: "Alright. How did it end?", r: "Nope, it's locked now. You can earn it back. Three good questions about me. Go. Clock's ticking." },
        { tone: 'flirty', t: "Tell me. I'll stand very still and listen.", r: "Look at you, all attentive! Fine: it ends with me on a rooftop with a borrowed trumpet. Your turn." },
      ] },
      { tone: 'passive', t: "Sorry. The team called me away.", r: "The team, the team, always the team! Fine. You're forgiven. But you owe me one finished sentence.", opts: [
        { tone: 'cold', t: "Maybe another time.", r: "'Another time.' The saddest words in the language. Fine. I'll keep my sentence hostage." },
        { tone: 'passive', t: "Go on. Finish it now.", r: "So I said, 'if I win, you jump in the fountain.' And I won. And in they went. The end! Satisfying, right?" },
        { tone: 'flirty', t: "No team now. You've got all my attention.", r: "All of it? Greedy of me, but yes please. Phone away. Eyes here. Wow. That's a lot of eye contact." },
      ] },
      { tone: 'flirty', t: "Walking off was the only way I'd stop staring at you.", r: "Oh, that's smooth. Way too smooth. Did you rehearse that in the car? Be honest.", opts: [
        { tone: 'cold', t: "Forget I said it.", r: "Absolutely not, it's mine now. But fine, be weird about it. I'll go and get stared at by other people." },
        { tone: 'passive', t: "A little. There's a lot of time on the straights.", r: "Busted! Rehearsing lines at three hundred an hour. Points for effort. Some points." },
        { tone: 'flirty', t: "No rehearsal. That one was just for you.", r: "Stop it. Stop it right now. I'm going pink, which never happens. You've broken something. Fix it later." },
      ] },
    ],
  },

  // ---- passive: friendly baseline - the dares and the bets start here ---------------------------------------------
  {
    id: 'spark-new-passive-1', stage: 'new', mood: 'passive', where: 'party',
    say: "Racer! Settle something for everyone at {venue}: can you lot drive with your eyes shut? I've bet my shoes on it.",
    opts: [
      { tone: 'cold', t: "No. And I'm off the clock.", r: "Off the clock? At a party? Who says that? Okay. My poor shoes. They had a good life.", opts: [
        { tone: 'cold', t: "You'll survive barefoot.", r: "I will, and I'll look fabulous doing it. You'll be at the bar looking grumpy. We both win. Sort of." },
        { tone: 'passive', t: "Fine. No. We keep them very much open.", r: "Damn! Honest answer, though, I respect it. Barefoot it is. Hold my shoes? Kidding. Mostly." },
        { tone: 'flirty', t: "Tell me who you bet. I'll lie for you.", r: "A partner in crime! You're boring for a minute and then suddenly fun. Great twist. Love a twist." },
      ] },
      { tone: 'passive', t: "Eyes open, I promise. It helps with the corners.", r: "Ugh, the shoes are gone, then. Corners are so needy. Fine. Other question: what's the scariest bit?", opts: [
        { tone: 'cold', t: "Parties like this one.", r: "Ha! Brutal. I'll stop talking before I frighten you any more. Bye, brave racer. Enjoy your corner." },
        { tone: 'passive', t: "The first lap. Twenty cars, one corner.", r: "That's my kind of chaos! That's me at a buffet. I'd be amazing at it." },
        { tone: 'flirty', t: "Honestly? Talking to someone who looks like you.", r: "You're scared of me? Good. Stay a bit scared. It's more fun that way. For me, I mean." },
      ] },
      { tone: 'flirty', t: "Test me. I'll dance with my eyes shut.", r: "Oh, you're on! Eyes shut, no peeking. Step on my toes even once and I win my shoes back.", opts: [
        { tone: 'cold', t: "Actually, I was joking.", r: "No take-backs! ...Okay, apparently there are take-backs. Spoilsport. I'll find a braver racer." },
        { tone: 'passive', t: "One song. Then I need a breather.", r: "One song, eyes shut, I'll steer. Badly. Trust me! Don't trust me. Right, here we go." },
        { tone: 'flirty', t: "Steer me anywhere. I trust you completely.", r: "Completely? On a first meeting? You're either very brave or a little bit mad. My two favourite flavours." },
      ] },
    ],
  },
  {
    id: 'spark-new-passive-2', stage: 'new', mood: 'passive',
    say: "Hey! Quick, pretend we're deep in conversation, I'm hiding from someone. Laugh like I just said something brilliant!",
    opts: [
      { tone: 'cold', t: "I'm not your cover story.", r: "Ouch, okay. They've gone anyway, so I win. You'd have been a terrible cover story, by the way.", opts: [
        { tone: 'cold', t: "Good. Then we're done.", r: "We're done, we're done. So dramatic. You should be in films. Grumpy ones. Ciao!" },
        { tone: 'passive', t: "Who was it, anyway?", r: "Someone who wanted to tell me about their boat. For an hour! You saved me. Grudgingly, but still." },
        { tone: 'flirty', t: "Fine. But you owe me a real conversation.", r: "A proper chat? Ooh, terrifying. Ask me anything. Except boats. I've had all the boats I can take." },
      ] },
      { tone: 'passive', t: "Ha ha ha. Like that?", r: "That was the worst fake laugh I've ever heard and I adore it. You're a natural. At being bad at it.", opts: [
        { tone: 'cold', t: "Glad to help. I'm off.", r: "Wait— and gone. Hit and run. Fine, I'll fake-laugh on my own. Very convincing. Ha. Ha. Ha." },
        { tone: 'passive', t: "So who are we hiding from?", r: "Someone who calls everyone 'buddy'. Including me! I've been buddied four times today. Four!" },
        { tone: 'flirty', t: "Say something actually funny and you'll get a real one.", r: "Pressure! Okay. Okay... I've got nothing. You've made me nervous, which never happens. You're a hazard." },
      ] },
      { tone: 'flirty', t: "I'll laugh at anything if you keep looking at me like that.", r: "Like what? This is my 'please save me' face. Apparently it works on racers. Writing that down. Weaponising it.", opts: [
        { tone: 'cold', t: "It works less than you think.", r: "Ouch. Then why are you still here? Exactly. Go on, run. I won't chase you. Today." },
        { tone: 'passive', t: "So. Who is it?", r: "The one in the scarf. They want me for a charity golf day. Golf! I'd rather eat the ball." },
        { tone: 'flirty', t: "Hide from them all night. Stay right here with me.", r: "All night? That's a big hiding plan. Adore it. You're my bodyguard now. You're not allowed to quit." },
      ] },
    ],
  },
  {
    id: 'spark-new-passive-3', stage: 'new', mood: 'passive', where: 'evening',
    say: "Oh, thank god, a face I know! Sort of. Sit here. This whole dinner is people saying 'synergy'. Make me laugh, quick.",
    opts: [
      { tone: 'cold', t: "I came here for a quiet night.", r: "A quiet night? Next to me? Oh, sweetie. You've picked the wrong chair. Very wrong. The worst chair.", opts: [
        { tone: 'cold', t: "Then I'll pick another one.", r: "Off to the boring end, then. Enjoy the synergy. I'll be laughing over here without you." },
        { tone: 'passive', t: "Fine. You make me laugh, then.", r: "Flipping it on me? Sneaky. Okay. I once got stuck in a revolving door for three laps. On live TV." },
        { tone: 'flirty', t: "Unless the chair comes with you in it.", r: "Hah! It does. Package deal. You get the chair, me, and all my opinions about the bread." },
      ] },
      { tone: 'passive', t: "I'll try. It's been a long week.", r: "Long weeks are my speciality. Tell me the worst bit and I'll turn it into a funny story. It's a gift.", opts: [
        { tone: 'cold', t: "I'd rather not relive it.", r: "Fine, vault shut. I'll just eat your bread roll while you brood. Seems a fair trade." },
        { tone: 'passive', t: "I spun in practice in front of everyone.", r: "You spun for a crowd? Iconic! You gave them a show. Spinning is basically dancing, with a car." },
        { tone: 'flirty', t: "Sitting here is already the best bit.", r: "Smooth! Very smooth. Have a bread roll. You've earned it. I don't share bread with just anyone." },
      ] },
      { tone: 'flirty', t: "The only funny thing here is how good you look.", r: "That's not funny, that's flattering. Different department. Still, I'm keeping it. Keep going.", opts: [
        { tone: 'cold', t: "That's all I had.", r: "One compliment and out? A drive-by. Shame. I was just getting comfortable with you." },
        { tone: 'passive', t: "Seriously, though. Who invited you?", r: "Nobody! I'm the only {job} here and I came for the dessert. Keep it quiet. Or don't. Great story." },
        { tone: 'flirty', t: "Keep going? I could do this all dinner.", r: "All dinner? Then we skip dessert and you walk me home the long way. Was that a question? It's a yes." },
      ] },
    ],
  },
  {
    id: 'spark-new-passive-4', stage: 'new', mood: 'passive',
    say: "You're the racer! I recognised the walk. You walk like you're always about to overtake someone.",
    opts: [
      { tone: 'cold', t: "And you talk like you'll never stop.", r: "Oh. ...That one stung a little. Fine! At least I'm interesting while I'm doing it.", opts: [
        { tone: 'cold', t: "Debatable.", r: "Debatable! Debate over, I won, I'm leaving. Enjoy overtaking the snack table." },
        { tone: 'passive', t: "Sorry. I'm bad with strangers.", r: "We're not strangers, I've literally described your walk. That's intimate! Try again. Nicer." },
        { tone: 'flirty', t: "You are. Annoyingly so.", r: "Annoyingly interesting! Accepted. It's going on my business card, right under my name." },
      ] },
      { tone: 'passive', t: "Is that a good thing?", r: "So careful! Live a little. Yes, it's great. Like you're late for somewhere fun. Where? Can I come?", opts: [
        { tone: 'cold', t: "Back to my motorhome. Alone.", r: "Alone! Boo. Enjoy your thrilling evening of... stretching? Whatever it is you people do." },
        { tone: 'passive', t: "Just the debrief, sadly.", r: "A debrief. A party with no music. Escape afterwards and come and find me. I'll be the loud one." },
        { tone: 'flirty', t: "Depends. Can you keep up?", r: "Keep up? I invented keeping up! Right, race you to the gate. Loser does the winner's victory dance." },
      ] },
      { tone: 'flirty', t: "I'd overtake a lot of people to get to you.", r: "How many is a lot? Give me a number. I want to know my worth in overtakes.", opts: [
        { tone: 'cold', t: "Two. Maybe.", r: "Two?! I'm worth at least nine. You've lost me, racer. I'm off to find a nine-overtake person." },
        { tone: 'passive', t: "The whole grid, probably.", r: "The whole grid. That's twenty-ish. Acceptable. I'm writing it down, so you can't take it back." },
        { tone: 'flirty', t: "No number. I'd just keep going.", r: "Oh. That's a good answer. That's an infuriatingly good answer. Who taught you to talk like that?" },
      ] },
    ],
  },

  // ---- flirty: you left it flirty - already mischievous, picking up the thread ------------------------------------
  {
    id: 'spark-new-flirty-1', stage: 'new', mood: 'flirty',
    say: "There you are! I've been telling everyone you promised me a ride in your car. You didn't. But now you sort of have to.",
    opts: [
      { tone: 'cold', t: "I didn't promise you anything.", r: "Straight to the facts. That landed like a cold shower, racer. I was having such a nice lie.", opts: [
        { tone: 'cold', t: "Then stop telling people things.", r: "Fine! I'll tell them you said no and I was heartbroken. Which is also a lie. Mostly." },
        { tone: 'passive', t: "The car only has one seat, {first}.", r: "One seat? That's a design flaw. Tell your engineers. I'd fold up very small. Like a deckchair." },
        { tone: 'flirty', t: "No ride. But you can watch from the garage.", r: "The garage? Ooh, VIP. I'll bring a sign with your name on it in glitter. Huge glitter. Prepare." },
      ] },
      { tone: 'passive', t: "It's a one-seater. Sorry.", r: "Details, details! Then you owe me something else. A lap of the paddock on a scooter. I'll drive.", opts: [
        { tone: 'cold', t: "I don't owe you anything.", r: "Not even a sticker? Tight-fisted! Fine. I'll get my own sticker. A better one." },
        { tone: 'passive', t: "The scooters belong to the team. But maybe.", r: "Maybe! Maybe is just yes in a hat. I'll find the keys. Don't look at me like that." },
        { tone: 'flirty', t: "You drive, I'll hold on.", r: "Hold on tight, I'm a menace on two wheels. Best idea I've had all day. And I've had loads." },
      ] },
      { tone: 'flirty', t: "Win me over and I'll find a way.", r: "Win you over? I thought I already had. Look at you, smiling. That's a won-over smile.", opts: [
        { tone: 'cold', t: "That's just my face.", r: "That's your face? Then your face is a liar. A very cute liar. But fine. I'll stop. For now." },
        { tone: 'passive', t: "Maybe a little.", r: "A little! I'll take a little. A little is how all the best trouble starts. Ask anyone who knows me." },
        { tone: 'flirty', t: "Keep going. You're doing great.", r: "Oh, I know I am, but thanks for noticing. Next round: I make you laugh so hard you snort." },
      ] },
    ],
  },
  {
    id: 'spark-new-flirty-2', stage: 'new', mood: 'flirty', where: 'evening',
    say: "Rematch! Last time you said you'd let me win at karting. Tonight I'm winning for real. No letting. Helmet on.",
    opts: [
      { tone: 'cold', t: "I don't race amateurs.", r: "Amateurs! Ouch. I was going to give you the fast kart. Not now. You're getting the wobbly one.", opts: [
        { tone: 'cold', t: "Have them both. I'm not racing.", r: "Fine! I'll race myself and win twice. Watch from the side and clap. Or don't. Whatever." },
        { tone: 'passive', t: "One race. That's my limit.", r: "One race is all I need to crush you. And stop sulking. Sulking adds weight. It's science." },
        { tone: 'flirty', t: "Unless the amateur looks this good in a helmet.", r: "Oh, now I look good? After 'amateur'? Hmm. Get in your kart, flatterer. You're still losing." },
      ] },
      { tone: 'passive', t: "Fine. Best of three?", r: "Ooh, a series! Very serious. Loser sings a song of the winner's choice. At the counter. Loudly.", opts: [
        { tone: 'cold', t: "No songs. Just racing.", r: "No songs? Fun-sponge. Just racing, then. I'm still winning. Silently. And very smugly." },
        { tone: 'passive', t: "Fine. But I'm picking a long song.", r: "Pick what you like, you won't need it. I've been practising. Twice! In my head!" },
        { tone: 'flirty', t: "Deal. And the winner picks where we go after.", r: "Winner picks? I've already got somewhere in mind. Start sweating, hotshot. It's very fancy." },
      ] },
      { tone: 'flirty', t: "I'll let you win if I get to watch you celebrate.", r: "I celebrate big. Arms up, victory lap, the works. Wait. Are you letting me win right now? Is this it?", opts: [
        { tone: 'cold', t: "Never mind. I'll just win.", r: "Ugh, now you've made it a real race. No mercy, then! From me, I mean. You were never merciful." },
        { tone: 'passive', t: "No. Just get in the kart.", r: "Bossy! Suits you. In I get. And if I bump you at the first corner, it's an accident. Probably." },
        { tone: 'flirty', t: "You'll never know. That's the fun part.", r: "The not-knowing! That'll drive me mad all night. Game on. Eyes on the track, not on me." },
      ] },
    ],
  },
  {
    id: 'spark-new-flirty-3', stage: 'new', mood: 'flirty',
    say: "Hi, hello, me again! I've decided you're my favourite person here. You don't get a vote. It's been decided.",
    opts: [
      { tone: 'cold', t: "I'd like a vote.", r: "A... vote. That's the least fun thing anyone's said to me today. Votes are closed. Sorry.", opts: [
        { tone: 'cold', t: "Then I'll abstain.", r: "Abstain! Big word for 'boring'. Fine. You're demoted. The new favourite is the photographer." },
        { tone: 'passive', t: "Okay, okay. I accept the result.", r: "Gracious in defeat. Very sporting. That's going on your record. Gold star. Slightly bent." },
        { tone: 'flirty', t: "I'd have voted for you anyway.", r: "Then why make me sweat?! You're such a tease. I can tease back, you know. Watch me. Watch closely." },
      ] },
      { tone: 'passive', t: "Alright. What do favourites get?", r: "Great question! First pick of my snacks, my secrets, and a nickname. Yours is Turbo. Don't fight it.", opts: [
        { tone: 'cold', t: "I'll pass on the nickname.", r: "You can't pass on a nickname, it's not a sauce! Fine. 'Grumpy' it is. Happy now?" },
        { tone: 'passive', t: "Turbo. I can live with that.", r: "You'll love it by Friday. Everyone does. I nicknamed my agent and they cried. Happy tears! I think." },
        { tone: 'flirty', t: "What kind of secrets?", r: "The good kind. The kind you have to lean in for. ...Closer. Okay, not that close. I'm teasing. Mostly." },
      ] },
      { tone: 'flirty', t: "Good. I'd already picked you.", r: "Before me? That's not allowed, I pick first! ...Okay, that's very sweet. Very, very sweet.", opts: [
        { tone: 'cold', t: "Only because everyone else is boring.", r: "By default? You picked me by default?! I'm taking the medal back. Hand it over." },
        { tone: 'passive', t: "Mostly because of the laugh.", r: "My laugh? It's a honk! It's a goose being chased! You like the goose? You're strange. I love strange." },
        { tone: 'flirty', t: "And how you look at me when you think I'm not watching.", r: "I don't— okay, I do. Busted. Cards on the table: you're very lookable, hotshot. There. Happy?" },
      ] },
    ],
  },
  {
    id: 'spark-new-flirty-4', stage: 'new', mood: 'flirty',
    say: "Dare you to keep a straight face for ten seconds. Last time you didn't make it to five. I've been itching for a rematch.",
    opts: [
      { tone: 'cold', t: "I'm not playing games today.", r: "Not playing? Oh. That's a face I haven't seen. Is it a bad day or a bad me? Be honest.", opts: [
        { tone: 'cold', t: "Bad you.", r: "Oh. Right. Okay, then. I'll go and be a bad me somewhere else. Good luck this weekend, I suppose." },
        { tone: 'passive', t: "Bad day. Not you.", r: "Phew! A bad day I can fix. Ten seconds of me pulling faces. It's medically proven. Ready?" },
        { tone: 'flirty', t: "A day that just got better.", r: "Ha! Recovered! Nice save. Now the staring contest. Three, two— no blinking!" },
      ] },
      { tone: 'passive', t: "Fine. Ten seconds. Go.", r: "One... two... you're twitching... three... four... YES! Four! Even worse! I'm undefeated!", opts: [
        { tone: 'cold', t: "Fine, you win. Enjoy it.", r: "I will, thank you! Gracious losers are so rare. You weren't gracious, but I'm counting it." },
        { tone: 'passive', t: "That was a warm-up. Again.", r: "A warm-up! That's what all the losers say. Round two. I'm bringing out the big faces now." },
        { tone: 'flirty', t: "It's hard. You're very distracting up close.", r: "Up close is my best angle. Strategic. I'd apologise but I'm not sorry. Round two, and I'm leaning in." },
      ] },
      { tone: 'flirty', t: "I'll win this time. I've been practising looking at you.", r: "Practising? With what, a photo? Wait. Do you have a photo of me? I need to see it immediately.", opts: [
        { tone: 'cold', t: "No. Never mind.", r: "You can't drop that and leave! Fine. Mystery photo. I'll be thinking about it all week. Great. Brilliant." },
        { tone: 'passive', t: "A poster at the airport, actually.", r: "My airport poster? I look like I've seen a ghost in that one! Practise on a good one!" },
        { tone: 'flirty', t: "No photo. Just my memory. It's very good.", r: "Oh, stop. Fine. Ten seconds, go. ...You made it to two. I made it to one. I'm a wreck. Again!" },
      ] },
    ],
  },
];
