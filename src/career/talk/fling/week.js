// FLING - the phone, the week between races: late texts, left on read, back when they want a night out. Plain data, no imports.
export const DATA = [
  {
    id: 'fling-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: "u up? you were a bit frosty when we talked. i'm choosing to find it intriguing",
    opts: [
      { tone: 'cold', t: "It's late.", r: "it's 1am. that's not late, that's the good part of the evening", opts: [
        { tone: 'cold', t: "Goodnight.", r: "night then. sleep tight. i'll be up. i'm always up" },
        { tone: 'passive', t: "Fine. I'm up.", r: "knew it. nobody's asleep at 1am, they're just pretending to be boring" },
        { tone: 'flirty', t: "Intriguing how?", r: "like a locked door. i'm terrible with locked doors. i always want to see what's behind them" },
      ] },
      { tone: 'passive', t: "Just about. What's up?", r: "nothing. that's the point. 1am texts are never about anything. that's what makes them good", opts: [
        { tone: 'cold', t: "Then why text?", r: "because you were on my mind and my phone was in my hand. dangerous combination" },
        { tone: 'passive', t: "Fair. Night owl.", r: "see. you get it. most people want a reason. i don't do reasons" },
        { tone: 'flirty', t: "I'm glad you did.", r: "good. don't get comfy. do get a bit used to it" },
      ] },
      { tone: 'flirty', t: "For you? Always.", r: "always?? we've barely met. slow down. actually don't. i like fast", opts: [
        { tone: 'cold', t: "Kidding. Going to bed.", r: "ugh. tease. that's my job. i'll be thinking about the always though" },
        { tone: 'passive', t: "Mostly up.", r: "mostly up is perfect. mostly up is my favourite way to be" },
        { tone: 'flirty', t: "What are you wearing?", r: "a hoodie and a terrible decision. you?? don't answer that. answer that" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: "u up?",
    opts: [
      { tone: 'cold', t: "No.", r: "liar. you replied in four seconds. nobody asleep replies in four seconds", opts: [
        { tone: 'cold', t: "Now I'm going to sleep.", r: "fine. dream of something fun. i'll be here being fun at you" },
        { tone: 'passive', t: "Okay, yes. Barely.", r: "barely's enough. barely is my favourite amount of anything" },
        { tone: 'flirty', t: "For you, I'm up.", r: "look at that. a 1am yes. those are rare. i'll treasure it till about 3" },
      ] },
      { tone: 'passive', t: "Yeah. You?", r: "obviously. it's half one. what kind of question is that. what are you doing", opts: [
        { tone: 'cold', t: "Trying to sleep.", r: "trying. not succeeding. i can tell. i'm very good at reading tries" },
        { tone: 'passive', t: "Not much. Watching something.", r: "watching something at half one. you're more interesting than i thought. this is good news" },
        { tone: 'flirty', t: "Thinking about you, honestly.", r: "oh. okay. that's a lot for half one. i'll allow it. i've been doing the same" },
      ] },
      { tone: 'flirty', t: "Depends who's asking.", r: "{first}. the fun one. you've got my number now, that's your problem", opts: [
        { tone: 'cold', t: "Wrong person, then.", r: "ouch. ha. ok. i'll try again tomorrow. or in ten minutes" },
        { tone: 'passive', t: "Hi, {first}.", r: "hi. that's it. that's the whole text. i just wanted to see if you'd answer" },
        { tone: 'flirty', t: "The fun one's always welcome.", r: "always welcome. i'm holding you to that. i'll hold you to that at 2am specifically" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: "u up? it's late and i'm thinking about you and that's your fault. you were very distracting when we met",
    opts: [
      { tone: 'cold', t: "Go to sleep.", r: "bossy. i love it. i won't. i'll lie here being distracted. thanks a lot", opts: [
        { tone: 'cold', t: "Goodnight, {first}.", r: "goodnight. you used my name. that's very formal. very sexy. goodnight. i'm not asleep" },
        { tone: 'passive', t: "I'm up too, unfortunately.", r: "unfortunately. ha. you're funny at 1am. i didn't know. that's dangerous" },
        { tone: 'flirty', t: "Distracting how?", r: "your face. your voice. your whole... you. i'm being vague on purpose. vague is safe" },
      ] },
      { tone: 'passive', t: "I'm up. What's on your mind?", r: "you. obviously. don't make it weird. i'm making it weird. carry on", opts: [
        { tone: 'cold', t: "Nothing good, I bet.", r: "nothing good. everything fun. there's a difference. fun's better than good" },
        { tone: 'passive', t: "I'm flattered.", r: "be flattered. i don't text people at 1am who aren't flatter-worthy" },
        { tone: 'flirty', t: "You're on mine too.", r: "ok. good. now we're both awake and thinking. this is terrible. this is great" },
      ] },
      { tone: 'flirty', t: "It's mutual. You were distracting too.", r: "mutual. ugh. mutual's how it gets complicated. i love complicated. at night. only at night", opts: [
        { tone: 'cold', t: "Kidding. Night.", r: "you can't kid at 1am. 1am is sacred. i'll forgive you. by 2" },
        { tone: 'passive', t: "Now we're both awake.", r: "both awake. both distracted. we should do something about that. not tonight. soon" },
        { tone: 'flirty', t: "Come distract me properly.", r: "properly? not yet. soon. i'm a slow burn. kidding. i'm a medium burn" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: "photo of a plant. this is basil. the longest relationship i've ever had. he's doing better than you are at texting back",
    opts: [
      { tone: 'cold', t: "Nice plant.", r: "nice plant. wow. basil will be thrilled. he's very needy for a fern" },
      { tone: 'passive', t: "How long have you had him?", r: "three years. longest thing i've ever kept alive. that's not a cry for help. it's a brag" },
      { tone: 'flirty', t: "Lucky plant.", r: "basil IS lucky. he gets water and no questions. best deal i offer anyone" },
    ],
  },
  {
    id: 'fling-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: "meet basil 🌿 he's my plant. the only commitment i've ever made. three years. we're very happy",
    opts: [
      { tone: 'cold', t: "Why are you sending me a plant?", r: "because you asked what i'm like. this is what i'm like. green and low maintenance" },
      { tone: 'passive', t: "He looks healthy.", r: "he's thriving. i water him on tuesdays. it's the most organised thing about me" },
      { tone: 'flirty', t: "Lucky Basil. Three years with you.", r: "three years and he's never once asked what we are. perfect partner tbh" },
    ],
  },
  {
    id: 'fling-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: "say hi to basil 🌿 my plant. three years together. he's the only one who sees me in the morning. jealous?",
    opts: [
      { tone: 'cold', t: "Of a plant? No.", r: "you say that. everyone's a little jealous of basil. he's very photogenic for a fern" },
      { tone: 'passive', t: "Hi, Basil.", r: "he says hi back. he's shy. not like me. i'm very not shy. you've noticed" },
      { tone: 'flirty', t: "A bit jealous, yes.", r: "good. keep a bit. a bit's the right amount. basil doesn't need to know" },
    ],
  },
  {
    id: 'fling-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: "out. loud. bored of everyone here. you're not here. that's the problem. come out?",
    opts: [
      { tone: 'cold', t: "No. I'm in for the night.", r: "boo. ok. you're missing the best bit. there's a song on. you'd hate it. i love it" },
      { tone: 'passive', t: "Where are you?", r: "somewhere with a sticky floor. i'll send the pin. you won't come. prove me wrong" },
      { tone: 'flirty', t: "If you'd asked earlier.", r: "earlier? i don't do earlier. earlier's for planners. ask me later. i'll still be out" },
    ],
  },
  {
    id: 'fling-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: "what are you doing rn. i'm out. it's fun. it'd be more fun with you. no pressure. some pressure",
    opts: [
      { tone: 'cold', t: "Nothing. Going to bed.", r: "bed. at 11. you're a menace to fun. i'll report you to the authorities" },
      { tone: 'passive', t: "Who are you out with?", r: "friends. people. strangers. a dog at the door. it's that kind of night" },
      { tone: 'flirty', t: "Send me the address.", r: "look at you. spontaneous. i'll send it. actually you'll never find it. i'll come to you. no. send it" },
    ],
  },
  {
    id: 'fling-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: "come out. i'm wearing the good jacket. it's wasted on these people. wasted on everyone except you",
    opts: [
      { tone: 'cold', t: "Can't tonight.", r: "can't or won't? doesn't matter. the jacket will forgive you. i might" },
      { tone: 'passive', t: "What's the good jacket?", r: "you'll see. if you come out. that's called an incentive. i'm very good at incentives" },
      { tone: 'flirty', t: "On my way. Save me a spot.", r: "wait really?? ok. ok ok. i'll save you a spot. next to me. obviously" },
    ],
  },
  {
    id: 'fling-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: "sorry. saw your text. didn't answer. then it was a whole thing. anyway. hi. what are you up to?",
    opts: [
      { tone: 'cold', t: "You left me on read.", r: "i know. i'm a menace. i'm sorry. a bit sorry. a medium amount of sorry", opts: [
        { tone: 'cold', t: "Don't do it again.", r: "i'll try. i won't. i'll try. that's honest, at least" },
        { tone: 'passive', t: "Okay. Apology accepted.", r: "thank you. you're too nice to me. it's a problem for both of us" },
        { tone: 'flirty', t: "Make it up to me.", r: "i will. i'm very good at making things up to people. ask me how. no. i'll show you" },
      ] },
      { tone: 'passive', t: "Not much. Busy week.", r: "busy's good. busy means you're not waiting for me. please don't wait for me. i'm terrible at being waited for", opts: [
        { tone: 'cold', t: "I wasn't waiting.", r: "good. great. that's exactly right. why does that sting. it doesn't" },
        { tone: 'passive', t: "Noted. No waiting.", r: "thank you. no waiting, no wondering. just texts at strange hours. deal?" },
        { tone: 'flirty', t: "I'd wait a bit for you.", r: "a bit's permitted. a bit is very sweet. don't do a lot. a lot makes me run" },
      ] },
      { tone: 'flirty', t: "I was wondering about you.", r: "nowhere. here. in my head. it's very noisy in there. you're quieter. it's nice", opts: [
        { tone: 'cold', t: "I didn't wonder that hard.", r: "ha. ok. good. i like that you didn't wonder that hard. i'll wonder harder" },
        { tone: 'passive', t: "Glad you're back.", r: "i'm always back. that's the thing about me. i go. i come back. i'm a boomerang with good hair" },
        { tone: 'flirty', t: "Stay a while this time.", r: "a while. i'll try. a while's my longest unit. you get the whole while" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: "hi. sorry. i'm awful at replying. i saw your text and smiled and then forgot to reply. that's a compliment, sort of",
    opts: [
      { tone: 'cold', t: "That's not a compliment.", r: "it is in my language. smiling is rare. forgetting is common. you got the rare one", opts: [
        { tone: 'cold', t: "Learn a new language.", r: "i'm too old to learn languages. i'm 'fluent in late' and that's it" },
        { tone: 'passive', t: "I'll take it, I suppose.", r: "take it. it's a good one. i don't give them out to everyone. only the smile-worthy" },
        { tone: 'flirty', t: "You smiled, though.", r: "i did. a big one. a stupid one. don't tell anyone. especially don't tell me" },
      ] },
      { tone: 'passive', t: "It's fine. I'm busy too.", r: "see? we're perfect. two busy people who text when they feel like it. no drama", opts: [
        { tone: 'cold', t: "Let's keep it that way.", r: "absolutely. no drama. drama is for people who expect things. we expect nothing. lovely" },
        { tone: 'passive', t: "What've you been up to?", r: "this and that. mostly that. mostly loud. i'll tell you when i see you. if i remember" },
        { tone: 'flirty', t: "I'm never too busy for you.", r: "careful. that's how it starts. 'never too busy'. next it's 'we should get a dog'" },
      ] },
      { tone: 'flirty', t: "I was starting to miss you.", r: "miss me?? we barely know each other. that's very fast. i love fast. don't miss me though", opts: [
        { tone: 'cold', t: "Not really.", r: "ha. ok. good. same. i didn't miss you at all. i checked my phone twice. that's not missing" },
        { tone: 'passive', t: "Just a bit.", r: "a bit's healthy. a bit is healthy. i missed you a bit too. a small, healthy bit" },
        { tone: 'flirty', t: "A lot, actually.", r: "a lot. oh. okay. that's very brave. i'm not brave. i'll be brave at 2am. ask me then" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: "i know. i left you on read. i'm a monster. a cute monster. am i forgiven? say yes. say yes with an emoji",
    opts: [
      { tone: 'cold', t: "No emoji.", r: "no emoji is very cold. i'll take it. i deserve it. send one tomorrow", opts: [
        { tone: 'cold', t: "Not tomorrow either.", r: "harsh. i love it. i'm going to try so hard now. i'll be the best texter you've ever met" },
        { tone: 'passive', t: "Fine. Forgiven.", r: "forgiven. thank you. i'll leave you on read again probably. you'll forgive me again probably" },
        { tone: 'flirty', t: "🙄", r: "an eye roll. that's practically a heart. i'm framing it" },
      ] },
      { tone: 'passive', t: "Forgiven. Mostly.", r: "mostly. that's my word. you can't use my word. fine, you can use it. it suits you", opts: [
        { tone: 'cold', t: "Careful now.", r: "i never push my luck. i lean on it gently and see what happens" },
        { tone: 'passive', t: "What did you do instead?", r: "went out. danced. thought about texting you. didn't. i'm an idiot. a fun idiot" },
        { tone: 'flirty', t: "You can make it up to me.", r: "i'd love to. i'm very good at making up. making up and making out. same root word. probably" },
      ] },
      { tone: 'flirty', t: "😘", r: "oh. a kiss. straight to the kiss. you're more forgiving than i am. good. very good", opts: [
        { tone: 'cold', t: "That was a typo.", r: "a typo. sure. your thumb slipped onto the kiss. i'll pretend i believe you" },
        { tone: 'passive', t: "Don't do it again, though.", r: "i'll try. i can't promise. promises make me itchy. i'll try very hard though" },
        { tone: 'flirty', t: "Another for luck. 😘", r: "two kisses. that's practically a relationship. kidding. kidding. send three" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: "you asked when i'm free. i'm free after 10pm. on weekdays. and weekends. basically i'm only free after dark",
    opts: [
      { tone: 'cold', t: "That's not very free.", r: "it's extremely free. it's just nocturnal. i'm like an owl. a very attractive owl" },
      { tone: 'passive', t: "What do you do in the day?", r: "sleep. work. pretend to be a functioning adult. the night's where i actually live" },
      { tone: 'flirty', t: "After dark works for me.", r: "look at you. a night person in disguise. i knew it. i'll text you at 11" },
    ],
  },
  {
    id: 'fling-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: "so you know: i don't do daytime plans. coffee at 11am makes me break out in hives. dinner's suspicious. after 10 is fine",
    opts: [
      { tone: 'cold', t: "That's a long list of conditions.", r: "they're not rules. they're preferences. very strict preferences. that i never break" },
      { tone: 'passive', t: "Why's dinner suspicious?", r: "dinner is how people trap you into talking about your feelings. after 10 people just dance" },
      { tone: 'flirty', t: "After 10 it is, then.", r: "perfect. you're so easy. not like that. well. a bit like that. after 10" },
    ],
  },
  {
    id: 'fling-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: "fair warning: if we ever hang out it'll be late. very late. like 'should we be up this late' late. that ok?",
    opts: [
      { tone: 'cold', t: "I'm usually asleep by then.", r: "usually. i love 'usually'. it means sometimes you're not. i'll aim for the sometimes" },
      { tone: 'passive', t: "How late is late?", r: "late enough that it's early. you'll see. bring stamina. and a jacket. the walk home is cold" },
      { tone: 'flirty', t: "The later the better.", r: "oh, we're going to get on very well. very well and very late. dangerous" },
    ],
  },
  {
    id: 'fling-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: "2am thought: you're quite nice. keep it normal. i'm going to sleep now. i'm not going to sleep",
    opts: [
      { tone: 'cold', t: "It's 2am. Sleep.", r: "bossy. i like bossy. i'm still not sleeping. i'm lying here thinking you're quite nice. it's awful" },
      { tone: 'passive', t: "Thanks. I think.", r: "it's a compliment. 'quite nice' is high praise from me. most people get 'fine'" },
      { tone: 'flirty', t: "You're quite nice too.", r: "stop. now it's mutual. mutual is how it gets weird. goodnight. it's not goodnight" },
    ],
  },
  {
    id: 'fling-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: "i've decided you're one of my favourite people. it means nothing. loads of favourites. you're top three though",
    opts: [
      { tone: 'cold', t: "Only top three?", r: "top three is very good. number one is basil. two is my friend rio. three's you. it's a strong list" },
      { tone: 'passive', t: "Who are the other two?", r: "a plant and my best friend. you're up against stiff competition. one of them is photosynthetic" },
      { tone: 'flirty', t: "I'll aim for number one.", r: "good luck. number one is a plant. he's very hard to beat. he never texts back. it's mysterious" },
    ],
  },
  {
    id: 'fling-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: "it's 2am and i was going to text you something deep. then i remembered i don't do deep. so: hi. you're cute",
    opts: [
      { tone: 'cold', t: "It's 2am. Bed.", r: "i will. i won't. i'm going to lie here thinking you're cute. it's your fault. goodnight. not goodnight" },
      { tone: 'passive', t: "What was the deep thing?", r: "nope. deleted. deep things are for 4am and we're not there yet. ask me in a week. don't" },
      { tone: 'flirty', t: "You're cute too. Go to sleep.", r: "i can't sleep now. you said i'm cute. that's a stimulant. thanks a lot. goodnight trouble" },
    ],
  },
  {
    id: 'fling-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: "you went quiet on me. fine. i'm over it. tonight? late? say yes before i change my mind",
    opts: [
      { tone: 'cold', t: "Not tonight, sorry.", r: "no. ok. i respect no. i'll text you at midnight and ask again. that's not disrespect, that's optimism", opts: [
        { tone: 'cold', t: "Still no at midnight.", r: "noted. i'll ask at one. kidding. mostly. have a good night. a boring one" },
        { tone: 'passive', t: "Another night, maybe.", r: "another night. lovely. i'm very good at another nights. i'll keep one for you" },
        { tone: 'flirty', t: "Ask me at midnight.", r: "i will. midnight on the dot. be awake. be bored. be ready" },
      ] },
      { tone: 'passive', t: "Where?", r: "somewhere loud. then somewhere quiet. then wherever. that's not a plan, that's a vibe", opts: [
        { tone: 'cold', t: "I don't do vibes.", r: "everyone does vibes. you just call it 'preparation'. come anyway" },
        { tone: 'passive', t: "Okay. Send me the place.", r: "sent. well, i'll send it later. i don't know it yet. i'll find it. you'll find me" },
        { tone: 'flirty', t: "I'll go anywhere with you.", r: "anywhere's a big word. i'll pick somewhere small. with good lighting. and a door" },
        { tone: 'risque', t: "Yours, after?", r: "mine after. hm. maybe. you're bold tonight. i like you bold. ask me again at one" },
      ] },
      { tone: 'flirty', t: "Yes. Before you change it.", r: "ha. okay. yes. tonight. late. i won't change my mind. i might. i won't", opts: [
        { tone: 'cold', t: "Kidding. I'm busy.", r: "ugh. you got me. that's my move. i'm impressed and wounded. mostly wounded" },
        { tone: 'passive', t: "What time?", r: "eleven. maybe half eleven. i'm never on time, so maybe midnight. i'll be worth the wait" },
        { tone: 'flirty', t: "Can't wait.", r: "can't wait is dangerous. wait a little. it'll be better. i'm better when you've waited a bit" },
        { tone: 'risque', t: "Wear the good jacket.", r: "the good jacket. ok. you're getting the full experience tonight. brace yourself" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: "tonight? i've got nothing on and i'm bored and you're the least boring person in my phone",
    opts: [
      { tone: 'cold', t: "Not tonight, no.", r: "not tonight. ok. tomorrow? i'll be bored tomorrow too. i'm bored a lot. you're the cure", opts: [
        { tone: 'cold', t: "Or tomorrow.", r: "ok ok. i'll stop. for now. i'll be back. i'm always back. like a cold. a nice cold" },
        { tone: 'passive', t: "Maybe tomorrow.", r: "maybe tomorrow. i'll hold you to maybe. i'm a big believer in maybe" },
        { tone: 'flirty', t: "Tomorrow, definitely.", r: "definitely. wow. i'm not used to definitely. i'll note it. on my hand. it'll wash off" },
        { tone: 'risque', t: "Tomorrow, at yours.", r: "at mine. hm. you're very forward. i like it. we'll see. tomorrow's a long way off" },
      ] },
      { tone: 'passive', t: "Such as?", r: "nothing. something. you. a loud place and a quiet walk. i'll make it up as we go", opts: [
        { tone: 'cold', t: "Sounds aimless.", r: "aimless is the best. aim is for racing. out here we drift" },
        { tone: 'passive', t: "A walk sounds nice.", r: "a walk. ok. you're romantic. that's dangerous. we'll walk fast so it doesn't count" },
        { tone: 'flirty', t: "You're enough of a plan.", r: "ugh. smooth. i'm putting on shoes. stop being smooth while i put on shoes" },
        { tone: 'risque', t: "Something quiet. Just us.", r: "quiet. just us. hm. that's not a night out. that's a night in. i'm considering it" },
      ] },
      { tone: 'flirty', t: "The least boring? I'm honoured.", r: "you should be. my phone is full of very boring people. you're the only one who answers at midnight", opts: [
        { tone: 'cold', t: "Is that all I am?", r: "no. you're also nice to look at. and kind. and you text back. that's three things. huge" },
        { tone: 'passive', t: "Okay. Tonight.", r: "tonight. yes. i'll be late. don't be early. we'll meet in the middle. the middle of the night" },
        { tone: 'flirty', t: "I'll make tonight unboring.", r: "unboring. i love that. that's my new favourite word. you invented it. it's ours" },
        { tone: 'risque', t: "Let's skip the going out.", r: "skip it? to what? don't answer. i know what. hm. tempting. so tempting. ask me at 11" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: "hi gorgeous. what are you doing tonight. the answer is 'seeing you'. i'll wait",
    opts: [
      { tone: 'cold', t: "Seeing my bed. Alone.", r: "alone?? tragic. you're wasting yourself on a pillow. it's a crime. i'll report it", opts: [
        { tone: 'cold', t: "Report away.", r: "i will. to the fun police. they'll come round. they look a lot like me" },
        { tone: 'passive', t: "Fine. Seeing you, briefly.", r: "briefly is fine. briefly is my speciality. i'm a very brief person. it's the best bit" },
        { tone: 'flirty', t: "Unless you're there.", r: "oh. okay. that's a very good answer to a very rude question. i'm blushing. i don't blush" },
        { tone: 'risque', t: "Seeing you, then my bed.", r: "then your bed. you're full of plans tonight. i like plans that end like that. maybe" },
      ] },
      { tone: 'passive', t: "Depends. Where?", r: "anywhere you can hear me laugh. i've got a great laugh. you haven't heard the 2am one yet", opts: [
        { tone: 'cold', t: "I've heard enough.", r: "rude. you'll want to hear the 2am one. it's very rare. very special" },
        { tone: 'passive', t: "I'd like to hear it.", r: "then come out. late. it only comes out after midnight. like me" },
        { tone: 'flirty', t: "I'll be the reason for it.", r: "bold. very bold. you might be. you've got a good chance. better than most" },
        { tone: 'risque', t: "I'd like to hear you laugh in private.", r: "in private. hm. the private laugh is even rarer. it's earned. let's see if you earn it" },
      ] },
      { tone: 'flirty', t: "Seeing you. Obviously.", r: "obviously. see? easy. i love easy. i'll text you a place. it'll be loud. you'll love it", opts: [
        { tone: 'cold', t: "Kidding. I'm in. Not out.", r: "you're in?? in where?? in bed? in a mood? i'll come round. no i won't. yes i will. no" },
        { tone: 'passive', t: "When, roughly?", r: "late. always late. half eleven? midnight? whenever i've finished being fabulous elsewhere" },
        { tone: 'flirty', t: "I've been waiting for this.", r: "waiting?? don't sit up for me. never wait for me. but i'm glad. a bit. a lot" },
        { tone: 'risque', t: "And after?", r: "after's a secret. after's my favourite secret. you'll find out after" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: "can't make tonight. something came up. sorry. you were a bit off with me anyway, so maybe it's a sign",
    opts: [
      { tone: 'cold', t: "Fine.", r: "fine. ok. your fines are very scary. i'll make it up to you. probably. definitely. probably" },
      { tone: 'passive', t: "What came up?", r: "a thing. a friend thing. a me thing. i'm bad at explaining things. i'm good at cancelling" },
      { tone: 'flirty', t: "I'd rather see you. Another night?", r: "another night. yes. soon. i mean it. i mean it more than i usually mean things" },
      { tone: 'risque', t: "I'll keep the bed warm for you.", r: "ha. the bed. you're cheeky tonight. i'll be thinking about that. a lot. dammit" },
    ],
  },
  {
    id: 'fling-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: "ugh. i'm so sorry. i'm cancelling. something came up. i'll owe you one. i always do. well. sometimes",
    opts: [
      { tone: 'cold', t: "You always cancel.", r: "not always. sometimes i don't. those are the good nights. i'll do a good night soon. promise. ish" },
      { tone: 'passive', t: "It's okay. Next time.", r: "next time. you're so easy. i don't deserve easy. i'll take it anyway" },
      { tone: 'flirty', t: "I'll miss you tonight.", r: "don't miss me. i'm not worth missing. ok fine. miss me a bit. i'll miss you a bit back" },
      { tone: 'risque', t: "Make it up to me later, then.", r: "later. how much later. how up. you've got a dirty mind. same, honestly. later" },
    ],
  },
  {
    id: 'fling-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: "i hate this but i've got to bail tonight. i was looking forward to it, which is unusual, so take that as a compliment",
    opts: [
      { tone: 'cold', t: "You bail a lot.", r: "i know. i'm a bailer. it's a flaw. it's my worst flaw. my second worst is being this pretty" },
      { tone: 'passive', t: "It's fine. Rain check?", r: "rain check. yes. i love a rain check. it's a promise with an umbrella" },
      { tone: 'flirty', t: "You were looking forward to it?", r: "i was. it's weird. i don't look forward to things. i look sideways at them. this one i looked forward to" },
      { tone: 'risque', t: "Then come over after, whenever.", r: "whenever. that's a dangerous word to give me. i'll use it. i'll use it at 2am" },
    ],
  },
  {
    id: 'fling-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: "you've been quiet. i've been quieter. miss me? you can say no. you'll be lying, but you can say it",
    opts: [
      { tone: 'cold', t: "Nope.", r: "ha. liar. but ok. respect. i didn't miss you one bit. i checked my phone a normal amount" },
      { tone: 'passive', t: "Where have you been?", r: "hiding. working. out. hiding a bit more. you're a lot to think about. i'm not used to thinking" },
      { tone: 'flirty', t: "A little.", r: "a little. good. a little is the right amount. i missed you a little too. a little a lot" },
      { tone: 'risque', t: "Come show me how much you missed me.", r: "ha. bold. maybe. you're not getting off that easy. well. you might be" },
    ],
  },
  {
    id: 'fling-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: "hey stranger. i know. it's been ages. i'm a disappearing act. but i'm back. miss me?",
    opts: [
      { tone: 'cold', t: "I didn't notice.", r: "ouch. ok. i deserve that. i'll be extra charming this week to make up for it" },
      { tone: 'passive', t: "Sort of. What happened?", r: "nothing. i do this. i go quiet when it's nice. it's a reflex. a bad one. i'm working on it. not really" },
      { tone: 'flirty', t: "Of course I missed you.", r: "of course. like it's obvious. it's not obvious. it's lovely. don't say it so easily" },
      { tone: 'risque', t: "Missed you enough to want you over tonight.", r: "tonight. oh. that's a big welcome back. i like big welcomes. i'm pondering it. i'm thinking" },
    ],
  },
  {
    id: 'fling-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: "guess who. it's me. the one who vanishes. i'm back and i've been thinking about you and it's very inconvenient",
    opts: [
      { tone: 'cold', t: "Inconvenient for me too.", r: "good. we're both inconvenienced. that's fair. that's practically romance" },
      { tone: 'passive', t: "Thinking what?", r: "things. nice things. things i'm not saying in writing. writing makes it evidence" },
      { tone: 'flirty', t: "Good. Keep thinking.", r: "i will. i can't stop. it's your fault. you're very thinkable" },
      { tone: 'risque', t: "Tell me in person. Tonight.", r: "in person. tonight. you're so demanding. i love it. maybe. probably. i'll text at 11" },
    ],
  },
  {
    id: 'fling-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: "you were cold with me. i was rude about it. here's an apology: you're the best-looking person i know. there. done",
    opts: [
      { tone: 'cold', t: "That's not an apology.", r: "it's the best i've got. i don't do 'i'm sorry'. i do 'you're gorgeous'. it's very effective", opts: [
        { tone: 'cold', t: "Try 'sorry'.", r: "sorry. ugh. that hurt. physically. are you happy now. i'm not. ok i am a bit" },
        { tone: 'passive', t: "Okay. Accepted.", r: "thank you. you're very forgiving. i'll try to be less rude. no i won't. a bit less" },
        { tone: 'flirty', t: "The best-looking?", r: "obviously. don't fish. you know. everyone knows. i'm just the only one who says it at 1am" },
      ] },
      { tone: 'passive', t: "Thank you. I think.", r: "you're welcome. keep your head small. let it go to your chest. somewhere warm", opts: [
        { tone: 'cold', t: "Weird thing to say.", r: "i'm a weird person. it was a compliment though. take it. compliments from me are rare" },
        { tone: 'passive', t: "That's sweet.", r: "it's not sweet. it's accurate. i'm a very accurate person. sometimes" },
        { tone: 'flirty', t: "You're not bad yourself.", r: "not bad. ouch. i'll take it. i'll take anything from you. that's not a confession. it's a comment" },
      ] },
      { tone: 'flirty', t: "Is that a compliment or a confession?", r: "a compliment. confessions are for 4am. it's only 1. stay up for 4 if you want the confession", opts: [
        { tone: 'cold', t: "Neither, I think.", r: "ha. fine. neither. it's a weather report. you're sunny. i'm cloudy. there" },
        { tone: 'passive', t: "I'll take the compliment.", r: "good. take it. keep it. put it somewhere safe. keep it private" },
        { tone: 'flirty', t: "I'll stay up for the confession.", r: "you won't. nobody does. if you do, i'll have to confess. that's terrifying. go to sleep" },
        { tone: 'risque', t: "Confess it in person.", r: "in person. at night. close up. maybe. that's where i do my best confessing" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: "random but you've got the nicest laugh. i was thinking about it today. ok that's enough sincerity for one week",
    opts: [
      { tone: 'cold', t: "That's random.", r: "i'm a random person. it's my best quality. well. my second best. you can guess the first", opts: [
        { tone: 'cold', t: "No guesses.", r: "boring. it's my hair. obviously. everyone knows it's my hair" },
        { tone: 'passive', t: "What's your best?", r: "my timing. i always know when to leave. which is now. kidding. stay" },
        { tone: 'flirty', t: "Your smile?", r: "...yes. ok. you got it. it's my smile. don't tell anyone you know" },
      ] },
      { tone: 'passive', t: "Thanks. You're nice too.", r: "nice. ugh. don't call me nice. call me trouble. call me late. nice is for people with jobs that start at 9", opts: [
        { tone: 'cold', t: "Fine. You're trouble.", r: "thank you. much better. that's my preferred title. trouble, first class" },
        { tone: 'passive', t: "Okay. Lovely, then.", r: "lovely's worse. lovely means you'd bring me soup. don't bring me soup" },
        { tone: 'flirty', t: "You're my favourite trouble.", r: "favourite trouble. ok. i'll take that. i'll put it on my door" },
      ] },
      { tone: 'flirty', t: "Say more sincere things.", r: "no. one a week. that's the limit. you used it up. next one's next sunday. i hate sundays", opts: [
        { tone: 'cold', t: "I'll live.", r: "you will. you're strong. you'd survive without my sincerity. most people do. happily" },
        { tone: 'passive', t: "Okay. Sunday, then.", r: "sunday. ugh. fine. i'll be sincere on a sunday. that's the most romantic thing i've ever agreed to" },
        { tone: 'flirty', t: "I'll make you break the limit.", r: "you'll try. you're very good at trying. i'm very good at failing to resist. hm" },
        { tone: 'risque', t: "Be sincere in person. Late.", r: "late and close. that's where sincerity lives with me. you've worked me out. that's annoying" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: "you looked so good when we met that i walked into a door afterwards. a real door. i'm not joking. i hate you",
    opts: [
      { tone: 'cold', t: "You walked into a door?", r: "a whole door. glass. very embarrassing. i blamed the door. the door blamed you", opts: [
        { tone: 'cold', t: "That's on you.", r: "it's on the door. and you. never me. i'm blameless. i'm a victim of your face" },
        { tone: 'passive', t: "Did you hurt yourself?", r: "i'm fine. my pride's bruised. my forehead's fine. you can kiss it better. kidding. not kidding" },
        { tone: 'flirty', t: "I'll walk you past doors.", r: "my hero. you can guide me. through doors. and other hazards. you're the biggest hazard" },
      ] },
      { tone: 'passive', t: "That's very flattering.", r: "it should be. i don't walk into doors for everyone. you're the first door-level person", opts: [
        { tone: 'cold', t: "Watch where you're going.", r: "i'm trying. you're very distracting. it's a safety issue. you should come with a warning" },
        { tone: 'passive', t: "I'll take that as a compliment.", r: "please do. it cost me a door. well, my dignity. same thing" },
        { tone: 'flirty', t: "You looked good too.", r: "stop. i'll walk into another door. there's one right here. i'm looking at it nervously" },
      ] },
      { tone: 'flirty', t: "I'd walk into a door for you.", r: "please don't. one of us has to be functional. probably you. you drive for a living", opts: [
        { tone: 'cold', t: "Not literally.", r: "good. no doors. we'll stay upright. mostly upright. occasionally not" },
        { tone: 'passive', t: "Let's both avoid doors.", r: "deal. doors are the enemy. except bedroom doors. those are fine. was that too far" },
        { tone: 'flirty', t: "Only if you're behind it.", r: "behind it waiting. that's very romantic. very dramatic. very me. you get me" },
        { tone: 'risque', t: "Let's find a door to close, then.", r: "ha. a door to close. you're filthy. not filthy. cheeky. a door. i'll think about which door" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: "i know you've been off with me. come over anyway. or i'll come to you. either way, i want to see you tonight",
    opts: [
      { tone: 'cold', t: "I'm staying in tonight.", r: "ok. i'll want to see you tomorrow instead. i'm very persistent. it's not a flaw. it's a feature" },
      { tone: 'passive', t: "What's the occasion?", r: "no occasion. i just want to see you. that's new for me. wanting things. it's itchy" },
      { tone: 'flirty', t: "I'd like that.", r: "good. come. or i'll come. either way. i'm putting shoes on. i'm taking them off. come over" },
      { tone: 'risque', t: "Come over. Stay late.", r: "stay late. i always stay late. i never stay early. coming. ish" },
    ],
  },
  {
    id: 'fling-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: "come over? or i come over. i don't mind which. i'm just bored and you're very unboring",
    opts: [
      { tone: 'cold', t: "I'm tired.", r: "tired's fine. tired people are very cuddly. i'm not saying cuddles. i'm saying tired's fine" },
      { tone: 'passive', t: "What would we do?", r: "nothing. talk. watch something. not watch something. see how the night goes" },
      { tone: 'flirty', t: "Yes. Mine.", r: "yours. ok. send the address. i'll get lost. you'll have to find me. it's romantic" },
      { tone: 'risque', t: "Come over and don't plan on leaving early.", r: "not leaving early. bold. i never leave early. i leave late and quietly. very quietly" },
    ],
  },
  {
    id: 'fling-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: "come over. i'm wearing nothing interesting and i've got nothing to do and i want to look at your face",
    opts: [
      { tone: 'cold', t: "I'm busy.", r: "busy. ugh. ok. my face will wait. my face is very patient. the rest of me isn't" },
      { tone: 'passive', t: "Just my face?", r: "mostly your face. the rest is a bonus. a very good bonus. come over and find out" },
      { tone: 'flirty', t: "I'll be there in twenty.", r: "twenty?? that's so fast. ok. i need to tidy. i need to hide my plant. he's very nosy" },
      { tone: 'risque', t: "Wear something less interesting.", r: "less interesting. ha. you're terrible. i'm already changing. into what, you'll see" },
    ],
  },
  {
    id: 'fling-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: "i like you. that's it. that's the text. you were cold last time and i still like you. that's annoying for me",
    opts: [
      { tone: 'cold', t: "Why is it annoying?", r: "because i don't do liking. i do fun. liking is fun's annoying cousin who wants to talk" },
      { tone: 'passive', t: "Same. I like you.", r: "don't. i only said it so it'd stop sitting in my chest. you can't say it back. that's the rule" },
      { tone: 'flirty', t: "Good. I'm glad.", r: "glad's nice. glad's safe. glad's not 'i love you'. thank you for glad. i needed glad" },
      { tone: 'risque', t: "Come over and say it to my face.", r: "to your face. at night. ok. maybe. i might chicken out. i'll be brave for about a minute" },
    ],
  },
  {
    id: 'fling-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: "ok honest text, then i'll delete my account: i like you more than i like most people. a lot more. bye",
    opts: [
      { tone: 'cold', t: "Don't delete your account.", r: "i won't. i'll just put my phone in a drawer for an hour. drama is my love language" },
      { tone: 'passive', t: "That's a nice thing to hear.", r: "it's a scary thing to send. i'm going to lie on the floor now. don't reply. reply" },
      { tone: 'flirty', t: "I like you more than most people too.", r: "more than most. ok. more than most is the right amount. don't say 'more than anyone'. i'll faint" },
      { tone: 'risque', t: "Show me how much. Tonight.", r: "tonight. you're so direct. ok. i'll show you. very non-verbally" },
    ],
  },
  {
    id: 'fling-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: "it's late and i'm being honest: i think about you more than the rules allow. there. now forget i said it",
    opts: [
      { tone: 'cold', t: "Consider it forgotten.", r: "thank you. you're so good at forgetting. it's very attractive. remember a bit though" },
      { tone: 'passive', t: "What rules?", r: "my rules. i have rules. rule one: no catching feelings. i'm breaking it. slightly" },
      { tone: 'flirty', t: "I won't forget it.", r: "you have to. it's in the contract. what contract. i don't know. please don't forget it" },
      { tone: 'risque', t: "Then come break the rules properly.", r: "properly. oh no. you're going to get me in so much trouble. i love trouble. coming" },
    ],
  },
  {
    id: 'fling-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: "you were off with me last time. quick check. we're still having fun, yeah? nobody's getting serious?",
    opts: [
      { tone: 'cold', t: "Nobody's getting serious.", r: "good. great. perfect. why do i feel weird about it. i don't. i feel great" },
      { tone: 'passive', t: "It's fun. Why do you ask?", r: "routine checking. like a smoke alarm. beep. all clear. good" },
      { tone: 'flirty', t: "It's more than fun.", r: "don't say more. more is a slippery word. more means toothbrushes. fun means fun" },
      { tone: 'risque', t: "Let me remind you how fun.", r: "remind me. i'm forgetful. very forgetful. remind me thoroughly" },
    ],
  },
  {
    id: 'fling-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: "checking in. purely administrative. we're still just having fun, yeah? no labels? no feelings? i'm asking for a friend",
    opts: [
      { tone: 'cold', t: "Just fun.", r: "just fun. lovely. tell my friend. my friend is me. thank you" },
      { tone: 'passive', t: "Which friend?", r: "the friend in my chest. it's nervous. a nervous little friend. don't worry about it" },
      { tone: 'flirty', t: "Some feelings, maybe.", r: "some. a small some. ok. i'll allow a small some. don't feed it after midnight" },
      { tone: 'risque', t: "Fun, with benefits.", r: "with benefits. ha. the benefits are excellent. i'll put that in the brochure" },
    ],
  },
  {
    id: 'fling-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: "hi you. tell me this is still fun. tell me it's light. tell me you're not falling for me. lie if you have to",
    opts: [
      { tone: 'cold', t: "I'm not falling for you.", r: "good. thank you. that's what i was after. why does it sound so bad when you say it" },
      { tone: 'passive', t: "I'll tell you whatever you want.", r: "that's dangerous. i want lots of things. most of them at 2am" },
      { tone: 'flirty', t: "I'm lying, then.", r: "ugh. you're lying. ok. me too. this is fine. this is fun. we're two liars having fun" },
      { tone: 'risque', t: "Tell you in person?", r: "in person, late, in the dark. where lies sound like truth. yes. come over" },
    ],
  },
  {
    id: 'fling-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: "call me. not now. late. like midnight. i want to hear your voice. you were cold with me and i still want your voice",
    opts: [
      { tone: 'cold', t: "Why late?", r: "because late's honest. daytime calls are all 'how was your day'. midnight calls are real", opts: [
        { tone: 'cold', t: "I'll be asleep.", r: "then i'll call your voicemail. it's a good voicemail. very calm. like you" },
        { tone: 'passive', t: "Okay. Midnight.", r: "midnight. i'll be in bed. you'll be in bed. we'll be in separate beds. talking. very innocent" },
        { tone: 'flirty', t: "I'll stay up, then.", r: "you're always staying up for me. it's very sweet. it's terrible for your racing. stay up" },
        { tone: 'risque', t: "Midnight. And then come over.", r: "come over. after the call. you want both. greedy. i love greedy" },
      ] },
      { tone: 'passive', t: "What do you want to talk about?", r: "nothing. anything. your day. my day. your voice. mostly your voice", opts: [
        { tone: 'cold', t: "I'm not much of a talker.", r: "i know. i'll talk. you just breathe. that's enough. that's honestly enough" },
        { tone: 'passive', t: "Easily.", r: "good. midnight. don't be late. i'll be late. i'm always late. don't be late" },
        { tone: 'flirty', t: "I'll tell you how much I missed you.", r: "don't do that at midnight. i'll say something back. midnight me can't be trusted" },
        { tone: 'risque', t: "Talk dirty to me?", r: "ha. at midnight? maybe. i'm very good at innuendo. you'll be blushing. i'll hear it" },
      ] },
      { tone: 'flirty', t: "I'll call now.", r: "now? no. now's too bright. midnight. trust me. midnight's better", opts: [
        { tone: 'cold', t: "Fine. Never mind.", r: "not never mind. midnight mind. i'll call you. i'll call you at midnight" },
        { tone: 'passive', t: "Midnight, then.", r: "midnight. alarm's set. i don't need an alarm. i'll be waiting. not waiting. ready" },
        { tone: 'flirty', t: "I'll count the hours.", r: "don't count. counting is clingy. i'm counting too. it's six hours. dammit" },
        { tone: 'risque', t: "I'll keep you up all night.", r: "all night. on the phone. or not on the phone. we'll see how the call goes" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: "call me later? late. when everyone's asleep. i like your voice when it's quiet",
    opts: [
      { tone: 'cold', t: "I'll text instead.", r: "text's fine. text's safe. text can't hear me smile. call me when you're brave", opts: [
        { tone: 'cold', t: "Texting's easier.", r: "it is. i'm a texter too. we're very safe people. very safe and very far apart" },
        { tone: 'passive', t: "Maybe I'll call.", r: "maybe. my favourite word. you know that. you're using it on purpose. call me" },
        { tone: 'flirty', t: "Your voice is better.", r: "ok. yes. call. at midnight. i'll answer on the first ring. i won't. the second" },
        { tone: 'risque', t: "I'll come over instead.", r: "even better. no phone needed. just you at my door. late. quietly" },
      ] },
      { tone: 'passive', t: "What time is later?", r: "after midnight. before 2. the sweet spot. when the world's quiet and i'm honest", opts: [
        { tone: 'cold', t: "That's very late.", r: "late's my time. i'm useless before 11. i'm wonderful at 1" },
        { tone: 'passive', t: "I'll still be awake.", r: "good. you're so reliable. i love that and i'm scared of it. call me" },
        { tone: 'flirty', t: "I'll call at the sweet spot.", r: "the sweet spot. i invented that phrase. you're stealing it. i'll allow it" },
        { tone: 'risque', t: "And then what?", r: "and then you'll want to come over. i know you. i'll say maybe. i'll mean yes" },
      ] },
      { tone: 'flirty', t: "I'll call you right at midnight.", r: "right at midnight. you're very precise. racing driver. i love precise. i love midnight", opts: [
        { tone: 'cold', t: "Or not.", r: "or not. that's my line. you're stealing my lines again. call me anyway" },
        { tone: 'passive', t: "Don't fall asleep.", r: "i never fall asleep before 2. you know this. you should know this. you do now" },
        { tone: 'flirty', t: "I can't wait to hear your voice.", r: "don't say that. it's 4pm. you can wait. you can wait 8 hours. i'm waiting too" },
        { tone: 'risque', t: "Midnight, then my place.", r: "your place. midnight. you're planning. i'll allow it. tonight you can plan" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: "call me later. i want to fall asleep listening to you talk about cars. it's the most boring thing ever. i love it",
    opts: [
      { tone: 'cold', t: "Cars aren't boring.", r: "they're incredibly boring. you make them less boring. you make lots of things less boring", opts: [
        { tone: 'cold', t: "I'll talk about something else.", r: "no. cars. the cars are perfect. the boredom is the point. i'll be asleep in minutes" },
        { tone: 'passive', t: "Cars it is, then.", r: "cars it is. talk about tyres. tyres are very soothing. degradation. lovely word" },
        { tone: 'flirty', t: "You make me less boring too.", r: "i've never been boring. but thank you. you make me less... leavey. leaving less" },
        { tone: 'risque', t: "I'll tell you about cars in person.", r: "in person. in bed. talking about cars. that's the most romantic thing i've ever heard" },
      ] },
      { tone: 'passive', t: "What do you want to hear?", r: "downforce. tyres. that thing about corners. don't tell me what it means. just say it slowly", opts: [
        { tone: 'cold', t: "That's weird.", r: "it's very weird. i'm very weird. you knew that. you like it" },
        { tone: 'passive', t: "Downforce, then.", r: "downforce. mm. you've ruined that word for me now. in a lovely way" },
        { tone: 'flirty', t: "Anything to put you to sleep.", r: "anything. you're so sweet. too sweet. sweet is dangerous. keep being dangerous" },
        { tone: 'risque', t: "I'll say it slowly, in your ear.", r: "in my ear. slowly. ok you've won. come over. bring the downforce" },
      ] },
      { tone: 'flirty', t: "I'll talk all night if you want.", r: "all night. ha. i'll be asleep in ten minutes. stay on the line anyway. i like knowing you're there", opts: [
        { tone: 'cold', t: "Ten minutes, max.", r: "ten minutes. deal. i'll fall asleep in five. you'll listen to me breathe. romantic" },
        { tone: 'passive', t: "Okay. Call you at midnight.", r: "midnight. perfect. you're perfect. that was too much. ignore the perfect" },
        { tone: 'flirty', t: "I'll stay on the line.", r: "stay on the line. that's the sweetest thing. don't hang up. even if i snore. i don't snore" },
        { tone: 'risque', t: "Or I come over and tell you.", r: "come over. bring your voice. and the rest of you. especially the rest of you" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: "saw a photo of you with someone. smiling. it's fine. we're not exclusive. i'm not jealous. who is it",
    opts: [
      { tone: 'cold', t: "That's private.", r: "it is. totally. i agree. i'm not asking. i'm just typing words. who is it" },
      { tone: 'passive', t: "Only a mate.", r: "a friend. great. friends are great. i have loads. it's fine. it's very fine" },
      { tone: 'flirty', t: "Jealous? You?", r: "not jealous. curious. jealousy is for people who own things. i don't own you. i'd like to borrow you though" },
      { tone: 'risque', t: "Come over and I'll make you forget the photo.", r: "make me forget. you think you can. you probably can. ugh. fine. come over" },
    ],
  },
  {
    id: 'fling-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: "random question. no reason. who were you with today? i saw something. it's fine. none of my business. totally fine",
    opts: [
      { tone: 'cold', t: "Why do you want to know?", r: "correct. it isn't. i said so. i'm agreeing with myself. very healthy. i'm fine" },
      { tone: 'passive', t: "Someone from work.", r: "work. ok. good. work is safe. unless it isn't. it's fine. i'm being so normal about it" },
      { tone: 'flirty', t: "Are you jealous?", r: "no. yes. no. jealous isn't my thing. i get... interested. i'm very interested. who was it" },
      { tone: 'risque', t: "Nobody who keeps me up at night like you.", r: "ok. that helped. that shouldn't work on me. i'm still interested. but that helped" },
    ],
  },
  {
    id: 'fling-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: "saw you with someone today. you looked happy. i'm happy you're happy. i'm normal happy. not weird happy",
    opts: [
      { tone: 'cold', t: "You sound weird happy.", r: "i'm not weird happy. i'm normal happy with a slight twitch. it's fine. it's nothing" },
      { tone: 'passive', t: "It was nothing, honestly.", r: "i know. i know it was. i trust you. that's new. trusting people. i'm trying it out" },
      { tone: 'flirty', t: "Nobody makes me happy like you.", r: "stop. you can't say that. now i'm happy happy. that's dangerous. thank you" },
      { tone: 'risque', t: "Want me to show you who I'm happiest with?", r: "show me. late. in person. very convincingly. yes. ok. i'm not jealous at all now" },
    ],
  },
  {
    id: 'fling-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: "i know i cancelled again. don't be cross. i'll make amends. i always do. well. i usually do",
    opts: [
      { tone: 'cold', t: "You keep doing this.", r: "i know. i'm sorry. properly sorry. i'm bad at this part. i'm good at the other parts" },
      { tone: 'passive', t: "What happened this time?", r: "nothing. i panicked. it was a nice plan and nice plans make me panic. it's so stupid" },
      { tone: 'flirty', t: "I'll survive. Just make it up to me.", r: "i will. i'll make it up to you twice. once nicely. once very not nicely" },
      { tone: 'risque', t: "Make it up to me tonight, then.", r: "tonight. ok. late. i'll head your way. i'll bring an apology. a very physical one" },
    ],
  },
  {
    id: 'fling-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: "sorry. i bailed again. i know. it's a pattern. i'm a pattern. please don't be cross. be a little cross. not very",
    opts: [
      { tone: 'cold', t: "I'm a bit cross.", r: "a bit's fair. a bit's allowed. i'm a bit cross with me too. we can be cross together" },
      { tone: 'passive', t: "It's okay. I understand.", r: "you shouldn't understand. you should shout. i deserve a shout. you're far too kind to me" },
      { tone: 'flirty', t: "I can never stay cross with you.", r: "that's your weakness. i know it. i shouldn't use it. i'll use it gently" },
      { tone: 'risque', t: "I'll forgive you at mine. Late.", r: "forgive me at yours. late. ok. that's the best deal anyone's ever offered me" },
    ],
  },
  {
    id: 'fling-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: "i'm the worst. i cancelled. you're allowed to hate me. please don't hate me. hate me a tiny bit",
    opts: [
      { tone: 'cold', t: "I don't hate you.", r: "good. great. i'd hate it if you hated me. that's a lot of hate. let's not" },
      { tone: 'passive', t: "Next time, though?", r: "next time. i promise. i don't promise. i'm promising. look at me. promising. weird" },
      { tone: 'flirty', t: "A tiny bit of hate. 🙃", r: "an upside-down face. that's practically a love letter. i'm keeping it" },
      { tone: 'risque', t: "Make it up to me with interest.", r: "interest. ok. compound interest. i'll pay it all back. tonight. late. in instalments" },
    ],
  },
  {
    id: 'fling-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: "you've been distant. i get it. here's a thought: after the season, save me a weekend. maybe. i'm not promising",
    opts: [
      { tone: 'cold', t: "You never promise.", r: "i know. i'm trying. this is me trying. a maybe is huge for me. it's a promise in a disguise", opts: [
        { tone: 'cold', t: "Then promise.", r: "i can't. not yet. but i'm saying maybe. that's the furthest i've ever got. honestly" },
        { tone: 'passive', t: "A maybe's fine.", r: "thank you. a maybe's what i've got. i'll try to turn it into something. slowly" },
        { tone: 'flirty', t: "I'll take your disguised promise.", r: "it's a very good disguise. it has a moustache. take it. hold it. carefully" },
        { tone: 'risque', t: "A whole weekend? In bed?", r: "ha. most of it in bed. some of it out of bed. very little of it in daylight" },
      ] },
      { tone: 'passive', t: "Which weekend?", r: "one after the last race. a quiet one. when you're not tired and i'm not scared. if that exists", opts: [
        { tone: 'cold', t: "Maybe it doesn't.", r: "maybe it doesn't. i'm hoping it does. hoping is new. it's very uncomfortable" },
        { tone: 'passive', t: "The first one after the season.", r: "the first one. ok. i'll put it in my calendar. i don't have a calendar. i'll buy one" },
        { tone: 'flirty', t: "I'll save them all for you.", r: "all of them. don't. that's too many. save one. maybe two. we'll start with one" },
        { tone: 'risque', t: "A weekend where we don't leave the flat.", r: "not leave the flat. ever? for food. once. maybe twice. ok i'm in" },
      ] },
      { tone: 'flirty', t: "I'll save you every weekend.", r: "every weekend's too many. i'll run. one weekend. a test weekend. see if i survive it", opts: [
        { tone: 'cold', t: "Fine. One weekend.", r: "one weekend. it's a deal. oh no. i've made a deal. i'm a person with plans now" },
        { tone: 'passive', t: "A test weekend, then.", r: "a test weekend. pass/fail. you'll pass. i might fail. we'll see. it's exciting" },
        { tone: 'flirty', t: "You'll survive it. I'll make sure.", r: "you'll make sure. ok. that's very reassuring. too reassuring. i'm sweating" },
        { tone: 'risque', t: "I'll make sure you don't want to leave.", r: "you might manage it. you're very convincing. in person especially" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: "thinking about the winter. when the cars are packed away. we could do a whole weekend. maybe. if you want. no pressure",
    opts: [
      { tone: 'cold', t: "We'll see, I suppose.", r: "we'll see. that's my move. you're using my move. ugh. it works so well. no wonder i use it", opts: [
        { tone: 'cold', t: "I mean it. We'll see.", r: "ok. we'll see. that's fair. i've said 'we'll see' to you a hundred times. you're allowed one" },
        { tone: 'passive', t: "It does sound nice.", r: "it does, doesn't it. i'm scared of how nice it sounds. nice things are scary" },
        { tone: 'flirty', t: "I'd love that, actually.", r: "you would? ok. ok. good. i'm going to lie down. this is a lot. good a lot" },
        { tone: 'risque', t: "A whole weekend. All to myself?", r: "all to yourself. hm. you'd have me all weekend. are you sure you can handle that" },
      ] },
      { tone: 'passive', t: "You're making plans?", r: "i know. who am i. i'm a different person. a person with a hypothetical weekend", opts: [
        { tone: 'cold', t: "Don't make plans you'll break.", r: "that's fair. i break a lot. i'll try not to break this one. i'll hold it carefully" },
        { tone: 'passive', t: "I like plan-making you.", r: "plan-making me is terrified. but trying. very hard. like a toddler on ice" },
        { tone: 'flirty', t: "Make more plans. With me.", r: "one plan at a time. i'm new at this. i've got one plan. it's you. it's a good plan" },
        { tone: 'risque', t: "Plan the bit where we don't leave bed.", r: "that bit's already planned. it's the bit i've planned the most. in detail" },
      ] },
      { tone: 'flirty', t: "A whole weekend with you sounds perfect.", r: "perfect. don't say perfect. say 'quite nice'. perfect is a lot of pressure", opts: [
        { tone: 'cold', t: "Quite nice, then.", r: "quite nice. thank you. much better. i can do quite nice. i can do quite nice for a weekend" },
        { tone: 'passive', t: "Okay. Quite nice.", r: "quite nice it is. it's going to be perfect. don't tell me i said that" },
        { tone: 'flirty', t: "Perfect. I'm saying perfect.", r: "ugh. fine. perfect. there. we both said it. now we have to make it perfect. no pressure" },
        { tone: 'risque', t: "Perfect, and we never leave the bed.", r: "ha. never leave the bed. that's a very short packing list. i like it" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: "after the season i'm stealing you for a weekend. not a promise. a threat. a nice threat. a maybe-threat",
    opts: [
      { tone: 'cold', t: "You won't, though.", r: "i might. i'm very unpredictable. that's the fun of me. i might even turn up", opts: [
        { tone: 'cold', t: "Prove it.", r: "ok. i'll prove it. in the winter. if i'm brave. i'm brave sometimes. at night" },
        { tone: 'passive', t: "I hope you do.", r: "you hope? oh no. i hope too. this is terrible. we're two hopers" },
        { tone: 'flirty', t: "Steal away.", r: "i will. i'm a very good thief. i stole your attention in about four seconds" },
        { tone: 'risque', t: "Steal me now, not later.", r: "now? i can't now. i'm in my pyjamas. ok i can now. give me twenty minutes" },
      ] },
      { tone: 'passive', t: "A maybe-threat?", r: "a threat with a maybe in it. very scary. very hopeful. i'm terrified of it", opts: [
        { tone: 'cold', t: "Sounds like a no.", r: "it's not a no. it's a maybe. maybe's awake. no's asleep. well. no's dozing" },
        { tone: 'passive', t: "A maybe works for me.", r: "you always take the maybe. you're very good at maybes. you're my favourite maybe-taker" },
        { tone: 'flirty', t: "I'll keep the weekend free.", r: "free. empty. waiting for me. that's lovely. that's terrifying. keep it free" },
        { tone: 'risque', t: "Threaten me in person.", r: "in person. tonight. a very physical threat. ok. you've talked me into it" },
      ] },
      { tone: 'flirty', t: "Steal me any time.", r: "any time. careful. i'll steal you at 3am. you'll wake up somewhere fun", opts: [
        { tone: 'cold', t: "Within reason.", r: "reason's no fun. but ok. within reason. reasonable stealing. small heists only" },
        { tone: 'passive', t: "I'd really like that.", r: "you'd like it. that's the problem. you like everything i suggest. i should suggest less" },
        { tone: 'flirty', t: "I'll come quietly.", r: "quietly. hm. not too quietly. i like a bit of noise. kidding. kidding. maybe" },
        { tone: 'risque', t: "Steal me tonight.", r: "tonight. that's not after the season. you're impatient. i love it. ok. tonight" },
      ] },
    ],
  },
  {
    id: 'fling-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: "3am: i think i'm falling for you. 9am: ignore the 3am text. 3am me is a liar. please ignore it. please don't ignore it",
    opts: [
      { tone: 'cold', t: "Done. Ignored.", r: "thank you. that's what i requested. it's also not what i wanted. i'm complicated" },
      { tone: 'passive', t: "Which one's true?", r: "both. neither. 3am me is honest. 9am me is scared. you get both. sorry" },
      { tone: 'flirty', t: "I'm keeping the 3am one.", r: "you can't. it's mine. ok. keep it. keep it somewhere i can't see it" },
      { tone: 'risque', t: "Tell me again at 3am. In person.", r: "in person. at 3am. that's when i'm most honest. and least sensible. ok" },
    ],
  },
  {
    id: 'fling-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: "i sent you something stupid last night. please delete it. please don't delete it. i'm a mess this morning",
    opts: [
      { tone: 'cold', t: "Already deleted.", r: "good. thank you. that's very helpful. i'm devastated. kidding. i'm fine. i'm devastated" },
      { tone: 'passive', t: "Don't stress over it.", r: "i'm worrying about it a lot. you're too calm. are you calm? be calm for both of us" },
      { tone: 'flirty', t: "I loved it. I'm not deleting it.", r: "you loved it. ok. i'm hiding under a duvet now. don't text back for an hour. text back" },
      { tone: 'risque', t: "Say it again tonight. In person.", r: "in person. tonight. ugh. you know i'll say it. i always say it after midnight" },
    ],
  },
  {
    id: 'fling-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: "3am text: you're the best thing that's happened to me in years. 9am text: lol 3am. lol. haha. don't",
    opts: [
      { tone: 'cold', t: "I'll pretend I didn't see it.", r: "thank you. you're so good at pretending. you're my favourite pretender" },
      { tone: 'passive', t: "The 3am one was sweet.", r: "sweet. ugh. it was sweet. i was sweet. i'll be terrible all day to balance it out" },
      { tone: 'flirty', t: "You're the best thing for me too.", r: "stop. we're both doing it now. at 9am. in daylight. this is a crisis" },
      { tone: 'risque', t: "Let's make tonight a 3am night.", r: "a 3am night. yes. that's the best kind. honesty. darkness. you. come over" },
    ],
  },
];
