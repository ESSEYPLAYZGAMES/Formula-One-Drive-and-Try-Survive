// RUDE - in person, stage 'new': first impressions, mutual roasting. A dry comeback earns respect; passive bores them;
// flirting gets mocked (and quietly noticed). Slots: 1 the rating out of ten, 2 hate-watching your races, 3 your taste,
// 4 Biscuit the cat, 5 the joke tally, 6 honest for a living, 7 the saved seat, 8 'only I get to roast you', 9 tolerable.
export const DATA = [
  // ---- slot 1: they rate everyone out of ten -------------------------------------------------------------------------
  { id: 'rude-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: "You walked straight past me earlier. I rate everyone out of ten, and that got you a four. Highest score all day. Don't celebrate.",
    opts: [
      { tone: 'cold', t: "I wasn't trying to impress you.", r: "Which is exactly why it worked. Ugh. Fine. Holding at four. Say something stupid, I dare you.", opts: [
        { tone: 'cold', t: "You first. You've had practice.", r: "Ha. Okay. That's a five. I'm furious about it. Go away before it drops." },
        { tone: 'passive', t: "So what gets someone a ten?", r: "Nothing. Tens are a myth, like humble drivers. That question was beige. Three." },
        { tone: 'flirty', t: "I'll have you at a ten by the end of the season.", r: "You'll have me at a migraine. Nobody gets a ten. Stop grinning. Three." },
      ] },
      { tone: 'passive', t: "Sorry about that. I was in a hurry. Hi.", r: "An apology. Wow. Delivered like a sponsor statement. You're slipping to a three.", opts: [
        { tone: 'cold', t: "Keep your number. I'll live.", r: "Oh, there's a pulse. Back to four. Keep that energy, drop the apologies." },
        { tone: 'passive', t: "Fair enough. Nice to meet you, anyway.", r: "Is it? We'll see. 'Nice to meet you' is what people say to dentists. Three." },
        { tone: 'flirty', t: "Let me make it up to you. Coffee sometime?", r: "Coffee. On a first conversation. Did you get that from a film? Two. A very bad film." },
      ] },
      { tone: 'flirty', t: "I walked past because I didn't trust myself to stop.", r: "Oh no. A line. You've been here thirty seconds and you brought a line. Dropping fast.", opts: [
        { tone: 'cold', t: "Fine. Forget it. Wasn't for you anyway.", r: "Better. A dry exit beats a soggy line every time. Five. I hate that it's five." },
        { tone: 'passive', t: "Okay, that was a lot. Start again?", r: "No restarts. I've already formed opinions and they're stubborn. Holding at three." },
        { tone: 'flirty', t: "Admit it, you liked it a little.", r: "I liked it the way I like a pothole. Memorable. Four. Don't look so pleased with yourself." },
      ] },
    ] },
  { id: 'rude-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: ["Oh. A driver. Please don't talk about tyres. I rate every conversation out of ten and tyre talk is a two.", "So you're the driver. I rate everything out of ten, and tyre chat scores a two. Choose your topic like your life depends on it."],
    opts: [
      { tone: 'cold', t: "Relax. I wasn't going to waste tyre talk on you.", r: "Oh, it bites. Good. Biting is a five. Small talk is a two. Choose wisely.", opts: [
        { tone: 'cold', t: "I'll choose leaving.", r: "And it exits on a high. Five, then. Infuriating. Go on, shoo." },
        { tone: 'passive', t: "So what do you want to talk about?", r: "Not that. 'What do you want to talk about' is the beige of questions. Three." },
        { tone: 'flirty', t: "I'd rather hear what gets a ten from you.", r: "Nothing, ever. You'd need a miracle and better shoes. Four, for nerve." },
      ] },
      { tone: 'passive', t: "Fair. How's your day been?", r: "A two out of ten, and you've asked the dullest question available. Want to try again?", opts: [
        { tone: 'cold', t: "Not really. You're hard work.", r: "I am. Thank you for noticing. That honesty just got you a five." },
        { tone: 'passive', t: "What would make it a three?", r: "Silence. Or a sandwich. You're neither. Still hovering at two." },
        { tone: 'flirty', t: "Maybe meeting me is the highlight.", r: "Meeting you is the reason it isn't a three. I'm joking. Mostly. Fine, it's a three now." },
      ] },
      { tone: 'flirty', t: "Rate me now, then. I'm feeling lucky.", r: "Lucky is a word for people who can't brake. Fine. Four. Don't spend it all at once.", opts: [
        { tone: 'cold', t: "A four from you sounds like a compliment.", r: "It is, and I'm annoyed you worked that out. Five now. Goodbye." },
        { tone: 'passive', t: "Four's fine. I'll take it.", r: "You'll 'take it'. Wow. Settling already. Three. Ambition is attractive, you know." },
        { tone: 'flirty', t: "I'll get it up to a ten.", r: "Tens don't exist. Neither does your chance. Okay, your chance exists. It's tiny. Four." },
      ] },
    ] },
  { id: 'rude-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "You've been looking over here since you arrived. I rate people out of ten. Staring costs points. You're at a three.",
    opts: [
      { tone: 'cold', t: "I was looking past you.", r: "Liar. But a fast one. Five out of ten for the recovery. I'm keeping score, obviously.", opts: [
        { tone: 'cold', t: "Keep it. I'm not playing.", r: "Everyone's playing. You're just losing well. Five holds. Bye." },
        { tone: 'passive', t: "What do you actually score people on?", r: "Wit, shoes, how fast they bore me. You're bored-adjacent. Four." },
        { tone: 'flirty', t: "Fine, I was looking. Can you blame me?", r: "Yes. I can blame anyone for anything. It's a gift. Four, and stop doing that with your eyebrows." },
      ] },
      { tone: 'passive', t: "Sorry. I didn't mean to stare.", r: "You apologise like you overtake. Late and hesitant. Two out of ten. Want a do-over?", opts: [
        { tone: 'cold', t: "No. Two's honest. I'll keep it.", r: "Finally, someone who can take a number. Four for that. Don't tell anyone." },
        { tone: 'passive', t: "Okay. Hi. I'm {me}.", r: "I know. It's on every screen. Introducing yourself to me is a two. Stuck there." },
        { tone: 'flirty', t: "A do-over? So you want me to stay.", r: "I want you to try harder. Not the same thing. ...Slightly the same thing. Three." },
      ] },
      { tone: 'flirty', t: "Worth every point. You're the best thing here.", r: "The best thing here is the exit. You're a close second. Fine. That's a four. Calm down.", opts: [
        { tone: 'cold', t: "Close second. I'll take the exit, then.", r: "Oh, now you're interesting. Annoying, that. Five. Go before I take it back." },
        { tone: 'passive', t: "Okay, I'll tone it down.", r: "Too late, I've seen it. Tone it down and you're a three. Leave it up and you're tiring." },
        { tone: 'flirty', t: "Second best is a start. I'm aiming for first.", r: "First is the exit. You'd have to be a door. Four. You're bad at this. Stop beaming." },
      ] },
    ] },

  // ---- slot 2: they hate-watch your races ---------------------------------------------------------------------------
  { id: 'rude-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "Round two, is it? I hate-watched your last race, by the way. You brake like you're apologising to the corner.",
    opts: [
      { tone: 'cold', t: "Funny. You watched, though.", r: "Hate-watched. One involves popcorn, the other involves muttering. Yours was muttering.", opts: [
        { tone: 'cold', t: "You muttered about me for two hours. Flattering.", r: "Hm. Turning my own words on me. Rude. Correct, but rude. Fine, that one's yours." },
        { tone: 'passive', t: "What did you think of the result, honestly?", r: "Adequate. Like a sandwich from a petrol station. You asked. I've answered. Next." },
        { tone: 'flirty', t: "Admit it. You couldn't look away.", r: "I couldn't find the remote. Different thing. Stop smirking, you look like a screensaver." },
      ] },
      { tone: 'passive', t: "The brakes were cold. It happens.", r: "It happens to you specifically. Every race. I've started timing it. That's not interest. It's science.", opts: [
        { tone: 'cold', t: "Then stick to science. Leave the driving to me.", r: "Ooh. Someone found their voice. Keep it, it's better than your braking." },
        { tone: 'passive', t: "I'll work on it.", r: "'I'll work on it.' Wow. Riveting. Put it on a poster for the waiting room." },
        { tone: 'flirty', t: "You timed me? That's adorable.", r: "Adorable is a word for puppies and bad decisions. I'm neither. I'm thorough." },
      ] },
      { tone: 'flirty', t: "You can watch me brake any time.", r: "That's the saddest line I've heard all week, and I heard someone propose to a vending machine.", opts: [
        { tone: 'cold', t: "Then I'll save the good ones for someone who deserves them.", r: "Good. Go find them. I'll be here, not caring. Visibly. Not caring." },
        { tone: 'passive', t: "Okay, too much. How was the rest of it?", r: "The rest was a long procession of you being almost good. Almost is your brand." },
        { tone: 'flirty', t: "You're blushing. I saw it.", r: "It's warm. That's climate, not you. Nothing about you affects the climate. Go away." },
      ] },
    ] },
  { id: 'rude-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "I hate-watched your race. It's like regular watching but with more sighing. You did something at turn one. Explain yourself.",
    opts: [
      { tone: 'cold', t: "I overtook three cars. Sigh at that.", r: "Three cars who were clearly asleep. But fine. That was a decent comeback. I'll allow it.", opts: [
        { tone: 'cold', t: "Allow it? I didn't ask permission.", r: "No, you didn't. Disgusting. I respect it. Get out of my sight, I'm thinking." },
        { tone: 'passive', t: "So you watch all my races?", r: "Hate-watch. Every one so far, purely to complain. It's a hobby. Like knitting, but sneering." },
        { tone: 'flirty', t: "You watched me that closely? I'm flattered.", r: "Don't be. I watch traffic cameras closely too. You're slightly less gripping than a roundabout." },
      ] },
      { tone: 'passive', t: "Turn one is always chaos. I just survived it.", r: "'Survived it.' Wow. Inspirational. Put it on a mug. Nobody will buy the mug.", opts: [
        { tone: 'cold', t: "You'd buy two. One to hate-drink your tea from.", r: "...Okay. That's good. I'd buy two. I hate that I'd buy two." },
        { tone: 'passive', t: "What would you have done?", r: "Braked later, stayed outside, stopped looking scared. Free coaching. You're welcome." },
        { tone: 'flirty', t: "You'd buy my mug though. Admit it.", r: "I'd buy it to hold pens I hate. Stop looking at me like that, it's unsettling." },
      ] },
      { tone: 'flirty', t: "You sighed at me? I'd have liked to hear that.", r: "You'd have liked to hear me sigh? That's either a line or a cry for help. Wow.", opts: [
        { tone: 'cold', t: "Both. Take your pick.", r: "Ha. Okay, that landed. You're a better talker than a driver. Low bar, but you cleared it." },
        { tone: 'passive', t: "Sorry, that came out weird.", r: "Everything you say comes out weird. I'm told it's part of the charm. Nobody told me which part." },
        { tone: 'flirty', t: "Watch the next one with me. Sigh in person.", r: "In person? With you narrating? I'd rather hate-watch from a distance. A long one." },
      ] },
    ] },
  { id: 'rude-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "Don't look so hopeful. I hate-watched the whole thing. Yours. Hate-watched. Your overtake was fine. Fine is not a compliment.",
    opts: [
      { tone: 'cold', t: "Never hoping. I don't need your reviews.", r: "Everyone needs my reviews. Most people can't handle them. You're handling it. Annoyingly.", opts: [
        { tone: 'cold', t: "Then stop reviewing and go.", r: "Dismissing me? That's a new one. Fine. I'm going. Slowly, so you can watch. Kidding. Bye." },
        { tone: 'passive', t: "What would make it more than fine?", r: "Winning. Or not doing the little fist pump. The fist pump scores a two." },
        { tone: 'flirty', t: "I bet you can handle me too.", r: "I bet I can't be bothered. Stop doing the face. The face is a rating killer." },
      ] },
      { tone: 'passive', t: "Fine is fine. I'll take fine.", r: "You'll take fine. Wow. That's your ceiling? Fine? I'm embarrassed for your helmet.", opts: [
        { tone: 'cold', t: "Better than your ceiling, which is complaining.", r: "Ha. Okay. That's a proper hit. Keep that up and we might actually have a conversation." },
        { tone: 'passive', t: "So what would impress you?", r: "Nothing. That's the point. Asking costs a point. Try not asking. Try just doing it." },
        { tone: 'flirty', t: "'Fine' from you sounds like a love letter.", r: "It isn't. It's a receipt. Keep it for your records. Don't frame it. You'll frame it." },
      ] },
      { tone: 'flirty', t: "You watched it twice, didn't you?", r: "Once. And the highlights. And the replay. That's research. Wipe that look off your face.", opts: [
        { tone: 'cold', t: "Research. Sure. Keep telling yourself that.", r: "I will. I'm very convincing. More convincing than your braking. Bye." },
        { tone: 'passive', t: "What did you think of the restart?", r: "Messy. Like your hair. Both looked like they happened in a wind tunnel. Next question." },
        { tone: 'flirty', t: "Next time watch it with me. I'll do commentary.", r: "Your commentary would be you saying 'that was me' for two hours. Pass. Probably pass." },
      ] },
    ] },

  // ---- slot 3: your taste, their contrary opinions -----------------------------------------------------------------
  { id: 'rude-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "You. I saw your playlist in that interview. Who hurt you? Don't answer. I'll guess. A ballad, probably.",
    opts: [
      { tone: 'cold', t: "This from someone who's clearly never enjoyed anything.", r: "I enjoy plenty. Rain. Cold toast. Silence. Things you'd hate. That's how I know they're good.", opts: [
        { tone: 'cold', t: "Cold toast. Bold of you to judge my taste.", r: "Cold toast is correct and you'll come round. Your playlist won't. Off you go." },
        { tone: 'passive', t: "Okay. What should I be listening to?", r: "Anything nobody's heard of. If it's popular, it's wrong. That's science. Write it down." },
        { tone: 'flirty', t: "Teach me, then. Make me cultured.", r: "You'd need a semester. And a new personality. Stop batting your words at me." },
      ] },
      { tone: 'passive', t: "It's just music to drive to.", r: "That's what everyone says about their crimes. 'It's just music.' 'It's just a parking space.' Wow.", opts: [
        { tone: 'cold', t: "You've got opinions on everything, haven't you?", r: "Correct ones, yes. Somebody has to. Thank you for asking. Leave now, it's a peak." },
        { tone: 'passive', t: "What's on yours, then?", r: "Things you'd skip. Long, sad, foreign, no chorus. Don't put that on a T-shirt." },
        { tone: 'flirty', t: "Make me a better one, then.", r: "A mixtape? For you? What is this, a teen film? ...I'd make it good. I'm not making it. Shut up." },
      ] },
      { tone: 'flirty', t: "Maybe I need someone with better taste around.", r: "You need a lot of things. Taste is fourth. Brakes, a haircut, a filter. Then taste.", opts: [
        { tone: 'cold', t: "You're not exactly a catch yourself.", r: "I'm a catch. I'm just the kind that bites. Good one, though. Annoyingly good." },
        { tone: 'passive', t: "Okay, okay. A haircut. Noted.", r: "Don't 'noted' me. 'Noted' is for meetings. And it's a full rethink, not a trim." },
        { tone: 'flirty', t: "You've thought about my hair. Interesting.", r: "I've thought about it the way you think about a traffic jam. Reluctantly. Stop grinning." },
      ] },
    ] },
  { id: 'rude-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Tell me your opinion on sunsets. Careful. It decides whether I keep talking to you.",
    opts: [
      { tone: 'cold', t: "They're fine. Not everything needs a speech.", r: "'Fine'! Finally. Sunsets are overrated. Everyone claps at them like they did something. You pass.", opts: [
        { tone: 'cold', t: "I didn't know I was being tested.", r: "Everything's a test. You're just usually failing them. Not this one. Weirdly." },
        { tone: 'passive', t: "So what do you actually like?", r: "Rain. Cold toast. Films with no ending. Being right. Mostly being right." },
        { tone: 'flirty', t: "So I passed. What's my prize?", r: "The prize is I keep talking. Look at your face. You think that's a prize. Wow. It is." },
      ] },
      { tone: 'passive', t: "I love a good sunset, honestly.", r: "Of course you do. You probably clap. You probably post it with a little sun emoji. Wow.", opts: [
        { tone: 'cold', t: "And you probably hate puppies too.", r: "Puppies are fine. People who post puppies are suspicious. Good jab, though. You're improving." },
        { tone: 'passive', t: "What's wrong with sunsets?", r: "Nothing's wrong with them. Everyone loving them is what's wrong. I distrust a crowd." },
        { tone: 'flirty', t: "I'd watch one with you and not clap. Promise.", r: "You'd clap. I'd see your hands twitching. Stop it. That was nearly a nice thing to say." },
      ] },
      { tone: 'flirty', t: "Depends who I'm watching it with.", r: "Ugh. You turned sunsets into a line. Sunsets were bad enough already. Now they're worse.", opts: [
        { tone: 'cold', t: "Okay. Sunsets are boring. So is this.", r: "Ha! There it is. You can be honest. Keep doing that and I'll keep showing up." },
        { tone: 'passive', t: "Fine, sunsets are nice. That's my answer.", r: "'Nice.' Your vocabulary needs a pit stop. Possibly a full rebuild." },
        { tone: 'flirty', t: "You didn't say no, though.", r: "I didn't say anything. Silence is not a yes, it's a sigh with manners. Hm." },
      ] },
    ] },
  { id: 'rude-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "It's the flirt again. Before you start: your fist pump. The one you do even for tenth. Defend it.",
    opts: [
      { tone: 'cold', t: "I don't defend things to people who sit and watch.", r: "Oof. That's mean. I liked it. Keep the fist pump. Lose the attitude. Actually, keep the attitude.", opts: [
        { tone: 'cold', t: "Keep your notes. I'll keep the pump.", r: "Fine. We're at an impasse. I love an impasse. It's an argument that never has to end." },
        { tone: 'passive', t: "Do you not celebrate anything?", r: "I celebrate quietly. A nod. Maybe a slightly better sandwich. Fist pumps are for golfers." },
        { tone: 'flirty', t: "You've been watching my hands that closely?", r: "I've been watching your dignity leave the building. Your hands were just nearby." },
      ] },
      { tone: 'passive', t: "It's just a habit. I don't think about it.", r: "Clearly. Nothing about it suggests thought. It's like watching a seal applaud.", opts: [
        { tone: 'cold', t: "Seals are better company than you, so thanks.", r: "Ha. Probably true. Seals don't talk. Neither should you, ideally. That was good, though." },
        { tone: 'passive', t: "I'll try to stop, then.", r: "Don't stop because I said so. Stop because it's embarrassing. Same result, more dignity." },
        { tone: 'flirty', t: "I'll do it just for you next time.", r: "Do it for me and I'll leave. Do it to annoy me and... fine. I'll stay a bit. Nope. Leaving." },
      ] },
      { tone: 'flirty', t: "I do it for the fans. Are you a fan?", r: "I'm a critic. Critics are fans who got honest. Your fist pump is a two. You're a four.", opts: [
        { tone: 'cold', t: "Critics are people who couldn't do it themselves.", r: "Ouch. Okay. That's a classic for a reason. You've earned one point. Spend it wisely." },
        { tone: 'passive', t: "Fine, a two. What would make it better?", r: "Not doing it. That's the improvement. Doing nothing, with conviction. Like me." },
        { tone: 'flirty', t: "A four. So I'm beating the fist pump.", r: "Barely. The pump and you are in a tight battle. Like your qualifying. Stop looking smug." },
      ] },
    ] },

  // ---- slot 4: Biscuit, the cat who hates everyone -------------------------------------------------------------------
  { id: 'rude-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "You're a pain. You remind me of my cat, Biscuit. She hates everyone and bit a courier last week. It's a compliment.",
    opts: [
      { tone: 'cold', t: "Biscuit sounds like the only one in your house with taste.", r: "She is. That's why I live with her and not people. Good. You're learning how this works.", opts: [
        { tone: 'cold', t: "Tell Biscuit I said nothing at all.", r: "She'll appreciate it. Silence is her love language. Mine too. Practise it now." },
        { tone: 'passive', t: "What does Biscuit actually look like?", r: "Grey. Furious. Shaped like a loaf. She glares at the fridge for sport. I'm not showing you photos." },
        { tone: 'flirty', t: "Does Biscuit get jealous of your visitors?", r: "There are no visitors. Don't angle for an invite, it's tragic. She'd hiss. I'd let her." },
      ] },
      { tone: 'passive', t: "Biscuit. That's sweet. Why Biscuit?", r: "It's not sweet. It's dignified. She was found in a biscuit tin. Don't make the face. You're making the face.", opts: [
        { tone: 'cold', t: "Found in a tin. Explains the attitude.", r: "Hers or mine? Careful. ...Both, fine. That's a good line. I'm not telling her you said it." },
        { tone: 'passive', t: "Does she like anyone?", r: "Me. Sometimes. On a Thursday. She's selective. It's called standards. Look them up." },
        { tone: 'flirty', t: "I bet I could win her over.", r: "You couldn't win over a houseplant. Biscuit eats couriers. Stay humble, it suits you. Nothing else does." },
      ] },
      { tone: 'flirty', t: "I'm great with cats. And their owners.", r: "Wow. Did that line come with a free toaster? Biscuit would hiss at it. I'm hissing internally.", opts: [
        { tone: 'cold', t: "Fine. I'll keep my distance from both of you.", r: "Good instinct. We both respect distance. You're far less annoying from over there." },
        { tone: 'passive', t: "Okay. Tell me about her, then.", r: "She sleeps in the sink. Glares at birds. Ignores me unless food's involved. She's perfect." },
        { tone: 'flirty', t: "Keep hissing. It's cute.", r: "It's a warning, not a performance. You're bad at warnings. Noted. Stop smiling at me." },
      ] },
    ] },
  { id: 'rude-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "I have a cat called Biscuit. She hates everyone. Don't laugh at the name, it's dignified. She's dignified.",
    opts: [
      { tone: 'cold', t: "Biscuit. Really. And you mock my taste?", r: "Your taste is on trial. Biscuit's name was settled in court. She won. Good try, though.", opts: [
        { tone: 'cold', t: "Sounds like a rigged court.", r: "All courts are rigged when I'm presiding. Fine. You're funnier than your interviews. Not hard." },
        { tone: 'passive', t: "So how long have you had her?", r: "Four years. She's outlasted two sofas and everyone I've dated. Not a coincidence." },
        { tone: 'flirty', t: "I'd like to meet the judge sometime.", r: "The judge doesn't take visitors. Neither do I. Stop fishing, the pond's empty." },
      ] },
      { tone: 'passive', t: "I won't laugh. What's she like?", r: "Grey, round, appalling. She stares at walls like they owe her money. Best roommate I've ever had.", opts: [
        { tone: 'cold', t: "Sounds like you two share a hobby.", r: "Staring at things in contempt? Yes. It's a full-time job. You'd make a good wall." },
        { tone: 'passive', t: "Do you have photos?", r: "Thousands. You're not seeing a single one. You haven't earned Biscuit-level access." },
        { tone: 'flirty', t: "What do I have to do to earn the photos?", r: "Something impressive. Nothing so far. You could start by not asking. Stop with the eyes." },
      ] },
      { tone: 'flirty', t: "Does Biscuit hate everyone? Or will she like me?", r: "Everyone. She'll hate you specifically and slowly. That's not flirting back. Don't hear it as flirting.", opts: [
        { tone: 'cold', t: "Good. I don't need a cat's approval.", r: "Everyone needs Biscuit's approval. Nobody gets it. Your refusal is noted. With respect." },
        { tone: 'passive', t: "That's fair. Cats are picky.", r: "Cats aren't picky. They're correct. There's a difference. Learn it. Not today, though, I'm done." },
        { tone: 'flirty', t: "So you're a matching set. Both hard to impress.", r: "Matching set. Wow. Like salt and pepper. Like a crime and its alibi. Shut up. Fine." },
      ] },
    ] },
  { id: 'rude-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "Before you start flirting: my cat Biscuit hates everyone she meets. I'm telling you so you can lower your expectations.",
    opts: [
      { tone: 'cold', t: "Expectations already low. I've met you.", r: "Ha. Okay. Biscuit would approve of that one. She approves of nothing. Take it.", opts: [
        { tone: 'cold', t: "Tell her she can keep her approval.", r: "She will. She keeps everything. Fluff, grudges, the good chair. Go on." },
        { tone: 'passive', t: "What's Biscuit's deal anyway?", r: "Found in a biscuit tin. Never forgave the world. I get it. We get each other." },
        { tone: 'flirty', t: "I bet she'd like me. Everyone does eventually.", r: "'Everyone does eventually.' The confidence of a moth near a lamp. She'd ignore you. Beautifully." },
      ] },
      { tone: 'passive', t: "Okay, expectations lowered. What's she like?", r: "She's a grey menace who sleeps on my keys. Bit a courier. Got a medal from me.", opts: [
        { tone: 'cold', t: "Sounds like she inherited your manners.", r: "She came with them. I just reinforced them. Good one. You're a five today." },
        { tone: 'passive', t: "Does she ever sit on your lap?", r: "Once, in four years. It was raining and I was warm. She hasn't brought it up since. Neither have I." },
        { tone: 'flirty', t: "So you're soft for her. Noted.", r: "I'm not soft. I'm structurally compromised by one cat. Different thing. Stop noting things." },
      ] },
      { tone: 'flirty', t: "Lower than they already are? I'm still here.", r: "You are. Persistently. Like a stone in a shoe. Biscuit would admire your stubbornness.", opts: [
        { tone: 'cold', t: "Persistence wins races. Not that you'd know.", r: "Oof. Didn't see that coming round the outside. Nice move. Rare move." },
        { tone: 'passive', t: "I'll take that as encouragement.", r: "Don't. Take it as a weather report. Overcast, chance of me leaving." },
        { tone: 'flirty', t: "Stubborn and charming. Biscuit and I have that in common.", r: "Biscuit isn't charming. Neither are you. You're just... present. Fine. Pleasantly present." },
      ] },
    ] },

  // ---- slot 5: the tally of your terrible jokes -----------------------------------------------------------------------
  { id: 'rude-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Last time you were sharp. Let's see if it lasts. Tell me a joke. I'm keeping a tally of the bad ones. Go.",
    opts: [
      { tone: 'cold', t: "I'm not a jukebox. No jokes on demand.", r: "Refusing to entertain me. Wow. Funniest thing you've done. Tally stays at zero. For now.", opts: [
        { tone: 'cold', t: "Good. Let's keep it at zero.", r: "It won't stay there. You've got the energy of someone with a pun loaded. I'll wait." },
        { tone: 'passive', t: "Fine. Why did the mechanic nap under the car? To wake up oily.", r: "...That's one. Tally officially opened. I'm framing it. As evidence." },
        { tone: 'flirty', t: "I'll tell you one later. Somewhere quieter.", r: "Somewhere quieter so nobody hears you bomb? Smart. Still a no. Possibly a later." },
      ] },
      { tone: 'passive', t: "Okay. Why did the tyre need a rest? It was tyred.", r: "Oh no. Oh, that's terrible. One. You're number one on the tally. Congratulations, I hate it.", opts: [
        { tone: 'cold', t: "At least I'm number one at something.", r: "Self-deprecating. Disarming. I've seen better, but rarely from a driver. Point to you." },
        { tone: 'passive', t: "I've got more, if you want.", r: "I don't. That's two now, just for threatening. Put them away. Lock them up." },
        { tone: 'flirty', t: "You smiled. I saw it.", r: "That was a grimace. They look similar on me. It's a design flaw. Don't tell anyone." },
      ] },
      { tone: 'flirty', t: "Here's one: you, pretending you don't enjoy this.", r: "Ha. Ha. That's going on the tally, underlined. Joke one: 'you enjoy this'. Fiction.", opts: [
        { tone: 'cold', t: "Fine, it's fiction. You're terrible company.", r: "Oh, I am. I'm the worst. I'm delighted you noticed. You can stay. That's not a reward." },
        { tone: 'passive', t: "Okay, real joke. Why was the car sleepy? Long day.", r: "That's not even a joke. That's a status update. Two on the tally. A new low." },
        { tone: 'flirty', t: "That smile says the tally's wrong.", r: "That smile is me in pain. Listen to it. It's begging you to stop. Two." },
      ] },
    ] },
  { id: 'rude-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "Someone told me you're 'funny'. Prove it. One joke. I'm starting a tally of the terrible ones.",
    opts: [
      { tone: 'cold', t: "'Funny' is a big word for someone who never laughs.", r: "I laugh. Just not at things people want me to laugh at. Fine. Respect. The tally waits.", opts: [
        { tone: 'cold', t: "Let it wait.", r: "It's patient. So am I. Unlike your pit crew. Bye." },
        { tone: 'passive', t: "Fine. Why did the racer bring a ladder? To reach the podium.", r: "That's one. Officially. Tally mark one, your name on it, forever. Wow. Awful." },
        { tone: 'flirty', t: "I bet I could make you laugh.", r: "You could make me sigh. You're very good at that. You're doing it now. Keep going, apparently." },
      ] },
      { tone: 'passive', t: "Okay. What's a driver's favourite meal? Fast food.", r: "Oh no. That's tally mark one. I'll have it engraved. On something cheap.", opts: [
        { tone: 'cold', t: "Tally all you want. I thought it was great.", r: "Owning it. Disgusting. It's still terrible, but your commitment is a four." },
        { tone: 'passive', t: "I can do better. Give me another go?", r: "No. A second go gets you mark two. I'm protecting you from yourself." },
        { tone: 'flirty', t: "I'll keep telling them till you laugh.", r: "Then we'll be here for years. Both of us. Suffering. ...Fine. Years is fine." },
      ] },
      { tone: 'flirty', t: "My best joke is how fast you're warming to me.", r: "Warming to you? I'm wearing oven gloves. That's going on the tally as number one.", opts: [
        { tone: 'cold', t: "Then I'll stop wasting good material.", r: "There's no good material. There's just material. Fine, I'll miss it. A bit. Slightly." },
        { tone: 'passive', t: "A proper one, then. Why can't a car play football? One boot.", r: "...Two. You're at two, in one conversation. Record pace. The only record you'll break." },
        { tone: 'flirty', t: "Oven gloves, so it's hot over here.", r: "It's lukewarm at best. Like a forgotten tea. That's not a compliment. ...Mostly not." },
      ] },
    ] },
  { id: 'rude-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "Before you flirt again: tell me a joke instead. I keep a tally of bad ones. Yours will be the founding member.",
    opts: [
      { tone: 'cold', t: "I don't do party tricks.", r: "Not a trick. A test. You refused, which is honestly the best answer. Tally at zero. Suspicious.", opts: [
        { tone: 'cold', t: "Stay suspicious.", r: "Always. It's my cardio. Off you go, mysterious one." },
        { tone: 'passive', t: "Okay. What did one wheel say to the other? Let's roll.", r: "...One. You've founded the tally. History. Terrible, terrible history." },
        { tone: 'flirty', t: "I'll tell you one when you smile.", r: "Then you'll never tell it, which might be the best outcome for everyone. Don't wink." },
      ] },
      { tone: 'passive', t: "Why did the driver go back to school? Needed a brake.", r: "No. No. That's one. Founding member, gold star, exiled immediately. Wow.", opts: [
        { tone: 'cold', t: "Fine. You do one then.", r: "I don't tell jokes. I'm the critic. Nice deflection, though. That's a five." },
        { tone: 'passive', t: "Okay, that was weak. I'll practise.", r: "Practise on your mechanics. They're paid to put up with you. I'm a volunteer." },
        { tone: 'flirty', t: "You're on the tally too, for that look.", r: "That look was horror. I'm not on any tally. I'm the scorer. Nice try. Not nice. A try." },
      ] },
      { tone: 'flirty', t: "Okay: you, trying not to fall for me.", r: "That's not a joke, that's a delusion with timing. Tally: one. Underlined twice.", opts: [
        { tone: 'cold', t: "Delusion. Sure. Your loss.", r: "Ha. Look at that. Turned it round. Okay, the delusion has teeth. Four out of ten." },
        { tone: 'passive', t: "Fine. A real one, next time.", r: "Next time. Big promise. The tally waits. So do I. Not for you. Generally." },
        { tone: 'flirty', t: "You underlined it. You'll remember it.", r: "I remember all crimes. That's what the tally is for. Stop looking at me like I'm a trophy." },
      ] },
    ] },
  // ---- slot 6: honest, not nice ------------------------------------------------------------------------------------
  { id: 'rude-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "Still sparring? Good. Everyone near you says 'great job' about everything. I'm the only one who'll tell you the truth. You're welcome.",
    opts: [
      { tone: 'cold', t: "I don't need the truth from you. I've got data.", r: "Data doesn't tell you your interviews sound like a hostage video. I do. Free of charge.", opts: [
        { tone: 'cold', t: "Fine. Charge me next time.", r: "Oh, I will. Expensively. In sighs. You'll go broke. Off you go." },
        { tone: 'passive', t: "Why do you care what I sound like?", r: "I don't. I care about standards. You're standing near mine. ...That came out wrong. Leave." },
        { tone: 'flirty', t: "So you're looking out for me.", r: "I'm looking out for the audience. You happen to be in the frame. Don't build a house on that." },
      ] },
      { tone: 'passive', t: "Okay. Tell me the truth, then.", r: "You smile at cameras like they've got your passport. And you're better than your results. Don't get excited.", opts: [
        { tone: 'cold', t: "Better than my results. I already knew that.", r: "Ha. There's the ego. Good. It's healthier than modesty. Sickening, but healthier." },
        { tone: 'passive', t: "Thanks. I think.", r: "You think. Wow. That's a first for the week. Don't strain anything." },
        { tone: 'flirty', t: "You think I'm better? Say it again.", r: "No. Once was a slip. Twice would be a policy. I don't have policies about you." },
      ] },
      { tone: 'flirty', t: "And who tells you the truth?", r: "Nobody dares. Biscuit, sometimes, with her eyes. ...Why are you asking that like you'd volunteer?", opts: [
        { tone: 'cold', t: "I wouldn't. You'd sulk.", r: "I would sulk. Magnificently. Fine. That was honest. That earns you something. Not much." },
        { tone: 'passive', t: "Just curious. Forget it.", r: "Curious. The beige answer. You almost had something there and you parked it. Typical." },
        { tone: 'flirty', t: "I'd volunteer. You've got a nice frown.", r: "My frown is load-bearing. Don't compliment it, it'll collapse. ...Fine. It's a good frown." },
      ] },
    ] },
  { id: 'rude-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "You know why I'm like this? Honesty saves time. Nobody near you is honest. Your team said 'great job' to a stalled car.",
    opts: [
      { tone: 'cold', t: "You think rude is the same as honest.", r: "Rude is honest with the packaging off. Ooh. You want to argue? Good. I've been bored all week.", opts: [
        { tone: 'cold', t: "No. I've got better things to do.", r: "You don't, but I respect the bluff. A six-out-of-ten bluff. Go." },
        { tone: 'passive', t: "Fine, they're nice to me. Is that bad?", r: "Nice is how people avoid telling you the rear wing is on fire. Metaphorically. Usually." },
        { tone: 'flirty', t: "Argue with me over dinner, then.", r: "Dinner? To argue? That's... actually my ideal evening. No. Not with you. Probably not." },
      ] },
      { tone: 'passive', t: "Maybe they're just being kind.", r: "Kind is cowardice in a nice jumper. I'd rather be accurate than liked. It's less crowded.", opts: [
        { tone: 'cold', t: "And rude is cowardice in a worse jumper.", r: "Ha! Okay. That was good. I'm keeping it. I'll pretend I thought of it." },
        { tone: 'passive', t: "So you'd tell me if I was slow?", r: "You were slow. Sector two. Every lap. See? Easy. Painless for me." },
        { tone: 'flirty', t: "So you'll be my honest one?", r: "Your honest one? Like a pet? Like a lucky charm? ...I'll think about it. Badly. Slowly." },
      ] },
      { tone: 'flirty', t: "I like that you don't sugarcoat things.", r: "Nobody likes it. They say they do, then they cry in a car park. You'll cry in a car park.", opts: [
        { tone: 'cold', t: "Not over you.", r: "Not yet. Ha. Fine. Good answer. You're tougher than your interviews suggest." },
        { tone: 'passive', t: "Maybe. I'll let you know.", r: "Do. I'll bring tissues and a scorecard. Mostly the scorecard." },
        { tone: 'flirty', t: "I'd cry in a car park for you.", r: "Worst romantic sentence I've ever heard. Going on the tally. I'm also slightly moved. Shut up." },
      ] },
    ] },
  { id: 'rude-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "You're doing the hopeful face again. Let me save you time: I'm honest, not nice. People find that out and leave.",
    opts: [
      { tone: 'cold', t: "Good. Nice is boring. Honest I can work with.", r: "Oh. That's not the usual answer. Usually there's a speech. You skipped the speech. I like that.", opts: [
        { tone: 'cold', t: "Don't make it a thing.", r: "I won't. I'll make it a very small, private thing. Shut up. Go." },
        { tone: 'passive', t: "So how long do people usually last?", r: "Two dinners. Three if they're slow to notice. You've already beaten the average. Statistically." },
        { tone: 'flirty', t: "I'm not going anywhere. Get used to it.", r: "Get used to it, they say. Like a cold. Like a neighbour. ...Fine. I'll consider getting used to it." },
      ] },
      { tone: 'passive', t: "Okay. Honest, not nice. Got it.", r: "'Got it.' You say that like a sat-nav. Recalculating. Wow. Thrilling.", opts: [
        { tone: 'cold', t: "You talk like a broken one.", r: "Ha. Broken sat-nav. Good. That's going on the good list. There's a good list. It's short." },
        { tone: 'passive', t: "What do you want me to say?", r: "Something with a pulse. You're very polite. It's like talking to a lift." },
        { tone: 'flirty', t: "Honest, then: you're more fun than nice people.", r: "Fun? I'm not fun. I'm accurate. ...Okay, accurate can be fun. Don't spread it." },
      ] },
      { tone: 'flirty', t: "Nobody's leaving. I like honest.", r: "Everyone says that. Then I tell them their shoes are a cry for help. Your shoes are a cry for help.", opts: [
        { tone: 'cold', t: "Yours aren't winning awards either.", r: "Correct, they're comfortable. Comfort is anarchy. Point to you. Begrudgingly." },
        { tone: 'passive', t: "Okay, I'll buy new shoes.", r: "Don't buy shoes for me. Buy them for society. Wow. You fold fast. Like a deckchair." },
        { tone: 'flirty', t: "So you've been looking at my shoes. Interesting.", r: "I've been looking at the evidence. You were just standing in it. Stop enjoying this." },
      ] },
    ] },

  // ---- slot 7: the spot they did not save you ----------------------------------------------------------------------
  { id: 'rude-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "Don't read into this. I didn't save you a spot. It was an accident. Stand there. No, there.",
    opts: [
      { tone: 'cold', t: "I'd have found my own.", r: "Of course you would. Fine. Go and find it. ...It's taken. They're all taken. Get in this one.", opts: [
        { tone: 'cold', t: "Fine. Only because the others are taken.", r: "Exactly. Logistics. That's all this is. Stand still, you're letting the draught in." },
        { tone: 'passive', t: "Thanks. That's nice of you.", r: "It isn't nice, it's an accident. Say 'thanks' again and I'll give it to a stranger." },
        { tone: 'flirty', t: "You saved it. Admit it.", r: "I admit nothing. I'm a vault. A vault with one spare spot in it. Shut up." },
      ] },
      { tone: 'passive', t: "Okay. Thanks, I guess.", r: "Don't thank accidents. Thank fate. Or my bag. My bag did all the work.", opts: [
        { tone: 'cold', t: "Then I'll thank your bag. It's better company.", r: "It is. It never talks about tyres. Okay, that's a decent one. The bag agrees." },
        { tone: 'passive', t: "So, what have you been up to?", r: "Being right. Glaring. Not saving spots. Thrilling week. Yours was louder, I suppose." },
        { tone: 'flirty', t: "Tell the bag I owe it one.", r: "The bag doesn't want your gratitude. The bag wants you to stop smiling at me. The bag and I agree." },
      ] },
      { tone: 'flirty', t: "An accident. With my name on it.", r: "Accidents follow you everywhere. Ask your front wing. Get in it before I change my mind.", opts: [
        { tone: 'cold', t: "My front wing's fine. Unlike your excuses.", r: "My excuses are immaculate, but that was quick. Fine. Stay. Accidentally." },
        { tone: 'passive', t: "Okay. Sitting. Standing. Whatever this is.", r: "It's a spot. You're in it. Congratulations. That's the whole event." },
        { tone: 'flirty', t: "Next time save me one on purpose.", r: "On purpose? Like a person with feelings? Never. ...Maybe by accident again. Accidents repeat." },
      ] },
    ] },
  { id: 'rude-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "I did not save you a spot. Pure accident. My bag was there by chance and then it wasn't. Sit. Stand. Whatever.",
    opts: [
      { tone: 'cold', t: "Good. I'd hate to owe you.", r: "You don't. You owe the bag. The bag is merciless. Get in before it changes its mind.", opts: [
        { tone: 'cold', t: "Fine. I'm in. Don't talk to me.", r: "Excellent. Silence. My favourite way to spend time with someone. That's not a confession." },
        { tone: 'passive', t: "So what's new with you?", r: "Nothing. Same rain, same opinions. Biscuit knocked a pen off a shelf at me. Personally." },
        { tone: 'flirty', t: "You're blushing about a bag. It's sweet.", r: "I'm blushing about the temperature. Stop saying 'sweet'. I'll invoice you for it." },
      ] },
      { tone: 'passive', t: "Okay. Thanks for the accident.", r: "You're welcome for nothing. Sit. Stand. Exist nearby. That's all that's required.", opts: [
        { tone: 'cold', t: "Existing nearby. Big ask.", r: "It is, for some. You're managing. Barely. Six out of ten for existing." },
        { tone: 'passive', t: "This is nice, actually.", r: "Nice. You've used 'nice' on me. I'll allow it once. It's a bank holiday." },
        { tone: 'flirty', t: "Existing near you is my favourite thing.", r: "Your favourite thing should be winning. Sort your priorities. ...But noted. Unfortunately noted." },
      ] },
      { tone: 'flirty', t: "You missed me.", r: "I missed nothing. I happened to be next to an empty spot, and then you were in it. Physics.", opts: [
        { tone: 'cold', t: "Physics. Right. You're terrible at lying.", r: "I'm brilliant at lying. I'm just not bothering with you. That's worse. Or better. Sit." },
        { tone: 'passive', t: "Okay. Physics. I'll take it.", r: "You'll take physics. You'd take a parking fine if I handed it to you. Spine, please." },
        { tone: 'flirty', t: "Physics says I'm staying, then.", r: "Physics says you're annoying at a constant rate. Fine. Stay. Don't make it sound like a song." },
      ] },
    ] },
  { id: 'rude-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "Before you say anything: I didn't save you a spot. Total accident. Lose the smug look and get in it.",
    opts: [
      { tone: 'cold', t: "I wasn't going to stand with you anyway.", r: "Liar. You were already walking this way. Your feet gave you away. Get in. Accidentally.", opts: [
        { tone: 'cold', t: "My feet are wrong. Often.", r: "Like your racing line. Ha. Sorry. Not sorry. In you get." },
        { tone: 'passive', t: "Okay, I'll stay here a bit.", r: "A bit. How generous. Your bit's already up. Stay anyway, I don't care. Visibly." },
        { tone: 'flirty', t: "My feet know what they want.", r: "Your feet need supervision. So do you. Fine. I'll supervise. Nobody else is qualified." },
      ] },
      { tone: 'passive', t: "Right. It just happened to be free. Got it.", r: "Exactly. Nobody planned anything. Nobody moved a bag twice. Get in it.", opts: [
        { tone: 'cold', t: "You moved it twice. I watched.", r: "...You watched me? Creepy. Accurate. Fine. Twice. It was heavy. In." },
        { tone: 'passive', t: "So, how's Biscuit?", r: "Furious with the postman again. She asked about you. She didn't. Stop it." },
        { tone: 'flirty', t: "You moved a bag for me. I'm honoured.", r: "Don't be honoured, be in the spot. Honour is for knights. You're for... spots. Shut up." },
      ] },
      { tone: 'flirty', t: "You saved me a spot. Nicest thing you've ever done.", r: "Nicest thing I've done this year. Don't tell people. They'll expect it. I'll hate that.", opts: [
        { tone: 'cold', t: "Relax. I'll tell everyone you're awful.", r: "Thank you. That's all I ask. Keep my reputation intact. You're a good... colleague." },
        { tone: 'passive', t: "Okay. Your secret's safe.", r: "It better be. I've got a brand. It's mostly glaring. Don't ruin the glaring." },
        { tone: 'flirty', t: "I'll keep it as our secret.", r: "'Our' secret. We don't have an 'our'. We have a spot and a bag. ...Fine. One small 'our'." },
      ] },
    ] },

  // ---- slot 8: only they get to roast you ---------------------------------------------------------------------------
  { id: 'rude-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "Someone over there called your driving 'sloppy'. I told them to sit down. Only I'm allowed to say that. Don't thank me.",
    opts: [
      { tone: 'cold', t: "I can defend myself.", r: "You can't. You'd say 'fair point' and nod. I've seen your interviews. That's not defending, it's bowing.", opts: [
        { tone: 'cold', t: "Fine. Next time I'll bow at you.", r: "Do and I'll rate it. A three for posture. Ha. Okay, you're quick today." },
        { tone: 'passive', t: "What did you say to them?", r: "That their opinion was a two and their scarf was a one. They left. Everyone leaves when I score them." },
        { tone: 'flirty', t: "You're very protective of me.", r: "I'm protective of my material. You're my material. Same as a cat with a toy mouse. Ish." },
      ] },
      { tone: 'passive', t: "Thanks. That was decent of you.", r: "I said don't thank me. You thanked me. That's a minus. I'm deducting it from your score.", opts: [
        { tone: 'cold', t: "Fine. I take it back. You were rude to a stranger.", r: "I'm rude to everyone. They just usually deserve it less. Good. Ungrateful suits you." },
        { tone: 'passive', t: "Were they wrong, though? About sloppy?", r: "Half wrong. You're sloppy in sector one only. I can be precise. They can't. That's the issue." },
        { tone: 'flirty', t: "You'd fight for me. Noted.", r: "Fight? It was one sentence. Sentences aren't fights. ...It was a very good sentence, though." },
      ] },
      { tone: 'flirty', t: "My hero. Do I owe you?", r: "Everyone owes me. You owe me silence and a better qualifying lap. Don't call me 'hero'.", opts: [
        { tone: 'cold', t: "Fine. No hero. Just a busybody.", r: "A busybody! That's good. Accurate. I'm framing it. You're a five for that." },
        { tone: 'passive', t: "Okay. Thank you, though. Really.", r: "Stop with 'really'. It sounds like sincerity. I'm allergic. I'm sneezing internally." },
        { tone: 'flirty', t: "I'll pay you back. With interest.", r: "Interest? You're terrible with money. I've seen your shoes. ...Fine. Pay me back. Slowly." },
      ] },
    ] },
  { id: 'rude-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "Someone over there was mocking your qualifying. I corrected them. Loudly. Roasting you is my job. Get your own critic.",
    opts: [
      { tone: 'cold', t: "Get my own critic? You volunteered.", r: "I did not volunteer. I was conscripted by your terrible braking. Fair, though. Point to you.", opts: [
        { tone: 'cold', t: "Then resign.", r: "Can't. The pay is wonderful. It's nothing, but I get to watch you sulk. Off you go." },
        { tone: 'passive', t: "So what did they actually say?", r: "That you qualify like a tourist. Which is my line. I've been using it for weeks. They stole it." },
        { tone: 'flirty', t: "So you're my critic. Exclusively.", r: "Exclusively? It's not a contract. It's a hobby. Don't make it sound like jewellery." },
      ] },
      { tone: 'passive', t: "Huh. Didn't expect that from you.", r: "Nobody does. That's the point. Be surprised quietly, please. Your surprise has a volume problem.", opts: [
        { tone: 'cold', t: "Surprised you've got a nice bone in you.", r: "I don't. It was a mean bone pointed in a useful direction. Ha. Fine. That was good." },
        { tone: 'passive', t: "Well, I appreciate it.", r: "Appreciate it silently. It's the only way I accept gratitude. Like Biscuit, actually." },
        { tone: 'flirty', t: "First the spot, now this. You like me.", r: "I like nothing. I tolerate select things. You're on a list. It's not a long list. Don't read it." },
      ] },
      { tone: 'flirty', t: "My own personal critic. I'm touched.", r: "Don't be touched. Be better in sector two. That's how you thank a critic.", opts: [
        { tone: 'cold', t: "I'll thank you by ignoring you.", r: "Perfect. That's how I'd thank me too. Okay. We understand each other. Horrifying." },
        { tone: 'passive', t: "Sector two. Got it. Working on it.", r: "You say 'working on it' like it's a hobby. Make it a personality. You need a spare." },
        { tone: 'flirty', t: "I'd rather thank you some other way.", r: "Like what? A card? A muffin? Don't answer. You'll say something tragic. You're welcome." },
      ] },
    ] },
  { id: 'rude-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "Don't get ideas, but I just told someone off for insulting you. Only I get to roast you. It's a licence. I have it.",
    opts: [
      { tone: 'cold', t: "I didn't need saving.", r: "Nobody said saving. It was licensing. I own the roast rights. You're just the property.", opts: [
        { tone: 'cold', t: "Then I'll sue for my rights back.", r: "You'd lose. My lawyer is spite. Spite never loses a case. Good line, though." },
        { tone: 'passive', t: "A licence, huh. Where'd you get that?", r: "Self-issued. Laminated. Valid indefinitely. Like most of my opinions." },
        { tone: 'flirty', t: "Property. I could get used to that.", r: "Don't. It was a figure of speech. Speeches don't count. Stop looking pleased about it." },
      ] },
      { tone: 'passive', t: "What did they say about me?", r: "That you're overrated. Which is lazy. You're appropriately rated. By me. A four, holding.", opts: [
        { tone: 'cold', t: "A four. Generous of you.", r: "It is generous. Most people are minus. You're a four with potential. Don't let it out." },
        { tone: 'passive', t: "Okay. I'll try to deserve the four.", r: "'Try to deserve.' Wow. Humble pie. I hate pie. Have a spine instead." },
        { tone: 'flirty', t: "A four you'd fight a stranger for.", r: "I'd fight a stranger for a sandwich. Don't flatter the four. ...It's a five tonight. Shut up." },
      ] },
      { tone: 'flirty', t: "You're cute when you're protective.", r: "I'm not cute. I'm a security system. Alarms aren't cute. They're loud and correct.", opts: [
        { tone: 'cold', t: "You're loud. I'll give you that.", r: "Thank you. Loud and correct. It's on my business cards. You're quicker today. Suspicious." },
        { tone: 'passive', t: "Okay, security system. Thanks.", r: "Don't thank the alarm. Thank yourself for being so roastable. Somebody has to protect the asset." },
        { tone: 'flirty', t: "Then I'll keep setting you off.", r: "You'll get banned from the building. ...From me. Banned from me. Not really. Stop." },
      ] },
    ] },

  // ---- slot 9: tolerable (end of the chapter) -----------------------------------------------------------------------
  { id: 'rude-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "Okay. I've decided. You're tolerable. That's huge. People frame that. You're a five now. Don't make a speech.",
    opts: [
      { tone: 'cold', t: "Five. I'll try not to faint.", r: "Do faint. It'd be dramatic. I'd rate it. Okay. Fine. Five and a half. Shut up.", opts: [
        { tone: 'cold', t: "Stop inflating. It's unprofessional.", r: "Correct. Back to five. You're good at this. I hate it. See you around. Or don't." },
        { tone: 'passive', t: "So what happens now?", r: "Now you leave, and come back, and I pretend I didn't notice. It's a system. It works." },
        { tone: 'flirty', t: "Half a point extra. I'm getting under your skin.", r: "You're getting under my nails. Like dirt. Like glitter. Fine. Glitter. See you." },
      ] },
      { tone: 'passive', t: "Tolerable. That's kind of nice.", r: "It isn't nice. It's a ruling. Accept it with dignity, for once. And come back. Or don't.", opts: [
        { tone: 'cold', t: "Maybe I won't.", r: "Maybe you won't. Ha. Look at you. I'll survive. I'll be here. Not waiting. Standing." },
        { tone: 'passive', t: "I'll come back.", r: "Good. I mean fine. I mean, it's a free world. Biscuit will be thrilled. She won't." },
        { tone: 'flirty', t: "I'll come back for the next point.", r: "The next point costs. I don't know what yet. Something humiliating. You'll pay it." },
      ] },
      { tone: 'flirty', t: "Tolerable is basically a love letter from you.", r: "It's a parking permit. You can park here. Occasionally. Don't scratch anything.", opts: [
        { tone: 'cold', t: "Keep your permit. I'll park where I like.", r: "There it is. That's why you got the five. Go on. Park where you like. Near here." },
        { tone: 'passive', t: "Okay. A permit. Fine by me.", r: "Fine by you. Riveting. You got the five for spine. Use it." },
        { tone: 'flirty', t: "I'll park here a lot, then.", r: "A lot. That's a threat. I accept threats. Okay. Park. See you around. Do. See you around." },
      ] },
    ] },
  { id: 'rude-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "I've been doing the maths. You've gone from a four to a five. That's tolerable. I've never said tolerable to a driver.",
    opts: [
      { tone: 'cold', t: "You did maths about me? That's sad.", r: "It's not sad, it's thorough. You're the sad one. A five. Ha. Okay, good one. See you.", opts: [
        { tone: 'cold', t: "See you. Maybe.", r: "Maybe. Wow. Playing it cool. Like a fridge. Fine. Maybe works for me." },
        { tone: 'passive', t: "What does a six take?", r: "Time. Effort. Not saying 'nice'. You've got a long road. It's very scenic. It's mostly potholes." },
        { tone: 'flirty', t: "Admit you'll miss me between races.", r: "Miss you? I'll miss the noise. You're a noise. A tolerable noise. Go away." },
      ] },
      { tone: 'passive', t: "Thanks. I'll take tolerable.", r: "You take everything. Take it with dignity. Take it home. Come back with it. Or don't.", opts: [
        { tone: 'cold', t: "I'll bring it back when I feel like it.", r: "Good. That's the energy that got you the five. Don't drop it on the way out." },
        { tone: 'passive', t: "Will I see you next race?", r: "Probably. I'll be around. Hate-watching. Being right. You'll find me. You always do." },
        { tone: 'flirty', t: "You'll be thinking about me. Admit it.", r: "I'll be thinking about my sandwich. You'll come up. Briefly. Unfortunately. Fine." },
      ] },
      { tone: 'flirty', t: "Never said it to a driver. So I'm special.", r: "You're unusual. Special is for cakes and lanes on motorways. Unusual. Five.", opts: [
        { tone: 'cold', t: "Unusual. That's the nicest thing you've said.", r: "It is. Don't repeat it. I'll deny it under oath. I'm excellent under oath." },
        { tone: 'passive', t: "Unusual's fine. I'll take it.", r: "Stop 'taking' things. Grab them. Wow. Okay. See you around. Grab that." },
        { tone: 'flirty', t: "Unusually irresistible, you mean.", r: "Unusually confident. Unusually loud. Fine, I'll see you around. Unusually soon, probably." },
      ] },
    ] },
  { id: 'rude-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "Fine. You've worn me down. You're a five out of ten. Tolerable. I'll see you around. Or not. Whatever. See you around.",
    opts: [
      { tone: 'cold', t: "Or not. Whatever. See you.", r: "Ha. Stealing my lines. Fine. They're good lines. I'll be here. Whatever.", opts: [
        { tone: 'cold', t: "Don't wait up.", r: "I never wait up. I just happen to be awake. It's different. Go on." },
        { tone: 'passive', t: "See you next race, then.", r: "Next race. Fine. I'll be the one sighing. You'll know me by the sighs." },
        { tone: 'flirty', t: "Say it once more. 'See you around.'", r: "No. Twice was a glitch. Three times is a commitment. Go before I glitch again." },
      ] },
      { tone: 'passive', t: "Okay. A five. That's progress.", r: "Progress. Like a slow lane. Like a queue. Fine. It's progress. Don't be insufferable about it.", opts: [
        { tone: 'cold', t: "Insufferable is your department.", r: "Correct. And I run it well. Five. You're keeping it. See you. Or not. Mostly see you." },
        { tone: 'passive', t: "I'll try not to be.", r: "You'll try. Wow. Effort. Gross. Okay. Off you go. Be tolerable elsewhere." },
        { tone: 'flirty', t: "Worn you down, though. You said it.", r: "I said you were persistent. Like damp. Fine. Damp wears things down. See you around." },
      ] },
      { tone: 'flirty', t: "You said 'see you around' twice. You want to see me.", r: "Twice because you didn't listen the first time. Classic you. ...Yes. Fine. Around.", opts: [
        { tone: 'cold', t: "I heard you. I just like making you repeat it.", r: "Oh, that's evil. I'm impressed. That's five point five. Go away. Come back. Not in that order." },
        { tone: 'passive', t: "Okay. Around it is.", r: "'Around it is.' Like a booking. Fine. You're booked. Tentatively. In pencil." },
        { tone: 'flirty', t: "I'll be around. A lot.", r: "A lot is too much. A bit is fine. Somewhere in the middle. Near me. Shut up. Go." },
      ] },
    ] },
];
