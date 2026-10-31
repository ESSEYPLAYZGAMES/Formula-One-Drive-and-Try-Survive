// FLIRTATIOUS - in person, stage 'new' (just met: the look across the room, the blink game, Vivi's rules). Slots 1-9 x mood.
// Plain data, no imports.
export const DATA = [
  // ==== slot 1: across {venue}, a look you held - the blink game is born ====
  {
    id: 'flirtatious-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: "Last time you looked straight through me like I was furniture. Nobody does that. I've decided to take it personally.",
    opts: [
      { tone: 'cold', t: "I didn't notice you.", r: "Mm. Liar. Nobody misses me twice. Look at me and say it again - without blinking.", opts: [
        { tone: 'cold', t: "Fine. Still didn't notice you.", r: "You blinked. Shame. I was starting to enjoy you. Run along - I'll make you regret that later." },
        { tone: 'passive', t: "Okay, I noticed. I was busy.", r: "Busy. Everyone's busy. You'll learn to make time for me. Most people do." },
        { tone: 'flirty', t: "I noticed. I just didn't want you to know.", r: "There it is. Playing it cool is cute for about a minute. You've used fifty seconds of it." },
      ] },
      { tone: 'passive', t: "Sorry. Big day. I wasn't looking at anyone.", r: "Then look now. Go on. ...Well. You've got quite a stare on you when you bother using it.", opts: [
        { tone: 'cold', t: "That's enough looking.", r: "Spoilsport. I was winning. Off you go - I'll be thinking up ways to make you sorry." },
        { tone: 'passive', t: "So who are you, then?", r: "Someone you'll remember. The rest comes later, if you play nicely." },
        { tone: 'flirty', t: "Funny. Now I can't stop looking.", r: "Good. Neither can I. First one to look away owes the other a very long evening." },
        { tone: 'risque', t: "Keep staring like that and I'll forget I was busy.", r: "Oh, I'd like to watch you forget. It suits you. Let's see what else slips your mind." },
      ] },
      { tone: 'flirty', t: "I did it on purpose. Wanted to see if you'd come over.", r: "Bold. Wrong, but bold. I don't chase, darling. I wait - and look, here we are.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "Too late; I always do. Shame you went shy right when it got interesting." },
        { tone: 'passive', t: "Fair. Round one to you.", r: "Round one. So there'll be a round two. I'll hold you to that." },
        { tone: 'flirty', t: "Then I'll stand here until you're bored of me.", r: "Bored? Mm. You'd have to try much harder than standing there looking like that." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: "You held my eye across {venue} for four whole seconds. Most people manage two. I came over to see what you're made of.",
    opts: [
      { tone: 'cold', t: "I was looking past you.", r: "Were you. Then why are you still looking at me? Mm. That's what I thought.", opts: [
        { tone: 'cold', t: "Because you're in the way.", r: "Charming. I'll move - slowly - so you can regret it properly." },
        { tone: 'passive', t: "Habit. I stare when I'm thinking.", r: "Then think about me. It's good for you. Mostly." },
        { tone: 'flirty', t: "Fine. I was looking at you.", r: "Took you long enough. Next time just say it. I like people who say what they want." },
      ] },
      { tone: 'passive', t: "Four seconds? You counted?", r: "I always count. Eye contact is a sport, racer, and you're suspiciously good at it.", opts: [
        { tone: 'cold', t: "I'm not here to play games.", r: "Everyone's playing something. You've just picked the dullest game going. Pity." },
        { tone: 'passive', t: "What's the record?", r: "Eleven seconds. A stranger in a lift. We never spoke. Best date I've ever had." },
        { tone: 'flirty', t: "Let's go for five, then.", r: "Mm. Five... six... You didn't blink. Dangerous. I'll be watching you for the rest of the day now." },
        { tone: 'risque', t: "Let's see how long you last.", r: "Longer than you'd think. I have remarkable stamina for the things I enjoy." },
      ] },
      { tone: 'flirty', t: "The kind of thing that stares back.", r: "Ooh. A starer. Let's test that. Eyes on me. Don't you dare blink.", opts: [
        { tone: 'cold', t: "This is silly.", r: "And you blinked. Tragic. I had such high hopes for you." },
        { tone: 'passive', t: "I blinked. You win.", r: "I always do. Don't sulk - losing to me is the best part of most people's week." },
        { tone: 'flirty', t: "Not blinking. You'll have to make me.", r: "Oh, I could. But that would end the fun, and I'm nowhere near done looking at you." },
        { tone: 'risque', t: "Come closer. Makes it harder to look away.", r: "Closer, then. ...Mm. Harder for both of us. Clever thing. I'll remember that trick." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "You've been looking at me since you got here. Don't stop on my account - I've been looking right back.",
    opts: [
      { tone: 'cold', t: "I wasn't looking at you.", r: "Liar. A pretty one, but a liar. I'll let it go once. Twice is a sport.", opts: [
        { tone: 'cold', t: "Believe what you like.", r: "I will. And what I like is you flustered. Shame you've gone all frosty on me." },
        { tone: 'passive', t: "Okay, maybe once or twice.", r: "Once or twice. I counted nine. But I'm generous - we'll call it a draw." },
        { tone: 'flirty', t: "I was. I'm just not used to getting caught.", r: "Get used to it. I catch everything I want." },
      ] },
      { tone: 'passive', t: "Hi. I'm not usually this obvious.", r: "Obvious is underrated. Subtle wastes everyone's time. Hello. I'm very glad you looked.", opts: [
        { tone: 'cold', t: "Don't make it a thing.", r: "Too late. It's a thing. You'll just have to sulk about it from over there." },
        { tone: 'passive', t: "So what happens now?", r: "Now you tell me your name and I decide whether to use it. ...Mm. I'll use it." },
        { tone: 'flirty', t: "I'll be obvious all day if you keep looking back.", r: "Promise? I can do this for hours. Ask anyone who's tried to out-stare me." },
      ] },
      { tone: 'flirty', t: "I like what I'm looking at. Seemed rude to hide it.", r: "Manners. I adore manners. Come here, then - eyes on mine. Let's see who blinks.", opts: [
        { tone: 'cold', t: "No thanks. I'll pass.", r: "You'll pass. Ouch. I'll pretend that didn't sting. ...It did, a little. Go on, then." },
        { tone: 'passive', t: "I blinked. Sorry.", r: "Already? Mm. We'll train you. Everyone's a beginner once." },
        { tone: 'flirty', t: "I'm not blinking until you do.", r: "Then we'll be here all night. I can think of worse ways to spend one. Can you?" },
        { tone: 'risque', t: "Winner picks what happens next.", r: "Oh, now you've made it interesting. I never lose when the prize is worth it." },
      ] },
      { tone: 'risque', t: "Keep looking at me like that and I'll forget my manners.", r: "Forget them. I've never once missed manners at the right moment. Come closer.", opts: [
        { tone: 'cold', t: "That's as close as I get.", r: "Hm. All talk. What a waste of a very good line, darling." },
        { tone: 'passive', t: "Maybe I'll keep them. For now.", r: "For now. My two favourite words. Keep your manners, then. I'll keep wondering." },
        { tone: 'flirty', t: "Closer. Still not blinking.", r: "Neither am I. You're trouble. I can feel it from here." },
        { tone: 'risque', t: "Close enough to whisper?", r: "Close enough. ...Mm. Say that again later. Somewhere nobody's listening." },
      ] },
    ],
  },
  // ==== slot 2: who are you / who am I - they name you Trouble ====
  {
    id: 'flirtatious-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "Back for more frost? I've been sulking beautifully about last time. I've named you Trouble, by the way. You haven't earned it yet.",
    opts: [
      { tone: 'cold', t: "I have a name.", r: "I know. I'm ignoring it. Trouble suits you better - all that frown and nowhere to put it.", opts: [
        { tone: 'cold', t: "Use it or don't talk to me.", r: "So touchy. Fine, I won't talk to you. I'll just stare until you regret saying that." },
        { tone: 'passive', t: "Fine. Trouble's alright.", r: "Alright. Mm. High praise, from you. We'll get you to 'I love it' eventually." },
        { tone: 'flirty', t: "Trouble works. Say it again.", r: "Trouble. ...See? You liked that. The frost's melting, darling. I can hear it drip." },
      ] },
      { tone: 'passive', t: "Why Trouble?", r: "Because you look like a bad decision I'd make twice. And you make me work. I hate working. I'm here anyway.", opts: [
        { tone: 'cold', t: "Sounds like a you problem.", r: "Most fun problems are. Sulk away, Trouble. I'll be over there, looking unbothered." },
        { tone: 'passive', t: "So what do I call you?", r: "{first}. Say it like you mean it. I'll know if you don't." },
        { tone: 'flirty', t: "Then make it twice.", r: "Ooh. Look who woke up. Careful, Trouble - I always follow through." },
      ] },
      { tone: 'flirty', t: "Trouble. I like that. What do I get to call you?", r: "Anything you like, in that voice. But {first} will do. For now.", opts: [
        { tone: 'cold', t: "{first}. Fine.", r: "Fine. You say my name like a parking fine. We'll work on that." },
        { tone: 'passive', t: "{first}. It suits you.", r: "It does. Everything suits me; it's a curse. You're not bad yourself, Trouble." },
        { tone: 'flirty', t: "{first}. I'll say it slower next time.", r: "Slower. Mm. Do. I'll be listening very, very closely." },
        { tone: 'risque', t: "I'll save the other names for when we're alone.", r: "Oh, you're quick. I like quick - for some things. We'll see about the rest." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "I've been trying to place you all day and I've landed on Trouble. That's your name now. What's the real one even for?",
    opts: [
      { tone: 'cold', t: "For people I actually like.", r: "Ouch. Delicious. I'll be one of them by the end of the season. Write it down.", opts: [
        { tone: 'cold', t: "Don't count on it.", r: "I never count on anything. I just win. Enjoy your little moment, Trouble." },
        { tone: 'passive', t: "Maybe. We'll see.", r: "'We'll see.' The most optimistic thing anyone's said to me all week." },
        { tone: 'flirty', t: "You might get there faster than you think.", r: "I know. I'm unbearably likeable. You've been resisting for minutes and it shows." },
      ] },
      { tone: 'passive', t: "Paperwork, mostly. Trouble's fine.", r: "Paperwork. A name like yours, wasted on forms. You need someone who says it like a secret.", opts: [
        { tone: 'cold', t: "I don't need anything.", r: "Self-sufficient. How tragic. I'll stop wasting my best voice on you, then." },
        { tone: 'passive', t: "And who are you when you're not naming people?", r: "{first}. {job}. Night person. Excellent company. That's the brochure; the rest is by appointment." },
        { tone: 'flirty', t: "Volunteering?", r: "Maybe. I'd have to hear you say mine first. ...{first}. Mm. Yes. Volunteering." },
      ] },
      { tone: 'flirty', t: "Trouble. You've clearly been thinking about me.", r: "All day. Terribly distracting. I'm {first}, and I blame you entirely.", opts: [
        { tone: 'cold', t: "Sounds like your problem.", r: "Says the one who came straight over. Fine, Trouble. I'll be gorgeous elsewhere." },
        { tone: 'passive', t: "Nice to meet you, {first}.", r: "It is, isn't it? Polite, too. Trouble with manners. My favourite kind." },
        { tone: 'flirty', t: "Good. I'd hate to be the only one distracted.", r: "You're not. You're very much not. Shall we be distracted together?" },
        { tone: 'risque', t: "Think about me tonight too. That's an order.", r: "Giving orders already? Mm. I'll think about you. In detail. You did ask." },
      ] },
      { tone: 'risque', t: "Whisper Trouble at me and I'll answer to anything.", r: "Trouble. ...Mm. You're right, it works better quiet. Careful, I might get used to it.", opts: [
        { tone: 'cold', t: "Okay, that's enough.", r: "Already? I was just warming up. Fine. You'll come back for more. They always do." },
        { tone: 'passive', t: "Bit much for a second chat.", r: "A bit much is my resting state. You'll acclimatise, Trouble. Breathe." },
        { tone: 'flirty', t: "Again. Closer.", r: "Trouble. ...You shivered. I saw. I'm keeping that." },
        { tone: 'risque', t: "Now what would you whisper if nobody was around?", r: "Not here. Somewhere quieter, lights low, nobody watching the clock. Ask me again then." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "I've given you a name. Trouble. You walked over like you knew exactly what you were doing, so it fits. Am I right?",
    opts: [
      { tone: 'cold', t: "Not really. I just needed somewhere to stand.", r: "Mm. Somewhere to stand. Next to me, of all the spots. Your excuses need work, Trouble.", opts: [
        { tone: 'cold', t: "Any spot would've done.", r: "Then go and find one. Far away. I'll look lovely without you." },
        { tone: 'passive', t: "Okay, this spot was the best one.", r: "It's the best one because I'm in it. Glad we agree, Trouble." },
        { tone: 'flirty', t: "This one came with a view.", r: "Ooh. Recovering nicely. The view says thank you. And it's looking back." },
      ] },
      { tone: 'passive', t: "Maybe. I'm still working out what I'm doing.", r: "Honest. Rare. Most people pretend there's a plan. I'm {first}, by the way. I never have one either.", opts: [
        { tone: 'cold', t: "Don't get your hopes up.", r: "Darling, my hopes are always up. It's yours that need help. Off you trot." },
        { tone: 'passive', t: "Good to know you, {first}.", r: "Good to know me. It's a start. I'll put that on a little card." },
        { tone: 'flirty', t: "Then let's make one up together.", r: "A plan. With you. Mm, I like where this is going and it hasn't gone anywhere yet." },
      ] },
      { tone: 'flirty', t: "You're right. I knew exactly what I was doing.", r: "Mm. Confidence. My favourite thing to see on someone else. I'm {first}. Remember it.", opts: [
        { tone: 'cold', t: "We'll see if I do.", r: "Forgetting me? Bold claim. You'll regret it about three seconds after you leave." },
        { tone: 'passive', t: "I'll remember. Promise.", r: "Good. I'd hate to have to remind you. ...Actually, I'd love to. But still." },
        { tone: 'flirty', t: "I'll be saying it in my sleep.", r: "In your sleep. Interesting. I'd want that confirmed by a reliable witness." },
        { tone: 'risque', t: "Remember it? I'll be saying it all night.", r: "All night is a big promise, Trouble. I take big promises very seriously." },
      ] },
      { tone: 'risque', t: "Trouble's what happens when I stop behaving.", r: "And when does that happen? Asking for myself. I'm {first}, and I'd love to watch.", opts: [
        { tone: 'cold', t: "Not today.", r: "Not today. Fine. Keep your halo on. It's slipping, though. I can see it from here." },
        { tone: 'passive', t: "Depends how the weekend goes.", r: "Then I'll be rooting for you. Loudly. Behave on track - you can misbehave after." },
        { tone: 'flirty', t: "Usually around someone like you.", r: "Someone like me? There isn't one. That's rather the point." },
        { tone: 'risque', t: "Give me a minute and you'll find out.", r: "A minute. I'll time it. Don't disappoint me - I'm hard to impress and very easy to delight." },
      ] },
    ],
  },
  // ==== slot 3: Vivi, the grandmother who taught them everything - rule one, never look away first ====
  {
    id: 'flirtatious-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "You were rather frosty last time. My grandmother Vivi would call that a challenge. Vivi's always right. Annoyingly.",
    opts: [
      { tone: 'cold', t: "I'm not a challenge.", r: "Everyone's a challenge to Vivi. Ninety-one, married three times, still flirts with the postman. You'd lose.", opts: [
        { tone: 'cold', t: "Good for Vivi.", r: "Sarcasm. She'd adore you, actually. I'm less sure. Run along before I decide." },
        { tone: 'passive', t: "Three times? Impressive.", r: "Four, if you count the one she won't discuss. She taught me rule one: never look away first." },
        { tone: 'flirty', t: "Sounds like you take after her.", r: "Every inch. The postman sends his regards. ...You're thawing. I felt it." },
      ] },
      { tone: 'passive', t: "Who's Vivi?", r: "My grandmother. My hero. Ninety-one and outrageous. She taught me the rules - rule one, never look away first.", opts: [
        { tone: 'cold', t: "Rules for flirting? That's sad.", r: "Sad? It's an art form. Some of us practise. Some of us stand there frowning. Off you go." },
        { tone: 'passive', t: "What's rule two?", r: "Always leave them wanting more. Which is why this conversation ends... now. Ish." },
        { tone: 'flirty', t: "Then I'm not looking away either.", r: "Oh, we have a contender. Vivi would want front-row seats. Eyes up, Trouble." },
      ] },
      { tone: 'flirty', t: "I'm happy to be your grandmother's challenge.", r: "Careful. Vivi's challenges end up proposing. Three did. And rule one: I never look away first.", opts: [
        { tone: 'cold', t: "I'm not proposing anything.", r: "Pity. I'd have said no beautifully. Go and be frosty somewhere I can't see it." },
        { tone: 'passive', t: "Noted. No proposals.", r: "Not yet, anyway. We've only just met. Vivi made them wait a month, minimum." },
        { tone: 'flirty', t: "Then I'll just have to make you look away.", r: "Many have tried. Not one has managed. You're welcome to fail very attractively." },
        { tone: 'risque', t: "Look at me like that and I'll propose something else.", r: "Mm. Now that, Vivi would approve of. Propose it properly sometime. Somewhere quiet." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "My grandmother Vivi rang this morning - ninety-one, outrageous. She asked if I'd met anyone interesting. I said ask me later.",
    opts: [
      { tone: 'cold', t: "And?", r: "And I'm still deciding. You're not making it easy. Vivi says the hard ones are worth it. Usually.", opts: [
        { tone: 'cold', t: "Tell her not to bother.", r: "I tell Vivi nothing. She knows anyway. She'll be very disappointed in you." },
        { tone: 'passive', t: "What's she like?", r: "Married three times. Waltzed at ninety. Taught me rule one: never look away first. I haven't, in years." },
        { tone: 'flirty', t: "Tell her I'm trying.", r: "Trying. Mm. She'd like that. So do I, a little. Try harder." },
      ] },
      { tone: 'passive', t: "She sounds like a character.", r: "She's the character. I'm the sequel. Her rules: never look away first, always leave them wanting more.", opts: [
        { tone: 'cold', t: "Rules. Sounds exhausting.", r: "Only for the losers. I find it very relaxing. Enjoy your exhausting evening." },
        { tone: 'passive', t: "Does she have a rule for racing drivers?", r: "Rule six: anyone who goes that fast has something to prove. Rule seven is private." },
        { tone: 'flirty', t: "I'll leave you wanting more, then.", r: "Will you? Lovely. I'll be standing here, wanting. It's very good for my complexion." },
        { tone: 'risque', t: "What does she say about people who break the rules?", r: "That they're the only ones worth taking home. Her words. Mostly." },
      ] },
      { tone: 'flirty', t: "Tell her yes. Very interesting.", r: "Mm. Big claim. Vivi will want proof. Look at me - rule one, never look away first. Let's see.", opts: [
        { tone: 'cold', t: "I'm not auditioning for your grandmother.", r: "Everyone auditions for Vivi. You just failed. Frostily. She'll hear about it." },
        { tone: 'passive', t: "Okay. I looked away. Sorry, Vivi.", r: "She forgives you. I'm still deciding. Practise in the mirror, Trouble." },
        { tone: 'flirty', t: "Still looking. Tell Vivi I'm a natural.", r: "A natural. She'll want your number. So will I, frankly." },
        { tone: 'risque', t: "I'll give her all the proof she needs.", r: "Not in front of my grandmother, darling. At least wait until she's hung up." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "Vivi - my grandmother, my mentor, a menace - says the best flirts never look away first. I've been looking at you for ages. Your move.",
    opts: [
      { tone: 'cold', t: "I'll pass on the family wisdom.", r: "Pass on Vivi? Nobody passes on Vivi. Three husbands and an admirer in every port.", opts: [
        { tone: 'cold', t: "Good for her. Not interested.", r: "Not interested. You're very cute when you lie badly. Go on, sulk. I'll stay right here." },
        { tone: 'passive', t: "Okay, tell me about her.", r: "Ninety-one, waltzes on Thursdays, taught me rule two: always leave them wanting more. I'm doing it now." },
        { tone: 'flirty', t: "Fine. I'm looking. Not stopping, either.", r: "That's more like it. Vivi would be very proud. I'm... intrigued." },
      ] },
      { tone: 'passive', t: "Your grandmother gives flirting advice?", r: "Vivi gives flirting law. One: never look away first. Two: leave them wanting more. Three's for later.", opts: [
        { tone: 'cold', t: "Sounds like a cult.", r: "The best ones are. You'll never get in now. Enjoy the outside, Trouble." },
        { tone: 'passive', t: "What's rule three?", r: "Never chase. Make them chase. ...Don't look at me like that. It works." },
        { tone: 'flirty', t: "I'd like to see you break one of them.", r: "Mm. Many have tried. I'm open to a talented applicant." },
        { tone: 'risque', t: "I'll make you break rule two. You won't want to leave.", r: "Oh, I'd love to watch you try. Vivi's rules weren't written with you in mind." },
      ] },
      { tone: 'flirty', t: "Then I'll just have to out-stare you.", r: "Ha. Vivi trained me, darling. Eyes on mine, Trouble - and no cheating.", opts: [
        { tone: 'cold', t: "Actually, I'm done.", r: "You blinked. And you walked. Double loss. I'll tell Vivi you were adorable and weak." },
        { tone: 'passive', t: "Okay. You win this one.", r: "This one. You'll be back for the rematch. They always are." },
        { tone: 'flirty', t: "You're blushing, though. That counts.", r: "I never blush. That's... the light. ...Fine. One point to you. Don't let it go to your head." },
        { tone: 'risque', t: "Winner whispers something. Loser has to listen.", r: "Then I'll lose on purpose. ...Go on. Whisper. I'm very good at listening." },
      ] },
      { tone: 'risque', t: "My move? It's getting a lot closer.", r: "Mm. Closer. Vivi says never let them see you rattled. I'm not. I'm absolutely not.", opts: [
        { tone: 'cold', t: "Never mind. Too much.", r: "Too much? Darling, I'm exactly enough. You'll catch up eventually. Or you won't." },
        { tone: 'passive', t: "Okay. I'm staying put.", r: "Here's good. Here's where I can see you. Keep it that way, Trouble." },
        { tone: 'flirty', t: "You're rattled. It's cute.", r: "Rattled is a strong word. Curious. Very, very curious." },
        { tone: 'risque', t: "Closer still. Tell Vivi I broke your rules.", r: "Not all of them. Not yet. ...But I'll tell her you tried. She'll want details." },
      ] },
    ],
  },
  // ==== slot 4: what's it like at full speed - fast versus slow, and saying exactly what you want ====
  {
    id: 'flirtatious-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "Still frosty? Fine. I'll thaw you the hard way. Tell me what it feels like doing three hundred down a straight. Slowly.",
    opts: [
      { tone: 'cold', t: "Loud. Hot. Not your business.", r: "Loud and hot. You've just described my favourite kind of evening. The rest I'll find out myself.", opts: [
        { tone: 'cold', t: "You won't.", r: "Mm. I love a closed door. I'll stand outside it looking fabulous until you regret this." },
        { tone: 'passive', t: "It's mostly concentration, honestly.", r: "Concentration. So you're the type who focuses. Noted. That's useful information, Trouble." },
        { tone: 'flirty', t: "Okay, it's a bit like this conversation.", r: "Terrifying and you can't look away? Darling. That's the nicest thing you've said to me." },
      ] },
      { tone: 'passive', t: "Calm, weirdly. Everything goes quiet.", r: "Quiet at that speed. Mm. I'm the opposite - I like it slow, so I can hear every little thing.", opts: [
        { tone: 'cold', t: "Good for you.", r: "It is good for me. Everything I like is. Go and be quiet somewhere else, then." },
        { tone: 'passive', t: "Slow sounds nice too.", r: "It's the best thing in the world, done properly. Nobody's patient anymore." },
        { tone: 'flirty', t: "Teach me slow, then.", r: "Oh, I'd love to. Lesson one: stop looking at the exit. Lesson two is by invitation." },
        { tone: 'risque', t: "Fast is for the track. Slow is for after.", r: "Now that's the most sensible thing a racing driver has ever said to me. After. Mm." },
      ] },
      { tone: 'flirty', t: "Like being looked at by you. Hard to breathe.", r: "Oh, that's good. That's very good. You've been saving that one all week, haven't you?", opts: [
        { tone: 'cold', t: "Don't get used to it.", r: "Too late. I've already framed it. You can go back to being a fridge now." },
        { tone: 'passive', t: "Maybe a little.", r: "A little. Mm. I'll pretend that's modesty. It was a lovely line, Trouble." },
        { tone: 'flirty', t: "I've got more where that came from.", r: "Then don't ration them. I'm greedy. Everyone says so, and they say it fondly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Tell me something. What's it actually like at full speed? I want details. I always want details.",
    opts: [
      { tone: 'cold', t: "It's my job. It's not romantic.", r: "Everything's romantic if you say it right. You're just saying it wrong. Try again.", opts: [
        { tone: 'cold', t: "No thanks.", r: "'No thanks.' Mm. I'll take my curiosity elsewhere. It's very good company." },
        { tone: 'passive', t: "Fine - it's like falling, but steering.", r: "Falling, but steering. I know that feeling. Usually around someone new." },
        { tone: 'flirty', t: "Fine. It's the second-best feeling there is.", r: "Second? Mm. And what's first? Don't answer. I want to guess. For weeks." },
      ] },
      { tone: 'passive', t: "Like everything slows down while you speed up.", r: "Mm. Like a good kiss, then. The world goes quiet and you forget where you left your hands.", opts: [
        { tone: 'cold', t: "Not really, no.", r: "No? Then you've had very disappointing kisses. My condolences. Truly." },
        { tone: 'passive', t: "I'll take your word for it.", r: "You don't have to take my word. You could always check. Eventually. Some time." },
        { tone: 'flirty', t: "Now I'm curious which one's better.", r: "Only one way to find out, and it isn't at full speed. Patience, Trouble." },
        { tone: 'risque', t: "Show me and I'll tell you which wins.", r: "Tempting. But not here. I don't do my best work with an audience. Mostly." },
      ] },
      { tone: 'flirty', t: "Fast. But I take my time where it counts.", r: "Mm. Where it counts. Say that again, slower. I want to hear the bit you meant.", opts: [
        { tone: 'cold', t: "I meant the corners.", r: "The corners. Of course. You've gone all sensible on me. What a waste." },
        { tone: 'passive', t: "I meant it how it sounded.", r: "Good. I like people who mean things. It saves everyone hours of guessing." },
        { tone: 'flirty', t: "Corners, braking zones, conversations with you.", r: "Conversations with me. Clever thing. You're slowing down right now and I can tell." },
        { tone: 'risque', t: "Stick around and you'll find out where else.", r: "Oh, I intend to. I've cleared my evening. Hypothetically. For research." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "I watched one of your onboards at two this morning. Fast, precise, not a flicker of hesitation. Are you like that everywhere, Trouble?",
    opts: [
      { tone: 'cold', t: "That's none of your business.", r: "Not yet. But I'm a very fast learner. And terribly persistent. Ask anyone.", opts: [
        { tone: 'cold', t: "Persist elsewhere.", r: "Ooh. Rejected and dismissed. You'll regret that one, Trouble. Probably tonight." },
        { tone: 'passive', t: "Okay. Not everywhere.", r: "Not everywhere. So there's a slow side. I'm collecting clues about you. It's my new hobby." },
        { tone: 'flirty', t: "Find out for yourself.", r: "Is that an invitation? It sounded like one. I'm keeping it either way." },
      ] },
      { tone: 'passive', t: "On track, yes. Off it, I'm a mess.", r: "A mess. Lovely. Messes are where all the fun hides. I'll take the off-track version, thanks.", opts: [
        { tone: 'cold', t: "You don't know the half of it.", r: "And I won't, apparently. Fine. Stay mysterious. It's less attractive than you think." },
        { tone: 'passive', t: "What about you? Fast or slow?", r: "Slow. Always slow. Anything worth doing is worth doing until sunrise." },
        { tone: 'flirty', t: "You'd like the mess.", r: "I'd adore the mess. I'd probably make it worse. In the best way." },
        { tone: 'risque', t: "The mess is more fun after midnight.", r: "Everything is. I'm a creature of the night, Trouble. Consider yourself booked." },
      ] },
      { tone: 'flirty', t: "Only with things I really want.", r: "Mm. And what do you really want right now? Careful. I always find out.", opts: [
        { tone: 'cold', t: "To get to my briefing.", r: "Swept aside for a briefing. I'll recover. Slowly. Publicly." },
        { tone: 'passive', t: "I'm still deciding.", r: "Decide quickly. I'm not usually this patient, and I'm enjoying it far too much." },
        { tone: 'flirty', t: "Guess. You've been looking at it this whole time.", r: "Oh. Oh, you're good. I need a minute. Nobody's made me need a minute in years." },
        { tone: 'risque', t: "Five minutes alone with you, to start.", r: "To start. Mm. And after the five minutes? No, don't tell me. Make me wonder." },
      ] },
      { tone: 'risque', t: "I'm precise everywhere. Ask nicely and I'll prove it.", r: "Nicely? I don't do nicely, darling. I do directly. Prove it, then.", opts: [
        { tone: 'cold', t: "Not right now.", r: "Not right now. You love a tease, don't you. So do I - when I'm the one doing it." },
        { tone: 'passive', t: "Maybe another time.", r: "Another time. Diarised. In ink. You're not getting out of it." },
        { tone: 'flirty', t: "Directly it is. Dinner, then we'll see.", r: "Dinner and 'we'll see.' My favourite two-course meal." },
        { tone: 'risque', t: "Come here and I'll start with a whisper.", r: "A whisper. ...That was very precise. I take it back. You're dangerous." },
      ] },
    ],
  },
  // ==== slot 5: they've stolen your sunglasses - a hostage you'll have to come and collect ====
  {
    id: 'flirtatious-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "These are yours. I took them while you were busy being frosty. Hostage situation, Trouble. Be nice and you'll get them back.",
    opts: [
      { tone: 'cold', t: "Give them back.", r: "Say please. With feeling. ...No? Then they're mine. They look better on me anyway.", opts: [
        { tone: 'cold', t: "Keep them. I have others.", r: "Of course you do. Fine. I'll wear them while I ignore you. You'll hate how good it looks." },
        { tone: 'passive', t: "Please. They're my favourites.", r: "Your favourites. Now I'm definitely keeping them. Come and visit them sometime." },
        { tone: 'flirty', t: "Please. Said with feeling.", r: "Mm. Better. Much better. I'm still keeping them, but I'm keeping you too, for now." },
      ] },
      { tone: 'passive', t: "Okay, what are your terms?", r: "One honest compliment. Not about my face - everyone does the face. Something else.", opts: [
        { tone: 'cold', t: "I don't have one.", r: "Not one? Ouch. I'll wear these to cry behind. Elegantly. Far away from you." },
        { tone: 'passive', t: "You're very persistent.", r: "That's a compliment? From you, I'll take it. The glasses stay with me. Interest accrues." },
        { tone: 'flirty', t: "You're funnier than you let on.", r: "Oh. Nobody says that. They say gorgeous. Funny is nicer. ...You get one lens back." },
      ] },
      { tone: 'flirty', t: "Keep them. I'll come and get them.", r: "Mm. That's the idea, darling. Come and get them. I'll be waiting. Somewhere.", opts: [
        { tone: 'cold', t: "Never mind. Forget it.", r: "Forget it? I'm wearing your sunglasses, Trouble. You'll think of me every time it's sunny." },
        { tone: 'passive', t: "Where will you be?", r: "Wherever's most inconvenient for you. That's half the fun." },
        { tone: 'flirty', t: "Better make it somewhere private.", r: "Private. Look at you, negotiating. The hostage approves." },
        { tone: 'risque', t: "I'll take them back very, very slowly.", r: "Slowly. Mm. And I'll pretend to resist. Very, very badly." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "I've stolen your sunglasses. Don't panic. It's collateral. You'll have to see me again to get them back.",
    opts: [
      { tone: 'cold', t: "That's theft.", r: "It's flirting with a criminal record. Very different. Call the stewards if you dare.", opts: [
        { tone: 'cold', t: "I'll buy new ones.", r: "How dull. You'd rather spend money than time with me? Fine. I'll keep these forever." },
        { tone: 'passive', t: "Fine. When do I get them back?", r: "When I decide. That's how hostages work. I've seen films." },
        { tone: 'flirty', t: "Okay, I'll come and collect.", r: "Good. Wear something nice. The hostage has standards." },
      ] },
      { tone: 'passive', t: "Do they suit you?", r: "Everything suits me. But these are yours. Still warm. It's terribly distracting.", opts: [
        { tone: 'cold', t: "That's weird.", r: "Weird is just honest in a nice outfit. You'll get used to me. Or you won't. Your loss." },
        { tone: 'passive', t: "Keep them for now, then.", r: "For now. See? You're learning. Rule three: make them chase. And here you are, chasing." },
        { tone: 'flirty', t: "They look better on you, honestly.", r: "I know. But thank you. I'll wear them to every race now, just to watch you notice." },
        { tone: 'risque', t: "Keep them. I'll take something of yours instead.", r: "Oh? And what would you take? Choose carefully, Trouble. I don't give things up easily." },
      ] },
      { tone: 'flirty', t: "Collateral. So you want a second date.", r: "A first date. That wasn't a date. When it's a date, believe me, you'll know.", opts: [
        { tone: 'cold', t: "Then let's not.", r: "Let's not. Mm. Then I'll keep the glasses and the memory of you being boring. Bye." },
        { tone: 'passive', t: "Good to know. What does a date look like?", r: "Candles. A corner table. Me, looking at you like this. You'd never recover." },
        { tone: 'flirty', t: "I'll know, will I?", r: "You'll know. Your pulse will tell you before I do." },
        { tone: 'risque', t: "Make it a date and I'll make it worth your while.", r: "Worth my while. That's a big promise. I always collect, Trouble." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "Mm. I took your sunglasses. You were looking at me so hard you didn't notice. That's two things you owe me now, Trouble.",
    opts: [
      { tone: 'cold', t: "I owe you nothing.", r: "Wrong. You owe me the glasses back, and an apology for that tone. I'll take both in person.", opts: [
        { tone: 'cold', t: "Keep waiting.", r: "I'm very good at waiting. I'm better at making people regret it. Enjoy the squint." },
        { tone: 'passive', t: "Fine. What's the second thing?", r: "Your attention. All of it. For one whole evening. That's fair, I think." },
        { tone: 'flirty', t: "And what will the apology cost me?", r: "A slow one. In person. Eye contact throughout. I'll grade it." },
      ] },
      { tone: 'passive', t: "Two? What's the other?", r: "A look like that one. Every time I see you. It's very expensive, that look.", opts: [
        { tone: 'cold', t: "Bit greedy.", r: "Very greedy. It's my best quality. You'll miss it when you've finished being frosty." },
        { tone: 'passive', t: "I can probably manage that.", r: "Probably. Hm. Lukewarm, but I'll accept. Glasses stay with me." },
        { tone: 'flirty', t: "I'll pay in instalments.", r: "Instalments. So you're planning a long relationship with my debt department." },
        { tone: 'risque', t: "I'll pay double. Somewhere you can see me properly.", r: "Double. Mm. I accept, and I'm charging interest. Late-night rates." },
      ] },
      { tone: 'flirty', t: "Keep the glasses. I'll keep looking.", r: "That's the best trade I've made all year. You'll have to come and watch me wear them.", opts: [
        { tone: 'cold', t: "Actually, I want them back.", r: "Too late. Deal's done. You blinked first on that one. I'll wear them to your next race." },
        { tone: 'passive', t: "Deal. Fair trade.", r: "Fair trade. Sensible. But I'm not interested in fair. I'm interested in fun." },
        { tone: 'flirty', t: "Wear them next time I see you.", r: "Only the glasses? No - I'll dress for the occasion. You'll have to guess which occasion." },
        { tone: 'risque', t: "Collect your debts tonight.", r: "Tonight. Mm. You don't waste a minute. Rule two says leave you wanting. Rule two can wait." },
      ] },
      { tone: 'risque', t: "Keep them. I'd rather take you somewhere they're not needed.", r: "Somewhere dark, you mean. Mm. Trouble, you've been thinking about this.", opts: [
        { tone: 'cold', t: "I meant indoors. Forget it.", r: "Indoors. Lovely. You had me and you let go. I'll be over here, mourning." },
        { tone: 'passive', t: "I meant the cinema. Mostly.", r: "The cinema. Mostly. I'll take mostly. I never watch the film anyway." },
        { tone: 'flirty', t: "Since the moment you put them on.", r: "Since then? Then you've been very patient. I'm not. Remember that." },
        { tone: 'risque', t: "Somewhere with a view. And a door that locks.", r: "A view and a lock. You have priorities, and I respect every one of them. Ask me properly later." },
      ] },
    ],
  },
  // ==== slot 6: the night owl - records, the balcony, dancing in the kitchen at 2am ====
  {
    id: 'flirtatious-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "Lucky for you I'm a night person. I had all night to forgive you for last time. I used about four hours of it.",
    opts: [
      { tone: 'cold', t: "Didn't ask.", r: "Nobody asks; I tell. Two a.m., a record on, dancing alone in my kitchen. You weren't invited. Yet.", opts: [
        { tone: 'cold', t: "Sounds sad.", r: "Sad? It's the best party in town. You're just bitter you weren't on the list." },
        { tone: 'passive', t: "What were you listening to?", r: "Something old and slow. Crackly. The kind of song that makes strangers hold hands." },
        { tone: 'flirty', t: "Put me on the list.", r: "Mm. The list is very exclusive. One person long. ...I'll think about it. Out loud." },
      ] },
      { tone: 'passive', t: "Sorry. I'm a morning person.", r: "A morning person. Darling. I'll try not to hold it against you. I don't do mornings. I do late afternoons.", opts: [
        { tone: 'cold', t: "Then we're not compatible.", r: "You'd be amazed how little that matters at two a.m. You'll never know, now." },
        { tone: 'passive', t: "So what's your two a.m.?", r: "Records. The balcony. The city going quiet. Dancing in the kitchen in socks. Don't laugh." },
        { tone: 'flirty', t: "I could make an exception for you.", r: "An exception. My favourite word after 'yes.' Stay up with me sometime. I'll make it worth it." },
        { tone: 'risque', t: "Keep me up past midnight and see what happens.", r: "Oh, I know what happens. I just like hearing you suggest it." },
      ] },
      { tone: 'flirty', t: "Four hours thinking about me? Flattering.", r: "Thinking about how rude you were. And then about your face. In that order. Mostly.", opts: [
        { tone: 'cold', t: "Mostly the rude part, I hope.", r: "Mostly the rude part. You're right. Back to the rude part. Goodnight, Trouble." },
        { tone: 'passive', t: "What else do you do at that hour?", r: "Records, the balcony, the kitchen floor. Thinking about people I shouldn't. You know how it is." },
        { tone: 'flirty', t: "Next time think about me on purpose.", r: "Oh, I will. In the kitchen. Two a.m. With a slow song on. You'll feel it." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "Confession: I do my best living after midnight. Records, the balcony, dancing in the kitchen. What are you like at two a.m., Trouble?",
    opts: [
      { tone: 'cold', t: "Asleep. Like a normal person.", r: "Normal. What a cruel thing to call yourself. I'll dance for both of us, then.", opts: [
        { tone: 'cold', t: "Go ahead.", r: "I will. Alone. Beautifully. You'll never know what you missed, which is the saddest part." },
        { tone: 'passive', t: "I race. I need the sleep.", r: "Fair. Athletes. You lot and your bedtimes. I'll send you a lullaby." },
        { tone: 'flirty', t: "Maybe I'd stay up for the right reason.", r: "Maybe. Mm. I'm a very good reason. Ask the neighbours. ...About the music." },
      ] },
      { tone: 'passive', t: "Awake, overthinking a race.", r: "Then come and overthink on my balcony. I'll put on something slow and say nothing clever.", opts: [
        { tone: 'cold', t: "I'd rather overthink alone.", r: "Alone. Your loss. I'm excellent company for overthinkers. I distract beautifully." },
        { tone: 'passive', t: "What would you put on?", r: "Something old. Crackly strings. Someone singing about a love that's slightly too late. You'd cry." },
        { tone: 'flirty', t: "Saying nothing clever? You?", r: "I can do it. For a few minutes. If the company deserves it. You might." },
        { tone: 'risque', t: "Distract me enough and I'll stop thinking at all.", r: "Oh, I could manage that. I'm famously distracting. Some say ruinously." },
      ] },
      { tone: 'flirty', t: "Thinking about someone who dances in the kitchen.", r: "Ooh. Already? You're quicker than I thought. I'll save you a song, Trouble.", opts: [
        { tone: 'cold', t: "Not you, obviously.", r: "Obviously. There are so many of us kitchen dancers. Go on - go and think about one of them." },
        { tone: 'passive', t: "Do you really dance alone?", r: "Alone, in socks, badly. It's the only time I'm not performing. Don't tell anyone." },
        { tone: 'flirty', t: "Save me two.", r: "Two songs. You're asking for a lot. I'll give you three. I'm generous at night." },
        { tone: 'risque', t: "Save me the slowest one.", r: "The slowest one is dangerous. People hold on too tight. ...I'll save it." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "Couldn't sleep last night. Put a slow record on, danced round my kitchen, thought about you. Is that too much? I don't care.",
    opts: [
      { tone: 'cold', t: "It's a bit much.", r: "It's exactly enough. You'll learn. In the meantime I'll dance without you. Smugly.", opts: [
        { tone: 'cold', t: "Enjoy it.", r: "Oh, I will. I enjoy everything. That's the difference between us, Trouble." },
        { tone: 'passive', t: "Okay, it's a bit sweet.", r: "Sweet. Dangerous word. I'll pretend I didn't hear it. Next time, I'll imagine you dancing." },
        { tone: 'flirty', t: "Next time, call me.", r: "At two in the morning? Mm. You'd answer, wouldn't you. Interesting." },
      ] },
      { tone: 'passive', t: "What song was it?", r: "Something old and slow with a crackle in it. The kind you can't dance to without holding someone.", opts: [
        { tone: 'cold', t: "So you were holding nobody.", r: "Ouch. Yes. Just a very unimpressed fridge door. You're colder than it was." },
        { tone: 'passive', t: "Sounds nice. I'm a terrible dancer.", r: "Everyone's terrible at first. That's what the slow ones are for. You just sway and hold on." },
        { tone: 'flirty', t: "You could hold me next time.", r: "Next time. Mm. You've just written yourself into my nights, Trouble. Careful." },
        { tone: 'risque', t: "I'd hold on through the whole record.", r: "The whole record. Both sides? That's a long time to be held. I accept." },
      ] },
      { tone: 'flirty', t: "Too much would be not inviting me.", r: "Oh. Well. Consider it noted. The kitchen has a very strict guest list.", opts: [
        { tone: 'cold', t: "Never mind. I'm busy anyway.", r: "Busy. It's always busy with you. I'll dance with the fridge. It's warmer." },
        { tone: 'passive', t: "How strict?", r: "One person, invitation only, socks optional, terrible dancing compulsory." },
        { tone: 'flirty', t: "I'll bring the terrible dancing.", r: "And I'll bring the slow songs. Between us, we'll ruin a perfectly good night. Lovely." },
        { tone: 'risque', t: "Socks are optional? What else is?", r: "Mm. You'll have to come and find out. Behave yourself, Trouble. Or don't." },
      ] },
      { tone: 'risque', t: "Next time, don't think about me. Call me over.", r: "Over. In the small hours. To my kitchen. ...You understand what you're asking for?", opts: [
        { tone: 'cold', t: "Joking. Obviously.", r: "Obviously. You always joke right when it gets interesting. I'm noticing a pattern." },
        { tone: 'passive', t: "Maybe a bit early for that.", r: "A bit early. Mm. You're right. Rule two: leave them wanting. I'm wanting." },
        { tone: 'flirty', t: "A slow song and you. I know exactly what I'm asking.", r: "Then ask me again when you mean it. I'll be awake. I always am." },
        { tone: 'risque', t: "Leave the door unlocked.", r: "Mm. I'll leave the music on and the lights low. The rest is up to you. Fade out, Trouble." },
      ] },
    ],
  },
  // ==== slot 7: the chase - chaser or chased? and a dare ====
  {
    id: 'flirtatious-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "You've been running hot and cold, Trouble. I don't mind a chase. But tell me - are you chasing me, or running?",
    opts: [
      { tone: 'cold', t: "Neither. I'm standing still.", r: "Standing still. The most boring thing a racing driver can do. I expected better.", opts: [
        { tone: 'cold', t: "Expect less.", r: "Mm. I'll expect nothing, then, and enjoy being disappointed. Off you go." },
        { tone: 'passive', t: "Okay. Maybe walking slowly towards you.", r: "Walking slowly. I'll allow it. I'm in no hurry. You are, though. I can tell." },
        { tone: 'flirty', t: "Fine. I'm chasing. Badly.", r: "Badly is fine. Badly is charming. I'll slow down. A little. Don't tell Vivi." },
      ] },
      { tone: 'passive', t: "Which do you prefer?", r: "Both. Chasing is fun. Being chased is better. Being caught is... we'll see.", opts: [
        { tone: 'cold', t: "I'm not into games.", r: "Everything's a game, darling. You're just playing the boring one. Again." },
        { tone: 'passive', t: "Have you been caught before?", r: "Once or twice. Nobody kept me. I don't think they tried very hard. ...Moving on." },
        { tone: 'flirty', t: "Then run. I'll catch you.", r: "Ooh. Confident. I'll run in very impractical shoes, just to make it fair." },
        { tone: 'risque', t: "I'm more interested in the caught part.", r: "Of course you are. So am I. But the chase is half the pleasure, Trouble. Patience." },
      ] },
      { tone: 'flirty', t: "Chasing. You're just very fast.", r: "I'm not fast. I'm elusive. There's a difference. Elusive means I want to be caught eventually.", opts: [
        { tone: 'cold', t: "Eventually's too long.", r: "Then give up. Lots of people do. I'm told it's very relaxing, not wanting me." },
        { tone: 'passive', t: "How long is eventually?", r: "Depends on how well you chase. So far: promising, but sloppy." },
        { tone: 'flirty', t: "Then I'll be patient.", r: "Patient. Mm. That might be the sexiest word there is. Keep saying things like that." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "A dare, Trouble. Tell me something you'd never say to a stranger. I'll tell you one back. I always pay my debts.",
    opts: [
      { tone: 'cold', t: "We are strangers.", r: "Are we? You've seen me sulk. Strangers don't get the sulk. Try again.", opts: [
        { tone: 'cold', t: "No dares.", r: "No dares. No fun. No me, then. Off you go to be a stranger somewhere else." },
        { tone: 'passive', t: "Okay: I get nervous before every race.", r: "Oh. That's a real one. Thank you. Mine: I get nervous before every first kiss. Even now." },
        { tone: 'flirty', t: "Fine: I've been thinking about you.", r: "There. That wasn't so hard. Mine: I've been thinking about you too. Not politely." },
      ] },
      { tone: 'passive', t: "I sing in the car on the way to the circuit.", r: "Out loud? Badly? Lovely. Mine: I practise my best lines in the mirror. This one's an original.", opts: [
        { tone: 'cold', t: "That's a bit sad.", r: "Sad? It's craft. You just wish you had lines. Fine. Keep your car songs." },
        { tone: 'passive', t: "Which line?", r: "This one. 'I practise my lines in the mirror.' It's a double bluff. Did it work?" },
        { tone: 'flirty', t: "It's working.", r: "Of course it is. Mirror me was very confident. Real me is... also very confident. Mostly." },
        { tone: 'risque', t: "I'll sing you something sometime. Privately.", r: "Privately. Mm. Is that a serenade or a threat? Both? Both is my favourite." },
      ] },
      { tone: 'flirty', t: "I'd tell you I can't stop looking at you.", r: "That's not a secret. Everyone can see it. But I like hearing it. Mine: I've been showing off for you.", opts: [
        { tone: 'cold', t: "Well, stop.", r: "Stop? Darling. I'm not a tap. I'll show off at someone more grateful." },
        { tone: 'passive', t: "I noticed. It's working.", r: "Of course it's working. I'm very good. But thank you for noticing." },
        { tone: 'flirty', t: "Keep showing off. I'm watching.", r: "Then watch closely. I save the best bits for the people paying attention." },
        { tone: 'risque', t: "Show off somewhere private. I'll give you a standing ovation.", r: "A standing ovation. That's a booking. Front row. No phones." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "Here's the thing, Trouble: I always say exactly what I want. Right now I want you to chase me. Interested?",
    opts: [
      { tone: 'cold', t: "I don't chase.", r: "Everyone chases something. You just pick the wrong things. Like being dull at me.", opts: [
        { tone: 'cold', t: "Go and find someone who does.", r: "Oh, they're queuing. I just like you better. I'm reconsidering now. Very publicly." },
        { tone: 'passive', t: "I'll walk briskly.", r: "Briskly. Mm. I'll take briskly. I'm not hard to catch, darling. I'm hard to keep." },
        { tone: 'flirty', t: "I don't chase. I wait. Like you.", r: "Two people waiting. How deliciously stubborn. Someone's going to crack." },
      ] },
      { tone: 'passive', t: "What happens if I catch you?", r: "Then you'd find out what I'm like when I stop performing. Very few people have.", opts: [
        { tone: 'cold', t: "Sounds like a lot of work.", r: "It is. That's why only the good ones bother. Don't let me keep you." },
        { tone: 'passive', t: "What are you like?", r: "Quieter. Funnier. A bit soft. Don't spread it around. I have a reputation." },
        { tone: 'flirty', t: "Then start running.", r: "Already am. Slowly. In circles. Near you. It's a terrible strategy and I love it." },
        { tone: 'risque', t: "I'll catch you and keep you up all night finding out.", r: "All night. Mm. You'd get the encore, then. Not many people stay for the encore." },
      ] },
      { tone: 'flirty', t: "Very. Start running.", r: "Oh, I'm off. Slowly. Looking back over my shoulder. Like this. ...Are you coming?", opts: [
        { tone: 'cold', t: "Actually, I'll sit this one out.", r: "You let me get three steps away and then sat down. Cruel. I'll remember that." },
        { tone: 'passive', t: "Give me a head start?", r: "I'm giving you a head start. That's what the slow running is. Keep up." },
        { tone: 'flirty', t: "Right behind you.", r: "I know. I can feel it. Lovely. Don't catch me too fast; I want to enjoy this." },
        { tone: 'risque', t: "And when I catch you, you're mine for the night.", r: "For the night. Mm. Bold. Vivi would approve. I'm... considering it very seriously." },
      ] },
      { tone: 'risque', t: "I'd rather skip to the part where I've caught you.", r: "Skip the chase? Darling. The chase is half the fun. ...The other half I'll let you imagine.", opts: [
        { tone: 'cold', t: "Not worth the effort.", r: "Not worth it. Mm. Lots of people say that until they watch me leave. Watch, then." },
        { tone: 'passive', t: "Fine. A short chase.", r: "A short chase. Compromise. I hate it. I'll make it very short and very confusing." },
        { tone: 'flirty', t: "Then let's take the long way round.", r: "The long way. Now you're speaking my language. I'll run in circles. You'll love it." },
        { tone: 'risque', t: "Imagining it. Vividly.", r: "Good. Keep that thought. Hold on to it. I'll come and collect it later." },
      ] },
    ],
  },
  // ==== slot 8: a crack in the armour - "people think I'm all show" ====
  {
    id: 'flirtatious-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "You think I'm all show, don't you? Most people do. I can see it on your face - that frosty little verdict.",
    opts: [
      { tone: 'cold', t: "Aren't you?", m: -3, r: "Mm. Straight in. ...Sometimes. The show is easier than the rest. You didn't have to say it like that.", opts: [
        { tone: 'cold', t: "I say what I think.", r: "So do I. Usually it's nicer than that. Fine. Enjoy the show. The curtain stays down." },
        { tone: 'passive', t: "Sorry. That was harsh.", r: "It was. But it was honest. I respect honest. I'll sulk for an hour, then forgive you." },
        { tone: 'flirty', t: "Show me the rest, then.", r: "The rest? Mm. Very few people ask. You're not getting it today. But you asked." },
      ] },
      { tone: 'passive', t: "I don't think that. I just don't know you yet.", r: "Fair. Most people stop at the show. It's very good, the show. I've been rehearsing for years.", opts: [
        { tone: 'cold', t: "I'll stick to the show.", r: "Of course. Everyone does. It's free. The rest costs time. Off you go, then." },
        { tone: 'passive', t: "What's behind it?", r: "Someone who reads in the bath, cries at films and worries they're only fun. That's all you get." },
        { tone: 'flirty', t: "I'd stay for the encore.", r: "The encore. Nobody stays for that. ...We'll see. Don't make promises you can't keep." },
      ] },
      { tone: 'flirty', t: "I think you're more than the show. I like both.", r: "Both. Mm. Careful. That's the kind of thing that makes me forget my lines.", opts: [
        { tone: 'cold', t: "Don't make a big deal of it.", r: "I won't. I'll make a small deal. In private. And then ignore you for a day. Fair." },
        { tone: 'passive', t: "I meant it.", r: "I know. That's what's annoying. I'm meant to be the one saying things that land." },
        { tone: 'flirty', t: "Forget them. I like you unscripted.", r: "Unscripted. Oh, I haven't done that in years. Don't laugh if I fluff it." },
        { tone: 'risque', t: "Forget your lines. I'll improvise.", r: "Improvise. Mm. With me? Brave. I'll warn you - I'm much better live." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "Ask me something real, Trouble. Not 'what do you do' - something real. Nobody does. They just want the flirt.",
    opts: [
      { tone: 'cold', t: "The flirt's all I need.", r: "Mm. Everyone says that. And then they're surprised when there's nothing left for them. Fine.", opts: [
        { tone: 'cold', t: "I'll live.", r: "You will. That's the problem. Nobody misses what they never asked for." },
        { tone: 'passive', t: "Okay. What are you afraid of?", r: "Being somebody's good time and never their good thing. ...Don't make that face. You asked." },
        { tone: 'flirty', t: "Okay. What makes you laugh, really?", r: "Vivi. Old films. People who trip and pretend they didn't. You, sometimes. Annoyingly." },
      ] },
      { tone: 'passive', t: "What do you do when nobody's watching?", r: "Read in the bath. Burn toast. Call Vivi and lose at cards. Terribly glamorous.", opts: [
        { tone: 'cold', t: "Not as exciting as you make out.", r: "No. That's the whole idea. Shame you only like the exciting bit." },
        { tone: 'passive', t: "That sounds nice, honestly.", r: "It is nice. I don't tell people. They'd stop thinking I'm mysterious." },
        { tone: 'flirty', t: "I'd like to see you burn toast.", r: "It's not pretty. Actually, it's very pretty. I'm always pretty. But the toast suffers." },
        { tone: 'risque', t: "I'd stay over just to see the burnt toast.", r: "Stay over. Mm. For the toast. Of course. Everyone says it's for the toast." },
      ] },
      { tone: 'flirty', t: "What's your real laugh like? Not the one you do for rooms.", r: "Oh. That's... a good question. It's a snort. A terrible snort. I'll never let you hear it.", opts: [
        { tone: 'cold', t: "Fine, keep it.", r: "I will. You'll never hear it now. Your loss. It's a very funny snort." },
        { tone: 'passive', t: "Everyone snorts.", r: "Not like this. It's a whole event. Vivi says it's my best quality. She's biased." },
        { tone: 'flirty', t: "I'll make you do it.", r: "You'll try. I'll fight it. I'll lose, probably. Don't gloat when it happens." },
        { tone: 'risque', t: "I'll find out. One way or another.", r: "Mm. I have ideas about which way. You'll have to earn them." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "Can I tell you a secret? The flirting's real. But it's also armour. You're the first person I've told that in months.",
    opts: [
      { tone: 'cold', t: "Why tell me?", r: "Because you don't flinch. Usually. ...That was a flinch. Never mind. Forget I said it.", opts: [
        { tone: 'cold', t: "Already forgotten.", r: "Good. Lovely. The armour's back on. It's very shiny. You'll never see behind it again." },
        { tone: 'passive', t: "Sorry. I'm listening.", r: "Are you? Then just... know it. That's all. Back to the flirting. It's safer there." },
        { tone: 'flirty', t: "I didn't flinch. I leaned in.", r: "Did you? Then I'll allow it. Lean in a little more. I'm not used to this part." },
      ] },
      { tone: 'passive', t: "Armour against what?", r: "Being liked for the show and dropped before the encore. It happens. A lot. Now you know.", opts: [
        { tone: 'cold', t: "That's not my problem.", r: "No. It's mine. I'll keep it. Thank you for listening for almost a second." },
        { tone: 'passive', t: "That sounds lonely.", r: "It is, a bit. Don't feel sorry for me. I'm gorgeous and I have a balcony." },
        { tone: 'flirty', t: "I'm staying for the encore.", r: "Mm. Everyone says that. Prove it. I'll be watching. Not blinking." },
        { tone: 'risque', t: "Take the armour off with me sometime.", r: "Sometime. Slowly. With the lights low. ...The emotional armour, Trouble. Mostly." },
      ] },
      { tone: 'flirty', t: "Then I'll be very gentle with it.", r: "Gentle. Oh. People don't use that word with me. They assume I want fireworks. Sometimes I want a candle.", opts: [
        { tone: 'cold', t: "Don't get sentimental.", r: "Sentimental. Me? Never. ...I'll be sentimental at you later, out of spite." },
        { tone: 'passive', t: "A candle's nice.", r: "A candle is lovely. And you just called it 'nice,' which means I'm keeping you." },
        { tone: 'flirty', t: "Fireworks and a candle. I can do both.", r: "Both. Mm. You're very sure of yourself. It suits you more every time." },
        { tone: 'risque', t: "I'll light the candle. You pick the fireworks.", r: "Oh, I know exactly which fireworks. You'll need a very good excuse to leave early." },
      ] },
      { tone: 'risque', t: "I'd like to see you without the armour.", r: "Mm. That's either the sweetest or the boldest thing anyone's said to me. I think it was both.", opts: [
        { tone: 'cold', t: "Just the boldest.", r: "Just bold. Pity. I'd hoped for sweet. Back on goes the armour, then." },
        { tone: 'passive', t: "Both. Mostly sweet.", r: "Mostly sweet. I'll take it. Don't do that again without warning me." },
        { tone: 'flirty', t: "Both. Definitely both.", r: "Both. Then I'll let you see a little. Not today. But I'll let you." },
        { tone: 'risque', t: "The armour first. Then the lights.", r: "Then the lights. Mm. Trouble, you're very good at this for someone so new to me." },
      ] },
    ],
  },
  // ==== slot 9: end of the chapter - "this isn't a game anymore"; next time, somewhere with fewer people ====
  {
    id: 'flirtatious-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "I've decided something and you won't like it. You frost me, and I still want to see you. I'm furious about it.",
    opts: [
      { tone: 'cold', t: "That sounds like your problem.", r: "It is. And I'm making it yours. That's what I do with problems. Brace yourself, Trouble.", opts: [
        { tone: 'cold', t: "I'll pass.", r: "Pass, then. I'll be here. Gorgeous, furious and completely unbothered. You'll come back." },
        { tone: 'passive', t: "Okay. What does that mean?", r: "It means next time, somewhere that's just ours. You, me and whatever you're hiding." },
        { tone: 'flirty', t: "Make it mine, then.", r: "Oh, I will. Thoroughly. Next time, Trouble: somewhere quiet. I'll choose." },
      ] },
      { tone: 'passive', t: "I like seeing you too. I'm just slow.", r: "Slow. I've said I like slow, haven't I? Damn. ...Fine. Next time, just the two of us.", opts: [
        { tone: 'cold', t: "I didn't say yes.", r: "You didn't say no. I'll take what I can get. It's beneath me. I'm doing it anyway." },
        { tone: 'passive', t: "Somewhere quieter sounds good.", r: "Quieter. A corner. Bad lighting for everyone but us. You'll see." },
        { tone: 'flirty', t: "Name the place. I'll be there.", r: "There. That's the first thing you've said that sounded like a promise. Keep it." },
        { tone: 'risque', t: "Fewer people, later hour, worse intentions.", r: "Worse intentions. Mm. My favourite kind. I'll hold you to every one of them." },
      ] },
      { tone: 'flirty', t: "Good. Stay furious. It suits you.", r: "It does, doesn't it. Everything does. ...This isn't a game anymore, Trouble. I hate that it isn't.", opts: [
        { tone: 'cold', t: "Then stop playing.", r: "Stop? You'd miss me by Tuesday. Fine. I'll go. You'll call. Watch." },
        { tone: 'passive', t: "What is it, then?", r: "I don't know. That's what scares me. Next time, somewhere quieter, and we'll find out." },
        { tone: 'flirty', t: "Not a game. A head start.", r: "A head start. Mm. On what? Don't answer. Next time. Somewhere nobody knows us." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "A confession, Trouble. I've treated you like a staring contest from the start. Somewhere along the way I stopped keeping score.",
    opts: [
      { tone: 'cold', t: "So you lost.", r: "Lost? I never lose. I just... changed games. You're hard work. I'm not used to wanting hard work.", opts: [
        { tone: 'cold', t: "Don't bother, then.", r: "Too late. I'm bothered. Be as cold as you like. I'll be very patient, very warm, very annoying." },
        { tone: 'passive', t: "What game is it now?", r: "The one where I see you somewhere that's just us. Next time. My choice of place." },
        { tone: 'flirty', t: "I stopped keeping score too.", r: "Did you? Then we're both in trouble. You more. You're Trouble." },
      ] },
      { tone: 'passive', t: "I noticed. You stopped counting.", r: "You noticed. Of course you did. You notice everything, which is very inconvenient for my reputation.", opts: [
        { tone: 'cold', t: "Your reputation's safe.", r: "Is it. Pity. I'd hoped you'd ruin it. Go on, then. Stay safe and far away." },
        { tone: 'passive', t: "What happens now?", r: "Now we go somewhere quiet. Next time. You get the real me. Some of it." },
        { tone: 'flirty', t: "I'd like to ruin it a little.", r: "A little? Darling, if you're going to ruin me, do it properly. Next time. Somewhere quiet." },
        { tone: 'risque', t: "Let me take you somewhere nobody's counting anything.", r: "Nobody counting. Nobody watching. Mm. I'd like that more than I'm going to admit." },
      ] },
      { tone: 'flirty', t: "Good. Neither have I.", r: "Then we're both done for. ...You know what I want? You, somewhere nobody's watching. Soon.", opts: [
        { tone: 'cold', t: "Not soon. Maybe not ever.", r: "Ever. That's a long word for someone who keeps looking back at me. Fine. Pretend." },
        { tone: 'passive', t: "Soon works.", r: "Soon. You're very easy to plan with. I'll pick the place. You bring that face." },
        { tone: 'flirty', t: "Just say when.", r: "When. ...I said it. Now you have to come. No backing out, Trouble." },
        { tone: 'risque', t: "Just us. Lights low. Doors closed.", r: "You've done this before. Mm. So have I. It's never felt like this, though. Don't tell anyone." },
      ] },
    ],
  },
  {
    id: 'flirtatious-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "I've stopped pretending this is a game. I like you, Trouble. Properly. Next time I want you somewhere with no audience.",
    opts: [
      { tone: 'cold', t: "That's moving fast.", r: "Fast? You drive at three hundred. I say one honest thing and suddenly it's fast. Fine. Sulking.", opts: [
        { tone: 'cold', t: "Sulk away.", r: "I will. Gorgeously. And when you change your mind, I'll make you work twice as hard." },
        { tone: 'passive', t: "Okay. I like you too, I think.", r: "'I think.' Mm. You'll be sure by next time. I'm very convincing in private." },
        { tone: 'flirty', t: "Fast is my thing, remember?", r: "On track. Let's see what you're like off it. Somewhere with no audience." },
      ] },
      { tone: 'passive', t: "No audience? Where?", r: "Somewhere you can hear me whisper. Somewhere I can watch you blink. You'll lose, of course.", opts: [
        { tone: 'cold', t: "I'm not sure about that.", r: "Not sure. That's fine. I'm sure enough for both of us. You'll catch up." },
        { tone: 'passive', t: "I'll come. Promise.", r: "Promise. Lovely. I'll keep it somewhere safe. With your sunglasses." },
        { tone: 'flirty', t: "I won't blink. I'll be too busy looking.", r: "Too busy looking. Mm. Trouble, you've got very good at this. Who taught you?" },
        { tone: 'risque', t: "Somewhere I can kiss you without an audience.", r: "Kiss me. Mm. Say it like that again and I won't make it to next time." },
      ] },
      { tone: 'flirty', t: "Me too. No audience. Just us.", r: "Just us. Mm. I'm almost nervous. I'm never nervous. ...Don't let me ruin it.", opts: [
        { tone: 'cold', t: "Don't get carried away.", r: "Too late. I'm carried. Fine. I'll be calm and composed and secretly furious with you." },
        { tone: 'passive', t: "You won't ruin it.", r: "That's kind of you to say. I'll ruin it a little. It's my style." },
        { tone: 'flirty', t: "Ruin it. I'll still be there.", r: "Oh. Don't say things like that, Trouble. I'll start believing them." },
        { tone: 'risque', t: "Just us, and nowhere to be until morning.", r: "Until morning. Mornings aren't my thing. ...I might, for you. This is getting out of hand." },
      ] },
      { tone: 'risque', t: "No audience. And no rules - not even Vivi's.", r: "No rules. Vivi would faint. And then she'd ask for details. ...Mm. Yes. No rules.", opts: [
        { tone: 'cold', t: "Kidding. Some rules.", r: "Some rules. Spoilsport. You teased me with chaos and then handed me a rulebook." },
        { tone: 'passive', t: "Maybe one or two rules.", r: "One or two. Rule one: never look away first. Rule two: don't be late." },
        { tone: 'flirty', t: "Not even rule one. I'll look away first, just once.", r: "You'd let me win? Oh, that's... that's lovely. Don't. I like the fight." },
        { tone: 'risque', t: "Especially rule two. I won't leave you wanting.", r: "Won't leave me wanting. Mm. Promises, promises. Next time, Trouble. Lights low. Fade out." },
      ] },
    ],
  },
];
