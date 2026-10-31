// ALOOF (ice) - event texts. met: their first text, saving themselves in your phone. date (warm/close, slots 1-3): the
// day after - 'good' said twice this year; replaying one part; the third evening; the blanket and the list; the desk;
// asleep mid-sentence. After your race (any stage, slot 1 the first time, slot 3 'a habit'): win, podium, points, bad,
// dnf - dry, exact, quietly proud; they watched every lap and will admit to some of it.
export const DATA = [
  // ---- met: their first text ------------------------------------------------------------------------------------
  { id: 'ice-text-met-new-1-cold', on: 'met', stage: 'new', slot: 1, mood: 'cold',
    say: "It's {first}. You were curt earlier. I liked it more than I should. Don't make a habit of it.",
    opts: [
      { tone: 'cold', t: "Noted.", r: "Ah. Also curt. Consistent. I'll allow it.", opts: [
        { tone: 'cold', t: "Good.", r: "One word again. You're very economical. So am I. Goodnight." },
        { tone: 'passive', t: "Sorry. Long day. Good to know you, {first}.", r: "Better. You do have manners. You keep them somewhere odd." },
        { tone: 'flirty', t: "I'll be curt again if you like it.", r: "I said don't make a habit of it. ...Once more wouldn't hurt." },
      ] },
      { tone: 'passive', t: "Hi {first}. Sorry if I was short. Long day.", r: "Apology accepted. Provisionally. Most of my acceptances are.", opts: [
        { tone: 'cold', t: "Provisionally works.", r: "Good. Unfussy. You may text again. Sparingly." },
        { tone: 'passive', t: "What does it take to make it permanent?", r: "Time. Tea. Good punctuation. You're doing well on the last." },
        { tone: 'flirty', t: "I'll earn the rest of it.", r: "Confident. We'll see. Your file's open." },
      ] },
      { tone: 'flirty', t: "You liked it? I'll take that.", r: "I said more than I should. That's not a lot. Don't build on it.", opts: [
        { tone: 'cold', t: "Wasn't planning to.", r: "Good. Nor was I. Goodnight." },
        { tone: 'passive', t: "Fair enough. Good to meet you.", r: "Was it. I'll decide in a week. Report back then." },
        { tone: 'flirty', t: "Too late. Building already.", r: "Then build slowly. I inspect everything." },
      ] },
    ] },
  { id: 'ice-text-met-new-1-passive', on: 'met', stage: 'new', slot: 1, mood: 'passive',
    say: "{first}. Saving myself in your phone so you don't save me under something stupid.",
    opts: [
      { tone: 'cold', t: "Too late.", r: "What did you save me as. Be honest. I'll know.", opts: [
        { tone: 'cold', t: "Not telling.", r: "Then I'll assume the worst. I usually do. Goodnight." },
        { tone: 'passive', t: "Just your name. I promise.", r: "Good. Simple. Correct. You may keep it." },
        { tone: 'flirty', t: "'Trouble'. With a full stop.", r: "A full stop. At least you punctuate. I'll allow 'Trouble.' for now." },
      ] },
      { tone: 'passive', t: "Saved. Nice to meet you properly.", r: "Properly. We'll see. Most people text 'hey'. You didn't. A point.", opts: [
        { tone: 'cold', t: "I don't do 'hey'.", r: "Good. Neither do I. We may get along. At a distance." },
        { tone: 'passive', t: "Do you keep score?", r: "Always. You're on one point. It's a good start. Most people are on zero." },
        { tone: 'flirty', t: "What do I get for two points?", r: "A second text. Maybe a third. Don't rush the scoring." },
      ] },
      { tone: 'flirty', t: "What would something stupid be?", r: "Anything with an emoji. Or a snowflake. I've seen it done. I wasn't amused.", opts: [
        { tone: 'cold', t: "Never crossed my mind.", r: "Good. You've avoided the obvious. Rare. Goodnight." },
        { tone: 'passive', t: "Just {first}, then. Full stop.", r: "Just {first}. Full stop. Perfect. You learn quickly." },
        { tone: 'flirty', t: "I'd save you as 'worth it'.", r: "Hm. That's a line. A good one. I'll pretend I didn't read it twice." },
      ] },
    ] },
  { id: 'ice-text-met-new-1-flirty', on: 'met', stage: 'new', slot: 1, mood: 'flirty',
    say: "{first} here. You made me laugh once tonight. I'm checking whether it works in daylight.",
    opts: [
      { tone: 'cold', t: "It doesn't.", r: "Pity. I'll check again tomorrow. I'm thorough.", opts: [
        { tone: 'cold', t: "Check all you like.", r: "I will. Quietly. You won't notice. Goodnight." },
        { tone: 'passive', t: "Okay, maybe it does. Hi, {first}.", r: "Hello. That's more like it. Daylight test: passed. Barely." },
        { tone: 'flirty', t: "Check in person. I work better in person.", r: "Everyone says that. Few do. I'll consider an inspection." },
      ] },
      { tone: 'passive', t: "Glad it landed. Lovely to meet you.", r: "It landed. I said once. I'm not handing out a second laugh by text.", opts: [
        { tone: 'cold', t: "Didn't ask for one.", r: "No. You didn't. That's why you might get one. Goodnight." },
        { tone: 'passive', t: "Fair. Which line was it?", r: "I'm not telling. You'd only repeat it and ruin it." },
        { tone: 'flirty', t: "I'll get the second one in person.", r: "Ambitious. Possibly. You've had worse ideas tonight, I'm sure." },
      ] },
      { tone: 'flirty', t: "Only once? I'll have to try harder.", r: "Don't try. It ruins it. Be accidentally funny. It's your best look.", opts: [
        { tone: 'cold', t: "Fine. No effort.", r: "Good. Effortless suits you. Goodnight." },
        { tone: 'passive', t: "Okay. No trying. Just talking.", r: "Just talking. Yes. That was the whole request. Mostly." },
        { tone: 'flirty', t: "My best look? You noticed my looks.", r: "I notice everything. I said look, singular. Don't pluralise." },
      ] },
    ] },

  // ---- date, warm 1 [deep]: the day after the first one - 'good', said twice this year -------------------------------
  { id: 'ice-text-date-warm-1-cold', on: 'date', stage: 'warm', slot: 1, mood: 'cold',
    say: "Thank you for last night. It started warm. You weren't, by the end.",
    opts: [
      { tone: 'cold', t: "I was tired.", r: "Tired. Fine. Tired I can do. Cold I don't.", opts: [
        { tone: 'cold', t: "It was just a date.", r: "Just a date. Of course. I'll remember it as just that.", m: -2 },
        { tone: 'passive', t: "I'm sorry. I had a good time. Really.", r: "Then let your face know next time. It didn't get the message." },
        { tone: 'flirty', t: "I'll be warmer next time. Promise.", r: "Next time. You're assuming. ...Assume, then. Carefully." },
      ] },
      { tone: 'passive', t: "Sorry. I was in my head. I loved the evening.", r: "Loved. That's a strong word for a quiet ending. I'll take it.", opts: [
        { tone: 'cold', t: "Don't overanalyse it.", r: "I analyse everything. It's how I know when something matters." },
        { tone: 'passive', t: "Can I take you out again?", r: "Yes. Somewhere you choose. And more of you at the end." },
        { tone: 'flirty', t: "The best part was you.", r: "The best part was the first hour. I was in it, so I agree. Apparently." },
      ] },
      { tone: 'flirty', t: "Let me redeem myself.", r: "How. Be specific. I've a low tolerance for vague.", opts: [
        { tone: 'cold', t: "I'll think of something.", r: "Think quickly. I don't wait long." },
        { tone: 'passive', t: "Lunch. Saturday. Nothing loud.", r: "Saturday. Nothing loud. Good. Be warm all the way to the end." },
        { tone: 'flirty', t: "A walk home that doesn't end at the door.", r: "That's very bold for someone who went quiet at the end. ...I'll consider it." },
        { tone: 'risque', t: "Dinner at mine. Dessert, too.", r: "Dessert. At yours. ...I'll accept that with a look. You'll see it on Saturday." },
      ] },
    ] },
  { id: 'ice-text-date-warm-1-passive', on: 'date', stage: 'warm', slot: 1, mood: 'passive',
    say: "I've called an evening 'good' twice this year. Once to my tailor. Once to you, now.",
    opts: [
      { tone: 'cold', t: "High praise.", r: "It is. You say that as if it isn't. It is.", opts: [
        { tone: 'cold', t: "I know it is.", r: "Good. Then don't be flippant with it. It's rare. Goodnight." },
        { tone: 'passive', t: "Sorry. It was good for me too.", r: "Good. Then we agree. That's two good things." },
        { tone: 'flirty', t: "I'll aim for 'very good' next time.", r: "Ambitious. I've never said 'very good'. You may be the first." },
      ] },
      { tone: 'passive', t: "It was good. Thank you for coming.", r: "Thank you for asking. Properly. Few people ask properly.", opts: [
        { tone: 'cold', t: "Only an evening.", r: "Only an evening. Fine. I'll file it as such.", m: -2 },
        { tone: 'passive', t: "Again soon?", r: "Again soon. Somewhere of your choosing. I'll judge it fairly." },
        { tone: 'flirty', t: "Next time I won't let you leave so early.", r: "I left late. Late for me, anyway. ...Fine. Later still." },
      ] },
      { tone: 'flirty', t: "What did your tailor do to deserve it?", r: "Made a coat that fits like it means it. You did something similar.", opts: [
        { tone: 'cold', t: "I'm not a coat.", r: "No. A coat stays put. Never mind." },
        { tone: 'passive', t: "That's a lovely thing to say.", r: "I know. I was surprised too. I'm not usually lovely." },
        { tone: 'flirty', t: "Fit like I mean it. I do.", r: "...I believe you. That's the alarming part. Goodnight." },
        { tone: 'risque', t: "Next time I'll get closer than a coat.", r: "Closer than a coat. ...That's a dare. I might take it. With a look." },
      ] },
    ] },
  { id: 'ice-text-date-warm-1-flirty', on: 'date', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Last night was good. A word I ration. My tailor has heard it once this year. You're the second.",
    opts: [
      { tone: 'cold', t: "Glad it was fine.", r: "Fine. I said good. You said fine. We're having different evenings.", opts: [
        { tone: 'cold', t: "Fine is good.", r: "Fine is fine. Good is good. I'll leave you to your vocabulary.", m: -2 },
        { tone: 'passive', t: "Sorry. It was great. I'm rubbish at texts.", r: "You're not rubbish. You're careful. Be less careful with me." },
        { tone: 'flirty', t: "Fine was an understatement. It was perfect.", r: "Perfect. Don't. ...Do. It was. I'll deny it." },
      ] },
      { tone: 'passive', t: "It was really good. I'd love to do it again.", r: "Again. Yes. Same rules. You choose, I judge.", opts: [
        { tone: 'cold', t: "Your rules are a lot.", r: "They're a lot. They're also the reason you liked it." },
        { tone: 'passive', t: "Deal. Next week?", r: "Next week. Thursday. I'll keep it free. I don't keep things free." },
        { tone: 'flirty', t: "Next time I'll see you all the way home.", r: "All the way home. I'm on the twelfth floor. ...I'll take the stairs slowly." },
      ] },
      { tone: 'flirty', t: "Second only to a tailor. I'm honoured.", r: "You should be. My tailor is exceptional.", opts: [
        { tone: 'cold', t: "Lucky tailor.", r: "Very. Lucky you, too. You don't seem to notice." },
        { tone: 'passive', t: "I'll try to beat the tailor next time.", r: "Try. Bring better jokes. And that smile you had at the end." },
        { tone: 'flirty', t: "Your tailor won't get a goodnight kiss next time.", r: "...No. That's reserved. Exclusively. Don't tell the tailor." },
        { tone: 'risque', t: "Next time skip the tailor's coat. I'll keep you warm.", r: "Warm. Hm. ...I'll bring the coat. I might not wear it home." },
      ] },
    ] },

  // ---- date, warm 2: the morning after the second one - replaying one part ----------------------------------------
  { id: 'ice-text-date-warm-2-cold', on: 'date', stage: 'warm', slot: 2, mood: 'cold',
    say: "Half of you came out last night. The other half was elsewhere. I know, because all of me turned up.",
    opts: [
      { tone: 'cold', t: "Work stuff.", r: "Work. Of course. I'll go out with your work next time. It gets more attention." },
      { tone: 'passive', t: "That was rude of me. Sorry.", r: "It was. Thanks for owning it. Next time, bring all of you." },
      { tone: 'flirty', t: "Next time I'll only look at you.", r: "Every time. That's the condition. I'll be counting. As you know." },
      { tone: 'risque', t: "Next time, confiscate my phone. And me.", r: "Take you. Ha. ...Confiscation can be arranged. Thursday." },
    ] },
  { id: 'ice-text-date-warm-2-passive', on: 'date', stage: 'warm', slot: 2, mood: 'passive',
    say: "I'm at my desk replaying one part of last night. I won't say which part. You'll guess wrong anyway.",
    opts: [
      { tone: 'cold', t: "Probably the boring bits.", r: "There weren't any. Not one. You're being awkward deliberately." },
      { tone: 'passive', t: "The bit where we stopped talking?", r: "Close. Where you stopped talking and just looked. I liked that." },
      { tone: 'flirty', t: "The goodnight.", r: "...Lucky guess. It was a very good goodnight. Keep your head the same size." },
      { tone: 'risque', t: "Whichever part, I'll do it again. Longer.", r: "Longer. ...That's a dare in daylight. I'll answer it at dusk." },
    ] },
  { id: 'ice-text-date-warm-2-flirty', on: 'date', stage: 'warm', slot: 2, mood: 'flirty',
    say: "I've been awake since six replaying one part of last night. You know the part.",
    opts: [
      { tone: 'cold', t: "I don't, actually.", r: "Naturally you don't. You were there. Pay attention next time." },
      { tone: 'passive', t: "I've been replaying it too.", r: "Good. Then it's a shared hobby. I don't have hobbies. I have this." },
      { tone: 'flirty', t: "The goodbye.", r: "Yes. That. You were very sure of yourself. You were right." },
      { tone: 'risque', t: "Next time I won't stop at goodbye.", r: "...Don't text me that at work. Thursday. Bring that confidence." },
    ] },

  // ---- date, warm 3: the third evening - 'a pattern' ---------------------------------------------------------------
  { id: 'ice-text-date-warm-3-cold', on: 'date', stage: 'warm', slot: 3, mood: 'cold',
    say: "Third evening out. You went quiet at the end. I notice things like that. I'd rather not have noticed that one.",
    opts: [
      { tone: 'cold', t: "I'm a quiet person.", r: "You're not. You're quiet with me at the end. Different thing." },
      { tone: 'passive', t: "Sorry. Endings make me awkward.", r: "Awkward I can work with. Tell me next time. I'll do the ending." },
      { tone: 'flirty', t: "I go quiet because I don't want it to end.", r: "...That's a good reason. I'll stop being cross." },
    ] },
  { id: 'ice-text-date-warm-3-passive', on: 'date', stage: 'warm', slot: 3, mood: 'passive',
    say: "That's three evenings. My grandmother would call it a pattern. I'm still deciding what I call it.",
    opts: [
      { tone: 'cold', t: "Three dates. That's all.", r: "That's all. Of course. I'll stop deciding, then." },
      { tone: 'passive', t: "I'd call it a good habit.", r: "A good habit. A rare thing, for me. I'll keep this one." },
      { tone: 'flirty', t: "Call it what it is. Us.", r: "Us. ...That's a small word with a lot in it. I'll think about it. I am." },
      { tone: 'risque', t: "Make it four. Mine. Tonight.", r: "Tonight. Yours. ...Four is a pattern I'd allow. Nine o'clock." },
    ] },
  { id: 'ice-text-date-warm-3-flirty', on: 'date', stage: 'warm', slot: 3, mood: 'flirty',
    say: "Three evenings now. I've started dressing for you. Nobody's allowed to know. Especially you.",
    opts: [
      { tone: 'cold', t: "Didn't notice.", r: "You didn't notice. Excellent. I'll dress for myself, then." },
      { tone: 'passive', t: "You looked wonderful. I noticed.", r: "Thank you. I know you did. It was all over your face." },
      { tone: 'flirty', t: "I noticed. All evening. I couldn't stop.", r: "I know. That was the point. It worked. I'm insufferable now." },
      { tone: 'risque', t: "Next time, I'll be the one helping you out of your coat.", r: "...That's very forward. I'm not saying no. I'm saying it slowly." },
    ] },

  // ---- date, close 1 [deep]: the morning after - their fond list about you ------------------------------------------
  { id: 'ice-text-date-close-1-cold', on: 'date', stage: 'close', slot: 1, mood: 'cold',
    say: "Good morning. You were somewhere else last night, even right in front of me. I'd like to know where.",
    opts: [
      { tone: 'cold', t: "Nowhere. Just tired.", r: "Nowhere is a long way to go in one evening.", m: -3, opts: [
        { tone: 'cold', t: "Leave it.", r: "Left. Along with the rest of the morning.", m: -5 },
        { tone: 'passive', t: "Sorry. The season's in my head. It's not you.", r: "Then let me in there with it. I'm good company in a crisis." },
        { tone: 'flirty', t: "Wherever I was, I came back to you.", r: "Eventually. ...Fine. I'll take eventually. Kettle's on. Come and get some." },
      ] },
      { tone: 'passive', t: "Sorry. Racing stuff. I should have said.", r: "You should. I'd rather hear racing than silence. Talk racing to me any hour. I mean that.", opts: [
        { tone: 'cold', t: "Doesn't matter now.", r: "It does. Everything you don't say matters. Hm.", m: -4 },
        { tone: 'passive', t: "Tonight, then. I'll tell you everything.", r: "Everything. Over tea. I'll listen. I'm better at it than I look." },
        { tone: 'flirty', t: "You're the only place I want to be.", r: "Then be here. All of you. Not the shell. ...Thank you." },
      ] },
      { tone: 'flirty', t: "I was thinking about you. Even then.", r: "Then you have a strange way of showing it. Silently.", opts: [
        { tone: 'cold', t: "I don't perform for you.", r: "I'm not asking for a performance. I'm asking for you.", m: -4 },
        { tone: 'passive', t: "Let me show it better. Tonight.", r: "Tonight. Properly. Present. All of you." },
        { tone: 'flirty', t: "Silently. Then not so silently, later.", r: "...Later was better. I'll concede later. Noted, fondly." },
        { tone: 'risque', t: "Come over and I'll show you where I was.", r: "...It's eight in the morning. I have a meeting. ...I'll move the meeting." },
      ] },
    ] },
  { id: 'ice-text-date-close-1-passive', on: 'date', stage: 'close', slot: 1, mood: 'passive',
    say: "Good morning. I've started a list about you. Things I've noticed. Long. Fond. Don't ask to see it.",
    opts: [
      { tone: 'cold', t: "I'd rather not be listed.", r: "Too late. You're listed. In ink. I have a witness: me.", opts: [
        { tone: 'cold', t: "Then cross me off.", r: "I don't cross out. I observe. And I've observed enough to keep going.", m: -4 },
        { tone: 'passive', t: "Fine. Keep your list.", r: "Kept. That reaction's going on the fond side, anyway." },
        { tone: 'flirty', t: "Put me on the fond side.", r: "You're already on it. The whole page. Try to stay modest." },
      ] },
      { tone: 'passive', t: "What's on it so far?", r: "Private. ...Fine. One: you go quiet right before you say something true. Two is classified.", opts: [
        { tone: 'cold', t: "Bit of an odd list.", r: "It's a private list. You've just been told it. Never mind.", m: -4 },
        { tone: 'passive', t: "What's number two?", r: "The way you look at me when you think I'm not looking. I always am. That's three." },
        { tone: 'flirty', t: "Add that I'll never stop looking.", r: "Added. Underlined. In ink. ...That one's my favourite." },
        { tone: 'risque', t: "Add that I'll keep you up tonight.", r: "Added. Pencilled. To be confirmed in person. Thoroughly." },
      ] },
      { tone: 'flirty', t: "Long and fond? Read me some.", r: "No. It's not for reading. It's for keeping. ...One: you say my name like a question you know the answer to.", opts: [
        { tone: 'cold', t: "I don't do that.", r: "You do. Every time. I'll stop telling you things you do.", m: -4 },
        { tone: 'passive', t: "That's lovely. I didn't know.", r: "Of course you didn't. That's why it's on the list." },
        { tone: 'flirty', t: "Because I do know the answer.", r: "...That's going on the list too. The list is getting out of hand." },
        { tone: 'risque', t: "Come over. I'll say it again. Slowly.", r: "Slowly. ...I've a meeting at ten. I'll be late. Don't move." },
      ] },
    ] },
  { id: 'ice-text-date-close-1-flirty', on: 'date', stage: 'close', slot: 1, mood: 'flirty',
    say: "Good morning. Up since six with tea, thinking about you. Don't reply yet. I'm enjoying the thinking.",
    opts: [
      { tone: 'cold', t: "Replying anyway.", r: "Ah. Then the moment's over. Back to my tea.", m: -2, opts: [
        { tone: 'cold', t: "Thanks.", r: "Thanks. One word, at eight. I'll go to work.", m: -4 },
        { tone: 'passive', t: "Sorry. Think about me a bit longer?", r: "Five more minutes. I'll be late. I'm never late." },
        { tone: 'flirty', t: "Come and think about me up close.", r: "Up close is a different activity. ...Coming." },
      ] },
      { tone: 'passive', t: "Think away. I'll pretend I haven't read this.", r: "You pretend badly. It's obvious even by text. That's listed.", opts: [
        { tone: 'cold', t: "What list?", r: "Never mind. Drink your tea.", m: -3 },
        { tone: 'passive', t: "You have a list about me?", r: "A section. Lengthy. Fond. Private." },
        { tone: 'flirty', t: "Come here and read it to me.", r: "That's not how it works. ...It might be how it works. One minute." },
      ] },
      { tone: 'flirty', t: "Come over. Bring the tea.", r: "The tea will go cold. ...I don't care. I'm coming.", opts: [
        { tone: 'cold', t: "Actually, I'm heading out.", r: "Of course. Out, then. The moment's gone. Tea's in the pot.", m: -4 },
        { tone: 'passive', t: "Good. I'll make the next pot.", r: "Black. Nothing in it. And no toast. I don't trust you with toast yet." },
        { tone: 'flirty', t: "Leave the tea. Bring yourself.", r: "...Abandoning tea. For you. Nobody will believe me." },
        { tone: 'risque', t: "Forget the tea. I'm warmer.", r: "Tea forgotten. Meetings postponed. ...On my way." },
      ] },
    ] },

  // ---- date, close 2: at their desk, pretending last night didn't happen ------------------------------------------
  { id: 'ice-text-date-close-2-cold', on: 'date', stage: 'close', slot: 2, mood: 'cold',
    say: "At my desk, pretending last night didn't happen. After how it ended, that's going rather well.",
    opts: [
      { tone: 'cold', t: "Lucky you.", r: "Lucky me. Yes. Wonderful. I'll carry on, then.", m: -5 },
      { tone: 'passive', t: "I'm sorry about how it ended. Can we talk tonight?", r: "Tonight. Yes. I'd like that. I'm cross, not gone." },
      { tone: 'flirty', t: "Let me give you a better ending to replay.", r: "A better ending. ...You'll have to work for it. Start at seven." },
      { tone: 'risque', t: "Come over tonight. I'll end it properly.", r: "Properly. ...That's a dare. I'm cross enough to accept it." },
    ] },
  { id: 'ice-text-date-close-2-passive', on: 'date', stage: 'close', slot: 2, mood: 'passive',
    say: "I'm at my desk pretending last night didn't happen. It's going terribly.",
    opts: [
      { tone: 'cold', t: "Focus on work.", r: "Excellent advice. I'll file it with the others I've ignored." },
      { tone: 'passive', t: "Same here. Completely useless today.", r: "Good. Then we're both ruined. That's fair." },
      { tone: 'flirty', t: "Which part keeps coming back?", r: "The beginning. The middle. The end. All of it, frankly." },
      { tone: 'risque', t: "Leave early and come over. We'll make tonight harder to forget.", r: "...I've closed my laptop. My colleague asked if I'm ill. Five o'clock." },
    ] },
  { id: 'ice-text-date-close-2-flirty', on: 'date', stage: 'close', slot: 2, mood: 'flirty',
    say: "At my desk. Replaying last night. My colleagues think I'm reading a report. I'm not reading a report.",
    opts: [
      { tone: 'cold', t: "Better read the report.", r: "Spoilsport. I'll read it. Badly." },
      { tone: 'passive', t: "I keep smiling at my phone.", r: "So do I. We're both a disgrace. I don't mind." },
      { tone: 'flirty', t: "Tell me which part you're stuck on.", r: "No. You'd only do it again. ...Do it again." },
      { tone: 'risque', t: "Skip the report. Come over at lunch.", r: "At lunch. ...A first. I'm putting my coat on." },
    ] },

  // ---- date, close 3: the sentence they nearly said last night ---------------------------------------
  { id: 'ice-text-date-close-3-cold', on: 'date', stage: 'close', slot: 3, mood: 'cold',
    say: "Last night I nearly said something. Then you went cool on me at the end, so I kept it. It's getting heavy.",
    opts: [
      { tone: 'cold', t: "Then keep it.", r: "Keep it. Fine. I keep things well. That's how this works, apparently." },
      { tone: 'passive', t: "Sorry. Say it now.", r: "'I don't know how to do this halfway.' That's it. That's the sentence. Your turn." },
      { tone: 'flirty', t: "Say it. All of it.", r: "'I'd rather not do any of this without you.' There. Tell me I wasn't wrong to." },
    ] },
  { id: 'ice-text-date-close-3-passive', on: 'date', stage: 'close', slot: 3, mood: 'passive',
    say: "Last night I nearly said a sentence. I didn't. I've been finishing it all morning. It's a good sentence.",
    opts: [
      { tone: 'cold', t: "Then say it.", r: "Not by text. It's mine until I'm braver." },
      { tone: 'passive', t: "How does it end?", r: "'—and I'm glad it's you.' I may have edited. Only slightly." },
      { tone: 'flirty', t: "Say it to me tonight.", r: "Tonight. In person. All the way to the full stop. You'll have to listen." },
      { tone: 'risque', t: "Say it tonight. I'll keep you up till you do.", r: "...That's a plan, not a sentence. I approve. I'll stay awake too." },
    ] },
  { id: 'ice-text-date-close-3-flirty', on: 'date', stage: 'close', slot: 3, mood: 'flirty',
    say: "Still thinking about last night. My concentration's ruined. I haven't read a whole email since. Worth it.",
    opts: [
      { tone: 'cold', t: "Read your emails.", r: "I could. I won't. I don't regret it. You might, saying that." },
      { tone: 'passive', t: "Sorry about your inbox.", r: "My inbox forgives you. So do I. It was a very good evening." },
      { tone: 'flirty', t: "Best distraction you've ever had?", r: "I don't get distracted. ...I do now. Exclusively by you." },
      { tone: 'risque', t: "Tonight I'll ruin your concentration properly.", r: "Properly. ...My inbox and I accept. The rest of me, more so." },
    ] },
  // ---- win 1 [deep]: your first win -------------------------------------------------------------------------------
  { id: 'ice-text-win-any-1-cold', on: 'win', stage: 'any', slot: 1, mood: 'cold',
    say: "A win at {last}. Congratulations. I'm being brief, since brief is what you seem to like.",
    opts: [
      { tone: 'cold', t: "Thanks for that.", r: "You're welcome. That concludes the ceremony.", opts: [
        { tone: 'cold', t: "Short ceremony.", r: "You set the length. I only follow instructions. Goodnight." },
        { tone: 'passive', t: "Sorry. It means a lot that you watched.", r: "I watched every lap. I'd have said more if you'd asked." },
        { tone: 'flirty', t: "I'll take a longer ceremony in person.", r: "In person. Hm. There might be a speech. Very short. Very warm." },
      ] },
      { tone: 'passive', t: "Thank you. I can't believe it.", r: "Believe it. I saw it. I don't make mistakes about what I see.", opts: [
        { tone: 'cold', t: "Just a race.", r: "It's not just a race. Don't do that. Enjoy it." },
        { tone: 'passive', t: "Did you watch the whole thing?", r: "Every lap. Standing up, at the end. Alone. Don't spread it around." },
        { tone: 'flirty', t: "Celebrate with me?", r: "Quietly. Tea. Somewhere the cameras aren't. Yes." },
      ] },
      { tone: 'flirty', t: "Were you proud of me?", r: "I'm proud of very few things. You're on a short list. Briefly.", opts: [
        { tone: 'cold', t: "Briefly. Right.", r: "Briefly is honest. You've been brief with me lately." },
        { tone: 'passive', t: "That means a lot.", r: "It should. I don't say it twice. ...Well done. That's twice." },
        { tone: 'flirty', t: "Keep me on the list.", r: "You're there. In pen. Don't make me reach for the eraser." },
      ] },
    ] },
  { id: 'ice-text-win-any-1-passive', on: 'win', stage: 'any', slot: 1, mood: 'passive',
    say: "You won at {last}. I watched every lap and said nothing out loud. In my house, that's a standing ovation.",
    opts: [
      { tone: 'cold', t: "Cheers.", r: "Cheers. Very understated. I approve. I'm also slightly disappointed.", opts: [
        { tone: 'cold', t: "Understated's my style.", r: "It's mine too. Two understated people. Nobody will ever know we're happy." },
        { tone: 'passive', t: "Sorry. Thank you. Really.", r: "Better. You won. Let yourself have it." },
        { tone: 'flirty', t: "Did you actually stand up?", r: "At the last corner. Briefly. I sat down again. Nobody saw." },
      ] },
      { tone: 'passive', t: "Thank you. Still shaking.", r: "Good. Shake. You've earned it. That pass at the end was beautiful.", opts: [
        { tone: 'cold', t: "It was alright.", r: "It was beautiful. I don't use that word lightly. Don't argue." },
        { tone: 'passive', t: "You noticed that pass?", r: "I noticed everything. I'll tell you the rest when you've slept." },
        { tone: 'flirty', t: "I was thinking of you on the last lap.", r: "Don't. You should be thinking about the car. ...Thank you." },
      ] },
      { tone: 'flirty', t: "A standing ovation from you? I'm honoured.", r: "Silent and seated. Make no mistake. It's the highest honour I give.", opts: [
        { tone: 'cold', t: "Seems quiet for an ovation.", r: "All my ovations are quiet. You'll learn to hear them." },
        { tone: 'passive', t: "Then I'll treasure it.", r: "Do. It's rarer than the trophy." },
        { tone: 'flirty', t: "I want the loud version in person.", r: "Loud. From me. ...Perhaps. Behind a closed door. Once." },
      ] },
    ] },
  { id: 'ice-text-win-any-1-flirty', on: 'win', stage: 'any', slot: 1, mood: 'flirty',
    say: "First place. You looked unbearably pleased with yourself up there. I approved, from a distance.",
    opts: [
      { tone: 'cold', t: "I was pleased.", r: "Clearly. It suited you. Most things don't.", opts: [
        { tone: 'cold', t: "Thanks, I think.", r: "It was a compliment. Wrapped in barbed wire. My speciality." },
        { tone: 'passive', t: "It's been a long time coming.", r: "It has. I saw you wait for it. Patience looks good on you." },
        { tone: 'flirty', t: "Approve from closer next time.", r: "Closer. Hm. Pending. Very much pending." },
      ] },
      { tone: 'passive', t: "Thank you. It's sinking in.", r: "Let it sink. Don't rush it. Some things are meant to be slow.", opts: [
        { tone: 'cold', t: "I don't do slow.", r: "On track. Off it, you'll learn." },
        { tone: 'passive', t: "Good advice. I'll try.", r: "I'm full of good advice. Ignore most of it. Keep that one." },
        { tone: 'flirty', t: "Slow, like you.", r: "Like me. Exactly. ...You've noticed. Annoying." },
      ] },
      { tone: 'flirty', t: "Only from a distance?", r: "For now. Distance is how I watch things I like.", opts: [
        { tone: 'cold', t: "Keep your distance, then.", r: "I will. Distance is a speciality. You'll see." },
        { tone: 'passive', t: "I'm glad you watched.", r: "I'm glad you won. That's the order of my feelings tonight." },
        { tone: 'flirty', t: "Close the distance. Come celebrate.", r: "Quietly. Somewhere dark. With tea. Leaving now." },
      ] },
    ] },

  // ---- win 2: again --------------------------------------------------------------------------------------------
  { id: 'ice-text-win-any-2-cold', on: 'win', stage: 'any', slot: 2, mood: 'cold',
    say: "{result} at {last}. Well driven. I'll say more when you're warmer with me.",
    opts: [
      { tone: 'cold', t: "Fair enough.", r: "It is. Enjoy it. I mean that, coldly." },
      { tone: 'passive', t: "Thank you. I'll call you tonight.", r: "Then I'll say more tonight. There's quite a lot." },
      { tone: 'flirty', t: "I'll warm up. Say the rest.", r: "The rest is: magnificent. There. You've been warned." },
    ] },
  { id: 'ice-text-win-any-2-passive', on: 'win', stage: 'any', slot: 2, mood: 'passive',
    say: "Winning again. I've stopped pretending not to watch. Well done.",
    opts: [
      { tone: 'cold', t: "You can keep pretending.", r: "I could. It's tiring. You're too good to pretend about." },
      { tone: 'passive', t: "Thank you. Glad you watched.", r: "So am I. Second time. I'm becoming a fan. Don't tell anyone." },
      { tone: 'flirty', t: "Admit you cheered.", r: "A small noise. Involuntary. The neighbour knocked. Worth it." },
    ] },
  { id: 'ice-text-win-any-2-flirty', on: 'win', stage: 'any', slot: 2, mood: 'flirty',
    say: "You won. Again. I'm running out of ways to be unimpressed.",
    opts: [
      { tone: 'cold', t: "Keep trying.", r: "I am. You're making it impossible. Infuriating." },
      { tone: 'passive', t: "Thank you. Doesn't get old.", r: "It won't, for me either. That's a surprise." },
      { tone: 'flirty', t: "Be impressed, then. Out loud.", r: "Out loud. ...I'm impressed. That's as loud as I go." },
    ] },

  // ---- win 3: 'a habit' -----------------------------------------------------------------------------------------
  { id: 'ice-text-win-any-3-cold', on: 'win', stage: 'any', slot: 3, mood: 'cold',
    say: "Another win. It's becoming a habit. So is your distance.",
    opts: [
      { tone: 'cold', t: "Both habits, then.", r: "Both. Only one of them is admirable." },
      { tone: 'passive', t: "I'm sorry. I'll be better off track.", r: "Do. You're very good on it. Be half as good with me." },
      { tone: 'flirty', t: "Break my other habit for me.", r: "I'll try. It requires your cooperation. In person." },
    ] },
  { id: 'ice-text-win-any-3-passive', on: 'win', stage: 'any', slot: 3, mood: 'passive',
    say: "You're making a habit of winning. I approve of good habits. I have very few.",
    opts: [
      { tone: 'cold', t: "It's my job.", r: "It's your job to try. Winning is extra. Take the compliment." },
      { tone: 'passive', t: "Thanks. What are yours?", r: "Tea at seven. Piano at two. Watching you on Sundays." },
      { tone: 'flirty', t: "I'll be one of your habits.", r: "You may be already. I'm investigating." },
    ] },
  { id: 'ice-text-win-any-3-flirty', on: 'win', stage: 'any', slot: 3, mood: 'flirty',
    say: "Win number three. At this rate I'll have to admit I'm proud of you. Not yet. Nearly.",
    opts: [
      { tone: 'cold', t: "No rush.", r: "Good. I'm never rushed. You're welcome to wait." },
      { tone: 'passive', t: "Nearly is good enough.", r: "Nearly is generous, from me. You know that." },
      { tone: 'flirty', t: "Say it. I can take it.", r: "...I'm proud of you. There. Never again. Possibly once more." },
    ] },

  // ---- podium 1 -----------------------------------------------------------------------------------------------
  { id: 'ice-text-podium-any-1-cold', on: 'podium', stage: 'any', slot: 1, mood: 'cold',
    say: "Podium at {last}. Well driven. That's all, unless you'd like more.",
    opts: [
      { tone: 'cold', t: "That's enough.", r: "Good. Brief suits us both." },
      { tone: 'passive', t: "I'd like more, actually.", r: "Then: your restart was perfect. Your face on the podium, slightly less." },
      { tone: 'flirty', t: "More. Always more.", r: "Greedy. Fine. You looked very good up there. That's more." },
    ] },
  { id: 'ice-text-podium-any-1-passive', on: 'podium', stage: 'any', slot: 1, mood: 'passive',
    say: "{result}. Not the top step, but you stood on yours as though you owned the building.",
    opts: [
      { tone: 'cold', t: "Should have been the top.", r: "Probably. Next time. Today was still good. Let it be." },
      { tone: 'passive', t: "Thank you. Happy with it.", r: "You should be. I am. Quietly." },
      { tone: 'flirty', t: "Did I look good up there?", r: "You looked smug. Smug suits you. Don't tell anyone I said so." },
    ] },
  { id: 'ice-text-podium-any-1-flirty', on: 'podium', stage: 'any', slot: 1, mood: 'flirty',
    say: "On the podium you scanned the crowd like you were looking for someone. Were you?",
    opts: [
      { tone: 'cold', t: "Looking for my team.", r: "Your team. Of course. They were on the left. You looked right." },
      { tone: 'passive', t: "Maybe. Were you there?", r: "No. I was watching. Closely. That's nearly as good." },
      { tone: 'flirty', t: "Looking for you.", r: "...I was at home. Watching you look. It was very effective." },
    ] },

  // ---- podium 2 [deep] -------------------------------------------------------------------------------------------
  { id: 'ice-text-podium-any-2-cold', on: 'podium', stage: 'any', slot: 2, mood: 'cold',
    say: "Another podium. You're very consistent. With me as well, lately. Consistently distant.",
    opts: [
      { tone: 'cold', t: "That's how I am.", r: "On track it's a gift. Off it, less so.", opts: [
        { tone: 'cold', t: "Take it or leave it.", r: "I'll take the podium. I'll leave the rest." },
        { tone: 'passive', t: "I'll do better. Sorry.", r: "Thank you. Start by telling me how it felt up there." },
        { tone: 'flirty', t: "Let me be consistent with you instead.", r: "Consistently warm. I'd like that. I'd like it tonight." },
      ] },
      { tone: 'passive', t: "Sorry. It's been a heavy few weeks.", r: "I know. I watched it on your face. Well done today, though.", opts: [
        { tone: 'cold', t: "Doesn't feel like much.", r: "It's a podium. It's a lot. Stop discounting yourself." },
        { tone: 'passive', t: "Thank you. Talk tonight?", r: "Tonight. I'll be awake. I always am." },
        { tone: 'flirty', t: "Your face is the one I want to see.", r: "Then come and see it. It's softer than usual. Your fault." },
      ] },
      { tone: 'flirty', t: "Consistently yours, though.", r: "Then show it. You've been sparing with it.", opts: [
        { tone: 'cold', t: "I'm showing it.", r: "Very faintly. I need a stronger lens.", m: -2 },
        { tone: 'passive', t: "You're right. I will.", r: "Good. I'll hold you to it. Gently. Firmly." },
        { tone: 'flirty', t: "Tonight. All of it.", r: "All of it. Fine. I'll stop sulking. Well driven, by the way." },
      ] },
    ] },
  { id: 'ice-text-podium-any-2-passive', on: 'podium', stage: 'any', slot: 2, mood: 'passive',
    say: "Second podium. You stand very still up there. Still is your best angle.",
    opts: [
      { tone: 'cold', t: "Still is just tired.", r: "Tired and still. Fine. It looks like composure from here.", opts: [
        { tone: 'cold', t: "It's not.", r: "Then let it look like it. Nobody needs to know." },
        { tone: 'passive', t: "Composure's a good look.", r: "It's my only look. I'm glad to share it." },
        { tone: 'flirty', t: "You'd know composure.", r: "I'm the authority. You're my best student. Lately." },
      ] },
      { tone: 'passive', t: "Thanks. It felt good.", r: "It looked good. I watched the replay. For accuracy.", opts: [
        { tone: 'cold', t: "Just the replay?", r: "Twice. Accuracy matters." },
        { tone: 'passive', t: "What did the replay show?", r: "A driver who's stopped doubting. It's a very good look." },
        { tone: 'flirty', t: "Watch me in person next time.", r: "In person. The noise. The people. ...For you. Once." },
      ] },
      { tone: 'flirty', t: "And what's my best angle off it?", r: "Leaving a room slowly. Looking back once.", opts: [
        { tone: 'cold', t: "I don't look back.", r: "You do. Every time. I notice." },
        { tone: 'passive', t: "I'll remember that.", r: "Don't. It works because you don't know you do it." },
        { tone: 'flirty', t: "Only when you're in it.", r: "...Then I'll make sure I'm in it. Every room." },
      ] },
    ] },
  { id: 'ice-text-podium-any-2-flirty', on: 'podium', stage: 'any', slot: 2, mood: 'flirty',
    say: "On the podium you sprayed the photographer instead of the others. I laughed out loud. In public. Unforgivable.",
    opts: [
      { tone: 'cold', t: "It was an accident.", r: "Accidents are your best material. Don't ruin it.", opts: [
        { tone: 'cold', t: "I'm not material.", r: "Everyone is material. You're simply the best kind." },
        { tone: 'passive', t: "Okay. It was a bit on purpose.", r: "I knew it. You looked delighted. So was I." },
        { tone: 'flirty', t: "Forgive me in person.", r: "In person. Slowly. ...I've already forgiven you. I'm only pretending." },
      ] },
      { tone: 'passive', t: "Where were you?", r: "A café. With strangers. Who now think I'm a person who laughs. I'm ruined.", opts: [
        { tone: 'cold', t: "You'll recover.", r: "I will. My reputation won't." },
        { tone: 'passive', t: "You do laugh, though.", r: "Only at you. It's a narrow audience. You're it." },
        { tone: 'flirty', t: "I'll make you laugh again. Somewhere private.", r: "Private. Yes. My reputation can't take public." },
      ] },
      { tone: 'flirty', t: "You laughed. That's my real trophy.", r: "Cheap line. It works. Very annoying.", opts: [
        { tone: 'cold', t: "Not a line.", r: "Then it's worse. It's true. Goodnight." },
        { tone: 'passive', t: "Okay, a bit of a line. But true.", r: "True lines are the most dangerous kind." },
        { tone: 'flirty', t: "Come and laugh at me in person.", r: "I'll come. I'll try not to. I'll fail." },
      ] },
    ] },

  // ---- podium 3: 'a habit' -------------------------------------------------------------------------------------
  { id: 'ice-text-podium-any-3-cold', on: 'podium', stage: 'any', slot: 3, mood: 'cold',
    say: "Third podium. Your consistency is admirable. It's the one thing I'll admire tonight.",
    opts: [
      { tone: 'cold', t: "I'll take it.", r: "Take it. It's all that's on offer." },
      { tone: 'passive', t: "I'm sorry. Can I fix tonight?", r: "You can try. Start with tea. I'll soften. Probably." },
      { tone: 'flirty', t: "Admire me in person. I'll earn the rest.", r: "Earn it. You know the rate. It hasn't changed." },
    ] },
  { id: 'ice-text-podium-any-3-passive', on: 'podium', stage: 'any', slot: 3, mood: 'passive',
    say: "Another trophy. You're running out of shelf. I'd suggest fewer, better ones. That's not possible, I know.",
    opts: [
      { tone: 'cold', t: "I'll get another shelf.", r: "Practical. Unromantic. Correct." },
      { tone: 'passive', t: "Thanks. Three in a row now.", r: "Three. A pattern. I approve of patterns. When they're good." },
      { tone: 'flirty', t: "Keep one at yours.", r: "On my piano. It'd look smug there. I'll allow it." },
    ] },
  { id: 'ice-text-podium-any-3-flirty', on: 'podium', stage: 'any', slot: 3, mood: 'flirty',
    say: "Podium number three. I've started a ritual. It involves tea and not admitting I'm nervous.",
    opts: [
      { tone: 'cold', t: "Nothing to be nervous about.", r: "There's everything. You just don't see it. I do." },
      { tone: 'passive', t: "You get nervous for me?", r: "Very slightly. During restarts. Don't tell anyone." },
      { tone: 'flirty', t: "Let me be part of the ritual.", r: "You're the reason for it. That's quite a part." },
    ] },

  // ---- points 1 [deep] ------------------------------------------------------------------------------------------
  { id: 'ice-text-points-any-1-cold', on: 'points', stage: 'any', slot: 1, mood: 'cold',
    say: "{result}. You took the points and said nothing on the radio. Very like you, lately.",
    opts: [
      { tone: 'cold', t: "Nothing to report.", r: "There's always something. You just keep it.", opts: [
        { tone: 'cold', t: "Then I'll keep it.", r: "Do. I'll keep mine too. Very quiet evening." },
        { tone: 'passive', t: "Okay. It was a tough race.", r: "It looked tough. You drove it well. That's something." },
        { tone: 'flirty', t: "Saving it for you.", r: "Then spend it. Tonight. I'm listening." },
      ] },
      { tone: 'passive', t: "Points are points. I'll take them.", r: "Sensible. Grown-up. I approve.", opts: [
        { tone: 'cold', t: "Not very exciting.", r: "Exciting is overrated. Sensible pays the rent." },
        { tone: 'passive', t: "Did you watch?", r: "All of it. You defended well. Quietly. Very familiar." },
        { tone: 'flirty', t: "Approve of me more.", r: "Steady on. I approve of the drive. You're under separate review." },
      ] },
      { tone: 'flirty', t: "You noticed I was quiet?", r: "I notice all your silences. Some are better than others.", opts: [
        { tone: 'cold', t: "This one's nothing.", r: "Nothing. Fine. I'll leave it alone." },
        { tone: 'passive', t: "This one's just tired.", r: "Then sleep. I'll still be here. Watching, apparently." },
        { tone: 'flirty', t: "Which silence is your favourite?", r: "The one just before you kiss someone. I suspect. ...Hm." },
      ] },
    ] },
  { id: 'ice-text-points-any-1-passive', on: 'points', stage: 'any', slot: 1, mood: 'passive',
    say: "{result}. Not a fireworks race. A good, sensible, grown-up drive. I approve of grown-up.",
    opts: [
      { tone: 'cold', t: "Boring, you mean.", r: "I don't mean boring. I'd say boring. I say what I mean.", opts: [
        { tone: 'cold', t: "Sure.", r: "Sure. Fine. Enjoy your grown-up evening." },
        { tone: 'passive', t: "Okay. Thank you.", r: "You're welcome. It was very well judged." },
        { tone: 'flirty', t: "Grown-up suits me?", r: "It suits you. Don't let it go too far. I like the childish parts too." },
      ] },
      { tone: 'passive', t: "Thanks. Car wasn't great.", r: "I could tell. You made it look better than it was.", opts: [
        { tone: 'cold', t: "It was awful.", r: "It was. You weren't. Separate things." },
        { tone: 'passive', t: "Glad it showed.", r: "It showed to me. I'm the only audience that matters." },
        { tone: 'flirty', t: "You were watching me closely.", r: "Always. It's very tiring. You're very worth it." },
      ] },
      { tone: 'flirty', t: "Grown-up off track too?", r: "Only in public. In private, we'll see.", opts: [
        { tone: 'cold', t: "Not tonight.", r: "Not tonight. Fine. Grown-up it is." },
        { tone: 'passive', t: "I'll call you later.", r: "Do. I'll answer. That's a grown-up thing to do." },
        { tone: 'flirty', t: "I'll show you how childish I can be.", r: "...I'm intrigued. Against my better judgement." },
      ] },
    ] },
  { id: 'ice-text-points-any-1-flirty', on: 'points', stage: 'any', slot: 1, mood: 'flirty',
    say: "Points at {last}. You passed someone round the outside and I made a noise. Undignified. Your fault.",
    opts: [
      { tone: 'cold', t: "Sorry for the noise.", r: "You're not. And neither am I, entirely.", opts: [
        { tone: 'cold', t: "Fair.", r: "Fair. Goodnight." },
        { tone: 'passive', t: "What kind of noise?", r: "Short. High. I'd rather not describe it. The neighbour heard." },
        { tone: 'flirty', t: "I'd love to hear it again.", r: "Then pass someone else. Outside. I'll try to control myself." },
      ] },
      { tone: 'passive', t: "That pass was the best bit.", r: "It was. You'd been waiting for it for ten laps. I saw you plan it.", opts: [
        { tone: 'cold', t: "Just instinct.", r: "Planned instinct. I know the type. I'm the type." },
        { tone: 'passive', t: "You really watch closely.", r: "I watch you closely. The race is incidental." },
        { tone: 'flirty', t: "I plan everything. Including you.", r: "Including me. Hm. What's lap ten?" },
      ] },
      { tone: 'flirty', t: "Make that noise in person sometime.", r: "In person. Hm. You'd have to earn it.", opts: [
        { tone: 'cold', t: "Not that bothered.", r: "No? Then I'll keep it for the neighbour." },
        { tone: 'passive', t: "I'll try.", r: "Try is all I ask. Mostly. I ask a lot." },
        { tone: 'flirty', t: "Challenge accepted.", r: "Accepted. I'll be very difficult. Good luck." },
      ] },
    ] },

  // ---- points 2 -------------------------------------------------------------------------------------------------
  { id: 'ice-text-points-any-2-cold', on: 'points', stage: 'any', slot: 2, mood: 'cold',
    say: "{result}. Fine. That seems to be the word for things this week.",
    opts: [
      { tone: 'cold', t: "Fine is fine.", r: "Hm. Fine." },
      { tone: 'passive', t: "Not just fine. Let's talk tonight.", r: "Tonight. Good. I'd like more than fine." },
      { tone: 'flirty', t: "You're more than fine.", r: "So are you. We've both been lazy with words." },
    ] },
  { id: 'ice-text-points-any-2-passive', on: 'points', stage: 'any', slot: 2, mood: 'passive',
    say: "{result} again. Steady. Steady is underrated. I'm steady. Nobody notices either.",
    opts: [
      { tone: 'cold', t: "Steady doesn't win.", r: "Steady wins eventually. I've watched it happen." },
      { tone: 'passive', t: "I notice you.", r: "...Thank you. I notice that you notice." },
      { tone: 'flirty', t: "Steady together, then.", r: "Steady together. The most romantic dull thing anyone's said." },
    ] },
  { id: 'ice-text-points-any-2-flirty', on: 'points', stage: 'any', slot: 2, mood: 'flirty',
    say: "{result}. Not glamorous. I watched anyway. I watched you more than the race.",
    opts: [
      { tone: 'cold', t: "Watch the race next time.", r: "I'll try. I'll fail. You're very distracting in a helmet." },
      { tone: 'passive', t: "Thanks for watching.", r: "Always. Every week. It's on my calendar in pen." },
      { tone: 'flirty', t: "I'll give you more to watch.", r: "You always do. That's the trouble." },
    ] },

  // ---- points 3: 'a habit' --------------------------------------------------------------------------------------
  { id: 'ice-text-points-any-3-cold', on: 'points', stage: 'any', slot: 3, mood: 'cold',
    say: "Points again. Reliable. You're reliable on track, at least.",
    opts: [
      { tone: 'cold', t: "At least.", r: "At least. Yes. That's where we are." },
      { tone: 'passive', t: "I'll be reliable off track too.", r: "Show me. I'm generous with second chances. Not third." },
      { tone: 'flirty', t: "Rely on me tonight.", r: "Tonight. Fine. Prove it." },
    ] },
  { id: 'ice-text-points-any-3-passive', on: 'points', stage: 'any', slot: 3, mood: 'passive',
    say: "Another points finish. You're making a habit of being solid. It's an underrated quality in a person.",
    opts: [
      { tone: 'cold', t: "Solid. Thrilling.", r: "Thrilling is cheap. Solid is rare." },
      { tone: 'passive', t: "I'll take solid.", r: "Good. It suits you. It suits me too." },
      { tone: 'flirty', t: "Solid and charming?", r: "Solid. The charm's still under review. It's passing." },
    ] },
  { id: 'ice-text-points-any-3-flirty', on: 'points', stage: 'any', slot: 3, mood: 'flirty',
    say: "Points, again. I've started cheering for {result} as if it's a win. Don't tell anyone.",
    opts: [
      { tone: 'cold', t: "It's not a win.", r: "It is to me. Let me have it." },
      { tone: 'passive', t: "Your secret's safe.", r: "Good. My secrets are few. You're most of them." },
      { tone: 'flirty', t: "I'll win just to hear you cheer louder.", r: "You won't hear it. You'll see it. In my face. If you're close enough." },
    ] },

  // ---- bad 1: outside the points ------------------------------------------------------------------------------
  { id: 'ice-text-bad-any-1-cold', on: 'bad', stage: 'any', slot: 1, mood: 'cold',
    say: "{result} at {last}. I'm not going to ask how you are. You'd only say 'fine'.",
    opts: [
      { tone: 'cold', t: "Fine. Honestly.", r: "There it is. 'Fine'. With a garnish." },
      { tone: 'passive', t: "Not fine. Rough day.", r: "Thank you. That's honest. Rough days end. I'll be here when it does." },
      { tone: 'flirty', t: "Better now you've texted.", r: "Smooth, for a bad day. I'll allow it. Rest." },
    ] },
  { id: 'ice-text-bad-any-1-passive', on: 'bad', stage: 'any', slot: 1, mood: 'passive',
    say: "Outside the points today. It happens. I've seen you drive better and look worse. Neither lasts.",
    opts: [
      { tone: 'cold', t: "Thanks for the analysis.", r: "You're welcome. Analysis is how I show I care. Badly." },
      { tone: 'passive', t: "That actually helps. Thanks.", r: "Good. I'm not usually useful. Note it." },
      { tone: 'flirty', t: "Look worse? Ouch.", r: "You looked furious. Furious suits you. Better than defeated." },
    ] },
  { id: 'ice-text-bad-any-1-flirty', on: 'bad', stage: 'any', slot: 1, mood: 'flirty',
    say: "{result}. The car was dreadful. You weren't. I watched you fight it the whole way.",
    opts: [
      { tone: 'cold', t: "Didn't help.", r: "No. It didn't. It was still worth watching." },
      { tone: 'passive', t: "Means a lot that you noticed.", r: "I notice everything. This time it was worth noticing." },
      { tone: 'flirty', t: "Come and help me forget it.", r: "Tea. My place. I won't say a word about the car." },
    ] },

  // ---- bad 2 [deep]: again --------------------------------------------------------------------------------------
  { id: 'ice-text-bad-any-2-cold', on: 'bad', stage: 'any', slot: 2, mood: 'cold',
    say: "Another hard one at {last}. You'll want silence. I'm good at silence. I'll send it now, after this.",
    opts: [
      { tone: 'cold', t: "Silence is good.", r: "Then here it is.", opts: [
        { tone: 'cold', t: "Appreciated.", r: "." },
        { tone: 'passive', t: "Actually, wait. Stay a minute.", r: "...Staying. A minute. More, if you like." },
        { tone: 'flirty', t: "Silence with you, though.", r: "With me. Fine. I'll be quiet next to you. That's different." },
      ] },
      { tone: 'passive', t: "Don't go silent. I'd like the company.", r: "Then you have it. No advice. Just company.", opts: [
        { tone: 'cold', t: "Not much to say.", r: "Then say nothing. I'm still here." },
        { tone: 'passive', t: "Thank you. Tell me about your day.", r: "Dull. A meeting. Tea. Watching you struggle. The last part was hard." },
        { tone: 'flirty', t: "You're good company.", r: "I'm excellent company. Nobody gets to find out. Except you." },
      ] },
      { tone: 'flirty', t: "I'd rather have you than silence.", r: "You can't have me tonight. You can have this. It's long for me.", opts: [
        { tone: 'cold', t: "Fair point.", r: "Fair. Rest." },
        { tone: 'passive', t: "This is enough. Thank you.", r: "It's not enough. It's what I have. You'll get the rest Saturday." },
        { tone: 'flirty', t: "Saturday, then. All of you.", r: "Saturday. All of me. Even the bits that sulk about your car." },
      ] },
    ] },
  { id: 'ice-text-bad-any-2-passive', on: 'bad', stage: 'any', slot: 2, mood: 'passive',
    say: "{last} was unkind. Again. Tell me one thing that went right. There's always one.",
    opts: [
      { tone: 'cold', t: "Nothing.", r: "There's always one. You're refusing to look.", opts: [
        { tone: 'cold', t: "Ask me tomorrow.", r: "Tomorrow, then. I'll ask again." },
        { tone: 'passive', t: "Okay. The start was good.", r: "The start was very good. I saw. Hold onto that." },
        { tone: 'flirty', t: "You texting. That went right.", r: "Cheat. But I'll accept it." },
      ] },
      { tone: 'passive', t: "My first lap. Gained three places.", r: "Three. Good. That's what you sleep on. Not the rest.", opts: [
        { tone: 'cold', t: "Rest of it was a mess.", r: "Messes clear. Laps stay. Sleep on the lap." },
        { tone: 'passive', t: "Okay. I'll try.", r: "Good. Sleep. That's an instruction." },
        { tone: 'flirty', t: "Will you sleep on it with me?", r: "Not tonight. Soon. I'll be very good at it." },
      ] },
      { tone: 'flirty', t: "I got a text from you.", r: "That's not a race thing. ...I'll allow it. Once.", opts: [
        { tone: 'cold', t: "Only thing that went right.", r: "Then I'm glad I sent it. Rest." },
        { tone: 'passive', t: "And the first lap was decent.", r: "Decent? It was excellent. Stop modesting at me." },
        { tone: 'flirty', t: "Send another and I'll feel better.", r: "Another. ...Goodnight. You did well. That's the second." },
      ] },
    ] },
  { id: 'ice-text-bad-any-2-flirty', on: 'bad', stage: 'any', slot: 2, mood: 'flirty',
    say: "Rough race. Good interview after. You were gracious. Grace under a bad day is very attractive. I've said too much.",
    opts: [
      { tone: 'cold', t: "Didn't feel gracious.", r: "It rarely does. It looked it. That's what counts.", opts: [
        { tone: 'cold', t: "Doesn't count for much.", r: "It counts for me. Never mind." },
        { tone: 'passive', t: "Thanks. That helps.", r: "Good. I'm rarely helpful. It's a strange feeling." },
        { tone: 'flirty', t: "Very attractive, you said.", r: "I said too much. I'm not unsaying it." },
      ] },
      { tone: 'passive', t: "You watched the interview too?", r: "I watch everything. You know that by now.", opts: [
        { tone: 'cold', t: "Seems excessive.", r: "It is. I'm excessive about very few things." },
        { tone: 'passive', t: "I'm glad someone did.", r: "Someone did. Me. Rest now." },
        { tone: 'flirty', t: "Watch me in person instead.", r: "Saturday. In person. You can be gracious at me." },
      ] },
      { tone: 'flirty', t: "Say more.", r: "No. Too much is enough for one night.", opts: [
        { tone: 'cold', t: "Fine, then.", r: "Fine. Goodnight. You were good." },
        { tone: 'passive', t: "Okay. Goodnight.", r: "Goodnight. Sleep. Tomorrow's kinder." },
        { tone: 'flirty', t: "Save it for Saturday, then.", r: "Saturday. I'll say too much again. In person. Prepare." },
      ] },
    ] },

  // ---- bad 3: 'a habit' ---------------------------------------------------------------------------------------
  { id: 'ice-text-bad-any-3-cold', on: 'bad', stage: 'any', slot: 3, mood: 'cold',
    say: "Third rough weekend. I'm not going to pretend it's nothing. Neither should you.",
    opts: [
      { tone: 'cold', t: "I'm not pretending.", r: "Good. Then we're both being honest. It's bleak. It'll pass." },
      { tone: 'passive', t: "It's getting to me.", r: "I know. I can tell. Come round. No racing talk. Tea." },
      { tone: 'flirty', t: "Distract me.", r: "From a distance? Difficult. In person? Possible." },
    ] },
  { id: 'ice-text-bad-any-3-passive', on: 'bad', stage: 'any', slot: 3, mood: 'passive',
    say: "A rough run. You're making a habit of it. Break it. I believe you will. That's not nothing, from me.",
    opts: [
      { tone: 'cold', t: "Easy to say.", r: "It isn't, for me. I don't say it often." },
      { tone: 'passive', t: "Thank you. Really.", r: "It should. I mean it." },
      { tone: 'flirty', t: "If you believe it, I'll do it.", r: "Then do it. I'll be watching. As always." },
    ] },
  { id: 'ice-text-bad-any-3-flirty', on: 'bad', stage: 'any', slot: 3, mood: 'flirty',
    say: "Three bad weekends. I have a cure. It's tea and my company. Side effects include being looked at.",
    opts: [
      { tone: 'cold', t: "I'll pass.", r: "Your loss. The cure is excellent." },
      { tone: 'passive', t: "I'll take the cure.", r: "Good. Seven o'clock. Black tea. No complaints." },
      { tone: 'flirty', t: "The side effects sound like the best part.", r: "They are. Don't tell the car." },
    ] },

  // ---- dnf 1 [deep]: out of the race --------------------------------------------------------------------------
  { id: 'ice-text-dnf-any-1-cold', on: 'dnf', stage: 'any', slot: 1, mood: 'cold',
    say: "Out at {last}. The car gave up before you did. Say something, so I know you're grumpy and not silent.",
    opts: [
      { tone: 'cold', t: "Grumpy.", r: "Good. Grumpy I can work with.", opts: [
        { tone: 'cold', t: "Very grumpy.", r: "Then be grumpy. I'll be calm. Someone has to." },
        { tone: 'passive', t: "Thanks for checking in.", r: "Always. Even when you've been cool with me." },
        { tone: 'flirty', t: "Grumpy, but glad you texted.", r: "Glad is a good word. Keep it." },
      ] },
      { tone: 'passive', t: "I'm fine. Just gutted.", r: "Gutted is honest. Fine isn't. I'll take gutted.", opts: [
        { tone: 'cold', t: "Doesn't change anything.", r: "No. But it means you're telling me. That changes something." },
        { tone: 'passive', t: "Was it obvious on TV?", r: "Only to me. Everyone else saw a calm driver. I saw your hands." },
        { tone: 'flirty', t: "Tell me something to cheer me up.", r: "I watched every lap you did. They were good laps. All of them." },
      ] },
      { tone: 'flirty', t: "Something. There. Happy?", r: "Not happy. Relieved. You're still you.", opts: [
        { tone: 'cold', t: "Who else would I be?", r: "Someone quieter. I'd have hated that." },
        { tone: 'passive', t: "Still me. Promise.", r: "Good. Rest." },
        { tone: 'flirty', t: "Still me. Still yours, if you like.", r: "...I like. Rest. I'll be here." },
      ] },
    ] },
  { id: 'ice-text-dnf-any-1-passive', on: 'dnf', stage: 'any', slot: 1, mood: 'passive',
    say: "A short afternoon at {last}. They happen to the best, I'm told. Come for tea. I'll be insufferably calm.",
    opts: [
      { tone: 'cold', t: "Not in the mood for tea.", r: "Tea doesn't require a mood. It's the cure for moods.", opts: [
        { tone: 'cold', t: "Maybe tomorrow.", r: "Tomorrow, then. The offer stands." },
        { tone: 'passive', t: "Okay. One cup.", r: "One cup. Black. I won't mention the car." },
        { tone: 'flirty', t: "I'm in the mood for you, though.", r: "Then come for me. The tea's a formality." },
      ] },
      { tone: 'passive', t: "Tea sounds perfect.", r: "It is perfect. It's the only thing in my flat that is.", opts: [
        { tone: 'cold', t: "Don't fuss.", r: "I never fuss. I prepare. There's a difference." },
        { tone: 'passive', t: "On my way.", r: "Good. Door's open. Kettle's on." },
        { tone: 'flirty', t: "You're perfect too.", r: "Don't. ...Thank you. Hurry." },
      ] },
      { tone: 'flirty', t: "Insufferably calm sounds very appealing.", r: "It is. I'm an acquired taste. You've acquired it.", opts: [
        { tone: 'cold', t: "Just tired.", r: "Then come and be tired near me." },
        { tone: 'passive', t: "I have. Thank you.", r: "You're welcome. It's the least I can do. It's also the most." },
        { tone: 'flirty', t: "Calm me down in person.", r: "In person. Quietly. You'll forget the car. I promise." },
      ] },
    ] },
  { id: 'ice-text-dnf-any-1-flirty', on: 'dnf', stage: 'any', slot: 1, mood: 'flirty',
    say: "You're out of the race and I'm out of patience with that car. Come and be annoyed at me instead.",
    opts: [
      { tone: 'cold', t: "I'm annoyed at everything.", r: "Then I'll be one more thing. I'm very sturdy.", opts: [
        { tone: 'cold', t: "Leave it be.", r: "Left. For now. I'll check later." },
        { tone: 'passive', t: "Thank you. I'm glad you're there.", r: "So am I. I'm always there. Somewhere." },
        { tone: 'flirty', t: "You're the one thing I'm not annoyed at.", r: "Good. Keep it that way. I'll make tea." },
      ] },
      { tone: 'passive', t: "That car deserved it.", r: "It did. I've written it a strongly worded letter in my head.", opts: [
        { tone: 'cold', t: "Doesn't help.", r: "No. It entertained me, though." },
        { tone: 'passive', t: "Read it to me.", r: "'Dear car. You are a disgrace. Kindly behave. Regards.' That's all." },
        { tone: 'flirty', t: "Sign it from both of us.", r: "Both of us. Signed. Sealed. The car is terrified." },
      ] },
      { tone: 'flirty', t: "Annoyed at you sounds fun.", r: "It's an art. I'm very annoying. Gracefully.", opts: [
        { tone: 'cold', t: "Some other night.", r: "Another night. Rest, then. Be annoyed tomorrow." },
        { tone: 'passive', t: "Okay. Coming over.", r: "Good. I'll start being annoying now. As practice." },
        { tone: 'flirty', t: "Annoy me all night.", r: "All night. I'll pace myself. Come over." },
      ] },
    ] },

  // ---- dnf 2: out again -----------------------------------------------------------------------------------------
  { id: 'ice-text-dnf-any-2-cold', on: 'dnf', stage: 'any', slot: 2, mood: 'cold',
    say: "Out again. I'm told you're fine. I'd rather hear it from you, if you can be bothered.",
    opts: [
      { tone: 'cold', t: "I'm fine.", r: "Thank you. Received." },
      { tone: 'passive', t: "I'm fine. Sorry I went quiet.", r: "Thank you. That was all I needed. Rest." },
      { tone: 'flirty', t: "Fine, and I'd be better with you.", r: "Then come and be better. I'll be here." },
    ] },
  { id: 'ice-text-dnf-any-2-passive', on: 'dnf', stage: 'any', slot: 2, mood: 'passive',
    say: "Another early finish. You'll be furious. Be furious at me; I'm sturdier than a car.",
    opts: [
      { tone: 'cold', t: "Not furious. Just done.", r: "Done is fine. Sleep. I'll still be sturdy tomorrow." },
      { tone: 'passive', t: "Thanks. Talk later?", r: "Later. Yes. I'll be awake. I always am." },
      { tone: 'flirty', t: "You're sturdier than anything.", r: "I am. Remember that when I'm being difficult." },
    ] },
  { id: 'ice-text-dnf-any-2-flirty', on: 'dnf', stage: 'any', slot: 2, mood: 'flirty',
    say: "Out early. Which means you're free early. I'm not saying that's good. I'm saying I'm free too.",
    opts: [
      { tone: 'cold', t: "Not in the mood.", r: "Understood. The offer keeps. Like tea leaves." },
      { tone: 'passive', t: "I could use the company.", r: "It's yours. Seven. Bring nothing." },
      { tone: 'flirty', t: "Best news all day.", r: "Better than the car, certainly. Come over." },
    ] },

  // ---- dnf 3: 'a habit' -----------------------------------------------------------------------------------------
  { id: 'ice-text-dnf-any-3-cold', on: 'dnf', stage: 'any', slot: 3, mood: 'cold',
    say: "Third early exit. A pattern. You'll want to be alone. You excel at it.",
    opts: [
      { tone: 'cold', t: "I am.", r: "Yes. So am I. Two experts." },
      { tone: 'passive', t: "Actually, I'd rather not be.", r: "Then don't be. I'll put the kettle on." },
      { tone: 'flirty', t: "Not alone. With you.", r: "With me. Fine. That's the better pattern." },
    ] },
  { id: 'ice-text-dnf-any-3-passive', on: 'dnf', stage: 'any', slot: 3, mood: 'passive',
    say: "You're making a habit of early exits. On track only, I hope. Tea?",
    opts: [
      { tone: 'cold', t: "Just on track.", r: "Good. Keep it there." },
      { tone: 'passive', t: "Tea would be good.", r: "Tea is always good. Seven." },
      { tone: 'flirty', t: "Never early with you.", r: "Never. Good. I'll hold you to that." },
    ] },
  { id: 'ice-text-dnf-any-3-flirty', on: 'dnf', stage: 'any', slot: 3, mood: 'flirty',
    say: "Three early exits. I've decided that car is jealous of me. It keeps sending you home.",
    opts: [
      { tone: 'cold', t: "It's a car.", r: "A jealous one. I know the signs." },
      { tone: 'passive', t: "Maybe it is.", r: "It is. It's lost. I've won." },
      { tone: 'flirty', t: "Then let it. Home to you.", r: "Home to me. The car can sulk. I'll be smug." },
    ] },
];
