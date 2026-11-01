// ALOOF (ice) - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): cool, sharp, guarded, dry; she
// sizes you up before you have said a word. Restraint impresses her - walk away cool and she gives you her number
// for it; eagerness reads as cheap. Plain data, no imports. The shape is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "You've been deciding whether to come over for two songs. I timed it. Well?",
      "If you're about to ask if I come here often, turn around now.",
      "You're the driver. I watched you come in. You walk like you've already won something.",
      "I'm not dancing, I'm observing. You're in my line of sight. Explain yourself.",
    ],
    party: [
      "You're the one in the team kit. Everyone's been watching you all evening. I've been watching them watch you.",
      "Let me guess. Someone told you to be charming to the guests. Go on, then.",
      "I don't do team parties. A friend dragged me. You have three minutes to make it worthwhile.",
      "Your engineer's been looking for you. I said nothing. You owe me one.",
    ],
    grid: [
      "You should be in your car, not wandering about. Unless you're nervous. Are you nervous?",
      "Guests aren't supposed to distract the drivers. They gave us a leaflet. I've read it.",
      "Interesting. Most drivers walk past the guests like we're traffic cones.",
      "I was told the grid would be glamorous. It's mostly cables and people shouting.",
    ],
    hangout: [
      "You're trying very hard to look like you're not famous. It isn't working.",
      "That's my corner you're hovering by. Stand there if you must. Quietly.",
      "I know who you are. Don't make a fuss about it and neither will I.",
      "You've read the same menu three times. Either order something or talk to me.",
    ],
  },
  react: {
    cold: {
      yes: ["Good. Most people perform. You didn't. I'm {first}. That's a point in your favour.", "Finally, someone who doesn't gush. I'm {first}. Don't ruin it.",
        "Dry. I approve. I'm {first}. Try not to get too comfortable."],
      no: ["Curt for the sake of it. That isn't cool, that's just rude.", "Hm. A little too pleased with your own indifference.", "Tough. Noted. I'm still not impressed."],
    },
    passive: {
      yes: ["Hello, {me}. I'm {first}. That was refreshingly free of nonsense.", "Polite, direct, no speech. I'm {first}. You may continue.",
        "I'm {first}. You're the first person tonight who didn't open with a joke. Thank you."],
      no: ["Hello. Yes. I'm {first}. This is the part where we run out of things to say.", "Nice to meet you, I'm sure. I'm {first}. That's all the small talk I carry.",
        "Polite. Very polite. Forgettable, but polite."],
    },
    flirty: {
      yes: ["Hm. That was nearly good. I'm {first}. You get one more line.", "Bold. I don't usually let that work. I'm {first}. Consider yourself lucky.",
        "That should have been cheesy. It wasn't, quite. I'm {first}."],
      no: ["Did you rehearse that on the way over? It sounds like you did.", "Eager. Eager is so cheap. Try again some other year.", "I've heard that line twice tonight. You delivered it third best."],
    },
  },
  turn: {
    keen: {
      club: ["I was going to leave at midnight. I'm reconsidering. Don't make me regret it.", "You're more interesting than the music. That isn't saying much, but you managed it."],
      party: ["You're better than the speeches. Considerably. What are you going to do about it?", "I've been bored since I walked in. I'm not bored now. That's rare."],
      grid: ["You've got about a minute before your team collects you. I'd use it, if I were you.", "I'm giving you a provisional pass. It expires when the lights go out."],
      hangout: ["I came out to be left alone. Oddly, I don't mind this.", "You've passed the first round. There are several. I'm told they're difficult."],
    },
    polite: {
      club: ["Well. That was a conversation. I'm going back to my corner now.", "You're fine. I'm just not in the market for fine tonight."],
      party: ["I'll let you get back to your team. They seem to need supervising.", "Thank you for the chat. I've reached my quota of small talk for the evening."],
      grid: ["You should go. Your mechanics are making faces at me.", "Good luck today. I mean that, in a neutral sort of way."],
      hangout: ["Enjoy your evening. I'm going to enjoy mine. Separately.", "It was nice to meet you. Now I'd like to go back to being unbothered."],
    },
    rushed: {
      club: ["That's my friends at the door, looking impatient. Say something worth staying for. Quickly.", "My car's here. I don't keep cars waiting. You have one sentence."],
      party: ["My friend wants to leave, and I'm their lift home. You have thirty seconds.", "I'm due somewhere else. I'm rarely late. Make this worth being late for."],
      grid: ["They're clearing the grid. I'm being moved on. If there's something to say, say it.", "That's the three-minute board. Even I know that means hurry."],
      hangout: ["I'm meeting someone across town in ten minutes. Business. Talk fast.", "My friends are leaving. I'm leaving with them. Unless you give me a reason to slow down."],
    },
    busy: {
      club: ["I'm here with friends, and I'm going back to them. Goodnight.", "My friends are waiting. They're less work than this."],
      party: ["I'm only here to collect a friend. They're ready. So am I.", "I have to go and congratulate someone I don't like. Excuse me."],
      grid: ["I'm working, actually. I have twelve guests to get off this grid. Excuse me.", "My group's moving. I'm moving with it. Enjoy your race."],
      hangout: ["I'm waiting for someone, and I'd rather not be found chatting. Goodnight.", "I'm leaving. I've been leaving for ten minutes. This is me finally doing it."],
    },
    taken: {
      any: ["Before this goes any further: I'm with someone. They're over there. Glaring, slightly.", "I should tell you I'm spoken for. I'm also not interested in being unspoken for.",
        "My partner will be back any second. I'd rather they found me alone."],
    },
    full: { any: ["I saw you work the room. Very efficient. I don't do queues.", "You've collected half the numbers in here tonight. I'll keep mine, thank you."] },
  },
  end: {
    keen: {
      cold: { yes: ["Good. Don't chase. Give me your phone. ...There. Don't make me regret the restraint.", "That's the right answer. Here. My number. Use it sparingly."] },
      passive: { yes: ["Ask properly next time. Here. I'm saved under my full name. No nicknames.", "Fine. Phone. Yes, that's my real number. I'm not that cruel."] },
      flirty: { yes: ["Too eager, but I'll allow it. Here. Don't text 'hey'.", "Hm. Overplayed. Effective, though. My number's in. Behave."] },
    },
    polite: {
      cold: { yes: ["...Now that's more like it. Give me your phone before I think better of it."], no: ["Mm. The feeling's mutual. Goodnight."], need: 1 },
      passive: { no: ["And you. Goodnight, {me}.", "Likewise. Take care."] },
      flirty: { no: ["No. Charming that you asked twice, though. Goodnight.", "Persistence isn't a personality. Goodnight."] },
    },
    rushed: {
      cold: { yes: ["Exactly what I'd have said. Phone. Quickly. ...Done. Goodnight.", "You're not going to beg. Good. Here's my number for not begging."] },
      passive: { yes: ["Since you asked so plainly. There. Don't call. Text.", "Quickly, then. It's saved. I'm leaving before you say something to spoil it."] },
      flirty: { yes: ["Shameless. Here. I'll pretend I didn't enjoy that.", "You're lucky I'm in a hurry. I'd have made you work harder. Saved."] },
    },
    busy: {
      cold: { no: ["Good. We understand each other.", "Fine indeed. Goodbye."] },
      passive: { no: ["Thank you. You too.", "Mm. Enjoy the rest of it."] },
      flirty: { no: ["No. But it's a good night for asking, I'm sure.", "Not tonight. Possibly not ever. Goodnight."] },
    },
    taken: {
      cold: { no: ["I'd have said the same. Goodnight.", "Efficient. I appreciate that."] },
      passive: { no: ["Thank you. That was graciously done.", "Kind of you. Goodnight, {me}."] },
      flirty: { no: ["I'll pass that on. They'll be unbearable about it.", "Don't. It's very nearly working, and that's inconvenient."] },
    },
  },
  again: {
    say: ["We've done this. I gave you my answer. It hasn't aged.", "Back so soon? I'm flattered and unmoved."],
    end: ["Goodnight, {me}. Truly.", "Still no. You're consistent, I'll give you that."],
  },
};
