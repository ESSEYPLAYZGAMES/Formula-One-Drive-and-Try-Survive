// FLIRTATIOUS - the phone: their first text after you met, the day after a date, and after your race (win/podium/points/bad/dnf).
// Plain data, no imports.
export const DATA = [
  // ==== met: their first text after you met (two exchanges) ====
  { id: 'flirtatious-text-met-new-1-cold', on: 'met', stage: 'new', slot: 1, mood: 'cold',
    say: "you were frosty when we met. so naturally i got your number. i'll make you regret being cool with me 😏",
    opts: [
      { tone: 'cold', t: "How did you get this number?", r: "i asked nicely. i'm very good at asking nicely. you should try it", opts: [
        { tone: 'cold', t: "Don't text me again.", r: "okay. i won't. i respect a no. ...if you text first, that's on you" },
        { tone: 'passive', t: "Okay. Hi.", r: "hi. see? two letters. we'll work up to three" },
        { tone: 'flirty', t: "Regret you nicely, then.", r: "regret me nicely. mm. i like that. i'll be very regrettable all night" },
      ] },
      { tone: 'passive', t: "Hi. Sorry I was quiet.", r: "quiet's fine. i talk enough for two. you just look at me. you're good at that", opts: [
        { tone: 'cold', t: "I'm not always quiet.", r: "no? then show me. in writing. i'll wait. not long" },
        { tone: 'passive', t: "Nice to hear from you.", r: "it is nice, isn't it. i'm told my texts are very good. this is a fine example" },
        { tone: 'flirty', t: "Keep texting. I like how you talk.", r: "you haven't heard my voice. not properly. voice note incoming 😏" },
        { tone: 'risque', t: "Make me regret it in person next time.", r: "in person. mm. you're bolder by text. i'll remember that" },
      ] },
      { tone: 'flirty', t: "Make me regret it. I dare you.", r: "a dare. oh, you've picked the wrong person. i'm undefeated at dares", opts: [
        { tone: 'cold', t: "Kidding. Goodnight.", r: "goodnight. you'll think about this text. i'll know" },
        { tone: 'passive', t: "We'll find out.", r: "we'll find out. that's what everyone says before they lose" },
        { tone: 'flirty', t: "Neither do I.", r: "then we're in trouble. you especially" },
        { tone: 'risque', t: "Lose this one. I'll make it worth your while.", r: "lose? me? mm. depends what the prize is. tell me in person" },
      ] },
    ] },
  { id: 'flirtatious-text-met-new-1-passive', on: 'met', stage: 'new', slot: 1, mood: 'passive',
    say: "it's {first}. we met. you held my eye longer than anyone has all year. i had to get your number. hi",
    opts: [
      { tone: 'cold', t: "Hi. Busy right now.", r: "busy. of course. i'll be here. not waiting. definitely not waiting", opts: [
        { tone: 'cold', t: "Okay. Bye.", r: "bye. mm. you'll text back. i just know it" },
        { tone: 'passive', t: "Sorry. Hi. Glad you did.", r: "glad. good. i'll take glad. i'll make it 'delighted' by friday" },
        { tone: 'flirty', t: "Not too busy for you.", r: "not too busy. mm. good answer. you're learning fast" },
      ] },
      { tone: 'passive', t: "Hi! Glad you got it.", r: "me too. now i can stare at you by text. less effective, but i'll manage", opts: [
        { tone: 'cold', t: "Don't stare too hard.", r: "i stare exactly as hard as i like. you'll adjust. or not" },
        { tone: 'passive', t: "What do you do, anyway?", r: "{job}. mostly at night. i'm a night person. you'll find that out" },
        { tone: 'flirty', t: "I'd rather you stared in person.", r: "in person. mm. soon, then. i'll bring my best stare" },
        { tone: 'risque', t: "Stare harder. I like it.", r: "harder. mm. careful. i've made people forget their own names" },
      ] },
      { tone: 'flirty', t: "I held it on purpose. Hi.", r: "on purpose. i knew it. you're dangerous. i love dangerous", opts: [
        { tone: 'cold', t: "Don't love anything yet.", r: "not yet. fine. i'll like it. vigorously" },
        { tone: 'passive', t: "Hi again. That was fun.", r: "it was fun. it'll get more fun. i promise. i keep promises" },
        { tone: 'flirty', t: "Next time I'll hold it longer.", r: "longer. mm. you'll lose. i never look away first" },
        { tone: 'risque', t: "Next time, I won't just look.", r: "you won't just look. mm. trouble. i'm going to be thinking about that all night" },
      ] },
    ] },
  { id: 'flirtatious-text-met-new-1-flirty', on: 'met', stage: 'new', slot: 1, mood: 'flirty',
    say: "still thinking about your face. that's not a line. okay it's a line. it's also true. this is {first} 🔥",
    opts: [
      { tone: 'cold', t: "Bit forward.", r: "forward is the only direction i go. you'll keep up. maybe", opts: [
        { tone: 'cold', t: "Maybe not.", r: "maybe not. pity. you had a very good face" },
        { tone: 'passive', t: "Okay. Hi, {first}.", r: "hi. there. polite. very polite. we'll fix that" },
        { tone: 'flirty', t: "Forward works for me.", r: "of course it does. you drive at 300. you'll love me" },
      ] },
      { tone: 'passive', t: "Hi {first}. I'm thinking about yours too.", r: "are you. mm. mutual thinking. very dangerous", opts: [
        { tone: 'cold', t: "Only a bit.", r: "a bit. i'll take a bit. i'll grow it" },
        { tone: 'passive', t: "Very dangerous. Goodnight.", r: "goodnight. dream about faces. specifically mine" },
        { tone: 'flirty', t: "Dangerous is my job.", r: "it is. on track. let's see you off it" },
        { tone: 'risque', t: "Thinking about it up close.", r: "up close. mm. that's where it's best. next time. closer" },
      ] },
      { tone: 'flirty', t: "Line or not, it works.", r: "of course it works. they all work. this one i meant", opts: [
        { tone: 'cold', t: "Don't oversell it.", r: "overselling is my art. fine. it was an average face. it wasn't" },
        { tone: 'passive', t: "I'll take it.", r: "take it. it's yours. like my number. use both" },
        { tone: 'flirty', t: "Send me another.", r: "another? greedy. i like greedy. you held my eye like you owned it" },
        { tone: 'risque', t: "Save the next one for in person. Whispered.", r: "whispered. mm. you're a natural. i'm almost worried 😏" },
      ] },
    ] },
  // ==== date, warm 1: the morning after a first proper date ====
  { id: 'flirtatious-text-date-warm-1-cold', on: 'date', stage: 'warm', slot: 1, mood: 'cold',
    say: "about last night. dinner was gorgeous. you were frosty at the end. i'm choosing to remember the dinner",
    opts: [
      { tone: 'cold', t: "It was fine.", r: "fine. dinner by candlelight was 'fine.' i'll tell the candles. they'll be crushed" },
      { tone: 'passive', t: "Sorry. I had a good time.", r: "did you? you hid it well. next time, hide it worse" },
      { tone: 'flirty', t: "Remember the bit where I couldn't stop staring.", r: "i remember. i'm choosing that bit too. it's my favourite bit" },
      { tone: 'risque', t: "Remember the walk home. I do.", r: "the walk home. mm. i remember the door. you nearly came up. nearly" },
    ] },
  { id: 'flirtatious-text-date-warm-1-passive', on: 'date', stage: 'warm', slot: 1, mood: 'passive',
    say: "last night was lovely. i don't say lovely. it was lovely. thank you, trouble",
    opts: [
      { tone: 'cold', t: "It was alright.", r: "alright. ouch. i'll aim for 'lovely' next time. or i won't" },
      { tone: 'passive', t: "Thank you too. Again soon?", r: "soon. yes. i've already picked the next place" },
      { tone: 'flirty', t: "Lovely? I was aiming for unforgettable.", r: "unforgettable. mm. you hit that too. i can't stop replaying it" },
      { tone: 'risque', t: "Next time, don't let me leave at the door.", r: "i won't. i'll lock it. joking. mostly joking 😏" },
    ] },
  { id: 'flirtatious-text-date-warm-1-flirty', on: 'date', stage: 'warm', slot: 1, mood: 'flirty',
    say: "you looked at me over that candle like i was dessert. i'm still not over it 🔥",
    opts: [
      { tone: 'cold', t: "I was looking at the menu.", r: "the menu. sure. you never looked at the menu once. i counted" },
      { tone: 'passive', t: "It was a great night.", r: "it was. thank you. i'd like several more of those" },
      { tone: 'flirty', t: "You were better than dessert.", r: "better. mm. you're very good at this. i'm in trouble" },
      { tone: 'risque', t: "Next time, skip dinner. Straight to dessert.", r: "straight to dessert. mm. i'll set the table. or forget the table" },
    ] },
  // ==== date, warm 2 (two exchanges) ====
  { id: 'flirtatious-text-date-warm-2-cold', on: 'date', stage: 'warm', slot: 2, mood: 'cold',
    say: "second date and you went cold on the walk home. i'm not sulking. i'm reflecting. dramatically",
    opts: [
      { tone: 'cold', t: "I was tired.", r: "tired. okay. i'll accept tired. once", opts: [
        { tone: 'cold', t: "Accept it twice.", r: "twice? no. you'll have to wake up. i don't date sleepwalkers" },
        { tone: 'passive', t: "Next time I'll be awake.", r: "awake. good. i like you awake. you're very good awake" },
        { tone: 'flirty', t: "I was tired of saying goodnight.", r: "oh. that's... annoyingly good. you're forgiven. barely" },
      ] },
      { tone: 'passive', t: "Sorry. I loved the evening.", r: "loved. that's a big word from you. i'll keep it", opts: [
        { tone: 'cold', t: "It's just a word.", r: "just a word. fine. i'll read into it anyway. at length" },
        { tone: 'passive', t: "So what's next?", r: "my place. a record. a very slow song. you'll see" },
        { tone: 'flirty', t: "Loved it. Loved you in that light.", r: "that light. mm. candlelight is my best friend. you're my second" },
        { tone: 'risque', t: "Next time, walk me home and come in.", r: "come in. mm. i'll leave the hall light on. just the hall light" },
      ] },
      { tone: 'flirty', t: "Reflect on the kiss, then.", r: "the kiss. that's what i'm reflecting on. that's the problem", opts: [
        { tone: 'cold', t: "It was just a kiss.", r: "just a kiss. right. lovely. i'll reflect elsewhere" },
        { tone: 'passive', t: "It was a good one.", r: "it was a very good one. my grandmother would be proud. long story" },
        { tone: 'flirty', t: "Reflect harder. I'll do it again.", r: "again. mm. soon. i'm still dizzy" },
        { tone: 'risque', t: "Next time I won't stop at one.", r: "not at one. mm. trouble. i'm going to need to lie down 🔥" },
      ] },
    ] },
  { id: 'flirtatious-text-date-warm-2-passive', on: 'date', stage: 'warm', slot: 2, mood: 'passive',
    say: "two dates down. i'm keeping score. it's two-nil to you. you're very good at evenings",
    opts: [
      { tone: 'cold', t: "I'm not keeping score.", r: "no need. i'm keeping it for both of us. two-nil", opts: [
        { tone: 'cold', t: "Stop keeping it.", r: "stop? i can't. it's a compulsion. fine. one-nil. to me. for spite" },
        { tone: 'passive', t: "Okay. What's my prize?", r: "a third date. obviously. my choice of venue" },
        { tone: 'flirty', t: "Make it three-nil.", r: "three-nil. mm. you're confident. i love confident" },
      ] },
      { tone: 'passive', t: "Two-nil? What did I win?", r: "the evening. the look. the bit where i laughed my real laugh. nobody gets that", opts: [
        { tone: 'cold', t: "Just a laugh.", r: "just a laugh. you don't know how rare it is. fine. back in the box it goes" },
        { tone: 'passive', t: "I loved your real laugh.", r: "you did? it's a snort. you're very kind. or deaf" },
        { tone: 'flirty', t: "I want to hear it again. Soon.", r: "soon. mm. make me laugh like that again and i'll give you anything" },
        { tone: 'risque', t: "Third date at yours, then.", r: "mine. mm. records. low lights. i'll laugh. and other things" },
      ] },
      { tone: 'flirty', t: "I'm going for a hat-trick.", r: "a hat-trick. mm. bold. i'll wear something worth scoring for", opts: [
        { tone: 'cold', t: "Kidding. Maybe.", r: "maybe. such a tease. it's very attractive" },
        { tone: 'passive', t: "Next week?", r: "next week. thursday. i'll be early. i'm never early" },
        { tone: 'flirty', t: "I'll score in style.", r: "in style. of course. you do everything in style. annoyingly" },
        { tone: 'risque', t: "Third date: your place, no curfew.", r: "no curfew. mm. i don't believe in curfews. or sleep. bring stamina 😏" },
      ] },
    ] },
  { id: 'flirtatious-text-date-warm-2-flirty', on: 'date', stage: 'warm', slot: 2, mood: 'flirty',
    say: "that second date. the way you held my hand under the table. i've been useless all morning",
    opts: [
      { tone: 'cold', t: "It was only my hand.", r: "only your hand. darling. it was a whole event", opts: [
        { tone: 'cold', t: "Really. Calm down.", r: "calm down. fine. calm. useless. both" },
        { tone: 'passive', t: "Okay. It was nice.", r: "nice. i'll take nice. i'll frame nice" },
        { tone: 'flirty', t: "I'll hold it again. Longer.", r: "longer. mm. i'll clear my afternoon" },
      ] },
      { tone: 'passive', t: "I didn't want to let go.", r: "then don't next time. i won't let you", opts: [
        { tone: 'cold', t: "Maybe next time.", r: "maybe. you're very careful. i'm very not. we'll meet in the middle" },
        { tone: 'passive', t: "Deal.", r: "deal. that's binding. i'm a stickler for deals" },
        { tone: 'flirty', t: "Hold on all night next time.", r: "all night. mm. i'll make sure there's a reason to" },
        { tone: 'risque', t: "Next time I'll hold more than your hand.", r: "more than my hand. mm. useless all morning and now all afternoon. thanks 🔥" },
      ] },
      { tone: 'flirty', t: "Useless is cute on you.", r: "everything's cute on me. useless is just the latest", opts: [
        { tone: 'cold', t: "Get some work done.", r: "work. {work}. fine. i'll pretend. i'll fail" },
        { tone: 'passive', t: "Third date soon?", r: "soon. this week. i'm bad at waiting for you" },
        { tone: 'flirty', t: "I'll make you useless again.", r: "again. mm. please do. i'll take the whole week off" },
        { tone: 'risque', t: "Wait till date three. You'll lose a whole day.", r: "a whole day. mm. i'll clear two. just in case" },
      ] },
    ] },
  // ==== date, warm 3 ====
  { id: 'flirtatious-text-date-warm-3-cold', on: 'date', stage: 'warm', slot: 3, mood: 'cold',
    say: "third date. you went quiet at the end again. i'm starting to think endings are your weak spot. i'll fix it",
    opts: [
      { tone: 'cold', t: "There's nothing to fix.", r: "there's always something to fix. you're just very fixable" },
      { tone: 'passive', t: "I'm bad at goodbyes.", r: "then don't say goodbye. say 'see you in the morning'" },
      { tone: 'flirty', t: "Fix it. I'll let you.", r: "you'll let me. mm. that's the best news i've had all week" },
      { tone: 'risque', t: "Then don't make me say goodbye next time.", r: "no goodbye. mm. i'll keep the door closed and the record on" },
    ] },
  { id: 'flirtatious-text-date-warm-3-passive', on: 'date', stage: 'warm', slot: 3, mood: 'passive',
    say: "three dates. my grandmother says three is when it's serious. she has rules. i'm ignoring most of them",
    opts: [
      { tone: 'cold', t: "It's not that serious yet.", r: "not that serious. okay. i'll tell her. she'll laugh at you" },
      { tone: 'passive', t: "Serious sounds good.", r: "it really does. i've never said that before. it's terrifying. good" },
      { tone: 'flirty', t: "Ignore the rest. Keep the serious.", r: "keep the serious. mm. okay. i'm keeping it. and you" },
      { tone: 'risque', t: "Ignore the rest of them tonight with me.", r: "tonight. mm. no rules. not even hers. come over" },
    ] },
  { id: 'flirtatious-text-date-warm-3-flirty', on: 'date', stage: 'warm', slot: 3, mood: 'flirty',
    say: "last night. the kitchen. the slow song. i'm still swaying. send help. don't send help 🔥",
    opts: [
      { tone: 'cold', t: "It was one dance.", r: "one dance. you keep saying 'just' and 'one.' nothing with you is one" },
      { tone: 'passive', t: "That was a lovely night.", r: "it was. i'll play that song every night now. it's yours" },
      { tone: 'flirty', t: "I'm still swaying too.", r: "good. we'll sway in separate kitchens. it's very romantic" },
      { tone: 'risque', t: "Next time, we don't stop at one song.", r: "not one song. mm. the whole side, twice. we'll lose count" },
    ] },
  // ==== date, close 1 ====
  { id: 'flirtatious-text-date-close-1-cold', on: 'date', stage: 'close', slot: 1, mood: 'cold',
    say: "about last night. you were moody. i was gorgeous. we kissed anyway. i'm calling that a win",
    opts: [
      { tone: 'cold', t: "If you say so.", r: "i do say so. i'm always right. you're always moody. it works" },
      { tone: 'passive', t: "Sorry about the mood. Great night.", r: "great night. forgiven. you're very forgivable. it's annoying" },
      { tone: 'flirty', t: "You were very gorgeous.", r: "i was. thank you. you were very kissable. even moody" },
      { tone: 'risque', t: "Win again tonight?", r: "tonight. mm. i'll be gorgeous again. you be less moody. door's open" },
    ] },
  { id: 'flirtatious-text-date-close-1-passive', on: 'date', stage: 'close', slot: 1, mood: 'passive',
    say: "woke up still smiling about last night. no line. just that. thank you, trouble",
    opts: [
      { tone: 'cold', t: "It was decent.", r: "decent. mm. you'll have to work harder at lying. i saw your face" },
      { tone: 'passive', t: "Me too. It was perfect.", r: "perfect. okay. two people smiling at their phones. disgusting. lovely" },
      { tone: 'flirty', t: "Smile wider. I'm not done.", r: "not done? mm. i'll keep the evening free. all of them" },
      { tone: 'risque', t: "Keep smiling. I'm coming back tonight.", r: "tonight. mm. i'll keep the smile. you bring the rest 😏" },
    ] },
  { id: 'flirtatious-text-date-close-1-flirty', on: 'date', stage: 'close', slot: 1, mood: 'flirty',
    say: "last night. the rooftop. the stars. you. i've run out of ways to say perfect so i'm just saying it 🔥",
    opts: [
      { tone: 'cold', t: "It was cold up there.", r: "it was. you kept me warm. that's the point. try to keep up" },
      { tone: 'passive', t: "It was perfect. Thank you.", r: "thank you. say it again sometime. i like hearing it" },
      { tone: 'flirty', t: "You were the best view.", r: "the best view. mm. you're getting dangerously good at this" },
      { tone: 'risque', t: "Next time, I'm not letting you go home.", r: "not going home. mm. good. home's overrated. you're not" },
    ] },
  // ==== date, close 2 (two exchanges) ====
  { id: 'flirtatious-text-date-close-2-cold', on: 'date', stage: 'close', slot: 2, mood: 'cold',
    say: "you were distant at dinner. then you weren't. then you were. i'm dizzy. kiss me properly next time and we're even",
    opts: [
      { tone: 'cold', t: "I had a lot on my mind.", r: "a lot on your mind. okay. put me on it. near the top", opts: [
        { tone: 'cold', t: "You're on it. Low down.", r: "low down. ouch. i'll climb. i'm very determined" },
        { tone: 'passive', t: "Sorry. Work stuff. You're on it.", r: "okay. good. i'll stay on it. quietly. mostly" },
        { tone: 'flirty', t: "You're the top of it.", r: "the top. mm. good. i'll stay there. comfortably" },
      ] },
      { tone: 'passive', t: "Sorry. I'll kiss you properly next time.", r: "properly. good. i'll grade it. strictly", opts: [
        { tone: 'cold', t: "Don't grade me.", r: "i grade everything. fine. pass or fail. you'll pass" },
        { tone: 'passive', t: "Deal. Next weekend?", r: "next weekend. good. i'll be there. early" },
        { tone: 'flirty', t: "I'll ace it.", r: "you'll ace it. mm. i'll expect distinction" },
        { tone: 'risque', t: "Properly, and then some.", r: "and then some. mm. i'll clear the whole evening. and the next morning" },
      ] },
      { tone: 'flirty', t: "Even? I'll kiss you twice.", r: "twice. then i'll owe you. that's a debt i'd love", opts: [
        { tone: 'cold', t: "Once. Don't push it.", r: "once. fine. make it count. you always do" },
        { tone: 'passive', t: "We'll call it even.", r: "even. good. i like even. sometimes" },
        { tone: 'flirty', t: "Three times. Let's be generous.", r: "three. mm. generous. i'll pay you back with interest" },
        { tone: 'risque', t: "Twice at dinner. The rest at yours.", r: "the rest at mine. mm. i've already turned the lights down 🔥" },
      ] },
    ] },
  { id: 'flirtatious-text-date-close-2-passive', on: 'date', stage: 'close', slot: 2, mood: 'passive',
    say: "dinner was perfect. you were perfect. i'm saying perfect a lot. i'm stopping. it was perfect",
    opts: [
      { tone: 'cold', t: "Food was good.", r: "the food. of course. you were looking at the food. fine. the food was good", opts: [
        { tone: 'cold', t: "Very good food.", r: "very good. you're impossible. i'll take the chef next time" },
        { tone: 'passive', t: "And the company.", r: "and the company. good. much better. thank you" },
        { tone: 'flirty', t: "The company was better.", r: "the company was me. i was very good company. thank you" },
      ] },
      { tone: 'passive', t: "It was. Same time next week?", r: "same time. same table. same staring contest. i'll still win", opts: [
        { tone: 'cold', t: "You always say that.", r: "because it's always true. you blink. it's very cute" },
        { tone: 'passive', t: "I'll be there.", r: "you'll be there. good. i'll be early. again" },
        { tone: 'flirty', t: "I'll win this time.", r: "you won't. but i love watching you try" },
        { tone: 'risque', t: "Same table. Then your place. Like last time.", r: "like last time. mm. i'll set the record. and the mood" },
      ] },
      { tone: 'flirty', t: "You were perfect. I couldn't stop staring.", r: "i noticed. i stared back. we're terrible. we're perfect", opts: [
        { tone: 'cold', t: "Let's tone it down in public.", r: "tone it down. fine. we'll stare discreetly. it's worse" },
        { tone: 'passive', t: "Next time we'll stare more.", r: "more. mm. we'll need a bigger table. or a darker corner" },
        { tone: 'flirty', t: "Let's stare all weekend.", r: "all weekend. you're very ambitious. i accept" },
        { tone: 'risque', t: "Next time, let's skip the restaurant.", r: "skip it. mm. order in. lights off. we'll eat at midnight. maybe" },
      ] },
    ] },
  { id: 'flirtatious-text-date-close-2-flirty', on: 'date', stage: 'close', slot: 2, mood: 'flirty',
    say: "can still feel your hand on my back from last night. i'm going to need a minute. or a week 🔥",
    opts: [
      { tone: 'cold', t: "A week? Dramatic.", r: "dramatic. yes. you know me. it was a very good hand", opts: [
        { tone: 'cold', t: "Calm yourself.", r: "calm. fine. i'll sit down. fan myself. sulk" },
        { tone: 'passive', t: "It was a good night.", r: "the best. i'm still glowing" },
        { tone: 'flirty', t: "Take the week. I'll be back for more.", r: "for more. mm. i'll be ready. more than ready" },
      ] },
      { tone: 'passive', t: "Take as long as you need.", r: "kind. i'll take forever. you'll have to come and get me", opts: [
        { tone: 'cold', t: "Not forever.", r: "not forever. a week, then. a long week" },
        { tone: 'passive', t: "I'll come get you Friday.", r: "friday. good. i'll be ready. gorgeous. waiting" },
        { tone: 'flirty', t: "I'll come and get you tonight.", r: "tonight. mm. i'll be the one at the window" },
        { tone: 'risque', t: "Tonight. Lights low. I'm coming over.", r: "lights low. mm. the door's on the latch 😏" },
      ] },
      { tone: 'flirty', t: "I'll put it there again tonight.", r: "tonight. mm. i'll wear something with a back", opts: [
        { tone: 'cold', t: "Maybe not tonight.", r: "not tonight. fine. tomorrow. i'll wear it anyway. for spite" },
        { tone: 'passive', t: "Dinner first.", r: "dinner first. so proper. i'll wear it to dinner, then" },
        { tone: 'flirty', t: "Wear something I'll remember.", r: "you'll remember. you'll be thinking about it for weeks" },
        { tone: 'risque', t: "And then I'll keep you up till sunrise.", r: "sunrise. mm. i haven't seen one with company. let's fix that" },
      ] },
    ] },
  // ==== date, close 3 ====
  { id: 'flirtatious-text-date-close-3-cold', on: 'date', stage: 'close', slot: 3, mood: 'cold',
    say: "lovely evening till you went quiet. i've decided you're shy, not cold. shy is cute. cold isn't",
    opts: [
      { tone: 'cold', t: "I'm not shy.", r: "then you're cold. and i'll warm you up. that's a threat" },
      { tone: 'passive', t: "Maybe a little shy.", r: "a little. cute. i'll be loud for both of us" },
      { tone: 'flirty', t: "Shy around you. You're a lot.", r: "i am a lot. you handle it very well. for a shy one" },
      { tone: 'risque', t: "Warm me up properly next time.", r: "properly. mm. starting in the hallway. you won't be shy for long" },
    ] },
  { id: 'flirtatious-text-date-close-3-passive', on: 'date', stage: 'close', slot: 3, mood: 'passive',
    say: "last night: the balcony, the slow record, your head on my shoulder. i've never felt so ordinary. it's wonderful",
    opts: [
      { tone: 'cold', t: "Ordinary?", r: "ordinary means safe. i've never been safe. it's very new. don't ruin it" },
      { tone: 'passive', t: "It was wonderful.", r: "it was. let's be ordinary again soon. it suits us" },
      { tone: 'flirty', t: "Ordinary with you is my favourite thing.", r: "mine too. keep it quiet. my reputation can't take it" },
      { tone: 'risque', t: "Ordinary, and then extraordinary.", r: "then extraordinary. mm. you remember that part too. good 🔥" },
    ] },
  { id: 'flirtatious-text-date-close-3-flirty', on: 'date', stage: 'close', slot: 3, mood: 'flirty',
    say: "can't stop thinking about last night. you. my kitchen. that song. i'm ruined for other evenings, trouble",
    opts: [
      { tone: 'cold', t: "It was one night.", r: "one night. the best one. fine. i'll pretend it was ordinary" },
      { tone: 'passive', t: "Me too. That song's ours now.", r: "ours. mm. i've never had an 'ours.' i like it" },
      { tone: 'flirty', t: "Let me ruin all your evenings.", r: "all of them. mm. you're already doing it. thank you" },
      { tone: 'risque', t: "Tonight, let's ruin the next one.", r: "the next one. mm. my kitchen. that song. door locked" },
    ] },
  // ==== win 1 (two exchanges): the first win ====
  { id: 'flirtatious-text-win-any-1-cold', on: 'win', stage: 'any', slot: 1, mood: 'cold',
    say: "you won. i was furious with you and i still screamed. that's the power you have. congratulations, trouble",
    opts: [
      { tone: 'cold', t: "Thanks.", r: "thanks. one word. after a win. you're impossible", opts: [
        { tone: 'cold', t: "Busy celebrating.", r: "celebrating. without me. fine. enjoy your trophy. it can't text back" },
        { tone: 'passive', t: "Sorry. It's chaos here. Thank you.", r: "chaos. i know. i'll forgive you. text me when it calms" },
        { tone: 'flirty', t: "You screamed? I wish I'd heard it.", r: "you'll hear it next time. in person. it's a very good scream" },
      ] },
      { tone: 'passive', t: "Thank you! Can't believe it.", r: "believe it. you were magnificent. i watched every lap with a hand over my mouth", opts: [
        { tone: 'cold', t: "It was mostly the car.", r: "the car. sure. the car doesn't look like that on the podium" },
        { tone: 'passive', t: "Thanks for watching.", r: "always. i'll watch everything. i'm hooked" },
        { tone: 'flirty', t: "Magnificent? Say it again.", r: "magnificent. gorgeous. victorious. in that order" },
      ] },
      { tone: 'flirty', t: "Furious and screaming. My favourite combination.", r: "it's an excellent combination. i'm very good at both. congratulations", opts: [
        { tone: 'cold', t: "Don't make it about you.", r: "it's about you. it's always about you. that's my problem" },
        { tone: 'passive', t: "Thank you. Honestly.", r: "honestly, you deserve it. now go and spray champagne at someone" },
        { tone: 'flirty', t: "Celebrate with me later.", r: "later. mm. i'll bring my best congratulations. they're very thorough" },
      ] },
    ] },
  { id: 'flirtatious-text-win-any-1-passive', on: 'win', stage: 'any', slot: 1, mood: 'passive',
    say: "YOU WON at {last}. i shouted at my balcony. the neighbours know your name now. congratulations 🔥",
    opts: [
      { tone: 'cold', t: "It's just one race.", r: "just one race. you won it. let me be excited. be humble somewhere else", opts: [
        { tone: 'cold', t: "Okay. Be excited.", r: "i will. without your help. i'm very good at it" },
        { tone: 'passive', t: "Okay, okay. It's huge.", r: "it's huge. you're huge. i'm proud. there" },
        { tone: 'flirty', t: "Be excited at me in person.", r: "in person. mm. i'll bring the excitement. you bring the trophy" },
      ] },
      { tone: 'passive', t: "Thank you! The neighbours?", r: "they banged on the wall. i banged back. it was a whole thing. worth it", opts: [
        { tone: 'cold', t: "Sounds noisy.", r: "it was noisy. i'm noisy. you won. it's allowed" },
        { tone: 'passive', t: "Tell them sorry from me.", r: "i won't. they should be honoured" },
        { tone: 'flirty', t: "I'll give you more to shout about.", r: "more. mm. i'll warn the neighbours" },
      ] },
      { tone: 'flirty', t: "Shout my name again next time.", r: "every time. i'll shout it at every race. you'll hear me from the grid", opts: [
        { tone: 'cold', t: "Please, no shouting.", r: "fine. i'll whisper it. menacingly" },
        { tone: 'passive', t: "That's very sweet.", r: "sweet. ugh. it's devotion. there's a difference" },
        { tone: 'flirty', t: "Shout it in person.", r: "in person. mm. you'll have to win again first. or not. i'll shout anyway" },
      ] },
    ] },
  { id: 'flirtatious-text-win-any-1-flirty', on: 'win', stage: 'any', slot: 1, mood: 'flirty',
    say: "a winner. my winner? we'll see. you looked unbearably good on that top step. congratulations, gorgeous",
    opts: [
      { tone: 'cold', t: "Don't get possessive.", r: "possessive? me? just admiring. publicly. loudly", opts: [
        { tone: 'cold', t: "Admire quietly.", r: "quietly. fine. i'll admire in a whisper" },
        { tone: 'passive', t: "Okay. Admire away.", r: "i will. it's my favourite hobby now" },
        { tone: 'flirty', t: "Your winner. For tonight.", r: "for tonight. mm. i'll take tonight. and see about the rest" },
      ] },
      { tone: 'passive', t: "Thanks! Still shaking.", r: "shaking. me too. from a balcony. imagine being in the car", opts: [
        { tone: 'cold', t: "You weren't in the car.", r: "no. i was in my head. with you. it's very loud in there" },
        { tone: 'passive', t: "It's a lot. In a good way.", r: "the best way. enjoy every minute" },
        { tone: 'flirty', t: "Come and steady me.", r: "steady you. mm. i'm the least steady person i know. but i'll try" },
      ] },
      { tone: 'flirty', t: "Unbearably good? Tell me more.", r: "the helmet hair. the grin. the bit where you looked at the camera. at me", opts: [
        { tone: 'cold', t: "I was looking at the trophy.", r: "you were looking at me. i know you were. fine. pretend" },
        { tone: 'passive', t: "I'll look again next time.", r: "next time. good. make it soon" },
        { tone: 'flirty', t: "I was. Who else?", r: "nobody else. that's the right reply. you win twice today" },
      ] },
    ] },
  // ==== win 2 ====
  { id: 'flirtatious-text-win-any-2-cold', on: 'win', stage: 'any', slot: 2, mood: 'cold',
    say: "another win. you're making it hard to stay cross with you. which i was. very cross. well done anyway",
    opts: [
      { tone: 'cold', t: "Stay cross, then.", r: "i will. while watching the replay. three times" },
      { tone: 'passive', t: "Thank you. Sorry about before.", r: "forgiven. winning helps. so does that grin" },
      { tone: 'flirty', t: "Stop being cross. Celebrate.", r: "celebrate. mm. you've talked me into it. as usual" },
    ] },
  { id: 'flirtatious-text-win-any-2-passive', on: 'win', stage: 'any', slot: 2, mood: 'passive',
    say: "two wins. at this rate i'll need a hat for the podium. congratulations, trouble",
    opts: [
      { tone: 'cold', t: "Don't bother with the hat.", r: "no hat. fine. i'll come hatless and gorgeous" },
      { tone: 'passive', t: "Thanks! What kind of hat?", r: "something enormous. something that blocks everyone's view but mine" },
      { tone: 'flirty', t: "Wear the hat. Stand where I can see you.", r: "where you can see me. mm. i always stand there" },
    ] },
  { id: 'flirtatious-text-win-any-2-flirty', on: 'win', stage: 'any', slot: 2, mood: 'flirty',
    say: "you won again. the confidence on you. i'm writing a sonnet. it's mostly about your gloves",
    opts: [
      { tone: 'cold', t: "Please, no sonnets.", r: "too late. stanza one. 'oh gloves.' it's a work in progress" },
      { tone: 'passive', t: "My gloves?", r: "your gloves. the way you pull them off. there's a whole line about it" },
      { tone: 'flirty', t: "Send me the sonnet.", r: "not yet. it's not done. it's very steamy for a sonnet" },
    ] },
  // ==== win 3: making a habit of it ====
  { id: 'flirtatious-text-win-any-3-cold', on: 'win', stage: 'any', slot: 3, mood: 'cold',
    say: "winning again. making a habit of it. like being difficult. you're very good at both",
    opts: [
      { tone: 'cold', t: "Thanks, I guess.", r: "you guess. lovely. i'll guess i'm proud of you" },
      { tone: 'passive', t: "Habit's a good word.", r: "it's a good habit. keep it. the difficult one, drop" },
      { tone: 'flirty', t: "Make a habit of me, too.", r: "of you. mm. too late. already have" },
    ] },
  { id: 'flirtatious-text-win-any-3-passive', on: 'win', stage: 'any', slot: 3, mood: 'passive',
    say: "three wins. i've stopped pretending i'm not watching. i have a chair now. it's your chair. congratulations",
    opts: [
      { tone: 'cold', t: "No need to watch.", r: "no need. i want to. that's the annoying part" },
      { tone: 'passive', t: "A chair? That's commitment.", r: "it is. it's velvet. it's very dramatic. like me" },
      { tone: 'flirty', t: "Save the chair for me.", r: "for you. mm. there's room for two. barely" },
    ] },
  { id: 'flirtatious-text-win-any-3-flirty', on: 'win', stage: 'any', slot: 3, mood: 'flirty',
    say: "winning is officially your habit. i'd like to be your next one. congratulations, you gorgeous menace 🔥",
    opts: [
      { tone: 'cold', t: "One habit's enough.", r: "one habit. fine. i'll be your vice instead" },
      { tone: 'passive', t: "Thank you! Celebrating?", r: "celebrating. with you. in my head. it's going very well" },
      { tone: 'flirty', t: "You're already my favourite habit.", r: "favourite. mm. good. stay that way" },
    ] },
  // ==== podium 1 ====
  { id: 'flirtatious-text-podium-any-1-cold', on: 'podium', stage: 'any', slot: 1, mood: 'cold',
    say: "you made the podium. i'd text something warm but you were cold. so: well done. there. warm-ish",
    opts: [
      { tone: 'cold', t: "Warm-ish is fine.", r: "fine. i'll stay warm-ish. it's very difficult with your face on my screen" },
      { tone: 'passive', t: "Thank you. Means a lot.", r: "does it? good. then here's the full warm: you were brilliant" },
      { tone: 'flirty', t: "Warm-ish? I'll take hot.", r: "hot. mm. you were. on that podium. fine. hot. there" },
    ] },
  { id: 'flirtatious-text-podium-any-1-passive', on: 'podium', stage: 'any', slot: 1, mood: 'passive',
    say: "podium! you looked so good up there. i was cheering at my phone like a lunatic",
    opts: [
      { tone: 'cold', t: "Not the top step.", r: "still the podium. let me be happy for you" },
      { tone: 'passive', t: "Thank you! Lunatic is fine.", r: "lunatic is my resting state. well done, trouble" },
      { tone: 'flirty', t: "Cheer for me in person next time.", r: "in person. mm. i'll be loud. i'll be wearing your colours" },
    ] },
  { id: 'flirtatious-text-podium-any-1-flirty', on: 'podium', stage: 'any', slot: 1, mood: 'flirty',
    say: "podium. you, spraying things, grinning. i'm going to need a lie-down. congratulations 🔥",
    opts: [
      { tone: 'cold', t: "Calm down. It's a podium.", r: "calm. i'm calm. i'm lying down and calm. thanks" },
      { tone: 'passive', t: "Thank you! It was a good day.", r: "a very good day. for both of us. i got to watch" },
      { tone: 'flirty', t: "Lie down. I'll come and check on you.", r: "check on me. mm. be thorough" },
    ] },
  // ==== podium 2 ====
  { id: 'flirtatious-text-podium-any-2-cold', on: 'podium', stage: 'any', slot: 2, mood: 'cold',
    say: "another podium. you're very good at being admired. i'd know. i'm still annoyed with you, though",
    opts: [
      { tone: 'cold', t: "Stay annoyed.", r: "i will. i'll be annoyed and impressed. it's exhausting" },
      { tone: 'passive', t: "Thanks. Sorry for annoying you.", r: "forgiven. podiums help. so does an apology" },
      { tone: 'flirty', t: "Annoyed and admiring. Cute.", r: "i'm not cute. i'm smouldering. fine. cute" },
    ] },
  { id: 'flirtatious-text-podium-any-2-passive', on: 'podium', stage: 'any', slot: 2, mood: 'passive',
    say: "podium again! you're making my phone very happy. it keeps showing me your face",
    opts: [
      { tone: 'cold', t: "Turn notifications off.", r: "never. i'd miss your face. it's half the reason i have a phone" },
      { tone: 'passive', t: "Good happy, I hope.", r: "the best happy. well done" },
      { tone: 'flirty', t: "Your phone has good taste.", r: "it learned from me. well done, gorgeous" },
    ] },
  { id: 'flirtatious-text-podium-any-2-flirty', on: 'podium', stage: 'any', slot: 2, mood: 'flirty',
    say: "two podiums. i'm running out of compliments. kidding. i have hundreds. you'll get them in person",
    opts: [
      { tone: 'cold', t: "Save them.", r: "save them. fine. they'll pile up. you'll drown in them one day" },
      { tone: 'passive', t: "One now, please.", r: "one: you look like you were born on a podium. there" },
      { tone: 'flirty', t: "In person, then. All of them.", r: "all of them. mm. clear your evening. it'll take hours" },
    ] },
  // ==== podium 3 (two exchanges): a habit of it ====
  { id: 'flirtatious-text-podium-any-3-cold', on: 'podium', stage: 'any', slot: 3, mood: 'cold',
    say: "podium again. habit-forming. like you being frosty. i'll congratulate one and ignore the other",
    opts: [
      { tone: 'cold', t: "Ignore both.", r: "both? fine. but i'm still proud. secretly", opts: [
        { tone: 'cold', t: "Do what you like.", r: "i always do. right now that's being proud. quietly" },
        { tone: 'passive', t: "Thanks. Really.", r: "you're welcome. really. go celebrate" },
        { tone: 'flirty', t: "Proud? Say it out loud.", r: "proud. there. out loud. my neighbours heard" },
      ] },
      { tone: 'passive', t: "Sorry I've been distant.", r: "distant. yes. you're forgiven. podiums buy a lot", opts: [
        { tone: 'cold', t: "Let's not dwell on it.", r: "fine. no dwelling. just a podium and a sulk" },
        { tone: 'passive', t: "Thanks for still watching.", r: "always watching. it's a problem. a nice one" },
        { tone: 'flirty', t: "Let me make it up to you.", r: "make it up. mm. i accept. in person" },
      ] },
      { tone: 'flirty', t: "Habit? You're my habit.", r: "your habit. mm. good. i'm a very good habit to have", opts: [
        { tone: 'cold', t: "Habits can be broken.", r: "not me. i'm unbreakable. go and celebrate" },
        { tone: 'passive', t: "The best kind.", r: "the best kind. well done, trouble" },
        { tone: 'flirty', t: "Never breaking it.", r: "never. mm. good. i'll hold you to it" },
      ] },
    ] },
  { id: 'flirtatious-text-podium-any-3-passive', on: 'podium', stage: 'any', slot: 3, mood: 'passive',
    say: "third podium. you're making a habit of being the most watchable thing on earth. well done",
    opts: [
      { tone: 'cold', t: "It's my job.", r: "it's your job. fine. you're very good at your job. happy?", opts: [
        { tone: 'cold', t: "Sure.", r: "sure. lovely. i'll go and be proud elsewhere" },
        { tone: 'passive', t: "Yes. Thank you.", r: "good. i'm proud of you. act normal" },
        { tone: 'flirty', t: "Happier now you've said it.", r: "then i'll say it more. you're brilliant. there" },
      ] },
      { tone: 'passive', t: "Thanks! Have you watched them all?", r: "all of them. i've seen your podium grin from every angle", opts: [
        { tone: 'cold', t: "That's a lot of watching.", r: "it is a lot of watching. i'm a lot. you knew" },
        { tone: 'passive', t: "That means a lot.", r: "good. i'll keep watching. i can't stop anyway" },
        { tone: 'flirty', t: "Which angle's best?", r: "the one where you look at the camera like you know i'm watching" },
      ] },
      { tone: 'flirty', t: "Most watchable? Watch me in person.", r: "in person. mm. you'd be even harder to look away from", opts: [
        { tone: 'cold', t: "Busy this week.", r: "busy. of course. i'll watch the replays. sulkily" },
        { tone: 'passive', t: "Next weekend?", r: "next weekend. good. i'll bring my best staring" },
        { tone: 'flirty', t: "You never look away anyway.", r: "never. that's the rule. you'll adapt" },
      ] },
    ] },
  { id: 'flirtatious-text-podium-any-3-flirty', on: 'podium', stage: 'any', slot: 3, mood: 'flirty',
    say: "three podiums. you on that step is my favourite view now. above my balcony. don't tell my balcony",
    opts: [
      { tone: 'cold', t: "Your balcony will cope.", r: "it'll cope. i won't. i'm obsessed. fine. well done", opts: [
        { tone: 'cold', t: "Get a hobby.", r: "you are my hobby. fine. i'll take up knitting. badly" },
        { tone: 'passive', t: "Thanks. Glad you're watching.", r: "always. you're very watchable" },
        { tone: 'flirty', t: "Obsessed is good.", r: "obsessed is great. mm. come over and be obsessed back" },
      ] },
      { tone: 'passive', t: "That's quite the compliment.", r: "it's the highest compliment i have. my balcony is very good", opts: [
        { tone: 'cold', t: "It's just a view.", r: "just a view. it's the best view. fine. you'll understand one day" },
        { tone: 'passive', t: "I'd like to see it.", r: "you will. at night. it's best at night" },
        { tone: 'flirty', t: "Show me the balcony. I'll show you the podium.", r: "a trade. mm. a very tempting trade" },
      ] },
      { tone: 'flirty', t: "Your secret's safe. Celebrate with me?", r: "with you. mm. yes. tell me where. i'll wear something podium-worthy", opts: [
        { tone: 'cold', t: "Maybe not this week.", r: "not this week. fine. next. i'll still be dressed up" },
        { tone: 'passive', t: "Dinner? My treat.", r: "your treat. lovely. i'll order dessert just to watch you" },
        { tone: 'flirty', t: "Wear something I can't look away from.", r: "you never can anyway. i'll make it even harder" },
      ] },
    ] },
  // ==== points 1 ====
  { id: 'flirtatious-text-points-any-1-cold', on: 'points', stage: 'any', slot: 1, mood: 'cold',
    say: "points. respectable. like you were with me. a bit too respectable. well done anyway",
    opts: [
      { tone: 'cold', t: "Respectable's fine.", r: "fine. respectable. i'll be respectable back. thrilling" },
      { tone: 'passive', t: "Thanks. Solid weekend.", r: "solid. you're very solid. it's very reassuring" },
      { tone: 'flirty', t: "Respectable? I'll do better. Both.", r: "both. mm. good. i'll hold you to it, trouble" },
    ] },
  { id: 'flirtatious-text-points-any-1-passive', on: 'points', stage: 'any', slot: 1, mood: 'passive',
    say: "{result}! points on the board. i was watching. you were very focused. it was very attractive",
    opts: [
      { tone: 'cold', t: "It's not a podium.", r: "it's points. take them. i'd take them. i'd take you" },
      { tone: 'passive', t: "Thank you. It was a grind.", r: "a grind. you made it look easy. well done" },
      { tone: 'flirty', t: "Focused is attractive?", r: "on you, very. you frown at corners. it's devastating" },
    ] },
  { id: 'flirtatious-text-points-any-1-flirty', on: 'points', stage: 'any', slot: 1, mood: 'flirty',
    say: "{result}. points AND looking like that? greedy. well done, trouble 😏",
    opts: [
      { tone: 'cold', t: "It was just points.", r: "just points. you're very modest. it's not as charming as you think" },
      { tone: 'passive', t: "Thanks! Decent day.", r: "decent. you were more than decent. i'd know. i watched" },
      { tone: 'flirty', t: "Greedy's my thing.", r: "greedy's my thing too. we'll fight over it" },
    ] },
  // ==== points 2 ====
  { id: 'flirtatious-text-points-any-2-cold', on: 'points', stage: 'any', slot: 2, mood: 'cold',
    say: "points again. steady. like your frost. i'd prefer something warmer. but well done",
    opts: [
      { tone: 'cold', t: "Steady's good.", r: "steady's good. boring, but good. well done" },
      { tone: 'passive', t: "Thanks. I'll warm up.", r: "warm up. on and off track. please" },
      { tone: 'flirty', t: "Warmer next time. Promise.", r: "promise. mm. i'll collect" },
    ] },
  { id: 'flirtatious-text-points-any-2-passive', on: 'points', stage: 'any', slot: 2, mood: 'passive',
    say: "more points. you're quietly racking them up. i like quiet competence. it's sneaky",
    opts: [
      { tone: 'cold', t: "It's not sneaky. It's racing.", r: "it's sneaky racing. i've decided" },
      { tone: 'passive', t: "Thanks. Building up.", r: "building up. good. i'll be here when it's built" },
      { tone: 'flirty', t: "Sneaky's my secret weapon.", r: "it's working. on the points. and on me" },
    ] },
  { id: 'flirtatious-text-points-any-2-flirty', on: 'points', stage: 'any', slot: 2, mood: 'flirty',
    say: "points again. you know what that means? i get to text you congratulations again. my favourite excuse",
    opts: [
      { tone: 'cold', t: "You don't need an excuse.", r: "i know. i like having one. it makes me look less desperate" },
      { tone: 'passive', t: "Always nice to hear from you.", r: "always nice to say. well done" },
      { tone: 'flirty', t: "Text me without an excuse.", r: "without an excuse. mm. dangerous. i'd never stop" },
    ] },
  // ==== points 3 ====
  { id: 'flirtatious-text-points-any-3-cold', on: 'points', stage: 'any', slot: 3, mood: 'cold',
    say: "points. again. you're very consistent. i've decided i like consistent. not that you deserve it",
    opts: [
      { tone: 'cold', t: "Deserve what?", r: "my liking you. you're cold and consistent. i like it anyway" },
      { tone: 'passive', t: "Thanks. Consistency matters.", r: "it does. well done" },
      { tone: 'flirty', t: "I'll deserve it. Watch me.", r: "i'm watching. i always am" },
    ] },
  { id: 'flirtatious-text-points-any-3-passive', on: 'points', stage: 'any', slot: 3, mood: 'passive',
    say: "points again! you're a machine. a gorgeous, slightly stubborn machine",
    opts: [
      { tone: 'cold', t: "Not a machine.", r: "not a machine. a person. a stubborn one. well done anyway" },
      { tone: 'passive', t: "Thank you! Grinding away.", r: "grinding. i like the grind. it suits you" },
      { tone: 'flirty', t: "Gorgeous machine. I'll take it.", r: "take it. it's true. i'll say it every race" },
    ] },
  { id: 'flirtatious-text-points-any-3-flirty', on: 'points', stage: 'any', slot: 3, mood: 'flirty',
    say: "points again. your consistency is a turn-on. there, i said it. congratulations 🔥",
    opts: [
      { tone: 'cold', t: "That's an odd thing to say.", r: "it's not odd. it's honest. fine. congratulations. coldly" },
      { tone: 'passive', t: "Ha. Thanks.", r: "you're welcome. i mean it. both parts" },
      { tone: 'flirty', t: "I'll stay consistent, then.", r: "please do. for science" },
    ] },
  // ==== bad 1 ====
  { id: 'flirtatious-text-bad-any-1-cold', on: 'bad', stage: 'any', slot: 1, mood: 'cold',
    say: "rough race. i'd be smug about it but i'm not that cruel. you'll be fine. you always are",
    opts: [
      { tone: 'cold', t: "Not in the mood.", r: "okay. i'll leave you. one thing: you were still the best thing on screen" },
      { tone: 'passive', t: "Thanks. It was awful.", r: "awful. i know. next one's yours. i'm certain" },
      { tone: 'flirty', t: "Cheer me up?", r: "cheer you up. mm. you'll have to come here for that" },
    ] },
  { id: 'flirtatious-text-bad-any-1-passive', on: 'bad', stage: 'any', slot: 1, mood: 'passive',
    say: "{result}. not your day. i saw your face after. come here and let me distract you",
    opts: [
      { tone: 'cold', t: "I don't want distracting.", r: "fine. i'll be quiet. i'm here if you change your mind" },
      { tone: 'passive', t: "Thanks. Need some time.", r: "take it. i'll wait. when you're ready" },
      { tone: 'flirty', t: "Distract me. Please.", r: "please. mm. i love please. come over. i'll be very distracting" },
    ] },
  { id: 'flirtatious-text-bad-any-1-flirty', on: 'bad', stage: 'any', slot: 1, mood: 'flirty',
    say: "bad race. still gorgeous. those two things aren't connected. you'll get them next time. i'll be watching 😏",
    opts: [
      { tone: 'cold', t: "Not now.", r: "not now. okay. i'll save the gorgeous for later" },
      { tone: 'passive', t: "Thanks. I needed that.", r: "you're welcome. i'm very good at needed things" },
      { tone: 'flirty', t: "Gorgeous will do for today.", r: "gorgeous will always do. next time, gorgeous and fast" },
    ] },
  // ==== bad 2 (two exchanges) ====
  { id: 'flirtatious-text-bad-any-2-cold', on: 'bad', stage: 'any', slot: 2, mood: 'cold',
    say: "another bad one. i'm not gloating. i'm sitting here wishing i could fix it. it's very inconvenient",
    opts: [
      { tone: 'cold', t: "You can't.", r: "i know i can't. i still want to. let me want to", opts: [
        { tone: 'cold', t: "Want quietly.", r: "quietly. okay. i'm here. silently. gorgeous. waiting" },
        { tone: 'passive', t: "Okay. Thanks for that.", r: "you're welcome. it'll turn. it always does" },
        { tone: 'flirty', t: "Fix it in person.", r: "in person. mm. i'm a very good fixer. come over" },
      ] },
      { tone: 'passive', t: "Thanks. It's been a tough run.", r: "tough. i know. you're tougher. i've seen", opts: [
        { tone: 'cold', t: "I'm not feeling tough.", r: "you don't have to feel it. you are it. i'll feel it for you" },
        { tone: 'passive', t: "Thank you. That helps.", r: "good. i'll keep helping. it's a talent" },
        { tone: 'flirty', t: "You're really good at this.", r: "at you? i'm getting very good at you" },
      ] },
      { tone: 'flirty', t: "Inconvenient? You're sweet.", r: "i'm not sweet. i'm invested. it's much worse", opts: [
        { tone: 'cold', t: "Don't be invested.", r: "too late. i'm invested. deal with it" },
        { tone: 'passive', t: "Invested is nice.", r: "invested is terrifying. but yes. nice" },
        { tone: 'flirty', t: "Invest some more.", r: "more. mm. i'll put everything on you. i always do" },
      ] },
    ] },
  { id: 'flirtatious-text-bad-any-2-passive', on: 'bad', stage: 'any', slot: 2, mood: 'passive',
    say: "another tough one. you looked so frustrated. i wanted to reach through the screen and hug you",
    opts: [
      { tone: 'cold', t: "I'm fine. Really.", r: "you're not. but okay. i'll pretend you're fine. you pretend i'm not worried", opts: [
        { tone: 'cold', t: "Fine. Deal.", r: "deal. i'm terrible at pretending. you'll see" },
        { tone: 'passive', t: "Okay. I'm not fine.", r: "i know. come here. not literally. unless you want to" },
        { tone: 'flirty', t: "Hug me in person, then.", r: "in person. mm. a long one. no rush" },
      ] },
      { tone: 'passive', t: "I could use a hug.", r: "then come and get one. i give the best hugs. ask anyone. don't ask anyone", opts: [
        { tone: 'cold', t: "Maybe tomorrow.", r: "tomorrow. okay. the hug will wait. so will i" },
        { tone: 'passive', t: "On my way over.", r: "good. door's open. kettle's on" },
        { tone: 'flirty', t: "Best hugs? Prove it.", r: "prove it. mm. i'll hold on until you forget the race" },
      ] },
      { tone: 'flirty', t: "Reach through. I'll meet you halfway.", r: "halfway. mm. that's very romantic for a bad day", opts: [
        { tone: 'cold', t: "It's just a bad day.", r: "just a bad day. and you're just gorgeous. both true" },
        { tone: 'passive', t: "Thanks. It helps.", r: "good. i'm here. always" },
        { tone: 'flirty', t: "Make it a good night instead.", r: "a good night. mm. i can do that. very easily" },
      ] },
    ] },
  { id: 'flirtatious-text-bad-any-2-flirty', on: 'bad', stage: 'any', slot: 2, mood: 'flirty',
    say: "bad race. good face. i've decided the second cancels out the first. come here and let me prove it 😏",
    opts: [
      { tone: 'cold', t: "Another night.", r: "another night. fine. the face will still be good tomorrow", opts: [
        { tone: 'cold', t: "Probably.", r: "probably. definitely. i'll be here" },
        { tone: 'passive', t: "Tomorrow. Promise.", r: "tomorrow. good. i've written it down" },
        { tone: 'flirty', t: "Prove it tomorrow.", r: "tomorrow. mm. i'll prove it twice" },
      ] },
      { tone: 'passive', t: "That's terrible logic.", r: "it's excellent logic. it's my logic. you'll come round", opts: [
        { tone: 'cold', t: "I won't come round.", r: "you will. eventually. i'm very persuasive" },
        { tone: 'passive', t: "Okay. It helps a bit.", r: "a bit is good. i'll make it a lot" },
        { tone: 'flirty', t: "Persuade me.", r: "in person. come over. i'll be very persuasive" },
      ] },
      { tone: 'flirty', t: "Prove it. I'm coming over.", r: "good. i'll be waiting. with a cure for bad races. it's me", opts: [
        { tone: 'cold', t: "Just for an hour.", r: "an hour. fine. i'll make it a very good hour" },
        { tone: 'passive', t: "Leaving now.", r: "leaving now. good. kettle's going on" },
        { tone: 'flirty', t: "Best cure there is.", r: "the best. i'm told. by me. constantly" },
      ] },
    ] },
  // ==== bad 3: making a habit of it ====
  { id: 'flirtatious-text-bad-any-3-cold', on: 'bad', stage: 'any', slot: 3, mood: 'cold',
    say: "bad race again. i'm not saying anything. just this: you're still you. that's enough",
    opts: [
      { tone: 'cold', t: "Doesn't feel like it.", r: "it doesn't have to feel like it. it is. goodnight, trouble" },
      { tone: 'passive', t: "Thanks. That means something.", r: "good. it's meant to" },
      { tone: 'flirty', t: "Still me. Still yours to look at.", r: "still mine to look at. mm. good. that's all i need" },
    ] },
  { id: 'flirtatious-text-bad-any-3-passive', on: 'bad', stage: 'any', slot: 3, mood: 'passive',
    say: "another rough one. making a habit of it, are we? you'll turn it round. you always do. i've seen you",
    opts: [
      { tone: 'cold', t: "Don't remind me.", r: "okay. i won't. i'll just believe in you quietly" },
      { tone: 'passive', t: "Thanks. I hope so.", r: "i know so. i'm never wrong. ask anyone" },
      { tone: 'flirty', t: "Turn it round with me tonight.", r: "tonight. mm. come over. we'll start with my sofa" },
    ] },
  { id: 'flirtatious-text-bad-any-3-flirty', on: 'bad', stage: 'any', slot: 3, mood: 'flirty',
    say: "bad race. third one. i'm not counting those. i'm counting days till you win again. not many 😏",
    opts: [
      { tone: 'cold', t: "Don't count anything.", r: "fine. i'll guess. not many" },
      { tone: 'passive', t: "Thanks. Keep counting.", r: "i will. on my fingers. like a fan" },
      { tone: 'flirty', t: "Count with me.", r: "with you. mm. three... two... one... win. there" },
    ] },
  // ==== dnf 1 (two exchanges): out of the race - are you okay? ====
  { id: 'flirtatious-text-dnf-any-1-cold', on: 'dnf', stage: 'any', slot: 1, mood: 'cold',
    say: "you didn't finish. are you okay? i'm still cross with you, but are you okay? answer that first",
    opts: [
      { tone: 'cold', t: "I'm fine. Leave it.", r: "okay. i'll leave it. i'm glad you're fine. that's all", opts: [
        { tone: 'cold', t: "Fine. Goodnight.", r: "goodnight. i'm here. if you want" },
        { tone: 'passive', t: "Sorry. I'm okay. Just gutted.", r: "gutted. i know. come here when you're ready" },
        { tone: 'flirty', t: "I'm better now you've texted.", r: "good. then i'll keep texting. all night if i have to" },
      ] },
      { tone: 'passive', t: "I'm okay. Car let me down.", r: "the car let you down. not you. i'm relieved. that's all i care about", opts: [
        { tone: 'cold', t: "I still lost.", r: "you lost a race. not me. not yourself. next one" },
        { tone: 'passive', t: "Thanks for checking.", r: "always. i'll always check" },
        { tone: 'flirty', t: "Come and make me feel better.", r: "i'm on my way. well. in my head. come here instead" },
      ] },
      { tone: 'flirty', t: "Okay now. Even better if you're nicer.", r: "nicer. fine. i'm very nice. you're okay. nothing else matters", opts: [
        { tone: 'cold', t: "Don't fuss.", r: "i won't fuss. i'll just think about you. quietly" },
        { tone: 'passive', t: "Thank you. Really, I'm fine.", r: "really. okay. good. i'll breathe again" },
        { tone: 'flirty', t: "Nice suits you.", r: "everything suits me. relief suits me best" },
      ] },
    ] },
  { id: 'flirtatious-text-dnf-any-1-passive', on: 'dnf', stage: 'any', slot: 1, mood: 'passive',
    say: "saw you stop. please tell me you're okay. i don't do worried. i'm doing worried",
    opts: [
      { tone: 'cold', t: "I'm fine. Don't worry.", r: "i'm going to worry. that's my choice. glad you're fine", opts: [
        { tone: 'cold', t: "Don't make it a big thing.", r: "it's a thing. a small, scared thing. it's gone now" },
        { tone: 'passive', t: "Thanks. It means a lot.", r: "good. i'll stop worrying. in an hour or so" },
        { tone: 'flirty', t: "Worried looks good on you.", r: "worried looks terrible on me. relief looks better. i'm relieved" },
      ] },
      { tone: 'passive', t: "I'm okay. I promise.", r: "you promise. okay. breathing. you scared me", opts: [
        { tone: 'cold', t: "It happens.", r: "it happens. i know. i don't have to like it" },
        { tone: 'passive', t: "Sorry for the scare.", r: "don't be sorry. be okay. that's all" },
        { tone: 'flirty', t: "Let me make the scare up to you.", r: "make it up. mm. come here. i need a hug. for me" },
      ] },
      { tone: 'flirty', t: "I'm fine. Are you?", r: "i'm better now. that was the longest minute of my life", opts: [
        { tone: 'cold', t: "Drama.", r: "drama. yes. you know me. i'm still glad you're fine" },
        { tone: 'passive', t: "I'm here. All good.", r: "all good. okay. i'm going to lie down now" },
        { tone: 'flirty', t: "Come and see for yourself.", r: "i will. the very next chance. i'll check thoroughly" },
      ] },
    ] },
  { id: 'flirtatious-text-dnf-any-1-flirty', on: 'dnf', stage: 'any', slot: 1, mood: 'flirty',
    say: "you didn't finish but you're fine, right? tell me you're fine. then tell me something nice. i've earned it",
    opts: [
      { tone: 'cold', t: "I'm fine.", r: "you're fine. good. the nice thing can wait. i'll wait", opts: [
        { tone: 'cold', t: "Nothing nice today.", r: "okay. i'll be nice for both of us. you're fine. that's my nice thing" },
        { tone: 'passive', t: "Okay. Thanks for checking in.", r: "always. i'll always check in" },
        { tone: 'flirty', t: "Fine. And you look nice from here.", r: "from where? you can't see me. ...okay. i'll take it" },
      ] },
      { tone: 'passive', t: "Fine. Gutted, but fine.", r: "gutted is allowed. fine is all i need. here's my nice thing: you're brave", opts: [
        { tone: 'cold', t: "Not feeling brave.", r: "you are, though. feeling it is optional" },
        { tone: 'passive', t: "Thanks. I needed to hear that.", r: "good. i'll say it again whenever" },
        { tone: 'flirty', t: "Your nice things are my favourite.", r: "mine too. there's plenty more. in person" },
      ] },
      { tone: 'flirty', t: "Fine. And you're gorgeous. There.", r: "there. good. relief and a compliment. my perfect evening", opts: [
        { tone: 'cold', t: "Don't get used to compliments.", r: "too late. i'm used to them. i'll keep this one" },
        { tone: 'passive', t: "Better now?", r: "much better. thank you. go rest" },
        { tone: 'flirty', t: "More where that came from.", r: "then send them. all night. i'm awake" },
      ] },
    ] },
  // ==== dnf 2 ====
  { id: 'flirtatious-text-dnf-any-2-cold', on: 'dnf', stage: 'any', slot: 2, mood: 'cold',
    say: "another dnf. you're okay, yes? you were cold with me but i still checked. that's how it is",
    opts: [
      { tone: 'cold', t: "I'm okay.", r: "okay. good. that's all i needed" },
      { tone: 'passive', t: "Fine. Thank you for asking.", r: "always. i'll always ask" },
      { tone: 'flirty', t: "Okay. And sorry for the cold.", r: "forgiven. glad you're okay. that matters more" },
    ] },
  { id: 'flirtatious-text-dnf-any-2-passive', on: 'dnf', stage: 'any', slot: 2, mood: 'passive',
    say: "out again? are you alright? i've stopped breathing until you reply. hurry up",
    opts: [
      { tone: 'cold', t: "Breathe. I'm fine.", r: "breathing. glad you're fine. that's all" },
      { tone: 'passive', t: "Alright. Frustrated, but alright.", r: "frustrated is fine. alright is better. text me later" },
      { tone: 'flirty', t: "Alright. Breathe for me.", r: "breathing. for you. mm. that's very romantic for a dnf" },
    ] },
  { id: 'flirtatious-text-dnf-any-2-flirty', on: 'dnf', stage: 'any', slot: 2, mood: 'flirty',
    say: "retired again. you okay, gorgeous? say yes. then say something that'll make me forget i was scared",
    opts: [
      { tone: 'cold', t: "Yes. Busy now.", r: "busy. fine. yes is all i needed. go" },
      { tone: 'passive', t: "Yes. Thanks for asking.", r: "always. glad you're okay" },
      { tone: 'flirty', t: "Yes. And I miss your face.", r: "my face misses you too. come and see it" },
    ] },
  // ==== dnf 3: a habit of scaring them ====
  { id: 'flirtatious-text-dnf-any-3-cold', on: 'dnf', stage: 'any', slot: 3, mood: 'cold',
    say: "third time out. i'm not cross about it. i'm cross that i care this much. are you okay?",
    opts: [
      { tone: 'cold', t: "Fine. Same as always.", r: "same as always. good. i'll stop caring. tomorrow" },
      { tone: 'passive', t: "I'm okay. Thanks for caring.", r: "i always care. that's the problem" },
      { tone: 'flirty', t: "I'm okay. Keep caring.", r: "keep caring. mm. i don't have a choice" },
    ] },
  { id: 'flirtatious-text-dnf-any-3-passive', on: 'dnf', stage: 'any', slot: 3, mood: 'passive',
    say: "another dnf. you're making a habit of scaring me. make a habit of finishing instead. are you okay?",
    opts: [
      { tone: 'cold', t: "Not a habit I chose.", r: "no. i know. okay. glad you're alright" },
      { tone: 'passive', t: "I'm okay. Next time.", r: "next time. i'll be watching. with my eyes open. mostly" },
      { tone: 'flirty', t: "Okay. I'll finish next time. For you.", r: "for me. mm. finish for me and i'll make it worth it" },
    ] },
  { id: 'flirtatious-text-dnf-any-3-flirty', on: 'dnf', stage: 'any', slot: 3, mood: 'flirty',
    say: "out again. this is becoming a pattern and i hate patterns i didn't choose. tell me you're fine, trouble",
    opts: [
      { tone: 'cold', t: "I'm fine. Stop asking.", r: "okay. i'll stop. i'm still glad" },
      { tone: 'passive', t: "Fine. Thanks for being there.", r: "always there. it's my favourite place" },
      { tone: 'flirty', t: "Fine. Choose a better pattern with me.", r: "a better pattern. mm. you, me, sundays. that's a pattern i like" },
    ] },
];
