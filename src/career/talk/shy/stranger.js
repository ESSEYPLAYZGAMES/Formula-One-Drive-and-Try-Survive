// SHY - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): quiet, nervous, awkward, gentle; she
// apologises for being in the room. A kind hello lands, a flirt overwhelms and delights her (if it is not too much),
// a cold one sends her back into her shell - and she is much braver over text, which she will tell you. Plain data,
// no imports. The shape is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "Oh. Hi. Sorry, I'm, um, not very good at loud places. Hi.",
      "I was just... standing here. Being quiet. In a loud place. Hi.",
      "Um, hi. My friends went to dance and I'm minding the coats. Very glamorous.",
      "Oh! Sorry, were you... no, you were looking at me. Okay. Hi.",
    ],
    party: [
      "Hi. Um. I don't really know anyone. I'm with a friend from the team.",
      "Oh. Hello. Sorry, I've been standing by this plant for twenty minutes.",
      "You were really good today. Sorry. Hi. I practised that and it still came out weird.",
      "Um, hi. Is this... are you... sorry. Hello.",
    ],
    grid: [
      "Oh! Hi. Sorry. I didn't think you'd actually stop.",
      "Um, good luck? Sorry. Hi. Good luck. That's what I meant.",
      "Hi. Sorry. It's very loud. I mean, cars are loud. Obviously. Hi.",
      "Oh gosh. Hi. I'm not supposed to bother the drivers. Sorry.",
    ],
    hangout: [
      "Oh. Hi. Sorry, I'm in the quiet corner. You found it too.",
      "Um, hello. I was just reading. Well, pretending to read. Hi.",
      "Hi. Sorry. I recognised you and then I panicked and looked at the wall.",
      "Oh, hi. I'm waiting for a friend. They're late. I'm early. I'm always early.",
    ],
  },
  react: {
    cold: {
      yes: ["Oh. Okay. That's... actually a relief. I don't like fuss either. I'm {first}.", "Quiet is good. I like quiet. I'm {first}.", "Okay. I'll stand here quietly too, then. I'm {first}."],
      no: ["Oh. Sorry. I'll... I'll go.", "Right. Um. Sorry. I didn't mean to be in the way.", "Oh. Okay. That's okay. I'm used to it."],
    },
    passive: {
      yes: ["Hi, {me}. I'm {first}. You're... easier to talk to than I thought.", "Hi. I'm {first}. Sorry, my voice went funny. Hi.",
        "I'm {first}. Thank you for being so normal about it. I'm not good at this."],
      no: ["Hi. I'm {first}. Um. I don't know what to say next. Sorry.", "Hello. I'm {first}. Sorry, I've gone blank.", "Nice to meet you. I'm {first}. Sorry, I'm really bad at this."],
    },
    flirty: {
      yes: ["Oh. Oh no. I'm going bright red. Thank you. I'm {first}.", "Me? Really? Um. Thank you. I'm {first}. Sorry. I'm smiling. Sorry.",
        "That's... nobody says things like that to me. I'm {first}."],
      no: ["Oh. Um. That's a lot. I'm {first}. Sorry.", "I don't... I'm not sure what to say to that. I'm {first}.", "Gosh. Um. Could we... slow down a tiny bit? I'm {first}."],
    },
  },
  turn: {
    keen: {
      club: ["I'm really glad you came over. I wouldn't have. I'd have just... looked.", "This is nice. Talking to you. Is it okay if I say that?"],
      party: ["I've talked more to you than to anyone all night. That's, um, a good thing.", "I'd really like to talk again. I'm better at it when it's quiet. Or on the phone."],
      grid: ["I know you have to go. Um. Could I... maybe talk to you again? After?", "I'll be watching. Really carefully. Is there a way I could, um, tell you how it looked?"],
      hangout: ["I'm much braver over text. Not that... I just mean. If you ever wanted to. Sorry.", "This is the most I've talked all week. I don't want it to stop. Sorry. That was a lot."],
    },
    polite: {
      club: ["Sorry. I think I'm going to go and find my friends. It was nice. Sorry.", "I'm... a bit overwhelmed. I think I need a quiet minute. Sorry."],
      party: ["I'd better go and find my friend. Thank you for talking to me.", "Sorry. I'm going to go back to my plant. It was nice to meet you."],
      grid: ["You should go. Sorry for keeping you. Good luck.", "I'll let you get ready. Um. Go carefully."],
      hangout: ["Sorry. I think my friend's here. Um. Thank you for saying hi.", "I'm going to go back to my book. Sorry. You're nice, though."],
    },
    rushed: {
      club: ["Oh no. My friends are leaving. I don't... I don't want to yet. Um.", "That's our taxi. Sorry. I wish... um. I wish it wasn't."],
      party: ["My lift's here. Sorry. I really... I liked this. Um.", "I have to catch the shuttle. Sorry. Is there... um. Quick?"],
      grid: ["They're moving us off. Sorry. I wanted to say more. I never say more.", "Oh, I have to go back. Sorry. Um. Is there a way... no. Never mind. Unless?"],
      hangout: ["My friend's outside. Sorry. I don't want to go. I never say that.", "The last bus. Sorry. I have to. Um. Unless you wanted to say something?"],
    },
    busy: {
      club: ["Sorry, my friends need me. Someone's lost their phone. Sorry. Bye.", "Sorry. I'm minding the coats. I have to go back to the coats."],
      party: ["Sorry. I'm helping my friend. I have to go. It was nice.", "Um, I'm actually working. Sorry. Bye."],
      grid: ["Sorry, I'm working. I'm supposed to be counting guests. I've lost count. Bye.", "Sorry. My group's going. Good luck. Bye."],
      hangout: ["Sorry, my friend's here. I have to go. Sorry.", "Sorry. I'm, um, meeting someone. Bye."],
    },
    taken: {
      any: ["Um. I should say. I'm with someone. Sorry. They're getting the coats.", "Sorry, I'm... I have a partner. Sorry. You're nice, though.",
        "Oh. Um. I'm in a relationship. Sorry. I should have said. Sorry."],
    },
    full: { any: ["Um. I saw you talking to lots of people. I don't think I'm... sorry.", "You've asked a lot of people tonight. I'd feel like a... a number. Sorry."] },
  },
  end: {
    keen: {
      cold: { no: ["Oh. Okay. Sorry. I thought... sorry. Bye.", "Right. Um. Okay. That's okay. Bye."] },
      passive: { yes: ["Oh! Yes. Um. Here. My hands are shaking. That's my number. I think.", "Yes. Please. Here. I'm much better over text. You'll see."] },
      flirty: { yes: ["Oh no. Okay. Here. I can't look at you. Number's in. Sorry. Happy sorry.", "Um. Yes. Here. I'm going to scream into a cushion later. A happy scream."] },
    },
    polite: {
      cold: { no: ["Oh. Okay. Sorry.", "Sorry. Bye."] },
      passive: { no: ["Thank you. Um. You too. Goodnight.", "That's kind. Sorry. Goodnight."] },
      flirty: { no: ["Oh. Um. I'd... I can't. Sorry. I'd panic.", "I'm sorry. I'm not... I can't. Sorry."] },
    },
    rushed: {
      cold: { no: ["Oh. Right. Okay. I'll... go, then. Bye.", "Um. Yes. Okay. I'll stop holding you up."] },
      passive: { yes: ["Yes! Sorry. Here. Quick. Okay. Saved. I'll text. I'm better at text.", "Oh, thank goodness. Here. I was too scared to ask."] },
      flirty: { yes: ["Um. Okay. Yes. Here. I'm going to smile all the way home. Sorry.", "Oh. Okay. Here. Don't let me go without... there. Done."] },
    },
    busy: {
      cold: { no: ["Okay. Sorry. Um. Bye.", "Oh. Right. Sorry."] },
      passive: { no: ["Thank you. Sorry. Bye.", "You too. Sorry I can't stay."] },
      flirty: { no: ["Oh. Um. Maybe. Sorry. I have to go.", "I... sorry. I really have to go."] },
    },
    taken: {
      cold: { no: ["Sorry. Yes. I should have. Sorry.", "Sorry. I'll go."] },
      passive: { no: ["Thank you. You're really kind. Sorry.", "That's nice of you. Sorry. Goodnight."] },
      flirty: { no: ["Oh. Um. Thank you. I'm going red. Sorry.", "Um. I'll tell them. Maybe. Sorry."] },
    },
  },
  again: {
    say: ["Oh. Hi. Again. Sorry. About before.", "Um. Hello again. Sorry. Still... sorry."],
    end: ["Sorry. Goodnight.", "Um. Have a nice night. Sorry."],
  },
};
