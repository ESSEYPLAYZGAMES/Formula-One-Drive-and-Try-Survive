// Sunny (SWEET) - in person, stage 'new': first impressions. 9 story slots x 3 opening moods.
export const DATA = [
  // ===================================================================== NEW 1: three hellos; who are you off the track?
  { id: 'sunny-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: ["Oh, hi. I nearly walked past you, but that felt silly. I think we got off on a wobbly foot last time? I'd like a do-over.",
      "Hi. Um. I brought you a mint. A peace mint. Last time felt a bit wobbly and I'd love to start again, if that's allowed?"],
    opts: [
      { tone: 'cold', t: "There's nothing to redo. I was busy, that's all.", r: "Oh. Okay. Busy. That makes sense, I suppose. I just... felt like I'd done something. Had I?", opts: [
        { tone: 'cold', t: "You're overthinking it. Let it go.", r: "Right. Letting it go. I'm good at lots of things and that isn't one of them, but okay. Bye, {me}." },
        { tone: 'passive', t: "No, you hadn't. I'm sorry I was short with you.", r: "Oh, phew. Thank you. That's all I needed, honestly. Hello again, then. Properly this time." },
        { tone: 'flirty', t: "The only thing you did was look far too nice to be snapped at.", r: "Oh! That's - um. That's a very big swing from busy. I'm smiling, but cautiously. Like a cat near a bath." },
      ] },
      { tone: 'passive', t: "A do-over sounds good. Hi. I'm {me}.", r: "Hi, {me}! I'm {first}. I'm so relieved I could hum. Okay. Tell me what you're like when you're not racing.", opts: [
        { tone: 'cold', t: "Same as when I am. Not very chatty.", r: "Oh. Okay. Not chatty. I'll stop asking things, then. Sorry. I can be a lot of questions." },
        { tone: 'passive', t: "Honestly? Quiet. Long walks, too much toast, early nights.", r: "Toast! A toast person. I knew it. I'm writing that down in my head. That's a lovely answer, {me}." },
        { tone: 'flirty', t: "Off the track I'm much nicer to people like you.", r: "People like me? What are people like me? Wait, don't answer, I've gone hot in the face already." },
      ] },
      { tone: 'flirty', t: "You came back after I was grumpy? Either brave or you like me.", r: "Hah! Um. Can it be both? It's mostly brave. Like sixty-forty. Please don't do the maths on that.", opts: [
        { tone: 'cold', t: "Don't read into it. I was teasing.", r: "Oh. Teasing. Right, I knew that. Back to a hundred percent brave and nothing else. Okay." },
        { tone: 'passive', t: "Either way, I'm glad. I wasn't at my best last time.", r: "Thank you for saying that. Truly. Clean slate, then. I'm already doodling little flowers on it." },
        { tone: 'flirty', t: "Forty percent is plenty. I'll take it.", r: "You can't just take it! It's - okay, fine, you can have it. Forty-one. My ears are on fire." },
      ] },
    ] },
  { id: 'sunny-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: "Oh! Hi. Hello. Sorry, I practised saying hi on the way to {venue} and it still came out as three hellos.",
    opts: [
      { tone: 'cold', t: "One would have done.", r: "Ha. Yes. One would. I'll ration them from now on. I just wanted to say I liked meeting you, that's all.", opts: [
        { tone: 'cold', t: "Noted. I've got somewhere to be.", r: "Oh, of course. Sorry. I won't keep you. Good luck with everything, {me}. I mean that." },
        { tone: 'passive', t: "That was rude of me. I liked meeting you too.", r: "You did? Oh, good. My chest just unclenched. What are you like when you're not in a car, then?" },
        { tone: 'flirty', t: "Actually, keep the hellos coming. They suit you.", r: "They suit me? Nobody's ever said a hello suits me. Hello. There. Did that one suit me too?" },
      ] },
      { tone: 'passive', t: "Three hellos is very efficient. Hi, {first}.", r: "You remembered my name! Okay, I have a question. What are you like when you're not racing? The real you.", opts: [
        { tone: 'cold', t: "That's a lot to ask someone you've just met.", r: "Oh. Yes. Too much too soon. I always do that. I'll start with weather questions and work up." },
        { tone: 'passive', t: "Pretty boring. I cook badly and fall asleep on sofas.", r: "That isn't boring, that's cosy! A sofa sleeper. I'm one too. We'd be terrible at films together." },
        { tone: 'flirty', t: "Come and find out sometime.", r: "Oh. Oh! I mean. I would like that. I'm just going to stand here and be quietly pink now." },
      ] },
      { tone: 'flirty', t: "You practised saying hi to me? That's adorable.", r: "It's not adorable, it's preparation! Okay, it's a bit adorable. Don't look at me, I'm turning into a tomato.", opts: [
        { tone: 'cold', t: "It was a bit much, honestly.", r: "Oh. Right. Sorry. I'll practise saying less, then. I just get nervous around people I like." },
        { tone: 'passive', t: "I'm only teasing. It was a nice hello.", r: "Phew. Thank you. Can I ask you something real, then? What do you do on a day off? I'm so curious." },
        { tone: 'flirty', t: "A tomato's a good look on you.", r: "Stop it! You can't say that and expect me to form sentences. Give me a minute. I'm buffering." },
      ] },
    ] },
  { id: 'sunny-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "Hi! You smiled at me last time and I walked around like a lamp someone switched on. Is that too honest for a hello?",
    opts: [
      { tone: 'cold', t: "It was just a smile. Don't build it up.", r: "Oh. Okay. Just a smile. I'll switch the lamp off, then. Sorry, I do get carried away.", opts: [
        { tone: 'cold', t: "Yeah. You do.", r: "Right. Well. I'll stop being a lamp at you. Take care, {me}. I hope today's kind to you." },
        { tone: 'passive', t: "Sorry, that was harsh. It was a nice smile to get back.", r: "Oh, thank goodness. Okay. I'll keep the lamp on low. Like a nightlight. A friendly one." },
        { tone: 'flirty', t: "Leave the lamp on. I'll do it again.", r: "You will? Right now? Oh no, you are, aren't you. I can't look at it directly. It's too much." },
      ] },
      { tone: 'passive', t: "It's a nice kind of honest. Hi, {first}.", r: "Hi! Okay, I've got a real question. What are you like off the track? I bet you're secretly a crossword person.", opts: [
        { tone: 'cold', t: "I don't really do small talk.", r: "Oh. That's fine. I'll stop. I wasn't trying to pry, I promise. I was just curious about you." },
        { tone: 'passive', t: "No crosswords. Music, cooking, and a lot of naps.", r: "Naps! A professional napper. That's the most relatable thing anyone's said to me all week." },
        { tone: 'flirty', t: "Off the track I mostly think about people who glow at me.", r: "I don't glow! Do I glow? Oh no, I'm glowing now. This is your fault, entirely and completely." },
      ] },
      { tone: 'flirty', t: "Too honest? No. Just honest enough to make me smile again.", r: "See, you're doing it again. My face doesn't know what to do. It's just sort of happening. All of it.", opts: [
        { tone: 'cold', t: "Relax. It's not that big a deal.", r: "No. Right. Not a big deal. I'll calm down. I just liked it, that's all. Sorry for making it a thing." },
        { tone: 'passive', t: "Tell me something about you, then. Anything.", r: "Okay! I sing to the kettle so it boils faster. It doesn't work. I still do it. Your turn next time." },
        { tone: 'flirty', t: "Your face can keep doing that. I'm enjoying it.", r: "You're impossible. Lovely and impossible. I'm going to go and be pink somewhere private." },
      ] },
    ] },
  // ===================================================================== NEW 2: Dennis the fern
  { id: 'sunny-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "Hi. I told my fern about last time. Dennis. He's a fern. He said I should come and check you're okay. So. Are you?",
    opts: [
      { tone: 'cold', t: "You talk to a plant about me? That's a bit odd.", r: "Oh. Maybe. Dennis is a very good listener, though. Better than most people. I'm sorry if that's weird.", opts: [
        { tone: 'cold', t: "It is weird. Maybe talk to the plant instead.", r: "Okay. I will. Dennis won't be short with me, at least. Bye, {me}. I really did want to check." },
        { tone: 'passive', t: "Not weird. Just new. I talk to my car, so.", r: "You talk to your car? Oh, that's wonderful. Okay. Dennis and your car would get on, I think." },
        { tone: 'flirty', t: "Tell Dennis I'm sorry. And that his owner's sweet.", r: "He'll be thrilled. I'm a bit thrilled too, if I'm honest. I'll pass on the sorry. And the other bit." },
      ] },
      { tone: 'passive', t: "I'm fine. Sorry I was off. What did Dennis say?", r: "He said you looked tired and probably didn't mean it. Dennis is very forgiving. More than me, and I'm quite forgiving.", opts: [
        { tone: 'cold', t: "I'm not taking advice from a fern.", r: "No. Fair. He's not qualified. I'll tell him to stay out of it. Sorry, {me}." },
        { tone: 'passive', t: "Dennis is right. I was shattered. How long have you had him?", r: "Six years! I rescued him from a shop floor. He was all brown and sad. Now he's huge and smug." },
        { tone: 'flirty', t: "Dennis is wise. Does he say anything else about me?", r: "He says you've got kind eyes, actually. Those are Dennis's words. I'm only the messenger. A pink messenger." },
      ] },
      { tone: 'flirty', t: "I'm okay. Better now you've come over. Dennis has good instincts.", r: "Dennis does have good instincts. He's never been wrong about a person. Ever. So that's... something, isn't it?", opts: [
        { tone: 'cold', t: "Let's not get carried away over a plant.", r: "No. Course not. I'll just stand here and be normal about it. I'm sorry. I really am being normal." },
        { tone: 'passive', t: "What's Dennis like? Tell me about him.", r: "Dramatic. If I forget to water him he flops over like a fainting poet. Then he springs back. Every time." },
        { tone: 'flirty', t: "If Dennis approves, I'd like to meet him one day.", r: "Meet Dennis? Already? That's - I mean, he'd love that. I'd have to tidy. I've gone so pink." },
      ] },
    ] },
  { id: 'sunny-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "Okay, confession. I told my plant about you. Dennis. He's a fern. He thinks you're very charming. He's a good judge.",
    opts: [
      { tone: 'cold', t: "You told a plant about me? We've barely spoken.", r: "I know. I tell Dennis everything. It's not as weird as it sounds. Okay, it's exactly as weird as it sounds.", opts: [
        { tone: 'cold', t: "It sounds very weird.", r: "Right. Okay. I'll keep my fern to myself, then. Sorry. I'll go and find someone less odd to talk to." },
        { tone: 'passive', t: "No, it's fine. Everyone talks to something.", r: "Exactly! Thank you. Some people have diaries. I've got a large, opinionated fern. It's the same thing." },
        { tone: 'flirty', t: "I'm flattered a plant's heard about me.", r: "Only good things! I promise. Dennis is very discreet. He's never told a soul. He doesn't know any souls." },
      ] },
      { tone: 'passive', t: "A fern called Dennis. I need to know everything.", r: "Okay! He's six, he's enormous, he hates draughts and he sulks if I leave the radio off. He likes jazz, weirdly.", opts: [
        { tone: 'cold', t: "That's more about a plant than I needed.", r: "Oh. Ha. Yes. Sorry. I can talk about Dennis for hours, I forget other people can't. I'll stop." },
        { tone: 'passive', t: "A jazz fern. That's brilliant. Does he have a favourite?", r: "Anything with a saxophone. His fronds go all perky. I know that's not science. I'm telling you anyway." },
        { tone: 'flirty', t: "Dennis has good taste. In music and in drivers.", r: "He does! He'd be so smug if he heard that. I'm a bit smug for him. And pink. Mostly pink." },
      ] },
      { tone: 'flirty', t: "So Dennis thinks I'm charming. What do you think?", r: "Me? I think Dennis is... um. Usually right. About most things. That's all I'm saying. Don't make me say more.", opts: [
        { tone: 'cold', t: "Dodging the question. Got it.", r: "I wasn't dodging, I was... yes, I was. I'm sorry. I'm not good at saying things straight out yet." },
        { tone: 'passive', t: "Fair enough. Tell Dennis I said hello.", r: "I will! He'll pretend not to care, then perk up later. Thank you, {me}. That's really sweet." },
        { tone: 'flirty', t: "I'll take 'usually right' as a yes.", r: "You can take it as whatever you like. I'm not confirming anything. My cheeks might be, though." },
      ] },
    ] },
  { id: 'sunny-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "I have to tell you something. My fern, Dennis, overheard me talking about you, and now he won't stop perking up. It's embarrassing.",
    opts: [
      { tone: 'cold', t: "I don't really care what your plant thinks.", r: "Oh. No. Course not. It was a silly joke. I just thought it might make you smile. Sorry.", opts: [
        { tone: 'cold', t: "It really didn't.", r: "Okay. I'll stop trying, then. Dennis will just have to droop. Bye for now, {me}." },
        { tone: 'passive', t: "Sorry. It was a bit funny. Dennis, really?", r: "Dennis, really. He came with the name. A shop label said 'Dennis, eight quid'. I couldn't change it." },
        { tone: 'flirty', t: "Fine. I care a little what Dennis thinks.", r: "A little? I'll tell him. He'll take it badly that it's only a little. I'll take it well, though." },
      ] },
      { tone: 'passive', t: "You talk about me to your fern? What do you say?", r: "Just that I met someone who's nice to talk to. Dennis listens. He's had a lot of practice. He's six.", opts: [
        { tone: 'cold', t: "That's a lot to tell a plant after one chat.", r: "Is it? Maybe. I'm a sharer. I'm sorry if that made it feel heavy. It wasn't meant to." },
        { tone: 'passive', t: "That's nice. I'm glad I'm nice to talk to.", r: "You are. Really. Dennis and I agree on that, and we disagree on loads. Mostly about watering." },
        { tone: 'flirty', t: "Just nice to talk to? Dennis must know more.", r: "Dennis knows lots, and he's sworn to secrecy. Fern law. Stop smiling like that, I'll crack." },
      ] },
      { tone: 'flirty', t: "So the fern and I have something in common. We both perk up near you.", r: "Oh my goodness. You can't just... oh, I'm all hot in the face. That was smooth. Too smooth. Are you allowed?", opts: [
        { tone: 'cold', t: "Calm down. It was a line.", r: "Oh. A line. Right. I fell for it a bit. I'll un-fall. Give me a minute to un-fall." },
        { tone: 'passive', t: "Sorry, too much? I'll behave. Tell me about Dennis.", r: "Not too much! Just a lot. Okay. Dennis. Big, leafy, dramatic, likes jazz. He's basically me as a plant." },
        { tone: 'flirty', t: "I'll do it again if it gets me that face.", r: "No! Yes. Maybe. I'm going to have to tell Dennis about this and he's going to be unbearable." },
      ] },
    ] },
  // ===================================================================== NEW 3: lucky things
  { id: 'sunny-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "Hi. I wasn't sure I should come over after last time. But I have one question and then I'll leave you be. Do you have a lucky thing?",
    opts: [
      { tone: 'cold', t: "I don't believe in luck. Is that it?", r: "Oh. Okay. That's... a very clear answer. I suppose it is it, then. I'll stop bothering you.", opts: [
        { tone: 'cold', t: "Good. Thanks.", r: "Right. I'll go. I'll still be wearing my lucky socks for your race. You can't stop me doing that." },
        { tone: 'passive', t: "Wait. Sorry. Why do you ask?", r: "I've got lucky socks. Little strawberries on. I wear them when someone I like needs luck. That's all." },
        { tone: 'flirty', t: "I don't. But you could be one, if you hang around.", r: "Me? A lucky thing? That's - okay, you've confused me now, but in a nice way. I'll hang around a bit." },
      ] },
      { tone: 'passive', t: "Sorry about last time. And yes, actually. A pair of gloves.", r: "Gloves! That's a good lucky thing. Mine's socks. With strawberries on. They've never lost me a quiz night.", opts: [
        { tone: 'cold', t: "Pub quizzes and races aren't the same.", r: "No. I know. That was a silly thing to compare. I'll stop trying so hard. Sorry, {me}." },
        { tone: 'passive', t: "Strawberry socks. I respect that. Where'd you get them?", r: "My gran knitted them. They're slightly different sizes. That's what makes them lucky, I think." },
        { tone: 'flirty', t: "I'd love to see the strawberry socks one day.", r: "They're very private socks! I'll think about it. You'd have to earn it. I'm blushing over socks now." },
      ] },
      { tone: 'flirty', t: "My lucky thing just walked over, so I'm doing fine.", r: "Oh. Oh no. You can't just say that after last time. I was ready to be cross. I'm not cross. I'm pink.", opts: [
        { tone: 'cold', t: "Don't make it a whole thing.", r: "No. Course. Not a thing. I'll file it under nothing. Sorry, I take things too much to heart." },
        { tone: 'passive', t: "I mean it, though. Sorry for before. What's yours?", r: "Socks. Strawberry ones. Gran made them. I'll wear them for your race, if that's okay? It feels important." },
        { tone: 'flirty', t: "Being pink suits you better than being cross.", r: "It does, actually. Cross makes me look like a sad potato. Fine. You're forgiven. Mostly. Ninety percent." },
      ] },
    ] },
  { id: 'sunny-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Random question, but do you have a lucky thing? Socks, a song, a sandwich? I need to know for... reasons.",
    opts: [
      { tone: 'cold', t: "What reasons?", r: "Oh. Um. Lucky reasons. I wanted to send some luck your way. It sounded better in my head. It always does.", opts: [
        { tone: 'cold', t: "I don't need luck. I need a fast car.", r: "Right. Of course. I'll leave the luck to people who want it. Sorry, {me}. I'll stop." },
        { tone: 'passive', t: "That's sweet, actually. I tap the halo twice. That's it.", r: "Tap twice! I'll do it too. On my kitchen table. At the start. It's settled. Thank you for telling me." },
        { tone: 'flirty', t: "If you're sending luck, send it in person.", r: "In person? Like, come to the race? Oh. Okay. Maybe! I'm thinking about it right now." },
      ] },
      { tone: 'passive', t: "A song. Same one every race, on the way to the car.", r: "Oh, that's great! Can I guess it? No, don't tell me. It's something embarrassing. I can see it in your face.", opts: [
        { tone: 'cold', t: "It's not embarrassing. Drop it.", r: "Sorry! I didn't mean it badly. I'll drop it. My face does more teasing than my brain intends." },
        { tone: 'passive', t: "It's a bit embarrassing. What's your lucky thing?", r: "Strawberry socks! My gran knitted them, slightly different sizes. They're lucky because they're wonky." },
        { tone: 'flirty', t: "I'll tell you if you guess right. Over dinner.", r: "Over dinner? That's - oh, you did that on purpose. I'm guessing so hard now. Is it a love song?" },
      ] },
      { tone: 'flirty', t: "Might be you, actually. Things have gone well since we met.", r: "Stop it. That's a coincidence. A lovely coincidence. Oh, I'm going pink. Let me have a moment.", opts: [
        { tone: 'cold', t: "I was joking. Mostly.", r: "Mostly. Right. I'll hold on to the bit that wasn't. Quietly. Sorry, I'm terrible at being cool." },
        { tone: 'passive', t: "What's your lucky thing, then?", r: "Socks with strawberries on. Gran made them. I'll wear them for you this weekend. That's not a big deal." },
        { tone: 'flirty', t: "Take all the moments you need. I'll wait.", r: "Don't wait so nicely! It's making it worse. Better. Worse. I genuinely can't tell anymore." },
      ] },
    ] },
  { id: 'sunny-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "I've decided I'm going to be your lucky charm. I don't know how yet. Do you have a lucky thing I can copy?",
    opts: [
      { tone: 'cold', t: "I don't need a lucky charm.", r: "Oh. Okay. Fair enough. I was being a bit silly. I just wanted to help somehow. That's all.", opts: [
        { tone: 'cold', t: "You can help by giving me some space.", r: "Okay. Space. I can do that. I'll keep my luck to myself. Good luck anyway, {me}. Quietly." },
        { tone: 'passive', t: "Sorry. That was blunt. What would being my charm involve?", r: "Wearing my strawberry socks, mostly. Gran knitted them. They're wonky. Wonky things are lucky." },
        { tone: 'flirty', t: "Fine. You can be my charm. Apply in writing.", r: "In writing? I'll do a whole form. With boxes. I'm already designing it in my head. You'll love it." },
      ] },
      { tone: 'passive', t: "I've got a lucky coin. Same one since karting.", r: "Since karting! Oh, that's lovely. A tiny you with a tiny coin. Mine are socks. Strawberry ones. Gran made them.", opts: [
        { tone: 'cold', t: "Socks aren't the same as a coin.", r: "No, I suppose not. A coin is more serious. I'll stop comparing. My socks have feelings too, though." },
        { tone: 'passive', t: "Your gran knits? That's lovely.", r: "She does! Badly, on purpose, she says. Everything she makes is slightly lopsided. I love it all." },
        { tone: 'flirty', t: "So you'll wear the lucky socks for me?", r: "I already planned to. I was going to keep that a secret. Look what you've done. I've gone tomato." },
      ] },
      { tone: 'flirty', t: "You don't need to copy anything. You're already doing the job.", r: "I am? I haven't done anything! Unless smiling at you counts. Does it count? Please say it counts.", opts: [
        { tone: 'cold', t: "Don't get your hopes up.", r: "Oh. Okay. Hopes going down. Slowly. Like a sad lift. I'll get out at the ground floor, then." },
        { tone: 'passive', t: "It counts. Now tell me yours.", r: "Strawberry socks! Wonky ones, from my gran. They're coming to your race with me. In spirit, at least." },
        { tone: 'flirty', t: "It counts double. Keep doing it.", r: "Double! Okay. I'll smile so much this weekend you'll get pole. That's how it works. Probably." },
      ] },
    ] },
  // ===================================================================== NEW 4: what do you think about at that speed? (the cushion)
  { id: 'sunny-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "Hi. I watched your last race from behind a cushion. It's how I watch scary things. Then I remembered you were cross with me. Still?",
    opts: [
      { tone: 'cold', t: "I wasn't cross. You just talk a lot.", r: "Oh. Yes. I do. People have said. I'm sorry. I'll try to talk a normal amount. What's a normal amount?", opts: [
        { tone: 'cold', t: "Less than this.", r: "Right. Okay. Message received. I'll go and talk to my cushion instead. Bye, {me}." },
        { tone: 'passive', t: "That came out wrong. You can talk. I'll listen.", r: "Really? Thank you. Okay, one question. When you're going that fast, what's in your head? Is it loud?" },
        { tone: 'flirty', t: "Talk as much as you like. I like the sound of it.", r: "You do? That's a huge relief and also a lot. I'm going to talk about cushions for an hour now." },
      ] },
      { tone: 'passive', t: "I'm not cross. Sorry I was short. A cushion, really?", r: "Every lap! I peek over the top at the corners. Can I ask what you think about, going that fast? I wonder all the time.", opts: [
        { tone: 'cold', t: "Nothing I want to explain.", r: "Oh. Okay. That's private, I get it. I shouldn't have asked. The cushion and I will keep wondering." },
        { tone: 'passive', t: "Honestly, mostly braking points. It goes very quiet in my head.", r: "Quiet! I thought it'd be all shouting. That's beautiful, actually. Like being underwater, but fast." },
        { tone: 'flirty', t: "Next time I'll think about you hiding behind a cushion.", r: "Don't! You need to think about braking! Oh, now I'll be worried AND blushing. Thanks for that." },
      ] },
      { tone: 'flirty', t: "Never cross with someone who watches me through a cushion.", r: "It's a very good cushion. It's seen a lot. Okay. You're forgiven for whatever that was. I'm forgiving you pinkly.", opts: [
        { tone: 'cold', t: "Forgiven? I didn't do anything.", r: "Oh. Right. Maybe I imagined it. I do that. I'll un-forgive you, then. Sorry. That came out muddled." },
        { tone: 'passive', t: "Thank you. What scares you most when you watch?", r: "The starts. Everyone squashed together. I hold my breath until the first corner's done. Every time." },
        { tone: 'flirty', t: "Pinkly. I like that. Do it more often.", r: "I'll try. It just happens around you. It's like a weather system. Pink, with a chance of giggles." },
      ] },
    ] },
  { id: 'sunny-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Can I ask something? What do you think about, going that fast? I watch your races from behind a cushion, so I really want to know.",
    opts: [
      { tone: 'cold', t: "It's hard to explain to someone who doesn't race.", r: "Oh. That's fair. I suppose I'd never really understand. I just wanted to try. Sorry for asking.", opts: [
        { tone: 'cold', t: "Yeah. Leave it there.", r: "Okay. Leaving it. I'll keep watching from behind my cushion and guessing. Bye, {me}." },
        { tone: 'passive', t: "I'll try, though. It's like everything goes very still.", r: "Still! At that speed? Oh, I love that. Thank you for trying. I'll think of that next time." },
        { tone: 'flirty', t: "Come watch from the garage and I'll show you.", r: "The garage? Me? With all the serious people? I'd hide behind a tyre. Okay. Maybe. Yes. Gosh." },
      ] },
      { tone: 'passive', t: "Braking points, mostly. And the next corner. Always the next one.", r: "The next one, always. That's a nice way to live, actually. I'm always thinking about three corners back.", opts: [
        { tone: 'cold', t: "That sounds like your problem.", r: "Oh. Yes. I suppose it is. I'll go and think about it three corners back. Sorry, {me}." },
        { tone: 'passive', t: "What do you think about three corners back?", r: "Whether I said something silly. Usually I did. Like telling you I hide behind a cushion. Too late now." },
        { tone: 'flirty', t: "Lately my next corner's been bumping into you.", r: "Oh my goodness. That's a racing chat-up line. Is that a thing? I didn't know that was a thing. I'm melting." },
      ] },
      { tone: 'flirty', t: "Cushion? I'll have to win so you can come out from behind it.", r: "That would help, honestly! It's very dark back there. And when you're winning I can see your face. Oh. Not that I look.", opts: [
        { tone: 'cold', t: "You don't need to watch my face.", r: "No. Course not. I'll watch the car. Just the car. Sorry, that was a weird thing to admit." },
        { tone: 'passive', t: "What's the scariest bit to watch?", r: "The start. All those cars squashed together. I go silent and squeeze the cushion until it's flat." },
        { tone: 'flirty', t: "Look all you like. I'll wave next time.", r: "You'll wave? From the car? You can't, you'll crash. Wave after! I'll wave back. Behind my cushion." },
      ] },
    ] },
  { id: 'sunny-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "I have to tell you, I watched your race from behind a cushion. I peeked at the good bits. You looked very... focused. In a nice way.",
    opts: [
      { tone: 'cold', t: "You're not meant to look. You're meant to watch the race.", r: "Oh. Sorry. I was watching the race! Mostly. I didn't mean to make you uncomfortable.", opts: [
        { tone: 'cold', t: "Just keep it to the race.", r: "Okay. Just the race. I'll get a smaller cushion and a straighter face. Sorry, {me}." },
        { tone: 'passive', t: "Sorry, I'm terrible at compliments. Thank you for watching.", r: "That's okay. I'm terrible at giving them, clearly. What are you thinking about, in the car? I'm so curious." },
        { tone: 'flirty', t: "Fine. Look a bit. I'll allow it.", r: "A bit! That's generous. I'll look a sensible amount. Behind a cushion. Like a very shy owl." },
      ] },
      { tone: 'passive', t: "Why a cushion?", r: "Because the starts scare me! Everyone so close. I think about you in there and I need something to squeeze.", opts: [
        { tone: 'cold', t: "It's not that dramatic.", r: "No, I know it's not to you. It's your job. I'm just a worrier. I'll try to worry less loudly." },
        { tone: 'passive', t: "Honestly, it goes very quiet in there. You don't need to worry.", r: "Quiet. Okay. I'll picture it quiet. That helps. Thank you for telling me, {me}. Really." },
        { tone: 'flirty', t: "You think about me in there? That's sweet.", r: "I didn't say that! I did say that. Oh, I'm going to need the cushion right now, for my face." },
      ] },
      { tone: 'flirty', t: "Focused in a nice way? You'll have to tell me what that means.", r: "It means... nice. Jaw all set. Eyes all serious. Okay, I'm stopping, I've said too much. I'm a strawberry.", opts: [
        { tone: 'cold', t: "That's a bit much.", r: "Yes. It was. Sorry. I'll keep my thoughts behind the cushion where they belong. Bye for now." },
        { tone: 'passive', t: "Ha, fair enough. What does it look like from your sofa?", r: "Terrifying and wonderful. Mostly terrifying. I shout at the telly. The neighbours think I'm very sporty." },
        { tone: 'flirty', t: "I'll try to look focused just for you.", r: "Please don't, I won't survive it. I'll need two cushions. Possibly a duvet. I'm giggling now. Help." },
      ] },
    ] },
  // ===================================================================== NEW 5: the good-things jar
  { id: 'sunny-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Hey. I've got a jar at home. One good thing a day goes in it, on a slip of paper. Last time didn't make the jar. I'd like today to.",
    opts: [
      { tone: 'cold', t: "I'm not here to fill your jar.", r: "No. That's true. That's not your job. I just hoped. Sorry, that probably sounded needy.", opts: [
        { tone: 'cold', t: "It did, a bit.", r: "Okay. I'll stop hoping out loud. I'll find something else for the jar today. Bye, {me}." },
        { tone: 'passive', t: "That was mean. Sorry. Tell me about the jar.", r: "My gran started it with me when I was nine. A rotten year. One good thing a day. I never stopped." },
        { tone: 'flirty', t: "Fine. Let's make today jar-worthy, then.", r: "Really? Okay. You've already got a head start. You just smiled. That's half a slip, at least." },
      ] },
      { tone: 'passive', t: "That's a lovely idea. What went in yesterday?", r: "Yesterday a stranger held a door and said 'after you, sunshine'. Little things. They're the best ones, I think.", opts: [
        { tone: 'cold', t: "Seems a bit soppy.", r: "Maybe it is. I like soppy. But I'll keep my soppy to myself if it bothers you. Sorry." },
        { tone: 'passive', t: "Little things. I like that. How long have you done it?", r: "Since I was nine. Gran started it. Thousands of slips now. I read old ones when it's grey. They help." },
        { tone: 'flirty', t: "What would I have to do to get in it?", r: "Not much, honestly. You might already be in it. Twice. I'm not saying which days. I'm too pink." },
      ] },
      { tone: 'flirty', t: "Tell me what it takes and I'll make the jar. Every day.", r: "Every day? That's a lot of jar! You'd crowd out all the sunsets and the nice dogs. I'm smiling, I'm sorry.", opts: [
        { tone: 'cold', t: "I was being polite. Don't get excited.", r: "Oh. Polite. Right. I'll un-excite. You're still welcome in the jar. Just less often, I suppose." },
        { tone: 'passive', t: "What's in there now? Give me the highlights.", r: "A rainbow over the bus stop. A cake that didn't sink. A really fat pigeon. It's a very good jar." },
        { tone: 'flirty', t: "The nice dogs can share. I'm not moving.", r: "You can't fight a nice dog for jar space! You'd lose. Maybe not. Okay, you'd win. I'm giggling." },
      ] },
    ] },
  { id: 'sunny-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "Can I tell you a slightly soppy thing? I keep a jar. One good thing a day, on a slip of paper. You made it in after we talked.",
    opts: [
      { tone: 'cold', t: "You put me in a jar? We barely know each other.", r: "I know. It's not a big deal, I promise. It was just a nice chat, and nice chats go in the jar. Sorry.", opts: [
        { tone: 'cold', t: "Still. It's a bit intense.", r: "Okay. I hear you. I'll keep you out of the jar. That makes me a bit sad, but I'll do it. Bye, {me}." },
        { tone: 'passive', t: "No, I get it. What else goes in?", r: "A good cup of tea. A dog in a coat. Someone laughing on a bus. My gran started it with me. It stuck." },
        { tone: 'flirty', t: "Okay, that's actually really sweet.", r: "It is? Oh, good. I was bracing myself. I'm unbracing now. And blushing. Lots of unbracing and blushing." },
      ] },
      { tone: 'passive', t: "What did the slip say?", r: "'Talked to {me}. Laughed a lot. Didn't say anything too silly.' That last bit was optimistic, honestly.", opts: [
        { tone: 'cold', t: "You did say some silly things.", r: "I did. I know. Oh well. The jar doesn't judge. Apparently you do. That's okay. I'll try harder." },
        { tone: 'passive', t: "That's a nice slip. Where did the jar come from?", r: "Gran gave it to me when I was nine. I'd had an awful year at school. A slip every day, she said. It worked." },
        { tone: 'flirty', t: "I hope I make it in there again.", r: "You might! It depends. Keep being nice and you'll need your own shelf. Oh. I said that out loud." },
      ] },
      { tone: 'flirty', t: "Only once? I'll have to work harder.", r: "You don't have to work at all! That's the point. You just turned up and were lovely. Oh, I'm pink. Ignore that.", opts: [
        { tone: 'cold', t: "I wasn't trying to be lovely.", r: "No. I know. That's what made it nice. But okay. I'll stop putting things on you. Sorry, {me}." },
        { tone: 'passive', t: "How long have you kept the jar?", r: "Ever since I was nine. Gran's idea. There are three jars now, actually. They live on my windowsill with my fern." },
        { tone: 'flirty', t: "I'm aiming for every day this week.", r: "Every day! Greedy. I like it. I'm warning you, I'll write very soppy things. You can't read them." },
      ] },
    ] },
  { id: 'sunny-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "Okay, I keep a jar at home. Good things go in it, one a day. You've been in it twice this week. That's never happened. Just so you know.",
    opts: [
      { tone: 'cold', t: "That's a lot of pressure.", r: "Oh. No! It's not meant to be pressure. It's just a jar. I'm sorry if I made it heavy. I do that.", opts: [
        { tone: 'cold', t: "Just don't make me a project.", r: "You're not a project. You're a person I liked talking to. But okay. I'll keep it to myself. Sorry." },
        { tone: 'passive', t: "Sorry. It's sweet, really. What is the jar?", r: "My gran started it when I was nine. A slip a day. When things are grim, I read them all back. It helps." },
        { tone: 'flirty', t: "Twice is good. I'm going for three.", r: "Three would be a record. Unbeaten since the jar began. You'd get a little trophy. A paper one." },
      ] },
      { tone: 'passive', t: "What's the jar for, exactly?", r: "Bad days. When it's all grey, I tip it out and read. Gran started it with me as a kid. Now you're in there. Twice.", opts: [
        { tone: 'cold', t: "I'd rather not be in it.", r: "Oh. Okay. I won't take you out, that feels mean to the jar. But I'll stop adding you. Sorry, {me}." },
        { tone: 'passive', t: "I like that. Your gran sounds wise.", r: "She's the wisest. And the rudest. Both at once. She'd like you. She'd tell you off, then she'd like you." },
        { tone: 'flirty', t: "What did the slips say? Be honest.", r: "One says 'nice laugh'. The other says something I'm too embarrassed to repeat. Don't push. I'll combust." },
      ] },
      { tone: 'flirty', t: "Twice? You must think I'm a very good thing.", r: "Not me! The jar said that. I'm just its keeper. Its very pink keeper. Stop looking at me like that.", opts: [
        { tone: 'cold', t: "Don't overthink it.", r: "No. Course not. It's a jar. I'm normal about it. I'm very normal. Bye, then, {me}." },
        { tone: 'passive', t: "Fair. Where did the jar idea come from?", r: "Gran. When I was nine and miserable. She said, find one good thing a day. I've done it every day since." },
        { tone: 'flirty', t: "Tell the jar the feeling's mutual.", r: "I'll write it on a slip. 'The feeling's mutual.' Oh no, that's going straight to the top. I'm beaming." },
      ] },
    ] },
  // ===================================================================== NEW 6: who do you call after a race? (Gran's Sundays)
  { id: 'sunny-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "Hi. I rang my gran on Sunday, like I always do, and told her I'd upset someone. She said 'ask them'. So I'm asking. Did I?",
    opts: [
      { tone: 'cold', t: "You're asking because your gran told you to?", r: "Partly. And partly because I care. Gran's just better at saying the obvious thing. I'm sorry if it's annoying.", opts: [
        { tone: 'cold', t: "It's a bit annoying, yeah.", r: "Okay. I'll stop asking. I'll tell Gran it didn't work. She'll be disappointed. So am I, a bit." },
        { tone: 'passive', t: "No. You didn't upset me. I was just in my head.", r: "Oh, thank you. That helps loads. Gran will be insufferable that she was right. Hi again, properly." },
        { tone: 'flirty', t: "Tell your gran you could never upset me.", r: "Never? That's a big word. I'll tell her. She'll say 'told you so' and then ask how tall you are." },
      ] },
      { tone: 'passive', t: "You didn't. I was tired. Do you call your gran every Sunday?", r: "Every Sunday, six o'clock, since I left home. She has a list of questions. Who do you call after a race?", opts: [
        { tone: 'cold', t: "Nobody. I don't need to call anyone.", r: "Oh. Okay. I didn't mean to poke at anything. I just wondered. Sorry, {me}." },
        { tone: 'passive', t: "My mum, usually. She asks if I ate.", r: "Of course she does. Gran asks if I'm warm enough. They're running the same programme, I think." },
        { tone: 'flirty', t: "Maybe I should start calling you instead.", r: "Me? After a race? I'd pick up so fast. Before it rang. I'd just know. I've gone pink, ignore me." },
      ] },
      { tone: 'flirty', t: "You talked to your gran about me? I must be important.", r: "Don't let it go to your head! I tell her everything. Sunday at six. She asks about my fern, my jar and now you.", opts: [
        { tone: 'cold', t: "I'd rather you didn't talk about me.", r: "Oh. Okay. I won't. I'll tell her about the weather instead. She'll be suspicious. Sorry, {me}." },
        { tone: 'passive', t: "What did she say about me?", r: "That anyone who goes that fast must be very brave or very silly. She'd like to decide in person." },
        { tone: 'flirty', t: "Tell her I'm a very good influence.", r: "She won't believe me. She'll hear my voice and know I'm smitten. Oh no. I didn't say smitten." },
      ] },
    ] },
  { id: 'sunny-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "I've always wondered. Who rings you after a race? I call my gran every Sunday at six, and I wondered who your Sunday person is.",
    opts: [
      { tone: 'cold', t: "That's a personal question.", r: "Oh. Yes. Sorry. I didn't mean to pry. I just like knowing who people's people are. I'll back off.", opts: [
        { tone: 'cold', t: "Please do.", r: "Okay. Backing off. I hope you've got someone, though. Everyone should have a Sunday person. Bye." },
        { tone: 'passive', t: "Sorry. My brother, usually. He tells me what I did wrong.", r: "A brother who critiques! Gran does that too, actually. She's started watching the races. Uh oh." },
        { tone: 'flirty', t: "I don't have one. Applications are open.", r: "Open? Really? I'm very good at phones. I'd be a great Sunday person. I'd make a list. Oh gosh." },
      ] },
      { tone: 'passive', t: "My dad. He's a nervous watcher. He paces.", r: "A pacer! Gran is a pacer. She wears a hole in the rug. Do you call him straight away, or when it's all sunk in?", opts: [
        { tone: 'cold', t: "I'd rather not talk about my family.", r: "Okay. That's fine. I'm sorry. I'll keep my questions shallower. Like a paddling pool." },
        { tone: 'passive', t: "Straight away. Even if it went badly.", r: "That's lovely. Especially when it went badly. That's when you need someone. I'm glad you have him." },
        { tone: 'flirty', t: "Straight away. Although someone else is on the list now.", r: "Someone else? Who? Wait. Is it me? Don't answer. I'll just be pink in a corner for a bit." },
      ] },
      { tone: 'flirty', t: "I'm still deciding who gets the job. You're on the shortlist.", r: "The shortlist? I've never been on a shortlist! Gran will be so proud. Is there an interview?", opts: [
        { tone: 'cold', t: "It's a joke. Don't take it seriously.", r: "Oh. Ha. Of course. I'll tell Gran I didn't get the job. She'll say I was too keen. She'd be right." },
        { tone: 'passive', t: "No interview. Tell me about your gran.", r: "Tiny, terrifying, wears a hat indoors. Sunday at six, she wants to know everything. She knows about you." },
        { tone: 'flirty', t: "The interview's over dinner. Are you free?", r: "Dinner? With you? For a job interview? I'm free! For the interview. I'm so pink you could toast bread on me." },
      ] },
    ] },
  { id: 'sunny-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "I told my gran about you on our Sunday call. She wants to know who you ring after a race, and honestly, so do I. Who's the lucky person?",
    opts: [
      { tone: 'cold', t: "Why does your gran want to know that?", r: "Because she's nosy. And because I am. I'm sorry. I got excited. I can stop being nosy.", opts: [
        { tone: 'cold', t: "Yes. Stop.", r: "Okay. Stopping. I'll tell her it's a mystery. She'll hate that. Bye, {me}. Take care." },
        { tone: 'passive', t: "It's fine. My sister, usually. She keeps me grounded.", r: "A sister! Good. I'm glad someone keeps you grounded. Gran keeps me grounded. She calls me 'flighty'." },
        { tone: 'flirty', t: "Tell your gran it might be her grandchild soon.", r: "I can't tell her that! She'll start knitting. She'll knit you a jumper with your number on. I can't cope." },
      ] },
      { tone: 'passive', t: "My coach. Not very romantic, sorry.", r: "Ha! Not romantic, but sensible. Gran would approve. She'd also ask why you haven't called your mother.", opts: [
        { tone: 'cold', t: "Your gran doesn't know my life.", r: "No. You're right. That was me speaking for her. I'll stop doing that. Sorry, {me}." },
        { tone: 'passive', t: "Your gran sounds like a character.", r: "She is! She wears a hat indoors. She says the weather's rude. Every Sunday at six, she wants all the news." },
        { tone: 'flirty', t: "Maybe I need a more romantic option.", r: "Maybe you do. I'm not saying who. I'm just standing here. Being romantic-adjacent. Pinkly." },
      ] },
      { tone: 'flirty', t: "Nobody yet. I was hoping you'd volunteer.", r: "Me? I'd volunteer so fast. I'd have my phone in my hand at the chequered flag. I'd be unbearable.", opts: [
        { tone: 'cold', t: "Maybe not, then.", r: "Oh. Right. Too keen. I'll un-volunteer. Gran warned me about being too keen. Bye, {me}." },
        { tone: 'passive', t: "Okay. Let's try it after this weekend.", r: "Really? Okay! I'll practise my 'well done' voice and my 'never mind' voice. I'll get both perfect." },
        { tone: 'flirty', t: "Unbearable is fine. I like the sound of your voice.", r: "My voice? Oh. Oh no. Now I'll be thinking about my voice all week. I'll sound like a squeaky gate." },
      ] },
    ] },
  // ===================================================================== NEW 7: their rotten day
  { id: 'sunny-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "Hi. Sorry, I'm a bit flat today. {work} went sideways, and after last time with you I nearly didn't come over at all.",
    opts: [
      { tone: 'cold', t: "Then why did you?", r: "Because I'd rather be brave than sad at home. That's all. You don't have to fix it. I just wanted to say hi.", opts: [
        { tone: 'cold', t: "Well, you've said it.", r: "I have. Okay. I'll go and be flat somewhere else. I hope your day's better than mine, {me}." },
        { tone: 'passive', t: "I'm glad you did. What went wrong?", r: "Everything I touched. Like a domino day. Thank you for asking. Nobody asks me. I'm usually the asker." },
        { tone: 'flirty', t: "Stay. Flat suits you more than you'd think.", r: "Flat suits me? That's the strangest compliment. It's working, though. I'm slightly less flat now." },
      ] },
      { tone: 'passive', t: "I'm sorry about last time. What happened today?", r: "Oh, a pile-up of small things. I'm normally the one cheering everyone up, so being the sad one feels odd.", opts: [
        { tone: 'cold', t: "Everyone has bad days. You'll be fine.", r: "Yes. I will. I know. I suppose I wanted a bit more than that. That's okay. Thanks anyway, {me}." },
        { tone: 'passive', t: "You don't always have to be the cheery one. Tell me.", r: "Okay. I messed up something I'd worked on for weeks. Saying it to you makes it smaller. Thank you." },
        { tone: 'flirty', t: "Let me be the cheerer for once. You've earned it.", r: "You'd do that? Oh. I might cry, but the good kind. Go on, then. Cheer me. I'm ready. I'm all ears." },
      ] },
      { tone: 'flirty', t: "Come here. I'm going to fix your day, starting now.", r: "How? You can't just... oh, you're smiling at me. That's cheating. That's how. Okay. It's working a bit.", opts: [
        { tone: 'cold', t: "Don't expect miracles.", r: "I wasn't. I'll just take my bad day home, then. It's fine. It's all fine. Bye, {me}." },
        { tone: 'passive', t: "Tell me what happened first.", r: "{work} fell apart. Weeks of it. But you know what? Telling you is helping. You're a good listener." },
        { tone: 'flirty', t: "That's step one. Step two is making you laugh.", r: "You've already done step two. I just snorted. In public. You've ruined my reputation. Thank you." },
      ] },
    ] },
  { id: 'sunny-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "Can I be honest? I'm having a rubbish day. {work} fell over. I'm usually the cheerful one, so I don't know where to put it.",
    opts: [
      { tone: 'cold', t: "That's rough. I've got my own stuff going on, though.", r: "Oh. Of course. You've got loads on. I shouldn't have dumped it on you. Sorry, {me}. Forget I said anything.", opts: [
        { tone: 'cold', t: "It's fine. I'll see you around.", r: "Yes. See you around. I'll put my rubbish day somewhere sensible. Like a bin. Bye." },
        { tone: 'passive', t: "No. Sorry, that sounded awful. What happened?", r: "Weeks of work, gone, because of one silly mistake. Mine. But you asking makes it feel less silly." },
        { tone: 'flirty', t: "Actually, I've got time for you. Talk to me.", r: "You have? Okay. That's nice. That's really nice. I'll keep it short. Mostly. You've made me smile." },
      ] },
      { tone: 'passive', t: "You don't have to be cheerful with me. Want to talk about it?", r: "Thank you. Nobody says that. Everyone expects me to bounce. Sometimes I just want to sit and be a bit grey.", opts: [
        { tone: 'cold', t: "Being grey won't help.", r: "No. Maybe not. I just wanted to be allowed for a minute. That's okay. I'll bounce. Bye, {me}." },
        { tone: 'passive', t: "Sit and be grey, then. I'll sit too.", r: "That's the nicest thing anyone's done for me this week. Just sitting. Look, I'm already less grey." },
        { tone: 'flirty', t: "Grey's fine. I like you in every colour.", r: "In every colour? That's a lovely thing to say to a grey person. I've gone a bit pink. Pink's a colour." },
      ] },
      { tone: 'flirty', t: "Let me take you for a hot chocolate. Fixes everything.", r: "Hot chocolate? With marshmallows? You can't just offer me the exact right thing. That's not fair. Yes.", opts: [
        { tone: 'cold', t: "Actually, I just remembered I can't.", r: "Oh. Okay. That's fine. I'll get my own. It'll be fine. Thanks for the thought, {me}." },
        { tone: 'passive', t: "Marshmallows, obviously. Tell me what happened.", r: "One mistake, three weeks of work. But marshmallows and you asking? That's a recovery plan." },
        { tone: 'flirty', t: "Extra marshmallows. And you have to smile once.", r: "Once? I'm smiling now. Look. I owe you a hot chocolate. Or ten. You're very good at this." },
      ] },
    ] },
  { id: 'sunny-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "Okay, I've had the worst day, and you're the first nice thing in it. That's not a line. Well, it is now. But it's true.",
    opts: [
      { tone: 'cold', t: "I'm not here to be your nice thing.", r: "No. I know. That's not fair on you. I just meant I was glad to see you. I'm sorry. I'll go.", opts: [
        { tone: 'cold', t: "Yeah, best not.", r: "Okay. I'll go. I'll find a cat to tell. Cats don't mind being nice things. Bye, {me}." },
        { tone: 'passive', t: "Sorry. That was harsh. What happened today?", r: "Work. {work}. It all went wrong at once, like a jenga tower. Thanks for asking, though. Really." },
        { tone: 'flirty', t: "Fine. I'll be your nice thing. Just for today.", r: "Just today? I'll take it. Today needs it. You might get extended to tomorrow, if you're good." },
      ] },
      { tone: 'passive', t: "What happened? You can tell me.", r: "{work} fell apart. And I bumped into a door. And I dropped my lunch. In that order. All before noon.", opts: [
        { tone: 'cold', t: "Sounds like you need to be more careful.", r: "Ha. Yes. Thank you. That's what the door said too. I'll be careful. Bye, {me}." },
        { tone: 'passive', t: "Oof. Want to share mine? It's still in one piece.", r: "You'd share your lunch with me? That's basically love in my family. Okay. Yes. Tiny bite." },
        { tone: 'flirty', t: "Poor door. It must have been distracted by you.", r: "The door? Distracted? That's the silliest line ever and it's working. Bad day: officially over." },
      ] },
      { tone: 'flirty', t: "If I'm the first nice thing, let me be the best one.", r: "Oh, you can't say that on my worst day! I've no defences. I'm just a big pink puddle now. Mop me up.", opts: [
        { tone: 'cold', t: "I'm not mopping anything.", r: "No. Right. Too far. I'll mop myself. I'm good at that. Bye, {me}. Have a nicer day than mine." },
        { tone: 'passive', t: "Tell me what went wrong, then I'll make it right.", r: "{work} went to pieces. But you're here, and it's already halfway right. Thank you, {me}." },
        { tone: 'flirty', t: "A pink puddle is my favourite kind of puddle.", r: "That's the most ridiculous thing anyone's ever said to me. I'm writing it down. You're in trouble." },
      ] },
    ] },
  // ===================================================================== NEW 8: braver - a non-racing thing?
  { id: 'sunny-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "Okay, I'm going to ask anyway, even after last time. There's a glasshouse full of ferns near me. Dennis's cousins. Would you ever come?",
    opts: [
      { tone: 'cold', t: "To look at ferns? No thanks.", r: "Oh. Okay. That's alright. Ferns aren't for everyone. I'll go on my own, then. I usually do.", opts: [
        { tone: 'cold', t: "Have fun with that.", r: "I will. I'll tell Dennis's cousins you said hello. They won't mind. They're very polite. Bye, {me}." },
        { tone: 'passive', t: "Sorry. That came out rude. Ferns could be fun.", r: "They are! It's warm and green and smells like rain. You'd like it more than you think. Promise." },
        { tone: 'flirty', t: "Ferns, no. Ferns with you, maybe.", r: "Maybe? I'll take maybe. Maybe's practically a yes. I'll look up the opening times. In a calm way." },
      ] },
      { tone: 'passive', t: "Last time was my fault. A glasshouse sounds nice.", r: "It is! It's warm and quiet and there's a little cafe that does very sad scones. A non-racing thing. For you.", opts: [
        { tone: 'cold', t: "I don't really have time for that.", r: "Oh. Of course. Your diary's awful, I know. I'll stop asking. If it changes, I'm here." },
        { tone: 'passive', t: "Sad scones are my favourite kind. Let's do it.", r: "Really? Okay! I'm so happy I could hop. I won't. I'll hop at home. Thank you, {me}." },
        { tone: 'flirty', t: "Is this you asking me out?", r: "No! I mean - is it? Maybe it is. I didn't plan for you to notice. I'm pink. It's suddenly very warm." },
      ] },
      { tone: 'flirty', t: "You want to take me to meet Dennis's family? That's serious.", r: "It's not serious! It's ferns! Okay, it's a bit serious. Dennis would want me to bring someone nice.", opts: [
        { tone: 'cold', t: "Then find someone else.", r: "Oh. Right. I'll stop asking. You don't have to come. I'm sorry I made it a thing." },
        { tone: 'passive', t: "I'd like that. When's good?", r: "Any morning! When it's quiet. The ferns are best in the mornings. Oh, I'm so excited. Sorry." },
        { tone: 'flirty', t: "I'll bring flowers. To make the ferns jealous.", r: "You can't make the ferns jealous! They'll sulk. I'll sulk. No, I'll swoon. Bring the flowers." },
      ] },
    ] },
  { id: 'sunny-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "I've been brave all week, so here goes. Would you want to do a non-racing thing sometime? A walk, ducks, a glasshouse full of ferns?",
    opts: [
      { tone: 'cold', t: "I'm not great with ducks.", r: "Oh. No ducks, then. That's fine. I'll cross them off. I just wanted to see you somewhere quiet, that's all.", opts: [
        { tone: 'cold', t: "I'm not great with quiet, either.", r: "Okay. I get it. I'll stop asking. You know where I am if that ever changes. Bye, {me}." },
        { tone: 'passive', t: "Sorry. A walk would be nice, actually.", r: "A walk! Perfect. Walks are the best. I'll find one with a bench and a nice view. Leave it with me." },
        { tone: 'flirty', t: "Ducks are fine if you hold my hand near them.", r: "Hold your hand? Near the ducks? I'd fight a duck for you. I would. I'm so pink. Okay. Deal." },
      ] },
      { tone: 'passive', t: "The ferns. Obviously. I want to see where Dennis is from.", r: "Ha! He's from a garden centre, but his ancestors are at the glasshouse. I'll show you the big ones.", opts: [
        { tone: 'cold', t: "Actually, maybe not.", r: "Oh. Okay. That's alright. I got a bit excited. I'll calm down. Maybe another time, then." },
        { tone: 'passive', t: "I'll come. Do they do snacks?", r: "Sad scones. Very sad. Rock hard. You'll love them, I promise. They're terrible in a lovely way." },
        { tone: 'flirty', t: "It's a date, then. With the ferns watching.", r: "A date? With you? Among the ferns? I need to sit down. I'm sitting. It's a date. Gosh." },
      ] },
      { tone: 'flirty', t: "Are you asking me out, {first}?", r: "Am I? I think I am. Oh no, I am. I'm asking you out. Is that okay? Please say it's okay. I'm a tomato.", opts: [
        { tone: 'cold', t: "Not a good idea, I think.", r: "Oh. Okay. That's fine. Really. I'm glad I asked, though. I'd rather know. Honest is good." },
        { tone: 'passive', t: "It's okay. I'd like to. Where?", r: "There's a glasshouse full of ferns. Warm and green. Like a hug, but plants. You'll love it. I hope." },
        { tone: 'flirty', t: "It's more than okay. Pick a day. I'll be there.", r: "You will? Okay. I'll pick the nicest day. I'll check the forecast seven times. I'm ridiculously happy." },
      ] },
    ] },
  { id: 'sunny-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "I want to take you somewhere. A glasshouse full of ferns. It's warm and quiet and nobody will ask about racing. Is that silly?",
    opts: [
      { tone: 'cold', t: "A bit. I'm not a plant person.", r: "Oh. That's okay. I am, a lot, but you don't have to be. I'll think of something less ferny.", opts: [
        { tone: 'cold', t: "Don't bother.", r: "Okay. I won't. I'm sorry I pushed. I'll keep the ferns for me. Bye, {me}. Take care of yourself." },
        { tone: 'passive', t: "Sorry. No racing questions does sound nice.", r: "Doesn't it? Just plants and quiet and me, being a bit too chatty. You'd have a lovely morning." },
        { tone: 'flirty', t: "I'm not a plant person, but I'm a you person.", r: "A me person? I've never had a person. Oh, I've gone all warm. That was not fair. Ferns it is." },
      ] },
      { tone: 'passive', t: "Not silly. Nobody asking about racing sounds like a holiday.", r: "Exactly! And there's a pond with fish that look like they've seen too much. You'll like them. Saturday?", opts: [
        { tone: 'cold', t: "Let me check my diary.", r: "Okay. No pressure. I'll keep Saturday open anyway. Just in case. Just quietly. Bye, {me}." },
        { tone: 'passive', t: "Saturday works. Tired fish and ferns. Perfect.", r: "Perfect! I'll bring snacks. Proper ones, not the sad scones. I'm so pleased I could burst." },
        { tone: 'flirty', t: "Saturday. And I'll be the one holding your hand.", r: "Holding hands among the ferns? That's - okay, I'm going to be so pink all week. Saturday. Yes." },
      ] },
      { tone: 'flirty', t: "Somewhere warm and quiet with you? That's not silly. That's a date.", r: "You said date. You said it first. I was going to dance around the word for ages. Okay. Date. Yes. Help.", opts: [
        { tone: 'cold', t: "Slow down. I didn't mean it like that.", r: "Oh. Okay. Not a date. A ferns thing. I'll slow down. Sorry. I heard what I wanted to." },
        { tone: 'passive', t: "A date. A gentle one. You pick the day.", r: "A gentle date. That's the loveliest kind. I'll pick a sunny one. Thank you, {me}. Truly." },
        { tone: 'flirty', t: "No dancing around it. I'm asking properly. Date?", r: "Date! Yes! A thousand times. Well, once, to start with. Oh, I'm grinning like an idiot." },
      ] },
    ] },
  // ===================================================================== NEW 9: friends? or something? (end of chapter)
  { id: 'sunny-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "Can I ask you something straight? I can't tell if we're friends, or something, or nothing. Last time felt like nothing. I'd rather know.",
    opts: [
      { tone: 'cold', t: "We're acquaintances. Let's leave it there.", r: "Acquaintances. Okay. That's clear. Thanks for not dressing it up. It stings a bit, but I'd rather know.", opts: [
        { tone: 'cold', t: "Good. I'm glad that's sorted.", r: "Sorted. Yes. I'll stop knocking, then. I mean it kindly. I hope things go well for you, {me}. Always." },
        { tone: 'passive', t: "Sorry. That was cold. We're friends. Of course we are.", r: "We are? Oh. Thank you. I needed that more than I can say. Friends. That's going on a slip tonight." },
        { tone: 'flirty', t: "Actually, I lied. It's more like something.", r: "Something? Really? You can't take it back now. I'm holding you to it. I'm blushing. Something." },
      ] },
      { tone: 'passive', t: "Friends, at least. I'm sorry I made you wonder.", r: "Thank you. That helps so much. 'At least' is doing a lot of work there, though. I noticed. I notice things.", opts: [
        { tone: 'cold', t: "Don't make more of it than it is.", r: "Okay. I won't. Friends it is. Just friends. That's good. That's nice. I'll stick to that." },
        { tone: 'passive', t: "Friends for now. Let's see where it goes.", r: "Let's see. I like that. Seeing is good. I'll be patient. I'm terrible at patience, but I'll try." },
        { tone: 'flirty', t: "You noticed right. It might be more.", r: "More? Oh. Oh. I thought so. I hoped so. Can I put that in the jar? I'm putting it in the jar." },
      ] },
      { tone: 'flirty', t: "It's something. I'm just bad at showing it.", r: "You are bad at showing it. Really bad. But I'll believe you, because I want to. Something. Okay. Hi, something.", opts: [
        { tone: 'cold', t: "Don't get too attached.", r: "Too late. Sorry. But I'll keep it in check. I'll be careful with it. With you. See you, {me}." },
        { tone: 'passive', t: "I'll try to be better at it.", r: "That's all I need. Trying. I'll try too. Less wobbling. More saying. Thank you for this, {me}." },
        { tone: 'flirty', t: "Hi, something. I've been waiting for you.", r: "Waiting for me? Oh, you can't say that, my heart's doing a little dance. A bad one. Very enthusiastic." },
      ] },
    ] },
  { id: 'sunny-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "I've decided something. We're friends now. Proper ones. It's on a slip for the jar. Unless it's... more than friends? Ignore that.",
    opts: [
      { tone: 'cold', t: "Friends is fine. Let's not rush.", r: "No rushing. Got it. Friends is lovely. Friends is the best. I'll stop saying ignorable things. Sorry.", opts: [
        { tone: 'cold', t: "Good. Let's keep it simple.", r: "Simple. Yes. I can do simple. I'll keep the slip, though. It's a good one. Bye, {me}." },
        { tone: 'passive', t: "Friends for now. I like having you around.", r: "You do? Okay. That's going on another slip. Two slips in one day. That's a record, almost." },
        { tone: 'flirty', t: "I said don't rush. I didn't say no.", r: "You didn't say no! I heard that. I'll be quietly hopeful. Loudly hopeful inside. Pink outside." },
      ] },
      { tone: 'passive', t: "Proper friends. I'd like that a lot.", r: "Good! Then as your proper friend, I'm going to cheer the loudest. And bring snacks. That's what friends do.", opts: [
        { tone: 'cold', t: "You don't need to cheer for me.", r: "I know I don't need to. I want to. But okay. I'll cheer quietly. Into a cushion. Bye, {me}." },
        { tone: 'passive', t: "Snacks are always welcome.", r: "Brilliant. I'm a very good snack friend. You'll never go hungry. That's my vow. A snack vow." },
        { tone: 'flirty', t: "And the 'more than friends' bit you said to ignore?", r: "You weren't supposed to hear that! You weren't. Oh gosh. Well. It's still there. If you want it." },
      ] },
      { tone: 'flirty', t: "I'm not ignoring that last bit. Not a chance.", r: "Oh no. You're not supposed to catch the bits I say quietly! That's against the rules. My rules. Which I just made.", opts: [
        { tone: 'cold', t: "Fine. Ignored.", r: "Oh. Okay. Ignored. I'll put it away. I'll keep the friends slip. That one's still true." },
        { tone: 'passive', t: "Friends first. Then we'll see about the rest.", r: "Friends first. Then the rest. That sounds like a plan. A good plan. I love a plan. Thank you." },
        { tone: 'flirty', t: "I'm breaking your rules. I want more than friends.", r: "You do? Right. New slip. It just says 'MORE' in capitals. With a heart. Two hearts." },
      ] },
    ] },
  { id: 'sunny-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "So, I've been thinking. About us. If there's an 'us'. Is there an 'us'? I really hope so. I'm saying it and not hiding.",
    opts: [
      { tone: 'cold', t: "I don't think there's an us.", r: "Oh. Okay. That's alright. Really. I'm glad you said it. I'll be okay. I'd rather know than wonder.", opts: [
        { tone: 'cold', t: "Good. No hard feelings.", r: "None. I promise. Just a little sad. I'll go and be little-sad somewhere quiet. Take care, {me}." },
        { tone: 'passive', t: "I'm sorry. That was too blunt. Maybe in time.", r: "In time. Okay. I can wait. I'm a good waiter. Not like in a cafe. Patient. You know what I mean." },
        { tone: 'flirty', t: "I lied. There's definitely an us.", r: "Don't do that to my heart! It nearly fell out. Okay. There's an us. I'm going to need to sit down." },
      ] },
      { tone: 'passive', t: "There's something. I'd like to see what it turns into.", r: "So would I. So, so much. Let's find out together, slowly. Like a garden. Oh, that's so cheesy. I don't care.", opts: [
        { tone: 'cold', t: "Very cheesy.", r: "Yes. Very. I'll keep the cheese to myself. Mostly. Sorry. I'll still hope, quietly. Bye." },
        { tone: 'passive', t: "Slowly sounds good. Like a garden. I don't mind cheese.", r: "You don't mind cheese! That's my favourite thing about you. One of them. There's a list. Shh." },
        { tone: 'flirty', t: "I'll water it every day.", r: "Stop it, that's even cheesier than mine. I love it. You've won. You've won the cheese contest." },
      ] },
      { tone: 'flirty', t: "There's an us. I've been waiting for you to say it.", r: "You've been waiting? Why didn't you say? I've been so nervous! I could have been happy for weeks! Oh. I'm happy now.", opts: [
        { tone: 'cold', t: "I wanted to see if you'd crack first.", r: "That's mean! Funny. But mean. I'll forgive you. Not right now. In a while. I'm a bit stung." },
        { tone: 'passive', t: "I'm happy too. Let's make it a proper thing.", r: "A proper thing. Us. That's going on every slip I own. I'm beaming." },
        { tone: 'flirty', t: "Then let's make up for the weeks. Starting now.", r: "Starting now? Okay. Hi, us. I've never been an us before. I'm so pink I'm practically a sunset." },
      ] },
    ] },
];
