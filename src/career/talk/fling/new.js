// FLING - in person, stage new: the fun stranger with one eye on the exit. Flirty, quick, allergic to serious. Plain data, no imports.
export const DATA = [
  {
    id: 'fling-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: "You looked straight past me before. Bold. I'm only here an hour, so you've got about fifty minutes to make up for it.",
    opts: [
      { tone: 'cold', t: "I wasn't looking for anyone.", r: "Nobody ever is. That's what makes it fun. Relax, I'm not asking for your hand, just your attention.", opts: [
        { tone: 'cold', t: "Then don't ask for it.", r: "Ooh, frosty. Fine. I'll be by the exit being fascinating, if you thaw." },
        { tone: 'passive', t: "Fine. You've got my attention.", r: "Was that so hard? Look at you, being attentive. I could get used to that. Briefly." },
        { tone: 'flirty', t: "You've got it. All of it.", r: "All of it? Careful. I only came for a little, and I'm terrible at sharing back." },
      ] },
      { tone: 'passive', t: "Sorry. Long day. I wasn't ignoring you.", r: "A long day is just a short night waiting to happen. I'm {first}. I'm the short night.", opts: [
        { tone: 'cold', t: "I'm not after a short night.", r: "Shame. They're my speciality. Long ones, I'm told, are very overrated." },
        { tone: 'passive', t: "Nice to meet you, {first}.", r: "Nice. Polite. Sweet. I'll allow it, for now. Don't let it become a habit." },
        { tone: 'flirty', t: "I'd make the time for a short night.", r: "Look at you, finding time. I'll pencil you in. In very faint pencil." },
      ] },
      { tone: 'flirty', t: "I saw you. I wanted to see if you'd come over.", r: "And I did. Look at that. Clever. I usually make people do the walking, you know.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "Too late, I always do. You walked into that one, by the way. I didn't." },
        { tone: 'passive', t: "So what happens now?", r: "Now we talk until one of us gets bored. Spoiler: it's never me first. I leave before that." },
        { tone: 'flirty', t: "Now you stay longer than an hour.", r: "An hour and five minutes. Final offer. Don't look so pleased, it isn't a promise." },
      ] },
    ],
  },
  {
    id: 'fling-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: "Hi. I'm {first}. I'm here an hour, and I've found the most interesting person in {venue}. It's you. Don't let it go to your head.",
    opts: [
      { tone: 'cold', t: "I'm not that interesting.", r: "Everyone's interesting for an hour. That's my whole philosophy. After that, who knows?", opts: [
        { tone: 'cold', t: "An hour's plenty.", r: "Agreed. See? We're compatible already. Nobody likes an overstayer." },
        { tone: 'passive', t: "What happens after the hour?", r: "I vanish. It's a talent. People find it charming, mostly, and then they get used to it." },
        { tone: 'flirty', t: "Then make it an hour I'll remember.", r: "Oh, I don't do forgettable. Ask anyone. Well. Ask anyone who can find me." },
      ] },
      { tone: 'passive', t: "Only an hour? Busy night?", r: "Busy life. I collect plans the way other people collect stamps. You're plan four. It's a good number.", opts: [
        { tone: 'cold', t: "I'm not anybody's plan four.", r: "Fine, you're plan two. I'm being generous because you've got a face for it." },
        { tone: 'passive', t: "What were plans one to three?", r: "A nap, a friend's thing, and somewhere loud. You're more fun than all three. So far." },
        { tone: 'flirty', t: "Cancel five and six, then.", r: "Look at you, reorganising my night. Bold. I like bold, in small doses. Maybe medium." },
      ] },
      { tone: 'flirty', t: "I'll make it worth more than an hour.", r: "Promises, promises. Everyone says that. Almost nobody manages it. Go on, then. Impress me.", opts: [
        { tone: 'cold', t: "Actually, never mind.", r: "Never mind? You were doing so well. That's the fastest anyone's ever bored themselves." },
        { tone: 'passive', t: "I'll try. No promises.", r: "Honest. Refreshing. Dangerous, too. Honest people are the ones I end up texting at 2am." },
        { tone: 'flirty', t: "Watch me.", r: "Oh, I'm watching. I'm very good at watching. It's the staying I'm bad at. Ask me why some time. Don't." },
      ] },
    ],
  },
  {
    id: 'fling-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "You've been looking at me since I walked in. Good. I've been looking at the door. Let's see which of us wins.",
    opts: [
      { tone: 'cold', t: "I was looking at the door too.", r: "Then we have so much in common. Shame, we could have left together. Another time, maybe.", opts: [
        { tone: 'cold', t: "Another time, then.", r: "Another time, then. I say that a lot. Sometimes I even mean it." },
        { tone: 'passive', t: "Are you always this direct?", r: "Only with people worth the effort. Which, so far, is you. Don't get comfortable." },
        { tone: 'flirty', t: "Maybe we could leave together.", r: "Maybe. Maybe's my favourite word, you know. It never ruins anything." },
      ] },
      { tone: 'passive', t: "Who are you, exactly?", r: "{first}. Here for a good time, not a long time. That's not a slogan. Well, it is. Mine.", opts: [
        { tone: 'cold', t: "That sounds tiring.", r: "Tiring is the point. You sleep better. Allegedly. I wouldn't know, I don't sleep much." },
        { tone: 'passive', t: "I'm here a bit longer than that.", r: "Then you can tell me how it all ends. I always leave before the ending." },
        { tone: 'flirty', t: "I'll take the good time.", r: "Look at you, taking. I like people who take what's offered. Most of them hesitate." },
      ] },
      { tone: 'flirty', t: "The door's losing.", r: "It is, isn't it. Ugh. I hate losing to someone this pretty. Keep talking before I remember I'm leaving.", opts: [
        { tone: 'cold', t: "I wasn't trying to win.", r: "That's what makes it worse. You weren't even trying, and I'm still standing here." },
        { tone: 'passive', t: "Stay, then.", r: "Stay. Such a heavy little word. I'll stay a bit. A bit's what I've got. Take it." },
        { tone: 'flirty', t: "I'll keep talking all night.", r: "All night is a big ask. I do my best work after midnight, though. Just saying." },
      ] },
    ],
  },
  {
    id: 'fling-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "You were a bit cool with me last time. Fine. I'll give you one fact about me. Just one. Then you have to earn the rest.",
    opts: [
      { tone: 'cold', t: "I didn't ask for any facts.", r: "And yet, here's one: I have a plant called Basil. My only long-term relationship. He's thriving.", opts: [
        { tone: 'cold', t: "Congratulations to Basil.", r: "Thank you. He'll be thrilled. He doesn't get many visitors. Nobody gets that far." },
        { tone: 'passive', t: "A plant called Basil?", r: "He's not a basil plant, which is the joke. Nobody gets the joke. Basil doesn't get it either." },
        { tone: 'flirty', t: "I'd like to meet Basil.", r: "Bold. Basil's very particular. Few have been allowed. Fewer stayed for breakfast." },
      ] },
      { tone: 'passive', t: "Go on, then. One fact.", r: "I own a plant called Basil. Three years. Longest thing I've ever committed to. Read into that what you like.", opts: [
        { tone: 'cold', t: "That's a little sad.", r: "Sad? Basil is thriving. I water him on time. It's people I'm bad with. Basil is easy." },
        { tone: 'passive', t: "What kind of plant?", r: "The kind that forgives you for forgetting it. Which is why it's survived me. Smart plant." },
        { tone: 'flirty', t: "Lucky Basil.", r: "Lucky Basil. Don't be jealous of a plant. It's unbecoming. Even if he is very good-looking for a fern." },
      ] },
      { tone: 'flirty', t: "I'd rather earn the rest.", r: "Oh, you would. Fine. Starter fact: I have a plant called Basil. He's the only one who sees me at breakfast.", opts: [
        { tone: 'cold', t: "Never mind, then.", r: "Never mind? You gave up on me faster than I give up on people. That's a first. Impressive." },
        { tone: 'passive', t: "Basil sounds like a good listener.", r: "The best. Never asks where I've been. Never asks what we are. Perfect relationship, really." },
        { tone: 'flirty', t: "Breakfast with you sounds nice.", r: "Breakfast. Mm. That's a bigger ask than you know. Let's work on tonight first." },
      ] },
    ],
  },
  {
    id: 'fling-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "You want to know about me? Everyone does. Here's all you get: I have a plant called Basil. He's my longest relationship. Three years.",
    opts: [
      { tone: 'cold', t: "I wasn't going to ask.", r: "You were. You had the face. The face that wants a backstory. I don't do backstories. I do Basil.", opts: [
        { tone: 'cold', t: "Keep your backstory.", r: "I will. It's very safe in there. Locked, mostly. Basil has the key." },
        { tone: 'passive', t: "Three years is a long time.", r: "For me? It's practically a marriage. He doesn't even know my middle name. That's how I like it." },
        { tone: 'flirty', t: "Basil's lucky.", r: "Basil is lucky. He gets the best of me: water on Tuesdays and no questions. Want the same deal?" },
      ] },
      { tone: 'passive', t: "And what else?", r: "Nothing else. That's the trick. Mystery keeps people interested. Information makes them stay. I don't need stayers.", opts: [
        { tone: 'cold', t: "That sounds lonely.", r: "Lonely? No. Basil's there. And lots of very fun people for a night. It's a good system." },
        { tone: 'passive', t: "Fair. I'll take Basil.", r: "Good. A reasonable person. You'd be amazed how many people demand my childhood." },
        { tone: 'flirty', t: "I'll find out the rest eventually.", r: "Eventually's a long time. I'm a now person. But you can try. You'd be cute trying." },
      ] },
      { tone: 'flirty', t: "Tell me something Basil doesn't know.", r: "Ooh. Okay. I almost didn't come out tonight. Then I saw you. Basil doesn't know that. Don't tell him.", opts: [
        { tone: 'cold', t: "I won't tell him anything.", r: "Good. Secrets are what keep it fun. The moment it gets serious, it gets boring." },
        { tone: 'passive', t: "Why almost not come?", r: "Long week. Short temper. Low battery. The usual. You fixed one of those. Not saying which." },
        { tone: 'flirty', t: "I'll keep your secret.", r: "You'd better. I'm trusting you with Basil-level information here. That's rare. Very rare." },
      ] },
    ],
  },
  {
    id: 'fling-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "I'm telling you one thing about me, because you're nice to look at. I have a plant called Basil. He's my only commitment.",
    opts: [
      { tone: 'cold', t: "That's all? A plant?", r: "A plant who's lasted three years. Most people don't last three weekends. Basil's my high score.", opts: [
        { tone: 'cold', t: "Not a great high score.", r: "Harsh. Basil would be offended. I'm only slightly offended. Mostly impressed you said it." },
        { tone: 'passive', t: "What happens after three weekends?", r: "I get restless. It's not you. It's never anyone. It's just me, and the door." },
        { tone: 'flirty', t: "I could beat Basil's record.", r: "Nobody beats Basil. Feel free to attempt it. Bring water, he likes people who bring water." },
      ] },
      { tone: 'passive', t: "Why the name Basil?", r: "Because he isn't one. It's a joke. Nobody laughs. Basil doesn't laugh. You're smiling, though. That counts.", opts: [
        { tone: 'cold', t: "I'm not smiling.", r: "You are, a bit, at the corner. I'm very good at corners. It's the middle of things I avoid." },
        { tone: 'passive', t: "It's a good joke.", r: "Thank you. I've been waiting three years for someone to say that. Ask me something else. Not too much." },
        { tone: 'flirty', t: "I'm smiling because of you.", r: "Ugh. Smooth. Too smooth. That's how they get you, you know. Smooth first, feelings later." },
      ] },
      { tone: 'flirty', t: "Lucky plant. Gets to see you every day.", r: "Every morning, at least. Which is more than anyone else gets. I don't do mornings with people.", opts: [
        { tone: 'cold', t: "Noted. No mornings.", r: "Good. You listen. That's rarer than a good plant. Most people try to argue." },
        { tone: 'passive', t: "Why no mornings?", r: "Mornings are when people start asking what this is. Nights don't ask. Nights just are." },
        { tone: 'flirty', t: "Then I'll stick to nights.", r: "Smart. Nights are where I'm best. You'll see. Probably. If you're lucky and I'm bored." },
      ] },
    ],
  },
  {
    id: 'fling-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "Last time you were hard work. So let's keep it simple. I have rules. Rule one: nobody catches feelings. Can you manage that?",
    opts: [
      { tone: 'cold', t: "That won't be a problem.", r: "Wow. Keen to agree. Bit hurtful, honestly. Rule two is no breakfast, by the way, in case you were hoping.", opts: [
        { tone: 'cold', t: "I wasn't hoping.", r: "Good. We'll get on fine. No hope, no feelings, no breakfast. Perfect evening." },
        { tone: 'passive', t: "Are there more rules?", r: "A few. I add them as I go. Rule three's a secret. You'll find it by breaking it." },
        { tone: 'flirty', t: "Rules are made to be bent.", r: "Bent, yes. Never broken. There's a difference. Bending is fun. Breaking means someone cries." },
      ] },
      { tone: 'passive', t: "What happens if someone does?", r: "Then I'm gone before it gets messy. It's not personal. Rule one protects everyone. Mostly me.", opts: [
        { tone: 'cold', t: "Sounds cold.", r: "It's not cold, it's tidy. Nobody gets hurt if nobody pretends. I'm honest about it. Most aren't." },
        { tone: 'passive', t: "Fair enough.", r: "Thank you. You'd be shocked how many people take rule one as a challenge." },
        { tone: 'flirty', t: "What if it's you who catches them?", r: "Me? Never happened. I've got antibodies. Ask me in a year. Actually, don't." },
      ] },
      { tone: 'flirty', t: "I'm already in trouble, then.", r: "Already? We've barely started. Stop it. Rule one, I said. You're meant to be the easy one.", opts: [
        { tone: 'cold', t: "Kidding. I'm fine.", r: "Good. Fine is good. Fine is my favourite. Keep being fine and we'll be great." },
        { tone: 'passive', t: "What's rule two?", r: "No breakfast. Breakfast is how it starts. Toast, then questions, then someone wants a drawer." },
        { tone: 'flirty', t: "I'll risk it.", r: "Don't say that. I like you too much to watch you lose. That came out wrong. Ignore that." },
      ] },
    ],
  },
  {
    id: 'fling-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Before anything happens, and things might, I should tell you the rules. Rule one: no feelings get caught. It keeps everything light.",
    opts: [
      { tone: 'cold', t: "Nothing's going to happen.", r: "Mm. Famous last words. Everyone says that before something happens. Rule one still stands.", opts: [
        { tone: 'cold', t: "It really won't.", r: "Then rule one's easy for you. Lucky. Most people find it harder than they planned." },
        { tone: 'passive', t: "Do you tell everyone the rules?", r: "Only the ones I like. Saves time later. Saves feelings. Hence the rule." },
        { tone: 'flirty', t: "Maybe something will.", r: "There it is. I always get the maybe. Rule one's watching you, by the way." },
      ] },
      { tone: 'passive', t: "Is there a rule two?", r: "No breakfast. Rule three's that you never ask what this is. Do those three and we'll have the best time.", opts: [
        { tone: 'cold', t: "That's a lot of rules.", r: "Three isn't a lot. It's a framework. Light structure. Like scaffolding round a very fun building." },
        { tone: 'passive', t: "Sounds reasonable.", r: "It's completely reasonable. Nobody ever thinks so after week three. You'll see. Or you won't, I hope." },
        { tone: 'flirty', t: "I'll follow the rules. Mostly.", r: "Mostly is where all the trouble lives. I'd know. I live there too." },
      ] },
      { tone: 'flirty', t: "I've never been good with rules.", r: "Neither have I, except these. These ones are load-bearing. Pull one out and the whole roof comes in.", opts: [
        { tone: 'cold', t: "Then I'll leave them alone.", r: "Good. Wise. Most people want to test them. Testing is how I lose people. Well. How they lose me." },
        { tone: 'passive', t: "Why load-bearing?", r: "Long story. Not telling it. That's sort of the point of the rules, isn't it." },
        { tone: 'flirty', t: "I'll be very careful with the roof.", r: "You say that now. You've got a dangerous face for a careful person. I'll keep an eye on you." },
      ] },
    ],
  },
  {
    id: 'fling-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "You're trouble, aren't you? I can tell. So I'm telling you now: rule one, nobody catches feelings. You. Especially you.",
    opts: [
      { tone: 'cold', t: "Don't worry about me.", r: "I'm not worried. I'm warning. There's a difference. Worried is for people who stay.", opts: [
        { tone: 'cold', t: "Warning noted.", r: "Good. I'll put that in writing later. Probably at 2am. That's when I do my best paperwork." },
        { tone: 'passive', t: "What's the warning for?", r: "Because people like you are exactly how I end up breaking rule one. Not that I have. Ever." },
        { tone: 'flirty', t: "Maybe I want to be warned.", r: "Ugh. You're enjoying this. Me too. That's the problem. Rule one exists for a reason." },
      ] },
      { tone: 'passive', t: "And rule two?", r: "No breakfast. Rule three: never ask what this is. Three rules. They've kept me very happy for a very long time.", opts: [
        { tone: 'cold', t: "Happy, or alone?", r: "Ouch. Happy. Alone is a thing people say about people who are happy without them." },
        { tone: 'passive', t: "That's a tidy system.", r: "Tidy, efficient, very little crying. I'd recommend it. I do recommend it, constantly." },
        { tone: 'flirty', t: "I'll ask what this is anyway.", r: "Don't. Seriously. That's the only way to end this before it starts. Ask me something fun instead." },
      ] },
      { tone: 'flirty', t: "Too late for me.", r: "Too late? We just met. Slow down. It's adorable and it's terrifying. Rule one, babe. I mean it. Mostly.", opts: [
        { tone: 'cold', t: "Relax. Joking.", r: "Good. Joking I can do. I'm fluent in joking. Anything else needs a translator." },
        { tone: 'passive', t: "I'll behave.", r: "You won't, but I appreciate the effort. Behaving is boring anyway. Just don't fall." },
        { tone: 'flirty', t: "Then catch me.", r: "That's not how it works. I don't catch. I duck. Everyone knows that. Well, now you do." },
      ] },
    ],
  },
  {
    id: 'fling-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "You were dull last time. No offence. Here's a test: what do you do after midnight? If you say sleep, I'm walking.",
    opts: [
      { tone: 'cold', t: "Sleep. I race for a living.", r: "Honest and boring. A dangerous combination. Fine. I'll stay, but only because you've got nice eyes.", opts: [
        { tone: 'cold', t: "Then walk.", r: "Rude. I'm staying out of spite now. You'll find I'm extremely spiteful. In a fun way." },
        { tone: 'passive', t: "I can stay up for the right reason.", r: "Good answer. A late answer. I'm a late person. Mornings are a myth people tell to sell coffee." },
        { tone: 'flirty', t: "For you, I'd stay up.", r: "There you go. That's what I wanted. Wasn't hard, was it? Midnight's when I get interesting." },
      ] },
      { tone: 'passive', t: "Depends what's on offer.", r: "Me, mostly. Loud places, quiet corners, the bit of the night where everyone gets honest and nobody remembers.", opts: [
        { tone: 'cold', t: "That sounds exhausting.", r: "It's the best kind of exhausting. The kind you sleep off by noon and do again by ten." },
        { tone: 'passive', t: "And when does it end?", r: "Sunrise. I'm allergic to sunrise. It makes everyone look at each other properly. Terrifying." },
        { tone: 'flirty', t: "Sounds like my kind of offer.", r: "Does it? Careful, I might hold you to that. I'm very reliable after dark. Only after dark." },
      ] },
      { tone: 'flirty', t: "After midnight? Whatever you're doing.", r: "Oh, that's very good. You're good at this. Suspiciously good. Are you a night person, secretly?", opts: [
        { tone: 'cold', t: "No. I'm a morning person.", r: "A morning person. I knew there'd be a catch. Pretty, nice, and up at dawn. Tragic." },
        { tone: 'passive', t: "I could become one.", r: "Everyone could. Most just need the right reason to stay up. I'm a very good reason." },
        { tone: 'flirty', t: "Show me what the night's for.", r: "Not yet. Soon. A night is a gift. I don't give them out on the first conversation." },
      ] },
    ],
  },
  {
    id: 'fling-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Are you a night person? You look like you might be, under all that discipline. I'm a midnight person. Nothing good starts before eleven.",
    opts: [
      { tone: 'cold', t: "I'm asleep by eleven most nights.", r: "Most nights. I'll take the others. Everyone has others. I'm very good at the others.", opts: [
        { tone: 'cold', t: "Not many others.", r: "Then the few you've got are precious. Don't waste them sleeping. Waste them with me." },
        { tone: 'passive', t: "What happens after eleven?", r: "Everything. The good conversations. The bad decisions. The best people come out late, like owls." },
        { tone: 'flirty', t: "For you, I'd make an exception.", r: "Ooh. An exception. My favourite thing to be. Nobody remembers the rules, only the exceptions." },
      ] },
      { tone: 'passive', t: "What's the best bit of the night?", r: "About half two. Everyone's honest, nobody's sensible, and the walk home feels like a film. Not a long film.", opts: [
        { tone: 'cold', t: "I'll take your word for it.", r: "You should come and check. Word's never as good as the real thing. The real thing's very good." },
        { tone: 'passive', t: "Why not a long film?", r: "Long films need endings. I don't like endings. I leave in the middle. Best bit of any film." },
        { tone: 'flirty', t: "Show me half two some time.", r: "Some time. I like that. It sounds like a promise but it isn't one. Perfect." },
      ] },
      { tone: 'flirty', t: "I'm whatever person you need me to be.", r: "Oh, careful. That's how people end up very tired and very confused. I'll only need you at night. Promise.", opts: [
        { tone: 'cold', t: "Forget I said that.", r: "Already forgotten. I'm very good at forgetting. It's one of my gifts. Ask anyone. They won't know." },
        { tone: 'passive', t: "What do you need at night?", r: "Fun. Company. Someone who doesn't ask what time I'm leaving. Someone who doesn't ask anything, really." },
        { tone: 'flirty', t: "I can be your night person.", r: "Can you, though? It's a big job. Long hours. Terrible pay. Excellent perks. Apply in person." },
      ] },
    ],
  },
  {
    id: 'fling-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "Tell me you're up late. Please. I've had a whole week of people who go to bed at ten. I need someone who knows what midnight's for.",
    opts: [
      { tone: 'cold', t: "I go to bed at ten.", r: "Of course you do. Athletes. All discipline and no nightlife. Shame. It's wasted on the sensible.", opts: [
        { tone: 'cold', t: "Discipline wins races.", r: "And loses parties. Both are fine. One is just more fun. Guess which one I am." },
        { tone: 'passive', t: "I've been known to stay up.", r: "Known to. Like a rumour. I love a rumour. Let's see if it's true some time." },
        { tone: 'flirty', t: "Teach me what midnight's for.", r: "I could. I'm a very good teacher. One lesson at a time, and nobody gets a report card." },
      ] },
      { tone: 'passive', t: "What is midnight for?", r: "Starting things you'll finish by morning. Or not finish. Unfinished is underrated. Unfinished never disappoints.", opts: [
        { tone: 'cold', t: "That sounds empty.", r: "Empty? It's full. Full of now. It's tomorrow that's empty. I just don't go there much." },
        { tone: 'passive', t: "You've thought about this a lot.", r: "I've thought about nothing else, mostly at 2am. That's where the thinking happens. And the not thinking." },
        { tone: 'flirty', t: "Then let's start something.", r: "Not yet. You're rushing. Rushing is for the track. Out here, the slow build's the fun." },
      ] },
      { tone: 'flirty', t: "I'll stay up for you.", r: "Will you? Everyone says that. Then it's half eleven and they're yawning into my neck. Prove it.", opts: [
        { tone: 'cold', t: "Maybe not.", r: "Maybe not. That's fine. I'll find someone else to keep me up. I always do. You'll hear about it." },
        { tone: 'passive', t: "I'll try.", r: "Trying is half the battle. The other half is espresso. You'll learn. I'll teach you." },
        { tone: 'flirty', t: "Try me.", r: "Oh, I will. I'll be watching you very closely at about one in the morning. Bring stamina." },
      ] },
    ],
  },
  {
    id: 'fling-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Ask me something, then. Not where I'm from. Not about family. Something fun. You were dry as toast last time.",
    opts: [
      { tone: 'cold', t: "Where are you from?", r: "I said not that. Somewhere with a sky and a bus station. That's all you get. Next question. Fun one.", opts: [
        { tone: 'cold', t: "Fine. I'm done asking.", r: "Thank goodness. Questions make me itch. Now you're mysterious too. Look at us." },
        { tone: 'passive', t: "What's your favourite thing about it?", r: "The bus out. Kidding. Mostly. Someone there makes good soup. That's the only fact. Next." },
        { tone: 'flirty', t: "Something fun: what makes you blush?", r: "Nothing. Ever. Okay, maybe you, slightly, just then. Don't push your luck. I'll deny it." },
      ] },
      { tone: 'passive', t: "What's the most fun you've ever had?", r: "I'm having it in about an hour, probably. I don't keep a list. Lists are for people who look backwards.", opts: [
        { tone: 'cold', t: "That's not an answer.", r: "It's the only answer I give. Everything else is classified. Even Basil doesn't know the rest." },
        { tone: 'passive', t: "You never look back?", r: "Never. Looking back is how you trip. Ask a racing driver. You don't look in the mirror forever, do you?" },
        { tone: 'flirty', t: "Then let's make the list.", r: "Ugh, you're good. Fine. One entry. Tonight. Make it worth writing down." },
      ] },
      { tone: 'flirty', t: "Tell me about your family.", r: "Absolutely not. That's a third-date question and we're not dating. We're just... standing near each other attractively.", opts: [
        { tone: 'cold', t: "Sorry I asked.", r: "Don't be sorry. Just be fun. Sorry is heavy. I travel light. One bag, no regrets, no family trees." },
        { tone: 'passive', t: "Okay. What do you like?", r: "Late trains. Loud songs. People who don't ask about my family. You're halfway there." },
        { tone: 'flirty', t: "Attractively is right.", r: "There. That's the energy. Flattery is always welcome. Family history is not. You've learnt fast." },
      ] },
    ],
  },
  {
    id: 'fling-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "You've got that look. The one where you want to ask something real. Go on. I'll probably dodge it, but I like the look.",
    opts: [
      { tone: 'cold', t: "No look. Just tired.", r: "Liar. It's the real-question look. I know it well. I've been running from it for years.", opts: [
        { tone: 'cold', t: "I'm not chasing you.", r: "I know. It's very relaxing. Most people chase. You just stand there being calm. Unnerving." },
        { tone: 'passive', t: "Why run from it?", r: "Because real questions want real answers, and real answers want follow-ups. I'm a one-take person." },
        { tone: 'flirty', t: "Maybe I'll catch you.", r: "Maybe you will. You're fast. Professionally fast. That's not fair. I'll have to cheat." },
      ] },
      { tone: 'passive', t: "Where did you grow up?", r: "A small town where everyone knew my business. So now I keep it to myself. Big world. Small mouth. Next.", opts: [
        { tone: 'cold', t: "That explains a lot.", r: "Doesn't it. Don't psychoanalyse me on the first conversation. Wait for the fourth. I won't be there." },
        { tone: 'passive', t: "Do you ever go back?", r: "At Christmas. Briefly. I love them. They want me to settle down. I want them to stop saying that." },
        { tone: 'flirty', t: "A small town couldn't hold you.", r: "Correct. It couldn't. Nobody could. That's not a challenge, by the way. Don't take it as one." },
      ] },
      { tone: 'flirty', t: "What's something nobody knows about you?", r: "I cried at a film about a dog last month. Tell anyone and I'll ruin your reputation. Not that I could. I'd try.", opts: [
        { tone: 'cold', t: "Your secret's safe.", r: "Good. I knew you'd be good at secrets. You've got a quiet face. Those are the dangerous ones." },
        { tone: 'passive', t: "Which film?", r: "Not telling. The dog makes it. Spoilers. I'm not crying again in public. Especially not near you." },
        { tone: 'flirty', t: "That's adorable.", r: "It's not adorable, it's a malfunction. I've had it looked at. They said it's called having a heart. Rude." },
      ] },
    ],
  },
  {
    id: 'fling-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "You're doing it. You're about to ask me something serious. I can see it. Quick, say something flirty instead, before it happens.",
    opts: [
      { tone: 'cold', t: "No. I'll ask what I want.", r: "Brave. Pointless, but brave. Go on, then. I'll answer one. With a lie, probably, but a nice one.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Forgotten. See? This is why we get on. Nobody here wants to remember anything." },
        { tone: 'passive', t: "What are you running from?", r: "Wow. Straight for the throat. Nothing. Boredom. Being known too well. Next question, a fun one." },
        { tone: 'flirty', t: "Fine. You look incredible.", r: "Better. Much better. See how nice it is when we stay on the surface? The surface is lovely." },
      ] },
      { tone: 'passive', t: "What's your family like?", r: "Loud. Lovely. Very keen on me meeting someone nice. I keep telling them I meet lots of nice people. Briefly.", opts: [
        { tone: 'cold', t: "That's a bit sad for them.", r: "A bit. They'll get over it. I get over everything. Family trait. Well, my trait." },
        { tone: 'passive', t: "Do you want what they want?", r: "Some day, maybe. Not this year. Not this decade. Ask me when I'm boring. I'll never be boring." },
        { tone: 'flirty', t: "Maybe I'm nice.", r: "Maybe you are. That's the problem. Nice is how it starts. Then it's a toothbrush in my bathroom." },
      ] },
      { tone: 'flirty', t: "You're the most interesting thing here.", r: "There it is. Thank you. That was much better than a question about my childhood. I'm sure my childhood agrees.", opts: [
        { tone: 'cold', t: "I meant {venue}'s dull.", r: "Oh, a backhanded one. Lovely. I'll take it. I take everything, briefly." },
        { tone: 'passive', t: "I mean it.", r: "I know. That's the scary part. You mean things. I don't, usually. It's very much a me problem." },
        { tone: 'flirty', t: "Even more than the exit?", r: "More than the exit. Don't tell the exit. It gets jealous. It's the only thing I'm loyal to." },
      ] },
    ],
  },
  {
    id: 'fling-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "You look tired. And a bit cross with me, from last time. I noticed. I notice things, when I feel like it. Today I feel like it.",
    opts: [
      { tone: 'cold', t: "I'm fine.", r: "You're not fine, you're stiff as a board. Shoulders down. There. See? I can be nice. Don't get used to it.", opts: [
        { tone: 'cold', t: "Don't fuss.", r: "I'm not fussing, I'm observing. Fussing is for people who stay. I'll be gone by the time you're grateful." },
        { tone: 'passive', t: "Thanks. That helps.", r: "I know. I'm very good at helping for about ten minutes. After that I'm useless. Enjoy the ten." },
        { tone: 'flirty', t: "You can keep noticing.", r: "Careful. I notice, then I wander off. It's a two-part act. You've only seen the first part." },
      ] },
      { tone: 'passive', t: "Long week. You noticed?", r: "Of course. You squint when you're tired. Also when you're lying. I haven't worked out which this is.", opts: [
        { tone: 'cold', t: "Neither, I'm just quiet.", r: "Quiet. Okay. I respect quiet. I can't do it myself, but I respect it from a safe distance." },
        { tone: 'passive', t: "Tired. Honestly.", r: "Then I'll be gentle. For a whole minute. Then I'm back to being trouble. Fair warning." },
        { tone: 'flirty', t: "Squinting at you, mostly.", r: "Ha. Good one. Flattery from a tired person. Very sincere. I'll keep it on the fridge. Briefly." },
      ] },
      { tone: 'flirty', t: "Notice anything else?", r: "That you've been watching my mouth while I talk. That you like me more than you're admitting. And your collar's wonky.", opts: [
        { tone: 'cold', t: "My collar's fine.", r: "It's wonky. I'm not fixing it. Fixing collars is a relationship thing. We are very much not that." },
        { tone: 'passive', t: "Fair. All true.", r: "Honest. Ugh. Honest is so attractive and so inconvenient. Stop it." },
        { tone: 'flirty', t: "Fix it, then.", r: "Fine. There. Don't look at me like that. It was a collar, not a proposal. Calm yourself." },
      ] },
    ],
  },
  {
    id: 'fling-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "Hey. You look like you've had a long day. Come here. Breathe for a second. See? I can be thoughtful. It comes and goes, like weather.",
    opts: [
      { tone: 'cold', t: "I don't need looking after.", r: "Nobody needs it. Everybody likes it. I'm only doing it while it's convenient, so enjoy it.", opts: [
        { tone: 'cold', t: "It's not convenient for me.", r: "Shame. I'm told I'm very good at it. In short bursts. Long bursts are someone else's job." },
        { tone: 'passive', t: "Okay. Thank you.", r: "There. Was that so painful? Thoughtful is my weather today. Tomorrow, who knows? Probably sunny and gone." },
        { tone: 'flirty', t: "You're a natural at this.", r: "I'm good at the start of things. The start is my best work. Ask me about the middle. I've never been." },
      ] },
      { tone: 'passive', t: "That's kind of you.", r: "Don't spread it round. Kind gets you a reputation. Then people expect it. Then I'm stuck being kind on a Tuesday.", opts: [
        { tone: 'cold', t: "I won't tell a soul.", r: "Thank you. My reputation depends on being delightful and unreliable. Mostly unreliable." },
        { tone: 'passive', t: "What's wrong with Tuesdays?", r: "Tuesdays are when people text you about Saturday. Tuesdays want plans. I'm more of a Saturday-at-11pm person." },
        { tone: 'flirty', t: "I'll take kind on any day.", r: "Any day? Even a Tuesday? That's commitment talk. Back away slowly from the commitment talk." },
      ] },
      { tone: 'flirty', t: "You're sweeter than you let on.", r: "Shh. Don't say that. If anyone hears, I'll have people bringing me soup when I'm ill. Horrifying.", opts: [
        { tone: 'cold', t: "Fine, you're horrible.", r: "Thank you. Much better. Horrible I can maintain. Sweet needs upkeep, like a garden. Or Basil." },
        { tone: 'passive', t: "Soup's not so bad.", r: "Soup is how it begins. Soup, then keys, then someone knows your mother's birthday. No soup." },
        { tone: 'flirty', t: "I'd bring you soup.", r: "You would, wouldn't you. That's the scary bit. Don't. I'll eat it and then I'll vanish. It's what I do." },
      ] },
    ],
  },
  {
    id: 'fling-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "Come here. You look like you need someone to pay attention to you for five minutes. Lucky you, I'm in a five-minute mood.",
    opts: [
      { tone: 'cold', t: "Just five?", r: "Five excellent minutes. Most people get none. Don't waste them sulking. Ask me something nice.", opts: [
        { tone: 'cold', t: "I'll pass.", r: "Your loss. Genuinely. My five minutes are very good. People write about them. In texts, mostly. At 3am." },
        { tone: 'passive', t: "Okay. How was your week?", r: "Chaotic. Fun. Forgettable, mostly. Better now. Don't make me say why." },
        { tone: 'flirty', t: "Then make them count.", r: "Oh, I will. I'm very efficient with five minutes. Watch. I'm looking at you. That's minute one." },
      ] },
      { tone: 'passive', t: "What happens after five?", r: "I get distracted. Something shiny, somewhere loud. It's not you. Well, a little bit you, for being so easy to like.", opts: [
        { tone: 'cold', t: "That's honest.", r: "I'm always honest about the leaving. It's the staying I lie about. I never stay." },
        { tone: 'passive', t: "I'll take five minutes.", r: "Wise. People who take what they're given are far happier. People who want more get hurt. Not by me. Just generally." },
        { tone: 'flirty', t: "I'll make you forget the clock.", r: "Bold. Nobody's managed that. You've got a nice voice for trying, though. Keep it low. Like that." },
      ] },
      { tone: 'flirty', t: "Pay attention to me, then.", r: "Ooh, demanding. I like it. Fine. You've got good hands. Steady. You're nervous anyway. That's cute.", opts: [
        { tone: 'cold', t: "I'm not nervous.", r: "You're a bit nervous. It's fine. I'm a lot. People usually are, with me. It passes. So do I." },
        { tone: 'passive', t: "Maybe a little.", r: "A little is perfect. Nerves are just interest wearing a disguise. I can see through disguises." },
        { tone: 'flirty', t: "You make me nervous.", r: "Good. That's the right amount. Not too much, or it gets serious. Keep it at this. Exactly this." },
      ] },
    ],
  },
  {
    id: 'fling-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "You were very serious last time. Let's see if you can be fun. I dare you to do something stupid with me later. Not dinner. Never dinner.",
    opts: [
      { tone: 'cold', t: "I don't do stupid.", r: "Everyone does stupid. You just do it at two hundred miles an hour and call it a job. Do it slower, with me.", opts: [
        { tone: 'cold', t: "Still no.", r: "Fine. I'll find someone else to be stupid with. There's always someone. There's never you, apparently." },
        { tone: 'passive', t: "What kind of stupid?", r: "Fun stupid. Chips at 3am. A rooftop we're not allowed on. Nothing you'd regret. Probably." },
        { tone: 'flirty', t: "Okay. Slow stupid. With you.", r: "Look at that. You can be fun. I knew it was in there, under all the discipline. Somewhere." },
      ] },
      { tone: 'passive', t: "Why never dinner?", r: "Dinner is a date. Dates have endings, and people want to discuss the endings. A dare just happens, and then it's over.", opts: [
        { tone: 'cold', t: "That's a strange way to live.", r: "It's a light way to live. Nothing heavy to carry. You should try it. You look like you carry a lot." },
        { tone: 'passive', t: "So what's the dare?", r: "Later. Somewhere loud. You and me and no plan at all. The best nights never have a plan." },
        { tone: 'flirty', t: "I'll take the dare.", r: "There we go. Brave. I'll text you. Late. Don't be asleep, or the dare goes to someone braver." },
      ] },
      { tone: 'flirty', t: "Dare accepted.", r: "Already? Without asking what it is? Either you're very brave or very bored. Both work for me.", opts: [
        { tone: 'cold', t: "On second thoughts, no.", r: "Coward. I respect it. Cowards live longer. They just have much less fun on the way." },
        { tone: 'passive', t: "What is it, though?", r: "A surprise. You'll find out when I text you. If I text you. I usually do. Usually." },
        { tone: 'flirty', t: "Whatever it is, I'm in.", r: "That's the spirit. Dangerous spirit. I like it. Don't go getting any ideas about it becoming a habit." },
      ] },
    ],
  },
  {
    id: 'fling-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "I've got a plan for later. It's not a date. Dates are for people who want to know each other's middle names. Are you in?",
    opts: [
      { tone: 'cold', t: "What sort of plan?", r: "The sort where you don't ask what sort of plan. You've failed already. Try again. Just say yes.", opts: [
        { tone: 'cold', t: "Then I'm out.", r: "Out. Okay. Bit of a shame. You'd have liked it. Everyone likes my plans. Nobody likes my follow-up." },
        { tone: 'passive', t: "Yes. Fine. Probably.", r: "Probably is a yes in my language. I'm fluent in probably. It's the only thing I commit to." },
        { tone: 'flirty', t: "I'm in. Middle names optional.", r: "Middle names forbidden, actually. Strict policy. Glad you're in. You'll enjoy it, then forget it." },
      ] },
      { tone: 'passive', t: "What's wrong with middle names?", r: "Nothing, they're just the first step. Middle names, then star signs, then someone's meeting your mother.", opts: [
        { tone: 'cold', t: "You overthink this.", r: "I underthink everything else, so it balances out. This is the one thing I think about." },
        { tone: 'passive', t: "Fair. No middle names.", r: "Thank you. It's a small rule, but it saves so much trouble down the line." },
        { tone: 'flirty', t: "Mine's a secret anyway.", r: "Ooh. A secret. Keep it. That's the most attractive thing you've said so far. Mystery suits you." },
      ] },
      { tone: 'flirty', t: "A not-date with you? Absolutely.", r: "Look at you, catching on. Not-dates are the best dates. No pressure, no expectations, no awkward goodbye.", opts: [
        { tone: 'cold', t: "Actually, I'll skip it.", r: "Your loss. I'll tell you about it anyway. Slowly. In detail. So you can regret it properly." },
        { tone: 'passive', t: "Where are we going?", r: "Wherever the night goes. Probably somewhere loud. Definitely not anywhere with tablecloths." },
        { tone: 'flirty', t: "I'll be ready.", r: "Be ready late. I'm never early for anything. Early is for people with plans. I have impulses." },
      ] },
    ],
  },
  {
    id: 'fling-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "I've decided you're coming out with me some time. Not to dinner. Somewhere with music and bad decisions. You look like you need one.",
    opts: [
      { tone: 'cold', t: "I don't make bad decisions.", r: "That's the saddest thing I've heard all week. Everyone needs one. They're like vitamins.", opts: [
        { tone: 'cold', t: "I'm healthy enough.", r: "You are. Very. Disgustingly so. I'll find someone with worse habits. They're easier to find." },
        { tone: 'passive', t: "Maybe one small one.", r: "One small bad decision. That's how they all start. I'm very proud of you already." },
        { tone: 'flirty', t: "You're the bad decision, aren't you?", r: "Obviously. The best one you'll ever make. And then unmake. That's the beauty of it." },
      ] },
      { tone: 'passive', t: "Somewhere with music sounds fine.", r: "Fine. I'll take fine. Fine turns into fun about midnight. Fun turns into a story by morning.", opts: [
        { tone: 'cold', t: "I'll see how I feel.", r: "See how you feel. That's my line. Don't steal my lines. I'll have nothing left to dodge with." },
        { tone: 'passive', t: "What kind of music?", r: "Loud. The kind where you can't talk, so you don't have to say anything real. My favourite genre." },
        { tone: 'flirty', t: "I'll dance if you will.", r: "Oh, I will. I always will. It's the slow songs I leave during. Fast ones only. That's another rule." },
      ] },
      { tone: 'flirty', t: "I need a very bad decision.", r: "Then I'm your person. Your mistake. Your very bad idea. I'll text you the address.", opts: [
        { tone: 'cold', t: "Never mind.", r: "Never mind? You were so close. The bad decision will wait. Bad decisions are very patient. So am I. Not really." },
        { tone: 'passive', t: "When?", r: "When I'm bored. Which is often. Keep your phone on. I don't text twice. Well. Sometimes. Late." },
        { tone: 'flirty', t: "I'll be waiting.", r: "Don't wait. Waiting is how you get hurt. Just be around when I'm around. Easy." },
      ] },
    ],
  },
  {
    id: 'fling-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "Sorry. My phone. Someone's having a crisis about a party. Where were we? You were being frosty. I was being fabulous. Carry on.",
    opts: [
      { tone: 'cold', t: "We weren't anywhere.", r: "Ouch. True, though. I'll be honest, I'm half here tonight. The other half's at a party I haven't left for yet.", opts: [
        { tone: 'cold', t: "Go to the party, then.", r: "I might. Don't sulk. It's not personal. Nothing I do is personal. That's the whole point." },
        { tone: 'passive', t: "It's fine. Go if you want.", r: "See? You get it. Easy. Most people want a speech. I'll see you around. I always do." },
        { tone: 'flirty', t: "I'd rather you stayed.", r: "I know. That's the nice part, being wanted. I'll stay five more. Then I'm vanishing. Sorry. Not sorry." },
      ] },
      { tone: 'passive', t: "You seem distracted.", r: "I'm always distracted. It's my natural state. Distracted, delightful, late for something else.", opts: [
        { tone: 'cold', t: "Clearly.", r: "Clearly. Don't be like that. I'm here now, aren't I? Mostly. Partly. A good amount." },
        { tone: 'passive', t: "Anything wrong?", r: "Nothing's ever wrong. Things are just loud and I like loud. Tonight's very loud. You're quiet. It's nice." },
        { tone: 'flirty', t: "I'll be more interesting than your phone.", r: "You already are. That's annoying. My phone's very interesting. Put your hand on mine. There. Phone's away." },
      ] },
      { tone: 'flirty', t: "Put the phone away. Talk to me.", r: "Bossy. I like it. Fine. Away. You've got two minutes of my full attention. It's rare. Don't waste it.", opts: [
        { tone: 'cold', t: "Actually, don't bother.", r: "Oh, now you're cold? I put the phone away for you. That's practically a declaration. I'm getting it back out." },
        { tone: 'passive', t: "So how's your week been?", r: "Busy. Loud. Forgettable. Better since I walked over here. Don't make it a thing. It's barely a thing." },
        { tone: 'flirty', t: "I'll make it worth it.", r: "You'd better. My phone's very jealous. Ha. Okay, that was good. You're good. I'm staying. A bit." },
      ] },
    ],
  },
  {
    id: 'fling-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "Hey you. Sorry, I'm all over the place tonight. Three plans, two phones, one of me. You're plan three. It's going surprisingly well.",
    opts: [
      { tone: 'cold', t: "I'll let you get to your plans.", r: "Don't be noble. I hate noble. Noble people leave. I'm the one who leaves. Stay where you are.", opts: [
        { tone: 'cold', t: "I'll go anyway.", r: "Fine. Go. I won't chase. I never chase. I might text. That's not chasing, that's correspondence." },
        { tone: 'passive', t: "I'll stay, then.", r: "Good. Plan three is now plan one. Don't tell plans one and two. They'll be devastated." },
        { tone: 'flirty', t: "Make me plan one.", r: "Bold. I like bold. Done. Plan one. Temporarily. Everything's temporarily. That's what makes it exciting." },
      ] },
      { tone: 'passive', t: "Is it always like this with you?", r: "Always. Life's too short for one plan. I spread myself thin and hope nobody notices the gaps.", opts: [
        { tone: 'cold', t: "I noticed the gaps.", r: "Course you did. You're very observant. It's a bit much. I prefer people who don't look too closely." },
        { tone: 'passive', t: "Sounds exhausting.", r: "It's thrilling. Exhausting is for Sunday. I sleep Sundays. That's my only commitment. That and Basil." },
        { tone: 'flirty', t: "Then let me be the gap you fall into.", r: "Okay, that was smooth. Very smooth. Don't be smooth at me. I'll have to cancel plans one and two." },
      ] },
      { tone: 'flirty', t: "You've got me for as long as you want me.", r: "That's a dangerous thing to say to me. I want things very hard and then not at all. Sorry. It's true.", opts: [
        { tone: 'cold', t: "Then forget it.", r: "Forgotten. You're learning. Though you look disappointed. Don't. I'm not worth disappointment. I'm worth a laugh." },
        { tone: 'passive', t: "That's honest of you.", r: "Honesty's free. Promises cost. I only buy what I can afford, and I'm very skint on promises." },
        { tone: 'flirty', t: "I'll take the hard part.", r: "The hard part's the fun part. Just don't stick around for the not at all part. That part's dull." },
      ] },
    ],
  },
  {
    id: 'fling-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "I've been looking for you all night. Then I found you and someone texted me and now I'm looking at my phone. I'm the worst. Kiss me? Joking.",
    opts: [
      { tone: 'cold', t: "I don't like being second to a phone.", r: "Fair. Nobody does. I'm putting it away. Look. Gone. You've got me back. Briefly, but fully.", opts: [
        { tone: 'cold', t: "Too late.", r: "Too late? Ooh, you can be cold. I like that more than I should. I'll be back when you've thawed." },
        { tone: 'passive', t: "Thank you.", r: "Don't thank me. I'll get the wrong idea. I'll think you like me. You do, don't you. Oh no." },
        { tone: 'flirty', t: "Better. Now look at me.", r: "I'm looking. You're very easy to look at. That's the trouble. I'll be looking at you all week. In my head." },
      ] },
      { tone: 'passive', t: "Were you joking about the kiss?", r: "I'm always joking until I'm not. Then I'm gone. It's a whole routine. Ask for tickets.", opts: [
        { tone: 'cold', t: "Then stop joking.", r: "Stop joking? I'd have nothing left. I'm mostly jokes and a very good jacket." },
        { tone: 'passive', t: "I can never tell with you.", r: "That's the idea. If you can tell, you can plan. If you can plan, you can expect. I hate being expected." },
        { tone: 'flirty', t: "I'll wait till you're not.", r: "Patient. Ugh. Patience is wasted on me. I'm here for the impatient ones. You're making it hard." },
      ] },
      { tone: 'flirty', t: "I wasn't joking.", r: "Oh. Oh no. You're serious. Okay. Not here. Not now. Ask me again later. Much later. When I'm braver.", opts: [
        { tone: 'cold', t: "Then forget I said it.", r: "Forgotten. Mostly. Not really. I'll think about it on the way home. Don't get ideas." },
        { tone: 'passive', t: "Later, then.", r: "Later. It's a date. No. Scratch that. It's a later. Laters are lovely. Laters can't disappoint anyone." },
        { tone: 'flirty', t: "I'll hold you to later.", r: "Hold me to it. Gently. I break promises very easily. I don't break later. Later's sacred." },
      ] },
    ],
  },
  {
    id: 'fling-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "I'm off soon. You were hard work tonight, but I like hard work, in moderation. I'll text you. When I'm bored. Which is often.",
    opts: [
      { tone: 'cold', t: "Don't bother.", r: "I'll bother. It's my favourite hobby, bothering. I'll do it at 1am. You can ignore it. Most people can't.", opts: [
        { tone: 'cold', t: "I'll ignore it.", r: "Then I'll text twice. That's my maximum. I've never needed a third. Watch me need a third." },
        { tone: 'passive', t: "Fine. Text me.", r: "Fine. Cool. Good. Calm. Very calm of both of us. I'm going now before one of us says something nice." },
        { tone: 'flirty', t: "I'll be up.", r: "Don't wait. I hate making people wait. I make them wait anyway. It's a flaw. You'll like it eventually." },
      ] },
      { tone: 'passive', t: "When are you usually bored?", r: "About midnight. Sometimes 2am. Never before ten. Keep your phone near your pillow. Not that I'll ever see your pillow.", opts: [
        { tone: 'cold', t: "I'll keep it on silent.", r: "Rude. Sensible, but rude. I'll get through. I always do. I'm extremely persistent at night." },
        { tone: 'passive', t: "I'll try to be awake.", r: "Try. That's all I ask. Actually I don't ask anything, ever. That's my whole appeal." },
        { tone: 'flirty', t: "Then I hope you're bored a lot.", r: "I will be. I'm bored constantly. It's my natural habitat. You'll hear from me. Probably." },
      ] },
      { tone: 'flirty', t: "I'll make sure you're bored.", r: "Ha. Clever. You're getting better at this. Keep it up. Don't get too good. Then I'd have to stay.", opts: [
        { tone: 'cold', t: "On second thoughts.", r: "On second thoughts what? Ugh. You can't do that. I'll be thinking about the end of that sentence all night." },
        { tone: 'passive', t: "Text me first, then.", r: "Maybe. I'm not a first-texter. I'm more of a 2am-reply person. But for you. Maybe. Don't count on it." },
        { tone: 'flirty', t: "Stay instead.", r: "I can't. I don't. Not yet. Not ever, really. But that was nice. Hang on to that. Bye, trouble." },
      ] },
    ],
  },
  {
    id: 'fling-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "I've got to go. Places to be, people to be terrible with. But I'll text you. Late, probably. Don't read anything into it.",
    opts: [
      { tone: 'cold', t: "I won't read into it.", r: "Good. Most people read into everything. You're refreshingly uninterested. Bit worrying, actually.", opts: [
        { tone: 'cold', t: "Go on, then.", r: "I'm going. I'm going. Look at me, going. I'm still here. Why am I still here? Bye." },
        { tone: 'passive', t: "Where are you off to?", r: "Somewhere loud. Somewhere I won't think about this conversation. I'll fail at that, but it'll be fun failing." },
        { tone: 'flirty', t: "I'll read into it a bit.", r: "A bit is fine. A bit is allowed. Don't write a novel. Write a text. A short one. At midnight." },
      ] },
      { tone: 'passive', t: "I'll look forward to it.", r: "Don't. Looking forward is a trap. Just let it surprise you. I'm much better as a surprise than a plan.", opts: [
        { tone: 'cold', t: "Fine. I'll forget about it.", r: "Perfect. Then it'll be a lovely surprise when it comes. Or it won't come, and you'll never know." },
        { tone: 'passive', t: "You're very hard to pin down.", r: "That's the idea. Pin me down and I wriggle. Leave me loose and I keep coming back. Mostly." },
        { tone: 'flirty', t: "Surprise me, then.", r: "Oh, I will. Expect it at the worst possible time. Unexpected is my brand." },
      ] },
      { tone: 'flirty', t: "Text me tonight.", r: "Tonight's ambitious. You're very ambitious. I'll try. Don't stay up. Do stay up a bit, though.", opts: [
        { tone: 'cold', t: "Or don't.", r: "Or don't. That's my move, but you pulled it off. I'm impressed. And slightly put out." },
        { tone: 'passive', t: "Whenever, then.", r: "Whenever's my favourite time. Whenever's always open. Never booked. Very reliable, whenever." },
        { tone: 'flirty', t: "I'll stay up.", r: "Don't say that. I'll feel obliged. I hate feeling obliged. I'll text you anyway. Probably at one." },
      ] },
    ],
  },
  {
    id: 'fling-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "Give me your number. I'll text you when I'm bored, which is constantly. You're excellent boredom medicine. Don't argue.",
    opts: [
      { tone: 'cold', t: "You're not getting my number.", r: "Then I'll get it some other way. I'm resourceful after dark. Sleep well, if you can.", opts: [
        { tone: 'cold', t: "Good luck with that.", r: "I don't need luck. I need a friend who knows a friend. I'll find you. Not tonight, though. Tonight's for other trouble." },
        { tone: 'passive', t: "Fine. Here.", r: "Thank you. I'll be very responsible with it. That's a lie. I'll be extremely irresponsible with it." },
        { tone: 'flirty', t: "Only if you promise to use it.", r: "Promise? I don't do promises. I do follow-through at strange hours. It's better than a promise. Ask anyone." },
      ] },
      { tone: 'passive', t: "Boredom medicine?", r: "You're calming. And fun. And easy to look at. That's medicine. Side effects include me texting at 2am.", opts: [
        { tone: 'cold', t: "I'm not a cure for anything.", r: "Everyone's a cure for something. You're a cure for Thursday. I hate Thursdays. Here's my phone." },
        { tone: 'passive', t: "Okay. Here's my number.", r: "Thank you. I'll save you under something mysterious. Not your name. Names are too much." },
        { tone: 'flirty', t: "Side effects accepted.", r: "Wonderful. I'll send a leaflet. It'll say: take one {first} as needed. Do not take seriously." },
      ] },
      { tone: 'flirty', t: "Here. Don't lose it.", r: "Lose it? Never. I'll lose everything else. Keys, plans, feelings. Not this. Not yet, anyway.", opts: [
        { tone: 'cold', t: "Actually, give it back.", r: "Too late. It's saved. You're in. That's the fastest regret I've ever seen. Very impressive." },
        { tone: 'passive', t: "I'll be waiting for your text.", r: "Don't wait. Live your life. I'll just pop up, like a notification you didn't want but secretly did." },
        { tone: 'flirty', t: "I hope you're bored tonight.", r: "I'm bored already and I haven't even left. That's a compliment, by the way. Goodnight, trouble." },
      ] },
    ],
  },
];
