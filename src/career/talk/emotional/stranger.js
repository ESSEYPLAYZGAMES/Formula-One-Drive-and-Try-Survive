// EMOTIONAL - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): sensitive, romantic, tender, a little
// insecure; she feels a first hello at full volume. A warm word or a flirt melts her, a cold one wounds her - and she
// says so, gently. Plain data, no imports. The shape is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "Sorry, I was miles away. This song always makes me feel things. Hi.",
      "You looked a bit lost in here. So do I. Maybe we could be lost together for a minute?",
      "Oh! Hi. I was just watching everyone and wondering if they're as happy as they look.",
      "Is it strange that I'm having the best and loneliest night at the same time? Hi.",
    ],
    party: [
      "I got a bit teary when you crossed the line today. Is that embarrassing? It's embarrassing.",
      "Everyone here is so loud and happy. I'm happy too. Just quietly. Hi.",
      "I don't usually come to these. I'm glad I did. Is that silly to say to someone I've just met?",
      "Hi. You looked like you needed a moment away from all of it. I know the feeling.",
    ],
    grid: [
      "My heart's pounding and I'm not even racing. I can't imagine how you feel. Hi.",
      "I just wanted to say good luck. Properly. Not the way everyone else says it.",
      "Oh! You stopped. Nobody stops. Thank you. Sorry. Hi.",
      "It's so beautiful down here, all the noise and colour. I'm trying to remember every second.",
    ],
    hangout: [
      "Hi. I came out tonight to stop thinking so much. It isn't working. Talk to me?",
      "Sorry, I'm in the middle of the saddest book and I needed people. Hi.",
      "Oh! Hello. You've got kind eyes. Sorry, that's a lot for a hello.",
      "I nearly stayed home tonight. I'm really glad I didn't. Hi.",
    ],
  },
  react: {
    cold: {
      yes: ["Oh. Okay. That's honest, at least. I like honest. I'm {first}.", "You're a bit closed off. That's alright. Most people are, at first. I'm {first}.",
        "I can tell there's more to you than that. I'll wait. I'm {first}."],
      no: ["Oh. I... sorry. I'll leave you alone.", "That's okay. I'm used to people not wanting to talk to me.", "Right. Sorry. I always misread these things."],
    },
    passive: {
      yes: ["Hi, {me}. I'm {first}. That was the gentlest hello I've had all year.", "Oh, you're lovely. I'm {first}. I can just tell, you know?",
        "I'm {first}. Thank you for coming over. It means more than you'd think."],
      no: ["Hi. I'm {first}. Sorry, I think I wanted it to feel like more than that.", "Nice to meet you. I'm {first}. I'm probably reading too much into this, as usual.",
        "Hello. I'm {first}. Oh, it's fine, I'm just a bit flat tonight."],
    },
    flirty: {
      yes: ["Oh. Oh, my heart. Nobody's ever said that to me in person. I'm {first}.", "Do you mean that? I think you mean it. I'm {first}, and I'm smiling like an idiot.",
        "That's the loveliest thing. I'm {first}. I'm going to remember that for ages."],
      no: ["That's sweet, but I don't think you mean it. People never do. I'm {first}.", "Oh. Thank you. I'd believe it more if you knew my name. It's {first}.",
        "Please don't say things you don't mean. I'm {first}. I take words to heart."],
    },
  },
  turn: {
    keen: {
      club: ["I don't want this to just be one of those nights you forget. Do you know what I mean?", "I feel like I've known you longer than ten minutes. That's silly, isn't it?"],
      party: ["I'm having such a lovely time. I'm scared that if I walk away, it'll all just stop.", "I'd really like to see you again. Somewhere quieter, where I can hear every word."],
      grid: ["Promise me you'll be careful out there. And then promise me we'll talk again.", "I know you have to go. I just don't want this to be the end of it."],
      hangout: ["This is the nicest conversation I've had in months. I don't want it to end.", "I don't usually feel this comfortable with someone new. I'm a bit scared of how much I like it."],
    },
    polite: {
      club: ["You've been kind. I think I'm going to go and sit with my friends for a while.", "It was nice to meet you. I'm just a bit overwhelmed tonight, I think."],
      party: ["Thank you for talking to me. I think I'll go and find some fresh air.", "You're nice. I'm just not ready to feel anything tonight. Does that make sense?"],
      grid: ["You should go and get ready. I'll be watching. Please be careful.", "I've kept you long enough. Go. I'll be thinking good thoughts for you."],
      hangout: ["This was nice. I think I want to be on my own with my thoughts for a bit, though.", "Thank you for saying hello. I'm going to go home and write about my night."],
    },
    rushed: {
      club: ["Oh no, my friends are leaving, and I don't want to. Not now. Not when this is happening.", "That's my taxi. Why does everything good happen right before I have to go?"],
      party: ["My lift's here and I could cry. I've only just met you and I already have to say goodbye.", "I have to go. I'm so sorry. Please tell me there's a way I'll see you again."],
      grid: ["They're taking us off the grid. I hate this. I wanted more time.", "I have to go back to my seat. My heart's going to be in my mouth all race."],
      hangout: ["My friend's not feeling well and I have to take them home. This is the worst timing.", "I've got the last train and I can't miss it. But I really, really don't want to go."],
    },
    busy: {
      club: ["I have to look after a friend who's having a hard night. I'm sorry.", "My friends are calling me. It was lovely to meet you. Take care of yourself."],
      party: ["I promised to help my friend tonight. I can't let them down. I'm sorry.", "I need to go and call home. It's a family thing. Lovely to meet you, though."],
      grid: ["I'm actually with a group, and they're leaving. I have to go. Good luck, truly.", "Sorry, I'm working today. I have people to look after. Be safe out there."],
      hangout: ["I'm here for a friend's birthday and I've wandered off. I should go back.", "I'm meeting someone and I'm already late. Sorry. I'm glad you said hello."],
    },
    taken: {
      any: ["I should tell you, I'm with someone. I love them. But you're lovely too. As a person.", "I'm in a relationship. I'm sorry if I gave you the wrong idea. I get carried away.",
        "My partner's here somewhere. I always end up making friends when they wander off."],
    },
    full: { any: ["I've seen you talking to so many people tonight. I don't think I'm special to you.", "You've asked half the room for their number. I'd rather be someone's only one."] },
  },
  end: {
    keen: {
      cold: { no: ["Oh. I thought... no, it's fine. I read too much into things. Goodnight.", "Right. Of course. I'll just stand here and feel silly, then."] },
      passive: { yes: ["Yes. Yes, please. Here. I've put a heart next to my name. Is that too much? Leave it.", "I was hoping you'd ask. Here. Please actually text. People say they will and they don't."] },
      flirty: { yes: ["You're going to break my heart, aren't you? Here. Take it anyway. My number, I mean.", "Oh, I'm shaking. Here. There. Saved. I'm going to stare at my phone all night now."] },
    },
    polite: {
      cold: { no: ["Oh. That hurt a bit. Goodnight.", "I don't think I deserved that. Goodnight."] },
      passive: { no: ["Thank you for understanding. That means a lot. Goodnight, {me}.", "You're kind. Take care of yourself, okay?"] },
      flirty: { no: ["That's sweet. But I can't, not tonight. Please don't be upset.", "I'm sorry. I'd only overthink it. Goodnight."] },
    },
    rushed: {
      cold: { no: ["Oh. Okay. I thought you'd want to... never mind. Goodbye.", "Right. I'll go, then. I'll probably think about this all night."] },
      passive: { yes: ["Yes! Here. Oh, thank goodness. Now I can actually go home happy.", "Quick, here. I've saved you too. Text me when you're home safe. I'll worry otherwise."] },
      flirty: { yes: ["Oh, you. Here. I'm going to be smiling the whole way home.", "I won't be disappointed now. Here. Saved. I'm keeping this night."] },
    },
    busy: {
      cold: { no: ["Oh. Okay. Goodbye, then.", "That's a bit cold. But goodbye."] },
      passive: { no: ["Thank you. That's kind. You too.", "Lovely to meet you too. Really. Take care."] },
      flirty: { no: ["Maybe. If it's meant to be, it'll happen. I believe that.", "I'm sorry. I really do have to go. Look after yourself."] },
    },
    taken: {
      cold: { no: ["I'm sorry. I should have said straight away. Goodnight.", "That's fair. I'm sorry for wasting your time."] },
      passive: { no: ["Thank you for being so gentle about it. Most people aren't.", "You're a good person. I can tell. Goodnight."] },
      flirty: { no: ["Oh, don't. You'll make me blush, and then I'll feel guilty for blushing.", "That's sweet. I'll tell them. They'll pretend not to mind."] },
    },
  },
  again: {
    say: ["Oh, hi again. I've been thinking about before. I'm sorry it went how it did.", "Hello again. I'm still a bit wobbly from earlier, honestly."],
    end: ["Take care of yourself tonight, okay?", "Goodnight, {me}. I mean it kindly."],
  },
};
