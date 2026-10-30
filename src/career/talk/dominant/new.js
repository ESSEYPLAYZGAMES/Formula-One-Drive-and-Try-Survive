// DOMINANT - in person, stage new: power-play sparring. They take charge, set the terms, keep score. Plain data.
export const DATA = [
  {
    id: 'dominant-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: ["You were short with me last time. I'm told I have that effect. We're starting again. I'm {first}. Stand there.", "Last time you gave me about four words. I counted. Let's start over - I'm {first}, and you're standing in my light."],
    opts: [
      { tone: 'cold', t: "I'm fine where I am.", r: "Good. Most people move when I tell them to. Stay put - I'll come to you. That doesn't happen often.", opts: [
        { tone: 'cold', t: "Or you could not.", r: "I could. I won't. But I'll leave you to it tonight - I know a shut door when I see one. For now." },
        { tone: 'passive', t: "Fine. {me}. Hello.", r: "There. Two words and a name. Progress. Next time, aim for a full sentence." },
        { tone: 'flirty', t: "Come closer, then.", r: "There it is. I knew there was a pulse under the frost. Closer it is." },
      ] },
      { tone: 'passive', t: "Sorry. Long day. I'm {me}.", r: "I know who you are. Apology accepted - once. Long days don't work as an excuse twice.", opts: [
        { tone: 'cold', t: "I don't need your acceptance.", r: "No. You don't. Keep the edge, then. I'll find out what's behind it another night." },
        { tone: 'passive', t: "Fair. So what's your story, {first}?", r: "I'm a {job}. I run things. Usually other people. Tonight, apparently, I'm running this." },
        { tone: 'flirty', t: "Then let me make it up to you.", r: "You will. I'll decide how. Start by staying exactly where you are." },
      ] },
      { tone: 'flirty', t: "Short? I was saving my words for you.", r: "Smooth. You're forgiven, provisionally. Don't spend them all at once.", opts: [
        { tone: 'cold', t: "Actually, I wasn't.", r: "Ha. Honest. Then I withdraw the forgiveness. Earn it back - I'll be watching." },
        { tone: 'passive', t: "I'm better at second meetings.", r: "Everyone is. I'm better at first ones. We'll call tonight a draw." },
        { tone: 'flirty', t: "I'll spend every one of them on you.", r: "Good. I'll hold you to it. I hold people to things. It's one of my finer qualities." },
        { tone: 'risque', t: "Spend the rest somewhere quieter?", r: "Not a chance. Not yet. I set the pace, and I've barely met you. Ask again when I say so." },
      ] },
    ],
  },
  {
    id: 'dominant-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: ["We were introduced badly. Let's do it again, properly. I'm {first}. You stand there - the light's better.", "That introduction earlier was a mess. I'm redoing it. {first}. Stand on my left - the light's better there."],
    opts: [
      { tone: 'cold', t: "I'm good here, thanks.", r: "Are you. Fine. Then I'll move. Note that I don't, usually.", opts: [
        { tone: 'cold', t: "Don't put yourself out.", r: "I won't. Enjoy your spot, {me}. I'll be over there, being much better company." },
        { tone: 'passive', t: "Okay, okay. Hi. I'm {me}.", r: "I know. I watched you qualify. There - now we've both done the polite part." },
        { tone: 'flirty', t: "I liked watching you decide.", r: "You liked watching me lose an argument. Don't get used to it. Stand closer." },
      ] },
      { tone: 'passive', t: "Hi. Better light, sure. I'm {me}.", r: "I know. I watched {last}. You brake early into the slow corners. You're better than your car.", opts: [
        { tone: 'cold', t: "I didn't ask for notes.", r: "You didn't. I'll keep the rest to myself, then. They were good notes. Your loss." },
        { tone: 'passive', t: "You actually watched?", r: "All of it. Your best lap was the twelfth. Next time tell me how you did it. I'll decide if I believe you." },
        { tone: 'flirty', t: "So you've been watching me.", r: "Closely. Don't let it go to your head. Let it go somewhere useful." },
      ] },
      { tone: 'flirty', t: "You could've just said you wanted me closer.", r: "I just did. And you moved. Good. You take direction well.", opts: [
        { tone: 'cold', t: "Don't count on it.", r: "I don't get used to things. I win them fresh each time. Good night." },
        { tone: 'passive', t: "Fine, you're in charge. For now.", r: "'For now.' Sweet. We'll renegotiate later, and I'll win that too." },
        { tone: 'flirty', t: "I take direction from very few people.", r: "Then you're in excellent company. Closer. There. That's the spot." },
        { tone: 'risque', t: "Direct me somewhere quieter, then.", r: "Bold. I like bold. Not tonight - I set the pace, and the pace is slow. Deliberately." },
      ] },
    ],
  },
  {
    id: 'dominant-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: ["You again. Good. I was hoping. Come and stand here - the light's kinder on you.", "There you are. I'd hoped you'd come. Here, next to me, in the good light. Now."],
    opts: [
      { tone: 'cold', t: "The light's fine where I am.", r: "Then I'll come to you. Don't get used to that - I don't do it twice.", opts: [
        { tone: 'cold', t: "You don't have to.", r: "I know. I choose to. And now I'm choosing to go. Enjoy your light." },
        { tone: 'passive', t: "Fine. Hi. Again.", r: "Hi. There - civilised. I'll take civilised tonight and something better next time." },
        { tone: 'flirty', t: "Once is enough if you do it right.", r: "Then watch closely. I always do it right." },
      ] },
      { tone: 'passive', t: "Hi. Okay - next to you it is.", r: "Good. That's how this works: I say, you consider, you agree. You agreed fast. I like that.", opts: [
        { tone: 'cold', t: "Don't push it.", r: "Fair. Pushed, and noted. I'll be gentler next time. Probably." },
        { tone: 'passive', t: "What do I get for agreeing?", r: "My full attention. It's more than it sounds. Ask anyone who's had it." },
        { tone: 'flirty', t: "I'd agree to a lot, standing here.", r: "Careful. I write things down. Then I collect." },
      ] },
      { tone: 'flirty', t: "Hoping, were you?", r: "Always. I don't leave things to chance, but I do allow myself to hope. Rarely. Tonight.", opts: [
        { tone: 'cold', t: "Don't hope too hard.", r: "Too late. The hoping's done. Now I'll just wait and see what you do with it. Elsewhere, apparently." },
        { tone: 'passive', t: "Well, here I am.", r: "Here you are. Exactly where I wanted you. Things are going very well for me." },
        { tone: 'flirty', t: "Hope's not your style. Admit you planned it.", r: "Planned it to the minute. You arrived three minutes late. I forgive you." },
        { tone: 'risque', t: "Plan the rest of the night too?", r: "I already have. You don't get to see the plan. You just get to find out, one step at a time." },
      ] },
    ],
  },
  {
    id: 'dominant-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: ["You don't have to like me. You do have to hear this: you defended into turn one far too late.", "I watched {last}. You were cold with me last time, so I'll be blunt: turn one, you left the door open."],
    opts: [
      { tone: 'cold', t: "I don't need driving tips from you.", r: "No? The replay disagrees. Keep your pride. I'll keep the notes.", opts: [
        { tone: 'cold', t: "I'll keep ignoring them.", r: "Do. I'll keep them in a drawer. Labelled. Good night." },
        { tone: 'passive', t: "Okay. What would you have done?", r: "Moved over a braking zone earlier. Made them commit. Then made them regret committing." },
        { tone: 'flirty', t: "You've been studying me, then.", r: "Studying is a strong word. Memorising. Every lap. Don't flatter yourself. Do, a little." },
      ] },
      { tone: 'passive', t: "You're right, I left a gap.", r: "Good. Admitting it is the first step. The second is never doing it again.", opts: [
        { tone: 'cold', t: "Thanks for the lecture.", r: "It wasn't a lecture. It was free. The next one costs you dinner. Or nothing at all - your choice." },
        { tone: 'passive', t: "You'd make a good engineer.", r: "I'd make a terrifying engineer. You'd win everything and hate me. Probably worth it." },
        { tone: 'flirty', t: "Coach me, then.", r: "Gladly. Lesson one: never let anyone past who you'd rather have chasing you." },
      ] },
      { tone: 'flirty', t: "You watched me that closely?", r: "I don't do anything halfway. Watching you included.", opts: [
        { tone: 'cold', t: "It's still not your business.", r: "Fine. It isn't. I'll stop narrating your race. Out loud, anyway." },
        { tone: 'passive', t: "I'm flattered. And stung.", r: "Both are fine. Stung means you care. Flattered means I'm doing it right." },
        { tone: 'flirty', t: "Watch me closer at {track}.", r: "I will. Front row of my sofa. And if you leave turn one open again, I'll know." },
      ] },
    ],
  },
  {
    id: 'dominant-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: ["I watched {last}. Turn one, you defended a fraction late. I'd have gone earlier. Then won.", "Your race. Let's discuss it. You were brilliant for forty laps and polite for one. The polite one cost you."],
    opts: [
      { tone: 'cold', t: "Have you ever driven a racing car?", r: "No. I've never lost a race in one either. Draw your own conclusions.", opts: [
        { tone: 'cold', t: "That's not how it works.", r: "It's exactly how it works. But I'll drop it. You're clearly not in the mood to be right." },
        { tone: 'passive', t: "Fair. Turn one was sloppy.", r: "It was. Good - you can hear it. Most people can't. Most people bore me." },
        { tone: 'flirty', t: "You'd be terrifying behind the wheel.", r: "I'm terrifying everywhere. The wheel would be a formality." },
      ] },
      { tone: 'passive', t: "Fair. I hesitated.", r: "I know. I saw it. Hesitating is fine. Doing it where they can see is not.", opts: [
        { tone: 'cold', t: "Nobody's perfect.", r: "I'm working on it. You should be too. Night, {me}." },
        { tone: 'passive', t: "Do you always analyse people?", r: "Only the interesting ones. I don't lose, you see. I occasionally fail to win. Studying helps." },
        { tone: 'flirty', t: "Keep watching. I'll give you something better.", r: "I'll hold you to that. I'll be watching the start. Don't you dare be polite." },
      ] },
      { tone: 'flirty', t: "You talk like you'd beat me.", r: "At most things? Yes. Racing? Give me a week and a car. You'd be nervous.", opts: [
        { tone: 'cold', t: "I wouldn't be.", r: "Then you'd be wrong, and I'd be gracious about it. For about a second. Good night." },
        { tone: 'passive', t: "Maybe. What else are you good at?", r: "Deciding. Winning. Knowing when to stop talking. That last one's optional." },
        { tone: 'flirty', t: "I'd let you think you were winning.", r: "Nobody lets me do anything. But I'd enjoy watching you try." },
        { tone: 'risque', t: "Beat me at something else, then.", r: "Name it. No - I'll name it. Later. When you're not expecting it." },
      ] },
    ],
  },
  {
    id: 'dominant-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: ["I watched {last}. All of it. Your onboard is excellent company. Your defending into turn one is not.", "Your onboard from {last} was wonderful to watch. Until turn one. We need to talk about turn one."],
    opts: [
      { tone: 'cold', t: "I'll pass on the critique.", r: "You can pass. You can't stop me thinking it. I'll think it quietly. Somewhere else.", opts: [
        { tone: 'cold', t: "Do that.", r: "I will. I know when to leave the pit wall. Good night." },
        { tone: 'passive', t: "Fine. Quickly.", r: "Brake later, defend earlier, smile less at the cameras. That's the whole note. You're welcome." },
        { tone: 'flirty', t: "Only if you say it nicely.", r: "I don't do nicely. I do accurately. Accurately: you're better than that corner." },
      ] },
      { tone: 'passive', t: "Okay, coach. What went wrong?", r: "You defended the outside and left them the inside. Never give anyone a door you don't want them through.", opts: [
        { tone: 'cold', t: "It's racing. It happens.", r: "It happens to other people. I'd prefer it didn't happen to you. Fine. Night." },
        { tone: 'passive', t: "Noted. Anything I did right?", r: "Everything after lap thirty. You stopped being careful and started being yourself. Do that from lap one." },
        { tone: 'flirty', t: "Do you give everyone this attention?", r: "No. You should be thrilled. Or nervous. Ideally both." },
      ] },
      { tone: 'flirty', t: "You were watching my onboard?", r: "Twice. Once for the race. Once for no reason I'm prepared to say out loud.", opts: [
        { tone: 'cold', t: "That's slightly much.", r: "It's thorough. But fine - I'll dial it back. You'll miss it." },
        { tone: 'passive', t: "What was the second time for?", r: "Research. Purely. I'll let you know what I find." },
        { tone: 'flirty', t: "Say it out loud.", r: "No. You'll have to earn that one. You've got a head start. Don't waste it." },
        { tone: 'risque', t: "Watch the real thing up close sometime.", r: "Bold. I'll come when I decide to, and you'll know it. Sit tight." },
      ] },
    ],
  },
  {
    id: 'dominant-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: ["You've got that face on. My grandmother wore it across a chessboard. She taught me at six and never once let me win.", "Frosty again. Fine. My grandmother taught me chess at six. Never let me win, not once. I know how to wait out a cold front."],
    opts: [
      { tone: 'cold', t: "Sounds like a lovely childhood.", r: "It was a superb childhood. I lost every game for thirteen years. Then I didn't. Sarcasm noted.", opts: [
        { tone: 'cold', t: "Still not interested.", r: "Fine. She'd have liked you - she respected people who didn't fold. I'll leave you to it." },
        { tone: 'passive', t: "What happened after thirteen years?", r: "I beat her. Nineteen. She framed the board and hung it in her hall. Then demanded a rematch." },
        { tone: 'flirty', t: "Did she teach you to stare like that too?", r: "Every bit of it. She'd be pleased it's working on you. Don't tell me it isn't." },
      ] },
      { tone: 'passive', t: "Never once? That's tough.", r: "Tough is the point. When I finally won, it meant something. Nothing handed to me ever has.", opts: [
        { tone: 'cold', t: "Or it made you hard to be around.", r: "Possibly. People manage. You're managing now - barely. Good night." },
        { tone: 'passive', t: "Do you still play her?", r: "Every Sunday. She's eighty-three and ruthless. I win about half. I've never been prouder of a record." },
        { tone: 'flirty', t: "So you play for keeps.", r: "Always. And I don't fold. Remember that next time you try to stare me down." },
      ] },
      { tone: 'flirty', t: "Did she teach you to look at people like that?", r: "Like what? Like I'm already three moves ahead? Yes. And I am.", opts: [
        { tone: 'cold', t: "I don't play games.", r: "Everyone plays. Some people just lose quietly. But fine - I'll stop pushing tonight." },
        { tone: 'passive', t: "Three moves ahead of what?", r: "This conversation. Where it goes next. Where you'll be standing when it ends. Near me, ideally." },
        { tone: 'flirty', t: "Then you know my next move.", r: "I do. You'll pretend you weren't going to stay. Then you'll stay." },
      ] },
    ],
  },
  {
    id: 'dominant-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: ["You don't play chess. I can tell. My grandmother taught me at six. Not once did she let me win.", "My grandmother taught me chess when I was six. She never let me win. Not once. You should know that about me early."],
    opts: [
      { tone: 'cold', t: "Why should I care?", r: "You shouldn't. It's a warning, not a story. Some people need one.", opts: [
        { tone: 'cold', t: "Consider me warned.", r: "Good. Most people stay anyway. We'll see if you're most people." },
        { tone: 'passive', t: "Okay. A warning about what?", r: "That I don't let people win either. Even ones I like. Especially those." },
        { tone: 'flirty', t: "Warn me some more.", r: "I don't lose. I don't fold. I don't forget a good face. That's three. That's plenty." },
      ] },
      { tone: 'passive', t: "That's harsh. Did you ever win?", r: "At nineteen. She framed the board. Then she beat me the following Sunday, just to keep me honest.", opts: [
        { tone: 'cold', t: "Sounds exhausting.", r: "It was. It made me who I am. You can decide later whether that's a compliment to her." },
        { tone: 'passive', t: "I'd have liked to meet her.", r: "She'd have grilled you for an hour and told me you'll do. She doesn't say that often." },
        { tone: 'flirty', t: "So you've been chasing wins ever since.", r: "Not chasing. Collecting. I collect them. You're looking rather collectable." },
      ] },
      { tone: 'flirty', t: "Teach me. I'll let you win.", r: "You'd let me win? That's the most insulting thing anyone's said to me in a month. I'm charmed.", opts: [
        { tone: 'cold', t: "I'd beat you anyway.", r: "You wouldn't. But keep believing it. Some delusions are good for a driver. Night." },
        { tone: 'passive', t: "Okay, I won't let you.", r: "Better. Then it'll take a while, and I'll enjoy every move." },
        { tone: 'flirty', t: "I'd let you win at most things.", r: "Most. Interesting word. I'll find out which ones you don't." },
        { tone: 'risque', t: "Teach me somewhere private.", r: "Private is earned, not offered. You're not there yet. You might get there sooner than you think." },
      ] },
    ],
  },
  {
    id: 'dominant-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "You look like someone who'd cheat at chess. My grandmother would've adored you. She taught me at six - and never let me win.",
    opts: [
      { tone: 'cold', t: "I don't cheat.", r: "Pity. Cheaters are fun to beat. Honest people just make it take longer.", opts: [
        { tone: 'cold', t: "I'll pass on the comparison.", r: "Fair. I'll stop comparing. You can tell me what you are like another time." },
        { tone: 'passive', t: "Did you ever beat her?", r: "Once I was nineteen. She framed the board in her hallway. It's still there. So is the grudge." },
        { tone: 'flirty', t: "I'd only cheat to keep you at the table.", r: "That's a reason. Not a good one. A very effective one." },
      ] },
      { tone: 'passive', t: "Never? Not even once?", r: "Not once. It's why I win things now. Nothing she gave me was free. Neither is anything I give.", opts: [
        { tone: 'cold', t: "That explains a lot.", r: "It explains everything. Take notes. There's a test later. Or there isn't. Your choice." },
        { tone: 'passive', t: "She sounds formidable.", r: "She is. Eighty-something and still calls me 'the challenger'. I'm working on the title." },
        { tone: 'flirty', t: "What would you give me, then?", r: "A look. Possibly a dinner. Definitely a hard time. Start with the hard time." },
      ] },
      { tone: 'flirty', t: "I'd let you win, if you asked nicely.", r: "I never ask nicely. I win. But I'd like to see how you lose.", opts: [
        { tone: 'cold', t: "Never mind, then.", r: "Sulking already? We haven't even set up the board. Go on, then. Next time." },
        { tone: 'passive', t: "Then let's play sometime.", r: "We will. I'll pick the night. You bring your best defence. You'll need it." },
        { tone: 'flirty', t: "I'd lose very slowly.", r: "That's not losing. That's stalling. I approve of the strategy." },
        { tone: 'risque', t: "Play me for higher stakes, then.", r: "Higher stakes I can do. I name them, I set the clock, and you'll be glad you lost." },
      ] },
    ],
  },
  {
    id: 'dominant-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: ["You're pale. Don't argue. When did you last eat? Never mind. Eat something - then you can go back to being cold with me.", "You were frosty last time. I'll allow it. What I won't allow is you racing on an empty stomach. Eat something."],
    opts: [
      { tone: 'cold', t: "I'm fine. I don't need feeding.", r: "You do, and you know it. Fine - you're an adult. Make a bad choice. I'll watch.", opts: [
        { tone: 'cold', t: "I'll eat when I want to.", r: "Fair. Your call. I'll just stand here disapproving. Silently. Mostly." },
        { tone: 'passive', t: "Okay. Fine. Something small.", r: "Good. Small is a start. I'll get you something. Sit." },
        { tone: 'flirty', t: "Are you this bossy with everyone?", r: "With everyone who needs it. You need it more than most. Take that as an honour." },
      ] },
      { tone: 'passive', t: "You're right. I forgot lunch.", r: "I knew it. Here. Eat this first. Talk second.", opts: [
        { tone: 'cold', t: "I can get my own food.", r: "You can. You haven't. But fine - offer withdrawn. Pride's very filling, I hear." },
        { tone: 'passive', t: "Thanks. That's... nice of you.", r: "It isn't nice. It's practical. You drive better fed. I want to watch you drive well." },
        { tone: 'flirty', t: "Do you always look after people like this?", r: "Only the ones I've decided on. Eat. Don't read into it. Read into it a bit." },
      ] },
      { tone: 'flirty', t: "Feed me, then.", r: "I intended to. You'll eat this, you'll thank me, and then you can flirt. Order matters.", opts: [
        { tone: 'cold', t: "Never mind. I'm not hungry.", r: "You are, but you're stubborn. Fine. Starve gracefully. I'll be over there." },
        { tone: 'passive', t: "Okay, okay. Eating.", r: "Good. Was that so hard? Next time eat before I have to tell you." },
        { tone: 'flirty', t: "Only if you feed me yourself.", r: "Not tonight. Tonight you feed yourself, like a responsible professional, and I supervise." },
      ] },
    ],
  },
  {
    id: 'dominant-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: ["What have you eaten today? You hesitated. That's an answer. Eat something. Now.", "You've got a race in your legs and nothing in your stomach. I can tell. Eat something before we go any further."],
    opts: [
      { tone: 'cold', t: "I don't take orders.", r: "You don't take good advice, you mean. Fine. Order rescinded. Advice stands.", opts: [
        { tone: 'cold', t: "Not tonight.", r: "Then not tonight. Your stomach. Your problem. Night, {me}." },
        { tone: 'passive', t: "Okay. Fair. I'll grab something.", r: "Grab two. One for the hour after, when you'll be starving and won't admit it." },
        { tone: 'flirty', t: "I'd take orders from you. Some.", r: "Good. Start with this one. We'll negotiate the rest when you're fed." },
      ] },
      { tone: 'passive', t: "Is it that obvious?", r: "To me. You're reading the room like it's lap fifty. Eat. Then you can talk to me properly.", opts: [
        { tone: 'cold', t: "I'll manage.", r: "I know you'll manage. Managing isn't the point. Off you go." },
        { tone: 'passive', t: "What would you recommend?", r: "The thing on the left. I've had it. It's the best thing here. I don't recommend things lightly." },
        { tone: 'flirty', t: "You noticed that quickly.", r: "I notice everything about the people I'm watching. You're one of them. Eat." },
      ] },
      { tone: 'flirty', t: "Are you looking after me?", r: "I'm looking after my investment. I plan to watch you win things. Eat something.", opts: [
        { tone: 'cold', t: "I don't need looking after.", r: "Noted. Everyone does, but fine. I'll let you prove me wrong. You won't." },
        { tone: 'passive', t: "Okay. Eating. Happy?", r: "Yes. Look at that. You can follow simple instructions. My opinion of you just went up." },
        { tone: 'flirty', t: "Your investment?", r: "Of time. Of attention. Of a certain amount of hope I didn't plan to spend tonight." },
        { tone: 'risque', t: "Feed me and I'm yours for the night.", r: "Bold. Not tonight. Tonight you're fed and sent home early. I play the long game." },
      ] },
    ],
  },
  {
    id: 'dominant-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: ["Before you charm me any further: eat something. You can't flirt properly on an empty stomach. Neither can I.", "Lovely to see you. You look starving. Eat something, and then you can say whatever you were about to say."],
    opts: [
      { tone: 'cold', t: "I'm not hungry.", r: "Your stomach disagrees. I can hear it from here. Fine - be wrong at your own pace.", opts: [
        { tone: 'cold', t: "Drop it.", r: "Dropped. You've got a weekend to run on empty. I won't stop you." },
        { tone: 'passive', t: "Okay, maybe a little.", r: "A little is enough. Here. That's the best thing on the table. I checked." },
        { tone: 'flirty', t: "Distract me and I'll forget I'm hungry.", r: "No. Eat. Distraction comes after. I'm very good at after." },
      ] },
      { tone: 'passive', t: "Fine. What should I eat?", r: "That. And that. Don't look at me like that - I've already decided for both of us.", opts: [
        { tone: 'cold', t: "I'll choose myself.", r: "Fine. Choose badly. I'll pretend I'm not disappointed." },
        { tone: 'passive', t: "Decided for both of us?", r: "I always do. It saves time. You can overrule me. You won't want to." },
        { tone: 'flirty', t: "I like it when you decide.", r: "I know. I could tell from across the room. Eat. Then come back and like it some more." },
      ] },
      { tone: 'flirty', t: "So you've been worrying about me?", r: "Worrying is for people with no plan. I have a plan. Step one: you eat something.", opts: [
        { tone: 'cold', t: "I can look after myself.", r: "You can. Prove it with a plate, not a speech. Night." },
        { tone: 'passive', t: "What's step two?", r: "Step two depends entirely on how well you do step one. Eat." },
        { tone: 'flirty', t: "I'm curious about the whole plan.", r: "Good. Curious people try harder. Eat. I'll reveal it slowly." },
        { tone: 'risque', t: "Skip to the last step.", r: "Ha. Nobody skips to the last step with me. Eat something. You'll need the energy." },
      ] },
    ],
  },
  {
    id: 'dominant-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: ["Fine. Don't talk. I'll talk. I have a cat called Admiral. He ignores every order I give him. You two would get on.", "You're as warm as my cat. His name's Admiral, and he's the only creature alive who ignores me. You're making a run at second."],
    opts: [
      { tone: 'cold', t: "Is that meant to be charming?", r: "It's meant to be true. Charming is a bonus. Clearly not one I've earned tonight.", opts: [
        { tone: 'cold', t: "It's not.", r: "Fair. Admiral wouldn't have been charmed either. He'd have walked off. You first." },
        { tone: 'passive', t: "Okay. Why Admiral?", r: "He sat at the window like he was inspecting a fleet. Still does. He outranks me in my own home." },
        { tone: 'flirty', t: "A little charming.", r: "A little. Good. Little is how it starts. Ask Admiral - he started little too." },
      ] },
      { tone: 'passive', t: "A cat that ignores you? I'd pay to see that.", r: "Everyone says that. Nobody believes it until he strolls past me while I'm calling his name. Total contempt.", opts: [
        { tone: 'cold', t: "Smart cat.", r: "Very. Smarter than most people I meet. You might be the exception. Undecided." },
        { tone: 'passive', t: "Why do you put up with it?", r: "Because he chose me. I don't get chosen often. I'm usually the one doing the choosing." },
        { tone: 'flirty', t: "I'll ignore you too, if it helps.", r: "It won't. You're terrible at it. You've been looking at me this entire time." },
      ] },
      { tone: 'flirty', t: "So I'm in good company. The defiant ones.", r: "Defiant, and adored anyway. He's earned it. You've barely started.", opts: [
        { tone: 'cold', t: "Don't call me defiant.", r: "Fine. I'll keep my labels to myself. You keep yours. Good night." },
        { tone: 'passive', t: "Does Admiral like people?", r: "He tolerates them. Then one day he sits on someone's coat, and that's it. They're family." },
        { tone: 'flirty', t: "What does it take to get adored?", r: "Persistence. Good timing. Staying when you're told you can go. Admiral managed it. Your turn." },
      ] },
    ],
  },
  {
    id: 'dominant-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: ["I have a cat. Admiral. He's the only creature alive who ignores my orders. I respect him enormously.", "You should know: I live with a cat called Admiral, and he outranks me. It's the only argument I've ever lost."],
    opts: [
      { tone: 'cold', t: "I'm not a cat person.", r: "You haven't met the right cat. Or the right person. One of those can be fixed tonight.", opts: [
        { tone: 'cold', t: "I don't need fixing.", r: "No. You don't. I'll stop. Admiral would've walked off already - you're more patient than him." },
        { tone: 'passive', t: "Okay, tell me about him, then.", r: "Grey. Huge. Disapproves of everything I do. Sleeps on my laptop when I'm busiest. My favourite colleague." },
        { tone: 'flirty', t: "The right person, you say.", r: "I said what I said. I don't repeat myself. I do follow through." },
      ] },
      { tone: 'passive', t: "Admiral. That's a great name.", r: "Naturally. I named him. He sat on my windowsill like he was reviewing a fleet. He's never stopped.", opts: [
        { tone: 'cold', t: "It's a bit much.", r: "It's precisely enough. Like me. You'll understand eventually. Or you won't." },
        { tone: 'passive', t: "Does he really ignore you?", r: "Completely. I tell him off the counter, he looks at me, he stays. I've learned humility. A little." },
        { tone: 'flirty', t: "You must have a soft spot.", r: "One. He's sitting in it. I don't share it easily." },
      ] },
      { tone: 'flirty', t: "So the way to you is ignoring your orders?", r: "Not ignoring. Considering. Then doing it anyway because you wanted to. Very different.", opts: [
        { tone: 'cold', t: "Then I'll ignore them.", r: "Do. I'll find it very annoying and quite attractive. Mostly annoying. Good night." },
        { tone: 'passive', t: "Noted. Consider, then comply.", r: "Exactly. You're a fast learner. Admiral took two years." },
        { tone: 'flirty', t: "I'll consider everything you say.", r: "Good. Consider this: you're standing too far away." },
        { tone: 'risque', t: "What orders do you have for me?", r: "Plenty. You'll get them one at a time, when you've earned the next. That's the game." },
      ] },
    ],
  },
  {
    id: 'dominant-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: ["I should warn you: my cat outranks me. Admiral. Anyone I like has to get past him first. You might. Might.", "Fair warning - my cat Admiral vets everyone I like. He's the only one in my life who doesn't take orders. You'd have a chance."],
    opts: [
      { tone: 'cold', t: "I don't audition for cats.", r: "Then you'll never get past the door. Your loss. He's excellent company. So am I.", opts: [
        { tone: 'cold', t: "I'll live.", r: "You'll live a smaller life. Fine. Admiral and I will cope." },
        { tone: 'passive', t: "What does he look for?", r: "Calm. Confidence. Someone who doesn't try too hard. You've got two of the three. I'm not saying which." },
        { tone: 'flirty', t: "I'm told I'm good with difficult ones.", r: "I've heard. Admiral's difficult. I'm worse. Prove it slowly." },
      ] },
      { tone: 'passive', t: "What happens if he doesn't like me?", r: "Then I'd have to choose. I'd choose him, obviously. Then I'd sulk about it for a week.", opts: [
        { tone: 'cold', t: "Charming.", r: "Honest. Charm is for people who need it. Night, {me}." },
        { tone: 'passive', t: "And if he likes me?", r: "Then you're in. He sits on your coat, and I start handing you keys. Not literal ones. Yet." },
        { tone: 'flirty', t: "I'll bribe him.", r: "He doesn't take bribes. I do. Try me." },
      ] },
      { tone: 'flirty', t: "So you like me.", r: "I said anyone I like. I didn't say you specifically. I didn't say you weren't.", opts: [
        { tone: 'cold', t: "Never mind.", r: "Too late. You walked into it. I'll pretend you didn't. For tonight." },
        { tone: 'passive', t: "Fair enough. I'll take 'might'.", r: "Good. 'Might' from me is a lot. Ask the people I've said no to." },
        { tone: 'flirty', t: "You're blushing.", r: "I don't blush. I warm up. You'll learn the difference." },
        { tone: 'risque', t: "Introduce us. Tonight.", r: "Not tonight. Admiral doesn't do surprise guests, and neither do I. I'll decide when. You'll know." },
      ] },
    ],
  },
  {
    id: 'dominant-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: ["I've decided to keep score with you. You being cold last time? A point to you. Enjoy it. It won't happen often.", "Scoreboard, since you like playing hard to get: last time was one-nil to you. Tonight I'm equalising."],
    opts: [
      { tone: 'cold', t: "I'm not playing your game.", r: "Everyone says that. Then they check the score. You'll check. Soon.", opts: [
        { tone: 'cold', t: "Watch me not care.", r: "I'll watch. I'll also count. You're still ahead. Go and enjoy it." },
        { tone: 'passive', t: "Fine. What's the score now?", r: "One-all. I got a smile out of you just now. Don't deny it - I'm also the referee." },
        { tone: 'flirty', t: "What do I win if I stay ahead?", r: "Bragging rights. Nobody's ever had them over me. I'd guard them carefully if I were you." },
      ] },
      { tone: 'passive', t: "Fine. What's the score?", r: "One-nil to you, from last time. I'm about to equalise. Watch.", opts: [
        { tone: 'cold', t: "Then I'll stay ahead.", r: "Bold. You won't. Still - goodnight, leader. Enjoy the top spot while it lasts." },
        { tone: 'passive', t: "Equalise how?", r: "Like this: you've stayed talking to me for four minutes. That's a point. One-all." },
        { tone: 'flirty', t: "Let's see your best move.", r: "My best move is patience. You'll come to me. You already have. One-all." },
      ] },
      { tone: 'flirty', t: "Keeping score of me? I'm honoured.", r: "You should be. I don't keep score with people who don't matter.", opts: [
        { tone: 'cold', t: "It's a bit childish.", r: "It's very childish. I'm also winning. Well, drawing. Night." },
        { tone: 'passive', t: "So I matter?", r: "You're on the board. That's a start. Most people never get on the board." },
        { tone: 'flirty', t: "Then here's a point for you: you look good tonight.", r: "Two-one to me, and I didn't even have to try. Watch me try anyway." },
      ] },
    ],
  },
  {
    id: 'dominant-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: ["I'm keeping score, you should know. Tonight so far: one-nil to me. I got here first and picked the spot.", "You should know I keep score. Of everything. Right now it's one-nil to me - I chose where we're standing."],
    opts: [
      { tone: 'cold', t: "That's petty.", r: "Petty is a word for people who are losing. Winners call it attention to detail.", opts: [
        { tone: 'cold', t: "Count without me.", r: "I will. One-nil, uncontested. Go and enjoy your evening." },
        { tone: 'passive', t: "Okay, how do I score?", r: "Surprise me. Disagree with me and be right. Make me laugh when I don't want to. Rare. Possible." },
        { tone: 'flirty', t: "I'll catch up.", r: "You'll try. I respect trying. I respect winning more." },
      ] },
      { tone: 'passive', t: "Okay. What counts as a point?", r: "Leaving me speechless. Getting the last word. Making me wait - and making it worth it.", opts: [
        { tone: 'cold', t: "Then I'll leave first. That's a point.", r: "Clever. One-all, then. Go on. I'll get it back next time." },
        { tone: 'passive', t: "Has anyone ever beaten you?", r: "My grandmother, at chess, for thirteen years. Nobody since. You're welcome to try." },
        { tone: 'flirty', t: "I'll make you wait.", r: "Then I'll wait. I'm very good at it. And you'll wonder what I'm planning the whole time." },
      ] },
      { tone: 'flirty', t: "I'll take that point back right now.", r: "Go on, then. You've got ten seconds. I'm counting.", opts: [
        { tone: 'cold', t: "Actually, I'll pass.", r: "Forfeit. One-nil stands. Fine. I'll savour it alone." },
        { tone: 'passive', t: "I'll think of something.", r: "Thinking isn't scoring. But I'll give you time. I'm generous when I'm ahead." },
        { tone: 'flirty', t: "You're the point. I came to see you.", r: "...Fine. One-all. That was annoyingly good." },
        { tone: 'risque', t: "Come somewhere quieter and I'll show you.", r: "Bold move, wrong time. I decide when we go anywhere. Still - a point for nerve. One-all." },
      ] },
    ],
  },
  {
    id: 'dominant-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: ["Scoreboard: you've made me smile twice tonight. That's two-nil to you. I don't like losing. Fix it.", "I keep score - you should know that. It's two-nil to you, which has never happened. I'm unsettled. And interested."],
    opts: [
      { tone: 'cold', t: "Not my problem.", r: "It is, actually. I'm about to make it your problem. Two-one. You just looked away first.", opts: [
        { tone: 'cold', t: "Still not my problem.", r: "Fine. You're ahead. Enjoy the view from up there. It's a short visit." },
        { tone: 'passive', t: "Fine. Two-one.", r: "Good. Gracious in defeat. I like that in a rival." },
        { tone: 'flirty', t: "Look away again and it's two-all.", r: "I never look away twice. Watch me. Still watching." },
      ] },
      { tone: 'passive', t: "Do you keep score with everyone?", r: "With anyone worth it. Short list. You just joined it.", opts: [
        { tone: 'cold', t: "Sounds tiring.", r: "Only for the people losing. Goodnight, {me}." },
        { tone: 'passive', t: "What's the prize?", r: "I decide when we get there. That's the prize for winning: you get to decide things." },
        { tone: 'flirty', t: "I want the prize.", r: "Then keep winning. I'll make it very difficult." },
      ] },
      { tone: 'flirty', t: "Two-nil? I'm just getting started.", r: "So am I. I don't lose for long. Ask anyone. Actually, don't. There's no one to ask.", opts: [
        { tone: 'cold', t: "Then I'll stop while I'm ahead.", r: "Coward. Fine - the smartest move on the board. I'll catch you up next time." },
        { tone: 'passive', t: "I'll try to keep it fair.", r: "Fair is overrated. Exciting is better. Two-one. I just made you smile." },
        { tone: 'flirty', t: "Three-nil. You just bit your lip.", r: "...I did. Fine. Three-nil. I'm going to have to try much harder. You'll notice." },
        { tone: 'risque', t: "Let me win the next round somewhere private.", r: "Private is a prize I award, not one you claim. But you're very close to winning it." },
      ] },
    ],
  },
  {
    id: 'dominant-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: ["That reporter earlier was right in your face. I moved them along. Don't thank me. I didn't do it for thanks.", "Before you start being cold again: the photographer who was crowding you won't be. I had a quiet word."],
    opts: [
      { tone: 'cold', t: "I didn't need rescuing.", r: "I know. That's why I did it quietly. You can tell me to stay out of it. I will.", opts: [
        { tone: 'cold', t: "Then stay out of it.", r: "Done. Next time I'll stand back and let you deal with it. I'll hate it. I'll do it." },
        { tone: 'passive', t: "It was a bit much. Thanks.", r: "You're welcome. They were being rude. I don't tolerate rude around people I'm talking to." },
        { tone: 'flirty', t: "You were kind of impressive, though.", r: "Kind of. I'll take kind of. Next time I'll go for completely." },
      ] },
      { tone: 'passive', t: "Okay. Thank you. That got a bit much.", r: "It did. You were too polite. I'm not. Between us, we're one very effective person.", opts: [
        { tone: 'cold', t: "I can handle it myself.", r: "You can. You were. I just made it faster. I'll back off if you'd rather. Say so and I'm gone." },
        { tone: 'passive', t: "What did you say to them?", r: "Nothing interesting. It's how you say it. And where you stand while you say it." },
        { tone: 'flirty', t: "You're a good person to have nearby.", r: "I'm a very good person to have nearby. Bear that in mind." },
      ] },
      { tone: 'flirty', t: "My hero.", r: "Don't. I'm not a hero. I'm someone who doesn't like people being crowded. Especially you, it turns out.", opts: [
        { tone: 'cold', t: "Bit dramatic.", r: "It was. You're right. Less drama next time. Or less of me. Good night." },
        { tone: 'passive', t: "Especially me?", r: "Especially you. Don't make a thing of it. I'll make a thing of it, eventually. On my timing." },
        { tone: 'flirty', t: "Then stay close. They might come back.", r: "They won't. But I'll stay close anyway. For other reasons." },
        { tone: 'risque', t: "Come home and protect me some more.", r: "Not tonight. I don't rush anything that matters. You'll be protected from across the room until I decide otherwise." },
      ] },
    ],
  },
  {
    id: 'dominant-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: ["Someone was crowding you earlier. I stepped in. Politely. Tell me if I shouldn't have - I mean it.", "You looked trapped earlier with that fan. I gave them somewhere else to be. If that's too much, say so."],
    opts: [
      { tone: 'cold', t: "You shouldn't have.", r: "Then I won't, next time. I'll stand there and glare instead. You can't stop me glaring.", opts: [
        { tone: 'cold', t: "Don't glare either.", r: "Fine. I'll look at the ceiling. Furiously. Good night." },
        { tone: 'passive', t: "It's fine. Just ask first.", r: "Fair. I will. I'm better at asking than I look. Slightly." },
        { tone: 'flirty', t: "I wouldn't mind the glaring.", r: "Good. It's one of my best. I'll save a softer version for you." },
      ] },
      { tone: 'passive', t: "No, that was good. Thanks.", r: "Good. You're too nice to people who take more than they ask for. I'm not.", opts: [
        { tone: 'cold', t: "I like being nice.", r: "I know. Keep doing it. I'll keep doing the other thing. Night." },
        { tone: 'passive', t: "Does that happen to you too?", r: "Never. People see me coming. You should borrow that. I'll lend it to you." },
        { tone: 'flirty', t: "You'd make a good bodyguard.", r: "I'd make a terrible bodyguard. I'd keep looking at the person I was guarding." },
      ] },
      { tone: 'flirty', t: "Do you look out for everyone?", r: "No. A few people. The list is short and very hard to get onto.", opts: [
        { tone: 'cold', t: "Don't put me on a list.", r: "Fine. You're not on a list. I'll just keep half an eye on the room. Out of habit." },
        { tone: 'passive', t: "Am I on it?", r: "You were on it before you'd said a word to me. Don't ask me why. I don't know yet." },
        { tone: 'flirty', t: "I'd like to stay on it.", r: "Then stay. I'm told I'm very good at keeping what I've decided to keep." },
        { tone: 'risque', t: "What do people on the list get?", r: "Protection. Attention. Eventually, a great deal more. Eventually is my word, not yours." },
      ] },
    ],
  },
  {
    id: 'dominant-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: ["That fan who wouldn't let go of your arm? I stood there until they did. Very patiently. I don't share well.", "You had a whole crowd round you earlier. I thinned it. I hope you don't mind. I don't share well."],
    opts: [
      { tone: 'cold', t: "That was unnecessary.", r: "Possibly. It felt necessary. But if it crosses a line, you say so, and I stop. Promise.", opts: [
        { tone: 'cold', t: "It crossed a line.", r: "Then I'm sorry. I mean that. I'll keep to my side of it. Good night, {me}." },
        { tone: 'passive', t: "It was okay. Just this once.", r: "Just this once. I'll pretend I'm not already planning the next time." },
        { tone: 'flirty', t: "I'll allow it. You were very still.", r: "Very still and very determined. That's me in a nutshell. Get used to it." },
      ] },
      { tone: 'passive', t: "You don't share well?", r: "Badly. I'm trying to improve. Not very hard. You'll have noticed.", opts: [
        { tone: 'cold', t: "That's not a great quality.", r: "No. But it's an honest one, and I keep it on a short lead. Good night." },
        { tone: 'passive', t: "What else don't you do well?", r: "Waiting. Losing. Being told I'm wrong by people who aren't. You'll see all three." },
        { tone: 'flirty', t: "Good. I don't like being shared.", r: "Then we understand each other. That's a dangerous thing to say to me. I'll remember it." },
      ] },
      { tone: 'flirty', t: "My very own guard.", r: "Not yours. Not yet. But you get the benefits of the service, free of charge, for now.", opts: [
        { tone: 'cold', t: "I don't want a guard.", r: "Fair. I'll stand down. Across the room, guarding nothing. Mostly." },
        { tone: 'passive', t: "What would it cost later?", r: "Dinner. A conversation without anyone else in it. A few hours of not being polite." },
        { tone: 'flirty', t: "Not yet, you said.", r: "I did. I choose my words. You should start choosing yours. You're on my radar now." },
        { tone: 'risque', t: "Then guard me all night.", r: "Ha. All night is a privilege, not a request. Keep talking like that and you might earn it." },
      ] },
    ],
  },
  {
    id: 'dominant-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: ["You keep not doing what I expect. Do you know how rarely that happens to me? I've been thinking about it. Annoyingly.", "Everyone says yes to me. You don't. Last time you barely said anything. It's been bothering me in the best way."],
    opts: [
      { tone: 'cold', t: "Maybe I just don't like you.", r: "Maybe. That's allowed. I'd rather know than be humoured. Tell me straight and I'll go.", opts: [
        { tone: 'cold', t: "I'm still deciding.", r: "Good. Take your time. I'm not going anywhere. Well - I am, tonight. Good night." },
        { tone: 'passive', t: "I don't dislike you. You're just a lot.", r: "I am a lot. Most people take the lot or leave it. You're doing something more interesting." },
        { tone: 'flirty', t: "I like you. I just won't make it easy.", r: "Good. Easy bores me. You haven't bored me once." },
      ] },
      { tone: 'passive', t: "I just say what I think.", r: "I know. It's rarer than you'd believe. Everyone else says what they think I want.", opts: [
        { tone: 'cold', t: "Maybe they're scared of you.", r: "Maybe. I'd rather they weren't. You aren't - which is either brave or rude. Night." },
        { tone: 'passive', t: "Doesn't that get lonely?", r: "...Sometimes. Don't spread that around. I have a reputation to keep." },
        { tone: 'flirty', t: "Does it scare you a little?", r: "Nothing scares me. You unsettle me. That's different. And better." },
      ] },
      { tone: 'flirty', t: "You like it when people say no to you.", r: "I like it when it's honest. Your no is honest. So is your yes, I'd imagine.", opts: [
        { tone: 'cold', t: "Then here's an honest no.", r: "Received. I'll take it, and I'll take it well. That's the deal with me, always." },
        { tone: 'passive', t: "Maybe I'll say yes sometimes.", r: "When you do, I'll know you meant it. That's worth ten of anyone else's." },
        { tone: 'flirty', t: "Ask me something and find out.", r: "Not yet. When I ask, it'll be a proper question. You'll want to have an answer ready." },
        { tone: 'risque', t: "Ask me to come home with you. Test it.", r: "I don't test things I care about. I wait for them. You'll know when I'm asking. It won't be tonight." },
      ] },
    ],
  },
  {
    id: 'dominant-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: ["People say yes to me all day. It's boring. You don't always. I'm finding I like that more than I planned to.", "I'm used to people agreeing with me. You don't, half the time. Infuriating, or the best part of my week. I can't decide."],
    opts: [
      { tone: 'cold', t: "I'm not here to agree with you.", r: "Good. That's exactly why you're still here.", opts: [
        { tone: 'cold', t: "Or I'll leave.", r: "You can. Any time. I'd never stop you. Go on, then - good night, {me}." },
        { tone: 'passive', t: "I just like an honest argument.", r: "So do I. The best ones end with someone being wrong. Usually not me." },
        { tone: 'flirty', t: "Infuriating, definitely.", r: "Both, then. I'll let you know when I've decided. It might take a while. It might take dinners." },
      ] },
      { tone: 'passive', t: "Is it really that rare?", r: "You'd be amazed. People nod at me in meetings, in restaurants, in queues. You don't nod. You look at me.", opts: [
        { tone: 'cold', t: "Someone has to push back.", r: "Someone should. Apparently it's you. Don't get smug about it. Go home. Sleep." },
        { tone: 'passive', t: "I'll keep pushing back, then.", r: "Do. I'll push back harder. That's how good things get built." },
        { tone: 'flirty', t: "I like looking at you.", r: "I'd noticed. I didn't stop you. Make of that what you like." },
      ] },
      { tone: 'flirty', t: "Then I'll keep saying no. Sometimes.", r: "Sometimes is perfect. Make me guess which times. I'll enjoy it.", opts: [
        { tone: 'cold', t: "Mostly no, actually.", r: "Mostly. Fine. I'll take the 'mostly' and leave it alone. Respectfully." },
        { tone: 'passive', t: "And when I say yes?", r: "Then I'll know it meant something. You're not the type to say it to be easy." },
        { tone: 'flirty', t: "Ask me something. See what happens.", r: "Not here. When I ask, it'll be properly - not for a cheap point on the board." },
        { tone: 'risque', t: "Bet I'd say yes to the right question.", r: "I know exactly which question. I'm not asking it yet. Patience is my favourite weapon." },
      ] },
    ],
  },
  {
    id: 'dominant-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: ["You're the first person in a year who's made me work for it. I want you to know I've noticed. And I'm enjoying it.", "I'm not used to working this hard for someone's attention. I'm finding it suits me. Don't tell anyone."],
    opts: [
      { tone: 'cold', t: "Then stop working.", r: "No. I don't stop. But I'll ease off if you need room - say the word. Is that the word?", opts: [
        { tone: 'cold', t: "That's the word.", r: "Then I'll ease off. I won't go far. I'll be patient. It's an underrated talent." },
        { tone: 'passive', t: "No. Just slow down a little.", r: "Slower I can do. I'm very good at slow, when it matters." },
        { tone: 'flirty', t: "Don't stop. I like watching you work.", r: "Good. I'm only warming up. Brace yourself." },
      ] },
      { tone: 'passive', t: "Why me, though?", r: "You don't flinch. You don't flatter. And you looked at me like I was a question. Nobody does that.", opts: [
        { tone: 'cold', t: "I'm not that interesting.", r: "You are. But I won't argue tonight. Go home and think about why I said it." },
        { tone: 'passive', t: "What kind of question?", r: "The good kind. The kind I keep turning over. That's all you're getting." },
        { tone: 'flirty', t: "What's the answer?", r: "Not telling yet. But I'm close to it. Very close." },
      ] },
      { tone: 'flirty', t: "It's working. You know that, right?", r: "I know. I always know. I wanted to hear you say it. Thank you. That's a point to me.", opts: [
        { tone: 'cold', t: "Don't get cocky.", r: "I'm never cocky. I'm accurate. But fine - I'll accept a demotion. For tonight only." },
        { tone: 'passive', t: "Okay, it's working a bit.", r: "A bit is everything at this stage. A bit becomes a lot when I'm involved." },
        { tone: 'flirty', t: "It's working a lot.", r: "I know. I'm trying not to look pleased. I'm failing. Don't watch." },
        { tone: 'risque', t: "Then finish the job.", r: "Not tonight. Finishing is a long way off, and I decide when. You'll enjoy the wait." },
      ] },
    ],
  },
  {
    id: 'dominant-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: ["I'll be quick, since you prefer that. Dinner. Thursday. Eight. I've booked it. Say no and that's the end of it.", "You've been cool with me. Fine. Here's my offer, once: dinner, Thursday, eight. I've already booked. Yes or no."],
    opts: [
      { tone: 'cold', t: "You booked before asking?", r: "Always. It's faster. If the answer's no, I cancel and nobody minds. Me, slightly.", opts: [
        { tone: 'cold', t: "Cancel it.", r: "Done. No hard feelings - a few soft ones, privately. Take care of yourself, {me}.", m: 0 },
        { tone: 'passive', t: "No, keep it. Thursday's fine.", r: "Good. I'll send the address. Come hungry - I won't repeat that lecture." },
        { tone: 'flirty', t: "I like that you didn't wait.", r: "I never wait. I'll make an exception for you, once. Thursday." },
      ] },
      { tone: 'passive', t: "Okay. Thursday at eight.", r: "Good. Clean, simple, decided. I'll be there at quarter to. I'm early for things that matter.", opts: [
        { tone: 'cold', t: "Don't make anything of it.", r: "I read into everything. Quietly, then. See you Thursday." },
        { tone: 'passive', t: "Where is it?", r: "Somewhere with a corner table. You'll see when you get there. No spoilers." },
        { tone: 'flirty', t: "I'll be early too.", r: "Then we'll both be early and I'll still have got there first. It's a gift." },
      ] },
      { tone: 'flirty', t: "Took you long enough.", r: "Long enough? I've known since the night we met. I was waiting for you to stop being frosty.", opts: [
        { tone: 'cold', t: "Don't get used to winning.", r: "I never get used to it. I just keep doing it. Thursday." },
        { tone: 'passive', t: "Thursday it is, then.", r: "Thursday it is. Good. Right answer, delivered in the right voice." },
        { tone: 'flirty', t: "What happens after dinner?", r: "I'll decide at dessert. You may try to influence me. It's been done. Once." },
        { tone: 'risque', t: "Book breakfast too.", r: "Ha. Breakfast is earned at dinner, and I'm a very hard marker. See you Thursday." },
      ] },
    ],
  },
  {
    id: 'dominant-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: ["I've booked a table. Thursday, eight. You and me. I don't ask twice, so I'm asking once - properly. Yes?", "Thursday. Eight. A table I had to fight for. I'd like you at it. That's me asking, by the way. I don't do it often."],
    opts: [
      { tone: 'cold', t: "And if I say no?", r: "Then I cancel it and never mention it again. I'd hate it. I'd respect it. Both, completely.", opts: [
        { tone: 'cold', t: "Then cancel it.", r: "Consider it cancelled. I'm sorry - and I'll live. Good night, {me}.", m: 0 },
        { tone: 'passive', t: "I'm not saying no. Just checking.", r: "Good. Check anything you like. The answer's still a table, Thursday, eight." },
        { tone: 'flirty', t: "I'd never say no to that face.", r: "My face is not the deciding factor. You are. But I'll take it. Thursday." },
      ] },
      { tone: 'passive', t: "Yes. Thursday.", r: "Good. That's the best word anyone's said to me all week.", opts: [
        { tone: 'cold', t: "Don't make it a big deal.", r: "It isn't a big deal. It's a table. I'll just be very pleased about it, privately." },
        { tone: 'passive', t: "What should I bring?", r: "Yourself, on time, fed. No - not fed. I'm feeding you. Come hungry." },
        { tone: 'flirty', t: "I've been hoping you'd ask.", r: "I know. I watched you hope. I made you wait on purpose. I'm sorry. I'm not." },
      ] },
      { tone: 'flirty', t: "I thought you'd never ask.", r: "I always ask. I just ask at the exact right moment. This was it. Yes?", opts: [
        { tone: 'cold', t: "I'll let you know.", r: "I won't ask again. The offer stands until Wednesday. Your move, {me}." },
        { tone: 'passive', t: "Yes. Obviously.", r: "Obviously. Good. Thursday you get the corner seat and my undivided attention." },
        { tone: 'flirty', t: "Yes. And I'm choosing dessert.", r: "You can choose dessert. I'll choose everything else. Fair trade." },
        { tone: 'risque', t: "Yes. And I'm not going home early.", r: "We'll see. I decide when the night ends - but I'm open to persuasion. Bring your best." },
      ] },
    ],
  },
  {
    id: 'dominant-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: ["I booked the table the second you smiled at me. Corner. All that's left is you saying yes. Thursday, eight.", "Dinner. Thursday. Eight. I booked it the moment you smiled at me last time. I'd like a yes."],
    opts: [
      { tone: 'cold', t: "You're presumptuous.", r: "I'm prepared. There's a difference. Say no and I'll unbook it without a word.", opts: [
        { tone: 'cold', t: "Unbook it.", r: "Done. Without a word, as promised. ...Just that one. Good night.", m: 0 },
        { tone: 'passive', t: "Fine. I'll come.", r: "'Fine.' I'll take it. By dessert it'll be 'thank goodness I came.'" },
        { tone: 'flirty', t: "Presumptuous suits you.", r: "Everything suits me. Thursday, then. I'll wear the presumption well." },
      ] },
      { tone: 'passive', t: "Yes. Thursday, eight.", r: "Excellent. Correct answer, correct speed. You're improving.", opts: [
        { tone: 'cold', t: "Don't say 'improving'.", r: "Noted. You arrived perfect and I'm a liar. Thursday." },
        { tone: 'passive', t: "What's the dress code?", r: "Whatever you feel invincible in. I'll be wearing that already." },
        { tone: 'flirty', t: "I'll be counting down.", r: "So will I. Don't tell anyone. I'm meant to be impossible to excite." },
      ] },
      { tone: 'flirty', t: "You booked it when I smiled?", r: "Within the minute. I don't waste a good opportunity. You were a very good opportunity.", opts: [
        { tone: 'cold', t: "Bit fast, isn't it?", r: "Fast is how I live. But I'll go at your speed if you ask. Ask, and I'll slow down." },
        { tone: 'passive', t: "Okay. Thursday it is.", r: "Thursday it is. I'll be early. You be hungry." },
        { tone: 'flirty', t: "I'll smile more often, then.", r: "Do. Every time you do, I book something. You'll run out of evenings." },
        { tone: 'risque', t: "Book the whole night, then.", r: "I already have. You only get to know about the dinner. The rest I'll tell you on Thursday." },
      ] },
    ],
  },
];
