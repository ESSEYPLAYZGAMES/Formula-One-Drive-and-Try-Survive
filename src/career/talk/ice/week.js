// ALOOF (ice) - texts in the week between races, slots 1-6 per stage. Short, exact, punctuated; no emoji; the odd
// one-word reply. new: pending review, the plain one at the café, 'obviously' four times, {track}, something interesting,
// a laugh two days late. warm: Friday, tea or coffee, a song like your engine, a 2am timestamp, the invoice, draft four.
// close: clause one, your side of the bed, your name on a flight, your jacket at home, the whole text, a year from now.
export const DATA = [
  // ---- new 1: 'acquaintances, pending review' ---------------------------------------------------------------------
  { id: 'ice-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: "I was asked if we're friends. Given your manners lately: 'acquaintances, pending review'.",
    opts: [
      { tone: 'cold', t: "accurate", r: "Yes. I'm always accurate. It's my least popular quality." },
      { tone: 'passive', t: "What's the review based on?", r: "Conduct. Conversation. Punctuation. You're doing poorly on the last one." },
      { tone: 'flirty', t: "How do I pass?", r: "Not by asking how to pass. Try again in a week." },
    ] },
  { id: 'ice-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: "Someone asked if we were friends. I said 'acquaintances, pending review'. I thought you should know where you stand.",
    opts: [
      { tone: 'cold', t: "Fine by me.", r: "Good. Unbothered. That's two points in the review. Don't spend them." },
      { tone: 'passive', t: "Who's doing the reviewing?", r: "Me. A panel of one. Rigorous, fair, slightly behind schedule." },
      { tone: 'flirty', t: "I'm hoping for a glowing review.", r: "Hope is permitted. Glowing is a strong word. I'll see what I can do." },
    ] },
  { id: 'ice-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: "Asked today what we are. My answer: 'acquaintances, pending review'. They asked why I was smiling. I wasn't.",
    opts: [
      { tone: 'cold', t: "Sure you weren't.", r: "Sarcasm by text. Bold. It reads very dry. I approve, unfortunately." },
      { tone: 'passive', t: "How's the review going?", r: "Slowly. Thoroughly. Better than expected. Don't quote me." },
      { tone: 'flirty', t: "You were smiling. I can tell from here.", r: "You can tell nothing from there. ...Fine. Slightly. Once." },
    ] },

  // ---- new 2: the café near your hotel - 'order the plain one, add nothing' -------------------------------------------
  { id: 'ice-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: "You've been short with me, so briefly: the café near your hotel, the plain one, nothing added.",
    opts: [
      { tone: 'cold', t: "noted", r: "Lower case. A choice. Enjoy the plain one." },
      { tone: 'passive', t: "Thanks. Why the plain one?", r: "Because it's good enough not to need anything. Rare, in food and people." },
      { tone: 'flirty', t: "Will you be there?", r: "No. Recommendations aren't invitations. Read the instructions again." },
    ] },
  { id: 'ice-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: "Unsolicited recommendation: the café on the corner by your hotel. Order the plain one. Add nothing.",
    opts: [
      { tone: 'cold', t: "I'll probably just get room service.", r: "Then you'll never know. That's a decision. A poor one, but yours." },
      { tone: 'passive', t: "Went this morning. You were right.", r: "I usually am. Did you add anything? Be honest." },
      { tone: 'flirty', t: "Do you recommend things to everyone?", r: "No. Almost nobody. Draw the conclusion quietly." },
    ] },
  { id: 'ice-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: "There's a café by your hotel. The plain one is perfect. Add nothing. I'm told I should stop managing people.",
    opts: [
      { tone: 'cold', t: "You should.", r: "Probably. I won't. You'll go anyway. I can tell." },
      { tone: 'passive', t: "I'll try it tomorrow.", r: "Good. Report back. Briefly. No photographs of food." },
      { tone: 'flirty', t: "Manage me all you like.", r: "Careful. I'm excellent at it. You'd end up with excellent breakfasts and no free will." },
    ] },

  // ---- new 3 [deep]: your interview - 'obviously' four times ---------------------------------------------------------
  { id: 'ice-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: "Your interview. Four 'obviously's. Not one obvious thing said. Interpret freely.",
    opts: [
      { tone: 'cold', t: "I'll take it as criticism.", r: "It was about one third criticism. The rest you'll have to work out.", opts: [
        { tone: 'cold', t: "Don't have time.", r: "No. You're busy saying 'obviously'. Carry on." },
        { tone: 'passive', t: "What were the other two thirds?", r: "Interest. And mild alarm that I watched the whole thing." },
        { tone: 'flirty', t: "Two thirds compliment. I'll take that.", r: "I said work it out, not round up. ...You're not wrong." },
      ] },
      { tone: 'passive', t: "Bad habit. I get nervous on camera.", r: "You don't look it. You look bored. Nervous is better. It's honest.", opts: [
        { tone: 'cold', t: "I don't do honest on camera.", r: "Wise. Save it. It's worth more off camera." },
        { tone: 'passive', t: "What should I say instead?", r: "Nothing. Pause. Let them wait. Silence reads as confidence." },
        { tone: 'flirty', t: "You watched closely.", r: "I watch everything closely. You were a small part of everything." },
      ] },
      { tone: 'flirty', t: "You counted?", r: "I count everything. You were the one being counted. Don't make it romantic.", opts: [
        { tone: 'cold', t: "Wasn't going to.", r: "Good. Neither was I. Goodnight." },
        { tone: 'passive', t: "Fair. Was the rest any good?", r: "The part about your engineer was good. Warm. Unrehearsed." },
        { tone: 'flirty', t: "Too late. It's romantic now.", r: "Hm. It's a spreadsheet. A slightly romantic spreadsheet." },
      ] },
    ] },
  { id: 'ice-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: "I saw your interview. You said 'obviously' four times. Nothing you said was obvious. That's a compliment, roughly.",
    opts: [
      { tone: 'cold', t: "Roughly?", r: "Roughly. I don't hand out smooth ones. They're bad for people.", opts: [
        { tone: 'cold', t: "I'll survive without.", r: "You will. You seem built for it. Goodnight, obviously." },
        { tone: 'passive', t: "Fair. What did you actually think?", r: "That you're cleverer than you let on. And that you hate interviews." },
        { tone: 'flirty', t: "I'll earn a smooth one eventually.", r: "Eventually. Not by text. In person, possibly." },
      ] },
      { tone: 'passive', t: "Ha. I didn't notice I did that.", r: "Nobody notices their own words. That's why you have me now, apparently.", opts: [
        { tone: 'cold', t: "I don't need an editor.", r: "Everyone needs an editor. Most can't afford one. I'm free. For now." },
        { tone: 'passive', t: "Anything else I should fix?", r: "Stop touching your collar on camera. It looks like you're escaping it." },
        { tone: 'flirty', t: "Have I, now?", r: "Provisionally. Pending review. Don't get comfortable." },
      ] },
      { tone: 'flirty', t: "You watched my interview?", r: "I watch lots of things. It was on. I didn't turn it off. That's all.", opts: [
        { tone: 'cold', t: "Right.", r: "Right. Exactly. Nothing else to report." },
        { tone: 'passive', t: "Well, thanks for watching.", r: "You're welcome. I'll watch the next one too. For the count." },
        { tone: 'flirty', t: "That's all? Sure.", r: "That's all. I also watched it twice. That's all, now." },
      ] },
    ] },
  { id: 'ice-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: "Your interview. Four 'obviously's. One very good smile at the end. I'm only reporting the facts.",
    opts: [
      { tone: 'cold', t: "Thanks for the report.", r: "You're welcome. Most people get a summary. You got detail.", opts: [
        { tone: 'cold', t: "Lucky me.", r: "Yes. Remember that. I won't keep it up." },
        { tone: 'passive', t: "Why the detail?", r: "Because the smile was worth it. That's a fact, not a feeling." },
        { tone: 'flirty', t: "Tell me more about the smile.", r: "No. It goes to your head. I can see it going from here." },
      ] },
      { tone: 'passive', t: "I'll work on the 'obviously'.", r: "Do. Keep the smile. Lose the word. That's the edit.", opts: [
        { tone: 'cold', t: "Got it.", r: "Good. Efficient. I like efficient. Barely." },
        { tone: 'passive', t: "Anything else, editor?", r: "Sit still. You swivel. Chairs aren't racing cars." },
        { tone: 'flirty', t: "The smile was for whoever was watching.", r: "Whoever. Hm. Fine. Whoever enjoyed it. Whoever won't say how much." },
      ] },
      { tone: 'flirty', t: "A very good smile, you said.", r: "I said facts. Facts can be very good. Don't twist them.", opts: [
        { tone: 'cold', t: "I'll leave it.", r: "Good. Leave it where I put it. I'll know if you move it." },
        { tone: 'passive', t: "Okay. Fact received.", r: "Received and filed. You're getting the hang of me. Slightly." },
        { tone: 'flirty', t: "I'll smile like that at you next time.", r: "Don't. In person it'd be unfair. ...Do it once. As an experiment." },
      ] },
    ] },

  // ---- new 4: do you actually like {track}? ---------------------------------------------------------------------------
  { id: 'ice-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: "A question, since we're apparently only doing questions now. Do you actually like {track}, or is that for journalists?",
    opts: [
      { tone: 'cold', t: "For journalists.", r: "Thank you. Honesty. Cold, but honesty. I'll keep it." },
      { tone: 'passive', t: "Honestly? I love it. The last sector's mad.", r: "Mad. Good. You sounded like a person for a second." },
      { tone: 'flirty', t: "I'll like it more if you're watching.", r: "That's a line. It's not a terrible line. It's still a line." },
    ] },
  { id: 'ice-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: "Question. Do you actually like {track}, or is that something you say to journalists?",
    opts: [
      { tone: 'cold', t: "I like all tracks. It's my job.", r: "That's the journalist answer. I'll ask again when you're tired." },
      { tone: 'passive', t: "Love it. Hate the hairpin.", r: "Love and hate in one sentence. That's the first true thing I've had from you by text." },
      { tone: 'flirty', t: "Why do you want to know?", r: "Research. I'm building a file. It's thin. Help me." },
    ] },
  { id: 'ice-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: "{track} this weekend. Do you like it, or do you only say so? I'd like the version you don't give journalists.",
    opts: [
      { tone: 'cold', t: "Journalists get the same version.", r: "Then they get more than I thought. Disappointing. For me." },
      { tone: 'passive', t: "Truth: it scares me a bit. Which is the appeal.", r: "...That's a good answer. It stays with me. That's the point of the private version." },
      { tone: 'flirty', t: "The private version costs a dinner.", r: "Expensive. I'll consider it. The price, not the dinner. ...Both." },
    ] },

  // ---- new 5: they're stuck on something dull for {work}; you have one text --------------------------------------------
  { id: 'ice-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: "Something dull for {work} in front of me. You were dull with me last time too. Prove me wrong. One text.",
    opts: [
      { tone: 'cold', t: "I don't perform on demand.", r: "Neither do I. We'll be dull separately, then." },
      { tone: 'passive', t: "A mechanic once fixed my car with a hairpin.", r: "That's actually interesting. Irritating. I'll get back to my dull thing." },
      { tone: 'flirty', t: "I think about you more than I should.", r: "That's not interesting. That's common. ...It's slightly interesting." },
    ] },
  { id: 'ice-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: "I'm reading something dull for {work}. Tell me something interesting. You have one text.",
    opts: [
      { tone: 'cold', t: "Nothing interesting here.", r: "That's not true, and you know it. You're just being stingy. Fine." },
      { tone: 'passive', t: "Brakes glow orange at night. Like coals.", r: "...Good. That's an image. I'll be thinking about that instead of my work." },
      { tone: 'flirty', t: "The most interesting thing in my week is this text.", r: "Flattery. Not interesting. Effective, a little. Back to the dull thing." },
    ] },
  { id: 'ice-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: "I'm buried in something dull for {work}. Rescue me. One text. Make it worth the interruption.",
    opts: [
      { tone: 'cold', t: "Can't. Busy.", r: "Two words. Efficient. Unrescued. Thank you." },
      { tone: 'passive', t: "Fact: a race car could drive upside down in a tunnel.", r: "Could it. I'd like to see that. Not with you in it. Good fact." },
      { tone: 'flirty', t: "Consider yourself rescued. Dinner?", r: "That's a kidnapping, not a rescue. ...Ask again on Thursday." },
    ] },

  // ---- new 6 [deep]: they laughed at something you said - two days later, at work. Chapter close -----------------------
  { id: 'ice-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: "You've been curt, and yet I laughed at something you said. Two days later. At work. Unacceptable.",
    opts: [
      { tone: 'cold', t: "Not my problem.", r: "It's entirely your problem. You said it. I'm merely the victim.", opts: [
        { tone: 'cold', t: "Then stop laughing.", r: "I've tried. It keeps happening. You're a nuisance." },
        { tone: 'passive', t: "What did I say?", r: "That your car has moods. I've met people with fewer." },
        { tone: 'flirty', t: "I'll keep being a problem.", r: "Evidently. I've stopped expecting otherwise. That's new." },
      ] },
      { tone: 'passive', t: "Which thing?", r: "Something about your engineer and a sandwich. It arrived late. Like a parcel.", opts: [
        { tone: 'cold', t: "It wasn't that funny.", r: "It wasn't. That's what makes it unacceptable." },
        { tone: 'passive', t: "Glad it landed eventually.", r: "So am I. I'd like it noted that I resisted for two days." },
        { tone: 'flirty', t: "I'll send more parcels.", r: "Send them. Slowly. I need to keep a straight face at work." },
      ] },
      { tone: 'flirty', t: "So I'm on your mind at work.", r: "You're in my mind uninvited. There's a difference. Don't get sentimental.", opts: [
        { tone: 'cold', t: "Fine. Uninvited.", r: "Exactly. Like most good things, it turns out." },
        { tone: 'passive', t: "Should I apologise?", r: "No. Just don't do it again. Do it again." },
        { tone: 'flirty', t: "Consider this my RSVP.", r: "Accepted. Provisionally. ...Let's meet. Somewhere quiet. That's all." },
      ] },
    ] },
  { id: 'ice-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: "I laughed at something you said. Two days later. In a meeting. Unacceptable.",
    opts: [
      { tone: 'cold', t: "Sorry for the inconvenience.", r: "You're not. But the apology's very well formed. I'll accept the form.", opts: [
        { tone: 'cold', t: "It's all you'll get.", r: "It's more than most give. Goodnight." },
        { tone: 'passive', t: "What did the meeting think?", r: "That I'd lost my mind. They're not wrong. You've borrowed some of it." },
        { tone: 'flirty', t: "Next time I'll say it in person.", r: "Please do. I'd rather laugh where I can see who's responsible." },
      ] },
      { tone: 'passive', t: "What was it?", r: "The thing about the tyres being 'emotionally unavailable'. I lost composure.", opts: [
        { tone: 'cold', t: "They are.", r: "So I'm told. So are some drivers. Goodnight." },
        { tone: 'passive', t: "Glad I could help.", r: "You didn't help. You disrupted. I'd like to be disrupted again. Soon." },
        { tone: 'flirty', t: "I'll be emotionally available. For you.", r: "...That's the second laugh. In my kitchen. You're a menace." },
      ] },
      { tone: 'flirty', t: "I'm honoured.", r: "Don't be. It was a lapse. It may be the first of several.", opts: [
        { tone: 'cold', t: "Lapses happen.", r: "Not to me. Not until recently. Goodnight." },
        { tone: 'passive', t: "Several sounds good to me.", r: "It would. It's your doing. I'm thinking about seeing you. That's my doing." },
        { tone: 'flirty', t: "I'll aim for a public one next.", r: "Ambitious. A dinner, perhaps. With witnesses. ...Yes. Let's." },
      ] },
    ] },
  { id: 'ice-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: "You've made me laugh three times this week, two of them in public. I'd like to discuss this. In person.",
    opts: [
      { tone: 'cold', t: "Nothing to discuss.", r: "There's everything to discuss. You're just being stern. It's very convincing.", opts: [
        { tone: 'cold', t: "I mean it.", r: "Then I'll laugh alone. In private. Out of spite." },
        { tone: 'passive', t: "Okay. When?", r: "Thursday. Somewhere with no music. I'll send the address." },
        { tone: 'flirty', t: "Fine. Discuss it over dinner.", r: "Dinner. Yes. That's what I meant by 'discuss'. You understood." },
      ] },
      { tone: 'passive', t: "Sure. When suits you?", r: "Thursday. Somewhere quiet. Bring your sense of humour and nothing else.", opts: [
        { tone: 'cold', t: "Can't do Thursday.", r: "Then I'll offer once more, next week. I don't usually offer twice." },
        { tone: 'passive', t: "Thursday's good.", r: "Good. Eight. I'll be early. I'll pretend I wasn't." },
        { tone: 'flirty', t: "Nothing else? Not even a jacket?", r: "Bring a jacket. It's a rule. The rest was a figure of speech. Behave." },
      ] },
      { tone: 'flirty', t: "Three times. I'm on a streak.", r: "You are. Don't get confident. Confidence ruins comedy and most people.", opts: [
        { tone: 'cold', t: "Not confident. Just counting.", r: "Counting is my job. You're encroaching. Goodnight." },
        { tone: 'passive', t: "Okay. In person, then.", r: "In person. Thursday. Dinner. You're past review. That's a new category." },
        { tone: 'flirty', t: "Let's see if I can make it four.", r: "Try. Thursday. If you manage four, I'll let you walk me home." },
      ] },
    ] },

  // ---- warm 1: free Friday. No photographers, a decent view. Your turn to choose -----------------------------------
  { id: 'ice-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: "You've been distant, so I'll be clear. I'm free on Friday. Your turn to choose somewhere. Or not.",
    opts: [
      { tone: 'cold', t: "Busy Friday.", r: "Of course. Another time, perhaps. Perhaps not." },
      { tone: 'passive', t: "Friday works. That little place by the river?", r: "Acceptable. Eight. Don't be late; I'll have already decided." },
      { tone: 'flirty', t: "I choose you. Location to follow.", r: "Smooth. Annoyingly. The location had better be good." },
      { tone: 'risque', t: "My place. I'll cook. You'll judge.", r: "Your place. A bold venue. ...I'll come. I'll judge everything." },
    ] },
  { id: 'ice-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: "Free on Friday. Somewhere with no photographers and a decent view. Your turn to choose.",
    opts: [
      { tone: 'cold', t: "You choose. I'm useless at that.", r: "You're not useless. You're lazy. I'll choose. You'll owe me." },
      { tone: 'passive', t: "There's a rooftop place. Quiet. Nobody knows it.", r: "Nobody knows it. My favourite kind of place. Friday." },
      { tone: 'flirty', t: "The best view will be across the table.", r: "That's almost too much. Almost. I'll allow it. Choose a place." },
      { tone: 'risque', t: "Best view I know is from my window. Late.", r: "Late. From your window. ...That's not a restaurant. I noticed. I didn't say no." },
    ] },
  { id: 'ice-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Friday. I've cleared it. Try to stay humble. Choose somewhere, and make it worth the clearing.",
    opts: [
      { tone: 'cold', t: "No pressure, then.", r: "All the pressure. That's how you'll know it matters." },
      { tone: 'passive', t: "I know just the place. Trust me.", r: "Trust. A big word. I'll lend you some, for Friday." },
      { tone: 'flirty', t: "Worth it. I promise.", r: "Promises are noted. And remembered. Very carefully." },
      { tone: 'risque', t: "Somewhere we won't need to leave early.", r: "Ambitious. I'll pack a toothbrush. In my head. Only in my head." },
    ] },

  // ---- warm 2: tea or coffee - 'there is a wrong answer' ------------------------------------------------------------
  { id: 'ice-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: "Small question, since you've gone quiet. Tea or coffee. One answer is wrong.",
    opts: [
      { tone: 'cold', t: "Coffee.", r: "Wrong. Unsurprising. It fits the week you've had with me." },
      { tone: 'passive', t: "Tea. Black.", r: "Correct. You've redeemed yourself by one cup." },
      { tone: 'flirty', t: "Whatever you'd make me.", r: "Tea. Strong. And you'd drink it without complaint, or I'd know." },
    ] },
  { id: 'ice-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: "Small question, no wrong answer. Tea or coffee. There is a wrong answer.",
    opts: [
      { tone: 'cold', t: "Coffee. Sorry.", r: "Don't apologise. Change. ...Fine. Stay as you are. Wrongly." },
      { tone: 'passive', t: "Tea. Nothing in it.", r: "Nothing in it. Correct. You've been paying attention, or you're naturally right." },
      { tone: 'flirty', t: "Tea, if you're pouring.", r: "I'm always pouring. It's my one domestic skill. You'll see." },
      { tone: 'risque', t: "Tea. In bed. Yours.", r: "...Bold. Inaccurate. My bed is a tea-free zone. Mostly. Ask again in person." },
    ] },
  { id: 'ice-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: "Settle something. Tea or coffee. If you say coffee I'll still like you. Slightly less.",
    opts: [
      { tone: 'cold', t: "Coffee, then.", r: "Slightly less. As promised. It's still quite a lot. Don't tell anyone." },
      { tone: 'passive', t: "Tea. Plainly.", r: "Plainly. A good word. Better than 'obviously'. Correct." },
      { tone: 'flirty', t: "Tea, so you like me the full amount.", r: "The full amount is classified. You've just unlocked it." },
    ] },

  // ---- warm 3 [deep]: a song in a shop that sounded like your engine --------------------------------------------------
  { id: 'ice-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: "A shop played a song that sounded like your engine. I stayed for all of it. Given how you've been, I'm annoyed.",
    opts: [
      { tone: 'cold', t: "Not my fault.", r: "Nothing is your fault. You're very blameless lately.", opts: [
        { tone: 'cold', t: "Exactly.", r: "Exactly. Enjoy your clean conscience. I'm going for a walk.", m: -1 },
        { tone: 'passive', t: "Sorry. I have been distant.", r: "You have. Thanks for admitting it. I liked the song, if you must know." },
        { tone: 'flirty', t: "Did you think of me?", r: "For three minutes and forty seconds. Then I bought nothing and left." },
      ] },
      { tone: 'passive', t: "What song?", r: "I don't know. It was loud and impatient and then suddenly gentle. Like someone I know.", opts: [
        { tone: 'cold', t: "Doesn't sound like me.", r: "It sounds exactly like you. You simply don't listen." },
        { tone: 'passive', t: "I'll take gentle.", r: "Take it. You've been sparing with it lately. I'd like more." },
        { tone: 'flirty', t: "Gentle with you. Always.", r: "...Mostly. Recently less. But I believe you mean it." },
      ] },
      { tone: 'flirty', t: "So I'm stuck in your head.", r: "You're stuck in a shop. I was merely nearby.", opts: [
        { tone: 'cold', t: "Right, sure.", r: "Right. Glad we agree. Goodbye." },
        { tone: 'passive', t: "Okay, okay. Did you like it?", r: "I did. I'm not telling you what it was. You'd play it at me." },
        { tone: 'flirty', t: "Stuck in your head and your shop.", r: "My shop. Ha. ...Yes. Both. Don't gloat. You've done nothing to earn it." },
      ] },
    ] },
  { id: 'ice-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: "A song in a shop sounded like your engine. I stood there for the whole thing. Explain that.",
    opts: [
      { tone: 'cold', t: "Can't explain it.", r: "Neither can I. I find that unacceptable.", opts: [
        { tone: 'cold', t: "Live with it.", r: "I'll try. It's harder than you'd think." },
        { tone: 'passive', t: "Maybe you just like the sound.", r: "Maybe. I don't like loud things. I liked that. Draw no conclusions." },
        { tone: 'flirty', t: "Maybe you miss me.", r: "Maybe I miss you. Maybe I was tired. The jury's out. The jury's me." },
      ] },
      { tone: 'passive', t: "My engine's flattered.", r: "Your engine's a machine. It doesn't get flattered. You do.", opts: [
        { tone: 'cold', t: "I don't.", r: "No. Of course not. You're above it. Goodnight." },
        { tone: 'passive', t: "Fine. I'm flattered.", r: "Good. Honest. It's very becoming on you." },
        { tone: 'flirty', t: "Next time I'll rev it outside your window.", r: "Don't. My neighbours. ...Once. Quietly. At a reasonable hour." },
        { tone: 'risque', t: "Come for a ride and hear it properly.", r: "A ride. Hm. I'd sit very still and pretend not to enjoy it. You'd see through me." },
      ] },
      { tone: 'flirty', t: "You missed me.", r: "I missed a bus. I don't miss people. ...I missed you. Slightly.", opts: [
        { tone: 'cold', t: "I'll be back soon enough.", r: "Soon enough. That's not very soon. Noted." },
        { tone: 'passive', t: "Missing you as well.", r: "Good. Then it's mutual and nobody has to be embarrassed. I'm embarrassed." },
        { tone: 'flirty', t: "Slightly is plenty.", r: "Slightly is a great deal, from me. I'm glad you know that." },
        { tone: 'risque', t: "I'll make it up to you. In person. Late.", r: "Late. In person. ...That's a dare. I'll answer it with a look on Friday." },
      ] },
    ] },
  { id: 'ice-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: "A song came on in a shop and it was your engine, practically. I stood there like a fool. A smiling fool.",
    opts: [
      { tone: 'cold', t: "Weird.", r: "Thank you. One word. Very generous.", opts: [
        { tone: 'cold', t: "You're welcome.", r: "Hm. I'll stop telling you things, then." },
        { tone: 'passive', t: "Sorry. That's actually sweet.", r: "It's not sweet. It's alarming. ...Fine. Somewhat sweet." },
        { tone: 'flirty', t: "Weird and wonderful. Like you.", r: "Recovered nicely. I'll stop sulking." },
      ] },
      { tone: 'passive', t: "What were you smiling at?", r: "The bit where it slows down. You do that before corners. I've watched.", opts: [
        { tone: 'cold', t: "Everyone does that.", r: "Not like you. But fine. Everyone." },
        { tone: 'passive', t: "You've really watched that closely.", r: "I watch all of it closely. You were never going to be the exception." },
        { tone: 'flirty', t: "I'll slow down for you anytime.", r: "That's a line. A good one. Don't use it on anyone else." },
      ] },
      { tone: 'flirty', t: "I'd pay to see you smiling like a fool.", r: "You couldn't afford it. I'd do it for free, for you. Once.", opts: [
        { tone: 'cold', t: "Save it.", r: "I will. For someone who wants it." },
        { tone: 'passive', t: "Friday, then. Free smiles.", r: "One free smile. Friday. Don't waste it on a joke." },
        { tone: 'flirty', t: "Just once? I'll get more out of you.", r: "You will. I've noticed. It's very irritating. Keep going." },
        { tone: 'risque', t: "I'll make you smile all night.", r: "All night. Ambitious. I'll accept the challenge and judge harshly." },
      ] },
    ] },

  // ---- warm 4: a 2am text - 'not a confession, a timestamp' ---------------------------------------------------------
  { id: 'ice-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: "It's two in the morning. I'm awake. You were cold earlier. These facts are unrelated. Probably.",
    opts: [
      { tone: 'cold', t: "Go to sleep.", r: "Thank you. Excellent advice. I'll file it next to yours, under 'ignored'." },
      { tone: 'passive', t: "I'm awake too. Sorry about earlier.", r: "...Thank you. That's better than sleep. Slightly." },
      { tone: 'flirty', t: "Thinking about me?", r: "About the piano. About the ceiling. About you, briefly. Goodnight." },
    ] },
  { id: 'ice-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: "It's 2am. I'm awake. This is not a confession. It's a timestamp.",
    opts: [
      { tone: 'cold', t: "Timestamp noted. Sleep.", r: "Noted. Efficient. You're very good at bedtime administration." },
      { tone: 'passive', t: "Can't sleep either. What's keeping you up?", r: "My head. It lists things. You're on it. Near the top. Goodnight." },
      { tone: 'flirty', t: "Timestamps are how confessions start.", r: "Not mine. Mine start with a piano and end with nothing said. ...Mostly." },
      { tone: 'risque', t: "Come over. I'll help you sleep.", r: "Help me sleep. That's not what you mean. ...I'm not coming. I'm thinking about it." },
    ] },
  { id: 'ice-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: "2am. Awake. I keep picking up my phone and putting it down. You're the reason. This is the evidence.",
    opts: [
      { tone: 'cold', t: "Put it down, then.", r: "Done. ...Picked it up again. You're impossible." },
      { tone: 'passive', t: "I'm glad you picked it up.", r: "So am I. Don't tell me in the morning. Let me pretend." },
      { tone: 'flirty', t: "Keep picking it up. I'm awake too.", r: "Then we're both awake and both foolish. ...I like it. Don't screenshot that." },
      { tone: 'risque', t: "Call me. I want to hear your 2am voice.", r: "My 2am voice is very low and very honest. ...Not tonight. Soon." },
    ] },

  // ---- warm 5: the same paragraph four times - 'I'll be sending an invoice' -----------------------------------------
  { id: 'ice-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: "Fourth attempt at one paragraph. You've been cold, and still you're in it. Expect an invoice.",
    opts: [
      { tone: 'cold', t: "I won't pay it.", r: "You will. Eventually. They always do." },
      { tone: 'passive', t: "Sorry. What's the paragraph about?", r: "Something important. I don't know. I've read it four times." },
      { tone: 'flirty', t: "I'll pay in person.", r: "In person. Hm. That's an acceptable currency. Barely." },
    ] },
  { id: 'ice-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: "I've read the same paragraph four times. You're responsible. I'll be sending an invoice.",
    opts: [
      { tone: 'cold', t: "Send it to my team.", r: "Your team won't understand the line items. Fine." },
      { tone: 'passive', t: "What's the damage?", r: "Forty minutes. One cold cup of tea. My entire composure." },
      { tone: 'flirty', t: "Itemise it. I want to see what I'm doing to you.", r: "Item one: everything. That's the whole invoice." },
      { tone: 'risque', t: "I'll settle it in person. Tonight.", r: "Tonight. Cash only. ...I don't mean money. I don't know what I mean. Come at nine." },
    ] },
  { id: 'ice-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Fifth time reading the same paragraph. You're in it somewhere. Between the lines. Uninvited.",
    opts: [
      { tone: 'cold', t: "Read something else.", r: "I have. You're in that too. It's a problem." },
      { tone: 'passive', t: "Sorry. Want me to call and distract you properly?", r: "Yes. No. Yes. Ten minutes. Then I really must work." },
      { tone: 'flirty', t: "Between the lines is my favourite place.", r: "It would be. You're very good at reading me there. Too good." },
    ] },

  // ---- warm 6 [deep]: draft four of a text - 'I'd like to see more of you'. Chapter close ------------------------------
  { id: 'ice-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: "I've rewritten this four times. You've been far away. Version four: are we fine?",
    opts: [
      { tone: 'cold', t: "We're fine.", r: "Two words. I wrote four drafts. Fine.", opts: [
        { tone: 'cold', t: "What more do you want?", r: "Nothing. Apparently. Goodnight.", m: -2 },
        { tone: 'passive', t: "Sorry. More than fine. I've just been tired.", r: "Then say tired. I can do tired. I can't do fine." },
        { tone: 'flirty', t: "Better than fine. I miss you.", r: "...That's what I hoped draft four would get. Thank you." },
      ] },
      { tone: 'passive', t: "We're fine. I know I've been distant. Sorry.", r: "Thank you. I want to see you. More than I've been saying.", opts: [
        { tone: 'cold', t: "This week's mad.", r: "Every week is mad. I'll be here. I'll be cooler." },
        { tone: 'passive', t: "Thursday. Let's have a proper evening.", r: "Thursday. Yes. I'll delete drafts one to three." },
        { tone: 'flirty', t: "I want to see you more too. Much more.", r: "Much more. ...Good. I don't know what this is. I like it." },
        { tone: 'risque', t: "Come over tonight and I'll show you we're fine.", r: "Show me. ...Fine. Tonight. Don't make me regret the drafts." },
      ] },
      { tone: 'flirty', t: "What were versions one to three?", r: "Too long, too cold, too honest. Four was the compromise.", opts: [
        { tone: 'cold', t: "Send the cold one.", r: "You've already had that one. From yourself. All week.", m: -1 },
        { tone: 'passive', t: "Send the honest one.", r: "I miss you, and I don't know what we are. There. Honest. Awful." },
        { tone: 'flirty', t: "Send all three. I want all of you.", r: "All of me is three drafts and a sulk. ...You'd take that. Hm." },
      ] },
    ] },
  { id: 'ice-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: "Fourth draft of this text. The first three were too long. This one: I'd like to see more of you. Often.",
    opts: [
      { tone: 'cold', t: "I'm pretty busy.", r: "I know. So am I. I made time to write four drafts. Think about that.", opts: [
        { tone: 'cold', t: "Sorry. Can't promise anything.", r: "Then don't. I'll stop drafting.", m: -2 },
        { tone: 'passive', t: "You're right. I'll make time.", r: "Good. Make it soon. I'm not good at waiting. I'm getting better, for you." },
        { tone: 'flirty', t: "Busy, but never too busy for you.", r: "Prove it. Saturday. I'll be the one pretending not to look at the door." },
      ] },
      { tone: 'passive', t: "I'd like that too. Often.", r: "Good. Often. A big word. We'll start with this weekend.", opts: [
        { tone: 'cold', t: "Let's not rush.", r: "I never rush. You know that. Fine. Slowly." },
        { tone: 'passive', t: "This weekend's perfect.", r: "Perfect. A word I avoid. I've used it." },
        { tone: 'flirty', t: "Often, starting tonight.", r: "Tonight is often. ...Yes. Come by at nine." },
        { tone: 'risque', t: "Often. And late. And at yours.", r: "At mine. Late. ...Three conditions. All accepted. Don't gloat." },
      ] },
      { tone: 'flirty', t: "What did the long drafts say?", r: "Things I'd rather say in person. With the lights low and my courage high.", opts: [
        { tone: 'cold', t: "Just text them.", r: "No. Some things don't belong on a phone. You'll have to wait." },
        { tone: 'passive', t: "I'll wait for in person.", r: "Thank you. Saturday. I'll have rehearsed. I'll forget all of it." },
        { tone: 'flirty', t: "Lights low, then. Saturday.", r: "Saturday. Low lights. High courage. I'll bring both." },
        { tone: 'risque', t: "Say them in my ear. Then stop talking.", r: "...That's a dare. I'll accept it. You won't see it coming." },
      ] },
    ] },
  { id: 'ice-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I deleted three drafts of this. Final version: I think about you more than I'd like. That's all.",
    opts: [
      { tone: 'cold', t: "That's a lot.", r: "It is. You don't have to do anything with it. I needed it out of my phone.", opts: [
        { tone: 'cold', t: "Okay.", r: "Okay. Thank you for reading it. Goodnight.", m: -2 },
        { tone: 'passive', t: "No, it's good. I think about you too.", r: "...Do you. Good. Then we're both in trouble." },
        { tone: 'flirty', t: "It's a lot. I'd like more of it.", r: "More. Greedy. ...I have plenty. I've been rationing." },
      ] },
      { tone: 'passive', t: "I think about you a lot too.", r: "Good. Then we're even. I hate being uneven.", opts: [
        { tone: 'cold', t: "Let's keep it even, then.", r: "Even. Careful. Measured. Like accountants. ...Fine." },
        { tone: 'passive', t: "What do you think about?", r: "Your hands on a cup of tea. Your laugh. Your terrible jokes." },
        { tone: 'flirty', t: "I think about you more than you think about me.", r: "Impossible. I think about you professionally. I'm very thorough." },
      ] },
      { tone: 'flirty', t: "More than you'd like? How much would you like?", r: "Less. Considerably less. I'm failing. Spectacularly.", opts: [
        { tone: 'cold', t: "Try harder.", r: "I'll try. You'll be sorry if I succeed." },
        { tone: 'passive', t: "Fail away. I don't mind.", r: "Thank you. It's the nicest permission anyone's given me." },
        { tone: 'flirty', t: "Fail spectacularly with me. In person.", r: "In person. Thursday. I'll fail with dignity. Mostly." },
        { tone: 'risque', t: "Then stop thinking. Come over.", r: "Stop thinking. I've never managed it. ...You might be the method. Twenty minutes." },
      ] },
    ] },
  // ---- close 1: clause one, in case you've forgotten - no racing talk before tea --------------------------------------
  { id: 'ice-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: "Reminder, since you've been elsewhere: our rules. Clause one, no racing talk before tea. You broke it twice.",
    opts: [
      { tone: 'cold', t: "They're your rules.", r: "They're our rules. You agreed. Or I thought you had." },
      { tone: 'passive', t: "Sorry. I'll make the tea next time.", r: "You'll make the tea for a week. That's the penalty. Accepted." },
      { tone: 'flirty', t: "Add a clause: you forgive me.", r: "Pending. It needs a signature. In person. ...Soon." },
      { tone: 'risque', t: "Punish me in person.", r: "In person. Ha. ...The penalties are severe. And slow. Tonight." },
    ] },
  { id: 'ice-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: "Clause one reminder, in case you've conveniently forgotten: no racing talk before tea. You've broken it twice this week.",
    opts: [
      { tone: 'cold', t: "Tea's overrated.", r: "Take that back. That's treason. Under clause three, I'm right." },
      { tone: 'passive', t: "Guilty. What's the penalty?", r: "You make the tea. Properly. Black. Nothing in it. For a week." },
      { tone: 'flirty', t: "I only talk racing to make you shush me.", r: "Then you've found a loophole. I'm closing it. With my hand over your mouth." },
      { tone: 'risque', t: "Shush me some other way.", r: "...I know other ways. Tonight. Before tea." },
    ] },
  { id: 'ice-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: "Clause one, again: no racing talk before tea. You said 'apex' at seven this morning. Into my neck.",
    opts: [
      { tone: 'cold', t: "It was a good apex.", r: "It was seven in the morning. Nothing is good at seven. Except tea." },
      { tone: 'passive', t: "Sorry. I'll wait until after tea.", r: "Thank you. After tea, you may say 'apex' as much as you like. Into anything." },
      { tone: 'flirty', t: "You liked it, though.", r: "I liked the neck part. The apex part was a violation. Separate charges." },
      { tone: 'risque', t: "Tomorrow I'll say something else into your neck.", r: "Tomorrow. Before tea. ...I'll suspend clause one. For one morning." },
    ] },

  // ---- close 2: your side of the bed - they've been sleeping on it, in protest ----------------------------------------
  { id: 'ice-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: "You've been cold, and so is your side of the bed. I've taken it over. Possession is nine-tenths.",
    opts: [
      { tone: 'cold', t: "Keep it.", r: "I will. It's very spacious. Very quiet. Very dull." },
      { tone: 'passive', t: "I'm sorry. I'll be back Sunday.", r: "Sunday. I'll warm it up again. Don't be late." },
      { tone: 'flirty', t: "I want my side back. With you on it.", r: "Negotiable. Terms to follow. In person." },
      { tone: 'risque', t: "Keep it warm. I'll take it back with interest.", r: "With interest. ...I'll keep it very warm. Hurry." },
    ] },
  { id: 'ice-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: "Your side of the bed is cold. I've been sleeping on it. Out of protest.",
    opts: [
      { tone: 'cold', t: "Protest noted.", r: "Noted. Not acted on. Typical." },
      { tone: 'passive', t: "Back Thursday. You can protest at me in person.", r: "I'll prepare. It'll be a quiet protest. Mostly hugging." },
      { tone: 'flirty', t: "Does it smell like me?", r: "It did. It's fading. That's the protest. Come and fix it." },
      { tone: 'risque', t: "I'll be back. Stay on my side. I'll find you there.", r: "Find me there. ...That's the most dangerous thing you've sent all week." },
    ] },
  { id: 'ice-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: "I've moved to your side of the bed. It's better. I can see why you fought for it. It's mine now.",
    opts: [
      { tone: 'cold', t: "I'll take the sofa, then.", r: "Ha. You'd last ten minutes. You'd come crawling." },
      { tone: 'passive', t: "Fair. It's the better side.", r: "It is. I'll share it. Occasionally. On good behaviour." },
      { tone: 'flirty', t: "Then I'll sleep on top of you.", r: "Heavy. Warm. ...Acceptable. Don't tell anyone I said acceptable." },
      { tone: 'risque', t: "Who said anything about sleeping?", r: "...Nobody. I certainly didn't. Two more days. I'm counting. I don't count." },
    ] },

  // ---- close 3 [deep]: they said your name asleep on a flight; their assistant heard ---------------------------------
  { id: 'ice-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: "My assistant says I said your name, asleep, on the flight. Odd, given you've barely said mine all week.",
    opts: [
      { tone: 'cold', t: "Work's been mad.", r: "Mad. Yes. Mine too. I still dream about you, apparently.", opts: [
        { tone: 'cold', t: "Can't help what you dream.", r: "No. I can help what I tell you, though. I'll stop.", m: -4 },
        { tone: 'passive', t: "I'm sorry. I miss you. I'm just tired.", r: "Then say that. Every day. I'll say your name less in my sleep." },
        { tone: 'flirty', t: "What did sleeping you say?", r: "Just your name. Twice. Like a question. ...Answer it." },
      ] },
      { tone: 'passive', t: "I'm sorry. {first}. There. I said it.", r: "...That helps more than it should. Thank you.", opts: [
        { tone: 'cold', t: "Okay then.", r: "Okay. That's the end of the conversation, then.", m: -3 },
        { tone: 'passive', t: "I'll call tonight. Properly.", r: "Properly. I'll be awake. I'll pretend I wasn't waiting." },
        { tone: 'flirty', t: "{first}. {first}. I'll say it all night.", r: "All night. ...Saturday. Say it then. Into my ear." },
      ] },
      { tone: 'flirty', t: "Even asleep you can't stop thinking of me.", r: "Asleep I have no defences. Awake I'm cross with you. Both true.", opts: [
        { tone: 'cold', t: "Stay cross, then.", r: "I will. I'm excellent at cross. You've been training me.", m: -4 },
        { tone: 'passive', t: "Let me make the awake part better.", r: "Start tonight. A call. Ten minutes. No racing." },
        { tone: 'flirty', t: "I'll be in your dreams and your bed.", r: "Bed first. Dreams after. ...Fine. I've forgiven you. Mostly." },
        { tone: 'risque', t: "Dream about me again tonight. I'll be home tomorrow.", r: "Tomorrow. ...I'll stay awake instead. It seems more efficient." },
      ] },
    ] },
  { id: 'ice-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: "Apparently I said your name asleep on a flight. My assistant heard. I've had to promote them.",
    opts: [
      { tone: 'cold', t: "Or fire them.", r: "Fire them for being right? That's not how I run things.", opts: [
        { tone: 'cold', t: "Your call.", r: "My call. Everything's my call. Clause three. Goodnight.", m: -3 },
        { tone: 'passive', t: "Ha. Promotion it is.", r: "With a pay rise. Hush money. They'll never speak of it." },
        { tone: 'flirty', t: "Promote them to keeper of your secrets.", r: "They are now. You're the only secret they've got. It's a big one." },
      ] },
      { tone: 'passive', t: "What did you say?", r: "Just your name. Softly. My assistant said 'softly'. I'll never recover.", opts: [
        { tone: 'cold', t: "Embarrassing.", r: "Thank you. I know. You didn't have to confirm it.", m: -3 },
        { tone: 'passive', t: "It's sweet. I say yours too.", r: "Do you. Where? I need to know who to promote." },
        { tone: 'flirty', t: "Say it softly to me. In person.", r: "In person. Softly. ...Saturday. Brace yourself." },
        { tone: 'risque', t: "I'll make you say it louder.", r: "...That's not for my assistant. Or my phone. Saturday." },
      ] },
      { tone: 'flirty', t: "Dreaming about me at thirty thousand feet.", r: "Thirty-four. I checked. I always check. You were the only thing I didn't.", opts: [
        { tone: 'cold', t: "Very precise.", r: "Always. Even when I'm not. Goodnight.", m: -3 },
        { tone: 'passive', t: "I miss you. Land safely.", r: "Landed. Missing you at ground level now. It's worse." },
        { tone: 'flirty', t: "Next flight, I'm in the seat next to you.", r: "Next flight. Window for me. You can have my shoulder." },
      ] },
    ] },
  { id: 'ice-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: "I said your name asleep on a plane. My assistant heard. They smiled at me all through the meeting. I hate you.",
    opts: [
      { tone: 'cold', t: "Can't blame me for that.", r: "I can, entirely. You're in my head. Asleep, now, too.", opts: [
        { tone: 'cold', t: "Tell your head to stop.", r: "I've tried. It doesn't listen. Neither do you, lately.", m: -3 },
        { tone: 'passive', t: "Okay. Partly my fault.", r: "Mostly. Admit mostly. Then I'll forgive you." },
        { tone: 'flirty', t: "Good. Stay there.", r: "Stay where. In your head? ...I'm already there. I can tell." },
      ] },
      { tone: 'passive', t: "You don't hate me.", r: "No. I love you. And I hate that my assistant knows it before you.", opts: [
        { tone: 'cold', t: "Your assistant needs a hobby.", r: "My assistant has one. It's us. Fine. No more confessions.", m: -3 },
        { tone: 'passive', t: "I know it now. And I love you back.", r: "...Good. Now we're even. My assistant's going to be unbearable." },
        { tone: 'flirty', t: "Say it again. Not asleep.", r: "I love you. Awake. Fully. Furious about it. There." },
        { tone: 'risque', t: "Come home and say it in bed. Wide awake.", r: "Wide awake. ...Saturday. I'll say it. You'll have to stop me." },
      ] },
      { tone: 'flirty', t: "What were you dreaming?", r: "I'm not telling you. Not by text. It was... warm.", opts: [
        { tone: 'cold', t: "Keep it, then.", r: "I will. I'll keep it very close.", m: -3 },
        { tone: 'passive', t: "Warm is good.", r: "Warm is new. For me. You did that." },
        { tone: 'flirty', t: "Tell me in person. Slowly.", r: "Slowly. Very. You'll regret asking. You won't." },
        { tone: 'risque', t: "Let me make the dream come true.", r: "...Don't. I'm in a meeting. I've gone pink. Saturday. Yes." },
      ] },
    ] },

  // ---- close 4: they're wearing your jacket around the house --------------------------------------------------------
  { id: 'ice-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: "Your jacket's on me, around the house. It's the warmest you've been with me all week.",
    opts: [
      { tone: 'cold', t: "Then wear the jacket.", r: "I am. It doesn't text back. It's still better company tonight.", m: -4 },
      { tone: 'passive', t: "I'm sorry. Call you tonight?", r: "Yes. At nine. Don't be late. The jacket's listening." },
      { tone: 'flirty', t: "The jacket misses you. So do I.", r: "The jacket's been very clear about it. You less so. Better." },
      { tone: 'risque', t: "Keep it on till I'm home. Then I'll take it back. Slowly.", r: "Slowly. ...That's a dare. I'll be right here. Hurry." },
    ] },
  { id: 'ice-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: "I'm wearing your jacket around the house. Nothing about this is dignified. Don't come home early.",
    opts: [
      { tone: 'cold', t: "I might.", r: "Then you'll see me undignified. It's rare. You'll be sorry. You won't." },
      { tone: 'passive', t: "Keep it. It's yours anyway.", r: "It's been mine for months. You've just noticed. Typical." },
      { tone: 'flirty', t: "Now I'm definitely coming home early.", r: "Don't. ...Do. I'll pretend I've just put it on." },
      { tone: 'risque', t: "Wear it to bed. I'll come and reclaim it.", r: "Reclaim it. Ha. ...You'd have to negotiate. In person. Come home." },
    ] },
  { id: 'ice-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: "Your jacket. My shoulders. A cup of tea. Rain on the terrace. You're missing a very good picture.",
    opts: [
      { tone: 'cold', t: "Send a photo, then.", r: "No. Pictures aren't for phones. They're for coming home to." },
      { tone: 'passive', t: "Sounds perfect. I'm on my way.", r: "Good. I'll make another cup. Black. You know." },
      { tone: 'flirty', t: "I'll be in the picture by eight.", r: "Eight. The picture will be waiting. Wearing your jacket. Smugly." },
      { tone: 'risque', t: "Wait for me on the terrace. Let the tea go cold.", r: "...It already has. I don't care. Eight." },
    ] },

  // ---- close 5: 'I miss you. That's the whole text.' ----------------------------------------------------------------
  { id: 'ice-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: "I miss you. Even this week. Nothing else to add.",
    opts: [
      { tone: 'cold', t: "ok", r: "Ok. Two letters. I sent you a whole heart. Fine.", m: -4 },
      { tone: 'passive', t: "Miss you back. I'm sorry about this week.", r: "Thank you. That's the whole reply I needed." },
      { tone: 'flirty', t: "Miss you more. Every day.", r: "...That's better than I deserve this week. Better than you've been. Both." },
    ] },
  { id: 'ice-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: "I miss you. That's the whole text. I checked it for weaknesses and found none.",
    opts: [
      { tone: 'cold', t: "Busy here. Talk later.", r: "Later. Fine. The text stands. It's very sturdy." },
      { tone: 'passive', t: "Same. Home Friday.", r: "Friday. I'll be at the door. I'm never at doors." },
      { tone: 'flirty', t: "I found one weakness: it's too short.", r: "Then come home and I'll make it longer. In person. Much." },
      { tone: 'risque', t: "Miss you too. All of you. Especially the parts I'm not texting about.", r: "...I've read that four times. Friday. Don't be tired." },
    ] },
  { id: 'ice-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: "I miss you. I typed more. I deleted it. The rest is for when you're here.",
    opts: [
      { tone: 'cold', t: "Fine.", r: "Fine. One word. I gave you three drafts' worth. Hm.", m: -4 },
      { tone: 'passive', t: "Miss you. Save the rest for me.", r: "Saved. Every word. You'll get them all at once." },
      { tone: 'flirty', t: "Tell me the rest. I can't wait.", r: "You can. You will. Then you'll be very glad you did." },
      { tone: 'risque', t: "Don't say the rest. Show me.", r: "Show you. ...That was the plan. Sunday. Early." },
    ] },

  // ---- close 6 [deep]: where we'll be in a year - 'don't panic, I'm only thinking' -----------------------------------
  { id: 'ice-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: "I've been picturing next year. You've been somewhere else lately. It's made the picturing harder.",
    opts: [
      { tone: 'cold', t: "Don't overthink it.", r: "I overthink everything. You knew that. You chose it.", opts: [
        { tone: 'cold', t: "Maybe I'm rethinking.", r: "...I see. Thank you for telling me by text. I'll think alone.", m: -6 },
        { tone: 'passive', t: "Sorry. I'm staying. Right here.", r: "Then be here. Not just not going. Here." },
        { tone: 'flirty', t: "In a year? Still yours.", r: "...Still mine. Good. You could have led with that." },
      ] },
      { tone: 'passive', t: "I'm sorry. Where do you see us?", r: "Somewhere with one terrace and two cups. I'd like you to say it too.", opts: [
        { tone: 'cold', t: "Can we talk about it later?", r: "Later. Yes. Later is a very large room. I'll wait in it.", m: -4 },
        { tone: 'passive', t: "One terrace. Two cups. Yes.", r: "Yes. ...Thank you. That's a year I'd like." },
        { tone: 'flirty', t: "Two cups. One bed. Every morning.", r: "Every morning. I'm going to hold you to that. In ink." },
      ] },
      { tone: 'flirty', t: "In a year we'll be insufferable.", r: "We are already insufferable. You've just been away from it.", opts: [
        { tone: 'cold', t: "Insufferable's a strong word.", r: "So is distant. You've been earning it.", m: -4 },
        { tone: 'passive', t: "I'll come back to it. Soon.", r: "Soon. Thursday. Insufferably. I'll be ready." },
        { tone: 'flirty', t: "Insufferable together. Forever.", r: "Forever. A big word. ...I'll allow it. Just this once. Every day." },
        { tone: 'risque', t: "Let me remind you what insufferable feels like. Thursday.", r: "Thursday. Remind me slowly. I've forgotten nothing. I'd like a refresher." },
      ] },
    ] },
  { id: 'ice-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: "Thinking about where we'll be in a year. Don't panic. I'm only thinking.",
    opts: [
      { tone: 'cold', t: "A year's a long way off.", r: "It is. I like to plan. You like to arrive. Fine.", opts: [
        { tone: 'cold', t: "Let's take it as it comes.", r: "As it comes. I'll try. I'm not built for it.", m: -4 },
        { tone: 'passive', t: "Okay. Tell me what you're thinking.", r: "That I'd like your name next to mine on the doorbell. That's all. That's everything." },
        { tone: 'flirty', t: "Plan me in. Every page.", r: "Every page. In pen. You'll find yourself on most of them already." },
      ] },
      { tone: 'passive', t: "Not panicking. Where are we?", r: "Together. Mostly at mine. Your jacket permanently on my chair. The lemon tree insufferable.", opts: [
        { tone: 'cold', t: "Mostly at yours?", r: "Yours has no terrace. It's not personal. It's architecture. Fine.", m: -3 },
        { tone: 'passive', t: "Sounds right to me.", r: "It sounds right to me too. That's frightening. I'm smiling at my phone." },
        { tone: 'flirty', t: "Sounds like home.", r: "...It does. I didn't use that word. You did. I'm keeping it." },
        { tone: 'risque', t: "And every night I'm keeping you up past two.", r: "Every night. Past two. The neighbours will move. Good." },
      ] },
      { tone: 'flirty', t: "I'm only thinking about it too. Constantly.", r: "Constantly. Good. Then we're both only thinking. Quite hard.", opts: [
        { tone: 'cold', t: "Not that constantly.", r: "Ah. Then I'll think a little less too. To match.", m: -4 },
        { tone: 'passive', t: "What's the first thing you think of?", r: "Two cups on the terrace. Yours too strong. Mine perfect. Every morning." },
        { tone: 'flirty', t: "In a year, I'll still be making you blush.", r: "You'll be making me blush in ten years. I've accepted it. Mostly." },
      ] },
    ] },
  { id: 'ice-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: "A year from now. Same terrace. Same tea. Same you. I've decided. You may object, but I'm always right.",
    opts: [
      { tone: 'cold', t: "You've decided for both of us?", r: "I've suggested for both of us. Strongly. Do you object?", opts: [
        { tone: 'cold', t: "I'd like a say.", r: "Of course. Say it, then. ...You've said nothing. Hm.", m: -4 },
        { tone: 'passive', t: "No objection. Just teasing.", r: "Good. You frightened me. I don't frighten." },
        { tone: 'flirty', t: "No objection. Make it ten years.", r: "Ten. ...Done. Written. You can't take it back." },
      ] },
      { tone: 'passive', t: "No objection. Same you, too.", r: "Same me. A bit softer. You've ruined me. Gently.", opts: [
        { tone: 'cold', t: "Not that soft.", r: "Not with anyone else. You're the exception. Don't waste it.", m: -3 },
        { tone: 'passive', t: "I like the soft parts.", r: "They're yours. Nobody else gets them. Not even my grandmother." },
        { tone: 'flirty', t: "Soft for me. Sharp for everyone else.", r: "Exactly. That's the arrangement. I love you. Same terrace. Same you." },
        { tone: 'risque', t: "Soft parts tonight. Sharp parts in the morning.", r: "...Both. Tonight. I'll leave the door unlocked. I never do." },
      ] },
      { tone: 'flirty', t: "Same you. I wouldn't change a thing.", r: "Not a thing. Not the edges? Nobody's ever said that and meant it.", opts: [
        { tone: 'cold', t: "Well, maybe one or two.", r: "...Of course. Which ones. Never mind. I'll guess.", m: -5 },
        { tone: 'passive', t: "Not the edges. Especially not them.", r: "...Thank you. I'm keeping that forever. In ink." },
        { tone: 'flirty', t: "I mean it. All of you, every year.", r: "Every year. I believe you. That's the softest thing I've ever said." },
      ] },
    ] },
];
