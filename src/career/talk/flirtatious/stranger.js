// FLIRTATIOUS - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): seductive, bold, sultry; every line
// an innuendo and never more than that. A flirt or a risque line lands, a polite one bores her, a cold one is a
// challenge she may take up; she alone (with the Dominant) hears a risque answer from someone she has just met.
// Suggestive, never explicit. Plain data, no imports. The shape is spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "You've been staring for a while. I don't mind. I'd just like you to do something about it.",
      "Careful. Walk any closer and I'll assume you mean it.",
      "I was hoping the most interesting person in {venue} would come over. And here you are.",
      "Mm. A racing driver. Do you take every corner that fast?",
    ],
    party: [
      "So this is what the winners' enclosure looks like. I expected more velvet.",
      "All these people want your attention, and you came to me. Smart.",
      "I've been watching you shake hands all night. You must be exhausted. Let me be easy company.",
      "Mm, team kit. It's doing a lot for you. Don't tell your sponsors I said that.",
    ],
    grid: [
      "I've never been this close to a racing car before. Or a driver. Which one's more dangerous?",
      "You're about to do two hundred miles an hour, and you stopped for me. Flattering.",
      "They told me not to distract the drivers. I didn't promise anything.",
      "That race suit's very flattering. I imagine you've heard that before.",
    ],
    hangout: [
      "Oh, look at you, trying to have a quiet night. I'm about to ruin that.",
      "You walked in and the whole room got more interesting. Don't get smug about it.",
      "Sit down. I don't bite. Not on a first meeting, anyway.",
      "I was about to leave. Then you looked over. Now I'm not about to leave.",
    ],
  },
  react: {
    cold: {
      yes: ["Hard to get. Mm. You've no idea how much I like a challenge. I'm {first}.", "Cool as anything. I'll enjoy warming you up. I'm {first}.",
        "Playing it cold? Darling, I invented cold. I'm {first}."],
      no: ["Shame. You looked like you'd be fun. I'm rarely wrong.", "Oh, don't be dull. It doesn't suit that face.", "Cold shoulders bore me. I'm {first}, for what it's worth."],
    },
    passive: {
      yes: ["So polite. I bet you're not polite all the time. I'm {first}.", "Hello yourself. I'm {first}. Say my name again, I like how it sounds.",
        "Good manners and a good face. Dangerous combination. I'm {first}."],
      no: ["Hello. Mm. That's it? I'm {first}. I was hoping for a little more heat.", "Nice. Very nice. I don't really do nice. I'm {first}.",
        "Pleasant. Pleasant is for lunch with the in-laws. I'm {first}."],
    },
    flirty: {
      yes: ["There it is. I knew you had it in you. I'm {first}, and I'm very glad you came over.", "Oh, you're good. Say something else like that and I'll be in real trouble. I'm {first}.",
        "Mm. Now we're talking. I'm {first}. Keep going."],
      no: ["Cute. A little rehearsed, but cute. I'm {first}.", "That was nearly something. Nearly. Try again with feeling.", "Mm, warm. Not hot. I'm {first}. I'll wait for hot."],
    },
    risque: {
      yes: ["Oh, I like you. You say what you want. I'm {first}, and you're in trouble now.", "Bold. Very bold. I'm {first}, and I'm not saying no.",
        "Mm. Somebody's sure of themselves. I'm {first}. Prove it."],
      no: ["Slow down. I like a chase, not a pile-up.", "Too much, too soon. I'm {first}. Buy me a conversation first.", "Ha. Not with that line. I'm {first}. Try one I haven't heard."],
    },
  },
  turn: {
    keen: {
      club: ["I've decided you're not leaving my sight tonight. Unless you give me a very good reason to text you.", "This is the most fun I've had in {venue}, and we've only talked. Imagine what else."],
      party: ["Your team can spare you for a few more minutes. I can't spare you at all, it seems.", "I'd like to see you somewhere without a sponsor's logo on every wall."],
      grid: ["Go and win your race. Then come and tell me all about it. Slowly.", "They'll take you away soon. I hate goodbyes. I prefer 'until later'."],
      hangout: ["I came out for a quiet evening. You're making me want a loud one.", "You've got my full attention now. Most people never manage that."],
    },
    polite: {
      club: ["You're sweet. But I'm looking for someone with a little more fire tonight.", "Mm. Not tonight, darling. Go and break someone else's heart."],
      party: ["You're charming. Just not my kind of charming. Enjoy your party.", "I'll let you work the room. It suits you better than I do."],
      grid: ["Off you go. Save the charm for the cameras.", "Go and drive. I'm going to find someone with less to concentrate on."],
      hangout: ["It's been pleasant. I'm going to go and look for something less pleasant.", "You're lovely. I'm in the mood for trouble, and you're not it."],
    },
    rushed: {
      club: ["My friends are dragging me to the next place, the cruel things. Say something quick and unforgettable.", "My car's outside. Normally I'd make it wait. For you I'd make it wait a minute."],
      party: ["My lift's leaving, and I hate leaving. Especially now. Be quick, be wicked.", "I'm due somewhere else. Give me a reason to arrive late and smiling."],
      grid: ["That's the warning. I'm being sent off the grid. Make the walk back worth it.", "They're clearing the grid, and I'd rather be cleared off with something to remember."],
      hangout: ["My friends are waiting outside. They can wait thirty seconds. What do you want?", "I have to go. I'm already late. Lateness is my love language. Talk."],
    },
    busy: {
      club: ["I'm here with my friends, and tonight's their night. Another time, gorgeous.", "My friends need me on the floor. Sorry. You'll survive."],
      party: ["I'm working tonight, believe it or not. Do enjoy the party.", "I've promised this evening to someone else's birthday. Goodnight."],
      grid: ["I'm actually here on business. My guests are wandering off. Excuse me.", "That's my group being herded off. Good luck. Try not to scratch the paint."],
      hangout: ["I'm meeting friends. They're very jealous and very punctual. Goodnight.", "I'm on my way out. I make a point of never turning back. Goodnight."],
    },
    taken: {
      any: ["I'd love to, but my partner's watching from over there, and they're the jealous type.", "Mm, I'm spoken for. I'm still allowed to look, though. So are you.",
        "I'm with someone. Annoying, isn't it? You'd have been fun."],
    },
    full: { any: ["I've watched you collect numbers all night. I'm not a souvenir.", "You've been busy. I like busy, but I don't share a queue."] },
  },
  end: {
    keen: {
      cold: { no: ["Walking away? Brave. Wrong, but brave.", "Mm. You'll think about this later. I'll make sure of it. Bye."] },
      passive: { yes: ["I thought you'd never ask. Here. I'm saved as something you won't want anyone to see.", "Of course. Give me your phone. Mm. Now you've got something to look at later."] },
      flirty: { yes: ["Smooth. Here. Text me tonight. Not tomorrow. Tonight.", "Phone. There. Don't keep me waiting. I'm terrible when I'm kept waiting."] },
      risque: { yes: ["Now that's an offer. Here's my number. Use it before I come to my senses.", "Mm. Give me your phone. And save me under something I'd blush at."] },
    },
    polite: {
      cold: { no: ["Ouch. Sulking doesn't suit you either.", "Cute. Goodnight."] },
      passive: { no: ["You too, sweet thing. Run along.", "Goodnight, {me}. Be good. Or don't."] },
      flirty: { yes: ["Persistence suits you. Fine. Give me your phone."], no: ["Mm, no. But I'll think about the way you asked."], need: 2 },
      risque: { yes: ["...Well. That changes things. Here. My number. Don't make me regret saying yes."], no: ["Tempting. Not tempting enough, darling. Goodnight."], need: 2 },
    },
    rushed: {
      cold: { no: ["Oh. Shame. I'd have given it to you.", "Fine, I'll go. You'll wonder about me all night."] },
      passive: { yes: ["Quick hands. Here. Mm. I'll be thinking about you in the car.", "Done. Text me something I'll want to read twice."] },
      flirty: { yes: ["You'll let me go? Generous. Here. Don't keep me waiting long.", "Mm. There. Now I've got something to smile about on the way."] },
      risque: { yes: ["Find me later. I'll be easy to find, and hard to forget. Here.", "Wicked. I like it. Number's in. Use it before sunrise."] },
    },
    busy: {
      cold: { no: ["Mm. Sharp. Goodnight.", "That's the spirit. Bye."] },
      passive: { no: ["Sweet. Goodnight, gorgeous.", "You too. Behave yourself."] },
      flirty: { no: ["Not tonight. Keep the thought warm.", "Another time. Maybe. If you're lucky."] },
      risque: { no: ["Darling, I'd already spotted you. It's still no.", "I'm sure you would. Goodnight."] },
    },
    taken: {
      cold: { no: ["Mm. Don't take it so hard.", "Right answer. Bye."] },
      passive: { no: ["Gracious. I like gracious. Goodnight.", "You're sweet. They'd like you. I like you. Goodnight."] },
      flirty: { no: ["Mm. Don't tempt me. Well. Tempt me a little.", "They are lucky. I remind them every day."] },
      risque: { no: ["Darling, I'm trouble that's already taken.", "Mm. I'll tell them. They'll keep a very close eye on me now."] },
    },
  },
  again: {
    say: ["Back for more? I admire the appetite. The answer's the same.", "Twice in one night. You're keen. I'm not."],
    end: ["Goodnight, gorgeous. Go and dazzle someone else.", "Mm. Still no. Still flattered."],
  },
};
