// Sunny - phone threads.
export default [
  // ============================================================ WEEK / NEW
  {
    id: 'sunny-text-week-new-cold-1', on: 'week', stage: 'new', mood: 'cold',
    say: "hi! hope this is ok to send. i felt like i said something wrong last time and it's been bugging me a bit 🙈",
    opts: [
      { tone: 'cold', t: "it's fine. busy week.", r: "oh ok! sorry. i'll get out of your hair. good luck with the busy" },
      { tone: 'passive', t: "you didn't. i was in a mood. sorry about that", r: "oh phew!! thank you for saying. moods are allowed. mine are mostly about printers" },
      { tone: 'flirty', t: "you didn't. honestly i've been wanting to text you", r: "wait really?? i've been staring at my phone like it owes me money. hi 😊" },
    ],
  },
  {
    id: 'sunny-text-week-new-cold-2', on: 'week', stage: 'new', mood: 'cold',
    say: "this is a peace offering text. it comes with a picture of a duck in a tiny hat. i didnt make the hat. *didn't",
    opts: [
      { tone: 'cold', t: "i don't really need duck pictures", r: "oh. ok. sorry, the duck and i will go. no more hat-related texts", opts: [
        { tone: 'cold', t: "thanks", r: "ok. take care {me}" },
        { tone: 'passive', t: "ok that was harsh. send the duck", r: "here he is!! his name is Lionel and the hat is a very small bowler. he forgives you. so do i" },
        { tone: 'flirty', t: "fine. but only if you send one of you in a tiny hat", r: "haha i don't own a tiny hat!! i own a normal hat. you're getting the normal hat. give me 5 mins" },
      ] },
      { tone: 'passive', t: "best peace offering i've ever had. we're good", r: "yay!! the duck is relieved. so am i. tell me one thing about your week to seal the peace", opts: [
        { tone: 'cold', t: "nothing to tell really", r: "ok! no worries. peace still sealed. duck out 🦆" },
        { tone: 'passive', t: "found a bakery near the hotel that does cheese scones", r: "CHEESE SCONES. that's a seal-worthy fact. treaty signed. go eat another one for me" },
        { tone: 'flirty', t: "highlight of my week was this text, honestly", r: "stop it, it's a duck in a hat. ok it's a very good duck. i'm smiling at my phone at work" },
      ] },
      { tone: 'flirty', t: "the duck's cute. you're cuter though", r: "oh!! that's a big jump from last time. not complaining. i'm blushing at a duck. thanks {me}", opts: [
        { tone: 'cold', t: "don't get too excited", r: "oh. ok. un-excited. back to normal. bye" },
        { tone: 'passive', t: "i mean it. and sorry for last time", r: "thank you. that's all i wanted really. ok. fresh start. Lionel says hi" },
        { tone: 'flirty', t: "blush harder. i'll send compliments all week", r: "ALL week?? i won't survive. ok send them. i'll survive. i'll be pink, but i'll survive" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-new-cold-3', on: 'week', stage: 'new', mood: 'cold',
    say: "hey {me}, hope your week is going ok. i keep thinking i should say sorry for being weird but i don't know what for",
    opts: [
      { tone: 'cold', t: "you don't need to say sorry. just leave it", r: "ok. i'll leave it. i just didn't want things to be wonky between us" },
      { tone: 'passive', t: "you weren't weird. i was off. my fault, really", r: "oh {me}, thank you. i've been carrying that around like a heavy shopping bag. putting it down now" },
      { tone: 'flirty', t: "you're only weird in the good way. i was the problem", r: "the good way!! that's my favourite way. ok. forgiven. i'm doing a little dance in my kitchen" },
    ],
  },
  {
    id: 'sunny-text-week-new-passive-1', on: 'week', stage: 'new', mood: 'passive',
    say: "random q but are you a cereal-first or milk-first person. it's important. i'm deciding things about you",
    opts: [
      { tone: 'cold', t: "neither. i don't do breakfast", r: "no breakfast?? oh {me}. ok. no judgement. a bit of judgement. mostly worry", opts: [
        { tone: 'cold', t: "it's really not your business", r: "you're right, sorry. i'll stop. have a good day" },
        { tone: 'passive', t: "ok fine, i grab a banana on the way out", r: "a banana counts!! barely. i'm sending you a breakfast idea every morning now. you've been warned" },
        { tone: 'flirty', t: "maybe i'd do breakfast if someone made it for me", r: "is that a hint?? that sounds like a hint. i make very good eggs. i'm just saying. i'm just SAYING" },
      ] },
      { tone: 'passive', t: "cereal first. who does milk first??", r: "my nan does milk first and she's 91 and fearless. but yes cereal first. we're compatible ✨", opts: [
        { tone: 'cold', t: "ok. got to go", r: "oh ok, bye then. sorry if i kept you" },
        { tone: 'passive', t: "91 and fearless is goals. tell her i said hi", r: "i will!! she'll ask if you're eating enough. she asks that about everyone. even the postie" },
        { tone: 'flirty', t: "compatible, huh? what else are you deciding", r: "that's classified!! but so far you're scoring very well. very very well. i'm going red at my desk" },
      ] },
      { tone: 'flirty', t: "depends who's pouring", r: "haha sneaky answer!! writing that down. 'breakfast-dependent'. very mysterious, {me}", opts: [
        { tone: 'cold', t: "it's not that deep", r: "oh. ok. not deep. i'll stop overthinking it. see you" },
        { tone: 'passive', t: "ok fine, cereal first. i'm boring", r: "you're not boring!! cereal first is the sensible choice. sensible is underrated. i like sensible" },
        { tone: 'flirty', t: "if you're pouring, i'll eat whatever you make", r: "WHATEVER i make? i once made porridge so thick the spoon stood up. you'd eat that? for me? 🥹" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-new-passive-2', on: 'week', stage: 'new', mood: 'passive',
    say: "waved at a red car in a showroom today because it reminded me of you. someone inside waved back. mortifying",
    opts: [
      { tone: 'cold', t: "not really my kind of car", r: "oh. ok! it made me laugh, that's all. i'll wave at other things then" },
      { tone: 'passive', t: "haha amazing. did you wave back at the waver?", r: "i DID and then i walked into a bin. a full day of waving. i should be in charge of a parade" },
      { tone: 'flirty', t: "reminded you of me? so you were thinking about me", r: "i... might have been. a little. a red-car amount. is there a word for that. there should be" },
    ],
  },
  {
    id: 'sunny-text-week-new-passive-3', on: 'week', stage: 'new', mood: 'passive',
    say: "doing the crossword and the clue is 'fast mover, five letters'. i wrote your name in pen. it does not fit. help",
    opts: [
      { tone: 'cold', t: "i'm not great at crosswords", r: "ah ok no worries! i'll ask my neighbour. they do theirs in pen too. on purpose. terrifying" },
      { tone: 'passive', t: "swift. s-w-i-f-t. you owe me a biscuit", r: "SWIFT. it fits!! you're a genius. i owe you a whole packet. i'll post it to the hotel" },
      { tone: 'flirty', t: "it fits if you think about me hard enough", r: "that's not how crosswords work {me}!! ok it might be how my crossword works now" },
    ],
  },
  {
    id: 'sunny-text-week-new-flirty-1', on: 'week', stage: 'new', mood: 'flirty',
    say: "hi!! sorry. hi. i've typed and deleted this four times. this is the fifth one. it says hi",
    opts: [
      { tone: 'cold', t: "you didn't need to text", r: "oh. ok. sorry. i'll go back to typing and deleting things to myself" },
      { tone: 'passive', t: "hi! fifth time lucky. how's your day?", r: "good!! better now. i made soup. it's mostly carrot. it tastes like a cosy sock. in a nice way" },
      { tone: 'flirty', t: "i'd have liked all five. send the deleted ones", r: "NO. one of them had three heart emojis. absolutely not. ok fine, here's one: 💛" },
    ],
  },
  {
    id: 'sunny-text-week-new-flirty-2', on: 'week', stage: 'new', mood: 'flirty',
    say: "is it weird that i've thought about our chat like a hundred times. it's weird. ignore me. don't ignore me",
    opts: [
      { tone: 'cold', t: "a bit weird, yeah", r: "oh haha. ok. noted. i'll think about other things. like taxes", opts: [
        { tone: 'cold', t: "good idea", r: "ok. i'll stop texting for a bit. take care of yourself {me}" },
        { tone: 'passive', t: "sorry, that was mean. i've thought about it too", r: "really?? phew. you gave me a fright. which bit did you think about? i'm nosy" },
        { tone: 'flirty', t: "weird but cute. i've been thinking about you too", r: "AH. ok. ok ok ok. i'm on my bed kicking my feet like a teenager. you did this" },
      ] },
      { tone: 'passive', t: "not weird. it was a good chat. i liked it too", r: "oh good!! i was worried i talked too much about otters. i always talk too much about otters", opts: [
        { tone: 'cold', t: "you did, a bit", r: "oh. right. sorry. i'll put the otters away. ttyl" },
        { tone: 'passive', t: "otters were the best bit. give me another animal fact", r: "ok!! crows remember faces for years. so be nice to crows. and to me. i also remember faces" },
        { tone: 'flirty', t: "talk about otters all night and i'd still listen", r: "ALL night?? you don't know what you're signing up for. i have so many otter facts. stop being nice" },
      ] },
      { tone: 'flirty', t: "a hundred? i'm only at ninety. i'll catch up", r: "you're at NINETY?? that's practically a hundred. i'm screaming into a cushion", opts: [
        { tone: 'cold', t: "it's a joke, chill", r: "oh. haha. ok. chilling. very chill. un-screaming" },
        { tone: 'passive', t: "honestly i've thought about it a lot. it was nice", r: "it really was. ok i'm going to stop being dramatic and just be happy. hi. this is me being happy" },
        { tone: 'flirty', t: "let's make it two hundred. another chat soon?", r: "yes!! soon. very soon. i'll practise not blushing. i'll fail, but i'll practise 🙈" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-new-flirty-3', on: 'week', stage: 'new', mood: 'flirty',
    say: "my friend asked why i was smiling at my phone and i said 'no reason' and they said 'it's that driver isn't it'. it is",
    opts: [
      { tone: 'cold', t: "maybe stop smiling at your phone then", r: "oh. ok. i'll frown at it instead. it's harder than it looks" },
      { tone: 'passive', t: "haha tell your friend i said hello", r: "they'll scream. they've been asking about you all week. you're famous in our flat now" },
      { tone: 'flirty', t: "tell them it's a good reason. i'm smiling too", r: "you're smiling?? at me?? my friend just watched me fall off the sofa. thanks for that" },
    ],
  },

  // =========================================================== WEEK / WARM
  {
    id: 'sunny-text-week-warm-cold-1', on: 'week', stage: 'warm', mood: 'cold',
    say: "hey. i don't want to be a pest. you seemed a bit off with me last time. are we ok?",
    opts: [
      { tone: 'cold', t: "we're fine. stop worrying", r: "i'm trying. it's just hard when you go all short with me. i'll leave it", opts: [
        { tone: 'cold', t: "then leave it", r: "ok. i will. i'm not going to chase you, {me}. you know where i am" },
        { tone: 'passive', t: "sorry. i'm short with everyone this week. not just you", r: "that helps, weirdly. i hope the week's kinder to you soon. i'm here if you want to moan" },
        { tone: 'flirty', t: "we're fine. better than fine if you let me make it up to you", r: "make it up how?? ok you have my attention. i'm still a bit sulky but i'm listening" },
      ] },
      { tone: 'passive', t: "we're ok. that was me being stressed. sorry", r: "ah, that makes sense. stress makes everyone spiky. even hedgehogs. especially hedgehogs", opts: [
        { tone: 'cold', t: "i'm not a hedgehog", r: "ok sorry, bad joke. i'll leave you to destress" },
        { tone: 'passive', t: "spiky hedgehog reporting in. how was your week?", r: "haha!! good. i repotted Dennis. he's thriving. he's basically bigger than me now. how's the hedgehog?" },
        { tone: 'flirty', t: "i'll stop being spiky if you come see me this weekend", r: "is that a bribe? it's working. saturday? i'll bring hedgehog-safe snacks" },
      ] },
      { tone: 'flirty', t: "we're ok. i was just distracted by how much i like you", r: "ha. that's a very nice dodge. is it true though? i'm hoping it's true", opts: [
        { tone: 'cold', t: "maybe. don't read into it", r: "ok. i won't read into it. i'll stop reading altogether. bye {me}" },
        { tone: 'passive', t: "it's true. i was distracted and rude. i'm sorry", r: "ok. i believe you. thanks for saying sorry properly. that's the best kind of sorry" },
        { tone: 'flirty', t: "100% true. ask me again in person", r: "i will!! and i'll watch your face when you answer. i'm very good at faces. you can't hide" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-warm-cold-2', on: 'week', stage: 'warm', mood: 'cold',
    say: "saw a dog that looked exactly like you when you're concentrating. i wanted to send it but i wasn't sure i should",
    opts: [
      { tone: 'cold', t: "i look like a dog?", r: "a very distinguished dog!! it was a compliment. it didn't land. ok. sorry" },
      { tone: 'passive', t: "send it. i need to see this", r: "it has a little frown and its tongue out the side. it's you on the grid. i'm sorry. it's so you" },
      { tone: 'flirty', t: "you think about me even when you see dogs? cute", r: "i think about you when i see most things. dogs, toast, traffic lights. ok that was a lot to admit" },
    ],
  },
  {
    id: 'sunny-text-week-warm-cold-3', on: 'week', stage: 'warm', mood: 'cold',
    say: "hi. i'm still a bit sad about last time but i miss chatting to you more than i'm sad. so. hi",
    opts: [
      { tone: 'cold', t: "not sure what you want me to say", r: "nothing big. maybe just hi back. it's ok if not" },
      { tone: 'passive', t: "hi. i miss chatting too. sorry i was a pain", r: "oh good. hi!! sadness down by about 80%. the last 20% needs a coffee" },
      { tone: 'flirty', t: "hi. i missed you. more than i'd say out loud", r: "you just said it in writing!! that's worse!! ok. i'm smiling. hi again" },
    ],
  },
  {
    id: 'sunny-text-week-warm-passive-1', on: 'week', stage: 'warm', mood: 'passive',
    say: "i was meant to be working on {work} but i made jam!! it's meant to be strawberry. it came out brown. rustic. want a jar?",
    opts: [
      { tone: 'cold', t: "i'll pass", r: "ok! more rustic jam for me. and my neighbour, who can't say no" },
      { tone: 'passive', t: "always yes to rustic jam. what went wrong?", r: "i think i was distracted. by a podcast. and a thought about you. mostly the podcast. ok half" },
      { tone: 'flirty', t: "yes. bring it round and we'll test it on toast together", r: "a jam date!! i'll bring the good bread. you have to say it's lovely even if it isn't" },
    ],
  },
  {
    id: 'sunny-text-week-warm-passive-2', on: 'week', stage: 'warm', mood: 'passive',
    say: "what are you doing right now. i'm lying on the floor because the floor is cool and i've been gardening",
    opts: [
      { tone: 'cold', t: "working. can't chat", r: "oh ok! sorry. go work. i'll stay on the floor", opts: [
        { tone: 'cold', t: "yep", r: "ok. i'll stop distracting you. bye then" },
        { tone: 'passive', t: "sorry, that was short. data review. it's grim. tell me about the garden", r: "the tomatoes have finally gone red and one has a face. i'm not eating that one. it's family" },
        { tone: 'flirty', t: "working. picturing you on the floor though", r: "that's a very silly picture to have in your head. i'm covered in soil. i look like a potato" },
      ] },
      { tone: 'passive', t: "sim session. the floor sounds better. what did you plant?", r: "sweet peas!! and i moved the tomatoes. they looked lonely. i talk to them. they're good listeners", opts: [
        { tone: 'cold', t: "you talk to plants a lot", r: "i do. i talk to most things. maybe i'll stop telling you about it" },
        { tone: 'passive', t: "save me a tomato. i've earned it", r: "you can have the first one. it's tiny. like a marble. a very proud marble" },
        { tone: 'flirty', t: "i'd be a good listener too if you came over", r: "would you? you'd have to lie on the floor with me. that's the rule. floor people only" },
      ] },
      { tone: 'flirty', t: "picturing you covered in soil and grinning. am i close?", r: "SO close. there's soil on my nose. how did you know. do you know my face that well now??", opts: [
        { tone: 'cold', t: "lucky guess", r: "oh. ok. just a guess. right. back to the garden" },
        { tone: 'passive', t: "you always grin when you've done something you're proud of", r: "do i? i didn't know that. you notice nice things. thank you. i'm grinning now too" },
        { tone: 'flirty', t: "i know your face pretty well. i think about it a lot", r: "you can't text me that while i'm on the floor. now i have to stay down here forever" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-warm-passive-3', on: 'week', stage: 'warm', mood: 'passive',
    say: "found a list i wrote when we first met. 'nice laugh, likes cheese scones, scared of geese'. are you scared of geese?",
    opts: [
      { tone: 'cold', t: "you made a list about me? bit much", r: "oh. it's just how i remember things. it's a nice list. i'll put it away" },
      { tone: 'passive', t: "everyone should be scared of geese. they're dinosaurs", r: "they ARE dinosaurs!! with honks. ok i'm adding 'correct about geese' to the list" },
      { tone: 'flirty', t: "add 'can't stop thinking about you' to the list", r: "ADDING IT. with a star. underlined three times. ok four. my pen's gone through the paper" },
    ],
  },
  {
    id: 'sunny-text-week-warm-flirty-1', on: 'week', stage: 'warm', mood: 'flirty',
    say: "i keep thinking of something funny and turning round to tell you and you're not there. rude of you",
    opts: [
      { tone: 'cold', t: "i'm not always going to be there", r: "oh. i know. it was a joke about missing you. it came out wrong. or got read wrong", opts: [
        { tone: 'cold', t: "read it fine", r: "ok. then i'll keep my funny things to myself for a bit. night {me}" },
        { tone: 'passive', t: "sorry, long day. what was the funny thing?", r: "a pigeon got on the bus, rode two stops and got off at the library. it had a plan. i respect it" },
        { tone: 'flirty', t: "i'm not there yet. working on it", r: "yet!!! you said yet. i'm going to think about that 'yet' all day" },
      ] },
      { tone: 'passive', t: "ok i need the funny thing. tell me now", r: "a toddler told the cashier their name was Potato. the cashier said 'nice to meet you Potato'. i wept", opts: [
        { tone: 'cold', t: "ok. not that funny", r: "oh. it was funnier in real life. sorry. never mind" },
        { tone: 'passive', t: "haha Potato is iconic. i'm calling my engineer that", r: "do it!! tell me what they say. i need updates. Potato updates" },
        { tone: 'flirty', t: "funny. but i'd rather hear it with you next to me", r: "then come back sooner!! i'm saving all my funny things in a box for you. it's getting full" },
      ] },
      { tone: 'flirty', t: "next time turn round and i'll be there. promise", r: "you can't promise that, you're in a different country half the time!! but it's lovely to hear 🥹", opts: [
        { tone: 'cold', t: "fair. i probably can't", r: "oh. ok. i just liked the promise. it's fine. i know how it is" },
        { tone: 'passive', t: "i can promise to answer when you text me the funny thing", r: "deal. i'll text you everything. you'll regret this. i see so many funny things" },
        { tone: 'flirty', t: "i'll be there. even if i have to drive all night", r: "don't drive all night!! sleep!! but come quickly. legally quickly. ok i'm blushing" },
        { tone: 'risque', t: "i'll be there. and next time i'm not leaving till morning", r: "till MORNING?? you can't text that at lunchtime!! i'm at work!! my whole head is a tomato. ...ok" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-warm-flirty-2', on: 'week', stage: 'warm', mood: 'flirty',
    say: "confession: i've watched your interview clip 30 times. just the bit where you laugh. ok bye. no follow-up questions",
    opts: [
      { tone: 'cold', t: "it's just an interview", r: "i know. it's a nice laugh, that's all. i'll stop watching it now" },
      { tone: 'passive', t: "haha that reporter asked if i had a pet goldfish. i don't", r: "you should get one!! call it Pitstop. ok i'm getting carried away. i just liked seeing you happy" },
      { tone: 'flirty', t: "follow-up question: does my laugh make you blush?", r: "i said NO follow-up questions!! yes. obviously. it's a very blushy laugh. i hate you. i don't" },
    ],
  },
  {
    id: 'sunny-text-week-warm-flirty-3', on: 'week', stage: 'warm', mood: 'flirty',
    say: "i'm in bed with tea and a book and i've read the same page six times because i keep thinking about you. complaint filed",
    opts: [
      { tone: 'cold', t: "maybe pick a better book", r: "it's a good book!! it's not the book's fault. it's your fault. but ok", opts: [
        { tone: 'cold', t: "not my problem", r: "no. i suppose not. i'll read my page. night" },
        { tone: 'passive', t: "ok fair. what's the book?", r: "a lighthouse keeper adopts a seal. it's very gentle. you'd be asleep in a minute" },
        { tone: 'flirty', t: "ok it's my fault. what do you need to make it better?", r: "a voice note of you saying goodnight. that's all. very small request. tiny. huge" },
      ] },
      { tone: 'passive', t: "complaint received. what page are you stuck on?", r: "page 41. the seal has just learnt its name. it's a big moment and i keep missing it because of you", opts: [
        { tone: 'cold', t: "skip it then", r: "you can't skip a seal learning its name!! ok. i'll work it out myself. night" },
        { tone: 'passive', t: "read it out to me? i'll ring", r: "you'd listen to me read about a seal?? ok. ringing you. no laughing at my seal voice" },
        { tone: 'flirty', t: "the seal can wait. what's distracting you?", r: "it's private!! it involves you and a sofa and a film. a very normal film. i'm hiding under the duvet" },
      ] },
      { tone: 'flirty', t: "what exactly are you thinking about", r: "you. in general. your face. the way you say my name. that's all you're getting. i'm under the duvet", opts: [
        { tone: 'cold', t: "ok. night then", r: "oh. ok. night {me}. that was a bit of a short goodnight" },
        { tone: 'passive', t: "go to sleep, nerd. text you tomorrow", r: "nerd!! ok. sleep. tomorrow. i'll dream about the seal. night night" },
        { tone: 'flirty', t: "come out from under the duvet. i'll call and say your name", r: "ok but you're on speaker and my face is in a pillow. you'll hear me giggle. don't comment" },
        { tone: 'risque', t: "or i come over and you won't need the book at all", r: "it's 11pm and i'm in duck pyjamas!! you can't text that to someone in duck pyjamas. i'm laughing into my tea" },
      ] },
    ],
  },

  // ========================================================== WEEK / CLOSE
  {
    id: 'sunny-text-week-close-cold-1', on: 'week', stage: 'close', mood: 'cold',
    say: "morning. i didn't sleep great. last night felt wrong and i hate going to bed on a wrong night with you",
    opts: [
      { tone: 'cold', t: "it was fine. you're overthinking", r: "maybe. but i'd rather overthink than pretend. i'll give you some space today" },
      { tone: 'passive', t: "me neither. i'm sorry. can i call you at lunch?", r: "yes please. 12.30. i'll be on the bench by the fountain. bring your sorry voice, i'll bring mine" },
      { tone: 'flirty', t: "i hate it too. can i fix it tonight? in person?", r: "tonight is good. but talking first, then making up. i know your tricks, {me}" },
    ],
  },
  {
    id: 'sunny-text-week-close-cold-2', on: 'week', stage: 'close', mood: 'cold',
    say: "i know you're busy this week but you've been a bit far away. i'm not angry. i'm a bit lonely. that's all",
    opts: [
      { tone: 'cold', t: "i'm working. you know what this job is", r: "i do know. i'm proud of it. i'm just saying i'm lonely. both things can be true", opts: [
        { tone: 'cold', t: "i don't have time for this right now", r: "ok. i'll leave it. i'll be here when you have some time. i hope you do" },
        { tone: 'passive', t: "you're right. sorry. i'll call tonight, properly", r: "properly properly? not the 'two mins before bed' call? ok. i'll make tea for the occasion" },
        { tone: 'flirty', t: "lonely? come out to {track} this weekend. stay with me", r: "really?? i'd love that. i'll take friday off. still a bit hurt, but my bag's half packed" },
      ] },
      { tone: 'passive', t: "i'm sorry. i get tunnel vision. tell me about your week", r: "it was ok! i burnt a pie and the fire alarm sang to me. i wanted to tell you and you weren't there", opts: [
        { tone: 'cold', t: "a burnt pie isn't news", r: "it's not news. it's just my life. i wanted you in it. never mind" },
        { tone: 'passive', t: "tell me everything now. what kind of pie?", r: "leek and cheese. RIP. it was so close to being great. like most of my week. thanks for wanting to know" },
        { tone: 'flirty', t: "i'll come home and eat every burnt pie you make. promise", r: "every burnt pie? big promise. i'm making three this weekend. hope you're hungry" },
      ] },
      { tone: 'flirty', t: "lonely? come here. well. come to my hotel", r: "i can't just come to your hotel on a tuesday!! can i? no. but you can call and say nice things", opts: [
        { tone: 'cold', t: "never mind then", r: "oh. i wasn't saying no to you, just to tuesday. night {me}" },
        { tone: 'passive', t: "calling now. no nice things, just catching up", r: "catching up IS a nice thing! picking up. i'll sound like i've been sad. i'm better already" },
        { tone: 'flirty', t: "calling now with a list of nice things", r: "a LIST? how long is it? ok i'm getting under the blanket for this. read slowly" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-close-cold-3', on: 'week', stage: 'close', mood: 'cold',
    say: "sorry if i was clingy last time. i don't want to be the thing that makes your weekends heavier",
    opts: [
      { tone: 'cold', t: "you were, a bit", r: "ok. thank you for being honest. it still stings. i'll give you a bit more room" },
      { tone: 'passive', t: "you're not heavy. you're the light bit. i was just tired", r: "the light bit. i'm going to be the light bit forever now. thank you {me}. i needed that" },
      { tone: 'flirty', t: "cling away. i like you close", r: "oh. ok. i'll cling. i'll be a koala. a polite koala who asks first" },
    ],
  },
  {
    id: 'sunny-text-week-close-passive-1', on: 'week', stage: 'close', mood: 'passive',
    say: "how's the hotel? is the bed as bad as the last one? the one that sang every time you rolled over",
    opts: [
      { tone: 'cold', t: "it's a hotel bed. it's fine", r: "ok! glad it's fine. i'll stop asking about beds", opts: [
        { tone: 'cold', t: "yeah, please", r: "ok. talk later, maybe" },
        { tone: 'passive', t: "sorry. it's fine but it's too big without you", r: "oh {me}. that's a very sad sentence for a big bed. i'll keep yours warm here" },
        { tone: 'flirty', t: "it's fine. it'd be better with you in it", r: "would it?? i take up a lot of room. and steal the duvet. still want me in it? i think yes" },
      ] },
      { tone: 'passive', t: "no singing. but the pillows are like marshmallows. too soft", r: "ugh i hate a too-soft pillow. fold it in half!! my one life hack. that and buttering toast while it's hot", opts: [
        { tone: 'cold', t: "i know how to fold a pillow", r: "ok, sorry. of course you do. i was trying to help from far away" },
        { tone: 'passive', t: "folded. game changer. thank you, genius", r: "i'm a pillow genius!! finally recognised. sleep well. good luck tomorrow. i'll be on the sofa watching" },
        { tone: 'flirty', t: "folding helps. you'd help more", r: "i'm a very good pillow, it's true. everyone says. well. you say. you're everyone" },
      ] },
      { tone: 'flirty', t: "terrible. it's missing someone stealing the whole duvet", r: "i do NOT steal the whole duvet. i steal most of it. i'm cold-blooded. like a lizard. a cuddly lizard", opts: [
        { tone: 'cold', t: "a lizard, sure", r: "a cuddly one!! ok, never mind. night" },
        { tone: 'passive', t: "my cuddly lizard. sleep well, i'll ring tomorrow", r: "your cuddly lizard!! i love that. sleep well. i'll leave my phone on loud" },
        { tone: 'flirty', t: "come steal it this weekend. i'll let you win", r: "you'll LET me win? that's a first. ok. friday night. bring an extra duvet. or don't" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-close-passive-2', on: 'week', stage: 'close', mood: 'passive',
    say: "did the big shop and bought your weird crisps. the ones that taste like a bonfire. i hate them. i got two bags",
    opts: [
      { tone: 'cold', t: "i've gone off them", r: "oh. ok. i'll take them to work. someone will eat them. probably" },
      { tone: 'passive', t: "you're the best. save me a bag for when i'm back?", r: "i've hidden one behind the rice. you'll never find it. i'll have to show you. that's the plan" },
      { tone: 'flirty', t: "you hate them but you bought them. that's love", r: "it IS love. smoky, horrible love. don't tell anyone. they'll think i've gone soft. i have gone soft" },
    ],
  },
  {
    id: 'sunny-text-week-close-passive-3', on: 'week', stage: 'close', mood: 'passive',
    say: "ok i've been thinking about the holiday. i've made a spreadsheet. it has colours. don't be scared",
    opts: [
      { tone: 'cold', t: "can we not plan this now", r: "oh. ok. sorry. i'll save the colours for later. maybe" },
      { tone: 'passive', t: "send the spreadsheet. i want to see the colours", r: "yay!! green is beaches, yellow is food, pink is naps. there's a lot of pink. you need naps" },
      { tone: 'flirty', t: "is there a colour for 'not leaving the room'", r: "there IS now. it's purple. i've added it. there's... a lot of purple. stop making me blush at my laptop" },
    ],
  },
  {
    id: 'sunny-text-week-close-flirty-1', on: 'week', stage: 'close', mood: 'flirty',
    say: "i'm wearing your hoodie and eating cereal for dinner. this is what you've reduced me to. come home",
    opts: [
      { tone: 'cold', t: "you could cook something", r: "i could. i don't want to. i want you to come home. but fine, i'll make toast" },
      { tone: 'passive', t: "cereal for dinner is a valid choice. two more days", r: "two more days. i'm putting little ticks on the calendar. one tick done. you're a tick away" },
      { tone: 'flirty', t: "keep the hoodie on. i'll be home before you finish the bowl", r: "you're in a different country!! but i'll eat very slowly. like a sloth. a sloth in your hoodie" },
      { tone: 'risque', t: "save me the hoodie. i'll steal it back the fun way", r: "the fun way?? i know exactly what that means and i'm in. i'm not even blushing. ok a bit. come home" },
    ],
  },
  {
    id: 'sunny-text-week-close-flirty-2', on: 'week', stage: 'close', mood: 'flirty',
    say: "you looked so good on the telly today i had to pause it. my friend said 'are you ok' and i said 'no'",
    opts: [
      { tone: 'cold', t: "they film us all the time", r: "i know. it's not about the filming. it's about you. ok. i'll unpause", opts: [
        { tone: 'cold', t: "unpause then", r: "ok. unpausing. you're a bit grumpy today. talk later" },
        { tone: 'passive', t: "sorry, rough day. tell me what made you pause", r: "you pushed your hair back and squinted at the sky. very film poster. i paused it for ages" },
        { tone: 'flirty', t: "they film me. only you pause it", r: "only me. i'm the only pauser. it's a very exclusive club. members get kisses" },
      ] },
      { tone: 'passive', t: "haha tell your friend you're fine. just a bit unwell", r: "i'm VERY unwell. i've got a {me} problem. there's no cure. my friend's making me a tea", opts: [
        { tone: 'cold', t: "it's not that serious", r: "it is to me!! fine. i'm feeling much better now. thanks a lot" },
        { tone: 'passive', t: "drink the tea. i'll call after the debrief", r: "ok!! tea drunk. phone charged. i'll stop staring at the paused telly. maybe" },
        { tone: 'flirty', t: "the only cure is me coming home and kissing you better", r: "doctor's orders. i'll book the appointment. friday. all day. clear your diary" },
      ] },
      { tone: 'flirty', t: "what exactly made you pause it", r: "your face when the helmet came off. hair all messy. like you'd just woken up next to me", opts: [
        { tone: 'cold', t: "it was sweat, not a moment", r: "ok. sweaty moment. fine. i'm keeping my version" },
        { tone: 'passive', t: "most romantic thing anyone's said about helmet hair", r: "i'm very romantic about helmet hair. it's a niche. i'm the only one in it. i'm thriving" },
        { tone: 'flirty', t: "come home and i'll wake up next to you for real", r: "for real is better than the telly. come home. i've changed the sheets. i've been planning it since tuesday" },
        { tone: 'risque', t: "keep thinking about that. i'll make it come true tonight", r: "tonight?? ok. hall light on, everything else off. i'm not going to blush this time. i'm going to wait up" },
      ] },
    ],
  },
  {
    id: 'sunny-text-week-close-flirty-3', on: 'week', stage: 'close', mood: 'flirty',
    say: "it's raining and i'm thinking about when we got caught in the rain outside the cinema. i want to do that again",
    opts: [
      { tone: 'cold', t: "i was soaked for a week", r: "you were soaked for an evening!! fine. i'll remember it on my own then" },
      { tone: 'passive', t: "the cinema with the broken popcorn machine? best night", r: "yes!! and you gave me your jacket and then you were wet instead. you're silly. silly and sweet" },
      { tone: 'flirty', t: "the kissing in the doorway bit or the running bit?", r: "the doorway bit. obviously. the running was just to get to the doorway. i'm standing at my window now" },
      { tone: 'risque', t: "next time we skip the film, go straight to the doorway. and through it", r: "through it, up the stairs, kick the door shut. see, i can do it too. i'm only a little bit pink" },
    ],
  },

  // ================================================================== MET
  {
    id: 'sunny-text-met-new-cold-1', on: 'met', stage: 'new', mood: 'cold',
    say: "hi, it's {first} from the other night! i don't think i made the best impression. i'd like another go, if that's ok?",
    opts: [
      { tone: 'cold', t: "i'm pretty busy at the moment", r: "oh, of course. no worries. i'll leave the door open in case you're ever less busy" },
      { tone: 'passive', t: "you were fine. i wasn't great company. let's try again", r: "oh phew, ok!! deal. second go. i'll bring better jokes. i've been workshopping them on my plant" },
      { tone: 'flirty', t: "your impression was better than you think", r: "really?? i thought i'd scared you off with the duck thing. ok. i'm smiling. second go it is" },
    ],
  },
  {
    id: 'sunny-text-met-new-passive-1', on: 'met', stage: 'new', mood: 'passive',
    say: "hi!! it's {first}. we met the other night and i told you the thing about otters. i had fun. that's it. that's the text",
    opts: [
      { tone: 'cold', t: "who is this again?", r: "{first}! the otter one. it's ok if you don't remember, there were a lot of people", opts: [
        { tone: 'cold', t: "doesn't ring a bell", r: "oh. ok. sorry to bother you. have a nice week" },
        { tone: 'passive', t: "oh! otters. yes. sorry, long weekend. hi", r: "hi!! phew. long weekends make everyone fuzzy. how was it? did you sleep at all?" },
        { tone: 'flirty', t: "kidding. i've been hoping you'd text", r: "you've been HOPING? i was so nervous to send that. i wrote it on paper first. ok hi. hi properly" },
      ] },
      { tone: 'passive', t: "hi {first}! i had fun too. still thinking about otter pockets", r: "i knew the pockets would get you!! everyone loves the pockets. how's your week starting?", opts: [
        { tone: 'cold', t: "busy. can't really talk", r: "ok! no worries. text me when you're less busy. or don't. no pressure!!" },
        { tone: 'passive', t: "slow. training and emails. tell me something good", r: "my neighbour's cat climbed in my window and fell asleep on my jumper. i couldn't move for an hour. bliss" },
        { tone: 'flirty', t: "better now. i was hoping you'd message", r: "were you?? ok i'm doing a little spin on my chair. that's all. that's the update" },
      ] },
      { tone: 'flirty', t: "glad you texted. i was trying to work out how to find you", r: "you were?? i thought i'd talked too much. i always talk too much when i'm nervous. or happy. or awake", opts: [
        { tone: 'cold', t: "you did talk a lot", r: "ha. yeah. i'll try and text less, then. bye for now" },
        { tone: 'passive', t: "you talked the right amount. i liked it", r: "the right amount! that's a first. my nan says i could talk the legs off a table. i'm telling her" },
        { tone: 'flirty', t: "talk all you like. i'm happy listening to you", r: "careful, i'll hold you to that. i have SO much to say. starting now. ok. hi 😊" },
      ] },
    ],
  },
  {
    id: 'sunny-text-met-new-flirty-1', on: 'met', stage: 'new', mood: 'flirty',
    say: "hi it's {first}!! i'm still smiling from the other night. my cheeks hurt. is that a medical thing? asking for me",
    opts: [
      { tone: 'cold', t: "probably just a cramp", r: "oh. haha. ok. i'll put a warm flannel on it. bye" },
      { tone: 'passive', t: "haha i had a good time too. glad you texted", r: "me too!! i had to be brave. i wrote 'hi' and then had a lie down. glad i sent it" },
      { tone: 'flirty', t: "my cheeks hurt too. must be contagious", r: "contagious!! we've got the same thing. we should probably meet up. to compare symptoms 🙈" },
    ],
  },

  // ================================================================= DATE
  {
    id: 'sunny-text-date-warm-cold-1', on: 'date', stage: 'warm', mood: 'cold',
    say: "morning. dinner was lovely, thanks. i hope i didn't do something wrong at the end? you went a bit quiet",
    opts: [
      { tone: 'cold', t: "it was just dinner", r: "oh. ok. it felt like more than that to me. i'll stop reading into things" },
      { tone: 'passive', t: "you didn't. i was tired. i had a really good time", r: "oh good!! i've been worrying since the taxi. i had a lovely time too. the pudding!! the pudding" },
      { tone: 'flirty', t: "i went quiet because i didn't want it to end", r: "oh. OH. that's so much better than what i was imagining. i'm going to have a very good day now" },
    ],
  },
  {
    id: 'sunny-text-date-warm-passive-1', on: 'date', stage: 'warm', mood: 'passive',
    say: "good morning!! still thinking about the tiny dog at the next table. and you. mostly the dog. kidding. mostly you",
    opts: [
      { tone: 'cold', t: "the dog was annoying", r: "the dog was PERFECT. ok. we'll agree to disagree. have a good day" },
      { tone: 'passive', t: "that dog had better manners than me. thanks for coming out", r: "thank YOU. nicest evening i've had in ages. even with the soup incident" },
      { tone: 'flirty', t: "mostly me? i'll take that over a dog any day", r: "it's a big compliment!! that dog had a bow tie. you beat a dog in a bow tie. again soon?" },
    ],
  },
  {
    id: 'sunny-text-date-warm-flirty-1', on: 'date', stage: 'warm', mood: 'flirty',
    say: "so. last night. i've been grinning so much my flatmate asked if i'd won something. i said 'sort of'",
    opts: [
      { tone: 'cold', t: "it was one date", r: "one VERY nice date. but ok. i'll tone the grinning down. it's hard", opts: [
        { tone: 'cold', t: "maybe tone it right down", r: "ok. message received. you can text me if you want another one" },
        { tone: 'passive', t: "sorry. it was a great date. i'm just bad at saying it", r: "you just said it! see? you're getting good at it. gold star for you" },
        { tone: 'flirty', t: "one date. i want another. soon", r: "SOON. yes. how soon? friday soon? i'm free friday. i'm suddenly free all of friday" },
      ] },
      { tone: 'passive', t: "you did win something. a free dessert, remember?", r: "the free dessert!! because the waiter thought it was my birthday. best lie i never told", opts: [
        { tone: 'cold', t: "it was just a mix-up", r: "i know, i was just being silly. ok. have a good one" },
        { tone: 'passive', t: "next time i'll tell them it's my birthday", r: "deal. we'll take turns. free desserts every week. it's a scheme. i'm good at schemes" },
        { tone: 'flirty', t: "and the bit after dessert, on your doorstep", r: "the doorstep bit!! i've thought about that forty times today. my cheeks are the colour of jam" },
      ] },
      { tone: 'flirty', t: "sort of? i'd say you won a second date", r: "a second date!! i accept my prize. i'll wear the blue jumper. or the other blue jumper. i have a lot of blue", opts: [
        { tone: 'cold', t: "maybe. let's see", r: "oh. ok. maybe. that's a smaller prize than i thought. fine" },
        { tone: 'passive', t: "definitely. pick a place, anywhere you like", r: "anywhere?? there's a pancake place with a goose that lives outside. it's a very calm goose. promise" },
        { tone: 'flirty', t: "and a doorstep kiss that lasts longer this time", r: "longer?? ok i'll stand very still and not giggle. i'll giggle. but i'll stand still 🙈" },
        { tone: 'risque', t: "or skip the doorstep. invite me in for coffee this time", r: "COFFEE. i know what coffee means. i've seen films. i'm red to the ears. ask me again on the doorstep" },
      ] },
    ],
  },
  {
    id: 'sunny-text-date-close-cold-1', on: 'date', stage: 'close', mood: 'cold',
    say: "morning. last night was nice until it wasn't. can we talk about the bit in the taxi?",
    opts: [
      { tone: 'cold', t: "nothing happened in the taxi", r: "you went quiet when i mentioned meeting your family. something did. i just want to understand", opts: [
        { tone: 'cold', t: "drop it", r: "ok. i'll drop it. but i need a few days. i'm not a door you can slam and reopen" },
        { tone: 'passive', t: "ok. it scared me a bit. it's a big step", r: "it's a big step for me too. we can go slow. thank you for telling me. that's all i wanted" },
        { tone: 'flirty', t: "let me take you for breakfast and explain properly", r: "breakfast and an explanation. in that order. i'll get the window table. i'm still a bit sad" },
      ] },
      { tone: 'passive', t: "yeah. i'm sorry. i was in a weird place", r: "thank you. i was worried you were annoyed with me. were you? you can say", opts: [
        { tone: 'cold', t: "a bit, yeah", r: "ok. that's fair to say. it's hard to hear. i'll think about it. talk later" },
        { tone: 'passive', t: "not with you. with me. call tonight?", r: "tonight. yes. 9ish? i'll have tea and patience. lots of patience. and biscuits" },
        { tone: 'flirty', t: "never with you. you looked far too good last night", r: "flattery's a good start. not a finish. but a good start. ok, call me later" },
      ] },
      { tone: 'flirty', t: "what about the bit before the taxi? that was nice", r: "the bit before the taxi was very nice. but i'm serious, {me}. i want to talk about the after bit too", opts: [
        { tone: 'cold', t: "there's nothing to say", r: "there is though. when you're ready, i'll be here. i'm off to walk it out by the river" },
        { tone: 'passive', t: "you're right. sorry. let's talk. i'm free at 6", r: "6 it is. thank you. i promise it'll be a nice talk. a kind one. i'm good at kind ones" },
        { tone: 'flirty', t: "talk, then the before-taxi bit again. deal?", r: "deal. talking first. i'll be firm. i won't be firm. ok, a bit firm. then the before bit" },
      ] },
    ],
  },
  {
    id: 'sunny-text-date-close-passive-1', on: 'date', stage: 'close', mood: 'passive',
    say: "good morning sleepyhead. i left you a note on the kettle. and a slice of toast. the toast might be cold by now",
    opts: [
      { tone: 'cold', t: "i don't eat cold toast", r: "ok. sorry. it was more about the note than the toast. bin it, then" },
      { tone: 'passive', t: "cold toast is still toast. what does the note say?", r: "you'll have to read it!! it's got a drawing. it's meant to be you. it looks like a potato in a helmet" },
      { tone: 'flirty', t: "you left before i woke up. that's illegal", r: "i had work!! i tried to wake you and you said 'five more laps'. i nearly called in sick. i should have" },
    ],
  },
  {
    id: 'sunny-text-date-close-flirty-1', on: 'date', stage: 'close', mood: 'flirty',
    say: "i can still smell your shampoo on my pillow and i'm not washing it. ever. that's my policy now",
    opts: [
      { tone: 'cold', t: "wash your pillow", r: "never!! fine. eventually. a bit hurt you'd want me to" },
      { tone: 'passive', t: "haha good policy. last night was lovely", r: "it was the best. the pasta. the film. falling asleep on the sofa. you're my favourite person" },
      { tone: 'flirty', t: "i'll come back and top it up tonight", r: "top it up!! yes please. home by 6. i'll be waiting. probably on that pillow. smelling it" },
      { tone: 'risque', t: "tonight i'm staying, so it'll smell like me for a week", r: "a week?? then stay longer than a night. bring a toothbrush and cancel your morning. i've got plans for you" },
    ],
  },

  // ========================================================== RACE: WIN
  {
    id: 'sunny-text-win-any-cold-1', on: 'win', stage: 'any', mood: 'cold',
    say: "i know we're a bit wobbly, but i couldn't not text. you WON. {last}!! i'm so proud of you",
    opts: [
      { tone: 'cold', t: "thanks.", r: "ok. that's ok. i just wanted you to know someone was cheering. still am" },
      { tone: 'passive', t: "thank you. honestly, that means a lot today", r: "it should!! i screamed so loud my neighbour knocked on the wall. i think they were cheering too" },
      { tone: 'flirty', t: "cheering for me even when i've been rubbish? come celebrate", r: "i'd love to. i'm still a bit wobbly, but a win is a win. i'll bring a cake. it'll be wonky" },
    ],
  },
  {
    id: 'sunny-text-win-any-passive-1', on: 'win', stage: 'any', mood: 'passive',
    say: "YOU WON!!! i jumped up and knocked over my tea and i don't even care. the carpet doesn't care. {me}!!!",
    opts: [
      { tone: 'cold', t: "it was a good race. that's all", r: "it was the BEST race. ok. i'll let you celebrate with the team. congratulations 🎉" },
      { tone: 'passive', t: "thank you!! read your text before the podium", r: "before the podium!! i'm on your phone before the podium. i'm framing that sentence" },
      { tone: 'flirty', t: "i won. now come and give me my prize", r: "your PRIZE? i'm the prize?? oh no. ok. getting on the train. i'm crying a bit. happy crying" },
    ],
  },
  {
    id: 'sunny-text-win-any-flirty-1', on: 'win', stage: 'any', mood: 'flirty',
    say: "you WON. i've watched the last lap six times. i'm shaking. i want to kiss your face off. sorry. not sorry 🙈",
    opts: [
      { tone: 'cold', t: "maybe calm down a bit", r: "oh. ok. sorry. i got excited. it's a big day for you. i'll give you some room", opts: [
        { tone: 'cold', t: "will do", r: "congratulations. i mean it. even if it feels like you don't want me to" },
        { tone: 'passive', t: "sorry. i'm just overwhelmed. thank you, really", r: "of course!! overwhelmed is allowed. drink water. eat a sandwich. then be happy. in that order" },
        { tone: 'flirty', t: "kidding. i want my face kissed off. come out tonight", r: "TONIGHT?? i'm in my pyjamas!! i'll get dressed. i'll be quick. i'll be so quick" },
      ] },
      { tone: 'passive', t: "six times! i haven't even watched it once yet", r: "watch it!! the move round the outside near the end. i shouted 'go on' so loud my voice cracked", opts: [
        { tone: 'cold', t: "i'll watch it when i've got time", r: "ok. you're busy, i know. congratulations again" },
        { tone: 'passive', t: "watching it now with the team. you're right, it's good", r: "it's SO good. i hope they're all hugging you. hug them back from me" },
        { tone: 'flirty', t: "i'd rather watch it with you", r: "with me? ok. i'll make popcorn. and i'll kiss you every time you overtake. that's the rule" },
      ] },
      { tone: 'flirty', t: "kiss my face off? best trophy yet", r: "better than the trophy?? it's a very shiny trophy. but yes. obviously. i'm better. i'm warmer", opts: [
        { tone: 'cold', t: "the trophy doesn't text me at midnight", r: "ha. ok. fine. enjoy your trophy then" },
        { tone: 'passive', t: "celebrate with me tomorrow? breakfast?", r: "a winner's breakfast!! i'll do the face pancakes. one will have a little crown" },
        { tone: 'flirty', t: "warmer and softer. i'll be home soon to collect", r: "collect! like a parcel! i'll be by the door. with a ribbon on. not literally. maybe literally" },
      ] },
    ],
  },

  // ======================================================= RACE: PODIUM
  {
    id: 'sunny-text-podium-any-cold-1', on: 'podium', stage: 'any', mood: 'cold',
    say: "hey. i saw the podium. well done. i know we're not great right now, but i'm still glad for you",
    opts: [
      { tone: 'cold', t: "noted.", r: "ok. well done again {me}. take care of yourself" },
      { tone: 'passive', t: "thanks. and i'm sorry for how i was. means a lot you texted", r: "of course i texted. i don't stop being on your side because i'm sad. that's not how it works" },
      { tone: 'flirty', t: "i looked for you in the crowd. habit", r: "you did? oh. i'm meant to be cross, not melting. ok i'm melting. a bit" },
    ],
  },
  {
    id: 'sunny-text-podium-any-passive-1', on: 'podium', stage: 'any', mood: 'passive',
    say: "PODIUM!!! {result}!!! i'm so proud of you i made the noise. you know the noise. the kettle noise",
    opts: [
      { tone: 'cold', t: "it wasn't the win, though", r: "it's a podium!! it's amazing. ok, i know you wanted more. it's still amazing to me", opts: [
        { tone: 'cold', t: "doesn't feel amazing", r: "ok. i'll stop. i hope it feels better tomorrow. proud of you anyway" },
        { tone: 'passive', t: "you're right. i should enjoy it. thank you", r: "yes!! enjoy it!! eat something nice. look at your trophy. it's very shiny. i zoomed in" },
        { tone: 'flirty', t: "it'd feel like a win if you were here", r: "then i'll come next time and it'll be a win. that's how luck works. i'm basically a horseshoe" },
      ] },
      { tone: 'passive', t: "the kettle noise!! did the neighbour complain again?", r: "they knocked, but it was a celebratory knock. i'm sure. we're basically friends now. through the wall", opts: [
        { tone: 'cold', t: "you should keep it down", r: "oh. ok. i'll be quieter next time. congratulations" },
        { tone: 'passive', t: "tell the neighbour they can come to the next one", r: "they'll love that!! they're 88 and they've never seen a car go fast. mainly buses" },
        { tone: 'flirty', t: "make the noise again when i call you tonight", r: "you'll laugh, then i'll laugh, then it's just two people laughing. that's my favourite sort of phone call" },
      ] },
      { tone: 'flirty', t: "make the noise for me in person next time", r: "only if you're very close and very pleased with yourself. which you will be. so yes", opts: [
        { tone: 'cold', t: "maybe", r: "ok. maybe. that's ok. well done today" },
        { tone: 'passive', t: "deal. now go have a nice evening, you deserve it too", r: "i'm having toast and watching your highlights. that IS my nice evening. it's perfect" },
        { tone: 'flirty', t: "very close. i'm counting on it", r: "count on it!! i'll practise the noise in the mirror. ok i won't. it'll just come out" },
      ] },
    ],
  },
  {
    id: 'sunny-text-podium-any-flirty-1', on: 'podium', stage: 'any', mood: 'flirty',
    say: "you on the podium in that cap, grinning?? i had to have a little sit down. and then a little lie down",
    opts: [
      { tone: 'cold', t: "it's just a podium cap", r: "it's not the cap!! it's you in it. fine. i'll get up off the floor" },
      { tone: 'passive', t: "haha thank you. the champagne went everywhere", r: "it went all over your interviewer!! and you did a little wink after. was that for me? say yes" },
      { tone: 'flirty', t: "lie down long enough and i'll come join you", r: "{me}!! you can't text that while i'm at my nan's. i've gone so red she thinks i've got a fever" },
    ],
  },

  // ======================================================= RACE: POINTS
  {
    id: 'sunny-text-points-any-cold-1', on: 'points', stage: 'any', mood: 'cold',
    say: "hey. i watched. {result} is solid points, {me}. i hope you're doing ok. no need to reply",
    opts: [
      { tone: 'cold', t: "i'm fine. no need for the check-in", r: "ok. i'll stop checking in. i'm still glad you got points" },
      { tone: 'passive', t: "i'm ok. thanks for watching. and for texting", r: "always. i'll always watch. even when we're wobbly. i booed the safety car, by the way" },
      { tone: 'flirty', t: "i'm better now you've texted", r: "are you? ok. i'm still a bit careful with you. but that's a nice thing to hear. well done" },
    ],
  },
  {
    id: 'sunny-text-points-any-passive-1', on: 'points', stage: 'any', mood: 'passive',
    say: "{result}!! points!! points for the team and points for me for not biting my nails. well i bit two",
    opts: [
      { tone: 'cold', t: "only a few points", r: "points are points!! more next time. for now, get some rest" },
      { tone: 'passive', t: "only two nails? that's progress", r: "huge progress!! i chewed a carrot instead. my coping carrot. you got points, i got a carrot" },
      { tone: 'flirty', t: "next time hold my hand instead of biting your nails", r: "i'd crush it, i'm a very nervous watcher. your poor driving hand. ok. i'd hold it very gently" },
    ],
  },
  {
    id: 'sunny-text-points-any-flirty-1', on: 'points', stage: 'any', mood: 'flirty',
    say: "you scored points AND you looked very nice in the interview after. two achievements. i'm proud of both",
    opts: [
      { tone: 'cold', t: "i looked knackered", r: "you looked knackered AND nice. both. it's allowed. ok, i'll stop", opts: [
        { tone: 'cold', t: "please", r: "ok. stopping. well done on the points" },
        { tone: 'passive', t: "ha. thanks. it was a hard one. glad you watched", r: "of course i watched. i made a little chart of your points. it's going up" },
        { tone: 'flirty', t: "knackered and nice. i'll take it if it's from you", r: "it's from me. with a heart. a small one. ok a big one. a normal-sized heart" },
      ] },
      { tone: 'passive', t: "thanks. i was so tired i forgot my own team's name", r: "you said 'the... um, us' and then laughed. it was the cutest thing. no one noticed. i noticed", opts: [
        { tone: 'cold', t: "great, so it looked bad", r: "no!! it looked human. ok. i'll keep my noticings to myself" },
        { tone: 'passive', t: "you notice everything. it's a bit scary", r: "i'm a professional noticer. it's my hobby. along with jam. and you. you're a hobby now" },
        { tone: 'flirty', t: "notice me in person this week?", r: "yes. i'll notice everything. your hair. your tired face. your nice hands. ok i'm done noticing" },
      ] },
      { tone: 'flirty', t: "proud of my face, are you?", r: "very proud. it's a good face. it does good work. i told it so. it didn't hear. it's on the telly", opts: [
        { tone: 'cold', t: "it's just my face", r: "it's not JUST your face. ok. never mind. good race" },
        { tone: 'passive', t: "tell it in person. it's back on thursday", r: "thursday!! putting it in my calendar. 'tell the face'. with a sun sticker" },
        { tone: 'flirty', t: "my face wants to see your face. soon", r: "my face is very available. it's doing a big smile right now. it's a bit embarrassing. soon please" },
      ] },
    ],
  },

  // ========================================================== RACE: BAD
  {
    id: 'sunny-text-bad-any-cold-1', on: 'bad', stage: 'any', mood: 'cold',
    say: "hey. i saw the race. sorry it didn't go your way. i know we're a bit off, but i didn't want you feeling alone",
    opts: [
      { tone: 'cold', t: "i don't want to talk about it", r: "we don't have to. i'll just leave this here: you're still brilliant. that's all", opts: [
        { tone: 'cold', t: "please stop", r: "ok. stopping. look after yourself, {me}" },
        { tone: 'passive', t: "sorry. thank you. i just feel rubbish", r: "rubbish is allowed. eat something warm and go to bed early. tomorrow's a whole new circuit" },
        { tone: 'flirty', t: "you're still brilliant too. and i've been a grump lately", r: "oh. that's nice. we can fix last time later. right now just rest" },
      ] },
      { tone: 'passive', t: "thanks. that means more than you know right now", r: "i'm glad. bad races happen to brilliant people. you'll get {track}. i can feel it in my toes", opts: [
        { tone: 'cold', t: "your toes don't know anything about racing", r: "they know a little bit!! but ok. i hear you. rest well" },
        { tone: 'passive', t: "tell your toes i'm counting on them", r: "they're very honoured. they're wiggling. that's a good sign. go get some rest" },
        { tone: 'flirty', t: "can i call you tonight? i want to hear your voice", r: "yes. call me. i'll tell you about my day so you don't have to think about yours" },
      ] },
      { tone: 'flirty', t: "you texting made the day less bad", r: "really? then i'll text more. even if we're wobbly. you're worth wobbling for", opts: [
        { tone: 'cold', t: "don't overdo it", r: "ok. i won't overdo it. i'll just be here. quietly" },
        { tone: 'passive', t: "let's sort out the wobbly. coffee this week?", r: "yes. coffee and a proper chat. thank you for wanting to fix it. i do too" },
        { tone: 'flirty', t: "keep wobbling. i like you wobbly", r: "you like me wobbly? strange compliment. i'll take it. i'm smiling. carefully" },
      ] },
    ],
  },
  {
    id: 'sunny-text-bad-any-passive-1', on: 'bad', stage: 'any', mood: 'passive',
    say: "ugh, {result}. i'm sorry. i shouted at the telly so much the neighbour's dog joined in. you'll get them next time",
    opts: [
      { tone: 'cold', t: "i don't need a pep talk", r: "ok. no pep talk. just a 'sorry' and a 'you're great'. that's all i've got. bye" },
      { tone: 'passive', t: "haha tell the dog thanks for the support", r: "the dog says you're a good driver and asks if you have any ham. very focused dog" },
      { tone: 'flirty', t: "you're the only good thing about today", r: "oh {me}. come here. well. not here. but come here in a text way. there. a text hug 🤍" },
    ],
  },
  {
    id: 'sunny-text-bad-any-flirty-1', on: 'bad', stage: 'any', mood: 'flirty',
    say: "rubbish race, but you looked very cute being cross in the pit lane. is that allowed? i've said it now",
    opts: [
      { tone: 'cold', t: "i wasn't being cute. i was angry", r: "i know. sorry. that was a silly thing to say. i'll leave you be" },
      { tone: 'passive', t: "allowed. it's actually cheered me up a bit", r: "good!! cross is cute on you. but happy is cuter. aim for happy. drink some tea" },
      { tone: 'flirty', t: "come over and cheer me up properly then", r: "properly?? soup and a blanket and a film? because that's my properly. oh. you mean... i'm bringing soup" },
    ],
  },

  // ========================================================== RACE: DNF
  {
    id: 'sunny-text-dnf-any-cold-1', on: 'dnf', stage: 'any', mood: 'cold',
    say: "hi. i saw you had to retire. are you ok? i know things are weird, i just wanted to check",
    opts: [
      { tone: 'cold', t: "i'm fine. just annoyed", r: "ok. annoyed makes sense. i'll leave you be. i'm glad you're ok" },
      { tone: 'passive', t: "i'm ok. gutted. thanks for checking", r: "of course. gutted is a big feeling. there's a cheese scone here with your name on it. on the bag" },
      { tone: 'flirty', t: "i'm ok. better for hearing from you, actually", r: "oh. good. i was all anxious. i'm still a bit bruised from last time, but i'm glad" },
    ],
  },
  {
    id: 'sunny-text-dnf-any-passive-1', on: 'dnf', stage: 'any', mood: 'passive',
    say: "oh no {me}. that was so unfair. you were having such a good race. sending you a very big virtual hug",
    opts: [
      { tone: 'cold', t: "a hug won't fix the car", r: "no. but it might fix a bit of you. ok. i'll leave it. sorry", opts: [
        { tone: 'cold', t: "nothing will", r: "ok. i'll stop. i'm here if you change your mind" },
        { tone: 'passive', t: "sorry. that was snappy. i'll take the hug", r: "here!! big one. squeezing. the car's fixable. you don't need fixing. you're good as you are" },
        { tone: 'flirty', t: "fine. but i want the real one when i'm back", r: "the real one's waiting. it's a very good hug. people have cried. ok, i've cried. you'll like it" },
      ] },
      { tone: 'passive', t: "thanks. gutted. it felt so good until it didn't", r: "i know. you were flying. the feeling will come back. it's not gone, it's just in the garage", opts: [
        { tone: 'cold', t: "you don't know that", r: "i don't know racing. but i know you. ok. i'll stop. sleep well" },
        { tone: 'passive', t: "just in the garage. i like that. thank you", r: "i'm very wise sometimes. mostly by accident. go have a bath. or a nap. or both" },
        { tone: 'flirty', t: "can i come to yours after the flight? i need a sofa and you", r: "yes. sofa, me, blanket, the penguin film. i'll put the kettle on when you land" },
      ] },
      { tone: 'flirty', t: "that hug is the best thing that's happened all day", r: "then let me do more. a second virtual hug. a little one. a third. ok, i'm stopping. no i'm not", opts: [
        { tone: 'cold', t: "ok, enough hugs", r: "ok. hugs stopped. i hope tomorrow's kinder" },
        { tone: 'passive', t: "keep them coming. honestly, it helps", r: "then i'll keep going till you're asleep. hug. hug. that's a sleepy hug. that one's goodnight" },
        { tone: 'flirty', t: "save the rest. i want to collect them in person", r: "saving every single one. there'll be so many. you'll have to stay a while to get them all" },
      ] },
    ],
  },
  {
    id: 'sunny-text-dnf-any-flirty-1', on: 'dnf', stage: 'any', mood: 'flirty',
    say: "i know today was horrid. but you looked very brave next to a broken car. still my favourite driver. by miles",
    opts: [
      { tone: 'cold', t: "it's not brave, it's my job", r: "ok. sorry. i just wanted to say something nice. i'll leave it there" },
      { tone: 'passive', t: "thanks. i'll get it right at {track}", r: "you will!! i'm already making a sign for {track}. it has glitter. you'll hate it. you'll love it" },
      { tone: 'flirty', t: "favourite by miles? prove it. come see me tonight", r: "on my way. in spirit. and on the 6 o'clock train. hold on. i'm bringing biscuits" },
    ],
  },
];
