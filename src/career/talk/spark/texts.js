// The Spark - the phone: rapid-fire, lowercase, capitals when excited, the odd emoji. Plain data, no imports.
export const DATA = [
  // ---- week: new ------------------------------------------------------------------------------------------------
  {
    id: 'spark-text-week-new-cold-1', on: 'week', stage: 'new', mood: 'cold',
    say: "so. you were a bit of a grump when we met. i'm texting anyway because i'm stubborn. hi 🙃",
    opts: [
      { tone: 'cold', t: "hi.", r: "a full stop. on a hi. ok. message received, grumpy. i'll stop" },
      { tone: 'passive', t: "Hi. Sorry for being a grump. Long weekend.", r: "apology accepted!! i'm very forgiving. it's my best and worst quality" },
      { tone: 'flirty', t: "Stubborn suits you.", r: "ooh. the grump has charm?? who knew. not me. ok tell me more" },
    ],
  },
  {
    id: 'spark-text-week-new-cold-2', on: 'week', stage: 'new', mood: 'cold',
    say: "do you always look that serious or was it just me? asking for science 🔬",
    opts: [
      { tone: 'cold', t: "Just you.", r: "ouch!! ok. science has spoken. science is mean", opts: [
        { tone: 'cold', t: "Science is honest.", r: "science is boring. bye, science" },
        { tone: 'passive', t: "Kidding. It's just my game face.", r: "a JOKE. from you!! science retracts its findings. tentatively" },
        { tone: 'flirty', t: "Just you. I was trying to impress you.", r: "impress me by FROWNING? bold strategy. weirdly it worked a little" },
      ] },
      { tone: 'passive', t: "Race weekend face. It's not personal.", r: "a race weekend face! i have a sunday morning face. it's worse. so much worse", opts: [
        { tone: 'cold', t: "Can't imagine that.", r: "fine, you'll never see it then. ever. it's for nice people only" },
        { tone: 'passive', t: "Show me sometime.", r: "ha! not till i trust you. that face is classified" },
        { tone: 'flirty', t: "I'd like to see your Sunday morning face.", r: "ooh. bold. you'd have to earn it. it's a very exclusive face" },
      ] },
      { tone: 'flirty', t: "Only when I'm trying not to smile.", r: "trying NOT to?? why. smiling is free. do it more. at me specifically", opts: [
        { tone: 'cold', t: "No promises.", r: "no promises. got it. i'll just remember the grump then" },
        { tone: 'passive', t: "I'll try next time.", r: "try hard. i'll be watching. i'll pull faces till you crack" },
        { tone: 'flirty', t: "You make it hard not to.", r: "good!! that's my job. i'm extremely good at my job" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-new-cold-3', on: 'week', stage: 'new', mood: 'cold',
    say: "ok i've decided not to be offended about last time. mostly. 60% not offended. what are you up to?",
    opts: [
      { tone: 'cold', t: "Nothing worth telling.", r: "60 just dropped to 40. you're losing points fast, racer" },
      { tone: 'passive', t: "Gym, then the sim. Thrilling.", r: "gym then sim. you live like a robot. a fit robot. i'm going to teach you fun" },
      { tone: 'flirty', t: "Working out how to get you to 100%.", r: "ooh strategy. 100% costs one coffee and one terrible joke. your joke, not mine" },
    ],
  },
  {
    id: 'spark-text-week-new-passive-1', on: 'week', stage: 'new', mood: 'passive',
    say: "random question!! best thing you've ever eaten at a race? i'm making a list. it's for nothing. go",
    opts: [
      { tone: 'cold', t: "I don't really eat at races.", r: "you DON'T EAT?? ok that's worrying. also boring. mostly worrying", opts: [
        { tone: 'cold', t: "I eat. Just not for fun.", r: "food is ALWAYS for fun. ok i give up on you. for now" },
        { tone: 'passive', t: "Plain pasta, mostly.", r: "PLAIN. pasta. i'm sending you a recipe. it has three whole ingredients. be brave" },
        { tone: 'flirty', t: "Maybe I need someone to show me.", r: "maybe you do!! i'm volunteering. no take-backs, i've already picked the restaurant" },
      ] },
      { tone: 'passive', t: "A pastry stall at {last}. Unreal.", r: "a PASTRY STALL. noted. you're officially my food correspondent", opts: [
        { tone: 'cold', t: "I'll pass on the job.", r: "you can't quit, you just started!! shortest career ever" },
        { tone: 'passive', t: "Happy to help. What's yours?", r: "a hot dog on a ferry at 2am. i was soaked and it was perfect. long story" },
        { tone: 'flirty', t: "Only if you're my plus one on research trips.", r: "research trips!! we're expensing so many desserts. i'm in. obviously i'm in" },
      ] },
      { tone: 'flirty', t: "Haven't found anything good yet. Show me somewhere?", r: "is that an invitation?? accepted. i know a place with pancakes the size of a tyre", opts: [
        { tone: 'cold', t: "Actually, I'm busy all week.", r: "oh. pancakes cancelled. sad pancakes. sad me. whatever" },
        { tone: 'passive', t: "Sounds good. When?", r: "thursday morning. early. 'sneak out before your trainer wakes up' early" },
        { tone: 'flirty', t: "I'll be there. You bring the appetite.", r: "deal. warning: i eat fast and steal off other plates. yours especially" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-new-passive-2', on: 'week', stage: 'new', mood: 'passive',
    say: "just walked past a poster of you at the station and said hi to it. out loud. people stared. your fault",
    opts: [
      { tone: 'cold', t: "Please don't do that.", r: "too late, did it twice. me and the poster are friends now. it's nicer than you" },
      { tone: 'passive', t: "Ha. Which poster?", r: "the one where you're holding a helmet and frowning heroically. very brooding. love it" },
      { tone: 'flirty', t: "The real one's more fun to say hi to.", r: "is it? prove it. say hi back. properly. with an exclamation mark" },
    ],
  },
  {
    id: 'spark-text-week-new-passive-3', on: 'week', stage: 'new', mood: 'passive',
    say: "settle a debate: are racing drivers allowed a favourite colour or is that against the rules",
    opts: [
      { tone: 'cold', t: "Not a debate I care about.", r: "ugh, no fun. the debate rages on without you" },
      { tone: 'passive', t: "Allowed. Mine's green.", r: "GREEN! i had you down as a blue. i've lost a bet. i keep losing bets about you" },
      { tone: 'flirty', t: "My favourite's whatever you're wearing.", r: "smooth. i'm in a dressing gown with ducks on. your favourite colour is now ducks" },
    ],
  },
  {
    id: 'spark-text-week-new-flirty-1', on: 'week', stage: 'new', mood: 'flirty',
    say: "still thinking about your face when i beat you at that arcade game. you were SO cross 😂",
    opts: [
      { tone: 'cold', t: "I wasn't cross. You cheated.", r: "cheated?! i won fair and square-ish. sore loser alert 🚨", opts: [
        { tone: 'cold', t: "Whatever.", r: "whatever?? the most chilling word there is. fine. bye, sore loser" },
        { tone: 'passive', t: "Okay. I was a little cross.", r: "a little! admitted! growth! rematch saturday, bring tissues" },
        { tone: 'flirty', t: "Rematch. Winner picks the next date.", r: "DATE?? you said date. screenshotted. you can't take it back. you're on" },
      ] },
      { tone: 'passive', t: "I'll get you next time.", r: "next time!! so there IS a next time. noted. diarised. tattooed. not tattooed", opts: [
        { tone: 'cold', t: "Don't get excited.", r: "excited is my natural state. but fine. i'll be excited quietly. ish" },
        { tone: 'passive', t: "Same place, Saturday?", r: "saturday!! i'll warm up my thumbs. you warm up your excuses" },
        { tone: 'flirty', t: "I'll let you win again if you do that victory dance.", r: "LET me?? i'll do the dance anyway. it's better with an audience. you're the audience" },
      ] },
      { tone: 'flirty', t: "Cross? I was too busy watching you celebrate.", r: "watching ME?? ok now i'm the flustered one. rematch. this week. no excuses", opts: [
        { tone: 'cold', t: "Can't this week. Maybe not at all.", r: "that went cold quick. i'll practise alone then. and win alone. sad" },
        { tone: 'passive', t: "Thursday works.", r: "thursday!! i've cleared my diary. there wasn't much in it but still" },
        { tone: 'flirty', t: "Only if you promise to be just as smug.", r: "oh i'll be insufferable. you'll pretend to hate it. you'll love it" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-new-flirty-2', on: 'week', stage: 'new', mood: 'flirty',
    say: "hi trouble. i've been told i laugh too loud at your jokes. i've been told to stop. i won't 😈",
    opts: [
      { tone: 'cold', t: "They weren't that funny.", r: "oh. ok. i'll laugh at someone else's then. someone who wants me to" },
      { tone: 'passive', t: "Laugh as loud as you like.", r: "you'll regret that!! my laugh has set off car alarms. twice" },
      { tone: 'flirty', t: "Good. I'll keep making them just to hear it.", r: "stop. i'm grinning at my phone like a weirdo. people are looking" },
    ],
  },
  {
    id: 'spark-text-week-new-flirty-3', on: 'week', stage: 'new', mood: 'flirty',
    say: "found a place with bowling AND mini golf AND claw machines. it's destiny. you in??",
    opts: [
      { tone: 'cold', t: "Not really my thing.", r: "not your THING? it's everyone's thing. fine. i'll go with someone who respects the claw" },
      { tone: 'passive', t: "Sounds fun. After the race?", r: "yes!! whoever loses the bowling has to win the other a prize from the claw. good luck" },
      { tone: 'flirty', t: "I'll win you something from the claw. Count on it.", r: "nobody's EVER won anything from a claw machine. but if you do, i'm yours. kidding. half kidding" },
    ],
  },

  // ---- week: warm -----------------------------------------------------------------------------------------------
  {
    id: 'spark-text-week-warm-cold-1', on: 'week', stage: 'warm', mood: 'cold',
    say: "you went really quiet after saturday. i'm not chasing you. i'm just... texting. very casually 🙄",
    opts: [
      { tone: 'cold', t: "I needed space.", r: "space. ok. take as much as you like. i'm sure it's lovely out there", opts: [
        { tone: 'cold', t: "It is.", r: "great. enjoy. i'll be down here. having fun. without you" },
        { tone: 'passive', t: "I'm sorry. I'll call you this week.", r: "you'd better. a real call. not a voice note. i want to hear your sorry voice" },
        { tone: 'flirty', t: "Space is overrated. I miss your noise.", r: "my NOISE?? rude. sweet. rude-sweet. fine. i'll make some noise. call me" },
      ] },
      { tone: 'passive', t: "Sorry. My head was all over the place.", r: "i get it. i do. just tell me next time instead of vanishing. i'm a good listener. honest", opts: [
        { tone: 'cold', t: "There's nothing to talk about.", r: "ok. if you say so. door's open. i won't knock again though" },
        { tone: 'passive', t: "Coffee tomorrow? I'll explain.", r: "coffee tomorrow. i'll be early. i'm NEVER early. that's how much i care. don't tell anyone" },
        { tone: 'flirty', t: "I'll listen too. To you. All night if you want.", r: "all night? big promise. lucky for you i'm a sucker for big promises. call me later" },
      ] },
      { tone: 'flirty', t: "Chase me a bit. I like it.", r: "you like being chased?? that's MY thing. stealing my thing. ok. forgiven. barely", opts: [
        { tone: 'cold', t: "Never mind.", r: "you can't never-mind after being cute! that's the rule. ugh. fine" },
        { tone: 'passive', t: "Coffee this week, then?", r: "coffee this week. i'm stealing your biscuit as compensation. both biscuits" },
        { tone: 'flirty', t: "Barely is enough. I'll earn the rest.", r: "earn it how?? no. don't tell me. show me. thursday" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-warm-cold-2', on: 'week', stage: 'warm', mood: 'cold',
    say: "remember when you said my plan for the weekend was 'too much'? still thinking about it. a bit hurt tbh",
    opts: [
      { tone: 'cold', t: "It was too much.", r: "fine. i'll do too much with someone who likes too much. there's loads of them" },
      { tone: 'passive', t: "I was knackered. It was a good plan.", r: "it was a GREAT plan. apology semi-accepted. the plan is still on the table" },
      { tone: 'flirty', t: "You're too much. That's why I like you.", r: "...annoyingly good answer. i'm still a bit cross but the cross is shrinking" },
    ],
  },
  {
    id: 'spark-text-week-warm-cold-3', on: 'week', stage: 'warm', mood: 'cold',
    say: "saw your interview. 'no time for distractions'. am i a distraction? asking with my eyebrows",
    opts: [
      { tone: 'cold', t: "Sometimes.", r: "sometimes! ok. i'll stop distracting you then. enjoy all that free time" },
      { tone: 'passive', t: "That was about the car. Not you.", r: "the car. right. fine. but for the record, i'm a very high-quality distraction" },
      { tone: 'flirty', t: "The best kind. I make time for you.", r: "you MAKE time?? in a little time factory? ugh, i'm smiling. i was meant to be sulking" },
    ],
  },
  {
    id: 'spark-text-week-warm-passive-1', on: 'week', stage: 'warm', mood: 'passive',
    say: [
      "i'm bored. entertain me. you get three messages to make me laugh. go 🏁",
      "BORED. so bored. three texts to rescue me. make them funny. clock's running",
    ],
    opts: [
      { tone: 'cold', t: "I'm not a clown.", r: "no, clowns are fun. message one wasted. two left. no pressure", opts: [
        { tone: 'cold', t: "Then I'm done.", r: "two messages unused. tragic. i'll entertain myself. i'm very good at it" },
        { tone: 'passive', t: "Fine. I once waved at a crowd that was waving at someone behind me.", r: "the person BEHIND you. i'm crying. best thing you've ever told me" },
        { tone: 'flirty', t: "Last one: picture my face when I read your texts.", r: "...ok i'm picturing it. it's a good face. you win. that's a laugh AND a blush" },
      ] },
      { tone: 'passive', t: "My engineer named the coffee machine Pit Stop.", r: "PIT STOP. i'm wheezing. two more. the bar is now very high", opts: [
        { tone: 'cold', t: "That's all I've got.", r: "one and done? a one-hit wonder. it qualifies. barely" },
        { tone: 'passive', t: "And the kettle's called Safety Car.", r: "SAFETY CAR. comes out when things get heated. ok you win. you win everything" },
        { tone: 'flirty', t: "The real joke is how often I check my phone for you.", r: "awww. that's not a joke, that's a confession. keeping it. framing it" },
      ] },
      { tone: 'flirty', t: "I'll do better. I'll come over and make you laugh in person.", r: "in person counts as all three. come over. bring snacks. snacks aren't optional", opts: [
        { tone: 'cold', t: "I meant one day. Not now.", r: "one DAY? so vague. i'm bored NOW. back to staring at the ceiling then" },
        { tone: 'passive', t: "Give me an hour.", r: "an hour!! enough time to make my place look less like a tornado hit it. no promises" },
        { tone: 'flirty', t: "On my way. Have your laugh ready.", r: "my laugh is ALWAYS ready. hurry up, racer. the kettle's on" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-warm-passive-2', on: 'week', stage: 'warm', mood: 'passive',
    say: "what are you doing saturday night? don't answer. you're doing something with me. details to follow",
    opts: [
      { tone: 'cold', t: "I'm busy.", r: "busy?? with what. stretching? the team? fine. i'll go alone. it involves a boat. you'll be sorry" },
      { tone: 'passive', t: "Am I allowed to know what?", r: "nope. surprise. wear trainers and bring a jumper. that's all you get" },
      { tone: 'flirty', t: "I'm all yours. Whatever it is.", r: "all mine. i like that. i'm writing it on the plan. in capitals" },
    ],
  },
  {
    id: 'spark-text-week-warm-passive-3', on: 'week', stage: 'warm', mood: 'passive',
    say: "be honest. would you rather race one horse-sized duck or a hundred duck-sized horses. this matters to me",
    opts: [
      { tone: 'cold', t: "Neither. Odd question.", r: "odd?? it's the MOST important question. i'm judging you heavily right now" },
      { tone: 'passive', t: "The hundred tiny horses. Easy.", r: "WRONG. the duck. always the duck. ok we can still be friends. just about" },
      { tone: 'flirty', t: "Whichever one has you cheering at the finish.", r: "i'd cheer for you against ANY duck. ok fine. i'd cheer a bit for the duck too" },
    ],
  },
  {
    id: 'spark-text-week-warm-flirty-1', on: 'week', stage: 'warm', mood: 'flirty',
    say: "it's 1am and i'm thinking about you. that's it. that's the text. go back to sleep. or don't 😏",
    opts: [
      { tone: 'cold', t: "It's 1am. Go to sleep.", r: "ok, sergeant. i was being cute and you've gone full curfew on me", opts: [
        { tone: 'cold', t: "Goodnight.", r: "goodnight then. i'll be up here. awake. un-cute" },
        { tone: 'passive', t: "Sorry. I'm up early for the sim.", r: "ok ok. the sim wins. send me a good morning and we're square" },
        { tone: 'flirty', t: "Fine. Think about me a bit more, then sleep.", r: "deal. but i'm thinking about you very slowly. this could take hours" },
      ] },
      { tone: 'passive', t: "Well, now I'm awake too.", r: "you're welcome!! now we're both awake. tell me a secret. a small one. a medium one", opts: [
        { tone: 'cold', t: "No secrets. Night.", r: "no secrets? you're a vault. a sleepy vault. night then" },
        { tone: 'passive', t: "I still sleep with the light on before races.", r: "that's the cutest thing i've ever heard. your secret's safe. mostly. totally" },
        { tone: 'flirty', t: "The secret is I've been waiting for you to text.", r: "WAITING?? you could've texted first!! we're both cowards. cute cowards" },
        { tone: 'risque', t: "My secret is what I'd do if you were here right now.", r: "oh. OH. ok. now i definitely can't sleep. thanks a lot. tell me tomorrow. in person" },
      ] },
      { tone: 'flirty', t: "I wasn't asleep. Thinking about you too.", r: "STOP. at the same time?? that's fate. or insomnia. probably fate", opts: [
        { tone: 'cold', t: "Probably insomnia.", r: "wow. you just ruined fate. with logic. goodnight, heartless" },
        { tone: 'passive', t: "Either way, we should both sleep.", r: "sensible. boo. fine. sleep. dream about something fun. like me" },
        { tone: 'flirty', t: "Fate, definitely. Same time tomorrow?", r: "yes. a 1am date. the best kind of date" },
        { tone: 'risque', t: "Fate says you should be here, not there.", r: "fate is very bossy. i like fate. i'm putting my coat on. kidding. am i?" },
      ] },
      { tone: 'risque', t: "Come over and think about me in person.", r: "don't tempt me. i've got a shoe on already. not a joke. one shoe. the other one's staring at me", opts: [
        { tone: 'cold', t: "Kidding. It's late.", r: "kidding?? i've got a SHOE on. ok. shoe off. sulking. goodnight" },
        { tone: 'passive', t: "Tomorrow. Properly. When we're awake.", r: "tomorrow. properly. i'll be awake. very awake. i'm writing a plan" },
        { tone: 'flirty', t: "Second shoe. Go on.", r: "second shoe's on. coat's on. i'm standing in the hall like a fool. tell me to come" },
        { tone: 'risque', t: "Forget the shoes. Just bring yourself.", r: "just myself? ok i'm out the door. don't fall asleep. seriously. i'm running" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-warm-flirty-2', on: 'week', stage: 'warm', mood: 'flirty',
    say: "dare you to send me a photo of your worst face. i'll send mine. loser buys dinner",
    opts: [
      { tone: 'cold', t: "No photos.", r: "no photos?! boo. i'm sending mine anyway. look at it. LOOK AT MY FACE" },
      { tone: 'passive', t: "Okay. Here's me after the sim.", r: "HAHAHA you look like a confused owl. love it. mine's worse though. dinner's on me" },
      { tone: 'flirty', t: "My worst face still beats most people's best.", r: "the CONFIDENCE. ok it's true, annoyingly. dinner's on you for being smug" },
      { tone: 'risque', t: "Dinner first. Then I'll show you my best face up close.", r: "up close?? i'll be thinking about that all afternoon. dinner. friday. dress nice" },
    ],
  },
  {
    id: 'spark-text-week-warm-flirty-3', on: 'week', stage: 'warm', mood: 'flirty',
    say: "confession: i've watched your onboard lap 4 times. not for the racing. for your voice on the radio 👀",
    opts: [
      { tone: 'cold', t: "That's a bit weird.", r: "weird?! that was flattery! fine. i'll unwatch it. you can't unwatch things. ugh" },
      { tone: 'passive', t: "My engineer will be thrilled.", r: "your engineer's voice is fine. YOUR voice is the reason. just so we're clear" },
      { tone: 'flirty', t: "I'll say something just for you next race.", r: "on the radio?? if you say my name on the radio i'll scream. actually scream" },
      { tone: 'risque', t: "Wait till you hear it in your ear. Up close.", r: "in my ear. up close. ok i've had to put my phone down. picked it up again. come over" },
    ],
  },

  // ---- week: close ----------------------------------------------------------------------------------------------
  {
    id: 'spark-text-week-close-cold-1', on: 'week', stage: 'close', mood: 'cold',
    say: "hey. you were kind of short with me last night. i know it was race nerves. still stung though",
    opts: [
      { tone: 'cold', t: "You're reading too much into it.", r: "maybe. or you're reading too little. ok. i'm going to eat my feelings", opts: [
        { tone: 'cold', t: "Enjoy the feelings.", r: "i will. they're chocolate-flavoured. you don't get any" },
        { tone: 'passive', t: "Okay. I'll try to be better.", r: "trying is good. trying with a hug is better. tonight?" },
        { tone: 'flirty', t: "Eat them with me. Tonight.", r: "with you? ...ok. but you've lost cookie rights. you get the crumbs" },
      ] },
      { tone: 'passive', t: "You're right. I'm sorry. I took it out on you.", r: "thank you for saying that. really. we're ok. you're still watching my film tonight though", opts: [
        { tone: 'cold', t: "Not tonight. I'm wiped.", r: "oh. ok. rest then. the film will wait. i suppose i will too" },
        { tone: 'passive', t: "Deal. Which film?", r: "the one with the dancing penguins. no arguments. you'll cry. i'll pretend not to notice" },
        { tone: 'flirty', t: "Deal. I'll bring all your favourite snacks.", r: "ALL of them? i'm so easy to win back. it's embarrassing. come early" },
      ] },
      { tone: 'flirty', t: "I owe you one. Tonight, you choose.", r: "my choice?? dangerous. you, me, the sofa, and you do all the voices in the cartoon", opts: [
        { tone: 'cold', t: "Actually, maybe tomorrow.", r: "tomorrow. right. you're very good at dangling things and taking them away. you know that?" },
        { tone: 'passive', t: "Fine. I'll practise the voices.", r: "practise the squeaky one. it's my favourite. i'll be scoring you out of ten" },
        { tone: 'flirty', t: "Every voice. Even the villain.", r: "the VILLAIN! oh you're forgiven. completely. come over now. villain voice on" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-close-cold-2', on: 'week', stage: 'close', mood: 'cold',
    say: "you didn't text back yesterday. i'm not mad. i'm just going to send you 14 photos of my lunch until you do",
    opts: [
      { tone: 'cold', t: "Please don't.", r: "photo 1 of 14: a sad sandwich. it's sad because you're grumpy" },
      { tone: 'passive', t: "Sorry. Media day was flat out.", r: "media day. ok. forgiven. photo 1 is still coming though. it's a lovely salad" },
      { tone: 'flirty', t: "Send all 14. I'll reply to every one.", r: "every one?? that's 14 replies to write. start now. i'll be checking" },
    ],
  },
  {
    id: 'spark-text-week-close-cold-3', on: 'week', stage: 'close', mood: 'cold',
    say: "so who's the person in your story with their arm round you? just wondering. super casually. totally fine. 🙂",
    opts: [
      { tone: 'cold', t: "None of your business.", r: "noted. i'll go back to minding my own business then. it's very boring in here" },
      { tone: 'passive', t: "My cousin. You've met them.", r: "your COUSIN. of course. i knew that. i was testing you. you passed. phew" },
      { tone: 'flirty', t: "You're the only one I want an arm round. Always.", r: "always. good answer. i just like hearing it. say it again tonight. with the arm" },
    ],
  },
  {
    id: 'spark-text-week-close-passive-1', on: 'week', stage: 'close', mood: 'passive',
    say: "morning!! made you a playlist for the flight. 3 hours long, 40% of it is me singing. you're welcome",
    opts: [
      { tone: 'cold', t: "I'll probably just sleep.", r: "SLEEP? through my playlist? the 40% is very hurt. i'm the 40%", opts: [
        { tone: 'cold', t: "Seriously. I need sleep.", r: "fine. sleep. the 40% will just sit here. unlistened to" },
        { tone: 'passive', t: "Fine. The first hour.", r: "the first hour is the best hour. there's a duet with a seagull. trust me" },
        { tone: 'flirty', t: "Sing me to sleep, then.", r: "awww. ok. a lullaby. a loud one. it's the only kind i know" },
      ] },
      { tone: 'passive', t: "Thanks. I'll listen on the plane.", r: "track 7 is a voice memo of me snoring. bonus track. enjoy", opts: [
        { tone: 'cold', t: "Why would I want that?", r: "because it's ME. snoring. it's intimate. wow. ok. deleting track 7" },
        { tone: 'passive', t: "Very generous of you.", r: "i know. i'm a giver. text me when you land or i'll make another playlist out of worry" },
        { tone: 'flirty', t: "I'll fall asleep to it and pretend you're next to me.", r: "stop. i'm crying into my cereal. pretend hard. i'll be next to you for real soon" },
      ] },
      { tone: 'flirty', t: "The 40% is my favourite part already.", r: "you haven't even HEARD it!! but that's the right answer. very much the right answer", opts: [
        { tone: 'cold', t: "Unless you're off-key.", r: "i'm ALWAYS off-key. that's the charm. charm denied, apparently" },
        { tone: 'passive', t: "I'll tell you which song's best.", r: "it's the one about you. obviously. i made it up in the shower. it rhymes 'pole' with 'soul'" },
        { tone: 'flirty', t: "Nothing beats hearing you in person, though.", r: "then hurry home. i'll sing at you in the kitchen. live. no refunds" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-close-passive-2', on: 'week', stage: 'close', mood: 'passive',
    say: "important: we're out of milk, i've named the plant, and i miss you. in that order. jk the last one's first",
    opts: [
      { tone: 'cold', t: "Just get the milk.", r: "wow. milk first then. i'll put the 'i miss you' back in the fridge" },
      { tone: 'passive', t: "What did you name the plant?", r: "LAP RECORD. it's grown two centimetres this week. it's beating you. at growing" },
      { tone: 'flirty', t: "Miss you more. Tell the plant I said hi.", r: "the plant says hi back. the plant also misses you. the plant is me" },
    ],
  },
  {
    id: 'spark-text-week-close-passive-3', on: 'week', stage: 'close', mood: 'passive',
    say: "the neighbour asked if we're married. i said 'not YET'. you're welcome. or sorry. one of the two",
    opts: [
      { tone: 'cold', t: "You shouldn't say things like that.", r: "oh. too much? i thought it was funny. i'll tell them we're flatmates. sulky ones" },
      { tone: 'passive', t: "Ha. What did they say?", r: "'good luck'. i don't know which of us it was for. probably you" },
      { tone: 'flirty', t: "Not yet sounds about right.", r: "...wait REALLY?? don't say things like that when i can't see your face. i'm SCREAMING" },
    ],
  },
  {
    id: 'spark-text-week-close-flirty-1', on: 'week', stage: 'close', mood: 'flirty',
    say: "in bed with your pillow. poor replacement. 3/10. come back already 😤",
    opts: [
      { tone: 'cold', t: "It's only two more days.", r: "ONLY. two days is forty-eight hours. i've counted. the pillow agrees with me" },
      { tone: 'passive', t: "Two more days. Then I'm home.", r: "two days. ok. i'm going to be insufferable when you're back. fair warning" },
      { tone: 'flirty', t: "What would a 10/10 look like?", r: "you, obviously. but you're in a hotel. so the pillow gets a pity point. 4/10" },
      { tone: 'risque', t: "Keep my side warm. I've got plans for you.", r: "plans?? what plans? don't text me plans at midnight. i'll never sleep. tell me the plans" },
    ],
  },
  {
    id: 'spark-text-week-close-flirty-2', on: 'week', stage: 'close', mood: 'flirty',
    say: "3 sleeps. i've planned everything. well. i've planned breakfast. and what happens before breakfast 😏",
    opts: [
      { tone: 'cold', t: "Don't overplan. I'll be tired.", r: "tired?? fine. i'll unplan. i'll unplan the whole thing. hope you like toast", opts: [
        { tone: 'cold', t: "Toast is fine.", r: "sure. toast. lovely. everything's fine. so, so fine" },
        { tone: 'passive', t: "Sorry. Plan's back on. I'll manage.", r: "back on!! but you have to be awake for it. sleep on the plane" },
        { tone: 'flirty', t: "Keep the plan. I'll find the energy for you.", r: "you'd better. it's planned to the minute. there's a timetable. it's laminated" },
      ] },
      { tone: 'passive', t: "What's for breakfast?", r: "pancakes with a face on. your face. in blueberries. very lifelike", opts: [
        { tone: 'cold', t: "Skip the face.", r: "no face?? the face is the art. fine. abstract pancakes. sad ones" },
        { tone: 'passive', t: "Sounds delicious. Save me the eyes.", r: "the eyes are the best bit. you'll have to fight me for them. lovingly" },
        { tone: 'flirty', t: "Better than the real thing?", r: "nothing beats the original. and the original had better hurry up" },
        { tone: 'risque', t: "Forget breakfast. I'll have you instead.", r: "that's it. you're not allowed to text me things like that while i'm in the supermarket" },
      ] },
      { tone: 'flirty', t: "Tell me about the before-breakfast bit.", r: "nope. surprise. but it involves a lie-in. a very long one. with me. no more clues", opts: [
        { tone: 'cold', t: "I'll probably sleep through it.", r: "sleep through ME? lie-in cancelled. alarm set for 6am. for revenge" },
        { tone: 'passive', t: "Can't wait. Three sleeps.", r: "three sleeps. i'm crossing them off. i have a little chart. it has stickers" },
        { tone: 'flirty', t: "A long lie-in with you. Perfect.", r: "perfect is the word. i'm counting hours now. sleeps weren't enough" },
        { tone: 'risque', t: "Sounds like you'll have to keep me there.", r: "oh i'll keep you there. i'm very good at keeping things. ask your hoodie" },
      ] },
    ],
  },
  {
    id: 'spark-text-week-close-flirty-3', on: 'week', stage: 'close', mood: 'flirty',
    say: "wore your team colours to my meeting. everyone noticed. i said 'what? no reason'. HUGE reason. you're the reason",
    opts: [
      { tone: 'cold', t: "You don't need to advertise it.", r: "advertise?? i was being cute. fine. back to black. boring black" },
      { tone: 'passive', t: "Ha. How did the meeting go?", r: "terrible. i doodled your car number on everything. the contract has a little car on it now" },
      { tone: 'flirty', t: "I'd have loved to see that.", r: "you will. i'm wearing it to the airport to pick you up. with a sign. and a horn" },
      { tone: 'risque', t: "Wear it tonight. Just for me.", r: "just for you? ok. but you take me out first. then home. that's the deal" },
    ],
  },

  // ---- met: their first text after you met --------------------------------------------------------------------
  {
    id: 'spark-text-met-new-cold-1', on: 'met', stage: 'new', mood: 'cold',
    say: "hi it's {first}. from the thing. you were very grumpy at me. texting anyway. i'm unstoppable",
    opts: [
      { tone: 'cold', t: "How did you get this number?", r: "i have my ways!! ok it was your press officer. they like me. unlike some people" },
      { tone: 'passive', t: "Hi. Sorry if I was short.", r: "short? you were a whole iceberg. but forgiven. i love a project" },
      { tone: 'flirty', t: "I was grumpy because I couldn't think of anything clever.", r: "so i made you NERVOUS?? best news i've had all week" },
    ],
  },
  {
    id: 'spark-text-met-new-passive-1', on: 'met', stage: 'new', mood: 'passive',
    say: "heyyy it's {first}!! the one who talked your ear off. sorry. not sorry. good luck at {track}!!",
    opts: [
      { tone: 'cold', t: "Thanks.", r: "a one-word thanks. bold. i'll take it. i'll frame it", opts: [
        { tone: 'cold', t: "Busy week. Talk later.", r: "later. ok. i'll wait. not forever though. i'm very bad at waiting" },
        { tone: 'passive', t: "Sorry. Thanks, really. It was fun.", r: "fun!! a whole sentence! you're getting chatty" },
        { tone: 'flirty', t: "Thanks. I'll think of you on the grid.", r: "on the GRID? that's prime thinking time. i'm honoured. now go win something" },
      ] },
      { tone: 'passive', t: "Thanks! Nice meeting you.", r: "likewise!! let's do it again. i'll talk less. that's a lie", opts: [
        { tone: 'cold', t: "Let's not rush it.", r: "rush? me? i always rush. fine. slow. watch me be slow" },
        { tone: 'passive', t: "Sure. Once the weekend's done?", r: "deal. i'll bring cake. it's for you win or lose. a just-because cake" },
        { tone: 'flirty', t: "Talk more. I liked it.", r: "you LIKED it? nobody likes it, they put up with it. ok you're my new favourite" },
      ] },
      { tone: 'flirty', t: "You can talk my ear off any time.", r: "careful!! i take things literally. i'll be in your ear for weeks", opts: [
        { tone: 'cold', t: "Maybe not for weeks.", r: "ha. ok. weeks rationed. i'll save my best stuff for someone keener" },
        { tone: 'passive', t: "Start with a coffee?", r: "coffee!! the gateway to everything. after your race. it's in my calendar. in pen" },
        { tone: 'flirty', t: "Weeks? I was hoping for longer.", r: "longer!! ok i'm grinning at a lamp post. you did that. good luck, trouble" },
      ] },
    ],
  },
  {
    id: 'spark-text-met-new-flirty-1', on: 'met', stage: 'new', mood: 'flirty',
    say: "so. that was fun. still laughing about the umbrella thing. are we doing that again or what 😏",
    opts: [
      { tone: 'cold', t: "That was a one-off.", r: "a one-off?? ok. filing you under 'fun once'. it's a small file" },
      { tone: 'passive', t: "Sure. When are you free?", r: "free?? i'm never free. but i'll be free for you. thursday. maybe friday. both" },
      { tone: 'flirty', t: "Already planning it. You bring the umbrella.", r: "i'll bring two. and a raincoat. and a dare. you'll see" },
    ],
  },

  // ---- date: the morning after ----------------------------------------------------------------------------------
  {
    id: 'spark-text-date-warm-cold-1', on: 'date', stage: 'warm', mood: 'cold',
    say: "had fun last night. well. until you went all quiet at the end. did i do something? be honest",
    opts: [
      { tone: 'cold', t: "No. I was just done.", r: "done. ok. like a cake? or a race? never mind. don't answer", opts: [
        { tone: 'cold', t: "Don't overthink it.", r: "noted. i'll overthink it alone then. as usual" },
        { tone: 'passive', t: "Sorry. I had fun. I'm bad at goodbyes.", r: "bad at goodbyes! me too. i'm bad at hellos as well. we can be bad together" },
        { tone: 'flirty', t: "Done with the night. Not with you.", r: "...ok that's a save. a diving save. you're forgiven, show-off" },
      ] },
      { tone: 'passive', t: "No, just tired. I loved it.", r: "phew. i was spiralling a bit. i'd made a list of everything i said. it was long", opts: [
        { tone: 'cold', t: "It wasn't that deep.", r: "ok. it wasn't. list in the bin. bin in the river. moving on" },
        { tone: 'passive', t: "Next time I'll talk more.", r: "and i'll talk less. we'll meet in the middle. that's where the good stuff is" },
        { tone: 'flirty', t: "Next time I'll walk you all the way to your door.", r: "all the way to the door?? that's a whole thing. i'll be thinking about the door all week" },
      ] },
      { tone: 'flirty', t: "You did. You made me forget how to talk.", r: "oh!! well. ok. that's a much better reason than the one in my head", opts: [
        { tone: 'cold', t: "Joking. I was tired.", r: "ugh. you had me. that was mean. effective, but mean" },
        { tone: 'passive', t: "Seriously, I had a great time.", r: "me too. the bit with the jukebox? iconic. we should never be allowed out" },
        { tone: 'flirty', t: "You still do, by the way.", r: "stop. i'm in the bakery queue grinning. the baker thinks it's about the bread" },
      ] },
    ],
  },
  {
    id: 'spark-text-date-warm-passive-1', on: 'date', stage: 'warm', mood: 'passive',
    say: "last night = 10/10. ok 9/10. you wouldn't do the dare with the fountain. so 9. but a big 9",
    opts: [
      { tone: 'cold', t: "The fountain was a bad idea.", r: "it was a GREAT idea. the 9 is now an 8. you're losing points by the minute" },
      { tone: 'passive', t: "I'll do the fountain next time.", r: "NEXT TIME. you said it. screenshotted. legally binding" },
      { tone: 'flirty', t: "What do I need to do for a 10?", r: "oh there's a list. it's long. some of it's on a napkin. start by calling me" },
    ],
  },
  {
    id: 'spark-text-date-warm-flirty-1', on: 'date', stage: 'warm', mood: 'flirty',
    say: "still smiling. my cheeks hurt. it's your fault. what did you DO to me last night",
    opts: [
      { tone: 'cold', t: "Nothing much.", r: "nothing much?? that was the best night of my month. you're a terrible audience" },
      { tone: 'passive', t: "I had a great time too.", r: "a GREAT time. ok, i'll let you off. same time next week? same place? same you?" },
      { tone: 'flirty', t: "That was me just getting started.", r: "just getting STARTED? i'm in so much trouble. good trouble. the best trouble" },
      { tone: 'risque', t: "Wait till you see what I do next time.", r: "next time?? say when. i'm free tonight. totally free. suspiciously free" },
    ],
  },
  {
    id: 'spark-text-date-close-cold-1', on: 'date', stage: 'close', mood: 'cold',
    say: "morning. last night was lovely until you checked your phone at dessert. twice. i counted. sulking slightly",
    opts: [
      { tone: 'cold', t: "It was the team. It mattered.", r: "more than the tiramisu? more than me? ok. sulking at full volume then" },
      { tone: 'passive', t: "You're right. Sorry. Phone off next time.", r: "off off? not silent? deal. i'll hide it in my bag myself" },
      { tone: 'flirty', t: "Breakfast in bed, as an apology?", r: "...that's very good. damn it. ok. but the strawberry jam. not the other one" },
    ],
  },
  {
    id: 'spark-text-date-close-passive-1', on: 'date', stage: 'close', mood: 'passive',
    say: "last night was perfect. i want it on repeat. same restaurant, same table, same terrible jokes from the waiter",
    opts: [
      { tone: 'cold', t: "It was fine.", r: "fine?? FINE? it was at least an 'amazing'. ok, 'fine' person", opts: [
        { tone: 'cold', t: "Fine is good.", r: "fine is beige. i'll take my sparkle somewhere it's appreciated. enjoy your beige" },
        { tone: 'passive', t: "Okay, more than fine. I'm just tired.", r: "tired is allowed. amazing-but-tired. i'll take that" },
        { tone: 'flirty', t: "Fine, because I couldn't find a word big enough.", r: "oh you smooth— ok. that's a good one. i'm keeping it" },
      ] },
      { tone: 'passive', t: "Same table next week?", r: "same table. i'll book it. i'll book it for the rest of the season", opts: [
        { tone: 'cold', t: "Let's not go overboard.", r: "overboard's my favourite place. fine. one week at a time. sensible me. yuck" },
        { tone: 'passive', t: "Book it. I'll handle the jokes.", r: "your jokes are worse than the waiter's. i love that for us" },
        { tone: 'flirty', t: "Book it forever. I'm not going anywhere.", r: "not going anywhere. that's a sticky note on my mirror now. forever" },
      ] },
      { tone: 'flirty', t: "On repeat. Forever.", r: "forever's a long time. i'm in. already decided. no backing out", opts: [
        { tone: 'cold', t: "Forever's a strong word.", r: "ok. too big a word for you. noted. putting it back in the drawer" },
        { tone: 'passive', t: "Let's start with next Friday.", r: "next friday, then forever. it's a plan. a great plan" },
        { tone: 'flirty', t: "Strong word. I mean it anyway.", r: "i know you do. that's the scary part. scary-good. come over later?" },
      ] },
    ],
  },
  {
    id: 'spark-text-date-close-flirty-1', on: 'date', stage: 'close', mood: 'flirty',
    say: "you've ruined me. i'm meant to be working on {work} and all i can think about is your laugh at 2am",
    opts: [
      { tone: 'cold', t: "Focus on your work.", r: "focus?? i was being romantic. fine. focusing. very hard. on not-you" },
      { tone: 'passive', t: "That was a good night.", r: "a GOOD night? it was legendary. i'm telling our grandchildren. a version of it" },
      { tone: 'flirty', t: "Then come and hear it again tonight.", r: "tonight?? i'm leaving early. i'll say i'm sick. lovesick. it's a real illness" },
      { tone: 'risque', t: "Leave work early. I'll make it worth your while.", r: "worth my while?! you can't SAY that at 11am. i'm staring at the clock. it's so slow" },
    ],
  },

  // ---- after your race (stage 'any') ----------------------------------------------------------------------------
  {
    id: 'spark-text-win-any-cold-1', on: 'win', stage: 'any', mood: 'cold',
    say: "you WON. i screamed. i'm still annoyed at you from last time but i SCREAMED. congrats i guess 🙄",
    opts: [
      { tone: 'cold', t: "Thanks, I guess.", r: "'thanks, i guess'. stealing my line. the scream was worth more but fine" },
      { tone: 'passive', t: "Thank you. Means a lot after last time.", r: "it does? ok. good. then i'm officially un-annoyed. celebrate properly!!" },
      { tone: 'flirty', t: "Your scream was the best part of the win.", r: "ugh you can't say that. i'm trying to stay cross. it's not working. CONGRATS" },
    ],
  },
  {
    id: 'spark-text-win-any-passive-1', on: 'win', stage: 'any', mood: 'passive',
    say: "P1!!! P1!!! made the whole café watch. a stranger hugged me. we're best friends now. CONGRATULATIONS 🏆",
    opts: [
      { tone: 'cold', t: "Bit much, but thanks.", r: "a bit much? it's a WIN. ok. i'll calm down. i won't. i can't", opts: [
        { tone: 'cold', t: "Just tired. Talk later.", r: "later then. i'll celebrate with my new best friend from the café" },
        { tone: 'passive', t: "Sorry. Thank you, really.", r: "you're welcome, really!! i'm still shaking. you won a whole race!!" },
        { tone: 'flirty', t: "You're the only one I wanted to hear from.", r: "the ONLY one? out of everyone? ok i'm crying. happy crying. call me" },
      ] },
      { tone: 'passive', t: "Thank you! Still can't believe it.", r: "believe it!! you were brilliant. that last corner. i nearly fell off my chair", opts: [
        { tone: 'cold', t: "Try to stay on your chair.", r: "ok, safety officer. i'll celebrate sitting down. quietly. like a librarian" },
        { tone: 'passive', t: "Watch the replay. There's a great overtake.", r: "watched it six times. the café's watched it six times. they're sick of you" },
        { tone: 'flirty', t: "I was thinking about you on the cool-down lap.", r: "on the cool-down lap?? with the world watching? keeping that forever" },
      ] },
      { tone: 'flirty', t: "Celebrate with me later?", r: "obviously!! i'm already planning it. there'll be confetti. there's always confetti", opts: [
        { tone: 'cold', t: "Can't tonight. Team dinner.", r: "team dinner. of course. i'll celebrate with the confetti alone then" },
        { tone: 'passive', t: "Tomorrow, after the debrief.", r: "tomorrow! i'm bringing a paper crown. you'll wear it. that's not a question" },
        { tone: 'flirty', t: "Bring the confetti. I'll bring the trophy.", r: "the TROPHY? i'm holding it and pretending i won. you'll let me. you'd better" },
      ] },
    ],
  },
  {
    id: 'spark-text-win-any-flirty-1', on: 'win', stage: 'any', mood: 'flirty',
    say: "WINNER!!! jumped up and down on the sofa. a neighbour knocked. worth it. come and celebrate, superstar 😏",
    opts: [
      { tone: 'cold', t: "Thanks. I need rest.", r: "rest? after a WIN? fine. i'll celebrate for both of us. louder" },
      { tone: 'passive', t: "Thanks! What a day.", r: "what a day what a DAY. you were unreal. i'm so proud i could burst" },
      { tone: 'flirty', t: "I'll celebrate with you. Only you.", r: "only me? then i'm wearing something sparkly. very sparkly. bring sunglasses" },
    ],
  },
  {
    id: 'spark-text-podium-any-cold-1', on: 'podium', stage: 'any', mood: 'cold',
    say: "podium. nice. i'm still a bit miffed at you but that was nice. well done",
    opts: [
      { tone: 'cold', t: "Not a win, though.", r: "you can't even enjoy a podium. no wonder you were grumpy with me" },
      { tone: 'passive', t: "Thanks. It was a tough one.", r: "it looked tough. you looked tough. ok. a bit less miffed" },
      { tone: 'flirty', t: "I'd swap the trophy for a smile from you.", r: "...ok. here. one smile. a tiny smile. rationed. for now" },
    ],
  },
  {
    id: 'spark-text-podium-any-passive-1', on: 'podium', stage: 'any', mood: 'passive',
    say: "on the PODIUM!! saw you spray the bubbly and cheered so loud the dog next door joined in. so proud 🎉",
    opts: [
      { tone: 'cold', t: "Should've been a win.", r: "should've? it was a PODIUM. ok, perfectionist. proud anyway. tough", opts: [
        { tone: 'cold', t: "I know what I'm aiming for.", r: "fine. go aim then. i'll celebrate your 'failure' with cake" },
        { tone: 'passive', t: "Okay. Thanks. It was good.", r: "it was GREAT. say great. ...fine. good. i'll take good" },
        { tone: 'flirty', t: "You're right. You make it feel like a win.", r: "i do? ok, i'm a trophy now. a talking one. be nice to me" },
      ] },
      { tone: 'passive', t: "Thanks! Felt good up there.", r: "you looked so happy up there! do that face more. it's a great face", opts: [
        { tone: 'cold', t: "It's just a face.", r: "it's THE face. fine. hide it. see if i care. i care" },
        { tone: 'passive', t: "I'll practise it.", r: "practise in the mirror. then show me. i'll score it out of podium" },
        { tone: 'flirty', t: "It was your face I wanted to see up there.", r: "next time i'll stand right under the podium. spray me. i'll scream" },
      ] },
      { tone: 'flirty', t: "Next time I'll spray it in your direction.", r: "aim well!! i'll be front row in my worst jacket. arms open", opts: [
        { tone: 'cold', t: "Joking. I'd never waste it.", r: "waste it?? on me?? wow. dry jacket for me then. fine" },
        { tone: 'passive', t: "Front row at {track}?", r: "front row it is. i've already sorted a pass. i'm resourceful. and loud" },
        { tone: 'flirty', t: "Arms open? I'll run straight into them.", r: "run!! i'm braced. i'm stronger than i look. ish" },
      ] },
    ],
  },
  {
    id: 'spark-text-podium-any-flirty-1', on: 'podium', stage: 'any', mood: 'flirty',
    say: "PODIUM!!! that's my driver. i've been saying 'my driver' to everyone. you're stuck with it now 😏",
    opts: [
      { tone: 'cold', t: "I'm not your driver.", r: "oh. ok. i'll stop saying it then. the café's going to be very confused" },
      { tone: 'passive', t: "Ha. Thanks. Good day.", r: "a good day? a GREAT day. say it with me. great. ...you're hopeless" },
      { tone: 'flirty', t: "I like the sound of that.", r: "you do?? then i'm saying it through a megaphone at {track}. you've been warned" },
    ],
  },
  {
    id: 'spark-text-points-any-cold-1', on: 'points', stage: 'any', mood: 'cold',
    say: "points. good job. still slightly cross about last time but i watched every lap so",
    opts: [
      { tone: 'cold', t: "You didn't need to.", r: "i know i didn't NEED to. i wanted to. never mind. forget it" },
      { tone: 'passive', t: "Thanks for watching. Means a lot.", r: "it does? ok. i'm softening. it's very irritating" },
      { tone: 'flirty', t: "Every lap? I'm flattered.", r: "don't get used to it. ok, get used to it. i'll watch the next one too" },
    ],
  },
  {
    id: 'spark-text-points-any-passive-1', on: 'points', stage: 'any', mood: 'passive',
    say: "{result} at {last}!! points are points. i did a little dance. a medium dance. well done 🙌",
    opts: [
      { tone: 'cold', t: "Should've been more.", r: "ok, grumpy. medium dance cancelled. i'll do a sad sway instead", opts: [
        { tone: 'cold', t: "It's my job to want more.", r: "i know. i'll just be proud quietly. in the corner. on my own" },
        { tone: 'passive', t: "Okay, okay. A point's a point.", r: "EXACTLY. new motto. i'm getting it printed" },
        { tone: 'flirty', t: "The medium dance deserves an audience. Me.", r: "an audience? ok. live show. there's a spin. it goes wrong every time" },
      ] },
      { tone: 'passive', t: "Thanks. Solid weekend.", r: "solid!! solid is underrated. like a good table. you're a good table", opts: [
        { tone: 'cold', t: "I'm not a table.", r: "you're SUCH a table. a grumpy table. fine. you're a chair now. demoted" },
        { tone: 'passive', t: "I'll take that as a compliment.", r: "it IS one. tables hold everything up. you're holding up my whole weekend" },
        { tone: 'flirty', t: "A table you'd want to sit at?", r: "best seat in the house. front and centre. ok i'm blushing at a table metaphor" },
      ] },
      { tone: 'flirty', t: "Then I'm aiming higher. I want the big dance.", r: "the BIG dance has a cartwheel in it. i can't cartwheel. i'll learn. for you", opts: [
        { tone: 'cold', t: "Don't learn cartwheels.", r: "fine. no cartwheels. no big dance. you're very good at cancelling joy" },
        { tone: 'passive', t: "Big dance at the next podium, then.", r: "next podium, big dance. deal. i'm stretching already" },
        { tone: 'flirty', t: "I'd pay to see you cartwheel.", r: "you don't pay, you clap. loudly. and catch me when i wobble" },
      ] },
    ],
  },
  {
    id: 'spark-text-points-any-flirty-1', on: 'points', stage: 'any', mood: 'flirty',
    say: "points!! you looked so focused on the in-lap. very distracting. nearly missed my train. your fault 😏",
    opts: [
      { tone: 'cold', t: "Not my fault you were watching.", r: "not your fault you looked like that? debatable. fine. i'll stop watching. sure" },
      { tone: 'passive', t: "Did you make the train?", r: "just!! ran the whole platform. i'm basically a racer now. race me" },
      { tone: 'flirty', t: "Distracting you is my new favourite hobby.", r: "it's working. i'm on the train and i've missed my stop. twice" },
    ],
  },
  {
    id: 'spark-text-bad-any-cold-1', on: 'bad', stage: 'any', mood: 'cold',
    say: "tough race. i'm still a bit hurt from last time but i'm not a monster. you ok?",
    opts: [
      { tone: 'cold', t: "Fine. Don't want to talk.", r: "ok. i won't push. i'm here. i guess" },
      { tone: 'passive', t: "Not great. Thanks for asking.", r: "of course i'm asking. i'm cross with you, not heartless. hug pending" },
      { tone: 'flirty', t: "Better now you've texted.", r: "...you don't get to be sweet when i'm being cross. but i'm glad" },
    ],
  },
  {
    id: 'spark-text-bad-any-passive-1', on: 'bad', stage: 'any', mood: 'passive',
    say: "ugh, {last} was rubbish for you. sending a virtual hug and a real pastry. it's at your hotel. eat it",
    opts: [
      { tone: 'cold', t: "Not hungry.", r: "the pastry isn't about hunger, it's about love. fine. give it to your engineer", opts: [
        { tone: 'cold', t: "Don't send anything else.", r: "ok. no more pastries. no more anything. noted" },
        { tone: 'passive', t: "Sorry. Thanks. Bad mood.", r: "allowed. bad moods are allowed. pastries are mandatory though" },
        { tone: 'flirty', t: "Okay, I'll eat it. Thinking of you.", r: "good. every crumb. then send me a crumb selfie" },
      ] },
      { tone: 'passive', t: "Thanks. That's really kind.", r: "i'm very kind. and very nosy. what happened? no, don't tell me. tell me later", opts: [
        { tone: 'cold', t: "Let's not talk about it.", r: "zipped. i'll leave you be then. pastry's still there" },
        { tone: 'passive', t: "The tyres went off. That's the story.", r: "the tyres. the villains. i'm writing them a strongly worded letter" },
        { tone: 'flirty', t: "Tell you later. In person. Over a pastry.", r: "a date with a pastry and you. best consolation prize ever" },
      ] },
      { tone: 'flirty', t: "I'd rather have the real hug.", r: "real hugs when you're back. it'll be a long one. like a whole lap long", opts: [
        { tone: 'cold', t: "Maybe. If I'm up for it.", r: "if you're up for it. ok. hug's on standby. i'm not begging" },
        { tone: 'passive', t: "Long one. Deal.", r: "longest hug in history. we'll set a record. a cuddly one" },
        { tone: 'flirty', t: "I'll hold you to that. Literally.", r: "literally. arms. squeeze. no letting go till i say. which is never" },
      ] },
    ],
  },
  {
    id: 'spark-text-bad-any-flirty-1', on: 'bad', stage: 'any', mood: 'flirty',
    say: "bad race, but you looked SO good in the interview after. is that wrong? it's not wrong. you did 😏",
    opts: [
      { tone: 'cold', t: "Not now.", r: "ok. too soon. i'll save the flirting for later. it keeps" },
      { tone: 'passive', t: "Ha. Thanks. Rough day.", r: "rough day. come here and let me un-rough it. i'm a professional un-rougher" },
      { tone: 'flirty', t: "Then the day wasn't a total loss.", r: "nope!! it had one good bit. you, in a cap, being grumpy at a camera" },
    ],
  },
  {
    id: 'spark-text-dnf-any-cold-1', on: 'dnf', stage: 'any', mood: 'cold',
    say: "saw you retire. that sucks. i know we're not on great terms but i'm sorry. really",
    opts: [
      { tone: 'cold', t: "Don't need sympathy.", r: "it's not sympathy. it's me being a decent person. whatever. ok" },
      { tone: 'passive', t: "Thanks. That means something.", r: "good. it's meant to. we can be weird with each other later. today i'm on your side" },
      { tone: 'flirty', t: "Your text is the best part of my day.", r: "your day was rubbish, so that's a low bar. but i'll take it" },
    ],
  },
  {
    id: 'spark-text-dnf-any-passive-1', on: 'dnf', stage: 'any', mood: 'passive',
    say: "nooo the car!! so unfair. i yelled at my telly. the neighbours think i've lost it. how are you doing?",
    opts: [
      { tone: 'cold', t: "Don't ask.", r: "not asking. i'll just send you a picture of a cat in a hat", opts: [
        { tone: 'cold', t: "No cat.", r: "no cat. ok. you really are in a mood. i'll back off" },
        { tone: 'passive', t: "Okay. Send the cat.", r: "cat sent. hat on. look at its little face. it's sad for you too" },
        { tone: 'flirty', t: "Forget the cat. Send yourself, later.", r: "me instead of the cat? the cat's gutted. i'm not. tonight" },
      ] },
      { tone: 'passive', t: "Gutted. But we'll come back.", r: "you'll come back SO hard. {track} won't know what's coming", opts: [
        { tone: 'cold', t: "Let's not jinx it.", r: "jinxing is my hobby. fine. i'll keep quiet. very quiet. shh" },
        { tone: 'passive', t: "Thanks for having my back.", r: "always. even on the rubbish days. especially on the rubbish days" },
        { tone: 'flirty', t: "Come and yell at the next one in person.", r: "in person?? i'll yell so loud you'll hear me in the car" },
      ] },
      { tone: 'flirty', t: "Better now you've yelled at a telly for me.", r: "i'll yell at anything for you. tellies. referees. clouds. whatever", opts: [
        { tone: 'cold', t: "Don't yell at clouds.", r: "the clouds deserved it. fine. i'll be calm. it won't last" },
        { tone: 'passive', t: "I'll take the yelling. Thanks.", r: "anytime. it's my best skill. ask the neighbours" },
        { tone: 'flirty', t: "Yell for me next race. I'll hear it.", r: "you'll hear it. the whole grandstand will hear it. you'll go faster" },
      ] },
    ],
  },
  {
    id: 'spark-text-dnf-any-flirty-1', on: 'dnf', stage: 'any', mood: 'flirty',
    say: "rubbish luck. but you climbing out and waving at the crowd? weirdly hot. sorry. not sorry 😏",
    opts: [
      { tone: 'cold', t: "Not funny. Bad day.", r: "sorry. bad timing. i'll wait till tomorrow to fancy you again" },
      { tone: 'passive', t: "Ha. Thanks, I think.", r: "you THINK?? it was a compliment!! a big one. take it. it's free" },
      { tone: 'flirty', t: "I'll wave at you next time instead.", r: "wave at me and i'll wave back with both arms. and a banner. and a scream" },
    ],
  },
];
