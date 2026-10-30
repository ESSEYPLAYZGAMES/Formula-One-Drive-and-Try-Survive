// DOMINANT - in person, stage close: the protective, devoted side - claimed, missed, fiercely kept. Plain data.
export const DATA = [
  {
    id: 'dominant-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: ["You went quiet on me last time. I don't like quiet from you. So I'll talk: I told my grandmother about you. She wants to meet you.", "Distant again. I'm not letting it slide. I told my grandmother about you - the chess one, if I've mentioned her. Chew on that."],
    opts: [
      { tone: 'cold', t: "I didn't ask you to.", r: "You didn't. I did it anyway, because I'm proud of you. Be cold if you need to. Don't be cold and silent.", opts: [
        { tone: 'cold', t: "I need some space.", r: "Then have it. I'll be here when you're out the other side. Don't make me wait long. That's not a rule. It's a plea." },
        { tone: 'passive', t: "Fine. What did she say?", r: "She asked if you can keep up with me. I said yes. Prove me right, would you." },
        { tone: 'flirty', t: "I'm secretly flattered.", r: "Not secretly. Your ears go red. They're red now. Good. Come here." },
      ] },
      { tone: 'passive', t: "Sorry. I've had a lot on.", r: "Then tell me what. Don't carry it on your own. I'm very good at carrying things.", opts: [
        { tone: 'cold', t: "It's not your problem.", r: "Everything of yours is my problem. Gladly. But fine - I'll wait till you want to tell me." },
        { tone: 'passive', t: "Just the season. It's a lot.", r: "I know. That's why I'm here. Lean on me. Properly. That's an order." },
        { tone: 'flirty', t: "You make it easier.", r: "I make most things easier. You're the only thing I've ever wanted to make easier." },
      ] },
      { tone: 'flirty', t: "I went quiet so you'd come and find me.", r: "Manipulative. Effective. I came. Don't do it again - just say 'come here'. I always will.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "Fine. You went quiet for your own reasons. I don't like the silence, and I'll keep saying so." },
        { tone: 'passive', t: "Okay. Come here, then.", r: "There. See how easy that is? That's all it ever takes." },
        { tone: 'flirty', t: "Come here.", r: "...Orders, from you? I like it. I'm coming." },
      ] },
    ],
  },
  {
    id: 'dominant-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: ["You're mine, and I told my grandmother so. Did I ever tell you about her? Taught me chess, never let me win. She approves.", "You're mine now. Nicely. I've told my grandmother - chess, never once let me win, I may have mentioned her. She wants you at Sunday lunch."],
    opts: [
      { tone: 'cold', t: "You told people already?", r: "One person. The most important one. She's eighty-odd and terrifying. You should be flattered. Are you?", opts: [
        { tone: 'cold', t: "That's too fast for me.", r: "...Fine. Too fast. I'll slow down. But don't go quiet on me about it - tell me when it's too much. Like now.", m: -1 },
        { tone: 'passive', t: "I'm a little flattered.", r: "Be a lot flattered. She once sent back a soup three times. She's never sent back a person of mine." },
        { tone: 'flirty', t: "What did you tell her?", r: "That you're stubborn, quick and mine. She said 'finally'. She's been waiting years for me to say that." },
      ] },
      { tone: 'passive', t: "And her verdict?", r: "She said, 'Can they keep up with you?' I said yes. She said, 'Then don't let go.' I'm not planning to.", opts: [
        { tone: 'cold', t: "Don't get ahead of yourself.", r: "Ahead of myself? I'm exactly where I mean to be. Don't pull back on me now." },
        { tone: 'passive', t: "Did she really never let you win?", r: "Not once. Thirteen years. Then I beat her and she framed the board. She'll try the same with you." },
        { tone: 'flirty', t: "I'm not planning to let go either.", r: "Good. Then we're agreed. That's two of us who don't let go. Formidable." },
      ] },
      { tone: 'flirty', t: "Mine, you said.", r: "I did. I meant it. Nicely mine. Fiercely mine. Mine with a very clear exit you'll never want.", opts: [
        { tone: 'cold', t: "I'm not anyone's.", r: "You're your own. Always. I just get to stand next to you. Don't make me argue for it - I will." },
        { tone: 'passive', t: "I like being yours.", r: "Good. I like it too. More than I'll ever admit in front of anyone but you." },
        { tone: 'flirty', t: "Say it again.", r: "Mine. ...Again? Mine. You'll wear the word out. I won't." },
        { tone: 'risque', t: "Show me how yours I am.", r: "Come here and find out. I'll be thorough. I'm always thorough. ...Lights. Off." },
      ] },
    ],
  },
  {
    id: 'dominant-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: ["There you are. Mine. I've been bragging about you to my grandmother - the chess one, did I mention her? She said, 'About time.'", "I've been bragging about you. To my grandmother, of all people - I think I've told you about her. She said, 'About time.'"],
    opts: [
      { tone: 'cold', t: "You're bragging? That's embarrassing.", r: "It's not embarrassing. It's accurate reporting. Don't go shy on me now.", opts: [
        { tone: 'cold', t: "Stop telling people about us.", r: "...Fine. I'll stop. You could've just said you wanted it private. I'd have done that instantly." },
        { tone: 'passive', t: "Okay, it's a bit sweet.", r: "It's very sweet. I'm very sweet. Tell no one. That's the one thing I don't want bragged about." },
        { tone: 'flirty', t: "Brag louder.", r: "Careful. I will. I'll have it printed on a banner at {track}." },
      ] },
      { tone: 'passive', t: "What exactly did you say about me?", r: "That you're quick and stubborn and you argue with me. She said, 'Good. Keep that one.'", opts: [
        { tone: 'cold', t: "I'd rather she didn't know.", r: "Too late. She knows. I'm not sorry for being proud of you. I'll be quieter, if you ask." },
        { tone: 'passive', t: "I'd like to meet her.", r: "You will. Sunday. She'll beat you at chess and like you more for losing well." },
        { tone: 'flirty', t: "Did you tell her I'm gorgeous?", r: "I told her you're mine. She worked out the rest herself." },
      ] },
      { tone: 'flirty', t: "About time, indeed.", r: "About time. I agree. I took my time. I don't regret a minute of it.", opts: [
        { tone: 'cold', t: "Don't get sentimental.", r: "Fine. I'll keep it to myself. It'll still be there. You can't stop me feeling it." },
        { tone: 'passive', t: "You really like me.", r: "Like? No. Like was months ago. Keep up." },
        { tone: 'flirty', t: "Show me how much.", r: "Come here. That's how much. Arms. Here. Don't go anywhere." },
        { tone: 'risque', t: "Take me home and tell me again.", r: "I'll take you home. I won't tell you. I'll make my point another way. Door. Now." },
      ] },
    ],
  },
  {
    id: 'dominant-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: ["You've been distant. On top of being away. I didn't miss you, obviously. I checked your lap times eleven times for no reason.", "Cold, after nine days apart? No. I missed you. Eleven checks of your lap times. I'm saying it first, which I hate. Your turn."],
    opts: [
      { tone: 'cold', t: "I've been busy.", r: "Busy I understand. Distant I don't. Pick one. If it's distant, tell me why. I'll listen.", opts: [
        { tone: 'cold', t: "I just need some quiet.", r: "Then take it. I'll be quiet too. Just - don't disappear into it. I hate guessing." },
        { tone: 'passive', t: "Sorry. I missed you too.", r: "There. Was that so painful? It was for me too. Come here." },
        { tone: 'flirty', t: "I'm busy missing you.", r: "Better answer. Much better. You nearly lost a point there. Nearly." },
      ] },
      { tone: 'passive', t: "Sorry. I should've called more.", r: "You should've. I should've told you to. We're both bad at this part. We'll get better.", opts: [
        { tone: 'cold', t: "Let's not do this now.", r: "Fine. Not now. But we will. I don't leave things lying about between us." },
        { tone: 'passive', t: "Eleven times?", r: "Eleven. I'm not proud. I'm extremely proud. You were fast in sector two." },
        { tone: 'flirty', t: "I'll call every night next time.", r: "You will. And you'll eat something before you do. Two orders. Both loving." },
      ] },
      { tone: 'flirty', t: "You missed me. Admit it.", r: "I said so. I'll say it again: I missed you. I don't say things twice. That's how much.", opts: [
        { tone: 'cold', t: "Hm.", r: "'Hm'? That's what I get? Fine. Keep your 'hm'. I'll keep missing you anyway. Stubbornly." },
        { tone: 'passive', t: "Honestly? I missed you like mad.", r: "Honestly is my favourite word from you. Come here and say it closer." },
        { tone: 'flirty', t: "I missed you more.", r: "Impossible. I don't lose. But you can try to prove it. Tonight." },
      ] },
    ],
  },
  {
    id: 'dominant-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: ["I didn't miss you. I checked your lap times eleven times. Unrelated. ...Fine. I missed you. Come here.", "You were away nine days. I didn't count. I counted. And refreshed your lap times eleven times. It's your job. I'll just complain."],
    opts: [
      { tone: 'cold', t: "I was working.", r: "I know. I'm not complaining. I'm reporting. The house was too quiet. The cat sulked. I sulked worse.", opts: [
        { tone: 'cold', t: "It's only a few days.", r: "Only? Don't. Don't make it small. I missed you, and I'm allowed to say so even if you won't." },
        { tone: 'passive', t: "I know. I'm back now.", r: "You are. Good. Stay put for at least an evening. That isn't negotiable." },
        { tone: 'flirty', t: "It was awful without you.", r: "Good. Say it again, slower. I've been waiting nine days to hear it." },
      ] },
      { tone: 'passive', t: "Same. Every single day.", r: "Good. That's settled, then. We both missed each other. I win, though - I missed you more. I always win.", opts: [
        { tone: 'cold', t: "Don't make it a competition.", r: "Everything's a competition. But fine - it's a draw. Don't go cold on me over a draw." },
        { tone: 'passive', t: "Eleven times? Really?", r: "Eleven. Twelve, if you count the one in the queue at the bakery. Don't laugh. You're laughing." },
        { tone: 'flirty', t: "I checked your messages. Constantly.", r: "Good. I wrote them to be checked. Each one cost me a meeting. Worth it." },
      ] },
      { tone: 'flirty', t: "You counted the days?", r: "Every one. I'm not ashamed. I'm a little ashamed. Come here and make it worth it.", opts: [
        { tone: 'cold', t: "Bit much, isn't it.", r: "Maybe. Don't flinch from it, though. I'd rather be a bit much than a bit absent." },
        { tone: 'passive', t: "All right. Here I am.", r: "Good. Closer. That's better. Nine days of wanting this. Let me have a minute." },
        { tone: 'flirty', t: "I'll make every day worth it.", r: "I'll hold you to every one. I keep records, you know." },
        { tone: 'risque', t: "Let me make up for all nine.", r: "Nine days is a lot of making up. We'd better start now. My place. I'll drive. You navigate." },
      ] },
    ],
  },
  {
    id: 'dominant-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: ["Nine days. I checked your lap times. I reorganised my flat. Twice. None of it was missing you. Come here.", "Look who's back. I reorganised my whole flat out of not missing you. Come here."],
    opts: [
      { tone: 'cold', t: "Don't be clingy.", r: "Clingy? I'm not clingy. I'm decisive about where I want you. Here. ...Fine. I heard you. Arm's length.", opts: [
        { tone: 'cold', t: "Seriously, give me a minute.", r: "A minute. You can have a minute. I'll be right here, being patient and pointedly not clingy." },
        { tone: 'passive', t: "Okay. Fine. Come here.", r: "There. Clingy. Me. The nerve. I'll let it go because you're warm." },
        { tone: 'flirty', t: "I like you clingy.", r: "Good. Then I'll stop pretending. I missed you stupidly. There. Said it." },
      ] },
      { tone: 'passive', t: "You were missed too, you know.", r: "Of course I was. I'm very missable. I'm also very glad you're back. In that order. No - other order.", opts: [
        { tone: 'cold', t: "Okay, okay, don't make it a thing.", r: "It's a thing. You're a thing. My thing. Fine - I'll make it a smaller thing." },
        { tone: 'passive', t: "What did you reorganise?", r: "Everything. The spice rack's alphabetised. Twice. It's a very calm spice rack now. I'm not." },
        { tone: 'flirty', t: "Prove you missed me.", r: "Easily. Come here. ...That's proof. Want more? You'll get more." },
      ] },
      { tone: 'flirty', t: "You reorganised your flat? For me?", r: "Not for you. Because of you. Different. You disrupted me. I don't get disrupted.", opts: [
        { tone: 'cold', t: "That's a little intense.", r: "It's very intense. I'm very intense about you. Don't back off from it - tell me if it's too much." },
        { tone: 'passive', t: "That's adorable.", r: "Say adorable again and I'll reorganise you. Gently." },
        { tone: 'flirty', t: "Disrupt me back.", r: "Gladly. Starting now. Hand. Here. Good. Now forget your whole week." },
        { tone: 'risque', t: "Disrupt my whole night.", r: "That's the plan. Your night, your morning, possibly your Tuesday. Coat on. We're going." },
      ] },
    ],
  },
  {
    id: 'dominant-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: ["You're distant, and that one from the paddock isn't. I'm not jealous. I'm noticing. Loudly, in my head.", "I don't like it when you go cold on me. I like it less when someone else gets the warm version. Just saying."],
    opts: [
      { tone: 'cold', t: "It's not your business who I talk to.", r: "It isn't. You're right. Who you're cold to is my business, though - and that's me. Why?", opts: [
        { tone: 'cold', t: "I don't have to explain.", r: "You don't. But I'll keep asking. That's not a demand. It's what caring about someone looks like." },
        { tone: 'passive', t: "Sorry. I've just been in my head.", r: "Then come out of it. With me. I'm a much better place than your head." },
        { tone: 'flirty', t: "Maybe I wanted you jealous.", r: "...It worked. I'm annoyed it worked. Never do that again. Do that again." },
      ] },
      { tone: 'passive', t: "They're nobody. I promise.", r: "I believe you. I'm not asking you to stop talking to anyone. I'm asking you to talk to me.", opts: [
        { tone: 'cold', t: "I am talking to you.", r: "Barely. But fine. I'll take barely. I'm not giving up on more." },
        { tone: 'passive', t: "Okay. I'm here. Talk to me.", r: "Good. That's all I wanted. Sit. Tell me about your week. All of it." },
        { tone: 'flirty', t: "You're the only one who gets the warm version.", r: "Prove it. ...That's better. That's the version I like." },
      ] },
      { tone: 'flirty', t: "Are you jealous? That's adorable.", r: "Adorable? I'm a professional at this. And I'm pointing all of it at you.", opts: [
        { tone: 'cold', t: "Point it somewhere else.", r: "No. But I'll turn it down. You can't make me stop caring. You can make me quieter about it." },
        { tone: 'passive', t: "Point it at me. I'm here.", r: "I know. You. Here. Not over there. That's the whole of it." },
        { tone: 'flirty', t: "I like it when you're jealous.", r: "Then I'll be jealous more often. It's very easy. You make it very easy." },
      ] },
    ],
  },
  {
    id: 'dominant-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: ["That person from the paddock who keeps touching your shoulder. I'm not jealous. I'm vigilant. There's a difference.", "Someone's been very friendly with you all weekend. I've noticed. I'm vigilant, not jealous. Extremely calm. Look how calm."],
    opts: [
      { tone: 'cold', t: "They're a friend. Drop it.", r: "Fine. Dropped. I trust you. I just don't love them. I'm allowed not to love them.", opts: [
        { tone: 'cold', t: "Stop. Seriously.", r: "Stopped. You're right. I'm being a lot. I'm sorry. ...I still don't love them." },
        { tone: 'passive', t: "They're harmless, I promise.", r: "I believe you. Harmless people still get glared at. It's a public service." },
        { tone: 'flirty', t: "You're cute vigilant.", r: "Cute? I'm a fortress. ...You're smiling. Fine. A cute fortress." },
      ] },
      { tone: 'passive', t: "You've got nothing to worry about.", r: "I know. I wasn't worried. I was standing very close to you for no reason. Purely coincidental.", opts: [
        { tone: 'cold', t: "You're being possessive.", r: "I'm being honest. Possessive would be telling you who to talk to. I'd never. I just tell you how I feel." },
        { tone: 'passive', t: "Do you want me to say something to them?", r: "No. Never. That's your life. I don't run it. I just reserve the right to stand nearby, looking stern." },
        { tone: 'flirty', t: "You're the only one I see.", r: "Good answer. Perfect answer. I'll stop glaring now. Mostly." },
      ] },
      { tone: 'flirty', t: "Jealous looks good on you.", r: "Everything looks good on me. Jealous looks best when you're holding my hand. Hold it.", opts: [
        { tone: 'cold', t: "Jealous isn't attractive, you know.", r: "...Noted. That stung, but noted. I'll keep it inside. You'll still catch me looking." },
        { tone: 'passive', t: "Okay. Holding it.", r: "Good. Now they can see. Job done. Simple. Primitive. Effective." },
        { tone: 'flirty', t: "I'll kiss you in front of them if you like.", r: "I'd like that very much. ...There. Now everyone knows. I'm insufferable now. Sorry." },
        { tone: 'risque', t: "I'll show you whose I am later.", r: "Later. Yes. I'll hold you to every word of that. Every single one." },
      ] },
    ],
  },
  {
    id: 'dominant-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: ["Someone in the paddock has been staring at you all weekend. I've been staring back at them. They've stopped. You're welcome.", "I'm not jealous. I just think everyone who looks at you that way should know you've got someone. Me. I'm the someone."],
    opts: [
      { tone: 'cold', t: "Don't be territorial.", r: "Not territorial. Proud. There's a difference. One growls. The other just stands nearby, smiling.", opts: [
        { tone: 'cold', t: "It's still territorial.", r: "...Fine. A bit. I'll stand down. I'm not happy about it, but I'll stand down. For you." },
        { tone: 'passive', t: "Okay, proud I'll allow.", r: "Good. Proud is the only thing I am in public. In private I'm far worse." },
        { tone: 'flirty', t: "I like you territorial.", r: "Then I'll let it out a little more. Only a little. You'll know." },
      ] },
      { tone: 'passive', t: "Obviously. Yours.", r: "Obviously. Good. I wanted to hear it in your voice, not mine.", opts: [
        { tone: 'cold', t: "Don't make me say it every time.", r: "I won't. Once was the important one. ...I'll want it again next weekend." },
        { tone: 'passive', t: "What did you do to them?", r: "Nothing. Stood there. Very politely. Very steadily. They blinked four times. I didn't once." },
        { tone: 'flirty', t: "Tell them yourself.", r: "I'd rather show them. Kiss me. Here. ...There. Message delivered." },
      ] },
      { tone: 'flirty', t: "You're cute when you're jealous.", r: "I'm not jealous. I'm in charge of the perimeter. Different job. Same uniform.", opts: [
        { tone: 'cold', t: "Ease off the perimeter.", r: "Fine. Easing off. Reluctantly. You'll find me hovering. Lovingly." },
        { tone: 'passive', t: "Your perimeter's very secure.", r: "It is. Nobody gets through. Except you. You've got a key." },
        { tone: 'flirty', t: "Guard me all night, then.", r: "I fully intend to. Every hour. Every door. Starting with yours." },
        { tone: 'risque', t: "Take me home and remind me I'm yours.", r: "Gladly. I don't do subtle reminders. I do thorough ones. Car. Now." },
      ] },
    ],
  },
  {
    id: 'dominant-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: ["You're closed off. I know why. What that driver did to you at {last} was disgraceful. Talk to me about it. Don't shut me out.", "You've gone cold since the race. I'm not letting you sit in it alone. That move at {last} - talk to me."],
    opts: [
      { tone: 'cold', t: "I don't want to talk about it.", r: "Then don't talk. But don't send me away either. I'll sit here. Silent. Furious on your behalf.", opts: [
        { tone: 'cold', t: "Please just leave it.", r: "...All right. Leaving it. I'll be in the next room if you change your mind. Always." },
        { tone: 'passive', t: "Okay. It got to me.", r: "I know. It'd get to anyone. You held it together, and I'm proud of you, and I want their name." },
        { tone: 'flirty', t: "Stay. Be furious with me.", r: "Gladly. Very furious. Very close. That's a good combination, actually." },
      ] },
      { tone: 'passive', t: "Sorry. It just got under my skin.", r: "Don't apologise. Get angry, then get even - on track. And let me be angry for you off it.", opts: [
        { tone: 'cold', t: "I don't need you angry for me.", r: "You don't need it. You've got it anyway. I'll keep the volume down." },
        { tone: 'passive', t: "What would you do to them?", r: "Smile at them on the grid next time. A very long smile. They'd lose sleep over it for a week." },
        { tone: 'flirty', t: "I like you angry for me.", r: "Good. It's very sincere. I don't spend it on just anyone." },
      ] },
      { tone: 'flirty', t: "You're cute when you're protective.", r: "Cute? I'm a wall. You're behind it whenever the world gets rough.", opts: [
        { tone: 'cold', t: "I don't need a wall.", r: "No. You'd climb it anyway. Fine. I'll be a low wall. A bench. Something you can sit on." },
        { tone: 'passive', t: "Okay. I'll stay behind the wall.", r: "Good. It's warm back here. I made sure of it." },
        { tone: 'flirty', t: "I like being behind your wall.", r: "Then stay as long as you want. I built it for you. Recently. Rather quickly." },
      ] },
    ],
  },
  {
    id: 'dominant-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: ["The one who pushed you wide at {last}. Give me a name. I'll glare at them. Professionally.", "I watched what that driver did to you at {last}. I'm calm. Very calm. I'd just like their name. For my notes."],
    opts: [
      { tone: 'cold', t: "Stay out of it. It's racing.", r: "...Fine. It's racing, and it's yours. I'll stay out of it. I'll dislike them privately. That's my right.", opts: [
        { tone: 'cold', t: "I mean it. Leave it alone.", r: "I heard you the first time. Left alone. Completely. Don't think that means I didn't mind." },
        { tone: 'passive', t: "Thank you for minding, though.", r: "Always. I'll mind everything about you. Even the parts you'd rather I didn't." },
        { tone: 'flirty', t: "Protective is a very good look on you.", r: "Am I. Then I'll protect you more often. At very close range." },
      ] },
      { tone: 'passive', t: "It's fine. I'll beat them next time.", r: "Good. You will. And I'll be watching, looking very smug.", opts: [
        { tone: 'cold', t: "Don't make it about you.", r: "Fair. It's not. It's yours. But I care - you can't switch that off. Don't try." },
        { tone: 'passive', t: "Are you really this protective?", r: "Of you? Absolutely. Of everything else, moderately. You're the exception to every rule I have." },
        { tone: 'flirty', t: "Will you be there to celebrate?", r: "Front and centre. With food. You'll eat it. Then I'll celebrate you properly." },
      ] },
      { tone: 'flirty', t: "My bodyguard.", r: "Your partner. Better. Bodyguards get paid. I'm doing this for nothing but you.", opts: [
        { tone: 'cold', t: "I can handle my own battles.", r: "I know you can. I've watched you. I'll be in your corner anyway - quietly, if you'd rather." },
        { tone: 'passive', t: "Thank you. Seriously.", r: "Don't thank me. Just win. And eat something after." },
        { tone: 'flirty', t: "Protect me some more.", r: "Come here. There. Arms. That's the most protected you'll ever be." },
        { tone: 'risque', t: "Protect me all night.", r: "I'll guard every hour of it. Personally. Very closely. Lights off. Phone away." },
      ] },
    ],
  },
  {
    id: 'dominant-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: ["I've drafted a strongly worded look for the one who put you wide at {last}. Want to see it? Then I'd like a kiss.", "Nobody puts you off the track and gets a nice smile from me. I've practised a look for them. And I'd like a kiss."],
    opts: [
      { tone: 'cold', t: "Don't fight my battles.", r: "I won't. I'll just stand behind you during them, looking unimpressed. It's my natural face.", opts: [
        { tone: 'cold', t: "I'm serious.", r: "Understood. No looks. No glaring. I'll be a perfectly polite partner. It'll be agony." },
        { tone: 'passive', t: "Okay. The look's allowed.", r: "Thank you. It's very good. Watch. ...See? Chilling. They'll feel it at {track}." },
        { tone: 'flirty', t: "Show me the look.", r: "...Not that one. That's the look I save for you. Wrong look. Very wrong look. Come here." },
      ] },
      { tone: 'passive', t: "Go on, then. Let's see it.", r: "Here. ...Devastating. They'll feel it from three garages away. I've been practising since lap twelve.", opts: [
        { tone: 'cold', t: "That's ridiculous.", r: "It's extremely ridiculous. I'll put it away. But I'll keep it, for emergencies." },
        { tone: 'passive', t: "You're very sweet, you know.", r: "Sweet? I've never been called sweet. I'll allow it. From you. Once a week." },
        { tone: 'flirty', t: "Use it on me.", r: "I don't need a look for you. I have other methods. Come here." },
      ] },
      { tone: 'flirty', t: "You can have a kiss.", r: "Good. ...There. Now I'm calm. Mostly. I'll still glare at them a little.", opts: [
        { tone: 'cold', t: "That's enough glaring for one week.", r: "Fine. Glare suspended. I'll glare at the wallpaper. You'll find it very dull." },
        { tone: 'passive', t: "Glare a little, then.", r: "A little. Measured. Professional. Then I'm taking you home." },
        { tone: 'flirty', t: "Another kiss to calm you down?", r: "A second one makes me less calm. Different effect. Try it and see." },
        { tone: 'risque', t: "Take me home and make me forget the race.", r: "I'll make you forget the whole season. Home. Now. You might remember it by morning." },
      ] },
    ],
  },
  {
    id: 'dominant-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: ["You're quiet with me. Admiral isn't. My cat - he slept on your jacket. He outranks me, and he's decided. You're stuck with us.", "Distant again? My cat Admiral doesn't care. He's adopted you - slept on your jacket. You're stuck with us. He's more open than you are."],
    opts: [
      { tone: 'cold', t: "I'm not stuck with anyone.", r: "No. You're not. You can walk any time. I'd just rather you walked toward me. Both of us would.", opts: [
        { tone: 'cold', t: "Then let me be for a bit.", r: "...Fine. For a bit. Don't make it long. He misses you. I'm not saying I do. I do." },
        { tone: 'passive', t: "Okay. Tell me about the jacket.", r: "He curled up on it at midnight and wouldn't move. I let him. I've never let him do anything." },
        { tone: 'flirty', t: "I'd rather be stuck with you.", r: "Correct. Took you a while. Come here." },
      ] },
      { tone: 'passive', t: "Sorry. I'm just tired.", r: "Then come and be tired at mine. He'll sit on you. I'll make you eat. You'll feel better. Orders.", opts: [
        { tone: 'cold', t: "I want to be tired on my own.", r: "That's allowed. I don't love it, but it's allowed. Message me once you're in. Please." },
        { tone: 'passive', t: "Okay. Yours, then.", r: "Good. I'll put the kettle on. He'll put himself on you." },
        { tone: 'flirty', t: "You and the cat. Perfect.", r: "We're a very good team. Very bossy. You'll be spoiled rotten." },
      ] },
      { tone: 'flirty', t: "He's got good taste.", r: "He does. So do I. We agree on very little. We agree on you.", opts: [
        { tone: 'cold', t: "Don't push it. Not tonight.", r: "...Fine. I'll pull it back. But I'm not taking back what I said." },
        { tone: 'passive', t: "What else do you agree on?", r: "That you need feeding. That you work too hard. That you should be on our sofa more often." },
        { tone: 'flirty', t: "I'll be his favourite.", r: "You're already mine. He'll have to fight me for the top spot." },
      ] },
    ],
  },
  {
    id: 'dominant-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: ["Admiral slept on your jacket. My cat - the only one at home who outranks me. He's never done that for anyone. You're family now.", "My cat's made his decision. Admiral - he outranks me, you might remember - sat on your bag for an hour. That makes you family. Officially."],
    opts: [
      { tone: 'cold', t: "It's just a cat.", r: "Just a cat? Take that back. He's the hardest critic I know, and he chose you. Don't you dare shrug it off.", opts: [
        { tone: 'cold', t: "It's still just a cat.", r: "Fine. Just a cat. Who adores you. Shrug at both of us if you like. We'll both keep at it." },
        { tone: 'passive', t: "Okay, it's a big deal.", r: "It's an enormous deal. I've waited two years for him to approve of someone. And it's you. Of course it's you." },
        { tone: 'flirty', t: "Tell him I'm honoured.", r: "Tell him yourself. Stay tonight. He'll want his jacket back on." },
      ] },
      { tone: 'passive', t: "That's lovely.", r: "It is. He doesn't do it. I don't do this either - telling someone they're family. I'm unravelling.", opts: [
        { tone: 'cold', t: "Don't make it too much.", r: "I'm trying. It's hard. You're making it hard by being liked by everyone in my house." },
        { tone: 'passive', t: "Can I come over and see him?", r: "You can come over whenever you like. You don't have to ask. ...Fine, ask. I'll always say yes." },
        { tone: 'flirty', t: "So I've got two of you to impress.", r: "You've impressed both of us. Now you have two of us to keep. That's harder. We're demanding." },
      ] },
      { tone: 'flirty', t: "Family? That's fast.", r: "It's how he does it. It's how I do it too. No halfway. You knew that.", opts: [
        { tone: 'cold', t: "Slow down a little.", r: "Then we'll slow it down. Not the feeling. Just the words. I can do that. He can't." },
        { tone: 'passive', t: "Okay. Family it is.", r: "Good. He'll sit on you more now. So will I. Metaphorically. Mostly." },
        { tone: 'flirty', t: "I like being family.", r: "Then you'll love Sundays. Grandmother, chess, cat, me. You'll never escape. You'll never try." },
        { tone: 'risque', t: "Let's go home and not disturb him.", r: "We'll disturb him. He'll cope. He's very worldly. Come on. Your jacket's waiting." },
      ] },
    ],
  },
  {
    id: 'dominant-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: ["Come home with me tonight. Admiral - my cat, the one who outranks me - slept on your jacket. I'm jealous of a cat.", "My cat has fallen for you. Admiral, the tyrant of my house. Slept on your jacket. I'm jealous. Come back to mine tonight?"],
    opts: [
      { tone: 'cold', t: "I'm not coming home with you tonight.", r: "Then not tonight. He'll sulk. I'll sulk with more style. Another night, then.", opts: [
        { tone: 'cold', t: "I mean it. Not tonight.", r: "I heard you. Not tonight. I won't ask again tonight. Tomorrow I might." },
        { tone: 'passive', t: "Maybe tomorrow.", r: "Tomorrow. Good. I'll tell him. He won't care, he's a cat. I'll care." },
        { tone: 'flirty', t: "Fine. But only for him.", r: "Only for him. Of course. I'll pretend that's true all the way home." },
      ] },
      { tone: 'passive', t: "Okay. Tonight.", r: "Good. I'll have food waiting. You'll eat it. He'll steal some. Nobody will mention it.", opts: [
        { tone: 'cold', t: "Don't make a fuss over me.", r: "No fuss. Just dinner, a cat, and me. Low-key. Barely any fuss. Some fuss." },
        { tone: 'passive', t: "I'd love that.", r: "I know. I could tell. You do this little smile when I'm right." },
        { tone: 'flirty', t: "Will there be room for me?", r: "There's always room for you. I'll move the cat. ...I won't move the cat. I'll move closer." },
      ] },
      { tone: 'flirty', t: "Jealous of a cat?", r: "Very. He gets to sleep on your things. I've had to earn it the hard way.", opts: [
        { tone: 'cold', t: "Grow up.", r: "...Ouch. Fine. I'll grow up. Very maturely. Over there. Away from your jacket." },
        { tone: 'passive', t: "That's ridiculous. And sweet.", r: "It's both. Most of my best qualities are both." },
        { tone: 'flirty', t: "Earn it tonight.", r: "I intend to. Coat on. I've already decided. You'll agree in the car." },
        { tone: 'risque', t: "Then let me sleep on yours.", r: "Ha. You can sleep wherever you like, as long as it's next to me. Come on." },
      ] },
    ],
  },
  {
    id: 'dominant-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: ["You've been distant, and I'm done with distant. Come here. Talk to me or kiss me. Your choice. Or neither - say so.", "I don't like the space between us lately. Talk to me or kiss me - or neither, if you want. I'll stop the second you say."],
    opts: [
      { tone: 'cold', t: "Neither.", r: "...Neither. All right. I won't push. But I'm not pretending I'm fine about it. I'm here when you want me.", opts: [
        { tone: 'cold', t: "I need space tonight.", r: "Then have it. All of it. I'll be on the other side of the door, missing you, very quietly.", m: -1 },
        { tone: 'passive', t: "Sorry. Talk, then.", r: "Good. Talk. I'll listen. I'm good at it when it's you. Start anywhere." },
        { tone: 'flirty', t: "Fine. Kiss, then.", r: "That's the one I was hoping for. ...There. That's better. That's much better." },
      ] },
      { tone: 'passive', t: "I'm sorry. I've been in my head.", r: "Then let me get you out of it. Come here. ...Better?", opts: [
        { tone: 'cold', t: "Not really.", r: "Then we'll try talking. I'll make tea. I'm not giving up on you over one bad week." },
        { tone: 'passive', t: "A little better.", r: "A little is a start. Stay. A lot is coming." },
        { tone: 'flirty', t: "Much better.", r: "Good. Then stay right here. I've missed this. I've missed you, even with you right here." },
      ] },
      { tone: 'flirty', t: "Kiss. Obviously.", r: "Good choice. The correct choice. ...There. Distance closed.", opts: [
        { tone: 'cold', t: "Okay, that's enough.", r: "Enough. Fine. You say when, always. I'll stop there.", m: -1 },
        { tone: 'passive', t: "Again?", r: "Again. I've got weeks of distance to make up for. Come here." },
        { tone: 'flirty', t: "Don't stop.", r: "I wasn't going to. Not until you tell me. You won't tell me." },
        { tone: 'risque', t: "Talking can wait till morning.", r: "It can. Everything can. Lights. Off. Come here." },
      ] },
    ],
  },
  {
    id: 'dominant-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: ["Come here. Closer. Tonight I set the pace, and the pace is slow. Very slow. All right?", "Come here. No talking for a minute. I want to look at you. ...Good. Now closer."],
    opts: [
      { tone: 'cold', t: "Not tonight. Sorry.", r: "Then not tonight. You never have to explain that one. I'll just hold you, or I'll go - you say.", m: 0, opts: [
        { tone: 'cold', t: "Just go. I'm tired.", r: "Going. Sleep well. I mean it - sleep. And eat something tomorrow.", m: 0 },
        { tone: 'passive', t: "Just hold me, then.", r: "Gladly. Come here. This is just as good. Better, some nights." },
        { tone: 'flirty', t: "Ask me again in an hour.", r: "I'll ask in an hour. I'll set an alarm. I'm very punctual." },
      ] },
      { tone: 'passive', t: "Okay. Slow.", r: "Good. ...You're already rushing. I can tell. Breathe. I'll tell you when.", opts: [
        { tone: 'cold', t: "I'm not in the mood for orders.", r: "Fair. No orders. Just me, asking. Want to just talk instead? I'm fine with that." },
        { tone: 'passive', t: "I trust you.", r: "I know. That's the best thing you've ever given me. I'll look after it." },
        { tone: 'flirty', t: "Tell me when.", r: "Not yet. ...Not yet. ...Now." },
        { tone: 'risque', t: "I'm not very patient.", r: "I know. That's why it's so much fun. Lights off. You'll learn." },
      ] },
      { tone: 'flirty', t: "Convince me.", r: "I never convince anyone. I just wait until you want to. ...You want to. I can tell.", opts: [
        { tone: 'cold', t: "Actually, let's just sleep.", r: "Then we sleep. No sulking. Well - one small sulk. Then sleep." },
        { tone: 'passive', t: "Okay. You win. Tonight.", r: "I always win. Tonight you win too. Funny, that." },
        { tone: 'flirty', t: "I want to. Very much.", r: "Good. Say it again. Slower. ...Good." },
        { tone: 'risque', t: "Then stop talking and take me to bed.", r: "Finally, a good order. I'll allow it. Once. Come on." },
      ] },
    ],
  },
  {
    id: 'dominant-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: ["Come here. Closer. Closer than that. ...There. I've been thinking about this all week. I set the pace tonight.", "You. Here. Now. I've been patient all day, and I'm finished being patient."],
    opts: [
      { tone: 'cold', t: "Wait - not like this.", r: "...Of course. Tell me how you want it, or tell me to stop. Either's fine. I mean that.", m: 0, opts: [
        { tone: 'cold', t: "Let's stop for tonight.", r: "Stopped. Come and lie down with me instead. That's all. That's plenty.", m: 0 },
        { tone: 'passive', t: "Slower. Just slower.", r: "Slower. I can do slower. I'm very good at slower. You'll see." },
        { tone: 'flirty', t: "Like this, instead.", r: "...Oh. I see. You're setting the pace now? Fine. For a minute. Then it's mine again." },
      ] },
      { tone: 'passive', t: "I've been thinking about it too.", r: "Good. Then we're agreed. Agreed things happen fast. Well - this one happens slowly.", opts: [
        { tone: 'cold', t: "But let's just talk first.", r: "Talk, then. I'll be distracted. You'll have to forgive me." },
        { tone: 'passive', t: "What were you thinking about?", r: "You. Here. This exact spot. Me deciding everything. You letting me." },
        { tone: 'flirty', t: "Show me what you were thinking.", r: "I intend to. All of it. In order. I made a list." },
        { tone: 'risque', t: "Then stop being patient.", r: "Done. Patience over. Come here. Lights, off. Phone, away. You, here." },
      ] },
      { tone: 'flirty', t: "Finished being patient? Prove it.", r: "Gladly. Coat off. Phone down. Here. ...Proven.", opts: [
        { tone: 'cold', t: "Okay, slow down.", r: "Slowing down. Right down. You set the brakes, I'll follow. Always." },
        { tone: 'passive', t: "I'm all yours.", r: "I know. I've known for weeks. I just like hearing it right here." },
        { tone: 'flirty', t: "Take what you want.", r: "I'll take my time. That's what I want. All of it." },
        { tone: 'risque', t: "Then don't stop till morning.", r: "Morning's a long way off. Good. I'm in no hurry at all. Come here." },
      ] },
    ],
  },
  {
    id: 'dominant-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: ["You've been far away. I can't control your car or your silences. I watch every lap scared. Give me something warm.", "Cold with me before a race? Don't. I can't control that car and I watch anyway. Give me something warm to hold on to."],
    opts: [
      { tone: 'cold', t: "I can't fix your fear.", r: "I'm not asking you to fix it. I'm asking you not to go cold on top of it. That's all.", opts: [
        { tone: 'cold', t: "I need to focus, not comfort you.", r: "...That's fair. It stings, but it's fair. Focus. I'll handle my own fear. I always have." },
        { tone: 'passive', t: "I'm sorry. I didn't think.", r: "I know. You're in your head before a race. Just - let me in there with you. A bit." },
        { tone: 'flirty', t: "Come here. I'll hold you, then.", r: "That's better. That's the thing that helps. You knew that." },
      ] },
      { tone: 'passive', t: "I didn't know it was that hard.", r: "It is. I don't show it. I'm showing it now. That's how much I trust you.", opts: [
        { tone: 'cold', t: "You shouldn't watch, then.", r: "I'll always watch. Don't ever ask me not to. That's the one thing I won't do for you." },
        { tone: 'passive', t: "What can I do?", r: "Come back. Every time. Text me the second you're out of the car. That's all." },
        { tone: 'flirty', t: "I'll be careful. For you.", r: "Careful for you. That's the nicest thing anyone's ever promised me." },
      ] },
      { tone: 'flirty', t: "I'll give you something warm.", r: "Good. Do it now. Before I start pretending I'm fine.", opts: [
        { tone: 'cold', t: "Later. I've got to go.", r: "...Later, then. Go. Drive well. I'll be pretending I'm fine until you're back." },
        { tone: 'passive', t: "Here. Hand. Hold on.", r: "There. Better. I could face anything like this. Even Sunday." },
        { tone: 'flirty', t: "I'm yours, scared or not.", r: "...Good. I needed that more than I'll ever admit to anyone else." },
        { tone: 'risque', t: "Something warm, and something to remember me by.", r: "...That was a very good kiss. I'll remember it every single lap." },
      ] },
    ],
  },
  {
    id: 'dominant-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: ["I can run a room, a family, a dinner. I can't run a car at three hundred. I watch every lap anyway. I hate it.", "Can I tell you something? I'm scared when you race. Me. Scared. I can control everything except that. I watch anyway."],
    opts: [
      { tone: 'cold', t: "It's my job. You knew that.", r: "I knew. I'm not asking you to stop. I'd never. I'm telling you what it costs me. So you know.", opts: [
        { tone: 'cold', t: "Then don't watch.", r: "No. I'll always watch. Don't push me away from it. It's mine to carry." },
        { tone: 'passive', t: "I'm sorry it's hard.", r: "Don't be sorry. Be careful. And come home. That's all I ever want after a race." },
        { tone: 'flirty', t: "I'll always come back to you.", r: "Promise me. ...Good. Noted, signed, kept. I hold you to everything." },
      ] },
      { tone: 'passive', t: "I didn't know you got scared.", r: "Nobody does. I don't let anyone see it. You're seeing it. Don't make me regret it.", opts: [
        { tone: 'cold', t: "Everyone gets scared.", r: "I know. I just never have. Not until you. It's very inconvenient." },
        { tone: 'passive', t: "What helps?", r: "Your voice after. Your hand. Food in front of you. Me ordering you to eat it. All of it helps." },
        { tone: 'flirty', t: "You can be scared with me.", r: "...Thank you. I've never had anywhere to put it before. Here, then. With you." },
      ] },
      { tone: 'flirty', t: "I like that you watch.", r: "I'll always watch. Front row, back row, sofa, anywhere. I'm the one you look for.", opts: [
        { tone: 'cold', t: "Don't make it a big thing.", r: "It is a big thing. I'll keep it small for you. But it's big." },
        { tone: 'passive', t: "Where will you be at {track}?", r: "Wherever you can find me fastest. That's always where I'll be." },
        { tone: 'flirty', t: "I'll look for you every lap.", r: "Don't you dare. Eyes forward. I'll do the looking. I'm better at it." },
        { tone: 'risque', t: "Make me forget the next race tonight.", r: "Tonight there's no next race. Just this. Come here and let me be sure of you." },
      ] },
    ],
  },
  {
    id: 'dominant-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: ["Kiss me before you go. Racing days frighten me. I hate admitting that. Come here and make me brave.", "I'll say this once: every time you race I'm terrified, and I watch anyway. Make me brave. Now."],
    opts: [
      { tone: 'cold', t: "Don't be dramatic.", r: "...I'm not being dramatic. I'm being honest. Don't brush it off. That's the one thing I can't take.", opts: [
        { tone: 'cold', t: "I can't deal with this right now.", r: "Then don't. I'll deal with it. I always do. Go. Drive well. Come back." },
        { tone: 'passive', t: "Sorry. Come here.", r: "There. That's it. That's what I needed. You. Close. Before you go." },
        { tone: 'flirty', t: "Then I'll make you brave.", r: "You do. Every time. You don't even know you're doing it." },
      ] },
      { tone: 'passive', t: "I didn't know you were scared.", r: "I'm not. Except about you. You're the only thing I can't put in order.", opts: [
        { tone: 'cold', t: "Don't worry about me.", r: "I'll always worry about you. You don't get a say. Neither do I. It's just true." },
        { tone: 'passive', t: "I'll be careful. I promise.", r: "Good. Promise logged. Then I'll hold you. In that order." },
        { tone: 'flirty', t: "Kiss you for luck, then.", r: "For luck. And for me. And because I asked. All three." },
      ] },
      { tone: 'flirty', t: "Come here, then.", r: "...Better. You're very good at this. Making me brave. Making me soft. Don't tell anyone about either.", opts: [
        { tone: 'cold', t: "That's enough soft for one day.", r: "Fine. Back to bossy. Go. Win. Eat something. Come back." },
        { tone: 'passive', t: "I won't tell anyone.", r: "Good. It's ours. All the soft parts. Nobody else gets them." },
        { tone: 'flirty', t: "I love you soft.", r: "...Don't. You'll undo me before your race. ...I love you too. There. Now go." },
        { tone: 'risque', t: "Make me brave all night.", r: "All night isn't brave. It's greedy. I approve. After the race. Every minute of it." },
      ] },
    ],
  },
  {
    id: 'dominant-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: ["You're cross. I know why. I booked a weekend without asking. That was me deciding for you. I don't want to be that. I'm sorry.", "I overstepped. I booked us away without asking. You went cold, and you were right to. I'm asking now. Yes or no. No is fine."],
    opts: [
      { tone: 'cold', t: "Yes, you overstepped.", r: "I did. I'm owning it. You don't owe me a yes for apologising. Say no and I'll cancel, and mean it.", opts: [
        { tone: 'cold', t: "No. Cancel it.", r: "Done. Cancelled. Thanks for being straight with me. I'd rather that than a yes you resent.", m: -1 },
        { tone: 'passive', t: "Okay. Apology accepted.", r: "Thank you. I'll do better. I'll ask first. Even when it bruises my pride. It will. Gladly." },
        { tone: 'flirty', t: "Ask me nicely and maybe.", r: "Will you come away with me? Please. That's two pleases this year. Both to you." },
      ] },
      { tone: 'passive', t: "I wasn't cross. Just surprised.", r: "Surprised is close enough. I don't want you surprised by your own diary. I want you asked.", opts: [
        { tone: 'cold', t: "I was cross.", r: "Then I'm glad you said so. Stay cross as long as you need. I'll be here, asking first." },
        { tone: 'passive', t: "Where were you taking me?", r: "The coast. Three days. Nothing to do but eat and argue. If you want it." },
        { tone: 'flirty', t: "I'd have said yes anyway.", r: "I know. That's not the point. The point is you get to say it. Say it." },
      ] },
      { tone: 'flirty', t: "You're cute when you apologise.", r: "I don't apologise often. Enjoy it. It's not a hobby. ...I am sorry, though. Really.", opts: [
        { tone: 'cold', t: "I'm still annoyed.", r: "That's allowed. Be annoyed. I'll wait it out. I'm good at waiting, for you." },
        { tone: 'passive', t: "Okay. You're forgiven.", r: "Thank you. I'll take it. And I'll ask. Every time. That's a promise." },
        { tone: 'flirty', t: "Make it up to me.", r: "Gladly. A weekend you agree to. Dinners you choose. And me, asking. A lot." },
      ] },
    ],
  },
  {
    id: 'dominant-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: ["I booked us a whole weekend away. Then I realised I hadn't asked you. That was too much, even for me. So I'm asking now.", "I did a thing. I booked us three days by the sea without asking. I'm told that's controlling. I'm asking now. Properly."],
    opts: [
      { tone: 'cold', t: "You can't just book my life.", r: "You're right. I can't, and I shouldn't. It's cancelled if you want. Your life's yours. I just want a corner of it.", opts: [
        { tone: 'cold', t: "Cancel it. Please.", r: "Cancelled. No guilt. My mistake, not yours. I'll ask first next time. Every time.", m: -1 },
        { tone: 'passive', t: "It's okay. Just ask next time.", r: "I will. Every time. I'm learning. It's slow. You're worth the slow." },
        { tone: 'flirty', t: "I'll give you more than a corner.", r: "...Then I'll guard it with everything I've got. Every day." },
      ] },
      { tone: 'passive', t: "Where are we going?", r: "The coast. A house with a terrible kitchen and a perfect view. But if the dates are wrong, we move them. You decide.", opts: [
        { tone: 'cold', t: "The dates are wrong.", r: "Then they're wrong. We'll find others. Or we won't. You're not wrong for saying so." },
        { tone: 'passive', t: "I'd love to go.", r: "Good. Then it's a yes, and it's your yes. That's the only kind I want." },
        { tone: 'flirty', t: "You'll cook in the terrible kitchen?", r: "I'll cook, you'll eat, the kitchen will suffer. That's the plan. I make good plans." },
      ] },
      { tone: 'flirty', t: "I like it when you plan things.", r: "I know. But planning and deciding for you are different. I want the first. Never the second.", opts: [
        { tone: 'cold', t: "Then stop deciding for me.", r: "I will. I'm trying. Tell me every time I slip. I'll listen. Even if I sulk." },
        { tone: 'passive', t: "Okay. Yes. I'll go.", r: "Good. You said yes. I didn't take it. That's the only yes worth having." },
        { tone: 'flirty', t: "Plan everything. Just ask me first.", r: "Deal. I plan. You approve. Then I get very smug. The perfect system." },
        { tone: 'risque', t: "Plan the nights. I'll handle the mornings.", r: "...Bold. Fine. The nights are mine. The mornings are yours. You'll need to be well rested." },
      ] },
    ],
  },
  {
    id: 'dominant-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: ["Confession: I booked us a weekend away. Without asking. I know. I know. I'm asking now. Will you come?", "I've been bad. I booked us three days at the coast before checking with you. Very bad of me. Say yes anyway?"],
    opts: [
      { tone: 'cold', t: "I hate it when you do that.", r: "I know. I'm sorry. Genuinely. I'll cancel if you want. I won't sulk. I'll sulk a tiny bit.", opts: [
        { tone: 'cold', t: "Cancel it, please.", r: "Cancelled. Sorry, love. Lesson learned - your diary, your say.", m: -1 },
        { tone: 'passive', t: "Fine. But ask next time.", r: "Next time I ask. Promise. You can hold that over me forever." },
        { tone: 'flirty', t: "You're lucky you're cute.", r: "I'm very lucky. And very sorry. And very packed already. Kidding. Mostly." },
      ] },
      { tone: 'passive', t: "Where to?", r: "The coast. A cottage. A fire. No phones. If you say yes. Only if.", opts: [
        { tone: 'cold', t: "I can't that weekend.", r: "Then we move it. Or drop it. No sulking. Your diary, your call." },
        { tone: 'passive', t: "Yes. That sounds perfect.", r: "Good. You said yes. I'll stop being smug in about a week." },
        { tone: 'flirty', t: "A fire and no phones? Dangerous.", r: "Very. Just you and me and nowhere to be. I'll be in charge of the fire. You'll be in charge of nothing." },
      ] },
      { tone: 'flirty', t: "I'll come. But you owe me.", r: "I always owe you. I like owing you. It means I get to pay you back.", opts: [
        { tone: 'cold', t: "Actually, you owe me a lot.", r: "I do. I'll pay it. In time, in dinners, in asking first. Starting now." },
        { tone: 'passive', t: "What will you pay me in?", r: "Breakfast in bed. Long walks. Me, apologising slowly. Very slowly." },
        { tone: 'flirty', t: "Pay me back all weekend.", r: "That's the plan. Every hour. With interest." },
        { tone: 'risque', t: "Pay me back in the cottage. With the door shut.", r: "Ha. Bold. Yes. The door, the fire, and you. I'll be very thorough with my apology." },
      ] },
    ],
  },
  {
    id: 'dominant-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: ["You've been distant, and it scared me into thinking. I want a future with you. I'm not demanding one. I'm asking if you want it too.", "I hate the distance. So I'll say the big thing: I want years with you. Not weeks. If you don't want that, tell me. I'll hear it."],
    opts: [
      { tone: 'cold', t: "I don't know what I want.", r: "That's honest. I'll take honest. I'll wait while you work it out. I'm staying right here.", opts: [
        { tone: 'cold', t: "Maybe I don't want years.", r: "...Then I'd rather know now. Thank you for saying it. It hurts. It's still better than guessing.", m: -1 },
        { tone: 'passive', t: "I want this. I'm just scared.", r: "So am I. Terrified. Let's be scared together. That's much better than separately." },
        { tone: 'flirty', t: "I want years. With you.", r: "...Good. Good. Then we're done being distant. Come here." },
      ] },
      { tone: 'passive', t: "I'm sorry. I want it too.", r: "Then say it again. Not for me. So you hear it too.", opts: [
        { tone: 'cold', t: "Don't pressure me.", r: "I won't. No pressure. I said it, you heard it. The rest is yours. I'll wait." },
        { tone: 'passive', t: "Then yes. A future. Ours.", r: "There. Now we've both said it. That's the hardest bit done. The rest is details. I'm good at details." },
        { tone: 'flirty', t: "Years and years.", r: "And years. I'll plan them. You'll veto half. We'll argue. It'll be perfect." },
      ] },
      { tone: 'flirty', t: "I want years with you too.", r: "Then you have them. Every one. I'll be relentless about it.", opts: [
        { tone: 'cold', t: "Let's take it a day at a time.", r: "A day at a time. Fine. I'll be relentless about every day, then." },
        { tone: 'passive', t: "So what now?", r: "Now I stop being scared and start being smug. You can watch. It'll be insufferable." },
        { tone: 'flirty', t: "Then plan them. Every one.", r: "Already started. Year one: you, me, and a table facing the door. You'll love it." },
      ] },
    ],
  },
  {
    id: 'dominant-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: ["I've made a plan. Five years. You're in every part of it. You get a vote. The deciding one, obviously.", "I've been thinking about the future. Ours. I've drafted something. Five years. You're in all of it. You decide if it stays."],
    opts: [
      { tone: 'cold', t: "Five years is a long time.", r: "It is. That's why I'm asking, not telling. If it's too much, we tear it up and write a shorter one. Together.", opts: [
        { tone: 'cold', t: "I'm not ready to plan that far.", r: "Then we don't. Not yet. I'll keep the plan in a drawer. You'll know where it is.", m: -1 },
        { tone: 'passive', t: "Tell me what's in it.", r: "A house with a garden. For the cat. A table where I can see the door. You winning things. Me watching." },
        { tone: 'flirty', t: "Write me in for longer.", r: "...Longer. All right. I'll need a bigger notebook. I'll buy one tomorrow." },
      ] },
      { tone: 'passive', t: "What's in it?", r: "You racing as long as you want. Me in the garage or on the sofa, your call. A house. A cat. Sundays with my grandmother. You.", opts: [
        { tone: 'cold', t: "It sounds a bit settled.", r: "Settled? Never. There'll be arguments. Bets. Breakfast debts. You'll never be bored. I'll see to it." },
        { tone: 'passive', t: "It sounds perfect.", r: "It's not perfect. It's ours. Perfect is boring. Ours is better." },
        { tone: 'flirty', t: "Add a dog.", r: "...A dog. The cat will be furious. Fine. A dog. You'll walk it. I'll command it. It'll ignore me." },
      ] },
      { tone: 'flirty', t: "I'm in. All five years.", r: "Good. That's the deciding vote. Motion carried. I've never been happier to win.", opts: [
        { tone: 'cold', t: "Let's not jinx it.", r: "I don't believe in jinxes. I believe in plans. But fine - quietly. Our secret." },
        { tone: 'passive', t: "Just promise you'll keep asking me.", r: "Every year. Every decision. I'll ask. You'll answer. That's how we'll work." },
        { tone: 'flirty', t: "All five years, and then more.", r: "...More. Yes. I'll need a longer plan. I'll start tonight. You're in every page." },
        { tone: 'risque', t: "Start the plan tonight. At yours.", r: "Page one: you, at mine, tonight. I wrote that one first. Come on." },
      ] },
    ],
  },
  {
    id: 'dominant-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: ["I've drawn up a five-year plan. Don't laugh. You're in every line of it. I'd like your signature. And a kiss.", "Five years. I've planned them. You, me, a house, a cat who rules us both. Sign at the bottom. Or don't."],
    opts: [
      { tone: 'cold', t: "Five years? You're mad.", r: "Mad and organised. A dangerous combination. Tear it up if you want. I'll write another. With you this time.", opts: [
        { tone: 'cold', t: "Tear it up.", r: "...Torn. Fine. We'll do it day by day. I'm still not going anywhere.", m: -1 },
        { tone: 'passive', t: "Okay. Read me the first line.", r: "'Year one: we share a front door, and I stop pretending I don't want that.' ...Too much? It's the plan." },
        { tone: 'flirty', t: "Mad suits you.", r: "Everything suits me. You especially. Sign here." },
      ] },
      { tone: 'passive', t: "Read me the plan.", r: "Year one: you, me, one house. Year two: a dog, the cat objects. Year three: you win the title. I gloat.", opts: [
        { tone: 'cold', t: "That's a lot of planning.", r: "It's a lot. I'm a lot. You knew. You can veto any line. All of them, if you want." },
        { tone: 'passive', t: "I like year three.", r: "So do I. I wrote it in pen. Years one and two are pencil. You choose." },
        { tone: 'flirty', t: "What about year five?", r: "Year five is a surprise. You'll find out when we get there. You'll say yes." },
      ] },
      { tone: 'flirty', t: "I'll sign. Where?", r: "Here. ...And here. And this is the kiss part. ...Signed. Sealed. Mine. Yours.", opts: [
        { tone: 'cold', t: "Let me read it first.", r: "Read every word. Take a week. Take a month. It's a plan, not a trap." },
        { tone: 'passive', t: "Signed. Happily.", r: "Happily. That's the word I wanted. Unanimous. Wonderful." },
        { tone: 'flirty', t: "Signed, and sealed with a kiss.", r: "...Done. Five years, starting now. I've never won anything better." },
        { tone: 'risque', t: "Seal it properly. Tonight.", r: "Properly. Tonight. My place. Bring nothing. You won't need it. Come here." },
      ] },
    ],
  },
];
