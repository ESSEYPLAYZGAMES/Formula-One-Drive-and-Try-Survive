// The Ice - the phone: week, first text, the morning after a date. Short, exact, properly punctuated, no emoji.
export const DATA = [
  // ---- week / new ---------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-week-new-cold-1', on: 'week', stage: 'new', mood: 'cold',
    say: "You left your sunglasses on my table at the launch. I'm not a lost property office.",
    opts: [
      { tone: 'cold', t: "keep them", r: "I don't wear other people's taste. They're at the front desk, under your name.", m: 1 },
      { tone: 'passive', t: "oh no. sorry. can I grab them this week?", r: "Thursday, before six. Don't be late. They're very judgemental sunglasses." },
      { tone: 'flirty', t: "an excuse to see you again, then", r: "An excuse, admitted in writing. Thursday. Bring better material.", m: -1 },
    ],
  },
  {
    id: 'ice-text-week-new-cold-2', on: 'week', stage: 'new', mood: 'cold',
    say: "Someone asked if we were friends. I said 'acquaintances, pending review.'",
    opts: [
      { tone: 'cold', t: "pending is generous", r: "It is. I'm famous for my generosity. Not really.", m: 1, opts: [
        { tone: 'cold', t: "didn't think so", r: "Good. Low expectations suit us both. For now.", m: 1 },
        { tone: 'passive', t: "what would get me out of pending?", r: "Texting first, for a start. You never have." },
        { tone: 'flirty', t: "I'd rather be pending with you than approved by anyone else", r: "Overwritten. But I read it twice. Make of that what you like." },
      ] },
      { tone: 'passive', t: "what does the review depend on?", r: "Conduct. Conversation. Whether you ever text first.", opts: [
        { tone: 'cold', t: "I'm not a texter", r: "Then you'll stay pending. It's a comfortable folder. Quiet.", m: 1 },
        { tone: 'passive', t: "fine. next time I'll text first", r: "Next time doesn't count retroactively. A decent attempt. Mostly decent." },
        { tone: 'flirty', t: "I'll text first tomorrow. and the day after", r: "Daily. Ambitious. Let's see if the follow-through matches the pitch." },
      ] },
      { tone: 'flirty', t: "I'd like to pass the review", r: "Most people would. Very few study for it.", m: -1, opts: [
        { tone: 'cold', t: "forget it then", r: "Forgotten. You were so close to studying.", m: 1 },
        { tone: 'passive', t: "what's on the syllabus?", r: "Punctuality, punctuation and nerve. You have one of the three." },
        { tone: 'flirty', t: "I'll study you very carefully", r: "That isn't the subject. Though I suppose it's on the reading list." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-new-cold-3', on: 'week', stage: 'new', mood: 'cold',
    say: "I saw your interview. You said 'obviously' four times. Nothing you said was obvious. That's a compliment, roughly.",
    opts: [
      { tone: 'cold', t: "didn't ask for a review", r: "You'll get them anyway. They're free and rarely kind.", m: 1 },
      { tone: 'passive', t: "ha. noted. I get nervous on camera", r: "It didn't show. Only the 'obviously' did. Find a new crutch." },
      { tone: 'flirty', t: "you watched it twice, didn't you", r: "Once. And a bit. Don't get excited about the bit." },
    ],
  },
  {
    id: 'ice-text-week-new-passive-1', on: 'week', stage: 'new', mood: 'passive',
    say: "Unsolicited recommendation: the café on the corner by your hotel. Order the plain one. Add nothing.",
    opts: [
      { tone: 'cold', t: "I don't really do cafés", r: "Then you don't do mornings. Pity. They're the only honest hour.", m: 1 },
      { tone: 'passive', t: "went. the plain one, as instructed. annoyingly perfect", r: "Of course it was. I don't recommend things that aren't." },
      { tone: 'flirty', t: "come with me and order for me", r: "I don't do breakfast with strangers. You're a stranger with promise. Lunch, perhaps." },
    ],
  },
  {
    id: 'ice-text-week-new-passive-2', on: 'week', stage: 'new', mood: 'passive',
    say: "Question. Do you actually like {track}, or is that something you say to journalists?",
    opts: [
      { tone: 'cold', t: "it's a track. I drive it", r: "Unsentimental. Good. I like a person who doesn't decorate.", m: 1, opts: [
        { tone: 'cold', t: "yep", r: "One syllable. You're either very busy or very good at this.", m: 1 },
        { tone: 'passive', t: "fine. I like it a bit. the fast stuff", r: "There. A preference. The first true thing you've sent me." },
        { tone: 'flirty', t: "I'd decorate for you", r: "No. Stay plain. Plain is why I asked." },
      ] },
      { tone: 'passive', t: "I do. fast corners, loud crowd", r: "Fast corners and a loud crowd. You've just described my ideal dinner party.", opts: [
        { tone: 'cold', t: "you'd hate a loud crowd", r: "You'd be right. I loathe crowds. I was being sociable. Never again.", m: 1 },
        { tone: 'passive', t: "what's your ideal dinner party really?", r: "Six people, one of them interesting. The rest are there to make that one look better." },
        { tone: 'flirty', t: "would I be invited?", r: "As the interesting one, or the scenery? Think carefully." },
      ] },
      { tone: 'flirty', t: "I'll like it more if you're there", r: "Predictable. I'll be in {track} anyway, for {work}. Pure coincidence.", m: -1, opts: [
        { tone: 'cold', t: "ok. see you maybe", r: "Maybe. Good. Keep it at maybe.", m: 1 },
        { tone: 'passive', t: "how busy will you be?", r: "Long days, early calls. One evening free. I'm telling you that for no reason." },
        { tone: 'flirty', t: "coincidence. sure", r: "You're very sure of yourself for someone with no evidence." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-new-passive-3', on: 'week', stage: 'new', mood: 'passive',
    say: "I'm reading something dull for {work}. Tell me something interesting. You have one text.",
    opts: [
      { tone: 'cold', t: "no pressure then", r: "None at all. That was your one text. Back to the dull thing.", m: 1 },
      { tone: 'passive', t: "a pit stop takes less time than you'll take to read this", r: "I read quickly. Still. Impressive, briefly. You pass." },
      { tone: 'flirty', t: "I've been thinking about you. interesting enough?", r: "Interesting isn't the same as surprising. Try again next week.", m: -1 },
    ],
  },
  {
    id: 'ice-text-week-new-flirty-1', on: 'week', stage: 'new', mood: 'flirty',
    say: "I laughed at something you said. Two days later. In a meeting. Unacceptable.",
    opts: [
      { tone: 'cold', t: "can't help you there", r: "It was. I'm handling it. You're very unhelpful. I respect that.", m: 1 },
      { tone: 'passive', t: "which thing?", r: "The thing about the tyres. It wasn't even a joke. That's the worst part." },
      { tone: 'flirty', t: "I'll make it a habit", r: "Don't. Habits get noticed. I'm being noticed already, and it's your fault." },
    ],
  },
  {
    id: 'ice-text-week-new-flirty-2', on: 'week', stage: 'new', mood: 'flirty',
    say: "I'm told you asked about me. Discreetly. Not discreetly enough.",
    opts: [
      { tone: 'cold', t: "just being polite", r: "Polite. Next time ask me directly. It's more efficient and less transparent.", opts: [
        { tone: 'cold', t: "fine. noted", r: "Good. I like a short reply. You're getting rather good at them.", m: 1 },
        { tone: 'passive', t: "ok. direct question: free sunday?", r: "Sunday afternoon. Briefly. Bring the direct version of you." },
        { tone: 'flirty', t: "direct then. I wanted to know everything", r: "Everything is a lot. You'll get it in instalments." },
      ] },
      { tone: 'passive', t: "guilty. you're hard to read", r: "Thank you. I work at it. Ask me one thing. I'll answer it honestly.", opts: [
        { tone: 'cold', t: "never mind", r: "Then you've wasted the honest one. They don't roll over.", m: 1 },
        { tone: 'passive', t: "what do you do on a day off?", r: "Walk somewhere with no signal. Read. Ignore people. You're interrupting one now." },
        { tone: 'flirty', t: "are you thinking about me right now?", r: "Yes. That was the honest one. Spend the next one more wisely." },
      ] },
      { tone: 'flirty', t: "not discreetly, no. I wanted you to hear", r: "Ah, tactics. Transparent, slightly clumsy, entirely effective.", opts: [
        { tone: 'cold', t: "don't get carried away", r: "I wasn't. I was admiring the strategy. Much less so now.", m: 1 },
        { tone: 'passive', t: "so it worked?", r: "It worked enough. I'm texting you. Draw no further conclusions." },
        { tone: 'flirty', t: "good. I want you to hear the next thing too", r: "Then say it in person. Things sound cheaper in writing." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-new-flirty-3', on: 'week', stage: 'new', mood: 'flirty',
    say: "You owe me a conversation. The last one ended just as it was getting interesting.",
    opts: [
      { tone: 'cold', t: "that was on purpose", r: "I suspected. Clever. Infuriating. Mostly clever.", m: 2 },
      { tone: 'passive', t: "my fault. this week sometime?", r: "Wednesday. A short window. Make it count." },
      { tone: 'flirty', t: "I like leaving you wanting more", r: "You're overestimating the wanting. Slightly. Wednesday, then." },
    ],
  },

  // ---- week / warm --------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-week-warm-cold-1', on: 'week', stage: 'warm', mood: 'cold',
    say: "Silence since Sunday. I assume your phone fell in a lake. I hope it was a nice lake.",
    opts: [
      { tone: 'cold', t: "been busy", r: "Busy is a weather report, not an answer." },
      { tone: 'passive', t: "sorry. the week got away from me", r: "Weeks do that. Once is forgivable. This was once." },
      { tone: 'flirty', t: "phone's fine. I was working out what to say to you", r: "Four days of drafting, and that's it? ...It's not bad. Continue." },
    ],
  },
  {
    id: 'ice-text-week-warm-cold-2', on: 'week', stage: 'warm', mood: 'cold',
    say: "I'm not chasing you. I'm texting once, cleanly. What you do with it is up to you.",
    opts: [
      { tone: 'cold', t: "noted", r: "Good. I'll stop there, then.", opts: [
        { tone: 'cold', t: "whatever you say", r: "The least interesting phrase in the language. You've mastered it." },
        { tone: 'passive', t: "sorry. that was short. I'm glad you texted", r: "Better. Still short. But glad is a word I can work with." },
        { tone: 'flirty', t: "one text from you is worth ten from anyone", r: "Then stop sending one-word answers to it." },
      ] },
      { tone: 'passive', t: "I'm glad you did. I was being stubborn", r: "You were. I recognise it. I practically invented it. Dinner next week?", opts: [
        { tone: 'cold', t: "maybe. busy week", r: "Maybe. Then I'll be busy too. Strangely, I already am." },
        { tone: 'passive', t: "yes. tuesday?", r: "Tuesday. Eight. Somewhere you choose and I tolerate." },
        { tone: 'flirty', t: "yes. and I'll be less stubborn in person", r: "Don't be less. Be stubborn about the right things. Me, for instance." },
      ] },
      { tone: 'flirty', t: "a clean text from you beats a hundred from anyone else", r: "Flattery from a quiet phone. Effective, unfortunately. You're partly forgiven.", opts: [
        { tone: 'cold', t: "partly. ok", r: "Partly is generous. Don't make me revise it." },
        { tone: 'passive', t: "I'll work on the other part", r: "Do. Work in person. Your texts are better than your silences." },
        { tone: 'flirty', t: "which part isn't forgiven? I'll charm that one", r: "The part that noticed. It's small, it's proud and it remembers everything." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-warm-cold-3', on: 'week', stage: 'warm', mood: 'cold',
    say: "Something cooled between us last time. I'd like to know if it was weather or climate.",
    opts: [
      { tone: 'cold', t: "weather. it'll pass", r: "Then I'll bring a coat. I won't stand outside in it waiting." },
      { tone: 'passive', t: "weather. a bad day. not you", r: "Good. I prefer weather. I can dress for weather." },
      { tone: 'flirty', t: "definitely weather. you're my climate", r: "That's a terrible line and I'm saving it." },
    ],
  },
  {
    id: 'ice-text-week-warm-passive-1', on: 'week', stage: 'warm', mood: 'passive',
    say: "Free on Friday. Somewhere with no photographers and a decent view. Your turn to choose.",
    opts: [
      { tone: 'cold', t: "I'll see", r: "Do see. Then tell me. Before Friday, ideally.", opts: [
        { tone: 'cold', t: "probably not this week", r: "Then not this week. I'll give the view to someone else." },
        { tone: 'passive', t: "sorry. friday works. you pick", r: "No. Your turn, I said. Choose. I'll be gracious about it. Mostly." },
        { tone: 'flirty', t: "I'll look for a view as good as you", r: "You won't find one. Pick the second best. I'll be there." },
      ] },
      { tone: 'passive', t: "the old observatory? quiet, good view", r: "Nobody's ever offered me a telescope before. I'm impressed. Mildly. Eight.", opts: [
        { tone: 'cold', t: "it's just a building", r: "It was a good idea. Don't talk it down now. I liked it." },
        { tone: 'passive', t: "eight. I'll pick you up", r: "I'll meet you there. I like arriving on my own terms." },
        { tone: 'flirty', t: "bring a coat. or I'll keep you warm", r: "I'll bring the coat. I'll consider the alternative." },
      ] },
      { tone: 'flirty', t: "my place has a great view", r: "Your place has you in it. That's a different kind of view. Choose again.", opts: [
        { tone: 'cold', t: "fine. somewhere else then", r: "Said like a sulk. Try that again with manners." },
        { tone: 'passive', t: "fair. the rooftop gardens by the river?", r: "Gardens instead of a sofa. Clever recovery. Eight o'clock." },
        { tone: 'flirty', t: "it's a very good view though", r: "I'm sure it is. Ask me again in a few weeks. I'll have an answer ready." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-warm-passive-2', on: 'week', stage: 'warm', mood: 'passive',
    say: "A song in a shop sounded like your engine. I stood there for the whole thing. Explain that.",
    opts: [
      { tone: 'cold', t: "you like engines?", r: "I don't. That's precisely what needs explaining." },
      { tone: 'passive', t: "you're getting used to me", r: "Used to you. Like a good coat. I'm not sure when I started wearing you." },
      { tone: 'flirty', t: "you were thinking about me in a shop", r: "I was thinking about the shop. You were the soundtrack." },
    ],
  },
  {
    id: 'ice-text-week-warm-passive-3', on: 'week', stage: 'warm', mood: 'passive',
    say: "Small question, no wrong answer. Tea or coffee. There is a wrong answer.",
    opts: [
      { tone: 'cold', t: "neither", r: "That's the wrong answer. I'll forgive it slowly." },
      { tone: 'passive', t: "coffee, black", r: "Correct. I'll make a note of it. For no reason at all." },
      { tone: 'flirty', t: "whichever you're making me in the morning", r: "Presumptuous. Also coffee. Also, we'll see." },
    ],
  },
  {
    id: 'ice-text-week-warm-flirty-1', on: 'week', stage: 'warm', mood: 'flirty',
    say: "I wore the colour you said suited me. Nobody else noticed. That was the point.",
    opts: [
      { tone: 'cold', t: "don't remember saying that", r: "You did. Clearly it meant more to one of us." },
      { tone: 'passive', t: "send a picture?", r: "No. You'll have to see it in person. That's how this works." },
      { tone: 'flirty', t: "wear it on friday. for me", r: "For you. Fine. I'll pretend it was my idea. It was." },
      { tone: 'risque', t: "wear it friday. then come up after dinner", r: "Come up after dinner. Spelled out like a contract. I'll read the small print on Friday.", m: 2 },
    ],
  },
  {
    id: 'ice-text-week-warm-flirty-2', on: 'week', stage: 'warm', mood: 'flirty',
    say: "I've read the same paragraph four times. You're responsible. I'll be sending an invoice.",
    opts: [
      { tone: 'cold', t: "not my problem", r: "Everything that distracts me is someone's problem. You've declined responsibility. Brave.", opts: [
        { tone: 'cold', t: "send the invoice then", r: "I will. It's itemised. You won't enjoy it." },
        { tone: 'passive', t: "sorry. what's the book?", r: "Something about patience. Ironic, given who I'm texting." },
        { tone: 'flirty', t: "ok, my problem. what can I do about it?", r: "Stop being interesting for one evening. You won't manage it." },
      ] },
      { tone: 'passive', t: "what's the paragraph about?", r: "Longing. Of all things. I'm about to throw the book across the room.", opts: [
        { tone: 'cold', t: "maybe read a different book", r: "Helpful. I'll read the instructions for the kettle. Fewer feelings." },
        { tone: 'passive', t: "what's the book called?", r: "I'm not telling you. You'd read it and decide it was about us." },
        { tone: 'flirty', t: "throw it. text me instead", r: "I am texting you instead. Look what you've done to my evening." },
      ] },
      { tone: 'flirty', t: "good. I want to be the distraction", r: "You are. I've now read it six times. The author would be furious.", opts: [
        { tone: 'cold', t: "ha. back to your book then", r: "Back to it. Unassisted. Story of my life." },
        { tone: 'passive', t: "what's it about?", r: "A long wait for someone who's late. I'm taking it personally." },
        { tone: 'flirty', t: "one more time and I'll come over and read it to you", r: "Very sweet, or a very good line. Try it in person and I'll tell you which." },
        { tone: 'risque', t: "put the book down. I'll keep you busier", r: "Bold, for a Tuesday. One look from me would settle that. You'll have to wait for it.", m: 2 },
      ] },
    ],
  },
  {
    id: 'ice-text-week-warm-flirty-3', on: 'week', stage: 'warm', mood: 'flirty',
    say: "You keep turning up in my head at inconvenient moments. Kindly schedule yourself better.",
    opts: [
      { tone: 'cold', t: "can't control that", r: "Nor can I, evidently. That's what makes it irritating." },
      { tone: 'passive', t: "what time suits you?", r: "Nine in the evening. Briefly. Then leave me alone until morning." },
      { tone: 'flirty', t: "I'll book a standing appointment", r: "Standing. Recurring. No cancellations. You drive a hard bargain." },
      { tone: 'risque', t: "tonight, then. eleven. in person", r: "In person. You're asking to be let in. Ask again at ten fifty-nine.", m: 2 },
    ],
  },

  // ---- week / close -------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-week-close-cold-1', on: 'week', stage: 'close', mood: 'cold',
    say: "You were somewhere else last night. Tell me where, so I can stop competing with it.",
    opts: [
      { tone: 'cold', t: "nowhere. drop it", r: "Dropped. Along with the temperature.", m: -4 },
      { tone: 'passive', t: "my head. the season. not someone. promise", r: "Promise accepted. Grudgingly. Call me when you're back from your head." },
      { tone: 'flirty', t: "I was with you. just badly", r: "Badly is a polite word for it. Come and do it well. Tonight." },
    ],
  },
  {
    id: 'ice-text-week-close-cold-2', on: 'week', stage: 'close', mood: 'cold',
    say: "I've rewritten this three times. Version three: are we fine?",
    opts: [
      { tone: 'cold', t: "we're fine", r: "Two words. I asked for reassurance, not a receipt.", m: -4, opts: [
        { tone: 'cold', t: "what do you want me to say", r: "Nothing, apparently. That's what I'm getting.", m: -4 },
        { tone: 'passive', t: "sorry. we're fine, honestly. the week flattened me", r: "Flattened I can forgive. Brief I can forgive. Both at once will cost you dinner." },
        { tone: 'flirty', t: "we're fine. come over and I'll prove it", r: "Prove it in words first. Then we'll discuss the coming over." },
      ] },
      { tone: 'passive', t: "we're fine. I was tired and short. sorry", r: "Thank you. That's what versions one and two were trying to say.", opts: [
        { tone: 'cold', t: "you didn't need three versions", r: "I needed one. You needed to read it. Never mind.", m: -3 },
        { tone: 'passive', t: "what did version one say?", r: "Too much. Version two said too little. Three was right. Like you, on a good day." },
        { tone: 'flirty', t: "send me version one. the unedited one", r: "No. Version one has adjectives. You'd never let me live them down." },
      ] },
      { tone: 'flirty', t: "better than fine. I miss you", r: "Then why was last night so cold? ...Never mind. Come over. Show me better.", opts: [
        { tone: 'cold', t: "it wasn't cold. you're overthinking", r: "Overthinking. Thank you. I'll underthink you for a while.", m: -4 },
        { tone: 'passive', t: "it was me. I'll explain tonight", r: "Tonight. I'll listen. I'll want to interrupt. I won't." },
        { tone: 'flirty', t: "on my way. bringing the jacket", r: "The jacket. You know exactly what you're doing. Hurry, then." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-close-cold-3', on: 'week', stage: 'close', mood: 'cold',
    say: "Your jacket is on my chair. I keep looking at it. It's very quiet company.",
    opts: [
      { tone: 'cold', t: "I'll pick it up", r: "Then pick it up. I'll leave it by the door.", m: -4 },
      { tone: 'passive', t: "can I pick it up with you still in the room?", r: "That depends entirely on how you knock." },
      { tone: 'flirty', t: "wear it. I'll come and collect both", r: "Both. You apologise without apologising. It's infuriating. It's working." },
    ],
  },
  {
    id: 'ice-text-week-close-passive-1', on: 'week', stage: 'close', mood: 'passive',
    say: "Clause one reminder: no racing talk before coffee. You've broken it twice this week.",
    opts: [
      { tone: 'cold', t: "it's my job", r: "It's your job, not your breakfast. Speak to me after coffee, then.", m: -3 },
      { tone: 'passive', t: "guilty. coffee's on me tomorrow", r: "You'll make it properly. Not the way you made it on Tuesday." },
      { tone: 'flirty', t: "I'll make it up to you before coffee", r: "Before coffee is when I'm weakest. That's cheating, and you're well aware of it." },
    ],
  },
  {
    id: 'ice-text-week-close-passive-2', on: 'week', stage: 'close', mood: 'passive',
    say: "Apparently I said your name asleep on a flight. My assistant heard. I've had to promote them.",
    opts: [
      { tone: 'cold', t: "embarrassing", r: "For me. Thank you for confirming. I'll stop sleeping.", m: -3 },
      { tone: 'passive', t: "what was I doing in the dream?", r: "Nothing scandalous. You were late. I was furious. Very realistic." },
      { tone: 'flirty', t: "promote them again. I want details", r: "No details. Only that I woke up smiling. Which I resent." },
    ],
  },
  {
    id: 'ice-text-week-close-passive-3', on: 'week', stage: 'close', mood: 'passive',
    say: "Thinking about where we'll be in a year. Don't panic. I'm only thinking.",
    opts: [
      { tone: 'cold', t: "a year's a long time", r: "Long, apparently. I'll think shorter, then.", m: -3, opts: [
        { tone: 'cold', t: "probably for the best", r: "For the best. I'll put the year back where I found it.", m: -4 },
        { tone: 'passive', t: "sorry. I panic at calendars. ask me again", r: "Where will we be in a year? Answer slowly. I'm writing it down." },
        { tone: 'flirty', t: "a year's long. I want longer", r: "Then why lead with long? You're terrible at this. Keep going." },
      ] },
      { tone: 'passive', t: "somewhere warm. together. final answer", r: "Somewhere warm, together. Same answer here. Annoying, when we agree.", opts: [
        { tone: 'cold', t: "don't hold me to it though", r: "I'll hold you to it gently. That's the most I can offer.", m: -2 },
        { tone: 'passive', t: "where's warm for you?", r: "A balcony, late. A book I'm not reading. You, talking too much." },
        { tone: 'flirty', t: "warm and close. very close", r: "Very close. You keep saying that. Come and demonstrate." },
      ] },
      { tone: 'flirty', t: "in bed, late for something. with you", r: "Late for something. Typical. ...It's a very good answer.", opts: [
        { tone: 'cold', t: "or not. who knows", r: "You knew, a second ago. I'll pretend you still do.", m: -3 },
        { tone: 'passive', t: "on time, then. with you", r: "On time. Look at you, growing. A year will do wonders." },
        { tone: 'flirty', t: "very late. no regrets", r: "No regrets. I'll write it into the constitution. Clause five." },
      ] },
    ],
  },
  {
    id: 'ice-text-week-close-flirty-1', on: 'week', stage: 'close', mood: 'flirty',
    say: "Your side of the bed is cold. I've been sleeping on it. Out of protest.",
    opts: [
      { tone: 'cold', t: "you can have it", r: "Generous. I wanted you in it, not the deed to it.", m: -3, opts: [
        { tone: 'cold', t: "fine. both sides are yours", r: "Both sides. Lovely. Roomy. Quiet.", m: -4 },
        { tone: 'passive', t: "sorry. I mean I'm back thursday", r: "Then say Thursday. Leave the property law out of it." },
        { tone: 'flirty', t: "kidding. I want it back. with you on it", r: "With me on it. That's better. That's much better." },
      ] },
      { tone: 'passive', t: "back thursday. I'll reclaim it", r: "Reclaim. You'll have to negotiate. I'm ruthless. Ask anyone.", opts: [
        { tone: 'cold', t: "it's my bed", r: "Your bed. My protest. We'll see who wins.", m: -2 },
        { tone: 'passive', t: "what are your terms?", r: "Breakfast. The blanket. And you don't leave before I wake up." },
        { tone: 'flirty', t: "I'll negotiate very persuasively", r: "I know how you negotiate. That's why I'm worried." },
      ] },
      { tone: 'flirty', t: "keep it warm for me", r: "It's warm. I'm not. Come back and fix one of us.", opts: [
        { tone: 'cold', t: "you'll be fine", r: "I'll be fine. Thank you. Such a warm sentiment.", m: -3 },
        { tone: 'passive', t: "thursday. I'll fix both", r: "Both. Ambitious. Send the flight details. I'll pretend not to track it." },
        { tone: 'flirty', t: "I'll fix you first", r: "Me first. Correct order. You've been paying attention." },
        { tone: 'risque', t: "you first. thoroughly. then the bed", r: "Thoroughly. Don't promise things you can't take your time over. Thursday.", m: 3 },
      ] },
      { tone: 'risque', t: "stay on it. I'll find you there thursday night", r: "Thursday night. Don't knock. I'll be awake. Pretending not to be.", m: 3, opts: [
        { tone: 'cold', t: "might be late. debrief runs long", r: "Late. Then I'll be asleep. Properly. Not pretending.", m: -3 },
        { tone: 'passive', t: "I'll text when I land", r: "Text when you land. I'll leave the hall light on." },
        { tone: 'flirty', t: "pretend all you like. I'll know", r: "You always know. It's very inconvenient." },
        { tone: 'risque', t: "don't bother pretending. you won't be sleeping", r: "Then I'll sleep on Friday afternoon. Plan accordingly.", m: 4 },
      ] },
    ],
  },
  {
    id: 'ice-text-week-close-flirty-2', on: 'week', stage: 'close', mood: 'flirty',
    say: "I found one of your notes in my coat. I read it in a lift full of strangers and had to look at the floor.",
    opts: [
      { tone: 'cold', t: "it was just a note", r: "Just a note. I see. I'll stop carrying it, then.", m: -3 },
      { tone: 'passive', t: "which one?", r: "The short one. The one that wasn't a reminder. You know the one." },
      { tone: 'flirty', t: "were you blushing? tell me you were", r: "I don't blush. My face did something warm and unauthorised." },
      { tone: 'risque', t: "the next one will make you miss your floor", r: "Then write it. I'll read it somewhere with a lock. That was a request.", m: 3 },
    ],
  },
  {
    id: 'ice-text-week-close-flirty-3', on: 'week', stage: 'close', mood: 'flirty',
    say: "I'm wearing your jacket around the house. Nothing about this is dignified. Don't come home early.",
    opts: [
      { tone: 'cold', t: "wash it before you give it back", r: "Before I give it back. Charming. It's going back tonight.", m: -4 },
      { tone: 'passive', t: "it suits you more than me", r: "It does. That's why it's mine. You may visit it." },
      { tone: 'flirty', t: "I'm coming home early", r: "I said don't. Which you know means do. Come." },
      { tone: 'risque', t: "keep it on. I'll take it back in person. slowly", r: "Slowly. You'll have to catch me first. I won't be running.", m: 3 },
    ],
  },

  // ---- met: their first text after you met --------------------------------------------------------------------------
  {
    id: 'ice-text-met-new-cold-1', on: 'met', stage: 'new', mood: 'cold',
    say: "It's {first}. You were curt yesterday. I liked it more than I should. Don't do it again. Or do.",
    opts: [
      { tone: 'cold', t: "who gave you my number?", r: "You did. You've forgotten. That isn't flattering, for either of us.", m: 1 },
      { tone: 'passive', t: "hi {first}. sorry if I was short", r: "Don't apologise. Short suited you. Just don't make it your only setting." },
      { tone: 'flirty', t: "maybe I'll be curt more often, then", r: "Careful. Curt only works if it's rare. Make me wait for it." },
    ],
  },
  {
    id: 'ice-text-met-new-passive-1', on: 'met', stage: 'new', mood: 'passive',
    say: "{first}. Saving myself in your phone so you don't save me under something stupid.",
    opts: [
      { tone: 'cold', t: "already saved you", r: "As what? No. Keep it. I'll find out and be offended in person.", m: 1, opts: [
        { tone: 'cold', t: "you'll never know", r: "I always find out. It's my least endearing quality.", m: 1 },
        { tone: 'passive', t: "just your name. relax", r: "Just my name. Correct. Spelled properly, I trust." },
        { tone: 'flirty', t: "under 'trouble'", r: "Trouble. Change it. ...Actually, leave it. It's accurate." },
      ] },
      { tone: 'passive', t: "saved. first name and everything", r: "Good. People spell it wrong. Once.", opts: [
        { tone: 'cold', t: "I can spell", r: "Excellent. A low bar, cleared. I'll raise it next time.", m: 1 },
        { tone: 'passive', t: "nice to meet you properly, {first}", r: "It was. Properly is the only way I meet people. You'll see." },
        { tone: 'flirty', t: "spelled it right. added a star", r: "A star. Delete it. ...Keep it. Don't tell me which you chose." },
      ] },
      { tone: 'flirty', t: "saved you as 'best part of my night'", r: "That's a lot of letters for a contact. Shorten it. Keep the sentiment.", m: -1, opts: [
        { tone: 'cold', t: "fine. changed it to {first}", r: "Restraint. More attractive than the original.", m: 1 },
        { tone: 'passive', t: "ok, maybe that's a bit much", r: "A little. It was sweet. Sweet is allowed, in moderation." },
        { tone: 'flirty', t: "it's staying. it's true", r: "True and too long. Like most of your sentences. I don't mind it." },
      ] },
    ],
  },
  {
    id: 'ice-text-met-new-flirty-1', on: 'met', stage: 'new', mood: 'flirty',
    say: "{first} here. You made me laugh once last night. I'm writing to see if it happens in daylight.",
    opts: [
      { tone: 'cold', t: "doubt it", r: "Doubt is attractive in moderation. That was moderation.", m: 1 },
      { tone: 'passive', t: "only one way to find out", r: "Lunch, then. In daylight. Strict conditions." },
      { tone: 'flirty', t: "I'll make it twice next time", r: "Ambitious. I was being generous with once." },
    ],
  },

  // ---- date: the morning after --------------------------------------------------------------------------------------
  {
    id: 'ice-text-date-warm-cold-1', on: 'date', stage: 'warm', mood: 'cold',
    say: "Thank you for dinner. The food was warm. You weren't, by the end.",
    opts: [
      { tone: 'cold', t: "it was late", r: "It was. And you'd left before the bill came. In spirit." },
      { tone: 'passive', t: "sorry. I drifted. it was great until I did", r: "It was. Until you did. Let's do it again and stay for all of it." },
      { tone: 'flirty', t: "let me make the ending up to you", r: "Endings are hard to remake. Write a new one. Saturday." },
    ],
  },
  {
    id: 'ice-text-date-warm-passive-1', on: 'date', stage: 'warm', mood: 'passive',
    say: "I've called an evening 'good' twice this year. Once to my tailor. Once to you, now.",
    opts: [
      { tone: 'cold', t: "glad it was ok", r: "I said good. Not okay. Learn the scale.", opts: [
        { tone: 'cold', t: "ok. good then", r: "Too late. You've marked it down. So shall I." },
        { tone: 'passive', t: "sorry. it was good. really good", r: "Really good. That's two steps up. Keep climbing." },
        { tone: 'flirty', t: "better than good. didn't want to scare you", r: "I don't scare. I file things. That's been filed under 'better'." },
      ] },
      { tone: 'passive', t: "it was. I liked the walk after the most", r: "The walk. Me too. You were quiet in all the right places.", opts: [
        { tone: 'cold', t: "I'm always quiet", r: "Not in the right places. Last night you were. Don't undo it." },
        { tone: 'passive', t: "same walk next time?", r: "Same walk. Different conversation. You'll start it." },
        { tone: 'flirty', t: "I was quiet because I was trying not to kiss you", r: "Trying not to. Hm. Next time, try less." },
      ] },
      { tone: 'flirty', t: "good? I was hoping for unforgettable", r: "Unforgettable is a big word for a first dinner. Come back and earn it.", opts: [
        { tone: 'cold', t: "fine. good it is", r: "Shrugged at me. I'll shrug back." },
        { tone: 'passive', t: "fair. what would make it unforgettable?", r: "Surprise me. Not with flowers. With something you've noticed." },
        { tone: 'flirty', t: "next time I'll make it impossible to forget", r: "Impossible is a word I enjoy testing. Friday." },
      ] },
    ],
  },
  {
    id: 'ice-text-date-warm-flirty-1', on: 'date', stage: 'warm', mood: 'flirty',
    say: "I've been awake since six replaying one part of last night. You know the part.",
    opts: [
      { tone: 'cold', t: "not sure which part", r: "Then it wasn't as good for you. Noted, and filed somewhere cold." },
      { tone: 'passive', t: "the bit by the river?", r: "The bit by the river. You do know. I need you to stop being right." },
      { tone: 'flirty', t: "been replaying it too. on loop", r: "On loop. Good. The next one will need a longer reel." },
      { tone: 'risque', t: "come over and we'll make a longer version", r: "A longer version. Before lunch? You're dangerous. Give me an hour.", m: 3 },
    ],
  },
  {
    id: 'ice-text-date-close-cold-1', on: 'date', stage: 'close', mood: 'cold',
    say: "You checked your phone eleven times at dinner. I know, because I didn't check mine once.",
    opts: [
      { tone: 'cold', t: "team stuff. couldn't avoid it", r: "I see. Next time, have dinner with the team.", m: -4, opts: [
        { tone: 'cold', t: "maybe I will", r: "Do. They'll love the conversation. I didn't.", m: -5 },
        { tone: 'passive', t: "ignore that. it was rude. sorry", r: "It was rude. Thank you for saying so. Once more and I hide the phone." },
        { tone: 'flirty', t: "they're terrible company. I'd rather have you", r: "Then act like it. Eleven times, {me}. I kept score." },
      ] },
      { tone: 'passive', t: "you're right. sorry. phone's off tonight", r: "Off. In a drawer. I'm going to check, with my own hands.", opts: [
        { tone: 'cold', t: "you don't need to check", r: "I do. Trust is paid weekly. You missed a payment.", m: -3 },
        { tone: 'passive', t: "check. it'll be off", r: "Then tonight's yours. Mine. Ours. You know what I mean." },
        { tone: 'flirty', t: "you can check anything you like", r: "Anything. Careful. I'm very thorough when I'm cross." },
      ] },
      { tone: 'flirty', t: "I'll make it up to you. no phones, the whole evening", r: "The whole evening. In writing. ...Fine. I'll bring the pen.", opts: [
        { tone: 'cold', t: "within limits", r: "Within limits. There's always a clause with you.", m: -3 },
        { tone: 'passive', t: "promise. I'll even cook", r: "You'll cook. Then I'll forgive you. Then I'll cook." },
        { tone: 'flirty', t: "the whole evening. and the morning", r: "And the morning. Now you're negotiating. You're good at it, unfortunately." },
      ] },
    ],
  },
  {
    id: 'ice-text-date-close-passive-1', on: 'date', stage: 'close', mood: 'passive',
    say: "Good morning. You stole the blanket again. I'm adding it to the list. The list is long and fond.",
    opts: [
      { tone: 'cold', t: "you were too warm anyway", r: "A diagnosis. Thank you, doctor. I'll keep my distance tonight. And the blanket.", m: -3 },
      { tone: 'passive', t: "guilty. coffee to make up for it?", r: "Coffee, and the blanket returned. Those are the terms." },
      { tone: 'flirty', t: "come back to bed and take it back", r: "That's how you lost the blanket in the first place." },
    ],
  },
  {
    id: 'ice-text-date-close-flirty-1', on: 'date', stage: 'close', mood: 'flirty',
    say: "I'm at my desk pretending last night didn't happen. It's going terribly.",
    opts: [
      { tone: 'cold', t: "focus on work then", r: "Focus. Thank you for the cold shower. Back to work, then.", m: -3, opts: [
        { tone: 'cold', t: "talk later", r: "Later. I'll be busy, too.", m: -3 },
        { tone: 'passive', t: "sorry. that was flat. I'm smiling too", r: "You're smiling and texting like a tax return. Fix one of those." },
        { tone: 'flirty', t: "kidding. I can't focus either", r: "Good. Misery likes company. So do I, as it turns out." },
      ] },
      { tone: 'passive', t: "same. I keep smiling at nothing", r: "Smiling at nothing. That's me now. I'm blaming you publicly.", opts: [
        { tone: 'cold', t: "people will notice", r: "Let them. No. Don't let them. Fine. I'll stop.", m: -2 },
        { tone: 'passive', t: "what are you working on?", r: "{work}. Allegedly. I've written one sentence, and it's about your hands." },
        { tone: 'flirty', t: "smile at me instead tonight", r: "Tonight. I'll smile at you. You'll be insufferable about it." },
      ] },
      { tone: 'flirty', t: "don't pretend. tell me your favourite part", r: "The bit where you said my name like a secret. That's all you get at work.", opts: [
        { tone: 'cold', t: "ok. back to work", r: "A cold dismount. I'll remember it.", m: -3 },
        { tone: 'passive', t: "mine was breakfast", r: "Breakfast. You burned the toast. I'll pretend that was my favourite too." },
        { tone: 'flirty', t: "I'll say it again tonight. slower", r: "Slower. You're impossible to work near, even from across the city." },
        { tone: 'risque', t: "tonight again. same everything", r: "Same everything. Bold. I'm cancelling my evening. Keep that to yourself.", m: 4 },
      ] },
      { tone: 'risque', t: "come and pretend at my place instead", r: "Your place. I'd get nothing done. That's the point, isn't it.", m: 3, opts: [
        { tone: 'cold', t: "or not. you're busy", r: "Busy. I offered to stop being busy. You let me.", m: -3 },
        { tone: 'passive', t: "lunch, at least?", r: "Lunch. One hour. I'll be watching the clock, not you. Mostly you." },
        { tone: 'flirty', t: "nothing done. that's the plan", r: "A plan with no deliverables. I've never been so tempted to fail." },
        { tone: 'risque', t: "nothing done until tomorrow", r: "Tomorrow. You do think big. I'm leaving the office early. Don't gloat.", m: 4 },
      ] },
    ],
  },
];
