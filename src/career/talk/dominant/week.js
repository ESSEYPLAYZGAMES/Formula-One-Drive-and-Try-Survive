// DOMINANT - the phone, the week between races: crisp orders, "Good.", the odd surprising softness. Plain data.
export const DATA = [
  {
    id: 'dominant-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: ["You were short with me. Noted. Separately: I watched your onboard. Turn 3. You're braking a metre too soon. Fix it.", "Not taking last time personally. Watched your onboard instead. Turn 3, you lift a metre early. Fix that."],
    opts: [
      { tone: 'cold', t: "Didn't ask.", r: "You didn't. I offered. Free advice from me is rare. Most people pay in dinners.", opts: [
        { tone: 'cold', t: "Still didn't ask.", r: "Fine. Notes withdrawn. Good luck with turn 3." },
        { tone: 'passive', t: "Okay. A metre? Really?", r: "A metre. I watched it four times. Brake later. Then tell me I was right." },
        { tone: 'flirty', t: "What do I pay in, then?", r: "We'll negotiate. I always win negotiations. Brake later first." },
      ] },
      { tone: 'passive', t: "Ha. You're not wrong.", r: "I rarely am. It's a burden. Brake at the board, not before it.", opts: [
        { tone: 'cold', t: "Don't coach me.", r: "Noted. No coaching. I'll just watch and keep it to myself. Mostly." },
        { tone: 'passive', t: "Thanks. I'll try it.", r: "Good. Report back. I want data." },
        { tone: 'flirty', t: "You watched it four times?", r: "Research. Don't flatter yourself. Do, slightly." },
      ] },
      { tone: 'flirty', t: "You watched my onboard? Cute.", r: "Not cute. Thorough. Turn 3. Brake later. Then you can call me cute.", opts: [
        { tone: 'cold', t: "Weird thing to do.", r: "Fair. Weird it is. I'll keep my observations to myself." },
        { tone: 'passive', t: "Okay, coach.", r: "Coach. I'll take it. First lesson free. The rest cost you a dinner." },
        { tone: 'flirty', t: "I'll brake later if you call me cute.", r: "Brake later and I'll consider it. Results first, compliments after." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: ["Watched your onboard. Turn 3: you brake a metre early. Fix it. You're welcome.", "It's {first}. I watched your onboard. Turn 3 - you're leaving time on the table. Brake later."],
    opts: [
      { tone: 'cold', t: "Who is this?", r: "{first}. We've met. You'll remember. I'm memorable.", opts: [
        { tone: 'cold', t: "Doesn't ring a bell.", r: "It will. Or it won't, and you'll keep braking early. Your choice." },
        { tone: 'passive', t: "Oh, right. Hi.", r: "Hi. Turn 3. Later on the brakes. That's all. That's the text." },
        { tone: 'flirty', t: "Ah. The memorable one.", r: "Exactly. Now listen to the memorable one: brake later into 3." },
      ] },
      { tone: 'passive', t: "Thanks. I'll check the data.", r: "Do. You'll see I'm right. I usually am.", opts: [
        { tone: 'cold', t: "I've got engineers for that.", r: "Fine. Listen to them. They're paid to be polite. I'm not." },
        { tone: 'passive', t: "You watch a lot of racing?", r: "I watch you racing. Different hobby. Newer." },
        { tone: 'flirty', t: "You're welcome to watch more.", r: "I will. Closely. Don't brake early on my account." },
      ] },
      { tone: 'flirty', t: "You've been watching me closely.", r: "I watch everything closely. You're just more worth it than most.", opts: [
        { tone: 'cold', t: "Don't.", r: "Fine. Eyes off. Turn 3 is still early, for the record." },
        { tone: 'passive', t: "I'll take that as a compliment.", r: "It was one. I don't give many. Brake later." },
        { tone: 'flirty', t: "Keep watching.", r: "Planning to. Make it worth my while. Turn 3. Later." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: ["Watched your onboard twice. Once for turn 3. Once for no reason I'll admit to. Brake later into 3.", "Your onboard is excellent viewing. Watched it twice - once for turn 3, once for no reason. Brake later."],
    opts: [
      { tone: 'cold', t: "Thanks for the notes, I guess.", r: "You guess. I'll take a guess. Next time you'll thank me properly.", opts: [
        { tone: 'cold', t: "Don't get used to me replying.", r: "Noted. I won't get used to it. I'll just keep being right." },
        { tone: 'passive', t: "Okay, fine. I'll brake later.", r: "Good. Then send me the lap time. I want proof." },
        { tone: 'flirty', t: "How should I thank you properly?", r: "Dinner. I'll pick the place. You pick dessert. Fair." },
      ] },
      { tone: 'passive', t: "What was the second viewing for?", r: "Classified. Brake later and I'll declassify it.", opts: [
        { tone: 'cold', t: "Forget I asked.", r: "Forgotten. Classified forever, then. Your loss." },
        { tone: 'passive', t: "Deal. Later braking.", r: "Good. That's how it works: I suggest, you improve, I gloat." },
        { tone: 'flirty', t: "I'll brake later. Declassify it.", r: "Not by text. In person. When I decide." },
      ] },
      { tone: 'flirty', t: "Watching me for no reason?", r: "There's always a reason. I just don't text it. Turn 3. Focus.", opts: [
        { tone: 'cold', t: "Bit weird.", r: "Fair. I'll stick to the turn 3 bit. Good luck." },
        { tone: 'passive', t: "You're very bossy for a stranger.", r: "I'm not a stranger. I'm early. Brake later." },
        { tone: 'flirty', t: "I like you bossy.", r: "I'd noticed. Good. More to come. Turn 3 first." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: ["You've gone quiet. Fine. One thing: it's 2pm. Have you eaten. That's not a question.", "Not chasing you. Just checking you've eaten. You haven't. Eat."],
    opts: [
      { tone: 'cold', t: "I'll eat when I'm hungry.", r: "You're always hungry and never eating. Fine. Your call. I'll stop." },
      { tone: 'passive', t: "Not yet. Going now.", r: "Good. Something with protein. Not a biscuit. I'll know." },
      { tone: 'flirty', t: "Are you worried about me?", r: "I don't worry. I instruct. Eat." },
    ],
  },
  {
    id: 'dominant-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: ["Lunch. Now. I can tell you've skipped it.", "Lunch. Have you had it. Don't lie. I'll know."],
    opts: [
      { tone: 'cold', t: "I'm fine. Not hungry.", r: "Not hungry is how it starts. Eat something anyway. Then be fine." },
      { tone: 'passive', t: "Just about to.", r: "Good. Send a photo. I don't trust 'just about to'." },
      { tone: 'flirty', t: "Make me lunch, then.", r: "Not yet. You haven't earned my cooking. Eat whatever's near you. Now." },
    ],
  },
  {
    id: 'dominant-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: ["Before you text me anything charming: eat something. Then be charming. In that order.", "Have you eaten. I know you haven't. Eat, then flirt with me. Order matters."],
    opts: [
      { tone: 'cold', t: "Not hungry.", r: "Your stomach says otherwise. Fine. Starve. Charm suffers on an empty stomach." },
      { tone: 'passive', t: "Eating now. Happy?", r: "Very. You follow instructions beautifully. Now be charming." },
      { tone: 'flirty', t: "I'd rather flirt with you.", r: "Eat first. Then flirt. I'll wait. Not long." },
    ],
  },
  {
    id: 'dominant-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: ["[photo] This is Admiral. My cat. He ignores me too. You two should start a club.", "You're ignoring me. So does my cat. His name's Admiral. He outranks me. Photo attached."],
    opts: [
      { tone: 'cold', t: "Why are you sending me your cat?", r: "Because you weren't talking to me and he was available. Never mind." },
      { tone: 'passive', t: "Admiral. Great name.", r: "He earned it. Sits at the window like he's reviewing a fleet. He'd approve of you. Maybe." },
      { tone: 'flirty', t: "He's gorgeous. Like his human.", r: "He'd say he owns me. He's right. Thank you. On both counts." },
    ],
  },
  {
    id: 'dominant-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: ["Meet Admiral. My cat. The only creature on earth who ignores my orders. [photo]", "[photo] Admiral. He outranks me. He's sitting on my work. I'm letting him. Don't tell anyone."],
    opts: [
      { tone: 'cold', t: "I'm more of a dog person.", r: "Admiral will be devastated. He won't. He doesn't care about anyone. Except me. Sometimes." },
      { tone: 'passive', t: "He looks like he's in charge.", r: "He is. I run everything else. He runs me. It's humbling." },
      { tone: 'flirty', t: "I'd ignore your orders too.", r: "You would. And I'd pretend to mind." },
    ],
  },
  {
    id: 'dominant-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: ["Someone wants to meet you. [photo] Admiral. My cat. Picky. Sleeps on my bed. He's the only one. For now.", "[photo] Admiral. My cat, my superior officer. Also the only one who gets to sleep on my bed. For now."],
    opts: [
      { tone: 'cold', t: "Not really a cat person.", r: "Then you'll have to win him over. Harder. More fun. I'll watch." },
      { tone: 'passive', t: "He's beautiful.", r: "He knows. He's insufferable about it. We have that in common." },
      { tone: 'flirty', t: "For now?", r: "You read that correctly. Good night." },
    ],
  },
  {
    id: 'dominant-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: ["You're cold. I'm competitive. Squash. Saturday. 7am. Bring trainers and an excuse for when you lose.", "Saturday, 7am, squash. I'll beat you. Then maybe you'll warm up. Literally."],
    opts: [
      { tone: 'cold', t: "I don't play squash.", r: "Then you'll lose faster. Still on? No is fine. I'll book someone worse.", opts: [
        { tone: 'cold', t: "Hard pass.", r: "Fine. I'll find someone else to flatten. Your loss." },
        { tone: 'passive', t: "Fine. But I'm terrible.", r: "Good. I'll be gentle. I won't be gentle." },
        { tone: 'flirty', t: "I'll come to watch you win.", r: "Watching isn't playing. But I accept spectators. Front row." },
      ] },
      { tone: 'passive', t: "Okay. 7am. You're on.", r: "Good. Bring water. Eat first. I don't want you blaming low blood sugar.", opts: [
        { tone: 'cold', t: "7am is a crime.", r: "7am is when winners play. Fine. I'll go alone. Win alone." },
        { tone: 'passive', t: "Any rules I should know?", r: "One. I don't lose. Otherwise standard." },
        { tone: 'flirty', t: "What do I get if I win?", r: "You won't. But if you do, you choose dinner. And I'll be gracious. Briefly." },
      ] },
      { tone: 'flirty', t: "Losing to you sounds fun.", r: "It is. People queue for it. Saturday, 7am.", opts: [
        { tone: 'cold', t: "On second thoughts, I'll pass.", r: "Your choice. The court's booked anyway. I'll play the wall." },
        { tone: 'passive', t: "Saturday. I'll be there.", r: "Good. Don't be late. I start without people." },
        { tone: 'flirty', t: "I'll try to distract you.", r: "It won't work. ...It might work. Don't tell anyone it might work." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: ["Squash. Saturday. 7am. You and me. I keep a ledger of my losses. It's short. Prepare accordingly.", "I play squash at dawn. I keep a ledger of every loss. It's very short. Join me Saturday, 7am."],
    opts: [
      { tone: 'cold', t: "I'll pass.", r: "Fair. Ledger stays short. Offer stands if you change your mind.", opts: [
        { tone: 'cold', t: "I won't.", r: "Then I'll play someone who will. No hard feelings. Mild contempt. Kidding." },
        { tone: 'passive', t: "Maybe next week.", r: "Next week, then. I'll pencil it in. In pen." },
        { tone: 'flirty', t: "Unless you make it worth it.", r: "I always make it worth it. Breakfast after. Loser pays." },
      ] },
      { tone: 'passive', t: "I'm in. Saturday.", r: "Good. Wear something you can move in. Eat first. Arrive early.", opts: [
        { tone: 'cold', t: "Do I get a say in any of this?", r: "Of course. Say no and it's off. Say yes and I take charge. Those are the options." },
        { tone: 'passive', t: "What's in the ledger?", r: "Three entries. Two are my grandmother. One was a rematch. I won the rematch." },
        { tone: 'flirty', t: "Can I be entry four?", r: "You can try. Nobody's made the ledger in six years." },
      ] },
      { tone: 'flirty', t: "A ledger? That's adorable.", r: "It's not adorable. It's accountability. Saturday. 7am.", opts: [
        { tone: 'cold', t: "Bit much for 7am.", r: "It's very much. That's the point. No is fine." },
        { tone: 'passive', t: "Okay, I'm in.", r: "Good. You'll hate the alarm. You'll love the game. Mostly." },
        { tone: 'flirty', t: "I'll make the ledger longer.", r: "Bold. I like bold. I'll still win." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: ["Squash. Saturday. 7am. You'll sweat, I'll win, loser buys breakfast. I've never bought breakfast.", "I want to see you sweat. On a squash court. Saturday, 7am. Interpret that how you like."],
    opts: [
      { tone: 'cold', t: "Squash at 7am? No.", r: "Fair. 7am isn't for everyone. It's for winners. Offer open.", opts: [
        { tone: 'cold', t: "Not happening.", r: "Understood. I'll beat someone else and tell you about it." },
        { tone: 'passive', t: "Fine. 8am?", r: "7:30. That's my offer. That's me compromising. Savour it." },
        { tone: 'flirty', t: "Make it worth getting up for.", r: "I'll make it worth it. You'll find out how at 7:01." },
      ] },
      { tone: 'passive', t: "Okay. You're on.", r: "Good. Bring your best. I'll bring mine. Mine's better.", opts: [
        { tone: 'cold', t: "Don't expect me to lose gracefully.", r: "I don't expect grace. I expect effort. Then I expect to win." },
        { tone: 'passive', t: "Breakfast after either way?", r: "Either way. I'm paying if you win. I won't be paying." },
        { tone: 'flirty', t: "I'll wear something distracting.", r: "Then I'll win with my eyes closed. Wear it anyway." },
      ] },
      { tone: 'flirty', t: "Sweat? Bold.", r: "I'm always bold. Saturday. Don't be late.", opts: [
        { tone: 'cold', t: "Too bold.", r: "Fine. Strictly squash, then. Very sporting. No comment." },
        { tone: 'passive', t: "Okay. Saturday.", r: "Good. 7am. Eat something first." },
        { tone: 'flirty', t: "I'll make you work for it.", r: "Good. I like working for things. I always get them." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: ["Brutal day with {work}. I won. You're not talking to me, so I'm telling you anyway.", "You've gone quiet. I haven't. Long day on {work}. Everyone argued. I won. Thought you should know."],
    opts: [
      { tone: 'cold', t: "Congrats, I guess.", r: "'I guess.' Generous. Fine. I'll celebrate alone. I'm good company." },
      { tone: 'passive', t: "Well done. What happened?", r: "Three people wanted three things. I wanted one. Mine happened. Standard." },
      { tone: 'flirty', t: "You winning is very attractive.", r: "I know. That's why I told you. Strategic." },
    ],
  },
  {
    id: 'dominant-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: ["Long day. {work} tried to beat me. It didn't. Tell me something good. Five minutes. Go.", "Day from hell. I won. I'd like a distraction. You're elected."],
    opts: [
      { tone: 'cold', t: "I'm busy.", r: "Fine. Another time. I'll distract myself. I'm excellent at that." },
      { tone: 'passive', t: "I braked later into turn 3.", r: "...Good. That's the best thing I've heard all day. See? I'm always right." },
      { tone: 'flirty', t: "I'm thinking about you. That good enough?", r: "More than good enough. Keep doing that. That's an order." },
    ],
  },
  {
    id: 'dominant-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: ["Long day. Won every argument. Now I want to lose one. To you. Pick a topic.", "{work} is a war. I'm winning. Tell me something to make me smile. You're good at that."],
    opts: [
      { tone: 'cold', t: "I'm not in the mood.", r: "Fine. I'll smile at something else. Less effectively." },
      { tone: 'passive', t: "You'd win any argument.", r: "Correct. But I'd like to be challenged. Try harder tomorrow." },
      { tone: 'flirty', t: "Topic: how much you like me.", r: "Bold. I'd lose that one. I'm not telling you which way." },
    ],
  },
  {
    id: 'dominant-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: ["I'll keep it short, since you do. Thursday. 8. Dinner. I've booked. Yes or no. No is fine.", "You've been cool. I'm asking anyway, once: dinner, Thursday, 8. I've booked it. Your answer."],
    opts: [
      { tone: 'cold', t: "No. Thanks.", r: "Then no. Cancelled. No hard feelings. Take care of yourself." },
      { tone: 'passive', t: "Okay. Thursday.", r: "Good. Address to follow. Don't be late. Don't be early. Be exactly on time." },
      { tone: 'flirty', t: "About time you asked.", r: "I wait for the right moment. This was it. Thursday. 8." },
    ],
  },
  {
    id: 'dominant-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: ["Thursday. 8. Dinner. I've booked. Yes or no - both are allowed. One is correct.", "Table for two, Thursday at 8. One seat's mine. The other has your name on it. That's me asking. Answer."],
    opts: [
      { tone: 'cold', t: "Not interested.", r: "Understood. That's the last you'll hear of it. Good luck at {track}." },
      { tone: 'passive', t: "Yes. Thursday at 8.", r: "Good. Correct answer. I'll pick you up at 7:45." },
      { tone: 'flirty', t: "Only if I get dessert.", r: "You get dessert. You get the good seat. You get me. Generous, aren't I." },
    ],
  },
  {
    id: 'dominant-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: ["Thursday. 8. Corner table, booked. All it needs is your yes.", "Dinner. Thursday. 8. Before you flirt with me any further, I'd like it done in person."],
    opts: [
      { tone: 'cold', t: "Maybe. Let me think.", r: "Think fast. The table won't wait. I will. Briefly." },
      { tone: 'passive', t: "Yes. Absolutely.", r: "Good. I knew you'd say that. I'd have liked hearing it anyway. Now I have." },
      { tone: 'flirty', t: "Only if you dress up.", r: "I always dress up. You'll be lucky to concentrate. Thursday." },
    ],
  },
  {
    id: 'dominant-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: ["Distant week. I've booked Friday anyway. Corner table. My eyes on the door, yours on me. Or don't come. Your call.", "Cold week. Still: Friday, 8, corner table. I sit facing the door - always. Your seat's waiting. Or not."],
    opts: [
      { tone: 'cold', t: "Don't wait for me.", r: "I won't wait. I'll eat. Well. Alone. Fine." },
      { tone: 'passive', t: "Okay. Friday.", r: "Good. I'll forgive the week by the starter." },
      { tone: 'flirty', t: "Save me the seat facing you.", r: "It's always yours. The door gets the other eye." },
    ],
  },
  {
    id: 'dominant-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: ["Friday. 8. I've booked the corner. I'll face the door. You'll face me. Eat a light lunch.", "Booked us Friday. Corner table, me facing the door as usual. You're next to me. Bring an appetite."],
    opts: [
      { tone: 'cold', t: "I might be busy.", r: "Then tell me by Thursday. I'll move it. I don't nag. Much." },
      { tone: 'passive', t: "Perfect. See you Friday.", r: "Good. 8 sharp. Hungry. Those are the only rules." },
      { tone: 'flirty', t: "Can't wait.", r: "Neither can I. I'm pretending I can. Badly." },
    ],
  },
  {
    id: 'dominant-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: ["Friday. Corner table. Me facing the door, you facing me. I've thought about this more than I'll admit.", "I booked Friday. Corner. I've asked them to seat no one near us. I'm very persuasive."],
    opts: [
      { tone: 'cold', t: "Bit much.", r: "It's exactly enough. You'll see on Friday. Or you'll tell me no, and that's fine too." },
      { tone: 'passive', t: "Can't wait. Friday.", r: "Good. Skip the big lunch. I'm ordering for both of us. You can veto." },
      { tone: 'flirty', t: "How much more have you thought about it?", r: "Enough to have a plan. Not enough to tell you. Friday." },
    ],
  },
  {
    id: 'dominant-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: ["My cat - Admiral, he outranks me - knocked my coffee onto my laptop. You're also ignoring me. Mutiny everywhere.", "Admiral, my tyrant of a cat, has staged a coup. He's on my keyboard. You've staged a silence. Losing on two fronts."],
    opts: [
      { tone: 'cold', t: "Not ignoring. Busy.", r: "Busy I respect. Silent I don't. Pick a lane. Admiral already has.", opts: [
        { tone: 'cold', t: "Busy. Still.", r: "Fine. Busy. I'll take it up with the cat." },
        { tone: 'passive', t: "Sorry. Hi. How's the laptop?", r: "Drying. Admiral's unrepentant. You're forgiven. He isn't." },
        { tone: 'flirty', t: "I'll come and mediate.", r: "Mediation accepted. Bring snacks. Not for him. For me." },
      ] },
      { tone: 'passive', t: "Is the laptop okay?", r: "It'll live. Admiral won't apologise. He never does. I respect it.", opts: [
        { tone: 'cold', t: "It's just a laptop.", r: "It's my whole week on that laptop. But fine. Perspective. Thank you." },
        { tone: 'passive', t: "Show me a photo of the culprit.", r: "[photo] Unrepentant. Look at him. He knows exactly what he did." },
        { tone: 'flirty', t: "He's adorable. Like you.", r: "He's a menace. Like me. Thank you, though." },
      ] },
      { tone: 'flirty', t: "Sounds like you need rescuing.", r: "I never need rescuing. I'd allow it, though. From you. Tonight.", opts: [
        { tone: 'cold', t: "Rescue yourself.", r: "I always do. Fine. Good night." },
        { tone: 'passive', t: "I'll bring a new keyboard.", r: "And yourself. The keyboard is optional." },
        { tone: 'flirty', t: "I'm on my way.", r: "Good. The cat will claim you first. I'll allow it. Then I'll move him and claim you myself." },
        { tone: 'risque', t: "Rescue you how, exactly?", r: "I'll explain in person. Bring nothing. I'll be up till late." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: ["Admiral - my cat, the one who outranks me - has knocked my coffee onto my laptop. On purpose. I'm in charge of nothing.", "[photo] The face of a cat who just pushed my coffee onto my work. Admiral. My cat. My boss. Unrepentant."],
    opts: [
      { tone: 'cold', t: "Ha. Karma.", r: "For what? I'm a delight. ...Fine. Some karma. Not this much.", opts: [
        { tone: 'cold', t: "Definitely karma.", r: "Fine. I'll take my karma quietly. Good night." },
        { tone: 'passive', t: "Sorry. That's awful.", r: "It is. He's not sorry. He's on the windowsill, judging me." },
        { tone: 'flirty', t: "You deserve better. I'll come over and prove it.", r: "Bold. I do the inviting. ...Fine. Invitation issued. 8." },
      ] },
      { tone: 'passive', t: "Is he alright? And the laptop?", r: "He's thriving. The laptop is not. You asked about the cat first. So did I. We're both soft.", opts: [
        { tone: 'cold', t: "Back up your files.", r: "I back up everything. Including grudges. Thank you, though." },
        { tone: 'passive', t: "What did you do to deserve it?", r: "Moved his food bowl two inches. He's a traditionalist. So am I." },
        { tone: 'flirty', t: "I'd never mutiny against you.", r: "You would. Constantly. I'd let you. That's the difference between you and him." },
      ] },
      { tone: 'flirty', t: "You're cute when you're defeated.", r: "I'm never defeated. I'm temporarily outranked. Different thing.", opts: [
        { tone: 'cold', t: "You were defeated. By a cat.", r: "...Accurate. Brutal. Fine. Good night." },
        { tone: 'passive', t: "Temporarily, sure.", r: "Yes. Temporarily. I'll reclaim the desk by Friday. Probably." },
        { tone: 'flirty', t: "Let me cheer you up.", r: "You already have. That's annoying. Do it more." },
        { tone: 'risque', t: "Come over. I'll outrank you too.", r: "Ha. You can try. I've been outranked once today. You'll have to earn the second." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: ["My cat Admiral knocked my coffee onto my laptop. He outranks me. The position is filled. You may not apply.", "My cat Admiral is sitting on my keyboard. He's the only one allowed to tell me what to do. Applications are closed."],
    opts: [
      { tone: 'cold', t: "Good. I don't want the job.", r: "Pity. The benefits are excellent. Fine. Admiral keeps the post.", opts: [
        { tone: 'cold', t: "Still don't want it.", r: "Understood. Applications closed. Good night." },
        { tone: 'passive', t: "What are the benefits?", r: "Breakfast. Arguments. Me, on your side, permanently. Think about it." },
        { tone: 'flirty', t: "Unless you reopen applications.", r: "...I might. For one candidate. You." },
      ] },
      { tone: 'passive', t: "Poor laptop.", r: "Poor me. The laptop's insured. My pride isn't.", opts: [
        { tone: 'cold', t: "Buy a new one. Problem solved.", r: "I don't buy. I recover. Fine. Recovering." },
        { tone: 'passive', t: "Is the cat at least sorry?", r: "Never. He's asleep. On my notes. Smug." },
        { tone: 'flirty', t: "Let me tell you what to do, then.", r: "You can try. I'll listen. I might even obey. Once." },
      ] },
      { tone: 'flirty', t: "I wasn't going to ask permission.", r: "I know. That's the problem with you. It's also the appeal.", opts: [
        { tone: 'cold', t: "Drop it, then.", r: "Forgotten. Officially." },
        { tone: 'passive', t: "Okay. I'll ask nicely.", r: "Ask, then. Nicely. I'll consider it." },
        { tone: 'flirty', t: "I'll take the job without applying.", r: "Bold. Very bold. You've got the job. Start Friday." },
        { tone: 'risque', t: "Tell me what to do tonight.", r: "Call me. Now. Then go to sleep thinking about me. That's tonight's list." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: ["You've been cold. I'm still on your side. Someone online called you 'beatable'. I've taken it personally.", "Not talking to me? Fine. Some stranger online called you beatable. I'm furious. Somebody should be."],
    opts: [
      { tone: 'cold', t: "It's just internet talk.", r: "It's an insult. Fine. You're calm. I'll be furious for both of us." },
      { tone: 'passive', t: "Ignore them. I will.", r: "Good. Then prove them wrong at {track}. I'll be watching." },
      { tone: 'flirty', t: "You're cute when you're furious.", r: "I'm not cute. I'm committed. Win at {track}. For both of us." },
    ],
  },
  {
    id: 'dominant-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: ["Saw a comment calling you 'beatable'. I'm offended. Professionally. Make them eat it at {track}.", "Someone online thinks you're beatable. I've added them to my list. People I glare at. Short, select, glared at."],
    opts: [
      { tone: 'cold', t: "Don't make it your fight.", r: "It's not my fight. It's my opinion. Loudly held. Quietly expressed. Mostly." },
      { tone: 'passive', t: "I'll beat them.", r: "Good. Then I'll reread their comment very slowly afterwards. With popcorn." },
      { tone: 'flirty', t: "My own personal enforcer.", r: "Your own personal supporter. With an excellent glare." },
    ],
  },
  {
    id: 'dominant-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: ["Someone online called you beatable. I'm offended on your behalf. Win at {track}. Then I'll reward you.", "I read the comments. 'Beatable'. Ha. Prove them wrong at {track}. Then come and tell me about it. In person."],
    opts: [
      { tone: 'cold', t: "I don't need a reward.", r: "Everyone needs a reward. Fine. I'll keep it. It'll keep." },
      { tone: 'passive', t: "I'll win. For you.", r: "For yourself. Then for me. In that order. Good." },
      { tone: 'flirty', t: "What's the reward?", r: "Win first. Then you'll find out. You'll like it." },
    ],
  },
  {
    id: 'dominant-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: ["Can't sleep. You're cold with me, which doesn't help. Talk to me anyway. That's an order. A gentle one.", "It's 2am. I'm awake. You're not speaking to me. I'd like that fixed. Gently."],
    opts: [
      { tone: 'cold', t: "Go to sleep.", r: "Fine. Order received. Good night. Sleep well, whatever you think of me." },
      { tone: 'passive', t: "What's keeping you up?", r: "{work}. And you, a little. Mostly you. Don't get smug." },
      { tone: 'flirty', t: "I'll talk you to sleep.", r: "Good. Start talking. Slowly. I'll stop pretending I'm annoyed." },
    ],
  },
  {
    id: 'dominant-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: ["Can't sleep. Talk to me. Consider it an order. A soft one.", "2am. Awake. Talk to me for five minutes. Anything. Your messages work better than counting."],
    opts: [
      { tone: 'cold', t: "It's late. Sleep.", r: "I know it's late. Fine. Good night. I'll stare at the ceiling. Productively." },
      { tone: 'passive', t: "What's on your mind?", r: "Everything. Nothing. You, mostly. Tell me about your day. All of it." },
      { tone: 'flirty', t: "I'll stay up with you.", r: "Good. That's what I wanted. I didn't want to say it. I said it." },
      { tone: 'risque', t: "I'd rather be there than texting.", r: "Bold. 2am bold. Ask me again at 8pm and I'll say yes." },
    ],
  },
  {
    id: 'dominant-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: ["Can't sleep. I blame you. Talk to me until I can. That's your job now.", "It's late and I'm thinking about you. I don't do that. I'm doing it. Talk to me."],
    opts: [
      { tone: 'cold', t: "Not my job.", r: "Fine. Unemployment it is. Good night." },
      { tone: 'passive', t: "I'm here. What's up?", r: "Nothing's up. I just wanted you. Well. Your attention. Same thing, at this hour." },
      { tone: 'flirty', t: "I'm thinking about you too.", r: "Good. Then neither of us is sleeping. Suits me." },
      { tone: 'risque', t: "Want me to come over?", r: "...Yes. No. Not at this hour. Ask me at a decent one. I'll say yes then too." },
    ],
  },
  {
    id: 'dominant-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: ["Someone at work called me bossy. I said 'correct'. You've been cold lately. Is it me being bossy? Honest answer.", "I'm told I'm bossy. I've decided not to argue. But you've gone quiet. Am I too much? Straight answer. I can take it."],
    opts: [
      { tone: 'cold', t: "Sometimes, yes.", r: "...Appreciated. I'll work on it. Tell me when. I'll listen.", opts: [
        { tone: 'cold', t: "Like now.", r: "Noted. Backing off. Good night." },
        { tone: 'passive', t: "It's mostly fine. Just ask more.", r: "Ask more. Doable. It'll look strange on me. I'll do it anyway." },
        { tone: 'flirty', t: "I like bossy. Just not always.", r: "Got it. Bossy, but with an off switch. You hold the switch." },
      ] },
      { tone: 'passive', t: "No. I've just been busy.", r: "Good. I mean - good you're not avoiding me. Not good you're busy. Eat something.", opts: [
        { tone: 'cold', t: "Stop worrying about it.", r: "I don't worry. I check. Checked. Good night." },
        { tone: 'passive', t: "Bossy's part of your charm.", r: "Part. Not all. I'll keep the rest charming too." },
        { tone: 'flirty', t: "Honestly? Bossy works for me.", r: "Then I'll stay bossy. For you. On request." },
      ] },
      { tone: 'flirty', t: "You're bossy and I like it.", r: "Good. Then I'm keeping it. Thank you for not making me guess.", opts: [
        { tone: 'cold', t: "Don't push your luck.", r: "I won't. Pushing luck is how people lose it." },
        { tone: 'passive', t: "Just bossy enough.", r: "Just enough. Perfect. That's my target." },
        { tone: 'flirty', t: "Be bossy with me tonight.", r: "Careful. I'll take that as a request. Call me at 9. Not 8:59. 9." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: ["A colleague called me bossy today. I said 'correct' and moved on. Question: am I bossy with you? Honest.", "Got called bossy today. Took it as a compliment. Then wondered: am I like that with you? Tell me straight."],
    opts: [
      { tone: 'cold', t: "Yes. Very.", r: "Thank you. Honesty is the only currency I accept. I'll dial it down. Not off. Down.", opts: [
        { tone: 'cold', t: "Dial it down a lot.", r: "Understood. A lot. I'll ask before I decide. Starting now." },
        { tone: 'passive', t: "It's fine. Mostly.", r: "Mostly. I'll fix the rest. Point it out when you see it." },
        { tone: 'flirty', t: "I don't want it off.", r: "Good. Neither do I. Down a notch, then. Not off." },
      ] },
      { tone: 'passive', t: "A bit. But I like it.", r: "Good. I'll keep the bit you like. You'll tell me if the rest gets too much.", opts: [
        { tone: 'cold', t: "It sometimes gets too much.", r: "Then tell me when. In the moment. I'll stop. That's a promise." },
        { tone: 'passive', t: "Why do you ask?", r: "Because yours is the only opinion I can't overrule. That's why I value it." },
        { tone: 'flirty', t: "I like you being in charge.", r: "I know. I like being in charge of you. Within reason. Your reason." },
      ] },
      { tone: 'flirty', t: "Bossy suits you.", r: "I know. But I want to know it suits you too.", opts: [
        { tone: 'cold', t: "Not always.", r: "Then tell me when it doesn't. I'll stop. I can stop. Watch." },
        { tone: 'passive', t: "It does. Mostly.", r: "Mostly. Good. I'll work on the 'mostly'." },
        { tone: 'flirty', t: "It suits me very much.", r: "Then I'll keep it on. Tonight: call me. That's me being bossy. You may refuse." },
        { tone: 'risque', t: "Show me how bossy you can be.", r: "Friday. 8. Mine. You'll find out. You can say no to any of it. You won't." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: ["Got called bossy at work. I said thank you. Now I'm wondering if you like it. Don't lie. I'll know.", "Bossy. That's the word someone used today. I want your verdict. You've seen me up close."],
    opts: [
      { tone: 'cold', t: "It's a lot sometimes.", r: "Honest. Thank you. I'll ease off. Tell me when I don't.", opts: [
        { tone: 'cold', t: "Ease off now, please.", r: "Easing off. Good night." },
        { tone: 'passive', t: "It's fine. You're fine.", r: "I'm better than fine. But thank you." },
        { tone: 'flirty', t: "I wouldn't change it. Much.", r: "Much. Fine. Tell me which bit. I'll consider it." },
      ] },
      { tone: 'passive', t: "I like it. Mostly.", r: "Mostly is good. I'll take mostly. I'll aim for entirely.", opts: [
        { tone: 'cold', t: "Not when I'm tired.", r: "Fair. Tired gets gentle. Noted. Sleep." },
        { tone: 'passive', t: "My verdict? Also bossy.", r: "I'll take that. From you it's practically a compliment." },
        { tone: 'flirty', t: "I like it a lot.", r: "Good. That's what I wanted to hear. Now: sleep. That's an order you'll like." },
      ] },
      { tone: 'flirty', t: "Bossy is my favourite thing about you.", r: "Top of the list? I'll fight to stay there.", opts: [
        { tone: 'cold', t: "Easy, now.", r: "Easy. I can do easy. Night." },
        { tone: 'passive', t: "You can boss me any time.", r: "Any time is a lot of time. I'll ration it." },
        { tone: 'flirty', t: "Boss me around this weekend.", r: "I'll draw up a schedule. Every item vetoable. You won't veto." },
        { tone: 'risque', t: "Boss me around in person.", r: "Friday. Mine. Come hungry. Leave late. That's the plan. Say yes." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: ["You fly to {track} soon. Things have been cool between us. I'd still like to see you first. Tomorrow, 7. I'll cook.", "Before {track}: dinner. Mine. Tomorrow at 7. You've been distant, so I'm asking, not telling."],
    opts: [
      { tone: 'cold', t: "Can't. Packing.", r: "Fine. Pack well. Eat something. Win." },
      { tone: 'passive', t: "Okay. 7.", r: "Good. Come hungry. I'll send you off properly fed." },
      { tone: 'flirty', t: "Only if you're cooking something good.", r: "I only cook good things. I'll cook the best one. 7." },
    ],
  },
  {
    id: 'dominant-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: ["Before you fly to {track}: tomorrow, 7, mine. I'm cooking. Go easy on lunch.", "I want to see you before {track}. Tomorrow. 7. I'll cook. You'll eat. Then you'll sleep early. That's the plan."],
    opts: [
      { tone: 'cold', t: "I've got too much on.", r: "Understood. When you're back, then. Fly safe. I mean it." },
      { tone: 'passive', t: "Yes. What are you making?", r: "Pasta. Proper. Fuel. Don't argue with carbohydrates." },
      { tone: 'flirty', t: "Can I stay after?", r: "We'll see. You've got a flight. I'm very responsible. ...We'll see." },
      { tone: 'risque', t: "Cook for me, then keep me up late.", r: "No. Cook for you, then send you to bed early. You've got a race. I'm sorry. I'm not." },
    ],
  },
  {
    id: 'dominant-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: ["Before {track}, I want you. Dinner. Mine. Tomorrow at 7. Not optional. Optional.", "Tomorrow, 7. My place. I'm cooking. You're coming. Unless you're not. But you are."],
    opts: [
      { tone: 'cold', t: "Not this time.", r: "Then not this time. Fly safe. Win. I'll be watching." },
      { tone: 'passive', t: "I'll be there.", r: "Good. I'll send you to {track} fed and smug." },
      { tone: 'flirty', t: "I'll bring dessert.", r: "You are dessert. ...I've been waiting all week to send that. Bring it anyway." },
      { tone: 'risque', t: "I'll stay the night.", r: "We'll discuss that at dessert. I'm leaning yes. You still get an early night. Mostly." },
    ],
  },
  {
    id: 'dominant-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: ["You went quiet on me. I don't like it. Morning anyway. You're still mine. Eat something.", "Cold shoulder by text now? Fine. Good morning regardless. Eat breakfast. Call me when you've stopped sulking."],
    opts: [
      { tone: 'cold', t: "Not sulking. Just busy.", r: "Busy, then. Busy people still eat. Busy people still text back. Try both." },
      { tone: 'passive', t: "Morning. Sorry. Eating now.", r: "Good. Apology accepted. Breakfast confirmed. Day improved." },
      { tone: 'flirty', t: "Still yours. Even when quiet.", r: "...Good. That'll do. Eat." },
    ],
  },
  {
    id: 'dominant-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: ["Morning. You're still mine. Eat something. That's it. That's the whole text.", "Good morning. Reminder: you're mine, and breakfast isn't optional."],
    opts: [
      { tone: 'cold', t: "Bit early for this.", r: "It's never too early for breakfast. Or me. Fine. Go back to sleep." },
      { tone: 'passive', t: "Morning. Eating.", r: "Good. Proof, please. I don't trust 'eating'." },
      { tone: 'flirty', t: "Morning. Still yours.", r: "Good. Stay that way. I'm very happy with the arrangement." },
    ],
  },
  {
    id: 'dominant-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: ["Morning. Woke up thinking about you. Annoying. Eat something. Then think about me.", "Good morning, mine. I've decided today's agenda: you eat, you train, you miss me. Go."],
    opts: [
      { tone: 'cold', t: "I'll skip the missing you part.", r: "You won't manage it. But fine. Try. Eat, at least." },
      { tone: 'passive', t: "Eating. Training. Missing you.", r: "In that order. Good. You're very obedient this morning." },
      { tone: 'flirty', t: "I've already started missing you.", r: "Good. Skip ahead. That's allowed. Eat first." },
    ],
  },
  {
    id: 'dominant-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: ["You've been miles away. Literally and otherwise. The week's too long. I don't like either.", "The week's enormous without you. And you've been distant. One of those I can fix. Thursday."],
    opts: [
      { tone: 'cold', t: "I need a bit of room.", r: "Then have it. Room's yours. Thursday's still there if you want it." },
      { tone: 'passive', t: "Sorry. I miss you too.", r: "Good. Thursday, then. I'll fix the week. You fix the distance." },
      { tone: 'flirty', t: "I'll fix the week Thursday.", r: "That's the one. Thursday. Don't be late." },
    ],
  },
  {
    id: 'dominant-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: ["My evenings are too long without you. Fix it Thursday.", "I've slept badly all week. Your fault. You're not here. Thursday. You're here."],
    opts: [
      { tone: 'cold', t: "I'm busy Thursday.", r: "Then Friday. Then whenever. Your evenings are yours. Mine are mostly yours too." },
      { tone: 'passive', t: "Thursday. Promise.", r: "Good. Promises from you I keep a record of. Thursday." },
      { tone: 'flirty', t: "I miss being by your side too.", r: "My side. It's all yours. Get here." },
      { tone: 'risque', t: "I'll make it worth the wait.", r: "Good. I expect a lot. Thursday. Early." },
    ],
  },
  {
    id: 'dominant-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: ["Can't sleep. Pillows are the wrong temperature. It's all your fault. Get over here.", "I'm in bed. You're not. This is a problem I intend to solve Thursday."],
    opts: [
      { tone: 'cold', t: "You'll survive.", r: "I'll survive. Badly. Fine." },
      { tone: 'passive', t: "Thursday. I'll be there.", r: "Good. I'll make sure the pillows are correct." },
      { tone: 'flirty', t: "I'll be your pillow.", r: "Correct answer. Thursday. Earliest flight." },
      { tone: 'risque', t: "Describe the problem in detail.", r: "No. You'll get the details Thursday. In person. All of them." },
    ],
  },
  {
    id: 'dominant-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: ["You've been cool with me lately. Meanwhile half the paddock gets you all weekend. Who's your favourite? Asking calmly.", "I'm not jealous. I'm noticing. You're distant with me and spend every weekend with a garage full of people."],
    opts: [
      { tone: 'cold', t: "It's my team. Relax.", r: "I'm relaxed. I'm also noticing. Both. Fine. Team.", opts: [
        { tone: 'cold', t: "Stop doing this.", r: "Fine. Stopping. I don't like the distance, though. I'll say that once." },
        { tone: 'passive', t: "They're just colleagues, honestly.", r: "I believe you. I wanted to hear it. That's all." },
        { tone: 'flirty', t: "You're cute jealous.", r: "I'm not cute. I'm extremely calm. With a slight twitch." },
      ] },
      { tone: 'passive', t: "There's nobody. I promise.", r: "I know. I trust you. I just wanted you to tell me. And now you have.", opts: [
        { tone: 'cold', t: "You don't trust me?", r: "I trust you completely. I just like you telling me things. Good night." },
        { tone: 'passive', t: "Want a photo of just me?", r: "Yes. Just you. I'll keep it. That's not jealousy. That's taste." },
        { tone: 'flirty', t: "You're the only one I want an arm round.", r: "Good. My arm. Your shoulder. Thursday." },
      ] },
      { tone: 'flirty', t: "Jealous?", r: "Not jealous. Attentive. Very attentive.", opts: [
        { tone: 'cold', t: "Don't be.", r: "Understood. Filed away. You'll still see it on my face." },
        { tone: 'passive', t: "Nothing to be attentive about.", r: "Good. Then I'll attend to you instead." },
        { tone: 'flirty', t: "I like you attentive.", r: "Then I'll stay this way. All weekend." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: ["Who do you stand next to all race weekend. I'm asking calmly. Very calmly. Look how calm.", "Race weekend. Hundreds of people near you. None of them me. I've noticed. That's all. I'm fine."],
    opts: [
      { tone: 'cold', t: "Not your business.", r: "It's not. You're right. I'm still allowed to dislike the hundreds. Quietly.", opts: [
        { tone: 'cold', t: "Still none of your business.", r: "Fine. Out of it. Good night." },
        { tone: 'passive', t: "Just my team.", r: "Good. They can keep you. For the weekend. Joking. Mostly joking." },
        { tone: 'flirty', t: "Jealousy looks good on you.", r: "It looks better on you. Send me a photo of just you." },
      ] },
      { tone: 'passive', t: "Mostly my engineer. Who talks about tyre data. Relax.", r: "...Good. I mean - riveting for them. Very happy for them. Unclench, I'm telling myself.", opts: [
        { tone: 'cold', t: "You're being a lot.", r: "I am. I'll stop. You're mine. I trust that more than I distrust the paddock." },
        { tone: 'passive', t: "They're harmless.", r: "I'm sure they are. I'm not. Harmless, I mean. But I'll behave." },
        { tone: 'flirty', t: "Nothing to worry about. Really.", r: "I know. I wanted to hear it in writing. Saved." },
      ] },
      { tone: 'flirty', t: "Calm? You?", r: "Calm. Composed. Mature. Slightly furious. Mostly calm.", opts: [
        { tone: 'cold', t: "Get over it.", r: "...Fine. Over it. You could've been nicer, but fine." },
        { tone: 'passive', t: "It's nobody. I promise you.", r: "I believe you. Thank you. I'll put my glare away." },
        { tone: 'flirty', t: "Come put your arm round me instead.", r: "Thursday. Both arms. No photos." },
        { tone: 'risque', t: "Show me whose I am this weekend.", r: "Planning to. Clear Saturday. And Sunday morning." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: ["Race weekend again. Everyone near you except me. I'm being extremely mature. Formal request: save me the best of you.", "I'm not jealous. I just want to be the one standing next to my person all weekend. Formal request lodged."],
    opts: [
      { tone: 'cold', t: "You don't get to make requests like that.", r: "Correct. I don't. It's a wish, then. Very politely made. Through gritted teeth.", opts: [
        { tone: 'cold', t: "Wish denied.", r: "...Denied. Fine. I'll sulk with dignity." },
        { tone: 'passive', t: "Wish noted.", r: "Noted is good. Granted would be better. I'll wait." },
        { tone: 'flirty', t: "Wish granted.", r: "Excellent. Thursday. Close as possible." },
      ] },
      { tone: 'passive', t: "Very mature. Well done.", r: "Thank you. It's been very hard. I deserve a reward.", opts: [
        { tone: 'cold', t: "No reward for that.", r: "Harsh. Fair. Good night." },
        { tone: 'passive', t: "What reward?", r: "You. Thursday. Close. That's all." },
        { tone: 'flirty', t: "Rewards in person.", r: "Thursday, then. I'll collect." },
      ] },
      { tone: 'flirty', t: "Your person?", r: "My person. You. Did I stutter.", opts: [
        { tone: 'cold', t: "I'm my own person.", r: "You are. Always. I just get to call you mine. If you'll let me." },
        { tone: 'passive', t: "Okay. Your person.", r: "Good. Glad we've cleared that up." },
        { tone: 'flirty', t: "Again. Say it.", r: "My person. Mine. Thursday I'll say it in person." },
        { tone: 'risque', t: "Come and claim me, then.", r: "Thursday. And I'm very thorough when I claim things." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: ["Quiet week. Admiral - my cat - is my only company. Poor substitute. I won't admit for what. I'm cracking.", "The cat's asleep on me. He doesn't know you've gone cold on me. I'm not telling him. He'd gloat."],
    opts: [
      { tone: 'cold', t: "So talk to the cat.", r: "He doesn't answer either. Fine. He's a cat. You're not here. That's the problem." },
      { tone: 'passive', t: "Sorry. I miss you.", r: "Good. I'll tell him. He won't care. I do. A great deal." },
      { tone: 'flirty', t: "Lucky cat.", r: "He is. He doesn't know it. I'd swap him for you in a heartbeat. Don't tell him." },
    ],
  },
  {
    id: 'dominant-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: ["Admiral slept on me all night. My cat, the tyrant. I let him. Poor substitute for you. Don't tell him I said so.", "[photo] The cat. My lap. He refuses to move. I've stopped trying. Come and reclaim it."],
    opts: [
      { tone: 'cold', t: "Tell him to get off.", r: "I don't tell him anything. He outranks me. You can tell him Thursday." },
      { tone: 'passive', t: "That's adorable. Give him a scratch from me.", r: "Done. He bit me. Typical. I'm sulking. Elegantly. Missing you, less elegantly." },
      { tone: 'flirty', t: "Keep it warm for me.", r: "He's on it. I'm on it. It's the warmest lap in the country." },
    ],
  },
  {
    id: 'dominant-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: ["Admiral's asleep on my chest. Wrong occupant. I'm envious of a cat. Thursday, hurry up.", "The cat's lying across me. I'd rather it was you instead of the cat. Thursday."],
    opts: [
      { tone: 'cold', t: "Get a second cat.", r: "One tyrant's enough. Fine. Good night." },
      { tone: 'passive', t: "Missing you too.", r: "Good. Thursday. Bring nothing but yourself. I'll see to everything else." },
      { tone: 'flirty', t: "Thursday. I'll replace the cat.", r: "Good. You're warmer. He'll have to cope." },
      { tone: 'risque', t: "Thursday you can have me instead.", r: "...Agreed. Strongly agreed. Thursday. Early." },
    ],
  },
  {
    id: 'dominant-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: ["You've been distant. I want a weekend with you after {track}. I've found one. Not booked - I'm asking first. Yes or no.", "Things feel far. I'd like to fix that. A weekend away after {track}? I've held it, not booked it. Your call."],
    opts: [
      { tone: 'cold', t: "Not now.", r: "Then not now. I'll release it. I'm not angry. I'm disappointed. Mostly in the distance." },
      { tone: 'passive', t: "Yes. I'd like that.", r: "Good. Booking it now. Thank you for saying yes. I needed it." },
      { tone: 'flirty', t: "Book it. And book me.", r: "...Booked. Both. Good." },
    ],
  },
  {
    id: 'dominant-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: ["Booked us a weekend after {track}. You can veto. Say the word and it's gone. You won't say the word.", "Weekend after {track}: coast, a cottage, no phones. I've booked it. Veto if you need to. I mean that."],
    opts: [
      { tone: 'cold', t: "Veto. I've got commitments.", r: "Vetoed. Cancelled. No sulking. We'll find another one. I'll ask first." },
      { tone: 'passive', t: "No veto. I'm in.", r: "Good. Pack light. I'll pack for both of us anyway." },
      { tone: 'flirty', t: "No phones? Dangerous.", r: "Very. Just you and me and nothing to do. I'll come up with something." },
      { tone: 'risque', t: "No phones means no witnesses.", r: "Exactly. I've planned everything. You've planned nothing. Perfect." },
    ],
  },
  {
    id: 'dominant-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: ["I've booked us a weekend after {track}. Veto if you must. I'd be crushed. Elegantly.", "Weekend after {track}. Just us. I've held a cottage. One word from you and it's ours. Or not. Word, please."],
    opts: [
      { tone: 'cold', t: "Can't. Sorry.", r: "Then can't. I'll release it. Next time I'll ask before I fall in love with a cottage." },
      { tone: 'passive', t: "Yes. Book it.", r: "Booked. Good. I've been smiling for ten minutes. Don't tell anyone." },
      { tone: 'flirty', t: "Only if you plan every minute.", r: "Every minute. Including the ones you don't know about yet." },
      { tone: 'risque', t: "Book it. Bring nothing but you.", r: "Ha. I'll bring snacks too. You'll be hungry. Trust me." },
    ],
  },
  {
    id: 'dominant-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: ["You've felt far off. So, the big thing: I've been looking at places with a garden. For us. Tell me if it's too much.", "Distance makes me plan. I've been looking at houses. With a garden. For you, me and the cat. Too much? Say so."],
    opts: [
      { tone: 'cold', t: "It's too much.", r: "...Fair. I'll fold it up and keep it. I'm staying put.", opts: [
        { tone: 'cold', t: "Way too much.", r: "Understood. Shelved. I'm still here. Good night." },
        { tone: 'passive', t: "Maybe one day. Not yet.", r: "One day. I'll take one day. I'll wait for it." },
        { tone: 'flirty', t: "Too much. But keep looking.", r: "I will. Quietly. I'll show you when you're ready." },
      ] },
      { tone: 'passive', t: "I'd like that. Eventually.", r: "Eventually is fine. I'm good at eventually. I'm better at soon.", opts: [
        { tone: 'cold', t: "Not soon, though.", r: "Not soon. Understood. I'll stop browsing. Mostly." },
        { tone: 'passive', t: "Show me one.", r: "[photo] Big garden. Small kitchen. A door you can see from every room. You'd love it." },
        { tone: 'flirty', t: "Soon, then.", r: "...Soon. You said soon. Noted. Underlined." },
      ] },
      { tone: 'flirty', t: "A garden for the cat?", r: "For the cat. For you. For me, watching you both. Mostly for me.", opts: [
        { tone: 'cold', t: "Don't get ahead of us.", r: "I'm not. I'm standing right next to us. Fine. Next to you. Waiting." },
        { tone: 'passive', t: "That sounds nice.", r: "It's more than nice. It's the plan. Only if you're in." },
        { tone: 'flirty', t: "I want it. All of it.", r: "Good. Then I'll stop looking and start choosing." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: ["Been thinking. Somewhere with a garden. For the cat. And you. Mostly you.", "I've started looking at houses. Don't panic. Garden for the cat. The rest for you, mostly."],
    opts: [
      { tone: 'cold', t: "That's a big step.", r: "It is. I'm not taking it without you. I'm just looking at the stairs.", opts: [
        { tone: 'cold', t: "Too big.", r: "Then we wait. I'll stop looking. Good night." },
        { tone: 'passive', t: "Let's talk about it in person.", r: "Thursday. I'll bring the brochures. Kidding. Mostly." },
        { tone: 'flirty', t: "A big step I'd take with you.", r: "...Good. Then we'll take it together. My pace. Your say." },
      ] },
      { tone: 'passive', t: "I've thought about it too.", r: "You have? ...Good. Then we're both looking. That's a plan.", opts: [
        { tone: 'cold', t: "Not seriously, though.", r: "Not seriously. Fine. I'll keep it light. For now." },
        { tone: 'passive', t: "What kind of garden?", r: "One with a bench. For you. And a fence. For the cat. And a door I can see." },
        { tone: 'flirty', t: "With you, anywhere.", r: "That's not a plan. That's a declaration. I'll take it." },
      ] },
      { tone: 'flirty', t: "Mostly me?", r: "Entirely you. The garden's a cover story.", opts: [
        { tone: 'cold', t: "Slow down.", r: "Slowing. Quietly. For now." },
        { tone: 'passive', t: "That's very sweet.", r: "Don't tell anyone. I have a reputation." },
        { tone: 'flirty', t: "I'll plant something for you.", r: "Plant something hardy. Like you. You've survived me." },
      ] },
    ],
  },
  {
    id: 'dominant-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: ["I've been browsing houses. Garden: the cat's. Big bed: ours. Me in charge of everything else. Don't tell the cat.", "Picture it: our place. A garden. The cat in charge. Me in charge of everything else. You, mine. Thoughts."],
    opts: [
      { tone: 'cold', t: "Bit fast.", r: "Fast is my speed. Fine. I'll slow down for you. Only for you.", opts: [
        { tone: 'cold', t: "Much slower.", r: "Understood. Much slower. I'll still be here at the end of it." },
        { tone: 'passive', t: "A little slower.", r: "A little. I can manage a little." },
        { tone: 'flirty', t: "Fast's fine. Just not yet.", r: "Fast but later. I can work with that." },
      ] },
      { tone: 'passive', t: "I like the sound of it.", r: "Good. I like the sound of you liking it.", opts: [
        { tone: 'cold', t: "Let's not jump.", r: "I don't jump. I plan. But fine - planning paused." },
        { tone: 'passive', t: "Tell me more.", r: "Bench in the garden. Breakfast outside. You, arguing with me about the hedge." },
        { tone: 'flirty', t: "Me, yours. Definitely.", r: "Good. Then the rest is details. I'm very good at details." },
      ] },
      { tone: 'flirty', t: "In charge of everything else?", r: "Everything. Except you. You're in charge of you. I'm in charge of loving it.", opts: [
        { tone: 'cold', t: "Sounds controlling.", r: "It's not. It's a joke. Mostly. You run you. Always." },
        { tone: 'passive', t: "That's fair.", r: "It is. I'm very fair. Occasionally." },
        { tone: 'flirty', t: "I'll let you be in charge. Sometimes.", r: "Sometimes is plenty. I'll make the most of it." },
        { tone: 'risque', t: "Be in charge tonight.", r: "Gladly. Call me. Now. You'll find out what that means." },
      ] },
    ],
  },
];
