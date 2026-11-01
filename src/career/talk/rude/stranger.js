// RUDE - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): blunt, sarcastic, mocking, hard to
// impress, and secretly soft. Give it back and she respects you - a cold answer can win her number where a polite one
// never would - but nothing she says is cruel: she mocks the line, never the person. Plain data, no imports. The shape
// is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "Oh good, a racing driver. Exactly what this place needed. More ego.",
      "You've walked past four times. Either talk or stop orbiting. It's distracting.",
      "If you're about to tell me how fast you go, I'll leave.",
      "Let me guess. You've come over to tell me you're famous. I know. I don't care.",
    ],
    party: [
      "Free food and a room full of people pretending to like each other. Lovely. Hi.",
      "You're the driver, right? I watched. You were fine. Don't fish for more.",
      "I was told there'd be interesting people here. Then you walked over. Prove me wrong.",
      "Everyone's congratulating everyone. It's exhausting. Don't you dare congratulate me.",
    ],
    grid: [
      "Shouldn't you be in your car, being dramatic?",
      "They let guests on the grid now. Clearly they let anyone on the grid.",
      "You look nervous. Good. You should be. Have you seen the car behind yours?",
      "Oh, look, a driver who stops to talk to people. Is that in your contract?",
    ],
    hangout: [
      "You're about to ask if anyone's sitting here. They are. Me. Sit anyway.",
      "Oh no, a famous person. Brace yourselves, everyone.",
      "I came here to avoid people. Look how well that's going.",
      "That's a terrible place to stand. Right by the door. Come and stand somewhere better.",
    ],
  },
  react: {
    cold: {
      yes: ["Ha. Right back at me. Okay, you're less boring than you look. I'm {first}.", "Good. Someone with a spine. I'm {first}. Don't let it go to your head.",
        "Oh, you bite. Fine. I'm {first}. I like a bit of bite."],
      no: ["Sulky. Not tough, just sulky. There's a difference.", "Wow. Grumpy and dull. Impressive combination.", "That wasn't cool. That was just rude, and I'm the rude one here."],
    },
    passive: {
      yes: ["Polite. Weird. I'll allow it. I'm {first}.", "Okay, that was almost normal. I'm {first}. Keep it that way.", "A plain hello. No speech. Fine, I'm {first}. You get a minute."],
      no: ["Wow. 'Hi.' Groundbreaking. I'm {first}. That's all you get.", "Very polite. Very boring. Did your team write that?", "Hello. Yes. We're all very pleased you're here."],
    },
    flirty: {
      yes: ["Oh, that's awful. Genuinely awful. I'm {first}. I'm also smiling, so shut up.", "That should not have worked. It slightly did. I'm {first}. Don't tell anyone.",
        "Cheesy. Disgusting. Do another one. I'm {first}."],
      no: ["Did that line come free with the car?", "Oh, please. Save it for someone easier.", "I've had better lines from a parking meter."],
    },
  },
  turn: {
    keen: {
      club: ["Fine. You're the least annoying person here. Don't get excited, the competition's weak.", "I was going to leave twenty minutes ago. I'm still here. Make of that what you want."],
      party: ["You're tolerable. Really tolerable. That's practically a love letter, from me.", "Everyone else here is boring. You're slightly less boring. Congratulations."],
      grid: ["Go and drive. Badly, probably. I'll be watching. Not for you. For the overtakes.", "You've got two minutes before someone drags you away. I'm not saying use them. I'm just saying."],
      hangout: ["I hate that I'm enjoying this. Really hate it. What are you going to do about it?", "This is annoying. You're actually funny. I didn't plan for that."],
    },
    polite: {
      club: ["Right, well, that's enough of that. Off you go.", "That was a conversation. It's over now. Go and bother someone else."],
      party: ["Lovely. Now go and shake some more hands. You're good at that.", "I'm going to go and hide by the food. Alone. Bye."],
      grid: ["Go on. Your car's waiting. It's more interesting than this.", "You'll be late. Then they'll blame me. Shoo."],
      hangout: ["That's my social battery done. Goodnight.", "You're fine. Fine's not enough. Bye."],
    },
    rushed: {
      club: ["My friends are leaving and I'm the only one who knows the way. Typical. Talk fast.", "My taxi's outside and the driver's already annoyed. So am I. Make it quick."],
      party: ["My lift's going. Ugh. Right when you were getting bearable. Be quick.", "I have to rescue a friend from one of your mechanics' stories. Thirty seconds."],
      grid: ["They're kicking us off. Of course they are. Say something useful.", "That's the warning horn or whatever. I'm off. Unless you've got something."],
      hangout: ["I've got to catch the last train, and it waits for no one. Neither do I. Go.", "My friend's outside, honking. Embarrassing. Quick."],
    },
    busy: {
      club: ["My friends are waiting. They're more fun than you. Bye.", "I'm here with people. Real people. I'm going back to them."],
      party: ["I'm working, actually. Somebody has to. Bye.", "I'm only here to pick someone up, and they're finally ready. Bye."],
      grid: ["I'm working. On the grid. Some of us have jobs. Move.", "My group's leaving. I'm their minder. Bye, driver."],
      hangout: ["I'm meeting someone. Not you. Bye.", "I'm off. I've been off for ages. You just didn't notice."],
    },
    taken: {
      any: ["I'm with someone, before you get any ideas. They're nicer than me. Barely.", "Taken. Happily. Annoyingly happily. So stop that.",
        "My partner's over there, and they'll find this hilarious. I won't."],
    },
    full: { any: ["I've watched you go round the whole room. I'm not a lap of honour.", "You've asked everyone in here for their number. I'm not everyone."] },
  },
  end: {
    keen: {
      cold: { yes: ["Ha. Good. Don't ask. Give me your phone. ...There. Text me something rude.", "Oh, playing it cool? Fine. I'll do it. Number's in. Don't make it weird."] },
      passive: { yes: ["Ugh. Fine. Here. If you send me a thumbs up, I'm blocking you.", "Took you long enough. Phone. There. Don't text first thing. I'm horrible in the morning."] },
      flirty: { yes: ["That's so bad. Give me your phone. ...Saved you as 'Bad Lines'.", "Disgusting. Here. I hate myself. Text me."] },
    },
    polite: {
      cold: { yes: ["Ha! Now that's more like it. Give me your phone. You've earned it, barely."], no: ["Yeah, it is. Bye."], need: 0 },
      passive: { no: ["Yeah, you too. Whatever.", "Don't be so polite. It's unsettling. Bye."] },
      flirty: { no: ["No. Still no. That one was worse.", "Begging's not a good look. Bye."] },
    },
    rushed: {
      cold: { yes: ["Finally, someone who doesn't fuss. Phone. ...Done. Bye.", "Ha. Right. Give me your phone, then. Quick. I'm doing this, not you."] },
      passive: { yes: ["Fine, fine. Here. Don't read into it.", "Number. Saved. Don't get sentimental about it."] },
      flirty: { yes: ["Ugh, you're relentless. Here. I'm going, before I say something nice.", "Shameless. Phone. There. Now let me leave with my dignity."] },
    },
    busy: {
      cold: { no: ["Right back at you.", "Great chat. Bye."] },
      passive: { no: ["Yeah. You too. Bye.", "Sure. Bye, driver."] },
      flirty: { no: ["No. Absolutely not. Bye.", "Ha. No. Nice try."] },
    },
    taken: {
      cold: { no: ["Yeah, I should have. Bye.", "Fine. Go and annoy someone single."] },
      passive: { no: ["You're being decent about it. Gross. Bye.", "Yeah, yeah. Lovely to meet you too."] },
      flirty: { no: ["They are. I'll tell them. They'll be smug for a week.", "Stop flirting with taken people. It's tacky. Also, thanks."] },
    },
  },
  again: {
    say: ["You again. Bold. Daft, but bold.", "Back for round two? You lost round one."],
    end: ["Still no. Go away. Nicely.", "Bye, persistent."],
  },
};
