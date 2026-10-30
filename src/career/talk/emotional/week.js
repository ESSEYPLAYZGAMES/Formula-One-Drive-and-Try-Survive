// Emotional - texts in the week between races. Stages new / warm / close, slots 1..6, three opening moods each.
// new: 1 a pink sunset - 2 crying at a film - 3 a 2am question* - 4 Moth the cat - 5 rain on the window - 6 the notebook*
// warm: 1 a dream - 2 a song that's you - 3 the anxious double text* - 4 nerves before {track} - 5 missing you anyway - 6 'what are we?'*
// close: 1 your jacket - 2 counting the days - 3 a photo of you with someone* - 4 3am fears - 5 window seats - 6 an anniversary, 'I love you'*
// (* = two exchanges)
export const DATA = [
  // ================================================================================================ NEW
  // ---- 1: the sunset
  { id: 'emotional-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: "Hi... I nearly didn't text after last time. But the sunset tonight was so pink I had to tell someone. I picked you.",
    opts: [
      { tone: 'cold', t: "Okay.", r: "Okay. Right. I'll keep my sunsets to myself, then. Sorry for bothering you." },
      { tone: 'passive', t: "It was nice. I saw it too.", r: "You saw it too? Then we were under the same sky. That's enough for me tonight. Thank you for answering." },
      { tone: 'flirty', t: "You picked me? Good choice.", r: "I think so too. I'm smiling at my phone like an idiot. Goodnight. Look up if you can ♡" },
    ] },
  { id: 'emotional-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: "Is it weird that I'm texting? I nearly didn't. The sky's doing a pink thing and I thought of you. Sorry. Hi.",
    opts: [
      { tone: 'cold', t: "A bit weird, yes.", r: "Oh. Okay. Sorry. I'll stop. I just wanted to share something pretty. Night." },
      { tone: 'passive', t: "Not weird. Hi. Sending a sky back.", r: "Yours is orange! Ours are different colours and somehow the same. I love that. Hi. Hi back." },
      { tone: 'flirty', t: "Not weird. You can text me every sunset.", r: "Every sunset? Careful, I'll hold you to that. There's one every day. That's a lot of me." },
    ] },
  { id: 'emotional-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: "The sunset tonight was the exact colour you made my face go when we met. I'm just saying. Hi ♡",
    opts: [
      { tone: 'cold', m: -3, t: "Bit cheesy.", r: "Cheesy. Okay. I felt brave for about a minute there. Never mind. Goodnight." },
      { tone: 'passive', t: "Ha. What colour was that?", r: "A sort of hot pink with a hint of 'oh no'. You'd know. You were there. Hi again." },
      { tone: 'flirty', t: "I'd like to see that colour again. Soon.", r: "Soon? Oh no, it's happening right now, on my sofa, alone. You did this from miles away. Impressive." },
    ] },
  // ---- 2: a sad film
  { id: 'emotional-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: "Hey. Watching a sad film and crying, which is normal for me. It made me want to text you, even after last time. Okay?",
    opts: [
      { tone: 'cold', t: "I'm busy.", r: "Okay. Sorry. I'll go back to crying on my own. That's fine. I'm used to it." },
      { tone: 'passive', t: "It's okay. Which film?", r: "The one about the lighthouse keeper. I've seen it eleven times. Still sobbing. You asked, which helps." },
      { tone: 'flirty', t: "Always okay. Want me to cry with you?", r: "You'd cry with me? Over text? Okay, you've made it worse. The nice sort of worse." },
    ] },
  { id: 'emotional-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: "Quick question while I sob into a cushion: what film makes you cry? Mine's the lighthouse one. Eleventh time tonight.",
    opts: [
      { tone: 'cold', t: "Films don't make me cry.", r: "None at all? That makes me feel very soggy and alone over here. Okay. Never mind." },
      { tone: 'passive', t: "Honestly? Ones about dogs.", r: "DOGS. Yes. Every time. We're the same. I'm adding that to the list of things I know about you." },
      { tone: 'flirty', t: "None. But I'd watch yours if you held my hand.", r: "If I held your hand? Now I'm crying for a completely different reason. Stop it. Don't stop it." },
    ] },
  { id: 'emotional-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: "Watching the lighthouse film for the eleventh time, crying, and all I can think is you'd laugh at me. Kindly. Right?",
    opts: [
      { tone: 'cold', t: "Probably not kindly.", r: "Oh. Then I'll cry without you. It's what I usually do. I'd hoped tonight would be different." },
      { tone: 'passive', t: "Kindly. Always. What's it about?", r: "A keeper lights the lamp every night for a boat that might not come back. It's about hope. Hope is my whole personality." },
      { tone: 'flirty', t: "Kindly. Then I'd steal the remote and hold you.", r: "Steal the remote AND hold me? That's the dream. That's the actual dream. I'm a puddle." },
    ] },
  // ---- 3: 2am (two exchanges)
  { id: 'emotional-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: "It's 2am and I can't sleep. Can I ask you something real? Was it me, last time? I keep going over it.",
    opts: [
      { tone: 'cold', t: "It's 2am. Go to sleep.", r: "I would if I could. Okay. I'll stop. I just needed to know if it was me.", opts: [
        { tone: 'cold', t: "It doesn't matter.", r: "It matters to me. But okay. Goodnight. I'll lie here and wonder." },
        { tone: 'passive', t: "It wasn't you. Bad day. Sleep.", r: "Okay. Thank you. I think I can sleep now. Night, {me}." },
        { tone: 'flirty', t: "It wasn't you. You're the good part of my week.", r: "The good part? Oh. I'm definitely not sleeping now. But it's a happy awake ♡" },
      ] },
      { tone: 'passive', t: "It wasn't you. I was tired.", r: "Thank you. Sorry for the 2am text. My brain gets loud at night. Are you ever up this late?", opts: [
        { tone: 'cold', t: "No. I sleep fine.", r: "Lucky. Okay. I'll let you get back to it. Sorry again." },
        { tone: 'passive', t: "Sometimes. Before races, mostly.", r: "Before races... text me next time. I'll keep you company. 2am club. Members: two." },
        { tone: 'flirty', t: "I am now. Someone's texting me.", r: "Oh no, I've woken you! But you're smiling, I can tell. I can hear it in the text. Night ♡" },
      ] },
      { tone: 'flirty', t: "Not you. I'm glad you texted. Ask me anything.", r: "Anything? Okay... what do you think about when you can't sleep?", opts: [
        { tone: 'cold', t: "Nothing. I don't do this.", r: "Okay. Sorry. Too deep for 2am. I'll go back to staring at my ceiling." },
        { tone: 'passive', t: "The next race. Always the next race.", r: "Always the next one. I'll think about it with you, then. Two people worrying is lighter than one." },
        { tone: 'flirty', t: "Lately? Someone who texts me at 2am.", r: "Stop. STOP. You can't say that to an insomniac. I'll be awake till dawn now. Worth it." },
      ] },
    ] },
  { id: 'emotional-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: "2am question, because I can't sleep: what's something you've never told anyone? You can lie. I'll know, but you can.",
    opts: [
      { tone: 'cold', t: "I'm not doing this at 2am.", r: "Fair. Sorry. My 2am brain has no manners. I'll let you sleep.", opts: [
        { tone: 'cold', t: "Thanks.", r: "Okay. Night. I'll tell the ceiling my secrets instead." },
        { tone: 'passive', t: "Ask me again in daylight.", r: "Deal. I'll save it. I'll save a whole list. Goodnight, {me}." },
        { tone: 'flirty', t: "Tell me yours first. Then maybe.", r: "Mine? When I can't sleep, I chat to the moon. Out loud. There. Now you have to answer. Rules." },
      ] },
      { tone: 'passive', t: "Okay. I'm still a bit scared of the dark.", r: "You are? Oh, {me}. I'll never tell. I'll keep it like a little light.", opts: [
        { tone: 'cold', t: "Pretend I never typed that.", r: "It isn't a thing. It's a gift. But okay. I'll hold it quietly." },
        { tone: 'passive', t: "Your turn.", r: "I've got boxes of letters I've never sent. To people, to places. Maybe one day to you." },
        { tone: 'flirty', t: "Keep me company in the dark, then.", r: "Every night you need it. Just text. I'm always awake. I'll be your nightlight. A chatty one." },
      ] },
      { tone: 'flirty', t: "That I think about you way more than I should.", r: "...okay, that's not a secret anymore. That's a confession. I'm sitting up in bed now. Say more.", opts: [
        { tone: 'cold', t: "That's all you're getting.", r: "That's all? I'll hold on to it anyway. You could've been softer about it, though." },
        { tone: 'passive', t: "Just... more than I planned to.", r: "More than you planned. The nicest thing anyone's said to me at 2am. Night ♡" },
        { tone: 'flirty', t: "More. And I think you feel it too.", r: "I do. I really, really do. Okay. I'm going to lie here grinning at the ceiling now. Goodnight." },
      ] },
    ] },
  { id: 'emotional-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: "Can't sleep. Thinking about you. Is that too honest for 2am? It feels like the right time for honest.",
    opts: [
      { tone: 'cold', t: "It's a bit much.", r: "Oh. Sorry. 2am me has no filter. Daytime me would've been more careful.", opts: [
        { tone: 'cold', t: "Get some sleep.", r: "Okay. I'll try. Goodnight. I won't text at 2am again." },
        { tone: 'passive', t: "It's okay. What were you thinking?", r: "Whether you meant your smile when we last talked. Silly, I know. Night brain." },
        { tone: 'flirty', t: "A bit much. I liked it though.", r: "You liked it? Then I'll be a bit much at 2am more often. Fair warning ♡" },
      ] },
      { tone: 'passive', t: "2am is honest o'clock. What's on your mind?", r: "You. And whether I'm too much. Someone once told me I was. I think about that at night.", opts: [
        { tone: 'cold', t: "Maybe a bit.", r: "Okay. I asked. Thank you, I suppose. I'm going to put my phone down now." },
        { tone: 'passive', t: "You're not. Sleep, okay?", r: "Okay. I'll try. You're kinder than you let on. Night." },
        { tone: 'flirty', t: "Not too much. Just enough to keep me up.", r: "Just enough to keep you up. I'm saving that one. In my notebook. At 2am. Goodnight ♡" },
      ] },
      { tone: 'flirty', t: "Not too honest. I'm thinking about you too.", r: "You are? At 2am? Oh, I'm wide awake now. My heart's doing a whole thing.", opts: [
        { tone: 'cold', t: "Kidding. Go to sleep.", r: "Oh. Kidding. That was a hard one to hear at 2am. Goodnight." },
        { tone: 'passive', t: "Honestly. Now sleep. Both of us.", r: "Both of us. Okay. Eyes closed. Thinking of you. That's allowed." },
        { tone: 'flirty', t: "Tell me what your heart's doing.", r: "Running laps. Fast ones. Your kind. Okay, I need to sleep before I say something bigger." },
      ] },
    ] },
  // ---- 4: Moth
  { id: 'emotional-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: "Hi. My cat Moth knocked my phone off the table and it opened on your name. I'm taking it as a sign. Despite last time.",
    opts: [
      { tone: 'cold', t: "Tell your cat to stop.", r: "Ha. Okay. I'll tell her. Sorry. I'll leave you alone." },
      { tone: 'passive', t: "Hi. Moth? Cute name.", r: "Grumpy, one ear, perfect. She sits by the lamp all night, hence Moth. Thank you for saying hi back." },
      { tone: 'flirty', t: "Your cat has excellent taste.", r: "She does! She's never wrong. Okay, I'm smiling. Moth gets extra treats tonight." },
    ] },
  { id: 'emotional-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: "Meet Moth. One ear, grumpy face, rescue cat, love of my life. She's glaring at the rain. Thought you'd want to know.",
    opts: [
      { tone: 'cold', t: "Not a cat person.", r: "Oh. Okay. More Moth for me, then. Sorry to bother you." },
      { tone: 'passive', t: "She looks like she's plotting something.", r: "She always is. Mostly breakfast at 4am. Sometimes revenge. Usually both." },
      { tone: 'flirty', t: "She's cute. Her owner's cuter.", r: "Her owner is now hiding behind the sofa. Moth is unimpressed by my blushing. She's seen it before." },
    ] },
  { id: 'emotional-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: "Moth (my one-eared cat, my whole heart) is asleep on my chest and I can't move. So I'm texting you. Lucky you ♡",
    opts: [
      { tone: 'cold', t: "Lucky me.", r: "Oh, that sounded sarcastic. Was it? I'll let you go. Sorry." },
      { tone: 'passive', t: "Ha. Send a picture.", r: "Here. That's her squashed face. I'm pinned. Send help. Or don't. I quite like it here." },
      { tone: 'flirty', t: "Lucky Moth, more like.", r: "Lucky Moth?! Are you jealous of my cat? I'm grinning so hard she's bouncing on my chest." },
    ] },
  // ---- 5: rain
  { id: 'emotional-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: "It's raining. I love rain on the window. It makes me brave enough to ask: are we okay? Last time felt off.",
    opts: [
      { tone: 'cold', t: "We're fine. Don't overthink it.", r: "Okay. Fine. I'll try not to. It's hard for me. Goodnight." },
      { tone: 'passive', t: "We're okay. I was off, not you.", r: "Thank you. That helps more than you know. Listen to the rain if you can. It's lovely tonight." },
      { tone: 'flirty', t: "More than okay. Rain makes me think of you too.", r: "It does? Then every time it rains we'll both be thinking. That's a lot of rain. Lucky us." },
    ] },
  { id: 'emotional-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: "It's raining here and I'm by the window with tea, just listening. It's my favourite sound. What's yours?",
    opts: [
      { tone: 'cold', t: "Don't have one.", r: "Everyone has one. Maybe you'll tell me when you find it." },
      { tone: 'passive', t: "An engine at full revs. Sorry. Driver answer.", r: "Not sorry at all. That's honest. I'll listen to one and think of you. Rain and engines. Us." },
      { tone: 'flirty', t: "Your laugh. Not sorry.", r: "My laugh?! The snorty one? You can't say that while I'm drinking tea. It went everywhere. Worth it." },
    ] },
  { id: 'emotional-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: "Rain on the window, cosy socks, and I keep wondering what you'd look like in this light. That's all. Hi ♡",
    opts: [
      { tone: 'cold', t: "Wet, probably.", r: "Wet. Ha. I made it soft and you made it a joke. That's fine. I'll go." },
      { tone: 'passive', t: "Tired, probably. Long week.", r: "Then you'd be tired here, under a blanket, with tea. I'm only saying. It's a good window." },
      { tone: 'flirty', t: "Happy. That's what I'd look like.", r: "Happy. Oh. Now I'm imagining it and the rain's not even the best part anymore." },
    ] },
  // ---- 6: the notebook (two exchanges)
  { id: 'emotional-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: "I wrote about you in my notebook tonight. I wasn't sure last time was a moment worth keeping. I want the next one to be.",
    opts: [
      { tone: 'cold', t: "Don't write about me.", r: "Okay. I'll stop. Writing is how I keep things. I'm sorry it bothers you.", opts: [
        { tone: 'cold', t: "It really does.", r: "Okay. Then the page stays blank. Goodnight, {me}." },
        { tone: 'passive', t: "Sorry. It doesn't. I'm just private.", r: "That's okay. I'll write you in pencil. Faint. Just for me. That's a promise." },
        { tone: 'flirty', t: "Unless you write something nice.", r: "It's always nice. Even the sad pages are nice about you. Okay. I'm writing. Something nice." },
      ] },
      { tone: 'passive', t: "Go on. What's written there?", r: "That I want to know you better. That last time felt cold, and I hope the next won't. Honest stuff.", opts: [
        { tone: 'cold', t: "That's a lot.", r: "It is a lot. I'm a lot. I'll close the notebook. Night, then." },
        { tone: 'passive', t: "The next won't be cold. Promise.", r: "A promise in writing. Well, in a text. I'm copying it into the notebook. Thank you." },
        { tone: 'flirty', t: "Write: 'next time, they made me blush'.", r: "Bold of you. I'll write it now and you'll have to make it true. Deal? Deal ♡" },
      ] },
      { tone: 'flirty', t: "Make the next page a good one. I'll help.", r: "You'll help? Then I'll leave it blank until I see you. A whole page, just waiting.", opts: [
        { tone: 'cold', t: "Don't wait on me.", r: "Oh. Okay. I'll fill it with something else, then. Rain, maybe." },
        { tone: 'passive', t: "Just a page. Don't make it a book.", r: "One page. I'll try. I'm bad at one page. You'll see." },
        { tone: 'flirty', t: "Leave two pages.", r: "Two pages! I'm drawing a little star on both. You have to fill them. Soon." },
      ] },
    ] },
  { id: 'emotional-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: "Confession: you're in my notebook. I write down the moments I don't want to lose. You've been in there a lot lately.",
    opts: [
      { tone: 'cold', t: "Bit intense, that.", r: "Maybe. I'm a bit intense. I'm sorry. I'll try to be... less. It's hard.", opts: [
        { tone: 'cold', t: "Try a bit harder.", r: "That one hurt. I'll put the notebook away. Goodnight." },
        { tone: 'passive', t: "Sorry. It's just new for me.", r: "That's okay. New is scary. I'll go slow. I'll write slowly, too." },
        { tone: 'flirty', t: "Intense, but I kind of like it.", r: "You kind of like it? Kind of is plenty. I'm writing 'they kind of like it'. Underlined." },
      ] },
      { tone: 'passive', t: "What sort of moments?", r: "Your laugh. How you look at the sky before a race. A thing you said that I can't stop thinking about.", opts: [
        { tone: 'cold', t: "You think too much.", r: "I do. That's me. I'm sorry it's not your thing." },
        { tone: 'passive', t: "What thing did I say?", r: "That I was easy to talk to. You probably don't remember. I do. I always do." },
        { tone: 'flirty', t: "Keep writing. I'll keep giving you material.", r: "Promise? I'm buying a bigger notebook. This one's running out of room for you." },
      ] },
      { tone: 'flirty', t: "A lot lately? Read me a line.", r: "'Their smile does a thing to my chest I can't describe, and I describe everything.' There.", opts: [
        { tone: 'cold', t: "Oof. That's heavy.", r: "Oh. I read you my heart and that's... okay. Never mind." },
        { tone: 'passive', t: "That's lovely. Really.", r: "You think so? I've never read anyone a line before. I'm shaking a bit. The happy kind." },
        { tone: 'flirty', t: "Write another one. About tonight.", r: "'They asked for a line, so I gave them my whole heart.' Goodnight, before I combust ♡" },
      ] },
    ] },
  { id: 'emotional-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: "A whole page of my notebook is you tonight. I write down the moments I want to keep. You're becoming a lot of moments ♡",
    opts: [
      { tone: 'cold', t: "Slow down.", r: "Okay. I'm sorry. I go fast when I feel things. I'll slow down. I'll try.", opts: [
        { tone: 'cold', t: "Thanks for that.", r: "Okay. Goodnight. I'll close the notebook for a bit." },
        { tone: 'passive', t: "It's fine. Just new to me.", r: "New is okay. I'll wait for you to catch up. Waiting is my one talent." },
        { tone: 'flirty', t: "Slow down so I can catch up. I'm close behind.", r: "Close behind? Then I'll walk slower. You run faster. We'll meet in the middle." },
      ] },
      { tone: 'passive', t: "A whole page? What's on it?", r: "Things you said. Things your face said when you didn't. A little drawing. Don't ask about the drawing.", opts: [
        { tone: 'cold', t: "Okay, I won't.", r: "Oh. I meant ask about it. Never mind. Goodnight." },
        { tone: 'passive', t: "What's the drawing of?", r: "You. Badly. With a helmet. And a very big smile. It's not a good drawing. It's a happy one." },
        { tone: 'flirty', t: "I'm asking about the drawing.", r: "Of course you are. It's you, smiling. With a heart next to it. Now you know. I'm hiding." },
      ] },
      { tone: 'flirty', t: "Keep going. I want to be a whole notebook.", r: "A whole notebook? That'd take ages. Is that... are you staying? Say yes.", opts: [
        { tone: 'cold', t: "Let's not get ahead of ourselves.", r: "Okay. Not ahead. I'll stay on this page. It's a good page anyway." },
        { tone: 'passive', t: "I'm staying put.", r: "Staying put. I'm writing that at the top of a fresh page. In capitals." },
        { tone: 'flirty', t: "Yes. Buy more notebooks.", r: "YES. I'm ordering three. With little suns on. Every page has room for you." },
      ] },
    ] },
  // ================================================================================================ WARM
  // ---- 1: a dream
  { id: 'emotional-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: "I dreamt about you. We were just walking, nothing weird. I woke up sad because last time felt cold. Morning, I guess.",
    opts: [
      { tone: 'cold', t: "It was just a dream.", r: "I know. They're not just dreams to me. Okay. Morning." },
      { tone: 'passive', t: "Morning. Last time was my fault. What was the walk like?", r: "Slow. By the sea. You laughed at a seagull. I woke up smiling till I remembered. Thanks for asking." },
      { tone: 'flirty', t: "Morning. Was I a good walker?", r: "The best. You held my hand at the end. Don't tell me if that's too much. I'm keeping it." },
    ] },
  { id: 'emotional-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: "Morning! I dreamt we were walking by the sea and you kept stopping to look at me. Nothing weird. Just nice.",
    opts: [
      { tone: 'cold', t: "Weird dream.", r: "Oh. Okay. I thought it was lovely. Never mind. Have a good day." },
      { tone: 'passive', t: "Morning. Sounds peaceful.", r: "It was. I wish real life had more of that. More sea. More you. Okay. Coffee time." },
      { tone: 'flirty', t: "Stopping to look at you sounds about right.", r: "About right?! It's 7am, you can't say that before I've had coffee. My face is boiling." },
    ] },
  { id: 'emotional-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Good morning. I dreamt you were holding my hand and it felt so real I reached for it again when I woke up ♡",
    opts: [
      { tone: 'cold', t: "Okay then.", r: "Okay. I'll... go make coffee. Just 'okay' is a bit of a cold shower." },
      { tone: 'passive', t: "Morning. That's sweet.", r: "Sweet. I'll take sweet. It's a sweet-ish morning now. Have a good one." },
      { tone: 'flirty', t: "Next time, it won't be a dream.", r: "NEXT TIME. Okay. I'm awake now. Fully. Every part of me. Good morning to you too." },
      { tone: 'risque', t: "What else happened in the dream?", r: "Nothing! Well. Almost nothing. Slow down, it's too early for my heart to run that fast. Morning ♡" },
    ] },
  // ---- 2: a song
  { id: 'emotional-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: "A song came on in a shop and it was so you I froze. I've been scared to text after last time. Here it is anyway.",
    opts: [
      { tone: 'cold', t: "I'll listen later.", r: "Later. Okay. If you do. It's fine if you don't. It mattered to me, that's all." },
      { tone: 'passive', t: "Adding it to my driving music. Thanks.", r: "Really? It's in your car now? That's a little bit of me riding along. I'm glad." },
      { tone: 'flirty', t: "So I'm a song now? Which part is me?", r: "The chorus. The bit where it goes up and your heart goes with it. Oh. I said too much." },
    ] },
  { id: 'emotional-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: "Every song is about you this week. It's very inconvenient. I cried in a supermarket. Here's the worst offender.",
    opts: [
      { tone: 'cold', t: "That's a lot of crying.", r: "It is. I'm a crier. You know that by now. Sorry." },
      { tone: 'passive', t: "Listening now. It's good.", r: "It's good? Then I've got sixteen more. I'm making you a whole playlist. Too late to stop me." },
      { tone: 'flirty', t: "Which line made you cry?", r: "'I'd wait at every window.' I'm a window waiter. For you. Oh, I'm being so much. Leave me be." },
      { tone: 'risque', t: "Play it for me sometime. Lights low.", r: "Lights low? You can't type that while I'm in the cereal aisle. My heart's three aisles behind you." },
    ] },
  { id: 'emotional-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: "Seventeen songs, one playlist, all for you. Title: 'music for when you go fast and I hold my breath' ♡",
    opts: [
      { tone: 'cold', t: "Long title.", r: "Long feeling. Okay. You don't have to listen." },
      { tone: 'passive', t: "I'll listen on the next flight.", r: "On the plane, above the clouds, listening to me? That's the best thing I've heard all day." },
      { tone: 'flirty', t: "Seventeen songs, all about me?", r: "All about you. Track nine especially. You'll know. You'll blush. Good." },
    ] },
  // ---- 3: the double text (two exchanges)
  { id: 'emotional-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: "Hey. You've been quiet since last time. ... Sorry. Double text. Did I do something? I'd rather know than guess.",
    opts: [
      { tone: 'cold', t: "I've been busy. Stop texting.", r: "Okay. I'll stop. That one hurt to read, honestly. I'll wait for you to text me.", opts: [
        { tone: 'cold', t: "Good. Do that.", r: "Okay. Goodnight, {me}." },
        { tone: 'passive', t: "Sorry. That was harsh. Just a busy week.", r: "Busy. I can live with busy. I'll breathe now." },
        { tone: 'flirty', t: "Sorry. Busy, but thinking about you.", r: "Thinking about me? Then I'll stop panicking. I panic when people go quiet. Thank you." },
      ] },
      { tone: 'passive', t: "You didn't do anything. Just busy. Sorry.", r: "Thank you. Sorry for the double text. Silence gets loud for me. Someone left once without a word.", opts: [
        { tone: 'cold', t: "That's not my problem.", r: "No. I know. I was explaining me. Sorry." },
        { tone: 'passive', t: "That's awful. I'll text more.", r: "You will? Oh, that helps. I'll try to double text less. Try." },
        { tone: 'flirty', t: "I'm here to stay. Double text me anytime.", r: "Anytime? Careful. I'll triple text. I'll send you every cloud. You've been warned ♡" },
      ] },
      { tone: 'flirty', t: "You did nothing. I just wanted you to miss me.", r: "Well, it worked. Far too well. I'm on the sofa holding my phone like a puppy.", opts: [
        { tone: 'cold', t: "Ha. Okay, I'm busy now.", r: "Oh. Go, then. I'll be fine. I'll be... fine." },
        { tone: 'passive', t: "Sorry. I'll text first next time.", r: "First? You'll text first? I'll try not to stare at my phone waiting. I'll fail." },
        { tone: 'flirty', t: "Did you miss me?", r: "So much it's embarrassing. I wrote you three texts and deleted them. This is the fourth." },
      ] },
    ] },
  { id: 'emotional-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: "Sorry, me again. You didn't reply yesterday and my brain went everywhere. ... Ignore me. I'm fine. Mostly.",
    opts: [
      { tone: 'cold', t: "You need to relax.", r: "I know. I'm trying. I'm not good at silence. Sorry to be a pest.", opts: [
        { tone: 'cold', t: "It's fine.", r: "Okay. Fine. Goodnight then." },
        { tone: 'passive', t: "Sorry. I'll reply quicker.", r: "You don't have to. I just... thank you. My chest just unclenched." },
        { tone: 'flirty', t: "Sorry. Your texts are my favourite part of the day.", r: "Favourite part? Okay. Okay. I'm not panicking anymore. I'm glowing." },
      ] },
      { tone: 'passive', t: "Sorry, long day. Not ignoring you.", r: "It's a silly fear, I know. Someone once left me with just a note, so silence scares me.", opts: [
        { tone: 'cold', t: "That's a lot to put in a text.", r: "It is. Sorry. I'll keep my ghosts to myself." },
        { tone: 'passive', m: 2, t: "Not silly. I'll always say goodnight.", r: "Always? Then goodnight. See? That's how it works. I'll sleep better." },
        { tone: 'flirty', t: "I'd never leave a note. I'd turn up and tell you.", r: "Turn up and tell me? Weirdly that's the most romantic thing I've heard. I'm fine now. Really." },
      ] },
      { tone: 'flirty', t: "Your brain went everywhere? Did it come to me?", r: "Mostly to you. Some to the moon. A bit to the fridge, which is a long story.", opts: [
        { tone: 'cold', t: "Not interested in long stories.", r: "Okay. I'll keep it short, then. Bye for now." },
        { tone: 'passive', t: "Tell me the fridge story sometime.", r: "Sometime. In person. It needs a hug at the end. Okay. Night ♡" },
        { tone: 'flirty', t: "Bring it back to me. I'll keep it.", r: "Keep my brain? It's very loud. But okay. It's yours. Look after it." },
        { tone: 'risque', t: "Come over and tell me in person.", r: "Come over? Now? Slow down, my heart's two texts behind. Not tonight. But I'm thinking about it." },
      ] },
    ] },
  { id: 'emotional-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: "Hi. Hi. Sorry, double text. I just missed you and you weren't answering and my heart got silly. Hi ♡",
    opts: [
      { tone: 'cold', t: "I was asleep.", r: "Oh. Sorry. I woke you, didn't I? I'll go.", opts: [
        { tone: 'cold', t: "Yeah.", r: "Okay. Sorry. Sleep well." },
        { tone: 'passive', t: "It's fine. Hi back.", r: "Hi back. Lovely. Go back to sleep. Sweet dreams." },
        { tone: 'flirty', t: "Best way to be woken up, honestly.", r: "Really? Then I'll double text you awake more often. Kidding. Mostly ♡" },
      ] },
      { tone: 'passive', t: "Hi. Hi. Sorry, I was driving.", r: "Driving! Of course. And I'm here panicking. Hi. Hi. Drive safe always.", opts: [
        { tone: 'cold', t: "Don't text when I'm driving.", r: "I didn't know you were. Sorry. I'll wait." },
        { tone: 'passive', t: "Always. Home now.", r: "Home now. Good. Now I can breathe. I hold my breath when you drive. Even normal driving." },
        { tone: 'flirty', t: "I drove faster to get back to you.", r: "Don't! Drive slow! But also... that's very sweet. Okay. You're here. Hi." },
      ] },
      { tone: 'flirty', t: "Missed you too. Triple text me next time.", r: "Triple? You've opened a door you can't close. I'll send you so many hearts.", opts: [
        { tone: 'cold', t: "Actually, maybe not triple.", r: "Oh. Single texts only. Got it." },
        { tone: 'passive', t: "Hearts are fine. Night, though.", r: "Night. One last heart. Okay, three. ♡♡♡ Sleep well." },
        { tone: 'flirty', t: "Send them. I'm keeping count.", r: "♡♡♡♡♡. That's five. That's not even half of how I feel. Goodnight, you." },
        { tone: 'risque', t: "Send something better than hearts.", r: "Better than hearts?! No. My heart can't type that fast. Goodnight! I'm hiding under a cushion." },
      ] },
    ] },
  // ---- 4: before {track}
  { id: 'emotional-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: "I know things felt cold last time, but I'm nervous for you at {track} anyway. I can't help it. Be safe? Please.",
    opts: [
      { tone: 'cold', t: "I'm always careful.", r: "I know. I just wanted to say it. Okay. Good luck." },
      { tone: 'passive', t: "Thanks. I'll be careful.", r: "Thank you. I'll watch through my fingers. Like always. Even when things are weird." },
      { tone: 'flirty', t: "I'll drive safe for you.", r: "For me? I'm holding you to that. Every lap. I'll be counting." },
    ] },
  { id: 'emotional-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: "{track} this week. I'm already nervous. I've checked the weather like it's my job. Is there anything I can do?",
    opts: [
      { tone: 'cold', t: "Not really.", r: "Okay. I'll just worry quietly, then. Good luck out there." },
      { tone: 'passive', t: "Just watch. That's enough.", r: "I'll watch. Every lap. Through my fingers, but I'll watch. That's a promise." },
      { tone: 'flirty', t: "Send me a good luck message before the start.", r: "Every race. A long one. With hearts. You won't be able to read it all before the lights." },
    ] },
  { id: 'emotional-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Good luck at {track}! I'm sending you my bravest feelings. All of them. Carry them in your pocket ♡",
    opts: [
      { tone: 'cold', t: "I don't need luck.", r: "Oh. Okay. I'll keep the feelings, then. Good luck anyway." },
      { tone: 'passive', t: "Thanks. I'll take them.", r: "Take them all. I've got more. I make them fresh daily." },
      { tone: 'flirty', t: "I'll carry them over the line.", r: "Over the line? I'm going to cry before the race even starts. Typical me. Go get it." },
      { tone: 'risque', t: "And when I'm back, you can thank me in person.", r: "In person?! My heart is still on the formation lap. But... yes. Maybe. Go race!" },
    ] },
  // ---- 5: missing you anyway
  { id: 'emotional-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: "Can I say something? I miss you. We're not even anything yet. And last time was cold. I miss you anyway.",
    opts: [
      { tone: 'cold', t: "We're not anything, no.", r: "No. I know. I'll stop missing you out loud." },
      { tone: 'passive', t: "Miss you too. A bit.", r: "A bit. A bit is so much from you. I'll take it to bed with me." },
      { tone: 'flirty', t: "We could be something. If you wanted.", r: "If I wanted? I've wanted for weeks. Oh. I said that. I'm not taking it back ♡" },
    ] },
  { id: 'emotional-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: "Is it weird to miss someone you're not even dating? Because I do. I miss you. There. Said it.",
    opts: [
      { tone: 'cold', t: "A little weird.", r: "Okay. A little weird. I'm a little weird. Sorry." },
      { tone: 'passive', t: "Not weird. It's mutual.", r: "You do? Then we're both weird. I'm writing that in my notebook. 'We're both weird.'" },
      { tone: 'flirty', t: "Then let's fix the not-dating part.", r: "Fix it? Like... a date? A real one? Oh no, I'm pacing. Yes. Say when." },
      { tone: 'risque', t: "Miss me harder. I'll make it worth it.", r: "Harder?! My heart's a full lap down on you. Okay. I'm missing you very hard right now." },
    ] },
  { id: 'emotional-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: "I miss you. Not in a big way. In a huge way. In a 'staring at my phone hoping it's you' way. Is it you? ♡",
    opts: [
      { tone: 'cold', t: "It's me. What is it?", r: "Oh. Nothing. Just you. Never mind. Sorry." },
      { tone: 'passive', t: "It's me. Hi. Miss you too.", r: "Hi! It's you! A hi. That's the whole wish. I'm fine now. I'm better than fine." },
      { tone: 'flirty', t: "It's me. Missing you in a huge way too.", r: "Huge too? We're two huge missers. That's going to be a problem. A lovely, lovely problem." },
    ] },
  // ---- 6: what are we? (two exchanges)
  { id: 'emotional-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: "I need to ask, after last time. What is this, with us? I don't want to keep giving my heart if it's going nowhere.",
    opts: [
      { tone: 'cold', t: "I don't know. Maybe nothing.", r: "Maybe nothing. That's honest. It's also the worst thing. I need some time.", opts: [
        { tone: 'cold', t: "Take it.", r: "I will. Goodbye for now, {me}." },
        { tone: 'passive', t: "Wait. Not nothing. I'm just scared.", r: "Scared. Me too. Okay. Scared is something. Scared I can work with." },
        { tone: 'flirty', t: "I didn't mean it. It's something.", r: "Something. Then say it next time, in person. I'll be waiting. Holding my breath." },
      ] },
      { tone: 'passive', t: "I think it's going somewhere. I'm just slow.", r: "Slow is okay. I can be patient. I just needed to know it was going somewhere. Thank you.", opts: [
        { tone: 'cold', t: "Don't push.", r: "I won't. Sorry. I'll wait. Quietly." },
        { tone: 'passive', t: "It's going somewhere. Promise.", r: "A promise. I'm keeping it. In the notebook, with the date." },
        { tone: 'flirty', t: "Somewhere good. With you.", r: "With me. Somewhere good. I'm crying. Good tears. Goodnight ♡" },
      ] },
      { tone: 'flirty', t: "It's going to you. That's where.", r: "To me? That's the best answer anyone's ever given. My lungs remember how to work.", opts: [
        { tone: 'cold', t: "Calm down, it's one text.", r: "Okay. Small thing. I'll keep it small. It's big to me, though." },
        { tone: 'passive', t: "Let's talk properly next time.", r: "Properly. Face to face. I'll be brave. You be brave too." },
        { tone: 'flirty', t: "And you're coming to me. Deal?", r: "Deal. All of me. Heading your way. Look out ♡" },
        { tone: 'risque', t: "And next time I'll show you what it is.", r: "Show me?! My heart's still reading your first text. Okay. Yes. Next time." },
      ] },
    ] },
  { id: 'emotional-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: "Can I ask a big question by text, because I'm too scared to in person? What are we? I'd like to be more than this.",
    opts: [
      { tone: 'cold', t: "Let's not label it.", r: "Okay. No labels. I just need to know I'm not alone in this. Sorry.", opts: [
        { tone: 'cold', t: "Let's leave it there.", r: "Okay. Leaving it. Goodnight." },
        { tone: 'passive', t: "You're not alone in it.", r: "I'm not? Then that'll carry me through tonight. Thank you." },
        { tone: 'flirty', t: "No label. But I want more too.", r: "More too? That's a label in my heart even if it's not on paper ♡" },
      ] },
      { tone: 'passive', t: "I'd like more too.", r: "You would? I'm holding my phone with both hands. Say it again, slower.", opts: [
        { tone: 'cold', t: "Don't make me repeat it.", r: "Okay. Once. I'll make it last." },
        { tone: 'passive', t: "I'd like more. With you.", r: "With you. I'm going to sleep with that sentence under my pillow." },
        { tone: 'flirty', t: "More. Starting with a proper date.", r: "A proper date? My wardrobe's already open. Something brave." },
      ] },
      { tone: 'flirty', t: "You're mine. If you want to be.", r: "If I want to be? I've wanted to be for weeks. Yes. Yes. I'm crying on my sofa.", opts: [
        { tone: 'cold', t: "Just a thought. Don't cry.", r: "The tears just come. Sorry. I'll cry quietly, then." },
        { tone: 'passive', t: "Then let's make it official in person.", r: "In person. Yes. I want to see your face when you say it. I want to hold your hand." },
        { tone: 'flirty', t: "Mine. Now you say it.", r: "Yours. Yours. Yours. Three times so it's true. Goodnight, mine ♡" },
        { tone: 'risque', t: "Then come and be mine properly.", r: "Properly?! Oh... my heart is still on 'mine'. Yes. Soon. Very soon." },
      ] },
    ] },
  { id: 'emotional-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I've rehearsed this text all day. Here goes. I don't want to be just someone you talk to. Yours is what I want to be ♡",
    opts: [
      { tone: 'cold', t: "That's a big ask.", r: "It is. I know. I'm sorry. I'll take it back if it's too much.", opts: [
        { tone: 'cold', t: "Maybe take it back.", r: "Taken back. I'm going to put my phone down and cry. Honestly." },
        { tone: 'passive', t: "Don't take it back. Let me think.", r: "Think. I'll wait. I'll hold my breath, though." },
        { tone: 'flirty', t: "Keep it. I want the same.", r: "You want it too? You want ME? I can't type, my hands are shaking." },
      ] },
      { tone: 'passive', t: "I'd like that.", r: "You'd like that? I'm going to need to read that a hundred times.", opts: [
        { tone: 'cold', t: "No need to make a song and dance.", r: "Too late. It's a whole thing. But I'll be quiet about it." },
        { tone: 'passive', t: "Read it a hundred times. It's true.", r: "A hundred and one. It's true. I'm so happy. Goodnight, yours." },
        { tone: 'flirty', t: "I'd love it, actually.", r: "Love it. You've ruined me. Beautifully. I'm yours. Done. Decided." },
      ] },
      { tone: 'flirty', t: "You already are.", r: "I already am? Since when? You've been holding out on me! I'm so happy I'm pacing.", opts: [
        { tone: 'cold', t: "Don't overthink it.", r: "Okay. I'll read less into it. I read a lot into things, though." },
        { tone: 'passive', t: "Since a while. I just didn't say.", r: "A while! I've wasted weeks being nervous! Okay. Yours. Officially. Writing it down." },
        { tone: 'flirty', t: "Since your very first blush.", r: "That long?! Oh, you. Yours. Since the blush. Forever. Goodnight ♡" },
        { tone: 'risque', t: "And I'll prove it next time.", r: "Prove it?! You're so far ahead of my heart. Slow down. Okay, don't slow down too much." },
      ] },
    ] },
  // ================================================================================================ CLOSE
  // ---- 1: your jacket
  { id: 'emotional-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: "Morning. I'm wearing your jacket. It still smells like you. I wish last time had ended warmer. I miss you.",
    opts: [
      { tone: 'cold', t: "Can I have it back?", r: "Oh. Of course. I'll bring it. It was just... closer to you. Okay." },
      { tone: 'passive', t: "Morning. Keep it. Miss you too.", r: "Keep it? It's mine now. Thank you. My whole chest just loosened." },
      { tone: 'flirty', t: "Morning. It looks better on you anyway.", r: "You've never even seen me in it! But I'll send a picture. Maybe. If you're good." },
      { tone: 'risque', t: "Wear it tonight and I'll come take it back.", r: "Take it back... yes. Come and take it. Slowly. I'll leave the door unlocked ♡" },
    ] },
  { id: 'emotional-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: "Good morning, my favourite person. I'm in your jacket, having tea, watching the rain. All that's missing is you.",
    opts: [
      { tone: 'cold', t: "It's early.", r: "Sorry. I'll text later. Morning anyway." },
      { tone: 'passive', t: "Morning. Wish I was there.", r: "Me too. I'm saving you the warm side of the sofa. It's waiting. I'm waiting." },
      { tone: 'flirty', t: "Morning. Save me some tea and some of you.", r: "All of me is saved. Some tea, maybe. I drink fast when I miss you." },
      { tone: 'risque', t: "Wish I was the jacket right now.", r: "Wrapped around me all morning? Oh... come home and do it properly. Soon. Please ♡" },
    ] },
  { id: 'emotional-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: "Morning ♡ I slept in your jacket again. I basically live in it now. You'll have to come and rescue it.",
    opts: [
      { tone: 'cold', t: "Wash it at least.", r: "Wash it? Then it won't smell like you. That's the whole point. Never mind." },
      { tone: 'passive', t: "Morning. It's yours now.", r: "Mine! Officially! It's never leaving. You can visit it." },
      { tone: 'flirty', t: "I'll rescue it. And you.", r: "Rescue me? Yes. Please. I'm in desperate need of rescue. Mostly from missing you." },
    ] },
  // ---- 2: counting the days
  { id: 'emotional-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: "Eight days till you're home. I'm counting. Even after how last time ended. Does that mean anything to you?",
    opts: [
      { tone: 'cold', t: "I'm focused on the race.", r: "Of course. I know. I'll count quietly. Good luck." },
      { tone: 'passive', t: "It does. I'm counting too.", r: "You are? Two of us counting, then. Eight. Then seven. I'll text you every number." },
      { tone: 'flirty', t: "Eight days. Then you're not leaving my sight.", r: "Not leaving your sight. I'll make you keep that. Day one of eight, gone." },
    ] },
  { id: 'emotional-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: "Seven more sleeps till you're home. I've made a little chart. Yes, with stickers. Don't laugh.",
    opts: [
      { tone: 'cold', t: "Stickers? Really?", r: "Really. I'm a sticker person. You knew that. Okay, I'll hide the chart." },
      { tone: 'passive', t: "Not laughing. That's sweet.", r: "Sweet! Then I'll send you a photo every night. One less sticker. One step closer." },
      { tone: 'flirty', t: "Save the last sticker for me.", r: "The last sticker is a gold star. It's for you. I'll stick it right on your nose." },
      { tone: 'risque', t: "And what happens on day seven?", r: "Day seven? You come home and I don't let you leave the house for a whole day. That's the plan ♡" },
    ] },
  { id: 'emotional-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: "Six days. Six! I miss you so much I talked to your photo this morning. It didn't answer. Rude ♡",
    opts: [
      { tone: 'cold', t: "It's just a photo.", r: "I know it's a photo. I was being silly. Okay. Six days. Bye." },
      { tone: 'passive', t: "Six days. What did you say to it?", r: "That I miss you. That my cat misses you. That the jacket misses you. We're all very sad." },
      { tone: 'flirty', t: "Tell the photo I'm thinking about you.", r: "I told it. It blushed. Okay, I blushed. Six days. Hurry home." },
    ] },
  // ---- 3: the photo (two exchanges)
  { id: 'emotional-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: "I saw a photo of you laughing with someone, very close. I'm trying not to read into it. It hurt, after last time.",
    opts: [
      { tone: 'cold', t: "It was nothing. Drop it.", r: "Okay. I'll drop it. It still hurt. I wanted you to know, not to fight.", opts: [
        { tone: 'cold', t: "Noted.", r: "Noted. Okay. Goodnight, {me}." },
        { tone: 'passive', t: "Sorry. It really was nothing. I should've said.", r: "Thank you. Not a fight. Just to hear it. I'm okay now." },
        { tone: 'flirty', t: "Sorry. You're the only one I want close.", r: "The only one. I'm breathing again. Thank you for not making me feel stupid." },
      ] },
      { tone: 'passive', t: "Just a friend. Sorry it stung.", r: "I believe you. I just feel things before I think them. I'd rather say than stew.", opts: [
        { tone: 'cold', t: "You do overthink.", r: "I do. I know. I'm sorry. Night, then." },
        { tone: 'passive', t: "Always say. I'd rather know.", r: "Always. And you'll always answer like this? Then we'll be fine. We'll be so fine." },
        { tone: 'flirty', t: "You're the only one I want laughing next to me.", r: "Only me? Then I'll laugh extra loud next time. So everyone knows. Night ♡" },
      ] },
      { tone: 'flirty', t: "Jealous? You're adorable.", r: "I'm not adorable, I'm hurting a bit! But okay. A bit adorable. Tell me it was nothing.", opts: [
        { tone: 'cold', t: "You're making too much of it.", r: "Maybe. It's still mine to feel. You could be kinder with it." },
        { tone: 'passive', t: "It was nothing. Promise.", r: "I believe you. Forgive the wobble. I'm not sorry I told you, though." },
        { tone: 'flirty', t: "Nothing. And you're the only one who gets close.", r: "The only one. I'm keeping that. In my notebook. Next to your jacket." },
        { tone: 'risque', t: "Let me make it up to you when I'm home.", r: "Make it up to me... yes. When you're home. All night, until I'm certain. Make me sure ♡" },
      ] },
    ] },
  { id: 'emotional-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: "Being honest about a small thing: I saw a photo of you with someone and got a pang. Saying it so it doesn't fester.",
    opts: [
      { tone: 'cold', t: "It's nothing. Don't be jealous.", r: "I'm not trying to be. I just am, a bit. I'm telling you because I'd rather be honest. Sorry.", opts: [
        { tone: 'cold', t: "Fine.", r: "Okay. Fine. Night." },
        { tone: 'passive', t: "Okay. Thanks for telling me. It's nothing.", r: "Thank you. I feel better already. That's all it takes. Just this." },
        { tone: 'flirty', t: "Be jealous. It's cute. But it's nothing.", r: "Cute. I'll be cute about it, then. It's nothing. You're mine. That's the thing." },
      ] },
      { tone: 'passive', t: "Glad you said. It really is nothing.", r: "I believe you. I just need to hear it, that's all.", opts: [
        { tone: 'cold', t: "You always need to hear it.", r: "I do. I'm sorry. That's me. Goodnight." },
        { tone: 'passive', t: "I'll always tell you. No pang needed.", r: "No pang needed. I'll try. Thank you. I mean it." },
        { tone: 'flirty', t: "It's nothing. You're everything.", r: "Everything? Pang gone. Completely. Replaced with butterflies ♡" },
      ] },
      { tone: 'flirty', t: "A pang? I'll kiss it better when I'm home.", r: "You'd kiss my pang better? That's a very good offer. Accepted.", opts: [
        { tone: 'cold', t: "Kidding. It's just a pang.", r: "Oh. Just a pang. I'll handle it." },
        { tone: 'passive', t: "Seriously, it's nothing. Okay?", r: "Okay. I believe you. Mostly gone. A little leftover. You'll fix it." },
        { tone: 'flirty', t: "Every pang you've ever had.", r: "Every one? That's a lot of kisses. We'll need a whole weekend. Two." },
        { tone: 'risque', t: "And I'll keep going after that.", r: "After that? Yes. Keep going. Until I forget what a pang even is ♡" },
      ] },
    ] },
  { id: 'emotional-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: "So I saw a photo of you with someone and I'm only a little bit jealous. Okay, a lot. Tell me something nice ♡",
    opts: [
      { tone: 'cold', t: "You'll get over it.", r: "I will. Eventually. I wanted you to help, not tell me to get over it.", opts: [
        { tone: 'cold', t: "Night.", r: "Okay. Night, then. I'll sort my heart out alone." },
        { tone: 'passive', t: "Sorry. It was nothing. You're mine.", r: "Yours. That's the nice thing. Thank you." },
        { tone: 'flirty', t: "Sorry. Something nice: I miss you like mad.", r: "Like mad? Jealousy gone. Replaced with missing you. Equally intense ♡" },
      ] },
      { tone: 'passive', t: "It was nothing. Promise. You're the one.", r: "The one. I'm going to hold on to that. Thank you for not being annoyed.", opts: [
        { tone: 'cold', t: "I am a bit annoyed.", r: "Oh. Sorry. I'll be less... me." },
        { tone: 'passive', t: "Not annoyed. Just glad you told me.", r: "Glad? Then telling you is what I'll do. That's us. Honest." },
        { tone: 'flirty', t: "The one. The only one.", r: "The only one. I'm smiling so hard my face hurts. Goodnight, my only one." },
      ] },
      { tone: 'flirty', t: "Something nice: you're the only one I think about.", r: "The only one? That's very nice. That's extremely nice. Jealousy cured.", opts: [
        { tone: 'cold', t: "Don't be jealous again.", r: "I can't promise. I can promise to tell you. That's the best I've got." },
        { tone: 'passive', t: "Good. Sleep well.", r: "I will. For once. Thank you." },
        { tone: 'flirty', t: "Even when I'm racing. Especially then.", r: "Especially then? That's the best thing. I'm crying. Naturally. Night ♡" },
        { tone: 'risque', t: "When I'm home I'll show you exactly how much.", r: "Exactly how much? Yes. Show me. All night. I'll be waiting by the door ♡" },
      ] },
    ] },
  // ---- 4: 3am
  { id: 'emotional-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: "It's 3am. I'm scared. What if we don't work out? Last time felt so far away and I can't stop thinking about it.",
    opts: [
      { tone: 'cold', t: "Go to sleep. We're fine.", r: "Fine. I needed more than fine at 3am. But okay." },
      { tone: 'passive', t: "We're working out. Go to sleep, love.", r: "Love. You called me love. Okay. I'm sleeping now. Thank you." },
      { tone: 'flirty', t: "We'll work out. I'm not letting you go.", r: "Not letting me go. Say that every 3am. I'll sleep now. I'll try ♡" },
      { tone: 'risque', t: "If I were there I'd hold you till you forgot the fear.", r: "Hold me till I forget... yes. Come home and do exactly that. I'm counting the nights." },
    ] },
  { id: 'emotional-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: "3am fear: that one day you'll wake up and I'll be too much. Sorry. Night thoughts. I just needed to say it somewhere.",
    opts: [
      { tone: 'cold', t: "You're overthinking again.", r: "I am. I know. I'll stop. Sorry." },
      { tone: 'passive', t: "You won't be. Go to sleep.", r: "I'll try. Thank you. You always know when to say less." },
      { tone: 'flirty', t: "I'll wake up wanting more of you, not less.", r: "More, not less. Nobody's ever said that. I'm sleeping with that under my pillow." },
    ] },
  { id: 'emotional-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: "Can't sleep. 3am. Missing you and scared and in love and all of it at once. Talk to me? ♡",
    opts: [
      { tone: 'cold', t: "It's 3am. I'm sleeping.", r: "Okay. Sorry. Sleep. I'll carry it myself." },
      { tone: 'passive', t: "I'm here. What's scaring you?", r: "Losing you. That's the whole 3am. You're here. That helps." },
      { tone: 'flirty', t: "I'm here. Missing you too. All of it, too.", r: "Both of us up at 3am feeling everything. I love that." },
      { tone: 'risque', t: "Close your eyes. Imagine I'm right there.", r: "Right here, warm, close... okay. Eyes closed. You're here. I'm falling asleep smiling ♡" },
    ] },
  // ---- 5: window seats
  { id: 'emotional-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: "I looked at houses today. Just looking. Ones with window seats. Then I remembered last time and felt silly. Am I?",
    opts: [
      { tone: 'cold', t: "A bit. It's early.", r: "Early. Okay. I'll stop looking. I'll keep the dreams to myself." },
      { tone: 'passive', t: "Not silly. Send me one.", r: "Really? This one. Window seat, rain, a garden. Just looking. Don't panic." },
      { tone: 'flirty', t: "Not silly. Find one big enough for two.", r: "Big enough for two. I'm looking at bigger window seats now. You've made it worse ♡" },
    ] },
  { id: 'emotional-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: "Don't panic, but I looked at houses today. Just looking! One had a window seat for rainy days. I could see us in it.",
    opts: [
      { tone: 'cold', t: "I'm panicking a bit.", r: "Sorry. Too soon. I'll close the tab. I'll keep the dream in my head." },
      { tone: 'passive', t: "Not panicking. Send it?", r: "Here. Window seat. Rain. Room for your boots by the door. Just looking. Promise." },
      { tone: 'flirty', t: "Us in a window seat? I like that picture.", r: "You do? Then I'll keep the picture. And the tab. Just in case." },
      { tone: 'risque', t: "Rainy days in a window seat with you? Sold.", r: "Sold? I'm imagining the rain, and you, and absolutely no reading getting done ♡" },
    ] },
  { id: 'emotional-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: "I found our future house. Kidding! Sort of. It has a window seat and I'm already in it in my head. With you ♡",
    opts: [
      { tone: 'cold', t: "Easy. Slow down.", r: "Sorry. Slowing down. I'll just... look at it alone." },
      { tone: 'passive', t: "Send it. I want to see.", r: "Here! Look at the window seat. Look at the rain on it. I'm in love with a window." },
      { tone: 'flirty', t: "Save me the left side.", r: "The left side is yours. Forever. I've already named it. It's called 'yours'." },
    ] },
  // ---- 6: a tiny anniversary (two exchanges)
  { id: 'emotional-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: "Three months since our first proper talk. I keep track of tiny anniversaries. Unsure I should mark it, after last time.",
    opts: [
      { tone: 'cold', t: "I don't keep track of that stuff.", r: "I know. I do it for both of us. I'm sorry it doesn't matter to you.", opts: [
        { tone: 'cold', t: "It doesn't really.", r: "Okay. Then I'll mark it alone. Happy anniversary to me." },
        { tone: 'passive', t: "Sorry. It matters. Happy anniversary.", r: "Thank you. Just you saying it back. Happy anniversary." },
        { tone: 'flirty', t: "But I keep track of you. Happy anniversary.", r: "You keep track of me? That's better than any date. Happy anniversary ♡" },
      ] },
      { tone: 'passive', t: "Mark it. Happy anniversary.", r: "Happy anniversary. Have I said it out loud yet? I can't remember. I love you.", opts: [
        { tone: 'cold', t: "Let's not do that over text.", r: "Okay. Not over text. I'll say it again in person. If you want." },
        { tone: 'passive', m: 3, t: "Love you back. Happy anniversary.", r: "You do. That's the best anniversary present. I'm crying. Obviously." },
        { tone: 'flirty', t: "Say it again. I want to screenshot it.", r: "I love you. Screenshot it. Frame it. I'll say it every day so you've got plenty ♡" },
      ] },
      { tone: 'flirty', t: "Three months? I'd have marked it with flowers.", r: "Flowers?! You'll make me cry over text. I'm pressing them if you do. Every petal.", opts: [
        { tone: 'cold', t: "If I remember.", r: "If. Okay. I'll remind you. Or I won't." },
        { tone: 'passive', t: "I'll bring them when I'm back.", r: "When you're back. I'll press one. Flat and safe. Happy anniversary." },
        { tone: 'flirty', t: "And I'll tell you I love you when I give them.", r: "You love me? You said it! Over text! I'm screaming. I love you. I love you. Hurry home." },
        { tone: 'risque', t: "And then I'll keep you up all night celebrating.", r: "All night... yes. Flowers, then you, then no sleep at all. Best anniversary ever ♡" },
      ] },
    ] },
  { id: 'emotional-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: "Happy tiny anniversary! Three months since we first really talked. It's on my list. And so is this: I love you.",
    opts: [
      { tone: 'cold', t: "That's a lot over text.", r: "It is. I couldn't wait. I'm sorry. I'll say it in person too. If you'll let me.", opts: [
        { tone: 'cold', t: "Let's talk in person.", r: "In person. I'll wait." },
        { tone: 'passive', t: "Say it in person. I'll say it back.", r: "You'll say it back? I'm counting the days. Faster than ever." },
        { tone: 'flirty', t: "Okay, it's a lot. And I love you too.", r: "Over text. I'm going to frame this. I'm going to cry on the frame." },
      ] },
      { tone: 'passive', m: 3, t: "I love you right back.", r: "You do? I'm going to read that a thousand times. Happy anniversary.", opts: [
        { tone: 'cold', t: "Don't get too emotional.", r: "Too late. Emotional is who you love. I hoped you knew that by now." },
        { tone: 'passive', t: "Happy anniversary. Many more.", r: "Many more. A hundred more. I'll keep the list going forever ♡" },
        { tone: 'flirty', t: "I love you. I'll say it every anniversary.", r: "Even the tiny ones? There are so many tiny ones. You'll be saying it every day." },
      ] },
      { tone: 'flirty', t: "I love you. Three months is nothing. Let's do thirty years.", r: "Thirty years?! I'm going to sob into my tea. Yes. Thirty. Forty. All of them.", opts: [
        { tone: 'cold', t: "Okay, maybe twenty.", r: "Twenty. You took ten years off and it stung. Goodnight." },
        { tone: 'passive', t: "One day at a time, though.", r: "One day at a time. Starting with today. Happy anniversary. I love you." },
        { tone: 'flirty', t: "Forever, then.", r: "Forever. Into the notebook it goes. Last page. And first page of the next one." },
        { tone: 'risque', t: "Starting with a very long night when I'm back.", r: "A very long night... yes. The first of thirty years. Come home soon ♡" },
      ] },
    ] },
  { id: 'emotional-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: "Three months since our first real talk. I'm marking it. And I'm saying it before I lose my nerve: I love you ♡",
    opts: [
      { tone: 'cold', t: "You're moving fast.", r: "I know. I feel fast. You know that. I'll slow down.", opts: [
        { tone: 'cold', t: "Please.", r: "Slowing down. Goodnight." },
        { tone: 'passive', t: "Not too fast. Just surprising.", r: "Surprising good or surprising bad? Never mind. I'll wait for the in-person answer." },
        { tone: 'flirty', t: "Fast is fine. Love you back.", r: "You love me! I'm not slowing down now. Full speed. Happy anniversary." },
      ] },
      { tone: 'passive', t: "Love you too. Happy anniversary.", r: "You do. That's it. That's the best day. Writing it down. Underlining it.", opts: [
        { tone: 'cold', t: "Calm down a bit.", r: "Calm down. I'll try. You could've been happy with me." },
        { tone: 'passive', t: "Underline it twice.", r: "Twice. And a heart. And a pressed flower. And the time. 9:47pm. Forever." },
        { tone: 'flirty', t: "Underline it and draw me next to it.", r: "Drawing you now. With a big smile. And me, crying happily next to you. Perfect." },
      ] },
      { tone: 'flirty', t: "I love you. Took you long enough.", r: "Took ME long enough? You could've said it first! Okay. Okay. I love you. I love you.", opts: [
        { tone: 'cold', t: "Kidding. Mostly.", r: "Mostly? I'll take mostly. It pinched, though." },
        { tone: 'passive', t: "Okay, I should've said it first.", r: "Doesn't matter who's first. We both said it. That's the whole thing. Happy anniversary." },
        { tone: 'flirty', t: "I'll say it first next time. And every time after.", r: "Every time? Then I'll never say it first again. I'll just wait for you. Forever." },
        { tone: 'risque', t: "Come here so I can say it properly.", r: "Properly... yes. I'm on my way. Or you are. Someone's on their way. I love you ♡" },
      ] },
    ] },
];
