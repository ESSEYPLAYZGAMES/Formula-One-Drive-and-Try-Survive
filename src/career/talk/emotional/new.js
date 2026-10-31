// Emotional - in person, stage 'new' (first impressions). Slots 1..9, each in a cold / passive / flirty opening mood.
// Arc: 1 holds breath at starts - 2 the blue notebook - 3 the lighthouse film - 4 Moth the cat - 5 three a.m. questions
// - 6 'too much' - 7 Gran's pressed flowers - 8 what it feels like in the car - 9 your name on every page.
export const DATA = [
  // ------------------------------------------------------------------------------------------------ slot 1: full volume
  { id: 'emotional-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: "Hi. I almost didn't come over... you seemed so far away when we met, and I've replayed it all week. Did I say something wrong?",
    opts: [
      { tone: 'cold', t: "You're reading a lot into one hello.", r: "Maybe I am. I do that. It's just... I felt it land cold, and I can't pretend I didn't. I'm not built that way.", opts: [
        { tone: 'cold', t: "Then stop feeling things at me.", r: "Okay. I'll go. That stung, {me}, and I'd rather tell you than smile through it." },
        { tone: 'passive', t: "Sorry. Race week. I'm wound tight. It wasn't you.", r: "Oh... thank you. I hold my breath at every race start, so wound tight I understand. More than you'd think." },
        { tone: 'flirty', t: "Honestly? I was trying not to look at you too long.", r: "Wait... really? I spent days thinking you didn't like me. My heart just did a whole somersault." },
      ] },
      { tone: 'passive', t: "You didn't. I was in my own head. Hi, properly this time.", r: "Hi, properly. I'm so relieved I could cry. I won't. I might. I cry at most things, fair warning.", opts: [
        { tone: 'cold', t: "Please don't. I'm not great with crying.", r: "Oh. Okay. I'll keep it in. I only wanted you to know who you're talking to. I'll go quiet now." },
        { tone: 'passive', t: "Most things? Like what?", r: "Race starts. All the lights, everyone holding still... I hold my breath every time. It's a lot of feeling for one corner." },
        { tone: 'flirty', t: "Cry all you like. I'll find you a tissue and a better reason.", r: "A better reason? That sounds like a promise. I'm blushing so hard my ears hurt. Keep it, please." },
      ] },
      { tone: 'flirty', t: "Far away? I was saving my best side for our second meeting.", r: "Your best side... okay, I'm smiling. I came over braced for heartbreak and you're flirting with me.", opts: [
        { tone: 'cold', t: "Don't get excited. It's a line I use.", r: "Oh. A line. I'm the kind of person who takes lines to heart, so... that hurt. I'll go and be less excited." },
        { tone: 'passive', t: "Jokes aside, I'm glad you came over.", r: "Me too. I nearly didn't. I'm glad my legs were braver than my heart. Could we talk properly? Some time?" },
        { tone: 'flirty', t: "Is this second meeting going well so far?", r: "So well I want to write it down before I lose a second of it. Is that strange? Say it isn't. Then say more." },
      ] },
    ] },
  { id: 'emotional-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: "Can I confess something? I watch race starts with my hands over my face. Every single one. Is that normal, or is it just me?",
    opts: [
      { tone: 'cold', t: "It's just you. It's a start, not a tragedy.", r: "Oh. I know it's not a tragedy... it just feels like one for about four seconds. Sorry. I'm a lot.", opts: [
        { tone: 'cold', t: "You are, a bit.", r: "Okay... I heard that. I'll take my lot somewhere else. It hurt more than you'd think, for three little words." },
        { tone: 'passive', t: "That was harsh. What do you feel in those four seconds?", r: "Everything. Hope, terror, love for people I've never met... Thank you for asking. Really. Not many do." },
        { tone: 'flirty', t: "Be a lot. I'll hold my breath with you next time.", r: "With me? Oh... that's the nicest thing anyone's said to me in weeks. Months. I've gone all wobbly." },
      ] },
      { tone: 'passive', t: "Normal enough. Most people look away at the first corner.", r: "I can't look away, that's the problem. I watch through my fingers, like a scary film. Do you ever get scared?", opts: [
        { tone: 'cold', t: "No. Fear's for spectators.", r: "Oh. Right. Then I'm very much a spectator. I'll stand over there and be scared all on my own." },
        { tone: 'passive', t: "Before, yes. Once the lights go out, there's no room for it.", r: "No room for it... I love that. I'd have so much room. I'd be full to the roof with fear. And wonder." },
        { tone: 'flirty', t: "Only of the crowd. And of you looking at me like that.", r: "Like what? Oh no, am I staring? I'm staring. You're not supposed to say it out loud. I'll melt." },
      ] },
      { tone: 'flirty', t: "Hands over your face? Shame. It's a good face to watch from.", r: "Oh! I... wasn't ready for that. My whole chest went warm. Say something normal so I can recover.", opts: [
        { tone: 'cold', t: "Fine. Normal: I need to go.", r: "Oh. Okay. That was a fast cooling. I'll keep the warm bit and try to forget the rest. I won't manage." },
        { tone: 'passive', t: "Normal: how long have you followed racing?", r: "Since I was small. I cried when my favourite lost and harder when they won. Nothing's changed. Ask me more?" },
        { tone: 'flirty', t: "Sorry. Normal is hard when you're blushing like that.", r: "You're making it worse! In the best way. I'll give it back one day, when I'm brave. Maybe today. Maybe now." },
      ] },
    ] },
  { id: 'emotional-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "You again. I was hoping. I've smiled since we met and people keep asking why. I say 'nothing'... it's you.",
    opts: [
      { tone: 'cold', t: "That's a lot to put on someone you just met.", r: "I know... I feel things quickly. I'm sorry if it's heavy. I'd rather be honest than careful, usually.", opts: [
        { tone: 'cold', t: "Try careful. For both of us.", r: "Careful. Okay. I'll fold it all back up. That landed hard, and I want you to know it did." },
        { tone: 'passive', t: "No, it's sweet. Just unexpected. Tell me about you.", r: "I hold my breath at every race start and cry at sad songs in shops. That's me, in two sentences. Your turn, someday?" },
        { tone: 'flirty', t: "Heavy's fine. I've got strong arms.", r: "Oh, you're funny too. That's not fair. I came here with one small crush and now it's growing by the minute." },
      ] },
      { tone: 'passive', t: "That's kind. I had a nice time meeting you too.", r: "You did? Good. I worried I talked too much. I always talk too much when my heart's going fast.", opts: [
        { tone: 'cold', t: "You did talk a lot.", r: "Oh... right. I'll try to talk less. I'm not sure I know how, but I'll try. That one stung, {me}." },
        { tone: 'passive', t: "Just the right amount. Tell me something real.", r: "Real... I watch your race starts through my fingers. Every one. Since before we met. Now it'll be worse. Much worse." },
        { tone: 'flirty', t: "Fast, huh? How fast right now?", r: "Faster than your car, probably. Don't laugh! Okay, laugh. It's a good laugh. I'm keeping it forever." },
      ] },
      { tone: 'flirty', t: "Nothing, huh? I've been called worse.", r: "You've been called 'nothing' by someone grinning like a fool. That's the best kind of nothing there is.", opts: [
        { tone: 'cold', t: "Grinning like a fool isn't a great look.", r: "Oh. Okay... I'll put the grin away. I'm not very good at hiding things, but I'll try. It's gone quiet in me now." },
        { tone: 'passive', t: "Fair. What else makes you grin like that?", r: "Thunderstorms. Old letters. The start of a race, before it gets scary. And this. This is on the list now. Hope you don't mind." },
        { tone: 'flirty', t: "Keep grinning. It suits you.", r: "I can't stop now, you've broken it. I'll be grinning at the dentist. All your fault. Thank you." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 2: the notebook
  { id: 'emotional-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "Oh... hi. Sorry, I was writing in my notebook. I write little moments down. I wrote about last time too. It wasn't a happy page.",
    opts: [
      { tone: 'cold', t: "You wrote about me? That's a bit much.", r: "Maybe... but I write everything down. Good things, sad things. I'd rather keep them than lose them.", opts: [
        { tone: 'cold', t: "Leave me out of it from now on.", r: "Okay. I'll close it. That one's going to stay with me a while, {me}. I'm being honest, not dramatic." },
        { tone: 'passive', t: "Fine. What made it a sad page?", r: "You seemed to wish I wasn't there. I've felt that before. It helps to say it out loud, so... thank you." },
        { tone: 'flirty', t: "Then let me give you a happier page.", r: "You'd do that? Okay... I'm uncapping my pen. No pressure. Just a whole blank page waiting for you." },
      ] },
      { tone: 'passive', t: "Not weird. What else goes in it?", r: "Small things. A stranger's laugh, the smell after rain, a kind word. Everything matters to me. Everything.", opts: [
        { tone: 'cold', t: "Sounds exhausting.", r: "It is, sometimes. Feeling everything. I'd hoped you'd get it... it's okay. I'll keep it to myself." },
        { tone: 'passive', t: "That's actually lovely. Do you reread it?", r: "On bad nights. It reminds me the world was kind at least once that week. Usually more than once. It helps." },
        { tone: 'flirty', t: "What would you write about this?", r: "That you didn't laugh at me. That your eyes went soft. That my hands were shaking. Too honest? Probably." },
      ] },
      { tone: 'flirty', t: "I'll be nicer. Then you'll have to write something good about me.", r: "Oh, a bargain. Be nice and I'll write you a whole page. Warning: I'm very wordy when I'm happy.", opts: [
        { tone: 'cold', t: "On second thought, don't bother.", r: "Oh... okay. The page stays blank, then. I wish you hadn't done that the second time. It hurt more." },
        { tone: 'passive', t: "Deal. What do people usually get?", r: "A line, most of them. A page is rare. A whole page means I couldn't stop. You'd be in very good company." },
        { tone: 'flirty', t: "A whole page? Better make it worth your ink.", r: "You're doing it now. My pen's already moving. I'm going to need a second notebook at this rate. Look at me." },
      ] },
    ] },
  { id: 'emotional-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "Don't laugh... I keep a little blue notebook. I write down moments so I don't lose them. You're about to see me use it.",
    opts: [
      { tone: 'cold', t: "I'm not going to be a moment in your diary.", r: "It's not a diary... it's a jar for small good things. But okay. I won't write you down. I'm sad about it.", opts: [
        { tone: 'cold', t: "Good.", r: "Good. Right. That's the shortest word and it hurt the most today. I'll go and put my notebook away." },
        { tone: 'passive', t: "Sorry. That sounded mean. What would you have written?", r: "That you listened like it mattered and didn't notice me noticing. Little things like that. They're my favourite." },
        { tone: 'flirty', t: "Unless it's a very flattering moment.", r: "Every moment I write is flattering. It's a kind notebook. You'd come out glowing. A bit like I am now." },
      ] },
      { tone: 'passive', t: "Go on, then. What's today's moment?", r: "Someone held a door for a stranger in the rain. And now this. You asking. That might be today's moment.", opts: [
        { tone: 'cold', t: "Write the door one. Not me.", r: "Okay... the door one. I'll write it small. I thought we were having a nice time, that's all. I was wrong." },
        { tone: 'passive', t: "How long have you been doing this?", r: "Since I was eleven. Shelves of them now. Some days a whole page, some days one word. Always one feeling, at least." },
        { tone: 'flirty', t: "Me asking is the moment? You're easy to impress.", r: "I'm not, actually. I'm easy to move. That's different. You moved me. There, I said it. I'm going red." },
      ] },
      { tone: 'flirty', t: "What do I have to do to get a whole page?", r: "A whole page? Oh... you're halfway there. You smiled at me like you meant it. That's a paragraph at least.", opts: [
        { tone: 'cold', t: "I didn't mean anything by it.", r: "Oh. Then I'll cross that paragraph out. I'll still remember it, though. I can't cross out remembering." },
        { tone: 'passive', t: "Just a paragraph? Tough critic.", r: "I'm not tough! I'm careful with pages. They're precious to me. You'll get there. You're very nearly there." },
        { tone: 'flirty', t: "Then let me work on the rest of the page.", r: "Please do. Take your time. Or don't. My heart's turning pages faster than I can write them." },
      ] },
    ] },
  { id: 'emotional-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "Hi! I wrote about you last night. In my blue notebook, where I keep the moments I don't want to lose... yours made the list.",
    opts: [
      { tone: 'cold', t: "I'd rather you didn't write about me.", r: "Oh... okay. I didn't mean to make it strange. It's just how I hold on to things. I'll stop.", opts: [
        { tone: 'cold', t: "Thanks. Tear it out.", r: "Tear it out? I can't do that. I'll leave it. But I won't add to it. That really hurt, {me}. I mean it." },
        { tone: 'passive', t: "No, it's fine. I'm just a private person.", r: "I understand. I'll keep you in pencil, then. Faint. Just for me. I'm sorry if I rushed you. I rush." },
        { tone: 'flirty', t: "Unless it's good. Is it good?", r: "It's very good. Embarrassingly good. There's a little drawing of your smile. Oh no. I've said far too much." },
      ] },
      { tone: 'passive', t: "What did you write?", r: "That you're funnier than you let people see. And that I snorted, remembering it later. I wrote that too. For honesty.", opts: [
        { tone: 'cold', t: "Funnier? I wasn't trying to be.", r: "Then it was an accident and I loved it anyway. You're making me feel silly for saying so. I'll stop sharing." },
        { tone: 'passive', t: "You snorted? I missed that.", r: "Lucky you. Not my finest sound. But meeting you was one of my finest days. That's the real line on the page." },
        { tone: 'flirty', t: "Funnier than people see? You see a lot.", r: "I see everything. It's a blessing and a curse. Right now it's a blessing. You're looking at me again. Keep going." },
      ] },
      { tone: 'flirty', t: "I made the list? I'm honoured. Am I near the top?", r: "Top three this month. Just below a perfect sunset and a stranger's dog. You're climbing fast, though.", opts: [
        { tone: 'cold', t: "Below a dog? Forget it, then.", r: "Oh, I was joking... I didn't mean it to sting. The dog was very good, but you were... never mind. Never mind." },
        { tone: 'passive', t: "Ha. Fair. It must have been a great dog.", r: "It wore a tiny raincoat. You'd have cried too. Well, maybe not you. Me. I cried. Obviously. I always do." },
        { tone: 'flirty', t: "Watch me overtake the dog.", r: "Please do. I'll write it down live, like commentary. 'And they're past the dog!' My heart can't take it." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 3: the lighthouse film
  { id: 'emotional-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "Hi. Sorry about my eyes. I watched the lighthouse film again last night, eleventh time. And... last time still feels sore.",
    opts: [
      { tone: 'cold', t: "Crying at a film eleven times sounds like a choice.", r: "It is a choice. I choose to feel it. I'd hoped you'd ask me why, not... that. It's okay. It's fine.", opts: [
        { tone: 'cold', t: "Why would I ask?", r: "Because I'd have asked you. That's all. I'll stop expecting it. That was a cold one, and I felt every bit." },
        { tone: 'passive', t: "Okay, why? What's the film?", r: "A lighthouse keeper lights the lamp every night for a boat that might never come home. And then it does." },
        { tone: 'flirty', t: "Then let me be your twelfth reason. The happy kind.", r: "Oh... that's not fair, after last time. I'm going to forgive you far too quickly. I can already feel it." },
      ] },
      { tone: 'passive', t: "Sorry about last time. What's the lighthouse film?", r: "A keeper lights the lamp every night for one boat. For years. I cry at the same scene every time. Every time.", opts: [
        { tone: 'cold', t: "Sounds slow.", r: "It is slow. Love usually is. I'll stop talking about it. I'm still a bit tender from before, I think." },
        { tone: 'passive', t: "Which scene gets you?", r: "When the boat's light blinks back across the water. Just once. I'm tearing up describing it. Look at me." },
        { tone: 'flirty', t: "I'd watch it with you. And pass the tissues.", r: "With me? I've never let anyone. I go all blotchy. You'd have to promise not to look. Or look. I don't know." },
      ] },
      { tone: 'flirty', t: "Puffy eyes look good on you. Who made you cry? I'll fight them.", r: "A fictional lighthouse keeper. Eleven times. You can't fight them, they're perfect. But... thank you.", opts: [
        { tone: 'cold', t: "Never mind, then. I'm not into sad films.", r: "Oh. Okay. Most people aren't. I thought maybe you were different. I'm sorry for hoping out loud." },
        { tone: 'passive', t: "Eleven times? What makes it worth it?", r: "Someone keeping a light on for someone who might not come back. That's the whole heart of it, really." },
        { tone: 'flirty', t: "I'd keep a light on for you.", r: "You... oh. That's the exact thing. You said the exact thing. I need a moment. Possibly several." },
      ] },
    ] },
  { id: 'emotional-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Can I tell you an embarrassing thing? I've seen the lighthouse film eleven times and I've cried at all eleven.",
    opts: [
      { tone: 'cold', t: "That's not embarrassing, it's just odd.", r: "Oh. Odd. I've been called that. I'd hoped for 'sweet'... I'll take odd and go quietly.", opts: [
        { tone: 'cold', t: "Go quietly, then.", r: "I will. I wanted you to know something true about me. I'm sorry it didn't matter to you. It mattered to me." },
        { tone: 'passive', t: "Okay, okay. What's it about?", r: "A keeper keeps the lamp burning every night for one boat. Years and years. I can't say it without welling up." },
        { tone: 'flirty', t: "Odd's good. Odd's my type, actually.", r: "Your type? Okay... my heart just tripped over itself. Say that again, slower, so I can write it down." },
      ] },
      { tone: 'passive', t: "What happens in it?", r: "A keeper lights the lamp every night for a boat that left. No one thinks it's coming back. The keeper does.", opts: [
        { tone: 'cold', t: "Let me guess, it comes back.", r: "It does. You don't have to sound so tired of it. Some of us need the boat to come back. I do." },
        { tone: 'passive', t: "Does it come back?", r: "I won't tell you. Watch it. Or watch it with me. Either way, bring something to cry into. A sleeve. Mine." },
        { tone: 'flirty', t: "So you're a keep-the-light-on type. Noted.", r: "I am. Hopelessly. Whoever I love gets the lamp, all night, every night. Don't look at me like that. Or do." },
      ] },
      { tone: 'flirty', t: "Eleven? I'd pay to watch you watch it.", r: "Oh no. No one sees me watch it. It's very undignified. There's hiccuping. You'd never look at me the same.", opts: [
        { tone: 'cold', t: "Hiccuping? Yeah, pass.", r: "Okay... I made myself small for a joke and you stepped on it. I felt that, {me}. I really did." },
        { tone: 'passive', t: "What's it actually about?", r: "Keeping a light on for someone who's gone. And being right to. It's about hope, really. I'm a hope person." },
        { tone: 'flirty', t: "I'd look at you exactly the same. Maybe better.", r: "Stop it. Now I'm welling up and there isn't even a lighthouse. You did that with words. Just words." },
      ] },
    ] },
  { id: 'emotional-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "I thought of you last night. I was watching the lighthouse film for the eleventh time, crying, obviously... and there you were.",
    opts: [
      { tone: 'cold', t: "You think of me while you're crying? Comforting.", r: "Not like that! It's a hopeful cry. I'm explaining it badly... and you're not helping. That stung.", opts: [
        { tone: 'cold', t: "I don't need to understand it.", r: "No. You don't. I hoped you'd want to. I'm going to go now. I feel quite silly, actually. And sore." },
        { tone: 'passive', t: "Okay, explain it properly.", r: "There's a keeper who waits, night after night, for one boat. And I thought: you'd be the boat. Racing home." },
        { tone: 'flirty', t: "Sorry. Tell me again. I'll be nicer.", r: "Forgiven. Embarrassingly fast. I thought of you because the keeper waits for someone. Like I do. Like I might." },
      ] },
      { tone: 'passive', t: "Eleven times? What's the film?", r: "A lighthouse keeper keeps the light burning every night for a boat that left. I sob when it comes home.", opts: [
        { tone: 'cold', t: "That's a bit sad, honestly.", r: "It's not sad! It's... okay, it's a bit sad. But it's the good sad. I suppose not everyone feels it." },
        { tone: 'passive', t: "And I made you think of the boat?", r: "You go out every weekend and someone waits for you to come back. It's a very lighthouse life you lead." },
        { tone: 'flirty', t: "So you'd keep the light on for me?", r: "Already lit. Sorry. That's very forward. I mean it, though. I usually mean the forward things." },
      ] },
      { tone: 'flirty', t: "Was I the keeper or the boat?", r: "The boat. Obviously. Fast and far away. I'm the keeper. Terrible at patience, excellent at waiting.", opts: [
        { tone: 'cold', t: "I'm not anyone's boat.", r: "Oh. Okay. It was a silly thought I loved. I'll keep it to myself next time. Ouch, honestly." },
        { tone: 'passive', t: "How is that not the same thing?", r: "Patience is calm. Waiting is hoping very loudly. I hope loudly. You'll hear me from the grandstand." },
        { tone: 'flirty', t: "Then keep the light on. I'll find my way back.", r: "You've just said the film's best line without knowing it. I need to sit down. Sit with me? Please?" },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 4: Moth
  { id: 'emotional-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "Hi. I wasn't sure I'd come... after last time I went home and told my cat all about it. Moth wasn't impressed with you.",
    opts: [
      { tone: 'cold', t: "Your cat's opinion isn't my problem.", r: "No... it isn't. But I care what Moth thinks. I care about lots of small things. I'm sorry I said anything.", opts: [
        { tone: 'cold', t: "Then care less.", r: "I can't. That's not how I'm made. You can be cold, and I'll be hurt, and I'll tell you so. I'm hurt." },
        { tone: 'passive', t: "Sorry. Moth? Tell me about Moth.", r: "One ear, grumpy face, rescued. Loves only me. Sleeps on my chest in thunderstorms. You asked. That means a lot." },
        { tone: 'flirty', t: "What would it take to win Moth over? And you?", r: "Moth? Tuna. Me? You're already doing it. That was quick. I'm a bit ashamed of how quick." },
      ] },
      { tone: 'passive', t: "Moth? Your cat? I'm sorry about last time.", r: "Thank you for saying that. Yes. A grumpy rescue, one ear, called Moth because she sat by my lamp all night.", opts: [
        { tone: 'cold', t: "I'm more of a dog person.", r: "Oh... okay. That's allowed. I just get very attached to my small grumpy family. I'll leave it there." },
        { tone: 'passive', t: "One ear? What happened?", r: "Before me. A rough start. Now she has a heated blanket and me. She only lets me hold her. I cried the first time." },
        { tone: 'flirty', t: "A grumpy creature who only loves you. Relatable, maybe.", r: "Is that... are you saying... oh. My heart skipped. Don't say things like that unless you mean them. Please." },
      ] },
      { tone: 'flirty', t: "Tell Moth I'm better in person. Let me prove it.", r: "You'd have to prove it to me first. Moth takes her cues from me. So far you're... doing quite well, actually.", opts: [
        { tone: 'cold', t: "I'm not auditioning for a cat.", r: "Oh. No. Of course not. I was being playful. I'm still raw from last time, I think. I'll leave you be." },
        { tone: 'passive', t: "How did you end up with a one-eared cat?", r: "A shelter. She hissed at everyone. Then she climbed into my lap and fell asleep. I wept in the car park." },
        { tone: 'flirty', t: "Quite well? I'm aiming for very well.", r: "Very well looks like you smiling like that a bit longer. Yes. Like that. Moth would allow it. I'd insist." },
      ] },
    ] },
  { id: 'emotional-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "Do you want to see a picture of my cat? Her name's Moth, she has one ear, and she's the love of my life. So far.",
    opts: [
      { tone: 'cold', t: "Not really. I'm not a cat person.", r: "Oh... okay. I'll put my phone away. That felt like a door closing. I'll pretend I didn't feel it.", opts: [
        { tone: 'cold', t: "Pretend away.", r: "I can't, though. That's the trouble with me. I felt it, and now you know I did. Bye for now, {me}." },
        { tone: 'passive', t: "Sorry. Go on, show me.", r: "Here. That's her glaring at a raindrop. Grumpy with everyone but me. My whole heart, in a fur coat." },
        { tone: 'flirty', t: "I'd rather look at you. But show me.", r: "That's a cheat, but I'll accept it. Look. Moth. One ear, total menace. I'm glowing, aren't I? I can feel it." },
      ] },
      { tone: 'passive', t: "Go on. Why Moth?", r: "She sat by my reading lamp every night for a month. Like a moth. Now she sits on my chest when it storms.", opts: [
        { tone: 'cold', t: "Cute, I guess.", r: "You guess. Okay. She's more than cute to me. I'll stop showing you things. I'll learn, I promise." },
        { tone: 'passive', t: "A storm cat. Does she get scared?", r: "Terrified. So I hold her and tell her it's only weather. I think I'm telling myself too. We both shake." },
        { tone: 'flirty', t: "'So far' the love of your life? Interesting.", r: "You caught that. Of course you did. I left it there on purpose, a little bit. I'm terrible at hiding." },
      ] },
      { tone: 'flirty', t: "Love of your life so far? Taking applications?", r: "Oh... the position is... hold on, my face is on fire. Moth reviews all applications. She's very strict.", opts: [
        { tone: 'cold', t: "Joking. I'm not applying.", r: "Oh. Okay. I laughed first and then it hurt. I need a minute. You could have just left it nice." },
        { tone: 'passive', t: "What does Moth look for?", r: "Gentle hands, quiet voices, patience. And tuna. She'd love you if you were soft with her. I think I would too." },
        { tone: 'flirty', t: "Put me down as very interested.", r: "Written. In ink. Best handwriting. Moth will hate you for a week and then sleep on your feet. So will I. Kidding." },
      ] },
    ] },
  { id: 'emotional-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "I told my cat about you last night. Moth. One ear, very judgemental. She purred. She has never purred about anyone.",
    opts: [
      { tone: 'cold', t: "Your cat doesn't know me.", r: "No... it was a silly thing to say. I'm sorry. I get excited and it comes out sideways. I'll stop.", opts: [
        { tone: 'cold', t: "Please do.", r: "Okay. I'm going to go somewhere and feel this. You can be short with me, but it still hurts. I'm honest about that." },
        { tone: 'passive', t: "Sorry. That was blunt. Tell me about her.", r: "She came from a shelter with one ear and an attitude. Now she sleeps on my chest when it storms. My whole heart." },
        { tone: 'flirty', t: "But she purred? Clearly a cat of taste.", r: "Clearly! I knew you'd understand. Well, I hoped. Hoping is my main hobby. You're making it very easy." },
      ] },
      { tone: 'passive', t: "One ear? What's her story?", r: "Rescued. Hissed at everyone at the shelter. Climbed in my lap and fell asleep. I cried in the car park after.", opts: [
        { tone: 'cold', t: "You cry a lot, don't you?", r: "I do. I'm not ashamed of it. I just wish you'd said that kinder. I'll keep my car park stories to myself." },
        { tone: 'passive', t: "That's sweet. You two found each other.", r: "We did. Some things you just know. Some people too, maybe. I'm getting ahead of myself. Ignore me." },
        { tone: 'flirty', t: "I'd hiss at everyone too, if it got me that ending.", r: "{me}! You can't say that out loud! I'm laughing and blushing and I've completely forgotten what words are." },
      ] },
      { tone: 'flirty', t: "She purred? Tell her the feeling's mutual.", r: "Mutual... with her, or with me? Don't answer that. Do answer. Slowly. I want to remember it.", opts: [
        { tone: 'cold', t: "With the cat. Obviously.", r: "Oh. Obviously. I'll tell her. I'll keep my own hopes in my pocket. That pinched, {me}. Quite hard." },
        { tone: 'passive', t: "Ha. Let's start with the cat.", r: "That's fair. Slow and kind. Moth would approve. So would I, honestly. Just don't go too slowly." },
        { tone: 'flirty', t: "With you. Definitely with you.", r: "Oh... okay. I'm writing that down the second I get home. With the date. And a little heart. Maybe two." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 5: three a.m.
  { id: 'emotional-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "Hi... I couldn't sleep again last night. I lay there going over our last talk. Can I just ask, straight out: do you not like me?",
    opts: [
      { tone: 'cold', t: "I barely know you.", r: "That's true. But I know when someone pulls away. I'd rather ask than lie awake wondering. I've done enough of that.", opts: [
        { tone: 'cold', t: "Then stop lying awake over it.", r: "I'll try. I'm not built for it, though. That answer will keep me up tonight too. I'm telling you so." },
        { tone: 'passive', t: "That's fair. I'm not great at warm. It's not you.", r: "Thank you. Honestly. Do you ever lie awake? I do, most nights. Three in the morning is my loudest hour." },
        { tone: 'flirty', t: "I'd like to know you better. That's the opposite of not liking you.", r: "Oh... that's the answer I lay awake hoping for. I'm trying not to grin. I'm failing beautifully." },
      ] },
      { tone: 'passive', t: "I do like you. I'm just slow to show it.", r: "Thank you. You don't know how much that helps. I'm a three-in-the-morning overthinker. It gets loud in there.", opts: [
        { tone: 'cold', t: "That sounds like a you problem.", r: "It is a me problem. I wasn't asking you to fix it. I was letting you in. I'll stop doing that." },
        { tone: 'passive', t: "What do you think about at three in the morning?", r: "Whether I'm too much. Whether people mean what they say. Whether the stars get lonely. Big things, small hours." },
        { tone: 'flirty', t: "Next time it gets loud, think about me instead.", r: "Oh. That'll make it louder, actually. But nicer. Much nicer. I accept your terms. All of them." },
      ] },
      { tone: 'flirty', t: "Like you? I've been working out how to ask you to stay longer.", r: "Wait... really? I spent all night thinking the opposite. My heart's doing a happy, shaky thing. Stay, then.", opts: [
        { tone: 'cold', t: "Don't get carried away.", r: "I always get carried away. It's how I travel. But you've put me down quite hard. I'm going to go." },
        { tone: 'passive', t: "Do you not sleep much?", r: "Not really. My head talks all night. I think best at three in the morning and feel most at four." },
        { tone: 'flirty', t: "Then let's both stay. Talk till your head goes quiet.", r: "That might take a while. My head's very noisy. But with you it's going quiet already. That's new." },
      ] },
    ] },
  { id: 'emotional-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "Can I ask you a three-in-the-morning question? I don't sleep much, so I collect them. What's something you've never told anyone?",
    opts: [
      { tone: 'cold', t: "That's not something you ask a stranger.", r: "Oh... sorry. I go straight to the deep end. Small talk makes me feel lonely. I'll paddle back.", opts: [
        { tone: 'cold', t: "Paddle somewhere else.", r: "Okay. I'll go. I only wanted to know you properly. That came out sharper than you think, I promise." },
        { tone: 'passive', t: "Fine. One thing: I still sleep with the light on before races.", r: "Oh, {me}. Thank you for telling me. I won't tell a soul. I'll keep it like something precious." },
        { tone: 'flirty', t: "I'll tell you mine if you tell me yours first.", r: "Mine? Okay... I talk to the moon when I can't sleep. Out loud. I've told it about you already." },
      ] },
      { tone: 'passive', t: "Hm. That I nearly quit racing once.", r: "You did? Thank you for trusting me with that. What kept you? You don't have to say. I'd love to know.", opts: [
        { tone: 'cold', t: "Let's not go into it.", r: "Of course. I'm sorry. I always want the whole story. I'll stop pushing. I just liked being let in." },
        { tone: 'passive', t: "The first time I won anything. I couldn't let that go.", r: "I can picture it. You, small, holding something shiny. I'm a bit teary. Don't mind me, that's normal." },
        { tone: 'flirty', t: "Honestly? Moments like this. People like you.", r: "Like me? That's... I'm going to be awake all night again. But a good awake. The very best kind." },
      ] },
      { tone: 'flirty', t: "Never told anyone? That I hoped you'd come over today.", r: "Oh... that's a cheat answer. A lovely cheat answer. My whole face just went soft. Ask me one back.", opts: [
        { tone: 'cold', t: "Kidding. I hadn't thought about you.", r: "Oh. Okay... that lifted me up just to drop me. I wish you hadn't. I'll go and lie awake about that now." },
        { tone: 'passive', t: "Okay. Your turn. Something nobody knows.", r: "I write letters I never send. To people. To places. Sometimes to the version of me who was sad. There." },
        { tone: 'flirty', t: "What's yours? The truth.", r: "That I hoped you would too. Your name's been sitting on my tongue all day. There. Now we're even." },
      ] },
    ] },
  { id: 'emotional-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "I was awake at three this morning thinking about you. I don't sleep much. My heart keeps the lights on. Ask me anything.",
    opts: [
      { tone: 'cold', t: "That's a lot of thinking about someone you just met.", r: "I know. I feel fast. I'm sorry if it's too much... I've been told I'm too much. I'm trying to slow down.", opts: [
        { tone: 'cold', t: "Try harder.", r: "Okay. I'll take that home and carry it around. You should know it hurt. I don't hide that kind of thing." },
        { tone: 'passive', t: "No, it's okay. What kept you awake, really?", r: "Wondering if you meant your smile. Wondering if I'd see you again. And here you are. It's four a.m. in my chest." },
        { tone: 'flirty', t: "Too much? Not from where I'm standing.", r: "Oh. You can't say that so easily... it took me years to stop flinching at that phrase. Say it again?" },
      ] },
      { tone: 'passive', t: "Anything? What's the best thing that happened this week?", r: "A stranger told me I had kind eyes. And you. Talking to you. I'm counting this already.", opts: [
        { tone: 'cold', t: "A stranger? Says a lot.", r: "Says what? That I notice kindness? I do. I'm sorry you didn't like my answer. It was an honest one." },
        { tone: 'passive', t: "Kind eyes. The stranger was right.", r: "Oh... thank you. I'm going to save that up for a sleepless night. They're coming. They always come." },
        { tone: 'flirty', t: "And what's the best thing that could happen?", r: "This going on a bit longer. You, not leaving. Me, not saying something silly. I'm on two out of three." },
      ] },
      { tone: 'flirty', t: "Anything? Okay. What were you thinking at three exactly?", r: "That I hoped you were sleeping well. And that I'd like to be why you didn't, one day. Oh... that came out.", opts: [
        { tone: 'cold', t: "That's a bit forward.", r: "It is. I'm sorry. My mouth outran my heart. I feel hot-faced and stupid now. I'll go." },
        { tone: 'passive', t: "Ha. Did you get any sleep after that?", r: "Twenty minutes. Then Moth stepped on my face. My cat. She thinks four in the morning is breakfast." },
        { tone: 'flirty', t: "One day, maybe. Keep thinking it.", r: "I will. Every night. Oh, I'm so warm. You've made the whole room warm. Don't leave yet. Please." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 6: too much
  { id: 'emotional-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "Hi. I've been thinking... maybe I'm too much for you. I've been told that before. If I am, I'd rather you just said it.",
    opts: [
      { tone: 'cold', m: -6, t: "Since you ask: yes, a bit.", r: "Okay... thank you for being honest. It still lands like a stone. Someone said that before, and then they left.", opts: [
        { tone: 'cold', t: "Then you know how it goes.", r: "I do. I'll go before it does. I want you to know that hurt, {me}. Not to guilt you. Just so it's said." },
        { tone: 'passive', t: "That came out wrong. Who said it before?", r: "Someone I loved. They said I felt too loudly. Most people just agree and change the subject. You asked instead." },
        { tone: 'flirty', t: "A bit too much. The good kind. I'm still here, aren't I?", r: "You are... you're still here. That's the part that matters. My chest just unclenched for the first time in days." },
      ] },
      { tone: 'passive', m: 2, t: "You're not too much. Who told you that?", r: "Someone I loved. They said I felt everything too loudly. I've been turning my volume down ever since.", opts: [
        { tone: 'cold', t: "Maybe they had a point.", r: "Maybe. But they didn't have to say it to keep me. You don't either. I'll take my volume and go." },
        { tone: 'passive', t: "Don't turn it down for me.", r: "Really? Okay. I'll try. That's the kindest thing I've heard in a long time. I'm going to cry, just a little." },
        { tone: 'flirty', t: "Turn it up. I want to hear all of it.", r: "All of it? That's a lot of noise. Hearts, notebooks, cat facts... you asked for it. My whole face is smiling." },
      ] },
      { tone: 'flirty', m: 4, t: "Too much? I came over because you're exactly enough.", r: "Oh... exactly enough. Say that one again. Someone once told me the opposite and I believed them for a year.", opts: [
        { tone: 'cold', t: "I said it once. Don't need it twice.", r: "Oh. Okay. I'll hold on to the once. You didn't have to make it smaller after. That stung." },
        { tone: 'passive', t: "Who told you the opposite?", r: "Someone I loved. They said I was too much, and left. I've been apologising for my feelings ever since." },
        { tone: 'flirty', t: "Exactly enough. Now, next time and the time after that.", r: "Stop, I'm going to cry, and then you'll have to see it. Okay. I'm crying a tiny bit. Happy crying." },
      ] },
    ] },
  { id: 'emotional-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "Can I tell you something I'm scared of? That I'm too much. Someone told me so once, and I keep checking faces for it.",
    opts: [
      { tone: 'cold', t: "I'm not really the person to unload that on.", r: "I'm sorry... I wasn't unloading. I was trusting you. But I can hear the difference now. I'll stop.", opts: [
        { tone: 'cold', t: "Then stop.", r: "Okay. Then I'll carry it on my own, like always. You should know that hurt. I won't pretend it didn't." },
        { tone: 'passive', t: "No, sorry. That was harsh. Who said it?", r: "Someone I loved a lot. They said loving me was exhausting. Thank you for coming back to me. You didn't have to." },
        { tone: 'flirty', t: "Check my face. What do you see?", r: "I see... someone trying not to smile. Oh. You're not scared off. I'm going to be okay today." },
      ] },
      { tone: 'passive', t: "Who said that to you?", r: "Someone I loved. They said I needed too much reassurance. Maybe I do. I'd still rather say how I feel.", opts: [
        { tone: 'cold', t: "Reassurance gets tiring for people.", r: "I know. I've been told. I just hoped you'd be someone who didn't get tired. I'll stop leaning, then." },
        { tone: 'passive', m: 3, t: "Saying how you feel isn't too much. It's brave.", r: "Brave... nobody's called it that before. I'm keeping that word. It's going in my notebook in capitals." },
        { tone: 'flirty', t: "I'm not tired yet. Try me.", r: "Okay. Reassure me you like talking to me. Go on. Oh, you're smiling. That counts. That absolutely counts." },
      ] },
      { tone: 'flirty', t: "Check my face, then. Do I look like I think you're too much?", r: "You look... like you're about to say something nice. Your eyes go first. I'm holding my breath.", opts: [
        { tone: 'cold', t: "I look bored.", r: "Oh. I walked right into that. Okay. I'm going to go and feel stupid somewhere quieter. It hurt." },
        { tone: 'passive', t: "I look like I'm listening. Who put that fear there?", r: "Someone I loved. Before. They left, and the words stayed. Words do that to me. They live in me for years." },
        { tone: 'flirty', t: "I look like I could listen to you all night.", r: "All night? I'd talk you through to sunrise. I'd make it worth it. My heart's doing cartwheels." },
      ] },
    ] },
  { id: 'emotional-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "I've been smiling all week, which scares me. When I'm this happy I start worrying I'm too much. Am I? Be honest.",
    opts: [
      { tone: 'cold', t: "Honestly? You're intense.", r: "Intense. Okay... I know. I wish it hadn't come out so flat. I asked because I trusted you.", opts: [
        { tone: 'cold', t: "Then don't ask if you don't want the answer.", r: "I did want it. I just didn't want it to hurt this much. It does. I'll go and sit with that." },
        { tone: 'passive', t: "Intense isn't bad. Just a lot to take in at first.", r: "That's fair. I come in like weather. Someone once said I was too much and left. I think I flinch from it." },
        { tone: 'flirty', t: "Intense like a good storm. I like storms.", r: "Oh... you like storms. I love storms. That's the best answer anyone's ever given me. I'm a bit dizzy." },
      ] },
      { tone: 'passive', t: "Where's that worry coming from?", r: "Someone I loved told me so. Then left. I've been half-waiting for everyone to say it since.", opts: [
        { tone: 'cold', t: "Sounds like baggage.", r: "It is baggage. Everyone carries some. I showed you mine and you called it that. I'll go." },
        { tone: 'passive', t: "I'm not going to say it. That's not what I see.", r: "Something else? No, don't tell me what. I'll cry. I'm happy just knowing you see something else." },
        { tone: 'flirty', t: "Bring the bags. I'll carry the heavy one.", r: "You'd carry the heavy one? That's the most romantic thing anyone's said to me. I'm laughing and I'm so moved." },
      ] },
      { tone: 'flirty', t: "Too much happiness? Good. I'd like some of it.", r: "Take as much as you want. It's mostly about you anyway. Oh no, did I say that out loud? I did.", opts: [
        { tone: 'cold', t: "Keep it. I'm fine.", r: "Oh... okay. I'll keep it, then. It's lonelier holding it alone. I wish you'd taken a little." },
        { tone: 'passive', t: "Mostly about me? Tell me more.", r: "You make me laugh, you listen, you don't flinch. Someone once told me I was too much. You haven't. Yet." },
        { tone: 'flirty', t: "Then we'll share it. Half each.", r: "Half each. Okay. Mine's already bigger, I think. It's growing while you look at me. That's science." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 7: pressed flowers
  { id: 'emotional-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "Hi. I brought something, though I nearly didn't, after last time. A pressed flower. My gran taught me. It's for... you.",
    opts: [
      { tone: 'cold', t: "I don't really do keepsakes.", r: "Oh... okay. Then it stays with me, in my notebook, where the good days go. I hoped this would be one.", opts: [
        { tone: 'cold', t: "It's a flower. Don't make it a thing.", r: "Everything's a thing to me. That's who I am. You can refuse the flower. Please don't refuse that part of me." },
        { tone: 'passive', t: "Sorry. That was rude. Why pressed flowers?", r: "My gran. 'Keep the good days flat and safe, so they last.' I press one every time something lovely happens." },
        { tone: 'flirty', t: "Unless it's from a good day with me. Then I'll keep it.", r: "It is. From the day we met. I didn't say so because I was scared. Oh... you're holding it so carefully." },
      ] },
      { tone: 'passive', t: "That's thoughtful. Your gran taught you?", r: "She did. 'Flat and safe,' she said, for the good days. I press a flower every time something lovely happens.", opts: [
        { tone: 'cold', t: "Bit old-fashioned.", r: "It is. So was she. So am I, about this. I'll put it away. I didn't expect it to sting that much." },
        { tone: 'passive', t: "What day is this one from?", r: "A good one. It lives in my notebook with the others. My gran would have liked you, I think. She liked quiet people." },
        { tone: 'flirty', t: "So I'm a good day?", r: "One of the best lately. I didn't want to say it after last time. But yes. Flat and safe and kept." },
      ] },
      { tone: 'flirty', t: "You press flowers? Is there a page for me?", r: "There might be. In my notebook. Between a ticket stub and my gran's handwriting. It's a very nice neighbourhood.", opts: [
        { tone: 'cold', t: "I'd rather not be pressed between anything.", r: "Okay... that was a joke and a confession at once, and you've stepped on both. I'm a bit bruised now." },
        { tone: 'passive', t: "Your gran's handwriting?", r: "She taught me to press flowers. 'Keep the good days flat and safe.' She's on every page. So's the day we met." },
        { tone: 'flirty', t: "Best neighbourhood I've ever lived in.", r: "You're moving in, then? Into my notebook? Oh, you've no idea what that does to me. Okay. Welcome home." },
      ] },
    ] },
  { id: 'emotional-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "My gran used to press flowers, and she taught me. I do it for days I want to keep. I pressed one yesterday... guess why.",
    opts: [
      { tone: 'cold', t: "No idea. Probably something sentimental.", r: "Yes. Something sentimental. That's me. I was going to say it was for you. Maybe I'll keep that bit.", opts: [
        { tone: 'cold', t: "Keep it.", r: "I will. I'll keep the flower too. I wanted to give you something and you wouldn't let me. That hurt." },
        { tone: 'passive', t: "Sorry. Tell me. Why?", r: "Because I spent yesterday smiling about the last time we talked. Gran said keep those days flat and safe." },
        { tone: 'flirty', t: "Sentimental is fine, if it's about me.", r: "It is. Annoyingly, entirely. There's a little daisy in my notebook with yesterday's date and your name." },
      ] },
      { tone: 'passive', t: "Your gran sounds lovely. What did she say about it?", r: "'Keep the good days flat and safe, so they last.' I keep them in my notebook. It's half flowers now.", opts: [
        { tone: 'cold', t: "Seems like a lot of effort for a flower.", r: "It's not for the flower. It's for the day. But okay. I'll stop explaining things that matter to me." },
        { tone: 'passive', t: "Half flowers? That's a lot of good days.", r: "It is. Even in hard years there were enough to press. That's what Gran wanted me to see, I think." },
        { tone: 'flirty', t: "Is yesterday's flower about me?", r: "...yes. I thought I'd be braver about saying it. My voice went tiny. You heard it, though. I saw you hear it." },
      ] },
      { tone: 'flirty', t: "Let me guess. Someone very charming.", r: "Very charming. Slightly cocky. Fast car. Kind eyes. I pressed a daisy and wrote your name under it.", opts: [
        { tone: 'cold', t: "Don't write my name in things.", r: "Oh. Okay. I'll rub it out. It won't really come out, though. Pencil never quite does. Nor do words like that." },
        { tone: 'passive', t: "A daisy? Why a daisy?", r: "Gran said daisies are for new things. Small and stubborn and brave. You felt like a new thing." },
        { tone: 'flirty', t: "Under a daisy? I'll need to earn a rose.", r: "A rose would mean... oh, you know what it would mean. Gran would be laughing at me. Keep earning." },
      ] },
    ] },
  { id: 'emotional-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "Close your eyes. Okay, open them. A pressed flower. Gran showed me how. I only press flowers from days I want to keep.",
    opts: [
      { tone: 'cold', t: "What am I supposed to do with that?", r: "Keep it. Or don't. I hoped you'd know. That's the thing about gifts, you hand over a bit of your heart.", opts: [
        { tone: 'cold', t: "You can have your heart back.", r: "Okay. I'll take it. It's a bit dented now. I want you to know that... and that I'll still feel it later." },
        { tone: 'passive', t: "Sorry. I'm not used to gifts. Thank you.", r: "That's okay. Gran said gifts are scary for people who don't get many. Keep it in a book. Flat and safe." },
        { tone: 'flirty', t: "I'll keep it next to my heart. Or my helmet.", r: "Your helmet! Oh, that's it. Now I'll watch you race and know it's in there. I'm going to cry so much." },
      ] },
      { tone: 'passive', t: "Gran? What was she like?", r: "She wrote letters to everyone and pressed a flower for every good day. 'Keep them flat and safe,' she'd say.", opts: [
        { tone: 'cold', t: "Sounds like a lot of clutter.", r: "It was a whole life of kept days. But okay. I'll stop. You're being careless with me today, and I notice." },
        { tone: 'passive', t: "And this flower is from which good day?", r: "The day we met. It's taken me this long to be brave enough to give it to you. My hands are shaking." },
        { tone: 'flirty', t: "So I'm a day you want to keep?", r: "You're several. There's a page in my notebook that's mostly you. Gran would tease me terribly." },
      ] },
      { tone: 'flirty', t: "Is this from a day with me?", r: "Every flower I've pressed lately is from a day with you. That's... a lot of flowers. Don't count them.", opts: [
        { tone: 'cold', t: "That's a bit intense.", r: "Oh... yes, I suppose. I thought you'd find it sweet. I'll stop pressing them. Or I'll keep them secret." },
        { tone: 'passive', t: "How many?", r: "Four. Five, with today. My gran said keep the good days flat and safe. I think she'd have liked you." },
        { tone: 'flirty', t: "Better start a second notebook.", r: "Don't tempt me! I'd fill it. I'd fill a library. I'm so happy right now I could float off the ground." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 8: in the car
  { id: 'emotional-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "Hi... I watched {last}. Through my fingers, like always. I wanted to talk about it, but you've felt far away. Can I still?",
    opts: [
      { tone: 'cold', t: "I'd rather not relive it.", r: "Okay. I understand. I just... I lived it too, from my sofa, heart and all. I'll hold it on my own, then.", opts: [
        { tone: 'cold', t: "Yes. Keep it.", r: "I will. That's twice now you've closed a door on me. I'm not angry. I'm hurt. I want you to know." },
        { tone: 'passive', t: "Sorry. Ask me. What do you want to know?", r: "What you feel in there. In the car, with everyone so close. I've always wondered, and you'd tell it true." },
        { tone: 'flirty', t: "Fine. But only if you hold my hand while I tell you.", r: "Oh... that changes everything. Here. My hand. It's a bit shaky. Tell me what it feels like in there." },
      ] },
      { tone: 'passive', t: "Of course. What did you think?", r: "I couldn't breathe for the first lap. What does it feel like in there? I've always wanted to know. Really know.", opts: [
        { tone: 'cold', t: "It's just work.", r: "It's not just work to me. It's you, out there. I wanted the real answer. Maybe you don't give that out." },
        { tone: 'passive', t: "Quiet, strangely. Loud outside, quiet in my head.", r: "Quiet in your head... I'd give anything for that. Mine's never quiet. Except right now. Listening to you." },
        { tone: 'flirty', t: "Like this. Heart racing, can't look away.", r: "Like this? You mean... me? Oh. My knees have gone. Talking to you is apparently a sport now." },
      ] },
      { tone: 'flirty', t: "Through your fingers? Next time watch properly. I'll wave.", r: "You'd wave? From the car? I'd scream. I'd embarrass everyone near me. Now tell me: what's it like in the car?", opts: [
        { tone: 'cold', t: "I won't actually wave. That's ridiculous.", r: "Oh... I know. I knew. I wanted the pretend to last a bit longer. You didn't have to end it so fast." },
        { tone: 'passive', t: "In there? Calm, honestly. Everything slows down.", r: "Slows down... out here everything speeds up when you're on track. My heart, mostly. That's going in the notebook." },
        { tone: 'flirty', t: "Like right now. Pulse up, focused on one thing.", r: "One thing being me? I'm writing this down. Big letters. With today's date. And a circle around it." },
      ] },
    ] },
  { id: 'emotional-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "Can I ask something real? What do you feel out there, when you race? I watched {last} and wondered the whole time.",
    opts: [
      { tone: 'cold', t: "Not a lot. That's the point.", r: "Not a lot? I feel so much just watching. I hoped you'd let me in a little... it's okay. Maybe one day.", opts: [
        { tone: 'cold', t: "Maybe not.", r: "Okay. That's a door, and you've closed it. I'll stand back from it. I just wanted you to know I knocked." },
        { tone: 'passive', t: "That's a lie. I feel everything. I just can't show it in there.", r: "Everything? Oh, {me}. Then we're the same, just facing different ways. I'm so glad you told me." },
        { tone: 'flirty', t: "Not a lot. Unless you're watching.", r: "Unless I'm watching? Then I'm going to watch every lap now. I'm going to watch so hard." },
      ] },
      { tone: 'passive', t: "Scared at the start. Free by lap two. Tired after.", r: "Scared, then free... that's exactly what falling for someone feels like. Oh. I mean in general. In films.", opts: [
        { tone: 'cold', t: "Let's not make it romantic.", r: "Sorry... I make everything romantic. It's a flaw. I'll keep my metaphors to myself. That stung a bit." },
        { tone: 'passive', t: "What did it look like from where you were?", r: "Like you were made of nerve. I watched through my fingers till the very end. Then I clapped alone in my kitchen." },
        { tone: 'flirty', t: "In films, huh? Sure.", r: "Fine! Not in films! In me! Happy now? I'm going pink and you're grinning. This is so unfair." },
      ] },
      { tone: 'flirty', t: "When you're watching? I feel like I'd better not mess up.", r: "Oh... you think about me watching? I watched {last} through my fingers. My heart was in my mouth all race.", opts: [
        { tone: 'cold', t: "I don't think about anyone in the car. Too risky.", r: "Of course. That makes sense. It was a silly hope. I'll keep my hopes out of your car. I'm a bit flattened." },
        { tone: 'passive', t: "What was the worst moment to watch?", r: "The start. Everyone so close. I forget how to breathe. Then you're through and I remember. Every single race." },
        { tone: 'flirty', t: "Then keep watching. It helps.", r: "It helps? I'll watch every lap. The replays. The warm-up laps. I'm so happy right now I could burst." },
      ] },
    ] },
  { id: 'emotional-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "I watched {last}. Hands over my face, peeking through. I screamed at the start. What's it like in there? I want to feel it too.",
    opts: [
      { tone: 'cold', t: "You can't feel it. You're not a driver.", r: "No... I'm not. But I could feel it through you, if you let me. I suppose you don't want to. Okay.", opts: [
        { tone: 'cold', t: "Right. I don't.", r: "Okay. Then I'll watch from behind my fingers and not ask. That one hurt, and I'm not going to hide it." },
        { tone: 'passive', t: "Sorry. Let me try. It's loud, then very quiet.", r: "Loud then quiet. Like a heart after crying. I'll think of that every time now. Thank you, really." },
        { tone: 'flirty', t: "Okay. Close your eyes. Imagine me. Now go very fast.", r: "Eyes closed. You. Very fast. Oh no, my heart's racing. Is this what it's like? I love it. I love it." },
      ] },
      { tone: 'passive', t: "Fast and focused. It's hard to describe.", r: "Try? I want every word. I'm the person who wants the long version of everything.", opts: [
        { tone: 'cold', t: "Not today.", r: "Okay. Not today. I'll wait. I'm good at waiting. I just wish today you'd wanted to tell me." },
        { tone: 'passive', t: "It's like your whole life is the next corner.", r: "The next corner... that's beautiful. I'm going to think about that at three in the morning. In a good way." },
        { tone: 'flirty', t: "The long version takes dinner. Interested?", r: "Interested? I'm halfway to the restaurant in my head. Yes. Yes, please. I'm writing the date down now." },
      ] },
      { tone: 'flirty', t: "You screamed? I'll take that as a compliment.", r: "Take it! Take all of it. I screamed, I cried, I hugged a cushion. You should have seen me. Actually, don't.", opts: [
        { tone: 'cold', t: "I'll pass on the cushion story.", r: "Oh. Okay. It was more of a feeling than a story. I'll fold it back up. I'm a bit hurt, honestly." },
        { tone: 'passive', t: "What made you scream?", r: "The start. It's always the start. Twenty cars and one of them's someone I... care about. Oh. I said it." },
        { tone: 'flirty', t: "Next time, hug me instead of the cushion.", r: "Next time? You're making plans with my heart. It's saying yes so loudly the neighbours can hear." },
      ] },
    ] },
  // ------------------------------------------------------------------------------------------------ slot 9: every page (chapter end)
  { id: 'emotional-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "Can we talk? Properly. I keep writing about you and crossing it out, because I can't tell what you feel. Please tell me.",
    opts: [
      { tone: 'cold', m: -6, t: "I don't feel anything worth writing down.", r: "Okay. I asked, and you told me. I'd rather know than hope. It hurts more than I can say, but I'd rather know.", opts: [
        { tone: 'cold', t: "Good. Then we're clear.", r: "We're clear. I'll close the notebook on this page. You should know you meant something to me. That's all." },
        { tone: 'passive', t: "That was unfair. I don't know what I feel yet.", r: "That's honest. I can live with honest. I'll stop crossing things out. I'll just write 'not yet', and wait." },
        { tone: 'flirty', t: "That's a lie. I just don't say these things well.", r: "A lie? Oh... then say it badly. I don't need it pretty. I need it true. I'm right here." },
      ] },
      { tone: 'passive', t: "I like you. I'm just not loud about it.", r: "You like me. Okay. I can work with quiet. I'm loud enough for both of us. Can I write it down, then?", opts: [
        { tone: 'cold', t: "Don't write it down. Just let it be.", r: "I don't know how to let things be. I keep them. That's me. I'll try... it stung, being told not to." },
        { tone: 'passive', t: "Write it down. What will it say?", r: "'They like me. Quietly.' And a date. And a little star. It'll be my favourite page in the whole notebook." },
        { tone: 'flirty', t: "Write it in capitals.", r: "Capitals. With a heart. Two hearts. Oh, I'm being ridiculous. I'm so happy I don't even care." },
      ] },
      { tone: 'flirty', t: "What I feel? Like I want more time with you. Much more.", r: "Much more... oh. I've been afraid to want that out loud. I want it too. More than a little. A lot more.", opts: [
        { tone: 'cold', t: "Don't make it a whole thing.", r: "It's already a whole thing. To me. You don't have to make it one too. But I wish you hadn't said that." },
        { tone: 'passive', t: "Then let's see where it goes. Slowly.", r: "Slowly. Okay. I'm terrible at slow, but I'll try for you. That's the first promise I've made you." },
        { tone: 'flirty', t: "Then stop crossing it out. Write it all.", r: "All of it? That's pages. Chapters. Okay. I'm starting tonight. The first line is your name." },
      ] },
    ] },
  { id: 'emotional-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "I filled a whole page of my notebook with you last night. I think that means something. I'd like to know you more than a little.",
    opts: [
      { tone: 'cold', t: "A whole page is a lot.", r: "It is. I'm a lot, sometimes. I thought maybe you'd like being written about. I'm sorry if I misjudged.", opts: [
        { tone: 'cold', t: "You did.", r: "Okay. I'll put the pen down. That one will take a while to stop hurting. I'm saying so, not blaming." },
        { tone: 'passive', t: "No, it's just new for me. What's on the page?", r: "That you're kind in small ways. That you listen with your whole face. That I'm starting to hope." },
        { tone: 'flirty', t: "Only one page? I was hoping for two.", r: "Two? I'll need a bigger notebook. A bigger heart. Oh, that sounded silly. I mean every word." },
      ] },
      { tone: 'passive', t: "I'd like that too. To know you more.", r: "Really? Okay. Then I'll stop being scared and keep showing up. And you keep showing up too. Deal?", opts: [
        { tone: 'cold', t: "Let's not make promises.", r: "I wasn't asking for forever. Just next time. I'm stung that even that was too much to ask. I'll go." },
        { tone: 'passive', t: "Deal. Next time, tell me something I don't know.", r: "I'll make a list. It'll be too long. You'll get the best three. I'm already excited and it's days away." },
        { tone: 'flirty', t: "Deal. And next time I'm asking you out properly.", r: "Properly? Like a date? Oh... yes. Don't change your mind. I'm writing it down before you can." },
      ] },
      { tone: 'flirty', t: "Good. Because I've been thinking about you a lot.", r: "A lot? You've been carrying me around too, while I've been carrying you in my notebook? Oh.", opts: [
        { tone: 'cold', t: "Don't read too much into it.", r: "I read too much into everything. It's my nature. But you're making it sound small. It isn't, to me." },
        { tone: 'passive', t: "Yeah. More than I expected.", r: "More than you expected... that's the most beautiful thing. I didn't expect you either. Neither of us saw it coming." },
        { tone: 'flirty', t: "Every day. You're hard to stop thinking about.", r: "Every day. I'm going to start a new page. Then a new chapter. Then... let's just see. My heart's racing." },
      ] },
    ] },
  { id: 'emotional-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "Okay, I have to say it or I'll burst. Your name's on almost every page of my notebook lately. I want more of you. Much more.",
    opts: [
      { tone: 'cold', t: "That's moving very fast.", r: "I know. I move fast. I feel fast. I'm sorry if it scares you... it scares me too, sometimes.", opts: [
        { tone: 'cold', t: "It does. Slow down or stop.", r: "Okay. I'll stop. I'm not going to pretend that didn't break something a little. I'll take it home with me." },
        { tone: 'passive', t: "It's okay. Just give me time to catch up.", r: "Time. Yes. I'll give you all of it. I'll hold my breath for you like I do at the start. Not too long, though." },
        { tone: 'flirty', t: "Fast is fine. I'm a racing driver.", r: "Oh, of course you'd say that. That's exactly right. Okay. Full speed, then. Hold on to me." },
      ] },
      { tone: 'passive', t: "I want more of you too. Let's keep going.", r: "Keep going. Okay. That's a sentence I'll press like a flower. Flat and safe. I'll keep it forever.", opts: [
        { tone: 'cold', t: "Let's not get sentimental.", r: "Too late, I'm afraid. I'm always sentimental. You knew that. But okay. I'll keep it inside. It's crowded in there." },
        { tone: 'passive', t: "Where do we go from here?", r: "Somewhere with more talking. More you. A walk, a dinner, anywhere. I'm not fussy. I'm smitten." },
        { tone: 'flirty', t: "More of me starts now. Ask me anything.", r: "Anything? Then tell me what you're thinking right now. Oh... you're looking at my mouth. I saw that." },
      ] },
      { tone: 'flirty', t: "Almost every page? Then let's give you new material.", r: "New material? Oh... yes. Please. Walks. Long talks. Late nights. Write me a whole chapter, {me}.", opts: [
        { tone: 'cold', t: "Joking. I'm not here to be your story.", r: "Oh. Okay. The chapter's very short, then. I'll stop writing. It's harder to stop feeling. That hurt." },
        { tone: 'passive', t: "Let's start small. A walk, soon?", r: "A walk. Soon. I'll count the days. I won't tell you how many times I'll count them. A lot." },
        { tone: 'flirty', t: "Let's start with a whole book.", r: "A whole book. I'm crying. Don't look. Okay, look. These are the happy ones. You did this." },
      ] },
    ] },
];
