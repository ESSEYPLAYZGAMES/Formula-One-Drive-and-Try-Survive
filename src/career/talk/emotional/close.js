// Emotional - in person, stage 'close' (dating). Slots 1..9, each in a cold / passive / flirty opening mood.
// Arc: 1 'day one' - 2 sleeping in the jacket you left - 3 'umbrella' (the in-joke) - 4 jealousy, said honestly - 5 the
// ten seconds the camera lost you - 6 the box of unsent letters - 7 the window seat house - 8 enough, or too much - 9 'I
// love you' and a new notebook, for both of you. Cold hurts most here; risque is tender and intense, then fades out.
export const DATA = [
  // ------------------------------------------------------------------------------------------------ slot 1: day one
  { id: 'emotional-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "Hi. We're together now, and last time still felt cold. I wrote 'day one' in my notebook so happily. Was I wrong to?",
    opts: [
      { tone: 'cold', t: "Maybe you jumped the gun.", r: "Jumped the gun. Okay. I thought we'd both heard the start. It feels like I'm alone on the grid.", opts: [
        { tone: 'cold', t: "Let's just see how it goes.", r: "See how it goes. I gave you 'day one' and you gave me 'see'. I'm going home to hold that. It's heavy." },
        { tone: 'passive', t: "No. Sorry. I'm just bad at new things.", r: "Bad at new things. Me too, honestly. Okay. Day one, take two. We'll be bad at it together. Gently." },
        { tone: 'flirty', t: "You weren't wrong. Write 'day two' tonight.", r: "Day two. Oh... I'll write it in my best pen. With a heart. Two. You don't know how much I needed that." },
      ] },
      { tone: 'passive', t: "You weren't wrong. I'm still getting used to it.", r: "Me too. I keep saying 'my partner' in my head to hear how it sounds. It sounds terrifying. And lovely.", opts: [
        { tone: 'cold', t: "Don't say it out loud yet.", r: "Not yet? Okay. I'll keep it in my head. It's lonely in there with a word like that. That hurt, honestly." },
        { tone: 'passive', t: "Say it out loud. See how it sounds.", r: "My partner. Oh... it sounds real. It sounds like somewhere to live. Say mine too? When you're ready." },
        { tone: 'flirty', t: "I've been saying it too. It sounds good with your name.", r: "With my name? You've been practising? Oh, we're both ridiculous. I love us being ridiculous." },
      ] },
      { tone: 'flirty', t: "Wrong? I'd have written it in capitals.", r: "Capitals? You? Oh... okay. Last time's melting a bit. Day one, in capitals. With a little drawing of us.", opts: [
        { tone: 'cold', m: -3, t: "Okay, maybe not capitals.", r: "Lower case, then. Small. You keep giving and then taking back, and I feel every bit of it, {me}." },
        { tone: 'passive', t: "What does the drawing look like?", r: "Two stick people and a very fast car. One of them is crying. Guess which. It's a happy drawing, I promise." },
        { tone: 'risque', t: "Capitals. And tonight we make day one worth writing.", r: "Tonight? Oh... yes. Stay with me tonight. I'll write it in the morning. Slowly. When I can think again." },
        { tone: 'flirty', t: "Capitals, underlined, with a crown on top.", r: "A crown! Day one has a crown. I'm so happy I could walk on the ceiling. Come here. Day one hug." },
      ] },
    ] },
  { id: 'emotional-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "Day one. I wrote it in my notebook last night, then sat and looked at it for an hour. We're us now. Is it real to you too?",
    opts: [
      { tone: 'cold', t: "It's just a word.", r: "Just a word? It's the biggest word I've written in years. Oh... you didn't mean it like that. Did you?", opts: [
        { tone: 'cold', t: "Words don't change much.", r: "They change everything for me. You know that. I'm going to go and hold my notebook and hurt quietly." },
        { tone: 'passive', t: "No. Sorry. It's real. I'm just not a words person.", r: "That's okay. I'm words enough for two. Just show me sometimes. Show me it's real, in your own way." },
        { tone: 'flirty', t: "It's a word I've been waiting to hear from you.", r: "Waiting? You were waiting? Oh, I'm writing that under 'day one'. And underlining it. Twice." },
      ] },
      { tone: 'passive', t: "It's real. Weird, but real.", r: "Weird and real. That's us. I keep saying 'my partner' in my head to hear it. It sounds like a door opening.", opts: [
        { tone: 'cold', t: "Stop saying it in your head. It's odd.", r: "Odd? Okay. I'll stop. I wanted to share the little private joy of it. I didn't expect you to step on it." },
        { tone: 'passive', t: "What else did you write on day one?", r: "'Day one. They said yes. I cried in the car. Moth didn't care.' My cat. Very unromantic. Very me." },
        { tone: 'flirty', t: "Go on, out loud. I want to hear it.", r: "My partner. There. My voice cracked on it. You're grinning. Say mine back. Please. I need to hear it." },
      ] },
      { tone: 'flirty', t: "Real? I've thought about nothing else all day.", r: "Nothing else? Not even racing? That's the most romantic thing you could say. I know what racing means to you.", opts: [
        { tone: 'cold', t: "Well, racing too, obviously.", r: "Obviously. Of course. I just wanted one moment where I came first. I'll let it go. It stings, though." },
        { tone: 'passive', t: "Day one. Let's make it a good one.", r: "A good one. Let's go somewhere small and quiet and just be us. I'll hold your hand the whole time. Don't mind." },
        { tone: 'risque', t: "Then let me show you how real it is. Tonight.", r: "Tonight. Yes. Stay. I want to fall asleep knowing day one ended with you. Oh... I'm so sure of this." },
        { tone: 'flirty', t: "Day one of a very long book.", r: "A very long book. A thousand chapters. I'll write every one. You'll be in all of them. Every single page." },
      ] },
    ] },
  { id: 'emotional-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "Hi, my partner. Oh, I've waited all day to say that out loud. I wrote 'day one' in my notebook. It's covered in hearts. Don't look.",
    opts: [
      { tone: 'cold', t: "Bit soon for pet names, isn't it?", r: "It's not a pet name. It's what we are. I thought. Oh... have I got this wrong? Please tell me I haven't.", opts: [
        { tone: 'cold', t: "Let's not label everything.", r: "I'm a labeller. I name stars wrong. I keep dates. I thought you knew that about me. I'm hurting now." },
        { tone: 'passive', t: "You haven't. It just caught me off guard.", r: "Off guard. Okay. I'll warn you next time. 'Incoming feelings.' Like a weather report. My heart's settling." },
        { tone: 'flirty', t: "No, you're right. Hi, my partner.", r: "Oh... you said it back. I'm going to replay that until the sun comes up. Say it again tomorrow. And after." },
      ] },
      { tone: 'passive', t: "Covered in hearts? Can I see?", r: "Just one page. Look. 'Day one.' Hearts. A pressed daisy. And a tear stain, which is happy, before you ask.", opts: [
        { tone: 'cold', t: "That's a lot of hearts.", r: "It's a lot of happy. I thought you'd love it. You're looking at it like it's a mess. It's my heart, on paper." },
        { tone: 'passive', t: "It's lovely. I'll remember day one too.", r: "You will? Then it's real in two places. In my notebook and in you. That's how you know something's real." },
        { tone: 'flirty', t: "Add one more heart. From me.", r: "Draw it. Here. Oh, it's wonky. It's perfect. It's the best heart on the page. I'm keeping this notebook forever." },
      ] },
      { tone: 'flirty', t: "Hi, my partner. Say it again. I like the sound.", r: "My partner. My partner. My partner. I'm giddy. I'm going to say it to strangers tomorrow. To pigeons.", opts: [
        { tone: 'cold', t: "Please don't tell strangers.", r: "Okay. Not strangers. I wanted the whole world to know. You want it quieter. I'll be quieter. It hurts." },
        { tone: 'passive', t: "Tell whoever you like. I'm proud of it.", r: "Proud. You're proud of us. I didn't know I needed that word till now. Thank you. Thank you." },
        { tone: 'risque', t: "Say it again later. When it's just us.", r: "Just us... yes. I'll say it softly, in the dark, right against your ear. Stay. Please." },
        { tone: 'flirty', t: "Tell everyone. I'll tell them louder.", r: "Louder! We'll have a competition. I'll win. I've had practice. Oh, I love this. I love us." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 2: the jacket
  { id: 'emotional-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "I've missed you till it ached, and last time still felt cold. I've been sleeping in the jacket you left. Is that silly?",
    opts: [
      { tone: 'cold', t: "I need that jacket back, actually.", r: "Oh. Of course. I'll bring it. It's only a jacket. It's just... it smelled like you and you weren't there.", opts: [
        { tone: 'cold', t: "Bring it next time.", r: "I will. I'll fold it nicely. I'll try not to cry on it. I can't promise. You've made missing you lonelier." },
        { tone: 'passive', t: "No, keep it. Sorry. I've missed you too.", r: "You have? Then the jacket stays. I'll stop counting the days. No, I won't. I'll count them happier." },
        { tone: 'flirty', t: "Keep it. I'd rather you wore it than me.", r: "You'd rather... oh. That's so tender I can't look at you. I'm wearing it right now under my coat. Look." },
      ] },
      { tone: 'passive', t: "Not silly. The missing goes both ways.", r: "You have? Say how much. I need numbers. I've missed you eleven out of ten. I've worn the jacket every night.", opts: [
        { tone: 'cold', t: "I don't measure it.", r: "You don't have to measure. You could just say it. I said mine. I needed yours and got nothing. That hurts." },
        { tone: 'passive', t: "Ten out of ten. Every night.", r: "Ten. Okay. I'll take ten. I'll round it up to eleven in my head. Don't tell me if that's cheating." },
        { tone: 'flirty', t: "Eleven. And I'm jealous of my own jacket.", r: "Jealous of your jacket! It's the luckiest jacket in the world. Come here. You can have the real thing." },
      ] },
      { tone: 'flirty', t: "Silly? I'm jealous of a jacket now.", r: "Jealous? It's kept me warm while you were away. It's been a very good jacket. You're better.", opts: [
        { tone: 'cold', t: "It's just a jacket.", r: "It's not just a jacket when I miss you. It's the closest I could get. You made that sound small. I'm sad now." },
        { tone: 'passive', t: "How bad was the missing?", r: "Bad. I set alarms for your sessions. I talked to the jacket. I talked to my cat about the jacket. Very bad." },
        { tone: 'risque', t: "Wear it tonight. I'll come and find you in it.", r: "Tonight? Yes. I'll be swamped in it, waiting. Come and find me. Don't knock. Don't let go till morning." },
        { tone: 'flirty', t: "Then let me be your jacket tonight.", r: "My jacket? Arms around me, keeping me warm? Oh, yes. That's the best offer anyone's ever made me." },
      ] },
    ] },
  { id: 'emotional-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Can I tell you something embarrassing? The jacket you left? I've been sleeping in it. It smells like you. I miss you that much.",
    opts: [
      { tone: 'cold', t: "That's a bit much, honestly.", r: "Is it? I'm sorry. I don't know how to miss someone quietly. I'll stop telling you, if it's too much.", opts: [
        { tone: 'cold', t: "Maybe just keep it to yourself.", r: "Then I'll miss you in secret. That's lonelier than missing you out loud. I'm telling you that much, at least." },
        { tone: 'passive', t: "Sorry. It's sweet. I'm just bad at missing people.", r: "Bad at missing people? Then I'll miss you for both of us. I've got plenty. I've got so much missing." },
        { tone: 'flirty', t: "Much, but lovely. Keep it on.", r: "Keep it on. Okay. I'll wear it to bed every night you're away. You'll have to fight me for it back." },
      ] },
      { tone: 'passive', t: "I miss you too. Races keep me away.", r: "I know. I'm proud of you. I'm also lonely. Both at once. Every race, I count the days till you're back.", opts: [
        { tone: 'cold', t: "It's my job. You knew that.", r: "I knew. I still miss you. Knowing doesn't stop missing. I wasn't complaining. I was missing you out loud." },
        { tone: 'passive', t: "I count them too. Honestly.", r: "You do? Then we're counting together. That makes it a bit shorter, I think. Like sharing a heavy bag." },
        { tone: 'flirty', t: "Next time, come with me.", r: "Come with you? To a race? I'd scream through every lap. Yes. Yes. I'll bring the jacket. Ironic." },
      ] },
      { tone: 'flirty', t: "It smells like me? Then I'll have to top it up.", r: "Top it up? Oh. Yes. Please. Come here and stand very close to the jacket. And me. Mostly me.", opts: [
        { tone: 'cold', t: "I'm not going to hug a jacket.", r: "Not the jacket. Me. I meant me. Oh, it's okay. I'll hug it on my own. That's what I've been doing." },
        { tone: 'passive', t: "Okay. Come here.", r: "There. Oh, that's better. That's so much better than the jacket. You're warmer. You hug back." },
        { tone: 'risque', t: "Or you could keep me instead. All night.", r: "All night? Yes. The jacket can have the chair. I want the real you. Stay, and hold on till it's light." },
        { tone: 'flirty', t: "I'll wear it on the plane so it smells like both of us.", r: "Both of us. That's the most romantic thing anyone's ever said about a jacket. I'm a mess. A happy mess." },
      ] },
    ] },
  { id: 'emotional-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "I missed you so much I started sleeping in your jacket. It's on now. Under my coat. Don't tell anyone I'm this far gone.",
    opts: [
      { tone: 'cold', t: "Bit strange, wearing it out.", r: "Strange? It made me feel close to you. I'm sorry. I'll take it off. I didn't think you'd mind.", opts: [
        { tone: 'cold', t: "I do mind, a bit.", r: "Okay. It's off. Here. I'll go home and sleep in my own things. I won't sleep, but I'll try. It hurt, {me}." },
        { tone: 'passive', t: "Sorry. Keep it. I'm just tired.", r: "Tired. Okay. Come here, then. Put your head on my shoulder. It's your jacket anyway. You're allowed." },
        { tone: 'flirty', t: "Strange, but it looks better on you.", r: "Better on me? Then it's mine now. Stolen fair and square. You'll have to steal it back. Slowly." },
      ] },
      { tone: 'passive', t: "I missed you too. How far gone?", r: "Very. I set alarms for your practice sessions. I watch the onboard just to hear your engine. That far.", opts: [
        { tone: 'cold', t: "That's a bit obsessive.", r: "I call it missing you. I'm sorry it looks like that from outside. From in here it feels like love." },
        { tone: 'passive', t: "I play your voice notes in hotels. Same thing.", r: "My voice notes? The rambly ones? You keep those? I'm so touched my knees have gone." },
        { tone: 'flirty', t: "Far gone suits you.", r: "Everything suits me when you look at me like that. I'm keeping the jacket. I'm keeping you. Both." },
      ] },
      { tone: 'flirty', t: "I won't tell. But I'm keeping you close.", r: "Keep me close. Yes. Closer than the jacket. Closer than anything. Oh, I've missed your face so much.", opts: [
        { tone: 'cold', t: "Not here. People are watching.", r: "Oh. Okay. Not here. I forget other people exist when you're near. I'll step back. It feels like a mile." },
        { tone: 'passive', t: "How long till I'm away again?", r: "Nine days. I counted. I'll be fine. I'll be in the jacket, writing to you. Sad, but fine. Mostly fine." },
        { tone: 'risque', t: "Then come home with me. Jacket and all.", r: "Jacket and all. Yes. Let's go. I don't want to miss you for one more minute. Not tonight." },
        { tone: 'flirty', t: "You're going to be my favourite thing to come home to.", r: "Your favourite thing. Me, in your jacket, waiting by the door. That's going in the notebook in gold." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 3: umbrella
  { id: 'emotional-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "Something silly happened. I cried at an advert. A lost umbrella finding its way home. I wanted to tell you, but things felt cold.",
    opts: [
      { tone: 'cold', t: "You cried at an umbrella advert?", r: "I did. It found its owner in the rain. You're saying it like it's pathetic. I was going to make it our joke.", opts: [
        { tone: 'cold', t: "It is a bit pathetic.", r: "Okay. Then it's just mine. I won't share the silly things anymore. That's sadder than the umbrella." },
        { tone: 'passive', t: "Sorry. Our joke? How?", r: "If I ever say 'umbrella', it means I'm about to cry at something silly. A code. So you don't panic." },
        { tone: 'flirty', t: "Our joke? So 'umbrella' is code for you about to cry.", r: "Yes! Exactly that. 'Umbrella' means warning: incoming tears, silly reason. Oh, you're good at us." },
      ] },
      { tone: 'passive', t: "That's very you. What happened in it?", r: "It blew away, travelled all over the city and found its owner. I sobbed. In public. On a bus.", opts: [
        { tone: 'cold', t: "On a bus? Embarrassing.", r: "It was. I didn't need you to say so. I wanted you to laugh with me, not at me. There's a difference. I felt it." },
        { tone: 'passive', t: "Okay, that's our new in-joke. 'Umbrella'.", r: "'Umbrella.' Our word. If I say it, I'm about to cry at something daft. You just nod and hand me a tissue." },
        { tone: 'flirty', t: "I'd have held your hand on the bus.", r: "You would? Then whenever I say 'umbrella' you'll know to hold my hand. That's the code now. Our code." },
      ] },
      { tone: 'flirty', t: "Tell me. I love your silly cries.", r: "A lost umbrella crossed a city to find its owner. I sobbed. So 'umbrella' is our code now: silly tears incoming.", opts: [
        { tone: 'cold', t: "We don't need a code.", r: "We don't need one. I wanted one. Small things we share. I'll keep it, quietly. It's lonelier than I thought." },
        { tone: 'passive', t: "Umbrella. Got it. What do I do?", r: "Hold my hand. Say 'there, there'. Don't laugh until I laugh first. That's the whole job. You'll be good at it." },
        { tone: 'risque', t: "And what's the code for 'take me to bed'?", r: "Oh... we don't need a code for that. Just look at me the way you are now. I'll know. I'll always know." },
        { tone: 'flirty', t: "Say it now. I want to see if it works.", r: "Umbrella. See? You're being lovely and it's silly and I'm welling up. It works. You're cruel. I adore it." },
      ] },
    ] },
  { id: 'emotional-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "I need to tell you something ridiculous. An advert made me cry. A lost umbrella, going home. On a bus. Sobbing.",
    opts: [
      { tone: 'cold', t: "That's ridiculous, yes.", r: "I said it was. I wanted you to say something softer. I wanted it to be our silly thing. Now it's just mine.", opts: [
        { tone: 'cold', t: "Fine by me.", r: "Okay. Fine by you. I'll keep the umbrella to myself. I'll cry at it alone. That's what I'd hoped not to do." },
        { tone: 'passive', t: "Sorry. Make it our thing. How?", r: "If I say 'umbrella', I'm about to cry at something silly. You'll know. You won't worry. That's all it is." },
        { tone: 'flirty', t: "Ridiculous and adorable. I want the full story.", r: "It blew away, crossed the city, found its owner in the rain. So 'umbrella' is our code now. For my silly tears." },
      ] },
      { tone: 'passive', t: "Tell me what happened in it.", r: "It blew away, went round the whole city, and found its owner, soaked, at a bus stop. They hugged it. I lost it.", opts: [
        { tone: 'cold', t: "Over an umbrella.", r: "Over an umbrella. Over coming home. Over being found. You know that's what I cry at. You chose not to see it." },
        { tone: 'passive', t: "So 'umbrella' is our word for 'I'm about to cry'?", r: "Yes! For the silly cries. Not the big ones. 'Umbrella' means 'I'm fine, I'm just moved by a sandwich advert'." },
        { tone: 'flirty', t: "Next time, call me. I'll find you like the umbrella did.", r: "Like the umbrella! Oh, that's... umbrella. Umbrella. That's the code, by the way. I'm about to cry." },
      ] },
      { tone: 'flirty', t: "Come here. You cry at the best things.", r: "The best things? A soggy umbrella? Okay. Yes. I do. So now 'umbrella' is our code word. For silly tears.", opts: [
        { tone: 'cold', t: "We don't need code words.", r: "We don't need them. But they're ours. Little things that are only ours. I'd hoped you'd want them too." },
        { tone: 'passive', t: "Umbrella. Okay. Noted.", r: "Noted! In your head? I'll write it down for you. Page one of our in-jokes. Umbrella." },
        { tone: 'risque', t: "I'll dry your tears. And then some.", r: "And then some? Yes. Let's go home. I've finished crying at umbrellas for today. I want you instead." },
        { tone: 'flirty', t: "I'll say it first next time, so you know I'm with you.", r: "You'll say 'umbrella' for me? That's so kind I can't stand it. Umbrella. A real one. You did it again." },
      ] },
    ] },
  { id: 'emotional-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "Our first in-joke, ready? An advert about a lost umbrella going home made me weep. So 'umbrella' now means: silly tears incoming.",
    opts: [
      { tone: 'cold', t: "That's not a joke, that's just sad.", r: "Sad? It's sweet! It's ours. I was sure you'd love it. You've made it a bit sad now. You've made me a bit sad.", opts: [
        { tone: 'cold', t: "I'll pass on the in-jokes.", r: "You'll pass. On us having things. Okay. I'll keep the umbrella. I'll keep my tears. I'll keep this hurt too." },
        { tone: 'passive', t: "Sorry. It's sweet. Tell me the advert.", r: "It blew down a street, over a river, into a park, and found its owner at a bus stop. I sobbed. Umbrella." },
        { tone: 'flirty', t: "Okay, it's sweet. Umbrella. Did I do it right?", r: "Perfectly! Now I'm welling up because you did it right. That's a real umbrella. See? It works." },
      ] },
      { tone: 'passive', t: "Silly tears incoming. Got it. What else counts?", r: "Puppies in jumpers. Old couples holding hands. Your face when you win. Umbrella, umbrella, umbrella.", opts: [
        { tone: 'cold', t: "That's everything, then.", r: "It is nearly everything. That's me, all through. I thought you liked who I am. You're making me wonder now." },
        { tone: 'passive', t: "My face when I win? Noted.", r: "Your face when you win is a whole umbrella. The full advert. I'll be at the bus stop sobbing." },
        { tone: 'flirty', t: "And what's the code for 'kiss me'?", r: "There isn't one. You just do it. Oh... you're doing it. That's... umbrella. Umbrella. You're impossible." },
      ] },
      { tone: 'flirty', t: "Our first in-joke? I'll treasure it. Umbrella.", r: "You said it! So seriously, too. Now I'm about to cry because of the crying code. That's very meta.", opts: [
        { tone: 'cold', t: "Okay, it's getting old already.", r: "Already? It's day... three of the joke. Oh. I'll retire it. I'll retire it with my feelings. Quietly." },
        { tone: 'passive', t: "We should write these down.", r: "We should! The in-joke list. I'll start a page. Umbrella first. Then whatever you do next." },
        { tone: 'risque', t: "Let's make the next in-joke something we do tonight.", r: "Something we do tonight? Yes. Something just ours. Something I'll never write down. Take me home." },
        { tone: 'flirty', t: "I'll treasure every umbrella you ever have.", r: "Every one? There'll be thousands. You'll be treasuring for a lifetime. Umbrella. That one's real." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 4: jealousy, honestly
  { id: 'emotional-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "Even with how cold things got, I need to say this. Someone flirted with you, and you let them. It hurt. I need you to hear it.",
    opts: [
      { tone: 'cold', t: "You're overreacting.", r: "Maybe. But it's my reaction. You don't get to decide its size. I'd rather tell you than go quiet.", opts: [
        { tone: 'cold', t: "Then let's not do this.", r: "Not tonight, then. But I'm not going to pretend I'm fine. I'm not fine. I'm hurt, and I'm going home with it." },
        { tone: 'passive', t: "Okay. I hear you. It didn't mean anything.", r: "Thank you for hearing it. I believe you. I needed to say it out loud, not swallow it. That's new for me." },
        { tone: 'flirty', t: "I hear you. And there's only one person I want flirting with me.", r: "Only one? Say who. I know, I know. Say it anyway. Oh... yes. That. Okay. I'm okay now." },
      ] },
      { tone: 'passive', t: "I'm sorry. I didn't realise it hurt you.", r: "I know you didn't. That's why I'm telling you. I'm not angry. I needed you to know where it landed.", opts: [
        { tone: 'cold', t: "It was harmless.", r: "To you. Not to me. I'm not asking you to never talk to anyone. I'm asking you to care that it hurt." },
        { tone: 'passive', t: "I'll be more careful.", r: "Thank you. That's all I needed. Not a promise, just care. I feel lighter. I'm glad I said it instead of stewing." },
        { tone: 'flirty', t: "Nobody else gets my attention like you do.", r: "Like I do? Then look at me like that more often. In public. So everyone knows. I'm feeling a bit better." },
      ] },
      { tone: 'flirty', t: "Jealous? Come here. You know you're the only one.", r: "I want to know it, not just hope it. I'm not being difficult. It hurt, {me}. Tell me properly, please.", opts: [
        { tone: 'cold', t: "I've told you. You need to trust me.", r: "I do trust you. That's why I said it out loud. Trust isn't silence. I'm sad you'd rather I just took it." },
        { tone: 'passive', t: "You're the only one. And I'm sorry.", r: "Okay. I believe you. Thank you for the sorry. It matters more than the 'only'. Well, both matter." },
        { tone: 'risque', t: "Let me spend tonight proving you're the only one.", r: "Tonight? Yes. Prove it slowly. Prove it till I fall asleep sure of it. I want to be sure. Hold me." },
        { tone: 'flirty', t: "The only one. Shall I put it in your notebook?", r: "In my notebook? In your handwriting? Oh, yes. That would mend it. That would mend everything. Write it now." },
      ] },
    ] },
  { id: 'emotional-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "Can I be honest about something that hurt? Someone was flirting with you the other day. You laughed. I know it's silly. It still hurt.",
    opts: [
      { tone: 'cold', t: "It's not a big deal.", r: "It's a big deal to me. That's why I said it. I'm not accusing you. I'm telling you how my heart works.", opts: [
        { tone: 'cold', t: "Your heart works too hard.", r: "It does. I know. But it works for you. You just made it feel like a fault. I'm going to go and be quiet." },
        { tone: 'passive', t: "Sorry. Okay. Tell me what you need.", r: "Just to hear that I'm yours. And that you're mine. Out loud. Then I'll be fine. I'll be better than fine." },
        { tone: 'flirty', t: "It's not a big deal, because you're the only big deal.", r: "The only big deal. That's a very good line. Okay. I'm melting despite myself. Don't stop." },
      ] },
      { tone: 'passive', t: "You were right to say it. I'm sorry.", r: "Thank you for saying sorry. I needed that more than anything. I don't want to be the jealous one. I just feel it.", opts: [
        { tone: 'cold', t: "You are the jealous one, a bit.", r: "Maybe. But you didn't have to say it like that, right after sorry. It took the sorry away a little." },
        { tone: 'passive', t: "Feel it. Tell me. I'd rather know.", r: "You'd rather know? Then I'll always tell you. And you'll always listen. That's us. That's how we work." },
        { tone: 'flirty', t: "I'll laugh at your jokes louder. Everyone will know.", r: "Louder? Even my terrible ones? Everyone will think we're mad. Good. Let them. You're mine." },
      ] },
      { tone: 'flirty', t: "Silly? No. Come here. You're mine.", r: "Say it again. Slower. I'm sorry I need it. I just do. When someone makes you laugh, I want it to be me.", opts: [
        { tone: 'cold', t: "I can't make every laugh about you.", r: "I didn't ask for every laugh. I asked for a little reassurance. You made it sound unreasonable." },
        { tone: 'passive', t: "You're mine. And I'm yours. Always.", r: "Always. Okay. Thank you. I'm going to sleep tonight. Actually sleep. You don't know how rare that is." },
        { tone: 'risque', t: "You're mine. Let me show you what that means.", r: "Show me. Yes. Somewhere just us. I want to feel it, not just hear it. I'm yours. Take me home." },
        { tone: 'flirty', t: "You're mine. And you make me laugh the most.", r: "The most? More than them? Okay, I'm smug now. Very smug. Smug and... oh, I nearly said something. Not yet." },
      ] },
    ] },
  { id: 'emotional-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "You know I adore you. So I'll say this kindly. Someone flirted with you and you lit up. It hurt more than I want to admit.",
    opts: [
      { tone: 'cold', t: "You can't police who flirts with me.", r: "I'm not policing. I'm telling you how it felt. Those aren't the same. I hoped you'd know the difference.", opts: [
        { tone: 'cold', t: "Feels the same to me.", r: "Then I'll stop telling you how I feel. That's the opposite of what I want for us. I'm hurt, and I'm going." },
        { tone: 'passive', t: "Sorry. You're right to tell me.", r: "Thank you for listening. Not a fight, just to be heard. I feel so much better." },
        { tone: 'flirty', t: "I lit up because I was thinking about you.", r: "About me? Really? Is that true or is that charm? Oh... it's true. I can tell. Okay. Okay. Forgiven." },
      ] },
      { tone: 'passive', t: "I'm sorry. I didn't think about how that looked.", r: "You're not careless, usually. You just didn't see me watching. I'm telling you so next time you will.", opts: [
        { tone: 'cold', t: "Next time, don't watch.", r: "Don't watch you? I always watch you. That's what loving someone looks like, mostly. You've made it sound sad." },
        { tone: 'passive', t: "I'll see you next time. I promise.", r: "Thank you. That's all. See me. I'll be the one in the corner with my heart on my sleeve. As usual." },
        { tone: 'flirty', t: "I'll only light up for you from now on.", r: "Only for me? That's a lot of lighting up. You'll have to practise. Practise on me. Now. Yes. Like that." },
      ] },
      { tone: 'flirty', t: "You know nobody else gets the real smile.", r: "The real smile? Show me. Yes. That one. Okay, they definitely didn't get that one. I feel better. Sort of.", opts: [
        { tone: 'cold', t: "Don't be dramatic.", r: "Dramatic? I've been sick with it for two days and I'm telling you kindly. That's the opposite of dramatic." },
        { tone: 'passive', t: "Sort of? What would make it all the way better?", r: "Tell me I'm the one you want. Just once, clearly. Then I'll let it go. I promise I'll let it go." },
        { tone: 'risque', t: "Let me give you the real smile all night, then.", r: "All night. Just me and the real smile. Take me somewhere quiet and show me. I want all of it." },
        { tone: 'flirty', t: "You get the real smile and every one after it.", r: "Every one after it? That's a lifetime of smiles. Oh, I'm all right now. More than all right." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 5: the ten seconds
  { id: 'emotional-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "Can I tell you what's in my head? In a race the camera lost your car for ten seconds and I couldn't breathe. Then you went cold on me.",
    opts: [
      { tone: 'cold', t: "It's racing. You knew the risks.", r: "I knew. Knowing doesn't help at three in the morning. I'm not asking you to stop. I'm asking you to hold me.", opts: [
        { tone: 'cold', t: "I can't fix that for you.", r: "I didn't ask you to fix it. I asked you to hold it with me. You won't. Okay. I'll hold it alone. It's heavy." },
        { tone: 'passive', t: "Sorry. I know it's hard watching.", r: "It is. Every lap. I'm so proud and so scared at once. Just... always come home. That's all I want." },
        { tone: 'flirty', t: "Come here. I'll always come back to you.", r: "Always? Promise me. Out loud. Oh... you did. Okay. I'm holding on to you until my heart calms down." },
      ] },
      { tone: 'passive', t: "I'm here. I'm okay. Ten seconds is nothing.", r: "Ten seconds is forever when it's you out there. I watched the screen till my eyes stung. Come home. Always.", opts: [
        { tone: 'cold', t: "I always come home. Stop worrying.", r: "I can't just stop. That's not how worry works. Not mine. You could hold my hand instead of saying that." },
        { tone: 'passive', t: "I always will. That's a promise.", r: "A promise. I'll keep it in the notebook. I'll reread it every race. Thank you. My chest is unknotting." },
        { tone: 'flirty', t: "Then I'll wave at every camera, just for you.", r: "Every camera? You'll look ridiculous. I'll love it. Wave at me. I'll be the one sobbing and clapping." },
      ] },
      { tone: 'flirty', t: "Couldn't breathe? Breathe now. I'm right here.", r: "I'm breathing. Slowly. You're right here. The tears are right there. I've held them in all week. Hold me?", opts: [
        { tone: 'cold', t: "Let's not make it a scene.", r: "A scene? I'm scared of losing you. That's not a scene. That's my heart. I'm going to cry somewhere else." },
        { tone: 'passive', t: "Of course. Come here. You're okay.", r: "I'm okay. You're okay. We're okay. Say it with me. That's better. Don't let go just yet." },
        { tone: 'risque', t: "Let me stay tonight. You can hear me breathe all night.", r: "All night, my head on your chest, hearing you breathe. Yes. Nothing else in the world. Just you. Stay." },
        { tone: 'flirty', t: "Breathe with me. In. Out. Now kiss me.", r: "In. Out. And... oh. That helped more than breathing. Do that every race weekend. Before and after." },
      ] },
    ] },
  { id: 'emotional-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "I need to say a fear out loud so it shrinks. In a race the camera lost you for ten seconds. I couldn't breathe. What if one day...",
    opts: [
      { tone: 'cold', t: "Don't go there.", r: "I have to go there. It's where my mind goes. I'm not asking you to quit. I'm asking you to let me be scared.", opts: [
        { tone: 'cold', t: "Be scared quietly, then.", r: "Quietly. That's the loneliest thing you could ask me. I'll do it. I won't pretend I'm fine with it." },
        { tone: 'passive', t: "Okay. Be scared. I'm listening.", r: "Thank you. Just letting me say it makes it lighter. I'm so proud of you. And so scared. Both, always." },
        { tone: 'flirty', t: "Go there. Then come back here, to me.", r: "To you. Yes. That's the way back. You. Oh, I'm better already. You're very good at this, you know." },
      ] },
      { tone: 'passive', t: "Nothing's going to happen. I'm careful.", r: "I know you are. I just need to hear you say you'll come home. Every time. Even if it's silly to ask.", opts: [
        { tone: 'cold', t: "It is silly.", r: "Okay. Silly. I'll stop asking. I'll keep wondering. You've made me feel foolish for caring this much." },
        { tone: 'passive', m: 3, t: "I'll come home. Every time. I promise.", r: "Every time. I'm writing it down. With the date. So I can read it on race days when the camera cuts away." },
        { tone: 'flirty', t: "I'll come home. You're why I drive back so fast.", r: "Why you drive back fast? That's the most romantic thing about racing anyone's ever said to me." },
      ] },
      { tone: 'flirty', t: "What if one day I'm a hundred and still racing you to the sofa?", r: "A hundred! You've made me laugh through it. Okay. A hundred, and you still come home. Promise?", opts: [
        { tone: 'cold', t: "I'm not making promises like that.", r: "Okay. No promises. I'll just hope, then, like I always do. Loudly. Alone. It hurt that you wouldn't." },
        { tone: 'passive', t: "I promise. A hundred and slow.", r: "I'll hold you to that. I'll hold you, too. Every race. Before and after." },
        { tone: 'risque', t: "Promise. Now let me take your mind off it.", r: "Take my mind off... yes. You're very good at that. Let's go home. Make me forget everything but you." },
        { tone: 'flirty', t: "Promise. And you'll still cry at my podiums.", r: "At a hundred! In a little hat! I love that. I love that so much. A hundred, and you, and me crying." },
      ] },
    ] },
  { id: 'emotional-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "Hold me a second? In a race the camera lost you for ten seconds and I stopped breathing. You're here now. I just need to feel it.",
    opts: [
      { tone: 'cold', t: "You're being dramatic. I was fine.", r: "I know you were fine. I wasn't. I'm not asking you to fix it. Just hold me for ten seconds. Equal and opposite.", opts: [
        { tone: 'cold', t: "I'm not doing this right now.", r: "Okay. Not now. Not with me. I'll hold myself, then. You should know that hurt worse than the ten seconds." },
        { tone: 'passive', t: "Sorry. Come here. Ten seconds.", r: "One... two... you're counting slowly on purpose. Nine. Ten. Eleven. Don't stop at ten. Please." },
        { tone: 'flirty', t: "Ten seconds? You'll get ten minutes.", r: "Ten minutes? You're squeezing me so tight. I can feel your heart. It's steady. Mine's catching up." },
      ] },
      { tone: 'passive', t: "Come here. I'm here.", r: "You're here. Warm. Solid. Breathing. Forgive me for being like this. Every race I give you my whole heart to carry.", opts: [
        { tone: 'cold', t: "That's a lot to carry.", r: "It is. I'll take some of it back if it's too heavy. I didn't know you were counting the weight." },
        { tone: 'passive', t: "I'll carry it. Every race.", r: "Every race. Thank you. It's in good hands. Your hands. I trust them. I just need reminding, sometimes." },
        { tone: 'flirty', t: "I like carrying it. It's light.", r: "Light? My heart? It's the heaviest thing I own. You're lying. You're lying beautifully. I'll let you." },
      ] },
      { tone: 'flirty', t: "Feel it, then. Hand here. My heart. Still beating.", r: "Still beating. Fast, too. Is that me? I've done that? Okay. I'm not scared now. Not right now.", opts: [
        { tone: 'cold', t: "It's fast from the race, not you.", r: "Oh. The race. I wanted it to be me. You could have let me have it. Tonight I needed to have it." },
        { tone: 'passive', t: "Both. The race and you.", r: "Both. I'll take both. I'll share with the race. It can have the start. I want the after." },
        { tone: 'risque', t: "That's you. Want to feel it race all night?", r: "All night, my hand on your heart. Yes. Take me home. I want to fall asleep counting your heartbeats." },
        { tone: 'flirty', t: "That's all you. Every time.", r: "Every time. I'm keeping my hand there. I'm never moving. They'll have to race around me." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 6: the unsent letters
  { id: 'emotional-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "There's a box of letters I've never sent. Some are to you. I nearly gave you one, but after last time... I wasn't sure you'd want it.",
    opts: [
      { tone: 'cold', t: "Unsent letters? That's a bit sad.", r: "Sad? They're where I put the things too big to say. I thought you might want to read one. Maybe I was wrong.", opts: [
        { tone: 'cold', t: "Keep them in the box.", r: "Okay. They'll stay with all the other things I was too scared to give. You've made the box heavier." },
        { tone: 'passive', t: "Sorry. I would want one. If you're ready.", r: "You would? Okay. Here. It's from a while ago. Read it later, not in front of me. I'll go pink and fall over." },
        { tone: 'flirty', t: "Give me one. I want to know what you couldn't say.", r: "What I couldn't say... okay. Here. It's in the very first line. Oh, don't read it now. Later. Please." },
      ] },
      { tone: 'passive', t: "I'd want it. What's in the box?", r: "Letters to my gran, to old friends, to the version of me who was sad. And lately, mostly, to you.", opts: [
        { tone: 'cold', t: "That's a lot of letters to me.", r: "It is. You make me feel a lot. I'm sorry if that sounds heavy. To me it sounds like the truth. Ouch." },
        { tone: 'passive', t: "Can I read one? Only if you want.", r: "Only if I want? That's why I'll let you. Here. The one with the folded corner. Read it tonight. Alone." },
        { tone: 'flirty', t: "Mostly to me? What do they say?", r: "That I miss you when you're in the next room. That I'm scared. That you're the best thing. Here. Read one." },
      ] },
      { tone: 'flirty', t: "Letters to me? Hand one over. Now.", r: "Now? You're so bossy when you want something. Okay. Here. It's the first one I wrote. It's... a lot.", opts: [
        { tone: 'cold', t: "Maybe I won't read it.", r: "Then give it back. No, keep it. Read it when you're kinder. It's been in my box for months. It can wait." },
        { tone: 'passive', t: "I'll read it tonight. Properly.", r: "Properly. In a quiet room, with nothing else on. Then tell me how you felt. I'll be awake. I'm always awake." },
        { tone: 'risque', t: "Read it to me tonight, in bed.", r: "In bed, out loud, in the dark? Yes. I'll whisper every word against your shoulder. Stay tonight." },
        { tone: 'flirty', t: "A lot is my favourite amount.", r: "Your favourite amount? Then you'll love it. There are thirty more where that came from. Thirty-one. Thirty-two." },
      ] },
    ] },
  { id: 'emotional-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "I have a box of letters I never sent. To people, to places, to old versions of me. Lately they're all to you. I want to give you one.",
    opts: [
      { tone: 'cold', t: "Why not just say it?", r: "Because some things are too big to say. Letters let me be brave slowly. I'm sorry that's not good enough.", opts: [
        { tone: 'cold', t: "It's not. Just talk to me.", r: "I do talk to you. All the time. This is the bit that's too big. You won't take it. Okay. Back in the box." },
        { tone: 'passive', t: "Sorry. I'd love to read one.", r: "Here. The top one. I wrote it the night we first met. Don't laugh at the spelling. I was crying." },
        { tone: 'flirty', t: "Then be brave slowly, with me. Hand it over.", r: "Slowly. With you. Okay. Here it is. My hands won't keep still. Read it, and come and find me after." },
      ] },
      { tone: 'passive', t: "I'd love that. Which one?", r: "This one. I wrote it when I was scared you'd leave. You didn't. I want you to read what I was scared of.", opts: [
        { tone: 'cold', t: "That sounds heavy.", r: "It is heavy. I'm giving you something heavy because I trust you with it. You don't have to want it. It hurts if you don't." },
        { tone: 'passive', t: "I'll read it. And I'll still be here after.", r: "Still here after. That's what I needed to hear before I let go of it. Okay. It's yours now." },
        { tone: 'flirty', t: "I'll write you one back.", r: "You'd write me one? By hand? I'd keep it in the box, at the very top. I'd read it every race day." },
      ] },
      { tone: 'flirty', t: "All to me? I want every single one.", r: "Every one? That's thirty-two letters! Some are very embarrassing. One is just your name, forty times.", opts: [
        { tone: 'cold', t: "Forty times? Steady on.", r: "I was a bit much that night. I wanted you to find it sweet. I'll keep that one for myself, then." },
        { tone: 'passive', t: "Start with the first. I'll read them in order.", r: "In order. Like a story. Our story. Okay. The first one. Here. I'll make you a cup of tea for the second." },
        { tone: 'risque', t: "Read me the forty-names one. Slowly. In bed.", r: "In bed, slowly, all forty? You'll have to stop me after ten. Or not. Stay. Let me try." },
        { tone: 'flirty', t: "Write it forty-one times. I'll sign the last one.", r: "Sign it? Then it's a contract. A forty-one-name contract. I'm laughing and I'm so in... so happy." },
      ] },
    ] },
  { id: 'emotional-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "I've got a secret box. Letters I never sent. Thirty-two of them are to you. Tonight I'm finally brave enough to give you one.",
    opts: [
      { tone: 'cold', t: "Thirty-two? You should get out more.", r: "I get out. I just feel a lot when I'm home. I thought you'd be touched. You're... not. I'll keep them.", opts: [
        { tone: 'cold', t: "Keep them.", r: "I will. All thirty-two. I'll add a thirty-third, about tonight. It won't be a happy one. Goodnight, {me}." },
        { tone: 'passive', t: "Sorry. That was a cheap dig. I'd like one.", r: "Well, it landed. But okay. Here. The one with the pressed daisy inside. Gentle with it." },
        { tone: 'flirty', t: "Thirty-two? I'm honoured. Give me the best one.", r: "The best one is the scariest one. It says what I haven't said out loud yet. Read it tonight. Then come back." },
      ] },
      { tone: 'passive', t: "Which one are you giving me?", r: "The one I wrote after a race of yours. I watched you cross the line and wrote four pages. Here.", opts: [
        { tone: 'cold', t: "Four pages about a race?", r: "About you, in a race. About being proud enough to cry. You've made it sound like a report. It wasn't." },
        { tone: 'passive', t: "Four pages. I'll read every word.", r: "Every word? Even the crossed-out ones? Those are the truest. Read those twice. Then come and hold me." },
        { tone: 'flirty', t: "Read me the first line. Just one.", r: "The first line... 'I think I'd follow you anywhere, even a pit lane.' That's all you get. Oh, I'm red." },
      ] },
      { tone: 'flirty', t: "Brave enough? Then I'll be brave enough to read it here.", r: "Here? In front of me? I'll combust. Okay. Fine. Read it. I'll hide behind my hands like at your starts.", opts: [
        { tone: 'cold', t: "Actually, it's a bit embarrassing. Later.", r: "Oh. Later. You were brave for five seconds and then you weren't. I'll take it back for now. It stings." },
        { tone: 'passive', t: "Okay. I'm reading. You can peek.", r: "I'm peeking. You're smiling. Now you're not smiling, you're... oh, you're welling up. Umbrella? No, real." },
        { tone: 'risque', t: "I'll read it. Then I'll answer it. Not in words.", r: "Not in words? Then answer it slowly. I've waited thirty-two letters for this. Take me home." },
        { tone: 'flirty', t: "I've read it. Come here. I've got a reply.", r: "A reply? What does it... oh. That's the reply. That's a very good reply. Write that down. No, do it again." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 7: the window seat
  { id: 'emotional-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "I've been dreaming about a future. A little house, a window seat for rainy days. Then last time happened and I got scared to dream it.",
    opts: [
      { tone: 'cold', t: "That's very far ahead.", r: "It is. I'm a far-ahead person. I don't need you there yet. I just needed to know you might want to be.", opts: [
        { tone: 'cold', t: "I don't think that far.", r: "Okay. Then I'll dream it alone for now. It's a smaller house without you. I'm sad, and I'm saying so." },
        { tone: 'passive', t: "I might want to be. Tell me about the window seat.", r: "Deep enough for two. Cushions. Rain on the glass. Me reading, you asleep on my legs. Too much?" },
        { tone: 'flirty', t: "Keep dreaming. Put me in the window seat.", r: "You in the window seat. Oh... the dream just got so much brighter. I'll make room. It's a wide seat." },
      ] },
      { tone: 'passive', t: "Don't be scared. Describe it to me.", r: "A small house. Somewhere it rains. A window seat for two. My cat, being rude to you. You, home between races.", opts: [
        { tone: 'cold', m: -3, t: "Sounds a bit cramped.", r: "Cramped? It's cosy. It's where I'd keep us. You've stepped into my dream with muddy boots. I felt that." },
        { tone: 'passive', t: "That sounds nice. Really nice.", r: "Really nice? Then I'll keep dreaming it. In more detail. Expect paint samples. I'm joking. Mostly." },
        { tone: 'flirty', t: "And a garage for my car. And a big bed.", r: "A big bed and a window seat. You've thought about this! We're dreaming the same house. I'm so happy." },
      ] },
      { tone: 'flirty', t: "A window seat? I'm already in it. In my head.", r: "Already in it? With me? With the rain coming down? Oh... you've been dreaming it too. Tell me what you see.", opts: [
        { tone: 'cold', t: "Mostly I see the rent.", r: "The rent. You made a joke of the softest thing I've told you. I'll laugh later, maybe. Not tonight." },
        { tone: 'passive', t: "You, a book, rain, and me pretending to read.", r: "Pretending to read! Watching me instead? That's exactly my dream. Exactly. How did you know?" },
        { tone: 'risque', t: "You in my jumper, and me pulling you down onto the cushions.", r: "Onto the cushions, with the rain going... yes. That's the best room in the house now. Dream it with me tonight." },
        { tone: 'flirty', t: "You. Every rainy day. For years.", r: "Every rainy day, for years. I'm going to start praying for rain. Oh, I'm so in this. I'm so in this with you." },
      ] },
    ] },
  { id: 'emotional-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "Can I tell you a daydream? A little house where it rains a lot. A deep window seat. You coming home from races. Me, waiting, happy.",
    opts: [
      { tone: 'cold', t: "Waiting isn't much of a life.", r: "It's not just waiting. It's having somewhere you come back to. I thought that's what you'd want. Maybe not.", opts: [
        { tone: 'cold', t: "Probably not.", r: "Okay. I'll fold the dream up small. I'll still have it. I just won't say it out loud anymore. That's sad." },
        { tone: 'passive', t: "Sorry. I didn't mean that. Tell me more.", r: "A lamp in the window on race nights. So you'd see it from the road. Like a lighthouse. For you." },
        { tone: 'flirty', t: "Then come with me sometimes. And wait in the window the rest.", r: "To races, sometimes? And the window the rest? Oh, that's the best version. You made it better." },
      ] },
      { tone: 'passive', t: "That's sweet. Where would it be?", r: "Somewhere green. Near the sea, maybe. Rain on the roof. A lamp in the window so you can find your way home.", opts: [
        { tone: 'cold', t: "I'd get lost anyway.", r: "You wouldn't. I'd make sure of it. You've made my lighthouse into a joke. I'll keep the lamp lit anyway." },
        { tone: 'passive', t: "Near the sea sounds perfect.", r: "It does, doesn't it? We could walk on the beach after a bad race. And after a good one. Every one." },
        { tone: 'flirty', t: "I'd find my way home to you in the dark.", r: "In the dark. With the lamp on. I need to write that down before it melts. I'll keep the light on forever." },
      ] },
      { tone: 'flirty', t: "And when I come home, what happens?", r: "I run to the door. I'm in socks. I slip. You catch me. We both laugh. That's the whole dream, really.", opts: [
        { tone: 'cold', t: "You'd probably cry, too.", r: "I cry when I'm happy. You know that. You've said it like a flaw tonight. It isn't one." },
        { tone: 'passive', t: "I like that dream.", r: "You like it? Then it's not just mine. It's ours. A shared dream. That's the first step to a real one." },
        { tone: 'risque', t: "And then I carry you upstairs.", r: "Upstairs. Oh... the dream just got a second floor. Yes. Carry me. Don't let me walk. Not tonight either." },
        { tone: 'flirty', t: "I catch you. And I never let go.", r: "Never let go. Even when the socks are dry? Even when we're old? I'm going to cry on you. Sorry." },
      ] },
    ] },
  { id: 'emotional-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "I found us a house. Kidding! Sort of. I've been dreaming one. Rainy days, a window seat, you coming home to me. Can I keep dreaming it?",
    opts: [
      { tone: 'cold', t: "Slow down. We're not there.", r: "I know we're not. I said I was dreaming. Dreams don't have to be ready. You made mine feel silly.", opts: [
        { tone: 'cold', t: "It is a bit silly.", r: "Okay. Silly. I'll stop dreaming out loud. I'll keep the window seat in my head, alone. It hurts." },
        { tone: 'passive', t: "Sorry. Dream it. I'm just slow at this.", r: "Slow is okay. I'll dream for us both till you catch up. I'll leave you a cushion in the window seat." },
        { tone: 'flirty', t: "Dream it. I'll catch up. I'm fast.", r: "You are fast. The fastest. Okay. I'll dream ahead and you'll overtake me one day. Deal." },
      ] },
      { tone: 'passive', t: "Keep dreaming. What else is in it?", r: "Boots by the door. Rain drumming overhead. A lamp lit in the window on race nights, so you see it from the road.", opts: [
        { tone: 'cold', t: "Sounds like a postcard.", r: "A postcard. It's my heart, but sure. A postcard. I'll put it in the box with the letters I never send." },
        { tone: 'passive', t: "The lamp is a nice touch.", r: "It's the most important bit. A light on for you. Always. Whatever happens on track. You'll always see it." },
        { tone: 'flirty', t: "Two sets of boots. Muddy ones are mine.", r: "Two sets. Yours muddy, mine with daisies. Noting this. You've furnished the hallway." },
      ] },
      { tone: 'flirty', t: "Keep dreaming. Add a big kitchen. I'll cook.", r: "You'll cook? I'll cry into the soup. It'll be a very salty kitchen. I adore this. I love you in it.", opts: [
        { tone: 'cold', t: "Actually, I'd order in.", r: "Order in. That's fine. It's just... I was building something and you knocked a wall out. I felt it." },
        { tone: 'passive', t: "And a garden. For flowers.", r: "A garden. I'd press a flower from it every good day. Flat and safe, the way my gran taught me." },
        { tone: 'risque', t: "And a door that locks. For rainy afternoons.", r: "A door that locks, rain on the window, and you. That's the best room. Show me tonight. Practise." },
        { tone: 'flirty', t: "And you in it. That's the main thing.", r: "Me in it. And you. That's the whole house, really. The rest is just walls. I'm so happy I could float." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 8: enough
  { id: 'emotional-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "Can I ask something that scares me? After last time I keep wondering: am I enough for you? Or too much? I've been called that before.",
    opts: [
      { tone: 'cold', t: "Sometimes you're too much.", r: "Sometimes. Well, you answered. I'm going to need a long time with that word. It's an old bruise.", opts: [
        { tone: 'cold', t: "You asked.", r: "I did. I asked because I trusted you with the answer. I'll go now. I'm not angry. I'm just very, very hurt." },
        { tone: 'passive', t: "Wait. You're a lot, but I want a lot.", r: "You want a lot? That's different. That's very different. I can breathe again. Thank you." },
        { tone: 'flirty', t: "Too much in the best way. I wouldn't have you less.", r: "You wouldn't have me less. I'm going to hold on to that for years. Come here. Please." },
      ] },
      { tone: 'passive', m: 3, t: "You're enough. More than enough.", r: "More than enough. Someone once called me too much, then walked away. I've been waiting for you to say it too.", opts: [
        { tone: 'cold', t: "I'm not them. Stop comparing.", r: "I'm not comparing. I'm scared. Those are different. You could have just held me. You didn't. I noticed." },
        { tone: 'passive', t: "Never going to say it. I'm staying.", r: "Staying. Tell me again tomorrow? And the day after? It's a big ask. I need it." },
        { tone: 'flirty', t: "You're enough. And when you're too much, I'm still here.", r: "Still here when I'm too much. That's... I think that's love. That's what it is. I'm falling apart. Catch me." },
      ] },
      { tone: 'flirty', t: "Enough? You're everything.", r: "Everything? Only say it if it's true. I'll believe you. I'll build my life on it. Do you mean it?", opts: [
        { tone: 'cold', t: "Okay, maybe not everything.", r: "Not everything. You lifted me up and let go. I'll find my own way down. It hurts so much, {me}." },
        { tone: 'passive', t: "I mean it. You're enough. Always.", r: "Always. I'll write it on the inside of my wrist. I'll read it on bad days. I'm enough. Thank you." },
        { tone: 'risque', t: "I mean it. Let me show you how much you're enough.", r: "Show me. Slowly. Until I believe it. Until I stop asking. Stay tonight, and make me sure." },
        { tone: 'flirty', t: "Every word. You're my everything.", r: "Your everything. I'm keeping that forever. In the notebook, on my heart, everywhere. I'm yours." },
      ] },
    ] },
  { id: 'emotional-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "I've had a three a.m. fear. That one day you'll wake up and I'll be too much. Or not enough. I've been told both before.",
    opts: [
      { tone: 'cold', t: "Three a.m. fears aren't real.", r: "They feel real at three a.m. That's when I need you most. You just made it lonelier. I wanted a hand.", opts: [
        { tone: 'cold', t: "I can't fix your nights.", r: "I'm not asking you to fix them. I'm asking you to be in them. You won't. I'll lie awake alone again." },
        { tone: 'passive', t: "Sorry. Tell me. What do you need?", r: "To hear that you're not leaving. That you choose me. Out loud, slowly. Then three a.m. goes quiet." },
        { tone: 'flirty', t: "Then call me at three a.m. I'll tell you myself.", r: "You'd answer? At three? I'd call. I'd just breathe at you. That would be enough. You'd be enough." },
      ] },
      { tone: 'passive', m: 3, t: "Not too much, not too little. Just you.", r: "I'm me. And that's okay with you? The crying, the notebook, the double texts, the three a.m.?", opts: [
        { tone: 'cold', t: "Most of it.", r: "Most of it. Okay. I'll try to hide the rest. I don't want to, but I'll try. That landed somewhere tender." },
        { tone: 'passive', t: "All of it. Especially the notebook.", r: "Especially the notebook! I'm laughing and I've got tears on my face. Both. Very me. Thank you." },
        { tone: 'flirty', t: "All of it. I fell for all of it.", r: "You fell for all of it. With your eyes open? I'm going to remember this for the rest of my life." },
      ] },
      { tone: 'flirty', t: "Wake up and you're too much? I wake up hoping you are.", r: "Hoping I am? Nobody's ever hoped for more of me. Everyone's always wanted less. Say it again, please.", opts: [
        { tone: 'cold', t: "Once is plenty.", r: "Once. I need more than once. You know I do. You chose not to. I'll go and lie awake about that." },
        { tone: 'passive', t: "I'll say it every morning. You're enough.", r: "Every morning. I'll set my alarm by it. 'You're enough.' I'm so lucky I could burst into tears. I am." },
        { tone: 'risque', t: "I'll say it every night too. Right in your ear.", r: "Right in my ear, every night, in the dark. Yes. That's how I'll believe it. Stay. Start tonight." },
        { tone: 'flirty', t: "Too much is the right amount of you.", r: "Too much is the right amount. That's going above my bed. In big letters. You've mended something old in me." },
      ] },
    ] },
  { id: 'emotional-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "Tell me something true? I'm scared I'm not enough for you. Or too much. Somebody once told me I was too much. I still hear it.",
    opts: [
      { tone: 'cold', t: "You need to let that go.", r: "I'm trying. It's not that easy. You telling me to let go doesn't help. Holding on to me would.", opts: [
        { tone: 'cold', t: "I can't hold you every time.", r: "Not every time. Just this time. Tonight. You won't, and I'll remember that you wouldn't. That's the hurt." },
        { tone: 'passive', t: "Sorry. You're right. Come here.", r: "Here. Oh. Your arms are the answer. They're always the answer. I'm sorry I keep asking the question." },
        { tone: 'flirty', t: "Let it go and replace it. 'You're exactly enough.'", r: "Exactly enough. Replace the old voice with yours. Yes. Say it again so I learn it by heart." },
      ] },
      { tone: 'passive', m: 3, t: "Here's something true: you're enough. I promise.", r: "You promise? I believe promises. That's why it matters who makes them. You're a good one to make it.", opts: [
        { tone: 'cold', t: "Don't make me responsible for your fears.", r: "I'm not. I just asked for a promise. I'm sorry it felt like a weight. It felt like a gift when I asked." },
        { tone: 'passive', t: "Enough. Today, tomorrow, after every race.", r: "After every race. Win or lose. That's the sweetest thing. I'll be enough after every race. Okay." },
        { tone: 'flirty', t: "You're enough. And you're mine. Two true things.", r: "Two true things. Enough, and yours. I'll put them side by side in the notebook. They look perfect together." },
      ] },
      { tone: 'flirty', t: "Something true? I can't imagine wanting anyone else.", r: "Anyone else? Not anyone? That's the opposite of too much. That's just right. I'm wobbling.", opts: [
        { tone: 'cold', t: "Easy. I said imagine.", r: "Imagine. I heard it as forever, and you meant a passing thought. I'll come back down. It's a long way." },
        { tone: 'passive', t: "Not anyone. You're the only one I want.", r: "The only one. I'll press it in the notebook like a flower. Thank you for saying it." },
        { tone: 'risque', t: "Nobody else. Let me prove it, slowly, all night.", r: "All night, slowly, until I believe it in my bones. Yes. Take me home and stay." },
        { tone: 'flirty', t: "Just you. Too much, perfectly.", r: "Too much, perfectly. My new favourite phrase. I'm going to stitch it on a cushion for the window seat." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 9: I love you (chapter end)
  { id: 'emotional-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "Even after last time, before I lose my nerve: I love you. My notebook's full. I bought a new one, for us. Do you want it?",
    opts: [
      { tone: 'cold', m: -4, t: "I'm not ready to say that back.", r: "You don't have to say it back. I just couldn't hold it in. I'll keep the new notebook blank. For now.", opts: [
        { tone: 'cold', t: "Keep it blank.", r: "Blank. Okay. I said the biggest thing I've ever said, and it's going on a shelf. That hurts more than anything." },
        { tone: 'passive', t: "Not ready yet. But I'm not leaving.", r: "Not leaving. That's enough for tonight. I'll write 'not yet' on page one. 'Not yet' still has hope in it." },
        { tone: 'flirty', t: "Not ready to say it. But I'll write it. Give me the pen.", r: "Write it? On page one? You're writing. You're writing it. I can't look. I'm looking. I love you." },
      ] },
      { tone: 'passive', m: 4, t: "I love you too. I should've said it sooner.", r: "You love me. You said it. Oh, I'm going to need a minute. And a tissue. And you. Mostly you.", opts: [
        { tone: 'cold', t: "Let's not make a fuss.", r: "Not a fuss? It's the biggest thing! Okay. Quietly. I'll fuss inside. I wish you'd let me fuss out loud." },
        { tone: 'passive', t: "Page one, then. What do we write?", r: "'Day one, again. They said it back.' And the date. And both our names. Your handwriting and mine." },
        { tone: 'risque', t: "Let's write page one tomorrow. Tonight, stay with me.", r: "Tonight. Yes. Page one can wait till morning. I love you. I'm going to say it till we fall asleep." },
        { tone: 'flirty', t: "I love you. Say it again so I hear it twice.", r: "I love you. I love you. I love you. Three, for luck. I'm crying all over the new notebook. Perfect." },
      ] },
      { tone: 'flirty', t: "Want it? I've waited for this. I love you, too, you know.", r: "You love me too? Oh. Oh. The tears are on your shirt now. I'm sorry. I'm not sorry.", opts: [
        { tone: 'cold', t: "Okay, okay. Calm down.", r: "Calm down? You love me! You mean it, though? You said 'calm down' like it was too much. Was it?" },
        { tone: 'passive', t: "Cry. I'll hold you.", r: "Hold me. This is it. This is the moment I'll tell everyone about forever. The night they said it back." },
        { tone: 'risque', t: "Come here. Let's start the new notebook properly.", r: "Properly? Yes. Let's not write a single word tonight. Let's just be the first page. I love you." },
        { tone: 'flirty', t: "I love you. Page one is yours to write.", r: "Mine? Then it says 'I love you, and they love me back'. In my best handwriting. With a pressed flower." },
      ] },
    ] },
  { id: 'emotional-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "My notebook's full, every page since we met. So there's a new one, for us. The first page is blank. I love you. That's what I'd write.",
    opts: [
      { tone: 'cold', t: "That's a big thing to say.", r: "It's the biggest. I've held it for weeks. You're not obliged to say it back. I hoped you'd be gentler with it.", opts: [
        { tone: 'cold', t: "I'm not saying it back.", r: "Okay. I heard you. I'll keep loving you anyway, quietly, for a while. Then I'll see. It hurts like nothing has." },
        { tone: 'passive', t: "I'm sorry. I'm overwhelmed. Give me a moment.", r: "Take all the moments you need. I'll sit right here. The notebook can wait. I can wait. I'm good at it." },
        { tone: 'flirty', t: "Big. So here's a big answer: I love you.", r: "After making me wait a whole second? I'm going weak at the knees. I love you. I love you. Hold the notebook." },
      ] },
      { tone: 'passive', m: 4, t: "I love you back. Let's write it together.", r: "Together. Your hand on the pen with mine. 'Page one: us.' It looks so small for something so big.", opts: [
        { tone: 'cold', t: "It's just a notebook.", r: "It's not just a notebook. It's where I keep what matters. You know that. You've made page one feel smaller." },
        { tone: 'passive', t: "Small is how all the big things start.", r: "Small is how big things start. That's going on page two. You're better with words than you think." },
        { tone: 'risque', t: "Page one can wait. Come to bed.", r: "Come to bed. Yes. I love you. Page one will be about tonight anyway. I'll write it in the morning, slowly." },
        { tone: 'flirty', t: "Page one: 'I love you.' Page two: 'I mean it.'", r: "Page two: 'I mean it.' I'm going to read those two pages every day for the rest of my life." },
      ] },
      { tone: 'flirty', t: "Hold that pen. I want to say it first.", r: "You first? Then you say it, and I write it. Say it. Oh. You said it. I'm writing. My hand's shaking so much.", opts: [
        { tone: 'cold', t: "Let's not be cheesy about it.", r: "Cheesy? It's the truest thing in me. I'll write it plainly, then. Without the heart. It looks so lonely." },
        { tone: 'passive', t: "Your handwriting's perfect. Leave it shaky.", r: "Shaky and true. That's us. Page one done. I love you. I'll love you on every page." },
        { tone: 'risque', t: "Now put the pen down and let me love you back.", r: "Pen down. Yes. I love you. Turn off the lamp. No, leave it on. I want to see your face. Stay." },
        { tone: 'flirty', t: "Write it big. With hearts. Lots of hearts.", r: "Lots of hearts. Here. A pressed daisy. A tear, a happy one. Page one is perfect. You're perfect. I love you." },
      ] },
    ] },
  { id: 'emotional-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "I love you. There. I've said it. I've been bursting for weeks. My notebook's full of you, so I bought a new one. For us. Say something!",
    opts: [
      { tone: 'cold', t: "I don't know what to say.", r: "You don't know? Oh. I'll be okay. I'll be okay. I just said the biggest thing in me and the room went quiet.", opts: [
        { tone: 'cold', t: "Give me time. Don't push.", r: "I won't push. I'll sit with my blank notebook and my heart in my hands. It's very cold out here." },
        { tone: 'passive', t: "Sorry. I'm stunned. Happy-stunned. I love you, as well.", r: "Happy-stunned! Oh, thank goodness. I nearly melted into the floor. You love me back. Say it slower." },
        { tone: 'flirty', t: "Say something? I'll do better. I'll write it.", r: "On page one? In your own hand? 'I love you too.' It's crooked and it's the best thing I own." },
      ] },
      { tone: 'passive', m: 4, t: "I love you. I've known for a while.", r: "For a while? And you didn't tell me? I'm going to cry about the days I didn't know. Then celebrate. Both.", opts: [
        { tone: 'cold', t: "I was waiting for the right time. This wasn't it.", r: "Not the right time? I said I love you. Is there a wrong time for that? I thought... it stings, honestly." },
        { tone: 'passive', t: "Celebrate. Then let's write page one.", r: "Page one. 'They knew for a while.' I'm going to tease you about that forever. Forever. That's the plan." },
        { tone: 'risque', t: "Celebrate with me. Tonight. Somewhere with a door that closes.", r: "A door that closes. Yes. Take me home. I want to fall asleep saying it and wake up saying it. I love you." },
        { tone: 'flirty', t: "I'll make it up to you. One 'I love you' for every day I didn't.", r: "Every day? That's a lot of them. Start now. Don't stop. That's six. Seven. I love you. Keep going." },
      ] },
      { tone: 'flirty', t: "I love you. Now give me the pen. Page one is mine.", r: "Yours? You're snatching it. What are you writing? Let me see. 'Day one. Again. Forever.' Oh, {me}.", opts: [
        { tone: 'cold', t: "Don't read it yet.", r: "Okay. I'll wait. You've got your hand over it. You're shutting me out of our own page. It hurts a little." },
        { tone: 'passive', t: "Your turn. Write page two.", r: "Page two: 'I'm the luckiest person alive.' And a pressed flower. And our names. In the same ink." },
        { tone: 'risque', t: "That's page one. Page two we write in the dark.", r: "In the dark... yes. Page two is ours alone. I'll never write it down. I'll just remember it. Stay." },
        { tone: 'flirty', t: "Forever. I mean it. You're my favourite story.", r: "Your favourite story. And you're mine. Every chapter. I love you. I'll love you to the very last line." },
      ] },
    ] },
];
