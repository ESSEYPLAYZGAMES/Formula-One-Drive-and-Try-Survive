// Sunny - in-person conversations, stage 'warm' (friendly, flirting, getting closer).
export const DATA = [
  // --------------------------------------------------------------- WARM / COLD
  {
    id: 'sunny-warm-cold-1', stage: 'warm', mood: 'cold',
    say: "Hey. I've been trying to work out what I did last time. I'd rather you just tell me than go quiet on me, {me}.",
    opts: [
      { tone: 'cold', t: "You didn't do anything. I just wasn't in the mood.", r: "Okay. But it felt like you weren't in the mood for me, specifically. Am I wrong? I'd like to be wrong.", opts: [
        { tone: 'cold', t: "I don't owe you an explanation every time.", r: "No. You don't. I'll stop asking for one. I think I need a little space from this, {me}." },
        { tone: 'passive', t: "You're wrong. It was the week, not you. I should've said.", r: "Thank you. That's all I needed, honestly. I can do a bad week. I just can't do guessing." },
        { tone: 'flirty', t: "You're wrong. I'm always in the mood for you.", r: "That's lovely and also a bit slippery. I'm smiling. Cautiously. Like a cat near a bath.", m: 1 },
      ] },
      { tone: 'passive', t: "You did nothing. I took my mood out on you, and I'm sorry.", r: "Oh. Thank you for saying it straight. That means a lot. Do you want to tell me what the mood was about?", opts: [
        { tone: 'cold', t: "Not really, no.", r: "Okay. That's alright. The offer stands. I'll be over here being a good listener, if you change your mind." },
        { tone: 'passive', t: "Contract stuff. It's been chewing on me all month.", r: "Ugh, contracts. I signed one as a {job} once and cried in a lift. Come on, pastry's on me. You can grumble." },
        { tone: 'flirty', t: "It doesn't matter now. Being here with you's fixing it.", r: "Is that true? Because if I'm a fixer, I'd like to be called out more often. Like a nice plumber." },
      ] },
      { tone: 'flirty', t: "What you did was look this good. I panicked.", r: "Oh, come on. You don't get to be cold and then flirt your way out. That's cheating. It's working a bit.", opts: [
        { tone: 'cold', t: "Fine, forget I said it.", r: "See, that's the bit that hurts. You open the door and shut it again. I'll just stand back from it." },
        { tone: 'passive', t: "You're right. That was a dodge. I'm sorry, really.", r: "Thank you. I forgive you. I'm a fast forgiver, it's a flaw. Let's start this chat over, slower." },
        { tone: 'flirty', t: "Then let me cheat a bit more. You're gorgeous when you're cross.", r: "I'm not cross, I'm CONCERNED. Okay, now I'm laughing. You're impossible. Fine. Forgiven. Mostly." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-cold-2', stage: 'warm', mood: 'cold',
    say: "I made you a playlist after last time. Then I wasn't sure I should give it to you. So it's just... in my pocket. Hi.",
    opts: [
      { tone: 'cold', t: "You don't have to give me things.", r: "I know. I wanted to. That's the whole point of giving things. But okay. It can live in my pocket.", opts: [
        { tone: 'cold', t: "Keep it there.", r: "Alright. I'll stop trying so hard. Maybe you'll miss it one day, maybe not. Bye, {me}." },
        { tone: 'passive', t: "Sorry. I'm bad at receiving stuff. I'd like it, actually.", r: "Really? Here. Song four is the one I cried at in a car park. Don't skip it." },
        { tone: 'flirty', t: "Unless it's all love songs. Then I want it immediately.", r: "It is NOT all love songs. It's seven love songs. And one about a lighthouse. Fine. Take it." },
      ] },
      { tone: 'passive', t: "You made me a playlist? After I was a pain? Can I hear it?", r: "You can! It's called 'for the car, or the hotel, or whatever'. I'm bad at names. Song two's a bop.", opts: [
        { tone: 'cold', t: "That's a terrible name.", r: "It is a terrible name. You didn't have to say it like that, though. Okay. Enjoy the songs." },
        { tone: 'passive', t: "I'll play it on the drive to {track}. Pre-race ritual.", r: "My playlist's going to {track}? That's the most famous my songs have ever been. I'm so proud of them." },
        { tone: 'flirty', t: "I'll rename it 'from someone I can't stop thinking about'.", r: "You can't rename it THAT, I'll see it on your screen and perish. Okay, you can. But warn me first." },
      ] },
      { tone: 'flirty', t: "Is there a song on it about me?", r: "What? No! There might be. Song six. It's about someone very annoying and very... nice. Mostly annoying.", opts: [
        { tone: 'cold', t: "Annoying? Great. Thanks.", r: "You WERE annoying! That's why I made it! Okay. Maybe song six stays with me." },
        { tone: 'passive', t: "Fair. I was annoying. I'll listen and earn the nice bit back.", r: "That's a good deal. Listen properly. The chorus is where the nice bit lives. Hehe." },
        { tone: 'flirty', t: "Annoying and nice. I'll take it. Play it for me now?", r: "Here? Now? Fine. One earbud each. Stand close. Not that close. Okay. That close." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-cold-3', stage: 'warm', mood: 'cold', where: 'evening',
    say: "I almost didn't come tonight. But I'd rather sit across from you feeling awkward than wonder about it at home.",
    opts: [
      { tone: 'cold', t: "We can just eat. No need for a heart-to-heart.", r: "Okay. Just eat. I can do that. The bread's good, at least. The bread's on my side.", opts: [
        { tone: 'cold', t: "Good. Let's keep it simple.", r: "Simple it is. I'll finish my pasta and get a taxi. I think I'm done trying tonight." },
        { tone: 'passive', t: "Sorry. I'm glad you came. I was a mess last time.", r: "That helps loads. You were a bit of a mess. I'm a bit of a mess too. Mess twins. Pass the bread." },
        { tone: 'flirty', t: "Unless the heart-to-heart is about how good you look tonight.", r: "That's a nice line and I'm not sure I'm allowed to like it yet. I'm going to eat a breadstick and think." },
      ] },
      { tone: 'passive', t: "I'm really glad you came. I wasn't fair to you last time.", r: "Thank you. I knew you were nicer than last time. I told myself so the whole bus ride. It worked.", opts: [
        { tone: 'cold', t: "Let's not dwell on it.", r: "Okay. Not dwelling. But I wanted it said, and now it's said. We can have a quiet dinner." },
        { tone: 'passive', t: "Can I make it up to you? Dessert's on me.", r: "You can make it up to me with dessert, yes. I'm very forgiving where sponge cake's involved." },
        { tone: 'flirty', t: "Let me make it up to you. Every week. Starting tonight.", r: "Every week? That's a lot of making up. That sounds like... dating. Oh. Oh, that's what you mean. Hi." },
      ] },
      { tone: 'flirty', t: "Wondering about me at home? Best news I've had all week.", r: "Not like THAT! Okay, a bit like that. But you were frosty, and I'm still a little bit frosty back.", opts: [
        { tone: 'cold', t: "Then stay frosty. Doesn't bother me.", r: "It bothers me, though. I don't like being frosty. I'll let you get on with your dinner." },
        { tone: 'passive', t: "That's fair. I'll be better. I want this to be good.", r: "So do I. Okay. Frost melting. Slowly. Like a freezer you forgot to defrost. Romantic, right?" },
        { tone: 'flirty', t: "I'll thaw you out. Give me till dessert.", r: "Till dessert? You're very sure of yourself. I'm ordering the biggest one so it takes ages. Hehe." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-cold-4', stage: 'warm', mood: 'cold',
    say: "Can we try a do-over? I'll go first. Hi! I'm really happy to see you and I wore my lucky socks. Your turn.",
    opts: [
      { tone: 'cold', t: "I don't really do do-overs.", r: "Oh. That's a shame, I'm quite good at them. I had a whole speech. It had a bit about socks.", opts: [
        { tone: 'cold', t: "I don't need to hear the speech.", r: "Okay. I'll keep it. Maybe for someone who wants a do-over. Take care, {me}." },
        { tone: 'passive', t: "Sorry. Let me try. Hi. It's good to see you, and I owe you an apology.", r: "There! That was a great do-over. You did it beautifully. Do you want to see the socks? They have bees on." },
        { tone: 'flirty', t: "I'll make an exception. Show me the lucky socks.", r: "Here! Bees. Very lucky, very fuzzy. Are you smiling? You're smiling. The do-over's working." },
      ] },
      { tone: 'passive', t: "Hi. I'm happy to see you. I was rubbish last time and I'm sorry.", r: "That was perfect. Ten out of ten do-over. Can I give you a hug? A quick one? A friendly one?", opts: [
        { tone: 'cold', t: "No hugs, please.", r: "Oh. No hugs. I'll do a little wave instead. There. Okay. Bye for now." },
        { tone: 'passive', t: "Of course you can. Come here.", r: "Oh, you're a good hugger. I'm noting that down. 'Good hugger, terrible at sorry, getting better.'" },
        { tone: 'flirty', t: "Friendly's fine. Maybe a bit longer than friendly.", r: "Longer than friendly? I'm counting. One, two, three... okay, that's a lot of seconds. My face is very warm." },
      ] },
      { tone: 'flirty', t: "Hi. I wore nothing lucky, but I'm lucky you came back.", r: "Oh! That was a strong do-over. You've been practising. Have you been practising? You have.", opts: [
        { tone: 'cold', t: "It just came out. Don't make it weird.", r: "I'm not making it weird, you're... ugh. Okay. I'll stop. That was so close to being nice." },
        { tone: 'passive', t: "Maybe a bit. I wanted to get it right this time.", r: "You got it right. Really. Thank you for trying. That's the bit that matters to me." },
        { tone: 'flirty', t: "In the mirror. Every night. It's always about you.", r: "Every NIGHT? Picturing you practising at a mirror is the cutest thing. Say it again. Go on." },
      ] },
    ],
  },

  // ------------------------------------------------------------ WARM / PASSIVE
  {
    id: 'sunny-warm-passive-1', stage: 'warm', mood: 'passive', where: 'party',
    say: "Rescue me? Someone's been explaining tyre pressure to me for twenty minutes and I've nodded at all of it.",
    opts: [
      { tone: 'cold', t: "Just walk away. You're an adult.", r: "I know, but walking away feels rude, and I'm bad at rude. I thought you'd help. Never mind.", opts: [
        { tone: 'cold', t: "Not my job to rescue you.", r: "No, it isn't. I'll manage. Enjoy your drink, {me}." },
        { tone: 'passive', t: "Sorry. Come on, I'll fake an emergency for you.", r: "A fake emergency! Say I left the oven on. I didn't, but I always worry I did, so it's believable." },
        { tone: 'flirty', t: "Fine, I'll rescue you. But you dance with me as payment.", r: "A rescue fee! That's fair, honestly. One dance. I'll step on you. Consider yourself warned." },
      ] },
      { tone: 'passive', t: "Come here. Tell me what you learnt and I'll tell you if it's true.", r: "They said tyres have moods. Is that real? I'd like it to be real. I'd like everything to have moods.", opts: [
        { tone: 'cold', t: "It's not. They were making it up.", r: "Oh. I liked the tyres having moods. You didn't have to squash it so fast." },
        { tone: 'passive', t: "It's sort of real. They get grumpy when they're cold.", r: "Grumpy cold tyres! Same as me in the mornings. I feel so much closer to tyres now. Thank you." },
        { tone: 'flirty', t: "They do. So do I, when you talk to other people all night.", r: "Are you JEALOUS of the tyre expert? Oh my gosh. That's adorable. I'm only talking to you now. Promise." },
      ] },
      { tone: 'flirty', t: "I'll rescue you. But then I'm keeping you.", r: "Keeping me? Like a stray? Okay. I'm house-trained and I like snacks. Get me out of here, quick.", opts: [
        { tone: 'cold', t: "Don't take it literally.", r: "Oh. Right. I'll un-adopt myself, then. Thanks for the rescue." },
        { tone: 'passive', t: "Done. Here, have the last mini quiche as a welcome gift.", r: "The last mini quiche! That's love. I mean, that's kindness. It's kindness. It's very kind quiche." },
        { tone: 'flirty', t: "Snacks and you all night? Best party ever.", r: "You're making me giggly and I've had half a glass of fizz. This is your fault. Keep it up." },
        { tone: 'risque', t: "Keep me company all night and I'll walk you home after.", r: "Walk me HOME? To the door and the... okay. You can't say that at a party! I'm crimson. Ask me later." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-passive-2', stage: 'warm', mood: 'passive',
    say: "I went to that cafe you mentioned. The one with the cinnamon thing? I need to talk to you about it immediately.",
    opts: [
      { tone: 'cold', t: "I don't remember mentioning a cafe.", r: "Oh. You did, on the phone. You said it was the best thing in the city. I wrote it down. That's okay.", opts: [
        { tone: 'cold', t: "Must've been small talk.", r: "It wasn't small to me. I'll go by myself, then. It's still a nice cafe." },
        { tone: 'passive', t: "Wait, the cinnamon knot place? Yes! I remember. Was it good?", r: "It was SO good. I had two. I told the waiter you sent me and they looked at me like I was a bit odd." },
        { tone: 'flirty', t: "I remember now. I can't believe you wrote it down. That's adorable.", r: "I write down everything you say! Not everything. Some things. The cinnamon things. Don't look at me like that." },
      ] },
      { tone: 'passive', t: "The cinnamon knot! Tell me everything. Was it life-changing?", r: "It was. I sat in the window and ate it really slowly and thought, {me} has very good taste.", opts: [
        { tone: 'cold', t: "It's only a pastry.", r: "It's not only a pastry. It was a nice morning. But okay. I get it." },
        { tone: 'passive', t: "Next time, try it with the cardamom latte. Trust me.", r: "Cardamom! You're full of secrets. I'm making a cafe list. With your name at the top." },
        { tone: 'flirty', t: "Next time I'm coming with you. Window seat for two.", r: "A window seat for two! That's a little date. Is that a date? It sounds like a date. I'm saying yes." },
      ] },
      { tone: 'flirty', t: "Did you think of me while you ate it?", r: "Maybe. A bit. Okay, the whole time. There was a crumb on my chin and I wondered if you'd tell me.", opts: [
        { tone: 'cold', t: "I'd have let you walk around with it.", r: "Oh. That's a little bit mean. I'd tell you. I'd always tell you about a chin crumb." },
        { tone: 'passive', t: "Of course I'd tell you. That's basic friendship.", r: "Friend crumb duty! I like that we have duties. Okay, mine is making sure you eat breakfast." },
        { tone: 'flirty', t: "I'd tell you. Then I'd brush it off myself.", r: "Yourself? With your... thumb? Okay. I have to look at the ceiling for a minute. It's a nice ceiling." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-passive-3', stage: 'warm', mood: 'passive',
    say: "Very important question. Best sandwich you've ever eaten. I'll tell you mine after. Be honest, I'll know.",
    opts: [
      { tone: 'cold', t: "I don't really think about sandwiches.", r: "Everyone thinks about sandwiches, {me}. Okay, maybe not everyone. I just wanted one small thing about you.", opts: [
        { tone: 'cold', t: "There's not much to know.", r: "I don't believe that. But I won't push. I'll go and eat a sandwich alone and think about it." },
        { tone: 'passive', t: "Okay, fine. Cheese and pickle from a petrol station after a test day. Five stars.", r: "Petrol station cheese and pickle! That's such a real answer. I love it. I love a real answer." },
        { tone: 'flirty', t: "Fine. But I'd think about them more if you made them.", r: "I make a very good sandwich. I cut them into triangles. It's a love language. Is it? It is now." },
      ] },
      { tone: 'passive', t: "Toasted cheese my team boss made in a motorhome at three in the morning.", r: "At three in the morning! That's a story sandwich. The best ones always are. Who knew bosses could toast?", opts: [
        { tone: 'cold', t: "Your turn. Quickly.", r: "Oh. Okay, quickly. Egg and cress. On a train. It was nice. I'll stop there." },
        { tone: 'passive', t: "Your turn. I want the full sandwich lore.", r: "Fish finger, ketchup, my nan's kitchen, a power cut, candles. We ate in the dark and laughed. The best." },
        { tone: 'flirty', t: "Your turn. Then I'm sneaking you in to try the motorhome toastie.", r: "You'd sneak me into the paddock for a toastie? That's the most romantic thing anyone's said to me. Is that sad?" },
      ] },
      { tone: 'flirty', t: "Whatever you'd make me for breakfast.", r: "For BREAKFAST? You'd have to be there at breakfast for that, {me}. Oh. Oh, I see. That was smooth.", opts: [
        { tone: 'cold', t: "I meant hypothetically.", r: "Hypothetically. Okay. Hypothetical sandwiches. Very flat. Never mind." },
        { tone: 'passive', t: "I just mean you seem like you'd make an amazing breakfast.", r: "I DO make an amazing breakfast. Pancakes with faces on. Next weekend? I'll make you some faces." },
        { tone: 'flirty', t: "Smooth enough to get me an invitation?", r: "Maybe! I'm going to say maybe, and smile, and change the subject. Look, a pigeon! Hehe." },
        { tone: 'risque', t: "So, breakfast at yours. I'll be there for the night before, too.", r: "The night BEFORE? I've gone the colour of ketchup. Who says that out loud? I'm laughing. Ask me after pudding." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-passive-4', stage: 'warm', mood: 'passive',
    say: "I watched your onboard from {last} on loop. Not in a weird way! In a, fine, slightly weird way. You're so calm in there.",
    opts: [
      { tone: 'cold', t: "It's my job to be calm.", r: "I know. I just thought it was impressive. I'm not calm in a car park. Sorry, I'll stop gushing.", opts: [
        { tone: 'cold', t: "You can stop, yeah.", r: "Okay. Stopping. I'll watch something else on loop. Cooking shows, maybe. Bye." },
        { tone: 'passive', t: "Sorry. Thank you. It's nice someone watches the boring bits.", r: "They're not boring! You tap the wheel before every straight. I spotted it. Is it a habit?" },
        { tone: 'flirty', t: "Gush away. I like it coming from you.", r: "Then. You are very good. And very calm. And your gloves are nice. Gush complete. I'm pink now." },
      ] },
      { tone: 'passive', t: "Calm on the outside. My heart's going like a drum.", r: "Really? I couldn't tell at all! That's the bravest thing, being scared and smooth at once. I'm proud of you.", opts: [
        { tone: 'cold', t: "Don't be proud. It's just driving.", r: "I'll be proud quietly, then. You can't stop me feeling it. Okay. I'll let you go." },
        { tone: 'passive', t: "Thanks. Not many people notice that bit.", r: "I notice. I notice tiny things. Like how you fix your collar when you're nervous. Like now." },
        { tone: 'flirty', t: "It's going like a drum now too. Different reason.", r: "What reason? Oh. Oh, me? Now MY heart's doing a drum. We've got a whole band going." },
      ] },
      { tone: 'flirty', t: "Slightly weird is my favourite kind of fan.", r: "I'm not a FAN fan. I'm a friend fan. A special category. With a lanyard. Okay, I'm a fan.", opts: [
        { tone: 'cold', t: "Let's keep it as fan.", r: "Oh. Okay. Fan. Front row, nothing more. I'll wave from the stands, then." },
        { tone: 'passive', t: "Friend fan is good. Come and watch from the garage at {track}?", r: "The GARAGE? With the headsets and the serious faces? Yes! I'll be so quiet. A quiet little mouse." },
        { tone: 'flirty', t: "Wear my cap at {track} and you're my official favourite.", r: "Official favourite! Is there a certificate? I want a certificate. I'll frame it next to Dennis." },
        { tone: 'risque', t: "Watch it again with me tonight. My place. No onboard needed.", r: "No onboard... oh. OH. I'm bright red. {me}, you can't just say things like that! Ask again when I can feel my face." },
      ] },
    ],
  },

  // ------------------------------------------------------------- WARM / FLIRTY
  {
    id: 'sunny-warm-flirty-1', stage: 'warm', mood: 'flirty',
    say: "There you are. I've looked at the door every time it opened, which is a lot at {venue}. It's a very busy door.",
    opts: [
      { tone: 'cold', t: "You should probably find something else to watch.", r: "Oh. Ouch. Okay. I thought we were... last time was lovely. Did something change?", opts: [
        { tone: 'cold', t: "Nothing changed. I'm just not feeling it today.", r: "Okay. I won't watch the door anymore, then. That's fine. That's... fine. Bye, {me}." },
        { tone: 'passive', t: "Sorry, that came out wrong. I'm tired. I'm glad you watched for me.", r: "Phew. Tired I understand. Come and sit, I've saved you a chair and a biscuit." },
        { tone: 'flirty', t: "Kidding. Watch the door all you like, as long as I'm the one walking in.", r: "You scared me! Don't do that. Okay. I'll watch, you walk in. That's our thing now." },
      ] },
      { tone: 'passive', t: "Sorry I'm late. Practice ran over. How's your day been?", r: "Busy! I fixed a wobbly table with a folded receipt and felt like an engineer. How was practice?", opts: [
        { tone: 'cold', t: "Long. I don't really want to rehash it.", r: "Oh. No rehashing. I'll just sit here and be nice at you instead." },
        { tone: 'passive', t: "Good. The car felt great. Your table fix sounds better, though.", r: "It was a very good fix. I'd hire me. Tell me about the car feeling great? I love it when you're pleased." },
        { tone: 'flirty', t: "It ran over because I was thinking about you instead of my lines.", r: "Instead of your lines? {me}! You'll miss a braking point! Wait, don't. Okay, but... aww." },
      ] },
      { tone: 'flirty', t: "Next time I'll walk in slower so you can enjoy the view.", r: "The VIEW? You're terrible. You're right, but you're terrible. I'm going to need a cold glass of water.", opts: [
        { tone: 'cold', t: "I was being ironic.", r: "Oh. Ironic. Ha. I'll go and stand by the door and feel silly, then." },
        { tone: 'passive', t: "Fine, I'll walk in like a normal person. I just wanted to make you laugh.", r: "The normal walk is also good. I'd watch the normal walk. I'd watch any walk, honestly." },
        { tone: 'flirty', t: "Enjoy it. I dressed up because I knew you'd be here.", r: "You dressed up for ME? Oh no. I wore my second-best jumper. I've failed. You look so good. Stop it." },
        { tone: 'risque', t: "Or I could walk you out of here. Slowly.", r: "Out of HERE? Now? Where to? Ahh, you're doing a look. I'm laughing so hard I'm crying. Maybe. Maybe!" },
      ] },
      { tone: 'risque', t: "Watching the door? Next time, be waiting on the other side of mine.", r: "The other side of YOUR door? You can't just SAY that! I'm the colour of a postbox. I'm... thinking about it.", opts: [
        { tone: 'cold', t: "Relax. I was messing with you.", r: "Oh. Messing. Right. I'll stop thinking about it. That was a lot of thinking for nothing." },
        { tone: 'passive', t: "Too much? Sorry. Let's just get a coffee.", r: "A bit much. But a nice bit much. Coffee, yes. I'll recover over coffee. Very slowly." },
        { tone: 'flirty', t: "Think about it over dinner. My treat.", r: "Dinner and thinking. Two of my favourite things. You're making it very hard to be sensible." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-flirty-2', stage: 'warm', mood: 'flirty', where: 'party',
    say: "Dance with me? I'm a terrible dancer, but I'm terrible with enthusiasm, and that's honestly half of dancing.",
    opts: [
      { tone: 'cold', t: "I don't dance.", r: "Oh. Not even a little sway? A sway's barely dancing. Never mind. Sorry.", opts: [
        { tone: 'cold', t: "Not even a sway.", r: "Okay. I'll go and sway with my friends, then. Have a nice night, {me}." },
        { tone: 'passive', t: "Fine. One sway. Over by the wall where no one can see.", r: "Wall sway! The safest kind of dancing. Okay. I'll lead. I'll lead badly. Here we go." },
        { tone: 'flirty', t: "I don't dance. But for you, I'll make an exception.", r: "An exception! For me! Take my hands. Don't look at my feet. Look at my face. Wait, don't, I'm red." },
      ] },
      { tone: 'passive', t: "Go on then. I'm not much better, so we'll be terrible together.", r: "Terrible together! That's going on a mug. Come on, this song's got a clappy bit. I'm great at clappy bits.", opts: [
        { tone: 'cold', t: "Let's not make a scene.", r: "Oh. Small dancing, then. Tiny steps. Then I'll let you get back to your mates." },
        { tone: 'passive', t: "You weren't lying about the clappy bit. You're a natural.", r: "I've trained my whole life for this! At weddings. In my kitchen. Mostly my kitchen. This is fun!" },
        { tone: 'flirty', t: "A slow one's next. Stay for it?", r: "The slow one? With the... holding? Yes. I'll stay. My hands are sweaty, I'm sorry in advance." },
      ] },
      { tone: 'flirty', t: "Only if it's a slow one, and you're close.", r: "Close? Like close close? Okay. I'll ask the DJ. Very bravely. Wait here and look gorgeous.", opts: [
        { tone: 'cold', t: "On second thought, I'll sit this out.", r: "Oh. I asked the DJ and everything. Okay. I'll dance with my drink, then." },
        { tone: 'passive', t: "Or whatever's on. I'm happy just dancing with you.", r: "Whatever's on is a song about a tractor. Let's dance to the tractor song. It's perfect." },
        { tone: 'flirty', t: "You came back blushing. Did the DJ tease you?", r: "The DJ winked at me! Because of YOU. Okay. Slow song. Here. Hands. Hi. Oh, this is nice." },
      ] },
      { tone: 'risque', t: "Dance with me now. Then come up for a nightcap after.", r: "A NIGHTCAP? Like, upstairs? You've made me snort my fizz. My face has gone full beetroot. Dance first. Ask me after.", opts: [
        { tone: 'cold', t: "Never mind. Forget it.", r: "Oh. Forgotten. That was a quick undo. I'll go and dance with the others." },
        { tone: 'passive', t: "Too forward? Let's just dance.", r: "A tiny bit forward. Like a step and a half. Let's dance. I'm still giggling. You're very bold tonight." },
        { tone: 'flirty', t: "Fine, dance first. I'm asking again after.", r: "You're very patient for someone who drives that fast. Okay. Dance first. Then... we'll see. Hehe." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-flirty-3', stage: 'warm', mood: 'flirty',
    say: "Confession. I bought a cap with your number on it and wore it to buy milk. The person at the till asked if I knew you.",
    opts: [
      { tone: 'cold', t: "Plenty of people wear my cap.", r: "Oh. Yes, I suppose they do. I thought it was a bit special. It's okay. It's a nice cap anyway.", opts: [
        { tone: 'cold', t: "It's merch. That's what it's for.", r: "Right. Merch. I'll wear it for the sun, then. Not for you. See you, {me}." },
        { tone: 'passive', t: "Sorry. I love that you wore it. What did you tell them?", r: "I said 'sort of'. Then I panicked and bought two lots of milk. I have so much milk, {me}." },
        { tone: 'flirty', t: "None of them look as good in it as you, though.", r: "Do I? I think I look like a lost tourist. But if you say so... I'm wearing it to bed." },
      ] },
      { tone: 'passive', t: "That's brilliant. Did you tell them you know me?", r: "I said 'we're friends'. Then I said 'sort of more'. Then I left without my change. I'm a disaster.", opts: [
        { tone: 'cold', t: "Don't go telling people that.", r: "Oh. Sorry. I didn't mean to say anything wrong. I'll keep it to myself from now on." },
        { tone: 'passive', t: "A cap and a disaster. Good look. Wear it at {track}.", r: "I will! I'll be the one waving the wrong flag in the right cap. Find me in the crowd!" },
        { tone: 'flirty', t: "Sort of more? I like the sound of that.", r: "You do? Good. Because I like the sound of it too. And now we've both said it out loud. Oh gosh." },
      ] },
      { tone: 'flirty', t: "Next time, wear my actual team jacket instead.", r: "Your actual jacket? That's a big jacket step! I'd swim in it. I'd love to swim in it.", opts: [
        { tone: 'cold', t: "I'm kidding, I need that jacket.", r: "Oh. Of course. Silly me. You need it. I'll stick to the cap." },
        { tone: 'passive', t: "I've got a spare one. It's yours. Proper fan gear.", r: "A real one?! I'm going to wear it everywhere. Even the shops. Especially the shops. Thank you!" },
        { tone: 'flirty', t: "It'll smell like me. Fair warning.", r: "Then I'm never giving it back. Sorry. Finders keepers. It's the law. You're allowed to visit it." },
      ] },
      { tone: 'risque', t: "Wear the cap to mine tonight. Backwards. I'll make you breakfast.", r: "Backwards! And breakfast! Is this a sleepover? I'm crimson. I'm laughing into my sleeve. You're outrageous.", opts: [
        { tone: 'cold', t: "Joke. Clearly.", r: "Clearly! Of course. I'll put my sensible face back on now. Bye." },
        { tone: 'passive', t: "Too soon? I'll settle for coffee in the morning.", r: "Coffee in the morning is nice. Very nice. My heart's still going, though. That was a lot." },
        { tone: 'flirty', t: "Breakfast in the cap. Pancakes with faces. Say yes.", r: "You're using my own pancakes against me. That's not fair. Maybe yes. Probably yes." },
      ] },
    ],
  },
  {
    id: 'sunny-warm-flirty-4', stage: 'warm', mood: 'flirty', where: 'evening',
    say: "The stars are out and I'm pretending to know which ones are which. That one's definitely called Steve.",
    opts: [
      { tone: 'cold', t: "That's a plane.", r: "Oh. Is it? It's blinking. It is a plane. I was being silly. I'll stop naming things.", opts: [
        { tone: 'cold', t: "Good. It's cold up here anyway.", r: "Okay. We can go down. I thought it'd be nice. Never mind. I'll get my coat." },
        { tone: 'passive', t: "Sorry. Name another. That one, by the chimney?", r: "That's Margaret. She's the brightest. She looks after Steve. Steve's a plane, but she doesn't know." },
        { tone: 'flirty', t: "Don't stop. You're cuter when you're making things up.", r: "Am I? Okay. That one's {me}, it's the fastest. And that one's me, right next to it. Staring a lot." },
      ] },
      { tone: 'passive', t: "Steve's a good name. What's that one, then?", r: "That's Bramble. It's a cosy star. It wears slippers. You probably think I'm a bit odd. I am. It's fine!", opts: [
        { tone: 'cold', t: "Yeah, you are a bit odd.", r: "Oh. I said it first, so it shouldn't sting. It does a bit. Okay. Back to the stars." },
        { tone: 'passive', t: "Odd's great. I've had enough normal people today.", r: "Then you're in the right place. Rooftop of odd. Sit down, there's a blanket. Bramble's watching." },
        { tone: 'flirty', t: "I like odd. I like you, actually.", r: "You like... me? On a rooftop? Under Bramble? That's the most romantic place anyone's ever liked me." },
      ] },
      { tone: 'flirty', t: "I'd rather look at you than Steve.", r: "Oh! Hah. That's an old line, {me}. It's an old line and it worked. Steve's offended, though.", opts: [
        { tone: 'cold', t: "It was an old line. I didn't really mean it.", r: "Oh. Right. I'll look at Steve, then. At least Steve's honest. Night, {me}." },
        { tone: 'passive', t: "Sorry, Steve. Do you know any of the real names?", r: "Not one! I just like making them up. It's more fun than knowing. Isn't it?" },
        { tone: 'flirty', t: "Steve will cope. Come here, it's cold.", r: "It IS cold. Very cold. I'm coming over purely for warmth. Scientific reasons. Ooh. Hi. Warm." },
      ] },
      { tone: 'risque', t: "Forget the stars. Come back to mine, I've got a ceiling full of them.", r: "A ceiling full of stars? Glow stickers? Oh, that's not... OH. I'm bright pink. I'm giggling. Wow.", opts: [
        { tone: 'cold', t: "I really do have glow stickers. Don't get ideas.", r: "Oh. Glow stickers. Of course. I'll stay up here with Steve, then. Bye." },
        { tone: 'passive', t: "I really do have them. From when I was a kid. Come and see sometime.", r: "Childhood glow stickers! That's the sweetest thing. Okay. Sometime. When I'm not this red." },
        { tone: 'flirty', t: "Glow stickers and me. That's the whole tour.", r: "That's a very short tour. I'm going to think about the tour. Hold my hand while I think." },
      ] },
    ],
  },
];
