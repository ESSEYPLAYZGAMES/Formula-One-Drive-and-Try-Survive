// FLIRTATIOUS - in person, stage 'warm' (getting closer: a proper date, track six, the encore, a kiss on the table). Slots 1-9 x mood.
// Plain data, no imports.
export const DATA = [
  // ==== slot 1: past small talk - they ask you out properly: candlelight, a corner table ====
  {
    id: 'flirtatious-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "You've been cold on me, Trouble, so I've decided to punish you with dinner. Candlelight. A corner table. My choice.",
    opts: [
      { tone: 'cold', t: "I'm busy.", r: "You're always busy. I'll book it anyway. An empty chair opposite me is very dramatic. I'll enjoy it.", opts: [
        { tone: 'cold', t: "Enjoy it, then.", r: "I will. I'll tell the waiter you were frightened of me. They'll understand. Everyone is, a bit." },
        { tone: 'passive', t: "Okay. When?", r: "Thursday. Nine. Late enough to be interesting, early enough to pretend it's innocent." },
        { tone: 'flirty', t: "Fine. But I'm sitting next to you, not opposite.", r: "Next to me. Mm. Bold seating plan. The waiter will blush. So might I." },
      ] },
      { tone: 'passive', t: "Is this a date?", r: "This is a date. Formally. In writing, if you like. I don't do this often, so dress like you know that.", opts: [
        { tone: 'cold', t: "I haven't said yes.", r: "You haven't said no. I'm booking it. You can sulk in the taxi on the way." },
        { tone: 'passive', t: "Alright. A date. What do I wear?", r: "Something I'll want to look at all night. So - anything, apparently. Annoyingly." },
        { tone: 'flirty', t: "Then I'll dress to ruin your concentration.", r: "Please do. I'll do the same. We'll ruin the food entirely. Worth it." },
        { tone: 'risque', t: "A date. And after dinner?", r: "After dinner is a separate negotiation. Bring your best arguments. And your patience." },
      ] },
      { tone: 'flirty', t: "Candlelight? You're going soft on me.", r: "Soft? Never. Candlelight is strategic. It makes everyone gorgeous and me unbearable.", opts: [
        { tone: 'cold', t: "Strategic sounds exhausting.", r: "Then don't come, and I'll strategise at someone else. ...I won't. But you don't know that." },
        { tone: 'passive', t: "Okay, I'm in.", r: "In. Good. Corner table, Thursday. You'll know me - I'll be the one not blinking." },
        { tone: 'flirty', t: "I'll be unbearable right back.", r: "Then we'll be thrown out by dessert. That's the best kind of evening." },
        { tone: 'risque', t: "Candlelight, then my place?", r: "Your place. Mm. Look at you, skipping courses. I'll allow it. Possibly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "I want to take you out, Trouble. Properly. Candles, a corner table, nobody we know. I'm asking - which I never do.",
    opts: [
      { tone: 'cold', t: "Do you ask everyone that?", m: -3, r: "I don't ask anyone. People ask me. You're my first exception in ages, and you just spat on it.", opts: [
        { tone: 'cold', t: "Sorry. I'm not interested.", r: "Not interested. Fine. I'll cancel the candles. They'll be devastated. I'll be... fine." },
        { tone: 'passive', t: "Sorry. That came out wrong. Yes.", r: "It did come out wrong. 'Yes' came out right. Thursday. Corner table." },
        { tone: 'flirty', t: "Then I'm honoured. Truly.", r: "You should be. I'm very good at dates. You'll find out exactly how good." },
      ] },
      { tone: 'passive', t: "I'd like that.", r: "Good. I'll choose everything. You just turn up and look at me the way you do.", opts: [
        { tone: 'cold', t: "Don't get your hopes up about the look.", r: "Too late. I've seen it. I'll bring it out of you. I always do." },
        { tone: 'passive', t: "What's the place like?", r: "Small. Dim. A table in the back nobody's allowed. I'm allowed. Obviously." },
        { tone: 'flirty', t: "I'll look at you like that all night.", r: "Promise? Then I'll wear something worth it. You won't eat a thing." },
        { tone: 'risque', t: "And afterwards?", r: "Afterwards, I walk you home. Slowly. And we'll see who's braver at the door." },
      ] },
      { tone: 'flirty', t: "You're asking? Say it again. I liked it.", r: "Mm. Trouble, will you let me take you out and make you blush over dessert?", opts: [
        { tone: 'cold', t: "I don't blush.", r: "Everyone blushes. You just haven't met the right dessert. Forget it, then." },
        { tone: 'passive', t: "Yes. Happily.", r: "Happily. Oh, that's sweet. You'll ruin my reputation, saying things like that." },
        { tone: 'flirty', t: "Only if I get to make you blush first.", r: "First? I don't blush. ...Well. Rarely. Try. I dare you." },
        { tone: 'risque', t: "Forget dessert. I'll make you blush on the walk home.", r: "The walk home. Mm. I'll take the long way. You'll regret suggesting it. Deliciously." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "I've booked a table. Candlelit corner, Thursday, nine. I haven't asked if you're free, because I already know the answer.",
    opts: [
      { tone: 'cold', t: "Presumptuous.", r: "Confident. There's a difference. Presumptuous people don't look this good saying it.", opts: [
        { tone: 'cold', t: "I'm not coming.", r: "Then I'll eat alone, beautifully, and tell everyone you were scared. Your choice." },
        { tone: 'passive', t: "Okay. I'm free.", r: "Naturally. I'd have heard if you weren't. Nine sharp. Don't be late." },
        { tone: 'flirty', t: "Confident looks good on you.", r: "Everything looks good on me. Thursday, you'll find out what else does." },
      ] },
      { tone: 'passive', t: "Thursday works.", r: "I know it does. Wear something that makes me forget to read the menu.", opts: [
        { tone: 'cold', t: "I'll wear whatever.", r: "Whatever. Mm. Thrilling. I'll dress up for both of us. Again." },
        { tone: 'passive', t: "Any dress code?", r: "Yes. Look like you want to be there. That's the only rule. And it's strict." },
        { tone: 'flirty', t: "I'll wear the thing you'll stare at all night.", r: "You're very sure there's a thing. ...There is a thing. Wear it." },
        { tone: 'risque', t: "I'll wear something worth getting creased.", r: "Creased. Mm. Now I can't read the menu either. Thursday's going to be a disaster. A gorgeous one." },
      ] },
      { tone: 'flirty', t: "And what's the answer?", r: "Yes, obviously. You've been saying yes to me with your eyes for weeks. Now say it out loud.", opts: [
        { tone: 'cold', t: "No.", r: "No. Out loud. Hm. Your eyes still say yes, but I listen to the words. Fine. Bye." },
        { tone: 'passive', t: "Yes.", r: "There. Simple. Thursday, nine. I'll be early. I'm never early. Don't tell anyone." },
        { tone: 'flirty', t: "Yes. Loudly. Want me to say it slower?", r: "Slower. Yes. Always slower. Say it like that on Thursday and we'll never see the menu." },
        { tone: 'risque', t: "Yes. To dinner, and whatever comes after.", r: "Whatever comes after. Mm. That's a very open invitation. I accept it in full." },
      ] },
      { tone: 'risque', t: "Cancel the restaurant. Cook for me instead.", r: "Cook? At my place? Darling, I burn toast. But I'd love to watch you try to distract me from it.", opts: [
        { tone: 'cold', t: "Forget it, then. Restaurant.", r: "Restaurant. You lose your nerve so quickly. Fine. Candles. Public. Safe." },
        { tone: 'passive', t: "Restaurant's fine. Cooking another time.", r: "Another time. That's a promise now. I'll stock the fire extinguisher." },
        { tone: 'flirty', t: "I'll cook. You just stand there looking like that.", r: "Deal. I'll stand very close. Burnt dinner, wonderful evening. My favourite kind." },
        { tone: 'risque', t: "Who said anything about eating?", r: "Mm. Nobody, now. Thursday, my place, nine. Bring dessert. Or be it." },
      ] },
    ],
  },
  // ==== slot 2: "have I told you about Vivi?" - the grandmother wants to know about you ====
  {
    id: 'flirtatious-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "Have I told you about Vivi, my grandmother? I can never remember what I've told you. She asked about you. I said you're being difficult.",
    opts: [
      { tone: 'cold', t: "Tell her whatever you want.", r: "I told her you're gorgeous and cold. She said, 'Oh, those are the good ones.' She's wrong sometimes.", opts: [
        { tone: 'cold', t: "She's wrong this time.", r: "Mm. We'll see. Vivi's been wrong twice in ninety-one years. I'll sulk in the meantime." },
        { tone: 'passive', t: "What else did she say?", r: "That I should stop pretending I don't care. She's insufferable. She's right." },
        { tone: 'flirty', t: "Tell her I'm warming up.", r: "I'll tell her. She'll want proof. So do I. Warm up faster, Trouble." },
      ] },
      { tone: 'passive', t: "Why does she want to know about me?", r: "Because I mentioned you. Twice. Vivi notices when I mention someone twice. I never do.", opts: [
        { tone: 'cold', t: "You talk about me too much.", r: "Twice is not too much. Twice is a lot, for me. Never mind. I'll talk about the weather." },
        { tone: 'passive', t: "What did you say?", r: "That you're stubborn, and you look at me like a problem you'd like to solve. She approved." },
        { tone: 'flirty', t: "Mention me a third time. See what she says.", r: "She'll say 'bring them for tea.' And I'll say no. And then I'll say yes." },
        { tone: 'risque', t: "Tell her I'm the difficult kind worth staying up for.", r: "Staying up for. She'd adore that. She'd also want to know how late. I wouldn't tell her." },
      ] },
      { tone: 'flirty', t: "Difficult? I've been on my best behaviour.", r: "That's the problem. Your best behaviour is very distracting. Vivi says that's a sign.", opts: [
        { tone: 'cold', t: "A sign of nothing.", r: "Of nothing. Fine. I'll tell her she's lost her touch. She'll be furious. With you." },
        { tone: 'passive', t: "A sign of what?", r: "That I'm in trouble. Capital T. ...She means you. She thinks she's very funny." },
        { tone: 'flirty', t: "Then let me misbehave a little.", r: "A little? Darling, I was hoping you'd misbehave a lot. Vivi would insist." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "My grandmother Vivi - ninety-one, outrageous, have I told you? - rang to ask about 'the racing one.' I've never had a 'the' anything before.",
    opts: [
      { tone: 'cold', t: "Don't make me a thing.", r: "Too late. You're a thing to Vivi now. She wants details. I'll tell her you were rude. She'll love you more.", opts: [
        { tone: 'cold', t: "Tell her nothing.", r: "I'll tell her nothing. She'll hear it anyway. She always does. You've been warned." },
        { tone: 'passive', t: "Okay. What does she want to know?", r: "If you're kind. If you're funny. If you make me laugh the real laugh. I said... sometimes." },
        { tone: 'flirty', t: "Fine. Tell her I'm charming.", r: "I'll tell her you're charming when you try. Which isn't often. Try more." },
      ] },
      { tone: 'passive', t: "The racing one? That's sweet.", r: "Sweet. Vivi isn't sweet; she's a strategist. She wants to know if you're serious. I said I'd find out.", opts: [
        { tone: 'cold', t: "I'm not anything yet.", r: "Not anything. Mm. That'll go down well over the phone. Fine. Not anything." },
        { tone: 'passive', t: "And what do you think?", r: "I think you're more serious than you let on. Which is annoying. I was hoping for a fling." },
        { tone: 'flirty', t: "Tell her I'm very serious about her grandchild.", r: "Oh, she'll swoon. And then she'll call me eleven times. I'll blame you." },
        { tone: 'risque', t: "Tell her I'm seriously trying to keep you up past bedtime.", r: "I don't have a bedtime. That's the problem. You'd be up all night. I'd make sure of it." },
      ] },
      { tone: 'flirty', t: "Tell her the racing one can't stop thinking about you.", r: "Oh, I'll tell her. She'll scream. She'll want to meet you. That's terrifying. For you.", opts: [
        { tone: 'cold', t: "Let's not get ahead of ourselves.", r: "Ahead? Darling, I'm miles behind. Vivi's already planning the hat. Fine. Slowly." },
        { tone: 'passive', t: "I'd like to meet her someday.", r: "Someday. She'll hold you to it. Ninety-one-year-olds don't do 'someday.' Neither do I." },
        { tone: 'flirty', t: "Tell her she taught you well.", r: "She'd agree. She'd also say I've met my match. She'd be right, which is unbearable." },
        { tone: 'risque', t: "Tell her the racing one keeps you up at night.", r: "She'd ask doing what. I'd say nothing. And she'd laugh until she needed a sit-down." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "Vivi wants to know everything about you. My grandmother - have I told you? Ninety-one, three husbands. She says you sound dangerous.",
    opts: [
      { tone: 'cold', t: "I'm not dangerous.", r: "You are to me. That's what she meant. Never mind. Go and be harmless somewhere else.", opts: [
        { tone: 'cold', t: "Harmless it is.", r: "Harmless. How dull. I'll tell her she was wrong. She won't believe me." },
        { tone: 'passive', t: "Okay. A little dangerous.", r: "A little. That's the most dangerous amount. Vivi would bring opera glasses." },
        { tone: 'flirty', t: "Only to you.", r: "Only to me. Mm. That's the right answer. I'll pass it on. She'll swoon." },
      ] },
      { tone: 'passive', t: "What did you tell her?", r: "That you look at me like you've already decided something. And that I like it. Too much.", opts: [
        { tone: 'cold', t: "Haven't decided anything.", r: "Haven't you. Then stop looking at me like that. Go on. ...See? You can't." },
        { tone: 'passive', t: "What did she say?", r: "'Then stop flirting and decide something too.' I hung up on her. Lovingly." },
        { tone: 'flirty', t: "I have decided something.", r: "Have you. Mm. Don't tell me. I want to work it out. Slowly." },
        { tone: 'risque', t: "Tell her I've decided to keep you up very late.", r: "She'll ask how late. I'll say she's too old to hear it. She'll be offended. And proud." },
      ] },
      { tone: 'flirty', t: "Dangerous? Tell her she's got good instincts.", r: "She knows. She's had ninety-one years of practice. I've had less. I'm catching up fast.", opts: [
        { tone: 'cold', t: "Don't rush.", r: "Don't rush. You keep saying that with your face. Fine. Slow. Painfully, boringly slow." },
        { tone: 'passive', t: "She sounds wonderful.", r: "She is. She'd steal you from me in a minute. She has form. Stay away from her waltzes." },
        { tone: 'flirty', t: "Catch up on me.", r: "On you. Mm. Gladly. Every step of the way. Starting now." },
        { tone: 'risque', t: "Be dangerous with me, then.", r: "With you. Oh, that's the plan. Vivi says never waste a dangerous person. She has rules." },
      ] },
      { tone: 'risque', t: "Tell Vivi I'm planning to kiss you.", r: "She'll hear it first thing. She'll ask when. And I'll say I'm waiting for you to stop announcing it and do it.", opts: [
        { tone: 'cold', t: "Planning. Not doing.", r: "Not doing. Ugh. You tease. I'll tell her you lost your nerve. She'll be so disappointed." },
        { tone: 'passive', t: "Soon. Not today.", r: "Not today. Fine. I'll wait. I'm good at waiting. I'm better at being kissed." },
        { tone: 'flirty', t: "Planning is half the fun.", r: "Planning is half. Doing is the other half. The better half. Ask anyone." },
        { tone: 'risque', t: "Tell her it'll be soon. And slow.", r: "Soon and slow. Mm. My two favourite speeds. She'll want details. She won't get them." },
      ] },
    ],
  },
  // ==== slot 3: someone else tried their luck with you - jealousy, played as a sport ====
  {
    id: 'flirtatious-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "Someone was flirting with you the other day and you let them. I'm not jealous. I'm just furious, gorgeous and taking notes.",
    opts: [
      { tone: 'cold', t: "I can talk to who I want.", r: "Of course you can. And I can glare at them. It's a free paddock. Enjoy your admirer.", opts: [
        { tone: 'cold', t: "I will.", r: "Mm. Then I'll go and be admired too. I'm much better at it. You'll notice." },
        { tone: 'passive', t: "It was nothing. Just chat.", r: "Just chat. That's what I'd say. Fine. I believe you. Mostly. The notes stay on file." },
        { tone: 'flirty', t: "They're not you, though.", r: "No. They're not. Nobody is. Glad you've noticed. Notes torn up. Most of them." },
      ] },
      { tone: 'passive', t: "They were just being friendly.", r: "Friendly. Darling, I invented friendly. That wasn't friendly. That was an audition.", opts: [
        { tone: 'cold', t: "You're overreacting.", r: "I'm reacting exactly the right amount. You just don't like being looked at so closely." },
        { tone: 'passive', t: "Okay, maybe a bit more than friendly.", r: "A bit more. Thank you. That's all I wanted. To be right. I'm calming down." },
        { tone: 'flirty', t: "They failed. You'd have passed.", r: "I'd have passed with distinction. Without trying. ...You're forgiven." },
        { tone: 'risque', t: "Show me how you'd have done it.", r: "Oh, they'd have been watching me, not you. Come here. ...See? That's the difference." },
      ] },
      { tone: 'flirty', t: "You're cute when you're jealous.", r: "I'm not cute. I'm magnificent. And I'm not jealous. I'm... competitive.", opts: [
        { tone: 'cold', t: "Same thing, really.", r: "It's not. Jealous people sulk. Competitive people win. Watch me." },
        { tone: 'passive', t: "Okay. Competitive.", r: "Thank you. Competitive. And undefeated, I'll have you know. Keep it that way." },
        { tone: 'flirty', t: "No competition. You won weeks ago.", r: "Weeks ago? You might have mentioned it. I've been working very hard for nothing. ...Not nothing." },
        { tone: 'risque', t: "Then come and claim your trophy.", r: "Claim it. Mm. Here? In front of everyone? You'd like that. So would I. Later." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "I watched someone try their luck with you the other day. Adorable. Hopeless, but adorable. You were very polite to them.",
    opts: [
      { tone: 'cold', t: "Maybe I liked it.", r: "Did you. Then go and like it more. I'll be over here. Not caring. Visibly.", opts: [
        { tone: 'cold', t: "Maybe I will.", r: "Go on, then. Nothing would make me happier. ...That's a lie. Run along." },
        { tone: 'passive', t: "Kidding. It was just talk.", r: "Just talk. Good. I'd hate to have to be magnificent at someone. It's tiring." },
        { tone: 'flirty', t: "I liked that you noticed.", r: "Of course I noticed. I notice everything about you. It's a full-time job." },
      ] },
      { tone: 'passive', t: "Hopeless? How do you know?", r: "Because they flirted like they were reading a manual. You don't need a manual. You need me.", opts: [
        { tone: 'cold', t: "I don't need anyone.", r: "Everyone needs someone. You'll find that out at about two a.m. one of these nights." },
        { tone: 'passive', t: "And what do you do differently?", r: "I don't ask. I look. And I wait until you look back. Like now. ...See?" },
        { tone: 'flirty', t: "You wrote the manual.", r: "I wrote the manual and burned it. Everything I do is improvised. Look at you. You're proof." },
        { tone: 'risque', t: "Show me a page from the manual.", r: "Page one: lean in. Page two: whisper. Page three's been torn out for decency. Imagine it." },
      ] },
      { tone: 'flirty', t: "Were you jealous?", r: "Jealous? Me? ...Fractionally. Briefly. It passed when you looked over at me instead.", opts: [
        { tone: 'cold', t: "I didn't look over.", r: "You did. Twice. I counted. But fine. Pretend. I know what I saw." },
        { tone: 'passive', t: "I did look over.", r: "I know. That's why it passed. You're very easy to forgive, Trouble." },
        { tone: 'flirty', t: "I'll always look over.", r: "Always. Mm. Big word. I'll be checking. I'm very good at checking." },
        { tone: 'risque', t: "I was imagining you instead.", r: "Imagining me. Doing what? No - don't say it out loud. Save it for somewhere quieter." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "Someone flirted with you right in front of me last time we were out. Brave. Foolish. I nearly applauded. Then I nearly bit them.",
    opts: [
      { tone: 'cold', t: "Calm down. It's not a contest.", r: "Everything's a contest, darling. I just happen to win them all. Fine. I'll calm down. Coldly.", opts: [
        { tone: 'cold', t: "Good. Stay calm.", r: "Good. Lovely. I'll be over here, perfectly calm, imagining terrible things." },
        { tone: 'passive', t: "Okay, it's a bit of a contest.", r: "A bit. Thank you. And I'm winning it. By a mile." },
        { tone: 'flirty', t: "If it were, you'd win.", r: "If it were? It is. And I have. Thank you for the trophy ceremony." },
      ] },
      { tone: 'passive', t: "They were harmless.", r: "Harmless people don't stand that close. I know. I'm not harmless, and I stand that close.", opts: [
        { tone: 'cold', t: "Don't be possessive.", r: "Possessive? Darling, I don't own anyone. I just strongly prefer certain outcomes. Fine." },
        { tone: 'passive', t: "Fair point.", r: "I'm full of fair points. Most of them are about you. It's becoming a pattern." },
        { tone: 'flirty', t: "Stand that close, then.", r: "Like this? ...Mm. Now nobody else is getting through. Perfect." },
        { tone: 'risque', t: "Closer than that, and I'll forget they exist.", r: "Closer. There. Who were we talking about? I've forgotten too. Lovely." },
      ] },
      { tone: 'flirty', t: "You'd have bitten them? I'd pay to see that.", r: "I'd do it for free. For you. Well. Not bite. Glare. Ferociously. You'd love it.", opts: [
        { tone: 'cold', t: "Don't. It'd be embarrassing.", r: "Embarrassing? For whom? Fine. I'll keep my fangs to myself. You're no fun." },
        { tone: 'passive', t: "Glare away.", r: "I'll glare politely. Like Vivi. Nobody ever saw her glare. They just left." },
        { tone: 'flirty', t: "Save the fangs for me.", r: "For you. Mm. Careful what you ask for, Trouble. I'm very generous with my teeth." },
        { tone: 'risque', t: "Bite me instead.", r: "Instead. Mm. You're asking for it. Not here. ...I'll remember you said that." },
      ] },
      { tone: 'risque', t: "Next time, kiss me in front of them. That'll end it.", r: "Kiss you. With an audience? Darling, I thought you'd never ask. ...Don't dare me.", opts: [
        { tone: 'cold', t: "Fine, I won't.", r: "You won't. Of course. All talk. Very good talk. No follow-through." },
        { tone: 'passive', t: "Maybe somewhere quieter first.", r: "Quieter first. A practice run. Sensible. I hate sensible. I'll allow it." },
        { tone: 'flirty', t: "I'm daring you.", r: "Then you'd better be ready. I don't do small, polite kisses. I do memorable." },
        { tone: 'risque', t: "Practise on me now.", r: "Now? Here? ...Mm. One. Small. For practice. ...That wasn't small, was it." },
      ] },
    ],
  },
  // ==== slot 4: track six on Vivi's old record - come over, lights low ====
  {
    id: 'flirtatious-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "I was going to play you track six of Vivi's old record. The best slow song ever pressed. Then you went frosty. Now I'm not sure.",
    opts: [
      { tone: 'cold', t: "I'll live without it.", r: "You will. Barely. You'll hear it in a lift one day, think of me and regret this.", opts: [
        { tone: 'cold', t: "Unlikely.", r: "Unlikely things are my speciality. Fine. Track six stays in its sleeve. Like your personality." },
        { tone: 'passive', t: "Okay, what's it called?", r: "'Stay A While.' Strings, crackle, a voice like smoke. Vivi danced to it at her first wedding." },
        { tone: 'flirty', t: "Fine. Make me deserve it.", r: "Oh, you'll have to earn it. Slowly. One dance at a time. Starting next time." },
      ] },
      { tone: 'passive', t: "Track six? What's on it?", r: "A slow song off a record my grandmother Vivi gave me. It's called 'Stay A While.' It crackles like a fire.", opts: [
        { tone: 'cold', t: "Sounds old-fashioned.", r: "It's timeless. Like me. You're not getting a private listening now. Enjoy your playlist." },
        { tone: 'passive', t: "I'd like to hear it.", r: "You will. On my balcony, at night, with the lights low. It's the only way to hear it." },
        { tone: 'flirty', t: "Play it for me. I'll stay a while.", r: "Stay a while. Mm. You've just quoted the song at me. That's... annoyingly romantic." },
        { tone: 'risque', t: "Play it, and I'll stay till the record ends. And after.", r: "And after. The song lasts four minutes. After goes on a while. I'll put it on repeat." },
      ] },
      { tone: 'flirty', t: "I'll deserve it. Put it on.", r: "Not here. Track six is only for my place. Lights low. Two people. One very slow dance.", opts: [
        { tone: 'cold', t: "Bit much.", r: "A bit much. Hm. You'll never know how much. Track six sleeps alone tonight." },
        { tone: 'passive', t: "Your place, then. Sometime.", r: "Sometime. Mm. I'll dust the sleeve. Don't make me wait too long." },
        { tone: 'flirty', t: "One dance? I'll want three.", r: "There's only one track six. We'll have to play it three times. Neighbours be warned." },
        { tone: 'risque', t: "Lights low. And I'll take the lead.", r: "You'll take the lead. Mm. Nobody leads me. ...I'd let you. Just for track six." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Vivi gave me an old record - the crackly kind. Track six is the most beautiful slow song ever made. I want you to hear it at my place.",
    opts: [
      { tone: 'cold', t: "Just send me a link.", r: "A link. Trouble. You don't send track six as a link. You hear it in a dark room, standing very close to someone.", opts: [
        { tone: 'cold', t: "I'll stream it.", r: "Stream it. Alone. On your phone. That's the saddest sentence I've heard all year." },
        { tone: 'passive', t: "Okay. Your place, then.", r: "My place. Good. I'll put it on and say nothing for four minutes. You'll see." },
        { tone: 'flirty', t: "Standing very close? Sold.", r: "I knew that would get you. Track six never fails. Neither do I." },
      ] },
      { tone: 'passive', t: "What's it called?", r: "'Stay A While.' Strings and a voice like smoke. You sway, you hold on, you forget your own name.", opts: [
        { tone: 'cold', t: "Sounds a bit sentimental.", r: "It's very sentimental. So am I, at four a.m. You'll never find out now." },
        { tone: 'passive', t: "I'd love to hear it.", r: "Then come over. Late. I'll have the balcony door open and track six cued up." },
        { tone: 'flirty', t: "Then I'll stay a while. Promise.", r: "You've just quoted it. Without hearing it. That's a sign. Vivi would say so." },
        { tone: 'risque', t: "I'll forget my name. You'll have to remind me.", r: "Oh, I'll remind you. Over and over. Quietly. Very close to your ear." },
      ] },
      { tone: 'flirty', t: "Are you inviting me over?", r: "It's an invitation, a dare and a promise. Track six. My place. Lights low. You'll never be the same.", opts: [
        { tone: 'cold', t: "Maybe. I'll consider it.", r: "Consider it. Mm. Don't think too long. Track six is patient. I'm not." },
        { tone: 'passive', t: "I'll come. When?", r: "Late. After midnight. That's when it sounds best. And so do I." },
        { tone: 'flirty', t: "I'll be the same. Just happier.", r: "Happier. Mm. That's a good line. Track six will be jealous." },
        { tone: 'risque', t: "Lights low. Then lower.", r: "Then lower. Mm. Darling. Bring your dancing feet and your best intentions. Or your worst." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "I've been saving something for you: track six on my grandmother Vivi's old record. A slow dance in my kitchen, lights low. Come over.",
    opts: [
      { tone: 'cold', t: "Not tonight.", r: "Not tonight. You do love saying that. Track six will wait. I'm less patient. Remember that.", opts: [
        { tone: 'cold', t: "Noted.", r: "Noted. So formal. Track six is offended. So am I. Enjoy your early night." },
        { tone: 'passive', t: "Another night. I mean it.", r: "You mean it. Okay. I'll keep it on the turntable. Waiting. Like a lit candle." },
        { tone: 'flirty', t: "Save it for me. Every note.", r: "Every note. I'll guard it with my life. It's yours. Nobody else gets track six." },
      ] },
      { tone: 'passive', t: "What makes track six special?", r: "It played at Vivi's first wedding. And her third. It's never failed. It's undefeated, like me.", opts: [
        { tone: 'cold', t: "Bit cheesy.", r: "Cheesy. Track six is not cheese. It's history. It stays in the sleeve. Pity." },
        { tone: 'passive', t: "That's lovely, actually.", r: "It is lovely. Don't tell Vivi I told you. She'll want royalties." },
        { tone: 'flirty', t: "Then let's not break its record.", r: "We won't. I'll make sure of it. You hold on; I'll do the rest." },
        { tone: 'risque', t: "Let's give track six a new story.", r: "A new story. Mm. Lights low, kitchen floor, very slow. The kind of story you don't tell Vivi." },
      ] },
      { tone: 'flirty', t: "Lights low. Say no more.", r: "I wasn't going to say any more. I was going to show you. Shoes off. Hold on. Here it comes.", opts: [
        { tone: 'cold', t: "Shoes stay on.", r: "Shoes stay on. Formal. Rigid. You dance like a filing cabinet, Trouble. A cute one." },
        { tone: 'passive', t: "I'm a terrible dancer, I warned you.", r: "Track six doesn't care. You sway. I lead. Nobody's watching." },
        { tone: 'flirty', t: "Hold on to you? Easiest thing I'll do all week.", r: "Then hold on. ...Mm. Closer. That's it. Track six approves." },
        { tone: 'risque', t: "Play it twice. The second time, we don't dance.", r: "We don't dance? Then what will we... oh. Oh. Trouble. Lights lower, then. Fade out." },
      ] },
      { tone: 'risque', t: "Track six, lights low, and I'm not leaving till morning.", r: "Till morning. I loathe mornings. ...For you I might not. Bring a toothbrush and no excuses.", opts: [
        { tone: 'cold', t: "Joking. I'll leave after the song.", r: "After the song. Four minutes. You're a terrible tease. I'll forgive you. Eventually." },
        { tone: 'passive', t: "Maybe not till morning. Yet.", r: "Yet. My favourite tiny word. Fine. Track six, a dance, a kiss at the door." },
        { tone: 'flirty', t: "Morning. Breakfast. Burnt toast.", r: "Burnt toast. Who told you? Mm. Fine. I'll burn it for you lovingly. Morning it is." },
        { tone: 'risque', t: "No excuses. Just the record on repeat.", r: "On repeat. Mm. Then nobody's keeping count of how many times. Lights out, Trouble." },
      ] },
    ],
  },
  // ==== slot 5: the armour - everyone wants the show; hardly anyone stays for the encore ====
  {
    id: 'flirtatious-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "You know what I hate? People who want the show and leave before the encore. You've been frosty. I can't tell if you're the type.",
    opts: [
      { tone: 'cold', t: "Maybe I am.", m: -3, r: "Maybe. Mm. Then leave now and spare us both. I'd rather lose you early than late.", opts: [
        { tone: 'cold', t: "Fine. I'm going.", r: "Go, then. ...No, I won't follow. Rule three. I'll just be very quiet for a while." },
        { tone: 'passive', t: "I'm not going anywhere.", r: "Not going anywhere. You'd be amazed how often I hear that. I'll believe it later." },
        { tone: 'flirty', t: "I'm staying. Encore and all.", r: "Encore and all. Hm. Then sit down, Trouble. The second half's the good bit." },
      ] },
      { tone: 'passive', t: "What's the encore?", r: "Me, without the act. Quieter. Worried. Reads in the bath. Most people leave before it starts.", opts: [
        { tone: 'cold', t: "Sounds less fun.", r: "It is less fun. It's more real. You've just told me which one you want. Thank you." },
        { tone: 'passive', t: "I'd like to meet that one.", r: "You might. If you stay. It's a long show. I'm told it's worth it." },
        { tone: 'flirty', t: "I came for the encore.", r: "Did you. Mm. Then you're the first. Don't make me regret letting you in." },
        { tone: 'risque', t: "Show me the encore. Lights low, no audience.", r: "Lights low. No audience. Mm. You've just described my favourite way to be honest." },
      ] },
      { tone: 'flirty', t: "Encore? I'd stay for the after-party too.", r: "The after-party. Mm. There is one. Invitation only. Very small guest list. One.", opts: [
        { tone: 'cold', t: "I'm not one for lists.", r: "You were on this one. Were. Fine. I'll dance with myself. I'm excellent company." },
        { tone: 'passive', t: "One? Who's on it?", r: "Someone who stayed. That's the only qualification. It's rarer than you'd think." },
        { tone: 'flirty', t: "Put my name down. In ink.", r: "In ink. Lovely. It's very permanent, ink. I'm choosing to be brave." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Can I be honest? Everyone wants the show. The flirting, the look, the fun. Hardly anyone stays for the encore.",
    opts: [
      { tone: 'cold', t: "The show's enough for most people.", r: "It is. That's the problem. I'm more than enough, and nobody stays to find out.", opts: [
        { tone: 'cold', t: "Their loss, I guess.", r: "Their loss. And yours, by the sound of it. Never mind. The show goes on." },
        { tone: 'passive', t: "What's the encore like?", r: "Quieter. Sillier. A little scared. It snorts when it laughs. You'd be surprised." },
        { tone: 'flirty', t: "I'm not most people.", r: "No. You're not. That's what I keep finding out, and I don't know what to do about it." },
      ] },
      { tone: 'passive', t: "What do you mean, the encore?", r: "The real me. Toast-burner. Bath-reader. Worrier. It's easier to be wanted than known, isn't it?", opts: [
        { tone: 'cold', t: "Not really.", r: "No. Of course not. Never mind. Pretend I didn't. Back to the show." },
        { tone: 'passive', t: "I know exactly what you mean.", r: "Do you? ...Then maybe you're staying. I'd like that more than I'll admit out loud." },
        { tone: 'flirty', t: "I want to know you. Not just want you.", r: "Oh. That's... Trouble. That one landed. Give me a minute." },
        { tone: 'risque', t: "I want both. Known and wanted.", r: "Both. Greedy. Mm. Same. ...Lights low, then, and I'll tell you everything." },
      ] },
      { tone: 'flirty', t: "I've got a ticket for the encore. Front row.", r: "Front row. Mm. Don't let me catch you leaving at the interval.", opts: [
        { tone: 'cold', t: "I might. Depends on the show.", r: "Wow. Fine. I'll be spectacular, then. And then I'll disappear." },
        { tone: 'passive', t: "I'll stay to the end.", r: "To the end. That's... thank you. I'll pretend that was nothing. It wasn't." },
        { tone: 'flirty', t: "I'll be the one cheering loudest.", r: "Loudest. Mm. I'd like that. Shout my name. Not too loud. Okay, loud." },
        { tone: 'risque', t: "And I'll stay behind after the curtain.", r: "After the curtain. That's when things get really interesting, darling. Nobody's watching then." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "You make me want to drop the act, Trouble. The whole show. That terrifies me. Everyone loves the show. The encore's a gamble.",
    opts: [
      { tone: 'cold', t: "Keep the act. It's safer.", r: "Safer for who? Mm. Fine. Curtain's up, then. Enjoy the show. It's all you get.", opts: [
        { tone: 'cold', t: "Good. Keep it on.", r: "Good. Lovely. I'll go back to dazzling. You can go back to watching." },
        { tone: 'passive', t: "Sorry. I didn't mean that.", r: "You did, a little. But you're sorry. I'll take sorry. The encore's postponed, not cancelled." },
        { tone: 'flirty', t: "Actually, drop it. I want the real one.", r: "The real one. Oh. Okay. ...Brace yourself. The real one's much less polished." },
      ] },
      { tone: 'passive', t: "What's the gamble?", r: "That you'll stay. People like the fireworks. The quiet bit after is where they leave.", opts: [
        { tone: 'cold', t: "People leave. That's life.", r: "That's life. Thank you, philosopher. Very comforting. I'll put the armour back on." },
        { tone: 'passive', t: "I'm good with quiet.", r: "Are you? Then you might be the first. ...Don't be smug about it." },
        { tone: 'flirty', t: "The quiet bit's my favourite part.", r: "Your favourite part. Mm. Careful. I'll believe you, and then where will we be?" },
        { tone: 'risque', t: "I'll stay through the quiet. And the bit after that.", r: "The bit after that. Mm. You know there's always a bit after that, with me." },
      ] },
      { tone: 'flirty', t: "Gamble on me. I'm a good bet.", r: "A good bet. Mm. You're the most dangerous bet I've ever made. All in, then.", opts: [
        { tone: 'cold', t: "Don't put everything on me.", r: "Too late. Chips are down. Fine. I'll pretend I held some back. I didn't." },
        { tone: 'passive', t: "I'll try not to let you down.", r: "Try. That's honest. I like honest. I'll try too." },
        { tone: 'flirty', t: "All in. Same.", r: "Same. Oh. Then we're both ruined. Lovely. What a way to go." },
        { tone: 'risque', t: "All in. Tonight. No holding back.", r: "No holding back. Mm. You'll get the show, the encore, and something I don't put in the programme." },
      ] },
      { tone: 'risque', t: "Drop the act with me tonight. Somewhere quiet.", r: "Tonight. Somewhere quiet. Mm. You make it sound so easy. ...It might be, with you.", opts: [
        { tone: 'cold', t: "Another time.", r: "Another time. Of course. The act stays on. It's comfortable. It's lonely. Whatever." },
        { tone: 'passive', t: "No pressure. Whenever you want.", r: "Whenever I want. That's... very kind. I want soon. Don't tell anyone." },
        { tone: 'flirty', t: "I'll be gentle with the real you.", r: "Gentle with me. Mm. You keep saying that kind of thing. I keep letting you." },
        { tone: 'risque', t: "Lights off. Act off. Just us.", r: "Just us. Mm. You have no idea what you've just asked for. You're going to love it." },
      ] },
    ],
  },
  // ==== slot 6: they watched you race and forgot to breathe - nerves they never planned on ====
  {
    id: 'flirtatious-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "I watched your race. All of it. My heart did things I didn't authorise. And then you go frosty on me. Rude, Trouble.",
    opts: [
      { tone: 'cold', t: "Nobody asked you to watch.", r: "Nobody has to ask me. I watch what I want. And I wanted you. ...That sounded wrong. Or right.", opts: [
        { tone: 'cold', t: "Watch someone else.", r: "I'll try. They'll be very dull. I'll be very bored. And it'll be your fault." },
        { tone: 'passive', t: "Sorry. Thanks for watching.", r: "You're welcome. I chewed a cushion. Don't tell anyone." },
        { tone: 'flirty', t: "It sounded right.", r: "Did it. Mm. Then I'll stop apologising for it. I wanted you. I still do. Gosh, that's honest." },
      ] },
      { tone: 'passive', t: "Were you nervous?", r: "Nervous? I don't get nervous. I held my breath for three laps and nearly fainted. That's different.", opts: [
        { tone: 'cold', t: "That's a bit dramatic.", r: "I'm a bit dramatic. Have you met me? Fine. I'll faint for someone more appreciative." },
        { tone: 'passive', t: "I'm fine. You don't need to worry.", r: "I know I don't need to. I just did. It's new. I don't love it." },
        { tone: 'flirty', t: "I like that you worry.", r: "Don't like it. It's very inconvenient. ...Okay. Like it a little." },
        { tone: 'risque', t: "Next race, watch from my garage. I'll calm you down after.", r: "Calm me down. Mm. I suspect your idea of calm involves a door that locks." },
      ] },
      { tone: 'flirty', t: "Your heart did things? Tell me more.", r: "It skipped. Twice. At the start, and when you went wheel to wheel. I'm not used to that.", opts: [
        { tone: 'cold', t: "It's just racing.", r: "Just racing. To you. To me it was three laps of forgetting how lungs work. Fine." },
        { tone: 'passive', t: "That's sweet, actually.", r: "Sweet. Ugh. I'm not sweet. I'm smouldering. With a small flutter." },
        { tone: 'flirty', t: "Let me feel it skip in person.", r: "In person. Mm. I'd rather you didn't. ...I'd rather you did. Come here." },
        { tone: 'risque', t: "I'll make it skip on purpose next time.", r: "On purpose. Mm. You'd be very good at that. I'd let you try. Repeatedly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "I watched your onboard last night. Twice. Forgot to breathe somewhere around turn four. I don't forget to breathe, Trouble.",
    opts: [
      { tone: 'cold', t: "It was a normal lap.", r: "Normal. For you. For me it was the most attractive ninety seconds ever filmed. Never mind.", opts: [
        { tone: 'cold', t: "Don't make it weird.", r: "It's already weird. I watched it twice. I'll watch something else. Something less... you." },
        { tone: 'passive', t: "Thanks. Which bit did you like?", r: "The bit where you didn't lift. I gasped. Out loud. Alone. On my balcony." },
        { tone: 'flirty', t: "Watch it a third time. I'll wait.", r: "Already did. Don't be smug. ...Be a little smug. It suits you." },
      ] },
      { tone: 'passive', t: "You watched it twice?", r: "Twice. The second time I just watched your hands on the wheel. Very normal behaviour. Shush.", opts: [
        { tone: 'cold', t: "That's a lot.", r: "A bit much is my brand. You signed up for it. Sort of. Fine. Once. I watched it once." },
        { tone: 'passive', t: "I'm flattered.", r: "Be flattered. I don't watch anything twice. Except old films and you." },
        { tone: 'flirty', t: "Next time watch it with me.", r: "With you. On my sofa. Pausing on the good bits. That's... dangerously domestic. Yes." },
        { tone: 'risque', t: "Next time I'll give you something better to watch.", r: "Better than you at full speed? Mm. Prove it. Slowly." },
      ] },
      { tone: 'flirty', t: "Breathe now. I'm right here.", r: "Right here. That's worse, darling. Up close you're even harder to breathe around.", opts: [
        { tone: 'cold', t: "Then I'll step back.", r: "Step back. Oh. That's... fine. Breathing restored. Disappointment also restored." },
        { tone: 'passive', t: "Take your time. In, out.", r: "In. Out. ...You're coaching my breathing. That's either sweet or a technique. Both?" },
        { tone: 'flirty', t: "Take my breath away again, then.", r: "Again? Mm. You're asking for trouble. You are Trouble. Fine. Come closer." },
        { tone: 'risque', t: "I'll steal the rest of your breath. Slowly.", r: "Slowly. Mm. I know exactly how you mean that. ...Later. Not here." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "Watching you race does something to me, Trouble. I spent the whole start with a hand on my heart like an old film. Fix it.",
    opts: [
      { tone: 'cold', t: "Not my job.", r: "Not your job. Everything about you is my job lately. Fine. I'll fix it myself. With sulking.", opts: [
        { tone: 'cold', t: "Good luck.", r: "Luck. I don't need luck. I need you to be less attractive in a helmet. Impossible, apparently." },
        { tone: 'passive', t: "Okay. How do I fix it?", r: "Win less dramatically. Or come here afterwards and let me check you're in one piece." },
        { tone: 'flirty', t: "I'll fix it in person.", r: "In person. Mm. That's what I was hoping. Bring your helmet hair." },
      ] },
      { tone: 'passive', t: "Hand on heart? Really?", r: "Really. Vivi would've laughed herself silly. I've never been this ridiculous about anyone.", opts: [
        { tone: 'cold', t: "You are a bit ridiculous.", r: "A bit. Thank you. You're a bit cold. Look at us, both flawed." },
        { tone: 'passive', t: "I think it's sweet.", r: "Sweet again. Stop it. I'm internationally dangerous. ...Don't laugh." },
        { tone: 'flirty', t: "Be ridiculous. It's working on me.", r: "Is it? Then I'll swoon openly. Catch me. Literally. I'm about to." },
        { tone: 'risque', t: "Next time, put your hand on mine instead.", r: "On yours. Mm. And then where? No, don't answer. I'll find out at the next start." },
      ] },
      { tone: 'flirty', t: "I'll fix it. One kiss for every lap you held your breath.", r: "That's... a lot of kisses. Fifty-odd laps. Are you good for it?", opts: [
        { tone: 'cold', t: "Kidding. Maybe one.", r: "One. From fifty-odd. You've haggled me down to nothing. Fine. One. Make it count." },
        { tone: 'passive', t: "Let's start with a few.", r: "A few. Sensible. I'll keep a running tally, Trouble." },
        { tone: 'flirty', t: "I'm good for all of them. Plus interest.", r: "Plus interest. Oh, I like you very much. Start paying. Whenever. Now's good." },
        { tone: 'risque', t: "All fifty. In private. In order.", r: "In order. Mm. Lap one is the slowest. I insist on it. Clear your evening." },
      ] },
      { tone: 'risque', t: "Next start, sit in my garage. I'll make your heart race after.", r: "After. Mm. You think my heart could take both? Let's find out. Carefully.", opts: [
        { tone: 'cold', t: "Never mind.", r: "Never mind. You keep starting fires and walking off. Fine. I'll watch from far away." },
        { tone: 'passive', t: "Maybe after the next race.", r: "After the next race. It's a date. I'll bring my hand. For my heart." },
        { tone: 'flirty', t: "Your heart can take it. I'll be gentle.", r: "Gentle. Not too gentle. Mm. I'll let you know." },
        { tone: 'risque', t: "Carefully at first. Then not.", r: "Then not. Mm. Trouble. I won't be watching the race at all now. I'll be watching the clock." },
      ] },
    ],
  },
  // ==== slot 7: "I've been thinking about kissing you - now you're thinking about it too" ====
  {
    id: 'flirtatious-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "Here's my revenge for last time: I've been thinking about kissing you. A lot. Now you'll think about it too. Suffer.",
    opts: [
      { tone: 'cold', t: "I won't.", r: "You will. In about four minutes. At the worst possible moment. That's the revenge.", opts: [
        { tone: 'cold', t: "Still won't.", r: "Fine. Your loss. I'm an excellent kisser. Ask around. Actually, don't." },
        { tone: 'passive', t: "Okay. Maybe a little.", r: "A little. That's how it starts. Then it's all you can think about. I'll wait." },
        { tone: 'flirty', t: "Too late. I already am.", r: "Already? Mm. Look at you. Thinking about it. Not doing anything about it. Yet." },
      ] },
      { tone: 'passive', t: "That's not much of a revenge.", r: "Isn't it? Look at you. You've stopped hearing the room. It's working.", opts: [
        { tone: 'cold', t: "It's not working.", r: "Liar. But fine. It's not working. I'll stop. ...Not thinking about it either. Obviously." },
        { tone: 'passive', t: "Okay, it's working a bit.", r: "A bit. Good. That's enough. I'll be off now. Leave them wanting, Trouble." },
        { tone: 'flirty', t: "Then let me get my own revenge.", r: "Ooh. Revenge for my revenge? I'll be waiting. With my eyes closed, possibly." },
        { tone: 'risque', t: "Stop thinking about it. Come here and do it.", r: "Do it. Mm. Bold. ...One. Short. There. Now we're both going to suffer." },
      ] },
      { tone: 'flirty', t: "Then let's stop suffering.", r: "Oh, you'd like that. So would I. But suffering is half the fun. One more day.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Forget it? I won't. You won't. Nice try. Off you go, all frosty and kissed in theory." },
        { tone: 'passive', t: "One more day. I can wait.", r: "Can you? I'm not sure I can. That's very inconvenient for my revenge." },
        { tone: 'flirty', t: "One more day, then I'm not waiting.", r: "Not waiting. Mm. Good. I'll be the one counting down. Don't tell anyone." },
        { tone: 'risque', t: "Today. Right now. I'm done suffering.", r: "Done suffering. ...Mm. That was... worth the wait. Don't look so pleased. Okay, look pleased." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "I'll be honest, Trouble, because I always say what I want. I've been thinking about kissing you. Now you're thinking about it too.",
    opts: [
      { tone: 'cold', t: "Don't.", m: -3, r: "Don't think about it, or don't say it? Too late for both. ...Fine. Noted. I'll stop saying it.", opts: [
        { tone: 'cold', t: "Just stop.", r: "Stopped. Completely. I respect a no, Trouble. I'll go and be fabulous at someone else." },
        { tone: 'passive', t: "Sorry. You just caught me off guard.", r: "Off guard is where all the good things happen. Take your time. I'll wait right here." },
        { tone: 'flirty', t: "Okay. I'm thinking about it.", r: "Good. Think hard. Think often. I'll be right here, being kissable." },
      ] },
      { tone: 'passive', t: "That's very direct.", r: "It's the only way I know. Hinting is for people with time to waste. I have plenty. I just don't waste it.", opts: [
        { tone: 'cold', t: "Direct isn't always good.", r: "No? Then I'll be indirect. ...Hm. Can't do it. Fine. I'll be direct somewhere else." },
        { tone: 'passive', t: "I appreciate it, honestly.", r: "Honestly. Two honest people. Imagine. We'll be terrible at games now." },
        { tone: 'flirty', t: "Then I'll be direct too. Yes.", r: "Yes. Mm. That's the best word anyone's said to me all season. Not yet. Soon." },
        { tone: 'risque', t: "Then stop thinking. Come here.", r: "Come here. ...There. Mm. That's the end of thinking about it, then. Now we just remember it." },
      ] },
      { tone: 'flirty', t: "I've been thinking about it since we met.", r: "Since we met? And you didn't say? You've been hoarding. Wicked thing.", opts: [
        { tone: 'cold', t: "Just a passing thought.", r: "Passing. Of course. I'll let it pass, then. I'm told I'm very forgettable. Nobody's ever said that." },
        { tone: 'passive', t: "I didn't know how to bring it up.", r: "Like this: 'I want to kiss you.' Five words. You'll get the hang of it." },
        { tone: 'flirty', t: "I'm not hoarding anymore.", r: "Not anymore. Mm. Then I'd like everything you've saved, in order, starting soon." },
        { tone: 'risque', t: "Then let's make up for lost time.", r: "Lost time. Mm. ...That was one. We've a lot of lost time to make up. Weeks. Clear your diary." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "Kissing you. That's what I've been thinking about. I'm telling you because now you'll think about it too, and I want the company.",
    opts: [
      { tone: 'cold', t: "I'm not thinking about it.", r: "You are now. Sorry. Not sorry. I'll leave you alone with it. Have fun.", opts: [
        { tone: 'cold', t: "Leave me alone, then.", r: "Leaving. Gracefully. With an excellent walk. Don't watch. ...You watched." },
        { tone: 'passive', t: "Okay. A bit.", r: "A bit's enough. It grows. Like ivy. Give it a day." },
        { tone: 'flirty', t: "Fine. It's on my mind. Constantly.", r: "Constantly. Good. Then we're even. Who'll crack first, Trouble?" },
      ] },
      { tone: 'passive', t: "And what do you want to do about it?", r: "Nothing. Yet. I want to watch you think about it. It's very good entertainment.", opts: [
        { tone: 'cold', t: "That's cruel.", r: "Then I'll be kind and leave you be. Very kind. Very far away." },
        { tone: 'passive', t: "I'm a slow thinker.", r: "Slow is good. Slow is my favourite. Think slowly. I'll be here." },
        { tone: 'flirty', t: "Watch closely. I'm thinking very hard.", r: "I can tell. You're doing it with your eyes. Mm. Very loudly." },
        { tone: 'risque', t: "I'm done thinking.", r: "Done? ...Mm. Oh. Well. That's a much better form of entertainment, actually." },
      ] },
      { tone: 'flirty', t: "Company? I've been thinking about it for weeks.", r: "Weeks. And you let me do all the work. You're terrible. I love it.", opts: [
        { tone: 'cold', t: "I'm not doing anything about it.", r: "Not doing anything. Ever? Mm. Then I'll stop thinking. I won't, but I'll pretend beautifully." },
        { tone: 'passive', t: "I wanted the timing to be right.", r: "Timing. Racing driver. Of course. Is it right yet? You'd better let me know." },
        { tone: 'flirty', t: "The timing's right now.", r: "Is it. Then why are you still talking? ...Mm. Better." },
        { tone: 'risque', t: "Weeks of thinking. I'm making it worth the wait.", r: "Then don't rush. ...Mm. You didn't rush. Trouble. Okay. I need to sit down." },
      ] },
      { tone: 'risque', t: "Stop thinking. Kiss me.", r: "Kiss you. Mm. Gladly. ...There. Now we're both thinking about the next one.", opts: [
        { tone: 'cold', t: "That was enough.", r: "Enough. Ouch. Fine. One perfect kiss and then frost. You're the most confusing person I know." },
        { tone: 'passive', t: "That was nice.", r: "Nice. Darling, that was a lot more than nice. You'll realise around midnight." },
        { tone: 'flirty', t: "The next one's mine to give.", r: "Then give it. Whenever you like. I'm free. Very, very free." },
        { tone: 'risque', t: "Again. Slower.", r: "Slower. Mm. ...That's how Vivi said it should be done. I never believed her until now." },
      ] },
    ],
  },
  // ==== slot 8: Vivi's secret rule - never fall first. They're being careful, and failing ====
  {
    id: 'flirtatious-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "Vivi has a rule she doesn't tell everyone. Never fall first. You've been cold, and I'm almost glad. It's keeping me honest.",
    opts: [
      { tone: 'cold', t: "Good. Don't fall.", r: "Don't worry. I won't. I'm too clever for that. ...I'm almost too clever for that.", opts: [
        { tone: 'cold', t: "Stay clever, then.", r: "I will. Clever and very, very lonely. Thank you for the advice. I'll frame it." },
        { tone: 'passive', t: "Would it be so bad?", r: "Falling? With you? It'd be catastrophic. Gloriously so. I'm not ready for that." },
        { tone: 'flirty', t: "Fall second, then. I'll go first.", r: "You'd go first? ...Don't tease me with that. I'll believe it." },
      ] },
      { tone: 'passive', t: "Why that rule?", r: "Because whoever falls first gets hurt. Vivi fell first once. Husband number two. She's never told me the rest.", opts: [
        { tone: 'cold', t: "Sounds like good advice.", r: "It is good advice. I'll keep following it. Clearly you are." },
        { tone: 'passive', t: "Do you always follow it?", r: "Always. Never broken it. ...I'm being very careful at the moment. It's harder than usual." },
        { tone: 'flirty', t: "Rules are made to be broken.", r: "Not this one. ...Probably not this one. Ask me again in a week." },
        { tone: 'risque', t: "Then fall with me. Same time. Nobody first.", r: "Same time. Mm. That's cheating. I love cheating. ...Ask me again at two a.m." },
      ] },
      { tone: 'flirty', t: "Keeping you honest? Or keeping you safe?", r: "Both. Mostly safe. You're very bad for my safety, Trouble. Very good for everything else.", opts: [
        { tone: 'cold', t: "Then stay safe.", r: "Safe it is. Boring, but safe. I'll keep my distance. You can keep your frost." },
        { tone: 'passive', t: "I'd never hurt you.", r: "Everyone says that. ...You sound like you mean it. That's what's frightening." },
        { tone: 'flirty', t: "Be unsafe with me.", r: "Unsafe. Mm. You make it sound like a holiday. ...It probably would be." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "Vivi's secret rule - my grandmother's oldest - is never fall first. I've always obeyed it. I'm being very careful with you, Trouble.",
    opts: [
      { tone: 'cold', t: "Careful's smart.", r: "It is smart. I'm always smart. ...It's also a bit miserable. Never mind. Smart it is.", opts: [
        { tone: 'cold', t: "Smart and miserable beats stupid.", r: "Does it. I'll report back. In fifty years. From my balcony. Alone. Smart." },
        { tone: 'passive', t: "Sorry. That came out flat.", r: "It did. I'll forgive it. I'm in a forgiving mood. Suspiciously forgiving. That's a symptom." },
        { tone: 'flirty', t: "Smart's overrated. Be reckless.", r: "Reckless. With you. ...You don't know what you're asking. I do. That's the problem." },
      ] },
      { tone: 'passive', t: "How careful?", r: "Very. I haven't played track six for anyone else. I haven't told Vivi your middle name. Mostly careful.", opts: [
        { tone: 'cold', t: "Stay careful, then.", r: "Keep it careful. Of course. Thank you. I'll put my guard back up. It's very heavy." },
        { tone: 'passive', t: "That doesn't sound very careful.", r: "It isn't. I know. I'm failing. Gorgeously. Don't tell anyone, especially Vivi." },
        { tone: 'flirty', t: "You're failing. And I love it.", r: "You love it. Naturally. You've won. Don't gloat." },
        { tone: 'risque', t: "Stop being careful tonight.", r: "Tonight. Mm. No rules. Not even Vivi's. You have no idea what you're doing to me." },
      ] },
      { tone: 'flirty', t: "What if I fell first?", r: "Then I'd be safe. And you'd be... oh. Don't. Don't say that unless it's true.", opts: [
        { tone: 'cold', t: "Hypothetically.", r: "Hypothetically. Right. Lovely. Thank you for that hypothetical palpitation." },
        { tone: 'passive', t: "I'm not sure yet.", r: "Not sure. That's honest. Honest I can handle. Sure would've finished me off." },
        { tone: 'flirty', t: "It's true.", r: "True. ...Oh. Then I'm safe. And I don't feel safe. I feel like the floor's gone." },
        { tone: 'risque', t: "I fell the night I first saw you. Kiss me and catch up.", r: "Catch up. Mm. ...There. Caught up. Don't tell Vivi. She'll say she knew." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "Confession. Vivi's oldest rule: never fall first. And I think I'm... tripping. Slightly. Don't make it worse, Trouble.",
    opts: [
      { tone: 'cold', t: "Then stop tripping.", r: "Stop. Easy for you to say. You're the one with the face. Fine. I'll stand very still.", opts: [
        { tone: 'cold', t: "Stand still, then.", r: "Still. Upright. Not falling. Not tripping. Furious. Goodnight, Trouble." },
        { tone: 'passive', t: "Sorry. I don't mean to.", r: "You don't mean to. That's worse. You're doing it by accident. Unbearable." },
        { tone: 'flirty', t: "I'll catch you.", r: "You'll catch me. Mm. I've heard that before. Never from someone who meant it." },
      ] },
      { tone: 'passive', t: "Tripping? Like falling?", r: "Not falling. Tripping. There's a difference. A small one. Shrinking by the minute.", opts: [
        { tone: 'cold', t: "Sounds like falling.", r: "It's not. ...It is. Don't make me say it. Not out loud. Not yet." },
        { tone: 'passive', t: "That's okay. I'm here.", r: "You're here. That's what I'm worried about. Don't go anywhere, though." },
        { tone: 'flirty', t: "Fall, then. I'm right behind you.", r: "Behind me? Then who's catching who? ...Okay. Okay. I'll trip a little more." },
        { tone: 'risque', t: "Trip into my arms. Tonight.", r: "Your arms. Tonight. Mm. Vivi would say I'm finished. I think I've just started." },
      ] },
      { tone: 'flirty', t: "I'll make it worse. Deliberately.", r: "Deliberately. Of course. You'd be terribly good at it. Go on, then. Ruin me.", opts: [
        { tone: 'cold', t: "Actually, I won't.", r: "You won't. Ugh. You offered ruin and took it back. That's crueller than ruin." },
        { tone: 'passive', t: "Slowly. So you can keep up.", r: "Slowly. Thoughtful. I'll keep up. I'll fall over a lot. Same thing." },
        { tone: 'flirty', t: "You're gorgeous when you're flustered.", r: "Flustered. I'm never flustered. ...I'm flustered. You've broken me. Well done." },
        { tone: 'risque', t: "Ruin you properly. Somewhere private.", r: "Somewhere private. Mm. My balcony. Track six. Ruin me in order, please." },
      ] },
      { tone: 'risque', t: "Forget the rules. Fall with me. Tonight.", r: "Tonight. Mm. Not falling. Diving. ...Vivi would be appalled and delighted. Lights low.", opts: [
        { tone: 'cold', t: "Too soon. Sorry.", r: "Too soon. Of course. Fine. My hand was already on the light switch. I'll let go." },
        { tone: 'passive', t: "Maybe not tonight. Soon.", r: "Soon. Yes. Good. Soon gives me time to be calm. I won't be. But time." },
        { tone: 'flirty', t: "Diving. Together.", r: "Together. Mm. Nobody falls first if we jump at the same time. Clever thing." },
        { tone: 'risque', t: "Lights low. Rules off. Fade out.", r: "Fade out. Mm. Come up, then. Stay a while. ...Shh. Don't tell Vivi." },
      ] },
    ],
  },
  // ==== slot 9: end of the chapter - "I don't want to be your fun weekend. I want to be your problem." ====
  {
    id: 'flirtatious-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "Let's be honest, Trouble. You've been cold and I've hated every minute. I don't want to be your fun weekend. I want to be your problem.",
    opts: [
      { tone: 'cold', t: "I don't need a problem.", m: -3, r: "Nobody needs one. Everyone wants one. Fine. I'll be somebody else's. They'll be thrilled.", opts: [
        { tone: 'cold', t: "Good. Go be theirs.", r: "Good. Right. Lovely. I'll go and be fun for someone who wants a weekend. Goodbye, Trouble." },
        { tone: 'passive', t: "Okay. What would that look like?", r: "Me, in your phone at two a.m. Me at your races, too loud. Me, staying. Think about it." },
        { tone: 'flirty', t: "Actually, I want a problem. You.", r: "Me. Your problem. Mm. About time. I'll be very problematic. Promise." },
      ] },
      { tone: 'passive', t: "What does being my problem mean?", r: "It means I'm not leaving after the encore. It means you have to want the quiet bit too. Do you?", opts: [
        { tone: 'cold', t: "I don't know.", r: "You don't know. Honest. I hate it. I'll wait, but not forever. I'm not built for forever." },
        { tone: 'passive', t: "I think I do.", r: "You think. That's... more than most. I'll take it. Bring it back when you're sure." },
        { tone: 'flirty', t: "I want the quiet bit most.", r: "The quiet bit most. ...Okay. Okay. You're my problem too, then. Brace yourself." },
        { tone: 'risque', t: "I want the quiet bit. And the very loud bits.", r: "The loud bits. Mm. My neighbours will hate us. I'm in. Completely in." },
      ] },
      { tone: 'flirty', t: "You've always been my problem.", r: "Have I? Mm. Then why does it feel like you're only just finding out? Say it properly.", opts: [
        { tone: 'cold', t: "That was properly.", r: "Was it. Then your properly needs work. Fine. I'll take what I'm given. For now." },
        { tone: 'passive', t: "You're my problem. Not a weekend.", r: "Not a weekend. Good. I'll start being difficult right away." },
        { tone: 'flirty', t: "You're my favourite problem. My only one.", r: "Only one. Mm. Correct answer. I'm moving in. Metaphorically. For now." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "I've decided something, Trouble. Weekends with you aren't enough. I'd like to be your problem. The ongoing kind.",
    opts: [
      { tone: 'cold', t: "That sounds like a lot.", r: "It is a lot. I'm a lot. That was always the deal. If it's too much, say so now.", opts: [
        { tone: 'cold', t: "It's too much.", r: "Too much. Okay. Thank you for saying it. I'll go back to being fun. From a distance." },
        { tone: 'passive', t: "It's a lot. I didn't say no.", r: "No 'no.' You're getting better at not saying no. I'll keep pushing. Gently." },
        { tone: 'flirty', t: "A lot is exactly what I want.", r: "Exactly. Mm. Then you've got it. All of it. Good luck, Trouble." },
      ] },
      { tone: 'passive', t: "The ongoing kind sounds good.", r: "Good? Not 'amazing'? Not 'finally'? Fine. 'Good' from you is a parade. I'll take it.", opts: [
        { tone: 'cold', t: "Don't push it.", r: "Don't push it. Fine. I'll pull it instead. Very subtly. You won't notice." },
        { tone: 'passive', t: "Okay. Amazing, then.", r: "Amazing. Better. We'll work on 'finally' later." },
        { tone: 'flirty', t: "Finally. There. Happy?", r: "Happy. Mm. Very. Don't look at me. I'm doing something stupid with my face. Smiling." },
        { tone: 'risque', t: "Be my problem tonight, and every night after.", r: "Every night. Careful what you offer. I barely sleep. You'll need stamina, Trouble." },
      ] },
      { tone: 'flirty', t: "Be my problem. I've been waiting for you to say it.", r: "Waiting? You might have said! I've been rehearsing this in the mirror for days.", opts: [
        { tone: 'cold', t: "I'm not good at saying things.", r: "No. You're not. But you're good at being there. I'll do the saying for both of us." },
        { tone: 'passive', t: "How did the rehearsals go?", r: "Terribly. I kept blushing. I never blush. You've ruined me, Trouble." },
        { tone: 'flirty', t: "You don't need rehearsals. You've got me.", r: "I've got you. Mm. Say that again and I'll stop being able to talk at all." },
        { tone: 'risque', t: "Come home with me and be a problem all night.", r: "All night. I'll be very, very problematic. ...Lead the way." },
      ] },
    ],
  },
  {
    id: 'flirtatious-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "I'm done with weekends, Trouble. Forget fun. Make me your problem. Your every-day, every-night problem.",
    opts: [
      { tone: 'cold', t: "Weekends are easier.", r: "Easier. Yes. So's being alone. I've done easy. I'm asking for hard. With you.", opts: [
        { tone: 'cold', t: "Easier suits me.", r: "Then easy it is. I'll be fun. Occasional. Disposable. Lovely. Goodbye." },
        { tone: 'passive', t: "Okay. Let's try hard.", r: "'Let's try hard.' The least romantic sentence ever spoken. I'm thrilled." },
        { tone: 'flirty', t: "Hard with you sounds like fun.", r: "It will be. I'll make sure. I'm a problem with excellent taste." },
      ] },
      { tone: 'passive', t: "Every night? You don't sleep.", r: "I don't. You'll get used to it. I'll put track six on and you'll forget sleep was ever a thing.", opts: [
        { tone: 'cold', t: "I need my sleep.", r: "You need your sleep. Of course. Weekends it is, then. I'll be on the balcony." },
        { tone: 'passive', t: "I'll get used to it.", r: "You will. And then you'll miss it when you're away. That's how I get you." },
        { tone: 'flirty', t: "Sleep's overrated anyway.", r: "Overrated. Mm. Good. I'll keep you up. Talking. Mostly talking." },
        { tone: 'risque', t: "Keep me up. I dare you.", r: "Dare me. Oh, Trouble. I never lose a dare. Clear the next morning." },
      ] },
      { tone: 'flirty', t: "Be my problem. I'm yours already.", r: "Already? Mm. Then I've won. And it doesn't feel like winning. It feels like... home. Ugh.", opts: [
        { tone: 'cold', t: "Don't get soppy.", r: "Soppy. Me? Never. ...I'm a bit soppy. You'll forgive it. Or you won't." },
        { tone: 'passive', t: "Home's a nice word.", r: "It's a terrifying word. I've never used it about a person. Give me time." },
        { tone: 'flirty', t: "Then welcome home.", r: "Welcome home. Oh, that's... Trouble. Don't make me cry in public. My reputation." },
        { tone: 'risque', t: "Home. Tonight. And I'm not leaving.", r: "Not leaving. Mm. Then I'll lock the door and lose the key. Fade out, darling." },
      ] },
      { tone: 'risque', t: "Be my problem. Starting tonight. At my place.", r: "Your place. Tonight. Mm. I'd say I'll think about it, but I'm already holding my coat.", opts: [
        { tone: 'cold', t: "Tomorrow. I'm tired.", r: "Tomorrow. Okay. Coat back on the hook. I'll be a patient problem. For one day." },
        { tone: 'passive', t: "No rush. Whenever you're ready.", r: "Whenever I'm ready. I'm ready. I've been ready for weeks. But thank you for asking." },
        { tone: 'flirty', t: "Bring track six.", r: "Track six comes with me everywhere now. It's your song too, apparently. Lead on." },
        { tone: 'risque', t: "Bring nothing. Stay till morning.", r: "Till morning. Mm. Breakfast is your problem; I burn toast. Lead the way, Trouble." },
      ] },
    ],
  },
];
