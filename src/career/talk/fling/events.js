// FLING - the phone: the first text, the day after a date, and after your race. Plain data, no imports.
export const DATA = [
  {
    id: 'fling-text-met-new-1-cold', on: 'met', stage: 'new', slot: 1, mood: 'cold',
    say: "it's {first}. we met. you were a bit chilly. i liked it. i'm texting at 1am because that's the only time i text",
    opts: [
      { tone: 'cold', t: "How did you get my number?", r: "i asked. nicely. i'm very good at asking nicely after dark", opts: [
        { tone: 'cold', t: "Don't text me at 1am.", r: "noted. i'll text at 1:05. kidding. a bit. sleep well, ice cube" },
        { tone: 'passive', t: "Okay. Hi, {first}.", r: "hi. that's it. that was the test. you passed. barely. well done" },
        { tone: 'flirty', t: "Glad you asked.", r: "glad. look at that. a 1am glad. i'll keep it. i'll lose it. i'll keep it" },
      ] },
      { tone: 'passive', t: "Hi. Do you always text this late?", r: "always. daytime texts are for dentists and mums. night texts are for people you want to see again", opts: [
        { tone: 'cold', t: "I'm not sure you'll see me again.", r: "you will. people always see me again. i'm everywhere. usually late" },
        { tone: 'passive', t: "Noted, then.", r: "it is good to know. now you know when to expect me. never. and then 1am" },
        { tone: 'flirty', t: "Then I'm glad you want to.", r: "i didn't say want. i said text. ok i said want. it's late. i'm allowed" },
      ] },
      { tone: 'flirty', t: "Chilly? I was playing it cool.", r: "cool. right. you were cool for about four seconds and then you smiled. i saw it", opts: [
        { tone: 'cold', t: "I don't remember smiling.", r: "you did. tiny one. corner of the mouth. i'm an expert in corners" },
        { tone: 'passive', t: "Fine. I smiled.", r: "fine. you smiled. i smiled back. we're two smilers. this is spiralling" },
        { tone: 'flirty', t: "I'm smiling now.", r: "stop. now i'm smiling at my phone at 1am like an idiot. you did this" },
      ] },
    ],
  },
  {
    id: 'fling-text-met-new-1-passive', on: 'met', stage: 'new', slot: 1, mood: 'passive',
    say: "hi. it's {first}. we met. you were nice. i'm not usually into nice. i'm making an exception. don't get too used to me",
    opts: [
      { tone: 'cold', t: "Who is this?", r: "rude. the fun one. the one with the exit strategy. you remember. everyone remembers", opts: [
        { tone: 'cold', t: "Doesn't ring a bell.", r: "ha. liar. it rings several bells. loud ones. i'll text again when you're feeling honest" },
        { tone: 'passive', t: "Oh. Hi.", r: "hi. there it is. recognition. i'll take it. i'll take anything at this hour" },
        { tone: 'flirty', t: "The fun one. Of course.", r: "of course. good answer. very good answer. you'll do well with me" },
      ] },
      { tone: 'passive', t: "Hi! Nice to hear from you.", r: "nice. there's that word again. you're very nice. i'm going to corrupt you. slowly", opts: [
        { tone: 'cold', t: "I don't corrupt easily.", r: "everyone says that. it's my favourite thing people say. it's never true" },
        { tone: 'passive', t: "Corrupt me how?", r: "late nights. last-minute plans. texts like this. that's mostly it. i'm not a criminal" },
        { tone: 'flirty', t: "I'd like to see you try.", r: "oh i'll try. i'll try so hard. you have no idea. well. you have some idea now" },
      ] },
      { tone: 'flirty', t: "An exception? I'm honoured.", r: "you should be. my exceptions are rare and short-lived. enjoy it while it lasts", opts: [
        { tone: 'cold', t: "How long will it last?", r: "a week. a month. who knows. i never know. that's the fun part. for me anyway" },
        { tone: 'passive', t: "I'll enjoy it, then.", r: "good. enjoy it. don't analyse it. analysis kills exceptions. i've seen it happen" },
        { tone: 'flirty', t: "I'll make it last.", r: "you'll try. people always try. you might be good at it. you've got a lasting kind of face" },
      ] },
    ],
  },
  {
    id: 'fling-text-met-new-1-flirty', on: 'met', stage: 'new', slot: 1, mood: 'flirty',
    say: "hi. it's {first}. i couldn't stop thinking about you so i got your number. that's not stalking. that's initiative",
    opts: [
      { tone: 'cold', t: "That's a bit much.", r: "a bit much is my default setting. you'll adjust. or you won't. both are fine", opts: [
        { tone: 'cold', t: "Tone it down.", r: "toned. this is me toned. it's not very different. i'm working with what i've got" },
        { tone: 'passive', t: "Okay. Initiative. I'll allow it.", r: "thank you. i'm very initiative-y. especially at night. you'll see" },
        { tone: 'flirty', t: "I like a bit much.", r: "oh no. that's the wrong thing to say to me. i'll be so much. i'll be a lot" },
      ] },
      { tone: 'passive', t: "What were you thinking about?", r: "your face, mostly. your laugh. the way you looked at me. i saw that", opts: [
        { tone: 'cold', t: "I was just tired.", r: "tired. ok. tired looks good on you. most people look like soup. you look like a film" },
        { tone: 'passive', t: "It was a good night.", r: "it was. short and good. my favourite kind. we should do a longer one. no. a short one. again" },
        { tone: 'flirty', t: "I was thinking about you too.", r: "ugh. mutual. mutual's dangerous. mutual's how it starts. i'm very into how it starts" },
      ] },
      { tone: 'flirty', t: "Initiative suits you.", r: "everything suits me. but thank you. i'll take initiative again soon. probably at 2am", opts: [
        { tone: 'cold', t: "Not at 2am.", r: "2:15 then. compromise. relationships are about compromise. not that this is a relationship" },
        { tone: 'passive', t: "I'll keep my phone on.", r: "on and loud. i'm a loud texter. lots of little buzzes. like a bee. a cute bee" },
        { tone: 'flirty', t: "I'll be awake.", r: "you say that. i'll test it. tonight maybe. or tomorrow. i'll surprise you" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-warm-1-cold', on: 'date', stage: 'warm', slot: 1, mood: 'cold',
    say: "ok last night was fun. even with you being a bit guarded. i don't do day-after texts. this is a day-after text. weird",
    opts: [
      { tone: 'cold', t: "It was fine.", r: "fine?? i was delightful. you were fine. together we were very fine. ok it was more than fine", opts: [
        { tone: 'cold', t: "It was fine. Really.", r: "ok. fine. i'll take fine. i'll try to be better than fine next time. i'll be outstanding" },
        { tone: 'passive', t: "Okay. It was nice.", r: "nice. better. i'll take nice. nice is fine's cooler cousin" },
        { tone: 'flirty', t: "It was more than fine.", r: "there it is. i knew it. i'm always right about these things. well. usually" },
      ] },
      { tone: 'passive', t: "Why don't you do day-after texts?", r: "because they mean something. day-after texts are for people who want a day after. i don't. i didn't", opts: [
        { tone: 'cold', t: "Then why send one?", r: "i don't know. i woke up. i thought about it. i texted. i'm a mystery to myself too" },
        { tone: 'passive', t: "I'm glad you made an exception.", r: "me too. don't tell anyone. i've got a reputation to keep. a very cool one" },
        { tone: 'flirty', t: "Maybe you want a day after.", r: "maybe. a little day after. a small one. don't make it a whole day. half a day" },
      ] },
      { tone: 'flirty', t: "I had fun too.", r: "you did? good. that's the entire idea. fun. just fun. no analysing it. just fun", opts: [
        { tone: 'cold', t: "Let's not analyse it.", r: "agreed. no analysis. it was a night. it was good. done. filed. moving on. thinking about it" },
        { tone: 'passive', t: "Let's do it again.", r: "again. oh. okay. soon. not too soon. soon-ish. i'll text you. late. obviously" },
        { tone: 'flirty', t: "I keep thinking about it.", r: "stop. i keep thinking about it too. this is very inconvenient for both of us" },
        { tone: 'risque', t: "Next time, end it at mine.", r: "at yours. hm. bold. i like bold. i'll consider it very carefully. i'm considering it now" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-warm-1-passive', on: 'date', stage: 'warm', slot: 1, mood: 'passive',
    say: "morning. well. afternoon. i just woke up. last night was really fun. that's the text. no reading between the lines",
    opts: [
      { tone: 'cold', t: "No reading into it. Promise.", r: "good. thank you. you're the only person who never reads into anything. it's very relaxing", opts: [
        { tone: 'cold', t: "It's just a text.", r: "exactly. a text about a nice night. nothing more. it's very nothing" },
        { tone: 'passive', t: "Did you have fun?", r: "i said so. i had lots of fun. too much fun, maybe. that doesn't exist. there might be" },
        { tone: 'flirty', t: "I'll read into it a little.", r: "a little is allowed. the rules say a little. well, my rules say nothing. but a little" },
      ] },
      { tone: 'passive', t: "It was really fun.", r: "it was, wasn't it? we're good at fun. that's our thing. fun. lots of fun. no other things", opts: [
        { tone: 'cold', t: "No other things?", r: "no. well. maybe a small other thing. i'm not saying what. it's very small. microscopic" },
        { tone: 'passive', t: "Agreed. Our thing.", r: "our thing. ok. we have a thing. the thing is fun. that's fine. that's a fine thing to have" },
        { tone: 'flirty', t: "Maybe some other things.", r: "some other things. ok. we'll see. i'm open to a few. small ones. soon" },
        { tone: 'risque', t: "The end of the night was my favourite.", r: "ha. mine too. obviously. you were very good at the end. come back for more ends" },
      ] },
      { tone: 'flirty', t: "I haven't stopped thinking about it.", r: "stop. i've been thinking about it since i woke up. which was 20 minutes ago. still", opts: [
        { tone: 'cold', t: "Okay, I've stopped.", r: "good. great. now i'm the only one thinking about it. that's not fair" },
        { tone: 'passive', t: "It was a really good night.", r: "it was a great night. good is too small. great. there. i said great" },
        { tone: 'flirty', t: "When can I see you again?", r: "soon. late. you know me. i'll text when i'm bored. i'm bored already. i'll text tonight" },
        { tone: 'risque', t: "Come over and I'll show you what I'm thinking.", r: "ha. show me. you're dangerous after a nice night. i'm dressing. no i'm not" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-warm-1-flirty', on: 'date', stage: 'warm', slot: 1, mood: 'flirty',
    say: "hi you. last night. wow. ok. i'm not going to be soppy about it. i'm just going to say wow and leave it there. wow",
    opts: [
      { tone: 'cold', t: "It was okay.", r: "okay?? wow and okay. we had very different nights. i'll make mine better next time. yours i mean", opts: [
        { tone: 'cold', t: "Just okay, honestly.", r: "honest. ok. i respect honest. next time i'll be unforgettable. watch me" },
        { tone: 'passive', t: "Okay, it was good.", r: "good. better. much better. i'll take good and improve it to wow" },
        { tone: 'flirty', t: "Fine. Wow.", r: "there. wow. both wows. now we're both soppy. i hate this. i love this" },
      ] },
      { tone: 'passive', t: "What does wow mean, exactly?", r: "wow means i had more fun than i planned to. i always plan fun. i didn't plan that much", opts: [
        { tone: 'cold', t: "Sounds like regret.", r: "not regret. never regret. i don't do regret. i do 'oh no, i liked that'" },
        { tone: 'passive', t: "I had more fun than planned too.", r: "good. we both overshot. that's what happens with us. we overshoot" },
        { tone: 'flirty', t: "It means you want more.", r: "it might mean that. it might mean exactly that. i'll tell you at 1am" },
        { tone: 'risque', t: "Wow means come back tonight.", r: "it might. it does. ugh. you've decoded me. i'll be there late" },
      ] },
      { tone: 'flirty', t: "Wow is right.", r: "wow is right. wow is very right. we should do a sequel. sequels are never as good. we'll be the exception", opts: [
        { tone: 'cold', t: "Let's not overdo it.", r: "agreed. no overdoing. we'll do the exact right amount of doing. later" },
        { tone: 'passive', t: "I'd like a sequel.", r: "a sequel. ok. i'll write it. it'll be late. it'll be better. it'll have a twist" },
        { tone: 'flirty', t: "Wow, and then some.", r: "and then some. ok you're making me blush and i don't blush. this is so embarrassing" },
        { tone: 'risque', t: "Sequel tonight? Same ending?", r: "same ending. hm. i liked the ending. very much. ok. tonight. same ending. maybe more" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-warm-2-cold', on: 'date', stage: 'warm', slot: 2, mood: 'cold',
    say: "fun night. you were quiet at the start but you warmed up. i'm very warming. it's a gift. anyway. hi",
    opts: [
      { tone: 'cold', t: "I wasn't quiet.", r: "you were a bit quiet. it's fine. quiet's sexy. on you. not on me. i'm never quiet" },
      { tone: 'passive', t: "You're very warming, yes.", r: "i know. i'm like a radiator. a cute radiator. with a slight rattle" },
      { tone: 'flirty', t: "I warmed up because of you.", r: "i know. i noticed. i'm very good at noticing when it's about me" },
      { tone: 'risque', t: "Warm me up again tonight?", r: "tonight. ha. you're keen. i like keen. let me think. i've thought. maybe" },
    ],
  },
  {
    id: 'fling-text-date-warm-2-passive', on: 'date', stage: 'warm', slot: 2, mood: 'passive',
    say: "that was nice. really nice. i'm surprised. i'm not usually surprised. i'll be back to normal by tonight",
    opts: [
      { tone: 'cold', t: "What's normal for you?", r: "unbothered. breezy. late. right now i'm bothered. pleasantly bothered. it'll pass" },
      { tone: 'passive', t: "I'm glad you enjoyed it.", r: "i did. a lot. a normal lot. not an abnormal lot. ok an abnormal lot" },
      { tone: 'flirty', t: "I hope you're not back to normal.", r: "ugh. you hope. stop hoping. i'm hoping too. this is a hoping crisis" },
      { tone: 'risque', t: "I hope tonight's even nicer.", r: "tonight. you're planning tonight already. i'm planning tonight already. ok" },
    ],
  },
  {
    id: 'fling-text-date-warm-2-flirty', on: 'date', stage: 'warm', slot: 2, mood: 'flirty',
    say: "i'm still smiling. that's your fault. i'm going to be smiling all day like an idiot. thanks for that",
    opts: [
      { tone: 'cold', t: "You'll get over it.", r: "i will. i always do. but i'll enjoy not being over it for a few hours" },
      { tone: 'passive', t: "What are you smiling about?", r: "you. last night. the bit where you looked at me like that. you know the bit" },
      { tone: 'flirty', t: "I'm smiling too.", r: "stop. two smilers. this is a public health issue. we need to be stopped" },
      { tone: 'risque', t: "Come over and smile at me in person.", r: "in person. ok. that's a much better idea than smiling at a wall. coming. later" },
    ],
  },
  {
    id: 'fling-text-date-warm-3-cold', on: 'date', stage: 'warm', slot: 3, mood: 'cold',
    say: "you were a bit cool with me last night. and i still had fun. i'm confused. i'm never confused. fix it",
    opts: [
      { tone: 'cold', t: "How do I fix it?", r: "i don't know. be less cool. or more cool. be the same. it worked. that's the confusing bit" },
      { tone: 'passive', t: "I had a good time too.", r: "it was. it was very good. that's what's confusing. i'm used to good nights. this was different" },
      { tone: 'flirty', t: "Let me fix it tonight.", r: "tonight. fix me tonight. ha. that's a bold offer. i accept. i might accept" },
      { tone: 'risque', t: "I'll un-confuse you at mine.", r: "at yours. you're very good at offers. ok. maybe. confusion's fun though" },
    ],
  },
  {
    id: 'fling-text-date-warm-3-passive', on: 'date', stage: 'warm', slot: 3, mood: 'passive',
    say: "we keep doing this. i don't do keep doing. i'm in uncharted territory. it's very scary. it's fine",
    opts: [
      { tone: 'cold', t: "Only a night, really.", r: "you're right. one night. another night. it's fine. very fine" },
      { tone: 'passive', t: "Is uncharted bad?", r: "not bad. new. new things are exciting and terrifying. like you. you're exciting and terrifying" },
      { tone: 'flirty', t: "I like uncharted territory.", r: "naturally you do. you drive into corners at 200 miles an hour. you're not normal" },
      { tone: 'risque', t: "Let's chart it together tonight.", r: "chart it. ha. you're so cheesy. i love cheesy. ok. tonight. bring a map" },
    ],
  },
  {
    id: 'fling-text-date-warm-3-flirty', on: 'date', stage: 'warm', slot: 3, mood: 'flirty',
    say: "another one. ugh. that's a pattern. patterns are dangerous. i'm going to ignore it and just say: that was great",
    opts: [
      { tone: 'cold', t: "Don't call them dates.", r: "fine. nights. hangs. encounters. very good encounters" },
      { tone: 'passive', t: "It was great.", r: "it was. it was really great. we should stop. we shouldn't stop. we'll stop next time" },
      { tone: 'flirty', t: "Then let's make it a habit.", r: "a habit. oh no. patterns are fine. habits are relationships. half a habit. a hobby" },
      { tone: 'risque', t: "Another, starting tonight.", r: "tonight. you're relentless. i like relentless. i'll be there. i'm always there. late" },
    ],
  },
  {
    id: 'fling-text-date-close-1-cold', on: 'date', stage: 'close', slot: 1, mood: 'cold',
    say: "you were a bit far away last night. i noticed. i still loved seeing you. i'm allowed to say loved. as a verb. not a noun",
    opts: [
      { tone: 'cold', t: "Loved?", r: "as a verb. like i loved the weather. i loved the night. i didn't say anything else. calm down", opts: [
        { tone: 'cold', t: "I'm calm.", r: "good. me too. very calm. i used a big word. i'll use a small one next time. liked" },
        { tone: 'passive', t: "I loved seeing you too. As a verb.", r: "as a verb. ok. we both loved. as verbs. this is fine. totally fine" },
        { tone: 'flirty', t: "Say it as a noun next time.", r: "no. never. not as a noun. ok maybe once. at 3am. don't screenshot it" },
        { tone: 'risque', t: "Love me as a verb again tonight.", r: "ha. you're filthy. not filthy. clever. ok. tonight. as many verbs as you like" },
      ] },
      { tone: 'passive', t: "Sorry I was distant.", r: "it's ok. you're allowed to be distant. i'm distant all the time. i just didn't like it when you did it", opts: [
        { tone: 'cold', t: "Now you know how it feels.", r: "i do. touché. that's fair. very fair. i'll be less distant. i'll try" },
        { tone: 'passive', t: "I'll be more present next time.", r: "present. like a gift. you'd be a very good gift. i'd unwrap you slowly" },
        { tone: 'flirty', t: "Nobody makes me as present as you.", r: "ok. that's nice. that's really nice. i'm keeping that one. i'm keeping a lot of your things" },
        { tone: 'risque', t: "I'll make it up to you in person.", r: "in person. how. don't answer. i know how. tonight. bring your best apologies" },
      ] },
      { tone: 'flirty', t: "Last night was perfect.", r: "perfect. careful. perfect's a big word too. we're using too many big words. it's getting serious", opts: [
        { tone: 'cold', t: "Fine. Pretty good.", r: "pretty good. better. much safer. pretty good is my comfort zone" },
        { tone: 'passive', t: "It was, though.", r: "it was, though. ugh. it was. it was perfect. i hate admitting things" },
        { tone: 'flirty', t: "It's getting serious. Good.", r: "good?? no. not good. good-ish. dangerous-good. stop it. don't stop it" },
        { tone: 'risque', t: "Let's be serious about tonight, then.", r: "tonight we can be very serious. about very unserious things. in the dark" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-close-1-passive', on: 'date', stage: 'close', slot: 1, mood: 'passive',
    say: "morning. well. it's 1pm. that's morning for me. last night was lovely. you were lovely. i'm not going to elaborate",
    opts: [
      { tone: 'cold', t: "Fine. Don't elaborate.", r: "thank you. elaborating is dangerous. it leads to adjectives. adjectives lead to feelings", opts: [
        { tone: 'cold', t: "Good. No adjectives.", r: "no adjectives. just facts. fact: it was a night. fact: i liked it. fact: you were there" },
        { tone: 'passive', t: "One adjective?", r: "one. ok. warm. it was warm. there. that's your lot. it was a warm night" },
        { tone: 'flirty', t: "I'll elaborate for both of us.", r: "please don't. ok please do. no. text me one word. just one" },
        { tone: 'risque', t: "Elaborate in person.", r: "in person. at night. with my hands. ok. that's a very good idea. you're very good at ideas" },
      ] },
      { tone: 'passive', t: "You were lovely too.", r: "stop. now we're both lovely. it's getting very lovely in here. open a window", opts: [
        { tone: 'cold', t: "Maybe I'll open a window.", r: "good. air. lots of air. we need air. we're being very lovely and it's stuffy" },
        { tone: 'passive', t: "What made it lovely?", r: "you. mostly you. the whole you. i'm stopping there. that's enough honesty for a monday" },
        { tone: 'flirty', t: "Lovely and then some.", r: "and then some. ok. you've done it again. you've made me smile at my phone. i'm a cliché" },
        { tone: 'risque', t: "I'll be lovely again tonight.", r: "tonight. you're presuming. you're correct. you'll be lovely at mine. late" },
      ] },
      { tone: 'flirty', t: "I can't stop thinking about it.", r: "neither can i. that's a problem. i'm meant to forget nights. i can't forget this one", opts: [
        { tone: 'cold', t: "Okay. I'll stop.", r: "don't stop on my account. i'm not stopping. i'll be thinking about it all day. annoyingly" },
        { tone: 'passive', t: "Me neither.", r: "good. we're both stuck. stuck's not so bad. stuck with you is quite nice actually" },
        { tone: 'flirty', t: "Then don't forget it.", r: "ok. i won't. i'll keep it. i'll keep it right here. next to all the other ones. there are a few" },
        { tone: 'risque', t: "Then let's make tonight unforgettable too.", r: "unforgettable. that's a lot of pressure. i love pressure. tonight. late. yours" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-close-1-flirty', on: 'date', stage: 'close', slot: 1, mood: 'flirty',
    say: "woke up thinking about you. never happens. i usually wake up thinking about coffee. you beat coffee. congrats",
    opts: [
      { tone: 'cold', t: "I'm honoured. I think.", r: "you should be honoured. coffee is my oldest love. you've beaten a seven-year relationship", opts: [
        { tone: 'cold', t: "Don't get rid of the coffee.", r: "never. coffee stays. you're a guest. a very good guest. a frequent guest" },
        { tone: 'passive', t: "I'll try not to get cocky.", r: "too late. you're already cocky. it's fine. it suits you" },
        { tone: 'flirty', t: "I woke up thinking about you too.", r: "ugh. we're both waking up thinking. that's a couple thing. we're not a couple. we're a waking-up thing" },
        { tone: 'risque', t: "Next time, wake up next to me.", r: "next to you. in the morning. oh. that's very close to breakfast. i'll consider it. i'm considering" },
      ] },
      { tone: 'passive', t: "What did you think about?", r: "your face. your voice. the way you said my name. stop. i'm stopping. i've said too much", opts: [
        { tone: 'cold', t: "That's a lot for one morning.", r: "it is. i'm a lot. i'm a lot in the mornings apparently. who knew" },
        { tone: 'passive', t: "I'm glad it was me.", r: "me too. i'm glad it was you. i'm glad it wasn't coffee. never tell coffee" },
        { tone: 'flirty', t: "Say my name like that again.", r: "i'll say it tonight. in person. i say it better in person" },
        { tone: 'risque', t: "Come over and think about me up close.", r: "up close. ok. you've convinced me. i'm very easy to talk into things. by you" },
      ] },
      { tone: 'flirty', t: "Coffee never stood a chance.", r: "it didn't. you're very good. i'm worried. i'm thrilled. i'm worried", opts: [
        { tone: 'cold', t: "Don't worry.", r: "ok. not worrying. thrilled only. thrilled and slightly worried. mostly thrilled" },
        { tone: 'passive', t: "It's okay to be both.", r: "it is? ok. i'm both. thrilled and worried. that's my new personality. you did this" },
        { tone: 'flirty', t: "Thrill you again tonight?", r: "again. tonight. yes. i want that. i'm saying yes before i can talk myself out of it" },
        { tone: 'risque', t: "I'll make sure you wake up thinking of me again.", r: "you will. you're very good at that. you're very good at lots of things" },
      ] },
    ],
  },
  {
    id: 'fling-text-date-close-2-cold', on: 'date', stage: 'close', slot: 2, mood: 'cold',
    say: "you went quiet on me by the end of last night. but you were sweet at goodbye. i'm keeping that bit. not the quiet",
    opts: [
      { tone: 'cold', t: "I was a bit worn out.", r: "tired. ok. tired you is still very good. better than most people awake" },
      { tone: 'passive', t: "I liked the goodbye.", r: "me too. i'm not a lingering-goodbye person. i'm one now apparently. your fault" },
      { tone: 'flirty', t: "Keep the goodbye. Forget the quiet.", r: "done. the quiet's gone. the goodbye's in a box. a nice box. a box i'll open later" },
      { tone: 'risque', t: "Next time, a much longer goodbye.", r: "ha. longer. you're cheeky when you're quiet. i like it. next time. promise. sort of" },
    ],
  },
  {
    id: 'fling-text-date-close-2-passive', on: 'date', stage: 'close', slot: 2, mood: 'passive',
    say: "last night was easy. that's the thing with you. it's easy. easy's dangerous. easy's how you end up with a drawer",
    opts: [
      { tone: 'cold', t: "It's just easy.", r: "it is just easy. that's all. easy. no drawers. no keys. just easy" },
      { tone: 'passive', t: "What's wrong with a drawer?", r: "nothing. a drawer is a drawer. then it's a shelf. then it's a wardrobe. then it's a flat" },
      { tone: 'flirty', t: "I'd like a drawer.", r: "stop. not yet. maybe a sock. one sock. you can leave one sock. that's my limit" },
      { tone: 'risque', t: "No drawer. Just stay over sometime.", r: "stay over sometime. ok. that's doable. that's not a drawer. that's a sleepover" },
    ],
  },
  {
    id: 'fling-text-date-close-2-flirty', on: 'date', stage: 'close', slot: 2, mood: 'flirty',
    say: "i keep thinking about the way you looked at me when we said goodnight. it was very unfair. i couldn't sleep",
    opts: [
      { tone: 'cold', t: "You'll sleep tonight.", r: "i won't. i'll be thinking about it again. you've ruined sleep for me" },
      { tone: 'passive', t: "How did I look at you?", r: "like it mattered. like you wanted more. i wanted more. i always want more with you" },
      { tone: 'flirty', t: "I couldn't sleep either.", r: "good. that's fair. we'll both be tired. tired together. that's very romantic" },
      { tone: 'risque', t: "Next time, let's not say goodnight at all.", r: "no goodnight. just good morning. hm. that's very bold. i like bold. very much" },
    ],
  },
  {
    id: 'fling-text-date-close-3-cold', on: 'date', stage: 'close', slot: 3, mood: 'cold',
    say: "i had a really good time. even if you were a bit off with me. i always have a good time with you. it's a pattern. ugh",
    opts: [
      { tone: 'cold', t: "Patterns are fine.", r: "they're not fine. they're dangerous. they become habits. you're becoming a habit" },
      { tone: 'passive', t: "What's wrong with patterns?", r: "patterns mean you'll want more. and i'll want more. and then we'll have to talk about it" },
      { tone: 'flirty', t: "I like being your pattern.", r: "i like you being my pattern too. that's the problem. that's always the problem" },
      { tone: 'risque', t: "Then let's keep the pattern going tonight.", r: "tonight. ok. same pattern. same ending. very good ending. late" },
    ],
  },
  {
    id: 'fling-text-date-close-3-passive', on: 'date', stage: 'close', slot: 3, mood: 'passive',
    say: "i keep coming back to you. that's the thing. i don't come back. i'm a leaver. but i come back to you. explain that",
    opts: [
      { tone: 'cold', t: "I can't explain it.", r: "neither can i. i've been trying. i've been up since noon trying. noon!" },
      { tone: 'passive', t: "Maybe you like me.", r: "maybe. maybe i do. maybe a lot. don't tell me. i'll know when i'm ready" },
      { tone: 'flirty', t: "I'm glad you come back.", r: "me too. i'll keep coming back. as long as you keep being you. that's the deal" },
      { tone: 'risque', t: "Come back tonight, then.", r: "tonight. you always know what to say. ok. back again. i'm a boomerang" },
    ],
  },
  {
    id: 'fling-text-date-close-3-flirty', on: 'date', stage: 'close', slot: 3, mood: 'flirty',
    say: "ok confession. i liked last night so much i almost asked you to breakfast. almost. i didn't. but almost",
    opts: [
      { tone: 'cold', t: "Breakfast's overrated.", r: "it is. it really is. i say that constantly. but i almost said it. that's new" },
      { tone: 'passive', t: "Almost is something.", r: "almost is a lot for me. almost is practically a proposal. i'm kidding. i'm not kidding" },
      { tone: 'flirty', t: "I'd come to breakfast.", r: "i know you would. that's why i didn't ask. if i ask, you'll say yes. then we're breakfast people" },
      { tone: 'risque', t: "Ask me next time. I'll say yes.", r: "i might. i might ask. at 3am. when i'm brave. and you're there. and it's dark" },
    ],
  },
  {
    id: 'fling-text-win-any-1-cold', on: 'win', stage: 'any', slot: 1, mood: 'cold',
    say: "you won. saw it. well, saw the highlights. i don't do sundays. you won though. that means a night out. tell me i'm right",
    opts: [
      { tone: 'cold', t: "I'm too tired for a night out.", r: "tired? you just won. tired is for losers. kidding. sort of. rest. then come out", opts: [
        { tone: 'cold', t: "I'll rest.", r: "rest. ok. rest is sensible. i hate sensible. congratulations anyway. properly. well done" },
        { tone: 'passive', t: "Maybe a quiet one.", r: "a quiet one. no such thing with me. but ok. a medium one. well done, by the way" },
        { tone: 'flirty', t: "Only if it's with you.", r: "only with me. good answer. the best answer. ok. tonight. we're celebrating" },
      ] },
      { tone: 'passive', t: "Thanks. It was a good day.", r: "a good day. you won {last}. that's not a good day. that's a great one. you're very modest. it's hot", opts: [
        { tone: 'cold', t: "It's just a race.", r: "only a race. like i'm just a person. we both know that's not true" },
        { tone: 'passive', t: "Thanks, {first}.", r: "you're welcome. i'm proud of you. i don't say that. i'm saying it. keep it casual" },
        { tone: 'flirty', t: "Celebrate with me?", r: "i was going to ask you. you asked me. that's annoying. yes. obviously. yes" },
      ] },
      { tone: 'flirty', t: "You're right. Night out. With you.", r: "look at that. a winner with good ideas. i'll find somewhere loud. you'll find me", opts: [
        { tone: 'cold', t: "Kidding. I'm staying in.", r: "boo. ok. stay in. i'll celebrate for you. loudly. with strangers. you'll get updates" },
        { tone: 'passive', t: "Just a couple of hours.", r: "a couple of hours. ha. sure. we'll see how many hours. i'm bad at counting hours" },
        { tone: 'flirty', t: "All night.", r: "all night. ok. you're very ambitious. winners. i'll be there. all night" },
      ] },
    ],
  },
  {
    id: 'fling-text-win-any-1-passive', on: 'win', stage: 'any', slot: 1, mood: 'passive',
    say: "you won!! i watched. well. i watched the end. the end was very good. you looked so happy. congrats",
    opts: [
      { tone: 'cold', t: "You watched?", r: "the end. the important bit. i'm not a start-to-finish person. you know that by now. maybe", opts: [
        { tone: 'cold', t: "That's kind of sweet.", r: "it's not sweet. it's convenient. i was awake. you were winning. sweet is too strong" },
        { tone: 'passive', t: "Thanks for watching.", r: "you're welcome. i'll watch more. maybe. if you keep winning. no pressure" },
        { tone: 'flirty', t: "I wish you'd been there.", r: "ugh. you wish. i wish too. i don't do race days. maybe i'd do one. one day" },
      ] },
      { tone: 'passive', t: "Thank you! It was a big one.", r: "big. huge. massive. you're massive now. well. not massive. very good. you were very good", opts: [
        { tone: 'cold', t: "It's just one win.", r: "it's one more than most people. take it. celebrate it. with me preferably" },
        { tone: 'passive', t: "It was a good feeling.", r: "it looked like a good feeling. you should feel that more. i'll make you feel it. later" },
        { tone: 'flirty', t: "Celebrate with me later?", r: "later. yes. late. tonight. we're going out. i'm not asking. i'm telling. you won" },
      ] },
      { tone: 'flirty', t: "You make it sound even better.", r: "i make everything sound better. it's my gift. that and showing up late", opts: [
        { tone: 'cold', t: "Don't overdo it.", r: "i always overdo it. that's my style. but ok. small congrats. tiny. well done" },
        { tone: 'passive', t: "You're very good at this.", r: "at what? cheering? i'm terrible at cheering. i'm good at celebrating after" },
        { tone: 'flirty', t: "Come celebrate with me, then.", r: "i will. tonight. i'll find somewhere. you'll find me. we'll be very loud" },
      ] },
    ],
  },
  {
    id: 'fling-text-win-any-1-flirty', on: 'win', stage: 'any', slot: 1, mood: 'flirty',
    say: "winner. look at you. i've never dated a winner. not that we're dating. i've never slept near a winner. ok stop. congrats",
    opts: [
      { tone: 'cold', t: "Not dating, no.", r: "no. absolutely not. we're... winning together. separately. congratulations", opts: [
        { tone: 'cold', t: "Thanks, anyway.", r: "anyway. you're welcome anyway. i'm very proud. anyway" },
        { tone: 'passive', t: "Fine. Thanks for the congrats.", r: "fine. you're welcome. i'll congratulate you properly later. if you're lucky" },
        { tone: 'flirty', t: "Winning together sounds good.", r: "it does sound good. too good. i'm backing away from the sentence slowly" },
      ] },
      { tone: 'passive', t: "Cheers, {first}.", r: "you're welcome. i'll congratulate you more in person. i'm better in person. you know that", opts: [
        { tone: 'cold', t: "Text's fine.", r: "text's fine. text's safe. text can't kiss you. fine. text" },
        { tone: 'passive', t: "In person sounds good.", r: "in person. tonight. late. you've earned it. i'll be your prize. kidding. i won't be. i might be" },
        { tone: 'flirty', t: "You're better than a trophy.", r: "ugh. that's so cheesy. i love it. i'm better than a trophy. i'll tell everyone" },
      ] },
      { tone: 'flirty', t: "Celebrate with me tonight?", r: "tonight. you're straight in. i like that. ok. we're celebrating. bring the winner's energy", opts: [
        { tone: 'cold', t: "Actually, I need sleep.", r: "sleep. after a win. you're a monk. a very attractive monk. sleep well, champ" },
        { tone: 'passive', t: "Just a quiet celebration.", r: "quiet. ha. i'll try. nothing about me is quiet. but i'll try for you" },
        { tone: 'flirty', t: "Somewhere loud. You choose.", r: "somewhere loud. ok. i know a place. i always know a place. see you at 11" },
      ] },
    ],
  },
  {
    id: 'fling-text-win-any-2-cold', on: 'win', stage: 'any', slot: 2, mood: 'cold',
    say: "another win. you're getting good at this. i'm still not watching on sundays. but i saw. obviously. well done",
    opts: [
      { tone: 'cold', t: "Thanks.", r: "thanks. one word. very cool. very winner. i'll let it slide because you won" },
      { tone: 'passive', t: "You saw?", r: "i saw the end. i always see the end. it's my favourite part. of races. of things. of everything" },
      { tone: 'flirty', t: "Celebrate with me again?", r: "again? greedy. ok. yes. obviously yes. tonight. late. winners get late nights" },
    ],
  },
  {
    id: 'fling-text-win-any-2-passive', on: 'win', stage: 'any', slot: 2, mood: 'passive',
    say: "another win!! you're making this a habit. a good habit. i like your good habits. i have none. congrats",
    opts: [
      { tone: 'cold', t: "It's just racing.", r: "it's just racing. like i'm just a delight. we both know that's not the full story" },
      { tone: 'passive', t: "Thank you! It felt great.", r: "good. you should feel great. you are great. at racing. at other things too" },
      { tone: 'flirty', t: "You're one of my good habits.", r: "stop. i'm nobody's good habit. i'm a bad habit. a very fun bad habit" },
    ],
  },
  {
    id: 'fling-text-win-any-2-flirty', on: 'win', stage: 'any', slot: 2, mood: 'flirty',
    say: "more winning. you're very attractive when you win. attractive when you don't, too. but winning is a look. congrats",
    opts: [
      { tone: 'cold', t: "You say that to everyone.", r: "i don't. i say it to you. at 1am. after you win. it's very specific" },
      { tone: 'passive', t: "Thanks. I'll keep winning, then.", r: "keep winning. for you. and for me. mostly for me. i like the look" },
      { tone: 'flirty', t: "Then let me look at you tonight.", r: "tonight. yes. i'll look at you a lot. you'll get uncomfortable. you'll love it" },
    ],
  },
  {
    id: 'fling-text-win-any-3-cold', on: 'win', stage: 'any', slot: 3, mood: 'cold',
    say: "another win. that's a lot of winning. i've stopped being surprised. i'll never stop being impressed. don't tell anyone",
    opts: [
      { tone: 'cold', t: "It's getting routine.", r: "routine. ugh. don't say routine. it's a habit. habits are fun. routines are boring" },
      { tone: 'passive', t: "Thanks for noticing.", r: "i always notice. i pretend i don't. it's part of the act. the act is cracking" },
      { tone: 'flirty', t: "I'll tell everyone.", r: "don't. my reputation. i'm cool. i'm unbothered. i'm extremely bothered by your winning" },
    ],
  },
  {
    id: 'fling-text-win-any-3-passive', on: 'win', stage: 'any', slot: 3, mood: 'passive',
    say: "you won AGAIN. you're making a habit of this. at this point i'm going to start a club. members: me",
    opts: [
      { tone: 'cold', t: "Just you?", r: "just me. it's a very exclusive club. like me. very exclusive. no. not exclusive. very open" },
      { tone: 'passive', t: "That's a small club.", r: "small clubs are the best clubs. you can actually hear yourself talk. and i'm the only member" },
      { tone: 'flirty', t: "I'll join your club.", r: "you can't join. you're the subject. the subject doesn't join. you can visit. late at night" },
    ],
  },
  {
    id: 'fling-text-win-any-3-flirty', on: 'win', stage: 'any', slot: 3, mood: 'flirty',
    say: "all this winning. ok. i'm officially impressed. i've never been officially anything. you've made me officially impressed",
    opts: [
      { tone: 'cold', t: "Officially? Wow.", r: "wow. you said wow. i'm keeping that. my officially and your wow. very nice" },
      { tone: 'passive', t: "That's a big word for you.", r: "it's huge. i'm terrified. i'll go back to being unofficially impressed tomorrow" },
      { tone: 'flirty', t: "Be officially impressed tonight.", r: "tonight. yes. at yours. officially. as officially as i get. which isn't very" },
    ],
  },
  {
    id: 'fling-text-podium-any-1-cold', on: 'podium', stage: 'any', slot: 1, mood: 'cold',
    say: "podium. top three. very good. you looked a bit cross about not winning though. cross is cute on you. don't stay cross",
    opts: [
      { tone: 'cold', t: "I wanted to win.", r: "i know. i could tell. you'll win next time. or the time after. you're very good. well done" },
      { tone: 'passive', t: "Thanks. It was a good result.", r: "it was. it's a podium. that's very good. you should celebrate. with me. late" },
      { tone: 'flirty', t: "You think cross is cute?", r: "i think lots of things about you are cute. cross is just one. keep it modest" },
    ],
  },
  {
    id: 'fling-text-podium-any-1-passive', on: 'podium', stage: 'any', slot: 1, mood: 'passive',
    say: "{result}! on the podium! i saw. well, i saw the photos. you looked great up there. congrats, trouble",
    opts: [
      { tone: 'cold', t: "Just {result}.", r: "just. you'll learn. just is a word for people who don't celebrate. celebrate" },
      { tone: 'passive', t: "Thanks! It felt good.", r: "it looked good. you looked good. you always look good. i'm saying congrats. that's all" },
      { tone: 'flirty', t: "You looked great too, I bet.", r: "i wasn't there. i was in bed. i looked great in bed. you'll have to take my word for it" },
    ],
  },
  {
    id: 'fling-text-podium-any-1-flirty', on: 'podium', stage: 'any', slot: 1, mood: 'flirty',
    say: "podium. you looked so good up there. i'd have been on that podium too if i'd been allowed. next to you. very close",
    opts: [
      { tone: 'cold', t: "That's not how podiums work.", r: "it should be. i'd make podiums much more interesting. i'll write to someone" },
      { tone: 'passive', t: "Thanks. Decent afternoon.", r: "it was a decent day. it'll be a good night. if you're out. are you coming out" },
      { tone: 'flirty', t: "I'd want you up there.", r: "you would? that's very sweet. that's dangerously sweet. i'll take it" },
    ],
  },
  {
    id: 'fling-text-podium-any-2-cold', on: 'podium', stage: 'any', slot: 2, mood: 'cold',
    say: "another podium. you're very consistent. consistent is not my thing. it's very much your thing. well done",
    opts: [
      { tone: 'cold', t: "Consistent isn't winning.", r: "no. but it's very close. close is good. close is where i like to be with you" },
      { tone: 'passive', t: "Thanks. Steady as ever.", r: "steady. ugh. you're so steady. it's so attractive. stop it" },
      { tone: 'flirty', t: "Be inconsistent with me tonight.", r: "ha. ok. one night of inconsistency. i'll lead. you follow. badly" },
    ],
  },
  {
    id: 'fling-text-podium-any-2-passive', on: 'podium', stage: 'any', slot: 2, mood: 'passive',
    say: "{result} again! you're always up there. that's nice. it means i always know where to find you on a sunday",
    opts: [
      { tone: 'cold', t: "You never look on Sundays.", r: "i look. sometimes. i act like i don't. it's part of my charm. well. my mystery" },
      { tone: 'passive', t: "It's a good habit.", r: "it is. good habits are fine. bad habits are more fun. i'm your bad habit. you're welcome" },
      { tone: 'flirty', t: "Find me later instead.", r: "later. yes. i'm much easier to find later. somewhere loud. you know the drill" },
    ],
  },
  {
    id: 'fling-text-podium-any-2-flirty', on: 'podium', stage: 'any', slot: 2, mood: 'flirty',
    say: "podium again. honestly you're spoiling me. i keep getting to say congrats. i don't usually say anything nice this often",
    opts: [
      { tone: 'cold', t: "Then stop saying it.", r: "ha. no. i like saying it. it's new for me. being nice. i'm getting the hang of it" },
      { tone: 'passive', t: "I don't mind the compliments.", r: "good. i'm full of them for you. i'm rationing them though. one a race" },
      { tone: 'flirty', t: "Say something nicer in person.", r: "in person i'll say much nicer things. late. with my face very close to yours" },
    ],
  },
  {
    id: 'fling-text-podium-any-3-cold', on: 'podium', stage: 'any', slot: 3, mood: 'cold',
    say: "podium again. at this point it's routine. i'm making a habit of texting you about it. a pattern. i hate patterns",
    opts: [
      { tone: 'cold', t: "Then stop texting.", r: "i can't. i've tried. my thumbs just do it. they're very loyal. unlike me" },
      { tone: 'passive', t: "It's a nice pattern.", r: "it's a lovely pattern. that's the problem. nice patterns are the dangerous ones" },
      { tone: 'flirty', t: "I like your patterns.", r: "you shouldn't. i've only got bad ones. and this one. this is my only good one" },
    ],
  },
  {
    id: 'fling-text-podium-any-3-passive', on: 'podium', stage: 'any', slot: 3, mood: 'passive',
    say: "another podium?! at this point it's not news, it's tradition. i'm very bad at traditions. this one i like",
    opts: [
      { tone: 'cold', t: "It's not that special.", r: "it is. you're special. at racing. don't make me say it twice" },
      { tone: 'passive', t: "Thanks for always noticing.", r: "i always notice. i play it cool. it's part of my brand. my brand is cracking" },
      { tone: 'flirty', t: "Let's make celebrating a tradition too.", r: "a celebration tradition. ok. late night celebrations after podiums. that's a good tradition" },
    ],
  },
  {
    id: 'fling-text-podium-any-3-flirty', on: 'podium', stage: 'any', slot: 3, mood: 'flirty',
    say: "podium. this is a whole habit now. i'm making a habit of being impressed. two habits. that's practically a hobby",
    opts: [
      { tone: 'cold', t: "Find a new hobby.", r: "i don't do hobbies. i do people. you're my current person. that sounded less weird in my head" },
      { tone: 'passive', t: "It's a good hobby.", r: "it's a very good hobby. i'm very dedicated to it. late at night especially" },
      { tone: 'flirty', t: "I'll keep feeding the hobby.", r: "keep feeding it. i'll keep watching. well. watching the highlights. at 1am" },
    ],
  },
  {
    id: 'fling-text-points-any-1-cold', on: 'points', stage: 'any', slot: 1, mood: 'cold',
    say: "{result}. points. that's good, right? i don't really know racing. i know people. you look like you need a night out",
    opts: [
      { tone: 'cold', t: "I'm fine, honestly.", r: "you're fine. ok. fine people need nights out too. it's a rule. one of mine. i made it up" },
      { tone: 'passive', t: "It was decent.", r: "decent. very modest. decent is a good start. decent nights are my speciality" },
      { tone: 'flirty', t: "A night out with you, maybe.", r: "maybe. ok. maybe's a yes in my language. i'll send a location. late" },
    ],
  },
  {
    id: 'fling-text-points-any-1-passive', on: 'points', stage: 'any', slot: 1, mood: 'passive',
    say: "you finished {result}! that's points, right? i googled it. i'm very proud of googling it. and of you. mostly you",
    opts: [
      { tone: 'cold', t: "You googled it?", r: "i did. i'm very committed. to googling. not to much else. well done though" },
      { tone: 'passive', t: "Thanks. It's a start.", r: "a start. i love a start. starts are my favourite. you're a great start" },
      { tone: 'flirty', t: "You're sweet when you try.", r: "i'm not sweet. i'm thorough. ok i'm a bit sweet. don't tell anyone" },
    ],
  },
  {
    id: 'fling-text-points-any-1-flirty', on: 'points', stage: 'any', slot: 1, mood: 'flirty',
    say: "{result}. points! i don't know what that means but you looked great doing it. come celebrate. small celebration. medium",
    opts: [
      { tone: 'cold', t: "It's not worth celebrating.", r: "everything's worth celebrating. i celebrate tuesdays. i celebrate soup. come out" },
      { tone: 'passive', t: "A medium celebration, maybe.", r: "medium. ok. medium starts at 11. ends whenever. that's my medium" },
      { tone: 'flirty', t: "For you, a big one.", r: "a big one. ha. you're very generous with your celebrations. i love it. tonight" },
    ],
  },
  {
    id: 'fling-text-points-any-2-cold', on: 'points', stage: 'any', slot: 2, mood: 'cold',
    say: "points again. solid. very solid. you're the most solid person i know. i'm the least. we balance out",
    opts: [
      { tone: 'cold', t: "Solid isn't exciting.", r: "no. but it's comforting. i don't do comforting. you're making me do comforting" },
      { tone: 'passive', t: "We do balance out.", r: "we do. you're steady. i'm chaos. it's very good. it's very dangerous" },
      { tone: 'flirty', t: "I'll bring the excitement tonight.", r: "you'll bring it? that's my job. ok. we'll both bring it. late" },
    ],
  },
  {
    id: 'fling-text-points-any-2-passive', on: 'points', stage: 'any', slot: 2, mood: 'passive',
    say: "{result} again. you're always in the points. that's nice. reliable. i'm not reliable. it's nice to know someone who is",
    opts: [
      { tone: 'cold', t: "You could be reliable.", r: "i could. i won't. maybe a bit. for you. on sundays. no. not sundays" },
      { tone: 'passive', t: "Thanks. I try.", r: "you do try. you try very hard. i'm trying too. i'm trying to text you more. look at me trying" },
      { tone: 'flirty', t: "You're reliable when it counts.", r: "when it counts. ok. that's very generous. i'm reliable at 1am. that counts" },
    ],
  },
  {
    id: 'fling-text-points-any-2-flirty', on: 'points', stage: 'any', slot: 2, mood: 'flirty',
    say: "more points. well done. i'm saying well done a lot lately. it's suspicious. i'm becoming a supportive person",
    opts: [
      { tone: 'cold', t: "Don't change.", r: "i won't. i'll still vanish. i'll just vanish supportively" },
      { tone: 'passive', t: "Supportive suits you.", r: "it doesn't. it itches. like a new jumper. i'll wear it a bit longer though. for you" },
      { tone: 'flirty', t: "Support me in person tonight.", r: "in person. tonight. ok. very supportive. very late. very close" },
    ],
  },
  {
    id: 'fling-text-points-any-3-cold', on: 'points', stage: 'any', slot: 3, mood: 'cold',
    say: "{result} again. it's becoming your thing. points, points, points. very steady. i'm still not steady. we're fine",
    opts: [
      { tone: 'cold', t: "Steady's boring.", r: "steady's not boring. it's safe. safe's boring. no. you're not boring. you're safe" },
      { tone: 'passive', t: "Steady's a good habit.", r: "it is. you've got good habits. i've got you. that's my one good habit. sort of" },
      { tone: 'flirty', t: "Be unsteady with me later.", r: "unsteady. ha. ok. one night of unsteady. i'm very good at unsteady" },
    ],
  },
  {
    id: 'fling-text-points-any-3-passive', on: 'points', stage: 'any', slot: 3, mood: 'passive',
    say: "points again! at this point i don't even have to look. i know you'll be in the points. it's very relaxing",
    opts: [
      { tone: 'cold', t: "You don't look?", r: "i look. a bit. at the end. i always look at the end. you know that about me" },
      { tone: 'passive', t: "Glad I'm relaxing.", r: "you're very relaxing. it's weird. i'm not used to relaxing. i'm used to running" },
      { tone: 'flirty', t: "Relax with me tonight.", r: "relax. with you. tonight. ok. that sounds nice. that sounds dangerously nice" },
    ],
  },
  {
    id: 'fling-text-points-any-3-flirty', on: 'points', stage: 'any', slot: 3, mood: 'flirty',
    say: "points. again. it's your signature move. i'm making a habit of you. two habits. very tidy",
    opts: [
      { tone: 'cold', t: "Habits can be broken.", r: "they can. i break most of mine. this one's sticking. annoyingly" },
      { tone: 'passive', t: "Tidy habits. I like it.", r: "you like tidy. i'm not tidy. i'm a very messy person. with one tidy habit. you" },
      { tone: 'flirty', t: "Make me a habit tonight.", r: "tonight. yes. a nightly habit. a late one. you're very good at being a habit" },
    ],
  },
  {
    id: 'fling-text-bad-any-1-cold', on: 'bad', stage: 'any', slot: 1, mood: 'cold',
    say: "rough one. i saw the results. i'm not good at sad. i'm good at distracting. want distracting?",
    opts: [
      { tone: 'cold', t: "No. I want to be alone.", r: "ok. alone. i'll leave you to it. i'm here if you change your mind. late" },
      { tone: 'passive', t: "Not really. Maybe later.", r: "later. ok. i'll be up. i'm always up. you know where i am" },
      { tone: 'flirty', t: "Distract me.", r: "ok. i've got the good jacket on. i'm sending a photo. no. i'm not. come out and see it" },
    ],
  },
  {
    id: 'fling-text-bad-any-1-passive', on: 'bad', stage: 'any', slot: 1, mood: 'passive',
    say: "heard it didn't go well. {result}. sorry. i don't do sad texts. so here's a funny one: my plant's called basil",
    opts: [
      { tone: 'cold', t: "That's not funny.", r: "it's a bit funny. basil's not even a basil plant. he's a fern. that's the joke. i'm sorry about the race" },
      { tone: 'passive', t: "Thanks. That helps, {first}.", r: "you're welcome. i'm bad at this. i'm trying. you're doing fine. next time will be better" },
      { tone: 'flirty', t: "Basil? That's very funny.", r: "see? i knew it. i'm very good at cheering people up. briefly. come out later" },
    ],
  },
  {
    id: 'fling-text-bad-any-1-flirty', on: 'bad', stage: 'any', slot: 1, mood: 'flirty',
    say: "{result}. not your day. that's ok. i'm not here for your race results. i'm here for your face. come out. forget it",
    opts: [
      { tone: 'cold', t: "Not really in the mood.", r: "ok. no mood. i'll have enough mood for two. text me if you want" },
      { tone: 'passive', t: "Maybe a quiet night.", r: "quiet. ok. i'll try. i'm terrible at quiet. i'll bring a book. i won't read it" },
      { tone: 'flirty', t: "Make me forget it.", r: "i'm on it. forgetting's my speciality. i'll teach you. tonight" },
    ],
  },
  {
    id: 'fling-text-bad-any-2-cold', on: 'bad', stage: 'any', slot: 2, mood: 'cold',
    say: "another tough one. sorry. you seem cross. you were a bit cross with me too. i get it. i'm here. late",
    opts: [
      { tone: 'cold', t: "Leave it.", r: "ok. leaving it. it's left. i'll be here when you want. or i won't. i'll try to be", opts: [
        { tone: 'cold', t: "Just leave it.", r: "ok. i'm gone. not gone. here. quietly. very quietly. that's hard for me" },
        { tone: 'passive', t: "Thanks. Maybe later.", r: "later. ok. i'll be up. i'm always up. you've noticed by now" },
        { tone: 'flirty', t: "Stay. Don't leave it.", r: "ok. staying. here. present. very unlike me. it's for you" },
      ] },
      { tone: 'passive', t: "It was a bad weekend.", r: "it was. i'm sorry. i'm not good at sorry. i'm good at nights out. want one?", opts: [
        { tone: 'cold', t: "Not tonight, thanks.", r: "ok. not tonight. i'll keep a night for you. just in case" },
        { tone: 'passive', t: "Maybe. A quiet one.", r: "a quiet one. ok. quiet. i'll try. i'm going to be very bad at it" },
        { tone: 'flirty', t: "With you, yes.", r: "with me. ok. good. i'm very good at bad weekends. i make them good weekends" },
      ] },
      { tone: 'flirty', t: "I'd rather see you than think about it.", r: "then see me. tonight. i'll distract you. i'm the best distraction. ask anyone", opts: [
        { tone: 'cold', t: "Actually, forget it.", r: "ok. no worries. if you change your mind, i'll be awake. very awake" },
        { tone: 'passive', t: "Somewhere quiet, though.", r: "quiet. i'll manage quiet. i can't do quiet. i'll try. for you" },
        { tone: 'flirty', t: "Distract me all night.", r: "all night. yes. i'm very good at all night. you'll forget the race by midnight" },
      ] },
    ],
  },
  {
    id: 'fling-text-bad-any-2-passive', on: 'bad', stage: 'any', slot: 2, mood: 'passive',
    say: "{result} again. rough. i'm sorry. i don't know what to say about racing. i know what to say about tonight: come out",
    opts: [
      { tone: 'cold', t: "I don't feel like it.", r: "ok. you don't have to. i'll be out anyway. you'll know where to find me", opts: [
        { tone: 'cold', t: "Not this time.", r: "not this time. ok. next time. i'll still ask. i always ask" },
        { tone: 'passive', t: "Maybe a coffee instead.", r: "coffee. in the daytime? ugh. for you. one coffee. a quick one" },
        { tone: 'flirty', t: "Ask me again at midnight.", r: "midnight. ok. i'll ask at midnight. be in a better mood by then. or don't. i'll fix it" },
      ] },
      { tone: 'passive', t: "Thanks. It's been a bad run.", r: "runs end. bad ones especially. you'll be fine. you're very good. i've seen the highlights", opts: [
        { tone: 'cold', t: "You don't watch races.", r: "i watch you. that's different. i watch the bits with you in them. mostly the end" },
        { tone: 'passive', t: "I hope so.", r: "you will be. i know things. well. i know you. a bit. enough" },
        { tone: 'flirty', t: "You always cheer me up.", r: "i'm a very good cheerer-upper. it's my one skill. well. one of three" },
      ] },
      { tone: 'flirty', t: "You're the best thing about this weekend.", r: "ugh. stop. now i'm going to be soppy about your bad race. that's not fair", opts: [
        { tone: 'cold', t: "Don't get soppy.", r: "i won't. i'll be breezy. very breezy. a breezy hug. a text hug. there" },
        { tone: 'passive', t: "Thanks for texting.", r: "always. well. often. well. when i remember. i remembered this time" },
        { tone: 'flirty', t: "Come over, then.", r: "ok. coming over. with snacks. no. with me. i'm the snack. kidding. a bit" },
      ] },
    ],
  },
  {
    id: 'fling-text-bad-any-2-flirty', on: 'bad', stage: 'any', slot: 2, mood: 'flirty',
    say: "{result}. another bad one. i'm sorry. i'm not great at sorry. but i'm great at making bad days end well",
    opts: [
      { tone: 'cold', t: "I'm not up for it.", r: "i get it. no mood. i'll leave you be. i'm here if the mood comes back", opts: [
        { tone: 'cold', t: "Leave me be, then.", r: "leaving you be. you're be-ed. i'm still here though. very quietly" },
        { tone: 'passive', t: "Maybe tomorrow night.", r: "tomorrow. ok. tomorrow's fine. tomorrow at night. obviously" },
        { tone: 'flirty', t: "Make the mood come back.", r: "done and done. i'm very good at moods. especially bad ones turning good" },
      ] },
      { tone: 'passive', t: "How would you do that?", r: "late night. loud music. me. that's the whole recipe. it never fails. well. sometimes it fails", opts: [
        { tone: 'cold', t: "Sounds like a lot.", r: "it is a lot. i'm a lot. you know that. maybe a small lot tonight" },
        { tone: 'passive', t: "Just you would be enough.", r: "just me. ok. that's some pressure. i love pressure. i'll be enough" },
        { tone: 'flirty', t: "I'll take the recipe.", r: "the full recipe. good. you won't regret it. you might regret it a bit. in the morning" },
      ] },
      { tone: 'flirty', t: "Make it end well, then.", r: "ok. tonight. late. i'll make it end very well. you'll forget the race existed", opts: [
        { tone: 'cold', t: "Kidding. I need sleep.", r: "sleep. after a bad race. sensible. i hate sensible. sleep well, trouble" },
        { tone: 'passive', t: "Just for a couple of hours.", r: "hours. sure. we'll see. i'm bad at hours. i'm good at nights" },
        { tone: 'flirty', t: "End it at mine.", r: "at yours. ok. that's very forward. very good. i'll be there" },
      ] },
    ],
  },
  {
    id: 'fling-text-bad-any-3-cold', on: 'bad', stage: 'any', slot: 3, mood: 'cold',
    say: "another bad one. a pattern's forming. i'm not judging. i'm just noticing. i'm very good at noticing",
    opts: [
      { tone: 'cold', t: "Thanks for the reminder.", r: "sorry. that wasn't kind. i'm not always kind. i'm trying. you'll turn it around" },
      { tone: 'passive', t: "It's been a rough patch.", r: "patches end. i should know. i'm a patch. people get over me. you'll get over this" },
      { tone: 'flirty', t: "Notice me instead.", r: "i always do. that's the problem. i'm always noticing you. it's very distracting" },
    ],
  },
  {
    id: 'fling-text-bad-any-3-passive', on: 'bad', stage: 'any', slot: 3, mood: 'passive',
    say: "{result}. again. ugh. i'm sorry. you're making a habit of bad sundays. i've always had bad sundays. welcome to the club",
    opts: [
      { tone: 'cold', t: "I don't want to be in the club.", r: "nobody does. it's a terrible club. the snacks are awful. you'll be out of it soon" },
      { tone: 'passive', t: "Thanks, {first}. Really.", r: "really. you said really. that means you mean it. i mean it too. you'll be fine" },
      { tone: 'flirty', t: "At least you're in it too.", r: "i'm the president. i've been in it for years. i'll give you the tour. late" },
    ],
  },
  {
    id: 'fling-text-bad-any-3-flirty', on: 'bad', stage: 'any', slot: 3, mood: 'flirty',
    say: "another tough one. the bad luck's sticking around. i'm making a habit of cheering you up. i like that habit",
    opts: [
      { tone: 'cold', t: "I don't need cheering up.", r: "ok. you don't. i'll cheer myself up instead. by looking at your photo. kidding" },
      { tone: 'passive', t: "It does help, actually.", r: "it does? good. i'll keep doing it. i'm very consistent at this one thing" },
      { tone: 'flirty', t: "Cheer me up tonight.", r: "tonight. yes. i'll be very cheerful. very close. very late" },
    ],
  },
  {
    id: 'fling-text-dnf-any-1-cold', on: 'dnf', stage: 'any', slot: 1, mood: 'cold',
    say: "saw you didn't finish. are you ok? you don't have to answer. i'm not good at worrying. i'm worrying a bit",
    opts: [
      { tone: 'cold', t: "I'm fine. Promise.", r: "ok. good. fine is good. i'll stop worrying. i've stopped. i'm still worrying a bit", opts: [
        { tone: 'cold', t: "Stop worrying.", r: "stopping. stopped. totally relaxed. checking my phone every minute. relaxed" },
        { tone: 'passive', t: "Thanks for checking.", r: "always. well. this time. i don't usually check. i checked. don't tell anyone" },
        { tone: 'flirty', t: "You're cute when you worry.", r: "i'm not worrying. i'm being cute. that's all. you're fine. good" },
      ] },
      { tone: 'passive', t: "Just gutted.", r: "i'm sorry. that's rubbish. i'm rubbish at this. but i'm good at distracting. want distracting?", opts: [
        { tone: 'cold', t: "Not tonight. Sorry.", r: "ok. i'll save it. distraction on standby. text me when you're ready" },
        { tone: 'passive', t: "Maybe later.", r: "later. i'm always up. later's my best time. you know where to find me" },
        { tone: 'flirty', t: "Yes. Distract me.", r: "ok. i'm sending you a terrible joke. ready? my plant's called basil. he's a fern. that's it" },
      ] },
      { tone: 'flirty', t: "Better now you've texted.", r: "oh. okay. that's a lot. that's very sweet. i'm glad. i'm really glad you're ok", opts: [
        { tone: 'cold', t: "Don't make it a big thing.", r: "i won't. small thing. tiny thing. a text. that's all. i'm very casual" },
        { tone: 'passive', t: "I'm okay, honestly.", r: "good. honestly is good. i like honestly from you. you're very honest. it's annoying" },
        { tone: 'flirty', t: "Come see for yourself.", r: "come see you? ok. late. i'll check you over very thoroughly. kidding. not kidding" },
      ] },
    ],
  },
  {
    id: 'fling-text-dnf-any-1-passive', on: 'dnf', stage: 'any', slot: 1, mood: 'passive',
    say: "you're out of the race?? are you ok? i'm not a worrier. i'm worrying. text me back. or don't. text me back",
    opts: [
      { tone: 'cold', t: "I'm fine. Car problem.", r: "a car problem. ok. phew. cars are fixable. people are harder. i'm glad you're fine", opts: [
        { tone: 'cold', t: "It's no big deal.", r: "no big deal. ok. i'll calm down. i was never not calm. i was very calm" },
        { tone: 'passive', t: "Thanks for asking.", r: "always. well. now. i'll ask. i'm not used to asking. you're making me ask things" },
        { tone: 'flirty', t: "You were worried about me?", r: "a bit. a small bit. a normal bit. ok more than normal. don't" },
      ] },
      { tone: 'passive', t: "Yeah. It's frustrating.", r: "it's rubbish. i'm sorry. i'm bad at sympathy. i'm great at distraction. come out?", opts: [
        { tone: 'cold', t: "No, I'll stay in.", r: "ok. stay in. rest. i'll be out. i'll think of you. once. maybe twice" },
        { tone: 'passive', t: "Maybe for a bit.", r: "a bit. ok. a bit's good. a bit's my favourite measurement. you know that" },
        { tone: 'flirty', t: "Distract me, please.", r: "please. polite. ok. i'll distract you. i'm top-tier distraction. ask anyone" },
      ] },
      { tone: 'flirty', t: "Better now. Thanks for worrying.", r: "i didn't worry. i was concerned. there's a difference. ok there isn't. glad you're ok", opts: [
        { tone: 'cold', t: "No fussing.", r: "i'm not fussing. fussing is for stayers. i'm checking. briefly. there. done" },
        { tone: 'passive', t: "You're sweet.", r: "i'm not sweet. i'm thorough. i check on my favourite people. you're one of them. shh" },
        { tone: 'flirty', t: "Fuss over me in person.", r: "in person. ok. late. i'll fuss. very physically. i'm a hands-on fusser" },
      ] },
    ],
  },
  {
    id: 'fling-text-dnf-any-1-flirty', on: 'dnf', stage: 'any', slot: 1, mood: 'flirty',
    say: "didn't finish. ugh. i'm sorry. you ok? you'd better be ok. i've got plans for you and they need you in a good mood",
    opts: [
      { tone: 'cold', t: "I'm okay. Just annoyed.", r: "annoyed's ok. annoyed's fixable. annoyed plus me equals fine by midnight", opts: [
        { tone: 'cold', t: "I'll get over it.", r: "you will. you're very good at getting over things. i'm better. i'm the best at it" },
        { tone: 'passive', t: "Thanks for asking, {first}.", r: "you're welcome. i'm glad you're ok. really glad. more glad than i should be" },
        { tone: 'flirty', t: "What plans?", r: "late plans. fun plans. plans that need a very un-annoyed you. i'll help" },
      ] },
      { tone: 'passive', t: "What sort of plans?", r: "secret plans. late plans. the kind i only tell you in person. after midnight", opts: [
        { tone: 'cold', t: "No plans tonight.", r: "no plans. ok. i'll hold them. they keep. i'm a very patient planner. i'm not" },
        { tone: 'passive', t: "Tell me tomorrow.", r: "tomorrow. ok. tomorrow late. you'll love them. or hate them. you'll love them" },
        { tone: 'flirty', t: "Tell me now.", r: "now? no. in person. that's the rule. one of my rules. i have a lot of rules" },
      ] },
      { tone: 'flirty', t: "I'm fine. Better for hearing from you.", r: "stop. that's sweet. that's so sweet. i'm glad. i'm really glad you're fine", opts: [
        { tone: 'cold', t: "That's all, though.", r: "that's all. ok. that's enough. i just wanted to check. checked. done" },
        { tone: 'passive', t: "Thanks for checking in.", r: "always. ok, not always. this time. this time definitely" },
        { tone: 'flirty', t: "Come check on me properly.", r: "properly. ok. late. i'll check you over very carefully. very carefully" },
      ] },
    ],
  },
  {
    id: 'fling-text-dnf-any-2-cold', on: 'dnf', stage: 'any', slot: 2, mood: 'cold',
    say: "out of the race again. that's not like you. i'm starting to worry about you. i don't worry. i'm worrying",
    opts: [
      { tone: 'cold', t: "It's just bad luck.", r: "bad luck. ok. luck changes. i should know. i'm very lucky. well. sometimes" },
      { tone: 'passive', t: "It's frustrating.", r: "it is. i'm sorry. you deserve better luck. you deserve better than me too. ignore that" },
      { tone: 'flirty', t: "Worry about me in person.", r: "in person. ok. i'll worry very closely. very late. very thoroughly" },
    ],
  },
  {
    id: 'fling-text-dnf-any-2-passive', on: 'dnf', stage: 'any', slot: 2, mood: 'passive',
    say: "didn't finish again. i'm sorry. that's rough. you must be gutted. i'm bad at gutted. nights out i can do",
    opts: [
      { tone: 'cold', t: "I'm not in the mood for it.", r: "ok. no mood. i'll leave you. i'll be here though. quietly here. late" },
      { tone: 'passive', t: "Thanks. Bad luck lately.", r: "bad runs end. you'll turn it round. you're very good. i've seen it. well, the end" },
      { tone: 'flirty', t: "Night out, then. You're on.", r: "ok. tonight. we'll forget the race. we'll forget everything. that's my speciality" },
    ],
  },
  {
    id: 'fling-text-dnf-any-2-flirty', on: 'dnf', stage: 'any', slot: 2, mood: 'flirty',
    say: "another early finish. ugh. you ok? you'd better be. i've got a lot of plans for you. they need you in good shape",
    opts: [
      { tone: 'cold', t: "I'm fine. Just frustrated.", r: "frustrated. ok. frustration's fixable. i've got a cure. it's me. late" },
      { tone: 'passive', t: "What plans this time?", r: "bigger plans. louder plans. later plans. you'll love them. or you'll love me. one of those" },
      { tone: 'flirty', t: "I'm in good shape for you.", r: "ha. ok. good. i'll check. thoroughly. tonight" },
    ],
  },
  {
    id: 'fling-text-dnf-any-3-cold', on: 'dnf', stage: 'any', slot: 3, mood: 'cold',
    say: "out again. it keeps happening. i'm not judging. i'm worried. worrying isn't me. you've made me one",
    opts: [
      { tone: 'cold', t: "There's no need to worry.", r: "i'll try. i can't. it's very annoying. you're very annoying. you're very fine. good" },
      { tone: 'passive', t: "I'm sorry I worry you.", r: "don't be sorry. it's new. it's sort of nice. worrying about someone. i hate it. it's nice" },
      { tone: 'flirty', t: "Worry about me tonight.", r: "tonight. ok. in person. i'll worry about you very closely. very carefully" },
    ],
  },
  {
    id: 'fling-text-dnf-any-3-passive', on: 'dnf', stage: 'any', slot: 3, mood: 'passive',
    say: "didn't finish. again. it's a trend now. i'm making a habit of checking on you. ugh",
    opts: [
      { tone: 'cold', t: "You don't have to check.", r: "i know. i want to. that's the weird bit. i want to. keep it small" },
      { tone: 'passive', t: "It's nice that you check.", r: "it's nice to check. i'm nice now apparently. i'm a checker. this is new" },
      { tone: 'flirty', t: "Check on me in person.", r: "in person. late. i'm very good in person. you know that. you know that very well" },
    ],
  },
  {
    id: 'fling-text-dnf-any-3-flirty', on: 'dnf', stage: 'any', slot: 3, mood: 'flirty',
    say: "another early exit. it's a pattern now. i'm making a habit of texting you after. two habits. one of them's cute",
    opts: [
      { tone: 'cold', t: "Which one's cute?", r: "mine. obviously. yours is a problem. mine's adorable" },
      { tone: 'passive', t: "Thanks for always texting.", r: "always. look at me. always. i don't do always. i'm doing it. for you" },
      { tone: 'flirty', t: "Both of them are cute.", r: "ha. no. yours is bad. mine's cute. but you're cute. so. fine. both" },
    ],
  },
];
