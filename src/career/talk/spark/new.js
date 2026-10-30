// spark (PLAYFUL) - new. Plain dialogue data, generated from the arc plan. No imports.
export const DATA = [
  { id: 'spark-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: ["Oh no, a frowner. My friend Juno bet me my shoes I couldn't make the grumpy racer smile. These are good shoes. Help me out?", "You've been glaring at me for a whole minute. Juno bet my shoes I couldn't get one smile out of you. I'm {first}. Smile. Please."],
    opts: [
      { tone: 'cold', t: "I'm not here to win your bets.", r: "Oof! Straight into the ribs. My shoes are trembling. Is it a bad day, or is it a bad me?", opts: [
        { tone: 'cold', t: "Bad you.", r: "A bad me! Right. I'll go and tell Juno I lost my shoes to a statue. Barefoot and humbled. Thanks ever so." },
        { tone: 'passive', t: "Bad day. Practice went badly.", r: "A bad day I can fix! I'm basically a walking fix. Stay frowning, though, I'll wear you down. Shoes on." },
        { tone: 'flirty', t: "A day that just got slightly less bad.", r: "Was that... nearly a smile? Juno! JUNO! The corner of the mouth moved! I'm counting it. My shoes live!" },
      ] },
      { tone: 'passive', t: "What do you win if I smile?", r: "Juno's sunglasses. Hideous ones, but it's the principle. Also bragging rights. I live for bragging rights.", opts: [
        { tone: 'cold', t: "Then you'll be squinting.", r: "Cold! Ice-cold. Fine. I'll squint at you from across {venue}, very meaningfully. You'll feel it." },
        { tone: 'passive', t: "Fine. One smile. For the sunglasses.", r: "There it is! Tiny but real! Juno owes me sunglasses and you owe me nothing. Nice to meet you, frowner." },
        { tone: 'flirty', t: "I'll smile if you stay and talk.", r: "Bribery! I love bribery. Deal. I'll stay, you smile, Juno cries. Everybody wins except Juno." },
      ] },
      { tone: 'flirty', t: "You could have just asked me to smile at you.", r: "Asking is boring! Betting is an adventure! ...Wait, that worked? You're smiling. Hello, you. Shoes saved.", opts: [
        { tone: 'cold', t: "That wasn't a smile.", r: "It was a smile and you can't take it back, it's evidence. Fine, be like that. The shoes and I are leaving." },
        { tone: 'passive', t: "Okay, it was a small one.", r: "Small counts! I'm not fussy. I'm {first}, I talk too much, and I'm already telling everyone I won." },
        { tone: 'flirty', t: "Stick around. There are more where that came from.", r: "More? A whole supply? Oh, I'm sticking. You've just made a very loud friend, racer. No refunds." },
      ] },
    ] },
  { id: 'spark-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: ["Racer! Settle a bet. Can you lot drive with your eyes shut? I've bet my best friend Juno my shoes that you can.", "Hi! I'm {first}. Quick question, very important: can racers drive with their eyes closed? Juno says no. I bet my shoes on yes."],
    opts: [
      { tone: 'cold', t: "No. And I don't answer quiz questions.", r: "Ooh, frosty. Brrr. My poor shoes. They had a good life. They went places. Mostly to arcades.", opts: [
        { tone: 'cold', t: "You'll survive barefoot.", r: "I will, and I'll look fabulous doing it. You'll still be standing there looking grumpy. Bye, then!" },
        { tone: 'passive', t: "Sorry. No. We keep them very much open.", r: "Damn it! Honest, though. I respect honest. Juno's going to be unbearable. Hold my shoes? Kidding." },
        { tone: 'flirty', t: "Tell me who Juno is. I'll lie for you.", r: "A partner in crime! You were boring for one second and then suddenly fun. Great twist. I love a twist." },
      ] },
      { tone: 'passive', t: "Eyes open, I'm afraid. It helps with the corners.", r: "Corners! So needy. Fine, shoes gone. Other question, then: what's the scariest bit? And don't say corners.", opts: [
        { tone: 'cold', t: "Conversations like this one.", r: "Ha! Brutal. I'll stop talking before I frighten you any more. Enjoy your peace and quiet, brave racer." },
        { tone: 'passive', t: "The first lap. Twenty cars, one corner.", r: "That's me at a buffet! Elbows out, smile on. I'd be brilliant at it. Terrifying, but brilliant." },
        { tone: 'flirty', t: "Honestly? Talking to someone who looks like you.", r: "Scared of me? Good. Stay a bit scared. It's more fun that way. For me, I mean. Mostly for me." },
      ] },
      { tone: 'flirty', t: "Test me. I'll do anything with my eyes shut if you're watching.", r: "Anything? Oh, you're on. Eyes shut. Hold out your hand. No peeking, Juno's watching and Juno cheats.", opts: [
        { tone: 'cold', t: "Actually, I was joking.", r: "No take-backs! ...Apparently there are take-backs. Spoilsport. I'll find a braver racer. They're everywhere." },
        { tone: 'passive', t: "Fine. Eyes shut. Now what?", r: "Now you trust me, which is a terrible idea. Okay, open them. You flinched! I'm telling Juno you flinched." },
        { tone: 'flirty', t: "Eyes shut, hand out. Surprise me.", r: "Brave! Or a little bit mad. Both are my favourite flavours. Right, open. Hi. Still here. Still cute." },
      ] },
    ] },
  { id: 'spark-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: ["Hi! Quick, flirt with me. My friend Juno bet me my shoes I couldn't get a racer to flirt back. I'm {first}. You've got ten seconds.", "Psst. Don't look now, but my friend Juno is watching. I've bet my shoes you'll flirt with me. Make me rich in shoes, racer."],
    opts: [
      { tone: 'cold', t: "I don't perform on demand.", r: "On demand? It was a polite request with a wink! That landed like a cold shower. My shoes are crying.", opts: [
        { tone: 'cold', t: "Then go and find someone who does.", r: "Fine! There's a whole {venue} of people who'd flirt with me for shoes. Probably. Bye, ice cube." },
        { tone: 'passive', t: "Sorry. I'm terrible at this.", r: "Terrible I can work with! Watch: you say something nice, I laugh too loudly. Easy. Try again." },
        { tone: 'flirty', t: "On demand, no. For you, maybe.", r: "Maybe! A flirty maybe! Juno, pay up! Oh, I like you. You're slow off the line but you get there." },
      ] },
      { tone: 'passive', t: "What happens if I don't?", r: "I walk home barefoot and Juno wears my shoes to every party for a year. You'd be ruining my life a bit.", opts: [
        { tone: 'cold', t: "I'll take that risk.", r: "A risk with my shoes! Cold-blooded. You'll be sorry when I'm famous for my bare feet. Very sorry." },
        { tone: 'passive', t: "I'd hate to ruin your life.", r: "Then save it! A compliment, a wink, anything. Even a nod. A flirty nod. ...That was a nod. I'll take it." },
        { tone: 'flirty', t: "Fine. You've got a great laugh. I heard it from over there.", r: "Everyone hears it from over there! It's a goose being chased! And you liked it? Juno, I won!" },
      ] },
      { tone: 'flirty', t: "Ten seconds is plenty. Hi. You're trouble, aren't you?", r: "Trouble? Me? Completely. Shoes won in three seconds! You're a natural. Do you do this often, racer?", opts: [
        { tone: 'cold', t: "Only for bets. Don't get used to it.", r: "Only for bets. Ouch. Well, now I'm betting on something else, and you're not invited. Hmph." },
        { tone: 'passive', t: "First time, honestly.", r: "First time? Then I'm your first. That's going in the record books. I'm {first}. You'll remember it." },
        { tone: 'flirty', t: "Only when someone's worth losing ten seconds over.", r: "Oh, that's smooth. Way too smooth for a first meeting. I'm keeping you. Juno can keep the change." },
      ] },
    ] },
  { id: 'spark-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "Oh, it's you. I'd decided you were going to be my favourite, but last time was frosty. You're on probation. With a nickname pending.",
    opts: [
      { tone: 'cold', t: "I don't need a nickname.", r: "Everyone needs a nickname! Nicknames are love! Fine. Yours was going to be Turbo. Now it's Grumpy. Enjoy.", opts: [
        { tone: 'cold', t: "Grumpy's fine.", r: "It is not fine, it's a punishment! You're meant to fight it! ...Wow. You really are Grumpy. Bye, Grumpy." },
        { tone: 'passive', t: "Okay. What was Turbo for?", r: "Because you look fast even standing still. It's a compliment. Fine, probation's over. Turbo, hi. Behave." },
        { tone: 'flirty', t: "Turbo, though. I'd like to earn Turbo.", r: "Earn it? Ooh, a quest! Smile twice before I leave and Turbo's yours. That's one. Look at you, Turbo." },
      ] },
      { tone: 'passive', t: "Sorry about last time. What's the nickname?", r: "Turbo. You walk like you're about to overtake someone. Probation's lifted. Mostly. I'm watching you, Turbo.", opts: [
        { tone: 'cold', t: "I'm not answering to that.", r: "You'll answer. They all answer in the end. Fine, Grumpy it is until you learn some manners." },
        { tone: 'passive', t: "Turbo. I can live with that.", r: "You'll love it by Friday. Everyone does. I gave my last favourite a nickname and they cried. Happy tears, I think." },
        { tone: 'flirty', t: "Turbo. Does that make me your favourite?", r: "Favourite on probation! Big difference! ...Okay, very small difference. Shrinking by the second. Stop smiling." },
      ] },
      { tone: 'flirty', t: "I've been trying to get off probation all week.", r: "All week? You've been thinking about me all week? Okay, probation shortened. Hello, Turbo. That's you now.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "Wow, and back on probation in record time. You're a fast one. Not Turbo fast. Grumpy fast." },
        { tone: 'passive', t: "Turbo? Fine. I've been called worse.", r: "By who?! Give me names. I'll have words. Nobody insults my favourite except me. Turbo it is." },
        { tone: 'flirty', t: "Turbo. Say it again. I like how you say it.", r: "Turbo. Turbo, Turbo. Stop it, you've made me shy. I'm never shy. You're a menace, Turbo." },
      ] },
    ] },
  { id: 'spark-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "I've decided you're my favourite person here. You don't get a vote. And favourites get a nickname. Yours is Turbo. Don't fight it.",
    opts: [
      { tone: 'cold', t: "I'd like a vote.", r: "A vote? That's the least fun thing anyone's said to me today. Votes are closed. You're Turbo. It's carved in stone.", opts: [
        { tone: 'cold', t: "Then I abstain.", r: "Abstain! Big word for boring. Fine. You're demoted. My new favourite is whoever's holding the snacks." },
        { tone: 'passive', t: "Fine. Turbo. I accept the result.", r: "Gracious in defeat! Very sporting. Gold star for Turbo. It's slightly bent, but it's a star." },
        { tone: 'flirty', t: "I'd have voted for you anyway.", r: "Then why make me sweat? You're a tease! I can tease back, you know. Watch me. Watch closely, Turbo." },
      ] },
      { tone: 'passive', t: "What do favourites get, apart from a nickname?", r: "First pick of my snacks, my secrets, and me turning up at the worst possible moments. It's a package.", opts: [
        { tone: 'cold', t: "I'll pass on the package.", r: "You can't pass on a package, it's already been delivered! ...Fine. Return to sender. Sulking now." },
        { tone: 'passive', t: "I'll take the snacks. Secrets can wait.", r: "Sensible Turbo. Here, the last mint. The secrets will leak out on their own. They always do." },
        { tone: 'flirty', t: "What kind of secrets?", r: "The good kind. The kind you have to lean in for. ...Closer. Okay, not that close. I'm teasing. Mostly." },
      ] },
      { tone: 'flirty', t: "Turbo. I like it. And you're mine, then. My favourite.", r: "Wait, you can't pick me back, that's not how it works! ...Okay, it's very sweet. Very, very sweet.", opts: [
        { tone: 'cold', t: "Only because everyone else here is boring.", r: "By default? I'm your favourite by default? Turbo, I'm taking the gold star back. Hand it over." },
        { tone: 'passive', t: "Mostly because of the laugh.", r: "My laugh? It's a honk! A goose being chased! You like the goose? You're strange. I love strange." },
        { tone: 'flirty', t: "And because of how you look at me when you think I'm not looking.", r: "I don't— okay, I do. Busted. Cards on the table: you're very lookable, Turbo. There. Happy?" },
      ] },
    ] },
  { id: 'spark-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "There you are! Big news: you're my favourite. Favourites get a nickname, and I've been workshopping yours all morning. It's Turbo.",
    opts: [
      { tone: 'cold', t: "Workshop something else.", r: "Oh. That landed flat. I had a whiteboard and everything. Fine. The other option was Biscuit. Enjoy, Biscuit.", opts: [
        { tone: 'cold', t: "Not Biscuit either.", r: "No nickname, no fun, no favourite. That's a lot of no from one racer. I'll workshop someone else." },
        { tone: 'passive', t: "Fine. Turbo's better than Biscuit.", r: "Everything's better than Biscuit. Okay. Turbo restored. You were nearly a baked good, you know." },
        { tone: 'flirty', t: "Call me whatever you like. Just keep calling.", r: "Ooh. Keep calling? That's a door left wide open, Turbo. I walk through open doors. Loudly." },
      ] },
      { tone: 'passive', t: "All morning? What were the other options?", r: "Rocket, Speedy, Biscuit, and Captain Fast, which got crossed out because it's terrible. Turbo won.", opts: [
        { tone: 'cold', t: "They're all terrible.", r: "Terrible? I worked so hard! Fine. I'll take my nicknames to a racer who appreciates art." },
        { tone: 'passive', t: "Turbo's the best of a bad bunch.", r: "Best of a bad bunch! Put it on my gravestone. No, don't. Put it on a mug. Turbo, it's settled." },
        { tone: 'flirty', t: "You spent all morning thinking about me?", r: "Thinking about your nickname. Very different. Totally professional. ...Okay, I thought about you. Shush." },
      ] },
      { tone: 'flirty', t: "And what do I call you?", r: "Ooh, nobody ever asks! You get to pick. But if it's boring I'll veto it, and I veto loudly.", opts: [
        { tone: 'cold', t: "I'll just call you {first}.", r: "Just {first}. Vetoed! Too boring! ...No, it's fine. It's my name. It's fine. Sulking slightly." },
        { tone: 'passive', t: "Sparkler. You fizz.", r: "Sparkler! Okay, I'm keeping it. Nobody's ever named me back. Turbo and Sparkler. We sound like a circus act." },
        { tone: 'flirty', t: "Trouble. Because that's what you are.", r: "Trouble! Yes! That's going on a T-shirt. I'll make you one too. Matching. Turbo and Trouble, live tonight." },
      ] },
    ] },
  { id: 'spark-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "Oh, it's you. Still a tiny bit cross, but I need a favour. Act like we're chatting about something serious. I'm in hiding.",
    opts: [
      { tone: 'cold', t: "I'm not your cover story.", r: "Ouch. Okay. They've spotted me anyway, so thanks for that. You'd have been a terrible cover story.", opts: [
        { tone: 'cold', t: "Good. Then I'm off.", r: "Off you go. Leave me to the person with the timeshare brochure. I'll think of you while I slowly fade away. Kidding." },
        { tone: 'passive', t: "Who are you hiding from?", r: "Someone who wants to tell me about their boat. For an hour. Fine. You can stay. As a human shield." },
        { tone: 'flirty', t: "Fine. But you owe me a real conversation.", r: "A proper chat? Terrifying! Ask me anything except boats. I've had all the boats I can take this year." },
      ] },
      { tone: 'passive', t: "Fine. Act normal. What are we talking about?", r: "Something riveting. Tyres? Say 'tyres' and nod a lot. That's what you lot do, right? Tyre, nod, frown.", opts: [
        { tone: 'cold', t: "Tyres. Done. Can I go?", r: "Wow, you're bad at this. Go on, then. If they find me, I'm telling them you're desperate to hear about their boat." },
        { tone: 'passive', t: "Tyres. Very important. Very round.", r: "Ha! Round! You're funny when you're not being a fridge. They've gone. Okay, I forgive you. A bit." },
        { tone: 'flirty', t: "Forget tyres. Let's talk about you.", r: "Me? My favourite subject! See, this is how you get un-cross. Ask about me. More of this, Turbo." },
      ] },
      { tone: 'flirty', t: "I'll protect you. Stand behind me.", r: "Behind you? Like a bodyguard? ...Okay, that's quite heroic. I'm still cross, but heroically cross now.", opts: [
        { tone: 'cold', t: "On second thoughts, you're on your own.", r: "Abandoned mid-rescue! That's a crime against hiding etiquette. Fine. I'll hide behind a plant." },
        { tone: 'passive', t: "Who is it, anyway?", r: "The one in the scarf. They want me for a charity golf day. Golf! I'd rather eat the ball." },
        { tone: 'flirty', t: "I'll stand here as long as you need. All night if I have to.", r: "All night? That's a big promise for someone who was frosty last time. ...I'll hold you to it. Stay." },
      ] },
    ] },
  { id: 'spark-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: ["Quick! Pretend we're deep in conversation. I'm hiding from someone. Laugh like I just said something brilliant. Now!", "Hey, Turbo! Help! Laugh like I'm hilarious. There's someone over there who wants to tell me about their boat. Again."],
    opts: [
      { tone: 'cold', t: "I'm not faking a laugh for you.", r: "Fine! Don't. They're coming over. Lovely. You've doomed me to an hour of boat facts.", opts: [
        { tone: 'cold', t: "Enjoy the boat facts.", r: "I will not! I'll be very rude about your driving to them instead. Revenge is a dish best served with sails." },
        { tone: 'passive', t: "Okay. Ha ha ha. Happy?", r: "Worst fake laugh I've ever heard and I adore it. You're a natural. At being bad at it. They've gone. Saved!" },
        { tone: 'flirty', t: "I'll laugh when you're actually funny.", r: "Ooh, a challenge! Okay. Okay... I've got nothing. You've made me nervous. That never happens. You're a hazard." },
      ] },
      { tone: 'passive', t: "Ha! Oh, that's brilliant. Tell me another.", r: "Oh, you're good! Very convincing. They've turned away. Now I have to actually tell you another. Pressure!", opts: [
        { tone: 'cold', t: "Actually, don't. I'm busy.", r: "Busy! You were laughing two seconds ago! Fine. I'll save my brilliant material for someone with time." },
        { tone: 'passive', t: "Go on, then. Tell me something true.", r: "True? Okay. I was banned from a crazy golf course for 'excessive celebration'. I did a cartwheel. On the green." },
        { tone: 'flirty', t: "Every word you say is brilliant. That wasn't fake.", r: "Stop. Now it's my real laugh, the goose one. Everyone's looking. You've ruined my hiding. Worth it." },
      ] },
      { tone: 'flirty', t: "I'll laugh at anything if you keep standing this close.", r: "This is my 'please save me' face. Apparently it works on racers. Writing that down. Weaponising it.", opts: [
        { tone: 'cold', t: "It works less than you think.", r: "Ouch. Then why are you still here? Exactly. Go on, run. I won't chase you. Today." },
        { tone: 'passive', t: "So who's the boat person?", r: "Somebody's cousin. They've got a boat called 'Second Wind'. I've heard about every rope. Every single rope." },
        { tone: 'flirty', t: "Hide with me all night. I'll keep you safe.", r: "All night? That's a big hiding plan. You're my bodyguard now, Turbo. You're not allowed to quit." },
      ] },
    ] },
  { id: 'spark-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "Turbo! Perfect timing. Pretend you're madly in love with me for two minutes. There's someone I'm avoiding and it's the only way.",
    opts: [
      { tone: 'cold', t: "Two minutes of acting? No.", r: "No? Not even for me? That was a cold little splash right in the face. ...They're coming over. Thanks a lot.", opts: [
        { tone: 'cold', t: "Then it's lucky I'm leaving.", r: "Leaving me to the wolves! Well, the wolf. One wolf with a brochure. I'll remember this, Turbo." },
        { tone: 'passive', t: "Sorry. I'm a terrible actor.", r: "Terrible's fine! Just stare at me adoringly. ...Wow, that's creepy. Okay, never mind, they've gone anyway." },
        { tone: 'flirty', t: "Who said I'd be acting?", r: "Oh! Oh no. That's not fair, you can't say that when I'm hiding. Now I'm blushing behind a pillar like a fool." },
      ] },
      { tone: 'passive', t: "Madly in love. Got it. What do I do?", r: "Gaze at me. Laugh at my jokes. Touch my arm once. Not twice, twice is overdoing it. Go!", opts: [
        { tone: 'cold', t: "I'll gaze. That's all you get.", r: "Just a gaze? A stingy, grudging gaze? They can tell, you know. They can see the grudge. Ugh." },
        { tone: 'passive', t: "Gaze, laugh, arm. Like that?", r: "Textbook! They've given up. You're very good at fake-adoring me. Suspiciously good, actually." },
        { tone: 'flirty', t: "I'll touch your arm twice. I like overdoing things.", r: "Twice! Rule-breaker! I love a rule-breaker. They've gone and I'm the one who's flustered now. Typical." },
      ] },
      { tone: 'flirty', t: "Two minutes? I'll need longer to do it properly.", r: "Longer? How much longer? Careful, Turbo. I'm very bad at stopping games once they start.", opts: [
        { tone: 'cold', t: "Never mind. I'll do two minutes.", r: "Two minutes, stopwatch running, no feelings allowed. ...Wow, that's bleak. You took the fun out of fake love." },
        { tone: 'passive', t: "Five minutes. Then we see.", r: "Five minutes, then we see. Ooh. Ominous. I like ominous. Right, they've gone. Shall we keep going anyway?" },
        { tone: 'flirty', t: "No stopwatch. Let's just see where it goes.", r: "No stopwatch! You're dangerous. I'm hiding from them and now I'm hiding from my own face. It's red." },
      ] },
    ] },
  { id: 'spark-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "Oh. You. You were a bit of a statue last time. Statues are good at one thing: straight faces. Bet you can't keep one for ten seconds.",
    opts: [
      { tone: 'cold', t: "I'm not playing your games.", r: "Not playing? Okay. That's twice you've frozen me out. I'm starting to take it personally, statue.", opts: [
        { tone: 'cold', t: "Take it however you like.", r: "I'll take it home and sulk at it. Very thoroughly. You're missing a great game, you know." },
        { tone: 'passive', t: "It's not personal. I'm just wiped.", r: "Wiped I can work with. Ten seconds of me pulling faces. Medically proven to un-wipe people. Ready?" },
        { tone: 'flirty', t: "Okay. One game. For you.", r: "For me! The statue thaws! Three, two— no blinking. No smiling. Oh, you're smiling. Statues are so weak." },
      ] },
      { tone: 'passive', t: "Fine. Ten seconds. Go.", r: "One... two... you're twitching... three... four... YES! Four! I'm undefeated. Statues crumble. Ha!", opts: [
        { tone: 'cold', t: "Fine, you win. Enjoy it.", r: "I will, thank you. Gracious losers are so rare. You weren't gracious, but I'm counting it anyway." },
        { tone: 'passive', t: "That was a warm-up. Again.", r: "A warm-up! That's what all the losers say. Round two. I'm bringing out the big faces now." },
        { tone: 'flirty', t: "It's hard. You're very distracting up close.", r: "Up close is my best angle. I'd apologise, but I'm not sorry. Round two, and I'm leaning in." },
      ] },
      { tone: 'flirty', t: "I'll keep a straight face if you stop being so cute.", r: "Cute? I'm being a menace. ...Oh, that's how you crack. Compliments. Noted. Statues have feelings after all.", opts: [
        { tone: 'cold', t: "Don't push your luck.", r: "Too late, it's pushed. It's halfway down the street. Fine. Stay a statue. I'll find a softer one." },
        { tone: 'passive', t: "Okay. Ten seconds. I'm ready.", r: "One, two, three, I'm wiggling my eyebrows, four, five— you went at five! A new personal best for a statue." },
        { tone: 'flirty', t: "Statues melt around you, apparently.", r: "Melted statue! That's just a puddle! I'm doing my laugh now, the goose one, and it's your fault." },
      ] },
    ] },
  { id: 'spark-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Dare you to keep a straight face for ten seconds while I look at you. Nobody's ever made it past six. It's a gift. And a curse.",
    opts: [
      { tone: 'cold', t: "Pass. That's childish.", r: "Childish! It's an ancient sport! Possibly. ...Fine. I'll keep my gift to myself, then. Childish gift.", opts: [
        { tone: 'cold', t: "Keep it to yourself.", r: "I will. I'll go and make a photographer crack instead. They crack in two. You're no fun at all, Turbo." },
        { tone: 'passive', t: "Okay, okay. Ten seconds.", r: "One, two, three— you've gone! Three! That's tragic for a professional. Racers are meant to have nerves of steel." },
        { tone: 'flirty', t: "Childish, but I'll do it for you.", r: "For me! See, that's the right attitude. Right. Eyes on mine. ...You lasted one. One! I'm a legend." },
      ] },
      { tone: 'passive', t: "Ten seconds. Fine. Go on, then.", r: "One... two... three... four... five... six... SEVEN? Nobody does seven! What are you, made of tyres?", opts: [
        { tone: 'cold', t: "I just don't find you that funny.", r: "That's not a face contest, that's an insult contest. You win that one. Hollow victory, Turbo." },
        { tone: 'passive', t: "Practice. I sit very still on the grid.", r: "The grid! Cheating! You've trained for this. I want a rematch on neutral ground. Like a bouncy castle." },
        { tone: 'flirty', t: "I'd have gone longer, but your face did a thing.", r: "What thing? Did I snort? I snorted. My laugh is a goose being chased and I can't stop it. Don't look!" },
      ] },
      { tone: 'flirty', t: "I'll do it. But if I last, you owe me something.", r: "Ooh, stakes! I love stakes. If you last ten, I owe you a favour. Any favour. I'll regret this.", opts: [
        { tone: 'cold', t: "Then I'll take my favour and go.", r: "Take the favour and go? That's the coldest use of a favour I've ever heard. I'll pay up. Grudgingly." },
        { tone: 'passive', t: "Deal. Ten seconds.", r: "One, two, three, four, five, six... seven... eight— you laughed! At eight! So close. No favour. Ha!" },
        { tone: 'flirty', t: "The favour's ten more minutes with you.", r: "That's not a favour, that's a present. For me! Ugh, you've cracked me instead. I'm honking. Sorry." },
      ] },
    ] },
  { id: 'spark-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "Staring contest. Right now. Loser has to say something nice about the winner. And I warn you: I've never lost. Never ever.",
    opts: [
      { tone: 'cold', t: "I'm not staring at you.", r: "Not staring at me? You're the first person who's ever refused to look at me. That's a new kind of ouch.", opts: [
        { tone: 'cold', t: "There's a first time for everything.", r: "There is. And this is the first time I've walked away from a racer mid-game. Feels terrible. Bye." },
        { tone: 'passive', t: "Fine. One go. Blinking's allowed?", r: "Blinking is absolutely not allowed. ...You blinked! I win! Nice thing, please. I'm waiting." },
        { tone: 'flirty', t: "I won't stare. I'll just look. Softly.", r: "Softly? Oh, that's not fair. I've blinked. I've lost. My first defeat. You can't tell anyone." },
      ] },
      { tone: 'passive', t: "One go. Loser says the nice thing.", r: "Eyes on me. ...Don't smile. Don't smile. ...You smiled! I win. Nice thing, Turbo. Make it a big one.", opts: [
        { tone: 'cold', t: "You're loud. That's nice, I suppose.", r: "Loud. That's the nice thing? It's not a compliment, it's a noise complaint. Rematch never." },
        { tone: 'passive', t: "Your laugh. It's brilliant.", r: "It's a honk! Everyone says it's a honk. ...But you said great. I'll allow great. I'm keeping great." },
        { tone: 'flirty', t: "You're impossible to look away from.", r: "I— that's— okay, that's not a nice thing, that's a weapon. I've lost all feeling in my knees." },
      ] },
      { tone: 'flirty', t: "Fine. But I'm not going to blink. I'm going to enjoy the view.", r: "Enjoy the— oh, that's cheating! You can't flirt during a staring contest. I blinked! Foul!", opts: [
        { tone: 'cold', t: "Fine. I'll stop.", r: "Stop? No, it was working! Too well! ...Spoilsport. You win, but nobody's clapping. Not even me." },
        { tone: 'passive', t: "You blinked. Pay up.", r: "Pay up. Okay. Nice thing: you're annoyingly good at this. And your eyes are very... eye-shaped. Lovely eyes. Shut up." },
        { tone: 'flirty', t: "I'll take my prize in more staring.", r: "More staring? You're a menace. People are watching. I don't care. Go. Best of three, Turbo." },
      ] },
    ] },
  { id: 'spark-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Hi. I've written you in my notebook. Everyone I bet on gets a page. Yours says 'frosty, page four'. Want to improve your page?",
    opts: [
      { tone: 'cold', t: "I don't want to be in your notebook.", r: "Too late, you're in it in pen. You can't rub out pen. That's science. Ouch, though. Noted. Also in pen.", opts: [
        { tone: 'cold', t: "Then cross me out.", r: "Crossing out isn't allowed, it ruins the look. Fine. I'll draw a little cloud over you. A grey one." },
        { tone: 'passive', t: "What's in it, then?", r: "Every bet I've ever made. Who won. What we bet. I've lost forty-one pairs of sunglasses. Your page is quite short." },
        { tone: 'flirty', t: "What do I have to do to get a better page?", r: "Ooh, ambition! Make me laugh, win a bet, or do something silly. Then I draw you a star. Stars are rare." },
      ] },
      { tone: 'passive', t: "Page four? Who's on pages one to three?", r: "Juno, my nan's cat, and a ferry captain who lost a bet about a seagull. You're in fine company, frosty.", opts: [
        { tone: 'cold', t: "Fine company. Sure.", r: "A cat and a ferry captain are excellent company! Better than some racers I could mention. ...You." },
        { tone: 'passive', t: "What did the ferry captain bet?", r: "That the seagull wouldn't steal my chips. It stole the captain's hat. I won a free crossing. Best day ever." },
        { tone: 'flirty', t: "Make my page better. I'll do whatever you write.", r: "Whatever I write? Careful, Turbo. I've got a pen and no sense of restraint. Right. 'Not frosty any more.'" },
      ] },
      { tone: 'flirty', t: "Cross out frosty. Write 'charming'.", r: "Charming? You have to earn charming! ...Okay, I've written 'charming?' with a question mark. Probation charming.", opts: [
        { tone: 'cold', t: "Don't bother, then.", r: "Not bothering. Question mark stays. Underlined. Twice. You're very good at staying frosty, you know." },
        { tone: 'passive', t: "What's left to earn it?", r: "One good laugh. Out loud. The kind where you forget you're famous. Then the question mark comes off." },
        { tone: 'flirty', t: "I'll earn it. Every page you've got left.", r: "Every page? That's a whole notebook, Turbo. That's a commitment. ...I've drawn you a tiny star. Shush." },
      ] },
    ] },
  { id: 'spark-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "Hold still, I'm writing you down. This is my notebook. Every bet I've ever made is in here. You've got a whole page now. Page four.",
    opts: [
      { tone: 'cold', t: "I'd rather not be written down.", r: "Too late! You're immortal now. In biro. ...Fine, I'll write that you'd rather not. It's going on your page.", opts: [
        { tone: 'cold', t: "Then I'll stay away from your pen.", r: "Run from the pen! Nobody escapes the pen, Turbo. Your page now says 'runs from pens'. It's not flattering." },
        { tone: 'passive', t: "What does my page say so far?", r: "'Turbo. Smiles slowly. Bad at fake laughing. Possibly fun.' Possibly. Underlined. The jury's out." },
        { tone: 'flirty', t: "Only if it's a good page.", r: "Good page? It's the best page! It's got a doodle! ...Okay, it's a doodle of a car on fire. It's affectionate." },
      ] },
      { tone: 'passive', t: "What else is in there?", r: "Forty-one lost pairs of sunglasses. A bet I'd swim to a buoy. A bet I'd learn a song backwards. I lost that.", opts: [
        { tone: 'cold', t: "Sounds like you lose a lot.", r: "I lose loads! That's the point! Losing's half the fun. You wouldn't get it. You're a winner. Boring." },
        { tone: 'passive', t: "Who do you bet against most?", r: "Juno. Since school. Juno's winning by three. I'm going to win it back with you. Don't ask how." },
        { tone: 'flirty', t: "Can I make a bet with you?", r: "A bet? With me? Oh, you've done it now. Name it. It's going in the book. In capitals." },
      ] },
      { tone: 'flirty', t: "Write that I'm your favourite page.", r: "My favourite page! You can't dictate your own page! ...I've written it. In tiny letters. Don't look.", opts: [
        { tone: 'cold', t: "Actually, scratch that.", r: "You can't scratch things out once I've written them! That's the rule of the book. Fine. 'Changes mind.' Noted." },
        { tone: 'passive', t: "What's the best page you've got?", r: "The ferry captain. They lost a bet to a seagull. You're catching up, though. You're close." },
        { tone: 'flirty', t: "I'm going to fill this whole notebook.", r: "The whole thing? I'll need a second notebook. A bigger one. With a lock. Oh, you're trouble." },
      ] },
    ] },
  { id: 'spark-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "Look! I've given you a page in my notebook. Page four. It's where I write down every bet I've made. Yours has a doodle already.",
    opts: [
      { tone: 'cold', t: "Doodle someone else.", r: "Oh. Okay. That was a little bit mean, Turbo. It's a very nice doodle. I'll just scribble it out. With feeling.", opts: [
        { tone: 'cold', t: "Scribble away.", r: "Scribbled. It's a black cloud now. Your whole page is a black cloud. Enjoy your stormy little page." },
        { tone: 'passive', t: "Sorry. What's the doodle?", r: "A racing car with a heart for a steering wheel. It's not a good doodle. It's a feelings doodle." },
        { tone: 'flirty', t: "Don't scribble. Draw me a better one.", r: "Better? I'm not an artist, I'm a scribbler! Okay. There. That's you winning a race. And me in the crowd." },
      ] },
      { tone: 'passive', t: "What's on my page so far?", r: "Two bets I've made about you, and I've won one. The one about whether you'd talk to me again. You did.", opts: [
        { tone: 'cold', t: "That was a one-off.", r: "A one-off? It's written in pen, it can't be a one-off. ...Okay. I'll add a sad face. A small one." },
        { tone: 'passive', t: "What's the other bet?", r: "Whether you'd ever let me sit in the car. I'm going to win that one. Don't look so worried." },
        { tone: 'flirty', t: "Bet that I'll keep talking to you.", r: "Ha! That's not a bet, that's a promise. I've written it down. In red. Red means it's serious." },
      ] },
      { tone: 'flirty', t: "Can I see the doodle?", r: "No! It's private. ...Fine. It's you. With a helmet. And little hearts. I'm going to be sick. Give it back.", opts: [
        { tone: 'cold', t: "That's a bit much.", r: "A bit much? It's a doodle, not a tattoo! ...That stung. I'm putting the notebook away. Forever. Till Tuesday." },
        { tone: 'passive', t: "It's quite good, actually.", r: "Quite good? It's very good. I gave you a cape. You deserve a cape, Turbo. Probably." },
        { tone: 'flirty', t: "Draw yourself next to me.", r: "Next to you? On your page? That's... that's a big move for a doodle. Okay. There. We're holding a trophy." },
      ] },
    ] },
  { id: 'spark-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "You know what I can't stand? Silence. And last time was very silent. So I'll do the talking. I grew up next to a funfair. Ask me.",
    opts: [
      { tone: 'cold', t: "I don't need your life story.", r: "It's a short story! It has dodgems! ...Okay. That landed. I'm not great at being shushed. Fine. Shushed.", opts: [
        { tone: 'cold', t: "Good. Shushed suits you.", r: "Nothing suits me less than shushed. It's like putting a cat in a raincoat. I'll be over there. Loudly." },
        { tone: 'passive', t: "Sorry. Go on. The funfair.", r: "I lived above the arcade. Fell asleep to the claw machines. Got banned from the dodgems at nine. For excessive joy." },
        { tone: 'flirty', t: "Fine. But I want the funny version.", r: "There's only a funny version! Banned from the dodgems at nine for driving backwards on purpose. You'd have loved me." },
      ] },
      { tone: 'passive', t: "A funfair? Really?", r: "Right by the sea. The arcade was under my window. I can win any claw machine. Any. It's my only real skill.", opts: [
        { tone: 'cold', t: "That's not a real skill.", r: "It's the realest skill there is! You've never felt the claw grab something. Your loss, Turbo. Truly." },
        { tone: 'passive', t: "Prove it some day.", r: "Some day? I'll prove it this week. I'll win you a terrible plush thing and you'll have to keep it forever." },
        { tone: 'flirty', t: "Win me something and I'll keep it on my dashboard.", r: "On your dashboard! I'm going to win you the ugliest thing in the machine. It'll stare at you every lap." },
      ] },
      { tone: 'flirty', t: "Then talk. I like the sound of your voice.", r: "You do? Even after last time? Okay. Okay. I'm melting slightly. Funfair. Sea. Seagulls. Me, aged nine, banned.", opts: [
        { tone: 'cold', t: "Actually, keep it short.", r: "Short? I don't have a short setting. I've got 'loud' and 'louder'. Fine. Banned. The end. Happy?" },
        { tone: 'passive', t: "Banned from what?", r: "The dodgems. I kept driving into the owner. Lovingly. The owner said I'd 'never make a driver'. Joke's on them. I make you watch." },
        { tone: 'flirty', t: "Tell me everything. I'm not going anywhere.", r: "Everything? It'll take years. You'd have to stick around for years, Turbo. ...That came out bigger than I meant." },
      ] },
    ] },
  { id: 'spark-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "Confession: I can't sit still. Never could. I grew up right next to a seaside funfair, so it's in my blood. Candyfloss and sirens.",
    opts: [
      { tone: 'cold', t: "That explains a lot.", r: "Rude! Accurate, but rude. You don't get to be accurate about me yet. You haven't earned it.", opts: [
        { tone: 'cold', t: "I've seen enough.", r: "Seen enough? You've seen about four per cent! The other ninety-six is better. Your loss." },
        { tone: 'passive', t: "Sorry. I meant it nicely.", r: "Did you? Okay. I'll take it. I am a bit much. In a good way. Mostly. Ask anyone." },
        { tone: 'flirty', t: "It explains why you light up a room.", r: "Oh. That's nice. That's annoyingly nice. I'm going to go stand in a corner and light it up a bit." },
      ] },
      { tone: 'passive', t: "What was it like, growing up there?", r: "Loud. Sticky. Brilliant. Banned from the dodgems at nine. And no claw machine has ever beaten me. Not one.", opts: [
        { tone: 'cold', t: "Banned at nine? That's not something to brag about.", r: "It's the best thing I've ever done! You're thinking about it all wrong. The ban was earned. Fine, be dull." },
        { tone: 'passive', t: "Why were you banned?", r: "Driving backwards. On purpose. Into the owner's cousin. Lovingly. I've been a menace on wheels ever since." },
        { tone: 'flirty', t: "I'd have liked to meet nine-year-old you.", r: "No you wouldn't, I bit people. ...But I'd have liked you. I'd have made you drive backwards with me." },
      ] },
      { tone: 'flirty', t: "Then let's do something. Anything. Right now.", r: "Right now? You're speaking my language! ...Wait, are you serious? Because I'll actually do it, Turbo.", opts: [
        { tone: 'cold', t: "Kidding. I'm staying put.", r: "Kidding? You dangled 'anything' in front of a funfair kid and took it away. That's cruel. Cruel and boring." },
        { tone: 'passive', t: "Okay. A walk. Just a walk.", r: "A walk. Fine. A fast walk. With a detour. Possibly two. I don't really do 'just'." },
        { tone: 'flirty', t: "Serious. You pick. I'll follow.", r: "I pick? Oh, you have no idea what you've unleashed. Somewhere with lights and noise. Come on. Quick." },
      ] },
    ] },
  { id: 'spark-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "Want to know a secret? I was raised by a seaside funfair. Flashing lights, sirens, candyfloss. That's why I'm like this. Fizzy.",
    opts: [
      { tone: 'cold', t: "Fizzy. That's one word for it.", r: "One word for it? What's your other word? No, don't tell me. I can see it on your face. It isn't fizzy.", opts: [
        { tone: 'cold', t: "It's 'exhausting'.", r: "Exhausting. Okay. That's going in the notebook in really small sad letters. I'll exhaust someone else." },
        { tone: 'passive', t: "I meant lively. Sorry.", r: "Lively. Fine. You're forgiven. Lively's okay. Fizzy's better. Learn the words, Turbo." },
        { tone: 'flirty', t: "It's 'irresistible', if you must know.", r: "Irresistible! Oh, that's a good word. That's my new favourite word. Say it again. Slowly." },
      ] },
      { tone: 'passive', t: "What was the best bit?", r: "The claw machines. I can win any of them. Any. I've won forty-three teddies. They live in a cupboard. It's crowded.", opts: [
        { tone: 'cold', t: "Forty-three teddies? That's a lot of clutter.", r: "Clutter?! They're family! Don't let them hear you. They're very sensitive. You've upset Gerald." },
        { tone: 'passive', t: "Teach me the trick.", r: "Never. It's a sacred secret. Unless you win me something first. Then maybe. If you win something good." },
        { tone: 'flirty', t: "Win me one. I'll name it after you.", r: "Name it after me? You'll be cuddling a teddy called {first}? That's... that's adorable. I'm winning you three." },
      ] },
      { tone: 'flirty', t: "So that's why you're the most fun person here.", r: "Most fun person here? I'm the most fun person anywhere. But thank you for noticing. You're very observant.", opts: [
        { tone: 'cold', t: "Most tiring person here, too.", r: "Tiring? You can't say fun and tiring in the same breath. That's a sneak attack. Ouch, Turbo." },
        { tone: 'passive', t: "Don't let it go to your head.", r: "Too late, it's gone. It's having a party up there. ...Fine, it's come back down. Partially." },
        { tone: 'flirty', t: "Most fun, most gorgeous, take your pick.", r: "Both! I'm taking both! I'm not a pick-one sort of person. Greedy and proud. Thanks, Turbo." },
      ] },
    ] },
  { id: 'spark-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "Hi. You've been chilly, so here's a warm-up: race you to the gate. I'll even leave Banana, my scooter, behind. Loser does a victory dance.",
    opts: [
      { tone: 'cold', t: "I'm not racing you. I race for a living.", r: "Oh, the professional card. Big scary professional. Fine. I'll race a pigeon. Pigeons are fun. Unlike some.", opts: [
        { tone: 'cold', t: "Enjoy the pigeon.", r: "I will. Me and the pigeon are best friends now. You're not invited to the wedding." },
        { tone: 'passive', t: "Fine. Short race.", r: "Short race! Ready, set— I'm already gone! Cheating's allowed when you've been frosty. Catch me if you can!" },
        { tone: 'flirty', t: "Only if you promise to do the dance either way.", r: "Either way? You want to see my dance? I'm not even cross any more. It's a very good dance. It has a spin." },
      ] },
      { tone: 'passive', t: "Fine. To the gate.", r: "You said fine like a tax form, but I'll take it! Three, two— I went on two! Rules are for sad people! Run!", opts: [
        { tone: 'cold', t: "This is stupid.", r: "Stupid is a strong word for 'fun'. Fine. Walk. I'll wait at the gate. Doing my victory dance. Alone." },
        { tone: 'passive', t: "You cheated. I demand a rematch.", r: "A rematch? So you do care! I knew it. Next time, I'll go on three. Probably. Maybe four." },
        { tone: 'flirty', t: "I let you win. I wanted to see the dance.", r: "You didn't let me, I won! ...Okay, you did. I'm not cross any more. It's hard to be cross and dance." },
      ] },
      { tone: 'flirty', t: "Loser does the dance? I'll lose on purpose.", r: "On purpose? You want to dance for me? Okay, that's brilliant. The frost is officially defrosting.", opts: [
        { tone: 'cold', t: "Never mind. I'm not dancing.", r: "Not dancing? You can't promise a dance and back out! That's the worst kind of backing out!" },
        { tone: 'passive', t: "Fine. But don't film it.", r: "No filming. I'll just remember it. Forever. In vivid detail. And describe it to everyone. Better than filming." },
        { tone: 'flirty', t: "I'll dance. But you have to dance with me.", r: "With you? That's not a forfeit, that's a reward. Gate's that way. Last one there leads." },
      ] },
    ] },
  { id: 'spark-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "Race you to the gate! No scooter, Banana stays parked. Loser does the winner's victory dance. Mine's got a spin and a kick. Ready? Set—",
    opts: [
      { tone: 'cold', t: "No. I'm not running anywhere.", r: "Not running? You're a racer! It's literally your thing! ...Fine. I'll run alone and do my dance alone. Like a hero.", opts: [
        { tone: 'cold', t: "Go on, then.", r: "I'm going! Watch me go! Look how fast I am! ...You're not watching. That's the worst part of losing to nobody." },
        { tone: 'passive', t: "Fine. But walking.", r: "Walking? That's the slowest race ever invented. ...Okay, I'll walk fast. Very fast. Speed-walking champion." },
        { tone: 'flirty', t: "I'll stay here and watch you run. That's my favourite view.", r: "Watching me run? That's weirdly sweet and a little suspicious. Fine. Cheer loudly. I need fans." },
      ] },
      { tone: 'passive', t: "Go!", r: "YES! ...Oh, you're fast. You're actually fast. Why are you so fast? I lost! I never lose! Okay. Dance time. Mine.", opts: [
        { tone: 'cold', t: "I won. No dance needed.", r: "No dance? A win's not a win without a dance! You've had a victory and wasted it. Tragic." },
        { tone: 'passive', t: "Fine. Show me the victory dance.", r: "Spin, kick, little shimmy... and a bow. There. Now you do it. Exactly like that. No mercy." },
        { tone: 'flirty', t: "Do the dance anyway. I want to see it.", r: "You want my dance? As a winner? That's not how it works! ...Oh, fine. Spin, kick, shimmy. For you." },
      ] },
      { tone: 'flirty', t: "Then I'm losing. Very slowly.", r: "Very slowly! I see. You're not a racer, you're a tease. I love a tease. Ready, set, GO—", opts: [
        { tone: 'cold', t: "I changed my mind.", r: "You can't change your mind mid-race! I was already running! Now I'm the only one running and I look mad!" },
        { tone: 'passive', t: "Fine. Go!", r: "Gone! ...Wait. You're walking. On purpose. You actually lost on purpose. Okay. Dance, Turbo. Spin first." },
        { tone: 'flirty', t: "Go on. I'll catch you.", r: "Catch me? Nobody catches me! I'm slippery! ...You caught me. How did you— okay. Okay. Draw. We both dance." },
      ] },
    ] },
  { id: 'spark-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "Turbo! Have you met Banana? My scooter. Bright yellow. Very fast. Banana versus your legs, from here to the gate. Go?",
    opts: [
      { tone: 'cold', t: "That's not a fair race.", r: "It's not supposed to be fair, it's supposed to be fun! ...Okay, that came out flatter than I meant. Hmph.", opts: [
        { tone: 'cold', t: "Then I'm not racing.", r: "Banana's very disappointed. So am I. We're leaving together. Without you. Toot toot." },
        { tone: 'passive', t: "Fine. Head start for me.", r: "Head start! Fine. I'll count to five. One, two, three-four-five! Go! Banana's coming for you!" },
        { tone: 'flirty', t: "Only if I get to ride on the back.", r: "On the back? With me? Banana's never had a passenger! ...Okay. You can hold on. Tightly. For safety." },
      ] },
      { tone: 'passive', t: "You named your scooter Banana?", r: "It's yellow! What else would I call it? Banana's been with me through everything. Three flat tyres and a pond.", opts: [
        { tone: 'cold', t: "That's ridiculous.", r: "Ridiculous? Banana heard that. Banana's never forgiving you. ...Neither am I. For at least an hour." },
        { tone: 'passive', t: "A pond?", r: "Long story. I lost a bet. Juno said I wouldn't ride through a puddle. It wasn't a puddle. It was a pond." },
        { tone: 'flirty', t: "Banana and I are going to be best friends.", r: "Banana's very picky about friends. But I think you're in. You've got a Banana-friendly face." },
      ] },
      { tone: 'flirty', t: "I'd race anything for you. Even a fruit.", r: "A fruit! Banana is not a fruit, Banana is a lifestyle. ...But that's very sweet. Okay. Gate. Go!", opts: [
        { tone: 'cold', t: "On second thought, I'll pass.", r: "Pass? You can't pass on Banana. Nobody passes on Banana. You've broken my heart and Banana's." },
        { tone: 'passive', t: "Fine. Ready when you are.", r: "Ready, set... Banana went first! Banana can't wait! ...You're catching up! How?! You're a menace!" },
        { tone: 'flirty', t: "Loser buys the winner a smoothie.", r: "A smoothie? A banana smoothie? That's cannibalism! Banana's horrified. I'm delighted. You're on." },
      ] },
    ] },
  { id: 'spark-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "Right, I've been sulking long enough. I'm challenging you to karting. Officially. In writing. I wrote it on a napkin. It's binding.",
    opts: [
      { tone: 'cold', t: "I don't race karts.", r: "You don't race karts? You're a racer! That's like a chef refusing to boil an egg. ...Fine. Napkin torn in half.", opts: [
        { tone: 'cold', t: "Good. Bin the napkin.", r: "Binned. Like your chances of being fun. Okay, that one was harsh. I'm harsh when I'm hurt, Turbo." },
        { tone: 'passive', t: "Sorry. Okay. One race.", r: "One race! I'll take one. One is all I need to crush you. And stop frowning. Frowning adds weight. It's science." },
        { tone: 'flirty', t: "I'll race you. But the napkin's mine.", r: "The napkin's yours? You want to keep my napkin? ...Okay. That's sweet. Don't get big-headed about it." },
      ] },
      { tone: 'passive', t: "Fine. When and where?", r: "The place by the river. Thursday. Loser sings a song of the winner's choice at the counter. Loudly.", opts: [
        { tone: 'cold', t: "No singing.", r: "No singing? Fun-sponge. Just racing, then. I'm still winning. Silently. Very smugly." },
        { tone: 'passive', t: "Fine. But I'm picking a long song.", r: "Pick what you like, you won't need it. I've been practising. Twice. In my head." },
        { tone: 'flirty', t: "Deal. And the winner picks where we go after.", r: "Winner picks? Ooh. I've already got somewhere in mind. Start sweating, Turbo. It's very fancy." },
      ] },
      { tone: 'flirty', t: "In writing? Then I'll sign it with a kiss.", r: "A kiss? On my napkin? ...Fine. But a pretend kiss. A napkin kiss. I'm still a bit cross, remember?", opts: [
        { tone: 'cold', t: "Never mind. No napkin kissing.", r: "No kissing, no racing, no fun. That's a lot of no, Turbo. I'll fold my napkin very sadly." },
        { tone: 'passive', t: "Just a signature, then.", r: "There. Signed. Witnessed by me. Karting. Thursday. Bring your excuses, you'll need them." },
        { tone: 'flirty', t: "A real one, if you win.", r: "If I win? You're betting a kiss? Oh, I'm winning. I'm winning so hard. You've just made it serious." },
      ] },
    ] },
  { id: 'spark-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "Formal challenge: karting, after the race weekend. Loser has to sing a song of the winner's choice. I've written it on a napkin. Sign.",
    opts: [
      { tone: 'cold', t: "I don't sign napkins.", r: "You sign autographs all day! Hats, shirts, babies' heads! But not my napkin? Ouch, Turbo.", opts: [
        { tone: 'cold', t: "Babies' heads?", r: "It happens! I've seen it! ...Okay, you're right, it was a melon. You're still not fun." },
        { tone: 'passive', t: "Fine. Where do I sign?", r: "Bottom left. Next to my doodle of you losing. Don't look at the doodle. It's not flattering." },
        { tone: 'flirty', t: "I'll sign your napkin if you sign my hand.", r: "Your hand? Like a fan? I'm writing 'I'll win'. In big letters. Hold still. You're wobbling." },
      ] },
      { tone: 'passive', t: "What kind of karts?", r: "The fast kind. With a bumpy track and a terrible snack bar. I've been banned twice. But they always let me back.", opts: [
        { tone: 'cold', t: "You keep getting banned.", r: "Only twice! It's a very low number for me. You don't know my history. You should be impressed." },
        { tone: 'passive', t: "Fine. I'll sign.", r: "Signed! It's official. Thursday. I'm going to crush you and you'll love it. Okay, maybe not love it. Enjoy it." },
        { tone: 'flirty', t: "I'll sign if you promise not to cheat.", r: "Promise not to cheat? I can't promise that. That's half my strategy. I'll cheat a little. Lovingly." },
      ] },
      { tone: 'flirty', t: "Make it best of three. I want more time with you.", r: "More time? Best of three is ages! ...Okay, it's very flattering. But I'm still winning all three.", opts: [
        { tone: 'cold', t: "Best of one. I'm busy.", r: "Best of one? That's barely a race. That's a warm-up. Fine. One race. One crushing." },
        { tone: 'passive', t: "Fine. Best of three.", r: "Best of three! Very serious. We'll need snacks between rounds. I'm in charge of snacks." },
        { tone: 'flirty', t: "Best of five. I'll make it last.", r: "Best of five! You're mad! ...I love it. The loser sings five songs. I'm picking the worst ones." },
      ] },
    ] },
  { id: 'spark-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "Okay, I've got a proper challenge. Karting. You and me. Loser sings. Winner gets to pick something. Anything. It's all on this napkin.",
    opts: [
      { tone: 'cold', t: "I'm not wasting my day off on karts.", r: "Wasting? It's not a waste, it's an adventure! Ugh. You've stomped on a perfectly good napkin. Rude.", opts: [
        { tone: 'cold', t: "It's a napkin.", r: "It's a contract! But fine. I'll find someone else who respects napkins. There's loads of them." },
        { tone: 'passive', t: "Fine. One race.", r: "One race. I'll take it. You're going to lose so hard you'll sing a power ballad. Without irony." },
        { tone: 'flirty', t: "For you, I'll waste every day off I've got.", r: "Every day off? You'll be karting till you're ninety. ...That's a lovely mental image. You old and grumpy. Me winning." },
      ] },
      { tone: 'passive', t: "Anything? What do you want if you win?", r: "Oh, I've got a list. It starts with you letting me wear your helmet. It ends with something I'm not saying yet.", opts: [
        { tone: 'cold', t: "Not the helmet.", r: "Not the helmet? It's just a helmet! ...Okay, it's a sacred helmet. I respect it. Grudgingly." },
        { tone: 'passive', t: "And what's at the end?", r: "Can't tell you. It's a secret. It's at the bottom of the napkin. In invisible ink. Win and you'll see." },
        { tone: 'flirty', t: "I'll lose just to find out.", r: "Lose on purpose? That's cheating! ...But very sweet cheating. You've won the napkin. Losing the race." },
      ] },
      { tone: 'flirty', t: "If I win, I get to pick our next adventure.", r: "Our next adventure? Not a race, an adventure? You're my kind of trouble. A dangerous amount of it. Deal.", opts: [
        { tone: 'cold', t: "Forget it. I'll pick nothing.", r: "You'd pick nothing? You'd win and pick nothing? That's the worst prize ever. You're wasting a napkin." },
        { tone: 'passive', t: "Something simple. A coffee.", r: "A coffee? That's not an adventure, that's a coffee. ...But with you, it might be. Fine. Coffee. Big one." },
        { tone: 'flirty', t: "Somewhere neither of us has ever been.", r: "Somewhere new? Together? Oh, I'm packing already. I'm going to lose on purpose. Don't tell anyone." },
      ] },
    ] },
  { id: 'spark-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "Okay. Honest moment. I don't usually chase people. I'm the one who gets chased. But you keep going cold on me and I keep coming back.",
    opts: [
      { tone: 'cold', t: "Then stop coming back.", r: "Oh. Okay. That's clear. That's very, very clear. ...I'll stop, then. Notebook closed. Page four done.", opts: [
        { tone: 'cold', t: "Good.", r: "Good. Fine. Great. I'll go and be chased by someone who likes it. Bye, Turbo. Or whatever." },
        { tone: 'passive', t: "I didn't mean that. Sorry.", r: "Didn't you? Okay. Because I like this. Whatever this is. Just stop being a fridge. Please." },
        { tone: 'flirty', t: "I like it when you come back.", r: "You do? Then show it once in a while! A wave! A wink! A smoke signal! I'm not a mind-reader." },
      ] },
      { tone: 'passive', t: "I'm sorry. I'm bad at this.", r: "I know you are. It's almost charming. Almost. So let's make it easy. Next time, you chase me. Deal?", opts: [
        { tone: 'cold', t: "I don't chase anyone.", r: "Then you'll lose me. I'm fast, Turbo. Faster than Banana. Okay, not faster than Banana." },
        { tone: 'passive', t: "I'll try.", r: "Try hard. I'll be running in very slow circles. Very easy to catch. If you bother." },
        { tone: 'flirty', t: "I'll chase you. Promise.", r: "Promise? In front of the notebook? ...Okay. Run, then. I'm already three steps ahead." },
      ] },
      { tone: 'flirty', t: "Then let me chase you for a change.", r: "Oh, you've finally said something sensible. Fine. I'll give you a head start. A tiny one. Ready?", opts: [
        { tone: 'cold', t: "Actually, never mind.", r: "Never mind? You can't offer a chase and take it back! I'm going to sulk for a year! Two!" },
        { tone: 'passive', t: "Okay. Next time I'll find you.", r: "Find me. I'll be loud. You'll hear me. Everyone always hears me. Don't be late." },
        { tone: 'flirty', t: "Run. I'm right behind you.", r: "Running! Look at me run! ...You're actually behind me. You're actually chasing me. Okay. This is fun." },
      ] },
    ] },
  { id: 'spark-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "So. We keep bumping into each other. I think next time it shouldn't be a bump. I think it should be a plan. Your move, Turbo.",
    opts: [
      { tone: 'cold', t: "I don't do plans.", r: "You don't do plans? Everyone does plans! ...Oh. I see. Okay, Turbo. Bumps it is. Rarely.", opts: [
        { tone: 'cold', t: "Rarely's fine.", r: "Rarely. Okay. I'll be rarely around, then. You'll miss me. You won't say it, but you will." },
        { tone: 'passive', t: "Sorry. A plan. Okay. Let's make one.", r: "Really? Okay! A plan! I'm writing it in the notebook. 'Turbo has a plan. Unbelievable.'" },
        { tone: 'flirty', t: "I'll do plans for you.", r: "For me? Oh, that's a good answer. A very good answer. I'll make the plan. You'll just turn up." },
      ] },
      { tone: 'passive', t: "What kind of plan?", r: "A proper one. You, me, somewhere with no team and no cameras. I'll handle the rest. You just say yes.", opts: [
        { tone: 'cold', t: "No thanks.", r: "No thanks. Oh. Okay. That's polite and devastating. I'll go back to bumping, then." },
        { tone: 'passive', t: "Okay. I'll say yes.", r: "You said yes! You actually said yes! Juno owes me twenty quid! I mean— lovely. Very calm. Very normal." },
        { tone: 'flirty', t: "Yes. Make it a long plan.", r: "A long plan! You want a long plan? Okay. I'm making it as long as possible. It might last all week." },
      ] },
      { tone: 'flirty', t: "My move? Here it is. Your number, please.", r: "Smooth! Very smooth. ...Here. Don't text me something boring. I'll know. I always know.", opts: [
        { tone: 'cold', t: "Actually, I'll get it some other time.", r: "Some other time? You asked and then unasked! That's a new low. I'll keep my number. In a vault." },
        { tone: 'passive', t: "Thanks. I'll text you.", r: "You'd better. Something funny. No 'hi'. 'Hi' is banned. Write something worth reading, Turbo." },
        { tone: 'flirty', t: "I'll text you before you get home.", r: "Before I get home? I'm on Banana, that's eight minutes! ...Go on. Beat me. I dare you." },
      ] },
    ] },
  { id: 'spark-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "I'll be honest. I don't usually get chased this nicely. You're very good at it. Too good. I might have to let you catch me.",
    opts: [
      { tone: 'cold', t: "I'm not chasing you.", r: "Oh. Okay. I thought— okay, I read that wrong. That stings. I'll stop running then. Nobody's behind me.", opts: [
        { tone: 'cold', t: "You read it wrong.", r: "Clearly! I'll go and be embarrassed somewhere private. Like a cupboard. With my notebook." },
        { tone: 'passive', t: "I meant, I'm not done yet.", r: "Oh! Oh, that's better. That's much better. You nearly gave me a fright, Turbo. Not done yet. Okay." },
        { tone: 'flirty', t: "I'm not chasing. I'm already right beside you.", r: "Beside me? You sneaky— you're right. You're right here. When did that happen? I didn't hear you coming." },
      ] },
      { tone: 'passive', t: "Let me catch you, then.", r: "Let you? That's not how chasing works! You have to earn it! ...Okay, fine. Caught. Mostly. Partially.", opts: [
        { tone: 'cold', t: "On second thought, no.", r: "You can't let go mid-catch! That's against every rule of chasing! I'm going to be a bit cross about that." },
        { tone: 'passive', t: "Caught. Now what?", r: "Now what? Oh, I've got ideas. Hundreds. They're all in the notebook. We'll start with page five." },
        { tone: 'flirty', t: "Caught. And I'm not letting go.", r: "Not letting go? Oh, I'm in trouble. Good trouble. The best kind of trouble. Hold on, then." },
      ] },
      { tone: 'flirty', t: "I knew you'd say that eventually.", r: "You knew? How did you— okay, you're smug now. Smug suits you. I hate that it suits you.", opts: [
        { tone: 'cold', t: "Don't get your hopes up.", r: "My hopes are up and they're staying up. You can't knock them down with that. Try harder. Or don't." },
        { tone: 'passive', t: "I'm just good at reading people.", r: "Read me, then. What am I thinking? ...Wrong. Totally wrong. It was something much nicer." },
        { tone: 'flirty', t: "And now I'm not going to stop.", r: "Don't stop. Please don't stop. This is the most fun I've had in ages, Turbo. Chapter one, done." },
      ] },
    ] },
];
