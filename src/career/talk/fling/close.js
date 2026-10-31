// FLING - in person, stage close: seeing each other, never calling it anything. Tender at 3am, breezy by noon. Plain data, no imports.
export const DATA = [
  {
    id: 'fling-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "You were quiet with me last time. I hate quiet. It means thinking. Thinking means serious. This is still fun, right? Tell me it's still fun.",
    opts: [
      { tone: 'cold', t: "I don't know what it is.", r: "Don't say that. That's the scariest sentence in the language. Say fun. Say anything. Say sandwich.", opts: [
        { tone: 'cold', t: "Sandwich.", r: "Thank you. Sandwich. Perfect. Crisis over. We're fun again. I'll pretend I didn't see your face." },
        { tone: 'passive', t: "It's fun. Mostly.", r: "Mostly. I can live on mostly. Mostly's where I keep all my best things." },
        { tone: 'flirty', t: "It's more than fun, and you know it.", r: "Shh. Don't. Not out loud. Out loud makes it true. Keep it in your head, where it's safe." },
      ] },
      { tone: 'passive', t: "It's fun. Why?", r: "Just checking. Routine maintenance. Like your car. Little check-ups so nothing explodes. Nothing's exploding. Good.", opts: [
        { tone: 'cold', t: "Stop checking.", r: "I can't stop. It's a habit. Check, laugh, leave. I'm on check. You're very calming. Leave's a long way off." },
        { tone: 'passive', t: "We're fine. Promise.", r: "Don't promise. Promises make me twitchy. Say probably. Probably fine. Much nicer word." },
        { tone: 'flirty', t: "It's the most fun I've had.", r: "The most? That's a lot of fun. That's dangerous levels of fun. I'll allow it. For now." },
      ] },
      { tone: 'flirty', t: "It's always fun with you.", r: "Always is a big word. Big words make me nervous. But okay. Yes. It's fun with you too. Very fun. Too fun.", opts: [
        { tone: 'cold', t: "Too fun for you?", r: "Never. There's no such thing. Well, there might be. I'm testing it. You're the experiment." },
        { tone: 'passive', t: "Is that bad?", r: "It's not bad. It's just new. New is fun. New is also how I end up somewhere I didn't plan to be." },
        { tone: 'flirty', t: "Then stop worrying and kiss me.", r: "Bossy. Good. I like bossy from you. I'll stop worrying for one whole minute. Come here." },
        { tone: 'risque', t: "Then let's keep it fun all night.", r: "All night. That's the plan. That's always the plan. Somewhere with a door." },
      ] },
    ],
  },
  {
    id: 'fling-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "Hey, you. So, quick check-in. Purely admin. We're still having fun, yes? Nobody's catching anything? Feelings, colds, anything?",
    opts: [
      { tone: 'cold', t: "No feelings here.", r: "Good. Great. Perfect. That's exactly what I wanted to hear. Why did it sound so sad?", opts: [
        { tone: 'cold', t: "It didn't.", r: "It didn't. You're right. I imagined it. I imagine lots of things. Mostly you. No. I didn't say that." },
        { tone: 'passive', t: "Maybe a bit of a cold.", r: "A cold. Fine. Colds are fine. Colds go away. Feelings are the ones that stay for the weekend." },
        { tone: 'flirty', t: "Maybe one or two.", r: "One or two? Oh no. Okay. Keep them small. Keep them in a box. Don't feed them after midnight." },
      ] },
      { tone: 'passive', t: "Still fun. Very much.", r: "Very much. Good. Excellent. I'll file that under very much. It's a new folder. You made it.", opts: [
        { tone: 'cold', t: "Don't make folders.", r: "I make folders for everything. Admin's how I keep chaos tidy. You're tidy chaos. My favourite kind." },
        { tone: 'passive', t: "Are you having fun?", r: "Me? Always. Especially with you. That's the problem. Fun's meant to be spread around. I'm hoarding it." },
        { tone: 'flirty', t: "More fun every time.", r: "Every time. That's a lot of times. I've lost count. I never lose count. You're making me lose count." },
      ] },
      { tone: 'flirty', t: "What if I'm catching something?", r: "Then I'm the cure and the cause. Very efficient. Don't catch it too badly. I'm not good at nursing.", opts: [
        { tone: 'cold', t: "Fine, never mind.", r: "Good. Never mind's the best medicine. Never mind and early nights. Actually, not early nights." },
        { tone: 'passive', t: "Would that be so bad?", r: "It would be very bad. For me. For you, lovely, probably. For me, terrifying. Talk about something else." },
        { tone: 'flirty', t: "I'm catching you.", r: "Catching me? I'm very slippery. People try. They end up with a sleeve. You've got more than a sleeve." },
        { tone: 'risque', t: "Then let me show you how much fun.", r: "Show me. I'm a very visual learner. Somewhere quiet. Now-ish." },
      ] },
    ],
  },
  {
    id: 'fling-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "Hi, gorgeous. You've been sweet to me lately. Very sweet. Suspiciously sweet. This is still just fun, isn't it? Say yes.",
    opts: [
      { tone: 'cold', t: "Yes. Just fun.", r: "Just fun. Good. Wonderful. I love just fun. Why did you say it like that? Never mind. I love it.", opts: [
        { tone: 'cold', t: "Like how?", r: "Like you meant it. You meant it. That's good. That's what I asked for. Ugh. Why did I ask?" },
        { tone: 'passive', t: "Isn't that what you wanted?", r: "It's exactly what I wanted. It's what I always want. I'm getting what I want. That's the problem with getting." },
        { tone: 'flirty', t: "Just fun. With you. Always.", r: "Always. There it is again. Always and just fun in one sentence. You're very confusing. I like it." },
      ] },
      { tone: 'passive', t: "What if it isn't?", r: "Then I'd have to do something about it. I don't know what. Leave? Stay? Panic? Panic's my go-to.", opts: [
        { tone: 'cold', t: "Then don't panic.", r: "Okay. Not panicking. I'm the calmest person here. Look. Calm. My hands are steady. Hold them. See?" },
        { tone: 'passive', t: "I'll keep it fun.", r: "Thank you. You're so good at that. You keep it fun and I keep it light. We're a team. Not a couple. A team." },
        { tone: 'flirty', t: "What if it's better than fun?", r: "There's no such thing as better than fun. Fun is the top. Don't tell me there's a higher floor." },
      ] },
      { tone: 'flirty', t: "Say yes to me first.", r: "Yes. To you. To this. To tonight. Not to anything else. Yet. Ever. Probably. Yes.", opts: [
        { tone: 'cold', t: "That was a lot of words.", r: "It was. I panic in words. You've got a very panicky effect on me. A lovely panicky effect." },
        { tone: 'passive', t: "Okay. Fun it is.", r: "Fun it is. Thank you. You make it very easy. Too easy. That's the only complaint." },
        { tone: 'flirty', t: "You said yet.", r: "I didn't. I said ever. Ever. Okay, I said yet. Don't hold me to it. Hold me instead." },
        { tone: 'risque', t: "Yes to tonight is all I need.", r: "Then you've got it. Tonight, me, no plans, no labels. And a very late start tomorrow." },
      ] },
    ],
  },
  {
    id: 'fling-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "You were frosty last time, and I've been thinking. I've amended my rules. Amendment one: you can stay for coffee. Not breakfast. Coffee.",
    opts: [
      { tone: 'cold', t: "I don't need special rules.", r: "Too late, they're written. In biro. That's practically permanent for me. Most of my rules are pencil.", opts: [
        { tone: 'cold', t: "Rub it out, then.", r: "I can't. I tried. The biro's too good. It's the first permanent thing I've done in years." },
        { tone: 'passive', t: "Coffee's nice, I suppose.", r: "Coffee's very nice. It's a huge concession. Ask anyone who's been asked to leave before the kettle." },
        { tone: 'flirty', t: "I'll take the coffee.", r: "Small coffee. Very fast. Standing up. No toast. Toast is still banned. Toast is breakfast's gateway." },
      ] },
      { tone: 'passive', t: "Why the amendment?", r: "Because you're the first person I've wanted to see in daylight. A tiny bit of daylight. Through curtains.", opts: [
        { tone: 'cold', t: "Daylight's overrated.", r: "It is. I've always said that. But you look good in it. It's very inconvenient. You've ruined daylight." },
        { tone: 'passive', t: "That's really sweet.", r: "It's not sweet. It's an amendment. It's legal. It's paperwork. Don't make it sweet, I'll revoke it." },
        { tone: 'flirty', t: "I'll make the coffee.", r: "You'll make it? Oh no. That's domestic. That's domestic behaviour. I need to lie down. Not here." },
      ] },
      { tone: 'flirty', t: "Amendment one? There'll be more?", r: "Maybe. Don't get greedy. Amendments are rare. The last one was in... never. This is the first ever.", opts: [
        { tone: 'cold', t: "Don't go writing more.", r: "I won't. Promise. Probably. They keep happening. You keep happening. That's the problem." },
        { tone: 'passive', t: "What would amendment two be?", r: "I'm not saying. If I say it, I'll do it. Then I'm someone with two amendments. That's a different person." },
        { tone: 'flirty', t: "I'll earn amendment two.", r: "You'll try. I'll pretend not to notice. Then I'll write it down at 3am and deny it at noon." },
        { tone: 'risque', t: "Earn it tonight?", r: "Tonight. Mm. You might. You've got a very persuasive way about you. After midnight especially." },
      ] },
    ],
  },
  {
    id: 'fling-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Big news. I've amended my rules, because of you. Amendment one: you're allowed to stay for coffee. Not breakfast. Don't push it.",
    opts: [
      { tone: 'cold', t: "Just coffee?", r: "Just coffee. Do you know how big that is? People have waited years for coffee. Nobody's ever got coffee.", opts: [
        { tone: 'cold', t: "It's only coffee.", r: "It's not only coffee. It's the start of the morning. Mornings aren't my thing. I'm doing a morning. With you." },
        { tone: 'passive', t: "Coffee works.", r: "Coffee works. Good. I'll buy the good beans. Not too good. I don't want you thinking it's a big deal." },
        { tone: 'flirty', t: "I'll stay for all the coffee.", r: "All the coffee is a slippery slope. One cup. Then you leave. Then you come back. That's the deal." },
      ] },
      { tone: 'passive', t: "How's breakfast different?", r: "Breakfast's sitting down. Coffee's standing up. Standing up, you can still leave. Sitting down, you're living together.", opts: [
        { tone: 'cold', t: "That's a weird distinction.", r: "It's a very important distinction. It's kept me free for years. Free and slightly hungry." },
        { tone: 'passive', t: "Makes sense, in your way.", r: "Everything makes sense in my way. My way's a very specific way. You're getting fluent in it." },
        { tone: 'flirty', t: "I'll stand up for you.", r: "That's sweet and literal. Yes. Stand up for me. In my kitchen. With coffee. Then go." },
      ] },
      { tone: 'flirty', t: "You're getting soft on me.", r: "I'm not soft. I'm flexible. Like a good strategy. You'd know about strategy. This is a pit stop, not a garage.", opts: [
        { tone: 'cold', t: "Glad you're not soft.", r: "I'm very hard. Like a rock. A rock that lets you stay for coffee. A soft rock. Ugh." },
        { tone: 'passive', t: "A pit stop's good.", r: "A pit stop's very good. Fast. Efficient. Back out on track. Coffee and go." },
        { tone: 'flirty', t: "I like you soft.", r: "Don't. Soft is how I end up with someone's jumper. I don't want your jumper. Okay, I want your jumper." },
        { tone: 'risque', t: "Then let me stay tonight, for the coffee.", r: "For the coffee. Of course. Only for the coffee. Come here, you terrible liar." },
      ] },
    ],
  },
  {
    id: 'fling-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "I've got a present for you. Not a real one. A rule change. Amendment one: you're allowed to stay for coffee in the morning. You're welcome.",
    opts: [
      { tone: 'cold', t: "I don't drink coffee.", r: "You don't drink coffee? Oh no. Tea, then. Fine. Tea's an amendment to the amendment. This is getting out of hand.", opts: [
        { tone: 'cold', t: "Water's fine.", r: "Water. Okay. Water's the least committed drink. I respect it. You can stay for water." },
        { tone: 'passive', t: "Tea works.", r: "Tea works. I don't own tea. I'll have to buy tea. Do you know what buying tea means? It means I'm expecting you." },
        { tone: 'flirty', t: "I'd stay for you, not the coffee.", r: "Don't. That's what everyone says, and then they're asking about my weekend plans. Coffee. Just coffee." },
      ] },
      { tone: 'passive', t: "Is that a big deal for you?", r: "Enormous. Seismic. People will talk. Well. Nobody will know. I'll know. And Basil. Did I mention Basil? My plant.", opts: [
        { tone: 'cold', t: "It's coffee.", r: "It's not just coffee. It's a morning. With someone in it. I've never had someone in a morning before." },
        { tone: 'passive', t: "Then I'm honoured.", r: "You should be. Fully honoured. I've given out zero amendments in my life. You've got one. Treasure it." },
        { tone: 'flirty', t: "I'll make it worth the amendment.", r: "You will. I know you will. You make everything worth it. That's the terrible thing." },
      ] },
      { tone: 'flirty', t: "Best present ever.", r: "Isn't it just. I'm very generous when I feel like it. I feel like it with you. Often. Too often.", opts: [
        { tone: 'cold', t: "Don't go getting used to it.", r: "I won't. You won't. Neither of us. We're very unused to it. It's our thing." },
        { tone: 'passive', t: "Thank you. Really.", r: "Don't say really. Really means it matters. It doesn't matter. It's coffee. It matters a bit." },
        { tone: 'flirty', t: "I'll stay for coffee every morning.", r: "Every morning. That's a lot of mornings. That's a lot of coffee. I'll need a bigger cupboard." },
        { tone: 'risque', t: "I'll stay for more than coffee.", r: "More than coffee is a different amendment. That one's still being drafted. Help me write it." },
      ] },
    ],
  },
  {
    id: 'fling-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "I didn't miss you. Before you ask. You were off with me last time, I was busy, it was fine. I didn't think about you. Much. At all.",
    opts: [
      { tone: 'cold', t: "Good. I didn't miss you either.", r: "Good. Great. Neither of us missed anyone. Lovely. So why are you standing so close?", opts: [
        { tone: 'cold', t: "I'm not.", r: "You are. It's fine. I'm standing close too. For warmth. It's cold out. It's not cold out." },
        { tone: 'passive', t: "Old habits.", r: "Old habits. Yes. That's all it is. Habits. Nothing more. I've got loads. You're my newest one." },
        { tone: 'flirty', t: "Because I did miss you.", r: "Oh. Don't. You can't say that after I said I didn't. Now I look like the liar. I am the liar." },
      ] },
      { tone: 'passive', t: "Much?", r: "A normal amount. Tuesday, Wednesday, a bit of Friday. Thursday was very busy. I only thought of you twice on Thursday.", opts: [
        { tone: 'cold', t: "That's quite a lot.", r: "It's average. Average is very normal. I'm a very normal person. Except for this." },
        { tone: 'passive', t: "I thought about you too.", r: "Did you? How much? Don't tell me. Tell me. Not in numbers. Numbers make it real." },
        { tone: 'flirty', t: "I missed you every day.", r: "Every day? That's... very good. That's very much. I won't say it back. I'm thinking it back." },
      ] },
      { tone: 'flirty', t: "You're a terrible liar.", r: "I'm an excellent liar. Just not with you. You've ruined my best skill. I want compensation.", opts: [
        { tone: 'cold', t: "Then stop lying.", r: "I can't. It's all I've got. Lies and good timing. Take away the lies and I'm just timing." },
        { tone: 'passive', t: "It's fine to miss me.", r: "It's not fine. Rules say no. Fine, it's fine. A little. Don't tell anyone." },
        { tone: 'flirty', t: "I missed you too. A lot.", r: "Ugh. Okay. I missed you. There. Said. Gone. Don't make it a speech. Just come here." },
        { tone: 'risque', t: "Show me how much you didn't miss me.", r: "Show you? Oh, I will. Very convincingly. You'll be completely convinced I didn't miss you at all." },
      ] },
    ],
  },
  {
    id: 'fling-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "Hey. It's good to see you. It's been a while. Not that I counted. I don't count. I counted. Don't make a fuss.",
    opts: [
      { tone: 'cold', t: "It's not a thing.", r: "It's a count. Counting's maths. Maths isn't feelings. I'm safe.", opts: [
        { tone: 'cold', t: "Whatever you say.", r: "Whatever I say. You're so easy-going. It's lovely and it's maddening. Push back a bit." },
        { tone: 'passive', t: "How long was it?", r: "Long enough that I noticed. I don't notice. That's the problem. I'm noticing everything now." },
        { tone: 'flirty', t: "I counted too.", r: "Did you? Oh no. Two counters. That's how a relationship starts. Two people counting." },
      ] },
      { tone: 'passive', t: "It's good to see you too.", r: "Isn't it? It's always good. That's what's worrying. It's never just fine with you. It's always good.", opts: [
        { tone: 'cold', t: "Fine, then. It's fine.", r: "Fine's better. Fine I can work with. Good is a slope. Fine is flat. I like flat." },
        { tone: 'passive', t: "Why's that worrying?", r: "Because good things are the ones I miss. And I don't miss things. It's a rule." },
        { tone: 'flirty', t: "It's better than good.", r: "Don't. Better than good is great. Great is what people say before they ruin it. Just say good." },
      ] },
      { tone: 'flirty', t: "I counted the days.", r: "Stop. You're making me feel things. In the chest area. I'm not a chest-area person. Ask anyone.", opts: [
        { tone: 'cold', t: "Fine. I didn't count.", r: "Good. Thank you. That's much more manageable. I'll count for both of us. Secretly." },
        { tone: 'passive', t: "Is that so bad?", r: "It's not bad. It's just new. I'm a very old person when it comes to new. I resist it." },
        { tone: 'flirty', t: "I'll keep counting.", r: "Don't keep counting. Okay, keep counting. But don't tell me the number. Ever." },
        { tone: 'risque', t: "Let's make up for the days.", r: "Make up for them. All of them? That's a lot of days. We'd better start now." },
      ] },
    ],
  },
  {
    id: 'fling-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "You. There you are. I'm not going to say I missed you, because that's not something I say. But if I did say it, it'd be now.",
    opts: [
      { tone: 'cold', t: "Don't say it, then.", r: "I won't. I'm not. Look at me, not saying it. Very impressive restraint. Give me a medal.", opts: [
        { tone: 'cold', t: "Medal's in the post.", r: "Thank you. I'll put it on my wall. Next to my plant. No. The plant's on the windowsill. It doesn't matter." },
        { tone: 'passive', t: "It's okay not to say it.", r: "I know. It's just there, though. Sitting on my tongue. It's very uncomfortable. Talk about the weather." },
        { tone: 'flirty', t: "I'll say it for you.", r: "Don't you dare. If you say it, I'll have to say it, and then we're people who say it." },
      ] },
      { tone: 'passive', t: "Then say it.", r: "No. Absolutely not. I'll show you instead. Showing doesn't count. Showing's deniable. Come here.", opts: [
        { tone: 'cold', t: "I'd rather hear it.", r: "Course you would. I can't. Not yet. Maybe at 3am. 3am me says lots of things." },
        { tone: 'passive', t: "Showing works.", r: "Showing always works. That's why I do it. Words are a trap. Hands aren't." },
        { tone: 'flirty', t: "I'll take showing.", r: "Good. You're so easy. In the best way. The very best way." },
      ] },
      { tone: 'flirty', t: "I missed you. There. I said it.", r: "You said it. Wow. Okay. Good for you. Very brave. I'm not saying it back. I'm just going to hold your hand.", opts: [
        { tone: 'cold', t: "Pretend I didn't say it.", r: "Too late. It's in the air. It's floating. I'm going to pretend it's a balloon. A very nice balloon." },
        { tone: 'passive', t: "That's okay.", r: "It's okay. Yes. You don't need me to say it. You can tell. You can always tell. That's annoying." },
        { tone: 'flirty', t: "Hold it tighter, then.", r: "Tighter. Fine. That's the most anyone's held my hand in years. Don't tell anyone that either." },
        { tone: 'risque', t: "Hold more than my hand.", r: "Ha. More than your hand. Later. When it's dark and nobody's looking. I'll hold all of it." },
      ] },
    ],
  },
  {
    id: 'fling-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "You heard I was out with someone the other night. I can see it on your face. I never said it was only you. I don't do only. You know that.",
    opts: [
      { tone: 'cold', t: "I know. It's fine.", r: "Is it fine? You don't look fine. It's okay not to be. I just can't be the person who makes you fine.", opts: [
        { tone: 'cold', t: "It's fine. Really.", r: "Okay. I believe you. I don't. But I'll pretend. That's the best I can do. I'm sorry it's not better." },
        { tone: 'passive', t: "I just didn't expect it.", r: "That's on me. I should've said. I'm bad at saying. I'm good at doing and not saying. It's a flaw." },
        { tone: 'flirty', t: "I wish it was only me.", r: "You do, I know. I wish I was the kind of person who could make it only you. I'm not. Not yet. Maybe not ever." },
      ] },
      { tone: 'passive', t: "Do you want it to be?", r: "I don't know. I don't know how to want that. I've never wanted that. I'm out of my depth, and I'm a good swimmer.", opts: [
        { tone: 'cold', t: "Then I'll stop wanting it.", r: "Don't stop because of me. Stop because it's good for you. Is it good for you? I'm asking. Honestly." },
        { tone: 'passive', t: "Take your time.", r: "That's the kindest thing anyone's said to me. Take your time. I don't know what to do with time. I'll try." },
        { tone: 'flirty', t: "Want it with me.", r: "I'm trying. I'm genuinely trying. You're the only one I've ever tried with. That counts. It must count." },
      ] },
      { tone: 'flirty', t: "It hurts, you know.", r: "I know. I'm sorry. I never wanted it to hurt. I wanted it to be light. It's not light anymore, is it?", opts: [
        { tone: 'cold', t: "Forget it. I'm fine.", r: "You're not, and I'm not stupid. But okay. I'll let you be fine for now. Text me later. I'll answer." },
        { tone: 'passive', t: "Can we talk about it?", r: "Not now. Later. When it's dark and I'm braver. I promise I'll talk. I'll try to talk." },
        { tone: 'flirty', t: "I'd rather have some of you than none.", r: "That's the saddest, sweetest thing. Don't settle for some. Okay. Settle for some, a bit longer." },
        { tone: 'risque', t: "Then make tonight only me.", r: "Tonight's only you. Tonight's always been only you. Come here." },
      ] },
    ],
  },
  {
    id: 'fling-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "Can I be honest? I saw someone else last week. Just a night. I never said this was exclusive. But I hate how your face just went.",
    opts: [
      { tone: 'cold', t: "It's not my business.", r: "It sort of is. You're in it. We're in it. Whatever it is. I just don't know how to be only one person's.", opts: [
        { tone: 'cold', t: "It really isn't.", r: "Okay. Then I'll stop explaining. I'm terrible at explaining anyway. I'll just be here. Tonight." },
        { tone: 'passive', t: "Thanks for telling me.", r: "I'll always tell you. That's my one promise. I don't lie about the important stuff. Just the small stuff." },
        { tone: 'flirty', t: "I want to be your only one.", r: "I know. It's all over your face. I'm not there yet. Maybe I'll never be. I don't want to lie to you." },
      ] },
      { tone: 'passive', t: "Do you want it to stay that way?", r: "I don't know. That's the honest answer. Some days I want to be free. Some days I want to be yours. Today's a yours day.", opts: [
        { tone: 'cold', t: "I'll wait for a yours day, then.", r: "Please don't hang about for me. I'm a terrible bet. Live your life and let me catch up. If I can." },
        { tone: 'passive', t: "That's fair. I appreciate it.", r: "You're so fair. That's what makes it harder. If you shouted, I could leave. You don't shout." },
        { tone: 'flirty', t: "Then let today be a yours day.", r: "Okay. It's a yours day. I'm yours today. Whatever that means. I'm working it out." },
      ] },
      { tone: 'flirty', t: "It does hurt a bit.", r: "I know. I'm sorry. I don't want to hurt you. I just don't know how to be the other thing. The staying thing.", opts: [
        { tone: 'cold', t: "Let's not talk about it.", r: "Okay. Not now. Thank you. I know I owe you a proper conversation. I'll pay it. Late. With interest." },
        { tone: 'passive', t: "I'll be okay.", r: "You will. You're strong. Stronger than me. That's probably why I'm scared of you. In a good way." },
        { tone: 'flirty', t: "Stay with me tonight, then.", r: "Tonight. Yes. Tonight I can do. Tonight I'm all yours. Let's not think further than tonight." },
        { tone: 'risque', t: "Let me remind you why you come back.", r: "I know why I come back. I come back for you. Remind me anyway. I'm forgetful." },
      ] },
    ],
  },
  {
    id: 'fling-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "Don't be jealous. I know you heard I was out with someone. It was nothing. It's always nothing. You're the only something. Is that enough?",
    opts: [
      { tone: 'cold', t: "It's not enough.", r: "I know. I know it's not. I'm trying to give you more. I just don't know where I keep the more.", opts: [
        { tone: 'cold', t: "Then find it.", r: "I'm looking. Honestly. I'm turning out all my drawers. I'll find it, maybe. Don't give up yet." },
        { tone: 'passive', t: "I'll be patient.", r: "You're always patient. You're the most patient person I've ever been impatient with." },
        { tone: 'flirty', t: "You're my only something, too.", r: "Am I? That's terrifying. That's the best thing. I'm both. I'm terrified and happy. Hold my hand." },
      ] },
      { tone: 'passive', t: "What does the only something mean?", r: "It means the one I think about at 4am. It means the one I'd text first. It's not nothing.", opts: [
        { tone: 'cold', t: "It sounds like nothing.", r: "I know. I know it sounds like nothing. It's the most I've got. I'm sorry it's not more." },
        { tone: 'passive', t: "That's something, at least.", r: "It's a lot, for me. It's a lot for anyone who knows me. They'd be shocked. My friend Rio would be shocked." },
        { tone: 'flirty', t: "I'll take being your something.", r: "You're my something. You might be my everything. Don't tell me. I'll run. I'll come back." },
      ] },
      { tone: 'flirty', t: "I'm not jealous. Much.", r: "Much. Good. A little jealousy is flattering. A lot is a cage. A little's perfect. Like this.", opts: [
        { tone: 'cold', t: "Not at all, actually.", r: "Not at all? Ouch. Okay. I wanted a little. I'm complicated. You know that. I'm sorry." },
        { tone: 'passive', t: "I'm a bit jealous.", r: "A bit's honest. I like honest. You're the most honest person I know. I'd hate to hurt you. I'm trying not to." },
        { tone: 'flirty', t: "I'm jealous of everyone who sees you.", r: "Of everyone? Even my plant? He's very good-looking. No. You're the only one I come back to." },
        { tone: 'risque', t: "Make me forget them.", r: "Forget them. Easily. There's nobody to forget, really. Come with me. Let me prove it." },
      ] },
    ],
  },
  {
    id: 'fling-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "You were cool with me last time. I deserved it. Can I say something soft, quick, before I change my mind? You make me feel safe. That's it.",
    opts: [
      { tone: 'cold', t: "That's a lot coming from you.", r: "I know. I'm out of character. Don't let me do it often. I'll start wanting things.", opts: [
        { tone: 'cold', t: "Don't want things, then.", r: "Okay. I won't. I'll go back to wanting nights. Nights are simple. You're not simple." },
        { tone: 'passive', t: "I'm glad I do.", r: "I'm glad you do too. That's all. That's the whole speech. I'll take it back by noon. Don't remind me." },
        { tone: 'flirty', t: "You make me feel safe too.", r: "Stop. If we both feel safe, someone's going to want a holiday together. And then it's a suitcase." },
      ] },
      { tone: 'passive', t: "Why say it now?", r: "Because it's late and I'm brave, and in the morning I'll be breezy and annoying and pretend I didn't.", opts: [
        { tone: 'cold', t: "Then I'll pretend too.", r: "Thank you. You're good at pretending with me. It's our best duet. Not that we have duets." },
        { tone: 'passive', t: "I'm not letting you pretend.", r: "You will. You'll have to. I'll be very convincing. I'll wear sunglasses indoors." },
        { tone: 'flirty', t: "Say it again in the morning.", r: "In the morning? No. Mornings are for coffee. Remember the amendment. Coffee. Not confessions." },
      ] },
      { tone: 'flirty', t: "I'm glad you said it.", r: "Don't thank me. It's not a gift. It's a leak. I've sprung a leak. I'll get it fixed. Probably not.", opts: [
        { tone: 'cold', t: "Forget I heard it.", r: "Already forgotten. You're the best at that. That's why I can say things to you. You let them go." },
        { tone: 'passive', t: "I'll keep it safe.", r: "You will. That's what you do. You keep things safe. That's the frightening bit. I'm a thing." },
        { tone: 'flirty', t: "Leak more.", r: "Ugh. No. Yes. A bit. You're the only person I ever leak around. Don't make me a fountain." },
        { tone: 'risque', t: "Then let me keep you safe tonight.", r: "Tonight. Yes. Keep me safe. Keep me warm. Keep me very, very late." },
      ] },
    ],
  },
  {
    id: 'fling-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "It's late. Can I tell you a 3am thing, even though it isn't 3am? You're my favourite person. Not my favourite night. My favourite person.",
    opts: [
      { tone: 'cold', t: "That's very sweet.", r: "It is sweet. Disgustingly sweet. I'll be horrified at noon. Right now I mean it. Right now's all I've got.", opts: [
        { tone: 'cold', t: "Sweet's not like you.", r: "It's not. I'm off-script. You keep doing this to me. I need a new character." },
        { tone: 'passive', t: "I'll remember it.", r: "Remember it. At noon I'll deny it. Don't argue with noon-me. Noon-me's a lot more fun and a lot less honest." },
        { tone: 'flirty', t: "You're my favourite person too.", r: "Don't. Okay, yes. Do. Say it once. Then put it somewhere safe. Don't wave it around." },
      ] },
      { tone: 'passive', t: "Why does it have to be a 3am thing?", r: "Because 3am things don't count. Nobody holds you to them. If I said it at noon, I'd have to live with it.", opts: [
        { tone: 'cold', t: "That's a dodge, and you know it.", r: "It's a total cop-out. I'm a cop-out professional. I've made a career of it. Be patient with me." },
        { tone: 'passive', t: "I'll take it at any hour.", r: "Any hour. That's very flexible. You're very good at me. Better than I am." },
        { tone: 'flirty', t: "Say it at noon, then.", r: "At noon? In daylight? Where people can see? I'll try. One day. Not this one. One day, maybe." },
      ] },
      { tone: 'flirty', t: "I'll never let you take that back.", r: "You'll have to. I always take it back. That's my move. You'll get used to it. I'm sorry you'll have to.", opts: [
        { tone: 'cold', t: "Fine. Take it back.", r: "Thank you. Taken back. It's back in its box. But you saw the box. That's enough." },
        { tone: 'passive', t: "At least I heard it.", r: "You heard it. You'll always have heard it. That's sort of permanent. Oh no. I've done something permanent." },
        { tone: 'flirty', t: "Then I'll make you say it at noon.", r: "You'll try. You'll fail. Maybe you won't. Maybe noon's not so bad. Ask me tomorrow at noon." },
        { tone: 'risque', t: "Stay till noon and see.", r: "Stay till noon? Break the coffee amendment? Mm. Maybe. You're very persuasive in the dark." },
      ] },
    ],
  },
  {
    id: 'fling-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "Come here. No, closer. I want to tell you something while it's dark and you can't see my face. I think you're wonderful. That's all. Shh.",
    opts: [
      { tone: 'cold', t: "Are you okay?", r: "I'm perfect. I'm just honest at night. Daytime me's a liar. Night-time me's a mess. You get the mess.", opts: [
        { tone: 'cold', t: "You'll regret this tomorrow.", r: "Probably. I regret everything tomorrow. That's what tomorrow's for. Tonight's for meaning it." },
        { tone: 'passive', t: "I'm here.", r: "You're here. You're always here. How are you always here? I'm never anywhere. You make me want to be somewhere." },
        { tone: 'flirty', t: "I think you're wonderful too.", r: "Don't. Okay, do. Then we're two wonderfuls in the dark, and nobody has to see." },
      ] },
      { tone: 'passive', t: "Tell me more.", r: "That's it. That's all I've got. One wonderful. It took me three weeks to save it up. Don't spend it all.", opts: [
        { tone: 'cold', t: "Then don't say it.", r: "Too late. It's said. It's out there. It's in the room. I'll leave it there. I'll collect it in the morning." },
        { tone: 'passive', t: "That's more than enough.", r: "Is it? You're so easy to please. That's dangerous. I'll get lazy. I'll only say one nice thing a month." },
        { tone: 'flirty', t: "I'll treasure it.", r: "Treasure it quietly. Like a pressed flower. Don't show it to anyone." },
      ] },
      { tone: 'flirty', t: "You're wonderful too.", r: "Shh. One wonderful at a time. We'll take turns. You go Tuesdays. I'll go never. I'll go now. Now's fine.", opts: [
        { tone: 'cold', t: "Let's not get soppy.", r: "Agreed. No soppiness. I'm a hard, cool person. Who's lying on your arm. Very coolly." },
        { tone: 'passive', t: "I mean every word.", r: "You always mean it. That's your problem. And mine. Mostly mine." },
        { tone: 'flirty', t: "You're wonderful in every way.", r: "Every way? That's a lot of ways. Okay, that's quite a nice thing to say. Say it again in a whisper." },
        { tone: 'risque', t: "Let me show you how wonderful.", r: "Show me. Slowly. In the dark. I'll pretend I'm not blushing. You won't be able to see." },
      ] },
    ],
  },
  {
    id: 'fling-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "You've got that look again. The official look. You were cool with me last time, so maybe I'm wrong. Please tell me I'm wrong.",
    opts: [
      { tone: 'cold', t: "You're wrong.", r: "Thank goodness. Good. I panicked. My hands went cold. Look. Feel. Ice. Okay. I'm fine now.", opts: [
        { tone: 'cold', t: "Relax. Nothing's changing.", r: "Nothing's changing. My favourite three words. Well. Two and a contraction. Thank you." },
        { tone: 'passive', t: "Would it be so terrible?", r: "Yes. No. I don't know. I've never tried it. Everything I haven't tried feels terrible from outside." },
        { tone: 'flirty', t: "One day, though?", r: "One day. Maybe. Possibly. Don't put it in the calendar. Write it in steam on a mirror. It'll fade." },
      ] },
      { tone: 'passive', t: "What if I'm not wrong?", r: "Then I'll have to say no. Kindly. I don't want to say no to you. I just don't know how to say the other word.", opts: [
        { tone: 'cold', t: "Then say no.", r: "No. There. Kindly. I'm sorry. It's not you. It's very much me. It's always been me." },
        { tone: 'passive', t: "You don't have to answer now.", r: "Thank you. I won't. I'll answer in a year. Or never. Never's a lot more likely. I'm sorry." },
        { tone: 'flirty', t: "I'll ask again when you're ready.", r: "You might be asking for a long time. You'd look lovely asking, though. Keep the face." },
      ] },
      { tone: 'flirty', t: "I want us to be official.", r: "There it is. I knew it. I can't. Not because of you. Because of me. Because I'd ruin it the second it had a name.", opts: [
        { tone: 'cold', t: "Fine. Drop it.", r: "I'm sorry. I really am. I'm not worth the asking. Don't stop being nice to me, though. Please." },
        { tone: 'passive', t: "Why would you ruin it?", r: "Because that's what I do. I make things official and then I make them over. You're too good to be an over." },
        { tone: 'flirty', t: "Then let's ruin it together.", r: "Ha. That's the most romantic way anyone's ever asked. Still no. A very fond no. Maybe one day." },
        { tone: 'risque', t: "Then be unofficially mine tonight.", r: "Unofficially. That I can do. That I'm very good at. Come here, unofficial." },
      ] },
    ],
  },
  {
    id: 'fling-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "Don't ask what I think you're about to ask. Please. I can feel it coming. It's in your shoulders. Ask me anything else. Ask where I'm from.",
    opts: [
      { tone: 'cold', t: "I wasn't going to ask anything.", r: "You were. You were going to ask if we're a couple. I love that you want to. I can't say yes.", opts: [
        { tone: 'cold', t: "Then I won't.", r: "Thank you. You're so kind to me. Kinder than I am to you. I know that. I do know that." },
        { tone: 'passive', t: "Why can't you?", r: "Because the second it's real, I start counting down. I don't want to count down with you. I want to keep counting up." },
        { tone: 'flirty', t: "Maybe one day?", r: "Maybe one day. One day's very far away. It's a nice place to keep things. Let's keep it there." },
      ] },
      { tone: 'passive', t: "I want to call you mine.", r: "I know. I can tell. You'd be so good at it. I'd be awful. I'd be the kind who vanishes on anniversaries.", opts: [
        { tone: 'cold', t: "Fine. I won't call you anything.", r: "Call me something. Call me trouble. Call me your favourite mistake. Don't call me yours." },
        { tone: 'passive', t: "Then what are we?", r: "We're this. This is good. Can't this be enough a bit longer? I'm asking. I'm really asking." },
        { tone: 'flirty', t: "I'll wait till you're ready.", r: "Don't. I don't want to be a waiting room. Live. Have fun. And then come back to me. I'll be here." },
      ] },
      { tone: 'flirty', t: "Be my partner. Officially.", r: "Oh. You asked. You actually asked. I'm going to say no, and I want you to know it's the hardest no I've ever said.", opts: [
        { tone: 'cold', t: "Then I'm done asking.", r: "That's fair. You should be. I'd be done with me. Please don't be done with me just yet." },
        { tone: 'passive', t: "I can live with that. For now.", r: "For now. Yes. For now's good. For now's honest. Thank you for for now." },
        { tone: 'flirty', t: "Not yet, then. Not no.", r: "Not yet. Okay. Not yet's the most I've ever given anyone. I'm handing it to you. Be careful with it." },
        { tone: 'risque', t: "Then let me change your mind tonight.", r: "You can try. You'll have a lot of fun trying. I'll have a lot of fun being tried." },
      ] },
    ],
  },
  {
    id: 'fling-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "Okay, I know that face. That's your serious face. You're about to ask me to be official. Kiss me instead. It's much nicer. I promise.",
    opts: [
      { tone: 'cold', t: "I'd rather have an answer.", r: "The answer's no. A soft no. A no that wishes it was a yes. But a no. Kiss me anyway?", opts: [
        { tone: 'cold', t: "No kiss, then.", r: "That's fair. I'd refuse too. I'm sorry. I really am. I'm going to stand here feeling terrible." },
        { tone: 'passive', t: "Is it ever going to be yes?", r: "I don't know. I really don't. If it ever is, it'll be you. That's not a promise. It's a hope." },
        { tone: 'flirty', t: "I'll kiss you. And ask again later.", r: "Deal. Ask me later. I'll still say no. Later still. Maybe you'll catch me on a good night." },
      ] },
      { tone: 'passive', t: "Why are you so scared of it?", r: "Because people leave. And if I'm official, it's a proper leaving, with a story. Unofficial, it's just a night that didn't happen.", opts: [
        { tone: 'cold', t: "I'm not going anywhere.", r: "Everyone says that. Everyone goes somewhere. I go first. That's my whole trick. I'm sorry." },
        { tone: 'passive', t: "I understand.", r: "Do you? Then you understand me better than I do. That's not fair. Stop being better than me." },
        { tone: 'flirty', t: "I'd never make it a story.", r: "You wouldn't. That's the thing. You're the only one I believe. And I still can't. I'm a mess." },
      ] },
      { tone: 'flirty', t: "Fine. Kiss first. Question after.", r: "Question never. Kiss now. Okay. Question later. Answer no. Kiss again. That's my favourite order.", opts: [
        { tone: 'cold', t: "Actually, question first.", r: "Then no. Gently. I'm sorry. I'm here, though. I'm still here. That's not nothing." },
        { tone: 'passive', t: "You can't dodge it forever.", r: "I can try. I've dodged it for years. I'm very good at dodging. You're very good at aiming." },
        { tone: 'flirty', t: "I'll take the kiss.", r: "Good. Take it. It's yours. That bit's yours. The rest is complicated." },
        { tone: 'risque', t: "Kiss me somewhere more private.", r: "Somewhere private. Now you're talking. That's a question I always say yes to." },
      ] },
    ],
  },
  {
    id: 'fling-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "You were cold with me last time, and I hated it. I hate that I hated it. Come to mine. Let me warm you up. Or I'll sulk all night.",
    opts: [
      { tone: 'cold', t: "I'm not coming tonight.", r: "Not tonight. Okay. I'll respect it. I'll sulk respectfully. In the corner. With my coat on.", opts: [
        { tone: 'cold', t: "Sulk, then.", r: "I will. Professionally. I've had years of practice. You'll get a text at 2am that just says \"hm\"." },
        { tone: 'passive', t: "Another night, though.", r: "Another night. Okay. I'll hold you to another night. I'll hold you to it very tightly." },
        { tone: 'flirty', t: "Ask me again in a minute.", r: "A minute. I'll count. I'm counting. That was a minute. Coming home with me?" },
      ] },
      { tone: 'passive', t: "You could warm me up here.", r: "Here? In front of everyone? You're bolder than me. That's new. I don't know if I like it. I like it.", opts: [
        { tone: 'cold', t: "Fine, nowhere, then.", r: "Nowhere. Okay. Shame. Nowhere's very cold. I'll be thinking about somewhere all the way home." },
        { tone: 'passive', t: "Just hold my hand for now.", r: "Holding hands. Look at us. Very respectable. Very warm. Very not where this is going." },
        { tone: 'flirty', t: "Then let's go somewhere.", r: "Let's go. Now. Before either of us gets sensible. Sensible's coming. I can hear it." },
        { tone: 'risque', t: "I want more than warm.", r: "More than warm. Hot, then. Mm. Somewhere with a lock and very thick curtains." },
      ] },
      { tone: 'flirty', t: "I'd love to come home with you.", r: "Then come. Now. Don't overthink it. I'm not overthinking it. I'm just thinking about you, all over.", opts: [
        { tone: 'cold', t: "Maybe not, actually.", r: "Maybe not. Ugh. You're doing it to me. The pull-back. That's my move. You've learnt from the best." },
        { tone: 'passive', t: "Just for a little while.", r: "A little while. I know what that means with us. It means three in the morning. That's fine." },
        { tone: 'flirty', t: "Lead the way, trouble.", r: "Following you is my favourite thing. Leading you's a close second. Come on." },
        { tone: 'risque', t: "Then let's not wait.", r: "Not wait. My favourite plan. Taxi. Now. My hand. Your hand. Nobody's business but ours." },
      ] },
    ],
  },
  {
    id: 'fling-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "I've been thinking about you all day. In ways that aren't very helpful for my concentration. Let's get out of here. Mine or yours?",
    opts: [
      { tone: 'cold', t: "I need an early night.", r: "An early night. With me, that's a contradiction. I'll let you have one. Just one. A cold one.", opts: [
        { tone: 'cold', t: "Night, then.", r: "Goodnight. Dream about me. Or don't. I'll know either way. I always know." },
        { tone: 'passive', t: "Tomorrow, maybe.", r: "Tomorrow. Okay. I'm holding you to tomorrow. Tomorrow at eleven. Late's my early." },
        { tone: 'flirty', t: "Ask me nicely.", r: "Nicely? Please. Pretty please. With a ridiculous face. There. That's as nice as I get." },
      ] },
      { tone: 'passive', t: "What kind of ways?", r: "The kind I'm not saying out loud in front of people. The kind with curtains drawn. You know.", opts: [
        { tone: 'cold', t: "Keep them to yourself.", r: "I'll try. They're very loud thoughts. They'll keep me up. You keep me up. Literally and otherwise." },
        { tone: 'passive', t: "Tell me in private.", r: "In private. Yes. Excellent idea. I'll whisper. I'm a very good whisperer. Very detailed." },
        { tone: 'flirty', t: "I know those ways.", r: "You do. You really do. Ugh. You're the only one who knows them that well. Come on." },
        { tone: 'risque', t: "Let me be very unhelpful to your concentration.", r: "Ha. Please do. My concentration's overrated. Yours is, too, tonight." },
      ] },
      { tone: 'flirty', t: "Mine's closer, actually.", r: "Yours? Bold. A home game. I like an away game. Fine. Yours. I'll be very polite to your furniture.", opts: [
        { tone: 'cold', t: "On second thought, separately.", r: "Separately. Okay. That's very sensible. You're very sensible. It's very annoying. Goodnight." },
        { tone: 'passive', t: "For an hour or two.", r: "An hour or two. I'll pretend I believe that. You'll pretend you believe it too." },
        { tone: 'flirty', t: "I'll show you round.", r: "The tour. Mm. Start with the important rooms. Skip the kitchen. No coffee yet. Coffee's for the morning." },
        { tone: 'risque', t: "Skip the tour.", r: "Skip the tour. Yes. Straight to the end. That's my favourite kind of tour." },
      ] },
    ],
  },
  {
    id: 'fling-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "You look incredible tonight. I'm not even pretending to be subtle. Come home. With me. Now. I'll be good. I'll be very, very bad.",
    opts: [
      { tone: 'cold', t: "I'm not in the mood.", r: "Not in the mood. Okay. That's allowed. I'll be in the mood for both of us. Quietly. Over here.", opts: [
        { tone: 'cold', t: "Be in it over there, then.", r: "Ha. Fine. Over here. In my mood. Alone. Thinking about you. This is your fault." },
        { tone: 'passive', t: "Maybe in a bit.", r: "In a bit. A bit's lovely. I'll wait a bit. I'll be a very good waiter for a bit." },
        { tone: 'flirty', t: "Convince me.", r: "Convince you? I don't do speeches. I do eye contact. Look at me. There. Convinced?" },
      ] },
      { tone: 'passive', t: "Good or bad? Pick one.", r: "Bad. Definitely bad. Good's for the daytime. You've never seen me in the daytime. Lucky you.", opts: [
        { tone: 'cold', t: "Neither, tonight.", r: "Neither. Okay. I'll be nothing. A neutral friend. With very un-neutral thoughts." },
        { tone: 'passive', t: "A bit of both, then.", r: "Both. Smart. Good at the door, bad on the sofa. I like a compromise." },
        { tone: 'flirty', t: "Bad. Definitely bad.", r: "Good choice. The best choice. Come on, then. Coat. Door. Very bad decisions. In that order." },
        { tone: 'risque', t: "Bad. All night.", r: "All night bad. Yes. I accept. I'll be terrible. You'll love it. Fade out on us." },
      ] },
      { tone: 'flirty', t: "I'm already coming.", r: "Already? Look at you. Keen. Very keen. I love keen. Keen's my favourite flavour.", opts: [
        { tone: 'cold', t: "Kidding. I'm staying here.", r: "Kidding? That was cruel. I like it. I'm going to get you back for that. Later. In private." },
        { tone: 'passive', t: "Give me five minutes.", r: "Five minutes. I'll count. I always count with you. Four and a half." },
        { tone: 'flirty', t: "Hold my hand all the way there.", r: "All the way. Okay. That's very sweet. That's very soft. Then very not soft. Come on." },
        { tone: 'risque', t: "I can't keep my hands off you.", r: "Then don't. Not here, though. Hold out till the door. Then all bets are off." },
      ] },
    ],
  },
  {
    id: 'fling-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "You've been quiet with me. I know why. Can I give you something? Not a promise. A maybe. After the season. Maybe then I could try.",
    opts: [
      { tone: 'cold', t: "I don't want a maybe.", r: "I know. Maybes are cheap. I'm sorry I can't afford anything better. It's what I've got.", opts: [
        { tone: 'cold', t: "Then keep it.", r: "I'll keep it. In my pocket. In case you change your mind. You might. I hope you might." },
        { tone: 'passive', t: "What would try mean?", r: "A weekend. Then another one. Maybe a toothbrush. Not a drawer. A toothbrush is a start." },
        { tone: 'flirty', t: "I'll take the maybe. For now.", r: "For now. That's all I've got too. For now and a maybe. Together we've got a whole sentence." },
      ] },
      { tone: 'passive', t: "Why after the season?", r: "Because then you'll be free. And I'll have had time to get used to the idea. It's a very big idea for me.", opts: [
        { tone: 'cold', t: "That's an excuse.", r: "It might be. I don't know. I genuinely don't know. I'm not lying to you. I'm lying to me." },
        { tone: 'passive', t: "That's fair.", r: "You always say fair. You're too fair to me. Someone should be unfair to me. Not you, though." },
        { tone: 'flirty', t: "I'll hold you to that.", r: "Hold me lightly. I bruise. Hold me to it lightly. And remind me in the winter." },
      ] },
      { tone: 'flirty', t: "I'd love that.", r: "Don't love it yet. It's a maybe. Maybes break. But if it doesn't break, I'd love it too. Shh.", opts: [
        { tone: 'cold', t: "Actually, forget the maybe.", r: "I get it. I'd never mind me too. I'm sorry. I'll still be here. Maybe after the season. Maybe." },
        { tone: 'passive', t: "We'll see.", r: "We'll see. That's my line. You keep pinching my lines. Soon I'll have nothing left but the truth." },
        { tone: 'flirty', t: "I'll wait for after the season.", r: "Don't wait too hard. Live. Race. Win. Then, in the winter, ask me again. I might surprise us both." },
        { tone: 'risque', t: "Then give me a preview tonight.", r: "A preview. Ha. I can do previews. Very good previews. The full show's still in rehearsal." },
      ] },
    ],
  },
  {
    id: 'fling-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "I was thinking. When the season's over, and things are quieter. Maybe we could see what this is. Properly. Maybe. I'm not promising.",
    opts: [
      { tone: 'cold', t: "You always say maybe.", r: "I do. It's the only word I trust. Yes breaks. No hurts. Maybe just waits. I'm sorry I'm like this.", opts: [
        { tone: 'cold', t: "Then don't say anything.", r: "Okay. I'll be quiet. That's the hardest thing for me. I'll do it for you." },
        { tone: 'passive', t: "I know you mean it, though.", r: "I do mean it. I mean it as much as I can mean anything. That's more than I've ever meant it." },
        { tone: 'flirty', t: "I'll take every maybe you've got.", r: "That's lovely. I've got loads. I'll give you the best ones. The ones that might come true." },
      ] },
      { tone: 'passive', t: "What would properly look like?", r: "I don't know. Meeting your friends? A whole Sunday? I've never done a whole Sunday. They seem very long.", opts: [
        { tone: 'cold', t: "Sundays aren't so bad.", r: "They're terrible. They're endless. But maybe with you they'd be shorter. Or longer, in a nice way." },
        { tone: 'passive', t: "We'd work it out.", r: "We would. You're good at working things out. I'm good at being worked out. That's a team." },
        { tone: 'flirty', t: "A whole Sunday with you sounds perfect.", r: "Perfect. Don't say perfect. Okay. It sounds quite nice. That's my perfect." },
      ] },
      { tone: 'flirty', t: "I'd like to try. Properly.", r: "I know. I can tell you would. I want to want it as much as you do. I'm getting there. Slowly. Like a bad wifi signal.", opts: [
        { tone: 'cold', t: "Don't string me along.", r: "I'm not. I swear I'm not. I'm just slow. I've never done this. I'm sorry if it feels like a string." },
        { tone: 'passive', t: "Slowly's fine.", r: "Slowly's fine. Thank you. Slowly's the only speed I've got for this. Fast for everything else." },
        { tone: 'flirty', t: "I'll wait for the signal.", r: "One bar. Two bars. Maybe three by winter. Don't hang up." },
        { tone: 'risque', t: "Let's practise properly tonight.", r: "Practise. Yes. Practise makes perfect. We're going to be very, very good at this." },
      ] },
    ],
  },
  {
    id: 'fling-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "You know what I've been thinking? Winter. When there's no racing. I could see you on a Sunday. In daylight. Imagine. Me, in daylight.",
    opts: [
      { tone: 'cold', t: "I can't imagine it.", r: "Neither can I. That's why it's exciting. It's a whole new country. With brunch. I hear there's brunch.", opts: [
        { tone: 'cold', t: "It won't happen.", r: "It might not. You're right not to count on it. But I'm thinking about it. That's new. That's for you." },
        { tone: 'passive', t: "Try imagining it.", r: "I am. You're making coffee. I'm pretending not to watch. It's very domestic. It's quite nice." },
        { tone: 'flirty', t: "I'll show you daylight.", r: "You'll have to be patient. I squint. I complain. But I'd go. For you. I'd squint for you." },
      ] },
      { tone: 'passive', t: "Are you serious?", r: "Serious is a strong word. Hopeful's better. I'm hopeful. Is that okay? It feels a bit naked.", opts: [
        { tone: 'cold', t: "Don't get my hopes up.", r: "I won't. I'm terrible at getting things up. Apart from your heart rate. That's my speciality." },
        { tone: 'passive', t: "Hopeful's okay.", r: "Hopeful's okay. Good. You make hopeful feel okay. Nobody's managed that before." },
        { tone: 'flirty', t: "Hopeful looks good on you.", r: "Does it? I've never worn it. It's a bit tight. I'll wear it a bit longer for you." },
      ] },
      { tone: 'flirty', t: "Me and you in daylight. I'd love that.", r: "I know. You'd love it so much. That's what scares me. Your face would be all lit up. Mine too.", opts: [
        { tone: 'cold', t: "Let's not plan it.", r: "Thank you. No plans. Plans jinx things. Let's just think it, quietly. Separately. Together." },
        { tone: 'passive', t: "We'll see in winter.", r: "That's a very good line. I'll write it down. I'll lose it. I'll remember." },
        { tone: 'flirty', t: "I'll count the days to winter.", r: "Don't count too loudly. Winter might hear and decide not to come. Count quietly." },
        { tone: 'risque', t: "Daylight can wait. Tonight can't.", r: "Tonight can't. Agreed. Winter's ages away. Tonight's right here. So are you." },
      ] },
    ],
  },
  {
    id: 'fling-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "We need to talk. Not a big talk. A small one. I'm not going to be your person. I can be your favourite bad idea. Is that enough for you?",
    opts: [
      { tone: 'cold', t: "I don't know.", r: "That's honest. I'd rather honest than kind. You can be both. You usually are. Take your time.", opts: [
        { tone: 'cold', t: "Maybe it isn't.", r: "Then I'll understand. I won't like it. I'll understand. You deserve someone who stays for breakfast." },
        { tone: 'passive', t: "Give me time to think.", r: "All the time you need. I'll be here. I'm always somewhere. Usually loud. Usually late. Here." },
        { tone: 'flirty', t: "You're more than a bad idea.", r: "Don't. You'll make me cry, and then you'll have seen me cry, and then we're in a relationship." },
      ] },
      { tone: 'passive', t: "Why can't you be my person?", r: "Because I don't know how. Nobody taught me. I learnt leaving very young. I'm superb at it. You make me want to unlearn it.", opts: [
        { tone: 'cold', t: "Then don't bother trying.", r: "I will bother. I'm bothering now. This is me bothering. It's very uncomfortable. I'm doing it for you." },
        { tone: 'passive', t: "I can wait while you learn.", r: "Don't wait. Live alongside. That's different. Walk next to me. I'll catch up. Maybe." },
        { tone: 'flirty', t: "Then I'll teach you.", r: "You'll teach me. Okay. I'm a terrible student. I skip classes. I'll come to yours, though." },
      ] },
      { tone: 'flirty', t: "Being your bad idea is enough.", r: "Is it? Really? You'd say that. You're too kind to me. I'll try to be the best bad idea you've ever had.", opts: [
        { tone: 'cold', t: "For now, anyway.", r: "For now. Yes. Thank you for being honest. For now is what I've got. For now is good." },
        { tone: 'passive', t: "Just don't disappear on me.", r: "I'll disappear. I'll come back. I always come back to you. That's the most I can promise. For me, that's huge." },
        { tone: 'flirty', t: "My favourite bad idea, always.", r: "Always. You said always. I'm letting it slide. Tonight it slides. Always. Ugh. Come here." },
        { tone: 'risque', t: "Then be my bad idea tonight.", r: "Tonight and probably tomorrow. And maybe the night after. Look at me, planning. You've ruined me." },
      ] },
    ],
  },
  {
    id: 'fling-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "I want to be fair to you. I'm not the staying kind. I want to be, a bit, with you. But I'm not, yet. Can you be happy with what I am?",
    opts: [
      { tone: 'cold', t: "I'm not sure I can.", r: "That's okay. That's honest. I'd rather you were honest than stuck. If you need to go, go. I'll miss you. Quietly.", opts: [
        { tone: 'cold', t: "Then maybe I should go.", r: "Maybe you should. I'd understand. I'd hate it. I'd hate it so much. I'd understand." },
        { tone: 'passive', t: "I'll give it a go.", r: "Try. That's all I'm doing too. Two people trying. That's not nothing. That's almost something." },
        { tone: 'flirty', t: "I'm happy with you.", r: "Are you? Even with all the leaving? You're braver than me. You're the bravest person I know." },
      ] },
      { tone: 'passive', t: "What are you, then?", r: "I'm fun. I'm late. I'm soft at 3am and hard at noon. I'm yours on Fridays and nobody's on Mondays. That's me.", opts: [
        { tone: 'cold', t: "That's not enough.", r: "I know. I'm sorry. It's what's on offer. I wish I had more on the menu." },
        { tone: 'passive', t: "That's quite a lot, actually.", r: "Is it? When you say it, it sounds like plenty. When I say it, it sounds like a warning." },
        { tone: 'flirty', t: "Then I'll take every Friday.", r: "Every Friday. Okay. That's a deal. And maybe a Saturday. Don't get greedy. Get a bit greedy." },
      ] },
      { tone: 'flirty', t: "I'm happy with whatever you are.", r: "You'd say that tonight. And I believe you now. Tomorrow I'll worry. But now I believe you. Thank you.", opts: [
        { tone: 'cold', t: "For now, at least.", r: "For now. That's my favourite word, and it's yours now too. We share a word. Isn't that terrible?" },
        { tone: 'passive', t: "Just be honest with me.", r: "Always. That's the one thing I can promise. I'll never lie about the leaving. Only about how much I like you." },
        { tone: 'flirty', t: "Even the leaving.", r: "Even the leaving. Okay. You're too good. I'll leave a bit less. For you. That's a start." },
        { tone: 'risque', t: "Then let's stop talking and be what we are.", r: "What we are. Yes. Let's be it. Loudly. Quietly. Late. Come here." },
      ] },
    ],
  },
  {
    id: 'fling-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "Okay, here's the truth. I'm never going to be anyone's other half. But if I ever were, it'd be yours. Is being my favourite bad idea enough?",
    opts: [
      { tone: 'cold', t: "It has to be, doesn't it?", r: "It doesn't have to be. You're allowed to want more. I just can't give it. I wish I could. I really wish.", opts: [
        { tone: 'cold', t: "Then I'll want less.", r: "Don't want less for me. Want what you want. I'll be over here, wanting you to have it." },
        { tone: 'passive', t: "I'll make it enough.", r: "You will. You make everything enough. That's your magic. I'm just the trouble you add it to." },
        { tone: 'flirty', t: "It's more than enough.", r: "More than enough. Okay. That's the nicest thing anyone's said about the least I can do." },
      ] },
      { tone: 'passive', t: "What if I want more one day?", r: "Then ask me one day. Maybe one day I'll have more. I'm hoping I will. Hope's new for me. You did that.", opts: [
        { tone: 'cold', t: "I probably will.", r: "I know. And I might not be there. I'm sorry. I'll be honest when I know. I'll always be honest." },
        { tone: 'passive', t: "I'll ask one day.", r: "Ask me one day. Ask in a year. Ask when I've gone dull. I won't. Ask anyway." },
        { tone: 'flirty', t: "Then I'll be patient.", r: "Patient. You're always patient. It's the most attractive thing about you. Don't tell anyone I said that." },
      ] },
      { tone: 'flirty', t: "My favourite bad idea is perfect.", r: "Perfect. Wow. Okay. You've ruined perfect for everyone else. It's only you now. Try to stay humble.", opts: [
        { tone: 'cold', t: "Just don't break my heart.", r: "I'll try very hard not to. I'll be very careful. I'm clumsy, though. Hold it yourself, just in case." },
        { tone: 'passive', t: "We'll see where it goes.", r: "We'll see. That's us. That's our whole thing. We'll see. I like that we'll see." },
        { tone: 'flirty', t: "If I'm yours, even a little, I'm happy.", r: "You're more than a little. You're the most anyone's had. Don't spend it all at once." },
        { tone: 'risque', t: "Then let's be a bad idea tonight.", r: "The best bad idea. Come on, then. Tonight's ours. And tomorrow I'll pretend it wasn't." },
      ] },
    ],
  },
];
