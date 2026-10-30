// Sunny (SWEET) - in person, stage 'close': dating. 9 story slots x 3 opening moods.
export const DATA = [
  // ===================================================================== CLOSE 1: hi, you - I hugged your hoodie
  { id: 'sunny-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "Hi, you. I've still got your hoodie. I wore it all week, even after last time. I'm not giving it back. I'm just a bit sad in it.",
    opts: [
      { tone: 'cold', t: "You can give it back, actually.", r: "Oh. Right. Okay. I'll wash it first. It smells of my shampoo now. I didn't think you'd want it back like this.", opts: [
        { tone: 'cold', t: "Just bring it next time.", r: "I will. I'll fold it nicely. I'll head off, {me}. I don't want to cry in your hoodie. Not here." },
        { tone: 'passive', t: "No, keep it. I'm sorry. I was being petty.", r: "Petty's allowed, once. Thank you for taking it back. The hoodie and I accept. We're both relieved." },
        { tone: 'flirty', t: "Keep it. I like the idea of you in it.", r: "Do you? Then I'll keep wearing it. And I'll be slightly less sad in it now. Come here. Hoodie hug." },
      ] },
      { tone: 'passive', t: "Keep it. Last time was me being awful. Why sad?", r: "Because you felt far away, and the hoodie was the closest I could get. I hugged it on the sofa for an hour. Don't laugh.", opts: [
        { tone: 'cold', t: "That's a bit sad, yeah.", r: "It was. That was the point. I wanted you to know, that's all. I'll be okay. I'm going home, {me}." },
        { tone: 'passive', t: "I'm not laughing. I'm sorry I made you feel that.", r: "Thank you. Saying sorry like that fixes so much. Come here. I want a real hug. Not a hoodie one." },
        { tone: 'flirty', t: "Next time hug me. I'm much better than a hoodie.", r: "You are. Warmer. Less fluffy. Better at hugging back. Okay. Here. I've missed you, you menace." },
      ] },
      { tone: 'flirty', t: "You stole my hoodie and you're sad? I should be sad.", r: "You can be sad together with me. In the hoodie. There's room for two. There isn't. We'd make it work.", opts: [
        { tone: 'cold', t: "I'm not in the mood for this.", r: "Okay. Not the mood. I'll stop. I'll take my sad and your hoodie home. We'll talk when you are." },
        { tone: 'passive', t: "Forgive me for before? I'd like it back with you inside it.", r: "With me inside it? That's the sweetest way to say sorry. Okay. Forgiven. Come here. It's a big hoodie." },
        { tone: 'flirty', t: "Two in one hoodie. Let's test it.", r: "Here? Now? We'll fall over. We'll fall over together. That's the most romantic way to fall over." },
        { tone: 'risque', t: "We'd make it work better without the hoodie.", r: "Oh, would we now? Bold. After last time? I'll allow it. Later. Mine. I'll leave the hoodie by the door." },
      ] },
    ] },
  { id: 'sunny-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "Hi, you. Confession: I missed you so much this week I hugged your hoodie on the sofa for an hour. The grey one you left. It's mine now.",
    opts: [
      { tone: 'cold', t: "That's my favourite hoodie.", r: "Oh. Is it? I didn't know. I can give it back. I'm sorry. I thought you'd think it was sweet.", opts: [
        { tone: 'cold', t: "Yeah, I'd like it back.", r: "Okay. I'll bring it. Washed. It's not as fun as I thought it'd be, this. I'll see you, {me}." },
        { tone: 'passive', t: "No, keep it. It's sweet. I'm only teasing.", r: "Teasing! You got me. I was about to fold it with great sadness. Okay. It's mine. Forever now." },
        { tone: 'flirty', t: "Keep it. It looks better on you anyway.", r: "It doesn't! It's enormous. I look like a duvet with a face. But thank you. I'll wear it tomorrow." },
      ] },
      { tone: 'passive', t: "An hour? I missed you too.", r: "You did? Good. I mean, not good, but good. Was it the sort of missing where you keep turning round to tell someone something?", opts: [
        { tone: 'cold', t: "Not really. I was busy.", r: "Oh. Okay. Busy is fine. I know your weeks. I'll keep my turning round to myself. It's fine." },
        { tone: 'passive', t: "Exactly that sort. All week.", r: "Oh, good. The same sort. We're synchronised. I saw a dog in boots and you weren't there. Tragic." },
        { tone: 'flirty', t: "The sort where I stole your pillow back.", r: "My pillow? You took my pillow? You thief. Okay, we're even. We're two thieves. Partners in crime. I like that." },
      ] },
      { tone: 'flirty', t: "An hour with the hoodie? Lucky hoodie.", r: "It's had a very good week. It got hugs and tea spilled on it. It's living its best life. Jealous?", opts: [
        { tone: 'cold', t: "Jealous of a hoodie? No.", r: "No. Right. Silly. I'll stop talking about the hoodie. It's just a hoodie. Sorry, {me}." },
        { tone: 'passive', t: "A bit. Hug me instead now.", r: "Now? Here? Okay. Come here. Oh, you're much better than the hoodie. Sorry, hoodie." },
        { tone: 'flirty', t: "Very jealous. Make it up to me.", r: "How? Oh. I know how. Come here. That's one. Hoodie never got that. That's two. Hoodie's furious." },
        { tone: 'risque', t: "Jealous. Next time skip the hoodie and hug me in bed.", r: "In bed? You're on. I'll put the hoodie in the wardrobe. It doesn't need to see that. Come home soon." },
      ] },
    ] },
  { id: 'sunny-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "Hi, you. I'm wearing your hoodie under my coat. Don't look. You looked. I've worn it every day since you left. It smells like you.",
    opts: [
      { tone: 'cold', t: "You should probably wash it.", r: "Oh. Yes. I suppose. That would ruin it, though. But okay. I'll wash it. That's very practical of you.", opts: [
        { tone: 'cold', t: "And give it back.", r: "Oh. Okay. I didn't know it was a borrowing thing. I'm sorry. I'll bring it, washed. See you, {me}." },
        { tone: 'passive', t: "Sorry. I'm joking. Keep it unwashed. It's yours.", r: "Thank goodness. I was about to do a very sad wash. It's mine now. That's the law of hoodies." },
        { tone: 'flirty', t: "Or I could just give it a fresh smell of me.", r: "Like a refill? That's - okay, that's a great idea. Here. Hug. Refill. You're very clever." },
      ] },
      { tone: 'passive', t: "Every day? You must have really missed me.", r: "So much! I kept telling Dennis things and then remembering he's a fern. Dennis is my fern. I might've said?", opts: [
        { tone: 'cold', t: "You talk to a plant?", r: "I do. I always have. I'm sorry, I thought I'd said. Never mind. It's not important. I'll stop." },
        { tone: 'passive', t: "Same here, honestly. I missed Dennis less.", r: "He'd be so offended. He's sulking anyway. He thinks you should visit more. So do I. Hint, hint." },
        { tone: 'flirty', t: "Tell Dennis I'm back now. You don't need him.", r: "Oh, he'll hear that. He's got big ears. Fronds. Whatever. Come here. You're back. I'm so pleased." },
      ] },
      { tone: 'flirty', t: "You look good in my hoodie. Better than me.", r: "Liar. It's enormous. But I'll take it. I might even let you have it back. For an hour. Supervised.", opts: [
        { tone: 'cold', t: "I'll take it back now, then.", r: "Now? Here? Oh. You're serious. Okay. I'll give it you at home. That's - okay. That stings." },
        { tone: 'passive', t: "Keep it. I'll steal one of yours to make it fair.", r: "My cardigan? The yellow one? You'd look ridiculous. Wonderful. Ridiculous. Take it. It's yours." },
        { tone: 'flirty', t: "Supervised? I'll need very close supervision.", r: "The closest. I'll be right there. Watching. Pink. Ready to take it back the second you look away." },
        { tone: 'risque', t: "I'd rather take it off you myself.", r: "Would you? Then you'll have to come home with me to do it. I'm not taking it off at {venue}. Later." },
      ] },
    ] },
  // ===================================================================== CLOSE 2: the jar is full of you
  { id: 'sunny-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "I nearly skipped a slip last night. My good-things jar - have I told you? It's mostly you. After last time, I didn't know what to write.",
    opts: [
      { tone: 'cold', t: "Maybe write about something else.", r: "Maybe. I did, in the end. A nice bus driver. It's not the same. I'd like you back in the jar, that's all.", opts: [
        { tone: 'cold', t: "I'm not a slip of paper.", r: "No. You're not. I'll stop asking you to be. I'm going to go home and read some old slips. Bye, {me}." },
        { tone: 'passive', t: "Sorry. I'd like to be back in it too.", r: "Then you are. Tonight's slip is 'they said sorry'. That's a really good one, actually. Thank you." },
        { tone: 'flirty', t: "Let me give you something worth writing.", r: "Like what? You're smiling. It's working already. Okay. That's half a slip. Keep going." },
      ] },
      { tone: 'passive', t: "I'm sorry. What does it say, mostly? The you bits?", r: "Small things. 'They laughed at my goose joke.' 'They texted good morning first.' My gran says I'll need a fourth jar.", opts: [
        { tone: 'cold', t: "That's a lot of jar for one person.", r: "You're a lot, in a good way, I thought. Okay. The slips stay folded. I'm sorry." },
        { tone: 'passive', t: "I'll do better at being slip-worthy.", r: "You already are. Last time was one day. The jar's got weeks of you. Weeks win. Come here." },
        { tone: 'flirty', t: "Fourth jar? I'll buy it. A big one.", r: "A big one! You'd do that? Then I'll fill it with you. Every day. Oh, I've gone soppy. Forgiven." },
      ] },
      { tone: 'flirty', t: "I'm sorry. Write 'they were an idiot, then they kissed me'.", r: "That's very specific. And it hasn't happened yet. The second bit. You'll have to make it true first.", opts: [
        { tone: 'cold', t: "Never mind, then.", r: "Oh. Okay. Never mind. I thought we were making up. I'll write about the bus driver again. Bye." },
        { tone: 'passive', t: "I'll make the first bit true by apologising properly.", r: "Then do. I'm listening. Go on. Oh, that was a good one. That's a whole slip. Thank you." },
        { tone: 'flirty', t: "Close your eyes, then. I'm making it true.", r: "Okay. Eyes closed. Oh. Okay. That's true now. I'll need a big slip. And another pen." },
        { tone: 'risque', t: "Then let's make it true until it needs a whole jar.", r: "A whole jar of kissing? That's ambitious. Good. Your place, then. Bring paper. I'll be taking notes." },
      ] },
    ] },
  { id: 'sunny-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Did I ever tell you how my good-things jar started? I can't remember. Anyway, it's overflowing. With you. I need your help with something.",
    opts: [
      { tone: 'cold', t: "I don't really get the jar thing.", r: "Oh. That's okay. Not everyone does. Gran started it when I was nine. A slip for every day. It saved me, a bit.", opts: [
        { tone: 'cold', t: "Still don't get it.", r: "Okay. That's alright. No need. It's mine. I'll keep it on my windowsill. Bye, {me}." },
        { tone: 'passive', t: "Saved you? Tell me.", r: "I was miserable at school. Gran said: find one good thing, every day. I've never stopped. Never missed one." },
        { tone: 'flirty', t: "Okay. But I get you, and I'm in the jar.", r: "You're all over the jar. That's what I needed help with. Would you write one? For me? Your first slip?" },
      ] },
      { tone: 'passive', t: "Tell me again. And what's the help?", r: "Gran started it after an awful year at school. A good thing a day, written down. And the help is: I want you to write one. For the jar.", opts: [
        { tone: 'cold', t: "I'm not really a writing person.", r: "That's fine. It can just be one word. Or a doodle. Or nothing. I'm not pushing. Okay. I'll drop it." },
        { tone: 'passive', t: "Okay. What should it say?", r: "Whatever was good today. That's the only rule. Here. A pen. Oh, I'm nervous. Isn't that silly?" },
        { tone: 'flirty', t: "I'll write one. It'll say your name.", r: "Just my name? On a slip? In my own jar? Oh, that's going straight to the top. I'm not crying." },
      ] },
      { tone: 'flirty', t: "Overflowing with me? You must really like me.", r: "So, so much. That's the problem. I'm out of room. So I thought you could write one. A slip about me.", opts: [
        { tone: 'cold', t: "That's a bit of a weird ask.", r: "Is it? Okay. It's just a slip. Don't worry about it. I'll write my own. I'm sorry, {me}." },
        { tone: 'passive', t: "I'd love to. Pass me a pen.", r: "Here! I carry one. I always have. Write anything. I won't read it till tonight. Okay, I'll read it now." },
        { tone: 'flirty', t: "I'll write one every day. They'll all be about you.", r: "Every day? Then we'll need a jar the size of a house. We could live in it. I'd like that." },
        { tone: 'risque', t: "My slip's going to say what I'm doing to you later.", r: "Then I'll read it out loud. Slowly. Right before I make you do it. Two can play, {me}. Write it." },
      ] },
    ] },
  { id: 'sunny-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "My good-things jar - I must have told you about it, one slip a day - is officially full of you. I've started a new one. It's also you.",
    opts: [
      { tone: 'cold', t: "Maybe write about something else for once.", r: "Oh. Yes. Maybe. I don't have to make everything about you. I'm sorry. I'll write about the weather.", opts: [
        { tone: 'cold', t: "Two jars is overkill.", r: "Okay. I hear you. You'll be jar-free. That's a real shame, but okay. See you, {me}." },
        { tone: 'passive', t: "Sorry. That came out mean. I like being in it.", r: "You do? Okay. I'll keep going, then. But I'll put a nice cloud in once a week, for balance." },
        { tone: 'flirty', t: "Fine. Write about me, then the weather. Me first.", r: "You first. Always. Then the weather. The weather's never been first anyway. You've been warned." },
      ] },
      { tone: 'passive', t: "Two jars of me? What do they say?", r: "'Made them laugh on the phone.' 'They remembered my gran's name.' 'Kissed me in the rain.' That one's my favourite.", opts: [
        { tone: 'cold', t: "I don't remember half of those.", r: "That's okay. That's what the jar's for. I remember for both of us. But that stung a bit. A little bit." },
        { tone: 'passive', t: "The rain one's mine too.", r: "Is it? Oh, good. I was soaked. You were laughing. I've never been so happy to be soaked. Write it down too." },
        { tone: 'flirty', t: "Let's make another one tonight. Rain or not.", r: "Rain or not! Then I'll need a third jar. And an umbrella. Neither, actually. Just you." },
      ] },
      { tone: 'flirty', t: "Officially full of me? I'm very proud.", r: "You should be! It took ages. Gran started the jar to cheer me up when I was nine, and now it's just your face, mostly.", opts: [
        { tone: 'cold', t: "My face isn't in a jar.", r: "No. It's a figure of speech. A silly one. I'll stop. I'm sorry, {me}. I got carried away." },
        { tone: 'passive', t: "Your gran would be proud.", r: "She is. She says 'that driver's taken over the jar' every Sunday. She sounds cross. She's not." },
        { tone: 'flirty', t: "Let me earn a third jar.", r: "A third? You're greedy. I love that. Kiss me and that's the first slip in it. I'm counting." },
        { tone: 'risque', t: "A whole jar for last night alone?", r: "A whole jar? Last night gets a shelf. Keep looking at me like that and tonight gets a cupboard." },
      ] },
    ] },
  // ===================================================================== CLOSE 3: a little jealous
  { id: 'sunny-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "I saw you laughing with someone earlier. Really laughing. And after last time, I went all wobbly. I'm not jealous. I'm a little jealous.",
    opts: [
      { tone: 'cold', t: "I'm allowed to laugh with people.", r: "Of course you are. I'd never stop you. I just wanted you to laugh like that with me again. That's all it is.", opts: [
        { tone: 'cold', t: "You're being insecure.", r: "Maybe I am. I'll own that. But I won't keep asking you to see me. I'm off home, {me}. Call when you want to." },
        { tone: 'passive', t: "I'm sorry. It was nothing. You know that.", r: "I do. I think I do. I just needed to hear it. Thank you for saying it. I feel steadier now." },
        { tone: 'flirty', t: "Nobody makes me laugh like you do. You know that.", r: "Do I? Still? After last time? Okay. Then make me laugh. Prove it. I'm ready. I'm half smiling already." },
      ] },
      { tone: 'passive', t: "That was a friend from the team. You've got nothing to worry about.", r: "Okay. Thank you. I knew that, really. My brain just went off running after last time. I'm sorry I'm wobbly.", opts: [
        { tone: 'cold', t: "Your brain should calm down.", r: "It should. I'll tell it. It doesn't listen to me much. But okay. I'll keep my brain in my pocket. Bye, {me}." },
        { tone: 'passive', t: "Don't be sorry. I'd rather you told me.", r: "Really? Then I'll keep telling you. Even the silly bits. Especially the silly bits. Thank you, {me}." },
        { tone: 'flirty', t: "A jealous you is kind of adorable.", r: "Adorable? I've been chewing my sleeve for an hour! Okay. Maybe a bit adorable. Stop grinning." },
      ] },
      { tone: 'flirty', t: "Jealous? Come here and I'll make you forget them.", r: "That's very smooth for someone who was laughing with somebody else. But. It's working. Annoyingly.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Oh. Okay. I'll forget it. I'll forget all of it. I'm going to go. I don't want to be wobbly at you." },
        { tone: 'passive', t: "It was nothing. I promise. You're who I want.", r: "I'm who you want. Okay. That's the bit I needed. I'll stop chewing my sleeve now. Thank you." },
        { tone: 'flirty', t: "Annoyingly working? Let me keep working.", r: "Keep working. I'm forgetting. Slowly. Their name's going. Their face is going. Who were they? Oh, I'm pink." },
        { tone: 'risque', t: "Let me show you exactly who I want. Tonight.", r: "Tonight. Then show me. Thoroughly. I'm not going to make it easy for you, though. I'm still a bit cross." },
      ] },
    ] },
  { id: 'sunny-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "Okay, I'm going to say something and you're not allowed to laugh. I saw you chatting with someone and I got a little jealous. Tiny. A pea.",
    opts: [
      { tone: 'cold', t: "That's a bit possessive.", r: "Is it? I don't want to be possessive. I'm sorry. It's just a pea. I didn't want to hide it. I'll go and squash it.", opts: [
        { tone: 'cold', t: "Yes. Squash it.", r: "Okay. Squashing it. Along with a bit of me, maybe. I'll see you later, {me}. I'm going for a walk." },
        { tone: 'passive', t: "No, I'm glad you said it. It was nothing.", r: "Okay. Thank you. The pea's gone. Well, it's very small now. Practically a lentil. Thank you." },
        { tone: 'flirty', t: "Possessive looks good on you, honestly.", r: "It does? Huh. I'll be possessive more often, then. No, I won't. Maybe a bit. Mine. There." },
      ] },
      { tone: 'passive', t: "I'm not laughing. Tell me about the pea.", r: "It's silly. You laugh differently with other people. Louder. I wondered if you laugh like that with me. That's all.", opts: [
        { tone: 'cold', t: "I laugh how I laugh.", r: "Okay. That's fair. I'll stop counting laughs. It's a weird thing to count. I'm sorry, {me}." },
        { tone: 'passive', t: "I laugh like that with you all the time. You make me.", r: "Really? I've never noticed because I'm always laughing too. Okay. Pea gone. Completely. Thank you." },
        { tone: 'flirty', t: "With you I laugh differently. Softer. It's better.", r: "Softer? Oh. That's lovely. That's actually lovely. The pea's turned into a little flower. Come here." },
      ] },
      { tone: 'flirty', t: "A jealous pea? That's the cutest thing ever.", r: "It's not cute, it's a pea! It's very serious. Peas can grow. It's growing a bit now. You're smiling at me like that.", opts: [
        { tone: 'cold', t: "Okay, it's a bit much.", r: "Okay. Pea away. Sorry. I'll be less pea about it. Take care, {me}. I'll be fine in a bit." },
        { tone: 'passive', t: "It was nothing. Promise. Your pea can rest.", r: "My pea can rest. Thank you. I'll tuck it in. Goodnight, pea. Okay. I'm better. Thank you, {me}." },
        { tone: 'flirty', t: "Your pea's got nothing to worry about. You're my favourite.", r: "Your favourite? Out loud? In front of people? Okay. Pea's thrilled. I'm thrilled. Kiss me." },
        { tone: 'risque', t: "Come home with me and I'll prove the pea wrong.", r: "Prove it? All night? Then I'm coming. Pea's coming too. No, pea's staying here. Let's go." },
      ] },
    ] },
  { id: 'sunny-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "I'm going to be very mature about this. Someone was flirting with you earlier and I wanted to throw a bread roll at them. Very mature.",
    opts: [
      { tone: 'cold', t: "You need to calm down about that.", r: "I know. I'm not going to throw anything. I just felt it. And I wanted to tell you instead of sulking. Sorry.", opts: [
        { tone: 'cold', t: "Sulking would've been better.", r: "Oh. Okay. Then I'll do that. Quietly. Somewhere else. I'm leaving now, {me}. That hurt a bit." },
        { tone: 'passive', t: "Sorry. Thanks for telling me. It meant nothing.", r: "I know it didn't. It's just my heart doing a silly thing. Thank you for not making me feel daft." },
        { tone: 'flirty', t: "I'd have paid to see the bread roll thing.", r: "I've got a great arm! Years of skimming stones. Okay, I'm laughing now. The jealousy's gone. Mostly." },
      ] },
      { tone: 'passive', t: "They were just being friendly. You know that.", r: "I know. I do. I just saw their hand on your arm and my brain went 'bread roll'. It's a new feeling. I don't like it.", opts: [
        { tone: 'cold', t: "Then stop feeling it.", r: "If only it worked like that. I'll try. I'll go and try somewhere else. See you later, {me}." },
        { tone: 'passive', t: "I don't like making you feel that. I'm all yours.", r: "All mine. Okay. Say that again. No, don't, I'll go to pieces. Okay. Better. Much better. Thank you." },
        { tone: 'flirty', t: "If it helps, I didn't notice. I was looking at you.", r: "Were you? The whole time? Okay, that's a good answer. That's a very good answer. I've put the roll down." },
      ] },
      { tone: 'flirty', t: "Jealous you is very attractive.", r: "Is it? Then I'll be jealous more often. No. That's bad. But you liked it. I can tell. Your eyebrow did a thing.", opts: [
        { tone: 'cold', t: "Not that attractive.", r: "Oh. Right. Okay. I'll put the jealousy away, then. And myself. Later, {me}." },
        { tone: 'passive', t: "You've got nothing to be jealous of. Honestly.", r: "I know. I just like hearing it. Okay. I'll stop. Thank you. You're very patient with my bread rolls." },
        { tone: 'flirty', t: "My eyebrow does that when I want to kiss you.", r: "It does? Then it's been doing it all night. Oh. Oh, okay. Come here. I'll forget all about bread." },
        { tone: 'risque', t: "Get jealous again later. In private. I'll make it worth it.", r: "In private? Then I'm going to be outrageously jealous. All the way home. Brace yourself, {me}." },
      ] },
    ] },
  // ===================================================================== CLOSE 4: tell me a tiny secret
  { id: 'sunny-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "I keep a list on my phone of tiny things about you. Your tea. How you hum when you're nervous. It hasn't grown since last time.",
    opts: [
      { tone: 'cold', t: "That's a bit much, keeping a list.", r: "Is it? I thought it was sweet. It's only so I don't forget. I'm sorry. I'll stop adding to it.", opts: [
        { tone: 'cold', t: "Maybe delete it.", r: "Oh. Okay. I won't delete it. That's my bit to keep. But I'll stop. Home for me, {me}. Goodnight." },
        { tone: 'passive', t: "No. It's sweet. I'm just prickly today.", r: "Prickly's allowed. I'll add it. 'Gets prickly, comes round.' That's a good one. Thank you." },
        { tone: 'flirty', t: "Add this: they're sorry, and they adore you.", r: "Typing it now. In capitals. Oh, that's going at the very top. Above the tea thing. Come here." },
      ] },
      { tone: 'passive', t: "Let me add to it. Ask me anything.", r: "Okay. Tell me something you've never told anyone. It can be tiny. Tiny's my favourite size. I collect tiny.", opts: [
        { tone: 'cold', t: "I don't do secrets.", r: "Okay. That's fine. I won't push. I'll leave the list as it is. Maybe it'll grow another day." },
        { tone: 'passive', t: "I still sleep with the landing light on.", r: "Oh, you sweetheart. That's going on the list with a little star. I'll leave lights on for you. Always." },
        { tone: 'flirty', t: "I practised what to say to you the first time we met.", r: "You did? You? I thought I was the only one who practised! That's top of the list. You're adorable." },
      ] },
      { tone: 'flirty', t: "I'll give you three tiny things if you forgive me.", r: "Three? That's a big offer. Okay. Deal. One for each grumpy bit. Go on. Tiny ones count double.", opts: [
        { tone: 'cold', t: "Actually, I don't have any.", r: "Oh. Okay. You offered, though. That's a bit of a tease. I'll put my phone away. Bye, {me}." },
        { tone: 'passive', t: "I'm scared of moths. I cry at adverts. I miss you all week.", r: "Moths! Adverts! The third one! Oh, that's the best set of tiny things. Forgiven three times over." },
        { tone: 'flirty', t: "Number one: I think about you when I'm meant to be asleep.", r: "Do you? That's going on the list. In code. Number two can wait. I want to hear more about number one." },
        { tone: 'risque', t: "Number one is what I'd like to do to you tonight.", r: "Is it? Then tell me in detail later. Noted. Underlined. I'll check you followed through. Tonight." },
      ] },
    ] },
  { id: 'sunny-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "Give me a secret. A teeny one. I collect tiny things about you. I've got a list. It's long. Don't be scared.",
    opts: [
      { tone: 'cold', t: "I'm not giving you all my secrets.", r: "Not all. Just one. A tiny one. But okay. You're allowed to keep them. I'm sorry for pushing. It's just a list.", opts: [
        { tone: 'cold', t: "Good. Leave it.", r: "Leaving it. I'll go and make tea. You take yours with a splash of milk. That's on the list. See you." },
        { tone: 'passive', t: "Okay. One. I wanted to be a vet before racing.", r: "A vet! Oh, little you with a stethoscope and a hamster! Adding it now. With a hamster drawing." },
        { tone: 'flirty', t: "One secret, for a kiss.", r: "That's a very fair trade. I accept. Kiss first, though. Then secret. I don't trust you. I do. Come here." },
      ] },
      { tone: 'passive', t: "Okay. I eat cereal standing up at midnight. Every night.", r: "Every night? Standing up? That's so you. Listed. Starred. Treasured. What else is on there? Want to see?", opts: [
        { tone: 'cold', t: "I'd rather not see the list.", r: "Okay. That's fine. It's mine anyway. I'll keep it safe. It's just little things, I promise." },
        { tone: 'passive', t: "Show me. I want to know what you noticed.", r: "Here. 'Hums when nervous.' 'Splash of milk.' 'Says thank you to the car.' 'Lovely laugh.' It goes on." },
        { tone: 'flirty', t: "Is there anything on there about my kisses?", r: "There's a whole section. With ratings. All tens. Some elevens. You're not allowed to read that bit." },
        { tone: 'risque', t: "Add this: they want you in their bed every night.", r: "Adding it. Underlined. And a reply: so do I. Every night. Starting tonight, if you can keep up." },
      ] },
      { tone: 'flirty', t: "Here's one: I fell for you the first time you went pink at me.", r: "The first time? I go pink at you constantly! Which one? Oh, I'm going to cry. That's going at the very top of the list.", opts: [
        { tone: 'cold', t: "Well, maybe not that exact day.", r: "Oh. Okay. Some other day, then. I'll rub it out. I'll write 'some day'. It's still nice. Sort of." },
        { tone: 'passive', t: "It's true. You went pink over a compliment about your shoes.", r: "They were good shoes! But yes. I remember. I didn't know you were falling. I'd have fallen faster." },
        { tone: 'flirty', t: "And every day since. A bit more.", r: "Every day? A bit more? Oh, you. Come here. That's the best tiny thing. It isn't even tiny. It's huge." },
      ] },
    ] },
  { id: 'sunny-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "I've got a list of tiny things about you on my phone. It's up to two hundred. I want two hundred and one. Tell me a secret. Please?",
    opts: [
      { tone: 'cold', t: "Two hundred? That's a lot of watching.", r: "It's not watching. It's noticing. There's a difference. I think. Oh. You make it sound creepy. I'm sorry.", opts: [
        { tone: 'cold', t: "It is a bit creepy.", r: "Okay. I'll stop at two hundred. That stung. I'm going to go and be quiet for a bit. See you, {me}." },
        { tone: 'passive', t: "Sorry. Noticing. I get it. It's lovely.", r: "It is lovely! It's like a scrapbook of you. Okay. Two hundred and one, please. I'm ready." },
        { tone: 'flirty', t: "Number two hundred and one: I notice things about you too.", r: "You do? What things? No, tell me later. I want to hear them one by one. Slowly. Like presents." },
      ] },
      { tone: 'passive', t: "Okay. I cried at the end of a cartoon last month.", r: "Which one? No. Don't tell me. Let me guess. The one with the robot. It was the robot. I cried too. List.", opts: [
        { tone: 'cold', t: "Don't tell anyone that.", r: "I won't! It's sacred. The list is sacred. I'd never. Okay. I'll stop now. I just liked knowing." },
        { tone: 'passive', t: "Yes, the robot. How did you know?", r: "Because everyone cries at the robot. And because I know you. Two hundred and one things' worth." },
        { tone: 'flirty', t: "Cry at the robot with me next time.", r: "A robot-crying date. That's the most romantic thing I've ever heard. Tissues and you. Perfect." },
      ] },
      { tone: 'flirty', t: "I'll whisper it. Come closer.", r: "Closer? Okay. This close? Okay. I'm right here. Your breath tickles. That's not on the list yet. It is now.", opts: [
        { tone: 'cold', t: "Actually, I changed my mind.", r: "Oh. Okay. You teased me with a whisper and took it back. That's mean. Very mean. I'll go sulk." },
        { tone: 'passive', t: "I sleep on the left so I can see the door.", r: "Oh, you. That's so tender. I'll take the right. Always. I'll guard the door. With my socks." },
        { tone: 'flirty', t: "My secret is I can't stop thinking about kissing you.", r: "That's not a secret, I can see it on your face. But I'll add it. Then I'll do something about it." },
        { tone: 'risque', t: "My secret is what I'm planning for you tonight.", r: "Then whisper all of it. Every bit. I'll want it all. And I'll be expecting it all. I'm not shy now." },
      ] },
    ] },
  // ===================================================================== CLOSE 5: thinking about kissing you since you landed
  { id: 'sunny-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "I've wanted to kiss you since you landed. But after last time I didn't know if I was allowed. So I'm just asking. Am I?",
    opts: [
      { tone: 'cold', t: "Not right now.", r: "Okay. Not right now. That's alright. Thank you for saying it straight. I'll hold on to it for later. If there's a later.", opts: [
        { tone: 'cold', t: "Later's not looking likely.", r: "I see. Okay. I won't ask again. Not until you do. I'm going home now, {me}. I hope you're alright." },
        { tone: 'passive', t: "Sorry. I'm tense. Give me ten minutes.", r: "Ten minutes. I can do ten minutes. I'll count. I'll stand here and count. Out loud. Kidding. Mostly." },
        { tone: 'flirty', t: "I changed my mind. Ask again.", r: "Am I allowed to kiss you? Oh, you're smiling. That's a yes smile. Okay. Come here. Finally." },
      ] },
      { tone: 'passive', t: "Of course you're allowed. You never needed to ask.", r: "Okay. Good. I'm going to, then. Oh. Okay. That fixed most of last time. A few more should fix the rest.", opts: [
        { tone: 'cold', t: "That's enough for now.", r: "Oh. Okay. Enough. I'll take what I got. It was a good one. I'll go for a walk, {me}." },
        { tone: 'passive', t: "A few more, then. I've missed you.", r: "I missed you so much. Even when you were right here. Especially then. Okay. One more. Two. Three." },
        { tone: 'flirty', t: "Most of it? Let's fix all of it.", r: "All of it? That's going to take a while. Good thing I'm patient. And very, very motivated." },
        { tone: 'risque', t: "Let's fix the rest somewhere without an audience.", r: "Yes. Yours is closer. Mine has a fern that stares. Yours, then. Walk fast. I'm not waiting another week." },
      ] },
      { tone: 'flirty', t: "Since I landed? I've been waiting since I took off.", r: "Since you took off? That's - okay, you're very good at that. I was cross. I'm much less cross. Come here.", opts: [
        { tone: 'cold', t: "Actually, I'm still a bit annoyed.", r: "Oh. Then I'll wait. I don't want a kiss you don't mean. Tell me when you do. I'll be over there." },
        { tone: 'passive', t: "I'm sorry about before. Come here.", r: "Forgiven. Kissed. In that order. Oh. That was worth a whole week of wobbling. Hi." },
        { tone: 'flirty', t: "Much less cross? Let's get you to not cross at all.", r: "Keep going like that and I'll forget I was ever cross. Oh. I've forgotten. What was I saying?" },
        { tone: 'risque', t: "I've thought about more than kissing since take-off.", r: "Good. So have I. Since the moment your plane left. You'd better have the energy. I've planned it." },
      ] },
    ] },
  { id: 'sunny-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "I've been thinking about kissing you since you landed. That's a long time to think about one thing. I'm very focused. Like you, in a car.",
    opts: [
      { tone: 'cold', t: "Can we not right now? I'm wiped.", r: "Oh. Course. You're shattered. I'll just stand near you and be supportive. Quietly. With my lips to myself.", opts: [
        { tone: 'cold', t: "Thanks. I'll see you later.", r: "Okay. Later. Go rest. I'll be thinking about it, but quietly. Sleep well, {me}. I mean it." },
        { tone: 'passive', t: "One quick one wouldn't hurt.", r: "One quick one. Okay. Oh. That was lovely. You're tired and still lovely. Go and sleep now." },
        { tone: 'flirty', t: "Lips to yourself? That's a terrible plan.", r: "It is a terrible plan. I'm abandoning it immediately. Come here, you exhausted person. Kiss." },
      ] },
      { tone: 'passive', t: "Focused like me in a car? Then do something about it.", r: "I am. I'm doing something. This is me doing something. Oh. Yes. That was worth all the focusing.", opts: [
        { tone: 'cold', t: "Okay, that's enough. People are looking.", r: "Oh! Sorry. I forget there are people. There's only ever you, in my head. Okay. I'll behave." },
        { tone: 'passive', t: "Worth the wait. Missed you.", r: "Missed you more. I've been counting days on the fridge. With a pen. I crossed out today with hearts." },
        { tone: 'flirty', t: "Lap two, please.", r: "Lap two! And three. And a fastest lap. I'm going for the record. I'm extremely competitive now." },
        { tone: 'risque', t: "Keep that focus. I want the full race distance tonight.", r: "Full race distance? No safety car? Okay. You're on. I'll set the pace. Try to keep up, {me}." },
      ] },
      { tone: 'flirty', t: "I've been thinking about it since I saw you across the room.", r: "Across the room? You looked so calm! You were thinking about it? Oh, that's lovely. Okay. Come here, calm person.", opts: [
        { tone: 'cold', t: "I was calm. I was just being civil.", r: "Oh. Polite. Right. I'll stop being soppy at you, then. I'll go and be soppy at my plants. Bye, {me}." },
        { tone: 'passive', t: "Calm on the outside. Here.", r: "Oh. Oh, that one was perfect. That's going in the jar. Under 'kisses'. It's a very big section." },
        { tone: 'flirty', t: "I'm never calm around you.", r: "Never? Good. I'm never calm around you either. Let's be not-calm together. Starting with this. Mm." },
        { tone: 'risque', t: "Let's skip the polite bit. Come back to mine.", r: "Yes. Right now. Stop talking. Get your coat. I've been patient since you landed and I'm done." },
      ] },
    ] },
  { id: 'sunny-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "Don't talk. I've been thinking about kissing you since you landed, and if I don't do it now I'll explode. Okay? Okay.",
    opts: [
      { tone: 'cold', t: "Not here.", r: "Oh. Okay. Not here. Sorry. I ran away with myself. I'll put the explosion away for later. It'll keep.", opts: [
        { tone: 'cold', t: "Not later either. I'm not in the mood.", r: "Okay. I hear you. I won't push. I'll go and be quietly disappointed. Take care of you, {me}." },
        { tone: 'passive', t: "Sorry. Let's find a quieter spot.", r: "A quieter spot. Yes. I know one. Follow me. Walk normally. I'm walking very normally. Oh no, I'm skipping." },
        { tone: 'flirty', t: "Not here. But hold that thought. Hard.", r: "I'm holding it so hard. It's the only thing I'm thinking. Ever. You'd better be quick getting us out of here." },
      ] },
      { tone: 'passive', t: "Okay.", r: "Okay. Oh. Oh, hello. I've missed that. I've missed you. Hi. Sorry. Hi. That was the explosion.", opts: [
        { tone: 'cold', t: "Steady on.", r: "Sorry. Steadying. I'm steady. I'm a table. A very happy, slightly wobbly table. I'll calm down." },
        { tone: 'passive', t: "Hi. Hi. Missed you.", r: "Hi. Good. Now I can talk. How was the flight? Did you eat? Did you sleep? Ignore me. Kiss me again." },
        { tone: 'flirty', t: "That's all of it? I think there's more in there.", r: "So much more. Hours more. I've been saving it. You've got a lot to catch up on, {me}." },
        { tone: 'risque', t: "Explode again. At mine. All night.", r: "All night? Deal. I'll bring the slips for the jar. I'll need a lot. You'll be very busy, {me}." },
      ] },
      { tone: 'flirty', t: "Shh. You talk too much.", r: "I know! I'm stopping. I'm - mm. Oh. Okay. That shut me up. Nothing else ever has. Do it again.", opts: [
        { tone: 'cold', t: "Alright, enough now.", r: "Oh. Already? Okay. Fine. I'm back to talking, then. That was abrupt. I'll go and talk to my fern." },
        { tone: 'passive', t: "Missed you. You can talk now.", r: "I can talk! I missed you. Everything's better. The plants are fine. Gran says hello. Kiss me again." },
        { tone: 'flirty', t: "Again. And again. Until you forget words.", r: "What are words? I don't know any. I'm just a person who's being kissed. Happily. Very happily." },
        { tone: 'risque', t: "Let's go home and see how quiet I can keep you.", r: "Not very, I warn you. But you're welcome to try. All night if you like. I'll make it difficult." },
      ] },
    ] },
  // ===================================================================== CLOSE 6: missing you on the road; box box; Dennis
  { id: 'sunny-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "Your weeks away are long. Last time made this one longer. Even Dennis - my fern, the big dramatic one - drooped. I talked to him a lot.",
    opts: [
      { tone: 'cold', t: "I'm away a lot. You knew that.", r: "I did. I do. I'm not complaining about you being away. I'm saying I missed you. Those are different things.", opts: [
        { tone: 'cold', t: "Feels like complaining.", r: "Okay. Then I'll stop saying it. I'll miss you quietly. That's harder, but I'll do it. Bye, {me}." },
        { tone: 'passive', t: "You're right. They're different. I missed you as well.", r: "You did? Okay. Then it's a shared missing. That's much easier to carry. Thank you for that." },
        { tone: 'flirty', t: "Then let me make up for it while I'm here.", r: "Every minute? Okay. Here's the plan. Hugs, tea, more hugs. Dennis gets one too. He's earned it." },
      ] },
      { tone: 'passive', t: "I'm sorry. Poor Dennis. Did you two cope?", r: "Barely. I've started saying 'box box' to leave rooms. Someone at work looked at me so strangely. You've ruined me.", opts: [
        { tone: 'cold', t: "That's a bit embarrassing.", r: "It is. I know. It's a love thing. Or it was. I'll stop. I'll just say 'excuse me' like a normal person." },
        { tone: 'passive', t: "Box box. That's brilliant. I love that.", r: "Do you? I say it about three times a day now. In the kitchen. To the kettle. It's our thing." },
        { tone: 'flirty', t: "Box box to me, then. I'll be your pit stop.", r: "My pit stop? Four new tyres and a kiss? Okay. That's the best thing. Box box. I'm here. Pit me." },
      ] },
      { tone: 'flirty', t: "Dennis drooped? Tell him I'm back to fix him.", r: "He'll perk up the second you walk in. He always does. So do I. I was cross with you. I'm less cross. Dennis isn't at all.", opts: [
        { tone: 'cold', t: "I'm not here to fix a plant.", r: "No. Course not. It was a joke. A bad one. I'll fix Dennis myself. I'll fix myself too. Bye, {me}." },
        { tone: 'passive', t: "I was a mess last time. I'll make it up to you both.", r: "To both of us! He'll be thrilled. I'll be thrilled. Come round tonight. He wants to see you. So do I." },
        { tone: 'flirty', t: "I'll water him if you let me kiss his owner.", r: "That's a fair trade. Dennis would approve. He always does. Okay. Kiss first. Then water. Come here." },
        { tone: 'risque', t: "I'll come over. Dennis might want to look away.", r: "He'll need to. I'll turn him round. To face the window. He'll understand. Come over at eight." },
      ] },
    ] },
  { id: 'sunny-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "New habit: I say 'box box' to get out of rooms. I said it to my fern, Dennis, this morning. Your weeks away are making me strange.",
    opts: [
      { tone: 'cold', t: "You should get out more while I'm away.", r: "I do get out! I just come back and miss you. I'm sorry. I didn't mean to make you feel bad about it.", opts: [
        { tone: 'cold', t: "Then stop telling me.", r: "Okay. I'll stop telling you I miss you. I'll still miss you. I'll just keep it in. Bye, {me}." },
        { tone: 'passive', t: "No, I'm sorry. I miss you too. It's hard.", r: "It is hard. But it's ours. That makes it easier. Thank you. I'll still say box box, though." },
        { tone: 'flirty', t: "Get out more. Then come home to me.", r: "To you? Okay. Out, then home to you. That's a lovely routine. I'll take it. I'll make you dinner." },
      ] },
      { tone: 'passive', t: "To Dennis? What did he say?", r: "Nothing. He's a fern. But he looked at me like I'd lost it. Which I have. You've ruined me in the nicest way.", opts: [
        { tone: 'cold', t: "Maybe talk to people instead.", r: "I do talk to people. I talk to Gran. And Dennis. And you, when you're here. But okay. I'll try more people." },
        { tone: 'passive', t: "I miss you like that too. On the road.", r: "You do? Do you say box box too? No. You probably say it in the car. That's cheating. But I'm glad." },
        { tone: 'flirty', t: "I'll make the ruining worth it.", r: "You always do. That's why it's ruining. Normal people would cope. I'm not normal anymore. I'm yours." },
      ] },
      { tone: 'flirty', t: "Then box box over here. I'll be right here.", r: "Box box. There. I've pitted. Oh, you're warm. This is the best pit stop. Four tyres. One you.", opts: [
        { tone: 'cold', t: "Okay, that was cheesy.", r: "It was. Very. I'm a cheesy person. You know that. I'll come out of the pits now. Bye for now." },
        { tone: 'passive', t: "Stay in the pits for a while.", r: "As long as you like. I'm staying put. You're away so much. I'm parking here. Forever." },
        { tone: 'flirty', t: "Best pit stop ever. Full service.", r: "Full service. Kisses, tea, hoodie, Dennis. In that order. I've thought about it all week." },
        { tone: 'risque', t: "Full service means no rush back to the track.", r: "None. You're staying the night. And the morning. I'll hide your keys. I'm not letting you leave." },
      ] },
    ] },
  { id: 'sunny-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "I say 'box box' when I leave rooms now. Last night I said it to Dennis - my fern - before I went to bed missing you.",
    opts: [
      { tone: 'cold', t: "That's a bit sad.", r: "Is it? I hoped it was sweet. I'm sorry. It's just how I miss you. I'll stop telling you the silly bits.", opts: [
        { tone: 'cold', t: "It is sad. Get some sleep.", r: "Okay. I'll sleep. Sad is allowed sometimes. I'll see you when you're back. Goodnight, {me}." },
        { tone: 'passive', t: "No, it's sweet. I'm being grumpy. Sorry.", r: "Grumpy's allowed. You've been travelling. Come here. I'll make it less grumpy. Hug. Then tea." },
        { tone: 'flirty', t: "Next time, box box to my bed. Much less sad.", r: "Your bed? That's the best pit lane in the world. Okay. I'll box box there. Every night you're home." },
      ] },
      { tone: 'passive', t: "Box box. I love that. I miss you too, you know.", r: "Do you? On the road? I always imagine you're too busy to miss anything. Tell me what you miss. Little things.", opts: [
        { tone: 'cold', t: "I don't have time to miss much.", r: "Oh. Okay. I suppose not. You're busy. I'll stop asking. I'll keep missing enough for both of us." },
        { tone: 'passive', t: "Your laugh. The way you hum while cooking.", r: "I hum? I don't hum! Do I hum? Oh. I do hum. You noticed. That's on my list now. Of things you notice." },
        { tone: 'flirty', t: "Kissing you, mostly. Then everything else.", r: "Kissing? Oh. Okay. Then you'd better catch up on missing it. Right now. Here it is. Come here." },
      ] },
      { tone: 'flirty', t: "Say it to me. I want to hear it.", r: "Box box. There. Now you have to come in. That's the rule. You box, you come in. Into my arms. Them's the rules.", opts: [
        { tone: 'cold', t: "I'm not playing that game.", r: "Oh. Okay. It wasn't really a game. It was more of a hug. But fine. I'll keep my arms to myself." },
        { tone: 'passive', t: "Coming in. Missed you.", r: "Missed you. So much. Dennis did too. He's been sulking. You'll need to talk to him. Not now. Later." },
        { tone: 'flirty', t: "I'll come in. And I'm not going back out.", r: "Good. Stay in the pit lane forever. I'll bring you snacks. And kisses. And more kisses." },
        { tone: 'risque', t: "Box box. Bedroom. Now.", r: "Oh! You took my line and made it so much better. Yes. Bedroom. Go. I'm right behind you." },
      ] },
    ] },
  // ===================================================================== CLOSE 7: you've gone far away - let me in
  { id: 'sunny-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "Can we talk? Properly? You've been somewhere far away lately, and last time it felt like a door shut. I'm not angry. I just want in.",
    opts: [
      { tone: 'cold', t: "Nothing to talk about.", r: "There is, though. I can see it. You don't have to tell me everything. But please don't tell me nothing.", opts: [
        { tone: 'cold', t: "I said there's nothing.", r: "Okay. I won't force the door. I love being with you, but I won't beg at it. I'll be home. When you're ready." },
        { tone: 'passive', t: "Okay. It's been a hard few weeks. I didn't want to worry you.", r: "Worry me. That's what I'm for. You don't have to be okay with me. That's sort of the whole point of me." },
        { tone: 'flirty', t: "I'm sorry. Can I just hold you for a bit first?", r: "Yes. Always yes. Come here. We'll hold first and talk after. Or never. Whatever you need." },
      ] },
      { tone: 'passive', t: "You're right. I've been closed off. I'm sorry.", r: "Thank you. Really. Is it the racing? Or me? Or something else? I'll listen to any of it. I'm good at listening.", opts: [
        { tone: 'cold', t: "It's not something you'd understand.", r: "Maybe not. But I'd try so hard. That's all I'm asking. Try me. Or don't. I'll be here either way." },
        { tone: 'passive', t: "It's the pressure. Everyone watching, every lap.", r: "Then with me, nobody's watching. Just me, and I only watch the nice bits. You can just be tired here." },
        { tone: 'flirty', t: "It's not you. You're the bit that's going right.", r: "I'm the bit that's going right? Oh. Okay. That helps. That really helps. Then let me help with the rest." },
      ] },
      { tone: 'flirty', t: "The door's open. You're the only one with a key.", r: "That's a lovely thing to say. It doesn't feel open, though. Can you show me? Even a little? I'll be gentle with it.", opts: [
        { tone: 'cold', t: "Not today.", r: "Okay. Not today. I'll wait by the door, then. Patiently. But I won't wait outside forever, {me}." },
        { tone: 'passive', t: "I've been scared of letting you down.", r: "Me? You could never. You'd have to try so hard. I'd still be in your corner. Always. Come here." },
        { tone: 'flirty', t: "Come in, then. Stay as long as you like.", r: "Forever, then. I'm moving in. Into the door. Metaphorically. Oh, I'm so relieved. Hold me." },
        { tone: 'risque', t: "Come home with me. I'll let you in properly.", r: "Talk first. Then the other kind of letting in. I want both, {me}. All of you. Every bit." },
      ] },
    ] },
  { id: 'sunny-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "You've been quiet this week. Not with everyone. With me. I'm not cross. I'm worried. Will you tell me what's going on in there?",
    opts: [
      { tone: 'cold', t: "I'm fine. You're imagining it.", r: "I'm not, though. I know your quiet. I've got a list about you, remember? 'Goes quiet when it's heavy.' It's on there.", opts: [
        { tone: 'cold', t: "Stop analysing me.", r: "Okay. I'll stop. I'm only trying to look after you properly. I'll go home now. Ring me if you need me." },
        { tone: 'passive', t: "Okay. You're right. It's been heavy.", r: "Thank you. Tell me as much as you want. I'm here for all of it. You can be heavy with me. That's allowed." },
        { tone: 'flirty', t: "You know me too well. It's annoying.", r: "It's my job. My favourite job. Now. Talk. Or kiss me and then talk. Your choice. Both is good." },
      ] },
      { tone: 'passive', t: "It's been a rough patch. On track and off.", r: "Okay. Thanks for letting me in. You don't have to fix it with me. You can just put it down. I'll hold it for a bit.", opts: [
        { tone: 'cold', t: "You can't hold it for me.", r: "No. Maybe not. But I can stand next to you while you carry it. That's something. I'll be here." },
        { tone: 'passive', t: "That helps more than you know.", r: "Good. That's all I wanted. To help a tiny bit. I'll make tea. Proper tea. Splash of milk. I know." },
        { tone: 'flirty', t: "You're the best part of every week. Even this one.", r: "Even this one? Then this week's not all bad. Come here. Let's sit. You don't have to say anything else." },
      ] },
      { tone: 'flirty', t: "I've been in my head. Get me out of it?", r: "Leave it to me. I'm very good at that. I'm going to say something stupid and you're going to laugh. Ready? Ducks.", opts: [
        { tone: 'cold', t: "That's not funny.", r: "No. It wasn't. I'm sorry. I'll stop trying to fix you with ducks. I'll just be here. Quietly." },
        { tone: 'passive', t: "Ducks. Okay. That worked a bit.", r: "Ducks always work. They're my secret weapon. Now. What's going on in there? Only if you want to." },
        { tone: 'flirty', t: "Ducks. You're ridiculous. I adore you.", r: "You adore me! Oh, you said it while laughing at ducks. That's the best way. I'm so happy. Tell me everything." },
        { tone: 'risque', t: "Distract me somewhere more private.", r: "Gladly. Distraction is my speciality. But tomorrow you tell me what's wrong. Deal? Deal. Come on." },
      ] },
    ] },
  { id: 'sunny-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "You've been charming the whole time, but your eyes are somewhere else. I know that look. You don't have to be sunny with me. That's my job.",
    opts: [
      { tone: 'cold', t: "I'm fine. Leave it.", r: "Okay. I'll leave it. For tonight. But I'm putting it on the list. 'Says fine, means not.' We'll come back to it.", opts: [
        { tone: 'cold', t: "Don't put it on the list.", r: "It's already there. I'm sorry. I won't pick at it. I'll just care about you from over here. Quietly. Goodnight." },
        { tone: 'passive', t: "Okay. I'm not fine. I'm tired of being on.", r: "Then switch off. Here, with me. You don't have to be anything. You can just be a tired person with me." },
        { tone: 'flirty', t: "Fine, you caught me. Make it better?", r: "Always. Sit. I'm going to hold your hand and say nothing for five whole minutes. That's huge for me." },
      ] },
      { tone: 'passive', t: "You noticed. I've had a rough week.", r: "Of course I noticed. I notice everything about you. Tell me. Or don't. But don't pretend with me. Please.", opts: [
        { tone: 'cold', t: "I don't want to talk about it.", r: "Okay. That's okay. We won't. We'll sit. I'll be here when you do. Even if it's in a month." },
        { tone: 'passive', t: "Okay. No pretending. It's been awful.", r: "Thank you. Awful's allowed. Tell me the worst bit first. Then the second worst. We'll work up to the okay bits." },
        { tone: 'flirty', t: "I don't pretend with you. You're the real part.", r: "The real part. I like that. I'm keeping that. Come here, real person. Let me take care of you a bit." },
      ] },
      { tone: 'flirty', t: "My eyes are on you now. Better?", r: "Much better. But I still want to know what was in them before. You can't charm your way out of it. Nearly.", opts: [
        { tone: 'cold', t: "Then drop it.", r: "Okay. I'll drop it. But I'll pick it up again tomorrow. Gently. Because I care. Goodnight, {me}." },
        { tone: 'passive', t: "It was the race. I keep replaying it.", r: "Then replay it with me. Out loud. Every corner. I'll listen to all of it. And then we'll stop." },
        { tone: 'flirty', t: "Nearly? Let me try harder.", r: "You're impossible. Okay. You're winning. But I still want the real answer. After. After this." },
        { tone: 'risque', t: "Take me home and I'll tell you everything after.", r: "Everything. After. I'm holding you to both parts. And I always collect. Let's go." },
      ] },
    ] },
  // ===================================================================== CLOSE 8: five years? here's a key
  { id: 'sunny-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "I had something to give you. I nearly didn't, after last time. It's a key. To mine. Dennis insisted. It's still yours, if you want it.",
    opts: [
      { tone: 'cold', t: "Isn't that a bit soon?", r: "Maybe. I hope not. But maybe. I'm not asking you to move in. It's just a key. A door you can always open.", opts: [
        { tone: 'cold', t: "I don't want it right now.", r: "Okay. I'll keep it. It'll be on the hook. It doesn't expire. Goodnight, {me}. It hurts a little." },
        { tone: 'passive', t: "No, you're right. It's lovely. I'm sorry.", r: "It's okay. Here. Take it. I put a little strawberry keyring on it. So you'd know which one's mine." },
        { tone: 'flirty', t: "A door I can always open? I'll use it a lot.", r: "Good. Use it all the time. Use it at three in the morning. I'll be asleep, but I'll be happy." },
      ] },
      { tone: 'passive', t: "I behaved badly last time. I'd love it.", r: "You would? Oh. Good. Here. I keep thinking about five years from now. Where you'll be. If I'm in it. Am I?", opts: [
        { tone: 'cold', t: "I don't think that far ahead.", r: "Oh. Okay. That's fine. Some people don't. I always do. I'll think enough for both of us, quietly." },
        { tone: 'passive', t: "Five years. A house. A garden. You in it.", r: "A garden! With a greenhouse! For Dennis's children! Oh, I've gone teary. Okay. Yes. That. Exactly that." },
        { tone: 'flirty', t: "You're in all of it. Every year.", r: "Every year? Even the boring ones? Then I'm in. I'm so in. I've been in since the start." },
      ] },
      { tone: 'flirty', t: "A key? To yours? I've been hoping for that.", r: "You have? You should've said! I had a whole speech. Dennis had to listen to it six times. Okay. Here. It's yours.", opts: [
        { tone: 'cold', t: "I'll only use it sometimes.", r: "Oh. Okay. Sometimes is fine. I'll be there sometimes, then. I'll try not to be sad about the other times." },
        { tone: 'passive', t: "Tell me the speech. Let's hear it.", r: "Okay. It goes: 'I'd like you to come home to me, even when home's just a weekend.' That's it. It was longer." },
        { tone: 'flirty', t: "I'll be using it tonight.", r: "Tonight? Good. I'll leave the light on. And the kettle. And possibly something nicer than both." },
        { tone: 'risque', t: "I'll let myself in tonight. Late. Be awake.", r: "I'll be awake. Under the duvet, pretending to read. I won't be reading. Don't be late, {me}." },
      ] },
    ] },
  { id: 'sunny-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "Okay. Big question. Where do you see yourself in five years? Not racing. You. Am I in it? No pressure! Some pressure. Also, here's a key.",
    opts: [
      { tone: 'cold', t: "I don't really plan that far.", r: "That's okay. I plan for everyone. I've got a five-year plan for Dennis, even. But the key's still yours. No pressure.", opts: [
        { tone: 'cold', t: "I'm not taking a key.", r: "Okay. I'll keep it on the hook. With your name on a little label. It'll wait. I'll go home now, {me}." },
        { tone: 'passive', t: "I'll take the key. I'll think about the rest.", r: "That's perfect. Think slowly. I'll be in the garden of your five years, quietly planting things." },
        { tone: 'flirty', t: "I don't plan. But you're in every plan I make.", r: "Every plan? Even the dinner ones? Then I'm happy. Take the key. You'll be needing it for dinner." },
      ] },
      { tone: 'passive', t: "In five years? Somewhere quiet. With you.", r: "With me. Somewhere quiet. With a garden and a ridiculous fern. Oh, the tears are coming. Take the key. Before I cry on it.", opts: [
        { tone: 'cold', t: "Don't cry. It's only a key.", r: "It's not only a key. To me it isn't. But okay. I'll stop crying. I'll go home and cry there. Happily." },
        { tone: 'passive', t: "I'll take it. Thank you. This means a lot.", r: "It means a lot to me too. Use it whenever. Even when I'm out. Make tea. Talk to Dennis. Be home." },
        { tone: 'flirty', t: "Cry on me instead. I'm waterproof.", r: "You're not waterproof, you're a racing driver! But you'll do. Come here. Happy crying incoming." },
        { tone: 'risque', t: "I'll use the key tonight. Wait up for me.", r: "I'll be waiting. In your hoodie, with the lamp on low. Hurry up, {me}. I mean it." },
      ] },
      { tone: 'flirty', t: "Five years? Waking up next to you, probably.", r: "Probably? Only probably? Okay. Definitely. Say definitely. Oh, you're grinning. Here. Take the key. Practise.", opts: [
        { tone: 'cold', t: "Probably. Let's not jinx it.", r: "Okay. Probably. I'll take probably. Probably's a nice word. I'll keep the key warm for you." },
        { tone: 'passive', t: "Definitely. Thank you. For the key, and everything.", r: "Everything? That's a big thank you. I'll take it. Dennis insisted on the key, by the way. He's very forward." },
        { tone: 'flirty', t: "I'll practise waking up with you tomorrow.", r: "Tomorrow? Good. And the day after. Practise every day. Practise makes perfect. Perfect makes me." },
        { tone: 'risque', t: "Practise tonight, then. Every bit of it.", r: "Every bit? Then you'll need more than practice. You'll need stamina. I'll bring snacks. Come on." },
      ] },
    ] },
  { id: 'sunny-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "I've got something for you. Close your eyes. Hold out your hand. Don't laugh. It's a key. To mine. Dennis said it was time.",
    opts: [
      { tone: 'cold', t: "Dennis is a plant.", r: "I know he's a plant. I was being - it doesn't matter. Do you want it or not? I'm feeling a bit silly now.", opts: [
        { tone: 'cold', t: "Not yet. Keep it.", r: "Okay. I'll put it back in my pocket. It's warm in there. It'll stay warm. I'm going to go, {me}." },
        { tone: 'passive', t: "Sorry. Yes. I want it. Of course I do.", r: "Oh, good. My heart stopped for a second. Here. It's got a strawberry on. You'll never lose it." },
        { tone: 'flirty', t: "Tell Dennis he has excellent timing.", r: "He'll be so smug. He's always smug. Here. Yours. Use it lots. Use it every time you're not racing." },
      ] },
      { tone: 'passive', t: "A key? That's... wow. Are you sure?", r: "So sure. I want you to have somewhere to come back to. Even if it's just a weekend. Even if you just sleep.", opts: [
        { tone: 'cold', t: "I'm not sure I'm ready.", r: "Okay. That's okay. The hook will hold it. Ready or not. Whenever. I'll just be sad." },
        { tone: 'passive', t: "Then I'll come back. Every time.", r: "Every time. Okay. I'll keep the kettle full. And Dennis watered. And the hoodie on the chair. For you." },
        { tone: 'flirty', t: "I'll come back. And I'll sleep a lot less than you think.", r: "Will you, now? Good. I'll have the sheets washed and the lamp on low. Don't keep me waiting." },
      ] },
      { tone: 'flirty', t: "Close my eyes? Is it a kiss?", r: "It's a key! But okay. It's a key and a kiss. There. Both. You're welcome. Now say yes to the key.", opts: [
        { tone: 'cold', t: "I'll think about the key.", r: "Okay. Think. The kiss stays. You can't give that back. The key can wait. I'll be over here, waiting." },
        { tone: 'passive', t: "Yes to the key. Yes to all of it.", r: "All of it! Okay. Then you're mine and I'm yours and here's a key. That's basically the whole plan." },
        { tone: 'flirty', t: "Another kiss and I'll say yes.", r: "That's blackmail. Lovely blackmail. Fine. There. Now say it. Say yes. You're grinning. That's a yes." },
        { tone: 'risque', t: "Yes. And I'm using it tonight to wake you up slowly.", r: "Slowly? Then I'll pretend to be asleep. For a very short time. I'm not a patient person anymore." },
      ] },
    ] },
  // ===================================================================== CLOSE 9: I love you (end of chapter)
  { id: 'sunny-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "I'm going to say something, even after last time. Even though I'm scared. I love you. I just do. I didn't want to wait for a perfect day.",
    opts: [
      { tone: 'cold', t: "I don't know what to say.", r: "You don't have to say anything. I didn't say it to get something back. I just needed you to know.", opts: [
        { tone: 'cold', t: "I can't say it back.", r: "Okay. I heard you. I'm glad I said it anyway. I'll always be glad. I'm going to go home now. Gently." },
        { tone: 'passive', t: "I'm sorry. I'm scared too. But I feel it.", r: "You feel it? Then that's enough. Scared together. We'll say it when you're ready. I'll wait." },
        { tone: 'flirty', t: "I'm an idiot. I love you. I really love you.", r: "You're not an idiot. You're a bit of an idiot. My idiot. Oh. You love me. Say it again." },
      ] },
      { tone: 'passive', t: "I'm sorry for all of it. And I love you.", r: "You do? Even after the wobbly bit? Oh. I've gone shaky. I said it and you said it back. Hold me up, please.", opts: [
        { tone: 'cold', t: "Let's not make a scene.", r: "No scene. Okay. I'll be a quiet, very happy person. Who's shaking. Inside. You won't even notice." },
        { tone: 'passive', t: "I've got you. I'm not letting go.", r: "Not letting go. Like the otters. Did I ever tell you about the otters? Doesn't matter. I love you." },
        { tone: 'flirty', t: "I love you. I'll say it every day.", r: "Every day? That's a slip a day! The jar's going to need a whole room. A whole house. Our house." },
        { tone: 'risque', t: "I love you. Let me show you how much. At home.", r: "Yes. Home. Ours, or mine, or yours. I don't care. I love you. Let's go before I cry on everyone." },
      ] },
      { tone: 'flirty', t: "Say it again. I want to hear it twice.", r: "I love you. I love you. There. Twice. That's two. Now you. Only if it's true. Please let it be true.", opts: [
        { tone: 'cold', t: "Not yet.", r: "Okay. Not yet. That's alright. I'll keep saying it until yet comes. Quietly. I'll be patient." },
        { tone: 'passive', t: "Me too. I'm sorry for being difficult.", r: "You're forgiven. For everything. Forever. My heart's doing cartwheels. I'm going to cry and laugh at once." },
        { tone: 'flirty', t: "I love you. Three times, to win.", r: "You can't win at love! Can you? You did. You won. I love you four times. I win. We both win." },
      ] },
    ] },
  { id: 'sunny-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "I've carried this around for weeks. I'm putting it down now. I love you. Like, love you. Don't say anything yet. Let me look at you.",
    opts: [
      { tone: 'cold', t: "I don't know if I'm there.", r: "That's okay. I didn't say it so you'd say it. I said it because it's true. It'll still be true when you're there.", opts: [
        { tone: 'cold', t: "Maybe not ever.", r: "Then I'll have loved you anyway. That's not wasted. Nothing kind is. Night, {me}. I'm alright." },
        { tone: 'passive', t: "I'm close. I promise. I'm just slow.", r: "Slow's fine. You're the fastest person I know, so slow's sort of nice. I'll wait for you to catch up." },
        { tone: 'flirty', t: "Okay, I lied. I'm there. I've been there.", r: "You've been there? This whole time? While I was terrified? Oh, you. I love you. Say it. Say it properly." },
      ] },
      { tone: 'passive', t: "Same. I love you.", r: "You do? You said it so easily. Like it's just true. It is just true. Oh. I'm going to write it on every slip I've got.", opts: [
        { tone: 'cold', t: "Don't make a big thing of it.", r: "It is a big thing, though. The biggest. But okay. I'll make it a big thing at home. On my own. Happily." },
        { tone: 'passive', t: "Simple as that. I love you.", r: "Again! Okay. I'm keeping this one forever. It's the best day. Not because it's perfect. Because it's us." },
        { tone: 'flirty', t: "Write it on me instead.", r: "On you? With a pen? I'll write it on your hand. Tiny. 'Loved.' There. Now you can't forget." },
        { tone: 'risque', t: "I love you. Take me home and I'll prove it all night.", r: "All night? I'm holding you to every minute. Then breakfast. Then more proving. I love you. Let's go." },
      ] },
      { tone: 'flirty', t: "Look all you want. Then I'll say it back.", r: "Okay. Looking. You've got the softest face when you're about to say something big. Go on. I'm ready. I think.", opts: [
        { tone: 'cold', t: "Actually, I can't. Not yet.", r: "Okay. That's alright. I'm still looking at you. I'll still love you tomorrow. You can say it then." },
        { tone: 'passive', t: "I love you. I have for ages.", r: "For ages? You've been sitting on it! Oh, I'm so cross and so happy. Mostly happy. Completely happy." },
        { tone: 'flirty', t: "I love you. And your pink face. Especially that.", r: "My pink face loves you too. It's never been pinker. It's going to stay this colour forever now." },
      ] },
    ] },
  { id: 'sunny-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "Come here. Closer. I want to tell you something, and I want to be close when I do. I love you. There. I said it first. I win.",
    opts: [
      { tone: 'cold', t: "That's a lot to drop on me.", r: "Is it? I'm sorry. I didn't mean to drop it. I meant to give it. Gently. You don't have to pick it up yet.", opts: [
        { tone: 'cold', t: "I'm not picking it up.", r: "Okay. I'll leave it there. It's still yours. It always will be. I'm going to go home, {me}. Gently." },
        { tone: 'passive', t: "No. I'm sorry. It's just big. I feel it too.", r: "You feel it too? Then it's not dropped. It's shared. That's lighter. Much lighter. Thank you." },
        { tone: 'flirty', t: "Picking it up. I love you back.", r: "You do? Oh. Then we both win. That's how this game works. Everyone wins. Kiss me." },
      ] },
      { tone: 'passive', t: "You win. I love you as well.", r: "Too! You said too! Oh, I'm so happy I could burst. I'm going to tell Gran. And Dennis. And the jar. Everyone.", opts: [
        { tone: 'cold', t: "Maybe keep it between us.", r: "Okay. Just us. That's lovely too. A secret. Our secret. I'll only tell Dennis. He doesn't count." },
        { tone: 'passive', t: "Tell everyone. I don't mind.", r: "Everyone? Okay. I'm going to tell the bus driver. And the corner shop. They'll be so pleased for us." },
        { tone: 'flirty', t: "Tell them later. Kiss me now.", r: "Later. Yes. Now kissing. Now loving you. Now - mm. Oh. That's the best kiss. That's the I-love-you kiss." },
        { tone: 'risque', t: "Tell them tomorrow. Tonight you're all mine.", r: "All yours. Tonight and tomorrow and every night after. Take me home. I love you. Walk faster." },
      ] },
      { tone: 'flirty', t: "You win? I've been saying it in my head for weeks.", r: "In your head? For weeks? That doesn't count! You have to say it out loud! Say it! Say it now!", opts: [
        { tone: 'cold', t: "I'll say it when I'm ready.", r: "Okay. When you're ready. I'll be here. I'll know. You'll get that soft face. I'll wait for it." },
        { tone: 'passive', t: "I love you. Out loud. There.", r: "There! Out loud! Oh, I heard it. Everyone heard it. I don't care. I love you. I love you. I love you." },
        { tone: 'flirty', t: "I love you. Now kiss me, winner.", r: "Winner's kiss. Here. The best prize. Better than a trophy. Better than a podium. Better than anything." },
        { tone: 'risque', t: "I love you. Now take me home and let me prove it.", r: "Prove it all you like. I'll prove it back. We'll be up till morning. I love you, you menace. Let's go." },
      ] },
    ] },
];
