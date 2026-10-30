// ALOOF (ice) - in person, stage 'new', slots 1-9: first impressions. They size you up and keep a 'file' on you (the
// review); no weather talk; standards; tea, add nothing; the grandmother; they watched your race 'for research'; you
// made them laugh; slot 9 closes the review: 'provisionally interesting'. Coldness earns grudging respect here;
// eagerness reads as cheap (they cut it down elegantly, with a flicker underneath).
export const DATA = [
  // ---- slot 1: the sizing-up. Establishes: they are reviewing you --------------------------------------------------
  { id: 'ice-new-1-cold', stage: 'new', slot: 1, mood: 'cold',
    say: ["You have the face of someone who'd rather be elsewhere. So would I. Let's be efficient.", "You look bored. Good. So am I. That saves us the pleasantries."],
    opts: [
      { tone: 'cold', t: "Efficient suits me.", r: "Good. Most people pad. You don't. I'm putting that in your file.", m: 2, opts: [
        { tone: 'cold', t: "I didn't know I had a file.", r: "Everyone has a file. Yours is thin. Keep it that way and we'll get along." },
        { tone: 'passive', t: "What else is in it?", r: "Your name, a firm handshake and one point in your favour. Review pending. Off you go." },
        { tone: 'flirty', t: "Leave a page blank for later.", r: "Presumptuous. I'll leave a margin. Margins are where I write the honest notes." },
      ] },
      { tone: 'passive', t: "Fair. Long day. I'm {me}.", r: "I know who you are. Your face is on a banner somewhere behind me. I'm {first}. Use it sparingly.", opts: [
        { tone: 'cold', t: "Sparingly it is.", r: "Good. Names wear out. Yours is already a little shiny from overuse." },
        { tone: 'passive', t: "Nice to meet you, {first}.", r: "Is it. We'll see. I'll let you know when I've decided. Don't wait up." },
        { tone: 'flirty', t: "I'll save it for special occasions.", r: "There won't be many. Plan accordingly. ...That was nearly a smile. Don't mention it." },
      ] },
      { tone: 'flirty', t: "I'd rather be here, now that you're in it.", r: "Thirty seconds in and already reciting. Did someone write that for you?", opts: [
        { tone: 'cold', t: "Forget I said it.", r: "Forgotten. You're back to zero. Zero is a respectable place to start." },
        { tone: 'passive', t: "Okay, that was bad. What keeps you busy?", r: "Better. I'll tell you another time. Asking was the test. You passed it, barely." },
        { tone: 'flirty', t: "Nobody wrote it. You just bring it out of me.", r: "Then I'm a bad influence on your material. I'll take the compliment. Not the line." },
      ] },
    ] },
  { id: 'ice-new-1-passive', stage: 'new', slot: 1, mood: 'passive',
    say: ["So you're the one who drives in circles for a living.", "You drive in circles, very fast, for money. I'm still deciding if that's impressive."],
    opts: [
      { tone: 'cold', t: "Better than talking in circles.", r: "Ah. Teeth. I was told you were pleasant. I'm glad they were wrong.", m: 2, opts: [
        { tone: 'cold', t: "Pleasant is overrated.", r: "Agreed. We'll be unpleasant together, at a polite distance. Enjoy {venue}." },
        { tone: 'passive', t: "Who told you I was pleasant?", r: "Everyone. That's the trouble with pleasant: it's unanimous. Consider yourself under review." },
        { tone: 'flirty', t: "I can be pleasant for the right person.", r: "Everyone says that. Very few mean it. You'll have to show me. Slowly." },
      ] },
      { tone: 'passive', t: "It's more complicated than it looks.", r: "Most things are. So explain it. Briefly. I'll know if you're showing off.", opts: [
        { tone: 'cold', t: "You wouldn't follow it.", r: "Wouldn't I. You've made yourself more interesting and much less likeable. Well done." },
        { tone: 'passive', t: "Brake late, turn early, don't think too hard.", r: "So it's a philosophy. Concise. I approve of concise. Provisionally." },
        { tone: 'flirty', t: "I'd rather show you than explain.", r: "A demonstration. Cheap, but effective. I'll keep my eyes open and my opinion closed." },
      ] },
      { tone: 'flirty', t: "Decide slowly. I don't mind you looking.", r: "I wasn't looking. I was assessing. There's a difference, and you're on the wrong side of it.", opts: [
        { tone: 'cold', t: "Assess away. I'm not bothered.", r: "Unbothered. Good. It's the first interesting thing about you. Don't ruin it." },
        { tone: 'passive', t: "And what's the assessment?", r: "Pending. That's not a no. It isn't anything. It's paperwork." },
        { tone: 'flirty', t: "Then let me get on the right side of it.", r: "Earn it. Charm is a deposit, not a payment. ...Your deposit has been received." },
      ] },
    ] },
  { id: 'ice-new-1-flirty', stage: 'new', slot: 1, mood: 'flirty',
    say: "Someone said you were charming. I've come to see if they exaggerate. They usually do.",
    opts: [
      { tone: 'cold', t: "They do. I'm not charming.", r: "Refreshing. The charming ones never say that. Stay unimpressed, please. It suits you.", m: 2, opts: [
        { tone: 'cold', t: "I'll stay unimpressed with you too.", r: "Do. It's very restful. I'll be over there, unimpressed in return." },
        { tone: 'passive', t: "Who said it?", r: "A reliable source with unreliable taste. Leave it there. I've started a file on you." },
        { tone: 'flirty', t: "Not charming. Wait till you see persistent.", r: "Persistent I can live with. Charming I'd have to fight. Proceed, carefully." },
      ] },
      { tone: 'passive', t: "You can judge for yourself. Hi. I'm {me}.", r: "Hello, {me}. Ordinary opening. No tricks. A point for that. Continue.", opts: [
        { tone: 'cold', t: "That's it. No tricks.", r: "Then you're either honest or very clever. I'll find out which. I always do." },
        { tone: 'passive', t: "So, what's the verdict so far?", r: "Undecided. I've opened a file. Don't look so pleased; everyone gets a file." },
        { tone: 'flirty', t: "I'm saving the tricks for later.", r: "Cheaper to have none. But I'll admit I'm curious what later looks like." },
      ] },
      { tone: 'flirty', t: "And? Do they exaggerate?", r: "Slightly. Asking was a mistake. You were doing well just standing still.", opts: [
        { tone: 'cold', t: "Then I'll stand still.", r: "There. Better. Very still. Almost statuesque. You may go." },
        { tone: 'passive', t: "Fair. What would you rather talk about?", r: "Anything but you, for a minute. Then you again. I'm thorough. Your review is pending." },
        { tone: 'flirty', t: "You came to see me, though. I'll take that.", r: "I came to check a claim. The claim is under review. You may hope. Quietly." },
      ] },
    ] },

  // ---- slot 2: they notice everything (collar, cuff, how you stand); they hate being stared at -----------------------
  { id: 'ice-new-2-cold', stage: 'new', slot: 2, mood: 'cold',
    say: "You were short with me before. I noticed. I notice most things. Your collar, for example. It's folded under.",
    opts: [
      { tone: 'cold', t: "Leave the collar alone.", r: "I haven't touched it. I wouldn't. It's very loyal to its mistake.", opts: [
        { tone: 'cold', t: "It's fine as it is.", r: "It isn't. But your stubbornness is consistent, and I respect consistency. Barely." },
        { tone: 'passive', t: "Alright. Fix it, then.", r: "There. Was that so hard? Don't thank me. Nobody thanks the inspector." },
        { tone: 'flirty', t: "You can touch it. I won't complain.", r: "I'll pass. If I touch your collar, people talk, and I prefer to start the talk myself." },
      ] },
      { tone: 'passive', t: "You notice a lot.", r: "Everything. It's exhausting. Most people are a crowd of small mistakes. You're a slightly smaller crowd.", opts: [
        { tone: 'cold', t: "Must be tiring, being you.", r: "Very. That's why I'm selective about company. You're dismissed. Kindly." },
        { tone: 'passive', t: "What else have you noticed?", r: "Your weight's on your left foot. You touch your ear when you lie. You haven't yet. Keep it up." },
        { tone: 'flirty', t: "Notice anything you like?", r: "The ear thing. It's honest. Everything else is still on probation.", m: 0 },
      ] },
      { tone: 'flirty', t: "Do you always look at people this closely?", r: "I'm looked at. It's tedious. I observe. Learn the difference before you try either.", opts: [
        { tone: 'cold', t: "Observe someone else, then.", r: "I might. You've made it easy. Off you go, collar and all." },
        { tone: 'passive', t: "Sorry. I didn't mean to make you uncomfortable.", r: "You didn't. Very little does. But thank you for checking. That gets written down." },
        { tone: 'flirty', t: "Then I'll do the staring for both of us.", r: "Please don't. ...Fine. Once. Quickly. Then look at something else, like a civilised person." },
      ] },
    ] },
  { id: 'ice-new-2-passive', stage: 'new', slot: 2, mood: 'passive',
    say: "Your cuff is folded under. Someone dressed you in a hurry, or you did it yourself in the dark.",
    opts: [
      { tone: 'cold', t: "Is that what you do? Inspect people?", r: "Constantly. You'd be surprised how few pass. You're mid-inspection. Do stand still.", m: 2, opts: [
        { tone: 'cold', t: "Inspect someone else.", r: "Plenty of candidates. None of them bit back, though. Enjoy your crooked cuff." },
        { tone: 'passive', t: "How am I doing?", r: "Cuff, a fail. Posture, adequate. Eye contact, steady. A borderline case. My favourite kind." },
        { tone: 'flirty', t: "Take your time. Be thorough.", r: "I'm always thorough. That's the problem. The good news ran to a second page." },
      ] },
      { tone: 'passive', t: "The dark. I was late. Thanks for telling me.", r: "Most people get defensive. You said thank you. Disarming. Don't do it too often.", opts: [
        { tone: 'cold', t: "Don't get used to it.", r: "I never get used to anything. It's my best quality, and my most expensive." },
        { tone: 'passive', t: "Anything else out of place?", r: "Nothing I'll mention. I ration critiques. You've had your one for the day." },
        { tone: 'flirty', t: "Maybe you can dress me next time.", r: "Maybe you can learn to use a light switch. Start there. Then we'll talk." },
      ] },
      { tone: 'flirty', t: "So you were looking at my wrists.", r: "At the cuff. The wrist was incidental. Don't turn my thoroughness into a compliment.", opts: [
        { tone: 'cold', t: "It's not a compliment. Just an observation.", r: "Two observers. How dreary for everyone else. Fine. We'll watch the room." },
        { tone: 'passive', t: "Fair enough. Thanks for the tip.", r: "You're welcome. I'm rarely useful to people. It felt odd. Not unpleasant." },
        { tone: 'flirty', t: "Too late. I'm taking it as one.", r: "Then you've taken something I didn't give. A thief. An attentive one, at least." },
      ] },
    ] },
  { id: 'ice-new-2-flirty', stage: 'new', slot: 2, mood: 'flirty',
    say: "You stood a little closer than necessary last time. I noticed. I notice everything. Do it again and I'll mention it.",
    opts: [
      { tone: 'cold', t: "I won't, then.", r: "Ah. Retreat. Sensible, and slightly disappointing. I'll recover.", opts: [
        { tone: 'cold', t: "Space suits us both.", r: "It does. I'll keep mine. You keep yours. Very civilised. Very dull." },
        { tone: 'passive', t: "I didn't realise I did.", r: "Most people don't. That's why I watch for it. It tells me more than anything they say." },
        { tone: 'flirty', t: "Unless you want me to.", r: "I said I'd mention it. I didn't say I'd object. Those are separate clauses." },
      ] },
      { tone: 'passive', t: "What else did you notice?", r: "You looked at the exit twice. Then at me, and stopped looking at the exit. Make of that what you like.", opts: [
        { tone: 'cold', t: "I always check the exits.", r: "Practical. A racer's habit. I'll file it under 'unromantic' and move on." },
        { tone: 'passive', t: "You really don't miss anything.", r: "I miss trains, occasionally. People, never. It's a burden I manage." },
        { tone: 'flirty', t: "I make a lot of it.", r: "Then don't tell me. Some things are better as unsigned notes." },
      ] },
      { tone: 'flirty', t: "Consider this me doing it again.", r: "Mentioned. There. You've been mentioned. It's the first thing I've given you. Look after it.", opts: [
        { tone: 'cold', t: "Fine. I'll step back.", r: "Thank you. You stepped back so neatly it was almost a compliment. Off you go." },
        { tone: 'passive', t: "Is that a good thing or a bad thing?", r: "It's a thing. I don't hand them out. Work out the rest yourself." },
        { tone: 'flirty', t: "I'll treasure it.", r: "Treasure is a strong word. Keep it in a drawer. I may ask for it back. I may not." },
      ] },
    ] },

  // ---- slot 3: no small talk. The weather is banned; they want one true thing ---------------------------------------
  { id: 'ice-new-3-cold', stage: 'new', slot: 3, mood: 'cold',
    say: "You were cool with me last time. Fine. Don't mention the weather and we'll get along well enough.",
    opts: [
      { tone: 'cold', t: "I wasn't going to.", r: "Nobody believes that, and then they mention the sky. Say something true instead.", m: 2, opts: [
        { tone: 'cold', t: "I don't do true on request.", r: "Neither do I. Two locked doors, then. I've had worse company." },
        { tone: 'passive', t: "I hate losing more than I like winning.", r: "Now that's true. And ugly. I like it. You may stay a minute longer." },
        { tone: 'flirty', t: "True? I came over here on purpose.", r: "Bold, and inelegant. But true, I'll grant you. It counts. Once." },
      ] },
      { tone: 'passive', t: "Alright. What do you want to talk about?", r: "Something true. One thing nobody asks you about. Go.", opts: [
        { tone: 'cold', t: "I don't share with strangers.", r: "Correct policy. I'll respect it. Go on being a stranger, then. On schedule." },
        { tone: 'passive', t: "I can't sleep the night before a race. Never could.", r: "Thank you. That's real. The posters don't mention it. I'll keep it to myself." },
        { tone: 'flirty', t: "Truth is, I've been wanting to talk to you.", r: "That's a tactic dressed as a truth. ...A decent tailor did the dressing, though." },
      ] },
      { tone: 'flirty', t: "Shame. You'd brighten any forecast.", r: "That's the weather wearing a bow. I asked for neither. Try again.", opts: [
        { tone: 'cold', t: "Never mind.", r: "Never minded. It's what I'm best at. Off you go." },
        { tone: 'passive', t: "Okay. Tell me something true, then.", r: "I'd rather be somewhere quiet. I'd rather be here than most quiet places. Make nothing of it." },
        { tone: 'flirty', t: "Moonlight, then. Cool and hard to reach.", r: "Still weather, technically. But nearly accurate, and that's rare. I'll allow it." },
      ] },
    ] },
  { id: 'ice-new-3-passive', stage: 'new', slot: 3, mood: 'passive',
    say: "Rule: no weather, no 'how was your flight'. Ask me something real, or let's admire the silence.",
    opts: [
      { tone: 'cold', t: "Silence works for me.", r: "Then we'll admire it. ...You're very good at this. Unnervingly. I'm adding it to your file.", m: 2, opts: [
        { tone: 'cold', t: "I'm not trying to impress you.", r: "Which is why it's working. Don't tell anyone. Least of all yourself." },
        { tone: 'passive', t: "Fine. What keeps you up at night?", r: "Unfinished things. Usually mine. Sometimes other people's. That'll do for now." },
        { tone: 'flirty', t: "Silence with you isn't bad at all.", r: "Don't spoil it by narrating it. ...But no. It isn't." },
      ] },
      { tone: 'passive', t: "What's the thing you'd never tell a stranger?", r: "If I told you, you'd no longer be a stranger. Clever. Try a smaller key.", opts: [
        { tone: 'cold', t: "Forget it. Keep your secrets.", r: "I will. They're very well kept. Better than most people's houses." },
        { tone: 'passive', t: "What's the last thing that surprised you?", r: "You, asking that properly. People never do. Second place goes to a very good pear." },
        { tone: 'flirty', t: "I'll earn the big one, then.", r: "Earn. Good verb. You'll need a long time and very good manners." },
      ] },
      { tone: 'flirty', t: "Real? Your eyes do something when you're bored.", r: "Do they. That's an observation, not a compliment. I'll accept the first. Hold onto the second.", opts: [
        { tone: 'cold', t: "Just saying what I see.", r: "Then you see like me. That's either flattering or worrying. Let's not decide." },
        { tone: 'passive', t: "Sorry. Was that too much?", r: "It was almost right, which is worse. I'm not offended. I'm thinking." },
        { tone: 'flirty', t: "They're doing it less now.", r: "Careful. Noticing is my department. ...You may have a desk in it." },
      ] },
    ] },
  { id: 'ice-new-3-flirty', stage: 'new', slot: 3, mood: 'flirty',
    say: "You flirted last time. Clumsily. I've been considering how to correct your technique. Rule one: never the weather.",
    opts: [
      { tone: 'cold', t: "I don't need correcting.", r: "Everyone needs correcting. But you said that without blinking, and I liked it. Annoying.", m: 2, opts: [
        { tone: 'cold', t: "Your problem, not mine.", r: "Indeed. I'll carry it. Gracefully, from over there." },
        { tone: 'passive', t: "Fine. What's rule two?", r: "Say less than you mean. Rule three: never explain rule two. Lesson ends." },
        { tone: 'flirty', t: "Then give me private lessons.", r: "Expensive. Exclusive. Oversubscribed. ...There may be a cancellation." },
      ] },
      { tone: 'passive', t: "What's wrong with the weather?", r: "It's what people say when they've nothing to say. You always have something. I've watched.", opts: [
        { tone: 'cold', t: "Maybe I've got nothing to say to you.", r: "Possible. Unlikely. You'll find something. I'll be elsewhere when you do." },
        { tone: 'passive', t: "Okay. Something real: I hate losing.", r: "Everyone hates losing. You said it like it costs you. That's the real part." },
        { tone: 'flirty', t: "You've watched me?", r: "Observed. Briefly. Clinically. Fine: three times. That's all you're getting." },
      ] },
      { tone: 'flirty', t: "Teach me, then. Start with your favourite line.", r: "My favourite line is the one nobody's tried yet. You haven't found it. Keep looking.", opts: [
        { tone: 'cold', t: "Not worth the effort.", r: "Then don't. Clumsy and lazy is a combination I can turn down very easily." },
        { tone: 'passive', t: "Then I'll just talk to you instead.", r: "Instead of performing. Yes. That's the entire technique. You learn quickly." },
        { tone: 'flirty', t: "Is it close to 'you're the most interesting person here'?", r: "Close. Too eager. True, though. I'll allow it this once, and never again." },
      ] },
    ] },

  // ---- slot 4: their work and their standards: nothing is finished until they stop hating it -----------------------
  { id: 'ice-new-4-cold', stage: 'new', slot: 4, mood: 'cold',
    say: "You were brisk last time. I was buried in {work} anyway. Nothing's finished until I stop hating it. I haven't.",
    opts: [
      { tone: 'cold', t: "Then stop hating it.", r: "If it were that easy, everyone would be good. Most people stop at fine. I don't.", opts: [
        { tone: 'cold', t: "Fine gets the job done.", r: "Fine is a coat of paint over nothing. We disagree. Lovely talking to you." },
        { tone: 'passive', t: "How long have you been on it?", r: "Months. The good part took a day. The rest is me arguing with myself, and losing." },
        { tone: 'flirty', t: "I'd like to see it. Hated or not.", r: "Nobody sees anything until it's right. Not even charming drivers. ...That wasn't a compliment." },
      ] },
      { tone: 'passive', t: "How's it going?", r: "Badly. Which means properly. If it were easy, I'd suspect it.", opts: [
        { tone: 'cold', t: "Sounds miserable.", r: "It is. That's how you know it matters. You wouldn't understand. Or you would, and won't admit it." },
        { tone: 'passive', t: "Same with a lap. The good ones hurt.", r: "Hm. The first sensible thing anyone's said to me this week. Leave before you spoil it." },
        { tone: 'flirty', t: "You'll get there. You don't seem the type to stop.", r: "I'm not. Neither are you. That's either a common interest or a warning." },
      ] },
      { tone: 'flirty', t: "You must be impossible to impress.", r: "Not impossible. Expensive. There's a difference you'll want to learn.", opts: [
        { tone: 'cold', t: "Impressing you isn't on my list.", r: "Good. Trying shows. You're better off standing there being exactly this." },
        { tone: 'passive', t: "What does it cost, then?", r: "Honesty, mostly. Time. Never flattery. Flattery gets refunded at the door." },
        { tone: 'flirty', t: "I can afford it.", r: "People always think so. Then they see the bill. Start saving." },
      ] },
    ] },
  { id: 'ice-new-4-passive', stage: 'new', slot: 4, mood: 'passive',
    say: "I'm meant to be on {work}. I've been staring at it for three days. It's wrong, and I can't see where.",
    opts: [
      { tone: 'cold', t: "Walk away from it for a day.", r: "Practical. Unsentimental. Annoyingly correct. Who taught you that?", m: 2, opts: [
        { tone: 'cold', t: "Nobody. It's common sense.", r: "Common sense is very uncommon, in my experience. Keep yours away from the cameras." },
        { tone: 'passive', t: "An engineer. Leave the car alone and it tells you.", r: "I'll leave mine alone. If it tells me something, I'll credit your engineer. Grudgingly." },
        { tone: 'flirty', t: "Come and walk away from it with me.", r: "That's a different proposal. I'll walk away alone. With your idea, though." },
      ] },
      { tone: 'passive', t: "What do you think is wrong?", r: "Something small. It's always something small. Small things ruin everything if you let them.", opts: [
        { tone: 'cold', t: "Sounds exhausting.", r: "It is. Tell me what doesn't exhaust you and I'll tell you what you've stopped caring about." },
        { tone: 'passive', t: "Like a tyre pressure half a pound off.", r: "Exactly like that. You understand. Irritating. I'd planned to find you shallow." },
        { tone: 'flirty', t: "You notice small things. You'll find it.", r: "I will. I always do. Flattering, that you noticed I notice. Don't overdo it." },
      ] },
      { tone: 'flirty', t: "Some things are perfect the first time.", r: "Some things. Very few. Was that about the work? I'll assume so, for your sake.", opts: [
        { tone: 'cold', t: "It was about the work.", r: "Then thank you for your professional opinion. Invoice me." },
        { tone: 'passive', t: "Mostly about the work.", r: "Mostly. I'll accept mostly. It's honest, and honest is the house style." },
        { tone: 'flirty', t: "It wasn't about the work.", r: "I gathered. Bold. Still too early to say it out loud. Keep it in your pocket." },
      ] },
    ] },
  { id: 'ice-new-4-flirty', stage: 'new', slot: 4, mood: 'flirty',
    say: "You were in a good mood last time. Contagious. I went home and worked on {work} for six hours. I'm told that's unusual.",
    opts: [
      { tone: 'cold', t: "Coincidence.", r: "Probably. I don't believe in coincidence, but I'll pretend, since you're being stern.", opts: [
        { tone: 'cold', t: "I'm not taking credit.", r: "Good. I wasn't giving any. We're equally ungenerous. A promising start." },
        { tone: 'passive', t: "What did you get done?", r: "The ending. Finally. It's still wrong, but it's wrong in a better direction." },
        { tone: 'flirty', t: "Then I'll keep the good mood coming.", r: "Do. Moderately. Too much and I'll get suspicious, and then nothing gets done." },
      ] },
      { tone: 'passive', t: "Six hours? Is it going well?", r: "Well is too strong. It's going. With me, that's practically a celebration.", opts: [
        { tone: 'cold', t: "Don't let me distract you.", r: "You won't. I have a gift for not being distracted. ...I'm told it's not a gift." },
        { tone: 'passive', t: "When will it be finished?", r: "When I stop hating it. Could be next week. Could be never. Never is very common." },
        { tone: 'flirty', t: "So I'm good for you.", r: "Too soon to tell. You're good for my output. The rest is under review." },
      ] },
      { tone: 'flirty', t: "Who told you it was unusual?", r: "Someone who knows me. You don't, yet. That 'yet' slipped out. Don't pick it up.", opts: [
        { tone: 'cold', t: "I'll leave it there.", r: "Wise. Leave it, and leave. I'll be busy being productive, apparently." },
        { tone: 'passive', t: "I'd like to, though. Know you.", r: "Most people say that and mean 'be liked by you'. I'll find out which you mean." },
        { tone: 'flirty', t: "Too late. Picked it up. Keeping it.", r: "Thief. ...Keep it somewhere safe, then. It doesn't come in pairs." },
      ] },
    ] },

  // ---- slot 5: the tea test - there is a wrong answer. Establishes: black tea, add nothing ---------------------------
  { id: 'ice-new-5-cold', stage: 'new', slot: 5, mood: 'cold',
    say: "You were distant last time. So, a test, to see if there's any point. Tea or coffee. One of them is wrong.",
    opts: [
      { tone: 'cold', t: "I don't take tests.", r: "Everyone takes tests. Some just don't know they're failing. Interesting gambit, though.", opts: [
        { tone: 'cold', t: "Then call it a fail.", r: "No. I'll call it a refusal. Rarer. I'll think about it in my own time." },
        { tone: 'passive', t: "Tea. If I have to choose.", r: "Correct, reluctantly. Black, I hope. Things are better with nothing added." },
        { tone: 'flirty', t: "Whatever you're having.", r: "Spineless. Flattering. ...I'm having tea. You'd have been right. Irritating." },
      ] },
      { tone: 'passive', t: "Tea.", r: "Correct. How?", opts: [
        { tone: 'cold', t: "It's a drink. Don't overthink it.", r: "I overthink everything. It's how I'm right about tea. Off you go." },
        { tone: 'passive', t: "Black. Nothing in it.", r: "Nothing in it. Good. Add nothing to anything good. That's the whole of my philosophy." },
        { tone: 'flirty', t: "However you make it.", r: "I make it properly. You'd know, if you'd ever been invited. You haven't. Yet." },
      ] },
      { tone: 'flirty', t: "Whichever gets me a second cup with you.", r: "Neither. That was the wrong answer. There were two wrong answers, it turns out.", opts: [
        { tone: 'cold', t: "Coffee, then. To spite you.", r: "Coffee. Of course. I'll remember this. I remember everything." },
        { tone: 'passive', t: "Alright. Tea. Black.", r: "...Correct. You've recovered. I'll strike the first answer from the record." },
        { tone: 'flirty', t: "Then I'll make the tea myself. For you.", r: "You'd ruin it. I'd drink it anyway, out of curiosity. That's all that would be." },
      ] },
    ] },
  { id: 'ice-new-5-passive', stage: 'new', slot: 5, mood: 'passive',
    say: "Tea or coffee. Don't look at me like that. There is a wrong answer, and I want to know which kind you are.",
    opts: [
      { tone: 'cold', t: "Coffee. Strong.", r: "Wrong. Confidently wrong. There's something to be said for that. Not much.", opts: [
        { tone: 'cold', t: "Then I'm wrong.", r: "Unapologetically. I'll grant you that. It's the only thing I'll grant you today." },
        { tone: 'passive', t: "What's wrong with coffee?", r: "It shouts. Tea waits. I prefer things that wait. Draw your own conclusions." },
        { tone: 'flirty', t: "Convert me, then.", r: "Missionary work. Not my area. ...I'll make you a cup sometime. Purely for the science." },
      ] },
      { tone: 'passive', t: "Tea, I think.", r: "You think. Commit, or don't answer. ...But yes. Correct.", opts: [
        { tone: 'cold', t: "Tea. Committed.", r: "Better. Now stand by it when someone offers you something frothy. Few do." },
        { tone: 'passive', t: "How do you take yours?", r: "Black. Nothing added. People ruin good things by adding to them." },
        { tone: 'flirty', t: "I'd commit to most things with you.", r: "Most. A hedge. You hedge like a professional. I'll allow it for now." },
      ] },
      { tone: 'flirty', t: "Depends who's making it.", r: "Evasive and suggestive. Two qualities I didn't ask for. I'm making it, hypothetically.", opts: [
        { tone: 'cold', t: "Then coffee.", r: "Then nothing, apparently. That's fine. I drink tea alone very successfully." },
        { tone: 'passive', t: "Then tea. Black, no sugar.", r: "Correct. You hid it under a flirt, but you got there. Messy. Effective." },
        { tone: 'flirty', t: "In that case, whatever you pour.", r: "Dangerous answer. I pour very strong. Most people don't finish. We'll see about you." },
      ] },
    ] },
  { id: 'ice-new-5-flirty', stage: 'new', slot: 5, mood: 'flirty',
    say: "You were almost charming last time. Let's see if it holds. Tea or coffee? Think carefully. I'm keeping score.",
    opts: [
      { tone: 'cold', t: "I don't care either way.", r: "Indifference. Rarely the right answer. Always the most restful. You're forgiven, mostly.", opts: [
        { tone: 'cold', t: "Keep score if you like.", r: "I always do. Your column is short and oddly tidy." },
        { tone: 'passive', t: "Tea, if pushed.", r: "Pushed is fine. Correct is correct. A point to you, then. Black, nothing added." },
        { tone: 'flirty', t: "Who's winning?", r: "Me, naturally. But you're closer than you were. Don't sprint." },
      ] },
      { tone: 'passive', t: "Tea. Obviously.", r: "Correct. Though I dislike 'obviously'. Rare, in your line of work. The rest drink sugar from cans.", opts: [
        { tone: 'cold', t: "I'm not like them.", r: "So far. I've known you a very short time. Don't make speeches." },
        { tone: 'passive', t: "Black, no milk, nothing.", r: "Good. Nothing added. Everything good gets spoiled by additions." },
        { tone: 'flirty', t: "Do I win a cup with you?", r: "You win the right to ask again some other day. That's a better prize than it sounds." },
      ] },
      { tone: 'flirty', t: "Whichever one keeps you talking to me.", r: "Tea, then. It takes longer to drink. ...I've just told you how to keep me. Forget that.", opts: [
        { tone: 'cold', t: "Forgotten.", r: "Suspiciously quick, but good. I'll go and drink it alone." },
        { tone: 'passive', t: "Tea it is. How do you take it?", r: "Black. Nothing in it. The less you add, the more you taste. Most people can't stand that." },
        { tone: 'flirty', t: "Not a chance. I'm keeping that one.", r: "Then it's a secret we share. I don't usually share. Look after it." },
      ] },
    ] },
  // ---- slot 6: the grandmother - ninety-one, by the sea, approves of nobody; never explain, never apologise ----------
  { id: 'ice-new-6-cold', stage: 'new', slot: 6, mood: 'cold',
    say: "You were brusque last time. My grandmother would like you. She likes nobody, which is roughly the same thing.",
    opts: [
      { tone: 'cold', t: "Sounds like a sensible person.", r: "She is. Ninety-one, terrifying, never wrong. She'd look at you once and file you.", opts: [
        { tone: 'cold', t: "Suits me.", r: "It would. You two would sit in silence for an hour and call it a lovely afternoon." },
        { tone: 'passive', t: "Where would she file me?", r: "Under 'acceptable posture, poor timekeeping'. She'd be right about both." },
        { tone: 'flirty', t: "And you? Where have you filed me?", r: "Under review. Still. Ask again and I'll move you to 'pushy'. ...I won't." },
      ] },
      { tone: 'passive', t: "Tell me about her.", r: "She taught me chess. And three rules: never explain, never apologise, always bring a coat.", opts: [
        { tone: 'cold', t: "Explains a lot.", r: "It explains nothing. That's the first rule. Do keep up." },
        { tone: 'passive', t: "Do you follow all three?", r: "I always bring a coat. The other two I break about once a year, and regret it." },
        { tone: 'flirty', t: "Will you explain yourself to me, eventually?", r: "Eventually is a long word. Perhaps. Bring a coat, in case." },
      ] },
      { tone: 'flirty', t: "And would you? Like me?", r: "I'm her grandchild. I don't 'like'. I review. You're still being reviewed.", opts: [
        { tone: 'cold', t: "Take your time.", r: "I will. I always do. Most people can't stand it. You seem fine with it. Hm." },
        { tone: 'passive', t: "What would she make of you liking me?", r: "She'd say nothing. Then she'd ask about you every Sunday until I gave in." },
        { tone: 'flirty', t: "I'll wait. I'm worth the review.", r: "Everyone says that. You said it like you believed it, which is new." },
      ] },
    ] },
  { id: 'ice-new-6-passive', stage: 'new', slot: 6, mood: 'passive',
    say: "You remind me of my grandmother. That's a compliment. She doesn't fill silences either.",
    opts: [
      { tone: 'cold', t: "Silence is underrated.", r: "She'd agree. Then she'd beat you at chess without a word. She's ninety-one. She'd still win.", opts: [
        { tone: 'cold', t: "I don't play chess.", r: "Then you'd lose quickly. She'd respect that more than losing slowly." },
        { tone: 'passive', t: "Is she where you get it from?", r: "The eyebrow, the standards, the coat. 'Never explain, never apologise.' I mostly don't." },
        { tone: 'flirty', t: "Introduce us. I'll lose gracefully.", r: "Nobody meets her. ...I'll hold that thought somewhere very high up." },
      ] },
      { tone: 'passive', t: "Are you close?", r: "I call her every Sunday. She lives by the sea. We talk for four minutes. It's the best part of my week.", opts: [
        { tone: 'cold', t: "Four minutes isn't much.", r: "It's perfect. Everything after four minutes is padding. Remember that." },
        { tone: 'passive', t: "What do you talk about?", r: "Her neighbours, who disappoint her. My work, which disappoints me. Then she hangs up first." },
        { tone: 'flirty', t: "Will you mention me on Sunday?", r: "If I do, it'll be one sentence, and you'll never know what it was." },
      ] },
      { tone: 'flirty', t: "So I remind you of someone you love.", r: "That's a leap. Cleanly made, I'll grant you. I'll neither confirm nor deny.", opts: [
        { tone: 'cold', t: "Forget it. Just a thought.", r: "Already forgotten. I'm very good at forgetting things I'll remember later." },
        { tone: 'passive', t: "Tell me about her, then.", r: "Ninety-one. By the sea. Her rules: don't explain yourself, don't apologise, and carry a coat." },
        { tone: 'flirty', t: "I'll take that as a yes.", r: "Take it however you like. I'm not handing out receipts." },
      ] },
    ] },
  { id: 'ice-new-6-flirty', stage: 'new', slot: 6, mood: 'flirty',
    say: "I mentioned you to my grandmother on Sunday. One sentence. She asked three questions. She's never asked three.",
    opts: [
      { tone: 'cold', t: "I'm not sure I like being discussed.", r: "You weren't discussed. You were mentioned. Discussion takes four minutes. You got forty seconds.", opts: [
        { tone: 'cold', t: "Forty seconds is plenty.", r: "It is. She thought so too. She hung up on me. That's high praise." },
        { tone: 'passive', t: "What did she ask?", r: "Your name. Whether you stand up straight. Whether you made me laugh. I answered two." },
        { tone: 'flirty', t: "Next time, give me the four minutes.", r: "Greedy. ...She'd like that, actually. Never ask me to repeat that." },
      ] },
      { tone: 'passive', t: "What were the questions?", r: "Do they stand up straight. Do they talk too much. Do they make you laugh.", opts: [
        { tone: 'cold', t: "I don't need her approval.", r: "No. But she'll give it or withhold it regardless. She's generous that way." },
        { tone: 'passive', t: "What did you answer?", r: "Yes. No. And I changed the subject. She noticed. She notices everything. You see where I get it." },
        { tone: 'flirty', t: "Tell her yes to all three.", r: "I don't lie to her. ...I'll consider whether it's a lie. Give me time." },
      ] },
      { tone: 'flirty', t: "So I'm worth three questions.", r: "To her. To me, you're worth about one and a half. That's not nothing. Ask anyone.", opts: [
        { tone: 'cold', t: "Half a question. Generous.", r: "It is. Most people are a footnote. Off you go, half-question." },
        { tone: 'passive', t: "What's she like?", r: "Ninety-one. Lives by the sea. Taught me chess, and never to explain myself. I'm explaining. See what you do." },
        { tone: 'flirty', t: "I'll work on the other half.", r: "Do. Slowly. She'd tell you rushing is vulgar, and she'd be right." },
      ] },
    ] },

  // ---- slot 7: they watched your race - 'for research' --------------------------------------------------------------
  { id: 'ice-new-7-cold', stage: 'new', slot: 7, mood: 'cold',
    say: "I watched {last}. For research. You were curt with me, and I wanted to see if you drive that way.",
    opts: [
      { tone: 'cold', t: "Research. Sure.", r: "Sarcasm. Noted. You drive more politely than you speak. One lap was almost graceful.", opts: [
        { tone: 'cold', t: "Almost.", r: "Almost. I don't round up. You'll have to do it properly next time." },
        { tone: 'passive', t: "You watched the whole thing?", r: "Every lap. With the sound off. I'm not an animal." },
        { tone: 'flirty', t: "Watch the next one with me there.", r: "In person? Crowds. Noise. Ear defenders. ...I'll consider it, which is more than most get." },
      ] },
      { tone: 'passive', t: "What did your research find?", r: "You brake later than the others. You're patient in traffic. You talk to yourself, I'd bet.", opts: [
        { tone: 'cold', t: "That's private.", r: "It is now. I won't ask. I'll simply wonder. Very scientific." },
        { tone: 'passive', t: "I do talk to myself. Constantly.", r: "I knew it. You have the face of someone who narrates. Kindly, I hope." },
        { tone: 'flirty', t: "Mostly about you, lately.", r: "Lately. We've known each other five minutes. ...I'll pretend I didn't enjoy that." },
      ] },
      { tone: 'flirty', t: "You watched me. I'm flattered.", r: "I watched a race. You happened to be in it. Flatter yourself in your own time.", opts: [
        { tone: 'cold', t: "I will.", r: "Do. Quietly, somewhere I'm not. Enjoy yourself." },
        { tone: 'passive', t: "Okay, okay. What did you think?", r: "Competent. Occasionally more than that. I'm not elaborating." },
        { tone: 'flirty', t: "But you chose a race I was in.", r: "They're all races you're in. ...Fine. I chose it. Don't make that face." },
      ] },
    ] },
  { id: 'ice-new-7-passive', stage: 'new', slot: 7, mood: 'passive',
    say: "I watched {last}. Don't look like that. I watch all sorts of things. Documentaries. Paint drying, once.",
    opts: [
      { tone: 'cold', t: "You don't have to explain.", r: "I never explain. ...I was explaining a little. Stop noticing things.", m: 2, opts: [
        { tone: 'cold', t: "I notice what I like.", r: "So do I. I'm noticing you're very calm about this. It's unsettling. Enjoy {venue}." },
        { tone: 'passive', t: "So what did you think?", r: "The second stint was good. Clean. The first was nerves. Tell me I'm wrong." },
        { tone: 'flirty', t: "You can explain yourself to me any time.", r: "I could. I won't. But you've reached the top of a very short list." },
      ] },
      { tone: 'passive', t: "What did you make of it?", r: "You're better behind someone. Something about a target. I found it instructive.", opts: [
        { tone: 'cold', t: "I'm better in front.", r: "Everyone is better in front. The interesting ones are better hunting. Never mind." },
        { tone: 'passive', t: "That's actually spot on.", r: "I know. I watched it twice. Only to check my notes. Don't read anything into it." },
        { tone: 'flirty', t: "Maybe I like a chase.", r: "Maybe. So do I. Don't make a theme of it." },
      ] },
      { tone: 'flirty', t: "Did you watch me or the race?", r: "The race. Mostly. There's a camera in the car. It's not my fault where they point it.", opts: [
        { tone: 'cold', t: "Fine. The race.", r: "The race. Agreed. We'll keep that version for public consumption." },
        { tone: 'passive', t: "What did you think of the race, then?", r: "Long. Loud. Better at the end. Rather like some people I could name." },
        { tone: 'flirty', t: "Mostly isn't entirely.", r: "Mostly is a very careful word. I chose it. Read it as you like." },
      ] },
    ] },
  { id: 'ice-new-7-flirty', stage: 'new', slot: 7, mood: 'flirty',
    say: "I watched {last}. Twice. The second time for the parts you were in. Say nothing. I mean it.",
    opts: [
      { tone: 'cold', t: "Nothing to say.", r: "Good. You'd have ruined it. Your silence was perfectly judged. Infuriatingly so.", opts: [
        { tone: 'cold', t: "Silence is easy.", r: "For you. Some of us have to work at it. Go on, then. Be easy somewhere else." },
        { tone: 'passive', t: "Which part did you like?", r: "One pass, late on. Patient, then ruthless. I respect that, in drivers and in people." },
        { tone: 'flirty', t: "I'll say nothing. I'll just smile.", r: "Unbearable. Stop. ...Not entirely. A little less." },
      ] },
      { tone: 'passive', t: "And the verdict on my driving?", r: "Good. Not perfect. You lost two tenths in the middle being polite to someone.", opts: [
        { tone: 'cold', t: "I'll stop being polite.", r: "On track, please. Off it, you're borderline as it is." },
        { tone: 'passive', t: "You noticed that?", r: "I notice everything. It's not a talent, it's a condition. You're the current symptom." },
        { tone: 'flirty', t: "You watched me closely.", r: "I watched closely. You happened to be in frame. Constantly. I'm not apologising." },
      ] },
      { tone: 'flirty', t: "Twice. I'll be thinking about that.", r: "Don't. It was a slow evening. ...It wasn't. Leave it there.", opts: [
        { tone: 'cold', t: "It's left.", r: "Thank you. You're better at leaving things than most. I'll admire that elsewhere." },
        { tone: 'passive', t: "Was it worth the second time?", r: "It was worth a second time. I'll see whether you're worth a third." },
        { tone: 'flirty', t: "Next time watch it with me.", r: "Next to you, while you watch yourself? Unbearable. ...Possibly. Ask nearer the time." },
      ] },
    ] },

  // ---- slot 8: you made them laugh. They want it noted that they resisted ------------------------------------------
  { id: 'ice-new-8-cold', stage: 'new', slot: 8, mood: 'cold',
    say: "You were cold last time and it made me laugh. On the way home. Alone. I want it noted that I resisted.",
    opts: [
      { tone: 'cold', t: "It's noted.", r: "Dry. Very dry. You're doing it again, and I'm resisting again.", opts: [
        { tone: 'cold', t: "Don't let me keep you.", r: "You won't. You can't. ...You're doing quite well at it, though." },
        { tone: 'passive', t: "What was funny?", r: "The way you said 'right' when you meant 'go away'. I've started using it. At work." },
        { tone: 'flirty', t: "One day you'll laugh in front of me.", r: "One day. Not today. Today I'm made of granite. Mostly." },
      ] },
      { tone: 'passive', t: "What made you laugh?", r: "Something you said. I won't repeat it; you'd only try it again. It works by accident.", opts: [
        { tone: 'cold', t: "Then I won't try.", r: "Wise. Effort kills it. Go and be accidental somewhere else." },
        { tone: 'passive', t: "I'll take an accidental laugh.", r: "You'll have to. I don't do the other kind. ...I didn't, until recently." },
        { tone: 'flirty', t: "I like that I can do that.", r: "Don't get attached. It was one laugh. I'm counting them. There've been two." },
      ] },
      { tone: 'flirty', t: "Next time I'll make you laugh in public.", r: "Ambitious. I've laughed in public twice in my life. Once was at an opera. It was meant to be a tragedy.", opts: [
        { tone: 'cold', t: "Never mind, then.", r: "Minded. No. Unminded. ...You've unsettled my vocabulary. Go." },
        { tone: 'passive', t: "What was the other time?", r: "A child explained a sunset to me, very seriously. It was correct. I laughed. Its parent was furious." },
        { tone: 'flirty', t: "I'll be the third.", r: "Accident doesn't count. Do it on purpose, in daylight, and we'll talk." },
      ] },
    ] },
  { id: 'ice-new-8-passive', stage: 'new', slot: 8, mood: 'passive',
    say: "You made me laugh last time. Out loud. I've had to reconsider several things about you.",
    opts: [
      { tone: 'cold', t: "Don't reconsider too much.", r: "Too late. You've moved from 'unremarkable' to 'mildly hazardous'. It's a promotion.", opts: [
        { tone: 'cold', t: "I'll try not to be hazardous.", r: "Don't try. Trying never works with me. Just carry on being an accident." },
        { tone: 'passive', t: "What else have you reconsidered?", r: "Whether you're as simple as you look. You aren't. Irritating. I like simple." },
        { tone: 'flirty', t: "Hazardous sounds fun.", r: "It's meant to be a warning sign. ...You read it like an invitation." },
      ] },
      { tone: 'passive', t: "I didn't know you could laugh.", r: "Neither do most people. It's not in the brochure. Keep it to yourself.", opts: [
        { tone: 'cold', t: "Your secret's safe. Not that I care.", r: "Exactly the right amount of not caring. You're dangerous like this." },
        { tone: 'passive', t: "It suits you.", r: "Things suit me. I'm very careful about which things. This one's on trial." },
        { tone: 'flirty', t: "I want to hear it again.", r: "Then earn it again. Same terms. No rehearsing; I'll know." },
      ] },
      { tone: 'flirty', t: "Good. I've been trying.", r: "Ah. Don't tell me that. It works because I think you're not trying.", opts: [
        { tone: 'cold', t: "Then I'm not.", r: "Better. Lie to me like that more often. It's nearly charming." },
        { tone: 'passive', t: "Fair. I'll stop trying.", r: "Thank you. Effort ruins comedy. And most dinners." },
        { tone: 'flirty', t: "I'll try harder, then.", r: "Insufferable. ...You made me smile. That's a different column. I keep separate books." },
      ] },
    ] },
  { id: 'ice-new-8-flirty', stage: 'new', slot: 8, mood: 'flirty',
    say: "Something you said last time keeps coming back to me, and I keep smiling at walls. Explain yourself.",
    opts: [
      { tone: 'cold', t: "I don't remember what I said.", r: "Of course you don't. You were funny by accident. The best kind. The worst, for me.", opts: [
        { tone: 'cold', t: "Then it doesn't matter.", r: "It doesn't. It's just a wall. It's just a smile. Goodbye." },
        { tone: 'passive', t: "Tell me what it was, then.", r: "No. It would wear out. Some things are better kept in a drawer." },
        { tone: 'flirty', t: "I'll keep talking until I hit it again.", r: "That's a strategy, not an accident. I'll know the difference. Good luck." },
      ] },
      { tone: 'passive', t: "Which bit?", r: "I won't say. If you knew, you'd do it on purpose, and it would stop working.", opts: [
        { tone: 'cold', t: "Fine. Keep it.", r: "I will. I keep most things. That's not a confession." },
        { tone: 'passive', t: "Fair. What kind of walls?", r: "Plain. White. Formerly peaceful. Now they have this look, as if they know something." },
        { tone: 'flirty', t: "I'll do it on purpose anyway.", r: "You'll fail. Charmingly. Possibly. I'll judge it when it happens." },
      ] },
      { tone: 'flirty', t: "No. I like you smiling at walls.", r: "Then I'll smile at that wall right now. Look at it. Not me. ...You looked at me.", opts: [
        { tone: 'cold', t: "I looked at the wall.", r: "Liar. Fine. Look at the wall. Some of us were having a moment." },
        { tone: 'passive', t: "Sorry. Habit.", r: "A new habit. I'll allow it, briefly. Don't let it become a routine." },
        { tone: 'flirty', t: "You're better than the wall.", r: "Higher praise than you know. I like that wall. ...Go, before I smile again." },
      ] },
    ] },

  // ---- slot 9: chapter end. The review is complete: 'provisionally interesting'. A number, a proper evening --------
  { id: 'ice-new-9-cold', stage: 'new', slot: 9, mood: 'cold',
    say: "You've been cool. I've been cooler. Still, the review's finished. Do you want the verdict, or shall we keep pretending?",
    opts: [
      { tone: 'cold', t: "Keep pretending.", r: "Very well. I'll leave the verdict on the table. Face down. It isn't bad news.", opts: [
        { tone: 'cold', t: "I won't turn it over.", r: "Good. Then nothing changes. You're less trouble that way. Slightly less." },
        { tone: 'passive', t: "Fine. Turn it over.", r: "Provisionally interesting. The highest grade I give a stranger. You're not one now." },
        { tone: 'flirty', t: "Not bad news? Tell me more.", r: "No. You'll have to see me again. There. That's the whole verdict, really." },
      ] },
      { tone: 'passive', t: "Go on. What's the verdict?", r: "Provisionally interesting. Don't celebrate. 'Provisionally' does a great deal of work.", opts: [
        { tone: 'cold', t: "I'll live with it.", r: "You will. You're good at that. It's one of the reasons. Go on, then." },
        { tone: 'passive', t: "What happens now?", r: "Now you have my number. My private one. Very few people do. Use it like a grown-up." },
        { tone: 'flirty', t: "I'll work on the 'provisionally'.", r: "I know. That's why I gave you the grade. ...Dinner. Next week. Don't make it a thing." },
      ] },
      { tone: 'flirty', t: "I already know it. You like me.", r: "Arrogant. Also, irritatingly, not incorrect. Don't repeat it.", opts: [
        { tone: 'cold', t: "I won't.", r: "Good. One of us has to keep this dignified. Apparently it's you. Off you go." },
        { tone: 'passive', t: "So what now?", r: "Now I give you my number. Don't waste it on 'hey'. I ignore 'hey'." },
        { tone: 'flirty', t: "Say it once. I'll keep it secret.", r: "I like you. Provisionally. That's all. Never repeat it to anyone, especially me." },
      ] },
    ] },
  { id: 'ice-new-9-passive', stage: 'new', slot: 9, mood: 'passive',
    say: "I've finished my review of you. It took longer than usual. That alone is informative. Would you like the result?",
    opts: [
      { tone: 'cold', t: "Not especially.", r: "Only you would say that. It's become your best feature. You passed. More than passed.", m: 2, opts: [
        { tone: 'cold', t: "Good to know.", r: "Your enthusiasm is overwhelming. Keep it. It's half of why you passed." },
        { tone: 'passive', t: "What does 'more than passed' mean?", r: "It means you have my number. My real one. I don't hand it out. I've handed it out." },
        { tone: 'flirty', t: "More than passed. I'll take that.", r: "Take it carefully. It's fragile. It's taken me weeks to say." },
      ] },
      { tone: 'passive', t: "Yes. Tell me.", r: "Provisionally interesting. The best grade I give. I've given it twice. You, and a cellist, years ago.", opts: [
        { tone: 'cold', t: "Provisionally. Right.", r: "Yes. Right. Your sarcasm's improving. I'd miss it, if you vanished. Don't." },
        { tone: 'passive', t: "So what happens next?", r: "Next, you take me to dinner. Somewhere quiet. Nobody takes a photograph. Then we see." },
        { tone: 'flirty', t: "Which grade comes after that?", r: "There isn't a name for it. I've never had to give it. ...Stop looking at me like that." },
      ] },
      { tone: 'flirty', t: "Let me guess. You like me.", r: "Guessing is vulgar. Being right is worse. ...Yes. Provisionally. Don't ruin it.", opts: [
        { tone: 'cold', t: "I won't ruin it. Or chase it.", r: "Perfect. Don't chase. I'll walk slowly, and you'll walk slowly, and we'll see." },
        { tone: 'passive', t: "Okay. Where do we go from here?", r: "Somewhere quiet. Dinner. You'll choose. I'll judge. That's the arrangement." },
        { tone: 'flirty', t: "Provisionally is enough for now.", r: "For now. Those two words are going to cause us both trouble. I'm looking forward to it." },
      ] },
    ] },
  { id: 'ice-new-9-flirty', stage: 'new', slot: 9, mood: 'flirty',
    say: "I've decided something about you. I don't usually say these out loud. Brace yourself, and don't smile until I've finished.",
    opts: [
      { tone: 'cold', t: "I'll manage.", r: "You're provisionally interesting. Top grade. It's rarely given. Your face is doing the thing.", opts: [
        { tone: 'cold', t: "My face is doing nothing.", r: "It's doing nothing very loudly. Fine. Keep the grade. Keep the face." },
        { tone: 'passive', t: "What does provisionally mean?", r: "It means I'd like to see you somewhere without twenty people watching. That's all it means." },
        { tone: 'flirty', t: "Is this where you ask me out?", r: "This is where I let you ask. I'm being generous. Get on with it." },
      ] },
      { tone: 'passive', t: "Go on. I'm braced.", r: "I'd like to see you. Properly. Not between other things. ...You're smiling. I said don't.", opts: [
        { tone: 'cold', t: "I'm not smiling.", r: "You're terrible at it. Never mind. Thursday. I'll send an address. Don't be late." },
        { tone: 'passive', t: "I'd like that.", r: "Good. Three words, no decoration. That's how it's done. You've been paying attention." },
        { tone: 'flirty', t: "Too late. I've been smiling the whole time.", r: "I saw. I let it go. That's the clearest thing I'll ever say to you. Thursday." },
      ] },
      { tone: 'flirty', t: "You like me. It's alright, you can say it.", r: "I can. I won't. I'll show you, in my own time. My own time starts about now.", opts: [
        { tone: 'cold', t: "Show me, then.", r: "With that tone? Next week. Earn the thaw. You have my number." },
        { tone: 'passive', t: "Okay. In your own time.", r: "Thank you. You respect a pace. Nobody does that. You do it." },
        { tone: 'flirty', t: "I'll be waiting. Patiently.", r: "Not too patiently. I'd hate to be waited for forever. Thursday will do." },
      ] },
    ] },
];
