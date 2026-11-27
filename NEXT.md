# V2.95 (2026-11-27): Hell's sound no longer drops out; the fall at the gates works again

Asked for: "also in hell all the sounds go silent from lag half the time and only like some voice lines get thru the
silence".

## Why it went quiet
- The pre-scare silence only pulled out the bed (drone, choir, risers), and for too long: a blackout cut it for 5-6 s
  every half minute, a lunge for 2.4 s - while voices, rats and footsteps carried on over the gap. That is the "only
  some voice lines get through".
- The audio thread was overloaded: every footstep, click and creak made its own HRTF panner (the costliest node there
  is), with up to twelve creatures stepping every third of a second; no limit on voices at once; finished sounds never
  disconnected; nine listener values and fourteen riser values rescheduled every frame; a 3.6 s stereo reverb.

## The fix (audio/AfterSound.js, ui/Afterlife.js)
- A TALK bus beside the bed: a silence now takes both out together - a real silence - and comes back quickly (blackout:
  only while it is dark; lunge 0.9-1.6 s). The scare's own sounds (the breath at your neck, the steps circling you in
  the dark, the stinger, the shriek, the dolls' screeches, the grab's NO) go round it. No new echo starts in a silence.
- At most 14 voices at once; past that a new one is not started (the scare's own always are).
- Equal-power panning by default; HRTF only for the close, behind-you sounds.
- Finished voices, steps, clicks, creaks, rattles, squeaks and clangs disconnected after they end.
- The listener set only when the camera moved; the risers set directly; drone, chant, machine and riser levels only
  rescheduled when they change. Reverb tail 2.6 s.
- Footfalls from the two nearest unseen creatures only; rat squeaks at least 0.3 s apart.

## Fixed
- The false Heaven's hush at the gates: a comment had swallowed the line that starts the fall, so the hush fired every
  frame (more silence) and the drop never began. The fall plays end to end again.

# V2.94 (2026-11-27): the voices urgent and many; the destination a surprise; Heaven's choir; the menu fixed

Asked for: "still messed it up and add a choir to heaven (pre-hell and real)", then "MAKE THE robotic voice overlap and
be more urgent, try different robo voices ... make them really urgent and screams and stop showing the track between
hell cutscenes during loading ... dont reveal heaven or hell before the surprise drop ... remove that stupid 'the
reckoning' low quali balance".

## The voices (audio/AfterSound.js)
- Six machines now, not one: GRIND (a throat ring-modulated into metal), BUZZ (a square wave crushed to a few steps,
  ringing high - a broken intercom), WHISPER (breath through the vowels, no pitch - a voice made of static), CHOIR (three
  throats a quarter-tone apart and an octave down - many mouths at once), GLITCH (every syllable stuttered, the pitch
  jumping - a recording skipping), SHRIEK (high, tearing, the vibrato wide).
- URGENT: faster, louder, hard attacks, the pitch climbing through the line (panic) instead of falling.
- THE MOB: one line said by several machines at once, a fraction apart, at different pitches, from different places.
- Hell's recalled arguments: theirs shouted by two or three machines over each other, yours a panicking skipping
  recording, the next line cutting in before the last is done, screams torn through the middle. The exorcism's taunts
  shouted by mobs that grow as it builds; a spirit torn out shrieks and a choir of them howls NO; the drop's shouting
  and your name screamed by mobs of four.

## The surprise
- The Reckoning (the scales and the verdict) is gone: after the candle you are simply in Heaven - or what looks like
  it - and find out which there. (The HELL / HEAVEN code works up to the end of the candle.)
- Black under the whole of a death, from the end of the news until the career is back: nothing of the circuit seen
  between the scenes or while the next one loads.

## Heaven's choir
- Six voices singing 'ah' in a cathedral's air, each breathing on its own, moving gently through a long progression.
  In the false Heaven the same choir holds one chord, perfect, forever - and slides out of tune as the faces come; at
  the gates it is cut off mid-note. Drawn far back while an exorcism is done.

## The race caret's menu
- Its lines now wrap inside the glass (the hub's buttons had stopped them wrapping); the menu is wider.

# V2.93 (2026-11-27): the driver hub's menus readable, in neon; the HELL / HEAVEN code

Asked for: "fix this issue rn make it actually visible and neon" (the race caret's menu: pale text on white) and "Put a
secret develop code to make my hell points max so im guaranteed hell (same for heaven) how about i just type HELL while
in the death cutscene for it".

## The menus off the driver hub's bar (ui/DriverHQ.js)
- The race caret's menu and the gear's were white panels whose text the hub's dark skin had turned pale - unreadable.
  Now a pane of dark glass with a neon tube round it (pink into violet into cyan, glowing, a lit bar along the top):
  titles in white with a pink glow, the lines under them in lilac, notes in pink, the hovered row lit in a pink-to-cyan
  wash, Abandon career in red. In every colour theme.

## The code (main.js)
- While your driver's death plays out - the fire, the news, the candle, the Reckoning - type HELL and you go to Hell,
  or HEAVEN and you go to Heaven, whatever the scales said (the verdict pushed to the very bottom or top of them). It
  answers with a low toll and a red wash (Hell) or a chime and a white one (Heaven). Typed before the Reckoning, the
  Reckoning shows it; typed during it, the afterlife follows it. Nothing happens at any other time.

# V2.92 (2026-11-27): scarier per scare - the sound designed, each fright set up and paid off

Asked for: "not just more stuff but higher level of scariness per thing, smart sound design".

## The sound (audio/AfterSound.js)
- SPACE: a long dark reverb, generated - Hell rings like a cave, every sound coming back off rock you cannot see; the
  false Heaven like a hall.
- WHERE: sounds placed in the space round you (HRTF - in front, behind, either side, how far), your ears on the camera:
  their footfalls - heavy, slow, a scrape after each - from exactly where each one is as it comes for you unseen; their
  necks creaking and clicking where they stand; the breath at your back.
- SILENCE: the bed of sound (drone, choir, machine, hums, tones) on a gain of its own, pulled out from under you all at
  once before a fright - the moment of nothing that tells you something is coming.
- THE INTAKE: a breath of air drawn backwards, rising to nothing - and the hit lands exactly where it stops.
- THE SHEPARD TONE: octaves gliding up forever, never arriving - the tension in Hell, louder and faster the nearer one
  of them is while you cannot see it; and, falling into Hell, the same tone falling forever.

## The frights, one by one
- THE LUNGE, from behind: it reaches the back of your eyes - everything goes quiet; its breath, its neck creaking, at
  the back of you; you cannot move; the camera brought round to it - and its face, on the hit. (In front of you, it is
  just on you: silence, the intake, its face.)
- THE BLACKOUT: the light goes and all the sound with it; something walking round you in the dark, its footfalls going
  round, exactly where; the light comes back - and it is right in front of you, still, silent, staring, your heart
  going; the light goes again; it is gone. No stinger at all.
- The background frights back to being rare, so each one lands: the flashed face 14-28 s, the whisper 15-29 s, the one
  at the edge of the light 20-35 s, the blackouts 24-45 s, the recalled arguments with room between them.
- THE DROP: the hush - every sound gone, not just the tone; the intake drawn in through it - and the grab lands on the
  hit; the fall with its tone falling forever under it; a breath of nothing just before the bottom; the impact.
- THE FALSE HEAVEN: the rising tone coming up, faintly, under its one pure note as the faces come.
- THE EXORCISM: everything gone quiet before the doll's head comes up, the intake into it; a riser climbing through the
  whole fight; a drop-out of half a second, then the face out of it; and at the end, in the quiet, the heart stopping,
  nothing, the intake - and the last scare.

# V2.91 (2026-11-27): the drop five times worse, Hell twice, Heaven ten times better

Asked for: "make the drop 5 x scarier, hell twice as scary - make everything individually worse and more vigorous and
make heaven 10 x nicer".

## The drop (ui/Afterlife.js: hush, grab, the wrestle, the fall, the impact)
- THE HUSH: at the gates everything stops - the tone gone, dead silence - and every face in that Heaven slides in to
  stand round you in a ring at the height of your eyes; the golden gates swing shut in front of you and slam.
- THE GRAB: twenty-two arms out of the floor all round you, and a face up out of the floor straight into yours - the
  stinger, a scream, the screen torn red.
- THE WRESTLE: yanked this way and that, again and again, red flashing, voices shouting at you from everywhere (GET
  DOWN, MINE, LIAR...), your own name screamed, a second stinger and the face flashed on the screen.
- THE FALL: dragged down a shaft of flesh - veined, wet, faces set in its walls, arms reaching out of them - falling
  faster and faster, tumbling, a red light falling with you, Heaven's light dying above, the choir and the machine
  rising out of the dark.
- THE IMPACT: a last stinger; black; then Hell.

## Hell, twice as bad, every part of it
- Twelve of them instead of seven, faster (8 m/s far, 3.9 near), reaching you from further (4.3 m), back sooner after a
  lunge (7-14 s), each lunge a double stinger; their faces in the dark doubled (96), nearer.
- The fog closer (4-52 m), the drone louder; the light flickering twice as often and going out twice as often, for
  longer; the face on the screen, your name in your ear, the one at the edge of the light - each twice as often; the
  recalled arguments coming back to back.
- Rats nearly doubled (320, in 12 packs); blood pools 64, the hanging dead 22, the heaps of bones 16.
- The exorcism: eight spirits torn out instead of six (eight floods of rats), a longer fight, every joint thrown about
  half as hard again, the screeching, the flashed face and the head spinning round each about twice as often.

## Heaven, ten times better (ui/HeavenLife.js)
- God's light in great soft rays slanting down through the air, a low warm sun, a radiance beyond the open gates and a
  rainbow standing over them.
- Meadows on banks of cloud all along the way - 3,200 flowers in white, blush, gold and lilac; twelve trees in white and
  pink blossom with petals drifting down off them; sixteen doves wheeling overhead; a still lake shining with the sky.
- Still silent (as asked for before).
- The false Heaven has all of it too - and all of it stopped: the doves held mid-wingbeat, the petals hanging in the air.

# V2.90 (2026-11-27): the way into Hell is through Heaven

Asked for: "Make the intro to hell be heaven, uncannily perfect - then you see the faces and you are grabbed and wrestled
into the depths - right before the pearly gates and your life is ruined - introducing hell".

## The false Heaven (ui/Afterlife.js, o.fake)
- When the scales send you down, the afterlife does not open on Hell: it opens on HEAVEN - the clouds, the marble way,
  the pillars of light, the golden gates open at the end. Only too perfect: nothing moves (not a cloud), the newspapers
  stand in exact pairs along the way, all of them the same front page - "<YOUR NAME> WAS A GOOD PERSON", "Everyone
  agrees. Everyone agrees. Everyone agrees." - and instead of Heaven's silence, one thin pure tone hanging in the air.
- Walk towards the gates and the faces come: pale masks in the clouds, along the way, then behind the gates' bars,
  more of them the nearer you get; the tone souring as they do, a breath somewhere close.
- Right before the gates (or if you will not walk on): black arms burst out of the floor all round you - the stinger, a
  scream, the screen torn red - and you are held, wrestled, and dragged down through the floor of Heaven as its light
  goes out above you, the faces coming down with you, into black. Then: HELL.
- SPACE: straight to the grab; again, straight on into Hell.

# V2.89 (2026-11-26): Hell you can get lost in; an exorcism hard to watch; death skippable, no leaderboard

Asked for (two messages): "In hell you hear snippets of conversation ... robotic and scary recalled snippets like
someone arguing and in heaven you hear nothing, but see the newspapers praising you. The exorcism should be a hard to
watch scene with great cacophony of robotic noise, chanting picking up into multiple phrases of disgust all layered at
once while the new life shakes vigorously and finally in a great conclusion all fizzles down... weak and frail picking
up as the demons enter and leave as they like." Then: "remove all the yappy text and make it more audio based. add
hellish extremely scary creatures ... that stare at you, make it less linear and more gory/visceral scenes. especially
the exorcism. rats and all. Make each scene of the death cutscene (including the first person fire cutscene) skipable -
no buttons, just space bar - and remove the ability to see the leaderboard after death".

## Death: SPACE through it, nothing to read, no leaderboard
- SPACE skips each scene, no buttons anywhere: the accident replayed through your eyes (into the fire), the fire (into
  the dark), the news, the memorial cards, the candle (no HOLD TO LEAVE button: SPACE lets the flame go out, or it goes
  out by itself), the Reckoning (on by itself after the verdict), and the end of the exorcism once it is decided.
- No leaderboard once you are dead: the timing tower and the HUD are gone from the moment your driver is killed, and a
  race you died in has no results screen after it (a quick race goes back to the menu; a career to the afterlife).
- The Reckoning keeps the scales, the deeds and the verdict; the paragraph explaining it is gone.

## Hell (ui/Afterlife.js, ui/HellLife.js)
- Not a way any more: an open, round dark of rock and lava, close fog, no path and no arch to walk to. The portals of the
  drivers you could become are somewhere in it, spread round you - each with a dim red column of light over it and a hum
  of its own (a low beating chord), louder as you near it and panned to where it is: you find them by ear.
- THEY are there. Tall, too thin, black, arms hanging past their knees with long fingers, a long neck, a pale mask of a
  face - hollow eyes weeping dark, a slit of a mouth - under black tendrils. Their heads turn to follow you, all the way
  round. They do not move while you look at them; look away and they come closer (fast when far, creeping when near).
  Close to one: its breathing, its joints clicking as it twitches. Too close: it is in your face - a shriek, the screen
  torn red - and then gone, somewhere else in the dark.
- The damned on chains from the dark, swinging, dripping into pools; blood pooled and smeared over the rock; heaps of
  bones and skulls; packs of rats running over it all, scattering from you, squealing when you are near.
- The arguments you were in (career/Echoes.js) come out of the dark round you as sound only now: robotic voices,
  accusing and answering, talking over each other - no words on the screen.
- Hardly any text: the keys (W A S D, E) for a few seconds, a driver's name and E at their portal.

## Scarier (asked for: "make it 10x scarier")
- HELL is on tape: grain, scanlines, a dark vignette, tracking bars rolling through, the picture tearing (shifted,
  skewed, the colours wrong) at every scare.
- Faces in the dark: pale masks hanging in the fog at head height all round, watching - fading as you come near.
- Your own heartbeat, faster the closer they are, your breath catching when one is near; the light flickering, and now
  and then going out altogether (only the faces left), a long breath somewhere in the black; your name whispered in one
  ear; the mask flashed on the screen for a frame (sometimes inverted); one of them standing still at the edge of the
  light ahead of you, gone the moment you have looked at it. One that reaches you: the stinger with its shriek.
- The exorcism: the face inside flashed on the screen again and again through the fight; the doll's head turned right
  round with a crack; the watchers closing in on you from behind it until they stand at either side of you; and when it
  is over and quiet, its head comes up at you one last time - a last stinger.

## Heaven
- Silent. The newspapers that praised you drift along the marble way (bigger now), their front pages your headlines
  (career/Echoes.js headlines: what you did, what you won); no text over the screen.

## The exorcism: no minigame - watched (ui/Exorcism.js, ui/HellLife.js doll, audio/AfterSound.js)
Asked for after: "add jumpscares with hugely loud and shocking sounds with genuinely visceral scenes when you try an
exorcism, remove the minigame for exorcisms and make it more just their bodies rattling and screeching and resisting.
Dolls of the next players that are possessed with monsters and jumpscares".
- The drivers you could become hang in their portals as DOLLS: ball-jointed porcelain in their racing suits (the
  team's colours, their number on the chest), on a marionette's strings, swaying, twitching now and then.
- No circle, no keys, no words: you walk into a portal (E) and watch. The doll hangs still, head down - then its head
  snaps up at you: the face cracked and weeping black, the eyes black and lit from inside, the jaw dropped - and the
  first scare, a stinger as loud as the game goes (round the compressor: a slam, a sub falling out of the floor, a scream
  torn upward, metal shrieking) with the screen torn white and red and the camera thrown in at it.
- Then it fights: every joint jerking at once on its strings, lifted off the ground, its head thrown about, screeching
  through its little mouth, porcelain rattling, blood flung off it into a spreading pool, rats pouring out of it each time
  one of the spirits is torn loose (a scream each); the choir chanting faster, the machine's static and metal, the
  spirits' words said over each other (your own deeds among them in Hell); the watchers in an arc behind it, reaching.
- At the top it thrashes bent backwards in the air, the screen strobing - and its face splits: the thing inside comes
  out of it, straight into your eyes (the second scare).
- When it gives: all of it fizzles away, the strings go, the doll crumples to the ground with a twitch left in it; the
  faint heart, the breath, the watchers walking into it and out again; the body is yours.
- When it does not (in Hell, the first time - it fights you off, and you have to come back for it): the doll comes off
  its strings straight at your face (the last scare), black, the laughter after, and you are thrown back into the dark.
- SPACE skips it, whenever (the outcome stands). Heaven: the same, gentler and shorter, and it always gives.

# V2.88 (2026-11-26): Heaven and Hell as places; the exorcism; the next driver yours

Asked for: "i want hell and heaven to be 3d spaces and all and then you gotta like retake the spirit of the new driver
and do exorcisms and then u can control the next driver".

## The afterlife (ui/Afterlife.js)
- After the Reckoning's verdict you wake in it, as a spirit - a glow with a trail - and walk (W/S or up/down to go, A/D
  or left/right to turn; the camera follows). HEAVEN: a floor of cloud under a sky of white gold, a marble way
  through it between columns and pillars of light, motes drifting up, golden gates standing open at its end. HELL:
  black rock split by rivers of moving lava, spires, flames along the cracks, embers rising into a sky of smoke and
  blood, an iron arch.
- At the end of the way, a portal for each driver you could become - your team's: your team-mate, and whoever the team
  brought in for you - each standing in their suit inside a ring of light in the team's colour, their name over it,
  dark spirits going round them. Walk up to one and press E.

## The exorcism (ui/Exorcism.js)
- The spirits holding the body must be cast out before yours can take it. A circle of runes over the scene, and two
  trials in turn: THE SEAL - a ring of light closing on the circle, SPACE (or a click) as it crosses the golden band;
  THE WORDS - a word of command (VADE, EXI, LUX, CEDE, PAX, ABI) to type before the light fades. Every miss, every
  wrong letter, darkens the circle.
- Heaven: three spirits, a slower ring, a wider band, four misses allowed. Hell: six spirits, faster, narrower, the
  words every other time, three misses. A soul that weighed light is a little steadier.
- Cast them all out: "THE BODY IS YOURS" - and the career goes on as that driver. Fail: "THEY HOLD ON" - you are thrown
  back onto the way, to choose again. Nobody left to become: you let go, and the career waits for a new driver as
  before.

# V2.87 (2026-11-26): palms and a retro sun, no buildings

Asked for: "remove the buildings from the bg but keep large palm silhouettes and sort of sun retro iconography".

## The VICE ground (ui/ViceScene.js)
- The hotels are gone. In their place: a big retro sun, cut off at the horizon and banded across its lower half, with
  a glow round it; a neon horizon line (cyan into pink) it sits on; the grid floor running away from it, brighter.
- Large palms in silhouette framing the scene - two on each side, leaning in, their fronds a drooping rib with
  leaflets hanging off it, a rim of pink light on every edge - and a few small ones on the horizon.

# V2.86 (2026-11-26): the kerb camera's two lenses; sprints without a stop; every tyre in the builder; Heaven and Hell; the driver career in the HQ's look, with mail

Asked for: the kerb camera "doesn't switch between forward/backward facing, it's just moving to the next kerb";
"sprints have no mandatory pits - up the laps to 4"; "always give the full selection of S M H I and W in the strat
menu"; "add heaven and hell to give players a sense of a moral compass".

## The driver career in the team principal's look (ui/DriverHQ.js, ui/CareerHub.js)
- Asked for: "revamp the driver career mode with the same visuals of the team principal ... and add emails".
- The hub is on the HQ's ground now: the HQ's stylesheet and its four grounds (VICE, the neon one, first - kept per
  team), the team's colour as the accent; the bar across the top; the rail down the left in groups - WEEKEND (Mail,
  Race week), CAREER (Team, Driver), OFF TRACK (Life, Media), RECORD (Season, Stats), In Memoriam at the foot - with
  the HQ's line icons and its sliding light; the stage across the whole width, its panels with the neon edge.
- Every page's own colours moved onto the HQ's by what each colour is: a white ground the panel, a near-black ink the
  ink, a grey line the line; a team's, a tyre's or a state's colour as it was. The post-race report, the pop-ups and
  the tech tree with them.
- The 3D studio only where your look is being made (DRIVER > Look, LIFE > Style); everywhere else it is off and does
  not draw. The side card is gone (the HQ has none; what it said is on the pages and the bar).

## Ocean Drive, your colours, the stage filled (ui/ViceScene.js, ui/DriverHQ.js, ui/CareerHub.js)
- Asked for: "resize some things (not just scaling but complete rebuild of certain things) to fill the screen fully.
  Have the theme be customizable like in principal mode - make it more neon and Miami / Vice City Ocean Drive vibes".
- VICE is Ocean Drive at dusk now, behind both hubs (the team principal's too): the sky from indigo through violet and
  magenta to a burning orange at the sea, a low striped sun, a row of Art Deco hotels along the front - every edge a
  neon tube, pink, cyan, tangerine, violet - with lit windows, vertical signs, awnings, palms in silhouette, the sea's
  glow at the foot. Drawn as one SVG, nothing to load; the names on the signs are invented. The panels are smoked
  glass with the city behind them, their edges brighter tubes; the buttons and titles glow.
- The colours, as in the HQ: the button by the settings in the bar - the accent (the team's colour, its second, or
  one of eight) and the ground (Vice, Midnight, Carbon, Daylight), kept for the team.
- RACE WEEK > Briefing rebuilt for the whole stage: the next race with its circuit drawn as a neon tube and the
  race-day boxes under it, your season's six figures, the sponsors' targets, what is waiting this week, the
  season's rounds along the foot. STATS on the HQ's colours as well.

## Mail (career/DriverMail.js, ui/DriverMailPage.js)
- MAIL at the top of the rail, with the unread count: the HQ's mail client - the list on the left, the letter on the
  right. The race engineer's report after every race (the result, the rating and its reasons, Driver of the Day); a
  team that wants you, through your agent; a brand's offer; the stewards' letter for points on your licence, and a
  ban; the team principal when management's confidence falls to a warning or rises a long way; your agent when your
  contract has half a season left; trophies; the season's end and its awards; a fan's letter on a great day. Whatever
  wants a decision has a button to the page where it is made.

## The kerb camera (camera/TVDirector.js)
- One kerb, two lenses: facing up the road as the car comes, then - the moment it is over the kerb - a cut to the one
  facing down the road, the car going away; held two and a half seconds. Why it moved on instead: a kerb shot counted
  as a trackside one, and a trackside shot is over when the car is 400 m off after three seconds - the kerb (up to
  720 m ahead when the kerb camera was asked for) was dropped before the car got there, and the next one placed further
  on; and the reverse angle could be cut short by the same rule. A kerb shot keeps its own time now, and the corner
  it picks is within 480 m.

## Sprints (career/Sprint.js, race/RaceDirector.js, ai/AIDriver.js, ui/Strategy.js and the pit wall)
- Four laps at least (a third of the race's distance otherwise).
- No mandatory stop and no two-compound rule in a sprint of any length - before, a sprint of eight laps or more (a
  Grand Prix of 24 or more) carried both, with the 30 s at the flag. One flag on the race (stopRule) now says whether
  the rule applies, read by the stewards, the AI, the strategy screen, the pit wall and the broadcast. A sprint's
  tyres are the ones that last its distance.

## The strategy builder (ui/Strategy.js)
- Every stint offers all five tyres - soft, medium, hard, intermediate, wet - whatever the forecast; the time shows
  what a choice costs (a wet tyre on a dry road: "will not last" or a minute and more). The engineers' plans, and the
  AI's, are still made from the tyres that suit the day.

## Heaven and Hell (career/Conscience.js, ui/Reckoning.js, career/PR.js, ui/CareerHub.js)
- The driver career keeps your driver's conscience: what they chose to do, on the track and off it. Good: a day for
  charity (+4), a donation (+3), giving way for the team (+3), walking away from a fight (+2.5), doing as the team
  asked (+1.5), time for the fans (+1.5), a clean race (+0.6). Harm: starting a fight (-4, more if it escalates),
  taking out a team-mate (-4), holding one up on purpose (-3.5), a ban (-3), causing a crash (-2.5), defying team
  orders (-2.5), goading a rival (-1.5), a penalty (by its points).
- The hub's DRIVER panel shows which way the scales lean: Heaven-bound, leaning towards heaven, in the balance,
  leaning towards hell, Hell-bound - while it can still be changed.
- If your driver is killed: after the mourning, the Reckoning. A balance out of the dark; the deeds come down onto it
  one by one, the good in gold on the left, the harm in red on the right, the beam tipping with each. Then the
  verdict - Heaven (the light rising, clouds, the gates opening, a slow major chord) when the good weighs at least as
  much as the harm, Hell (the floor giving way, the red glow and the embers, a low drone) when it does not - and what
  weighed most, said plainly. Only your own driver is ever judged, never the real drivers on the grid.

# V2.85 (2026-11-18): your drivers talk back; the paddock loses patience mid-season

Asked for: "3 and 4" - driver radio with personality, mid-season driver changes in the team principal's career.

## Your drivers on the radio (race/DriverRadio.js, main.js)
- In the team principal's race your two drivers talk back, each in his own manner (hot-headed, political, loyal,
  money-driven, perfectionist, team player) and in his mood - the career's morale and his form in the ratings: up,
  flat or down. The same moment sounds different from a happy loyal driver and an unhappy hot-headed one.
- A stop: a lap after it, the cars that stopped too and were behind him and are now ahead ("he undercut me, we were a
  lap too late") or the other way round ("great call, we jumped him"). One that cost him places costs a little morale.
- Stuck behind his team-mate, under a second for twenty seconds and quicker on the last lap: he asks to be let by -
  the question on his card on the pit wall, SWAP or NO. A no is answered, and remembered in the morale (more by the
  hot-headed and the unhappy).
- An order: the one told to give way or hold takes it in his own way; the one let through says thanks.
- A place won or lost on the road, now and then; and at the flag, the result against where he started.

## Mid-season changes (career/Seasons.js, career/ManagerMail.js)
- A rival team out of patience: a driver on a run of poor marks (four or more, 5.0 or worse on average, a point
  below his team-mate) may be dropped from the fourth round to the last but one - the best free driver not far off
  him takes the car for the rest of the season, and the news says so. Two a season at most; never in your team.
- Your driver on a run of good marks (7.6 or better): his management writes, once a season, asking for a raise on the
  same contract. PAY IT (morale up) or NOT NOW (morale down, more for the hot-headed and the money-driven; the
  money-driven and the political then listen when other teams call - they are wanted more in the market).

# V2.84 (2026-11-18): what a stop really costs; the sprint shoot-out; the marks that matter

Asked for: "do 1, 3, 4" - the AI's pit-stop cost corrected, a raced sprint shoot-out, ratings with consequences.

## What a stop costs (race/RaceDirector.js, ai/AIDriver.js, main.js)
- The race's figure for a stop counted the whole lane - 1.1 km at Silverstone - as if driven at the 80 km/h limit:
  37.5 s at Silverstone, 30.8 at Montreal, 29.4 at Austin. Measured in the races (every car made to stop once,
  the time in the lane against racing speed, the uncongested stops): 22, 24, 17 and 17.5 s. Now each circuit's
  measured figure plus a second of slowing and getting going - Silverstone 23, Montreal 25, Austin 18, Las Vegas 18.5;
  a new circuit's worked out from its lane as the cars drive it. The AI's undercut and cover sums, the race-time
  model, the strategy screen, the re-plan and the pit wall's PIT NOW all use it. (A Montreal race: a few more
  undercuts and covers; the stops themselves are as long as before.)

## The sprint shoot-out (main.js)
- A sprint weekend now starts with a shoot-out of its own: drive it (or watch it, as team principal) or simulate it;
  its order is the sprint's grid. No pole counted, nothing saved for the Grand Prix, no grid penalty served on it -
  qualifying and the Grand Prix come after the sprint as before. (A race without qualifying keeps the seeded grid.)

## The marks matter (career/Marks.js, career/Manager.js, career/Career.js, career/Seasons.js, career/Market.js)
- Form: the average of a driver's last five marks. A contract asks for more on a run of 8s (to some +14 %) and less
  on a run of 4s (to some -14 %), and says why. The rival teams read it: a driver on a run of poor marks is replaced
  by anyone about as good, and more often; the one in form is wanted more. In the driver career the teams' yardstick
  for keeping, dropping and approaching drivers is half the marks now.
- Morale: your drivers take a 9 (+4), an 8 (+2) or a 4.5 and below (-3) to heart, and Driver of the Day (+2).
- Driver of the Day: the fans' vote on the results sheet now weighs the marks; the careers count it (the news, the
  HQ driver card: the season's average and Drivers of the Day). A simulated race: the best mark.
- The season's awards from the marks: Driver of the Year (best average, at least half the races), Rookie of the Year,
  the fans' favourite (most Drivers of the Day), most improved (the OVR's rise) - in the news and on the season
  review of both careers; one of yours: morale and a point of the board's confidence.

# V2.83 (2026-11-17): the stop worked out on the pit wall; sprint weekends; the drivers rated after every race

Asked for: "do 1,3,5 - affects their OVR" - a pit-now rejoin prediction, sprint weekends, driver ratings that move
the drivers' ratings.

## Pit now: where it would put you (main.js, ui/PitWall.js, ui/TVShow.js)
- Each car's line on the pit wall: PIT NOW -> the place it would come out in, how far behind the car in front, and,
  in amber, the car right behind if it is closer than 1.2 s (traffic). On the track map a dashed ring in the car's
  colour where it would rejoin. The stop's cost is the lane as the cars drive it - braking to the speed line, the
  limiter, away again - against the same distance at racing speed, plus the time stood in the box (some 22 s at
  Silverstone); about half that under a safety car or a VSC. The gaps are the timing loops' own.

## Sprint weekends (career/Sprint.js, main.js, career/Career.js)
- Both careers: every third round of a season of four or more is a sprint weekend. Saturday's sprint first - a third
  of the race's distance, from a sprint shoot-out grid, no stop to make - points to the first eight, 8-7-6-5-4-3-2-1,
  for the drivers and the teams; then qualifying and the Grand Prix as any weekend. Simulated weekends run the sprint
  too.

## The drivers rated (race/Ratings.js, career/Manager.js, career/Career.js, ui/HUD.js, ui/ManagerHub.js)
- After every race each driver gets a mark out of ten - against what his car could do (the place its pace was worth),
  the places from the grid, the passes, the team-mate, a win, a podium, the fastest lap; spins and penalties cost.
  Crashed out: low; out with a failure of the car: not rated. The results sheet has a RTG column (point at a mark for
  the reasons), the HQ's driver card the last mark and the form.
- The mark moves the driver's rating, so his OVR: a 9 some +0.4, a 4 some -0.4, a 6.3 nothing. Every driver in the
  field, both careers; in the driver career your own mark is on the race report.

# V2.82 (2026-11-17): a sick engine heard; the crowd; driving blind in the spray; the spray's cost; the safety car heard

Asked for: "all of them except 6" - engine failure sounds, the crowd, the AI in the spray, the wet race's frame rate,
the safety car and the VSC heard.

## A sick engine (audio/EngineWorklet.js, audio/Audio.js)
- Damaged (a hit to the engine, a power unit losing its power): it misfires - firings missed, its rhythm broken, the
  odd bang of unburnt fuel in the pipe - and rattles. Blown: a deep thump and a tearing burst, then it sputters out over
  two and a half seconds, the revs falling. A gearbox or the hydraulics: the revs fall away.

## The crowd (audio/Audio.js, main.js)
- A crowd by the stands near the microphone - louder by a grandstand, faint at the far end of the circuit, little of it
  on board - that rises: the lead changing hands, a crash (and its gasp), the restart after a safety car, a place gained
  for your car, every moment the broadcast keeps by what it was worth, and the flag most of all.

## Driving blind in the spray (ai/AIDriver.js)
- In the wet the AI drives as a driver who cannot see: following a car through its spray it hangs back (a longer gap,
  more with speed), brakes earlier for the car in front, and makes fewer late moves up the inside. By the water on the
  road ahead - nothing of it below a fifth wet: the dry races are as they were.

## The spray's cost (world/Spray.js)
- Measured onboard half a second behind a car in the wet, drawing the spray made the frame some 60 % longer: thousands
  of big see-through sprites filling the lens. Now no sprite is drawn over 220 pixels, those at the lens fade out, a
  car far off throws fewer (it is small in the picture), and fewer in all, each a little thicker: half the particles,
  a third of the sprite's area at most, the look kept.

## The safety car and the VSC heard (main.js, audio/Audio.js)
- Race control's tones on the radio: three falling as a safety car, a VSC or a red flag comes out, two rising as it
  ends. Behind the safety car the field warms its tyres: a stab of throttle now and then, each car its own rhythm. The
  crowd rises at the restart.

# V2.81 (2026-11-17): the theatre heard; each maker's engine; the mix; the last films ready; the kerb the line takes

Asked for: "do 1, 2, 3, 4, 5" - the theatre's sound, engine makers' voices, the mix sliders, the last cutscenes made
ready, the kerb camera on the kerb the racing line runs over.

## The theatre's sound (main.js thAfter)
- The full race played back in the theatre was silent: its cars are posed from the tape. Now every car near the
  camera is heard where the tape has it, its speed and revs from how its model moves; paused, silent.

## Each maker's engine (audio/EngineWorklet.js, audio/Audio.js)
- Every car had the one engine. Now each maker has its own (by the team's supplier - the manager career's own choice,
  else the team's usual): Mercedes smooth and deep; Ferrari high, raspy, bright; Red Bull Ford sharp, its turbo and
  hybrid whine loud; Honda a howl in the middle; Audi lower, rough and buzzing. (Measured on the same pull: Ferrari's
  sound centred at 3.3 kHz, Mercedes' at 2.9, Audi's at 2.6.)

## The mix (settings: the Driving page and the pause menu)
- Engines, Effects, Ambience, Radio - beside the master volume, 0 to 150 % each, remembered in the browser. Effects:
  the tyres, the kerbs, the gravel, the wind, the rain, the hits, the wheel guns, the crash's own sounds. Ambience: the
  crowds, the music. Radio: the replay offer's beep, the engineer's chime, the lights, the screens' beeps.

## The last films made ready (main.js, ui/ManagerHub.js)
- The scene a race leaves at the track (played at the podium) is made ready while the results are read; the title
  decider's film - the manager career's and the driver career's - while the HQ or the hub is up. Each starts at once.

## The kerb camera (camera/TVDirector.js)
- On the kerb the racing line really runs over: the apex where the line comes nearest the inside edge, the exit where
  it runs out nearest the outside one - whichever the line comes nearer; as near as each other, the two by turns.
  (It was the corner's middle and its end, by turns.)

# V2.80 (2026-11-17): box to retire

Asked for: "add a box to retire option in the 'car' menu of the pitwall".

## The pit wall's CAR page (ui/PitWall.js, main.js, race/RaceDirector.js)
- BOX TO RETIRE, by RE-PLAN: a click asks CONFIRM? (three seconds), a second calls the car in - this lap, on the
  radio ("box this lap, box. We are retiring the car"). On its way in the button is STAY OUT: a click calls it off
  and it races on. Called in to retire it stays called in - whatever else would keep it out - until it is at its box.
- At its box it is out of the race ("Retired (team decision)", classified as a retirement) and its crew push it back
  into the garage; it is out of the pit lane's queue at once, so its team-mate's stop is not held up behind it.
  The button then reads RETIRED.

# V2.79 (2026-11-17): replays heard, tilted and in the spray; a wet race you cannot see through; the engine's crackle and stutter

Asked for: "at austin, in replays the cars dont follow the angle of track"; "The new engine sounds are amazing! but there
is a tinfoil type crackling during breaking"; "Give replays and highlights sound"; "spray doesnt match up with the cars
in replay, and spray in general should be way worse and very hard to see, plus in real wet races you cant see far
anyway even without a car infront, add that misty spray fog"; "at top speeds the cars have an annoying stutter sound".

## Replays
- On a circuit that is not flat (Austin) the replayed cars sat level on the hills: the record is kept on the flat and
  the ground's height was added to it, not its angle. Now they are tilted with the ground under them - nose up the
  slope, leaning with the camber - as they are drawn live (measured: within half a degree of the live car). Not a car
  in the air or a wreck: its whole attitude is in the record (a flag in it now).
- Their sound: a replay poses the cars' models from the record while the race is held, and the engines were listened
  to where the held cars stood - still, at idle. Now they are heard where they are drawn, their speed, revs and
  Doppler from how the models move: the replays and the highlights have the race's sound.
- The spray in a whole-picture replay comes off the replayed cars, as they move in it - it came off the held cars,
  where nothing was, and stood frozen while the race was held.

## The wet
- The spray is three times what it was and stays: the rooster tails off the rear tyres, a plume the height of a house
  behind the car, and a mist it leaves hanging over the road for seconds. Following a car in the wet you see little.
- The mist of a wet race: the spray of the whole field and the rain hanging over the circuit - with no car ahead you
  still do not see far. Half of what stands 150 m off is lost in it on a wet track in the rain; it thickens as the
  track gets wetter and clears as it dries.

## The engines
- Braking: the crackle of foil was the overrun's pops - a burst of them after every downshift, bright ones - with the
  turbulent noise turned up off the throttle, and a tyre squeal of filtered hiss. Now an odd dull thump in the pipe,
  the noise steady, and the squeal a tone (a rubber's howl) and only when the tyres really slide.
- Top speed: every car flat out in top gear at its top speed sat on the rev limiter's 18 Hz cut - a stutter down
  every straight. The limiter is heard only on the limiter in a lower gear; at top speed the car is held by the air.

# V2.78 (2026-11-17): cutscenes cut down and ready; a loading screen that tells the truth; the kerb camera

Asked for: "The cutscenes are still so unnatural, mostly due to long loading screens (preload them) and unnecesarily
long segments ... all I need to see is one 3 second visual for most and I dont need 50 different angles, and speech
scenes are still 1.5x too long. the progress bar isn't accurate. never show multiple angles of the same thing"; "fix
the pre-race loading screen to not lie ... make it accurate to the loading% but between each updated progress smooth
acceleration/decceleration"; "Kerb cam should be a static shot, from the kerb at which the car will run over, either
apex or exit kerb".

## Cutscenes (ui/Cine.js, ui/CineIndex.js)
- Ready before they are asked for. Every scene made its own renderer (a new graphics context, every shader compiled
  again) and built its set after it was called: the wait. Now one renderer is kept for all of them, made a few
  seconds into the menus with the car's model; and a scene known to be coming - the matters waiting at the HQ, the
  film a race earned (made ready while the results are read) - has its set built and its shaders compiled before it
  is played (measured: about a second to the first picture where it was thirty and more on the test machine).
- The edit: every shot with words, a question or a moment to catch is kept; of the shots with nothing said, ONE, of
  three seconds; never two angles of the same thing - a shot looking where the shot before looked is left out, and a
  line said to the same place as the line before is said in that shot. (garageNight: 6 shots to 3, 8 s; seasonReview
  6 to 3, 4 s; pitwallReact 4 to 1; decider 6 to 3.) A shot left out still does what it did to the set.
- The lines read a third quicker (each 1.5x shorter than it was).
- The progress bar: the time gone over the time gone and the time still to come - the shots this telling of the
  scene will still play, as long as each will be. It was the shots' written lengths, which none was played at.

## The loading screen (ui/Loader.js)
- The bar and the line round the map are drawn off the page (a worker), so they go on while the build holds the
  page; the figure was the page's, and stood at 0 % while the bar ran on - and the bar crept on past the figure it had
  been told, toward the next one, before that stage was done. Now it goes to the figure it is told and no further,
  eased (away from rest, quickest in the middle, easing in), and the worker draws the figure too: the three are one.

## The kerb camera (camera/TVDirector.js)
- Static: one place, one aim, one lens for the whole shot, in the kerb the car is about to run over - the apex kerb
  on the inside or, every other time, the exit kerb on the outside - looking back up the road at the car coming over
  it. It zoomed with the car and then swung round after it. Over a second after the car has gone by.
- (And the aim's new smoothing - V2.77 - carries the car's movement only in a picture that follows a car: a fixed
  view - the kerb's, a cutaway's, the grid's - looks where it looks.)

# V2.77 (2026-11-17): the sound of it; the broadcast camera's pans

Asked for: "go thru the whole game repolishing audio, are the engine sounds at the best of their ability? like is there
no way for them to be more realistic"; "Implement this notification sound for anytime there is an optional replay so I
don't miss them" (a team radio beep); "the rear cam just refuses to work, and camera movement keeps teleporting to the
correct frame, rather than clean, smooth sweeps and zooms".

## The engines (audio/EngineWorklet.js, audio/Audio.js)
- They were two saw-tooth oscillators and a square through a lowpass, pitched 40 to 300 Hz - a truck, an octave and
  more below the real thing, the same buzz for every car, and only one car ever heard.
- Now each engine is synthesised firing by firing in an AudioWorklet: a 1.6 litre V6 fires three times a revolution,
  600 Hz at 12 000 rpm. Every firing is a pressure pulse into the exhaust - its bark, a burst of turbulent noise riding
  it, and the pipe's resonances it rings (fixed: the harmonics sweep through them as the revs rise). Each cylinder
  fires a little differently, a few per cent of jitter every time: the rasp.
- On the throttle: hard and bright. Off it: softer, duller, the odd pop of unburnt fuel. An upshift: a crack and 40 ms
  of ignition cut. A downshift: a blip and a crackle. The rev limiter's 18 Hz stutter; the pit-lane limiter's burble.
- Over it: the turbo's whistle with the boost and the wastegate's breath when the throttle shuts; the MGU-K's whine
  deploying and, louder, harvesting under braking; the straight-cut gears.
- On board (cockpit, T-cam, the broadcast's onboards): the airbox's roar over the driver's head, the block under him.
- The safety car is a V8: four firings a revolution, lower, rounder.
- Where a browser cannot run the worklet, the old oscillators are still there. (Opened from disk, the single file
  loads it from a data: URL - a blob: URL from a page with no origin will not load as a worklet.)

## Every car heard
- Up to eight cars at once, the loudest: their engines by their distance, duller with it (the air), quieter from in
  front (the exhaust is at the back), left or right in the stereo, and Doppler-shifted - the rise and fall of a car
  going past at 300 km/h (measured: 733 Hz coming, 440 going for a 550 Hz note at 85 m/s).
- Driving: the field round you - a car alongside, one closing behind.
- The broadcast: the cars round the picture, not one car wherever the picture was. A helicopter's picture is heard
  from a microphone by the track near the car (as a broadcast is mixed). Full-screen replays and the highlights have
  their sound: the replayed cars' engines from how they move in the record.

## The rest of the sound
- The team radio's beep (your recording) every time a replay is offered.
- Tyres squeal when they slide; the kerbs drum through the chassis at the stripes' rate; gravel and grass crunch.
- The wheel guns in a pit stop: each nut undone and done up, heard from where the car is.
- Collisions are heard where the microphone is (the broadcast's included), with a crunch for a hard one - they were
  only heard near your own car.
- The rain hisses (louder on a visor).

## The broadcast camera (camera/TVDirector.js)
- REAR on the pit wall while following a car turned itself into the forward onboard unless a car was attacking right
  behind - the button seemed to do nothing. Asked for, it is the rear camera now.
- The aim carried every change of its target in one frame: a partner joining the picture or leaving it, two cars
  becoming three, a pair splitting up - each a jump, and over 45 m a snap. Now only the subject's own movement is
  carried exactly; a change of what the picture is of is a pan, eased over a third of a second. Only a cut is a cut.
- The lens opens and closes more gently.

## The window replay to full screen (main.js tpReplayFull, ui/TVShow.js, ui/TVExtras.js)
- Asked for: "the full screen prompt is way too big - infact remove it"; "instead scale the PiP smoothly larger until it
  takes the whole screen, in one smooth transition ... the neon box ... can scale with it"; "when leaving the
  fullscreen highlight it returns to the real broadcast before the closing transition is finished".
- No FULL SCREEN button on the window any more: F.
- F: the window itself grows to the whole picture in three quarters of a second, eased, its neon frame growing with it
  and fading over the last of it, the clip from its start. There the broadcast's own camera takes the window's exact
  view and the replay plays on - no wipe over the whole feed while the window sat in it.
- The wipe's middle (where what is under it changes - the live picture back) waited a fixed 560 ms; on a heavy frame
  its slats start late and the live picture came in under slats still closing. Now it waits until every slat IS
  closed, and the wipe comes off when their animation has ended, not on a clock.

## A decision with nothing to decide (career/ManagerStory.js, ui/ManagerMail.js)
- "The car rebuilt overnight" came to the inbox as a decision with no choices (it was only a scene). Now it asks what
  you do for the crew that worked through the night: a bonus ($0.2M: less fatigue, steadier stops), send them home to
  sleep (the most rest), or thank them yourself (free). A save with it already waiting gets the choices too.
- The Decisions list (and the Mail badge) holds only matters with choices to make there; the scenes that are only
  played in person (the board, the launch, the documentary) come up where they belong, as before.

# V2.76 (2026-11-16): replays run on into the wipe; race pace; the pit wall fits a laptop

Asked for: "have the replay continue playing as it transitions out (do this by extending the replay slightly - dont
cut off the actual action, to give a sense of continuity"; "and go ahead with the pitwall fit, and 3" (x8 / x16 and
a skip to the next of the action); "it should be a keybind to make PiP full screen".

## Replays run on into the wipe (main.js tpMomentsCut, tpReplayStep)
- Each moment's clip is kept a second longer, after its action is over: the run-out. A whole-picture replay starts
  its closing wipe that much before the clip ends, so the cars keep driving while the slats close over them and the
  live picture comes in under them. The action itself is never under the wipe.

## Race pace (main.js, ui/PitWall.js)
- x8 and x16 next to x1 / x2 / x4 (and - / = on the keyboard go up to x16).
- SKIP: the race as quick as the frame allows until the next of the action, then x1 with a line from the pit wall
  saying what it is: two cars within half a second in the top six, or with one of yours (not ones already together
  when it began); one of your cars coming in; a car spinning, in the air or wrecked in the top ten, or one of yours;
  an overtake for the top six or by one of yours (not a place taken from a car spinning or crawling); a moment the
  broadcast keeps; the safety car out, in or ending;
  the last lap; the flag. Never slower than x16. One stop per fight: a pair that has stopped it, the rest of its train,
  a car's next small pass for 30 s, a car rejoining after a spin, a second car caught in the same accident - not again;
  on the opening lap, incidents only. Nothing is replayed while it skips. Pressed again, a speed or pause: off. Key: full stop.

## The window replay full screen: F
- The key for the window replay's FULL SCREEN button (the button says so).

## The pit wall at 1366 x 768 (ui/PitWall.js)
- The radio's second line was cut through (a box 28 px high for two lines of 13.6 px). Now the newest line in full -
  two lines at most - and the one before it on one line, dimmed, in a box that is the height of three.
- TEAM and SET-UP share a row (SAVE / RESET), so the panel is no taller for it.

# V2.75 (2026-11-16): the AI races its plan; the follow camera; replays as it was; the leftovers

Asked for: "Yes I meant all commentary, do all of the 'small leftovers', do number 1" (the AI to plan its race from
the day's tyres); "when I click, lets say leclerc in P3, it takes me to his battle against sainz in P4 ... have a
double click override - or just zoom the camera out on 3-car battles"; "in PiP replays of incidents, cars drive in
their post-crash state"; "add a button to make PiP replays fullscreen"; "discretely make the big SAFETY CAR
notification a hidden button to make the cameras follow it"; "SC doesnt dissapear during highlights so they phase
thru it, also during highlights when it transitions out of a replay the cars dissapear before the transition is over".

## The AI races its plan (ai/AIDriver.js planRace, strategy)
- It took only the first tyre of the strategy screen's plan, then stopped on a wear threshold - and, by a rule of a
  stop by 45 % distance, nearly every car stopped at half distance. Now it takes the whole plan from the same sums
  the strategy screen shows: each stint's tyre and the lap it ends on. Most of the field runs the quickest plan,
  some the second or third; the undercut cars take the softest start and stop a lap early, the overcut cars the
  hardest and a lap late (a first stint never under two laps); the gamblers still wait for a safety car.
- Following it: it boxes on the plan's lap for the plan's next tyre. A rival's stop (to cover it, or an undercut)
  moves it by a lap, no more, and never on the plan's last set; the wear brings a stop forward only when the set is
  about to wear through, and on the last set only when it is finished; a stop come early fits a last tyre that still
  reaches the flag; a repair or the rain ends the plan (the old stops by the wear from there). Sprints (under eight
  laps, no stop) are as they were.
- Measured, eight laps at Las Vegas and twelve at Silverstone on a hard, an average and a kind tyre day: 13/14,
  12/13, 16/18 and 9/10, 9/11, 16/17 of the cars with a plan ran its tyres; the field over five to ten different
  races each time, almost all of them one stop. (Before: 4-12 of 13-18, and two-stops the plan never had.)

## The follow camera (camera/TVDirector.js, ui/TVGraphics.js)
- A car picked on the tower stays the picture. It used to be swapped for the car attacking it - Sainz behind
  Leclerc - and picking Leclerc again stopped following him altogether, so the director put Sainz back.
- Its partner in the shot is the nearer of the car it is attacking and the car attacking it (the one ahead when it is
  close). Close to both: all three, framed wide.
- Picked a second time - or a double click - it is that car alone. Once more: the director's choice again.
- The SAFETY CAR banner by the tower is a button, unmarked: the cameras on the safety car (again: off it).

## Replays (main.js tpReplayPose, race/Replay.js)
- The cars are drawn as they were at that moment: whole before the crash, losing their parts in it - not as they are
  now (the car's own record of its damage, by race time: CarMesh.replay). Back to now after.
- The safety car is in the record: a replay draws it where it was, or not at all - it used to stand where it is
  now, and the cars of the replay drove through it.
- A whole-picture replay holds its last frame while the wipe closes over it; the live picture comes in under the
  closed slats. (The cars disappeared before the wipe was over.)
- FULL SCREEN on the window replay: the same clip from its start on the whole picture, the race held, live after.

## The leftovers
- No commentary at all on the broadcast (the captions too).
- The free-standing boards at Silverstone, the brake-marker boards at Austin and the marshals' post numbers are a
  blank weathered sheet from behind (where the picture would read mirrored).
- The safety car when the whole field is coming in: it goes as the leader stops in his box and joins just ahead of him
  (the leader picked up 81 s after the call at Las Vegas; it was 140-213 s).
- The seeded regression race is identical to V2.67's.

# V2.74 (2026-11-16): the trackside camera's aim goes with the cars

Asked for: "during battles i go to track cam and it just focuses on like random ground around the cars, like where
they were in the past or a bit ahead/behind so i miss all the action".

## What it was (camera/TVDirector.js place)
- The aim EASED after its subject (a ninth of a second behind it). At 300 km/h that is the centre of a long lens
  nine metres behind the car - and the easing ran on the frame's own time while the cars, at x2 and x4, cover two and
  four frames' ground in one: the aim twenty to thirty-five metres behind them.
- A fight was aimed a third of the way from the attacking car to the one ahead - and with the lag, behind both.

## Now
- The aim moves WITH its subject: what the subject has moved since the last frame, the aim has moved too. Only what
  is left over is eased - the picture's weight shifting between two cars, a new subject near the old one.
- Two cars: the picture's middle is half way between them, and it is as wide as they are apart with room either
  side. More than seventy metres apart it is the one car's shot (not the road between them).
- The lens opens quickly as a car comes past - it must not outgrow the picture - and closes in slowly.

## Measured (the trackside camera kept to, cars in fights followed)
- How far the picture's centre was from the middle of the fight: 7.3 m at x1 and 19.8 m at x4 (35 m at worst)
  before; 0 m at both now.
- Both cars in the picture: 89 % of frames before, 96 % now at Las Vegas (98 % at Montreal); at x4, 83 % before,
  90-92 % now.

# V2.73 (2026-11-15): tyres by the day; the pit straight's cameras; no race control over a replay

Asked for: "softs should vary between 25 and 40 percent per race, and reduce mediums and hards by the same amount -
should be the same for all cars (before you consider their upgrades)"; "fix this vegas camera it is genuinely hell"
(a trackside shot from inside the pit lane, the grid seen through the pit wall's fence); "The post race decisions
overlay onto the replay, they shouldnt even appear".

## The tyres (vehicle/Tyres.js setTyreDay, main.js startRound)
- A soft's life was half the race, a medium's three quarters, a hard's 110 % - always. So every race was the same
  race: a soft to half distance, a medium home.
- Each race of eight laps or more (one with a stop in it) has its DAY now: the soft is good for between 25 % and 40 % of the distance, and the medium and the hard
  come down by exactly what the soft has (medium 50-65 %, hard 85-100 %). The same for every car - before a team's
  own tyre development. A career's round has its own day, the same each time that round is begun; any other race
  rolls one. The strategy screen says which it is (HARD ON THEM TODAY / AVERAGE WEAR / KIND TO THEM TODAY) beside
  the laps each compound is good for.
- A set has lost at its cliff what it always had by then: on a day when it lasts half as long, each lap costs twice
  as much. (With the old second a lap, a soft "gone" in two laps had lost two seconds and was worth running three
  laps past its cliff - the plan did not change at all.)
- What the field starts on follows the day: mostly mediums and hards on a hard day, softs and mediums on a kind one.
- A fault this uncovered (ai/AIDriver.js): for a lap after a stop the AI read its new set at the OLD set's rate of
  wear. Harmless before; with a soft wearing a third of itself a lap, a new hard "would not reach the next lap" and
  the car came straight back in, lap after lap. A new set has no rate until it has done a lap.
- Eight laps at Las Vegas and at Silverstone, a hard day (25 %), an average one (32 %) and a kind one (40 %): the
  field split over five to fifteen different races each time (hard-medium, soft-hard, medium-hard, soft-medium, two
  stops), eleven to twenty of twenty-one on one stop, the winners on soft-hard, hard-medium, medium-hard, soft-hard;
  nobody stopping on new tyres. The planner's own best: hard-medium at 25 %, medium-soft at 30-40 % with a hard
  start within 1-3 s of it.
- A sprint (under eight laps: no stop, the tyres just about last it) is as it was - on a quarter-distance soft it was
  a race of worn-out tyres (11 spins for 6 in the five-lap test race). The seeded regression race, a five-lap one,
  is identical to V2.67's.

## The pit straight's cameras (camera/TVDirector.js barD, main.js tvWall)
- Along the pit lane the track's own "wall" on that side is the lane's FAR side, not the pit wall. So a camera
  "at the wall" stood in the pit lane behind the pit wall's fence, and the line-of-sight test - reading the same
  number - saw nothing between it and the grid.
- Cameras (pole, slot, crane, kerb, the replays') stand by the real barrier now - the pit wall where there is one -
  and the sight-line and inside-the-fences tests use it too. A pole stands in from it by what room there is, never
  over the white line.
- Las Vegas, 9 minutes of trackside, crane and kerb shots: 63 on the pit wall's stretch, none behind it.

## Race control and replays (ui/TVStewards.js)
- Race control's cards are not shown over a whole-picture replay or the highlights.
- Once the flag has fallen there are none at all: what is still open is settled in the stewards' room afterwards.

# V2.72 (2026-11-15): the safety car has no place, no laps, no DRS

Asked for: "well it shouldnt have laps or a postion should it now" (the card under the safety car's rear camera read
P0 · SAFETY CAR · -100 LAPS).

- The card under a camera carried by the safety car is the car behind it's - the leader's place, tyres, best lap
  (ui/TVGraphics.js; in V2.71's code, but the picture sent with it was taken before it). With nobody behind it:
  no card.
- The onboard's speed strip did the same - the safety car's speed, gear and a DRS light: the leader's now, and off
  when there is no car behind (ui/TVExtras.js).
- Checked in the game's own loop at Las Vegas: REAR with the leader followed - the card P1 MAX VERSTAPPEN, 0 LAPS,
  BEST 1:51.154; the strip his 100 km/h (the safety car at 98).

# V2.71 (2026-11-15): the safety car comes out ahead of the leader; its cameras

Asked for: "It does this glitch too where the cars go past the safety car once for no reason and only later catch
up to it, and when I try focus the camera on the leader it goes on the safety car instead and then doesn't even
have the camera near them. Also the SC's rear camera is behind the spoiler, instead have it attached to the rear so
you get an actual view of the leader".

## Cars going past it (race/SafetyCar.js holdTick)
- It was the rule, not a slip: the safety car left its bay the moment it was called, wherever the leader was, and
  waved by every car that came up behind it until the leader did - often half the field, a lap before he arrived.
- It waits now, lights on, in its bay at the end of the pit lane, and pulls away so as to join a couple of hundred
  metres AHEAD of the leader, with nobody between them: he is the first car behind it and is picked up at once. The
  field is on the delta while it waits, so nothing is lost by it.
  - "The leader" it waits for is the first car on the road that is staying on it: under a safety car the leaders
    dive for the pit lane a few hundred metres short of the exit. With the whole field stopping it goes at once, and
    the first car out of the pit lane behind it is the leader.
  - It does not pull out into a car coming down the pit lane, and it times its own run from the bay to the circuit
    (the first time it does it in a race) so the next wait is exact.
  - A lap and a bit with no such moment: it goes anyway, and then - only then - waves by what it must. Cars that
    come out of the pit lane between it and the leader are still waved by: they have to get round to the queue.
- Measured, five calls a race at four circuits (twenty calls): no car waved by in any of them; the leader the first
  car behind it; from the second call of a race it joins 70-240 m ahead of him and picks him up the moment it is
  on the road (the first call, with the whole field stopping, it goes at once and he catches it after his stop). As it was (five calls at Las Vegas): up to three cars waved by, the leader picked up 61-200 s after
  the call.

## The camera on the leader (camera/TVDirector.js)
- Following the leader behind the safety car took the safety car's own story - and aimed the camera at a point
  between the two, which before the pick-up is a point half a lap from either. A car followed is the picture now:
  the safety car's story is never its own. Checked: the leader followed for 40 s - the shot his every frame, the
  camera never more than 340 m from him.
- The safety car's own shots (nothing followed) have the leader in them only when he is within 200 m behind it.
- The caption read THE SAFETY CAR LEADS CAR AND THE FIELD when the safety car itself was the "other" car of the
  shot: it names the leader.

## Its rear camera (camera/CockpitCamera.js)
- REAR, with the leader behind it, is the safety car's own camera - and that sat where a Formula 1 car's pod is,
  which on a road car is inside the tail, behind the spoiler. It is on the tail itself now: just behind the bumper,
  0.9 m up, nothing of the car in the frame, the leader filling it.
- With the leader followed and REAR asked for, that is the camera you get (when the safety car is the car right
  ahead of him); the card under the picture and the timing are the leader's, not "P0 SAFETY CAR, -100 LAPS".

# V2.70 (2026-11-15): the loading screen in neon, its line running smoothly; the weekend's shortcuts in the HQ

Asked for: "This vibe is amazing (the race strat menu). Carry this vibe into the currently cool but relatively bland
loading screen, make the red track outline more smoothly filling - rather than just jumping to the new loading
percentage it should smoothly accelerate to the new loading status. Add the same options from career mode to
manager mode for simming to race or simming to quali - also remove the post quali las vegas sphere shot (the one
that says who had pole position) if Quali is simmed, same for if the race is simmed dont show the race sphere shot".

## The loading screen (ui/Loader.js)
- The strategy screen's look: deep purple under the pictures with a pink glow from one corner and a cyan one from
  the other; the cards edged from pink to cyan; headings lit cyan; the Grand Prix's name in two tones (GRAND PRIX in
  hot pink, kept on one line); the news with lit edges; the bar a pink-to-cyan gradient with a bright tip; the menus'
  own typeface throughout.
- The line round the map, its head and the bar no longer jump. They jumped because the build holds the page for a
  second and more between its seven stages - anything the page animates stands still that long. They are drawn now
  by a worker on its own canvases, which the build does not hold: told the new figure, it runs up to it as a damped
  spring does - away slowly, quickly through the middle, easing in - and creeps on a little while the next figure is
  awaited, so the line is never quite still. The figure in the corner follows it.
- Where a worker cannot be had (or with reduced motion) the page draws the progress itself, as before.
- Checked with the page held for 1.3, 1.5 and 0.9 s after figures of 22, 55 and 74: the worker went on drawing
  through each hold (0, 1, 3, 6, 11, 17, 22, 31, 39, 44, 48 ... 68), never backwards.

## The weekend from the HQ (ui/ManagerHub.js, main.js mgrRace)
- RACE in the HQ's bar opens the ways into the weekend, as a driver's career has them:
  the full weekend · skip practice - qualifying · sim qualifying - race · sim the whole weekend.
- SIM QUALIFYING - RACE simulates qualifying as the circuit loads and goes straight to the strategy screen (which
  says where each car starts).

## The Sphere's shot
- A qualifying session that was simulated has no POLE POSITION shot on the Sphere; a race simulated to the flag has
  no RACE WINNER shot. (In a driver's own qualifying the shot is left out only when all of it was simulated.)
- Checked at Las Vegas: simulated qualifying to the strategy with no shot; the race simulated to the flag, the
  results up, no shot.

# V2.69 (2026-11-15): answers take time - the team principal's mail

Asked for: "change a lot of features in manager mode to have like a week delay for turnaround, eg - approaching a
rival's pit chief shouldn't be an instant response - go thru the whole features and find others where this would
work, and you get your update the next week or in a few weeks in email (proper well made menu for this)".

## How it works now (career/ManagerMail.js, new)
- What you ask of people outside your own office is not answered on the spot. You ask - from the same buttons on
  the same pages as before - and it is a mail sent: it sits under AWAITING REPLY and the answer comes after the next
  race (a race weekend is the career's week), sometimes the one after.
- Some answers settle it. Others are TERMS - and the signing is a button in the mail, good for two races, then the
  offer lapses. A thing asked can be withdrawn before it is answered.
- Asked by mail now:
  - an approach to a rival's technical director, head of strategy or pit crew chief (through an intermediary, $0.2M;
    one or two races; he says no - and sometimes his principal writes too - or names his terms, signed from the mail)
  - a protest against a rival's car (the stewards rule after the next race, on the parts as they were)
  - a technical director / strategist / crew chief from the market (he may have signed elsewhere, or want 10% more)
  - a pit crew member (joins, or has gone elsewhere), a race engineer (may ask for the cost of the move)
  - a driver's contract extension (his management answers: the terms, sometimes dearer if he is unhappy or wanted)
  - a sponsor's terms (their board meets: two races for a title sponsor)
  - a prospect for the academy (the family answers), the academy's next stage (two races to build)
  - a power unit from another maker (the manufacturer's board, two races)
- Not delayed, on purpose: signing a free agent into an empty seat (a race cannot start with one), and what is
  yours alone to decide - a release, a talk with your own driver, the factory's orders (which take time already).
- At the season's end everything still out is answered at once, so there is the winter to sign in; an offer from
  last year's market left unsigned is gone when the new season starts.

## What else reaches the desk
- The team manager's report after every race (the result, the points, the money in and out).
- The technical director when new parts are on the car; Operations when a building is finished.
- One of your own people when a rival has made him an offer - MATCH IT / LET HIM GO are in his mail.
- A driver's management when another team has put an offer in front of him.
- The chairman when the board's confidence moves by seven points or more.

## The page (ui/ManagerMail.js, new; MAIL in the rail, with the count)
- A mail client on the sheet: the list on the left - INBOX, AWAITING REPLY, DECISIONS (the story's matters, the same
  ones as before) - and the open letter on the right: who, when, what they say, the terms on a card, the buttons.
  Unread marked; what needs an answer first; a tracker on each thing asked (sent - being considered - reply due).
- While an answer is out, the button that asked for it on its own page shows ASKED.
- The old INBOX page is PADDOCK TALK (the mood, the other principals, the feed, the rumours, the matters).
- An old save gets its mail the first time it is opened (nothing else in it changes).

## Checked
- In a browser: eleven things asked from their pages, the answers after one and two races, three offers signed from
  the mail; no page scroll at 1366 x 768, the rail fits. Three seasons with everything asked every round: 129
  asked, 57 offers answered, no errors; the mail is about 40 KB of the save at its fullest (eighty kept).

# V2.68 (2026-11-15): no camera behind a tree, no fence from behind, highlights that hold

Asked for: "I'm still constantly getting behind tree cameras, like it may start out clean then as it sweeps it ends
behind a tree ... Same goes with fencing ... you never see the reverse side of a fence in real broadcasts - and fix
the texture to be just a generic blank texture (but still with some weathering) rather than the reversed
advertisements. In the highlights it constantly cuts away right as a big crash is about to happen, or as a fight is
still sidebyside - fix".

## Trees (main.js tvTrees / tvTreeHit, camera/TVDirector.js)
- The trees were never in a camera's line-of-sight test: they are drawn as instances by the thousand (Montreal 5,500,
  Silverstone 30,000, Austin 59,000) and the ray skips instances. Each is now a crown in a grid, and every line of
  sight is tested against the ones along it.
- A trackside camera is no longer taken on its first view alone. Its whole sweep is looked along first: from the
  car, down the road to the camera, and on past it. A place with something in the way before the camera is not
  taken; how far past it the view holds is kept, and the shot is cut there - with the car still in clear sight. The
  crane the same. Fifteen places are tried (both sides, nearer, further, higher).
- In a shot, a tree between lens and car ends it within a quarter of a second (a car that has left the road).

## Fences
- The pole cameras, the crane's head and the replays' cameras stand on the ROAD'S side of the wall now (1.5 m in,
  over the verge), not behind it: the catch fence is never between the lens and a car.
- A place is preferred when every line of its sweep stays inside the fence line (main.js tvInside): no looking
  across a fence at the track beyond, so no fence seen from behind. Only if no such place exists is one over a
  fence used.
- From behind, a barrier's panels are a blank weathered sheet (track/Branding.js blankBack) - no mirror-written
  advertisement, no glow at night. And the TecPro blocks on the right-hand side of the road had their lettering in
  mirror writing from the road itself: fixed.

## Measured (trackside camera only, 7 minutes a circuit; the car on screen behind a tree / seen across a fence)
- Montreal: 2.2% of frames and 9 shots of 95 behind a tree before; 0% and none of 107 after. Across a fence: 7.5%
  before, 0.04% after. Austin: 0% behind a tree, 0.3% across a fence. Silverstone: 0% and 0.07%. Las Vegas (no
  trees): 0.02% across a fence.
- The helicopter takes over no more often than before. Choosing a camera costs 12-51 ms at a cut (the sweep is
  looked along by arithmetic - walls, fences, trees - and the ray against the buildings is cast at a few points of it).

## Highlights (main.js tpMomentBusy / tpMomentsCut, race/Replay.js)
- Checked with cars tipped into a spin at 230-330 km/h: the clips ran to 5.5, 7.5 and 9.0 s after the moment - 1.6 s
  after the car stopped spinning each time (the old cut, at 2.2 s, was mid-spin at 180 km/h).
- A clip was cut a fixed 2.2 s after its last event: after the touch and before the car reached the wall, after the
  place changed hands with the two still wheel to wheel. And an event more than 2.3 s later could not join it - the
  touch and the crash it caused were two clips, the first ending as the second began.
- A moment is held open now while a car of it is spinning, in the air, a wreck still moving or off the road at
  speed, or two that swapped places still overlap; it is cut 1.6 s after all that is over (never more than 11 s from
  its first event). What follows joins it. The record the clips are cut from is 18 s long in this mode (was 12).

# V2.67 (2026-11-15): cars keep to the road behind the safety car

Asked for: "cars are still driving thru the grass on straight and corners in safety cars".

## What it was
- Measured behind a safety car with damaged cars in the queue (which is when one comes out): the cars on the grass
  were the ones with bent suspension. Bent suspension pulls the car to one side (vehicle/Car.js: an angle added at the
  wheels) and the AI did not hold the wheel against it - so the car sat 1.0-1.4 m off the line it steered for, all
  the way round. Wherever that line ran along the road's edge it was on the kerb and the grass: one car 117 s of a
  240 s safety car beyond the white line, another 110 s, 20 s of it right out on the grass, with spins from there.
- A car with a rear puncture went to full throttle out of the slow corners and spun across the road.

## What changed (ai/AIDriver.js)
- The AI holds the wheel against the pull (on the road and in the pit lane). The grip the damage costs is still lost.
- In the queue (safety car, virtual safety car) the line a car steers for keeps all four wheels on the asphalt: half
  a metre in from the edge, where at racing speed it runs to the kerb.
- A car with bent suspension or a puncture does not weave for tyre heat.
- A puncture is nursed to the pits: 150 km/h at most (110 on the rim), half throttle.

## Measured after (240 s behind the safety car, five cars with bent suspension)
- Silverstone: 0 s on the grass, 0.1-0.2 s a car on a kerb. Austin: the damaged cars 0 s on the grass, 0.5 s on a
  kerb (before: 20 s / 76 s the worst). Montreal: 1 car-second on the grass in 4090 (a spin at the hairpin as the
  safety car was called).
- The seeded regression race (tools/race_probe.mjs 5 1 silverstone) is no longer identical to V2.60's - cars that
  touch now steer differently afterwards - same race time (636 s), no retirements, no wall hits. New baseline.

# V2.66 (2026-11-15): the right-hand side as one column with a queue; no OVERTAKE lines

Asked for: "add a que so things stop overlapping on the right side of the screen - but not overwhelmingly so there's
constantly a new notification, and some things can go at the same time - remove the overtake alerts altogether (x
overtakes y)".

## One column, with a budget (ui/TVQueue.js, new)
- Race control's lines hung from the top right and the cards stood up from the bottom right, each knowing nothing of
  the other. They are one column now - the lines above the cards - and it has the height between the map and the
  pit wall to use, no more.
- Each card still decides when it has something to show; the queue decides which of those are up: the most
  important first - the safety car's card, the pit stop's clock, STRATEGY, the battle, the car catching, the info
  cards - as many as fit together, the rest held until there is room. A card that is up stays up while it is wanted;
  a held one comes up once room has been there for a second. The map is never squeezed.
- Race control's lines keep their own pace: two up at most, three and a half seconds between two, a flag or a
  retirement ahead of the rest, and a line that has waited ten seconds is dropped rather than shown late.

## No OVERTAKE lines
- "X PASSES Y FOR 7TH" is gone from the column altogether, and the commentary no longer announces a pass either
  ("...is past ... for P7!"). The replay's chip (R) still comes for the first six places, and the cutaways a big pass
  earns (the crowd for a new leader, your pit wall for a podium place) are still taken.

# V2.65 (2026-11-15): the window stays put; replays chosen - small ones on request, big ones played, the whole picture when the race is quiet

Asked for: "The picture in picture is constantly swerving out of the way of the penalties and whatnot, let it have
priority ... move the notifs around a lil so they dont block it"; "Instead of overloading the broadcast with many
replays, let minor incidents go on with an optional replay - same system of clicking r - whereas the larger incidents
are proper and play - but can leave the PiP and take the main broadcast DURING BORING PARTS OF THE RACE where no
front runner is pitting or close to an overtake ... or during a SC where everyone is stable ... This allows past,
already replayed moments or recent highlights to replay in all their glory".

## The window has priority
- The picture-in-picture (and the commentary's line) no longer move when race control's notices come and go. The
  notices sit side by side in the strip along the top of the picture, above the commentary's line, and fold away
  sideways.

## Which replays play, and when (main.js tpReplays / tpBoring)
- A small incident is not replayed for you: it has the chip, and R shows it - a contact the stewards will look at
  but that put nobody out now gets a chip of its own ("contact: Lawson and Sainz"); the stewards' review of it is no
  longer shown unasked.
- A big one - a moment worth 80 and more: a change of the lead, a car put out, a pile-up, a crash - is played, once,
  in the window soon after it (a collision's replay is the stewards' review, when they open their investigation), at
  least sixteen seconds after the last one.
- And it is shown again as the WHOLE PICTURE when the race can spare it:
  - a quiet stretch under green: from lap 2, not on the last lap, none of the first eight nor your cars in the pit
    lane, called in, spinning or off the road, none of them within nine tenths of the car ahead, no flags - for five
    seconds; then the best big moment not yet shown this way, at least a minute and a quarter after the last;
  - behind the safety car once the queue has formed (28 s in): up to three, twenty seconds apart, and here the best
    of the race so far is shown too (a moment worth 55 and more), not only the big ones.
- A whole-picture replay comes in and goes out behind the neon wipe (REPLAY ... LIVE); the race holds while it
  plays, so nothing is missed; R or Esc ends it.

# V2.64 (2026-11-15): VICE - the HQ and the strategy screen in neon

Asked for: "give it a little touch up so it's all cool and neon, not overkill ut effective highlights ... vice city
vibes".

## VICE (ui/HQKit.js: a fourth ground, and the one the HQ now opens on)
- A city at dusk behind the page: indigo going to violet, a pink sun low under it, cyan in the haze at the top
  right, and a grid floor running to the horizon that is barely there.
- Neon where it does some good, and no more: a line of light (pink to violet to cyan) under the top bar; every
  panel's edge running from pink to cyan, brighter under the pointer; the next race's circuit drawn as a cyan tube
  with a pink glow; the rail's light as a pink tube; the big figures, the ratings' rings and the meters with a soft
  glow of their own colour; your row in a table lit from its edge; the button that does the thing glowing.
- The accent is still the team's (buttons, meters, the hero panel); VICE adds the pink and cyan round it.
- The factory's tree takes the same edges, the open branch and the picked upgrade glowing in the branch's colour.
- MIDNIGHT, CARBON and DAYLIGHT are still in the colours panel; a ground you had already chosen is kept.

## The strategy screen
- The same touch: the sheet's edge from pink to cyan, the plan's card lit in red-pink, the tyre chosen for each
  stint glowing, the tyres' rings and the headings in neon.

# V2.63 (2026-11-15): the factory on one screen, the strategy screen balanced, highlights that matter, quicker cutscenes

Asked for: "rebuild the factory tech tree too so it doesnt scroll"; "fix the strategy screen so it's balanced nicely,
no clipping of text"; "lots of understatements in cutscenes and dialogue like 'two retirements in two races' whereas
in reality it was 2 retirements in one race"; "Highlights reel focuses on obscure things, like drivers overtaking
beached cars for 9th place ... focus on important places, consequential events, big crashes, dramatic driver to
driver conflict, also group events, like a pile up or triple overtakes, a huge exchange of postiions within a group";
"each shot of a cutscene takes like 3 times as long as it should".

## The factory (the HQ's FACTORY page: ui/HQKit.js FAC_CSS over ui/HubTech.js)
- Three columns that fill the screen; nothing scrolls, on any of the nine branches:
  - left: the nine branches as a list, the factory's four figures (slots, development cost, early arrival,
    correlation) under them, the car's pace and parts at the foot;
  - middle: the branch that is open - what it has given the car, its upgrades as cards - the development slots
    under it, and under those the aerodynamic testing allowance with every team on its scale (on the FACILITIES
    branch: the table of what the factory does for each branch, in that place);
  - right, the full height: the upgrade that is picked - its levels, what each one is and costs, about it, where the
    grid is on it - and BUILD at the foot.
- The long introduction and the notes are gone from the page; what a click says is the line at the foot of the HQ.
- The tree's own rules (what needs what, costs, the cost cap, correlation) are unchanged.

## The strategy screen
- The text that ran down the card in a column a word wide ("+40.0 / s / on / the / engineers' / plan") was a class
  name shared with something else in the game's stylesheet; it has its own now.
- With the builder alone the sheet is two panels of equal height: YOUR STRATEGY on the left (the bar, each stint's
  tyre and its last lap on larger buttons, the stops, and along its foot what it comes to against the engineers'
  plan and the predicted race time), and beside it what there is to know - how long each tyre lasts here, the rules
  that apply at this distance, what a stop costs, what the field starts on.

## The highlights at the flag
- Every moment of the race now has a worth, and the six worth most are the highlights, in the order they happened:
  - a pass by the place it was for - the lead most, the podium places next, tenth very little - and more between
    rivals with a grudge, team-mates, your cars, and in the last two laps;
  - a collision the stewards opened a case on, by how bad; a crash; a spin by where the car was running.
- Moments within a few seconds of each other among the same cars, or cars together on the road, are ONE moment and
  worth more: "Hamilton takes three places in one move, up to 4th", "4 changes of place in the fight for 3rd",
  "a pile-up: Gasly, Lawson, Bearman and Stroll", "Norris and Piastri: contact in the fight for 1st".
- A place taken from a car that is stopped, off the road, spinning, crawling home on a puncture or with its wing
  off is not an overtake: no OVERTAKE banner, no replay offered, nothing for the highlights.
- (They used to be the last six replays that happened to be offered.)

## Said as it was
- Both cars out of one race is "both cars out of the same race" - and, with earlier ones, "and three retirements in
  three races" - not "two retirements in two races". The pit wall's line when the second car stops says so too
  ("Both cars out of the race."), and its count of retirements now counts this race's properly.

## Cutscenes
- A shot lasts as long as its words take to read once, and a beat more - whatever length it was written at (it was
  1.1 s and 0.3 s a word for each line, or the shot's own length if longer: a fourteen-word line held 5.3 s, now
  about 3 s; a shot with nothing said runs a little over half its old length). The time to answer a question in a
  scene is unchanged.

# V2.62 (2026-11-15): the team principal's HQ, made again for a laptop's screen

Asked for: "go back through the whole manager menu (outside of races) and seriously from the ground up redo all the
user interface and arrangement of buttons and stuff, dont just move around preexisting blocks but remake them
specifically for the laptop aspecrt ratio for minimal scrolling and optimized symetry, also more fluid, nice
transitions, slick colors - customizable to the team".

## The sheet (ui/HQKit.js, new; ui/ManagerHub.js and its three page files written again on it)
- The whole HQ is laid out on a 1366 x 768 sheet and scaled to the window, so every page is designed once and is the
  same on any laptop. Nothing scrolls but the inside of a panel that holds a long list (the news, the free agents,
  the rival grid): checked on all 17 pages - no page scroll, nothing off the screen, nothing cut off.
- A bar across the top: the team's mark and name, the season and round, the four figures that matter every day -
  budget, cost cap left, constructors' place against the board's target, the board's confidence - each with its own
  small meter, and a figure that changes counts to its new value; SIMULATE and RACE; the colours; MENU.
- A rail down the left instead of 17 tabs in a row: TEAM (Overview, Inbox, Standings, Calendar), CAR (Factory,
  Design, Parts), PEOPLE (Drivers, Morale, Staff, Pit crew, Academy), BUSINESS (Finances, Sponsors, Facilities),
  PADDOCK (Rivals, Market). The page that is open has a light that slides to it; what is waiting is counted beside
  Inbox and Rivals.
- The stage: a twelve-column grid whose rows share the height, so a page fills the screen exactly and its panels
  line up in equal columns. A page turned to arrives with its panels one after another; a page drawn again after a
  click stays as it was, each list where it had been scrolled to.
- What a click says comes back as a line at the foot of the screen (green or red), gone after a few seconds - it
  no longer pushes the page down.
- "How this works" is an (i) in a panel's corner, shown on hover: the notes take no room on the page.

## The colours, yours
- The HQ takes the team's colours: the accent (buttons, meters, lights, the glow behind the page) is the team's
  first colour, lifted where it would be too dark to read. The button by MENU opens the colours: the accent - the
  team's first colour, its second, or one of eight - and the ground: MIDNIGHT, CARBON or DAYLIGHT. Kept for each team.
- A new career's screen takes the colours of the team as you pick it.

## Every page, made again
- OVERVIEW: the next race with its circuit drawn behind it, what the sponsors want there and a check of what is
  ready (seats, spares, power units, the factory - each not-ready line with a button to its page); your two drivers
  side by side (rating ring, number, morale, contract, salary); the car (the gap to the fastest, parts, what is
  being built); NEEDS YOU (the inbox's first matter, the paddock's approaches and offers, the press's question with
  its answers on the spot - one panel where three cards were); the last race; the news.
- STANDINGS: both tables the height of the page, each team's points as a bar in its colour.
- CALENDAR: every round a card with its circuit's outline - forecast, what your cars did, who won; the next one lit.
- FACTORY: the tech tree in the stage, put onto the same colours (it was drawn for a white page).
- DESIGN: the power unit down the middle; the design focus (and how the car suits each circuit) over the factory's
  work on its left; the wind tunnel's hours (a ring) over next year's car on its right.
- PARTS: the two power units side by side - each element's wear as a bar - and the spares as four tiles under them.
- DRIVERS: your two as cards (rating, age, career, points, starts, salary, contract, morale, engineer, what he asks
  to stay, extend and release) beside the free agents the height of the page.
- MORALE: the two drivers and the team side by side, each with a ring; the talks as a grid of buttons; the race
  engineers and who is available under them.
- STAFF: the three jobs as three equal columns - who has it, who could.
- PIT CREW: the whole crew down the left with speed, consistency and freshness as bars; the stop, the training plan
  and the market stacked on the right.
- ACADEMY: the academy, the juniors, the prospects - three columns.
- FINANCES: the season's figures; the cost cap as a ring; the prize money by the constructors' order as bars, your
  place lit; where the money goes.
- SPONSORS: the contracts on the left; the offers as cards on the right, each opening where it stands to negotiate.
- FACILITIES: the four side by side - level as pips, condition, effect, upgrade and maintain.
- RIVALS: the grid as one table (how each works, its car's gap as a bar in its colour, its people to ask for,
  protest); who wants your people and the rules beside it.
- MARKET: next season's grid the height of the page; who is on the move; the champions.
- INBOX: what is waiting down the left; the mood and the other principals; the feed and the rumours.
- Every button does what it did: the actions and the career underneath are unchanged.

# V2.61 (2026-11-15): every broadcast graphic arrives and leaves in neon

Asked for: "ensure all of the hud icons/notifs/visuals like undercuts and all of that have cool similarly neon
appearing transitions and exit".

## One way in and out (ui/TVNeon.js, new - put on by ui/TVGraphics.js)
- Every element of the team principal's broadcast that comes and goes is now drawn the way the stewards' cards and
  the replay window already were: a line of light in the element's own colour runs across, the element opens behind
  it, it flares once like a tube catching, and a soft glow of that colour stays round it; it leaves the way it came -
  closed back to the line - and only then gives up its place.
  - the right-hand column's cards (BATTLE, the car catching, the pit stop's clock, SAFETY CAR / RED FLAG, the info
    cards, STRATEGY with its undercut line): wiped open from the right edge behind a running white line; a card
    that is away now takes no height in the column (it used to jump to the corner and fade);
  - the caption under the picture: drawn out from its middle, a line of light along its foot;
  - the commentary's line and the team radio: unrolled from their coloured edge;
  - race control's lines: wiped in behind their colour (yellow, red, green, purple), folded away before they are
    taken off;
  - the SAFETY CAR pill: a tube of its colour that flickers on and pulses, moved beside the tower (the middle of the
    top is race control's now);
  - the grid and the classification: let down from their heading; the telemetry strip and the key hint: opened
    from their middle;
  - the stingers (SAFETY CAR, RED FLAG, GREEN, CHEQUERED FLAG): a line across the picture that opens into the band
    and closes back to a line that runs off;
  - what is always there arrives too when the feed comes up: the tower let down, the LIVE tag and the map wiped in;
    a place gained or lost flares on the tower.
- Reduced-motion setting respected. Nothing of what the graphics say or when they show has changed.

# V2.60 (2026-11-15): stewards who take their time, the stewards' room, strategy on the screen, tyre rules, cameras

Asked for: fix the rough edges (rival overcut / safety-car reactions never seen, the helmet camera's sleeves, the
onboard of an upturned car, old career saves); "strategy made visible"; "deeper stewarding - with the proper visuals
and drama, not just an out of the blue announcment"; "Make cutscenes intros less unnatrual ... it should just happen,
but not overloading"; "outlaw follow camera throughout all manager mode"; "penalties were being handed out like 3
seconds while there was still so much happening - genuinely investigations should be tense, taking many seconds and
even minutes under tough cases ... at which there should be a replay of the incident"; "Make room for racing
incidents"; "in the replay/onboards there arent track details like kerbs"; "Stop cutting away from the
picutreinpicutre onboards right as an overtake is about to happen"; "The cars keep weaving aggresively during SC,
and sometimes just stay in the grass weaving".

Also asked for while it was being made: the kerb camera "isnt on the [kerb] ... should be stationary to show the speed
with the wide FOV - the type that switched from looking backwards to forward as the car drives over it"; "Crane cam
... becoming helicopter cam"; "In replays the fence rule is completely ignored ... must have always 100% visibility,
allowed to switch cams - not too much"; steward notifications overlapping other cards - "reposition steward notifs to
top of screen"; "under safety cars, cars keep bunchign and overtaking - leading to huge swaths of confusion to give
places back"; "Red flags currently dont give the option to change tyres"; "a lot of the times i pit to tyres or edit
the tyre later it doesnt go to the correct tire but what the AI thinks is better"; "remove all other strategies ...
except the custom maker"; "a penalty for not using 2 different compounds like in real life (unless wet conditions
are declared ...) and redflags should count as a pit stop".

## The stewards, as they really work (race/Stewards.js `deep` - the team principal's race only)
- A collision is a CASE with a timetable, not a verdict 2.5 s later:
  - race control NOTES it 6-15 s on (another 6-14 s on the first lap, and 4 s more for every case already open);
  - 9-20 s after that it goes UNDER INVESTIGATION, a clock running on its card - and the broadcast shows the
    stewards' pictures: STEWARDS' REVIEW, the incident again in the replay window (its stretch of the record is kept
    when it happens: the rolling record has long moved on by then);
  - the decision comes 28-60 s later, or 70-170 s for a hard one (the first lap, a car put out, a close call, two
    cases on the same cars);
  - with under a lap and a bit to go, or still open at the flag: INVESTIGATION AFTER THE RACE.
- What they decide, from how the contact reads (who hit whom and where, the pack around them on lap 1, the car ahead
  hard on its brakes, the other car moving across too, a wet road, a second offence):
  - RACING INCIDENT - nobody wholly or predominantly to blame: no further action;
  - NO INVESTIGATION NECESSARY for a plain nothing;
  - NO FURTHER ACTION - to blame, but nothing came of it;
  - 5 or 10 seconds; or a DRIVE-THROUGH for putting a car out with no excuse.
- The pit wall hears each step for a case with one of your cars in it: noted, under investigation, after the race,
  the decision.
- Drive-through: three laps to serve it. An AI car is called in at once and runs the lane without stopping (no crew
  comes out). For yours the pit wall's BOX button becomes SERVE DRIVE-THROUGH (purple, laps left on it); not served
  in time, it is 20 s instead. DT on the tower, DRIVE-THROUGH PENALTY / SERVED cards.
- Overtakes off the track are looked at for longer too.
- Each step of a case is a card of its own at the TOP of the picture, in the middle - RACE CONTROL · INCIDENT NOTED,
  UNDER INVESTIGATION, the decision - up for seven to nine seconds and away; between them the case is the magnifying
  glass by the cars on the tower. Two cards at most; the commentary's line and the replay window move down under
  them. (They were under the map, where the column of cards on the right ran into them.)
- A touch that did nothing is not a case (26 cases in the first two minutes of a test race became 6 in five), and
  the same two cars touching again while their case is open are one incident.
- Under a safety car, VSC or yellows: a place that changes hands in the first six seconds after the flags come out
  (cars side by side as the board lit, the pack closing up) is not one to give back; a place handed straight back -
  most are, within three or four seconds - is never a card.
- Every other mode judges exactly as before (the seeded race is identical).

## The stewards' room (ui/StewardsRoom.js, new)
- After the flag, if anything is still open: PROVISIONAL CLASSIFICATION on the left, the stewards on the right. Each
  case comes up as a document - the cars, the lap and corner, the alleged breach - its evidence ticked off, a pause
  while they deliberate (longer for a hard one), then the decision stamped on it; the classification rearranges
  itself, the penalised car sliding down, the places gained and lost marked against the provisional order. Up to
  five are heard; Space / Enter / a click moves on.
- Your protest: if a rival hit one of yours, the stewards took no action, and your car did not finish or finished
  behind it, you may lodge a protest there ($0.2M deposit in the career - kept if it is dismissed). It is heard the
  same way: upheld (a penalty, the result amended) or dismissed. One a race. A contact dealt with here does not come
  back as a separate hearing in the HQ afterwards.
- Then FINAL CLASSIFICATION, and the points, podium and results use the amended result.

## Strategy on the screen (ui/TVStrategy.js, new)
- A purple STRATEGY card in the right-hand column, only when there is something in it for one of your cars (ten
  seconds, then quiet for that car for most of a minute; never under a safety car, in a replay or before the start):
  the car ahead, yours and the car behind, each with its tyre and laps on it and a strip of the laps left showing the
  window in which it is expected to stop (WINDOW OPEN in amber, BOX THIS LAP, TO THE FLAG);
- and the line that matters: UNDERCUT THREAT (the car behind, within three seconds, its window open), UNDERCUT ON /
  CHANCE (yours on the car ahead), OVERCUT (the car ahead pits this lap);
- when a rival pit wall moves against you the card comes up at once with the move: COVERED, UNDERCUT, OVERCUT,
  SPLIT, DUMMY TAKEN, NOT FOOLED, and under the safety car STAYS OUT / PITS.

## Tyres and the rules
- BOX FOR is the tyre that goes on. A set chosen on the pit wall is fitted whoever calls the lap - you, the plan or
  the strategist (who used to bring his own); changed after the stop is called, that stop takes the new choice. If
  you chose for a dry road and it is raining (or the other way about) the strategist says so and the wall shows what
  is going on instead - change it back if you disagree. With nothing chosen the wall shows the strategist's tyre.
- Red flag: the pit wall's tyre row becomes RED FLAG - RESTART ON. The set chosen there is on the car at the
  restart (nothing chosen: the engineers' choice, as before). START ON still works on the restart's grid.
- A red flag's change of tyres counts as a pit stop, for every car: nobody who had not stopped yet is made to stop
  again for the rule, and its set is a compound used.
- Two different dry compounds in a race of 8 laps or more, or 30 seconds at the flag - unless the car ran an
  intermediate or wet tyre, or race control declared the race wet (it does only when the road is properly wet:
  light rain is not enough). The AI takes a different compound at its stop or at a red flag when it still owes one;
  the pit wall's note says when a car of yours does; the driver's engineer says so with two laps to go.
- The strategy screen is the builder alone: no ready-made plans beside it. It opens as the engineers' own plan,
  every part of it yours to change, its predicted time shown against theirs.

## Cameras
- The kerb camera is a camera in the kerb: fixed (it neither moves nor pans), 30 cm off the kerb on the road's own
  edge, a wide lens tipped up a little, looking up the road at the cars coming - and, as the car goes over it, its
  twin looking down the road after them; the shot ends a second and a half later. It no longer asks the walls and
  fences for a view (that is what turned it into a pole camera at Las Vegas). Chosen as the camera, it reaches up to
  700 m ahead for the next corner. Measured at Las Vegas: on the kerb in 77 % of the time (the rest: no corner in
  reach on the Strip), 0 m of movement, 12 of 13 shots made the turn-round.
- The crane no longer becomes the helicopter: it tries both sides of the road, nearer and further, with a view of
  the car - or failing that of the road the car is about to come down - and if nowhere will do it is a trackside
  camera. 100 % crane in the same test.
- Replays (the window's, the stewards' review, the highlights): cameras on poles 11 m and more up behind the wall,
  looking over the catch fence, never through it; the car's place at a dozen moments of the clip is looked at from
  each and the clip is cut between them so that it is in clear view all the way - the camera that sees it longest
  first, the next only when that one loses it; more than three changes, or a stretch nobody sees: from above.
  Measured: one camera, 97-100 % of the frames in clear view.

## Fixed
- The picture-in-picture onboard no longer leaves as the move begins: once up it belongs to the battle, not to the
  shot - it stays through the feed's cuts while the two cars are together, through the pass and four seconds after.
- Kerbs, lines and fences were missing in the replay window and the onboard window: the far-off detail is left out
  by distance from the main camera, and the window's camera is somewhere else. Worked out again for the window.
- (Measured over the same 170 s of safety car at Silverstone, before / after: 29 spins / 0; 4 retirements / 0; 1735
  samples of a car weaving on the grass / 0.)
- The weave behind the safety car: about two thirds of a g at any speed (the same steering lock at 150 km/h as at
  60 threw cars sideways on cold tyres), less near the edge of the road, and none at all on the grass, on a kerb,
  with the car already sliding or within 3 m of the edge - a car off the road just steers back onto it.
- No follow camera anywhere in the team principal's modes: the window keeps its own camera while it closes (it
  flashed to a camera behind the car), and the camera controller is onboard-only there.
- The helmet camera: the shoulders and upper sleeves are lowered and narrowed while it is on (they filled the bottom
  corners).
- The T-cam of an upturned car moves to a mount on the side of the chassis instead of sitting inside the floor.
- Rival pit walls: the overcut and both safety-car reactions now happen (the safety-car one was decided after the
  car had passed the pit entry).
- Cutscenes in the HQ have no WATCH button: a scene that belongs to a room starts when you walk into that room (one
  a visit at most), the rest as before.
- Old career saves (V2.52) load and run on through three seasons.

# V2.59 (2026-11-15): the stewards on the broadcast, a flag by the cars that have finished, the replays in neon

Asked for: "add penalty visuals - not full screen just lil elements like the rest, investigating, delayed penalties
and whatnot - with icons to identify if smths being investigated on the leaderboard or if someoone has a penalty to
serve"; "put an icon for each car that's passed the chequered flag ... so its obvious who's racing and who isnt";
"Revamp all the replay transitions and all that to be way cooler ... with neon and smart appearances and removals".

## The stewards (ui/TVStewards.js, new - the team principal's broadcast)
- A small card for each case, on the right under the track map, that changes as the case does - its colour, its
  icon and its words, with a slide and a bar of light across it:
  - a collision: INCIDENT NOTED (the two cars) -> UNDER INVESTIGATION -> a TIME PENALTY (+5s / +10s, the car, why)
    or NO FURTHER ACTION. The verdict is held on the screen until the note and the investigation can be read (5.5 s
    from the contact; the race itself decides after 2.5 s, as before - nothing of the race is changed);
  - an overtake off the track: UNDER INVESTIGATION -> GIVE THE POSITION BACK (who to whom, its thirty seconds
    running out along the card's foot) -> POSITION RETURNED, or the penalty;
  - a place taken under the safety car or yellows: GIVE THE POSITION BACK with its eight seconds -> returned, or the
    penalty;
  - track limits: a strike (STRIKE 2 OF 3), the BLACK AND WHITE FLAG at the last warning, the penalty after it;
  - a jump start, a big cut, no mandatory stop: the penalty's own card;
  - PENALTY SERVED when a car has stood its seconds at a stop.
- Three cards at most; a closed case leaves after about six seconds (it folds to its icon, the icon goes). Race
  control's own lines sit under them. The old lines of text for these are gone.
- On the timing tower, by the car's name: a magnifying glass (pulsing) while it is noted or under investigation,
  two arrows while it has a place to give back, the seconds it has still to serve in a red tag (from the moment the
  broadcast has announced them, gone when served), the black and white flag once it has been shown it.

## Who has finished
- A chequered flag by every car that has taken the flag, on the broadcast's tower (its name and gap dimmed a
  little) and on the driving HUD's standings.

## The replays
- The replay's window (and the picture-in-picture's): a frame of neon. It opens as a line of light drawn out from
  its middle, which then parts with the picture between the two halves (only what is open is drawn), corner marks,
  its tab unrolling along its top; a flash when it is fully open. A replay's has its place in the clip along its
  foot and SLO-MO through the slow stretch. It closes the way it came - to a line, the line in to a point - and the
  LIVE tag pulses.
- The offer (R): a chip of neon, its key popping, its words unrolling, its clock a line of light; taken, it flares
  and folds shut.
- The highlights at the flag: into the reel, between two moments and back out, slats of dark glass edged in cyan
  and magenta close over the picture from above and below by turns, a word lit on them (HIGHLIGHTS, REPLAY 3 / 5,
  LIVE), and open the other way - the picture changes while every slat is shut. The dip to black is gone.
- The bug over a full-picture replay: a bar of neon drawn out from its middle, its words lit a moment after.

## Checked
- In a browser, on a real race's director with the stewards' state set by hand: every card and its changes, the
  tower's marks, the finished cars' flags; the chip, the window at three points of its opening and closing, the
  bug, the wipe held at three moments of itself (every slat shut when the picture changes).
- Three of the new graphics' state names clashed with styles the menus already had (one made the wipe a red bar):
  found in those pictures and renamed.
- A seeded race in the other modes is identical to V2.45-V2.58 (tools/race_probe.mjs 5 1 silverstone).
- Not checked: a team principal's race itself (the cards against the stewards' real timing, the highlights reel
  end to end); a real graphics card.

# V2.58 (2026-11-15): no racing line on the broadcast unless asked for

Asked for: "stop racing line automatically going on when the formation lap ends".

- Why it did: the team principal's broadcast took the racing line from your driving setting (on, unless you had
  turned it off). During the formation lap the race is held, so the line was never coloured in and could not be
  seen; the moment the lap ended and the race ran, it was.
- Now the broadcast has its own switch, off at the start of every session: nothing is painted on the road when the
  session begins or when the formation lap ends. L puts it on and takes it off there (RACING LINE ON / OFF), and
  does not change the setting you drive with. (main.js lineShown, tpStart, the L key.)
- Driving is as it was: your setting, L to change it.
- Checked: by reading (the three places that showed the line now ask lineShown); a seeded race in the other modes
  identical to V2.45-V2.57. Not run: a team principal's race in a browser.

# V2.57 (2026-11-15): rain on the glass - the visor's, and every camera's own with the cut

Asked for: "yeah add raindrops, also when switching cams there's a lil delay between the updated raindrops (cool
detail that each camera has different raindrops) but the delay breaks immersion".

New: `src/camera/LensRain.js`; in `src/main.js` lensFrame (which glass this frame's camera looks through) and
renderFrame; the visor's drops in `src/camera/HelmetView.js`.

## The delay
- What it was: the drops on a broadcast camera's lens were HTML laid over the picture, made again by the graphics'
  own update - which runs five times a second (up to 0.2 s after the cut) - and faded in or out over 1.2 s whenever
  the helicopter (which has none) was on either side of the cut. They also followed how wet the track was, not
  whether it was raining where the camera stood.
- Now the drops are drawn in the picture, in the same frame: the finished frame is copied and every drop is a small
  lens on it. Each camera has its own (a trackside camera by where it stands - the same drops when the director
  comes back to it; an onboard by its car), and a camera cut to has them on its first frame, as wet as a glass that
  has stood in that rain: checked - one frame after a change of camera, different drops, at full strength.
- They follow the rain where the camera is. A glass in a shower wets in a moment and dries over a few seconds.

## The drops
- Beads that sit where they landed, grow and go; runners that go where the water is pushed, each with a beaded
  tail: down a camera that stands still, up and back over an onboard's lens at speed (and fewer beads there: the
  air takes them).
- Each bends the picture behind it toward its middle, a little out of focus, with a glint on its shoulder.
- The helicopter's camera and the cameras under a roof (the garage, the pit wall) stay dry.

## The visor
- The same water on the helmet's glass (both the cockpit view you drive from and the broadcast's helmet camera),
  on the visor's own surface, under its tint and inside the helmet's lining: run down it standing still, pushed up
  and back over it at speed.

## Checked
- In a browser, a wet race at Silverstone with the rain held on: the visor at 220 km/h, a camera's lens with the
  water running down, a second camera one frame after the cut (its own drops, the water pushed up), and the visor
  dry again with the rain off.
- A seeded race in the other modes is identical to V2.45-V2.56 (tools/race_probe.mjs 5 1 silverstone).
- Not checked: a real graphics card (one copy of the frame and one full-screen pass, only while there is water on
  the glass); a team principal's race itself (the test switched cameras by hand).

# V2.56 (2026-11-14): the helmet camera - the car whole, a real helmet round the lens, a visor that takes the light

Asked for (with a frame of F1's own helmet camera): "fix helmet cam so it doesnt clip thru the car (becoming see-thru)
add like the realistic visor glare and whatnot so it looks inside of the helmet (not just a png but actual
environemnt based lighting)".

New: `src/camera/HelmetView.js`; in `src/main.js` helmetFrame (which camera is a helmet camera this frame) and
renderFrame (its second pass). It is the cockpit view you drive from and the broadcast's HELMET camera.

## The car, whole
- Why it was see-through: the whole game is drawn with a near plane of 30 cm (nearer than that, the painted lines
  far down the road flicker in the depth buffer), and from the driver's eyes the halo, the cockpit's rim, the wheel
  and his own arms are inside 30 cm - cut open wherever they came closer.
- Now the car the camera sits in is drawn a second time on top of the finished picture, from 3 cm, with the first
  pass's shadows; the world keeps its own near plane. The driver's own head is taken out of that car while the lens
  is in it (it used to be cut away by the near plane), and put back the moment the camera leaves.
- The broadcast's helmet camera has the halo (its pillar down the middle of the picture, as it is); your own cockpit
  view keeps it hidden, as before.

## The helmet
- The flat oval that was laid over the cockpit view is gone (it stays only for the last seconds through your
  driver's eyes). In its place, fixed to the lens, real geometry: the lining round the eye-port - soft at its edge,
  as a thing 7 cm from the eye is - and the visor's glass, curved about the head.
- The lining is lit by the light that comes in through the port: the sun when it stands in front of the visor (the
  chin bar and the brow catch it), the sky's and the ground's own light otherwise; black at night.
- The glass takes the light that is there:
  - its haze is the scene's own environment map (the one every car and building is lit with) looked at through the
    glass and scattered - brighter toward the bright side of the sky, nearly nothing at night;
  - its sheen where it curves away at the sides is that map reflected;
  - the sun draws a halo round where it stands and a long streak along the glass's wiping scratches, through the
    dust on it - by the sun's own colour and strength (weaker under cloud, the moon's faint blue at night), only
    when the sun is in front of the driver, and not when a grandstand, a bridge or a building stands between
    (looked for a few times a second, eased in and out);
  - its coating tints the road a little and turns colour toward the curve; a darker band along its top; rain
    lifts the haze.
- The helmet moves a little on the head: out with a corner's load, a fine buzz with speed and over the kerbs.

## Checked
- In a browser, a car in a race at Silverstone: the cockpit view (no halo), the broadcast's (halo), a low sun put in
  front of the car (the glare), the head turned to the side, at night; leaving the view puts the head and the halo
  back and takes the helmet away. No part of the car cut open in any of them.
- A seeded race in the other modes is identical to V2.45-V2.55 (tools/race_probe.mjs 5 1 silverstone).
- Not checked: a real graphics card (the second pass is about fifty draw calls: one car); a team principal's race
  itself (the same switch, on the director's HELMET shot); raindrops on the visor are not drawn.

# V2.55 (2026-11-14): a helicopter that flies, no drone, onboards that stay onboards

Asked for: "remove drone cam, fix helicopter cam so it's natural, not always the same pace as the car like a real
helicopter shot and it doesnt like switch sides (... it just zooms over to another chopper angle instead of being a
continuous long shot)"; "after a car DNFs you can still access their onboard, I never want it to cut to the follow
camera. The point is to have an authentic broadcast cams".

## The helicopter (camera/HeliCam.js, new; the broadcast's and the replay theatre's)
- What it was: a point fixed to the car - 70 m behind, 40 m to one side, 55 m up, in the car's own frame - so it
  went at exactly the car's pace and swung round with every turn of the car; and when something stood in the way it
  was moved to the next place on a list (the other side, higher), the camera sliding across: the "zoom over to
  another angle".
- What it is: one aircraft with its own place, speed and weight. It flies for a place ninety metres short of where
  the car will be in a moment, along the line from where it is - at about 280 km/h, more when the car is far down a
  straight, with a helicopter's acceleration. On a straight the car pulls away and the lens goes long (and slowly:
  the car shrinks and grows in the picture); into the braking zones and through the slow corners it catches up,
  cuts the corner and drifts past. The further off, the higher it sits. A car standing still is circled slowly.
- It never changes place: with something between it and the car it climbs and comes in closer over it, and goes
  back out and down after three seconds of clear view. Over the pit lane it comes nearly overhead the same way.
- The director moving to another car near where it is flying is the same flight: the aim pans across. A car
  somewhere else on the circuit is a cut, as any camera's.
- Measured over a lap and a half at Silverstone (the theatre) and 90 s of the broadcast director kept on it: the
  biggest move in one frame 3.9 m (its own speed - no jump), 16 m/s2 at most, 10 to 370 m from the car (the middle of
  it about 170 m), a view of the car 96 to 100 % of the time away from the start.
- The start of the race is the helicopter's now.

## The drone
Gone: from the director, the pit wall's camera buttons and the C key's round. A pit wall that had remembered it as
its camera opens on the director's choice.

## Onboards stay onboards (camera/CockpitCamera.js)
- An onboard on a car in the air or a wreck used to be replaced by a camera following the car from behind and to
  one side. Now the lens stays where it is bolted: it goes over with the car, and looks out of the wreck afterwards -
  the T-cam, the rear-facing one, the helmet camera; in the broadcast, the picture-in-picture, and your own car.
  (The chase and TV views, which follow the car anyway, are as they were.)
- A car out of the race is still in Tab's round of cars to follow for as long as it stands at the circuit.
- Checked with a car launched into a roll in a race, the director kept on its onboard: the same camera on the same
  car through the accident and after it had retired, the lens never more than 0.8 m from the car's centre, the
  picture upside down where the car came to rest.

## Checked
- A seeded race in the other modes is identical to V2.45-V2.54 (tools/race_probe.mjs 5 1 silverstone).
- Not checked: on a real graphics card; the helicopter at the other three circuits (the same code; Las Vegas's
  towers are where it will climb most).

# V2.54 (2026-11-14): rival pit walls against you, a theatre with everything in it, replays out of the game, the pit crews

Asked for: "Rivals should change race strategy against the player"; "Theatre should keep smoke, fire, debris and
changing weather and pit crews"; "Fix a glitch where the pitcrew comes out late and all the pitgun people go on one
side of the car, where they then have to run back to the other side"; "Make theatres exportable".

## The pit crews (the glitch)
Measured with a car's path into its box traced against where each man stood (30 times a second):
- The cause of the men on one side: a car turns in to its box from the lane, so the line it points along sweeps
  across the men waiting on the garage side. They took themselves to be in its way, stepped across in front of it to
  the lane side, and ran back through the car once it had stopped - the front wheel's three men and a stabiliser,
  2.9 m from their places as the car stood still. Now their own car is looked at closer in, and whoever is in its way
  steps back from the box on the side he is on, never across (world/PitCrew.js _man).
- The cause of the crew out late: in the team principal's x2 / x4 (and the spectator's fast forward) the cars ran at
  that speed and the crews at x1 - a quarter of the time to get out, every stop. They move in the race's time now.
- And a crew was only sent out once its car was in the pit lane (a box near the lane's start: a second and a half).
  It goes out when the car is called in and within 650 m of the pit entry.
- A stop first seen by a camera cutting to it (the broadcast) has its crew at its places, not running out mid-stop.
- After: every man at his place when the car stops, three stops of three (the rear jack man waits at the side until
  the car is in, as before).
- Your own stop has its crew wherever the camera is (it used to wait for the box to come within 220 m of it).

## The theatre keeps what was round the cars
The tape (race/RaceTape.js) records, and the theatre (main.js thFx*, thAfter) plays back:
- Pit crews: every stop's moment, length, tyres and wing change. The crews in the theatre are the race's own
  (world/PitCrew.js) following that script: out before the car, the wheels off and on, the jacks, back inside.
- Fire and smoke: what was burning or smoking on which car, each second - and the powder when the marshals put it out.
- Debris: every burst as it happened (contact, a tyre's strips); wound to a moment, the last 25 s of it is thrown
  and let fall first, so it lies where it lay.
- The weather as it changed: the water on the road every four seconds (the road's own texture), the showers where
  they were (rain where the camera is, the sky darkening), the spray off each car by how wet the road under it was.
- Not kept: a wheel rim's sparks and a tyre coming apart on the car (the car's damage record shows the tyre gone),
  the halves of a car torn in two flying (they are where they came to rest).

## Replays out of the game
- SAVE on the replay screen: the whole replay as one file (.f1replay, about 0.8 MB a minute of race, gzip). 
  REPLAY on the home screen opens one: its circuit is built, day or night as it was, and the theatre runs on it -
  every car, camera, moment, the crews, fire, weather, the photo mode.
- CLIP (or R): what plays from then on is recorded as a video (the picture only, none of the buttons; WebM, or MP4
  where the browser has no WebM) and saved when you press it again, when the playing stops, or after ten minutes.
- A saved replay opens in the version that made it or a later one; a circuit rebuilt in a later version would put
  the cars where the road was.

## Rival pit walls against you (race/RivalWall.js)
Every car already had its own plan; this is what a rival team does about your car (or your two, from the pit wall):
- Your crew comes out and the car just ahead is called in on the same lap to cover - one car a team, with your tyre
  where it reaches the flag. How often: the team's strategist in a team principal's career (their rating, HQ:
  RIVALS), else the team's tier.
- Call your stop off (the dummy): a sharp wall calls theirs off too if there is road left before the pit entry; the
  others stop for nothing, and a wall that has bitten looks twice until you really stop.
- You stop and a rival close behind stays out and pushes for a lap and a half (the overcut), then takes a tyre a step
  softer than yours where one reaches the flag.
- A rival held up behind you for half a minute stops early, sooner than its own plan would (the undercut); its
  team-mate behind it is left out long.
- Under the safety car the rival right behind you does the opposite of what you do.
- Your engineer says each move (the pit wall's radio in a team principal's race).
- Seen in a 12-lap race with a mid-field car made "yours": an undercut on it, a cover called and called off again
  when the crew went back in, a second undercut, the real stop covered by one Mercedes and not the other.
- Not in the simulated laps (SIM): those keep the lap model's own stops.

## Checked
- A seeded race in the other modes is identical to V2.45-V2.53 (tools/race_probe.mjs 5 1 silverstone).
- In a browser: a two-lap race with showers, eight stops, a fire, smoke and a forced hit, then the theatre on it
  (crews at two stops, the fire, the debris, the rain), the tape saved and read back (every array the same), the
  file opened as from the home screen, closed back to the menu.
- CLIP: with the recorder on and a dozen frames drawn, a WebM file came out (the software renderer here draws a
  frame every few seconds on its own, so no clip at a real frame rate was made; a recording that ends with nothing
  in it says so on screen).
- The crews at Montreal as at Silverstone; the rival walls in a race you drive (a stand-in car): not in a team
  principal's race, where the same code answers your two cars.
- Not checked: a real graphics card; a clip at full frame rate; a replay file from a long race (size by arithmetic:
  about 50 MB for 60 minutes).

# V2.53 (2026-11-14): a replay theatre, wheels that turn in replays, a harder manager, rival teams, the years, the walls

Asked for: wheels turning in replays; a harder manager career ("simmed quali as williams and got p3 and p6 first
race"); deep rival teams; multi-season depth; the commentary's voice gone (captions kept); a post-race highlights /
replay menu "like in f125" built on the photo mode, flashback and replay that exist; "fix the montreal turn 3 bug and
similar". Proper race weekends were set aside for later, by request.

## The theatre: the race again (REPLAY on the results)
New: `src/race/RaceTape.js` (the tape), `src/ui/Theatre.js` (the screen), glue in `src/main.js` (theatre*, thPose).
- Every race is taped from the lights to the end: each car's position and attitude, how far its wheels have turned,
  its steering, speed, brake light, DRS, tyres, whether it is in the pits or out, the safety car, the running order
  each second. 15 frames a second (10 or 7.5 for long races): 2.4 MB for a two-lap race of 22 cars, about 0.7 MB a
  minute. It only reads the race - a seeded race with it running is the same race.
- REPLAY on the result screen opens it: a timeline to play, pause, drag, step a frame at a time, run from a quarter
  speed to eight times; any driver to follow (the tower on the left is the order at that moment: click a name); six
  cameras (trackside, chase, T-cam, nose, front, helicopter).
- The race's moments are found as it is taped and marked on the timeline: the start, every pass for position that
  stood for four seconds (not two cars swapping side by side, not a damaged car being passed), contacts, crashes,
  stops, retirements, fastest laps, the safety car, the flag. MOMENTS lists them (THE RACE / OVERTAKES / INCIDENTS /
  STOPS); a click jumps to four seconds before; PLAY THESE ONE AFTER ANOTHER runs them as a reel.
- PHOTO (or Tab) on any frame opens the photo mode that was already there, on the car being followed.
- Cars show the damage they had at that moment (the cars' own damage record). Not replayed: pit crews, smoke, fire,
  debris, the weather as it changed. Kept for the last race only, in memory: not saved to disk, no video export.

## Wheels in replays
The instant replays (window and highlights) and the theatre pose each car with its wheels turned as far as they had
turned and steered as they were steered (CarMesh.pose; the rolling record keeps both now), brake light and DRS too.

## The manager is harder
Measured with careers simulated without a browser (hundreds of first races, seasons on end):
- The whole grid was within 0.3 s a lap and a Williams 0.14 s off the quickest car: in the race model it finished on
  the podium in about half its first races. And a lower team gained pace per season far faster than a top one: a
  Williams that simply developed was the quickest car after four rounds.
- The manager's grid is wider now (a team's `gap`: 0.16 / 0.34 / 0.5 s a lap by tier on top of what there was), the
  race model's lap-to-lap luck a quarter smaller. A new Williams: median P8 in its first race, a podium in 8 % of
  them, top six in a third; McLaren on the podium in 75 %; Haas and Audi never.
- The board's target can no longer be talked down: never more than a place below last year's finish.
- Rivals' pit stops carry their crew chief's rating, as yours do.
- Not run: a simulated qualifying in the 3D game itself (the same car numbers feed it).

## Rival teams (HQ: RIVALS)
New: `src/career/Rivals.js`, pages in `src/ui/ManagerHub4.js`.
- Each team has a principal, a way of working (a steady stream, big packages, the grey areas, counting the money,
  next year always), a technical director, strategist and crew chief with ratings, and money that comes and goes.
- Their upgrades are news ("Ferrari bring a major upgrade: about 0.09 s a lap"); the page shows every car against
  the quickest and what each has found lately.
- They come for your staff: match the offer or lose the man to his deputy. You can go for theirs (a fee, their
  goodwill, and he may say no).
- PROTEST a team's new parts: a deposit; upheld (likelier against a team that works in the grey areas) they lose
  most of the upgrade and $2M; dismissed, you lose the deposit and some of your word.
- A principal who misses his target two years running is sacked; the new one works differently.
- Not built: rivals changing their race strategy against you, votes on the rules.

## The years (HQ: MARKET, ACADEMY, DRIVERS)
New: `src/career/Seasons.js`.
- Drivers have ages: they improve to about 27, hold it, fade from 33, and from 36 any season may be the last - said
  three quarters through the season so the seat can be planned. Rookies come up each winter.
- Contracts: one, two or three years; what a driver asks depends on his worth, your place in the order, his mood and
  whether someone else wants him. A star will not join a team at the back.
- The market moves from mid-season: teams renew or sign each other's drivers for next year, and make offers to
  yours - extend him or he goes in the winter. MARKET shows next season's grid as it fills.
- The academy: scout prospects, race them up through F4, F3 and F2, promote at 76 (yours to sign first, cheaper).
- Regulations change every third season: every car is a new one - the parts built are gone, the factory stays - and
  the order is drawn again from how good the old car was, the factory, the early work on the new car, and luck.
  Between changes the field closes up a little each winter.
- Simulated five to nine seasons on end as three different teams: no errors, every team with two drivers at the end.

## Walls that come in (Montreal Turn 3 and the like)
- The cause: a barrier is a distance from the road at each metre of lap. Where its line closes in (a run-off
  narrowing, a wall's return), a car rolling along it found the line past its own centre from one step to the next -
  a tyre wall cannot push it back that fast - and was then held OUT, behind the wall.
- Now only a car that went over a barrier (in the air) is beyond it; one the line closed on has met the barrier's
  face where it turns in, and is stopped there (vehicle/Car.js _barriers: _over, cameIn).
- New test, `tools/pocket_probe.mjs`: a car rolled along every narrowing barrier of a circuit at two speeds, both
  ways. All four circuits, 146 runs: 9 cars through a barrier before, 1 after (Montreal, a car coasting down an
  escape road past the START of a wall - a wall that begins has no return; left as it is).

## The commentary's voice
Removed: no VOICE button, no V key, nothing spoken. The captions are unchanged.

## Checked
- A seeded race in the other modes is identical to V2.45-V2.52 (tools/race_probe.mjs 5 1 silverstone).
- In a browser: a two-lap race taped and watched in the theatre (jump to a pass, four cameras, the reel, photo
  mode, back to the results; wheels measured turning and steering); the HQ's RIVALS, MARKET, ACADEMY and DRIVERS
  pages and their buttons, no errors.
- Not checked: a real graphics card; the theatre after a long race (memory by arithmetic only); an old save opened
  with the new systems (they fill themselves in on load, by reading).

# V2.52 (2026-11-13): the cutscenes rebuilt - dense sets, no title card, no replay list; and the hats

Asked for: "remove the ability to rewatch cutscenes, it makes them feel like a flex by the devs - whereas it should
just be an integrated thing, and make the title screen way less long ... or remove it altogether and just have some
overlayed clean text for a small period. Enhance each cutscene to be less low poly, actually dense and interesting
aestethically - fix all z-fighting". And, while that was being built: "fix the huge hats".

## No list of scenes to play again
- The STORY page's "Scenes" card (every scene seen, each with an AGAIN button, and WALK THE FACTORY) is gone. A scene
  is seen once, when it happens. What is left is the trophy room - a room to walk round, not a scene - under "Roll of
  honour", with how much stands in it. The factory's tour still plays itself when a facility is built up.
- The career no longer keeps each scene's data to replay it (only which have been shown): smaller saves.

## No title card
- A scene used to open on black with its title in the middle for a second and a half, then the picture. It opens on
  its first shot now (out of black in half a second), the title a few small words in the top left corner for three
  seconds, gone by themselves (ui/Cine.js .ttl). Not over a question, a title between two parts of a scene, or the
  trophy room.
- The titles BETWEEN parts of a scene ("Forty minutes later", a documentary's own title) are as they were.

## The sets rebuilt (new: ui/CineKit.js, ui/CineProps.js; ui/CineSets.js rewritten)
The kit a scene builds with:
- A box has its edges rounded, a cylinder is round (two to three times the segments), things are turned on a lathe
  (cups, pots, lampshades, tyres) or run along a curve (cables, hoses, rails).
- Surfaces have a grain, painted once and tiled by the metre: concrete, epoxy, asphalt, paving, carpet, plaster,
  wall panels, ceiling tiles, wood, planks, slats, cloth, leather, brushed and perforated metal.
- A batch: everything standing still in a set is welded into one mesh a material, so a set of some thousands of
  parts is 50-120 draw calls.
- The people who are only there (the press, the launch's guests, the paddock, the pit lane) are real figures now
  (world/Crowd.js, drawn as one mesh a kind) - they were a cylinder with a ball on it.
- A soft shadow lies under everyone and everything that stands on a floor, and under the car.
- Through the lens: the picture is smoothed (it was not, with the blur on), and lamps glow (a glow pass that takes
  only what is brighter than anything a lamp lights: ui/CineKit.js GlowPass).
- A helmet set down in a scene is the real helmet (the driver's own design), not a ball.
The twelve sets, each built again where the old one stood (so every scene's marks and cameras still hold):
- Garage: epoxy floor with the bay marked, panelled walls, the engineers' bench under the screens (laptops,
  headsets, mugs), cabinets with drawers and casters, tyres in blankets with their cables, a spare wing on its
  stand, flight cases, gas bottles, tool boards, the light box over the bay, the boom and its guns, the pit lane
  outside with its lines, the wall, the fence, a grandstand.
- Pit wall: the stand with stools, desk, screens, button panels, the catch fence either side, the garages behind
  with lit bays in other teams' colours, people in the lane, the grid's slots, boards on the far wall, a stand.
- Boardroom, office: carpet / planks, slatted end wall, a skyline in three depths, pedestal table with papers,
  laptops, glasses, water; high-backed chairs on five-star bases; sideboards, pictures, plants, pendant lamps;
  the office's shelves of books (and the cups won), sofa, desk lamp, door.
- Press room: drapes, the board framed, the table in its cloth, microphones, the press seated in rows,
  photographers down the sides, television cameras on tripods, a truss of lamps.
- Launch: the rig (two trusses, eighteen lamps, line arrays), the guests behind a barrier, a camera platform.
- Cool-down room, stewards' room, interview studio (soft boxes, a camera, cases, cables), paddock (two-storey
  motorhomes with glass, decks and awnings, hedges, flags, parasols, people, trees), factory (trusses, ducts, glass
  partitions, desks with screens, the mill, the autoclave, the lounge, the simulator, server racks, the bay, the
  gym), trophy room (cups turned on a lathe under glass, ropes, benches, pictures).

## Z-fighting
- Causes found in the old sets and removed at the root: lines and mats laid 4-8 mm over a floor (now decals: drawn
  over what they lie on whatever the depth buffer says - k.floor / k.decal); signs and screens a centimetre or two
  off their wall (the same); the camera's near plane at 5 cm (10 cm now: twice the depth precision).
- New tool, tools/cine_zfight.mjs <scenes>: every pair of faces of different materials lying in one plane, facing
  the same way, one over the other. Run over thirteen scenes (every set): what it found and was real is fixed (a
  plant's soil level with its pot's floor, a shelf's back panel flush with its sides, the stewards' carpet edge, the
  motorhomes' fins); what is left in its lists are faces nobody sees (the outsides of walls, tops under a roof).

## The hats
- A team cap (and a marshal's) was a dome 23 cm across sitting on top of the hair. It is a shell fitted to that
  head's own skull now, from a band above the brow, with a thin curved peak (world/People.js). Everywhere a cap is
  worn: scenes, the pit wall, marshals, crowds near the camera.
- The pit crew's helmet is 8 % smaller (it read as a ball on the shoulders).

## Checked
- All 23 scenes build and play through their shots with no error (tools/cine_sheet.mjs, the lens on). Pictures looked
  at for 17 of them and the opening of one as the player sees it (title over the first shot, gone by 4.5 s).
- A seeded race in the other modes is identical to V2.45-V2.51 (tools/race_probe.mjs 5 1 silverstone).
- Not checked: a real graphics card. Everything was rendered by a software renderer: the frame rate of the denser
  sets with the smoothing and the glow is not measured (the "lite" setting turns both off, with the shadows), and the
  z-fighting is checked by the geometry and by those pictures, not on a 24-bit depth buffer.
- Fixed on the way: in the paddock scene a flag pole and a chair stood in front of two of the cameras.
- Found on the way: the first version of the cap changed the seeded race (a retirement that was not there). three.js
  draws four random numbers for the id of every object it makes, a crowd's figures are baked while a race runs, and
  the cap had one geometry more than the old one (its button). The button is part of the peak's geometry now and the
  race is the same again - but any change to how many objects a crowd figure is built from will do this.

# V2.51 (2026-11-12): the formation lap, three more cutaways - and the list that came in while they were being built

Two requests. First: "add the formation lap and the missing cutaways (skippable)". Then, while that was being
verified, a list: cars at Montreal going wide "acting like the grass is a viable line" and ending up stuck behind
the barrier; safety cars rare in manager mode; replays too slow and not closing on their own; cameras hopping
between shots of the same kind; defaults for the pit wall; menus with dead space; a strategy screen that only offers
three near-identical plans.

## Montreal: cars behind the wall after a pit stop (it was the pit exit, not Turn 1)

Measured with AI races and a probe that logs every car beyond a wall. Before: 12 to 17 cars a race were beyond the
circuit's wall at 585-600 m - every car that had just pitted - and one or two a race stayed there, driving on the
grass behind the wall to Turn 3 (850 m), Turn 8, the hairpin, some stopping for good.
- The cause: Montreal's pit exit road comes out onto the exit of the Turn 2 hairpin, and it was driven at its own
  limits (2 g): cars arrived at 200 km/h, crossed the road at the lane's angle at 118 km/h with the steering full
  over, slid off its far side through the opening, and were beyond the wall where it starts again 10 m later -
  where the wall then held them out (a car beyond a barrier stays beyond it).
- An exit road is now driven for the road it comes out onto: no quicker than four fifths of the racing line's
  speed over the next 140 m of circuit - where that is a slow piece of road (under 45 m/s; ai/AIDriver.js
  pitDrive). At Montreal that is the pit limiter's 81 km/h all the way out: the same car joins 4-5 m from the
  centreline and is at 150 km/h on the road 120 m later. There the lane's own line is also followed until the car is
  on the road AND pointing along it (it used to be handed to the planner at the merge line, mid-turn). A lane that
  joins a fast piece of road (Silverstone's) is driven exactly as before.
- On a walled circuit, where the circuit's wall is open for the lane (the way in, the way out), a car that is NOT
  in the lane now meets the lane's own outer wall there instead of nothing (Track buildPitLane outerD, Car
  _barriers; never nearer the road than the circuit's own wall line): missing the last chicane into the escape road
  no longer lets a car run on into the park behind the wall.
- After: at the pit exit, 0 cars beyond the wall in six 10-lap races (was 12-17 in each of three).
- Still there: at Turn 3 one car in two of the last three races ended up behind the left wall (a run-off whose
  wall line closes in along the lap faster than the car moves in: the wall model is a distance from the centreline
  per metre of lap, and has no end wall for a pocket). Not fixed here.
- Silverstone, Austin and Las Vegas checked the same way (two 10-lap races each): no car driving behind a wall;
  the cars found beyond one had crashed over it or were beached in a run-off.

## Safety cars in manager mode

Not rarer than in the other modes - but two things made them look it:
- SIM 1 LAP / 5 LAPS / TO FLAG run the race model, which has its safety cars inside it (the field closes up) and
  shows none. The pit wall now says so afterwards: "A safety car in those laps: the field closed up behind it."
- Watched live, a car stopped off the road was nearly always a VIRTUAL safety car (three of four neutralisations in
  the first race measured). Now a car that has CRASHED within seven metres of
  the road (it wants a crane, marshals at the road's edge) brings the real one out; a car that simply stopped clear
  of it (engine, gearbox), or a wreck deep in a run-off, is a VSC. All modes.

## Replays

- Real time, slowed to half only through the moment itself (half a second either side) and back up to speed; once
  through - no second, slow-motion pass - and the window closes itself: it opens and closes over a third of a
  second (a curtain lifts, the window grows the last tenth) rather than appearing and vanishing. R or Esc still
  closes it early; you never have to.
- The highlights at the flag: real time with the same dip in speed, the picture dipping to black between moments.
  The reel also stopped after its first moment: between two moments nothing held the finished race, and its own
  frame ran on under the reel. It is held from the first moment to the last now, its safety net counts the reel's own time rather than the clock
  (the test machine's slow frames ran into a 150 s wall-clock limit), and each moment is cut 2.2 s after it happened.
  Seen: both moments of a two-moment reel played and it ended by itself.

## Cameras hopping

- A trackside camera now stays with its car for two seconds after it has gone by (70-220 m, by speed) instead of
  being dropped 45 m past the pole, and is placed a little further up the road: 4-6 s a shot where it was 2-4.
- After a shot of under four seconds the director does not pick the same kind of camera again.
- The pit lane: one camera placed 70 m ahead and 7.5 m up, chosen to see the car now and the lane 50 m on; it is
  placed again only when it has lost the car three looks running and not within 5 s, or the car is 125 m past it
  (it was looked at every second and moved whenever a gantry crossed the line: a new camera every 30 m). Measured
  on the build before the last of those rules: 7 placements over a 21 s stop, 3.0 s each. The pit lane in the
  corner window the same.

## The formation lap (Space or Enter skips it)

Before the lights in a Team Principal race: the field pulls away from the grid in order, is seen half a lap on
weaving to warm its tyres (from the fence, then onboard with your first car), and comes back round to form up. About
42 s; "SPACE - skip the formation lap" under the caption.
- The race itself does not run a step while it plays: the cars are driven round by the lap and put back on their
  slots exactly as the race director placed them (every car's state compared before and after: identical), so the
  race that follows is the one there would have been. SIM buttons end it too. A restarted race has none.
- The tower shows grid order during it (the race director's own order is the entry list's until its first step).

## Three more cutaways (X: back to the race)

- The pit wall: your three at their screens opposite your garage, in your colours, headsets on - calm after a
  stop, on their feet for a pass into the top three or the lead and when your car comes home in the points, heads
  down for a retirement or a touch. Seen from a camera on the stand itself.
- A marshal's post: the yellow flag waved at the post before an incident once the safety car's banner has gone,
  the green when it clears, the chequered flag on the pit wall at the line. Marshals now stand on the ground where
  it is not flat (Austin: they stood at sea level).
- A driver walking away: from a car stopped out on the circuit (not hurt, not in the pits) once it has stood still
  two seconds - over to the barrier and off along it, the camera on the road's side of the car.
- At most one cutaway every 20 s unless it is one that must be shown; never while you keep a camera or follow a car.
  Cutaways asked for together take turns with at least four seconds of the race between them (at the flag: the
  crowd, the marshal with the chequered flag, your pit wall as your car comes home).

## The pit wall as you left it

SAVE AS MY DEFAULT on the wall (the SET-UP row): both cars' tyre / fuel / ERS modes, every order, who makes the
calls, and the camera are kept and put back at the start of every race. RESET forgets them. A plan chosen on the
strategy screen is still followed unless your default is to make the calls yourself.

## The strategy screen

- A fourth plan, D, "your own": the tyre each stint is on (so the start tyre too - hards if you like), the lap of
  every stop, and the number of stops (0-3). It is timed like the others, says when a set will not last its stint
  (and cannot be confirmed then) and what the rules will make of it (two dry compounds, the mandatory stop).
- A, B and C now start on different tyres where each has a plan: the quickest, then the quickest starting on each of
  the others - not one race with its stop moved.

## The HQ's pages

- Cards are packed into columns (each column filled top to bottom; as many columns as the page has cards for, and
  of those the count that leaves the page shortest) instead of rows whose height was the tallest card's.
- A page with little on it is shown larger - up to 130 % - as long as all of it still fits without scrolling.
- The factory on a wide screen is two columns (the branches and the queue; the branch chosen and its parts) instead
  of one 860 px column down the left.

## Checked

- A seeded race in the other modes is identical to V2.45-V2.50 (tools/race_probe.mjs 5 1 silverstone) - with the
  pit exit change scoped to slow merges and the lane's fallback wall to walled circuits; the first version of the
  fix (every exit road at half its limits) made that race different: two accidents at Silverstone's pit exit.
- Seen in a browser, in one 12-lap race and a 3-lap one at Silverstone: the formation lap (run through: 42 s, every
  car's state identical before and after; and skipped with Space), the strategy screen with plan D built and
  confirmed, the pit wall in three moods, the yellow-flag marshal, the driver walking away, the replay window
  (6.0 s, closed by itself, gone 0.2 s later, the race 5.6 s further on), the chequered-flag marshal and the pit
  wall at the flag in turn after the crowd, saved defaults put back at the next race's start and RESET, every page
  of the HQ at 1366 x 768.
- Not seen: a cutaway at Austin (the marshals' height fix there is by reading, not by picture); the pit lane's
  camera after its last rule change; the SIM buttons' safety-car line.

# V2.50 (2026-11-11): the broadcast gets a show - commentary, radio on air, a map, replays in a window, highlights

Asked for: "Add them all, 1-26" - the list of what the Team Principal broadcast was still missing. The list had 21
items, not 26; all 21 are below with what was built and what was not. Only the Team Principal broadcast changes: a
seeded race in the other modes is identical to V2.45-V2.49 (`tools/race_probe.mjs 5 1 silverstone`).

New file `src/ui/TVShow.js` (the show: what is said and shown around the pictures); the pictures themselves are in
`src/camera/TVDirector.js` and `src/main.js` (tpPip, tpReplay*, tpHighlights).

What you hear and read
1. Commentary, two voices (a lead, an analyst): a caption at the top of the picture for the grid, the lights, lap
   one's winners, passes, fights, a car catching another, stops, fastest laps, spins, retirements, contacts, the
   safety car, red flags, restarts, penalties, track limits, rain coming, team orders (obeyed or refused), the last
   lap, the flag. A line that matters more cuts in on one that matters less; nothing is said twice within 24 s.
   Spoken aloud by the browser's own voice if you turn it on (the VOICE button on the feed, or V): off by default,
   remembered. Captions only otherwise - there is no recorded commentary.
2. Team radio on air: every line a driver or the pit wall says in a race comes up as a TEAM RADIO card in the team's
   colour with a beep (the same lines the pit wall's log already had).
3. Sound by camera: the engine fades with the camera's distance from the car for trackside, crane, kerb, drone and
   helicopter shots (full on the onboards); the crowd rises for the lights, a pass for the lead, a pass by your car,
   the flag; a gasp for a spin or a contact; stings for a replay, the safety car, the red flag.

What is on the screen
4. Sector colours in the tower: three chips a row (purple / green / yellow) from the timing's own sectors; a fastest
   lap is called with its time.
5. A track map, top right: every car a dot in its team's colour, yours larger, the car on screen ringed, the safety
   car in yellow; the outline goes yellow under a safety car and red under a red flag. Hidden under 1000 px wide.
6. The pit window: "P9 IF HE STOPS NOW", who he would come out behind and by how much, who is the next car back -
   from the gaps and the circuit's own pit loss (less under a safety car). From lap 2, for each of your cars.
7. Tyre history: a car's stints as bars in the compounds' colours, laps on each.
8. The speed trap: the four highest speeds seen so far.
9. The stewards: "incident noted" on a contact and "no further action" nine seconds later if no penalty came;
   penalties called from the stewards' own log; track-limit strikes counted ("strike 2 of 3", the black-and-white
   flag at the last); an overtake off the track under investigation.
10. A driver's season in a card (championship place, points, wins, podiums) - in a career only: a single weekend
    has no season to quote.
11. Before the race: the starting grid as a graphic in grid order, two columns, tyres per car, how many on each
    compound, a wet track flagged; the commentary names pole and where your two start.
12. The start: a drone behind the grid for the first eight seconds, "lights out" called, the three best reaction
    times, then at the end of lap one who gained and lost the most places (from real grid positions).
13. The flag: a chequered banner, the winner called, then the classification of the top ten with real gaps (or laps
    down) and a driver of the day (most places gained from the grid).
14. Qualifying, when you watch it: an ON A LAP card for the car on screen (its three sectors' colours, the live
    delta to its best), a call at the end of sector two, a call when provisional pole changes. Qualifying here is
    one session: there is no elimination zone to show.

The pictures
15. Highlights: every moment that was offered as a replay is kept (up to six); at the flag they play one after
    another as whole-picture replays - "HIGHLIGHTS 2/6 · ..." - before the winner's lap of honour. Esc, Space or
    Enter skips. Not shown with fewer than two moments.
16. Picture in picture: your car in the pit lane in a window while the feed is elsewhere; the attacker's onboard in
    a window during a fight seen from the fence or the air (every other such shot).
17. Replays no longer stop the race: an accepted replay plays in a window while the feed and the race run on - once
    at 0.7 speed, then the moment itself again in slow motion (0.34) from a second camera - then closes. R or Esc
    closes it early. A moment that comes up during a replay is kept for the highlights, not offered.
18. New cameras, in the director's mix and on the pit wall (HELMET / KERB / CRANE / DRONE, or C to cycle): a kerb
    camera at the apex of the next corner, 0.55 m up; a crane at the fence that rises and swings out as the car
    passes; a drone; a helmet camera; and now and then a view of the whole circuit from the air. Each is placed only
    where it has a clear line to its car (the V2.47 test), otherwise a trackside camera or the helicopter takes it.
19. Cutaways: the crowd in the nearest stand on a pass for the lead and at the flag; your garage when one of your
    cars retires. Not built: the pit wall's faces, marshals, a retired driver walking back.
20. Weather: drops on the lens of any camera that stands in the rain (not the helicopter's), new ones at each cut;
    a RAIN RADAR card (chance, when, for how long) from the race's own forecast, and a line of commentary.
21. Checked: the grid camera (22 m up, 84 m back, clear line to pole) and the catching card on screen.

Fixed on the way
- Austin: the director's cameras have stood on the ground since V2.49 - and were then lifted by the ground's height
  a second time when drawn (main.js terrainLift did not know they were already placed in the world). They are drawn
  where they are placed now; only the onboards still ride the car. V2.49's audit read the camera before the second
  lift, which is why it passed.
- Cards that were not up still took their room in the right-hand column and pushed the others up the screen (under
  the map, once there was one): a hidden card takes no room.
- The classification waits for the flag's banner to go; the info cards wait for the race to settle (the first one
  16 s in) and share the column with a fight's card when there is room.
- Places gained were counted from the running order when the lights went out, not from the grid.
- A trackside camera is looked through again every half second while its shot runs, with the circuit's own walls
  and fences in the ray: twice running with something between it and its car (a car that spun on and stopped behind
  a fence line, one gone round the bend, a fence a metre in front of the lens) and the shot is over. Before, only the
  pit lane's camera was looked at again. A slot camera in the fence line is tested against the fence's own mesh
  when it is placed too.
- The cameras by the audit of V2.49 (a ray from the camera as drawn to its car, against everything drawn), on the
  build before the last two of these changes: Silverstone trackside 2 of 50 looks with something in the way (a
  fence a metre from a slot camera, a far building), helicopter 2 of 24 (the kerb beside a spun car), the pit lane
  0 of 12, the helicopter kept in the lane 0 of 8; Austin trackside 3 of 60 (the same two kinds), helicopter 0 of
  18, the helicopter kept in the lane 0 of 19, the pit lane's own camera 0 of 26.
  On the final build, trackside only: Silverstone 0 of 50, Austin 1 of 50 (a building 99 m down a 121 m line, one
  look); no shot in either had to be ended for a lost view (0 of 22 and 0 of 23 cuts). Montreal and Las Vegas were
  not audited again for this version.
- Austin, as drawn: trackside cameras 10-12 m over the ground they stand on, the helicopter 53-56 m, the same as
  placed (before: the ground's height again on top); the onboard 1.2 m over the road, carried by the car.
- Rain on the lens is under the graphics, not over them. The garage cutaway stood behind the pit wall looking at
  concrete: it stands in the lane now, looking across at the garage and its crew.

Not done, or not seen
- No formation lap. No real voices. No pit-wall, marshal or walking-driver cutaways (19). Wheels do not turn in a
  replay (the record keeps the cars' poses only). The season card (10) and the story's fact at the flag need a
  career and were not seen in a browser here.

# V2.49 (2026-11-11): the broadcast's cameras at every circuit, the pit lane too

Asked for: "fix the camera for all other tracks, including pitlane". V2.47's line-of-sight test had only been run at
Silverstone. An audit that is not the director's own test (a ray from the camera to its car against everything drawn:
the track's walls and fences, buildings, the pit building, stands, scenery) run at all four circuits found:
- Austin, half of every kind of shot blocked (trackside 20 of 40, the helicopter 13 of 24): the circuit is not flat,
  and every camera's height was a height above ZERO - a pole "12 m up" at Turn 1 stood thirty metres under the track,
  the helicopter "at 55 m" skimmed the hill, and all of them aimed at a car "0.7 m up" that was thirty metres higher
  (so did the director before V2.47). Now every camera stands on the ground where it is (ctx.ground: Terrain's
  height), looks at the car where the car is, and tvClear measures a line's height above the ground under each point
  of it - and a crest between the camera and the car blocks. The instant replay puts its cars and its camera on the
  ground too (the record is above the ground: its height is added, as CarMesh does).
- Montreal: a slot camera in the fence line looking along the wall (2 of 40) - a camera under 4.5 m may not look
  across the wall's line at all; the helicopter kept over the pit lane seeing the pit wall and its fence instead of
  the car (6 of 20) - over the pit lane it flies nearly overhead (140 m and up), and a target off the road has the
  circuit's own mesh in its ray.
- Las Vegas: the helicopter trailing far behind the car it follows (it eased toward its place at 1.6 a second: fifty
  metres behind at speed, and the sight line that had been tested was not the one it had) - it keeps up at 3.5 a
  second, jumps when more than 160 m off, and is judged from where it IS as well as where it will be.
- Everywhere: the pit lane's camera is looked at again every second as the car goes down the lane and placed again
  when it has lost it; an incident (a spin, a car in the air) is the story for ten seconds, not for as long as the
  car sits there - one stuck car held the feed for a minute.
- Silverstone: the helicopter kept over the pit lane saw the Wing's roof, not the car in its box (4 of 16): the
  circuit's own tall buildings (its scenery, what stands over 7 m) are in the ray now, and where nothing in the air
  can see a car in the lane the pit lane's own camera has it until it is out again. Over the pit lane only the steep
  places are tried (trying the low ones set the helicopter swinging between a low place and a high one).
- A target off the road (the pit lane) is tested against the circuit's own meshes too - leaf meshes listed once,
  never the instanced ones (a ray against every instance of a kerb or a crowd, twice a second, ran the test machine
  out of memory). The test costs 1-4 ms a look.
- After, by the audit (shots with something between the camera and its car, of those looked at; before in brackets):
  Silverstone: trackside 0 of 30, helicopter 0 of 18, the pit lane 0 of 13, the helicopter kept in the lane 0 of 14
    (4 of 16);
  Austin: 0 of 20 (20 of 40), 1 of 12 (13 of 24), the pit lane 0 of 26; the helicopter kept in the lane 0 of 13 on the
    build before the last pit-lane change, and not run again on this one (the test ran out of time there);
  Montreal: 0 of 14 (2 of 40), 0 of 8, 0 of 4, 0 of 2 - and, a build earlier, 0 of 36, 2 of 22, 0 of 11, 0 of 20
    (6 of 20);
  Las Vegas: 0 of 14 (2 of 40), 1 of 8 (6 of 24: a building the next look moved off), 0 of 13, 0 of 4.
  The seeded Silverstone race in a quick weekend identical to V2.45's.
- What is left: a look now and then with a wall 3 m from the car between them, or a building for the half second
  before the helicopter moves; the grid's camera was not audited (it looks at the grid, not at a car).

# V2.48 (2026-11-11): Silverstone's stands standing through one another

Asked for: "that bit of Silverstone where there's like 3 stands all rotated in one another". Found by measuring: each
stand's runs (world/Silverstone.js: a footprint's front edge as a chain of straight runs, each a stand of its own for
world/Grandstands.js) tested for how much of one lies inside another. Four footprints were wrong, for two reasons:
- A short run turned sharply from its neighbour is not front at all: it is the footprint's end wall, or a notch in its
  outline, that the nearest-point-per-4-m-of-lap rule took for one - and it became a full-depth stand standing across
  the real one. Farm Curve (T2): four runs, two of them 13 m stubs pointing almost opposite ways, 86 % inside each
  other and half inside the 141 m stand: the three stands in one. Vale: two stubs at its end. Chapel and Village B: a
  13 m stub at right angles, 91 % inside the main stand. Now the sharpest such run (under 30 m, turned more than 50
  degrees) is folded out of the chain until none is left.
- Village B's outline was "front" on both long sides (the lap passes it twice: Village on one side, the Wellington
  straight on the other): two full stands back to back through each other (52 %). A chain that doubles back (a turn
  over 120 degrees) keeps its longer part.
- After: 34 runs (42 before); no run more than 9 % inside another (the 9 % are neighbours at a gentle bend). Farm
  Curve, Village B and Vale looked at from the air. The seeded Silverstone race is the same as before.

# V2.47 (2026-11-11): the broadcast - cameras that can see, live graphics, instant replays, the safety car's and the red flag's own feed; lighter menus

Asked for: no silly hats on the people in the scenes; the menus (the team principal's above all) fit for a laptop - a
button no longer throws the page back to its top, less to read, the pit wall too; the broadcast's cameras not blocked by
walls and fences nor inside the pit buildings (even with the helicopter or the rear onboard chosen); more of what a
real broadcast shows - a battle for first, the laps until a fight, instant replays offered (take one or let it time
out); then: the safety car and the red flag each with a feed of their own.
- Cameras (camera/TVDirector.js, main.js tvClear): every camera is placed where it has a line of sight to its car.
  tvClear(from, to): the circuit's own walls and fences by arithmetic (a point of the line beyond the wall on its side
  while still lower than the barrier or fence there: blocked - a track that bends toward the camera, the far side of a
  chicane), then the buildings, the pit building, the stands and the landmarks by a ray against their meshes (about
  1.4 ms a look). Trackside: the place first thought of, else the other side, a pole for a slot, nearer, further,
  higher; nowhere: the helicopter takes the shot. The helicopter: six places round the car (behind left / right at
  55 m, closer at 95 m, over it at 140 and 190 m), the first that sees it, looked at again twice a second. The pit
  lane's camera hangs over the lane on the pit wall's side (it stood "on the garage side": inside the garages) - five
  places tried. A camera you keep to (helicopter, onboard, rear) is kept in the pit lane too: before, any stop put the
  pit lane's camera on whatever you had chosen - that was the helicopter "clipping through buildings".
- Live graphics (ui/TVExtras.js), right of the picture over the pit wall:
  - BATTLE FOR 1ST / FOR P5: the two cars, their tyres and the laps on them, the gap to a hundredth, CLOSING x/LAP or
    PULLING AWAY (the gap sampled every three seconds, a line through the last forty), DRS;
  - CATCHING: a car closing on the one ahead from 1.2-18 s back - the gap, the rate, FIGHT IN ~n LAPS (only when that
    is before the flag), the gap's last samples as bars; the next pair every twelve seconds;
  - PIT STOP: the clock running on a car of yours in its box, then its time;
  - the onboard's strip: speed, gear, throttle, brake, DRS while the feed is on an onboard;
  - OVERTAKE (x PASSES y FOR 3RD) and FINAL LAP in race control's column; a place won or lost shows as an arrow in the
    tower for three seconds.
- Instant replays: an overtake for a place in the top six (or a car of yours), a coming-together (5 m/s or more), a
  spin, an accident: offered a moment later - a chip with a seven-second clock (R, or a click). Taken: the race holds
  and the four seconds before it to the present are shown again at 0.55x from the director's rolling record
  (race/Replay.js: every car's pose, twenty a second) by a camera standing where it happened with a clear view; R /
  Space / Esc ends it. Left alone, the chip goes. Never two within fourteen seconds.
- The safety car's feed: SAFETY CAR in a yellow stinger across the picture (who caused it), a yellow frame round the
  feed and a yellow tower while it is out, its own card in place of the battles (the lap it is on, the cause, who has
  stopped under it, who is in the lane, the queue's first four), SAFETY CAR IN THIS LAP flashing as it comes in, GREEN
  FLAG as it goes; the director shows the safety car leading the queue (from the fence, from the air) and the stops -
  no "battles"; the incident is offered as a replay. The virtual safety car: the same, lighter.
- The red flag's: RED FLAG / RACE SUSPENDED in a red stinger, a red frame, the helicopter over the field, what stopped
  it offered as a replay; on the restart's grid a card - STANDING RESTART, what stopped it, the laps still to run, the
  tyres (may be changed), the order's first five; RACE RESUMES as the lights go out.
- Menus: the HQ and the practice screen stay where they were scrolled to when a button redraws them; each row's
  explanation is one line until the row is pointed at; the long notes fold away behind "How this works"; under 860 px
  of height the header and the cards are drawn tighter; the pit wall's footnote only when a card is pointed at.
- The scenes' drivers are bare-headed.
- The pit wall, COMPACT (the default under 900 px of height; FULL / COMPACT by its tab, remembered): each instruction
  shows only what it is set to - point at it and its choices open; the box-for tyres and the fuel load as they were.
  The card's DRIVE page is two rows instead of five.
- In the broadcast the HUD's line across the middle of the picture is gone (race control's column and the stingers say
  it); under the safety car the column no longer lists each stop (its card does).
- Checked, in a team principal's race at Silverstone: a camera with a clear view of its car in 62 of 63 looks; the
  battle card, the tower's arrows, a replay offered, taken, played (103 frames) and ended with the race's clock held;
  the safety car and the red flag forced (the stingers, the frames, both cards, the restart's grid); screenshots of
  each; no errors. The seeded Silverstone race in a quick weekend identical to V2.45's.
- Not checked: the cameras at Las Vegas, Montreal and Austin (the same test, not run there: towers by the road are
  what the helicopter's six places and the buildings' ray are for); the pit lane's camera with a car stopped in its
  box (the run ended before the stop); the catching card on screen (its arithmetic only); the HQ's folded notes and
  the laptop's layout in a screenshot.

# V2.46 (2026-11-10): cutscenes and the team principal's story

Asked for: every item of the "more immersive" list (thirty-one), as detailed cutscenes with proper camera work - and
not so many between races that the menus drown; then, mid-build: some of them interactive (answers against the clock,
quick-time events), no awkward pauses. What was built:
- The cinematic engine (ui/Cine.js): a scene is a list of shots over a set built for it. A shot is a camera move (a
  dolly between two framings, its lens, an arc, a hand-held tremble, a roll), a cut or a dip to black, its subtitles, a
  lower third, an overlay (a security camera's stamp). Depth of field (three's BokehPass: what the shot looks at is
  sharp, a pull of focus between two subjects), a 2.39:1 letterbox, a grade, a lamp by the lens so a face in a dim
  room reads. People are world/People.js figures in a pose, alive (breath, a head that turns to whoever they look at,
  a nod, a shake, a bounce); the crew are the skinned rig (they walk, kneel, work); the car is the CarMesh in its
  livery. Space / Enter / click: the next shot; Esc or SKIP: the end (what a scene asks is still settled).
  - Interactive, and never stopped: ask (a question with a clock - the scene runs on, the default answer when the time
    is gone, later shots branch on it: when(res), sub as a function), qte ('time': a press as the marker crosses the
    zone; 'hold'; 'mash' - the scene reacts as you do it), a choice the picture holds on at the end (drifting, not
    frozen), browse (a room to walk round: left / right).
- The sets (ui/CineSets.js), built from boxes and painted screens that carry the season's own numbers: garage (and the
  scrutineering bay), pit wall, boardroom, the principal's office, press room, launch stage, cool-down room,
  stewards' room, a documentary's chair, the paddock, the factory's four halls (what stands in each by its level, the
  levels not built as tape on the floor), the trophy room.
- Twenty-three scenes (ui/CineScenes.js, CineScenes2.js; tools/cine_sheet.mjs draws a contact sheet of any of them):
  the launch (hold: pull the cover), the factory walked through, the pit wall as the flag falls (win / podium / points
  / both out / a stop thrown away), the garage through the night after a crash, the signing (the handshake for the
  cameras: a press in the zone; what you tell the room), dismissed by the board (how you take it), a driver released
  (how you tell him), the title decider's film, the cool-down room, the season's film (its real moments), a
  documentary episode (people in a chair, the garage between them, your own answer on camera), the trophy room (to
  walk round); the board (three meetings as its patience goes; your pitch), the row between your drivers (step in or
  not; whose side), the debrief after an order refused (your tone; fine / let go / warn), a rival's approach in the
  paddock (walk over or watch; counter / promise / let them talk), the stewards' hearing (your evidence: the opening
  line hints at which one the case turns on; the verdict read out), the scrutineering bay (the directive measured on
  your car; comply / run it / lobby), the auditors (your line; accept / contest), a sponsor's call (promise / cut /
  walk), the leak (the factory's cameras: freeze the frame as the face turns - got them, half a face, nothing; what
  you can do follows), the reserve's seat fitting (who drives, against the clock), a mechanic's word, the press (one
  question from someone who remembers).
- The story (career/ManagerStory.js, StoryLines.js; saved in the career): fed by every race (the result, and what
  happened in it - contacts between any two cars, orders given and refused, crashes, stops).
  - Slow things: the feud between your two (contact, orders, a refusal; their manner); rivalries on the grid (three
    comings-together: named; they defend harder against each other: AIDriver car.grudge); the fans' mood; what your
    word is worth; each rival principal's heat with you (eleven invented principals, four manners).
  - Matters raised from it: a row (feud 55+), a debrief (an order refused: obeyChance - morale, manner, the feud, the
    last fine), an approach (a driver whose contract is up or who is unhappy; a race engineer), a protest (someone hit
    yours and finished ahead: yours to lodge; or you are summoned), the technical directive (once a season: your part
    or a rival's), a cost-cap audit (season's end, within 5 % of the cap), a sponsor's ultimatum (three targets missed
    running), a leak (something being built: the team ahead gets the level), an injury (a heavy crash: a reserve
    drives - Manager.entries subOf), the board's three stages (45 / 30 / 15 % confidence), the press with a memory
    (what you promised, checked race by race: kept or thrown back at you), a mechanic after a 4.6 s+ stop, a veteran
    retiring, a facility finished, the documentary at half distance, the season's film, the launch.
  - Drivers have a manner (six: hot-headed, political, loyal, money-driven, perfectionist, team player): how readily
    they obey, how a feud grows, what they say.
  - History-aware words (facts): "three retirements in four races", "the first points since Montreal", "the first win
    of the season" - in the news, the feed, the radio as a car retires, the press's question, the board's line.
  - The feed (posts from fans, a stats account, a gossip site, the rival principal nearest you), rumours in the second
    half of the season (deny one that is true and it costs your word; let one run and the paddock talks).
  - THE BUDGET: back at the HQ at most ONE matter plays itself as a scene (the most pressing; none straight after
    another unless it is serious), plus those that cannot wait (the launch, the season's film, an empty seat). The
    rest wait in the STORY page's inbox: watch each as its scene, or decide it in a line; left alone it decides itself
    the cautious way. At the track after the flag: at most one short scene, never two races running unless you won.
    Simulated over seasons: about one scene every three races plays itself; the inbox holds one or two.
- The HQ: a STORY page (ui/ManagerHub3.js) - the inbox, the mood, your drivers' manners and how likely each is to take
  an order, the other principals, the feed, the rumours, the scenes seen (to watch again), THE TROPHY ROOM, WALK THE
  FACTORY; the overview says what is waiting. Signing or releasing a driver plays its scene.
- The race: an order may be refused (the driver's line by his manner; the order comes off); the stop, the crash, every
  contact go to the story; at war, MATE: NO RISKS does nothing; the pit wall says how the stands are; team radio
  replays over the results (ui/RadioReplay.js: the few lines worth hearing again).
- The driver's career: the same scenes, one a race at most - your team's pit wall when you win, the cool-down room on
  the podium, the garage through the night after your crash (after the podium, before the results), the decider's
  film before a last round with the title open.
- Other modes: untouched - every hook is a field absent there (car.grudge, car.mgrFeud).
- Fixed on the way: the pit wall threw when the first team order of a race ended (every state's radio line was built at
  once: a swap has no car "behind", a hold no car "yielding"); the HQ's page no longer jumps to the top when a button
  on it is pressed; the drivers in the scenes are bare-headed (the cap sat like a bowl in close-up).
- Checked: a contact sheet of every scene (tools/cine_sheet.mjs: 23 scenes build, no errors); the story over seasons
  of simulated weekends and with every path forced and every option applied (30 careers, no failures); in the browser:
  a new career (the launch plays itself), the STORY page and its buttons, the trophy room, the factory, a half season
  simulated (the documentary played itself at half distance; a matter watched from the inbox); a career race from the
  grid to the HQ with the two drivers at war (the radio at the start, an order refused with the driver's own line,
  the radio replays over the results, the row played itself back at the HQ, the debrief and a press question waiting).
  The seeded Silverstone race in a quick weekend is identical to V2.45's.
- Not checked in the browser: the driver's career's scenes in a real career race (the same scenes, the same engine);
  the scene at the track after a win (none was earned in the test race); a second season's launch.
- Not there: banners or boos in the grandstands for the fans' mood (it is a number, a line on the radio, the launch's
  crowd and the sponsors' appetite); a sacking in mid-season (the board's ultimatum makes the season's-end verdict
  harsher, no more); people walking with faces (only the crew's rig walks - the others are cut to where they stand).

# V2.45 (2026-11-10): the team principal - race orders, the pit crew, the weekend, the people, the car, live strategy

Thirty-three controls asked for at once ("make them all"); each a real system, none deep yet. By where it lives:
- Race orders (race/TeamTactics.js; the pit wall's cards now have three pages - DRIVE, RACECRAFT, CAR): ATTACK (the
  driver's aggression: cautious x0.6 .. all-in x1.65), DEFEND (yield / normal / hard), MATE (race / no risks: no
  defending against the sister car), BLUE (move over: the lapping car let by as an order lets a team-mate by / hold up:
  5 s after 8 s in the way), LIMITS (tidy / normal / wide: the planner's edge margin -0.3 .. +0.45 m, the stewards
  count the strikes), SC (save / normal / ready: fuel and wear behind the safety car, the tyres' temperature at the
  restart), LAUNCH (safe / normal / aggressive: the reaction time, and a roll for a bogged start) and LAP 1 (the first
  forty seconds' aggression); BIAS, DIFF (pace / power against wear), COOL (out of the slipstream: Car's heat x0.35,
  the following gap +9 m). A stop called on fresh tyres with nothing wrong: the driver asks, BOX / STAY. Every hook in
  AIDriver / Car / RaceDirector is a field absent on every other car.
- The pit crew (career/ManagerCrew.js, HQ tab PIT CREW): ten jobs (jacks, four guns, four tyre handlers), each a
  speed, a consistency, a fatigue; a stop as long as its slowest corner and the jacks (RaceDirector.stopTime ->
  car.crewStop); mistakes by consistency and fatigue (a nut, a jack, a wheel: +1-5.5 s, said on the radio); training
  between the races (speed / consistency / double stops / rest x light / normal / hard); practice stops at the weekend
  (three sessions: sharper, more tired); release safe / normal / aggressive (unsafe release: 5 s, given by the
  stewards when the car is back out); a double stop waits on the crew's readiness; replacements from a market.
- The weekend (race/TeamWeekend.js, ui/Setup.js): practice is six runs a car, each a programme - SET-UP (the feedback),
  TYRES on a compound (the wall then knows its life here: without it the laps-to-the-cliff are off by up to a quarter
  and marked "?"), RACE SIM (the fuel the car really burns: without it up to 4 % off, and marked "~"); tyre sets (3
  S, 2 M, 2 H, 2 I, 2 W a car: practice and qualifying use them, the race fits the freshest, none left cannot be
  called for; the count on the BOX FOR buttons); qualifying plans (one run or two, early or late, a tow); parc ferme
  (the set-up is set for the forecast and locked: a wet day wants more wing, and a forecast can be wrong).
- The people (career/ManagerPeople.js, HQ tab PEOPLE): driver morale (results against expectation, orders, promises,
  what you say) as the driver's form on track; praise / demand more; promises (number one, a part in three rounds,
  contract talks) kept or broken; a race engineer a car (feedback for practice, chemistry as a little pace); the
  press's question after every race (three answers, each a cost); the team's fatigue and the rest week.
- The car (career/ManagerCar.js, HQ tab CAR): design focus (low drag / balanced / high downforce: the car's character
  against what each circuit wants, +-0.13 s); wind tunnel and CFD hours (100 x the testing allowance a season, 10 + 4 a
  level); next year's car (0-75 % of the factory: this season's levels later, next season's car up to 0.17 s quicker,
  double in a year the rules change - every third season); the power unit's maker (five; customers may change for next
  season); RUSH a level (40 % of its price again).
- Live strategy (race/TeamStrategy.js): RE-PLAN (the rest of the race re-timed with the tyre model from the car's own
  state and sets: no stop / one / two, offered in turn; taken, it is the plan the wall follows); alerts as questions on
  the card for a car on PLAN or YOU - the undercut is on, a rival behind has stopped, wet enough for inters, dry enough
  for slicks - and the rain forecast on the radio.
- Simulated weekends: the pace model now weights the car and the driver as the race does (RaceDirector.simulateRest's
  own: the car about three times the driver across the grid; it had the driver four times the car).
- The set-up's effect rescaled (ui/Setup.js setupEffect): neutral at 60 % satisfaction (+-0.2 % of pace across the
  range, wear x0.84 .. x1.24), and a car whose set-up was never touched is at 60 %. It was a penalty from the first
  lap: with no orders given both cars slid six to thirteen places; now they finish where the car belongs.
- The fuel margin is kept across a red flag (main.js tpFuel: the margin at the flag, restored at the restart; a part
  lap run twice was counted against the load). Not seen to be the cause of one test's "0.5 laps short" for certain: a
  normal eight-lap race traced held +0.30 .. +0.34 laps through a stop.
- Checked: four-season model runs for Williams, McLaren and Haas with every system on (a sensible player climbs, a
  passive one sinks; no runaway money; crew fatigue holds on normal training); the HQ's new pages in the browser, every
  button; a career round at Silverstone with the lot (practice programmes, the qualifying plans and the tow, the sets
  used, launch and lap 1, the driver's doubt at an early stop, the crew's stop - 2.26 s - the re-plan taken); each
  order alone over sixteen four-lap races at Las Vegas (no order retired a car); the pit wall's three pages at 1280 x
  720 (165 px), 1920 x 1080 and a phone's 844 x 390 (232 px: tall there). The seeded Silverstone race in the other
  modes byte-identical to V2.39.
- Not deep yet: practice runs are instant (not watched); the AI teams have no crew, sets, morale or sponsors of their
  own; SIMULATE (a weekend) ignores the orders, the crew and the set-up. Not found again: V2.43's one run with both
  cars called in on lap 7 after their plans were done.

# V2.44 (2026-11-08): the team principal's depth - driving instructions and fuel, parts, facilities, sponsors, set-up

Modelled on F1 Manager (its guides: the tyre / fuel / ERS instructions and no refuelling; the set-up's five feedback
areas and a window that narrows run by run, faster with a better simulator; facilities behind development and sponsor
appeal; sponsor targets that pay).
- Driving instructions (ui/PitWall.js MODES, main.js tpModes / tpFuel), per car, in place of PUSH / STD / SAVE:
  - TYRES aggressive / standard / light / conserve (cornering x1.008 .. x0.989, wear x1.3 .. x0.68);
  - FUEL push / standard / save / lift & coast (engine power x1.012 .. x0.972, consumption x1.08 .. x0.85, failure
    risk); a fuel load - the race at the standard mixture + 0.3 lap, FUEL LOAD -/+ half a lap before the lights - burnt
    by the distance run (0.35 kg a km, 60 % under the safety car); its weight against the standard plan's at that point
    as engine power (768 kg of car: the AI's carry no modelled fuel); FUEL n kg +/- laps on the card; run dry: no
    drive, retired 'Out of fuel'; the engineer warns when short;
  - ERS harvest / balanced / deploy / overtake (AIDriver: when the battery is spent).
  Every hook (Car.enginePower x mgrPower, AIDriver mgrErs) is neutral for every car that is not a team principal's.
- Car parts (career/ManagerOps.js, HQ tab PARTS): each driver's power unit - ICE, turbo, MGU-K, energy store, gearbox -
  with a season's allocation (the rules' ratio: 2 a season of 8 rounds), worn every weekend (a push mixture the ICE
  more); worn: fails more, a worn ICE loses power; FIT NEW, and beyond the allocation a grid penalty - 10 places, 5
  for every further element - applied to the grid after qualifying (the AI teams fit new units at 85 % and take theirs
  too); a new season, new units. Spares - front wing, rear wing, floor, suspension - used up by damage and crashes,
  BUILD in the factory (under the cost cap, ready next round, a few a round by the factory's level); none in stock: the
  car races the damaged part, a little slower, until one is made.
- Facilities (HQ tab FACILITIES): factory (spares a round, their price), hospitality (sponsors' pay and offers),
  driver-in-the-loop simulator (practice feedback), pit crew training centre (stops) - levels 1-5, UPGRADE (rounds to
  build, capital spending outside the cap, 80 % while building), condition that wears every round (the effect from half
  to full), MAINTAIN.
- Sponsors (HQ tab SPONSORS): a title sponsor and two partners - a fee a race, a signing bonus, a race target bonus
  (shown on the overview before the race), a season bonus, seasons. A new team starts with a title sponsor and a
  partner; offers come by marketability (place, drivers, hospitality); NEGOTIATE the fee, the bonus and the seasons -
  their answer from very likely to very unlikely - PROPOSE; twice turned down and they walk away.
- Set-up (ui/Setup.js; PRACTICE · CAR SET-UP on the qualifying panel): five controls (front wing, rear wing,
  anti-roll balance, camber, toe-out), five aspects (oversteer, braking stability, cornering, traction, straights) each
  a mix of the controls; every circuit its own ideal per car and a driver's preference; six practice runs a car, each
  the driver's feedback with a window that narrows (the simulator's level); the satisfaction is pace (+-0.2-0.4 %) and
  tyre wear (+-15-20 %) in qualifying and the race; a career keeps the set-up run at each circuit for the next visit,
  the ideal moving with each season's car.
- Balance (three-season model runs): sponsors $2-3M a race; no runaway budgets; allocation enough when managed.

# V2.43 (2026-11-07): the team principal's race strategy, both cars

- After qualifying, the strategy screen (ui/Strategy.js) once for each of your cars (main.js tpStrategy): the plans
  worked out from the tyre model for this race, each car's grid slot and what the rest of the field starts on, the
  driver named at the top (car 1 of 2, car 2 of 2); CONFIRM · NEXT CAR, then CONFIRM · TO THE GRID. A team principal's
  weekend and a career round alike.
- The plan chosen is the car's start tyre (the AI's own start-tyre pick at the lights now leaves a planned car alone:
  AIDriver.planRace) and its stops: the pit wall's CALLS gains PLAN (AI · PLAN · YOU; PLAN the default once a plan is
  picked) - a warning the lap before, BOX on the plan's lap with the next stint's tyre (tpPlanCalls); STAY OUT on that
  call moves the stop a lap later; a stop made early moves the plan on. BOX FOR follows the plan's next set. The car's
  note shows the plan to come ("following B · S -> S L4 -> S L7").
- Checked at Silverstone, 10 laps, McLaren: plan A for Norris (one stop, lap 5), plan B for Piastri (two, laps 3 and
  6) - both on the plan's start tyre, each called in exactly on its plan's laps and never otherwise (every call traced).
  (In the first run, before the start-tyre fix, both cars were called in once more on lap 7 after their plans had
  finished; it did not happen again in two traced runs - its cause not found.)

# V2.42 (2026-11-07): the team principal's career; the broadcast's cameras where real ones stand

- A career for the team principal (career/Manager.js, the HQ ui/ManagerHub.js; the home's card 04 opens it - or a
  single weekend from it). Pick one of the eleven teams; the season's length (4 / 8 / 12 rounds, the four circuits in
  turn) and the race distance. Saved in the browser (f1sim-manager-v1).
  - The whole paddock lives on: every team develops its car through the tech tree (career/TechTree.js) - the AI teams
    choose their own work, you BUILD yours (ui/HubTech.js, the factory tab, a manager's flag: BUILD where a driver has
    REQUEST) - every team under a $70M cost cap a season (the AI's spending held to what the cap leaves it).
  - Drivers: contracts (salary, to the end of a season), EXTEND (they ask more), RELEASE (paid off), SIGN a free agent
    (the reserves and F2: their asking salary, half a season's as a fee). At the season's end a contract run out ends:
    the AI teams re-sign or replace; yours leave unless extended. Ratings move a little with each season.
  - Staff: a technical director (how well a new part correlates on your car), a head of strategy (how often the AI
    strategist's call goes wrong: AIDriver faultMul), a pit crew chief (the stop's length): hire from three a role.
  - Money: the commercial rights every race by tier and $0.25M a point, the title sponsor's target for the weekend (a
    place, both cars in the top n) and its bonus, the drivers' and staff's salaries every race, prize money at the end by
    the constructors' order.
  - The board: its target is where the team should finish on its car and drivers against the field (Williams P5, Haas
    P7, McLaren P1); its confidence moves with points against what the car should score and the table; a season far
    short with the board's patience gone (never the first with a team) and you are out - a team further down may offer
    a way back.
  - The weekend: RACE - the team principal's weekend (qualifying watched or simulated, the race on the feed, the pit
    wall), the round's circuit, forecast and distance, your staff's work on your cars; SIMULATE - the result at once.
    The result into the season: points, money, the factories, the board, the next round; TEAM HQ after the results.
  - Checked: three simulated seasons for Williams, Haas, McLaren, Ferrari and Cadillac (no runaway budgets, targets
    met / missed / beaten, a sacking and a new team); in the browser a career made, every tab, a part built, a hire, a
    round simulated and a round raced at Silverstone, back to the HQ - no errors.
- The broadcast (camera/TVDirector.js): no chase camera (television has none: gone from the director, the pit wall and
  C); the trackside cameras stand where real ones do - on a pole over the barrier 10-13 m up, 0.6 m behind the wall's
  face (the line down to a car even 1 m off that wall clears the 5.5 m catch fence's cranked top), or in a slot in the
  fence line just over the concrete (the mesh beside the lens, none in front).
- The HUD's messages (LINE ON / OFF, the safety car's, race control's) now run out in the team principal's race (they
  stayed up: the HUD's own update, which times them, is not called there).

# V2.41 (2026-11-07): Las Vegas's damp AI from the new telemetry

- The driver's damp laps (2026-11-06 export: wetness 0.31, three laps, the flashbacks' rewound attempts left out by
  tools/ai_fit_wet.mjs) fitted into Las Vegas's wet calibration, replacing the 2026-11-01 one (fitted on the lap before
  the V2.24 / V2.37 de-kinking). Kept as fitted at the braking corners (T1-T9, T12's speed, T14-T16).
- Held back by hand, from 22-car damp races (tools/race_probe.mjs, now WEATHER=damp): the flat-out kinks T10, T11, T13
  and T17 at 1 - the laps lifted there where the AI is flat, the fit's driven rounds then pushed them to 1.19-1.25, and
  both that (T11 too quick: into the wall on its exit) and the laps' own numbers (T10 slower: the field lifting
  mid-kink, the V2.37 pile-ups) crashed the field there; T12's later braking at 1 (the export's braking point there -
  35 m from 250 km/h - is braking under the 0.3 the fit reads).
- Four damp 5-lap races each, old -> new: retirements 0 -> 1, barrier hits 1 -> 3, spins 41 -> 26, contacts 154 -> 122.

# V2.40 (2026-11-06): Team Principal - both cars from the pit wall, the race on the world feed; the circuit built ahead in the menus

A fourth mode on the home (04 TEAM PRINCIPAL): you pick a team, not a driver, and run its two cars. Qualifying with the
whole field (watched on the feed or simulated), then the race watched as television shows it, run from the pit wall.
- The world feed (camera/TVDirector.js): a director cuts every 5-9 s to the story worth watching - a fight for a place
  (closer and higher up the order scores more), an accident or a spin at once, a stop in the pit lane, the leader at
  the start and the flag, your cars more often than the rest - with a camera for it: trackside cameras along the
  barriers that pan and zoom as the car comes by, the onboard T-cam, the chase, the helicopter, the rear-facing onboard
  of the car ahead with its attacker in the mirror, the pit lane camera, high over the grid before the lights. Or you
  direct: follow a car (a click on the tower, Tab) and / or keep to one camera (C).
- The graphics (ui/TVGraphics.js): the timing tower (interval and gap to the leader alternating, the tyre, PIT, OUT;
  your cars marked; qualifying by best lap), the lap and the flag, the caption at every cut (the car, or the fight and
  its gap), race control (safety car, retirement, each stop and its time, fastest lap, penalties), LIVE and the camera.
- The pit wall (ui/PitWall.js): per car - place and gaps either side, the set, its laps, its wear and the laps to the
  cliff, damage, last and best; pace PUSH / STD / SAVE (AIDriver.vScale x1.008 / x0.99, tyre wear x1.22 / x0.78, failure
  risk x1.25 / x0.9); the calls - the AI strategist's (it boxes when the tyres, the weather, a safety car or the
  undercut say so; you can still call a stop, or STAY OUT for a lap) or yours alone; BOX for the set chosen (repairs
  fitted when the car needs them); before the lights, the set each car starts on. Team orders: SWAP, HOLD, RACE (race/
  TeamOrders.js mgrOrder - the drivers obey or not as they always have; the automatic orders are off for your pair).
  The radio: the strategist's calls and why, tyres going off, damage, a car out, orders obeyed or refused.
- Time: pause (Space), x1 / x2 / x4 (- / =); SIM 1 LAP, 5 LAPS - the race model (RaceDirector.simulateRest, now with
  o.laps) run that far and every car put back on the track where it has them (simPlace: laps, lap times, stops, tyres
  and wear, the timing loops' gaps; a car out in the model taken to its garage; the sky moved on), then live again;
  only under green flags - or TO FLAG. Your pace modes and a stop called count in the model too. The model now picks
  the lap for a stop (RaceDirector.stopNow: no later lap cheaper - k more laps on the old set, then the stop and the new
  set to the flag); it used to stop the moment a stop paid at all, which brought the whole field in on lap 2 of 10.
  This also changes TO FLAG / F (simulate the rest) in every mode - for the better.
- The circuit built ahead (main.js PRE_TRACK): on the home screen, after 1.5 s without input, the circuit you are most
  likely to race (the one picked in the settings, else your last race's) is built in the background - nothing drawn,
  the home's look untouched; START (any mode, a career round, an evening out) waits for a build under way and takes the
  circuit over when it is the one. Once a circuit has been asked for, nothing more is built ahead (two builds at once
  would tangle the world - caught in testing). Las Vegas, START to the circuit ready, here (software GPU): 13.7 s ->
  3.2 s - what is left is the first frame compiling its shaders.
- Unchanged for every other mode: the new hooks only act on a team principal's car (c.mgr); seeded races identical to
  V2.39 (tools/race_probe.mjs: Silverstone and Las Vegas). (Found on the way: V2.39's own Las Vegas seeded race came
  out differently in one of its three runs - run after Silverstone in the same probe; something outside the seed
  reaches the race there. To look into.)
- Next for the mode (the user's brief: "deep, like F1 Manager"): the season - a calendar, the constructors' table,
  money (prize money, sponsors and their targets, the cost cap), the factory (career/TechTree.js's development, chosen
  by you), staff and the driver market (career/Market.js), the board; a strategy screen before the race for both cars;
  replays of incidents on the feed.

# V2.39 (2026-11-05): the frame lighter - matrices only where something moved, no shadows nobody sees, no forced layout

Measured first (tools/profile.mjs, sceneprof.mjs, gpuprof.mjs, loadprof.mjs - a race of 22 cars with the player's car
handed to the AI, its frames driven at a fixed 1/60 s under Chrome's CPU and allocation profilers). Per frame on the
main thread, before: 10.5-13 ms of JavaScript - three.js's own 5.7-7.3 ms of it, the game's (the physics, the AI's
planner, the race director, the HUD) 4.9-6 ms. A race scene is ~7,400 objects: 4,356 of them the parts of 22 cars
(~198 a car), 2,270 the pit crews; 300-830 draw calls and 0.6-1.8 M triangles a frame by circuit; the 4096 x 4096 sun
shadow map drew up to 300 car parts on top. Loading is mostly shaders compiled one after another on first use.
- Matrices (core/FastMatrix.js): three.js recomputed the local and world matrix of every object every frame. Now an
  object's local matrix is recomposed only when its position / rotation / scale changed, its world matrix only when that
  or its parent's changed; and in the renderer's walk of the scene a car's hidden level of detail (a car far off shows
  its simple model - its ~190-part close one is hidden) is not walked, but marked out of date and brought up to date the
  moment it is shown again (LOD.update, inside the render, before it is drawn). The same arithmetic on the same values:
  the matrices drawn are the ones three.js would have computed. A direct updateMatrixWorld(true) (a part torn off, a car
  split) still walks everything. Per frame at Silverstone: 7,397 local matrices recomposed -> 86; 4,921 world matrices
  multiplied -> 1,448.
- The cars' shadows (main.js carShadowsOff): every car inside the shadow box - well behind and beside the camera too -
  was drawn into the shadow map. A car's shadow falls along the sun's rays, from the car down to the lowest ground there
  is; that volume (the car swept down the ray, in spheres a margin larger) missing the view entirely, nothing on screen
  can sample its part of the shadow map: it is left out of that frame's shadow pass (put back right after it - the
  Sphere's feed, replays draw all). Draw calls: Silverstone -19 %, Austin -21 %, Montreal -10 %; Las Vegas's field is
  rarely in the box off screen (0).
- No forced layout: fitViewport read the canvas's size every frame - after the HUD had written to the page, that made
  the browser lay the whole page out again each frame (0.4 ms). A ResizeObserver says when it may have changed.
- Per frame, main-thread JavaScript (one run at a time, three.js's part in brackets): Las Vegas 12.0 -> 7.3 ms (6.8 ->
  2.9), Silverstone 10.6 -> 9.4 (5.7 -> 3.9), Montreal 12.4 -> 11.1 (6.5 -> 4.7), Austin 13.2 -> 10.5 (7.3 -> 4.7). (The
  game's own share moves +-10 % from run to run: a different moment of a live race.) Evenings out and parties: no change
  either way (their first frames compile their shaders; the walk costs them 0.2 ms).
- Nothing seen changed (tools/regress.mjs): on each circuit, at four moments and five camera poses (the game's, chase,
  overhead, side, looking back at the field), the frame drawn from the same state with the optimisations on and with
  three.js's own walk and every shadow - 80 views: at most 5 isolated pixels apart, by up to 16 levels of 255, the same
  as the same frame drawn twice the same way (the software renderer's own variation: 4 pixels, up to 19 levels). Nothing
  felt changed: seeded races (tools/race_probe.mjs, now with the game's frame loop paused) identical to the byte before
  and after. Every mode runs without an error (tools/smoke.mjs: menus, the pre-race show, the race, cameras, crash
  camera, photo mode, a flashback, an evening out, a night out).
- Tried and left out: compiling every shader while the loading screen is up (three's compileAsync) - here it built
  variants the game never draws and the first frames came later (Montreal 3.2 -> 15.2 s), so not kept; the two passes
  three.js draws a transparent double-sided material in (it re-derives the shader twice a frame - ~0.2 ms at Las Vegas,
  inside three.js); the AI's planner (1.1 ms) - it must stay bit-for-bit what it is, or every race changes.

# V2.38 (2026-11-04): barriers that give - a wall hit resolved over the contact, damage from what the car felt; TecPro blocks

- Each barrier has its own give (vehicle/Car.js BARRIER, next to PULSE and BAR_KIND): how far its face can be pushed back
  (concrete a few cm, a soft SAFER / TecPro wall 0.5 m, a tyre wall 0.85 m, Armco 0.6 m), the force it crushes at (36 /
  24 / 20 g of the car's weight), its spring (the crush force reached at 0.2 / 0.4 / 0.3 m of give), how much stiffer it
  is letting go (tyres hand back ~3 % of a hit, Armco ~17 %: it bounces), its damping and friction. Concrete stays the
  one rigid impulse it was (its stop is the car's own crash structure, PULSE.wall).
- A hit on a barrier that gives is resolved over the contact, not in one step (Car._barrierSoft): every point of the
  car in it (nose, wheels, tail) is a spring-damper, implicit in the step, up to the crush force, until the speed into
  it is spent; a point that has pushed it back all it gives meets what stands behind (Armco behind tyres, concrete
  behind a soft wall, 60 ms crushed flat) and is stopped there at once. A car swinging in is held along its side.
- Severity and damage from what the car felt, not the corner's raw speed: the hit's g measured as concrete's is (its
  velocity change over the time the barrier pushed plus the car's own 45 ms) - Car.pulse takes it, so the suspension /
  engine damage, the crash camera, the replay, the injury and fatality odds all follow - and never more than concrete
  would have given for the same blow (the same speed into it at the same point: concrete rates a tail slapping in over
  three steps as three hits, the barrier as one, and the injury odds are calibrated on concrete's); applyImpact takes the speed of
  the part that touched for the wings and the struck wheel, and the felt hit (its concrete-equivalent speed) for the
  rest; the dents and parts broken off by what the car took itself. A car is launched off a barrier by a 70 g hit
  (G_LAUNCH, ~165 km/h head-on into concrete), not by any corner touching at 115 km/h: a corner-first slap spins the
  car along the wall, it no longer throws it in the air.
- Where they stand (Track.buildGive: giveL / giveR, def.barriers per corner in tracks.js - turn, side 'out' / 'in',
  metres from the apex, kind, deep): Las Vegas concrete, with SAFER walls at the end of the Turn 1 run-off, the Turns
  7-8 run-off's wall, the outsides of Turns 12 and 14; Silverstone tyre walls and Armco, TecPro outside Abbey, Becketts
  - Chapel, Stowe and Club; Austin tyre walls and Armco, TecPro at Turn 1, the hairpin, Turn 12 and the last two
  corners; Montreal concrete with TecPro across the back of its escape areas and outside the Senna S. The pit lane's
  walls are as they were.
- TecPro drawn as what it is: solid red and white blocks, 1.5 m long, 0.75 m deep, 1.1 m tall, linked in a chain
  (TrackBuilder tecproBlocks; the catch fence stands behind them). Where a car presses into a barrier that gives, the
  barrier is pushed back with it (world/BarrierGive.js, a vertex shader on the barrier materials: 8 dents at a time from
  Car.GIVE_DENTS) - the TecPro blocks squash, face back and top bulging, the chain bowing round the car; tyre walls,
  Armco and the fence behind flex - and spring back over 1.5 s once it has gone. No mesh changes, nothing allocated a frame.
- The crash rig (tools/crash_rig.mjs, harness __crashRig): a car coasting into each kind of barrier at 100-300 km/h and
  15-90 degrees, three seeds a cell. Before -> after: nothing at 150 km/h or under is launched, rolled or torn in two
  any more, into any barrier (before: every 150 km/h hit at 60-90 degrees and every 200 km/h one at 30 degrees flew; on
  concrete at 150 km/h 60-90 degrees two in three split). A 150 km/h hit into a tyre wall at 15 / 30 degrees: 5 / 10 g,
  a damaged or lost front wing, driving on (before 11 / 6 g and the same wing); square on 36 g, driving on (before 29 g,
  launched, out). Glancing hits on a soft wall at 250-300 km/h: 10-17 g against concrete's 13-16 g. Soft wall at 150 km/h square on 44 g (concrete 64 g); 200 km/h at 60
  degrees 63 g and no flight (concrete 88 g, launched, split). Concrete itself: the same g at every speed and angle;
  250-300 km/h at 60-90 degrees still 106-133 g, launched, split two in three, the injury odds near certain. The other
  side of it: a 300 km/h hit at 60-90 degrees into a tyre wall bottoms it out onto the Armco behind and is now 81-85 g
  (before 57-60 g, the tyre wall's 100 ms pulse taken whole; Armco itself is unchanged at ~82 g) - two in three split.
- The AI's rejoin after a touch (AIDriver.rejoin): a car that backs off something it is pressed against reverses for at
  least 1.5 s, whichever way it points - it went "nose against something: back out", and stopped backing out the moment
  it pointed at the road, which it already did; a concrete wall bounced it free, a barrier that takes the hit does not
  (Las Vegas's Turn 14: stuck). And a car's centre is only "beyond the barrier" (gone over it, held out on the far side)
  past what the barrier gives - pressed into the TecPro round Montreal's hairpin it was trapped on the barrier's line.
  tools/rejoin_probe.mjs: an AI car rolled into a barrier at 30-100 km/h, 30-90 degrees, left to get going again (on a
  straight per barrier kind, or at a corner as the circuit has it): 86 of 90 back on the road, the rest concrete as
  before or a hit that broke the suspension.
- 22-car races (tools/race_probe.mjs: 5 laps, safety car off, six seeds on each of the four circuits, before and after;
  each retirement put down to the last thing the car hit): retirements 27 -> 23, those down to a barrier 11 -> 3, cars
  launched 22 -> 12, none torn in two either way, barrier hits over 0.3 severity 96 -> 11 (Montreal's walls 63 -> 5).
  Drivers hurt 1 -> 3: the two new ones a car-to-car collision on the run to Austin's Turn 1 (car-to-car contact is as it
  was). The probe pauses the game's own frame loop and seeds Math.random only while it steps the race (the renderer drew
  from the same seeded stream between chunks and shifted it): a seeded race now repeats exactly, before and after.

# V2.37 (2026-11-04): Las Vegas's maps and its AI on the new line; the loading bar and the map in step

- The circuit map (ui/TrackMaps.js) and the menu card's outline (tracks.js) regenerated from the built circuit - they were
  still the lap before the de-kinking (scratch tooling: the lap from the line in 400 points, the pit lane, the corners;
  Silverstone regenerated the same way matches its stored map to the point). The in-race minimap draws the live track.
  The corner numbers on the loading map pushed apart where they crowd (7-8, 14-15-16; each kept near its corner and off
  the track).
- The loading screen: the bar, the red line round the map, its head and the figure are one value eased frame by frame -
  no CSS transitions (the bar's ran on the compositor while the build held the page, so it kept moving while the map's
  waited: the line was half the time behind the bar).
- The AI at Las Vegas (from 22-car races, every impact logged with the cars round it): the pile-ups were at Turns 10-11,
  and the line was why - the trace had a sharp spot in each fast kink (Turn 10 a 55 m radius inside a 107 m bend at
  280 km/h), so the field braked mid-kink and swung across the road. Turns 10, 11 and 13 smoothed (each one cubic over
  100 m, the line moved 2.8 m at most, the lap scaled back to 6.201 km): Turn 10 is flat now, as it is. And no mistakes
  in a corner taken flat (AIDriver.rollError): the 'wide' mistake of a fast sweeper put cars into the wall at 340 km/h.
  A car deep in a run-off rejoins at the road beside it (it aimed 35 m on, into the wall where the chicane's run-off
  curves back in - beached). Five seeded races: one retirement in five (was one in most).
- The telemetry supplied (2026-11-03 19:30) is one wet lap (0.36) with a reset and a stop - not a lap to fit the AI to;
  the dry AI stays on the physics, the wet calibration (fitted 2026-11-01) as it was.

# V2.36 (2026-11-04): the T-cam's defaults - 11 degrees down, a 49 degree lens

- The player's pick on the Vegas lap after V2.35's sliders: TCAM_TILT 11 (was 9), TCAM_FOV 49 (was 40); the Sphere's
  onboard feed uses the same lens. A setting already chosen in the browser is kept.

# V2.35 (2026-11-04): the Sphere's emoji and helmet remade, its base, the screen in time trial; the chicane polished

- The Sphere's emoji (SphereShow emoji(), the photos): glossy yellow, two tall white eyes with big black pupils and a
  glint, thick dark-brown brows, a small mouth - four expressions in turn (a sly smile, wide-eyed awe with an "o", one
  brow up and curious, a happy squint), blending, blinking; drawn in the shell's own measure (front-on, so the eyes stay
  round on the Sphere). While it is on, the face turns to the car you watch (else the nearest), lagging a little, and
  its eyes follow it. The helmet variant: the face in its race helmet - sky-blue shell, the white visor band with LAS
  VEGAS GRAND PRIX in navy, the navy crown panel with its wave lines and the red F1, the visor pivots, navy and white
  side stripes, the lilac chin guard and its vent. Canvas shows toned down (x0.44): the night glow washed them to white.
- The Sphere's base (Landmarks.js): the solid dark ring the shell stands on, 8.5 m high, 80 m round at its foot, its
  panels and lit doors; every show laid out on the shell above it (uGround at its top).
- The F1 stream: drawn whenever it is on - paused or in photo mode too (it stayed black when the loop reached it while
  the game was halted); its screen a little lower on the shell (15 below the equator to 58 above), centred on the face.
- T-cam: a field-of-view slider beside the tilt (30-60 degrees, 40 by default), on the Driving page and in the pause
  menu, kept in this browser.
- The chicane: the run-off red (the race's render), the race's F1 / LAS VEGAS GRAND PRIX mark across it; it ends at
  Turn 8's turn-in - past it, on the inside of Turn 8, the wall samples (pushed out along converging normals) jumped back
  and forth and the barrier, fence and boards drawn between them made stray rectangles of fencing. No stand of the zone
  may stand in another, whichever stand it belongs to; the run-off's stand only along its wall, not round its ends.
- The suites' people: the stands' figures at their real size (the suite texture is laid 30 m to a repeat, ~3.6 m tall,
  so they were twice as wide as they should be), darkened against the lit room - near-silhouettes, their colours there.

# V2.34 (2026-11-04): the plaza's F1 logo, the suites' people, open stand ends, the chicane run-off's real wall

- The Grand Prix Plaza's F1 logo (VegasPaddock.js): F1 red, unlit and untoned so it reads as neon (it washed to pink /
  orange), laid flat on the roof deck with its red glow round it - not held up on posts over a pink glass pavilion (gone).
  No plant room on top of it.
- The hospitality suites' people (suitesTexture): drawn as the stands' crowd is (world/FanCutouts.js colours - skin
  tones, hair, coloured shirts with sleeves, arms, trousers), not dark silhouettes: the same crowd in the suites as on
  the tiers below them.
- Stand ends never wall in seats: the Heineken Silver main grandstand's teal ends are the stand's side only - under the
  seats along their rake, and the suites' block at the back up to the roof (they were the whole profile under the roof,
  over the seats); the name sits low at the back. The Red Bull end boards of the Turns 2-4 stand moved back under the
  rake.
- The chicane's run-off (Turns 7-8) on the way in only, as the race's render shows it: straight on past Turn 7, its wall
  leaving the road's own wall in line with it, curving gently out, running straight along the stands and curving gently
  back in to fence the road by Turn 8 (the band escape, TrackBuilder); out of Turn 8 the wall runs beside the road as
  everywhere else, the stand right behind it to Turn 9. Nothing in the run-off or on its wall (the light masts gone: the
  stands' lamps light it); Turn 9's magenta paint gone from its end.

# V2.33 (2026-11-04): the T-Mobile stands' cladding, the chicane's run-off wall, the pit lanes' mouths

- The T-Mobile stands (VegasSphereZone.js, the user's render of the zone): the magenta cladding under and behind the
  seats only - the back wall up to the top row with the section's number and a lit tunnel in, the side at the ends of a
  stand following its rake down to the front. No more panels standing above the seats between sections (they walled off
  the view along the stand).
- The run-off beyond Turns 7-8 (TrackBuilder escapes band): its wall one gentle arc from the barrier before Turn 7 to the
  barrier before Turn 9, bowed out to the depth at its middle - no longer an offset of the road, which wiggled with the
  chicane. Its paint is the polygon between that arc and the kerb; the stand behind it follows the arc, and no stand may
  stand inside a barrier or the run-off (one had been put on the run-off, where the wall samples fold over each other on
  the inside of Turn 8).
- Pit lanes: boards stood across the lane where it opens onto the track - at Las Vegas the green WHEN YOU DRIVE NEVER
  DRINK boards on Turns 1-2's inside wall ran on over the exit road; at Silverstone the pit wall's DHL / Emirates banners
  over the entry and exit roads. Both now stop where the barrier opens (the track's own rule: no pit wall, the lane's
  infield or the lane over the line). Checked by ray along each lane's path at 0.3 and 0.7 m on all four circuits.
- Seen on the way, not changed: Montreal's lane passes through its pit building's meshes near the garages (s ~4320-4350)
  and Austin's start gantry has a leg on the lane (s ~3) - to look at.

# V2.32 (2026-11-04): the Sphere zone, Wynn and Encore, the Sphere's one big screen, the T-cam

- T-cam (CockpitCamera.js): one fixed lens - set, never eased (no zoom-in back from the rear view or another camera);
  its tilt down a setting (T-cam tilt, 4-16 degrees, 9 by default: a touch higher than V2.26's 12), on the setup's
  Driving page and in the pause menu, kept in this browser. Q / E turn the lens on its pod at the same height and tilt
  (it used to rise 15 cm and level out: a diagonal sweep). The rear-facing lens on the pod's top at 1.30 m riding with
  the body: at 1.21 m, fixed, the 0.3 m near plane sliced the airbox (1.18 m) open whenever the body heaved.
- Turns 7-8 (TrackBuilder escapes band; VegasSphereZone.js): the run-off east of the chicane, ~195 m long and 33 m
  deep, painted aramco teal with green bands across it and the name along it; aramco's green and blue boards on both
  walls T7-T9 (Branding panel 31); a white lattice lighting gantry along the chicane's inside wall with the aramco
  banner; light towers and marshals' posts on the run-off's wall.
- The T-Mobile Zone at Sphere: magenta-clad stands outside the south leg, round Turn 6 and along the run-off (15
  sections), the lit T-Mobile cube on its mast; the fan zone inside the loop (29 marquees, container bars, the stage,
  light towers); the city's infill and auto stands kept out of the loop.
- Sphere: the F1 stream is one big screen (the feed across the face, bent with the shell; timing towers, caption,
  ribbon); a new show in the loop - race week's red shell with the white lattice and the race's title (SphereShow gp).
- Wynn and Encore (Landmarks.js): curved slabs fitted to their footprints (Wynn: the crescent, a 304 m curve, 231 m
  across, 26 m deep, concave to the Strip; Encore: on its footprint's curved north-east edge, a 233 m curve, 154 m, its
  podium the rest), bronze glass drawn floor by floor - warm rooms lit at random, a white line of light along every
  other floor, the dark crown, the names in white script, bronze end fins.
- To check against photos: which way Encore's tower curves (OSM's footprint has it concave to the north-east; the
  user's photo, a game render, shows its concave face from the Strip).
- Known: lap-1 pile-ups at T10-T11 (since V2.24): refit the Vegas AI calibration to the de-kinked line.

# V2.31 (2026-11-04): the Bellagio in detail, the fountains, a full city, live ground, the High Roller

- Bellagio (Landmarks.js): the front's curve read off its footprint (long axis, length, bow -> a 194 m radius, 207 m
  across, concave to the lake); a facade texture drawn floor by floor (arched base, paired windows in bays between
  pilasters, string courses, the top arcade, the lit cornice; floodlit warm at night), the raised centre bay, copper hip
  roofs, the stepped wings, the crown (drum of columns, plaque, ribbed dome, lantern). Its grounds (OSM's one 'building')
  as they are: paving, gardens and trees, the lakefront villas along the lake's west shore - not one 12 m block.
- Fountains: the semicircle out in the lake (outer and inner arcs, the tall heart, the arching jets), each jet a glowing
  core plus particles streaming up, bursting and falling as mist; warm gold.
- City: def.infill - blocks in rows along the circuit in OSM's gaps (343), clear of the circuit, footprints, landmarks,
  the lake and the race-week structures. Ground: a richer city texture (lots with bays, sidewalks, landscaping) with
  world-space variation and street-light pools at night.
- High Roller: one white tubular rim, laced cable spokes from two hub flanges, 28 glass cabins outside the rim on
  brackets, the A-frame and the rear leg on one side; floodlit white, a soft pink-lilac LED band.
- Known: lap-1 pile-ups at T10-T11 (since V2.24): refit the Vegas AI calibration to the de-kinked line.

# V2.30 (2026-11-04): the Bellagio at race week

- From the user's photos (MGM's Fountain Club render, the deck at Carbone Riviera 2025, the race-night aerial): the lake
  traced from the Bellagio's footprints (long along the Strip, not the old ellipse across it), animated fountains, the
  hotel's crown and BELLAGIO, the casino base at 3 floors, the Fountain Club (2 grandstands, 2 three-level structures, the
  Winner's Stage), MGM Rewards boards, palms opposite.
- Fixed on the way: the paddock module's exclusion box for auto-placed stands was its whole group's box - since V2.26 it
  reached the T4-T5 straight and would have reached the Strip: now one box per solid.
- Not yet like the photos: the Cosmopolitan (its blue LED stripes, the name, the marquee), Caesars lit gold, the lake's
  villas; the fountain show's exact choreography.

# V2.29 (2026-11-03): Paris Las Vegas - the Eiffel Tower and the Montgolfier balloon rebuilt

- No photo could be fetched (every image host is outside this environment's network allowance); built from documented
  facts: the tower 540 ft / 165 m half scale, deck 460 ft, restaurant on the first level, welded with false rivets; the
  balloon sign 180 ft to the top, a 72 ft balloon on a space-frame floor, a skin decorated to the 1783 Aerostat
  Reveillon, a mile of neon, a gondola carrying the digital sign (Federal Heath; Wikipedia; Caesars; VegasChanges).
- Tower (Landmarks.js eiffel): the Paris original's geometry halved - four lattice legs on a 62.5 m base, the first
  platform 35.3 m at 28.8 m with the lit gallery, the four great arches, the second platform 20.5 m at 57.9 m, the shaft
  to the deck at 140 m, lantern, mast, beacon; bronze-brown, lit warm.
- Balloon (Landmarks.js montgolfier): the Reveillon's shape, royal blue and gold (crown rays, star medallions, royal
  cipher and suns, red waist band with fleurs-de-lis, garlands, eagles), gold neon on the seams and bands; the gondola's
  four faces the Paris / LAS VEGAS sign; space frame, column, base.
- To verify against photos: the balloon's exact artwork, the sign's current screen content, the tower's exact colour.

# V2.28 (2026-11-03): the T-cam framed shot for shot against the 2024 onboards

- Captured in a race at the onboards' three spots on the Turn 4-5 straight (scratch tcam_shots.mjs), 12 lens / tilt /
  height variants side by side with the real frames. Kept: vertical FOV 40 (43 at speed), tilt 12 deg, the lens 5 cm up
  on the pod - the horizon a fifth of the way down, the fences to the top edge with a strip of sky, the buildings only
  glimpsed over them, the halo and the nose the share of the frame they are on the broadcast. (A lower lens put the
  helmet in the middle of the view; a wider one showed the whole city.)

# V2.27 (2026-11-03): the T-cam's lens tight, as the broadcast's

- Forward T-cam: vertical FOV 48 deg (52 at speed; was 68-76), the lens 10 cm higher on the pod, tilted down 11 deg - the
  halo's front bar across the lower third, the horizon a quarter of the way down; less of the scene in frame at once.

# V2.26 (2026-11-03): Las Vegas, Turns 2-5 to the 2024 onboards; the T-cam pitched as the broadcast's

- Pit entry/exit lines T-Mobile magenta, 0.35 m (def.pitLine, TrackBuilder).
- Boards (Branding 26-29): T-Mobile magenta out of T2, blue into T3, lilac T-Mobile right of the T4-T5 straight, bare dark
  wall left. (Replaces V2.25's Globant / #LasVegasGP, which came from the F1 25 game footage.)
- T4-T5 straight: double yellow, dark scrim + tall dark left mass, low dark right buildings, merch stalls, big screen,
  footbridge with the purple sign 150 m before T5; lit things fog-free. Fence-line lamps every 32 m down it.
- Sphere: a 'sponsor' show (royal blue, Red Bull) in the rotation (SphereShow, Landmarks shader modeAt / 288 s cycle,
  Lighting SHOW_GLOW).
- T-cam: pitched down 21 degrees (TCAM_PITCH), levelling out when looking sideways.
- Race tests: pit stop fine; lap-1 pile-ups at T10-T11 in 2 of 3 runs (0, 2, 4 retirements) - nothing there changed this
  version; the Vegas AI calibration predates the de-kinked line (V2.24) - refit it.

# V2.25 (2026-11-03): Las Vegas - the street circuit's catch fence, the walls' boards, the trackside kit

- `def.streetFence` (TrackBuilder streetFence, Las Vegas): posts cranked in at the top, clamps, five cables, the chain
  link up the crank; replaces the flat mesh band. (It was there all along in play; the scratch screenshot tool rendered
  before the detail culling caught up with its moved camera - fixed in the tool, not the game.)
- Boards: Branding panels 26 #LasVegasGP and 27 Globant; Vegas sponsorZones: Globant T2-T3, #LasVegasGP out of T4.
- Kit: recovery crane truck + telehandler outside T2, camera tower at the stand's start, boom lift beyond the bend, the
  gantry 190 m past T4.

# V2.24 (2026-11-03): Las Vegas - the lap without its kinks; Turns 2-4 to the onboard footage

- Kinks gone: the trace had swerved round the official map's own marks - the Turn 4 exit and 120 m after Turn 5 (sector
  colour changes), the straight from Turn 9 to Turn 10 under the SECTOR 2 label (now a line fitted to the map's pixels),
  after Turn 12, round the DRS dots after Turn 13, before Turn 14. Each stretch a smooth curve joining the line either
  side; lap rescaled to 6.201 km; against the map: mean 1.2 m, 95% 2.5 m (was 3.5 m). A scan of the whole lap finds no
  left-right jog left but the real corners. Turn 13 (flat out) keeps its label (main.js labelCorners: a corner with xz).
- Lap times 96-100 s in the race test (were 100-108 s: the kinks cost time). The AI calibration was fitted on the old
  line - a refit is worth doing.
- Turns 2-4: one stand on the inside of the bend from ~95 m after Turn 2 to Turn 4 (PG2/PG3/PG4), dressed to the 2023
  render (Red Bull, cabanas, lit aisles, orange block); outside: the hospitality building square to the return leg, the
  blue-edged building behind it, the lower building with the F1 sign and palms along the run out of Turn 4, the painted
  strip. PG5 (behind PG3 on the seating map) is folded into the one stand. The render's tented club and Red Bull
  building were not built: the onboard footage (2025) has the hospitality building there.

# V2.23 (2026-11-03): Turn 1's run-off on the real slant

- The exit side of the run-off is the return leg's barrier carried on at its own angle (the official map: the leg opens
  away from the straight), not a line parallel to the straight: 97 m across at the kerb, 85 m at the end wall, 16 deg.
  Paint, barrier, fence and light towers follow it. The asphalt shades light (kerb) to dark (walls).

# V2.22 (2026-11-03): Las Vegas Turn 1 to the race-night photo

- Turn 1's run-off is the whole rectangle at last: fairWalls had been rounding its barrier line into a balloon (32 m
  past the kerb at most); the escape's line is now held as drawn (Track.heldWalls) - 42 m past the kerb, square corners.
- Dressed to the photo from beyond it: lit asphalt to the walls, the Heineken / -0.0 band round the kerb, the LasVegasGP
  wordmark and two outline arrows, boards + catch fence + lattice light towers on its walls, WHEN YOU DRIVE NEVER DRINK
  boards and a lighting truss on the inside wall, boards on the braking-zone fence.
- Not yet like the photo: the city behind (dim, generic), the club at the hairpin's tip (the photo's stepped white
  terraces and grey tower stand right at the corner; the game's plaza ends short of it), the PG2 stand's orange frame.

# V2.21 (2026-11-03): Las Vegas on the official circuit map; start/finish and Turn 1 revamp

- The lap traced from the official map (LasVegasOfficial.js), start line at its flag, corners at its labels, pit lane
  laid beside it; Turn 1's run-off a straight-on rectangle (Track.escapes auto); the section dressed to the aerials.
- Tooling (session scratchpad, not in the repo): trace_full.py (map -> centre line), gen_pit.py (pit lane), check.py.
- Test: a race with a pit stop through the new lane ran clean (laps 102-108 s). AI calibration for Vegas was fitted on
  the old line - its corner numbers still apply; a refit on the new line is worth doing.
- Next sections (user to direct): the Sphere loop, the Strip, Harmon. Daytime look not reviewed.

# V2.18 (2026-11-02): dynamic weather

- New: `src/race/Weather.js` (rain cells on the wind, track water every ~10 m on the line and off it, the dry line,
  a forecast that can be wrong, radar, engineer calls), `src/world/Spray.js`, the road's wet shader (main.js
  `wetRoad`/`wxFrame`), the HUD weather panel and wet minimap, AI weather calls with per-driver nerve and team double
  stacks (`AIDriver.weatherCall`/`stackMate`), the planner reading the water off the dry line, Changeable in the menu
  and in career forecasts, `wet` telemetry channel.
- AI wet calibration: `tools/ai_fit_wet.mjs` from the driver's wet laps (Silverstone and Las Vegas at wetness 0.35,
  2026-11-01/02 exports). Montreal's export was a dry race (wetness 0): not used for the wet fit.
- To check in play: how often the AI gambles (wxStay / wxEarly spread), the drying rate at night, spray density
  on slow GPUs (Spray pool 2600 points, only cars within 330 m of the camera).

# F1 sim: work left after v72 preview (2026-10-09, 12:47)

**STOPPED 2026-10-10 ~09:35 (usage limit).** Resume each with `resumeFromRunId`; agents read their `progress\*.md` logs.
- **Customization** (wf_3e3a0ce2-4ef): fix round 1 in progress (progress\fix.md). Re-review, more rounds and the critic follow.
- **Anatomy/shoulders** (wf_b54ef0c7-89d): fix round 2 done. Round-2 re-reviewers were running; resume with the same args (see the earlier resume calls).
- **After-party** (wf_4b521fcf-915): all WPs built; integration in progress (progress\integrator.md). Five reviewers, fixes and the critic follow.
- **Wardrobe** (wf_ca0b03c7-ecf): clubwear v2 done; the pool venue is done. Swimwear in progress (progress\swimwear.md, new file src/world/Swimwear.js). Then the lace step (w2:lace), then occasions, then reviewers and fixes.
- **Restart on resume:** the checkpoint script (`scratchpad\checkpoint.ps1`, ended after 12 h), the wake lock, and the swimwear-render watcher.
- **Next publish:** smoke-test the whole tree (boot, races, career, hub, hangouts, party offer flow), bundle, check dist boots, then publish. That covers customization, clubwear v2 and the people fixes.

**STOPPED at about 21:20 (usage limit).** All workflows were stopped mid-step, so files may contain partial edits. To resume, re-launch each workflow with `resumeFromRunId`; each agent reads its `progress\*.md` log (session scratchpad) first.
- **After-party build** (wf_4b521fcf-915): in the Build stage, WP1–WP6 in parallel. Spec: `scratchpad\party_spec.json`.
- **Clubwear** (wf_a200b342-05a): the build agent was mid-test. 17 women's and 6 men's kits exist in People.js (`CLUB_KITS`); the Celebs club occasion, the hangout use and the partner suite may be partial.
- **Anatomy** (wf_b54ef0c7-89d): shoulder re-review, then fix round 2.
- **Polish** (wf_d959421f-f0b): the refix, plus eyes at distance, the floating chain and the halter back. Pass the same `args.extra` on resume.
- **Neck girth** (wf_81129bc8-300): neck fix.
- **Customization review** (wf_3e3a0ce2-4ef): not resumed yet; reviews, fixes and the critic still to run.
- **Clean up** `scratchpad\locks\shared_editors.txt` when resuming.
- **Horror sounds, fixed by the lead:** test pages on the dev origin start muted (localStorage `f1sim-mute=1`, or `?mute`). Hangouts never play atmos1-3; those are only for crash news and mourning. Hangouts are now silent where they used atmos. TODO: procedurally synthesised venue music (lounge, pub, synthwave, club house at 120–128 bpm with a beat phase for the party).

**Update, 20:15:** the 12:51 preview could not get past the main menu. The bundle died on `export { structKey as previewKey }` in StylePreview.js. bundle.py now handles export lists and refuses any other unsupported export. A fixed build (artifact version 74) is published.

**Resumed at 20:10:**
- the shoulder re-review and fix round 2;
- polish refix, now also covering eyes at distance, the floating chain and the halter back;
- the proportions fix;
- the neck girth fix.

The customization review, fix rounds and completeness check follow once those land.

The v72 preview was published to https://claude.ai/artifact/JezKn4tPsUYMSW8dABcW1f and `dist/index.html`.
It was bundled at 12:45 while agents were still editing, so it is NOT smoke-tested end to end (the browser tab cap blocked the check).

## Still running or unfinished when the session limit hit
Agents keep progress logs in the session scratchpad `progress\*.md`; restarted agents read them and carry on.

- **Customization build** (workflow wf_3e3a0ce2-4ef): core, player and partner are all built.
  - Partner still has to do: a persistence check over a reload, the leak test, pin rotation, undo / "her own", and the hangout style sheet.
  - Then the five-lens review (UI fit, persistence, perf/leaks, visuals, regressions), up to 3 fix rounds, and a completeness check against the original request.
- **Shoulder fix** (wf_b54ef0c7-89d): fix round 1 is done and its re-review is running; round 2 follows.
  - Known: Noor's rust one-shoulder bare-shoulder edge, Ava's covered-shoulder lump, the off-shoulder arm-top step, and the night-grid stars looking dim.
- **Polish** (wf_d959421f-f0b): its second fix pass is running.
  - Long hair (blowout/waves) still shows ragged seams from behind; it needs a smooth base mass with fewer non-crossing locks.
  - Sasha's bob shows a forehead wedge, and pale blonde messy buns have a roll along the front.
- **Proportions and silhouette** (wf_97c6dbcf-baa): built; two reviewers, then a fix, follow.
  - Open: everyone is about 0.92 of model scale (men 170 cm, women 163 cm); the bust apex sits a bit high; shoulder width is 0.193 H against a 0.21 target; plunge edges show slight corners up close; triangle headroom is thin (35.7k of 36k).
- **Neck girth** (wf_81129bc8-300): started.
  - Measured on the mesh, the visible neck is far too thick below the jaw. Men are about 50–54 cm (target 38, drivers 41–43); women are 32 under the jaw rising to 38–41 lower down (target 29–32).
  - The neck flares into the shoulders too early.

## Lead's notes on the clubwear renders (21:40), for its fix round or the final pass
- **Low-rise jeans:** the front shows an odd V panel at the crotch (clC_q.jpg, 2nd and 7th). Make the low rise a level waistband with a slight dip, not a V.
- **Sheer overlay dresses:** the overlay hangs past the hem like a translucent sack (clA_q.jpg, 6th; clB_q.jpg, 3rd). Make it fitted to the body, ending at a defined hem (midi or maxi), with a visible edge.
- **Men's untucked shirts and polos:** the hem has stepped notches at the hips (clMen_q.jpg, 5th to 7th).
- **Rooftop:** the Sphere renders as a blank white dome (hg_club1.jpg); its show or feed isn't running in hangouts.

## Clubwear fix round done (02:50); leftovers
- **Lace and mesh base layers:** the nude base under the lacemini's lace reads as bare skin over the bust (cf_game_f.jpg). It must be a clearly non-skin colour. Rule added to the shared notes for clubwear v2 and swimwear.
- **Open backs** (backless, slipmini): the bare back shows faceted shoulder-blade bumps with sharp light fins (cf_backcu_bq.jpg). It needs more back columns in the neck/back skin loft when OF.back is set, or a softer blade.
- **Glossy leather trousers:** a soft V crease where the thighs leave the pelvis band (cf_pelvzoom_q.jpg). A seamless fix needs the pelvis and legs as one lofted surface.
- **Mesh midi:** a pencil column; black mesh on very pale skin reads grey.

## Lead's notes on the Vegas club alpha renders (pvA_vegasclub_*.jpg, 02:26), for the party review
- **Walls and ceiling read as black void.** Real Vegas clubs have visible surfaces: LED wall panels, mirrored or padded walls, a lighting truss, columns, a ceiling rig. The stars overhead should read as a deliberate fibre-optic star ceiling, not open sky.
- **People are dark and flat under the club light**, with faces hard to read. Add a little rim or wash from the lasers and LED floor (relative lift, build-time).
- **Dance floor:** an LED tile floor with a disco ball and rings. Good, but busy: maybe fewer, larger tiles that pulse with the beat.
- **The bar** ("…LO ROOM"): a backlit shelf and onyx top look right. The sign is clipped at the left edge of the frame (check that it's centred).
- **The casino walk-in** (slots, a table, a rope line) is great.
- **The terrace** shows the Strip, the Ferris wheel and the Sphere with its eyeball. Good.

## Leftovers from the polish pass (finished 02:25)
- **Fair skin** (#efcfb5 to #f3d6c0: Maya, Mira, Ava, Sasha) reads as porcelain white under the lineup lighting (fin_st_q.jpg, fin_cb_f.jpg). Check exposure and tone mapping against real photos, and warm up or deepen the palette slightly.
- **Men's head-to-neck join:** a visible line from under the jaw to the nape in side and back views; on dark skin the head reads darker than the neck (fin_napez_s.jpg).
- **Men's full beards:** read as a heavy dark block in profile (fin_ear_s.jpg). Belongs with the men's face pass.
- **Pale messy buns:** the coils read as smooth wrapped bands; they need strand-direction shading.
- **Triangles:** the heaviest star look is Jade's curly bun + slit gown at 35,676.

## Clubwear v2: the lead's critique of the most revealing looks (rev_full_q/b, rev_cuA_f, rev_cuB_f), run after the clubwear workflow
1. **Hem length variety:** every mini sits mid-thigh, so haltermicro isn't micro. Add real micro, mini, mid-thigh and midi, and high slits on minis.
2. **Bandeaus:** they read as rigid tubes with thick straight edges. Add shaping: ruching or gathers, a sweetheart or straight neckline, fabric hugging the bust and ribs, a thin edge. Add variants: twist-front, one-shoulder crop, tie-front.
3. **Low-rise:** the V panel at the crotch looks like a pubic shield. Make it a level waistband sitting on the hip bones, with a button, belt loops, seams, pockets and denim texture. Jeans currently read as leggings.
4. **Blazer and bralette:** the blazer is boxy and the lapels thick. Make it sharper-shouldered with slimmer lapels, and give the bralette real cups and a band, worn open or with a single button.
5. **Sheer mesh dress:** the overlay hangs past the hem as a sack. Fit it to the body with a defined hem and a subtle mesh pattern.
6. **Cut-outs:** the edges read as punched holes. Add turned or bound edges, slightly bigger shapes (criss-cross, ring hardware, rib cut-outs), and a backless scoop down to the waist with a tie.
7. **Fabrics:** everything looks like the same glossy plastic. Give real material response: leather with grain and soft sheen; metallic and sequin with sparkle; satin with anisotropic highlight; matte crepe; knit rib; denim twill.
8. **Bodies under crops:** the midriff is a flat tube. Add a navel, a subtle waist and ab contour, and hip-bone hints where low-rise shows them.
9. **Leg colour:** the pink co-ord's legs come out pink-grey, looking like tights; the leg colour leaks from the accent. Make bare legs the default for club minis, with sheer tights only by choice.
10. **Bare shoulders:** the step at the arm top still shows (the shoulder fix round 2 is on it).
11. **Poses:** club looks need club poses (weight shift, hand on hip, leaning, dancing); the party build adds dances and a lean.

## User request 21:00, queued after the clubwear workflow
- More bandeaus and midriff-baring looks: bandeau and crop tops with high-waist or low-rise skirts and trousers, and co-ords.
- Spread them across occasions: club, casual, hot-race grids (Miami, Vegas daytime, Abu Dhabi), beach-club and yacht parties.
- The user likes the deep plunges and tight bodycon fits; keep leaning that way.

## Found 20:55, queued after the polish refix
- **Triangle budget:** 47 of 192 star looks are over 36k (max 41.3k, Jade's gown with curlyLong). Long hair is the cause: curlyLong about 16.9k, waves about 12.9k. Trim the hair's triangles without a visible loss.
- **Bug:** an unstyled woman can get a random men's look, including a beard.
- **Neck:** the women's head grew 6.5% (hd 1.14) for 7.65–7.96 heads. The neck agent must re-check the girth share against the new head.

## Found by the lead, not yet assigned
- **Eyes:** they read as white blanks at full-body distance, and one eye washes out at three-quarter views. The eye gloss has been reduced (`gr(0.8)` in faceTexture); next, darken the sclera, enlarge/darken the iris and strengthen the lash line so eyes read at distance.
- **Racewear and men's faces** (offered, not yet confirmed by the user):
  - suit livery panels and patches, and gloves;
  - a masculine face sculpt (brow, cheekbones, jaw);
  - men's hands.
- The plunge mini's sleeveless variant has a jagged shoulder edge (it uses a cap sleeve for now).
- The halter's open back looks flat and pale from behind.
- The slip/gown necklace chain floats off the neck.
- The test career renders used the name "Esselink Racing"; make sure no test save or keys are left in localStorage (agents back up and restore the real save).

## Then
1. Smoke-test: boot, quick race, career wizard, hub Look tab, partner style pages, hangout, grid walk, podium.
2. Bundle (`py -3 f1-vegas\tools\bundle.py` and `--artifact`) and publish the final v72.

Backups of src from before the build are in the session scratchpad `preBuild_src\`.

## v75 release (2026-10-11)
Built 02:07 (`dist/index.html` 31.7 MB, `dist/artifact.html` 8.5 MB, 112 modules). The offline file boots to the menu and a quick race runs with no console errors. Publish `dist/artifact.html` with the audio files from `assets/audio/` next to it: atmos1, atmos2, atmos3, clubcrowd, clubmusic, crowd, gasp, groan, horror and strings (.mp3).

**New for the player since v74**
- **After-party.** After a race, TONIGHT offers the nights out: your team's celebration, the Las Vegas GP after-party at the Halo Room, or the London club. You play the night in first person: the step-and-repeat, the bar and the dance floor, drinks with a meter, drivers and stars to talk to, drama, and photographers at the exit. You can also SUM IT UP or go back to the hotel. Next day a MORNING AFTER card shows the timeline, the press, the people and the texts. A team party settles the same way.
- **Tidewater Beach Club** at the Meridian Grand, Las Vegas: a night-swim pool party and a daytime dayclub, with DJ stage, pool, loungers and cabanas.
- **Swimwear:** 21 women's kits (bikinis, monokinis, one-pieces, cover-ups) and 4 men's. The stars have their own pool wardrobe, and Pool is a new occasion in the partner style suite.
- **Clubwear v2:** 22 women's and 6 men's club looks. The new fabrics include lace, mesh, leather and sequins.
- **Play as Yourself:** your own driver's face, hair, skin, eyes, suit and helmet. You set them in the new-career creator and can change them any time under DRIVER › Look.
- **Partner style suite:** LIFE › Style. You and your partner plan her make-up, hair and wardrobe for each occasion: race day, night race, gala, dinner, club and pool.
- **People polish:** smoother women's figures, with per-star builds and curves. The fixes:
  - garment seams: crop-top midriffs, low-rise waistbands, halter V-necks and armholes, men's hems and hips;
  - hair: closed bob underside, clean crown, nape hairline;
  - joins: the neck ring and nape, and the heel gap;
  - beards no longer turn white under lifted light.

**Gated off (the work is kept; nothing was deleted)**
- **Affection and drink** (the affection-intox build, stopped midway). Not in this release:
  - G "get close": hugs, holding hands, a slow dance, kisses, consent both ways;
  - stars getting drunk and acting bolder;
  - the pool's own drink model, and you in swimwear at the pool;
  - the cosy/stolen/carer press after the night.
  - **How it is switched off:** `export const AFFECTION_ON = false` in `src/ui/Affection.js`. With it false, Hangout.js never creates an Affection. Every other hook is null-safe and `res.aff` is never written, so `career/AffectionResult.js` (wired into CareerHub.finishEvening and PR.js) settles nothing.
  - **To switch it back on:** finish the work first, then set it to `true`. Still to do:
    - WP-B: author the paired poses for `world/PairFrames.js` (hug, arm round, hands, lean and so on). They are not in People.js POSES yet.
    - WP-A: add the two PartyPlay lines from its contract: `talkKiss(g, counted)` in `_kiss` and the `g.n.affHold` filter in `_leaveWith`. Also the HangoutTalk `affHold` topics.
    - Test the whole thing end to end. The logs are WP-A/B/C/D.md and affection-design.md in progress\.
- **Lace collection** (wardrobe w2 step 2b): only just started. Nothing is on disk, so there is nothing to gate.

**Known issues**
- The dayclub (13:00) shows the Las Vegas night sky behind the venue.
- Every session prints one harmless shader warning, `use of potentially uninitialized variable (f_canvasShow)`. It was already there before this round.
- People.js still holds the joins fixer's TEMP test counters and hooks (`globalThis.__JNB/__JNT/__JNoff/__JNR`). They do nothing in play; remove them when that fixer resumes.
- **people-polish-v3 left open:**
  - garments: cap/puff-sleeve and one-shoulder bites, shirt collar funnel, lapel spikes, bardot junction, lanyard path, trousers ballooning in lap poses;
  - joins: men's boxy shoulders, raised-arm shoulder join, face/neck tone contour;
  - hair: triangle trims, in progress.
- **Swimwear:** the gluteal-fold thigh/seat join is still slightly jagged up close.
- **Party fix round 1 left open:**
  - RR-2 could not be reproduced;
  - still to do: the UX-15 porte-cochère set, V5, V9, RR-15, PERF-3a/3c, crowd drunk templates and star face prewarm.
  - The round-2 reviews were cut short.
- **Frame time:** measured headless and capped at 60 Hz by vsync, so it says nothing about the GPU.
  - Rooftop with a star: 16.6 ms a frame, 18 ms CPU, 227k triangles.
  - Halo Room: 16.1 ms, 17 ms CPU, 341k triangles.
  - Team party: 16.0 ms. Pool club: 15.1 ms. Dayclub: 17.3 ms.
  - Re-measure on the Intel UHD laptop, especially the Halo Room.
- The dead dev files of the stopped agents were moved, not deleted, to `scratchpad\devfiles\` (e04a0948 session). They are tools labs, *_dev, affres_*, hairfix*, pb_*, jn_lab.*, gx_*, the gxp People copy and the src/world/__*.js copies.
- **Published as artifact Version 75** at 02:15. The audio now includes clubmusic and clubcrowd. The stale `offline.html` (an old build) was removed. main.js now hides the in-artifact download button when no offline.html sits beside the page: the full offline build (31.7 MB with its audio) is over the artifact's 16 MB file limit, so the user gets `dist/index.html` as a file instead.

## v77 (2026-10-11 09:30, weekly usage 90%): crowd fix and affection switched on
- **Club crowds:**
  - In Hangout._walk, people are soft for the player. Discs are flagged pp: 1 standing, 2 seated, 3 staff. `_free(..., soft)`, `_pressPeople` and `pressSlow`.
  - Standing guests side-step about 0.35–0.45 m. Furniture stays solid.
  - `PartyPlay._place` never puts anyone within 0.8 m of the player (used by invites, booth, _outWith and security).
  - Untested: London club, team party, rooftop (same code). Shuffled guests don't drift back.
- **Affection is ON** (`AFFECTION_ON = true`).
  - 12 crude pair poses are in People.js POSES; the 8 standing ones are in DRESS_POSES.
  - Hooks added: PartyPlay._kiss calls talkKiss, _leaveWith uses leaveHold(g), HangoutTalk has the affHold/affLeave gate.
  - Bug fixed: unshot(plan) now clears PairFrames.plan. Before, every shot after the first fell back to first person.
  - Camera fallback through the crowd.
  - Tested on the rooftop and in the Halo Room: hug, hands, slow dance, cheek, kiss, tipsy NPC kiss, a "no", care for a very drunk star, real-driver platonic only, rooftop fallout.
  - NOT verified: the Halo Room morning-after jealousy/press (needs a real post-race party).
  - Renders: aff_*.jpg in the f2e40f09 scratchpad.
- **v80 (11:35):** Tidewater is now a Las Vegas week EVENING venue. It's wired through Social VENUES 'poolclub' (date 'beach'), invites/moments, Agenda, Celebs, Phone, HubSocial, PR, HangoutTalk and main.js night mode, and the rooftop blurb is fixed. The agent was stopped at the 92% weekly line, so the career evening flow wasn't tested end to end in the lab; I only checked careerHangout({venue:'poolclub'}) on dist, with 0 errors. v81 (12:00): the Tidewater pool party is now a Vegas after-race invite. Party.js has poolclub in PLACE, PARTY_TIMES and RESIDENT; clubOf(track, season, round) alternates Tidewater and the Halo Room between Vegas races, because the TONIGHT sheet holds 2 cards. Also wired: PartyVenues, PartyTalk, Hangout party gating, HangoutTalk isPartyX. Tested end to end by the agent (offer, night, morning-after). The final clubOf tweak only got a boot check. Open: a third card so both clubs are offered on the same night; Vegas-only talk lines and the Jade guest-DJ spot still apply to the Halo Room only; drinks and affection at the pool party not exercised in the test.
- **Asked by the user (earlier, now partly done):** **Tidewater pool club is not reachable in the career.**
  - It is not in Social's or Agenda's venue lists and not offered as a party.
  - Add it as a Las Vegas week evening and/or a Vegas party offer. Small; first on next week's list.
  - The rooftop's pool nights are reachable now: Vegas week, evening "Rooftop over the Strip", about 1 night in 3.
  - Social.js still calls the rooftop's plunge pool one "nobody uses"; update that line.

## v82 (2026-10-11 13:15, weekly 93%): confront photographers
- NEW src/ui/PapsConfront.js (`PAPS_CONFRONT_ON = true`). Press P when photographed (a non-private evening, the party wall or exit, a photographed hug or kiss), then choose 1–4: ignore / "give me a minute" / swear / shove the camera.
- Fallout runs through papsFallout in CareerHub; sympathetic in grave weeks; a small chance of an assault complaint.
- Hooks: Hangout (prompt, P, _flash, _events, result), PartyPlay (_flashDom, papsExit at the photographed exit), Affection (_photoRoll -> personal), CareerHub.
- Open:
  - not hand-played and no renders;
  - the open story reuses the 'brawl' type;
  - arguments aren't counted as personal;
  - no photographers in the Memorial/Mourning3D scenes;
  - grief headlines say "him".

## Montreal: Circuit Gilles Villeneuve (2026-10-15)
- **What's in:** the circuit from the OSM export (`data/montreal.geojson`), the park verge mode (walled, grass verges), the Wall of Champions (pinned wall, yellow board, green strip), `src/world/Montreal.js` (water, islands, Biosphère, casino, pits, trees, stands, painted logos, skyline, bridges), the menus, the career and party name tables, and the Wall of Champions trophy.
- **The AI:**
  - per-corner calibration in `src/ai/Calibration.js`, trained with `tools/ai_train.mjs`;
  - telemetry fit with `tools/ai_fit.mjs`, waiting for the user's telemetry.
- **Pit lane fixes** (they were the AI's real problem at Montreal): `pitLeads` and `pitWallClear` in `tracks.js`, plus a pit wall clamp in `TrackBuilder.buildPitLane`. Before them, almost every AI stop crashed at the entry.
- **dist/artifact.html** gets these changes through `tools/splice_artifact.py <base commit>`, a three-way merge per module. The Artifact still has its own Version 93 modules, which are not in src/.
- **Open:**
  - the water and shore shapes are hand-drawn approximations; an OSM export with `natural=water` and the island coastlines would replace them;
  - Montreal has no nightclub venue: the career's night after Montreal offers the team party only.

## Artifact Version 93 (2026-10-15): Tidewater pool club fixes (dist/artifact.html only)
- **Source not updated:** dist/artifact.html is the published artifact (Version 93) and is AHEAD of src/. It contains src/world/PoolLife.js and src/ui/PoolPlay.js, which are not in the repo. Port them back to src/ before the next bundle, or the next `tools/bundle.py` run loses them.
- **Black water:** not a shader bug. The pool club was anchored at street level (main.js hangoutAnchor), so the world's ground plane (y -0.05, polygon offset) covered the sunken basin when looking down; how much depended on the driver. poolclub/dayclub now anchor 7 m up, on the podium PartyPool.js always expected.
- **Ordinary evenings:** with no PartyPlay, the clock now moves the phase (Warm-up, then Peak time, then Last hour) and each phase's `occ`. Before, the brain stayed in Warm-up (energy 0.5) and almost nobody danced.
- **PoolBrain fixes:**
  - a stronger dance urge at peak; groups of 3+ dance as a crew;
  - the long bar's slots every 0.8 m, kept 0.62 m from hero spots (it had one); the queue serves the first one actually waiting, with no duplicate entries and no re-route loop;
  - go() snaps targets to the nearest cell the guest may stand in: no guests in furniture, no non-swimwear in the water;
  - float drift stays in the water; a leaver with no path just goes;
  - bump() radius +0.3 m (excuse-me lines now fire);
  - swimwear wardrobes are barefoot.
- **careerHangout:** dayclub runs by day.
- **Measured headless:** sim 0.25 ms per frame, 146 draw calls / 322k triangles at peak with 168 guests (unchanged from before). GPU fps on the Intel UHD is still not measured.

## v83 (2026-10-14): photographers reworked (src/ui/PapsConfront.js)
- **Who comes, and why.** The flat per-frame roll in Hangout._events and the grave week's random long lens are gone (the old roll still runs if `PAPS_CONFRONT_ON` is off).
  - A night's *pressure* is the product of factors you can read: fame (yours, or your date's), PR heat, the venue (Vegas and the clubs high, a private room hardly ever, your flat never), the hour, a story still running, a partner or famous date with you, and a confrontation last round.
  - The pressure sets a budget of 0–3 photographers a night and the triggers that spend it: a tip-off, one drifting in, the late shift at 00:30. Event triggers: an argument in public, a photographed hug or kiss (via `_flash`), and the party's photographed front door (`papsDoor`, at the start of the exit moment).
  - Each arrival toasts its cause. A cooldown follows each confrontation (60–300 s by how far it went).
  - Never on a quiet or grave evening. Memorial and Mourning3D never open an evening.
- **Photographers are people** (`Pap`): makePerson plus a camera prop, an invented name and agency, and a temper (timid / pro / pushy). They walk in, stand, turn to follow you (a pushy one follows you about), raise the camera, and every flash comes from the lens. They leave when they have their pictures or have lost you. A small pose flipbook ('talk', 'stagger', 'restrain') swaps bodies the way Brawl's Kit does.
- **Confrontations.**
  - Walk up and press P ("Face Rocco"); the party's exit brings it to you. The four answers open it.
  - Then escalation menus: say sorry, keep at him, push the camera, let someone take you away, walk away. Esc is walking away.
  - His answer comes by temper, heat and what you did: back off, keep filming (video, a red light on the camera), call backup (two more arrive), grab your arm, or run.
  - Bystanders: your date, a driver you came with, party security or a venue's staff, the car at the door.
  - "Shove him off" after a grab is the real Brawl through PartyBrawl, which got an optional `lines`. The other photographers can be separators. A real-driver player gets no scuffle (PartyPlay's own rule).
- **Fallout** (papsFallout, the same c.pr model):
  - outcomes: calm / words taken back / words / shove / scuffle, plus viral footage (more likely if he was filming) and an assault complaint (less likely if he grabbed first);
  - its own crisis kind `'paps'` in PR.js (SEV between reckless and clash, titles by source: shove / scuffle / viral);
  - an argument in public (Hangout talk ending offended, party drama row/scuffle) counts as `personal`;
  - headlines are pronoun-free (no more "him"), and a real-driver player is "the <team> driver".
- **Test switches:** `__hangoutPaps` (budget 2, one at once), `__partyPaps`, `__papsComplaint`, `__papsViral`, `__papsReact`, `__papsTemper`, `__papsGrief`; `__hangout.paps` (state, `spawn`, `act`, `note`, `clear`).
- **Tested headless (Playwright + SwiftShader, 0 console errors):**
  - Vegas rooftop: spawn, cause and lens flashes; each opener answer; escalations; backup; grab → pull free; far shove (walk over); date and staff stepping in; grab → scuffle (Brawl QTE).
  - Halo Room: an in-room spawn; a photographed front door (photographers at the door, then car / scuffle → the night ends).
  - Party drama row → personal. Quiet evening → none. Full evenings at three venues.
  - papsFallout for every outcome, including grief, a real driver, forced viral and forced complaint.
- **Not verified:**
  - by eye at full frame rate, or on a real GPU;
  - the PR page's answer UI for a 'paps' crisis (only crisisFrom / crisisAdvice);
  - the Halo Room exit camera shows the lift doors, not the photographers (its porte-cochère is not built, as before);
  - Affection's photographed-kiss path (the date was not far enough along in the test).

## Resume checklist (FINAL pause 2026-10-11 ~07:00 after v76, weekly usage 89%; the user caps the week at 93%; weekly reset 2026-10-16 05:00)
Workflow scripts are in `C:\Users\Ethan\.claude\projects\C--Users-Ethan-Desktop-Porn\e04a0948-beb7-4317-b214-5c51c321084c\workflows\scripts\`. Copies are in the b0ed918f session scratchpad `wfscripts\`; use those if a scriptPath outside the working directory is refused. The journals are in the `b0ed918f-b235-4956-8498-4cdd9130b784` session's `subagents\workflows\wf_*`.
All background processes are stopped: shot server, checkpoints, wake lock and agent headless Edges. The dev server on 8766 is still up.

**To resume in a new session:**
1. Copy those `wf_*` folders into the new session's `subagents\workflows\`.
2. Call `Workflow({scriptPath, resumeFromRunId})`. Finished agents replay from cache.
3. Agents keep their own progress logs in the e04a0948 scratchpad `progress\`.
4. First restart the shot server (f2e40f09 scratchpad, `py -3 shotserver.py`, port 8768), the checkpoint script and the wake lock.

**Where each workflow stands:**
- **figure-curves** `wf_d4a7a2cd-ef3`: the seat smoothing to the user's spec is DONE (wide bell falloff, egg/teardrop profile). Only its reviews and fix rounds are left.
  - The lead's cap: the figure stays at this level. No further enlarging.
- **wardrobe-v2** `wf_ca0b03c7-ecf`: swim, lace (13 kits, Lace.js) and occasions (crops, pool looks with slick hair and braids, pool nights, the Swim slot) are all DONE and shipped in v76. Left: the three reviews (tech, visual, realism) and the fix rounds. They were stopped right after starting.
- **people-polish-v3** `wf_0e87be7b-125`: fix round 1 was partial. Garments, joins and hair are still open (list above).
- **afterparty-build** `wf_4b521fcf-915`: fix round 1 is DONE. Left: the round-1 re-review, the completeness critic and fix:complete. The pool club is not yet a party venue.
- **customization-build** `wf_3e3a0ce2-4ef`: fix round 1 is DONE. Left: the re-review, fix round 2 and the critic.
- **affection-intox** `wf_f7c71162-bcd`: the design and critic are DONE. WP-C and WP-D are built. WP-A's hooks and WP-B's poses are partial, so it is gated off (see above). Left: build, integrate, review.
  - The content line: PG; a "no" ends the thread; no romance with someone very drunk; real drivers platonic only.

## v76 release (2026-10-11)
Built 06:49 (`dist/index.html` 31.8 MB, `dist/artifact.html` 8.6 MB, 113 modules; the new one is `src/world/Lace.js`). `dist/index.html` boots to the menu and a quick race runs with no console errors. Neither bundle has a line starting with `export`. Publish `dist/artifact.html` with the same audio files as v75.

**New for the player since v75**
- **Lace collection:** 13 lace looks with real lace over a lining:
  - club: lace mini, bustier mini, corset with leather trousers, guipure corset, bodysuit under an open blazer, crop set and lace-sleeve mini;
  - evening: lace gown, lace midi and lace slip;
  - day: eyelet sundress and lace-trim cami;
  - pool: a lace beach dress.
  - The stars wear them. In LIFE › Style, Club and Gala each have a new Lace group.
- **Occasions:**
  - Race day has a new "Crops & co-ords" group (9 crops and co-ords) and a new preset, "Ivory crop & trousers". On hot race days the stars wear crops at the circuit.
  - At the pool the stars get pool make-up and pool hair: slicked back, or a real three-strand braid.
  - A star standing in the water wears only swimwear and goes barefoot.
  - The drivers at a pool club wear pool clothes, not suits.
  - About one rooftop night in three is now a pool night round the plunge pool, with some of the stars in cover-ups.

**Smoke test (headless Edge, test storage only, 0 console errors)**
- Boot and quick race.
- The career wizard to the hub.
- LIFE › Style: Race day (crops), Club (lace), Gala and Pool (bikini and lace cover-up). Every preview renders, and every page fits 1366x768 with no scrolling.
- Rooftop evenings: with Zoe, and a forced pool night with three stars.
- After the race: simmed weekend → TONIGHT → Halo Room → the night → MORNING AFTER card.
- Pool club with a star in the water; the real pool club and dayclub open and close cleanly.
- 40 people builds (13 lace looks in 2 poses each, 6 crops, 8 star pool looks): no errors, no broken geometry, at most 36.9k triangles.

**Fixes and reverts:** none were needed. Both steps shipped as their agents left them. Affection stays off (`AFFECTION_ON = false`).

**Known issues** (all of v75's still apply, plus):
- Close up, pool looks with long hair, a sun hat and a bag reach about 37k triangles, a little over the 36k people budget. The kaftan and pareo cover-ups are also just over it (this was already true in v75).
- Headless frame times are capped at 60 Hz by vsync: the rooftop pool night measured 16.7 ms with 288k triangles, and the Halo Room 16.2 ms with 340k. Re-check both on the Intel UHD laptop.
- Not yet reviewed by the wardrobe-v2 visual/realism reviewers (their round was cut short).
