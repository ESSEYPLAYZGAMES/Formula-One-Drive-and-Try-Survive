// Emotional - in person, stage 'warm' (getting closer). Slots 1..9, each in a cold / passive / flirty opening mood.
// Arc: 1 butterflies admitted - 2 the playlist - 3 the hill and the stars - 4 the note on the fridge - 5 a pang of
// jealousy, said honestly - 6 tiny anniversaries (a pigeon joke told now, for the list) - 7 the paper star - 8 nearly a kiss - 9 'I want to
// be yours'. Risque here flusters them: their heart can't keep up.
export const DATA = [
  // ------------------------------------------------------------------------------------------------ slot 1: butterflies
  { id: 'emotional-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "Hi... last time ended so cold I nearly stayed home. But I'd rather be brave than wonder. I think about you more than I say.",
    opts: [
      { tone: 'cold', t: "Maybe say less, then.", r: "Oh. Okay... I gave you something real and you handed it back. I'll be quiet, if that's what you want.", opts: [
        { tone: 'cold', t: "It is.", r: "Then I'll go quiet. I won't go numb, though. I'll feel this all the way home. Just so you know." },
        { tone: 'passive', t: "Sorry. I'm bad at this. What do you think about?", r: "Your laugh. How serious you look on the telly before the lights. Whether you think of me at all. Mostly that last one." },
        { tone: 'flirty', t: "Say more. I was scared you didn't.", r: "Scared? You? Oh... we've both been scared of the same thing. That's almost funny. My hands have gone all trembly." },
      ] },
      { tone: 'passive', t: "Same. More often than I expected.", r: "You do? Really? Say that again, slower. I'm trying to memorise your face while you say it.", opts: [
        { tone: 'cold', t: "Once is enough.", r: "Okay. Once. I'll make once last a long time. I wish you'd let me have it twice, though. It mattered." },
        { tone: 'passive', t: "I think about you too. There. Slower.", r: "Thank you. I'm going to write that down tonight, word for word. You've no idea how long I've hoped." },
        { tone: 'flirty', t: "Mostly at night. When I should be sleeping.", r: "At night? Me too. Three in the morning, every time. We've been awake together without knowing. Oh, that's lovely." },
      ] },
      { tone: 'flirty', t: "More than you say? Then you've been holding out on me.", r: "I have. When I say it all at once, people run. You're not running. Are you running? You're smiling.", opts: [
        { tone: 'cold', t: "Give me a reason not to.", r: "A reason? I thought I was one. Oh... okay. That landed hard. I'm going to stand very still and hurt for a bit." },
        { tone: 'passive', t: "I'm not running. Tell me.", r: "I think about your hands on the wheel. Your voice saying my name. Whether this is real. That's just the start." },
        { tone: 'flirty', t: "Not running. Moving closer, actually.", r: "Closer. Oh. My heart's pounding so hard you must hear it. You do. You're grinning. I love that grin." },
      ] },
    ] },
  { id: 'emotional-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "Can I be honest? I've got butterflies. Proper ones. Every time I see you, they all take off at once. It's ridiculous.",
    opts: [
      { tone: 'cold', t: "Sounds like a you thing.", r: "It is a me thing. I hoped it might be an us thing. I'll keep my butterflies in their jar, then.", opts: [
        { tone: 'cold', t: "Good plan.", r: "Okay. Lid on. They're still flapping, though. I'm telling you because I won't pretend it doesn't hurt." },
        { tone: 'passive', t: "That was unkind. I get them too, a bit.", r: "A bit? A bit is a lot, from you. I'll take a bit. I'll take a bit and live in it for days." },
        { tone: 'flirty', t: "Let them out. I want to see them.", r: "If I let them out they'll fly straight at you. Every single one. You've been warned. Oh, there they go." },
      ] },
      { tone: 'passive', t: "Ridiculous in a good way?", r: "The best way. I feel sixteen. I wrote your name on the back of my hand without noticing. Look. Oh no.", opts: [
        { tone: 'cold', t: "Wash it off.", r: "Okay. I'll wash it off. It was a small, happy thing and you made it embarrassing. I'm a bit sore now." },
        { tone: 'passive', t: "That's sweet. Leave it on.", r: "Leave it on? Okay. I'll walk around all day with you on my hand. People will ask. I'll tell them." },
        { tone: 'flirty', t: "Write it somewhere I'll see it next time.", r: "Somewhere you'll see it... oh, you're terrible. I'm laughing. My heart can't decide between racing and melting." },
      ] },
      { tone: 'flirty', t: "Funny. Mine do the same around you.", r: "They do? Then our butterflies have met. They're probably having a lovely time. I'm having a lovely time.", opts: [
        { tone: 'cold', t: "Kidding. I don't get butterflies.", r: "Oh... I believed you. I always believe people. That's not a flaw, but today it hurt. I'll go." },
        { tone: 'passive', t: "They do. I don't say it much.", r: "Then I'll hold on to it extra tight. Quiet people's words weigh more. That one's going in my notebook." },
        { tone: 'flirty', t: "Shall we let them fly together?", r: "Yes. Yes. I've gone all fizzy. Hold my hand. Not for any reason. Just because. There. Better." },
      ] },
    ] },
  { id: 'emotional-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "There you are. I've been looking out for you for twenty minutes. I think about you more than I'd admit. Oops. Admitted.",
    opts: [
      { tone: 'cold', t: "Twenty minutes is a long time to look out for someone.", r: "It is. It felt longer. I hoped you'd find it sweet. You've found it something else, I can tell.", opts: [
        { tone: 'cold', t: "Find a hobby.", r: "I have hobbies. You were becoming one. I'll stop. I'm not going to hide that it hurt. It did." },
        { tone: 'passive', t: "Sorry. It is sweet. I'm just tired.", r: "Oh, tired, okay. Come and sit. Tired I can help with. I make a very good shoulder, I've been told." },
        { tone: 'flirty', t: "Next time I'll come early, so you don't have to.", r: "You'd do that? For me? I'd still look out for you. But I'd do it smiling. I'm smiling now." },
      ] },
      { tone: 'passive', t: "What do you think about, when you think about me?", r: "Whether you're eating properly. What your laugh sounds like when nobody's listening. Whether you think of me back.", opts: [
        { tone: 'cold', t: "That's a lot of wondering.", r: "It is. I wonder loudly. I'm sorry it's too much... I keep forgetting not everyone wants all of me." },
        { tone: 'passive', t: "I do think of you back. Often.", r: "Often. That word's mine now. I'll press it like a flower. Flat and safe, my gran would've said." },
        { tone: 'flirty', t: "My laugh sounds like this when you're near.", r: "Oh, that's my new favourite sound. Do it again. Please. I'm recording it somewhere behind my ribs." },
      ] },
      { tone: 'flirty', t: "Admitted, and noted. Same here. A worrying amount.", r: "A worrying amount? We should worry together. Somewhere quiet. Oh, I'm so warm I'm practically glowing.", opts: [
        { tone: 'cold', t: "Let's not overdo it.", r: "Overdo it? I've barely started. But okay. I'll turn myself down. I hate turning myself down." },
        { tone: 'passive', t: "Somewhere quiet sounds good. Soon.", r: "Soon. I'll hold you to soon. I'll write 'soon' on my calendar and circle it until it's real." },
        { tone: 'flirty', t: "Worry with me now. Right here.", r: "Right here? Okay. I'm worried... that I'll never stop smiling. That's my worry. And you're feeding it." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 2: the playlist
  { id: 'emotional-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "I made you a playlist, before last time went wrong. It's called 'songs for when you drive fast and I stand very still'.",
    opts: [
      { tone: 'cold', t: "I don't really listen to music.", r: "Everyone listens to something. I think you mean you don't want mine. That's okay. It's only a lot of songs.", opts: [
        { tone: 'cold', t: "That's what I mean.", r: "Okay. I'll keep it. I'll play it on my own, at night. I made it with my whole heart and you didn't want it." },
        { tone: 'passive', t: "No, I meant... sorry. Send it to me.", r: "Really? Okay. Track four's the one. It's about waiting for someone. You'll know why. Or you won't. That's fine too." },
        { tone: 'flirty', t: "I'll listen to every song. Then tell you which one's us.", r: "Which one's us... oh. I made a whole playlist hoping for exactly that sentence. My eyes are stinging." },
      ] },
      { tone: 'passive', t: "That's a long title. Send it over?", r: "It's a long feeling. Here. Seventeen songs. Track four made me cry in the supermarket.", opts: [
        { tone: 'cold', t: "Seventeen is a lot.", r: "It is. I had a lot to say and no words. Skip whatever you like. I'll pretend I don't mind. I mind." },
        { tone: 'passive', t: "Why track four?", r: "It's about someone watching the sea for a ship. I'm a watcher. You're a ship. I'm making it sound sad. It isn't." },
        { tone: 'flirty', t: "I'll listen on the way to {track}.", r: "You'll take me with you, sort of? In your ears? I'm going to cry in a supermarket again, aren't I?" },
      ] },
      { tone: 'flirty', t: "Standing still? I'll have to get you moving.", r: "You already do. That's the problem. My heart hasn't stood still since I met you. Track one is about that.", opts: [
        { tone: 'cold', t: "Bit much for a playlist.", r: "Everything I make is a bit much. That's what makes it mine. I hoped you'd like it. I'm sorry I hoped." },
        { tone: 'passive', t: "What's track one?", r: "A slow one. About falling without noticing. I picked it before I knew I was. Falling. I mean... oh no." },
        { tone: 'risque', t: "I can think of a few ways to get you moving.", r: "Oh! Okay. Slow down, please. My heart's still buckling its seatbelt. My face is the colour of a postbox." },
        { tone: 'flirty', t: "Then let's make a second playlist. Together.", r: "Together? Our playlist? I'd need a whole new title. I'd need a week. I'm so happy I could burst." },
      ] },
    ] },
  { id: 'emotional-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "Don't laugh. I made you a playlist. It's called 'songs for the long drive between your heart and mine'. Seventeen songs.",
    opts: [
      { tone: 'cold', t: "That title is a lot.", r: "I know it is. I'm a lot. I spent hours on it. I'd hoped you'd at least laugh kindly.", opts: [
        { tone: 'cold', t: "That was me laughing kindly.", r: "Then I don't want to hear the unkind one. I'll keep my playlist. That one went straight in, {me}." },
        { tone: 'passive', t: "Sorry. I'll listen. Which one first?", r: "Track four. Close your eyes for it. It's about someone keeping a light on. It's very me." },
        { tone: 'flirty', t: "A lot, but I love it.", r: "You love it? Okay. Okay. I'm trying to be cool about it and failing. My whole chest is fizzing." },
      ] },
      { tone: 'passive', t: "Seventeen songs? You worked hard on this.", r: "Every song's a moment. The day we met is track two. Track nine is you laughing. Track seventeen is... hope.", opts: [
        { tone: 'cold', t: "That's a lot to put on a few songs.", r: "Songs can carry it. I can't always. I'm sorry it feels heavy to you. It felt like flying to me." },
        { tone: 'passive', t: "I'll listen tonight. Properly.", r: "Properly? Headphones and everything? Then tell me what you felt. Not what you thought. What you felt." },
        { tone: 'flirty', t: "Track seventeen is hope? Hope for what?", r: "For more of this. More of you. For the drive between your heart and mine to get very, very short." },
      ] },
      { tone: 'flirty', t: "Between your heart and mine? I'd make that drive every night.", r: "Every night? You can't say things like that... I'll believe you. I'll start counting the nights.", opts: [
        { tone: 'cold', t: "Figure of speech.", r: "Oh. A figure of speech. I'm the wrong person to say those to. I hear them as promises. I'm a bit crushed." },
        { tone: 'passive', t: "Okay, maybe not every night. But often.", r: "Often's good. Often's lovely. I'll take often and turn it into a song. Track eighteen." },
        { tone: 'risque', t: "Maybe I'll park outside and come in.", r: "Come in? Oh... oh. I'm going to faint. Not no. Just... you're doing two hundred and my heart's doing thirty." },
        { tone: 'flirty', t: "No traffic. No speed limits. Just you at the end.", r: "Stop it. I'm going to laugh and cry at once and make a terrible noise. Just me at the end. Yes. Always." },
      ] },
    ] },
  { id: 'emotional-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "One song's been on repeat all week, and every word is you. So I made you a playlist. Seventeen songs. Don't judge the title.",
    opts: [
      { tone: 'cold', t: "I don't really need a playlist.", r: "Need, no. But I made it. That's what I do when I feel something. I'm sorry it's not welcome.", opts: [
        { tone: 'cold', t: "It isn't.", r: "Okay. That's clear. I'll keep the songs. I'll keep the feeling too. I don't know where else to put it." },
        { tone: 'passive', t: "Sorry. That was rude. What's it called?", r: "'Every song I heard and thought of you.' Simple. Honest. Very long. Track one is the song from this week." },
        { tone: 'flirty', t: "Unless every song is about me. Then I need it.", r: "Every single one. Some more than others. Track twelve is a bit... much. You'll know it when you hear it." },
      ] },
      { tone: 'passive', t: "Go on. What's the title?", r: "'If you're listening to this, I'm thinking of you.' Because I am. Right now. Even with you standing here.", opts: [
        { tone: 'cold', t: "That's a bit sad, isn't it?", r: "Sad? It's the happiest thing I've ever made. You've managed to make it sound lonely. That hurt, a bit." },
        { tone: 'passive', t: "That's a lovely title, actually.", r: "You think so? I rewrote it twenty times. I'm glad that's the one you get. Listen to track six first." },
        { tone: 'flirty', t: "I'll be listening a lot, then.", r: "A lot? Then I'll be thought of a lot. That's... that's all I've ever wanted, really. To be thought of." },
      ] },
      { tone: 'flirty', t: "I'd never judge. I'd frame it.", r: "Frame a playlist? I could kiss you. Not literally! Mostly not literally. Oh, my face. Don't look at my face.", opts: [
        { tone: 'cold', t: "Let's keep it not literally.", r: "Okay. Not literally. I'll put that thought back where I found it. I'm embarrassed now, and a bit hurt." },
        { tone: 'passive', t: "Ha. Okay. Which song first?", r: "Track one. Then the rest in order. It's a story. It starts with meeting you and ends with... hope." },
        { tone: 'risque', t: "Mostly? I'd like to hear about the rest.", r: "The rest? No, no, slow down. Your mouth is a lap ahead of my heart. Ask me again when I can breathe." },
        { tone: 'flirty', t: "Then frame me too. Next to the playlist.", r: "Next to the playlist, on my wall, where I see you every morning. Oh, I'm so happy it's silly." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 3: the hill
  { id: 'emotional-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "Hi. I've carried last time around all week. I'd like to show you something, if you'll let me. There's a hill where I go to think.",
    opts: [
      { tone: 'cold', t: "I'm not really a hill person.", r: "It's not about the hill. It's where I take people I trust. I was trying to trust you. That's okay.", opts: [
        { tone: 'cold', t: "Take someone else, then.", r: "Maybe I will. Maybe I won't take anyone. I'll sit up there and hurt about this. Honestly. I will." },
        { tone: 'passive', t: "Sorry. Tell me about the hill.", r: "It's outside town. No lights. You lie back and the sky is just... everything. I go when I'm too full of feelings." },
        { tone: 'flirty', t: "Unless you're on it. Then I'm a hill person.", r: "Oh... not fair. I was ready to be sad. Now I'm smiling and I've forgiven you halfway. Three-quarters." },
      ] },
      { tone: 'passive', t: "I'd like that. Why the hill?", r: "No lights for miles. You lie in the grass and the stars come out like they've waited for you. I cry every time.", opts: [
        { tone: 'cold', t: "You cry at stars too?", r: "I cry at everything beautiful. I thought you knew that by now. I'll stop telling you the soft things." },
        { tone: 'passive', t: "That sounds peaceful. When?", r: "A clear night. I'll check the forecast fifty times. Bring a blanket. Bring yourself. That's all I need." },
        { tone: 'flirty', t: "Lying in the grass with you? I'm in.", r: "You're in? Okay. I'm already picking which blanket. The soft blue one. Don't laugh. It's important." },
      ] },
      { tone: 'flirty', t: "A hill to think? I'd only think about one thing up there.", r: "Which thing? No, wait, let me guess. I'm hoping it's me. I'm hoping so loudly you can probably hear it.", opts: [
        { tone: 'cold', t: "The weather. I'd be cold.", r: "The weather. Okay. I walked into that one with my arms open. I'll stop walking into things. That hurt." },
        { tone: 'passive', t: "The stars. And you, a bit.", r: "A bit is enough. The stars won't mind sharing. Clear night, soon. I'll bring a blanket and too many snacks." },
        { tone: 'risque', t: "You. And how close you'd have to lie to keep warm.", r: "Close... oh, slow down, slow down. I'm on the formation lap and you're already at the flag. Bring two blankets. Or one. Oh no." },
        { tone: 'flirty', t: "You. Obviously. The stars can wait.", r: "Oh, that's going straight in the notebook, word for word. I'm so fluttery I could lift off the hill." },
      ] },
    ] },
  { id: 'emotional-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "There's a hill outside town I go to when I'm full to the brim. No lights. Just stars. I've never taken anyone. Would you come?",
    opts: [
      { tone: 'cold', t: "Sounds cold and muddy.", r: "It can be. I'd bring blankets. I wasn't asking you to like mud. I was asking you somewhere precious.", opts: [
        { tone: 'cold', t: "Still no.", r: "Okay. Still no. I'll go on my own like always, and cry at the stars, and some of it'll be about this." },
        { tone: 'passive', t: "Sorry. Precious, how?", r: "It's where I go when everything's too loud inside. Up there it's quiet. I'd like you to see my quiet." },
        { tone: 'flirty', t: "I'll come if you keep me warm.", r: "Keep you warm? I... yes. I'll bring the softest blanket I own. My face has gone hot. Good, that'll help." },
      ] },
      { tone: 'passive', t: "I'd come. What do you do up there?", r: "Lie back. Name the stars wrong on purpose. Talk to the sky. Sometimes I read old pages from my notebook.", opts: [
        { tone: 'cold', t: "Sounds a bit lonely.", r: "It is, a bit. That's why I asked you. I'm sorry it came across as sad. It was meant as an invitation." },
        { tone: 'passive', t: "Name them wrong? Teach me.", r: "That one's 'The Cat's Nose', after mine. That's 'Second Chances'. You'll get to name one. Choose carefully." },
        { tone: 'flirty', t: "Read me a page. One about me.", r: "One about you? There are several. I'd have to pick the least embarrassing. That narrows it to... none. Oh." },
      ] },
      { tone: 'flirty', t: "Never taken anyone? Then I'd better be worth it.", r: "You already are. That's why I'm asking. My heart's been practising this question for a week.", opts: [
        { tone: 'cold', t: "No pressure, then.", r: "I didn't mean to pressure you. I wanted to share something. I'll keep it to myself if it's too heavy." },
        { tone: 'passive', t: "I'll try. When's the next clear night?", r: "Thursday, says the forecast. I've checked it eleven times. Twelve. Bring a jumper. Bring patience." },
        { tone: 'risque', t: "Worth it all night long?", r: "All night? Oh, slow down. You've made me forget the stars exist. My heart's sprinting and I'm standing still." },
        { tone: 'flirty', t: "First person on your hill. I'm honoured.", r: "First and maybe only. Oh, that came out heavy. I mean it lightly. I mean it heavily. I mean it." },
      ] },
    ] },
  { id: 'emotional-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "I've been thinking where I want to take you. Not dinner. A hill outside town, where the stars come out properly. Say yes?",
    opts: [
      { tone: 'cold', t: "A hill? I was hoping for dinner.", r: "Oh. Dinner is fine too. I just wanted to give you something that's mine. I'll stop being so... me.", opts: [
        { tone: 'cold', t: "Dinner, then.", r: "Dinner, then. I'll be polite and smile. I'll know, though, that I offered you my hill and you didn't want it." },
        { tone: 'passive', t: "No, the hill's lovely. What's it like?", r: "Quiet. Dark. The grass smells like rain. And when the stars come out you feel tiny in the best way." },
        { tone: 'flirty', t: "Hill first. Dinner after. I want both.", r: "Both! Greedy. I love greedy. I'll pack a flask and a blanket and my bravest heart." },
      ] },
      { tone: 'passive', t: "Yes. Why there?", r: "It's where I go when I feel too much. I'd like you to see me there. I'm softer up there. If that's possible.", opts: [
        { tone: 'cold', t: "Softer than this? Hard to imagine.", r: "Was that a dig? It felt like one. I'm softer than this, yes. You've just made me want to be less." },
        { tone: 'passive', t: "I'd like to see that.", r: "Then you will. Clear night, a blanket, the whole sky. I'll tell you everything I've never said out loud." },
        { tone: 'flirty', t: "I like you soft.", r: "You like me soft. Okay. I'm turning into a puddle. A happy one. You'll have to carry me up the hill." },
      ] },
      { tone: 'flirty', t: "Yes. A thousand times. Stars and you?", r: "Stars and me. And you. And a flask of cocoa. I'm already planning what to wear. Nothing fancy. Something brave.", opts: [
        { tone: 'cold', t: "Let's not overplan it.", r: "Okay. I overplan when I'm happy. I'll try to just let it happen. That came out sharp, though. I noticed." },
        { tone: 'passive', t: "Cocoa? Perfect.", r: "Cocoa, with tiny marshmallows. Two mugs. I've been carrying a second mug around in my heart for ages." },
        { tone: 'risque', t: "Brave like what? Show me on the hill.", r: "Show you on the... oh! No. Yes. Wait. My heart's doing laps and I've lost count. I'll be useless at stargazing." },
        { tone: 'flirty', t: "Wear whatever. I'll only be looking at you.", r: "Then the stars will be so jealous. I'll have to apologise to them. I won't mean it, though." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 4: the note on the fridge
  { id: 'emotional-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "When you went quiet after last time, I panicked. Can I tell you why? Someone once left me with just a note on the fridge.",
    opts: [
      { tone: 'cold', t: "That's not my fault.", r: "No. It isn't. I'm not blaming you. I'm trying to explain me. I'd hoped you'd want to know.", opts: [
        { tone: 'cold', t: "I don't need the explanation.", r: "Okay. Then I'll keep it, and the panic too. I'm being honest: that landed close to where the note did." },
        { tone: 'passive', t: "Sorry. Tell me. What did it say?", r: "'I can't do this anymore. Sorry.' That was all. Three years and a note. Silence still sounds like that to me." },
        { tone: 'flirty', t: "I'll never leave you a note. I'd tell you to your face.", r: "To my face... that's oddly the most romantic thing. Honesty. Oh, I'm going to cry. Let me. Just a little." },
      ] },
      { tone: 'passive', t: "A note? That's awful. I'm sorry.", r: "Thank you. It was years ago. But when people go quiet, my heart runs to the fridge. Isn't that silly?", opts: [
        { tone: 'cold', t: "A bit, yes.", r: "Okay. A bit silly. I'll put that with the other things I'm a bit too much about. The pile's getting heavy." },
        { tone: 'passive', m: 2, t: "It's not silly. It makes sense.", r: "It makes sense. You've no idea what that does for me. I'll try to panic less. You try to say goodbye, always. Deal?" },
        { tone: 'flirty', t: "Next time I go quiet, it's because I'm thinking about you.", r: "Is it? Then quiet will sound different. Like something good being built. I'll try to hear it that way." },
      ] },
      { tone: 'flirty', t: "I'm here. No notes. You've got my whole face to talk to.", r: "Your whole face. It's a good face. I'll take it over any fridge. Oh, I'm smiling through it. Can I tell you?", opts: [
        { tone: 'cold', t: "Let's skip the sad story.", r: "Oh. Okay. I'll skip it. The sad story is part of me, though. You've skipped a bit of me. I felt that." },
        { tone: 'passive', t: "Tell me.", r: "Someone left. A note on the fridge, no goodbye. Now silence frightens me. That's why I text twice. Now you know." },
        { tone: 'flirty', t: "Tell me. Then I'll make you laugh till it hurts less.", r: "That's the whole story: a fridge, a note, no goodbye. And now you're pulling faces at me. It hurts less already." },
      ] },
    ] },
  { id: 'emotional-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "I want to tell you something, because you deserve to know why I text twice. Someone I loved left with nothing but a note on the fridge.",
    opts: [
      { tone: 'cold', t: "You don't have to tell me everything.", r: "I know. I want to. Being known is how I feel safe. I'm sorry if that's too heavy for you.", opts: [
        { tone: 'cold', t: "It is, honestly.", r: "Okay. Then I'll carry it. I'm used to that. I hoped not to be, with you. That really hurt." },
        { tone: 'passive', t: "Sorry. Go on. What happened?", r: "No goodbye. Just 'I can't do this'. So when people go quiet, I fill the silence. That's the double texts." },
        { tone: 'flirty', t: "Tell me everything. I want to be the one who knows.", r: "The one who knows... I've wanted someone to be that for so long. Okay. Sit. This might take a while." },
      ] },
      { tone: 'passive', t: "That's cruel. No goodbye at all?", r: "Not a word. Three years, then a note. So when you're quiet I text again. I'm working on it. I promise.", opts: [
        { tone: 'cold', t: "Work faster.", r: "Faster. Okay. I'll try. You could be kinder while I do. I'm telling you that because I won't swallow it." },
        { tone: 'passive', m: 2, t: "Text twice. I don't mind.", r: "You don't? Truly? Oh... that's a weight off. I'll still try to be calm. But it's nice to be allowed." },
        { tone: 'flirty', t: "Text three times. I like hearing from you.", r: "Three times! You'll regret that. I'll send you the moon, my cat, a cloud shaped like a shoe. You've only yourself to blame." },
      ] },
      { tone: 'flirty', t: "Anyone who leaves you a note didn't deserve the fridge.", r: "Didn't deserve the fridge! Oh, I laughed. I didn't think I'd ever laugh about it. Thank you. Really.", opts: [
        { tone: 'cold', t: "Still, it's in the past. Let it go.", r: "I'm trying. Some things take a while. You saying 'let it go' like that makes it harder. I'd rather you knew that." },
        { tone: 'passive', t: "Seriously, I'm sorry that happened.", r: "Thank you. It's why I need to hear things. Out loud. Often. I know I'm asking a lot. It's who I am." },
        { tone: 'flirty', t: "I'd have said goodbye to your face. Then come back.", r: "Goodbye and then come back? That's not a goodbye, that's a promise. I'm writing that down tonight." },
      ] },
    ] },
  { id: 'emotional-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Before I fall any harder, there's something you should know. Someone once left me with a note on the fridge. That's my ghost.",
    opts: [
      { tone: 'cold', t: "Bit of a mood killer.", r: "Oh. I know. I'm sorry. I wanted you to know me before... I've ruined the moment, haven't I?", opts: [
        { tone: 'cold', t: "A bit.", r: "Okay. Then I'll stop. But I'm not sorry I told you. I'm only sorry you didn't want to hear it." },
        { tone: 'passive', t: "No, sorry. Tell me. I want to know.", r: "No goodbye, just a note. So I need people to say things out loud. Often. That's the ghost. That's all of it." },
        { tone: 'flirty', t: "You haven't. Fall harder. I've got you.", r: "You've got me? Okay. I'm falling, then. Eyes closed. That's the bravest thing I've done in years." },
      ] },
      { tone: 'passive', t: "Your ghost? Tell me.", r: "Three years. Then a note that said 'I can't'. That's why silence scares me. You should know before I fall further.", opts: [
        { tone: 'cold', t: "Noted. Let's move on.", r: "Noted. Okay. I put my heart on the table and you filed it. I'm going to need a minute, I think." },
        { tone: 'passive', t: "I'm glad you told me. I'll say things out loud.", r: "Out loud. Every time? Okay. And I'll try to believe them. That's my side of it. That's a lot, from me." },
        { tone: 'flirty', t: "Fall harder. I'm not going anywhere.", r: "Not anywhere? Promise? Don't say it if you don't mean it... you mean it. I can see it. Oh." },
      ] },
      { tone: 'flirty', t: "Falling harder? Good. I'll catch you.", r: "You'd catch me? Even with my ghost? Even with the fridge and the note and the double texts?", opts: [
        { tone: 'cold', t: "Maybe. Depends on the ghost.", r: "Depends... okay. I'm not something you test the weight of first. I'm sorry, but that hurt." },
        { tone: 'passive', t: "Even then. Tell me about it.", r: "Someone left. Note on the fridge, no goodbye. So I check in a lot. Too much. You'll see. Still catching?" },
        { tone: 'flirty', t: "Especially then. Ghosts and all.", r: "Ghosts and all. Oh... I can't breathe properly. That's the kindest thing. Come here. Just for a second." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 5: the pang
  { id: 'emotional-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "I need to say something, honestly. When I see people crowding round you, laughing with you, it hurts. I know I've no right to that.",
    opts: [
      { tone: 'cold', t: "You're right. You've no right.", r: "I know. I said that. I wasn't asking for a right, just a little care. You've given me neither.", opts: [
        { tone: 'cold', t: "I don't owe you anything.", r: "You don't. But I'd hoped you'd want to give it. That's the difference. I'm going home to cry. Honestly." },
        { tone: 'passive', t: "Sorry. That was harsh. They're just people I work with.", r: "Just work. Okay. I believe you. I feel it before I think it, that's all." },
        { tone: 'flirty', t: "Nobody makes me laugh like you do, though.", r: "Nobody? Even them? Oh... I'm so relieved I could sit on the floor. I'm not going to. I'm considering it." },
      ] },
      { tone: 'passive', t: "They're nobody special. But I'm glad you told me.", r: "You are? I thought you'd be annoyed. I'm trying to say things instead of stewing. It's new. It's scary.", opts: [
        { tone: 'cold', t: "Don't make a habit of it.", r: "Of honesty? I can't promise that. It's who I'm trying to be. I'm sorry you'd rather I stewed." },
        { tone: 'passive', t: "Keep telling me. I'd rather know.", r: "You'd rather know. Okay. Then I'll keep telling you. Even the silly bits. Especially the silly bits." },
        { tone: 'flirty', t: "Jealous suits you. But you've nothing to worry about.", r: "Nothing to worry about. I'm writing that on my mirror. Jealous suits me? Don't encourage it." },
      ] },
      { tone: 'flirty', t: "You were jealous? That's kind of adorable.", r: "Adorable? I've been miserable for two days! Okay. A bit adorable. But it hurt, {me}. It properly did.", opts: [
        { tone: 'cold', t: "Well, get over it.", r: "I will. Eventually. Not because you told me to. That one hurt more than the laughing did. I'll go." },
        { tone: 'passive', t: "I'm sorry it hurt. They're nobody to me.", r: "Nobody. Okay. My heart's slowing down. Thank you for not laughing at me. Well, laughing kindly." },
        { tone: 'risque', t: "Let me spend the rest of the night making it up to you.", r: "The rest of the night? Oh. Oh no. I can't keep up with you. Slow down. Okay, not too slow." },
        { tone: 'flirty', t: "Let me make it up to you. Every laugh is yours now.", r: "Every laugh? Even the snorty ones? Okay. I forgive you completely and I'm a bit dizzy." },
      ] },
    ] },
  { id: 'emotional-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Can I be honest about something small and stupid? When I see you laughing with other people, I get a pang. A big one.",
    opts: [
      { tone: 'cold', t: "That's your problem, not mine.", r: "It is mine. I said so. I just wanted you to know me, even the jealous bits. Maybe that was a mistake.", opts: [
        { tone: 'cold', t: "Maybe it was.", r: "Okay. Then I'll keep the jealous bits to myself. And the soft bits. You've made it hard to share either." },
        { tone: 'passive', t: "Sorry. I didn't mean it like that. It's nothing.", r: "Nothing? Okay. I believe you. I always believe you. I just need to hear it sometimes." },
        { tone: 'flirty', t: "A pang? I'd be flattered if it weren't so sweet.", r: "Sweet? It didn't feel sweet. It felt like falling down stairs. But if you're smiling, it's better already." },
      ] },
      { tone: 'passive', t: "I'm glad you said it. It isn't anything.", r: "I believe you. I just didn't want it festering. I'd rather say it and look silly than swallow it and go cold.", opts: [
        { tone: 'cold', t: "You do look a bit silly.", r: "Okay. I said I'd risk it. I didn't think you'd agree so quickly. That stings more than the pang did." },
        { tone: 'passive', t: "You don't look silly. You look honest.", r: "Honest. I'll take honest. It's the best thing I know how to be. Thank you for seeing it." },
        { tone: 'flirty', t: "For the record, I'd rather laugh with you.", r: "With me? Really? Okay. Then I'll be very funny from now on. Starting now. Er... I've got nothing. Help." },
      ] },
      { tone: 'flirty', t: "Pang, hm? Should I be flattered?", r: "Yes. No. Both. It means I like you more than I meant to. That's flattering. It's also terrifying.", opts: [
        { tone: 'cold', t: "Don't like me too much, then.", r: "Too late for that. I'm sorry if it's unwelcome. I'll just carry it a bit quieter. It'll still be there." },
        { tone: 'passive', t: "I like you more than I meant to as well.", r: "You do? Oh... then we're both terrified. That's sort of wonderful. Terrified together beats alone." },
        { tone: 'risque', t: "Should I give you something else to feel?", r: "Something else? Oh my. Wait. I'm still recovering from the pang and now my pulse is in the red." },
        { tone: 'flirty', t: "Be flattered back. You're the only one I look for.", r: "The only one? You look for me? Oh, I'm done. Completely done. I'll write it down if my hands stop shaking." },
      ] },
    ] },
  { id: 'emotional-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Okay, confession, then you can laugh. When you laugh with other people, I get jealous. Wildly. Over a laugh.",
    opts: [
      { tone: 'cold', t: "Jealousy's not a great look.", r: "It isn't. I know. I'm telling you because I'd rather be honest than hide it. I didn't expect you to judge it.", opts: [
        { tone: 'cold', t: "Well, I do.", r: "Okay. Then I'll stop telling you things. That's what you're teaching me today. I'm sad to learn it." },
        { tone: 'passive', t: "Sorry. Honesty is good. It's nothing, though.", r: "Okay. Thank you. I feel calmer already. I'm sorry I'm like this. I'm not sorry I told you." },
        { tone: 'flirty', t: "Nobody laughs at my jokes like you. Relax.", r: "Nobody? Really? Okay. I'm going to laugh at all of them, then. Even the bad ones. Especially those." },
      ] },
      { tone: 'passive', t: "Wildly? Over a laugh? Come here.", r: "Over a laugh. You've got a lovely laugh and I want all of it. That's selfish, isn't it? I'm sorry.", opts: [
        { tone: 'cold', t: "It is selfish.", r: "Okay. I said it first, but it hurt more when you said it. I'll go and be selfish somewhere else." },
        { tone: 'passive', t: "It's not selfish. It's human.", r: "Human. You're so kind sometimes it knocks the wind out of me. Thank you. I'll calm down now. Mostly." },
        { tone: 'flirty', t: "You can have all of it. Just ask nicely.", r: "Nicely? Please may I have all your laughs, forever? Oh no, forever. I said forever. Pretend I didn't." },
      ] },
      { tone: 'flirty', t: "Jealous? That means you like me.", r: "Of course I like you! I like you so much I'm jealous of a laugh. That's how much. It's embarrassing.", opts: [
        { tone: 'cold', t: "That's not my responsibility.", r: "No. It's mine. I'm handling it. I just thought you'd want to know. That came out cold, and I felt it." },
        { tone: 'passive', t: "I like you too. More than anyone I laugh with.", r: "More than anyone. Okay. I'll stop being jealous of laughs. I'll start being smug instead." },
        { tone: 'risque', t: "Then come and claim me.", r: "Claim you? Oh, I'll combust. Too fast! My heart's still on the grid and you've waved the flag." },
        { tone: 'flirty', t: "Embarrassed looks gorgeous on you.", r: "Stop. I'm the colour of a tomato. A happy tomato. A jealous, happy tomato. You've ruined me." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 6: tiny anniversaries
  { id: 'emotional-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "I keep a list of tiny anniversaries. After last time I nearly didn't come, but I want today on it. So: a joke. Laugh and it counts.",
    opts: [
      { tone: 'cold', t: "A list of anniversaries? Seriously?", r: "It's a bit me. I remember the small things because they're what hold me up. I'll stop telling you them.", opts: [
        { tone: 'cold', t: "Then stop telling me.", r: "Okay. I'll keep my little dates. I'll mark this one too: the day you made me feel silly for remembering." },
        { tone: 'passive', t: "Sorry. That was mean. Go on, tell the joke.", r: "A pigeon walks into the pit lane and asks for fresh tyres. It's not even funny. You laughed anyway. Today counts." },
        { tone: 'flirty', t: "Unless you've marked the day we met too.", r: "The day we met is circled in three colours. Of course it is. Oh... you're smiling. Last time feels smaller." },
      ] },
      { tone: 'passive', t: "I'm sorry last time felt sad. Go on. What's the joke?", r: "Why did the pigeon stop in the pit lane? For a feather change. Awful. Oh, you laughed! Today's going on the list.", opts: [
        { tone: 'cold', t: "A list? Of course you do.", r: "Of course I do. You said it like it's a flaw. It's how I love things. I'm a bit wounded now." },
        { tone: 'passive', t: "What else is on the list?", r: "My first snow. The day I got my cat. The day we met, underlined twice. Small things. Precious." },
        { tone: 'flirty', t: "Add today. The day I laughed.", r: "Today. 'The day they laughed.' I'm writing it now. Look, it's going right next to the pigeon. Perfect." },
      ] },
      { tone: 'flirty', t: "Tell me the joke. I'm laughing already.", r: "Already? Okay. A pigeon walks into a pit lane... no, I can't, I'm giggling. This is my favourite anniversary ever.", opts: [
        { tone: 'cold', m: -3, t: "Okay, stop. It's not that funny.", r: "No... it isn't. It was the laughing that mattered. I wanted today to be good. It's a bit less good now." },
        { tone: 'passive', t: "Ha. Do you remember a lot of dates like this?", r: "All of them. Meeting you. My first text to you. Now this one. I keep a list. Don't tease." },
        { tone: 'risque', t: "Let's make today an anniversary worth remembering.", r: "Worth remembering how? No, don't answer. Slow down, I'm still back at the pigeon. Tell me in a week." },
        { tone: 'flirty', t: "I'll laugh at it every month, then.", r: "Every month? You'd have to stay around for ages. Oh, that's what you meant. My heart's doing somersaults." },
      ] },
    ] },
  { id: 'emotional-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "Can I tell you a joke? I keep a list of tiny anniversaries, and if you laugh, today goes on it. No pressure. Lots of pressure.",
    opts: [
      { tone: 'cold', t: "That's a strange thing to track.", r: "Maybe. But the small things are the big things, to me. I hoped it'd make you smile. It didn't, I can see.", opts: [
        { tone: 'cold', t: "No. It didn't.", r: "Okay. That's a hard little sentence. I'll cross today off the list, I think. It's not a happy one now." },
        { tone: 'passive', t: "Sorry. It's sweet, actually. Go on, then.", r: "What's a pigeon's favourite bit of a race? The pit stop. Terrible. You're laughing, though! On the list it goes." },
        { tone: 'flirty', t: "Strange, but adorable. What else is on it?", r: "The day my gran taught me to press flowers. The day you and I met. And that look you're giving me now. Yes. That one." },
      ] },
      { tone: 'passive', t: "What else have you written down?", r: "The day my cat came home. My first pressed daisy. Meeting you, obviously. Today, if my pigeon joke lands.", opts: [
        { tone: 'cold', t: "You need more going on in your life.", r: "I have plenty going on. I just notice it. I'm sorry you see it as small. It hurt to hear that." },
        { tone: 'passive', t: "I can't believe you remember all that.", r: "I remember everything about people I care about. It's a gift and a burden. With you it's mostly a gift." },
        { tone: 'flirty', t: "What will next month's anniversary be?", r: "I don't know yet. That's the exciting part. I hope it's something with you in it. It will be. It always is." },
      ] },
      { tone: 'flirty', t: "Go on, joke away. I'm going for a winning streak.", r: "A streak! Okay. Why do pigeons love pit lanes? All the fast food. You laughed before the end! You're most of my list now.", opts: [
        { tone: 'cold', t: "Bit sad, keeping a list.", r: "It's not sad. It's love, in small pieces. You don't have to like it. But I wish you hadn't called it sad." },
        { tone: 'passive', t: "What's the first thing on the list?", r: "My first snow, when I was six. The day we met isn't first, but it's in my best pen. Don't tease." },
        { tone: 'risque', t: "Let's give your list something new tonight.", r: "Something new? Tonight? Oh... my heart's doing doughnuts. I'll need a separate list. A private one." },
        { tone: 'flirty', t: "Let's see how long the streak lasts.", r: "Forever, I hope. Too much? Probably. But it's an anniversary. I'm allowed to be too much today." },
      ] },
    ] },
  { id: 'emotional-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "There's a list of tiny anniversaries in my notebook, and I want today on it. So I've brought a joke. A pigeon joke. Ready?",
    opts: [
      { tone: 'cold', t: "I'm not in the mood for jokes.", r: "Oh. Then I'll hold on to it. That's the trouble with being me. I hold on and other people let go.", opts: [
        { tone: 'cold', t: "I let go of a lot.", r: "I can tell. I'll try not to take it personally. I'll fail. I'm telling you so it's not a secret." },
        { tone: 'passive', t: "Sorry. Go on. Tell it.", r: "Why was the pigeon slow in the pit lane? It kept stopping for crumbs. It's not even good. And you laughed! It counts." },
        { tone: 'flirty', t: "Tell it. I'll remember it forever.", r: "You'll remember it? Promise? Okay. I'm going to tell it badly on purpose so you laugh. A pigeon..." },
      ] },
      { tone: 'passive', t: "A list of tiny anniversaries? What else?", r: "My first pressed flower. My gran's birthday. When we first met. Dates for all of them.", opts: [
        { tone: 'cold', t: "That's a little intense.", r: "It's a little me. I know you know that by now. I'm sorry it made you step back. I saw you step back." },
        { tone: 'passive', t: "That's actually really sweet.", r: "You think so? Okay. Then the list stays. And keeps growing. You keep giving me things to add." },
        { tone: 'flirty', t: "What's the date you first fancied me?", r: "Oh, you'd love to know. It's on the list. It's very early. Embarrassingly early. Day one. Minute four." },
      ] },
      { tone: 'flirty', t: "Then happy anniversary. I've got you a present.", r: "A present? For a joke anniversary? You're the only person who's ever played along. What is it? I'm shaking.", opts: [
        { tone: 'cold', t: "Joking. I didn't get you anything.", r: "Oh. Okay. I believed you. I always will, I think. That's why it hurt. I'll laugh later. Not now." },
        { tone: 'passive', t: "It's small. A joke back. Ready?", r: "A joke swap! Nobody's ever told me one back. I'm going to cry. I'm crying. It's going in my notebook forever." },
        { tone: 'risque', t: "Close your eyes. It's a kiss.", r: "A kiss? Here? Now? Oh... my heart isn't ready. It's still tying its laces. Okay. One. Quickly. Oh." },
        { tone: 'flirty', t: "It's me, all to yourself. That's the present.", r: "All to myself? That's the best present anyone's given me. I'm adding it to the list. Right at the top." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 7: the paper star
  { id: 'emotional-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "I folded you a paper star. There's a note inside for a bad day. I nearly didn't bring it, after how last time felt.",
    opts: [
      { tone: 'cold', t: "I don't have bad days.", r: "Everyone has bad days. I've seen yours on the screen. I wanted to be there for one. You won't let me, I think.", opts: [
        { tone: 'cold', t: "No, I won't.", r: "Okay. I'll keep the star. Maybe I'll need it more than you. Tonight, probably. You should hear that from me." },
        { tone: 'passive', t: "Sorry. That's a kind thing. What does it say?", r: "You can't read it till you need it. That's the rule. Put it in your race bag. Promise me you'll keep it." },
        { tone: 'flirty', t: "Unless you're in the note. Then I'll take it.", r: "I'm in it. All of me, folded small. Careful, it's a bit tear-stained. That's from making it, not from last time. Mostly." },
      ] },
      { tone: 'passive', t: "That's lovely. When do I open it?", r: "Only on a really bad day. Not a little one. A big one. Promise? It's the most important thing I've written.", opts: [
        { tone: 'cold', t: "That seems dramatic.", r: "Maybe. But someday you'll need it, and it'll be there. You don't have to believe me now. It still hurts that you don't." },
        { tone: 'passive', t: "I promise. Race bag. Bad days only.", r: "Thank you. I feel better knowing a bit of me goes with you. Like the playlist. But quieter. And folded." },
        { tone: 'flirty', t: "What if I just want to hear your voice? Is that a bad day?", r: "Then call me. That's not what the star's for. The star's for when you can't. My heart's in a twist." },
      ] },
      { tone: 'flirty', t: "A star? For me? You know how to break me.", r: "I don't want to break you. I want to hold you together on the days you fall apart. It's folded from my notebook.", opts: [
        { tone: 'cold', t: "That's... a bit heavy.", r: "It is heavy. It's meant to be. I'll take it back if you don't want it. It's hurting to hold it out, a bit." },
        { tone: 'passive', t: "From your notebook? Then I'll keep it safe.", r: "Safe. Yes. Flat and safe, like my gran used to say. I'm so glad. You've no idea how glad." },
        { tone: 'risque', t: "Maybe I'll open it tonight. With you.", r: "Tonight? With me? No, that's not how stars work! You're lapping my poor heart. Bad days only." },
        { tone: 'flirty', t: "If it's from you, every day's a good day.", r: "Every day? You're making me want to fold you a hundred stars. I'd do it. I'd stay up all night." },
      ] },
    ] },
  { id: 'emotional-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "I made you something. A paper star, folded from a page of my notebook. There's a note inside. Only open it on a bad day.",
    opts: [
      { tone: 'cold', t: "I'm not much for that kind of thing.", r: "I know. But I am. And I'm giving it to you anyway. You needn't like it. Please just keep it.", opts: [
        { tone: 'cold', t: "Fine. I'll keep it.", r: "Fine. Okay. You're holding it like a receipt. It's not a receipt. It's me. That really hurt to watch." },
        { tone: 'passive', t: "Sorry. Thank you. I'll keep it somewhere safe.", r: "Thank you. That's all I wanted. Somewhere safe. Like the playlist, but folded. And it doesn't skip." },
        { tone: 'flirty', t: "For you, I'll make an exception.", r: "An exception for me. I like being your exception. I'm going to be warm about that all week." },
      ] },
      { tone: 'passive', t: "Thank you. What makes a bad day?", r: "You'll know. The day the world feels too big and you feel too small. Open it then. Not before.", opts: [
        { tone: 'cold', t: "Sounds like a lot of feelings.", r: "It's exactly a lot of feelings. That's my department. I'm sorry yours is closed today. I'll keep knocking, though." },
        { tone: 'passive', t: "Okay. I'll keep it in my race bag.", r: "Your race bag. Next to your helmet. Oh, I'm going to think about that every single race. My little star." },
        { tone: 'flirty', t: "Any day without you might count.", r: "Oh, you can't say that, you'll use it up in a week! But keep saying it. I like it more than I should." },
      ] },
      { tone: 'flirty', t: "A star? Can I open it now?", r: "No! Absolutely not. Bad days only. Stop looking at me like that. Oh, you're doing the face. No. Still no.", opts: [
        { tone: 'cold', t: "Then what's the point?", r: "The point is it'll be there when I can't be. You've made me feel silly for thinking ahead. I'll stop." },
        { tone: 'passive', t: "Fine. Bad days only. I'll be good.", r: "Good. Thank you. I've folded my whole heart into it. Very small. Very carefully. Look after it." },
        { tone: 'risque', t: "What if I bribe you? With a kiss?", r: "A kiss as a bribe? That's... no. My heart's tripping over its own feet. Still no. Ask me again, though." },
        { tone: 'flirty', t: "Okay. But only if you give me a hint.", r: "One hint. It starts with your name and ends with mine. Everything in between is true. That's all you get." },
      ] },
    ] },
  { id: 'emotional-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "I've got a present! A paper star from my notebook, with a note inside. You can only open it on a really bad day. Rules are rules.",
    opts: [
      { tone: 'cold', t: "I'll probably lose it.", r: "Oh. Please don't. It's the most important thing I've made you. More than the playlist. I'd be heartbroken.", opts: [
        { tone: 'cold', t: "Then don't give it to me.", r: "Okay. I'll keep it. I'll open it myself on a bad day. Like today, maybe. I'm being honest. It hurts." },
        { tone: 'passive', t: "I'll be careful. I promise.", r: "Thank you. Careful is all I ask. In my experience, careful is love with its shoes on." },
        { tone: 'flirty', t: "I'll keep it closer than my helmet.", r: "Closer than your helmet! That's practically on your heart. I'm going to cry, the happy kind. Don't look." },
      ] },
      { tone: 'passive', t: "What's inside? Just a clue.", r: "Not even a clue. It's for when I'm not there and you need me to be. It's what I'd say if I could hold you.", opts: [
        { tone: 'cold', t: "I'll be fine without it.", r: "You probably will. I'd feel better if you had it. You don't have to need me. I wish you didn't say it like that." },
        { tone: 'passive', t: "That's... thank you. Really.", r: "It means a lot to me that it means a lot. Is that silly? I'm so relieved you're not laughing." },
        { tone: 'flirty', t: "Then I'll save it for the worst day. And call you after.", r: "Call me after. Always call me after. Promise me that, and the star's done its job twice." },
      ] },
      { tone: 'flirty', t: "Rules are rules. Unless I'm very charming?", r: "You're always very charming. It's a disaster. Still bad days only. Unless... no. No. Bad days only.", opts: [
        { tone: 'cold', t: "Fine. It's just paper.", r: "It's not just paper. It's me, folded small. You know that. You wanted it to sting, and it did." },
        { tone: 'passive', t: "Bad days only. I promise.", r: "Thank you. I'll sleep better knowing it's in your bag. A little bit of me at every race." },
        { tone: 'risque', t: "What would it take for you to break the rule?", r: "What would it... no. You're dangerous. My heart's spinning on the spot and I'm getting dizzy." },
        { tone: 'flirty', t: "Then every good day, I'll come and find you instead.", r: "Every good day? Then I'll be waiting every good day. And on the bad ones you've got the star. You've got me covered." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 8: nearly a kiss
  { id: 'emotional-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "I don't want another talk like last time. So I'll ask. What do you want from me? I need to know before I give you more of my heart.",
    opts: [
      { tone: 'cold', t: "I don't know. Not this much.", r: "Not this much. Okay. That's the clearest thing you've said. It's also the hardest. I need to sit with it.", opts: [
        { tone: 'cold', t: "Sit with it, then.", r: "I will. On my own. You should know I'd have given you all of it. Right now it just hurts. Take care, {me}." },
        { tone: 'passive', t: "That's not it. I'm scared of how much I like you.", r: "Scared? Oh... me too. All the time. Okay. Scared together. That's something. That's a lot, actually." },
        { tone: 'flirty', t: "Not this much talking. More of this.", r: "More of... you're stepping closer. Oh. Wait. My heart's going too fast. Okay. Don't stop. Don't stop." },
      ] },
      { tone: 'passive', t: "Honestly? You. More of you.", r: "More of me. Okay. I've been bracing for the opposite all week. I don't know what to do with my hands.", opts: [
        { tone: 'cold', t: "Keep them to yourself for now.", r: "Okay. To myself. I'll put them in my pockets. I wasn't going to... it's okay. I'll go home a bit sad." },
        { tone: 'passive', t: "Hold mine. That's a start.", r: "Your hand. Okay. It's warm. Mine's shaking, sorry. Don't let go yet. Let's just stand here. This is enough." },
        { tone: 'risque', t: "Put them on me. Start there.", r: "On you? Oh... my heart's miles behind. One hand. On your arm. There. That's as brave as I get tonight." },
        { tone: 'flirty', t: "Put them around me. See how that feels.", r: "Around you... oh. It feels like coming home after a long drive. I'm not letting go for a while. Is that okay?" },
      ] },
      { tone: 'flirty', t: "What I want? To stop pretending I don't want to kiss you.", r: "To kiss me? After last time? I... yes. Wait. No. Yes. My heart's sprinting. Ask me again, slowly.", opts: [
        { tone: 'cold', t: "Never mind. Forget I said it.", r: "Forget it? I'll never forget it. That's my curse. You gave me something and took it back. That really hurt." },
        { tone: 'passive', t: "Slowly, then. Whenever you're ready.", r: "Whenever I'm ready. You'd wait? That's the most romantic thing. I'm nearly ready. Nearly. Next time. Maybe." },
        { tone: 'risque', m: 2, t: "Then come here. Slowly.", r: "Slowly... okay. Closer. Oh, I'm shaking. That was... my heart's still catching up. Do that again sometime." },
        { tone: 'flirty', t: "Then let me ask properly. May I kiss you?", r: "May you... yes. Oh. That was soft. That was... I'm going to write about that until the pen runs dry." },
      ] },
    ] },
  { id: 'emotional-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "I save my truest questions for late at night, but I can't wait that long. Can I ask one now? What do you want? With us. Be honest.",
    opts: [
      { tone: 'cold', t: "I'm not sure there's an us.", r: "Oh. I thought... okay. I asked for honest. I didn't know it would feel like a door closing on my fingers.", opts: [
        { tone: 'cold', t: "Sorry. That's the honest answer.", r: "Then thank you for it. I'm going to go and fall apart a little at home. I'll be okay. Later. Much later." },
        { tone: 'passive', t: "I mean, I don't know what it is yet.", r: "Not knowing is okay. Not knowing has room in it. I can live in not knowing for a bit. Just don't make it a wall." },
        { tone: 'flirty', t: "I lied. There's an us. I'm just scared of it.", r: "Scared of it? I'm terrified of it. And I want it so much. Okay. Then we're two scared people. That's an us." },
      ] },
      { tone: 'passive', t: "I want to see where this goes. With you.", r: "With me. Not just somewhere. With me. Okay. That's the answer I've been asking the moon for.", opts: [
        { tone: 'cold', t: "Let's not get carried away.", r: "I'm already carried. I'm halfway down the river. You can stand on the bank if you want. I'll wave sadly." },
        { tone: 'passive', t: "Slowly. Carefully. But yes.", r: "Slowly and carefully. I'm terrible at both. But for you I'll learn. That's another promise. I'm collecting them." },
        { tone: 'risque', t: "And right now, I want to kiss you.", r: "Right now? Oh. My heart's not ready. It's not ready but it's saying yes. Okay. Yes. Softly." },
        { tone: 'flirty', t: "Somewhere with a lot more moments like this.", r: "More moments like this. Quiet and true. I'd give anything for a hundred more. A thousand. All of them." },
      ] },
      { tone: 'flirty', t: "What I want? I'd rather show you.", r: "Show me? How? Oh... you're leaning in. Slow down, you're three corners ahead of me. Okay. Lean a little more.", opts: [
        { tone: 'cold', t: "Kidding. Not tonight.", r: "Not tonight. Okay. My heart was already halfway there. Now it's standing in the road. That hurt, a lot." },
        { tone: 'passive', t: "Okay. Not tonight. When you're ready.", r: "When I'm ready. You'd wait for me. Nobody waits for me. I'm going to cry, and it's going to be the good kind." },
        { tone: 'risque', m: 2, t: "A little more. And a little more.", r: "A little... oh. That was a kiss. That was a real kiss. I can't feel my knees. I'm writing the date down." },
        { tone: 'flirty', t: "Just this much. A kiss on the cheek.", r: "On the cheek... that's the sweetest kiss I've ever had. I'm going to touch my cheek all week. I'm hopeless." },
      ] },
    ] },
  { id: 'emotional-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "I couldn't stop thinking about standing this close to you. Now I'm this close and I've forgotten every brave word I practised.",
    opts: [
      { tone: 'cold', t: "Maybe step back a bit.", r: "Oh. Okay. Stepping back. I thought we were... I'm sorry. I misread it. I feel very small right now.", opts: [
        { tone: 'cold', t: "You did misread it.", r: "Then I'll stop reading. I'll go home and close the book. You should know that broke my heart a little." },
        { tone: 'passive', t: "No, sorry. Just give me a second. This is a lot.", r: "A lot. Yes. It's a lot for me too. Let's stand here a second. Just breathe. I'll breathe with you." },
        { tone: 'flirty', t: "Not too far. Just far enough to see you properly.", r: "To see me properly. Oh. That's worse. That's so much worse for my heart. Look, then. I'm right here." },
      ] },
      { tone: 'passive', t: "Tell me one of the brave words. Any of them.", r: "Okay. 'I think I'm falling for you.' That was the first one. The others were mostly 'please' and 'yes'.", opts: [
        { tone: 'cold', t: "That's a lot to hear.", r: "It's a lot to say. I said it anyway. I'm not sorry I said it. I'm sorry it made you flinch. That hurts." },
        { tone: 'passive', t: "I think I'm falling too. Slowly.", r: "Slowly is fine. Slowly is wonderful. Fall at whatever speed you want. I'll be at the bottom, waiting." },
        { tone: 'risque', t: "'Please' and 'yes' to what, exactly?", r: "To what? Oh no. You've left my heart in the pit lane. To... a kiss. That's all. For now." },
        { tone: 'flirty', t: "Falling? Me too. Shall we fall together?", r: "Together. Yes. Hold on tight. I'm terrible at falling gracefully. I'll probably take you with me." },
      ] },
      { tone: 'flirty', t: "Then forget the words. Just come closer.", r: "Closer? Okay. This close? Oh, my heart can't keep up with you. Slow down a little. Not much. A little.", opts: [
        { tone: 'cold', t: "Actually, I should go.", r: "Go? Now? Oh. Okay. I'll stand here and feel it. I won't pretend that didn't hurt. It hurt so much." },
        { tone: 'passive', t: "Okay. Slowly. We've got time.", r: "We've got time. That's the best sentence in the world. Let's have all of it. Slowly. Thank you." },
        { tone: 'risque', m: 2, t: "Close enough to kiss you.", r: "To kiss... yes. Oh. That was... I'm going to replay that until I'm old. My heart's still on the last lap." },
        { tone: 'flirty', t: "Close enough to hear your heart.", r: "Can you hear it? It's going like the start of a race. Lights out, everything. That's what you do to me." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 9: yours (chapter end)
  { id: 'emotional-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "I need to say this, even after last time. I don't want to be someone you talk to between races. I want to be yours. Or I need to stop.",
    opts: [
      { tone: 'cold', m: -6, t: "Then maybe you should stop.", r: "Okay. I asked. You answered. I'll be honest one last time: that broke something, and I'll feel it a long while.", opts: [
        { tone: 'cold', t: "I'm sorry. It's the truth.", r: "I know. Thank you for the truth. I'll keep the good pages. I'll close the book. Look after yourself, {me}." },
        { tone: 'passive', t: "Wait. I didn't mean stop. I meant slow down.", r: "Slow down? I can do slow. I can't do nothing. If it's slow and real, I'll stay. Is it real?" },
        { tone: 'flirty', t: "I don't want you to stop. I'm just terrible at saying yes.", r: "Then say it terribly. I don't care how. Oh... you're nodding. That's a yes. That's a terrible, perfect yes." },
      ] },
      { tone: 'passive', m: 3, t: "I want that too. I've just been scared to say it.", r: "You want that too? Me, yours. And you, mine? Oh. I'm going to have to sit down on the floor.", opts: [
        { tone: 'cold', t: "Let's not put labels on it.", r: "No labels. Okay. I don't need the word. I needed the feeling. I'm not sure you gave me that either. It hurts." },
        { tone: 'passive', t: "Yes. Mine. If you'll have me.", r: "If I'll have you? You've been in my notebook for ages. Yes. Yes. I'm crying. Of course I'm crying." },
        { tone: 'risque', t: "Mine. And to prove it, come home with me.", r: "Home with you? Oh... wait, I'm still on the word 'mine'. Yes. Not tonight. Soon. Very soon. Oh, my heart." },
        { tone: 'flirty', t: "Mine. Say it back.", r: "Yours. Yours, yours, yours. I've been saying it in my head for weeks. It sounds so much better out loud." },
      ] },
      { tone: 'flirty', t: "Then be mine. No more between races.", r: "Be yours? Just like that? After last time? Don't say it unless you mean it. My heart can't take a maybe.", opts: [
        { tone: 'cold', t: "Maybe. Let's see.", r: "Maybe. I said I couldn't take a maybe. You gave me one anyway. I'm going to go and fall apart quietly." },
        { tone: 'passive', t: "I mean it. Last time was me being a coward.", r: "I believe you. I'm choosing to. That's the bravest thing I do. Okay. Yours. Gently, please. I bruise." },
        { tone: 'risque', t: "I mean it. Let me show you how much.", r: "Show me? Oh... my heart's still catching up with 'mine'. A kiss, then. One. There. Yours." },
        { tone: 'flirty', t: "No maybe. Mine. Starting now.", r: "Starting now. I'm writing the time down. Look, my hands are shaking. Yours. I'm yours. Oh, I've waited." },
      ] },
    ] },
  { id: 'emotional-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "Can I ask you something big? I don't want to just be someone you see between races anymore. I'd like to be yours. Would you want that?",
    opts: [
      { tone: 'cold', t: "I like how things are.", r: "How things are. Okay. I like them too. I just wanted more. I'm sorry I'm always wanting more. It hurts to hear no.", opts: [
        { tone: 'cold', t: "Then don't want more.", r: "I can't switch it off. I'll go before I cry in front of you. I'll cry anyway. I won't hide that from you." },
        { tone: 'passive', t: "I like things. But I could want more. Give me time.", r: "Time. I can give you time. I'll put 'not yet' in my notebook instead of 'no'. 'Not yet' has a door in it." },
        { tone: 'flirty', t: "Things are good. You as mine would be better.", r: "As mine? Oh. You did that on purpose. You scared me and then you caught me. I'm yours. Yes." },
      ] },
      { tone: 'passive', m: 3, t: "Yes. I want that.", r: "You want that. Just like that. I've written this moment in my head a hundred times and you made it so simple.", opts: [
        { tone: 'cold', t: "Don't make a big thing of it.", r: "It is a big thing. The biggest. You don't have to feel it like I do. But please don't make it small." },
        { tone: 'passive', t: "It is simple. You and me.", r: "You and me. It's going on the first page of a new notebook. In the middle. With nothing else on it." },
        { tone: 'risque', t: "And I want you to stay the night sometime soon.", r: "Stay the night? Oh, my heart's only just heard 'yes'. Sometime soon. Yes. Oh, I'm so red." },
        { tone: 'flirty', t: "I've wanted it since your first flustered hello.", r: "My first flustered hello? I remember it! I was holding my breath. I'm holding it again. Yours. Oh." },
      ] },
      { tone: 'flirty', t: "I thought you'd never ask.", r: "You were waiting for me? All this time I've been scared and you were waiting? Oh. The tears are coming.", opts: [
        { tone: 'cold', t: "I wasn't waiting. I'm just not surprised.", r: "Not surprised. Oh. I gave you my whole heart and you weren't surprised. That's somehow worse than no." },
        { tone: 'passive', t: "I was. Yes. I want to be yours too.", r: "Yours too. Both ways. I'm going to remember this exact minute for the rest of my life. And the date." },
        { tone: 'risque', t: "Waiting, and imagining. A lot.", r: "Imagining? A lot? Oh... I can't keep up. Not here. Not now. But... yes. I've imagined too." },
        { tone: 'flirty', t: "Since the first time you blushed at me.", r: "Since then? That was so long ago! Oh, all that time. Come here. You're mine now. I'm saying it. Mine." },
      ] },
    ] },
  { id: 'emotional-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "I've rehearsed this all week, so let me get it out. I'm done being someone you see between races. Yours, properly. That's what I want.",
    opts: [
      { tone: 'cold', t: "That's a lot of pressure.", r: "Is it? I'm sorry. I'm not trying to pressure you. I'm trying to be brave. It seems to come out the same.", opts: [
        { tone: 'cold', t: "It does.", r: "Okay. Then I'll stop being brave for a while. It hurts too much when it lands like this. Go gently, {me}." },
        { tone: 'passive', t: "Sorry. It's not pressure. It's just big. Yes, though.", r: "Yes? You said yes after all that? Oh, I can't breathe properly. I'm laughing and crying at the same time." },
        { tone: 'flirty', t: "Pressure I like. Ask me again, slower.", r: "Slower. Okay. Will you... be mine? There. I did it slowly. You're smiling. Tell me that's a yes." },
      ] },
      { tone: 'passive', t: "Properly? What does properly look like?", r: "Calling you mine. You calling me yours. Dinners, mornings, the hard days too. Not just the good bits.", opts: [
        { tone: 'cold', t: "That sounds like a lot of work.", r: "It is work. Love is work. I want to do it with you. I'm sorry it sounded like a chore to you. I'm stung." },
        { tone: 'passive', t: "That looks good. Let's do it.", r: "Let's do it. As simple as that? Okay. Yes. I'm writing 'day one' on my hand so I don't forget." },
        { tone: 'risque', t: "Mornings sound good. Starting with tomorrow's.", r: "Tomorrow's morning? Oh, you're... my heart's still at the word 'yes'. Soon. I promise. Soon." },
        { tone: 'flirty', t: "That looks like everything I want.", r: "Everything you want. I'm everything you want? You can't take that back now. It's written. I'm yours." },
      ] },
      { tone: 'flirty', t: "Then let me make it easy. You're mine.", r: "I'm yours. You said it first! I practised all week and you just said it. Oh, I'm crying. Naturally I'm crying.", opts: [
        { tone: 'cold', t: "Don't cry. It's not that big a deal.", r: "It is to me. It's the biggest deal. You just made it small, right as I was holding it. That hurts." },
        { tone: 'passive', t: "And I'm yours. Properly.", r: "Properly. Both of us. I'm going to need a new notebook. This one's full of almost. The next one's full of us." },
        { tone: 'risque', t: "Mine. And I intend to keep you up late.", r: "Up late? Oh, my heart's still on the start line and you're halfway round the lap. Yes. Later. Yes." },
        { tone: 'flirty', t: "Mine. And I'm never letting you forget it.", r: "Never? Good. Remind me every day. Remind me twice on bad days. I'll remind you back. Forever. Yours." },
      ] },
    ] },
];
