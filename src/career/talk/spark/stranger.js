// PLAYFUL (spark) - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): you walk up to someone you have
// never met - at a club, the team party, on the grid, out for an evening - and she is bubbly, teasing, a dare in
// everything. Flirting lands; coldness stings. Plain data, no imports.
//   open[place]           her first line as you walk up (place: club | party | grid | hangout)
//   react[tone].yes / .no  her answer to your first line, when it landed / when it did not
//   turn[kind][place|any]  what she says next: keen (numbers are on the table), polite (nice, but no), rushed (she has
//                          to go, but liked you), busy (she has to go), taken (someone is waiting for her), full (she
//                          has watched you collect numbers all night)
//   end[kind][tone]        her last word to your second answer: yes (you swap numbers), no (you do not); with both and
//                          a need, she says yes only when the chemistry is at least that
//   again                  a second try the same night: her line, and her last word
export const DATA = {
  open: {
    club: [
      "Okay, you've walked past me three times. Either say something or I'm dragging you onto the dance floor.",
      "You! Settle something. My friends say this song is terrible. I say it's a masterpiece. Go.",
      "I dare you to say something interesting. No pressure. Well, a little bit of pressure.",
      "Oh, hi! I was just about to do something reckless. You can be my witness.",
    ],
    party: [
      "You're one of the drivers, aren't you? Brilliant. Tell me something the cameras never get.",
      "Hi! I've been dared to talk to someone important. You'll do. That came out wrong.",
      "Quick, look busy. The team photographer keeps pointing that thing at me.",
      "I've eaten four of those tiny pastries and I'm not stopping. Don't judge me. Hi!",
    ],
    grid: [
      "Oh my goodness, you're actually a driver. Sorry. Hi. I'm trying to play it cool and failing.",
      "Is it rude to say good luck to someone you've never met? Good luck! There, I said it.",
      "I bet my friend you'd stop and say hello. I win! Hi!",
      "Everyone on this grid looks terrified except you. Are you terrified? You can tell me.",
    ],
    hangout: [
      "You've got the look of someone who's been told to have a quiet night. Boring. Hi!",
      "Hi! I've been watching you pretend not to be recognised. You're terrible at it.",
      "Settle a bet: are you famous, or do you just look like someone famous?",
      "Oh good, a new face. Everyone I came with has turned sensible. Save me.",
    ],
  },
  react: {
    cold: {
      yes: ["Ha! Grumpy. I like a challenge. I'm {first}, by the way, and I'm going to make you smile.", "Ooh, mysterious. Fine. I'll crack you. I'm {first}. Everyone cracks.",
        "Wow, okay, tough crowd. Lucky for you I love a tough crowd. {first}. Hi."],
      no: ["Oh. Okay. Someone left their fun at home tonight.", "Ouch. Right. I'll put my sparkle away, then.", "Well, that landed like a flat tyre. Shame. I'm {first}, for the record."],
    },
    passive: {
      yes: ["A proper hello! Who even does that any more? I love it. I'm {first}.", "Nice. Polite. Slightly suspicious. I'm {first}, and I've decided you're fun.",
        "Hi back! I'm {first}. You've got a good face for trouble, you know."],
      no: ["Hi. Okay. That was very... polite. I'm {first}. I was hoping for chaos.", "Sweet. A bit beige, but sweet. I'm {first}.", "Hello to you too. Gosh, we're being very grown-up about this, aren't we?"],
    },
    flirty: {
      yes: ["Oh, you're good. That was smooth. I'm {first}, and I'm blushing, which never happens.", "Stop it. No, don't stop it. I'm {first}. Carry on.",
        "Ha! I knew you'd be trouble the second you walked over. I'm {first}."],
      no: ["Ha, that's a line. A good line, but I can see the strings. I'm {first}.", "Cute. Did you practise that in the mirror? Be honest.",
        "Okay, smooth operator, slow down. You haven't even asked my name. It's {first}."],
    },
  },
  turn: {
    keen: {
      club: ["Right, I've decided. You're getting my number, and you're texting me something ridiculous.", "This is the most fun I've had all night, and I've been dancing on a sofa. Don't tell security."],
      party: ["You're the only one here who's made me laugh. That has to be rewarded somehow.", "I was going to leave after the speeches. Now I might stay. Make it worth it."],
      grid: ["They'll drag you off to your car any second. Quick, before they do, say something brave.", "You've got about a minute before someone in a headset steals you. Use it wisely."],
      hangout: ["My friends are giving me looks. The good kind. They think I've found someone fun.", "I came out for a quiet night too. Look how that's going. What happens next?"],
    },
    polite: {
      club: ["You're sweet. But I promised my friends I'd dance until my feet fall off.", "It's been nice! I'm going to go and find my people now. Have a great night."],
      party: ["Lovely to meet you. I'm going to go and steal more pastries before they vanish.", "You're nice. I'm going to circulate, though. I've got a dare to finish."],
      grid: ["Good luck out there! Honestly. I'm going to let you get back to your car now.", "I won't keep you. You look like you need to concentrate. Drive fast!"],
      hangout: ["You're fun. Just not my kind of trouble tonight. Enjoy your evening!", "This was nice. I'm going back to my table before they eat my share of the chips."],
    },
    rushed: {
      club: ["Oh no, that's my friends waving. We're going on somewhere. Quick, what were you going to say?", "My taxi's outside and I'm the one who booked it. Talk fast, driver."],
      party: ["Argh, my lift's leaving. Of course it is, right when it got good. Quick!", "They're calling me for a photo. Hold that thought. Actually, don't hold it. Say it now."],
      grid: ["That's the five-minute board. They're clearing the grid. Be quick, be brilliant!", "Someone in a headset is glaring at me. I have to go. Unless you say something fast."],
      hangout: ["My friends are leaving for the next place and I'm their only sense of direction. Quick!", "My phone's buzzing. That's my ride. You've got one sentence. Make it a good one."],
    },
    busy: {
      club: ["My friends are dragging me to the floor. Nice meeting you! Probably see you never!", "Oops, that's my song. Sorry! I have to go and dance badly to it. Bye!"],
      party: ["Oh, that's my boss waving. I have to go and be professional. Bye!", "I'm on photo duty for a friend. Duty calls! Have a lovely night."],
      grid: ["That's my group leaving the grid. I have to go. Good luck, though!", "I'm being herded off the grid. Literally herded. Bye! Drive fast! Drive well! Both!"],
      hangout: ["That's my friends at the door. We've got somewhere else to be. Bye!", "I'm due at a birthday thing and I'm late. Sorry! Bye!"],
    },
    taken: {
      any: ["Oh, I should say, I'm here with my partner. They're the one pretending not to watch us.", "Okay, full disclosure: I'm taken. Happily! But you're very fun to talk to.",
        "My partner's going to love that I've met a driver. They'll be so jealous. Of me, not you."],
    },
    full: { any: ["I've been watching you collect numbers all night. I'm not joining the collection!", "Ha, you're the one doing the rounds! Very efficient. Not with me, though."] },
  },
  end: {
    keen: {
      cold: { no: ["Wait, what? You're just going? Wow. Okay. Your loss, mystery driver.", "Seriously? That was the moment! Fine. See you around, I suppose."] },
      passive: { yes: ["Yes! Give me your phone. There. I've saved myself as 'the fun one'.", "Obviously. Here. Text me something stupid tomorrow or I'll be devastated."] },
      flirty: { yes: ["Smooth. Fine. Phone. I'm putting a lot of exclamation marks in my name, I warn you.", "Ha! Nobody else would dare. Here, quick, before I come to my senses."] },
    },
    polite: {
      cold: { no: ["Ooh, sulky. That's okay. Enjoy your night, grumpy.", "Wow. Okay! Bye, then."] },
      passive: { no: ["You too! Go and have fun. That's an order.", "Aw, see, you're sweet. Have a great night!"] },
      flirty: { yes: ["Persistent. I like persistent. Fine! Give me your phone before I change my mind."], no: ["Ha! Nice try. Still no. But I admire the effort, honestly."], need: 2 },
    },
    rushed: {
      cold: { no: ["Oh. Right. Okay! Bye, then. Shame.", "Fine, fine, I'm going. You could have asked, you know."] },
      passive: { yes: ["Yes, yes, quick! Here. I'm typing with one thumb. Don't laugh at my spelling.", "Done! Number's in. Text me before I forget your face. I won't forget your face."] },
      flirty: { yes: ["Deal! There. Now I'm going to be smiling in the taxi like an idiot.", "Ha! Fine. Phone. Quick. Okay, saved. Now go and be brilliant."] },
    },
    busy: {
      cold: { no: ["Right! Okay. Bye, then, grumpy!", "Charming. Have a nice life!"] },
      passive: { no: ["Thanks! You too. Don't do anything I wouldn't do!", "Aw, thanks. Have a brilliant night!"] },
      flirty: { yes: ["Oh, go on, you've earned it. Quick. Here. Don't make me regret this!"], no: ["Ha! Not tonight. But I like your nerve."], need: 3 },
    },
    taken: {
      cold: { no: ["Wow, okay, bye! You were fun for about a minute.", "Fair enough. Have a good one."] },
      passive: { no: ["You too! You're lovely. Go and find someone single!", "Aw, thanks. Good luck tonight. Not with me, obviously."] },
      flirty: { no: ["Ha! Stop it. My partner is right there. Okay, you're a bit charming.", "They are lucky. I'll tell them you said so. They'll be insufferable."] },
    },
  },
  again: {
    say: ["You again! I said no, silly. Nicely, but no. Are you lost?", "Back for another go? I love the commitment. Still no, though!"],
    end: ["Go on, go and have fun. Not with me!", "Bye again! Third time is not lucky, I promise."],
  },
};
