# F1 Las Vegas Strip Circuit Simulator

A modular Three.js (WebGL) Formula 1 racing simulation whose world is built at load time from an
OpenStreetMap GeoJSON export of the Las Vegas Strip Circuit and its surrounding footprints.

## Run

Any static file server works; ES modules require HTTP (not `file://`). Three.js loads from jsDelivr.

```bash
py -3 tools/serve.py . 8765
```

Then open <http://127.0.0.1:8765/>. `tools/serve.py` disables caching so edits are picked up on reload
(the stock `python -m http.server` lets browsers heuristically cache modules).

### Single-file build (no server, no network)

```bash
py -3 tools/bundle.py
```

writes `dist/index.html` (~3.7 MB): every module under `src/` concatenated into one inline module script, the
stylesheet and the GeoJSON embedded, and three.js plus the two addons embedded as `data:` URLs in the import map
(downloaded once from jsDelivr into `tools/vendor/`). Double-click the file, or right-click → open with a browser;
it runs from `file://` because nothing is fetched. Rebuild after editing the sources.

## Controls

| Key | Action |
| --- | --- |
| W / ↑, S / ↓ | Throttle / brake |
| A / D or ← / → | Steer |
| Space | Handbrake |
| Shift | ERS deploy |
| P | Request pit stop (opens the pit menu: 1-5 tyres, 7/8/9 repairs, Enter confirm) |
| R | Reset to track (offered after 4 s stationary; damage is kept) |
| V | Camera: cockpit → T-cam (airbox broadcast view) → chase → TV |
| C (hold) | Look back, cut in instantly, per camera: cockpit → the driver's view back over the engine cover; T-cam → the rear-facing T-cam; chase → reverse chase from in front of the car; TV → the trackside camera behind |
| Q / E (hold) | Look left / right: the head turns up to 80° and moves out past the halo (chase cam swings round) |
| T | Lap telemetry report (pauses; T or Esc closes) |
| H | Toggle the halo centre column |
| M | Mute |
| Esc | Pause (in Time Trial: finish and show results) |

A gamepad is supported (left stick steer, RT/LT throttle/brake, A = ERS, B = handbrake, Y = pit, right stick look
left/right, R3 look back).

## Architecture

```
index.html                 HUD / menus DOM, import map
src/main.js                bootstrap, world build, menus, weekend flow (quali → race → results / championship), frame loop
src/core/Projection.js     lon/lat → local metres (origin = OSM circuit-relation "start" node, +X east, +Z south)
src/core/GeoLoader.js      GeoJSON ingestion, road graph, Dijkstra leg routing with gap bridging + explicit waypoints
src/track/tracks.js        track registry (Las Vegas definition: legs, corners, landmark geo-anchors)
src/track/TrackBuilder.js  fillets (22 m tight / 55 m medium arcs) → Catmull-Rom (tension 0.5) → 2 m samples,
                           spatial hash nearest-point queries, road/kerb/run-off/barrier/pit/grid meshes
src/track/RacingLine.js    out-in-out lateral offset + grip/downforce speed profile (fwd/back passes, friction circle)
src/track/Branding.js      card-suit kerb texture, sponsor barrier panels, painted road decals (all canvas-drawn)
src/world/PitLane.js       continuous pit building, team garages, banners, painted pit boxes, the player's box marker
src/world/Grandstands.js   auto-placed grandstands with instanced cheering fans (collision-checked placement)
src/world/Lighting.js      camera-following floodlight SpotLights + the Sphere's coloured PointLight
src/world/Environment.js   night sky, lights, ground, fog, PMREM environment for glass/water
src/world/Buildings.js     footprint extrusion (height → levels×3.5 → 12 m) + lit-window facade shader
src/world/Landmarks.js     Landmark Intercept Engine: 25 name-matched procedural overrides (+ geo anchors when the
                           footprint is missing from the export)
src/vehicle/Car.js         car step: four wheels, aero/slipstream, diff, damage, barriers, crash rigid body
src/vehicle/Chassis.js     sprung body (heave/pitch/roll), load-sensitive tyres, road under each wheel, grip fit
src/vehicle/Tyres.js       compounds, distance-scaled wear with 70 % cliff, temperature
src/vehicle/CarMesh.js     procedural F1 car (damage visuals, halo, compound stripes)
src/ai/Planner.js          candidate paths, speed along each, traffic prediction, costs: the AI's tactical planner
src/ai/AIDriver.js         drives the plan (steering, pedals, ERS), racecraft costs, mistakes, pit strategy;
                           AI_TUNE constants exposed for live balancing
src/race/RaceDirector.js   grid staging, 5-light start + random hold, jump-start penalties, fixed-step world,
                           car-car collisions, slipstream, pit lane + stops, marshals, laps, classification
src/race/SafetyCar.js      race control: yellow flags, VSC, the safety car (a real car), restarts, the delta
src/race/Stewards.js       penalties: collisions, track limits, passing under yellows / SC, jump starts
src/race/Roster.js         2026 field (11 teams / 22 cars) in four performance tiers, custom 23rd entry, points
src/ui/HUD.js              timing, standings, tyre/damage, dash, lights, minimap, pit menu, results
src/camera/CockpitCamera.js eye-level cockpit cam with head-bob, lateral-G tilt, speed FOV warp; chase/TV extras (the cockpit view is framed by the helmet's eye-port, #visor in main.js, and your own car's halo is not drawn across the lens)
src/audio/Audio.js         synthesised engine/wind/impact audio
```

### GeoJSON pipeline notes

* The export contains the purpose-built pit straight + T1–T4 as `highway=raceway`; the rest of the lap runs on
  public roads (Koval Ln, Sands Ave, Las Vegas Blvd, Harmon Ave). The circuit is chained leg by leg through the
  road graph; two small gaps in the export are bridged with straight segments.
* The T5–T9 loop around the east side of the Sphere has no raceway ways in the export, only the circuit
  relation's member nodes, so those are explicit waypoints in `tracks.js`. Resulting length: 6.12 km
  (official 6.201 km).
* Start/finish (s = 0) is the OSM relation node with role `start`, directly in front of Grand Prix Plaza.
* The unnamed raceway way `way/1223479152` is the pit lane.

### Keeping the circuit clear

* Every generic footprint is tested along all its edges (5 m steps) against the racing corridor (barriers + 1.5 m
  margin, plus the pit lane); any footprint that touches it is dropped.
* Every placed landmark part is bounding-box tested against the same corridor after construction and pushed
  away along the local track normal until clear (`clearLandmarksFromTrack`). The Sphere is flagged `keep` so it
  stays on its OSM centroid. The Grand Prix Plaza is sized to its parcel so the 300 m spec length cannot spill
  onto the pit straight.

### Title screen, weather, driver picker

* The menu background is a live cinematic director (`buildShots` / `cinematic` in `main.js`): static tripod
  shots of the landmarks framed with the track in view (Sphere, Eiffel Tower, High Roller, Bellagio, Grand Prix
  Plaza, Cosmopolitan, Wynn, Venetian) alternating with trackside shots (pit straight, the Strip, T1, Koval,
  Harmon, Sands, the Sphere loop), crossfaded every 10 s. Five ambient AI cars lap the circuit behind the menu so
  they pass through frame; the trackside tripod pans gently to follow them.
* The Sphere runs a 10-show loop (24 s each): eyeball, planet, **golden emoji** (canvas-drawn: white rounded eyes
  that track and blink, thick brows with the raised-eyebrow look, tiny smile), basketball, **"Welcome to Fabulous
  Las Vegas" neon sign** (canvas: bulb chase, twinkling stars, VEGAS side letters), lava, **Grand Prix helmet
  emoji** (sky-blue helmet, visor band, event text), **F1 stream** (3×3 live tiles from `Broadcast.js`: five
  onboards incl. a rear-facing one, T1 and T14 tracksides, pit lane and helicopter, two tiles refreshed per
  frame), cloud sky, and the dark geodesic "off" mesh. Canvas shows live in `SphereShow.js`.
* Reverse: hold the brake for half a second at a standstill to select R (S drives backwards up to ~32 km/h, W
  brakes); W at a standstill re-engages first gear.
* Opening the pit menu (P) freezes the whole race until you confirm or cancel. You drive the pit entry yourself;
  from the speed-limit line the car is driven to your box for you (`RaceDirector.pitTakeover`: an AIDriver on your
  car, pitDrive), and you time the pull-in: Space / Enter / pad A as the needle reaches the mark (`ui/PitTiming.js`;
  the turn-in point is 30 m before the box). Within 0.12 s: PERFECT, nothing lost. Early or late, the crew lose time
  repositioning: from 0.15 s up to about 1.1 s at half a second out; never pressed, MISSED, +1.2 s (`pullIn`). The
  pit light is red through the stop and goes green at the release - the car is yours again that instant, on the
  limiter to the exit line. The turn-in point is also painted across the lane (an amber band with a lit post at
  either side), so it can be timed by eye; in the cockpit view the bar sits in the window above the wheel and the
  pit light up ahead. The boxes are painted like the real ones: a dark box, a solid yellow line down each side,
  orange chevrons down the middle pointing the way in, a yellow bar across each wheel's track at the axles and a T
  for the front jack, the team's name along the side (yours outlined in cyan).
* Dynamic racing line (on by default; L or the setup option toggles it): 1.2 m dashes painted along the racing
  line for the next ~280 m, as in the F1 games. Green, and red wherever the circuit's speed profile (corner speeds
  and the braking curves into them, scaled for your tyres' grip) is below the speed you are doing now: the braking
  zone and the corner ahead show red until you have slowed enough. Where the circuit has a driver's own lap
  (`show` in ai/Calibration.js, from tools/ai_fit.mjs on laps driven there - Austin) the dashes follow that lap's line
  and go red wherever you are quicker than it was there. With a stop called it becomes a guide into the
  pit entry and up to your box (red in the lane when over the limiter). (The old ribbon was wound facing down and
  back-face culled: it never showed.)
* Engineer radio (`Engineer.js`): only real events (position changes held for 2 s, retirements and pit stops of
  cars near you, your damage, gap reports at the line, lights out / final lap), max 3 per lap, 8 s apart, with
  a two-tone chime. AI cars run the identical car model and constants as the player; tiers only scale `perf`.
* Circuit dressing (`track/Branding.js`): the kerbs carry the Las Vegas playing-card suits (white suits on red
  blocks, black suits on white); every barrier is a sponsor panel (Heineken 0.0, Pirelli P Zero, Fabulous Las
  Vegas, LAS VEGAS chevrons, Vegas Golden Knights, aramco, Heineken Silver, "when you drive never drink") laid
  out in 180 m zones with the text reading left-to-right from the track on both sides; "LAS VEGAS" is painted on
  the run-off strip on the outside of the T1, T5, T12 and T14 braking zones (never on the racing surface), each
  side using the variant that reads left-to-right from outside the barrier.
* Pit lane (`buildPitLane`): the lane's own asphalt starts where it leaves the road with its track-side edge
  clipped to the kerb, and the pit wall only begins once its base clears the road edge (0.6 m outside the white
  line, 0.4 m past the kerb in corner zones) with a striped "nose" wedge tapering into it - nothing ever pokes
  onto the circuit. While the lane runs alongside, the circuit barrier on that side *is* the pit wall (`wallD`
  per track sample, NaN = open) and the car physics use the same arrays (`wallIn` per pit sample), so what you
  see is what you hit.
* Pit boxes (`world/PitLane.js`): a continuous pit building follows the whole walled length of the lane with
  garage bays at a 16 m pitch; the twelve team garages (roster order, the Independent car gets the 12th) sit
  shoulder to shoulder in the middle, each with a lit door, team banner, painted floor box in team colours and a
  numbered board on the pit wall. Your box is repainted cyan with your name; a floating "YOUR BOX" marker appears
  over it whenever a stop is called and a HUD cue counts down the metres while you are in the lane. The lane's
  asphalt tapers to a point against the road edge at the entry and the exit (`laneEdge` may go negative), so the
  merge is seamless; floodlight masts on the pit side stand behind the building, never in the lane.
* Grandstands (`world/Grandstands.js`): tiered stands with canopies are auto-placed in empty lots along the
  circuit; a candidate is rejected if any grid point of its footprint (plus a skirt) is inside the racing corridor
  (+3 m), within 5 m of a floodlight mast, inside a landmark's bounding box or inside any kept OSM footprint.
  Roughly 5500 fans fill them as one InstancedMesh, bobbing in the vertex shader (70 % of them cheer).
* Lighting (`world/Lighting.js`): the ten floodlight masts nearest the camera (masts every 60 m) carry real
  SpotLights with wide overlapping pools (re-parked every frame, so the whole 6 km is lit with a fixed light
  count), and the Sphere is an area light: four RectAreaLights wrapped around its shell take the colour of the
  show that is playing and throw it onto the track and the cars as a broad scattered glow rather than one point
  highlight. The night rig is lifted to race-night levels; the asphalt is slick enough (roughness 0.62, env map)
  for all of it to smear; everything switches off at midday.
* Run-offs (`Track._layoutRunoff`): the barrier distance is per sample and per side (`wallL` / `wallR`). A run-off
  is an escape area, not a wider lane: on the outside of a corner the barrier keeps running straight along the
  approach tangent while the road turns away from it (a car that locks up and goes straight has paved ground
  ahead), until the apron would exceed the corner's cap (42 m tight, 24 m medium, 12 m gentle) or the road has
  turned too far, then it closes back over 30 m (it may run on up to 40 m past the exit). T1 gets a ~36 m deep
  apron like the real one. Physics, corridor tests, mast and grandstand placement all read the same arrays. Only
  the apron is painted (red at T1, T-Mobile magenta around the Sphere loop whose barriers carry the T-Mobile
  panel, teal at T12 / T14); the normal 3 m verge stays concrete. Never on the pit side while the lane runs alongside.
* Reverse gear is fully kinematic (the slip-angle model assumes forward travel): steering left while backing up
  swings the rear to the left, like a real car; aero drag now opposes the motion in both directions.
* Sphere: the helmet emoji is redrawn after the real one (white / sky-blue helmet, visor up with "LAS VEGAS GRAND
  PRIX", F1 mark on the crown, the golden face in the opening with big glossy eyes) and cycles five expressions
  (surprised, grin, wink, tongue, nervous). All content turns slowly (one revolution per 5 min) so over a race it
  has faced every part of the circuit.
* AI mistakes: mostly lock-ups (run wide into the run-off, more likely where the run-off is big), snaps are rare
  and a twitch rather than a spin; the friction-circle profile plus trail braking keeps them from spinning on entry.
* AI straights: flat out, and the track-edge guard never lifts on a straight (see "AI: a planner" for ERS).
* Sphere marquee show: the chaotic old-Vegas casino-sign look (red field, golden bulb fans, purple ribbons, a
  vertical VEGAS blade with chasing bulbs), two-sided, in the 11-show loop after the F1 stream.
* F1 stream: four feeds only (the leader's T-cam, your T-cam or P2's, the T1 trackside camera and a wide shot of
  the Sphere itself), rendered one 256 px tile per frame into a double-buffered 2x2 atlas: the tiles go into a
  work target and are blitted into the one the Sphere samples, so the Sphere can film itself (it shows the
  previous frame's stream, the way the real wrap did). The shader lays the 2x2 grid out as a band around the
  middle of the visible shell with black gutters and blank dark space above and below, capped by a red glow.
* Finale: when a race or qualifying ends, the camera cuts to a static, slowly pushing-in shot of the Sphere
  for 7 s while it shows the "RACE WINNER" / "POLE POSITION" tribute (driver, team band in the team's colours,
  faint car number, gold title and rays); the results panel follows. `uForce` in the Sphere shader pins a show.
* Menu: the driver block collapses to one line (name, team, CHANGE) once a driver is picked; the starting
  position is a staggered grid of slot chips; "AI pace" is a 0-100 slider (Rookie … Legend) that scales the AI's
  cornering commitment and braking (0.94-1.02 of the tuned line, 75 = the default), in qualifying as in the race. The title crossfade sits under the menu, so only the scene fades.
* AI pace: the AI's top speed equals the player's (~350 km/h, identical car model); it trail-brakes (pressure
  released with steering lock and rear slip).
* Engine heat: following closely in dirty air heats the engine (about 40 s right on a gearbox to get hot); hot, it is
  derated (up to 6 % less power) and cools in clean air; only staying at the very top of the range does lasting
  damage, slowly. The AI drops back a few car lengths to cool it.
* Esc pauses every mode. In Time Trial the pause panel adds "Finish session" for the lap sheet.
* Photo mode (pause panel): free-fly camera over the frozen scene. WASD fly, Q/E down/up, Shift fast, drag or
  arrow keys to look, H toggles the HUD, Esc returns to the pause panel and restores the camera. The PLAY
  button (or P / Space) lets time run while you fly: your car is handed to an AI driver until you pause again.
* Sphere content faces the nearest point of the circuit (`uFace` / `uRight` uniforms) and reads left-to-right
  from there; the sign, helmet and stream repeat on the far side (the stream wraps cylindrically), while the
  one-sided emoji keeps a flat gold back. Canvas backgrounds are flat so there are no colour seams.
* Daytime facades: the window shader switches to sunlit stone/concrete with sky-reflecting glass panes.
* Damp/Wet weather adds GPU rain (a camera-following point cloud), heavier greyer fog, dimmed sun and wet,
  reflective asphalt; it previews live in the menu.
* Driver selection is team-first: a 4×3 grid of team tiles (plus the Independent 23rd car); picking a team reveals
  its two drivers.
* Grand Prix Plaza is extruded from its real parcel outline and fitted outside the corridor (shifted away from
  the track, then shrunk toward its centroid) so the F1 HQ stays without ever crossing the circuit.

### Time of day

`Midnight` / `Midday` (menu → Time) switches the sky shader, sun/hemisphere/ambient rig, fog, PMREM
environment, ground and track surface texture sets, dims window/neon emissives and drops the Sphere to daytime
luminance. The Sphere itself cycles eyeball → planet → basketball → lava → dark geodesic mesh every 24 s.

### Landmarks

19 of the 25 overrides are matched to named footprints in the export (Venetian, Palazzo, Wynn, Encore, Sphere,
Grand Prix Plaza, Caesars towers, Bellagio, Cosmopolitan, Eiffel Tower, Paris, Planet Hollywood, Elara …).
Six are absent from the export and are placed from geo anchors: Topgolf, High Roller, Lake Bellagio,
Colosseum, Harrah's and The Cromwell. Real-world positions are used (The Cromwell and Horseshoe sit at
Flamingo Rd, not at Turn 14).

## Performance

Profiled per frame (23-car race, T-cam) before / after the optimisation pass:

| | before | after |
| --- | --- | --- |
| CPU per frame (sim + submit) | ~50 ms | ~2.5 ms |
| draw calls | 417 | ~190 |
| triangles | 1.04 M | ~46 k |
| meshes in the scene | 1 934 | ~1 420 (most inside inactive LOD levels) |

Where the time went: the Sphere's broadcast atlas rendered two extra full-scene views every frame (~60 %),
the fans were 86 % of all triangles, and the 23 cars were 1 562 of the meshes (draw submission). Fixes:
* the broadcast atlas only refreshes while the F1 stream is on the Sphere (or fading in), one 256 px tile per frame;
* fans are flat coloured sheets (2 triangles) in one InstancedMesh per stand with a bounding sphere, so a stand
  off camera costs nothing;
* every static car part is merged per material, and a car has five states by distance (see "Car: real dimensions"):
  beyond 95 m it is one baked mesh and its shadow;
* lap-long track ribbons (road, lines, kerbs, run-off, sponsor walls, caps, fence, rail, masts) are split into
  chunk meshes that share their vertex buffers with a bounding sphere each, and the generic buildings are merged
  per 400 m cell, so only what the camera sees is drawn ("don't draw what isn't on camera");
* the Sphere shader evaluates the second show only during the 3 s crossfade.
The simulation itself (23 cars at 120 Hz, AI control at 60 Hz, each AI planning ~10 times a second) is ~1.5 ms per
frame in a full pack, less when the field is spread out.

Second pass (draw calls, allocations, throttling), measured off-screen with the GPU finished, race T-cam view:

| | before | after |
| --- | --- | --- |
| draw calls | 189 | 127 (grid start with all 23 cars in detail range: ~170) |
| render, CPU submit + GPU | 2.3 ms | 1.4 ms |
| landmark meshes | 288 | 154 |
| pit-complex meshes | 40 | 8 |

* landmark parts that share a material are baked into one mesh per landmark after the corridor pass
  (`mergeStaticParts`; the High Roller rotor and the Bellagio jets stay separate because they move);
* the pit boxes' floor tiles, banners and wall boards live in three texture atlases and three merged meshes;
* thin lap ribbons (edge lines, wall caps, fence, rail) use longer chunks;
* no allocations in the hot loops: the physics step's friction-circle clamp and barrier probe are inline over
  module constants, the camera and floodlight selection reuse scratch objects;
* HUD: fast telemetry (lap time, gear, speed, rpm, pedals) writes the DOM only when a value changed; gaps,
  position, tyres, damage and the limiter flag update at 10 Hz; the minimap and the racing-line recolour at 20 Hz;
* dynamic resolution: the render scale steps down by 0.1 when the frame-time EMA exceeds 18 ms (55 fps) and back
  up under 13 ms, between 0.6 and the 1.5 pixel-ratio clamp; it ignores frames while the tab is hidden;
* generic building cells further than 1.8 km from the camera are skipped (the fog has faded them);
* no light casts shadows (shadow maps are off); neon and signage are unlit emissive materials.
`window.__F1.perf()` logs draw calls, triangles, the average frame time since the last call and the render scale.

Third pass (both circuits, race 25 s in, T-cam; render time is CPU + GPU measured in the browser pane):

| | Las Vegas before | after | Silverstone before | after |
| --- | --- | --- | --- | --- |
| draw calls | 190-211 | 131 | 236 | 148 |
| lights in the shaders | 17 | 11 (15 near the Sphere) | 17 | 3 |
| render | ~18 ms | 1-4 ms | — | 1.6-4 ms |

* lights: daylight takes the floodlights and Sphere lights out of the scene (`visible = false`: an invisible light
  is not compiled into the shaders, one at zero intensity still costs a loop per lit pixel); the Sphere's four area
  lights are only in the scene within ~650 m of it; 8 floodlights follow the camera instead of 10;
* track ribbons that share a material (both edge lines, both kerbs, both walls, every sponsor panel) are merged and
  cut into 500 m map cells (`spatialChunks`): one draw call per material per cell in view. The 12 sponsor panels
  are one atlas texture (`barrierAtlas`), so the whole branded wall is one material;
* thin details (edge lines, kerbs, green strips, banners, tyre walls, fences, pit paint) are not drawn beyond
  700-1100 m (`DETAIL_CUT`, `cullDetail`);
* floodlight masts and heads are two instanced meshes; run-off decals are one mesh per reading direction;
* cars: each wheel is one vertex-coloured mesh (tyre, rim, compound stripe) plus its hub face, so a car in detail is
  27 meshes (was 35); beyond 80 m a car is one vertex-coloured mesh plus its shadow (was 6);
* grandstand fans are one instanced mesh per 400 m cell instead of per stand; debris pools with nothing in them
  are not drawn;
* memory: car meshes are disposed with their session (they leaked ~30 geometries per car per race before), and a
  circuit is fully freed when you leave it.

Fourth pass: night, and Las Vegas. Profiled on an integrated GPU (Intel UHD, the kind of laptop this has to run
on), timing the GPU, not just the main thread. Grid start, 1200 x 640, 4x MSAA:

| | before | after |
| --- | --- | --- |
| Las Vegas night, grid (all 22 cars in view) | 33 ms | ~18 ms |
| draw calls, same view | 882 | ~700 |
| shader programs compiled mid-race | up to 8 (0.3-1.8 s stalls) | 0 |
| resolution changes (80-400 ms stall each) | up to one a second | at most one per 4-10 s, only under sustained load |

* **Baked floodlight field** (`world/Lighting.js`, `FLOOD`): every lit pixel paid for 8 floodlight spots (and the
  Sphere's 4 area lights near it), and nearly all of those pixels are road, run-off, barriers and buildings that
  never move. Every mast on the circuit (186 at Silverstone) and the Sphere's four panels are now baked once per
  circuit (~0.3 s) into a world-space irradiance-vector field (half-float, ~2 m texels, at the ground and 14 m up).
  Lit by one light along that vector, a surface facing the lights gets exactly the diffuse light of all of them,
  plus one specular highlight. The world's materials (`floodlit`) skip the scene's spot loop and evaluate the field
  instead. The whole circuit is lit at once now, not only the pools nearest the camera. The cars keep the 8 real
  spots for the highlights in their paint and take the Sphere's glow from the field. The Sphere's area lights are
  never in the scene any more, so driving toward it no longer recompiles every car shader.
* **Draw order**: three.js orders opaque objects by material before depth, so the ground plane and the sky were
  shaded in full and then painted over. The cars draw first, the ground and the sky last, and the depth test skips
  their hidden pixels.
* **Cars**: the cockpit's steering wheel (plate, grips, gloves, display, buttons) is 2 meshes instead of 10, and
  isn't drawn beyond 15 m.
* **The Sphere**: its canvas shows (a 1024 px canvas, 20 uploads a second) and the broadcast feed (a whole extra
  scene render per tile) only run while the Sphere is in the picture; the feed renders a tile every other frame.
* **Dynamic resolution** works on GPU-bound machines now. It timed only the main thread's few ms, so it never saw
  the GPU struggling. It goes by the time between frames: down after 4 s under ~48 fps, back up after 10 s at the
  display's rate (not again for a minute if that was one step too far).
* **Shaders are compiled at the start of a session** (`precompile`, with hidden pools and LOD levels shown for the
  compile), not the first time a fire, a wreck or a far LOD comes into view mid-race.
* The standings DOM is only rewritten when it changes.

## Tracks

Three circuits are registered in `src/track/tracks.js`: `lasvegas`, `silverstone` and `montreal`. The game opens on a home
screen with a card per circuit (outline from `outline` in the definition) and builds nothing until one is picked
(`switchTrack(id)`, also on `__F1`); the built circuit is kept, so going back to the list and picking it again is
instant, and picking the other one replaces it. Going back to the circuit list unloads the circuit completely
(`unloadWorld` frees every geometry, material and texture, including shader uniforms); the Sphere's broadcast
render targets and show canvas exist only while Las Vegas is loaded. Only one circuit is ever in memory. A definition holds the OSM chain (road-name legs for a
street circuit, or an ordered list of raceway way ids via `ways`), the pit-lane way, and the venue dressing: ground,
kerb style, sponsor panels, run-off paint and text, default time of day, cinematic shots, landmark set.
`src/world/Venue.js` turns OSM grandstand footprints and the named pit building (the Silverstone Wing) into geometry.
Every `data/*.geojson` is embedded by the bundler.

Both tracks set `line: 'optimal'`: a minimum-curvature racing line over the usable width (`RacingLine.js`,
p-norm of the path curvature, projected Gauss-Seidel on a 40/20/10 m grid). Fast corners are only fast on that line.
Las Vegas keeps it 1.5 m off the white lines (`lineMargin: 2.5`): walls, not grass, if a car runs wide. Where the OSM
chain steps sideways between two parallel carriageways (Sands Avenue at Koval, T10), `easeJogs` in `TrackBuilder.js`
spreads the step over 160 m of road instead of letting the spline turn it into two 15 m hairpins.
### Montreal: the Circuit Gilles Villeneuve

`data/montreal.geojson` (the OSM export: the raceway, the pit lane, the island's buildings) holds the lap as one
closed one-way raceway (4.356 km built, 4.361 km real); the start line sits on the pit straight, the grid backs up to
the last chicane. It is a park circuit (`verge: 'park'`): grass verges, red and white kerbs and escape areas like a
permanent circuit, but concrete walls with debris fences all the way round (`Track.walled`), a TecPro run across the
back of the deep escape areas. The Wall of Champions is `Track.pinWall`: the outside of the T14 exit pulled in to
1.7 m of green paint behind the kerb, the yellow "BIENVENUE AU QUÉBEC" wall, "WALL OF CHAMPIONS" painted on the strip.
The pit lane is led in and out along the left edge of the road (`pitLeads`: the export draws it from the racing
line's own nodes) and its wall starts clear of the T13 kerb (`pitWallClear`).

`src/world/Montreal.js` is everything the export does not carry, drawn by hand against the buildings it does: the
Olympic rowing basin parallel to the pit building, the Seaway, the lake and its beach inside the Senna end, the Chenal
Le Moyne, Ile Sainte-Hélène; the Biosphère (a see-through double-layer geodesic lattice, 76 m), the casino (the French
pavilion's aluminium fins, the Quebec pavilion's gold cube), the pit building with the Paddock Club on its roof, the
Tour de Lévis, the hairpin's screen, Habitat 67, downtown's towers and Mount Royal with its cross, the Jacques Cartier
Bridge; 14 grandstands by their real numbers (1 Gold, Platinum, 11/12/15 at the Senna S, 21, 24, 31/33/34, 46/47/47B at
the hairpin, the infield stand); the logos painted on the grass and run-offs (Rolex, AWS, Shell, the maple leaf);
and about 5,600 trees of five kinds (maples, green ash, Lombardy poplars in rows along the basin, weeping willows on
the shores, white spruce on Sainte-Hélène's hill) - two instanced meshes per kind, a detailed model within 300 m of
the camera and a 26-triangle one beyond (10 draw calls for every tree; the whole circuit draws ~90 calls / ~230 k
triangles a frame, under Las Vegas). The water and shores are approximations: the export has no water polygons.

Career: a kiss of the Wall of Champions in a race (`RaceDirector.onImpact`, `car.wocKiss`) is kept with the season it
came in; win the title that season and the **Wall of Champions** trophy is yours.

### AI calibration: training, and telemetry

`src/ai/Calibration.js` holds, per circuit and corner, how much the AI commits on top of the physics: `v` (corner
speed over the planner's grip limit around the apex), `b` (braking commitment into it), `err` (how often a mistake
happens there), `scrape` (the share of those that brush the outside wall - Montreal's T14). The planner reads them per
sample (`track.aiV`, `track.aiB`).

* `node tools/ai_train.mjs montreal [--target s] [--dry]`: headless laps of one AI car (seeded, neutral form, softs,
  no stops, mistakes off - `__calRun` in tools/harness.js). Makes every corner clean first, then tries every corner
  group a step faster and slower, keeps what is quicker by more than the run-to-run noise and stays clean, confirms
  it, shrinks the steps; takes a margin back; writes the result into Calibration.js.
* `node tools/ai_fit.mjs montreal lap.csv [more...] [--offset m] [--blend 0.7] [--dry]`: fits the calibration to
  telemetry - the game's own export (`f1sim-telemetry/2`), a CSV with Distance / Speed / Brake columns (FastF1's
  telemetry saved with `to_csv` works as is; the fastest lap when there is a Lap column), or JSON. The trace is lined
  up against the AI's own lap by its shape; each corner's minimum speed and braking point, relative to that lap's
  average, move the AI's numbers toward it (the sim car is not the real car: the shape of the lap is fitted, its
  overall pace is left alone); the AI then drives the result and any corner that is no longer clean goes back.

* The lap mode (`node tools/ai_fit.mjs austin telemetry.json`, the game's own export on the same circuit): one lap is
  made out of all of them - the circuit in sections between the corners, each from the fastest lap through it that
  stayed on the road and was not rewound there (a flashback: the attempt it abandoned and what came after it), blended at
  the joins, its line smoothed of steering corrections. That lap is the racing line drawn on the track (`show`: where it
  was on the road and its speed every 2 m; red wherever you are quicker than it was there). The AI keeps its own line -
  driven by the AI, a human's line was no quicker through any section: its controller cannot scrub speed at full lock
  as a driver does - and its corners are fitted to the lap's minimum speeds and braking points, at the difficulty
  slider's top (`--diff`, what holds there holds below) on new tyres at every line, then driven: a corner group that is
  no longer clean goes back, and a pass that is still not clean is undone. A car on its own is not a race: the whole
  of such a fit spun a full field three to seven times as often (the pack on the opening lap above all, then traffic and
  dirty air), so the corners are written at `--race 0.5` of it and marked `pack`: the AI drives them only in clean air
  after the opening lap (AIDriver: from 25 m to 100 m behind the nearest car ahead they fade back in; with a car
  alongside, none). Austin's racing line is the composite of three laps of Leclerc's at Legend (95.5 / 96.9 / 104.5 s,
  flashbacks in each; the composite 96.7 s); its corners took the AI's solo flying lap at Legend from 101.6 s to
  100.2 s (the full fit, 99.7-100.3 s, gained little more), and in full 5-lap races at Legend (the same 3 seeds) the
  field's median best lap from 105.3 s to 103.6 s with as few spins (19 against 19.3) and fewer damaging hits (51 against
  57). Halving every factor did better in races than capping the large ones (1.15 / 1.08: 25 spins). That still left
  the AI 3-4 s off the driver (it cannot scrub speed at full lock as they do), so Austin also gives the AI cars 8 % more
  grip (`aiGrip: 1.08` in tracks.js - the car and its plan both, the same margin to the limit): alone at Legend 95.9 s,
  the driver's own 95.5-96.9; in full races fastest laps 95.0-96.5 s, the median best 98.5-100.8 s, spins (20 against
  19.3), solo spins (7 against 7) and damaging hits (57 against 57) as without it.

Both need Playwright and a Chromium (the scripts find `/opt/pw-browsers`, or set `CHROME`). After a fit, rebuild the
game (`tools/bundle.py`, or `tools/splice_artifact.py <commit>` for the published Artifact, which carries changes of
its own that a rebuild from src/ would lose).

### AI: a planner

`src/ai/Planner.js` plans, `src/ai/AIDriver.js` drives. About ten times a second (staggered across the field) each AI
car lays out candidate paths over the next 120-300 m as lateral offsets at 5 m nodes: the racing line, lanes 1.8 /
3.5 / 5.5 m to either side, the bigger ones also as a move that rejoins the line after 90 m, holding its present
lateral position, and the path it chose last time. For each one it works out:

* the path's curvature: the racing line's own (what the speed profile was built on) plus what the lane changes about
  it, measured from both paths' geometry;
* the speed it can carry along that exact path with its own grip right now (tyre compound, temperature, wear and
  the cliff, dirty air, wing and suspension damage, the driver's rating and the difficulty slider): the corner limit
  at every node, braking back from each (friction circle and the rear axle's trail-braking limit), feeding the power
  in no faster than the tyres take it out of a corner - and, separately, what it will actually do from its speed now;
* where every car near it will be over the next 6 s: an AI car from its own plan, the player and anything spinning or
  wrecked from its motion now (braking cars keep braking, launching cars keep launching), kept on the road;
* the traffic along the path: a car ahead in the lane caps the path to that car's speed from a following gap behind
  it (longer while it brakes hard, longer when the engine is hot), slower still while inside the gap, and the path is
  re-planned with the cap; a path that runs into a car alongside is ruled out; a car the AI cannot read (the player)
  gets an extra 0.5-1.5 m of room; a car a lap up gets room to pass (blue flags).

The cost is the time over the horizon, plus the time lost after it (arriving slower), changing its mind (more the
further the new lane is, and more on lap 1), running off the racing line, and racecraft: holding the grid lane off
the start, and one defensive move to the inside of a braking zone when a car within half a second is closing (never
in a fast sweeper, not every time, then a cool-down). Overtakes, following, side-by-side racing, giving room and
avoiding wrecks all come out of that one comparison. The first lap is driven with a little more room.

Racing the player (`AI_TUNE.bold`, by the driver's aggression; half of it on the opening lap, none under race control).
The player is the one car the AI cannot read by its plan, and it used to give every attack up: a twitch of the wheel
read as a move (the raw sideways speed extrapolated), braking read as stopping dead (the deceleration carried on for
1.5 s: every lane behind the car a wall), the racing line it was predicted to trace sweeping across every lane in a
corner, extra room that grew the faster the AI was closing, and a direct check that stood on the brakes when a car a
car's width beside it moved 20 cm. Now: the player's sideways motion is read through 0.4 s with a dead band for
corrections; braking predicted down to the corner, not to a standstill; a meeting with the player more than 2 s off is
a guess (gone for, at a cost) rather than a wall; once side by side - its front wheels up to the player's rear ones, a
car's width between them - the AI expects the room the rules give it and squeezes rather than lifts; the direct check
only fires on a real overlap. And it races for the place: a path that gets past (or alongside) counts for more than
the time (only a path that is beside the car where it draws level, not one through it), it sticks to a move it is
making, and it has two more moves - the lunge (the attacking lanes braked 4 % later) and the switchback (wide into the
corner, across behind the car at the apex, up the inside out of it). In a test at Austin against a scripted car the AI
could not read, about 5 s a lap slower and weaving +-0.4 m round its line, the AI behind got by in 7 runs of 8 (the
old AI 8) in a median 31 s instead of 50 s - half of its passes through the esses (the old AI's: one in ten, the rest
at the hairpins and the end of the back straight) - with no contact in either, nor against one that gave no room.

The same moves against another AI car (`AI_TUNE.boldAI`, by aggression; none on the opening lap or under race
control), read by its plan - the fixes for an unread car do not apply - plus corner ownership: where an AI car's path
meets another's in a corner, on the inside of it and level with it there (its nose at least to the other's middle),
the corner is its own, and the other car is expected to leave the room. Its own plan reads it the same way round - it
is the one outside - and gives way, so the two agree rather than both lifting. In a duel of two AI cars (the attacker
about 4 s a lap quicker) the pair ran side by side 45 % more with no more contact; in 5-lap races of the full field
the overtakes, spins and retirements were what they were, with a little more rubbing (damaging hits 54 a race, 47
before).

`AIDriver` drives the chosen plan: pure pursuit to a point on the path with a slip-angle feed-forward (above 35 m/s)
and countersteer; the pedals aim at the most the plan allows a moment ahead (flat out below it, braking onto it),
limited by what the rear tyres actually have left after the cornering (with the rear at its limit it lifts instead
of braking); a car right in front closing hard between two plans is caught by a direct check. ERS is deployed on the
straights from 270 km/h, and lower down only to attack or defend on a straight with charge to spare. Human mistakes
(lock-ups, running wide, rare snaps) are rolled once per corner from rating, tyres and pressure. Spun or stuck cars
stop, wait 2 s and are put back on the track.

Strategy (`AIDriver.planRace / strategy`): every AI car gets a race plan on the grid. *Standard* stops near the cliff
and sometimes covers a rival's stop; *early* (the undercut) starts on softs, stops at about half wear and usually
covers; *long* (the overcut) starts on mediums or hards, runs to the cliff and ignores rivals; *gamble* - mostly the
back of the grid - starts on hards and stays out as long as it can, waiting for a safety car, and stops under one
whatever its tyres. A car just ahead or behind (within 2.5 s) turning into the pit lane may be covered at once. Pit
calls look ahead (boxing at this entry if the tyres would pass the plan's wear before the next one; a front wing that
has lost real downforce is changed), and after every stop the plan is made again for the next stint. Under the safety
car a stop costs a fraction of one at racing speed, and it is taken when it is one the car has to make before the flag
anyway - the mandatory stop not made yet, or tyres that will not last (their wear now and the wear of the last lap
against the plan's limit) - or when the tyres are past their best with the laps left to use new ones, unless the car
runs in the top three on tyres that will last (the track position is worth more); under the VSC (it saves less, and
ends any moment) only for a stop it has to make. A stop called for the safety car's sake is called off if the race is
green again 250 m or more before the pit entry (a stop the car needs is called again when its tyres say so). With two
laps or less to go a stop for tyres is never made unless they are finished
(it cannot pay back), and a short race's tyres last it - a 3-lap race's softs are near the cliff at the flag, not two
laps before it - so nobody stops in a sprint.

### Car: real dimensions, four wheels, suspension

`CAR` in `src/vehicle/Car.js` carries the figures of a 2022-25 F1 car: 798 kg, 3.6 m wheelbase, 2.0 m wide, 5.66 m
long, 45.5 % of the mass on the front axle, 44 % of the downforce. `CarMesh.js` builds the car on that envelope (0.97 m
tall at the roll hoop, rear wing top at 0.95 m, 720 mm tyres 305 / 405 mm wide) and the onboard cameras sit at the
matching heights (driver's eye 0.77 m).

The model follows the 2026 cars (an Audi R26 blueprint): a slim wedge nose sitting on the front wing's mainplane, three
flaps a side curving up to the endplates, the halo, letterbox sidepod inlets over a deep undercut, the sidepods' flat
tops ramping down into a coke-bottle tail, a narrow shrink-wrapped engine cover with a blade airbox and shark fin, the
two-element rear wing with its DRS flap, pylons, beam wing and rain lights, the diffuser and its strakes, double
wishbones with push and pull rods, brake ducts, and tyres turned from a real profile with PIRELLI / P ZERO on the
sidewall and the compound's band. The surfaces are lofted through superellipse cross-sections (crisp shoulders, a
narrowing top, an undercut drawn in at the bottom) and the wing elements swept from aerofoil sections. Every part's
geometry is built once and shared by the whole field (a car has only its own paint, decals, number and helmet), so a
car costs ~8 ms to make. Its states by distance from the camera (scaled by the lens: photo mode's long lens brings the
detail in with the car):

| state | distance | what is drawn | triangles | draw calls |
| --- | --- | --- | --- | --- |
| ultra | < 14 m | everything, and the cockpit's own (steering wheel, display, gloves) | ~47 k | ~48 |
| high | < 38 m | fine tessellation and the fine work: suspension rods, drive shafts, ducts and winglets, floor fences and edge wing, diffuser strakes, louvres, flap brackets, tyre lettering | ~46 k | ~46 |
| medium | < 95 m | the same parts coarsely tessellated, no fine work | ~7.8 k | ~34 |
| far | < 260 m | one baked vertex-coloured mesh and its shadow, baked again when the car loses a wing or a wheel, is crumpled or changes tyres | ~3.5 k | 2 |
| minimum | beyond | a silhouette | ~240 | 2 |

`src/vehicle/Chassis.js` is the four-wheel model. The body is sprung: heave, pitch and roll on corner springs
(~4 Hz), dampers and anti-roll bars (58 % of the roll stiffness at the front), so weight transfer takes the time the
body takes to move and every wheel has its own load. Each tyre's grip comes from its own load with load sensitivity
(grip ~ load^-0.09), and the rears are a third wider (higher nominal load). Drive goes to the rear wheels through a
limited-slip diff; brakes, ABS, traction control and the friction circle work per wheel, and the yaw moment includes
the left / right force difference. The road under each wheel is sampled: kerbs rise 20-50 mm toward their outer edge
with ridges along them (a wheel on a kerb is loaded and unloaded several kN, the car rolls, the far wheel can go
light), grass and gravel are lumpy, and a wheel follows a step over the tyre's envelopment time. Elevation from survey
data plugs into `roadHeight`. Grip is set from what the real cars do, not from lap times: about 2.35 g at 100 km/h
and 5.45 g at 290 km/h, with the rear axle 4 % (slow corners) to 7 % (fast) in hand, so at the limit the front lets
go first and a lift at 280 km/h does not spin the car. `fitGrip` turns that into the effective friction and downforce
the speed profile and the AI plan with. `brakeMax` is a 5.2 g stop on the tyres plus about 1 g of drag from top
speed. Power and drag are unchanged (about 350 km/h with ERS). The car body pitches, rolls and squats (about 35 mm at
speed under downforce) on screen, each wheel stays on the road under it, and the cockpit and T-cam ride the body.

### Verges and run-off

`Track.surface(i, d)` says what a car is driving on: road, kerb, paved run-off, grass or gravel (`SURFACE` in
`Car.js`; grass and gravel cut grip to about half and add rolling resistance, a gravel trap stops a car at roughly
1 g). A street circuit is paved to its walls. A track with `verge: 'circuit'` (Silverstone) has grass verges
`vergeWidth` metres wide, kerbs in the corners and along the exits with a painted green strip behind them, and escape
areas on the outside of every corner: gravel by default, painted asphalt for the turns in `runoff.asphalt`, plain
grass for `runoff.grass`, up to `runoffCaps` metres deep and pulled in short of every OSM building, grandstand and
other part of the lap (`Track.capRunoff`, `Track.capSelf`). In front of the real grandstands the escape area runs
all the way out to them (`Track.extendToStands`: any stand footprint within 90 m of the verge): gravel (asphalt where
that corner's run-off is asphalt) right up to a tyre wall 4 m in front of the stand, the barrier tapering back to the
verge at each end.

Barriers are per sample and side (`Track.barL / barR`, `BAR` in `TrackBuilder.js`: none, Armco, tyre wall, concrete
wall). A street circuit is walled all the way round. On a permanent circuit `Track.layoutBarriers` puts a barrier
only where something stands behind the verge: a banner-covered tyre wall in front of grandstands and buildings within
15 m, Armco between two parts of the lap that come close, the concrete pit wall. About two thirds of Silverstone has
none: a car that goes off just runs onto the grass. Cars collide only with barriers that exist.

### Crashes

Barrier and car-to-car contacts are rigid-body impulses at the contact point (`Car.velAt / invMassAt / impulseAt`,
Coulomb friction along the barrier): a glancing hit slides the car along the wall, a corner-first hit or a tap on
the rear corner spins it. Damage follows the impact speed at the contact point; the rear wing only takes damage from
a solid rear hit (losing it should take a real accident).

Car-to-car contact knows what touched what (`RaceDirector.js`: each car is a 5.66 x 2.0 m outline with probe points
at the four wheels, the wing corners, the nose, the sidepods and the rear; `touch()` sets the consequences):

* wheel against wheel: the tyres interlock and kick each other (more restitution and friction, the impulse turns the
  car more) and the struck wheel bounces off the road, losing up to ~55 % of its grip for ~0.2 s (`Car.bounceWheel`;
  a brush under ~4 km/h of closing does nothing). On a straight that is a twitch, in a 2.5 g corner a 7 km/h touch
  is survivable and a 14 km/h one is not; a car at the limit in a 4.4 g corner is spun by a 7 km/h touch on the rear
  wheel, as at Copse in 2021;
* a front wing clipping a wheel: the wing loses its endplate, the wheel bounces;
* a nose into a sidepod at an angle (a T-bone): full damage to both, the struck car's suspension; above ~80 km/h of
  closing the nose can ride up the sidepod and the hitter takes off (at most half the time);
* sidepod against sidepod: a rub - a soft, low-friction nudge and next to no damage;
* damage goes where the contact was: a wheel into the suspension (the car pulls to one side), a wing into the wing.

Small debris is mostly swept away once it settles (carbon shards after ~7-10 s, shrinking out; one in eight stays for
5 minutes). The big parts - wing planes, endplates, rear wings, wheels - mostly stay for the rest of the session, but
not on the racing surface: one that has lain on the road for 14 s is dragged off to the verge by the marshals
(`Debris.sweep`).

A heavy barrier hit (more than 28 m/s straight into it: from a quarter of the time to most of the time as it gets
harder) or a rear-ender with more than 26 m/s closing speed (20-80 % of the time) wrecks the car (`Car.launch`).
Damage starts at about 7 km/h of impact speed into the bodywork, so taps leave no mark and it takes a big hit to
wreck a car outright. A launch is a 5-14 m/s kick at the wheel that climbed: up to about 2 m in the air, mostly a
roll or a flip, as real airborne accidents are; a car coming down on another one does not bounce off it. Nothing about the crash is scripted: the car becomes a 3D rigid body (centre, velocity,
quaternion, angular velocity, roll / yaw / pitch inertia 450 / 1150 / 1100 kg m²) carrying its own motion, plus
one impulse at the wheel that hit (it climbs the barrier or the other car's tyre). From then on gravity, drag and
contact impulses with friction at 17 body points (the four wheels, tub corners, sidepods, roll hoop, nose, engine
cover, rear wing) against the ground and the barriers decide the flight, the rolls, the bounces and where it stops:
on its wheels, its side or its roof. Concrete walls carry a 4.2 m debris fence, so a wreck never clears one.
Wheels and wings come off where the hits land (and stop being contact points); the bodywork crumples and darkens.
A stopped retired car stays where it is until the marshals recover it (25 s on the racing surface, 35 s beside it)
and the AI steers around it. Recovery does not delete it: the chassis is craned up and set down off the road (inside
the barrier on a permanent circuit's verge, over the wall on a street circuit) and stays there for the rest of the
race (`RaceDirector.marshals / parkWreck`); one already far off the road is left where it stopped. Every impact throws carbon shards and lost parts into
`world/Debris.js`: five pooled instanced meshes (shards, wing planes, endplates, rear wings, tyres), oldest piece
recycled, resting pieces no longer updated. The player's camera cuts to a chase shot of the wreck.

Spins are physical all the way round: every tyre works in its own frame against the contact patch's velocity in any
direction (forwards, sideways, backwards), and once a car has gone (more than ~35 degrees off its path) a driver on
the brakes locks the wheels, which then slide with the same friction every way (~62 % of peak), so the car keeps
rotating and sliding as one body until it is nearly straight again or slow. Sideways the floor and wings stall
(downforce ~ cos² of the yaw angle, almost none sideways or backwards) and the drag rises, so a spin from 250-280 km/h
is about a turn or more over 150-190 m. A car sliding sideways at more than ~60 km/h whose leading wheels run into
gravel, grass or over a kerb's edge can dig them in and trip: the leading edge stops at ground level and the rigid
body barrel-rolls over it (now and then at 70 km/h sideways into gravel, more often the faster it is).

Pit lane: every car drives it for real. The 80 km/h limiter works between two painted speed lines
(`pit.limitFrom / limitTo`); a track's `pitLimit: { before, after }` puts them that far before the first garage and
after the last, so the entry and exit roads are driven at speed (without it the whole lane is limited). The AI lines
up on the pit side over the last 250 m (the side the lane leaves on: `pit.sideSign`), brakes for the entry road like
a corner, and from the lane's first metre `AIDriver.pitDrive` drives it: the entry road at the speed its bends allow,
down to 80 km/h by the speed line, a gentle stop on its own painted box, out on the limiter to the exit line, then
the exit road at speed, following (and braking in time for) any car ahead in the lane. Same box rules and the same
lines as the player (`RaceDirector.pitUpdate`). Stationary: 2.0-2.6 s for tyres, about one stop in thirty a slow one
(+2.5-6 s), a front wing +6 s, a bigger repair +10 s, plus any time penalty.

In the lane and on its entry road the AI judges its heading by the lane, not the circuit (the entry road bends away
from the track: against the circuit a car driving it right would look spun). A car turned round in the lane (a tap
at the entry) stops and its crew push it round to face down the lane - cars are not reversed under their own power
in a pit lane. One that overshoots its box, or stops beside it but not in it, carries on down the lane and comes back
next lap. A car that retires in the lane is pushed into the nearest garage, out of everyone's way.

Calibrated against the real stops (`__pitLoss` in the harness): Silverstone ~20.5 s lost against staying out (real
~20 s), ~29 s between the speed lines, 2.2 s stationary; Las Vegas ~19.7 s lost with its whole short lane limited.

### Race control: yellow flags, VSC, safety car

`src/race/SafetyCar.js` (menu: Safety car On / Off). A retired car stopped on or beside the track brings out the
yellow flags first: for 5-9 s the race goes on everywhere except in the double-yellow zone (350 m before the incident to
60 m past it: slower, no overtaking), so the last seconds before the field is neutralised are still racing. Then a
car beside the road is a Virtual Safety Car (everyone at a delta speed, no overtaking, "VSC ENDING" 8 s before the
green), a car on the racing surface or more than one is the Safety Car. The delta comes in over 8 s (twenty cars
standing on the brakes at once is a pile-up).

The safety car is a real car on the road (its own `AIDriver` at ~70 % pace, 185 km/h on the straights, braking
gently; `SafetyCarMesh.js`: silver GT, flashing light bar). It leaves from the pit exit: race control holds it there
until the leader is about 9 s away, so it slots in just ahead (with the leader only just past the exit it goes at once
and chases it down). Until it has picked up the leader the field runs to the delta; only the leader queues behind it,
any other car that finds itself there is waved by. The field closes up at the delta speed and follows in a line (the
planner treats any running car ahead as one to follow, wherever it is on the road, and plans its braking at 60 % so a
queue does not concertinate into the slow corners); a car more than 250 m off the back of the queue runs a faster
catch-up pace. 20 s after the pickup: "LAPPED CARS MAY NOW OVERTAKE" - the lapped cars in the queue go by it and the
safety car and round to the back. A stop under the SC or VSC is cheap, and AI cars whose tyres are past their best
(and the gamblers) take it. Once the wreck is recovered, the lapped cars are through, the field is bunched and at
least 50 s have passed: "SAFETY CAR IN THIS LAP". The lights go out, the safety car peels into the pit
lane, the leader holds the pace and picks its moment to go in the last few hundred metres, and nobody may overtake
until they have crossed the control line. On the final lap the race finishes behind it.

The player gets the same rules: a delta on the scorebug banner (+ is slower than the reference, which is what it
must be; in the queue it does not count), a warning, then a 5 s penalty for running under it.

### Crash forces, and how a crash ends

Every hit is measured in g (`Car.pulse`): the velocity change it gives the car over how long the crash takes (`PULSE`:
a concrete wall ~45 ms, Armco ~70 ms, a tyre wall ~100 ms, two cars' crash structures ~60 ms, the ground in a roll
~50 ms, gravel ~90 ms; calibrated on Grosjean's Bahrain 2020 crash, ~50 m/s into Armco at 67 g). Measured with the
crash tests in the harness (`__crash.wall / tbone / rear / roll`):

| crash | g |
|---|---|
| rear-end, 30 / 50 / 80 km/h closing | 9 / 15 / 24 |
| T-bone, 80 / 120 / 160 / 220 km/h | 22 / 34 / 45 / 62 |
| concrete wall at 150 km/h: 15 deg / 45 deg / head-on | 22 / 35 / 65 |
| tyre wall at 200 km/h, 30 deg | 21 |
| sideways into a tyre wall at 100 / 140 / 180 km/h | 21 / 36 / 51 |
| head-on into a grandstand at 120 km/h | 58 |
| racing contact (wheel to wheel, nose to gearbox) | 8 - 12 |

What a pulse does follows from its g: from 15 g the suspension takes damage (a 55 g hit leaves nothing of it), from
25 g the engine; from 60 g (`SPLIT_G`) a car can be torn in two (15 % at 60 g, most of the time from ~85 g); a driver
is hurt 1 time in 20 below 20 g, 40 % of the time at 30 g, three times in four at 45 g, nine in ten from 50 g.
Nothing about the end of a crash is scripted: a car thrown into the air lands where the physics put it, and if it
only hopped (its body less than a metre above where it took off), never went over onto its side or roof, and comes to
rest on its wheels with all four still on and the suspension in one piece, it drives on, damaged; otherwise it is
out - launched, rolled, upside down, a wheel torn off, the suspension gone. A wheel comes off when a hard impact lands
right by it (more than 9 m/s, a third of the time) or on the first big blow near it. Barrel rolls need a real slide: from ~80 km/h sideways into gravel, and rarely; grass and kerbs much
less.

Buildings, landmarks and grandstands are solid (`src/world/Obstacles.js`): a car that reaches one hits it like a
concrete wall, on its wheels or in the air (nothing that reaches onto the road is kept as an obstacle). Barriers are
as tall as they are drawn - Armco 0.85 m, a tyre wall 1.3 m, a concrete wall with its debris fence 4.2 m - and in
front of the grandstands the tyre walls carry 4 m catch fences (`Track.markFences`, drawn as wire mesh on posts) that
keep a car out of the crowd and send it back toward the track. A car that clears a low barrier lands beyond it.

### Red flags

A car torn in two, or three or more cars stopped on the circuit in one accident, is a red flag (not on the final lap:
that finishes behind the safety car). The field drives round slowly for 14 s, then the race is suspended: every
wreck is recovered, the debris and fires are cleared, and the cars line up on the grid in race order with fresh tyres
and repairs (the player picks tyres in the pit menu) for a standing restart. Laps done so far stand; DRS comes back
two laps after the restart.

### Injuries and stand-ins

In any race, a driver whose car is wrecked or put out by an accident can be taken to the medical centre once it has
come to rest (`RaceDirector.injuries`). Most heavy shunts end with a walk to the medical centre and nothing more: by the
hardest hit, practically never below 25 g, about 3 % at 30 g, 13 % at 45 g, one in five at 51 g, two in three at 67 g
(a logistic centred on 62 g), and at least 60 % for a car torn in two. Whether they survive is decided then (`decideFate`), the same for every driver, you included, on a curve of
how bad the accident was (`crashSeverity`: the hardest pulse in g, plus 12 if the car was torn in two, 10 for fire,
6 for airborne or rolled, and 0.1 per km/h over 220 lost in that one hit). The chance of death is a steep logistic
centred on 97, for a driver hurt at all: a 29 g shunt about 0.1 %, a 51 g hit after a fast run-off (Silverstone 2021)
about 2 % (some 0.5 % of such crashes in all), a 67 g split car on fire (Bahrain 2020) about 3 in 10 (one in five such
crashes in all), 300 mph into a wall with nothing in between nearly always. Survived, the
driver is hurt and out for one, two or three rounds by the same severity, and the news gives a medical update in
those terms. Killed is permanent: in a career the driver is gone; in quick races and quick championships the seat goes
to a stand-in for good (`f1sim-deceased`, shown IN MEMORIAM on the setup screen with a way to restore the grid). Your own
driver can be hurt too: you miss the rounds - and drive them as your stand-in, in your car (STANDING IN on the HUD; in a
career the stand-in's result is the team's, and the sponsors' targets are yours to meet in it) - and the round you return the
build-up opens with THE COMEBACK - you with the pit-lane reporter by your car - and the media pen asks how you are,
what you remember and what you want from the day (`Interview` comeback questions). An AI driver's return gets the same
segment. The vigil the night a driver dies is laid on the circuit side of the barrier on the straight nearest the
accident, the grandstands empty. The news that follows and the
card after it are worded for what happened. Injured: concern, then relief - "conscious and talking", get-well posts,
the team principal thanking the medics, the broadcast ending on the messages from across the sport, and a GET WELL
SOON card. Killed: the coverage assumes the worst, the tribute of flowers and candles and the grid taking a knee, then
the In Memoriam card (it names none of the real drivers who have died - too sad) - "forever part of our family",
"every lap I drive from now on is for you", "never forget #81". Each card carries one true note on what crashes do to
the people in the cars: the forces (Grosjean's 67 g in Bahrain), concussion checks, the fear and flashbacks many
drivers describe and the sports psychologists they work with, the halo, the safety lessons the sport learned the hard
way. In a championship with a round still to come he misses it, and the card says who stands in. The stand-in is
the team's real reserve driver (Tsunoda for Red Bull, Vesti for Mercedes, Drugovich for Aston Martin...) or an F2
driver, and scores points under his own name; if it is your driver who is stood down, you drive the stand-in.

### Simulated weekends (career)

The career hub's THIS WEEKEND row: SKIP PRACTICE · QUALIFY (the circuit loads and qualifying starts at once), SIM
QUALIFYING · RACE (qualifying simulated in the hub, then the circuit loads straight to the race on that grid) and SIM
THE WEEKEND (qualifying and the race both simulated: nothing is loaded, the round's report comes up). The simulation
(`Career.simQuali`, `simRace`) runs on each car's development and each driver's rating, a little luck (more in the
wet), a spoiled lap now and then, the start and traffic from the grid, mechanical failures by the car's reliability
and accidents (more in the rain), an accident putting a driver out of the next round or two one time in ten. Pole laps
are scaled from the real ones (Las Vegas 2024 1:32.3, Silverstone 2024 1:25.8).

### Loading screen

Starting a weekend (`ui/Loader.js`) covers the menus with the Grand Prix's name, the round, the day's conditions and
your car; the latest news (the career's, or your recent quick races and those remembered); a checked fact about the
circuit or the sport, or a key to know; and a slow cross-fade of screenshots drifting in. The screenshots are your own
first (`ui/Gallery.js`, kept in the browser: pole and winner shots under the Sphere, the build-up's aerial, grid and
crowd, every photo you save in photo mode), then the game's own (`ui/LoadingShots.js`). The bar follows the build's
real stages (the map data, the route, the racing line, the track, the landmarks, the city, the grandstands, the
weekend).

### Championship career

The Championship card opens a career (`src/career/Career.js`, screens in `src/ui/CareerHub.js`, the interview in
`src/ui/Interview.js`), saved in the browser (localStorage; one career at a time, ABANDON CAREER erases it).

The screens are bright and open, over a real 3D showroom: the team's car (`CarMesh`, its livery and the driver's own
helmet) on a slowly turning turntable in a white studio, its ring light, the stripe on the curved wall and the team's
name written huge and faint on it all in the team's colour, under soft boxes and a key light throwing the car's
shadow (its own small WebGL view, `Showroom`). The camera moves to what each screen is about - the front wing for
aerodynamics, the rear wing for DRS, a front wheel for the brakes, the cockpit for your drivers - with the turntable
brought round to face it; In Memoriam dims the studio to grey. Over it, glass panels that fit the screen rather than
scroll: a navigation column, the panel, a card on the car. A new career is two steps (who you are - the car on the
turntable changes as you choose - then the season). The tech tree shows one branch at a time, with a detail card and
DEVELOP. The charts are line charts with points per round, end labels, hover values and a legend to pick lines out:
car pace (from development), race pace (each team's best race lap against the fastest that day), points, and
championship position. The market is filtered (F1, reserves, F2, juniors), sorted, and paged; an offer is a dialog of
buttons and a slider - no drop-downs anywhere. Team colours too light to see on white are drawn in grey.

* **Who you are.** You are a driver and the owner of your team: one of the 22 on the grid (you take over their team,
  their team-mate stays) or your own new team (your name, its name and colours, a backmarker's car and budget, the best
  junior on the market as your team-mate). You race as that driver for as long as they live.
* **The season.** 4, 6, 8 or 10 rounds, the calendar cycling through the circuits. RACE WEEKEND in the hub goes
  straight to the weekend: the weather (dry, damp or wet) and the time of day (Las Vegas mostly at night, Silverstone
  mostly by day) are drawn for each round and are not yours to choose. The career's race distance (set when it starts)
  and its difficulty are the only settings; the difficulty slider is on the hub's overview and can be changed at any
  time. Your own quick-race settings are put aside for the weekend and come back afterwards.
* **The tech tree - every team develops.** 35 parts in eight branches (power unit, aerodynamics, DRS, chassis, brakes,
  tyres, reliability, pit crew), each unlocking the next, some needing parts from two branches (the stalling rear wing
  needs the DRS flap and the ground-effect floor). Deeper parts cost more ($4M-18M) and take one or two rounds to reach
  the car. What they do is real physics: car pace (`perf`), a DRS that cuts more drag (`car.drsGain`), more ERS power
  (`ersMul`) and a bigger battery (`ersCap`), harder braking (`brakeMul`), less tyre wear (`wearMul` on the tyre set),
  fewer failures (`relMul`), faster stops (`pitMul`). The grid is tight - the slowest car is ~0.7 s a lap off the
  fastest at the start - so a few points' prize money and a better DRS can decide races. The AI teams buy what gives
  them the most pace for the money, keeping a reserve.
* **Money.** Each team's budget by its tier; prize money each round ($3M plus $0.9M a point: a backmarker's first
  points matter); salaries paid round by round; development paid up front.
* **Charts.** The CHARTS tab: every team's car pace over the season (the gap to the fastest car, seconds a lap, yours
  in bold) and the championship points of the leaders and you, round by round, with a table of every car now.
* **Paddock Rapport** - your standing with every driver (-100 to 100: bitter rival, hostile, cold, neutral, friendly,
  respected, close ally). Contact with your car costs it (the harder, the more; a crash that puts either of you out
  costs a lot more), so does a close fight in the championship. Drivers you have fallen out with race harder (their
  AI aggression goes up), ask more and, at the bottom, won't sign for you at all; releasing a driver hurts, signing one
  helps.
* **The post-race interview.** After every race, three questions from a reporter, picked for your day - the result
  first (a crash, a retirement, a win, a podium, points or none), then two from a pool (the contact you had with
  someone, your team-mate, "if you could replace your team-mate, who?", the best driver on the grid, your toughest
  rival, the young talent, who you trust, the dirtiest racer, the title fight, a new part, the owner's spending). Four
  answers each, eight words at most; what you say about a driver moves your rapport with them (praise helps, blame
  hurts, naming a replacement for your team-mate costs you with them), and a strong answer about someone can bring a
  follow-up question about them. When a driver was hurt or killed in the race you are asked about them - a death
  first of all, before your own result - and the answers run from support ("Rest in peace, brother. We race for
  you.", "That one's on me. I'm truly sorry.") to the cruel ("He took risks nobody else would. Predictable."), which
  the pen hears in silence and their team-mate and the whole grid remember. It happens in the media pen, in 3D
  (`MediaPen` in `src/ui/Interview.js`): your driver in the team's race suit and cap behind the barrier, the
  sponsors' step-and-repeat board behind, the journalists leaning in with microphones and a phone, the press officer,
  a TV camera and its light; the camera cuts like a crew's - over your shoulder onto the journalist asking, in close
  on you as you answer (your head moving with the words), wide between questions - under a bright lower third. You
  carry your own helmet; a photographer's flash goes off in the pack now and then.
* **Drivers and contracts.** The market is everyone: the F1 grid (with a buyout fee to their team for the years left
  on their contract), the teams' reserves, F2, and a few juniors. Each asks a salary by their rating (less if they like
  you); you offer a salary and 1-3 years, and they accept, counter with a higher ask, or refuse (and won't talk again
  that round). Prestige - your team's tier, its points and your rapport - helps. Signing someone into a full team
  releases the driver they replace.
* **Injuries and perma-death.** Every driver, yours included, is judged on the same curve (see Injuries and stand-ins):
  nearly always only hurt - out for one to three rounds, the team's reserve (or the best free driver) standing in, and
  you driving the stand-in if it is your driver. Rarely - more likely the harder the impact (`decideFate` in main.js) -
  a driver is killed: gone from the career, the team signing the best free driver for the seat. If it is your driver,
  there are no timing sheets and no telemetry: the screen goes to the helmet in black and white on a dark floor, lit
  only by a candle beside it (`ui/Mourning3D.js`), blood run down the shell and pooled on the floor beneath it, the
  name, the number, the career's starts (wins and podiums if any) - then back to the hub, where the weekend cannot be resumed and
  no round can be run until you choose who you are now: one of your team's drivers, or someone you sign first. The
  lost are listed in the hub's IN MEMORIAM.
* **The next season.** At the end, NEXT SEASON: the standings reset, budgets topped up, contracts that ran out end, the
  AI teams fill their seats from the market.

#### Every round has a point, every season an end

* **The forecast.** Race day (dry, damp or wet; day or night) is drawn when the calendar is made, so it's on the
  calendar cards from the start, and the race runs in exactly that weather.
* **This weekend.** A briefing on the overview shows the forecast and which tyres it means, where the car and your
  rating can expect you to finish (`Career.expectedPos`: the car's development and every driver's rating against
  the field), and the head-to-head with your team-mate.
* **Sponsor targets.** Every round, the sponsors set three targets against that expectation. The first is always a
  finishing position (P-expected or better, or the win). The other two come from: beat your team-mate, gain three
  places from the grid, a qualifying position (or pole), score points, or a clean race with no contact. Each one met
  pays out after the race ($1.5-4M). They're also listed in the qualifying briefing.
* **The round report.** Back in the hub after a race, a card shows your result and grid slot, each target met or
  missed, what the sponsors paid, your rating's change, and any trophies earned.
* **Drivers develop.** After every race each driver's rating moves with their form: their result against what their
  car and rating promised, up to ±0.4 a race. The young also learn race by race: the grid's newcomers of the last two
  seasons (Antonelli, Bortoleto, Hadjar, Bearman, Lawson, Colapinto, Lindblad) for 40 starts, and anyone from F2,
  the reserves or the juniors for 60. Over the winter the young step up by 1-3 points and everyone else drifts a little either way. AI
  ratings are their pace, so the field changes over the years. Yours is your market value.
* **Records.** Poles, fastest laps and career points are kept for every driver. The qualifying and race
  head-to-head with your team-mate is kept for the season.
* **The trophy room** (a new tab). Eighteen milestones, each stamped with the round and season it came in: first
  start, points, podium, win and pole; the fastest lap; a hat-trick; ten places gained in a race; a one-two;
  beating both cars of a top team in a backmarker; meeting every sponsor target; 10 and 25 starts; five wins; a
  complete tech-tree branch; beating the board's target; and the two championships. Below them are your career
  totals and every season's archive.
* **The season review.** At the end of a season the overview shows the drivers' and constructors' champions and
  where your team finished against the board's target for its tier (P2, P4, P6 or P9). The board's verdict
  (delighted, satisfied, concerned or unhappy) comes with a bonus, alongside prize money by constructors' position
  ($14M for the champions down to $2M). Contracts ending at your team are listed with a RENEW button. A contract
  signed after the season's end starts with the next one.
* **The off-season.** The AI teams go after better drivers: a team may replace its weakest driver with a clearly
  better free agent, or buy one out of a smaller team, which then fills its own seat from the market. Every move is
  in the news.

#### Contract talks, at the table

Negotiating with a driver (signing from the market, buying one out, or renewing a contract) happens in your team's
motorhome, in 3D (`ui/Negotiation.js`). The driver sits across the table from you with their agent, with coffee,
the contract and your team's colours on the wall. The camera cuts to whoever is speaking: the agent does most of
the talking, the driver nods or shakes their head, and a deal is signed on the table.

An offer is a whole contract: salary, length (1-3 seasons), status (number one, equal or number two), a sign-on
fee and a win bonus. Every driver weighs four things differently (`Career.negoProfile`): money, status, security
and the car (the one thing an offer can't change, though a sign-on fee softens it). Stars want number-one status,
the young want a car that can win, and the experienced want years. Each driver has a floor below which they won't
go. A star may have a rival team's offer in their pocket, and the agent will tell you about it. The sheet shows what
matters to them and their read of your offer as you move the sliders, from cold to keen. That read is a read, not a
number: it is a little off either way.

A poor offer costs patience and an insulting one costs it twice. When patience runs out they walk out and won't talk
to you again until after the next race. Each counter-offer names the term in the way, which is highlighted on the
sheet with a button to meet it. The sheet also shows what the deal costs: per year, up front (sign-on and any
buyout) and the budget it leaves you. The terms stick: win bonuses are paid out, and a number two who beats you
isn't happy about it.

#### The showroom, in 3D

The hub's screens are places in the studio, and the camera travels between them. The overview and the tech tree
show the car on its turntable, with close-ups of the part you're looking at. Your drivers stand in the team's
kit in their corner (the drivers tab, and after every race while the round's report is up). The championship's top
three stand on a podium (the standings, and the season's review). The trophy room is a cabinet of every trophy in
the career: gold once it's yours, a glass outline until then. In front of it, on a black plinth, stands every
driver lost in the career: their helmet greyed and bloodied, a candle, and a plaque with the name, number, team,
season and round (`Showroom.setLost`). It never leaves.

The menus move: a panel slides away and the next one's contents arrive one after another. The nav's highlight
glides from tab to tab, numbers that changed (budget, points) count to their new value in green or red, and bars
fill in. Cards lift under the pointer. Going into contract talks, the hub blurs away and the motorhome comes into
focus, then the reverse on the way back.

### Qualifying and the rest of a session

Qualifying is a real session (`RaceDirector.setup`): every car is out at once on its own flying laps, spread round the
lap a few seconds apart behind you, two timed laps each, the best counting - every time on the sheet is a lap a car
actually drove. Each run starts from a flying start on a straight (`flyingStart`: the nearest point before the line
with no corner and no braking for one within ~350 m), on warm tyres with a qualifying set's life, never in or just
before a corner. After each flying lap the car comes out fresh for the next run, as from the garage: repaired, on a new set of the same tyres, the battery charged (`RaceDirector.freshRun`). The race starts on fresh cars too. There are no safety cars or red flags in qualifying. (In the race, every pit stop fits a brand-new set, the same compound or not: the wear starts again from zero.) The timing tower ranks by best lap; lap times are
taken to the substep and the distance past the line, not the frame.

When your run is over - your laps done, the chequered flag, or out of the race - your car is handed to the AI and the
session goes on round you: watch it (Tab: the next car, Enter: ×6) or press F to simulate the rest
(`RaceDirector.simulateRest`, after one timed lap in qualifying F skips the second). F is not the physics run fast but
a race model run from where every car is: each car's pace from the laps it has done today (the field calibrated to the
conditions, the car and driver for anyone without one), lap by lap with its tyres wearing and a stop only when it pays,
traffic (stuck behind unless it has the pace or the DRS), mistakes, the odd retirement or safety car; the flag falls
on the leader and everyone finishes on their next crossing. It takes a moment. In qualifying a car that stops -
crashed, beached, stalled - is out of the session and recovered within seconds, never left sitting on the track. A race now ends when every car has finished or retired (at most
150 s after the winner), and the grid and the results are what the cars did - nothing falls back to a list of made-up
times.

### Menus, practice, a lap that stays

The title screen is three cards: Quick Race, Time Trial, Career. The circuit is chosen in the session's settings
(Las Vegas or Silverstone; the time of day follows the circuit's own default until you change it), and built when
you start. In a career, quitting goes back to the career hub, not the title screen: leave the hub to get there.

Before qualifying there is an optional free practice (`btn-practice`: a quali-mode session with `practice: true`, no
lap limit, 25 minutes), which you can end at any time from the pause menu (END PRACTICE) - straight on to qualifying
on fresh cars. In qualifying the pause menu offers END SESSION · SIMULATE THE REST: your best lap stands and the rest
of the session is simulated (`simulateRest`). In a career, QUIT TO CAREER · KEEP YOUR LAP does the same and saves the
grid (`Career.savedGrid`, cleared when the round is raced): come back to the round and it goes straight to the grid.

### Race strategy

Before every race (after qualifying, or straight from the grid choice) the strategy screen (`ui/Strategy.js`).
`planRace` times every no-stop, one-stop and two-stop plan lap by lap on the cars' own tyre model (each compound's
life for this race distance from `Tyres.js`, the grip lost as it wears, the cliff, a lap to warm a new set), with
this circuit's pit-lane time loss (the lane's length at the limiter against the same distance at race pace, plus the
stop). It applies the rule that a dry race of 12 laps or more uses two dry compounds, and offers three plans: A, the
quickest; B, the quickest with a different number of stops; C, the quickest on a different starting tyre. Each card
shows the stints as a bar in the compounds' colours, the box laps, the predicted race time against A, and a warning
if a stint runs to the edge of its tyre; the first stop's lap can be moved. The engineer gives their view, and the
screen shows what the rest of the field is starting on. The plan you confirm sets your starting tyre; in the race
the engineer warns you a lap before each stop and then calls it - box this lap, the next compound already chosen
(P stays out). Stopping early moves the plan on (`strategyCalls` in main.js).

### Race day: the build-up

Before every race a broadcast-style build-up (`src/ui/PreRace.js`, skippable with SKIP, Enter, Space or Esc): the
helicopter over the circuit, the fans (a block of the nearest grandstand's front rows rebuilt in full detail for the
show - team colours, caps, flags waved, cheering - with the sheet crowd there hidden, `Grandstands.hide`), the
grandstand, the grid with the mechanics at the front ten cars and yours (umbrellas over the cockpits by day), the
pit-lane reporter's walk down the grid, a guest touching a car, a short interview, and you on your grid slot. The
reporter and the guests are made up. By night, the people get a little fill light of their own colour (the TV
crews' lamps) instead of extra scene lights. Everything built for it is disposed afterwards.

The grid is as busy as a real one (`PreRace._gridCrowd`, `world/Crowd.js`): round every car its crew in the team's
kit, guests and VIPs in twos, threes and fours (lanyards, phones up to film), photographers on the front rows, TV
crews (a shoulder camera and a presenter) at pole, the front row and your car, and tyre blankets on every wheel with a
band of the team's colour - about 270 people. They are a couple of dozen body templates (pose, kit, hair, beard, cap,
prop) built by `People.js` at a lighter segment count (`segQ`) and baked to one geometry each, a part per vertex;
each template is one InstancedMesh with every person's own colours picked by part in the shader. A walkway is kept
clear down the middle of the grid, and round the spots the grid walk uses.

The crowd is alive (`world/CrowdLife.js`), in the build-up and in the grid walk: each person has something to do and
then something else. The crews stand round their cars (arms folded, hands on hips, hands on the car), wander round
them; guests talk in groups - one at a time making a point with a hand up while the others listen and nod (a head
nod in the shader) - film the cars on their phones, take selfies with a car behind them, then walk off down the
walkway to another car (a three-frame walk cycle); photographers work the front rows, their flashes going off. It is
flipbook animation on the instanced templates: a person in a pose is an instance of that pose's template for their
look, re-sorted every frame; templates are baked the first time they are needed, two a frame at most. In the grid
walk you push through people - they are eased aside and look round at you - and you slow as you squeeze through.
The walk's edges are the track's own walls where you are (the pit wall on the pit side), not a line from pole.
The sides of the grid out to the walls are filled all the way down, the far side's wide run-off included, and people
wander out there too. About 600 people: anyone more than 18 m from the camera is drawn as a simplified body built
from the same pose (`bakeFarTemplate`, ~420 triangles instead of ~2,100), and only your own car's mechanics are
full-detail models; the rest of the crews are part of the crowd.

The talk: 52 topics (GridWalk.js's own, and `GridTalk.js`, `GridTalk2.js`, `GridTalk3.js` - data: who it comes up
with, the openers, your answers in each tone, the reaction, the follow-up). Strategy (your actual plan), the weather,
this circuit's corners, form, fitness, rituals, contracts, sim racing, the fans, safety, the media, your team-mate,
upgrades, pit-stop practice, the start, racecraft, home, how it started, the venue, sponsors, setup, advice for
rookies, the season, causes, hobbies, the risk, the radio, pressure, an old grudge, the car's name, the engineer's
data, the team principal's politics, the mechanics' lives, after the race, autographs, Turn 1, the tyre blankets, and
the guests' and reporter's own questions. Every line is a pool with tokens filled in from where you are.

For the shots of the crowd (the fans, the grandstand, the banners) the grandstand nearest the grid - and the one
with the memorial banners, if another - is every seat a person in 3D (`Grandstands.seats`, about 900 for a 64 m
stand): team shirts and caps, flags, phones, arms up and jumping (`iMisc`: a per-instance bob in the shader), built
in 16 m chunks so what is off screen is culled. Its flat sheet fans are hidden only while those shots are on
(`PreRace._standHD`) and the 3D crowd hidden the rest of the time.

After a death in the race before - a career driver lost and not yet remembered, or one earlier in this sitting -
the build-up opens with the grid's memorial: the helmet on a black plinth thirty metres ahead of pole, a FOREVER
banner, bouquets and candles, the drivers and team members standing round it, the crowd quiet and the strings low.
Then the fans' banners in the front rows of the nearest grandstands (`Tribute.standBanners`: FOREVER #N, NEVER
FORGET, IN OUR HEARTS ...).

### The grid walk

WALK THE GRID (on the build-up) puts you on the grid on foot, as your driver, on the show's own grid
(`src/ui/GridWalk.js`): WASD or the arrows, Shift to hurry, the mouse to look (click for pointer lock, or drag),
E to talk, Enter (or E at your car) to get in; four minutes on the clock to the formation lap. Cars, people and the
track's edges are solid. Name tags float over the people you can talk to: the drivers by their cars (your teammate,
pole, those around you on the grid), your team principal, race engineer and No. 1 mechanic, the pit-lane reporter,
and the guests.

A conversation is two back-and-forths. They open on a topic chosen for who they are and the day - the driver lost
(if there is one), the race ahead, a rival next to you, team orders with your teammate, the title gap (a career),
someone else's gossip, the guests' questions, the press's - and you answer in a tone, tagged on each option: KIND,
FIRM, LIGHT, COLD, CRUEL. They react, follow it up depending on what you said, and you answer again - or turn it
to another driver BEHIND THEIR BACK. Then they move on (and turn their back on you if you went too far). The lines
are drawn from pools, so the same person rarely says the same thing twice.

What you say lasts, in a career: a driver's rapport (`Career.relate`) moves with how the talk went; gossip may get
back to the driver you talked about (how likely depends on who you told: a teammate, a reporter, a stirrer); what you
tell the reporter is printed in the news, and a jab at another driver there costs you with them. Callous words about
a driver who has died are the worst of it: the person you said it to is appalled, the rest of the paddock hears of
it, and an apology only takes back some of it. Nobody on the grid wishes harm on anyone - cruel stops at contempt.
Stopping at the memorial (E: pay your respects) is a long, quiet moment, and the grid notices.
Words have consequences in the race itself: a driver you have just insulted - or who has heard what you said behind
their back, or read it in the press - starts the race with a feud against you (`car.feud`, 0..1). For that race they
leave you far less room and sit on your gearbox (`Planner.traffic`: the clearance and the following gap round your
car shrink), always shut the door on you, and now and then, alongside, steer onto your line and lean on you
(`AIDriver`: the squeeze) - contact is far more likely. What lasts in the career is smaller than the anger on the
day (a cruel word costs about a third of what it did in rapport). The TV crews and photographers nearby turn to
follow you round the grid (`CrowdLife.follow`); what they catch is reported in the career's news ("TV: ...").
When a talk is over, Leave (or a click anywhere, E, Esc, Enter - not Space) ends it and locks the mouse for looking
again. The crowd's templates - every look in every pose, near and far - are built in the background during the
build-up (`CrowdLife._prebake`, one every other frame), so none is built on the spot in the walk.

### The news

The moment an accident has hurt a driver (a second and a half for the rest of it to play out), the screen fades to
black and the race is abandoned where it stands (classified as it stood: RACE ABANDONED). A TV news broadcast
(`src/ui/NewsBroadcast.js`) takes over the circuit as the race left it - a short viewer warning first, then the
breaking news - followed by the memorial card, and only then the results.
Nobody knows anything yet, and the coverage assumes the worst. The broadcaster ("F1 News"), the pundits and the papers
are made up; team principals are not named. SKIP, Enter or Esc ends it.

Sound: under every replay - the spectators' phone footage and the world feed's replays - the crowd, low under the
news (`assets/audio/crowd.mp3`, through a phone's small microphone in the phone footage). Each recording has its own
stretch of the track (two phones in two places, the feed's own microphones), and at each cut one fades away as the
next fades in. At the moment of the crash in each replay the crowd's gasp and then its groan (`gasp.mp3`,
`groan.mp3`) come in over it, and the cheering falls away. On the mourning screen, in the silence, a single swell of
strings (`horror.mp3`) as the helmet comes out of the dark. The recordings are played by `AudioEngine.play` on their
own bus; the single-file build embeds them as base64 (`tools/bundle.py`). Under the whole broadcast, low, dark
scraping atmospheres (`atmos1-3.mp3`) one after another in a random order. The long pieces are streamed through an
`<audio>` element (`AudioEngine.music`), not decoded whole; the Artifact build publishes the sounds as files beside the
page rather than inlining them.

The strings (`strings.mp3`, five minutes) play for everything after an incident: the drive back to the pits when a race
is cancelled (from the start of the piece), the memorial cards, the results and the post-race interview after a race in
which someone was hurt, and the career hub's IN MEMORIAM tab. Never under the news, nor on the mourning screen (its
silence is the point).

When a driver has died, the broadcast becomes a special report after the minute's silence: for each driver lost, the
FIA's confirmation on a black card, then a statement from the family - read on their behalf by the team, a line at
a time, ending with a request for privacy; then the driver's first karting coach (made up, never named) at the
circuit fence among the flowers, and the fans gathered at the gates with banners and candles.

The career's mourning screen (`showMourning`) does not let you click away: a candle burns under the helmet, a low
drone hums, and after a few seconds HOLD TO LEAVE appears. Hold it (mouse, finger, Space or Enter) for four and a
half seconds: the drone is filtered down to nothing, the flame gutters and goes out, a thread of smoke, black - and
back to the career. Let go early and it all comes back.

### A life lost: the race is cancelled

When a driver is killed (`decideFate`), the race does not just stop for a red flag: it is cancelled. RED FLAG · RACE
CANCELLED; the engineer's last words ("bring it back to the pit lane, slowly"), then no more radio; race control's
red-flag pace (138 km/h, no overtaking) and no restart (`RaceDirector.cancelRace`, `SafetyCar.cancel`); every car is
brought into the pit lane and left at its garage, queued as they arrive; laps stop counting, no flashback can undo it,
F cannot skip it. If it was you who was lost, there is no camera over the wreck: the view goes inside your helmet
(`povStart` / `povReplay` / `povFrame` in main.js). First the accident again, through your eyes, from the replay: a
whole car (a fresh one, as it was) at speed, then each hit as it came - the head thrown, the picture gone black for an
instant, the crunch, debris and sparks, the wing or the wheel torn away as the real car lost them - slowed through the
worst of it, until it comes to rest. Then twelve seconds in the wreck as it is - through the visor's eye-port, the head heavy and lolling in
the cockpit, consciousness coming and going in waves of black, the edges closing in, the visor fogging with each
slower breath and a slowing heartbeat under the strings, the fire spreading from the engine forward over the car and
its light growing in the visor - until there is only black. The mouse is locked to the view and turns the head a
little, slowly (a click locks it if the browser wants one). Otherwise you drive yours back to the strings; five seconds after you reach the pit lane (or, when you were
the one in the car, after a while at the scene) the screen fades and the news begins. The results read RACE
CANCELLED. A race stopped by an accident and not resumed - cancelled or abandoned - pays points the way F1 does for a shortened race: none if fewer than two laps were run, 6-4-3-2-1 up to a quarter of the distance, 13-10-8-6-5-4-3-2-1 up to half, 19-14-12-9-8-6-5-3-2-1 up to three-quarters, full points beyond; the results say which.

In the news replays too the damaged cars are shown as they were, not as they ended up (`_replayFx`): a whole car
going into the accident, and at every recorded hit debris and sparks from where it was, the parts the real car lost
torn away at its biggest hits, the fire taking hold if it burned; the wreck's own fire and debris as they are now are
held back until the live pictures. The broadcast camera for the replay is never inside a building or a stand, and
when nothing along the circuit has a clear view it goes up high over the track.

Helmets: every F1 driver wears their own design (`src/world/HelmetDesigns.js`, the 2026 helmets reduced to their
colours and the shape of their graphics - Norris's lime doodles, Hamilton's yellow, Alonso's blue over yellow,
Lawson's pink marbling, Bottas's blue swirls...) with their visor's tint, in the cockpit and on its own; F2 drivers,
reserves and juniors wear a plain helmet in one colour. The people in the cutscenes look like who they are: the 22
drivers with their own skin tone and hair (`DRIVER_LOOKS` in `src/world/People.js`) - your driver in the media pen,
a fellow driver interviewed on the news, the drivers kneeling on the grid; anyone else is varied but always the same
for the same name. Faces are sculpted, not stuck together: one surface for the skull, the jaw and the chin, the
cheekbones, the eye sockets under a brow ridge, the nose and the lips raised out of it; eyes with whites, irises and
lids; brows and the mouth drawn as curves; hair grown over the skull to a hairline; a cap with a curved peak; a face
of their own for each driver (the same every time). Each driver also has the shape of their own look: a hair style
(Norris's, Bearman's and Gasly's quiffs, Piastri's and Leclerc's swept hair, Russell's and Sainz's side parting,
Hadjar's curls, Hamilton's locs tied back, Bottas's mullet), facial hair (Hamilton's and Sainz's beards, Bottas's and
Hadjar's mustaches, stubble on Verstappen, Alonso, Hulkenberg, Stroll, Gasly and Perez), and a face longer or rounder,
wider or narrower, with a stronger or narrower jaw. Hair and beards are shells over the head whose thickness tapers
to nothing at the edge and then sinks under the skin, so a hairline or the edge of a beard is a smooth line rather
than steps; under a cap the hair is pressed flat. Race suits and polos have a collar and the team's name on the
chest. The career hub's driver cards carry a portrait of each driver, rendered from the same models.

After a race run to the flag: the podium (src/ui/Podium.js) - the top three on the steps in their kit and caps, the
winner in the middle with both arms up, the trophies, the Grand Prix's name behind, the crowd below and its roar, the
champagne sprayed from the winner's bottle across the other two, confetti coming down; a slow push-in, about ten
seconds (Enter or Esc skips it), then the results.

The cockpit has a steering wheel (`CarMesh`): the carbon plate and its grips, the display lit (dead once the car is),
the coloured buttons, the driver's gloves on it, turning with the steering - seen from the cockpit view and through
the visor.

* **Replays:** the director keeps the last 12 s of every car's pose, 20 times a second, with the hardest crash pulse it
  took in each frame (the physics' own g) and whether it had been torn in two (`src/race/Replay.js`). When a driver is
  hurt, the stretch from ~2.5 s before the hardest impact to the car at rest is cut from it, with every car that came
  within 70 m (for a car torn in two a few seconds later, so the halves' flight is in it). A car torn in two is shown
  whole until the moment it split - a fresh car stands in for it - then its front half and its rear half, flying where
  it flew (main.js keeps the rear half's flight).
* **Several drivers hurt:** each accident (hurt drivers caught up in the same one share it) gets its own phone
  footage, analysis and onboards, each hurt driver an onboard and their team principal an interview; the headlines,
  the posts, the prayers and the moment of silence are shared equally between them.
* **The words** are drawn from pools of templates each time - headlines with the g each driver took ("LECLERC IN
  CRITICAL CONDITION AFTER 57G CRASH"), the condition the reports assume from it, captions, posts, interview answers,
  pundits' theories - and the ticker carries the rest of the story once each: who else was caught up in it (out,
  damaged, or just past it), the other retirements, safety cars and red flags, the winner.
* **Breaking:** BREAKING NEWS over a live aerial shot of the wreck (each in turn), captions typed as they are spoken, a ticker.
* **Viewer footage:** the broadcaster's warning, then a spectator's phone footage of the crash, as vertical 9:16 video
  with the same picture enlarged, blurred and dimmed at the sides. The phone is always out in the open: in the front
  rows of the grandstand that saw most of the accident from closest (in front of its roof; only what is in front of a
  stand counts, and the buildings, landmarks and stands in between block the view), else on a spectator bank behind
  the barrier that nothing stands on. It chases the car with a lag,
  pinch-zooms in steps and shakes, worse at full zoom. Then the impact again, slowed, from a second phone somewhere
  else. Each phone has its own flaws (all still watchable): an old one (blocky, noisy, washed out), a new one (sharp but overexposed,
  highlights blown), one in poor light (grainy), one on full digital zoom (soft), or a good one that is only shaky.
  Most go to pieces half a second to a second after the impact as the stand erupts around them (the fans jump faster):
  the aim lost to the sky, the ground or the crowd, focus gone, compression bursting, a head in the row in front.
* **Analysis:** the world feed's own replay from a trackside tower with a clear view, tracking the car, slowed into
  the first hit and frozen on it with a telestrator ring, while two pundits speculate about the cause and the
  driver's condition.
* **Aerial:** the helicopter's replay, circling high above on a long lens.
* **Onboard:** the T-cam of the car that saw it best (the crashed car ahead of it and in its picture, the nearer the
  better), digitally zoomed in on the crash by the director; then the crashed car's own, rolling with it. Only a hard
  hit (a crash pulse of 15 g or more - nothing a corner or a kerb does) touches its feed: it freezes on the picture of
  the hit for a moment and stutters back; the very hardest (50 g+) lose the signal briefly.
* **Headlines:** papers and websites over the wreck on a long lens: critical condition, airlifted, "we fear the worst",
  no update from the FIA.
* **Interviews:** the media pen in front of the team's garage, a tight head-and-shoulders shot: the interviewee in
  the team jacket (a driver in the team cap), a cluster of broadcasters' microphones (made up) and a phone held up
  under the chin by arms reaching in from below, the press officer recording at the side, a rail, the team's dark
  wall with its lit strips behind. The team principal of each hurt driver, then a fellow driver (the team-mate, or
  someone from another team when more than one is hurt).
* **Prayers:** bouquets and candles laid in front of the team's garage, a handwritten card and a banner for each of
  them (NEVER FORGET, FOREVER #81, PRAY FOR...), the team standing by with heads bowed; the posts and the headlines
  already in mourning - with the messages from fans, the team and fellow drivers. Under it and the silence
  the music moves through slow minor chords.
* **A moment of silence:** on the grid, the drivers in their race suits on one knee in a line across the track, heads
  bowed, the teams standing behind them with NEVER FORGET and FOREVER banners, the marshals at the side, filmed three-quarters on in muted colour.
  The people (`src/world/People.js`) are built from capsules between the joints of a pose (kneeling, standing in
  mourning, talking), in race suits, team polos or marshals' overalls, with varied skin and hair.

### Failures, punctures, fire

`src/race/Failures.js` (menu: Mechanical failures On / Off). About 0.4 % per car per lap - more with a damaged or
overheating engine - something breaks: the engine (a white smoke plume, a third of the time a fire; the drive is
gone), the gearbox or the hydraulics (no drive), the brakes (a third of the braking left), the power unit (no ERS,
7 % less power for the rest of the race) or a tyre. A car with no drive pulls off the racing line to the side and
retires once stopped (`AIDriver.pullOver`); the player coasts and retires the same way. Punctures also come from a
tyre worn past the cliff (from ~88 % wear, almost surely by the end of it - whatever the menu says) and from a wheel
struck by another car. The tyre then comes apart with the distance driven on it (~25 s at racing pace, longer if it is
nursed slowly; `punctP`), in stages: flat - squashed at the bottom, the odd thin strip of tread thrown; delaminating -
the tread peeling off in strips that flail as the wheel turns, pale bands of carcass cord showing, the tyre sagging
lower and the first sparks as the rim starts to touch; coming off - a torn band of carcass and a few long strips on
the bare rim; shredded - the bare wheel, bright silver against the black tyres, grinding the road. Grip falls away
through the stages. Metal on asphalt or a kerb throws sparks (`Fire.grind`), the more of them, the further and the
higher the faster the car goes - a dense, white-hot spray at a bare rim and streaks falling behind, a glow where it
touches the road; none off grass or gravel. The AI nurses it to the pits; the player is told to box.

`src/world/Fire.js`: flames (additive) and smoke / extinguisher powder in two particle systems, two draw calls for
every fire on the circuit; a source follows a point on a car or on half of one. Big crashes can catch fire, a car torn
in two usually does; once a burning car has stopped the marshals arrive (8-16 s) and put it out.

The hardest hits tear a car in two behind the survival cell (a barrier at more than ~40 m/s straight on, a T-bone at
more than ~32 m/s): `CarMesh.split` cuts the car's meshes along that plane (every triangle crossing it clipped, so
the tear is a clean edge), and the rear half - engine cover, gearbox, rear wheels and wing - becomes a free rigid body
of its own (`src/world/Chunks.js`: box contacts, friction, barriers) that tumbles and slides to rest; the tub carries
on as the car's body, with contact points on its torn face.

### No ghost cars

A car that stops for good (a failure, a qualifying car stopped on track) stays solid until the marshals have moved it;
before, a stopped retired car stopped colliding the moment it came to rest, and sat on the racing line as a ghost for
up to half a minute. In qualifying, a car whose laps are done drives an in-lap into the pit lane (solid, like any car
on track) and is gone once it is in its box - instead of lapping on as a ghost.

### Stewards

`src/race/Stewards.js`, strictness from the menu slider (Off / Lenient / Standard / Strict / Harsh), for the AI and
the player alike. Time penalties are served at the next stop or added to the finishing time; the scorebug shows what
is still to serve.

* Causing a collision: who was at fault (a nose into a gearbox or sidepod, the car that moved across into one
  alongside; a car out of control is never to blame) and what it did a few seconds later (put out, spun, damaged, or
  simply how hard). Lenient: only putting someone out; Standard: spinning someone or real damage (a hard knock that
  did nothing much is let go); harsh: any real damage. Lap 1 gets more leeway. 5 s, 10 s for putting a car out.
* Track limits, only where time was saved: every trip off the road (all four wheels over the line, not forced off by
  a contact or a spin, not merging from the pit exit) is timed from where it left to 100 m after it came back,
  against what the car's own current pace says that stretch takes. A cut across the inside of a corner that gains a
  tenth or so is a strike; running wide on the outside only when it really gained (half a second at Standard); a cut
  worth 1.5 s is 5 s at once. Lenient allows 4 strikes, harsh 2 (the last is the black and white flag), then 5 s each.
* An overtake made off the track (passed while off, or within 100 m of coming back): "INCIDENT NOTED", race control
  takes 6-14 s to look at it (handing the place back before then is the end of it), then orders the place given
  back - 30 s to do it (an AI car lifts and lets the other by), else 5 s.
* Overtaking under yellow flags, the VSC, the safety car or before the line at the restart: 8 s to give the place
  back (an AI car lifts to let it by), else 5 s.
* A jump start: 5 s.

### DRS and ERS

Speed banding (`RaceDirector.speedBands`): a car behind the leader gets more power (up to +8 %) and less drag (up to
-5 %), on a curve that rises steeply over the first seconds (a third of it at 1.5 s back, half at 3 s) and is full
from ~7.5 s - so the leader is never left alone on a 10 s cushion - and fades out again as a car closes in (none
inside 0.6 s), so second place is pushed up to the leader's gearbox rather than towed past it.

DRS (`src/race/DRS.js`, the zones in `tracks.js`): Silverstone's Wellington Straight (detection at the Loop) and
Hangar Straight (detection at Maggotts), Las Vegas's Koval Lane (detection in the T1-T4 complex) and the Strip
(detection at T11). Within 1.0 s of any car ahead at the detection point (a backmarker counts) a car may open the
flap in the zone that follows - automatically, for everyone, once flat out on the straight (F / pad RB shuts it, or
opens it by hand). It closes on
the brakes or at the end of the zone. Enabled once the leader has done two laps, off under yellows / VSC / safety car
and back a lap after the restart. Open: 18 % less drag and a fifth less rear downforce (+10-15 km/h by the end of a
straight). The dash shows DRS grey (off), outlined (armed for the next zone) or green (open).

ERS is the player's to deploy: hold Shift or X (pad A) for +160 kW on the throttle; a full battery is 24 s of it.
It charges under braking (a full battery from ~13 s of braking) and a little when lifting and coasting (the AI
deploys on every straight from 160 km/h while it has charge, and anywhere in a fight); the dash
shows ERS ▲ deploying, ERS ▼ harvesting.

### Timing and the engineer

`src/race/Radio.js` takes every car's time at 20 loops round the lap, so gaps (radio, dash, scorebug) are real time
gaps. Five times a lap the engineer gives the briefing that matters most now: penalties around you on corrected time
("4.2 ahead with 5 seconds: stay within 5 and you beat him", or what your own penalty means), rulings and places to
be given back, the fight either side (gap, DRS, closing or not), the tyres, rivals' stops and strategies (an undercut
on you, a gambler waiting for a safety car), track-limit warnings, the car, and otherwise the gaps. A subject is not
repeated within a minute or two unless it is urgent. A rival within three places boxing is called at once, with
whether to respond.

The scorebug shows each car's tyre as a coloured letter (S red, M yellow, H white, I green, W blue), penalties to
serve beside the name, and the race-control banner (yellow flag / SC / VSC / green at the line) on top.

**Live sectors** (`race/Sectors.js`). The lap is split into thirds, the same split as the telemetry. Each sector is
timed as the car crosses into the next, interpolated back to the moment it crossed. Under the lap timer, three bars
show this lap's sectors as they come and the last lap's (faded) until then. Purple is the fastest anyone has done
it this session, green is your own best, yellow is neither. A sector driven through the pit lane is shown but never
counts as a best.

**Over the line** the engineer calls the result the way a pit wall would: a win, a podium, points, or a hard day. The
call mentions where you started on the grid, the fastest lap, your team-mate, and any penalty still to come off.
Then comes the cool-down lap, parking behind your board in parc fermé if you're on the podium. If someone was hurt
in the race the call is quiet: no celebrating, just that they're waiting for news. (`RaceDirector.postRaceRadio`;
the engineer can now hold a message back to follow another.)

**The results** add Driver of the Day and the race in numbers (`raceFacts`). The fans' vote rewards drives through
the field, on-track overtakes, a car punching above its weight, the win and the fastest lap, plus the luck of a
vote; the top five are shown as bars. The facts are the fastest lap (and on which lap), the biggest climber, the most
overtakes, the race's total overtakes and pit stops, the safety cars, VSCs and red flags, and who did not finish.
Overtakes are counted on track (`Passes`): a place held for 3 s and clear of the passed car, not one gained from a
car in the pit lane, retired, spinning or crawling.

**Live delta** to your best lap, under the sectors: the time you're up (green, −) or down (red, +) on your best flying
lap at the same point of the lap, with a bar that spans a second either way. The reference is your best lap from
the timing line, not the standing start or a lap through the pits, stored as its time every 5 m
(`Telemetry.liveDelta`).

**Blue flags** (`RaceDirector.blueFlags`). When a car a lap up is within ~150 m behind you, the marshal post ahead
waves blue, its light panel flashes blue, the screen says who to let through, and the engineer tells you once per
car. There are no blue flags under a safety car or a yellow, or in the pit lane.

**The chequered flag** is waved from a platform above the pit wall at the line, from the moment the winner crosses
it until the session is over. **At Las Vegas**, as at the real race, fireworks go up over the start/finish straight
for 26 s when the winner crosses the line (`world/Fireworks.js`): peonies, rings and gold willows bursting 60-140 m
up, fired from beyond the barriers, each heard when its sound reaches the camera. They use one particle draw call
from a fixed pool, so nothing is allocated per frame. There are no fireworks for a race stopped by an accident.

**Pit stop times**. Every stop's stationary time is recorded. "GO GO GO" shows it, and the engineer reads it out
(and thanks the crew for a quick one). The results' facts give the fastest pit stop: the team, the time, the driver
and the lap. A stop that served a penalty or changed a wing doesn't count.

**Pit crews** (`world/PitCrew.js`, `world/CrewRig.js`). A stop, choreographed to the stationary time the race gives it
(`RaceDirector.stopTime`; the director records `_stopAt`, `_stopDur`, `_stopPlan`, `_stopServe` on the car). Each crew
member is one skinned mesh on a 17-bone skeleton - every limb moves - in the team's suit and helmet; 21 to a crew:
a gunner, a tyre-off and a tyre-on at each wheel, the front and rear jacks, two holding the car steady at the
sidepods, two at the front wing, and the chief who releases it.
* When a car comes into the pit lane and its box can be seen, its crew runs out of the garage: the tyre-on men
  carrying the new set (the compound it will take), the gunners their guns, the jack men pushing their jacks.
* The front jack waits in the car's path and the car drives into its cradle under the nose; the rear jack waits at
  the side and steps in behind as it stops, its cradle under the rear crash structure and its handle running back
  low under the rear wing - never through it.
* Front jack up, rear jack up (the car is lifted and pitched on them), guns on the nuts (the sockets spin), the old
  wheels pulled straight off and away and stood beside the tyre-off men, the new ones pushed on, guns again, a hand
  up at each wheel, the jacks down, the front jack swung clear to the garage side, the chief's arm out: released.
  The car's own wheels come off and go on with them, and its tyres change compound when the new set is on. The guns'
  air lines hang from an overhead gantry over the box.
* A slow stop is a slow wheel (its gunner still on the nut while the others have their hands up). A penalty is
  served first, with nobody touching the car. A wing change: the wing men take the damaged wing off and carry it
  aside, fetch the spare from its stand beside the box, and fit it.
* Then everyone walks back into the garage, the old tyres carried in.
Three crews are built per session and sent where they can be seen.

**Flag marshals** (`world/Marshals.js`). Under a yellow, the marshal posts around the incident show it: a waved
yellow 190 m before it, a double-waved yellow just before it, and a green after it at the end of the zone. Under a
red flag, every post near the camera shows red, and for 10 s after the track goes green a green flag is shown where
the incident was. Each marshal stands on their post's platform behind the barrier, facing the cars coming, and the
post's FIA light panel on the barrier top flashes the same colour.

A tumbling or wrecked car keeps its body: `RaceDirector.wreckContacts` treats every car as two 1.05 m spheres in 3D
and applies the same restitution / friction impulse between a rigid body and a car on its wheels (or two rigid
bodies), at the contact point. A wreck that is hit comes alive again and is pushed or spun; a car collected by a
flying chassis is damaged and can be launched itself.

Nobody is reset onto the track. An AI car that spins or gets stuck gets itself going again (`AIDriver.rejoin`): a
three-point turn if it is facing the wrong way (reverse on opposite lock, then forward on full lock), a crawl across
the gravel or grass to the edge of the road (full throttle from a standstill to find traction), and a wait for a gap
in the traffic before it drives back on. A car that gets nowhere for 30 s off the road is beached and retires. The
player drives it back the same way (hold the brake at a standstill for reverse); beached for 12 s, hold R to retire.

Barriers stop cars only where they exist (on the pit side too: the pit wall's line is used only where a barrier
stands). A car that has gone over a barrier - a tumbling one clears an Armco or a tyre wall, never a concrete wall's
debris fence - lands and stays on the far side of it, held out rather than pulled back through. At the start the field launches together: each car starts in its grid lane and
the following law allows for the car ahead accelerating too, so nobody waits for a gap to open.

## The crash camera

A big accident of the player's car (thrown into the air, or a hit of 30 g or more) hands the game to a director
(`src/camera/CrashCam.js`) until the car has come to rest:

* time: the race drops to 0.15x for a second, then eases to 0.6x (each new big impact in the first seconds dips it
  to 0.25x again) and back to real time once the car is only sliding, at most ~6 s of slow motion; the camera, the
  screen effects and the sound run in real time;
* the shot: exterior and low, placed well ahead of the car's momentum and to one side so the wreck tumbles toward and
  past the lens, aimed at its centre of mass leaned toward where it is going, a Dutch tilt, the field of view squeezed
  from 80 to 50 degrees; a new cut when the car comes too close, goes past or gets too far; the line of sight is kept
  clear of buildings and stands and the camera inside the walls;
* aftertouch: the steering nudges the tumbling wreck sideways (~3 m/s at most); throttle and brake are off;
* sound: an explosive punch, the world through a heavy low-pass filter (muffled), a crunch of carbon and metal on
  every impact, a ticking counter;
* effects: sparks and glass-bright shards at every impact, pieces shed as it goes, smoke from where it is hurt (the
  engine, the nose);
* the screen: a shake along the impact, a radial blur that pulses with each hit and a saturation spike (one
  full-screen pass), the HUD hidden;
* the end: below 1 m/s and hardly rotating for 0.5 s (race time) the crash is resolved - a last chord, a white flash,
  CRASH and its peak g - and the car drives on with control back, or the camera circles the wreck (the session waits
  for it).

## Flashbacks and photo mode

Flashbacks (menu: Off / 3 a session / Unlimited; Backspace): the physics can't run backwards (friction, contacts and
the integration are not reversible), so `src/race/Flashback.js` records the whole race state - 4 snapshots a second,
the last 15 s in a ring - and writes one back to resume. A snapshot is a deep copy of a set of anchor objects (the
race director and its world, every car with its tyres and wheel state, every AI driver, the safety car and its
driver, stewards, race control, timing, DRS, failures), each restored in place so every reference between them stays
valid (fields gained since are removed); static data, the HUD, audio, telemetry and the AI's path plans are not part
of it (the plans are made again). Recording costs ~1 ms per snapshot, a restore ~7 ms, and a restore is exact. While
rewinding the race freezes and the picture fades; A / D or the arrows scrub (the cars eased between snapshots), Enter
resumes from there - the car models are rebuilt (a split car, lost wings), the smoke and debris of what no longer
happened cleared, the later recording dropped - and Esc goes back to now. A lap with a flashback is not a clean one.

Photo mode (pause menu): the simulation is frozen (or plays on with your car handed to an AI), the free camera can't
go into the ground, a building or a grandstand, and a panel sets the lens and the grade - field of view (15-110),
focus (your car, or a distance), depth of field (three.js BokehPass: render, bokeh from the depth buffer, output),
exposure (the tone mapping's), contrast, saturation and a vignette. SAVE PHOTO writes a PNG as framed and graded.

## Lap telemetry

`race/Telemetry.js` records every session: the player at 30 Hz (time, lap distance, position, distance from the
racing line, speed, throttle, brake, steering, gear, rpm, longitudinal / lateral g, surface, ERS, slip angles, tyre
temperature and wear, wheels on a kerb, body pitch / roll / heave, the four wheel loads) and every AI car at 10 Hz
(speed, pedals, line). Laps are cut at the timing line; a lap with a
reset or a pit visit is marked not clean. A flashback takes the recording back with the clock: what was recorded after
the moment it rewound to is dropped (a lap begun after it is not begun yet, a lap finished after it is open again), so
a lap is the one driven - not the abandoned attempt up to the rewind followed by the retry from where the clock caught
up again (older exports have both, and tools/ai_fit.mjs leaves those stretches out). The reference is the fastest clean AI lap of the session (a standing-start
lap never counts), else the ideal lap of the speed profile (Time Trial).

`ui/TelemetryView.js` (T in a session, TELEMETRY in the pause menu and on the results screen): lap picker, lap and
sector times against the reference, speed / delta / throttle-brake / steering charts on a shared distance axis with
a hover cursor, the circuit coloured by time gained or lost per 50 m, and a corner table (braking point before the
apex, minimum speed, time from 150 m before to 80 m after the apex). EXPORT JSON saves the whole session
(`f1sim-telemetry/2`: laps with every channel, the reference lap, the speed profile, the corner positions; about
350 kB a lap); inside the Artifact through its downloads capability, elsewhere as a normal download.

## Testing hooks

`window.__F1` exposes the world, session, `AI_TUNE`, `restart()` and `stepSim(seconds)` (headless
fast-forward of the active session). The race director records `impactLog` entries
`[t, car, wall|car, severity, s, km/h, d, other, ghost]` for balancing.
`await import('/tools/harness.js')` in the console adds `__soloRun(seconds, laps)` and `__gridRun(seconds, laps)`,
which fast-forward one AI car or the full grid and report laps, spins, offs and wall impacts, and `__race`
(`start(laps)`, `run(seconds)` in chunks, `report()`): a full race with spins (solo / after contact), cars airborne,
car-to-car contact and damaging hits, overtakes that held for 3 s, defensive moves, retirements and pit stops.
`restart()` skips the pre-race build-up unless `window.__keepPre = true`; then `__F1.PRE.show` is the show and,
after WALK THE GRID, `__F1.PRE.walk` the grid walk (`_open(npc)`, `_choose(i)`, `_advance()` drive a conversation).

## Known limitations

* Clean solo AI laps are about 1:34 at Las Vegas (real pole ≈ 1:32; the speed profile's ideal lap is 1:33) and
  1:33.6 at Silverstone (real pole ≈ 1:26): the AI keeps a grip margin that grows with corner speed, and its line
  stays clear of the white lines. In a full field the lap-1 scramble (Silverstone's Village and Loop above all)
  still produces bumps and the odd contact spin.
* The AI reads other AI cars by their plans, which makes AI-on-AI racing cleaner than real racing; the player is
  car is read only from its motion, with extra room left for it.
* The yaw / lateral motion is planar (the body's heave, pitch and roll only set the wheel loads); there is no
  elevation yet and no ride-height-sensitive aero.
* Which Silverstone corners get gravel or asphalt is a per-turn list, not surveyed geometry; trap depth is whatever
  fits before the nearest OSM building or grandstand. Barrier placement is inferred from OSM buildings, not surveyed.
* Crash bodies are boxes for ground contact; mangling is a fixed set of effects (parts off, crumple, scorch), not
  mesh deformation. Debris does not interact with cars.
* Silverstone's AI has only been tuned over a few headless runs; the pit lane, night mode and wet running there
  are untested.
* No shadow maps or post-processing bloom (emissive materials approximate the neon look).
