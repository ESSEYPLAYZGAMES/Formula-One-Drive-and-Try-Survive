// SWEET (sunny) - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): warm, sincere, a little dorky,
// blushes at a compliment and is hurt by a cold shoulder. Kindness and a gentle flirt both land; coldness never does.
// Plain data, no imports. The shape is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "Hi! Sorry. I've lost my friends and I'm pretending I meant to stand here. Is that obvious?",
      "Oh! You're one of the drivers, aren't you? I watched today. With my mum on the phone. Hi!",
      "Is it just me, or is it really loud in here? I keep saying 'pardon' to everyone.",
      "You look like you need a friend. Or a glass of water. I can only offer the friend.",
    ],
    party: [
      "Hi! Is this okay? I'm a plus-one and I don't know where to stand. Do you know where to stand?",
      "You were amazing today. Is that a weird thing to say? It's the truth, though.",
      "Hello! I'm trying all the little sandwiches and rating them. Want to help?",
      "Oh gosh, you're coming over here. Okay. Hi. I'm normal. I promise I'm normal.",
    ],
    grid: [
      "Hi! Sorry, I'm so excited. This is my first time on a grid. Is it always this exciting?",
      "Oh! Hello! Can I say good luck? I've got a good-luck wave. It's very powerful.",
      "Wow, you're actually here. Sorry. You must hear that a lot. Hi!",
      "I made a little sign for the race but I'm too shy to hold it up. Hi, though!",
    ],
    hangout: [
      "Hi! Sorry, are you waiting for someone? I don't want to steal your corner.",
      "Oh, hello! I recognised you and then pretended I didn't. Then I gave up pretending. Hi!",
      "I've been reading the menu like it's a novel. It has a very good twist on page two. Hi!",
      "Hi! I'm having a really nice evening, and I think you should be having one too.",
    ],
  },
  react: {
    cold: {
      yes: ["Oh! Okay. That's fair. I'll be quiet. Well, quieter. I'm {first}.", "Ha, you're dry. That's okay, I like dry. Like toast. I'm {first}. Sorry. Toast.",
        "That's a bit stern, but I think you're joking? I'm going to assume you're joking. I'm {first}."],
      no: ["Oh. Sorry. I didn't mean to bother you.", "Right. Okay. That stung a little, but okay.", "Oh. I'll... I'll leave you to your evening, then."],
    },
    passive: {
      yes: ["Hi, {me}! I'm {first}. This is nice. You're nice. Sorry, I say 'nice' a lot.", "Oh, hello! I'm {first}. You've got a really kind face, has anyone told you?",
        "Hi! I'm {first}. I'm so glad you came over. I was hoping someone would."],
      no: ["Hi! I'm {first}. That's... yes. Hello. This is going fine. Isn't it?", "Nice to meet you! I'm {first}. I'm not quite sure what to say next.",
        "Oh, hello. I'm {first}. Sorry, I think I'm a bit tired tonight."],
    },
    flirty: {
      yes: ["Oh! Oh, my. I'm going very red, aren't I? I'm {first}. Hello.", "That's the sweetest thing anyone's said to me all week. I'm {first}.",
        "Stop, you'll make me giggle, and I snort when I giggle. I'm {first}."],
      no: ["Oh! Ha. That's very forward. I'm {first}. I'm not sure what to do with that.", "Gosh. You're quick. I'm {first}. Could we start with hello?",
        "That's sweet, but I don't think you mean it yet. I'm {first}."],
    },
  },
  turn: {
    keen: {
      club: ["I'm having such a good time. I don't want to lose you in the crowd. Is that silly?", "My friends are going to ask who I was talking to. I'd like to have a good answer."],
      party: ["This is the best bit of the night so far. And I've had three of the little sandwiches.", "I'd really like to talk to you again. Somewhere I can hear you properly."],
      grid: ["I know you've got to go soon. I just want you to know I'll be cheering really loudly.", "Can I tell my friends I met you? And maybe that we're going to talk again?"],
      hangout: ["I don't want this to be the only time we talk. Is that too much to say?", "You're really easy to talk to. I'd like to do this again sometime. Properly."],
    },
    polite: {
      club: ["This was lovely. I'm going to find my friends now, though. Have the best night!", "You're really nice. I think I'm going to head back to my lot. Take care of yourself!"],
      party: ["It was really nice to meet you. I'd better find my plus-one before they worry.", "Thank you for saying hello. I'm going to go and finish my sandwich ratings."],
      grid: ["I'll let you get ready. Good luck! I'll still be cheering, I promise.", "You need to focus, I can tell. Thank you for stopping. Good luck out there!"],
      hangout: ["This was nice! I'm going to head back to my table. Enjoy your night off.", "You're lovely. I'm just a bit talked out tonight. Have a really good evening."],
    },
    rushed: {
      club: ["Oh no, my friends are leaving! I really don't want to go yet. Quick, quick!", "That's our taxi. Of course it is. I was just starting to have the nicest time."],
      party: ["Oh no, my lift's here and I promised I wouldn't keep them waiting. But I want to!", "I have to catch the shuttle back to the hotel. Is there a quick way to keep in touch?"],
      grid: ["They're asking guests to leave the grid. I don't want to go yet. Is that awful?", "I have to go back to the stand now. But I'd love to talk to you again!"],
      hangout: ["My friends want to go on somewhere. I'd really rather stay, but I promised.", "My bus is in five minutes and it's the last one tonight. Quick!"],
    },
    busy: {
      club: ["Oh, sorry, my friends need me. Someone's lost a shoe. Bye! Have fun!", "I'm on friend duty tonight. They're a bit of a handful. Lovely to meet you!"],
      party: ["Sorry! I have to help my friend with something. It was lovely to meet you.", "I'm meant to be helping set up the photos. I'd better go. Bye!"],
      grid: ["Sorry! I'm actually working today. I have to get my group to their seats.", "I'm being waved off the grid. I have to go! Good luck!"],
      hangout: ["Oh, I'm so sorry, I'm here for my friend's birthday. I'd better get back.", "I've got to go, I'm the designated sensible one tonight. Lovely to meet you!"],
    },
    taken: {
      any: ["I should say, I'm here with my partner. They're lovely. You'd like them. Sorry!", "Oh, I'm so sorry, I hope I didn't give the wrong idea. I'm with someone.",
        "My partner's just over there. I really like talking to you, though! As a friend!"],
    },
    full: { any: ["I think you've been asking everyone for their number tonight. I'd rather not be one of many.", "Oh, you've been very busy tonight, haven't you? I think I'll sit this one out."] },
  },
  end: {
    keen: {
      cold: { no: ["Oh. Okay. I thought... never mind. Have a good night.", "Oh! Right. I'll just, um, see you around, then. Maybe."] },
      passive: { yes: ["Yes! Yes, of course. Here. I've put a little smiley face next to my name. Is that silly?", "I'd love that. There. Text me when you're home safe. Or whenever. Anytime is fine."] },
      flirty: { yes: ["Oh, stop. Okay, don't stop. Here's my phone. Put yours in mine, too. My hands are shaking.", "You're going to make me cry, and it's a happy cry. Here. Number. Saved."] },
    },
    polite: {
      cold: { no: ["Oh. Right. Okay, then.", "That's a bit unkind. But okay. Goodnight."] },
      passive: { no: ["You too, {me}. Look after yourself.", "Thank you for being so nice about it. Goodnight!"] },
      flirty: { no: ["Oh, that's sweet. But I don't think so. I'm sorry!", "You're lovely, really. Just not tonight. I hope that's okay."] },
    },
    rushed: {
      cold: { no: ["Oh! Okay. I thought you might ask... never mind. Bye!", "Right. Yes. I'd better go. Bye, then."] },
      passive: { yes: ["Yes! Quick, here. I've spelled my own name wrong. Doesn't matter. Text me!", "Oh, thank goodness. Here. Now I can leave without being sad about it."] },
      flirty: { yes: ["You're terrible. Here! I'm going to be grinning all the way home.", "Okay, okay, here! Oh, my friends are going to tease me so much."] },
    },
    busy: {
      cold: { no: ["Oh! Um. Okay. Bye, then.", "Right. Sorry. Bye."] },
      passive: { no: ["Thank you! Lovely to meet you too!", "You're so nice. Have a wonderful night."] },
      flirty: { no: ["Oh! That's sweet. I really do have to go, though. Sorry!", "Maybe another time? I'm so sorry, I have to run."] },
    },
    taken: {
      cold: { no: ["Oh. Sorry. I should have said straight away.", "Of course. Sorry again."] },
      passive: { no: ["Thank you for being so lovely about it. Have a really good night.", "You're so kind. I'll be cheering for you anyway!"] },
      flirty: { no: ["Oh, stop it! I'm going red again. Goodnight, you!", "That's very sweet. I'll tell them. They'll laugh."] },
    },
  },
  again: {
    say: ["Oh! Hello again. I'm sorry about before. It's still a no, but a friendly one.", "Hi again! I hope you're having a nice night. I really do mean that."],
    end: ["Have a lovely rest of your night, {me}.", "Take care! Maybe I'll see you on the telly."],
  },
};
