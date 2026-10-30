// The Ice - in person, stage 'warm': banter, slow-burn flirting, plans. Flirting works now; a risque line is a dare
// they may accept with a look.
export const DATA = [
  // ---- warm / cold: you were cool last time; they can be cooler ------------------------------------------------------
  {
    id: 'ice-warm-cold-1', stage: 'warm', mood: 'cold',
    say: "You were cool with me last time. Fine. I can be cooler. I've had years of practice.",
    opts: [
      { tone: 'cold', t: "Go ahead.", r: "Don't dare me. I'll win. I always win at this. It's lonely, but I win.", opts: [
        { tone: 'cold', t: "Then win. I'm off.", r: "Go. I'll stay right here, being victorious. It's very quiet up here." },
        { tone: 'passive', t: "Alright. I don't actually want a contest.", r: "Nor do I. I just don't know how to stop once I've started. Ask me something easy next time." },
        { tone: 'flirty', t: "You'd win. I'd enjoy losing to you, though.", r: "That's almost a sweet thing to say. I'll pretend it thawed nothing." },
      ] },
      { tone: 'passive', t: "I wasn't trying to be. It was a rough week.", r: "Then say so. I can't read rough weeks. I read faces, and yours was shut.", opts: [
        { tone: 'cold', t: "I don't owe you explanations.", r: "No. You don't. Which is what makes asking for one so humiliating. Enjoy the rest of your evening." },
        { tone: 'passive', t: "You're right. I should have said.", r: "You should have. You have now. That counts for more than you'd think." },
        { tone: 'flirty', t: "Next time I'll let you read the whole face.", r: "The whole face. Generous. Make sure it's saying something I want to hear." },
      ] },
      { tone: 'flirty', t: "Be as cool as you like. I'll still find you.", r: "Very confident, for someone who froze me out a week ago.", opts: [
        { tone: 'cold', t: "Then forget I said it.", r: "Forgotten. Filed under things you almost meant. It's a growing folder." },
        { tone: 'passive', t: "Fair. I'm sorry. I mean it.", r: "I can tell you mean it. Your jaw does a thing. Apology accepted, provisionally." },
        { tone: 'flirty', t: "I'm good at finding things. You'll see.", r: "We'll see. I'll be somewhere obvious. Don't keep me there long." },
      ] },
    ],
  },
  {
    id: 'ice-warm-cold-2', stage: 'warm', mood: 'cold',
    say: "I saved you a seat. Then I remembered how you spoke to me, and gave it away. It's free again, apparently.",
    opts: [
      { tone: 'cold', t: "I'll stand.", r: "Of course you will. Standing keeps you close to the door. I see it.", opts: [
        { tone: 'cold', t: "The door's fine where it is.", r: "Then I'll stop looking at it. And at you. There. Done." },
        { tone: 'passive', t: "Alright. I'll sit.", r: "Thank you. That cost you something. I saw it. I'll pretend I didn't." },
        { tone: 'flirty', t: "Unless you want me close.", r: "I want a number of things. Close is on the list. Not at the top. Not yet." },
      ] },
      { tone: 'passive', t: "I'll take it. And I'm sorry about last time.", r: "Sit. Apologies sound better at eye level. That one sounded decent.", opts: [
        { tone: 'cold', t: "Don't make a big thing of it.", r: "I never make big things. I make small, precise ones. You've just become one." },
        { tone: 'passive', t: "So how have you been?", r: "Busy with {work}. Annoyed with you. Less so now. In that order." },
        { tone: 'flirty', t: "Best seat in the place, now.", r: "Flattery as furniture. It's comfortable. I'll let it stay a while." },
      ] },
      { tone: 'flirty', t: "Funny how it came free just as I arrived.", r: "Isn't it. The universe has a sense of humour. Mine is drier.", opts: [
        { tone: 'cold', t: "Coincidence. Don't read into it.", r: "Fine. I'll take my reading elsewhere. The light's better there." },
        { tone: 'passive', t: "Thank you. Genuinely.", r: "Genuinely. You've been saving that word. It's working on me. Annoyingly." },
        { tone: 'flirty', t: "I'd have sat on the arm of it, honestly.", r: "And I'd have let you. That's what stung about last week. I'd been looking forward to you." },
      ] },
    ],
  },
  {
    id: 'ice-warm-cold-3', stage: 'warm', mood: 'cold', where: 'evening',
    say: "Karting. Your idea. And you've barely said a word since we got here. Is this a race or a sulk?",
    opts: [
      { tone: 'cold', t: "Bit of both.", r: "Honest. Unflattering, but honest. I'll take the honest and leave you the sulk.", opts: [
        { tone: 'cold', t: "Keep the honest. I'll keep driving.", r: "Drive, then. I'll be in the next lane, lapping you in silence." },
        { tone: 'passive', t: "Okay, mostly a race. I like this place.", r: "So do I, against all expectation. The helmet does nothing for me. You, oddly, suit it." },
        { tone: 'flirty', t: "Beat me and I'll stop sulking.", r: "Deal. Then I'll win twice. Once on the track, once on that face." },
      ] },
      { tone: 'passive', t: "Sorry. My head's still on last weekend.", r: "Leave it in the pits. I didn't book an evening with your head. I booked you.", opts: [
        { tone: 'cold', t: "I am my head.", r: "Then your head should learn manners. I'll see you at the chequered flag." },
        { tone: 'passive', t: "Right. I'm here. Fully.", r: "Good. Then show me the line through the hairpin. Properly. I hate being bad at things." },
        { tone: 'flirty', t: "You booked me? I thought this was my idea.", r: "It was. I just made it happen. That's how good ideas work around me." },
      ] },
      { tone: 'flirty', t: "Neither. I was just watching you drive.", r: "And? Speak. My lines were clean. I'm told I take corners like a verdict.", opts: [
        { tone: 'cold', t: "You brake too early.", r: "Noted, coach. I'll find my own line. Don't follow it." },
        { tone: 'passive', t: "You're good. Really good, actually.", r: "Actually. As though it surprised you. I'll forgive the word. I won't forget it." },
        { tone: 'flirty', t: "Like you'd overtake me without asking.", r: "I might. Late on the brakes, no warning. You'd thank me afterwards." },
      ] },
    ],
  },
  {
    id: 'ice-warm-cold-4', stage: 'warm', mood: 'cold', where: 'party',
    say: "Ice in my glass, ice in my voice. You started it last time. I'm only accessorising.",
    opts: [
      { tone: 'cold', t: "Suits you.", r: "Everything suits me. That wasn't the point, and you know it.", opts: [
        { tone: 'cold', t: "Then I don't know what the point is.", r: "Then I'll stop making it. Enjoy the party. It looks lovely from over there." },
        { tone: 'passive', t: "Alright. I was off with you. I'm sorry.", r: "Two lines to get there. I've seen slower. Accepted, mostly." },
        { tone: 'flirty', t: "Let me warm the glass up, then.", r: "With what, your hands? Bold. ...Leave the glass. The voice might thaw on its own." },
      ] },
      { tone: 'passive', t: "Can I buy you another, and we start over?", r: "You can buy me one. Starting over costs more. We'll see what you can afford.", opts: [
        { tone: 'cold', t: "Forget it, then.", r: "Done. I'll order my own. I've had a great deal of practice." },
        { tone: 'passive', t: "Start with the drink and see.", r: "Practical. I like practical when it's carrying something cold. Go on." },
        { tone: 'flirty', t: "I can afford quite a lot, for you.", r: "Careful. I'm very expensive when I'm happy. You've almost made me happy." },
      ] },
      { tone: 'flirty', t: "I'll melt it. Give me one song.", r: "One song. If the ice survives, you go home. If it doesn't, we talk.", opts: [
        { tone: 'cold', t: "Actually, never mind.", r: "Never mind. You do that a lot. Retreat. I'm keeping score." },
        { tone: 'passive', t: "Deal. One song, then we talk properly.", r: "Properly. No sulking, no smirking. Agreed. The ice is already sweating." },
        { tone: 'flirty', t: "It won't survive. Neither will you.", r: "Confidence. Last time it was frost. This is considerably better. Lead on." },
      ] },
    ],
  },

  // ---- warm / passive: easy footing; plans, banter, a little heat (two of these allow a dare) ----------------------
  {
    id: 'ice-warm-passive-1', stage: 'warm', mood: 'passive',
    say: "I have a free evening on Thursday. That's not an invitation. It's a fact, with potential.",
    opts: [
      { tone: 'cold', t: "Good for you.", r: "That was a door, held open. You walked straight past it to admire the wall.", opts: [
        { tone: 'cold', t: "I like walls.", r: "Then enjoy them. I'll be busy being one on Thursday." },
        { tone: 'passive', t: "Sorry. What did you have in mind?", r: "Dinner. Somewhere small. You choose, I judge. That's the arrangement." },
        { tone: 'flirty', t: "Wait. Thursday. You. Yes.", r: "Three words in the wrong order with the right meaning. I'll accept the translation." },
      ] },
      { tone: 'passive', t: "Then let's make it an invitation. Dinner?", r: "There. Was that hard? You went slightly pink. It's flattering.", opts: [
        { tone: 'cold', t: "Forget the pink. Eight o'clock.", r: "Eight. Businesslike. I'll bring my diary and my standards." },
        { tone: 'passive', t: "Somewhere quiet. I'll book.", r: "Quiet. You remembered. I'll read the menu in advance and pretend I didn't." },
        { tone: 'flirty', t: "I'll make sure you don't regret Thursday.", r: "I never regret Thursdays. Fridays, occasionally. We'll see which one you are." },
        { tone: 'risque', t: "And if dinner runs late?", r: "Then it runs late. Don't plan the ending, {me}. I'll be writing it.", m: 3 },
      ] },
      { tone: 'flirty', t: "A fact with potential. Like us.", r: "Us. You said it first. I'll remember that when it matters.", opts: [
        { tone: 'cold', t: "Figure of speech.", r: "Too late. I've read it, annotated it and put it on a shelf. Out of your reach." },
        { tone: 'passive', t: "Thursday, then?", r: "Thursday. I'll wear something that makes you forget your lines." },
        { tone: 'flirty', t: "I'll say it second, too, if you want.", r: "Don't. Say it once, at the right moment. I'll know when." },
      ] },
    ],
  },
  {
    id: 'ice-warm-passive-2', stage: 'warm', mood: 'passive',
    say: "I read a profile of you this morning. Mostly flattering. I was disappointed.",
    opts: [
      { tone: 'cold', t: "Don't read them, then.", r: "I read everything about the people I'm watching. You're on the list. Don't ask how long it is.", opts: [
        { tone: 'cold', t: "Take me off the list.", r: "Lists don't work that way. You can only drop down them. Goodbye for now." },
        { tone: 'passive', t: "What was disappointing about it?", r: "No flaws. Dull. I know you have them. I've catalogued three." },
        { tone: 'flirty', t: "Who else is on the list?", r: "Jealousy, already. That's moved you up two places. Don't let it go to your head." },
      ] },
      { tone: 'passive', t: "Why disappointed?", r: "The writer made you sound easy. You're not easy. That's the only interesting thing about anyone.", opts: [
        { tone: 'cold', t: "Easy isn't my problem.", r: "Then you're not mine either. Clean. I like clean." },
        { tone: 'passive', t: "So I'm interesting, then?", r: "Moderately. I'd read a second profile. The one I'm writing myself." },
        { tone: 'flirty', t: "Then don't make me easy. Make me work for it.", r: "Everyone works for it. You're just the first who's asked nicely." },
      ] },
      { tone: 'flirty', t: "You were reading about me over breakfast?", r: "Over coffee. I don't do breakfast. Breakfast is for people without opinions by eight.", opts: [
        { tone: 'cold', t: "Bit obsessive.", r: "Thorough. The difference is tone, and yours has just spoiled the morning." },
        { tone: 'passive', t: "What did the piece get right?", r: "Your eyes. Restless. It said that. It didn't say what you're looking for." },
        { tone: 'flirty', t: "Next time skip the profile. Ask me.", r: "Perhaps. Over breakfast. That's a large concession. Think about what it implies." },
      ] },
    ],
  },
  {
    id: 'ice-warm-passive-3', stage: 'warm', mood: 'passive', where: 'evening',
    say: "I ordered for both of us. You looked indecisive from across the room, and I was hungry.",
    opts: [
      { tone: 'cold', t: "I can order for myself.", r: "Clearly not quickly. Fine. Next time you order, and I judge you by it.", opts: [
        { tone: 'cold', t: "Then I'll order something you hate.", r: "I don't hate food. I hate waste. Which is what this dinner is becoming." },
        { tone: 'passive', t: "What did you get me?", r: "The fish. You look like someone who needs a light dinner and a heavy conversation." },
        { tone: 'flirty', t: "Order me anything. I'm here for the view.", r: "The view is eating. Don't watch me eat. Talk to me. ...Fine, watch a little." },
      ] },
      { tone: 'passive', t: "Thanks. What are we having?", r: "Something you'll like and something you'll learn to. You'll see which is which.", opts: [
        { tone: 'cold', t: "I'll decide what I like.", r: "Do. Taste is personal. Mine simply happens to be correct. Eat." },
        { tone: 'passive', t: "You've been here before?", r: "Every month. The chef knows my order and my moods. Tonight's mood is unusual." },
        { tone: 'flirty', t: "Do you always take charge like this?", r: "Always. Most people resent it. You look like you're enjoying it. Interesting." },
        { tone: 'risque', t: "What else are you taking charge of tonight?", r: "The bill. The conversation. Possibly the walk home. One look at you and I'll decide.", m: 3 },
      ] },
      { tone: 'flirty', t: "Indecisive? I was just looking at you.", r: "You were reading the menu upside down. Nice recovery. I'll pretend to be charmed.", opts: [
        { tone: 'cold', t: "Fine. It was the menu.", r: "Thank you for the honesty. Eat. It's getting cold. Like you." },
        { tone: 'passive', t: "Okay, both. The menu and you.", r: "Both. Cowardly and true. The best answers usually are. Eat your fish." },
        { tone: 'flirty', t: "I'd rather look at you than any menu.", r: "Then skip dessert. You'd only stare at it the way you're staring at me." },
      ] },
    ],
  },
  {
    id: 'ice-warm-passive-4', stage: 'warm', mood: 'passive',
    say: "You're quieter than the others. I'm beginning to suspect it's strategy.",
    opts: [
      { tone: 'cold', t: "It's not strategy. I just don't like talking much.", r: "Then we have that in common. We'll be very efficient together. Or very bored.", opts: [
        { tone: 'cold', t: "Bored, probably.", r: "Probably. You do that. Pour cold water on something just as it starts to warm." },
        { tone: 'passive', t: "Efficient sounds fine.", r: "Efficient is a compliment from me. Nearly my highest. Don't spend it all at once." },
        { tone: 'flirty', t: "Or we could find out the other way.", r: "The other way. Talking, or not talking. Choose your verb carefully." },
      ] },
      { tone: 'passive', t: "Maybe. Listening tells you more.", r: "It does. What have you learned about me, then? One thing. True.", opts: [
        { tone: 'cold', t: "That you like control.", r: "True. Delivered like an accusation. I'll be over there, controlling things." },
        { tone: 'passive', t: "That you notice everything and say a tenth of it.", r: "A tenth is generous. Five percent. But you noticed that much. Good." },
        { tone: 'flirty', t: "That you laugh with your eyes before your mouth.", r: "Nobody's ever said that. It's annoyingly accurate. I'm not laughing now. Look." },
      ] },
      { tone: 'flirty', t: "Strategy. And it's working, isn't it?", r: "It's working on someone. I'll let you guess who. One guess only.", opts: [
        { tone: 'cold', t: "Doesn't matter.", r: "It mattered to me. You've just made it not. Clever. Unpleasant, but clever." },
        { tone: 'passive', t: "You?", r: "Possibly. Write that down. It won't be repeated." },
        { tone: 'flirty', t: "It's working on me, too.", r: "Then we're both in trouble. I'll pretend I didn't hear that. Badly." },
      ] },
    ],
  },

  // ---- warm / flirty: they open flirting; slow-burn, understated, smouldering --------------------------------------
  {
    id: 'ice-warm-flirty-1', stage: 'warm', mood: 'flirty',
    say: "You're looking at me as though you've already decided something. Share it, or stop.",
    opts: [
      { tone: 'cold', t: "Nothing to share.", r: "Liar. Your eyes wrote a paragraph and your mouth said nothing.", opts: [
        { tone: 'cold', t: "Then read the paragraph yourself.", r: "I did. I've closed the book. Goodnight." },
        { tone: 'passive', t: "Alright. I decided I like talking to you.", r: "Like. Talking. Two careful words. You had braver ones. I saw them." },
        { tone: 'flirty', t: "Fine. I decided I want to kiss you. Eventually.", r: "Eventually. Of all the words. I'll be thinking about that one for days." },
      ] },
      { tone: 'passive', t: "Just that I'm glad you came.", r: "Glad. Sweet, and a fraction of the truth. I'll accept the fraction. For now.", opts: [
        { tone: 'cold', t: "That's all there is.", r: "Pity. I'd cleared my evening for more than that." },
        { tone: 'passive', t: "And that you look incredible tonight.", r: "Tonight. As if other nights were average. I'll let it slide because you're right." },
        { tone: 'flirty', t: "Glad, and very distracted by you.", r: "Distracted is good. Distracted means you've stopped performing. Stay distracted." },
      ] },
      { tone: 'flirty', t: "I've decided you're trouble. The good kind.", r: "There's no good kind. That's the whole appeal. You worked it out quicker than most.", opts: [
        { tone: 'cold', t: "Maybe I'll stay out of trouble.", r: "Maybe you will. You'll be very safe and very bored." },
        { tone: 'passive', t: "So what happens now?", r: "Now nothing. We finish this and think about it separately. Thoroughly." },
        { tone: 'flirty', t: "I'll take my chances.", r: "Then take them slowly. I like to see a risk coming." },
        { tone: 'risque', t: "Then let's get into trouble. Somewhere quieter.", r: "Said with a straight face. ...Get your coat. I haven't said yes. I haven't said no.", m: 3 },
      ] },
      { tone: 'risque', t: "I've decided I'm going to kiss you before the night's over.", r: "Announced in advance. Nerve, or manners. One look says I'm considering both.", m: 2, opts: [
        { tone: 'cold', t: "Or not. We'll see.", r: "We'll see. You blinked first. I'll hold onto that." },
        { tone: 'passive', t: "Only if you want me to.", r: "Confidence and consent. A rare pairing. Ask me again in an hour. Same face." },
        { tone: 'flirty', t: "I'll wait until you're looking at my mouth.", r: "I'm looking at your eyes. Mostly. Your timing is excellent. Don't ruin it by speaking." },
        { tone: 'risque', t: "Or right now, and we skip the hour.", r: "Skipping is cheating. ...Once. A brief one. Don't look so pleased. Fine. Look pleased.", m: 3 },
      ] },
    ],
  },
  {
    id: 'ice-warm-flirty-2', stage: 'warm', mood: 'flirty', where: 'party',
    say: "This is my second glass. That isn't why I'm smiling. I wanted that on record.",
    opts: [
      { tone: 'cold', t: "Noted. Off the record, I don't care.", r: "Ah. The cold front's back. I'd forgotten how much I dislike the weather.", opts: [
        { tone: 'cold', t: "You'll get used to the weather.", r: "I won't. I'll move somewhere warmer. Excuse me." },
        { tone: 'passive', t: "Sorry. Long day. What's put you in a good mood?", r: "You walked in. Irritating. There. Now we're both off the record." },
        { tone: 'flirty', t: "Fine. On the record: I like your smile.", r: "Too late, it's gone. ...No. Here it is again. You're a nuisance." },
      ] },
      { tone: 'passive', t: "So why are you smiling?", r: "You'll work it out. I've left very obvious clues. All of them are standing here.", opts: [
        { tone: 'cold', t: "I'm bad at clues.", r: "Then you'll lose this one. I'll go and find someone who reads." },
        { tone: 'passive', t: "Me? That's flattering.", r: "Moderately flattered, please. I don't hand these out. Ask anyone who's tried." },
        { tone: 'flirty', t: "Then I'll keep standing here.", r: "Do. You make an excellent reason. I'll make an excellent excuse." },
      ] },
      { tone: 'flirty', t: "Then I'll take full credit for the smile.", r: "Partial credit. The rest goes to the music. It's far better than you, and quieter.", opts: [
        { tone: 'cold', t: "Keep your partial credit.", r: "Gladly. It was a loan. I'll collect it from someone grateful." },
        { tone: 'passive', t: "Fair. The music is good.", r: "It is. Stand and listen with me. Silence, together. Underrated." },
        { tone: 'flirty', t: "Dance with me and I'll earn the rest.", r: "Earn it in one song. Lose your nerve and I'll take back the smile." },
        { tone: 'risque', t: "Come home with me and I'll earn the rest privately.", r: "Privately. The word hangs nicely. ...Ask me after this song. I'm deciding with my eyes.", m: 2 },
      ] },
      { tone: 'risque', t: "Then finish that glass and let me take you somewhere quiet.", r: "Somewhere quiet. You'd have to be very good company. I suspect you are.", m: 3, opts: [
        { tone: 'cold', t: "Or we stay put. Whatever you like.", r: "You withdraw the offer the moment it gets interesting. Fine. I'll stay. Alone, for now." },
        { tone: 'passive', t: "Or we just get some air.", r: "Air, then. A gentler offer. I'll take it, and your arm." },
        { tone: 'flirty', t: "I know a rooftop. Very quiet. Very close.", r: "Very close. You do like that phrase. Lead. I'll decide halfway up." },
        { tone: 'risque', t: "My place has the best quiet in the city.", r: "Does it. Show me how quiet. ...That look was a yes, {me}. Don't make me say it.", m: 4 },
      ] },
    ],
  },
  {
    id: 'ice-warm-flirty-3', stage: 'warm', mood: 'flirty', where: 'evening',
    say: "It's cold up here. Stand closer. Purely for warmth. Purely practical.",
    opts: [
      { tone: 'cold', t: "I'm fine where I am.", r: "Of course you are. You're always fine. It must be exhausting, being that fine.", opts: [
        { tone: 'cold', t: "It isn't.", r: "Then stay fine. I'll stay cold. We can admire the view separately." },
        { tone: 'passive', t: "Alright. Closer. For warmth.", r: "Better. Now you're blocking the wind, which is all I wanted. Mostly." },
        { tone: 'flirty', t: "If I stand closer, I won't want to move.", r: "Then don't. I'm not asking you to move. I'm asking you not to." },
      ] },
      { tone: 'passive', t: "Here. Take my jacket instead.", r: "A jacket. Gallant, slightly old-fashioned. I'll keep it. You'll never see it again.", opts: [
        { tone: 'cold', t: "I'll want it back.", r: "Then you'll have to ask, and you won't. Goodnight, jacketless." },
        { tone: 'passive', t: "Keep it. It suits you.", r: "It does. Particularly. I'm sorry for your loss." },
        { tone: 'flirty', t: "Then I'll have to come and get it.", r: "That's the general idea of keeping it. Come and get it sometime." },
        { tone: 'risque', t: "I'll come and collect it. Late. At your door.", r: "Late, at my door. I'll leave the light on and the decision open.", m: 3 },
      ] },
      { tone: 'flirty', t: "Purely practical. Like this?", r: "Exactly like that. You're a fast learner. I'd heard you were.", opts: [
        { tone: 'cold', t: "Too close. I'll step back.", r: "Step back, then. I'll say nothing, very loudly." },
        { tone: 'passive', t: "Warmer?", r: "Warmer. The view's improved too. I'm told that isn't a coincidence." },
        { tone: 'flirty', t: "Any warmer and it won't be practical any more.", r: "It stopped being practical a minute ago. I simply didn't announce it." },
        { tone: 'risque', t: "Then let me warm you up properly. Downstairs. Mine.", r: "A dare with a postcode. I'm smiling. That isn't a no. It isn't a yes. Keep asking." },
      ] },
      { tone: 'risque', t: "Any closer and I'll have to kiss you.", r: "Have to. As if it were a regulation. Very well. Comply.", m: 3, opts: [
        { tone: 'cold', t: "Actually, not tonight.", r: "Not tonight. Fine. The cold just got colder. Thank you for that." },
        { tone: 'passive', t: "Just once, then. Gently.", r: "Gently is the right word. Once. That's all. Now walk me down." },
        { tone: 'flirty', t: "Kiss you, then the view.", r: "Wrong order. View first, then me. The view won't mind waiting. I might." },
        { tone: 'risque', t: "Kiss you, and not stop until we're downstairs.", r: "Then don't stop. I'll tell you when. I won't tell you.", m: 4 },
      ] },
    ],
  },
  {
    id: 'ice-warm-flirty-4', stage: 'warm', mood: 'flirty',
    say: "I've been thinking about what you said last time. Annoyingly often. In meetings. While brushing my teeth.",
    opts: [
      { tone: 'cold', t: "I can't even remember what I said.", r: "Then I'll stop thinking about it. That was a cruel way to save me the trouble.", opts: [
        { tone: 'cold', t: "Saves us both time.", r: "It does. I'll spend mine elsewhere. You keep yours." },
        { tone: 'passive', t: "Kidding. I remember. I meant it.", r: "Don't kid with me about things I've thought about. Once. That's your allowance." },
        { tone: 'flirty', t: "Remind me, and I'll say it better.", r: "You couldn't. It was perfectly bad. That's why it stuck." },
      ] },
      { tone: 'passive', t: "Which part?", r: "The part you said quietly, like you were testing the floor. I'm still standing on it.", opts: [
        { tone: 'cold', t: "I wouldn't put weight on it.", r: "I already have. Now you tell me it's thin ice. How fitting." },
        { tone: 'passive', t: "It was true. Still is.", r: "Good. True things last. I'll keep it where I keep the others. There are three." },
        { tone: 'flirty', t: "Then let me say the loud version.", r: "Not here. Somewhere I can see your face properly. Pick the place." },
      ] },
      { tone: 'flirty', t: "Good. I want to be on your mind.", r: "You're on it. Don't get comfortable. The rent is high.", opts: [
        { tone: 'cold', t: "Then I'll move out.", r: "Move out, then. I'll redecorate. Briskly." },
        { tone: 'passive', t: "What's the rent?", r: "Attention. Paid weekly. You've been punctual so far. Don't slip." },
        { tone: 'flirty', t: "I can afford it. I'll stay a while.", r: "Stay a while, then. I'll stop pretending I want you to leave." },
        { tone: 'risque', t: "Think about me tonight, too. Specifically.", r: "Specifically. Now you've set homework. I'll do it thoroughly. Don't ask for marks.", m: 2 },
      ] },
      { tone: 'risque', t: "What else do you think about, while you're brushing your teeth?", r: "Things I'd never say in daylight. Ask me after dark. Ask nicely.", m: 3, opts: [
        { tone: 'cold', t: "Never mind. Too much information.", r: "You asked, then flinched. Remember that, next time you feel brave." },
        { tone: 'passive', t: "Fair. I'll ask after dark.", r: "Patience. Very attractive. Very rare. I'll be up late." },
        { tone: 'flirty', t: "It's nearly dark now.", r: "So it is. Your timing is unbearable. I'll answer one question. Choose well." },
        { tone: 'risque', t: "Then I'll ask nicely. At yours, tonight.", r: "At mine. Tonight. Asked nicely. ...I'm looking at you. That's my answer.", m: 4 },
      ] },
    ],
  },
];
