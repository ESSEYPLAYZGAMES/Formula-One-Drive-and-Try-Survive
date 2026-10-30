// DOMINANT - in person, stage warm: testing whether you can keep up. Orders, bets, the first soft cracks. Plain data.
export const DATA = [
  {
    id: 'dominant-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: ["You've been cold with me. Fine. I've still booked Friday. Corner table. I'll be facing the door - I always am. Come or don't.", "Frosty again. Noted. Friday's booked anyway - corner table, me facing the door, as always. Your seat's there if you want it."],
    opts: [
      { tone: 'cold', t: "Don't hold the table on my account.", r: "I won't hold it. I'll sit at it. If you come, good. If you don't, I'll eat both desserts.", opts: [
        { tone: 'cold', t: "I won't be coming.", r: "Understood. Both desserts it is. No hard feelings. Mild ones. Gone by Saturday." },
        { tone: 'passive', t: "Fine. I'll be there.", r: "Good. No fuss. I'll have your seat waiting - the one where I can see you and the door." },
        { tone: 'flirty', t: "Save me one of the desserts.", r: "I'll save you half. That's the most generous offer I make." },
      ] },
      { tone: 'passive', t: "Why do you always face the door?", r: "So nothing walks in that I haven't seen first. Habit. You'll find it useful one day.", opts: [
        { tone: 'cold', t: "That's a bit much.", r: "It's exactly enough. You'll understand eventually. Or you'll keep thinking I'm odd. Both are allowed." },
        { tone: 'passive', t: "Fair enough. Friday, then.", r: "Friday. Good. I'll forgive the cold shoulder by the main course." },
        { tone: 'flirty', t: "Can I face you instead?", r: "You can face whatever you like. Me, ideally. The door's my problem." },
      ] },
      { tone: 'flirty', t: "I'll come if you sit next to me.", r: "Negotiating. Good. I was always going to sit next to you. You just won a point you'd already won.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Forgotten. I'll cancel it. Good night, {me}." },
        { tone: 'passive', t: "Deal.", r: "Deal. See? You're easier to persuade than you pretend." },
        { tone: 'flirty', t: "And you look at me, not the door.", r: "Tough terms. I'll split it. Door with one eye, you with the other. You get the better eye." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: ["Friday. I've booked the corner table. I sit facing the door - always - and you sit beside me. That's settled.", "I've booked us somewhere for Friday. Corner table. I take the seat facing the door. I always do. You're beside me."],
    opts: [
      { tone: 'cold', t: "You could've asked.", r: "I could. Asking is slower. But you're right - so: Friday, corner table. Yes or no? Genuinely.", opts: [
        { tone: 'cold', t: "Not this Friday.", r: "Then not this Friday. I'll move it, or I'll drop it. Your call, and no sulking. No visible sulking." },
        { tone: 'passive', t: "Yes. Friday's fine.", r: "Good. Then I was right and polite. A rare double." },
        { tone: 'flirty', t: "Ask me like that every time.", r: "I'll ask when it matters. This matters. Friday." },
      ] },
      { tone: 'passive', t: "Why always facing the door?", r: "I like seeing who comes in. Old habit. Nobody gets surprised on my watch. You included.", opts: [
        { tone: 'cold', t: "Sounds paranoid.", r: "It's attentive. But call it what you like. I'll still be facing the door." },
        { tone: 'passive', t: "Who are you watching for?", r: "No one in particular. Anyone who'd ruin a good evening. I don't let that happen." },
        { tone: 'flirty', t: "So you're guarding me.", r: "Guarding the table. You happen to be at it. Funny how that works." },
      ] },
      { tone: 'flirty', t: "Beside you? Not opposite?", r: "Opposite is for interviews. Beside is for people I like. Draw the obvious conclusion.", opts: [
        { tone: 'cold', t: "I'll take opposite.", r: "Then opposite. I'll stare at you across the table instead. You asked for it." },
        { tone: 'passive', t: "Beside you, then.", r: "Good. Close enough to argue quietly. The best kind of arguing." },
        { tone: 'flirty', t: "I'll sit wherever you tell me.", r: "I know. I like that you know it too. Friday." },
        { tone: 'risque', t: "Beside you, and closer later.", r: "Later is my department. But keep that thought until Friday. Hold it carefully." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: ["I booked Friday the second I knew you were free. Corner table. I face the door. You face me. Non-negotiable, mostly.", "You're free Friday. Corner table. My seat faces the door - it always does. Yours faces me. Non-negotiable. Mostly."],
    opts: [
      { tone: 'cold', t: "Who says I'm free?", r: "You did. Last week. I listen. Am I wrong?", opts: [
        { tone: 'cold', t: "Something came up.", r: "Then it came up. Another night. I'm disappointed - but not in you. Good night." },
        { tone: 'passive', t: "No, I'm free. Friday.", r: "Good. I listen, you see. It's one of my scarier talents." },
        { tone: 'flirty', t: "For you, I'm free.", r: "Correct answer. I was hoping you'd give it. I'd have waited for it either way." },
      ] },
      { tone: 'passive', t: "Why does it face the door?", r: "So I see everything coming. Habit. You'll get used to me watching the room.", opts: [
        { tone: 'cold', t: "Seems excessive.", r: "It is excessive. I'm excessive. You've known that a while. Friday." },
        { tone: 'passive', t: "Okay. And I face you.", r: "And you face me. Which means I'll be distracted the whole night. I accept the cost." },
        { tone: 'flirty', t: "You'll stop watching the room eventually.", r: "When you're there? Maybe. Don't make me. It's annoyingly possible." },
      ] },
      { tone: 'flirty', t: "'Mostly' non-negotiable?", r: "Mostly. You can negotiate if you're very good. Are you very good?", opts: [
        { tone: 'cold', t: "Not for you.", r: "Shame. Then the terms stand as written. Friday, if you want it. If not, fine." },
        { tone: 'passive', t: "I'm reasonably good.", r: "Reasonable gets you a reasonable table. Try harder." },
        { tone: 'flirty', t: "I'm excellent. Try me.", r: "I intend to. Friday. Dinner first, then we'll see how well you negotiate." },
        { tone: 'risque', t: "Let's negotiate the end of the night now.", r: "Ha. No. The end of the night is decided at the end of the night. By me. You may lobby." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: ["You've been frosty. Prove you can keep up, then. Staring contest. First to look away buys breakfast.", "Cold again? Fine. Let's settle it properly. Eyes on me. Whoever looks away first pays for breakfast. Go."],
    opts: [
      { tone: 'cold', t: "You don't scare me.", r: "I'm not trying to. I'm trying to win. Different skill. Eyes on me.", opts: [
        { tone: 'cold', t: "I'm walking away. That's not looking away.", r: "Technically. Lawyerly. I'll allow it. A draw. Off you go." },
        { tone: 'passive', t: "Fine. Eyes on you.", r: "Good. ...Good. You're steadier than you look. I'm going to lose this. I hate that." },
        { tone: 'flirty', t: "Eyes on you. Happily.", r: "Happily is cheating. You can't enjoy it. ...You're enjoying it. I'm losing. Unacceptable." },
      ] },
      { tone: 'passive', t: "Fine. Go.", r: "...Stop smirking. Smirking isn't against the rules. It should be.", opts: [
        { tone: 'cold', t: "I'm not smirking. I'm winning.", r: "You are. I looked away. Breakfast's on me. I'll pay. I'll sulk while I pay." },
        { tone: 'passive', t: "I'm trying not to laugh.", r: "Laugh and you lose. ...You laughed. Breakfast's yours to buy. I take it black and early." },
        { tone: 'flirty', t: "You're making it hard.", r: "Good. That's the strategy. ...You held on. Fine. A draw. We split breakfast." },
      ] },
      { tone: 'flirty', t: "Easy. You're nice to look at.", r: "Flattery. Clever. Doesn't work on me. ...It works a bit. Keep going.", opts: [
        { tone: 'cold', t: "That's your lot.", r: "Then I'll call it a win and go. You owe me breakfast. I'll let it slide. This once." },
        { tone: 'passive', t: "I mean it.", r: "I know you do. That's the problem. You're very bad for my concentration." },
        { tone: 'flirty', t: "I could look at you all day.", r: "Then you'll lose all day. Breakfast for a month. Your treat." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: ["I want to know if you can keep up. Staring contest. Look away first and you're buying breakfast. Go.", "Here's a test. You and me, eyes locked. The loser pays for breakfast. I've never lost. Ready? Go."],
    opts: [
      { tone: 'cold', t: "I'm not doing that.", r: "Forfeit, then. Breakfast is on you. I take mine early and expensive.", opts: [
        { tone: 'cold', t: "I'm not buying you breakfast either.", r: "Fine. Then nobody wins. Worst result there is. Good night, {me}." },
        { tone: 'passive', t: "Okay, fine. Go.", r: "...You blinked. Blinking's allowed. Looking away isn't. You did. Breakfast's on you." },
        { tone: 'flirty', t: "I'll buy you breakfast anyway.", r: "That's not how bets work. That's how dates work. I'll take the date." },
      ] },
      { tone: 'passive', t: "Ready. Go.", r: "Good. ...You're good at this. Annoyingly good. Most people last five seconds.", opts: [
        { tone: 'cold', t: "I'm better than you think.", r: "Clearly. I looked away. First time in years. I'm not happy about it. Breakfast's on me. Night." },
        { tone: 'passive', t: "Are you going to blink?", r: "I don't blink. I decide not to. ...Fine. I blinked. It counts. Breakfast's on me." },
        { tone: 'flirty', t: "You've got lovely eyes. Distracting.", r: "You flattered me into looking away. That's cheating. It's also brilliant. Breakfast's on me, cheat." },
      ] },
      { tone: 'flirty', t: "I'll win. I've had practice looking at you.", r: "That's a dirty tactic. I approve. I'm still not looking away.", opts: [
        { tone: 'cold', t: "Fine. You win. I'm bored.", r: "Bored is a forfeit. I'll take the win. Enjoy paying for breakfast." },
        { tone: 'passive', t: "Okay, I'm looking away. You win.", r: "Gracious. I'll order the most expensive thing. You'll watch me enjoy it." },
        { tone: 'flirty', t: "I could do this all night.", r: "So could I. That's the problem. One of us has to look away. It won't be me. ...It's you. Breakfast." },
        { tone: 'risque', t: "Loser buys breakfast. Winner stays for it?", r: "Nice try. I don't look away for anything. I'll consider the staying part. Breakfast's on you." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: ["I've been wondering whether you can keep up with me. Let's find out. Staring contest. Loser buys breakfast.", "Test. Eyes on me. Breakfast is on whoever breaks first. And no, being adorable isn't a strategy. It's cheating."],
    opts: [
      { tone: 'cold', t: "I don't play games with you.", r: "You play nothing but games with me. You're just bad at admitting it. Forfeit, then?", opts: [
        { tone: 'cold', t: "Forfeit.", r: "Accepted. Breakfast on you, whenever you're ready. Or never. I'm patient either way." },
        { tone: 'passive', t: "Fine. One round.", r: "One round. You'll lose it. Then you'll ask for another. I know you." },
        { tone: 'flirty', t: "I play to win.", r: "So do I. Excellent. This could take hours." },
      ] },
      { tone: 'passive', t: "Go on, then.", r: "...Your eyes keep drifting. That's not staring, that's wandering. Point to me.", opts: [
        { tone: 'cold', t: "Fine. You win.", r: "Of course I win. Breakfast on you. Don't be sore about it. Be early." },
        { tone: 'passive', t: "I'll do better next round.", r: "Next round is tomorrow. Over breakfast. You're paying. That's how this works." },
        { tone: 'flirty', t: "Can you blame me?", r: "Not even slightly. I'll blame you for losing, though. Breakfast. Yours." },
      ] },
      { tone: 'flirty', t: "You first. I'll wait.", r: "Wrong. We both start. Now. ...You're very good. I'm unsettled.", opts: [
        { tone: 'cold', t: "I'm leaving. You can stare at the door.", r: "The door's dull. You're not. Fine. Go. I'll call it a draw." },
        { tone: 'passive', t: "Shall we call it a draw?", r: "A draw. Fine. I never accept draws. I'm accepting this one. Don't tell anyone." },
        { tone: 'flirty', t: "I'm not looking away. Ever.", r: "Ever is a long time. I've cleared my schedule. I'll still win." },
        { tone: 'risque', t: "Winner picks where we have breakfast.", r: "Winner picks everything. That's me. Breakfast is at mine. You'll find out how I like my eggs." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: ["You think I'm bossy. I'm the oldest of four - I was running a house at twelve. Bossy kept everyone fed and on time.", "Still frosty. Fine. Here's something few people get: oldest of four. I ran the house at twelve. It's why I take over."],
    opts: [
      { tone: 'cold', t: "That's not an excuse.", r: "It's not one. It's a reason. You can still tell me to stop. You've seen me listen.", opts: [
        { tone: 'cold', t: "Then stop taking over.", r: "Fair. I'll try. It'll look like me sitting on my hands. Badly. Good night." },
        { tone: 'passive', t: "Okay. It explains a lot.", r: "It explains everything. Most people never get the explanation. Consider yourself told." },
        { tone: 'flirty', t: "I didn't say I minded.", r: "No. You didn't. I noticed you didn't. Good." },
      ] },
      { tone: 'passive', t: "That's a lot for a kid.", r: "It was. I didn't notice at the time. I notice now, sometimes. When someone asks.", opts: [
        { tone: 'cold', t: "Everyone has a story.", r: "They do. Mine just has more lists in it. Night, {me}." },
        { tone: 'passive', t: "Are you close with them now?", r: "All four of us. We argue constantly and I win. They'd do anything for me. I'd do more for them." },
        { tone: 'flirty', t: "Nobody's running you now, though.", r: "No. That's the strange part. You're the first person in a while who's tried. A little." },
      ] },
      { tone: 'flirty', t: "I like the bossy version.", r: "I'm aware. You've been very obvious about it. I've been very pleased.", opts: [
        { tone: 'cold', t: "Don't get smug.", r: "I'm already smug. It lives here now. But I'll keep it down. For you." },
        { tone: 'passive', t: "It suits you.", r: "Everything suits me. But thank you. Genuinely. That one landed." },
        { tone: 'flirty', t: "Boss me around, then.", r: "Gladly. First instruction: stop being cold with me. You get the second when you've done the first." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: ["Since you're wondering: oldest of four. I was running the house at twelve. Someone had to. It stuck.", "I'm the oldest of four. At twelve I was making the lunches and the rules. That's where all this comes from."],
    opts: [
      { tone: 'cold', t: "You don't have to explain yourself.", r: "I know. I'm choosing to. I don't, often. Make of that what you will.", opts: [
        { tone: 'cold', t: "I'm not your therapist.", r: "No. You're not. Fair. I'll keep it for someone who asked. Good night." },
        { tone: 'passive', t: "I'm glad you did.", r: "So am I. Don't make it weird. I'm already regretting the honesty slightly." },
        { tone: 'flirty', t: "I like this version of you.", r: "There isn't another version. There's just more of this one. You've earned a little more." },
      ] },
      { tone: 'passive', t: "Where were your parents?", r: "Working. Always working. They did their best. Their best needed a deputy. I volunteered.", opts: [
        { tone: 'cold', t: "Sounds rough.", r: "It was what it was. I don't complain. I organise. Different coping mechanism." },
        { tone: 'passive', t: "Do your siblings still listen to you?", r: "Never. They call me 'the boss' at birthdays. Then they ring me the second anything goes wrong." },
        { tone: 'flirty', t: "Who looked after you?", r: "...Nobody's asked that in years. Nobody, mostly. I managed. Don't look at me like that. Fine. Look." },
      ] },
      { tone: 'flirty', t: "So I'm getting the expert treatment.", r: "Twenty years of practice. You're in very safe hands. Bossy ones. Safe ones.", opts: [
        { tone: 'cold', t: "I'm not twelve, you know.", r: "No. You're not. I'll keep my hands in my pockets. Mostly." },
        { tone: 'passive', t: "Expert at what, exactly?", r: "Making sure everyone's fed, on time, and where they should be. You'll notice. You already have." },
        { tone: 'flirty', t: "Your hands are my favourite place to be.", r: "...That's a very good line. I'm keeping it. And you." },
        { tone: 'risque', t: "Show me what else those hands can do.", r: "In time. I run the schedule, remember. Keep that thought warm for me." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: ["Want to know why I'm like this? Oldest of four. Running the house at twelve. You get the practised version. Lucky you.", "I'll tell you a secret. Oldest of four. I ran the whole house at twelve. Lucky you - you get the polished version."],
    opts: [
      { tone: 'cold', t: "I don't need the backstory.", r: "Then you won't get the rest. It was good, too. Very moving. Lots of packed lunches.", opts: [
        { tone: 'cold', t: "Save it.", r: "Saved. I'll tell someone who's in the mood. Good night, {me}." },
        { tone: 'passive', t: "Okay, tell me.", r: "Four kids, two working parents, one twelve-year-old with a laminated rota. Me. That's the whole story." },
        { tone: 'flirty', t: "Tell me about the rota.", r: "Colour-coded. I still have it. I'll show you one day, when you've earned it." },
      ] },
      { tone: 'passive', t: "That's a lot for twelve.", r: "It was. I'd do it again. I liked being the one people could count on. I still do.", opts: [
        { tone: 'cold', t: "Sounds like control.", r: "It was care. It looked like control. It still does, sometimes. I'm working on the look." },
        { tone: 'passive', t: "Can I count on you?", r: "Yes. Always. That's not flirting. That's a fact. I'll go back to flirting in a second." },
        { tone: 'flirty', t: "I'd let you look after me.", r: "I know. I've been doing it since we met. You just hadn't noticed." },
      ] },
      { tone: 'flirty', t: "Lucky me, indeed.", r: "Very lucky. I'm better at this than anyone you've ever met. I'm also better at other things.", opts: [
        { tone: 'cold', t: "Modest, too.", r: "Modesty is for people who aren't sure. I'm sure. Good night." },
        { tone: 'passive', t: "What other things?", r: "Remembering how you take your coffee. Knowing when you're tired. Arguing. Winning. Not in that order." },
        { tone: 'flirty', t: "Show me the other things.", r: "Not all at once. You'd never recover. One a week." },
        { tone: 'risque', t: "Show me the other things tonight.", r: "Tonight you get one. I choose which. Come here." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: ["You were friendlier with that one over there than you've been with me all week. I noticed. I've made notes.", "Interesting. Cold with me, warm with them. I'm not jealous. I'm keeping notes."],
    opts: [
      { tone: 'cold', t: "I can talk to whoever I want.", r: "You can. You should. I'm not your keeper. I'm just a sore loser. Two different things.", opts: [
        { tone: 'cold', t: "Then stop keeping notes.", r: "Notebook closed. You're right. Good night, {me}." },
        { tone: 'passive', t: "They're just a friend.", r: "Good. Friends are fine. I'll be civil. I might even be nice. Don't hold me to nice." },
        { tone: 'flirty', t: "You're cute when you're sulking.", r: "I don't sulk. I simmer. And I'm not cute. I'm formidable. ...Fine. A bit cute." },
      ] },
      { tone: 'passive', t: "They're nobody. Honestly.", r: "Honestly is all I want. Thank you. I'll put the notebook away.", opts: [
        { tone: 'cold', t: "Don't do this.", r: "Fair. I'm doing it, and I'll stop. You're allowed friends. I'm allowed to be quietly annoyed. Night." },
        { tone: 'passive', t: "You'd be the first to know.", r: "Good. I like being first. At everything. This included." },
        { tone: 'flirty', t: "I was trying to make you jealous.", r: "...It worked. I'm annoyed that it worked. Very well played." },
      ] },
      { tone: 'flirty', t: "Jealous? That's adorable.", r: "I'm not adorable. I'm alert. And you're enjoying this far too much.", opts: [
        { tone: 'cold', t: "Maybe I'll keep doing it.", r: "Then I'll keep noticing. Your call, entirely. I don't do tantrums." },
        { tone: 'passive', t: "I'm here with you, aren't I?", r: "You are. I'll count that. One-nil to me, I think." },
        { tone: 'flirty', t: "I like you alert.", r: "Then I'll stay alert. All night. Pointed entirely at you." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: ["Who was that? The one with their hand on your arm. No - don't tell me. I'll just stand a little closer.", "Someone was very friendly with you earlier. I'm not asking who. I'm just standing here now. Closer than before."],
    opts: [
      { tone: 'cold', t: "It's none of your business.", r: "You're right. It isn't. I'm still allowed to dislike them. Quietly. From here.", opts: [
        { tone: 'cold', t: "Dislike them somewhere else.", r: "Fair. I'll take my disliking elsewhere. Good night, {me}." },
        { tone: 'passive', t: "Just someone from work.", r: "Fine. Someone from work. They can keep their hands to themselves at work, then. Joking. Half." },
        { tone: 'flirty', t: "I like you standing closer.", r: "Good. I wasn't going to move. Now I've got permission. Even better." },
      ] },
      { tone: 'passive', t: "They're nobody. Just a friend.", r: "Good. Your friend can stay your friend. I'll stay here.", opts: [
        { tone: 'cold', t: "You don't own me.", r: "No. I don't. I wouldn't want to. I'd just like to be the one you're standing next to. Your choice. Always." },
        { tone: 'passive', t: "You don't have to worry.", r: "I don't worry. I prepare. But thank you. That was nice to hear." },
        { tone: 'flirty', t: "I'd rather be talking to you anyway.", r: "Good. Then talk to me. Only me. For the next ten minutes, at least." },
      ] },
      { tone: 'flirty', t: "Jealous, are we?", r: "Never. I'm competitive. There's a difference. Jealous people sulk. Competitive people win.", opts: [
        { tone: 'cold', t: "Don't make it a contest.", r: "Fine. No contest. I'll stand down. I'd have won, but I'll stand down." },
        { tone: 'passive', t: "You've got nothing to compete with.", r: "I know. I wanted you to say it. Now you have. Lovely." },
        { tone: 'flirty', t: "Then win.", r: "I already have. You're talking to me. They're over there. That's the scoreboard." },
        { tone: 'risque', t: "Show me you won.", r: "I don't show off in public. Later I'll remind you exactly who won. Thoroughly." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: ["Someone was flirting with you. Badly. I watched the whole thing. I'm not jealous. I'm competitive. Watch how it's done.", "I saw someone trying their luck with you earlier. Weak technique. Here's how it's done. Come here."],
    opts: [
      { tone: 'cold', t: "It wasn't bad flirting.", r: "It was dreadful flirting. But you're entitled to your bad taste. Briefly.", opts: [
        { tone: 'cold', t: "I enjoyed it.", r: "Then enjoy it. I don't get a vote in who you like. I'll take my excellent technique elsewhere." },
        { tone: 'passive', t: "Fine. It was a bit weak.", r: "A bit? They complimented your shoes. Your shoes. Amateurs." },
        { tone: 'flirty', t: "Yours is better.", r: "Obviously. I don't even need to try. Watch me not try. You're blushing." },
      ] },
      { tone: 'passive', t: "You saw that?", r: "I see everything in a room you're in. They lasted forty seconds. I'd have lasted the night.", opts: [
        { tone: 'cold', t: "That's a bit intense.", r: "It is. I'll turn it down. Not off. Down. Good night." },
        { tone: 'passive', t: "How would you have done it?", r: "Like this: I wouldn't have asked. I'd have told you we were leaving. And you'd have smiled." },
        { tone: 'flirty', t: "Show me how it's done, then.", r: "Gladly. Step one: stand closer. Step two: say your name like I mean it. {me}. There." },
      ] },
      { tone: 'flirty', t: "So show me.", r: "Come here. Closer. That's the technique. That's it. It works because I mean it.", opts: [
        { tone: 'cold', t: "It's not working.", r: "Then it's not working. I'll take the loss. Gracefully. Through clenched teeth." },
        { tone: 'passive', t: "That's it?", r: "That's it. Simplicity. Confidence. You still came closer, didn't you." },
        { tone: 'flirty', t: "It's working.", r: "I know. It always works. It works better on you." },
        { tone: 'risque', t: "And step two?", r: "Step two happens somewhere without an audience. I'll decide when. Soon. Possibly very soon." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: ["You like disagreeing with me. Fine - be useful. I'm about to make a call on {work}. Tell me why I'm wrong.", "Last time you were cold. Use it. I need someone blunt. Everyone around {work} says yes to my latest call. Disagree with me."],
    opts: [
      { tone: 'cold', t: "I'm not your sounding board.", r: "No. You're not. Forget I asked. I'll find a wall to argue with.", opts: [
        { tone: 'cold', t: "Good. Find one.", r: "I will. They're very agreeable, walls. Unlike you. Good night." },
        { tone: 'passive', t: "Fine. What's the call?", r: "Doubling the pace. Halving the time. Everyone loves it. Love makes me suspicious." },
        { tone: 'flirty', t: "I'll be your sounding board. For a price.", r: "Name it. I pay my debts. Promptly. Generously." },
      ] },
      { tone: 'passive', t: "Okay. What's the call?", r: "Do it twice as fast with half the people. Efficient. Elegant. Probably a disaster. Tell me.", opts: [
        { tone: 'cold', t: "Probably a disaster.", r: "Thank you. That was the word I needed and no one would say. Off you go." },
        { tone: 'passive', t: "Ask the people what they think, not just you.", r: "...I hate how right that is. Good. You're officially my second opinion." },
        { tone: 'flirty', t: "I trust your instincts.", r: "Don't. Not blindly. That's what I've got everyone else for. You're for the truth." },
      ] },
      { tone: 'flirty', t: "Use me however you like.", r: "I'll use you for arguing. Today. Tomorrow we'll revisit the terms.", opts: [
        { tone: 'cold', t: "On second thought, no.", r: "On second thought, fair. I'll argue with myself. I usually win." },
        { tone: 'passive', t: "Okay, tell me the plan.", r: "Faster. Leaner. Riskier. You're frowning. That's the useful face. Keep it." },
        { tone: 'flirty', t: "I like being useful to you.", r: "You're very useful. I'm writing that down. Don't look smug. Too late." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: ["I need someone to argue with. On {work} I've made a call and everyone agreed. That worries me. Tell me I'm wrong.", "Everyone around {work} agrees with me. All of them. It's alarming. You disagree with me for fun. Do it now."],
    opts: [
      { tone: 'cold', t: "You probably are wrong.", r: "Good. Go on. Why? Don't soften it.", opts: [
        { tone: 'cold', t: "I don't care enough to argue.", r: "Fair. It's not your fight. I'll find someone else to lose to. Good night." },
        { tone: 'passive', t: "You're rushing it. Slow down.", r: "...Annoyingly sensible. I'll think about it. That's as close as I get to 'you're right'." },
        { tone: 'flirty', t: "You're wrong, but you're gorgeous when you're wrong.", r: "Flattery and a correct answer. Unfair combination. I'll take both." },
      ] },
      { tone: 'passive', t: "What's the decision?", r: "Halve the plan, double the pace. Everyone nodded. Nobody nods at good ideas. They argue.", opts: [
        { tone: 'cold', t: "Then it's a bad idea.", r: "Possibly. Blunt. Useful. Thank you. I'll go and be wrong elsewhere." },
        { tone: 'passive', t: "It's bold. Just check the people can keep up.", r: "...The people. Yes. I forget the people. You don't. Noted. Keep doing that." },
        { tone: 'flirty', t: "I'd follow you at double pace.", r: "I know you would. That's not the question. But I'll keep the answer." },
      ] },
      { tone: 'flirty', t: "I'll argue with you any time.", r: "I know. It's my favourite thing about you. Top three, anyway. Argue.", opts: [
        { tone: 'cold', t: "Fine. You're wrong. Done.", r: "That's not an argument. That's a verdict. I'll appeal. Not tonight, apparently." },
        { tone: 'passive', t: "Okay - what are you not telling them?", r: "...That I'm not sure. How did you know that? Nobody knows that." },
        { tone: 'flirty', t: "What are the other two favourite things?", r: "Earned, not offered. You'll find out when I've decided you can handle them." },
        { tone: 'risque', t: "Argue now, make up later?", r: "That's the best offer I've had all week. Argue properly first. I want my money's worth." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: ["I need you. Not like that. Well. Also like that. Mostly I need someone to tell me I'm wrong about {work}. Nobody will.", "I need you. Not like that - well, also like that. Argue with me about {work}. Everyone else is too polite."],
    opts: [
      { tone: 'cold', t: "You're wrong. There.", r: "Brief. Brutal. Correct, probably. Thank you. Now explain it.", opts: [
        { tone: 'cold', t: "Explain it yourself.", r: "Fine. I will. You've given me the answer; I'll do the homework. Night." },
        { tone: 'passive', t: "You're moving too fast.", r: "I'm always moving too fast. That's the job. ...But you're right. I'll slow it a notch." },
        { tone: 'flirty', t: "You're wrong, but I'd follow you anyway.", r: "That's the worst advice and the best compliment. I'll take one of them." },
      ] },
      { tone: 'passive', t: "Wrong about what?", r: "I want to do in a month what should take three. Everyone said 'brilliant'. You're making a face.", opts: [
        { tone: 'cold', t: "It's a bad idea.", r: "I know. I needed someone to say it. Thank you. I'll sulk about it on my own." },
        { tone: 'passive', t: "Two months. Compromise.", r: "...Two months. That's not a compromise. That's the right answer. How annoying." },
        { tone: 'flirty', t: "Do it in a month. Then take a week off. With me.", r: "That's the best plan anyone's put to me this year. I'll get back to you. I'll say yes." },
      ] },
      { tone: 'flirty', t: "Also like that?", r: "You heard me. Focus. You can flirt after you've told me I'm wrong.", opts: [
        { tone: 'cold', t: "Then I won't bother.", r: "Fine. No flirting, no arguing. A very quiet evening. I'll survive it." },
        { tone: 'passive', t: "Okay. You're wrong. Now can I flirt?", r: "Yes. You've earned it. You've got two minutes. Make them count." },
        { tone: 'flirty', t: "I'll tell you you're wrong if you tell me why you need me.", r: "Bargaining. Good. Because you're the only one who doesn't flinch. Now argue." },
        { tone: 'risque', t: "Let me tell you you're wrong somewhere more private.", r: "Bold. The arguing happens here. The rest happens on my schedule. Keep that offer warm." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: ["You look exhausted. Sit. I'm not asking. ...Fine, I'm asking. Five minutes. Then you can go back to being cold with me.", "You've been distant, and you look shattered. I'll deal with one of those. Sit. Five minutes."],
    opts: [
      { tone: 'cold', t: "I don't need to sit.", r: "You do. But you're an adult, and stubborn. Stand, then. I'll stand with you.", opts: [
        { tone: 'cold', t: "I'd rather be alone.", r: "Then you'll be alone. I'll go. Text me when you're home. That's all I ask." },
        { tone: 'passive', t: "Fine. Five minutes.", r: "Good. Shoulders down. There. You've been carrying that since lap one." },
        { tone: 'flirty', t: "Stand with me, then.", r: "I am. I'm also standing slightly in front of you. Nobody's getting through for five minutes." },
      ] },
      { tone: 'passive', t: "Okay. Sitting.", r: "Good. Water. Here. Drink it. I watched the race. You were brilliant and you look like it cost you.", opts: [
        { tone: 'cold', t: "Don't fuss.", r: "I'm not fussing. I'm managing. Fine. I'll stop. Drink the water, though." },
        { tone: 'passive', t: "Thanks. I needed that.", r: "I know. I usually know. It's my one superpower. Apart from the others." },
        { tone: 'flirty', t: "You watched?", r: "Every lap. I hate watching. I hate not watching more. Don't make anything of that. Make something of it." },
      ] },
      { tone: 'flirty', t: "Only if you sit next to me.", r: "Done. Next to you. Look - your cold front's lifting. I'm very good at weather.", opts: [
        { tone: 'cold', t: "It isn't lifting.", r: "Fine. Stay frosty. I'll sit here anyway. Warmly. Silently." },
        { tone: 'passive', t: "Okay. This is nice.", r: "It is. Five minutes of nice. Then we can go back to sparring. I like both." },
        { tone: 'flirty', t: "Closer would be nicer.", r: "Closer is a reward. You've earned half. Here. Half." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: ["Sit. Five minutes. You don't have to be on for me. Just sit.", "Sit down. That's an order, but a soft one. You've been performing all day. Not for me. Sit."],
    opts: [
      { tone: 'cold', t: "I'm fine standing.", r: "Fine. Stand. I'll sit. You'll notice how much better I look sitting. ...Five minutes. Please.", opts: [
        { tone: 'cold', t: "I've got somewhere to be.", r: "Then go. I mean it. Look after yourself, {me}. Eat something on the way." },
        { tone: 'passive', t: "Okay. Five minutes.", r: "Good. There. Breathe. Nobody's watching. I'm watching. That doesn't count." },
        { tone: 'flirty', t: "You said please.", r: "I did. It's rare. Don't tell anyone. Sit." },
      ] },
      { tone: 'passive', t: "Okay. I'm sitting.", r: "Good. You don't have to talk. I'll talk. Or I won't. I'm good at quiet, when it's you.", opts: [
        { tone: 'cold', t: "I'd rather talk about something else.", r: "Fine. Something else. You pick. I'll listen. I'm capable of that, whatever they say." },
        { tone: 'passive', t: "Do you do this for everyone?", r: "No. Only you. I watch your races, you know. The waiting is awful. Sitting with you is the opposite." },
        { tone: 'flirty', t: "Can I lean on you?", r: "You can. I'm very sturdy. Built for exactly this." },
      ] },
      { tone: 'flirty', t: "Only if you sit with me.", r: "I was always going to sit with you. Here. Closer. That's better. That's much better.", opts: [
        { tone: 'cold', t: "Actually, I'm okay.", r: "Fine. Then I'll sit alone and look dignified. It's a talent." },
        { tone: 'passive', t: "This is nice.", r: "It is. Don't tell anyone I do nice. It'd ruin me." },
        { tone: 'flirty', t: "I could get used to this.", r: "Do. I'm making it a habit. Five minutes, every time I see you." },
        { tone: 'risque', t: "Five minutes isn't enough.", r: "I know. Five minutes is what you get tonight. More when I say so. I'll say so soon." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: ["Sit down. Here. Next to me. You don't have to charm anyone for five minutes. Not even me. Especially not me.", "Sit. Right here. Five minutes of not charming anybody. Including me. Well. Mostly including me."],
    opts: [
      { tone: 'cold', t: "I'll stand, thanks.", r: "Suit yourself. My offer has a timer. Four minutes and fifty seconds.", opts: [
        { tone: 'cold', t: "Let it run out.", r: "Then it runs out. No hard feelings. A soft one. Good night." },
        { tone: 'passive', t: "Fine. Sitting.", r: "Good. See how easy that was? Now breathe. Stop performing." },
        { tone: 'flirty', t: "You're counting?", r: "I count everything. You've got four minutes and forty. Sit." },
      ] },
      { tone: 'passive', t: "Sitting. Happy now?", r: "Good. Now. Nobody's filming. You can stop smiling for the cameras and start smiling for me.", opts: [
        { tone: 'cold', t: "I'm not really in the mood.", r: "Then don't. Sit and don't smile. I'll sit and not mind. Promise." },
        { tone: 'passive', t: "Thank you. Genuinely.", r: "Don't thank me. Just come and sit with me more. That's payment." },
        { tone: 'flirty', t: "That's easy around you.", r: "I know. It's the best thing about me. Top five." },
      ] },
      { tone: 'flirty', t: "I like charming you.", r: "I know. I'm giving you the night off. Take it. You can charm me tomorrow.", opts: [
        { tone: 'cold', t: "Fine. Night off from you, then.", r: "That's not what I said. But fine. Take the night. I'll be here tomorrow." },
        { tone: 'passive', t: "Okay. Night off.", r: "Good. Head here. Shoulder's free. No charge." },
        { tone: 'flirty', t: "I don't want a night off from you.", r: "...Then don't take one. Stay. That was me asking, by the way." },
        { tone: 'risque', t: "Then let me charm you somewhere else.", r: "Not tonight. Tonight you rest. I set the pace, and the pace is gentle. Tomorrow, maybe not." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: ["Come here. ...No? Interesting. You'd rather I came to you. Fine. I'll allow it. Once.", "You were distant last time. So: come here. Or don't. I'm curious which."],
    opts: [
      { tone: 'cold', t: "No.", r: "No. Fine. I don't chase. I'll just stand here being extremely worth it.", opts: [
        { tone: 'cold', t: "Still no.", r: "Received. I'll stop asking. You know where I am. Good night, {me}." },
        { tone: 'passive', t: "...Fine. Here.", r: "There. That wasn't so hard. Was it. Good. You can stay." },
        { tone: 'flirty', t: "Come here yourself.", r: "Bold. You're giving me orders now? ...I'm coming. Not a word." },
      ] },
      { tone: 'passive', t: "Okay. I'm here.", r: "Good. You took your time. I'll forgive it. You're worth the wait. Barely.", opts: [
        { tone: 'cold', t: "Don't push it. Seriously.", r: "Fine. Unpushed. I'll take what I've got. Which is you, here. Good." },
        { tone: 'passive', t: "What did you want?", r: "You. Here. That was the whole plan. I'm a simple creature, sometimes." },
        { tone: 'flirty', t: "Only for you.", r: "I know. That's the only reason I asked. Nobody else gets asked." },
      ] },
      { tone: 'flirty', t: "Make me.", r: "I don't make people do things. I make them want to. ...See? You're already closer.", opts: [
        { tone: 'cold', t: "Not working.", r: "Fine. I'm not going to chase you round the room. Good night." },
        { tone: 'passive', t: "Okay. You win.", r: "I usually do. You lose very well. It's attractive." },
        { tone: 'flirty', t: "Make me want to, then.", r: "I'm doing it right now. Can you feel it working? You can." },
        { tone: 'risque', t: "Make me want to stay the night.", r: "Bold. Making you want to is easy. Whether you get to is my decision. Come here." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: ["Come here. ...That was quick. Good. Now stay there. I'm deciding what happens next.", "Come here. Closer. Good. You follow instructions well. Let's find out how well."],
    opts: [
      { tone: 'cold', t: "Don't order me around.", r: "Fair. I'll rephrase. Would you come here? ...See. Same result. Better manners.", opts: [
        { tone: 'cold', t: "Still not coming.", r: "Then I'll stay where I am, you stay where you are. We'll glare across the room. Romantic." },
        { tone: 'passive', t: "Fine. Since you asked nicely.", r: "I can ask nicely. I just prefer not to. Thank you for making me." },
        { tone: 'flirty', t: "I like being asked.", r: "Then I'll ask. Once. Come here. Please. ...There. Don't say I never do anything for you." },
      ] },
      { tone: 'passive', t: "Okay. Here. What now?", r: "Now you stay still and let me look at you for a moment. I'm memorising you. I'll quiz myself later.", opts: [
        { tone: 'cold', t: "Stop staring.", r: "Fine. Staring stopped. I'll work from memory. Good night." },
        { tone: 'passive', t: "Okay. I'm staying still.", r: "Good. Very good. That's a skill. Most people fidget. You trust me." },
        { tone: 'flirty', t: "Take your time. I'll stay put.", r: "Good. I wasn't going to rush. I never rush the good part." },
        { tone: 'risque', t: "Memorise this.", r: "...You kissed me. Bold. You took the lead for exactly three seconds. Now it's mine again. Come here." },
      ] },
      { tone: 'flirty', t: "I came because I wanted to.", r: "I know. That's the only reason that counts. That's the whole point of me.", opts: [
        { tone: 'cold', t: "Next time I won't.", r: "Then next time I'll miss it. And I'll say so. Good night." },
        { tone: 'passive', t: "What's the whole point of you?", r: "To make people want to do what I ask. Not make them. Want. There's a world of difference." },
        { tone: 'flirty', t: "I want a lot of things right now.", r: "Good. List them. Slowly. I'll tell you which ones you're getting." },
        { tone: 'risque', t: "Then tell me what you want next.", r: "Your hand. Now the other one. Now come closer and stop talking. ...Good." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: ["Come here. Closer. Good. Now don't move. I haven't decided what happens next.", "Come here. No, closer. There. Now I've got you exactly where I want you. Don't move."],
    opts: [
      { tone: 'cold', t: "I'll move if I want to.", r: "You will. You're allowed. You haven't, though. Interesting.", opts: [
        { tone: 'cold', t: "I'm moving. Back.", r: "Fine. Back you go. I'll miss the view. Good night." },
        { tone: 'passive', t: "Fine. I'm staying.", r: "Good. You won't regret it. You'll want to. Briefly. Then you won't." },
        { tone: 'flirty', t: "I haven't moved because I don't want to.", r: "I know. I can tell. You're not very good at pretending around me." },
      ] },
      { tone: 'passive', t: "What happens next?", r: "I decide. That's the fun of it. You find out when I do.", opts: [
        { tone: 'cold', t: "Decide quicker.", r: "Impatient. Fine. I've decided: goodnight. Sleep on it. So will I." },
        { tone: 'passive', t: "I can wait.", r: "Good. Patience is rewarded. Here's your reward. ...That was a kiss on the cheek. Don't get greedy." },
        { tone: 'flirty', t: "Decide on me.", r: "I decided on you weeks ago. This is just the details." },
      ] },
      { tone: 'flirty', t: "Don't move? Or what?", r: "Or nothing. I don't threaten. I just stop. You'd hate it if I stopped.", opts: [
        { tone: 'cold', t: "Then stop.", r: "Stopped. Completely. Good night, {me}. I'll be thinking about it, but I've stopped." },
        { tone: 'passive', t: "I'd hate that.", r: "I know. So stay still. Good. There. Now look at me." },
        { tone: 'flirty', t: "I'm not moving. Ever.", r: "Good. Then I'll take my time. All of it." },
        { tone: 'risque', t: "Then don't stop.", r: "I won't. Not yet. Close your eyes. ...Good. Now count to ten. Slowly. I'll be counting with you." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: ["I'll ask straight, since you like straight. Can I come to {track}? Your garage. Your call. No is fine. I'd rather know.", "You've been cool with me, so I'll keep this clean: I'd like to be at {track}. In your garage. Yes or no. Both are allowed."],
    opts: [
      { tone: 'cold', t: "That's my work. Not a date.", r: "Fair. It's your work. I respect it. That's exactly why I'm asking and not telling.", opts: [
        { tone: 'cold', t: "Then the answer's no.", r: "Then it's no. Thank you for saying it straight. I'll watch from home. Win." },
        { tone: 'passive', t: "Okay. You can come.", r: "Good. I'll be on my best behaviour. Which is still quite intense, I'm told." },
        { tone: 'flirty', t: "It could be a little bit of a date.", r: "A little bit of a date, in a fireproof garage. Romantic. I'm in." },
      ] },
      { tone: 'passive', t: "Okay. Sure. Come.", r: "Good. I'll be there early. I'll bring you something to eat, and you'll eat it.", opts: [
        { tone: 'cold', t: "Don't make a fuss.", r: "No fuss. I'll be a quiet, well-fed presence. You won't even notice me. You'll notice me." },
        { tone: 'passive', t: "What will you do all race?", r: "Stand still and hate every second you're not in front. It's my natural state." },
        { tone: 'flirty', t: "I'll race better with you there.", r: "Then I'm coming to every race. ...Joking. Only the ones you ask me to." },
      ] },
      { tone: 'flirty', t: "Only if you promise to behave.", r: "I'll promise to behave. I can't promise to like it. You'll have to make it up to me later.", opts: [
        { tone: 'cold', t: "Actually, maybe not.", r: "Then no. I won't argue. Second thoughts are allowed. I'll see you after, somewhere else." },
        { tone: 'passive', t: "Deal. Behave and you're in.", r: "Deal. I'll be impeccable. It'll be very difficult for both of us." },
        { tone: 'flirty', t: "Misbehave a little.", r: "In your garage? I'd never. ...I'd consider it. Briefly. Then I'd behave." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: ["I want to come to {track}. Stand in your garage. Watch you up close. Your call - genuinely. No is a fine answer.", "Here's me asking, which I don't do: can I come to {track}? Be in the garage. If it's a no, it's a no."],
    opts: [
      { tone: 'cold', t: "No. I need to focus.", r: "Then no. I mean that. You focus. I'll be on my sofa, shouting at the screen, proudly.", opts: [
        { tone: 'cold', t: "I don't want distractions.", r: "Understood. I'm a very large distraction. Fair call. Win it for both of us." },
        { tone: 'passive', t: "Maybe the race after.", r: "I'll take maybe. I'll be very well behaved about maybe." },
        { tone: 'flirty', t: "You'd be the best kind of distraction.", r: "That's why it's a no. I get it. I'd distract me too." },
      ] },
      { tone: 'passive', t: "Okay. Come to {track}.", r: "Good. I'll stand where they tell me. I'll be quiet. I'll be the most disciplined person in that garage.", opts: [
        { tone: 'cold', t: "Just don't get in the way.", r: "I won't. I know how to stand at the back of a room. I just rarely choose to." },
        { tone: 'passive', t: "You'll stay out of the engineers' way?", r: "I'll be invisible. Well. Quiet. I don't do invisible. Quiet I can manage." },
        { tone: 'flirty', t: "I'll know you're there. That helps.", r: "...That's the nicest thing anyone's said to me in months. Don't you dare crash." },
      ] },
      { tone: 'flirty', t: "I'd love you there.", r: "Good. I'd love to be there. I'll be the one in the back not saying anything, for once.", opts: [
        { tone: 'cold', t: "Actually, let me think about it.", r: "Think. Take as long as you need. I'll wait, and I won't nag. Much." },
        { tone: 'passive', t: "Just stay out of the cameras.", r: "Easily. I'm not there to be seen. I'm there to see you." },
        { tone: 'flirty', t: "I'll look for you every time I pass.", r: "Don't. Eyes on the track. I'll be looking enough for both of us." },
        { tone: 'risque', t: "Stay after the race. All night.", r: "The race first. Then I'll decide about after. I'm leaning yes. Heavily." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: ["I'm coming to {track}. ...That's me asking. I'd like to be in your garage. Say no and I'll watch from my sofa. Sulking.", "I want to be at {track}. With you. In the garage. Consider this a formal request. I'll take no for an answer. Grudgingly."],
    opts: [
      { tone: 'cold', t: "You can't just invite yourself.", r: "I know. That's why I'm asking. Badly. I'm out of practice. Can I come?", opts: [
        { tone: 'cold', t: "No. Not this time.", r: "Not this time. Understood. Sofa it is. I'll sulk with great dignity." },
        { tone: 'passive', t: "Okay, okay. You can come.", r: "Good. I'll be the one at the back, looking unbearably proud of you." },
        { tone: 'flirty', t: "Ask me nicely.", r: "...Can I please come to {track}. There. That cost me dearly. My one 'please' this month. It's yours." },
      ] },
      { tone: 'passive', t: "Okay. Come. I'd like that.", r: "Good. You'd like it. I'll love it. Different levels. Both fine.", opts: [
        { tone: 'cold', t: "Just this once.", r: "Just this once. I'll make it count. And I'll go home after. Promise." },
        { tone: 'passive', t: "I'll get you a pass.", r: "Good. I'll wear it like a medal. Don't laugh. I'll be insufferable." },
        { tone: 'flirty', t: "I'll want you there every race after this.", r: "Then you'll have to ask me. Properly. That's the deal. I asked. Your turn next time." },
      ] },
      { tone: 'flirty', t: "I'd like you there. Very much.", r: "Good. Then I'll be there. Very much. In the back, arms folded, pretending to be calm.", opts: [
        { tone: 'cold', t: "But don't distract me.", r: "I won't. I'll be a statue. A proud, silent, slightly tense statue. Good night." },
        { tone: 'passive', t: "I'll find you after.", r: "Find me after. I'll be the one who hasn't sat down all race." },
        { tone: 'flirty', t: "You distract me just by existing.", r: "Then I'll exist very quietly. ...No promises. I'm quite loud, existentially." },
        { tone: 'risque', t: "And after the race, you're mine.", r: "After the race, we'll see who's whose. I usually win those discussions." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: ["You've been cold, and I've been patient, and I'm done not knowing. Are we doing this or not? Either answer is allowed.", "I'm going to ask once, because I don't ask twice. You and me. Properly. Yes or no? No is a real answer."],
    opts: [
      { tone: 'cold', t: "Why does it have to be decided now?", r: "It doesn't. But I need to know if I'm waiting for something. If I'm not, I'll stop. Cleanly.", opts: [
        { tone: 'cold', t: "Then stop waiting.", r: "Then I'll stop. Thank you for telling me straight. Mind how you go. Eat something.", m: -1 },
        { tone: 'passive', t: "That's not a no.", r: "It's not a yes either. I'll accept it. I'll wait a little longer. A little." },
        { tone: 'flirty', t: "You're not waiting for nothing.", r: "...Good. That's all I needed. I'll wait as long as it takes." },
      ] },
      { tone: 'passive', t: "I want to. I just needed time.", r: "Then you've had it. And I'm still here. That should tell you something.", opts: [
        { tone: 'cold', t: "It tells me you're stubborn.", r: "Correct. Stubborn and patient. A frightening combination. Good night." },
        { tone: 'passive', t: "Then yes. Let's do this.", r: "Good. Good. I'm going to stop saying 'good' now. ...Good." },
        { tone: 'flirty', t: "It tells me you're serious about me.", r: "Very. I don't do this. I'm doing it with you. Come here." },
      ] },
      { tone: 'flirty', t: "Ask me nicely and I'll say yes.", r: "Nicely. ...Will you be mine? Properly? That's as nice as I get. It's a lot.", opts: [
        { tone: 'cold', t: "Ask me another night.", r: "Fine. Another night. I asked nicely once. That'll have to hold you." },
        { tone: 'passive', t: "Yes. I will.", r: "Then that's settled. I'll try not to be smug. I'll fail." },
        { tone: 'flirty', t: "Yes. That was very nice.", r: "I know. I practised. In the mirror. Never repeat that." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: ["I don't share, and I don't do halfway. So I'm asking: are we doing this? You and me. Properly.", "I've been patient - for me. I want to know where we are. Are we doing this? Properly? Either answer's allowed."],
    opts: [
      { tone: 'cold', t: "I'm not ready for that.", r: "Then you're not ready. I won't push. I'll still be here. Stubborn, not pushy. There's a difference.", opts: [
        { tone: 'cold', t: "I don't know if I'll ever be.", r: "Then I'll take that as an answer, and I'll take it well. Be good to yourself, {me}. I mean that.", m: -1 },
        { tone: 'passive', t: "Ask me again in a week.", r: "I don't ask twice. For you I'll make an exception. One week. In the diary. In pen." },
        { tone: 'flirty', t: "I'm not ready - but I want to be.", r: "That's an answer I can work with. I'll wait. I'm very good at waiting when it's worth it." },
      ] },
      { tone: 'passive', t: "Yes. I think we are.", r: "'I think'? I'll take 'I think'. I'll make it 'I know' by the end of the month.", opts: [
        { tone: 'cold', t: "Don't make it a big deal, though.", r: "It is a big deal. I'll keep it quiet, though. Mostly. I'll tell my grandmother. And possibly the cat." },
        { tone: 'passive', t: "So what does properly mean?", r: "It means I book the tables and you turn up. I'm in your corner, you're in mine. Nobody else gets a corner." },
        { tone: 'flirty', t: "I know we are.", r: "Good. Then come here. Properly. ...That's what properly looks like." },
      ] },
      { tone: 'flirty', t: "Took you long enough to ask.", r: "I don't rush things I want to keep. I want to keep this. Yes or no?", opts: [
        { tone: 'cold', t: "No. Not yet.", r: "Not yet. Fine. I heard you. I'll be patient, and I won't make you regret saying it." },
        { tone: 'passive', t: "Yes. Obviously yes.", r: "Good. Obviously. I knew. I wanted to hear it anyway. Say it again. ...Good." },
        { tone: 'flirty', t: "Yes. And you're mine too.", r: "...Agreed. Fully. I'm yours. I've never said that before. Don't tell anyone. Tell everyone." },
        { tone: 'risque', t: "Yes. Now take me home.", r: "Yes to both. But I'm still the one setting the pace. Come on." },
      ] },
    ],
  },
  {
    id: 'dominant-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: ["I've decided something. I want this. You. Properly. Nobody else. I'm asking - which, you'll have noticed, I never do.", "Here it is, plainly: I want you, and only you, and I want to know if you want the same. I'm asking. Answer me."],
    opts: [
      { tone: 'cold', t: "Decided? I get a say, you know.", r: "You get the only say. That's why I'm asking instead of announcing. Well?", opts: [
        { tone: 'cold', t: "Then my say is no.", r: "Then it's no. I'll respect it. I won't pretend it doesn't sting. It does. Good night.", m: -1 },
        { tone: 'passive', t: "My say is yes.", r: "Then it's yes. Good. That's the only vote that ever mattered." },
        { tone: 'flirty', t: "My say is: what took you so long?", r: "I was waiting for the right moment. You kept being distracting." },
      ] },
      { tone: 'passive', t: "Yes. I want that too.", r: "Good. Then it's done. You're mine. I'm yours. Nobody else gets a look in. I'll be unbearable about it.", opts: [
        { tone: 'cold', t: "Don't get possessive.", r: "I won't. Not the bad kind. I'll be proud. Loudly. That's different. You'll see." },
        { tone: 'passive', t: "What happens now?", r: "Now I stop pretending I'm not thinking about you constantly. It's going to be very freeing." },
        { tone: 'flirty', t: "Be unbearable. I like it.", r: "Then you'll love the next few months. I'm going to be extraordinary." },
      ] },
      { tone: 'flirty', t: "I was hoping you'd ask.", r: "I know. I could tell. You've been hoping for weeks. I've been deciding for weeks. We're both done.", opts: [
        { tone: 'cold', t: "I'm not sure I'm done.", r: "Then take the time. I'll be here. I'm not going anywhere, and I'm not going to push." },
        { tone: 'passive', t: "We're both done. Yes.", r: "Then that's that. The best decision I've made this year. I make a lot of decisions." },
        { tone: 'flirty', t: "Then kiss me and make it official.", r: "I'll kiss you when I decide to. ...I've decided. Come here." },
        { tone: 'risque', t: "Make it official. Tonight. Your place.", r: "Bold. Yes. My place. My pace. Come on - before I change my mind. I won't change my mind." },
      ] },
    ],
  },
];
