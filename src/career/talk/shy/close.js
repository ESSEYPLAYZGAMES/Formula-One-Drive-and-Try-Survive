// SHY - in person, stage 'close': the one person they're completely themselves with. Full sentences, quiet devastation.
export const DATA = [
  // ---- slot 1: no more rehearsing (ESTABLISHES: they've stopped rehearsing with you) -------------------------------------
  { id: 'shy-close-1-cold', stage: 'close', slot: 1, mood: 'cold',
    say: "I've stopped rehearsing with you. Did you notice? So this isn't practised: you were far away last time. Are we okay?",
    opts: [
      { tone: 'cold', t: "We're fine. Drop it.", r: "Okay. Not a thing. ...I'll just notice it quietly, then. Like I used to.", opts: [
        { tone: 'cold', t: "Good. Leave it.", r: "Leaving it. ...I'm good at leaving things. I'll go and be good at it." },
        { tone: 'passive', t: "Sorry. I was tired. We're okay. Really.", r: "Really? Then I'll stop holding my breath. I've been holding it since Tuesday." },
        { tone: 'flirty', t: "We're more than okay. Come here, unrehearsed.", r: "Unrehearsed. Here I am. No script. ...I'm better without one. With you. Who knew." },
      ] },
      { tone: 'passive', t: "We're okay. I was in my head. What's going on with you?", r: "Nothing. Everything. I missed you and didn't say it, because you seemed... somewhere else.", opts: [
        { tone: 'cold', t: "Missing me is your business.", r: "Yes. It is. ...I'll keep it to myself, then. Sorry." },
        { tone: 'passive', t: "Say it next time. I'll always want to hear it.", r: "Okay. I missed you. There. That's next time, early. I'm getting ahead." },
        { tone: 'flirty', t: "I missed you too. Badly.", r: "Badly. Good. Not good. Good. I'm going to stand very close to you now. As a policy." },
      ] },
      { tone: 'flirty', t: "Unrehearsed suits you. Say something else.", r: "Okay. You make my words come out in the right order. ...That's new. That's because of you.", opts: [
        { tone: 'cold', t: "Bit soppy.", r: "Yes. Unrehearsed soppy. That's the risk. ...Sorry." },
        { tone: 'passive', t: "That's lovely. Keep going.", r: "I can do that now. With you. I could do it for hours. I'll spare you. Forty minutes." },
        { tone: 'flirty', t: "Your words in the right order are my favourite thing.", r: "Then here's the right order: come here, stay, don't go far away again. ...That was bossy. I meant it." },
        { tone: 'risque', t: "Then say what you're thinking right now. Unedited.", r: "Unedited? I'm thinking about kissing you until you forget where you went last time. ...Not taking it back." },
      ] },
    ] },
  { id: 'shy-close-1-passive', stage: 'close', slot: 1, mood: 'passive',
    say: "I don't rehearse with you any more. I just realised. I used to practise every sentence. Now I just... talk. This is me talking. Hello.",
    opts: [
      { tone: 'cold', t: "You've always talked. Not a big change.", r: "Oh. It is, though. For me. Never mind. Sorry. Hello.", opts: [
        { tone: 'cold', t: "Hello.", r: "...Hello. Okay. I'll start rehearsing again. Maybe." },
        { tone: 'passive', t: "Sorry, you're right. It's a big change. I noticed.", r: "Of course you noticed. You notice me. That's why I stopped. You never needed the rehearsed one." },
        { tone: 'flirty', t: "I love the unrehearsed you. Talk at me all day.", r: "All day. I'd tell you about every blue in my sky jigsaw. You'd love me less. Slightly." },
      ] },
      { tone: 'passive', t: "Hello, you. I love hearing you just talk.", r: "Even when it goes nowhere? Like now? I've been talking about nothing for a minute. Happily.", opts: [
        { tone: 'cold', t: "It does go nowhere.", r: "Yes. ...It does. I'll go back to the somewhere. Sorry." },
        { tone: 'passive', t: "Nowhere's my favourite place with you.", r: "Nowhere with you. We should put that on something. A mug. A small mug. 'Nowhere With You'." },
        { tone: 'flirty', t: "Keep going. Your voice is my favourite sound.", r: "Over engines? That's a lot to say to someone who used to freeze. I'll take it. I'm taking it." },
      ] },
      { tone: 'flirty', t: "So I'm finally getting the real you?", r: "You've had the real me for ages. You just didn't get the full sentences. Now you get those too.", opts: [
        { tone: 'cold', t: "The full sentences are a lot.", r: "They are. I've got a backlog. ...I'll ration them. Sorry." },
        { tone: 'passive', t: "Full sentences and all. Lucky me.", r: "Lucky you. I've never been anyone's luck. ...Two taps on the visor, that's your luck. I'm a visor now. Two taps." },
        { tone: 'flirty', t: "Give me the sentence you've been saving.", r: "The one I've been saving is: I'd like to kiss you now. ...Full stop. Not a question. A full stop." },
        { tone: 'risque', t: "The real you, later, with nobody else around?", r: "Later. Nobody else around. ...Yes. I didn't even hesitate. Look at me. Not hesitating." },
      ] },
    ] },
  { id: 'shy-close-1-flirty', stage: 'close', slot: 1, mood: 'flirty',
    say: "I stopped rehearsing with you. Weeks ago. So everything I say now is unplanned. Including this: you look very kissable.",
    opts: [
      { tone: 'cold', t: "Maybe rehearse a bit more.", r: "Oh. Okay. Too— okay. I'll go back to the mirror. Sorry. I thought—", opts: [
        { tone: 'cold', t: "The mirror's a good idea.", r: "...Yes. The mirror. It never says anything back." },
        { tone: 'passive', t: "I'm teasing. Unrehearsed is perfect.", r: "Perfect. Then I'll keep it. The kissable bit included. I'm not editing that out." },
        { tone: 'flirty', t: "Kidding. Kissable, you said? Prove it.", r: "Prove— okay. Yes. Come here. I've stopped rehearsing that too. I'm still very bad at it." },
      ] },
      { tone: 'passive', t: "Unplanned and very forward. I like it.", r: "Do you? I'm forward now. Me. Ask anyone. Don't ask anyone. They'd laugh.", opts: [
        { tone: 'cold', t: "Bit too forward.", r: "Too forward. I'll take a step back. ...There. Sorry." },
        { tone: 'passive', t: "Forward with me. Quiet with everyone else.", r: "Exactly that. That's my whole system. You're the exception. You're the whole exception." },
        { tone: 'flirty', t: "Be forward. I'll keep up.", r: "I'm not fast. I'm deliberate. Like a jigsaw. ...Very deliberate. Hold still." },
      ] },
      { tone: 'flirty', t: "Kissable? Then do something about it.", r: "I can do something about it. I'm going to. Right— now. ...There. Unrehearsed.", opts: [
        { tone: 'cold', t: "Not here, people are looking.", r: "Oh. Sorry. People. I forgot about people. ...I forget about people around you." },
        { tone: 'passive', t: "That was perfect. You okay?", r: "Very okay. I'm dizzy. It's a good dizzy. A minute, please. Or another one." },
        { tone: 'flirty', t: "Unrehearsed is my favourite. Again.", r: "Again. And again. You'll have to tell me when to stop. You won't, will you." },
        { tone: 'risque', t: "Do something else about it later. My place.", r: "Your place. Later. ...I won't rehearse. I'll just turn up and be bold. Watch me be bold." },
      ] },
    ] },

  // ---- slot 2: 'Do Not Panic' (ESTABLISHES: what you're saved as in their phone) ----------------------------------------
  { id: 'shy-close-2-cold', stage: 'close', slot: 2, mood: 'cold',
    say: "You're saved in my phone as 'Do Not Panic'. Since the start. Last time I panicked anyway. Sorry. I'm telling you anyway.",
    opts: [
      { tone: 'cold', t: "That's a strange thing to save me as.", r: "It is. It was a note to myself. I'll change it. To your name. Like a normal person.", opts: [
        { tone: 'cold', t: "Normal sounds good.", r: "Normal. Okay. ...I'll change it later. It'll look very bare." },
        { tone: 'passive', t: "No, keep it. What did it mean at the start?", r: "That I'd see your name and want to throw the phone. So: don't. Breathe. Answer. It worked. Mostly." },
        { tone: 'flirty', t: "Keep it. I want to be your Do Not Panic.", r: "You are. You're the only one. Everyone else is just their name. You're an instruction." },
      ] },
      { tone: 'passive', t: "Why 'Do Not Panic'?", r: "When you first texted, I nearly dropped the phone in the sink. So I left myself a note.", opts: [
        { tone: 'cold', t: "Bit dramatic.", r: "Yes. Dramatic. That's me, quietly. ...Sorry." },
        { tone: 'passive', t: "And now? Do you still panic?", r: "Less. Nice panic. The kind where you smile at your phone in public and people move away." },
        { tone: 'flirty', t: "I hope I still make you panic a little.", r: "A little. A lot. You're the best panic I've ever had. That's going on a mug." },
      ] },
      { tone: 'flirty', t: "I'm changing yours to 'Panic Freely'.", r: "'Panic Freely'. Oh, I like that. That's very freeing. That's very you. Giving me permission.", opts: [
        { tone: 'cold', t: "Kidding. It's just your name.", r: "Just my name. That's fine. That's normal. Okay." },
        { tone: 'passive', t: "What would you want to be saved as?", r: "'Quiet One'. No. 'Back Row'. No— just my name. With a little star. Like you'd mean it." },
        { tone: 'flirty', t: "Or 'Mine'. Short and true.", r: "'Mine'. I can't top that. I'm changing yours to 'Mine' too. We'll be confusing. Two Mines." },
      ] },
    ] },
  { id: 'shy-close-2-passive', stage: 'close', slot: 2, mood: 'passive',
    say: "Confession. In my phone, you're 'Do Not Panic'. Since the beginning. It used to be advice. Now it's just... you.",
    opts: [
      { tone: 'cold', t: "Sounds like you should just use my name.", r: "I could. It felt too big. Your name. Typed. It still does. Sorry.", opts: [
        { tone: 'cold', t: "It's just a name.", r: "Yes. Just a name. ...It isn't. To me. But okay." },
        { tone: 'passive', t: "I get it. Keep whatever helps.", r: "Thank you. It helps. You help. 'Do Not Panic' is just the shorter way of saying that." },
        { tone: 'flirty', t: "Too big? I like being too big for your phone.", r: "Too big for my phone. And my head. And most rooms. You're big. In my life. There." },
      ] },
      { tone: 'passive', t: "From advice to just 'me'. I love that.", r: "It's very you. Calm. An instruction. Someone telling me it's fine. Even in a contact.", opts: [
        { tone: 'cold', t: "A bit much for a contact name.", r: "Yes. Probably. I put too much into small things. ...Sorry." },
        { tone: 'passive', t: "What else in your phone is about me?", r: "There's a list. I may have told you. Of things about you. It's long now. Very long." },
        { tone: 'flirty', t: "Then I'll text you more. Panic you all day.", r: "I'd never get anything done. I'd just be smiling at a sink. Do it. Text me all day." },
      ] },
      { tone: 'flirty', t: "Do Not Panic. But you can panic about me in person.", r: "In person? That's much worse. In person I— I'm doing it now. You did that.", opts: [
        { tone: 'cold', t: "Relax. I'm joking.", r: "Joking. Okay. ...Still panicking a little. Sorry." },
        { tone: 'passive', t: "Breathe. I'm right here.", r: "You're right here. Do Not Panic, in person. You work in person too. Better, actually." },
        { tone: 'flirty', t: "Panic closer. I'll hold onto you.", r: "Panicking closer. This is very effective panic. I recommend it." },
        { tone: 'risque', t: "Let me give you something real to panic about.", r: "Something— oh. ...Okay. Yes. Give me something. I'll panic quietly. Somewhere private. With you." },
      ] },
    ] },
  { id: 'shy-close-2-flirty', stage: 'close', slot: 2, mood: 'flirty',
    say: "You're in my phone as 'Do Not Panic'. And every time it lights up, I panic. Happily. You lit it up a lot this week.",
    opts: [
      { tone: 'cold', t: "Maybe I'll text less, then.", r: "No— that's not— I wasn't— okay. Less. That's fine. Sorry. I liked the lighting up.", opts: [
        { tone: 'cold', t: "Less is easier.", r: "Easier. ...The phone will be very quiet. I'll manage." },
        { tone: 'passive', t: "I'm joking. I'll keep texting.", r: "Keep texting. Good. I'd miss it. I'd miss the panicking. I've grown attached." },
        { tone: 'flirty', t: "Never. I'll text you twice as much.", r: "Twice. I'll need a new phone. A stronger one. That doesn't get dropped in sinks." },
      ] },
      { tone: 'passive', t: "Happily? You panic happily?", r: "Very happily. I smile at the phone. My cat watches me do it. Pickle is unimpressed.", opts: [
        { tone: 'cold', t: "Your cat has a point.", r: "Pickle often does. ...Okay. Sorry." },
        { tone: 'passive', t: "I'd like to see you smiling at your phone.", r: "You'd have to be behind me. ...Be behind me sometime. Watch me do it. It's embarrassing." },
        { tone: 'flirty', t: "I'll keep lighting it up, then.", r: "Light it up. Every day. I'll leave the volume on. I never leave the volume on. For anyone." },
      ] },
      { tone: 'flirty', t: "I'll light it up a lot more. Starting now.", r: "You're texting me? I'm right here. You're texting me from a metre away. ...What does it say?", opts: [
        { tone: 'cold', t: "Never mind. Deleted it.", r: "Deleted? Oh. ...I'll always wonder now." },
        { tone: 'passive', t: "Read it later. It's just a smile.", r: "Just a smile. In a text. ...I'll read it on the way home. Slowly. I'll panic at it." },
        { tone: 'flirty', t: "Read it now. Out loud.", r: "'You're cute when you panic.' ...I'm not reading it out loud. I just did. I'm going red at my own phone." },
        { tone: 'risque', t: "It says what I want to do to you later.", r: "I'm not opening it here. I'm going to open it alone. With the door shut. ...And then reply." },
      ] },
    ] },

  // ---- slot 3: jealousy (someone loud, all over you) -------------------------------------------------------------------
  { id: 'shy-close-3-cold', stage: 'close', slot: 3, mood: 'cold',
    say: "You were cold with me last time. And then I saw someone loud, all over you, and I went quiet. I'm still a bit quiet.",
    opts: [
      { tone: 'cold', t: "It was nothing. You're overreacting.", r: "Okay. Overreacting. Quietly, though. I overreact quietly. Sorry.", opts: [
        { tone: 'cold', t: "Then let it go.", r: "Letting it go. ...It's going. Slowly." },
        { tone: 'passive', t: "Sorry. That was dismissive. It really was nothing.", r: "Nothing. I believe you. I always believe you. I just needed to hear it. Thank you." },
        { tone: 'flirty', t: "Nothing compared to you. Nobody is.", r: "I'll keep that next to the jealousy and see which one wins. ...That one wins." },
      ] },
      { tone: 'passive', t: "I'm sorry. I didn't realise. Talk to me.", r: "It's silly. They were so easy with you. Loud. And I was over here being... a tree. Watching.", opts: [
        { tone: 'cold', t: "You could've come over.", r: "Yes. I could. I can't, though. Not into loud. ...Sorry." },
        { tone: 'passive', t: "Next time, come stand next to me. I'll make room.", r: "In the loud. ...Okay. I'll try. If you hold my hand, I'll try." },
        { tone: 'flirty', t: "They were loud. You're the one I go home thinking about.", r: "Me? Not the loud one? ...Okay. The tree is feeling much better. The tree's blushing." },
      ] },
      { tone: 'flirty', t: "You're cute jealous. But there's only you.", r: "I'm not cute jealous. Okay, I'm a bit cute jealous. But only me? Promise?", opts: [
        { tone: 'cold', t: "Don't make me promise things.", r: "No. Okay. ...That's fine. I won't ask. Sorry." },
        { tone: 'passive', t: "Promise. Only you.", r: "Only me. ...I'm going to stop being jealous now. Gradually. Over a week." },
        { tone: 'flirty', t: "Promise. Want me to prove it?", r: "Yes. I'd like proof. Just a small— oh. That's proof. That's very good proof." },
        { tone: 'risque', t: "Let me spend the rest of the day proving it.", r: "Every minute of it. ...I'll stop being jealous at about minute four. Keep going after." },
      ] },
    ] },
  { id: 'shy-close-3-passive', stage: 'close', slot: 3, mood: 'passive',
    say: "Someone was very loud near you earlier. Laughing at everything. Touching your arm. I went quiet. I'm jealous, I think. It's new.",
    opts: [
      { tone: 'cold', t: "They're a friend. Don't be jealous.", r: "A friend. Sorry. I'll stop. I don't know how, but I'll stop.", opts: [
        { tone: 'cold', t: "Try, at least.", r: "Yes. Trying. ...Okay." },
        { tone: 'passive', t: "Sorry, that was abrupt. It's okay to feel it.", r: "Is it? I thought I'd be the calm one in this. I'm not. I'm the tree with opinions." },
        { tone: 'flirty', t: "Jealous looks good on you, though.", r: "Does it? I'll wear it more often. No. I won't. It was a one-off. Mostly." },
      ] },
      { tone: 'passive', t: "Jealous? Oh, you. Come here. It was nothing.", r: "I'm here. ...They were just so easy. And I'm not easy. I'm a thousand pieces of sky.", opts: [
        { tone: 'cold', t: "You are hard work sometimes.", r: "Yes. I know. ...Sorry. I'll go and be less work." },
        { tone: 'passive', t: "I like the thousand pieces. That's why I'm here.", r: "That's why you're— okay. That's the right answer. That was very much the right answer." },
        { tone: 'flirty', t: "I'd rather do a thousand pieces with you than five with anyone.", r: "Five. Anyone. ...You're very good at this. Jealousy over. Cancelled. You cancelled it." },
      ] },
      { tone: 'flirty', t: "I like that you're jealous. It means you want me.", r: "Of course I want— oh. I said that loudly. Someone turned round. I want you. Quietly. Mostly.", opts: [
        { tone: 'cold', t: "Don't make a scene.", r: "No scene. ...Sorry. I'll want you quietly." },
        { tone: 'passive', t: "I want you too. Only you.", r: "The loud one can have the arm. I've got the rest of you. That's a better deal." },
        { tone: 'flirty', t: "Say it again. Louder.", r: "Never louder. ...I want you. There. That was a seven out of ten. For me that's a scream." },
        { tone: 'risque', t: "Want me where nobody can see?", r: "Yes. Somewhere with a door. I'll find one. I'm very good at finding places nobody looks." },
      ] },
    ] },
  { id: 'shy-close-3-flirty', stage: 'close', slot: 3, mood: 'flirty',
    say: "That person touching your arm earlier. Laughing at everything. I didn't like it. I'm jealous. Very quietly. ...Kiss me so I stop.",
    opts: [
      { tone: 'cold', t: "I'm not kissing you because you're jealous.", r: "No. That's fair. I'll be jealous on my own, then. Sorry.", opts: [
        { tone: 'cold', t: "That's your call.", r: "Yes. ...My call. Corner's that way. Calling it." },
        { tone: 'passive', t: "I'll kiss you because I want to. Not to fix anything.", r: "That's a better reason. ...Do you want to? Now? For the better reason?" },
        { tone: 'flirty', t: "Not because you're jealous. Because you're you.", r: "Because I'm me. ...Okay. The jealousy's gone. You can still kiss me. It's not conditional." },
      ] },
      { tone: 'passive', t: "I didn't even notice them. I was looking for you.", r: "For me? While they were— oh. Oh. I wasted a whole hour being jealous.", opts: [
        { tone: 'cold', t: "Yes. Waste of time, sulking.", r: "Yes. A waste. ...Sorry. I'll stop sulking." },
        { tone: 'passive', t: "You never need to worry. I mean it.", r: "I'll still worry. Quietly. It's what I do. But less. You've taken about half of it away." },
        { tone: 'flirty', t: "And now I've found you. Kiss accepted.", r: "Accepted. Good. ...I asked, didn't I. Out loud. Jealousy makes me very brave. Who knew." },
      ] },
      { tone: 'flirty', t: "Kiss you so you stop? Gladly.", r: "...That worked. Completely. What was I jealous about? I can't remember.", opts: [
        { tone: 'cold', t: "Don't make it a habit.", r: "No. Not a habit. ...It's a very good habit, though." },
        { tone: 'passive', t: "You never need to be. I'm yours.", r: "Yours. Mine. ...We sound like a cheesy song. I don't mind. I'd hum it." },
        { tone: 'flirty', t: "Be jealous more often, then.", r: "Then I'll be jealous every time anyone looks at you. That's constantly. You're in trouble." },
        { tone: 'risque', t: "That's one. The rest is for later.", r: "The rest. Later. ...I'm going to be thinking about 'the rest' all day. Thanks for that." },
      ] },
    ] },

  // ---- slot 4: the list, read aloud (re-states the list) ------------------------------------------------------------------
  { id: 'shy-close-4-cold', stage: 'close', slot: 4, mood: 'cold',
    say: "There's a list I keep. About you. I'm not sure I ever admitted that. After last time I read it, to feel better. It worked. Mostly.",
    opts: [
      { tone: 'cold', t: "You read a list about me instead of talking to me?", r: "Yes. It's easier. The list doesn't go quiet on me. Sorry. That came out sharp.", opts: [
        { tone: 'cold', t: "It did.", r: "...Yes. Okay. I'll go. The list and me." },
        { tone: 'passive', t: "Fair. I went quiet. I'm sorry. What's on it?", r: "'Says sorry by bringing tea.' 'Hates being called brave.' 'Comes back.' That last one's the important one." },
        { tone: 'flirty', t: "Read me the best one. I'll earn it back.", r: "Item fifty-six: 'Kisses like an apology even when nothing's wrong.' ...You can start earning. Now's good." },
      ] },
      { tone: 'passive', t: "That makes me happy. Read me one?", r: "Item twelve. 'Laughs with the whole face. Even the ears.' ...Your ears are moving now. It's true.", opts: [
        { tone: 'cold', t: "My ears don't move.", r: "They do. ...Okay. Sorry. They don't." },
        { tone: 'passive', t: "Another one. Please.", r: "Item forty. 'Asks how I am and waits for the real answer.' That one made me cry. In a car park. Nicely." },
        { tone: 'flirty', t: "Is there a list of what you'd like to do to me?", r: "That's a separate document. Password-protected. You don't have clearance. Yet." },
        { tone: 'risque', t: "Add one: 'is going to be kissed thoroughly later'.", r: "Adding. 'Is going to be kissed thoroughly later.' Saved. ...I'll be ticking it off. Personally." },
      ] },
      { tone: 'flirty', t: "I keep one about you too. It's mostly about your smile.", r: "You don't. Do you? ...What's on it? No. Don't. Yes. Tell me later. In writing.", opts: [
        { tone: 'cold', t: "It's short.", r: "Short. Okay. ...That's fine. Short's fine." },
        { tone: 'passive', t: "It says: 'notices everything, says half.'", r: "That's accurate. Annoyingly. I'd add: 'says everything to you, eventually.'" },
        { tone: 'flirty', t: "It says: 'devastating when they finally speak.'", r: "Devastating. Me. ...I'm going to be devastating at you all day now. You've only got yourself to blame." },
      ] },
    ] },
  { id: 'shy-close-4-passive', stage: 'close', slot: 4, mood: 'passive',
    say: "I keep a list of things about you. In my phone. I don't know if I ever admitted it. It's at a hundred and three. Want to hear some?",
    opts: [
      { tone: 'cold', t: "A hundred and three? That's a lot of watching.", r: "It is. It's a long time of watching. I'm sorry. I'll stop at a hundred and three.", opts: [
        { tone: 'cold', t: "That'd be wise.", r: "Yes. ...Capped. Final." },
        { tone: 'passive', t: "Sorry. It's lovely, really. Read me some.", r: "Item seventy. 'Doesn't finish my sentences.' That's the reason for all the others. You let me finish." },
        { tone: 'flirty', t: "Make it a thousand. Like a sky jigsaw.", r: "A thousand pieces of you. That's the best idea anyone's ever had. I'm doing that." },
      ] },
      { tone: 'passive', t: "Go on. Read me your favourites.", r: "Item one: 'kind to me in a corner'. Item two: 'smiles like they mean it'. Item three: 'came back'.", opts: [
        { tone: 'cold', t: "Bit sentimental, isn't it?", r: "Yes. It's a list of feelings with numbers. I'm sorry. I'll put it away." },
        { tone: 'passive', t: "'Came back.' That one gets me.", r: "It gets me too. People don't, usually. Come back. You did. Every time. That's why it's item three." },
        { tone: 'flirty', t: "What number is 'I'm going to marry them'?", r: "There isn't a— it's item ninety-one. I wrote it in pencil. ...Don't look at me. I'm looking at the floor." },
        { tone: 'risque', t: "Is there a section you're not reading out loud?", r: "The eighties. Items eighty to eighty-nine. They're... warm. I'll read them to you. Not here. Later. Quietly." },
      ] },
      { tone: 'flirty', t: "Read them all. I've got time.", r: "All of them? It takes about forty minutes. I've timed it. ...I've timed it. Forget that.", opts: [
        { tone: 'cold', t: "Forty minutes. Maybe not.", r: "No. Maybe not. ...Five, then. Or none." },
        { tone: 'passive', t: "Then read me five. Your choice.", r: "'Hums.' 'Says right before hard things.' 'Tips well.' 'Good at edges.' 'Mine.' ...The last one's new." },
        { tone: 'flirty', t: "Forty minutes on your sofa, hearing about me? Perfect.", r: "On my sofa. With the cat. You'd fall asleep by item thirty. I'd let you. I'd write that down too." },
      ] },
    ] },
  { id: 'shy-close-4-flirty', stage: 'close', slot: 4, mood: 'flirty',
    say: "There's a list in my phone. All about you. I can't remember if I ever confessed it. Item one-oh-four is from just now. It's... rude.",
    opts: [
      { tone: 'cold', t: "Rude? Then keep it.", r: "Okay. Keeping it. ...It wasn't that rude. It was a bit rude. Sorry.", opts: [
        { tone: 'cold', t: "Better that way.", r: "Better. Yes. ...It's still there, though. Item one-oh-four." },
        { tone: 'passive', t: "Okay, I'm curious. Rude how?", r: "It's about how you look when you're concentrating. And what I'd like to do about it. ...That's your lot." },
        { tone: 'flirty', t: "Now I need to know. Whisper it.", r: "...'Bites lip when concentrating. Should be kissed for it, immediately.' There. Whispered. I'm still red." },
      ] },
      { tone: 'passive', t: "Rude? You? Read it to me.", r: "'Looks better in the morning than anyone should.' ...It's rude for me. It's rude for the list.", opts: [
        { tone: 'cold', t: "That's barely rude.", r: "Barely. Okay. ...It's rude for me. Never mind." },
        { tone: 'passive', t: "That's lovely. Have you seen me in the morning?", r: "Have I? I think I've imagined it. Very specifically. That's also on the list. Item one-oh-five." },
        { tone: 'flirty', t: "Make it ruder. I can take it.", r: "Ruder. 'Should be kept in bed until noon.' ...That's as rude as I go. That's my top speed." },
        { tone: 'risque', t: "Come over in the morning and check it's accurate.", r: "Check it— yes. I'll bring a pen. To tick it. ...I'm not going to bring a pen. I'm going to bring me." },
      ] },
      { tone: 'flirty', t: "If it's rude, I want it read aloud. Slowly.", r: "Slowly. You'd like that. ...'Item one-oh-four: makes me want to stop being polite.' There.", opts: [
        { tone: 'cold', t: "That's it? Not that rude.", r: "For me it's rude. ...Okay. I'll aim higher next time. Sorry." },
        { tone: 'passive', t: "That's very sweet. And very you.", r: "Sweet and rude. That's me, with you. Polite with everyone else. Rude with you. It's a privilege." },
        { tone: 'flirty', t: "Then stop being polite.", r: "Okay. ...Come here. I'm not asking. That's me not being polite. Did it work? It works on me." },
        { tone: 'risque', t: "Stop being polite later, then. Somewhere quiet.", r: "Somewhere quiet. I know all of them. ...I'll pick the quietest. Then I'll be very, very impolite." },
      ] },
    ] },

  // ---- slot 5: heat (quietly devastating; fade, never explicit) ---------------------------------------------------------
  { id: 'shy-close-5-cold', stage: 'close', slot: 5, mood: 'cold',
    say: "You were cold last time. I've been wondering if you still want me. I'd like you to tell me. Please. Quietly is fine.",
    opts: [
      { tone: 'cold', t: "I'm here, aren't I?", r: "You are. But here isn't always— okay. You're here. That's something. That's a lot.", opts: [
        { tone: 'cold', t: "Leave it at that.", r: "Yes. ...I'll leave it at here. Okay." },
        { tone: 'passive', t: "I still want you. I was tired, not done.", r: "Not done. Thank you. I'd like to stand closer. Is that okay? I'm asking." },
        { tone: 'flirty', t: "I want you. Very much. Come here.", r: "Very much. ...I'm here. Closer. You're warm. I missed this. I won't let go first." },
        { tone: 'risque', t: "Let me show you how much, later.", r: "Later. Show me. ...I'll hold you to that. I mean that literally. I'll be holding you." },
      ] },
      { tone: 'passive', t: "Of course I still want you. I'm sorry I made you wonder.", r: "I'm sorry I wondered. My head does that. You're very good at quieting it.", opts: [
        { tone: 'cold', t: "Your head does a lot of that.", r: "Yes. It does. ...Sorry. I'll keep it down." },
        { tone: 'passive', t: "Tell me when it does. I'll quiet it.", r: "I will. I'll say 'my head's loud'. You say... anything. Your voice works. Any words." },
        { tone: 'flirty', t: "Let me quiet it now.", r: "Now. ...Oh. Yes. That quieted it. Everything's very quiet. Except my heart. That's loud." },
      ] },
      { tone: 'flirty', t: "I want you so much it's embarrassing.", r: "Embarrassing? For you? You're never— okay. Say it again. Slowly. I'll be embarrassed with you.", opts: [
        { tone: 'cold', t: "Once is enough.", r: "Okay. Once. ...I'll replay it. That's allowed." },
        { tone: 'passive', t: "I want you. Every version of you.", r: "The quiet one. The red one. The two a.m. one. ...They all want you back. We had a vote." },
        { tone: 'flirty', t: "So much. Let me show you how much.", r: "Show me. ...I'm not looking at the floor. I'm looking at you. I'm not looking away. Show me." },
        { tone: 'risque', t: "Come home with me and you'll never wonder again.", r: "Never again. That's a very convincing argument. I'm convinced. Let's go. Quietly." },
      ] },
    ] },
  { id: 'shy-close-5-passive', stage: 'close', slot: 5, mood: 'passive',
    say: "I've thought about something. A lot. Out loud is harder than in my head. But: I'd like to kiss you. Slowly. For quite a long time.",
    opts: [
      { tone: 'cold', t: "Not here.", r: "No. Not here. Sorry. It's always 'not here' with me. You'd think I'd know.", opts: [
        { tone: 'cold', t: "You would.", r: "Yes. ...I'll learn. Somewhere else." },
        { tone: 'passive', t: "Not here. But I'd like that. Somewhere quieter.", r: "Somewhere quieter. I know the quietest places. I've been saving one. For exactly this." },
        { tone: 'flirty', t: "Not here. Too public for how long I'd want it to last.", r: "How long you'd— okay. My face has gone hot. My ears. Everything. Let's leave. Now." },
      ] },
      { tone: 'passive', t: "I'd like that very much.", r: "You would? I've imagined this conversation a hundred times. It never got past 'very much'.", opts: [
        { tone: 'cold', t: "Just don't make it awkward.", r: "No. Not awkward. ...It'll be a bit awkward. Sorry. That's me." },
        { tone: 'passive', t: "Then let's get past it together.", r: "Here's past it. I'm holding your face. Is that— that's fine. You're smiling. That's fine." },
        { tone: 'flirty', t: "Slowly. For a long time. Start now.", r: "Now. ...Slowly. I meant it. I'm a very slow person. You'll have to be patient. You won't mind." },
        { tone: 'risque', t: "And then what? Tell me the bit after.", r: "There's a bit after. I'm not saying it here. I'll show you. It has a door and no list." },
      ] },
      { tone: 'flirty', t: "Slowly? You've given this real thought.", r: "Weeks of it. Research, mostly. I'm thorough. You know I'm thorough.", opts: [
        { tone: 'cold', t: "That's a bit intense.", r: "It is. Quietly intense. ...Sorry." },
        { tone: 'passive', t: "I love that you're thorough.", r: "Do you? Then you're going to love this. I've planned it like a jigsaw. Edges first." },
        { tone: 'flirty', t: "Then show me your research.", r: "Hold still. Edges first. ...See? Thorough. Patient. I've been thinking about this for a very long time." },
        { tone: 'risque', t: "Show me all of your research. Tonight.", r: "All of it. Tonight. ...There's a lot. It'll take until morning. I've said that out loud. Good. I meant it." },
      ] },
    ] },
  { id: 'shy-close-5-flirty', stage: 'close', slot: 5, mood: 'flirty',
    say: "I've been thinking about you all day. In detail. Quietly. I'm not going to tell you the details. I'm going to stand very close instead.",
    opts: [
      { tone: 'cold', t: "Standing close isn't the same as saying it.", r: "No. You're right. Sorry. I'm braver in my head. I'll stand back.", opts: [
        { tone: 'cold', t: "Suit yourself.", r: "...Yes. Okay. Back. Here's back." },
        { tone: 'passive', t: "Sorry, that was harsh of me. Stand close. I like it.", r: "You like it. Closer. ...I'll say the details later. Or never. Closer's the detail." },
        { tone: 'flirty', t: "So say one detail. Just one.", r: "One. ...Your hands. In my hair. That's the detail. That's the whole day's worth. I'm done." },
      ] },
      { tone: 'passive', t: "In detail? Now I'm curious.", r: "Very detailed. Very quiet. Lots of— no. I'm not saying. I'm going to stand here. Like this.", opts: [
        { tone: 'cold', t: "Bit much for public.", r: "Yes. Sorry. I'll stand one step further away. Sorry." },
        { tone: 'passive', t: "Stand there all you like. I'm happy.", r: "Happy. Good. Me too. ...You smell like rain. That's a detail. That one's allowed." },
        { tone: 'flirty', t: "Closer. Then whisper one detail.", r: "...Your voice. Saying my name. When it's dark. ...That's one. That's enough for now." },
        { tone: 'risque', t: "Come home and tell me all the details. Show me, even.", r: "Show you. ...Yes. I've stopped being scared of that. Mostly. I'll still go red. In the dark you won't see." },
      ] },
      { tone: 'flirty', t: "Closer, then. Closer than that.", r: "This is very close. I can hear your heart. It's fast. Is that me? It's me. Good.", opts: [
        { tone: 'cold', t: "Okay, that's close enough.", r: "Close enough. ...I'll stay at close enough. Sorry." },
        { tone: 'passive', t: "That's you. It always is.", r: "Always is. ...That's going on the list. Item— I've lost count. You make me lose count. I never lose count." },
        { tone: 'flirty', t: "Now tell me one detail. Just one.", r: "Kissing you somewhere you can't run off to the next race. That's one. That's the main one." },
        { tone: 'risque', t: "Show me the details instead of saying them.", r: "Not here. Behind a door. I'll show you all of them. In order. I'm very methodical." },
      ] },
    ] },

  // ---- slot 6: the fear (your world is huge; they'd be invisible in it) ---------------------------------------------------
  { id: 'shy-close-6-cold', stage: 'close', slot: 6, mood: 'cold',
    say: "Can I say a scared thing? After last time I thought... your world is so big. And I'm so small in it. You could lose me. Easily.",
    opts: [
      { tone: 'cold', t: "You're overthinking it.", r: "Yes. I am. I always am. ...It's still true, though. A bit. Sorry.", opts: [
        { tone: 'cold', t: "Stop, then.", r: "I'll try. ...I'll try quietly." },
        { tone: 'passive', t: "Sorry. I hear you. You're not small to me.", r: "Not small. That helps. You're the only person who's ever made me feel not small." },
        { tone: 'flirty', t: "I'd never lose you. I'd find you in every corner.", r: "Every corner. You would. You always do. ...That's what you did at the start. You still do it." },
      ] },
      { tone: 'passive', t: "I'm not going to lose you. Tell me what's scaring you.", r: "That one day you'll look round and I'll be wallpaper. Nice wallpaper. But wallpaper.", opts: [
        { tone: 'cold', t: "That's a bit dramatic.", r: "It is. I know. ...Dramatic wallpaper. Sorry." },
        { tone: 'passive', t: "You're the only thing I look for in every room.", r: "I'm going to remember that when it's loud. When I'm in the corner. You're looking for me." },
        { tone: 'flirty', t: "You're not wallpaper. You're the whole house.", r: "That's ridiculous. That's the best ridiculous thing. ...I'll be the house. You come home to it." },
      ] },
      { tone: 'flirty', t: "You're the only thing in my world I can't stop looking at.", r: "You have to stop sometimes. You've got races. ...But you mean it. Your face means it.", opts: [
        { tone: 'cold', t: "Don't make me prove it.", r: "No. I won't. ...Okay." },
        { tone: 'passive', t: "I mean it. Every word.", r: "Every word. I'm keeping every word. I'll put them somewhere for the scared nights." },
        { tone: 'flirty', t: "I'll stare right now, to prove it.", r: "You're staring. I'm staring back. I'm— I'm not small. Not right now." },
      ] },
    ] },
  { id: 'shy-close-6-passive', stage: 'close', slot: 6, mood: 'passive',
    say: "I worry sometimes. Your world's so big. Cameras. Crowds. I'm the person in the corner of the photo. What if you stop seeing me?",
    opts: [
      { tone: 'cold', m: -6, t: "If you're that worried, maybe this isn't for you.", r: "...Oh. No. I didn't mean— I just— okay. I'll be quiet. Sorry.", opts: [
        { tone: 'cold', t: "Think about it.", r: "I will. ...Very quietly." },
        { tone: 'passive', t: "That came out awful. I'm sorry. I'm for you.", r: "You're for me. Okay. I believe you. My heart's going. It's going in the good direction now." },
        { tone: 'flirty', t: "That was cruel. Come here. I'm staying.", r: "You're staying. ...Hold on a bit longer. I'm still scared. Less. Hold on." },
      ] },
      { tone: 'passive', t: "I'll always see you. You're the person I look for first.", r: "First? Before the team? You do, don't you. I've seen you do it. It's written down.", opts: [
        { tone: 'cold', t: "Mostly.", r: "Mostly. Okay. ...Mostly's still good. Sorry." },
        { tone: 'passive', t: "Every time. You're my quiet place.", r: "Your quiet place. I've always been the one who needed one. I didn't know I could be one." },
        { tone: 'flirty', t: "First and last. Every day.", r: "First and last. I'm going to ask you to say that again when I'm scared. Every time. Okay?" },
      ] },
      { tone: 'flirty', t: "Then don't let me lose you. Hold on tighter.", r: "Tighter. ...I'm holding on. I'm very strong for a quiet person. You'll see.", opts: [
        { tone: 'cold', t: "Not so tight.", r: "Sorry. Looser. ...Okay. Sorry." },
        { tone: 'passive', t: "That's perfect. Exactly right.", r: "Exactly right. I've never been exactly right before. Only nearly." },
        { tone: 'flirty', t: "Tighter still. I'm staying put.", r: "I'm holding the person who's not going anywhere. ...That's a very nice thing to hold." },
        { tone: 'risque', t: "Hold on all night. I'll show you I'm not going anywhere.", r: "All night. I won't let go. You'll wake up and I'll still be holding on. That's a warning. And a promise." },
      ] },
    ] },
  { id: 'shy-close-6-flirty', stage: 'close', slot: 6, mood: 'flirty',
    say: "You make me braver than anyone. But I'm still scared. Your world is huge. What if I'm just the quiet bit you outgrow?",
    opts: [
      { tone: 'cold', t: "Outgrow you? Maybe don't think about that.", r: "No. I won't. ...I'll try. It comes back. Sorry.", opts: [
        { tone: 'cold', t: "Try harder.", r: "Yes. ...I'll try harder. Quietly." },
        { tone: 'passive', t: "Sorry. That was flippant. I'm not going to outgrow you.", r: "No? I'll keep that. The scared bit's smaller now. It's the size of a puzzle piece." },
        { tone: 'flirty', t: "I'll never outgrow the quiet bit. It's my favourite.", r: "Your favourite bit is the quiet bit. ...Then I'll stay quiet for you. And loud for you. Whichever you want." },
      ] },
      { tone: 'passive', t: "You're not a bit of my life. You're the middle of it.", r: "The middle. Like the middle of a jigsaw. The hardest bit. Where all the pieces are the same blue.", opts: [
        { tone: 'cold', t: "Bit of a weird metaphor.", r: "Yes. I'm full of weird ones. ...Sorry." },
        { tone: 'passive', t: "The bit that holds everything together.", r: "Holds everything together. I'll hold it all together. That's a job I can do." },
        { tone: 'flirty', t: "The bit I'd take the longest over. On purpose.", r: "On purpose. Slowly. ...You learned that from me. You're using my words on me. It's working." },
      ] },
      { tone: 'flirty', t: "I'm the one who should worry. You're braver than anyone I know.", r: "Braver? Me? With you. Only with you. That's the scary bit. Nobody else gets it.", opts: [
        { tone: 'cold', t: "Then don't be scared.", r: "I'll try. ...It doesn't work like that. But I'll try." },
        { tone: 'passive', t: "Being the only one is an honour.", r: "An honour. That's a lovely way to see it. I'll try to see it that way. With you holding my hand." },
        { tone: 'flirty', t: "Be brave with me always. I'll keep you safe.", r: "Always. ...I came in scared. I'm leaving as the very opposite. I'll find the word for it. Later." },
        { tone: 'risque', t: "Be brave with me tonight. Somewhere private.", r: "Tonight. Private. ...Yes. Brave. You'll have to be patient with the brave. It's new." },
      ] },
    ] },

  // ---- slot 7: family (ESTABLISHES: their loud sister Ro, who wants to meet you) ----------------------------------------
  { id: 'shy-close-7-cold', stage: 'close', slot: 7, mood: 'cold',
    say: "My sister, Ro, wants to meet you. Ro talks for three people. I wasn't going to ask. After last time. But Ro won't stop.",
    opts: [
      { tone: 'cold', t: "Meeting family is a big step.", r: "It is. Too big. I'll tell Ro no. Ro will be loud about it. That's fine.", opts: [
        { tone: 'cold', t: "Tell Ro not yet.", r: "Not yet. ...Ro will want a date. I'll say 'not yet'. Again. Quietly." },
        { tone: 'passive', t: "Big. But I'd like to. When?", r: "You would? Sunday. Ro does a lunch. It's very loud. I'll sit next to you. I'll hold your hand under the table." },
        { tone: 'flirty', t: "Big step. Worth it, for you.", r: "For me. ...Ro's going to show you an old photo of me dressed as a tree. Apologies in advance. Thank you." },
      ] },
      { tone: 'passive', t: "I'd love to meet Ro. Tell me about her.", r: "Ro tells everyone everything. Ro once told a waiter about my cat for twenty minutes. Ro is... a lot.", opts: [
        { tone: 'cold', t: "Sounds exhausting.", r: "Ro is. ...Sorry. Never mind. It was a silly idea." },
        { tone: 'passive', t: "I'll bring earplugs. And flowers.", r: "Flowers for Ro. Ro will cry. Ro cries at everything. Loudly. ...You're going to be very good at this." },
        { tone: 'flirty', t: "I'll survive Ro. For you, I'd survive anything.", r: "Even Ro's singing? ...I won't make you. I'll make you watch me not join in. That's our compromise." },
      ] },
      { tone: 'flirty', t: "If Ro's half as lovely as you, I'm in.", r: "Ro's not lovely. Ro's loud. Ro will love you immediately. That's worse. Ro will hug.", opts: [
        { tone: 'cold', t: "I'm not a hugger.", r: "No. I'll warn Ro. Ro won't listen. ...Sorry." },
        { tone: 'passive', t: "I'll take the hug. Then find you in a corner.", r: "At Ro's lunch. That's exactly where I'll be. You'll know. You always know." },
        { tone: 'flirty', t: "Ro can hug me. You get everything else.", r: "Everything else. ...I won't tell Ro that's the arrangement. Ro would put it on a cake." },
      ] },
    ] },
  { id: 'shy-close-7-passive', stage: 'close', slot: 7, mood: 'passive',
    say: "My sister wants to meet you. Ro. Ro is loud. Ro talks for both of us, and a third person. Would you... survive that?",
    opts: [
      { tone: 'cold', t: "I'm not great with families.", r: "Oh. No. That's fine. Ro will cope. I'll cope. Sorry I asked.", opts: [
        { tone: 'cold', t: "Maybe another time.", r: "Another time. ...Ro will ask again. I'll say another time." },
        { tone: 'passive', t: "But I'll try. For you.", r: "For me. ...I'll stay next to you the whole time. I'll be your quiet corner. At Ro's. In reverse." },
        { tone: 'flirty', t: "I'm terrible with families. But I'm great with you.", r: "That's true. You are. Okay. Let's be terrible at Ro's together. Holding hands." },
      ] },
      { tone: 'passive', t: "Of course I'll survive. I'd love to meet her.", r: "Ro will ask you everything. Your star sign. Your intentions. Ro has a list too. A louder one.", opts: [
        { tone: 'cold', t: "My intentions are my business.", r: "Yes. Of course. I'll tell Ro. ...Ro won't like it. Sorry." },
        { tone: 'passive', t: "I'll answer everything. Honestly.", r: "Then Ro will love you. And tell me in the kitchen, loudly, that you're 'a keeper'." },
        { tone: 'flirty', t: "My intentions are very good. Mostly.", r: "Don't say mostly to Ro. Ro will hear the mostly. ...I heard the mostly. I liked the mostly." },
      ] },
      { tone: 'flirty', t: "Ro sounds great. I'll tell her all about how you blush.", r: "No. You won't. Ro already knows. Ro has known since I was four. Don't help Ro.", opts: [
        { tone: 'cold', t: "Fine. I'll be boring.", r: "Boring. Okay. ...Ro will think I made you up. That's fine." },
        { tone: 'passive', t: "Okay, okay. I'll be on your side.", r: "My side. Good. Two of us, then. Against Ro. We'll lose. But together." },
        { tone: 'flirty', t: "I'll tell Ro you're the best thing that's happened to me.", r: "Ro would cry. I'd cry. A table full of crying people. ...Say it, though. I'd like Ro to know." },
        { tone: 'risque', t: "And afterwards I'll take you home and make you blush properly.", r: "Properly. After Ro's lunch. ...That's the best reason I've ever had to get through a lunch." },
      ] },
    ] },
  { id: 'shy-close-7-flirty', stage: 'close', slot: 7, mood: 'flirty',
    say: "My sister Ro has decided to meet you. Ro's the loud one. I'm the one you kiss. ...Why did I say that. It's true, though.",
    opts: [
      { tone: 'cold', t: "Sounds like pressure.", r: "It is. Sorry. Ro decided. I can tell Ro no. I'm good at no. Quietly.", opts: [
        { tone: 'cold', t: "Tell Ro no, then.", r: "Okay. No. ...I'll tell Ro. Ro will sulk. Loudly." },
        { tone: 'passive', t: "No, it's fine. I'd like to meet her.", r: "You would. I'll tell Ro. I'll whisper it. Ro won't hear, but I'll have told her." },
        { tone: 'flirty', t: "Pressure's fine. Kissing you after is the reward.", r: "The reward. After Ro. ...Then I'll stand next to you and count the minutes until the reward." },
      ] },
      { tone: 'passive', t: "The loud one and the one I kiss. I'll keep track.", r: "Please do. Don't mix us up. Ro would let you. Ro thinks it's funny. Ro is wrong.", opts: [
        { tone: 'cold', t: "I'll manage.", r: "Yes. ...You will. Sorry." },
        { tone: 'passive', t: "I'll never mix you up. You're the quiet one I'm crazy about.", r: "Crazy about. ...Ro will hear that through a wall. Ro hears everything. I don't care. Say it again." },
        { tone: 'flirty', t: "I'll prove which one I kiss. In front of Ro.", r: "No. Ro would never let me forget. Ro would make a speech. ...Okay. One. A small one. Ro can watch." },
      ] },
      { tone: 'flirty', t: "You said it, though. You're the one I kiss.", r: "I said it. Out loud. ...It's true, so I'm not taking it back. I'm getting bolder. You've noticed.", opts: [
        { tone: 'cold', t: "Bit bold for you.", r: "Yes. Bold. ...I'll go back to quiet. Sorry." },
        { tone: 'passive', t: "I've noticed. I love it.", r: "You love it. Then I'll be bold at Ro's lunch. I'll hold your hand on the table. Not under it." },
        { tone: 'flirty', t: "Prove it. Kiss me now.", r: "Now. ...There. Proven. Ro's not even here and I still did it. That's the brave version of me. Your version." },
        { tone: 'risque', t: "The one you kiss. And the one you go home with.", r: "Go home with. ...Yes. That's on the list too. Item— it doesn't matter. Yes. Every time." },
      ] },
    ] },

  // ---- slot 8: the future (a house with a quiet room and a loud room) ---------------------------------------------------
  { id: 'shy-close-8-cold', stage: 'close', slot: 8, mood: 'cold',
    say: "I've been thinking about later. Not tomorrow. Years. I know last time you weren't... but I keep thinking about it. A house.",
    opts: [
      { tone: 'cold', t: "Years is a long way off.", r: "It is. I'm sorry. I jumped. I always jump in my head. Never out loud. Until now.", opts: [
        { tone: 'cold', t: "Let's stick to now.", r: "Now. Okay. ...Now's fine. I'll keep the house in my head." },
        { tone: 'passive', t: "Tell me about the house anyway.", r: "A quiet room. For me. A loud room. For you. A kitchen between them. ...And a cat. Obviously." },
        { tone: 'flirty', t: "A long way off. But I'd like to get there with you.", r: "With me. ...I'm going to start saving for the quiet room. And the loud room. Mostly the loud one. For you." },
      ] },
      { tone: 'passive', t: "I think about later too. What's the house like?", r: "Small. Lots of windows. A quiet room. A loud room, for you. A table big enough for a jigsaw.", opts: [
        { tone: 'cold', t: "A loud room? Is that a dig?", r: "No. No. It's a gift. For you. ...Never mind. Sorry." },
        { tone: 'passive', t: "And a garden. For the cat.", r: "A garden for Pickle. Pickle will hate it. Pickle hates everything good. ...You said 'the cat'. You're in the house." },
        { tone: 'flirty', t: "And a sofa big enough for two. Lying down.", r: "A big sofa. Yes. ...I'll measure. Twice. I'm very thorough about sofas." },
      ] },
      { tone: 'flirty', t: "I'm in? In the house? Say yes.", r: "Yes. You're in. You're the reason for the house. Without you it's just a quiet room. With a cat.", opts: [
        { tone: 'cold', t: "Bit soon for houses.", r: "Yes. Soon. Sorry. ...I'll keep it in a drawer. The house." },
        { tone: 'passive', t: "Then I'll help you build it. Room by room.", r: "Room by room. Like a jigsaw. Edges first. ...We'd be very slow. I don't mind slow. You know I don't." },
        { tone: 'flirty', t: "Then build me a room right next to yours.", r: "Next to mine? No. You're in mine. That's the whole plan. You're in mine." },
        { tone: 'risque', t: "Skip to the bedroom. Tell me about that one.", r: "The bedroom. ...It's quiet. Very quiet. Except when it isn't. That's all you're getting. Come and see." },
      ] },
    ] },
  { id: 'shy-close-8-passive', stage: 'close', slot: 8, mood: 'passive',
    say: "Sometimes I picture a house. One quiet room, for me. One loud room, for you. A kitchen in the middle where we meet. Is that silly?",
    opts: [
      { tone: 'cold', t: "A bit silly, yeah.", r: "Yes. Okay. Silly. I knew. I'll keep it in my head.", opts: [
        { tone: 'cold', t: "Probably best.", r: "Yes. ...It's a nice head. The house is happy there." },
        { tone: 'passive', t: "Sorry. It's not silly. It's lovely. Tell me more.", r: "A window seat in the quiet room. A speaker in the loud room. You'd come and find me. I'd always let you." },
        { tone: 'flirty', t: "Silly and lovely. I want the kitchen in the middle.", r: "Where we meet. ...You'd make terrible tea. I'd drink it. Every day. Happily." },
      ] },
      { tone: 'passive', t: "It's not silly. It sounds like us.", r: "Like us. We're an 'us'. ...I never thought I'd be part of an us. Let alone have a house for one.", opts: [
        { tone: 'cold', t: "Let's not get ahead of ourselves.", r: "No. Not ahead. ...We're still an us, though. I'm keeping that." },
        { tone: 'passive', t: "We're definitely an us.", r: "Definitely. ...My sister's going to make a speech. She's been waiting years for me to be an us." },
        { tone: 'flirty', t: "An us with a very big bed.", r: "A very big— okay. Yes. Noted. I'll put it in the plans. In pencil. No. Pen." },
      ] },
      { tone: 'flirty', t: "Can I visit the quiet room? Often?", r: "Often. Without knocking. You're the only one allowed in without knocking. That's the rule.", opts: [
        { tone: 'cold', t: "I'll knock, thanks.", r: "Okay. Knock. ...I'll still let you in. Every time." },
        { tone: 'passive', t: "And you can come to the loud room any time.", r: "I'll come in. Sit in the corner. Watch you be loud. Watching you is my favourite thing." },
        { tone: 'flirty', t: "I'll visit the quiet room and make it less quiet.", r: "You'd ruin the quiet room. Ruin it. Please. I've been saving it for you to ruin." },
        { tone: 'risque', t: "And stay the night in it.", r: "Every night. ...The quiet room has a door that locks. I made sure. In my head. Very sure." },
      ] },
    ] },
  { id: 'shy-close-8-flirty', stage: 'close', slot: 8, mood: 'flirty',
    say: "I've designed our house. In my head. One quiet room. One loud room. And a bedroom that's... neither. I've given it a lot of thought.",
    opts: [
      { tone: 'cold', t: "You've given a bedroom a lot of thought?", r: "Yes. It's a normal amount. For a— no, it's not. Sorry. Forget the bedroom.", opts: [
        { tone: 'cold', t: "Forgotten.", r: "Okay. Forgotten. ...It's a nice room, though." },
        { tone: 'passive', t: "I'm teasing. Tell me about the house.", r: "Quiet room. Loud room. Kitchen in the middle. A jigsaw table. Our names on the door. In my handwriting." },
        { tone: 'flirty', t: "Fine. I'll give it a lot of thought too.", r: "Then we can compare notes. ...I've got diagrams. I don't have diagrams. I might draw some." },
      ] },
      { tone: 'passive', t: "One quiet, one loud. That's perfect.", r: "Isn't it? I've been working on it for months. Since I knew you'd stay.", opts: [
        { tone: 'cold', t: "Months? That's a lot of planning.", r: "Yes. I'm a planner. ...Sorry." },
        { tone: 'passive', t: "I'll help with the plans. Edges are mine.", r: "You'd be terrible at the edges. ...You can do all of them anyway. Every one." },
        { tone: 'flirty', t: "And the room that's neither? That's my favourite.", r: "Mine too. ...I didn't think anyone would ever see that room. You're the only one with a key." },
      ] },
      { tone: 'flirty', t: "Neither? Tell me more about that room.", r: "No. Not here. ...It has a lock. And no list. And you. That's all I'm saying.", opts: [
        { tone: 'cold', t: "That's quite enough, thanks.", r: "Okay. Enough. ...Sorry. I got carried away." },
        { tone: 'passive', t: "And you. That's all I need to hear.", r: "Always me. ...You'd always find me there. That's the point of it. The finding." },
        { tone: 'flirty', t: "Let's build it soon. I can't wait.", r: "Soon. I'll start saving. And drawing. You can't wait. Neither can I. I'm not waiting." },
        { tone: 'risque', t: "Give me a preview tonight.", r: "A preview. Tonight. ...My flat. It's not the house yet. But it has a door. And me. Come and see." },
      ] },
    ] },

  // ---- slot 9: the last piece (re-states the sky jigsaw) - love, in their words -------------------------------------------
  { id: 'shy-close-9-cold', stage: 'close', slot: 9, mood: 'cold',
    say: "I finished a jigsaw. A whole sky, a thousand pieces. Except one. I kept it. After last time, I wasn't sure. But it's yours. If you want it.",
    opts: [
      { tone: 'cold', t: "It's just a puzzle piece.", r: "It is. ...It's the last one, though. I've never saved the last one. For anyone.", opts: [
        { tone: 'cold', t: "Keep it, then.", r: "Okay. I'll keep it. ...The sky's got a hole in it. That's fine. It's had one before." },
        { tone: 'passive', t: "Sorry. I didn't understand. Why save it for me?", r: "Because you're the last piece. Of everything. I love you. ...I've been saving that even longer than the piece." },
        { tone: 'flirty', t: "Then let me put it in. With you.", r: "With me. ...There. It's finished. The whole sky. ...I love you. That's the other thing I saved. That's done too." },
      ] },
      { tone: 'passive', t: "I want it. Of course I want it.", r: "Here. ...It's the bit where the blue goes gold. I always save that bit for the end.", opts: [
        { tone: 'cold', t: "It's very small.", r: "Yes. It's small. ...So are the important things. Usually." },
        { tone: 'passive', t: "Thank you. I'll keep it safe.", r: "Keep it safe. ...I love you. There. I said it to a person. To you. I didn't plan it. I meant it." },
        { tone: 'flirty', t: "Let's put it in together. Then the sky's ours.", r: "Ours. ...There. Done. A whole sky. And I love you. And I didn't stammer. Look. Not once." },
        { tone: 'risque', t: "Let's finish it at yours. And not leave till morning.", r: "At mine. Not till morning. ...Yes. I love you. I wanted to say that before the yes. It goes before the yes." },
      ] },
      { tone: 'flirty', t: "You saved the last piece for me? That might make me cry.", r: "Don't. If you cry, I'll cry. Then nobody finishes the sky. ...I love you. Oh. There it is.", opts: [
        { tone: 'cold', t: "Let's not get emotional.", r: "No. Not emotional. ...I still said it. It's still true." },
        { tone: 'passive', t: "I love you too. Quietly and loudly.", r: "Quietly and loudly. Both rooms. ...That's the whole house. You just said the whole house." },
        { tone: 'flirty', t: "Say it again, unrehearsed.", r: "I love you. ...I love you. It's not getting easier, just truer. That's the best way round." },
        { tone: 'risque', t: "Say it again. Somewhere I can kiss you after.", r: "Somewhere. ...I'll say it there. And then you can. And then nobody says anything for a while." },
      ] },
    ] },
  { id: 'shy-close-9-passive', stage: 'close', slot: 9, mood: 'passive',
    say: "I don't know if I ever told you about my sky jigsaws. A thousand blues. I finished one. All but one piece. I saved it. For you.",
    opts: [
      { tone: 'cold', t: "That's sweet. But it's just a jigsaw.", r: "Just a jigsaw. To you. ...To me it's the whole— never mind. Sorry. Keep it anyway.", opts: [
        { tone: 'cold', t: "I'll put it somewhere.", r: "Somewhere. ...That's fine. It'll be somewhere. Like me." },
        { tone: 'passive', t: "Sorry. I didn't mean 'just'. Tell me what it means.", r: "It means I don't finish things without you now. Not even skies. ...I love you. That's what it means." },
        { tone: 'flirty', t: "It's not just a jigsaw. It's you. I know.", r: "Of course you know. You always— I love you. You knew that too. I'm saying it anyway." },
      ] },
      { tone: 'passive', t: "I'd be honoured to put the last piece in.", r: "Here. The gold bit. Where the sky goes morning. ...Go on. Then it's done. Then I can say the thing.", opts: [
        { tone: 'cold', t: "What thing? Just say it.", r: "I love you. ...You sounded tired. It's fine. It's still true. I'll say it again when you're less tired." },
        { tone: 'passive', t: "Done. What's the thing?", r: "I love you. ...That's the thing. I've been saving it longer than the piece. It was harder to keep." },
        { tone: 'flirty', t: "Done. Now say the thing. I've been waiting.", r: "Okay. I love you. I love you. ...You were waiting. I didn't know anyone waited for me." },
        { tone: 'risque', t: "Done. Now say it, and then come here.", r: "I love you. ...Coming. And not letting go. And not saying anything else for a very long time." },
      ] },
      { tone: 'flirty', t: "You saved it for me. I think I'm in love with you.", r: "You said it first. I had it written down. I— I love you too. I love you. No paper.", opts: [
        { tone: 'cold', t: "Let's not rush it.", r: "No. Not rushing. ...You still said it. I'm keeping it. Slowly." },
        { tone: 'passive', t: "I am. Completely. Quiet and all.", r: "Quiet and all. ...The sky's finished. We're finished. I mean— we're not finished. We're started." },
        { tone: 'flirty', t: "Say it again so I can hear it properly.", r: "I love you. Properly. ...You're the one person I'd say it to out loud. With people watching. Even here." },
        { tone: 'risque', t: "Take me home and say it in the quiet room.", r: "The quiet room. ...Yes. Over and over, there. Until it's not quiet at all." },
      ] },
    ] },
  { id: 'shy-close-9-flirty', stage: 'close', slot: 9, mood: 'flirty',
    say: "I've finished the sky jigsaw. Nine hundred and ninety-nine pieces. The last one's in my pocket. I want you to put it in. It's... a metaphor.",
    opts: [
      { tone: 'cold', t: "A metaphor. Right.", r: "Yes. A metaphor. Never mind. No need. I'll put it in myself. ...Sorry.", opts: [
        { tone: 'cold', t: "Do that.", r: "...Okay. Done. The sky's finished. On my own. Like usual." },
        { tone: 'passive', t: "Sorry. Show me. I'll put it in.", r: "There. It's done. ...The metaphor was: I love you. That's what I couldn't say. So I did a jigsaw for a month." },
        { tone: 'flirty', t: "I like metaphors. Especially yours.", r: "Then here's the end of it: I love you. You're the last piece. That's always been the metaphor." },
      ] },
      { tone: 'passive', t: "Give it here. Let me.", r: "Here. ...Gently. There. Oh. It's done. It's never been done before. One's always gone missing.", opts: [
        { tone: 'cold', t: "It's only a jigsaw.", r: "Only a jigsaw. Yes. ...It's done, though. Thank you." },
        { tone: 'passive', t: "Not any more. Nothing's missing.", r: "Nothing's missing. ...I love you. That's the bit that was missing. The last piece. From me." },
        { tone: 'flirty', t: "Now what's the metaphor? Tell me.", r: "The metaphor is: I love you. I've loved you since a corner. And now the sky's finished." },
        { tone: 'risque', t: "Now let's celebrate. Properly.", r: "Properly. ...I love you. First. Then celebrating. Then— I'll stop narrating. I'll just love you." },
      ] },
      { tone: 'flirty', t: "I know what it means. And I love you back.", r: "Back. You said 'back'. So you knew I— oh. Of course you knew. You noticed. Like me.", opts: [
        { tone: 'cold', t: "It was obvious.", r: "Obvious. I'm obvious. ...I'm still glad I said it. Sort of." },
        { tone: 'passive', t: "I noticed. You're not as quiet as you think.", r: "With you I'm not quiet at all. I'm loud. I'm loudly in love with you. Look at me." },
        { tone: 'flirty', t: "Now finish the sky. Then kiss me.", r: "Sky first. ...There. Kiss second. ...I love you. Third. That's the order. That's the right order." },
        { tone: 'risque', t: "Put the piece in. Then let's not come out for a day.", r: "A day. ...Yes. I'll tell nobody. We'll just be gone. Quietly. Together." },
      ] },
    ] },
];
