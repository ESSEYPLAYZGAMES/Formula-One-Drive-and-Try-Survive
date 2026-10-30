// The Ice - in person, stage 'close': together. In-jokes (the clauses, the stolen jacket, the notes in the coat, the
// list), missing you, small jealousies, the future. Coldness now reads as you pulling away and they go glacial;
// a risque line reveals the heat under the ice.
export default [
  // ---- close / cold: you were distant last time; they are stung and guarded ----------------------------------------
  {
    id: 'ice-close-cold-1', stage: 'close', mood: 'cold',
    say: "You've been distant. I can tell you're doing it. I just can't tell why, and I always know why.",
    opts: [
      { tone: 'cold', t: "Maybe I just need some space.", r: "Space. Take it, then. I'm very good at becoming a great deal of it.", m: -4, opts: [
        { tone: 'cold', t: "Good. Then do that.", r: "Done. Don't call tonight. I won't pick up, and I'll know you tried.", m: -5 },
        { tone: 'passive', t: "Not from you. Space in my head.", r: "Then lead with that next time. I heard the first version. It'll take a while to unhear." },
        { tone: 'flirty', t: "Space, but with you in it.", r: "You don't get to be cold and charming in one breath. ...Try again tomorrow. Slowly." },
      ] },
      { tone: 'passive', t: "It's not you. The season's getting to me.", r: "Then let it get to me as well. That's what this is for. I'm not decorative.", opts: [
        { tone: 'cold', t: "I don't want to dump it on you.", r: "So you'd rather freeze me out than lean on me. Interesting choice. The wrong one.", m: -4 },
        { tone: 'passive', t: "Okay. Can we talk about it tonight?", r: "Tonight. Mine. I'll make tea and I won't interrupt. I'll want to." },
        { tone: 'flirty', t: "You are a little decorative.", r: "A little. I'll take the joke, because it means you're back. Hello, you." },
      ] },
      { tone: 'flirty', t: "I'm not distant. I'm right here. Come here.", r: "Right here, and miles off. Don't beckon me like nothing happened.", opts: [
        { tone: 'cold', t: "Fine. Nothing happened.", r: "Nothing. Then nothing is what you'll get. I'm extremely good at nothing.", m: -5 },
        { tone: 'passive', t: "Sorry. You're right. I've been in my own head.", r: "Then come out of it and into this room. I'm in it. Waiting. I don't wait." },
        { tone: 'flirty', t: "Then let me make it up to you. Properly.", r: "Properly. Slowly, then. I've had a cold week. You'll have to work for the thaw." },
      ] },
    ],
  },
  {
    id: 'ice-close-cold-2', stage: 'close', mood: 'cold',
    say: "You didn't call. I didn't wait by the phone. I want that on record, even though it isn't true.",
    opts: [
      { tone: 'cold', t: "I was busy.", r: "Busy. A word people use when someone isn't a priority. I'd know. I used to use it on people.", m: -4, opts: [
        { tone: 'cold', t: "Not everything's about you.", r: "No. This was. Go and be busy. I'll be unavailable. Indefinitely.", m: -5 },
        { tone: 'passive', t: "Sorry. That's no excuse. I should've called.", r: "Yes. And you've said so. That helps, a little. I'm still cross." },
        { tone: 'flirty', t: "Busy thinking about you, mostly.", r: "Not tonight. That's charm served on a cold plate. I may warm to it later." },
      ] },
      { tone: 'passive', t: "I'm sorry. Wait. You waited by the phone?", r: "I put it on the table. I looked at it. I'd call that monitoring, not waiting.", opts: [
        { tone: 'cold', t: "Bit much, isn't it?", r: "A bit much. I'll stop, then. I'll stop most things, if that's how this is going.", m: -4 },
        { tone: 'passive', t: "I'll call tonight. Properly. No distractions.", r: "Nine o'clock. I'll be pretending to be busy. Call anyway." },
        { tone: 'flirty', t: "I love that you watched the phone.", r: "Don't love it. It was humiliating. ...You may love it a little." },
      ] },
      { tone: 'flirty', t: "You waited. That's adorable.", r: "Adorable. Say that word again and I'll sulk for a fortnight.", opts: [
        { tone: 'cold', t: "Fine. Sulk.", r: "A fortnight, then. From this minute. You'll hardly notice the difference, apparently.", m: -4 },
        { tone: 'passive', t: "Okay. Adorable withdrawn. I'm sorry.", r: "Withdrawn and replaced with an apology. A better trade. Accepted." },
        { tone: 'flirty', t: "Adorable. Come and sulk at mine.", r: "I sulk best in comfortable chairs. Yours will do. You'll have to earn your way back out." },
      ] },
    ],
  },
  {
    id: 'ice-close-cold-3', stage: 'close', mood: 'cold',
    say: "Your silences are getting louder. I'm starting to feel like a guest in this.",
    opts: [
      { tone: 'cold', t: "Then maybe you are.", r: "...I see. I'll get my coat. No, don't help. I can find a door.", m: -5, opts: [
        { tone: 'cold', t: "I'm not stopping you.", r: "No. You never do. That used to feel like freedom.", m: -5 },
        { tone: 'passive', t: "Wait. I didn't mean that.", r: "Then mean something else, quickly. I'm halfway to the door, and I don't do U-turns." },
        { tone: 'flirty', t: "Stay. I'll make it worth the coat coming off.", r: "Charm after cruelty. It doesn't wash. ...It almost does. The coat stays on. I stay, briefly." },
      ] },
      { tone: 'passive', t: "You're not a guest. I've just had a lot on.", r: "Then share some of it. I can carry things. I only look like I can't.", opts: [
        { tone: 'cold', t: "I'll handle it.", r: "Handle it, then. You'll find me where you left me. Slightly further away.", m: -3 },
        { tone: 'passive', t: "Okay. Sit down. I'll tell you everything.", r: "Everything. Good. Start with the worst. I'll pretend not to react." },
        { tone: 'flirty', t: "You look like you could carry anything.", r: "Flattery, accepted because it's true. Now give me something to carry." },
      ] },
      { tone: 'flirty', t: "A guest who stays over isn't really a guest.", r: "Cute. You'd use that to change the subject. It very nearly changed it.", opts: [
        { tone: 'cold', t: "Forget it.", r: "Forget it. Your favourite phrase lately. It's going on the list.", m: -4 },
        { tone: 'passive', t: "Alright. Not changing the subject. I'm sorry.", r: "There. That's the sentence. It was hiding behind the charm all along." },
        { tone: 'flirty', t: "Stay over, then. Prove me right.", r: "You don't get the sleepover and the silence. Pick one. ...Ah. Good choice." },
      ] },
    ],
  },
  {
    id: 'ice-close-cold-4', stage: 'close', mood: 'cold', where: 'party',
    say: "You spent forty minutes talking to someone else tonight. I timed it. Not for any reason.",
    opts: [
      { tone: 'cold', t: "So? I'm allowed to talk to people.", r: "You're allowed anything. And I'm allowed to stand here and freeze.", m: -4, opts: [
        { tone: 'cold', t: "Freeze, then.", r: "Gladly. Enjoy the rest of the party. I'm taking a car home. Alone.", m: -5 },
        { tone: 'passive', t: "They were a sponsor. Strictly business.", r: "Business. With all that laughing. Fine. I'll believe you, sceptically, for the evening." },
        { tone: 'flirty', t: "Forty minutes, and I thought about you for all of them.", r: "Then you're a better liar than I'd like. ...Get me a drink. A good one. We'll discuss your lies." },
      ] },
      { tone: 'passive', t: "You timed it? It was work. They're nobody.", r: "Nobody with a very good laugh. I don't get jealous. I get precise.", opts: [
        { tone: 'cold', t: "Precise is exhausting.", r: "Then rest. Somewhere I'm not.", m: -4 },
        { tone: 'passive', t: "Come on. Let me introduce you. They're harmless.", r: "Introduce me. I'll be charming. It'll terrify them. Lead the way." },
        { tone: 'flirty', t: "Jealous looks good on you.", r: "It does. That's beside the point. ...Take me to the dance floor. Now. Make it obvious." },
      ] },
      { tone: 'flirty', t: "You watched me for forty minutes?", r: "I watched the clock. You were standing in front of it. Repeatedly.", opts: [
        { tone: 'cold', t: "Bit possessive, isn't it?", r: "Possessive. Of all the words on offer. I'll unpossess, then. Watch me.", m: -4 },
        { tone: 'passive', t: "It meant nothing. You know that.", r: "I know that. I needed to hear it. Don't tell anyone I needed anything." },
        { tone: 'flirty', t: "The next forty minutes are yours. All of them.", r: "All of them. Timed. In public. Starting now. Put your glass down." },
      ] },
    ],
  },

  // ---- close / passive: settled; in-jokes, the future, missing each other -----------------------------------------
  {
    id: 'ice-close-passive-1', stage: 'close', mood: 'passive',
    say: "I'm still wearing your jacket. No, you can't have it back. It's mine now, by right of occupation.",
    opts: [
      { tone: 'cold', t: "I actually need it back.", r: "Need. Fine. Here. It was warm. You'll notice it isn't, now.", m: -3, opts: [
        { tone: 'cold', t: "Thanks.", r: "One word. I deserved at least four. Enjoy your jacket.", m: -3 },
        { tone: 'passive', t: "Actually, keep it. It's happier with you.", r: "It is. Thank you for noticing. I'll keep it on until you stop pretending to mind." },
        { tone: 'flirty', t: "Keep it. I'll steal it back at yours.", r: "You can try. I sleep lightly and guard my possessions. It's mine now, remember." },
      ] },
      { tone: 'passive', t: "By occupation? Is that a legal term?", r: "It is now. I've written it into our constitution. Clause four. You signed it in the car.", opts: [
        { tone: 'cold', t: "I don't remember signing anything.", r: "Convenient. I'll remember for both of us, then. I'm used to it.", m: -2 },
        { tone: 'passive', t: "What are clauses one to three?", r: "No racing talk before coffee. No leaving without saying goodbye. And I'm always right." },
        { tone: 'flirty', t: "I'd sign anything you put in front of me.", r: "A dangerous thing to say to me. I write very long contracts. With very small print." },
      ] },
      { tone: 'flirty', t: "It looks better on you. Everything does.", r: "Everything does. You learned that early. It's why I kept you.", opts: [
        { tone: 'cold', t: "Getting a bit big-headed there.", r: "Big-headed. Warmth used to be welcome here. I'll put it away.", m: -3 },
        { tone: 'passive', t: "Keep it. I've got others.", r: "Not like this one. It smells like your car and you. Sentimental. Ignore me." },
        { tone: 'flirty', t: "Keep wearing it. I like seeing you in my things.", r: "Your things. I like being in them more than I'll ever say. That was nearly saying it." },
      ] },
    ],
  },
  {
    id: 'ice-close-passive-2', stage: 'close', mood: 'passive',
    say: "Where do you see this going? I'm asking casually. With a pen.",
    opts: [
      { tone: 'cold', t: "Do we need to plan everything?", r: "No. But I'd like to know there's a road. Apparently it's gravel.", m: -3, opts: [
        { tone: 'cold', t: "Let's not do this now.", r: "Not now has a habit of becoming not ever. I'll put the pen away.", m: -4 },
        { tone: 'passive', t: "Sorry. I just don't plan past the next race.", r: "I know. It's why I'm asking. Someone in this has to look past {track}." },
        { tone: 'flirty', t: "I see it going wherever you are.", r: "Romantic and evasive. Like you. I'm writing it down anyway." },
      ] },
      { tone: 'passive', t: "Honestly? Somewhere good. Somewhere together.", r: "Somewhere together. Your handwriting's terrible, but I can read that.", opts: [
        { tone: 'cold', t: "Don't hold me to it.", r: "I hold everyone to everything. That isn't news to you.", m: -3 },
        { tone: 'passive', t: "What did you write down?", r: "Your name, a question mark and a small drawing of your car. I'll deny the drawing." },
        { tone: 'flirty', t: "Write it in ink.", r: "Ink. You're sure. I'm uncapping it. ...Done. That's permanent now. So are you." },
      ] },
      { tone: 'flirty', t: "I see it going back to yours, tonight.", r: "Charming, and a dodge. I asked about years. You answered in hours.", opts: [
        { tone: 'cold', t: "Years are a lot of pressure.", r: "Pressure. Sorry to be such a weight. I'll go and be light somewhere else.", m: -4 },
        { tone: 'passive', t: "Okay. Years, then. Lots of them.", r: "Lots. Not a number, but a direction. I'll accept a direction." },
        { tone: 'flirty', t: "Hours first. Years after. I'm thorough.", r: "Thorough. You are. ...Fine. Hours first. The years can wait outside." },
      ] },
    ],
  },
  {
    id: 'ice-close-passive-3', stage: 'close', mood: 'passive',
    say: "Three weeks of you on the other side of the world. I counted. I don't count things.",
    opts: [
      { tone: 'cold', t: "It's the job. You knew that.", r: "I knew. Knowing isn't liking. You'd think someone so fast could tell the difference.", m: -4, opts: [
        { tone: 'cold', t: "Then maybe this isn't working.", r: "...Don't say things like that to fill a silence. I'll believe you. I'm going.", m: -6 },
        { tone: 'passive', t: "Sorry. That came out wrong. I missed you too.", r: "Too. You buried the important word at the end. Next time, lead with it." },
        { tone: 'flirty', t: "But I'm back now. Let me hold you.", r: "Now. You're very fond of now. ...Fine. Here. Briefly. I'm still counting." },
      ] },
      { tone: 'passive', t: "I counted too. Twenty-one days.", r: "Twenty-two. You forgot the travel day. I never forget the travel day.", opts: [
        { tone: 'cold', t: "Close enough.", r: "Close enough is how races are lost. I'll see you when I'm less precise.", m: -4 },
        { tone: 'passive', t: "Twenty-two, then. What did I miss?", r: "Me, mostly. And a play I loathed. I saved my opinions for you. There are many." },
        { tone: 'flirty', t: "Twenty-two days. Let me make up for each one.", r: "Each one. Itemised. I like that. Start with day one. It was a Tuesday." },
      ] },
      { tone: 'flirty', t: "You counted. You missed me.", r: "I noticed an absence. A large one. Shaped exactly like you.", opts: [
        { tone: 'cold', t: "You'll survive the next one.", r: "I'll survive. I always survive. That's the problem. It's very quiet.", m: -4 },
        { tone: 'passive', t: "I'll call more next time.", r: "Call at night, when the hotel's quiet and your voice goes low. That's the one I miss." },
        { tone: 'flirty', t: "Then let me fill the shape back in.", r: "Fill it in. Slowly. I've been cold for three weeks. You've some catching up to do." },
      ] },
    ],
  },
  {
    id: 'ice-close-passive-4', stage: 'close', mood: 'passive', where: 'evening',
    say: "You ordered my usual without asking. I hate that you know it. I hate it with my whole heart.",
    opts: [
      { tone: 'cold', t: "Saves time.", r: "Saves time. Not quite the romance I was reaching for. I'll eat in silence.", m: -3, opts: [
        { tone: 'cold', t: "Good. A quiet dinner.", r: "Quiet. Lovely. I'll sit here in my usual, being taken for granted in it.", m: -4 },
        { tone: 'passive', t: "Okay. I did it because I know you.", r: "There. Said like a fact. It's the best thing anyone's said to me this week." },
        { tone: 'flirty', t: "I also know what you'll want for dessert.", r: "Then don't say it out loud. Let me pretend I'm unpredictable. For the waiter's sake." },
      ] },
      { tone: 'passive', t: "I pay attention. You taught me.", r: "I did. I'm a good teacher. You were a slow student and a quick study.", opts: [
        { tone: 'cold', t: "Don't take all the credit.", r: "Half the credit, then. And half the warmth. You'll notice the difference.", m: -3 },
        { tone: 'passive', t: "What else did you teach me?", r: "To be early. To say goodbye properly. To leave me the window seat. You're nearly finished." },
        { tone: 'flirty', t: "And what's the next lesson?", r: "Patience. It starts after dinner. You'll hate every minute until you don't." },
      ] },
      { tone: 'flirty', t: "You love that I know it.", r: "I love very few things. You know which. Stop smiling. Eat.", opts: [
        { tone: 'cold', t: "Fine. Don't make it a big deal.", r: "Not a big deal. Says the one who knows my order. Noted. Shelved.", m: -3 },
        { tone: 'passive', t: "I'll order it every time, then.", r: "Every time. That's a promise. I'll hold you to it in thirty years. In this booth." },
        { tone: 'flirty', t: "I know a few other things you like, too.", r: "Not at the table. Hold that thought. Hold it until we're home." },
      ] },
    ],
  },

  // ---- close / flirty: they open smouldering; the heat under the ice ----------------------------------------------
  {
    id: 'ice-close-flirty-1', stage: 'close', mood: 'flirty',
    say: "You have that look. The one I pretend doesn't work on me. Keep pretending with me.",
    opts: [
      { tone: 'cold', t: "What look? I'm just tired.", r: "Tired. Of course. I'll put my face away. It was only for you.", m: -4, opts: [
        { tone: 'cold', t: "Yeah. Let's call it a night.", r: "Call it whatever you like. I'll call a car.", m: -4 },
        { tone: 'passive', t: "Sorry. I am tired. But it's the look, yes.", r: "Both. Tired and looking. I'll take the look and send the tired to bed." },
        { tone: 'flirty', t: "Fine. It's the look. You know what it means.", r: "I know exactly. I've known all evening. I was waiting for you to admit it." },
      ] },
      { tone: 'passive', t: "It's just my face.", r: "Your face has opinions. Very specific ones. All of them about me.", opts: [
        { tone: 'cold', t: "Don't flatter yourself.", r: "I never flatter myself. You used to do it for me. Odd to hear you stop.", m: -4 },
        { tone: 'passive', t: "Fine. Some of them are about you.", r: "Most. Be accurate. I'm about to be very accurate about you." },
        { tone: 'flirty', t: "They're all about you. Every one.", r: "Every one. Read them to me later. Slowly. With the lights low." },
        { tone: 'risque', t: "Want me to tell you what they say? In your ear?", r: "Tell me. ...Not that one. Later. That one needs a door that locks." },
      ] },
      { tone: 'flirty', t: "I'll stop pretending if you do.", r: "You first. You're braver than I am. Don't spread that around.", opts: [
        { tone: 'cold', t: "No. You first.", r: "Then we'll both stand here pretending. I'm better at it. You'll lose.", m: -3 },
        { tone: 'passive', t: "Alright. It works on you. A bit.", r: "A bit. Generous. It works on me entirely. There. Now neither of us is pretending." },
        { tone: 'flirty', t: "You're melting. I can see it.", r: "You can see it because I'm letting you. That's the only difference between us." },
        { tone: 'risque', t: "Then come home and stop pretending properly.", r: "Properly. You do know how to choose a word. Get the coat. Leave the pretending here." },
      ] },
      { tone: 'risque', t: "It's the look of someone who wants you to themselves tonight.", r: "To yourself. Greedy. I like greedy, with you. I'm not supposed to admit that.", opts: [
        { tone: 'cold', t: "Unless you're busy.", r: "I was never busy. I was available and pretending. Now I'm only annoyed.", m: -3 },
        { tone: 'passive', t: "Or just dinner, if you'd rather.", r: "Dinner first. The rest after. I like order. You're the one exception to it." },
        { tone: 'flirty', t: "No pretending tonight. Not one bit.", r: "Not one. You've never seen me without the act. You might like it. I might." },
        { tone: 'risque', t: "Your place. No phones. No pretending. Until morning.", r: "Until morning. You've done the planning. I've done the deciding. Yes.", m: 5 },
      ] },
    ],
  },
  {
    id: 'ice-close-flirty-2', stage: 'close', mood: 'flirty', where: 'party',
    say: "Dance with me. I'll deny it tomorrow, but tonight I want everyone to see.",
    opts: [
      { tone: 'cold', t: "I'm not really in the mood.", r: "Not in the mood. I asked in public. I don't ask in public. Lesson learned.", m: -5, opts: [
        { tone: 'cold', t: "Ask someone else.", r: "...I will not. I'll leave. You'll watch me go. That will have to do for you.", m: -5 },
        { tone: 'passive', t: "Sorry. One song. Properly.", r: "One. And you'll smile through it. I've already decided." },
        { tone: 'flirty', t: "Kidding. I'd never turn you down.", r: "Don't joke with me in public. I nearly froze the dance floor. ...Come on, then." },
      ] },
      { tone: 'passive', t: "Everyone? Even the cameras?", r: "Even them. Tomorrow I'll be mysterious again. Tonight I want to be obvious.", opts: [
        { tone: 'cold', t: "I'd rather keep it private.", r: "Private. I asked to be seen with you and you said private. I heard it.", m: -4 },
        { tone: 'passive', t: "Alright. One song, then we get some air.", r: "Air after. Song first. You lead. I'll correct you." },
        { tone: 'flirty', t: "Then let's give them something to print.", r: "Something to print. Nothing to prove. Just us, badly behaved. Come on." },
      ] },
      { tone: 'flirty', t: "I'll make you forget anyone's watching.", r: "You've done it before. I forgot an entire room once. Do it again.", opts: [
        { tone: 'cold', t: "Actually, I'll sit this one out.", r: "You raise the stakes, then fold. Don't play with me, {me}. Sit, then.", m: -4 },
        { tone: 'passive', t: "Just one, then. Slow.", r: "Slow. Of course. You've always known exactly which song." },
        { tone: 'flirty', t: "Hold on. I won't let go until they close.", r: "Don't let go after that, either. That's an instruction." },
        { tone: 'risque', t: "And afterwards, a very private encore.", r: "An encore. You know I never give those. Except to you. Twice, so far.", m: 4 },
      ] },
      { tone: 'risque', t: "One dance here. The rest at home.", r: "The rest at home. I'd blush, but I don't. ...Watch me nearly do it.", m: 4, opts: [
        { tone: 'cold', t: "Or just the one. I'm shattered.", r: "A grand promise, and then the weather report. Hm.", m: -3 },
        { tone: 'passive', t: "Or we just head home and talk.", r: "Talk. Fine. Talking is how this started. It's how we'd keep it." },
        { tone: 'flirty', t: "Home. Your favourite record. The good armchair.", r: "My favourite record. You remembered which. That's the most dangerous thing you've done tonight." },
        { tone: 'risque', t: "Home, and I'll prove I've been thinking about it all night.", r: "All night. I watched you think. Very distracting. Find our coats.", m: 5 },
      ] },
    ],
  },
  {
    id: 'ice-close-flirty-3', stage: 'close', mood: 'flirty', where: 'evening',
    say: "Your flat. The lights low. Me in your chair. Ask me why I'm smiling.",
    opts: [
      { tone: 'cold', t: "I'm not playing games tonight.", r: "It wasn't a game. It was an invitation. You're very good at missing those.", m: -4, opts: [
        { tone: 'cold', t: "Then don't send them.", r: "I won't. I'll sit here politely until it's time to leave. Then I'll leave.", m: -5 },
        { tone: 'passive', t: "Sorry. That was the day talking. Tell me why you're smiling.", r: "Because I like being here. In your chair. In your life. Don't make me say it twice." },
        { tone: 'flirty', t: "Alright, trouble. What's the smile for?", r: "Because I know what happens next. You don't, yet. That's my favourite part." },
      ] },
      { tone: 'passive', t: "Why are you smiling?", r: "Because you've been looking at me like that since the door closed. Don't stop.", opts: [
        { tone: 'cold', t: "I wasn't looking.", r: "You were. Now you're lying. Interesting evening. Short, too.", m: -4 },
        { tone: 'passive', t: "Can't help it. You look at home here.", r: "I am at home here. That terrifies me. Sit down before I say anything else soft." },
        { tone: 'flirty', t: "Because you're thinking what I'm thinking.", r: "I'm thinking it better. More detail. Fewer words." },
        { tone: 'risque', t: "Because you know you're not leaving tonight.", r: "I know. I knew when I took my shoes off. You're slow, for a fast person.", m: 4 },
      ] },
      { tone: 'flirty', t: "Tell me, gorgeous. I'm asking nicely.", r: "Because you only ask like that in this room. It's my favourite way you say anything.", opts: [
        { tone: 'cold', t: "Don't get too comfortable.", r: "I'll stand, then. I'll find my comfort somewhere else.", m: -4 },
        { tone: 'passive', t: "You're smiling because you're happy.", r: "Happy. Such a plain word. Accurate, though. Don't tell anyone how plain I am with you." },
        { tone: 'flirty', t: "Because I'm about to walk over there.", r: "Then walk slowly. I want to watch you decide." },
        { tone: 'risque', t: "Smile like that again and you'll never get out of that chair.", r: "That was the plan. I've been sitting here for twenty minutes making it obvious.", m: 5 },
      ] },
      { tone: 'risque', t: "You're smiling because you've already decided how tonight ends.", r: "Decided, rehearsed and slightly improved. Come here. I'll show you the edit.", m: 5, opts: [
        { tone: 'cold', t: "Maybe I've decided differently.", r: "Then you'd better say so. I'd hate to be wrong about you. I so rarely am.", m: -4 },
        { tone: 'passive', t: "Then let me just sit with you a while first.", r: "Sit. Slow is good. I've waited all week. A few more minutes won't break me." },
        { tone: 'flirty', t: "Show me the edit. Every line.", r: "Every line, in order. You'll want to skip ahead. You won't be allowed." },
        { tone: 'risque', t: "Then come and collect. You know the way.", r: "I've known the way for months. Lights off. Leave the rest to me.", m: 5 },
      ] },
    ],
  },
  {
    id: 'ice-close-flirty-4', stage: 'close', mood: 'flirty',
    say: "I missed you. Don't make a thing of it. ...Make a small thing of it.",
    opts: [
      { tone: 'cold', t: "It's only been a week.", r: "Only. As though a week were small. I'll remember the size you gave it.", m: -4, opts: [
        { tone: 'cold', t: "It is small.", r: "Then I'm small too, for minding. I'll mind somewhere else.", m: -5 },
        { tone: 'passive', t: "Sorry. Long week. It felt longer without you.", r: "Longer without me. Better. I'll accept it, because I can hear that you meant it." },
        { tone: 'flirty', t: "A week of thinking about you, though.", r: "Then why open with the calendar? Start with that part. I'll forgive the rest." },
      ] },
      { tone: 'passive', t: "A small thing, then. You were missed.", r: "Small and true. Like the notes you leave in my coat. Yes, I found all of them.", opts: [
        { tone: 'cold', t: "They were reminders, not love letters.", r: "Reminders. Of course. I'll stop keeping them in a drawer, then.", m: -4 },
        { tone: 'passive', t: "I'll leave more next time.", r: "Do. Better handwriting, if possible. Same sentiment, always." },
        { tone: 'flirty', t: "There's one you haven't found yet.", r: "There isn't. I've checked every pocket twice. ...Where is it? Tell me. Don't tell me." },
      ] },
      { tone: 'flirty', t: "Small? I'm going to make a huge thing of it.", r: "Don't you dare. ...Well. Dare a little. Within reason.", opts: [
        { tone: 'cold', t: "Fine. Small, then.", r: "That was a test. You failed it in one word. I'll go back to not missing you.", m: -4 },
        { tone: 'passive', t: "Medium thing. Dinner, then home.", r: "Medium. Reasonable. You're getting good at reading me. It's unsettling." },
        { tone: 'flirty', t: "Huge. Flowers. A speech. A kiss in public.", r: "A speech, no. The kiss, yes. In public, perhaps. Ask me again in front of people." },
        { tone: 'risque', t: "Huge. Private. All night.", r: "All night. Now that's the size of thing I meant. Let's go before I get sensible.", m: 5 },
      ] },
      { tone: 'risque', t: "Then let me show you how much I missed you. Not here.", r: "Not here. Where, then? ...Never mind. Wherever you're going, I'm already halfway there.", m: 5, opts: [
        { tone: 'cold', t: "Actually, maybe later.", r: "Later. You lit the match and blew it out. Very theatrical.", m: -3 },
        { tone: 'passive', t: "Or just stay close tonight. That's enough.", r: "Close is enough. Close is a lot, actually. More than I'd admit to anyone else." },
        { tone: 'flirty', t: "Somewhere with a lock and no clock.", r: "No clock. You know I'll still be counting. Count with me." },
        { tone: 'risque', t: "Mine. Now. I'll make up for every night away.", r: "Every night. I have a list. It's long. Start at the top, and don't rush.", m: 5 },
      ] },
    ],
  },
];
