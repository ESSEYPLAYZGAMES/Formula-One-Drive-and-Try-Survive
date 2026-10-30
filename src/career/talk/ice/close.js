// ALOOF (ice) - in person, stage 'close', slots 1-9: together. The constitution (clause one: no racing talk before tea;
// two: no leaving without goodbye; three: I'm always right); your jacket, by right of occupation (clause four); the
// list, long and fond; forty minutes, timed; the piano piece that sounds like you; that look; 'I was very good at being
// alone'; the lemon tree fruits and the grandmother wants to meet you; slot 9: where is this going - and 'I love you'.
// Cold now reads as you pulling away (-3): they go glacial. Flirting lands (+3); a dare shows the heat under the ice.
export const DATA = [
  // ---- slot 1: the constitution. Establishes clauses one to three ---------------------------------------------------
  { id: 'ice-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "You went cold on me, so I've drafted terms. One: no racing talk before tea. Two: no leaving without goodbye. Three: I'm right.",
    opts: [
      { tone: 'cold', t: "Terms. Very romantic.", r: "Romance is what you do when you're not freezing someone out. You've been doing the other thing.", opts: [
        { tone: 'cold', t: "I don't sign contracts.", r: "Then don't. I'll keep my copy. You'll know where the door is. Clause two will be very lonely." },
        { tone: 'passive', t: "Fair. I'll sign. I've been distant.", r: "You have. Thank you for saying it. Sign there. Neatly. I'll know if you rush it." },
        { tone: 'flirty', t: "Add a clause four: you forgive me.", r: "Clause four is pending. It requires a full apology and a slow walk home. ...Mostly the walk." },
      ] },
      { tone: 'passive', t: "That's fair. Which one did I break?", r: "Two. You left without a goodbye. Tuesday. I was at the window. I don't stand at windows.", opts: [
        { tone: 'cold', t: "It was one goodbye.", r: "It was the only clause I actually cared about. Enjoy your efficient exits.", m: -4 },
        { tone: 'passive', t: "I'm sorry. It won't happen again.", r: "Good. It's the clause with teeth. The others are decoration. Mostly clause three." },
        { tone: 'flirty', t: "Let me make up for Tuesday. Properly.", r: "Properly. Slowly. With a goodbye at the end that takes at least ten minutes." },
      ] },
      { tone: 'flirty', t: "I'll sign anything you put in front of me.", r: "You shouldn't say that to me. I'm extremely thorough with paperwork. And you went cold.", opts: [
        { tone: 'cold', t: "Fine. Put it away.", r: "Away it goes. Unsigned. Like most things you start lately.", m: -4 },
        { tone: 'passive', t: "I went cold. I'm sorry. I'll sign properly.", r: "Thank you. Initial each page. Yes, clause three too. Especially clause three." },
        { tone: 'flirty', t: "Then add the clause where you kiss me.", r: "That's not a clause. That's a privilege. ...Revoked, briefly. Restored. Just now." },
        { tone: 'risque', t: "Draft the terms somewhere private. I'll sign in ink.", r: "In ink. Somewhere private. ...You know I'll hold you to every word. Come on, then." },
      ] },
    ] },
  { id: 'ice-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "I've written us a constitution. Clause one: no race talk before tea. Clause two: no exits without goodbyes. Clause three: I'm always right.",
    opts: [
      { tone: 'cold', t: "Clause three is a dictatorship.", r: "It's a benevolent one. Very well run. You'd hardly notice. Are you objecting?", m: -1, opts: [
        { tone: 'cold', t: "Yes. I'm not signing.", r: "Then you're stateless. In my flat. How brave.", m: -4 },
        { tone: 'passive', t: "No. Just noting it for the record.", r: "The record notes your note. It's been filed under 'cute'. Sign." },
        { tone: 'flirty', t: "I'll sign if I get a clause.", r: "One clause. Within reason. Make it a good one. I'll know if it isn't." },
      ] },
      { tone: 'passive', t: "That's very you. Where do I sign?", r: "Here. And here. And there's a space for you to add clause four, if you're brave.", opts: [
        { tone: 'cold', t: "I'll leave it blank.", r: "Blank. Of course. You do love a blank. I'll fill it myself, then. You won't like it." },
        { tone: 'passive', t: "Clause four: tea is made by whoever's up first.", r: "That's always me. You've just given yourself tea for life. Clever. Accepted." },
        { tone: 'flirty', t: "Clause four: you let me look at you.", r: "...Accepted. Without amendment. That's never happened before. Wipe that look off." },
        { tone: 'risque', t: "Clause four: Sunday mornings, nobody leaves the bed.", r: "Sundays I ring my grandmother. ...I'll ring her from bed. Accepted, with a look." },
      ] },
      { tone: 'flirty', t: "I love that you wrote this down.", r: "I write everything down. It's how I keep things. I'm keeping you. Read clause three again.", opts: [
        { tone: 'cold', t: "Keeping me. Sounds like a cage.", r: "It's not a cage. It's a constitution. ...If it felt like a cage, say so. I'll burn it.", m: -3 },
        { tone: 'passive', t: "You're always right. Noted.", r: "Thank you. It's a relief to have it in writing. You're very gracious in defeat." },
        { tone: 'flirty', t: "Keep me, then. Where's the pen?", r: "A pen. Permanent ink, mind. ...That's the most romantic thing anyone's said to me near stationery." },
      ] },
    ] },
  { id: 'ice-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "First draft of our constitution. No racing talk until I've had tea. Never leave without a goodbye. I'm always right. Sign.",
    opts: [
      { tone: 'cold', t: "Do we really need rules?", r: "We need these. I don't do things by halves. If you'd rather not, say it now.", m: -2, opts: [
        { tone: 'cold', t: "Rather not.", r: "Fine. No rules. No us, either, for a bit. I need a walk. Alone.", m: -5 },
        { tone: 'passive', t: "No, it's fine. I'll sign. I just like teasing you.", r: "I know. You're terrible. Sign. Initial the bit about goodbyes twice." },
        { tone: 'flirty', t: "We need clause four. You, every evening.", r: "Every evening. That's ambitious. I'll pencil it in. In very dark pencil." },
      ] },
      { tone: 'passive', t: "Signed. What happens if I break one?", r: "Clause one: you make the tea. Clause two: I sulk, magnificently. Clause three can't be broken.", opts: [
        { tone: 'cold', t: "Your sulks aren't that magnificent.", r: "Aren't they. I'll show you one tonight. You'll be very impressed and very lonely.", m: -3 },
        { tone: 'passive', t: "Seems fair. I'll be good.", r: "You'll be mostly good. Mostly is what I'm counting on. Mostly is lovely." },
        { tone: 'flirty', t: "What if I break them on purpose?", r: "Then there are penalties. Private ones. I haven't drafted those yet. I'm drafting now." },
      ] },
      { tone: 'flirty', t: "I'll sign. With a kiss.", r: "A kiss isn't a legal signature. ...It's admissible. Go on. Witnessed.", opts: [
        { tone: 'cold', t: "Actually, a pen will do.", r: "A pen. How bureaucratic. I've drafted many things. I've never felt so filed.", m: -3 },
        { tone: 'passive', t: "There. Signed. Both ways.", r: "Both ways. Good. I'll keep the paper. You keep the other one." },
        { tone: 'flirty', t: "And another, for the next page.", r: "There's no next page. ...I'll write one. Right now. In my head. It's very long." },
        { tone: 'risque', t: "Read me the small print. Slowly. Somewhere else.", r: "The small print is extensive. It takes all night. ...Get your coat. Bring mine." },
      ] },
    ] },

  // ---- slot 2: your jacket. They took it; 'by right of occupation' - clause four ----------------------------------
  { id: 'ice-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "Your jacket's on me. I took it this morning. You were cold yesterday, so I'm keeping the warm part of you.",
    opts: [
      { tone: 'cold', t: "I'd like it back.", r: "You'd like it back. Of course you would. You'd like a lot of things back. Ask me nicely.", opts: [
        { tone: 'cold', t: "Just give it back.", r: "There. Take it. It's cold now. So am I. We match.", m: -5 },
        { tone: 'passive', t: "Sorry about yesterday. Keep the jacket.", r: "I was going to. But thank you for apologising. It's warmer now. Both of us." },
        { tone: 'flirty', t: "Keep it. And keep me while you're at it.", r: "I'll keep the jacket. You I'm reviewing. ...You're passing. Don't tell anyone." },
      ] },
      { tone: 'passive', t: "Suits you better than me.", r: "It does. I've occupied it, and occupation is ownership. Clause four. I've just written it.", opts: [
        { tone: 'cold', t: "You can't just add clauses.", r: "I can. Clause three. You'd know that if you'd been paying attention. You haven't, lately.", m: -4 },
        { tone: 'passive', t: "Clause four. Fair enough.", r: "Good. Unopposed. The jacket thanks you. So do I. Quietly." },
        { tone: 'flirty', t: "What else of mine are you occupying?", r: "Your side of the bed. Your mornings. Your head, I hope. The jacket was the easy one." },
      ] },
      { tone: 'flirty', t: "You look good in it. Better than I do.", r: "Flattery won't get the jacket back. Nothing will. ...It's getting you something else.", opts: [
        { tone: 'cold', t: "I don't want anything else.", r: "No. Clearly. I'll take the jacket and go, then. It's very warm. You aren't.", m: -5 },
        { tone: 'passive', t: "What is it getting me?", r: "Forgiveness. For yesterday. Not all of it. Most of it. The jacket helped." },
        { tone: 'flirty', t: "I'll take whatever's on offer.", r: "What's on offer is me, in your jacket, not being cold. Be grateful. Be very grateful." },
        { tone: 'risque', t: "Then I'll come and take it off you.", r: "You could try. I'd let you. ...Slowly. And I'd still be keeping the jacket." },
      ] },
    ] },
  { id: 'ice-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "I'm wearing your jacket. No, you can't have it back. It's mine now, by right of occupation.",
    opts: [
      { tone: 'cold', t: "That's not a thing.", r: "It is now. Clause four. Unless you'd like to dispute it formally.", m: -1, opts: [
        { tone: 'cold', t: "I would, actually.", r: "Then the tribunal will hear it. The tribunal is me. The verdict is no.", m: -3 },
        { tone: 'passive', t: "No dispute. Clause four, then.", r: "Ratified. Good. You're very easy to govern. It's one of your best qualities." },
        { tone: 'flirty', t: "Dispute it how? Over dinner?", r: "Over dinner. You'll lose. Graciously, I hope. I'll be wearing the jacket." },
      ] },
      { tone: 'passive', t: "Occupation? Is that a legal term?", r: "It's a constitutional one. I've added it. Clause four. You'll find it under 'non-negotiable'.", opts: [
        { tone: 'cold', t: "You've got a clause for everything.", r: "For the important things. You're on most of them. Don't look so trapped.", m: -2 },
        { tone: 'passive', t: "Fine. It's yours.", r: "Thank you. Peacefully surrendered. I'll wear it beautifully, as compensation." },
        { tone: 'flirty', t: "Next you'll be occupying my whole flat.", r: "I already am. Third shelf, bathroom. Second drawer. Left side. You hadn't noticed. I noticed." },
      ] },
      { tone: 'flirty', t: "It looks better on you, so that's fair.", r: "Everything of yours looks better on me. It's a curse I live with. Gladly.", opts: [
        { tone: 'cold', t: "Not everything.", r: "Charming. You'll miss the jacket tonight. And me.", m: -3 },
        { tone: 'passive', t: "I'll buy another.", r: "Don't. I'd take that one too. It's a policy. Quite a warm one." },
        { tone: 'flirty', t: "Keep it on. I'll come over and admire it.", r: "Admire it. That's very forward for {venue}. I'll allow it. With my whole face." },
        { tone: 'risque', t: "Let's see how it looks on my bedroom floor.", r: "On the floor. Ha. ...It might end up there. With help. Clause four still applies." },
      ] },
    ] },
  { id: 'ice-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "You've noticed I'm wearing your jacket. I saw you notice. It's mine now. By right of occupation. Say thank you.",
    opts: [
      { tone: 'cold', t: "Thank you for stealing my jacket.", r: "Borrowing, permanently. There's a difference. You sound cross. Are you cross?", m: -1, opts: [
        { tone: 'cold', t: "A bit, yes.", r: "Then I'll be cross back. In your jacket. It's very warm being cross in it.", m: -3 },
        { tone: 'passive', t: "No. Keep it. It's yours.", r: "Thank you. It's going in the constitution. Clause four. Occupation is ownership." },
        { tone: 'flirty', t: "Not cross. Jealous of the jacket.", r: "Jealous of a jacket. That's the most flattering thing I've heard all week." },
      ] },
      { tone: 'passive', t: "Thank you. It suits you more than me.", r: "It does. I've written it into clause four. You're losing a constitutional battle very gracefully.", opts: [
        { tone: 'cold', t: "I didn't know it was a battle.", r: "Everything's a battle with me. You knew that. You agreed to it. Or I thought so.", m: -3 },
        { tone: 'passive', t: "I don't mind losing to you.", r: "Good. It's going to happen a lot. Mostly about tea. And jackets." },
        { tone: 'flirty', t: "Clause five: I get to borrow you.", r: "Borrowing is temporary. You'd have to occupy. ...I'd allow occupation." },
      ] },
      { tone: 'flirty', t: "It's warm because I was wearing it.", r: "I know. That's why I took it. I'm not subtle when it matters. I'm subtle the rest of the time.", opts: [
        { tone: 'cold', t: "Bit needy.", r: "Needy. Hm. I'll give it back, then. And the rest of the morning.", m: -4 },
        { tone: 'passive', t: "Keep it as long as you want.", r: "Forever, then. You said as long as I want. I was listening. Always." },
        { tone: 'flirty', t: "You could just wear me instead.", r: "...I could. I would. Not at {venue}. Later. Come here a moment." },
        { tone: 'risque', t: "Come home and I'll warm you up better than a jacket.", r: "A big claim. Prove it tonight. I'll keep the jacket on until you do." },
      ] },
    ] },

  // ---- slot 3: missing you on the road; the list - 'long and fond'. Establishes: the list --------------------------
  { id: 'ice-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "Three weeks of you on the other side of the world, and you were curt on the phone. I've started a list of your crimes.",
    opts: [
      { tone: 'cold', t: "Long list?", r: "Long. And growing. It was meant to be a list of crimes. Half of it's fond. Annoyingly.", opts: [
        { tone: 'cold', t: "Burn it, then.", r: "I don't burn things. I keep them. I'll keep this, and keep my distance.", m: -5 },
        { tone: 'passive', t: "What's on it?", r: "You stole the blanket. You were curt on the phone. You made me laugh at an airport. That last one's fond." },
        { tone: 'flirty', t: "Put 'missed you terribly' on it.", r: "That's not a crime. ...It's on the fond side. Underlined. I'll forgive the phone call." },
      ] },
      { tone: 'passive', t: "I'm sorry. Being away is hard.", r: "It is. I counted the days. Me, counting. The list helped. It's long, and mostly fond.", opts: [
        { tone: 'cold', t: "You count too much.", r: "And you call too little. We're both imperfect. I'll go and be imperfect alone.", m: -4 },
        { tone: 'passive', t: "What's the fondest thing on it?", r: "You hum when you're concentrating. Off key. I miss it in silent rooms." },
        { tone: 'flirty', t: "I missed you every single day.", r: "Every single day. ...I'll add it to the list. The fond half. It's winning." },
      ] },
      { tone: 'flirty', t: "Read me my crimes. I'll plead guilty.", r: "Pleading guilty doesn't reduce the sentence. ...It might reduce the sentence.", opts: [
        { tone: 'cold', t: "Fine. Don't reduce it.", r: "I won't. You'll serve the full term. It's lonely. I've served it already.", m: -5 },
        { tone: 'passive', t: "What's the sentence?", r: "Dinner. At mine. Tonight. No phone. You'll be on the list the whole time. The fond half." },
        { tone: 'flirty', t: "Sentence me to you, then.", r: "That's not a sentence. That's a reward. ...You're good at getting off lightly." },
        { tone: 'risque', t: "I'll do my time in your bed.", r: "In my bed. Ha. ...The list just got a lot longer. All on the fond side. Come on." },
      ] },
    ] },
  { id: 'ice-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "Three weeks of you on the other side of the world. I counted. I don't count things. I also made a list.",
    opts: [
      { tone: 'cold', t: "A list of what?", r: "Things you do. It started as complaints. It's become long and fond. I'm horrified.", m: -1, opts: [
        { tone: 'cold', t: "Sounds a bit obsessive.", r: "It is. Thank you for noticing. I'll obsess over something else now.", m: -4 },
        { tone: 'passive', t: "Read me one.", r: "'Says goodnight to the car.' You do. I've heard you. It's fond. I'm sorry." },
        { tone: 'flirty', t: "Add 'missed you'. Underline it.", r: "Underlined twice. It's the longest entry. Don't make me read it out." },
      ] },
      { tone: 'passive', t: "I missed you too.", r: "Did you. Tell me how. Be specific. I keep a list, you see. Long. Embarrassingly fond.", opts: [
        { tone: 'cold', t: "I don't do lists.", r: "No. You do absences. You're very good at those. Off you go.", m: -4 },
        { tone: 'passive', t: "Hotel tea. It's never right without you.", r: "Of course it isn't. Nothing's right without me. ...It's on the list. Fond side." },
        { tone: 'flirty', t: "I reached for you every morning.", r: "...That's going on the list in capitals. I don't use capitals. You've made me." },
      ] },
      { tone: 'flirty', t: "What's on the list?", r: "You hum off key. You eat the crusts last. You look at me when you think I'm not looking. I'm always looking.", opts: [
        { tone: 'cold', t: "That's a weird list.", r: "It's a fond list. You've just been crossed off it, briefly. Enjoy the cold.", m: -4 },
        { tone: 'passive', t: "That's sweet. Is it all fond?", r: "Mostly. There's a section on the blanket. It's not fond. It's legal." },
        { tone: 'flirty', t: "Add 'can't keep their eyes off you'.", r: "Already there. Page one. It was the first entry. Before I'd admitted anything." },
        { tone: 'risque', t: "I'll give you something new to add tonight.", r: "Will you. Promises go on the list too, you know. In pencil, until kept." },
      ] },
    ] },
  { id: 'ice-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "I missed you. Don't make a thing of it. ...Make a small thing of it. I've made a list. It's long and fond.",
    opts: [
      { tone: 'cold', t: "A list? Really?", r: "Really. I make lists of things I'd rather not lose. You're on one. You're the only thing on it.", m: -1, opts: [
        { tone: 'cold', t: "I'm not something you can lose.", r: "No. You're something that leaves. I'd noticed. I'll put the list away.", m: -5 },
        { tone: 'passive', t: "That's actually lovely.", r: "It is. I'm mortified. It's three pages. Some of it rhymes. I'll burn the rhymes." },
        { tone: 'flirty', t: "A small thing, then. Right here.", r: "Here. A small thing. ...A slightly bigger thing. Stop. People. Fine. Once more." },
      ] },
      { tone: 'passive', t: "Missed you more. A lot more.", r: "A lot more. Vague, but I'll accept it, since it's you. Read the list later. It's mostly about your hands.", opts: [
        { tone: 'cold', t: "My hands?", r: "Never mind. It sounds silly aloud. It stays in my head, then.", m: -3 },
        { tone: 'passive', t: "What about my hands?", r: "How you hold a cup with both of them. Like the tea might escape. It's fond. It's ridiculous." },
        { tone: 'flirty', t: "My hands missed you.", r: "...That's going straight on the list. And straight to my face. I've gone pink. In public." },
      ] },
      { tone: 'flirty', t: "I'm making a big thing of it.", r: "I knew you would. Go on, then. A big thing. I'll stand very still and pretend to mind.", opts: [
        { tone: 'cold', t: "Actually, let's keep it low-key.", r: "Low-key. After three weeks. Fine. I'll be extremely low-key. You'll barely see me.", m: -4 },
        { tone: 'passive', t: "Just glad you're here.", r: "I'm here. I'm glad too. Write that down. I'll check you did." },
        { tone: 'flirty', t: "There. A very big thing.", r: "...That was a big thing. Put it on the list. The top of the list. Again, please." },
        { tone: 'risque', t: "The biggest thing happens when we get home.", r: "Home. Yes. I'll walk fast. I never walk fast. You'll know why." },
      ] },
    ] },
  // ---- slot 4: jealousy - forty minutes with someone else. Timed. 'Not for any reason' -----------------------------
  { id: 'ice-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "You've been cool with me all week, and then forty minutes with someone else. I timed it. Purely out of interest.",
    opts: [
      { tone: 'cold', t: "You timed me?", r: "I time everything. It's a habit. It's a habit that got very specific today.", opts: [
        { tone: 'cold', t: "That's a bit much.", r: "It is. So was forty minutes. I'll be over there. Not timing you. Timing the door.", m: -5 },
        { tone: 'passive', t: "It was work. I promise. I'd rather have been with you.", r: "Then say that first next time. Before the forty minutes. I'd have waited more gracefully." },
        { tone: 'flirty', t: "Time how long I spend with you tonight.", r: "...I will. To the second. It had better beat forty minutes. By a great deal." },
      ] },
      { tone: 'passive', t: "They're an old friend. Nothing more.", r: "I know. I could see it. I still minded. That's the part I don't like. Me, minding.", opts: [
        { tone: 'cold', t: "Then stop minding.", r: "If I could stop minding things, I'd have done it years ago. Lovely advice. Useless.", m: -4 },
        { tone: 'passive', t: "It's alright to mind. I'd mind too.", r: "Would you. ...Good. I'd hate to be the only one. Thank you." },
        { tone: 'flirty', t: "I like that you mind. It's the warmest you get.", r: "It's not the warmest I get. You know that. You're fishing. ...It's working." },
      ] },
      { tone: 'flirty', t: "Jealous looks good on you.", r: "I don't look jealous. I look composed. It takes a great deal of work, and you're undoing it.", opts: [
        { tone: 'cold', t: "You look jealous to me.", r: "Then look somewhere else. You seem to be good at that this week.", m: -5 },
        { tone: 'passive', t: "Sorry. I didn't think. I'm here now.", r: "You're here now. That's the minute that counts. ...It counts for quite a lot, actually." },
        { tone: 'flirty', t: "You're the only one I want to look at.", r: "Prove it. Look at me for forty minutes. I'll time it. I'll enjoy every one." },
        { tone: 'risque', t: "Let me make it up to you. All forty minutes. Privately.", r: "Forty minutes privately. That's a start. ...We'll see who's counting by the end." },
      ] },
    ] },
  { id: 'ice-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "You spent forty minutes talking to someone else earlier. I timed it. Not for any reason.",
    opts: [
      { tone: 'cold', t: "Is that a problem?", r: "Problem is a strong word. Observation. Strongly worded observation. With a stopwatch.", opts: [
        { tone: 'cold', t: "Doesn't sound like an observation.", r: "No. It sounds like a sulk. You're right. I'll go and sulk with dignity.", m: -4 },
        { tone: 'passive', t: "They were asking about the season. That's all.", r: "For forty minutes. It must be a very long season. ...Fine. I believe you. I minded anyway." },
        { tone: 'flirty', t: "You're adorable when you're jealous.", r: "I'm not adorable. I'm formidable. ...Adorable is going on the list. Under 'things you're wrong about'." },
      ] },
      { tone: 'passive', t: "You could have come over.", r: "I could. I didn't want to look like I was collecting you. Even though I was.", opts: [
        { tone: 'cold', t: "Didn't need collecting.", r: "Clearly not. You were perfectly content. I'll stop collecting.", m: -4 },
        { tone: 'passive', t: "Next time, collect me.", r: "I will. I'll do it elegantly. Nobody will notice except you and them." },
        { tone: 'flirty', t: "Collect me now.", r: "Now. Fine. Arm. Thank you. We're leaving. You're collected. I've stopped minding." },
      ] },
      { tone: 'flirty', t: "And how long have I been talking to you?", r: "Four minutes. It's not enough. I'd like the other thirty-six. With interest.", opts: [
        { tone: 'cold', t: "You'll get what you get.", r: "Hm. Then I'll get nothing, and enjoy it. I'm very good at nothing.", m: -5 },
        { tone: 'passive', t: "The whole evening's yours.", r: "The whole evening. That's more than forty minutes. I've won. I knew I would." },
        { tone: 'flirty', t: "You can have all my minutes.", r: "All of them. That's a lot of minutes. I'll take them, one at a time, slowly." },
        { tone: 'risque', t: "Interest paid in full. Tonight. My place.", r: "Paid in full. ...I'll audit the account myself. Thoroughly. All night, if necessary." },
      ] },
    ] },
  { id: 'ice-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "Forty minutes with the one by the door. I timed it. You're going to make it up to me, and you're going to enjoy it.",
    opts: [
      { tone: 'cold', t: "Nothing to make up.", r: "Nothing. Interesting. Forty minutes of nothing. I'll find something to do with my nothing, too.", opts: [
        { tone: 'cold', t: "Go on, then.", r: "I will. You'll see me laughing at someone else's jokes. Forty-one minutes.", m: -5 },
        { tone: 'passive', t: "Okay. I'm sorry I didn't come back sooner.", r: "Thank you. That's all I wanted. That, and the next forty minutes." },
        { tone: 'flirty', t: "Fine. I'll make it up to you anyway.", r: "Anyway. I'll take anyway. I'm generous like that. Start now." },
      ] },
      { tone: 'passive', t: "How do I make it up to you?", r: "Stay by me for the rest of the evening. Pretend you can't help it.", opts: [
        { tone: 'cold', t: "I've got other people to see.", r: "Of course you have. Enjoy them. All of them. In forty-minute slots.", m: -5 },
        { tone: 'passive', t: "I'm not pretending. I can't help it.", r: "...That's the right answer. I'll stop timing. Mostly." },
        { tone: 'flirty', t: "I'll stay closer than that.", r: "Closer is allowed. Encouraged. Within the bounds of {venue}. Barely." },
      ] },
      { tone: 'flirty', t: "I'll enjoy it, all right.", r: "I know you will. That's the point. I'm thinking at least an hour. Undivided.", opts: [
        { tone: 'cold', t: "An hour's a lot.", r: "An hour is a lot, for me. Apparently it's too much for you. Noted.", m: -4 },
        { tone: 'passive', t: "An hour, undivided. Done.", r: "Done. No phone. No old friends. Just me, being difficult, and you, enjoying it." },
        { tone: 'flirty', t: "Make it two.", r: "Two. Greedy. I'd hoped you'd say that. I'd hoped all evening." },
        { tone: 'risque', t: "Leave with me now and I'll start paying.", r: "Now. Yes. Don't look at the one by the door on the way out. I'll be watching. And then I won't." },
      ] },
    ] },

  // ---- slot 5: tenderness. They know your usual; the piano piece (re-established) that sounds like you --------------
  { id: 'ice-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "You've been far away lately. I wrote something on the piano anyway. Two in the morning, as I do. It sounds like you braking late.",
    opts: [
      { tone: 'cold', t: "You wrote a song about my braking?", r: "I wrote a piece about you. Your braking intruded. You're very intrusive. Even absent.", opts: [
        { tone: 'cold', t: "Sounds a bit much.", r: "It's four minutes long. It's not much. It's everything I had. Never mind.", m: -5 },
        { tone: 'passive', t: "I'm sorry I've been distant. Play it for me?", r: "Maybe. If you sit still. If you don't talk. If you stay afterwards." },
        { tone: 'flirty', t: "I want to hear it. All of it.", r: "All of it. Three minutes of brakes and one of something softer. I'll play it tonight." },
      ] },
      { tone: 'passive', t: "I didn't know you still played.", r: "Badly. In the small hours. I always have. I never wrote anything before you.", opts: [
        { tone: 'cold', t: "Why me?", r: "If you have to ask, I've written it badly. I'll put it away.", m: -4 },
        { tone: 'passive', t: "What's it called?", r: "It hasn't got a name. Names are for things that answer back. ...It answers back. It's called you." },
        { tone: 'flirty', t: "That's the most romantic thing I've ever heard.", r: "You haven't heard it yet. Wait until the bridge. It's where I stopped pretending." },
      ] },
      { tone: 'flirty', t: "Play it for me and I'll stop being far away.", r: "That's a bargain I'd usually refuse. I've been refusing a lot, lately. I'm tired of it.", opts: [
        { tone: 'cold', t: "Forget it. I'm tired.", r: "Of course. Go and sleep. I'll play it to the window, like always.", m: -5 },
        { tone: 'passive', t: "Tonight, then. I'll make the tea.", r: "Black. Nothing in it. You know how. You always knew. Tonight." },
        { tone: 'flirty', t: "I'll sit right next to you on the bench.", r: "The bench is small. You'd be very close. I'd play the soft part twice." },
        { tone: 'risque', t: "And after, I'll keep you up past two.", r: "Past two. My hour. You'd steal that too. ...Steal it, then. I'll leave the door open." },
      ] },
    ] },
  { id: 'ice-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "Did I ever tell you I play the piano? Badly, at two in the morning. I wrote something. It sounds like you.",
    opts: [
      { tone: 'cold', t: "What does 'like me' sound like?", r: "Late on the brakes. Early on the apology. Something in the left hand that won't settle.", opts: [
        { tone: 'cold', t: "Doesn't sound very flattering.", r: "It isn't flattering. It's accurate. Flattering I could have written in a day.", m: -4 },
        { tone: 'passive', t: "Play it for me sometime.", r: "You'll hear it. Once. Sitting still. No commentary. Then we'll never speak of it." },
        { tone: 'flirty', t: "Sounds like you've been paying attention.", r: "I always pay attention to you. You'd be alarmed how much. The piano knows." },
      ] },
      { tone: 'passive', t: "You wrote something about me?", r: "For you. About you. I've never done that. It's only four minutes. I couldn't make it longer.", opts: [
        { tone: 'cold', t: "Four minutes isn't long.", r: "It's the longest I've ever been honest in one go. Forget it.", m: -5 },
        { tone: 'passive', t: "Why couldn't you make it longer?", r: "Because the end came too soon. Like you leaving, always. I didn't want to write that part." },
        { tone: 'flirty', t: "Four minutes of you thinking about me. I'll take it.", r: "It's not four minutes. It's months, compressed. I don't think about you for four minutes. I wish." },
      ] },
      { tone: 'flirty', t: "And you ordered my usual without asking.", r: "I did. I hate that I know it. I hate it with my whole heart. It's a very small, warm heart.", opts: [
        { tone: 'cold', t: "I might've wanted something different.", r: "Then you'd have said. You never say. Next time, order yourself.", m: -4 },
        { tone: 'passive', t: "You got it exactly right.", r: "I always do. Clause three. ...Nobody ever notices the noticing. You did." },
        { tone: 'flirty', t: "Small and warm. It's safe with me.", r: "Look after it. Carefully. It's out of practice. So is the rest of me." },
        { tone: 'risque', t: "Play me the song later. In your dressing gown.", r: "In my dressing gown. At two. With you on the bench. ...I'd never finish the piece. You know that." },
      ] },
    ] },
  { id: 'ice-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "I wrote you something on the piano. At two in the morning, as ever. It's short, and it ends too soon, like your visits.",
    opts: [
      { tone: 'cold', t: "My visits aren't that short.", r: "They are. You leave before the tea's cold. I've measured. It's a short piece for a reason.", opts: [
        { tone: 'cold', t: "I have a job.", r: "So do I. I make time. You make excuses. I'll play it alone.", m: -5 },
        { tone: 'passive', t: "You're right. I'll stay longer next time.", r: "Longer. Good. I'll add a second movement. A third, if you behave." },
        { tone: 'flirty', t: "Then write a longer one. I'll stay for all of it.", r: "A longer one. ...I'd need you there for research. Several nights. Long ones." },
      ] },
      { tone: 'passive', t: "You wrote me a song?", r: "A piece. Songs have words. I've used enough words on you. This has none. It's better.", opts: [
        { tone: 'cold', t: "I'm not really a piano person.", r: "No. Of course not. Never mind. It was for me, really.", m: -5 },
        { tone: 'passive', t: "Will you play it for me?", r: "Tonight. Once. You'll sit there. If you clap, I'll stop speaking to you." },
        { tone: 'flirty', t: "I don't need words. I'll know what it means.", r: "You will. That's what frightens me. You always know what I mean." },
      ] },
      { tone: 'flirty', t: "Then I'll make my visits longer. Much longer.", r: "How much longer. Be specific. I'm composing.", opts: [
        { tone: 'cold', t: "We'll see.", r: "We'll see. That's my line, and you've used it to hurt me. Well done.", m: -4 },
        { tone: 'passive', t: "Stay the weekend with me.", r: "The weekend. That's a symphony. ...Yes. I'll bring the music. You bring nothing." },
        { tone: 'flirty', t: "Long enough for an encore.", r: "I don't do encores. ...I'll do one. For you. Only you. Then never again." },
        { tone: 'risque', t: "All night. You can play me instead.", r: "Play you. ...That's terrible. I'm laughing. I'm also saying yes. Don't tell the piano." },
      ] },
    ] },

  // ---- slot 6: heat. That look - the one they pretend doesn't work ------------------------------------------------
  { id: 'ice-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "You've been cold, and now you're giving me that look. The one I pretend doesn't work. It's working. I'm furious.",
    opts: [
      { tone: 'cold', t: "What look?", r: "Don't. You know the look. If you're going to pretend, I'll pretend better, and colder.", opts: [
        { tone: 'cold', t: "I'm not doing anything.", r: "Fine. Then neither am I. I'm going. Enjoy not doing anything.", m: -5 },
        { tone: 'passive', t: "Okay. That look. I've missed you.", r: "Missed me. You could have said so with your mouth. The look is cheating. ...Effective cheating." },
        { tone: 'flirty', t: "This one?", r: "That one. Stop. ...Don't stop. I hate you. I don't. Come here." },
      ] },
      { tone: 'passive', t: "Sorry about before. I don't want to be cold with you.", r: "Then don't be. Look at me like that and mean it. I'll decide whether to forgive you.", opts: [
        { tone: 'cold', t: "Forget I said anything.", r: "Forgotten. I'll take my fury home. It's good company. Better than you, tonight.", m: -5 },
        { tone: 'passive', t: "I mean it. I'm sorry.", r: "I can always tell when you mean things. ...Forgiven. Mostly. The rest you'll earn later." },
        { tone: 'flirty', t: "I mean every second of it.", r: "Every second. ...Then come home and mean it there. I'm done being furious." },
      ] },
      { tone: 'flirty', t: "Good. It's supposed to work.", r: "You don't get to be cold all week and then look at me like that. You don't. ...You do.", opts: [
        { tone: 'cold', t: "Fine. I'll stop.", r: "Off and on, like a tap. I'm not a sink.", m: -5 },
        { tone: 'passive', t: "I'll make up for the week.", r: "Every day of it. One at a time. Starting with this one." },
        { tone: 'flirty', t: "I'm not stopping until you smile.", r: "I'm not smiling. ...I am. You've won. Don't gloat. Kiss me instead." },
        { tone: 'risque', t: "Let me show you what else it does.", r: "...I know what else it does. Not here. Home. Now. And you're making the tea after." },
      ] },
    ] },
  { id: 'ice-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "You have that look. The one I pretend doesn't work on me. Keep pretending with me.",
    opts: [
      { tone: 'cold', t: "I'm just tired.", r: "Tired. Of course. My mistake. I'll stop looking for things in your face.", opts: [
        { tone: 'cold', t: "Probably best.", r: "Probably. I'll look at the wall. It's never tired.", m: -5 },
        { tone: 'passive', t: "Tired, and also looking at you.", r: "Both. Fine. I can work with both. Mostly the second one." },
        { tone: 'flirty', t: "Tired. But it's still that look.", r: "It is. I'd recognise it from orbit. ...I'm still pretending. Badly." },
      ] },
      { tone: 'passive', t: "We'll both pretend. Very convincingly.", r: "Very. Nobody here would guess. Except everyone. We're terrible at it.", opts: [
        { tone: 'cold', t: "Let's not make a scene.", r: "A scene. From me. I've never made a scene. Fine. Pretend harder, then.", m: -3 },
        { tone: 'passive', t: "Let them guess.", r: "Let them. I've stopped caring what people guess. That's your doing. I'm grateful, slightly." },
        { tone: 'flirty', t: "I'm not pretending anymore.", r: "No. Neither am I. ...There. That was my look back. You felt it, didn't you." },
      ] },
      { tone: 'flirty', t: "It works. I've seen it work.", r: "You've seen me pretend. That's different. ...It's not different. It works. Annoyingly well.", opts: [
        { tone: 'cold', t: "Then I'll stop doing it.", r: "Don't you dare. ...You've stopped. Naturally. Fine.", m: -4 },
        { tone: 'passive', t: "I'll only use it for good.", r: "There's no good use for it. Only very effective ones. Use it carefully." },
        { tone: 'flirty', t: "It's going to keep working all evening.", r: "I know. I've stopped pretending it doesn't. Stand closer. Closer. There." },
        { tone: 'risque', t: "Then come home and stop pretending entirely.", r: "Entirely. ...I'm getting my coat. Your jacket, technically. Don't keep me waiting." },
      ] },
    ] },
  { id: 'ice-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "Stop looking at me like that in public. Start looking at me like that in private. In roughly ten minutes.",
    opts: [
      { tone: 'cold', t: "I'm not looking at you like anything.", r: "Liar. And you've chosen a very bad time to start lying. I'll be cold now. Watch.", opts: [
        { tone: 'cold', t: "Go ahead.", r: "Done. Ice. I'll see you whenever you've finished being impossible.", m: -5 },
        { tone: 'passive', t: "Okay. I was. Guilty.", r: "Guilty. So am I. That's the whole trouble. Ten minutes." },
        { tone: 'flirty', t: "Fine. I was. And I'm not stopping.", r: "Good. Don't. I wasn't serious about stopping. I was serious about ten minutes." },
      ] },
      { tone: 'passive', t: "Ten minutes. I'll find our coats.", r: "My coat is your jacket. It has been for a while. Find it quickly.", opts: [
        { tone: 'cold', t: "Actually, I'd like to stay a while.", r: "Stay, then. I'll go. Ten minutes was an offer. It just expired.", m: -5 },
        { tone: 'passive', t: "Found it. Let's go.", r: "Good. Walk slowly until we're out of sight. Then walk quickly." },
        { tone: 'flirty', t: "Five minutes. I'm impatient.", r: "Five. Fine. You've negotiated me down. I never get negotiated down." },
      ] },
      { tone: 'flirty', t: "Make it five.", r: "Five. Greedy. ...Four. I'm worse than you. Don't tell anyone.", opts: [
        { tone: 'cold', t: "Actually, ten's fine.", r: "Ten. You've gone cool on me mid-sentence. I'll go cool too. It'll be fifteen now.", m: -3 },
        { tone: 'passive', t: "Four. I'll get the car.", r: "Get the car. Not too fast. I want to look at you on the way." },
        { tone: 'flirty', t: "Three, and I'll kiss you in the lift.", r: "The lift has a camera. ...I don't care. Three." },
        { tone: 'risque', t: "Two, and you won't need that jacket for long.", r: "Two. ...You'll pay for that. Slowly. All night. That's not a threat. It's a promise." },
      ] },
    ] },
  // ---- slot 7: the deepest crack - 'I was very good at being alone. You've ruined it' --------------------------------
  { id: 'ice-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "You keep going quiet, and I keep noticing how much I mind. I used to be excellent at solitude. You've ruined it.",
    opts: [
      { tone: 'cold', t: "Maybe you should go back to it.", r: "...That's the cruellest thing you could have said, and you said it in your normal voice.", m: -5, opts: [
        { tone: 'cold', t: "I'm being honest.", r: "Then I'll be honest too. I'm going. Don't follow me. I won't be at the window.", m: -6 },
        { tone: 'passive', t: "That was unfair. I'm sorry. I didn't mean it.", r: "You didn't mean it. I believe you. It still landed. Give me a minute. Stay for the minute." },
        { tone: 'flirty', t: "I don't want you alone. I want you with me.", r: "Then be with me. Not quiet. Not elsewhere. Here. ...Here. Yes. Like that." },
      ] },
      { tone: 'passive', t: "I'm sorry. I go quiet when the season gets heavy.", r: "Then be heavy with me. I can carry things. I'm much stronger than I'm decorative.", opts: [
        { tone: 'cold', t: "I'd rather handle it myself.", r: "Yourself. Of course. I'll go back to being very good at being alone, then.", m: -5 },
        { tone: 'passive', t: "Okay. I'll try. Can we talk about it tonight?", r: "Tonight. Mine. I'll make tea and I won't interrupt. I'll want to. I won't." },
        { tone: 'flirty', t: "You're not decorative. You're the best thing in my week.", r: "...The best thing. I'll keep that. In the place I keep the very few things I keep." },
      ] },
      { tone: 'flirty', t: "Good. I wanted to ruin it.", r: "Did you. You've done a thorough job. And then you went quiet, and left me in the wreckage.", opts: [
        { tone: 'cold', t: "You'll survive.", r: "I will. I always do. That's the problem. I'd hoped not to have to, with you.", m: -5 },
        { tone: 'passive', t: "I'm sorry. I'm not going anywhere.", r: "Say that again in a month. And in a year. I'll be listening. I keep everything." },
        { tone: 'flirty', t: "Then let me rebuild something better. With you.", r: "Better. Together. ...That's a frightening sentence. I'd like to hear it every day." },
        { tone: 'risque', t: "Let me stay tonight. And tomorrow. And the one after.", r: "Every one after. ...Yes. Stay. Don't be quiet. Be anything else you like." },
      ] },
    ] },
  { id: 'ice-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "I was very good at being alone. Years of practice. Excellent at it. You've ruined it. I'd like you to know I'm furious.",
    opts: [
      { tone: 'cold', t: "You'll get the hang of it again.", r: "That wasn't an invitation to leave. It was a confession. You've filed it under 'complaint'.", opts: [
        { tone: 'cold', t: "It sounded like a complaint.", r: "Then I'll stop confessing. It's safer. I'm very good at safe.", m: -5 },
        { tone: 'passive', t: "Sorry. I heard it wrong. You're really saying...", r: "I'm saying I like you here. Too much. More than alone. I've never said that." },
        { tone: 'flirty', t: "I know. I'm teasing. I ruined it on purpose.", r: "Monster. ...Thank you. Nobody's ever bothered to ruin anything of mine before." },
      ] },
      { tone: 'passive', t: "I'm sorry. Is it really that bad?", r: "It's terrible. I set out two cups now. I listen for the door. I say 'we'. I've become ordinary.", opts: [
        { tone: 'cold', t: "You could stop.", r: "I could. Is that what you'd like? Say it plainly. I'll do it plainly.", m: -5 },
        { tone: 'passive', t: "You're not ordinary. You're happy.", r: "...Happy. That's the word I've been avoiding. Thank you for saying it so I didn't have to." },
        { tone: 'flirty', t: "Say 'we' again.", r: "We. ...We should go home. We should have tea. We should stay in tomorrow. That's three." },
      ] },
      { tone: 'flirty', t: "Furious looks good on you.", r: "Everything looks good on me. This looks frightened. It's hiding very well behind furious.", opts: [
        { tone: 'cold', t: "Nothing to be frightened of.", r: "There's everything to be frightened of. You'd know if you'd ever stayed. Forget it.", m: -5 },
        { tone: 'passive', t: "I'm frightened too. That's alright.", r: "Is it. ...Then we'll be frightened together. That's less frightening. Slightly." },
        { tone: 'flirty', t: "I'm staying put. Ruin me back.", r: "I intend to. Slowly. Thoroughly. For years, if you'll let me." },
        { tone: 'risque', t: "Come home and be furious at me properly.", r: "Properly. ...You'll regret that. You won't. I'll make sure you won't." },
      ] },
    ] },
  { id: 'ice-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "I caught myself setting out two cups this morning. You weren't there. I was very good at being alone, before you.",
    opts: [
      { tone: 'cold', t: "Habit. It'll pass.", r: "Habit. Yes. I'll break it, then. I'm very good at breaking habits. And other things.", opts: [
        { tone: 'cold', t: "Probably for the best.", r: "Probably. One cup. One chair. I remember how. It was fine. It was fine.", m: -6 },
        { tone: 'passive', t: "Don't break it. I'll come and drink the second cup.", r: "Come and drink it, then. Tomorrow. Before it's cold. Before I am." },
        { tone: 'flirty', t: "Keep setting two. I'll keep turning up.", r: "Promise. ...Don't promise. Just turn up. That'll say it." },
      ] },
      { tone: 'passive', t: "What did you do with the second cup?", r: "Drank it. Cold. Standing at the window. Like a fool. A happy fool. That's the worst kind.", opts: [
        { tone: 'cold', t: "Sounds a bit sad.", r: "It was meant to sound tender. I'll stop telling you tender things.", m: -5 },
        { tone: 'passive', t: "It's not foolish. It's sweet.", r: "Sweet. I've never been sweet. ...I'll allow it, from you. Only you." },
        { tone: 'flirty', t: "Next time I'll be there to drink it hot.", r: "Hot. Black. Nothing in it. You'll make a face. I'll love you for it. ...I said that." },
      ] },
      { tone: 'flirty', t: "Before me. And now?", r: "Now I'm terrible at it. I talk to my lemon tree about you. It's embarrassed for me.", opts: [
        { tone: 'cold', t: "You'll get your solitude back eventually.", r: "Eventually. You mean when you go. ...Thank you for the warning.", m: -5 },
        { tone: 'passive', t: "I talk to my car about you.", r: "Do you. ...That's the most ridiculous and wonderful thing anyone's said to me." },
        { tone: 'flirty', t: "Good. Be terrible at it forever.", r: "Forever is a long time to be terrible. ...I'd like to try. With you." },
        { tone: 'risque', t: "Then don't be alone tonight.", r: "Tonight. Two cups. One pillow, eventually. ...Come on. Before I get good at being alone again." },
      ] },
    ] },

  // ---- slot 8: the future. The lemon tree (re-established) fruits; the grandmother wants to meet you ----------------
  { id: 'ice-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "The lemon tree on my terrace fruited. Nine years, not once, and now a lemon. I wanted to tell you first. You've been hard to tell things to.",
    opts: [
      { tone: 'cold', t: "It's a lemon.", r: "It's a lemon. It's nine years. It's the first thing I've told you in a week. ...It's a lemon.", opts: [
        { tone: 'cold', t: "Congratulations, I suppose.", r: "Thank you. I'll tell the tree. It'll be more pleased than you are.", m: -6 },
        { tone: 'passive', t: "Sorry. Badly put. It's wonderful news.", r: "It is wonderful. I wanted it to be wonderful with you. It still can be." },
        { tone: 'flirty', t: "It's a lemon. And you wanted to tell me first.", r: "...Yes. You. First. Before my grandmother. That's never happened. She'll be livid." },
      ] },
      { tone: 'passive', t: "Nine years. That's amazing. I've been far away, I know.", r: "Thank you. The other thing: my grandmother would like to meet you. It's been a week.", opts: [
        { tone: 'cold', t: "I'm not sure I'm ready for that.", r: "Ready. I see. I'll tell her you're busy. She'll understand. I won't.", m: -5 },
        { tone: 'passive', t: "I'd love to meet her.", r: "She'll interrogate you. She'll be rude about your shoes. She'll like you. Sunday." },
        { tone: 'flirty', t: "A lemon and a grandmother in one week. I'm honoured.", r: "You should be. Both took a long time. Both were, I think, waiting for you." },
      ] },
      { tone: 'flirty', t: "I told you it was waiting for someone to show it off to.", r: "Did you? I can't remember. Smug and right: very you. ...I'm showing it to you now.", opts: [
        { tone: 'cold', t: "Send me a photo.", r: "A photo. Of course. I'd thought you might come and see it. Never mind.", m: -5 },
        { tone: 'passive', t: "I'd love to see it.", r: "Tonight, then. Terrace. It's only one lemon. It's the best lemon in the world." },
        { tone: 'flirty', t: "Show me the lemon, then show me the terrace by moonlight.", r: "The lemon first. Then the terrace. Then I'll stop pretending I'm still cross." },
        { tone: 'risque', t: "I'll stay the night. Make sure it's safe.", r: "Guard the lemon. All night. ...Yes. That's a very good excuse. I'll accept it." },
      ] },
    ] },
  { id: 'ice-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "The lemon tree on my terrace has a lemon. Nine years without one. And my grandmother wants to meet you. It's been quite a week.",
    opts: [
      { tone: 'cold', t: "That's a lot at once.", r: "It is. I thought you'd be pleased. You look like someone checking for exits.", opts: [
        { tone: 'cold', t: "Old habits.", r: "Then the exit's there. I'll hold the door. I'm very polite about doors.", m: -6 },
        { tone: 'passive', t: "Sorry. I am pleased. Just surprised.", r: "Surprised I can live with. Pleased I'd like more of. Sunday. Her place. By the sea." },
        { tone: 'flirty', t: "No exits. Just shock. You're letting me in.", r: "I am. All the way in. Lemon, grandmother, terrace, me. Mind the step." },
      ] },
      { tone: 'passive', t: "Meet her? Yes. When?", r: "Sunday. By the sea. She'll ask about your posture and your intentions. Answer both standing up.", opts: [
        { tone: 'cold', t: "I don't like being interrogated.", r: "Nobody does. She does it anyway. I'd hoped you'd do it for me.", m: -5 },
        { tone: 'passive', t: "What should I bring?", r: "Nothing. She'll judge whatever you bring. Bring nothing and she'll judge that. She'll still like you." },
        { tone: 'flirty', t: "What do I say about my intentions?", r: "The truth. She can smell anything else. ...I'd like to know what you'd say, too." },
      ] },
      { tone: 'flirty', t: "Nine years and it fruits for me. I'm good luck.", r: "You're something. Luck is too random. You're more like a season. You arrived and things grew.", opts: [
        { tone: 'cold', t: "Seasons end.", r: "...They do. Thank you. That's exactly what I didn't need to hear.", m: -5 },
        { tone: 'passive', t: "That's the nicest thing you've ever said.", r: "I know. I've been saving it. I've got more. Don't make me use them all at once." },
        { tone: 'flirty', t: "Then let me be the season that doesn't end.", r: "...That's a very good line. It's also, I think, true. Come and meet her. Come and stay." },
        { tone: 'risque', t: "Take me home and show me what else grows.", r: "That's dreadful. ...Come home. The lemon can watch. No. It can't. Close the curtains." },
      ] },
    ] },
  { id: 'ice-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "Two things. The lemon tree on my terrace has fruited, after nine years. And my grandmother has asked to meet you. I blame you for both.",
    opts: [
      { tone: 'cold', t: "Why blame me?", r: "Because you came along and things started happening. I preferred nothing happening. I thought.", opts: [
        { tone: 'cold', t: "Then I'll stop happening.", r: "Don't. That's not what I meant. ...You heard what I meant and chose the other thing.", m: -5 },
        { tone: 'passive', t: "I'm glad things are happening.", r: "So am I. I'm also terrified. Both at once. You'll get used to it. I haven't." },
        { tone: 'flirty', t: "Blame me forever, then.", r: "Forever. I'll write it into the constitution. Clause nine: blame is a love language." },
      ] },
      { tone: 'passive', t: "Both of those are wonderful.", r: "They are. I can't stop smiling at a lemon. My grandmother asked if I was ill.", opts: [
        { tone: 'cold', t: "It's only a lemon.", r: "It's not only a lemon. It's not. ...Fine. It stays in here, then. I'm good at that.", m: -5 },
        { tone: 'passive', t: "When do I meet her?", r: "Sunday. By the sea. Bring nothing. Stand up straight. Don't call her by her name until she says." },
        { tone: 'flirty', t: "Tell her you're ill. Lovesick.", r: "I am not saying 'lovesick' to a ninety-one-year-old. ...She'd laugh for a month. She'd be right." },
      ] },
      { tone: 'flirty', t: "So I make things grow.", r: "Don't. That's exactly the kind of thing you'd say. ...It's also exactly what you do.", opts: [
        { tone: 'cold', t: "Coincidence, probably.", r: "Coincidence. I don't believe in it. I believed in you. Never mind.", m: -5 },
        { tone: 'passive', t: "Tell her yes. Really.", r: "Good. She'll like you. She'll pretend not to. You'll recognise the technique." },
        { tone: 'flirty', t: "Wait until you see what else I can do.", r: "I've seen. I'm still recovering. ...I'd like to see it again. Repeatedly." },
        { tone: 'risque', t: "Grandmother on Sunday. You, all of tonight.", r: "All of tonight. Then the sea. ...You've planned my whole weekend. I let you. Imagine." },
      ] },
    ] },

  // ---- slot 9: chapter end - where this is going ('with a pen'), and they say I love you, their way ----------------
  { id: 'ice-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "You've been distant, and I don't do distant with someone I love. There. I've said it. Now you know what you're being cold to.",
    opts: [
      { tone: 'cold', t: "You picked a strange time to say it.", r: "I picked the only time. I've been waiting for a warm one. You haven't given me any lately.", opts: [
        { tone: 'cold', t: "I don't know what to say.", r: "Then say nothing. I've said my one thing. I'll go home and be very quiet about it.", m: -6 },
        { tone: 'passive', t: "I'm sorry. I love you too. I've been scared.", r: "Scared. ...So have I. For months. Let's be scared in the same room. It's warmer." },
        { tone: 'flirty', t: "Say it again. I'll be warm this time.", r: "I love you. ...You're warm. You're very warm. That's better. That's much better." },
      ] },
      { tone: 'passive', t: "I love you. I'm sorry I've been far away.", r: "You love me. ...You took your time. So did I. We're both terrible at this. I'm glad.", opts: [
        { tone: 'cold', t: "Let's not get carried away.", r: "Carried away. After that. ...I'll walk, then. You can catch up when you mean it.", m: -6 },
        { tone: 'passive', t: "So where does this go now?", r: "Forward. Slowly. With tea. And a pen, for the constitution. It needs a clause about this." },
        { tone: 'flirty', t: "I'll say it every day. Until you're sick of it.", r: "I won't get sick of it. I'll pretend to. Every day. For years. That's my plan." },
      ] },
      { tone: 'flirty', t: "Then let me stop being cold. Starting now.", r: "Now. Good. I'd like it in writing. I'd like it every day. I'd like you to say it back.", opts: [
        { tone: 'cold', t: "You know how I feel.", r: "I don't. That's the point. I know everything except that. Never mind.", m: -6 },
        { tone: 'passive', t: "I love you. I should have said it first.", r: "You should. You didn't. I did. Clause three applies. I was right about you." },
        { tone: 'flirty', t: "I love you. Every cold, impossible inch of you.", r: "...Every inch. There aren't any cold ones left. You saw to that." },
        { tone: 'risque', t: "I love you. Come home and let me prove it till morning.", r: "Till morning. Then tea. Then the rest of our lives. ...In that order. Come on." },
      ] },
    ] },
  { id: 'ice-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "Where do you see this going? I'm asking casually. With a pen.",
    opts: [
      { tone: 'cold', t: "I try not to think that far ahead.", r: "I think that far ahead constantly. I'd hoped you'd be in it. Let me put the pen away.", opts: [
        { tone: 'cold', t: "Put it away, then.", r: "Away. Fine. I'll think alone. I'm very good at it. I'd stopped needing to be.", m: -6 },
        { tone: 'passive', t: "Wait. I'm in it. Everywhere I look ahead, you're there.", r: "Everywhere. ...Then I'll keep the pen out. I'll write that down first." },
        { tone: 'flirty', t: "I don't plan. But I'd plan for you.", r: "You'd plan for me. That's the most romantic thing a driver has ever said. I'm keeping it." },
      ] },
      { tone: 'passive', t: "Somewhere with you in it. Every version.", r: "Every version. Good. Mine too. ...I love you. I'm writing that down so it's official.", opts: [
        { tone: 'cold', t: "You don't need to write it down.", r: "I write down everything that matters. You've just told me it doesn't. Hm.", m: -5 },
        { tone: 'passive', t: "Me too. Put that in writing as well.", r: "Written. Signed. Dated. It's the best page in the constitution. Clause ten." },
        { tone: 'flirty', t: "Write it in ink.", r: "Ink. Permanent. ...I love you. In ink. I've never said anything in ink before." },
        { tone: 'risque', t: "Write it on my skin. Later. Slowly.", r: "Later. Slowly. With great care. I'll spell it out. Every letter. ...You'll be late tomorrow." },
      ] },
      { tone: 'flirty', t: "A terrace. A lemon tree. Two cups. Every morning.", r: "...That's very specific. That's my terrace. You've been planning. You've been planning us.", opts: [
        { tone: 'cold', t: "Just a thought.", r: "Just a thought. You don't get to give me that and then call it a thought.", m: -5 },
        { tone: 'passive', t: "I have. For a while.", r: "So have I. I love you. I have for longer than I'll admit. I'm saying it once. ...Twice. I love you." },
        { tone: 'flirty', t: "Every morning, forever.", r: "Forever. I don't use that word. I'm using it. I love you. Forever. There's the pen. Sign." },
      ] },
    ] },
  { id: 'ice-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "I'm going to say something once, and you're not allowed to make a face. I love you. ...You're making a face.",
    opts: [
      { tone: 'cold', t: "I'm just surprised.", r: "Surprised. I see. I'd hoped for something warmer than surprised. I'll wait. I hate waiting.", opts: [
        { tone: 'cold', t: "Give me time.", r: "Time. Fine. I've given you time before. I've given you everything else. Take time too.", m: -5 },
        { tone: 'passive', t: "Surprised, and happy. So do I.", r: "...Happy. Good. Then make the face. Make it all you like. I'll memorise it." },
        { tone: 'flirty', t: "Surprised you beat me to it. I love you.", r: "I always beat you to it. Clause three. ...You love me. Say it again. No face." },
      ] },
      { tone: 'passive', t: "I love you. I have for ages.", r: "You do. ...You said it so simply. Three words. No decoration. Exactly how I'd have wanted it.", opts: [
        { tone: 'cold', t: "Don't make a big thing of it.", r: "A big thing. I won't. I'll make it a small thing and keep it forever. Without you, if necessary.", m: -5 },
        { tone: 'passive', t: "So. What now?", r: "Now we go home. Tea. Two cups. Tomorrow, my grandmother. Next year, everything. Slowly." },
        { tone: 'flirty', t: "I'll say it again every morning.", r: "Every morning. Before tea. That breaks clause one. ...I'll amend the constitution." },
        { tone: 'risque', t: "I love you. Take me home and I'll show you.", r: "Home. Now. ...I'll show you too. Then I'll say it again in the dark, where you can't see my face." },
      ] },
      { tone: 'flirty', t: "This is my happy face. Get used to it.", r: "I've seen your happy face. This is a new one. It's softer. I did that. I'm unbearably pleased.", opts: [
        { tone: 'cold', t: "Don't get smug.", r: "Smug. After I said it. Fine. I'll be smug alone. It's less fun.", m: -5 },
        { tone: 'passive', t: "You did. I love you, {first}.", r: "My name. And that. ...I'll never stop hearing it. I won't let you stop saying it." },
        { tone: 'flirty', t: "I love you. All of you. Especially the ice.", r: "The ice. There's barely any left. ...Keep a little. For the look on your face when it melts." },
        { tone: 'risque', t: "Say it again. Slower. Closer.", r: "I. Love. You. ...Closer. There. Now say nothing for a very long time." },
      ] },
    ] },
];
