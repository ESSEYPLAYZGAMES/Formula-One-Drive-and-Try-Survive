// SHY - the phone, events: the first text after meeting, the day after a date, and after each race.
export const DATA = [
  // ==== met: the first text (drafted eleven times) =========================================================================
  { id: 'shy-text-met-new-1-cold', on: 'met', stage: 'new', slot: 1, mood: 'cold',
    say: "Hi. It's {first}. From before. You seemed busy, so I nearly didn't text. Eleven drafts. It's still just 'hi'.",
    opts: [
      { tone: 'cold', t: "Hi.", r: "Hi. Okay. That's a reply. I'll leave it there. I'll frame it, possibly.", opts: [
        { tone: 'cold', t: "Busy right now.", r: "Of course. Sorry. I'll go. Thank you for the 'hi'. It was a good one." },
        { tone: 'passive', t: "Sorry I seemed busy. Nice to hear from you.", r: "Is it? Then I'll text again. Not too much. A normal amount. I'll research the normal amount." },
        { tone: 'flirty', t: "Eleven drafts for me? I'm flattered.", r: "You weren't supposed to be flattered. You were supposed to not notice. ...I'm glad you're flattered." },
      ] },
      { tone: 'passive', t: "Hi! Sorry I was distracted. Glad you texted.", r: "You are? Good. I wasn't sure. I'm never sure. I'm sure now. Slightly.", opts: [
        { tone: 'cold', t: "No worries.", r: "No worries. I'll try to have fewer of them. Worries. Goodnight." },
        { tone: 'passive', t: "What did the other ten drafts say?", r: "Draft four had a joke. Draft seven asked about your car. Draft nine just said 'sorry'. This one won." },
        { tone: 'flirty', t: "Next time I'll pay a lot more attention to you.", r: "A lot more. I'll need to prepare for that. I'm not very good at being paid attention to." },
      ] },
      { tone: 'flirty', t: "Eleven drafts? I'd have read all of them.", r: "That's very kind and also a nightmare. Draft three rhymed. Nobody's reading draft three.", opts: [
        { tone: 'cold', t: "Keep them, then.", r: "I will. In a vault. Under my cat. Goodnight." },
        { tone: 'passive', t: "Okay, okay. Hi, {first}. Nice to meet you properly.", r: "Properly. Hi. Nice to meet you properly too. In writing, I'm much more... present." },
        { tone: 'flirty', t: "Draft three's the one I want now.", r: "No. Absolutely not. ...It rhymed 'corner' with 'warmer'. Now you know. I'm going to bed forever." },
      ] },
    ] },
  { id: 'shy-text-met-new-1-passive', on: 'met', stage: 'new', slot: 1, mood: 'passive',
    say: "Hi. It's {first}. The quiet one. You might not remember. I've drafted this eleven times. This has the fewest apologies.",
    opts: [
      { tone: 'cold', t: "Hey.", r: "Hey. Okay. Hi. I'll keep it short. Shorter than the drafts. Much shorter.", opts: [
        { tone: 'cold', t: "Short's good.", r: "Short's good. Yes. ...That's the end of the text. Bye." },
        { tone: 'passive', t: "Hey, quiet one. Glad you texted.", r: "You remember me? Good. I was worried I'd blended into the background." },
        { tone: 'flirty', t: "Hey, quiet one. Been hoping you'd text.", r: "You were hoping? I need to re-read that in a quieter room. All my rooms are quiet. I'll re-read it." },
      ] },
      { tone: 'passive', t: "Hi! Of course I remember. Glad you texted.", r: "You remember. That's me. The quiet one. I'm glad I texted too. Eventually. After eleven tries.", opts: [
        { tone: 'cold', t: "Eleven seems excessive.", r: "It is excessive. I'm an excessive drafter. A minimal sayer. Sorry." },
        { tone: 'passive', t: "What made you hit send on eleven?", r: "My cat stood on the phone. Pickle. Pickle sent it. Technically. I'm taking the credit." },
        { tone: 'flirty', t: "I'll make sure you don't need eleven next time.", r: "How? No. Don't explain. Just keep doing whatever you do. With your face. It helps." },
      ] },
      { tone: 'flirty', t: "Fewest apologies? I want the most-apologies version.", r: "There's one with nine sorries. It's a masterpiece. It's also a cry for help. You can't have it.", opts: [
        { tone: 'cold', t: "Spare me, then.", r: "Spared. ...You're welcome. It was a lot of sorries." },
        { tone: 'passive', t: "Fair. Hi, {first}. Lovely to meet you.", r: "Lovely. You said lovely. That's three apologies I don't need now. Thank you." },
        { tone: 'flirty', t: "One sorry for every time you made me smile?", r: "That's not how— did I make you smile? Nine times? ...I'm going horizontal. Hi." },
      ] },
    ] },
  { id: 'shy-text-met-new-1-flirty', on: 'met', stage: 'new', slot: 1, mood: 'flirty',
    say: "Hi. It's {first}. You smiled at me and I've been useless since. Draft eleven. Draft eleven is braver than me.",
    opts: [
      { tone: 'cold', t: "Useless? Sounds like a you problem.", r: "Yes. It is. Sorry. I'll deal with it privately. Goodnight.", opts: [
        { tone: 'cold', t: "Sleep well.", r: "You too. ...That was polite of you. I'll take polite." },
        { tone: 'passive', t: "Kidding. I'm glad you texted.", r: "Kidding. Good. My heart did a thing. It's stopped doing the thing. Hello again." },
        { tone: 'flirty', t: "I've been useless too, honestly.", r: "You? Useless? Over me? ...That's not possible. I'm going to accept it. Reluctantly. Happily." },
      ] },
      { tone: 'passive', t: "Version eleven is lovely. Hi, {first}.", r: "Hi. Version eleven thanks you. Versions one to ten are sulking. They wanted a turn.", opts: [
        { tone: 'cold', t: "They'll live.", r: "They'll live. In a folder. Forever. Okay." },
        { tone: 'passive', t: "Tell me about yourself, version eleven.", r: "Version eleven likes rain, jigsaws and very quiet rooms. Version eleven has a cat. Version eleven is me." },
        { tone: 'flirty', t: "Version eleven can text me any time.", r: "Any time. That's dangerous. Version eleven has no sense of time. Version eleven texts at two a.m." },
      ] },
      { tone: 'flirty', t: "I'll smile at you again so you stay useless.", r: "That's cruel. That's very cruel. Please do it. Warn me first. Actually, don't warn me.", opts: [
        { tone: 'cold', t: "No promises.", r: "No promises. That's fine. I'll be braced anyway." },
        { tone: 'passive', t: "I'll warn you. Fair's fair.", r: "Thank you. I'll need about a week's notice. And a chair." },
        { tone: 'flirty', t: "No warning. Next time you see me, I'm smiling.", r: "Then I'll spend every day waiting to see you, being useless. That's my week. Thank you." },
      ] },
    ] },

  // ==== date: the day after a date - warm =================================================================================
  // ---- warm 1: the first date (deep) --------------------------------------------------------------------------------------
  { id: 'shy-text-date-warm-1-cold', on: 'date', stage: 'warm', slot: 1, mood: 'cold',
    say: "Thank you for yesterday. I think I talked too much. Or not enough. You went quiet at the end. I've been worrying. Sorry.",
    opts: [
      { tone: 'cold', t: "It was fine.", r: "Fine. Fine is... fine. I'll take fine.", opts: [
        { tone: 'cold', t: "Just fine.", r: "Just fine. Okay. ...Thank you for coming anyway." },
        { tone: 'passive', t: "Sorry. It was nice. I was tired at the end.", r: "Tired. Not bored? Tired I can do something about. Next time, earlier. And cosier." },
        { tone: 'flirty', t: "Fine's a lie. It was great. I was shy at the end.", r: "You? Shy? That's my job. ...You were shy. With me. I'm going to think about that all day." },
      ] },
      { tone: 'passive', t: "You talked the perfect amount. I had a lovely time.", r: "The perfect amount. Nobody's ever said that. I usually talk zero minutes or forty. No middle.", opts: [
        { tone: 'cold', t: "Don't overanalyse it.", r: "I'll try. I'll overthink it a little. Quietly. Thank you, though." },
        { tone: 'passive', t: "Let's do it again.", r: "Again. Yes. I'll choose somewhere even quieter. There's a library with a garden. Nobody knows about it." },
        { tone: 'flirty', t: "Next time, talk forty minutes. I'll listen to all of it.", r: "Forty minutes. I'll prepare forty minutes. About the sky. You'll regret this. Lovingly." },
      ] },
      { tone: 'flirty', t: "I went quiet because I was trying not to kiss you.", r: "Oh. Oh. That's a much better reason than the forty I'd come up with. Oh.", opts: [
        { tone: 'cold', t: "Pretend I didn't say that.", r: "I can't. I won't. That's being kept. Forever. Sorry." },
        { tone: 'passive', t: "Next time I'll say something instead.", r: "Say something. Or— okay. I'll try to be braver at the end too. We can both be braver." },
        { tone: 'flirty', t: "Next time I won't try so hard not to.", r: "Not so hard. Okay. I'll stand very still. Like a lamp post. No. Just still. Very still." },
      ] },
    ] },
  { id: 'shy-text-date-warm-1-passive', on: 'date', stage: 'warm', slot: 1, mood: 'passive',
    say: "Yesterday: thank you. That was my first date in a long time. I didn't hide once. I think that's a record.",
    opts: [
      { tone: 'cold', t: "Glad you had fun.", r: "I did. Did you? You don't have to say. Never mind. I had fun.", opts: [
        { tone: 'cold', t: "It was okay.", r: "Okay. That's fine. Okay is a beginning. ...Sorry." },
        { tone: 'passive', t: "I did. I really did.", r: "Really? Then I'm going to stop worrying and start planning. Planning is better." },
        { tone: 'flirty', t: "I had more than fun.", r: "What's more than fun? No. Tell me in person. Or don't. Text it at two a.m." },
      ] },
      { tone: 'passive', t: "A record! I'm proud of you. I loved it.", r: "Proud. Of me. For not hiding. Thank you. I loved it too. I was very brave and very red.", opts: [
        { tone: 'cold', t: "Steady on.", r: "Sorry. Steadying. I'm steady. Mostly." },
        { tone: 'passive', t: "Same time next week?", r: "Same time. Yes. I'll be there early. In the corner. Not hiding. Just— early." },
        { tone: 'flirty', t: "Red's my favourite colour on you.", r: "Is it? Then you've been very lucky with me. I've been red since we met." },
      ] },
      { tone: 'flirty', t: "You didn't hide once. Except when you looked at your shoes.", r: "That wasn't hiding. That was studying the floor. Thoroughly. At length. While you smiled.", opts: [
        { tone: 'cold', t: "Sure it was.", r: "It was. ...It wasn't. Okay. Sorry." },
        { tone: 'passive', t: "It was cute. I didn't mind.", r: "Cute. The shoe thing was cute. I'll keep it, then. I'll wear interesting shoes next time." },
        { tone: 'flirty', t: "Next time I'll make you look up.", r: "Then I'll have to look at you. The whole time. ...I'd like that. Terrifying. Yes." },
      ] },
    ] },
  { id: 'shy-text-date-warm-1-flirty', on: 'date', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Yesterday was lovely. I keep replaying the bit where you laughed at my joke. On purpose. You laughed on purpose.",
    opts: [
      { tone: 'cold', t: "It wasn't that funny.", r: "Oh. You were being polite. I should have known. Sorry.", opts: [
        { tone: 'cold', t: "Bit polite, yeah.", r: "Yes. Okay. ...I'll work on the jokes." },
        { tone: 'passive', t: "Kidding. It was funny. You're funny.", r: "Funny. Me. I'm going to write that on my hand so I remember it on the next date." },
        { tone: 'flirty', t: "Kidding. I'd laugh at anything you said.", r: "Anything? Even hedgehog facts? ...You'll get the hedgehog facts. You've been warned." },
      ] },
      { tone: 'passive', t: "I laughed because you're funny. It was lovely.", r: "It was lovely. You said lovely. I'm putting that on the fridge. With a magnet.", opts: [
        { tone: 'cold', t: "It's just a word.", r: "Just a word. Yes. ...It's a good word. Okay." },
        { tone: 'passive', t: "Let's do it again soon.", r: "Soon. Yes. I'll have new jokes. Two. I'll practise them on my cat." },
        { tone: 'flirty', t: "Again. Next time I'll laugh closer.", r: "Closer. Then the joke has to be really good. I'll need a week. Give me a week." },
      ] },
      { tone: 'flirty', t: "I laughed on purpose. And I'd do it all again.", r: "All again. Even the bit where I forgot every word I know? ...Okay. Yes. All again.", opts: [
        { tone: 'cold', t: "Maybe not that bit.", r: "No. Not that bit. I'll keep a list of words in my pocket. Forever." },
        { tone: 'passive', t: "Especially that bit. That's when I relaxed.", r: "My disaster relaxed you? ...Then I'll forget words more often. As a service." },
        { tone: 'flirty', t: "Especially the end. When you looked at me.", r: "You noticed? I thought I was being subtle. I'm subtle the way a lighthouse is." },
      ] },
    ] },
  // ---- warm 2 ----------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-date-warm-2-cold', on: 'date', stage: 'warm', slot: 2, mood: 'cold',
    say: "Thank you for the date. You seemed further away by the end. I've been wondering if I said something. You needn't answer.",
    opts: [
      { tone: 'cold', t: "Just tired. Leave it.", r: "Leaving it. ...Sleep well tonight. Properly." },
      { tone: 'passive', t: "You didn't. I had a good time. Promise.", r: "A promise. That's very reassuring. I'll stop rereading the evening." },
      { tone: 'flirty', t: "I went quiet because I didn't want it to end.", r: "Didn't want it to end. That's the opposite of what I'd decided. I like yours better." },
    ] },
  { id: 'shy-text-date-warm-2-passive', on: 'date', stage: 'warm', slot: 2, mood: 'passive',
    say: "Date report: I didn't knock anything over. You laughed four times. I counted. I think it went well? It went well.",
    opts: [
      { tone: 'cold', t: "You counted?", r: "I count everything. Sorry. ...It went well, though. I counted that too." },
      { tone: 'passive', t: "It went really well. I had a great time.", r: "Really well. I'm going to tell my cat. My cat won't care. I'll tell it anyway." },
      { tone: 'flirty', t: "Five times, actually. You missed one.", r: "Five? Which one did I miss? ...I'm going to replay the whole thing to find it. Thank you." },
      { tone: 'risque', t: "Next time I'll give you something better to count.", r: "Better to— I've put the phone down. I've picked it up again. Not yet. But— not never." },
    ] },
  { id: 'shy-text-date-warm-2-flirty', on: 'date', stage: 'warm', slot: 2, mood: 'flirty',
    say: "I keep thinking about the moment you looked at me and didn't look away. I forgot to breathe. I'm breathing now. Mostly.",
    opts: [
      { tone: 'cold', t: "It was just a look.", r: "Yes. Just a look. For you. For me it was a whole event. Sorry." },
      { tone: 'passive', t: "I liked it too. You went very pink.", r: "Pink because I was nervous. Nerves make me pink. I'm very pink right now. Typing this." },
      { tone: 'flirty', t: "Next time I'm not looking away either.", r: "Then I'll practise breathing. Long, quiet evenings. No reasons to look away." },
      { tone: 'risque', t: "Next time I'll do more than look.", r: "More than— I've nearly walked into a lamp post. Not yet. Ask me again later." },
    ] },
  // ---- warm 3: 'that was a real date' (deep) ------------------------------------------------------------------------------
  { id: 'shy-text-date-warm-3-cold', on: 'date', stage: 'warm', slot: 3, mood: 'cold',
    say: "I keep thinking about the date. And the way it ended. I'm not sure what happened. I'd like to know, if you'll tell me.",
    opts: [
      { tone: 'cold', t: "Nothing happened. I just had to go.", r: "You had to go. That's all. Okay. I'll stop building it into something.", opts: [
        { tone: 'cold', t: "Right, so.", r: "Right. ...I'll go back to my jigsaw. It never leaves early. Sorry. That was unfair." },
        { tone: 'passive', t: "I'm sorry. I should have said goodbye properly.", r: "Thank you. That's all I needed. A proper goodbye. Next time. Okay?" },
        { tone: 'flirty', t: "I had to go. I didn't want to.", r: "You didn't want to. That's a very different evening. I'm rewriting it now. It's much nicer." },
      ] },
      { tone: 'passive', t: "I got in my head. It wasn't you. I loved the date.", r: "You loved it? Even the end? Then I'll let go of the end. I'll keep the middle. The middle was lovely.", opts: [
        { tone: 'cold', t: "Let's not dissect it.", r: "No dissecting. Sorry. I'm a dissector. I'll put the tools down." },
        { tone: 'passive', t: "The middle was my favourite too.", r: "The part where we both stopped being nervous? That was mine. I didn't know it was yours too." },
        { tone: 'flirty', t: "Next time the end will be better. I promise.", r: "Better how? ...No. Don't say. Surprise me. I'll be ready. I'll be very ready." },
      ] },
      { tone: 'flirty', t: "What happened is I wanted to kiss you and panicked.", r: "You panicked? That's my whole thing. You stole my thing. ...You wanted to kiss me?", opts: [
        { tone: 'cold', t: "Doesn't matter now.", r: "It matters. A bit. ...I'll let it not matter. Out loud. Inside it matters." },
        { tone: 'passive', t: "I did. I still do.", r: "You still do. Then next time, don't panic. I'll be the one panicking. One of us is enough." },
        { tone: 'flirty', t: "Next time I won't panic.", r: "Next time. I'll stand still. I'll close my eyes. You won't have to panic. Just— don't miss." },
        { tone: 'risque', t: "Next time I'm not stopping at a kiss.", r: "Not stopping— I've read that sentence eleven times. Not yet. Not yet. ...Soon, maybe." },
      ] },
    ] },
  { id: 'shy-text-date-warm-3-passive', on: 'date', stage: 'warm', slot: 3, mood: 'passive',
    say: "That was a real date, wasn't it. Not an accident. Not a corner. A real one. I've been smiling at my kettle all morning.",
    opts: [
      { tone: 'cold', t: "It was a date, yes.", r: "A date. That's confirmed. ...You don't sound like you're smiling at a kettle.", opts: [
        { tone: 'cold', t: "I'm not a kettle person.", r: "No. Different appliances. That's fine. Sorry." },
        { tone: 'passive', t: "Sorry, I am smiling. Just tired.", r: "Tired and smiling. That's the best kind. I'll let you rest. And smile." },
        { tone: 'flirty', t: "I'm smiling at my phone, actually. At you.", r: "At me. The kettle and I are both very happy about that." },
      ] },
      { tone: 'passive', t: "A real one. And I'd like another real one.", r: "Another. I'll start planning. I'll have three options by tonight. I'm efficient about you.", opts: [
        { tone: 'cold', t: "One option is plenty.", r: "One option. I'll choose the best one. Quietly." },
        { tone: 'passive', t: "Surprise me, then.", r: "Bring a coat. And patience. And your hand. That's all the clues." },
        { tone: 'flirty', t: "Option one: you. Option two: you. Option three: you.", r: "That's three of me. Quite a crowd. ...I accept. All three. Don't tell the kettle." },
      ] },
      { tone: 'flirty', t: "A real date. With a real goodbye at the end.", r: "The goodbye. I'm still thinking about the goodbye. I've thought of nothing else. I burnt toast.", opts: [
        { tone: 'cold', t: "It was just a goodbye.", r: "Just a goodbye. To you. ...It was a lot of goodbye to me. Okay." },
        { tone: 'passive', t: "Same. I've been thinking about it too.", r: "You too? Then two people burnt toast this morning. That's a lot of toast. For one goodbye." },
        { tone: 'flirty', t: "Next time, a longer goodbye.", r: "Longer. How much longer? ...Don't answer. I'll find out. I'll be very cooperative." },
        { tone: 'risque', t: "Next time, maybe no goodbye at all.", r: "No goodbye. You mean— staying. Oh. I can't. Not yet. I'm thinking about it, though. A lot." },
      ] },
    ] },
  { id: 'shy-text-date-warm-3-flirty', on: 'date', stage: 'warm', slot: 3, mood: 'flirty',
    say: "The way you said goodbye. I keep thinking about it. I'm getting nothing done. I've read the same page nine times.",
    opts: [
      { tone: 'cold', t: "Concentrate on the page.", r: "Yes. The page. ...Ten times now. It's not working. Sorry.", opts: [
        { tone: 'cold', t: "Try again.", r: "Trying again. ...Eleven. I'll stop counting. I won't." },
        { tone: 'passive', t: "Sorry. It's on my mind as well.", r: "You have? Then neither of us is getting anything done. That's fair. That's very fair." },
        { tone: 'flirty', t: "Forget the page. Think about me.", r: "Easy. I've been doing it all morning. The page never stood a chance." },
      ] },
      { tone: 'passive', t: "Same. I keep thinking about it too.", r: "You too? Good. I was worried it was just me, reading pages over and over.", opts: [
        { tone: 'cold', t: "Mostly busy, though.", r: "Busy. Of course. ...I'll let you be busy. I'll read my page." },
        { tone: 'passive', t: "Want to do it again this weekend?", r: "This weekend. Yes. Somewhere quiet. I'll bring a book I can't read because of you." },
        { tone: 'flirty', t: "I've read your last text nine times too.", r: "Nine times. The same as my page. We're both reading things nine times. That's our number now." },
      ] },
      { tone: 'flirty', t: "Want me to say goodbye like that again?", r: "Yes. No. Yes. Give me notice. A day's notice. I'll need to sit down first.", opts: [
        { tone: 'cold', t: "Depends on you.", r: "On me. Okay. I'll be very... encouraging. Quietly." },
        { tone: 'passive', t: "I'll give you notice. Saturday?", r: "Saturday. That's days of notice. I'll use all of it. Preparing." },
        { tone: 'flirty', t: "No notice. That's half the fun.", r: "Half the fun is me falling over? ...Fine. Surprise me. I'll keep a chair nearby." },
        { tone: 'risque', t: "Next time I won't say goodbye at all.", r: "Not at all? You mean— oh. Not yet. ...But I'll be thinking about 'at all' all week." },
      ] },
    ] },

  // ==== date: the day after a date - close ================================================================================
  // ---- close 1 ---------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-date-close-1-cold', on: 'date', stage: 'close', slot: 1, mood: 'cold',
    say: "Thanks for yesterday. You were somewhere else for part of it. I'm not cross. I just missed you, while you were there.",
    opts: [
      { tone: 'cold', t: "Sorry. Work stuff.", r: "Work stuff. I understand. I just wanted you to know I noticed. I always notice." },
      { tone: 'passive', t: "You're right. I'm sorry. I'll be all there next time.", r: "All there. I'll hold you to it. I'll hold your hand to it." },
      { tone: 'flirty', t: "Making it up to you: all of me, all day.", r: "All of you. All day. That's a very generous offer. I accept every hour of it." },
      { tone: 'risque', t: "Let me make it up to you tonight.", r: "Tonight. ...I'm not cross any more. I'm something else entirely now. Come over." },
    ] },
  { id: 'shy-text-date-close-1-passive', on: 'date', stage: 'close', slot: 1, mood: 'passive',
    say: "Yesterday was perfect. At one point we both went quiet, and it wasn't awkward. My first ever comfortable silence.",
    opts: [
      { tone: 'cold', t: "You could've said something.", r: "I could have. I chose not to. You looked peaceful. Sorry if that was wrong." },
      { tone: 'passive', t: "Best silence I've ever had.", r: "Best silence. With me. That's going on my list. Near the top." },
      { tone: 'flirty', t: "Next time I'll go quiet on purpose.", r: "On purpose. Then I'll go quiet back. And then we won't move at all." },
      { tone: 'risque', t: "Next time, let's skip the talking altogether.", r: "Skip the— I'm at work. I've gone red at work. ...Yes. Next time. Yes." },
    ] },
  { id: 'shy-text-date-close-1-flirty', on: 'date', stage: 'close', slot: 1, mood: 'flirty',
    say: "Yesterday was lovely. Next time, can I borrow your jumper? Asking in writing so I can't back out. I won't give it back.",
    opts: [
      { tone: 'cold', t: "I'll need it back eventually.", r: "Eventually. That's a long word. I'll give it back in eventually. Not before." },
      { tone: 'passive', t: "It's yours. It'll look better on you.", r: "It won't. It'll be enormous on me. I'll look like a sad tent. A very happy sad tent." },
      { tone: 'flirty', t: "Have it. I'll come and visit it.", r: "Visit the jumper. And the person in it. The person in it would like that very much." },
      { tone: 'risque', t: "Have it. I'll take it back off you later.", r: "Later. ...I've read that and had to sit on the stairs. Yes. Later. I'll be wearing it." },
    ] },
  // ---- close 2 ---------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-date-close-2-cold', on: 'date', stage: 'close', slot: 2, mood: 'cold',
    say: "Sorry about how yesterday ended. I went quiet instead of saying it. So, now: I hate saying goodbye to you.",
    opts: [
      { tone: 'cold', t: "It's fine. Goodbyes happen.", r: "They do. I just don't like them. With you. ...That's all." },
      { tone: 'passive', t: "I hate them too. Glad you said.", r: "You hate them too. Then next time we'll just not say it. We'll say 'later'." },
      { tone: 'flirty', t: "Then let's stop saying goodbye. Stay longer next time.", r: "Then I'll stay longer. I'll stay until goodbye gets bored and leaves on its own." },
      { tone: 'risque', t: "Then don't leave next time. Stay the night.", r: "Stay the night. ...Yes. Next time. I'll bring a toothbrush. I've never typed anything bolder." },
    ] },
  { id: 'shy-text-date-close-2-passive', on: 'date', stage: 'close', slot: 2, mood: 'passive',
    say: "Yesterday was lovely. So: I've saved the edge of my sky jigsaw for us. Nobody gets the edge. That's how much.",
    opts: [
      { tone: 'cold', t: "A jigsaw. Hardly a grand gesture.", r: "For me it's huge. I've never shared an edge. ...Sorry. That sounded odd. It's true, though." },
      { tone: 'passive', t: "I'd love that. Next week?", r: "Same time. I'll leave the edge out. Nobody touches it. Except you. And the cat. Mostly you." },
      { tone: 'flirty', t: "Best part will be your hand on mine, finding pieces.", r: "That'll be strategic. I'll say you're reaching for the wrong blue. ...You won't be. I'll just want your hand." },
      { tone: 'risque', t: "Next time let's leave the jigsaw and find other things to do.", r: "Other things. ...The jigsaw is very patient. It can wait. It's waited before. Come over." },
    ] },
  { id: 'shy-text-date-close-2-flirty', on: 'date', stage: 'close', slot: 2, mood: 'flirty',
    say: "Yesterday you said my name in a way I'm going to hear all week. I'm not telling you which way. You know which way.",
    opts: [
      { tone: 'cold', t: "I just said your name.", r: "You did. Just my name. ...It didn't feel like 'just'. Never mind." },
      { tone: 'passive', t: "I know which way. I meant it.", r: "You meant it. Then I'll hear it all week and I won't mind at all." },
      { tone: 'flirty', t: "I'll say it like that again. Slowly.", r: "Slowly. Please give me a warning. And a chair. And— no. Just say it." },
      { tone: 'risque', t: "Tonight I'll say it like that. In the dark.", r: "In the dark. ...I've stopped typing for five minutes. I'm back. Yes. Tonight." },
    ] },
  // ---- close 3: the tenderest one (deep) ------------------------------------------------------------------------------------
  { id: 'shy-text-date-close-3-cold', on: 'date', stage: 'close', slot: 3, mood: 'cold',
    say: "Yesterday was good. Even the quiet bit in the middle. I don't want quiet bits with you. Not that kind. Can we talk?",
    opts: [
      { tone: 'cold', t: "We're fine. It was just a quiet moment.", r: "A quiet moment. I'm good at those usually. That one felt different. Never mind.", opts: [
        { tone: 'cold', t: "Leave it, please.", r: "Leaving it. ...I'll see you soon. Quietly." },
        { tone: 'passive', t: "You're right. I was distant. I'm sorry.", r: "Thank you. That's enough. You don't have to fix it. Just say it. You said it." },
        { tone: 'flirty', t: "I went quiet thinking about how much I love you.", r: "That's what the quiet was? Oh. I've been worrying about a quiet that was that. I love you back." },
      ] },
      { tone: 'passive', t: "Yes. Let's talk. I'm sorry about the quiet bit.", r: "It's not a big talk. Just: tell me when you go far away. So I'm not guessing.", opts: [
        { tone: 'cold', t: "I'll try.", r: "Trying is enough. Thank you. ...I'll stop guessing. I'll try too." },
        { tone: 'passive', t: "I promise. I'll tell you.", r: "Then I'll promise too. I'll tell you when my head gets loud. We'll both say." },
        { tone: 'flirty', t: "I'll tell you. And I'll come back faster.", r: "Faster. You're good at faster. It's sort of your job. Come back to me fast." },
        { tone: 'risque', t: "Let me come over and say sorry properly.", r: "Properly. ...I'll put the kettle on. I'll take the kettle off. Just come over." },
      ] },
      { tone: 'flirty', t: "No more quiet bits. Only the good kind, with you on my shoulder.", r: "The good kind. Me on your shoulder. ...That's the kind I like. No more of the other kind.", opts: [
        { tone: 'cold', t: "Let's not promise too much.", r: "No. Not too much. Just a little. A little is fine." },
        { tone: 'passive', t: "Deal. Talk tonight?", r: "Tonight. Yes. Call me. I'll answer. I always answer you. Even when I'm hiding." },
        { tone: 'flirty', t: "Deal. Sealed with a kiss when I see you.", r: "Sealed. I'll be ready. I'll be at the door. Early. Like always." },
      ] },
    ] },
  { id: 'shy-text-date-close-3-passive', on: 'date', stage: 'close', slot: 3, mood: 'passive',
    say: "Yesterday was the best day I've had in years. I didn't rehearse a single thing. I just... was. With you. Thank you.",
    opts: [
      { tone: 'cold', t: "It was nice.", r: "Nice. It was more than nice for me. That's okay. We don't have to match.", opts: [
        { tone: 'cold', t: "We don't.", r: "No. ...Then I'll have the best day on my own. Quietly." },
        { tone: 'passive', t: "Sorry. It was much more than nice. It was perfect.", r: "Perfect. Then we match. We match completely. That's lovely." },
        { tone: 'flirty', t: "It was the best day for me too. Because of you.", r: "Because of me. ...I'm going to need you to say that again in person. Slowly. Possibly twice." },
      ] },
      { tone: 'passive', t: "Same. The best day. You were completely you.", r: "Completely me. Nobody else gets that. Only you. It's the version I like best too.", opts: [
        { tone: 'cold', t: "Don't get soppy.", r: "Too late. Sorry. Soppy is my natural state now." },
        { tone: 'passive', t: "Let's have a hundred more days like that.", r: "A hundred. About three months. ...No. Let's have more than a hundred. Let's not count." },
        { tone: 'flirty', t: "I love that version of you. I love you.", r: "You— okay. I love you. I'm typing it. I'm sending it. I'm not deleting it. There." },
        { tone: 'risque', t: "Next time, the best night too.", r: "The best night. ...Yes. I'm not rehearsing that either. I'll just be there. Completely." },
      ] },
      { tone: 'flirty', t: "No rehearsing. Just you. That's my favourite person.", r: "Your favourite person. The one who used to hide. ...I'm not hiding any more. Not from you.", opts: [
        { tone: 'cold', t: "Easy, there.", r: "Easy. Yes. Sorry. I'm just very happy. It's spilling." },
        { tone: 'passive', t: "Never hide from me. Promise.", r: "Promise. I'll hide from everyone else. Not you. You get the whole me." },
        { tone: 'flirty', t: "Come and be my favourite person tonight.", r: "Tonight. I'll bring the whole me. And snacks. Mostly the whole me." },
      ] },
    ] },
  { id: 'shy-text-date-close-3-flirty', on: 'date', stage: 'close', slot: 3, mood: 'flirty',
    say: "You stayed. Way past when you said you'd go. And I didn't panic. Not even a little. Well. A little.",
    opts: [
      { tone: 'cold', t: "Of course I stayed. It's not news.", r: "It's news to me. ...Sorry. I'll be calm. I'm being calm. Look how calm.", opts: [
        { tone: 'cold', t: "Very calm.", r: "Very calm. Yes. ...I'm going to go and be calm in another room." },
        { tone: 'passive', t: "Sorry. I'm glad I stayed too.", r: "You are? Then I'm allowed to be not calm. Thank you." },
        { tone: 'flirty', t: "I'll stay again. And again.", r: "Again and again. I'll stop panicking. Gradually. Over several stays." },
      ] },
      { tone: 'passive', t: "I'm glad I stayed. You looked so relaxed.", r: "Relaxed. Me. I'm never relaxed. ...Apparently I am. Next to you. That's new.", opts: [
        { tone: 'cold', t: "You fidget a bit.", r: "I don't. Do I? ...Oh no. I'm going to go and be mortified now." },
        { tone: 'passive', t: "You were. You even hummed a bit.", r: "I hummed? I never hum. I've caught something. That's very romantic and also embarrassing." },
        { tone: 'flirty', t: "I want evenings like that every day.", r: "Every day. That's a lot of days. ...Yes. Every day. I'll clear a drawer for you." },
        { tone: 'risque', t: "Next time, let's not get up until noon.", r: "Noon. ...I'm going to need you to stop texting me things like that at work." },
      ] },
      { tone: 'flirty', t: "A little panic is cute. I'm staying longer tonight.", r: "Tonight. Again. I'll panic less. I'll panic about a third. A third panic.", opts: [
        { tone: 'cold', t: "Maybe not tonight.", r: "Not tonight. ...That's fine. My panic will keep." },
        { tone: 'passive', t: "Tonight. I'll bring breakfast for tomorrow.", r: "You're planning tomorrow. With me. ...I'm going to cry at my desk." },
        { tone: 'flirty', t: "Tonight, and I'll kiss the panic away.", r: "Kiss it away. That's a very good method. I'll report back on its effectiveness." },
        { tone: 'risque', t: "Tonight. And this time, no sleeping till late.", r: "No sleeping. ...I've read that four times. Yes. I'll nap this afternoon. Strategically." },
      ] },
    ] },

  // ==== after your race (stage 'any': nothing assumed about how close you are; no risque) ================================
  // ---- win -----------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-win-any-1-cold', on: 'win', stage: 'any', slot: 1, mood: 'cold',
    say: "You won. I saw. After last time I nearly didn't text. But you won at {last}, and I'm so happy for you. That's all.",
    opts: [
      { tone: 'cold', t: "Appreciated.", r: "You're welcome. ...Enjoy it. Properly. You deserve it." },
      { tone: 'passive', t: "Thank you. Means a lot, that.", r: "Does it? Then I'll say it again: you won. I'm so happy. Go and celebrate." },
      { tone: 'flirty', t: "Thanks. Wish you'd been there to celebrate.", r: "With the noise and the spraying? I'd have hidden behind a tyre. ...But I'd have been there." },
    ] },
  { id: 'shy-text-win-any-1-passive', on: 'win', stage: 'any', slot: 1, mood: 'passive',
    say: "You WON. I watched with the sound off and screamed into a cushion. Quietly. My cat left the room. Congratulations.",
    opts: [
      { tone: 'cold', t: "Ha. Thanks.", r: "Okay. I'll let you go. You must have a thousand messages. Mine is the quiet one." },
      { tone: 'passive', t: "You screamed? I'd have loved to see that.", r: "It was a very small scream. Into a cushion. You wouldn't have heard it. But it was a scream." },
      { tone: 'flirty', t: "Next time, scream at me in person.", r: "In person? I'd never. I'd just stand there and glow. ...That's my in-person scream. Glowing." },
    ] },
  { id: 'shy-text-win-any-1-flirty', on: 'win', stage: 'any', slot: 1, mood: 'flirty',
    say: "You won! I watched through my fingers, then took my fingers away and you were winning. I'm very proud. And very red.",
    opts: [
      { tone: 'cold', t: "It was a team effort.", r: "Of course. A team. Tell the team I'm proud of them too. Quietly." },
      { tone: 'passive', t: "Thank you. Glad you watched.", r: "I always watch. Fingers or not. ...I'll watch the next one with my eyes open. Maybe." },
      { tone: 'flirty', t: "Proud and red? Send a photo.", r: "No. Absolutely not. ...I'm a very proud tomato. That's the photo. Imagine it." },
    ] },
  { id: 'shy-text-win-any-2-cold', on: 'win', stage: 'any', slot: 2, mood: 'cold',
    say: "Another win. I'm happy for you. I mean that. I'm not good at saying it when things are... like this. But I am.",
    opts: [
      { tone: 'cold', t: "Thanks, I guess.", r: "You're welcome. ...Go and enjoy it. I'll be quiet." },
      { tone: 'passive', t: "Thank you. I know you mean it.", r: "I do. Every word. Even the ones I didn't manage to type. Congratulations." },
      { tone: 'flirty', t: "Say it in person and I'll believe you.", r: "In person I'd say 'well done' and look at the floor. ...But the floor and I would both mean it." },
    ] },
  { id: 'shy-text-win-any-2-passive', on: 'win', stage: 'any', slot: 2, mood: 'passive',
    say: "Two wins. I've stopped watching through my fingers. Now I watch through a cushion. It's progress. Well done.",
    opts: [
      { tone: 'cold', t: "Cushion's a step backwards, surely.", r: "It's a different step. Sideways. ...Sorry. I'll let you celebrate." },
      { tone: 'passive', t: "Progress is progress. Thank you!", r: "It is. Next race: no cushion. Just me. And a lot of breathing. Well done, again." },
      { tone: 'flirty', t: "Next time, watch the replay with me.", r: "With you. Knowing you win. I'd watch the whole thing. Twice. With my eyes open." },
    ] },
  { id: 'shy-text-win-any-2-flirty', on: 'win', stage: 'any', slot: 2, mood: 'flirty',
    say: "You won again. You're making it very hard to be calm about you. I've given up being calm. Congratulations.",
    opts: [
      { tone: 'cold', t: "Calm's overrated.", r: "It is. I'll stay uncalm. Quietly uncalm. Well done." },
      { tone: 'passive', t: "Thank you. Your messages are my favourite part.", r: "Your favourite part? Of winning? Over the trophy? ...That's not possible. It's staying in the folder regardless." },
      { tone: 'flirty', t: "Don't be calm. I like you excited.", r: "Excited. Me. I'm sitting very still and typing very fast. That's what excited looks like on me." },
    ] },
  { id: 'shy-text-win-any-3-cold', on: 'win', stage: 'any', slot: 3, mood: 'cold',
    say: "You've won again. You're making a habit of it. Proud doesn't cover it. I'm saying so, though we're... not quite right.",
    opts: [
      { tone: 'cold', t: "Habit's the job.", r: "Of course. The job. ...It's still impressive. Even if it's the job.", opts: [
        { tone: 'cold', t: "If you say so.", r: "I do. Quietly. Congratulations." },
        { tone: 'passive', t: "Thank you. Seriously.", r: "Seriously, you're welcome. I'll keep watching. It's becoming my habit too." },
        { tone: 'flirty', t: "Thank you. Want to celebrate with me?", r: "With you? Somewhere quiet? Yes. ...We could be quite right again. Quietly." },
      ] },
      { tone: 'passive', t: "Thank you. We'll get right again. I promise.", r: "I believe you. ...Go and celebrate. Then come back. When you're ready.", opts: [
        { tone: 'cold', t: "When I've got time.", r: "When you've got time. That's fine. I'll be here. I'm good at being here." },
        { tone: 'passive', t: "Soon. I'll call you.", r: "You'll call. I'll answer. I always answer. Even when it's hard." },
        { tone: 'flirty', t: "Tonight. I'd rather celebrate with you.", r: "With me? Over everyone else? ...Okay. Kettle's going on. That's my party." },
      ] },
      { tone: 'flirty', t: "Winning's nice. Hearing from you's nicer.", r: "Nicer than winning? That can't be true. ...I'll let it be true for today.", opts: [
        { tone: 'cold', t: "Figure of speech.", r: "Of course. A figure. ...It was nice to hear." },
        { tone: 'passive', t: "It's true. Every time.", r: "Every time. Then I'll keep sending them. Every win. Every not-win. All of them." },
        { tone: 'flirty', t: "Truer than anything. Come and see me.", r: "Where all the loud is? ...Okay. I'll come. I'll be at the edge somewhere. Find me." },
      ] },
    ] },
  { id: 'shy-text-win-any-3-passive', on: 'win', stage: 'any', slot: 3, mood: 'passive',
    say: "Three wins. You're making a habit of this. I've had to buy a new cushion. The old one's been screamed into too much.",
    opts: [
      { tone: 'cold', t: "You'll run out of cushions.", r: "I will. I'll switch to pillows. Then to blankets. You'll bankrupt me. Well done.", opts: [
        { tone: 'cold', t: "Better start saving.", r: "I've started. A cushion fund. ...Congratulations again." },
        { tone: 'passive', t: "I'll buy you a cushion. A winner's cushion.", r: "A winner's cushion. With your number on it. I'd scream into it very respectfully." },
        { tone: 'flirty', t: "Scream into my shoulder instead next time.", r: "Your shoulder? I'd have to be there. In person. Very close. ...Okay. Yes." },
      ] },
      { tone: 'passive', t: "Ha! Habit's a good word for it. Thank you.", r: "It's a good habit. You should keep it. I'll keep watching. That's mine.", opts: [
        { tone: 'cold', t: "Can't promise anything.", r: "No. Of course not. Nobody can. I'll watch anyway." },
        { tone: 'passive', t: "Deal. You keep watching, I'll keep winning.", r: "That's a deal. I'll keep my side. I'm very reliable. On sofas." },
        { tone: 'flirty', t: "I win better knowing you're screaming somewhere.", r: "Somewhere. Quietly. Into furniture. ...That's the most motivating thing about me? I'll take it." },
      ] },
      { tone: 'flirty', t: "I'll save you the trophy to hold.", r: "Hold it? I'd drop it. I'd drop it and then have to move abroad. ...I'd love to hold it.", opts: [
        { tone: 'cold', t: "Maybe not, then.", r: "No. Maybe not. ...I'll hold a cushion instead. Congratulations." },
        { tone: 'passive', t: "I'll hold it with you. Safe.", r: "With me. Both hands. Like a cup. ...Yes. I'd love that." },
        { tone: 'flirty', t: "Hold me instead. I'm easier to carry.", r: "Easier? You're— okay. I'll hold you. Not lift. Hold. ...That I can do. That I'd like." },
      ] },
    ] },
  { id: 'shy-text-win-any-3-flirty', on: 'win', stage: 'any', slot: 3, mood: 'flirty',
    say: "You keep winning. It's becoming a habit. So is thinking about you. I'm not sure which is worse for me. Congratulations.",
    opts: [
      { tone: 'cold', t: "Neither's my problem.", r: "No. Of course. Sorry. ...Congratulations. That's the only thing I meant to say.", opts: [
        { tone: 'cold', t: "Thanks, anyway.", r: "Anyway. You're welcome. ...Enjoy it." },
        { tone: 'passive', t: "Sorry. Bad wording. Thank you.", r: "It's okay. You've just won. Your words are probably still doing three hundred. Congratulations." },
        { tone: 'flirty', t: "Okay, it's my problem. And I like it.", r: "You like it? Me thinking about you? ...Then it continues. Habit-forming. Like you." },
      ] },
      { tone: 'passive', t: "Thinking about me's a good habit. Keep it.", r: "I'll keep it. Next to the winning one. Both very good habits.", opts: [
        { tone: 'cold', t: "Mostly the winning one.", r: "Mostly the winning. Yes. ...That's fair. Well done." },
        { tone: 'passive', t: "Thank you. Truly.", r: "Truly. You're welcome. Go and be loud. I'll be quiet and proud." },
        { tone: 'flirty', t: "I'll give you more reasons to keep it.", r: "You keep giving them. Every race. Every text. ...I'm out of room in the folder." },
      ] },
      { tone: 'flirty', t: "Both are worse for me too. I can't stop either.", r: "You think about me? While winning? ...That's the best thing anyone's ever said from a podium.", opts: [
        { tone: 'cold', t: "Don't quote me.", r: "I'll quote you. Silently. To myself. Forever. Sorry." },
        { tone: 'passive', t: "Every lap. Well, most laps.", r: "Most laps. That's fine. Some laps need you to think about corners. Corners first." },
        { tone: 'flirty', t: "Every lap. Especially the last one.", r: "The winning one. ...I'm going to go and lie in a darkened room. Proudly." },
      ] },
    ] },
  // ---- podium --------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-podium-any-1-cold', on: 'podium', stage: 'any', slot: 1, mood: 'cold',
    say: "You were on the podium. I saw. I know we're— anyway. I wanted to say well done. I'll go now.",
    opts: [
      { tone: 'cold', t: "Thanks. Would've liked the win.", r: "Of course. The win. ...It was still very good. From the sofa it was very good.", opts: [
        { tone: 'cold', t: "Not good enough.", r: "No. Okay. ...I'll stop. Next time, then." },
        { tone: 'passive', t: "You're right. It was good. Thank you.", r: "It was. Top three, out of all of them. That's a lot of people behind you. Well done." },
        { tone: 'flirty', t: "Next time I'll win it for you.", r: "For me? Okay. I'll watch with my eyes fully open. For the win you're doing for me." },
      ] },
      { tone: 'passive', t: "Thank you. Don't go. It's nice to hear from you.", r: "Is it? I'll stay. A bit. Well done. Really. I mean it.", opts: [
        { tone: 'cold', t: "Okay, I do have to go now, though.", r: "Of course. Go. I'll be here. Quietly." },
        { tone: 'passive', t: "How did you watch it?", r: "Sofa. Sound off. Cat on my lap. Fingers over my eyes for the start. The usual. It's a ritual." },
        { tone: 'flirty', t: "Stay longer. Tell me what you liked best.", r: "When you took your helmet off and you were smiling. That bit. I liked that bit best. A lot." },
      ] },
      { tone: 'flirty', t: "Well done back. For watching.", r: "Watching isn't hard. ...It is, actually. It's very hard. I hold my breath for two hours.", opts: [
        { tone: 'cold', t: "Then don't watch.", r: "I'll always watch. Sorry. That's not up to me. Well done." },
        { tone: 'passive', t: "Breathe! I'm fine. Always.", r: "Breathing. You're always fine. I'll keep telling myself that. Every lap." },
        { tone: 'flirty', t: "I'll make the next one worth the breath.", r: "Every one's worth it. ...That's a lot to say. I've said it. Well done. Breathe, me." },
      ] },
    ] },
  { id: 'shy-text-podium-any-1-passive', on: 'podium', stage: 'any', slot: 1, mood: 'passive',
    say: "A podium! I watched the whole thing through my fingers. Then the last lap with no fingers at all. Well done, really.",
    opts: [
      { tone: 'cold', t: "It was alright.", r: "Alright? It was a podium. That's three steps up. That's very alright.", opts: [
        { tone: 'cold', t: "Not winning is just losing.", r: "No. It isn't. I won't argue. I'll just disagree quietly." },
        { tone: 'passive', t: "Okay, it was pretty good. Thank you.", r: "Pretty good. Very good. I'm going to say very good until you agree." },
        { tone: 'flirty', t: "You're very sweet when you argue.", r: "I'm not arguing. I'm disagreeing. Quietly. ...I'm sweet? Then I'll disagree more often." },
      ] },
      { tone: 'passive', t: "Thank you! The last lap was brutal.", r: "It looked brutal. I stopped breathing. Then started again. Then you were on the podium. Then I cried a bit.", opts: [
        { tone: 'cold', t: "No need to cry.", r: "No. There wasn't. I did anyway. That's how I watch. Sorry." },
        { tone: 'passive', t: "Happy tears, I hope.", r: "Very happy. Relieved. Proud. All of them. I'm a very full person right now." },
        { tone: 'flirty', t: "I'd have liked to see you cry for me.", r: "You'd have seen a very red, very damp person. ...It's not a good look. It was for you, though." },
      ] },
      { tone: 'flirty', t: "No fingers? You're getting brave.", r: "Brave on a sofa. I'm a sofa hero. ...It was worth it. You were brilliant.", opts: [
        { tone: 'cold', t: "Calm down.", r: "Calming. ...It was still brilliant." },
        { tone: 'passive', t: "Thank you. Your messages make it better.", r: "Do they? Then more are coming. Even after the bad ones. Especially then." },
        { tone: 'flirty', t: "Be brave in person next time. Come to a race.", r: "With the noise. ...I'd come. I'd stand at the back. You'd know I was there. Somehow." },
      ] },
    ] },
  { id: 'shy-text-podium-any-1-flirty', on: 'podium', stage: 'any', slot: 1, mood: 'flirty',
    say: "Podium! You looked so happy up there. I took a screenshot. For research. It's my lock screen now. That's research.",
    opts: [
      { tone: 'cold', t: "Change your lock screen.", r: "Changing. ...It's a cloud now. A very boring cloud. Well done anyway.", opts: [
        { tone: 'cold', t: "Much better.", r: "Yes. Much. ...The cloud's not as good. Congratulations." },
        { tone: 'passive', t: "Kidding. Keep it.", r: "Keeping it. Thank you. It's a very good research photo." },
        { tone: 'flirty', t: "Kidding. Keep it, and I'll send you a better one.", r: "A better one? Of you? On purpose? ...I'll need a second phone. For the research." },
      ] },
      { tone: 'passive', t: "Ha! I'll send you a better one.", r: "A better one. Is that possible? Send it. I'll be very scientific about it.", opts: [
        { tone: 'cold', t: "On second thoughts, no.", r: "No. Okay. ...I'll keep the screenshot, then. Quietly." },
        { tone: 'passive', t: "Sending. Don't laugh.", r: "I'm not laughing. I'm smiling at my phone in a café. People are worried about me." },
        { tone: 'flirty', t: "Sending. It's just for you.", r: "Just for me. I'm putting it somewhere very safe. Somewhere only I look." },
      ] },
      { tone: 'flirty', t: "Research, huh? What are you studying?", r: "You. Obviously. It's a very long study. I'm only on chapter one.", opts: [
        { tone: 'cold', t: "Stop studying.", r: "Stopped. ...I'll just look, then. Not study. Well done." },
        { tone: 'passive', t: "How many chapters are there?", r: "I don't know yet. A lot. It's the kind of book that gets longer the more you read." },
        { tone: 'flirty', t: "Come and study me in person.", r: "In person. Up close. ...That's a very different kind of research. Yes. I'll bring a notebook." },
      ] },
    ] },
  { id: 'shy-text-podium-any-2-cold', on: 'podium', stage: 'any', slot: 2, mood: 'cold',
    say: "Another podium. Well done. I'm still a bit quiet, after last time. But I watched every lap. I always do.",
    opts: [
      { tone: 'cold', t: "Thanks for watching.", r: "You're welcome. ...I'll keep watching. Quietly." },
      { tone: 'passive', t: "I'm glad you watched. We'll talk soon?", r: "Soon. Yes. I'd like that. Well done. Really." },
      { tone: 'flirty', t: "Every lap? Then you saw me wave at the end.", r: "You waved at the camera. That wasn't for me. ...Was it for me?" },
    ] },
  { id: 'shy-text-podium-any-2-passive', on: 'podium', stage: 'any', slot: 2, mood: 'passive',
    say: "Two podiums. I've got a system now: sofa, sound off, cat, and a cushion for the last five laps. Well done, you.",
    opts: [
      { tone: 'cold', t: "Sounds complicated.", r: "It is. It's a whole ceremony. It works, though. Look where you finished." },
      { tone: 'passive', t: "I love your system. Thank you.", r: "Thank you. It's very scientific. The cat is essential. Well done again." },
      { tone: 'flirty', t: "Add me to the system. Watch the replay with me.", r: "With you? ...Oh. The replay. Okay. Yes. You can be the cushion." },
    ] },
  { id: 'shy-text-podium-any-2-flirty', on: 'podium', stage: 'any', slot: 2, mood: 'flirty',
    say: "Podium again! You look very good up there. You'd look very good anywhere. Ignore that. Don't ignore that. Well done.",
    opts: [
      { tone: 'cold', t: "Ignoring that.", r: "Good. Thank you. ...Well done, though. That part stands." },
      { tone: 'passive', t: "Thank you! You'd look good up there too.", r: "Me? On a podium? I'd fall off. Sideways. In front of everyone. But thank you." },
      { tone: 'flirty', t: "Not ignoring it. I'd look better next to you.", r: "On a podium? On a sofa? ...The sofa. Definitely the sofa. Come and look good on my sofa." },
    ] },
  { id: 'shy-text-podium-any-3-cold', on: 'podium', stage: 'any', slot: 3, mood: 'cold',
    say: "You're making a habit of podiums. Well done. I haven't stopped watching. Even when things are quiet between us.",
    opts: [
      { tone: 'cold', t: "Standard stuff.", r: "It is. I know. ...It's still impressive. To me." },
      { tone: 'passive', t: "Thank you for always watching.", r: "Always. Even when it's quiet. Especially then. Well done." },
      { tone: 'flirty', t: "I'd rather things weren't quiet between us.", r: "Me too. ...Then let's not be quiet. Let's be talking. I'll start. Well done. There." },
    ] },
  { id: 'shy-text-podium-any-3-passive', on: 'podium', stage: 'any', slot: 3, mood: 'passive',
    say: "Three podiums. A habit, now. I set an alarm for the last five laps now, so I can be brave in time.",
    opts: [
      { tone: 'cold', t: "Seems like a lot of effort.", r: "It is. It's worth it. ...Sorry. Well done." },
      { tone: 'passive', t: "Brave in time. I love that.", r: "It's my best trick. Bravery on a timer. Well done, again. You make it easy." },
      { tone: 'flirty', t: "Set an alarm for me next time. After the race.", r: "After the race. For you. ...I'll set it. It'll say 'call them'. I'll be brave on time." },
    ] },
  { id: 'shy-text-podium-any-3-flirty', on: 'podium', stage: 'any', slot: 3, mood: 'flirty',
    say: "Another podium. At this point your face is just my lock screen permanently. It saves time. Well done.",
    opts: [
      { tone: 'cold', t: "Bit much, isn't it?", r: "It's a sensible amount. For a— no. It's a lot. I'll change it. Eventually." },
      { tone: 'passive', t: "Saves time. Very efficient.", r: "Very efficient. I'm an efficient admirer. ...That was a lot. Well done." },
      { tone: 'flirty', t: "Then I'll keep giving you good faces.", r: "Please do. I'll keep them all. I'll have the best lock screens in the world." },
    ] },
  // ---- points --------------------------------------------------------------------------------------------------------------
  { id: 'shy-text-points-any-1-cold', on: 'points', stage: 'any', slot: 1, mood: 'cold',
    say: "You got points. I saw. I don't know if you want to hear from me. But that was a good race. That's all.",
    opts: [
      { tone: 'cold', t: "Wasn't great.", r: "It was good. From here. ...I'll go quiet now." },
      { tone: 'passive', t: "Thanks. It was a solid one.", r: "Solid. Solid's good. Solid's underrated. Well done." },
      { tone: 'flirty', t: "I always want to hear from you.", r: "Always? Then I'll keep... being heard from. Quietly. Often." },
    ] },
  { id: 'shy-text-points-any-1-passive', on: 'points', stage: 'any', slot: 1, mood: 'passive',
    say: "Points! I watched with the sound off and the cat on my lap. You were very steady. I liked the steadiness. Well done.",
    opts: [
      { tone: 'cold', t: "Points is just points.", r: "It's more than nothing. It's a lot more than nothing. Sorry. Well done." },
      { tone: 'passive', t: "Steady's the goal. Thank you.", r: "Steady. I'm good at steady. It's my best thing. You were very me today." },
      { tone: 'flirty', t: "Steady because I knew you were watching.", r: "Because I was— then I'll keep watching. For the steadiness. For science." },
    ] },
  { id: 'shy-text-points-any-1-flirty', on: 'points', stage: 'any', slot: 1, mood: 'flirty',
    say: "Points! You were brilliant. I said 'come on' out loud. To a television. On my own. The most I've ever said to a TV.",
    opts: [
      { tone: 'cold', t: "Points isn't brilliant.", r: "It is from my sofa. ...Okay. I'll be quieter about it." },
      { tone: 'passive', t: "Ha! What did the TV say back?", r: "Nothing. Very rude. It just showed you overtaking someone. ...Actually, that was a good answer." },
      { tone: 'flirty', t: "Say 'come on' to me next time. In person.", r: "Out loud. To your face. ...I'd say it very quietly. You'd have to lean in." },
    ] },
  { id: 'shy-text-points-any-2-cold', on: 'points', stage: 'any', slot: 2, mood: 'cold',
    say: "More points. That's good. I'm sorry it's been quiet. I watched. I'm still watching.",
    opts: [
      { tone: 'cold', t: "Watching's fine.", r: "Okay. I'll keep watching, then. Fine." },
      { tone: 'passive', t: "Don't be sorry. Thanks for watching.", r: "I won't be sorry. I'll just be proud. Quietly. Well done." },
      { tone: 'flirty', t: "Keep watching. I like knowing you are.", r: "Then I always will. Even the boring laps. Especially the boring laps." },
    ] },
  { id: 'shy-text-points-any-2-passive', on: 'points', stage: 'any', slot: 2, mood: 'passive',
    say: "Points again! You're very consistent. I like consistent. Consistent is my favourite kind of exciting.",
    opts: [
      { tone: 'cold', t: "Consistent isn't winning.", r: "No. But it's not nothing. ...Sorry. I'll leave the analysis to you." },
      { tone: 'passive', t: "Consistent's underrated. Thank you.", r: "It is. I'm very consistent. Consistently quiet. We match, a bit." },
      { tone: 'flirty', t: "Consistent, like how much I think about you.", r: "That's a very consistent compliment. I'm going to need a minute." },
    ] },
  { id: 'shy-text-points-any-2-flirty', on: 'points', stage: 'any', slot: 2, mood: 'flirty',
    say: "More points! I've started a little chart. Of your results. With stickers. Ignore the stickers.",
    opts: [
      { tone: 'cold', t: "Stickers? Really?", r: "Yes. Small ones. Stars. ...It's embarrassing. I'll take them off." },
      { tone: 'passive', t: "I want to see the chart.", r: "No. ...Maybe. One day. When the chart is bigger. It's going to be a very big chart." },
      { tone: 'flirty', t: "Give me a sticker in person.", r: "A sticker. Where? ...No. Don't answer. I'll choose. I'll choose carefully." },
    ] },
  { id: 'shy-text-points-any-3-cold', on: 'points', stage: 'any', slot: 3, mood: 'cold',
    say: "Points again. That's a habit now. I've noticed. I always notice. Even when you're far away.",
    opts: [
      { tone: 'cold', t: "It's just points.", r: "Just points. ...It's a lot of just points. Added up. That's a season.", opts: [
        { tone: 'cold', t: "Mm.", r: "Mm. ...Okay. Well done anyway." },
        { tone: 'passive', t: "You're right. It adds up. Thanks.", r: "It does. You're building something. Slowly. I know about slowly. It works." },
        { tone: 'flirty', t: "And you've noticed every one. I like that.", r: "Every one. And every little thing in between. I notice that too. Every time." },
      ] },
      { tone: 'passive', t: "I'm not far away. Not really. Thanks for noticing.", r: "Not really far. That helps. ...Well done. Truly.", opts: [
        { tone: 'cold', t: "Busy, though.", r: "Busy. Of course. I'll keep noticing from here." },
        { tone: 'passive', t: "Let's catch up soon.", r: "Soon. Yes. Somewhere quiet. Bring the points. I'll bring tea." },
        { tone: 'flirty', t: "Come closer, then. I'll prove it.", r: "Closer. How? ...Oh. In person. I'll come. I'll be very close. Prove it." },
      ] },
      { tone: 'flirty', t: "Notice me in person sometime. I'd like that.", r: "In person I notice too much and say too little. ...But okay. I'll notice. Loudly. For me.", opts: [
        { tone: 'cold', t: "Or not.", r: "Or not. Okay. ...I'll notice quietly. Like always." },
        { tone: 'passive', t: "Too little's fine. I'll do the talking.", r: "You talk. I'll notice. That's a very good system. We should patent it." },
        { tone: 'flirty', t: "Say one thing you noticed today.", r: "You smiled at the end. At nobody. Just because. ...I noticed that. It made my whole day." },
      ] },
    ] },
  { id: 'shy-text-points-any-3-passive', on: 'points', stage: 'any', slot: 3, mood: 'passive',
    say: "Points again. You've made a habit of it. I'm making a habit of being proud of you. We both have habits now.",
    opts: [
      { tone: 'cold', t: "Habits are boring.", r: "Not this one. ...Sorry. Well done.", opts: [
        { tone: 'cold', t: "Agree to disagree.", r: "Agreed. I'll disagree quietly. Proudly." },
        { tone: 'passive', t: "Okay, it's a good habit. Thank you.", r: "A very good habit. Mine and yours. Keep it going." },
        { tone: 'flirty', t: "Being proud of me suits you.", r: "Does it? Then I'll wear it every race." },
      ] },
      { tone: 'passive', t: "We do. I like our habits.", r: "So do I. Yours is points. Mine's sofas and cushions and being proud. Good habits.", opts: [
        { tone: 'cold', t: "Mine's a lot more work.", r: "It is. Much more. ...I'll stop comparing. Well done." },
        { tone: 'passive', t: "Let's keep them both.", r: "Both. Forever. Or at least this season. Then we'll review." },
        { tone: 'flirty', t: "Add one: seeing me after every race.", r: "After every race. That's a very good habit. I'll add it. In pen." },
      ] },
      { tone: 'flirty', t: "What's your habit, exactly? Tell me.", r: "Sofa. Sound off. Cat. Cushion. Whispered 'come on'. Text you after. That's the habit. All of it.", opts: [
        { tone: 'cold', t: "That's a lot of steps.", r: "It is. They're all necessary. The last one most. Well done." },
        { tone: 'passive', t: "I love that I'm in the habit.", r: "You're the whole habit. The rest is just furniture." },
        { tone: 'flirty', t: "Next time, swap the sofa for me.", r: "The cushion for you. ...That's a much better habit. Don't bring a cat. Just bring you." },
      ] },
    ] },
  { id: 'shy-text-points-any-3-flirty', on: 'points', stage: 'any', slot: 3, mood: 'flirty',
    say: "Points again! Third time. My chart has run out of room. I've had to start a second page. The stickers are thriving.",
    opts: [
      { tone: 'cold', t: "Throw the chart away.", r: "No. ...Okay. I'll hide it. It'll still exist. Hidden charts count.", opts: [
        { tone: 'cold', t: "Whatever works.", r: "Whatever works. ...The chart works. Well done." },
        { tone: 'passive', t: "Kidding. Keep the chart.", r: "Keeping it. It's a very good chart. It's mostly you, going up." },
        { tone: 'flirty', t: "Kidding. Put a sticker on it for me.", r: "A gold one. The rare ones. I've been saving them. ...For you, obviously." },
      ] },
      { tone: 'passive', t: "Second page! Show me sometime.", r: "Sometime. When it's three pages. Then it's a book. Then I'll give it to you.", opts: [
        { tone: 'cold', t: "A book's a bit much.", r: "Yes. Okay. A pamphlet, then. A small one." },
        { tone: 'passive', t: "I'd read every page.", r: "You would. You read everything I send. That's still very new to me." },
        { tone: 'flirty', t: "Sign it for me. Inside the cover.", r: "Sign it. With what? ...'To you, from the quiet one.' That's what it'd say. I've decided." },
      ] },
      { tone: 'flirty', t: "Thriving stickers. Thriving me. Thriving you?", r: "Thriving me. Yes. ...That's a strange word for me. It's true, though. Lately.", opts: [
        { tone: 'cold', t: "Good for you.", r: "Thank you. ...Well done, you too." },
        { tone: 'passive', t: "I'm glad. You deserve to.", r: "Do I? Okay. Then I'll keep thriving. Quietly. In the back row." },
        { tone: 'flirty', t: "Is that because of me?", r: "Partly. Mostly. ...Fine: yes. Don't let it go to your head. It's gone to mine." },
      ] },
    ] },
  // ---- bad (outside the points) ----------------------------------------------------------------------------------------------
  { id: 'shy-text-bad-any-1-cold', on: 'bad', stage: 'any', slot: 1, mood: 'cold',
    say: "That was a hard race. I'm sorry. I'm not sure you want to hear from me. But I watched. And you were brave.",
    opts: [
      { tone: 'cold', t: "Not now.", r: "Okay. Not now. I'll be here later. Quietly.", opts: [
        { tone: 'cold', t: "Later, maybe.", r: "Later, maybe. That's fine. I'll leave the light on. Metaphorically." },
        { tone: 'passive', t: "Sorry. Thank you for watching.", r: "You don't need to be sorry. You had a bad day. Bad days are allowed." },
        { tone: 'flirty', t: "Sorry. I'd actually like a hug. In writing.", r: "This is it. This whole text. Imagine it with arms. It's a very long hug." },
      ] },
      { tone: 'passive', t: "Thank you. It was rough.", r: "Rough. I could tell. Even through a helmet. You looked like you were fighting every lap.", opts: [
        { tone: 'cold', t: "You could tell?", r: "I notice everything. Sorry. I'll stop. ...I'm still on your side." },
        { tone: 'passive', t: "Was it that obvious? Thanks for noticing.", r: "It's my job, noticing. It means you were trying very hard. I saw you trying." },
        { tone: 'flirty', t: "Only you would notice that.", r: "Only me. I'm a very specialised fan. I notice the small things. Like how you didn't give up." },
      ] },
      { tone: 'flirty', t: "Brave? I'll take brave. Thank you.", r: "You were. Everyone else saw {result}. I saw you keep going.", opts: [
        { tone: 'cold', t: "Doesn't change the result.", r: "No. It doesn't. ...It changes something. For me. Sorry." },
        { tone: 'passive', t: "That really helps.", r: "Good. It's true. I don't say things that aren't true. I don't say much at all." },
        { tone: 'flirty', t: "Tell me that in person. I'll need it.", r: "In person. I'll say it. Quietly. Right up close, so nobody else hears." },
      ] },
    ] },
  { id: 'shy-text-bad-any-1-passive', on: 'bad', stage: 'any', slot: 1, mood: 'passive',
    say: "That looked hard. I'm sorry. You don't have to reply. I just wanted you to know someone quiet is on your side.",
    opts: [
      { tone: 'cold', t: "Don't need cheering up.", r: "I'm not cheering. I'm just... here. Like furniture. Supportive furniture.", opts: [
        { tone: 'cold', t: "Right then.", r: "Right. ...I'll be very quiet furniture." },
        { tone: 'passive', t: "Supportive furniture's actually nice. Thanks.", r: "It's my best role. Better than the tree. ...I'll explain the tree another time." },
        { tone: 'flirty', t: "You're my favourite furniture.", r: "I've never been anyone's favourite anything. ...I'll be a good chair. The best chair." },
      ] },
      { tone: 'passive', t: "Thank you. I really needed that.", r: "Then I'm glad I sent it. I almost didn't. I nearly always don't. I did.", opts: [
        { tone: 'cold', t: "Don't make a habit of 'almost'.", r: "No. I'll try to send more. Without the almost." },
        { tone: 'passive', t: "Keep sending them. They help.", r: "Every race. Good or bad. I'll be the quiet message at the bottom. The one that waits." },
        { tone: 'flirty', t: "You're the best part of a bad day.", r: "The best part. Of a bad day. ...That's a very good thing to be. I'll stay that." },
      ] },
      { tone: 'flirty', t: "Someone quiet on my side? My favourite someone.", r: "Favourite. Me? On a bad day? ...Then I'll be extra quiet and extra on your side.", opts: [
        { tone: 'cold', t: "Easy.", r: "Easy. Okay. ...Still on your side, though." },
        { tone: 'passive', t: "Thank you. Really.", r: "You're welcome. Rest. Eat something. That's my advice. From the sofa." },
        { tone: 'flirty', t: "Come and be quiet on my side in person.", r: "Next to you. Saying nothing. That's my speciality. I'll come and say nothing beautifully." },
      ] },
    ] },
  { id: 'shy-text-bad-any-1-flirty', on: 'bad', stage: 'any', slot: 1, mood: 'flirty',
    say: "Bad race. You still looked brilliant. I know that's not the point. It's my point. I'm on your side. Always.",
    opts: [
      { tone: 'cold', t: "That's not helpful.", r: "No. Sorry. It wasn't meant to be helpful. Just true. Quiet now.", opts: [
        { tone: 'cold', t: "Appreciate it.", r: "Okay. ...Rest well." },
        { tone: 'passive', t: "Sorry. It is helpful. Thank you.", r: "It's okay. Bad races make everything sharp. I don't mind. Your side's where I am." },
        { tone: 'flirty', t: "Okay, it helps a bit. Say something else.", r: "You looked brilliant even when you were cross. Especially then. ...That's two things." },
      ] },
      { tone: 'passive', t: "Thank you. That always means a lot.", r: "Always. I meant always. Good races, bad races. I'll be the same.", opts: [
        { tone: 'cold', t: "Okay, okay.", r: "Okay. ...Still always." },
        { tone: 'passive', t: "You're very steady. I like that.", r: "It's because I don't move much. It's useful, sometimes." },
        { tone: 'flirty', t: "Always is a big word. I like it from you.", r: "It's the biggest word I've got. I don't use it much. I'm using it on you." },
      ] },
      { tone: 'flirty', t: "Brilliant? Even outside the points?", r: "Outside the points, inside my head. ...That sounded better before I typed it. You get it.", opts: [
        { tone: 'cold', t: "Not really.", r: "No. ...I'll stick to plainer words. You were brave." },
        { tone: 'passive', t: "I know what you mean. Thank you.", r: "Good. You always know what I mean. Even when I don't." },
        { tone: 'flirty', t: "Inside your head's a good place to be.", r: "It's very quiet in there. Except for you. You're quite loud in there. Nicely." },
      ] },
    ] },
  { id: 'shy-text-bad-any-2-cold', on: 'bad', stage: 'any', slot: 2, mood: 'cold',
    say: "Another hard one. I'm sorry. I know things are a bit quiet with us. On your side, though. That hasn't changed.",
    opts: [
      { tone: 'cold', t: "Message received.", r: "Okay. ...Rest well. That's all." },
      { tone: 'passive', t: "Thank you. That means more than you know.", r: "I think I know. A bit. You're welcome. Rest." },
      { tone: 'flirty', t: "Good. I need you on my side.", r: "You have me. On your side. Every side. ...That's not how sides work. You have me." },
    ] },
  { id: 'shy-text-bad-any-2-passive', on: 'bad', stage: 'any', slot: 2, mood: 'passive',
    say: "Another tough one. I'm sorry. Bad races don't last. I've checked. They end at the chequered flag. Then there's tea.",
    opts: [
      { tone: 'cold', t: "Tea won't fix it.", r: "No. It won't. It'll help a tiny bit. That's what tea's for." },
      { tone: 'passive', t: "Ha. Thank you. I needed that.", r: "Good. Tea, then sleep, then the next one. That's the plan. I've made you a plan." },
      { tone: 'flirty', t: "Make me the tea yourself.", r: "I'd make it too hot. You'd burn your tongue. ...I'd make it anyway. With biscuits." },
    ] },
  { id: 'shy-text-bad-any-2-flirty', on: 'bad', stage: 'any', slot: 2, mood: 'flirty',
    say: "Two rough ones in a row. You deserve a cuddle and a very quiet room. I can offer both. Mainly the quiet room. And me.",
    opts: [
      { tone: 'cold', t: "Not in the mood.", r: "Of course. Sorry. The offer stays open. Quietly." },
      { tone: 'passive', t: "That actually sounds perfect.", r: "It is perfect. The quiet room has a blanket and a cat. You'd sleep for days." },
      { tone: 'flirty', t: "Both. Especially you.", r: "Especially me. Then come. I'll be quiet. I'll be very quiet and very there." },
    ] },
  { id: 'shy-text-bad-any-3-cold', on: 'bad', stage: 'any', slot: 3, mood: 'cold',
    say: "That's three hard ones. You're making a habit of it, and I hate it for you. I'm still here. Even now.",
    opts: [
      { tone: 'cold', t: "Don't remind me.", r: "Sorry. I won't. ...I'll just be here. Not reminding." },
      { tone: 'passive', t: "Thanks for sticking around. It helps.", r: "I'm good at staying. It's one of my things. Staying." },
      { tone: 'flirty', t: "Stay close. I need you more than ever.", r: "Then I'm right here. Staying put. I'm very hard to move." },
    ] },
  { id: 'shy-text-bad-any-3-passive', on: 'bad', stage: 'any', slot: 3, mood: 'passive',
    say: "Third bad one. You're making a habit of it, and I'm making a habit of texting you after. One of those is a good habit.",
    opts: [
      { tone: 'cold', t: "I know it's a habit.", r: "Sorry. That came out badly. It'll turn round. They always do." },
      { tone: 'passive', t: "Your habit's the good one. Thank you.", r: "Mine's easy. Yours is hard. You keep doing the hard one anyway. That's brave." },
      { tone: 'flirty', t: "Your texts are the best part of the bad weekends.", r: "The best part. Then I'll make them longer. With fewer apologies. And maybe a joke." },
    ] },
  { id: 'shy-text-bad-any-3-flirty', on: 'bad', stage: 'any', slot: 3, mood: 'flirty',
    say: "Three rough races. If you're going to keep doing this, I'm going to keep turning up. That's the deal. That's my habit.",
    opts: [
      { tone: 'cold', t: "No need, honestly.", r: "I know. I want to. That's different. I'll be here." },
      { tone: 'passive', t: "That's a deal I'll take. Thank you.", r: "Good. It's a very good deal. You get me, every time. Win or lose." },
      { tone: 'flirty', t: "Turn up tonight, then. I'll be the one sulking.", r: "I'll bring tea and quiet. You can sulk. I'm very good company for sulking." },
    ] },
  // ---- dnf (out of the race) -------------------------------------------------------------------------------------------------
  { id: 'shy-text-dnf-any-1-cold', on: 'dnf', stage: 'any', slot: 1, mood: 'cold',
    say: "I saw you didn't finish. Are you alright? No need to answer. I just needed to ask.",
    opts: [
      { tone: 'cold', t: "I'm fine.", r: "Fine. Good. That's enough. ...Thanks for replying." },
      { tone: 'passive', t: "I'm okay. Thanks for asking.", r: "Okay. Good. Thank you. I'm going to sit down now. For ages." },
      { tone: 'flirty', t: "I'm okay. Better now you've asked.", r: "Better? Because of me? ...Then I'll ask every time. Even when I'm nervous. Especially then." },
    ] },
  { id: 'shy-text-dnf-any-1-passive', on: 'dnf', stage: 'any', slot: 1, mood: 'passive',
    say: "Are you okay? I saw the car stop and I stopped breathing. Text me one word. Any word. Then I'll breathe again.",
    opts: [
      { tone: 'cold', t: "Word.", r: "...That's a word. Okay. Breathing. Thank you. Rest now." },
      { tone: 'passive', t: "I'm okay. Promise. Breathe.", r: "Breathing. In, out. You're okay. I'll keep saying it until I believe it." },
      { tone: 'flirty', t: "I'm okay. Here's another word: you're sweet.", r: "That's more than one word. And one's about me. I'm breathing now. Mostly in a flustered way." },
    ] },
  { id: 'shy-text-dnf-any-1-flirty', on: 'dnf', stage: 'any', slot: 1, mood: 'flirty',
    say: "Please tell me you're okay. I watched you climb out and wave and I sat down on the floor. I'm still on the floor.",
    opts: [
      { tone: 'cold', t: "Get off the floor. I'm fine.", r: "Getting up. I'm up. You're fine. That's all that matters." },
      { tone: 'passive', t: "I'm fine. Promise. You can get up now.", r: "Up. Sitting on the sofa now. Much more dignified. You're okay. Good." },
      { tone: 'flirty', t: "Stay down there. I'll come and pick you up.", r: "Pick me up. Off the floor. ...I'll stay down here, then. Just in case you mean it." },
    ] },
  { id: 'shy-text-dnf-any-2-cold', on: 'dnf', stage: 'any', slot: 2, mood: 'cold',
    say: "You didn't finish again. I'm sorry. You're probably frustrated. I'm here, if you want. Last time or not.",
    opts: [
      { tone: 'cold', t: "Frustrated, yes.", r: "Of course. ...Space it is. Say if you want me." },
      { tone: 'passive', t: "Thanks. I'm okay. Just annoyed.", r: "Annoyed is allowed. Annoyed is healthy. Be annoyed at me if you like. I'm sturdy." },
      { tone: 'flirty', t: "I want you. Text me all night.", r: "All night. I'll make tea and text you until you're sleepy. That's a promise." },
    ] },
  { id: 'shy-text-dnf-any-2-passive', on: 'dnf', stage: 'any', slot: 2, mood: 'passive',
    say: "Another one that didn't finish. Are you alright? I'm alright. I mean I'm not. I'm alright now I've texted you.",
    opts: [
      { tone: 'cold', t: "I'm fine. Stop worrying.", r: "I'll try. I won't manage. But I'll worry more quietly." },
      { tone: 'passive', t: "I'm okay. Thanks for checking on me.", r: "Always. I'll always check. You'll get very bored of my checking." },
      { tone: 'flirty', t: "Better now you've texted too.", r: "Then we're both better. That's efficient. Two people fixed by one text." },
    ] },
  { id: 'shy-text-dnf-any-2-flirty', on: 'dnf', stage: 'any', slot: 2, mood: 'flirty',
    say: "Not finishing is getting to be a theme. I'd like to file a complaint. My heart can't take it. Are you okay?",
    opts: [
      { tone: 'cold', t: "It happens.", r: "It does. I know. It still makes my heart do a thing. Okay. Rest." },
      { tone: 'passive', t: "I'm okay. Complaint noted.", r: "Noted. Good. I'll file it under 'please be okay'. It's a big file." },
      { tone: 'flirty', t: "File it in person. I'll listen.", r: "In person. With a clipboard. ...I'll just hold your hand. That's my complaint." },
    ] },
  { id: 'shy-text-dnf-any-3-cold', on: 'dnf', stage: 'any', slot: 3, mood: 'cold',
    say: "You've not finished again. You're making a habit of scaring me. I'm still quiet after last time. But are you okay?",
    opts: [
      { tone: 'cold', t: "I'm okay. It's part of the job.", r: "Part of the job. I know. I'll get used to it. I won't. But I'll pretend.", opts: [
        { tone: 'cold', t: "Pretending's fine.", r: "Pretending. ...Rest well." },
        { tone: 'passive', t: "You don't have to pretend with me.", r: "Don't I? Then: it scares me. Every time. That's the honest version." },
        { tone: 'flirty', t: "Don't pretend. Come and be scared next to me.", r: "Next to you. That's much better than on a floor. Okay. I'm coming." },
      ] },
      { tone: 'passive', t: "I'm okay. I'm sorry I scared you.", r: "No sorry needed. You just need to be okay. Are you? Really?", opts: [
        { tone: 'cold', t: "Really. I'm fine.", r: "Fine. I'll believe it. ...Thank you." },
        { tone: 'passive', t: "Really. Bruised pride, that's all.", r: "Pride mends. I'll bring tea. Pride likes tea." },
        { tone: 'flirty', t: "Really. Better if you come over.", r: "Now? ...Okay. I'll bring tea. And a blanket. For both of us." },
      ] },
      { tone: 'flirty', t: "I'm okay. Let me make it up to you for the scare.", r: "You don't need to make anything up. Just be okay. ...But I'll let you. Quietly.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Forgotten. ...No. I'll remember you're okay. That's what I'll remember." },
        { tone: 'passive', t: "Dinner. Somewhere quiet.", r: "Somewhere quiet. I'll choose. You've had enough noise today." },
        { tone: 'flirty', t: "Starting with a very long hug.", r: "A very long hug. I'm counting on it. I'll hold on longer than is normal. Be warned." },
      ] },
    ] },
  { id: 'shy-text-dnf-any-3-passive', on: 'dnf', stage: 'any', slot: 3, mood: 'passive',
    say: "Third time not finishing. Scaring me is a habit now. I've stopped sitting on the floor. I just lie on it.",
    opts: [
      { tone: 'cold', t: "The floor's a bit dramatic.", r: "It is. I'm a floor person now. ...Are you okay, though?", opts: [
        { tone: 'cold', t: "Yes. Stop asking.", r: "Stopping. ...I'm glad. That's all." },
        { tone: 'passive', t: "I'm okay. Honest.", r: "Honest. Okay. I'll get up off the floor. Slowly." },
        { tone: 'flirty', t: "I'm okay. Stay down there, I'll join you.", r: "Join me. On the floor. ...That's the best floor offer I've ever had." },
      ] },
      { tone: 'passive', t: "I'm okay. I promise. Up you get.", r: "Getting up. ...Thank you. It's a habit I'd like you to break. Please. For my floor.", opts: [
        { tone: 'cold', t: "Can't promise.", r: "No. I know. Nobody can. ...Be okay, then. That's all I ask." },
        { tone: 'passive', t: "I'll do my best. For you and the floor.", r: "Thank you. The floor thanks you too. It's been through a lot." },
        { tone: 'flirty', t: "I'll break it if you hug me after every race.", r: "Every race. Finished or not. That's a very good trade. Yes." },
      ] },
      { tone: 'flirty', t: "You lie on the floor for me? That's devotion.", r: "It's a nervous system thing. ...It's devotion. Fine. Are you okay?", opts: [
        { tone: 'cold', t: "I'm fine. Bit embarrassed.", r: "Don't be. I'm the one on a floor. Rest." },
        { tone: 'passive', t: "I'm okay. Really. Thank you.", r: "Really. Good. I'm getting up. I'm making tea. You're okay." },
        { tone: 'flirty', t: "I'm okay. Come and be devoted in person.", r: "Devotedly. ...I'll come. I'll be very quiet and very devoted. Make room." },
      ] },
    ] },
  { id: 'shy-text-dnf-any-3-flirty', on: 'dnf', stage: 'any', slot: 3, mood: 'flirty',
    say: "You keep not finishing and I keep nearly fainting. It's a terrible habit. We should both stop. Are you okay?",
    opts: [
      { tone: 'cold', t: "It's the job.", r: "I know. It's still terrible for my nerves. You're alright, though?", opts: [
        { tone: 'cold', t: "I said I'm fine.", r: "You did. ...Sorry. I'll stop asking." },
        { tone: 'passive', t: "I'm okay. Honestly. Sorry about your nerves.", r: "My nerves will recover. They always do. They're very dramatic, my nerves." },
        { tone: 'flirty', t: "I'm okay. Let me calm your nerves later.", r: "Later. My nerves would like that very much. So would I." },
      ] },
      { tone: 'passive', t: "I'm okay. Let's both stop. Deal.", r: "Deal. You stop not finishing. I'll stop fainting. ...I'll try. Mostly you, though.", opts: [
        { tone: 'cold', t: "I'll do what I can.", r: "That's all anyone can do. ...Be okay. That matters most." },
        { tone: 'passive', t: "I'll hold up my end.", r: "Good. I'll hold up mine. With a cushion. Just in case." },
        { tone: 'flirty', t: "And if I keep scaring you, I'll owe you kisses.", r: "Kisses. Per race. ...That's a very dangerous deal. I accept it. Be okay anyway." },
      ] },
      { tone: 'flirty', t: "I'm okay. Faint into my arms next time.", r: "You'd have to be there. ...Okay. Then be there. And be okay. Both.", opts: [
        { tone: 'cold', t: "Can't be everywhere.", r: "No. Of course not. ...Just be okay, then." },
        { tone: 'passive', t: "I'll be there. Promise.", r: "Promise. I'll faint less if you're there. Science." },
        { tone: 'flirty', t: "I'll catch you every time.", r: "Every time. Then I'll stop worrying about floors. I'll just worry about you. Like normal." },
      ] },
    ] },
];
