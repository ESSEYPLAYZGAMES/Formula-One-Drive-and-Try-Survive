// Sunny (SWEET) - texts in the week between races: stage new/warm/close x 6 story slots x 3 opening moods.
export const DATA = [
  // ===================================================================== WEEK NEW 1: cereal or milk first
  { id: 'sunny-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: "hi. i wasn't sure i should text after last time but i have a very important question. cereal first or milk first?",
    opts: [
      { tone: 'cold', t: "Is that really why you texted?", r: "partly. mostly i wanted to check we're ok. but ok. sorry. i'll leave you be 🙈" },
      { tone: 'passive', t: "Cereal first. Obviously. And sorry for before.", r: "CORRECT. oh thank goodness. and thank you. that's two good things in one text ☺️" },
      { tone: 'flirty', t: "Cereal first. Ask me another, I like the questions.", r: "you like my questions?? ok i have about forty. pacing myself. no i'm not. next: socks in bed, yes or no" },
    ] },
  { id: 'sunny-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: ["random q but are you a cereal-first or milk-first person. it's important. i'm deciding things about you",
      "hi!! quick survey. cereal then milk, or milk then cereal. there is a right answer. no pressure 🥣"],
    opts: [
      { tone: 'cold', t: "Never really thought about it.", r: "oh. ok! fair. not everyone has breakfast opinions. i have too many. as you can see. carry on 🙂" },
      { tone: 'passive', t: "Cereal first. Milk first is chaos.", r: "YES. we can be friends. officially. i was nervous. my flatmate's milk-first and i've never trusted them" },
      { tone: 'flirty', t: "Depends. Are you making me breakfast?", r: "oh!! um. that's a very forward breakfast answer. i'm pink at my desk. cereal first, if i ever do 🙈" },
    ] },
  { id: 'sunny-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: "been smiling since we talked and i've run out of normal reasons to text you. so: cereal or milk first?",
    opts: [
      { tone: 'cold', t: "You don't need a reason. Or to text that much.", r: "oh. right. ok. noted. i'll text a normal amount. whatever that is. sorry {me}" },
      { tone: 'passive', t: "Cereal first. And you don't need a reason.", r: "cereal first AND no reason needed?? today is going very well. i'm putting it on a slip later ☺️" },
      { tone: 'flirty', t: "Cereal first. Keep smiling, it suits you.", r: "you can't see me smiling!! how do you know. ok you're right. it's a big one. stop it 🙈" },
    ] },
  // ===================================================================== WEEK NEW 2: waved at a car in a showroom (deep)
  { id: 'sunny-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: "hey. still a bit odd about last time. but i waved at a red car in a showroom today because it reminded me of you. so",
    opts: [
      { tone: 'cold', t: "Why would a car remind you of me?", r: "because you drive them? fast? it made sense in my head. it was a sad little wave honestly", opts: [
        { tone: 'cold', t: "Maybe don't wave at cars.", r: "ok. noted. no more waving. bye {me}" },
        { tone: 'passive', t: "Ha. Ok, that's a bit funny. Sorry for being off.", r: "it's ok!! thank you. the wave was much happier after that text. retroactively 🙂" },
        { tone: 'flirty', t: "Next time wave at me instead.", r: "i would!! i'd wave so hard. both hands. you'd see it from the track" },
      ] },
      { tone: 'passive', t: "That's sweet. Sorry I was off last time.", r: "means a lot. really. also someone INSIDE the showroom waved back. mortifying", opts: [
        { tone: 'cold', t: "That's what you get for waving at cars.", r: "haha. yes. i suppose. lesson learned. bye for now" },
        { tone: 'passive', t: "Did you wave back at the waver?", r: "i did!! panicked. now we're sort of friends. they have my number for a test drive. help" },
        { tone: 'flirty', t: "I'm jealous of the waver.", r: "jealous!! of a showroom person?? stop. you get all the real waves. promise 🙈" },
      ] },
      { tone: 'flirty', t: "You wave at cars because of me? That's adorable.", r: "it's not adorable it's embarrassing!! a salesperson waved back. i had to hide behind a bus stop", opts: [
        { tone: 'cold', t: "It is pretty embarrassing.", r: "yes. thank you. i know. i'll go and be embarrassed somewhere quiet" },
        { tone: 'passive', t: "Hiding behind a bus stop is the best bit.", r: "it was a very thin bus stop. i was not hidden. a pigeon judged me" },
        { tone: 'flirty', t: "Embarrassing and adorable. Both.", r: "both?? ok fine. i'll allow both. you're very generous with adjectives 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: "waved at a red car in a showroom today because it reminded me of you. someone inside waved back. mortifying",
    opts: [
      { tone: 'cold', t: "Why are you telling me this?", r: "because it was funny? and about you? sorry. i thought you'd laugh", opts: [
        { tone: 'cold', t: "I didn't.", r: "ok. that's fine. i'll save the funny ones for someone else. take care {me}" },
        { tone: 'passive', t: "Sorry. Long day. It is funny.", r: "oh good!! i was about to throw my phone in a pond. long days are allowed 💛" },
        { tone: 'flirty', t: "I did laugh. I just wanted you to say it was about me.", r: "it was about you!! obviously!! ok you got me. i'm pink. sneaky" },
      ] },
      { tone: 'passive', t: "Ha! And did you wave back?", r: "i did. reflex. now there's a whole relationship. they gave me a brochure", opts: [
        { tone: 'cold', t: "Sounds like a waste of an afternoon.", r: "it wasn't!! but ok. not everyone loves a brochure. bye 🙂" },
        { tone: 'passive', t: "Are you buying a car now?", r: "absolutely not. i can't parallel park. i'm keeping the brochure though. it's very shiny" },
        { tone: 'flirty', t: "Should I be worried about this waver?", r: "worried!! no!! they had a moustache and a lanyard. you're safe. very safe 🙈" },
      ] },
      { tone: 'flirty', t: "A car reminded you of me? Should I be flattered?", r: "yes!! very!! it was a nice car. shiny. fast-looking. ok i'm stopping before i say something", opts: [
        { tone: 'cold', t: "Probably best to stop.", r: "ok. stopped. full stop. bye {me}" },
        { tone: 'passive', t: "What colour was it?", r: "red!! like yours. well. like the telly makes yours look. is it actually red?" },
        { tone: 'flirty', t: "Say the something.", r: "no!! absolutely not. it's going on a slip and staying there. you can't make me" },
      ] },
    ] },
  { id: 'sunny-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: "you've ruined me. i waved at a red car in a showroom today because it looked like it belonged to you. someone waved BACK",
    opts: [
      { tone: 'cold', t: "I haven't ruined anything. It's a car.", r: "it's a saying!! but ok. sorry. that came across too much i think", opts: [
        { tone: 'cold', t: "It did.", r: "ok. i'll dial it down. bye {me} 🙂" },
        { tone: 'passive', t: "Sorry, I'm being grumpy. Who waved back?", r: "a salesperson!! with a clipboard!! i panicked and gave them a thumbs up. awful" },
        { tone: 'flirty', t: "Fine. I've ruined you. I'll take it.", r: "you'll TAKE it?? that's so smug. it's working on me. annoyingly" },
      ] },
      { tone: 'passive', t: "Ha! What did you do?", r: "i did a thumbs up. then walked into a bin. then pretended i meant to. classic me", opts: [
        { tone: 'cold', t: "That does sound like you.", r: "haha. ouch. but fair. bye for now" },
        { tone: 'passive', t: "Was the bin ok?", r: "the bin is fine. my dignity isn't. thank you for asking after the bin" },
        { tone: 'flirty', t: "Walking into bins over me. I love it.", r: "you love that i walk into bins?? ok. i'll walk into more. for you 🙈" },
      ] },
      { tone: 'flirty', t: "I've ruined you? I've barely started.", r: "BARELY STARTED?? you can't say that over text!! i'm going pink in public. people are looking", opts: [
        { tone: 'cold', t: "Relax, it was a joke.", r: "oh. ok. a joke. sure. haha. i'll unpink. bye {me}" },
        { tone: 'passive', t: "Sorry. Where are you, that people are looking?", r: "on the bus!! i've just squeaked. out loud. a toddler is staring at me" },
        { tone: 'flirty', t: "Good. Stay pink.", r: "i have no choice now. i'm a strawberry on a bus. thanks a lot ☺️" },
      ] },
    ] },
  // ===================================================================== WEEK NEW 3: crossword
  { id: 'sunny-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: "doing the crossword and thinking about last time and i'm not good at either. clue: 'fast mover', 5 letters. help?",
    opts: [
      { tone: 'cold', t: "I don't do crosswords.", r: "oh. ok. that's fine. i'll keep guessing. it's just a crossword. bye {me}" },
      { tone: 'passive', t: "My fault, last time. Is it 'racer'?", r: "RACER. yes!! of course. you're a natural. and thank you. for the sorry bit too 💛" },
      { tone: 'flirty', t: "Is the answer my name? Because it fits.", r: "it does NOT fit. i checked. but i was tempted to write it anyway. so. you're forgiven, i think 🙈" },
    ] },
  { id: 'sunny-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: "doing the crossword and the clue is 'fast mover, five letters'. i wrote your name in pen. too many letters. help",
    opts: [
      { tone: 'cold', t: "Try 'racer'. And use pencil.", r: "racer!! thank you. and yes. pencil. you sound like my teacher. ok bye 🙂" },
      { tone: 'passive', t: "Ha. 'Racer'? You'll have to cross me out.", r: "i can't cross you out!! i'll write racer next to you. very small. you can stay 💛" },
      { tone: 'flirty', t: "I'm flattered you wrote my name. In pen. Permanent.", r: "it is very permanent. i can't undo it. you're in my crossword forever. i'm blushing at a newspaper" },
    ] },
  { id: 'sunny-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: "crossword clue: 'something that makes you smile, four letters'. i wrote {me}. it doesn't fit. leaving it",
    opts: [
      { tone: 'cold', t: "That's not how crosswords work.", r: "i know. i was being silly. ok. i'll do it properly. sorry {me}" },
      { tone: 'passive', t: "Is it 'joke'? Or 'puns'?", r: "PUNS. it's puns!! you're so clever. i'm still leaving your name in the margin though ☺️" },
      { tone: 'flirty', t: "Leave it. I'm the right answer.", r: "you're very confident for someone who doesn't fit the boxes. ok. fine. you're the answer 🙈" },
    ] },
  // ===================================================================== WEEK NEW 4: Waffles the neighbour's dog (deep)
  { id: 'sunny-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: "last time was weird, i know. but i'm walking my neighbour's dog Waffles and he does your concentrating face",
    opts: [
      { tone: 'cold', t: "I don't look like a dog.", r: "no!! not like that!! it's the frown. the focus frown. sorry. i meant it nicely", opts: [
        { tone: 'cold', t: "Still not a compliment.", r: "ok. sorry. Waffles and i will keep it to ourselves. bye {me}" },
        { tone: 'passive', t: "Fine. Send me the frown.", r: "📸 there. look at him. LOOK at him. that's your face before a corner. i'm right" },
        { tone: 'flirty', t: "Only if Waffles is very good-looking.", r: "he's gorgeous!! fluffy ears. so. by the transitive property. you're gorgeous. oh no 🙈" },
      ] },
      { tone: 'passive', t: "Sorry for being weird. Waffles? Show me.", r: "📸 that's him!! the frown. it's YOUR frown. i can't unsee it. and thank you. for the sorry", opts: [
        { tone: 'cold', t: "I don't see it.", r: "oh. ok. maybe it's just me. i see you everywhere. that's my problem. bye 🙂" },
        { tone: 'passive', t: "Ok, that's quite a frown.", r: "it's his thinking frown!! he's deciding whether to eat a stick. very serious. like you" },
        { tone: 'flirty', t: "Tell him he's got great taste in faces.", r: "i told him. he licked my hand. that's a yes from Waffles. he approves of you" },
      ] },
      { tone: 'flirty', t: "A dog with my face? Is he cute?", r: "SO cute. it's the concentrating frown. very serious, very fluffy. you're like that. minus the fluff", opts: [
        { tone: 'cold', t: "I'm not fluffy.", r: "no, i said minus the fluff!! ok. sorry. i'll stop comparing you to dogs. bye" },
        { tone: 'passive', t: "Send a picture. I need evidence.", r: "📸 evidence. see?? that's your face on lap one. i rest my case" },
        { tone: 'flirty', t: "So you think I'm cute.", r: "i never said that!! Waffles did. i'm just the messenger. a pink messenger 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: "i'm walking my neighbour's dog, Waffles, and he does a face exactly like you when you're concentrating. it's uncanny 🐶",
    opts: [
      { tone: 'cold', t: "Not sure how to take that.", r: "nicely!! take it nicely!! he's very cute. it's a compliment. i'm bad at compliments", opts: [
        { tone: 'cold', t: "You are bad at them.", r: "i know. ok. i'll work on it. bye {me}" },
        { tone: 'passive', t: "Ok. I'll take it nicely. What's Waffles like?", r: "a menace. eats socks. sits on my feet. loves everyone. i walk him on tuesdays" },
        { tone: 'flirty', t: "If he's cute, I'll take it.", r: "he's VERY cute. so. there. you've made me say you're cute. sneaky" },
      ] },
      { tone: 'passive', t: "Ha! Send proof.", r: "📸 there. the eyebrows. the slight pout. that's you on the grid. i'm never wrong", opts: [
        { tone: 'cold', t: "I don't pout.", r: "you do a tiny bit. but ok!! no pout. sorry. i'll delete it. i won't. bye 🙂" },
        { tone: 'passive', t: "Ok, the eyebrows are spot on.", r: "RIGHT?? i nearly dropped the lead. Waffles thinks i'm strange now. he's correct" },
        { tone: 'flirty', t: "You've been looking at my face that closely?", r: "i... might have. on the telly. a normal amount. a lot. ok a lot 🙈" },
      ] },
      { tone: 'flirty', t: "So you think about my face while walking dogs?", r: "i think about it while doing most things, honestly. oh no. i sent that. it's sent", opts: [
        { tone: 'cold', t: "That's a bit intense.", r: "yes. sorry. too much. i'll go back to thinking about Waffles. bye {me}" },
        { tone: 'passive', t: "Ha. It's sent. I'm keeping it.", r: "you can't keep it!! ok you can. it's true anyway. Waffles says hi" },
        { tone: 'flirty', t: "Good. Keep thinking about it.", r: "i will. i am. i'm walking into a hedge. this is your fault ☺️" },
      ] },
    ] },
  { id: 'sunny-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: "my neighbour's dog Waffles looks EXACTLY like you when you concentrate. he's very good-looking. coincidence?",
    opts: [
      { tone: 'cold', t: "Comparing me to a dog isn't flirting.", r: "oh. ok. it was meant to be. a bit. sorry. i'm not very good at it", opts: [
        { tone: 'cold', t: "No, you're not.", r: "ok. that stings a bit. i'll stop trying. bye {me}" },
        { tone: 'passive', t: "Sorry. It's actually quite funny. Is he cute?", r: "the cutest!! big ears, little frown. he sat on my foot for ten minutes. i'm honoured" },
        { tone: 'flirty', t: "Fine. It's a little bit flirting.", r: "a little bit counts!! i'll take it. i'll get better. i'll practise on Waffles 🙈" },
      ] },
      { tone: 'passive', t: "Waffles! What a name. Picture?", r: "📸 him. the focus face. i laughed so much a jogger stopped to check i was ok", opts: [
        { tone: 'cold', t: "I don't see the resemblance.", r: "really?? ok. maybe i'm seeing things. i'll stop seeing you in dogs. bye 🙂" },
        { tone: 'passive', t: "Ok, that's me on a qualifying lap.", r: "IT IS!! i knew it. i'm framing it. a little shrine to the frown" },
        { tone: 'flirty', t: "He's good-looking. So you think I am too?", r: "i walked into that. completely. ok. yes. there. happy?? i'm scarlet" },
      ] },
      { tone: 'flirty', t: "Very good-looking? So that's what you think of me.", r: "i said HE was good-looking!! but. ok. yes. it's not a coincidence. there. i'm hiding now 🙈", opts: [
        { tone: 'cold', t: "Don't get carried away.", r: "ok. uncarrying. sorry. bye {me}" },
        { tone: 'passive', t: "Ha. Thanks. I think you're lovely, for the record.", r: "lovely?? me?? i'm saving this text. i'm screenshotting it. it's going on a slip 💛" },
        { tone: 'flirty', t: "Come out of hiding. I want to see the pink.", r: "you'd need to be here for that. which. hmm. ok i've said too much again" },
      ] },
    ] },
  // ===================================================================== WEEK NEW 5: tell me one good bit of your week
  { id: 'sunny-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: "hi. i know you're busy and things felt a bit cool last time. but how's your week? properly? one good bit, even",
    opts: [
      { tone: 'cold', t: "It's fine. Nothing to report.", r: "ok. that's fine. i hope something good turns up. i'll stop asking. bye {me}" },
      { tone: 'passive', t: "My bad, last time. Good bit: a really nice run this morning.", r: "a nice run!! yay. and thank you. i keep a jar of good things and both of those are going in it ☺️" },
      { tone: 'flirty', t: "Good bit: getting this text.", r: "oh. oh that's a good answer. that's suspiciously good. i'll allow it. i'm smiling at my toaster" },
    ] },
  { id: 'sunny-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: "how's your week? tell me one good bit. i keep a jar of good things, one a day, and i'm collecting other people's too",
    opts: [
      { tone: 'cold', t: "I'm not really a 'good bits' person.", r: "that's ok!! i'll be one for both of us. i'll find you one. good luck this week {me} 🙂" },
      { tone: 'passive', t: "Found my favourite pen. Small, but good.", r: "a found pen is a GREAT good thing. into the jar it goes. your first slip. congratulations 💛" },
      { tone: 'flirty', t: "Good bit: you texting me. Again.", r: "again!! you noticed. ok i'll text more. that's a threat. the jar will be all you" },
    ] },
  { id: 'sunny-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: "i keep a jar for one good thing a day. yesterday's was you. no pressure but today's could be too. how's your week?",
    opts: [
      { tone: 'cold', t: "That's a lot of pressure for one text.", r: "oh. sorry. no pressure. honestly. it's only a jar. i'll write about soup. bye {me}" },
      { tone: 'passive', t: "Week's good. Glad I made the jar.", r: "you made the jar!! you'll make it again if you keep being nice. that's how jars work ☺️" },
      { tone: 'flirty', t: "Write me down every day. I'll earn it.", r: "every day?? the jar can't take it. it'll have to get a bigger jar. i'll buy one. today" },
    ] },
  // ===================================================================== WEEK NEW 6: typed this four times (deep)
  { id: 'sunny-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: "typed and deleted this four times. after last time i wasn't going to. but. would you want to get a coffee? just us?",
    opts: [
      { tone: 'cold', t: "I don't think that's a good idea.", r: "oh. ok. that's alright. asking was still right. knowing beats wondering", opts: [
        { tone: 'cold', t: "Good. Let's leave it.", r: "ok. leaving it. i'll still cheer for you. take care {me} 💛" },
        { tone: 'passive', t: "Sorry. That was harsh. Coffee could be nice.", r: "could be!! i'll take could be. i'll find somewhere with good cake. no pressure" },
        { tone: 'flirty', t: "Coffee, no. Dinner, yes.", r: "DINNER?? you went UP?? ok. yes. dinner. i'm sitting on the floor now" },
      ] },
      { tone: 'passive', t: "I'd like that. And I was rude last time.", r: "really?? ok!! amazing. thank you for saying sorry too. that matters to me. when's good?", opts: [
        { tone: 'cold', t: "I'll let you know.", r: "ok. no rush. i'll be here. whenever 🙂" },
        { tone: 'passive', t: "Monday? There's a place near the river.", r: "monday by the river. perfect. i'll be the one who's very early and pretending not to be" },
        { tone: 'flirty', t: "As soon as possible. I've been waiting for you to ask.", r: "you've been WAITING?? i've wasted so many drafts!! ok. tomorrow. i'm so happy" },
      ] },
      { tone: 'flirty', t: "Four drafts? I want to read all of them.", r: "absolutely not. one said 'would you like to get a coffee or something or nothing'. it was a mess", opts: [
        { tone: 'cold', t: "Sounds like a mess.", r: "it was. so is this. ok. forget the coffee. sorry {me}" },
        { tone: 'passive', t: "Coffee or something sounds good. Let's do it.", r: "yes!! coffee or something. we'll decide on the day. i'm already nervous. in a good way" },
        { tone: 'flirty', t: "I choose 'or something'.", r: "OR SOMETHING?? what's or something?? i'm lying face down on my bed. ok. yes. something 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: "hi!! sorry. hi. this is draft five. the other four were worse. it says: would you like to get a coffee sometime?",
    opts: [
      { tone: 'cold', t: "I'm pretty busy at the moment.", r: "oh of course!! your diary must be awful. no worries. if it ever opens up, i'm here", opts: [
        { tone: 'cold', t: "It won't, really.", r: "ok. understood. no more coffee talk. race well {me} 🙂" },
        { tone: 'passive', t: "Actually, I could do Thursday.", r: "thursday!! yes. i'll clear everything. i had nothing. but i'll clear it anyway" },
        { tone: 'flirty', t: "Busy. But I'd make time for you.", r: "you'd make time?? for me?? ok that's the nicest thing. i'm grinning at a wall" },
      ] },
      { tone: 'passive', t: "Fifth time lucky. Yes, I'd love to.", r: "you would?? oh good. i was so scared. ok. i know a place with the best cinnamon buns", opts: [
        { tone: 'cold', t: "I'm off sugar right now.", r: "oh!! ok. they do toast too. sad toast. i'll stop. see you then 🙂" },
        { tone: 'passive', t: "Cinnamon buns sold me. When?", r: "saturday morning? before it gets busy. i'll save you the window seat" },
        { tone: 'flirty', t: "I'm coming for the buns and the company.", r: "the company is very nervous and slightly sticky from practising eating buns. see you saturday" },
      ] },
      { tone: 'flirty', t: "Only if it's a date.", r: "a date?? like a DATE date?? oh. um. yes. if you want. i want. it's a date ☺️", opts: [
        { tone: 'cold', t: "Joking. Just coffee.", r: "oh. ok. haha. just coffee. that's fine. still nice. see you then" },
        { tone: 'passive', t: "A date. Saturday?", r: "saturday. a date. on saturday. i'm writing it on my hand so i don't think i dreamt it" },
        { tone: 'flirty', t: "A date date. Wear something lucky.", r: "i have lucky socks!! with strawberries on. they're coming. they've never let me down 🍓" },
      ] },
    ] },
  { id: 'sunny-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: "i've typed this four times and every version was too keen so here's the keen one. coffee? with me? soon? please? 🙈",
    opts: [
      { tone: 'cold', t: "That is very keen.", r: "i know. i warned you. it's ok if it's a no. i'll survive. probably", opts: [
        { tone: 'cold', t: "It's a no for now.", r: "ok. for now. i'll be patient. take care {me} 💛" },
        { tone: 'passive', t: "Keen is fine. Yes to coffee.", r: "YES TO COFFEE. ok. i'm calm. i'm very calm. i've dropped my phone twice" },
        { tone: 'flirty', t: "Keen is cute. Yes.", r: "cute!! keen is cute!! i'm going to be so keen. you've made a mistake. a nice one" },
      ] },
      { tone: 'passive', t: "Keen's nice. Coffee sounds good.", r: "it does?? ok. good. great. i know a place with sofas you sink into. you'll love it", opts: [
        { tone: 'cold', t: "I'll see if I can fit it in.", r: "ok!! no pressure. just let me know. i'll be here, sinking into a sofa" },
        { tone: 'passive', t: "Sinking sofas. Perfect. Sunday?", r: "sunday!! perfect. i'll be the one sunk so deep you can only see my face" },
        { tone: 'flirty', t: "A sofa big enough for two?", r: "it's a very cosy sofa. very. oh. i see what you did. yes. it's big enough 🙈" },
      ] },
      { tone: 'flirty', t: "Soon. Please. You had me at 'with me'.", r: "i had you?? at 'with me'?? i should've just sent that. two words. i'm such a waffler", opts: [
        { tone: 'cold', t: "Ha. You do waffle.", r: "i do. ok. short version: bye {me}. haha. no. sorry. bye" },
        { tone: 'passive', t: "Waffling's charming. When are you free?", r: "for you? whenever. tuesday? wednesday? both? i'm being keen again" },
        { tone: 'flirty', t: "Waffle all you want. In person.", r: "in person!! you'll regret it. i'll waffle for hours. i'll bring snacks so you can cope ☺️" },
      ] },
    ] },
  // ===================================================================== WEEK WARM 1: lying on the cool floor after gardening
  { id: 'sunny-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: "lying on the kitchen floor. it's cool and i've been gardening. also a bit sad about last time. what are you doing?",
    opts: [
      { tone: 'cold', t: "Working. Can't really chat.", r: "ok. sorry. i'll leave you to it. i'll just stay on the floor. bye {me}" },
      { tone: 'passive', t: "Sorry for last week. I'm stretching. Also on the floor.", r: "we're both on floors!! floor friends. and thank you. that helps. the floor's less sad now ☺️" },
      { tone: 'flirty', t: "Thinking about you on the floor. Is there room for two?", r: "there's loads of room. it's a big floor. you're forgiven, by the way. mostly because of that 🙈" },
    ] },
  { id: 'sunny-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: "what are you doing right now. i'm lying on the floor because the floor is cool and i've been gardening all day 🌱",
    opts: [
      { tone: 'cold', t: "Busy. Talk later.", r: "ok!! sorry. go go go. i'll be here. horizontal. bye 🙂" },
      { tone: 'passive', t: "Ice bath. Also horizontal. What did you plant?", r: "sweet peas!! and a tomato that already looks unwell. i've named it Gerald. he's trying his best" },
      { tone: 'flirty', t: "Wish I was on the floor with you.", r: "you'd be very welcome. it's a nice floor. a bit muddy. i've gone pink on the lino now" },
      { tone: 'risque', t: "Floor's cool, but I could warm you up.", r: "you can't TEXT that!! i've dropped my phone on my face. ow. laughing. red. ow 🙈" },
    ] },
  { id: 'sunny-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: "so hot i'm lying on the floor. been gardening. thinking about you. the floor's not helping with the second one",
    opts: [
      { tone: 'cold', t: "Maybe get up off the floor.", r: "haha. ok. fair. getting up. that was a bit of a cold splash. bye {me}" },
      { tone: 'passive', t: "Ha. What were you planting?", r: "herbs!! basil, mint, and something the label says is 'thyme'. i don't believe it. it looks like grass" },
      { tone: 'flirty', t: "Keep thinking about me. Floor and all.", r: "i will. i am. i'm a puddle on a floor thinking about you. this is my life now ☺️" },
      { tone: 'risque', t: "I'd rather you were overheating at mine.", r: "OVERHEATING AT YOURS?? who taught you to text like that?? i'm scarlet. on the floor. laughing" },
    ] },
  // ===================================================================== WEEK WARM 2: the note I made after we met (deep)
  { id: 'sunny-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: "found my note from the night we met. 'nice laugh' and a doodle of a car. been looking at it since last time",
    opts: [
      { tone: 'cold', t: "Why are you keeping notes about me?", r: "it's just one note!! i write things down. i'm sorry. i hoped you'd find it sweet", opts: [
        { tone: 'cold', t: "It's a bit odd.", r: "ok. it's going in a drawer. bye {me}" },
        { tone: 'passive', t: "Sorry. It is sweet. Send me the doodle.", r: "📸 it's terrible. the car has five wheels. i was very excited that night" },
        { tone: 'flirty', t: "Fine. Did you write anything else?", r: "there's a second line. i'm not telling you. it's too soppy. it involves your eyes 🙈" },
      ] },
      { tone: 'passive', t: "I was grumpy last time. Sorry. Nice laugh? Really?", r: "really!! it's a great laugh. a sort of surprised one. and thank you. that helps", opts: [
        { tone: 'cold', t: "It's just a laugh.", r: "not to me. but ok. later {me}" },
        { tone: 'passive', t: "I'll laugh more around you, then.", r: "please do!! it's my favourite sound. after kettles. ok, before kettles" },
        { tone: 'flirty', t: "You make me laugh like that. It's your fault.", r: "my fault!! good. i'll take full blame. i'll be very funny from now on. brace" },
      ] },
      { tone: 'flirty', t: "You doodled my car? What else is on the note?", r: "nothing!! ok. 'nice laugh. kind eyes. ask about the dog'. you said you had a dog? or wanted one? i forget", opts: [
        { tone: 'cold', t: "I don't remember saying that.", r: "oh. maybe i got it wrong. i wrote it very fast. sorry. bye {me}" },
        { tone: 'passive', t: "I want one. One day. A big daft one.", r: "big and daft!! perfect. i'm adding that to the note. it's growing. sorry not sorry" },
        { tone: 'flirty', t: "Kind eyes, huh?", r: "that's the bit you picked?? ok. yes. kind eyes. and the rest. i'm not writing the rest" },
        { tone: 'risque', t: "Add a line about what you'd like to do with me.", r: "i'm not writing that on my nice note!! it's a CHILDHOOD-STYLE note!! you menace. i'm laughing 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: "found a list i wrote when we first met. 'nice laugh, kind eyes, scared of geese?'. are you scared of geese? need to know",
    opts: [
      { tone: 'cold', t: "No. And that's a weird list.", r: "oh. ok. it was meant to be a nice list. sorry. i'll put it in a drawer", opts: [
        { tone: 'cold', t: "Good idea.", r: "ok. drawer. done. bye {me} 🙂" },
        { tone: 'passive', t: "Sorry. It's not weird. Geese are terrifying, honestly.", r: "THEY ARE. i knew it. ticking it. my list is accurate. i'm very proud" },
        { tone: 'flirty', t: "Not weird. I just want to know what else is on it.", r: "only nice things!! that's the rule. one is about your hands. i won't elaborate" },
      ] },
      { tone: 'passive', t: "Mildly. One chased me at a race once.", r: "AT A RACE?? amazing. i'm adding 'chased by goose, survived'. tell me everything", opts: [
        { tone: 'cold', t: "There's nothing to tell.", r: "ok!! a mystery goose. that's fine. i'll make up the rest. bye" },
        { tone: 'passive', t: "It came out of a hedge in the paddock. I ran.", r: "you RAN. the fastest person i know, outrun by a goose. i'm crying 😭" },
        { tone: 'flirty', t: "I'll tell you in person. Over dinner.", r: "dinner AND a goose story?? that's the best offer anyone's ever made me. yes" },
      ] },
      { tone: 'flirty', t: "Kind eyes? You noticed my eyes the first time?", r: "i noticed lots the first time!! but i only wrote three things. i was being restrained", opts: [
        { tone: 'cold', t: "Doesn't sound restrained.", r: "haha. fair. ok. i'll be more restrained. bye {me}" },
        { tone: 'passive', t: "What would the fourth have been?", r: "'makes me nervous in a nice way.' there. that's the fourth. i'm adding it now" },
        { tone: 'flirty', t: "Don't restrain yourself. Write the whole list.", r: "the whole list would be a book. a big pink book. ok. i'll start chapter one tonight" },
        { tone: 'risque', t: "Write one about what you noticed when I took my jacket off.", r: "you can't just TEXT that!! i'm at the shops!! i nearly dropped a melon. bright red. no comment 🍈" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: "found my note from when we met. 'nice laugh, kind eyes, i think i'm in trouble'. past me was right. i'm in trouble",
    opts: [
      { tone: 'cold', t: "What kind of trouble?", r: "the nice kind? i think? you've gone a bit serious. sorry. too much?", opts: [
        { tone: 'cold', t: "Yes, a bit.", r: "ok. i'll tone it down. sorry {me}. bye" },
        { tone: 'passive', t: "No. I'm just surprised. It's sweet.", r: "phew. it's very sweet. past me was a romantic. present me is too. no cure" },
        { tone: 'flirty', t: "Good trouble. I'm in it too.", r: "you're in trouble too?? we're both in trouble. that's the best kind 🙈" },
      ] },
      { tone: 'passive', t: "Past you sounds smart. Did you keep the note?", r: "it's on my fridge!! under a magnet shaped like a lemon. i see it every morning", opts: [
        { tone: 'cold', t: "On the fridge? Bit much.", r: "oh. maybe. i'll move it to a drawer. a nice drawer. bye 🙂" },
        { tone: 'passive', t: "Lemon magnet. Of course.", r: "it's a very good magnet. it's held up lots of good things. you're its best one" },
        { tone: 'flirty', t: "I want to be on your fridge in person.", r: "on my fridge?? you'd fall off!! but you can be next to it. making tea. anytime 💛" },
      ] },
      { tone: 'flirty', t: "You're in trouble? So am I. Big trouble.", r: "BIG trouble?? oh no. what now?? i'm hiding under a blanket and grinning", opts: [
        { tone: 'cold', t: "Nothing. Just a joke.", r: "oh. ok. a joke. haha. unblanketing. bye {me}" },
        { tone: 'passive', t: "We could get dinner and discuss it.", r: "a trouble dinner!! yes. very serious. i'll bring a notepad. and dessert" },
        { tone: 'flirty', t: "Make room under the blanket.", r: "there's room!! it's a big blanket. this is very forward of you. i like it" },
        { tone: 'risque', t: "Let's get into more trouble. At mine.", r: "MORE trouble?? at YOURS?? you can't say that while i'm under a blanket!! i'm in bits 🙈" },
      ] },
    ] },
  // ===================================================================== WEEK WARM 3: kept turning round to tell you something
  { id: 'sunny-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: "things keep happening and i turn round to tell you and you're not there. still, after last time. annoying",
    opts: [
      { tone: 'cold', t: "I'm busy. Tell me later.", r: "ok. i'll save them. there's a list. it's long. bye {me}" },
      { tone: 'passive', t: "I'm sorry for being off. Tell me one now.", r: "ok!! someone at the bus stop was walking a cat on a lead. the cat was winning. and thank you 💛" },
      { tone: 'flirty', t: "Turn round and text me. Every time.", r: "every time?? you'll get forty texts a day. you asked for this. and yes, forgiven ☺️" },
    ] },
  { id: 'sunny-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: "i keep thinking of something funny and turning round to tell you and you're not there. rude of you, honestly",
    opts: [
      { tone: 'cold', t: "I'm at work. Can't help it.", r: "i know!! it's not a real complaint. it's a fake complaint. a nice one. go work 🙂" },
      { tone: 'passive', t: "Tell me now. I'm here.", r: "ok. a pigeon walked into the cafe, looked at the menu, and left. like it didn't like the prices" },
      { tone: 'flirty', t: "I keep doing the same thing. Turning round for you.", r: "you do?? both of us turning round at nothing. we're so silly. i love it 🥺" },
      { tone: 'risque', t: "Next time you turn round, I'll be there. Closer than you think.", r: "closer than i think?? that's ominous and lovely and i've gone completely red. you're not allowed to SAY that" },
    ] },
  { id: 'sunny-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: "i've turned round to tell you something six times today and you weren't there once. i'm going to need you to fix that",
    opts: [
      { tone: 'cold', t: "I can't be everywhere.", r: "no. i know. only joking. softly. sorry. bye {me}" },
      { tone: 'passive', t: "What were the six things?", r: "1. a dog in a raincoat 2. a cloud like a teapot 3-6 also dogs. it's been a dog day" },
      { tone: 'flirty', t: "I'll fix it. Next week I'm right behind you.", r: "right behind me?? i'll turn round and squeal. i'll embarrass us both. yes please 🙈" },
    ] },
  // ===================================================================== WEEK WARM 4: same page six times (deep)
  { id: 'sunny-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: "in bed with tea and a book. i've read the same page six times because i keep thinking about last time. can we talk?",
    opts: [
      { tone: 'cold', t: "There's nothing to talk about.", r: "ok. it just felt like something. maybe i'm wrong. i hope i'm wrong", opts: [
        { tone: 'cold', t: "You're overthinking.", r: "maybe. i'll stop. night {me}" },
        { tone: 'passive', t: "You're right. I was off. I'm sorry.", r: "thank you. that's all i needed. i can read now. probably. goodnight 💛" },
        { tone: 'flirty', t: "Only thing to talk about is how much I miss you.", r: "oh. ok. that's a lot better than what i was imagining. tell me more. i'm listening" },
      ] },
      { tone: 'passive', t: "Of course. I'm sorry. I was tired and took it out on you.", r: "thanks for owning it. it's ok. tired happens. i just didn't want to sleep on it", opts: [
        { tone: 'cold', t: "Can we leave it there?", r: "yes. leaving it. goodnight {me} 🙂" },
        { tone: 'passive', t: "What's the book?", r: "a mystery. i think the gardener did it. i always think the gardener did it. i'm biased" },
        { tone: 'flirty', t: "Read me the page. Then I'll say goodnight properly.", r: "a voice note?? of my book?? that's so cosy. ok. i'll whisper it. goodnight properly 💛" },
      ] },
      { tone: 'flirty', t: "Six times? You must have it memorised by now.", r: "i don't!! because i'm not reading it!! i'm reading you. in my head. sorry. that sounded better unsent", opts: [
        { tone: 'cold', t: "It sounded a bit much.", r: "it did. ok. back to the book. night {me}" },
        { tone: 'passive', t: "It's sweet. And I'm sorry I was off.", r: "thank you. that's the page done. i can turn it now. goodnight ☺️" },
        { tone: 'flirty', t: "Read me instead. I'm a better story.", r: "you're a much better story. with a nice ending, i hope. ok. chapter one: you" },
        { tone: 'risque', t: "Put the book down. Imagine I'm there instead.", r: "you can't text me that in BED!! the tea's gone everywhere. i'm red to my toes. goodnight!! 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: "i'm in bed with tea and a book and i've read the same page six times because i keep thinking about you. complaint filed",
    opts: [
      { tone: 'cold', t: "Not my fault you can't focus.", r: "haha. it's a bit your fault. but ok. i'll focus. night {me}", opts: [
        { tone: 'cold', t: "Night.", r: "night. sleep well 🙂" },
        { tone: 'passive', t: "Ok, it's a bit my fault. Sorry. What's the book?", r: "it's about a lighthouse keeper. very slow. i'd be better at it if you weren't in my head" },
        { tone: 'flirty', t: "Fine. My fault. I'll take the blame.", r: "good. the complaint has been upgraded to a compliment. it's very serious. goodnight ☺️" },
      ] },
      { tone: 'passive', t: "Complaint received. What's the book?", r: "a cosy one about a bakery. i've read about the same croissant six times. it's a very good croissant", opts: [
        { tone: 'cold', t: "Sounds boring.", r: "it's a bit boring. that's why i like it. ok. night {me} 🙂" },
        { tone: 'passive', t: "Sounds perfect for bedtime.", r: "it is!! nothing bad happens. the worst bit is a burnt loaf. i cried a little" },
        { tone: 'flirty', t: "I'd rather be the croissant.", r: "you'd rather be the croissant?? i'm laughing into my tea. you're very silly. i like you" },
      ] },
      { tone: 'flirty', t: "I'm thinking about you too. In bed. Also not reading.", r: "you're in bed too?? we're both in bed not reading thinking about each other. that's so silly. i love it", opts: [
        { tone: 'cold', t: "Ok, that's enough. Night.", r: "oh. ok. night {me}" },
        { tone: 'passive', t: "It is silly. Goodnight, you.", r: "goodnight, you. that's the nicest goodnight i've had. sleep well 💛" },
        { tone: 'flirty', t: "Less silly if we were in the same bed.", r: "{me}!!! my book's on the floor. my face is on fire. that's a very forward goodnight. i like it" },
        { tone: 'risque', t: "Want me to tell you what I'm thinking?", r: "no!! yes. no. tell me in person. i can't handle it over text. i'm already a tomato. goodnight 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: "tried to read in bed. same page six times. the page is fine. the problem is you. you're stuck in my head. night 🙈",
    opts: [
      { tone: 'cold', t: "Try harder.", r: "haha. ok. trying. it's not working. but ok. night", opts: [
        { tone: 'cold', t: "Go to sleep.", r: "night {me} 🙂" },
        { tone: 'passive', t: "Sorry. That was blunt. I'm glad you're thinking of me.", r: "you are?? good. i'll keep doing it then. quietly. goodnight 💛" },
        { tone: 'flirty', t: "Try harder to stop. I don't want you to.", r: "then i won't. i'll think about you all night. you're in charge of my sleep now. good luck" },
      ] },
      { tone: 'passive', t: "Ha. What's the page about?", r: "a picnic. in a book about a picnic. i keep imagining you at the picnic. eating all the grapes", opts: [
        { tone: 'cold', t: "I don't even like grapes.", r: "oh!! noted. no grapes. i'll imagine you with crisps instead. night {me}" },
        { tone: 'passive', t: "I would eat all the grapes. Fair.", r: "i knew it!! a grape thief. i'll bring two bunches to our real picnic. one for you. one for me" },
        { tone: 'flirty', t: "Let's have that picnic. Soon.", r: "a real picnic!! with a blanket and you and too much cake. i'm planning it now instead of sleeping" },
        { tone: 'risque', t: "Picnic for two. Big blanket. No grapes needed.", r: "no grapes needed?? what ARE we doing on this blanket?? don't answer. i'm crimson. goodnight 🙈" },
      ] },
      { tone: 'flirty', t: "Same here. You've ruined my sleep too.", r: "we're ruining each other's sleep!! that's so romantic and so tiring. any ideas?", opts: [
        { tone: 'cold', t: "Turn our phones off.", r: "oh. ok. sensible. turning off. night {me}" },
        { tone: 'passive', t: "Talk until one of us falls asleep.", r: "deal. i'll probably go first. i'm already yawning. don't be offended if i stop mid-word" },
        { tone: 'flirty', t: "Dream about each other. Obviously.", r: "obviously. i'll dream we're at the seaside. you're in a terrible hat. i love the hat" },
        { tone: 'risque', t: "We could ruin each other's sleep in person.", r: "IN PERSON?? you can't SAY that at midnight!! my heart's going like a drum. goodnight!!! 🙈" },
      ] },
    ] },
  // ===================================================================== WEEK WARM 5: knitting you something
  { id: 'sunny-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: "i started knitting you a scarf before last time. i kept going. i'm not sure if that's sweet or sad. it's very long now",
    opts: [
      { tone: 'cold', t: "You don't need to knit me things.", r: "i know. it's just how my hands worry. ok. i'll stop. it can be a draught excluder. bye {me}" },
      { tone: 'passive', t: "It's sweet. Forgive me for last time?", r: "thank you. it's sweet then. i'll keep going. it's in your colours. it's nearly as tall as me 🧶" },
      { tone: 'flirty', t: "Keep going. I want it long enough for two.", r: "for two?? like we both wear it?? that's - ok yes. i'm knitting faster. forgiven, by the way" },
    ] },
  { id: 'sunny-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: "i'm knitting you something. no more clues. it's getting very long. i don't know how to stop 🧶",
    opts: [
      { tone: 'cold', t: "I'm not really a knitwear person.", r: "oh!! ok. noted. it can be a blanket. for me. i'll think of you in it. that's fine 🙂" },
      { tone: 'passive', t: "Is it a scarf? How long is it?", r: "it's a scarf. it's currently longer than my sofa. i keep thinking 'one more row'. it's never one more row" },
      { tone: 'flirty', t: "Something you made, wrapped round me? Yes please.", r: "wrapped round you!! that's the plan. that's exactly what i pictured. i've gone pink over wool" },
      { tone: 'risque', t: "Knit something small. For later. Just for me.", r: "something SMALL?? for LATER?? i'm not knitting that!! i've dropped three stitches laughing. you menace" },
    ] },
  { id: 'sunny-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: "knitting you a scarf. every row i think about you. it's now three metres long. your fault. hope you're happy",
    opts: [
      { tone: 'cold', t: "Three metres is a bit much.", r: "it is a bit much. like me. ok. i'll cast off. bye {me}" },
      { tone: 'passive', t: "I'm very happy. What colour?", r: "your colours!! with one wonky row where i was laughing at a text from you. it's my favourite row" },
      { tone: 'flirty', t: "Make it four metres. More rows, more thinking.", r: "four metres!! i'll need a bigger flat. ok. i'm thinking. i'm knitting. i'm pink. it's all going in" },
    ] },
  // ===================================================================== WEEK WARM 6: do you like me like I like you? (deep)
  { id: 'sunny-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: "can i ask you something. and you be honest. after last time i need to know. do you like me like i like you?",
    opts: [
      { tone: 'cold', t: "I don't know how you like me.", r: "a lot. i like you a lot. more than a friend. that's how. so. do you?", opts: [
        { tone: 'cold', t: "Not like that. Sorry.", r: "ok. honest is better. i'll be ok. i'm glad i know. take care {me} 💛" },
        { tone: 'passive', t: "Maybe I do. I'm just bad at saying it.", r: "you think you do?? ok. that's enough. that's plenty. say it badly whenever you want" },
        { tone: 'flirty', t: "Yes. Way more than friends.", r: "you DO?? oh. oh i'm shaking. ok. i'm going to sit down and smile at the wall for an hour" },
      ] },
      { tone: 'passive', t: "I do. Sorry for making it unclear.", r: "you do?? really?? i've been so scared to send this. i nearly deleted it. thank you", opts: [
        { tone: 'cold', t: "Don't make a big deal of it.", r: "ok. small deal. tiny. i'm doing a tiny dance. you can't see it. night {me}" },
        { tone: 'passive', t: "I'm glad you sent it.", r: "me too. so glad. this is going on the biggest slip i own. goodnight 💛" },
        { tone: 'flirty', t: "I like you a ridiculous amount. There.", r: "a RIDICULOUS amount?? i'm screenshotting that. i'm framing it. i like you ridiculously too" },
      ] },
      { tone: 'flirty', t: "You really have to ask? Yes. Obviously yes.", r: "obviously?? it was not obvious!! you went cold on me!! but. yes. ok. YES. i'm screaming into a pillow", opts: [
        { tone: 'cold', t: "Calm down, it's not a big deal.", r: "it's big to me. but ok. calm. calm. night {me}" },
        { tone: 'passive', t: "Sorry for going cold. I was scared.", r: "scared of me?? i'm a marshmallow. ok. no more being scared. we'll be brave together" },
        { tone: 'flirty', t: "Scream louder. I like it.", r: "AAAAA. there. my neighbour knocked on the wall. worth it. i like you so much 🙈" },
        { tone: 'risque', t: "Want me to come over and show you how much?", r: "come OVER?? now?? you can't text that after a feelings text!! i'm laughing and red and NO. soon. maybe" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: "so. question. do you like me the way i like you? because i do. a lot. ok sent it. can't unsend it. oh no",
    opts: [
      { tone: 'cold', t: "I think we're better as friends.", r: "oh. ok. that's alright. thank you for not leaving me hanging. friends is good. friends is lovely", opts: [
        { tone: 'cold', t: "Good. Glad we agree.", r: "yes. ok. i'll be ok. night {me} 💛" },
        { tone: 'passive', t: "Sorry. I'm scared of messing it up. I do like you.", r: "you do?? oh. then let's be scared together. we won't mess it up. i promise. i'll be gentle" },
        { tone: 'flirty', t: "That was a lie. I'm mad about you.", r: "don't DO that!! my heart fell into my socks!! ok. you like me. i like you. we're even" },
      ] },
      { tone: 'passive', t: "I do. A lot too.", r: "you DO?? oh my goodness. ok. i'm on the floor again. not because it's hot. because of you", opts: [
        { tone: 'cold', t: "Let's not get ahead of ourselves.", r: "no!! slowly. very slowly. i'll go at your speed. which is fast, but i'll go slow. ok" },
        { tone: 'passive', t: "Get off the floor. Go to sleep. I'll still like you tomorrow.", r: "you'll still like me tomorrow. that's going to be the best thing i read all week. night 💛" },
        { tone: 'flirty', t: "Stay on the floor. I'll come and find you.", r: "on the floor?? you'll have to step over all the knitting. ok. i'll wait right here" },
        { tone: 'risque', t: "I like you enough to think about you all night.", r: "ALL NIGHT?? that's a lot of thinking!! what kind of thinking?? don't tell me. i'm scarlet. goodnight" },
      ] },
      { tone: 'flirty', t: "Do I like you? I can't stop texting you. You tell me.", r: "is that a yes?? that's a yes. i'm taking it as a yes. it's in writing now. no take-backs", opts: [
        { tone: 'cold', t: "It's not a yes.", r: "oh. ok. sorry. i got it wrong. i'll stop. night {me}" },
        { tone: 'passive', t: "It's a yes. Of course it's a yes.", r: "of course!! it's of course!! i'm so happy i've cried a bit. on my phone. sorry phone" },
        { tone: 'flirty', t: "It's a yes. A big one. With a kiss on the end. x", r: "an x!! you sent an x!! i'm sending one back. x. two. xx. ok i'll stop 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: "i'm going to be brave over text because i'm a coward in person. i like you. like, like-like you. do you like-like me? 🙈",
    opts: [
      { tone: 'cold', t: "I don't really do like-like.", r: "oh. ok. that's alright. i tried being brave. i was. that's something. night {me}", opts: [
        { tone: 'cold', t: "Night, then.", r: "night. be kind to you 💛" },
        { tone: 'passive', t: "Sorry. I was being glib. I'm crazy about you.", r: "you do?? ok. i nearly cried. good tears now. glib is banned. thank you for coming back" },
        { tone: 'flirty', t: "I don't do like-like. I do much more than that.", r: "MUCH MORE?? oh. oh. i don't know what to text. i've typed 'ok' seven times. ok" },
      ] },
      { tone: 'passive', t: "Like-like, back. You're not a coward.", r: "i'm not?? you like-like me?? i'm rolling around on my bed like a happy otter", opts: [
        { tone: 'cold', t: "Don't make it weird.", r: "ok!! normal. i'm a normal person, lying normally. night {me}" },
        { tone: 'passive', t: "A happy otter. Perfect.", r: "otters are the happiest. and they hold hands. that's a fact. one day i'll tell you more 💛" },
        { tone: 'flirty', t: "Next time say it to my face. I want the full pink.", r: "you'll see so much pink. a whole sunset. i'll say it. i promise. to your face. gulp" },
      ] },
      { tone: 'flirty', t: "Like-like? Finally. I've waited ages.", r: "you've been WAITING?? you never said!! all my nerves!! oh you're so annoying. i like-like you", opts: [
        { tone: 'cold', t: "I wanted to see if you'd crack.", r: "that's mean!! funny but mean. i'm a bit hurt. night {me}" },
        { tone: 'passive', t: "Like-like. Very much.", r: "very much!! ok. i'm writing this on a slip. no. a whole page. a whole book" },
        { tone: 'flirty', t: "Annoying, but yours. If you want.", r: "if i want?? i want. yours. mine. ok. i've gone completely to pieces 🙈" },
        { tone: 'risque', t: "Say it again in person. Then I'll kiss you.", r: "you'll KISS me?? you can't promise that over text!! now i'll think about it all week. scarlet. yes" },
      ] },
    ] },
  // ===================================================================== WEEK CLOSE 1: your hoodie, cereal for dinner
  { id: 'sunny-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: "your hoodie's on and it's cereal for dinner. still a bit sad about last time. the hoodie is helping. you aren't",
    opts: [
      { tone: 'cold', t: "Then take the hoodie off.", r: "no. the hoodie's done nothing wrong. ok. i'll talk to you when you're less prickly. night {me}" },
      { tone: 'passive', t: "I'm sorry. I was out of order. Is the cereal good at least?", r: "it's the good cereal. the honey one. and thank you. you're helping now. a lot actually 💛" },
      { tone: 'flirty', t: "Let me help. I'll come home and replace the hoodie.", r: "replace the hoodie with you?? ok. that's a good apology. i'll put the kettle on. hurry" },
      { tone: 'risque', t: "I'll be home Sunday. Stay up. Wear the hoodie.", r: "hmm. that's quite the apology. accepted. sunday. i'll wait up. in the hoodie. with ideas 😌" },
    ] },
  { id: 'sunny-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: "i'm wearing your hoodie and eating cereal for dinner. this is what you've reduced me to. come home",
    opts: [
      { tone: 'cold', t: "You're an adult. Cook something.", r: "i know how to cook!! i'm choosing cereal. it's a mood. ok. i'll make toast. happy? 🙂" },
      { tone: 'passive', t: "Three more days. Eat a vegetable for me.", r: "i ate a raisin. that's fruit. close enough. three days. i've crossed them out on the calendar already" },
      { tone: 'flirty', t: "You look better in it than I do. Send proof.", r: "📸 there. hood up. cereal in hand. very glamorous. i miss you so much it's silly" },
      { tone: 'risque', t: "Keep it warm for me. I'll take it off you when I'm back.", r: "promise? because i'm holding you to that. sunday. i'll be the one in the hoodie, looking innocent" },
    ] },
  { id: 'sunny-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: "status report: hoodie (yours) on. cereal for dinner. missing you at a level that should be studied by scientists",
    opts: [
      { tone: 'cold', t: "You'll survive a week.", r: "i will. obviously. just teasing. ok. night {me}" },
      { tone: 'passive', t: "Missing you too. What cereal?", r: "the crunchy one with the bear on the box. the bear understands me. he's also lonely" },
      { tone: 'flirty', t: "Studied by scientists? I'll volunteer for the research.", r: "you're the main subject!! we'll need lots of close observation. very close. for science 🙈" },
      { tone: 'risque', t: "Status report back: thinking about you in that hoodie all night.", r: "all night?? good. same. but you in it. then not in it. that's my report. get home 😌" },
    ] },
  // ===================================================================== WEEK CLOSE 2: bonfire crisps (deep)
  { id: 'sunny-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: "big shop done. your bonfire crisps are in it. i hate them. two bags. even though i'm still cross about last time",
    opts: [
      { tone: 'cold', t: "You didn't have to.", r: "i know i didn't have to. that's the point. ok. i'll eat them myself. i won't. i'll bin them", opts: [
        { tone: 'cold', t: "Whatever you want.", r: "ok. night {me}" },
        { tone: 'passive', t: "That's really kind. Sorry for being a pain.", r: "thank you. that's the cross bit gone. mostly. the crisps are on your side of the cupboard 💛" },
        { tone: 'flirty', t: "You bought crisps you hate for me. That's love.", r: "it IS love. crisp love. the most serious kind. ok. you're forgiven. come home and eat them" },
      ] },
      { tone: 'passive', t: "You got two bags even when cross? You're the best.", r: "i AM the best. remember that next time you're grumpy at me. thank you for the sorry, by the way. oh wait", opts: [
        { tone: 'cold', t: "I didn't say sorry.", r: "no. you didn't. i noticed. ok. i'm waiting. night {me}" },
        { tone: 'passive', t: "I'm sorry. Properly. I'll say it again in person.", r: "deal. in person, with crisps. i'll hold one bag hostage until then 😌" },
        { tone: 'flirty', t: "Sorry. Let me make it up to you. Not with crisps.", r: "not with crisps?? with what?? oh. OH. ok. i see. i accept. hurry home" },
        { tone: 'risque', t: "Sorry. I'll say it properly. In bed. Repeatedly.", r: "repeatedly?? that's a very thorough apology. good. i'll expect every word. and the rest" },
      ] },
      { tone: 'flirty', t: "Two bags of crisps you hate? You must really love me.", r: "i really do. unfortunately. even when you're a pain. the crisps are proof. they smell like a garden fire", opts: [
        { tone: 'cold', t: "Unfortunately?", r: "joking!! a cross joke. ok. not funny. sorry. night {me}" },
        { tone: 'passive', t: "Love you too. I was horrible last time.", r: "there it is. thank you. ok. we're fine. we're crisp-fine. come home 💛" },
        { tone: 'flirty', t: "A garden fire, like the one you light in me.", r: "that's TERRIBLE. that's the worst line. i'm laughing so hard i've dropped the shopping. i love you" },
      ] },
    ] },
  { id: 'sunny-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: "did the big shop and bought your weird crisps. the ones that taste like a bonfire. i hate them. i got two bags",
    opts: [
      { tone: 'cold', t: "I'm off crisps this month.", r: "oh!! no!! ok. they'll wait. they're not going anywhere. they're too horrible to eat", opts: [
        { tone: 'cold', t: "Give them away.", r: "ok. Waffles' owner likes them. weirdo. done. bye {me} 🙂" },
        { tone: 'passive', t: "Sorry. Keep them. I'll have one bag when I'm back.", r: "one bag. ok. i'll guard the other one. from myself. i won't eat it. they're vile" },
        { tone: 'flirty', t: "Keep them for a cheat night. With you.", r: "a cheat night with me?? you're on. crisps and a film and you. ok. i'm excited now" },
      ] },
      { tone: 'passive', t: "Two bags! You're a hero.", r: "i am a hero. the person at the till looked at me with such pity. 'are these for you?' NO. they're for love", opts: [
        { tone: 'cold', t: "Bit dramatic for crisps.", r: "i'm a dramatic shopper. ok. night {me}" },
        { tone: 'passive', t: "For love. I'll eat them in your honour.", r: "eat them far away from me. in the garden. ok, on the sofa. but don't breathe on me after" },
        { tone: 'flirty', t: "I'll repay you. In kisses. Crisp-free ones.", r: "crisp-free!! important. i'll accept payment on arrival. with interest 💛" },
        { tone: 'risque', t: "I'll repay you in bed. Teeth brushed. Promise.", r: "teeth brushed is the only rule. otherwise the deal's on. sunday. i'll keep the receipt 😌" },
      ] },
      { tone: 'flirty', t: "You hate them but bought two? That's love.", r: "it is love. it's the most love thing i've ever done. i hid them behind the pasta so i don't have to see them", opts: [
        { tone: 'cold', t: "You can stop saying love every text.", r: "oh. ok. sorry. i'll say it less. night {me}" },
        { tone: 'passive', t: "Love you. And the pasta hiding place.", r: "the pasta knows everything. it's our secret keeper. love you. come home" },
        { tone: 'flirty', t: "Behind the pasta. I'll find them. And you.", r: "you'll find me in the hoodie, on the sofa, waiting. smelling of not-crisps. hurry 🙈" },
      ] },
    ] },
  { id: 'sunny-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: "stood in the crisp aisle for five minutes deciding if i love you enough to buy the bonfire ones. i do. two bags",
    opts: [
      { tone: 'cold', t: "Five minutes? That's long.", r: "they're REALLY bad crisps. ok. silly joke. night {me}", opts: [
        { tone: 'cold', t: "Sleep well.", r: "night 🙂" },
        { tone: 'passive', t: "Ha. Sorry. Two bags is very loving.", r: "it's the most loving. i'll put a little note on them. 'don't breathe on me'" },
        { tone: 'flirty', t: "Five minutes. I'd have bought them instantly for you.", r: "would you?? for me?? what's my weird crisp?? oh. i've got none. i'll get one. for you to buy" },
      ] },
      { tone: 'passive', t: "Two bags! I'll share. Promise.", r: "you will NOT share. they're horrible. but thank you for offering. it's very gallant", opts: [
        { tone: 'cold', t: "More for me, then.", r: "all yours. every horrible crumb. night {me}" },
        { tone: 'passive', t: "What did you get yourself?", r: "chocolate buttons. the big bag. don't tell anyone. it's for emergencies. tonight's an emergency" },
        { tone: 'flirty', t: "I'll share something else, then.", r: "what?? oh. hmm. you mean kisses. or. ok. both. i accept both. i'm pink in the car park" },
        { tone: 'risque', t: "I'll share my bed. And you can share your buttons.", r: "deal. buttons in bed. very romantic. very crumby. i don't care. sunday can't come fast enough" },
      ] },
      { tone: 'flirty', t: "You love me two bags' worth? I'm honoured.", r: "two bags. that's my highest unit of love. there's nothing above two bags. ok there's one thing", opts: [
        { tone: 'cold', t: "What's the one thing?", r: "you. obviously. but you went all flat. so. never mind. night {me}" },
        { tone: 'passive', t: "What's above two bags?", r: "you coming home. that's above everything. even three bags" },
        { tone: 'flirty', t: "Tell me the one thing.", r: "you, here, on my sofa, eating the horrible crisps while i pretend to be cross. that's it 💛" },
        { tone: 'risque', t: "The one thing involves us and a locked door. Right?", r: "it might. it really might. you'll have to come home and check. and brush your teeth first 😌" },
      ] },
    ] },
  // ===================================================================== WEEK CLOSE 3: holiday spreadsheet
  { id: 'sunny-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: "made a holiday spreadsheet for after the season. not sure you want it after last time. it has colours. still want it?",
    opts: [
      { tone: 'cold', t: "I can't think about holidays right now.", r: "ok. i'll save it. it'll wait. i just wanted something nice to look forward to. with you. night" },
      { tone: 'passive', t: "I was a pain last week. Send it. I want to see.", r: "ok!! sending. tab 1 is beaches. tab 2 is cottages. tab 3 is snacks. thank you for the sorry 💛" },
      { tone: 'flirty', t: "Send it. Is there a tab for us not leaving the room?", r: "there's a tab called 'lie-ins'. it's very long. you're forgiven. probably because of that tab 😌" },
      { tone: 'risque', t: "Send it. Then send the tab you're too shy to show me.", r: "that tab is called 'day 3' and it's colour-coded red. i'm not shy anymore. you're forgiven" },
    ] },
  { id: 'sunny-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: "ok i've been thinking about the holiday after the season. i've made a spreadsheet. it has colours. don't be scared",
    opts: [
      { tone: 'cold', t: "A spreadsheet? For a holiday?", r: "for a GOOD holiday. ok. i'll keep it simple. i'll just write 'beach' on a napkin. night {me} 🙂" },
      { tone: 'passive', t: "I'm not scared. Send it over.", r: "📎 here!! green is beach. yellow is naps. pink is 'things you'll say no to'. it's mostly pink" },
      { tone: 'flirty', t: "Is there a column for kissing you on a beach?", r: "there's a whole tab. it's called 'beach kisses'. it's very detailed. too detailed. i'm red" },
      { tone: 'risque', t: "Add a column for how often we'll leave the hotel room.", r: "i did. it says 'rarely'. it's in bold. you're not the only one with plans, {me} 😌" },
    ] },
  { id: 'sunny-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: "i've made us a holiday spreadsheet. it has colours. one column is just 'you in sunglasses'. it's very important research",
    opts: [
      { tone: 'cold', t: "Can we plan it later?", r: "course. later. i'll save the colours. night {me}" },
      { tone: 'passive', t: "Send it. Where are we going?", r: "somewhere warm with a hammock and nobody who knows what a lap time is. three options. tab 2 is best" },
      { tone: 'flirty', t: "And is there a column for you in a swimsuit?", r: "there is NOT. ok there is. you added it. i can see the edit history. sneaky" },
      { tone: 'risque', t: "What's the column for when the sunglasses come off?", r: "it's called 'night time' and it's highlighted. heavily. i've been thinking about this a lot 😌" },
    ] },
  // ===================================================================== WEEK CLOSE 4: rain, under an awning (deep)
  { id: 'sunny-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: "it's pouring here. normally i'd wish we were stuck under an awning together. after last time i'm just wishing we were ok",
    opts: [
      { tone: 'cold', t: "We're fine. Don't be dramatic.", r: "it doesn't feel fine. but ok. i'll stop being dramatic. i'll just be wet", opts: [
        { tone: 'cold', t: "Go inside, then.", r: "i am inside. it was a metaphor. never mind. night {me}" },
        { tone: 'passive', t: "Sorry. You're not being dramatic. I'm sorry.", r: "thank you. that's the rain stopping a bit. in my head. not outside. outside's still awful 💛" },
        { tone: 'flirty', t: "We're ok. And I still want to be under that awning.", r: "you do? then we're ok. ok. i'll find the best awning in town. for when you're back" },
      ] },
      { tone: 'passive', t: "We are ok. I'm sorry. I was stressed and you got the worst of it.", r: "thanks. i knew. i needed it said, though. ok. now i can wish about the awning", opts: [
        { tone: 'cold', t: "Let's not dwell on it.", r: "ok. no dwelling. just rain. night {me}" },
        { tone: 'passive', t: "Wish away. Tell me about the awning.", r: "red and white stripes. outside a bakery. it smells of bread. we can't leave because of the rain. shame" },
        { tone: 'flirty', t: "I'll kiss you under it till the rain stops.", r: "what if it never stops?? oh. that's the point. ok. i'm forgiving you a lot right now 🙈" },
        { tone: 'risque', t: "Forget the awning. Rainy day in bed. With me.", r: "bed all day. no plans. no phones. no getting up. yes. that's my favourite weather now" },
      ] },
      { tone: 'flirty', t: "We're ok. Stand in the rain and I'll call you. Like a film.", r: "like a film?? i'd get SO wet. ok. fine. i'm going outside. call me. i'm forgiving you in the rain", opts: [
        { tone: 'cold', t: "I was joking. Stay inside.", r: "oh. ok. i'd already got my shoes on. back in. night {me}" },
        { tone: 'passive', t: "Calling you now. Get inside first, you'll catch cold.", r: "ok!! inside. towel on head. phone ringing. hi. hi. i've missed your voice" },
        { tone: 'flirty', t: "Very wet, very cute. Send a photo of the drowned look.", r: "📸 drowned. hair everywhere. eyes like a sad raccoon. you're welcome. i love you" },
      ] },
    ] },
  { id: 'sunny-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: "it's raining and i'm wishing we were stuck under an awning somewhere together. with chips. and nowhere to be ☔",
    opts: [
      { tone: 'cold', t: "I hate the rain.", r: "i know you do. it ruins your tyres. but rain with chips is different. ok. i'll stop. stay dry 🙂", opts: [
        { tone: 'cold', t: "It's still rain.", r: "it is. ok. no rain talk. night {me}" },
        { tone: 'passive', t: "Ok. Rain with chips is different.", r: "SO different. vinegar. steam. you. the best kind of weather" },
        { tone: 'flirty', t: "Rain with you would be different too.", r: "rain with me is the best rain. ask anyone. ask the ducks. they're very wet and very happy" },
      ] },
      { tone: 'passive', t: "Chips under an awning sounds perfect. Which awning?", r: "the green one outside the old cinema. it's leaky in one corner. we'd stand in the dry bit. close together. obviously", opts: [
        { tone: 'cold', t: "Leaky awning. Pass.", r: "haha. ok. i'll find a better one. night {me}" },
        { tone: 'passive', t: "Close together. Obviously.", r: "obviously. it's a small dry bit. we'd have no choice. purely practical 💛" },
        { tone: 'flirty', t: "I'd let the leaky bit drip on me. Just to stay closer.", r: "that's the most romantic thing you've ever said. it's also very damp. i love it" },
        { tone: 'risque', t: "Then we'd go back to yours to get out of the wet clothes.", r: "obviously. it'd be silly not to. very sensible. we'd take ages drying off. ages 😌" },
      ] },
      { tone: 'flirty', t: "Stuck under an awning with you? I'd pray for rain.", r: "you'd PRAY for rain?? you hate rain!! you must love me. ok. i'm going to do a rain dance", opts: [
        { tone: 'cold', t: "Don't. I've got a race.", r: "oh!! right. no rain dance. sorry. good luck {me}" },
        { tone: 'passive', t: "I must. Send a video of the rain dance.", r: "absolutely not. it's private. it involves an umbrella and a lot of spinning. ok one second of it" },
        { tone: 'flirty', t: "I do love you. Rain and all.", r: "rain and all. that's going on a slip. a wet one. love you back. so much" },
        { tone: 'risque', t: "Dance in the rain. Then let me warm you up after.", r: "deal. you bring the towels. i'll bring the cold hands. you'll regret it. you won't" },
      ] },
    ] },
  { id: 'sunny-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: "raining. i want to be stuck under an awning with you so badly. just us, the rain, and you pretending you're not cold",
    opts: [
      { tone: 'cold', t: "I'd just be cold.", r: "you would. haha. ok. no awnings. you can stay dry. night {me}", opts: [
        { tone: 'cold', t: "Goodnight.", r: "night. stay warm 🙂" },
        { tone: 'passive', t: "Ok, I'd be cold but happy.", r: "cold but happy is my favourite way to be. i'd lend you my scarf. the very long one" },
        { tone: 'flirty', t: "Cold, unless you were holding me.", r: "i'd hold you so tight. you'd overheat. under an awning. in the rain. perfect" },
      ] },
      { tone: 'passive', t: "I'm always cold. You'd have to share your coat.", r: "i'd share. i'd unzip it and you'd get in and we'd be one very wide person. a coat for two", opts: [
        { tone: 'cold', t: "That sounds uncomfortable.", r: "it would be. ok. separate coats. boring. night {me}" },
        { tone: 'passive', t: "Coat-sharing. I like that.", r: "me too. i'm going to buy a bigger coat. on purpose. for winter 💛" },
        { tone: 'flirty', t: "I'd stay in that coat all day.", r: "all day!! we'd have to waddle home. like penguins. very slowly. holding on" },
        { tone: 'risque', t: "Coat for two. Then bed for two. To warm up properly.", r: "properly. thoroughly. with the rain on the window. you're making it very hard to concentrate on work 😌" },
      ] },
      { tone: 'flirty', t: "Pretending I'm not cold so you'll cuddle me. Obviously.", r: "obviously!! i see through you. but i'd do it anyway. every time. you're very easy to cuddle", opts: [
        { tone: 'cold', t: "I'm not that easy.", r: "oh. ok. sorry. i'll stop. night {me}" },
        { tone: 'passive', t: "You're very easy to cuddle too.", r: "i'm basically a hot water bottle. it's my one talent. that and the crater cakes" },
        { tone: 'flirty', t: "Next rain, I'm finding you. No pretending.", r: "no pretending!! just cuddling. under an awning. i'll keep checking the forecast 🙈" },
        { tone: 'risque', t: "Next rain, I'll cuddle you somewhere much warmer than an awning.", r: "somewhere warmer. i know where. it's got a duvet and a lock. sunday. it's forecast to rain 😌" },
      ] },
    ] },
  // ===================================================================== WEEK CLOSE 5: counting down to after {track}
  { id: 'sunny-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: "i was going to do a countdown till you're back from {track}. after last time i wasn't sure you'd want one. do you?",
    opts: [
      { tone: 'cold', t: "You don't need to count down.", r: "ok. i won't. i'll just wait. quietly. good luck at {track} {me}" },
      { tone: 'passive', t: "I want one. And sorry about before.", r: "ok!! 5 days. 4 tomorrow. thank you. the countdown's much happier now 💛" },
      { tone: 'flirty', t: "Count down. Every day. Make each one soppier.", r: "each one soppier?? by day 1 it'll be a sonnet. ok. you're forgiven. 5 days. 5 kisses waiting" },
      { tone: 'risque', t: "Count down. And tell me what we're doing when the count hits zero.", r: "zero means you, me, a locked door and no plans till monday. that's the countdown. it's very motivating" },
    ] },
  { id: 'sunny-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: "countdown!! 4 days till you're back from {track}. it's on the fridge. a flower per day. day 1's a sunflower 🌻",
    opts: [
      { tone: 'cold', t: "Can't think about home yet. Race first.", r: "of course!! race first. i'll keep the flowers quiet. good luck {me} 🙂" },
      { tone: 'passive', t: "A sunflower for day one. Perfect.", r: "it's the biggest one!! it's slightly wonky. like everything i draw. like my cakes" },
      { tone: 'flirty', t: "Add a heart on zero. That's when I kiss you.", r: "a heart on zero. drawn. coloured in. pressed so hard the pen went through. 4 days" },
      { tone: 'risque', t: "Draw what's happening on zero. If you dare.", r: "i did. then i had to cover it with a magnet in case Gran visits. that's how good zero is 😌" },
    ] },
  { id: 'sunny-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: "3 days. i'm counting. i've counted the hours too but i'm not telling you, it's embarrassing. hurry home from {track}",
    opts: [
      { tone: 'cold', t: "Counting hours is a bit much.", r: "it is. that's why i didn't tell you the number. ok. i'll count quieter. bye {me}" },
      { tone: 'passive', t: "Tell me the hours. I won't laugh.", r: "seventy-one. and a bit. you laughed. i can tell. i can hear it through the phone" },
      { tone: 'flirty', t: "I'm counting too. Seventy-two hours till I see you.", r: "you're counting too?? we're both counting!! we're the same number!! i'm doing a little spin" },
      { tone: 'risque', t: "Three days. Then I'm not letting you out of bed for one.", r: "one day?? that's not ambitious enough. two. i'll call in sick. i'll tell them i'm in love" },
    ] },
  // ===================================================================== WEEK CLOSE 6: old and slow together (deep)
  { id: 'sunny-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: "keep picturing us old. you driving too fast to the shops, me burning cakes. after last time, do you picture it too?",
    opts: [
      { tone: 'cold', t: "I don't really think that far ahead.", r: "ok. that's fine. i think far enough for both of us. it just stings a bit tonight", opts: [
        { tone: 'cold', t: "Sorry it stings.", r: "it's ok. it'll pass. night {me} 💛" },
        { tone: 'passive', t: "I don't plan far. You're in all of it, though.", r: "every plan?? even the tiny ones? ok. that's enough. that's more than enough" },
        { tone: 'flirty', t: "Ok. I picture it. You, wrinkly and pink. Still cute.", r: "wrinkly and pink!! that's so rude and so lovely. ok. you're forgiven. i'm smiling" },
      ] },
      { tone: 'passive', t: "I picture it too. I'm sorry I made you doubt it.", r: "thank you. i needed that. ok. tell me your version. what do you see?", opts: [
        { tone: 'cold', t: "I'd rather not get into it.", r: "ok. no need. it's enough that you see it. night {me}" },
        { tone: 'passive', t: "A garden. You fussing over plants. Me fixing a fence badly.", r: "you fixing a fence badly!! i love that version. i'll bring you tea while you swear at it 💛" },
        { tone: 'flirty', t: "Us, still holding hands. Still sneaking off early from things.", r: "still sneaking off early. oh. that's my favourite bit. we'll be outrageous at ninety" },
        { tone: 'risque', t: "Us at eighty, still keeping the neighbours up.", r: "we'll be a SCANDAL. the whole street will talk. i'm very proud of us already 😌" },
      ] },
      { tone: 'flirty', t: "I picture it. You'll still go pink when I flirt.", r: "i will NOT. i'll be very dignified. i'll have a cardigan. ok i'll be pink. you got me. forgiven", opts: [
        { tone: 'cold', t: "We'll see.", r: "we'll see. ok. that's a bit cold for a cardigan text. night {me}" },
        { tone: 'passive', t: "Cardigans and pink. Perfect.", r: "and you in a flat cap, complaining about the traffic. i can't wait to be old with you 💛" },
        { tone: 'flirty', t: "Pinker than ever. I'll make sure.", r: "you'll make it your life's work. i know you. ok. i'm pink now. practising" },
      ] },
    ] },
  { id: 'sunny-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: "bus stop thought: when we're old you'll still drive too fast and i'll still say 'slow down' and mean 'don't'",
    opts: [
      { tone: 'cold', t: "I'll be a very careful old driver.", r: "you will NOT. but ok. careful old you. boring. i still love you. night {me} 🙂", opts: [
        { tone: 'cold', t: "Bed. Now.", r: "night. sleep well 💛" },
        { tone: 'passive', t: "Ok, maybe a bit fast.", r: "a bit fast. to the garden centre. with me holding the plants in my lap. squealing" },
        { tone: 'flirty', t: "Careful driver. Reckless everything else.", r: "reckless everything else!! ok i like that version better. much better" },
      ] },
      { tone: 'passive', t: "And we'll argue about where to park.", r: "you'll want the closest space. i'll want the one by the flowers. we'll compromise. by the flowers", opts: [
        { tone: 'cold', t: "I'll win that one.", r: "you won't. but you can think you will. night {me}" },
        { tone: 'passive', t: "By the flowers. You always win.", r: "i always win because you let me. that's the secret. that's love. i've worked it out 💛" },
        { tone: 'flirty', t: "I'll let you win if you kiss me in the car park.", r: "in the car park!! at eighty!! scandalous. yes. every time. by the flowers" },
        { tone: 'risque', t: "And we'll still steam up the windows.", r: "at EIGHTY. i hope so. i really do. we'll set a record. ok i've gone pink at the bus stop 😌" },
      ] },
      { tone: 'flirty', t: "I'll drive slowly. Just to have longer with you in the car.", r: "oh. that's so soft. that's the softest thing. i'm going to cry at the bus stop. thanks a lot", opts: [
        { tone: 'cold', t: "Don't cry in public.", r: "too late. a stranger gave me a tissue. night {me}" },
        { tone: 'passive', t: "Cry a bit. Then text me when you're home.", r: "home. tea on. still teary. still thinking about old us. i love you so much it's silly" },
        { tone: 'flirty', t: "Slowly. With the long way home. Every time.", r: "the long way home every time. that's my whole retirement plan. you and the long way" },
        { tone: 'risque', t: "Slow car, fast once we're through the door.", r: "ha!! you would. i'd be faster. i'm very motivated, even at eighty. get home soon 😌" },
      ] },
    ] },
  { id: 'sunny-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: "decided what we'll be like old. you'll be a menace. i'll be pink. we'll hold hands at the shops. objections?",
    opts: [
      { tone: 'cold', t: "That's a long way off.", r: "it is. i like looking far. but ok. today first. night {me}", opts: [
        { tone: 'cold', t: "Today first.", r: "ok. today. good luck with it 💛" },
        { tone: 'passive', t: "Far off, but I like the picture.", r: "you like it? good. i'll keep painting it. there's a greenhouse in it now" },
        { tone: 'flirty', t: "Long way off. Let's start practising now.", r: "practising holding hands at the shops?? we'll be so good at it by eighty. olympic level" },
      ] },
      { tone: 'passive', t: "No objections. Can I add a dog?", r: "a big daft dog!! yes. he'll steal sausages. we'll pretend to be cross. we won't be", opts: [
        { tone: 'cold', t: "Maybe not a dog.", r: "ok. no dog. a goldfish. called Waffles. night {me}" },
        { tone: 'passive', t: "We'll name him together.", r: "i've already got a list. top of it is 'Biscuit'. i'm not compromising. it's Biscuit" },
        { tone: 'flirty', t: "And a big bed the dog's not allowed on.", r: "the dog will get on it. dogs always do. but we'll kick him off. sometimes 🙈" },
        { tone: 'risque', t: "And a bedroom door the dog can't open.", r: "a locked door. good thinking. the dog's not allowed to see what we get up to. at any age 😌" },
      ] },
      { tone: 'flirty', t: "Objection: you'll be pinker than that. I'll see to it.", r: "objection sustained. i'll be bright pink at ninety. it'll be your fault. like always. i love you", opts: [
        { tone: 'cold', t: "Ok, enough soppy for today.", r: "fair. soppy quota reached. night {me}" },
        { tone: 'passive', t: "Love you. Pink at ninety.", r: "pink at ninety. a promise. i'm writing it in the jar. we'll check in sixty years" },
        { tone: 'flirty', t: "I'll make you pink every day until then.", r: "every day?? that's twenty thousand days of pink. at least. ok. i accept. start tomorrow" },
        { tone: 'risque', t: "And red at night. Every night.", r: "every night. deal. i'll hold you to it. i've got a very good memory and a long list" },
      ] },
    ] },
];
