// SHY - the phone, the week between races. Braver in writing: full sentences, careful punctuation, 'sorry, that was a lot'.
export const DATA = [
  // ==== NEW ==============================================================================================================
  // ---- 1: a long noticed-detail text -----------------------------------------------------------------------------------
  { id: 'shy-text-week-new-1-cold', on: 'week', stage: 'new', slot: 1, mood: 'cold',
    say: "I wasn't sure I should text, after last time. But you hold your cup in both hands. I noticed. That's all. Sorry.",
    opts: [
      { tone: 'cold', t: "Ok.", r: "Okay. Sorry. I'll keep the noticing to myself. It's where it usually lives." },
      { tone: 'passive', t: "Ha, I do do that. Thanks.", r: "You're welcome. It's the kind of thing nobody says, so I said it. Badly. In writing. At least it's spelled right." },
      { tone: 'flirty', t: "What else have you noticed?", r: "Not telling. Writing is permanent. ...You squint when you smile. That's all. Goodnight. Sorry." },
    ] },
  { id: 'shy-text-week-new-1-passive', on: 'week', stage: 'new', slot: 1, mood: 'passive',
    say: "You hold your cup with both hands, like it's always winter. I noticed. I liked it. Sorry. A lot, for a text about a cup.",
    opts: [
      { tone: 'cold', t: "Bit of a strange text.", r: "It is. I know. I typed it eleven times and it got stranger each time. I'll stop now." },
      { tone: 'passive', t: "Ha. News to me.", r: "Most people don't know their own habits. That's what other people are for. Apparently I'm for that." },
      { tone: 'flirty', t: "Keep noticing. I like it.", r: "Okay. Noted. I'll keep noticing. Quietly. And then text you about it at inconvenient hours." },
    ] },
  { id: 'shy-text-week-new-1-flirty', on: 'week', stage: 'new', slot: 1, mood: 'flirty',
    say: "Can't stop thinking: you hold your cup in both hands, like it's precious. I'd like to be held like a cup. Ignore that.",
    opts: [
      { tone: 'cold', t: "Ignored.", r: "Thank you. Genuinely. I'll be under a blanket for the rest of the evening." },
      { tone: 'passive', t: "Like a cup? Explain.", r: "Carefully, with both hands, as if it's warm. ...I've explained it now. That's worse. Sorry. Too much." },
      { tone: 'flirty', t: "Not ignoring it. Noted for later.", r: "For later. Oh no. I'm putting my phone face down and walking away from it. Slowly." },
    ] },
  // ---- 2: Pickle on the jigsaw (ESTABLISHES in texts: the cat Pickle, the all-sky jigsaw) ------------------------------
  { id: 'shy-text-week-new-2-cold', on: 'week', stage: 'new', slot: 2, mood: 'cold',
    say: "I don't know if you want updates. But my cat, Pickle, is lying on my jigsaw. It's all sky. Pickle has crushed a cloud.",
    opts: [
      { tone: 'cold', t: "Not particularly.", r: "No. That's fine. Pickle didn't want to be talked about anyway. Sorry." },
      { tone: 'passive', t: "I want updates. What's the jigsaw?", r: "A thousand pieces. All sky. No picture, just blue. It's very calming. You're allowed to think that's odd." },
      { tone: 'flirty', t: "Pickle updates are my favourite updates.", r: "Really? I have hundreds. Pickle does something ridiculous hourly. I'll ration them. One a day. With a photo." },
    ] },
  { id: 'shy-text-week-new-2-passive', on: 'week', stage: 'new', slot: 2, mood: 'passive',
    say: "Update: my cat, Pickle, is asleep on my jigsaw. A thousand pieces of sky, and Pickle has chosen the exact middle.",
    opts: [
      { tone: 'cold', t: "Ok, cool.", r: "Okay. It is cool, a bit. Pickle thinks so. I'll leave you alone with your evening." },
      { tone: 'passive', t: "Ha! Pickle's got taste. All sky?", r: "All sky. A thousand pieces of blue. I'm not well. Pickle approves, though. Pickle's lying in it." },
      { tone: 'flirty', t: "Tell Pickle to move over. I want a turn.", r: "On the jigsaw? There isn't room. ...There's room. I'd make room. I'm going to lie face down now." },
    ] },
  { id: 'shy-text-week-new-2-flirty', on: 'week', stage: 'new', slot: 2, mood: 'flirty',
    say: "My cat Pickle is lying on my sky jigsaw like it's a beach. I'm jealous. Of the cat. That was a strange thing to type.",
    opts: [
      { tone: 'cold', t: "Weird thing to be jealous of.", r: "Yes. I re-read it. It's very weird. I'm going to delete it from my own memory. Goodnight." },
      { tone: 'passive', t: "Pickle's got the best seat. What's the jigsaw?", r: "Just sky. A thousand pieces of it. No clouds, no birds. Just blue. Pickle is the only cloud right now." },
      { tone: 'flirty', t: "Jealous of the cat, or the cat's spot?", r: "I'm not answering that. ...The spot. It's very warm. I'm going to stop typing. My thumbs are a menace." },
    ] },
  // ---- 3: the question too shy to ask in person (deep) -------------------------------------------------------------------
  { id: 'shy-text-week-new-3-cold', on: 'week', stage: 'new', slot: 3, mood: 'cold',
    say: "Too shy to ask in person, so: what does it feel like, at top speed? You don't have to answer. After last time.",
    opts: [
      { tone: 'cold', t: "It's loud. Next question.", r: "Okay. Loud. No next question. I'll stop there. Sorry.", opts: [
        { tone: 'cold', t: "Sure.", r: "Okay. ...I'll go back to wondering. It was more fun anyway." },
        { tone: 'passive', t: "Sorry. Long day. It's calm, actually. Inside.", r: "Calm inside. Thank you for telling me properly. I'd have stayed wondering for months." },
        { tone: 'flirty', t: "Ask me in person. I'll tell you everything.", r: "In person I'd just nod. And go red. ...But I'd ask. I'll try. I'll write the question on my hand." },
      ] },
      { tone: 'passive', t: "No, it's a good question. It's quiet, oddly.", r: "Quiet. I didn't expect that. I'd assumed it was all noise and panic. Like me at parties.", opts: [
        { tone: 'cold', t: "Not everything's like a party.", r: "No. You're right. Sorry. That was a strange comparison." },
        { tone: 'passive', t: "Exactly like you at parties. Only fast.", r: "Fast panic. I'll take that. I'll think of you as a very brave, very quick version of me." },
        { tone: 'flirty', t: "Quiet. And I think about who's watching.", r: "I watch through my fingers, mostly. ...You didn't need to know that. You know it now." },
      ] },
      { tone: 'flirty', t: "You can ask me anything. It's like flying.", r: "Like flying. I've only flown economy, next to someone eating crisps. I'm guessing it's not like that.", opts: [
        { tone: 'cold', t: "Not at all, no.", r: "No. ...It was meant to be funny. Sorry. They're better when I don't explain them." },
        { tone: 'passive', t: "Ha! No crisps. Just you and the road.", r: "You and a road. That sounds lonely and lovely. Like a long walk. A very fast long walk." },
        { tone: 'flirty', t: "Next time I'll save you the seat next to me. No crisps.", r: "No crisps. The most romantic thing anyone's ever said to me. Which is a worrying sign. For me." },
      ] },
    ] },
  { id: 'shy-text-week-new-3-passive', on: 'week', stage: 'new', slot: 3, mood: 'passive',
    say: "Can I ask something I'd never manage in person? What does it actually feel like, at full speed? I've wondered for ages.",
    opts: [
      { tone: 'cold', t: "Loud. Hot. That's about it.", r: "Loud and hot. Okay. That's very efficient. Thank you for answering at all.", opts: [
        { tone: 'cold', t: "Yep.", r: "Right. I'll leave you to it. Sorry for the question." },
        { tone: 'passive', t: "Honestly? Quiet, weirdly. In my head.", r: "Quiet in the loud. I like that more than I can type. Thank you. I'll think about it all week." },
        { tone: 'flirty', t: "Like the moment before you say something brave.", r: "Oh. I know that one. I've had it for about twenty minutes, deciding whether to send this." },
      ] },
      { tone: 'passive', t: "Weirdly calm. Everything slows down.", r: "Slows down? At that speed? That's the opposite of what I'd have guessed. I'd have guessed screaming.", opts: [
        { tone: 'cold', t: "No screaming. Just work.", r: "Just work. Okay. I'll stop romanticising it. Mostly. Sorry." },
        { tone: 'passive', t: "No screaming. You just stop thinking.", r: "Stop thinking. I've never managed that. Not once. Maybe I need a car. ...I'd drive it into a hedge." },
        { tone: 'flirty', t: "A bit like talking to you.", r: "Talking to me slows things down? Thank you. That's the nicest thing anyone's said about my pauses." },
      ] },
      { tone: 'flirty', t: "Like flying. Secret? It's nothing on seeing you.", r: "That's very smooth. You can't be smooth in writing. Writing's my place. Stop it. Don't stop it.", opts: [
        { tone: 'cold', t: "Kidding. It's just a job.", r: "Ah. Right. Of course. I believed you for a second. I'll go and un-believe it." },
        { tone: 'passive', t: "Okay, really: it's like everything goes quiet.", r: "Quiet. In the loudest place there is. I think that's the bit I'd like." },
        { tone: 'flirty', t: "Not kidding. You're faster.", r: "I'm not fast at anything. Except this, apparently. Going red at my phone. That's fast." },
      ] },
    ] },
  { id: 'shy-text-week-new-3-flirty', on: 'week', stage: 'new', slot: 3, mood: 'flirty',
    say: "I'm braver here, so I'll ask: what does it feel like at full speed? And is it anything like this text is making me feel?",
    opts: [
      { tone: 'cold', t: "It's a job. Not a feeling.", r: "Oh. Okay. I'll stop making it into a feeling. I do that. Sorry.", opts: [
        { tone: 'cold', t: "Better.", r: "Yes. Better. ...I'll keep my feelings in the drafts folder." },
        { tone: 'passive', t: "Sorry. It's actually calm. Like breathing out.", r: "Like breathing out. I'm doing that now. Because you answered. Properly." },
        { tone: 'flirty', t: "Okay, it's a feeling. A lot like this one.", r: "This one. You mean— okay. I'm putting the phone face down. On the sofa. Under a cushion." },
      ] },
      { tone: 'passive', t: "Calm, honestly. And what's this text making you feel?", r: "Not answering that. ...Fizzy. Like a shaken bottle. That was a lot, sorry.", opts: [
        { tone: 'cold', t: "A bit much, honestly.", r: "Yes. I know. I hit send too fast. Phone me is reckless. Goodnight." },
        { tone: 'passive', t: "Fizzy is good. I'll take fizzy.", r: "Okay. Fizzy it is. It's quite nice. I'll stop shaking the bottle now." },
        { tone: 'flirty', t: "Same. Exactly that.", r: "You too? Two fizzy people. That's chemistry. Ignore that. Don't ignore that." },
      ] },
      { tone: 'flirty', t: "Faster. Your texts are faster.", r: "My texts are faster than a racing car? That's the first time I've ever been called fast.", opts: [
        { tone: 'cold', t: "Only the texts.", r: "Only the texts. Yes. In person I'm a slow lane. Okay." },
        { tone: 'passive', t: "In the best way.", r: "The best way. I'll keep it. I'll put it next to the cup thing. I have a folder." },
        { tone: 'flirty', t: "And they make my heart race.", r: "That's a pun. You've done a racing pun. ...I liked it. I'm ashamed of how much I liked it." },
      ] },
    ] },
  // ---- 4: a thought sent by accident - 'ignore that' --------------------------------------------------------------------
  { id: 'shy-text-week-new-4-cold', on: 'week', stage: 'new', slot: 4, mood: 'cold',
    say: "Ignore the last message. If there was one. There might not have been. I deleted a lot of drafts. Sorry. Hello.",
    opts: [
      { tone: 'cold', t: "There wasn't one.", r: "Oh good. Good. Then this is the only one. And it says hello. That's all it says." },
      { tone: 'passive', t: "Hello. What were the drafts?", r: "Mostly apologies. One about the weather. One with a joke that didn't work. You got the survivor." },
      { tone: 'flirty', t: "Send me the drafts. All of them.", r: "Absolutely not. They're in a vault. ...One said you have a nice laugh. That's the safest one." },
    ] },
  { id: 'shy-text-week-new-4-passive', on: 'week', stage: 'new', slot: 4, mood: 'passive',
    say: "Is it possible to miss someone you've only met a few times? Ignore that. That was meant for my notes app.",
    opts: [
      { tone: 'cold', t: "Consider it ignored.", r: "Thank you. It's ignored. It never existed. Neither do I, for the next hour." },
      { tone: 'passive', t: "Not ignoring. And yes. I think so.", r: "You think so? Then I'm not strange. Or we both are. That's a nicer thought." },
      { tone: 'flirty', t: "About me, by any chance?", r: "It was a general question. Philosophically. ...Yes. Apologies. A lot, that." },
    ] },
  { id: 'shy-text-week-new-4-flirty', on: 'week', stage: 'new', slot: 4, mood: 'flirty',
    say: "You have a really nice voice. Ignore that. Wrong window. ...There is no other window. Hello.",
    opts: [
      { tone: 'cold', t: "Okay then.", r: "Okay. Yes. Hello. That's all. That's the whole text now." },
      { tone: 'passive', t: "Thank you. I'm not ignoring that.", r: "Please do. Ignore it beautifully. I'm going to sit in a cupboard until it passes." },
      { tone: 'flirty', t: "Your voice is nicer.", r: "My voice? It's barely used. Like a new car. Low mileage. ...That's a racing joke. For you." },
    ] },
  // ---- 5: a dry report of their day ---------------------------------------------------------------------------------------
  { id: 'shy-text-week-new-5-cold', on: 'week', stage: 'new', slot: 5, mood: 'cold',
    say: "It rained all day. I stayed in. That's all. I don't know why I'm telling you. After last time. I'll stop.",
    opts: [
      { tone: 'cold', t: "Right.", r: "Right. Yes. Sorry. I'll go back to the rain." },
      { tone: 'passive', t: "Tell me. I like hearing about your day.", r: "Rain. Tea. A cat. A jigsaw. Nothing happened. And I wanted to tell you about it anyway. Isn't that odd." },
      { tone: 'flirty', t: "Rainy days are better with company.", r: "Are they? I've only done them alone. With Pickle. Pickle doesn't count. Pickle judges." },
    ] },
  { id: 'shy-text-week-new-5-passive', on: 'week', stage: 'new', slot: 5, mood: 'passive',
    say: "Today's report: it rained, I burnt my tongue on tea, and Pickle sat on a letter I needed. A normal day. Yours?",
    opts: [
      { tone: 'cold', t: "Fine, thanks.", r: "Good. Fine is good. I'll take fine. Have a nice fine evening." },
      { tone: 'passive', t: "Training, then a long meeting. Yours sounds better.", r: "It wasn't, really. But I liked telling you about it. That's the best bit of a day. Telling someone." },
      { tone: 'flirty', t: "I'd have made your tea for you. Cooler.", r: "You'd blow on it? That's very intimate for a weekday. Sorry. I'll be quiet now." },
    ] },
  { id: 'shy-text-week-new-5-flirty', on: 'week', stage: 'new', slot: 5, mood: 'flirty',
    say: "It rained all day and I thought about you every time it got heavier. That's not a metaphor. It's just what happened. Hi.",
    opts: [
      { tone: 'cold', t: "Intense text.", r: "Yes. It reads intense. It felt like weather. I'll stick to weather. Goodnight." },
      { tone: 'passive', t: "It rained here too. Same clouds, maybe.", r: "Same clouds. I like that. I'm going to look out of the window now and think 'same clouds'." },
      { tone: 'flirty', t: "Then I hope it rains all week.", r: "All week. You'd drown me. ...Happily. I'll buy an umbrella I don't use." },
    ] },
  // ---- 6: braver in writing - 'I'd like to see you again' (deep) -----------------------------------------------------------
  { id: 'shy-text-week-new-6-cold', on: 'week', stage: 'new', slot: 6, mood: 'cold',
    say: "I know last time wasn't great. I'm braver in writing, so: I'd still like to see you again. No is allowed. I'll survive.",
    opts: [
      { tone: 'cold', t: "Let me think about it.", r: "That's fair. That's very fair. Thank you for not saying no straight away.", opts: [
        { tone: 'cold', t: "Don't hold your breath.", r: "No. I won't. ...I'll hold it a bit. Not much. Just a bit." },
        { tone: 'passive', t: "I've thought. Yes. I'd like that.", r: "That was quick thinking. Thank you. I'll find somewhere quiet. Somewhere with no cameras." },
        { tone: 'flirty', t: "Thought about it. I want to see you too.", r: "You do? Even after— okay. I'm smiling at a lamp post. People are looking." },
      ] },
      { tone: 'passive', t: "Last time was my fault. Yes, let's.", r: "It wasn't anyone's fault. It was a bad day. Yes. Let's. I'll stop typing before I ruin it.", opts: [
        { tone: 'cold', t: "Okay. Message me a time.", r: "I will. A time. A place. A very normal message. No feelings in it at all." },
        { tone: 'passive', t: "Somewhere quiet. You pick.", r: "There's a little gallery nobody goes to. It's mostly paintings of fog. You'll hate it. You'll love it." },
        { tone: 'flirty', t: "Let me make it up to you.", r: "There's no need. ...But if you insist, I'll let you. Slowly. In person. Where I'll go red." },
      ] },
      { tone: 'flirty', t: "You won't need to survive. Yes.", r: "You said yes. In writing. I can look at it as often as I like. I'm going to.", opts: [
        { tone: 'cold', t: "Don't read too much into it.", r: "I'll read exactly the right amount. Which is twelve times. Sorry." },
        { tone: 'passive', t: "Where shall we go?", r: "Somewhere you can hear yourself think. There's a garden with a pond and one very rude duck." },
        { tone: 'flirty', t: "Somewhere I can make you go red in person.", r: "That's anywhere. You could do that in a supermarket. ...Fine. Somewhere with a nice bench." },
      ] },
    ] },
  { id: 'shy-text-week-new-6-passive', on: 'week', stage: 'new', slot: 6, mood: 'passive',
    say: "I'm braver here, so I'll just say it: I'd like to see you again. On purpose. Somewhere quiet. Sorry. Not sorry. Sorry.",
    opts: [
      { tone: 'cold', t: "Maybe. I'm busy.", r: "Of course. Maybe is fine. Maybe is more than I usually get.", opts: [
        { tone: 'cold', t: "We'll see.", r: "We'll see. Okay. I'll stop refreshing my phone. Eventually." },
        { tone: 'passive', t: "Actually, yes. Next week?", r: "Next week. Yes. Somewhere quiet, then. I have a list of quiet places. Of course I do." },
        { tone: 'flirty', t: "For you, I'll un-busy myself.", r: "Un-busy. That's not a word. It's my favourite word now. Yes. When?" },
      ] },
      { tone: 'passive', t: "Yes. I'd really like that.", r: "You would? I only planned for no. I've drafted nine responses to no.", opts: [
        { tone: 'cold', t: "Don't make it a big thing.", r: "No. A small thing. A tiny, normal thing. Extremely normal. Sorry." },
        { tone: 'passive', t: "Pick a place. I'll be there.", r: "There's a park with a bench nobody sits on. Saturday morning? I'll bring tea. Too hot, probably." },
        { tone: 'flirty', t: "Sorry, not sorry, sorry. That's adorable.", r: "It's not adorable. It's a malfunction. ...Fine. It's slightly adorable. When are you free?" },
      ] },
      { tone: 'flirty', t: "Not sorry at all. Yes. Soon.", r: "Soon. You said soon. I need to sit down. I'm already sitting. I'll lie down.", opts: [
        { tone: 'cold', t: "No rushing, though.", r: "No. Not rush. Slowly. I'm a professional at slowly." },
        { tone: 'passive', t: "This weekend?", r: "This weekend. Yes. Somewhere quiet. I'll text you a place. I'll only draft it four times." },
        { tone: 'flirty', t: "As soon as possible. I miss your face.", r: "You miss my— I'm going to screenshot that. As evidence. That I'm not imagining things." },
      ] },
    ] },
  { id: 'shy-text-week-new-6-flirty', on: 'week', stage: 'new', slot: 6, mood: 'flirty',
    say: "Phone me is brave, so phone me is asking: can I see you again? Soon? In person I'll pretend I never sent this.",
    opts: [
      { tone: 'cold', t: "Pretend? Then why send it?", r: "Because I wanted you to know. Even if I can't say it. ...Never mind. Too much, probably.", opts: [
        { tone: 'cold', t: "It was. A lot.", r: "Yes. I'll un-send it. In spirit. Goodnight." },
        { tone: 'passive', t: "Fair. Yes. Let's meet.", r: "Yes? I'll be the one pretending I never sent this. You be the one who knows I did." },
        { tone: 'flirty', t: "Don't pretend. Say it to my face. I'll wait.", r: "You'll wait. That's the problem. You'd actually wait. ...Okay. I'll try. I'll whisper it." },
      ] },
      { tone: 'passive', t: "Yes. Soon. I won't tell anyone you asked.", r: "Thank you. Your discretion is noted. And appreciated. And— yes. Soon. Very good.", opts: [
        { tone: 'cold', t: "Don't make a thing of it.", r: "No thing. Absolutely no thing. ...It's a small thing. Okay." },
        { tone: 'passive', t: "Thursday? Somewhere quiet?", r: "Thursday. Quiet. Yes. I'll find the quietest place in the city. I'm a sort of expert." },
        { tone: 'flirty', t: "I'll tell everyone. Loudly.", r: "Please don't. ...Please do. No— don't. I'm going to sit in a dark room and smile." },
      ] },
      { tone: 'flirty', t: "Soon as you like. And I'll remind you that you sent it.", r: "Oh no. You'll do something with your eyebrow. I'll have to look at the floor the whole time.", opts: [
        { tone: 'cold', t: "I'll behave.", r: "Thank you. ...A little misbehaving is fine. I said that in writing. I'm leaving." },
        { tone: 'passive', t: "I promise I'll be gentle about it.", r: "Gentle. Then yes. Soon. I'll be early. I'm always early." },
        { tone: 'flirty', t: "Floor's fine. I'll be looking at you.", r: "Then I'll look at the floor and you'll look at me. Everyone's busy. It's a system." },
      ] },
    ] },

  // ==== WARM =============================================================================================================
  // ---- 1: can't sleep - an honest thing -----------------------------------------------------------------------------------
  { id: 'shy-text-week-warm-1-cold', on: 'week', stage: 'warm', slot: 1, mood: 'cold',
    say: "Can't sleep. Still thinking about last time. I'm not upset. Just quiet. Quieter. I wanted you to know I'm still here.",
    opts: [
      { tone: 'cold', t: "Ok. Goodnight.", r: "Goodnight. ...Sorry. I'll be louder tomorrow. Not much louder." },
      { tone: 'passive', t: "I'm glad you're still here. Sleep well.", r: "Thank you. That helps. I think I can sleep now. Probably. Pickle permitting." },
      { tone: 'flirty', t: "Still here suits you. I like you here.", r: "You like me here. Okay. I'm going to fall asleep smiling, which is very inconvenient for my face." },
    ] },
  { id: 'shy-text-week-warm-1-passive', on: 'week', stage: 'warm', slot: 1, mood: 'passive',
    say: "Late, can't sleep, so here's an honest thing: I'm happier on days I've seen you. That's it. Sorry. Too many words.",
    opts: [
      { tone: 'cold', t: "Get some sleep.", r: "Yes. Good advice. I'll try. ...Sorry for the late text." },
      { tone: 'passive', t: "That's not a lot. That's lovely.", r: "Is it? Then I'll stop apologising for it. I'll just be happy about it. Quietly. Under a duvet." },
      { tone: 'flirty', t: "Me too. Happier on those days. Every time.", r: "Every time. That's going in the folder of texts I read when it's raining. It's a big folder." },
      { tone: 'risque', t: "Wish you were here, not sleeping with me.", r: "I've put the phone under the pillow. It's still glowing. I can feel it glowing. Goodnight. Goodnight." },
    ] },
  { id: 'shy-text-week-warm-1-flirty', on: 'week', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Can't sleep. Phone me has taken over. Phone me thinks you're wonderful and wants you to know. Phone me is very forward.",
    opts: [
      { tone: 'cold', t: "Tell phone-you to go to bed.", r: "Phone me has gone. It's just me now. I'm mortified. Goodnight." },
      { tone: 'passive', t: "Phone-you is lovely. So is regular you.", r: "Regular me just read that and had to put the phone down. Phone me is taking a victory lap." },
      { tone: 'flirty', t: "Tell phone-you the feeling is very mutual.", r: "Mutual. Phone me is screaming. Regular me is in a cupboard. Both of us say goodnight." },
      { tone: 'risque', t: "Phone-you can come over and say it in person.", r: "Phone me doesn't have legs. Regular me does, but regular me is hiding. ...Not yet. Oh no." },
    ] },
  // ---- 2: things I didn't say last time --------------------------------------------------------------------------------
  { id: 'shy-text-week-warm-2-cold', on: 'week', stage: 'warm', slot: 2, mood: 'cold',
    say: "Things I didn't say last time, because you seemed far away: 1. I missed you. 2. That's it. That's the list.",
    opts: [
      { tone: 'cold', t: "Short list.", r: "Yes. It's the shortest list I've ever written. It was the hardest." },
      { tone: 'passive', t: "Missed you as well. Just tired.", r: "Tired. That's much better than the thing I'd decided. Thank you for telling me." },
      { tone: 'flirty', t: "Make the next list longer. About me.", r: "Longer. About you. That's not a problem. That's the opposite of a problem." },
    ] },
  { id: 'shy-text-week-warm-2-passive', on: 'week', stage: 'warm', slot: 2, mood: 'passive',
    say: "Unsaid, last time: 1. You looked tired, but nicely. 2. I like your laugh. 3. I didn't want to leave. That's all.",
    opts: [
      { tone: 'cold', t: "Noted.", r: "Okay. Noted is fine. The next list will be shorter. Or silent." },
      { tone: 'passive', t: "Number three's my favourite.", r: "Mine too. It took the longest to type. I kept deleting it. It kept coming back." },
      { tone: 'flirty', t: "Add 4: you'll stay longer next time.", r: "Four. Okay. I've added it. In capitals. It's the only item in capitals." },
    ] },
  { id: 'shy-text-week-warm-2-flirty', on: 'week', stage: 'warm', slot: 2, mood: 'flirty',
    say: "Things I didn't say last time: 1. I wanted to hold your hand. 2. I nearly did. 3. Next time I will. Sorry. Not sorry.",
    opts: [
      { tone: 'cold', t: "Bit forward.", r: "Yes. Forward. Phone me again. I'll have words with phone me." },
      { tone: 'passive', t: "I'd have let you.", r: "You would? Then I'll try. In person. Slowly. If you see me reaching, don't look." },
      { tone: 'flirty', t: "Next time I'll get there first.", r: "That's not fair. It was my idea. ...I don't mind. Get there first. I'll pretend I'm surprised." },
      { tone: 'risque', t: "Number 4: I'll want more than your hand.", r: "I've read that four times and gone red at a bus stop. Not yet. No. Not— I'm getting off the bus." },
    ] },
  // ---- 3: a quiet date - dawn (deep) ---------------------------------------------------------------------------------------
  { id: 'shy-text-week-warm-3-cold', on: 'week', stage: 'warm', slot: 3, mood: 'cold',
    say: "I had an idea, before last time. A dawn walk, somewhere quiet. I still have the idea. If you still want ideas from me.",
    opts: [
      { tone: 'cold', t: "Ideas are fine. Just ask.", r: "Okay. Asking. Would you like to walk at dawn? Somewhere quiet? Saying no is fine.", opts: [
        { tone: 'cold', t: "Not this week.", r: "Not this week. Okay. I'll keep the idea. Ideas keep." },
        { tone: 'passive', t: "Yes. That sounds lovely.", r: "Yes. Okay. Sunday? Six? There's a hill where the sky gets very big. I'll bring tea." },
        { tone: 'flirty', t: "Yes. And I'll bring breakfast.", r: "Breakfast. At dawn. On a hill. ...That's a whole date. You've made it a whole date." },
      ] },
      { tone: 'passive', t: "I always want ideas from you.", r: "Always? Then: dawn, a hill, two cups of tea. Sunday. Too early?", opts: [
        { tone: 'cold', t: "Bit early for me.", r: "Yes. It's early. I'll find a later idea. Afternoons are fine. I'll be fine." },
        { tone: 'passive', t: "Not too early. Sounds perfect.", r: "Perfect. I'll text you the hill. It's very easy to find. It's the only quiet one." },
        { tone: 'flirty', t: "Early's fine if you're there.", r: "I'll be there first. I'm always first. I'll be the person on the hill, smiling at nothing." },
      ] },
      { tone: 'flirty', t: "Your ideas are my favourite ideas.", r: "Then here's my best one: dawn, a hill, tea, you. Sunday. That's the whole idea.", opts: [
        { tone: 'cold', t: "Let me check my schedule.", r: "Of course. Check. I'll be here. Holding the idea carefully." },
        { tone: 'passive', t: "I'm in. What should I bring?", r: "Just you. And a coat. The hill is windy. I'll bring the rest. Including the nerves." },
        { tone: 'flirty', t: "I'll bring a reason for you to blush.", r: "You always bring one. You are one. ...Sorry. That was quite a lot. I'll see you at dawn." },
      ] },
    ] },
  { id: 'shy-text-week-warm-3-passive', on: 'week', stage: 'warm', slot: 3, mood: 'passive',
    say: "Proposal: Sunday, dawn, the old pier. Nobody's there. The sky does a thing. I'll bring tea. You bring you. Too early?",
    opts: [
      { tone: 'cold', t: "Dawn? That's very early.", r: "It is. I know. Dawn is a lot to ask. Most people hate it.", opts: [
        { tone: 'cold', t: "I'll pass.", r: "That's fine. I'll watch it for both of us. I'll report back. Briefly." },
        { tone: 'passive', t: "I'll set three alarms. For you.", r: "Three alarms. That's devotion. Okay. Sunday. I'll be the one with two cups." },
        { tone: 'flirty', t: "For you, I'd get up at four.", r: "Nobody's ever got up at four for me. I'll make the tea perfect. Not too hot. For once." },
      ] },
      { tone: 'passive', t: "Not too early. I'll be there.", r: "You will? Wear something warm. Dawn is cold and very honest.", opts: [
        { tone: 'cold', t: "Don't fuss.", r: "Sorry. No fussing. ...Wear a jumper, though. Last fuss." },
        { tone: 'passive', t: "What does the sky do?", r: "It goes from grey to gold so slowly you can't see it happen. And then it's just... morning. My favourite." },
        { tone: 'flirty', t: "I'll bring a blanket to share.", r: "To share. On the pier. ...That's a lot of sharing for dawn. I'm in. I'm very in." },
      ] },
      { tone: 'flirty', t: "Me, you and a sunrise? That's a date.", r: "A date. You typed 'date'. I'm going to need to go for a walk. Now. Not at dawn.", opts: [
        { tone: 'cold', t: "Okay, maybe not a date.", r: "Not a date. A walk with two people and some tea. ...It felt like a date for a second." },
        { tone: 'passive', t: "It's a date. What time?", r: "Six. Sunrise is six twelve. I've checked. Three times. Bring your sense of humour." },
        { tone: 'flirty', t: "A date. I'll hold your hand when the sun comes up.", r: "I'm going to watch the sky and feel your hand. That's the plan now. Entirely." },
      ] },
    ] },
  { id: 'shy-text-week-warm-3-flirty', on: 'week', stage: 'warm', slot: 3, mood: 'flirty',
    say: "Come and watch the sunrise with me. Sunday. It's the quietest hour there is, and I want to spend it next to you.",
    opts: [
      { tone: 'cold', t: "Sunrise is a bit early for me.", r: "Oh. Okay. That's fine. Sunsets are similar. Just backwards.", opts: [
        { tone: 'cold', t: "Another week, maybe.", r: "Another week. The sun does it every day. It'll wait. So will I." },
        { tone: 'passive', t: "Sunset, then. Same idea.", r: "Sunset. Same idea, other end. I'll bring the tea. You bring the jumper. Saturday?" },
        { tone: 'flirty', t: "For you, I'll do sunrise.", r: "You'll do sunrise. For me. ...I'll make it worth it. I'll make the sky behave." },
      ] },
      { tone: 'passive', t: "Sunday. I'll be there.", r: "You'll be there. I'll be there earlier. Practising not being nervous. It won't work.", opts: [
        { tone: 'cold', t: "No need to be nervous.", r: "No. There isn't. I will be anyway. It's my default. Sorry." },
        { tone: 'passive', t: "Where shall I meet you?", r: "The end of the old pier. There's a bench. It's my bench. I'll share it. I've never shared it." },
        { tone: 'flirty', t: "Be nervous. I'll be holding your hand anyway.", r: "Holding my hand. At sunrise. ...That's going to be the best sunrise. The sun doesn't stand a chance." },
      ] },
      { tone: 'flirty', t: "The quietest hour, next to you. Yes.", r: "Next to me. The sun's going to be very jealous. ...That's the silliest thing I've typed.", opts: [
        { tone: 'cold', t: "It is pretty silly.", r: "Yes. ...I'm keeping it anyway. Sunday. Six." },
        { tone: 'passive', t: "It's lovely. Sunday, then.", r: "Sunday. I'll text you the place. And the time. And probably the weather. Sorry in advance." },
        { tone: 'flirty', t: "I'll make the sun jealous. Promise.", r: "How? No. Don't tell me. Surprise me. At dawn. In front of the sun." },
        { tone: 'risque', t: "And after the sunrise, breakfast at yours?", r: "At mine? After? ...I can't do after yet. I'm still planning during. Ask me at sunrise." },
      ] },
    ] },
  // ---- 4: mortified about something said in person (generic) ---------------------------------------------------------------
  { id: 'shy-text-week-warm-4-cold', on: 'week', stage: 'warm', slot: 4, mood: 'cold',
    say: "I think I said something wrong last time. I don't know what. I've replayed it about forty times. Sorry, whatever it was.",
    opts: [
      { tone: 'cold', t: "Nothing wrong. Drop it.", r: "Okay. Dropped. ...Thank you for saying it was nothing. That helps more than you'd think." },
      { tone: 'passive', t: "You didn't say anything wrong. I was worn out.", r: "Tired. Okay. I'll tell my brain. My brain had made it into a whole film." },
      { tone: 'flirty', t: "Only thing wrong was you left too early.", r: "Too early. Then I'll leave later. Next time. Much later. If you'll let me." },
    ] },
  { id: 'shy-text-week-warm-4-passive', on: 'week', stage: 'warm', slot: 4, mood: 'passive',
    say: "I'm fairly sure I said 'you too' to something that didn't need it, last time. I've replayed it for two days. Sorry.",
    opts: [
      { tone: 'cold', t: "Didn't notice.", r: "Oh. Good. That's good. I'll stop replaying it, then. Maybe." },
      { tone: 'passive', t: "It was sweet. Stop worrying.", r: "Sweet. I'll file it under sweet instead of under 'disasters'. That's a much nicer folder." },
      { tone: 'flirty', t: "You can say 'you too' to me any time.", r: "Any time? Even when it doesn't make sense? ...You too. There. I did it in writing. On purpose." },
    ] },
  { id: 'shy-text-week-warm-4-flirty', on: 'week', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Did I actually call you 'lovely' out loud last time? To your face? I've been hiding under a cushion since.",
    opts: [
      { tone: 'cold', t: "You did. Bit over the top.", r: "Yes. I thought so. I'm going to stay under the cushion. It's nice here. Goodbye." },
      { tone: 'passive', t: "You did. And it was lovely.", r: "It was lovely to say lovely? That's very circular. I'm still under the cushion, but smiling." },
      { tone: 'flirty', t: "You did. Say it again next time.", r: "Again? On purpose? ...I'll practise. On the cushion. The cushion is going to hear a lot." },
      { tone: 'risque', t: "Say it again, closer. I won't mind.", r: "Closer. I can't type closer. I can't think closer. I'm going to need a new cushion. A bigger one." },
    ] },
  // ---- 5: flirting in writing - 'in person I would just nod' -----------------------------------------------------------------
  { id: 'shy-text-week-warm-5-cold', on: 'week', stage: 'warm', slot: 5, mood: 'cold',
    say: "I wasn't going to text after last time. But in writing I'm braver, so: I like talking to you. In person I'd only nod.",
    opts: [
      { tone: 'cold', t: "Fine by me.", r: "Okay. Good. I'll nod, then. Quietly. From a distance." },
      { tone: 'passive', t: "I like talking to you too. Nods included.", r: "Nods included. That's very generous. I'll bring my best ones. Thank you for still talking to me." },
      { tone: 'flirty', t: "I like your nods. They're very expressive.", r: "Expressive. My nods. Nobody's ever studied them before. ...What do they say? Don't answer." },
    ] },
  { id: 'shy-text-week-warm-5-passive', on: 'week', stage: 'warm', slot: 5, mood: 'passive',
    say: "In writing, I can tell you that you have a very good smile. In person, I would just nod at you. Possibly twice.",
    opts: [
      { tone: 'cold', t: "Nod's fine.", r: "Okay. Nodding. In person. I'll do my best nod. It's quite a good nod." },
      { tone: 'passive', t: "I'll take the nod. And the text.", r: "You get both. The nod and the text. It's a two-part system. Like me." },
      { tone: 'flirty', t: "Two nods means you like me.", r: "That's exactly what it means. I didn't know you knew the code. Nobody knows the code." },
      { tone: 'risque', t: "Nod at me when you want to be kissed.", r: "I'd never stop nodding. I'd look like a toy on a dashboard. ...Not yet. I'm not ready to nod." },
    ] },
  { id: 'shy-text-week-warm-5-flirty', on: 'week', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Writing this because in person I'd only nod: I think about kissing you more than is reasonable. Sorry. Not sorry.",
    opts: [
      { tone: 'cold', t: "That's... a lot to put in writing.", r: "Yes. Writing is permanent. I've realised. Too late. Goodnight forever." },
      { tone: 'passive', t: "That's not unreasonable. I think about it too.", r: "You do? Then it's reasonable. Two reasonable people, thinking. I'm going to lie on the floor." },
      { tone: 'flirty', t: "Then stop nodding and do it.", r: "Do it. In person. ...I'll try. If I nod at you twice, that's me trying. Be ready." },
      { tone: 'risque', t: "Come over and stop being reasonable.", r: "I'm in pyjamas with a cat on me. That's my excuse. It's a good one. Not yet." },
    ] },
  // ---- 6: 'I miss you' for the first time (deep) -------------------------------------------------------------------------
  { id: 'shy-text-week-warm-6-cold', on: 'week', stage: 'warm', slot: 6, mood: 'cold',
    say: "Things were strange last time. But I've typed this seven times, so I'm sending it: I miss you. That's all. Sorry.",
    opts: [
      { tone: 'cold', t: "Right. Okay.", r: "Okay. That's fine. I'll stop typing it. It's been sent. It's out there.", opts: [
        { tone: 'cold', t: "It's out there.", r: "Yes. ...I'll go and be somewhere else now. Sorry." },
        { tone: 'passive', t: "Sorry. That was cold. I miss you too.", r: "You do? Okay. That's all I wanted. That's the whole reason for the seven drafts." },
        { tone: 'flirty', t: "Actually, I miss you more.", r: "More? That's not possible. I checked. ...But I'll let you think so. It's nice." },
      ] },
      { tone: 'passive', t: "Missing you too. Last time was on me.", r: "Nobody's fault. Some days are just quiet. I'm glad you miss me. I'm very glad.", opts: [
        { tone: 'cold', t: "Don't make it a whole thing.", r: "Not a whole thing. A small, warm thing. Goodnight." },
        { tone: 'passive', t: "Let's fix it soon. In person.", r: "In person. I'll nod a lot. You'll know what it means. It means I missed you." },
        { tone: 'flirty', t: "Next time I'll show you how much.", r: "Show me. I'll try to survive that. I'm going to go and lie down. Preemptively." },
      ] },
      { tone: 'flirty', t: "Seven drafts? I'm honoured. Same here.", r: "You're honoured. I'm mortified. We're both something. I miss you. Eight. That's eight.", opts: [
        { tone: 'cold', t: "That's plenty of drafts.", r: "Yes. Plenty. I'll stop drafting. ...I won't. But I'll stop sending." },
        { tone: 'passive', t: "Send me draft one.", r: "Draft one was just 'hi'. Then I panicked for an hour. Draft seven is the brave one." },
        { tone: 'flirty', t: "Send all eight. I want every version.", r: "Even the one with a poem? ...There's no poem. There's a poem. I'm not sending the poem." },
      ] },
    ] },
  { id: 'shy-text-week-warm-6-passive', on: 'week', stage: 'warm', slot: 6, mood: 'passive',
    say: "I miss you. I've typed and deleted that six times. This is the seventh. I'm leaving it. Sorry, that was a lot.",
    opts: [
      { tone: 'cold', t: "We'll see each other soon.", r: "Yes. Soon. That's true. ...I still miss you now, though. Sorry.", opts: [
        { tone: 'cold', t: "Soon enough.", r: "Soon enough. Okay. I'll count. Quietly." },
        { tone: 'passive', t: "Soon, I promise. I miss you back.", r: "You miss me too. I'll read that twelve times and then do something useful. Maybe." },
        { tone: 'flirty', t: "I miss you more. I'm counting days.", r: "You're counting? I'm counting hours. That's worse. Don't tell anyone I said that." },
      ] },
      { tone: 'passive', t: "Missing you as well. A lot.", r: "A lot. You typed 'a lot'. I'm going to stop typing before I say something embarrassing.", opts: [
        { tone: 'cold', t: "Sensible.", r: "Yes. Sensible. Goodnight. I miss you. Sorry. Okay." },
        { tone: 'passive', t: "Say the embarrassing thing.", r: "The embarrassing thing is that I reread your texts before bed. All of them. Ignore that." },
        { tone: 'flirty', t: "Embarrass yourself. I'll love it.", r: "I'd like to fall asleep on the phone with you. Just breathing. That's it. Ignore that." },
      ] },
      { tone: 'flirty', t: "Come here and I'll fix that.", r: "I can't. I've got a cat on me. And work. And nerves. ...I wish I could. That's the truth.", opts: [
        { tone: 'cold', t: "Your loss.", r: "Yes. My loss. ...I'll survive it. Barely." },
        { tone: 'passive', t: "Then I'll come to you soon.", r: "You'll come to me. I'll tidy. I'll tidy the whole flat. I'll tidy the cat." },
        { tone: 'flirty', t: "Then call me. I want to hear you say it.", r: "Out loud? ...I'll call. I won't say it. I'll breathe at you. You'll know." },
        { tone: 'risque', t: "Leave the cat. Come over. I'll keep you warm.", r: "I've just dropped the phone on Pickle. Pickle is furious. I'm— not yet. Not tonight. Soon." },
      ] },
    ] },
  { id: 'shy-text-week-warm-6-flirty', on: 'week', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I miss you. Phone me said it first, but regular me agrees. Regular me is blushing at a kettle. Come back soon.",
    opts: [
      { tone: 'cold', t: "A kettle? Get some rest.", r: "Yes. Rest. I'll leave the kettle alone. It's been through enough.", opts: [
        { tone: 'cold', t: "Night.", r: "Goodnight. ...Sorry about the kettle." },
        { tone: 'passive', t: "Sorry. Missing you back. Sleep well.", r: "The kettle and I are both very pleased to hear it. Goodnight." },
        { tone: 'flirty', t: "Tell the kettle I miss you more.", r: "I've told the kettle. The kettle has boiled. It's very excited. ...So am I." },
      ] },
      { tone: 'passive', t: "Come back soon? I'll be here.", r: "You'll be here. I like that you'll be here. I'll come back soon. I'll come back early.", opts: [
        { tone: 'cold', t: "Not too soon. Busy week.", r: "Not too soon. I'll pace myself. I'll miss you at a sensible rate." },
        { tone: 'passive', t: "Early's good. Early's perfect.", r: "Early it is. I'll be early and pretend I wasn't. You'll know. You always know." },
        { tone: 'flirty', t: "Missing you. Come back now.", r: "Now? I'm in pyjamas. With a cat. ...I'm considering it. I'm seriously considering it." },
      ] },
      { tone: 'flirty', t: "Miss you both. Phone you and regular you.", r: "Both of us. We're both very pleased. Regular me is now blushing at the toaster as well.", opts: [
        { tone: 'cold', t: "Maybe step away from the appliances.", r: "Stepping away. ...They'll miss me. Everyone's missing someone tonight." },
        { tone: 'passive', t: "Come back soon. Both of you.", r: "Both of us will. Phone me will text. Regular me will turn up. Red. With biscuits." },
        { tone: 'flirty', t: "Tell regular you I'm going to kiss them hello.", r: "Regular me read that and lay down on the kitchen floor. Phone me says: yes please." },
        { tone: 'risque', t: "Tell them both to come over. Now.", r: "Both of us. Now. ...We've had a meeting. We're too scared. We'll be brave on Saturday." },
      ] },
    ] },

  // ==== CLOSE ============================================================================================================
  // ---- 1: good morning ------------------------------------------------------------------------------------------------------
  { id: 'shy-text-week-close-1-cold', on: 'week', stage: 'close', slot: 1, mood: 'cold',
    say: "Good morning. I wasn't sure I should, after last time. But it's morning, and I always text you in the morning. So.",
    opts: [
      { tone: 'cold', t: "Morning.", r: "Morning. ...That's all? That's fine. I'll take morning. It's a start." },
      { tone: 'passive', t: "Glad you did. Good morning to you.", r: "You're glad. Then I'll keep doing it. Every morning. Even the strange ones." },
      { tone: 'flirty', t: "Never stop. Your good mornings make my day.", r: "Make your day? I'll make them better. I'll add a weather report. And a Pickle report." },
      { tone: 'risque', t: "Good morning. I'd rather be saying it next to you.", r: "Next to me. ...Okay. I'm not sore any more. I'm just thinking about that. All day, probably." },
    ] },
  { id: 'shy-text-week-close-1-passive', on: 'week', stage: 'close', slot: 1, mood: 'passive',
    say: "Good morning. Pickle knocked my tea over, the sky's grey, and I'm thinking about you. Three things. One good.",
    opts: [
      { tone: 'cold', t: "Morning. Busy day.", r: "Of course. Go. Be busy. I'll be here, mopping tea. Quietly." },
      { tone: 'passive', t: "Morning. Which one's the good one?", r: "Not the tea. Not the sky. ...You're the good one. You knew that. I just like typing it." },
      { tone: 'flirty', t: "Morning. I'd make you a fresh tea in bed.", r: "In bed. With tea. And you. ...I'm going to stare at the ceiling for a bit. Good morning indeed." },
      { tone: 'risque', t: "Morning. Wish I'd woken up next to you.", r: "So do I. Very much. Pickle would have to sleep elsewhere. Pickle would protest. Let Pickle protest." },
    ] },
  { id: 'shy-text-week-close-1-flirty', on: 'week', stage: 'close', slot: 1, mood: 'flirty',
    say: "Good morning. I woke up thinking about you, which is becoming a habit. Pickle is jealous. Pickle can deal with it.",
    opts: [
      { tone: 'cold', t: "Habits can be broken.", r: "Oh. Yes. They can. ...I'll try. I don't want to. But I'll try." },
      { tone: 'passive', t: "Good morning. I thought about you too.", r: "You did? First thing? Before coffee? That's serious. That's very serious. I'm very pleased." },
      { tone: 'flirty', t: "Tell Pickle I'm worth it.", r: "I told Pickle. Pickle walked off. That means Pickle agrees. Pickle can't show feelings either." },
      { tone: 'risque', t: "Stay in bed and think about me there.", r: "I'm still in bed. I never left. ...I'm thinking about you here. Now I can't get up. Thanks for that." },
    ] },
  // ---- 2: missing you on your way to {track} --------------------------------------------------------------------------------
  { id: 'shy-text-week-close-2-cold', on: 'week', stage: 'close', slot: 2, mood: 'cold',
    say: "I know you're busy getting to {track}. I won't make a fuss. I just miss you already. Safe travels. That's all.",
    opts: [
      { tone: 'cold', t: "Will do.", r: "Okay. Good. ...Text when you land. If you want. No obligation." },
      { tone: 'passive', t: "No fuss needed. Miss you already.", r: "You miss me already. That makes the fuss go away. Mostly. Safe travels. Really." },
      { tone: 'flirty', t: "Fuss all you like. I like being missed by you.", r: "Then I'll fuss. Quietly. With a countdown. And your photo on the fridge. Pickle disapproves." },
    ] },
  { id: 'shy-text-week-close-2-passive', on: 'week', stage: 'close', slot: 2, mood: 'passive',
    say: "You're on your way to {track} and I miss you already. I've made a countdown. It's embarrassing. It's very accurate.",
    opts: [
      { tone: 'cold', t: "It's only a few days.", r: "I know. A few days. It's fine. The countdown says so. It's very sensible." },
      { tone: 'passive', t: "Send me the countdown. I'll count too.", r: "Four days, nine hours. You count down from there. We'll meet at zero." },
      { tone: 'flirty', t: "I miss you already too. Keep the countdown.", r: "I'll keep it. I'll cross off hours. I'm aware that's unhinged. Doing it regardless." },
    ] },
  { id: 'shy-text-week-close-2-flirty', on: 'week', stage: 'close', slot: 2, mood: 'flirty',
    say: "You're off to {track}. I've put your jumper on. It doesn't smell of you enough. Come back and fix it.",
    opts: [
      { tone: 'cold', t: "It's just a jumper.", r: "Yes. Just a jumper. ...I'm still wearing it, though." },
      { tone: 'passive', t: "Keep it on. I'll be back soon.", r: "Soon. I'll keep it on until soon. It might get washed. It might not." },
      { tone: 'flirty', t: "I'll fix it. Thoroughly. When I'm back.", r: "Thoroughly. I'm going to think about that all week, in your jumper, like a fool." },
      { tone: 'risque', t: "Keep it warm. I'll be back to claim it. And you.", r: "And me. Okay. I'm in a supermarket. I've gone red in the cereal aisle. Claim away." },
    ] },
  // ---- 3: jealous of a photo -------------------------------------------------------------------------------------------------
  { id: 'shy-text-week-close-3-cold', on: 'week', stage: 'close', slot: 3, mood: 'cold',
    say: "I saw a photo. You and someone. I won't be weird about it. After last time. I'm being normal. This is me, normal.",
    opts: [
      { tone: 'cold', t: "It's nothing.", r: "Nothing. Okay. I knew. Normal me knew. ...Thank you." },
      { tone: 'passive', t: "You can be weird. It was just a photo. I'm yours.", r: "Yours. Okay. Weird me feels much better. Normal me is relieved. We're all fine now." },
      { tone: 'flirty', t: "Normal you is adorable. Jealous you too.", r: "Both adorable. That's a relief. I was worried one of us had to go." },
    ] },
  { id: 'shy-text-week-close-3-passive', on: 'week', stage: 'close', slot: 3, mood: 'passive',
    say: "Saw a photo of you with someone very glamorous. You looked happy. I'm glad you're happy. Also a little jealous. Sorry.",
    opts: [
      { tone: 'cold', t: "It's work. Nothing to read into.", r: "No. I won't. I didn't. ...A little. I'm reading into it a little. I'll stop." },
      { tone: 'passive', t: "That was a sponsor thing. Nothing to worry about.", r: "Nothing. I knew. I needed it in writing, that's all. Thank you for not laughing at me." },
      { tone: 'flirty', t: "You're cute jealous. And the only one I want.", r: "The only one. That's going in the folder. The big folder. Top of the pile." },
      { tone: 'risque', t: "Let me show you who I'd rather be with. In person.", r: "In person. Show me. ...I'll stop being jealous at about the front door." },
    ] },
  { id: 'shy-text-week-close-3-flirty', on: 'week', stage: 'close', slot: 3, mood: 'flirty',
    say: "Saw a photo of you with someone very shiny. I'm jealous. Quietly. It's my new hobby. Tell me I'm the shiniest.",
    opts: [
      { tone: 'cold', t: "Not everything's about you.", r: "No. You're right. Sorry. I'll find a different hobby." },
      { tone: 'passive', t: "You're the shiniest. By miles.", r: "By miles. That's a car thing. You've measured. Thank you. I'm very shiny now." },
      { tone: 'flirty', t: "Shiniest. And the only one I go home to.", r: "Go home to. I'll be home. Glowing. Unhelpfully. Pickle will need sunglasses." },
      { tone: 'risque', t: "Shiniest. Let me prove it when I'm back.", r: "Prove it. I'll keep a list of the ways. ...A very detailed list. Hurry back." },
    ] },
  // ---- 4: late at night - 'ignore that... actually, don't' -------------------------------------------------------------
  { id: 'shy-text-week-close-4-cold', on: 'week', stage: 'close', slot: 4, mood: 'cold',
    say: "It's late. I'm still a bit sore about last time. But I miss you. Your arms, specifically. Ignore that. No, don't.",
    opts: [
      { tone: 'cold', t: "We'll talk tomorrow.", r: "Tomorrow. Okay. I'll be less sore tomorrow. Probably. Goodnight." },
      { tone: 'passive', t: "Sorry about last time. Missing you like mad.", r: "Thank you. That helps a lot. I'm less sore. I still miss your arms." },
      { tone: 'flirty', t: "Not ignoring it. My arms miss you.", r: "Your arms miss me. Good. Tell them I'll be back. I'll be back for both of them." },
      { tone: 'risque', t: "Come over. I'll apologise properly.", r: "Properly. ...That's a very good apology. In theory. I'm going to need it in practice." },
    ] },
  { id: 'shy-text-week-close-4-passive', on: 'week', stage: 'close', slot: 4, mood: 'passive',
    say: "It's late and I keep thinking about the way you kiss me. Ignore that. ...Actually, don't ignore that.",
    opts: [
      { tone: 'cold', t: "Go to sleep.", r: "Yes. Okay. Sleeping. ...Not ignoring it, though. Goodnight." },
      { tone: 'passive', t: "Not ignoring it. Same here, constantly.", r: "You do? Then we're both awake thinking. That's very inefficient. Nice, though." },
      { tone: 'flirty', t: "Come over and I'll remind you how it goes.", r: "Remind me. ...I remember perfectly. That's the problem. I'll come over. Not now. Very soon." },
      { tone: 'risque', t: "Come over. I'll make sure you don't sleep at all.", r: "I'm putting shoes on. I'm not putting shoes on. I'm thinking about shoes. Very seriously." },
    ] },
  { id: 'shy-text-week-close-4-flirty', on: 'week', stage: 'close', slot: 4, mood: 'flirty',
    say: "Can't sleep. Thinking about you in quite a lot of detail. I'm not going to type the detail. You can guess. Goodnight.",
    opts: [
      { tone: 'cold', t: "Sleep, you.", r: "Sleeping. Trying. ...It's your fault I can't." },
      { tone: 'passive', t: "I can guess. I'm guessing right now.", r: "Stop guessing. No. Keep guessing. I'm under the duvet. I've gone hot. That's the duvet." },
      { tone: 'flirty', t: "Type one detail. Just one.", r: "One. ...Your hand on the back of my neck. That's the tamest one. That's the only one I'm typing." },
      { tone: 'risque', t: "Don't type it. Come over and show me.", r: "Show you. ...I'm coming over. I'm actually coming over. I've never done this. Unlock the door." },
    ] },
  // ---- 5: a shelf for your things -----------------------------------------------------------------------------------------
  { id: 'shy-text-week-close-5-cold', on: 'week', stage: 'close', slot: 5, mood: 'cold',
    say: "I'd cleared a shelf. For your things. Before last time. It's still clear. I don't know if that's sad or hopeful. Both.",
    opts: [
      { tone: 'cold', t: "Leave it for now.", r: "Okay. For now. It'll stay clear. Shelves are patient. So am I." },
      { tone: 'passive', t: "Hopeful. Definitely hopeful. I'll bring things.", r: "Hopeful. I'll stop looking at it sadly. I'll look at it hopefully. It's a nice shelf." },
      { tone: 'flirty', t: "I'll fill it this weekend. And stay.", r: "And stay. The shelf is thrilled. I'm thrilled. Pickle is suspicious." },
    ] },
  { id: 'shy-text-week-close-5-passive', on: 'week', stage: 'close', slot: 5, mood: 'passive',
    say: "I've cleared a shelf in my bathroom. For your things. If you want to leave things. No pressure. Some. A shelf's worth.",
    opts: [
      { tone: 'cold', t: "That's a big step.", r: "Yes. It's a shelf-sized step. I'll put my plants back on it. It's fine." },
      { tone: 'passive', t: "I'd love a shelf. Thank you.", r: "You're welcome. It's the middle one. The good one. I've dusted it. Twice." },
      { tone: 'flirty', t: "A shelf today, a whole flat tomorrow?", r: "One shelf at a time. ...But yes. Probably. I'm already measuring things." },
    ] },
  { id: 'shy-text-week-close-5-flirty', on: 'week', stage: 'close', slot: 5, mood: 'flirty',
    say: "I've emptied a whole drawer for you. Pickle has already slept in it. I've evicted Pickle. The drawer is yours.",
    opts: [
      { tone: 'cold', t: "A drawer's a lot.", r: "Yes. A drawer is a lot. I'll give it back to Pickle. Pickle will be delighted." },
      { tone: 'passive', t: "Thank you. Tell Pickle sorry.", r: "I told Pickle. Pickle doesn't accept apologies. Pickle accepts sardines. I'll handle it." },
      { tone: 'flirty', t: "A drawer at yours means I'm staying over more.", r: "That's the idea. The entire idea. The drawer is a very obvious hint. I'm not subtle in writing." },
      { tone: 'risque', t: "I'll fill it with things I only need at night.", r: "Only at night. ...Okay. I'm going to stop thinking about the drawer. I'm going to think about it a lot." },
    ] },
  // ---- 6: the longest text, not sorry (deep) -------------------------------------------------------------------------------
  { id: 'shy-text-week-close-6-cold', on: 'week', stage: 'close', slot: 6, mood: 'cold',
    say: "I wrote you a very long text last night. About last time. I deleted it. The short version: I'm still here. Not sorry.",
    opts: [
      { tone: 'cold', t: "Got it.", r: "Got it. Okay. Short version received. ...I'll keep the long one.", opts: [
        { tone: 'cold', t: "That works.", r: "Yes. ...It works. Goodnight." },
        { tone: 'passive', t: "Sorry. I'm still here too. Send the long one.", r: "It's mostly about how I missed you. And a paragraph about Pickle. Brace yourself." },
        { tone: 'flirty', t: "Here too. And I'm yours.", r: "Yours. That's the long version and the short version. You did both in four words." },
      ] },
      { tone: 'passive', t: "Glad you're still here. Last time's on me.", r: "It's fine. It wasn't fine. It's fine now. That's what the long text said, roughly.", opts: [
        { tone: 'cold', t: "Let's move on.", r: "Moving on. Okay. ...I'm good at moving on quietly. I'll be quiet." },
        { tone: 'passive', t: "Tell me the long version when I see you.", r: "In person? It would take an hour. With pauses. ...You'd wait, though. You always wait." },
        { tone: 'flirty', t: "I'll make it up to you properly.", r: "Properly. I'll hold you to properly. I'll write it on the shelf. In pen." },
        { tone: 'risque', t: "Let me make up for it. All night.", r: "All night. That's a very long apology. I accept. In advance. I accept all of it." },
      ] },
      { tone: 'flirty', t: "Still here and not sorry. My favourite combination.", r: "Mine too. It's new. I used to be gone and sorry. You changed the setting.", opts: [
        { tone: 'cold', t: "Don't get comfortable.", r: "I won't get used to it. ...I'll get a little bit used to it." },
        { tone: 'passive', t: "Stay not sorry. It suits you.", r: "I'm going to get 'not sorry' on a badge. A small badge. On the inside of a coat." },
        { tone: 'flirty', t: "Come over and be not sorry at me.", r: "At you. In person. ...I'll be very not sorry. Unapologetic. I'll be bold. You'll see." },
      ] },
    ] },
  { id: 'shy-text-week-close-6-passive', on: 'week', stage: 'close', slot: 6, mood: 'passive',
    say: "I wrote you the longest text I've ever written, then deleted it, because it all came down to: you make me brave.",
    opts: [
      { tone: 'cold', t: "That's nice.", r: "Nice. Okay. It's a bit more than nice. But nice is fine.", opts: [
        { tone: 'cold', t: "Bit late for this.", r: "It is late. Yes. I'll go to sleep. Brave, but asleep." },
        { tone: 'passive', t: "Sorry. It's more than nice. Thank you.", r: "Thank you for hearing it. It was a lot easier typed. Most things are." },
        { tone: 'flirty', t: "More than nice. You're more than nice.", r: "More than nice. I'll take that. And I'll take you. Both. Goodnight." },
      ] },
      { tone: 'passive', t: "You make me brave too, you know.", r: "I do? How? I'm the one who hides behind things. Name one thing.", opts: [
        { tone: 'cold', t: "Never mind.", r: "Okay. ...I'll guess. I'll guess all night." },
        { tone: 'passive', t: "I say what I feel with you. Nobody else.", r: "Neither do I. Not with anyone else. Two people who only really talk to each other. That's perfect." },
        { tone: 'flirty', t: "I let someone see me nervous. That's you.", r: "You get nervous? With me? ...That I make you nervous is the nicest thing. I'm keeping that." },
      ] },
      { tone: 'flirty', t: "Send me the long one. I want every word.", r: "It has three semicolons and a list. You'll be bored by paragraph two.", opts: [
        { tone: 'cold', t: "Maybe just the summary, then.", r: "The summary. 'You make me brave.' That's it. That's everything. Goodnight." },
        { tone: 'passive', t: "I won't be bored. Send it.", r: "Okay. Sending. Don't reply straight away. Read it slowly. Then reply. Then I'll hide." },
        { tone: 'flirty', t: "I'll read it in bed. Slowly. Twice.", r: "In bed. Twice. Slowly. ...I need you to stop saying things like that. Or never stop." },
        { tone: 'risque', t: "Read it to me in person. In bed.", r: "Out loud. ...I'd get to paragraph two and you'd interrupt. I know you. I'd let you." },
      ] },
    ] },
  { id: 'shy-text-week-close-6-flirty', on: 'week', stage: 'close', slot: 6, mood: 'flirty',
    say: "I've written you a text that's four screens long. I'm not sending it. The summary: I'm completely yours. Not sorry.",
    opts: [
      { tone: 'cold', t: "Four screens? Glad you didn't send it.", r: "Yes. Me too. Probably. ...The summary still stands.", opts: [
        { tone: 'cold', t: "Fair.", r: "Fair. ...Still yours, though. Even when you're being fair." },
        { tone: 'passive', t: "Sorry. The summary's perfect. I'm yours too.", r: "You're mine too. I'll delete the four screens. They're redundant. You said it in four words." },
        { tone: 'flirty', t: "The summary's perfect. Now come here.", r: "On my way. Bringing the four screens. I'll read you every one. No, I won't. I'll just kiss you." },
      ] },
      { tone: 'passive', t: "Completely yours sounds perfect. I'm yours too.", r: "Completely? Both of us? Then it's settled. It's a contract. Signed in text.", opts: [
        { tone: 'cold', t: "No need for contracts.", r: "No contracts. ...It's still settled, though. In my head." },
        { tone: 'passive', t: "Signed. Sealed. Sent.", r: "Sent. I'm going to look at this every day. It's going in the folder. The folder of everything." },
        { tone: 'flirty', t: "Signed with a kiss when I see you.", r: "A kiss. As a signature. That's very legally binding. I'll witness it. Closely." },
      ] },
      { tone: 'flirty', t: "Send the four screens. I want all of you.", r: "All of me. That's a lot of me. Four screens of me. And a small diagram.", opts: [
        { tone: 'cold', t: "Maybe just the diagram.", r: "The diagram is of a house. With a quiet room. Never mind. It's a lot." },
        { tone: 'passive', t: "I'll read every screen. Twice.", r: "Okay. Sending. Don't laugh at screen three. Screen three is very sincere." },
        { tone: 'flirty', t: "All of you. Every screen. And in person.", r: "In person too. You can have all of me. In writing and out loud. I'll even say it out loud." },
        { tone: 'risque', t: "Send them, then come over and I'll answer each one.", r: "Each one. In person. ...That will take all night. I've accepted that. I'm putting my coat on." },
      ] },
    ] },
];
