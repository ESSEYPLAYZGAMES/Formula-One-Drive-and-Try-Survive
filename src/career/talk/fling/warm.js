// FLING - in person, stage warm: late plans, hot and cold, the rules bending - and the first hints it could be more. Plain data, no imports.
export const DATA = [
  {
    id: 'fling-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "Oh, it's you. You went a bit chilly on me last time. I'm over it already. I bounce. What are you up to after?",
    opts: [
      { tone: 'cold', t: "Sleeping.", r: "Sleeping. Again. You're impossible. I'm going to keep asking until the answer's interesting.", opts: [
        { tone: 'cold', t: "Keep asking, then.", r: "I will. I've got stamina for asking. Not for much else. Except dancing. And you, apparently." },
        { tone: 'passive', t: "Maybe I'll stay up.", r: "Maybe. Look at you, learning my language. Maybe is the start of every good night I've had." },
        { tone: 'flirty', t: "Unless you've got a better idea.", r: "I always have a better idea. That's my whole thing. Meet me at eleven. I'll be late." },
      ] },
      { tone: 'passive', t: "Depends. What are you doing after?", r: "Something. Somewhere. With someone, hopefully you. I don't plan, I gather. Consider yourself gathered.", opts: [
        { tone: 'cold', t: "I don't like being gathered.", r: "Nobody likes it. Everybody comes anyway. It's the not-knowing they like." },
        { tone: 'passive', t: "Where, though?", r: "I'll text you the place. Then I'll text you a different place. Then I'll be at a third place." },
        { tone: 'flirty', t: "Gather me, then.", r: "Done. Gathered. Don't get comfortable. Comfortable is how nights die. Stay on your toes." },
      ] },
      { tone: 'flirty', t: "Whatever you're up to.", r: "There it is. Easy. I like easy. I like you. Ugh. That second one slipped out. Ignore it.", opts: [
        { tone: 'cold', t: "Ignored.", r: "Thank you. You're very good at ignoring things. We'll get along brilliantly. Too brilliantly, maybe." },
        { tone: 'passive', t: "You like me?", r: "A normal amount. A party amount. Don't look at me like that, it's not a confession." },
        { tone: 'flirty', t: "I like you back.", r: "Stop. No feelings, remember? Rule one. Fine. A little. A very small little. Don't quote me on it." },
        { tone: 'risque', t: "Then come back to mine after.", r: "Yours? Bold. I like bold. Ask me again at 2am and the answer might be different." },
      ] },
    ],
  },
  {
    id: 'fling-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "There you are. I was hoping you'd be about. Not in a needy way. In a \"the night's better with you in it\" way. Big difference.",
    opts: [
      { tone: 'cold', t: "Is it, though?", r: "It's huge. Needy texts you at noon. I text you at midnight. Midnight's fun. Noon's a hostage negotiation.", opts: [
        { tone: 'cold', t: "Noon's fine with me.", r: "Noon's never fine. Noon is when people have opinions. Noon wants to make it a thing. I avoid noon at all costs." },
        { tone: 'passive', t: "Fair point.", r: "I'm full of fair points. And bad ideas. The trick is knowing which is which. I don't." },
        { tone: 'flirty', t: "Then I'll be your midnight.", r: "Oh, that's good. Is that a line? It's a good line. I'll allow it. Midnight it is." },
      ] },
      { tone: 'passive', t: "I'm glad you were hoping.", r: "Hoping's too strong. Noticing. I noticed you might be here. I put on my good jacket. Coincidence.", opts: [
        { tone: 'cold', t: "Sure it was.", r: "It was. Mostly. Partly. Fine, it was the jacket for you. Don't read into it." },
        { tone: 'passive', t: "It's a good jacket.", r: "I know. It's my best one. I wear it when I want to be remembered. And then I leave early." },
        { tone: 'flirty', t: "You look incredible in it.", r: "Thank you. I know. But it's nice when you say it. Say it again later. Much later." },
      ] },
      { tone: 'flirty', t: "I was hoping you'd be here too.", r: "Look at us, hoping. That's dangerous. Let's not hope. Let's just do. So. After this?", opts: [
        { tone: 'cold', t: "Nothing with you.", r: "Ouch. Fine. Good. That's good for both of us, honestly. I'll find you anyway, around one." },
        { tone: 'passive', t: "Nothing planned.", r: "Nothing planned is my favourite plan. Hand it to me. I'll make something of it." },
        { tone: 'flirty', t: "Whatever you are.", r: "Smooth. Unbearably smooth. I'll text you. Leave your phone loud." },
        { tone: 'risque', t: "Making bad decisions with you.", r: "Bad decisions. My favourite kind. With you, they'd be very good bad decisions." },
      ] },
    ],
  },
  {
    id: 'fling-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Hey, trouble. I was hoping I'd see you. Don't look so pleased, I hope for lots of things. You were my favourite one this week.",
    opts: [
      { tone: 'cold', t: "Only this week?", r: "This week's all I do. Next week is a stranger. Be my favourite then too, if you can manage it.", opts: [
        { tone: 'cold', t: "I'll see.", r: "You'll see. Ugh. You're using my moves against me. Fine. It's working. A bit." },
        { tone: 'passive', t: "I'll try my best.", r: "That's sweet. Trying is sweet. Don't try too hard, or I'll think you mean it." },
        { tone: 'flirty', t: "I'll be your favourite every week.", r: "Every week is a big promise. I don't do big promises. I'll take this week and see." },
      ] },
      { tone: 'passive', t: "What else were you hoping for?", r: "A loud night, a long sleep, and you looking at me like that. Two out of three so far.", opts: [
        { tone: 'cold', t: "Like what?", r: "Like you've been thinking about me. You have. It's fine. I've been thinking about you. A normal amount." },
        { tone: 'passive', t: "Which two?", r: "The loud night and you. The long sleep's for later. Much later. Possibly never." },
        { tone: 'flirty', t: "What's the third?", r: "Not telling. Not yet. You'll find out when it's late enough and I'm brave enough." },
      ] },
      { tone: 'flirty', t: "Your favourite? I'm honoured.", r: "You should be. My favourites change hourly. You've lasted all week. That's practically historic.", opts: [
        { tone: 'cold', t: "Don't get attached.", r: "That's my line. You keep stealing my lines. Soon I'll have nothing left but my jacket." },
        { tone: 'passive', t: "What do I win?", r: "Me, for one night. Not every night. One. A very good one. Don't ask for two." },
        { tone: 'flirty', t: "Then let's make tonight historic.", r: "Look at you. Okay. Tonight. Late. You and me and no plan." },
        { tone: 'risque', t: "I can think of a few prizes.", r: "I bet you can. So can I. Keep thinking. I'll tell you when the prize ceremony starts." },
      ] },
    ],
  },
  {
    id: 'fling-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "You were cool last time, so, a warning: someone asked me to dinner this week and I fled. Dinner's very... sitting down. Can we not?",
    opts: [
      { tone: 'cold', t: "I'd never ask you to dinner.", r: "Good. Someone did, this week. Someone with a table and expectations. I fled. It was dramatic.", opts: [
        { tone: 'cold', t: "Then nothing to panic about.", r: "Good. Panic's exhausting. I'd rather be exhausted for fun reasons. Dancing. You. Mostly dancing." },
        { tone: 'passive', t: "What's wrong with sitting down?", r: "Sitting down is how it gets serious. Standing up, you can always leave. I like options." },
        { tone: 'flirty', t: "I'd never trap you at a table.", r: "Promise? Tables are traps. Candles are traps. Napkins are tiny white flags. I surrender to none of them." },
      ] },
      { tone: 'passive', t: "Fine. No dinner. What, then?", r: "Something loud and standing up. Somewhere with exits. Lots of exits. And you, near one of them.", opts: [
        { tone: 'cold', t: "That sounds like running.", r: "It's not running. It's having options. Okay, it's a bit running. Running's a sport. You'd know." },
        { tone: 'passive', t: "Okay. Loud and standing.", r: "Perfect. You're so easy. Not like that. Well. Like that too, maybe. Later." },
        { tone: 'flirty', t: "I'll stand right next to you.", r: "Next to me's good. Next to me's my favourite place for you. Not across a table. Next to." },
      ] },
      { tone: 'flirty', t: "I just want time with you.", r: "Time. Oh, you said time. That's worse than dinner. Time is dinner's big sister. Let's call it a night out.", opts: [
        { tone: 'cold', t: "Fine. Whatever you call it.", r: "Thank you. Naming things matters. Wrong name and suddenly someone's crying in a taxi." },
        { tone: 'passive', t: "A night out, then.", r: "A night out. Perfect. Nothing to discuss afterwards. Nothing to dissect. Just a night." },
        { tone: 'flirty', t: "Call it what you like. Just come.", r: "I'll come. I always come. I just leave before the bill. Kidding. Half kidding." },
        { tone: 'risque', t: "Then skip dinner. Come straight to mine.", r: "Straight to dessert. You're dangerous. I'll think about it. I'm thinking about it now." },
      ] },
    ],
  },
  {
    id: 'fling-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "Okay, I need to say something. I like you. So I'm not having dinner with you. Dinner's where I ruin things. Let's go out instead.",
    opts: [
      { tone: 'cold', t: "Dinner ruins things?", r: "Every time. Two courses in and someone asks about my five-year plan. My five-year plan is next Friday.", opts: [
        { tone: 'cold', t: "That's not a plan.", r: "It's a very good plan. Next Friday's brilliant. You'll like next Friday. Maybe." },
        { tone: 'passive', t: "What's next Friday?", r: "No idea. That's what makes it brilliant. Anything could happen. Usually it's karaoke." },
        { tone: 'flirty', t: "I'll be next Friday's plan.", r: "Oh. Yes. Fine. Be next Friday. Don't be the Friday after. Too soon." },
      ] },
      { tone: 'passive', t: "Out where?", r: "Anywhere they don't light candles. Candles make me feel like I'm being proposed to. I've seen a candle and run.", opts: [
        { tone: 'cold', t: "That seems extreme.", r: "It is extreme. I'm an extreme person. In small, manageable doses." },
        { tone: 'passive', t: "No candles. Noted.", r: "You listen. That's so attractive. Stop it. Rule one. I've got rules for a reason." },
        { tone: 'flirty', t: "I'll blow out every candle for you.", r: "Ha. That's the most romantic thing anyone's said to me and it's about destroying candles. Perfect." },
      ] },
      { tone: 'flirty', t: "I like you too. Dinner's fine.", r: "Dinner's not fine. Dinner's terrifying. Don't say you like me and then say dinner. My heart can't take both.", opts: [
        { tone: 'cold', t: "Then forget dinner.", r: "Thank you. Crisis averted. I'll put my heart back where it was. Under several layers of jokes." },
        { tone: 'passive', t: "Out, then. Somewhere loud.", r: "Loud is good. In loud, nobody can hear you being sincere. Very safe." },
        { tone: 'flirty', t: "I'll say it louder, then.", r: "Don't. People will hear. I've got a reputation for being unbothered. Ruin it quietly." },
        { tone: 'risque', t: "Skip the out. Stay in with me.", r: "Staying in is just dinner with the lights off. Mm. Fine. That's a very different proposal. Noted." },
      ] },
    ],
  },
  {
    id: 'fling-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "I've worked out what we're doing next. Not dinner. Never dinner. Somewhere loud, then somewhere quiet, then we see. Interested?",
    opts: [
      { tone: 'cold', t: "What's your problem with dinner?", r: "Because over dinner you'd look at me properly. And I'd look at you. And then where would we be? In trouble.", opts: [
        { tone: 'cold', t: "I'd rather a proper dinner.", r: "Course you would. You're a proper person. I'm an improper one. It's a very tricky match." },
        { tone: 'passive', t: "Fine. Loud, then quiet.", r: "Then we see. Don't forget the then we see. That's the best bit. Nothing decided." },
        { tone: 'flirty', t: "I'd love to look at you properly.", r: "Stop. Okay, don't stop. But do it standing up, in the dark, with music. Then I can pretend it's casual." },
      ] },
      { tone: 'passive', t: "What happens after quiet?", r: "Depends how quiet. And how late. And how good you are at not asking what happens after quiet.", opts: [
        { tone: 'cold', t: "Then I won't ask.", r: "Good. Not asking is very attractive. I've written a song about it. In my head. It's bad." },
        { tone: 'passive', t: "I'm terrible at not asking.", r: "I know. It's adorable. It's also why I'm keeping an eye on you. Askers are dangerous." },
        { tone: 'flirty', t: "I'll find out, then.", r: "You might. If you're lucky. And if I'm feeling lucky. Which, looking at you, I am." },
      ] },
      { tone: 'flirty', t: "Very interested.", r: "Good. Keep that energy. Bring it at eleven. Bring nothing else. No flowers. No candles. Just you.", opts: [
        { tone: 'cold', t: "Maybe not that interested.", r: "Maybe not? You can't backtrack, I heard very. I'm holding you to very." },
        { tone: 'passive', t: "Eleven works.", r: "Eleven works. Say it like it's not a big deal. Good. It's not. It's just a night." },
        { tone: 'flirty', t: "I'll bring my best behaviour.", r: "Bring your worst. Your best is for the grid. Your worst is for me. I'll match it." },
        { tone: 'risque', t: "Let's skip to the quiet.", r: "You'd like that, wouldn't you. So would I. That's the problem. Patience, trouble. Loud first." },
      ] },
    ],
  },
  {
    id: 'fling-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "You were with someone earlier. Laughing. It's fine. We're not a thing. I'm not jealous. I'm asking out of general curiosity.",
    opts: [
      { tone: 'cold', t: "It's none of your business.", r: "Correct. Completely correct. Totally. I agree. I don't even want to know. Who was it?", opts: [
        { tone: 'cold', t: "Still none of your business.", r: "Fine. Good. That's healthy. I'm being healthy about it. Look how healthy I'm being." },
        { tone: 'passive', t: "Just a friend.", r: "A friend. Lovely. Friends are great. I have loads. Hundreds. Fine. I'm moving on. I've moved on." },
        { tone: 'flirty', t: "You are jealous.", r: "I'm not. I'm intrigued. Mildly. Like when a stranger's dog likes someone else. Brief little sting." },
      ] },
      { tone: 'passive', t: "Just someone from work.", r: "Work. Good. Great. Work is safe. Unless it isn't. Is it? Don't answer. I don't care. I care a normal amount.", opts: [
        { tone: 'cold', t: "Why does it matter?", r: "It doesn't. Rule one. No feelings. These aren't feelings. These are observations. Very calm ones." },
        { tone: 'passive', t: "You're adorable when you do this.", r: "Don't. I'm not doing anything. I'm standing here not being jealous very adorably, apparently." },
        { tone: 'flirty', t: "Nobody laughs like you, though.", r: "Okay. Okay, that helped. That shouldn't have helped. Don't do that again. Do it a bit." },
      ] },
      { tone: 'flirty', t: "You don't have to worry about anyone.", r: "I'm not worried. I don't worry. I'm the one who people worry about. That's the arrangement.", opts: [
        { tone: 'cold', t: "Then stop asking.", r: "I'll stop. This is me stopping. I've stopped. I'll start again at 2am, in a text, probably." },
        { tone: 'passive', t: "Good to know.", r: "It is. It's good. I'm fine with it either way. I'm glad it's the good way, though. A bit." },
        { tone: 'flirty', t: "Only you. Tonight, anyway.", r: "Tonight. Good. That's the right answer. Not forever. Just tonight. That I can handle." },
        { tone: 'risque', t: "Want me to prove it?", r: "Prove it how? Never mind. I know how. Later. Somewhere without witnesses." },
      ] },
    ],
  },
  {
    id: 'fling-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "Who was that you were talking to? Don't give me that look. I'm not jealous. I don't get jealous. It's against the rules.",
    opts: [
      { tone: 'cold', t: "That's my business.", r: "It is. Absolutely. I love that for you. Rule one says I can't care. I'm not caring very loudly.", opts: [
        { tone: 'cold', t: "Then keep quiet about it.", r: "Quiet. Yes. I can do quiet. Watch me do quiet. This is quiet. Still curious, though." },
        { tone: 'passive', t: "A friend of a friend.", r: "Two friends removed. Okay. That's very far away. That's practically a stranger. Good." },
        { tone: 'flirty', t: "You're cute when you're not jealous.", r: "I'm always cute. Jealous or not. Which I'm not. I'm being cute in a very calm way." },
      ] },
      { tone: 'passive', t: "Someone I met today.", r: "Met today. Right. Meeting people is good. I'm a big fan of meeting people. I do it constantly. So should you.", opts: [
        { tone: 'cold', t: "You're bothered.", r: "I'm unbothered. I'm the most unbothered person here. I'm just standing extra close to you. For warmth." },
        { tone: 'passive', t: "Do you want to meet them?", r: "Absolutely not. Meeting people's people is how it becomes a thing. Then it's a group chat." },
        { tone: 'flirty', t: "Nobody compares to you.", r: "Mm. Okay. That's nice. I'll let it slide. I'm not even jealous, so it doesn't matter. But thanks." },
      ] },
      { tone: 'flirty', t: "Is there a rule about me?", r: "There's a rule about everyone. You're just the first person making me read it twice.", opts: [
        { tone: 'cold', t: "Don't read it on my account.", r: "I'm not. I'm reading it for me. It's for my protection. You're a hazard. A cheerful one." },
        { tone: 'passive', t: "What does it say?", r: "No feelings. In very small print. And underneath, in smaller print: especially for that one. You." },
        { tone: 'flirty', t: "Break it for me.", r: "I don't break rules. I bend them. I'll bend it for you. A little. Don't make me regret it." },
        { tone: 'risque', t: "Let's go somewhere and bend a few.", r: "Somewhere. Later. Rules bend better in the dark. Ask me again in an hour." },
      ] },
    ],
  },
  {
    id: 'fling-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "Okay, who was that? You were all smiles. You're meant to save those for me. Joke. I'm joking. We are not a couple. Who was it?",
    opts: [
      { tone: 'cold', t: "I can smile at whoever I like.", r: "You can. Of course you can. I smile at loads of people. Hundreds. This is fine. I'm fine.", opts: [
        { tone: 'cold', t: "Then we're both fine.", r: "We're both fine. Lovely. Fine people being fine. I'll be extra fine later, at someone else's party." },
        { tone: 'passive', t: "It was nobody.", r: "Nobody. I love nobody. Nobody's my favourite person. Except you. No. Rule one: no feelings. Forget that." },
        { tone: 'flirty', t: "You've got the best smile, though.", r: "I do, don't I. Okay. That's better. Smile at me now. There. Much better." },
      ] },
      { tone: 'passive', t: "Someone from the team.", r: "The team. Safe. Very safe. I approve. Not that I need to approve. I don't. I'm just approving in general.", opts: [
        { tone: 'cold', t: "You're very invested for someone who isn't.", r: "I'm not invested. I'm interested. Investment means you expect a return. I expect nothing." },
        { tone: 'passive', t: "Do you want me to stop smiling at people?", r: "No. Smile at everyone. It's lovely. Just do the special one for me. You know which one." },
        { tone: 'flirty', t: "Save the smiles for you, then?", r: "Not all of them. That'd be clingy. Just the good ones. The late ones." },
      ] },
      { tone: 'flirty', t: "I save my best ones for you.", r: "Do you? I can't tell. Do one now. Oh. Okay. Yes. That's the one. That's mine. Don't give it away.", opts: [
        { tone: 'cold', t: "Kidding. I smile at everyone.", r: "Naturally. Me too. We're very generous people with our faces. Good for us." },
        { tone: 'passive', t: "Every single one.", r: "Every single one is a lot. I'll take some. I'll take the night ones. Someone else can have the mornings." },
        { tone: 'flirty', t: "Want another?", r: "Always. I'm greedy for smiles. Not for anything else. Smiles are free. Everything else costs something." },
        { tone: 'risque', t: "I'll save something better than smiles for you.", r: "Ooh. Something better. I'll be thinking about that all night. Don't make me wait too long." },
      ] },
    ],
  },
  {
    id: 'fling-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "You were short with me last time, and I deserved it. I bail on people. I'm good at the start and bad at the bit after. There. Honesty.",
    opts: [
      { tone: 'cold', t: "At least you know it.", r: "I know it. Knowing it doesn't fix it. Nothing fixes it. Except leaving first, which is what I do.", opts: [
        { tone: 'cold', t: "Then leave.", r: "Not yet. I've only just arrived. Leaving early is an art. You can't rush art." },
        { tone: 'passive', t: "Why do you bail?", r: "If I stay, people find out I'm mostly jokes and a jacket. Better to be a mystery. Mysteries get missed." },
        { tone: 'flirty', t: "I'd stay through the bit after.", r: "Don't. You don't know what it's like after. Neither do I, really. I've never been. It might be lovely." },
      ] },
      { tone: 'passive', t: "What's the bit after?", r: "The bit where someone knows your coffee order. Where they notice when you're quiet. I don't do that bit.", opts: [
        { tone: 'cold', t: "Everyone does that bit eventually.", r: "Not me. I've got a perfect record. Never once stayed for the coffee order." },
        { tone: 'passive', t: "That's a bit sad.", r: "It's a bit sad. There. I said it. Now say something silly so we can stop. Please." },
        { tone: 'flirty', t: "I'd like to know your coffee order.", r: "It's... no. Nice try. You almost got it. You're really good at almost. Stop it." },
      ] },
      { tone: 'flirty', t: "Thank you for telling me.", r: "Don't thank me. Thanking makes it a moment. I don't do moments. I do nights. Ask me something stupid.", opts: [
        { tone: 'cold', t: "Fine. Forget it.", r: "Forgotten. That's what I do best. Forget things. Leave things. Ask me something stupid now. Please." },
        { tone: 'passive', t: "What's your favourite colour?", r: "Midnight blue. Perfect. Thank you. That's exactly the right amount of stupid." },
        { tone: 'flirty', t: "You're more than the start.", r: "Stop. You'll ruin my whole system. I've had this system for years. It works. It's lonely. It works." },
        { tone: 'risque', t: "Then let's make the start last all night.", r: "All night. I can do all night. It's the mornings I can't do. Deal." },
      ] },
    ],
  },
  {
    id: 'fling-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Can I tell you something? I'm really bad at staying. With people, I mean. I'm amazing at arriving. Ask anyone. Arriving's my best thing.",
    opts: [
      { tone: 'cold', t: "Why tell me?", r: "Because you'll notice when I leave. Better I say it first. Saves you being confused about it later.", opts: [
        { tone: 'cold', t: "I won't notice.", r: "You will. Everyone does. They just say they won't. It's fine. I notice too, a bit." },
        { tone: 'passive', t: "Thanks for the warning.", r: "You're welcome. It's free. Most of my warnings are free. It's the follow-up that costs." },
        { tone: 'flirty', t: "Maybe you'll stay for me.", r: "Maybe. Don't hold your breath. You need it for driving. And for other things." },
      ] },
      { tone: 'passive', t: "What makes you leave?", r: "When it starts to matter. That's the alarm. Something matters, I'm out. Very efficient. Very silly.", opts: [
        { tone: 'cold', t: "Sounds like fear.", r: "Fear's a strong word. I prefer allergy. I'm allergic to mattering. Hives everywhere." },
        { tone: 'passive', t: "That makes sense, I suppose.", r: "It makes no sense. That's the charm. Don't try to make it make sense. I've tried." },
        { tone: 'flirty', t: "What if I don't let it matter?", r: "Then we'd be fine. That's the deal. You don't let it matter, I stick around. Easy. Hard. Easy." },
      ] },
      { tone: 'flirty', t: "You don't have to leave with me.", r: "Oh, don't say it like that. That's the kind of thing that makes me want to stay. And then I leave faster.", opts: [
        { tone: 'cold', t: "Then I won't say it.", r: "Thank you. Unsay it. There. Gone. We're back to fun. Fun is my safe place." },
        { tone: 'passive', t: "I mean it, though.", r: "I know you do. That's what's terrifying. You mean things. You'd mean me. Okay, enough. Ask me about my plant. Basil. Long story." },
        { tone: 'flirty', t: "I'll just keep being fun.", r: "That's perfect. Be fun. Fun I can do forever. Well. For ages. A while. Ages." },
        { tone: 'risque', t: "Then don't leave. Come home with me.", r: "That's not staying, that's a sleepover. Sleepovers are fine. Sleepovers end at breakfast." },
      ] },
    ],
  },
  {
    id: 'fling-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Do you know what? You're the first person in ages I've wanted to tell things to. That's terrible news. For me, mostly. Forget I said it.",
    opts: [
      { tone: 'cold', t: "Already forgotten.", r: "Good. You're excellent at this. You forget on command. It's like you were built for me.", opts: [
        { tone: 'cold', t: "Built for no one.", r: "Ooh, cold. I'll take cold. Cold's easy. Warm's the dangerous one. Stay cold a bit longer." },
        { tone: 'passive', t: "What did you want to tell me?", r: "Nothing. Small things. That I had a terrible week. That you made it better. Nothing important." },
        { tone: 'flirty', t: "I'm still listening, though.", r: "You're always listening. It's a problem. People who listen end up knowing you. I'm unknowable." },
      ] },
      { tone: 'passive', t: "What do you want to tell me?", r: "That I'm scared of mornings. That's a joke. Mostly. A lot of things look different in daylight.", opts: [
        { tone: 'cold', t: "Different how?", r: "Like the people who stayed over. Like me. Mostly me. Daylight's very unflattering for liars." },
        { tone: 'passive', t: "You can tell me anything.", r: "I know. That's what frightens me. I can, so I might, so I won't. That's how it works." },
        { tone: 'flirty', t: "You'd look good in daylight.", r: "Ha. Nobody's checked. I'm strictly a night-time exhibit. Viewing by appointment. Late appointments." },
      ] },
      { tone: 'flirty', t: "I want to hear all of it.", r: "All of it? There's not much. A plant, a phone on 4%, some rules, some leaving. That's the whole tour.", opts: [
        { tone: 'cold', t: "That's not much of a tour.", r: "It's a short tour. With a gift shop. The gift shop sells nothing. You leave with nothing. On purpose." },
        { tone: 'passive', t: "I'd take the tour twice.", r: "Twice? Nobody takes it twice. You're very strange. I like strange. Don't tell rule one." },
        { tone: 'flirty', t: "I want the part you don't give the tour.", r: "The part I don't show. Ha. Nice try. You'd have to be very patient and very lucky." },
        { tone: 'risque', t: "Show me the rest somewhere private.", r: "Somewhere private is where I lose arguments. And track of time. Ask again later. Very later." },
      ] },
    ],
  },
  {
    id: 'fling-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "Don't do the face. You're about to ask what this is. Last time you were cool with me and I liked it. Stay cool. Don't ask.",
    opts: [
      { tone: 'cold', t: "No question coming.", r: "Good. You were, though. I could see the question in your eyebrows. Put it away.", opts: [
        { tone: 'cold', t: "My eyebrows are fine.", r: "Your eyebrows are doing a lot. Very communicative eyebrows. Shh." },
        { tone: 'passive', t: "Fine. No labels.", r: "Thank you. Labels are for jam. We're not jam. We're... something better. Don't ask what." },
        { tone: 'flirty', t: "What if I like what this is?", r: "Then like it quietly. Liking it out loud is how it starts to mean something." },
      ] },
      { tone: 'passive', t: "What is this, though?", r: "Ugh. You asked. This is fun. That's it. That's the whole label. Fun, written very small.", opts: [
        { tone: 'cold', t: "That's all?", r: "That's all. That's enough. Fun is plenty. People ruin fun by wanting it to be more." },
        { tone: 'passive', t: "Fun's fine with me.", r: "Good. Perfect. Thank you. You see? This is why you're my favourite. You don't need a word for it." },
        { tone: 'flirty', t: "It feels like more than fun.", r: "Don't. It's fun with good lighting. That's all. Turn the lights off and it's just fun. Promise." },
      ] },
      { tone: 'flirty', t: "Whatever it is, I like it.", r: "Then don't name it. You name a stray cat and suddenly it lives with you. Don't name it.", opts: [
        { tone: 'cold', t: "Fine. Nameless it is.", r: "Nameless. Lovely. Mysterious. Nobody can take away what they can't name." },
        { tone: 'passive', t: "Okay. No names.", r: "No names. No labels. No meeting each other's friends. Just this. This is very good." },
        { tone: 'flirty', t: "I'd let it live with me.", r: "Oh, stop. That's a lovely thing to say. It's also a terrible idea. I'm a terrible flatmate." },
        { tone: 'risque', t: "Then let's not talk at all.", r: "No talking. I like that plan very much. Fewer chances to say something true." },
      ] },
    ],
  },
  {
    id: 'fling-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Listen, before you say anything: whatever you think this is, it's that, but lighter. Much lighter. Feather-light. Can we keep it there?",
    opts: [
      { tone: 'cold', t: "I don't think it's anything.", r: "Perfect. Wonderful. That's exactly the right amount of nothing. Why does that sting a bit?", opts: [
        { tone: 'cold', t: "It shouldn't sting.", r: "It doesn't. It's not stinging. It's a mild tingle. Like a nettle. It'll pass." },
        { tone: 'passive', t: "Okay. Light it is.", r: "Light. Thank you. You're so easy to be with. Don't take that the wrong way. Take it the light way." },
        { tone: 'flirty', t: "It stings because you like me.", r: "I like you the normal amount. The rules allow a normal amount. I'm right at the limit." },
      ] },
      { tone: 'passive', t: "What's wrong with heavy?", r: "Heavy things fall on people. Light things float. I've seen what heavy does to people. I like floating.", opts: [
        { tone: 'cold', t: "Floating's not living.", r: "It is if you're good at it. I'm brilliant at it. Ten years and I've never touched the ground." },
        { tone: 'passive', t: "I can do light.", r: "I knew you could. You've got a light touch. Very good hands. I mean that in the steering sense. Mostly." },
        { tone: 'flirty', t: "I'd catch you if you fell.", r: "That's the problem. You would. And then I'd be caught. Being caught is the worst thing." },
      ] },
      { tone: 'flirty', t: "I think it's something good.", r: "Good's fine. Good I can handle. Just don't say special. Special's a ten-letter word.", opts: [
        { tone: 'cold', t: "Special has seven letters.", r: "Not the way people say it to me. They say it with ten letters and a suitcase." },
        { tone: 'passive', t: "Good, then. Just good.", r: "Just good. Lovely word. Very relaxing. No suitcases. I like good. I like you. Normally." },
        { tone: 'flirty', t: "It's special.", r: "Oh, you said it. You said the word. I need to sit down. Not near you. Okay, near you." },
        { tone: 'risque', t: "Then let's keep it light and late.", r: "Light and late. That's my favourite combination. You're learning. Fast. Scarily fast." },
      ] },
    ],
  },
  {
    id: 'fling-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Please don't ask me what we are. I'm having such a nice time not knowing. Ask me literally anything else. Ask me where I got these boots.",
    opts: [
      { tone: 'cold', t: "I wasn't going to ask either.", r: "Good. We're both terrified, then. That's healthy. That's the healthiest thing about us.", opts: [
        { tone: 'cold', t: "Speak for yourself.", r: "I am. I always speak for myself. Nobody else is brave enough to speak for me." },
        { tone: 'passive', t: "Where did you get the boots?", r: "A shop. In a city. On a day. That's all the detail you get. Detail leads to feelings." },
        { tone: 'flirty', t: "We're something nice. Leave it there.", r: "Something nice. Okay. I'll allow nice. Nice is soft and pointless and perfect." },
      ] },
      { tone: 'passive', t: "What are we, though?", r: "We're two people having a lovely time who are not going to ruin it by asking what they are. That's what we are.", opts: [
        { tone: 'cold', t: "That's a cop-out.", r: "It's not a cop-out. It's a philosophy. I've built my whole life on it. It's mostly held up." },
        { tone: 'passive', t: "Fine. Where'd you get the boots?", r: "A charity shop, for almost nothing. They're my favourite. I'm loyal to boots. Just not people." },
        { tone: 'flirty', t: "We're my favourite thing this month.", r: "This month. Lovely. A month's a good unit. You can enjoy a month without needing a ring." },
      ] },
      { tone: 'flirty', t: "You look incredible in those boots.", r: "Thank you. This is the right kind of question. The boots kind. Ask me boot questions all night.", opts: [
        { tone: 'cold', t: "They're fine.", r: "Fine? They're incredible. You're cold tonight. I like it. It's very good for my rules." },
        { tone: 'passive', t: "Seriously, where are they from?", r: "A tiny shop, years ago. The only thing I've kept that long. That and a plant called Basil." },
        { tone: 'flirty', t: "You'd look incredible in anything.", r: "Ugh. Smooth. Smooth and sweet. The deadliest combination. I need air. I'll be right here." },
        { tone: 'risque', t: "Walk me home in them later.", r: "Home. Ha. Cheeky. Very cheeky. Mm. Maybe. If the night goes the right way. It might." },
      ] },
    ],
  },
  {
    id: 'fling-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "You were distant last time. Annoyingly, it worked. You've been on my mind. If I were the type to break a rule, it'd be for you. I'm not.",
    opts: [
      { tone: 'cold', t: "Good. Don't break anything.", r: "Good. Yes. Sensible. Very sensible. Why does sensible sound so boring when you say it?", opts: [
        { tone: 'cold', t: "Because you're bored of sensible.", r: "I'm bored of everything except you. That's a problem for next week. This week I'm ignoring it." },
        { tone: 'passive', t: "I'm just being realistic.", r: "Realistic. Ugh. You're right. I'm not the type. I'm really not. Probably. Almost certainly." },
        { tone: 'flirty', t: "Not even a little rule?", r: "A little one. The no-breakfast rule, maybe. I'd do a coffee with you. A small, fast coffee." },
      ] },
      { tone: 'passive', t: "What kind of type would you need to be?", r: "The staying type. The kind who keeps a toothbrush somewhere. I can't even keep a lighter.", opts: [
        { tone: 'cold', t: "Then don't pretend.", r: "I'm not pretending. I'm imagining. Imagining's allowed. It's free and nobody gets hurt." },
        { tone: 'passive', t: "You could change.", r: "People don't change. They just get better at hiding it. Maybe I'm hiding it. Maybe I'm the type. Who knows?" },
        { tone: 'flirty', t: "Keep the toothbrush at mine.", r: "Ha. Don't. That's how they get you. One toothbrush and suddenly you're picking a sofa together." },
      ] },
      { tone: 'flirty', t: "Then I'll wait till you're the type.", r: "Don't wait for me. Promise me. Okay, wait a bit. A very small bit. I'm terrible.", opts: [
        { tone: 'cold', t: "Forget waiting.", r: "Good. Waiting's awful. Don't do it for me. I'm not worth a wait. I'm worth a night." },
        { tone: 'passive', t: "Just a bit, then.", r: "Just a bit. Lovely. A bit's all I'm asking. Actually, I'm not asking anything. Asking's not my style." },
        { tone: 'flirty', t: "I'd wait as long as it takes.", r: "Oh no. Don't say that. You'll make me believe it, and then I'll have to be someone else." },
        { tone: 'risque', t: "Break a different rule tonight, then.", r: "A different rule? Ha. Maybe. There's one about staying the night. That one's very bendable." },
      ] },
    ],
  },
  {
    id: 'fling-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "Can I say something stupid? If I did the whole relationship thing, which I don't, I'd want it with someone like you. Moving on.",
    opts: [
      { tone: 'cold', t: "That's a strange thing to say.", r: "I'm a strange person. I say strange things at strange hours. This is a strange hour. Ignore it.", opts: [
        { tone: 'cold', t: "Fine. Ignored.", r: "Thank you. You ignore beautifully. You're so good at it. Bit worrying, actually." },
        { tone: 'passive', t: "Why someone like me?", r: "Because you're steady. And kind. And you don't push. And you look like that. That's four reasons. Too many." },
        { tone: 'flirty', t: "Someone like me, or me?", r: "Ugh. You caught it. Someone exactly like you. Who is you. But I don't do it. So. Hypothetical you." },
      ] },
      { tone: 'passive', t: "Why don't you?", r: "Because the whole thing ends. Everything ends. If I end it first it's my ending. I get to keep the good bits.", opts: [
        { tone: 'cold', t: "That's a lonely way to think.", r: "Lonely's quiet. Quiet's fine. It's loud I like, though. You're quite loud, in my head." },
        { tone: 'passive', t: "I get that.", r: "You get it? Nobody gets it. People always try to fix it. You just nod. That's the most attractive thing." },
        { tone: 'flirty', t: "Maybe ours wouldn't end.", r: "Maybe. Maybe's lovely. Maybe's all I can do. Maybe's the most I've offered anyone in years." },
      ] },
      { tone: 'flirty', t: "I'd want it with you too.", r: "Don't. I said hypothetical. Hypothetical means nobody gets to want it back. That's the rules.", opts: [
        { tone: 'cold', t: "Okay. Hypothetically, no.", r: "Hypothetically no. Brilliant. That's perfect. I'm relieved. Very relieved. I'm completely fine." },
        { tone: 'passive', t: "Hypothetically, then.", r: "Hypothetically. Okay. That I can hold. Hypothetically, you'd be very good at it." },
        { tone: 'flirty', t: "I'm not hypothetical.", r: "No. You're very real. That's the problem. Real things want real answers. Ask me again in a year." },
        { tone: 'risque', t: "Hypothetically, stay tonight.", r: "Hypothetically, I might. In reality, I might as well. Mm. We'll see what hypothetical-me decides." },
      ] },
    ],
  },
  {
    id: 'fling-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "You know you're my favourite, right? Not just this week. If I ever broke my rules, you'd be the reason. Not that I will. But you would.",
    opts: [
      { tone: 'cold', t: "You won't break them.", r: "I won't. I can't. Probably. Don't look so sure, it makes me want to prove you wrong.", opts: [
        { tone: 'cold', t: "I'm sure.", r: "You're sure. Great. Good. Then we're both safe. Being safe is so boring. Let's go somewhere loud." },
        { tone: 'passive', t: "Do you want to break them?", r: "Some days. Today a bit. Ask me on a Sunday and I'll say no. Ask me at 2am and I might say yes." },
        { tone: 'flirty', t: "I'll ask you at 2am, then.", r: "Don't. I'll say yes and mean it and then I'll have to move cities. You see the problem." },
      ] },
      { tone: 'passive', t: "What would it take?", r: "The right person at the wrong time. Or the wrong person at the right time. I've never worked out which you are.", opts: [
        { tone: 'cold', t: "Neither, probably.", r: "Probably. Thank you. Very grounding. I needed that. I needed it less than I thought." },
        { tone: 'passive', t: "Maybe I'm the right one.", r: "Maybe. That's the scariest maybe I've said all year. I'll be thinking about it on the way home." },
        { tone: 'flirty', t: "Let me be both.", r: "Both. Ha. You're greedy. I like greedy. Greedy means you want things. I'm not used to being wanted for long." },
      ] },
      { tone: 'flirty', t: "You're my favourite too.", r: "Don't make it mutual. Mutual is how it gets serious. Be my favourite. I'll be your mistake. Fair deal.", opts: [
        { tone: 'cold', t: "I don't like mistakes.", r: "Nobody likes them. Everybody makes them. I'm a very charming one, at least." },
        { tone: 'passive', t: "Fine. You're my mistake.", r: "Your favourite mistake. Say it right. Favourite. It's the only label I'll accept." },
        { tone: 'flirty', t: "You're not a mistake.", r: "Don't. Please. That's the nicest thing and I don't know what to do with it. I'll put it somewhere safe." },
        { tone: 'risque', t: "Be my mistake tonight.", r: "Tonight. That's the one word I always say yes to. Okay. Tonight. Just tonight." },
      ] },
    ],
  },
  {
    id: 'fling-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "Hiya. I know. I went quiet. Then you went cold. I deserved it. I'm here now, though. That's worth something, isn't it?",
    opts: [
      { tone: 'cold', t: "It's worth less every time.", r: "Ouch. Fair. That's fair. I'm not good at the middle bits. I'm good at the now bits. This is a now bit.", opts: [
        { tone: 'cold', t: "I'm tired of now bits.", r: "I know. Most people get tired eventually. I just thought you'd last longer. Selfish of me." },
        { tone: 'passive', t: "Then make it a good now.", r: "I will. I always do. That's the only thing I'm reliable about. Good nows. Bad thens." },
        { tone: 'flirty', t: "The now bits are very good.", r: "Aren't they? That's my secret. Make the now so good nobody remembers the gaps. Is it working?" },
      ] },
      { tone: 'passive', t: "Where were you?", r: "Around. Busy. Hiding, a bit. When things get nice, I go quiet. It's a reflex. Like flinching.", opts: [
        { tone: 'cold', t: "That's not fair on me.", r: "It's not. I know. I'm not fair. I'm fun. I never said I was both. I'd love to be both." },
        { tone: 'passive', t: "Okay. I get it.", r: "You get it. You always get it. That's why I keep coming back. Stop getting it, I'll stop coming back." },
        { tone: 'flirty', t: "I'm glad you're back.", r: "Me too. Don't tell anyone. My reputation is \"unbothered\". You'll ruin it with all this gladness." },
      ] },
      { tone: 'flirty', t: "It's worth a lot.", r: "Is it? You're too easy on me. Someone should be hard on me. Not you, though. You're the soft spot.", opts: [
        { tone: 'cold', t: "Don't push it.", r: "Fair. I'll stop pushing. I'm not even pushing. I'm leaning. Slightly. In your direction." },
        { tone: 'passive', t: "Just don't vanish again.", r: "I can't promise that. I can promise to come back. I'm very good at coming back. Ask anyone." },
        { tone: 'flirty', t: "I missed you.", r: "Shh. Don't. If you missed me, then I have to admit I missed you, and then where are we? Exactly here." },
        { tone: 'risque', t: "Make it up to me tonight.", r: "Make it up to you. I can do that. I'm very good at apologising in ways that don't involve words." },
      ] },
    ],
  },
  {
    id: 'fling-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "There you are! Sorry I went quiet. I always go quiet. Then I reappear. It's my thing. Like a cat. A cat with excellent timing.",
    opts: [
      { tone: 'cold', t: "That's not a thing, it's rude.", r: "It's a bit rude. You're right. I'm rude in a charming way. Mostly. Partly. Fine, just rude.", opts: [
        { tone: 'cold', t: "At least you admit it.", r: "I admit everything. Admitting's easy. It's changing that's hard. I'm not big on hard." },
        { tone: 'passive', t: "What happened?", r: "Nothing happened. That's the thing. Nothing ever happens. I just go quiet when things are good. Weird reflex." },
        { tone: 'flirty', t: "Lucky I like cats.", r: "You like cats? Oh, you're doomed. Cats are the worst. They leave and come back and you let them." },
      ] },
      { tone: 'passive', t: "I wondered where you'd gone.", r: "Did you? That's sweet. Don't wonder too much. I'm always somewhere. Usually loud. Usually late.", opts: [
        { tone: 'cold', t: "I didn't wonder much.", r: "Good. That's good. Nobody should wonder about me. I'm not a mystery. I'm a very fun inconvenience." },
        { tone: 'passive', t: "Next time, just tell me.", r: "Tell you what, though? That I've gone quiet? Then it's a thing. I'll try. I won't. I might." },
        { tone: 'flirty', t: "I'm glad you came back.", r: "I always come back. That's the good part. The other part's the going. Focus on the good part." },
      ] },
      { tone: 'flirty', t: "I'll take you however you come.", r: "Oh. Okay. That's very generous. Too generous. You should have rules too. Make some. I'll help.", opts: [
        { tone: 'cold', t: "Then rule one: no more vanishing.", r: "That's a good rule. Very fair rule. I'll break it immediately, but it's a very fair rule." },
        { tone: 'passive', t: "I don't need rules.", r: "Everyone needs rules. Rules are what stop you doing things you'd love. I'd know." },
        { tone: 'flirty', t: "My rule is you.", r: "Okay. Stop. That's too nice. I can't handle nice. Say something rude. Quickly. Please." },
        { tone: 'risque', t: "Then come home with me tonight.", r: "Home. Yours. Mm. That's a nice reappearance. Maybe. Let's see how the night goes." },
      ] },
    ],
  },
  {
    id: 'fling-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "Hello, gorgeous. Yes, I vanished. Yes, I'm back. Yes, I'm going to be extremely charming until you forgive me. Is it working yet?",
    opts: [
      { tone: 'cold', t: "Not yet.", r: "Not yet. Okay. I like a challenge. I'll be charming in ways you haven't even seen. I've been saving some.", opts: [
        { tone: 'cold', t: "Save them for someone else.", r: "Ooh. You're angry. You're allowed. I'll be over here being sorry in a very attractive way." },
        { tone: 'passive', t: "Try harder.", r: "Harder. Okay. You look incredible. I thought about you twice. Fine, more than twice. That's my best material." },
        { tone: 'flirty', t: "It's starting to.", r: "Good. Starting's my speciality. I'm a fantastic starter. Ask any night out." },
      ] },
      { tone: 'passive', t: "Where did you go?", r: "Into my own head, mostly. It's very loud in there. Then I remembered you're quieter. So here I am.", opts: [
        { tone: 'cold', t: "That's a dodge.", r: "It's the only one I've got. I'm not a good-answers person. I'm a good-company person. Ask anyone." },
        { tone: 'passive', t: "You could text, you know.", r: "I could. I do text. Just at strange times. Strange times are when I'm braver. Daylight makes me shy." },
        { tone: 'flirty', t: "I'll keep the quiet for you.", r: "That's lovely. That's the nicest place anyone's offered me. I'll visit. Often. Probably." },
      ] },
      { tone: 'flirty', t: "It's working. Of course.", r: "Of course it is. I'm irresistible. Well, I'm resistible, but nobody bothers. You don't bother. Thank you.", opts: [
        { tone: 'cold', t: "Don't get cocky.", r: "Too late. Cocky's my default. You bring out the worst in me. The best worst." },
        { tone: 'passive', t: "I'm a soft touch, aren't I?", r: "The softest. It's lovely. It's also why I should be careful with you. I'm not careful. Ever." },
        { tone: 'flirty', t: "I always forgive you.", r: "Don't always forgive me. I'll abuse it. Kindly, but I'll abuse it. Forgive me sometimes. Mostly." },
        { tone: 'risque', t: "Show me how sorry you are.", r: "How sorry? Very. Extremely. I'll show you in private. There's a lot of sorry to get through." },
      ] },
    ],
  },
  {
    id: 'fling-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "You've been cool with me all night. It's working, annoyingly. What if, later, we go somewhere and you can be cool with me in private?",
    opts: [
      { tone: 'cold', t: "I'm going home alone.", r: "Alone. Okay. Respect. I'll go home alone too, and think about how alone you are. Very alone. Goodnight.", opts: [
        { tone: 'cold', t: "Goodnight, then.", r: "Goodnight. I won't text. I'll text. Don't answer. Do answer. I'm a mess. A cheerful mess." },
        { tone: 'passive', t: "Maybe another night.", r: "Another night. Lovely. I collect another nights. They're my favourite kind. They keep everything open." },
        { tone: 'flirty', t: "Try me again in an hour.", r: "An hour. I'll set an alarm. I won't need one. I'll be watching the clock like a racing driver." },
      ] },
      { tone: 'passive', t: "What did you have in mind?", r: "A nightcap. The non-literal kind. Somewhere quiet. Two of us. A lot of very bad ideas. And then sleep. Much later.", opts: [
        { tone: 'cold', t: "That's not happening.", r: "Not happening. Okay. Shame. The bad ideas were excellent. I'll save them. They keep." },
        { tone: 'passive', t: "Let's just talk for now.", r: "Talking. Fine. Talking's foreplay for people with patience. You've got patience. It's very irritating." },
        { tone: 'flirty', t: "I've got a few bad ideas too.", r: "Have you? Look at you. Okay. Let's compare bad ideas. Somewhere with a door that locks." },
      ] },
      { tone: 'flirty', t: "Lead the way.", r: "Oh. Okay. Didn't expect that. I love being surprised. Come on, then. Bring your coat. Leave your sensible side.", opts: [
        { tone: 'cold', t: "On second thought, no.", r: "You can't just do that. Ugh. Fine. It's fine. I'm fine. My coat's on and everything. I'll take it off. Alone." },
        { tone: 'passive', t: "Just for a bit.", r: "A bit. My favourite measurement. It stretches. Like a good night." },
        { tone: 'flirty', t: "Don't let go of my hand.", r: "I won't. Tonight, I won't. Tomorrow's tomorrow. Tonight's ours. Come on." },
        { tone: 'risque', t: "I'm not going to be cool in private.", r: "I was hoping you'd say that. Somewhere private, then. I'll lead. You follow very closely." },
      ] },
    ],
  },
  {
    id: 'fling-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "So. It's late. You're here. I'm here. My place is very close. That's not an invitation. It's geography. It might be an invitation.",
    opts: [
      { tone: 'cold', t: "It's geography, then.", r: "Geography. Okay. You're very literal. I love that. I hate that. I'll go home. Geographically.", opts: [
        { tone: 'cold', t: "Goodnight, geography.", r: "Ha. Goodnight. That was a good line. I'll steal it. I'll use it on someone less resistant." },
        { tone: 'passive', t: "Close is nice.", r: "Close is very nice. I'm always close. It's the staying-close part I'm bad at. Tonight's a good start." },
        { tone: 'flirty', t: "Maybe it's an invitation.", r: "Maybe it is. Shall we find out? Maybe's the best bit. Before anyone says yes or no." },
      ] },
      { tone: 'passive', t: "How close is close?", r: "Ten minutes. Five if we walk quickly. Two if you hold my hand and we stop talking.", opts: [
        { tone: 'cold', t: "I'll walk you to your door.", r: "To my door. How gallant. Then you'll leave. Very gallant. A bit disappointing. Very gallant." },
        { tone: 'passive', t: "Let's walk slowly.", r: "Slowly. Okay. Slowly's nice. Slowly gives us time to change our minds. I won't. Change mine, I mean." },
        { tone: 'flirty', t: "Two minutes, then.", r: "Two minutes. Hold my hand. Stop talking. Starting now. I'm still talking. Okay. Now." },
        { tone: 'risque', t: "I'm not stopping at the door.", r: "Good. I wasn't going to ask you to. Come in, then. Close the door. Leave the lights off." },
      ] },
      { tone: 'flirty', t: "Then invite me properly.", r: "Properly? Fine. Will you come home with me? There. That's the most proper sentence I've said all year.", opts: [
        { tone: 'cold', t: "Not tonight.", r: "Not tonight. Okay. I'll ask again. I always ask twice. The third time, you have to ask me." },
        { tone: 'passive', t: "All right. For a while.", r: "A while. Lovely. A while is my favourite length of time. It sounds long. It's short." },
        { tone: 'flirty', t: "I thought you'd never ask.", r: "I always ask. Eventually. Usually around now. Come on. Before I get sensible." },
        { tone: 'risque', t: "Lead me there.", r: "Follow me, then. Quietly. The neighbours have opinions about me. They're all correct." },
      ] },
    ],
  },
  {
    id: 'fling-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "I've been trying to behave all night. It isn't working. Come back to mine. For a nightcap. No caps involved. You know what I mean.",
    opts: [
      { tone: 'cold', t: "I don't think so.", r: "You don't think so. That's fine. I respect a no. I'll sulk very attractively on the way home.", opts: [
        { tone: 'cold', t: "Sulk away.", r: "I will. You'll hear about it in a text at 2am. Lots of dots. Then a single emoji. Then nothing." },
        { tone: 'passive', t: "Another time?", r: "Another time. Okay. I'll hold on to that. Not tightly. I don't hold anything tightly." },
        { tone: 'flirty', t: "Ask again in ten minutes.", r: "Ten minutes. Okay. I'm setting a timer. I'm the most patient impatient person you'll ever meet." },
      ] },
      { tone: 'passive', t: "What do you mean, exactly?", r: "You know exactly what I mean. Your face says so. Your face is very honest. It's a bit of a liability.", opts: [
        { tone: 'cold', t: "My face is just tired.", r: "Your face is lovely and tired. Tired can stay over. It can sleep on the side nearest the door." },
        { tone: 'passive', t: "Maybe just the nightcap, then.", r: "Just the nightcap. Okay. Herbal tea, then. Or not. We'll see what the night decides." },
        { tone: 'flirty', t: "I know what you mean.", r: "Good. I hate explaining. Explaining kills the mood. Your hand. Mine. Let's go." },
        { tone: 'risque', t: "Yes. Let's go now.", r: "Now? You're so decisive. Okay. Coat. Door. Taxi. Not a word to anyone. Especially my plant." },
      ] },
      { tone: 'flirty', t: "Behaving's overrated.", r: "Exactly. I always say that. Nobody listens. You listened. Come on. Leave before you remember your morning.", opts: [
        { tone: 'cold', t: "Not tonight, though.", r: "Not tonight. Ugh. Okay. You're so principled. It's so annoying. I'll text you something sulky." },
        { tone: 'passive', t: "For a little while.", r: "A little while. That's what I always say. Then it's breakfast. Except I don't do breakfast. So. Not breakfast." },
        { tone: 'flirty', t: "Lead the way. I'm yours tonight.", r: "Mine tonight. I like the sound of that. I like the tonight part most. Come on, then." },
        { tone: 'risque', t: "Then stop behaving.", r: "Done. Behaviour's gone. Let's get you somewhere I can misbehave properly. Quietly. Very quietly." },
      ] },
    ],
  },
  {
    id: 'fling-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "I need to say something before I lose my nerve. You were cold last time and it hurt. It shouldn't. I like you more than the rules allow.",
    opts: [
      { tone: 'cold', t: "Then stick to your rules.", r: "I'm trying. I've stuck to them for years. You walked in and they went soft. Very rude of you.", opts: [
        { tone: 'cold', t: "That's your problem.", r: "It is. Completely mine. I'll deal with it. Probably by vanishing for a week. Don't panic." },
        { tone: 'passive', t: "What does that mean for us?", r: "There's no us. There's this. And this is lovely. Don't make me say more. I'll regret it at noon." },
        { tone: 'flirty', t: "I like you more than the rules allow, too.", r: "Don't. If you say it back, it's a conversation. If it's a conversation, it's serious. Pretend I never said it." },
      ] },
      { tone: 'passive', t: "Would you ever break them?", r: "Some of them. A bit. On a Tuesday, no. Right now, at this hour, with you looking at me like that? Yes.", opts: [
        { tone: 'cold', t: "And tomorrow?", r: "Tomorrow I'll be myself again. Breezy. Unbothered. Rule-abiding. You'll barely recognise this version." },
        { tone: 'passive', t: "I'll take this version, then.", r: "This version's temporary. Like a pop-up shop. Get what you can before it closes." },
        { tone: 'flirty', t: "I'll make you want to every day.", r: "Every day is a lot of days. I'm not built for every day. But I'd like to try one. One more day." },
      ] },
      { tone: 'flirty', t: "I'm glad you told me.", r: "Don't be glad. Be normal. Act normal. Pretend I didn't say anything. I'll pretend too. We're both brilliant pretenders.", opts: [
        { tone: 'cold', t: "Pretending, then.", r: "Good. Thank you. Pretending's my favourite sport. You're getting good at it. Scarily good." },
        { tone: 'passive', t: "It's safe with me.", r: "I know it is. That's what's scary. You're safe and I'm not used to safe. Safe makes me itch." },
        { tone: 'flirty', t: "Don't take it back.", r: "I have to. It's my rule. Fine. I'll leave it there a bit. Overnight. In the morning, it's gone." },
        { tone: 'risque', t: "Then stay tonight and break a few.", r: "A few. Not all. Just the ones that matter. Okay. Tonight. Come here before I change my mind." },
      ] },
    ],
  },
  {
    id: 'fling-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "I've got a confession, and then I'm going to pretend I never made it. I like you. More than I'm supposed to. More than usual. That's all.",
    opts: [
      { tone: 'cold', t: "Is that it?", r: "That's all. That's plenty. That's more than I've said to anyone in two years. I might need to sit. Or leave.", opts: [
        { tone: 'cold', t: "Go on, leave, then.", r: "I can't. My legs won't. Don't tell anyone. They'll think I've gone soft. I haven't. Mostly." },
        { tone: 'passive', t: "Thank you for saying it.", r: "Don't thank me. Thanking makes it real. Now say something to make it unreal. Please." },
        { tone: 'flirty', t: "Same. A lot, actually.", r: "Okay. Well. That's... okay. That's a lot for one night. Let's go somewhere loud and not discuss it." },
      ] },
      { tone: 'passive', t: "What's supposed to happen now?", r: "Nothing. That's the point. Nothing's supposed to happen. I said it so it doesn't eat me. Now it's out. Gone.", opts: [
        { tone: 'cold', t: "Sounds like you want it gone.", r: "I want it gone and I want it here. I'm a very complicated simple person." },
        { tone: 'passive', t: "Okay. Nothing, then.", r: "Thank you. Nothing's perfect. Nothing's my favourite thing to happen. You get me. That's the problem." },
        { tone: 'flirty', t: "Something could happen.", r: "Something could. Something always could. Something's dangerous. Let's start with tonight." },
      ] },
      { tone: 'flirty', t: "I won't let you pretend.", r: "Then I'll pretend really loudly. You'll hardly notice. I'm very good at it.", opts: [
        { tone: 'cold', t: "Fine. Pretend.", r: "Thank you. I'm pretending now. Look. No feelings. Very convincing. Isn't it? Isn't it?" },
        { tone: 'passive', t: "I'll remember it, though.", r: "Remember it. Quietly. Don't bring it up at breakfast. I don't do breakfast. Don't bring it up." },
        { tone: 'flirty', t: "I like you more than usual too.", r: "More than usual. Perfect. That's exactly the right dose for me." },
        { tone: 'risque', t: "Then come home and pretend with me.", r: "Pretend all night? Easily. Pretending's much easier in the dark. Come on." },
      ] },
    ],
  },
  {
    id: 'fling-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "I'll say it once, because it's late and I'm brave after midnight: I like you more than the rules allow. In the morning, I'll deny it.",
    opts: [
      { tone: 'cold', t: "Deny it now.", r: "Fine. Denied. I don't like you at all. You're terrible. I'm never seeing you again. See? Easy. Lies.", opts: [
        { tone: 'cold', t: "I believe the denial.", r: "You don't. Nobody does. But thank you for pretending. It's very kind of you." },
        { tone: 'passive', t: "That was a terrible lie.", r: "Terrible. Awful. I'm a terrible liar after midnight. Before midnight, I'm brilliant." },
        { tone: 'flirty', t: "Say it again, though.", r: "No. Once. Once was a lot. Twice would be a pattern. Patterns become relationships." },
      ] },
      { tone: 'passive', t: "I won't let you deny it.", r: "You'll have to. Everyone has to. It's part of the deal. I say the true thing, then we agree it was the hour.", opts: [
        { tone: 'cold', t: "Fine. It was the hour.", r: "Blame the hour. Always. Never me. I'm blameless. The hour's a menace." },
        { tone: 'passive', t: "I'll remember it, at least.", r: "Remember it quietly. Keep it like a receipt. You'll never use it. It's nice to know it's there." },
        { tone: 'flirty', t: "Same here. More than any rule allows.", r: "Ugh. Don't. Now we both said it. Now it's out in the world. The world's going to make it a thing." },
      ] },
      { tone: 'flirty', t: "Say it in the morning.", r: "I can't. I don't do mornings. You'll have to make do with nights. A lot of nights. Some nights.", opts: [
        { tone: 'cold', t: "Then let's both forget it.", r: "I'll forget it if you do. Deal. Shake on it. Your hand's warm. I'm not forgetting that." },
        { tone: 'passive', t: "Nights are enough for now.", r: "Nights are enough. Yes. Thank you. You're the only one who's ever said that and meant it." },
        { tone: 'flirty', t: "I'll be here every night you'll have me.", r: "Every night is a lot. Start with this one. This one's ours. This one I'll remember." },
        { tone: 'risque', t: "Then let's make tonight unforgettable.", r: "Unforgettable. Okay. I accept. I'll be denying it tomorrow. Tonight, I'm not denying anything." },
      ] },
    ],
  },
];
