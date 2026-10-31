// RUDE - in person, stage 'warm': getting closer. Sparring still earns respect; flirting quietly works now; risque gets a
// 'bold of you'. Slots: 1 the hate-film plan, 2 the soap they love, 3 you're struggling, 4 your hair / your fans,
// 5 people leave, 6 watching your race 'for the cat', 7 do something about it, 8 the week was boring, 9 'we're dating'.
export const DATA = [
  // ---- slot 1: not a date, a hate ---------------------------------------------------------------------------------
  { id: 'rude-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "You were vicious last time. Fine. Truce terms: there's an awful film out. We go, we hate it together. It's not a date. It's a hate.",
    opts: [
      { tone: 'cold', t: "Why would I spend two hours next to you?", r: "Because I'm the best company for hating things. Everyone else just whimpers. Ask anyone. Ask nobody.", opts: [
        { tone: 'cold', t: "Fine. But I'm picking the seats.", r: "You'll pick badly. I'll allow it. Then I'll move us. That's the deal. Good." },
        { tone: 'passive', t: "What's the film even about?", r: "A wedding, a dog, a misunderstanding, a song. It's been nominated for things. Disgusting." },
        { tone: 'flirty', t: "Two hours in the dark with you. I'm in.", r: "It's a cinema, not a confession booth. ...You're in. Fine. Bring your worst opinions." },
      ] },
      { tone: 'passive', t: "Sure, sounds fun.", r: "'Sounds fun.' Wow. You'd say that about a dental appointment. It isn't fun, it's a mission.", opts: [
        { tone: 'cold', t: "A mission. You're so dramatic.", r: "I'm exactly dramatic enough. Ha. Better. You're coming. That's an order. Kindly." },
        { tone: 'passive', t: "What time should I come?", r: "Early. Late people ruin films. So do people who whisper. You look like a whisperer. Don't." },
        { tone: 'flirty', t: "A mission with you. I'll wear something nice.", r: "Wear something you won't mind sighing in. ...Nice is fine. Don't overdo it." },
      ] },
      { tone: 'flirty', t: "Not a date? You sure about that?", r: "Very sure. Dates have flowers. This has contempt. Very different budget.", opts: [
        { tone: 'cold', t: "Good. I wasn't planning on flowers.", r: "Excellent. Flowers are a cliché. Bring contempt. Bring snacks. Contempt and snacks." },
        { tone: 'passive', t: "Okay. Contempt it is.", r: "Contempt, and an open mind. Open just enough to mock things. You're good at that bit." },
        { tone: 'flirty', t: "I'll bring flowers anyway. Out of spite.", r: "Out of spite. Oh. That's the most romantic thing anyone's said to me. I hate you. Bring them." },
        { tone: 'risque', t: "And if we skip the film entirely?", r: "Bold of you. Very bold. The answer's no. The answer's 'ask again in a month'. It's no." },
      ] },
    ] },
  { id: 'rude-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "I have a proposal. There's a terrible film out. Everyone loves it. We go, we sit at the back, we hate it. Not a date. A hate.",
    opts: [
      { tone: 'cold', t: "A hate. You're unhinged.", r: "Correct, and so are you, or you'd have said no. You didn't. Look at you. Unhinged.", opts: [
        { tone: 'cold', t: "I didn't say yes either.", r: "You'll say it. You've got the air of someone who already bought tickets. Fine. I bought them." },
        { tone: 'passive', t: "Which film is it?", r: "The one where a dog saves Christmas in July. It has a montage. Several montages." },
        { tone: 'flirty', t: "Unhinged together. Sounds perfect.", r: "Don't make it sound like a wedding vow. ...It does sound perfect. Shut up. You're coming." },
      ] },
      { tone: 'passive', t: "Okay. I'm free next week.", r: "Free next week. Thrilling. You make plans like a spreadsheet. Fine. Next week.", opts: [
        { tone: 'cold', t: "Spreadsheets are underrated. Like you.", r: "Ha. Okay. That stung, then didn't. I'm underrated. Correct. Next week." },
        { tone: 'passive', t: "Should I invite anyone else?", r: "No. Others will ruin it with enjoyment. It's just us. Strategically. Not romantically." },
        { tone: 'flirty', t: "I'll clear the whole week for you.", r: "Clear one evening. The whole week is clingy. ...Clear two. As a backup. Logistics." },
      ] },
      { tone: 'flirty', t: "A date disguised as a hate. Clever.", r: "It's not disguised. It's a hate wearing a hate costume. Under which is more hate. Stop smiling.", opts: [
        { tone: 'cold', t: "Fine. A hate. I'll hate it harder than you.", r: "Impossible. I'm a professional. But I welcome the challenge. Bring your worst scowl." },
        { tone: 'passive', t: "Okay. I'll stop. When is it?", r: "Soon. Before I change my mind. Which I won't. Which I might. Soon." },
        { tone: 'flirty', t: "And under all the hate?", r: "Under the hate is... a slightly better seat for you than for me. That's all. That's everything. Go away." },
        { tone: 'risque', t: "Back row. Lights off. Bold plan.", r: "Bold of you. I'm going to watch the film. The entire film. ...Mostly the film. No." },
      ] },
    ] },
  { id: 'rude-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Stop looking at me like that. Look at this instead: a film so bad it's trending. We're going to hate it together. Not a date.",
    opts: [
      { tone: 'cold', t: "I'd rather watch paint dry.", r: "Paint drying is the sequel. It's also terrible. Okay, fine, we'll do both. Double bill.", opts: [
        { tone: 'cold', t: "A double bill. You really have no life.", r: "I have a full life of hating things. It's rich. It's textured. You're invited. Barely." },
        { tone: 'passive', t: "Fine. One film. That's it.", r: "One film. Then a snack. Then a full review. You'll be home by midnight. Probably." },
        { tone: 'flirty', t: "Paint drying is fine if you're next to me.", r: "Ugh. Fine. That one was okay. It was almost nice. Don't do it near the paint." },
      ] },
      { tone: 'passive', t: "Okay, I'm in. Why this film?", r: "Because everyone loves it, and everyone is wrong. We're going on behalf of the truth.", opts: [
        { tone: 'cold', t: "You're going on behalf of your ego.", r: "Same thing. My ego is the truth's lawyer. Okay. Good. I like you when you're like this." },
        { tone: 'passive', t: "Do we need to dress up?", r: "Dress like you're going to disapprove of something. So, how you usually dress. Ha. Kidding. Mostly." },
        { tone: 'flirty', t: "Truth, justice and me in the next seat.", r: "You'll be in the next seat because I'm not climbing over strangers. Stop making it a poem." },
      ] },
      { tone: 'flirty', t: "You said 'not a date' very fast.", r: "Because it isn't one. Speed is accuracy. Look at your race times. Actually, don't.", opts: [
        { tone: 'cold', t: "Slow down, then. Say it with a straight face.", r: "Not a date. See? Straight. My face is always straight. It's disapproval at rest." },
        { tone: 'passive', t: "Okay. Not a date. Got it.", r: "Good. Established. Now stop saying 'got it'. It's the beige of agreement." },
        { tone: 'flirty', t: "Not a date. But I'm holding your hand.", r: "You're holding the popcorn. My hand is... adjacent. Accidentally. Don't look at it." },
        { tone: 'risque', t: "Then what happens after the not-date?", r: "After it? We go home. Separately. Bold of you to think there's a director's cut." },
      ] },
    ] },

  // ---- slot 2: the soap they love (Lighthouse Lane) ------------------------------------------------------------------
  { id: 'rude-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "You were rude last time, so I'll say this fast: I watch a soap. Lighthouse Lane. Ironically. Laugh and I'll leave.",
    opts: [
      { tone: 'cold', t: "Ironically. Sure. You cry at it, don't you?", r: "Once. A lighthouse keeper's dog found its way home. Everyone cried. It was a national event.", opts: [
        { tone: 'cold', t: "A national event. In your living room.", r: "My living room, the cat's living room, the nation's living room. Ha. You're sharp today." },
        { tone: 'passive', t: "What's it about, actually?", r: "Lighthouses. Feuds. Someone's twin returns every season. It's terrible. It's perfect. I'm not elaborating." },
        { tone: 'flirty', t: "I'd like to see you cry at a dog.", r: "You never will. I cry privately, like a dignified cat. ...You'd have to be there, though." },
      ] },
      { tone: 'passive', t: "I won't laugh. Everyone has something.", r: "Everyone has something, says the racing driver. What's yours? Don't say racing.", opts: [
        { tone: 'cold', t: "Mine's not watching soaps.", r: "Ooh. Okay. Fine. You'll be watching one soon. You'll be hooked. I'll be smug." },
        { tone: 'passive', t: "I don't know. Bad films, maybe?", r: "Bad films aren't a guilty pleasure, they're my calling. Try harder. Try embarrassing." },
        { tone: 'flirty', t: "My guilty pleasure is this. Talking to you.", r: "That's not guilty. That's just poor judgement. I'm flattered. Slightly. Stop." },
      ] },
      { tone: 'flirty', t: "Can I watch it with you?", r: "With me? Do you know what you're asking? I talk through it. I shout at the twin. It's ugly.", opts: [
        { tone: 'cold', t: "Sounds awful. I'll pass.", r: "Correct choice. It is awful. You'd love it. You'd be hooked. You're not ready." },
        { tone: 'passive', t: "I'd sit quietly. I promise.", r: "Quietly? While the twin returns? You'd scream. My cat hisses at the twin. Everyone reacts." },
        { tone: 'flirty', t: "Shout at the twin with me. I'll hold your hand.", r: "You'll hold the remote. Nobody holds my hand during the twin. ...During the dog, maybe." },
      ] },
    ] },
  { id: 'rude-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "I'm about to tell you something and you're not allowed to react. I watch Lighthouse Lane. The soap. Every episode. Ironically.",
    opts: [
      { tone: 'cold', t: "You can't be ironic about a soap. You're a fan.", r: "I'm a critic who has never missed an episode. That's a different word. ...It's 'fan'. Fine.", opts: [
        { tone: 'cold', t: "Say it. 'I love Lighthouse Lane.'", r: "No. I'll say 'I tolerate it intensely'. That's all you're getting. You're cruel. I like it." },
        { tone: 'passive', t: "How long's it been running?", r: "Thirty years. I've watched nineteen. That's not obsession. That's loyalty to a lighthouse." },
        { tone: 'flirty', t: "A fan. I find that very attractive.", r: "You'd flirt with a parking meter. ...I'm a nice parking meter. Fine." },
      ] },
      { tone: 'passive', t: "I've never seen it. Is it good?", r: "It's terrible. The acting is wooden. The lighthouse is fake. I've cried four times.", opts: [
        { tone: 'cold', t: "Four times. Your reputation's ruined.", r: "Only if you tell anyone. And you won't. Because I have your interview clips. Ha." },
        { tone: 'passive', t: "Where should I start?", r: "Season seven. Don't argue. Before seven it's just a lighthouse and some moods." },
        { tone: 'flirty', t: "Teach me. I'll be your soap student.", r: "Soap student. Like a cleaning course. ...Fine. Season seven. My sofa. The cat judges. Not a date." },
      ] },
      { tone: 'flirty', t: "That's adorable. You're adorable.", r: "I'm not adorable. I'm an adult with a soap habit. Adorable is for kittens and your worst decisions.", opts: [
        { tone: 'cold', t: "You're right. Not adorable. Just odd.", r: "Odd! Yes. Thank you. Odd I can live with. Odd's a compliment from you. I'll keep it." },
        { tone: 'passive', t: "Okay, okay. What's happening in it now?", r: "The twin's back. Again. Nobody's surprised but me. I'm surprised every time. That's the magic." },
        { tone: 'flirty', t: "I mean it. You light up talking about it.", r: "That's the lighthouse reflecting. Stop it. You're making me like you out loud." },
        { tone: 'risque', t: "Watch it with me. On the sofa. Lights off.", r: "Bold of you. You'd talk through the twin. Nobody talks through the twin. ...We'll see." },
      ] },
    ] },
  { id: 'rude-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "You're in a flirting mood. Don't be. I need to confess something embarrassing. Lighthouse Lane. The soap. I watch it. Don't.",
    opts: [
      { tone: 'cold', t: "That's not embarrassing. That's tragic.", r: "Tragic. Fine. That's the right word. You're good at words today. Tragic and proud.", opts: [
        { tone: 'cold', t: "Proud is a strong word for a soap.", r: "It's a strong soap. Thirty years. Twelve twins. I won't be shamed by someone who works in a onesie covered in logos." },
        { tone: 'passive', t: "What's the best episode?", r: "The storm one. Everyone's trapped in the lighthouse. Three proposals. I watched it twice. Don't." },
        { tone: 'flirty', t: "Tragic suits you.", r: "Nothing suits me. I wear things against their will. ...Okay. That was nice. Don't." },
      ] },
      { tone: 'passive', t: "I won't say anything. Promise.", r: "You'll say something. Everyone does. 'Lighthouse Lane? Really?' Wow. Nobody's ever said that.", opts: [
        { tone: 'cold', t: "Lighthouse Lane? Really?", r: "Ha. There it is. You couldn't resist. I respect a lack of restraint. It's rare." },
        { tone: 'passive', t: "I'll watch an episode. To understand.", r: "One episode? You'll understand nothing. You need three seasons and a breakdown." },
        { tone: 'flirty', t: "I'll watch it just so we have something.", r: "Something? Like a thing? We don't have things. We have sarcasm. Fine. Sarcasm and a lighthouse." },
      ] },
      { tone: 'flirty', t: "I love that you've got a soft spot.", r: "I don't have a soft spot. I have one specific soft lighthouse. That's not a spot, it's a landmark.", opts: [
        { tone: 'cold', t: "Landmarks get knocked down.", r: "Not this one. This one has a twin. Ha. Okay. You're quick. Too quick. Slow down." },
        { tone: 'passive', t: "Okay, a landmark. I'll respect it.", r: "Respect it from a distance. It's protected. Like a heritage site. Like me." },
        { tone: 'flirty', t: "Maybe I'm a landmark too.", r: "You're a roundabout. People go round you. ...I keep going round you. Shut up." },
        { tone: 'risque', t: "Show me your soft spot sometime.", r: "Bold of you. My soft spot is a sofa and a soap. You'd be bored. ...You'd be invited. Bold." },
      ] },
    ] },

  // ---- slot 3: you're struggling, and they noticed -------------------------------------------------------------------
  { id: 'rude-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "You look tired. Not in a romantic way. In a 'phone at four percent' way. What's going on? Talk. Quickly.",
    opts: [
      { tone: 'cold', t: "I'm fine. Drop it.", r: "Fine. Dropped. ...It's back. I picked it up. You don't seem fine. You seem like a damp receipt.", opts: [
        { tone: 'cold', t: "Thanks. Very supportive.", r: "I'm supportive like a crutch: ugly and essential. Okay. Say one true thing and I'll stop." },
        { tone: 'passive', t: "It's the season. It's a lot right now.", r: "Of course it's a lot. You're allowed to be bad at things. Like jokes. You're terrible at jokes. Feel better.", m: 1 },
        { tone: 'flirty', t: "Make me feel better, then.", r: "How? A pep talk? I'll give you a list of everyone worse than you. It's long. You'll sleep well." },
      ] },
      { tone: 'passive', t: "Honestly? The pressure's a lot right now.", r: "Okay. That's real. Here's real back: you're better than you think. You're also annoying. Both true.", m: 1, opts: [
        { tone: 'cold', t: "Don't go soft on me now.", r: "I'm not soft. That was structural honesty. Here's more: your hair today is a cry for help. Better?" },
        { tone: 'passive', t: "Thanks. I needed that.", r: "You needed the annoying part. The other part was an accident. Like everything nice I do.", m: 0 },
        { tone: 'flirty', t: "Better than I think? Say more.", r: "No. You'll frame it. Fine: you're the best thing I hate-watch. Done. Never again." },
      ] },
      { tone: 'flirty', t: "I'm fine now. You're here.", r: "Don't. Don't use a line to dodge. I can smell a dodge. What's actually wrong?", opts: [
        { tone: 'cold', t: "Fine. It's the team. They're not listening.", r: "Then talk louder. Or I'll talk louder for you. I'm very good at louder. Want me to?" },
        { tone: 'passive', t: "Just tired. Long week.", r: "Then sleep. Not now. Later. Now you sit here and I'll be rude about other people for you. Therapy." },
        { tone: 'flirty', t: "Okay. I just wanted to see you.", r: "That's not a dodge. That's worse. That's sincere. Ugh. Fine. You've seen me. Feel better." },
      ] },
    ] },
  { id: 'rude-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "You've been quiet for two minutes. That's a record. Something's wrong. Tell me, or I'll guess, and I'm a cruel guesser.",
    opts: [
      { tone: 'cold', t: "Nothing's wrong. Mind your business.", r: "You are my business. Unfortunately. Fine. I'll mind it from here, glaring. Glaring is support.", opts: [
        { tone: 'cold', t: "Glare away. I'm fine.", r: "You're lying, but with conviction. That's half of being fine. I'll allow it." },
        { tone: 'passive', t: "Okay. It's just been a hard week.", r: "Hard weeks are just long Tuesdays. You'll get through it. You're stubborn. It's your one gift.", m: 0 },
        { tone: 'flirty', t: "Your glaring is weirdly comforting.", r: "It's meant to be. It's a weighted blanket for the soul. Don't tell anyone it works." },
      ] },
      { tone: 'passive', t: "Just tired. It's been a long run.", r: "Then stop running. Sit. I'll do the talking. You'll hate it. It'll help.", m: 0, opts: [
        { tone: 'cold', t: "Your talking never helps.", r: "It always helps. You just don't like how. Okay, that's the spark back. Good. Keep it." },
        { tone: 'passive', t: "Okay. Talk at me, then.", r: "Someone spelled my name wrong on a coffee cup today. On purpose. I've drafted a complaint. Eight pages." },
        { tone: 'flirty', t: "I'd rather you held my hand.", r: "Hold your own hand. It's right there. ...Fine. Give it. For one minute. I'm timing it." },
      ] },
      { tone: 'flirty', t: "I'll tell you if you guess nicely.", r: "I don't guess nicely. I guess correctly. You're scared you're not good enough. Am I right?", opts: [
        { tone: 'cold', t: "Wrong. Way off.", r: "Liar. But okay. Keep your secret. I'll know anyway. I always know. It's my worst feature." },
        { tone: 'passive', t: "Yeah. Maybe. Sometimes.", r: "You are good enough. You're also smug and your music's bad. Balance. Now stop it.", m: 1 },
        { tone: 'flirty', t: "You'd still like me if I wasn't.", r: "'Like' is strong. I'd still tolerate you. Which is my version of a song. Don't make me sing it." },
      ] },
    ] },
  { id: 'rude-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "You're flirting less than usual. Which means something's wrong. Out with it. I'm not worried. I'm curious. Aggressively.",
    opts: [
      { tone: 'cold', t: "Nothing's wrong. Stop prying.", r: "I don't pry. I observe loudly. You're off. Off like milk. Like a joke. Talk.", opts: [
        { tone: 'cold', t: "Off like milk. Lovely. Thanks.", r: "You're welcome. I'm here all week. Fine. Keep it in. I'll be over here. Close by. Annoyingly." },
        { tone: 'passive', t: "It's the car. Nothing feels right.", r: "Then it's the car's fault, not yours. Say that out loud. ...Louder. Good. Now complain with me.", m: 0 },
        { tone: 'flirty', t: "Prying looks good on you.", r: "Stop deflecting with compliments. Fine. One compliment. Accepted. Filed. Now talk." },
      ] },
      { tone: 'passive', t: "Just tired. Nothing dramatic.", r: "Tired is dramatic for you. You're usually a golden retriever with a helmet. Sit. Rest. Don't bark.", opts: [
        { tone: 'cold', t: "Golden retriever. Wow. Thanks.", r: "It's a compliment. They're loyal and too loud. Ha. Okay. You're less tired already. Look." },
        { tone: 'passive', t: "Okay. I'll sit for a bit.", r: "Good. Sit. I'll guard you from small talk. It's what I'm built for. I'm a fortress." },
        { tone: 'flirty', t: "Will you pet me, then?", r: "Absolutely not. ...A pat. On the shoulder. Once. That's the entire budget." },
      ] },
      { tone: 'flirty', t: "Maybe I'm saving my flirting for later.", r: "Later. Like a dessert. No. You don't get to dodge with dessert. What's actually wrong?", opts: [
        { tone: 'cold', t: "Fine. I had a rough debrief. Done.", r: "Then whoever debriefed you is a two out of ten. Want me to tell them? I'll be thorough." },
        { tone: 'passive', t: "Nothing big. A rough week.", r: "Rough weeks pass. Unlike your braking. Ha. Sorry. Not sorry. You're fine. You'll be fine." },
        { tone: 'flirty', t: "Okay. I wanted you to notice.", r: "I noticed. Obviously. I notice everything about you. That's... not what I meant. Shut up." },
      ] },
    ] },

  // ---- slot 4: your hair is less terrible; your fans ----------------------------------------------------------------
  { id: 'rude-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "Your hair's less terrible today. That's not a compliment, it's a weather report. Also, why do fans laugh at all your jokes?",
    opts: [
      { tone: 'cold', t: "Jealous?", r: "Of people who laugh at your jokes? I'd be jealous of a pigeon first. ...Why do they, though?", opts: [
        { tone: 'cold', t: "None of your business.", r: "Ooh. Everything's my business. Fine. Keep it. I'll make up a backstory. They're all tax inspectors." },
        { tone: 'passive', t: "They're fans. They laugh at anything.", r: "Fans. Laughing. At tyre jokes? They need help. Or glasses. Not you. Them." },
        { tone: 'flirty', t: "You're the only one I want laughing at them.", r: "I don't laugh at them. I document them. ...I'll smirk at the next one. Maybe. Don't push it." },
      ] },
      { tone: 'passive', t: "They're fans. They're nice.", r: "Nice people laugh at anything. Laughing at your jokes isn't kindness, it's a warning sign.", opts: [
        { tone: 'cold', t: "You sound jealous.", r: "I sound accurate. Jealous people sulk. I'm... standing here. Normally. With my arms folded. Normally." },
        { tone: 'passive', t: "They like the car one.", r: "The car one is a two. If they laughed at a two, they'd laugh at a parking ticket. Shut up. I'm fine." },
        { tone: 'flirty', t: "I'd rather make you laugh.", r: "You'll never make me laugh. You can make me snort. Once. Accidentally. That's the record." },
      ] },
      { tone: 'flirty', t: "Less terrible. I'll write that down.", r: "Write it on your helmet. Then I'll know where to find it. ...Who are all the laughing ones?", opts: [
        { tone: 'cold', t: "Why do you care?", r: "I don't. I'm conducting a census. Of people who laugh at bad jokes. They're under review." },
        { tone: 'passive', t: "Fans. Nobody important.", r: "Good. Nobody important. I'll file them under nobody. Next to everyone. Except. Never mind." },
        { tone: 'flirty', t: "You're cute when you're jealous.", r: "I'm not jealous. I'm vigilant. Jealous is clingy. Vigilant is security. I'm security." },
        { tone: 'risque', t: "Jealous enough to drag me somewhere private?", r: "Bold of you. I'd drag you somewhere private to lecture you. About jokes. That's all. Mostly." },
      ] },
    ] },
  { id: 'rude-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Your fans laugh at your jokes. Your jokes. Either they're being paid or they want something. Which?",
    opts: [
      { tone: 'cold', t: "Maybe they just think I'm funny.", r: "Nobody thinks you're funny. I think you're entertaining. Funny is rare. Entertaining is a dropped ice cream.", opts: [
        { tone: 'cold', t: "So I'm a dropped ice cream.", r: "A tragic, sticky, watchable ice cream. Yes. Okay, that was funny. Not you. The ice cream." },
        { tone: 'passive', t: "Okay, so what do you think they want?", r: "A selfie and a story. You're a story. A short one. With pictures." },
        { tone: 'flirty', t: "Entertaining you is my favourite thing.", r: "Entertain me less publicly. With fewer witnesses. ...That sounded wrong. It sounded fine." },
      ] },
      { tone: 'passive', t: "They're fans. They want photos.", r: "A photo, a laugh, a hand on your arm. Very busy fans. Very hands-on. Not that I count.", opts: [
        { tone: 'cold', t: "You count.", r: "I count everything. It's not jealousy, it's numeracy. Two touches each. Fine. Three." },
        { tone: 'passive', t: "It's part of the job.", r: "Being laughed at? Being patted by strangers? Wow. Glamorous. I'll stick to my soap." },
        { tone: 'flirty', t: "None of their touches counted.", r: "I know they didn't. I wasn't worried. I'm never worried. My arms are folded for warmth." },
      ] },
      { tone: 'flirty', t: "Being paid? You think I can't be charming?", r: "You can be charming like a dog in a hat. Briefly. In photos. Those people overdo it.", opts: [
        { tone: 'cold', t: "You're the one overdoing it now.", r: "I'm doing it exactly right. Okay, a little over. Fine. You win this one. Don't gloat." },
        { tone: 'passive', t: "They're just friendly.", r: "Friendly is a word for golden retrievers and flirts. Pick one. I'll wait." },
        { tone: 'flirty', t: "You think I'm charming. You said it.", r: "I said dog in a hat. You took 'charming' and ran. Like a dog. With a hat. Shut up." },
        { tone: 'risque', t: "Want to remind me who I'm here for?", r: "Bold of you. I'm not marking territory. I'm standing near you. Very near. Forget it." },
      ] },
    ] },
  { id: 'rude-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Your hair's less awful today. That was a compliment. Don't frame it. Also, your fans are all over you. Always. I notice. Neutrally.",
    opts: [
      { tone: 'cold', t: "Neutrally. Sure.", r: "Very neutrally. Like a referee. A referee who saw everything and is taking notes.", opts: [
        { tone: 'cold', t: "Write me up, then.", r: "Oh, I will. Long report. Footnotes. You'll be suspended from smiling at fans. Ha. Fine." },
        { tone: 'passive', t: "They're big fans, that's all.", r: "Big fans, small boundaries. I'm a small fan with big boundaries. That's better. Obviously." },
        { tone: 'flirty', t: "You're my favourite fan, though.", r: "I'm not a fan. I'm a critic with a seat. ...A front-row seat. Don't read into the seat." },
      ] },
      { tone: 'passive', t: "They just want selfies.", r: "They want a selfie and your number. I can see it. Like a lighthouse sees a ship.", opts: [
        { tone: 'cold', t: "Stop narrating my life.", r: "Someone has to. You narrate it badly. 'And then I went wide.' Thrilling. Okay, I'll stop." },
        { tone: 'passive', t: "They never get my number.", r: "Good. I mean, fine. I mean, I don't care. Good. Fine. Moving on. Your hair. Less awful." },
        { tone: 'flirty', t: "Only one person gets my number.", r: "Your mechanic. Your dentist. And... fine. Me. I've got it. I'll rarely use it. Often." },
      ] },
      { tone: 'flirty', t: "A compliment on my hair? I'm framing it.", r: "You'll frame everything I say. Your house will be a museum of insults. One compliment, small, in a corner.", opts: [
        { tone: 'cold', t: "The insults are better art anyway.", r: "They are. I'm a gifted artist. Okay. You get it. You actually get it. Disgusting." },
        { tone: 'passive', t: "Okay. Thanks for the compliment.", r: "Don't thank me. I'm not a compliment machine. That was a one-off. A glitch. A solar flare." },
        { tone: 'flirty', t: "I'd rather frame you.", r: "Frame me? Like a picture? Like a crime? ...Both. Fine. Hang me somewhere with good light." },
        { tone: 'risque', t: "Run your hands through it, if it's that good.", r: "Bold of you. I'm not touching that hair without a permit. ...How much is a permit." },
      ] },
    ] },

  // ---- slot 5: people leave; you haven't ---------------------------------------------------------------------------
  { id: 'rude-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "You were cold last time. Fine. I'll go first, because you won't. People usually leave me by now. You haven't. Why?",
    opts: [
      { tone: 'cold', t: "Maybe I'm just stubborn.", r: "Stubborn. Good. Stubborn I trust. Nice people leave. Stubborn people stay out of spite.", opts: [
        { tone: 'cold', t: "Out of spite. Exactly.", r: "Perfect. That's a foundation. Spite is load-bearing. Thank you. ...That's all. Go away. Stay." },
        { tone: 'passive', t: "Why do people leave?", r: "I tell them the truth. Their haircut. Their ex. Their novel. They want someone softer. Softer is lying." },
        { tone: 'flirty', t: "Maybe I like you.", r: "Don't. Liking is how it starts. Then they leave. ...Okay. Like me quietly. Somewhere I can see it." },
      ] },
      { tone: 'passive', t: "I don't know. I like talking to you.", r: "That's a beige answer to a red question. Try again. Or don't. That one was... fine. Fine was fine.", m: 0, opts: [
        { tone: 'cold', t: "That's the whole answer.", r: "That's all I need. Ugh. I sound like a card. Delete that. You heard nothing." },
        { tone: 'passive', t: "Is it hard? People leaving?", r: "No. It's efficient. ...It's a bit hard. My sister says I scare people on purpose. She's the nice one.", m: 0 },
        { tone: 'flirty', t: "I'm staying put.", r: "Everyone says that. Then they go somewhere. ...Fine. Don't go anywhere. That's not a request." },
      ] },
      { tone: 'flirty', t: "Because you're worth sticking around for.", r: "Wow. That's from a greeting card. Bin it. ...Don't bin it. Put it in a drawer. I'll find it.", opts: [
        { tone: 'cold', t: "Fine. Binned.", r: "Good. ...You binned it. I said bin it and you binned it. Unbin it. No. Leave it. Ugh." },
        { tone: 'passive', t: "I meant it, though.", r: "I know you meant it. That's the problem. Meaning things is dangerous. You're dangerous. Mildly." },
        { tone: 'flirty', t: "I'll write it on a card. Leave it on your door.", r: "My cat will eat it. ...I'll get to it first. I'll read it once. Then hide it." },
      ] },
    ] },
  { id: 'rude-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "Can I tell you something without you making that face? I'm like this because people leave anyway. This way I find out faster.",
    opts: [
      { tone: 'cold', t: "So you push people to test them? That's petty.", r: "Petty. Yes. Thank you. Petty and efficient. You passed, by the way. Don't celebrate.", opts: [
        { tone: 'cold', t: "I'll celebrate if I want.", r: "With a fist pump? God, no. Okay. Celebrate. Quietly. With a nod. Like a grown-up." },
        { tone: 'passive', t: "What's the test, exactly?", r: "Whether you stay after I'm awful. You stayed. Statistically, you're a freak. Thank you." },
        { tone: 'flirty', t: "Passed? So what do I win?", r: "You win more of me. Which, I'm aware, is a mixed prize. A mystery box of sarcasm." },
      ] },
      { tone: 'passive', t: "That sounds lonely.", r: "It's not lonely. It's spacious. Quiet. Fine. A bit lonely. Don't tell my sister you agreed with her.", m: 0, opts: [
        { tone: 'cold', t: "I don't know your sister.", r: "Good. She'd like you. Everyone likes her. She got the niceness. I got the accuracy." },
        { tone: 'passive', t: "I'm here, anyway.", r: "You are. I noticed. I'm not going to make a speech about it. That was the speech.", m: 0 },
        { tone: 'flirty', t: "Not so lonely now, though.", r: "Don't flatter yourself. ...Okay. Slightly less lonely. Point zero one percent. Shut up." },
      ] },
      { tone: 'flirty', t: "I'm not leaving. You're not that scary.", r: "I'm terrifying. Ask the courier my cat bit. ...You're not scared. Why aren't you scared?", opts: [
        { tone: 'cold', t: "Because your bark's worse than your bite.", r: "My bite's excellent. I just don't use it on you. Which is suspicious. Even to me." },
        { tone: 'passive', t: "Because you're honest. I like honest.", r: "Honest gets you left. Honest also gets you you, apparently. Huh. Data point. Noted." },
        { tone: 'flirty', t: "Because I like the scary ones.", r: "You like trouble. That's your whole driving style. ...I'm trouble. Fine. I'm good trouble." },
      ] },
    ] },
  { id: 'rude-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "Stop flirting for one second. I'm being serious. It'll be brief and painful. People usually give up on me around now.",
    opts: [
      { tone: 'cold', t: "Then they weren't worth it.", r: "Maybe. Or I was too much. Too sharp. Too everything. ...Okay. Weren't worth it. I'll try your version.", opts: [
        { tone: 'cold', t: "Mine's better. Use it.", r: "Fine. I'll use it. Don't make me thank you. I don't have the equipment." },
        { tone: 'passive', t: "Too much how?", r: "Too honest. 'Your poem's bad.' 'That jacket's a crime.' They wanted a cheerleader. I'm a referee." },
        { tone: 'flirty', t: "Too much is my favourite amount.", r: "Your favourite amount of everything. That's why your tyres give up. ...That's a compliment. Today." },
      ] },
      { tone: 'passive', t: "Why do you think they give up?", r: "I make it hard. I'm an obstacle course with opinions. You keep finishing it. It's annoying.", opts: [
        { tone: 'cold', t: "Maybe I like obstacle courses.", r: "You like crashing into them. Ha. Okay. Sorry. Not sorry. You're still here. That's... noted." },
        { tone: 'passive', t: "I'll keep finishing it.", r: "Every time? It gets harder. I add walls. ...Fine. I'll add a bench. Somewhere to sit. For you." },
        { tone: 'flirty', t: "Finishing it means I get the prize.", r: "There's no prize. There's just me at the end, arms folded. ...That's the prize. Shut up." },
      ] },
      { tone: 'flirty', t: "Then I'll be serious too. I'm staying.", r: "Serious suits you. Like a jacket you rarely wear. Okay. Staying. Noted. Filed. Don't make me cry.", opts: [
        { tone: 'cold', t: "You don't cry.", r: "I don't. Except at the dog episode of my soap. Everyone cries there. You're not the dog episode." },
        { tone: 'passive', t: "Okay. Not crying. Just staying.", r: "Just staying. Like a stain. A good stain. A stain I chose. ...I'm terrible at this." },
        { tone: 'flirty', t: "You can cry on me. I don't mind.", r: "Absolutely not. ...On your shoulder, you mean. Hypothetically. In a storm. Never." },
        { tone: 'risque', t: "Let me stay tonight, then.", r: "Bold of you. Very bold. Staying is a metaphor. It's not a sleepover. ...Yet. No. Not yet." },
      ] },
    ] },
  // ---- slot 6: they watched your race, 'for the cat' ---------------------------------------------------------------
  { id: 'rude-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "Before you start: I watched your race. For my cat. She likes the noise. I happened to be in the room. Shouting. At you.",
    opts: [
      { tone: 'cold', t: "For the cat. Sure.", r: "For the cat. She has a favourite driver. It's not you. ...It's a bit you. She sat closer when you overtook.", opts: [
        { tone: 'cold', t: "Your cat has better taste than you.", r: "She does. She also eats paper. Taste is relative. Ha. Fine. Point to the driver." },
        { tone: 'passive', t: "What did you shout at me?", r: "'Brake.' 'Not there.' 'Why.' 'Oh, that's good.' The last one was the cat. Not me." },
        { tone: 'flirty', t: "Admit you were cheering.", r: "I was making noises of disapproval at a high volume. That's not cheering. It's enthusiastic disapproval." },
      ] },
      { tone: 'passive', t: "Thanks for watching. Did she like it?", r: "She liked the start. Then she fell asleep on the remote. Very relatable. Very you, actually.", opts: [
        { tone: 'cold', t: "Your cat sleeping isn't a review.", r: "It's the most honest review you'll get. She doesn't fake it. Unlike your team radio. Ha." },
        { tone: 'passive', t: "Did you watch to the end?", r: "To the end. And the interviews. For the cat. She likes faces. ...Stop it." },
        { tone: 'flirty', t: "Next time watch it with me in person.", r: "In person? Where would the cat sit? ...Don't answer. You'll say something soft. Fine. Maybe." },
      ] },
      { tone: 'flirty', t: "You shouted at me. That means you care.", r: "It means you braked in the wrong place. Caring is a separate department. It's closed.", opts: [
        { tone: 'cold', t: "Then stop shouting.", r: "I'll shout as much as I want. I pay for that telly. Ha. Okay. Stopping. Briefly." },
        { tone: 'passive', t: "Okay. What should I have done?", r: "Stayed on the outside. Then won. Then been gracious about it. Simple. Three steps." },
        { tone: 'flirty', t: "That department opens for me, though.", r: "It has a back door. I'm not saying where. Find it yourself. You won't. You might." },
        { tone: 'risque', t: "Shout at me in person. Somewhere private.", r: "Bold of you. In private I'd mostly shout about your braking. ...Mostly. Not entirely. No." },
      ] },
    ] },
  { id: 'rude-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "My cat and I watched your race. She enjoyed it. I tolerated it. I also own your team's cap now. For cleaning. Don't ask.",
    opts: [
      { tone: 'cold', t: "For cleaning. You bought my cap to clean with.", r: "Yes. I polish the cat bowl with it. Very absorbent. Your team's merchandise makes excellent rags.", opts: [
        { tone: 'cold', t: "My cap deserves better than you.", r: "Your cap deserves a better driver. Ooh. Low blow. Kidding. Mostly kidding." },
        { tone: 'passive', t: "So where is it now?", r: "On a hook. Near the door. Where I can see it. For cleaning. Shut up. I said for cleaning." },
        { tone: 'flirty', t: "You wear it when nobody's looking.", r: "I do not. Once. In the rain. It was functional. It was very functional. Stop smiling." },
      ] },
      { tone: 'passive', t: "Your cat watches racing?", r: "She watches everything. She's a critic. Like me. She gave you a seven. I said six. We fought.", opts: [
        { tone: 'cold', t: "Your cat's a better judge than you.", r: "She's a generous judge. She's soft. She gets that from... nobody. Nobody in this house." },
        { tone: 'passive', t: "A six from you is huge, though.", r: "It is. Don't tell anyone. The cat's sworn to secrecy. She won't talk. She can't." },
        { tone: 'flirty', t: "So the house is on my side.", r: "The house is divided. Half wants you to win. The other half is the cat. ...I mean... shut up." },
      ] },
      { tone: 'flirty', t: "You and your cat, watching me. That's cute.", r: "It's not cute. It's surveillance. We take notes. We have a whiteboard.", opts: [
        { tone: 'cold', t: "A whiteboard. You need a hobby.", r: "You are the hobby. Unfortunately. Okay, that came out wrong. It came out correct." },
        { tone: 'passive', t: "What's on the whiteboard?", r: "Your braking points. Your bad corners. A small drawing of you by the cat. It's a smudge. Accurate." },
        { tone: 'flirty', t: "I'd like to see this whiteboard. At yours.", r: "At mine? The cat would be furious. ...She'd get over it. I wouldn't. Fine. One visit." },
        { tone: 'risque', t: "Invite me over. I'll give a live demonstration.", r: "Bold of you. A demonstration of what? Your braking? Wow. Very bold. Ask me later." },
      ] },
    ] },
  { id: 'rude-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "Don't flirt, I'm still annoyed. I watched your race with my cat, and you made me shout at the telly. In my own home.",
    opts: [
      { tone: 'cold', t: "Your telly survived. It'll be fine.", r: "My telly will need therapy. So will the cat. So will my neighbours. You owe us all.", opts: [
        { tone: 'cold', t: "Send me the bill.", r: "Oh, I will. Itemised. 'Emotional damage, all race.' 'One cat, startled.' Ha. Good." },
        { tone: 'passive', t: "Sorry about the neighbours.", r: "Don't be. They needed it. They're very quiet people. Now they know the word 'apex'." },
        { tone: 'flirty', t: "So I'm the only one who gets you shouting.", r: "You and the twin on my soap. You're both repeat offenders. Fine. You're worse." },
      ] },
      { tone: 'passive', t: "What made you shout?", r: "You. Every brave, stupid thing you do in that car. Some of it works. I shout. The cat leaves the room.", opts: [
        { tone: 'cold', t: "Stupid works, though.", r: "It does. Stupid works for you. It's genuinely your only setting. I respect a single setting." },
        { tone: 'passive', t: "I'll try to do fewer stupid things.", r: "Don't. Stupid is your edge. Just do it where I can see it. With warning. Text me." },
        { tone: 'flirty', t: "So you were worried about me.", r: "I was worried about the cat's nerves. And my sofa. And... fine. You. A bit. Point zero two." },
      ] },
      { tone: 'flirty', t: "You shout for me. That's basically love.", r: "It's basically noise. Love is quiet. ...I've heard. I've read about it. In a book. Shut up.", opts: [
        { tone: 'cold', t: "Then I'll stay quiet too.", r: "Good. You're nicer quiet. Ha. You're nice loud too. ...Ignore that. That was the cat." },
        { tone: 'passive', t: "Okay. Noise, then.", r: "Noise. Exactly. Loud, irritating noise I wouldn't change. ...I'd change some of it." },
        { tone: 'flirty', t: "Shout my name next time. I'll hear it.", r: "Through the telly? In a car? ...I'll shout it. You won't hear it. That's the point." },
        { tone: 'risque', t: "Come and shout my name in person.", r: "Bold of you. Wow. I'll shout it in a restaurant. Near your mechanics. See how you like it." },
      ] },
    ] },

  // ---- slot 7: do something about it. not here ---------------------------------------------------------------------
  { id: 'rude-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "You were cold to me last time and now you're looking at me like that. Make up your mind. Or don't. Just stop staring.",
    opts: [
      { tone: 'cold', t: "Like what? I'm not looking at you.", r: "You are. You're doing it right now. With the eyes. Okay. Fine. Stop. Or don't. Ugh.", opts: [
        { tone: 'cold', t: "I'll stop. Happy?", r: "No. Annoyingly. I wanted you to keep going. Forget that. I said nothing. Go away." },
        { tone: 'passive', t: "Okay. I'll look at the floor.", r: "The floor? You'll look at the floor? Wow. Romantic. The floor's thrilled." },
        { tone: 'flirty', t: "I'll keep looking. You're worth it.", r: "Worth it. Like a shampoo advert. ...Fine. Keep looking. I'll pretend not to notice. I'll notice." },
      ] },
      { tone: 'passive', t: "Sorry. I'll stop.", r: "Don't apologise for staring. Apologise for not committing. You do the same thing at turn one.", opts: [
        { tone: 'cold', t: "Commit to what? You haven't asked.", r: "Oh, that's good. You're right. I haven't. I won't. ...I might. Ask me later. Ugh." },
        { tone: 'passive', t: "So what do you want me to do?", r: "Something. Anything. Not this. You're a driver. Drive. Metaphorically. Not here." },
        { tone: 'flirty', t: "Then I'll commit. Come here.", r: "Here? No. Not here. I've got a reputation to keep. ...Somewhere else. Later. Don't look so pleased." },
        { tone: 'risque', t: "Fine. My place. Now.", r: "Bold of you. Very bold. You've been practising that in a mirror. ...No. Ask nicer. Then still no." },
      ] },
      { tone: 'flirty', t: "I've made up my mind. It's you.", r: "Oh. Wow. That's direct. That's a lot of direct for one conversation. Okay. Breathe. I'm breathing.", opts: [
        { tone: 'cold', t: "Relax. It's just a fact.", r: "Facts are worse than feelings. Feelings fade. Facts stick. Ugh. Fine. It's a fact." },
        { tone: 'passive', t: "Too much? I can take it back.", r: "Don't take it back. Never take things back. Leave them there. I'll look at them later." },
        { tone: 'flirty', t: "You're blushing again.", r: "I'm not. It's warm. It's always warm near you. ...Ignore how that sounded. Correct, but wrong." },
        { tone: 'risque', t: "Kiss me and find out how direct I am.", r: "Bold of you. Here? Now? ...Not here. That's not a no. That's a geography." },
      ] },
    ] },
  { id: 'rude-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "You keep looking at me like that. If you're going to keep doing it, do something about it. Not here. God. Not here.",
    opts: [
      { tone: 'cold', t: "Do something like what?", r: "You know what. Don't play stupid. You're bad at stupid. You're good at it, but not on purpose.", opts: [
        { tone: 'cold', t: "Say it, then. What should I do?", r: "Ha. Making me say it. Cruel. I'm not saying it. Figure it out. You're a driver. Find the gap." },
        { tone: 'passive', t: "Okay. Later, then.", r: "Later. You keep saying later. Later's a place you never arrive. Like the top step. Kidding. Mostly." },
        { tone: 'flirty', t: "I know exactly what.", r: "Good. Then don't do it here. ...Or do. No. Don't. I'll tell you when. I won't tell you." },
      ] },
      { tone: 'passive', t: "Okay. Not here.", r: "'Okay, not here.' You agreed so fast. That's insulting. Fight for it a bit. Have some pride.", opts: [
        { tone: 'cold', t: "You said not here. I'm listening.", r: "You're right. I did. That's annoying. You're annoying. Okay. Not here. Somewhere. Soon." },
        { tone: 'passive', t: "So where, then?", r: "Somewhere without your fans or my opinions. That's a short list. I'll find something." },
        { tone: 'flirty', t: "Somewhere quieter, then. I'll wait.", r: "You'll wait? Patiently? You've never been patient. ...Fine. Wait. I'll make it worth it." },
        { tone: 'risque', t: "Your place. I'll bring nothing but trouble.", r: "Bold of you. You always bring trouble. You're trouble with a helmet. ...Ask me in a week." },
      ] },
      { tone: 'flirty', t: "Then let's go somewhere that isn't here.", r: "Oh. Okay. Bold. Very bold. Right now? You're serious? You've got the look of a plan.", opts: [
        { tone: 'cold', t: "I'm always serious.", r: "You're never serious. You're a dog chasing a car. You caught the car. Now what? Exactly." },
        { tone: 'passive', t: "Or we can stay. Whatever you want.", r: "Whatever I want. Dangerous thing to say to me. I want too many things. Stay. For now." },
        { tone: 'flirty', t: "Walk with me. Just for a bit.", r: "A walk. Not a kiss. A walk. ...With a kiss at the end, maybe. Possibly. Don't say anything." },
      ] },
    ] },
  { id: 'rude-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "If you keep looking at me like that, you'll have to do something about it. ...Not here. I said not here. Stop smiling.",
    opts: [
      { tone: 'cold', t: "Maybe I'll just keep looking.", r: "Just looking. That's cowardice. Cowardice in a nice jacket. You're better than that. Barely.", opts: [
        { tone: 'cold', t: "Cowardice. Wow. Thanks.", r: "You're welcome. Prove me wrong. Not here. Elsewhere. Later. Prove it." },
        { tone: 'passive', t: "I'm not in a rush.", r: "You're a racing driver. Not being in a rush is your whole contradiction. Fine. Slow. I hate slow." },
        { tone: 'flirty', t: "Looking at you is the best part of my day.", r: "Then your days are terrible. ...That was sweet. Disgusting. Keep looking. Quietly." },
      ] },
      { tone: 'passive', t: "Okay. I'll stop smiling.", r: "Don't stop. I said stop. I didn't mean stop. I meant... I don't know what I meant. Ugh.", opts: [
        { tone: 'cold', t: "Make up your mind, then.", r: "Ooh. Using my lines on me. That's my move. I invented it. Fine. You can borrow it." },
        { tone: 'passive', t: "Okay. I'll just stand here.", r: "Standing there. Smiling. Looking. This is torture. You're doing it on purpose. Aren't you." },
        { tone: 'flirty', t: "You don't want me to stop at all.", r: "No. I don't. Happy? That's the most honest thing I've said in weeks. Never repeat it." },
      ] },
      { tone: 'flirty', t: "Then let's find somewhere that's not here.", r: "Somewhere not here. Bold. Fine. Bold works on me. Don't spread it around. It's a vulnerability.", opts: [
        { tone: 'cold', t: "Relax. I'll keep your secret.", r: "You'd better. My whole reputation's at stake. People think I'm made of stone. I'm made of... less." },
        { tone: 'passive', t: "Or just stay here and talk.", r: "Talk. After all that. Fine. We'll talk. About anything. Not this. Not the looking. Ugh." },
        { tone: 'flirty', t: "Not here. Somewhere. Soon. You said it.", r: "I said it. I meant it. I'm horrified that I meant it. Come on, then. Not far." },
        { tone: 'risque', t: "Somewhere with a door that locks.", r: "Bold of you. Wow. A door that locks. I'll consider it. I'm considering it. Stop." },
      ] },
    ] },

  // ---- slot 8: the week was boring (an observation, not a confession) -----------------------------------------------
  { id: 'rude-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "The week was boring. That's an observation, not a confession. And you were frosty last time. Boring and frosty. Thanks.",
    opts: [
      { tone: 'cold', t: "Glad to hear I'm missed.", r: "You're not missed. You're noted absent. Like a register. Ugh. Fine. You're missed. Shut up.", opts: [
        { tone: 'cold', t: "Noted absent. That's cold.", r: "I'm cold. You're cold. We're a fridge. Fine. A fridge with a light that comes on." },
        { tone: 'passive', t: "What did you do all week?", r: "Watched my soap. Argued with a stranger online. Looked at my phone. Not for any reason." },
        { tone: 'flirty', t: "I missed you too.", r: "I didn't say I missed you. I said boring. ...Fine. I missed the noise. You. The noise you." },
      ] },
      { tone: 'passive', t: "My week was busy.", r: "Busy. Good for you. Mine was empty. Not because of you. Because of calendars.", opts: [
        { tone: 'cold', t: "Calendars. Sure.", r: "Calendars are very cruel. They put days between races. On purpose. I've complained." },
        { tone: 'passive', t: "Anything happen?", r: "Nothing. A pigeon looked at me. I looked back. It lost. That was Wednesday." },
        { tone: 'flirty', t: "Next week I'll fill your calendar.", r: "With what? You? Your bad jokes? ...Yes. Fine. Book something. A Thursday." },
      ] },
      { tone: 'flirty', t: "Bored without me. Admit it.", r: "I'll admit the week had a shape. The shape was a hole. Don't measure the hole.", opts: [
        { tone: 'cold', t: "I'll measure it if I want.", r: "Then measure it. It's you-sized. Happy? That's the most revealing thing I've said. Ever." },
        { tone: 'passive', t: "Okay. I won't measure the hole.", r: "Good. Leave the hole alone. It's mine. I'm decorating it. Don't ask how." },
        { tone: 'flirty', t: "I'll fill the hole. Every week.", r: "Every week. Like a delivery. Fine. I accept deliveries. Leave it on the step. Come in." },
        { tone: 'risque', t: "Bored and alone all week? Call me next time.", r: "Bold of you. Call you and say what? 'I'm bored'? ...That's exactly what I'd say. Ugh." },
      ] },
    ] },
  { id: 'rude-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "Something you should know. This week? Dull. Very dull. That's an observation. Not a confession. Don't.",
    opts: [
      { tone: 'cold', t: "Not a confession. Sure.", r: "Not a confession. A finding. I'm a scientist of boredom. My results are in. You're the variable.", opts: [
        { tone: 'cold', t: "Scientist. You stared at walls.", r: "I stared at walls scientifically. Ha. You're quick today. The week was worse without... this." },
        { tone: 'passive', t: "What would make it less boring?", r: "You knowing my week was boring and doing nothing about it. Wait. No. The opposite." },
        { tone: 'flirty', t: "I'm the variable? I like that.", r: "Of course you like it. You like being the centre of things. ...You are, a bit. A variable centre." },
      ] },
      { tone: 'passive', t: "Sorry. Racing keeps me away.", r: "Don't apologise. It's your job. I just notice the gaps. Like a dentist. Ugh. That's a metaphor.", opts: [
        { tone: 'cold', t: "You're bad at metaphors.", r: "Terrible at them. Good at insults. Metaphors are just insults that missed. Like you." },
        { tone: 'passive', t: "I'll text more next week.", r: "Text more? Fine. Don't send pictures of food. Send pictures of... other things. The car. Fine." },
        { tone: 'flirty', t: "I'll make up for it now.", r: "Now? How? With charm? ...Okay. It's working. It's working a little. Stop." },
      ] },
      { tone: 'flirty', t: "Boring without me. You just said that.", r: "I said boring. You added 'without you'. That's fan fiction. You write fan fiction about me.", opts: [
        { tone: 'cold', t: "Bad fan fiction. One star.", r: "Ha! One star. I'd give it two. The ending's good. The ending's you here. ...Stop." },
        { tone: 'passive', t: "Okay. Boring. Just boring.", r: "Thank you. Just boring. Plain. Empty. Waiting. Not waiting. Stop editing what I say." },
        { tone: 'flirty', t: "Then I'll write a better chapter.", r: "Write one where I win an argument and you don't smirk. ...Write one where you stay longer." },
        { tone: 'risque', t: "Next chapter: your place, no interruptions.", r: "Bold of you. Very bold. That's not a chapter, that's a spin-off. I'd watch it. No." },
      ] },
    ] },
  { id: 'rude-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "My week was boring without... no. It was boring. Full stop. Don't fill in the blank. Stop filling it in.",
    opts: [
      { tone: 'cold', t: "I wasn't going to fill it in.", r: "Liar. You had the word ready. 'You'. Like a parking spot. I watched you reverse into it.", opts: [
        { tone: 'cold', t: "You're the one who said 'without'.", r: "I said it by accident. Like a sneeze. A sneeze that meant you. ...Okay. It meant you." },
        { tone: 'passive', t: "Fine. Boring. Full stop.", r: "Full stop. Exactly. Good. ...Too easy. You gave up too easy. Fight me a little." },
        { tone: 'flirty', t: "It's me. The blank is me.", r: "The blank is a blank. Blanks are empty. ...Fine. You're the blank. Don't let it go to your head." },
      ] },
      { tone: 'passive', t: "Okay. I won't.", r: "You won't? Just like that? That's disappointing. I wanted you to fight for the blank.", opts: [
        { tone: 'cold', t: "You told me not to.", r: "I tell you lots of things. You ignore most of them. Pick a good one to ignore next time." },
        { tone: 'passive', t: "And the rest of your week?", r: "Rain. Soap. Cat. Me, refreshing my phone. Not for you. For the weather. It rained. Constantly." },
        { tone: 'flirty', t: "Fine. I'll fight for it. It's me.", r: "There it is. Took you long enough. Yes. Fine. You. Happy? Now I'm boring and exposed." },
      ] },
      { tone: 'flirty', t: "Without me. Say it. I'll wait.", r: "You'll wait forever. ...Without you. There. It's out. It's in the air. Breathe it in. Never again.", opts: [
        { tone: 'cold', t: "Didn't hear you. Again?", r: "Oh, you're cruel. Absolutely not. Once is a slip. Twice is a confession. I said no confessions." },
        { tone: 'passive', t: "Thanks for saying it.", r: "Don't thank me. It was dragged out of me. Like a splinter. A splinter I wanted out. Ugh." },
        { tone: 'flirty', t: "I missed you as well. A lot.", r: "A lot. Okay. That's fine. Good. Normal. I'm being normal. Look at me being normal." },
        { tone: 'risque', t: "Then let me make next week less boring. In person.", r: "Bold of you. In person. With no one else. Bold. I'll clear Thursday. That's not a yes." },
      ] },
    ] },

  // ---- slot 9: you're the only person I can stand. we're dating (end of the chapter) --------------------------------
  { id: 'rude-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "Right. You were cold last time and I still came over. That says something. You're the only person I can stand. Don't.",
    opts: [
      { tone: 'cold', t: "The only one? Low bar.", r: "Extremely low. You're the only one over it. So, we're dating. I've decided. You can object. It won't work.", opts: [
        { tone: 'cold', t: "I object.", r: "Objection noted. Overruled. You're dating me. I'm the judge. And the jury. And the bailiff." },
        { tone: 'passive', t: "Okay. Dating. If you're sure.", r: "If I'm sure? I'm never unsure. I'm unsure about you. That's new. Okay. We're dating." },
        { tone: 'flirty', t: "About time you said it.", r: "About time? For me this is light speed. Shut up. We're dating." },
        { tone: 'risque', t: "Dating. So I'm coming home with you.", r: "Bold of you. Very bold. ...Not today. Today I'm being dignified. Tomorrow I might not be." },
      ] },
      { tone: 'passive', t: "That's... sweet?", r: "It's not sweet. It's an assessment. So we're dating now. That's the assessment. Don't make a sound.", opts: [
        { tone: 'cold', t: "Fine. No sound.", r: "Good. ...Make a small sound. A little one. I want to know you're pleased. Not that I care." },
        { tone: 'passive', t: "Okay. We're dating.", r: "'Okay, we're dating.' Like you're ordering a sandwich. Fine. It's a good sandwich. We're dating." },
        { tone: 'flirty', t: "I was hoping you'd say that.", r: "You were hoping? I wasn't hoping. I was planning. Ha. ...I was hoping. A bit. Shut up." },
      ] },
      { tone: 'flirty', t: "Then stand me. All of me. Always.", r: "Grammatically a disaster, romantically... fine. It's fine. We're dating. I've decided. Object, I dare you.", opts: [
        { tone: 'cold', t: "I won't object. You'd sulk.", r: "I would sulk. Enormously. Good call. You're clever, sometimes. We're dating. That's final." },
        { tone: 'passive', t: "No objection.", r: "No objection. Good. That was a test. You passed. Again. You're annoyingly good at my tests." },
        { tone: 'flirty', t: "I'm the luckiest person alive.", r: "Luckiest in this postcode. Don't overdo it. ...Fine. Alive. You're lucky. So am I." },
        { tone: 'risque', t: "Seal it, then. Kiss me.", r: "Bold of you. Here? ...Fine. One. Quickly. Nobody look. There. Sealed. Don't." },
      ] },
    ] },
  { id: 'rude-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "I've decided something. You are the one person I can stand. So we're dating. You can object. It won't work.",
    opts: [
      { tone: 'cold', t: "You can't just decide that.", r: "I can. I just did. I decide everything. You're dating me. It's done. Object if you're brave.", opts: [
        { tone: 'cold', t: "I'm brave. I object.", r: "Brave. Cute. Overruled. Your objection's been filed in the bin. With the receipts." },
        { tone: 'passive', t: "Okay. I guess we're dating.", r: "You guess. Wow. Enthusiastic. Like a dentist's waiting room. Fine. Guess. You're dating me." },
        { tone: 'flirty', t: "You decided? I decided weeks ago.", r: "Weeks? You've been sitting on this for weeks? Of course you have. Fine. You win. Shut up." },
      ] },
      { tone: 'passive', t: "Okay. I'd like that.", r: "'I'd like that.' Like a cardigan. Fine. I'd like that too. Don't tell anyone.", m: 0, opts: [
        { tone: 'cold', t: "I'll tell everyone.", r: "You won't. You'll be smug in silence. That's worse. I'll allow it. You're my... thing." },
        { tone: 'passive', t: "So, what now?", r: "Now nothing changes. Except everything. I'll still insult you. I'll just do it closer." },
        { tone: 'flirty', t: "Your thing. I like being your thing.", r: "Don't. 'Thing' is a technical term. ...You're my person. There. Said it. Burn this conversation." },
      ] },
      { tone: 'flirty', t: "Finally. I've been waiting.", r: "You should have said something. ...You did. Constantly. I ignored it. I'm sorry. I'm not. Okay, I am.", opts: [
        { tone: 'cold', t: "Apology accepted. Barely.", r: "Barely is generous. I'll take barely. We're dating. Barely. Officially barely." },
        { tone: 'passive', t: "It's okay. We got here.", r: "We got here. Like a long, terrible road trip. With snacks. Fine. We got here. Good." },
        { tone: 'flirty', t: "You apologised. Write the date down.", r: "I'm writing nothing down. I'll deny it. ...I'll remember it. I remember everything about you." },
        { tone: 'risque', t: "Make it up to me. Tonight.", r: "Bold of you. Make it up how? ...Don't answer. I know how. Not tonight. Soon. Bold." },
      ] },
    ] },
  { id: 'rude-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "Fine. You win. You're the only person I can actually stand. We're dating now. I've decided. Object if you want. You'll lose.",
    opts: [
      { tone: 'cold', t: "And if I object?", r: "You'll lose. I've prepared arguments. I've got slides. My cat is my witness. You'll lose.", opts: [
        { tone: 'cold', t: "I'd win. I always win.", r: "You don't always win. You sometimes win. Ha. Okay. We're dating. You lose. You win. Both." },
        { tone: 'passive', t: "Okay. I won't object.", r: "Good. Smart. Self-preservation. You're dating me now. It's a lot. You'll manage. Barely." },
        { tone: 'flirty', t: "I'd only object to make you argue.", r: "Best romantic thing I've ever heard. Truly. Argue with me forever. Shut up." },
      ] },
      { tone: 'passive', t: "Dating. Okay. That's big.", r: "It's huge. The biggest thing I've done since I adopted the cat. Don't make a face.", opts: [
        { tone: 'cold', t: "The cat was a better decision.", r: "The cat bites. You don't. Both decisions are fine. Ha. Good one. We're still dating." },
        { tone: 'passive', t: "I'm happy. Really.", r: "'Really.' Ugh. Fine. I'm happy too. Don't look at me. Look at the floor. Be happy at the floor." },
        { tone: 'flirty', t: "Bigger than the cat? I'm honoured.", r: "You should be. She's very important. You're... equally important. Shut up. Don't tell her." },
      ] },
      { tone: 'flirty', t: "The only one you can stand. Say it again.", r: "No. Once. It's out. ...Only you. You're the one I can stand. There. Don't make me say it a third time.", opts: [
        { tone: 'cold', t: "Third time. Go on.", r: "You're cruel. I love that. I mean like. I like that. Nobody heard that. We're dating." },
        { tone: 'passive', t: "Okay. Twice is enough.", r: "Twice is plenty. Twice is a record. Nobody's ever had twice. You've had twice. Feel special." },
        { tone: 'flirty', t: "You're the only one I want to stand next to.", r: "That's soppy. ...It's fine. Fine. It's perfect. Come here. Stand next to me, then." },
        { tone: 'risque', t: "Let's go somewhere and make it official.", r: "Bold of you. Official how? ...Don't answer. You've got that look. Fine. Somewhere. Soon. Official." },
      ] },
    ] },
];
