// SHY - in person, stage 'new': barely a sentence. Finding them in corners; every word an effort; the voice under the nerves.
export const DATA = [
  // ---- slot 1: the quiet corner (ESTABLISHES: they always find the quiet corner) --------------------------------------
  { id: 'shy-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: "Oh. Hi. You seemed... busy. Before. That's fine. I'll find another corner. There's always another corner.",
    opts: [
      { tone: 'cold', t: "I was busy. Still am, really.", r: "Right. Yes. Sorry. I'll just be... over there. Quietly. Being over there.", opts: [
        { tone: 'cold', t: "Good idea.", r: "...Yes. Okay. Bye." },
        { tone: 'passive', t: "Wait, you don't have to move. There's room.", r: "Oh. Okay. I'll stay. I won't talk much. That's sort of... my whole thing." },
        { tone: 'flirty', t: "Actually, stay. I like your corner.", r: "My— it's not mine. It's... thank you. I'm going to look at the floor now. For a while." },
      ] },
      { tone: 'passive', t: "Sorry I was busy before. Is this where you hide?", r: "Yes. I mean— no. I mean... it's the quietest bit of {venue}. I checked. I always check.", opts: [
        { tone: 'cold', t: "Bit sad, hiding in corners.", r: "...It is a bit. Yes. Sorry. I'm fine here. Thanks." },
        { tone: 'passive', t: "Mind if I hide with you for a minute?", r: "N-no. I don't mind. You can have the good side. There's always a good side." },
        { tone: 'flirty', t: "Good taste. Best spot here, and the best company.", r: "Company? I haven't said anything. ...Okay. Okay. I'll say something next time. Something good." },
      ] },
      { tone: 'flirty', t: "I was busy. Now I'm not. Hi, corner person.", r: "Corner... person. Hi. Yes. That's— that's fairly accurate, actually.", opts: [
        { tone: 'cold', t: "Don't read anything into it.", r: "No. I won't. I wasn't. ...Okay." },
        { tone: 'passive', t: "What's your name, corner person?", r: "{first}. It's {first}. Sorry, I said it twice. Once would have been plenty." },
        { tone: 'flirty', t: "I'll come and find you in every corner, then.", r: "Every— oh. Oh no. I'm going to be checking corners now. Forever. Hoping." },
      ] },
    ] },
  { id: 'shy-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: "Oh! Sorry. I didn't think anyone came over here. It's the... quiet bit. I always find the quiet bit.",
    opts: [
      { tone: 'cold', t: "I was looking for somewhere to sit. That's all.", r: "Of course. Yes. You can have it. I'll move. I'm good at moving.", opts: [
        { tone: 'cold', t: "Thanks.", r: "...Okay. You're welcome. I'll— yes." },
        { tone: 'passive', t: "No, stay. There's enough quiet for two.", r: "Enough quiet for two. That's... nice. I'll stay. I'll be very quiet. Quieter than this." },
        { tone: 'flirty', t: "Stay. I'd rather sit with you anyway.", r: "With... me. Okay. I'm going to look at the floor very hard now. It's a good floor." },
      ] },
      { tone: 'passive', t: "It is nice and quiet. I'm {me}.", r: "I know. I mean— hi. {first}. I knew who you were. That's not weird. Everyone knows. Sorry.", opts: [
        { tone: 'cold', t: "Right. Well. Enjoy the quiet.", r: "Yes. I will. Sorry for... the knowing." },
        { tone: 'passive', t: "Nice to meet you, {first}. What brings you here?", r: "Someone made me come. Then I found this spot. Then you. ...That's the whole story. Thanks for asking it." },
        { tone: 'flirty', t: "Knowing who I am is allowed. I'm glad it's you.", r: "Glad it's— um. I'm going to remember you said that. And replay it later. Badly." },
      ] },
      { tone: 'flirty', t: "The quiet bit got a lot better when I found you in it.", r: "That's— oh. You can't just... say things. Like that. To people. In corners.", opts: [
        { tone: 'cold', t: "Relax. Just being polite.", r: "Polite. Right. Yes. I knew that. ...Okay." },
        { tone: 'passive', t: "Sorry. Too much? I'll tone it down.", r: "No— it's fine. It was nice. I just... need a minute. Or a week. A week's fine." },
        { tone: 'flirty', t: "I can, though. Watch: you've got a great hiding spot.", r: "Thank you. It's the best one. I scouted. Please don't tell anyone. ...You can know, though." },
      ] },
    ] },
  { id: 'shy-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "You smiled at me when we met. I checked behind me. Nobody there. I've been... recovering. In quiet corners.",
    opts: [
      { tone: 'cold', t: "It was for someone else, actually.", r: "Oh. Yes. Of course. They're... very lucky. Sorry. I'll— sorry.", opts: [
        { tone: 'cold', t: "No harm done.", r: "No. None. I'll go and be... somewhere." },
        { tone: 'passive', t: "I'm joking. It was for you. Hi.", r: "Oh. Hi. Okay. I believed you about someone else. I believe everything. It's a problem I have." },
        { tone: 'flirty', t: "Kidding. Nobody else was even close.", r: "Nobody— okay. I have to sit down. I am sitting down. I have to sit down more." },
      ] },
      { tone: 'passive', t: "Guilty. I'm {me}. Hi.", r: "Hi. I know— sorry. Yes. I'm {first}. I've used up most of my words already.", opts: [
        { tone: 'cold', t: "Save the rest, then.", r: "Right. Yes. I will. ...Sorry." },
        { tone: 'passive', t: "Take your time. I'm not going anywhere.", r: "You're not? Okay. That helps. That helps a lot, actually. Hi again." },
        { tone: 'flirty', t: "Spend the rest on me. I've got all the time in the world.", r: "All the— okay. I'm going to think of something good. It'll take a while. Stay... maybe?" },
      ] },
      { tone: 'flirty', t: "Nobody else. All you. I'd do it again.", r: "Again. Please don't. I mean— please do. I mean, give me some warning. I'm not built for it.", opts: [
        { tone: 'cold', t: "Fine. Never again.", r: "Oh. No, that's— okay. Fair. That's fair. I asked for it. Sorry." },
        { tone: 'passive', t: "Warning given. Smile incoming in five minutes.", r: "Five minutes. Okay. I can prepare. I'll practise not going red. It won't work. It never works." },
        { tone: 'flirty', t: "No warnings. Where's the fun in that?", r: "The fun is I survive. Okay. Smile at me, then. I won't look. I'll know, though. I'll know." },
      ] },
    ] },

  // ---- slot 2: the rehearsed line (ESTABLISHES: they rehearse what to say) ---------------------------------------------
  { id: 'shy-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "I, um. Practised something. To say to you. In case you were... different this time. It's gone now. The thing.",
    opts: [
      { tone: 'cold', t: "Probably for the best.", r: "Yes. Probably. It wasn't very good. It had a pun in it.", opts: [
        { tone: 'cold', t: "Definitely for the best, then.", r: "...Okay. Yes. I'll throw it away." },
        { tone: 'passive', t: "Go on. Tell me the pun.", r: "No. Absolutely not. ...Maybe one day. When I'm braver. Or you're looking the other way." },
        { tone: 'flirty', t: "A pun? For me? Now I need to hear it.", r: "You need— oh no. Okay. Next time. I'll practise it until you'd have to laugh. That's months." },
      ] },
      { tone: 'passive', t: "Different how? Was I rude last time?", r: "A bit? No. I don't know. You were busy. I'm... easy to be busy around.", opts: [
        { tone: 'cold', t: "You are, honestly.", r: "Yes. I know. Sorry. I'll let you get on." },
        { tone: 'passive', t: "I'm not busy now. Try the practised thing.", r: "Okay. Um. 'Hello, how's the... car... is it fast.' ...It was better in the mirror. Everything is." },
        { tone: 'flirty', t: "I'll make it up to you. I'm never too busy for you now.", r: "Never too— I'm going to write that down. In my head. In pen. Thank you." },
      ] },
      { tone: 'flirty', t: "I'd love to hear something you practised just for me.", r: "Just for— well. When you say it like that it gets worse. I mean bigger. I mean— hi.", opts: [
        { tone: 'cold', t: "Never mind. Doesn't matter.", r: "Oh. No. It doesn't. Okay." },
        { tone: 'passive', t: "Okay, okay. Start with hi. That worked.", r: "Hi. Yes. Hi worked. I'll do more hi. Hi is safe. Hi has never let me down." },
        { tone: 'flirty', t: "You said hi. It was perfect. Best thing I've heard today.", r: "It was one word. ...I'm going to say it to myself later. In the same voice. To check." },
      ] },
    ] },
  { id: 'shy-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "I practised what to say to you. In the mirror. I had a whole... thing. And now you're here and it's just... 'hi'.",
    opts: [
      { tone: 'cold', t: "Hi works. Don't overthink it.", r: "Right. Sorry. I overthink everything. I'm overthinking this. The 'hi'. It's under review.", opts: [
        { tone: 'cold', t: "Clearly.", r: "Yes. Okay. ...I'll go and overthink somewhere else." },
        { tone: 'passive', t: "It's fine. Hi is a good start.", r: "A good start. Okay. Next time I'll get as far as 'how are you'. Big plans." },
        { tone: 'flirty', t: "Your 'hi' beats most people's speeches.", r: "Does it? I'll keep it. Exactly the same. Don't let me change it. I'll try to change it." },
      ] },
      { tone: 'passive', t: "What was the thing you practised?", r: "It was about the weather. And the race. And a fact about... hedgehogs. It was a lot.", opts: [
        { tone: 'cold', t: "Sounds like a lot.", r: "It was. It is. I'm sorry. I'll leave out the hedgehogs next time. And the rest." },
        { tone: 'passive', t: "Go on then. Hedgehog fact.", r: "They can run quite fast. For their size. ...That's it. That's the fact. Thank you for asking. I'll go and recover." },
        { tone: 'flirty', t: "I'd listen to a whole speech about hedgehogs if you gave it.", r: "You would? Okay. I'll research more. I'll come back with better hedgehogs. For you." },
      ] },
      { tone: 'flirty', t: "You rehearsed for me? That's the sweetest thing I've heard all week.", r: "It's a normal amount of rehearsing. For a— oh no, I'm going red. Am I red?", opts: [
        { tone: 'cold', t: "Very red. Bit much, honestly.", r: "Yes. Okay. Too much. I know. I'll fade into the background. I'm good at it." },
        { tone: 'passive', t: "A little. Breathe. It's okay.", r: "Breathing. In, out. You're very easy to breathe near. That came out wrong. It's true, though." },
        { tone: 'flirty', t: "Bright red. I'd like to make that happen more often.", r: "More often. Okay. I can't look at you for the rest of this. But I'm smiling. At the floor." },
      ] },
    ] },
  { id: 'shy-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "I practised a line. Because last time you were... flirting? I think? So I practised flirting back. It's... um.",
    opts: [
      { tone: 'cold', t: "I wasn't flirting.", r: "Oh. Oh. Okay. Then I'll unpractise it. That's fine. Sorry for the... misunderstanding.", opts: [
        { tone: 'cold', t: "No problem.", r: "...Okay. Sorry again." },
        { tone: 'passive', t: "I mean, maybe a bit. What's the line?", r: "'You drive fast, but my heart... drives... faster.' ...I hate it. I heard it come out. I hate it." },
        { tone: 'flirty', t: "Okay, I was. Let's hear the line.", r: "'You're fast, but my heart is faster.' I'm going to go and live in a cupboard now. Thank you for listening." },
      ] },
      { tone: 'passive', t: "Go on. I promise not to laugh.", r: "Okay. 'Do you come here often?' ...I had something better. It left. That's what survived.", opts: [
        { tone: 'cold', t: "That's pretty bad.", r: "Yes. I know. I'll stop practising things." },
        { tone: 'passive', t: "I'll answer it. Not often. But I might start.", r: "Might start. Okay. Then I'll be here. Not often. But... yes. Here." },
        { tone: 'flirty', t: "Often enough to find you. Your turn.", r: "My turn? I didn't practise my turn. I'm glad you did. Find me. That's my turn. That's all of it." },
      ] },
      { tone: 'flirty', t: "Flirt back? I'm listening. Very closely.", r: "Very closely. That makes it so much harder. Okay. You have a... nice laugh. I had six more words. Gone.", opts: [
        { tone: 'cold', t: "That's all you've got?", r: "Yes. That's all. Sorry. I'll keep the other six somewhere safe." },
        { tone: 'passive', t: "That was lovely. The six words can wait.", r: "They can wait. Okay. They'll be better words, by then. I'll keep sanding them." },
        { tone: 'flirty', t: "My laugh likes you too.", r: "Your laugh— that's not— that's very— I need to sit in a dark room for a bit. Thank you." },
      ] },
    ] },

  // ---- slot 3: the noticed detail (ESTABLISHES: they notice things - you tap your visor twice) ------------------------
  { id: 'shy-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "I wasn't going to say anything. After last time. But... you go very still before you get in the car. Sorry. I notice things.",
    opts: [
      { tone: 'cold', m: -5, t: "That's a bit creepy, honestly.", r: "Yes. It is. I know. It's just how my head works. I'll stop. I'll look... elsewhere.", opts: [
        { tone: 'cold', t: "Please do.", r: "Okay. ...Okay. Sorry." },
        { tone: 'passive', t: "No, sorry, that was harsh. It's a habit of mine.", r: "A habit. Everyone has one. Mine is noticing. And apologising. You've seen both now." },
        { tone: 'flirty', t: "Actually... it's kind of sweet you noticed.", r: "Sweet. Okay. I'll take sweet. I was braced for creepy. I was braced for a lot of things." },
      ] },
      { tone: 'passive', t: "You noticed that? Nobody's ever noticed that.", r: "Oh. Yes. Is it focus? Or I've made that up. I make things up. In my head. Constantly.", opts: [
        { tone: 'cold', t: "It's none of your business, really.", r: "No. It's not. Sorry. Forget it. I'll try to." },
        { tone: 'passive', t: "It's focus. Since I was a kid. Don't tell anyone.", r: "I won't. I don't tell anyone anything. It's my one skill. Your secret is very safe." },
        { tone: 'flirty', t: "Maybe I'll think of you in that moment now.", r: "Of me? In the car? I'm not— okay. Think whatever you want. I'll be over here. Glowing." },
      ] },
      { tone: 'flirty', t: "What else have you noticed about me?", r: "Nothing! A few things. Some things. ...I'm not telling you. You'll think I'm a— no.", opts: [
        { tone: 'cold', t: "Probably better I don't know.", r: "Yes. Much better. They'll stay in here. Sorry." },
        { tone: 'passive', t: "Fair. Tell me one day, when you're ready.", r: "One day. When I'm ready. That might be years. You'd have to... stick around. If you wanted." },
        { tone: 'flirty', t: "I'll find out. I'm patient when it's worth it.", r: "Worth it. Oh. Then... one: you look at people properly when they talk. That's all. That's all you get." },
      ] },
    ] },
  { id: 'shy-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Can I— the quiet thing. You go so still, every time, before the car. I noticed. That's... a strange way to start, isn't it.",
    opts: [
      { tone: 'cold', t: "Okay. Weird thing to watch.", r: "It is. Yes. I watch everything. It's not on purpose. Sorry.", opts: [
        { tone: 'cold', t: "Maybe watch something else.", r: "Okay. I will. ...I'll watch the floor." },
        { tone: 'passive', t: "Sorry, didn't mean it like that. What else do you watch?", r: "Hands, when people fib. Birds. Kettles. You. ...Not in that order. Ignore the last one." },
        { tone: 'flirty', t: "Weird. But I don't mind being watched by you.", r: "You don't? Okay. I'll watch carefully. Respectfully. From a distance. Not too far a distance." },
      ] },
      { tone: 'passive', t: "Ha. Nobody's ever caught that. It's focus.", r: "Focus. I thought it might be. I'm glad I asked. I almost didn't. I almost never do.", opts: [
        { tone: 'cold', t: "Well. Now you know. Don't make it a thing.", r: "No. It's not a thing. Okay. Not a thing." },
        { tone: 'passive', t: "What about you? Any lucky habits?", r: "I count stairs. Twelve is good. Thirteen, I go back down and start again. ...Don't tell anyone that either." },
        { tone: 'flirty', t: "Maybe you're my luck now. You noticed, after all.", r: "Your luck. That's a lot of pressure. Good pressure. I'll try to be lucky. Somehow. I'll practise." },
      ] },
      { tone: 'flirty', t: "You've been watching me closely, then.", r: "No! Yes. Not closely. Normally. A normal amount of— I'm going to stop talking.", opts: [
        { tone: 'cold', t: "Maybe watch a bit less closely.", r: "Yes. Less. I'll do less. ...Sorry. I'll go." },
        { tone: 'passive', t: "It's okay. I'm flattered, honestly.", r: "Flattered. Okay. That's the best outcome. I'd planned for six worse ones." },
        { tone: 'flirty', t: "Keep watching. I'll try to give you a good show.", r: "A show. You don't have to— okay. I'll get a good seat. The quiet one. At the back." },
      ] },
    ] },
  { id: 'shy-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "You go so still before the car. Always. I've been noticing. Since last time. Quite a lot. Sorry. Hi.",
    opts: [
      { tone: 'cold', t: "That's a lot of noticing for someone you barely know.", r: "It is. I know. It got away from me. I'll rein it in. Sorry.", opts: [
        { tone: 'cold', t: "Please.", r: "...Okay. Reined. Sorry. Bye." },
        { tone: 'passive', t: "I'm teasing. It's nice someone pays attention.", r: "Is it? People usually find it... a lot. You find it nice. I'll keep that one." },
        { tone: 'flirty', t: "A lot of noticing. I'm a lot of flattered.", r: "A lot of flattered. That's not grammar. That's the nicest bad grammar I've ever heard." },
      ] },
      { tone: 'passive', t: "Since last time, huh? What else did you notice?", r: "That you smile at the end of a race. Win or not. It's a nice smile. Sorry.", opts: [
        { tone: 'cold', t: "I don't always smile.", r: "Oh. No. Okay. I must have imagined it. Sorry." },
        { tone: 'passive', t: "I didn't know I did that. What kind of smile?", r: "I can't describe it. I've been trying to. For a week. It's fine. It's a hobby now." },
        { tone: 'flirty', t: "Next time I'll smile at the camera just for you.", r: "Just for me. I'll know it's mine. I won't say anything. I'll just... know." },
      ] },
      { tone: 'flirty', t: "Notice all you like. I'll be noticing you back.", r: "Back? No. I'm not noticeable. I'm the person standing next to the noticeable person.", opts: [
        { tone: 'cold', t: "Fair enough. Never mind.", r: "...Yes. Never mind. That's fine. That's where I live." },
        { tone: 'passive', t: "You're more noticeable than you think.", r: "Am I? I'll think about that. Possibly for the rest of the year." },
        { tone: 'flirty', t: "You're the only one I noticed here.", r: "The only— okay. I'm going to go and be red somewhere private. Thank you. Bye. Thank you." },
      ] },
    ] },

  // ---- slot 4: the jigsaw (ESTABLISHES: a thousand pieces, all sky) ----------------------------------------------------
  { id: 'shy-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "You don't have to talk to me. After last time. I was just... thinking about my jigsaw. A thousand pieces. All sky.",
    opts: [
      { tone: 'cold', t: "A puzzle that's all sky. Sounds boring.", r: "It is. To most people. That's sort of why I like it. Nobody asks to help.", opts: [
        { tone: 'cold', t: "Can't think why.", r: "No. ...Me neither." },
        { tone: 'passive', t: "Okay, I'm curious. How do you even do it?", r: "Edges first. Then you sort by shade. There are forty blues. I've named some. ...I've said too much." },
        { tone: 'flirty', t: "I'd help. If you asked.", r: "You'd— nobody's ever... okay. I won't ask. But I'll know you'd have said yes. That's nearly enough." },
      ] },
      { tone: 'passive', t: "All sky? How do you even tell the pieces apart?", r: "The shapes. And there are about forty blues, if you look. Most people don't look.", opts: [
        { tone: 'cold', t: "Most people have better things to do.", r: "Yes. They do. Sorry. I'll go back to my blues." },
        { tone: 'passive', t: "Forty blues. Which one's your favourite?", r: "The one just before dark. It's nearly grey. I call it 'almost'. ...Nobody's ever asked that. Thank you." },
        { tone: 'flirty', t: "I like that you look at things properly.", r: "I look at things too much. You're the first person who's called it properly. I'm keeping that." },
      ] },
      { tone: 'flirty', t: "I'd do a thousand pieces of sky with you.", r: "With me? It takes weeks. You'd get bored by... piece twelve. Probably.", opts: [
        { tone: 'cold', t: "Yeah, probably.", r: "Yes. Probably. That's fine. Most people do." },
        { tone: 'passive', t: "Then I'll bring snacks and stick it out.", r: "Snacks. Okay. I'd do the edges. You'd do the snacks. That's... a good system. That could work." },
        { tone: 'flirty', t: "Not with you next to me. I'd find a reason to stay.", r: "A reason— oh. I'm going to lose a piece on purpose now. So it takes longer. Don't tell me that's cheating." },
      ] },
    ] },
  { id: 'shy-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Someone asked what I do for fun and I panicked and said 'nothing'. It's jigsaws. A thousand pieces. All sky.",
    opts: [
      { tone: 'cold', t: "'Nothing' was probably the better answer.", r: "Yes. It usually is. Jigsaws make people's eyes go... far away. Like yours. Now.", opts: [
        { tone: 'cold', t: "Can you blame them?", r: "No. I can't. Sorry. I do nothing. That's my answer now." },
        { tone: 'passive', t: "Sorry. I'm listening. Why sky?", r: "No picture to cheat from. You just look. Properly. For ages. It's quiet. I like quiet things." },
        { tone: 'flirty', t: "My eyes are right here. On you.", r: "On me. Okay. That's worse. That's much worse. For my face, I mean. It's going hot." },
      ] },
      { tone: 'passive', t: "A thousand pieces of sky? That's amazing. And maddening.", r: "Both. Yes. That's exactly it. It takes about a month. I don't hurry.", opts: [
        { tone: 'cold', t: "A month on one puzzle? I'd lose my mind.", r: "You would. You're fast. At everything. I'm not. That's fine. Sorry." },
        { tone: 'passive', t: "What happens when you finish?", r: "I look at it for a day. Then I break it up and start again. ...Out loud, that sounds unwell." },
        { tone: 'flirty', t: "A month of quiet. I could get used to that, with you.", r: "You'd be in the quiet? You're not quiet. You're— okay. I'd make room. I'd move the box." },
      ] },
      { tone: 'flirty', t: "Panicking looks cute on you. Tell me more about the sky.", r: "Cute. Panicking is— okay. Um. It's blue. That's the main thing. It's very blue.", opts: [
        { tone: 'cold', t: "Riveting.", r: "Yes. ...I know. I'm going to stop. Sorry." },
        { tone: 'passive', t: "Blue's a good start. Go on.", r: "There's a bit near the top where it goes gold. Like a morning. I always save that bit for last." },
        { tone: 'flirty', t: "I could listen to you describe blue all day.", r: "All day. I've only got about six sentences about blue. I'd have to make more. I would. For you." },
      ] },
    ] },
  { id: 'shy-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "I did a jigsaw last night. A thousand pieces, all sky. I thought about you the whole time. That's— less romantic than it sounded.",
    opts: [
      { tone: 'cold', t: "Thinking about me while doing a puzzle. Okay.", r: "Not— no. Not like— I just meant... I'll stop. Forget I said it.", opts: [
        { tone: 'cold', t: "Already forgotten.", r: "Good. Yes. Okay. Good." },
        { tone: 'passive', t: "No, it's sweet. What were you thinking?", r: "That you'd hate sitting still. Then that you'd be good at the edges. ...That's it. That's the whole thought." },
        { tone: 'flirty', t: "I'll be offended if you didn't think about me.", r: "Then you're not— okay. I thought about you. For a thousand pieces. That's a lot of pieces." },
      ] },
      { tone: 'passive', t: "All sky? How do you even manage that?", r: "Slowly. Edges first. Then you sort the blues. There are about forty. I counted. ...I counted.", opts: [
        { tone: 'cold', t: "That's a lot of counting.", r: "It is. Sorry. I'll stop counting things in front of people." },
        { tone: 'passive', t: "Forty blues. You're full of surprises.", r: "I'm not. I'm full of blues. ...Oh. That was a joke. I made a joke. Out loud. To you." },
        { tone: 'flirty', t: "Next one, I'm helping. Save me a corner piece.", r: "A corner piece. Those are the best ones. I don't give those to anyone. ...I'll give you one." },
      ] },
      { tone: 'flirty', t: "A thousand pieces of thinking about me? I'm honoured.", r: "Nine hundred and something. Some pieces were too hard to think about anything else. Sorry.", opts: [
        { tone: 'cold', t: "Nine hundred's plenty. Don't overdo it.", r: "No. I won't. I'll go down to fifty. Sorry." },
        { tone: 'passive', t: "Still a lot of thinking. What came up?", r: "That you'd be terrible at it. And that I'd let you be terrible at it. That's all. That's plenty." },
        { tone: 'flirty', t: "Next time make it the full thousand.", r: "The full— okay. I'll get a bigger one. Two thousand. I'll think about you twice as long. Oh no." },
      ] },
    ] },

  // ---- slot 5: Pickle (ESTABLISHES: their cat Pickle, who steals puzzle pieces) ---------------------------------------
  { id: 'shy-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Sorry, there's... cat hair on my sleeve. Pickle's. My cat. You don't need to know that. I'll— sorry.",
    opts: [
      { tone: 'cold', t: "I don't, no.", r: "No. Right. Sorry. I talk about the cat when I'm nervous. I'm— always nervous.", opts: [
        { tone: 'cold', t: "Maybe talk about something else, then.", r: "Yes. Something else. I'll think of one. Later." },
        { tone: 'passive', t: "Sorry, that came out wrong. What's Pickle like?", r: "Grumpy. Orange. Hates everyone. Likes me. ...We have a lot in common. Except the orange." },
        { tone: 'flirty', t: "Okay, I lied. I want to know everything about Pickle.", r: "Everything? Pickle has a lot of opinions. I'll start small. Pickle would like you. Probably. Eventually." },
      ] },
      { tone: 'passive', t: "Pickle? Great name. Cat person, then?", r: "Yes. Cats don't need you to talk. They just... sit near you. That's my favourite thing.", opts: [
        { tone: 'cold', t: "Sounds lonely.", r: "...It isn't. Mostly. Okay. Sorry." },
        { tone: 'passive', t: "Sitting near someone is underrated.", r: "It is. It really is. ...We're doing it now. Sort of. This is nice." },
        { tone: 'flirty', t: "I can sit near you. It's a talent.", r: "You are. You're doing it now. Okay. I won't say anything else. In case it stops." },
      ] },
      { tone: 'flirty', t: "Lucky Pickle. Gets you all to itself.", r: "Lucky— Pickle's not lucky. Pickle's a menace. Pickle steals my puzzle pieces. And sits on them.", opts: [
        { tone: 'cold', t: "Joke. Forget it.", r: "Forgotten. Mostly. ...Okay." },
        { tone: 'passive', t: "A thief! Which pieces?", r: "Always a blue one. From the middle. I find them months later. In shoes. Pickle thinks I don't know." },
        { tone: 'flirty', t: "A menace who gets your attention. I should take notes.", r: "You don't need notes. You've got my attention. You had it before Pickle. Don't tell Pickle." },
      ] },
    ] },
  { id: 'shy-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "I've got cat hair on everything. That's Pickle. My cat. Pickle steals my puzzle pieces and sits on them. Like a dragon.",
    opts: [
      { tone: 'cold', t: "A cat that sits on things. Groundbreaking.", r: "Yes. It's not... news. Sorry. I don't have much news.", opts: [
        { tone: 'cold', t: "Fascinating.", r: "...Yes. Okay. I'll go back to the cat." },
        { tone: 'passive', t: "Sorry, that was mean. Which pieces does Pickle take?", r: "A blue one, every time. From the middle. Pickle has a system. I respect it, honestly." },
        { tone: 'flirty', t: "I take it back. A dragon cat is very cool. So are you.", r: "So am I— no. Pickle is. I'm the person Pickle allows to live there. ...Thank you, though." },
      ] },
      { tone: 'passive', t: "Like a dragon? I love that. Do you ever get them back?", r: "Never. Well. Months later. In a shoe. Under the fridge. Pickle has hiding places too.", opts: [
        { tone: 'cold', t: "Sounds annoying.", r: "A little. Yes. Sorry. Not very interesting. I know." },
        { tone: 'passive', t: "So the puzzles are never actually finished?", r: "Not really. There's always one missing. I've stopped minding. It's sort of... the point now." },
        { tone: 'flirty', t: "I'd like to meet the dragon. And the dragon's keeper.", r: "The keeper's me. Oh. Pickle bites, though. I don't. ...I don't know why I said that." },
      ] },
      { tone: 'flirty', t: "Cat hair suits you. Very cosy.", r: "Cosy. Okay. I'll tell Pickle. Pickle will be insufferable about it.", opts: [
        { tone: 'cold', t: "Don't tell Pickle anything.", r: "No. Okay. Nothing. ...Sorry." },
        { tone: 'passive', t: "Does Pickle take compliments well?", r: "Pickle takes them and leaves. Like a tax. ...I'm the opposite. I can't take them at all." },
        { tone: 'flirty', t: "Then I'll compliment you instead. You're cosier than Pickle.", r: "Cosier than— okay. I've got to go and stand somewhere. Thank you. Bye. ...Cosier." },
      ] },
    ] },
  { id: 'shy-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "My cat Pickle sat on my phone this morning and nearly texted you 'jjjjjjjj'. I'd have had to move countries.",
    opts: [
      { tone: 'cold', t: "Yeah, maybe don't text me that.", r: "No. I won't. I'd never. I'd have just thrown the phone in a river. Sorry.", opts: [
        { tone: 'cold', t: "Good.", r: "Yes. Okay. ...Good." },
        { tone: 'passive', t: "I'm joking. Tell me about Pickle.", r: "Orange. Grumpy. Sits on everything warm. Phones. Puzzles. Me. Steals puzzle pieces, too. A whole criminal." },
        { tone: 'flirty', t: "Actually, I'd have liked it. Pickle's got good taste.", r: "Good taste? In people to— oh. Pickle isn't allowed to know you said that. It'll go to Pickle's head." },
      ] },
      { tone: 'passive', t: "Pickle? Is that your cat?", r: "Yes. Pickle. Orange. Steals things. Sits on things. Mostly sits on me.", opts: [
        { tone: 'cold', t: "Right. Cats.", r: "Cats. Yes. Okay. Sorry. I'll stop." },
        { tone: 'passive', t: "What else does Pickle steal?", r: "Socks, tape, one blue puzzle piece every single time. I've stopped fighting it. Pickle won." },
        { tone: 'flirty', t: "Tell Pickle the next text should come from you.", r: "From me. On purpose. I'd have to write it first. Twenty times. Okay. I'll... try. For Pickle." },
      ] },
      { tone: 'flirty', t: "I'd have texted back 'jjjjjjjj'. Romance.", r: "You'd have— okay. That's the nicest thing. And the silliest. Both at once.", opts: [
        { tone: 'cold', t: "Don't get used to it.", r: "I won't. I'm not. Okay. Sorry." },
        { tone: 'passive', t: "We'd have had a whole conversation in Pickle.", r: "Pickle's very fluent. I'm not. In anything. Pickle could do all my talking. Probably better." },
        { tone: 'flirty', t: "I'd answer anything you sent. Even that.", r: "Anything. I'm going to remember that. Possibly forever. I'll send you something better. One day." },
      ] },
    ] },

  // ---- slot 6: watching you race (sound off, through their fingers) -----------------------------------------------------
  { id: 'shy-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "I watched your race. With the sound off. Through my fingers. You don't have to talk about it. Sorry.",
    opts: [
      { tone: 'cold', t: "Then why bring it up?", r: "I don't know. I wanted you to know someone was... watching. Quietly. Forget it.", opts: [
        { tone: 'cold', t: "Okay. Forgotten.", r: "...Right. Okay." },
        { tone: 'passive', t: "No, it's nice to know. Why the sound off?", r: "The noise makes my heart go too fast. Without it I can just watch you. ...The car. Watch the car." },
        { tone: 'flirty', t: "I'll drive better knowing you're watching.", r: "Better? You were already— okay. I'll watch harder. Fingers a bit further apart. For you." },
      ] },
      { tone: 'passive', t: "Through your fingers? Is it that scary?", r: "Yes. You go so fast. And everyone shouts. I just... hold my breath. The whole time.", opts: [
        { tone: 'cold', t: "It's my job. Don't watch if it's too much.", r: "No. You're right. I'll try not to. Sorry." },
        { tone: 'passive', t: "I don't think about the speed. Just the next corner.", r: "The next corner. Only that. I like that. I'm going to try that. With things. With people." },
        { tone: 'flirty', t: "Keep holding your breath. I like doing that to you.", r: "It's the car. The car does that. ...It's not entirely the car." },
      ] },
      { tone: 'flirty', t: "Peek all you want. I race better with an audience of one.", r: "One? There are thousands. I'm just one of the thousands. At the back.", opts: [
        { tone: 'cold', t: "Fine. One of the thousands.", r: "Yes. That's fine. That's what I am." },
        { tone: 'passive', t: "The back's a good place to watch from.", r: "It is. You see everything from the back. You see who's watching you. ...Lots of people watch you." },
        { tone: 'flirty', t: "The only one I'd look for, though.", r: "You'd look for— I'll wave, then. Very small. You won't see it. I'll know I did it." },
      ] },
    ] },
  { id: 'shy-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "Can I ask... I watch your races with the sound off. Through my fingers. What do you think about? In there?",
    opts: [
      { tone: 'cold', t: "Not a lot. It's just work.", r: "Oh. Right. Yes. That makes sense. I made it into a— sorry. It's work.", opts: [
        { tone: 'cold', t: "It is. Don't make it romantic.", r: "No. I won't. I didn't. ...Okay. Sorry." },
        { tone: 'passive', t: "Well, mostly the next braking point. And breathing.", r: "Breathing. Me too. When I watch. The same breaths, maybe. Sorry. That's a strange thought." },
        { tone: 'flirty', t: "I think about who's watching, sometimes.", r: "Not me. Probably. Lots of people. ...Maybe sometimes me. I'll keep the sound off. Just in case." },
      ] },
      { tone: 'passive', t: "Honestly? The next corner and nothing else. It's quiet in there.", r: "Quiet. In the loudest place on earth. I think I'd like it in there.", opts: [
        { tone: 'cold', t: "You'd hate it. Trust me.", r: "Yes. I would. You're right. Sorry. I'll stay on the sofa." },
        { tone: 'passive', t: "You're the first person who's understood that.", r: "Am I? I understand quiet. It's my... area. My only area. I'm glad it's yours too." },
        { tone: 'flirty', t: "You'd fit right in. Quiet, focused, fast when it counts.", r: "Fast when it counts. I've never been fast at anything. ...Except going red. Like now." },
      ] },
      { tone: 'flirty', t: "Right now? You, watching through your fingers.", r: "Now? We're not in the— oh. Oh. You're smoother than the car.", opts: [
        { tone: 'cold', t: "Kidding. It's just work.", r: "Right. Yes. Work. ...Okay. Sorry for asking." },
        { tone: 'passive', t: "Okay, really: the next corner. And breathing.", r: "The next corner and breathing. That's very calm. I'd panic. I'm panicking now, and I'm standing still." },
        { tone: 'flirty', t: "Next race I'll wave. In case you're peeking.", r: "You can't wave, you're— tap the visor twice. Then I'll know. I'll know it's... maybe me." },
      ] },
    ] },
  { id: 'shy-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "I watched you race. Sound off. Fingers over my eyes. I peeked. A lot. What are you thinking about? In the car?",
    opts: [
      { tone: 'cold', t: "Mostly not putting it in the wall.", r: "Oh. Yes. Good. That's good. I'll think about that too. For you. Sorry.", opts: [
        { tone: 'cold', t: "Don't worry about it.", r: "I'll try. I won't manage. Sorry." },
        { tone: 'passive', t: "Joking. I think about the next corner. That's it.", r: "One corner at a time. I'd be thinking about all of them at once. And dinner. And what I said to someone in May." },
        { tone: 'flirty', t: "That, and whoever's peeking through their fingers.", r: "Whoever's— you mean me. I'm going to watch with my eyes open next time. Mostly open." },
      ] },
      { tone: 'passive', t: "The next corner. And how quiet it is in there.", r: "Quiet. In there. I didn't think— you're like me. A bit. In the car.", opts: [
        { tone: 'cold', t: "I'm nothing like you.", r: "No. Right. Of course. Sorry. That was silly of me." },
        { tone: 'passive', t: "Maybe a bit. Quiet in the middle of all the noise.", r: "Quiet in the middle of the noise. I'm going to keep that. I'll think it next time it's loud." },
        { tone: 'flirty', t: "A bit like you. Might be why I keep finding you.", r: "You keep finding me. In corners. Oh. I thought it was luck. It's not luck, is it." },
      ] },
      { tone: 'flirty', t: "Peeking, were you? What did you see?", r: "You. And the car. Mostly you. That's— I meant the car. Mostly the car.", opts: [
        { tone: 'cold', t: "Hm. Weird thing to admit.", r: "Yes. It is. I'll stop admitting things. Sorry." },
        { tone: 'passive', t: "And how did I look, mostly?", r: "Brave. And very small. And then gone. Then back again. I liked the back again bit best." },
        { tone: 'flirty', t: "Keep watching. I'll keep giving you a reason.", r: "You don't need to. You already— okay. I'm going to watch every lap now. All of them. Through no fingers." },
      ] },
    ] },

  // ---- slot 7: the first joke (their dry humour gets out) ---------------------------------------------------------------
  { id: 'shy-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "Hello. I was going to stand over there. Out of the way. I'm very good at out of the way. Award-winning.",
    opts: [
      { tone: 'cold', t: "Congratulations, I guess.", r: "Thank you. It's a lifetime achievement thing. ...Sorry. That was meant to be funny.", opts: [
        { tone: 'cold', t: "Go on, then.", r: "Yes. Going. Award-winningly. ...Sorry." },
        { tone: 'passive', t: "Wait, was that a joke? You're funny.", r: "Only by accident. And in writing. Mostly in writing. Out loud they come out sideways." },
        { tone: 'flirty', t: "Stay in the way. My way, specifically.", r: "In your— okay. I'll stand exactly here. I won't move. You'll have to go round. ...Don't go round." },
      ] },
      { tone: 'passive', t: "Award-winning? Who gives out that award?", r: "A committee. Of me. We meet in corners. Attendance is excellent.", opts: [
        { tone: 'cold', t: "Bit sad, that.", r: "It is. Yes. I'll dissolve the committee. Sorry." },
        { tone: 'passive', t: "You're funnier than you let on.", r: "I'm only funny where nobody can see me. You're seeing me. That's new. That's alarming." },
        { tone: 'flirty', t: "Can I join the committee? A seat next to the chair.", r: "The chair's me. You'd be the vice. Motion carried. ...Oh no. I'm enjoying this." },
      ] },
      { tone: 'flirty', t: "You're not out of my way. You're exactly in it.", r: "Exactly in— I'm sorry. I'll move. Which way do you— oh. You mean— oh.", opts: [
        { tone: 'cold', t: "Never mind. Move if you want.", r: "Okay. Moving. Like I said. Sorry." },
        { tone: 'passive', t: "Stay. I like it here.", r: "Here's just me. ...You've got low standards. I mean that kindly. I'm grateful for them." },
        { tone: 'flirty', t: "Don't move. I planned this.", r: "You planned— you rehearsed? Like me? Oh. I can't look at you. I'm looking at your shoes. Nice shoes." },
      ] },
    ] },
  { id: 'shy-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "Someone told me to 'come out of my shell'. I said I've decorated it. It's quite nice in there. ...I was joking. Mostly.",
    opts: [
      { tone: 'cold', t: "Funny. In a sad kind of way.", r: "Yes. That's my genre, mostly. Sad-funny. I'll go back in the shell now.", opts: [
        { tone: 'cold', t: "Back you go, then.", r: "...Probably. Okay. The shell's that way." },
        { tone: 'passive', t: "No, it was funny. Properly funny.", r: "Properly? People don't usually hear them. I say them quietly. You were listening." },
        { tone: 'flirty', t: "Funny, and a decorated shell. I want a tour.", r: "A tour. It's small. There's a chair. And a cat. I'd have to tidy. ...I'd tidy. For you." },
      ] },
      { tone: 'passive', t: "Ha! You're funny. Why do you hide that?", r: "I don't hide it. It just comes out after about four hours. Most people leave at two.", opts: [
        { tone: 'cold', t: "Four hours is a lot to ask.", r: "It is. I'm a lot to ask. Sorry. See you in four hours. Or not." },
        { tone: 'passive', t: "Then I'll stay for the four hours.", r: "You'd stay? Then you'll get the good jokes. There are about three. I'll space them out." },
        { tone: 'flirty', t: "I'd stay four hours just to hear you laugh.", r: "I don't laugh. Out loud. Much. ...I'm laughing now. Look what you've done." },
      ] },
      { tone: 'flirty', t: "I'd love to see inside the shell.", r: "Inside? There's a lot of cushions. And thinking. You'd get lost.", opts: [
        { tone: 'cold', t: "Never mind, then.", r: "No. Okay. Shell's closed. ...Sorry." },
        { tone: 'passive', t: "I'd bring a torch. And biscuits.", r: "Biscuits. That's the way in. That's the actual password. Keep it to yourself." },
        { tone: 'flirty', t: "Getting lost in there sounds perfect.", r: "Perfect. In my— okay. I'm going to have to sit in the shell for a while now. Recover. Thank you." },
      ] },
    ] },
  { id: 'shy-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "I've been told I'm hard to read. I'm not. I'm just in very small print. You'd have to hold me closer. ...Oh no.",
    opts: [
      { tone: 'cold', t: "I'm not holding you closer.", r: "No! No. I didn't mean— it was a joke. A bad one. Forget it. Please.", opts: [
        { tone: 'cold', t: "Already have.", r: "Good. Yes. Thank you." },
        { tone: 'passive', t: "Relax. It was actually a good joke.", r: "Was it? It got out before I'd checked it. Usually I check them. For days." },
        { tone: 'flirty', t: "Fine. I'll just squint a bit harder.", r: "Squint. That's allowed. I'll write bigger. For you. Slightly bigger." },
      ] },
      { tone: 'passive', t: "Ha! That's good. You're funnier than you look.", r: "Thank you. I think. I look like this. So it's a low bar. I clear it sometimes.", opts: [
        { tone: 'cold', t: "Low bar, yeah.", r: "Yes. ...I said that first. It's worse when somebody agrees. Okay." },
        { tone: 'passive', t: "You look kind. Funny's a bonus.", r: "Kind. Kind's what people say about cardigans. ...I'll take it. I am basically a cardigan." },
        { tone: 'flirty', t: "You look exactly like someone I'd hold closer.", r: "You'd— oh. I walked into that. I built it, and then I walked into it. Well done." },
      ] },
      { tone: 'flirty', t: "Small print's my favourite. Come here and let me read you.", r: "I'm not— I'm a pamphlet. Maybe. A short one. With footnotes.", opts: [
        { tone: 'cold', t: "Hm. Maybe not.", r: "No. Okay. Pamphlet closed. Sorry." },
        { tone: 'passive', t: "I like footnotes. That's where the good stuff is.", r: "It is. That's where I keep the jokes. And the... other things. Small print. Very small." },
        { tone: 'flirty', t: "I'm going to read every footnote.", r: "Every— there are hundreds. Some are about you. ...That's a footnote. Ignore it. Please." },
      ] },
    ] },

  // ---- slot 8: braver in writing (the phone version of them) ------------------------------------------------------------
  { id: 'shy-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "I'm— better on the phone. In writing. In person I'm... this. You've seen this. It's not great. Sorry.",
    opts: [
      { tone: 'cold', t: "Then maybe stick to texting.", r: "Yes. Maybe. People do say that. Sorry.", opts: [
        { tone: 'cold', t: "Seems easier for both of us.", r: "It does. Yes. ...I'll text. I'll be fine. On the phone." },
        { tone: 'passive', t: "That was unkind. I like talking to you like this too.", r: "Do you? Even with the... pauses? I'll try to pause less. Or the same. The same, probably." },
        { tone: 'flirty', t: "No. I like the version that goes red.", r: "Nobody likes the red one. ...Okay. The red one's here. It's yours. It's very red." },
      ] },
      { tone: 'passive', t: "What's different about you on the phone?", r: "I finish sentences. I'm funny, sometimes. I get to fix the words before they get out.", opts: [
        { tone: 'cold', t: "Bit fake, isn't it?", r: "No. That's the real one. The one out here just gets... stuck. Sorry. Never mind." },
        { tone: 'passive', t: "You're doing fine right now. I'm listening.", r: "I am, aren't I? It's because you wait. Most people don't wait. They finish it for me. Wrong." },
        { tone: 'flirty', t: "I want both. The brave one and this one.", r: "Both. They don't usually come together. I'll try to bring them both. Next time." },
      ] },
      { tone: 'flirty', t: "Not great? You're my favourite person to stand next to.", r: "You have to stand next to lots of people. Loud ones. With teeth.", opts: [
        { tone: 'cold', t: "Fair point. Maybe not favourite.", r: "No. Right. That's more accurate. Okay." },
        { tone: 'passive', t: "Loud is tiring. You're restful.", r: "Restful. Like a bench. ...Thank you. Honestly. I'd like to be your bench. That came out— it's fine." },
        { tone: 'flirty', t: "Teeth have nothing on you.", r: "I have teeth. A normal amount. ...You win. I'm going red. You've seen this one." },
      ] },
    ] },
  { id: 'shy-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "If I've texted you anything... long. Please don't mention it. I'm braver on the phone. In person I'm— this one.",
    opts: [
      { tone: 'cold', t: "Fine. I won't mention it.", r: "Thank you. Thank you. I write things at night. They feel shorter at night.", opts: [
        { tone: 'cold', t: "Maybe write less, then.", r: "Yes. Less. ...Sorry." },
        { tone: 'passive', t: "For what it's worth, the long ones are my favourite.", r: "Are they? Even the bit where I— don't tell me which bit. I'll keep writing them." },
        { tone: 'flirty', t: "I'll mention it with my eyes, though.", r: "Your eyes? Stop— okay. Don't stop. I can't decide." },
      ] },
      { tone: 'passive', t: "Braver how? What would phone-you say right now?", r: "Phone me would say 'you look tired, but nicely'. And then 'sorry, that was a lot'.", opts: [
        { tone: 'cold', t: "Phone-you is a bit rude.", r: "Phone me is, sometimes. That's why phone me stays in the phone. Sorry." },
        { tone: 'passive', t: "I am tired. Nicely, apparently. Thanks.", r: "Nicely. Like a lamp that's been on all day. ...Phone me would've done that better." },
        { tone: 'flirty', t: "Tell phone-you I'd like more of those.", r: "More. Okay. I'll pass that on. Phone me is going to be unbearable now." },
      ] },
      { tone: 'flirty', t: "I'm going to bring up every single text. Slowly.", r: "No. Please. No. I'll go and live in the phone. You'll never find me.", opts: [
        { tone: 'cold', t: "Fine. Not a word.", r: "Thank you. ...Not a word. That's what I'm good at." },
        { tone: 'passive', t: "Joking. Your secrets are safe.", r: "Safe. Thank you. I don't think I've got secrets. I've just got long paragraphs." },
        { tone: 'flirty', t: "I'll find you. I'll text you until you come out.", r: "Until I come out. That might work. That might work very fast. Don't test it." },
      ] },
    ] },
  { id: 'shy-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "I'm a different person on the phone. Braver. Funnier. In person I'm just the one who goes red. Hi. I'm red.",
    opts: [
      { tone: 'cold', t: "I can see that. The red one.", r: "Yes. ...That's the one. Sorry. The other one's at home. In my phone.", opts: [
        { tone: 'cold', t: "Leave it there, then.", r: "I will. ...Bye from the red one." },
        { tone: 'passive', t: "I'm teasing. I like both of you.", r: "Both. That's generous. We're very grateful. Both of us. Me. All of— I'll stop." },
        { tone: 'flirty', t: "Red's my favourite colour now.", r: "Since when? Since now? You can't— okay. I'm going to stay this colour forever. Apparently." },
      ] },
      { tone: 'passive', t: "What does phone-you do that you don't?", r: "Phone me makes jokes. Says what it thinks. Then sends it before it can stop itself.", opts: [
        { tone: 'cold', t: "Sounds like phone-you should be careful.", r: "Phone me should. Phone me isn't. Sorry about phone me." },
        { tone: 'passive', t: "So what are you thinking now?", r: "That you're nicer than I rehearsed. I rehearsed you a bit meaner. In case. ...Phone me would've kept that in." },
        { tone: 'flirty', t: "I'd like to meet phone-you in person sometime.", r: "In person phone me just turns into this. But slowly... maybe. If you keep standing there." },
      ] },
      { tone: 'flirty', t: "Hi, red. I'm the one making you red.", r: "Yes. You are. You're doing it right now. That's quite rude, actually. In a nice way.", opts: [
        { tone: 'cold', t: "I'll stop, then.", r: "Oh. You needn't— okay. You stopped. That's fine. ...Okay." },
        { tone: 'passive', t: "Sorry. I'll give you a minute.", r: "A minute. Thank you. I'll come back down. I'll be beige again. Give me a minute." },
        { tone: 'flirty', t: "Not sorry. You're a lovely red.", r: "A lovely red. I'm going to have that engraved somewhere. On a little plaque." },
      ] },
    ] },

  // ---- slot 9: chapter end - asking to see you on purpose -----------------------------------------------------------------
  { id: 'shy-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "I wanted to ask you something. Even after... last time. I've practised. Can I just say it? Quickly?",
    opts: [
      { tone: 'cold', t: "Make it quick.", r: "Would-you-like-to-go-somewhere-quiet-sometime. With me. On purpose. ...It sounded better at home.", opts: [
        { tone: 'cold', t: "Not really, no.", r: "Okay. That's— okay. Thank you for answering. Really. I'll go." },
        { tone: 'passive', t: "Okay. Yes. Somewhere quiet sounds nice.", r: "It does? Yes? I'll find somewhere. I'm good at finding quiet. It's my one thing." },
        { tone: 'flirty', t: "Yes. And I'd have said yes slower, too.", r: "Slower— I'd have fainted. You said yes. I'm going to go home and lie on the floor. Happily." },
      ] },
      { tone: 'passive', m: 3, t: "Take your time. I'm listening.", r: "Would you like to go somewhere quiet. With me. Sometime. On purpose. ...Twelve words. I counted.", opts: [
        { tone: 'cold', t: "I'll think about it.", r: "Yes. Think. That's fair. That's very fair. I'll be here. Not asking again." },
        { tone: 'passive', t: "Yes. I'd like that.", r: "You would. I didn't plan for yes. I planned for everything but yes. I'll plan yes now." },
        { tone: 'flirty', t: "Twelve perfect words. Yes.", r: "Perfect. They were very— okay. Yes. You said yes. I need to tell Pickle. Bye. Thank you. Bye." },
      ] },
      { tone: 'flirty', t: "If it's about seeing me again, the answer's yes.", r: "You skipped the question. I practised the question. For a week. ...Yes? You said yes?", opts: [
        { tone: 'cold', t: "Actually, maybe not. Let's see.", r: "Oh. Let's see. That's fine. Let's... see. Sorry." },
        { tone: 'passive', t: "Ask it anyway. You worked hard on it.", r: "Would you like to go somewhere quiet with me. On purpose. ...That's it. That's a week's work." },
        { tone: 'flirty', t: "Yes. Somewhere quiet. Just us. You pick.", r: "Just us. I'll pick somewhere with no corners. So you can see me. ...That's terrifying. Yes." },
      ] },
    ] },
  { id: 'shy-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "Would you like to go somewhere quiet with me sometime, on purpose, not by accident in a corner? ...That was a whole sentence.",
    opts: [
      { tone: 'cold', t: "We'll see. I'm pretty busy.", r: "Yes. Of course. You are. I knew that. I just practised it anyway.", opts: [
        { tone: 'cold', t: "Don't wait up.", r: "No. I won't. ...I'll stop counting sentences." },
        { tone: 'passive', t: "But yes. I'll make time.", r: "You'll make time. For quiet. With me. Okay. That was worth all twenty rehearsals." },
        { tone: 'flirty', t: "Busy. Never too busy for you, though.", r: "Then. On purpose. You'll see. Somewhere with a nice... sky." },
      ] },
      { tone: 'passive', t: "That was a great sentence. And yes, I'd like that.", r: "Yes? There's nothing after yes in my notes. I didn't plan what happens after yes.", opts: [
        { tone: 'cold', t: "Just don't make it weird.", r: "No. Not weird. Normal. I'll be very normal. Sorry. I'll try." },
        { tone: 'passive', t: "Then we'll work it out together.", r: "Together. I'd like that. I'm saying a lot today. I'll go home and sleep for a year." },
        { tone: 'flirty', t: "After yes is the good part. I'll show you.", r: "The good part. I'll write that in the notes. 'After yes: the good part.' In pen." },
      ] },
      { tone: 'flirty', t: "On purpose. I like the sound of that. A lot.", r: "You do? A lot? My plan didn't cover 'a lot'.", opts: [
        { tone: 'cold', t: "Don't get carried away.", r: "No. I won't. I'm not. ...Sorry." },
        { tone: 'passive', t: "Somewhere quiet, then. You choose.", r: "I'll choose well. I've got a list of quiet places. It's a long list. Of course it is." },
        { tone: 'flirty', t: "On purpose, and close to you. Deal?", r: "Close to— yes. Deal. I'm going to shake your hand now. That's what deals are. Okay. Hand." },
      ] },
    ] },
  { id: 'shy-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "I've counted. We've only ever met by accident. In corners. I'd like to— on purpose. Meet. Somewhere quiet. ...That's the ask.",
    opts: [
      { tone: 'cold', t: "Accidents are fine. No need to plan it.", r: "Oh. Right. Accidents. In corners. That's fine. That's what we do.", opts: [
        { tone: 'cold', t: "Exactly. No pressure.", r: "No pressure. ...I'll go and find a corner. Accidentally." },
        { tone: 'passive', t: "I'm joking. On purpose sounds better.", r: "Better. On purpose. Somewhere quiet. I've been thinking of somewhere for a week." },
        { tone: 'flirty', t: "Fine. On purpose. I can't keep pretending it's chance.", r: "You were pretending? All those corners? You found me on purpose? ...Oh. I'm going to sit down." },
      ] },
      { tone: 'passive', t: "Yes. Somewhere quiet sounds perfect.", r: "You said yes. I'll find the quietest place there is. I'm a specialist.", opts: [
        { tone: 'cold', t: "Don't overthink it.", r: "I'll overthink it. Sorry. I'll overthink it quietly, though." },
        { tone: 'passive', t: "Surprise me.", r: "A surprise. Okay. I'll surprise you. Quietly. You'll barely notice it's a surprise." },
        { tone: 'flirty', t: "As long as you're there, it'll be perfect.", r: "I'll be there. Early. In the corner of the quiet place. Some habits— okay. Yes." },
      ] },
      { tone: 'flirty', t: "Yes. A hundred times. Though I liked finding you in corners.", r: "You can still find me in corners. With me knowing you're coming. That's what 'on purpose' means. I think.", opts: [
        { tone: 'cold', t: "We'll see if I come.", r: "Okay. We'll see. I'll leave the corner open. Just in case." },
        { tone: 'passive', t: "I'll be there. Right on time.", r: "I'll be early. I'm always early. I sit and practise. ...This time I won't. I'll just wait." },
        { tone: 'flirty', t: "I'll come and find you. On purpose. Every time.", r: "Every time. That's the end of something. Or the start. I'll see you. On purpose." },
      ] },
    ] },
];
