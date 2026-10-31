// SHY - in person, stage 'warm': finding their voice with you. More words, drier jokes, the first flirting back.
export const DATA = [
  // ---- slot 1: a saved place (re-states the quiet-corner habit) ---------------------------------------------------------
  { id: 'shy-warm-1-cold', stage: 'warm', slot: 1, mood: 'cold',
    say: "I saved you a spot. In the quiet bit. I wasn't sure you'd... after last time. You can say no. I'd understand.",
    opts: [
      { tone: 'cold', t: "I don't need a spot saved.", r: "No. Of course. You don't. I'll unsave it. That's fine. It's just a spot.", opts: [
        { tone: 'cold', t: "It is just a spot.", r: "Yes. ...I'll go and stand by it. On my own. That's fine." },
        { tone: 'passive', t: "Sorry. That was rude. Thank you for saving it.", r: "You're welcome. It's not much. A spot and some quiet. But it's the good spot." },
        { tone: 'flirty', t: "Actually, I'll take it. If you're in it.", r: "I'm in it. I'm always in it. ...That sounded sadder than I meant. I'm glad you're in it too." },
      ] },
      { tone: 'passive', t: "Of course I'd come. What's new with you?", r: "My cat, Pickle, bit the postman's bag. That's the news. That's all of the news.", opts: [
        { tone: 'cold', t: "Big week.", r: "It was. For Pickle. ...Sorry. I'll find better news." },
        { tone: 'passive', t: "Tell me more. I like your news.", r: "You do? The postman forgave Pickle. I didn't. That's the whole saga. I liked telling you it." },
        { tone: 'flirty', t: "Your news is my favourite news.", r: "Out of all the— you have real news. With cars in it. ...I'm going to collect better news for you." },
      ] },
      { tone: 'flirty', t: "You saved me a spot? That might be the sweetest thing anyone's done.", r: "It's a spot. A quiet one. Don't— okay. It is a bit sweet. I thought about it for a while.", opts: [
        { tone: 'cold', t: "Let's not get carried away.", r: "No. Not big. A very small deal. ...Sorry." },
        { tone: 'passive', t: "How long is 'a while'?", r: "Since I knew I'd see you. I thought 'the good side'. Then I moved. That's a lot, for me." },
        { tone: 'flirty', t: "Save me a spot every time. Right next to you.", r: "Every time. Right next to— okay. I'll bring a second chair. To every corner. Forever." },
      ] },
    ] },
  { id: 'shy-warm-1-passive', stage: 'warm', slot: 1, mood: 'passive',
    say: "I found the quiet bit. I always do. But this time I saved you the good side. I don't hide from you. I hide... with you.",
    opts: [
      { tone: 'cold', t: "You don't need to hide at all, you know.", r: "I know. People say that. Like it's a switch. It isn't. Sorry.", opts: [
        { tone: 'cold', t: "Seems like a choice to me.", r: "It isn't, though. ...It's fine. I'll be in the corner." },
        { tone: 'passive', t: "Sorry. You're right. It's not a switch.", r: "Thank you. It's more like a dimmer. You turn it up. Slowly. You're doing it, a bit." },
        { tone: 'flirty', t: "Then I'll hide with you. Wherever you go.", r: "Even the cupboard ones? I'm joking. Mostly. ...Yes. Hide with me." },
      ] },
      { tone: 'passive', t: "Hiding with you sounds nice. Budge up.", r: "Budging. There. The good side's yours. I've had it all day.", opts: [
        { tone: 'cold', t: "I won't stay long.", r: "Okay. Short is fine. Short's still... something." },
        { tone: 'passive', t: "This is nice. Quiet. Just us.", r: "Just us. It's my favourite kind of busy. That doesn't— it does make sense, actually. To me." },
        { tone: 'flirty', t: "Any closer and we'll be one person.", r: "One very quiet person. With your laugh. ...I'd like that. That's a strange thing to like. I'd still like it." },
      ] },
      { tone: 'flirty', t: "Hiding with you is my favourite part of any day.", r: "Any— even race days? With the cars? You can't. You can, but. Oh.", opts: [
        { tone: 'cold', t: "Well. Maybe second favourite.", r: "Second. Okay. Second's still— it's fine." },
        { tone: 'passive', t: "Even race days. This is where I breathe.", r: "Here? Next to me? I'm the one who doesn't breathe. ...That's nice. I'll stay very still. So you can." },
        { tone: 'flirty', t: "Especially race days. You're my finish line.", r: "That's terrible. That's the worst line I've— say it again. No. Don't. Yes." },
        { tone: 'risque', t: "Nobody can see us here. I could kiss you and no one would know.", r: "I'd know. I'd know for the rest of my— not yet. I can't breathe. Not here. Ask me again. Somewhere." },
      ] },
    ] },
  { id: 'shy-warm-1-flirty', stage: 'warm', slot: 1, mood: 'flirty',
    say: "Hi. I saved you the good side of the quiet corner. I've never saved anyone anything. Don't make it a big deal. It's a big deal.",
    opts: [
      { tone: 'cold', t: "It's a corner. Let's not make it romantic.", r: "No. Right. It's a corner. Corners aren't romantic. I'll stop.", opts: [
        { tone: 'cold', t: "Agreed.", r: "...Okay. Just a corner. Just quiet." },
        { tone: 'passive', t: "Okay, it's a little romantic. Thank you.", r: "A little. That's what I was going for. Not a lot. A little. You noticed the little." },
        { tone: 'flirty', t: "Fine. It's very romantic. Come here.", r: "I'm already here. You mean closer. Oh. Okay. Closer. That's— hi." },
      ] },
      { tone: 'passive', t: "Thank you. It is a good side.", r: "It's the best side. You can see the door, and nobody can see you. I've done the research.", opts: [
        { tone: 'cold', t: "Bit paranoid, isn't it?", r: "A bit. Yes. Never mind. Sorry." },
        { tone: 'passive', t: "You've thought about this more than anyone ever has.", r: "I've thought about this more than anything. Corners. And you. Corners and you. Mostly corners." },
        { tone: 'flirty', t: "Nobody can see us? Interesting.", r: "Interesting. Why— oh. No. I didn't— I mean, nobody can, but I didn't— I'm going to look at the door." },
      ] },
      { tone: 'flirty', t: "Too late. I'm making it a huge deal. Thank you.", r: "You can't— okay. You are. You're making it one. That's allowed. I'll allow it.", opts: [
        { tone: 'cold', t: "Fine. Small deal.", r: "Small. Okay. ...It was going to be a big one. That's fine." },
        { tone: 'passive', t: "What else have you never done for anyone?", r: "Laughed at their jokes when they weren't funny. I do that for you. ...Joking. Your jokes are fine." },
        { tone: 'flirty', t: "Next you'll be saving me a kiss.", r: "I can't save that. Where would I keep it? ...I'm going to think about where I'd keep it. All week." },
      ] },
    ] },

  // ---- slot 2: the list (ESTABLISHES: a note in their phone of small things about you) ---------------------------------
  { id: 'shy-warm-2-cold', stage: 'warm', slot: 2, mood: 'cold',
    say: "I have to confess something. And you were a bit short, last time. So this is a bad time. But. I keep a list. About you.",
    opts: [
      { tone: 'cold', t: "A list? Of what?", r: "Small things. Like how you go quiet before anything hard. It's in my phone. I'll delete it.", opts: [
        { tone: 'cold', t: "Maybe delete it.", r: "Okay. ...Deleting. It's gone. Sorry." },
        { tone: 'passive', t: "Don't delete it. I go quiet?", r: "Every time. Quiet. Before the hard thing. It's very brave-looking. I wrote it down weeks ago." },
        { tone: 'flirty', t: "Keep it. Add that you're adorable when you confess.", r: "That's about me. Then it's not your list, it's— okay. I'll start a second one. About... that." },
      ] },
      { tone: 'passive', t: "That's not creepy. That's kind of lovely.", r: "Is it? I worried. It's mostly things like 'laughs with whole face' and 'kind to people carrying things'.", opts: [
        { tone: 'cold', t: "It's a bit much, honestly.", r: "It is. I know. I'll keep it shorter. Or in my head. Sorry." },
        { tone: 'passive', t: "Kind to people carrying things? I never noticed that.", r: "Nobody notices their own kindness. That's why someone else has to. ...That sounded wiser in my head." },
        { tone: 'flirty', t: "I want to read it. Every word.", r: "Every— no. Not yet. Some of the words are... later words. Ones I haven't said yet." },
      ] },
      { tone: 'flirty', t: "I'd keep a list about you too. It'd be longer.", r: "It wouldn't. There's not much. I'm mostly cardigan and pauses.", opts: [
        { tone: 'cold', t: "Fine, it'd be short.", r: "Yes. Short. ...I said it first. Okay." },
        { tone: 'passive', t: "Pauses are interesting. You'd be surprised.", r: "Would I? I'd like to be on a list. Even a short one. I'd read it every day." },
        { tone: 'flirty', t: "Item one: makes me stupidly happy.", r: "Stupidly— that's not on— I'm going to need you to write that down. Exactly that. In ink." },
      ] },
    ] },
  { id: 'shy-warm-2-passive', stage: 'warm', slot: 2, mood: 'passive',
    say: "Can I tell you something embarrassing? There's a list. In my phone. Of things I've noticed about you. Small things.",
    opts: [
      { tone: 'cold', t: "That's a little strange.", r: "Yes. It is. Strange. I knew it. I'll stop. I'll stop noticing.", opts: [
        { tone: 'cold', t: "I'd appreciate that.", r: "Okay. ...I'll try. I won't manage, but I'll try. Quietly." },
        { tone: 'passive', t: "Sorry. Strange isn't bad. What's on it?", r: "You laugh with your whole face. You listen properly. You've never once rushed me. I checked." },
        { tone: 'flirty', t: "Strange and sweet. Read me one.", r: "One. 'Thinks hard before deciding things.' ...You're doing it now. Just now. You're doing it." },
      ] },
      { tone: 'passive', t: "What kind of things?", r: "You go quiet before anything hard. You're gentle with people carrying things. You wait for me. Things like that.", opts: [
        { tone: 'cold', t: "Bit much to keep track of.", r: "It is. Sorry. My head just keeps things. I'll try to keep less." },
        { tone: 'passive', t: "I had no idea I did any of that.", r: "Nobody does. That's the point of a list. So someone knows. ...So I know." },
        { tone: 'flirty', t: "Is there anything on it about how I look at you?", r: "There is. It's item fourteen. I'm not reading item fourteen. Not today." },
      ] },
      { tone: 'flirty', t: "I'm on a list? I've never been happier.", r: "It's not a— okay, it is a list. But a nice one. It's a nice-things list.", opts: [
        { tone: 'cold', t: "Just teasing.", r: "Okay. Teasing. Yes. ...It's still there. The list. Sorry." },
        { tone: 'passive', t: "How long is it?", r: "Forty-one. Forty-two, after today. You do something new every time. It's very inconvenient." },
        { tone: 'flirty', t: "Add one: wants to kiss the list-keeper.", r: "I can't write that, my hands are— they're shaking. I'll write it later. Neatly. Underlined." },
      ] },
    ] },
  { id: 'shy-warm-2-flirty', stage: 'warm', slot: 2, mood: 'flirty',
    say: "There's a note in my phone called 'things'. It's about you. It's long. I'm only telling you because you were flirting last time.",
    opts: [
      { tone: 'cold', t: "I wasn't really flirting.", r: "Oh. Then the list is just... a list. Of a person. Who's fine. Sorry.", opts: [
        { tone: 'cold', t: "It's fine. Just a list.", r: "Just a list. Yes. ...I'll stop adding to it." },
        { tone: 'passive', t: "Okay, I was. What's in the note?", r: "'Goes quiet before hard things.' 'Waits for me.' 'Smells like rain sometimes.' ...That last one's weird. Ignore it." },
        { tone: 'flirty', t: "Fine. I was. And I want to read 'things'.", r: "Not yet. There's a section. A later section. You'd have to earn the later section." },
      ] },
      { tone: 'passive', t: "What's in 'things'?", r: "Small stuff. You go quiet before anything difficult. You look at people when they talk to you.", opts: [
        { tone: 'cold', t: "You've been watching pretty closely.", r: "Yes. Sorry. I'll watch less closely. From further away." },
        { tone: 'passive', t: "Huh. I never noticed. What else?", r: "You're kind to people carrying things. Every time. I noticed that one first. It's item one." },
        { tone: 'flirty', t: "What does it say about you looking at me?", r: "That's not in 'things'. That's in a different note. That note is called 'no'." },
      ] },
      { tone: 'flirty', t: "There's a note in my phone too. It just says your name.", r: "Just my— that's shorter than mine. And much worse for me. In a good way.", opts: [
        { tone: 'cold', t: "Kidding. It's my shopping list.", r: "Oh. Right. Milk and... okay. Sorry. I believed it. I believe everything you say." },
        { tone: 'passive', t: "It does. With a little star next to it.", r: "A star. I've never been a star. I've been a footnote. I'll think about the star all week." },
        { tone: 'flirty', t: "Your name, and 'see them again, soon'.", r: "Soon. Okay. Soon. Write 'soon' on mine as well. Next to item forty-two." },
      ] },
    ] },

  // ---- slot 3: a quiet plan - the sky jigsaw (re-states the puzzle) -----------------------------------------------------
  { id: 'shy-warm-3-cold', stage: 'warm', slot: 3, mood: 'cold',
    say: "I was going to ask if you'd... I do jigsaws, I don't know if I said. All sky. There's a new one. But you probably— never mind.",
    opts: [
      { tone: 'cold', t: "A jigsaw? Not really my thing.", r: "No. It's not. It's barely mine. It's fine. It's fine.", opts: [
        { tone: 'cold', t: "Ask someone else.", r: "There isn't— okay. Yes. I'll do it alone. I usually do." },
        { tone: 'passive', t: "But I'd try it. With you.", r: "You'd try. With me. The edges are easy. I'll give you easy ones. At first." },
        { tone: 'flirty', t: "I'd do anything boring if it's with you.", r: "Anything boring. The nicest insult. I'll find the most boring puzzle on earth. For us." },
      ] },
      { tone: 'passive', t: "I'd love to help. When?", r: "Oh. You would? Whenever. Sunday. Dawn. No— not dawn. People hate dawn. Sunday.", opts: [
        { tone: 'cold', t: "Not dawn. Definitely not dawn.", r: "No. Not dawn. ...Sorry. Afternoon. Or never. Afternoon." },
        { tone: 'passive', t: "Dawn's fine. I'm up early anyway.", r: "You are? Dawn, then. There's a light at dawn that makes the blues easier. I'll show you." },
        { tone: 'flirty', t: "Dawn, with you, a puzzle. That's a date.", r: "A date. Is it? It is. You called it a date. I'm going to need more biscuits." },
      ] },
      { tone: 'flirty', t: "You were going to ask me something. Ask me.", r: "Would you do a jigsaw. With me. At mine. It's not— it's literally a jigsaw.", opts: [
        { tone: 'cold', t: "Let's see.", r: "Okay. Let's see. ...That's fine. It'll keep. Jigsaws are patient." },
        { tone: 'passive', t: "Yes. I'd love to.", r: "Yes. Okay. You'll meet Pickle. My cat. Who'll sit on the pieces. I'm sorry in advance." },
        { tone: 'flirty', t: "Literally a jigsaw? Shame.", r: "Shame— it's a— oh. It's literally a jigsaw. There might be tea. That's literally tea." },
        { tone: 'risque', t: "Your place, quiet, just us. Forget the jigsaw.", r: "Forget the— no. I can't— the jigsaw is my... alibi. Without it I'd just be inviting you. Which I am. Oh no." },
      ] },
    ] },
  { id: 'shy-warm-3-passive', stage: 'warm', slot: 3, mood: 'passive',
    say: "I don't know if I ever told you: I do jigsaws. All sky. I've got a new one. Would you... help? With the edges? It's very boring. Sorry.",
    opts: [
      { tone: 'cold', t: "Sounds pretty boring, yeah.", r: "It is. I warned you. That's my defence. Sorry.", opts: [
        { tone: 'cold', t: "No offence.", r: "...None taken. Mostly." },
        { tone: 'passive', t: "But I'll help. I'm good at edges.", r: "You'd be good at edges. You're good at the outside of things. ...That came out deep. Accidentally." },
        { tone: 'flirty', t: "Boring with you isn't boring.", r: "That's the best review a jigsaw has ever had. I'll tell the jigsaw." },
      ] },
      { tone: 'passive', t: "I'd love to. Edges are my speciality.", r: "Since when? ...You're making that up. That's fine. I'll teach you. You sort by shape first.", opts: [
        { tone: 'cold', t: "Don't lecture me. I'll figure it out.", r: "Sorry. Yes. You'll figure it out. ...Okay." },
        { tone: 'passive', t: "Teach me. I'm a good student.", r: "You'll be a terrible student. You'll try to go fast. Jigsaws punish fast. ...I'll be patient. I'm good at patient." },
        { tone: 'flirty', t: "Teach me everything. Slowly.", r: "Slowly. That's the only speed jigsaws come in. That's— oh. You meant— okay. Yes. Slowly." },
      ] },
      { tone: 'flirty', t: "Edges with you sounds like the perfect date.", r: "A date. A jigsaw date. I didn't know that existed. I've just invented it.", opts: [
        { tone: 'cold', t: "Not a date. Just a puzzle.", r: "Just a puzzle. Okay. That's what I said. ...Before you said date." },
        { tone: 'passive', t: "Should I bring anything?", r: "Biscuits. And patience. And you. Mainly you. The biscuits are optional. You're not." },
        { tone: 'flirty', t: "I'll do the edges. You do the middle. Then we meet.", r: "Then we meet. In the middle. ...I know that's a metaphor. I'm going red at a metaphor." },
      ] },
    ] },
  { id: 'shy-warm-3-flirty', stage: 'warm', slot: 3, mood: 'flirty',
    say: "New jigsaw. Sky, all of it, a thousand pieces. I've never let anyone help with one. I'm offering. You. The edges. It's a big— it's big.",
    opts: [
      { tone: 'cold', t: "Not really my kind of thing.", r: "No. Okay. It was a lot to offer. Too much. Sorry.", opts: [
        { tone: 'cold', t: "Bit much, yeah.", r: "Yes. I'll keep the edges. It's fine." },
        { tone: 'passive', t: "Sorry. I'd actually like to try.", r: "You would? I'll start you on a small one. Five hundred. Training sky." },
        { tone: 'flirty', t: "Not my thing. But you are.", r: "I'm— oh. Then come for me, and tolerate the jigsaw. That's fine. That's a deal." },
      ] },
      { tone: 'passive', t: "I'm honoured. I'll do my best edges.", r: "Your best edges. I'll clear the table. My cat, Pickle, will be furious. Pickle sits on the sky.", opts: [
        { tone: 'cold', t: "I'll probably be rubbish.", r: "Probably. Yes. Everyone is. ...That's fine. Sorry." },
        { tone: 'passive', t: "I'll bring a peace offering for Pickle.", r: "Pickle accepts sardines and nothing else. Pickle has standards. Like me. Different ones." },
        { tone: 'flirty', t: "I'll be on my best behaviour. Mostly.", r: "Mostly. The mostly is worrying. In a— the mostly is good. I'll think about the mostly." },
      ] },
      { tone: 'flirty', t: "Never let anyone? Then I'll be very gentle with your sky.", r: "Very gentle with— that's a sentence I'm going to think about. The whole week.", opts: [
        { tone: 'cold', t: "It's only a puzzle.", r: "It is. Yes. Only a puzzle. ...Okay." },
        { tone: 'passive', t: "I mean it. I'll take it seriously.", r: "Thank you. People don't. Take it seriously. You do. You take me— it— seriously." },
        { tone: 'flirty', t: "Gentle, slow, and I'll stay till it's finished.", r: "That's weeks. You'd stay weeks? ...I'm going to buy the biggest jigsaw ever made." },
      ] },
    ] },

  // ---- slot 4: the tree (ESTABLISHES: cast as a tree in the school play, froze anyway) ----------------------------------
  { id: 'shy-warm-4-cold', stage: 'warm', slot: 4, mood: 'cold',
    say: "I was cast as a tree. In the school play. No lines. I still froze. ...That's why I'm like this. In case you wondered. After last time.",
    opts: [
      { tone: 'cold', m: -5, t: "A tree that froze. Sounds about right.", r: "Yes. It does. I know. ...I'll go back to being a tree. Sorry.", opts: [
        { tone: 'cold', t: "Fair enough.", r: "...It is fair. Okay. Bye, then." },
        { tone: 'passive', t: "Sorry. That was cruel. What happened?", r: "The lights came on and I couldn't move. A tree that couldn't move. Should've been fine. Everyone laughed." },
        { tone: 'flirty', t: "You're the loveliest tree I've ever met.", r: "Tree number three accepts. Tree number three is going red. Trees don't go red. I'm doing it anyway." },
      ] },
      { tone: 'passive', t: "Froze how? What happened?", r: "The lights came on. Everyone looked. And I just... stopped. Like a battery. I've been stopping ever since.", opts: [
        { tone: 'cold', t: "Everyone gets stage fright.", r: "Yes. Everyone. I know. Mine just stayed. Sorry. I'll stop." },
        { tone: 'passive', t: "You don't stop with me. Not any more.", r: "No. I don't. You noticed. I talk more with you than anyone. Except my cat. Cats don't count." },
        { tone: 'flirty', t: "I'd have clapped for you. Loudest in the room.", r: "Loudest. For a tree. ...I'd have unfrozen. I think. For that." },
      ] },
      { tone: 'flirty', t: "I bet you were the best tree on that stage.", r: "I was the only tree that cried. So— memorable. Not best. Memorable.", opts: [
        { tone: 'cold', t: "Memorable. Sure.", r: "...Yes. Okay. Thank you." },
        { tone: 'passive', t: "That must have been awful.", r: "It was. A long time ago, though. And then I found quiet places. And people who wait." },
        { tone: 'flirty', t: "You're memorable to me. And not because of the tree.", r: "Not the tree? Then what? No. Don't tell me. Write it down. I'll read it slowly." },
      ] },
    ] },
  { id: 'shy-warm-4-passive', stage: 'warm', slot: 4, mood: 'passive',
    say: "Did you know I was a tree in the school play? No lines. I just had to stand there. And I still froze. I've been that tree since.",
    opts: [
      { tone: 'cold', t: "It was just a school play.", r: "It was. Just a play. I know that. My body didn't. Sorry.", opts: [
        { tone: 'cold', t: "Should've got over it by now.", r: "Probably. Yes. I'll go and get over it. Somewhere." },
        { tone: 'passive', t: "Sorry. I shouldn't have said 'just'. That sounds hard.", r: "It was. It still is, some days. Not with you, though. Mostly not with you." },
        { tone: 'flirty', t: "You're not that tree any more. Look at you, talking to me.", r: "I'm talking, aren't I? To you. In front of people. ...Don't point it out. I'll freeze." },
      ] },
      { tone: 'passive', t: "That's awful. And a bit funny. Can I say a bit funny?", r: "You can say a bit funny. A frozen tree. Very authentic. Great reviews.", opts: [
        { tone: 'cold', t: "It's mostly funny.", r: "...Mostly. Yes. Funny. I'll laugh about it. Later. Alone." },
        { tone: 'passive', t: "Do you ever get on a stage now?", r: "Never. I sit at the back of everything. And then you put me in the front row of you. It's very bright." },
        { tone: 'flirty', t: "Authentic tree. Great reviews. And very cute.", r: "The tree had a brown jumper with felt leaves. ...Okay. It was a bit cute." },
      ] },
      { tone: 'flirty', t: "I'd have climbed onstage and stood next to you.", r: "As what? Another tree? A bush. You'd be a bush. ...That would have helped, actually.", opts: [
        { tone: 'cold', t: "A bush. Great.", r: "Yes. Sorry. That was a bad joke. I'll stop." },
        { tone: 'passive', t: "Two trees, both frozen. Solidarity.", r: "A forest. A very small one. ...I'd have liked that. I'd still like that. Metaphorically." },
        { tone: 'flirty', t: "I'd be the tree right next to yours. Branches touching.", r: "Branches— that's flirting. In tree. You're flirting in tree. I don't know how to answer in tree." },
      ] },
    ] },
  { id: 'shy-warm-4-flirty', stage: 'warm', slot: 4, mood: 'flirty',
    say: "Confession: I was a tree in the school play. Tree number three. No lines. I froze. So if I freeze when you look at me, blame the tree.",
    opts: [
      { tone: 'cold', t: "So it's not me. Good to know.", r: "No. It's not you. It's— never mind. Wrong words. Sorry.", opts: [
        { tone: 'cold', t: "Fine.", r: "...Fine. Okay. Tree's going." },
        { tone: 'passive', t: "Sorry. Thanks for telling me. That can't be easy.", r: "It isn't. But you're easy to tell things to. You wait. Even when I'm a tree." },
        { tone: 'flirty', t: "So when you freeze around me... it's a compliment?", r: "Yes. It's the biggest one I've got. I froze for a whole school once. Now I freeze for you." },
      ] },
      { tone: 'passive', t: "Tree number three. Did you have a costume?", r: "Brown jumper. Felt leaves. My mum glued them on. One fell off mid-scene. I didn't move.", opts: [
        { tone: 'cold', t: "Sounds humiliating.", r: "It was. Thank you for... saying so. I'll go." },
        { tone: 'passive', t: "I'd give anything to see a photo.", r: "There's one. My sister has it. She shows everyone. You might see it. One day. If you're unlucky." },
        { tone: 'flirty', t: "I'd have taken that fallen leaf home.", r: "Why would you— okay. That's very romantic. For a leaf. I'll find you a leaf." },
      ] },
      { tone: 'flirty', t: "Freeze all you want. I'll wait for you to thaw.", r: "Thaw. You'd wait. People don't— they fill the gap. You don't. You let me thaw.", opts: [
        { tone: 'cold', t: "Don't take too long.", r: "No. I'll try. Sorry. I'll thaw faster." },
        { tone: 'passive', m: 3, t: "I'll always wait. You're worth it.", r: "Worth it. I'm going to say that to the tree in me. It'll be very confused." },
        { tone: 'flirty', t: "And when you thaw, I'll be right here.", r: "Right here. Okay. I'm thawing. Right now. Look. ...Don't look. I'll freeze again." },
      ] },
    ] },

  // ---- slot 5: teasing - the dry humour fully out (uses the list and the tree) -------------------------------------------
  { id: 'shy-warm-5-cold', stage: 'warm', slot: 5, mood: 'cold',
    say: "Hi. I wasn't sure you'd want to. After last time. I made a joke about it. In my head. To cope. You don't want to hear it.",
    opts: [
      { tone: 'cold', t: "Not especially.", r: "No. It was a weak one. I'll keep it. In there.", opts: [
        { tone: 'cold', t: "Probably wise.", r: "Yes. Wise. ...I'll go back in." },
        { tone: 'passive', t: "Sorry. Actually, go on. Tell me.", r: "'At least the tree got applause.' ...That's it. It's about me. It's always about me. I'm the joke." },
        { tone: 'flirty', t: "I want to hear it. I want everything in your head.", r: "Everything? It's mostly lists. And biscuits. And you. You'd be bored. You'd be... in it." },
      ] },
      { tone: 'passive', t: "Go on. I deserve it.", r: "'Even trees get a second act.' ...That's the joke. It's a tree joke. Never mind.", opts: [
        { tone: 'cold', t: "That's not even funny.", r: "No. It isn't. That's why it stayed in my head. Sorry." },
        { tone: 'passive', t: "It's quite funny. You're very dry, you know.", r: "Dry. Like a biscuit. ...Sorry. The jokes keep coming out now. You've broken something." },
        { tone: 'flirty', t: "Second act's my favourite. I'm staying for it.", r: "Staying. There's an interval first. I have to go and be red. Then the second act." },
      ] },
      { tone: 'flirty', t: "Joke away. I like you when you're funny.", r: "Do you? I'm only funny when I'm scared. So I'm very funny right now. Hilarious.", opts: [
        { tone: 'cold', t: "Don't push it.", r: "No. Okay. Pushing nothing. Sorry." },
        { tone: 'passive', t: "Then let's make you less scared. Sit with me.", r: "Sitting. That's better. Less scared. Less funny. You'll have to choose." },
        { tone: 'flirty', t: "Scared and funny is a good look on you.", r: "Nobody's ever liked the scared one. You like the scared one. I'm— okay. A little less scared." },
      ] },
    ] },
  { id: 'shy-warm-5-passive', stage: 'warm', slot: 5, mood: 'passive',
    say: "I've worked out you're terrible at keeping still. You've fidgeted eleven times. I counted. It's going on the list.",
    opts: [
      { tone: 'cold', t: "Do you ever stop counting?", r: "No. Sorry. My brain does it. I'll stop doing it out loud, at least.", opts: [
        { tone: 'cold', t: "That'd help.", r: "Yes. ...Twelve. Sorry. I'll stop." },
        { tone: 'passive', t: "Sorry, that was snappy. What else is on the list?", r: "'Goes quiet before hard things.' 'Can't keep still.' 'Kind to everyone.' ...It's a good list. You're a good list." },
        { tone: 'flirty', t: "Count all you want. Just keep looking at me.", r: "I'll count your eyelashes next. No. That's— don't move. I'm joking. I'm— thirteen." },
      ] },
      { tone: 'passive', t: "Eleven? I'm a racing driver. Stillness isn't in the job.", r: "Clearly. You'd be a terrible tree. ...I'm allowed that one. I was a tree. I've earned it.", opts: [
        { tone: 'cold', t: "I wouldn't want to be a tree.", r: "No. Nobody does. ...Sorry. I'll stop with the trees." },
        { tone: 'passive', t: "You're funny today. Funnier than usual.", r: "I'm funny every day. Usually on the inside. You're getting the outside version. Limited release." },
        { tone: 'flirty', t: "I'd keep still for you. If you asked nicely.", r: "Please... keep still? ...You did. You actually did. Now I don't know what to do with you." },
      ] },
      { tone: 'flirty', t: "I can't keep still because you're right there.", r: "No. You were moving before I— okay. That's a nice lie. I'll write it down.", opts: [
        { tone: 'cold', t: "It was a joke.", r: "Yes. I know. ...I'll write it down anyway. Under 'jokes'." },
        { tone: 'passive', t: "Honestly? It's racing. My head never stops.", r: "Then stay next to me. I'm very still. It's catching. ...That's the one useful thing about me." },
        { tone: 'flirty', t: "Not a lie. You make me restless.", r: "Restless. I make you— okay. I'm going to keep very still now. One of us should." },
      ] },
    ] },
  { id: 'shy-warm-5-flirty', stage: 'warm', slot: 5, mood: 'flirty',
    say: "You're flirting already. I can tell. You do a thing with your eyebrow. It's on the list. Item nine. 'Eyebrow: dangerous.'",
    opts: [
      { tone: 'cold', t: "I'm not flirting.", r: "No. Okay. The eyebrow's just doing that. On its own. Sorry. I'll update the list.", opts: [
        { tone: 'cold', t: "Update it.", r: "Updating. 'Eyebrow: just an eyebrow.' ...Okay." },
        { tone: 'passive', t: "Okay, maybe the eyebrow is.", r: "The eyebrow is. Thank you for admitting it. I'll put a little tick next to item nine." },
        { tone: 'flirty', t: "Fine. The eyebrow and everything else.", r: "Everything else. That's not on the list. I'll need a new page. A whole page." },
      ] },
      { tone: 'passive', t: "Item nine? What's item ten?", r: "Item ten is 'laughs at my jokes even when they're bad'. Item eleven is a secret.", opts: [
        { tone: 'cold', t: "Keep your secret.", r: "I will. I'm good at secrets. ...It wasn't a bad one. It's fine." },
        { tone: 'passive', t: "Your jokes aren't bad. They're just quiet.", r: "Quiet jokes. That's the kindest way anyone's ever described me. I'm keeping it." },
        { tone: 'flirty', t: "Tell me item eleven. I'll do the eyebrow.", r: "Not the— okay. Item eleven: 'is going to kiss me eventually, probably'. ...I'm leaving. I'm leaving now." },
      ] },
      { tone: 'flirty', t: "If the eyebrow's dangerous, what about this?", r: "That's the smile. The smile's item two. The smile's been on there since the start.", opts: [
        { tone: 'cold', t: "I'll stop smiling, then.", r: "Don't— okay. Fine. ...Item two is very quiet now." },
        { tone: 'passive', t: "What's item one?", r: "'Was kind to me in a corner.' It's always item one. It's the reason there's a list." },
        { tone: 'flirty', t: "Both at once. Eyebrow and smile.", r: "That's unfair. That's two items at once. I can't— I'm going red in two columns." },
      ] },
    ] },

  // ---- slot 6: the two a.m. text (generic - they think they sent one) ---------------------------------------------------
  { id: 'shy-warm-6-cold', stage: 'warm', slot: 6, mood: 'cold',
    say: "I nearly texted you at two in the morning. After last time. I wrote it and didn't send it. Sorry. Whatever it would've been.",
    opts: [
      { tone: 'cold', t: "Good thing you didn't send it.", r: "Yes. Good. It's still in drafts. It was... not your problem. Sorry.", opts: [
        { tone: 'cold', t: "I wasn't asking to see it.", r: "No. Okay. ...That's fine. That's better. Probably." },
        { tone: 'passive', t: "Send it. If you want me to read it.", r: "I don't know what I want. That's sort of what the text was about. I'll send it. Then don't say anything." },
        { tone: 'flirty', t: "Send it. I'll read it twice. Slowly.", r: "Twice? No. Once, very fast, with your eyes half shut. ...Okay. Twice. But don't tell me." },
      ] },
      { tone: 'passive', t: "Whatever it was, it's okay. You can tell me things.", r: "Can I? It said... that I think about you. At two. And other times. Sorry.", opts: [
        { tone: 'cold', t: "That's a lot.", r: "Yes. It is. That's why it was two in the morning. Sorry." },
        { tone: 'passive', t: "I think about you too, you know.", r: "You do? At two? ...Not at two. Normal hours. That's fine. Normal hours are healthier." },
        { tone: 'flirty', t: "Two a.m. is when the honest stuff comes out.", r: "It is. Then honest me goes back to sleep, and awake me has to live with it. Here. With you." },
      ] },
      { tone: 'flirty', t: "If it says what I hope, don't apologise.", r: "What do you hope? No. Don't tell me. I'll check the draft. Later. Alone.", opts: [
        { tone: 'cold', t: "Forget it.", r: "Okay. Forgotten. ...I'll still check." },
        { tone: 'passive', t: "Check it. Then tell me if you mean it.", r: "I mean it. I always mean them. That's the problem. I just don't mean to send them." },
        { tone: 'flirty', t: "I hope it says you can't stop thinking about me.", r: "That's almost word for word. How did you— okay. I'm going to go and lie face down somewhere." },
      ] },
    ] },
  { id: 'shy-warm-6-passive', stage: 'warm', slot: 6, mood: 'passive',
    say: "We don't talk about the text. The two a.m. one I wrote and didn't send. It's sitting in drafts. It's... accurate, probably.",
    opts: [
      { tone: 'cold', t: "Good. Let's not.", r: "Thank you. ...Okay. Not talking about it. This is us not talking about it.", opts: [
        { tone: 'cold', t: "Exactly.", r: "Exactly. ...This is very hard. The not talking." },
        { tone: 'passive', t: "Okay, a little bit. Was it about me?", r: "Everything at two is about you. That's another two a.m. thing. It slipped out. In daylight." },
        { tone: 'flirty', t: "One question. Did you mean it?", r: "Yes. I mean them all. At two. Then at ten I'm horrified. And at eleven I mean them again." },
      ] },
      { tone: 'passive', t: "Accurate how?", r: "Accurately... fond. Of you. In a long paragraph. With a semicolon. I'm sorry about the semicolon.", opts: [
        { tone: 'cold', t: "A semicolon. Wow.", r: "Yes. ...I'm a semicolon person. You've found out. Okay." },
        { tone: 'passive', t: "Fond's nice. I'm fond of you too.", r: "You are? That's shorter than mine. But better. No semicolon. Very clean." },
        { tone: 'flirty', t: "Fond. Only fond?", r: "No. Not only. There was a second paragraph. The second paragraph is why I can't look at it." },
        { tone: 'risque', t: "Read me the second paragraph. Close. In my ear.", r: "In your— no. No. I'd combust. I'd be a small pile of cardigan. ...Not yet. Not out loud. Oh." },
      ] },
      { tone: 'flirty', t: "We absolutely talk about the text.", r: "No. We don't. We absolutely don't. I'll leave. I'll leave the country.", opts: [
        { tone: 'cold', t: "Fine. We won't.", r: "Thank you. ...We won't. Okay." },
        { tone: 'passive', t: "Okay, okay. One day we will.", r: "One day. When I'm very old. And brave. We'll read it together. And I'll faint." },
        { tone: 'flirty', t: "Send it. I'll like it. Especially the end.", r: "The end. Oh no. You want the end. ...I'm going to stand very still and be a tree." },
      ] },
    ] },
  { id: 'shy-warm-6-flirty', stage: 'warm', slot: 6, mood: 'flirty',
    say: "I almost texted you at two a.m. My cat woke me and I typed it all. Was it flirting? I didn't send it. It felt like flirting.",
    opts: [
      { tone: 'cold', t: "Sounds like a bit much.", r: "Yes. I thought so. Sorry. Two a.m. me is braver than is good for anyone.", opts: [
        { tone: 'cold', t: "Maybe keep two a.m. you quiet.", r: "Yes. I'll put the phone in a drawer. At night. Sorry." },
        { tone: 'passive', t: "A bit much. But sweet.", r: "Much, but sweet. That's most of me, really. Thank you." },
        { tone: 'flirty', t: "A lot much. Send it next time.", r: "Next time? At two? I'll set an alarm. That's not how it works. I'll set one anyway." },
      ] },
      { tone: 'passive', t: "It sounds like flirting. And it sounds nice.", r: "Nice. Oh, thank goodness. I'm worried I used the word 'yearning'.", opts: [
        { tone: 'cold', t: "I bet you did.", r: "I didn't. Did I? ...Oh no. I'm checking. Okay. I'm going." },
        { tone: 'passive', t: "No yearning. Just a lot of commas, I bet.", r: "Commas. That's fine. I love a comma. It's a little pause. Like me, typed." },
        { tone: 'flirty', t: "You can yearn at me any time.", r: "Any time. I'll yearn at a reasonable hour. Respectfully. Oh, this is going badly. It's going well." },
      ] },
      { tone: 'flirty', t: "Send it. I'll read it six times.", r: "Six? That's five times too many. Why six?", opts: [
        { tone: 'cold', t: "Mostly to check the spelling.", r: "The spelling. Okay. ...It's fine. I'll spell better. Sorry." },
        { tone: 'passive', t: "Because it'll make me smile. Every time.", r: "Even the sixth? Then— okay. I'll be less sorry about it. Ten percent less. I'll send it." },
        { tone: 'flirty', t: "Because I want to hear your voice saying it.", r: "My voice. Saying— I can't say it out loud. Not yet. It took two in the morning to type it." },
      ] },
    ] },

  // ---- slot 7: your loud world (they keep coming anyway) ----------------------------------------------------------------
  { id: 'shy-warm-7-cold', stage: 'warm', slot: 7, mood: 'cold',
    say: "Your life is very loud. Everywhere you go. I keep turning up anyway. I'm not sure you want me to. After last time.",
    opts: [
      { tone: 'cold', t: "Nobody's making you turn up.", r: "No. Nobody is. That's true. Maybe I'll stay home next time. Sorry.", opts: [
        { tone: 'cold', t: "Might be easier.", r: "Easier. Yes. For both— okay. ...Okay." },
        { tone: 'passive', t: "But I'm glad you do. Honestly.", r: "Are you? Even at the edges? The edges are fine. The edges have a good view of you." },
        { tone: 'flirty', t: "Nobody's making you. But I'm very glad you do.", r: "Very glad. Then I'll come louder. No. I'll come the same. But I'll stand closer." },
      ] },
      { tone: 'passive', t: "I want you around. Is it too loud?", r: "Always. But you sort of... turn it down. When you come over. Everything goes quieter.", opts: [
        { tone: 'cold', t: "That's not really my problem.", r: "No. It isn't. I know. ...I'll manage. Sorry." },
        { tone: 'passive', t: "Then I'll keep coming over.", r: "You don't have to. But— thank you. Every time you do, I write it down." },
        { tone: 'flirty', t: "I'll be your volume knob any day.", r: "That's the least romantic thing anyone's ever— I love it. I love that. Volume knob." },
      ] },
      { tone: 'flirty', t: "Stand next to me, not at the edges.", r: "Next to you? Where the cameras are? They'd see me. I'd be in the background of things.", opts: [
        { tone: 'cold', t: "Fine. Stay at the edge.", r: "Okay. The edge. It's familiar. Bye." },
        { tone: 'passive', t: "Just for a minute. I'll keep them away.", r: "A minute. Okay. ...I'd survive a minute. With you there. Thank you." },
        { tone: 'flirty', t: "Be in the background of my things. Every single one.", r: "I'd be in every photo. A little blur. Going red. ...Okay. Yes. A blur. Your blur." },
      ] },
    ] },
  { id: 'shy-warm-7-passive', stage: 'warm', slot: 7, mood: 'passive',
    say: "Everywhere you go is so loud. Cameras. Engines. People shouting your name. I keep coming anyway. I'm working out why. ...I know why.",
    opts: [
      { tone: 'cold', t: "You could just stay home.", r: "I could. I've thought about that. A lot. ...I'm still here, though.", opts: [
        { tone: 'cold', t: "Your choice.", r: "My choice. Yes. ...I'll make a different one next time. Maybe." },
        { tone: 'passive', t: "And I'm glad you are. Sorry. Why do you come?", r: "You. It's you. I'm not good at— it's you. That's the whole why. It fits in one word." },
        { tone: 'flirty', t: "You're here because of me. Say it.", r: "Because of you. There. I said it. To your face. Out loud. I need to lie down." },
      ] },
      { tone: 'passive', t: "Why do you keep coming?", r: "Because in the middle of all that noise, there's you. And you're quiet. With me. That's the why.", opts: [
        { tone: 'cold', t: "I'm not quiet.", r: "No. Not usually. Just with me. ...Never mind. Sorry." },
        { tone: 'passive', t: "You make me quiet too. The good kind.", r: "Do I? A good quiet? Not a bored quiet? ...I've worried it's a bored quiet." },
        { tone: 'flirty', t: "I'm quiet with you because I'm busy looking at you.", r: "I'm the least interesting thing in your life. There are cars. ...You're still looking. Stop. Don't stop." },
      ] },
      { tone: 'flirty', t: "You know why. I want to hear you say it, though.", r: "Because— no. You know why. I'm not saying it. Not out loud.", opts: [
        { tone: 'cold', t: "Fine. Keep it.", r: "I will. ...It's a good why. Shame." },
        { tone: 'passive', t: "Okay. Tell me somewhere quiet, then.", r: "Somewhere quiet. I'll tell you somewhere quiet. I'll whisper it. You'll have to lean in." },
        { tone: 'flirty', t: "Whisper it. Nobody else will hear.", r: "...It's you. I come for you. That's all. That's the loudest thing I've ever said." },
      ] },
    ] },
  { id: 'shy-warm-7-flirty', stage: 'warm', slot: 7, mood: 'flirty',
    say: "Your world is so loud. I hate it. I keep coming. You know why. Don't make me say it. You're going to make me say it.",
    opts: [
      { tone: 'cold', t: "Then don't say it.", r: "Okay. I won't. I'll keep it. Sorry. I misread— sorry.", opts: [
        { tone: 'cold', t: "No need.", r: "No. ...No need. Okay." },
        { tone: 'passive', t: "Sorry. I didn't mean that. Tell me.", r: "It's you. I keep coming because of you. And the noise is worth it. Mostly. Seventy percent." },
        { tone: 'flirty', t: "Don't say it. Show me instead.", r: "Show you— okay. I'm holding your sleeve. That's the show. That's all I've got." },
      ] },
      { tone: 'passive', t: "You can hate it. I hate it sometimes too.", r: "You do? You look like you love it. ...Until you see me. Then you look tired. Nicely.", opts: [
        { tone: 'cold', t: "I'm just tired. Don't read into it.", r: "No. Okay. Just tired. ...Sorry." },
        { tone: 'passive', t: "Seeing you is the rest. That's why.", r: "The rest. I'm the rest? Like a sit-down. I'll be your sit-down. That's very me. I love it." },
        { tone: 'flirty', t: "I look tired because I'm saving my energy for you.", r: "For me? What for— oh. Okay. That's a sentence. That's a sentence I'll hear all week." },
      ] },
      { tone: 'flirty', t: "Say it. I'll make it worth your while.", r: "That's not fair. Okay. It's you. I come because of you. ...Now make it worth it.", opts: [
        { tone: 'cold', t: "Worth it? Hm. Maybe later.", r: "Later. Okay. ...I said it for nothing. That's fine. I'd say it again." },
        { tone: 'passive', t: "Thank you. That means a lot.", r: "It means a lot to say it. Out loud. I've never— not with anyone. Okay. That's done. Wow." },
        { tone: 'flirty', t: "Closer, then. That's how I make it worth it.", r: "Closer. Okay. That's very worth it. That's worth all the engines. All of them." },
        { tone: 'risque', t: "Worth it means my place, later. Just us.", r: "Your— oh. Oh. One thing at a time. I've just said a whole sentence. I can't— ask me in a week." },
      ] },
    ] },

  // ---- slot 8: the compliment (the rehearsed one fails; the true one comes out plain) -----------------------------------
  { id: 'shy-warm-8-cold', stage: 'warm', slot: 8, mood: 'cold',
    say: "I rehearsed a compliment. For you. Even though... last time. I thought it might help. It's quite bad. Can I just— do it?",
    opts: [
      { tone: 'cold', t: "Go on, then. Quickly.", r: "'You're like a lighthouse. Bright. And... tall?' ...That was it. That was the whole thing.", opts: [
        { tone: 'cold', t: "Tall? Okay.", r: "...Yes. Tall. I'll go and be short somewhere." },
        { tone: 'passive', t: "That was kind of lovely, actually.", r: "It was? The real one was— I just meant you're easy to find. In the dark. When it's loud. That's all." },
        { tone: 'flirty', t: "A lighthouse. I'll shine for you, then.", r: "That's better than mine. You took my compliment and made it better. That's theft." },
      ] },
      { tone: 'passive', t: "You don't need to make up for anything. But I'd like to hear it.", r: "Okay. 'You're like the sky in my jigsaw. Lots of... blue.' ...I've ruined it. I'll stop.", opts: [
        { tone: 'cold', t: "That is quite bad.", r: "Yes. I said so. ...Okay." },
        { tone: 'passive', t: "What did you actually mean?", r: "That I could look at you for a month. Slowly. And not get bored. ...That's what I meant. Plainer." },
        { tone: 'flirty', t: "I want to be the sky in your jigsaw.", r: "You already are. That was the bit I couldn't say. Okay. I'm done. I'm done for a week." },
      ] },
      { tone: 'flirty', t: "Compliment me and I'll compliment you back.", r: "That's double pressure. Okay. 'You have a very... reliable face.' ...No.", opts: [
        { tone: 'cold', t: "Reliable. Thanks, I guess.", r: "Sorry. I meant— never mind what I meant. Sorry." },
        { tone: 'passive', t: "Reliable's underrated. What did you really want to say?", r: "That your face is the one I look for. In crowds. First. Every time. ...That's the one. Plain." },
        { tone: 'flirty', t: "My turn: you have the best blush I've ever seen.", r: "That's not fair. You did yours properly. ...I'm doing it now. The blush. You've caused it again." },
      ] },
    ] },
  { id: 'shy-warm-8-passive', stage: 'warm', slot: 8, mood: 'passive',
    say: "I've rehearsed a compliment. It's very elaborate. It has a simile. Can I— okay. Your laugh is like— no. Wait. I'll start again.",
    opts: [
      { tone: 'cold', t: "Skip the simile.", r: "Okay. Skipping. ...Without the simile there's nothing. It was all simile. Sorry.", opts: [
        { tone: 'cold', t: "Then skip the whole thing.", r: "Okay. Skipped. ...Sorry." },
        { tone: 'passive', t: "Just say it plain. No rehearsal.", r: "Plain. I like your face. I like it when it's looking at me. ...That's plain. That's terrifying." },
        { tone: 'flirty', t: "Plain's better. Your face says it all anyway.", r: "My face? Is it saying things? Is it saying everything? Don't read my face." },
      ] },
      { tone: 'passive', t: "Take your time. Like what?", r: "Like a kettle. No. Like rain on a window, when you're inside. ...Okay. That one's true.", opts: [
        { tone: 'cold', t: "A kettle. Wow.", r: "I know. ...I'll delete kettle. From everywhere." },
        { tone: 'passive', t: "Rain on a window. That one's lovely.", r: "It is, isn't it. It came out by itself. All the rehearsed ones fell over. That one walked." },
        { tone: 'flirty', t: "Say the true one again. Slowly.", r: "Your laugh is rain on a window. When I'm inside. ...Said it twice. Still true. Getting truer." },
      ] },
      { tone: 'flirty', t: "Start again as many times as you like. I've got all day.", r: "'You're the best thing about every room.' ...Oh. That one worked. That one wasn't rehearsed.", opts: [
        { tone: 'cold', t: "Bit cheesy.", r: "Yes. Cheesy. ...It was the true one, though." },
        { tone: 'passive', t: "That one landed. Thank you.", r: "It landed. A compliment. From me. Out loud. On the fourth try. Thank you for staying." },
        { tone: 'flirty', t: "And you're the best thing about every corner.", r: "Every corner. That's our thing. Corners. You gave it back better. You keep doing that." },
        { tone: 'risque', t: "Keep going. Compliment me somewhere more private.", r: "More— no. One room at a time. I've just done one compliment. Private is a whole new skill." },
      ] },
    ] },
  { id: 'shy-warm-8-flirty', stage: 'warm', slot: 8, mood: 'flirty',
    say: "I've got a compliment ready. It's dangerous. It might work. I've never tested it on a person. Only on my cat. My cat left.",
    opts: [
      { tone: 'cold', t: "Your cat left. That tells me something.", r: "It tells you my cat has no taste. ...Sorry. I'll keep the compliment.", opts: [
        { tone: 'cold', t: "Keep it.", r: "Yes. Keeping. ...Okay." },
        { tone: 'passive', t: "Okay, okay. Test it on me.", r: "'You make loud places quiet.' ...That's it. It's short. It's true. The cat stayed for that bit, actually." },
        { tone: 'flirty', t: "Your cat's loss. Let's hear it.", r: "'You make loud places quiet.' ...Your face is doing a thing. It worked. It worked. I need a chair." },
      ] },
      { tone: 'passive', t: "Go on. I'm a willing test subject.", r: "'You're the only person I don't rehearse for.' ...I rehearsed that, though. So it's a lie. It's true. Both.", opts: [
        { tone: 'cold', t: "That makes no sense.", r: "No. It doesn't. Most of me doesn't. Sorry." },
        { tone: 'passive', t: "I understand it. I think it's lovely.", r: "You understand it. Of course you do. That's why I don't rehearse for you. Mostly." },
        { tone: 'flirty', t: "Then stop rehearsing. Just say what you feel.", r: "What I feel. Not here. Not yet. ...I feel like holding your hand. There. That wasn't rehearsed." },
      ] },
      { tone: 'flirty', t: "Dangerous, huh? Hit me with it.", r: "'I think about your laugh when it's quiet.' ...Oh. It's working. It's working on me. Not you. Me.", opts: [
        { tone: 'cold', t: "It's not working on me.", r: "No. Okay. ...It worked on me, though. Shame." },
        { tone: 'passive', t: "It's working on me too. Honestly.", r: "Is it? Then it was worth eleven drafts. I'm going to retire it. It's done its job." },
        { tone: 'flirty', t: "I think about yours too. All the time.", r: "Mine? I barely— you've heard it? When? ...I'm going to laugh now. On purpose. For you." },
      ] },
    ] },

  // ---- slot 9: chapter end - 'I like you' (written down; the paper wasn't needed) --------------------------------------
  { id: 'shy-warm-9-cold', stage: 'warm', slot: 9, mood: 'cold',
    say: "I wrote something down. On paper. Even after last time. Especially after last time. I need to say it. Can you not look at me?",
    opts: [
      { tone: 'cold', t: "Fine. I'm not looking.", r: "Thank you. Okay. 'I like you. More than is— I like you.' ...That's it. That's the paper.", opts: [
        { tone: 'cold', t: "Okay. Noted.", r: "Noted. ...That's fine. I said it. That's the brave part done. Bye." },
        { tone: 'passive', t: "I like you too. You can look at me now.", r: "Okay. I'm looking. You like me. I'm going to need to put this paper somewhere safe. Forever." },
        { tone: 'flirty', t: "I'm looking now. Say it again, to my face.", r: "To your face. I like you. ...I didn't need the paper. I didn't need the paper at all." },
      ] },
      { tone: 'passive', m: 3, t: "Take your time. I'll look at the floor with you.", r: "We're both looking at the floor. 'I like you. I've liked you since the corner.' ...There.", opts: [
        { tone: 'cold', t: "That's... a lot to take in.", r: "Yes. I'm sorry. Take it in. Slowly. Or not. That's okay. I'll be quiet." },
        { tone: 'passive', t: "I've liked you since the corner too.", r: "You have? Both of us? In the corner? Liking each other? And neither of us said? ...We're hopeless." },
        { tone: 'flirty', t: "Look up. Watch me say I like you too.", r: "Up. Okay. ...Oh. You do. Your face says it. I can read faces. I'm going to cry a bit. Nicely." },
      ] },
      { tone: 'flirty', t: "Look or don't. I'll still be smiling.", r: "That's not helping. Okay. 'I like you.' The paper says so. I say so. Both of us.", opts: [
        { tone: 'cold', t: "Good to know.", r: "Yes. It's good to know. ...I'll fold the paper back up." },
        { tone: 'passive', t: "Same. A lot.", r: "A lot. You said a lot. I wrote 'a lot' too, and crossed it out. I'll uncross it." },
        { tone: 'flirty', t: "Keep the paper. I'll write you one back.", r: "You'd write— I'd frame it. I'd look at it in the quiet bit of every day." },
      ] },
    ] },
  { id: 'shy-warm-9-passive', stage: 'warm', slot: 9, mood: 'passive',
    say: "I've written something down. On paper. So I'd say it right. I've got it here. I'm going to read it. Don't— okay. Okay.",
    opts: [
      { tone: 'cold', t: "You don't have to read me anything.", r: "No. Right. It's fine. I'll keep it. In my pocket. It's fine.", opts: [
        { tone: 'cold', t: "Keep it there.", r: "Yes. Keeping it. ...Okay. Okay." },
        { tone: 'passive', t: "Sorry. I didn't mean stop. Read it.", r: "'I like you. I'm better when you're near. I don't hide from you.' ...That's it. That's the paper." },
        { tone: 'flirty', t: "Don't read it. Just tell me. I'm listening.", r: "Just tell— okay. I like you. ...Oh. That was easy. That was so easy. Why was that easy?" },
      ] },
      { tone: 'passive', t: "Okay. I'm listening. Go.", r: "'I like you. I wanted you to hear it from me, not from my phone at two a.m.' ...There.", opts: [
        { tone: 'cold', t: "Alright. Understood.", r: "Alright. Yes. ...It's a lot. I know. I'll give you room." },
        { tone: 'passive', t: "Daytime and two a.m., I like you back.", r: "Both? Oh. I'm going to keep this paper forever. In a box. With the important things." },
        { tone: 'flirty', t: "That's the best thing anyone's ever read to me.", r: "It's three lines. ...The best three lines I've ever written. Because you're smiling at them." },
      ] },
      { tone: 'flirty', t: "Is it a love letter? Please say it's a love letter.", r: "It's a like letter. It's smaller. It says 'I like you', in big letters. That's the whole letter.", opts: [
        { tone: 'cold', t: "A like letter. Okay.", r: "Yes. Just a like letter. ...It was still hard to write." },
        { tone: 'passive', t: "That's my favourite kind of letter.", r: "Is it? I'll write more. I'll do a series. You'll get very bored of them. Hopefully not." },
        { tone: 'flirty', t: "I like you in bigger letters. Neon ones.", r: "Neon. You'd be loud about it. ...I'd like that. I'd like you being loud about me. Quietly." },
        { tone: 'risque', t: "Seal it with a kiss, then.", r: "With a— here? The paper's shaking. I'm shaking. ...Next time. I'll practise. Not on the paper." },
      ] },
    ] },
  { id: 'shy-warm-9-flirty', stage: 'warm', slot: 9, mood: 'flirty',
    say: "I wrote it down so I'd say it right. But you're doing the eyebrow and I can't find the paper. I— um. I like you. Oh.",
    opts: [
      { tone: 'cold', t: "Oh. Okay.", r: "Okay. That's an answer. That's fine. I said it. That's the part I couldn't do.", opts: [
        { tone: 'cold', t: "Let's leave it there.", r: "Yes. Leave it. ...It's left." },
        { tone: 'passive', t: "Sorry. You surprised me. I like you as well.", r: "You— oh. Two people liking each other. That's very simple. I made it so complicated." },
        { tone: 'flirty', t: "Come here. The feeling's mutual.", r: "I'm coming. Hi. You like me. The paper was never necessary. Never." },
      ] },
      { tone: 'passive', t: "You like me? I'm so glad. Me too. Completely.", r: "You do. I wrote four pages for this. You just said it. In one go. Like it was easy.", opts: [
        { tone: 'cold', t: "It is easy. Don't overthink it.", r: "It's not easy for me. ...Sorry. I'll try not to think. I'll fail. Okay." },
        { tone: 'passive', t: "Read me the four pages anyway.", r: "Some of it's about my cat. Mostly you. ...I'll read you one page. Next time. One a week." },
        { tone: 'flirty', t: "It is easy. With you, it's easy.", r: "With me. Easy. Nobody's ever— that came out wrong. You know what I mean. It's true." },
      ] },
      { tone: 'flirty', t: "Right back at you. And you found the words without the paper.", r: "I did, didn't I? The paper's still in my pocket. I'm keeping it. As a souvenir.", opts: [
        { tone: 'cold', t: "Bit sentimental.", r: "Yes. Sentimental. That's me. ...Sorry." },
        { tone: 'passive', t: "Keep it. It's a good souvenir.", r: "It is. Of the day I said a thing. Out loud. To you. It's going in the box. With everything important." },
        { tone: 'flirty', t: "I'll give you a better souvenir.", r: "What's better than— oh. Your hand. You're holding my hand. That's better. That's much better." },
      ] },
    ] },
];
