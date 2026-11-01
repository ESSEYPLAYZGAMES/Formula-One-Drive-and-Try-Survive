// FLING - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): fun, flirty, late-night, one eye on the
// exit; she is out for the night and nothing that needs managing. A flirt lands, sweetness bores her a little, a cold
// shoulder rolls off her. She is never taken (she does not do that) but she always has somewhere else to be - and
// she gives her number with conditions attached. Plain data, no imports. The shape is spark/stranger.js's (its header
// has the keys; there is no taken here).
export const DATA = {
  open: {
    club: [
      "You've got the look of someone who doesn't stay out late. Let's fix that.",
      "I'm here for one more song, then I'm off somewhere better. Unless you're better.",
      "Hi. I don't do small talk, I do short talk. Ready?",
      "Ooh, a racing driver. Do you leave parties as fast as you drive?",
    ],
    party: [
      "Team parties are so wholesome. I'm here to make this one less wholesome. Hi.",
      "I'm only here until the good bit's over. You might be the good bit.",
      "You're the driver everyone keeps cheering. I'm not cheering. I'm looking.",
      "Hi. I gate-crashed, technically. Don't tell your team.",
    ],
    grid: [
      "I've got a pass that says 'guest'. I'm treating it as a dare.",
      "You've got minutes before the race. I've got minutes before I'm bored. Perfect match.",
      "Good luck today. I'm not staying for the end. I never do.",
      "I only came for the noise. You're a nice surprise.",
    ],
    hangout: [
      "Oh, thank goodness, someone fun. This place was getting very sensible.",
      "I'm passing through. I'm always passing through. Hi.",
      "You look like someone with a curfew. Want to break it?",
      "I'm only here for an hour. Make it a good one.",
    ],
  },
  react: {
    cold: {
      yes: ["Ha! No fuss, no feelings. My kind of person. I'm {first}.", "Cool. Cool is good. Cool means no one gets clingy. I'm {first}.", "I like that you don't care. Neither do I. I'm {first}."],
      no: ["Bit of a mood, aren't you? Shame. I don't do moods.", "Ooh, frosty. I'm not hanging around to thaw you.", "Oh, you're no fun. I only do fun."],
    },
    passive: {
      yes: ["Hi, {me}. I'm {first}. You're sweet. I don't usually go for sweet. Tonight I might.", "Polite! How retro. I'm {first}. I'll allow it, for the next ten minutes.",
        "I'm {first}. That was nice. Don't let it become a habit."],
      no: ["Hello. Very polite. I'm {first}. Nearly fell asleep.", "Sweet. Too sweet. I'm {first}. I like a bit of edge.",
        "Hi. I'm {first}. Is this the bit where we talk about the weather? Please don't."],
    },
    flirty: {
      yes: ["Oh, now you're talking. I'm {first}. I'm cancelling my next stop.", "Ha! Yes. Exactly that energy. I'm {first}.", "Smooth. I'm {first}. You've got my attention for at least an hour."],
      no: ["That's a bit keen. Keen scares me. I'm {first}.", "Easy. I'm a good time, not a long time. I'm {first}.", "Cute line. Bit too sincere. I'm {first}."],
    },
  },
  turn: {
    keen: {
      club: ["Here's the deal. I don't do serious. But I do do late. Very late.", "I'm having fun. That's rare enough that I should probably keep you somehow."],
      party: ["This is more fun than I planned. I hate planning. Let's not plan anything.", "You're the best thing at this party, and I've only been here twenty minutes."],
      grid: ["Go and race. Then find me after. Or don't. But do.", "I'll be gone by the podium. But I could be found later, if someone knew how."],
      hangout: ["I was going to leave in five minutes. I might give you fifteen. Lucky you.", "You're fun. I'm fun. That's all this needs to be. What now?"],
    },
    polite: {
      club: ["You're cute. But I'm off to the next place, and you're not coming.", "Nice chat! I'm going to go and be irresponsible elsewhere. Bye!"],
      party: ["This was fun for a minute. I'm going to find the next minute.", "Lovely to meet you. I'm going to go and gate-crash something else."],
      grid: ["Go and drive. I'm going to go and find a better view. Ciao!", "Good luck! I'll probably miss the end. I always do."],
      hangout: ["You're sweet. I'm going to go somewhere louder. Have a good one.", "This was nice. Nice isn't really my thing. Bye!"],
    },
    rushed: {
      club: ["My friends have found a better party. They always do. Quick, before I vanish.", "That's my cue to go. I always go. Say something and I might come back."],
      party: ["My lift to the next thing is here. There's always a next thing. Be quick.", "I'm off. I'm always off. But you're tempting me to be off later."],
      grid: ["That's the siren or whatever. I'm being cleared. Quick, give me something.", "I'm off before the start. Bad habit. You could make it worth hanging around."],
      hangout: ["I've got another place to be. Two, actually. What's your offer?", "My taxi's here. I never keep a taxi waiting. You've got ten seconds."],
    },
    busy: {
      club: ["My friends are leaving for somewhere better. Bye, driver!", "I'm off. The night's young and I've got places to be. Ciao!"],
      party: ["I've got three more parties tonight. You're not invited to any of them. Bye!", "I'm only here for five minutes. That was them. Bye!"],
      grid: ["I'm here with a group and they're going. I'm going too. Laters!", "That's my lot leaving the grid. Bye! Go fast. Look good doing it."],
      hangout: ["I'm out the door. I'm always out the door. Bye!", "I've got somewhere to be. Somewhere loud. Bye!"],
    },
    full: { any: ["You've been collecting numbers all night. Respect. But I'm a collector too.", "Ha, you've worked the whole room. Fun. But I don't do queues. Ever."] },
  },
  end: {
    keen: {
      cold: { no: ["Ha! Walking away first? That's my move. I'm impressed. Bye.", "Okay! No strings. My favourite kind of nothing. Bye."] },
      passive: { yes: ["Fine. Phone. I'm saved as 'Don't'. Text me anyway. After ten.", "Here. I don't answer before noon or after I've lost interest. You've got a window."] },
      flirty: { yes: ["Ha! There. Text me at midnight. Not before. I'm a night creature.", "Phone. Done. Don't fall for me. I mean it. Mostly."] },
    },
    polite: {
      cold: { no: ["Ha. Probably. Bye!", "Ooh, sore loser. Cute. Bye."] },
      passive: { no: ["You too! Have a wild one. Wilder than this.", "Thanks! Bye, sweet thing."] },
      flirty: { yes: ["Okay, okay. Persistence is fun. Here. I'll probably ignore you. Probably."], no: ["Ha! No. But I love that you tried twice."], need: 2 },
    },
    rushed: {
      cold: { no: ["Ha. Fair. Bye!", "Okay, I'm off then! You'd have been fun."] },
      passive: { yes: ["Quick, quick. Done. Text me late. Late is when I'm nice.", "There. Saved. No promises. I'm terrible at promises."] },
      flirty: { yes: ["Ha! Deal. Phone. Done. You'll hear from me at a stupid hour.", "Okay, you win. Here. Don't be clingy. Be fun."] },
    },
    busy: {
      cold: { no: ["Ha. Love that. Bye!", "Short and sweet. Like me. Bye!"] },
      passive: { no: ["You too! Bye, driver!", "Thanks! Don't wait up."] },
      flirty: { yes: ["Oh, why not. Here. Quick. I'll text you from the next place."], no: ["Ha! Nope. Catch me another night. If you can."], need: 3 },
    },
  },
  again: {
    say: ["You again! Twice in one night? That's practically a relationship. Run.", "Ha, back for more? I've already moved on. Literally."],
    end: ["Bye again! Have a wild one out there.", "Ciao, driver. Try someone who stays put."],
  },
};
