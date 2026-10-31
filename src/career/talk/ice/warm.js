// ALOOF (ice) - in person, stage 'warm', slots 1-9: closer. A free Thursday (a fact with potential); your jacket on a
// cold evening, which they keep; the terrace and the lemon tree that has never fruited; 'a lot of work' - everyone who
// liked the edges asked them to sand them off; someone laughing too hard at your jokes; the piano at two in the
// morning; the grandmother asking about you; the almost-kiss; slot 9: 'are we something?' - and they choose you.
// Cold here reads as a door closing (0); flirting lands and they flirt back, understated; a dare they may accept.
export const DATA = [
  // ---- slot 1: a free Thursday - 'not an invitation, a fact with potential' --------------------------------------------
  { id: 'ice-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "You were cool last time. I nearly didn't come over. Thursday evening, I'm free. Not an invitation. A fact.",
    opts: [
      { tone: 'cold', t: "Good for you.", r: "Charming. I'll spend it with a book, then. Books don't sulk. Do you?", opts: [
        { tone: 'cold', t: "I don't sulk.", r: "No. You withdraw. It's worse, and I'd know. Enjoy your Thursday." },
        { tone: 'passive', t: "Sorry. I was in a mood. Is Thursday still free?", r: "It's still a fact. Facts don't wait forever. Ask me properly, by text." },
        { tone: 'flirty', t: "What if the fact had potential?", r: "Then it would need a reservation and a better tone. ...You've half got the tone." },
      ] },
      { tone: 'passive', t: "What would you want to do with it?", r: "Somewhere quiet. No photographers. Good bread. Somebody who doesn't check their phone.", opts: [
        { tone: 'cold', t: "That rules out most places.", r: "It rules out most people. That's the point. Consider whether it rules out you." },
        { tone: 'passive', t: "I know a place. Small. Nobody bothers you there.", r: "Nobody bothering me is the dream. Thursday, then. Eight. I won't wait past ten past." },
        { tone: 'flirty', t: "Somebody like me, then.", r: "Somebody who puts the phone face down. Prove it's you and you can have Thursday." },
      ] },
      { tone: 'flirty', t: "Then let me give it some potential.", r: "Potential. I've heard worse words from you. Go on, then. Make the offer. Carefully.", opts: [
        { tone: 'cold', t: "Actually, never mind. Busy week.", r: "Of course. I'll put Thursday back in the drawer. It's a large drawer." },
        { tone: 'passive', t: "Dinner. Somewhere quiet. Thursday.", r: "Accepted. Don't look surprised; it unsettles the arrangement." },
        { tone: 'flirty', t: "Dinner, then a long walk, then we'll see.", r: "'We'll see' is my line. You've stolen it. I'll allow it, for Thursday." },
      ] },
    ] },
  { id: 'ice-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "I have a free evening on Thursday. That's not an invitation. It's a fact, with potential.",
    opts: [
      { tone: 'cold', t: "Facts are nice.", r: "Aren't they. Clean. Unemotional. Like you, right now. I'll find a use for Thursday elsewhere.", opts: [
        { tone: 'cold', t: "Do that.", r: "I will. I'm resourceful. Thursday will be lovely, and you'll never hear about it." },
        { tone: 'passive', t: "Wait. What kind of potential?", r: "The dinner kind. Not the 'hey, you up' kind. Ask before the fact expires." },
        { tone: 'flirty', t: "Unless the potential's me.", r: "Took you long enough. Yes. The potential was you. It usually is, lately. Don't gloat." },
      ] },
      { tone: 'passive', t: "Then let's make it a plan. Dinner?", r: "A plan. Good. You choose the place. If it has a neon sign, I'm leaving.", opts: [
        { tone: 'cold', t: "Fine. You choose, then.", r: "I always end up choosing. It's tiring being right. Expect an address." },
        { tone: 'passive', t: "Small, quiet, no neon. I promise.", r: "Promises noted. I'll be early. I always am. I'll pretend I've just arrived." },
        { tone: 'flirty', t: "Somewhere with candles, then.", r: "Candles are a cliché. ...A small one. On the table. I'll allow one candle." },
      ] },
      { tone: 'flirty', t: "I had potential in mind for Thursday too.", r: "Did you. You've had that look since you walked over. I assumed it was the light.", opts: [
        { tone: 'cold', t: "Just the light.", r: "Pity. I had a reservation in mind. I'll cancel it. Quietly." },
        { tone: 'passive', t: "Dinner, then. My treat.", r: "Your treat. I accept. I'll order the expensive thing, as a test of character." },
        { tone: 'flirty', t: "It wasn't the light. It was you.", r: "I know. I was giving you a way out. You didn't take it. Thursday. Eight." },
        { tone: 'risque', t: "Dinner at mine. I'll cook. You can judge.", r: "At yours. Bold. ...I'll bring a coat and an open mind. Only one of those is a promise." },
      ] },
    ] },
  { id: 'ice-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "You've been looking at me like you're planning something. Thursday. I'm free. Plan it properly or don't plan it at all.",
    opts: [
      { tone: 'cold', t: "I wasn't planning anything.", r: "Liar. A poor one. I'll give you until Wednesday to start telling the truth.", opts: [
        { tone: 'cold', t: "Nothing to tell.", r: "Then Thursday goes to someone with a plan. They're queueing. Not really. A bit." },
        { tone: 'passive', t: "Okay. Maybe dinner.", r: "Maybe dinner. You said that like a weather forecast. Say it like a booking." },
        { tone: 'flirty', t: "Alright. I was planning you.", r: "Me. Plural evenings, I hope. Start with one. Thursday." },
      ] },
      { tone: 'passive', t: "Dinner. Thursday. I'll book.", r: "Good. Simple. You'd be amazed how many people make this complicated.", opts: [
        { tone: 'cold', t: "It's just dinner.", r: "Of course. Just dinner. I'll wear something just dinner. You'll regret the word 'just'." },
        { tone: 'passive', t: "Anything you don't eat?", r: "Fuss. I don't eat fuss. And nothing pink. Otherwise, surprise me, within reason." },
        { tone: 'flirty', t: "I've been wanting to ask for weeks.", r: "I know. I've been watching you not ask. It was very entertaining. Thursday." },
      ] },
      { tone: 'flirty', t: "Oh, I'll plan it properly.", r: "Will you. Go on. Tell me one detail. I'll know if you're improvising.", opts: [
        { tone: 'cold', t: "You'll find out.", r: "Mysterious. Or empty. I'll find out which on Thursday, and so will you." },
        { tone: 'passive', t: "There's a table by a window. Nobody can see in.", r: "Good detail. Specific. Unflashy. You've been listening to me. I'll come." },
        { tone: 'flirty', t: "Detail one: you, across the table. That's it.", r: "That's not a detail, it's a premise. ...A decent one. Thursday." },
        { tone: 'risque', t: "Detail two is a secret. Ask me after dessert.", r: "After dessert. A dare. I'll take it. I'll take it with a look you won't sleep after." },
      ] },
    ] },

  // ---- slot 2: they're cold (always are); you lend them your jacket; they don't give it back. Establishes: they have your jacket
  { id: 'ice-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "I'm cold. I'm always cold. And you were frosty with me last time. The temperature's consistent, at least.",
    opts: [
      { tone: 'cold', t: "Should have brought a coat.", r: "My coat's in the car. Bringing one is a rule. Leaving it is the first rule I've broken this year.", opts: [
        { tone: 'cold', t: "Then go and get it.", r: "I will. Thank you for nothing. It suits you, the nothing." },
        { tone: 'passive', t: "Here. Take my jacket.", r: "...Thank you. It's warm. I'm keeping it until I've forgiven you. That could take a while." },
        { tone: 'flirty', t: "Take my jacket. I'll stay frosty.", r: "Generous and stubborn. Fine. I'll take the jacket. You keep the frost. I'm not giving it back." },
      ] },
      { tone: 'passive', t: "You're shivering. Have my jacket.", r: "I'm not shivering. I'm... fine. Give it here. Don't say anything.", opts: [
        { tone: 'cold', t: "Wasn't going to say anything.", r: "Good. Neither was I. ...It smells of engines and you. I'll survive it." },
        { tone: 'passive', t: "Keep it as long as you like.", r: "That's a dangerous offer. I don't give things back. Ask anyone. It's mine now." },
        { tone: 'flirty', t: "It looks better on you anyway.", r: "It does. Naturally. ...I'm keeping it. You've lost a jacket and a point, and gained another point." },
      ] },
      { tone: 'flirty', t: "I'll warm you up. Come here.", r: "That's very forward for someone who froze me out last time. ...The jacket, yes. The arm, no.", opts: [
        { tone: 'cold', t: "Forget it. Freeze, then.", r: "I will. Elegantly. You'll watch me do it and feel terrible. Off you go." },
        { tone: 'passive', t: "Jacket only. Here.", r: "Thank you. It's heavy. It's warm. It's mine now, I'm afraid. Returns are not my policy." },
        { tone: 'flirty', t: "The arm comes with the jacket. Package deal.", r: "...Fine. For a minute. For warmth. Purely. And I'm keeping the jacket." },
      ] },
    ] },
  { id: 'ice-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "I'm cold. I left my coat behind. That's a fact, not a complaint. I don't complain. I report.",
    opts: [
      { tone: 'cold', t: "Report noted.", r: "Is that all. You have a jacket on. I have a thin something. The maths isn't complicated.", opts: [
        { tone: 'cold', t: "I'm cold too.", r: "Then we'll both be cold, and principled. How lovely for us." },
        { tone: 'passive', t: "Alright. Take it.", r: "Thank you. Don't expect it back. Possession is nine-tenths of everything." },
        { tone: 'flirty', t: "If you want it, ask nicely.", r: "I don't ask nicely. I ask precisely. Jacket. Please. ...There. Now it's mine." },
      ] },
      { tone: 'passive', t: "Here. My jacket. Take it.", r: "You didn't make a speech about it. That's why I'll take it. Thank you.", opts: [
        { tone: 'cold', t: "I'll want it back.", r: "Will you. We'll see. Giving things back is a habit I never formed. A flaw I'm proud of." },
        { tone: 'passive', t: "Keep it for now.", r: "For now is a long time, with me. It's warmer than I expected. So are you, apparently." },
        { tone: 'flirty', t: "Looks good on you.", r: "Everything suits me. This suits me unfairly. I'm keeping it. Forever, probably." },
      ] },
      { tone: 'flirty', t: "I could keep you warm.", r: "You could lend me your jacket. That's the version that doesn't make me roll my eyes.", opts: [
        { tone: 'cold', t: "No jacket, then.", r: "No jacket. I'll stand here, principled and shivering. You've made your choice." },
        { tone: 'passive', t: "Jacket it is.", r: "Thank you. It's still warm from you. That's a fact, not a compliment. I'm keeping it." },
        { tone: 'flirty', t: "Jacket now. The other version later.", r: "The other version is under review. The jacket is approved. And confiscated." },
        { tone: 'risque', t: "Jacket now. Me later, if you're still cold.", r: "If I'm still cold. Bold. ...I'll let you know. With a look, probably." },
      ] },
    ] },
  { id: 'ice-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "I'm cold, and you've got that look again. Either lend me your jacket or stop looking. Preferably the first.",
    opts: [
      { tone: 'cold', t: "I'll stop looking.", r: "That's the wrong choice, and you know it. You're being difficult on purpose.", opts: [
        { tone: 'cold', t: "Maybe I am.", r: "Then I'll be cold on purpose. We'll see who breaks first. It won't be me." },
        { tone: 'passive', t: "Fine. Here's the jacket.", r: "Thank you. You hold out like a professional and give in like a gentle one. It's mine now." },
        { tone: 'flirty', t: "Jacket, and I'll keep looking.", r: "Both. Greedy. Accepted. ...I'm not giving it back, by the way. Either of them." },
      ] },
      { tone: 'passive', t: "Here. It's yours.", r: "Mine. You said it. I heard it. There are witnesses. It's legally mine now.", opts: [
        { tone: 'cold', t: "On loan.", r: "Nothing is on loan with me. You'll learn. Say goodbye to your jacket." },
        { tone: 'passive', t: "It's fine. I've got another.", r: "Then this one's officially the good one. I've improved it simply by wearing it." },
        { tone: 'flirty', t: "Keep it. I like seeing you in it.", r: "I know you do. It's why I'm keeping it. You'll have to come and look at it on me." },
      ] },
      { tone: 'flirty', t: "Jacket. And I'll keep looking.", r: "Of course you will. Give it here. ...It's warm. You're warm. That's very inconvenient.", opts: [
        { tone: 'cold', t: "Give it back if it's a problem.", r: "Not a chance. I keep inconvenient things. I'm just cross about it." },
        { tone: 'passive', t: "Better?", r: "Better. Considerably. Don't let it go to your head. Let it go to the jacket." },
        { tone: 'flirty', t: "You look good in my clothes.", r: "I look good in most things. Yours, unfairly so. This one stays with me." },
        { tone: 'risque', t: "It looks better on you. I'll come and collect it.", r: "Collect it. Ha. ...You'd have to take it off me. Good luck. I'd watch you try." },
      ] },
    ] },

  // ---- slot 3: their terrace and the lemon tree - nine years, never a lemon. Establishes: the lemon tree --------------
  { id: 'ice-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "You were curt. I went home and talked to my lemon tree instead. It's a better listener. Nine years and it's never interrupted.",
    opts: [
      { tone: 'cold', t: "Sounds like the perfect partner.", r: "It is. Quiet, loyal, undemanding. It's never once produced a lemon, mind. Nobody's perfect.", opts: [
        { tone: 'cold', t: "Stick with the tree, then.", r: "I may. It's never been curt with me. Enjoy {venue}." },
        { tone: 'passive', t: "Nine years and no lemons?", r: "None. I water it, I talk to it, I move it for the sun. It's the only thing I've never given up on." },
        { tone: 'flirty', t: "I'd interrupt you. Nicely.", r: "Interrupting nicely isn't a thing. ...You might make it one. Don't." },
      ] },
      { tone: 'passive', t: "You have a lemon tree?", r: "On my terrace. In a pot I can barely lift. It's never fruited. I keep it anyway.", opts: [
        { tone: 'cold', t: "Seems like a waste of a pot.", r: "Things don't have to be useful to be kept. Some people would know that." },
        { tone: 'passive', t: "Why keep it?", r: "Because I said I would. Because it's still trying. I respect anything that keeps trying." },
        { tone: 'flirty', t: "Show me the terrace sometime.", r: "Nobody sees the terrace. ...I'll show you a photograph. That's a beginning." },
      ] },
      { tone: 'flirty', t: "I'm a much better listener than a tree.", r: "You're a much louder one. The tree has nine years' seniority. You'd have to earn the pot.", opts: [
        { tone: 'cold', t: "I'm not competing with a plant.", r: "Then you've lost. The plant was competing. Quietly. It does everything quietly." },
        { tone: 'passive', t: "Tell me about it, then. I'll listen.", r: "It's never fruited. I water it anyway. That's it. That's the whole story. You listened well." },
        { tone: 'flirty', t: "Seniority can be overturned.", r: "Ambitious. The tree won't like it. I might. Don't tell the tree." },
      ] },
    ] },
  { id: 'ice-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "I have a lemon tree on my terrace. Nine years. It's never produced a single lemon. I'm telling you because nobody asks.",
    opts: [
      { tone: 'cold', t: "Sounds like a bad tree.", r: "It's a stubborn tree. There's a difference. I'd have thought you'd see it.", opts: [
        { tone: 'cold', t: "Stubborn and useless.", r: "Careful. I'm fond of it. It's the only thing I've never let down. Don't make me choose." },
        { tone: 'passive', t: "Okay. Stubborn. Why keep it?", r: "Because it's still trying, and so am I. Never mind. It's a tree." },
        { tone: 'flirty', t: "Stubborn. Like its owner.", r: "Its owner produces results. Eventually. Under the right conditions. You're learning the conditions." },
      ] },
      { tone: 'passive', t: "What do you think it's waiting for?", r: "I've no idea. The right winter. The right owner. I've stopped asking it. I just water it.", opts: [
        { tone: 'cold', t: "Maybe it's just broken.", r: "Maybe. People say that about me too. Thank you for the opinion." },
        { tone: 'passive', t: "It'll fruit one day.", r: "You sound sure. That's either kind or naive. I'll take kind, today." },
        { tone: 'flirty', t: "Maybe it's waiting for someone to show it off to.", r: "That's a very sentimental theory. ...I'll consider it, privately, on the terrace." },
      ] },
      { tone: 'flirty', t: "So I'm the first to hear about the lemon tree.", r: "The first in years. Don't read too much into it. Read exactly the right amount.", opts: [
        { tone: 'cold', t: "It's only a tree.", r: "And that was only a door, shutting. Never mind." },
        { tone: 'passive', t: "What does the terrace look like?", r: "High. Quiet. Too much sky. One chair. You'd notice the one chair, I suppose." },
        { tone: 'flirty', t: "I'm honoured. Show me sometime.", r: "Sometime. Daylight. A short visit. The tree is shy. So, occasionally, am I." },
        { tone: 'risque', t: "Show me the terrace. After dark.", r: "After dark the tree sleeps. I don't. ...That's not a yes. It's very close to one." },
      ] },
    ] },
  { id: 'ice-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "I told my lemon tree about you. Nine years, never a single lemon. It looked unimpressed. It looks like that at everyone.",
    opts: [
      { tone: 'cold', t: "You talk to a tree?", r: "I talk to a tree. You talk to a steering wheel. We all have our confidants.", opts: [
        { tone: 'cold', t: "My steering wheel answers back.", r: "So does my tree, eventually, I hope. Never mind. You wouldn't understand." },
        { tone: 'passive', t: "Fair. What did you tell it?", r: "That you're louder than you look and kinder than you let on. It didn't believe me either." },
        { tone: 'flirty', t: "As long as you say nice things.", r: "I say accurate things. Some of them are nice. More than I'd like." },
      ] },
      { tone: 'passive', t: "A lemon tree that's never fruited?", r: "On my terrace. I keep it alive out of principle. Nine years of hope in a very heavy pot.", opts: [
        { tone: 'cold', t: "Seems a lot of effort for nothing.", r: "Most things worth doing look like that, from outside. You'd know. Or should." },
        { tone: 'passive', t: "That's quite sweet, actually.", r: "Sweet. Don't. ...Fine. It's a little sweet. It stays between us and the tree." },
        { tone: 'flirty', t: "I'd like to meet it.", r: "It doesn't meet people. Neither do I. Somehow you keep meeting me." },
      ] },
      { tone: 'flirty', t: "Tell the tree I'll win it over.", r: "It's not the tree you'd have to win over. ...You know that. Stop smiling.", opts: [
        { tone: 'cold', t: "I'm not trying to win anyone.", r: "No? Pity. You were doing so well. The tree and I are disappointed." },
        { tone: 'passive', t: "One at a time, then.", r: "Sensible. Start with me. The tree takes longer. Nine years, so far." },
        { tone: 'flirty', t: "I know. I'm working on it.", r: "I know you are. It's working. I'm furious. The tree's thrilled." },
      ] },
    ] },
  // ---- slot 4: the first crack: 'a lot of work'. Everyone who liked the edges asked them to sand them off ------------
  { id: 'ice-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "You went quiet on me last time. People do, eventually. I've been told I'm a lot of work. I assume that's what happened.",
    opts: [
      { tone: 'cold', t: "Maybe they had a point.", r: "Maybe. Thank you. That's exactly what I needed to hear from you, of all people.", m: -2, opts: [
        { tone: 'cold', t: "You asked.", r: "I didn't, actually. I told. There's a difference. I'll stop telling you things." },
        { tone: 'passive', t: "That came out wrong. You're not a lot of work.", r: "It came out exactly as you meant it, then you heard it. Fine. I'll consider the correction." },
        { tone: 'flirty', t: "Worth the work, though. That's the point.", r: "Don't charm your way out of that. ...You nearly did. Next time, start there." },
      ] },
      { tone: 'passive', t: "That's not what happened. I was tired.", r: "Tired. Good. I can forgive tired. I can't forgive bored. Bored is what they all said, eventually.", opts: [
        { tone: 'cold', t: "I'm not them.", r: "Everyone says that. Everyone was them, in the end. Show me, don't tell me." },
        { tone: 'passive', t: "Who said you were a lot of work?", r: "Someone I liked. They liked my edges, at first. Then they asked me to sand them off." },
        { tone: 'flirty', t: "I like the edges. All of them.", r: "Said by everyone, at the start. ...You said it better. Keep saying it at the end." },
      ] },
      { tone: 'flirty', t: "Work? You're the most fun I've had all year.", r: "Nobody has ever said that to me. I'm not sure it's true. I'm sure you meant it, which is worse.", opts: [
        { tone: 'cold', t: "Pretend I didn't say that.", r: "Too late. And yet, there you go, being cold again. You're very confusing." },
        { tone: 'passive', t: "I did mean it.", r: "I know. Your ear stayed untouched. That's your tell, did you know? ...Thank you." },
        { tone: 'flirty', t: "A lot of fun, and a lot of trouble. The good kind.", r: "The good kind of trouble. I'll have that engraved somewhere small and private." },
      ] },
    ] },
  { id: 'ice-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Someone once told me I was a lot of work. They meant it kindly. That's what made it stick.",
    opts: [
      { tone: 'cold', t: "Everyone's a lot of work.", r: "That's a very sensible thing to say and no comfort at all. You're good at those.", opts: [
        { tone: 'cold', t: "I'm not here to comfort you.", r: "No. You're not. I'll stop expecting it, then. It's easier.", m: -2 },
        { tone: 'passive', t: "Sorry. That came out flat. What happened?", r: "They liked my edges. Later they wanted them smoothed. I said no. That was that." },
        { tone: 'flirty', t: "Some of us like work.", r: "Do you. Overtime? ...Don't answer that. You'll make it a line." },
      ] },
      { tone: 'passive', t: "What did they mean by it?", r: "That I notice too much and forgive too slowly. They liked the edges, then asked me to sand them down.", opts: [
        { tone: 'cold', t: "Sounds like it was the right call.", r: "Hm. I'll file that under things I won't tell you again.", m: -2 },
        { tone: 'passive', t: "I wouldn't ask you to change.", r: "Not yet. They all start like that. ...You might be different. I'm not betting on it. Much." },
        { tone: 'flirty', t: "Keep the edges. I like being cut a little.", r: "That's either very romantic or a warning sign. I'll take romantic. Today only." },
      ] },
      { tone: 'flirty', t: "Then I'm signing up for overtime.", r: "Don't. It's not a joke to me. ...It's a little bit of a joke. You made it one. I'm annoyed.", opts: [
        { tone: 'cold', t: "Fine. No jokes.", r: "No jokes. No overtime. A clean sheet. You do enjoy closing doors." },
        { tone: 'passive', t: "Sorry. Tell me properly.", r: "They liked who I was until they had to live with it. That's all. It's old. It's boring." },
        { tone: 'flirty', t: "It's not a joke. I'm worth the hours. So are you.", r: "Worth the hours. ...That's the nicest thing anyone's said to me this year. Don't let it go to waste." },
        { tone: 'risque', t: "Overtime, my place. I'll see how much work you are.", r: "Ha. You'd be exhausted by midnight. ...I'd enjoy watching you try. That's all I'll say." },
      ] },
    ] },
  { id: 'ice-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "You've been very easy to be around lately. It worries me. People usually find me a lot of work, sooner or later.",
    opts: [
      { tone: 'cold', t: "Give it time.", r: "There it is. I knew it was coming. Thank you for being punctual about it.", m: -1, opts: [
        { tone: 'cold', t: "It was a joke.", r: "It was a joke the way a door is a joke. Very funny. It's shut." },
        { tone: 'passive', t: "That was a bad joke. Sorry. Why does it worry you?", r: "Because people like my edges until they bump into them. Then they want me smoothed." },
        { tone: 'flirty', t: "Give it time, and I'll still be here.", r: "...That's the version you should have led with. I'll pretend you did." },
      ] },
      { tone: 'passive', t: "Why would that worry you?", r: "Because the last person who liked my edges asked me to sand them off. It took a year to notice.", opts: [
        { tone: 'cold', t: "Some edges need sanding.", r: "Some. Not mine. Enjoy your smooth people.", m: -2 },
        { tone: 'passive', t: "I'm not going to ask you to change.", r: "I believe you, which is irritating. I prefer people I can see through. You I can see into." },
        { tone: 'flirty', t: "I'm more of a sharp-edges person.", r: "Are you. Careful. People say that, then bleed and complain. ...You seem unbothered." },
      ] },
      { tone: 'flirty', t: "You're easy to be around too. For a glacier.", r: "A glacier. I've been called worse. Glaciers move, you know. Slowly. Inevitably.", opts: [
        { tone: 'cold', t: "Not that slowly, hopefully.", r: "Impatience. I'll freeze back over, then. Take your time getting warm." },
        { tone: 'passive', t: "Slowly is fine by me.", r: "Good. Slowly is the only speed I trust. Everything fast has gone wrong for me." },
        { tone: 'flirty', t: "I'll wait for the thaw.", r: "The thaw's begun, I'm told. Don't announce it. It's shy." },
      ] },
    ] },

  // ---- slot 5: jealousy-lite: a colleague of theirs who's a fan of yours ----------------------------------------------
  { id: 'ice-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "You were cold with me last time. Then a colleague asked me to introduce them to you. I said no. I'm not jealous. I'm keeping records.",
    opts: [
      { tone: 'cold', t: "Keep all the records you want.", r: "I will. They're very thorough. Yours has a new page. It's not a flattering page.", opts: [
        { tone: 'cold', t: "I'll live with that.", r: "I'm sure you will. My colleague is still asking. I'm still saying no." },
        { tone: 'passive', t: "I don't even know them.", r: "They know your lap times. All of them. Out loud. The car must be fascinating." },
        { tone: 'flirty', t: "You're cute when you keep records.", r: "I'm not cute. I'm accurate. ...Your page just got a footnote. A slightly better one." },
      ] },
      { tone: 'passive', t: "It's just a fan.", r: "A fan with your photo on their desk. You're appealing, but not that appealing. I'd know.", opts: [
        { tone: 'cold', t: "Maybe they think I'm great.", r: "Maybe they think a great many things. I'll leave you to their opinion." },
        { tone: 'passive', t: "You're the one I came to talk to.", r: "Then you're in the right place. ...Fine. That counts. Slightly. Not a word to my colleague." },
        { tone: 'flirty', t: "You don't laugh at everything. That's why I like making you.", r: "...That's annoyingly good. I'm not laughing. I'm not. Go away. Stay." },
      ] },
      { tone: 'flirty', t: "So you said no for me.", r: "I said no for accuracy. They'd have held your arm like a handrail. Typical of the breed.", opts: [
        { tone: 'cold', t: "Say yes next time.", r: "I won't. You'd be bored. I'd be worse. Enjoy your imaginary handrail." },
        { tone: 'passive', t: "I'd never have noticed them anyway.", r: "You never notice. It's half your charm and all of my problem." },
        { tone: 'flirty', t: "Next time, come and hold my arm yourself.", r: "I don't do handrails. ...I might do an elbow. Lightly. In public, rarely." },
      ] },
    ] },
  { id: 'ice-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Someone at my work laughs at every clip of you they can find. Nothing you say is that funny. I'd know.",
    opts: [
      { tone: 'cold', t: "Are you jealous?", r: "I don't get jealous. I get accurate. Accurately: they're overdoing it.", opts: [
        { tone: 'cold', t: "Sounds like jealousy.", r: "It sounds like observation. You should try it. Good luck with your fan." },
        { tone: 'passive', t: "Fair. They're overdoing it.", r: "Thank you. Agreement. My favourite. You're forgiven for being so watchable." },
        { tone: 'flirty', t: "It's a little bit flattering.", r: "It's not meant to flatter. It's meant to inform. ...Fine. A little bit. Don't frame it." },
      ] },
      { tone: 'passive', t: "I didn't know I had a fan there.", r: "Of course you hadn't. You never do. That's why you need me.", opts: [
        { tone: 'cold', t: "I don't need anyone.", r: "Noted. Strongly noted. I'll go and need nobody over there, then." },
        { tone: 'passive', t: "Maybe I do need you.", r: "...Maybe is a beginning. I'll be your eyes. You be... less oblivious." },
        { tone: 'flirty', t: "I only notice you.", r: "That's a terrible line, and it worked, and I'm going to have to sit down." },
      ] },
      { tone: 'flirty', t: "I'd rather make you laugh.", r: "I know. It's harder. You like hard things. So do I, apparently.", opts: [
        { tone: 'cold', t: "Easier to get a laugh elsewhere.", r: "It is. Go and get one. Mine's off the table tonight." },
        { tone: 'passive', t: "One laugh. I'll get it eventually.", r: "Eventually is permitted. I'm very patient with people who make the effort." },
        { tone: 'flirty', t: "And worth more.", r: "Considerably more. Their laugh is small change. Mine is the whole bank." },
        { tone: 'risque', t: "Leave with me and I'll work on it all evening.", r: "All evening. That's a dare. ...I'll accept it with a look, and you'll know which look." },
      ] },
    ] },
  { id: 'ice-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Someone at my work flirts with your poster. Badly. Daily. I've decided to show you how it's actually done.",
    opts: [
      { tone: 'cold', t: "I can handle myself.", r: "Clearly. You've handled posters for years. You've never once blinked. Painful to watch.", opts: [
        { tone: 'cold', t: "Then don't watch.", r: "Fine. I'll leave you to your audience. They clap at the wrong moments." },
        { tone: 'passive', t: "Okay. Fans are a lot.", r: "They are. I'll be the opposite. Quieter. Considerably better at it." },
        { tone: 'flirty', t: "Show me how it's done, then.", r: "Watch. Say very little. Mean all of it. Look away first. ...Your turn." },
      ] },
      { tone: 'passive', t: "Go on, then. Show me.", r: "You lean in a little less than you'd like. You say one true thing. Then you leave first.", opts: [
        { tone: 'cold', t: "You're leaving first, then?", r: "I am, apparently. You've made that easy. Goodbye." },
        { tone: 'passive', t: "And what's the true thing?", r: "That I've been watching you all night. Only you. Lesson over." },
        { tone: 'flirty', t: "Don't leave first. Not this time.", r: "...That's not in the lesson. I'll stay. A little longer. Don't tell anyone." },
      ] },
      { tone: 'flirty', t: "Were you jealous?", r: "I don't do jealous. I do quality control. They failed. You were the product.", opts: [
        { tone: 'cold', t: "I'm not a product.", r: "No. You're a sulk, at the moment. Enjoy it." },
        { tone: 'passive', t: "And did the product pass?", r: "The product passed. The packaging needs work. Your collar's folded under." },
        { tone: 'flirty', t: "Quality control can test me personally.", r: "It intends to. Rigorously. Not here. Somewhere with a lock on the door." },
        { tone: 'risque', t: "Then take me away for testing.", r: "Not tonight. But I'll think about it. With that look. You know the one." },
      ] },
    ] },

  // ---- slot 6: the piano at two in the morning. Insomnia. You in their head ----------------------------------------
  { id: 'ice-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "I didn't sleep. Not because of you. Because of a piano and two in the morning. You were only mildly involved.",
    opts: [
      { tone: 'cold', t: "Then don't blame me.", r: "I'm not blaming you. I'm informing you. Those are separate departments.", opts: [
        { tone: 'cold', t: "Inform someone else.", r: "I will. The piano's a better audience. It doesn't answer back. Off you go." },
        { tone: 'passive', t: "You play the piano?", r: "Badly. At two in the morning. The neighbours are the only audience. Now you. Keep it quiet." },
        { tone: 'flirty', t: "Mildly involved. I'll take it.", r: "Mildly. In the bass line. Occasionally in the melody. ...Stop smiling. It's late for me." },
      ] },
      { tone: 'passive', t: "What were you playing?", r: "Something slow. I never finish anything. I just play until it sounds right, then stop.", opts: [
        { tone: 'cold', t: "Sounds pointless.", r: "It is pointless. That's why I like it. Nothing else in my life is allowed to be." },
        { tone: 'passive', t: "I'd like to hear it.", r: "Nobody hears it. I play to the window. ...Perhaps. One day. Don't ask again." },
        { tone: 'flirty', t: "Did it sound like me?", r: "...How did you know that. It did. I stopped. I was very annoyed with both of us." },
      ] },
      { tone: 'flirty', t: "Next time, call me. I'll keep you company.", r: "At that hour? You'd be asleep. You sleep like a cat, I'd assume.", opts: [
        { tone: 'cold', t: "You're right. I'd be asleep.", r: "I knew it. You'll be dreaming of tyres and I'll be playing to an empty room." },
        { tone: 'passive', t: "I'd wake up for you.", r: "That's surprisingly kind. I'll keep the number in my head. I won't use it. Probably." },
        { tone: 'flirty', t: "Try me. I might surprise you.", r: "You might. Annoyingly, you keep doing that. ...If my phone rings at two, it's me." },
        { tone: 'risque', t: "Or play for me. Here's my key.", r: "A key. Bold. ...I'm not taking it. I'm looking at it. Long enough for you to notice." },
      ] },
    ] },
  { id: 'ice-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "I play the piano at two in the morning. Badly. Only the neighbours know. Now you do. Don't tell them I told you.",
    opts: [
      { tone: 'cold', t: "The neighbours must love you.", r: "They're very understanding. They're also very deaf. It's a good building.", opts: [
        { tone: 'cold', t: "Lucky for them.", r: "Very. You'd complain, I suspect. Sleep well, wherever you are." },
        { tone: 'passive', t: "Why two in the morning?", r: "Because I can't sleep, and the city's quiet, and nobody's watching. It's the only hour that's mine." },
        { tone: 'flirty', t: "I'd be a very understanding neighbour.", r: "You'd be an awake one. Knocking. Asking for an encore. I can tell." },
      ] },
      { tone: 'passive', t: "Why can't you sleep?", r: "My head won't stop. It lists things. Lately it's been listing you.", opts: [
        { tone: 'cold', t: "Sorry to be on the list.", r: "You don't sound sorry. You sound tired. Go and sleep. One of us should." },
        { tone: 'passive', t: "What does it say about me?", r: "Nothing I'd say in daylight. Nothing bad. That's the problem." },
        { tone: 'flirty', t: "I'm in your head at two in the morning?", r: "In my head, at two, and in the piano. I played you, a bit. I stopped. Don't." },
      ] },
      { tone: 'flirty', t: "Play for me sometime.", r: "Nobody hears me play. ...You're asking very nicely. I'll think about it until two in the morning.", opts: [
        { tone: 'cold', t: "Don't bother if it's a hassle.", r: "It's not a hassle. It's a door. You don't get to knock and then walk off." },
        { tone: 'passive', t: "No pressure. Whenever.", r: "Whenever is perfect. It's the only kind of promise I can keep." },
        { tone: 'flirty', t: "I'll bring the tea. Black, nothing in it.", r: "...You remembered. Or guessed. Either way, you've just bought a very short recital." },
        { tone: 'risque', t: "Two in the morning, then. Your place.", r: "Two in the morning, my place. ...I'll say no. I'll say it slowly. Watch my face while I do." },
      ] },
    ] },
  { id: 'ice-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I was at the piano at two this morning and it came out sounding like you. I had to stop. I was furious.",
    opts: [
      { tone: 'cold', t: "Sounds like a you problem.", r: "It is. I'll solve it. I'll play something nobody's ever been in. That's most things.", opts: [
        { tone: 'cold', t: "Good luck with that.", r: "Thank you. I don't need luck. I need you out of my bass clef. Goodbye." },
        { tone: 'passive', t: "What did I sound like?", r: "Fast in the wrong places. Patient in the right ones. Annoyingly hummable." },
        { tone: 'flirty', t: "Don't solve it. Keep playing me.", r: "...You'd like that. I'd hate it. I'd do it anyway. Nothing about you makes sense." },
      ] },
      { tone: 'passive', t: "You play the piano at two in the morning?", r: "Badly, by my standards. Well, by anyone else's. The neighbours know. Now you.", opts: [
        { tone: 'cold', t: "I'll tell everyone.", r: "Lower your voice. If this gets out I'll have to move. And blame you." },
        { tone: 'passive', t: "What's it like, at that hour?", r: "Quiet. Blue. The only time nobody wants anything from me. You crept in anyway." },
        { tone: 'flirty', t: "I want a private concert.", r: "Private is the only kind I give. Very short. No applause. You'd applaud." },
      ] },
      { tone: 'flirty', t: "I'll take that as a compliment.", r: "Take it as a complaint, gift-wrapped. I'm losing sleep. To a driver. In a minor key.", opts: [
        { tone: 'cold', t: "Get some sleep, then.", r: "I'll try. Without you in the melody. You've made that harder than it sounds." },
        { tone: 'passive', t: "Sorry for keeping you up.", r: "Don't be. It's the best I've played in years. Never tell anyone I said that." },
        { tone: 'flirty', t: "Next time I'll keep you up in person.", r: "In person. At two. I'd be tired and cross and I'd let you in. That's the problem." },
        { tone: 'risque', t: "I'll come round and turn the pages.", r: "There are no pages. I play from memory. ...You'd have to find something else to do with your hands." },
      ] },
    ] },
  // ---- slot 7: the grandmother (re-established either way) asks about you -----------------------------------------
  { id: 'ice-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "My grandmother asked about you on Sunday. I said we weren't speaking. She said 'then speak'. She's ninety-one. I obey.",
    opts: [
      { tone: 'cold', t: "So this is your grandmother's idea.", r: "Partly. She's very persuasive. She once made a waiter cry with one eyebrow. I inherited it.", opts: [
        { tone: 'cold', t: "Tell her I said hello. That's it.", r: "I'll tell her you were brief. She'll approve. I'll be less impressed." },
        { tone: 'passive', t: "What else did she say?", r: "That I'm too proud and you're probably worth it. She's never said 'probably' about anyone." },
        { tone: 'flirty', t: "I like her already.", r: "Everyone does, at a distance. Up close she'd interrogate you. I'd enjoy watching." },
      ] },
      { tone: 'passive', t: "I'm glad she did. I didn't like not speaking.", r: "Neither did I. I'd never have said so. She said it for me. That's what she's for.", opts: [
        { tone: 'cold', t: "Let's not make a big thing of it.", r: "No. Nothing big. Small and careful. As you like it, apparently." },
        { tone: 'passive', t: "You've never really told me about her.", r: "By the sea. Plays chess like a knife fight. Rules: never explain, never apologise. I'm breaking both." },
        { tone: 'flirty', t: "Thank her for me.", r: "I'll thank her. She'll ask what for. I'll go pink. She'll laugh for a week." },
      ] },
      { tone: 'flirty', t: "Your grandmother's on my side, then.", r: "She's on no one's side. She's on the side of things being done properly. You were being improper.", opts: [
        { tone: 'cold', t: "I'll be proper, then. And distant.", r: "Proper and distant. Exactly what she'd hate. You two would never get on." },
        { tone: 'passive', t: "Okay. Let's do it properly.", r: "Properly means talking. You first. I've had a long week of not talking to you." },
        { tone: 'flirty', t: "I can be very proper. Eventually.", r: "Eventually is a word I've been using about you. She noticed. She notices." },
      ] },
    ] },
  { id: 'ice-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "Did I ever tell you about my grandmother? I can't remember what I've told you. Ninety-one. Terrifying. She asked about you.",
    opts: [
      { tone: 'cold', t: "Why would she ask about me?", r: "Because I mentioned you. Twice. I never mention anyone twice. She's like a hawk.", opts: [
        { tone: 'cold', t: "I'd rather not be discussed.", r: "You weren't discussed. You were noticed. In my family, that's a parade." },
        { tone: 'passive', t: "What did you say about me?", r: "That you stand up straight and don't fill silences. That's high praise, in her language." },
        { tone: 'flirty', t: "Twice. I'm flattered.", r: "You should be. The last person I mentioned twice was a dentist, and that was a complaint." },
      ] },
      { tone: 'passive', t: "What did she want to know?", r: "Whether you're kind. Whether you're on time. Whether I laugh. I said yes, rarely and yes.", opts: [
        { tone: 'cold', t: "Rarely on time. That's fair.", r: "It's accurate. She'll hold it against you. I'll defend you. Badly." },
        { tone: 'passive', t: "You laugh with me?", r: "You know I do. Don't make me confirm it. It ruins it." },
        { tone: 'flirty', t: "Tell her I'll work on the punctuality.", r: "Tell her yourself, one day. ...I can't believe I just said that. Forget it. Don't forget it." },
      ] },
      { tone: 'flirty', t: "So you talk about me on Sundays.", r: "For about forty seconds. Out of four minutes. She timed it. So did I.", opts: [
        { tone: 'cold', t: "Forty seconds isn't much.", r: "It's a tenth of my week's honesty. But fine. I'll take it back." },
        { tone: 'passive', t: "What does she think of me?", r: "She thinks I'm happier. She said it like an accusation. She's not wrong." },
        { tone: 'flirty', t: "I'm going for the full four minutes.", r: "Ambitious. She'd give you three, and keep one for herself." },
        { tone: 'risque', t: "Tell her you're bringing me home one day.", r: "Home. Ha. ...I'll tell her nothing. You'll find out what I tell you, later, with the door shut." },
      ] },
    ] },
  { id: 'ice-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "My grandmother wants to know if you're 'the one with the good posture'. I said yes. Stand up straight, please. She has spies.",
    opts: [
      { tone: 'cold', t: "I'll stand however I like.", r: "Naturally. She'll hear about it. Ninety-one, and she still has better reach than me.", opts: [
        { tone: 'cold', t: "Let her hear.", r: "I'll tell her you're stubborn. She'll like you more. It's very irritating." },
        { tone: 'passive', t: "Okay. Straighter. Better?", r: "Better. She'd nod. That's her version of a standing ovation." },
        { tone: 'flirty', t: "I'll stand up straight for you. Not her.", r: "That's very nearly the right answer. Stand up straight for both of us." },
      ] },
      { tone: 'passive', t: "What else did she ask?", r: "Whether you make me laugh. Whether you're kind to waiters. I said yes, and probably.", opts: [
        { tone: 'cold', t: "I'm kind to most people.", r: "Most. That's the probably. Fine. You're kind to me. Most of the time." },
        { tone: 'passive', t: "I'm always kind to waiters.", r: "I know. I'd have guessed it anyway. I notice everything. It's a condition." },
        { tone: 'flirty', t: "And do I make you laugh?", r: "You know you do. Don't fish. ...You do. Annoyingly. In public." },
      ] },
      { tone: 'flirty', t: "So I'm 'the one'. Good to know.", r: "'The one with the good posture.' Read the whole sentence. ...You're smiling at the first half.", opts: [
        { tone: 'cold', t: "Just the first half.", r: "You can't take half of a sentence and leave. Well. You can. You just did." },
        { tone: 'passive', t: "Fine. The whole sentence.", r: "Thank you. Posture noted. The rest pending. She'll be insufferable now." },
        { tone: 'flirty', t: "I'll take both halves.", r: "Greedy. You'll get both. Not today. I'm not saying the first half twice." },
      ] },
    ] },

  // ---- slot 8: the almost-kiss. They admit you keep turning up in their head -------------------------------------
  { id: 'ice-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "You've kept your distance lately. I've noticed. I've noticed that I mind. That's new, and I don't care for it.",
    opts: [
      { tone: 'cold', t: "I've been busy.", r: "Busy. Everyone's busy. Some people are busy near me. You're busy elsewhere.", opts: [
        { tone: 'cold', t: "That's how it is right now.", r: "Then that's how I'll be, too. At a distance. I'm very good at distance.", m: -2 },
        { tone: 'passive', t: "Sorry. You do matter to me.", r: "Then let me know it. Not with words. With you right next to me. Like now." },
        { tone: 'flirty', t: "I'd rather be busy near you.", r: "Then be. Here. This close. ...Closer than that, actually. I'm being precise." },
      ] },
      { tone: 'passive', t: "You mind? I didn't think you would.", r: "Neither did I. I thought I was made of sterner things. Apparently I'm made of you, partly.", opts: [
        { tone: 'cold', t: "That's a lot of pressure.", r: "It's not pressure. It's information. You can do as you like with it. You just did." },
        { tone: 'passive', t: "I'll stop keeping my distance.", r: "Good. Start now. You're two feet away. That's at least a foot too many." },
        { tone: 'flirty', t: "I miss you too. When you're not around.", r: "You'd better. ...I've been thinking about kissing you. That's all. I wanted to be accurate." },
      ] },
      { tone: 'flirty', t: "Then let me close the distance.", r: "Close it, then. Slowly. If you rush, I'll step back. You know I will.", opts: [
        { tone: 'cold', t: "Never mind. Bad idea.", r: "Of course. Bad idea. I'll file it with the others. It's a very thin file." },
        { tone: 'passive', t: "Slowly. Like this?", r: "Like that. ...Yes. Good. Now stop. Here. Just here. That's enough for one evening." },
        { tone: 'flirty', t: "I've been wanting to for weeks.", r: "I know. I've been letting you want to. It's a cruelty. I'm ending it. Come here." },
        { tone: 'risque', t: "Kiss me, then. Before you think better of it.", r: "I never think better of anything. I think more. ...Fine. Once. And don't say a word after." },
      ] },
    ] },
  { id: 'ice-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "You keep turning up in my head at inconvenient moments. Meetings. The dentist. Kindly schedule yourself better.",
    opts: [
      { tone: 'cold', t: "I don't control your head.", r: "Nobody controls my head. That's the point. You've broken in. I'd like to know how.", opts: [
        { tone: 'cold', t: "Lock the door, then.", r: "I've tried. You keep coming in through the window. Fine. Go." },
        { tone: 'passive', t: "You turn up in mine too.", r: "Do I. When? Be specific. I need to know which meetings to blame you for." },
        { tone: 'flirty', t: "I'll leave a key under the mat.", r: "I'd find it. I find everything. ...I might use it. Don't count on it. Count on it a little." },
      ] },
      { tone: 'passive', t: "Is that a bad thing?", r: "It's inconvenient. And pleasant. I dislike things that are both. I'm learning to tolerate you.", opts: [
        { tone: 'cold', t: "Tolerate. Wow.", r: "Tolerate is a big word for me. You've just shrunk it. Enjoy your smaller word." },
        { tone: 'passive', t: "I'll take tolerated.", r: "Good. It's a long way above where most people are. And still rising, slightly." },
        { tone: 'flirty', t: "What am I doing in there?", r: "Standing too close. Like you are now. ...Like you are now. Hm." },
        { tone: 'risque', t: "Show me what I do in there.", r: "...Here? Fine. One kiss. Quick. Then nobody mentions it until you're braver." },
      ] },
      { tone: 'flirty', t: "I'll schedule myself for every evening.", r: "Every evening. That's not a schedule, it's an occupation. Hostile, but very well dressed.", opts: [
        { tone: 'cold', t: "Fine. Weekends only.", r: "Weekends. Reasonable. Unromantic. You're very good at deflating things." },
        { tone: 'passive', t: "A few evenings, then. Start with one.", r: "One. Tonight. After this. You'll walk me home. I'll decide at the door." },
        { tone: 'flirty', t: "You'd get used to me.", r: "That's my concern. I don't get used to things. I'm getting used to you." },
      ] },
    ] },
  { id: 'ice-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "You're standing very close. I'm not moving. Draw your conclusions. Quickly, before I think better of it.",
    opts: [
      { tone: 'cold', t: "I'll give you some space.", r: "Space. Of course. You had a perfectly good moment and you handed it back. Unopened.", opts: [
        { tone: 'cold', t: "Better safe.", r: "Safe. How lovely. I'll be safe from now on, too. Very, very safe." },
        { tone: 'passive', t: "Sorry. I didn't want to rush you.", r: "That's kind. Too kind. Next time, rush a little. I'll stop you if I mind." },
        { tone: 'flirty', t: "Changed my mind. I'm staying close.", r: "Good. That's better. Not moving. Neither of us. ...Your move." },
      ] },
      { tone: 'passive', t: "I'm not moving either.", r: "Then we're very still. Two statues. Anyone watching would stare. I don't care, for once.", opts: [
        { tone: 'cold', t: "Let them stare.", r: "...You're right. I hate that you're right. Step back, then. We'll be a rumour." },
        { tone: 'passive', t: "You don't mind people looking?", r: "I always mind. Not tonight. Tonight I'm busy looking at you." },
        { tone: 'flirty', t: "Give them something to stare at.", r: "...Yes. One kiss. Short. Elegant. There. Now nobody say anything, especially you." },
        { tone: 'risque', t: "Then let's go somewhere nobody's staring.", r: "Somewhere nobody stares. Yes. I'll walk. You'll follow. I was going to decide at the door. I've decided." },
      ] },
      { tone: 'flirty', t: "I know exactly what to make of it.", r: "Do you. Then stop explaining and act. I'm running out of composure.", opts: [
        { tone: 'cold', t: "Not here.", r: "Not here. Of course. Sensible. I could scream. I won't. Never mind." },
        { tone: 'passive', t: "Okay. Can I kiss you?", r: "You asked. Properly. ...Yes. Once. Well done. That was well done." },
        { tone: 'flirty', t: "Then I'll act.", r: "...There. That was a kiss. Mine. Don't tell anyone. Tell everyone. I haven't decided." },
      ] },
    ] },

  // ---- slot 9: chapter end - 'are we something?' They choose you. The first real softness ---------------------------
  { id: 'ice-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "You've been distant, and I've been pretending not to mind. I'm tired of pretending. Are we something, or not?",
    opts: [
      { tone: 'cold', t: "I don't know.", r: "That's an answer. A small one. I'd hoped for a larger one. I'll wait. I don't wait.", opts: [
        { tone: 'cold', t: "Then don't wait.", r: "I won't. I'll get on with my life. You were in it, briefly. It was nice.", m: -3 },
        { tone: 'passive', t: "Give me a day. I want to answer properly.", r: "A day. Fine. That's fair. I'd rather a slow yes than a quick anything." },
        { tone: 'flirty', t: "I know I want to find out.", r: "Not a yes. A very good maybe. ...I'll take it. Don't make me regret it." },
      ] },
      { tone: 'passive', t: "I think we are. I've just been careful.", r: "Careful. With me. I recognise it. I invented it. ...I'm glad you are. Something, I mean.", opts: [
        { tone: 'cold', t: "Let's not label it yet.", r: "No labels. Of course. I'll keep mine to myself. It's a very good label." },
        { tone: 'passive', t: "Then let's be something. Properly.", r: "Properly. Yes. One condition: you call when you go quiet. I'll do the same. I'll try." },
        { tone: 'flirty', t: "I want to be yours, if you'll have me.", r: "...I'll have you. That was very straightforward. I don't know what to do with my hands." },
      ] },
      { tone: 'flirty', t: "We're something. You know we are.", r: "I suspected. I don't trust suspicions. I trust things said out loud. Say it again.", opts: [
        { tone: 'cold', t: "Once is enough.", r: "Once is enough for you. I'd have liked twice. ...Fine. Once. Filed." },
        { tone: 'passive', t: "We're something. I'm sure.", r: "Sure. You're sure. ...So am I. There. Now I've said it too. Look away while I recover." },
        { tone: 'flirty', t: "We're something. And it's very good.", r: "It's very good. Yes. I've been trying not to like it this much. I've failed. Beautifully." },
        { tone: 'risque', t: "Come home with me and I'll prove it.", r: "Prove it. A dare. ...I accept. I'll look at you the whole way home. You'll know what that means." },
      ] },
    ] },
  { id: 'ice-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "I don't do 'seeing someone'. I've been told I'm doing it. By several people. Are we?",
    opts: [
      { tone: 'cold', t: "Several people should mind their business.", r: "They should. They won't. And you haven't answered. That's an answer, of a kind.", opts: [
        { tone: 'cold', t: "It's not an answer. It's a pass.", r: "A pass. Of course. I'll tell the several people they were wrong.", m: -2 },
        { tone: 'passive', t: "Okay. Yes. We are, I think.", r: "You think. ...I'll accept 'think'. It's better than most people's 'know'." },
        { tone: 'flirty', t: "We are. I just like making you ask.", r: "Cruel. Accurate. I'll make you pay for that. Slowly. For a long time, I hope." },
      ] },
      { tone: 'passive', t: "Maybe we are. Do you want to be?", r: "...Yes. I want to be. There. I said a sentence with 'want' in it. Mark the date.", opts: [
        { tone: 'cold', t: "Good. Let's keep it simple.", r: "Simple. Fine. I'm not simple. You'll see. But I'll be simple for you, a little." },
        { tone: 'passive', t: "I'm glad. Really glad.", r: "So am I. I'd like it noted that I'm glad. Somewhere permanent." },
        { tone: 'flirty', t: "Then you're mine.", r: "Yours. ...That word's going to keep me up tonight. At the piano, probably." },
      ] },
      { tone: 'flirty', t: "We are. I've been telling people for weeks.", r: "Have you. And you didn't tell me. I'm the last to know about my own life. Typical.", opts: [
        { tone: 'cold', t: "Didn't think you'd care.", r: "I care about everything. I just don't show it. You should have known that by now.", m: -1 },
        { tone: 'passive', t: "I should have told you first. Sorry.", r: "You should. Tell me now. Properly. ...Thank you. Yes. We are. I'm yours." },
        { tone: 'flirty', t: "I'm telling you now. You're mine.", r: "...I've been told. By the right person, at last. Yes. I'm yours. Once is all you get." },
        { tone: 'risque', t: "Let's make it official. Your place.", r: "Official. At mine. ...Yes. I'll make tea. We won't drink it. I'll look at you until you understand." },
      ] },
    ] },
  { id: 'ice-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "I've rewritten this in my head three times. Version three: I'd like to be yours. Don't make me say it twice.",
    opts: [
      { tone: 'cold', t: "What were versions one and two?", r: "One was a joke. Two was a contract. Three is the truth. And you asked about the first two.", opts: [
        { tone: 'cold', t: "Just curious.", r: "Curious. Right. I'll put version three away, then. It was a good one.", m: -2 },
        { tone: 'passive', t: "Sorry. Version three. Yes. I'd like that.", r: "You'd like that. ...Good. That's all I needed. That's everything, actually." },
        { tone: 'flirty', t: "Version three wins. I'm yours too.", r: "...Thank you. I didn't know how much I wanted to hear that until it was said." },
      ] },
      { tone: 'passive', t: "I'd like that. A lot.", r: "A lot. That's a vague quantity. I'll accept it. It's the first vague thing I've ever accepted.", opts: [
        { tone: 'cold', t: "Don't make it a big deal.", r: "It is a big deal. I'll make it a small, private one. Here, inside. You can't see it." },
        { tone: 'passive', t: "We'll take it slowly.", r: "Slowly. Yes. I don't know how to do fast. I'm not sure I know how to do this either." },
        { tone: 'flirty', t: "So we're each other's now.", r: "Each other's. Yes. I'm going to be very bad at this, and I'm going to try very hard." },
      ] },
      { tone: 'flirty', t: "Say it twice. Please.", r: "...No. Yes. Fine. I'd like to be yours. That's twice. There won't be a third. Not today.", opts: [
        { tone: 'cold', t: "Twice is plenty.", r: "Is it. Then you've heard all you'll hear. Use it wisely. I'll be quiet now." },
        { tone: 'passive', t: "Then you are. Mine, I mean.", r: "Yours. I'll get used to the word. It's not unpleasant. It's warm. Like your jacket." },
        { tone: 'flirty', t: "And I'm yours. Completely.", r: "Completely. I've never had completely. I'll look after it. I'm good at keeping things." },
        { tone: 'risque', t: "Say it a third time. Later. Somewhere private.", r: "Later. Private. ...I might. You'll have to earn the third. I suspect you will." },
      ] },
    ] },
];
