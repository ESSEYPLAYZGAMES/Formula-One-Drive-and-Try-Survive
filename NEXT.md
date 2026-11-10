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
