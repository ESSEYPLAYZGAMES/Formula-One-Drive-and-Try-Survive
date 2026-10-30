// DOMINANT - the phone: first text, the day after a date, and after your race. Plain data.
export const DATA = [
  {
    id: 'dominant-text-met-new-1-cold', on: 'met', stage: 'new', slot: 1, mood: 'cold',
    say: ["It's {first}. You were a little frosty when we met. I don't mind frosty. Save the number.", "{first} here. You barely smiled at me. I've decided that's a challenge. This is my number. Use it or don't."],
    opts: [
      { tone: 'cold', t: "Okay.", r: "'Okay.' Economical. I respect it. I'll be in touch when I've decided where we're eating.", opts: [
        { tone: 'cold', t: "I didn't say we're eating anywhere.", r: "You didn't. Fair. Then I'll just be in touch. Or not. Your move." },
        { tone: 'passive', t: "Fine. Saved.", r: "Good. Saved under something flattering, I hope." },
        { tone: 'flirty', t: "Saved as 'Trouble'.", r: "Accurate. I've saved you as 'Frosty'. We'll see which of us changes first." },
      ] },
      { tone: 'passive', t: "Hi. Sorry, long day. Saved.", r: "Long days I understand. Apology accepted. Get some sleep. Eat something first.", opts: [
        { tone: 'cold', t: "Don't tell me what to do.", r: "Fair. It was advice dressed as an order. Habit. Good night." },
        { tone: 'passive', t: "Will do. Night.", r: "Good. Night." },
        { tone: 'flirty', t: "Bossy already?", r: "Always. You'll get used to it. Most people end up liking it." },
      ] },
      { tone: 'flirty', t: "I was saving my smiles for later.", r: "Good. I'll collect them later, then. All of them. I keep track.", opts: [
        { tone: 'cold', t: "We'll see.", r: "We will. I'm patient. And persistent. Good night." },
        { tone: 'passive', t: "Maybe one or two.", r: "One or two is a start. I'll get the rest." },
        { tone: 'flirty', t: "You can have them all.", r: "Generous. You'll regret that. You won't. Night." },
      ] },
    ],
  },
  {
    id: 'dominant-text-met-new-1-passive', on: 'met', stage: 'new', slot: 1, mood: 'passive',
    say: ["It's {first}. Save the number. I'll be in touch about dinner.", "This is {first}. From tonight. Good to meet you properly. I'll text when I've chosen somewhere for us."],
    opts: [
      { tone: 'cold', t: "Who said anything about dinner?", r: "I did. Just now. You can say no. Most people don't.", opts: [
        { tone: 'cold', t: "No, then.", r: "Then no. Noted. Still good to meet you. Good luck this weekend." },
        { tone: 'passive', t: "Maybe. Depends where.", r: "Somewhere good. I don't do mediocre. You'll see." },
        { tone: 'flirty', t: "I'm not most people.", r: "I'd noticed. That's why I'm texting." },
      ] },
      { tone: 'passive', t: "Saved. Good to meet you too.", r: "Good. I've saved you too. Under your name. For now.", opts: [
        { tone: 'cold', t: "It's just a number.", r: "It's my number. That makes it more than just a number. Night." },
        { tone: 'passive', t: "Only for now?", r: "For now. Names change. Depends how dinner goes." },
        { tone: 'flirty', t: "Save me as something better.", r: "Earn it. Then I will." },
      ] },
      { tone: 'flirty', t: "Dinner? You don't waste time.", r: "Never. Time's the only thing I can't win back. Thursday, probably.", opts: [
        { tone: 'cold', t: "I'll check my diary.", r: "Do. I'll wait. Not forever. Reasonably." },
        { tone: 'passive', t: "Thursday works.", r: "Good. Then it's Thursday. I'll confirm the place." },
        { tone: 'flirty', t: "I like a decisive type.", r: "Then you'll like me a great deal. Good night." },
      ] },
    ],
  },
  {
    id: 'dominant-text-met-new-1-flirty', on: 'met', stage: 'new', slot: 1, mood: 'flirty',
    say: ["It's {first}. You were trouble tonight. Good trouble. Very easy to like. Save the number. I'll be using yours.", "{first} here. As promised. You were trouble - the easy-to-like kind. I'll be using your number. Don't gloat."],
    opts: [
      { tone: 'cold', t: "Trouble? Me?", r: "Trouble. You. I don't say it lightly. I don't say anything lightly.", opts: [
        { tone: 'cold', t: "I'm really not that interesting.", r: "You are. But I won't argue by text. Good night." },
        { tone: 'passive', t: "Fine. A little trouble.", r: "A little will do. I'll handle the rest." },
        { tone: 'flirty', t: "You haven't seen trouble yet.", r: "Good. I'm looking forward to it. I'll set the date." },
      ] },
      { tone: 'passive', t: "Saved. You were easy to like too.", r: "Good. Then we agree. That never happens. I'll be in touch.", opts: [
        { tone: 'cold', t: "Don't get used to compliments.", r: "I never get used to anything. I just collect them." },
        { tone: 'passive', t: "Talk tomorrow?", r: "Tomorrow. I'll text first. I always text first." },
        { tone: 'flirty', t: "I'm looking forward to it already.", r: "So am I. I don't usually admit that. I'm admitting it." },
      ] },
      { tone: 'flirty', t: "Use mine whenever you like.", r: "I will. Not too often. Just often enough. I'm very precise.", opts: [
        { tone: 'cold', t: "Not too often.", r: "Understood. Precisely rarely, then." },
        { tone: 'passive', t: "Deal. Night.", r: "Deal. Good night, trouble." },
        { tone: 'flirty', t: "I'll be waiting.", r: "Good. I like being waited for." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-warm-1-cold', on: 'date', stage: 'warm', slot: 1, mood: 'cold',
    say: ["Last night was good. You went quiet at the end. I noticed. I'd still like to do it again.", "Good night last night. Shame about the cool goodbye. We're doing it again anyway. If you want."],
    opts: [
      { tone: 'cold', t: "It was fine.", r: "'Fine.' I'll take fine and turn it into something better. Next time.", opts: [
        { tone: 'cold', t: "Let's not rush a next time.", r: "Fair. No rush. I'll wait to hear from you." },
        { tone: 'passive', t: "It was good, actually.", r: "Good. I thought so. I'm rarely wrong about evenings." },
        { tone: 'flirty', t: "It was better than fine.", r: "I know. I watched you trying not to enjoy it. You failed. Beautifully." },
      ] },
      { tone: 'passive', t: "Sorry. I was tired. I had a great time.", r: "Good. Tired I forgive. You ate well. I noticed. I approve.", opts: [
        { tone: 'cold', t: "Let's not make it a thing.", r: "No thing made. Talk soon." },
        { tone: 'passive', t: "Same again next week?", r: "Same again. Different place. I've got three in mind." },
        { tone: 'flirty', t: "I'd do it again tonight.", r: "Tonight's too soon. I like making people wait. You included." },
      ] },
      { tone: 'flirty', t: "I went quiet because I didn't want it to end.", r: "...Good answer. Very good answer. Saturday, then.", opts: [
        { tone: 'cold', t: "Don't read too much into that.", r: "I'll read exactly the right amount into it. Saturday. If you want." },
        { tone: 'passive', t: "Saturday works.", r: "Good. I'll book. You'll eat. We'll argue. Perfect." },
        { tone: 'flirty', t: "Saturday. Don't be late.", r: "I'm never late. I'm early. You'll find me waiting." },
        { tone: 'risque', t: "Then let's not end it next time.", r: "We'll see. I set the end of the night. Last night I set it early on purpose." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-warm-1-passive', on: 'date', stage: 'warm', slot: 1, mood: 'passive',
    say: ["Last night: good. Very good. We're doing it again.", "Last night was excellent. You were excellent. I don't say that. I'm saying it. Again soon."],
    opts: [
      { tone: 'cold', t: "It was nice.", r: "'Nice.' I'll aim higher next time. I always aim higher.", opts: [
        { tone: 'cold', t: "Nice is fine.", r: "Nice is never fine. But fine. Next time, I'll aim for unforgettable." },
        { tone: 'passive', t: "Very nice.", r: "Better. I'll take 'very'. Next time I'll earn 'perfect'." },
        { tone: 'flirty', t: "Nice. Very nice. Unforgettable.", r: "There it is. Correct." },
      ] },
      { tone: 'passive', t: "Yes. Again soon.", r: "Good. Thursday. I'll book. You'll eat dessert this time. All of it.", opts: [
        { tone: 'cold', t: "Not Thursday.", r: "Then another day. Your choice. I'll fit around it. I don't fit around anyone else." },
        { tone: 'passive', t: "Thursday's perfect.", r: "Good. Booked. That was fast. I'm very efficient when I want something." },
        { tone: 'flirty', t: "I'll eat whatever you put in front of me.", r: "Careful. I'll take that literally. I take most things literally." },
      ] },
      { tone: 'flirty', t: "Again tonight?", r: "Too soon. I set the pace. The pace is: soon, but not tonight.", opts: [
        { tone: 'cold', t: "Fine. Whenever.", r: "Whenever, then. Soon. You'll hear from me." },
        { tone: 'passive', t: "Okay. Soon.", r: "Good. You're learning how I work." },
        { tone: 'flirty', t: "I'll be counting the hours.", r: "So will I. I'll pretend I'm not." },
        { tone: 'risque', t: "Tonight. Your place.", r: "Bold. Very bold. No. Not yet. You'll find out why it was worth waiting." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-warm-1-flirty', on: 'date', stage: 'warm', slot: 1, mood: 'flirty',
    say: ["I've been smiling since last night. People at work have noticed. It's ruining my reputation. Again soon.", "Last night. You. That laugh. I've been smiling all morning - terrible for my reputation. Booking something now."],
    opts: [
      { tone: 'cold', t: "Don't get carried away.", r: "I never get carried away. I carry things. Fine. I'll slow down.", opts: [
        { tone: 'cold', t: "Seriously, slow down.", r: "Slowing. Not stopping. Slowing." },
        { tone: 'passive', t: "Okay, a bit carried away.", r: "A bit. Allowed. I'll book something modest. Moderately modest." },
        { tone: 'flirty', t: "Get carried away. I don't mind.", r: "Then I will. You've been warned." },
      ] },
      { tone: 'passive', t: "I've been smiling too.", r: "Good. Then it's mutual. Mutual is my favourite.", opts: [
        { tone: 'cold', t: "Not that much, though.", r: "Enough. I'll take enough." },
        { tone: 'passive', t: "When's next time?", r: "Saturday. Collecting you at 7. Eat a small lunch." },
        { tone: 'flirty', t: "Smile at me in person.", r: "Saturday. I'll make sure you do." },
      ] },
      { tone: 'flirty', t: "Ruin your reputation more.", r: "Gladly. You're very good for it. Terrible for my image.", opts: [
        { tone: 'cold', t: "Your image is fine.", r: "It was. Then I met you. Fine. Good night." },
        { tone: 'passive', t: "I'll do my best.", r: "I know you will. You're very reliable at being distracting." },
        { tone: 'flirty', t: "I'm going to ruin it completely.", r: "Good. I'll help. Saturday." },
        { tone: 'risque', t: "Ruin it tonight.", r: "Not tonight. I'm the one who decides when reputations get ruined. Soon." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-warm-2-cold', on: 'date', stage: 'warm', slot: 2, mood: 'cold',
    say: ["You let me order for both of us last night, then went quiet. The next choice is yours. Truly.", "Last night: I ordered, you went cool. Maybe I took over. You're choosing next time. I mean it."],
    opts: [
      { tone: 'cold', t: "You did take over a bit.", r: "I know. Noted. Next time it's your call, start to finish." },
      { tone: 'passive', t: "It was fine. I liked it.", r: "Good. Still - next time, you pick. I'd like to see your taste." },
      { tone: 'flirty', t: "I liked you taking over.", r: "I know. I'll still let you choose next time. Then I'll take over again." },
    ],
  },
  {
    id: 'dominant-text-date-warm-2-passive', on: 'date', stage: 'warm', slot: 2, mood: 'passive',
    say: ["You let me order dessert for both of us. Brave. Good choice, though. Next time, you pick the place.", "Last night, you trusted me with dessert. It was the right call. Next time, you choose where we eat."],
    opts: [
      { tone: 'cold', t: "One-off.", r: "One-off. Fine. Next time you order and I judge silently." },
      { tone: 'passive', t: "Okay. I'll pick next time.", r: "Good. I'll behave. I'll only comment twice." },
      { tone: 'flirty', t: "You can order for me anytime.", r: "Careful. I'll take you up on that. Every time." },
    ],
  },
  {
    id: 'dominant-text-date-warm-2-flirty', on: 'date', stage: 'warm', slot: 2, mood: 'flirty',
    say: ["Dessert last night was excellent. You were better. Your turn to pick a place. I'll pick everything else.", "You let me order. You let me pay. You let me walk you home. I'm getting spoiled. You decide where, next time."],
    opts: [
      { tone: 'cold', t: "Let's not make it a habit.", r: "Habits are how I live. But fine. Your rules next time." },
      { tone: 'passive', t: "Okay. My pick.", r: "Good. Surprise me. I'm rarely surprised." },
      { tone: 'flirty', t: "You can pick everything. I like it.", r: "I know. I'll still let you choose one thing. Generous." },
    ],
  },
  {
    id: 'dominant-text-date-warm-3-cold', on: 'date', stage: 'warm', slot: 3, mood: 'cold',
    say: ["Walked you home. You didn't look back. Fine. I don't need you to. I'd like you to.", "I walked you to your door. You were gone before I'd turned round. Noted. Not offended. Slightly offended."],
    opts: [
      { tone: 'cold', t: "I was tired.", r: "Fair. Tired is allowed. Sleep. I'll text tomorrow." },
      { tone: 'passive', t: "Sorry. I did want to look back.", r: "Good. Next time, do. I'll be watching for it." },
      { tone: 'flirty', t: "I wanted you to come in.", r: "...I know. I didn't. That was on purpose. Next time, maybe." },
      { tone: 'risque', t: "Next time, come in.", r: "We'll see. I decide that. I'm leaning heavily one way." },
    ],
  },
  {
    id: 'dominant-text-date-warm-3-passive', on: 'date', stage: 'warm', slot: 3, mood: 'passive',
    say: ["Walked you to your door and didn't come in. Hardest thing I did all week. You're welcome.", "I didn't come in last night. I wanted to. I'm very disciplined. It's exhausting."],
    opts: [
      { tone: 'cold', t: "Good. Too soon.", r: "Agreed. That's why I didn't. I'm usually right about timing." },
      { tone: 'passive', t: "Thank you. I liked that.", r: "I know. I'm patient when it matters. This matters." },
      { tone: 'flirty', t: "I almost asked you in.", r: "I know. I saw. That's why I left. Next time, ask." },
      { tone: 'risque', t: "Don't be so disciplined next time.", r: "Ask me properly. Then I'll decide. I'm told I'm very decisive." },
    ],
  },
  {
    id: 'dominant-text-date-warm-3-flirty', on: 'date', stage: 'warm', slot: 3, mood: 'flirty',
    say: ["Didn't come in last night. Kissing you goodnight was enough. Barely. Don't make me be that strong again.", "I walked away from your door last night. It took everything. Next time I might not manage it."],
    opts: [
      { tone: 'cold', t: "Next time, I might not ask.", r: "Then I'll go home. Respect. Sulk. In that order." },
      { tone: 'passive', t: "That was a good goodnight.", r: "It was. I'm very good at goodnights. I'd like to try the alternative sometime." },
      { tone: 'flirty', t: "Next time, don't be strong.", r: "I'll consider it. I consider everything you say. Very seriously." },
      { tone: 'risque', t: "Next time, don't leave.", r: "Next time, I might not. I'll decide at the door. You'll know." },
    ],
  },
  {
    id: 'dominant-text-date-close-1-cold', on: 'date', stage: 'close', slot: 1, mood: 'cold',
    say: ["You left early this morning. Without waking me. I didn't like it. I'd have made you breakfast.", "I woke up and you'd gone. No note. I'm not cross. I'm a bit cross. Next time, wake me."],
    opts: [
      { tone: 'cold', t: "I had an early start.", r: "I know. Wake me anyway. I'd rather a tired goodbye than none.", opts: [
        { tone: 'cold', t: "I didn't want to wake you.", r: "Then don't. But leave a note. That's all. One line." },
        { tone: 'passive', t: "Next time I'll wake you.", r: "Good. You'll eat first. Then you can go." },
        { tone: 'flirty', t: "I'll make it up to you.", r: "You will. Tonight. With breakfast. For dinner." },
      ] },
      { tone: 'passive', t: "Sorry. I should've woken you.", r: "You should. It's fine. I'll forgive you over coffee. Tonight.", opts: [
        { tone: 'cold', t: "It's not a big deal.", r: "It is to me. Small things are big things with me. You'll learn." },
        { tone: 'passive', t: "Coffee tonight. Deal.", r: "Deal. Then you're staying. Then I wake you. Fair's fair." },
        { tone: 'flirty', t: "I'll stay till you wake up next time.", r: "Correct. The only answer, in fact." },
      ] },
      { tone: 'flirty', t: "I left so I'd miss you all day.", r: "...That's either very romantic or very annoying. Both. Come back tonight.", opts: [
        { tone: 'cold', t: "Don't overthink it.", r: "I never overthink. I think exactly enough. Fine. Tonight, if you want." },
        { tone: 'passive', t: "I'll come back tonight.", r: "Good. I'll be waiting with breakfast. At 8pm." },
        { tone: 'flirty', t: "I did miss you all day.", r: "Good. That was the point. Mine was worse. I always win." },
        { tone: 'risque', t: "Tonight I'm not leaving early.", r: "Tonight you're not leaving at all. I'll decide when morning starts." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-close-1-passive', on: 'date', stage: 'close', slot: 1, mood: 'passive',
    say: ["Woke up and you'd stolen the entire blanket. I've decided to allow it. This once. Every time.", "You steal blankets. Noted. Also noted: I didn't mind. Come back tonight. Bring your own blanket. Or don't."],
    opts: [
      { tone: 'cold', t: "I did not steal the blanket.", r: "You did. I have evidence. I was cold. I didn't say a word. That's love.", opts: [
        { tone: 'cold', t: "Prove it.", r: "I don't need to. I was there. Fine. I'll buy a second blanket." },
        { tone: 'passive', t: "Okay, maybe I did.", r: "You did. I've filed it under 'forgivable'. It's a short file. You're most of it." },
        { tone: 'flirty', t: "You kept me warm instead.", r: "I did. That's my job. I do it better than the blanket." },
      ] },
      { tone: 'passive', t: "Sorry. Old habit.", r: "Fine. I'll adapt. I'm very adaptable. Second blanket. Ordered.", opts: [
        { tone: 'cold', t: "It's just a blanket.", r: "It's my blanket. Was. It's yours now, apparently. Like everything else." },
        { tone: 'passive', t: "Tonight I'll share.", r: "You won't. I'll let you not share. I'm generous at night." },
        { tone: 'flirty', t: "I'll make it up to you tonight.", r: "Tonight. Bring yourself. Leave the blanket theft at the door." },
      ] },
      { tone: 'flirty', t: "Steal me back, then.", r: "I intend to. Tonight. I'll take the blanket and you.", opts: [
        { tone: 'cold', t: "Not tonight. I've got an early one.", r: "Then tomorrow. I'll guard my blanket till then." },
        { tone: 'passive', t: "Tonight. Deal.", r: "Good. 8. I'm cooking. Then I'm taking my blanket back." },
        { tone: 'flirty', t: "You can have me and the blanket.", r: "That's the deal I wanted. Accepted." },
        { tone: 'risque', t: "Come and take it back.", r: "I'll take it back. And more. Tonight. Don't be late." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-close-1-flirty', on: 'date', stage: 'close', slot: 1, mood: 'flirty',
    say: ["You stole the blanket, the pillow and my shirt. I've never slept better. Explain that.", "You stole my shirt and most of the bed. Still thinking about it. Come back tonight."],
    opts: [
      { tone: 'cold', t: "You're very sentimental this morning.", r: "I'm never sentimental. I'm accurate. Fine. A bit sentimental.", opts: [
        { tone: 'cold', t: "Stop it.", r: "Stopping. Very hard. Good morning anyway." },
        { tone: 'passive', t: "It's sweet.", r: "It's rare. Enjoy it. I'll be bossy again by lunch." },
        { tone: 'flirty', t: "I like you sentimental.", r: "Then I'll be sentimental. In private. Only with you." },
      ] },
      { tone: 'passive', t: "I slept well too.", r: "Good. Then we're doing it again. Tonight. Statement, not question.", opts: [
        { tone: 'cold', t: "Not tonight. Busy.", r: "...Not tonight. Fine. Tomorrow. That's a question." },
        { tone: 'passive', t: "Tonight it is.", r: "Good. I'll cook. You'll steal the blanket again. I'll let you." },
        { tone: 'flirty', t: "I'll bring my own pillow.", r: "Don't. I like it when you steal mine." },
      ] },
      { tone: 'flirty', t: "I'll steal it all again tonight.", r: "Good. I'll put up a fight. A very small one.", opts: [
        { tone: 'cold', t: "Maybe tomorrow instead.", r: "Tomorrow, then. I'll keep the blanket warm." },
        { tone: 'passive', t: "Tonight. Promise.", r: "Promise accepted. Then you're mine for the night." },
        { tone: 'flirty', t: "Keep the shirt for me.", r: "It's yours now. Like most of my things. Like me." },
        { tone: 'risque', t: "Tonight, and I'm not giving it back.", r: "Then I'll have to take it back. Slowly. Tonight." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-close-2-cold', on: 'date', stage: 'close', slot: 2, mood: 'cold',
    say: ["Last night was lovely until you went quiet. Rematch, please. The whole thing. With the talking.", "You were somewhere else last night. Then you came back. I'd like the version that came back. Tonight."],
    opts: [
      { tone: 'cold', t: "I was just tired.", r: "Then sleep. Then come back. I'll be here. I'm always here." },
      { tone: 'passive', t: "Sorry. Rematch tonight?", r: "Rematch tonight. 8. I'm cooking. You're talking." },
      { tone: 'flirty', t: "Rematch. I'll be all there.", r: "Good. All of you. That's all I want." },
      { tone: 'risque', t: "Rematch. Same ending.", r: "Same ending. Better start. Leave that to me." },
    ],
  },
  {
    id: 'dominant-text-date-close-2-passive', on: 'date', stage: 'close', slot: 2, mood: 'passive',
    say: ["Still thinking about last night. I'd like a rematch. Of all of it.", "Last night: excellent. I'd like to do it again. Immediately. I'm told that's not possible. I disagree."],
    opts: [
      { tone: 'cold', t: "Give it a day.", r: "A day. Fine. I'll be patient. I'll be very bad at it." },
      { tone: 'passive', t: "Rematch Friday?", r: "Friday. I'll book. I'll win. You'll love losing." },
      { tone: 'flirty', t: "I want a rematch too.", r: "Good. Then we agree. That happens more and more. It's unnerving." },
      { tone: 'risque', t: "Rematch tonight. All of it.", r: "...Tonight. Fine. 8. Don't eat late. Don't be late." },
    ],
  },
  {
    id: 'dominant-text-date-close-2-flirty', on: 'date', stage: 'close', slot: 2, mood: 'flirty',
    say: ["Last night. I've thought about nothing else. I've been useless all morning. Your fault. Rematch.", "I won last night. You'll say you did. Rematch to settle it. Tonight."],
    opts: [
      { tone: 'cold', t: "Settle it later.", r: "Later. Fine. I'll gloat in the meantime." },
      { tone: 'passive', t: "I definitely won.", r: "You didn't. But I'll let you think it till tonight." },
      { tone: 'flirty', t: "Tonight. I'll win this time.", r: "You won't. But I'll enjoy every minute of you trying." },
      { tone: 'risque', t: "Tonight. Winner decides everything.", r: "Then I'll decide everything. As usual. 8." },
    ],
  },
  {
    id: 'dominant-text-date-close-3-cold', on: 'date', stage: 'close', slot: 3, mood: 'cold',
    say: ["You fell asleep on me in the car last night, then went quiet this morning. Forty minutes I sat still. Talk to me.", "I sat in the car forty minutes so you could sleep. Then you were distant all morning. I'd like to understand."],
    opts: [
      { tone: 'cold', t: "Nothing to understand.", r: "There always is. Fine. When you're ready. I'll still sit still for you.", opts: [
        { tone: 'cold', t: "Leave it.", r: "Left. I'm still here when you want me." },
        { tone: 'passive', t: "Just worn out. Sorry.", r: "Tired I'll take. Next time, tell me. I'll drive you home slower." },
        { tone: 'flirty', t: "Thank you for not moving.", r: "...You noticed. Again, any time. Forty hours, if needed." },
      ] },
      { tone: 'passive', t: "Sorry. Long week. Thank you for that.", r: "Don't thank me. Just sleep more. On me, preferably.", opts: [
        { tone: 'cold', t: "You didn't have to do that.", r: "I know. I wanted to. That's different." },
        { tone: 'passive', t: "Forty minutes? Really?", r: "Forty-two. I counted. My arm's still asleep. Worth it." },
        { tone: 'flirty', t: "Next time wake me with a kiss.", r: "Next time I'll let you sleep and steal one. Fair." },
      ] },
      { tone: 'flirty', t: "You're soft, you know.", r: "Tell no one. I'll deny it. I'll deny it very firmly.", opts: [
        { tone: 'cold', t: "It's really not a big deal.", r: "It was to me. Fine. Good morning." },
        { tone: 'passive', t: "Your secret's safe.", r: "Good. It's the only one I've got. It's you." },
        { tone: 'flirty', t: "I love it when you're soft.", r: "...Then I'll be soft. Just for you. Not a word to anyone." },
        { tone: 'risque', t: "Be soft with me tonight.", r: "Tonight. Then bossy. Then soft again. I'll decide the order." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-close-3-passive', on: 'date', stage: 'close', slot: 3, mood: 'passive',
    say: ["Last night you fell asleep on me in the car. I didn't move for forty minutes. Tell no one.", "You slept on my shoulder all the way home. I sat in the car forty more minutes. That's not like me. Don't spread it."],
    opts: [
      { tone: 'cold', t: "You should've woken me.", r: "No. You needed it. I decide these things. Fine. You'll be woken next time.", opts: [
        { tone: 'cold', t: "I mean it. Wake me next time.", r: "Understood. I'll wake you. Gently. Reluctantly." },
        { tone: 'passive', t: "Thanks for letting me sleep.", r: "Always. You sleep, I guard. That's the arrangement." },
        { tone: 'flirty', t: "I'd fall asleep on you any day.", r: "Good. I'll keep the shoulder free." },
      ] },
      { tone: 'passive', t: "That's really sweet.", r: "It's not sweet. It's practical. You were exhausted. ...It was a bit sweet.", opts: [
        { tone: 'cold', t: "Don't make a habit of it.", r: "I make habits of everything. This one's a good one." },
        { tone: 'passive', t: "Did your arm survive?", r: "Barely. I've lost all feeling. Worth it." },
        { tone: 'flirty', t: "I feel safe with you.", r: "...Good. That's what I'm for. Sleep well tonight." },
      ] },
      { tone: 'flirty', t: "Tell no one? Too late. I'm telling everyone.", r: "Don't you dare. ...Fine. Tell them I'm terrifying, and also that.", opts: [
        { tone: 'cold', t: "Fine, I won't.", r: "Good. Secret kept. Good morning." },
        { tone: 'passive', t: "Just my closest friends.", r: "Fine. Only if they promise to be scared of me as well." },
        { tone: 'flirty', t: "I'm telling them you're mine.", r: "That they can know. That's not a secret. That's a fact." },
        { tone: 'risque', t: "Tonight, I'm not sleeping in the car.", r: "No. You're sleeping somewhere much better. After." },
      ] },
    ],
  },
  {
    id: 'dominant-text-date-close-3-flirty', on: 'date', stage: 'close', slot: 3, mood: 'flirty',
    say: ["You fell asleep on me in the car. Drooled a bit. I've gone soft. Come back tonight.", "I let you sleep on me for forty minutes in a parked car. You drooled. I'm going soft. Your fault. Come and fix it."],
    opts: [
      { tone: 'cold', t: "I did not drool.", r: "You did. A small amount. I didn't mind. I'll never mention it again. I'll mention it constantly.", opts: [
        { tone: 'cold', t: "Never mention it again.", r: "Never. Locked away. ...Mostly." },
        { tone: 'passive', t: "Fine. A tiny bit.", r: "A little. Adorable. Don't tell anyone I said adorable." },
        { tone: 'flirty', t: "Drooling on you is a privilege.", r: "It's a privilege I grant to one person. Don't abuse it." },
      ] },
      { tone: 'passive', t: "Sorry for falling asleep.", r: "Don't be. That was the best forty minutes of my week. And I won things this week.", opts: [
        { tone: 'cold', t: "It won't happen again.", r: "It will. I'll make sure of it. Long drives. Late nights." },
        { tone: 'passive', t: "I'll stay awake next time.", r: "Don't. I'd rather you slept. On me." },
        { tone: 'flirty', t: "Come and get me tonight, then.", r: "8. I'll drive. You'll sleep. I'll sit there afterwards like an idiot again." },
      ] },
      { tone: 'flirty', t: "Come here and I'll make you softer.", r: "Not possible. I'm entirely soft already. Your fault. Come here.", opts: [
        { tone: 'cold', t: "Actually, not tonight.", r: "Not tonight. Fine. I'll be soft on my own. Tragic." },
        { tone: 'passive', t: "Tonight, then.", r: "Tonight. I'll be firm about it." },
        { tone: 'flirty', t: "I'll fix it. Tonight.", r: "Good. Fix it thoroughly. I'll supervise." },
        { tone: 'risque', t: "Fix it in bed instead of the car.", r: "Agreed. Much better setting. 8. Don't be late." },
      ] },
    ],
  },
  {
    id: 'dominant-text-win-any-1-cold', on: 'win', stage: 'any', slot: 1, mood: 'cold',
    say: ["You won. Good. Very good. You've been cold with me, but I'm proud of you anyway. Annoyingly.", "P1 at {last}. I watched every lap. I'm not speaking to you. I'm also screaming. Well done."],
    opts: [
      { tone: 'cold', t: "Thanks.", r: "'Thanks.' I'll take it. I'll celebrate for both of us.", opts: [
        { tone: 'cold', t: "That's all I've got.", r: "That's fine. It's enough. Enjoy it." },
        { tone: 'passive', t: "Thanks. Really. It means a lot.", r: "Good. It should. I don't say 'proud' often." },
        { tone: 'flirty', t: "Celebrate with me.", r: "I intend to. Name the day. I'll book the table." },
      ] },
      { tone: 'passive', t: "I can't believe it.", r: "Believe it. You earned it. I watched you earn it. Lap by lap.", opts: [
        { tone: 'cold', t: "It was a lucky race.", r: "Luck is for people who weren't ready. You were ready. Stop it." },
        { tone: 'passive', t: "Did you really watch every lap?", r: "Every lap. I stood up for the last five. I don't stand for anything." },
        { tone: 'flirty', t: "I was thinking about you on the podium.", r: "...Good. I was thinking about you the entire race. We're even." },
      ] },
      { tone: 'flirty', t: "I won it for you.", r: "You won it for you. Then you can give me a piece of it. Dinner.", opts: [
        { tone: 'cold', t: "Well, mostly for me.", r: "Correct. As it should be. Well done." },
        { tone: 'passive', t: "Dinner, then.", r: "Dinner. I'm paying. Champions don't pay." },
        { tone: 'flirty', t: "You can have the trophy.", r: "I don't want the trophy. I want the person holding it. Over dinner." },
      ] },
    ],
  },
  {
    id: 'dominant-text-win-any-1-passive', on: 'win', stage: 'any', slot: 1, mood: 'passive',
    say: ["You won. Good. Very good. I'm already insufferable about it.", "P1. At {last}. I watched every lap standing up. I never stand up for anything. Well done. Properly well done."],
    opts: [
      { tone: 'cold', t: "It was a team effort.", r: "It always is. You did the driving. Take the credit. That's an order.", opts: [
        { tone: 'cold', t: "Still, it's the team.", r: "Fine. The team. And you. Mostly you. Good." },
        { tone: 'passive', t: "Okay. I'll take it.", r: "Good. Now eat something. Then celebrate." },
        { tone: 'flirty', t: "I'll take the credit if you take me to dinner.", r: "Deal. I'll book. Somewhere worthy of a winner." },
      ] },
      { tone: 'passive', t: "Thank you. I'm buzzing.", r: "You should be. Enjoy every second. I'm enjoying it for you as well.", opts: [
        { tone: 'cold', t: "I need to sleep.", r: "Then sleep. Winners need sleep. I'll celebrate quietly." },
        { tone: 'passive', t: "I couldn't have done it without the car.", r: "The car didn't brake at the end of the straight. You did. Late. Perfectly." },
        { tone: 'flirty', t: "Celebrate with me?", r: "Name the night. I'll make it a good one." },
      ] },
      { tone: 'flirty', t: "Insufferable looks good on you.", r: "Everything does. But winning looks better on you. Well done.", opts: [
        { tone: 'cold', t: "I need a minute.", r: "Take an hour. Take the night. I'll still be proud tomorrow." },
        { tone: 'passive', t: "Thank you. Really.", r: "You're welcome. Really. Now go and enjoy it." },
        { tone: 'flirty', t: "Come and be insufferable in person.", r: "Tell me when. I'll be there. I'll be loud about it." },
      ] },
    ],
  },
  {
    id: 'dominant-text-win-any-1-flirty', on: 'win', stage: 'any', slot: 1, mood: 'flirty',
    say: ["You won. I may have shouted at my television. Several times. Come here so I can shout at you in person.", "P1. I shouted at the screen. Winner is a very good look on you. I'd like to see it up close."],
    opts: [
      { tone: 'cold', t: "Easy. It was just one race.", r: "Just one race? It's a win. Take it. Then take another.", opts: [
        { tone: 'cold', t: "It's one race.", r: "Fine. One race. One brilliant race. Well done." },
        { tone: 'passive', t: "Okay, it was good.", r: "It was excellent. Say excellent." },
        { tone: 'flirty', t: "I'll win you more.", r: "Do. I'll collect every one." },
      ] },
      { tone: 'passive', t: "Thank you! What a day.", r: "What a driver. Eat something. Then celebrate. In that order.", opts: [
        { tone: 'cold', t: "I'm too tired to celebrate.", r: "Then sleep. I'll celebrate on your behalf. Loudly." },
        { tone: 'passive', t: "I'll eat. Promise.", r: "Good. I'll check. I always check." },
        { tone: 'flirty', t: "Celebrate with me tomorrow?", r: "Tomorrow. I'll book. You'll get the good chair." },
      ] },
      { tone: 'flirty', t: "Come and shout at me, then.", r: "I will. Then I'll stop shouting. Then I'll say well done properly.", opts: [
        { tone: 'cold', t: "Not tonight. Exhausted.", r: "Fine. Tomorrow. I'll still be shouting." },
        { tone: 'passive', t: "Tomorrow?", r: "Tomorrow. I'll find you. You won't have to look." },
        { tone: 'flirty', t: "Yes. Very much yes.", r: "So would I. Very much. Winner." },
      ] },
    ],
  },
  {
    id: 'dominant-text-win-any-2-cold', on: 'win', stage: 'any', slot: 2, mood: 'cold',
    say: ["Another win. You're still cold with me. I'm still proud. Both things are true.", "Two wins. I'm keeping count. I keep count of everything. Including how long you've been distant."],
    opts: [
      { tone: 'cold', t: "Thanks for that.", r: "You're welcome. Well driven." },
      { tone: 'passive', t: "Sorry. Thank you. I mean it.", r: "Good. Accepted. Now celebrate." },
      { tone: 'flirty', t: "Count my wins, not my moods.", r: "...Fair. Two wins. Zero complaints. Well done." },
    ],
  },
  {
    id: 'dominant-text-win-any-2-passive', on: 'win', stage: 'any', slot: 2, mood: 'passive',
    say: ["Again. You've won again. This is becoming normal. I approve.", "Second win. I watched it. I've watched it again. I'll watch it a third time. Don't make that weird."],
    opts: [
      { tone: 'cold', t: "Don't jinx it.", r: "Jinxes are for amateurs. I believe in you braking late. Well done." },
      { tone: 'passive', t: "Thank you. Feeling good.", r: "You should. Two wins. I'm keeping score. So should you." },
      { tone: 'flirty', t: "You're my lucky charm.", r: "I'm not lucky. I'm right. And you're welcome." },
    ],
  },
  {
    id: 'dominant-text-win-any-2-flirty', on: 'win', stage: 'any', slot: 2, mood: 'flirty',
    say: ["Two wins. You're making me look very good for picking you. I'll need a shelf.", "Another one. I'm going to need a bigger shelf. For your trophies. At mine."],
    opts: [
      { tone: 'cold', t: "A bit presumptuous.", r: "Presumptuous is my favourite way to be. Well done, champion." },
      { tone: 'passive', t: "Thanks. It feels amazing.", r: "It should. Bottle it. You'll want it at {track}." },
      { tone: 'flirty', t: "Clear the shelf, then.", r: "Already cleared. Hurry up." },
    ],
  },
  {
    id: 'dominant-text-win-any-3-cold', on: 'win', stage: 'any', slot: 3, mood: 'cold',
    say: ["Win number three. You're making a habit of this. And a habit of being cool with me. Keep only one.", "Three wins. Still proud. Still getting the cold version of you. Keep one of those habits."],
    opts: [
      { tone: 'cold', t: "I'll keep both.", r: "...Fine. Keep both. I'll keep the proud part either way." },
      { tone: 'passive', t: "Okay. I'll keep the winning.", r: "Good. And warm up a little. That's not an order. It's a request." },
      { tone: 'flirty', t: "Then I'll keep you.", r: "...Good. Better answer. Well done, three times." },
    ],
  },
  {
    id: 'dominant-text-win-any-3-passive', on: 'win', stage: 'any', slot: 3, mood: 'passive',
    say: ["Third win. It's a habit now. Good. Keep it.", "Three. Wins. A habit. I don't get excited. I'm excited. Don't tell anyone."],
    opts: [
      { tone: 'cold', t: "It's starting to feel normal.", r: "Never let it feel normal. Let it feel earned. It is." },
      { tone: 'passive', t: "I don't want to stop.", r: "Then don't. I'll be watching. Every lap. As usual." },
      { tone: 'flirty', t: "Habit's the right word. Like you.", r: "...Good line. Stolen. I'm using it." },
    ],
  },
  {
    id: 'dominant-text-win-any-3-flirty', on: 'win', stage: 'any', slot: 3, mood: 'flirty',
    say: ["Three wins. People keep asking why I'm smiling. I'm going to have to stop being impressed. I'm not stopping.", "You win, I smile, people ask why. I'm running out of excuses. Win number three. Insufferable. Both of us."],
    opts: [
      { tone: 'cold', t: "Calm down.", r: "I'm extremely calm. I'm also standing on a chair. Well done." },
      { tone: 'passive', t: "I'm loving this.", r: "So am I. Keep it coming." },
      { tone: 'flirty', t: "Tell them it's me.", r: "I might. If you win the next one, I'll tell everyone." },
    ],
  },
  {
    id: 'dominant-text-podium-any-1-cold', on: 'podium', stage: 'any', slot: 1, mood: 'cold',
    say: ["Podium. {result}. You've been cool with me, but I'm still proud. I'd say more. You'd answer in one word.", "{result} at {last}. Good drive. I'd say more, but you'd only answer in one word."],
    opts: [
      { tone: 'cold', t: "Cheers.", r: "Cheers. One word. As predicted. Well driven anyway." },
      { tone: 'passive', t: "Thanks. Wish it was the win.", r: "It will be. You were close. Close is a step. Take it." },
      { tone: 'flirty', t: "You can say more. I'll listen.", r: "...Good. Then: well done. Properly. You were superb." },
    ],
  },
  {
    id: 'dominant-text-podium-any-1-passive', on: 'podium', stage: 'any', slot: 1, mood: 'passive',
    say: ["Podium. Good. Not the top step. But good. Next time, the top.", "{result} at {last}. On the podium. I stood up for the last lap. Well done."],
    opts: [
      { tone: 'cold', t: "It's not the win.", r: "No. It's a podium. Take it. Then take the win next time." },
      { tone: 'passive', t: "Thanks. I'll take it. Happily.", r: "Good. Eat something. Celebrate a bit. Not too much. You've a win to go and get." },
      { tone: 'flirty', t: "Next time I'll win for you.", r: "Win for yourself. Then tell me about it." },
    ],
  },
  {
    id: 'dominant-text-podium-any-1-flirty', on: 'podium', stage: 'any', slot: 1, mood: 'flirty',
    say: ["Podium. You looked very good up there. Next time I want you on the top step. Don't argue.", "{result}. Spraying things on a podium suits you. Next time, the middle step. I'll be watching."],
    opts: [
      { tone: 'cold', t: "Don't push me.", r: "I always push. Fine. Gently. Well done." },
      { tone: 'passive', t: "Thanks! Felt good.", r: "It looked good. Now: eat. Sleep. Then win." },
      { tone: 'flirty', t: "I'll do it for you.", r: "Do it for you. Then do something else for me. Dinner." },
    ],
  },
  {
    id: 'dominant-text-podium-any-2-cold', on: 'podium', stage: 'any', slot: 2, mood: 'cold',
    say: ["Another podium. Still cool with me, though. I'll keep cheering. I'm stubborn.", "{result}. Twice on the podium now. I've noticed. I'm still cheering. Even through your silences."],
    opts: [
      { tone: 'cold', t: "I'm just busy.", r: "Busy and on the podium. Fine. Well done." },
      { tone: 'passive', t: "Sorry. Thanks for cheering.", r: "Always. Silence won't stop me." },
      { tone: 'flirty', t: "Keep noticing.", r: "I will. Both things. Especially the podiums." },
    ],
  },
  {
    id: 'dominant-text-podium-any-2-passive', on: 'podium', stage: 'any', slot: 2, mood: 'passive',
    say: ["Podium again. You're getting good at this. I'd like a win next. Don't make me wait.", "{result}. Again. Consistent. I respect consistent. I'd respect a win more."],
    opts: [
      { tone: 'cold', t: "Give me a break.", r: "I will. After the win." },
      { tone: 'passive', t: "Working on the win.", r: "I know. I can tell. You're closer every time." },
      { tone: 'flirty', t: "I'll win for you next.", r: "Good. I'll hold the date." },
    ],
  },
  {
    id: 'dominant-text-podium-any-2-flirty', on: 'podium', stage: 'any', slot: 2, mood: 'flirty',
    say: ["Another podium. You look like you belong up there. Next, the top. Then dinner. In that order.", "{result}. You keep climbing. I keep watching. It's very distracting."],
    opts: [
      { tone: 'cold', t: "Don't be weird about it.", r: "I never make it weird. I make it intense. Different." },
      { tone: 'passive', t: "Thanks. Dinner sounds good.", r: "Win first. Then dinner. Fine, dinner anyway." },
      { tone: 'flirty', t: "I like distracting you.", r: "I know. You're very good at it. Well done." },
    ],
  },
  {
    id: 'dominant-text-podium-any-3-cold', on: 'podium', stage: 'any', slot: 3, mood: 'cold',
    say: ["Third podium. You're making a habit of it. You're also making a habit of keeping me at arm's length.", "{result}. Three podiums - a habit. So is not sounding pleased to hear from me. Talk."],
    opts: [
      { tone: 'cold', t: "Nothing's wrong.", r: "'Nothing.' Fine. I'll believe it when it sounds warmer.", opts: [
        { tone: 'cold', t: "Nothing's wrong. Really.", r: "Fine. I'll leave it. Well driven." },
        { tone: 'passive', t: "Okay. I've been distracted.", r: "Distracted I understand. Talk to me when you can." },
        { tone: 'flirty', t: "I'm warmer than I sound.", r: "Prove it. Dinner. I'm booking." },
      ] },
      { tone: 'passive', t: "Sorry. It's been a lot.", r: "I know. So I'm here. Talk to me. I'm good at listening. I'm better at fixing.", opts: [
        { tone: 'cold', t: "Nothing to fix. Thanks.", r: "I know. Then I'll just listen. Well driven." },
        { tone: 'passive', t: "Thank you. That helps.", r: "Good. Then let me help more. Dinner. Thursday." },
        { tone: 'flirty', t: "Fix me with dinner.", r: "Done. Thursday. I'll book." },
      ] },
      { tone: 'flirty', t: "Habit's a strong word.", r: "So's podium. Three of them. Strong words for a strong driver.", opts: [
        { tone: 'cold', t: "Don't flatter me.", r: "I never flatter. I inform. Fine. Well done." },
        { tone: 'passive', t: "That's kind. Thanks.", r: "You're welcome. Now win one." },
        { tone: 'flirty', t: "You're stronger.", r: "I know. But you're catching up. Fast." },
      ] },
    ],
  },
  {
    id: 'dominant-text-podium-any-3-passive', on: 'podium', stage: 'any', slot: 3, mood: 'passive',
    say: ["Third podium. That's a pattern now. I'm impressed. Make the top step one too.", "{result}. That's three podiums. I'm still impressed. Next: the top step."],
    opts: [
      { tone: 'cold', t: "Top step's not easy.", r: "Nothing worth having is. Win it anyway.", opts: [
        { tone: 'cold', t: "Easy for you to say.", r: "It is. That's why I say it. Well done." },
        { tone: 'passive', t: "I know. I'm close.", r: "You're very close. Next time." },
        { tone: 'flirty', t: "Easier with you watching.", r: "Then I'll keep watching. Every lap." },
      ] },
      { tone: 'passive', t: "I'm getting closer.", r: "You are. I can see it. Turn by turn.", opts: [
        { tone: 'cold', t: "Not close enough.", r: "Close enough to be proud of. Then closer." },
        { tone: 'passive', t: "Next one's the win.", r: "Good. I'll book the celebration in advance." },
        { tone: 'flirty', t: "I'll win and you'll take me out.", r: "I'll take you out anyway. If you win, I'll take you somewhere better." },
      ] },
      { tone: 'flirty', t: "You're impressed? Say it again.", r: "I'm impressed. That's twice in one day. A record.", opts: [
        { tone: 'cold', t: "Okay, okay.", r: "Good. Well done. Rest." },
        { tone: 'passive', t: "Means a lot.", r: "It should. I don't hand it out. Eat something." },
        { tone: 'flirty', t: "Impressed enough for dinner?", r: "Impressed enough for dinner and dessert." },
      ] },
    ],
  },
  {
    id: 'dominant-text-podium-any-3-flirty', on: 'podium', stage: 'any', slot: 3, mood: 'flirty',
    say: ["Three podiums. You keep standing up there and I keep watching. I like your habits. Most of them.", "{result}. Again. A habit now. I approve of most of your habits."],
    opts: [
      { tone: 'cold', t: "Don't distract me.", r: "I'm the best kind of distraction. But fine. Focus. Win.", opts: [
        { tone: 'cold', t: "Seriously. Focus mode.", r: "Understood. Focus. I'll be quiet till the next race." },
        { tone: 'passive', t: "A little distraction is fine.", r: "A little. I'll ration it." },
        { tone: 'flirty', t: "Distract me after the race.", r: "That's the plan. Every race." },
      ] },
      { tone: 'passive', t: "Thanks. I'm happy with it.", r: "Good. Be happy. Then be hungry for the top step.", opts: [
        { tone: 'cold', t: "I'm always hungry for it.", r: "Good. Then eat something too. Literally." },
        { tone: 'passive', t: "I'll be on top next time.", r: "Good. My eyes will be on it." },
        { tone: 'flirty', t: "I'll celebrate with you either way.", r: "Either way. Correct." },
      ] },
      { tone: 'flirty', t: "Most of them?", r: "Most. You still brake too early sometimes. I'm working on you.", opts: [
        { tone: 'cold', t: "Leave my braking alone.", r: "Fine. Braking left alone. You look good on the podium. That stays." },
        { tone: 'passive', t: "Fine, I'll work on the braking.", r: "Good. Then you'll be perfect. Nearly." },
        { tone: 'flirty', t: "Work on me in person.", r: "Gladly. Dinner. I'll bring notes." },
      ] },
    ],
  },
  {
    id: 'dominant-text-points-any-1-cold', on: 'points', stage: 'any', slot: 1, mood: 'cold',
    say: ["{result}. Points. Fine. Things are cool between us. I'm still watching. I always watch.", "Points at {last}. {result}. Solid. You've gone quiet on me. I haven't gone quiet on you."],
    opts: [
      { tone: 'cold', t: "It's not much.", r: "It's points. Points count. So do you." },
      { tone: 'passive', t: "Thanks. I'll take the points.", r: "Good. Take them. Then take more next time." },
      { tone: 'flirty', t: "You always watch?", r: "Always. Every lap. It's a bit weird. I've made peace with it." },
    ],
  },
  {
    id: 'dominant-text-points-any-1-passive', on: 'points', stage: 'any', slot: 1, mood: 'passive',
    say: ["{result}. Points. Good. Solid. Next time, more. Eat something.", "Points at {last}. {result}. A good day's work. I'd like a better day's work next time. But good."],
    opts: [
      { tone: 'cold', t: "It was a rubbish race.", r: "It was a points race. Rubbish races don't get points. Eat. Sleep." },
      { tone: 'passive', t: "Thanks. Solid day.", r: "Solid. I like solid. I like spectacular more." },
      { tone: 'flirty', t: "You're very demanding.", r: "I'm very interested. Same thing, with me." },
    ],
  },
  {
    id: 'dominant-text-points-any-1-flirty', on: 'points', stage: 'any', slot: 1, mood: 'flirty',
    say: ["{result}. Points. Not your best. Still the best thing I watched today. Twice.", "You scored points and looked very good doing it. I watched. Twice."],
    opts: [
      { tone: 'cold', t: "Don't patronise me.", r: "I never patronise. I admire. Fine. Well done." },
      { tone: 'passive', t: "Thanks. Next time, better.", r: "Better. Good. I'll be watching. As usual." },
      { tone: 'flirty', t: "Only twice?", r: "Three times. I lied. I'll watch it again tonight." },
    ],
  },
  {
    id: 'dominant-text-points-any-2-cold', on: 'points', stage: 'any', slot: 2, mood: 'cold',
    say: ["More points. Still cool with me. Points are good. Warmth would be better.", "{result}. Points again. You're consistent. Consistently distant too."],
    opts: [
      { tone: 'cold', t: "I'm focused.", r: "Focused I respect. Fine. Well driven." },
      { tone: 'passive', t: "Sorry. Thanks.", r: "Good. Accepted. Nicely driven." },
      { tone: 'flirty', t: "I'll warm up for the win.", r: "Then win soon." },
    ],
  },
  {
    id: 'dominant-text-points-any-2-passive', on: 'points', stage: 'any', slot: 2, mood: 'passive',
    say: ["Points again. Steady. You're in my spreadsheet now. Surprise me.", "{result}. Points again. Steady. I'm building you a spreadsheet. Don't ask."],
    opts: [
      { tone: 'cold', t: "Don't make me a spreadsheet.", r: "Too late. It has graphs." },
      { tone: 'passive', t: "Steady's good.", r: "Steady is the floor. I want the ceiling." },
      { tone: 'flirty', t: "Show me the spreadsheet.", r: "In person. It's very detailed. You'll be flattered. Or frightened." },
    ],
  },
  {
    id: 'dominant-text-points-any-2-flirty', on: 'points', stage: 'any', slot: 2, mood: 'flirty',
    say: ["Points again. You make mid-table look glamorous. I keep watching.", "{result}. Glamorous, somehow. You keep scoring and I keep watching. One of us should stop. Not me."],
    opts: [
      { tone: 'cold', t: "Glamorous. Right.", r: "Very. Don't argue with me." },
      { tone: 'passive', t: "Ha. Thank you.", r: "You're welcome. Now go higher." },
      { tone: 'flirty', t: "Never stop watching.", r: "Never planned to." },
    ],
  },
  {
    id: 'dominant-text-points-any-3-cold', on: 'points', stage: 'any', slot: 3, mood: 'cold',
    say: ["Points. Again. Steady as anything. I'd like a habit of you answering me warmly too.", "{result}. Steady. You've made points a habit. You've made distance a habit too. I'd like one of those changed."],
    opts: [
      { tone: 'cold', t: "Change it yourself.", r: "I can't. It's yours. I'll wait.", opts: [
        { tone: 'cold', t: "Keep waiting.", r: "I will. I'm patient. Not endlessly. But very." },
        { tone: 'passive', t: "Okay. I'll try.", r: "Good. That's all I'm asking." },
        { tone: 'flirty', t: "I'll change it. Dinner?", r: "Dinner. Good. That's the right change." },
      ] },
      { tone: 'passive', t: "Sorry. I've been heads-down.", r: "I know. Pop up for air. With me.", opts: [
        { tone: 'cold', t: "Not yet.", r: "Fine. When you're ready. Well driven." },
        { tone: 'passive', t: "Okay. Air.", r: "Good. Breathe. Eat. Text me." },
        { tone: 'flirty', t: "Air sounds like dinner.", r: "It is dinner. I'm booking." },
      ] },
      { tone: 'flirty', t: "Points and warmth. Coming up.", r: "...Good. I'll take both.", opts: [
        { tone: 'cold', t: "Maybe just the points.", r: "Fine. Just the points. For now." },
        { tone: 'passive', t: "Here's the warmth: thank you.", r: "Received. Warmly." },
        { tone: 'flirty', t: "Warm enough?", r: "Getting there. Keep going." },
      ] },
    ],
  },
  {
    id: 'dominant-text-points-any-3-passive', on: 'points', stage: 'any', slot: 3, mood: 'passive',
    say: ["Points. Again. That's three. A good habit. I'm greedy, though. Let's make a better one.", "{result}. That's three points finishes. Steady. I'm proud. I'm also greedy. More."],
    opts: [
      { tone: 'cold', t: "Greedy?", r: "For you. Always. Don't complain.", opts: [
        { tone: 'cold', t: "Don't be greedy.", r: "Fine. Proud only. For now." },
        { tone: 'passive', t: "Okay. More.", r: "Good. That's the spirit." },
        { tone: 'flirty', t: "Greedy suits you.", r: "Most things do. Thank you." },
      ] },
      { tone: 'passive', t: "Thanks. It's adding up.", r: "It is. I've been adding it. Literally. I keep a tally.", opts: [
        { tone: 'cold', t: "Don't keep a tally on me.", r: "Fine. Tally deleted. I'll just remember it. I remember everything." },
        { tone: 'passive', t: "What does it say?", r: "That you're climbing. Slowly. Surely." },
        { tone: 'flirty', t: "Keep tallying.", r: "I will. Points, laps, smiles. All logged." },
      ] },
      { tone: 'flirty', t: "I'll be greedy with you.", r: "Good. Then we're both greedy. A dangerous pair.", opts: [
        { tone: 'cold', t: "Within reason.", r: "Within reason. Mine or yours? Fine. Yours." },
        { tone: 'passive', t: "Deal. More points.", r: "Deal. Well driven." },
        { tone: 'flirty', t: "Starting with dinner.", r: "Starting with dinner. I'll book." },
      ] },
    ],
  },
  {
    id: 'dominant-text-points-any-3-flirty', on: 'points', stage: 'any', slot: 3, mood: 'flirty',
    say: ["Points again. You make it look easy. It isn't. I look forward to your Sundays now.", "{result}. Points. Again. Not easy, I know. I've stopped worrying about your Sundays. I look forward to them."],
    opts: [
      { tone: 'cold', t: "It's not easy.", r: "I said that. Agreeing with me is allowed.", opts: [
        { tone: 'cold', t: "Fine. Agreed.", r: "Good. Well done." },
        { tone: 'passive', t: "You're right.", r: "I usually am. Rest." },
        { tone: 'flirty', t: "I like agreeing with you.", r: "Me too. Do it more." },
      ] },
      { tone: 'passive', t: "Thank you. That's nice.", r: "It's true. Nice and true. Rare combination.", opts: [
        { tone: 'cold', t: "It's just points.", r: "Points are never just points. Rest." },
        { tone: 'passive', t: "I'll keep working.", r: "Good. I'll keep watching." },
        { tone: 'flirty', t: "I look forward to your texts.", r: "...Good. I'll keep sending them." },
      ] },
      { tone: 'flirty', t: "Look forward to more than Sundays.", r: "I already do. Mondays are for you too.", opts: [
        { tone: 'cold', t: "Let's keep it to Sundays.", r: "Sundays, then. For now." },
        { tone: 'passive', t: "Mondays sound good.", r: "Mondays it is. And Tuesdays." },
        { tone: 'flirty', t: "Every day.", r: "Every day. That's a lot of texts. I'm prepared." },
      ] },
    ],
  },
  {
    id: 'dominant-text-bad-any-1-cold', on: 'bad', stage: 'any', slot: 1, mood: 'cold',
    say: ["{result}. Outside the points. You've been cold with me, but I'm still here. That's how I work.", "Bad day at {last}. I won't say 'unlucky'. I'll say: eat something, sleep, and come back angrier."],
    opts: [
      { tone: 'cold', t: "Can we not talk about it?", r: "Then don't. I'll be here when you do.", opts: [
        { tone: 'cold', t: "Seriously. Leave it.", r: "Left. Eat something, at least." },
        { tone: 'passive', t: "Okay. It was rough.", r: "I know. I watched. It wasn't your fault. Most of it." },
        { tone: 'flirty', t: "Distract me instead.", r: "Gladly. Dinner. Thursday. No racing talk." },
      ] },
      { tone: 'passive', t: "Thanks. It was a bad one.", r: "It was. It happens. It won't happen at {track}. I've decided.", opts: [
        { tone: 'cold', t: "You can't decide that.", r: "I can decide what I believe. I believe in you." },
        { tone: 'passive', t: "I hope you're right.", r: "I'm always right. Sleep." },
        { tone: 'flirty', t: "If you've decided, it's done.", r: "Exactly. Now do your part." },
      ] },
      { tone: 'flirty', t: "I needed that.", r: "Good. I'm here. I'm always here after the bad ones.", opts: [
        { tone: 'cold', t: "Don't make it soft.", r: "Fine. Hard version: you were slow. Fix it. ...Better?" },
        { tone: 'passive', t: "Means a lot, honestly.", r: "Good. Then eat something. That's the order." },
        { tone: 'flirty', t: "Come cheer me up.", r: "I'll come. Tomorrow. I'll bring food. You'll eat it." },
      ] },
    ],
  },
  {
    id: 'dominant-text-bad-any-1-passive', on: 'bad', stage: 'any', slot: 1, mood: 'passive',
    say: ["{result}. Not your day. Eat something. Sleep. Then we'll talk about turn one.", "Bad race. It happens. It doesn't happen twice. Eat. Sleep. Tomorrow I want you angry, not sad."],
    opts: [
      { tone: 'cold', t: "I'm fine.", r: "You're not. But fine. Eat anyway.", opts: [
        { tone: 'cold', t: "Really. I'm fine.", r: "Fine. I'll take your word. I'll check again tomorrow." },
        { tone: 'passive', t: "Okay, I'm not fine.", r: "I know. Talk to me. Or don't. I'm here either way." },
        { tone: 'flirty', t: "I'm fine now you've texted.", r: "Good. That's the idea." },
      ] },
      { tone: 'passive', t: "It was awful.", r: "It was. I watched. You were better than the result. Remember that.", opts: [
        { tone: 'cold', t: "The result's what counts.", r: "Results count. You count more. To me." },
        { tone: 'passive', t: "Thanks for watching anyway.", r: "Always. Good races and bad. I don't pick." },
        { tone: 'flirty', t: "Say something nice.", r: "You. Something good: you. Now sleep." },
      ] },
      { tone: 'flirty', t: "I knew you'd text.", r: "Of course I did. I always do after the bad ones.", opts: [
        { tone: 'cold', t: "Leave me be tonight.", r: "Then be alone. I'll be quiet. Text if you want." },
        { tone: 'passive', t: "That's kind of you.", r: "You're welcome. Now: food." },
        { tone: 'flirty', t: "Text me after the good ones too.", r: "I will. I'll text you after all of them." },
      ] },
    ],
  },
  {
    id: 'dominant-text-bad-any-1-flirty', on: 'bad', stage: 'any', slot: 1, mood: 'flirty',
    say: ["{result}. Not the day you wanted. You still looked good doing it. Don't sulk. Sulk with me.", "Bad race. Don't sulk. Sulk with me instead. Much better company."],
    opts: [
      { tone: 'cold', t: "Not in the mood.", r: "I know. Fine. I'll leave it. Eat something.", opts: [
        { tone: 'cold', t: "Really not.", r: "Understood. Good night." },
        { tone: 'passive', t: "Sulking a bit, yes.", r: "A little. I'll take it. Tell me about it." },
        { tone: 'flirty', t: "Cheer me up, then.", r: "Dinner. Tomorrow. I'll make you laugh by dessert." },
      ] },
      { tone: 'passive', t: "That helped. Honestly.", r: "I know. I always know.", opts: [
        { tone: 'cold', t: "Don't overdo it.", r: "Fine. Underdone. You were fine. Sleep." },
        { tone: 'passive', t: "You're good at the bad days.", r: "I'm good at most things. You're my favourite thing to be good at." },
        { tone: 'flirty', t: "What would I do without you?", r: "Sulk alone. Much worse." },
      ] },
      { tone: 'flirty', t: "Sulk with you? Deal.", r: "Good. Bring snacks. Actually, I'll bring snacks. You'll forget.", opts: [
        { tone: 'cold', t: "Maybe not.", r: "Fine. Sulk alone. I'll be here after." },
        { tone: 'passive', t: "Tomorrow? I'm wiped.", r: "Tomorrow. I'll come to you." },
        { tone: 'flirty', t: "Tonight.", r: "Tonight. Leaving now. With snacks." },
      ] },
    ],
  },
  {
    id: 'dominant-text-bad-any-2-cold', on: 'bad', stage: 'any', slot: 2, mood: 'cold',
    say: ["Another bad one. Cold with me or not, I'm on your side. Eat something.", "{result}. Twice now. Shake it off. I'm not going anywhere, even if you're cold."],
    opts: [
      { tone: 'cold', t: "Don't bother.", r: "Fine. I won't. I'll just be here." },
      { tone: 'passive', t: "Thanks. It's been a rough run.", r: "I know. Rough runs end. I'll be there when this one does." },
      { tone: 'flirty', t: "You always say the right thing.", r: "I always say the true thing. Sometimes they're the same." },
    ],
  },
  {
    id: 'dominant-text-bad-any-2-passive', on: 'bad', stage: 'any', slot: 2, mood: 'passive',
    say: ["Two bad ones. It's a run, not a rule. Eat. Sleep. Train. Win.", "{result}. Again. Don't spiral. That's an order. Talk to me instead."],
    opts: [
      { tone: 'cold', t: "Easy for you to say, though.", r: "It is. I'm not in the car. But I'm right. Eat." },
      { tone: 'passive', t: "Thanks. I needed to hear that.", r: "I know. That's why I said it." },
      { tone: 'flirty', t: "Talk to me, then.", r: "I am. You're brilliant. This is a blip. Eat something." },
    ],
  },
  {
    id: 'dominant-text-bad-any-2-flirty', on: 'bad', stage: 'any', slot: 2, mood: 'flirty',
    say: ["Bad race. You're still the best thing on my screen. Don't argue.", "{result}. Not great. I still had a lovely afternoon. You were in it."],
    opts: [
      { tone: 'cold', t: "Don't make me feel better.", r: "Too late. I already have. Eat." },
      { tone: 'passive', t: "Thanks. That helps.", r: "Good. I'm very helpful." },
      { tone: 'flirty', t: "Make me feel better in person.", r: "I will. Name the night." },
    ],
  },
  {
    id: 'dominant-text-bad-any-3-cold', on: 'bad', stage: 'any', slot: 3, mood: 'cold',
    say: ["Third bad race. That's a pattern. Break it. And stop shutting me out while you're at it.", "{result}. Again. I know you're cold with me. I don't care. Eat. Sleep. Come back."],
    opts: [
      { tone: 'cold', t: "Leave me alone.", r: "...All right. I'll leave you alone. For tonight. I'm still here." },
      { tone: 'passive', t: "Sorry. Thanks for not giving up.", r: "I don't give up. On races, or people. Especially you." },
      { tone: 'flirty', t: "Don't stop texting me.", r: "I won't. I never stop. Ask anyone." },
    ],
  },
  {
    id: 'dominant-text-bad-any-3-passive', on: 'bad', stage: 'any', slot: 3, mood: 'passive',
    say: ["Three bad ones in a row. Enough. Break the run at {track}. I'll be watching.", "{result}. Again. Rough patch. Patches end. I'll be here for the end of this one."],
    opts: [
      { tone: 'cold', t: "I don't need a pep talk.", r: "It's not a pep talk. It's a fact. Eat." },
      { tone: 'passive', t: "Thanks. I'll break it.", r: "Good. I believe you. I believe in you more." },
      { tone: 'flirty', t: "You're my favourite pep talk.", r: "I'm your favourite everything. Eat. Sleep." },
    ],
  },
  {
    id: 'dominant-text-bad-any-3-flirty', on: 'bad', stage: 'any', slot: 3, mood: 'flirty',
    say: ["Bad race. Again. You're still my favourite. Don't make a habit of the bad races. Do make a habit of me.", "{result}. Again. Break that habit. Make a habit of me instead. Then come here and be smug."],
    opts: [
      { tone: 'cold', t: "Not right now.", r: "Fine. Later. I'm patient." },
      { tone: 'passive', t: "I'll break it. Promise.", r: "Good. Then smugness. Then me." },
      { tone: 'flirty', t: "I'll make a habit of you.", r: "Good. That's the one habit I approve of." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-1-cold', on: 'dnf', stage: 'any', slot: 1, mood: 'cold',
    say: ["You're out. Tell me you're fine. I don't care how cold you've been. Tell me.", "I saw. Out at {last}. Text me one word. 'Fine.' That's all. Then you can go back to ignoring me."],
    opts: [
      { tone: 'cold', t: "Fine.", r: "...Good. That word's all I wanted. Thank you.", opts: [
        { tone: 'cold', t: "One word. As ordered.", r: "That's enough. That's everything. Sleep." },
        { tone: 'passive', t: "Fine. Really. The car's a mess, I'm okay.", r: "Good. Cars get fixed. You get looked after." },
        { tone: 'flirty', t: "Fine. Better now you've texted.", r: "...Good. I'm going to breathe again now." },
      ] },
      { tone: 'passive', t: "I'm fine. Just gutted.", r: "Gutted I can handle. Fine I needed. Thank you.", opts: [
        { tone: 'cold', t: "No fussing, please.", r: "I'm not fussing. I'm checking. Checked. Good night." },
        { tone: 'passive', t: "The car's done for.", r: "The car is replaceable. You aren't. Eat something. Sleep." },
        { tone: 'flirty', t: "Thanks for checking.", r: "Always. Every time. You'll get bored of it. I won't." },
      ] },
      { tone: 'flirty', t: "I'm fine. Were you worried?", r: "Terrified. For about four seconds. Then you climbed out. Then I could breathe.", opts: [
        { tone: 'cold', t: "You're overreacting.", r: "I'm not. I was scared. Fine. I'm calm now. Good night." },
        { tone: 'passive', t: "I'm sorry I scared you.", r: "Don't be sorry. Be fine. You are. That's enough." },
        { tone: 'flirty', t: "Come and check in person.", r: "I will. Tomorrow. First thing." },
      ] },
    ],
  },
  {
    id: 'dominant-text-dnf-any-1-passive', on: 'dnf', stage: 'any', slot: 1, mood: 'passive',
    say: ["I saw. Say you're fine. Twice, please.", "Out of the race. I saw the replay. Text me. Now. Just so I know."],
    opts: [
      { tone: 'cold', t: "I'm fine. Leave it.", r: "Good. Fine is all I needed. Left.", opts: [
        { tone: 'cold', t: "Really. Leave it.", r: "Left. Completely. Good night." },
        { tone: 'passive', t: "I'm fine. Sorry. Just frustrated.", r: "Frustrated is fine. Frustrated I can work with." },
        { tone: 'flirty', t: "I'm fine. I like that you asked.", r: "I'll always ask. Every time." },
      ] },
      { tone: 'passive', t: "I'm okay. Car's not.", r: "Good. Cars are metal. You're not. Eat. Sleep.", opts: [
        { tone: 'cold', t: "Can't face food.", r: "Eat anyway. That one's non-negotiable. Everything else, your call." },
        { tone: 'passive', t: "Thanks. I'll rest.", r: "Good. I'll check in tomorrow." },
        { tone: 'flirty', t: "Tell me you were worried.", r: "I was worried. For a moment. Then I wasn't. Happy?" },
      ] },
      { tone: 'flirty', t: "I'm fine. Promise.", r: "Promise accepted. I'm breathing again.", opts: [
        { tone: 'cold', t: "Don't overreact.", r: "I didn't. I texted. That's me underreacting." },
        { tone: 'passive', t: "Really fine.", r: "Good. Now rest." },
        { tone: 'flirty', t: "I'll be better when I see you.", r: "Then I'll come. Tomorrow. I'll bring food." },
      ] },
    ],
  },
  {
    id: 'dominant-text-dnf-any-1-flirty', on: 'dnf', stage: 'any', slot: 1, mood: 'flirty',
    say: ["I saw. Confirm you're fine. My heart needs it. I'm not cool about this.", "Out at {last}. My heart stopped for a second. Restarted when you climbed out. Text me."],
    opts: [
      { tone: 'cold', t: "I'm fine. Don't fuss.", r: "Not fussing. Relieved. Different.", opts: [
        { tone: 'cold', t: "Still, don't fuss.", r: "Fine. No fuss. Relieved quietly." },
        { tone: 'passive', t: "Okay, fuss a little.", r: "A little. I'll come round tomorrow and fuss properly." },
        { tone: 'flirty', t: "I like it when you fuss.", r: "I know. I'll fuss more. Tomorrow." },
      ] },
      { tone: 'passive', t: "I'm okay. Gutted, though.", r: "Gutted is allowed. Okay is required. Good.", opts: [
        { tone: 'cold', t: "I don't want to talk about the race.", r: "Then don't. Just eat. I'll be here." },
        { tone: 'passive', t: "Thanks for checking on me.", r: "Always. I watch every lap. Even the last one." },
        { tone: 'flirty', t: "I'm better for hearing from you.", r: "Good. That's the point of me." },
      ] },
      { tone: 'flirty', t: "My heart's fine too, now.", r: "Good. Then we're both fine. Rest.", opts: [
        { tone: 'cold', t: "Don't be soppy.", r: "I'm never soppy. I was briefly. Over now." },
        { tone: 'passive', t: "You're sweet.", r: "Don't tell anyone. Rest." },
        { tone: 'flirty', t: "Restart it in person.", r: "Tomorrow. I'll check you're fine myself. Thoroughly." },
      ] },
    ],
  },
  {
    id: 'dominant-text-dnf-any-2-cold', on: 'dnf', stage: 'any', slot: 2, mood: 'cold',
    say: ["Out again. Cold shoulder or not, I need a 'fine' from you. Now.", "Another DNF. I saw. One word. Fine?"],
    opts: [
      { tone: 'cold', t: "Fine. Again.", r: "Good. Again. That's all I need." },
      { tone: 'passive', t: "I'm okay. Bad luck.", r: "Bad luck ends. Okay is what I needed. Thank you." },
      { tone: 'flirty', t: "Fine. Missed you watching.", r: "I was watching. I'm always watching. Rest." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-2-passive', on: 'dnf', stage: 'any', slot: 2, mood: 'passive',
    say: ["Out again. Text me 'fine'. I'm getting worse at waiting for that one.", "Second DNF. You're fine, I assume. Confirm it. Then eat."],
    opts: [
      { tone: 'cold', t: "Fine. Confirmed.", r: "Good. Eat." },
      { tone: 'passive', t: "I'm fine. Frustrated.", r: "Be frustrated. Then be fine. Then win." },
      { tone: 'flirty', t: "Fine. Thanks for always asking.", r: "Always. Every time. It's not a choice." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-2-flirty', on: 'dnf', stage: 'any', slot: 2, mood: 'flirty',
    say: ["Out again. You're making my heart do things I don't approve of. Fine? Yes or yes.", "Another one. My heart would like you to stop doing that. Fine?"],
    opts: [
      { tone: 'cold', t: "Fine. Calm down.", r: "I'm calm. I'm extremely calm. Rest." },
      { tone: 'passive', t: "Fine. Sorry for the scare.", r: "Don't be sorry. Be careful." },
      { tone: 'flirty', t: "Fine. Your heart's safe.", r: "Good. It's in your hands. Literally." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-3-cold', on: 'dnf', stage: 'any', slot: 3, mood: 'cold',
    say: ["Three DNFs. I hate this pattern. Stop it. And say you're fine.", "Again. Out. I've been patient with your coldness. I'm not patient with this. Text me."],
    opts: [
      { tone: 'cold', t: "I'm alright.", r: "Good. That's the only text I wanted." },
      { tone: 'passive', t: "I'm okay. I'm sorry.", r: "Don't apologise. Just keep being okay." },
      { tone: 'flirty', t: "I'm fine. Thanks for caring.", r: "I always care. Even when you're cold. Especially then." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-3-passive', on: 'dnf', stage: 'any', slot: 3, mood: 'passive',
    say: ["Third DNF. This habit I don't like. One word, please: fine?", "Out again. That's three. You're fine - I know - but text me anyway. I need it."],
    opts: [
      { tone: 'cold', t: "I'm fine. Stop worrying.", r: "I don't worry. I check. Checked." },
      { tone: 'passive', t: "I'm okay. It's been a bad run.", r: "It has. It ends. You'll be fine. I'll be here." },
      { tone: 'flirty', t: "I'm fine. I'll text you every time.", r: "Every time. Good. That's a promise I'm keeping you to." },
    ],
  },
  {
    id: 'dominant-text-dnf-any-3-flirty', on: 'dnf', stage: 'any', slot: 3, mood: 'flirty',
    say: ["Three DNFs. My nerves can't take it. Reassure me. Then come and look after my nerves.", "Out. Again. You're fine, I'm sure. My nerves aren't. Come here and fix them."],
    opts: [
      { tone: 'cold', t: "I'm fine. Your nerves will survive.", r: "They will. Barely. Rest." },
      { tone: 'passive', t: "Fine. I'll come look after you.", r: "Good. Tomorrow. I'll cook. You'll rest." },
      { tone: 'flirty', t: "I'll fix your nerves in person.", r: "Tomorrow. Bring yourself. That's the cure." },
    ],
  },
];
