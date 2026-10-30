// The Ice - the phone after your race (stage 'any'): win, podium, points, bad (outside the points), dnf.
export default [
  // ---- win ----------------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-win-any-cold-1', on: 'win', stage: 'any', mood: 'cold',
    say: "Congratulations on {result}. I'm being brief, since brief is what you seem to like.",
    opts: [
      { tone: 'cold', t: "thanks", r: "Brief. Consistent, at least." },
      { tone: 'passive', t: "thank you. means a lot, actually", r: "Actually. That word again. It's doing a lot of work for you." },
      { tone: 'flirty', t: "celebrate with me and I'll say more", r: "Say it first. Then we'll see about the celebrating." },
    ],
  },
  {
    id: 'ice-text-win-any-passive-1', on: 'win', stage: 'any', mood: 'passive',
    say: "You won at {last}. I watched every lap and said nothing out loud. In my house, that's a standing ovation.",
    opts: [
      { tone: 'cold', t: "you could've texted during", r: "I don't text during. I watch. You'll learn the difference." },
      { tone: 'passive', t: "a silent ovation from you beats a loud one from anyone", r: "Good. It's the only kind I give. Treat it accordingly." },
      { tone: 'flirty', t: "come and give me the loud version", r: "The loud version is rare. Earn it again at {track}." },
    ],
  },
  {
    id: 'ice-text-win-any-flirty-1', on: 'win', stage: 'any', mood: 'flirty',
    say: "First place. You looked unbearably pleased with yourself up there. I approved, from a distance.",
    opts: [
      { tone: 'cold', t: "you could have come closer", r: "I could have. I didn't. Note the restraint.", opts: [
        { tone: 'cold', t: "restraint. noted", r: "Good. I'll keep noting yours." },
        { tone: 'passive', t: "fair. thanks for watching", r: "All of it. Even the dull laps. You owe me for those." },
        { tone: 'flirty', t: "restraint's overrated", r: "Says the one who won by braking later than everyone. Fine. Tonight." },
      ] },
      { tone: 'passive', t: "thank you. what did you think of the race?", r: "The start was reckless. The finish was elegant. Very like you.", opts: [
        { tone: 'cold', t: "the start was fine", r: "Fine. You nearly lost a wing. I nearly lost my composure." },
        { tone: 'passive', t: "the finish was the hard part", r: "It showed. Your shoulders went very still on the last lap. I watch for those things." },
        { tone: 'flirty', t: "and what about after the finish?", r: "After the finish is a separate review. Conducted in person. Tonight." },
      ] },
      { tone: 'flirty', t: "come closer tonight. I'll be less pleased with myself", r: "No. Stay pleased. It's a good look on you. I'll be there at nine.", opts: [
        { tone: 'cold', t: "might be busy with the team", r: "Of course. Winning makes you forgetful. I'll make other plans." },
        { tone: 'passive', t: "nine. I'll be there", r: "Nine. Not five past. You won today. Don't be late tonight." },
        { tone: 'flirty', t: "nine. bring the approving look", r: "I'll bring it. You'll have to earn the rest of my face." },
      ] },
    ],
  },

  // ---- podium -------------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-podium-any-cold-1', on: 'podium', stage: 'any', mood: 'cold',
    say: "Podium at {last}. Well driven. That's all, unless you'd like more.",
    opts: [
      { tone: 'cold', t: "that'll do", r: "Then that's all. I'm very obliging." },
      { tone: 'passive', t: "I'd like more, actually", r: "The middle sector was beautiful. You braked like you meant it. There. More." },
      { tone: 'flirty', t: "I always want more from you", r: "Then want. Wanting suits you after a podium." },
    ],
  },
  {
    id: 'ice-text-podium-any-passive-1', on: 'podium', stage: 'any', mood: 'passive',
    say: "{result}. Not the top step, but you stood on yours as though you owned the building.",
    opts: [
      { tone: 'cold', t: "not the top step though", r: "No. Sulk on the top step next time. It has a better view.", opts: [
        { tone: 'cold', t: "will do", r: "Good. I'll watch from a distance. As usual." },
        { tone: 'passive', t: "fair. it was a good race", r: "It was. Say that out loud to someone who isn't me. You'll believe it." },
        { tone: 'flirty', t: "watch me from the top step then", r: "Win, and I'll watch you from much closer than that." },
      ] },
      { tone: 'passive', t: "next time the top step", r: "Next time. Don't make me watch someone else on it.", opts: [
        { tone: 'cold', t: "no promises", r: "Sensible. Disappointing. Sensible." },
        { tone: 'passive', t: "you'll be there?", r: "At {track}. In the shade. Pretending I'm there for other reasons." },
        { tone: 'flirty', t: "watch only me", r: "Only you. It's become inconvenient." },
      ] },
      { tone: 'flirty', t: "were you watching me or the building?", r: "The building is dull. Draw your own conclusions.", opts: [
        { tone: 'cold', t: "it's a nice building", r: "It is. Go and have dinner with it, then." },
        { tone: 'passive', t: "glad you watched", r: "So am I. Don't tell the building." },
        { tone: 'flirty', t: "conclusion: you can't take your eyes off me", r: "Bold conclusion. Correct. Don't publish it." },
      ] },
    ],
  },
  {
    id: 'ice-text-podium-any-flirty-1', on: 'podium', stage: 'any', mood: 'flirty',
    say: "On the podium you sprayed the photographer instead of the others. I laughed out loud. In public. Unforgivable.",
    opts: [
      { tone: 'cold', t: "it was an accident", r: "Accidents are when you're most charming. Unfortunately." },
      { tone: 'passive', t: "glad I made you laugh, at least", r: "At least. As though laughing were small. It isn't, for me." },
      { tone: 'flirty', t: "I'll make you laugh in private next time", r: "In private. Ambitious. I'll keep my reputation. Mostly." },
    ],
  },

  // ---- points -------------------------------------------------------------------------------------------------------
  {
    id: 'ice-text-points-any-cold-1', on: 'points', stage: 'any', mood: 'cold',
    say: "{result}. You took the points and said nothing on the radio. Very like you, lately.",
    opts: [
      { tone: 'cold', t: "nothing to say", r: "Evidently. I'll be equally quiet. I've been doing it longer." },
      { tone: 'passive', t: "I was concentrating. decent race though", r: "It was. Solid. Solid is underrated. Solid is how bridges stay up." },
      { tone: 'flirty', t: "saved all my talking for you", r: "Did you. Then I'll expect a full report. In person." },
    ],
  },
  {
    id: 'ice-text-points-any-passive-1', on: 'points', stage: 'any', mood: 'passive',
    say: "{result}. Not a fireworks race. A good, sensible, grown-up drive. I approve of grown-up.",
    opts: [
      { tone: 'cold', t: "sensible. great", r: "You wanted fireworks. Fireworks end. Points stay. Think about it." },
      { tone: 'passive', t: "I'll take grown-up", r: "Do. It's very rare in your world. In mine as well." },
      { tone: 'flirty', t: "I can be less sensible after dark", r: "I have no doubt. Sensible first. The rest by appointment." },
    ],
  },
  {
    id: 'ice-text-points-any-flirty-1', on: 'points', stage: 'any', mood: 'flirty',
    say: "Points at {last}. You passed someone round the outside and I made a noise. Undignified. Your fault.",
    opts: [
      { tone: 'cold', t: "it was a standard move", r: "Standard. Then my standards are unusual. Thank you for the correction." },
      { tone: 'passive', t: "the outside pass? best bit of my day", r: "Mine too. You looked as if you knew it would stick. I like certainty." },
      { tone: 'flirty', t: "what kind of noise?", r: "Not a word. A sound. You'll never hear it again. Unless you do that again." },
    ],
  },

  // ---- bad: outside the points --------------------------------------------------------------------------------------
  {
    id: 'ice-text-bad-any-cold-1', on: 'bad', stage: 'any', mood: 'cold',
    say: "{result} at {last}. I'm not going to ask how you are. You'd only say 'fine'.",
    opts: [
      { tone: 'cold', t: "fine", r: "And there's the word. I'll leave you to it.", opts: [
        { tone: 'cold', t: "appreciated", r: "You're welcome. That's the whole conversation, then." },
        { tone: 'passive', t: "ok. not fine. annoyed", r: "Annoyed is better than fine. Fine is a locked door." },
        { tone: 'flirty', t: "fine-ish. better if you called", r: "Tonight, nine. I'll do the talking. You'll do the sulking." },
      ] },
      { tone: 'passive', t: "not fine. frustrated. but thanks", r: "Frustrated is honest. Honest I can do something with. Dinner, Thursday.", opts: [
        { tone: 'cold', t: "not hungry", r: "You will be by Thursday. I'm booking anyway." },
        { tone: 'passive', t: "thursday. thank you", r: "Don't thank me. Be on time. That's thanks enough." },
        { tone: 'flirty', t: "thursday. you're good at this", r: "At what? Don't answer. I know. I'm good at most things." },
      ] },
      { tone: 'flirty', t: "I'd say better if you came over", r: "Recovering already. Good. Another night. Sleep.", opts: [
        { tone: 'cold', t: "fine, I'll sleep", r: "Sleep. You'll be less impossible in the morning." },
        { tone: 'passive', t: "fair. tomorrow?", r: "Tomorrow. Bring the bad mood. I'll take it off your hands." },
        { tone: 'flirty', t: "sleep's better with you", r: "Very likely. Still no. Ask me after a better result." },
      ] },
    ],
  },
  {
    id: 'ice-text-bad-any-passive-1', on: 'bad', stage: 'any', mood: 'passive',
    say: "Outside the points today. It happens. I've seen you drive better and look worse. Neither lasts.",
    opts: [
      { tone: 'cold', t: "don't need a pep talk", r: "It wasn't one. I don't give them. It was an observation. Ignore it, if you like." },
      { tone: 'passive', t: "thanks. needed that", r: "I know. That's why I wrote it carefully. Get some sleep." },
      { tone: 'flirty', t: "so you've been looking at me", r: "Closely. Even on bad days. Don't make a habit of the bad days." },
    ],
  },
  {
    id: 'ice-text-bad-any-flirty-1', on: 'bad', stage: 'any', mood: 'flirty',
    say: "{result}. The car was dreadful. You weren't. I watched you fight it the whole way.",
    opts: [
      { tone: 'cold', t: "no points. that's all that counts", r: "Points aren't the only score. You'll realise that about the time you stop sulking." },
      { tone: 'passive', t: "it was a fight. thanks for noticing", r: "Of course I noticed. Fighting suits you. Losing doesn't. Rest." },
      { tone: 'flirty', t: "you watched me the whole way?", r: "Every lap. My tea went cold. I don't let my tea go cold." },
    ],
  },

  // ---- dnf: crashed out or retired ----------------------------------------------------------------------------------
  {
    id: 'ice-text-dnf-any-cold-1', on: 'dnf', stage: 'any', mood: 'cold',
    say: "Out at {last}. The car gave up before you did. Say something, so I know you're grumpy and not silent.",
    opts: [
      { tone: 'cold', t: "rather not talk about it", r: "No need. I'll be here, saying nothing, efficiently." },
      { tone: 'passive', t: "grumpy. very grumpy", r: "Good. Grumpy recovers. Silent festers. Eat something." },
      { tone: 'flirty', t: "grumpy. come cheer me up", r: "Cheering isn't my medium. Distracting is. Tomorrow." },
    ],
  },
  {
    id: 'ice-text-dnf-any-passive-1', on: 'dnf', stage: 'any', mood: 'passive',
    say: "A short afternoon at {last}. They happen to the best, I'm told. Come for tea. I'll be insufferably calm.",
    opts: [
      { tone: 'cold', t: "not in the mood for tea", r: "Then don't come. The tea won't mind. I'll mind slightly." },
      { tone: 'passive', t: "it was the car, not me", r: "I know. I watched the replay. It was very clearly the car. Your face was very clearly you." },
      { tone: 'flirty', t: "insufferably calm sounds perfect", r: "It is perfect. Arrive grumpy. Leave less so. That's the service." },
    ],
  },
  {
    id: 'ice-text-dnf-any-flirty-1', on: 'dnf', stage: 'any', mood: 'flirty',
    say: "You're out of the race and I'm out of patience with that car. Come and be annoyed at me instead.",
    opts: [
      { tone: 'cold', t: "I'd be bad company tonight", r: "You usually are, after a retirement. The offer doesn't expire. It does cool.", opts: [
        { tone: 'cold', t: "let it cool", r: "Then it cools. I'll be asleep by ten." },
        { tone: 'passive', t: "tomorrow? I'll be better company", r: "Tomorrow. Lunch. You're pleasanter fed." },
        { tone: 'flirty', t: "warm it up again in an hour", r: "An hour. I'll be the one in the window, pretending not to watch the street." },
      ] },
      { tone: 'passive', t: "thanks. later tonight?", r: "Later. I'll be up. I don't sleep after a bad race. Yours, I mean.", opts: [
        { tone: 'cold', t: "maybe. depends how I feel", r: "Depends. Then I'll leave the door unbolted and my expectations low." },
        { tone: 'passive', t: "ten o'clock?", r: "Ten. Bring nothing. Especially not the mood." },
        { tone: 'flirty', t: "you lose sleep over my races?", r: "Only the bad ones. And the good ones. Don't make me list them." },
      ] },
      { tone: 'flirty', t: "annoyed at you? I can do that very closely", r: "Very closely is the only way I allow it. The door's open.", opts: [
        { tone: 'cold', t: "actually, I need to be alone", r: "Then be alone. I'll be here when you're done being it." },
        { tone: 'passive', t: "coming. I'll be quiet", r: "Be quiet. I'll be quieter. It'll be the best conversation you've had all day." },
        { tone: 'flirty', t: "leaving now. prepare to be glared at", r: "I'll glare back. I've been practising since lap twelve." },
      ] },
    ],
  },
];
