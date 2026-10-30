// Sunny - in-person conversations, stage 'close' (dating / together).
export const DATA = [
  // -------------------------------------------------------------- CLOSE / COLD
  {
    id: 'sunny-close-cold-1', stage: 'close', mood: 'cold',
    say: "You've been quiet with me lately. I'm not mad. I just miss you, and you're right here, which is confusing.",
    opts: [
      { tone: 'cold', t: "I'm busy. Not everything's about us.", r: "I know it isn't. I just wanted a little bit to be about us. Even ten minutes. That's all.", opts: [
        { tone: 'cold', t: "I don't have ten minutes.", r: "Then I'll stop asking for them. I love you, but I won't beg. I'm going to go home." },
        { tone: 'passive', t: "You're right. I've been shutting you out. I'm sorry.", r: "Thank you. Come here. I can do busy, I can do grumpy. I just can't do you being far away." },
        { tone: 'flirty', t: "Ten minutes? Take an hour. I've missed you too.", r: "An hour? Don't tease me if you don't mean it. You mean it? Okay. I'm taking it. All sixty." },
      ] },
      { tone: 'passive', t: "I know. It's the season. I've been stuck in my head. I'm sorry.", r: "I figured it was that. I just needed to hear you say it. Can I help? Even just by sitting with you?", opts: [
        { tone: 'cold', t: "You can't help. Nobody can.", r: "Maybe not fix it. But I can sit. I'll still sit, if you let me. If not, I'll go. Your call." },
        { tone: 'passive', t: "Sit with me. That helps more than you know.", r: "Then I'm sitting. Here. Lean on me. I've got snacks in my bag and nowhere to be." },
        { tone: 'flirty', t: "You can help. Come closer. Closer than that.", r: "This close? Okay. I'm not even mad anymore. It's very hard to be sad at this distance." },
      ] },
      { tone: 'flirty', t: "Then let me fix confusing. Come here.", r: "Is this you fixing it, or you dodging it? I'll take a hug, but I want the talk after.", opts: [
        { tone: 'cold', t: "There's nothing to talk about.", r: "There is, though. And if you won't, I'll step back. I'm not angry. I'm just tired of guessing." },
        { tone: 'passive', t: "Hug first, talk after. I promise.", r: "Hug first. Pinky promise on the talk? Good. You're still my favourite, even when you're quiet." },
        { tone: 'flirty', t: "Both. I'll talk, then kiss you until you're not confused.", r: "That's a very good plan. Talk, then kiss. In that order. Don't skip ahead, I know you." },
      ] },
    ],
  },
  {
    id: 'sunny-close-cold-2', stage: 'close', mood: 'cold', where: 'party',
    say: "I saw you laughing with that crowd all night. I'm not jealous. I'm a little jealous. Are we okay?",
    opts: [
      { tone: 'cold', t: "I'm allowed to talk to people.", r: "Of course you are. I'm not saying you can't. I just felt like a coat on a chair tonight.", opts: [
        { tone: 'cold', t: "Then go home if you're bored.", r: "I think I will. I'm not doing this here. I'll see you when you want to see me." },
        { tone: 'passive', t: "You're not a coat. I got carried away. I'm sorry.", r: "Thank you. I'm being a bit silly, I know. Come and get a drink with me. Just us, for a minute." },
        { tone: 'flirty', t: "You're the only one I'm going home with, though.", r: "That helps a lot more than it should. But I want a dance. Now. To make up for it." },
      ] },
      { tone: 'passive', t: "We're okay. They're sponsors. I was being polite.", r: "Polite for three hours? Okay, I believe you. Mostly. I just missed you. Even across the room.", opts: [
        { tone: 'cold', t: "It's work. You'll have to get used to it.", r: "I can get used to it. I'd just like you to notice me while I do. I'll be by the snacks." },
        { tone: 'passive', t: "I missed you too. I kept looking over.", r: "Did you? I didn't see! I was busy pretending I wasn't looking at you. We're both silly." },
        { tone: 'flirty', t: "I'll make it up to you. Slow dance, now, in front of all of them.", r: "In front of ALL of them? The sponsors? Oh, that's so... yes. Yes. Let them look." },
      ] },
      { tone: 'flirty', t: "A little jealous is cute on you. Come here.", r: "Don't 'come here' me, I'm being serious! A bit serious. Okay, I'm coming here. But I'm still serious.", opts: [
        { tone: 'cold', t: "Fine, be serious on your own.", r: "I will. That wasn't fair, though. I'll get a taxi. Enjoy your crowd." },
        { tone: 'passive', t: "Seriously, though. You're the person I want to be with tonight.", r: "That's the thing I needed. Just that. Jealousy officially over. Mostly over. Ninety percent." },
        { tone: 'flirty', t: "Be serious later. Right now, kiss me.", r: "Right here? With everyone? You're impossible. Fine. Fine! There. Now they're all jealous of ME." },
      ] },
    ],
  },
  {
    id: 'sunny-close-cold-3', stage: 'close', mood: 'cold',
    say: "I saved you a slice of cake after last time. I ate half of it while being sad. The other half's still yours.",
    opts: [
      { tone: 'cold', t: "I don't want cake.", r: "Oh. It wasn't really about the cake. I was trying to say I'm still here. I'll eat the rest, then.", opts: [
        { tone: 'cold', t: "Eat it. I don't care.", r: "I think I need a night on my own, {me}. I'll call you when I'm not sad. Or you can call me." },
        { tone: 'passive', t: "Sorry. I'd love the cake. And I'm sorry about last time.", r: "Here. Lemon drizzle. The good half, with the crunchy edge. I forgive you. I already had." },
        { tone: 'flirty', t: "I want you, not cake. Is that allowed?", r: "That's allowed. That's very allowed. But you're also having the cake. I didn't save it for nothing." },
      ] },
      { tone: 'passive', t: "You're too good to me. I'm sorry I was like that.", r: "I'm not too good. I'm just good to you. That's different. Here. Lemon drizzle. Eat and talk to me.", opts: [
        { tone: 'cold', t: "Can we skip the big talk?", r: "We can skip it tonight. But it was a thing, and you know it. I'll leave it there for now." },
        { tone: 'passive', t: "It's amazing. Did you bake it? It tastes like your kitchen.", r: "It does taste like my kitchen! A bit burnt, a bit of love. I made it on Sunday, missing you." },
        { tone: 'flirty', t: "Next time I'm sad, you can sit on my lap and feed me cake.", r: "On your LAP? With a fork? I'll miss and get you in the eyebrow. I'm grinning. Fine. Deal." },
      ] },
      { tone: 'flirty', t: "Sad cake? Come here. I'll fix the sad, you fix the cake.", r: "Good trade, but you've got the hard job. The sad's quite big this time. Start with a hug.", opts: [
        { tone: 'cold', t: "Hugs don't fix anything.", r: "They fix a lot, actually. But not if you don't want to give them. I'll go." },
        { tone: 'passive', t: "Big hug, then. And I'll listen. Tell me what stung.", r: "When you went quiet, it felt like I'd vanished. I don't like vanishing. Thank you for listening." },
        { tone: 'flirty', t: "A hug, then a kiss for every bite you ate while sad.", r: "That's four kisses. Five. I'm rounding up. I'm a fair person. A fair person who missed you lots." },
      ] },
    ],
  },
  {
    id: 'sunny-close-cold-4', stage: 'close', mood: 'cold',
    say: "I'm not going to pretend last time was fine. It stung. But I'd rather talk it through than tiptoe round you.",
    opts: [
      { tone: 'cold', t: "It's not a big deal. You're making it one.", r: "Maybe I am. But it's big to me. I'd like it to be a bit big to you too. Can it be?", opts: [
        { tone: 'cold', t: "No. It's really not.", r: "I hear you. I'm going to take some time, {me}. Not for good. Just for tonight." },
        { tone: 'passive', t: "You're right. It mattered. I'm sorry.", r: "Thank you. That's what I needed. I love you, you know. Even when you're a grumpy hedgehog." },
        { tone: 'flirty', t: "Let me make it big. Big apology, big dinner, big kiss.", r: "Big kiss is a strong closer. Big apology first, though. I'm not that easy. Okay, I'm quite easy. Go on." },
      ] },
      { tone: 'passive', t: "I'm glad you said it. I was out of order. What do you need?", r: "Just that. And to know you'll tell me when you're struggling, instead of going cold on me.", opts: [
        { tone: 'cold', t: "I can't promise that.", r: "Then I'll have to protect myself a bit. That's not a punishment. It's just looking after me." },
        { tone: 'passive', t: "I'll try. I'll text you a weather report. 'Grumpy, light drizzle.'", r: "A mood forecast! Perfect. I'll send mine too. Today's is 'clearing, sunny spells later'." },
        { tone: 'flirty', t: "I promise. And I'll make the forecasts flirty.", r: "'Warm front moving in, high chance of kissing.' Oh no, I've started. We're doing this forever now." },
      ] },
      { tone: 'flirty', t: "Tiptoe? I'd rather you ran at me.", r: "Ran at you! Like in a film? That's very sweet, but you're dodging. I'll run at you after we talk.", opts: [
        { tone: 'cold', t: "Dodging's easier.", r: "Easier for you. Not for me. I'm going to go for a walk. Message me when you're ready." },
        { tone: 'passive', t: "You're right. Sorry. Let's talk properly. I'm listening.", r: "Thank you. I'm so relieved. I'll keep it short, then I'll run at you. Promise." },
        { tone: 'flirty', t: "Talk, then run. I'll keep my arms open.", r: "Arms open! Now I can't concentrate on being upset. That's a cheat. A lovely, lovely cheat." },
      ] },
    ],
  },

  // ----------------------------------------------------------- CLOSE / PASSIVE
  {
    id: 'sunny-close-passive-1', stage: 'close', mood: 'passive',
    say: "Tell me something you've never told anyone. It can be tiny. I collect tiny things about you. I've got a jar.",
    opts: [
      { tone: 'cold', t: "Some things are private.", r: "Of course. I'm not trying to pry. I just love knowing you. But I'll back off, I promise.", opts: [
        { tone: 'cold', t: "Then don't ask.", r: "Okay. I won't. I'll leave the jar where it is. See you later, {me}." },
        { tone: 'passive', t: "Fine. I still sleep with the landing light on.", r: "That's going straight in the jar. Mine is I still check under the bed. We'll leave both on." },
        { tone: 'flirty', t: "Here's one. I practise saying your name before I ring you.", r: "You do NOT. You do? Oh my gosh. That's the best thing in the jar now. It's taking up the whole jar." },
      ] },
      { tone: 'passive', t: "I cried at a cartoon about a robot on the plane last month.", r: "The one with the robot who loves the plant? I sobbed at that too! We're the same person. A soft one.", opts: [
        { tone: 'cold', t: "It was a long flight. Don't read into it.", r: "Okay. It's still going in the jar, though. It's a nice one. Even if you're grumpy about it." },
        { tone: 'passive', t: "Your turn. Something tiny.", r: "I name the pigeons outside my window. There's Clive, Fiona and Small Clive. Small Clive's my favourite." },
        { tone: 'flirty', t: "You're the only one I'd tell. That's sort of the point.", r: "Oh. That's lovely. I'm the only one. I'm going to need a bigger jar. And a hug." },
      ] },
      { tone: 'flirty', t: "I fell for you before you even told me your name.", r: "Before my NAME? We met at the coat rack! I'd dropped a glove! Really? Over a glove?", opts: [
        { tone: 'cold', t: "Okay, maybe not before your name.", r: "You can't put it in the jar and take it out again! Fine. I'll put it back on the shelf." },
        { tone: 'passive', t: "Over a glove. You said sorry to it.", r: "I DID say sorry to it! I've always been like this. And you liked it. That's amazing." },
        { tone: 'flirty', t: "Over a glove. And I'd do it again. Every day.", r: "You'd fall for me every day? I'm going to drop a glove every morning now. Just to check." },
      ] },
    ],
  },
  {
    id: 'sunny-close-passive-2', stage: 'close', mood: 'passive', where: 'evening',
    say: "I reorganised your spice cupboard. Alphabetically. Please don't be cross, it was calling to me while you were on the phone.",
    opts: [
      { tone: 'cold', t: "I liked it how it was.", r: "Oh. I'm sorry. I can put it back. I took a photo first. I always take a photo first.", opts: [
        { tone: 'cold', t: "Put it back, please.", r: "Okay. I'll put it back. I'll go home after, I think. I've overstepped tonight." },
        { tone: 'passive', t: "No, leave it. Sorry, I'm tired. It looks great.", r: "Really? Thank you. Look, paprika's next to pepper now. They're friends. Everyone's happy." },
        { tone: 'flirty', t: "Leave it. Now I'll think of you every time I cook.", r: "Every time you reach for the cumin, you'll think of me. That's my legacy. Cumin." },
      ] },
      { tone: 'passive', t: "You alphabetised them? I didn't even know I owned cardamom.", r: "You owned THREE cardamoms! All open. I combined them. We're a one-cardamom household now. You're welcome.", opts: [
        { tone: 'cold', t: "Household's a big word.", r: "It was a joke. Mostly. Okay. I'll stop putting big words on small spices." },
        { tone: 'passive', t: "One-cardamom household. Put that on the fridge.", r: "I will! I'll make a little sign. With a drawing of you as a cardamom pod. You'll be very green." },
        { tone: 'flirty', t: "A household, are we? I could get used to that.", r: "Could you? Because I could too. I'd organise your cupboards forever. Is that a proposal? No! Not yet." },
      ] },
      { tone: 'flirty', t: "If this is what you do while I'm on the phone, I'm never hanging up.", r: "That's not the reward you think it is, {me}! Next I'll do your socks. By colour. In rainbow order.", opts: [
        { tone: 'cold', t: "Stay out of my sock drawer.", r: "Fine. No socks. I was joking. Mostly. I'll stay in the kitchen." },
        { tone: 'passive', t: "Do the socks. Honestly. They need help.", r: "They need SO much help. I'll get snacks and we'll do it together. A sock date. The best kind." },
        { tone: 'flirty', t: "Come here and organise me instead.", r: "Organise you? Where would I start? Here, maybe. Your collar's crooked. And now I'm kissing you. Oops." },
      ] },
    ],
  },
  {
    id: 'sunny-close-passive-3', stage: 'close', mood: 'passive',
    say: "Can I ask a big one? Where do you see yourself in five years? Not racing. You. Am I in it? No pressure! Some pressure.",
    opts: [
      { tone: 'cold', t: "I don't plan that far ahead.", r: "Oh. I do, I'm a planner. I've got a notebook. It's fine if you don't. I just... hoped.", opts: [
        { tone: 'cold', t: "Don't put me in your notebook.", r: "That's a hard thing to hear. I'll close the notebook for now. I need a bit of air." },
        { tone: 'passive', t: "Sorry. I don't plan, but if I did, you'd be in it.", r: "That's a very good not-a-plan. I'll write it down for you. In pencil. We can rub bits out." },
        { tone: 'flirty', t: "I don't plan. But I know I want to wake up next to you for most of it.", r: "Most of it? Not all? I'm teasing. That's my favourite answer. I've gone a bit teary." },
      ] },
      { tone: 'passive', t: "Somewhere by the sea. A dog. You burning toast in the kitchen.", r: "Burning toast! That's so accurate it's rude. A dog! What kind? I need to know what kind of dog.", opts: [
        { tone: 'cold', t: "Doesn't matter what kind.", r: "It matters a bit to me! Fine. A dog-shaped dog. I'll pick." },
        { tone: 'passive', t: "Something scruffy that sheds everywhere and loves you more than me.", r: "A scruffy shedder! We'll call it Biscuit. Biscuit's going to love you most, I can tell already." },
        { tone: 'flirty', t: "Something lazy, so we can stay in bed all Sunday.", r: "A lazy dog and lazy Sundays. You've thought about this! I'm melting. I'm a puddle on your floor." },
      ] },
      { tone: 'flirty', t: "You're in every version. Usually wearing my jumper.", r: "Your blue one? Obviously. I've already stolen it. It lives at mine now. Five years early. Hehe.", opts: [
        { tone: 'cold', t: "I want that jumper back, actually.", r: "Oh. Okay. I'll bring it back. Washed. Folded. I didn't think it mattered." },
        { tone: 'passive', t: "Keep it. It suits you better anyway.", r: "It really does. I'll wear it while you're away, and when you're home it'll smell like both of us." },
        { tone: 'flirty', t: "Keep it. I'll steal it back while you're wearing it.", r: "While I'm WEARING it? You'll have to catch me first. I'm small but I'm slippery. Try it." },
      ] },
    ],
  },
  {
    id: 'sunny-close-passive-4', stage: 'close', mood: 'passive',
    say: "I've started saying 'box box' when I need to leave a room. My boss looked at me so strangely. You've ruined me.",
    opts: [
      { tone: 'cold', t: "Don't use that in public. It's embarrassing.", r: "Is it? I thought it was cute. Okay. I'll keep it for home. I didn't mean to embarrass you.", opts: [
        { tone: 'cold', t: "Keep it for nowhere.", r: "That's a little sad, but okay. I'll stop borrowing your words. See you, {me}." },
        { tone: 'passive', t: "Sorry, I didn't mean that. It's actually adorable.", r: "Phew! You scared me. I'm saying it in the supermarket now. Box box, cereal aisle." },
        { tone: 'flirty', t: "Kidding. Say it to me tonight and I'll come running.", r: "Box box means come in to me? Okay. That's ours. Don't tell your team. They'll be jealous." },
      ] },
      { tone: 'passive', t: "Ha! What did you tell your boss it meant?", r: "I said it's Swedish for 'I need the loo'. I don't know why Swedish. I panicked. They believed me!", opts: [
        { tone: 'cold', t: "That's a weird thing to lie about.", r: "It is weird. I'm weird. I thought you liked that bit. Never mind." },
        { tone: 'passive', t: "That's genius. I'm telling the team. They'll love you.", r: "Your team will think I'm a lunatic! A lovable one, I hope. Tell them I say hi. And box box." },
        { tone: 'flirty', t: "You're so cute I can't stand it. Come here.", r: "I'm not cute, I'm a liar now! A cute liar. Okay. Coming. Box box. Hehe." },
      ] },
      { tone: 'flirty', t: "You're picking up my habits. Next you'll steal my side of the bed.", r: "Already done! You just haven't noticed because you sleep like a starfish. A big fast starfish.", opts: [
        { tone: 'cold', t: "I'd like my side back, then.", r: "Oh. I'll stay on mine. I wasn't trying to take anything. I'll keep to my edge." },
        { tone: 'passive', t: "A starfish? That's slander. Fine. Maybe true.", r: "It's VERY true. I took a picture. I'm saving it for a rainy day. Or our wedding. Kidding! Sort of." },
        { tone: 'flirty', t: "Then tonight I'll stay on my side. Until you come over.", r: "Until I come over. Which I will. In about four seconds. You've been warned. I'm a tactical sleeper." },
      ] },
    ],
  },

  // ------------------------------------------------------------ CLOSE / FLIRTY
  {
    id: 'sunny-close-flirty-1', stage: 'close', mood: 'flirty',
    say: "Hi, you. I missed you so much today I hugged your hoodie. On the sofa. For an hour. Don't laugh. Okay, laugh a bit.",
    opts: [
      { tone: 'cold', t: "That's a bit much.", r: "Oh. Is it? I thought we were... okay. It was a nice hour. You don't have to make it sound silly.", opts: [
        { tone: 'cold', t: "It is silly.", r: "Then I'll keep my silly to myself for a while. I'll get my coat, I think." },
        { tone: 'passive', t: "Sorry. It's sweet. I've had a rough one. I missed you too.", r: "Okay. Rough one forgiven. Come and sit. The hoodie's on the sofa. It missed you too." },
        { tone: 'flirty', t: "A bit much. So come here and hug the real thing instead.", r: "You nearly got told off! Fine. Real thing it is. The real thing's warmer anyway. Mm. Much warmer." },
      ] },
      { tone: 'passive', t: "I missed you too. The hotel was so quiet without you rambling.", r: "I don't ramble! I chat. Extensively. Did you sleep? You never sleep in hotels. You do the toss and turn.", opts: [
        { tone: 'cold', t: "I slept fine. Stop fussing.", r: "Okay. No fussing. I'll put the fuss away. It's just love dressed up as questions." },
        { tone: 'passive', t: "Not really. I kept reaching for you.", r: "Oh, {me}. Come home soon, then. I'll keep your side warm. I'll lie on it. Tactically." },
        { tone: 'flirty', t: "Ramble at me all night. I'll fall asleep to it.", r: "All night? I've got so much to tell you. The pigeon thing. And other things. Close-up things." },
      ] },
      { tone: 'flirty', t: "Lucky hoodie. Tonight I'm taking its place.", r: "Oh, are you? You'll have to be very cuddly. The hoodie set a high bar. It's very soft.", opts: [
        { tone: 'cold', t: "Actually, I'm exhausted. Another night.", r: "Oh. That's alright. I'll just hug the hoodie again. It never cancels on me." },
        { tone: 'passive', t: "I'll do my best. I'll even let you pick the film.", r: "Film and cuddles! The one with the penguins. Again. Don't make that face, it's a love story." },
        { tone: 'flirty', t: "Softer than the hoodie. And I kiss back.", r: "The hoodie definitely doesn't kiss back. You win. Okay, you can come in. Shoes off. Kiss on." },
      ] },
      { tone: 'risque', t: "Next time, skip the hoodie. Wait for me in bed.", r: "Done. I'll be the one in bed with the lamp low and a very smug face. Don't be late, racer.", opts: [
        { tone: 'cold', t: "Actually, never mind. Not tonight.", r: "You started it! Okay. Not tonight. I'll be in bed, alone, with the hoodie. Night." },
        { tone: 'passive', t: "And then sleep. I really am shattered.", r: "Sleep's good too. I'll be your little spoon. Or big. I'm flexible. Night night, racer." },
        { tone: 'flirty', t: "I'll drive home fast. Legally fast.", r: "Legally fast is my favourite speed. Door's on the latch. Lamp's low. Hurry up." },
        { tone: 'risque', t: "Leave the lamp on. I want to see that smug face.", r: "Lamp on, door open, smug face ready. I've gone very quiet. That's my 'come here' quiet. You know it." },
      ] },
    ],
  },
  {
    id: 'sunny-close-flirty-2', stage: 'close', mood: 'flirty', where: 'party',
    say: "Everyone's dancing and I only want to dance with you. Too sappy? I've had one glass of fizz, I'm allowed sappy.",
    opts: [
      { tone: 'cold', t: "Too sappy. I'm talking to people.", r: "Oh. I'll go and be sappy by myself, then. Over by the speakers. They don't mind.", opts: [
        { tone: 'cold', t: "Sure. I'll find you later.", r: "Later. I might not be here later, {me}. I'm not waiting by the speakers all night." },
        { tone: 'passive', t: "Sorry. Give me two minutes, then I'm yours.", r: "Two minutes. I'm counting. Out loud. One... two... I'm joking. Mostly. Hurry up." },
        { tone: 'flirty', t: "Kidding. Sappy is my favourite flavour of you.", r: "You've got flavours of me? What are the others? Tell me while we dance. Come on, it's a good one." },
      ] },
      { tone: 'passive', t: "Never too sappy. Come on, before the song ends.", r: "Before it ends! Run! Oh, I love this one. It's the one from the kitchen. Remember the kitchen?", opts: [
        { tone: 'cold', t: "Not really.", r: "You don't remember? We danced in socks. It's fine. I'll remember it for both of us." },
        { tone: 'passive', t: "Spaghetti on the floor and you in my socks. Of course I do.", r: "You remember the spaghetti! That's my favourite night. I'm smiling so much my cheeks hurt." },
        { tone: 'flirty', t: "I remember. We never actually finished dinner.", r: "We never finished dinner. I've gone pink just thinking about why. Shh. Dance. Dance, you." },
      ] },
      { tone: 'flirty', t: "Sappy and tipsy? Then I'm not letting you out of my arms.", r: "Good. I don't want to be let out. I want to be kept in. Like a nice jam. In a jar. Your arms are the jar.", opts: [
        { tone: 'cold', t: "Don't spill your drink on me.", r: "I'm not going to spill... fine. I'll put it down. You're being a bit of a grump." },
        { tone: 'passive', t: "A jam in a jar. You're definitely on your one glass.", r: "One glass and half of yours. Fine, I'm strawberry jam. You'll have to keep me in the fridge." },
        { tone: 'flirty', t: "Sweetest jam I've ever tasted.", r: "You're so smooth tonight. Glass down. Both arms round your neck. There. Caught you." },
      ] },
      { tone: 'risque', t: "One song. Then I'm taking you home, and neither of us is sleeping.", r: "One song? That's a very short wait. Make it a slow one, then. I want you thinking about it the whole time.", opts: [
        { tone: 'cold', t: "On second thoughts, I'm staying a while.", r: "You put that in my head and then stayed? Rude. I'll be at the bar, then." },
        { tone: 'passive', t: "Maybe a bit of sleep. I've got a sim session tomorrow.", r: "A bit of sleep. I'll allow a bit. Then breakfast. I'm making you eggs whether you like it or not." },
        { tone: 'flirty', t: "Slow song. Then my coat, your hand, the door.", r: "Coat, hand, door. Memorised. You're not the only one who can be fast, you know." },
      ] },
    ],
  },
  {
    id: 'sunny-close-flirty-3', stage: 'close', mood: 'flirty',
    say: "I've been thinking about kissing you since you landed. That's a long time to think about one thing. I'm very focused.",
    opts: [
      { tone: 'cold', t: "Not here. People are watching.", r: "Oh. Sorry. I didn't mean right here, in front of everyone. I just meant... I missed you.", opts: [
        { tone: 'cold', t: "I'd rather keep it private.", r: "Private. I understand. It just feels like you're keeping me private too. I'll give you space." },
        { tone: 'passive', t: "Sorry. I'm just aware of the cameras. I missed you too.", r: "I forget about the cameras. I forget everything around you. Okay. Later. I'll save it." },
        { tone: 'flirty', t: "Not here. Somewhere I can do it properly.", r: "Properly? That's a very good correction. I'll find somewhere. I know a cupboard. Kidding! There's a garden." },
      ] },
      { tone: 'passive', t: "Since I landed? Through the whole dinner?", r: "Through dinner, dessert, and your story about the gearbox. I loved the story. I was also distracted.", opts: [
        { tone: 'cold', t: "So you weren't listening.", r: "I was listening! I can listen and miss you at once. I'm good at two things. Fine. I'll stop." },
        { tone: 'passive', t: "I'll tell the gearbox story again. Slower.", r: "Slower is good! Then I'll ask questions. And then I'll kiss you. It's a whole programme." },
        { tone: 'flirty', t: "Then stop thinking about it.", r: "Stop thinking? Like... do it? Oh. Okay. Hi. Hello. That was worth the wait. Again, please." },
      ] },
      { tone: 'flirty', t: "I've been thinking about it since the airport too. Want to stop thinking?", r: "Yes. Very yes. Come here before I change my mind. I won't change my mind. Come here anyway.", opts: [
        { tone: 'cold', t: "Later. I'm not in the mood now.", r: "Oh. I misread it. That's alright. Later. Maybe. If you remember me." },
        { tone: 'passive', t: "Here's a quick one. We've got a table booked.", r: "A quick one! That was a nice quick one. I'll be thinking about the slow one now. Dinner's ruined." },
        { tone: 'flirty', t: "Close your eyes. Don't open them till I say.", r: "Eyes closed. I'm smiling. I can feel you smiling. Hurry up, {me}. I'm very... oh. There it is." },
      ] },
      { tone: 'risque', t: "Focus on that and come home with me. The kissing doesn't have to stop.", r: "Doesn't have to stop? Then neither do I. Get your keys. I'm not blushing this time. I'm just ready.", opts: [
        { tone: 'cold', t: "Let's not rush. I'm tired.", r: "You can't say that and then be tired! Okay. Rest. I'll be less ready tomorrow. Probably not." },
        { tone: 'passive', t: "And then tea, and the penguin film.", r: "Tea and penguins after. You're so soft. That's the best part of you. Well. One of the best parts." },
        { tone: 'flirty', t: "Keys are in my hand. Race you to the car.", r: "You'll win, you always win. But I'll be right behind you. Closer than your racing rules allow." },
      ] },
    ],
  },
  {
    id: 'sunny-close-flirty-4', stage: 'close', mood: 'flirty', where: 'evening',
    say: "Dinner was perfect. I'm not ready to go home yet. Can we stay out a bit longer? Or... stay in a bit longer? At yours?",
    opts: [
      { tone: 'cold', t: "I've got an early start. Another night.", r: "Oh. Of course. Early starts. I forget you have those. I'll just get the bus, then.", opts: [
        { tone: 'cold', t: "Yeah, probably best.", r: "Goodnight, {me}. Thank you for dinner. I'm a bit sad, but I'll be okay." },
        { tone: 'passive', t: "Sorry. Let me at least walk you to the stop.", r: "I'd like that. Hold my hand on the way? We can be slow walkers. Slow walkers get more time." },
        { tone: 'flirty', t: "Early start. But I've changed my mind. Stay in, at mine.", r: "You changed your mind? For me? I'm getting my coat. Don't you dare change it back." },
      ] },
      { tone: 'passive', t: "Let's walk by the river first. It's lovely at night.", r: "The river! With the little lights? Yes! I'll hold your arm and point at every duck. There'll be ducks.", opts: [
        { tone: 'cold', t: "It's freezing. Let's just go.", r: "Oh. Freezing is fair. I'll stop pointing at ducks. Let's get a cab." },
        { tone: 'passive', t: "Point at every duck. I'll name them.", r: "You'll name them? That one's yours. What's it called? Oh, 'Brakes'. Hehe, of course it is." },
        { tone: 'flirty', t: "And at the end of the river, my place.", r: "The end of the river is your place? That's not how rivers work. But okay. Let's walk very fast." },
      ] },
      { tone: 'flirty', t: "Stay in. I'll make you hot chocolate and you can steal my jumper.", r: "Hot chocolate and your jumper? You know exactly how to get me. I'm already at the door. Hurry up.", opts: [
        { tone: 'cold', t: "Actually, I'm shattered. Rain check?", r: "You said jumper and everything. Okay. Rain check. Night, {me}." },
        { tone: 'passive', t: "Proper hot chocolate. Marshmallows and everything.", r: "Marshmallows! You know me so well. I'm so happy. Like a dog in a car with the window down." },
        { tone: 'flirty', t: "Hot chocolate, jumper, and me keeping you warm in it.", r: "That jumper's going to be very crowded. I don't mind. I'll make room. Take me home, {me}." },
      ] },
      { tone: 'risque', t: "Stay in. And stay the night. Breakfast is my treat.", r: "The night and breakfast? I thought you'd never ask. I've had a toothbrush in my bag for three dates.", opts: [
        { tone: 'cold', t: "On second thoughts, I need sleep before training.", r: "You asked me! Okay. Sleep. I'll take my toothbrush home. Very slowly. Very sadly." },
        { tone: 'passive', t: "Three dates? You're such a planner.", r: "I'm a planner! Page one of my notebook: toothbrush. Page two: you. Page three's a secret." },
        { tone: 'flirty', t: "Then let's not waste a minute of the night.", r: "Not one. Take my hand. Walk faster. I'll race you this time, and I'm going to win." },
        { tone: 'risque', t: "Three dates? Then I've got a lot of catching up to do tonight.", r: "So have I. I'm not shy tonight, {me}. Not even a bit. Taxi. Now. Before I lose my nerve. I won't." },
      ] },
    ],
  },
];
