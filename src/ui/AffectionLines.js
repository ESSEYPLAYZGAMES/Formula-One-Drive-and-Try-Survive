// The words of ui/Affection.js - data only: the gesture menu's labels (sober and tipsy), the prompt's short labels, the
// body-language reads, what people say when they say yes, not yet or no, the letterbox captions of the two-shots, the
// moves the others make on their own (a hug hello, a tipsy lean, a hand to the floor, the kiss out of the blue), looking
// after someone who has had too much, a partner who saw, a grave week's quiet, and saying sorry.
// The line (the lead's): PG all the way - a hug, an arm round, holding hands, leaning together, a slow dance, a kiss on
// the cheek, a brief closed kiss on the lips. Never making out, groping or anything sexual. Words are warm, realistic and
// adult, never crude and never preachy: a read is body language, not a lecture. No jokes about injuries or crashes.
// Tokens: {first} the other person's first name, {o} him / her / them, {p} his / her / their, {me} your first name.
// Romance is only ever with the twelve invented stars (all women), so the romantic lines say 'her'; a driver is 'him'.

/** the gesture menu's rows: [sober, tipsy] by who ('star' | 'driver' | 'person'; a missing who falls back to 'star') */
export const AFF_LABEL = {
  touch: { star: ['A hand on her arm', 'A hand on her arm'], driver: ['Clap him on the back', 'Clap him on the back'], person: ['Shake hands', 'Shake hands'] },
  hug: { star: ['Hug her', 'Big hug'], driver: ['Hug him', 'Big hug'], person: ['A hug', 'A hug'] },
  side: { star: ['Put an arm round her', 'Arm round her'], person: ['Arm round for a selfie', 'Arm round for a selfie'] },
  lean: { star: ['Lean in together', 'Lean on her'] },
  sitLean: { star: ['Sit with her', 'Flop down beside her'] },
  hand: { star: ['Hold her hand', 'Grab her hand'] },
  reach: { star: ['Take her hand across the table', 'Take her hand across the table'] },
  arm: { star: ['Put your arm round her', 'Arm round her'] },
  cuddle: { star: ['Cuddle up', 'Cuddle up'] },
  sitCuddle: { star: ['Sit close and cuddle up', 'Sit close and cuddle up'] },
  close: { star: ['Hold her close', 'Pull her close'] },
  dance: { star: ['Dance close', 'Pull her in to dance'] },
  cheek: { star: ['Kiss her on the cheek', 'Kiss her cheek'] },
  kiss: { star: ['Kiss her', 'Just kiss her'] },
  bro: { driver: ['Bro-hug', 'Bro-hug'] },
  celebrate: { driver: ['Celebration hug', 'Celebration hug'], person: ['Celebration hug', 'Celebration hug'] },
  mates: { driver: ['Arm round his shoulders', 'Arm round his shoulders'] },
  selfie: { person: ['Arm round for a selfie', 'Arm round for a selfie'] },
  comfort: { star: ['A hug', 'A hug'], driver: ['A hug', 'A hug'], person: ['A hug', 'A hug'] },
  quietTouch: { star: ['A hand on her shoulder', 'A hand on her shoulder'], driver: ['A hand on his shoulder', 'A hand on his shoulder'], person: ['A hand on their shoulder', 'A hand on their shoulder'] },
  water: { star: ['Get her some water', 'Get her some water'], driver: ['Get him some water', 'Get him some water'] },
  seat: { star: ['Find her a seat', 'Find her a seat'], driver: ['Find him a seat', 'Find him a seat'] },
  stay: { star: ['Stay with her a minute', 'Stay with her a minute'], driver: ['Stay with him a minute', 'Stay with him a minute'] },
  car: { star: ['Get her a car home', 'Get her a car home'], driver: ['Get him a car home', 'Get him a car home'] },
  space: { star: ['Give her some space', 'Give her some space'], driver: ['Give him some space', 'Give him some space'] },
  sorry: { star: ['Say sorry', 'Say sorry'], driver: ['Say sorry', 'Say sorry'] },
  release: { star: ['Let go', 'Let go'], driver: ['Let go', 'Let go'] },
  none: { star: ['Not now', 'Not now'] },
};
/** the prompt's own label after G: at most 14 characters */
export const AFF_SHORT = {
  touch: { star: 'Hand on arm', driver: 'Back-slap', person: 'Handshake' }, hug: { star: 'Hug her', driver: 'Hug him', person: 'Hug' },
  side: { star: 'Arm round her', person: 'Selfie' }, lean: { star: 'Lean in' }, sitLean: { star: 'Sit with her' }, hand: { star: 'Hold her hand' },
  reach: { star: 'Take her hand' }, arm: { star: 'Arm round her' }, cuddle: { star: 'Cuddle up' }, sitCuddle: { star: 'Sit with her' }, close: { star: 'Hold her close' },
  dance: { star: 'Dance close' }, cheek: { star: 'Kiss her cheek' }, kiss: { star: 'Kiss her' }, bro: { driver: 'Bro-hug' }, celebrate: { driver: 'Celebrate', person: 'Celebrate' },
  mates: { driver: 'Arm round him' }, selfie: { person: 'Selfie' }, comfort: { star: 'A hug', driver: 'A hug', person: 'A hug' }, quietTouch: { star: 'Hand on arm', driver: 'Hand on arm', person: 'Hand on arm' },
  water: { star: 'Get her water', driver: 'Get him water' }, seat: { star: 'Find a seat', driver: 'Find a seat' }, stay: { star: 'Stay with her', driver: 'Stay with him' },
  car: { star: 'Car home', driver: 'Car home' }, space: { star: 'Give her space', driver: 'Give him space' }, sorry: { star: 'Say sorry', driver: 'Say sorry' }, release: { star: 'Let go', driver: 'Let go' },
};
/** the link's own words on the prompt line (WITH MIRA · HOLDING HANDS) */
export const AFF_LINKED = { side: 'ARM IN ARM', hand: 'HOLDING HANDS', lean: 'LEANING TOGETHER', arm: 'ARM ROUND HER', cuddle: 'CUDDLED UP', stay: 'SITTING WITH HER' };
/** how much she has had, in a word, for the menu's header */
export const AFF_DRINK_WORD = ['sober', 'merry', 'tipsy', 'had a lot', 'very drunk'];
/** the chips on the menu's rows */
export const AFF_CHIP = { warm: 'LEANING IN', mid: 'HARD TO READ', cool: 'RESERVED', imp: 'IMPULSIVE' };

/** the read at the top of the menu: body language, never a lecture (warm | mid | cool; hazy: she has had a lot; past: very drunk) */
export const AFF_READ = {
  warm: ['She keeps finding reasons to touch your arm.', 'She has drifted closer while you talked. She has not drifted back.', 'She is smiling at you like there is a joke only the two of you get.', 'Her shoulder keeps brushing yours, and she is not moving it.', 'She is looking at you a beat longer than she needs to.'],
  mid: ['She is friendly. Hard to tell what she is thinking.', 'Warm, easy - and giving nothing much away.', 'She laughs at your joke, then glances round the room.', 'Relaxed. Whether that means anything, you cannot tell.'],
  cool: ['She is angled away from you a little, arms folded.', 'Polite. A careful half-step of space between you.', 'Her answers are getting shorter.', 'She keeps checking her phone.'],
  partner: ['She leans back against you without looking, the way she does.', 'She catches your eye across the table and holds it.', 'She is half-listening to the room and wholly next to you.'],
  driver: ['He is in a good mood. Everyone is.', 'Easy company, as ever.', 'He is grinning about something.'],
  person: ['All business, but friendly with it.', 'Polite, professional.'],
  hazy: ['She is laughing at everything, and holding the table to do it.', 'Her eyes are bright and a little unfocused. She has had a few.'],
  past: ['She is swaying where she stands, and her words are running together.', 'She has had far too much. She needs looking after, not anything else.'],
  quiet: ['Nobody needs to say much tonight.', 'It is a quiet evening. That is all right.'],
  closed: ['She is keeping her distance for now. Give it a minute.', 'She has turned away for a moment. Give her a minute.'],
  wait: ['Not that - not right now. Give it a minute.', 'She is still smiling, but give it a minute before you try that again.', 'Give it a minute. She has not gone anywhere.'],
  drunk: "You can't read her.",
};

// ---- what they say -------------------------------------------------------------------------------------------------------
/** a yes, by gesture and by who ('star' | 'partner' | 'ex' | 'driver' | 'person'); tipsy: a looser line instead, now and then */
export const AFF_YES = {
  touch: { star: ['Mm?', 'Hey, you.', 'What is it?'], partner: ['Hey, you.', 'Mm.'], driver: ['Ha. Cheers, mate.', 'Alright?', 'Good to see you.'], person: ['Good to see you.', 'A pleasure.', 'Likewise.'] },
  hug: { star: ['Come here.', 'Oh, I needed that.', 'Hi. Hi!'], partner: ['There you are.', 'Hello, you.'], ex: ['...It is good to see you. It is.', 'Okay. Okay, that is nice.'], driver: ['Come here, you.', 'Good to see you, mate.'], person: ['Lovely to see you.'] },
  side: { star: ['Mm. Stay there.', 'That is nice.', 'Okay. I am stealing your warmth.'], partner: ['Mm. Hello.', 'Do not let go yet.'], person: ['Smile!', 'Three, two -'] },
  lean: { star: ['Comfy.', 'Do not move. You are a very good cushion.', 'This is nice.'], partner: ['Mm. Home.', 'Stay.'] },
  hand: { star: ['Lead the way.', 'Okay. Where are we going?', '...Hi.'], partner: ['Come on, then.', 'Lead on.'] },
  reach: { star: ['Look at you. Holding my hand at dinner.', '...Hi.', 'Careful. People will talk.'], partner: ['Hello, you.'] },
  arm: { star: ['Mm. That is nice.', 'Okay. Yes.'], partner: ['Mm.'] },
  cuddle: { star: ['Five minutes. Then I am getting up. Maybe.', 'This is dangerous. I could fall asleep.'], partner: ['Do not move. Ever.', 'Mm. Perfect.'] },
  close: { star: ['Hello.', '...Hi.'], partner: ['Hello, you.', 'I missed you today.'] },
  dance: { star: ['I thought you would never ask.', 'Okay. Do not step on me.', 'Slow one. Good.'], partner: ['Come here.', 'Our song. Probably.'] },
  cheek: { star: ['...Oh. Well.', 'Smooth.', 'That was sweet.'], partner: ['Mm. Missed.', 'You have lipstick on you now. Mine.'] },
  kiss: { star: ['...Well. Hello.', '...Okay. Yes. That.', 'I was wondering when you would.'], partner: ['Hello, you.', 'Mm. Again later.'] },
  bro: { driver: ['Brother.', 'Come here, mate.', 'Good stuff, mate.'] },
  celebrate: { driver: ['Get in!', 'What a day. What a DAY.', 'We did it, mate!'], person: ['Brilliant drive. Brilliant.', 'That is what we came here for.'] },
  mates: { driver: ['Look at us. Proper mates.', 'Get a picture of this.', 'Ha. Go on, then.'] },
  selfie: { person: ['Smile! Perfect. Tagging you.', 'One more - got it.'] },
  comfort: { star: ['...Thank you.'], driver: ['...Yeah. Thanks.'], person: ['Thank you.'] },
  quietTouch: { star: ['...Thanks.'], driver: ['...Yeah.'], person: ['Thank you.'] },
};
/** a yes when she is merry or tipsy: looser, louder, a bit slurred at the edges */
export const AFF_YES_TIPSY = {
  plat: ['Ohh, I love a hug. I love YOU. Not like that. Like - you know.', 'You are my favourite person here. Do not tell anyone.', 'Hiiii.'],
  rom: ['Mm. You are trouble. I like trouble.', 'Okay. Okay okay okay. Yes.', 'Is it hot in here or is it - no, it is you. Sorry. That was terrible.'],
  kiss: ['...Wow. Okay. Wow.', 'Do that again. No - wait. Yes.', 'Mm. I have been thinking about that all night.'],
};
/** not yet: a kind redirect (the hug she turns it into is shown; these are the lines) */
export const AFF_NOTYET = {
  plat: ['Ha - easy. Let me finish my drink first.', 'Hold that thought.'],
  rom: ['Slow down, you.', 'Not here.', 'Not yet. Ask me again in a bit.', 'Mm - maybe. Not right now.', 'You are sweet. Let us just talk a bit.'],
  kiss: ['Not yet. Ask me again in a bit.', 'Not here. Not like this.', 'Slow down, you. I like you. Slow down.'],
  secret: ['Not here. People are watching.', 'Not here - somebody will see.'],
  partner: ['Later. Too many people.', 'Not in front of everyone.'],
  drunkYou: ["You're sweet. You're also drunk. Water.", 'Ask me when you can say my name properly. Water first.', 'Not tonight - you are drunk, and I want you to remember it.'],
  hazy: ['Mm - no. I have had too much. Water?', 'I would - I would not remember it. Not tonight.'],
  hug: ['She turns it into a hug.', 'She laughs, and turns it into a hug.'],
};
/** no: she pulls back (by the reason that fits best) */
export const AFF_NO = {
  stranger: ['Whoa - no. We just met.', 'Excuse me? I do not even know you.', 'No. Absolutely not.'],
  general: ['Hey - no.', "I'm going to stop you there.", 'No. That is not - no.', 'Okay, that is too much.'],
  public: ['Not in front of all these people. No.', 'Are you serious? Here?'],
  rival: ['Your girlfriend is right there. No.', 'With her watching? No.'],
  drunkYou: ["No. You're drunk, and I'm going to go and find my friends.", 'No. Go and drink some water.'],
};
/** the night's first romantic yes, as a toast (and her name) */
export const AFF_TOAST = {
  firstYes: ['{first} is glad you did that.', '{first} is smiling now.'],
  no: '{first} pulled away. Give her a minute.',
  notYet: '{first} is not ready for that yet. Give it a minute.',
  wait: 'Give it a minute.',
  lost: 'You lose {first} in the crowd for a second.',
  notHere: '{first} lets go. Not here.',
  saw: '{first} saw that.',
  stepped: 'You stepped back. {first} is mortified, but it was the right call.',
  care: 'You are looking after {first}.',
  shot: 'A phone came up somewhere. Someone has that.',
  flash: 'A camera flash. Someone got a picture of the two of you.',
  hold: 'You are not in a state to read anyone tonight.',
};

// ---- the two-shots' captions (letterboxed) -----------------------------------------------------------------------------
export const AFF_CAP = {
  hug: { star: ['A proper hug. She holds on a second longer than you expect.', 'Her arms round your neck, a squeeze, and she lets go laughing.'], partner: ['She folds into the hug like she has been waiting all day.'], driver: ['A hug, a slap on the back, and he is grinning.'], person: ['A quick hug.'] },
  side: { star: ['She tucks in under your arm.', 'Your arm round her shoulders; hers slides round your waist.'], person: ['Arms round each other, the phone held up high. Click.'] },
  lean: { star: ['She leans into your shoulder.', 'She shifts closer until your shoulders touch.'] },
  hand: { star: ['Her fingers find yours.', 'You take her hand. She does not let go.'] },
  reach: { star: ['You take her hand across the table.', 'Your hand on hers, across the table. She turns her palm up.'] },
  arm: { star: ['Your arm along the back of the sofa, then round her. She settles in.'] },
  cuddle: { star: ['She settles against you, her head on your shoulder.', 'She curls in against your side, her head on your shoulder.'] },
  close: { star: ['You hold each other a moment longer than a hug.', 'Her arms round your neck, yours round her waist. Neither of you says anything.'] },
  dance: { star: ['A slow one. Her arms round your neck, yours at her waist, the room a blur round you.', 'You sway together, barely moving. She is humming along.'] },
  cheek: { star: ['A kiss on the cheek, light as anything.', 'You kiss her cheek. She goes a little pink.'] },
  kiss: { star: ['A kiss - brief, and sweet, and then she is smiling.', 'She tilts her face up. A kiss, soft and short. She laughs at something you said.'], partner: ['A kiss, easy and familiar.'] },
  bro: { driver: ['A back-slapping bro-hug.', 'Hands clasped, pulled in, two slaps on the back.'] },
  celebrate: { driver: ['A celebration hug, both of you grinning like idiots.'], person: ['A celebration hug. Nobody is pretending to be calm.'] },
  mates: { driver: ['An arm round his shoulders. Mates.'] },
  selfie: { person: ['Arms round each other, the phone held up high. Click.'] },
};
/** the dance close: its end card and the line if you just hold her */
export const AFF_DANCE = {
  end: ['Kiss her', 'Just hold her'],
  endHead: 'Her head is on your shoulder.',
  hold: ['You just hold her. She does not seem to mind.', 'You keep swaying long after the song has changed.'],
};

// ---- the moves they make themselves ------------------------------------------------------------------------------------
export const AFF_NPC = {
  greet: { star: ['{first} spots you and comes over for a hug.', 'A hug hello from {first}.'], partner: ['{first} slides an arm round you hello.'], driver: ['{first} pulls you into a bro-hug.', 'A handshake that turns into a hug - {first} is in a good mood.'] },
  greetBark: { star: ['There you are!', 'Hi! Come here.'], driver: ['Mate!', 'There he is!'] },
  hello: { cheek: ['{first} kisses your cheek hello.'], lips: ['{first} kisses you hello. Just a quick one.'] },
  celebrate: ['{first} grabs you in a hug the moment you walk in.', 'A celebration hug from {first}. Nobody is pretending to be calm.'],
  lean: ['{first} leans against you, an arm through yours.', '{first} steadies herself against you and stays there.'],
  leanBark: ['Hold still. The room is moving.', 'You are very solid. Has anyone told you that?', 'Five minutes. I just need a person to lean on.'],
  seatLean: ['{first} shifts along the seat until her shoulder is against yours.', '{first} rests her head on your shoulder, just for a minute.'],
  floor: ['{first} takes your hand and pulls you towards the floor.'],
  floorBark: ['Come on. Dance with me.', 'This one. Come on!', 'Do not make me dance on my own.'],
  cheek: ['{first} kisses your cheek, out of nowhere.', '{first} leans in and kisses your cheek.'],
  cheekBark: ['For luck.', 'Just because.', 'Do not read anything into that. Or do.'],
  hug: ['{first} throws her arms round you, out of nowhere.', '{first} pulls you into a hug, laughing.'],
  hugBark: ['I am just really happy you are here.', 'That is it. That is the hug.', 'Sorry. I am a hugger after two drinks.'],
  timeout: ['{first} straightens up and goes to find her drink.', '{first} gives your arm a squeeze and wanders off.'],
};
/** the kiss out of the blue: hers, and how you answer it */
export const AFF_BOLD = {
  cap: ['Out of the blue, {first} leans in and kisses you.', '{first} stops mid-laugh, looks at you, and kisses you.'],
  head: '{first} kissed you.',
  back: { cap: ['You kiss her back. A second, longer beat - then a hug, and she is laughing into your shoulder.'], her: ['...Okay. Good. I was worried you would be weird about it.', 'Well. That happened.'] },
  laugh: { you: ['...Blame the margaritas.', 'Wow. Okay. That was - wow.'], her: ['...Blame the margaritas.', 'Ha - sorry. Sorry! That was the champagne.', 'Okay, that one was on me. Pretend it did not happen.'] },
  step: { you: ['Hey - not like this.', 'Hey. Not like this. You have had a few.'], her: ['Oh God. Sorry. I am so sorry.', 'No - you are right. I am mortified.'] },
  partnerHint: 'G  Step back',
};

// ---- looking after someone who has had too much -----------------------------------------------------------------------
export const AFF_CARE = {
  water: { you: ['Here. Drink this. All of it.'], her: ['Water. You are a saint.', 'Ugh. Fine. Thank you.', 'You are a good one, you know that?'] },
  seat: { cap: ['You find her a seat and sit her down with a glass of water.', 'A seat, a glass of water, and a minute for the room to stop moving.'], bar: ['You find her a stool at the end of the bar and stay till she is steadier.'] },
  stay: { cap: ['You sit with her a while. Neither of you says much.', 'You stay with her until the room stops spinning for her.'] },
  car: { cap: ["You walk her out to a car. The hotel's driver will see her to her door.", "Out to the door, into a car, the driver's word that he will see her in. She waves at you through the glass."], driver: ["You walk him out to a car. The driver will see him to his door."] },
  friend: ['Good call.', 'Nice one. She needed that.', 'She is lucky you were here.'],
  deflect: ["I love you. Not like THAT. You're just - great.", 'You are so nice. Everyone is so nice. Where is my bag?', 'I am FINE. I am fine. Is the floor moving for you too?'],
};
/** the one you are seeing saw it (a bark from her) */
export const AFF_SAW = {
  partner: ['...Really? Right in front of me?', 'Okay. Wow.', 'I am going to pretend I did not see that.'],
  step: ['I saw you step back. Thank you.'],
  laugh: ['...We need to talk about your friend.'],
};
/** a grave week: a hand on the shoulder, a comfort hug - captions, slow, no frames */
export const AFF_QUIET = {
  touch: ['You put a hand on {p} shoulder. {first} nods.', 'A hand on {p} shoulder. Nobody needs to say anything.'],
  hug: ['{first} pulls you into a hug. Neither of you says anything.', 'A long hug. Neither of you says anything.'],
};
/** after a no: sorry (once), and giving her space */
export const AFF_SORRY = {
  you: ['Sorry. That was out of order.', 'I misread that. I am sorry.'],
  her: ['...Thanks. It is fine. Just - give me a minute.', '...Okay. Thank you for saying it.'],
  space: ['You give {first} some room.', 'You step back and leave {first} be.'],
};
