// Sunny - in-person conversations, stage 'new' (just met / acquaintances).
export const DATA = [
  // ---------------------------------------------------------------- NEW / COLD
  {
    id: 'sunny-new-cold-1', stage: 'new', mood: 'cold',
    say: [
      "Hi! Um. I brought you a mint. A peace mint. Last time felt wobbly and I'd like to start over, if that's allowed?",
      "Oh, hey. I nearly walked past, but that felt silly. I think we got off on the wrong foot last time? I'm sorry if I did that.",
    ],
    opts: [
      { tone: 'cold', t: "I don't need a mint. I need five minutes of quiet.", r: "Oh. Right. Okay, quiet. I can do quiet. I'm just going to... hold the mint, then.", opts: [
        { tone: 'cold', t: "Great. Off you go, then.", r: "Got it. I'll stop trying. I hope the quiet is nice, {me}. I really do." },
        { tone: 'passive', t: "Sorry. That came out sharp. Long day. I'll take the mint.", r: "Oh, thank goodness. Here. Long days are allowed. Mint-assisted long days are better, that's just science." },
        { tone: 'flirty', t: "Actually, stay. The quiet's nicer with you in it.", r: "That's a big swing from a second ago. I'm smiling, but I'm watching you. Carefully. Like a squirrel.", m: 1 },
      ] },
      { tone: 'passive', t: "Starting over sounds good. Hi, I'm {me}. Mint accepted.", r: "Hi {me}! I'm so relieved I could cry, and I won't, but I could. How's your week been? Properly?", opts: [
        { tone: 'cold', t: "Fine. Let's not make a whole thing of it.", r: "Oh. Okay. Not a whole thing. I'll keep it small, then. Tiny. Sorry for asking." },
        { tone: 'passive', t: "Busy. Sim sessions, early nights, far too much plain pasta.", r: "Plain pasta! No. I'm writing you a list of sauces. Easy ones. You deserve a sauce, {me}." },
        { tone: 'flirty', t: "Better now. Someone gave me a peace mint.", r: "Stop, I'm going pink. It was a very ordinary mint! You can't make an ordinary mint sound like that." },
      ] },
      { tone: 'flirty', t: "You came back after I was rude? That's either brave or you like me.", r: "Hah! Um. Can it be both? It's mostly brave. Like sixty-forty. Please don't do the maths on that.", opts: [
        { tone: 'cold', t: "Don't read into it. I was only teasing.", r: "Oh. Teasing. I knew that. I'll go back to sixty percent brave and zero percent anything else." },
        { tone: 'passive', t: "Either way, I'm glad you did. I wasn't great last time.", r: "Thank you for saying that. Really. Okay, clean slate. I'm already drawing little flowers on it in my head." },
        { tone: 'flirty', t: "Forty percent is plenty. I'll take it.", r: "You're making my ears hot. That's never happened to me from one sentence. Okay. Forty-one." },
      ] },
    ],
  },
  {
    id: 'sunny-new-cold-2', stage: 'new', mood: 'cold',
    say: "Oh, hi. I wasn't sure I should come over. You seemed kind of far away last time. Was that about me?",
    opts: [
      { tone: 'cold', t: "It wasn't about anything. You're overthinking it.", r: "Maybe. I do that. It just felt like a door closing, and I'm terrible at not knocking.", opts: [
        { tone: 'cold', t: "Then stop knocking.", r: "Okay. That's clear. I'll leave it there, {me}. You know where I am if that changes." },
        { tone: 'passive', t: "That was harsh. Sorry. I get closed off before a race weekend.", r: "Oh, that makes so much sense. I go quiet before the dentist. Not the same, I know. Thanks for telling me." },
        { tone: 'flirty', t: "Knock all you like. I might open up for you.", r: "Is that a promise or a riddle? I'm flustered and a bit suspicious, which is a brand new combo for me.", m: 1 },
      ] },
      { tone: 'passive', t: "Not you. I was in my own head about {track}. I'm sorry.", r: "Oh! Phew. {track} is a big one, isn't it? What's the scary bit? You can tell me, I won't tell the track.", opts: [
        { tone: 'cold', t: "I'd rather not talk racing with someone who doesn't race.", r: "Fair. I don't know it like you do. I was only trying to carry a corner of it. I'll stop." },
        { tone: 'passive', t: "The first corner. Everyone arrives at once, like a January sale.", r: "Like a sale! Now I'm picturing everyone in tiny cars fighting over a cheap telly. Thank you for that." },
        { tone: 'flirty', t: "Talking to you's making it less scary already.", r: "Oh gosh. Okay. I'll be your official un-scarer, then. I'll need a badge. A little one. With a sun on." },
      ] },
      { tone: 'flirty', t: "Far away? I was trying very hard not to stare at you, that's all.", r: "Wait. What? You were... no. I've been sad about it for three days and you were STARING?", opts: [
        { tone: 'cold', t: "Relax, it's a figure of speech.", r: "Oh. A figure of speech. Okay. I'll put my face back to its normal colour, then. Bye for now." },
        { tone: 'passive', t: "Honestly, I was distracted. But not because you were boring.", r: "That's the nicest backwards compliment I've ever had. I'm keeping it. It's going in my good-things jar." },
        { tone: 'flirty', t: "Trying and failing. Like right now.", r: "Stop it, I'm laughing and blushing at once and it's making a noise. A snort. That was a snort. Hi." },
      ] },
    ],
  },
  {
    id: 'sunny-new-cold-3', stage: 'new', mood: 'cold', where: 'evening',
    say: "Hey. I kept replaying our last chat on the way to {venue}. If I said something weird, I'm sorry. I say weird things.",
    opts: [
      { tone: 'cold', t: "You did. Let's just have a normal evening.", r: "Okay. Normal. I can try normal. I'll keep my weird folded up in my pocket tonight.", opts: [
        { tone: 'cold', t: "Good. Keep it there.", r: "Right. Understood. I'll enjoy my food and you enjoy yours. Separately is fine." },
        { tone: 'passive', t: "Actually, take it out. Tell me something weird.", r: "Really? Okay. Sea otters keep a favourite rock in a little pocket under their arm. I want a rock pocket." },
        { tone: 'flirty', t: "Kidding. Your weird is the best bit of you.", r: "You can't do mean then lovely, my heart doesn't know which way to go! It's going lovely. Slowly.", m: 1 },
      ] },
      { tone: 'passive', t: "You didn't. I was the off one. Fresh start over dinner?", r: "Yes! Fresh start. I'll go first: hi, I've already read the dessert menu twice. Your turn.", opts: [
        { tone: 'cold', t: "I'm not doing a whole bit, just pick something.", r: "Oh. Sorry. Just the soup, then. I'll be quiet and soupy over here." },
        { tone: 'passive', t: "Hi, I already know I'm having the sticky toffee one.", r: "A dessert-first thinker! We're going to get along. I'm writing that down. Mentally. In pen." },
        { tone: 'flirty', t: "Hi. I'm already glad I sat opposite you.", r: "Oh. Oh, that's... okay, I need a sip of water. That was very direct for a starter course." },
      ] },
      { tone: 'flirty', t: "Weird is fine. I spent all week thinking about you, if that helps.", r: "All week? I thought you'd gone off me. My poor heart's been doing laps. Is it okay to be pleased?", opts: [
        { tone: 'cold', t: "Don't make it a big deal.", r: "Okay. Not a big deal. I'll be a very small amount of pleased, quietly, over here." },
        { tone: 'passive', t: "Of course it's okay. I owed you a better evening than last time.", r: "This is already better. And we haven't even had the bread. Bread's usually my high point." },
        { tone: 'flirty', t: "Be pleased. I'll make up every lap.", r: "Every lap? There's so many laps, {me}. That's going to take ages. Hehe. I don't mind ages." },
      ] },
    ],
  },
  {
    id: 'sunny-new-cold-4', stage: 'new', mood: 'cold',
    say: "I'm going to be brave and say hello anyway. Hello! Is today a better day than last time? I hope so.",
    opts: [
      { tone: 'cold', t: "Same as any other day.", r: "Oh. I'm sorry it's a flat sort of day. I don't want to make it worse by hovering.", opts: [
        { tone: 'cold', t: "Then don't hover.", r: "Right. I'll go. I'm not cross. I just don't think I should keep trying today." },
        { tone: 'passive', t: "Hover a bit. I'm bad at saying sorry, but I am.", r: "Oh, {me}. That counts. That totally counts. Okay, I'm hovering. Hover mode on." },
        { tone: 'flirty', t: "It's a slightly better day now you're here.", r: "Slightly better? I'll take slightly. I'm aiming for medium, though. Stick around and see." },
      ] },
      { tone: 'passive', t: "Better, thanks. And I owe you a proper hello. Hello.", r: "Hello! Oh, that's lovely. Okay, tell me one good thing that happened today. One. Tiny counts.", opts: [
        { tone: 'cold', t: "I'm not playing a game.", r: "It's not a game, really. It's just a thing I do. Never mind. Sorry." },
        { tone: 'passive', t: "The coffee machine at the hotel finally worked.", r: "A working coffee machine! Top tier. Mine is I finally got {work} to behave. Ish. Mostly ish." },
        { tone: 'flirty', t: "You walked over even though I was rubbish. That's my good thing.", r: "That's so nice I don't know where to put my hands. Pockets. They're going in my pockets." },
      ] },
      { tone: 'flirty', t: "It is now. You're braver than me, you know.", r: "Me? Brave? I once apologised to a lamp post. But I'll take it! I'll take brave from you.", opts: [
        { tone: 'cold', t: "It wasn't a compliment, just an observation.", r: "Oh. Okay. I'll file it under observations, then. Not the compliments drawer. Shame." },
        { tone: 'passive', t: "You apologised to a lamp post? I need that story.", r: "I walked into it and said sorry! Then I said 'oh, it's you' like we'd met. We hadn't. I've grown since." },
        { tone: 'flirty', t: "Be brave again sometime. Ask me out.", r: "Ask you OUT? Oh my gosh. Okay. Not today, I'd faint. But soon. I'm writing it on my hand." },
      ] },
    ],
  },

  // ------------------------------------------------------------- NEW / PASSIVE
  {
    id: 'sunny-new-passive-1', stage: 'new', mood: 'passive',
    say: "Hi! Can I ask you something I've wondered since we met? What do you actually think about, going that fast?",
    opts: [
      { tone: 'cold', t: "Nothing. That's the point. Can we skip the interview?", r: "Oh. Sorry, yes. I get curious and it comes out like a quiz show. Too many questions, I know.", opts: [
        { tone: 'cold', t: "Way too many.", r: "Okay. I'll stop. Sorry for crowding you, {me}. Have a good one." },
        { tone: 'passive', t: "No, I was short. Mostly I think about braking points. And lunch.", r: "Braking points and lunch! That's so human. I thought it'd be all lasers and maths. I love lunch too." },
        { tone: 'flirty', t: "Ask me one more. Make it a good one.", r: "Ooh, pressure! Um. Would you ever wave at someone mid-race? Would you wave at me? Too far? Hehe." },
      ] },
      { tone: 'passive', t: "Mostly nothing, which is the nicest bit. It goes really quiet in my head.", r: "Oh, that's beautiful. Like being underwater in a pool, when everything goes soft. Is it like that?", opts: [
        { tone: 'cold', t: "Not really. You wouldn't get it.", r: "Maybe not. I'd have liked to try, though. Okay. I'll leave you to your quiet." },
        { tone: 'passive', t: "A bit like that. Except the pool's trying to throw you off.", r: "A grumpy pool. Okay, I can picture it now. Thank you for explaining it so nicely. I mean that." },
        { tone: 'flirty', t: "It's not quiet right now, though. You're quite distracting.", r: "I'm distracting? Me? My cardigan's missing a button! Oh no, now you're looking at the button." },
      ] },
      { tone: 'flirty', t: "Right now? Whether you'd let me buy you a coffee.", r: "Oh! That's not a racing thought. That's a... coffee thought. Wait, are you asking? Are you asking me?", opts: [
        { tone: 'cold', t: "Forget it. Bad joke.", r: "Oh. A joke. Ha. Okay. I'll just go and press my face against something cold." },
        { tone: 'passive', t: "I'm asking. No pressure, though.", r: "Then yes! Coffee, yes. I'll be the one ordering something with far too much cream. You've been warned." },
        { tone: 'flirty', t: "I'm asking. You can say no, but you're smiling.", r: "I am smiling, you caught me, I'm smiling so much it's embarrassing. Yes. Obviously yes." },
      ] },
    ],
  },
  {
    id: 'sunny-new-passive-2', stage: 'new', mood: 'passive', where: 'party',
    say: "Oh, thank goodness, a face I know! I've been holding this lemonade for twenty minutes so I look like I belong here.",
    opts: [
      { tone: 'cold', t: "You don't really. It's a team party.", r: "Oh. Right. A friend brought me. I'll go and stand by the snacks. Snacks don't judge.", opts: [
        { tone: 'cold', t: "Good idea.", r: "Okay. Enjoy your party, {me}. I'll go and find my friend. Bye." },
        { tone: 'passive', t: "Sorry, that was rude. You belong as much as anyone. Stay.", r: "Oh! Thank you. I was about to go hide in the coats. Can we stand here and be awkward together?" },
        { tone: 'flirty', t: "Kidding. Stand next to me and you belong instantly.", r: "Is that how it works? I like that rule. I'm not sure about the bit before it, but I like the rule.", m: 1 },
      ] },
      { tone: 'passive', t: "Want a refill? I'll show you where they hide the good snacks.", r: "There are GOOD snacks? I've been eating pretzels that taste like a shoebox! Show me everything.", opts: [
        { tone: 'cold', t: "They're over there. See you later.", r: "Oh. Okay, thanks. I thought we might go together. Never mind! See you." },
        { tone: 'passive', t: "Mini cheese things, behind the DJ. Insider info.", r: "Behind the DJ! Sneaky. You're a good person to know at a party, {me}. Five-star review from me." },
        { tone: 'flirty', t: "Only if you dance with me after.", r: "A snack-for-dance trade? Oh gosh. I dance like a flustered heron. Okay. One song. Maybe two." },
      ] },
      { tone: 'flirty', t: "You belong next to me. Problem solved.", r: "Oh! Well. That's a very solving thing to say. I'm going to drink my lemonade very fast now.", opts: [
        { tone: 'cold', t: "Don't get the wrong idea.", r: "Oh. Okay. No ideas. My head's empty. Totally empty. I'll go back to my lemonade." },
        { tone: 'passive', t: "Seriously, stick around. It's better with someone to laugh with.", r: "Deal. I'm good at laughing. I've got about four laughs and one of them is a honk. Stay for the honk." },
        { tone: 'flirty', t: "Slow down, I want you to stay a while.", r: "I'm staying. I'm very staying. Look at me staying. Sorry, the music's loud and so is my heart." },
      ] },
    ],
  },
  {
    id: 'sunny-new-passive-3', stage: 'new', mood: 'passive',
    say: "Random question, but do you have a lucky thing? Socks, a song, a sandwich? I need to know for... reasons.",
    opts: [
      { tone: 'cold', t: "Luck's for people who aren't prepared.", r: "Oh. Right. That's a bit sad, I think. I have a lucky spoon. I'll keep it to myself.", opts: [
        { tone: 'cold', t: "Probably best.", r: "Okay. The spoon stays in the drawer. See you around, {me}." },
        { tone: 'passive', t: "A lucky spoon? Okay, I need the full story.", r: "It's got a duck on the handle and I ate cereal with it before every exam. I passed them all. Coincidence? No." },
        { tone: 'flirty', t: "Maybe you could be my lucky thing.", r: "Your lucky... me? I'm not even waterproof! Oh gosh. I mean. I'll try my best. I'll be very lucky." },
      ] },
      { tone: 'passive', t: "I put my left glove on first. Every time. Don't tell anyone.", r: "Left glove first! I'll guard it with my life. Mine is humming the same song before anything scary. Badly.", opts: [
        { tone: 'cold', t: "Don't turn it into a thing.", r: "Oh, sorry. It just felt nice to share. I'll forget it. I won't, but I'll pretend." },
        { tone: 'passive', t: "What song?", r: "The one from the cereal advert. With the dancing cow. I know. I KNOW. It works though!" },
        { tone: 'flirty', t: "Hum it for me before {track}. For luck.", r: "You'd want that? Okay, but you can't look at me while I hum. I go red and it ruins the notes." },
      ] },
      { tone: 'flirty', t: "Why, are you planning to be my lucky charm?", r: "I... no! Maybe. I was going to knit you something. Small! A small knitted thing. Oh, I've said it now.", opts: [
        { tone: 'cold', t: "Please don't knit me anything.", r: "Oh. Okay. No knitting. I'll unravel it. It was only a little one, anyway. Sorry." },
        { tone: 'passive', t: "A knitted thing? I'd honestly love that.", r: "Really? It's going to be wonky. Very wonky. But it'll be your wonky. I'll pick a fast colour." },
        { tone: 'flirty', t: "Knit quickly. I want to wear something you made.", r: "Something I MADE? You can't just... okay. I'm going to knit in a cupboard and calm down. Bye! Hi. Bye." },
      ] },
    ],
  },
  {
    id: 'sunny-new-passive-4', stage: 'new', mood: 'passive', where: 'evening',
    say: "You're here! I came for the charity karting and a kid in a dinosaur helmet has already lapped me twice. Help?",
    opts: [
      { tone: 'cold', t: "I'm here to drive, not to coach.", r: "Oh, of course. Sorry. You must get asked all the time. I'll go and get lapped again.", opts: [
        { tone: 'cold', t: "Try not to block the racing line.", r: "Right. I'll stay out of your way. Have fun out there, {me}." },
        { tone: 'passive', t: "Ignore me. Brake earlier than you think, then floor it out.", r: "Brake early, then floor it. Got it! I'll whisper that to myself the whole lap. Thank you." },
        { tone: 'flirty', t: "Fine. One lesson. You'll owe me a hot chocolate.", r: "Deal! A hot chocolate for a lesson. With marshmallows. I always pay my debts in marshmallows." },
      ] },
      { tone: 'passive', t: "Of course. The trick is looking where you want to go, not at the wall.", r: "Oh! I've been glaring at the wall like it's my enemy. Look at the gap, not the wall. That's life advice too.", opts: [
        { tone: 'cold', t: "It's just karting. Don't get deep about it.", r: "Sorry, I turn everything into a fridge magnet. I'll just drive. Bye, coach." },
        { tone: 'passive', t: "You're not wrong. Go on, I'll watch your next run.", r: "You'll watch? Now I'm nervous and brave at the same time. Shout if I hit something. Shout nicely." },
        { tone: 'flirty', t: "Then look at me on the hairpin. I'll be the gap.", r: "That's either terrible advice or the best line anyone's said to me at a kart track. Both? Both." },
      ] },
      { tone: 'flirty', t: "Ride with me. I'll show you the fast way round.", r: "Ride with you? They're one-seaters, {me}! Oh. You meant... oh. I need a minute. My helmet's steaming up.", opts: [
        { tone: 'cold', t: "I meant watch me. Obviously.", r: "Obviously! Yes. I knew that. I'm going to go and stand in a puddle to cool down." },
        { tone: 'passive', t: "I meant watch from the side. Then you try it.", r: "Okay, teacher. I'll watch and copy. Then I'll go too slow and you can laugh. Deal?" },
        { tone: 'flirty', t: "I meant watch. But I like where your head went.", r: "My head didn't GO anywhere! Okay, a tiny bit. Stop grinning. The dinosaur kid is staring at us." },
      ] },
    ],
  },

  // -------------------------------------------------------------- NEW / FLIRTY
  {
    id: 'sunny-new-flirty-1', stage: 'new', mood: 'flirty',
    say: "Oh! Hi. Hello. Sorry, I practised saying hi on the way here and it still came out as three hellos.",
    opts: [
      { tone: 'cold', t: "Practised? That's a bit much.", r: "Oh. I suppose it is. I just wanted it to go well. It's fine, I'll stop practising.", opts: [
        { tone: 'cold', t: "Maybe save it for someone who's into it.", r: "Okay. Message received. That stings, but okay. Take care, {me}." },
        { tone: 'passive', t: "Sorry. I'm not used to anyone making an effort for me.", r: "Oh, {me}. Then I'll make lots of effort and you can get used to it. That's my plan now." },
        { tone: 'flirty', t: "Actually, it worked. All three hellos.", r: "They worked? All three? I'm giving each one a gold star. You're very confusing, you know that?", m: 1 },
      ] },
      { tone: 'passive', t: "Three is a good number. Hello, hello, hello. How are you?", r: "Hehe, you matched me! I'm good. Fizzy. Like someone shook me up. How are you? Properly, not the fast version.", opts: [
        { tone: 'cold', t: "I'm fine. The fast version's all you get.", r: "Oh. Okay. Fast version noted. I'll go and bubble somewhere else." },
        { tone: 'passive', t: "Properly? Tired. Happy to see a friendly face.", r: "I'm very friendly! It's my main feature. Come and sit. I'll tell you about my week and you just listen." },
        { tone: 'flirty', t: "Better now you're fizzing at me.", r: "I am fizzing AT you, aren't I. Somebody stop me, I'm about to say something embarrassing." },
      ] },
      { tone: 'flirty', t: "If you practised, I'd love to hear the version you rehearsed.", r: "No! Never. It had a joke about gearboxes in it. I looked up gearboxes for you. Oh no. I've said too much.", opts: [
        { tone: 'cold', t: "You didn't need to research me.", r: "Oh. It was only a bit of reading. I'll unlearn it. Gearboxes, gone." },
        { tone: 'passive', t: "You looked up gearboxes? That's genuinely sweet.", r: "I didn't understand any of it. There was a diagram with a lot of circles. But I tried! For you." },
        { tone: 'flirty', t: "Tell me the gearbox joke. I'll laugh even if it's bad.", r: "Why did the gearbox go to therapy? Too many shifts. I'm sorry. Don't laugh. You laughed! Ahh." },
      ] },
    ],
  },
  {
    id: 'sunny-new-flirty-2', stage: 'new', mood: 'flirty',
    say: "I may have thought about what you said last time a normal amount. A healthy amount. About eleven times. Hi!",
    opts: [
      { tone: 'cold', t: "Eleven is a lot. I don't even remember what I said.", r: "Oh. You don't? Right. That's okay. It was a small thing. I'll stop counting.", opts: [
        { tone: 'cold', t: "Probably for the best.", r: "Okay. I'll keep my eleven to myself, then. See you, {me}." },
        { tone: 'passive', t: "Sorry, that sounded awful. Remind me? I want to remember.", r: "You said my laugh sounds like a kettle getting excited. It's silly. I liked it. Thank you for asking." },
        { tone: 'flirty', t: "Kidding. I said your laugh is like an excited kettle. I meant it.", r: "You DO remember! Okay. Okay okay okay. I'm going to boil now. In a good way. A kettle way." },
      ] },
      { tone: 'passive', t: "Eleven's fair. I thought about you too, honestly.", r: "You did? Oh! That makes me feel less silly. What did you think? Nice things? Normal things?", opts: [
        { tone: 'cold', t: "Just that you talk a lot.", r: "Oh. Ha. I do talk a lot. I'll work on it. Bye for now." },
        { tone: 'passive', t: "Nice things. That you're easy to be around.", r: "Easy to be around. That's my favourite kind of nice. I'm going to think about that one twelve times." },
        { tone: 'flirty', t: "That I wanted to see you again. And here you are.", r: "Here I am! In my good jumper, which I absolutely didn't pick on purpose. Okay, I did. Hi." },
      ] },
      { tone: 'flirty', t: "Only eleven? I'll have to try harder this time.", r: "Harder?! I'll be at twenty by Sunday. I'll have to cancel things. My plants will wilt. Worth it?", opts: [
        { tone: 'cold', t: "I'm joking. Don't cancel anything for me.", r: "Oh. No, of course. Joking. I'll keep my plans. And my plants. Okay. Bye." },
        { tone: 'passive', t: "Don't let the plants wilt. I'll text instead, save you the thinking.", r: "Texting! Then I can reread instead of remembering. That's efficient. You're very efficient." },
        { tone: 'flirty', t: "Worth it. Let the plants fend for themselves.", r: "You're a terrible influence and I'm grinning. Sorry, ferns. Someone very charming needs me." },
      ] },
    ],
  },
  {
    id: 'sunny-new-flirty-3', stage: 'new', mood: 'flirty', where: 'party',
    say: "You came! I mean, obviously you came, it's your party. Kind of. Hi. I'm already blushing, so ignore my face.",
    opts: [
      { tone: 'cold', t: "It's a sponsor thing. I have to be here.", r: "Oh. A work thing. Of course. Sorry, I got excited. I'll stop pointing my face at you.", opts: [
        { tone: 'cold', t: "I've got people to talk to.", r: "Of course. Go. I won't take up your night. Have a good party, {me}." },
        { tone: 'passive', t: "Sorry, that's not you. These things wear me out. I'm glad you came.", r: "Okay. That helps. Shall I get us drinks and you can rant about sponsors? I'm a great ranting audience." },
        { tone: 'flirty', t: "Work brought me here. You're why I'm staying, though.", r: "Oh, that's a good save. Like a goalkeeper. A diving one. I'm still a bit hurt, but I'm smiling again.", m: 1 },
      ] },
      { tone: 'passive', t: "I'm glad you're here. Want a drink? They do a decent mocktail.", r: "Ooh, yes please! Something with a little umbrella. I judge drinks entirely by their umbrellas.", opts: [
        { tone: 'cold', t: "They don't do umbrellas. Grab whatever.", r: "Oh. Okay. I'll find something. Thanks, I suppose." },
        { tone: 'passive', t: "I'll get the bartender to find you an umbrella. Two, even.", r: "Two umbrellas! You understand me. Best party I've been to, and I once went to a pony party." },
        { tone: 'flirty', t: "I'll find you an umbrella if you stop hiding that blush.", r: "I can't stop it, it's just how my face is now. Fine. Here. Full blush. Happy? Ahh, you are." },
      ] },
      { tone: 'flirty', t: "Don't hide the blush. It's the best thing at this party.", r: "Better than the chocolate fountain? That's a big claim. That fountain is very... flowy. Oh, I'm babbling.", opts: [
        { tone: 'cold', t: "Don't get carried away. It's a party line.", r: "Oh. A party line. I'll file it with the other party lines. And the coats. Bye." },
        { tone: 'passive', t: "Fine, second best. The fountain's hard to beat.", r: "An honest ranking! I respect that. Let's go and ruin our outfits at the fountain. Together." },
        { tone: 'flirty', t: "Better than the fountain. And sweeter.", r: "Okay, you've broken me. I need to sit down. Sit with me? Close? Not too close. Okay, a bit close." },
      ] },
    ],
  },
  {
    id: 'sunny-new-flirty-4', stage: 'new', mood: 'flirty',
    say: "I told my plant about you. Is that weird? Dennis thinks you're charming. Dennis is a fern. He's a very good judge.",
    opts: [
      { tone: 'cold', t: "You told a plant about me? That's odd.", r: "Oh. I suppose it is odd. I talk to everything. Kettles, birds. I didn't mean it to be strange.", opts: [
        { tone: 'cold', t: "Tell Dennis I'm not interested.", r: "Okay. Dennis will be sad. So am I, a bit. Bye, {me}." },
        { tone: 'passive', t: "Sorry. Odd's not bad. What else did you tell Dennis?", r: "That you were kind to the waiter and laughed at my duck fact. That's all. Dennis is very discreet." },
        { tone: 'flirty', t: "Odd, but I'm flattered. Dennis has taste.", r: "Doesn't he? He hated my last houseguest. You're officially fern-approved. It's a big deal round mine." },
      ] },
      { tone: 'passive', t: "Not weird. I talk to my car. Tell Dennis I said hi.", r: "You talk to your car! Oh, that's wonderful. What do you say? Do you say please? I bet you say please.", opts: [
        { tone: 'cold', t: "I'm not telling you that.", r: "Okay. Private car chats. I get it. I'll leave you to it." },
        { tone: 'passive', t: "Mostly 'come on, come on'. And sorry, after kerbs.", r: "You apologise after kerbs! I knew it. You're a softie. Dennis and I have a lot to discuss." },
        { tone: 'flirty', t: "I say 'get me home fast'. Usually to see someone.", r: "Which someone? Is it... no. Don't answer, I'll explode. I'll ask Dennis later." },
      ] },
      { tone: 'flirty', t: "Dennis is right. Did you tell him I think you're cute?", r: "You think I'm... oh. Oh no. Now I have to go home and tell him. He'll be unbearable.", opts: [
        { tone: 'cold', t: "I said cute. Not that I like you.", r: "Oh. Right. Cute like a stapler. Got it. I'll tell Dennis the boring version." },
        { tone: 'passive', t: "Tell him. And tell him I'd like to meet him sometime.", r: "Meet Dennis? That's like meeting the family! Okay, but he's shy. Be gentle with his fronds." },
        { tone: 'flirty', t: "Tell him I think you're very cute. And that I'd like your number.", r: "My NUMBER? Okay. Here. I wrote it on a napkin with a little sun next to it. Don't laugh at the sun." },
      ] },
    ],
  },
];
