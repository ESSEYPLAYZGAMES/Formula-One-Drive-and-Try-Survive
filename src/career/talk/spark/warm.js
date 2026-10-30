// The Spark - in person, stage 'warm' (flirting, banter, wanting more, plans and schemes). Plain data, no imports.
export const DATA = [
  // ---- cold: you were cold last time - stung, sulky, sassy; the fun has to be earned back ----------------------------
  {
    id: 'spark-warm-cold-1', stage: 'warm', mood: 'cold',
    say: "Oh, hello. Remember me? I sent you a video of me dancing in a lift. Strangers joined in! And you left it on read.",
    opts: [
      { tone: 'cold', t: "I was busy.", r: "Busy. Everyone's busy! I'm busy, and I still send lift dances. ...It hurt a bit, okay? There. Said it.", opts: [
        { tone: 'cold', t: "That's not my problem.", r: "Wow. Fine. No more videos for you. Not even the one with the goat. Enjoy the silence." },
        { tone: 'passive', t: "Sorry. That was rude of me.", r: "It was. And next time you reply with a video of your own. A good one. I'm very picky." },
        { tone: 'flirty', t: "Send it again. I'll reply with my own lift dance.", r: "Your own lift dance? On camera? You've just signed a contract. I'm holding you to it, Turbo." },
      ] },
      { tone: 'passive', t: "I was in the simulator all week. I'm sorry.", r: "You ignored me for a video game?! ...Okay, a very fancy work video game. Partly forgiven. Partly.", opts: [
        { tone: 'cold', t: "It's not a game. It's my job.", r: "I know! I was teasing. You don't have to be so serious about everything. Yikes. Noted." },
        { tone: 'passive', t: "What do I have to do for full forgiveness?", r: "Full forgiveness costs one evening. You, me, the arcade on the pier. I pick every game. You lose every game." },
        { tone: 'flirty', t: "I spun twice in it, thinking about you.", r: "Twice? Because of me? That's the most romantic spin I've ever heard of. Fully forgiven. Instantly." },
      ] },
      { tone: 'flirty', t: "I was saving my reply for in person.", r: "Oh, that's a good line. Annoyingly good. I'm still a bit cross, though. Make it worth the wait.", opts: [
        { tone: 'cold', t: "That was the reply.", r: "That was it? The big in-person reply? I've had better replies from my fridge. And it just hums." },
        { tone: 'passive', t: "Okay. Hello. I missed this.", r: "You missed this? Me talking at you at a hundred miles an hour? Weirdo. ...I missed it too. A bit." },
        { tone: 'flirty', t: "Here it is: that lift dance was the best thing on my phone all week.", r: "The best thing! The cross is fading. Rapidly. Damn you. One more nice thing and it's gone completely." },
      ] },
    ],
  },
  {
    id: 'spark-warm-cold-2', stage: 'warm', mood: 'cold',
    say: "Look who's decided I exist again. Last week it was all 'hmm', 'fine', 'whatever'. I've been sulking. Professionally.",
    opts: [
      { tone: 'cold', t: "Sulk all you like.", r: "Ouch. I was actually about to stop sulking. Now I'll do another week. Out of pure spite.", opts: [
        { tone: 'cold', t: "Take two weeks.", r: "Maybe I'll take a month! Maybe I'll come to your next race with a sign that just says 'meh'. Bye!" },
        { tone: 'passive', t: "Alright, I'm sorry. Bad week.", r: "Bad week. Hmm. You're allowed one. One! I'll downgrade the sulk to a pout. Pouts are temporary." },
        { tone: 'flirty', t: "You look good sulking, I'll admit.", r: "Don't! Don't make me smile mid-sulk, that's cheating. ...Ugh. It's effective. I hate that it's effective." },
      ] },
      { tone: 'passive', t: "Fair. I was in a mood. I'm sorry.", r: "You were! A little thundercloud in a team cap. Okay, apology accepted. Mostly. Ninety per cent.", opts: [
        { tone: 'cold', t: "Ninety? Forget it, then.", r: "Oh, now you're cross? You don't get to be cross, I'm the cross one! Fine. Two thunderclouds. Lovely." },
        { tone: 'passive', t: "What gets me to a hundred?", r: "Easy. One embarrassing story about yourself. A true one. Then we're even and I stop pouting." },
        { tone: 'flirty', t: "I'll make it up to you. Name your price.", r: "Name my price? Careful. My list is long and very silly. Number one involves a rowing boat and a costume." },
      ] },
      { tone: 'flirty', t: "Bad mood, sorry. You're the best cure I know.", r: "You can't sweet-talk me out of it that fast. ...Okay, maybe that fast. Keep going. Slowly.", opts: [
        { tone: 'cold', t: "Don't push it.", r: "Me? I've barely nudged it! Fine. Sulk mode back on. I'll be grumpy at you from over there." },
        { tone: 'passive', t: "Truce? I'll get the snacks.", r: "Truce, with snacks. Big snacks, not those sad little crisps. And no stealing any back." },
        { tone: 'flirty', t: "Honestly. You're the funniest person I know.", r: "Stop it. You're making me un-sulk in public. That's humiliating. ...Fine. Forgiven. Ugh." },
      ] },
    ],
  },
  {
    id: 'spark-warm-cold-3', stage: 'warm', mood: 'cold',
    say: "Hi. I'm still a bit annoyed. You called my karaoke idea 'childish'. It was a genius idea. You're childish.",
    opts: [
      { tone: 'cold', t: "It was childish.", r: "Oh, you're doubling down! Fine. I'm doing karaoke anyway, and I'm dedicating a sad song to you.", opts: [
        { tone: 'cold', t: "Have fun.", r: "I will! Loads! You'll hear me from across town and feel very left out. Goodbye, grump." },
        { tone: 'passive', t: "Okay. Maybe I was a bit harsh.", r: "A bit? You were frostbite. But okay. The offer stands. One duet. I'll even let you pick the song." },
        { tone: 'flirty', t: "Which sad song? I want to know what I'm worth.", r: "Something with a huge key change. Honestly, you're lucky I'm still singing about you at all." },
      ] },
      { tone: 'passive', t: "Fine. Maybe it was a good idea.", r: "Maybe! Maybe is progress! We'll make a fun person of you yet. Slowly. With huge patience.", opts: [
        { tone: 'cold', t: "Don't get your hopes up.", r: "Too late, they're up. Stuck to the ceiling. You can't get them down now. ...Grump." },
        { tone: 'passive', t: "So when is it?", r: "Thursday. Tiny place, terrible microphone, nobody cares how bad you are. It's perfect. You're coming." },
        { tone: 'flirty', t: "I'll come. But only if we duet.", r: "A duet?! You're full of surprises today. Yes. A thousand times yes. We're doing the cheesiest one there is." },
      ] },
      { tone: 'flirty', t: "I'm sorry. Sing me something and I'll make it up to you.", r: "Here? Now? I've got zero shame, so... no. Actually, no. You don't get a free concert after 'childish'.", opts: [
        { tone: 'cold', t: "Your loss, then.", r: "My loss? I'm the one with the voice! You're the one missing out. Big time. Go on, sulk. I'll be singing." },
        { tone: 'passive', t: "Fair. I'll earn it.", r: "Good. Earn it on Thursday. Front row, clapping, phone torch in the air. That's the price." },
        { tone: 'flirty', t: "What if I sing to you instead?", r: "You'd do that? In public? Now I'm completely disarmed. That's evil. And I'm holding you to it." },
      ] },
    ],
  },
  {
    id: 'spark-warm-cold-4', stage: 'warm', mood: 'cold', where: 'evening',
    say: "Oh. You actually came. After last time, I half expected you to send your engineer instead. With a note.",
    opts: [
      { tone: 'cold', t: "I nearly did.", r: "Wow. Cold open. Let me just sit with that. On this lovely rooftop. Which I picked. For us. Great.", opts: [
        { tone: 'cold', t: "Let's just get through dinner.", r: "'Get through it.' Like a dentist. Lovely. I'll order the loudest, messiest thing on the menu." },
        { tone: 'passive', t: "I'm here, aren't I? Let's start again.", r: "Start again? Fine. Hi, I'm {first}, I'm delightful, and you were mean to me. There. Your go." },
        { tone: 'flirty', t: "But I wanted to see you more than I wanted to sulk.", r: "Oh. That's annoyingly sweet. I'm still a bit hurt. Ask me to dance up here and I might forget." },
      ] },
      { tone: 'passive', t: "I'm sorry about last time. Really.", r: "Really really? Okay. I'm a hopeless grudge-holder. I always drop them. Usually on someone's foot.", opts: [
        { tone: 'cold', t: "Let's not make a big thing of it.", r: "No big thing. Small thing. Microscopic thing. ...You're impossible tonight, you know that?" },
        { tone: 'passive', t: "So what are we eating?", r: "Everything. I've already ordered half the menu. When I'm nervous, I order. You make me nervous." },
        { tone: 'flirty', t: "To say sorry, you pick the rest of tonight.", r: "My pick? You have no idea what you've unleashed. After dinner, we borrow the rooftop telescope." },
      ] },
      { tone: 'flirty', t: "Last time was dumb. You look amazing tonight.", r: "I know! I did it on purpose, to make you sorry. Is it working? It's working. Your face says it's working.", opts: [
        { tone: 'cold', t: "Don't get carried away.", r: "Warm, cold, warm! Make your mind up, racer. I'm not a tap. Fine. Frosty dinner it is." },
        { tone: 'passive', t: "It's working. Can we eat now?", r: "We can eat. But you're paying for dessert. Two desserts. It's an apology tax. I'm very strict." },
        { tone: 'flirty', t: "Working so well I can't read the menu.", r: "Ha! Okay, that one's good. I'm melting, and that's rude of you. I had a whole sulk planned for the starters." },
      ] },
    ],
  },

  // ---- passive: friendly baseline - schemes, dares and the odd daring line -----------------------------------------
  {
    id: 'spark-warm-passive-1', stage: 'warm', mood: 'passive',
    say: "Okay, I have a plan. It's a bad plan. Want to hear it? It involves a ferry, a disguise and absolutely no sleep.",
    opts: [
      { tone: 'cold', t: "Not especially.", r: "Not even the disguise bit? That stings. It's a really good fake moustache, you know. Hand-stuck.", opts: [
        { tone: 'cold', t: "Ask someone else.", r: "I might! They'll get the moustache and the ferry, and you'll get... a debrief. Enjoy." },
        { tone: 'passive', t: "Fine. Tell me the plan.", r: "Saturday, last ferry, full disguise, nobody knows us, chips on the deck at midnight. Genius, right?" },
        { tone: 'flirty', t: "I'd only come to see the moustache on you.", r: "It's a great look on me, honestly. Okay, you're back in the plan. Trial basis. Very probationary." },
      ] },
      { tone: 'passive', t: "Go on. How bad?", r: "Medium bad. Night ferry after your race, nobody recognises us, we watch the sunrise. Feels illegal. Isn't.", opts: [
        { tone: 'cold', t: "Sounds exhausting.", r: "That's the point, it's an adventure! Fine. Bed at nine for you. I'll send you a photo of the sunrise." },
        { tone: 'passive', t: "I'd have to check with the team.", r: "Yawn! The team. Fine, but tell them it's vital for your mental health. Doctor's orders. I'm not a doctor." },
        { tone: 'flirty', t: "Count me in. A sunrise with you sounds perfect.", r: "Yes! I'm already packing. Two disguises and a flask of hot chocolate. This is happening. It's happening!" },
      ] },
      { tone: 'flirty', t: "If you're in it, I'm in.", r: "Right answer. The only answer. I'll send you the plan. Warning: it's a voice note. It's long.", opts: [
        { tone: 'cold', t: "Text it. No voice notes.", r: "Text only?! Then you miss the sound effects. They're the best part. Your loss, frankly." },
        { tone: 'passive', t: "How long?", r: "Eleven minutes. There's a bit in the middle where I get distracted by a bird. You'll love that bit." },
        { tone: 'flirty', t: "I'll listen to the whole thing. Twice.", r: "Twice! You're in deep, racer. Careful, I'm very easy to get hooked on. Ask anyone who's tried to quit." },
        { tone: 'risque', m: 1, t: "Skip the plan. Just tell me where we're sleeping.", r: "Ha! Easy, tiger. You haven't even seen the moustache yet. ...I'll tell you on the ferry. Maybe." },
      ] },
    ],
  },
  {
    id: 'spark-warm-passive-2', stage: 'warm', mood: 'passive', where: 'evening',
    say: "Psst. The karting place shuts in ten minutes and the staff are on a break. I'm not saying we should. I'm saying we could.",
    opts: [
      { tone: 'cold', t: "I'm not getting banned from a kart track for you.", r: "For me! Ouch. As if I'm not worth one tiny ban. Fine. I'll just stand here being worth it.", opts: [
        { tone: 'cold', t: "Stand there all you like.", r: "Oh, I'll stand so well. Legendary standing. Enjoy your spotless record, goody-two-shoes." },
        { tone: 'passive', t: "We could just ask nicely?", r: "Ask nicely? Where's the adventure? ...Fine. Nicely. But I'm asking. I'm extremely persuasive." },
        { tone: 'flirty', t: "For you, I'd risk a small ban. A tiny one.", r: "A tiny ban! Swoon! Quick, before they're back. Take the blue one, it's the fastest." },
      ] },
      { tone: 'passive', t: "What happens if we get caught?", r: "We say you're doing research. Nobody tells off a famous racer. Probably. Come on, don't be sensible.", opts: [
        { tone: 'cold', t: "That's not how it works.", r: "It's exactly how it works, I've seen it! ...Fine. I'll stay law-abiding and bored. With you. Woohoo." },
        { tone: 'passive', t: "Five laps. Then we go.", r: "Deal! I'll lose all five, you'll be smug, it'll be wonderful. Helmets on!" },
        { tone: 'flirty', t: "If we're caught, I'll take the blame for you.", r: "You'd take the fall for me? Most romantic thing anyone's ever said to me near a kart. Hurry!" },
      ] },
      { tone: 'flirty', t: "Only if I get to chase you.", r: "Chase me? I love being chased. I'm very hard to catch, though. Slippery. Like soap on wheels.", opts: [
        { tone: 'cold', t: "On second thoughts, I'm tired.", r: "Tired?! You can't offer a chase and then yawn! That breaks every rule in one go. Impressive, honestly." },
        { tone: 'passive', t: "Just a few laps, then.", r: "A few laps, then chips by the river, your treat. Don't argue. Rules of the chase. I just made them." },
        { tone: 'flirty', t: "I'll catch you. I always do.", r: "Big talk! Catch me, then. If you do, you get a prize. Not telling you what it is. Go!" },
        { tone: 'risque', t: "And when I catch you, you're mine for the night.", r: "Oh! My heart just did a handbrake turn. Fine. But you have to actually catch me first. Ready, set—" },
      ] },
    ],
  },
  {
    id: 'spark-warm-passive-3', stage: 'warm', mood: 'passive',
    say: [
      "Truth or dare. Right now. Don't think, just pick. Thinking is the enemy of fun.",
      "New game! I say the words, you pick in under two seconds. Hesitating is a forfeit. Truth? Dare? Go!",
    ],
    opts: [
      { tone: 'cold', t: "Neither. I'm not twelve.", r: "Ouch! I'm a grown-up too, I just hide it well. Enjoy being sensible. Sounds awful. Truly awful.", opts: [
        { tone: 'cold', t: "Sensible suits me fine.", r: "Then you'll love my accountant. I'll give you their number. You can be sensible at each other." },
        { tone: 'passive', t: "Fine. Truth. Ask away.", r: "Okay! What's the most nervous you've ever been? 'Right now' is allowed. 'Right now' is encouraged." },
        { tone: 'flirty', t: "Fine. Dare. Make it a good one.", r: "Look at you! I dare you to hold my hand until somebody notices. Starting now. Don't let go." },
      ] },
      { tone: 'passive', t: "Truth.", r: "Boring! But fine. Most rebellious thing you've ever done? Speeding doesn't count. That's your job.", opts: [
        { tone: 'cold', t: "That's a private question.", r: "Private! In truth or dare! That's the entire game! You're the worst player I've ever met. Next!" },
        { tone: 'passive', t: "I skipped a team dinner once to watch a film.", r: "That's it? That's your wild side? Oh, I have so much work to do with you. So much work." },
        { tone: 'flirty', t: "Saying yes to spending time with you.", r: "Ha! Good answer. I'll allow it. I'm a terrible influence, you know. Ask my parents." },
      ] },
      { tone: 'flirty', t: "Dare. And make it something with you in it.", r: "With me in it? Bold. I dare you to tell me what you really thought when we first met. No lying.", opts: [
        { tone: 'cold', t: "That you were loud.", r: "Loud? That's it? Everyone knows I'm loud! That's not a secret, that's a weather report. Weak dare." },
        { tone: 'passive', t: "That you'd be trouble.", r: "Correct! Ten points. I am trouble. The fun kind, though. The kind people tell stories about." },
        { tone: 'flirty', t: "That I wanted to know you. Badly.", r: "Oh. I wasn't ready for honesty. That's not fair. Now I'm the one blushing. Don't look. Stop looking." },
        { tone: 'risque', t: "That I wanted to kiss you before you finished your first sentence.", r: "Before I finished? I talk a lot! That's a long wait! ...You're dangerous. Good. I like dangerous." },
      ] },
    ],
  },
  {
    id: 'spark-warm-passive-4', stage: 'warm', mood: 'passive', where: 'party',
    say: "Come with me, quick! The DJ booth's empty and I know exactly which song this party needs. Don't ask questions.",
    opts: [
      { tone: 'cold', t: "I'm not getting thrown out of a party.", r: "Thrown out? Nobody throws me out, they love me here. ...Fine. Solo mission. Be boring by the punch bowl.", opts: [
        { tone: 'cold', t: "Off you pop, then.", r: "Going! Watch me go. Gone. ...And I'm playing a song about grumpy people. Dedicated to you." },
        { tone: 'passive', t: "What song?", r: "Something terrible from when we were teenagers. It'll be chaos. Beautiful chaos. Come and see." },
        { tone: 'flirty', t: "I'll stay here and watch you shine.", r: "Watch me? Okay, that's better. Front row, eyes on me. Cheer when the bass drops. Really loudly." },
      ] },
      { tone: 'passive', t: "Which song?", r: "That's a question! I said no questions! It's the one with the clapping. You know it. Everyone knows it.", opts: [
        { tone: 'cold', t: "I hate that song.", r: "You hate the clapping song? Who hates the clapping song?! I'm reconsidering everything about you." },
        { tone: 'passive', t: "Fine. I'll keep lookout.", r: "A lookout! Perfect. If anyone comes, cough twice. If it's security, cough three times and dance." },
        { tone: 'flirty', t: "Play it, then come back and dance with me.", r: "Deal! I'll play it, sprint back, and we'll be dancing before anyone knows it was me. The perfect crime." },
      ] },
      { tone: 'flirty', t: "I'd follow you anywhere. Even into a DJ booth.", r: "You keep saying things like that and I keep believing you. Grab my hand. We're going in.", opts: [
        { tone: 'cold', t: "Actually, let's not. I'll wait here.", r: "You're bailing mid-heist? That's the worst kind of bailing. Fine. I'll be a lone outlaw. A legend." },
        { tone: 'passive', t: "Okay, okay. After you.", r: "After me! Mind the cables. And the bouncer. And the cake. Why is there a cake? Never mind. Go!" },
        { tone: 'flirty', t: "Then play something we can dance close to.", r: "Slow-song close? With the whole party watching? You're on. I'm picking the cheesiest one ever written." },
      ] },
    ],
  },

  // ---- flirty: you left it flirty - games escalate, and they match a bold line cheekily ----------------------------
  {
    id: 'spark-warm-flirty-1', stage: 'warm', mood: 'flirty', where: 'party',
    say: "You! Race you to the bar. Loser buys the next round and says something nice about the winner. On the mic.",
    opts: [
      { tone: 'cold', t: "I'm not running anywhere tonight.", r: "Not running?! That was ice down my back. What's wrong? Who upset you? Was it me? It was me, wasn't it.", opts: [
        { tone: 'cold', t: "Just leave it.", r: "Leaving it. Leaving you. Leaving the room, actually. Enjoy standing very, very still." },
        { tone: 'passive', t: "Long day. Sorry. Let's walk to the bar.", r: "Walk? Fine. A dignified walk. I'll still win. I walk very fast when there's a free drink at the end." },
        { tone: 'flirty', t: "Fine. But I'll still win.", r: "Oh, the smile's back! Ready? Go! ...I said go. Why are you still standing there looking at me?" },
      ] },
      { tone: 'passive', t: "And if I win?", r: "Then I say nice things about you on the mic. I'll have to make most of them up, but I'm very creative.", opts: [
        { tone: 'cold', t: "Don't bother.", r: "Fine. I'll save my nice things for someone who wants them. There's a queue, you know. A long one." },
        { tone: 'passive', t: "You're on. Three, two, one—", r: "Cheat! You went on one! Fine, I'm still faster. ...Wait for me! WAIT UP!" },
        { tone: 'flirty', t: "Say the nice things now. Practice run.", r: "Here? Now? Okay. You're fast. And annoying. And dangerously good-looking. Oops, that last one fell out." },
        { tone: 'risque', t: "Skip the bar. Let's find somewhere quieter.", r: "Quieter? Ooh, scandalous. I'm in. Grab my hand before somebody puts a mic in it." },
      ] },
      { tone: 'flirty', t: "And the loser has to do what, exactly?", r: "You want to lose? Interesting. Loser does whatever the winner says for one whole song. Anything.", opts: [
        { tone: 'cold', t: "Sounds like a trap.", r: "It's always a trap with me! But fine, run away. I'll find someone braver. There's plenty." },
        { tone: 'passive', t: "Alright. One song.", r: "One song. Go! ...Why are you walking? Racers don't walk! Run, you absolute tortoise!" },
        { tone: 'flirty', t: "Then I'm losing on purpose.", r: "On purpose? Shameless. Fine. I win, and you dance with me. The whole song. Very, very close." },
        { tone: 'risque', t: "And if I win, you're coming home with me.", r: "Big stakes! Right, I'm not running any more. I'm walking. Very slowly. Oh no. Look at that. You win." },
      ] },
    ],
  },
  {
    id: 'spark-warm-flirty-2', stage: 'warm', mood: 'flirty',
    say: "There's my favourite distraction. I'm meant to be working on {work} and instead I've been thinking about your face.",
    opts: [
      { tone: 'cold', t: "Sounds unprofessional.", r: "Unprofessional?! That's a frosty little reply to a compliment. It stung, actually. Just so you know.", opts: [
        { tone: 'cold', t: "Back to work, then.", r: "Fine! I'll be very professional. I'll think about other faces. Much better ones. Bye." },
        { tone: 'passive', t: "Sorry. Long morning. How's it going?", r: "Slowly. I'm fast, it's slow, it's a whole thing. But you're here, so the day's already looking up." },
        { tone: 'flirty', t: "Unprofessional suits you, though.", r: "Does it? You're back in my good books. Just. Do that again and you're at the top of the page." },
      ] },
      { tone: 'passive', t: "Good thinking or bad thinking?", r: "Both! Mostly good. Partly the kind where I steal your sunglasses and make you chase me for them.", opts: [
        { tone: 'cold', t: "Don't touch my sunglasses.", r: "Fine! Your precious sunglasses are safe. From me. Today. Grumpy." },
        { tone: 'passive', t: "Take them, then. I won't stop you.", r: "You're letting me? That ruins it! Stealing's only fun if someone chases you! Try again, with feeling." },
        { tone: 'flirty', t: "Steal them. I'll chase you down.", r: "You'd chase me? I'm so in. Count of three, then I'm gone. You'll never catch me. I'm a blur." },
        { tone: 'risque', t: "Keep thinking about it. Then come over and do something about it.", r: "Do something about it? That's a proper invitation. Careful, I accept invitations very, very quickly." },
      ] },
      { tone: 'flirty', t: "I've been thinking about yours too. A lot.", r: "How much is a lot? On a scale of one to 'nearly missed a braking point'?", opts: [
        { tone: 'cold', t: "Not that much, honestly.", r: "Ugh, you had me for a second! Mean! Fine. Back to work I go. Sad, unthought-about, alone." },
        { tone: 'passive', t: "Maybe a six.", r: "A six! That's practically a seven. A seven is practically a crush. I'm doing maths on you now." },
        { tone: 'flirty', t: "I definitely missed one in practice.", r: "You missed a braking point because of me?! Best thing anyone's ever said to me. I'm a puddle." },
        { tone: 'risque', t: "Enough that I'd rather show you than tell you.", r: "Show me? Here? You menace. Not here. Later, somewhere with no cameras. I'm holding you to it." },
      ] },
    ],
  },
  {
    id: 'spark-warm-flirty-3', stage: 'warm', mood: 'flirty', where: 'evening',
    say: "You came! I've found a door to the roof that definitely says 'staff only'. Want to see the best view in town?",
    opts: [
      { tone: 'cold', t: "I'd rather stay at the table.", r: "The table? With the bread and the candle? Way to stamp on a nice idea. Stamp, stamp.", opts: [
        { tone: 'cold', t: "Go up on your own.", r: "Fine, I'm going! I'll wave from up there. You'll see a tiny me having a much better evening than you." },
        { tone: 'passive', t: "After dessert, maybe.", r: "After dessert. Fine. I'll eat fast. Pit-stop fast. Then we're going up, no excuses." },
        { tone: 'flirty', t: "Unless you want to keep me company down here.", r: "Down here, with the candle? Hmm. That's a bit romantic, actually. Fine. You win this round." },
      ] },
      { tone: 'passive', t: "Will we get in trouble?", r: "Probably! That's half the fun. The other half is the view. Come on, I've propped the door with a breadstick.", opts: [
        { tone: 'cold', t: "Count me out.", r: "Out?! Fine. I'll go alone and make a new best friend up there. A pigeon. A nice one." },
        { tone: 'passive', t: "Okay. Five minutes.", r: "Five minutes is plenty. You can see the whole river. Bring your coat, it's windy and I'm always cold." },
        { tone: 'flirty', t: "With you, I'll risk it.", r: "That's the spirit! Hold my hand on the stairs, they're dark. Safety reasons. Mostly safety reasons." },
        { tone: 'risque', t: "Is it the kind of roof where nobody can see us?", r: "Oh! You've been thinking about this. Maybe it is. Maybe I checked. Come on, before I lose my nerve." },
      ] },
      { tone: 'flirty', t: "The best view in town is sitting right here.", r: "No. You didn't. That's the cheesiest line I've ever heard. It worked. Damn it. Come on, roof.", opts: [
        { tone: 'cold', t: "Actually, I'm comfy here.", r: "You can't flirt like that and stay seated! That's waving the flag and not starting the race." },
        { tone: 'passive', t: "Lead the way, then.", r: "Leading! Mind the step. And the bucket. And that very cross-looking cat. We're friends now, me and the cat." },
        { tone: 'flirty', t: "I'll follow you up. I'm not letting you out of my sight.", r: "Good. Keep your eyes on me. I'm the best thing up there. Me and the stars. It's a close tie." },
        { tone: 'risque', t: "Let's go up and not come down till morning.", r: "Till morning? On a roof? Bold. We'd need blankets. ...I have blankets. Don't ask why. Let's go." },
      ] },
    ],
  },
  {
    id: 'spark-warm-flirty-4', stage: 'warm', mood: 'flirty',
    say: "Oh good, it's you. I've been practising my wink. Watch. ...Was that a wink, or did I look like I was about to sneeze?",
    opts: [
      { tone: 'cold', t: "Sneeze.", r: "Ouch! Honest. Too honest. I'll go and wink at a mirror. Mirrors are nicer to me.", opts: [
        { tone: 'cold', t: "Good idea.", r: "Wow! Mirror it is. The mirror's going to love it. You had your chance and you blew it." },
        { tone: 'passive', t: "Okay, fine. Half a wink.", r: "Fifty per cent! Progress. I'll have the other half by Sunday. Watch out." },
        { tone: 'flirty', t: "A very cute sneeze, though.", r: "A cute sneeze! That's going in my diary. You've saved yourself. Barely. By an eyelash." },
      ] },
      { tone: 'passive', t: "Try again. I'll judge.", r: "Okay. Okay. ...Now. Was that better? Don't laugh! You're laughing! That's not judging!", opts: [
        { tone: 'cold', t: "Still bad. Give up.", r: "Give up? Me? Never. I'll practise all week and wink you into the ground. You'll see. Meanie." },
        { tone: 'passive', t: "Better. A solid seven.", r: "A seven! Next week, a nine. The week after, you won't stand a chance." },
        { tone: 'flirty', t: "Perfect. Do it again.", r: "You liked my wink! You did! Okay. ...There. That one's just for you, hotshot. Exclusive." },
        { tone: 'risque', t: "One more like that and I'm taking you home.", r: "One more? I'm winking so hard my whole face is involved. ...Any good? Tell me it's doing something." },
      ] },
      { tone: 'flirty', t: "It was a wink. And it worked.", r: "It worked? What did it do? Tell me exactly. I need data. For science.", opts: [
        { tone: 'cold', t: "Forget it.", r: "Forget it?! You can't say 'it worked' and walk away! That's the worst thing you've ever done to me." },
        { tone: 'passive', t: "It made me smile.", r: "A smile! Step one. Step two is a blush. Step three is classified. Very classified." },
        { tone: 'flirty', t: "It made me want to get closer.", r: "Closer? Like this? ...Okay, I got closer and now I've forgotten every word I know. Help." },
        { tone: 'risque', t: "It made me want to kiss you. Right here.", r: "Right here? With an audience? You wouldn't dare. ...Would you? Oh, you would. Go on, then." },
      ] },
    ],
  },
];
