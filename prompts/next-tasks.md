# Next tasks: prompts for new sessions

Three self-contained prompts, one per task, to paste into a new session. Each names the files to read first, how to
verify the work, and how to deliver it.

## 1. Barriers that absorb a hit

```text
Repo: ESSEYPLAYZGAMES/Formula-One-Drive-and-Try-Survive (Three.js F1 sim, modules in src/).

Problem: medium-sized crashes end in flips, cars splitting apart and fatal damage. A wall hit is one instant impulse: the
car's speed into the wall goes to roughly zero in one physics step, whatever the barrier is. Real barriers spread the stop
over a little time and distance, which cuts the peak deceleration. I want that: deceleration time goes up slightly, but
enough to change the outcome.

What exists (read these first):
- src/vehicle/Car.js, wall collision (around lines 880-950):
  - The car is pushed out of the wall, then given one rigid-body impulse with restitution e = 0.12 or 0.25, plus Coulomb
    friction along the wall.
  - Then it calls this.pulse(..., PULSE[bk], bk), where bk is the barrier kind from BAR_KIND[track.barL/barR], then
    applyImpact() and crushFlat().
  - applyImpact() sets severity from impact speed alone: sev = (vImp - 2) / 26.
  - Also look at crush(), the airborne/rigid-body path (_rbApply), and what drives flips and splits (the 'trip' events,
    wheel tear-off, Damage.js).
- src/track/TrackBuilder.js: BAR = { NONE, ARMCO, TYRES, WALL }, BAR_HEIGHT, track.barL / barR per sample. Also pinWall,
  escapes, the pit wall, Montreal's TecPro runs (def.walled), and tracks.js per-circuit settings.

What to build:
1. Give each barrier type its own give: a stiffness and damping, and a crush distance.
   - Concrete wall: almost none (a few cm).
   - A soft energy-absorbing wall (SAFER/TecPro type, where it exists): about 0.3-0.5 m.
   - Tyre wall: about 0.6-1.0 m.
   - Armco: deflects about 0.3-0.8 m, and can bounce.
   - Put these in one table, next to PULSE / BAR_KIND.
2. Resolve a wall hit over the contact time, not in one step. Use a penalty spring-damper over the crush depth, or split
   the impulse over substeps, until the car's speed into the wall is spent or the crush limit is reached. On concrete,
   keep the result close to today's.
3. Work out severity and damage from what the car actually felt (peak deceleration in g, plus energy absorbed), not raw
   impact speed. Pass that into applyImpact, crush/crushFlat, the flip and split thresholds, the driver injury/fatality
   logic, and the crash camera triggers. A 150 km/h glancing hit into a tyre wall should mean a broken wing and a rejoin,
   not a destroyed car.
4. Barrier types by location, realistically:
   - Las Vegas: mostly concrete. Put soft walls at the ends of run-offs and where walls face straight into the line: the
     Turn 1 run-off end wall, the Turn 7-8 run-off wall, the Turn 12 and Turn 14 outsides.
   - Silverstone and Austin: tyre walls and soft walls behind gravel; Armco elsewhere.
   - Montreal: walls plus TecPro (it already has a walled/TecPro flag).
   - Make it configurable per corner in src/track/tracks.js.
5. Optional, only if cheap: show the barrier give. Tyre-wall or soft-wall panels nudge back briefly; no permanent mesh
   changes needed.
6. Keep car-to-car contact as it is, unless the same instant-stop problem shows up there too.

How to verify (headless Playwright with the bundled Chromium; reuse tools/ai_lib.mjs openGame and tools/harness.js):
- Build a scripted crash rig: put a car at fixed speeds (100, 150, 200, 250, 300 km/h) and angles (15, 30, 60, 90
  degrees) into each barrier type.
- Log peak deceleration (g), contact time, final speed, severity, damage parts, flips, splits and injuries, before and
  after the change.
- Show the table. Medium hits must stop flipping or splitting. High-speed 90-degree concrete hits should still be serious.
- Run 22-car races on all four circuits (a race probe that logs impacts with the neighbouring cars) and compare
  retirements before and after.

Don't break: the AI's ability to rejoin after a light touch, pit lane walls, the flashback/replay determinism (seeded runs
must stay deterministic), or performance (no per-frame allocations).

Deliver: bump the version in index.html (#app-ver), add a NEXT.md entry, build with `python3 tools/bundle.py` (gives
dist/index.html), commit and push.
```

## 2. The car spins at medium to high speed

```text
Repo: ESSEYPLAYZGAMES/Formula-One-Drive-and-Try-Survive (Three.js F1 sim).

Problem: the player's car handles badly. It spins constantly through medium and high-speed corners on every circuit. It
should feel like a planted F1 car: hard to drive at the limit, but stable and predictable. Not twitchy, and not
arcade-like either.

Where to look first:
- src/vehicle/Car.js: the physics step.
  - Tyre forces, the friction circle, weight transfer, aero downforce/drag.
  - The assists: the ABS / traction-control clamps around line 738 (assists.tc / assists.abs, settings 'full' / 'abs' /
    'none').
  - Steering input handling, yaw dynamics, differential behaviour if any, and the sprung-body pitch/roll (hv / pt / rl).
- src/vehicle/Chassis.js: CH constants, tyreCap(), rollStiffness(), lateralLimit(), fitGrip().
- src/vehicle/Tyres.js: compounds, temperature and wear windows, BLANKET (cold tyres: 0.35 off the blankets).
- src/input/Input.js: keyboard/gamepad steering filtering, speed-sensitive steering, rate limits.
- The AI drives the same physics: src/ai/AIDriver.js, Planner.js, and the per-circuit calibration in Calibration.js.

Process:
1. Reproduce and measure before changing anything. Write a headless test (Playwright + tools/harness.js style) that
   drives the player car with scripted inputs:
   - a step steer at 120, 180, 240 and 300 km/h;
   - a constant-radius ramp to the limit;
   - lift-off mid-corner, and braking into a corner while turning.
   Log yaw rate, slip angles front and rear, lateral g, rear axle utilisation, and whether it spins (|yaw rate| or
   sideslip past a threshold). Run with each assist setting and on cold vs warm tyres.
2. Find the cause and fix it with physically sensible changes. Possible culprits:
   - balance too oversteery (rear grip, aero balance shifting with speed, roll stiffness split);
   - too much load transfer on lift-off or under braking;
   - tyre force curves falling off too sharply past the peak slip;
   - cold tyres too punishing;
   - traction control not covering power-on oversteer;
   - steering too quick, or input too raw at speed;
   - missing yaw damping from the tyres.
   Prefer fixing the model over adding a fake "stability" force. If you add any driver aid, tie it to the Assists
   setting.
3. Acceptance:
   - On full assists, a keyboard driver can take the medium and fast corners at near-AI pace without spinning.
   - On 'none', the car can still be spun by abuse, but it needs real provocation.
   - Show the measurements before and after.
4. The AI uses the same physics. After the change, re-run its corner checks:
   - single-car laps with `node tools/ai_train.mjs <track> --dry` for a baseline;
   - 22-car race probes on all four circuits (lasvegas, silverstone, montreal, austin).
   Its lap times should not jump unrealistically. If they move a lot, re-run the trainer for each circuit and say so.

Deliver: version bump in index.html (#app-ver), NEXT.md entry with the measurement table, `python3 tools/bundle.py`,
commit and push.
```

## 3. Clip check: things sitting inside buildings

```text
Repo: ESSEYPLAYZGAMES/Formula-One-Drive-and-Try-Survive.

Problem: scenery overlaps itself. TV screens stick into buildings, and landmarks intersect the city's building data
(OpenStreetMap footprints and the generated infill blocks). I want an automated audit for all four circuits, and the
overlaps fixed.

Scenery sources (read each one's placement logic):
- src/world/Landmarks.js: the custom landmarks via def(); clearLandmarksFromTrack; userData.keep (pieces deliberately not
  moved).
- src/world/Buildings.js: buildGenericBuildings and infillBlocks. Infill avoids the `avoid` rings built in src/main.js:
  landmark part boxes, the lake shore, vegas.boxes.
- src/world/VegasPaddock.js and src/world/VegasSphereZone.js: the Vegas race-week build.
  - Screens: the big TV screen on the T4-T5 straight (broadcastTexture), the fan-zone stage screen.
  - Also the stands, marquees, the T-Mobile cube, gantries.
- src/world/Silverstone.js, Montreal.js, Austin.js, Venue.js: each circuit's scenery, including its screens (e.g.
  Montreal's hairpin screen).
- src/world/Grandstands.js: auto-placed and fixed stands.
- The OSM footprints are geo.buildings.

What to build:
1. An audit script in tools/ (headless Playwright, like tools/ai_lib.mjs openGame). For each circuit, collect every solid
   object's footprint, either a convex hull or an oriented box in the XZ plane plus its height range:
   - OSM buildings kept and drawn;
   - infill blocks;
   - landmark parts;
   - stands and venue structures;
   - screens and signs.
   Report every pair that overlaps by more than a small tolerance, tagged by source, with world position, track s and
   overlap size. Also flag anything inside the track corridor (inside the walls or the pit lane), and screens whose face
   is buried in or blocked by a building within a few metres.
2. Fix them at the source:
   - move or shrink the generated or procedural item;
   - drop an infill block or generic building that collides with a landmark;
   - add the landmark's real footprint to the infill avoid list where it's missing;
   - pull a screen clear of the wall behind it.
   Don't move geo-exact landmarks (userData.keep) unless they are wrong. Never put anything inside the circuit's walls.
3. Re-run the audit until each circuit reports zero overlaps, or list the few left that are intentional (e.g. a sign
   mounted on a building), with reasons.
4. Render before/after views of the worst offenders, using camera poses at the reported positions, and include them.

Deliver: the audit tool committed, so it can be re-run after future scenery work; version bump; a NEXT.md entry;
`python3 tools/bundle.py`; commit and push.
```
