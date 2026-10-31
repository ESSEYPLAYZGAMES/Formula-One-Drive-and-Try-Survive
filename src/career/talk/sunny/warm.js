// Sunny (SWEET) - in person, stage 'warm': getting closer, flirting, plans. 9 story slots x 3 opening moods.
export const DATA = [
  // ===================================================================== WARM 1: the crater cake
  { id: 'sunny-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "I baked you a lemon drizzle to say sorry for whatever went wrong last time. It sank in the middle. Mine always do. It's a crater cake.",
    opts: [
      { tone: 'cold', t: "You don't need to bake me things.", r: "Need doesn't come into it. I wanted to. I'm trying to work out what I did. It's easier with cake in my hands.", opts: [
        { tone: 'cold', t: "You didn't do anything. Just take the cake back.", r: "Okay. I'll take it home. It can sink further on my kitchen table. I'm sorry it went flat between us." },
        { tone: 'passive', t: "Sorry. Thank you. You didn't do anything wrong.", r: "Really? Oh, that's such a relief. Here. Have the crater cake. The crater's where the love pools." },
        { tone: 'flirty', t: "I'll take it if you sit with me while I eat it.", r: "That's a deal. I'll sit. I'll watch you eat my crater cake. I'm pink already. It's the lemon." },
      ] },
      { tone: 'passive', t: "A crater cake. I love it already. Thank you.", r: "You do? Okay. Phew. I wasn't sure you'd want anything from me. Last time I felt like a wrong note.", opts: [
        { tone: 'cold', t: "Let's not go over it again.", r: "Okay. No going over. I'll just hand you the cake and be quiet. Sorry. I do worry at things." },
        { tone: 'passive', t: "You weren't a wrong note. I was in a mood. I'm sorry.", r: "That means more than you'd think. Eat the crater bit first. That's the best bit, I swear." },
        { tone: 'flirty', t: "You're my favourite note. Even when I'm out of tune.", r: "Oh, that's gloriously cheesy. I love it. Okay, I've forgiven you entirely. Have the cake. Have two slices." },
      ] },
      { tone: 'flirty', t: "You baked for me? I must have been forgiven already.", r: "Not quite. Half-forgiven. The cake is the other half. It sank, so I suppose you're three-quarters there.", opts: [
        { tone: 'cold', t: "I didn't ask to be forgiven.", r: "No. You didn't. I suppose I was hoping you'd want to be. I'll take my cake and my hoping home." },
        { tone: 'passive', t: "Three-quarters is fair. I wasn't great last time.", r: "Thank you. Honestly. That's the last quarter, right there. Fully forgiven. Here, have a crater slice." },
        { tone: 'flirty', t: "How do I earn the last quarter?", r: "Eat the whole slice and tell me it's delicious. Even if it isn't. Especially if it isn't. Smile while you do it." },
      ] },
    ] },
  { id: 'sunny-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "I baked you a lemon drizzle! It's sunk in the middle, like they always do. I call them crater cakes now, to make it sound on purpose.",
    opts: [
      { tone: 'cold', t: "I'm on a strict diet this week.", r: "Oh! Of course. Your trainer would never forgive me. I'll give it to the neighbours. Sorry, {me}.", opts: [
        { tone: 'cold', t: "Probably for the best.", r: "Yes. Probably. They'll love it. They love anything free. I'll bake you a salad next time. Bye." },
        { tone: 'passive', t: "Actually, one slice won't hurt. Thank you.", r: "One slice! Okay. Here. The bit from the crater. That's the gooey bit. Your trainer doesn't need to know." },
        { tone: 'flirty', t: "I'll break the diet. For you. Just this once.", r: "For me? You'd break a diet for me? That's basically a love song. I'll cut you a big slice." },
      ] },
      { tone: 'passive', t: "Crater cake is a brand. Why do they always sink?", r: "I open the oven to check on them. Every time. I can't help it. I just want to see how they're doing.", opts: [
        { tone: 'cold', t: "So stop opening the oven.", r: "I know. Everyone says. I'll try. It's hard to leave things alone when you care about them. Bye, {me}." },
        { tone: 'passive', t: "That's the most you thing I've ever heard.", r: "It is, isn't it? I check on everything. Cakes. Ferns. People. You, mostly, lately. Here, have some." },
        { tone: 'flirty', t: "You can check on me any time. I won't sink.", r: "You won't? Promise? Because I'm going to check on you a lot. Like, a lot. You've been warned." },
      ] },
      { tone: 'flirty', t: "Baking for me? That's very sweet. Like you.", r: "Oh, stop. It's a sunken cake. You're making it sound like a love letter. It isn't. Mostly it isn't.", opts: [
        { tone: 'cold', t: "Just being polite.", r: "Oh. Okay. Polite. That's nice too. I'll take polite. Here's the cake anyway. Enjoy it, {me}." },
        { tone: 'passive', t: "It's delicious. Seriously. You should bake more.", r: "You think? I'll bake you one every race weekend. Some will sink. Most will sink. All will be for you." },
        { tone: 'flirty', t: "Mostly isn't? What's the bit that is?", r: "The lemon. The lemon's the love letter. Oh, I didn't mean that. I did. I'm going pink. Eat your cake." },
        { tone: 'risque', t: "Feed me a bite and I'll tell you if it's a love letter.", r: "Feed you? With my hands? Here? Who SAYS that?! I'm the colour of a postbox. Open up, then." },
      ] },
    ] },
  { id: 'sunny-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "I made you something! A lemon drizzle. The middle sank, so it's a crater cake. I thought of you the whole time it was in the oven.",
    opts: [
      { tone: 'cold', t: "I don't really eat cake.", r: "Oh. You don't? I didn't know. I should have asked. I'm sorry. I got excited and forgot to ask.", opts: [
        { tone: 'cold', t: "It's fine. Just don't do it again.", r: "Okay. No more cake. I'll find another way to say I've been thinking about you. Or I won't. Bye." },
        { tone: 'passive', t: "I'll make an exception. It smells amazing.", r: "It does, doesn't it? The lemon's the best bit. Here. I'll watch you try it and pretend I'm not watching." },
        { tone: 'flirty', t: "I'll eat it if you're the one who made it.", r: "I am the one who made it! So. Eat it. Eat it and tell me it's perfect. I'll pretend to believe you." },
      ] },
      { tone: 'passive', t: "A crater cake! Does it sink every time?", r: "Every single time. I open the oven door to check on it. I can't help myself. I need to see it's alright.", opts: [
        { tone: 'cold', t: "That's not how baking works.", r: "No. I know. I'm not a scientist. I'm a door-opener. I'll keep my sunken cakes to myself. Sorry." },
        { tone: 'passive', t: "Honestly, the crater's the best bit.", r: "It is! Everyone says the crater is gooey and wrong, and I say gooey is right. Thank you, {me}." },
        { tone: 'flirty', t: "You thought of me the whole time? Tell me more.", r: "Only that you'd like lemon. And that you'd smile like that. Which you are. So I was right. Pink." },
      ] },
      { tone: 'flirty', t: "The whole time? Lucky cake.", r: "Lucky cake! Ha. It didn't feel lucky. It sank. But I thought of you even when it sank. That's dedication.", opts: [
        { tone: 'cold', t: "Bit much, thinking about me while baking.", r: "Oh. Yes. Maybe. I'll think about flour next time. I'm sorry. I don't always know where the line is." },
        { tone: 'passive', t: "That's dedication. I'll eat every crumb.", r: "Every crumb! Good. You have to eat the crater bit first. That's the rule. I just invented it." },
        { tone: 'flirty', t: "Next time, bake it at mine. I'll keep you company.", r: "At yours? In your kitchen? I'd be so nervous I'd sink it twice. Okay. Yes. Oh my goodness." },
        { tone: 'risque', t: "I'd rather taste the baker.", r: "You can't just SAY that! I'm going to have to sit on the floor. I'm laughing. I'm scarlet. Who says that?" },
      ] },
    ] },
  // ===================================================================== WARM 2: the jar, and you're taking it over
  { id: 'sunny-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "Did I ever tell you about my good-things jar? One slip a day. Can't remember. Last time didn't go in it. I'm a bit sad about that.",
    opts: [
      { tone: 'cold', t: "Not everything has to be a good thing.", r: "No. That's true. Some days just aren't. I suppose I wanted ours to be. I'm sorry if that's silly.", opts: [
        { tone: 'cold', t: "It is a bit silly.", r: "Okay. Silly. I'll keep my silly jar to myself, then. It'll get a slip about a cloud tonight. Bye, {me}." },
        { tone: 'passive', t: "It's not silly. I'm sorry I made it a bad one.", r: "Thank you. That's enough to fix it, almost. Tonight's slip will say 'we talked it out'. That's a good one." },
        { tone: 'flirty', t: "Let me make up for it. What's jar-worthy?", r: "Oh, easily. A laugh. A nice word. You looking at me like you're looking at me now. That's jar-worthy." },
      ] },
      { tone: 'passive', t: "You might have. Remind me? And sorry for last time.", r: "One good thing a day, on a slip, since I was nine. Gran's idea. You've been in it a lot lately. Except last time.", opts: [
        { tone: 'cold', t: "You shouldn't put people in jars.", r: "Maybe not. It's only how I keep track of the good. But okay. I'll keep you out of it. Sorry, {me}." },
        { tone: 'passive', t: "I'm glad I've made it in. Let's make today count.", r: "Let's! I've got a pen in my bag. I always do. Just in case something lovely happens. Like now." },
        { tone: 'flirty', t: "How many times exactly? Be honest.", r: "Eleven. In about three weeks. That's more than sunsets. You've beaten sunsets. I'm blushing so hard." },
      ] },
      { tone: 'flirty', t: "I've definitely been in the jar. Admit it.", r: "Fine! You have. Lots. But last time you weren't, and I missed writing your name. There. I said it.", opts: [
        { tone: 'cold', t: "You'll survive one day without me in it.", r: "I will. Course I will. I just didn't like it. That's all. I'll write about a dog. Bye, {me}." },
        { tone: 'passive', t: "I'm sorry. I'll do better. What does the jar mean to you?", r: "It's how I remember life's mostly kind. Gran started it when I was a kid. Your name's all through it now." },
        { tone: 'flirty', t: "Then let me fix it. Write my name twice tonight.", r: "Twice? Greedy. Okay. Twice. One for today, one for last time. I'll make the second one extra soppy." },
      ] },
    ] },
  { id: 'sunny-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "I can't remember if I've told you about my good-things jar? One slip a day since I was nine. Anyway, you're sort of taking it over.",
    opts: [
      { tone: 'cold', t: "That sounds like a lot of pressure.", r: "Oh. No, it isn't meant to be. You don't have to do anything. You just are. I'm sorry if that sounded heavy.", opts: [
        { tone: 'cold', t: "It does sound heavy.", r: "Okay. I'll stop telling you about the jar. It can just be mine. That's fine. Really. Bye, {me}." },
        { tone: 'passive', t: "No, that's sweet. Taking it over how?", r: "Well. Monday was you. Wednesday was you. Thursday was a heron, but you were a close second." },
        { tone: 'flirty', t: "I don't mind pressure. I'm a racing driver.", r: "Ha! True. You live on pressure. So you won't mind being in my jar. Every day. Possibly forever." },
      ] },
      { tone: 'passive', t: "Remind me. What's the jar?", r: "My gran started it when I had a rubbish year at school. A slip with one good thing, every day. I've three jars now.", opts: [
        { tone: 'cold', t: "Three jars of slips. That's a lot of clutter.", r: "It is clutter. It's my favourite clutter. But fair enough. Not everyone likes paper everywhere." },
        { tone: 'passive', t: "That's a lovely thing to keep doing.", r: "It really helps. When it's grey, I tip one out and read. It's like being hugged by all my old days." },
        { tone: 'flirty', t: "And I'm taking over the newest jar?", r: "Most of it. There's room for the odd heron. But it's mostly you. Don't look so pleased. It's going to your head." },
      ] },
      { tone: 'flirty', t: "Taking it over? I'm honoured. What do the slips say?", r: "That's private! Mostly. One says 'so easy to talk to'. That's a safe one. The others are... less safe.", opts: [
        { tone: 'cold', t: "I don't need to know.", r: "Okay. That's fine. They're mine anyway. I'll keep them folded. I'm sorry. I overshared." },
        { tone: 'passive', t: "Easy to talk to. I'll take that.", r: "Good, because I've got loads more to say. Some about ducks. Ducks are the backup material." },
        { tone: 'flirty', t: "Less safe how? Now you have to tell me.", r: "No! Absolutely not. They're going with me to the end of time. Okay, one says 'nice hands'. That's all you're getting." },
        { tone: 'risque', t: "Write one tonight about me kissing you.", r: "Kissing me? On a slip? In my jar? You're not allowed to just SAY that! Gran reads the jar! I'm bright red. Maybe." },
      ] },
    ] },
  { id: 'sunny-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "I've got a confession. Did I tell you about my jar, the good-things one? You've been in it more than sunsets. Sunsets are furious.",
    opts: [
      { tone: 'cold', t: "I'd rather not compete with sunsets.", r: "Oh. Okay. I didn't mean it like a competition. It's only paper in a jar. I'm sorry. I thought it'd make you laugh.", opts: [
        { tone: 'cold', t: "It didn't.", r: "Right. Okay. I'll stop. Sunsets can have the jar back. Bye, {me}. I hope the day's gentle with you." },
        { tone: 'passive', t: "Sorry. It's actually sweet. What's the jar?", r: "One good thing a day, on a slip. Gran got me started at nine. I've never missed a day." },
        { tone: 'flirty', t: "Fine. I'll fight the sunsets. And win.", r: "You've already won. They're sulking on the windowsill. Next to the jar. Very pink. Like me." },
      ] },
      { tone: 'passive', t: "You might've told me. What goes in it, normally?", r: "Dogs in coats. Good soup. Rainbows. My gran started it when I was a kid. Now it's you, mostly, which is... new.", opts: [
        { tone: 'cold', t: "Just don't expect me to live up to it.", r: "I don't expect anything. Promise. You're in it for being you. But okay. I'll be careful. Sorry, {me}." },
        { tone: 'passive', t: "Good soup is a very worthy slip.", r: "It is! I respect soup. But you beat soup. You beat soup twice last week. That's never happened." },
        { tone: 'flirty', t: "Mostly me? I'll have to keep earning it.", r: "You don't have to earn it. But if you want to, smiling at me is a slip. That one counted. Pen, please." },
      ] },
      { tone: 'flirty', t: "More than sunsets? I'm going to need proof.", r: "I'll bring the jar one day and tip it out on your lap. You'll be buried in your own name. A paper avalanche.", opts: [
        { tone: 'cold', t: "That sounds a bit obsessive.", r: "Oh. When you put it like that. Yes. I'm sorry. It's just a thing I do. Honestly, it's sweeter than it sounds." },
        { tone: 'passive', t: "I'd like to read them one day.", r: "One day. When I'm brave. There's a lot of soppy in there. I'll need to sit in another room." },
        { tone: 'flirty', t: "Buried in you? Sounds perfect.", r: "In my slips! Buried in my slips! Oh no. I heard it too. I'm laughing and I can't stop. You're terrible." },
        { tone: 'risque', t: "Bring the jar to mine. Stay while I read them.", r: "To yours? All night? While you read my soppy slips? You can't say that with a straight face! I'm crimson. I'm thinking." },
      ] },
    ] },
  // ===================================================================== WARM 3: otters - come with me?
  { id: 'sunny-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "I know last time was a bit off, but I've got two tickets to see the otters at the aquarium, and I'd hate to go with anyone else.",
    opts: [
      { tone: 'cold', t: "Otters? I'm not five.", r: "No. You're not. Otters aren't for five-year-olds, though. Otters are for everyone. But okay. Sorry I asked.", opts: [
        { tone: 'cold', t: "Take someone else.", r: "Okay. I'll take my neighbour. She'll talk the whole time. It won't be the same. Bye, {me}." },
        { tone: 'passive', t: "Sorry. That was mean. Why otters?", r: "Because they hold hands when they sleep, so they don't drift apart. It's the best fact in the world." },
        { tone: 'flirty', t: "Okay, fine. If you hold my hand at the otters.", r: "Like the otters do? They hold hands asleep so they don't float apart. I'm red now. Okay. Deal." },
      ] },
      { tone: 'passive', t: "I was a pain last time. I'd love to see the otters.", r: "Really? Oh, good. Did you know they hold hands when they sleep? So they don't drift apart. I think about that a lot.", opts: [
        { tone: 'cold', t: "Everyone knows that.", r: "Oh. Do they? I thought it was a secret. Okay. I'll stop telling you things you know. Sorry." },
        { tone: 'passive', t: "I didn't know that. That's lovely.", r: "Isn't it? Little furry hands. Floating along. Never letting go. I get a bit teary about it, honestly." },
        { tone: 'flirty', t: "So we'll have to hold hands too. Otter rules.", r: "Otter rules! That's - okay. Yes. If otter rules apply. I'm not arguing with otters. I'm pink." },
      ] },
      { tone: 'flirty', t: "Anyone else would be a waste of an otter. I'm in.", r: "You're in! Even after last time? Okay. I'm forgiving you on behalf of the otters. They hold hands, you know. Asleep.", opts: [
        { tone: 'cold', t: "You're not forgiving me. There's nothing to forgive.", r: "Oh. Okay. Then I'll stop forgiving, I suppose. I'll go to the otters on my own. Bye, {me}." },
        { tone: 'passive', t: "They hold hands? Why?", r: "So they don't drift apart while they sleep. They just float along together. It's the sweetest thing ever." },
        { tone: 'flirty', t: "Then we're doing what the otters do.", r: "Floating? Sleeping? Oh. Holding hands. Right. I'll be so red the otters will think I'm a fish." },
      ] },
    ] },
  { id: 'sunny-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "Fact: otters hold hands when they sleep so they don't drift apart. Second fact: I have two aquarium tickets. Third fact: come with me?",
    opts: [
      { tone: 'cold', t: "I don't really do aquariums.", r: "Oh. Okay. That's fine. I just thought, otters. Everyone does otters. But okay. I'll ask someone else.", opts: [
        { tone: 'cold', t: "Do that.", r: "Okay. I will. It's fine. I hope you have a nice weekend doing whatever you do do. Bye, {me}." },
        { tone: 'passive', t: "Sorry. For otters, I'll make an exception.", r: "Really? Oh! They'll be so pleased. Well, they won't know. But I'll be pleased enough for them." },
        { tone: 'flirty', t: "I'd do aquariums if you were the one asking.", r: "I am the one asking! That's what's happening! Okay. You're coming. I'm not letting you take it back." },
      ] },
      { tone: 'passive', t: "Three good facts. I'm in. When?", r: "Saturday morning! Before the crowds. There's a baby one called Pebble. I've read her whole biography.", opts: [
        { tone: 'cold', t: "Saturday's tight for me.", r: "Oh. Okay. We can do another day. Or not, if you're busy. I don't want to be one more thing on the list." },
        { tone: 'passive', t: "Pebble. Can't wait to meet her.", r: "She's got the cheekiest face. She steals her mum's fish. You'll love her. I already do. Obviously." },
        { tone: 'flirty', t: "Saturday. And I want to do the hand-holding bit.", r: "Like the otters? Oh. Okay. I'm going to think about that all week. All week. I'm so pink it hurts." },
      ] },
      { tone: 'flirty', t: "So you're asking me on an otter date?", r: "An otter date! Is that what it is? I think it is. Yes. It's an otter date. Oh no, I've gone bright pink.", opts: [
        { tone: 'cold', t: "Let's just call it a day out.", r: "A day out. Okay. That's fine. A day out with otters. I'll stop saying date. Sorry, {me}." },
        { tone: 'passive', t: "An otter date sounds perfect.", r: "Doesn't it? Saturday. I'll bring snacks. We can't eat by the tanks, the otters get jealous. Real fact." },
        { tone: 'flirty', t: "Then I'm holding your hand. So we don't drift apart.", r: "You can't use the otter fact on me! That's my fact! Oh, it worked. It worked so well. Yes. Hold it." },
        { tone: 'risque', t: "Otters also nap together. I'm just saying.", r: "That's outrageous! Not in front of the otter fact! I'm laughing so hard. I'm completely scarlet. No comment." },
      ] },
    ] },
  { id: 'sunny-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "I've got a question and a fact. Fact: otters hold hands asleep so they don't drift apart. Question: will you come to the otters with me?",
    opts: [
      { tone: 'cold', t: "I'll pass. Not really my thing.", r: "Oh. Okay. Not your thing. That's alright. I just thought it might be nice. I'm sorry I made a whole thing.", opts: [
        { tone: 'cold', t: "You make a lot of things a whole thing.", r: "Yes. I do. I know. I'll make fewer things. I'll go see the otters on my own. Bye, {me}." },
        { tone: 'passive', t: "Sorry. Okay. I'll come. Tell me about the otters.", r: "There's a baby called Pebble who steals fish. She's a menace. You'll get on. I'll book it tonight." },
        { tone: 'flirty', t: "Not my thing. You are, though.", r: "I am? That's - okay. That's very good news and also confusing. So you'll come? For me? Okay. Okay!" },
      ] },
      { tone: 'passive', t: "That's the best fact I've heard. When are we going?", r: "Saturday! They've got a baby, Pebble. I've read all about her. She's got a very naughty streak.", opts: [
        { tone: 'cold', t: "I'll check my diary.", r: "Okay. No pressure. Check it. I'll hold the ticket either way. Maybe I'll take Pebble a postcard." },
        { tone: 'passive', t: "Saturday it is. Pebble sounds like trouble.", r: "She's the best kind of trouble. Like you. Oops. Meant it, though. See you Saturday!" },
        { tone: 'flirty', t: "Pebble can watch me hold your hand.", r: "In front of Pebble? She'll be scandalised. She's only small. I'm going so pink. Yes. Fine. Yes." },
      ] },
      { tone: 'flirty', t: "Only if we do the otter thing too.", r: "The - the hand thing? The not drifting apart thing? You want to do that? With me? Oh my goodness.", opts: [
        { tone: 'cold', t: "I was joking.", r: "Oh. Joking. Right. Course. I knew that. I'll go back to being normal. Not-otter normal. Sorry." },
        { tone: 'passive', t: "I'd like to. If you want to.", r: "I want to. So much. That's - okay. Saturday, otters, hands. I'm writing it down so I don't explode." },
        { tone: 'flirty', t: "I'm not letting you drift anywhere.", r: "Oh, you can't say that! That's the most romantic thing about an otter anyone's ever said. I'm melting." },
        { tone: 'risque', t: "And the sleeping-together part. Otter accuracy.", r: "That is NOT what otters are about! Not the otters! I'm laughing so much. I'm red to my ears. Absolutely not. Maybe." },
      ] },
    ] },
  // ===================================================================== WARM 4: the cap with your number
  { id: 'sunny-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "I bought a cap with your number on, before last time. I nearly didn't wear it today. Then I thought, no. I'm still on your side.",
    opts: [
      { tone: 'cold', t: "You don't have to wear merch for me.", r: "I know. I wanted to. It's not about you being nice to me. It's about cheering. Even when it's wobbly.", opts: [
        { tone: 'cold', t: "Well, it's a bit much.", r: "Okay. I'll take it off. I'll cheer in a plain hat. Quietly. I'm still on your side, {me}. Bye." },
        { tone: 'passive', t: "That's really kind. I was rotten last time.", r: "It's okay. Thank you. The cap stays on, then. It's a bit big. I look like a lamp with a hat on." },
        { tone: 'flirty', t: "Fine. It looks better on you than on me.", r: "It does not! But thank you. I'll wear it forever now. You've done it. It's welded on." },
      ] },
      { tone: 'passive', t: "You're still on my side? After I was off with you?", r: "Of course. Being on your side isn't a prize for good behaviour. It's just where I am. Did you sleep okay?", opts: [
        { tone: 'cold', t: "I don't need you checking on me.", r: "Okay. Sorry. It's a reflex. I check on everyone. I'll try to check on you less. Bye, {me}." },
        { tone: 'passive', t: "Not great. Thanks for checking. And for the cap.", r: "Then sit. Rest. I'll do the talking, and you just nod. It's my best skill, honestly. Talking." },
        { tone: 'flirty', t: "I slept better knowing someone had my back.", r: "Oh, don't. You'll make me cry in my cap. Okay. I've got your back. Always. Even the wobbly bits." },
      ] },
      { tone: 'flirty', t: "You in my number? That's dangerous for my focus.", r: "Your focus is very important! I'll whip it off. No, I won't. You can be distracted for five minutes. That's allowed.", opts: [
        { tone: 'cold', t: "Not really. I'm working.", r: "Oh. Right. Sorry. I'll go and be distracting somewhere else. Good luck out there, {me}. Truly." },
        { tone: 'passive', t: "Five minutes. Then I'm back to braking points.", r: "Five whole minutes. I'll use them well. How are you? Really? Not the press answer. The real one." },
        { tone: 'flirty', t: "Five minutes won't be enough.", r: "It won't? Then ten. Twenty. I'm going pink under my cap. It hides nothing, this cap. It's useless." },
        { tone: 'risque', t: "Bring the cap round to mine later. And a toothbrush.", r: "A toothbrush?! You can't SAY things like that! Not at {venue}! I'm laughing so hard my cap fell off. Scarlet." },
      ] },
    ] },
  { id: 'sunny-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Confession. I bought a cap with your number on and wore it to buy milk. The person at the till asked if I knew you. I said 'sort of'. Hi.",
    opts: [
      { tone: 'cold', t: "Sort of is about right.", r: "Oh. Okay. Sort of. That's fair. I'll stop telling shop people. I just liked saying it. Sorry.", opts: [
        { tone: 'cold', t: "Probably best.", r: "Yes. Okay. I'll keep the cap for the sofa. Watching from behind my cushion. Alone. Bye, {me}." },
        { tone: 'passive', t: "Sorry. Bad joke. You can say you know me.", r: "Can I? Really? I'll tell the milk person next time. They'll be so impressed. They weren't. But they will be." },
        { tone: 'flirty', t: "Next time, say you're my lucky charm.", r: "Your lucky charm? To the milk person? They'll think I'm wonderful. I'll practise saying it. Pinkly." },
      ] },
      { tone: 'passive', t: "That's brilliant. Did you watch the race in it too?", r: "From behind a cushion, as always. I can't watch the starts. I peek over the top at corners. The cap helped. A bit.", opts: [
        { tone: 'cold', t: "You should just watch it properly.", r: "I know. I'm a coward. A loyal coward, though. I'll try. One eye, at least. Sorry, {me}." },
        { tone: 'passive', t: "Cushion and cap. That's commitment.", r: "Total commitment. I even had lucky toast. It didn't work, but the thought was there. I'm so proud of you." },
        { tone: 'flirty', t: "Next time, watch it in my garage. I'll find you a cushion.", r: "In your garage? With the serious people? Holding a cushion? I'd be mortified. Yes. Yes please." },
      ] },
      { tone: 'flirty', t: "Sort of? I'd say you know me quite well now.", r: "Do I? I'd like to. Know you better, I mean. Oh, that came out so earnest. I'm pink under my cap.", opts: [
        { tone: 'cold', t: "Steady. Don't rush it.", r: "No. Course. One step at a time. I'll stick to sort of. Sort of is fine. Bye for a bit, {me}." },
        { tone: 'passive', t: "Ask me anything. I'll answer.", r: "Anything? Okay. What were you like at ten? I want to picture tiny you. With a tiny helmet. Go." },
        { tone: 'flirty', t: "Earnest suits you. So does the cap.", r: "It's a terrible cap. It's too big. You're being very kind. I'm wearing it to bed now. That's your fault." },
        { tone: 'risque', t: "Wear it to bed? I'd like to see that.", r: "You'd - no! You can't just say that out loud! I'm laughing. My ears are burning. Stop smiling like that." },
      ] },
    ] },
  { id: 'sunny-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Look! A cap with your number on. I wear it everywhere. The person at the corner shop asked if I was your biggest fan. I said yes.",
    opts: [
      { tone: 'cold', t: "You don't need to wear my number around.", r: "Oh. I thought you'd like it. I'm sorry. Off it comes. I just wanted you to know someone's cheering.", opts: [
        { tone: 'cold', t: "I know. You can stop now.", r: "Okay. Stopping. I'll still cheer at home. Behind my cushion, where nobody can see. Bye, {me}." },
        { tone: 'passive', t: "No, keep it on. I'm just not used to it.", r: "Not used to being cheered for? Oh, that's sad. I'll cheer more. Get used to it. That's an order." },
        { tone: 'flirty', t: "Keep it. Being your favourite isn't the worst thing.", r: "My favourite? You are, you know. Not just at racing. At... most things. Oh no. I said that." },
      ] },
      { tone: 'passive', t: "My biggest fan. I'm honoured. How do you watch races?", r: "Behind a cushion! I've always watched scary things like that. I peek at the corners. The starts I can't look at.", opts: [
        { tone: 'cold', t: "That seems a bit dramatic.", r: "It is dramatic. I'm a dramatic watcher. I'll try to be calmer about it. Sorry. I care, that's all." },
        { tone: 'passive', t: "The starts are the scary bit for me too.", r: "Really? Even for you? Oh, that makes me feel better. We can be scared together. Different sides of the telly." },
        { tone: 'flirty', t: "Biggest fan should watch from my side of the wall.", r: "In the pit lane? Me? I'd be so in the way. I'd hide behind a mechanic. I'm so pink. Yes, obviously." },
      ] },
      { tone: 'flirty', t: "Biggest fan? I might have to give you something signed.", r: "A signed thing? From you? I'd frame it. Next to Dennis. My fern. Oh, I don't know if I ever told you about Dennis.", opts: [
        { tone: 'cold', t: "On second thought, maybe not.", r: "Oh. Okay. That's fine. I don't need anything signed. I've got the cap. It's plenty. Bye, {me}." },
        { tone: 'passive', t: "Who's Dennis? Then I'll sign whatever you like.", r: "He's a fern! A big, dramatic one. He likes jazz. He'd love a signed thing. He'd be insufferable." },
        { tone: 'flirty', t: "I'll sign it with a kiss.", r: "With a - on the paper? Or - no. On the paper. Okay. That's fine. I'm completely calm. I'm a beetroot." },
        { tone: 'risque', t: "I'll sign it somewhere more interesting than paper.", r: "Oh my goodness! That's not - you're not allowed to SAY that! I'm crying laughing. I'm the colour of jam." },
      ] },
    ] },
  // ===================================================================== WARM 5: am I too much?
  { id: 'sunny-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "Can I ask you something, and you be honest? Am I too much? Last time you went so quiet, and someone once told me I was exhausting.",
    opts: [
      { tone: 'cold', t: "You can be a lot, yeah.", r: "Okay. Thank you for being honest. That's hard to hear. I'll try to be less. I don't really know how.", opts: [
        { tone: 'cold', t: "Just tone it down.", r: "Right. Tone it down. I'll do that. Around you, at least. I'm going to go now, {me}. Take care." },
        { tone: 'passive', t: "That came out badly. A lot isn't a bad thing.", r: "It isn't? I always thought it was. Thank you. I'll be a medium amount of a lot. Is that okay?" },
        { tone: 'flirty', t: "A lot. But a lot of something I like.", r: "Oh. Oh, that's a twist. You've confused my sad face. It's trying to smile. It's nearly there." },
      ] },
      { tone: 'passive', t: "You're not too much. I was the one who was off.", r: "Really? I've been carrying that around. Someone said I was like being shouted at by a sunflower. It stuck.", opts: [
        { tone: 'cold', t: "That's a bit funny, to be fair.", r: "Yes, it's funny. To everyone but me. I'll laugh at it later. Not right now. Sorry, {me}." },
        { tone: 'passive', t: "Whoever said that was wrong. I like sunflowers.", r: "You do? Thank you. I needed that so much. I'm going to stand a bit taller now. Like a sunflower." },
        { tone: 'flirty', t: "Shout at me any time. I'm a sunflower person.", r: "A sunflower person! You can't say that, I'll cry. I'm not crying. Okay, a little. A happy little." },
      ] },
      { tone: 'flirty', t: "Too much? You're exactly enough. That's the problem.", r: "That's the problem? Why is it a problem? Oh. Oh. You mean - oh. I've gone pink while being sad. That's confusing.", opts: [
        { tone: 'cold', t: "Never mind. Forget it.", r: "I can't forget it. You said it. But I'll put it away. I'll take it out later and look at it. Bye, {me}." },
        { tone: 'passive', t: "It's not a problem. Who said you were exhausting?", r: "Someone I used to go out with. They said I was like a radio you can't turn off. I've been quieter since." },
        { tone: 'flirty', t: "The problem is I can't stop thinking about you.", r: "You can't? Me neither. About you. I mean - this is good. This is very good. I'm not too much, then?" },
      ] },
    ] },
  { id: 'sunny-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Can I ask a wobbly question? Do you ever find me too much? Someone I used to date said I was exhausting. It's been rattling round my head.",
    opts: [
      { tone: 'cold', t: "Sometimes. Not always.", r: "Oh. Okay. Sometimes. That's... honest. I'll try to notice. I'll try to be less, sometimes. Sorry, {me}.", opts: [
        { tone: 'cold', t: "Yeah. It'd help.", r: "Okay. I'll be quieter. I'm going to go and practise being quiet now. In my own head. Bye." },
        { tone: 'passive', t: "No. That was unfair. You're good company.", r: "Am I? Thank you. That fixes about half of it. The other half will take a while. But that helps." },
        { tone: 'flirty', t: "Sometimes too much. Mostly just right.", r: "Mostly just right. I'll take that. I'll frame it. You've made a wobbly day a bit steadier." },
      ] },
      { tone: 'passive', t: "Never. Why did they say that?", r: "I think I was too cheerful for them. Like a radio stuck on the morning show. I've been turning myself down since.", opts: [
        { tone: 'cold', t: "Maybe they had a point.", r: "Maybe. I've wondered. Okay. I'll keep turning down. I'm sorry I brought it up. Bye, {me}." },
        { tone: 'passive', t: "Don't turn yourself down for me. I like the volume.", r: "You like the volume? Oh. Okay. I'll turn it up again. A bit. Just for you. Thank you, {me}." },
        { tone: 'flirty', t: "I'd listen to that radio all day.", r: "All day? Even the adverts? Even the weather? Oh, you're lovely. I'm going pink and teary at once." },
      ] },
      { tone: 'flirty', t: "Too much? I can't get enough of you.", r: "You can't? Truly? You're not just being kind? I'm sorry, I need to hear it twice. It's a bad day for hearing it once.", opts: [
        { tone: 'cold', t: "Don't make me say it twice.", r: "Okay. Once is enough. I'll hold on to once. I'm sorry for needing more. That's the too-much bit." },
        { tone: 'passive', t: "I mean it. You're not exhausting. You're lovely.", r: "Lovely. That's a word I can keep. I'll put it in the jar. On a big slip. Thank you, {me}." },
        { tone: 'flirty', t: "Can't get enough of you. There. Twice.", r: "Twice! You said it twice! That's - okay. I'm floating. I'm the opposite of exhausting. I'm a balloon." },
        { tone: 'risque', t: "Want me to prove it? Somewhere less public?", r: "Prove it? Somewhere less - that's not a thing you can SAY! I'm laughing. My face is burning. Not today." },
      ] },
    ] },
  { id: 'sunny-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Can I ask something soppy and slightly scared? When I'm all giggly and chatty at you, is it too much? Someone once said I was exhausting.",
    opts: [
      { tone: 'cold', t: "It's a bit much, honestly.", r: "Oh. Okay. Thank you for saying. I'll try to be less giggly. I don't know how, but I'll try. Sorry.", opts: [
        { tone: 'cold', t: "Good.", r: "Okay. I'll go and be less. Somewhere else. Take care, {me}. I really do mean that." },
        { tone: 'passive', t: "Sorry. That was harsh. It's not really too much.", r: "No? Okay. Thank you. That stung for a second. I'll be okay. Just give me a little minute." },
        { tone: 'flirty', t: "A bit much. I like a bit much.", r: "You like a bit much? That's - okay. My sad face is confused. It's doing a smile anyway." },
      ] },
      { tone: 'passive', t: "Not at all. Who said that to you?", r: "An ex. They said being around me was like being shouted at by a sunflower.", opts: [
        { tone: 'cold', t: "That's a pretty good line.", r: "It is a good line. That's why it stuck. I'll stop talking about it. Bye, {me}." },
        { tone: 'passive', t: "Sunflowers are great. They were wrong.", r: "Thank you. I think I needed someone to say that out loud. You're very good at saying things out loud." },
        { tone: 'flirty', t: "Shout at me all you like. I'll shout back.", r: "You'll shout back? Like two sunflowers? That's the best idea I've ever heard. I'm grinning now." },
      ] },
      { tone: 'flirty', t: "Too much? Your giggle is my favourite sound.", r: "My giggle? It's ridiculous! It sounds like a goose in a lift. You can't like it. Oh no, here it comes.", opts: [
        { tone: 'cold', t: "Okay, it is a bit goose-like.", r: "Oh. Right. A goose. I knew it. I'll laugh behind my hand from now on. Sorry, {me}." },
        { tone: 'passive', t: "I like it. Honestly. Don't hide it.", r: "Okay. I won't. You'll get the full goose. Every time. You asked for it. Thank you, {me}." },
        { tone: 'flirty', t: "Goose in a lift. Still my favourite.", r: "Stop it! You're making it worse! The goose is getting louder! This is entirely your fault." },
        { tone: 'risque', t: "I'd love to find out what else makes you giggle like that.", r: "What else - oh! You can't SAY that and then look at me like that! I'm crimson. I'm laughing. Who are you?" },
      ] },
    ] },
  // ===================================================================== WARM 6: can I hold your hand?
  { id: 'sunny-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "I wanted to ask if I could hold your hand today. Like the otters. But last time felt so far away. So I'm just asking if you're okay.",
    opts: [
      { tone: 'cold', t: "I'm fine. Not a hand-holding day.", r: "Okay. That's okay. I won't. I'm glad you're fine. I'll keep my hands in my pockets. They're quite warm in there.", opts: [
        { tone: 'cold', t: "Thanks.", r: "Right. I'll go, then. Before my pockets and I get too sad. Look after yourself, {me}." },
        { tone: 'passive', t: "Sorry. I'm just tired. Ask me again next time.", r: "I will. I promise. And you can say no again if you need to. That's allowed. Rest up, {me}." },
        { tone: 'flirty', t: "Actually, give me one of those warm hands.", r: "Really? Here. Oh. That's nice. That's so nice. Don't let go, okay? Otters don't let go." },
      ] },
      { tone: 'passive', t: "I'm okay. Last time was on me. Like the otters?", r: "They hold hands so they don't drift apart. I felt like we were drifting. I didn't like it. That's all.", opts: [
        { tone: 'cold', t: "We're not otters.", r: "No. We're not. I know. It was a silly way to say it. I'll go, {me}. I hope the drift stops." },
        { tone: 'passive', t: "I didn't like it either. Let's not drift.", r: "Let's not. Okay. I'm holding your sleeve. That's halfway to a hand. It's a start." },
        { tone: 'flirty', t: "Then hold on. I'm not drifting anywhere.", r: "Okay. Holding on. Oh, your hand is so warm. Why is your hand so warm? I'm going pink. Hold tighter." },
      ] },
      { tone: 'flirty', t: "I'm okay now. You can still hold my hand, you know.", r: "Can I? Even though last time was odd? I thought I'd have to wait. I'm terrible at waiting. Okay. Here.", opts: [
        { tone: 'cold', t: "Actually, not here.", r: "Oh. Not here. Okay. Sorry. I'll wait for somewhere else. I'm getting good at waiting, at least." },
        { tone: 'passive', t: "Here. No drifting.", r: "No drifting. Like the otters. Oh, that's lovely. I'm going to remember this. I'm writing it down later." },
        { tone: 'flirty', t: "I've been wanting you to ask all day.", r: "All day? You should have said! I've wasted a whole morning being nervous. Never again. Give me that hand." },
        { tone: 'risque', t: "Hold my hand now. Hold the rest of me later.", r: "The rest of - you can't SAY that at {venue}! I nearly dropped your hand. I'm laughing and I'm red. Shh." },
      ] },
    ] },
  { id: 'sunny-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "Okay. I've been building up to this. Can I hold your hand? The otter way, so we don't drift apart? I've thought about it for ages.",
    opts: [
      { tone: 'cold', t: "Not here. Sorry.", r: "Oh. No, that's fine. Totally fine. You're probably always watched. I didn't think. I'm sorry, {me}.", opts: [
        { tone: 'cold', t: "It's just not my thing.", r: "Okay. Not your thing. That's alright. I'll stop asking. I'll keep my hands to myself. Bye for a bit." },
        { tone: 'passive', t: "Somewhere quieter, maybe. I'd like that.", r: "Somewhere quieter. Yes. That's even better, actually. I'll find a bench. A secret bench. Thank you." },
        { tone: 'flirty', t: "Not here. But I'll walk you home after.", r: "Walk me home? And maybe then? Oh. Okay. I'll be so pink for hours. That's your fault." },
      ] },
      { tone: 'passive', t: "Of course you can.", r: "Oh. Okay. Here. Oh, that's nice. Your hands are warmer than I thought. I don't know why I thought they'd be cold.", opts: [
        { tone: 'cold', t: "Okay, that's enough.", r: "Oh. Right. Sorry. That was a long hold. I'll let go. Thank you for the bit I got, {me}." },
        { tone: 'passive', t: "This is nice. Very otter.", r: "Very otter. That's my new favourite phrase. We're being very otter. I want to do this a lot." },
        { tone: 'flirty', t: "I'm not letting go until you're pink.", r: "Too late! Way too late. I've been pink since I asked. You're stuck with me now. Otter rules." },
      ] },
      { tone: 'flirty', t: "I thought you'd never ask.", r: "You were waiting? For me to ask? I've been rehearsing this for days! Okay. Give it here. Oh. Oh, that's lovely.", opts: [
        { tone: 'cold', t: "Your hand's a bit sweaty.", r: "Is it? Oh no. It's nerves. I'm sorry. I'll wipe it. Maybe we'll try again another day. Sorry." },
        { tone: 'passive', t: "It is lovely. Let's just walk for a bit.", r: "Just walk. Yes. No talking. Okay, some talking. I can't not talk. But mostly walking. And hands." },
        { tone: 'flirty', t: "Days of rehearsal for this? Worth it.", r: "So worth it. Every nervous minute. I'm going to write about this on every slip I own. I'm so happy." },
        { tone: 'risque', t: "Hand now. Next time, I'm asking for a kiss.", r: "A kiss? Next time? You can't just announce it! I'll be useless all week. Bright red and useless. Okay." },
      ] },
    ] },
  { id: 'sunny-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I'm going to be very brave and very otter. May I hold your hand, so we don't drift? I've practised this sentence twelve times.",
    opts: [
      { tone: 'cold', t: "No. Not today.", r: "Okay. Not today. That's alright. I'll put the twelve practices away. Maybe they'll be useful later.", opts: [
        { tone: 'cold', t: "Maybe not later either.", r: "Oh. Okay. I hear you. I'll stop being otter at you. Be kind to yourself, {me}. I mean it." },
        { tone: 'passive', t: "Sorry. That was blunt. I'm just in my head today.", r: "That's okay. Heads are allowed. Mine's full of otters. Yours is full of corners. Rest. I'll ask again." },
        { tone: 'flirty', t: "Not today. But I'll hold you to it tomorrow.", r: "Tomorrow! Okay. I'll be ready. I'll practise thirteen times. I'll bring a towel for my sweaty hands." },
      ] },
      { tone: 'passive', t: "Twelve times? Of course. Here.", r: "Oh. Oh, okay. This is happening. Your hand's very warm. Mine's very nervous. They're getting on, though.", opts: [
        { tone: 'cold', t: "This is a bit awkward.", r: "Is it? Okay. I'll let go. I'm sorry. I'll get better at it. Or we'll leave it. Sorry, {me}." },
        { tone: 'passive', t: "They're getting on fine. Like us.", r: "Like us. I like 'us'. I like this. I'll stop talking now and just enjoy it. For one minute. Maybe." },
        { tone: 'flirty', t: "Your nervous hand is perfect.", r: "It's not perfect, it's damp! But you're holding it anyway. That's the most romantic thing ever. Ever." },
      ] },
      { tone: 'flirty', t: "Only twelve? I'd have said yes on the first.", r: "On the first? I wasted eleven practices! I could've been holding your hand for days! Okay. Give it here. Now.", opts: [
        { tone: 'cold', t: "Calm down, it's just a hand.", r: "It's not just a hand to me. But okay. I'll calm down. I'll hold it calmly. Or let go. Sorry." },
        { tone: 'passive', t: "Here. No more practising.", r: "No more practising. Only doing. Oh, I like doing. Much better than practising. Thank you, {me}." },
        { tone: 'flirty', t: "I'm holding on. You're not drifting anywhere.", r: "Oh, the otter promise. You did the otter promise. I can't breathe. I'm so pink. Don't let go." },
        { tone: 'risque', t: "Practise kissing me twelve times instead.", r: "Twelve times?! Not while you're holding my hand! Who SAYS that? I'm laughing. I'm crimson. One, maybe." },
      ] },
    ] },
  // ===================================================================== WARM 7: Gran has opinions on your braking
  { id: 'sunny-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "I ring my gran every Sunday. She watches your races now. She asked why I sounded flat. I said we'd had a funny one. She says hello.",
    opts: [
      { tone: 'cold', t: "You told your gran about us falling out?", r: "Not the details! Just that I was sad. She knows when I'm sad. She can hear it down the phone. Sorry.", opts: [
        { tone: 'cold', t: "I'd rather you kept it between us.", r: "Okay. I will. I'm sorry. She's my person, that's all. I'll keep you out of Sundays. Bye, {me}." },
        { tone: 'passive', t: "That's fair. Tell her hello back. And sorry.", r: "I will. She'll pretend she's not pleased and then be very pleased. She's like that. Thank you." },
        { tone: 'flirty', t: "Tell her I'm trying to make you less flat.", r: "She'll like that. She'll say 'about time'. She says that about everything. You're trying? Okay. It's working." },
      ] },
      { tone: 'passive', t: "Your gran watches my races? What does she think?", r: "She says you brake too late into hairpins and you should eat more greens. In that order. She's very thorough.", opts: [
        { tone: 'cold', t: "Your gran doesn't know racing.", r: "No. She doesn't. She thinks she does, though. I'll tell her to stick to greens. Sorry, {me}." },
        { tone: 'passive', t: "She's not wrong about the hairpins, honestly.", r: "Don't tell her that! She'll be unbearable. She'll ring your team. She's got a landline and no fear." },
        { tone: 'flirty', t: "Tell her I'll eat my greens if her grandchild cooks them.", r: "Oh, she'll love that. She'll ring me straight back. 'They want you to cook!' I'm blushing for both of us." },
      ] },
      { tone: 'flirty', t: "Your gran says hello to me? I must be doing something right.", r: "She likes you. She doesn't like anyone. She liked you before last time and she still does. So. Do I.", opts: [
        { tone: 'cold', t: "She doesn't know me.", r: "No. She knows me, though. And she knows when I like someone. But okay. I'll stop. Bye, {me}." },
        { tone: 'passive', t: "That's sweet of her. What's she like?", r: "Tiny, very fierce, wears a hat indoors. She taught me to bake. Badly, she says, on purpose." },
        { tone: 'flirty', t: "So do you what? Finish the sentence.", r: "So do I like you. There. Still. Even after the wobble. Gran said I'd say it out loud one day. Ugh. She's right." },
      ] },
    ] },
  { id: 'sunny-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "News! My gran - I ring her every Sunday at six - has started watching your races. She has opinions. Mainly about your braking.",
    opts: [
      { tone: 'cold', t: "I don't need tips from your gran.", r: "Ha. No. She'd still give them. But okay. I'll keep her notes to myself. She'll be disappointed, though.", opts: [
        { tone: 'cold', t: "She'll get over it.", r: "She will. She gets over things very loudly. I'll tell her you're busy. Sorry, {me}." },
        { tone: 'passive', t: "Sorry. I'm curious, actually. What does she say?", r: "That you go into the hairpin like you've seen a ghost. Late and startled. She means it lovingly." },
        { tone: 'flirty', t: "I'll take tips if they come with her grandchild.", r: "With me? I come with all her tips. I'm basically the delivery service. And I'm going pink." },
      ] },
      { tone: 'passive', t: "What's the verdict on my braking?", r: "'Too late, too often, but brave.' That's high praise from Gran. She once called a sunset 'adequate'.", opts: [
        { tone: 'cold', t: "That's not really useful feedback.", r: "No. It's not. She's not an engineer. She just loves shouting at the telly. Sorry. I'll stop." },
        { tone: 'passive', t: "Brave! I'll take it. Tell her thanks.", r: "I will! She'll pretend to be cross that you listened. Then she'll tell the whole street. Sunday's going to be a big one." },
        { tone: 'flirty', t: "I only brake late to impress her grandchild.", r: "Don't! You'll crash! Brake normally! Impress me some other way. Any other way. I'm very easily impressed." },
      ] },
      { tone: 'flirty', t: "She's watching me? Does she know about us?", r: "About us? Is there an us? I mean - she knows I like you. She's known since my voice went funny on the phone.", opts: [
        { tone: 'cold', t: "There's no 'us' to know about.", r: "Oh. Okay. That's - okay. I'll tell her I got it wrong. She'll be disappointed. So will I. Bye." },
        { tone: 'passive', t: "Funny how? What does your voice do?", r: "It goes high and fast. Like a kettle. She said, 'you sound like you did about that ice cream van'. It was a good van." },
        { tone: 'flirty', t: "There's an us. You can tell her that on Sunday.", r: "I can? Oh. She'll scream. Not loudly. She's eighty-four. But she'll scream. So will I. Inside." },
        { tone: 'risque', t: "Tell her I'm planning to keep you up past your bedtime.", r: "I'm not telling my GRAN that! You can't just say things like that! I'm in hysterics. I'm bright red. Never." },
      ] },
    ] },
  { id: 'sunny-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "My gran rings every Sunday, and now she asks about you before she asks about me. She watches your races. She says you've got 'a lovely jaw'.",
    opts: [
      { tone: 'cold', t: "That's a bit weird.", r: "Oh. Is it? She's eighty-four. She says what she thinks. I thought it was funny. I'm sorry.", opts: [
        { tone: 'cold', t: "Tell her to watch the race, not me.", r: "Okay. I'll tell her. She won't listen. But I'll stop passing it on. Sorry, {me}." },
        { tone: 'passive', t: "No, it's funny. Sorry. What else does she say?", r: "That you brake late into the hairpins. And that I should 'get on with it'. She's very direct." },
        { tone: 'flirty', t: "Your gran has good taste. Like her grandchild.", r: "Oh. That's two compliments in one. Gran's and mine. I'm pink on her behalf and mine. Double pink." },
      ] },
      { tone: 'passive', t: "Ha! What else does she say about me?", r: "That you brake too late. That you need feeding. That I should stop going red every time your name comes up.", opts: [
        { tone: 'cold', t: "I don't need feeding.", r: "No. I know. That's just how she says she cares. Sorry. I'll tell her you're well fed. Bye, {me}." },
        { tone: 'passive', t: "She sounds like a great Sunday call.", r: "The best. She's my favourite person. Well. One of. The list has changed a bit recently." },
        { tone: 'flirty', t: "And do you? Go red when my name comes up?", r: "Every time. She can hear it. She says my voice goes all syrupy. It's going syrupy right now. Listen." },
      ] },
      { tone: 'flirty', t: "A lovely jaw? I'll take it. And your verdict?", r: "Me? I agree with Gran. On the jaw. And on most things. She also said I should tell you I like you. So.", opts: [
        { tone: 'cold', t: "Your gran says a lot of things.", r: "She does. She's not always right. She thought you'd want to hear it. I'll tell her she was wrong." },
        { tone: 'passive', t: "That's sweet. Tell her I said thank you.", r: "I will. She'll say 'and?'. She always says 'and?'. You've met her in spirit. That's how she is." },
        { tone: 'flirty', t: "You should always listen to your gran.", r: "I should. I am. I like you. A lot. There. Gran was right. Again. She'll be unbearable. I'm beaming." },
        { tone: 'risque', t: "Tell Gran I'd like you to see more than my jaw.", r: "I am NOT telling Gran that! You can't SAY that! I'm crying laughing. I'm redder than a postbox. Behave." },
      ] },
    ] },
  // ===================================================================== WARM 8: Steve the star; I like-like you
  { id: 'sunny-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "I was out looking at stars last night, after our last chat. I named one Steve. Then I thought about you. I want to say something. Can I?",
    opts: [
      { tone: 'cold', t: "If you have to.", r: "That's not the best start. But okay. I like you. Like-like. I wanted you to know, even if it's a bad time.", opts: [
        { tone: 'cold', t: "I don't feel the same.", r: "Okay. Thank you for being clear. I'm glad I said it. I'll go and talk to Steve about it. Take care, {me}." },
        { tone: 'passive', t: "That was brave. I'm sorry I was cold.", r: "It's okay. I'm still a bit shaky. But I said it. You don't have to say anything back. Not yet." },
        { tone: 'flirty', t: "I like-like you too. I was just scared.", r: "You were scared? Of me? I'm the least scary person alive! Oh. You like-like me. Steve was right." },
      ] },
      { tone: 'passive', t: "Of course. And who's Steve?", r: "A star. I don't know which. I name them all wrong. Okay. Here it is. I like you. Like-like. That's the thing.", opts: [
        { tone: 'cold', t: "I don't think we're there.", r: "Okay. That's alright. I'm glad it's out. I'll keep it somewhere safe. I'll be okay, {me}. Promise." },
        { tone: 'passive', t: "Me too. Like-like. I'm sorry I made it hard.", r: "You do? Oh. Oh, that's - I need to sit. I'm sitting. Thank you. That makes last time feel very far away." },
        { tone: 'flirty', t: "Took you long enough. I've liked you for ages.", r: "Ages? You've liked me for ages? I've been so nervous for nothing! I'm going to tell Steve. He'll be thrilled." },
      ] },
      { tone: 'flirty', t: "Say anything you like. I'm listening.", r: "Okay. I like you. Like-like. Even when you go cold on me. Especially when you come back warm. That's it.", opts: [
        { tone: 'cold', t: "That's a lot to put on me.", r: "Is it? I'm sorry. I just didn't want to hide it. I'll take it back. No, I won't. But I'll leave it. Bye." },
        { tone: 'passive', t: "Thanks for saying it. I feel the same.", r: "You do? Really? Oh, I can breathe again. I've been holding that in since the stars. Thank you, {me}." },
        { tone: 'flirty', t: "Same. Like-like. Come here.", r: "Come where? Here? Closer? Oh. Okay. This is close. This is very close. I'm so pink I'm practically Steve." },
        { tone: 'risque', t: "Say it again. Closer. In my ear.", r: "In your EAR? You can't just come out with that! My knees went. I'm laughing. I'm scarlet. Okay. Come here, then." },
      ] },
    ] },
  { id: 'sunny-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "Last night I was looking at the stars and I named one Steve. I don't know which one. And I realised I had to tell you something.",
    opts: [
      { tone: 'cold', t: "Is this going to be heavy?", r: "Maybe? A bit? No. It's light. It's a light heavy thing. Okay. I like you. Like-like. Is that heavy?", opts: [
        { tone: 'cold', t: "A bit. I need time.", r: "Okay. Time. Take all of it. I'll be here. I'll be talking to Steve. He's very patient. Like me." },
        { tone: 'passive', t: "Not heavy. Nice, actually.", r: "Nice? Okay. Nice is good. Nice is a good place to start from. I'm so relieved I could float." },
        { tone: 'flirty', t: "Not heavy at all. I like-like you back.", r: "Back? You like-like me back? Oh, stop it. I'm going to cry. Happy crying. Steve's crying too." },
      ] },
      { tone: 'passive', t: "Go on. I'm listening. Who's Steve?", r: "A star. Possibly a plane. I like you, {me}. Not just as a friend. I wanted you to know before I burst.", opts: [
        { tone: 'cold', t: "I think I see you as a friend.", r: "Oh. Okay. That's alright. That's really alright. Friends is lovely. Saying it was right. Thank you." },
        { tone: 'passive', t: "Same here. More than friends.", r: "You do? Oh. I'm so happy I've gone dizzy. I need to sit. Will you sit with me? Just for a bit?" },
        { tone: 'flirty', t: "I've been waiting for you to say that.", r: "You have? You knew? You never said! We could have been holding hands for weeks! Hold my hand." },
      ] },
      { tone: 'flirty', t: "Did you name a star after me? Be honest.", r: "No! I named it Steve! But I thought of you. And now I have to say it. I like you. A lot. Like-like. There.", opts: [
        { tone: 'cold', t: "Steve's a better name than mine.", r: "That's not the bit I wanted you to hear. Okay. I'll take that as a no. I'm sorry. I'll go, {me}." },
        { tone: 'passive', t: "I like you a lot too. Like-like.", r: "Oh my goodness. We both like-like. Okay. I need a minute. I need a hundred minutes. I'm so happy." },
        { tone: 'flirty', t: "Next star you name, name it after us.", r: "After us? That's - okay, that's the most romantic thing. A star called Us. I'm melting. Steve is jealous." },
        { tone: 'risque', t: "Come over tonight and show me Steve properly.", r: "Come over? Tonight? To show you Steve?! You can NOT say that to me! I'm in pieces. I'm crimson. Maybe." },
      ] },
    ] },
  { id: 'sunny-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "I lay in the garden last night looking at stars and I named one Steve. Then I named one after you. Then I knew I had to say something.",
    opts: [
      { tone: 'cold', t: "You named a star after me? That's a lot.", r: "It is a lot. I know. I'm a lot. I'm sorry. I just like you. I like you so much I'm naming stars.", opts: [
        { tone: 'cold', t: "Maybe slow down.", r: "Okay. Slowing down. I'll un-name the star. It can be Steve's friend, Gary. I'm sorry, {me}. Bye." },
        { tone: 'passive', t: "No, it's sweet. I'm just surprised. You like me?", r: "I really, really do. Like-like. I've never been brave enough to say it to anyone. Now I have." },
        { tone: 'flirty', t: "It's a lot. And I love it.", r: "You love it? Oh. Then I'm naming another one. And another. The whole sky's yours. I'm pink all over." },
      ] },
      { tone: 'passive', t: "Say it, then. I'm right here.", r: "Okay. Okay. I like you. Not friend-like. Like-like. I think about you when I'm doing the washing up.", opts: [
        { tone: 'cold', t: "I'm not sure I feel the same.", r: "Oh. That's okay. You don't have to. I wanted to be brave. I was. I'll be okay. I'll go now, {me}." },
        { tone: 'passive', t: "Same, you know. The washing-up bit is cute.", r: "It's not cute, it's tragic! I've broken two mugs. Oh, you like me too. I'm going to break all the mugs." },
        { tone: 'flirty', t: "I think about you when I'm in the car.", r: "In the car? While you're racing? You can't! You'll crash! Oh, that's so lovely. Don't do it. Do it a bit." },
      ] },
      { tone: 'flirty', t: "What's my star called?", r: "It's called... your name. Obviously. Oh, I'm being so soppy. I'm saying it. I like you. A lot. Like-like.", opts: [
        { tone: 'cold', t: "Steve would've been fine.", r: "Oh. Okay. I'll rename it Steve Two. I'm sorry. I'll keep my feelings in the garden. Bye, {me}." },
        { tone: 'passive', t: "That's the nicest thing anyone's done for me.", r: "Really? It cost nothing! I just pointed! But I meant it. Every bit. You're my favourite, {me}. I really do." },
        { tone: 'flirty', t: "Feeling's mutual. Show me which star.", r: "I'll show you. Tonight, when it's dark. I'll point at the wrong one. Come closer anyway. Closer." },
        { tone: 'risque', t: "Show me tonight. We can count stars till morning.", r: "Till MORNING? You said that out loud! I can't stop laughing. I'm the colour of a fire engine. Okay. Maybe." },
      ] },
    ] },
  // ===================================================================== WARM 9: be mine? (end of chapter)
  { id: 'sunny-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "I've been brave all week, and last time made me wobble. But I'm asking anyway. Do you want to be... mine? Properly? Together?",
    opts: [
      { tone: 'cold', t: "I don't think I can give you that.", r: "Okay. Better honest than kind. I'd rather know. I'll be okay. I just wanted to ask before I lost my nerve.", opts: [
        { tone: 'cold', t: "I think it's better this way.", r: "Maybe it is. I'll stop asking. I won't stop rooting for you, though. Never. Be well, {me}." },
        { tone: 'passive', t: "I'm sorry. I've been scared. Ask me again.", r: "You've been scared? Okay. I'll ask again. Gently. When you're ready. I'll wait. I'm good at waiting." },
        { tone: 'flirty', t: "I lied. I want to be yours.", r: "Don't do that to me! You nearly broke my heart and fixed it in one breath! Yours. Okay. Mine. Yes." },
      ] },
      { tone: 'passive', t: "Sorry I wobbled us. Yes. I'd like that.", r: "You would? Even after all that? Oh. Okay. I need a moment. I'm going to cry, but it's the good kind. Hold on.", opts: [
        { tone: 'cold', t: "Don't cry. It's not a big deal.", r: "It is to me. But okay. No crying. I'll save it for later. Alone. Happy, but alone. Thanks, {me}." },
        { tone: 'passive', t: "Cry all you like. I'll be here.", r: "That's the nicest thing. Okay. Crying. Happy crying. We're together. Properly. I'm telling Gran." },
        { tone: 'flirty', t: "Come here. You're mine now.", r: "I'm yours. You're mine. Oh. This is real. I'm so pink. I'm so happy. I'm hugging you. Brace yourself." },
      ] },
      { tone: 'flirty', t: "Yours? I thought I already was.", r: "Did you? You never said! My nerves! Okay. Then we're together. Officially. I'm going to faint. Catch me.", opts: [
        { tone: 'cold', t: "Not officially. Let's not label it.", r: "Oh. Okay. No labels. That's... fine. I'll try. I'm a label person, though. I'll find a way. Bye." },
        { tone: 'passive', t: "Officially, then. I'm sorry for last time.", r: "Forgiven. Totally. Officially forgiven and officially together. Two officials. I'm beaming." },
        { tone: 'flirty', t: "I'll catch you. Every time.", r: "Every time? Okay. I'm going to fall over a lot, then. On purpose. You've been warned. I adore you." },
        { tone: 'risque', t: "Officially mine. Let's celebrate somewhere private.", r: "Private? Right now? You can't just SAY that at {venue}! I'm laughing. I'm scarlet. Yes. Later. Yes." },
      ] },
    ] },
  { id: 'sunny-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "Can I ask you a big one? I'm going to ask it anyway, even though my knees are wobbling. Would you be mine? Together? Properly?",
    opts: [
      { tone: 'cold', t: "I'm not ready for that.", r: "Okay. Not ready. That's alright. I'm not going anywhere. Well, I am, home, but I'm not going anywhere. You know.", opts: [
        { tone: 'cold', t: "I might never be.", r: "Okay. I hear that. Thank you for not pretending. I'll still be cheering. Always. Take care, {me}." },
        { tone: 'passive', t: "Ask me again soon. I want to get there.", r: "I will. I'll ask so gently. Like knocking on a door with a feather. Thank you for wanting to." },
        { tone: 'flirty', t: "Not ready to say it. Ready to hold your hand.", r: "That's a start. That's a lovely start. Here. Hold it. We'll get to the saying bit. I'm patient." },
      ] },
      { tone: 'passive', t: "Yes. I'd really like that.", r: "Yes? You said yes? Oh. I didn't plan what happens after yes. I only planned the asking bit. What do we do?", opts: [
        { tone: 'cold', t: "We don't make a fuss.", r: "No fuss. Okay. A tiny fuss inside. You won't see it. It's very loud in here, though. Thank you." },
        { tone: 'passive', t: "We just carry on. Together.", r: "Together. Just carrying on. That's perfect. That's the best plan. I'm going to write it on a slip." },
        { tone: 'flirty', t: "Now I kiss you. If that's okay.", r: "Oh! Yes. That's okay. That's very okay. Hang on, I'm going pink. Okay. Ready. Come here." },
      ] },
      { tone: 'flirty', t: "I've been yours for weeks. You just hadn't asked.", r: "Weeks? You've been mine for weeks and I didn't know? I wasted so much time being nervous! Okay. Mine. Mine!", opts: [
        { tone: 'cold', t: "Don't shout it.", r: "Sorry! Sorry. Inside voice. Mine. Quietly. Mine. I'm sorry, I got excited. I'll be calmer." },
        { tone: 'passive', t: "Yours. Let's make up for lost time.", r: "Lost time. Yes. We'll make it up. Starting with this. Hugging you. Right now. No arguments." },
        { tone: 'flirty', t: "Shout it. Let everyone know.", r: "MINE! There. All of {venue} heard. I'm so red. I don't care. I'm the happiest I've ever been. Kiss me?" },
        { tone: 'risque', t: "Then let's go somewhere and make it official.", r: "Make it - oh! You're not allowed to SAY that out loud! I'm laughing. I'm so red. Yes. Yes, later. Shh!" },
      ] },
    ] },
  { id: 'sunny-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "Okay. I've got a question and I've been carrying it around all week like a hot potato. Will you be mine? Like, properly? Please say yes.",
    opts: [
      { tone: 'cold', t: "I don't think so. Sorry.", r: "Oh. Okay. That's okay. I'll put the potato down. I'm glad I asked. I'm a bit wobbly, but I'm glad.", opts: [
        { tone: 'cold', t: "It's for the best.", r: "Maybe. You'd know. I'll be okay. I'll still cheer every lap. Behind my cushion. Look after you." },
        { tone: 'passive', t: "I'm sorry. I'm scared of it, not of you.", r: "Scared of it? Oh. I understand that. Being scared together is easier. Think about it? Please?" },
        { tone: 'flirty', t: "Sorry. Terrible joke. Yes. Obviously yes.", r: "That was the worst joke ever made! I nearly cried! Oh, you. Yes? Yes. Okay. Come here, you menace." },
      ] },
      { tone: 'passive', t: "Yes. Of course yes.", r: "Of course yes! You said of course! I've been terrified all week and it was of course! Oh, I'm so happy.", opts: [
        { tone: 'cold', t: "Let's keep it low-key.", r: "Low-key. Okay. I'll be low-key. I'll be the lowest key. Inside I'm a brass band. Outside, calm." },
        { tone: 'passive', t: "I'm so happy too. Come here.", r: "Coming. I'm hugging you. This is a hug of togetherness. It's an official hug. Gran will hear about this." },
        { tone: 'flirty', t: "Mine. Now kiss me before you combust.", r: "Too late, I've combusted. I'm just ash and pink. Okay. Kissing you. Now. Brace yourself." },
      ] },
      { tone: 'flirty', t: "Only if I can be yours too.", r: "That's the deal! We're each other's! That's the whole point! Oh, you're teasing. You're yes. You're mine!", opts: [
        { tone: 'cold', t: "Slow down. I said 'if'.", r: "If. Right. Okay. I heard yes. Maybe I heard what I wanted. I'm sorry. Tell me when it's yes." },
        { tone: 'passive', t: "Each other's. I like the sound of that.", r: "Each other's. It sounds lovely, doesn't it? Like a song. I'll hum it all the way home." },
        { tone: 'flirty', t: "Yours. Completely. Now come here.", r: "Completely! Oh, I'm going to need a bigger jar. Here I come. Hug incoming. Big one." },
        { tone: 'risque', t: "Yours. Let's skip the rest of today and go to mine.", r: "Skip - go HOME? Who taught you to SAY that? I'm laughing so hard I can't stand. I'm crimson. Yes. Yes. Go." },
      ] },
    ] },
];
