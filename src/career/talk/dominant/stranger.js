// DOMINANT - the first meeting with a stranger in a crowd (ui/StrangerTalk.js): commanding, assertive, competitive; she
// takes the lead before you have finished saying hello, and respects someone who pushes back. Interested, she does
// not wait to be asked: she takes your phone. A risque answer is allowed with her at a first meeting (she sets its
// pace). Never a threat, never coercion: a no from you ends it. Plain data, no imports. The shape is
// spark/stranger.js's (its header has the keys).
export const DATA = {
  open: {
    club: [
      "You. Come here. I've watched you hover by the wall long enough.",
      "You've been building up to this. Stop building. Talk.",
      "I'll save you the trouble. Yes, you can stand here. No, I won't move over.",
      "I've decided you're the most interesting person in {venue}. Don't prove me wrong.",
    ],
    party: [
      "You're the driver. Good. Stand with me. I've been fielding bores all evening.",
      "I don't wait for people to come over, normally. You're lucky I was patient.",
      "You drove well today. You'll drive better next time if you listen to me.",
      "I'm told you're the person to meet tonight. Convince me.",
    ],
    grid: [
      "You're late back to your car. I like a driver who takes risks.",
      "Stand still. I want a proper look at the one they're all cheering for.",
      "You've got three minutes. That's two more than most people get with me.",
      "Eyes up. You'll want to remember who wished you luck properly.",
    ],
    hangout: [
      "You're standing in the best spot in {venue}. Either share it or fight me for it.",
      "Sit. I've ordered for the table and I've ordered far too much food.",
      "You came in like you own the place. I own the place. Metaphorically. Sit down.",
      "I don't usually let strangers interrupt my evening. I'm making an exception. Use it.",
    ],
  },
  react: {
    cold: {
      yes: ["Good. You don't fawn. I'm {first}. I think we'll get on.", "Ha. You push back. I like that. I'm {first}.", "Not easily impressed? Neither am I. I'm {first}. Let's see who cracks first."],
      no: ["That isn't cool. That's just closed. I don't have time for closed.", "Try that again with a bit more spine and a lot less sulk.", "Hm. I've met friendlier pit walls."],
    },
    passive: {
      yes: ["Good. Direct, polite, no fuss. I'm {first}. You'll do.", "Hello, {me}. I'm {first}. You've got manners. Keep them.", "I'm {first}. That's the right way to start. Most people don't know it."],
      no: ["Hello. Yes. I'm {first}. Is that all you've got?", "Mild. Too mild. I'm {first}. Speak up next time.", "Fine. I'm {first}. I was expecting more from someone who drives for a living."],
    },
    flirty: {
      yes: ["Confident. I like confident. I'm {first}, and I'm keeping you a bit longer.", "Bold of you. Right answer, though. I'm {first}.", "Good. You don't waste time. Neither do I. I'm {first}."],
      no: ["Smooth. Too smooth. I prefer people who mean it. I'm {first}.", "I'll decide when we're flirting. Not yet. I'm {first}.", "Easy, tiger. I set the pace here. I'm {first}."],
    },
    risque: {
      yes: ["Oh, you're trouble. Good. I'm {first}. I handle trouble very well.", "Ha! Brave. I'll match that. I'm {first}.", "Now you've got my attention. All of it. I'm {first}."],
      no: ["Too fast. I lead, you follow. That's how this works. I'm {first}.", "Not so quick. You'll have to earn that line. I'm {first}.", "Down, driver. I'm {first}. Start again, slower."],
    },
  },
  turn: {
    keen: {
      club: ["Here's what's going to happen. I'm getting your number, and I'm going to use it.", "I've made up my mind about you. That doesn't happen often. Don't waste it."],
      party: ["I'm taking you to dinner some time. Not tonight. Properly. Are you free?", "You've earned the rest of my evening. That's not nothing."],
      grid: ["Go and win. Then you're telling me about it over dinner. I've decided.", "They'll call you any second. Before they do, I want a way to reach you."],
      hangout: ["I'm enjoying this. I don't enjoy many things I didn't plan. What's next?", "Right. I like you. I'm not going to pretend otherwise. Your move."],
    },
    polite: {
      club: ["That's enough. Go and enjoy your night. I'll enjoy mine.", "You're pleasant. I don't do pleasant. Goodnight, {me}."],
      party: ["Go and circulate. You're better at it than you are at this.", "I'll release you back to your team. They look lost without you."],
      grid: ["Go. Focus. You need it more than you need me.", "Your team is waving. Don't keep them waiting on my account."],
      hangout: ["I'm going back to my table. Enjoy your night off.", "That's my curiosity satisfied. Goodnight."],
    },
    rushed: {
      club: ["My friends are leaving, and I'm the one who organised the night. I hate leaving early. Be quick.", "I have a meeting at seven. I should have gone an hour ago. Tell me why I stayed."],
      party: ["I'm due on a call with Tokyo in ten minutes. Make the most of nine of them.", "My car's outside. I don't keep anyone waiting. Except, apparently, for you."],
      grid: ["They're clearing guests off. I don't get moved on easily. You've got one minute.", "That's the board. Go and get in your car. But not before you've done one thing."],
      hangout: ["I'm expected somewhere else. I'm never late. I'm about to be. Speak.", "My friends are ready to leave, and I set the time myself. Typical. Be quick."],
    },
    busy: {
      club: ["I'm hosting this table tonight. I can't neglect it. Goodnight.", "My friends need organising. They always do. Excuse me."],
      party: ["I'm working, believe it or not. I planned half of this. Excuse me.", "I have to go and give a speech. Not yours. Mine. Goodnight."],
      grid: ["I'm running a group of guests, and they're scattering. Duty. Good luck today.", "I'm needed back with my people. Drive well."],
      hangout: ["I'm leaving. When I say I'm leaving, I leave. Goodnight.", "I'm meeting someone important in twenty minutes. Not you. Goodnight."],
    },
    taken: {
      any: ["I should be clear: I'm with someone. I'm loyal. I'm also flattered. Both.", "My partner's over there. I don't play games with people I care about.",
        "I'm taken, and I'm not the sort who forgets it. You're good company, though."],
    },
    full: { any: ["I've watched you work this room. You're spreading yourself thin. I don't do thin.", "You've asked every second person in here. I'm not a second anything."] },
  },
  end: {
    keen: {
      cold: { yes: ["You think I'm going to let you walk off? No. Phone. ...There. I'll call you.", "Wrong answer, but I'll overrule it. Give me your phone."] },
      passive: { yes: ["Good. Phone. I'm putting it in myself. You'll hear from me.", "Yes. Here. Answer when I call. I don't leave voicemails."] },
      flirty: { yes: ["Of course you're not. Here. Saved. You'll be hearing from me first.", "Good instinct. Phone. Done. Don't make me chase you."] },
      risque: { yes: ["Mm. Bold. Here's my number. I'll decide what happens with it.", "You'll get the number. The rest, I'll think about. Here."] },
    },
    polite: {
      cold: { no: ["Maybe it is. Goodnight.", "Hm. A little bitter. Goodnight."] },
      passive: { no: ["Likewise. Take care of yourself, {me}.", "Good. A clean exit. I respect that."] },
      flirty: { yes: ["...You don't give up. Fine. That counts for something. Phone."], no: ["No. Asking twice doesn't change my answer. Goodnight."], need: 3 },
      risque: { no: ["You would have tried. Goodnight, {me}.", "Bold to the last. Still no."] },
    },
    rushed: {
      cold: { yes: ["Don't tell me what to do. Give me your phone. ...There. Now I'll go.", "Ha. No. You're getting my number first. Done. Now I'll go."] },
      passive: { yes: ["Quick and clear. Good. Here. I'll be in touch.", "Yes. Saved. Don't lose it."] },
      flirty: { yes: ["You'll let me go? I'll go when I'm ready. Here. Now I'm ready.", "Fine. Here. You'll be hearing from me sooner than you think."] },
      risque: { yes: ["I'll find you, actually. But here's the number anyway. Insurance.", "You'll tell me what I missed over dinner. Here."] },
    },
    busy: {
      cold: { no: ["Good. Goodnight.", "Understood. Bye."] },
      passive: { no: ["Thank you. And good luck with the rest of it.", "You too. Go well."] },
      flirty: { no: ["Another time, perhaps. I'll decide when.", "Not tonight. My diary's full."] },
      risque: { no: ["I'll be the judge of that. Goodnight.", "Unlikely. But I admire the confidence. Goodnight."] },
    },
    taken: {
      cold: { no: ["Yes, I should have. Goodnight.", "Fair. I'd have said the same."] },
      passive: { no: ["Gracious. Good. Goodnight.", "Thank you. That was well handled."] },
      flirty: { no: ["They are. I make sure of it.", "Careful. They're very competitive. So am I."] },
      risque: { no: ["I'm already busy with trouble of my own. Goodnight.", "They keep a close enough eye. Goodnight, {me}."] },
    },
  },
  again: {
    say: ["We've done this. My answer stands. I don't change my mind.", "Back again? I admire the effort. The answer hasn't moved."],
    end: ["Goodnight. Properly, this time.", "Go on. Enjoy the rest of your night."],
  },
};
