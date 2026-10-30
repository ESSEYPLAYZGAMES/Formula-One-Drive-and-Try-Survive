// RUDE - in person, stage 'close': dating. Sparring is just how they talk now; flirting lands; risque gets the same
// sarcastic edge straight back. Slots: 1 the rules, 2 score inflation / the joke tally, 3 'observant and annoyed',
// 4 a bad day, 'it's cold', 5 the cat defects, 6 your place or mine, 7 a kind thing then an insult, 8 a key, a rainy
// holiday, 9 'don't make me say it' (end of the chapter).
export const DATA = [
  // ---- slot 1: the rules -------------------------------------------------------------------------------------------
  { id: 'rude-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "Ground rules, since you were frosty last time: no public affection. None. Private affection is negotiable. Negotiations open now.",
    opts: [
      { tone: 'cold', t: "Fine. I wasn't planning on affection anyway.", r: "Good. Neither was I. ...I was a bit. Privately. That's what negotiations are for. You're terrible at them.", opts: [
        { tone: 'cold', t: "Then don't negotiate.", r: "I'll negotiate if I want. I'm excellent at it. You'll lose. You'll enjoy losing. That's the trick." },
        { tone: 'passive', t: "What are the terms?", r: "One hand-hold per evening. Indoors. No witnesses. The cat doesn't count. She sees everything anyway." },
        { tone: 'flirty', t: "Privately, I'm very affectionate.", r: "Are you. Hm. That's useful information. I'll file it under 'later'. Later's soon." },
        { tone: 'risque', t: "Let's negotiate somewhere private. Now.", r: "Oh, now you're talking. Bold. I like bold now. Fine. My place. Bring your terms. I'll bring mine." },
      ] },
      { tone: 'passive', t: "Okay. No public affection. Got it.", r: "Got it. Wow. You agreed in one second. Don't you want to fight for public affection? A bit?", opts: [
        { tone: 'cold', t: "Not really. Your rules.", r: "My rules. Yes. ...You could break one. Small one. Not that I'm suggesting. I'm suggesting." },
        { tone: 'passive', t: "I'll follow the rules.", r: "Following the rules. Like a learner driver. Fine. Rules are rules. Boring rules. My rules." },
        { tone: 'flirty', t: "Okay. One small public thing. A wink.", r: "A wink. In public. Disgusting. ...Allowed. Once. Make it a good one. You can't wink. Practise." },
      ] },
      { tone: 'flirty', t: "And what does private look like?", r: "You on my sofa, me pretending to watch my soap, and my cat judging us both.", opts: [
        { tone: 'cold', t: "Sounds crowded.", r: "It is crowded. The cat takes up most of the sofa. You'll have to sit close. Tragic. For you." },
        { tone: 'passive', t: "That sounds nice, actually.", r: "Nice. It's not nice. It's a strategic arrangement. ...It's nice. Don't tell the cat." },
        { tone: 'flirty', t: "Pretending to watch? What would you be doing?", r: "Looking at you, obviously. Badly hiding it. Like you do in public. We're both terrible." },
        { tone: 'risque', t: "And after the soap ends?", r: "After the soap the cat leaves the room. She knows. She's discreet. More discreet than you." },
      ] },
    ] },
  { id: 'rude-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "So we're together. Officially. Ugh. Rules: no holding hands in public. No pet names. No matching anything. Agreed?",
    opts: [
      { tone: 'cold', t: "No pet names. Thank god.", r: "Exactly. Call me 'babe' and I'll leave the country. Fine. One pet name. An insult. I'll pick it.", opts: [
        { tone: 'cold', t: "I'll pick yours. 'Menace'.", r: "Menace. Oh. That's perfect. I love it. I mean... it's acceptable. Menace. Yes." },
        { tone: 'passive', t: "What would you call me?", r: "'Trouble'. Or 'my problem'. 'My problem' is good. You're my problem now. Officially." },
        { tone: 'flirty', t: "Call me anything. I'll like it.", r: "You'd like 'pothole'. That's how gone you are. ...I'd call you something nice. Privately. Once." },
        { tone: 'risque', t: "Save the pet names for behind closed doors.", r: "Behind closed doors. Bold. I'll have a whole list for behind closed doors. Mostly insults. Mostly." },
      ] },
      { tone: 'passive', t: "Agreed. Whatever you want.", r: "Whatever I want. Again. One day I'll want something big and you'll regret saying that.", opts: [
        { tone: 'cold', t: "I'll take that risk.", r: "You'll take every risk. That's your job. I'm a risk now. Congratulations. You signed up for me." },
        { tone: 'passive', t: "What would you want?", r: "Things. Holidays. Your other hoodie. A key. Not yet. One day. Forget I listed them." },
        { tone: 'flirty', t: "Want something big. I'll say yes.", r: "You'll say yes to anything. That's not romantic, it's reckless. ...It's a bit romantic." },
      ] },
      { tone: 'flirty', t: "Matching anything? Not even socks?", r: "Especially socks. Socks are the gateway. First socks, then mugs, then a joint holiday card. No.", opts: [
        { tone: 'cold', t: "Good. Matching is tragic.", r: "Tragic. Exactly. We agree on things. That's terrifying. That's how it starts." },
        { tone: 'passive', t: "Okay. No socks. No mugs.", r: "No mugs. ...One mug. Each. Similar. Not matching. Adjacent. Fine." },
        { tone: 'flirty', t: "I'll buy matching socks anyway. Out of spite.", r: "Spite again. You know my weakness. Fine. Socks. I'll hide mine. In my sock drawer. With yours." },
        { tone: 'risque', t: "Then let's not wear anything that matches. Or much at all.", r: "Bold. Very bold. Okay. That one's allowed. Privately. Very allowed. Shut up, I'm blushing." },
      ] },
    ] },
  { id: 'rude-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "We're official, and you're already looking at me like that in public. Rule one: not in public. Rule two: see rule one.",
    opts: [
      { tone: 'cold', t: "I wasn't looking at you.", r: "You were. You looked at me like I was dessert. In public. Rule one is already in trouble.", opts: [
        { tone: 'cold', t: "Rule one can take it.", r: "Rule one is fragile. I wrote it in a hurry. ...Fine. Rule one has exceptions. You're them." },
        { tone: 'passive', t: "Okay. I'll look elsewhere.", r: "Don't look elsewhere. Elsewhere's full of people. Look... nearby. Less obviously." },
        { tone: 'flirty', t: "You're the best dessert here.", r: "I'm the only dessert here. I'm also the main course. Ha. Okay. That was mine. It was good." },
        { tone: 'risque', t: "Then let's skip to the private bit.", r: "Bold. Fine. Yes. Ten minutes. Let me be rude to someone first. It calms me down." },
      ] },
      { tone: 'passive', t: "Okay, okay. Not in public.", r: "Thank you. Respect for the rules. ...You agreed fast again. Do you not want to look at me?", opts: [
        { tone: 'cold', t: "Pick one. Look or don't.", r: "I never make up my mind. I make up other people's. Fine. Look. Subtly. You can't do subtle." },
        { tone: 'passive', t: "I just want you comfortable.", r: "Comfortable. Ugh. You're sweet. Stop being sweet. People are watching. Be sweet later." },
        { tone: 'flirty', t: "I want to look at you always. Public or not.", r: "Always. Huge word. ...Fine. Always. Not in public. Always, privately. That's the deal." },
      ] },
      { tone: 'flirty', t: "Rule two is terrible. Rewrite it.", r: "Fine. Rule two: you can look. Rule three: I can pretend not to notice. Everybody wins.", opts: [
        { tone: 'cold', t: "That's a rubbish rulebook.", r: "It's an excellent rulebook. You'll obey it. You'll break it. I'll pretend to be cross. Same thing." },
        { tone: 'passive', t: "Okay. I can live with that.", r: "You can live with that. Wow. Settling. Fine. Live with it. With me. Not like that. Yet." },
        { tone: 'flirty', t: "Rule four: you look back.", r: "Rule four is approved. Begrudgingly. I'll look back. Only when you're not looking. Unfair." },
        { tone: 'risque', t: "Rule five: we go home early.", r: "Rule five passes unanimously. Me and the cat. She votes for whatever gets me out of here." },
      ] },
    ] },

  // ---- slot 2: score inflation; the joke tally ----------------------------------------------------------------------
  { id: 'rude-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "You were difficult last time. Still. You've climbed to an eight. On my scale out of ten. It's inflation. Don't worry about it.",
    opts: [
      { tone: 'cold', t: "An eight. Your standards are slipping.", r: "My standards are fine. You've been annoyingly good. Also, my tally of your terrible jokes is at forty-one.", opts: [
        { tone: 'cold', t: "Forty-one jokes. I'm prolific.", r: "Prolific. Like weeds. Like a virus. Fine. Prolific. I've kept every one. In a book. Don't ask." },
        { tone: 'passive', t: "Forty-one? You've counted them all?", r: "Every one. The tyre one's still the worst. It's framed in my brain. Next to you." },
        { tone: 'flirty', t: "You keep the tally because you love my jokes.", r: "I keep it as evidence. For the trial. ...Fine. I read it when I miss you. Shut up. That's the trial." },
        { tone: 'risque', t: "What does a nine take?", r: "A nine? I'll show you. Later. It involves you not talking. For once. Ha." },
      ] },
      { tone: 'passive', t: "An eight. Thanks.", r: "'Thanks.' That's it? People would sell their cars for an eight. React. With something.", opts: [
        { tone: 'cold', t: "Fine. Hooray.", r: "'Hooray.' Said like a parking fine. Fine. That's my style. You've caught it. It's contagious." },
        { tone: 'passive', t: "What were the old scores?", r: "You started at a four. Or a three. I don't remember. I do remember. It was a four." },
        { tone: 'flirty', t: "I'll show you how happy I am later.", r: "Later. Yes. Show me. I'll rate the showing. ...It'll be a nine. Don't tell yourself that." },
      ] },
      { tone: 'flirty', t: "Inflation. So I'm worth more now.", r: "You're worth exactly the same. You just cost more. In patience. In snacks. In my sanity.", opts: [
        { tone: 'cold', t: "You never had sanity.", r: "Correct. I had dignity. You took it. I let you. That's worse. Eight. Holding." },
        { tone: 'passive', t: "Okay. I'll stop costing so much.", r: "Don't. I like expensive. It means I chose it. ...That's a horrible sentence. Keep it." },
        { tone: 'flirty', t: "Worth every snack.", r: "Every snack. Even the ones you eat off my plate. Which is all of them. Eight. Bordering on nine." },
        { tone: 'risque', t: "Let me earn the ninth point tonight.", r: "Tonight. Bold. You think a point is that easy? ...It's quite easy. Don't tell anyone how easy." },
      ] },
    ] },
  { id: 'rude-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Update: you're an eight. Out of ten. I rate everything, I may have mentioned. It's inflation. The whole economy's a mess.",
    opts: [
      { tone: 'cold', t: "Inflation. Sure. Admit you like me.", r: "I like you at an eight. That's the most I like anyone. The cat's a seven. Don't tell her.", opts: [
        { tone: 'cold', t: "The cat deserves a nine.", r: "The cat bit my sister. She's capped at seven. Ha. Okay. You're right. She's an eight too. Ugh." },
        { tone: 'passive', t: "Do you score my jokes too?", r: "I keep a tally of the bad ones. Forty-three. The tyre one counts double. It's a crime against tyres." },
        { tone: 'flirty', t: "I like you at a ten.", r: "Tens don't exist. ...Okay, they exist. Once. In my head. Briefly. Don't push it." },
        { tone: 'risque', t: "Show me what an eight gets.", r: "An eight gets my attention. A nine gets the door locked. You're an eight. Work for it." },
      ] },
      { tone: 'passive', t: "I'll try to keep it up.", r: "Try. You always try. It's very tiring to watch. Like a puppy on stairs. Eight, though.", opts: [
        { tone: 'cold', t: "You love watching.", r: "I tolerate watching. Fine. I love watching. Ha. You got me. You've had a lot of practice." },
        { tone: 'passive', t: "What would knock it down?", r: "Fist pumps. Bad jokes. Saying 'nice'. You do all three. It's an eight anyway. Inexplicable." },
        { tone: 'flirty', t: "What's my bad-joke count at, while we're at it?", r: "Forty-four. Fifty by spring. I'm planning a ceremony. There's a cake. It's terrible." },
      ] },
      { tone: 'flirty', t: "An eight. And what are you, then?", r: "A nine. Obviously. I'm the scorer, I'm allowed to be a nine. You'll get there. Never.", opts: [
        { tone: 'cold', t: "You're a six. Generously.", r: "A six! Oh, that's cruel. That's lovely. Say it again. Nobody's ever been properly rude back to me." },
        { tone: 'passive', t: "Okay. A nine. Fair.", r: "Fair. You agreed again. You'd agree I'm a fifteen. That's sweet. It's also spineless. Eight." },
        { tone: 'flirty', t: "You're a ten. To me.", r: "Don't. Don't say ten. Ten's a big number. ...Repeat it. Quietly. Then never again." },
        { tone: 'risque', t: "Prove you're a nine. Tonight.", r: "Oh, bold. I always prove things. With data. And a closed door. Fine. Tonight. Bring a pen." },
      ] },
    ] },
  { id: 'rude-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "You've been flirting so much your score's gone up to an eight. Out of ten. Not a compliment. Inflation.",
    opts: [
      { tone: 'cold', t: "I flirt because you're easy to wind up.", r: "I'm not easy. I'm a fortress. You're just very good at sieges. Eight.", opts: [
        { tone: 'cold', t: "Fortresses fall.", r: "Mine didn't fall. It opened a small window. For you. And a cat flap. For the cat." },
        { tone: 'passive', t: "Are you still counting my bad jokes?", r: "Forty-two on the tally. You told three last week. I wrote them down in the dark. Don't ask why I was awake." },
        { tone: 'flirty', t: "Keep the window open.", r: "The window stays open. Draughty. Annoying. Mine. ...Ours. Don't say anything." },
        { tone: 'risque', t: "I'd rather climb through the window.", r: "Bold. Very you. Climb through it, then. Mind the cat. She's guarding it. She's on your side now." },
      ] },
      { tone: 'passive', t: "Not a compliment. Okay.", r: "Okay? Okay?! I gave you inflation and you said okay. Fight me. Ask for a nine.", opts: [
        { tone: 'cold', t: "I don't beg for points.", r: "You don't beg. That's why you're an eight. Ha. The pride. The spine. Excellent." },
        { tone: 'passive', t: "Okay. Can I have a nine?", r: "No. Asking is minus one. Seven. Kidding. Eight. You'll always be an eight. Maybe a nine." },
        { tone: 'flirty', t: "I don't need a nine. I've got you.", r: "You can't say things like that. Not out loud. Nine. Fine. It's a nine. For one minute." },
      ] },
      { tone: 'flirty', t: "Inflation or not, I'll take it. And you.", r: "You can't 'take me'. I'm not a parcel. ...I'm a bit of a parcel. Fragile. Handle with sarcasm.", opts: [
        { tone: 'cold', t: "You're more of a brick.", r: "A brick! Okay. A brick with a soft centre. Like a truffle. I'm a truffle. That was good." },
        { tone: 'passive', t: "Okay. Handle with care.", r: "With sarcasm. Not care. Care makes me nervous. Sarcasm is how I know you mean it." },
        { tone: 'flirty', t: "I'll handle you very carefully.", r: "Very carefully. Hm. That's a nice voice. Use it more. Not in public. Rule one." },
        { tone: 'risque', t: "Fragile parcel. I'll unwrap you slowly.", r: "Bold. Wow. I'm going to pretend that was a joke. It's going in the good book. There's a good book now." },
      ] },
    ] },

  // ---- slot 3: not jealous, observant and annoyed -------------------------------------------------------------------
  { id: 'rude-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "That person was hanging off your arm for ten minutes. I'm not jealous. I'm observant and annoyed. There's a difference.",
    opts: [
      { tone: 'cold', t: "Observant and annoyed. That's jealous.", r: "It's not. Jealous is weak. I'm strong. I'm strongly annoyed. With good eyesight.", opts: [
        { tone: 'cold', t: "Strongly jealous, then.", r: "Ugh. Fine. A bit. Point five percent. Don't enjoy it. You're enjoying it." },
        { tone: 'passive', t: "They're just a sponsor's guest.", r: "A sponsor's guest who touched your arm four times. Sponsors are getting very hands-on." },
        { tone: 'flirty', t: "You're cute jealous.", r: "I'm not cute anything. ...I'm a bit cute jealous. Fine. Come here. Stand next to me. Away from them." },
        { tone: 'risque', t: "Take me home and remind me who I'm with.", r: "Bold. Very bold. I don't need reminding. You do. Fine. Home. I'll remind you. Thoroughly." },
      ] },
      { tone: 'passive', t: "They're harmless. Honestly.", r: "Harmless people don't touch your arm like it's a doorknob. Four times. I counted. I'm a counter.", opts: [
        { tone: 'cold', t: "Count something else.", r: "I count everything. Tyres. Jokes. Hands on your arm. All bad numbers. Fine. Your point." },
        { tone: 'passive', t: "I'll keep my distance from them.", r: "You don't have to. I'll do the distancing. With my eyes. Very hard. Like lasers." },
        { tone: 'flirty', t: "Only one person's allowed on my arm.", r: "Correct. Me. I'll stand there. Arms folded. On your arm. Folded. It's possible. I'll show you." },
      ] },
      { tone: 'flirty', t: "Want me to prove I'm yours?", r: "Prove it? Here? Rule one. ...How would you prove it. Hypothetically. Quietly.", opts: [
        { tone: 'cold', t: "Never mind. You'd hate it.", r: "I'd hate it with my whole heart. Do it anyway. Ugh. No. Rule one. Later. Prove it later." },
        { tone: 'passive', t: "I'd just leave with you. Now.", r: "Leave? Now? With me? ...Yes. That's proof. That's very good proof. Get your jacket." },
        { tone: 'flirty', t: "A kiss. Right here. In front of them.", r: "Rule one. ...Rule one has a jealousy exception. I just wrote it. Quickly. Go on." },
        { tone: 'risque', t: "Somewhere private. I'll prove it all night.", r: "All night. Bold. That's a lot of proving. I'll need a lot of convincing. Start convincing." },
      ] },
    ] },
  { id: 'rude-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "I saw that. The one who laughed at everything you said. Including 'hello'. I'm not jealous. I'm annoyed. Professionally.",
    opts: [
      { tone: 'cold', t: "They laughed at my jokes. Unlike you.", r: "Anyone who laughs at your jokes is lying or lost. I don't lie. I'm not lost. I'm here. Annoyed.", opts: [
        { tone: 'cold', t: "Maybe I'll go and find them.", r: "Go on. I'll watch. I'll narrate. Loudly. ...Don't go. That wasn't a dare. Stay." },
        { tone: 'passive', t: "You know I only care what you think.", r: "I know. I just like hearing it. Say it again but less sincerely. Sincere makes me itchy." },
        { tone: 'flirty', t: "You can laugh at them in private.", r: "I do. Constantly. I hide it in a cough. You've heard the cough. That's laughing." },
        { tone: 'risque', t: "Let me make you laugh somewhere quiet.", r: "Somewhere quiet. Bold. You won't make me laugh. You'll make me something. Not laugh. Fine. Go." },
      ] },
      { tone: 'passive', t: "Professionally annoyed. Okay.", r: "Okay? Your partner is jealous and your response is 'okay'? Fight for me a bit. Reassure me rudely.", opts: [
        { tone: 'cold', t: "Fine. They were dull. You're not.", r: "Rudely reassured. Perfect. That's exactly the format I wanted. You've learned. I'm proud." },
        { tone: 'passive', t: "I'm with you. That's it.", r: "That's it? ...That's actually it. That's enough. Fine. You're right. Don't do the 'okay' thing again." },
        { tone: 'flirty', t: "You're the only one I see.", r: "You need glasses, then. There's a whole room. ...But fine. Only me. That's the correct prescription." },
      ] },
      { tone: 'flirty', t: "Annoyed for me. That's love.", r: "It's not love. It's possession. Like a cat with a toy. A toy who wanders off. You wandered.", opts: [
        { tone: 'cold', t: "I'm not a toy.", r: "No. You're worse. You're my problem. Problems don't wander. Get back here. Rudely." },
        { tone: 'passive', t: "I didn't wander. They came over.", r: "They came over. You didn't leave. That's wandering in place. I've seen it in documentaries." },
        { tone: 'flirty', t: "Your toy. I'll stay put.", r: "Good. Stay put. Next to me. Shoulders touching. That's not affection. That's preventative." },
        { tone: 'risque', t: "Take me home and keep me there.", r: "Keep you there. Bold. I'll lock the door and lose the key. The cat can deliver meals." },
      ] },
    ] },
  { id: 'rude-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "You've been flirting with me all week, so explain the person who was clinging to you just now. Not jealous. Curious. Loudly.",
    opts: [
      { tone: 'cold', t: "Curious. Sure. You're jealous.", r: "I'm not jealous. I'm vigilant. Like a lifeguard. You were drowning in admiration. I was watching.", opts: [
        { tone: 'cold', t: "Lifeguard. More like a bouncer.", r: "A bouncer! Better. I'd throw them out. I'd throw you out. I'd let you back in. Only you." },
        { tone: 'passive', t: "They were only being friendly.", r: "Friendly. Very. Holding your arm is friendly. I'll be friendly to them next. With my words." },
        { tone: 'flirty', t: "I like you vigilant.", r: "You like everything I do. It's tiring. ...It's not tiring. Keep liking it. Fine." },
        { tone: 'risque', t: "Then rescue me. Somewhere private.", r: "A rescue. Bold. Fine. I'll rescue you. You'll owe me. You'll pay tonight." },
      ] },
      { tone: 'passive', t: "Just a fan. You know I'm yours.", r: "I know you're mine. I wanted to hear you say it. In front of the fan. Too late. Say it now.", opts: [
        { tone: 'cold', t: "I'm not saying it twice.", r: "You've said it once. Once is enough. Once is a contract. It's signed. You're mine." },
        { tone: 'passive', t: "I'm yours. Happy?", r: "Happy. That word again. Yes. Fine. Happy. Look at that. You've broken me. Well done." },
        { tone: 'flirty', t: "Yours. Completely. Out loud.", r: "Out loud. In public. Rule one. ...Rule one is suspended. Indefinitely. Say it again." },
      ] },
      { tone: 'flirty', t: "I'll only cling to you from now on.", r: "Cling to me. Like a burr. Like a wet sock. ...That's not romantic but I'm into it. Ugh.", opts: [
        { tone: 'cold', t: "Wet sock. That's disgusting.", r: "You're disgusting. We're a pair of disgusting. Cling. Go on. I'm allowing it. For tonight." },
        { tone: 'passive', t: "Okay. Clinging. Gently.", r: "Clinging gently. Like a cat on a jumper. Fine. That's acceptable clinging." },
        { tone: 'flirty', t: "Clinging and never letting go.", r: "Never letting go. Big. Huge. ...Okay. Don't. Don't let go. I won't say it again. Don't." },
        { tone: 'risque', t: "I'll cling to you all night.", r: "All night. Bold. The cat will be scandalised. Good. She needs a scandal. So do I." },
      ] },
    ] },

  // ---- slot 4: a bad day; your hand, because it's cold ----------------------------------------------------------------
  { id: 'rude-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "Give me your hand. Because it's cold. That's the only reason. You had a bad day and you're being frosty. I know. Hand.",
    opts: [
      { tone: 'cold', t: "I'm fine. I don't need hand-holding.", r: "Nobody needs it. It's cold. I'm being practical. Give it. ...There. Practical. Now tell me.", opts: [
        { tone: 'cold', t: "The car was a disaster. That's all.", r: "The car's a disaster. You're not. ...Fine, I'll say it for you. You're not a disaster. Mostly." },
        { tone: 'passive', t: "Thanks. That helps.", r: "It helps because I'm warm. That's science. Not affection. Keep holding. For science.", m: 1 },
        { tone: 'flirty', t: "Your hand is perfect, by the way.", r: "My hand is a hand. It's... fine, it's a good hand. Keep it. Not literally. Hold it." },
        { tone: 'risque', t: "Keep me warm all night, then.", r: "All night. Bold of you, on a bad day. ...Yes. Fine. Warm. All night. The cat can sulk." },
      ] },
      { tone: 'passive', t: "It was a rough one.", r: "I know. I watched. You did nothing wrong. The car did. Your team did. I've drafted complaints.", m: 1, opts: [
        { tone: 'cold', t: "Don't send them.", r: "I'll send them. Anonymously. Signed 'a concerned critic'. They'll know. Everyone knows my style." },
        { tone: 'passive', t: "Can we just sit for a bit?", r: "Yes. Sit. Hold the hand. Don't talk. I'll talk. About other people's failures. You'll feel better.", m: 1 },
        { tone: 'flirty', t: "You make bad days better.", r: "I make bad days slightly less bad. Like an umbrella with a hole. ...I'm a good umbrella." },
      ] },
      { tone: 'flirty', t: "Cold. Sure. Hold tighter, then.", r: "Tighter? Demanding. Fine. ...You okay? Actually okay? Don't flirt the answer. Real answer.", opts: [
        { tone: 'cold', t: "No. But I will be.", r: "Good. That's honest. You'll be okay. I'll be rude to everyone who made it bad. In order." },
        { tone: 'passive', t: "Just tired. Really tired.", r: "Then come home. Mine. Sofa. Soap. Cat. Silence. I'll make cold toast. You'll hate it. It'll help.", m: 1 },
        { tone: 'flirty', t: "Better now. You're holding my hand.", r: "I'm holding it because it's cold. ...And because you're you. Both. Shut up. Hold back." },
        { tone: 'risque', t: "Take me home and make me forget today.", r: "Forget today. Bold. Yes. I can make you forget your own name. And your braking. Come on." },
      ] },
    ] },
  { id: 'rude-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "You had a bad day. I can tell. You're doing the quiet thing. Hand. Now. It's cold. Don't make it a moment.",
    opts: [
      { tone: 'cold', t: "Don't baby me.", r: "I'm not babying you. Babying involves a voice. I'm using my normal voice. Hand. Now. Normal voice.", opts: [
        { tone: 'cold', t: "Fine. Hand. Happy?", r: "Happy is strong. Content. Mildly. You're cold. I'm right. It's my favourite combination." },
        { tone: 'passive', t: "Okay. It was a bad day.", r: "I know. You don't have to explain. I watched. I shouted. The cat hid. We're all with you.", m: 1 },
        { tone: 'flirty', t: "You're sweet when you pretend you're not.", r: "I'm never sweet. I'm temperature-regulating. ...I'm a bit sweet. Tonight only. Don't get used to it." },
        { tone: 'risque', t: "Warm me up properly, then.", r: "Properly. Bold. Hm. Yes. Properly is my speciality. My place. You can sulk on the way." },
      ] },
      { tone: 'passive', t: "Thanks. I'll be quiet for a bit.", r: "Be quiet. That's allowed. I'll be quiet too. Look at us. Two quiet people. Revolutionary.", m: 1, opts: [
        { tone: 'cold', t: "You're never quiet.", r: "I'm quiet for you. That's a sacrifice. Notice it. ...Okay, you noticed. Good." },
        { tone: 'passive', t: "This is nice.", r: "Nice. You said nice. I'll let it go. It is nice. Don't tell anyone I agreed.", m: 1 },
        { tone: 'flirty', t: "I like holding your hand.", r: "I know. You're lit up like a lamp right now. ...Me too. Shut up. Hold it." },
      ] },
      { tone: 'flirty', t: "Not a moment. Just your hand.", r: "Just my hand. Good. Small. Manageable. Not a moment. ...It's a bit of a moment. Fine.", opts: [
        { tone: 'cold', t: "Don't get emotional.", r: "I never get emotional. I get accurate. Accurately, I'm sad you're sad. That's data." },
        { tone: 'passive', t: "Can I keep it a while?", r: "Keep it as long as you like. It's not detachable. Keep me, then. Fine.", m: 1 },
        { tone: 'flirty', t: "This is my favourite moment, then.", r: "Your favourite moment is a hand in the cold on a bad day? You're tragic. ...Mine too." },
        { tone: 'risque', t: "Your hand now. The rest of you later.", r: "The rest of me. Bold. On a bad day. I'll allow it. You've earned something good." },
      ] },
    ] },
  { id: 'rude-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "You're still flirting, but your eyes say bad day. Hand, please. It's cold out. That's why. Only why.",
    opts: [
      { tone: 'cold', t: "My eyes are fine.", r: "Your eyes are lying. I know them. I've studied them. For research. Hand. Cold. Go.", opts: [
        { tone: 'cold', t: "Stop studying me.", r: "Can't. Subject's too interesting. Ha. Okay. That slipped out. Hold my hand and forget it." },
        { tone: 'passive', t: "Rough day. You're right.", r: "I'm always right. It's exhausting. Tell me everything. Then I'll insult everyone involved.", m: 1 },
        { tone: 'flirty', t: "Study me all you want.", r: "I will. I'll write a thesis. 'The one who flirts on bad days.' It's a long thesis." },
        { tone: 'risque', t: "Study me up close tonight.", r: "Up close. Bold. Yes. Research requires proximity. I'm very thorough. You'll see." },
      ] },
      { tone: 'passive', t: "Okay. Hand. It is cold.", r: "It is cold. That's my sole reason. Look at me, being practical. ...I'm here, okay? I'm here.", m: 1, opts: [
        { tone: 'cold', t: "I know you're here. You're loud.", r: "I'm loud so you can find me. Like a lighthouse. Don't say anything soapy." },
        { tone: 'passive', t: "Thanks for being here.", r: "Don't thank me. I live here. Next to you. That's my address now. Ugh. That was soppy.", m: 1 },
        { tone: 'flirty', t: "You're my favourite place to be.", r: "I'm a place now. Like a café. Like a bench. ...I'm a good bench. Sit with me." },
        { tone: 'risque', t: "Your place tonight. I need you.", r: "You need me. Okay. That's... yes. My place. Don't be sad on the way. Be sad there. With me." },
      ] },
      { tone: 'flirty', t: "Only why? Not even a little because you like me?", r: "Ninety percent temperature. Ten percent you. ...Eighty-twenty. Don't negotiate on a bad day.", opts: [
        { tone: 'cold', t: "Seventy-thirty. Final offer.", r: "Seventy-thirty. Ugh. Fine. You negotiate like you drive. Aggressively. Badly. Effectively." },
        { tone: 'passive', t: "I'll take ten percent.", r: "You'll take ten. Of course. You'd take a crumb. It's thirty. It's fifty. Shut up." },
        { tone: 'flirty', t: "It's a hundred percent me and you know it.", r: "A hundred percent you. The cold was a lie. Happy? You've had a bad day. You get one truth." },
        { tone: 'risque', t: "Then warm me up the other way.", r: "The other way. Bold. Today of all days? ...Yes. Okay. Come on. Quickly, while I'm feeling generous." },
      ] },
    ] },

  // ---- slot 5: the cat has defected -------------------------------------------------------------------------------
  { id: 'rude-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "Bad news. My cat sat on your jacket all day. She's never done that. She's betrayed me. You're both traitors.",
    opts: [
      { tone: 'cold', t: "Your cat has taste. Finally.", r: "She had taste. Now she's a fan. Sitting on your jacket like a throne. It's humiliating. For me.", opts: [
        { tone: 'cold', t: "Get over it.", r: "I'll never get over it. I'll make a soap about it. 'The Betrayal'. Thirty seasons. You're the twin." },
        { tone: 'passive', t: "Do you want the jacket back?", r: "No. Leave it here. She needs it. I mean she wants it. I mean... leave it. Leave more things." },
        { tone: 'flirty', t: "She just knows I'm staying.", r: "She knows nothing. She's a cat. ...She knows everything. Fine. Stay. She's decided. So have I." },
        { tone: 'risque', t: "Let her keep the jacket. I'll keep you.", r: "Keep me. Bold. Okay. Deal. She gets the jacket, you get me. Nobody gets the good pillow." },
      ] },
      { tone: 'passive', t: "That's sweet. She likes me.", r: "Sweet. It's not sweet. It's a coup. She's switched sides. She sits by the door now. Waiting.", opts: [
        { tone: 'cold', t: "Smart cat.", r: "She's not smart. She's a traitor. Smart traitor. Ugh. You're right. She's smart." },
        { tone: 'passive', t: "Waiting for me?", r: "Waiting for you. I asked her what she was doing. She ignored me. She never ignores me. Love is cruel." },
        { tone: 'flirty', t: "So you both wait for me.", r: "I don't wait. She waits. I stand near her. While she waits. Shut up. Come over more." },
        { tone: 'risque', t: "Then I'd better come over more. And stay later.", r: "Later. Bold. Yes. Stay as late as you like. Tell the cat it's for her." },
      ] },
      { tone: 'flirty', t: "Jealous of your own cat?", r: "Of course I'm jealous. She gets your jacket. I get your nonsense. ...I like the nonsense. Shut up.", opts: [
        { tone: 'cold', t: "Should've sat on the jacket yourself.", r: "Ha. Okay. I might. I'll fight her for it. I'll lose. She fights dirty." },
        { tone: 'passive', t: "I'll bring another jacket.", r: "Bring two. One for her, one for... it doesn't matter. Bring two." },
        { tone: 'flirty', t: "You can have me instead of the jacket.", r: "Instead. Hm. Upgrade. Fine. I'll take you. The jacket can stay with her. I'm being generous." },
        { tone: 'risque', t: "Wear the jacket tonight. Just the jacket.", r: "Bold. Very you. ...I'll consider it. In private. The cat will have to leave the room. She'll be furious." },
      ] },
    ] },
  { id: 'rude-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "Something's happened. My cat slept on your jacket. All night. She hates everyone. Now she waits by the door for you.",
    opts: [
      { tone: 'cold', t: "Your cat's got bad judgement.", r: "She's got excellent judgement. That's what scares me. If she likes you, you're... you're good. Ugh.", opts: [
        { tone: 'cold', t: "I'm terrible. Ask anyone.", r: "I've asked everyone. They say you're lovely. They're wrong. You're worse. You're lovely AND annoying." },
        { tone: 'passive', t: "Does she do this often?", r: "Never. Not with anyone. She hissed at my sister for three years. You got a week. A week." },
        { tone: 'flirty', t: "Like owner, like cat.", r: "Don't. Don't say that. It's true. She's me in fur. We both fell. Badly. Shut up." },
        { tone: 'risque', t: "Then let me sleep over. For the cat.", r: "For the cat. Obviously. Purely feline reasons. ...Bring a toothbrush. For the cat." },
      ] },
      { tone: 'passive', t: "I'll come say hi to her.", r: "She'll ignore you, to save face. Then she'll sit on you. Then I'll sit near you. Very near.", opts: [
        { tone: 'cold', t: "Sounds crowded on that sofa.", r: "It's always crowded. Me, you, her, my soap. It's a family. ...Don't." },
        { tone: 'passive', t: "I'd like that.", r: "You'd like it. She'd like it. I'd tolerate it with a lot of enthusiasm. Come round." },
        { tone: 'flirty', t: "Very near. I like the sound of that.", r: "Near. Close. On you, technically. If there's no room. There's never room. Ugh." },
        { tone: 'risque', t: "Very near, without the cat watching.", r: "Without the cat. Bold. I'll put her in the other room. She'll hold a grudge. Worth it." },
      ] },
      { tone: 'flirty', t: "She's waiting for me. Are you?", r: "I'm waiting for no one. I'm standing by the door with her. Coincidentally. With my keys. Coincidentally.", opts: [
        { tone: 'cold', t: "Coincidentally. Right.", r: "Coincidences happen. Constantly. Around you. Everywhere. Come in." },
        { tone: 'passive', t: "I'll come straight after the race.", r: "Straight after. Good. Bring food. She likes the smell of chips. So do I." },
        { tone: 'flirty', t: "You're waiting for me. Admit it.", r: "I'm waiting. Fine. I'm waiting. Happy? I've never waited for anyone. I'm waiting for you." },
        { tone: 'risque', t: "Then I'll make the wait worth it.", r: "Worth it. Bold promise. You'd better. I've been very patient. I'm never patient." },
      ] },
    ] },
  { id: 'rude-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "You can stop flirting with me. You've already seduced my cat. She sat on your jacket and purred. Traitors. Both of you.",
    opts: [
      { tone: 'cold', t: "I didn't seduce anyone.", r: "You walked in, sat down, and she melted. That's seduction. It's what you did to me. Slower, with me.", opts: [
        { tone: 'cold', t: "It took you longer.", r: "It did. I'm sturdier. I had a lot of walls. She had one. You climbed all of mine. Show-off." },
        { tone: 'passive', t: "She's just warm on the jacket.", r: "Cats don't purr at warmth. They purr at you. Apparently. Both of us." },
        { tone: 'flirty', t: "So you admit I seduced you.", r: "I admit you got in. Through a window. I left it open. On purpose. ...Don't." },
        { tone: 'risque', t: "Let me do it again. Slower.", r: "Slower. Bold. Okay. Slower. I have nowhere to be. Neither does the cat. She can wait outside." },
      ] },
      { tone: 'passive', t: "Is that a bad thing?", r: "It's a terrible thing. My only ally has defected. I'm alone in my own house. With two traitors.", opts: [
        { tone: 'cold', t: "You'll survive.", r: "Barely. I'll make a fort out of cushions. You're not invited. You're invited." },
        { tone: 'passive', t: "I'll try to make it up to you.", r: "With what? Snacks? A toy for the cat? Bring... you. Bring you. That's the only thing." },
        { tone: 'flirty', t: "Two traitors who love you.", r: "Don't use that word. I'm not ready for that word. Use 'tolerate'. ...Use it softly." },
        { tone: 'risque', t: "Let me make it up to you all night.", r: "All night. Bold. Okay. Make it up. The cat sleeps in the kitchen tonight. Sorry, cat." },
      ] },
      { tone: 'flirty', t: "Traitors who adore you.", r: "Adore is a soppy word. ...Do you, though? Adore? Don't answer. I'll get weird.", opts: [
        { tone: 'cold', t: "Never mind.", r: "No, mind. Mind. Okay. I'm weird. I'm weird about you. That's the headline." },
        { tone: 'passive', t: "We do. Both of us.", r: "Both of you. The cat and you. Ganging up. Adoring me. It's unbearable. Keep doing it." },
        { tone: 'flirty', t: "I adore you. Out loud.", r: "Out loud. Oh. Okay. That's loud. ...I adore you too. Quietly. That's how it's said in this house." },
        { tone: 'risque', t: "I'll show you how much. Tonight.", r: "Tonight. Bold. Okay. Show me. Bring the jacket. The cat can have the sleeve." },
      ] },
    ] },
  // ---- slot 6: your place or mine. mine ---------------------------------------------------------------------------
  { id: 'rude-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "You were a nightmare last time. Anyway. Your place or mine? Mine. The cat wants to judge you. And so do I. Closely.",
    opts: [
      { tone: 'cold', t: "Who says I'm coming at all?", r: "Your coat says. Your car keys say. Your whole body language is a taxi. Fine. Don't come. Come.", opts: [
        { tone: 'cold', t: "I'll come. For the cat.", r: "For the cat. Ha. Same excuse I use. Everybody uses the cat. She's exhausted." },
        { tone: 'passive', t: "Okay. Yours, then.", r: "Okay. Yours. Like a delivery address. Fine. Mine. Be romantic about it in the car." },
        { tone: 'flirty', t: "I'm coming for you. Not the cat.", r: "Good answer. Correct answer. The cat will be offended. She'll get over it. I won't." },
        { tone: 'risque', t: "I'll let you judge me. All night.", r: "All night. Oh. Bold. I'll judge thoroughly. Scorecards. Notes. ...You'll score high. Shut up." },
      ] },
      { tone: 'passive', t: "Sure. Your place.", r: "'Sure, your place.' Like a taxi. Fine. Say it like you want it. Like you want me. Try.", opts: [
        { tone: 'cold', t: "I'll want it when we get there.", r: "Ha. Okay. That's actually a good line. You've been saving it. Get in the car." },
        { tone: 'passive', t: "What's for dinner?", r: "Cold toast. Kidding. Something good. I'm a decent cook when nobody's watching. You'll be watching." },
        { tone: 'flirty', t: "I want you. Your place. Now.", r: "Better. Much better. That's the voice. Use it more. Use it in the car." },
        { tone: 'risque', t: "I'll show you how much I want it.", r: "Show me. Bold. In the car? No. At home. ...Okay, a bit in the car. Kidding. Not kidding." },
      ] },
      { tone: 'flirty', t: "Judge me closely. I'll enjoy it.", r: "Of course you will. You enjoy everything I do to you. It's annoying. It's not.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "I'll flatter myself. I'm excellent. You're lucky. Ha. Fine. We're both lucky. Get your coat." },
        { tone: 'passive', t: "Okay. Let's go.", r: "'Let's go.' Fine. Practical. Good. I like practical. ...Hold my hand on the way. Practically." },
        { tone: 'flirty', t: "Closely. Very closely.", r: "Very closely. Yes. Fine. You're a nine tonight. Don't make me regret it. You won't." },
        { tone: 'risque', t: "I'll judge you back. Very thoroughly.", r: "Thoroughly. Bold. Okay. Keep your voice down. People. ...Okay. Car. Now." },
      ] },
    ] },
  { id: 'rude-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "Question. Yours or mine tonight? Mine. Obviously. My cat wants a look at you, and my sofa's better than yours.",
    opts: [
      { tone: 'cold', t: "My sofa's fine.", r: "Your sofa is a crime. It's beige. A beige crime. Mine has character. And cat hair. Character.", opts: [
        { tone: 'cold', t: "Cat hair isn't character.", r: "Cat hair is love. Physical love. From her. Ha. Okay. My place. Mine." },
        { tone: 'passive', t: "Alright. Yours it is.", r: "Mine. Good. Settled. I'll make tea. You'll pretend to like it. The cat'll judge." },
        { tone: 'flirty', t: "Your sofa, your cat, you. Perfect night.", r: "Perfect night. That's very... I'm going to accept that. Graciously. With a sneer." },
        { tone: 'risque', t: "Who needs the sofa?", r: "Bold. Very bold. ...Nobody needs the sofa. The cat can have it. Come on." },
      ] },
      { tone: 'passive', t: "Sounds good.", r: "'Sounds good.' To an invitation from me? Wow. Revise it. Say it like it's a big deal. It's a big deal.", opts: [
        { tone: 'cold', t: "It's not that big a deal.", r: "It is. I don't invite people. I invite you. That's a policy change. ...Fine. Not a big deal. It is." },
        { tone: 'passive', t: "Okay. It sounds great.", r: "Great. Better. Slightly. You'll get there. You'll get to 'wonderful' by the door." },
        { tone: 'flirty', t: "It's a huge deal. I've been waiting.", r: "Waiting. For an invite. Like at a club. Fine. You're on the list. You're the only one on the list." },
        { tone: 'risque', t: "I'll say it properly once we're through your door.", r: "Bold. Oh. Okay. Alright. That's... yes. Fine. Come on. Stop smirking. Walk." },
      ] },
      { tone: 'flirty', t: "And what are the judging criteria?", r: "Manners. Jokes. How you look at me. You'll fail the jokes. You'll ace the looking.", opts: [
        { tone: 'cold', t: "I'll fail on purpose.", r: "You'll fail anyway. It's natural. Like gravity. Like you falling for me. Ha. Mine." },
        { tone: 'passive', t: "Okay. I'll try my best.", r: "Your best. Bring your best. And your toothbrush. That's not a hint. It's a requirement." },
        { tone: 'flirty', t: "I'm great at looking at you.", r: "You are. Disturbingly good. Do it in the car. Don't do it while driving. Rule." },
        { tone: 'risque', t: "There's one category I'll win.", r: "Bold. Hm. Which one? ...Don't tell me. Show me. Later. Car. Go." },
      ] },
    ] },
  { id: 'rude-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "Stop looking at me like that or I'll ask you back. ...So. Whose place? Mine. The cat's keen to judge you. So am I.",
    opts: [
      { tone: 'cold', t: "Maybe I'll go home alone.", r: "Go on. Try. You won't. I know you won't. ...Will you? No. Coat. Car.", opts: [
        { tone: 'cold', t: "Fine. I'm coming. Only for the sofa.", r: "For the sofa. Liar. Fine. The sofa's lovely. So am I. Come on." },
        { tone: 'passive', t: "Okay. Yours.", r: "Okay. Yours. Enthusiasm, please. Even a little. ...There. That was a little. Good." },
        { tone: 'flirty', t: "Only joking. I'm yours tonight.", r: "Mine tonight. Good. Mine tomorrow. Mine the day after. ...Too much? It's not too much." },
        { tone: 'risque', t: "Alone is boring. You're not.", r: "I'm not boring. I'm a full evening. Bold of you to think you'll keep up. You'll keep up. Come on." },
      ] },
      { tone: 'passive', t: "Yours is fine.", r: "Fine. My place is fine. I'm fine. Everything's fine. Say something better. I'm inviting you.", opts: [
        { tone: 'cold', t: "Fine is a compliment, from me.", r: "From you, fine is a compliment. From me, it's a review. We're even. Car." },
        { tone: 'passive', t: "Okay. Yours is lovely.", r: "Lovely. You said lovely. About my flat. It is lovely. The cat's lovely. I'm... adequate." },
        { tone: 'flirty', t: "Yours is perfect. You're in it.", r: "That's soppy. ...Keep going. I'm listening. I'm walking. Walk with me." },
        { tone: 'risque', t: "Yours is perfect for what I have in mind.", r: "What you have in mind. Bold. I have the same thing in mind. Stop talking. Walk." },
      ] },
      { tone: 'flirty', t: "Judge me. Then I get a turn.", r: "Back? You think you get to judge me? ...Fine. Judge me. You'll give me a ten. You always do.", opts: [
        { tone: 'cold', t: "A seven. Maybe.", r: "A seven! Rude. Excellent. I'll earn the other three tonight. Watch me." },
        { tone: 'passive', t: "You're always a ten.", r: "Always a ten. That's not judging, that's devotion. Fine. Devotion's allowed. Tonight." },
        { tone: 'flirty', t: "An eleven. Off the scale.", r: "Off the scale. Ugh. That's my scale. You've broken my scale. Fine. Come on, menace." },
        { tone: 'risque', t: "I'll be judging very closely tonight.", r: "Very closely. Bold. Yes. I'll allow it. I'll be judging you right back." },
      ] },
    ] },

  // ---- slot 7: a kind thing, then an insult to cover it ----------------------------------------------------------
  { id: 'rude-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "Listen. You're good. Not at driving. Well, at driving. At being a person. ...Your jacket's still a crime. Forget the first part.",
    opts: [
      { tone: 'cold', t: "I heard the first part. No take-backs.", r: "Ugh. No take-backs. That's a playground rule. Fine. It stands. You're good. The jacket's still a crime.", opts: [
        { tone: 'cold', t: "Your opinion on jackets is worthless.", r: "My opinion on jackets is gospel. My opinion on you is also gospel. You're good. Shut up." },
        { tone: 'passive', t: "Thank you. That means a lot.", r: "Don't say it means a lot. It means exactly what it means. ...It means a lot. To me too.", m: 1 },
        { tone: 'flirty', t: "You're good too. The best.", r: "I'm not good. I'm accurate. ...I'm good with you. That's the only time. Don't spread it." },
        { tone: 'risque', t: "Tell me more good things. In private.", r: "In private. Bold. I'll tell you one more. In private. It'll take all night to say. I'm slow." },
      ] },
      { tone: 'passive', t: "Okay. Thanks. I think.", r: "You think. Ugh. I said you're good and you think. I'll never be nice again. That was it. The one time.", opts: [
        { tone: 'cold', t: "Good. It was weird.", r: "It was weird. It felt weird. Like a new shoe. I'll do it again. Sometime. Rarely." },
        { tone: 'passive', t: "Sorry. I'm just surprised.", r: "Be surprised. Fine. It's surprising. I surprised myself. I'll be rude for a week to compensate." },
        { tone: 'flirty', t: "Say it again. I'll listen properly.", r: "Properly. Fine. You're good. You're kind. You're the best thing in my week. Done. Jacket. Crime." },
      ] },
      { tone: 'flirty', t: "You think I'm good. I knew it.", r: "You knew nothing. You hoped. Hoping isn't knowing. ...You knew. Fine. You knew.", opts: [
        { tone: 'cold', t: "I always know.", r: "You don't always know. You don't know your braking points. ...You know me. That's the one." },
        { tone: 'passive', t: "I'm glad you said it.", r: "I'm not. I feel exposed. Emotionally. Hand me a coat. Not that jacket. A different coat." },
        { tone: 'flirty', t: "You're good too. You hide it badly.", r: "I hide it brilliantly. Except from you. You've got a key. I didn't give you a key. You have one." },
        { tone: 'risque', t: "Show me how good you think I am.", r: "Show you. Bold. Okay. Tonight. You'll get a detailed review. Out loud." },
      ] },
    ] },
  { id: 'rude-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "I'm going to say something nice once. You're the best person I know. ...Also your hair looks like a startled hedgehog. Balance.",
    opts: [
      { tone: 'cold', t: "Hedgehog. Thanks.", r: "A distinguished hedgehog. Don't fish. The nice part stands. So does the hedgehog.", opts: [
        { tone: 'cold', t: "Take the hedgehog back.", r: "Never. It's accurate. Like the other part. Both accurate. You're the best hedgehog I know." },
        { tone: 'passive', t: "Best person you know? Really?", r: "Really. Out of everyone. My sister's second. The cat's third. Don't tell either of them.", m: 0 },
        { tone: 'flirty', t: "You're the best person I know, too.", r: "Don't echo it. Echoing is cheating. ...Fine. Echo accepted. Ugh. We're disgusting." },
        { tone: 'risque', t: "Mess my hair up more, then.", r: "Mess it up more. Bold. It's already a crime scene. ...Fine. I'll contribute. Later. Thoroughly." },
      ] },
      { tone: 'passive', t: "Thanks. That means a lot to me.", r: "It should. I don't say it. I've said it once. To you. Just now. History. The hedgehog's history too.", m: 0, opts: [
        { tone: 'cold', t: "The hedgehog was unnecessary.", r: "The hedgehog was essential. Balance. I can't be nice without a hedgehog. I'd melt." },
        { tone: 'passive', t: "I'll remember it.", r: "Remember the nice part. Forget the hedgehog. No. Remember both. I mean both." },
        { tone: 'flirty', t: "Say the nice part again.", r: "No. Once. It's a limited edition. ...Best person I know. That's twice. That's a collector's set." },
      ] },
      { tone: 'flirty', t: "Can I get that in writing?", r: "In writing? So you can frame it? Next to the hedgehog? ...I'll write it. On a napkin. Badly.", opts: [
        { tone: 'cold', t: "A napkin. Cheap.", r: "A napkin is sincere. Paper is pretentious. Fine. A card. A small card. With a hedgehog on it." },
        { tone: 'passive', t: "A napkin's fine.", r: "Fine. Napkin. I'll write it. You'll keep it. I'll find it in your wallet in ten years. Ugh." },
        { tone: 'flirty', t: "I'll keep it forever.", r: "Forever. On a napkin. It'll disintegrate. Like my reputation. Worth it. Shut up." },
        { tone: 'risque', t: "Write it on me instead.", r: "On you. Bold. Hm. With what? Don't answer. ...Tonight. Bring a pen. I'll bring the sarcasm." },
      ] },
    ] },
  { id: 'rude-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "Stop flirting, I'm being sincere. You make everything better. ...You also sing in the car. Badly. Both true.",
    opts: [
      { tone: 'cold', t: "I sing beautifully.", r: "You sing like a car alarm in love. ...It's my favourite sound. Don't tell anyone. Sing worse. On purpose.", opts: [
        { tone: 'cold', t: "I'll sing louder, then.", r: "Louder. Ugh. Fine. I'll pretend to hate it. You know I won't. That's the arrangement." },
        { tone: 'passive', t: "Do I really make things better?", r: "Yes. Everything. Weeks, rain, my soap. All better. You've ruined my bad mood. It was a good bad mood.", m: 0 },
        { tone: 'flirty', t: "You make everything better too.", r: "I make everything ruder. ...With you, better. Fine. We make each other better. Rude and better." },
        { tone: 'risque', t: "I'll sing for you tonight. Private concert.", r: "A private concert. Bold. The cat will leave. Good. I'll stay for the encore." },
      ] },
      { tone: 'passive', t: "That's... really kind.", r: "Don't say kind. I'm not kind. I meant it. That's all. The singing's still bad.", opts: [
        { tone: 'cold', t: "The singing's iconic.", r: "Iconic. Like a fire alarm. Ha. It is iconic. Our song is you singing badly. Ugh." },
        { tone: 'passive', t: "Thank you. I mean it.", r: "You mean it. I mean it. Everyone means it. This is a meaning convention. Let's leave." },
        { tone: 'flirty', t: "Sincere looks good on you.", r: "Sincere looks terrible on me. It itches. ...But you like it. So. Occasionally. Sincere." },
        { tone: 'risque', t: "Be sincere with me all night.", r: "All night. Bold. Sincere all night is exhausting. ...I'll try. I'll try very hard. You'll see." },
      ] },
      { tone: 'flirty', t: "You love my singing.", r: "I tolerate your singing. ...I love... the car. When you're in it. Singing. Don't make me finish.", opts: [
        { tone: 'cold', t: "Finish the sentence.", r: "No. Never. ...The sentence is done. It had a full stop. You missed it." },
        { tone: 'passive', t: "Okay. I won't push.", r: "Don't push. Good. I'll get there. Eventually. On my own. Like a slow car." },
        { tone: 'flirty', t: "You were going to say 'love'.", r: "I was going to say 'love the car'. Cars are lovable. You're... in the car. Shut up." },
        { tone: 'risque', t: "Say it later. With the lights off.", r: "Lights off. Bold. Maybe it's easier in the dark. Maybe I'll whisper it. Maybe." },
      ] },
    ] },

  // ---- slot 8: a key; a rainy holiday for two ------------------------------------------------------------------------
  { id: 'rude-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "You were frosty last time, so this is awkward. I got you a key. To my place. It's practical. The cat needs feeding. Don't.",
    opts: [
      { tone: 'cold', t: "A key. That's a big step.", r: "It's a small step. It's a key. It's metal. It's tiny. ...It's a big step. I know. Take it.", opts: [
        { tone: 'cold', t: "Fine. For the cat.", r: "For the cat. Yes. Everyone hides behind the cat. She's very busy. Thank you." },
        { tone: 'passive', t: "Thank you. I'll use it.", r: "Use it a lot. Not too much. A lot. Whenever. Don't ring the bell. You've got a key now." },
        { tone: 'flirty', t: "I'll use it every night.", r: "Every night. Ugh. Fine. Yes. Use it every night. That's what keys are for. I'm aware." },
        { tone: 'risque', t: "Expect me tonight. Late.", r: "Late. Bold. I'll be awake. Not waiting. Awake. With the light on. Coincidentally." },
      ] },
      { tone: 'passive', t: "Oh. Wow. Thank you.", r: "Don't 'wow'. It's a key. Lots of people have keys. Not to my place. Only you. And the cat-sitter. Not anymore.", opts: [
        { tone: 'cold', t: "You fired the cat-sitter?", r: "I promoted you. The cat-sitter was demoted. They took it well. They cried. It was fine." },
        { tone: 'passive', t: "I'll take care of it.", r: "Take care of it. And her. And... me. Occasionally. Not in a soppy way. In a practical way." },
        { tone: 'flirty', t: "This means you want me around.", r: "It means I want you around. Out loud. Ugh. There. Happy? I've said a thing." },
        { tone: 'risque', t: "I'll let myself in and surprise you.", r: "Surprise me. Bold. I hate surprises. I'd love that surprise. Don't tell me when." },
      ] },
      { tone: 'flirty', t: "A key to your place? Is that a proposal?", r: "A proposal has a ring. And a speech. And a sunset. I'd never. ...Never.", opts: [
        { tone: 'cold', t: "Good. I'd say no.", r: "You'd say no? ...Ha. Okay. You wouldn't. I wouldn't. Nobody's saying anything. Take the key." },
        { tone: 'passive', t: "Okay. Just a key.", r: "Just a key. Exactly. A very important key. That opens my whole life. Just a key." },
        { tone: 'flirty', t: "You'd never? Not even in the rain?", r: "...In the rain. Somewhere ugly. With no audience. Maybe. Don't plan anything. I'll know." },
        { tone: 'risque', t: "Then here's mine: stay over tonight.", r: "That's not a proposal, that's a Tuesday. Bold. Yes. Stay. Every Tuesday." },
      ] },
    ] },
  { id: 'rude-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "I hate planning. I've planned a holiday. For us. Somewhere cold and rainy. Nobody goes. It's perfect. Don't say anything.",
    opts: [
      { tone: 'cold', t: "Rainy and cold? Sounds miserable.", r: "It'll be miserable. We'll love it. We'll complain the whole time. It's the perfect holiday.", opts: [
        { tone: 'cold', t: "I'm only coming to complain.", r: "Perfect. That's why I invited you. You're the best complainer I know. After me." },
        { tone: 'passive', t: "Where is it?", r: "An island. Nobody's heard of it. Three sheep. One café. The café's rude. I already love it." },
        { tone: 'flirty', t: "A week alone with you? I'm in.", r: "Alone with me. A whole week. You'll crack. You won't. You never crack. Fine. Pack." },
        { tone: 'risque', t: "Rain outside. Us inside. All week.", r: "Bold. That's the whole plan. I didn't plan the sightseeing. There isn't any." },
      ] },
      { tone: 'passive', t: "Sounds nice. I'll come.", r: "Nice. 'I'll come.' Like it's a dentist. It's a holiday. With me. React with your whole face.", opts: [
        { tone: 'cold', t: "This is my whole face.", r: "That's your whole face? Wow. Then it's a lovely whole face. Ugh. I said that. Leave it." },
        { tone: 'passive', t: "Okay. I'm excited. Really.", r: "Really excited. Good. Me too. Don't tell anyone. I have a reputation. Grumpy. Unexcited." },
        { tone: 'flirty', t: "A holiday with you is my dream.", r: "Your dream is an island with three sheep? You're tragic. ...It's my dream too. Ugh." },
        { tone: 'risque', t: "I'll pack light. Very light.", r: "Very light. Bold. You'll freeze. I'll warm you up. That's the plan. That's the whole holiday." },
      ] },
      { tone: 'flirty', t: "You planned something for us. Romantic.", r: "It's not romantic. It's logistics. There's a ferry. A bad one. ...There's a fireplace. Fine. Slightly romantic.", opts: [
        { tone: 'cold', t: "A bad ferry. Truly the dream.", r: "It is the dream. A grumpy ferry captain. Rain. You. My dreams are rude." },
        { tone: 'passive', t: "A fireplace sounds lovely.", r: "Lovely. Yes. A fireplace. Us. Rain. No phones. You'll complain. I'll make you stop." },
        { tone: 'flirty', t: "You, me, a fireplace. Perfect.", r: "Don't say perfect. Perfect is a jinx. It'll be... very good. Very, very good." },
        { tone: 'risque', t: "You, me, a fireplace and a door that locks.", r: "And a door that locks. Bold. I've already checked. It locks. I checked twice. Don't." },
      ] },
    ] },
  { id: 'rude-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "I hate romance. Hearts. Sunsets. Proposals. Ugh. ...Anyway, I've been looking at holidays. Rainy ones. For two.",
    opts: [
      { tone: 'cold', t: "You hate romance but you're planning a holiday.", r: "I'm a contradiction. I'm allowed. You're one too. You flirt like a pro and park like a tourist.", opts: [
        { tone: 'cold', t: "I park beautifully.", r: "You park like a shopping trolley. Ha. Fine. Book the holiday. I'll drive. You'll complain." },
        { tone: 'passive', t: "Where are we going?", r: "Somewhere nobody goes. Rain, cliffs, a rude café. No crowds. No sunsets. Proper weather." },
        { tone: 'flirty', t: "I love that you planned it.", r: "Love. Hm. You use that word so easily. It's a big word. ...I like that you love it. Fine." },
        { tone: 'risque', t: "Rainy holiday, one room, one bed.", r: "One bed. Bold. Obviously one bed. Two beds are for people who don't like each other." },
      ] },
      { tone: 'passive', t: "Rainy? Not a beach?", r: "Beaches are overrated. Sand is a crime. Sun is a cliché. Rain is honest. Like me. Like you.", opts: [
        { tone: 'cold', t: "Sand is fine. You're the crime.", r: "Ha. I'm the crime. I'm the whole crime. And you're my accomplice. Book the ferry." },
        { tone: 'passive', t: "Okay. Rain it is.", r: "Rain it is. Good. You'll bring the coats. I'll bring opinions. We'll have a lovely time." },
        { tone: 'flirty', t: "Rain with you sounds perfect.", r: "Rain with me is perfect. I'm good in rain. I'm terrible in sun. You've seen me squint." },
        { tone: 'risque', t: "Rain all day. We'll find things to do.", r: "Things to do. Bold. Yes. Many things. Mostly indoors. Mostly not sightseeing." },
      ] },
      { tone: 'flirty', t: "Rainy holidays for two. That's romance.", r: "Romance is a sunset. This is a cloud. ...A cloud for two. Ugh. Fine. It's romance.", opts: [
        { tone: 'cold', t: "It's a cloud. Don't oversell it.", r: "I'm not overselling. You are. With your grin. Fine. A cloud. Our cloud. Shut up." },
        { tone: 'passive', t: "Okay. Our little cloud. Lovely.", r: "Lovely. You said lovely. About a cloud. You're as bad as I am now. I've ruined you." },
        { tone: 'flirty', t: "Our cloud. I love it. And you.", r: "And me? You put me after the cloud. ...Don't. I'm not ready to answer. I'm... nearly ready." },
        { tone: 'risque', t: "Then we'll stay under the cloud all week.", r: "All week. Under the covers. Under the cloud. Bold. That's the itinerary. I'll print it." },
      ] },
    ] },

  // ---- slot 9: don't make me say it (end of the chapter) ---------------------------------------------------------
  { id: 'rude-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "You were cold last time, and I still have to say this. I... you know. The thing. Don't make me say it. You know.",
    opts: [
      { tone: 'cold', t: "Say it, then. Or don't.", r: "In my own time. Somewhere ugly. A ferry queue. In the rain. ...You're doing the face. Stop it. I'm working up to it.", opts: [
        { tone: 'cold', t: "Take your time. I'll be right here.", r: "I know you will. That's the whole problem. That's the whole point. ...I love you. Your jacket's still awful." },
        { tone: 'passive', t: "You don't have to say anything.", r: "I know. That's why I want to. Ugh. Fine. You know. I know. The cat knows. We all know." },
        { tone: 'flirty', t: "I'll say it first, then. I love you.", r: "You said it. Out loud. Here. Fine. Me too. Same. Ditto. All of it. Don't cry, your hair can't take it." },
        { tone: 'risque', t: "Show me instead. Tonight.", r: "Show you. Bold. Fine. Easier than saying it. You'll know. Thoroughly. Without a single word." },
      ] },
      { tone: 'passive', t: "I know. You don't have to say it.", r: "Good. Because I can't. It's stuck. Like your gearbox. ...It's unstuck. Almost. Give me a minute.", opts: [
        { tone: 'cold', t: "A minute. I'm timing you.", r: "Timing me. Cruel. Lovely. Fine. ...Fifty-nine seconds. I love you. Don't celebrate. No fist pump." },
        { tone: 'passive', t: "Take all the time you need.", r: "All the time. That's a lot of time. We've got a lot of time. Haven't we. ...Good. That's the thing. That." },
        { tone: 'flirty', t: "Your face is saying it anyway.", r: "My face is a traitor. Like the cat. Fine. My face says it. I'll back up my face. ...Yes. That." },
        { tone: 'risque', t: "Whisper it. Nobody will hear.", r: "You'll hear. That's the problem. ...Come here. Closer. ...There. Said it. Don't repeat it." },
      ] },
      { tone: 'flirty', t: "I know. I do too. Every bit.", r: "Every bit. Even the rude bits? ...Especially the rude bits. Ugh. You're impossible. I... yes. Same.", opts: [
        { tone: 'cold', t: "The rude bits most of all.", r: "Good. The rude bits are load-bearing. Without them I'd fall over. Into you. Fine. I love you. Shut up." },
        { tone: 'passive', t: "Every bit. Even the soap.", r: "Even the soap. That's commitment. More than anyone's said. Fine. Every bit of you too. Mostly." },
        { tone: 'flirty', t: "Say 'same' louder.", r: "SAME. There. Everyone heard. Rule one is finished. I ended it. For you." },
        { tone: 'risque', t: "Then come home and say it properly.", r: "Properly. Bold. Fine. Home. I'll say it properly. Several times. Without speaking." },
      ] },
    ] },
  { id: 'rude-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "I'm going to say something. Then I'm going to leave the room. I... no. You can't make me say it. You know what I mean.",
    opts: [
      { tone: 'cold', t: "Then don't. I'll survive.", r: "You'll survive. Of course. You're stubborn. That's why I... ugh. That's why. That's the end of the sentence.", opts: [
        { tone: 'cold', t: "Go on. End it properly.", r: "That's why I love you. Happy? Your hair looks like a weather event. Both true. Leave the room. No, stay." },
        { tone: 'passive', t: "I know the end of the sentence.", r: "You do. Of course. You've known for months. You just let me be rude about it. That's love. Ugh." },
        { tone: 'flirty', t: "That's why I love you too.", r: "Too? I didn't say it. You said too. ...Fine. Too. Me too. Too much. Don't tell my sister." },
        { tone: 'risque', t: "Finish the sentence in bed.", r: "In bed. Bold. Easier lying down. Like most confessions. Okay. Bed. I'll finish it there." },
      ] },
      { tone: 'passive', t: "I know what you mean.", r: "You do. Good. Then I don't have to... I'll say it once. Never again. ...I love you. Your jokes are still a crime.", opts: [
        { tone: 'cold', t: "You'd miss the jokes.", r: "I'd miss every single one. I've been counting them. I kept them because... because. You know. Don't." },
        { tone: 'passive', t: "I love you too.", r: "I know. I knew. I've known since the first stupid joke. Eyes elsewhere. I'm leaving the room. Come with me." },
        { tone: 'flirty', t: "Say it again. I didn't hear.", r: "You heard. You're evil. ...I love you. Twice. That's a record. That's the end of my records." },
        { tone: 'risque', t: "Say it again. Slower. Closer.", r: "Closer. Bold. Okay. ...There. Said it. Right in your ear. You're blushing. Ha. Gotcha." },
      ] },
      { tone: 'flirty', t: "Say it. Please. Just once.", r: "'Please'. Ugh. You don't play fair. ...Just once. I love you. There. Weird. You made it weird.", opts: [
        { tone: 'cold', t: "No, you made it weird.", r: "I did. I'm the weird one. You're the stubborn one. The cat's the traitor. Family. Ugh. That word too." },
        { tone: 'passive', t: "Thank you. That's all I needed.", r: "One sentence? I could've said it months ago. I didn't. I'm stubborn. Fine. Again later." },
        { tone: 'flirty', t: "I love you. You're my ten.", r: "Your ten. Tens don't exist. ...You're mine too. My ten. Don't tell anyone. They'll want one." },
        { tone: 'risque', t: "Now show me what you mean.", r: "Show you. Bold. Okay. Words are hard. Showing's easy. Come on. Home. Showing." },
      ] },
    ] },
  { id: 'rude-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "You're looking at me like you're waiting for me to say it. Don't. Don't you dare make me say it. ...You know. You know I do.",
    opts: [
      { tone: 'cold', t: "I wasn't waiting for anything.", r: "Liar. You've been waiting for months. Like my cat at the door. ...Fine. I'll say it.", opts: [
        { tone: 'cold', t: "Go on, then. Prove it.", r: "Prove it. Fine. I love you. Proven. Done. Your shoes are still terrible. Balance restored." },
        { tone: 'passive', t: "No rush.", r: "No rush. You always rush. Now you don't. Infuriating. ...I love you. There. You made me rush." },
        { tone: 'flirty', t: "Okay, I was waiting. Say it.", r: "I love you. I love you, you ridiculous menace. I said it twice. Write it down. Then burn it." },
        { tone: 'risque', t: "Say it without words, then.", r: "Without words. Bold. That I can do. That's my best language. Come here." },
      ] },
      { tone: 'passive', t: "It's okay. I already know.", r: "You already know. Then why do I feel like I'm going to say it anyway. ...Eyes on the wall. Not me.", opts: [
        { tone: 'cold', t: "I'm looking at the wall.", r: "Good. The wall's fine. ...I love you. To the wall. You heard it. It counts. The wall's a witness." },
        { tone: 'passive', t: "Okay. Whenever you're ready.", r: "I'm never ready. I wasn't ready for you. Look what happened. ...I love you. That happened." },
        { tone: 'flirty', t: "You're cute when you're scared.", r: "I'm not scared. I'm terrified. It's different. ...I love you. That's terrifying. Hold my hand. It's cold." },
        { tone: 'risque', t: "Tell me after. When it's just us.", r: "After. Bold. When it's just us and the dark and no witnesses. I'll tell you. Promise." },
      ] },
      { tone: 'flirty', t: "I do too. I love you.", r: "You said it. First. Again. You always win. ...I love you. There. A tie. We're both terrible at this.", opts: [
        { tone: 'cold', t: "I won. You came second.", r: "Second. Ugh. Fine. Behind you. Where I can see you. That's the best seat. I love you." },
        { tone: 'passive', t: "A tie. I'll take it.", r: "A tie. Shared podium. You do the fist pump. I'll allow it. Once. For this." },
        { tone: 'flirty', t: "Say it again. Every day.", r: "Every day. Huge. ...Okay. Every day. Ugh. I'll say it every day and insult you after. Deal." },
        { tone: 'risque', t: "Come home. Say it until morning.", r: "Until morning. Bold. Okay. Home. I'll say it until morning. Then I'll make cold toast. Romance." },
      ] },
    ] },
];
