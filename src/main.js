// Bootstrap: renderer, world construction from GeoJSON, menus, race weekend flow, frame loop.
import * as THREE from 'three';
import { TRACKS } from './track/tracks.js';
import { loadGeoJSON, GeoWorld } from './core/GeoLoader.js';
import { buildSpline, sampleCurve, rotateSamples, Track, buildTrackMeshes, buildCatchFences, buildPitLane, gridLayout, corridorSigned } from './track/TrackBuilder.js';
import { RacingLine } from './track/RacingLine.js';
import { createEnvironment, applyTimeToMaterials, createRain } from './world/Environment.js';
import { Broadcast, POSES } from './world/Broadcast.js';
import { SphereShow, SPHERE_SEQUENCE, CANVAS_SHOWS, SHOW_SECONDS, SHOW_BG, SIDES, SHOW_ID } from './world/SphereShow.js';
import { Engineer } from './race/Engineer.js';
import { buildGenericBuildings } from './world/Buildings.js';
import { buildLandmarks, clearLandmarksFromTrack, mergeStaticParts } from './world/Landmarks.js';
import { buildPitBoxes } from './world/PitLane.js';
import { buildGrandstands } from './world/Grandstands.js';
import { StandCrowds } from './world/StandCrowds.js';
import { crowdTime } from './world/Crowd.js';
import { buildVenue, standFootprints } from './world/Venue.js';
import { buildMontreal } from './world/Montreal.js';
import { buildAustin, austinCrowdZones } from './world/Austin.js';
import { TERRAIN, setTerrain, trackHeights, buildHeightField, elevateWorld, terrainGround } from './world/Terrain.js';
import { WOC_PANEL } from './track/Branding.js';
import { TrackLights, floodlitAll } from './world/Lighting.js';
import { PitCrews } from './world/PitCrew.js';
import { Marshals } from './world/Marshals.js';
import { Fireworks } from './world/Fireworks.js';
import { PreRace } from './ui/PreRace.js';
import { Loader, paint } from './ui/Loader.js';
import { Gallery } from './ui/Gallery.js';
import { GridWalk } from './ui/GridWalk.js';
import { PitTiming } from './ui/PitTiming.js';
import { showStrategy } from './ui/Strategy.js';
import { Car, CAR } from './vehicle/Car.js';
import { CarMesh, setDebris, setFire, setChunks, prewarmParts } from './vehicle/CarMesh.js';
import { loadCarModel, carModel } from './vehicle/CarModel.js';
import { Fire } from './world/Fire.js';
import { Chunks } from './world/Chunks.js';
import { Obstacles } from './world/Obstacles.js';
import { FLASHBACK_SECONDS } from './race/Flashback.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CrashCam, CRASH_G } from './camera/CrashCam.js';
import { SafetyCarMesh } from './vehicle/SafetyCarMesh.js';
import { Debris } from './world/Debris.js';
import { Input } from './input/Input.js';
import { CockpitCamera } from './camera/CockpitCamera.js';
import { AudioEngine } from './audio/Audio.js';
import { ROSTER, customDriver, POINTS, standIn, dayPerf } from './race/Roster.js';
import { showMemorial } from './ui/Memorial.js';
import { NewsBroadcast } from './ui/NewsBroadcast.js';
import { openCareer, closeCareer, showMourning, syncLooks } from './ui/CareerHub.js';
import * as Avatar from './career/Avatar.js';
import { showInterview } from './ui/Interview.js';
import { showPodium } from './ui/Podium.js';
import { showHangout, HANGOUT_FOOTPRINT } from './ui/Hangout.js';
import { PARTY_FOOTPRINT } from './ui/PartyVenues.js';
import { Career } from './career/Career.js';
import * as Party from './career/Party.js';
import { upgradeName } from './career/TechTree.js';
import { formOf, moodOf, neutralForm, moraleLine } from './career/Morale.js';
import { activePoints, isBanned, banText, quickPoints, quickBanned, quickAddPoints, quickRaceDone, LICENCE_MAX } from './career/Licence.js';
import { prEvent, outletByName, outletName, OUTLET_BY_ID } from './career/PR.js';
import { friendFavours, VENUE_BY_ID } from './career/Social.js';
import * as Morale from './career/Morale.js';
import * as PR from './career/PR.js';
import * as Celebs from './career/Celebs.js';
import * as Licence from './career/Licence.js';
import * as Agenda from './career/Agenda.js';
import * as TechTree from './career/TechTree.js';
import * as Social from './career/Social.js';
import * as People from './world/People.js';
import * as BrawlMod from './ui/Brawl.js';
import { makeHelmet, bloodPool } from './world/People.js';
import { RaceDirector } from './race/RaceDirector.js';
import { AIDriver, AI_TUNE } from './ai/AIDriver.js';
import { AI_CAL, applyCalibration } from './ai/Calibration.js';
import { HUD, fmtTime } from './ui/HUD.js';
import { TelemetryView } from './ui/TelemetryView.js';
import * as Kit from './ui/Motion.js';
import { TRACK_MAPS } from './ui/TrackMaps.js';
import { BUILTIN_SHOTS } from './ui/LoadingShots.js';

const $ = (id) => document.getElementById(id);
/** teams in roster order (pit garage k belongs to TEAMS[k]; the custom 23rd car gets the last garage) */
const TEAMS = []; ROSTER.forEach((d, i) => { let t = TEAMS.find((x) => x.name === d.team); if (!t) { t = { name: d.team, color: d.color, color2: d.color2, drivers: [] }; TEAMS.push(t); } t.drivers.push({ ...d, index: i }); });
const teamIndexOf = (teamName) => { const k = TEAMS.findIndex((t) => t.name === teamName); return k < 0 ? TEAMS.length : k; };

// ---------------------------------------------------------------------------
// renderer / scene
// ---------------------------------------------------------------------------
const canvas = $('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(74, 16 / 9, 0.3, 6000);   // tighter depth range: less z-fighting on painted surfaces
/** how much the lens magnifies against the default 74 degrees (the cars' detail by distance scales with it: CarMesh.detail) */
const carZoom = () => Math.tan(37 * Math.PI / 180) / Math.tan(camera.fov * Math.PI / 360);
// The canvas is sized by CSS (fixed, 100% x 100%); the drawing buffer follows its CSS size. three.js must never
// write inline width/height on the canvas (updateStyle = false everywhere), otherwise a frame that lays out after
// load (an embedded artifact) keeps the initial size and stretches the picture.
const VIEW = { w: 0, h: 0 };
function fitViewport() {
  const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
  if (!w || !h) return false;   // not laid out yet (hidden tab / frame): a 0 x 0 drawing buffer would make every draw call fail
  if (w === VIEW.w && h === VIEW.h) return false;
  VIEW.w = w; VIEW.h = h;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  return true;
}
fitViewport();
window.addEventListener('resize', fitViewport);
const env = createEnvironment(scene, renderer);
const rain = createRain(scene);
const debris = new Debris(scene); setDebris(debris);
const fire = new Fire(scene); setFire(fire);              // fires, smoke, extinguishers: two draw calls
const chunks = new Chunks(scene); setChunks(chunks);      // the free halves of cars torn in two   // crash debris: pooled instanced pieces, five draw calls in all
// The Sphere's F1 stream (2x2 render-target atlas: two onboards, a trackside camera, the Sphere itself) and its
// canvas-drawn shows exist only while a circuit with the Sphere is loaded (created in loadWorld, freed in unloadWorld)
let feed = null, show = null;

const input = new Input();
const hud = new HUD();
const audio = new AudioEngine();
const camCtl = new CockpitCamera(camera);
const engineer = new Engineer(hud, audio);

/**
 * Save a text file for the viewer: inside a claude.ai Artifact through its downloads capability (the viewer
 * confirms), anywhere else (offline file, dev server) as an ordinary browser download.
 */
async function saveFile(name, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const asked = window.claude?.use?.('downloads');
  const dl = asked ? await asked.catch(() => null) : null;
  if (dl) {
    try { await dl.save({ filename: name, data: blob }); hud.msg('TELEMETRY SAVED', 'good', 2); }
    catch (e) { if (e?.code !== 'declined') hud.msg('COULD NOT SAVE THE FILE HERE', 'bad', 2.5); }
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
const telView = new TelemetryView(saveFile);
/** open the lap telemetry report of the running (or the last) session */
function openTelemetry(pauseWhileOpen) {
  const tel = S.director?.telemetry || S.lastTelemetry; if (!tel) return;
  const resume = pauseWhileOpen && !S.paused; if (resume) S.paused = true;
  telView.show(tel, { driver: S.player?.name || null, team: S.player?.team || null, onClose: () => { if (resume) S.paused = false; } });
}

// ---------------------------------------------------------------------------
// world construction (GeoJSON -> track -> landmarks -> buildings)
// ---------------------------------------------------------------------------
const W = { def: null, time: 'night', home: true };   // no circuit until one is picked on the home screen

async function loadWorld(def) {
  const t0 = performance.now();
  // (each stage: the line in the menu, the loading screen's bar - and a moment for the page to paint it)
  const set = async (m, pct) => { $('loading').querySelector('span').textContent = m; Loader.stage(m.replace(/…$/, ''), pct); await paint(); };
  await set('Loading the map data…', 4);
  const json = await loadGeoJSON(def.geojson);
  const geo = new GeoWorld(json, def);
  const before = new Set(scene.children);   // (what this circuit adds to the scene: raised onto its ground at the end, world/Terrain.js)
  await set('Routing the circuit through the road graph…', 12);
  const circuit = geo.buildCircuit();
  const curve = buildSpline(circuit.pts, { closed: true, filletSigma: def.smoothSigma || 6, step: 4, tension: 0.5, fillet: def.fillet !== false });
  const samples = rotateSamples(sampleCurve(curve, true, 2), 0, 0);   // s = 0 at the start/finish line (projection origin)
  const track = new Track(samples, def);
  labelCorners(track, def, geo);
  track.widen();   // (a road wider in places: def.widths - before anything is laid along its edges, the ground included)
  // the ground's height (a circuit that is not flat: its way's third coordinates - world/Terrain.js), else flat
  setTerrain(null);
  if (def.elevation) {
    const w = geo.roadById(def.ways[0]), pts = w ? w.pts.map((p, k) => [p[0], p[1], w.lonlat[k]?.[2]]) : null, h = trackHeights(track, pts);
    if (h) { track.h = h; setTerrain(buildHeightField(track, h), track); TERRAIN.halfRoad = track.maxHalfWidth + track.kerbWidth + 1; TERRAIN.halfRoadAt = (i, side = 1) => track.edgeAt(i, side) + track.kerbWidth + 1; }
  }
  track.openCorners();   // (corners left open: Montreal's Senna S and hairpin - before the barriers are capped against everything else)
  // permanent circuits: the escape aprons stop short of the venue's real grandstands
  if (def.osmStands || def.standNames) {
    const stands = standFootprints(geo, def).map((b) => b.rings[0]);
    track.capRunoff(stands, 5);
    track.extendToStands(stands, 90, 4);   // ... and run all the way out to them: gravel, then a tyre wall in front of the stand
  }
  // ... and its far-back barriers stop short of every building and of the other parts of the lap
  if (track.circuit) {
    const rings = geo.buildings.filter((b) => b.rings[0] && b.rings[0].length >= 3).map((b) => b.rings[0]);
    track.capRunoff(rings, 4); track.capSelf();
    track.layoutBarriers(rings);   // barriers only where something stands behind the verge
  }
  // Montreal's Wall of Champions: the outside of the last chicane's exit, the kerb, 1.7 m of green paint and the wall
  if (def.wallOfChampions) {
    const w = def.wallOfChampions, c = def.corners.find((k) => k.n === w.turn);
    if (c && c.s != null) track.pinWall(c.s + (w.from || 0), c.s + (w.from || 0) + w.len, w.side || -1, track.halfWidth + track.kerbWidth + 1.75, { panel: WOC_PANEL, name: 'Wall of Champions' });
  }
  track.layoutSurfaces();
  applyCalibration(track);   // the AI's corner-by-corner commitment on this circuit (ai/Calibration.js)
  env.setGround(def.ground || 'city');
  const pitWay = geo.roadById(def.pitLaneWayId);
  const pit = pitWay ? buildPitLane(track, pitLaneLeads(track, pitWay.pts, def.pitLeads)) : null;
  // a circuit's spectator areas round the lap (Austin's general admission): a barrier and a catch fence in front of each
  if (def.scenery === 'austin') {
    const rings = [...geo.buildings.filter((b) => b.rings[0] && b.rings[0].length >= 3).map((b) => b.rings[0]), ...((def.osmStands || def.standNames) ? standFootprints(geo, def).map((b) => b.rings[0]) : [])];
    track.guardZones(austinCrowdZones(track, def, pit), rings, pit);
  }
  track.fairWalls();   // (every circuit's barrier lines in long runs and gentle bends: no wedge of barrier jutting into a run-off)
  await set('Computing the racing line…', 26);
  const { line, profile, shown, showLine } = makeRacingLine(track, def);
  await set('Laying the track, kerbs and barriers…', 40);
  const trackMesh = buildTrackMeshes(track, pit, gridLayout(track, 23, 1));
  scene.add(trackMesh);
  await set('Building the landmarks…', 54);
  const lm = buildLandmarks(geo, track, def, pit);
  const moved = clearLandmarksFromTrack(lm.group, track, pit);
  const mergedParts = mergeStaticParts(lm.group);   // draw calls: static same-material parts baked together per landmark
  scene.add(lm.group);
  if (lm.sphere) {
    feed = new Broadcast(512, 2, 1); feed.init(renderer); show = new SphereShow();
    const u = lm.sphere.material.uniforms; u.uFeed.value = feed.texture; u.uHasFeed.value = 1; u.uShow.value = show.texture; u.uGrid.value = feed.grid;
    // content faces the nearest point of the circuit (the T5-T9 loop), and reads left-to-right from there
    const sp = lm.group.children.find((o) => o.name === 'lm:sphere').position; const q = track.nearest(sp.x, sp.z); const f = track.sample(q.s);
    const fx = f.x - sp.x, fz = f.z - sp.z, fl = Math.hypot(fx, fz) || 1;
    u.uFace.value.set(fx / fl, 0, fz / fl); u.uRight.value.set(fz / fl, 0, -fx / fl);   // right = (-face) x up
    W.faceAngle0 = Math.atan2(fz, fx);   // the content then turns slowly (one revolution per 5 min) so it faces every part of the circuit over a race
  }
  // venue pieces taken from the OSM footprints (a permanent circuit's pit building and real grandstands)
  const venue = (def.osmStands || def.pitBuilding) ? buildVenue(geo, track, def, pit) : null;
  if (venue) scene.add(venue.group);
  // a circuit's own scenery (Montreal: the islands' water and trees, the Biosphere, the casino, the stands, the paint on the grass)
  const scenery = def.scenery === 'montreal' ? buildMontreal(geo, track, def, pit) : def.scenery === 'austin' ? buildAustin(geo, track, def, pit) : null;
  if (scenery) scene.add(scenery.group);
  await set('Raising the city…', 68);
  const buildings = buildGenericBuildings(geo, track, new Set([...lm.claimed, ...(venue ? venue.claimed : []), ...(scenery ? scenery.claimed : [])]), pit);
  scene.add(buildings);
  // branded pit garages: one per team, the Independent entry gets the last one
  const pitBoxes = pit ? buildPitBoxes(pit, [...TEAMS, { name: 'Independent', color: '#00d4ff', color2: '#ffffff' }]) : null;
  if (pitBoxes) scene.add(pitBoxes.group);
  await set('Filling the grandstands…', 80);
  // grandstands only where nothing else stands: corridor + margin, masts, landmarks and every kept footprint are avoided
  const lmBoxes = lm.group.children.map((o) => new THREE.Box3().setFromObject(o)).filter((b) => !b.isEmpty());
  const stands = buildGrandstands(track, pit, { rings: buildings.userData.rings, boxes: lmBoxes, masts: trackMesh.userData.masts }, { auto: def.autoStands !== false, fixed: [...(venue ? venue.stands : []), ...(scenery ? scenery.stands : [])] });
  scene.add(stands.group);
  // the solid things beside the circuit (buildings, landmarks, grandstands: nothing drives or flies through them), and
  // catch fences on the barriers in front of the grandstands
  const obstacles = new Obstacles(), standRings = [];
  const clearOfTrack = (ring) => ring.every(([x, z]) => { const q = track.nearest(x, z); return Math.abs(q.d) > track.hw[q.i] + 3; });
  for (const r of buildings.userData.rings || []) if (r && r.length >= 3 && clearOfTrack(r)) obstacles.add(r, 12);
  for (const b of lmBoxes) { const r = [[b.min.x, b.min.z], [b.max.x, b.min.z], [b.max.x, b.max.z], [b.min.x, b.max.z]]; if (b.max.y > 2 && clearOfTrack(r)) obstacles.add(r, b.max.y); }
  for (const p of stands.stands) {
    const L = p.len, D = p.depth || 12, r = [p.world(-L / 2, 0), p.world(L / 2, 0), p.world(L / 2, D), p.world(-L / 2, D)];
    standRings.push(r); if (clearOfTrack(r)) obstacles.add(r, p.height || 14);
  }
  const dropped = obstacles.clearTrack(track);   // (nothing solid may reach onto the road: no invisible walls)
  track.markFences(standRings); const fences = buildCatchFences(track, pit); scene.add(fences);
  console.info(`[world] obstacles: ${obstacles.polys.length} (${dropped} dropped for reaching the road), catch fences: ${(track.fenceL.reduce((a, b) => a + b, 0) + track.fenceR.reduce((a, b) => a + b, 0)) * track.ds} m`);
  // real lights: SpotLights on the nearest floodlight masts + the Sphere's coloured glow
  const sphereObj = lm.group.children.find((o) => o.name === 'lm:sphere');
  const sphereInfo = sphereObj ? (() => { const b = new THREE.Box3().setFromObject(sphereObj); const c = new THREE.Vector3(); b.getCenter(c); return { center: c, radius: (b.max.y - b.min.y) / 2 }; })() : null;
  const lights = new TrackLights(scene, trackMesh.userData.masts, sphereInfo, 8);
  // onto the ground: everything this circuit added (world/Terrain.js), the flat plane lowered to the edge of the field
  // and a ground mesh of its own near the circuit
  if (TERRAIN.on) {
    const n = elevateWorld(scene.children.filter((o) => !before.has(o) && !o.isDirectionalLight && !o.isHemisphereLight && !o.isAmbientLight));
    W.terrainMesh = terrainGround(TERRAIN.field, env.ground.material); scene.add(W.terrainMesh); env.ground.position.y = TERRAIN.edge - 0.08;
    console.info(`[world] terrain: ${n} objects raised, ${TERRAIN.field.nx} x ${TERRAIN.field.nz} cells, heights ${Math.min(...track.h).toFixed(1)} .. ${Math.max(...track.h).toFixed(1)} m`);
  }
  floodlitAll(scene);   // (the still world: lit by the baked light field, not the scene's spot lights)
  Object.assign(W, { geo, track, pit, line, profile, lineSpeed: shown, showLine, trackMesh, landmarks: lm, buildings, circuit, pitBoxes, stands, lights, sphereInfo, venue, obstacles, fences, scenery });
  chunks.track = track; chunks.obstacles = obstacles;
  // big debris lying on the racing surface is dragged off by the marshals: to the verge (inside the barrier)
  debris.sweep = (x, z) => {
    const q = track.nearest(x, z); if (!(Math.abs(q.d) < track.hw[q.i] + 1)) return null;
    const side = Math.sign(q.d) || 1, wall = track.wallAt(q.i, side);
    const f = track.sample(q.s, side * Math.min(wall - 1.2, track.hw[q.i] + track.kerbWidth + 2 + Math.random() * 2));
    return [f.x, f.z];
  };
  console.info(`[world] grandstands: ${stands.count} (${stands.fans} fans), floodlight masts: ${trackMesh.userData.masts.length}`);
  const n = lm.report.filter((r) => r.status !== 'missing' && r.status !== 'error').length;
  console.info(`[world] circuit ${track.length.toFixed(0)} m, ${track.n} samples, ${track.cornerZones.length} corner zones, bridges: ${circuit.bridges.length}`, circuit.bridges);
  console.info(`[world] landmarks ${n}/25 (moved off the corridor: ${[...new Set(moved)].join(', ') || 'none'}; ${mergedParts.before} static parts merged into ${mergedParts.after} meshes)`, lm.report);
  console.info(`[world] generic buildings: ${buildings.userData.count} (${buildings.userData.dropped} dropped for overlapping the circuit), built in ${(performance.now() - t0).toFixed(0)} ms`);
  $('menu-sub').textContent = W.menuSub = `${(track.length / 1000).toFixed(3)} km · ${def.corners.length} turns · ${def.landmarkSet ? `${n}/25 landmarks` : `${stands.count} grandstands`} · ${buildings.userData.count} footprints`;
  return W;
}

/**
 * A pit lane mapped from the middle of the road (Montreal's leaves from the racing line at the last chicane's turn-in
 * and rejoins on it after the Senna S) gets a lead-in and a lead-out along the road's pit-side edge (def.pitLeads:
 * { side, d (m off the centreline), in, out (m of lead) }): the lane's own points still on the road are dropped and the
 * edge run joins them, so a car peels off from the edge of the road and comes back to it, as at the real circuit.
 */
function pitLaneLeads(track, pts, L) {
  if (!L) return pts;
  const q = {}, on = (p) => Math.abs(track.nearest(p[0], p[1], -1, q).d) < L.d + 1.2;
  let a = 0, b = pts.length - 1; while (a < b && on(pts[a])) a++; while (b > a && on(pts[b])) b--;
  const sA = track.nearest(pts[a][0], pts[a][1], -1, q).s, sB = track.nearest(pts[b][0], pts[b][1], -1, q).s;
  const edge = (s0, s1) => { const o = []; for (let s = s0; s <= s1; s += 6) { const f = track.sample(s, L.side * L.d); o.push([f.x, f.z]); } return o; };
  return [...edge(sA - (L.in || 100), sA - 12), ...pts.slice(a, b + 1), ...edge(sB + 12, sB + (L.out || 100))];
}

/**
 * The racing line and the speed profile on it: a driver's own line when the circuit's AI calibration carries one
 * (ai/Calibration.js `line`: from telemetry, tools/ai_fit.mjs), else the minimum-curvature line (def.line 'optimal')
 * or the out-in-out one. The profile is the car's cornering limit (fitted to the four-wheel model's steady state:
 * Chassis.fitGrip) with a margin that grows with speed (8 % in a hairpin, ~13 % in Copse: a fast corner is entered on
 * the limit of the tyres and the aero at once, and a car that runs a metre wide there has no road left to tighten its line).
 */
function makeRacingLine(track, def) {
  const fixed = track.aiCal?.line || null;
  const line = new RacingLine(track, { optimal: def.line === 'optimal', ...(def.lineMargin ? { maxOffset: track.halfWidth - def.lineMargin } : {}), fixed });
  const P = {mu: CAR.muBase * 0.92, mass: CAR.mass, dfCoef: CAR.dfm * CAR.mass * 0.9, dragCoef: 0.5 * CAR.rho * CAR.cdA,
    axle: { rearStatic: CAR.lf / CAR.wheelbase, transfer: CAR.cgH / CAR.wheelbase, rearBrake: 1 - CAR.brakeBias, dfRear: 0.5 * CAR.rho * CAR.clA * (1 - CAR.aeroFrontShare) }, vMax: 96, brakeG: CAR.brakeMax / CAR.mass / 9.81, accel: (v) => Math.min(CAR.powerKW * 1000 / (CAR.mass * Math.max(8, v)), 14) };
  const profile = line.speedProfile(P);
  // the racing line on screen: a driver's own lap where the circuit has one (ai/Calibration.js `show`, tools/ai_fit.mjs
  // from laps driven here) - where they were on the road, and red wherever you carry more speed into a braking zone or
  // a corner than they did: their speed holds wherever they were slowing or turning, braking curves (4 g) lead back
  // up from it, and nothing caps you where they were gaining speed (a better exit, a tow); else the AI's line, coloured
  // by the corner speeds and braking it is calibrated to (or the physics' profile)
  const sh = track.aiCal?.show;
  if (sh?.d?.length && sh.kmh?.length) {
    const n = track.n, ds = track.ds, showLine = new RacingLine(track, { fixed: sh }), m = sh.kmh.length, vd = new Float32Array(n), shown = new Float32Array(n).fill(96);
    for (let i = 0; i < n; i++) { const u = (i * ds) / sh.every, j = Math.floor(u) % m, f = u - Math.floor(u); vd[i] = (sh.kmh[j] + (sh.kmh[(j + 1) % m] - sh.kmh[j]) * f) / 3.6; }
    for (let c = 2 * n - 1; c >= 0; c--) { const i = c % n, j = (i + 1) % n, cap = vd[j] <= vd[i] + 0.05 ? vd[i] : 96; shown[i] = Math.min(cap, Math.sqrt(shown[j] * shown[j] + 2 * 40 * ds)); }
    return { line, profile, shown, showLine };
  }
  const shown = track.aiCal?.corners ? line.speedProfile({ ...P, vMul: track.aiV, bMul: track.aiB }) : profile;
  return { line, profile, shown, showLine: line };
}

/** Remove everything loadWorld built (switching circuits): scene objects, lights, the racing line, the title shots. */
function unloadWorld() {
  clearAmbient(); CINE.shots = null; CINE.i = -1; CINE.look = null; debris.clear(); ANCHORS.clear();
  if (W.terrainMesh) { scene.remove(W.terrainMesh); W.terrainMesh.traverse((x) => x.geometry?.dispose?.()); W.terrainMesh = null; }
  setTerrain(null); env.ground.position.y = -0.05;
  // every texture a material holds (maps, emissive maps, shader uniforms), every geometry, every material
  const freeMat = (m) => {
    for (const k in m) { const v = m[k]; if (v && v.isTexture) v.dispose(); }
    if (m.uniforms) for (const k in m.uniforms) { const v = m.uniforms[k].value; if (v && v.isTexture) v.dispose(); }
    m.dispose();
  };
  for (const o of [W.trackMesh, W.landmarks?.group, W.buildings, W.pitBoxes?.group, W.stands?.group, W.venue?.group, W.scenery?.group, W.fences, RL.group]) {
    if (!o) continue; scene.remove(o);
    o.traverse((x) => { x.geometry?.dispose?.(); const ms = Array.isArray(x.material) ? x.material : x.material ? [x.material] : []; for (const m of ms) freeMat(m); });
  }
  W.lights?.dispose(scene); W.standHD?.dispose(); W.standHD = null;
  feed?.dispose(); show?.texture.dispose(); feed = null; show = null;
  RL.group = null; RL.main = null; RL.pitGuide = null;
  for (const k of ['geo', 'track', 'pit', 'line', 'profile', 'lineSpeed', 'showLine', 'trackMesh', 'landmarks', 'buildings', 'circuit', 'pitBoxes', 'stands', 'lights', 'sphereInfo', 'venue', 'scenery', 'faceAngle0']) W[k] = null;
}
/** brand header + track chips follow the selected circuit */
function applyTrackUI() {
  const t = W.def.title || [W.def.name.toUpperCase(), '']; $('brand-title').firstChild.textContent = t[0]; $('brand-sub').textContent = t[1];
  if (W.track && W.menuSub) $('menu-sub').textContent = W.menuSub;
  document.title = `F1 ${W.def.name} Simulator`;
}
// Download button: only inside a claude.ai Artifact view that can hand the viewer a file. It saves the self-contained
// offline build published next to the page (offline.html); anywhere else the button stays hidden.
(async () => {
  const asked = window.claude?.use?.('downloads');
  const dl = asked ? await asked.catch(() => null) : null;
  if (!dl) return;
  if (!(await fetch('offline.html', { method: 'HEAD' }).then((r) => r.ok, () => false))) return;   // (no offline build published beside it)
  const btn = $('dl-offline'), msg = $('dl-msg'), label = btn.textContent;
  const say = (t) => { msg.textContent = t; msg.classList.toggle('hidden', !t); };
  btn.classList.remove('hidden');
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = 'Preparing the file…'; say('');
    try {
      const res = await fetch('offline.html'); if (!res.ok) throw { code: 'unavailable' };
      await dl.save({ filename: 'f1-simulator.html', data: await res.blob() });
      say('Saved. Open the file in a browser to play offline.');
    } catch (e) {
      say(e?.code === 'declined' ? '' : e?.code === 'rate_limited' ? 'A download prompt is already open.' : 'The download is not available in this view.');
    }
    btn.disabled = false; btn.textContent = label;
  });
})();

/**
 * Build a circuit (when a weekend on it starts: nothing is built at start-up, and the one built is kept - starting
 * another weekend on it is instant, another circuit replaces it). The menu stays where it is; a loading line shows.
 */
// the car model (vehicle/CarModel.js): loading from the start; every car is made after a circuit is built, which waits for it
const CAR_MODEL = loadCarModel().catch((e) => console.error('[car model]', e));
async function switchTrack(id) {
  if (W.loading || !TRACKS[id] || S.director) return;
  await CAR_MODEL;
  W.home = false; document.body.classList.remove('home');
  if (W.track && W.def.id === id) { applyTrackUI(); return; }
  W.loading = true; $('loading').classList.remove('hidden'); if (!Loader.on) $('fade').style.opacity = '1';
  unloadWorld(); W.def = TRACKS[id]; applyTrackUI();
  $('loading').querySelector('span').textContent = `Building ${W.def.name} from OpenStreetMap…`;
  await new Promise((r) => setTimeout(r, 30));   // let the loading line paint before the build blocks the thread
  try {
    await loadWorld(W.def);
    settings.time = W.def.defaultTime || 'night';
    for (const b of document.querySelectorAll('#opt-time button')) b.classList.toggle('sel', b.dataset.v === settings.time);
    setTimeOfDay(settings.time); applyWeather(weatherWetness(settings.weather));
  } catch (e) { console.error(e); $('loading').querySelector('span').textContent = `Failed to build world: ${e.message}`; Loader.fail(`The circuit could not be built: ${e.message}`, () => { $('menu').classList.remove('hidden'); }); W.loading = false; return; }
  W.loading = false; $('loading').classList.add('hidden'); $('fade').style.opacity = '0';
}

/** Attach official turn numbers to detected corner zones (used by AI error hotspots + telemetry). */
function labelCorners(track, def, geo) {
  for (const c of def.corners) {
    const [x, z] = geo.proj.toXZ(c.ll[0], c.ll[1]);
    const q = track.nearest(x, z);
    const zone = track.inCornerZone(q.i) || track.inCornerZone(track.idxAtS(q.s + 20)) || track.inCornerZone(track.idxAtS(q.s - 20));
    if (zone) { if (zone.turn == null) zone.turn = c.n; zone.turns = (zone.turns || []).concat(c.n); c.s = q.s; }
  }
}

/** Midnight / midday: environment, track surfaces, window shaders, emissives, Sphere luminance. */
function setTimeOfDay(mode) {
  W.time = mode;
  env.setTime(mode);
  W.trackMesh?.userData.setTime?.(mode);
  if (W.landmarks) { applyTimeToMaterials(W.landmarks.group, mode); for (const u of W.landmarks.timeUniforms) u.value = mode === 'day' ? 1 : 0; }
  if (W.buildings) applyTimeToMaterials(W.buildings, mode);
  if (W.pitBoxes) applyTimeToMaterials(W.pitBoxes.group, mode);
  if (W.stands) applyTimeToMaterials(W.stands.group, mode);
  if (W.scenery) { applyTimeToMaterials(W.scenery.group, mode); W.scenery.setTime?.(mode); }
  if (W.lights) W.lights.setDay(mode === 'day');
}

// ---------------------------------------------------------------------------
// menus: the home (the three modes with what each holds for you, your last race again) and the race settings - pages
// under tabs that show what each one holds, a summary column with START always in view, nothing that scrolls.
// settings is the one source of truth: every control shows it (syncSetupUI) and every change goes into it. The motion
// is ui/Motion.js's: only transform and opacity, nothing over 260 ms, none at all with reduced motion.
// ---------------------------------------------------------------------------
Kit.ensureMotion();
const settings = { track: 'lasvegas', mode: 'quick', driver: null, len: 5, grid: 'quali', slot: 1, tyre: 'SOFT', weather: 'dry', time: 'night', assist: 'full', aggr: 1.0, diff: 75, stewards: 50, sc: 'on', fail: 'on', fb: 'inf', intro: 'on', rounds: 3, custom: { name: 'E. Esselink', color: '#00d4ff', tier: 1 } };
/** AI pace slider (0-100) -> cornering commitment multiplier for every AI driver (0.94 .. 1.02; 75 = the tuned default) */
const skillOf = (diff) => 0.94 + 0.08 * (diff / 100);
const diffName = (d) => (d < 20 ? 'Rookie' : d < 40 ? 'Amateur' : d < 60 ? 'Semi-pro' : d < 80 ? 'Pro' : d < 95 ? 'Elite' : 'Legend');
/** stewards: 0 no penalties, then lenient (more track-limit strikes, only serious collisions) to harsh */
const stewName = (v) => (v === 0 ? 'Off' : v < 25 ? 'Lenient' : v < 60 ? 'Standard' : v < 85 ? 'Strict' : 'Harsh');
const TIER_TXT = ['Top tier', 'Upper midfield', 'Lower midfield', 'Backmarker'];
const htmlEsc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const menuCap = (s) => { const t = String(s || '').toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); };
/** 'Las Vegas Strip Circuit' -> 'Las Vegas' */
const shortTrack = (id) => String(TRACKS[id]?.name || id || '').replace(/ (Strip )?Circuit$/, '');
/** the name a tab has room for: the family name (Zhou Guanyu's comes first) */
const surname = (n) => { const w = String(n || '').trim().split(/\s+/); return w[0] === 'Zhou' ? 'Zhou' : w[w.length - 1]; };
/** a team's colour to highlight with: its livery's, or its second colour when the livery is too dark to show here */
const hlColour = (t) => { const c = parseInt(String(t.color).slice(1), 16) || 0, l = (0.2126 * (c >> 16) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255; return l < 0.16 ? t.color2 : t.color; };
/** the selected button's label of a segmented option */
const segText = (id) => $(id)?.querySelector(':scope > button.sel')?.textContent || '';

/** every segmented option: the settings key it sets and how its buttons' values read (wireSeg fills it) */
const SEGS = new Map();
/** the circuits' outlines as SVG markup, made once (outline()) */
const OUTLINES = {};
/** an option's buttons: a click sets settings[key] (parse(data-v)), the selection and its thumb follow, then onChange */
function wireSeg(id, key, parse = (v) => v, onChange = null) {
  const box = $(id); SEGS.set(id, { key, parse });
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.parentElement !== box) return;
    settings[key] = parse(b.dataset.v); markSeg(id); onChange?.(settings[key]); sumUpdate();
  });
}
/** an option's selection from settings: the .sel button and the sliding thumb (a tyre's in its compound's colour) */
function markSeg(id) {
  const box = $(id), sg = SEGS.get(id); if (!box || !sg) return;
  const B = [...box.children].filter((b) => b.tagName === 'BUTTON'), i = B.findIndex((b) => sg.parse(b.dataset.v) === settings[sg.key]);
  if (box.classList.contains('k-seg')) Kit.seg(box, i, 'sel'); else B.forEach((b, j) => b.classList.toggle('sel', j === i));
  if (box.hasAttribute('data-tyre') && i >= 0) box.style.setProperty('--tc', `var(--${B[i].dataset.v.toLowerCase()})`);
}
/** the distance buttons for a circuit: 25 %, 50 % and the full distance of its Grand Prix (Las Vegas 50 laps, Silverstone 52), the choice kept */
function lenFor(id) {
  const full = TRACKS[id]?.laps100 || 50, B = [...$('opt-len').children], k = B.findIndex((b) => +b.dataset.v === settings.len);
  // (3, 5 and 8 laps fixed; then 25 %, 50 % and the full distance)
  B[3].dataset.v = String(Math.round(full / 4)); B[4].dataset.v = String(Math.round(full / 2)); B[5].dataset.v = String(full);
  if (k >= 3) settings.len = +B[k].dataset.v;
  // (a distance from elsewhere - another circuit's 50 %: the nearest one here)
  else if (k < 0) settings.len = +B.reduce((a, b) => (Math.abs(+b.dataset.v - settings.len) < Math.abs(+a.dataset.v - settings.len) ? b : a)).dataset.v;
}
wireSeg('opt-len', 'len', Number);
// the circuit, in the race settings: its usual time of day comes with it (Las Vegas at night, Silverstone by day)
wireSeg('opt-track', 'track', String, (id) => {
  const was = settings.time; lenFor(id); markSeg('opt-len');
  settings.time = TRACKS[id]?.defaultTime || 'night'; markSeg('opt-time');
  if (settings.time !== was) timeNote(id);
});
wireSeg('opt-grid', 'grid', String, () => gridUI());
wireSeg('opt-tyre', 'tyre', String);
// (the scene behind the docked menu shows the light and the weather chosen; on the home there is no scene yet)
wireSeg('opt-weather', 'weather', String, (w) => { if (W.trackMesh) { setTimeOfDay(settings.time); applyWeather(weatherWetness(w)); } });
wireSeg('opt-time', 'time', String, (t) => { if (W.trackMesh) { setTimeOfDay(t); applyWeather(weatherWetness(settings.weather)); } });
wireSeg('opt-assist', 'assist', String);
wireSeg('opt-aggr', 'aggr', Number);
wireSeg('opt-sc', 'sc');
wireSeg('opt-fail', 'fail');
wireSeg('opt-fb', 'fb');
wireSeg('opt-intro', 'intro');   // (Straight to lights: no build-up before a race outside a career - the grid, then the five lights)
wireSeg('opt-line', 'line', String, (v) => { RL.on = v === 'on'; });

let noteTm = 0;
/** a circuit that brings its own time of day: the Time option slides there and a note under it says so for 2.5 s */
function timeNote(id) {
  const el = $('time-note'); el.textContent = `${shortTrack(id)} is raced ${TRACKS[id]?.defaultTime === 'day' ? 'by day' : 'at night'}: change it here if you like`;
  el.classList.add('on'); clearTimeout(noteTm); noteTm = setTimeout(() => el.classList.remove('on'), 2500);
}
/** the starting grid: the slot picker only for a chosen slot (never in a time trial), and a line on what happens */
function gridUI() {
  const pick = settings.grid === 'pick';
  $('grid-pick').classList.toggle('hidden', settings.mode === 'tt' || !pick);
  for (const b of $('opt-slot').children) b.classList.toggle('sel', +b.dataset.v === settings.slot);
  $('slot-val').textContent = `P${settings.slot}`;
  $('grid-desc').textContent = pick ? 'No practice or qualifying: you line up in the slot you pick, the rest in order of pace.' : 'Practice if you like, then qualifying with the whole field: two timed laps each, the best one counts.';
}
/** the two sliders (AI pace with its presets, the stewards) and their names, from settings */
function showSliders() {
  const d = $('opt-diff'), s = $('opt-stew');
  if (+d.value !== settings.diff) d.value = settings.diff;
  if (+s.value !== settings.stewards) s.value = settings.stewards;
  $('diff-val').textContent = settings.diff; $('diff-name').textContent = diffName(settings.diff);
  $('stew-val').textContent = settings.stewards; $('stew-name').textContent = stewName(settings.stewards);
  for (const b of $('diff-presets').children) b.classList.toggle('on', +b.dataset.diff === settings.diff);
}
{
  // starting position: a staggered grid of slot chips (pole at the front)
  const slots = $('opt-slot');
  for (let i = 1; i <= 23; i++) { const b = document.createElement('button'); b.dataset.v = i; b.textContent = `P${i}`; slots.appendChild(b); }
  slots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; settings.slot = +b.dataset.v; gridUI(); sumUpdate(); });
  $('opt-diff').addEventListener('input', (e) => { settings.diff = +e.target.value; showSliders(); sumUpdate(); });
  $('opt-stew').addEventListener('input', (e) => { settings.stewards = +e.target.value; showSliders(); sumUpdate(); });
  $('diff-presets').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; settings.diff = +b.dataset.diff; showSliders(); sumUpdate(); });
  // your own car, applied as you type
  $('opt-cname').addEventListener('input', (e) => { settings.custom.name = e.target.value; sumUpdate(); });
  $('opt-ccolor').addEventListener('input', (e) => { settings.custom.color = e.target.value; sumUpdate(); });
  $('opt-ctier').addEventListener('change', (e) => { settings.custom.tier = +e.target.value; sumUpdate(); });
  // the circuits as cards: the outline, the length, the turns, the Grand Prix distance, the usual time of day
  for (const b of $('opt-track').children) {
    const id = b.dataset.v, M = TRACK_MAPS[id], T = TRACKS[id]; b.querySelector('.map').innerHTML = outline(id);
    if (M && T) b.querySelector('small').textContent = `${M.km.toFixed(3)} km · ${M.turns} turns · a ${T.laps100}-lap Grand Prix · usually ${T.defaultTime === 'day' ? 'by day' : 'at night'}`;
  }
  // the home's cards: one of the game's own pictures behind each (none docked: the live scene is the backdrop)
  const shot = (track, caption) => (BUILTIN_SHOTS.find((s) => s.track === track && s.caption === caption) || BUILTIN_SHOTS[0])?.url;
  const IMG = { quick: shot('lasvegas', 'The Strip'), tt: shot('silverstone', 'Maggotts and Becketts'), champ: shot('lasvegas', 'The Sphere') };
  for (const c of $('step-mode').querySelectorAll('.card')) if (IMG[c.dataset.v]) c.querySelector('.ci').style.setProperty('--img', `url("${IMG[c.dataset.v]}")`);
}

// ---- the driver page: the team grid, the slot for the team's two drivers (or your own car), In Memoriam -------------
/** the setup's pages in order, and what is known about it this session (the open team, the memorial's page) */
const PAGE_IDS = ['driver', 'event', 'rivals', 'rules', 'driving'];
const PAGE_NAME = { driver: 'Driver', event: 'Event', rivals: 'Rivals', rules: 'Rules', driving: 'Driving' };
const SU = { i: 0, first: true, team: null, loaded: false, mem: 0 };
/** a team's two cars as they race now: a driver killed in a quick race gives way to the stand-in who has the seat (the one you would drive) */
function seats(t, L = deceased()) {
  return t.drivers.map((d) => { const x = L.find((y) => y.name === d.name); return x?.standIn ? { ...d, name: x.standIn.name, short: x.standIn.short || d.short, rating: x.standIn.rating ?? d.rating, number: x.standIn.number ?? d.number, standInFor: d.name } : d; });
}
/** who races for you with these settings -> { name, team, color, sub } or null */
function pickedDriver() {
  if (settings.driver === 'custom') return { name: settings.custom.name || 'You', team: 'Independent', color: settings.custom.color, sub: `Independent · ${TIER_TXT[settings.custom.tier] || ''}` };
  const r = typeof settings.driver === 'number' ? ROSTER[settings.driver] : null; if (!r) return null;
  const t = TEAMS.find((x) => x.name === r.team), d = (t && seats(t).find((x) => x.index === settings.driver)) || r;
  return { name: d.name, team: r.team, color: r.color, sub: `${r.team} · #${d.number}${d.standInFor ? ' · stand-in' : ''}` };
}
/** the team grid: eleven teams (their two cars as they race now) and your own entry */
function renderTeams() {
  const L = deceased(), tile = (v, name, sub, c, h) => `<button class="team${SU.team === v ? ' sel' : ''}" data-v="${htmlEsc(v)}" style="--c:${c};--h:${h}">${htmlEsc(name)}<small>${htmlEsc(sub)}</small></button>`;
  $('team-grid').innerHTML = TEAMS.map((t) => tile(t.name, t.name.replace(' Racing', ''), seats(t, L).map((d) => d.short).join(' · '), t.color, hlColour(t))).join('') + tile('custom', '★ Independent', 'your own 23rd car', '#00d4ff', '#00d4ff');
}
let slotTok = 0;
/** the slot under the grid: the open team's two drivers, your own car's entry, or a hint; anim: the old fades (90 ms), the new rises (160 ms) */
async function renderSlot(anim = false) {
  const pick = $('driver-pick'), custom = $('custom-row'), hint = $('su-pickhint'), tok = ++slotTok, moving = anim && !Kit.reduced();
  const t = TEAMS.find((x) => x.name === SU.team), show = SU.team === 'custom' ? custom : t ? pick : hint;
  const cur = [pick, custom, hint].find((el) => !el.classList.contains('hidden'));
  if (moving && cur) {
    const a = cur.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: 'linear', fill: 'forwards' });
    await Promise.race([a.finished.catch(() => {}), new Promise((res) => setTimeout(res, 120))]); if (tok !== slotTok) return;
  }
  if (t) {
    const hl = hlColour(t);
    pick.innerHTML = seats(t).map((d, k) => `<button class="driver${d.index === settings.driver ? ' sel' : ''}" data-v="${d.index}" style="--c:${k ? t.color2 : hl}"><span class="dn"><b>${htmlEsc(d.name)}</b><small>${d.standInFor ? 'Stand-in · ' : ''}rating ${Math.round(d.rating * 100)}</small><i class="rb"><u style="transform:scaleX(${(+d.rating || 0).toFixed(3)})"></u></i></span><span class="num">${htmlEsc(d.number)}</span><span class="ck">✓</span></button>`).join('');
  }
  for (const el of [pick, custom, hint]) { el.classList.toggle('hidden', el !== show); for (const a of el.getAnimations()) a.cancel(); }
  if (moving) show.animate([{ opacity: 0, transform: 'translate3d(0,6px,0)' }, { opacity: 1, transform: 'none' }], { duration: 160, easing: 'cubic-bezier(.2,.8,.2,1)' });
}
/** a nudge for a button that has just become the next thing to press (scale 1 -> 1.04 -> 1) */
function pulse(el) { if (el && !Kit.reduced() && el.getClientRects().length) el.animate([{ transform: 'none' }, { transform: 'scale(1.04)' }, { transform: 'none' }], { duration: 220, easing: 'ease-out' }); }
/** START pressed with no driver: the team grid flashes its outline twice */
function flashGrid() { const g = $('team-grid'); g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash'); }
/** every driver lost in quick races, ten to a page, in place of the driver page (the sombre fade, nothing slides) */
function showMem(on, pg = 0) {
  const box = $('su-mem'), body = document.querySelector('#su-pages .su-drv');
  if (!on) { if (!box.classList.contains('hidden')) { box.classList.add('hidden'); body.classList.remove('hidden'); } return; }
  const L = deceased().slice().reverse(), per = 10, n = Math.max(1, Math.ceil(L.length / per)); SU.mem = Math.max(0, Math.min(n - 1, pg));
  const at = (x) => String(x.at || 'killed racing').replace(/ (Strip )?Circuit$/, '');
  box.innerHTML = `<div class="mm-head"><button class="ghost small" data-mm="back">← Back</button><b>IN MEMORIAM</b><span>${L.length} ${L.length === 1 ? 'driver' : 'drivers'} lost in quick races</span></div>`
    + `<div class="mm-list">${L.slice(SU.mem * per, SU.mem * per + per).map((x) => `<div class="mm"><b>${htmlEsc(x.name)}</b><small>#${htmlEsc(x.number ?? '?')} · ${htmlEsc(x.team || '')} · ${htmlEsc(at(x))}</small><small>${htmlEsc(x.standIn?.name || 'A reserve')} drives the car now</small></div>`).join('')}</div>`
    + (n > 1 ? `<div class="k-pager">${Array.from({ length: n }, (_, k) => `<button data-mm="${k}" class="${k === SU.mem ? 'on' : ''}">${k + 1}</button>`).join('')}</div>` : '');
  body.classList.add('hidden'); box.classList.remove('hidden');
}
$('team-grid').addEventListener('click', (e) => {
  const b = e.target.closest('.team'); if (!b || b.dataset.v === SU.team) return;
  SU.team = b.dataset.v; for (const o of $('team-grid').children) o.classList.toggle('sel', o === b);
  // (a team only opens its two drivers: nobody is picked for you - the one you had stays only if this is their team)
  if (SU.team === 'custom') settings.driver = 'custom';
  else if (typeof settings.driver !== 'number' || ROSTER[settings.driver]?.team !== SU.team) settings.driver = null;
  renderSlot(true); updateStart(); sumUpdate();
});
$('driver-pick').addEventListener('click', (e) => {
  const b = e.target.closest('.driver'); if (!b) return;
  const was = settings.driver; settings.driver = +b.dataset.v;
  for (const o of $('driver-pick').children) o.classList.toggle('sel', o === b);
  updateStart(); sumUpdate(); if (was !== settings.driver) pulse($('su-next'));
});
document.querySelector('#su-pages [data-p="driver"]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mm]'); if (!b) return;
  const a = b.dataset.mm; if (a === 'open') showMem(true, 0); else if (a === 'back') showMem(false); else showMem(true, +a);
});
$('restore-grid').addEventListener('click', (e) => {
  // (two clicks, the first arms it for 4 s: the grid as it was, everyone back in their seat)
  if (!Kit.arm(e.currentTarget, 'Click again to restore', 4000)) return;
  try { localStorage.removeItem(DECEASED_KEY); } catch (err) { /* (a private window: nothing was kept) */ }
  refreshMemoriam(); sumUpdate();
});

// ---- the pages, the tabs and the summary -------------------------------------------------------------------------------
/** the pages this mode shows (a time trial: driver, event, driving) -> their ids */
const shownPages = () => PAGE_IDS.filter((p) => settings.mode !== 'tt' || (p !== 'rivals' && p !== 'rules'));
/** the tab underline under the page shown (after a resize, or a tab's width changing) */
function underlineTab() { const tabs = $('su-tabs'); Kit.underline(tabs.querySelector('.k-ind'), tabs.querySelectorAll(':scope > button')[SU.i]); }
/** go to a page (its id, or its place among the pages shown): it slides in, its tab lights, the underline glides */
function goPage(p) {
  const L = shownPages(), id = typeof p === 'number' ? L[p] : p; if (!L.includes(id)) return;
  SU.i = PAGE_IDS.indexOf(id); const tabs = $('su-tabs');
  Kit.page($('su-pages'), SU.i, { tabs, ind: tabs.querySelector('.k-ind') });
  const k = L.indexOf(id), nx = $('su-next');
  nx.classList.toggle('hidden', k >= L.length - 1); if (k < L.length - 1) nx.textContent = `NEXT · ${PAGE_NAME[L[k + 1]].toUpperCase()} →`;
}
/** the next or the previous page (d = +1 / -1), stopping at either end */
function stepPage(d) { const L = shownPages(), k = L.indexOf(PAGE_IDS[SU.i]); goPage(Math.max(0, Math.min(L.length - 1, k + d))); }
/** the tabs' live values and the summary column, from settings */
function sumUpdate() {
  const tt = settings.mode === 'tt', d = pickedDriver(), tn = shortTrack(settings.track), M = TRACK_MAPS[settings.track];
  const cond = `${settings.time === 'night' ? 'Night' : 'Day'} · ${menuCap(settings.weather)}`, laps = `${settings.len} laps`;
  const pct = segText('opt-len'), rules = `${settings.grid === 'pick' ? `From P${settings.slot}` : 'Flying lap'} · SC ${settings.sc}`;
  const V = {
    driver: d ? `${surname(d.name)} · ${d.team.replace(' Racing', '')}` : 'Choose a driver',
    event: [tn, tt ? null : laps, cond].filter(Boolean).join(' · '),
    rivals: `${diffName(settings.diff)} ${settings.diff} · ${segText('opt-aggr')}`,
    rules,
    driving: `${segText('opt-assist')} · ${menuCap(settings.tyre)}`,
  };
  for (const b of $('su-tabs').querySelectorAll(':scope > button')) b.querySelector('em').textContent = V[b.dataset.p] || '';
  $('su-name').textContent = d ? d.name : 'No driver yet'; $('su-team').textContent = d ? d.sub : 'Choose one on the first page';
  document.querySelector('#su-sum .sw').style.setProperty('--c', d ? d.color : 'rgba(255,255,255,.12)');
  const mp = $('su-map'); if (mp.dataset.t !== settings.track) { mp.dataset.t = settings.track; mp.innerHTML = outline(settings.track); }
  $('su-trk').textContent = TRACKS[settings.track]?.name || tn; $('su-trkm').textContent = M ? `${M.km.toFixed(3)} km · ${M.turns} turns` : '';
  const S2 = { len: /%|Full/.test(pct) ? `${laps} · ${pct === 'Full' ? 'full distance' : pct}` : laps, cond: `${cond} · ${menuCap(settings.tyre)} tyres`, rivals: V.rivals, rules: `${rules} · failures ${settings.fail}`, aids: `${segText('opt-assist')} · line ${settings.line || 'on'} · flashbacks ${segText('opt-fb').toLowerCase()}` };
  for (const b of document.querySelectorAll('#su-sum [data-sum]')) b.textContent = S2[b.dataset.sum] || '';
  if (!$('step-setup').classList.contains('hidden')) underlineTab();
}
/** every control from settings (the one source of truth): the options, the sliders, your own car, the grid, START, the summary */
function syncSetupUI() {
  settings.line = RL.on ? 'on' : 'off'; lenFor(settings.track);
  for (const id of SEGS.keys()) markSeg(id);
  showSliders(); gridUI();
  $('opt-cname').value = settings.custom.name; $('opt-ccolor').value = settings.custom.color; $('opt-ctier').value = String(settings.custom.tier);
  updateStart(); sumUpdate();
}
/** START reads "CHOOSE YOUR DRIVER" (and only shows you where) until a driver or your own entry is chosen; a sheen the moment it is ready */
function updateStart() {
  const ok = settings.driver != null, b = $('btn-start'), was = !b.classList.contains('disabled');
  b.classList.toggle('disabled', !ok); b.firstChild.textContent = ok ? (settings.mode === 'tt' ? 'START TIME TRIAL' : 'START WEEKEND') : 'CHOOSE YOUR DRIVER';
  if (ok && !was && !Kit.reduced()) { b.classList.remove('ready'); void b.offsetWidth; b.classList.add('ready'); setTimeout(() => b.classList.remove('ready'), 300); }
}
/** phones: the pages and the tab strip may scroll there (and only there) */
function phoneLayout() {
  const ph = innerWidth <= 640;
  for (const p of $('su-pages').children) p.toggleAttribute('data-scroll-ok', ph);
  $('su-tabs').toggleAttribute('data-scroll-ok', ph);
}
/** a circuit's outline (ui/TrackMaps.js: north up, the start/finish line marked) as a small SVG -> markup */
function outline(id) {
  const M = TRACK_MAPS[id]; if (!M) return '';
  if (!OUTLINES[id]) { const s = M.pts[0]; OUTLINES[id] = `<svg viewBox="-40 -40 ${M.w + 80} ${M.h + 80}" aria-hidden="true"><path d="M${M.pts.map((p) => p.join(' ')).join('L')}Z"/><circle cx="${s[0]}" cy="${s[1]}" r="30"/></svg>`; }
  return OUTLINES[id];
}

// ---- your last set-up (a convenience kept in this browser only) -----------------------------------------------------
const QUICK_KEY = 'f1sim-quick';
const QUICK_FIELDS = ['track', 'mode', 'driver', 'len', 'grid', 'slot', 'tyre', 'weather', 'time', 'assist', 'aggr', 'diff', 'stewards', 'sc', 'fail', 'fb'];
/** this quick race or time trial's set-up, kept for the home's RACE AGAIN and the next visit to the settings */
function saveQuick() {
  const o = { v: 1 }; for (const k of QUICK_FIELDS) o[k] = settings[k];
  o.line = settings.line || 'on'; o.custom = { ...settings.custom };
  try { localStorage.setItem(QUICK_KEY, JSON.stringify(o)); } catch (e) { /* (a private window: nothing kept) */ }
}
/** the kept set-up, checked against what the menus offer (anything unknown or broken is left out) -> settings, or null */
function savedQuick() {
  let s = null; try { s = JSON.parse(localStorage.getItem(QUICK_KEY) || 'null'); } catch (e) { return null; }
  if (!s || typeof s !== 'object') return null;
  const o = {};
  for (const [id, { key, parse }] of SEGS) if (key !== 'len' && key in s && [...$(id).children].some((b) => parse(b.dataset.v) === s[key])) o[key] = s[key];
  if (Number.isInteger(s.len) && s.len >= 1 && s.len <= 80) o.len = s.len;
  for (const k of ['diff', 'stewards']) if (Number.isFinite(s[k])) o[k] = Math.max(0, Math.min(100, Math.round(s[k])));
  if (Number.isInteger(s.slot) && s.slot >= 1 && s.slot <= 23) o.slot = s.slot;
  if (s.driver === 'custom' || (Number.isInteger(s.driver) && ROSTER[s.driver])) o.driver = s.driver;
  if (s.mode === 'quick' || s.mode === 'tt') o.mode = s.mode;
  const c = s.custom;
  if (c && typeof c === 'object') o.custom = { name: typeof c.name === 'string' ? c.name.slice(0, 18) : settings.custom.name, color: /^#[0-9a-f]{6}$/i.test(c.color || '') ? c.color : settings.custom.color, tier: [0, 1, 2, 3].includes(c.tier) ? c.tier : settings.custom.tier };
  return o.track ? o : null;
}
/** a kept set-up into settings (the mode stays the one chosen on the home) */
function applyQuick(s) {
  const { mode, custom, line, ...rest } = s;
  Object.assign(settings, rest); if (custom) settings.custom = { ...settings.custom, ...custom };
  if (line) RL.on = line === 'on';
}
/** 'Las Vegas · 5 laps · Verstappen' for a kept set-up ('' without a driver) */
function describeQuick(s) {
  if (!s || s.driver == null) return '';
  const r = typeof s.driver === 'number' ? ROSTER[s.driver] : null, t = r && TEAMS.find((x) => x.name === r.team), d = t && seats(t).find((x) => x.index === s.driver);
  const who = s.driver === 'custom' ? (s.custom?.name || 'your own car') : surname((d || r)?.name);
  return [shortTrack(s.track), s.mode === 'tt' ? 'time trial' : `${s.len} laps`, who].join(' · ');
}
/** the career's save at a glance (the hub reads it properly): 'Ferrari · Season 2026 · Round 3 of 6 · next: Silverstone', or null */
function careerPeek() {
  try {
    const c = JSON.parse(localStorage.getItem('f1sim-career-v2') || 'null'); if (!c || !c.myTeam) return null;
    if (c.round > c.rounds) return `${c.myTeam} · Season ${c.season} is over: the next one is waiting`;
    const next = Array.isArray(c.calendar) ? c.calendar[c.round - 1] : null;
    return `${c.myTeam} · Season ${c.season} · Round ${c.round} of ${c.rounds}${next && TRACKS[next] ? ` · next: ${shortTrack(next)}` : ''}`;
  } catch (e) { return null; }
}

// ---- moving between the home and the settings ---------------------------------------------------------------------
let swapping = false;
/**
 * One menu step to another: the old one slides a little and fades (140 ms), then the new one slides in from the other
 * side (220 ms). dir: +1 forward, -1 back. o.shown() runs as soon as the new step is laid out (before it moves);
 * o.enter() moves it in instead of the slide (the setup's first entrance). Reduced motion: an instant swap.
 */
async function swapStep(from, to, dir, o = {}) {
  if (swapping) return; swapping = true;
  try {
    const q = !Kit.reduced(), brand = document.querySelector('#menu > .brand');
    // (the brand leaves with the home and comes back with it: the settings have their own header)
    const outs = [from], ins = [to]; if (brand) (to === $('step-setup') ? outs : ins).push(brand);
    const A = q ? outs.map((el) => el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translate3d(${-24 * dir}px,0,0)` }], { duration: 140, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })) : [];
    // (a frozen timeline - the page hidden mid-swap - never holds the menu: a timer finishes it too)
    if (A.length) await Promise.race([Promise.all(A.map((a) => a.finished.catch(() => {}))), new Promise((res) => setTimeout(res, 180))]);
    from.classList.add('hidden'); to.classList.remove('hidden'); for (const a of A) a.cancel();
    o.shown?.();
    if (!q) return;
    if (o.enter) { o.enter(); ins.shift(); }
    for (const el of ins) el.animate([{ opacity: 0, transform: `translate3d(${24 * dir}px,0,0)` }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
  } finally { swapping = false; }
}
/** the setup's first entrance: the tabs, then the page's first six things, rise one after another (24 ms apart) */
function firstRise() {
  const rise = (L) => L.forEach((el, k) => el.animate([{ opacity: 0, transform: 'translate3d(0,10px,0)' }, { opacity: 1, transform: 'none' }], { duration: 220, delay: k * 24, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
  const pg = $('su-pages').children[SU.i], body = pg.querySelector('.su-drv:not(.hidden)') || pg;
  rise([...$('su-tabs').querySelectorAll(':scope > button:not(.hidden)')]);
  rise([...body.children].filter((el) => el.getClientRects().length).slice(0, 6));
  $('su-sum').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
}
/** a mode card -> its race settings: the pages for that mode, opening on the driver until one is chosen, else the event */
function openSetup(mode) {
  if (swapping) return;
  settings.mode = mode;
  // (the first visit this session: your last set-up, if there is one, so the same race is one click away)
  if (!SU.loaded) { SU.loaded = true; const s = settings.driver == null ? savedQuick() : null; if (s) applyQuick(s); }
  $('setup-title').textContent = mode === 'tt' ? 'TIME TRIAL' : 'QUICK RACE';
  for (const el of $('step-setup').querySelectorAll('.race-only')) el.classList.toggle('hidden', mode === 'tt');
  let n = 0; for (const b of $('su-tabs').querySelectorAll(':scope > button')) if (!b.classList.contains('hidden')) b.querySelector('i').textContent = ++n;
  $('su-hint').innerHTML = `<kbd>←</kbd> <kbd>→</kbd> pages · <kbd>1</kbd>-<kbd>${n}</kbd> · <kbd>Enter</kbd> start · <kbd>Esc</kbd> back`;
  SU.team = settings.driver === 'custom' ? 'custom' : typeof settings.driver === 'number' ? ROSTER[settings.driver]?.team ?? null : SU.team;
  showMem(false); refreshMemoriam(); syncSetupUI(); phoneLayout();
  const enter = SU.first ? () => { SU.first = false; firstRise(); } : null;
  swapStep($('step-mode'), $('step-setup'), 1, { shown: () => goPage(settings.driver == null ? 'driver' : 'event'), enter });
}
/** back from the settings: to the home (or, from a career's settings, to the career) */
function setupBack() {
  if (swapping) return;
  if (S.career) { $('step-setup').classList.add('hidden'); careerSetup(false); openCareerHub(); return; }
  swapStep($('step-setup'), $('step-mode'), -1);
}
/** the career: a light curtain over the change of scene, the hub under it (ui/CareerHub.js) */
function toCareer() {
  if (swapping) return; swapping = true;
  const k = Kit.curtain('#eef1f5');
  k.cover(160).then(() => { try { openCareerHub(); } finally { swapping = false; k.reveal(240); } });
}
/** the last race again, as it was set up: from the home straight to the loading screen */
function raceAgain() {
  const s = savedQuick(); if (!s || s.driver == null || swapping || W.loading || Loader.on) return;
  careerSetup(false); applyQuick(s); settings.mode = s.mode || 'quick'; SU.loaded = true;
  SU.team = settings.driver === 'custom' ? 'custom' : ROSTER[settings.driver]?.team ?? null;
  syncSetupUI(); startQuick();
}
/** the loading screen opaque (its fade-in played), so what lies under it can change unseen -> a Promise */
function loaderCovered() {
  const el = document.getElementById('loader'); if (!el) return Promise.resolve();
  const ms = Math.max(0, ...getComputedStyle(el).transitionDuration.split(',').map((x) => parseFloat(x) * (/ms/.test(x) ? 1 : 1000) || 0));
  return new Promise((res) => setTimeout(res, Math.min(700, ms + 40)));
}
/**
 * START: the loading screen comes up over the menu (nothing under it changes until it covers the screen), the circuit
 * is built if it is not the one standing (the time of day you chose kept), then the weekend begins.
 */
async function startQuick() {
  if (settings.driver == null) { if (!$('step-setup').classList.contains('hidden')) { showMem(false); goPage('driver'); flashGrid(); } return; }
  if (W.loading || Loader.on || swapping) return;
  // (a quick race is no career's: no career driver's look or helmet carried into it by name - E. Esselink is both menus' default)
  syncLooks(null);
  audio.init(); audio.resume(); saveQuick();
  Loader.show(loaderInfo(settings.track));   // (the loading screen: over the menus until the weekend is ready)
  await loaderCovered();
  const time = settings.time, from = $('step-setup').classList.contains('hidden') ? $('step-mode') : $('step-setup');
  if (!W.track || W.def?.id !== settings.track) {
    from.classList.add('hidden'); await switchTrack(settings.track);
    if (!W.track) { from.classList.remove('hidden'); return; }
    settings.time = time;
  }
  Loader.stage('Preparing the weekend', 90); await paint();
  startWeekend();
  Loader.hide();
}
/** the home's cards from what is kept: your last quick race or time trial, your career, the last race again */
function refreshHome() {
  const s = savedQuick(), C = careerPeek(), last = describeQuick(s), card = (v) => $('step-mode').querySelector(`.card[data-v="${v}"]`);
  card('quick').querySelector('.live').textContent = s?.mode === 'quick' && last ? `Last time: ${last}` : '';
  card('tt').querySelector('.live').textContent = s?.mode === 'tt' && last ? `Last time: ${last}` : '';
  card('champ').querySelector('b').textContent = C ? 'Continue Career' : 'New Career'; card('champ').querySelector('.live').textContent = C || '';
  const ra = $('race-again'); ra.classList.toggle('hidden', !last); ra.querySelector('span').textContent = last; $('keys-r').classList.toggle('hidden', !last);
  refreshMemoriam();
}
/** nothing else has the screen or the keys: no session, loading screen, career, evening out, phone or negotiation */
function menuFree() {
  const hub = document.getElementById('career');
  return !S.director && !Loader.on && !HANG.on && !(hub && hub.style.display !== 'none') && !document.getElementById('phone') && !document.getElementById('nego') && !document.getElementById('hangout');
}
$('step-mode').addEventListener('click', (e) => {
  const c = e.target.closest('.card'); if (!c || swapping) return;
  careerSetup(false);
  if (c.dataset.v === 'champ') { settings.mode = 'champ'; toCareer(); return; }   // (the championship is a career: ui/CareerHub.js)
  openSetup(c.dataset.v);
});
$('race-again').addEventListener('click', raceAgain);
$('btn-back').addEventListener('click', setupBack);
$('btn-start').addEventListener('click', startQuick);
$('su-next').addEventListener('click', () => stepPage(1));
$('su-tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) goPage(b.dataset.p); });
$('su-sum').addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) goPage(b.dataset.goto); });
Kit.keys($('step-mode'), {
  1: () => { $('step-mode').querySelectorAll('.card')[0].click(); }, 2: () => { $('step-mode').querySelectorAll('.card')[1].click(); }, 3: () => { $('step-mode').querySelectorAll('.card')[2].click(); },
  r: () => { if ($('race-again').classList.contains('hidden')) return 'pass'; raceAgain(); return undefined; },
}, { when: menuFree });
Kit.keys($('step-setup'), {
  ArrowLeft: () => { stepPage(-1); }, ArrowRight: () => { stepPage(1); },
  // (Enter on a button reached with the keyboard presses that button; anywhere else - a button last clicked too - it starts)
  Enter: (e) => { const t = e.target; if (t && t !== $('btn-start') && t.closest?.('button, a, [tabindex]') && t.matches?.(':focus-visible')) return 'pass'; startQuick(); return undefined; },
  Escape: () => { if (!$('su-mem').classList.contains('hidden')) showMem(false); else setupBack(); },
  1: () => { goPage(0); }, 2: () => { goPage(1); }, 3: () => { goPage(2); }, 4: () => { goPage(3); }, 5: () => { goPage(4); },
}, { when: menuFree });
{
  // a swipe across the pages turns them (touch and pen; the sliders and the slot chips keep their own drag)
  const v = $('su-pages').parentElement; let p0 = null;
  v.addEventListener('pointerdown', (e) => { p0 = e.pointerType === 'mouse' || e.target.closest('input, select, textarea, .gridpick') ? null : [e.clientX, e.clientY]; });
  v.addEventListener('pointerup', (e) => { if (!p0) return; const dx = e.clientX - p0[0], dy = e.clientY - p0[1]; p0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) stepPage(dx < 0 ? 1 : -1); });
  v.addEventListener('pointercancel', () => { p0 = null; });
  window.addEventListener('resize', () => { phoneLayout(); if (!$('step-setup').classList.contains('hidden')) underlineTab(); });
  // the home refreshes whenever it comes back into view (after a race, from the career, from the settings)
  let q = 0; const look = () => { if (q) return; q = setTimeout(() => { q = 0; if (!$('menu').classList.contains('hidden') && !$('step-mode').classList.contains('hidden')) refreshHome(); }, 0); };
  const mo = new MutationObserver(look); for (const id of ['menu', 'step-mode']) mo.observe($(id), { attributes: true, attributeFilter: ['class'] });
}
updateStart();
// (once the module has run: the racing line's state and the In Memoriam list are read then)
setTimeout(() => { syncSetupUI(); refreshHome(); }, 0);
// ---------------------------------------------------------------------------
// the championship career (career/Career.js, ui/CareerHub.js): the hub between rounds; a round's weekend straight
// from it, on the calendar's next circuit, in whatever weather and light the day brings - the career's difficulty and
// race distance are the only settings (the hub's), the rest is not yours to choose
// ---------------------------------------------------------------------------
function openCareerHub() {
  restoreSettings();
  $('menu').classList.remove('hidden');
  openCareer({ roster: ROSTER, tracks: Object.keys(TRACKS), currentTrack: W.def?.id, helmet: helmetURL, onRace: careerRace, onHangout: careerHangout, audio, music: (on) => strings(on, { gain: 0.45 }), onClose: () => { S.career = null; syncLooks(null); careerSetup(false); $('step-setup').classList.add('hidden'); $('step-mode').classList.remove('hidden'); $('menu').classList.remove('hidden'); } });
}
function careerSetup(on) {
  for (const id of ['team-grid', 'driver-pick', 'custom-row']) { const el = $(id); if (el) el.style.display = on ? 'none' : ''; }
  if (!on) S.career = null;
}
/** a career round from the hub. sim: 'quali' - straight into qualifying (no practice); 'race' - qualifying was
 *  simulated in the hub (Career.simQuali), straight to the race on that grid */
async function careerRace(career, sim = null) {
  S.career = career;
  // (your own look, from the save: every figure of you this weekend - the grid, the podium, the interviews, the news,
  // the cockpit's helmet - is drawn from it by your name)
  syncLooks(career);
  // (race day: arriving exhausted costs focus at this race - career/Agenda.js checks it once a round, so a weekend
  //  started again, or simulated after all, is never charged twice)
  if (typeof Agenda.raceDayCheck === 'function') { try { Agenda.raceDayCheck(career); } catch (e) { console.warn('[career] race-day check', e); } }
  const id = career.calendar[career.round - 1];
  Loader.show(loaderInfo(id, career));
  if (!W.def || W.def.id !== id || !W.track) await switchTrack(id);
  if (!W.track) return;
  Loader.stage('Preparing the weekend', 90); await paint();
  S.career = career;
  // (the player's own settings put aside for the weekend, back when it is over)
  if (!S.savedSettings) S.savedSettings = { ...settings, custom: { ...settings.custom } };
  const fc = career.forecastAt();   // (race day as the forecast said, drawn with the calendar)
  Object.assign(settings, { mode: 'champ', len: career.laps, diff: career.diff, grid: 'quali', weather: fc.weather, time: fc.time });
  settings.tyre = settings.weather === 'wet' ? 'WET' : settings.weather === 'damp' ? 'INTER' : 'SOFT';
  if (settings.driver == null) settings.driver = 0;   // (the career's driver races: nothing to choose here)
  audio.init(); audio.resume(); startWeekend();
  // (the hub's shortcuts: past the qualifying choice at once)
  const panel = $('quali-panel');
  if (sim && !panel.classList.contains('hidden')) {
    if (sim === 'race' && !$('btn-quali-done').classList.contains('hidden')) $('btn-quali-done').click();
    else if (sim === 'quali' && !$('btn-quali-go').classList.contains('hidden')) $('btn-quali-go').click();
  }
  Loader.hide();
}
/** what the loading screen says: the round, the day, your car, the latest (the career's news; else your recent races) */
function loaderInfo(trackId, C = null) {
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  if (C) {
    const fc = C.forecastAt(), me = C.entries().find((e) => e.isPlayer), lead = C.driverStandings()[0];
    const news = C.news.slice(0, 4).map((n) => ({ tag: `Round ${n.round}`, text: n.text, color: C.team?.color }));
    // (the papers' latest about you - the last race and the week since, two headlines - not in the days after someone
    //  was hurt or lost)
    const grave = !!C.pr?.ctx?.grave || (C.lost || []).some((l) => l.season === C.season && l.round >= C.round - 1);
    const fresh = (h) => h?.text && (h.season == null || (h.season === C.season && h.round >= C.round - 1));
    if (!grave) for (const h of (C.pr?.feed || []).filter(fresh).slice(0, 2).reverse()) news.unshift({ tag: outletName(h.outlet), text: h.text, color: OUTLET_BY_ID[h.outlet]?.color });
    if (lead && lead.points > 0) news.unshift({ tag: 'Championship', text: `${lead.name} leads on ${lead.points} points${C.me && C.me !== lead ? `. You are P${C.driverStandings().indexOf(C.me) + 1} on ${C.me.points}.` : '.'}`, color: C.teams[lead.team]?.color });
    // (first of all: a ban this round or to come, a licence close to one, a story still waiting for your answer)
    const pts = C.me ? activePoints(C, C.me) : 0, ban = C.me ? banText(C, C.me) : null, K = C.pr?.crisis;
    if (K?.title && !grave) news.unshift({ tag: K.positive ? 'The press' : 'Press · waiting for you', text: K.positive ? K.title : `${K.title}: the press is still waiting for your answer.`, color: K.positive ? '#2fbf71' : '#e4003a' });
    if (ban) news.unshift({ tag: 'Licence', text: me?.outWhy === 'ban' || (C.me && isBanned(C, C.me)) ? `${C.me.name} sits this round out: ${LICENCE_MAX} penalty points mean a one-race ban.${me?.standInFor ? ` ${me.name} drives the car.` : ''}` : `${ban}: ${LICENCE_MAX} penalty points on the licence.`, color: '#e10600' });
    else if (pts >= 8) news.unshift({ tag: 'Licence', text: `${pts} penalty points on the licence: ${Math.max(1, LICENCE_MAX - pts)} more within twelve months means a one-race ban.`, color: '#ffb000' });
    return { track: trackId, laps: C.laps, kicker: `Round ${C.round} of ${C.rounds} · Season ${C.season} · Career`, news,
      sub: [cap(fc.time === 'night' ? 'night race' : 'day race'), cap(fc.weather), `${C.laps} laps`, me ? `${me.name}${me.standInFor ? ` (for ${me.standInFor})` : ''} · ${me.team}` : null] };
  }
  const r = settings.driver === 'custom' ? { name: settings.custom.name || 'You', team: settings.custom.teamName || 'Independent', color: settings.custom.color } : ROSTER[+settings.driver];
  const news = recentResults().slice(0, 3).map((x) => ({ tag: `${x.track} · ${new Date(x.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`, text: `${x.winner} won${x.you ? `. You finished ${x.you}` : ''}.`, color: x.color }));
  for (const d of deceased().slice(-2)) news.push({ tag: 'In memoriam', text: `${d.name}, killed racing${d.at ? ` at ${d.at}` : ''}. ${d.standIn?.name || 'A reserve'} drives the ${d.team} car.`, color: '#777' });
  // (your licence: suspended for this one, or close to it - a time trial is no race)
  if (settings.mode !== 'tt') { const qp = quickPoints(); if (quickBanned()) news.unshift({ tag: 'Licence', text: `${LICENCE_MAX} penalty points: a one-race ban - you race this one as the team's reserve.`, color: '#e10600' }); else if (qp >= 8) news.unshift({ tag: 'Licence', text: `${qp} penalty points on your licence: ${Math.max(1, LICENCE_MAX - qp)} more within eight races means a one-race ban.`, color: '#ffb000' }); }
  return { track: trackId, laps: settings.mode === 'tt' ? null : settings.len, kicker: settings.mode === 'tt' ? 'Time trial' : settings.mode === 'champ' ? `Championship · ${settings.rounds} rounds` : 'Quick race',
    sub: [cap(settings.time === 'night' ? 'night' : 'day'), cap(settings.weather || 'dry'), settings.mode === 'tt' ? null : `${settings.len} laps`, r ? `${r.name} · ${r.team}` : null], news };
}
/** your quick races, for the loading screen: the latest few */
const RECENT_KEY = 'f1sim-recent';
function recentResults() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; } }
function rememberResult(rows, me) {
  const win = rows.find((r) => r.pos === 1 && !r.car.retired) || rows[0]; if (!win) return;
  const L = recentResults(); L.unshift({ track: W.track?.def?.name?.replace(/ (Strip )?Circuit$/, '') || '', winner: win.car.name, color: win.car.color, you: me ? (me.car.retired ? 'DNF' : `P${me.pos}`) : null, at: Date.now() });
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(L.slice(0, 8))); } catch (e) { /* (a private window) */ }
}
function restoreSettings() { if (S.savedSettings) { Object.assign(settings, S.savedSettings); S.savedSettings = null; syncSetupUI(); } }
/**
 * A driver's helmet, alone on a dark floor under one soft pool of light - for the mourning screen (blood: a little of
 * it run down the shell) and the career's memorial. Black and white but for the blood. A data URL, cached.
 */
const HELMETS = new Map();
function helmetURL(d, { blood = false, colour = false } = {}) {
  const key = `${d.name}|${d.helmet}|${d.number}|${blood}|${colour}|${People.lookStamp(d.name, true)}`; if (HELMETS.has(key)) return HELMETS.get(key);
  const S0 = 640, sc = new THREE.Scene(); sc.background = new THREE.Color('#000000');
  // (the paint in greys - the photograph is black and white - kept light enough for the light to find)
  const grey = (c) => { const k = new THREE.Color(c || '#ffffff'); const l = 0.2126 * k.r + 0.7152 * k.g + 0.0722 * k.b; const v = Math.max(0.05, Math.min(0.8, l)); return '#' + new THREE.Color(v, v, v).getHexString(); };
  const h = colour ? makeHelmet(d.helmet || '#ffffff', d.color || '#777777', d.number, { blood: blood ? d.name : null, driver: d.name })   // (the trophy room: in their own colours)
    : makeHelmet(grey(d.helmet), grey(d.color || '#777777'), d.number, { blood: blood ? d.name : null, driver: d.name, mono: true }); sc.add(h);
  h.rotation.set(0, 0.22, 0.15);   // (tipped back a little: resting on the chin guard and the back of the shell)
  // reflections: a studio of soft boxes (a big one overhead, a strip to the side, a faint fill) for the shell to glimmer in
  const env = new THREE.Scene(), box = (w, hh, pos, I) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ color: new THREE.Color(I, I, I), side: THREE.DoubleSide })); m.position.copy(pos); m.lookAt(0, 0, 0); env.add(m); };
  box(3, 3, new THREE.Vector3(-0.6, 4, 1.2), 6); box(0.5, 4, new THREE.Vector3(3.5, 0.6, -1.8), 5); box(2.5, 1.2, new THREE.Vector3(1.5, 0.2, 3.5), 0.6);
  const pm = new THREE.PMREMGenerator(renderer), envRT = pm.fromScene(env, 0.035); sc.environment = envRT.texture; sc.environmentIntensity = 0.75;
  // the light: one soft spot from above and in front, a rim from behind
  const spot = new THREE.SpotLight(0xfff6ea, 7, 6, 0.3, 1, 1.4); spot.position.set(0.45, 1.6, 0.6); spot.target.position.set(0, -0.06, 0); sc.add(spot, spot.target);
  const rim = new THREE.DirectionalLight(0xdfe8ff, 1.3); rim.position.set(-1.4, 0.9, -1.2); sc.add(rim);
  // the floor: dark and matte (lit only where the spot falls), the helmet's shadow soft beneath it
  const fl = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.MeshLambertMaterial({ color: '#3a3a3a' }));
  fl.rotation.x = -Math.PI / 2; fl.position.y = -0.134; sc.add(fl);
  const scv = document.createElement('canvas'); scv.width = scv.height = 128; const sx = scv.getContext('2d'), gr = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.92)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
  const shTex = new THREE.CanvasTexture(scv), sh = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.36), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.set(0, -0.133, 0); sc.add(sh);
  // (a death: the blood that ran off the shell lies in a pool on the floor, spreading toward us)
  if (blood) { const pool = bloodPool(d.name, -0.1326); pool.rotation.y = -0.73; pool.position.x = 0.07; pool.position.z = 0.07; sc.add(pool); }
  const cam = new THREE.PerspectiveCamera(26, 1, 0.05, 20); cam.position.set(1.0, 0.2, 0.92); cam.lookAt(0, -0.035, 0);   // (from the front quarter)
  const rt = new THREE.WebGLRenderTarget(S0, S0, { samples: 4, type: THREE.HalfFloatType });
  renderer.setRenderTarget(rt); renderer.render(sc, cam);
  const fpx = new Uint16Array(S0 * S0 * 4); renderer.readRenderTargetPixels(rt, 0, 0, S0, S0, fpx); renderer.setRenderTarget(null); rt.dispose(); envRT.dispose(); pm.dispose();
  sc.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.map?.dispose(); o.material.alphaMap?.dispose(); o.material.bumpMap?.dispose(); o.material.dispose(); } });
  env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  // (the target is linear and untone-mapped: filmic curve and sRGB by hand, and a vignette)
  const toS = (v) => { v *= 1.15; v = (v * (2.51 * v + 0.03)) / (v * (2.43 * v + 0.59) + 0.14); v = Math.max(0, Math.min(1, v)); return 255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); };
  const cv = document.createElement('canvas'); cv.width = cv.height = S0; const x = cv.getContext('2d'), img = x.createImageData(S0, S0);
  for (let y = 0; y < S0; y++) for (let i = 0; i < S0; i++) {
    const s = ((S0 - 1 - y) * S0 + i) * 4, o = (y * S0 + i) * 4, dx = i / S0 - 0.5, dy = y / S0 - 0.45, vg = Math.max(0, 1 - (dx * dx + dy * dy) * 2.2);
    for (let k = 0; k < 3; k++) img.data[o + k] = toS(THREE.DataUtils.fromHalfFloat(fpx[s + k]) * vg);
    img.data[o + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const url = cv.toDataURL('image/jpeg', 0.92); HELMETS.set(key, url); return url;
}
$('btn-quali-go').addEventListener('click', () => { $('quali-panel').classList.add('hidden'); runQuali(); });
$('btn-practice').addEventListener('click', () => { $('quali-panel').classList.add('hidden'); runPractice(); });
$('btn-quali-sim').addEventListener('click', () => { $('quali-panel').classList.add('hidden'); runQuali(); simToEnd(); });   // (the whole session simulated, your lap too)
$('btn-end').addEventListener('click', () => { setPaused(false); endSessionEarly(); });
$('btn-quali-done').addEventListener('click', () => { $('quali-panel').classList.add('hidden'); runRace(); });
$('btn-next').addEventListener('click', () => { $('results').classList.add('hidden'); nextAfterResults(); });
$('btn-menu').addEventListener('click', () => { $('results').classList.add('hidden'); toMenu(); });
$('btn-resume').addEventListener('click', () => setPaused(false));
// the master volume: a slider in the pause menu and in the setup's Driving page, both the same setting (Audio.setVolume)
{
  const sliders = ['vol-menu', 'vol-pause'].map($).filter(Boolean);
  const show = () => { for (const s of sliders) { s.value = Math.round(audio.volume * 100); const v = s.parentElement.querySelector('.vol-val'); if (v) v.textContent = `${s.value}%`; } };
  for (const s of sliders) s.addEventListener('input', () => { audio.setVolume(s.value / 100); show(); });
  show();
}
$('btn-quit').addEventListener('click', () => { setPaused(false); quitSession(); });
$('btn-restart').addEventListener('click', () => { setPaused(false); restartRace(); });
/**
 * RESTART RACE (pause menu, any race - a career's too): the same race again from the same grid - a fresh field (new
 * cars: no damage, laps or tyre wear carried over), no build-up, straight to the five red lights.
 */
function restartRace() {
  const wk = S.weekend; if (!wk || S.director?.mode !== 'race') return;
  const order = (wk.gridOrder || []).map((c) => c.name);
  endSession(); NEWS.cancelled = false;
  wk.cars = buildField(wk.lapsTotal); wk.player = wk.cars.find((c) => c.isPlayer) || null;
  wk.gridOrder = order.map((n) => wk.cars.find((c) => c.name === n)).filter(Boolean); for (const c of wk.cars) if (!wk.gridOrder.includes(c)) wk.gridOrder.push(c);
  S.skipIntro = true; beginRace(); S.skipIntro = false;
}
$('btn-photo').addEventListener('click', () => enterPhoto());
$('btn-tel').addEventListener('click', () => openTelemetry(false));       // (already paused)
$('btn-res-tel').addEventListener('click', () => openTelemetry(false));
$('btn-finish').addEventListener('click', () => {   // Time Trial: end the session and show the lap sheet
  const d = S.director, p = S.player; if (!d) return; setPaused(false);
  const rows = d.classification(); rows[0].gap = `Best ${fmtTime(p.bestLap)} · ${p.lap} laps`; hud.results('TIME TRIAL', rows, null); input.enabled = false; d.done = true;
});

// ---------------------------------------------------------------------------
// photo mode: free-fly camera while the session is frozen (HUD hidden, H toggles it back)
// ---------------------------------------------------------------------------
const PHOTO = { on: false, live: false, ai: null, yaw: 0, pitch: 0, drag: false, lx: 0, ly: 0, hud: false, saved: null, fx: null };
/** photo mode's lens and grade: field of view, focus (0 = on your car), depth of field, exposure, contrast, saturation, vignette */
const PHOTO_FX0 = { fov: 55, focus: 0, blur: 0, exposure: 1.05, contrast: 1, saturation: 1, vignette: 0 };
PHOTO.fx = { ...PHOTO_FX0 };
const PHOTO_SLIDERS = [
  ['fov', 'Field of view', 15, 110, 1, (v) => `${v}°`], ['focus', 'Focus', 0, 200, 1, (v) => (v ? `${v} m` : 'your car')], ['blur', 'Depth of field', 0, 100, 1, (v) => (v ? v : 'off')],
  ['exposure', 'Exposure', 0.4, 2.2, 0.05, (v) => v.toFixed(2)], ['contrast', 'Contrast', 0.6, 1.6, 0.02, (v) => v.toFixed(2)], ['saturation', 'Saturation', 0, 1.8, 0.05, (v) => v.toFixed(2)], ['vignette', 'Vignette', 0, 1, 0.05, (v) => v.toFixed(2)],
];
let photoPanel = null, vignetteEl = null;
function buildPhotoPanel() {
  if (photoPanel) return photoPanel;
  photoPanel = document.createElement('div'); photoPanel.id = 'photo-panel';
  photoPanel.innerHTML = '<div class="pp-title">PHOTO</div>' + PHOTO_SLIDERS.map(([k, label, a, b, st]) => `<label>${label}<span data-v="${k}"></span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${st}"></label>`).join('') +
    '<div class="pp-row"><button data-a="reset" class="ghost">RESET</button><button data-a="save" class="go">SAVE PHOTO</button></div>';
  document.body.appendChild(photoPanel);
  vignetteEl = document.createElement('div'); vignetteEl.id = 'photo-vignette'; document.body.appendChild(vignetteEl);
  photoPanel.addEventListener('input', (e) => { const k = e.target.dataset.k; if (k) { PHOTO.fx[k] = +e.target.value; syncPhotoPanel(); } });
  photoPanel.addEventListener('click', (e) => { const a = e.target.closest('button')?.dataset.a; if (a === 'reset') { PHOTO.fx = { ...PHOTO_FX0 }; syncPhotoPanel(); } else if (a === 'save') savePhoto(); });
  for (const ev of ['mousedown', 'keydown']) photoPanel.addEventListener(ev, (e) => e.stopPropagation());
  return photoPanel;
}
function syncPhotoPanel() {
  const fx = PHOTO.fx;
  for (const [k, , , , , fmt] of PHOTO_SLIDERS) { const i = photoPanel.querySelector(`[data-k="${k}"]`), s = photoPanel.querySelector(`[data-v="${k}"]`); if (+i.value !== fx[k]) i.value = fx[k]; s.textContent = fmt(fx[k]); }
  canvas.style.filter = PHOTO.on ? `contrast(${fx.contrast}) saturate(${fx.saturation})` : '';
  vignetteEl.style.opacity = PHOTO.on ? fx.vignette : 0;
  renderer.toneMappingExposure = PHOTO.on ? fx.exposure : 1.05;
}
function showPhotoPanel(v) { buildPhotoPanel(); photoPanel.classList.toggle('show', v); if (!v) { canvas.style.filter = ''; vignetteEl.style.opacity = 0; renderer.toneMappingExposure = 1.05; } else syncPhotoPanel(); }
// depth of field: render -> bokeh (focus from the depth buffer) -> output (tone mapping, colour space); only in photo mode
let composer = null, bokeh = null;
function ensureComposer() {
  if (!composer) {
    composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
    bokeh = new BokehPass(scene, camera, { focus: 20, aperture: 0.002, maxblur: 0.012 }); composer.addPass(bokeh); composer.addPass(new OutputPass());
  }
  const sz = renderer.getSize(new THREE.Vector2()); composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(sz.x, sz.y);
  return composer;
}
function photoFocus() {
  if (PHOTO.fx.focus > 0) return PHOTO.fx.focus;
  const p = S.player; return p ? Math.max(1.5, camera.position.distanceTo(new THREE.Vector3(p.x, 0.6 + (p.y || 0), p.z))) : 20;
}
// ---------------------------------------------------------------------------
// the crash director (camera/CrashCam.js): a big accident of the player's car takes over the camera, the clock, the
// sound and the screen until the car has come to rest
// ---------------------------------------------------------------------------
const crashCam = new CrashCam({ camera, get track() { return W.track; }, get obstacles() { return W.obstacles; }, fx: {
  onTick: () => audio.tick(),
  onResolve: (car, cc) => {
    audio.resolve(); audio.setMuffle(0); crashFlash();
    hud.msg(`CRASH · ${Math.round(cc.peak)} G${car.retired ? ` · ${(car.retireReason || 'OUT').toUpperCase()}` : ''}`, car.retired ? 'bad' : 'warn', 3);
    $('hud').classList.remove('hidden');
  },
} });
/** while the wreck is still moving the player's controls are off (the steering is the aftertouch) */
const CRASH_INPUT = { steer: 0, throttle: 0, brake: 0.6, handbrake: 0, ers: 0, drsTap: false, retireHold: 0 };
let flashEl = null;
function crashFlash() {
  if (!flashEl) { flashEl = document.createElement('div'); flashEl.style.cssText = 'position:fixed;inset:0;background:#fff;pointer-events:none;z-index:8;opacity:0;transition:opacity .45s ease-out'; document.body.appendChild(flashEl); }
  flashEl.style.transition = 'none'; flashEl.style.opacity = '0.55'; requestAnimationFrame(() => { flashEl.style.transition = 'opacity .45s ease-out'; flashEl.style.opacity = '0'; });
}
/** the car the crash is about, a damaged zone's smoke, sparks and glass where it hit */
function crashBurst(car, e, k) {
  const [vx, vz] = car.air && car.wvx != null ? [car.wvx, car.wvz] : car.worldVel();
  fire.sparks(e.x, 0.35, e.z, Math.round(12 + 40 * k), vx, vz);
  debris.burst(e.x, e.z, vx, vz, Math.round(3 + 10 * k), 0x9fd8ff);   // (glass-bright shards: the visor, the mirrors, the lights)
}
function startCrash(car, e) {
  const k = Math.min(1, Math.max(0.4, e.g / 50));
  crashCam.start(car, e.g); audio.punch(k); audio.crunch(k); audio.setMuffle(0.85);
  crashBurst(car, e, k);
  // smoke from where the car is hurt: the engine, or the nose
  const m = S.meshes.get(car); if (m) { if (car.dmg.eng > 0.25 || car.air) m._source('smoke', -1.9, 0.7, 0.6, car); if (car.dmg.fwL + car.dmg.fwR > 0.8) m._source('smoke', 2.2, 0.4, 0.35, car); }
  $('hud').classList.add('hidden');
}
function crashHit(car, e) {
  const k = Math.min(1, e.g / 50); crashCam.impact(e.g); audio.crunch(k);
  if (e.g > 10) crashBurst(car, e, k);
}
function endCrash() {
  if (!crashCam.on) return;
  crashCam.stop(); audio.setMuffle(0); camCtl._crash = null; if (S.director && !PHOTO.on) $('hud').classList.remove('hidden');
}
// the crash's screen: a radial blur that pulses on each hit and a saturation spike (one full-screen pass)
const CRASH_SHADER = {
  uniforms: { tDiffuse: { value: null }, uBlur: { value: 0 }, uSat: { value: 1 }, uCenter: { value: new THREE.Vector2(0.5, 0.5) } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uBlur; uniform float uSat; uniform vec2 uCenter; varying vec2 vUv;
    void main() { vec2 d = vUv - uCenter; vec4 c = vec4(0.0); float tot = 0.0;
      for (int i = 0; i < 12; i++) { float t = float(i) / 11.0; float w = 1.0 - 0.5 * t; c += texture2D(tDiffuse, vUv - d * uBlur * 0.14 * t) * w; tot += w; }
      c /= tot; float l = dot(c.rgb, vec3(0.299, 0.587, 0.114)); c.rgb = max(mix(vec3(l), c.rgb, uSat), 0.0); gl_FragColor = c; }`,
};
let crashComposer = null, crashPass = null;
function ensureCrashComposer() {
  if (!crashComposer) { crashComposer = new EffectComposer(renderer); crashComposer.addPass(new RenderPass(scene, camera)); crashPass = new ShaderPass(CRASH_SHADER); crashComposer.addPass(crashPass); crashComposer.addPass(new OutputPass()); }
  const sz = renderer.getSize(new THREE.Vector2()); crashComposer.setPixelRatio(renderer.getPixelRatio()); crashComposer.setSize(sz.x, sz.y);
  return crashComposer;
}
/**
 * On a circuit that is not flat (world/Terrain.js) the camera is worked out on the flat plan like everything else and
 * lifted for the frame only: by the ground under the car it is with (a chase or an onboard shot: the car's own height,
 * so it stays in frame and the cockpit stays round the driver), by the ground under itself the further it is from it;
 * onboard it also pitches with the slope, as the car does. -> undo
 */
const _camQ = new THREE.Quaternion(), _camP = new THREE.Vector3(), _camF = new THREE.Quaternion(), _camE = new THREE.Euler(), _camO = new THREE.Vector3();
function terrainLift() {
  if (!TERRAIN.on) return null;
  const c = camera.position, p = S.player; _camP.copy(c); _camQ.copy(camera.quaternion);
  let dy = TERRAIN.at(c.x, c.z), dist = Infinity;
  if (p && !PRE.walk) { dist = Math.hypot(c.x - p.x, c.z - p.z); const w = Math.min(1, Math.max(0, (dist - 12) / 30)); dy = TERRAIN.at(p.x, p.z) * (1 - w) + dy * w; }
  // an onboard camera (the cockpit, the T-cam) rides on the body: carried by exactly the lift, pitch and roll the car model
  // was given (CarMesh: the slope under it), about the car's own origin - the cockpit round it never swims and the climb
  // is as smooth as the model's
  const m = p && dist < 4 && !crashCam.on && !p.air && !p.wreck ? S.meshes.get(p) : null, g = m?.group;
  if (g && Math.abs(g.position.x - p.x) + Math.abs(g.position.z - p.z) < 0.01) {
    _camF.setFromEuler(_camE.set(p.rl || 0, -p.th, p.pt || 0, 'YZX')).invert().premultiply(g.quaternion);   // (the slope's own turn: model / flat)
    c.sub(_camO.set(p.x, p.hv || 0, p.z)).applyQuaternion(_camF).add(g.position); camera.quaternion.premultiply(_camF);
  } else c.y += dy;
  camera.updateMatrixWorld();
  return () => { c.copy(_camP); camera.quaternion.copy(_camQ); camera.updateMatrixWorld(); };
}
/** the frame: through the depth-of-field chain while a photo is being framed with it on, else straight */
function renderView() {
  const undo = terrainLift();
  try { renderFrame(); } finally { undo?.(); }
}
function renderFrame() {
  if (!PHOTO.on && crashCam.on && (crashCam.blur > 0.01 || crashCam.sat > 1.01)) {
    ensureCrashComposer(); crashPass.uniforms.uBlur.value = crashCam.blur; crashPass.uniforms.uSat.value = crashCam.sat;
    crashComposer.render(); return;
  }
  if (PHOTO.on && PHOTO.fx.blur > 0) {
    ensureComposer(); bokeh.uniforms.focus.value = photoFocus(); bokeh.uniforms.aperture.value = PHOTO.fx.blur * 0.00006; bokeh.uniforms.maxblur.value = 0.014;
    composer.render();
  } else renderer.render(scene, camera);
  if (Gallery.pending) Gallery.grab(renderer.domElement);   // (a moment kept for the loading screen: ui/Gallery.js)
}
/** the photo, as framed and graded (contrast, saturation and vignette included), saved as a PNG */
function savePhoto() {
  if (W.def) Gallery.want('photo', W.def.id);
  renderView();
  const src = renderer.domElement, c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const ctx = c.getContext('2d'), fx = PHOTO.fx;
  ctx.filter = `contrast(${fx.contrast}) saturate(${fx.saturation})`; ctx.drawImage(src, 0, 0); ctx.filter = 'none';
  if (fx.vignette > 0) { const g = ctx.createRadialGradient(c.width / 2, c.height / 2, Math.min(c.width, c.height) * 0.35, c.width / 2, c.height / 2, Math.hypot(c.width, c.height) / 2); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${0.85 * fx.vignette})`); ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height); }
  c.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `f1-photo-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, 'image/png');
  hud.msg('PHOTO SAVED', 'good', 1.5);
}
function enterPhoto() {
  PHOTO.on = true; PHOTO.hud = false; PHOTO.live = false; S.paused = true; showPhotoPanel(true);
  $('pause').classList.add('hidden'); $('hud').classList.add('hidden'); $('photo-hint').classList.remove('hidden'); $('photo-play').textContent = '▶ PLAY';
  PHOTO.saved = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
  const dir = camera.getWorldDirection(new THREE.Vector3());
  PHOTO.yaw = Math.atan2(dir.z, dir.x); PHOTO.pitch = Math.asin(Math.max(-1, Math.min(1, dir.y)));
  canvas.style.cursor = 'grab';
}
/** Let time run while flying: the player's car is handed to an AI driver until the world is paused again. */
function setPhotoLive(live) {
  const d = S.director; if (!d) return;
  PHOTO.live = live; $('photo-play').textContent = live ? '⏸ PAUSE' : '▶ PLAY';
  if (live && S.player && !PHOTO.ai && !S.player.retired) {
    PHOTO.ai = new AIDriver(S.player, W.line, W.profile, W.track, { aggression: 0.7 }); PHOTO.ai.photo = true; d.ai.push(PHOTO.ai); d.player = null;
  } else if (!live && PHOTO.ai) {
    d.ai = d.ai.filter((a) => a !== PHOTO.ai); PHOTO.ai = null; d.player = S.player;
  }
}
/**
 * Outside photo mode's play, your car is yours: any AI driver photo mode put in it is taken out and the controls go back
 * to you. (Every frame: a flashback rewound into a stretch photo mode played - its snapshot had that driver in the
 * field and no player - and left the AI driving your car for good.)
 */
function releasePhotoAI() {
  const d = S.director; if (!d || PHOTO.live) return;
  if (d.ai.some((a) => a.photo)) d.ai = d.ai.filter((a) => !a.photo);
  if (PHOTO.ai && !PHOTO.live) PHOTO.ai = null;
  const p = S.player;
  if (p && !d.player && !S.spectating && !p.autopilot && d.cars.includes(p)) d.player = p;
  if (p?.ai?.photo) p.ai = null;
}
function exitPhoto() {
  setPhotoLive(false);
  PHOTO.on = false; PHOTO.drag = false; canvas.style.cursor = ''; showPhotoPanel(false);
  $('photo-hint').classList.add('hidden'); $('hud').classList.remove('hidden'); $('pause').classList.remove('hidden');
  // the camera goes back to the car - where it is now, looking the way it is pointing - so the paused view shows where
  // you are going (with no car to follow, back where it was)
  // (head straight: Q / E fly the photo camera up and down, they must not leave the onboard view looking sideways)
  if (S.player && !FINALE.on) { camCtl.lookIn = 0; camCtl.look = 0; camCtl.back = false; camCtl._wasBack = true; camCtl._crash = null; for (let i = 0; i < 30; i++) camCtl.update(S.player, 1 / 30, W.track); }
  else if (PHOTO.saved) { camera.position.copy(PHOTO.saved.pos); camera.quaternion.copy(PHOTO.saved.quat); camera.fov = PHOTO.saved.fov; camera.updateProjectionMatrix(); }
}
$('photo-play').addEventListener('click', () => setPhotoLive(!PHOTO.live));
function updatePhoto(dt) {
  const k = input.keys; const fast = k.has('ShiftLeft') || k.has('ShiftRight');
  const speed = (fast ? 90 : 22) * dt, look = 1.6 * dt;
  if (k.has('ArrowLeft')) PHOTO.yaw -= look; if (k.has('ArrowRight')) PHOTO.yaw += look;
  if (k.has('ArrowUp')) PHOTO.pitch += look; if (k.has('ArrowDown')) PHOTO.pitch -= look;
  PHOTO.pitch = Math.max(-1.5, Math.min(1.5, PHOTO.pitch));
  const cp = Math.cos(PHOTO.pitch);
  const fwd = new THREE.Vector3(cp * Math.cos(PHOTO.yaw), Math.sin(PHOTO.pitch), cp * Math.sin(PHOTO.yaw));
  const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
  const mv = new THREE.Vector3();
  if (k.has('KeyW')) mv.add(fwd); if (k.has('KeyS')) mv.sub(fwd); if (k.has('KeyD')) mv.add(right); if (k.has('KeyA')) mv.sub(right);
  if (k.has('KeyE')) mv.y += 1; if (k.has('KeyQ')) mv.y -= 1;
  if (mv.lengthSq() > 0) camera.position.addScaledVector(mv.normalize(), speed);
  // the camera can't go into the ground, a building or a grandstand: it is pushed back out (a little clear of it)
  camera.position.y = Math.max(0.35, camera.position.y);
  const oh = PHOTO._oh || (PHOTO._oh = {});
  if (W.obstacles && W.obstacles.hit(camera.position.x, camera.position.z, camera.position.y, oh)) { camera.position.x += oh.nx * (oh.pen + 0.4); camera.position.z += oh.nz * (oh.pen + 0.4); }
  camera.up.set(0, 1, 0); camera.lookAt(camera.position.clone().add(fwd));
  if (camera.fov !== PHOTO.fx.fov) { camera.fov = PHOTO.fx.fov; camera.updateProjectionMatrix(); }
}
canvas.addEventListener('mousedown', (e) => { if (!PHOTO.on) return; PHOTO.drag = true; PHOTO.lx = e.clientX; PHOTO.ly = e.clientY; canvas.style.cursor = 'grabbing'; });
window.addEventListener('mouseup', () => { if (PHOTO.on) { PHOTO.drag = false; canvas.style.cursor = 'grab'; } });
window.addEventListener('mousemove', (e) => {
  if (!PHOTO.on || !PHOTO.drag) return;
  PHOTO.yaw += (e.clientX - PHOTO.lx) * 0.0035; PHOTO.pitch -= (e.clientY - PHOTO.ly) * 0.0035; PHOTO.lx = e.clientX; PHOTO.ly = e.clientY;
});

// ---------------------------------------------------------------------------
// finale: at the end of a race / qualifying the camera cuts to a static shot of the Sphere, which shows the
// winner / polesitter tribute for a few seconds before the results appear
// ---------------------------------------------------------------------------
const FINALE = { on: false, t: 0, dur: 7, then: null, shot: null };
function startFinale(car, title, then) {
  if (!W.landmarks?.sphere || !W.sphereInfo) { then(); return; }
  if (show) show.championInfo = { title, name: car.name, team: car.team, number: car.number, color: car.color, color2: car.color2 || '#ffffff' };
  const u = W.landmarks.sphere.material.uniforms; u.uForce.value = SHOW_ID.champion; u.uTwoSided.value = SIDES.champion; u.uShowBg.value.set(SHOW_BG.champion);
  FINALE.on = true; FINALE.t = 0; FINALE.then = then; hud.hide(); $('fade').style.opacity = '0';
  FINALE.shot = { tag: /POLE/.test(title) ? 'pole' : 'winner', caption: `${/POLE/.test(title) ? 'Pole position' : 'Race winner'} · ${car.name}${car.isPlayer ? ' (you)' : ''}` };
}
function updateFinale(dt) {
  FINALE.t += dt;
  if (FINALE.shot && FINALE.t > 2.4) { Gallery.want(FINALE.shot.tag, W.def.id, FINALE.shot.caption); FINALE.shot = null; }   // (for the loading screen)
  const c = W.sphereInfo.center, r = W.sphereInfo.radius; const a = (W.faceAngle0 || 0) + simTime * (2 * Math.PI / 300) + 0.25;   // from the side the content faces
  const dist = r * 2.9 - FINALE.t * 2.5;   // slow push-in
  camera.position.set(c.x + Math.cos(a) * dist, r * 0.42, c.z + Math.sin(a) * dist); camera.up.set(0, 1, 0); camera.lookAt(c.x, c.y + r * 0.1, c.z);
  if (camera.fov !== 50) { camera.fov = 50; camera.updateProjectionMatrix(); }
  if (FINALE.t >= FINALE.dur) { FINALE.on = false; W.landmarks.sphere.material.uniforms.uForce.value = -1; camera.fov = 74; camera.updateProjectionMatrix(); const f = FINALE.then; FINALE.then = null; f && f(); }
}

// ---------------------------------------------------------------------------
// session management
// ---------------------------------------------------------------------------
const S = { director: null, cars: [], meshes: new Map(), player: null, paused: false, weekend: null, halo: true };
window.addEventListener('keydown', (e) => { if (e.code === 'Tab' && S.director && !S.director.done) e.preventDefault(); });   // (Tab: the next car to watch, not the browser's focus)

function weatherWetness(w) { return w === 'wet' ? 0.75 : w === 'damp' ? 0.35 : 0; }
/** Visual weather: rain density, heavier fog, greyer sky, wet reflective asphalt. */
function applyWeather(wet) {
  const base = W.time === 'day' ? 0.00016 : 0.00035;
  scene.fog.density = base + wet * 0.0007;
  rain.setIntensity(wet > 0.5 ? 1 : wet > 0.2 ? 0.45 : 0);
  if (wet > 0.2) { scene.fog.color.lerp(new THREE.Color(W.time === 'day' ? 0x8a929c : 0x0d0f16), 0.6); env.sun.intensity *= 0.6; env.hemi.intensity *= 0.8; }
  // slick night asphalt: enough gloss for the floodlights and the Sphere to smear across it, glassy when wet
  const rm = W.trackMesh.userData.roadMat; rm.roughness = 0.62 - 0.4 * wet; rm.metalness = 0.06 + wet * 0.25; rm.envMapIntensity = 0.55 + wet * 1.4;
}

/** a team's car on the day (Roster dayPerf: the circuit's fit and the weekend's form) - drawn once a weekend and kept
 *  for every session of it (qualifying and the race the same car) */
function onTheDay(team) {
  const wk = S.weekend, key = `${W.def?.id}|${wk?.round ?? ''}`;
  if (!wk) return dayPerf(team, W.def?.id || '');
  const M = wk.dayP?.key === key ? wk.dayP : (wk.dayP = { key, m: new Map() });
  let v = M.m.get(team); if (v == null) M.m.set(team, (v = dayPerf(team, W.def?.id || '')));
  return v;
}
/** an AI car's starting tyre: wet weather, or by the race length and the car's pace */
function aiCompound(e, lapsTotal) {
  const wet = weatherWetness(settings.weather);
  return wet > 0.5 ? 'WET' : wet > 0.2 ? 'INTER' : lapsTotal >= 13 ? (e.tier <= 1 ? (Math.random() < 0.5 ? 'MEDIUM' : 'SOFT') : (Math.random() < 0.6 ? 'SOFT' : 'MEDIUM')) : (Math.random() < 0.85 ? 'SOFT' : 'MEDIUM');
}
/** why the seat-holder a stand-in replaces is out (an entry without outWhy: from the driver's record) -> 'ban' | 'injury' */
function outWhyOf(C, name) { const d = Object.values(C.drivers || {}).find((x) => x.name === name); return d && isBanned(C, d) ? 'ban' : 'injury'; }
/** a career round's grid: every team's seats, each car as its team has developed it */
function careerField(C, lapsTotal, assists) {
  const cars = [], E = C.entries(), standing = !!E.find((e) => e.isPlayer)?.standInFor;
  // (your friends in the paddock race you hard but clean - a mate leaves a little more room: Social.friendFavours. Not
  //  for a stand-in in your car: the friendship is yours, not his)
  const room = new Map();
  if (!standing) try { for (const f of friendFavours(C)) if (f.kind === 'room' && f.mul) room.set(f.did, f.mul); } catch (e) { console.warn('[career] favours', e); }
  for (const e of E) {
    const car = new Car(W.track, { name: e.name, short: e.short, team: e.team, color: e.color, isPlayer: e.isPlayer, perf: e.perf + onTheDay(e.team), rating: e.rating, number: e.number, compound: e.isPlayer ? settings.tyre : aiCompound(e, lapsTotal), raceLaps: lapsTotal, assists });
    car.tier = e.tier; car.color2 = e.color2; car.helmet = e.helmet; car.livery = e.livery || null; car.boxIdx = e.garage === 'own' ? TEAMS.length : e.garage;
    car.careerId = e.careerId; car.standInFor = e.standInFor || null; car.outWhy = e.outWhy || (e.standInFor ? outWhyOf(C, e.standInFor) : null);
    // (the driver's head this weekend - career/Morale.js FORM, read live by the race code - and the licence they carry)
    const rec = C.drivers[e.careerId];
    car.form = e.form || formOf(moodOf(rec)); car.licencePts = e.licence ?? activePoints(C, e.careerId);
    const fx = e.fx || {};   // (the tech tree: DRS, ERS power and battery, tyre wear, brakes, reliability, the pit crew)
    car.drsGain = fx.drs || 0; car.ersMul = fx.ers || 1; car.ersCap = fx.erc || 1; car.brakeMul = fx.brake || 1; car.relMul = fx.relMul || 1; car.pitMul = fx.pitMul || 1;
    // (your tyres also wear by your focus: smooth inputs when your head is in it - baseWear kept for the walk's refresh)
    car.baseWear = fx.wear || 1; car.wearMul = e.isPlayer ? car.baseWear * (car.form.wear || 1) : car.baseWear; car.tyres.wearMul = car.wearMul;
    // (Paddock Rapport: a driver you have fallen out with races harder; one you get on with gives you a little more room)
    if (!e.isPlayer) { const v = C.rapportOf(e.careerId); car.aggrMul = v < 0 ? 1 + Math.min(0.5, -v / 160) : 1 - Math.min(0.12, v / 600); car.aggrMul *= room.get(e.careerId) || 1; }
    cars.push(car);
  }
  // (never a race without you in it: if your driver somehow has no car, watch your team's - never a frozen camera)
  if (!cars.some((c) => c.isPlayer) && S.weekend) { S.weekend.spectate = cars.find((c) => c.team === C.myTeam) || cars[0] || null; console.warn('[career] no car for your driver this round: watching', S.weekend.spectate?.name); }
  return cars;
}
/** the drivers killed in quick races (and quick championships): gone for good, a stand-in in their seat from then on */
const DECEASED_KEY = 'f1sim-deceased';
function deceased() { try { return JSON.parse(localStorage.getItem(DECEASED_KEY) || '[]'); } catch (e) { return []; } }
function rememberLost(c, si) {
  if (S.weekend?.career || !si) return;
  const L = deceased(); if (L.some((x) => x.name === c.name)) return;
  L.push({ name: c.name, team: c.team, number: c.number, forever: true, standIn: si, at: W.track?.def?.name || '' });
  try { localStorage.setItem(DECEASED_KEY, JSON.stringify(L)); } catch (e) { /* (a private window: lost for this sitting only) */ }
  refreshMemoriam();
}
/**
 * The In Memoriam lines (the setup's driver page and the home): the drivers killed in quick races, newest first, names
 * only, in grey; with more than three, the driver page offers them all. The team grid then shows who has their seats.
 */
function refreshMemoriam() {
  const L = deceased().slice().reverse(), at = (x) => String(x.at || 'killed racing').replace(/ (Strip )?Circuit$/, '');
  const names = L.slice(0, 3).map((x) => `${htmlEsc(x.name)}<small>#${htmlEsc(x.number ?? '?')} · ${htmlEsc(at(x))}</small>`).join('<i> · </i>');
  for (const [id, setup] of [['memoriam', true], ['memoriam-home', false]]) {
    const el = $(id); if (!el) continue;
    el.classList.toggle('hidden', !L.length);
    el.innerHTML = !L.length ? '' : `<b>IN MEMORIAM</b><span class="names">${names}${!setup && L.length > 3 ? `<i> · </i><small>and ${L.length - 3} more</small>` : ''}</span>${setup && L.length > 3 ? `<button class="more" data-mm="open">all ${L.length}</button>` : ''}`;
  }
  $('restore-grid')?.classList.toggle('hidden', !L.length);
  renderTeams(); renderSlot(false);
  if (!$('su-mem').classList.contains('hidden')) showMem(L.length > 0, SU.mem);
}
setTimeout(refreshMemoriam, 0);
function buildField(lapsTotal) {
  const cars = []; const assists = settings.assist === 'full' ? { tc: true, abs: true } : settings.assist === 'abs' ? { tc: false, abs: true } : { tc: false, abs: false };
  if (S.weekend?.career) return careerField(S.weekend.career, lapsTotal, assists);
  const isCustom = settings.driver === 'custom';
  const entries = ROSTER.map((r) => ({ ...r }));
  if (isCustom) entries.push(customDriver(settings.custom));
  const wk = S.weekend; if (wk) wk.spectate = null;
  // your licence outside a career (career/Licence.js, in the browser): twelve points and the next race is a ban - you
  // drive the team's reserve instead (a time trial is no race)
  const banned = settings.mode !== 'tt' && quickBanned(), pts = quickPoints();
  const taken = new Set(ROSTER.map((r) => r.name)); for (const v of wk?.out?.values() || []) if (v.standIn) taken.add(v.standIn.name); for (const x of deceased()) if (x.standIn) taken.add(x.standIn.name);
  // (every other driver's head this weekend: a mood drawn once a round, the same through practice, qualifying and the race)
  const QM = wk ? (wk.qMood?.round === wk.round ? wk.qMood : (wk.qMood = { round: wk.round, m: new Map() })) : { m: new Map() };
  const moodFor = (name) => { let v = QM.m.get(name); if (v == null) QM.m.set(name, (v = 45 + Math.random() * 30)); return v; };
  entries.forEach((e0, i) => {
    let isPlayer = isCustom ? !!e0.custom : i === +settings.driver, e = e0;
    // stood down after a big accident last round: the stand-in drives this car (yours: you drive it as them)
    // (out: hurt and missing rounds, or killed and gone for good - this championship, and every quick race after it)
    const out = wk?.out?.get(e0.name) || deceased().find((x) => x.name === e0.name);
    if (out && (out.forever || (wk && wk.round >= out.round && wk.round <= (out.until ?? out.round)))) { e = { ...e0, name: out.standIn.name, short: out.standIn.short, rating: out.standIn.rating, number: out.standIn.number, helmet: out.standIn.helmet, standInFor: out.forever ? null : e0.name }; }   // (gone for good: the seat is the stand-in's now - and yours, if it was your team's)
    if (isPlayer && banned) { const si = standIn(e.team, taken); taken.add(si.name); e = { ...e, name: si.name, short: si.short, rating: si.rating, number: si.number, helmet: si.helmet, standInFor: e.standInFor || e.name, outWhy: 'ban' }; }   // (suspended: the reserve races - and you drive it as them)
    const wet = weatherWetness(settings.weather);
    let compound = settings.tyre;
    if (!isPlayer) compound = wet > 0.5 ? 'WET' : wet > 0.2 ? 'INTER' : lapsTotal >= 13 ? (e.tier <= 1 ? (Math.random() < 0.5 ? 'MEDIUM' : 'SOFT') : (Math.random() < 0.6 ? 'SOFT' : 'MEDIUM')) : (Math.random() < 0.85 ? 'SOFT' : 'MEDIUM');
    const car = new Car(W.track, { name: e.name, short: e.short, team: e.team, color: e.color, isPlayer, perf: e.perf + onTheDay(e.team), rating: e.rating, number: e.number, compound, raceLaps: lapsTotal, assists });
    car.tier = e.tier; car.color2 = e.color2; car.helmet = e.helmet; car.livery = e.livery || null; car.boxIdx = e.custom ? TEAMS.length : teamIndexOf(e.team); cars.push(car);   // one pit garage per team
    if (e.standInFor) { car.standInFor = e.standInFor; car.outWhy = e.outWhy || 'injury'; }
    // (form: yours neutral - nothing carried between quick races but the licence; the stand-in's licence is his own)
    car.form = isPlayer ? neutralForm() : formOf(moodOf({ morale: moodFor(e.name), moodOff: { focus: 0, racecraft: 0, confidence: 0, composure: 0 } }));
    car.licencePts = isPlayer && !e.outWhy ? pts : 0; car.baseWear = 1;
  });
  return cars;
}

function spawnMeshes(cars) {
  for (const c of cars) { const m = new CarMesh(c.color, c.tyres.compound, { color2: c.color2, team: c.team, livery: c.livery, helmet: c.helmet, driver: c.name, number: c.number, glove: People.lookOf(c.name).suit?.secondary, tcamColor: c.number % 2 ? 0xffd400 : 0x111111 }); m.setHalo(S.halo); scene.add(m.group); S.meshes.set(c, m); }
  // (the cars first among the solid things: they hide the road under and beyond them, which is then not shaded)
  for (const m of S.meshes.values()) m.group.traverse((o) => { if (o.isMesh) o.renderOrder = -1; });
}
/** one car's model made again (a flashback back to before it was torn in two: a torn mesh cannot be made whole) */
function respawnMesh(c) {
  const old = S.meshes.get(c); if (old) { scene.remove(old.group); old.dispose(); S.meshes.delete(c); }
  spawnMeshes([c]);
}
// ---------------------------------------------------------------------------
// flashback: Backspace opens it (the race freezes, the picture fades), A / D or the arrows scrub back and forth through
// the last 15 s, Enter resumes from there, Esc / Backspace goes back to where you were. Race/Flashback.js holds the
// recording; resuming rebuilds the car models (a split car, lost wings) and clears the smoke and debris of what has
// not happened any more.
// ---------------------------------------------------------------------------
let fbBar = null;
function fbShow(v) {
  if (!fbBar) {
    fbBar = document.createElement('div'); fbBar.id = 'fb-bar';
    fbBar.innerHTML = '<div class="fb-title">FLASHBACK <span class="fb-left"></span></div><div class="fb-track"><div class="fb-fill"></div><div class="fb-head"></div></div><div class="fb-time"></div><div class="fb-hint">A / D or ◀ ▶ scrub · Enter resume from here · Esc back to now</div>';
    document.body.appendChild(fbBar);
  }
  fbBar.classList.toggle('show', v);
  canvas.style.filter = v ? 'saturate(0.3) sepia(0.3) contrast(1.05) brightness(0.92)' : '';
}
function startFlashback() {
  const d = S.director, fb = d?.flashback;
  if (!fb || fb.uses <= 0) { hud.msg('NO FLASHBACKS LEFT', 'warn', 1.5); return; }
  if (fb.buf.length < 2) { hud.msg('NOTHING TO REWIND YET', 'warn', 1.5); return; }
  endCrash();
  S.fb = { now: fb.snap(), pos: d.time, max: d.time, shown: null, base: new Map() };
  if (audio.engGain) { const tt = audio.ctx.currentTime; audio.engGain.gain.setTargetAtTime(0, tt, 0.05); audio.noiseGain.gain.setTargetAtTime(0, tt, 0.05); }   // (the engine falls silent)
  fbShow(true);
}
function updateFlashback(dt) {
  const F = S.fb, d = S.director, fb = d.flashback, k = input.keys;
  if (input.pressed('Escape') || input.pressed('Backspace')) { endFlashback(false); return; }
  if (input.pressed('Enter')) { endFlashback(true); return; }
  const dir = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
  F.pos = Math.max(fb.buf[0].t, Math.min(F.max, F.pos + dir * dt * 1.5));
  // the snapshot at or before the playhead, and the cars eased toward the next one (smooth at 60 fps from 4 a second)
  const i = Math.max(0, fb.buf.findIndex((s) => s.t > F.pos) - 1), s0 = F.pos >= F.max - 1e-3 ? F.now : fb.buf[i >= 0 ? i : fb.buf.length - 1];
  const s1 = s0 === F.now ? null : fb.buf[i + 1] || F.now;
  if (F.shown !== s0) {
    fb.restore(s0); F.shown = s0; F.base.clear(); for (const c of S.cars) F.base.set(c, [c.x, c.z, c.th]);
    for (const c of S.cars) if (S.meshes.get(c)?.splitDone && !c.split) respawnMesh(c);   // (the damage as it was then: CarMesh._sync)
  }
  if (s1) {
    const f = Math.max(0, Math.min(1, (F.pos - s0.t) / Math.max(1e-3, s1.t - s0.t)));
    for (const [a, st] of s1.state) {
      const b = F.base.get(a); if (!b || a.p || st.p || typeof st.x !== 'number') continue;
      let dth = st.th - b[2]; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
      a.x = b[0] + (st.x - b[0]) * f; a.z = b[1] + (st.z - b[1]) * f; a.th = b[2] + dth * f;
    }
  }
  for (const c of S.cars) S.meshes.get(c)?.update(c, 0);
  syncSafetyCar(d, 0);
  if (S.player && !FINALE.on) { camCtl._crash = null; camCtl.update(S.player, 1 / 60, W.track); }
  // the bar
  const span = Math.max(1e-3, F.max - fb.buf[0].t), back = F.max - F.pos;
  fbBar.querySelector('.fb-head').style.left = `${(1 - back / span) * 100}%`; fbBar.querySelector('.fb-fill').style.width = `${(1 - back / span) * 100}%`;
  fbBar.querySelector('.fb-time').textContent = back < 0.05 ? 'now' : `−${back.toFixed(1)} s`;
  fbBar.querySelector('.fb-left').textContent = fb.uses === Infinity ? '' : `· ${fb.uses} LEFT`;
}
function endFlashback(resume) {
  const F = S.fb, d = S.director, fb = d.flashback; S.fb = null; fbShow(false);
  if (resume && F.pos < F.max - 0.15) {
    const s = fb.at(F.pos); fb.restore(s); fb.cut(s.t); fb.uses--;
    // the models and effects of what no longer happened
    for (const m of S.meshes.values()) { scene.remove(m.group); m.dispose(); } S.meshes.clear(); spawnMeshes(S.cars);
    debris.clear(); fire.clear(); chunks.clear(); camCtl._crash = null; engineer.queue = [];
    if (S.player) S.player.resets = (S.player.resets || 0) + 1;   // (telemetry: the lap is not a clean one)
    hud.msg(`FLASHBACK${fb.uses === Infinity ? '' : ` · ${fb.uses} LEFT`}`, 'good', 1.6);
  } else fb.restore(F.now);
}
/** the safety car's model: there while the car is on the track (lights flashing, off once it is coming in) */
let scMesh = null;
function syncSafetyCar(d, dt) {
  const c = d?.sc?.car || null;
  if (c && !scMesh) { scMesh = new SafetyCarMesh(); scene.add(scMesh.group); }
  if (!c && scMesh) { scene.remove(scMesh.group); scMesh.dispose(); scMesh = null; }
  if (c) scMesh.update(c, dt, d.sc.phase === 'scIn' ? 'off' : 'amber');
}
function endSession() {
  killPre();   // (quit during the build-up)
  if (S.director) S.lastTelemetry = S.director.telemetry;
  S.crews?.dispose(); S.crews = null; pitTiming.hide(); S.flags?.dispose(); S.flags = null; S.fireworks?.dispose(); S.fireworks = null;   // the report stays available after the session (results, qualifying sheet)
  if (telView.open) telView.close();
  for (const m of S.meshes.values()) { scene.remove(m.group); m.dispose(); }
  // belt and braces: no car from any previous session (crashed, retired, ambient or photo-mode) may survive
  for (const o of [...scene.children]) if (o.userData?.isCar) scene.remove(o);
  if (POV.on) { povEnd(); blackout().style.opacity = '0'; } if (visorEl) visorEl.style.display = 'none';   // (quit in the middle of it: not left in the black)
  S.meshes.clear(); S.director = null; S.cars = []; S.player = null; S.spectating = false; S.ff = false; if (S.fb) { S.fb = null; fbShow(false); } hud.hide(); hud.closePit(); hud.boxCue(null); input.enabled = true;
  debris.clear(); fire.clear(); chunks.clear(); syncSafetyCar(null, 0); endCrash();
  if (RL.group) RL.group.visible = false;
  W.pitBoxes?.update(0, false);
}
/** out of the session: a career's menu is the career (the main menu is one step further out, from the career's MENU) */
function toMenu() {
  const career = !!(S.weekend?.career || S.career);
  endSession(); S.weekend = null; restoreSettings(); strings(false); NEWS.cancelled = false;
  $('menu').classList.remove('hidden'); $('step-setup').classList.add('hidden'); $('step-mode').classList.remove('hidden');
  if (career) openCareerHub();
}
/** END SESSION (practice, qualifying): practice simply stops; qualifying is finished for you, the rest simulated */
function endSessionEarly() {
  const d = S.director; if (!d || d.done) return;
  if (d.practice) d.finish(); else if (d.mode === 'quali') simToEnd();
}
/**
 * QUIT: in a career's qualifying with a lap of yours on the board, the session is finished first (the rest simulated)
 * so the lap stands - pressing RACE again goes straight to the grid you qualified for.
 */
function quitSession() {
  const d = S.director, wk = S.weekend;
  if (wk?.career && d && d.mode === 'quali' && !d.practice && !d.done && d.player && isFinite(d.player.bestLap)) { if (!d.player.autopilot) d.handOver(); d.simulateRest(); }
  toMenu();
}
function setPaused(v) {
  S.paused = v; $('pause').classList.toggle('hidden', !v);
  const d = S.director, career = !!S.weekend?.career;
  $('btn-finish').classList.toggle('hidden', !(v && d && d.mode === 'tt'));
  $('btn-restart').classList.toggle('hidden', !(v && d && d.mode === 'race' && !NEWS.cancel));
  $('btn-end').classList.toggle('hidden', !(v && d && d.mode === 'quali' && !d.done));
  $('btn-end').firstChild.textContent = d?.practice ? 'END PRACTICE' : 'END SESSION · SIMULATE THE REST';
  $('btn-quit').firstChild.textContent = career ? (d?.mode === 'quali' && !d.practice && isFinite(d?.player?.bestLap) ? 'QUIT TO CAREER · KEEP YOUR LAP' : 'QUIT TO CAREER') : 'QUIT TO MENU';
}

/**
 * Every mode that takes the controls or the camera away - paused, photo mode, the finale's orbit, a race being
 * cancelled, the news fading in, the crash director, the first-person blackout, a fast-forward - cleared, so a new
 * weekend always starts with you in your car. (Any of them left over from a session that ended in the middle of it
 * froze the next race on a still camera with no control.)
 */
function resetTransient() {
  killPre();
  if (PHOTO.on) exitPhoto();
  PHOTO.on = false; PHOTO.live = false; PHOTO.ai = null; $('photo-hint')?.classList.add('hidden');
  if (S.paused) setPaused(false); S.paused = false; $('pause').classList.add('hidden');
  FINALE.on = false; FINALE.then = null;
  if (NEWS.cut && NEWS.on) { try { NEWS.cut.dispose?.(); } catch (e) { /* already gone */ } }
  NEWS.on = false; NEWS.cut = null; NEWS.fading = false; NEWS.cancel = null; NEWS.wait = 0;
  if (POV.on) povEnd();
  const b = blackout(); b.style.transition = 'none'; b.style.opacity = '0'; if (visorEl) visorEl.style.display = 'none'; canvas.style.filter = '';
  S.simming = false; S.ff = false; S.spectating = false; endCrash(); endFlashbackIfOpen();
  input.enabled = true; audio.setMuffle?.(0); audio.silence?.(false);
}
function startWeekend() {
  S.choosing = false;
  resetTransient();
  $('menu').classList.add('hidden'); $('shot-label').classList.add('hidden'); $('fade').style.opacity = '0'; CINE.i = -1; clearAmbient();
  const lapsTotal = settings.len; const wet = weatherWetness(settings.weather);
  setTimeOfDay(settings.time); applyWeather(wet);
  S.weekend = { mode: settings.mode, lapsTotal, wet, round: 1, rounds: settings.mode === 'champ' ? settings.rounds : 1, points: new Map(), out: new Map() };
  if (settings.mode === 'champ' && S.career) {
    // (a career round: its number, the season's standings so far)
    const C = S.career, wk = S.weekend; wk.career = C; wk.round = C.round; wk.rounds = C.rounds;
    wk.points = new Map(C.driverStandings().map((d) => [d.name, { name: d.name, color: C.teams[d.team]?.color || '#555', points: d.points, me: d.id === C.playerId }]));
  }
  if (settings.mode === 'tt') return runTimeTrial();
  startRound();
}
function startRound() {
  const wk = S.weekend; strings(false); NEWS.cancelled = false;
  if (wk.mode === 'champ' && !wk.career && wk.round > 1) { // vary the weather round to round
    const r = Math.random(); wk.wet = r < 0.6 ? 0 : r < 0.85 ? 0.35 : 0.75; setTimeOfDay(settings.time); applyWeather(wk.wet);
  }
  wk.cars = buildField(wk.lapsTotal); wk.player = wk.cars.find((c) => c.isPlayer) || null;
  const C = wk.career, sg = C?.savedGrid;
  if (settings.grid === 'quali' && wk.player && sg && sg.season === C.season && sg.round === C.round) {
    // (qualifying already done for this round - you left after it: straight to the grid you qualified for)
    wk.gridOrder = sg.ids.map((id) => wk.cars.find((c) => c.careerId === id)).filter(Boolean); for (const c of wk.cars) if (!wk.gridOrder.includes(c)) wk.gridOrder.push(c);
    const pi = wk.gridOrder.findIndex((c) => c.isPlayer);
    $('quali-results').innerHTML = ''; $('quali-info').textContent = `Round ${wk.round}/${wk.rounds} · ${W.track.def.name} · qualifying is done: you start P${pi + 1}${sg.times?.[pi] ? ` (${fmtTime(sg.times[pi])})` : ''}.`;
    $('btn-practice').classList.add('hidden'); $('btn-quali-go').classList.add('hidden'); $('btn-quali-sim').classList.add('hidden'); $('btn-quali-done').classList.remove('hidden');
    $('quali-panel').classList.remove('hidden');
  } else if (settings.grid === 'quali' && wk.player) {
    $('btn-practice').classList.remove('hidden'); $('btn-quali-sim').classList.remove('hidden');
    const cond = `${{ dry: 'Dry', damp: 'Damp', wet: 'Wet' }[settings.weather] || 'Dry'}, ${settings.time === 'night' ? 'night' : 'day'}`;
    $('quali-info').textContent = `Round ${wk.round}/${wk.rounds} · ${W.track.def.name} · ${cond}. Qualifying: the whole field is out with you on flying laps, two timed laps each, the best counts. You start on a straight. When your laps are done, watch the rest (Tab: next car, Enter: ×6) or press F to simulate it. Expected pace: ${fmtTime(estimatePace())}`;
    if (wk.career?.objectives?.length) $('quali-info').textContent += ` · Sponsor targets this weekend: ${wk.career.objectives.map((ob) => `${ob.text} ($${ob.reward}M)`).join('; ')}.`;
    $('quali-results').innerHTML = ''; $('btn-quali-go').classList.remove('hidden'); $('btn-quali-done').classList.add('hidden');
    $('quali-panel').classList.remove('hidden');
  } else {
    const others = wk.cars.filter((c) => c !== wk.player).sort((a, b) => (b.perf + b.rating * 0.02) - (a.perf + a.rating * 0.02));
    const slot = Math.min(settings.slot, wk.cars.length); if (wk.player) others.splice(slot - 1, 0, wk.player); wk.gridOrder = others;
    runRace();
  }
}
function estimatePace() { let t = 0; for (let i = 0; i < W.track.n; i++) t += W.track.ds / Math.max(8, W.profile[i]); return t * 1.02; }

function makeDirector(mode, cars, player, extra = {}) {
  const wk = S.weekend;
  // (the title screen's ambient cars: any frame between two sessions with no director - the results, the build-up, a
  //  career's next session - made them again, and a session started any way but the menu's START left them standing
  //  frozen where they had been placed: the "ghost cars" at the same spots every race. Never two fields at once)
  // (and the last session's car models, if it was not ended first: one model per car of THIS session)
  clearAmbient();
  for (const m of S.meshes.values()) { scene.remove(m.group); m.dispose(); } S.meshes.clear();
  for (const o of [...scene.children]) if (o.userData?.isCar) scene.remove(o);
  // (stood down: no player - the camera and the dash follow your team's stand-in, and the race can be fast-forwarded)
  S.cars = cars; S.player = player || extra.spectate || null; S.spectating = !player && !!extra.spectate; S.ff = false; S.contacts = new Map(); spawnMeshes(cars);
  endCrash(); if (player) player.crashLog = [];   // (the crash director listens to the player's car)
  engineer.reset();
  S.director = new RaceDirector({
    track: W.track, line: W.line, profile: W.profile, pit: W.pit, obstacles: W.obstacles, cars, player, hud, audio, engineer: mode === 'race' ? engineer : null,
    settings: { mode, practice: !!extra.practice, lapsTotal: wk.lapsTotal, aggression: settings.aggr, skill: skillOf(settings.diff), wetness: wk.wet, gridOrder: extra.gridOrder, stewards: settings.stewards, safetyCar: settings.sc !== 'off', failures: settings.fail !== 'off', flashbacks: settings.fb, champNext: wk.mode === 'champ' && wk.round < wk.rounds },
    onFinish: extra.onFinish, onPitDone: (c) => S.meshes.get(c)?.setCompound(c.tyres.compound),
    onContact: (a, b, v) => noteContact(a, b, v), onPlayerDone: (c) => watchSession(c),
    onRedFlag: () => { debris.clear(); fire.clear(); chunks.clear(); },
  });
  hud.initMinimap(W.track, W.pit); hud.show(); camCtl.mode = 'tcam';   // every session starts on the broadcast T-cam
  if (player && W.pitBoxes) W.pitBoxes.setPlayer(player.boxIdx ?? 0, player.name);   // your garage: cyan box + marker
  if (S.spectating) hud.msg(`STOOD DOWN · WATCHING ${S.player.name.toUpperCase()}\nEnter: fast-forward`, 'warn', 6);
  else if (player?.standInFor) hud.msg(standInBanner(player), 'warn', 6);   // (your driver hurt, or banned: you race their stand-in)
  ensureRacingLine(); RL.group.visible = RL.on;
  S.crews?.dispose(); S.crews = W.pit ? new PitCrews(scene, 3, S.meshes, W.time === 'night') : null;   // (the crews: a whole stop, choreographed - world/PitCrew.js)
  S.fireworks?.dispose(); S.fireworks = W.def.id === 'lasvegas' && mode === 'race' ? new Fireworks(scene) : null;   // (the Strip's fireworks for the winner)
  S.flags?.dispose(); S.flags = new Marshals(scene, W.track, W.pit);       // (the marshal posts' flags: an incident, blue flags, the chequered flag)
  floodlitAll(scene); precompile();
}

/**
 * The banner when you race a stand-in: why your driver is out - a one-race ban (twelve penalty points) or an injury -
 * and, on the grid before the race, the stand-in's form (career/Morale.js FORM label)
 */
function standInBanner(p, form = null) {
  const ban = p.outWhy === 'ban';
  return `${ban ? 'SUSPENDED' : 'STANDING IN'} · YOU DRIVE AS ${p.name.toUpperCase()}\n${p.standInFor} ${ban ? `serves a one-race ban (${LICENCE_MAX} penalty points)` : 'is out injured'}${form ? ` · FORM: ${form}` : ''}`;
}
// how the engineer puts a rival's form on the radio (career/Morale.js FORM labels; STEADY is not worth a word)
const FORM_SAY = { FLYING: (n) => `${n}'s flying`, CONFIDENT: (n) => `${n} is braking late, full of confidence`, FOCUSED: (n) => `${n} looks switched on`, SHARP: (n) => `${n}'s racecraft is sharp at the moment`,
  COOL: (n) => `${n} is ice cool`, SHAKY: (n) => `${n} is shaky this weekend`, TENSE: (n) => `${n} looks tense`, DISTRACTED: (n) => `${n} seems distracted`, HESITANT: (n) => `${n} has been hesitant in the fights` };
const FORM_LOW = new Set(['SHAKY', 'TENSE', 'DISTRACTED', 'HESITANT']);
/**
 * Lights out next (the build-up over): your form - on the stand-in banner, or the engineer's word about your state of
 * mind (a career) - and the two rivals nearest you on the grid who are not themselves this weekend
 * ("Norris is shaky this weekend; Piastri's flying.")
 */
function formBriefing() {
  const d = S.director, p = S.player, C = S.weekend?.career; if (!d || !p || S.spectating || d.mode !== 'race') return;
  if (p.standInFor) hud.msg(standInBanner(p, p.form?.label || null), 'warn', 6);
  engineer.time = d.time;   // (the radio's clock is the race's: nothing has ticked it since the last session)
  if (C && !p.standInFor) { const rec = C.drivers?.[p.careerId]; if (rec) engineer.say(moraleLine(moodOf(rec)), 1); }
  const order = d.positions?.length ? d.positions : S.cars, k = order.indexOf(p);
  if (k < 0) return;
  const near = order.filter((c) => c !== p && !c.retired && c.form?.label && FORM_SAY[c.form.label]).sort((a, b) => Math.abs(order.indexOf(a) - k) - Math.abs(order.indexOf(b) - k)).slice(0, 2);
  if (!near.length) return;
  const said = near.map((c) => FORM_SAY[c.form.label](c.name.split(' ').pop())), one = near.length === 1 ? (FORM_LOW.has(near[0].form.label) ? ' Put him under pressure early.' : ' Pick your battles with him.') : '';
  engineer.say(`${said.join('; ')}.${one}`, 1, 2);
}
/**
 * Compile every shader the session can need now, not the first time each thing comes into view (a first fire, a
 * wreck's debris, a far LOD level, a car's lights at night: each a stall of up to a second mid-race on a slow GPU).
 * Hidden objects are shown for the compile only.
 */
function precompile() {
  const hidden = []; scene.traverse((o) => { if (!o.visible && !o.isLight) { hidden.push(o); o.visible = true; } });
  const warm = prewarmParts(); scene.add(warm);   // (the materials a car only shows once it is hurt: a tyre coming apart)
  try {
    renderer.compile(scene, camera);
    // the crash camera's screen (renderFrame: a composer - every material drawn into its own target, untoned and linear,
    // is a second program): made and compiled at the first crash, it held the game up a second just as the car went
    // over; compiled now, and its blur and output passes drawn once
    const C = ensureCrashComposer(), prev = renderer.getRenderTarget();
    renderer.setRenderTarget(C.readBuffer); renderer.compile(scene, camera); renderer.setRenderTarget(prev);
    crashPass.uniforms.uBlur.value = 0; crashPass.uniforms.uSat.value = 1; C.render();
  } catch (e) { console.warn('precompile', e); }
  scene.remove(warm);
  for (const o of hidden) o.visible = false;
  // (the car model's textures on the GPU now, not the first time a car comes close)
  for (const t of Object.values(carModel()?.tex || {})) renderer.initTexture(t);
}

/**
 * Free practice (optional, before qualifying): the whole field out on its own laps for up to 25 minutes, no limit on
 * yours; END PRACTICE (Esc) whenever you like. Then back to the qualifying choice, on fresh cars.
 */
function runPractice() {
  const wk = S.weekend, wet = wk.wet;
  for (const c of wk.cars) if (!c.isPlayer) c.fitTyres(wet > 0.5 ? 'WET' : wet > 0.2 ? 'INTER' : Math.random() < 0.5 ? 'SOFT' : 'MEDIUM');
  makeDirector('quali', wk.cars, wk.player, { practice: true,
    onFinish: () => {
      const all = wk.cars.filter((c) => isFinite(c.bestLap)).sort((a, b) => a.bestLap - b.bestLap);
      wk.cars = buildField(wk.lapsTotal); wk.player = wk.cars.find((c) => c.isPlayer) || null; wk.practiced = true;
      let html = '<table class="res"><tr><th>#</th><th>Driver</th><th>Best lap</th><th>Gap</th></tr>';
      all.slice(0, 22).forEach((c, i) => { html += `<tr class="${c.isPlayer ? 'me' : ''}"><td>${i + 1}</td><td><span class="sw" style="background:${c.color}"></span>${c.name}</td><td>${fmtTime(c.bestLap)}</td><td>${i ? '+' + (c.bestLap - all[0].bestLap).toFixed(3) : ''}</td></tr>`; });
      endSession();
      $('quali-results').innerHTML = all.length ? html + '</table>' : '';
      $('quali-info').textContent = `Practice is over${all.some((c) => c.isPlayer) ? ` · you were P${all.findIndex((c) => c.isPlayer) + 1}` : ''}. Qualifying next: drive it, or simulate it.`;
      $('btn-practice').classList.add('hidden'); $('btn-quali-go').classList.remove('hidden'); $('btn-quali-sim').classList.remove('hidden'); $('btn-quali-done').classList.add('hidden');
      $('quali-panel').classList.remove('hidden');
    },
  });
}
function runQuali() {
  const wk = S.weekend, wet = wk.wet;
  for (const c of wk.cars) if (!c.isPlayer) c.fitTyres(wet > 0.5 ? 'WET' : wet > 0.2 ? 'INTER' : 'SOFT');   // (qualifying: the softest the weather allows)
  makeDirector('quali', wk.cars, wk.player, {
    onFinish: () => {
      const all = wk.cars.map((c) => ({ car: c, time: c.bestLap })).sort((a, b) => a.time - b.time);
      const pt = wk.player.bestLap, names = all.map((e) => e.car.name);
      if (wk.career) {
        wk.qTrophies = wk.career.recordQuali(all.map((e) => e.car.careerId));   // (poles, the head-to-head, the qualifying objective)
        // (kept with the career: leave now, and RACE goes straight to this grid)
        const C = wk.career; C.savedGrid = { season: C.season, round: C.round, ids: all.map((e) => e.car.careerId), times: all.map((e) => (isFinite(e.time) ? +e.time.toFixed(3) : null)) }; C.save();
      }
      // the race: fresh cars (nothing of qualifying carried over), lined up as they qualified
      wk.cars = buildField(wk.lapsTotal); wk.player = wk.cars.find((c) => c.isPlayer) || null;
      wk.gridOrder = names.map((n) => wk.cars.find((c) => c.name === n)).filter(Boolean);
      for (const c of wk.cars) if (!wk.gridOrder.includes(c)) wk.gridOrder.push(c);
      startFinale(all[0].car, 'POLE POSITION', () => {
        let html = '<table class="res"><tr><th>#</th><th>Driver</th><th>Time</th><th>Gap</th></tr>';
        all.forEach((e, i) => { html += `<tr class="${e.car.isPlayer ? 'me' : ''}"><td>${i + 1}</td><td><span class="sw" style="background:${e.car.color}"></span>${e.car.name}</td><td>${fmtTime(e.time)}</td><td>${i === 0 ? '' : isFinite(e.time) ? '+' + (e.time - all[0].time).toFixed(3) : 'no time'}</td></tr>`; });
        $('quali-results').innerHTML = html + '</table>';
        $('quali-info').textContent = isFinite(pt) ? `You qualified P${all.findIndex((e) => e.car.isPlayer) + 1}` : 'No time set · you start from the back';
        $('btn-quali-go').classList.add('hidden'); $('btn-practice').classList.add('hidden'); $('btn-quali-sim').classList.add('hidden'); $('btn-quali-done').classList.remove('hidden'); $('quali-panel').classList.remove('hidden');
        endSession();
      });
    },
  });
}

/**
 * Before the race: the strategy (ui/Strategy.js) - the plans for this race distance, its tyres and its pit lane; the
 * one you pick sets your starting tyre and the stops the engineer will call (strategyCalls). Then the race.
 */
function runRace() {
  const wk = S.weekend, p = wk.player;
  if (!p || S.noStrategy) { S.noStrategy = false; return beginRace(); }
  if (S.choosing) return; S.choosing = true;   // (one strategy screen: a second press of the button opens no second one)
  $('quali-panel').classList.add('hidden');
  const P = W.pit, pace = estimatePace(), L = W.track.length;
  const laneLen = P ? P.samples.length : 400, pitLoss = P ? Math.max(12, laneLen / P.limiter - laneLen / (L / pace) + 2.4 + 2.2) : 22;
  const gi = wk.gridOrder ? wk.gridOrder.indexOf(p) + 1 : 0;
  showStrategy({ laps: wk.lapsTotal, trackName: W.track.def.name, trackLength: L, pace, pitLoss, wet: wk.wet, night: W.time === 'night', field: wk.cars.filter((c) => c !== p).map((c) => c.tyres.compound), gridPos: gi > 0 ? gi : null,
    onDone: (plan) => {
      S.choosing = false;
      if (plan) { p.fitTyres(plan.stints[0].compound); p.strategy = { name: plan.name, label: plan.label, stints: plan.stints.map((s) => ({ ...s })), laps: plan.laps }; }
      beginRace();
    } });
}
/**
 * Your strategy in the race: a lap before each planned stop the engineer warns you; on the lap, it's box this lap -
 * the stop requested with the plan's next tyre already chosen (P stays out). Stopping early moves the plan on.
 */
function strategyCalls(d, p) {
  const st = p.strategy; if (!st || d.mode !== 'race' || !d.world.racing || p.autopilot || p.retired || p.finished) return;
  const k = Math.min(p.pitStops, st.stints.length - 1); if (k >= st.stints.length - 1) return;
  const cur = st.stints[k], next = st.stints[k + 1], lapNow = p.lap + 1, nm = next.compound.toLowerCase();
  if (lapNow === cur.end - 1 && st.warned !== k) { st.warned = k; engineer.say(`Plan ${st.name} is on. Box next lap for ${nm}s.`, 2); }
  if (lapNow >= cur.end && st.called !== k && !p.pitRequested && !p.pitLane && !p.inPit) {
    st.called = k; p.pitPlan = { compound: next.compound, repair: (p.dmg.fwL > 0.3 || p.dmg.fwR > 0.3) ? 'wing' : 'none' }; d.requestPit(p);
    hud.msg(`BOX THIS LAP · ${next.compound}\nP TO STAY OUT`, 'warn', 4);
    engineer.say(`Box this lap, box this lap. ${nm.charAt(0).toUpperCase() + nm.slice(1)}s.`, 3);
  }
}
function beginRace() {
  const wk = S.weekend;
  makeDirector('race', wk.cars, wk.player, {
    gridOrder: wk.gridOrder, spectate: wk.spectate,
    onFinish: (rows) => {
      // a race stopped by an accident and not resumed: points by how much of it was run (the FIA's scale for a shortened
      // race - none under two laps; 6-4-3-2-1 to a quarter; to half; to three-quarters; full beyond)
      const led = Math.max(0, ...rows.map((r) => r.car.lap)), frac = led / Math.max(1, wk.lapsTotal);
      const short = NEWS.abandoned || NEWS.cancelled;
      const table = !short || frac > 0.75 ? POINTS : led < 2 ? [] : frac <= 0.25 ? [6, 4, 3, 2, 1] : frac <= 0.5 ? [13, 10, 8, 6, 5, 4, 3, 2, 1] : [19, 14, 12, 9, 8, 6, 5, 3, 2, 1];
      wk.pointsNote = short ? (table === POINTS ? 'full points' : !table.length ? 'no points: under two laps run' : 'reduced points') : null;
      rows.forEach((r) => { r.pts = r.car.retired ? 0 : (table[r.pos - 1] || 0); wk.points.set(r.name, { name: r.name, color: r.color, points: (wk.points.get(r.name)?.points || 0) + r.pts, me: r.me }); });
      const champ = wk.mode === 'champ' ? [...wk.points.values()].sort((a, b) => b.points - a.points) : null;
      const me = rows.find((r) => r.me);
      const facts = NEWS.cancelled ? null : raceFacts(S.director, rows);   // (Driver of the Day and the race in numbers; not for a race stopped by a death - first: the career wants the fans' vote)
      wk.banNote = null;
      if (wk.career) {
        // (the career: points, starts, money, development, Paddock Rapport, morale, the press, the licence, the next round
        //  - and the interview after)
        const C = wk.career, pc = me?.car, crashed = (c) => !!c && (c.injured || (c.retired && /accident/i.test(c.retireReason || '')));
        const contacts = [...(S.contacts || new Map()).entries()].filter(([o]) => o.careerId).map(([o, k]) => ({ id: o.careerId, sev: k.sev, crash: crashed(o) || (crashed(pc) && k.sev >= 0.5) }));
        const up = C.team.lastNew, upgrade = up && up.round === C.round - 1 ? upgradeName(up.id, up.level) : null;
        // (a race that hurt someone, or was stopped, or the grid's memorial weekend for a life lost - read while C.round is
        //  still this race, as applyRace and the loader read it: grave - nothing from the press, no story off the track; A1)
        const memorial = !!C._lostNow?.(), bw = wk.brawl;
        // (fought: the driver you squared up to on the grid - a real scuffle, not a shove you walked away from - over
        //  anyone you only touched on track; Career keeps it for a live round only)
        const extra = { dotd: !!facts?.dotd?.[0]?.me, overtakes: pc?.overtakes || 0, grave: !!(NEWS.abandoned || NEWS.cancelled || S.cars.some((c) => c.injured) || memorial), hurtIds: S.cars.filter((c) => c.injured && c.careerId).map((c) => c.careerId),
          fought: bw && !bw.aborted && !bw.walkedAway ? bw.did || bw.id || null : null,
          // (your car touched the Wall of Champions today - Montreal's last chicane: the season remembers it)
          woc: !!pc?.wocKiss && !pc.standInFor };
        // (who of yours was here this weekend, as the race leaves it - asked about in the pen; before the round moves on)
        let seen = []; if (!extra.grave) try { seen = Celebs.seeingAtRace(C); } catch (e) { console.warn('[career] celebs', e); }
        C.applyRace(rows, W.def.id, contacts, table, extra);
        wk.interview = C.me?.alive && pc && !pc.injured && !pc.standInFor ? interviewCtx(C, rows, contacts, upgrade, { grave: extra.grave, seen }) : null;   // (standing in: the stand-in's media pen, not yours)   // (hurt: in the medical centre, not the media pen)
        wk.incident = S.cars.some((c) => c.injured);   // (the interview after it: under the strings)
      } else {
        rememberResult(rows, me);   // (for the loading screen's news)
        // (your licence, a quick race's: the stewards' points from this race - none for one you sat out on a ban - then
        //  the race counts: points age, a ban served comes off)
        const pcar = me?.car;
        if (pcar && pcar.outWhy !== 'ban') for (const e of pcar.ppLog || me.ppLog || []) { try { if (quickAddPoints(e.pts, e.reason, W.def.id).banned) wk.banNote = `NEXT RACE: SUSPENDED (${LICENCE_MAX} PENALTY POINTS)`; } catch (err) { console.warn('[licence]', err); } }
        try { quickRaceDone(); } catch (err) { console.warn('[licence]', err); }
      }
      input.enabled = false;
      const winner = rows.find((r) => !r.car.retired) || rows[0];
      const results = () => {
        hud.results(`${wk.mode === 'champ' ? `ROUND ${wk.round}/${wk.rounds} · ` : ''}${NEWS.cancelled ? 'RACE CANCELLED' : NEWS.abandoned ? 'RACE ABANDONED' : 'RACE RESULT'}${wk.pointsNote ? ` (${wk.pointsNote})` : ''} · ${me ? `P${me.pos}` : ''}${me && me.penalties ? ` (+${me.penalties}s penalties)` : ''}${wk.banNote ? ` · ${wk.banNote}` : ''}`, rows, champ, facts);
        $('btn-next').firstChild.textContent = wk.career ? 'CAREER' : wk.mode === 'champ' && wk.round < wk.rounds ? 'NEXT ROUND' : 'MAIN MENU';
        $('btn-menu').textContent = wk.career ? 'CAREER MENU' : 'MAIN MENU';
      };
      if (NEWS.abandoned) { NEWS.results = results; return; }   // (abandoned after an accident: the news and the memorial first)
      // the podium, for a race run to the flag: the top three on the steps, the champagne - then the results
      const top = rows.filter((r) => !r.car.retired && r.car.finished).slice(0, 3).map((r) => ({ name: r.car.name, team: r.car.team, color: r.car.color, color2: r.car.color2, number: r.car.number }));
      const podium = () => (top.length >= 3 ? showPodium(top, { track: W.track.def.name.replace(/ (Strip )?Circuit$/, ''), night: W.time === 'night', audio }, results) : results());
      startFinale(winner.car, 'RACE WINNER', podium);
    },
  });
  if (S.director && !S.spectating) {
    if (S.skipIntro || (settings.intro === 'skip' && !S.weekend?.career)) { input.enabled = true; hud.show(); camCtl.mode = 'tcam'; if (S.player) for (let i = 0; i < 30; i++) camCtl.update(S.player, 1 / 30, W.track); }   // (straight to the grid and the lights)
    else startPreRace();   // (the build-up first: the race waits on the grid)
  }
}

/**
 * The race in numbers, for the results: Driver of the Day (the fans' vote - drives through the field, overtakes, a
 * car punching above its weight, the win, the fastest lap - with the luck of a vote), the fastest lap, the biggest
 * climber, the most overtakes, the stops, the neutralisations and who did not finish.
 */
function raceFacts(d, rows) {
  if (!d || d.mode !== 'race') return null;
  const fin = rows.filter((r) => !r.car.retired), fl = rows.filter((r) => isFinite(r.car.bestLap)).sort((a, b) => a.car.bestLap - b.car.bestLap)[0];
  const gain = (r) => (r.car.gridPos || r.pos) - r.pos;
  const score = (r) => (r.car.retired ? -6 : 0) + 2.2 * gain(r) + 1.4 * (r.car.overtakes || 0) + 7 * (1 - (r.car.rating ?? 0.9)) * Math.max(0, 12 - r.pos) / 6 + (r.pos === 1 ? 5 : r.pos <= 3 ? 2 : 0) + (r === fl ? 2 : 0) + Math.random() * 3;
  const ranked = rows.map((r) => ({ r, s: score(r) })).sort((a, b) => b.s - a.s).slice(0, 5);
  const w = ranked.map((x) => Math.exp((x.s - ranked[0].s) / 3)), W = w.reduce((a, b) => a + b, 0);
  const dotd = ranked.map((x, i) => ({ name: x.r.name, color: x.r.color, me: x.r.me, pct: Math.round(100 * w[i] / W), why: gain(x.r) > 2 ? `P${x.r.car.gridPos} to P${x.r.pos}` : x.r.pos === 1 ? 'the win' : (x.r.car.overtakes || 0) >= 3 ? `${x.r.car.overtakes} overtakes` : `P${x.r.pos}` }));
  const climber = [...fin].sort((a, b) => gain(b) - gain(a))[0], passer = [...rows].sort((a, b) => (b.car.overtakes || 0) - (a.car.overtakes || 0))[0];
  const flLap = fl ? fl.car.lapTimes.indexOf(fl.car.bestLap) + 1 : 0;
  const out = [];
  if (fl) out.push(['FASTEST LAP', `${fl.name.split(' ').pop()} · ${fmtTime(fl.car.bestLap)}${flLap ? ` · lap ${flLap}` : ''}`, fl.color]);
  if (climber && gain(climber) > 0) out.push(['BIGGEST CLIMBER', `${climber.name.split(' ').pop()} · P${climber.car.gridPos} → P${climber.pos} (+${gain(climber)})`, climber.color]);
  if (passer && passer.car.overtakes) out.push(['MOST OVERTAKES', `${passer.name.split(' ').pop()} · ${passer.car.overtakes}`, passer.color]);
  const total = rows.reduce((a, r) => a + (r.car.overtakes || 0), 0), stops = rows.reduce((a, r) => a + r.stops, 0);
  out.push(['ON-TRACK OVERTAKES', String(total)], ['PIT STOPS', String(stops)]);
  // the crew's award: the quickest clean stop (no penalty served, no wing changed), stationary time
  const fs = (d.stops || []).filter((s) => s.clean).sort((a, b) => a.t - b.t)[0];
  if (fs) out.splice(out.length - 1, 0, ['FASTEST PIT STOP', `${fs.c.team} · ${fs.t.toFixed(2)}s (${fs.c.name.split(' ').pop()}, lap ${fs.lap})`, fs.c.color]);
  const n = d.sc?.count || { sc: 0, vsc: 0 }, red = d.sc?.redCount || 0;
  out.push(['NEUTRALISATIONS', [n.sc && `${n.sc} safety car${n.sc > 1 ? 's' : ''}`, n.vsc && `${n.vsc} VSC`, red && `${red} red flag${red > 1 ? 's' : ''}`].filter(Boolean).join(' · ') || 'none']);
  const dnf = rows.filter((r) => r.car.retired);
  out.push(['DID NOT FINISH', dnf.length ? dnf.map((r) => r.name.split(' ').pop()).join(', ') : 'everyone finished']);
  return { dotd, facts: out };
}

// ---------------------------------------------------------------------------
// the rest of a session: once your run is over (your qualifying laps, the flag, out of the race) the session goes on
// with every other car on its real laps - watch it (Tab: the next car, Enter: x6) or simulate it to the end (F); the
// results are what the cars actually did, never a list of made-up times
// ---------------------------------------------------------------------------
/** contact between your car and another: the hardest one with each driver (closing speed m/s -> 0..1.5) */
function noteContact(a, b, v) {
  if (v < 1.5 || !S.contacts) return;   // (a brush)
  const o = a.isPlayer ? b : a, me = a.isPlayer ? a : b; if (o.isPlayer || me.autopilot) return;   // (not once the AI drives your car home)
  const k = S.contacts.get(o) || { sev: 0, n: 0 }; k.sev = Math.max(k.sev, Math.min(1.5, v / 20)); k.n++; S.contacts.set(o, k);
}
function watchSession(c) {
  const d = S.director; if (!d || d.done) return;
  if (NEWS.cancel?.hurt.includes(c)) return;   // (you were the one lost: the camera stays at the scene)
  endCrash(); S.spectating = true; S.ff = false;
  S.player = c.retired ? (d.positions.find((x) => !x.retired && x !== c) || c) : c;
  hud.msg(`${d.mode === 'quali' ? 'YOUR LAPS ARE DONE' : c.retired ? 'OUT OF THE RACE' : 'CHEQUERED FLAG'} · THE SESSION GOES ON\nTab: next car · Enter: ×6 · F: simulate to the end`, '', 6);
}
function watchNext() {
  const d = S.director, live = d.positions.filter((x) => !x.retired && !x.parked); if (!live.length) return;
  S.player = live[(live.indexOf(S.player) + 1) % live.length]; endCrash();
  hud.msg(`WATCHING ${S.player.name.toUpperCase()} · P${d.positions.indexOf(S.player) + 1}`, '', 1.6);
}
let simEl = null;
/** F: the rest of the session from the race model (RaceDirector.simulateRest) - a moment, not a fast-forward */
function simToEnd() {
  const d = S.director; if (!d || d.done || S.simming || NEWS.cancel) return;
  if (d.player && !d.player.autopilot) d.handOver();
  S.simming = true; endCrash();
  if (!simEl) { simEl = document.createElement('div'); simEl.style.cssText = 'position:fixed;inset:0;z-index:48;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:rgba(4,6,10,.72);color:#eef1f5;font:600 14px/1.4 "Segoe UI",Arial,sans-serif;letter-spacing:.2em;text-align:center;transition:opacity .3s'; document.body.appendChild(simEl); }
  simEl.innerHTML = `SIMULATING THE REST OF THE ${d.mode === 'quali' ? 'SESSION' : 'RACE'}<small style="color:#9aa4b2;letter-spacing:.1em">every car from where it is now</small>`;
  simEl.style.display = 'flex'; simEl.style.opacity = '1';
  setTimeout(() => {
    if (S.director === d && !d.done) d.simulateRest();
    S.simming = false; simEl.style.opacity = '0'; setTimeout(() => { simEl.style.display = 'none'; }, 300);
  }, 450);   // (a beat for the card to show)
}
/**
 * Tonight's invitations as the media pen knows them (career/Party.js: applyRace has made them by now) -> { team, club,
 * city, lean: null } | null (no night on). A winner is asked how he will celebrate; the answer's lean ('team' | 'club' |
 * 'hotel') is kept on the race's snapshot (c.party.race.lean) for the TONIGHT sheet (ui/PartyCards.js).
 */
function tonightCtx(C) {
  try {
    const L = typeof Party.partyOffers === 'function' ? Party.partyOffers(C) || [] : [];
    if (!L.length) return null;
    return { team: L.some((x) => x.host === 'team' && x.ok !== false), club: L.some((x) => x.host === 'club' && x.ok !== false), city: C.party?.race?.city || null, lean: null };
  } catch (e) { console.warn('[interview] tonight', e); return null; }
}
/**
 * The post-race interview's material (ui/Interview.js): your day, your team-mate, contacts, the championship - and off
 * the track: the scuffle on the grid (S.weekend.brawl, from the walk), a woman you are seeing who was here (o.seen:
 * Celebs.seeingAtRace before the round moved on), a licence near a ban, the night ahead (tonightCtx). o.grave: a race
 * that hurt someone (no press). Called after applyRace: C.round is the next race.
 */
function interviewCtx(C, rows, contacts, upgrade, o = {}) {
  const D = (id) => (id && C.drivers[id] ? { id, name: C.drivers[id].name } : null);
  const B = S.weekend?.brawl, bd = B && !B.aborted ? D(B.did || B.id) : null;
  const pid = (o.seen || []).find((id) => Celebs.CELEB?.[id]), pb = pid ? Celebs.bondOf(C, pid) : null, pn = pid ? Celebs.CELEB[pid].name : '';
  const pts = activePoints(C, C.playerId), ban = banText(C, C.playerId), nextId = C.round <= C.rounds ? C.calendar?.[C.round - 1] : null;
  const off = {
    grave: !!o.grave,
    brawl: bd ? { d: bd, result: B.result || 'even', started: B.started !== false, escalated: !!B.escalated, walkedAway: !!B.walkedAway } : null,
    partner: pid && pb && !pb.grieving ? { id: pid, name: pn, first: pn.split(' ')[0], public: !!pb.public, secret: !!pb.secret } : null,
    points: ban || pts >= 8 ? { n: pts, ban: !!ban, next: nextId ? TRACKS[nextId]?.name.replace(/ (Strip )?Circuit$/, '') : null, max: LICENCE_MAX } : null,
    tonight: o.grave ? null : tonightCtx(C),
  };
  const meRow = rows.find((r) => r.car.careerId === C.playerId), idx = rows.indexOf(meRow), tm = C.teammate();
  const st = C.driverStandings().filter((d) => d.alive), mi = st.findIndex((d) => d.id === C.playerId);
  const tmRow = tm ? rows.findIndex((r) => r.car.careerId === tm.id) : -1;
  const pc = meRow?.car;
  return {
    me: D(C.playerId), teammate: tm ? D(tm.id) : null, pos: meRow?.pos ?? rows.length, retired: !!pc?.retired,
    crashed: !!pc && (pc.wreck || (pc.retired && /accident/i.test(pc.retireReason || ''))), track: W.track.def.name,
    winner: rows[0] && rows[0] !== meRow ? D(rows[0].car.careerId) : null, ahead: idx > 0 ? D(rows[idx - 1].car.careerId) : null,
    contacts: contacts.map((k) => ({ d: D(k.id), sev: k.sev, crash: k.crash })).filter((k) => k.d).sort((a, b) => b.sev - a.sev),
    leader: mi > 0 ? D(st[0].id) : null, champGap: mi > 0 ? st[0].points - st[mi].points : 0, leading: mi === 0 && st[0].points > 0,
    nearest: [st[mi - 1], st[mi + 1], st[mi - 2], st[mi + 2]].filter((d) => d && mi >= 0).map((d) => D(d.id)),
    grid: rows.map((r) => r.car.careerId).filter((id) => id && id !== C.playerId).map(D).filter(Boolean),
    juniors: Object.values(C.drivers).filter((d) => d.alive && !d.team && (d.from === 'F2' || d.from === 'Junior')).map((d) => D(d.id)),
    hostile: Object.entries(C.rapport).filter(([id, v]) => v <= -25 && C.drivers[id]?.alive && C.drivers[id].team).map(([id]) => D(id)),
    upgrade, tmAhead: tmRow >= 0 && idx >= 0 && tmRow < idx,
    // (the hurt and the lost of this race - their team-mates to answer to - and your kit for the pen)
    hurt: rows.map((r) => r.car).filter((c) => c.injured && c.careerId && c.careerId !== C.playerId).map((c) => {
      const mate = rows.map((r) => r.car).find((o) => o !== c && o.team === c.team && o.careerId && o.careerId !== C.playerId);
      return { d: D(c.careerId), dead: decideFate(c) === 'killed', contact: contacts.some((k) => k.id === c.careerId), mate: mate ? D(mate.careerId) : null };
    }).filter((h) => h.d),
    look: { team: C.team.name, color: C.team.color, color2: C.team.color2, driver: C.me?.name, helmet: C.me?.helmet, number: C.me?.number },
    ...off,
  };
}
/**
 * What you said in the media pen about the woman you were seen with (the partner question): 'confirm' - you are
 * together (official, if the two of you are ready for it; if not, she hears it from the papers first), 'private' - a
 * private person is glad of it, 'deny' - 'just friends' protects a secret and stings anything that was not one ->
 * her affection's change (for the interview's chip). Celebs.js applies it all; after applyRace (C.round: the next race).
 */
function lifeAnswer(C, id, kind) {
  const K = Celebs.CELEB?.[id]; if (!C || !K) return 0;
  try {
    const b = Celebs.bondOf(C, id), T = K.traits || {}, f = K.name.split(' ')[0], others = Celebs.seeing(C).some((x) => x !== id);
    if (kind === 'confirm') {
      if (b.public) { Celebs.trustCeleb(C, id, 2); return Celebs.relateCeleb(C, id, 3, `You spoke warmly about ${f} in the media pen`); }
      if (b.secret) Celebs.setSecret(C, id, false);
      if (!Celebs.officialWhy(C, id)) { const r = Celebs.makeOfficial(C, id); if (r?.ok) { C.award?.({}); return Celebs.relateCeleb(C, id, 2, ''); } }
      // (not official yet: she reads it in the papers first - and so does anyone else you are seeing)
      if (others) Celebs.exposure(C, 'tipoff', [id], 1.2);
      const shy = (T.privacy || 0) >= 0.6;
      return Celebs.relateCeleb(C, id, shy ? -5 : 2, shy ? `${f} did not want it in the papers yet` : `${f} did not mind you saying it`);
    }
    if (kind === 'private') { if ((T.privacy || 0) >= 0.5 || b.secret) Celebs.trustCeleb(C, id, 3); return Celebs.relateCeleb(C, id, 1, ''); }
    if (kind === 'deny') {
      if (b.secret) { Celebs.trustCeleb(C, id, 1); return 0; }
      Celebs.trustCeleb(C, id, -6); return Celebs.relateCeleb(C, id, -5, `You told the press you and ${f} are just friends`);
    }
  } catch (e) { console.warn('[interview] life', e); }
  return 0;
}

function runTimeTrial() {
  const wk = S.weekend; wk.cars = buildField(wk.lapsTotal).filter((c) => c.isPlayer); wk.player = wk.cars[0];
  makeDirector('tt', wk.cars, wk.player, { onFinish: () => {} });
  hud.msg('TIME TRIAL · Esc to finish', '', 3);
}
// ---------------------------------------------------------------------------
// the news (ui/NewsBroadcast.js): after a race in which a driver was badly hurt, a TV news broadcast over the circuit
// as the race left it - the phone footage of the accident, the headlines, the prayers, a moment of silence - before
// the memorial card
// ---------------------------------------------------------------------------
/** the pre-race show (ui/PreRace.js): on while it plays, the race held on the grid */
const PRE = { on: false, show: null, walk: null };
const pitTiming = new PitTiming();   // (your stop: the pull-in to time, the pit light)
const NEWS = { on: false, cut: null, wait: 0, fading: false, abandoned: false, results: null, cancel: null, cancelled: false };
/**
 * What became of a driver hurt in an accident: in a career your own driver does not survive it (perma-death); anyone
 * else nearly always does - injured, out for a while - and dies only rarely, more likely the harder the impact.
 */
function decideFate(c) {
  if (c.fate) return c.fate;
  // the same for every driver, you included: the worse the accident, the less likely an injury and the more likely a
  // death (crashSeverity). Hurt: out for one to three rounds by how bad it was; killed: gone for good.
  const sev = crashSeverity(c), pDeath = 1 / (1 + Math.exp(-(sev - 97) / 10));
  c._sev = sev; c._pDeath = pDeath;
  c.fate = Math.random() < pDeath ? 'killed' : 'injured';
  if (c.fate === 'injured') c._out = sev < 45 ? 1 : sev < 72 ? 2 : 3;
  return c.fate;
}
/**
 * How bad an accident was, for the driver: the hardest pulse (g) first, then what makes the same g worse - the car torn
 * in two (the survival cell's integrity), fire, the car airborne or rolled, and how much speed went in that one hit
 * (from 220 km/h of it). On the death curve (decideFate: 50 % at 97), for a driver hurt at all (RaceDirector.injuries
 * - itself rare below ~45 g): a 29 g crash practically never kills (~0.1 %); a 51 g hit at the end of a 290 km/h
 * run-off (Silverstone 2021) about 2 % if hurt (~0.5 % in all); a 67 g hit that splits the car and sets it on fire
 * (Bahrain 2020) about 3 in 10 if hurt (~1 in 5 in all); 300 mph into a wall and nothing in between nearly always.
 */
function crashSeverity(c) {
  const dvKmh = (c.peakDv || 0) * 3.6;
  return (c.peakG || 0) + (c.split ? 12 : 0) + (c._burned ? 10 : 0) + (c._flew ? 6 : 0) + 0.1 * Math.max(0, dvKmh - 220);
}
/**
 * The long strings (assets/audio/strings.mp3) for everything after an incident: the drive back to the pits when a race
 * is cancelled, the memorial cards, the results and the interview after it, the career's In Memoriam. One at a time.
 */
const MUSIC = { strings: null };
function strings(on, o = {}) {
  if (on) {
    if (MUSIC.strings) return;
    audio.init(); audio.resume();
    MUSIC.strings = audio.music?.('strings', { gain: o.gain ?? 0.5, loop: true, offset: o.offset ?? 20 + Math.random() * 200, fadeIn: o.fadeIn ?? 3 }) || null;
  } else if (MUSIC.strings) { MUSIC.strings.stop(o.fade ?? 2.5); MUSIC.strings = null; }
}
/**
 * An accident has hurt a driver: straight away (a moment for the rest of the accident to play out), the screen fades
 * to black, the race is abandoned where it stands, and the news takes over - then the memorial, then the results. A
 * life lost is more: the race is cancelled first, and everyone brought back to the pits (beginCancel) before the news.
 */
function crashNews() {
  const d = S.director, hurt = S.cars.filter((c) => c.injured && !c._newsShown && !c.standInFor);
  if (!hurt.length) return;
  for (const c of hurt) decideFate(c);
  for (const c of hurt) { c._newsShown = true; if (!c.injuryClip && d.replay) c.injuryClip = d.replay.clip(c); }
  NEWS.wait = 0;
  if (NEWS.cancel) { NEWS.cancel.hurt.push(...hurt); return; }   // (hurt in the same accident, or on the way back: in the same news)
  if (d.mode === 'race' && hurt.some((c) => c.fate === 'killed')) { beginCancel(hurt); return; }
  newsNow(hurt);
}
/**
 * A life lost: red flag, RACE CANCELLED. No restart - every car comes slowly into the pit lane and stays at its garage.
 * You drive yours back to the strings (from the start of the piece), and the news begins once you are in the pit lane
 * (or, when your car cannot drive - you were in it - after a while at the scene).
 */
function beginCancel(hurt) {
  const d = S.director, p = d.player, mine = hurt.includes(p) && p.fate === 'killed';   // (you, killed - not hurt: through your eyes)
  NEWS.cancel = { hurt, t: 0, pitT: null }; NEWS.cancelled = true;
  d.cancelRace(); endFlashbackIfOpen();
  hud.msg('RED FLAG · RACE CANCELLED\nReturn to the pit lane', 'bad', 9);
  if (!mine && d.engineer) {
    engineer.queue = []; engineer.say("Red flag. The race will not be restarted. Bring it back to the pit lane, slowly. ... Just bring it home.", 5);
    setTimeout(() => { if (S.director === d) d.engineer = null; }, 9000);   // (no more race chatter)
  }
  strings(true, { offset: 0, fadeIn: 6, gain: 0.55 });
  if (mine) povStart(p);   // (you were in it: through your own eyes)
}
// ---------------------------------------------------------------------------
// through the visor: the cockpit view framed by the helmet's eye-port (your own car's halo no longer drawn as bars
// across it), and - when your driver is lost - the last twelve seconds through their eyes
// ---------------------------------------------------------------------------
let visorEl = null;
function visor() {
  if (visorEl) return visorEl;
  const st = document.createElement('style'); st.textContent = `
#visor { position: fixed; inset: 0; pointer-events: none; display: none; overflow: hidden; }
#visor > div { position: absolute; inset: 0; }
#visor .port { left: 50%; top: 47%; right: auto; bottom: auto; width: 132vw; height: 78vh; transform: translate(-50%, -50%); border-radius: 50% / 46%; box-shadow: 0 0 0 100vmax #060607, inset 0 0 7vh 3vh rgba(0,0,0,.85); }
#visor .tint { background: linear-gradient(180deg, rgba(10,14,22,.38), rgba(10,14,22,0) 32%, rgba(0,0,0,0) 78%, rgba(10,14,22,.22)); }
#visor .glint { left: 9%; top: 19%; right: auto; bottom: auto; width: 32%; height: 3px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent); transform: rotate(-4deg); filter: blur(1px); }
#visor .fire { background: radial-gradient(120% 75% at 50% 112%, rgba(255,110,30,.6), rgba(255,60,0,0) 62%); opacity: 0; mix-blend-mode: screen; }
#visor .fog { top: auto; height: 42%; background: linear-gradient(0deg, rgba(225,228,232,.32), rgba(225,228,232,0)); opacity: 0; filter: blur(10px); }
#visor .tunnel { background: radial-gradient(circle at 50% 48%, rgba(0,0,0,0) 28%, #000 82%); opacity: 0; }
#visor .black { background: #000; opacity: 0; }
#visor.dying { pointer-events: auto; cursor: none; z-index: 30; }
#visor.dying .port { width: 116vw; height: 60vh; }`;
  document.head.appendChild(st);
  visorEl = document.createElement('div'); visorEl.id = 'visor';
  visorEl.innerHTML = '<div class="tint"></div><div class="fire"></div><div class="fog"></div><div class="glint"></div><div class="tunnel"></div><div class="port"></div><div class="black"></div>';
  canvas.after(visorEl);   // (right over the 3D view, under the HUD: the dash and the timing stay readable)
  return visorEl;
}
/** the cockpit view, every frame: the eye-port round it, your car's halo out of the way of the lens */
function cockpitVisor(p, on) {
  if (POV.on) return;
  const v = visor(); v.className = ''; v.style.display = on ? 'block' : 'none';
  const m = p && S.meshes.get(p); if (m) m.halo.visible = S.halo && !on;
}
const POV = { on: false, T: 12 };
const POVV = new THREE.Vector3(), POVO = new THREE.Vector3(), POVQ = new THREE.Quaternion(), POVQ2 = new THREE.Quaternion(), POVE = new THREE.Euler(0, 0, 0, 'YXZ');
const POVY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
/**
 * Your driver lost: no drone over the wreck - the camera goes inside the helmet. First the accident again, through
 * their eyes: the car whole and at speed, then each hit - the head thrown about, the world blacking out for an
 * instant, the crunch, debris and parts torn away as they were - slowed through the worst of it, until it comes to
 * rest (povReplay). Then twelve seconds in the wreck: the head heavy and lolling in the cockpit, consciousness coming
 * and going in waves of black, the heartbeat slowing, the fire spreading from the engine forward over the car and the
 * light of it growing in the visor, until there is only black. The mouse (locked to the view) moves the head, a
 * little, slowly.
 */
function povStart(p) {
  const m = S.meshes.get(p); if (!m) return false;
  endCrash(); hud.hide(); $('hud').classList.add('hidden'); input.enabled = false; if (RL.group) RL.group.visible = false;
  Object.assign(POV, { on: true, t: 0, car: p, m, look: { x: 0, y: 0, tx: 0, ty: 0 }, beat: 0.5, fires: [], near: camera.near, fov: camera.fov });
  m.helmet.visible = false; m.halo.visible = false;
  camera.near = 0.04; camera.fov = 72; camera.updateProjectionMatrix();
  POV.light = new THREE.PointLight(0xff7a2a, 0, 10, 2); scene.add(POV.light);
  const v = visor(); v.className = 'dying'; v.style.display = 'block';
  POV.els = Object.fromEntries(['black', 'tunnel', 'fire', 'fog'].map((k) => [k, v.querySelector('.' + k)]));
  const lock = () => { try { const r = v.requestPointerLock?.(); r?.catch?.(() => {}); } catch (e) { /* needs a click */ } };
  lock(); v.onclick = lock;   // (the browser may want a click first: until then the cursor position steers the head)
  POV.onMove = (e) => {
    const L = POV.look;
    if (document.pointerLockElement === v) { L.tx += e.movementX * 0.0016; L.ty += e.movementY * 0.0016; }
    else { L.tx = (e.clientX / innerWidth - 0.5) * 0.7; L.ty = (e.clientY / innerHeight - 0.5) * 0.5; }
    L.tx = Math.max(-0.38, Math.min(0.38, L.tx)); L.ty = Math.max(-0.22, Math.min(0.3, L.ty));
  };
  window.addEventListener('mousemove', POV.onMove);
  // the accident again first, from the replay (a whole car for every one in it, the real ones out of sight meanwhile)
  const C = p.injuryClip, j = C ? C.cars.indexOf(p) : -1;
  if (C && j >= 0 && C.frames.length > 8 && C.pulses) {
    const imp = (C.impact?.k ?? 0) / C.hz;
    const Rp = POV.rep = { C, j, imp, tau: Math.max(0, imp - 3.2), t1: (C.frames.length - 1) / C.hz, reps: new Map(), lastK: -1, shake: 0, flash: 0, fires: new Map() };
    Rp.lastK = Math.floor(Rp.tau * C.hz);
    for (const c of C.cars) {
      const R = new CarMesh(c.color, c.tyres.compound, { color2: c.color2, team: c.team, livery: c.livery, helmet: c.helmet, driver: c.name, number: c.number, glove: People.lookOf(c.name).suit?.secondary, tcamColor: c.number % 2 ? 0xffd400 : 0x111111 });
      scene.add(R.group); Rp.reps.set(c, R); c._povHide = true; S.meshes.get(c)?.showPieces(false);
      Rp.peak = Math.max(1, ...C.pulses.map((pp) => pp[j] || 0));
    }
    fire.clear(); debris.clear(); fire.paused = true;   // (the real cars' pieces and halves out of sight meanwhile: showPieces)
    POV.m = Rp.reps.get(p); POV.m.helmet.visible = false; POV.m.halo.visible = false;
  }
  return true;
}
/** the accident again, through the driver's eyes (POV.rep): until the car comes to rest, then the wreck (povFrame) */
function povReplay(dt) {
  const P = POV, Rp = P.rep, C = Rp.C;
  Rp.tau += dt * (Math.abs(Rp.tau - Rp.imp) < 0.8 ? 0.4 : 1);   // (slowed through the worst of it)
  if (Rp.tau >= Rp.t1) { povReplayEnd(); return; }
  const u = Rp.tau * C.hz, k = Math.min(C.frames.length - 2, Math.floor(u)), a = u - k, A = C.frames[k], B = C.frames[k + 1];
  C.cars.forEach((c, jj) => {
    const R = Rp.reps.get(c), o = jj * 7;
    R.group.position.set(A[o] + (B[o] - A[o]) * a, A[o + 1] + (B[o + 1] - A[o + 1]) * a, A[o + 2] + (B[o + 2] - A[o + 2]) * a);
    R.group.quaternion.set(A[o + 3], A[o + 4], A[o + 5], A[o + 6]).slerp(POVQ2.set(B[o + 3], B[o + 4], B[o + 5], B[o + 6]), a);
    R.replay(c, C.t0 + Rp.tau);   // (its dents, the parts it had lost, its pieces in the air: as they were then)
  });
  // the hits as they came: debris and sparks, the parts torn off as the real cars lost them, the fire if one burned;
  // your own: the head thrown, the picture gone for an instant, the crunch
  for (let f = Rp.lastK + 1; f <= k; f++) C.cars.forEach((c, jj) => {
    const g = C.pulses[f]?.[jj] || 0; if (g < 6) return;
    const F0 = C.frames[f], F1 = C.frames[Math.max(0, f - 1)], o = jj * 7, x = F0[o], y = F0[o + 1], z = F0[o + 2], vx = (F0[o] - F1[o]) * C.hz, vz = (F0[o + 2] - F1[o + 2]) * C.hz;
    const R = Rp.reps.get(c), col = R.livery.color.getHex();
    debris.burst(x, z, vx, vz, Math.min(18, 2 + Math.round(g / 3)), col); fire.sparks(x, y + 0.3, z, Math.min(70, Math.round(g * 1.6)), vx, vz);
    if (g >= 18 && !Rp.fires.has(c) && (c._burned || g >= 45)) { const e = fire.add((out) => { if (!R.group.parent) return false; R.body.localToWorld(out.set(-1.3, 0.55, 0)); return true; }, 'fire', 0.5, () => false); e.replay = true; Rp.fires.set(c, e); }
    if (jj === Rp.j) { Rp.shake = Math.max(Rp.shake, Math.min(1, g / 35)); if (g >= 22) Rp.flash = Math.max(Rp.flash, Math.min(0.95, g / 50)); audio.crunch?.(Math.min(1, g / 30)); }
  });
  Rp.lastK = k;
  for (const e of Rp.fires.values()) e.k = Math.min(1.4, e.k + dt * 0.4);
  // the eyes, in the whole car's helmet - thrown about by the hits
  const m = P.m; m.group.updateMatrixWorld(true);
  Rp.shake = Math.max(0, Rp.shake - dt * 1.4); Rp.flash = Math.max(0, Rp.flash - dt * 2.2);
  const sh = Rp.shake, L = P.look, rn = () => Math.random() - 0.5; L.x += (L.tx - L.x) * Math.min(1, dt * 2); L.y += (L.ty - L.y) * Math.min(1, dt * 2);
  POVE.set(-L.y * 0.5 - 0.04 + rn() * 0.4 * sh, -L.x * 0.5 + rn() * 0.4 * sh, rn() * 0.55 * sh);
  m.body.getWorldQuaternion(POVQ).multiply(POVY).multiply(POVQ2.setFromEuler(POVE));
  m.body.localToWorld(POVO.copy(m.helmet.position).add(POVV.set(0.14 + rn() * 0.05 * sh, 0.09 + rn() * 0.05 * sh, rn() * 0.05 * sh)));
  camera.position.copy(POVO); camera.quaternion.copy(POVQ);
  const E = P.els; E.black.style.opacity = Rp.flash.toFixed(3); E.tunnel.style.opacity = (0.12 + 0.3 * sh).toFixed(3); E.fire.style.opacity = '0'; E.fog.style.opacity = '0';
  canvas.style.filter = sh > 0.02 ? `blur(${(sh * 3).toFixed(2)}px)` : '';
  audio.setMuffle?.(Math.min(0.85, 0.15 + 0.7 * sh));
}
/** the accident over, the car at rest: the wreck as it is (the real one, where it stopped), and the last twelve seconds */
function povReplayEnd() {
  const P = POV, Rp = P.rep; P.rep = null;
  for (const e of Rp.fires.values()) e.dead = true;
  for (const [c, R] of Rp.reps) { scene.remove(R.group); R.dispose(); c._povHide = false; S.meshes.get(c)?.showPieces(true); }
  fire.paused = false;
  P.m = S.meshes.get(P.car); P.m.helmet.visible = false; P.m.halo.visible = false; P.t = 0;
  P.els.black.style.opacity = '1';   // (an instant of black as it comes to rest)
}
/** a heartbeat, felt more than heard */
function thump(vol) {
  const A = audio; if (!A.ready || A.muted) return;
  const ctx = A.ctx, t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(68, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.2);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.connect(g); g.connect(A.fx); o.start(t); o.stop(t + 0.32);
}
// where the fire takes hold, in the car's frame [after s, x, y, z]: the engine, the sidepods, then up beside the cockpit and the nose
const POV_FIRES = [[0, -1.3, 0.55, 0], [1.5, -0.5, 0.5, 0.75], [1.8, -0.5, 0.5, -0.75], [4, 0.5, 0.45, 0.72], [4.6, 0.5, 0.45, -0.72], [7, 0.15, 0.6, 0.9], [7.6, 0.15, 0.6, -0.9], [9, 1.6, 0.38, 0]];
function povFrame(dt) {
  if (POV.rep) { povReplay(dt); return; }
  const P = POV, m = P.m; P.t += dt; const t = P.t, u = Math.min(1, t / P.T);
  if (crashCam.on) endCrash();
  // the fire: from the engine forward, ever bigger (no marshal reaches it in time)
  for (const s of POV_FIRES) if (t >= s[0] && !P.fires.some((e) => e.spot === s)) {
    const e = fire.add((out) => { if (!m.group.parent) return false; m.body.localToWorld(out.set(s[1], s[2], s[3])); return true; }, 'fire', 0.3, () => false);
    e.spot = s; P.fires.push(e);
  }
  for (const e of P.fires) e.k = Math.min(1.5, 0.25 + (t - e.spot[0]) * 0.17);
  m.group.updateMatrixWorld(true);
  m.body.localToWorld(POVV.set(0.5, 1.1, 0)); P.light.position.copy(POVV);
  P.light.intensity = (2 + 20 * u * u) * (0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7.1));
  // the head: inside the helmet, heavy, lolling forward and to the side, swaying - and wherever the mouse turns it, a little
  const L = P.look; L.x += (L.tx - L.x) * Math.min(1, dt * 1.4); L.y += (L.ty - L.y) * Math.min(1, dt * 1.4);
  const sway = 0.04 + 0.1 * u;
  POVE.set(-L.y - 0.03 - 0.34 * u * u + Math.sin(t * 0.53 + 1) * sway * 0.6, -L.x + Math.sin(t * 0.7) * sway * 0.8, Math.sin(t * 0.41) * (0.05 + 0.2 * u));
  m.body.getWorldQuaternion(POVQ).multiply(POVY).multiply(POVQ2.setFromEuler(POVE));
  m.body.localToWorld(POVO.copy(m.helmet.position).add(POVV.set(0.14, 0.09, 0)));   // (the eyes: forward in the helmet, above the cockpit rim)
  camera.position.copy(POVO); camera.quaternion.copy(POVQ);
  // consciousness: coming and going in waves of black, the edges closing in, the visor fogging with each slower breath
  const blink = Math.pow(Math.max(0, Math.sin(t * 1.15 + Math.sin(t * 0.43) * 2.2)), 8) * (0.35 + 0.65 * u);
  const base = Math.pow(u, 1.8) * 0.9;
  let black = base + (1 - base) * blink; if (t > P.T - 1.4) black = Math.max(black, (t - (P.T - 1.4)) / 1.4);
  const E = P.els; E.black.style.opacity = Math.min(1, black).toFixed(3); E.tunnel.style.opacity = (0.3 + 0.7 * u).toFixed(3);
  E.fire.style.opacity = Math.min(1, 0.15 + 1.1 * u * (0.8 + 0.2 * Math.sin(t * 17))).toFixed(3);
  E.fog.style.opacity = ((0.5 + 0.5 * Math.sin(t * (2.2 - 1.3 * u))) * (0.9 - 0.6 * u)).toFixed(3);
  canvas.style.filter = `blur(${(0.4 + 3.2 * u + blink * 3).toFixed(2)}px) saturate(${(1 - 0.55 * u).toFixed(2)}) brightness(${(1 - 0.2 * u).toFixed(2)})`;
  audio.setMuffle?.(0.35 + 0.6 * u);
  P.beat -= dt; if (P.beat <= 0 && t < P.T - 0.8) { const v = 0.55 * (1 - 0.7 * u); thump(v); setTimeout(() => thump(v * 0.7), 270); P.beat = 0.85 + 1.2 * u; }
}
function povEnd() {
  if (!POV.on) return;
  if (POV.rep) povReplayEnd();
  POV.on = false;
  window.removeEventListener('mousemove', POV.onMove); if (document.pointerLockElement) document.exitPointerLock();
  scene.remove(POV.light); POV.light.dispose?.();
  canvas.style.filter = ''; camera.near = POV.near; camera.fov = POV.fov; camera.updateProjectionMatrix();
  const f = blackout(); f.style.transition = 'none'; f.style.opacity = '1';   // (it ends in black; the news comes out of it)
  const v = visor(); v.style.display = 'none'; v.className = ''; v.onclick = null;
}
function endFlashbackIfOpen() { if (S.fb) endFlashback(false); }
/** each frame of a cancelled race, until the news */
function cancelFrame(dt) {
  const C = NEWS.cancel, p = S.director.player; C.t += dt;
  if (POV.on) { if (POV.t >= POV.T + 0.5) { povEnd(); NEWS.cancel = null; strings(false, { fade: 3 }); newsNow(C.hurt); } return; }
  const driving = p && !p.retired && !p.autopilot && !p.injured;
  if (driving && (p.pitLane || p.inPit) && C.pitT == null) C.pitT = C.t;
  const ready = driving ? C.pitT != null && C.t - C.pitT > 5 : C.t > 28;
  if (ready || C.t > 240) { NEWS.cancel = null; strings(false, { fade: 3 }); newsNow(C.hurt); }
}
function newsNow(hurt) {
  const d = S.director;
  NEWS.fading = true; NEWS.wait = 0; input.enabled = false;
  const f = blackout(); f.style.transition = 'opacity 1.1s ease-in'; f.style.opacity = '1';
  audio.setMuffle?.(0.9);
  setTimeout(() => {
    NEWS.fading = false; NEWS.abandoned = true; d.finish();
    playNews(hurt, () => {
      f.style.transition = 'none'; f.style.opacity = '0'; audio.setMuffle?.(0);
      afterNews(hurt, () => { const r = NEWS.results; NEWS.results = null; if (r) r(); else toMenu(); });
    });
    f.style.transition = 'opacity .4s'; f.style.opacity = '0';
  }, 1150);
}
let blackEl = null;
function blackout() { if (!blackEl) { blackEl = document.createElement('div'); blackEl.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:54'; document.body.appendChild(blackEl); } return blackEl; }
/**
 * After the news: the memorial cards; your own driver killed in a career - the mourning screen instead, in silence,
 * and no results: the weekend is over, the driver gone for good, back to the career to choose who you are now.
 */
function afterNews(hurt, then) {
  const C = S.weekend?.career, items = memorialItems(hurt), mine = C && hurt.find((c) => c.careerId && c.careerId === C.playerId && c.fate === 'killed');   // (hurt, not killed: the cards, like anyone)
  if (!C) S.lastLost = (S.lastLost || []).concat(hurt.filter((c) => c.fate === 'killed').map((c) => ({ name: c.name, number: c.number, team: c.team, color: c.color, helmet: c.helmet })));   // (remembered before the next race)
  const others = mine ? items.filter((it) => !it.isPlayer) : items;
  const next = () => { if (!mine) { then(); return; }
    const d = C.drivers[mine.careerId], l = C.lost.find((x) => x.id === d.id) || {};
    NEWS.results = null; NEWS.abandoned = false; strings(false, { fade: 1.2 }); audio.silence?.(true); $('results').classList.add('hidden');
    audio.play?.('horror', { gain: 1, delay: 0.5 });   // (the strings, as the helmet comes out of the dark - then the silence)
    showMourning({ name: d.name, number: d.number, team: l.team, starts: d.starts, wins: d.wins, podiums: d.podiums }, helmetURL({ name: d.name, helmet: d.helmet, color: l.color, number: d.number }, { blood: true }), () => {
      audio.silence?.(false); endSession(); S.weekend = null; openCareerHub();
    }, { audio, helmet3d: { name: d.name, helmet: d.helmet, color: l.color, number: d.number } });
  };
  if (others.length) { strings(true); showMemorial(others, next, () => audio.beep?.(146.8, 2.4, 0.1)); } else next();
}
/** the memorial's cards: who, and (a championship with a round to come) who stands in for them in it */
function memorialItems(hurt) {
  const wk = S.weekend, next = wk && wk.mode === 'champ' && wk.round < wk.rounds;
  if (wk?.career) {
    // (a career: your own driver killed is gone for good - perma-death; an AI driver hurt misses the next two rounds,
    //  a stand-in in the car)
    const C = wk.career;
    const items = hurt.map((c) => {
      const mine = c.careerId === C.playerId, team = C.teams[C.drivers[c.careerId]?.team];
      const dead = decideFate(c) === 'killed', repl = dead ? C.lose(c.careerId, ` at ${W.track.def.name}`) : C.injure(c.careerId, c._out || 2, W.track.def.name);
      const mate = ROSTER.find((r) => r.team === c.team && r.name !== c.name) || ROSTER.find((r) => r.name !== c.name);
      const r1 = C.round <= C.rounds ? C.round : null, r2 = C.round + 1 <= C.rounds ? C.round + 1 : null;
      return { name: c.name, team: c.team, color: team?.color || c.color, number: c.number, isPlayer: mine, dead, track: W.track.def.name, round: repl && r1 ? r1 : null, round2: repl && r1 && !dead && (c._out || 2) > 1 ? r2 : null, mate: mate?.name, standIn: repl && r1 ? { name: repl.name, from: repl.from } : null };
    });
    C.save(); return items;
  }
  const taken = new Set(ROSTER.map((r) => r.name));
  if (next) for (const v of wk.out.values()) if (v.round === wk.round + 1) taken.add(v.standIn.name);
  return hurt.map((c) => {
    let si = null;
    const dead = decideFate(c) === 'killed';
    if (next || dead) { si = standIn(c.team, taken); taken.add(si.name); wk.out.set(c.name, { round: wk.round + 1, until: wk.round + (c._out || 1), forever: dead, standIn: si, at: W.track.def.name }); }
    if (dead) rememberLost(c, si);   // (gone for good: every quick race from now on - main.js buildField)
    // (a fellow driver's words: the team-mate, else another driver from the grid)
    const mate = ROSTER.find((r) => r.team === c.team && r.name !== c.name) || ROSTER.find((r) => r.name !== c.name);
    return { name: c.name, team: c.team, color: c.color, number: c.number, isPlayer: c.isPlayer, dead, track: W.track.def.name, round: next ? wk.round + 1 : null, mate: mate?.name, standIn: si };
  });
}
function playNews(hurt, then) {
  endCrash(); hud.hide(); $('hud').classList.add('hidden'); input.enabled = false; if (RL.group) RL.group.visible = false; W.pitBoxes?.update(0, false);
  // (the race around it, for the ticker: the winner, the other retirements, the safety cars and red flags)
  const d = S.director, winner = d.finishOrder?.[0] || null;
  const race = { abandoned: NEWS.abandoned, winner: winner && !hurt.includes(winner) ? winner.name : null, retired: d.cars.filter((x) => x.retired && !hurt.includes(x)).map((x) => ({ name: x.name, reason: x.retireReason })), sc: d.sc?.count?.sc || 0, vsc: d.sc?.count?.vsc || 0, red: d.sc?.redCount || 0 };
  NEWS.cut = new NewsBroadcast({ THREE, hurt, cars: S.cars, meshes: S.meshes, fx: { fire, debris, chunks }, track: W.track, stands: W.stands, obstacles: W.obstacles, pit: W.pit, trackName: W.track.def.name, race,
    // (a whole car for the replay of one torn in two, before it was)
    makeCarMesh: (c) => { const m = new CarMesh(c.color, c.tyres.compound, { color2: c.color2, team: c.team, livery: c.livery, helmet: c.helmet, driver: c.name, number: c.number, glove: People.lookOf(c.name).suit?.secondary, tcamColor: c.number % 2 ? 0xffd400 : 0x111111 }); m.setHalo(S.halo); return m; },
    scene, camera, renderer, audio, passes: { EffectComposer, RenderPass, ShaderPass, OutputPass },
    onDone: () => { NEWS.on = false; NEWS.cut = null; input.enabled = true; then(); } });
  NEWS.on = true;
}
/**
 * The build-up before lights out (skippable). After a death in the race before - a career's driver lost and not yet
 * remembered, or one earlier in this sitting - it opens with the grid's memorial and the crowd's banners.
 */
function startPreRace() {
  // (a build-up already running - a second start - taken away whole first, so nothing of it stays on the grid)
  if (PRE.walk) { PRE.walk.onDone = null; PRE.walk.kill(); PRE.walk = null; }
  if (PRE.show) { const s = PRE.show; s.onDone = null; s.finish(); s.dispose(); PRE.show = null; }
  const d = S.director, wk = S.weekend, C = wk?.career;
  let mem = [];
  if (C) { const L = (C.lost || []).filter((l) => !l.remembered); mem = L.map((l) => ({ name: l.name, number: l.number, team: l.team, color: l.color, helmet: l.helmet })); L.forEach((l) => { l.remembered = true; }); if (L.length) C.save(); }
  else { mem = S.lastLost || []; S.lastLost = []; }
  // back from injury this round: the comeback in the build-up (and, if it is you, the media pen before the race)
  const back = [];
  if (C) for (const dr of Object.values(C.drivers)) { if (!dr.alive || dr.returnRound !== C.round || dr.returnShown) continue; const car = d.cars.find((c) => c.careerId === dr.id); if (!car) continue; dr.returnShown = true; back.push({ name: car.name, team: car.team, number: car.number, rounds: dr.hurtRounds || 1, at: dr.hurtAt, isPlayer: car.isPlayer, id: dr.id }); }
  else if (wk?.out) for (const [name, v] of wk.out) { if (v.forever || v.shown || (v.until ?? v.round) !== wk.round - 1) continue; const car = d.cars.find((c) => c.name === name); if (!car) continue; v.shown = true; back.push({ name, team: car.team, number: car.number, rounds: (v.until ?? v.round) - v.round + 1, at: v.at, isPlayer: car.isPlayer }); }
  back.sort((a, b) => (b.isPlayer ? 1 : 0) - (a.isPlayer ? 1 : 0));
  if (C && back.length) C.save();
  const myComeback = back.find((b) => b.isPlayer) || null;
  hud.hide(); input.enabled = false;
  for (const c of S.cars) S.meshes.get(c)?.update(c, 0);   // (the cars onto their grid slots: no race frame has run yet)
  const toRaceNow = () => { PRE.on = false; PRE.show = null; PRE.walk = null; input.enabled = true; hud.show(); camCtl.mode = 'tcam'; if (S.player) for (let i = 0; i < 30; i++) camCtl.update(S.player, 1 / 30, W.track); formBriefing(); };
  // (your comeback: the media pen first - how you are, what you remember, what you want from the day)
  let pen = !!myComeback;
  const toRace = () => { if (!pen) { toRaceNow(); return; } pen = false; comebackInterview(myComeback, toRaceNow); };
  const night = W.time === 'night', str = (on) => strings(on, { gain: 0.4, fade: 2 });
  PRE.show = new PreRace({ scene, camera, track: W.track, stands: W.stands, pit: W.pit, cars: d.cars, player: d.player, trackName: W.track.def.name, night, weather: settings.weather, memorial: mem, returning: back, audio, strings: str,
    walk: !!d.player, career: C || null, trackId: W.def.id,
    onDone: (walk) => {
      if (!walk) { toRace(); return; }
      // on foot on the grid first (ui/GridWalk.js), on the show's own grid; that taken away when you get in
      // (a scuffle on the walk - what it came to, walk.brawled - is kept with the weekend for the interview)
      const pre = PRE.show;
      PRE.walk = new GridWalk({ pre, scene, camera, canvas: renderer.domElement, track: W.track, cars: d.cars, player: d.player, career: C || null, trackName: W.track.def.name, night, weather: settings.weather, audio, strings: str,
        onDone: () => { if (S.weekend) S.weekend.brawl = PRE.walk?.brawled || PRE.walk?.x?.brawled || null; pre.dispose(); toRace(); } });
    } });
  PRE.on = true;
}
/** your return from injury: the media pen before the race (ui/Interview.js, comeback questions) -> then() */
function comebackInterview(cb, then) {
  const wk = S.weekend, C = wk?.career, p = S.player;
  const D = (id) => (C && C.drivers[id] ? { id, name: C.drivers[id].name } : null);
  const me = C ? D(C.playerId) : { id: 'you', name: p?.name || 'You' };
  const mate = C ? (C.teammate() ? D(C.teammate().id) : null) : null;
  const ctx = { me, teammate: mate, pos: 0, track: W.track.def.name, contacts: [], nearest: [], grid: [], juniors: [], comeback: { rounds: cb.rounds, at: cb.at }, label: 'THE COMEBACK', look: { team: p?.team, color: p?.color, color2: p?.color2, driver: C?.me?.name || p?.name, helmet: C?.me?.helmet || p?.helmet, number: C?.me?.number ?? p?.number } };   // (you as you are - by name: your own face and look, never a stranger's)
  input.enabled = false; hud.hide();
  showInterview(ctx, (id, delta, why) => (C ? C.relate(id, delta, why) : 0), (id) => (C?.drivers[id]?.name) || id, () => { C?.save(); then(); });
}
/** the build-up gone at once (a quit, a restart): the show and any grid walk, and all they built */
function killPre() {
  const w = PRE.walk; PRE.walk = null; if (w) { w.kill(); input.enabled = true; }
  const s = PRE.show; if (s) { s.finish(); s.dispose(); }   // (finish() hands over to the race, which clears PRE.show)
  PRE.on = false; PRE.show = null;
}
/**
 * The grandstands in full 3D (world/StandCrowds.js) for a cutscene: on (with where the camera is) or off (the flat
 * sheet fans back). time: the crowd's own clock for the jumping, when no scene of its own sets it.
 */
function standsHD(on, dt, time) {
  if (!W.stands?.seats || !W.track) return;
  if (on && !W.standHD) W.standHD = new StandCrowds({ scene, stands: W.stands, night: W.time === 'night', teams: [...new Set(TEAMS.map((t) => t.color))] });
  const H = W.standHD; if (!H) return;
  if (on) H.night = W.time === 'night';
  H.setActive(on); if (!on) return;
  H.update(camera.position, dt); if (time != null) crowdTime(time);
}
function preFrame(dt) {
  if (PRE.walk) PRE.walk.update(dt); else PRE.show?.update(dt);
  if (!PRE.on) { standsHD(false); input.endFrame(); return; }
  standsHD(!PRE.walk, dt);   // (the show: every stand in shot full of people; on foot on the grid, the sheets)
  { const s = PRE.show, g = s?.seg; if (s && !PRE.walk && g && s.t - g.t0 > 2.6 && (s._shots = s._shots || {})[g.k] == null) { s._shots[g.k] = Math.random() < 0.6; const tag = { aerial: 'aerial', fans: 'crowd', stands: 'crowd', grid: 'grid' }[g.k]; if (tag && s._shots[g.k]) Gallery.want(tag, W.def.id); } }   // (some of the build-up kept for the loading screen)
  simTime += dt;
  if (W.lights) W.lights.update(camera.position, simTime);
  for (const m of S.meshes.values()) m.detail(camera.position, carZoom());
  if (W.stands) W.stands.update(simTime);
  W.scenery?.update?.(simTime, camera, S.player);
  if (W.landmarks) for (const fn of W.landmarks.anims) fn(simTime, dt);
  if (W.buildings) W.buildings.material.uniforms.uTime.value = simTime;
  cullBuildings(); env.sky.position.copy(camera.position);
  renderView(); input.endFrame();
}
function newsFrame(dt) {
  NEWS.cut.update(dt);
  if (!NEWS.on) { standsHD(false); input.endFrame(); return; }   // (it finished this frame: the memorial's turn)
  simTime += dt * (NEWS.cut.crowdRate || 1);   // (the grandstands erupting in the phone footage: the fans jump faster)
  standsHD(!NEWS.cut._standsBack, dt, simTime);   // (the vigil: the stands emptied)
  fire.update(dt, camera, renderer.domElement.height); debris.update(dt);
  rain.update(camera, dt);
  if (W.lights) W.lights.update(camera.position, simTime);
  for (const m of S.meshes.values()) m.detail(camera.position, carZoom());
  if (W.stands) W.stands.update(simTime);
  W.scenery?.update?.(simTime, camera);
  if (W.landmarks) for (const fn of W.landmarks.anims) fn(simTime, dt);
  if (W.buildings) W.buildings.material.uniforms.uTime.value = simTime;
  cullBuildings(); env.sky.position.copy(camera.position);
  NEWS.cut.render(); input.endFrame();
}

// ---------------------------------------------------------------------------
// an evening out (ui/Hangout.js) between rounds, inside the real world: the venue is staged in the city the race is run
// in - the same Las Vegas as on race night, its towers, its lights and the Sphere's shows, or the Silverstone
// countryside - with the main renderer, scene and camera (one more group in the scene, nothing else). The career hub
// hands over (onHangout), the world is built if it is not the one loaded, and the hub comes back where it was.
// ---------------------------------------------------------------------------
// (launch: the evening's descriptor - a night after a race (key 'party') may go on to a second venue; party: it is one;
//  pre: the scene's children before the venue was added (the venue's own group is what is new); sealed / hidden: a
//  windowless venue's world put out of sight, exactly what was hidden; amb: the ambient cars put away for the night;
//  prev: act 1's result while act 2 opens; curtain: the black between the two acts)
const HANG = { on: false, busy: false, api: null, result: null, end: false, wait: 0, cb: null, saved: null, venue: null, guests: null, c: null, token: null, launch: null, party: false, pre: null, sealed: false, hidden: null, amb: null, prev: null, curtain: null };
/**
 * An evening that could not be played, settled as the hub's SKIP settles it (Social.autoHangout) -> result. A night after
 * a race (launch.key 'party') is not Social's: a neutral failed result, which the hub sums up with Party.autoParty.
 */
function autoEvening(c, venue, guests, launch = null) {
  if (launch?.key !== 'party') { try { const r = Social.autoHangout(c, venue, guests || []); if (r) return r; } catch (e) { console.warn('[hangout] auto', e); } }
  return { venue, guests: [], score: 0.5, moments: [], minigames: { won: 0, lost: 0 }, seen: false, tones: {}, dur: 0, left: 'early', failed: true };
}
// (the night after a race at a venue sealed throughout - the London basement club: with its city not loaded it runs in
//  its own little scene rather than load a world nobody would see)
const SEALED_THROUGHOUT = new Set(['londonclub']);
/**
 * The hub's hand-off for an evening out (CareerHub's o.onHangout): launch = Agenda's descriptor { venue, guests, key,
 * mul, ... }, done(result) back to the hub (which settles it: Social.hangoutResult), c0: a career to read (else
 * launch.c, else the one saved - the hub saves before it hands over, and the evening only reads it). The world: the
 * venue's own city (the rooftop Las Vegas, the pub Silverstone), else the circuit loaded, else the next race's - built
 * behind the loading screen if it must be. Then the evening's light (the rooftop and the pub by night, else the race's
 * forecast), the venue's place (hangoutAnchor), the hub and the menus out of the way, and the frame handed to the venue
 * (HANG). With no world to be had: the venue's own overlay instead.
 * The night after a race (launch.key 'party', career/Party.js partyLaunch) keeps its own: the race's world (after a
 * driven race it is still loaded - no loading screen), always by night, and the London club with Silverstone not loaded
 * runs in its own scene (it is sealed throughout: a world would never be seen).
 */
async function careerHangout(launch, done, c0 = null) {
  const L0 = launch || {}, vid = typeof L0.venue === 'string' ? L0.venue : L0.venue?.id || null, V = VENUE_BY_ID[vid], party = L0.key === 'party';
  // (one evening at a time: a second asked for meanwhile is settled as SKIP settles it, so nothing waits on it)
  if (HANG.on || HANG.busy) { setTimeout(() => done?.(autoEvening(c0 || L0.c || Career.load(), vid, L0.guests, L0)), 0); return; }
  HANG.busy = true;
  const c = c0 || L0.c || Career.load() || S.career;
  if (c?.drivers) syncLooks(c);   // (you at the evening as your save has you: face, hair, skin)
  const next = c?.calendar?.[(c.round || 1) - 1];
  const id = (party ? [L0.track, W.track ? W.def?.id : null, 'lasvegas'] : [V?.where, W.track ? W.def?.id : null, next, 'lasvegas']).find((t) => t && TRACKS[t]);
  const fc = c?.forecastAt?.() || null, mode = party ? (L0.night === false || vid === 'dayclub' ? 'day' : 'night') : vid === 'dayclub' ? 'day' : vid === 'rooftop' || vid === 'pub' || vid === 'poolclub' ? 'night' : (id === next && fc?.time) || TRACKS[id]?.defaultTime || 'night';
  let sent = false;
  const back = (r) => { if (sent) return; sent = true; HANG.busy = false; try { done?.(r); } catch (e) { console.error('[hangout] hub', e); } };
  // (no world to stage it in: the venue in its own little scene, over the hub)
  const alone = () => {
    let api = null;
    try { api = showHangout({ ...L0, c, audio, night: mode === 'night', track: id, onDone: (r) => back(r && !r.failed ? r : autoEvening(c, vid, L0.guests, L0)) }); } catch (e) { console.error('[hangout]', e); }
    if (!api) setTimeout(() => back(autoEvening(c, vid, L0.guests, L0)), 1500);
  };
  audio.init(); audio.resume(); strings(false, { fade: 1 });   // (the evening has its own sound)
  try {
    if (!W.track || W.def?.id !== id) {
      if (party && SEALED_THROUGHOUT.has(vid)) { alone(); return; }
      const names = (L0.guests || []).filter((g) => g?.name && (!party || g.tier === 'principal' || !g.tier)).map((g) => g.name);
      const who = names.length > 3 ? `With ${names.slice(0, 3).join(', ')} and ${names.length - 3} more` : names.length ? `With ${names.join(', ')}` : null;
      Loader.show({ track: id, kicker: party ? 'After the race · the night' : 'Between the races · an evening out', sub: [party ? L0.place || L0.title || 'The night' : V?.name || 'An evening out', who], news: [] });
      await switchTrack(id);
      if (!W.track || W.def?.id !== id) { Loader.kill(); alone(); return; }
      Loader.stage('Setting the scene', 94); await paint();
    }
    const hubEl = document.getElementById('career');
    HANG.saved = { time: W.time, fov: camera.fov, near: camera.near, far: camera.far, pos: camera.position.clone(), quat: camera.quaternion.clone(), menu: !$('menu').classList.contains('hidden'), hub: !!hubEl && hubEl.style.display !== 'none' };
    setTimeOfDay(mode); applyWeather(0);   // (a dry evening: the forecast is the race's business)
    // the hub and the menus out of the way - the hub kept as it is, to come back where it was
    closeCareer(); $('menu').classList.add('hidden'); $('shot-label').classList.add('hidden'); $('fade').style.opacity = '0'; hud.hide();
    Object.assign(HANG, { on: true, cb: back, c, prev: null });
    stageHosted(L0, c, id, mode);
    if (Loader.on) Loader.hide();
  } catch (e) {
    // (anything else gone wrong on the way in: the hub is never left waiting - the frame loop winds an open evening up,
    //  else it is settled here as SKIP settles it)
    console.error('[hangout] could not stage the evening', e);
    if (Loader.on) Loader.kill();
    if (HANG.on) HANG.end = true; else back(autoEvening(c, vid, L0.guests, L0));
  }
}
/**
 * The venue staged in the loaded world (HANG.on already): its place (hangoutAnchor), what the scene held before it (so
 * a sealed venue knows its own group), the ambient cars put away for a night after a race (the circuit is closed), and
 * the evening opened on the game's own scene, camera and renderer. Also the second act of a night (endHangout).
 */
function stageHosted(L0, c, id, mode) {
  const vid = typeof L0.venue === 'string' ? L0.venue : L0.venue?.id || null, party = L0.key === 'party';
  const anchor = hangoutAnchor(vid, { team: c?.team?.name || null });
  const token = {};   // (this evening's: a late word from an earlier one changes nothing)
  Object.assign(HANG, { api: null, result: null, end: false, wait: 0, venue: vid, guests: L0.guests || [], launch: L0, party, token, pre: new Set(scene.children), sealed: false, hidden: null });
  if (party && S.ambient && !HANG.amb) { HANG.amb = []; for (const m of S.ambient.meshes) if (m.group.visible) { m.group.visible = false; HANG.amb.push(m.group); } }
  let api = null;
  try { api = showHangout({ ...L0, c, audio, night: mode === 'night', track: id, host: { scene, camera, renderer, anchor, trackId: id, night: mode === 'night' }, onDone: (r) => { if (HANG.token !== token || !HANG.on) return; HANG.result = r || HANG.result; HANG.end = true; } }); }
  catch (e) { console.error('[hangout]', e); }
  HANG.api = api || null; if (!api) HANG.end = true;
  return api;
}
/**
 * Each frame of an evening out: the venue (its people, its games, the camera - ui/Hangout.js) and the world around it
 * kept alive as the title shots keep it - the lights, the landmarks and the buildings' windows, the Sphere's shows when
 * it is in view, the cars lapping - then the frame. The 3D grandstand crowds stay off.
 * A night after a race: the circuit is closed (no ambient cars), and a windowless venue (api.seal - the clubs; off while
 * you are out on the Vegas club's terrace) has the world behind its walls hidden, and none of its per-frame upkeep runs.
 */
function hangFrame(dt, interval) {
  const H = HANG;
  if (H.api && !H.end) { try { H.api.update(dt); } catch (e) { console.error('[hangout]', e); H.end = true; } if (H.api?.done) H.end = true; }
  // (over: a moment for its result to arrive - the venue says goodbye on its own clock)
  if (H.end && (H.result || (H.wait += dt) > 1.5)) { endHangout(); input.endFrame(); return; }
  // (still building behind its opaque cover: no world drawn - each new person's shaders would otherwise compile in that
  // very frame, one stall after another; the venue's own compileAsync does them all at once before the reveal)
  if (H.api && H.api.ready === false && !H.end) { input.endFrame(); return; }
  // (an after-party is hours after the flag: the grandstands have emptied - a few stragglers and the cleaners stay)
  if (H.party && !H.standsOff && W.stands?.hide) { try { H.standsOff = W.stands.hide(() => Math.random() > 0.03); } catch (_) { H.standsOff = () => {}; } }
  const sealed = !!(H.api && H.api.seal);
  if (sealed !== H.sealed) { if (sealed) sealWorld(); else unsealWorld(); }
  simTime += dt; if (!H.party) stepAmbient(dt); standsHD(false);
  if (W.lights) W.lights.update(camera.position, simTime);
  if (W.buildings) W.buildings.material.uniforms.uTime.value = simTime;
  rain.update(camera, dt);
  if (sealed) input.endFrame();
  else {
    if (W.stands) W.stands.update(simTime);
    W.scenery?.update?.(simTime, camera);
    if (W.landmarks) for (const fn of W.landmarks.anims) fn(simTime, dt);
    const seen = sphereShow();
    input.endFrame(); sphereFeed(seen);
    cullBuildings();
  }
  env.sky.position.copy(camera.position);
  renderView();
  RES.calls = renderer.info.render.calls; RES.tris = renderer.info.render.triangles;
  dynamicResolution(interval);
}
/**
 * A sealed venue: every part of the world is put out of sight - each of the scene's visible children but the venue's own
 * group (what was not there before it opened: HANG.pre), the cameras and the lights - and exactly those are remembered.
 * A light is never hidden, nor anything holding one (the floodlights' SpotLights sit in the scene): one light fewer
 * changes the light count every world shader is built for, and they would all compile again on the way in and out.
 * So a child holding a light is gone into, and only its light-free children are hidden.
 */
function sealWorld() {
  const hid = HANG.hidden || (HANG.hidden = []), keep = HANG.pre;
  const walk = (o) => {
    for (const k of o.children) {
      if (!k.visible || k.isLight || k.isCamera) continue;
      if (o === scene && keep && !keep.has(k)) continue;   // (the venue itself, and anything it added)
      if (k.getObjectByProperty('isLight', true)) { walk(k); continue; }
      k.visible = false; hid.push(k);
    }
  };
  walk(scene);
  HANG.sealed = true;
}
/** the world back exactly as the seal found it, the buildings' distance culling brought up to date once */
function unsealWorld() {
  for (const o of HANG.hidden || []) o.visible = true;
  HANG.hidden = null; HANG.sealed = false;
  cullBuildings();
}
/**
 * The evening over: the venue gone, the camera and the light as they were, the hub back where it was, and the result to
 * it. A night after a race that goes on - act 1 ended 'moveon' ('On to the club') - opens its second venue at once behind
 * a black curtain: the hub never shows in between, the evening stays on (HANG.busy refuses any other meanwhile), and only
 * the whole night's result goes back, once (act 2's: career/Party.js carries act 1 into it). Should act 2 fail to open,
 * act 1's own result is what goes back.
 */
function endHangout() {
  // (an evening that never really opened is settled as SKIP settles it)
  const api = HANG.api, sv = HANG.saved, cb = HANG.cb, L0 = HANG.launch, c = HANG.c, got = HANG.result && !HANG.result.failed ? HANG.result : null;
  const r = got || HANG.prev || autoEvening(c, HANG.venue, HANG.guests, L0);
  const L2 = got && L0?.key === 'party' && (L0.act || 1) < 2 && (got.left === 'moveon' || got.party?.exit === 'moveon') ? secondAct(c, L0, got) : null;
  if (HANG.sealed) unsealWorld();
  if (L2) {
    const k = HANG.curtain = Kit.curtain('#000'); k.cover(0);
    try { api?.dispose?.(); } catch (e) { console.warn('[hangout] dispose', e); }
    HANG.prev = got;
    // (the team's party at Silverstone is in daylight, the club after it by night: the world's light follows, behind the curtain)
    const m2 = L2.night === false ? 'day' : 'night'; if (W.track && W.time !== m2) { try { setTimeOfDay(m2); } catch (e) { console.warn('[party] act 2 light', e); } }
    // (the club's own black cover is up by the time the curtain lifts onto it)
    if (stageHosted(L2, c, W.def?.id, m2)) setTimeout(() => { if (HANG.curtain === k) { HANG.curtain = null; k.reveal(200); } }, 320);
    return;
  }
  if (HANG.amb) for (const g of HANG.amb) g.visible = true;   // (the ambient cars back for the title screen)
  if (HANG.standsOff) { try { HANG.standsOff(); } catch (_) { /* */ } HANG.standsOff = null; }   // (the grandstands' fans back)
  if (HANG.curtain) { HANG.curtain.reveal(260); }
  Object.assign(HANG, { on: false, api: null, result: null, end: false, wait: 0, cb: null, saved: null, venue: null, guests: null, c: null, token: null, launch: null, party: false, pre: null, sealed: false, hidden: null, amb: null, prev: null, curtain: null });
  try { api?.dispose?.(); } catch (e) { console.warn('[hangout] dispose', e); }
  if (document.pointerLockElement) document.exitPointerLock();
  canvas.style.cursor = '';
  if (sv) { camera.fov = sv.fov; camera.near = sv.near; camera.far = sv.far; camera.up.set(0, 1, 0); camera.position.copy(sv.pos); camera.quaternion.copy(sv.quat); camera.updateProjectionMatrix(); if (W.track) { setTimeOfDay(sv.time); applyWeather(weatherWetness(settings.weather)); } }
  CINE.look = null;
  // (the hub as it was - shown again only if it was showing; its own hand-back brings back its keys and its page)
  const hub = document.getElementById('career'); if (hub && sv?.hub) hub.style.display = '';
  if (sv?.menu) $('menu').classList.remove('hidden');
  cb?.(r);
  if (sv?.hub && innerWidth >= 700) window.__careerRoom?.start?.();   // (closeCareer stopped the hub's showroom - CareerHub keeps it on window - and it runs again)
}
/**
 * The night's second venue: the club's offer (career/Party.js) launched as act 2 with act 1's R.party carried (its
 * drinks, spend, clock and contacts) -> Launch | null (no club open to you tonight: the night ends with act 1)
 */
function secondAct(c, L0, r1) {
  if (!c || typeof Party.partyLaunch !== 'function') return null;
  try {
    const open = (L) => (L || []).find((o) => o && o.host === 'club' && o.ok !== false && o.id !== L0.partyId);
    const club = open(typeof Party.partyOffers === 'function' ? Party.partyOffers(c) : null) || open(c.party?.offers);
    if (!club) return null;
    const L = Party.partyLaunch(c, club.id, 2, r1.party || null, { travel: r1.party?.heli ? 'heli' : 'car' });
    return L && L.key === 'party' ? L : null;
  } catch (e) { console.warn('[party] the second act', e); return null; }
}

// ---- where an evening out stands in the world ----
const ANCHORS = new Map();   // (per circuit and venue: found once a world)
// (each venue's footprint about its anchor as ui/Hangout.js builds it - forward to its view side, back, half its width:
//  the karting hall is a big shed; the rooftop's and the flat's are their towers, down to the street)
const VENUE_FOOT = { rooftop: [5.9, 6.85, 7.3], apartment: [6.75, 9, 11], pub: [4.7, 4.7, 6.2], simlounge: [5.2, 5.2, 6.7], restaurant: [4.2, 4.2, 4.7], coffee: [3.7, 3.7, 4.7], karting: [11.7, 16.4, 22.7] };
// (the nights after a race as ui/PartyVenues.js builds them - PARTY_FOOTPRINT - and any other venue as Hangout publishes
//  its ground: HANGOUT_FOOTPRINT)
const footOf = (vid) => { if (VENUE_FOOT[vid]) return VENUE_FOOT[vid]; const F = PARTY_FOOTPRINT[vid] || HANGOUT_FOOTPRINT[vid]; return F ? [+F.front || 6, +F.back || 6, +F.side || 7] : [6, 6, 7]; };
const VENUE_SLOT = { pub: 0, restaurant: 1, simlounge: 2, karting: 3, coffee: 4, apartment: 5, rooftop: 0, londonclub: 1, teamparty: 2 };
/** an anchor at (x, y, z) looking at (lx, ly, lz) -> { x, y, z, yaw (the view faces (sin yaw, 0, cos yaw)), face (the same as a heading: atan2(dz, dx)), look, raised } */
const anchorAt = (x, y, z, lx, ly, lz) => ({ x, y, z, yaw: Math.atan2(lx - x, lz - z), face: Math.atan2(lz - z, lx - x), look: { x: lx, y: ly, z: lz }, raised: y > 0 });
/**
 * Where an evening out stands in the loaded world -> { x, y, z, yaw, face, look: { x, y, z }, raised, trackId, venue }.
 * The venue's view - the rooftop's glass balustrade, a window wall - faces look: yaw as ui/Hangout.js reads it (the view
 * faces world (sin yaw, 0, cos yaw); it turns its own frame's view side onto it), face the same direction as a heading
 * (atan2(dz, dx), the game's convention). In Las Vegas the rooftop, the flat and the casino-resort club (vegasclub, 60 m
 * up a resort tower, its terrace facing the Sphere) are up high by the Sphere (skyAnchor); the team's party is in the
 * paddock behind its own garage (paddockAnchor; o.team: the team's name); everything else stands on the ground beside a
 * long straight (groundAnchor). Never in the track corridor or the pit lane, never on a footprint, a grandstand or a
 * landmark. Kept per world and venue (and team).
 */
function hangoutAnchor(venueId, o = {}) {
  const tr = W.track; if (!tr) return { ...anchorAt(0, 0, 0, 0, 0, -50), trackId: W.def?.id || null, venue: venueId };
  const key = `${W.def.id}|${venueId}${venueId === 'teamparty' && o.team ? `|${o.team}` : ''}`, got = ANCHORS.get(key); if (got) return { ...got, look: { ...got.look } };
  let a = null;
  if (W.sphereInfo && (venueId === 'rooftop' || venueId === 'apartment' || venueId === 'vegasclub')) { try { a = skyAnchor(venueId); } catch (e) { console.warn('[hangout] sky anchor', e); } }
  if (!a && venueId === 'teamparty') { try { a = paddockAnchor(venueId, o.team); } catch (e) { console.warn('[hangout] paddock anchor', e); } }
  // (the pool club: the roof of the resort's podium, 7 m up - at street level the world's ground covered its sunken basin)
  if (!a) { try { a = groundAnchor(venueId, venueId === 'rooftop' ? 70 : venueId === 'apartment' ? 9 : venueId === 'vegasclub' ? 60 : venueId === 'poolclub' || venueId === 'dayclub' ? 7 : 0); } catch (e) { console.warn('[hangout] anchor', e); } }
  if (!a) { const f = tr.sample(0, tr.wallAt(0, 1) + 40); a = anchorAt(f.x, 0, f.z, tr.px[0], 0, tr.pz[0]); }
  a.trackId = W.def.id; a.venue = venueId; ANCHORS.set(key, a);
  return { ...a, look: { ...a.look } };
}
/**
 * A venue's footprint, standing at (x, z) with its view toward (tx, tz), is clear - margin off the circuit and the pit
 * lane, on no building, grandstand or landmark: its middle and corners first, then a point every 5 m or less, a metre of
 * slack all round
 */
function footClear(vid, x, z, tx, tz, margin) {
  const [f, b, w] = footOf(vid), L = Math.hypot(tx - x, tz - z) || 1, fx = (tx - x) / L, fz = (tz - z) / L, oh = {};
  const at = (u, v) => { const px = x + fx * v - fz * u, pz = z + fz * v + fx * u; return corridorSigned(W.track, W.pit, px, pz, margin) >= 0 && !W.obstacles?.hit(px, pz, 0, oh) && !onVenueBuilding(px, pz) && !W.scenery?.blocked?.(px, pz); };
  if (!at(0, 0) || !at(-w - 1, f + 1) || !at(w + 1, f + 1) || !at(-w - 1, -b - 1) || !at(w + 1, -b - 1)) return false;
  const nu = Math.ceil((2 * w + 2) / 5), nv = Math.ceil((f + b + 2) / 5);
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) if (!at(-w - 1 + (2 * w + 2) * i / nu, -b - 1 + (f + b + 2) * j / nv)) return false;
  return true;
}
/** within r of the pit lane (its garages, and the pit building beside them) */
function nearPit(x, z, r) { const ps = W.pit?.samples; if (!ps) return false; for (let i = 0; i < ps.n; i += 3) if ((ps.px[i] - x) ** 2 + (ps.pz[i] - z) ** 2 < r * r) return true; return false; }
/** nothing solid on the ground between (x, z) and (tx, tz), from the venue's own wall out: its windows see the circuit */
function groundView(x, z, tx, tz, from = 9) { const L = Math.hypot(tx - x, tz - z), oh = {}; for (let d = from; d < L - 2; d += 4) { const f = d / L; if (W.obstacles?.hit(x + (tx - x) * f, z + (tz - z) * f, 1, oh)) return false; } return true; }
const _ray = new THREE.Raycaster(), _ro = new THREE.Vector3(), _rd = new THREE.Vector3();
/** how far a line of sight runs from (x, y, z) toward (tx, ty, tz) before a building or a landmark (not skip) stands in it -> metres (Infinity: clear for far) */
function sightRun(x, y, z, tx, ty, tz, far, skip = null) {
  const occ = [...(W.buildings?.children || []), ...(W.landmarks?.group.children || []).filter((o) => o !== skip), W.venue?.group].filter(Boolean);
  _ro.set(x, y, z); _rd.set(tx - x, ty - y, tz - z).normalize(); _ray.set(_ro, _rd); _ray.near = 0; _ray.far = far; _ray.camera = camera;
  for (const h of _ray.intersectObjects(occ, true)) if (h.object.isMesh) return h.distance;
  return Infinity;
}
/** the middle of the Strip (the circuit's 'THE STRIP' title shot, else turn 13 on the map) -> { x, z } | null */
function stripPoint() {
  const tr = W.track, sh = (W.def.shots || []).find((x) => x.s != null && /STRIP/.test(x.label || ''));
  if (sh) { const f = tr.sample(tr.wrapS(sh.s), 0); return { x: f.x, z: f.z }; }
  const k = (W.def.corners || []).find((x) => x.n === 13);
  if (k && W.geo?.proj) { const [x, z] = W.geo.proj.toXZ(k.ll[0], k.ll[1]); return { x, z }; }
  return null;
}
/**
 * Up high in Las Vegas, by the Sphere: the rooftop 70 m up and 130-210 m from its centre, the deck looking at it with
 * the Strip beyond (so on the side of the Sphere away from the Strip); the flat 95 m up, looking at the Strip with the
 * Sphere some 25 degrees to one side. The footprint below must be clear (the venue's own building goes down to the
 * street) and so must the line of sight - a raycast through the city's buildings and landmarks, the best two dozen
 * places at most; else the best clear footprint -> anchor | null
 */
function skyAnchor(vid) {
  // (the club looks at the Sphere as the rooftop does - its terrace on that side - from a lower floor of its tower)
  const sp = W.sphereInfo, c = sp.center, R = sp.radius, roof = vid === 'rooftop' || vid === 'vegasclub', y = vid === 'vegasclub' ? 60 : roof ? 70 : 95;
  const st = stripPoint(), ts = st ? Math.atan2(st.z - c.z, st.x - c.x) : 0, sphereObj = W.landmarks?.group.children.find((o) => o.name === 'lm:sphere') || null;
  const cand = [];
  for (let k = 0; k < 36; k++) {
    const a = (k / 36) * Math.PI * 2;
    for (const dist of roof ? [210, 190, 170, 150, 130] : [260, 235, 210, 185]) {
      const x = c.x + Math.cos(a) * dist, z = c.z + Math.sin(a) * dist;
      let s = 0;
      if (roof) s = (st ? 3 * Math.cos(a - ts - Math.PI) : 0) + (dist - 130) / 80;
      else if (st) { const toS = Math.atan2(st.z - z, st.x - x), toP = Math.atan2(c.z - z, c.x - x), off = Math.abs(((toP - toS + 3 * Math.PI) % (2 * Math.PI)) - Math.PI); s = 3 - Math.abs(off - 0.45) * 4 - Math.hypot(st.x - x, st.z - z) / 1500; }
      cand.push({ x, z, s });
    }
  }
  cand.sort((p, q) => q.s - p.s);
  const look = roof ? { x: c.x, y: c.y, z: c.z } : { x: st ? st.x : c.x, y: 60, z: st ? st.z : c.z };
  let fall = null, tried = 0;
  for (const p of cand) {
    if (!footClear(vid, p.x, p.z, look.x, look.z, 14)) continue;
    fall = fall || p;
    if (tried++ >= 24) break;
    const D = Math.hypot(look.x - p.x, look.y - y - 1.7, look.z - p.z), need = roof ? D - R - 2 : Math.min(D, 450);
    if (sightRun(p.x, y + 1.7, p.z, look.x, look.y, look.z, need, roof ? sphereObj : null) >= need) return anchorAt(p.x, y, p.z, look.x, look.y, look.z);
  }
  return fall ? anchorAt(fall.x, y, fall.z, look.x, look.y, look.z) : null;
}
/**
 * On the ground beside a long straight, looking at the circuit (the pub at Silverstone; anywhere the restaurant, the sim
 * lounge, the karting hall and the café; y: a few floors up for a flat away from the Strip): beyond the barrier and its
 * run-off (its own depth and a dozen metres more back from the barrier), off the pit lane, on clear ground and with
 * nothing between its windows and the track. The best places are checked in order, kept apart, and shared out so each
 * venue has its own -> anchor | null
 */
function groundAnchor(vid, y = 0) {
  const tr = W.track, n = tr.n, ds = tr.length / n, step = Math.max(1, Math.round(10 / ds)), flat = (i) => Math.abs(tr.curv[((i % n) + n) % n]) < 1 / 500;
  const f0 = footOf(vid)[0], off = Math.max(y > 0 ? 30 : 24, f0 + 14), cand = [];
  for (let i = 0; i < n; i += Math.max(1, Math.round(20 / ds))) {
    if (!flat(i)) continue;
    // (a long straight, and not at either end of it)
    let fw = 0, bw = 0;
    for (let j = i; fw < 600 && flat(j); j += step) fw += step * ds;
    for (let j = i; bw < 600 && flat(j); j -= step) bw += step * ds;
    if (fw + bw < 300 || Math.min(fw, bw) < 80) continue;
    for (const side of [1, -1]) cand.push({ i, side, score: Math.min(fw + bw, 1200) + Math.min(fw, bw) * 0.5 });
  }
  cand.sort((p, q) => q.score - p.score);
  const picks = [];
  for (const k of cand) {
    const wall = tr.wallAt(k.i, k.side), f = tr.sample(tr.s[k.i], k.side * (wall + off)), e = tr.sample(tr.s[k.i], k.side * wall);
    if (picks.some((q) => Math.hypot(q.x - f.x, q.z - f.z) <= 250)) continue;
    if (nearPit(f.x, f.z, 70) || !footClear(vid, f.x, f.z, e.x, e.z, y > 0 ? 10 : 5) || !groundView(f.x, f.z, e.x, e.z, f0 + 1)) continue;
    picks.push({ x: f.x, z: f.z, tx: e.x, tz: e.z });
    if (picks.length >= 6) break;
  }
  if (!picks.length) {
    // (nowhere ideal: any clear ground just beyond a barrier)
    for (let i = 0; i < n && !picks.length; i += Math.max(1, Math.round(20 / ds))) for (const side of [1, -1]) {
      const f = tr.sample(tr.s[i], side * (tr.wallAt(i, side) + off + 6)), e = tr.sample(tr.s[i], 0);
      if (!nearPit(f.x, f.z, 50) && footClear(vid, f.x, f.z, e.x, e.z, 3)) { picks.push({ x: f.x, z: f.z, tx: e.x, tz: e.z }); break; }
    }
  }
  const p = picks[(VENUE_SLOT[vid] ?? 0) % Math.max(1, picks.length)];
  return p ? anchorAt(p.x, y, p.z, p.tx, 0, p.tz) : null;
}
/**
 * The team's hospitality in the paddock (the night's team party): behind the pit building, on the paddock side - from
 * the pit lane by your team's garage, out past the building's back wall (world/PitLane.js: its front at the lane's half
 * width + 1.2 m, 6 m deep) by 15 m or more and the venue's own front, looking back at the garages' back doors, on clear
 * ground (footClear). Your garage first, then its neighbours along the building -> anchor | null (then groundAnchor)
 */
function paddockAnchor(vid, team) {
  const pit = W.pit, ps = pit?.samples; if (!ps || !pit.boxes?.length) return null;
  const gs = -pit.trackSide, back = pit.halfWidth + 1.2 + 6.0, f = footOf(vid)[0];
  // (a team of your own making has the last garage, the 'Independent' one)
  const kt = pit.boxes.findIndex((b) => b.team?.name === team), k0 = kt >= 0 ? kt : Math.max(0, pit.boxes.findIndex((b) => b.team?.name === 'Independent'));
  const order = pit.boxes.map((_, k) => k).sort((a, b) => Math.abs(a - k0) - Math.abs(b - k0)).slice(0, 10);
  for (const k of order) {
    const i = pit.boxes[k].i, nx = ps.nx[i] * gs, nz = ps.nz[i] * gs, tx = ps.px[i] + nx * back, tz = ps.pz[i] + nz * back;
    for (const gap of [15, 21, 28, 36, 48, 62, 78, 95]) {
      const d = back + gap + f, x = ps.px[i] + nx * d, z = ps.pz[i] + nz * d;
      if (footClear(vid, x, z, tx, tz, 3) && !footRoofed(vid, x, z, tx, tz)) return anchorAt(x, 0, z, tx, 0, tz);
    }
  }
  return null;
}
/**
 * Anything built over a venue's footprint that the ground tests cannot see - a landmark that reaches over the pit lane
 * (Las Vegas's four-storey pit building is one: it is never an obstacle, its box touches the circuit) or the venue's own
 * map buildings: a ray straight down at the footprint's middle, corners and every 6 m, hitting something above 1.5 m.
 * pad: metres of open ground kept all round (a walk round the outside, not a wall against the pit building's)
 */
function footRoofed(vid, x, z, tx, tz, pad = 4) {
  const occ = [W.landmarks?.group, W.venue?.group].filter(Boolean); if (!occ.length) return false;
  const F0 = footOf(vid), f = F0[0] + pad, b = F0[1] + pad, w = F0[2] + pad, L = Math.hypot(tx - x, tz - z) || 1, fx = (tx - x) / L, fz = (tz - z) / L;
  const nu = Math.ceil((2 * w) / 6), nv = Math.ceil((f + b) / 6);
  _rd.set(0, -1, 0); _ray.near = 0; _ray.far = 120;
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
    const u = -w + (2 * w * i) / nu, v = -b + ((f + b) * j) / nv;
    _ro.set(x + fx * v - fz * u, 120, z + fz * v + fx * u); _ray.set(_ro, _rd);
    for (const h of _ray.intersectObjects(occ, true)) if (h.object.isMesh && h.point.y > 1.5) return true;
  }
  return false;
}
/** (x, z) inside one of the venue's own buildings from the map (Silverstone's Wing: world/Venue.js keeps its ring) */
function onVenueBuilding(x, z) {
  for (const g of W.venue?.group.children || []) {
    const r = g.userData.ring; if (!r || r.length < 3) continue;
    let inside = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, zi] = r[i], [xj, zj] = r[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside; }
    if (inside) return true;
  }
  return false;
}

function nextAfterResults() {
  const wk = S.weekend;
  // anyone hurt in the race's last moments, not yet covered (the news and the memorial came straight after the rest)
  const fresh = wk ? (wk.cars || []).filter((c) => c.injured && !c.standInFor && !c._newsShown) : [];
  for (const c of fresh) { c._newsShown = true; decideFate(c); if (!c.injuryClip && S.director?.replay) c.injuryClip = S.director.replay.clip(c); }
  if (fresh.length && S.director && W.track) { playNews(fresh, () => afterNews(fresh, () => afterResults())); return; }
  afterResults();
}
function afterResults() {
  const wk = S.weekend, next = wk && wk.mode === 'champ' && wk.round < wk.rounds;
  NEWS.abandoned = false; NEWS.results = null; NEWS.cancelled = false;
  endSession();
  if (wk?.career) {   // (a career: the interview, then back to the hub)
    const C = wk.career, ctx = wk.interview; S.weekend = null;
    if (ctx && wk.incident) strings(true); else strings(false);
    // (the press: what each answer's tone makes of you - career/PR.js; never after a race that hurt someone)
    const onTone = (tone, k, outlet, about) => {
      if (ctx.grave) return;
      const data = { tone, topic: k, outlet: outletByName(outlet), ...(about ? { did: about.id, name: about.name } : {}) };
      try { if (typeof C.prEvent === 'function') C.prEvent('interview', data); else prEvent(C, 'interview', data); } catch (e) { console.warn('[interview] PR', e); }
      C.save();
    };
    const onLife = (kind) => { const g = ctx.partner ? lifeAnswer(C, ctx.partner.id, kind) : 0; C.save(); return g; };
    // (what you told the pen about tonight: the hub's TONIGHT sheet opens on that card - tonightCtx)
    const toHub = () => { const lean = ctx?.tonight?.lean; if (lean && C.party?.race) { C.party.race.lean = lean; C.save(); } openCareerHub(); };
    if (ctx && C.me?.alive) showInterview(ctx, (id, dv, why) => { const r = C.relate(id, dv, why); C.save(); return r; }, (id) => C.drivers[id]?.name.split(' ').pop() || id, toHub, onTone, onLife);
    else openCareerHub();
    return;
  }
  if (!next) { toMenu(); return; }
  wk.round++; startRound();   // (the hurt sit it out: their stand-ins were named on the memorial card)
}

// ---------------------------------------------------------------------------
// dynamic racing line (L, on by default): dashes painted along the racing line for the next ~250 m, as in the F1
// games. Green, and red wherever your current speed is too high to make that point's braking (you need to be on the
// brakes now). With a pit stop called it swaps to a guide into the pit lane and up to your box.
// ---------------------------------------------------------------------------
const RL = { on: true, group: null, main: null, pitGuide: null };
const RL_RANGE = 280, RL_GREEN = [0.12, 0.92, 0.3], RL_RED = [1.0, 0.1, 0.06];
/**
 * Dashes along a polyline (pts: {x, z, s | pitU}): `dash` metres painted every `period` metres, `width` wide, each
 * bent over three points so it follows the curve. Colour (RGBA, per vertex) is written by colourLine.
 */
function dashLine(pts, width = 1.2, dash = 2.8, period = 7) {
  const n = pts.length, cum = new Float64Array(n);
  for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
  let j = 0;
  const at = (d, out) => {   // point + tangent at distance d (d only grows: the pointer walks forward)
    while (j < n - 2 && cum[j + 1] < d) j++;
    const a = pts[j], b = pts[j + 1], f = Math.min(1, Math.max(0, (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1)));
    let tx = b.x - a.x, tz = b.z - a.z; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
    out.x = a.x + (b.x - a.x) * f; out.z = a.z + (b.z - a.z) * f; out.nx = tz; out.nz = -tx; return out;
  };
  const pos = [], idx = [], dashes = [], q = {};
  for (let d0 = 0; d0 + dash <= cum[n - 1]; d0 += period) {
    const v0 = pos.length / 3;
    for (const d of [d0, d0 + dash / 2, d0 + dash]) { at(d, q); const y = 0.04 + TERRAIN.at(q.x, q.z); pos.push(q.x + q.nx * width / 2, y, q.z + q.nz * width / 2, q.x - q.nx * width / 2, y, q.z - q.nz * width / 2); }   // (on the road's own height: world/Terrain.js)
    // wound to face UP (counter-clockwise seen from above: the old ribbon faced down and was back-face culled, which
    // is why the racing line never showed)
    idx.push(v0, v0 + 1, v0 + 2, v0 + 1, v0 + 3, v0 + 2, v0 + 2, v0 + 3, v0 + 4, v0 + 3, v0 + 5, v0 + 4);
    dashes.push({ p: pts[j], v0 });
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.length / 3 * 4), 4));   // RGBA: alpha fades the far dashes, hides the rest
  g.setIndex(idx);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, toneMapped: false, fog: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.material.userData.glow = false; m.frustumCulled = false; m.renderOrder = 2; m.userData.dashes = dashes; return m;
}
function ensureRacingLine() {
  if (RL.group || !W.track) return;
  const tr = W.track;
  RL.group = new THREE.Group(); RL.group.name = 'racingline';
  const RLn = W.showLine || W.line;   // (a driver's own line where the circuit has one: makeRacingLine)
  const pts = []; for (let i = 0; i < tr.n; i++) { const f = tr.sample(tr.s[i], RLn.offset[i]); pts.push({ x: f.x, z: f.z, s: tr.s[i] }); }
  pts.push({ ...pts[0], s: tr.length });   // close the lap
  RL.main = dashLine(pts); RL.group.add(RL.main);
  if (W.pit) {
    // guide: racing line from 250 m before the pit entry, blending onto the pit-lane centre, ending at the player's box
    const P = W.pit, gp = []; const s0 = tr.wrapS(P.entryS - 250);
    for (let d = 0; d < 250; d += 2) { const s = tr.wrapS(s0 + d); const f = tr.sample(s, RLn.offsetAt(s) * (1 - d / 250) + (P.sideSign * (tr.halfWidth - 2)) * (d / 250)); gp.push({ x: f.x, z: f.z, s }); }
    const ps = P.samples; for (let i = 0; i < ps.n; i++) gp.push({ x: ps.px[i], z: ps.pz[i], pitU: ps.s[i] });
    RL.pitGuide = dashLine(gp); RL.pitGuide.visible = false; RL.group.add(RL.pitGuide);
  }
  scene.add(RL.group);
}
/**
 * Colour every dash from where it is relative to the car (sFn: metres ahead), as in the F1 games: red where the
 * circuit's speed profile (corner speeds and the braking curves into them, scaled for your tyres' grip) is lower
 * than the speed you are doing now, so the braking zone and the corner ahead show red until you have slowed
 * enough; green everywhere else. Faded out toward 250 m, invisible behind the car. forceRed: null, or a boolean
 * for every dash (the pit-lane limiter).
 */
function colourLine(mesh, sFn, car, gripF, forceRed = null) {
  const col = mesh.geometry.getAttribute('color'), arr = col.array, v = car.speed;
  for (const dsh of mesh.userData.dashes) {
    const ds = sFn(dsh.p); let a = 0, red = false;
    if (ds > -2 && ds < RL_RANGE) {
      if (forceRed != null) red = forceRed;
      else red = v > (W.lineSpeed || W.profile)[W.track.idxAtS(dsh.p.s ?? car.s)] * gripF * 1.03;
      a = 0.88 * Math.min(1, (RL_RANGE - ds) / 40);                              // fade over the last 40 m
    }
    const c = red ? RL_RED : RL_GREEN;
    for (let k = dsh.v0 * 4, e = (dsh.v0 + 6) * 4; k < e; k += 4) { arr[k] = c[0]; arr[k + 1] = c[1]; arr[k + 2] = c[2]; arr[k + 3] = a; }
  }
  col.needsUpdate = true;
}
function updateRacingLine(car) {
  if (!RL.on || !RL.group || !car) return;
  const now = performance.now(); if (now - (RL.lastT || 0) < 50) return; RL.lastT = now;   // recolouring ~3000 points: 20 Hz is enough
  const tr = W.track, L = tr.length;
  const aB = Math.sqrt(car.tyres.grip(car.wetness) / 1.0) * (1 - 0.1 * car.wetness);   // corner speeds scale with the root of the grip (cold, worn or wet tyres: slower)
  const toPit = car.pitRequested && W.pit; let ds0 = 0;
  if (toPit) { let d = W.pit.entryS - 250 - car.s; if (d > L / 2) d -= L; if (d < -L / 2) d += L; ds0 = d; }
  const showGuide = toPit && ds0 < 60 && ds0 > -900 || car.pitLane;
  RL.pitGuide && (RL.pitGuide.visible = showGuide); RL.main.visible = !showGuide;
  if (showGuide) {
    const lim = W.pit.limiter; const s0 = tr.wrapS(W.pit.entryS - 250);
    // in the lane the guide is simply "at the limiter": red when over it
    colourLine(RL.pitGuide, (p) => {
      if (p.pitU != null) return car.pitLane ? p.pitU - car.pitU : (250 - ds0carS(car, s0)) + p.pitU;
      let d = p.s - car.s; if (d > L / 2) d -= L; if (d < -L / 2) d += L; return d;
    }, car, aB, car.pitLimiter ? car.speed > lim + 0.5 : null);
  } else {
    colourLine(RL.main, (p) => { let d = p.s - car.s; if (d > L / 2) d -= L; if (d < -L / 2) d += L; return d; }, car, aB);
  }
}
function ds0carS(car, s0) { const L = W.track.length; let d = car.s - s0; if (d > L / 2) d -= L; if (d < -L / 2) d += L; return d; }

// ---------------------------------------------------------------------------
// title-screen cinematics: landmark orbits, track fly-bys and a grid crane, crossfaded every ~9 s
// ---------------------------------------------------------------------------
// Static tripod shots: landmark beauty shots framed with the track in view, and trackside shots where the
// ambient cars pass through. Each shot holds ~10 s with a very slow push-in, then crossfades.
const CINE = { shots: null, i: -1, t: 0, dur: 10, box: new THREE.Box3() };
function buildShots() {
  const tr = W.track, shots = [];
  const objShot = (o, label, rMul = 1.0, azOff = 0.6) => {
    if (!o) return; CINE.box.setFromObject(o); if (CINE.box.isEmpty()) return;
    const c = new THREE.Vector3(); CINE.box.getCenter(c); const size = new THREE.Vector3(); CINE.box.getSize(size);
    // put the camera on the track side of the landmark so cars can cross the frame
    const q = tr.nearest(c.x, c.z); const f = tr.sample(q.s); const azTrack = Math.atan2(f.z - c.z, f.x - c.x);
    shots.push({ type: 'static', label, c, r: (Math.max(size.x, size.z) * 0.8 + 60) * rMul, h: Math.max(6, Math.min(90, size.y * 0.32)), lookY: size.y * 0.42, az: azTrack + azOff });
  };
  // the shot list comes from the track definition: landmark / venue-building beauty shots and trackside tripods
  // (by arc length, negative = before the line, or by turn number: the tripod stands 90 m before the corner)
  for (const sh of (W.def.shots || [])) {
    if (sh.lm) objShot(W.landmarks?.group.children.find((c) => c.name === `lm:${sh.lm}`), sh.label, sh.rMul, sh.az);
    else if (sh.scene) objShot(W.scenery?.group.children.find((c) => c.name === `mtl:${sh.scene}` || c.name === `scene:${sh.scene}`), sh.label, sh.rMul, sh.az);
    else if (sh.building) objShot(W.venue?.group.children.find((c) => c.name === 'venue:wing'), sh.label, sh.rMul, sh.az);
    else {
      let s = sh.s ?? 0;
      if (sh.turn != null) { const c = W.def.corners.find((k) => k.n === sh.turn); s = (c && c.s != null ? c.s : 0) - 90; }
      shots.push({ type: 'trackside', label: sh.label, s: tr.wrapS(s), sd: sh.side || 1 });
    }
  }
  if (!shots.length) shots.push({ type: 'trackside', label: W.def.name.toUpperCase(), s: tr.wrapS(-160), sd: 1 });
  return shots;
}
function cinematic(dt) {
  if (!W.track) return;
  if (!CINE.shots) CINE.shots = buildShots();
  const fade = $('fade'), label = $('shot-label');
  CINE.t += dt;
  if (CINE.i < 0 || CINE.t >= CINE.dur) {
    CINE.i = (CINE.i + 1) % CINE.shots.length; CINE.t = 0;
    fade.style.opacity = '0'; label.textContent = CINE.shots[CINE.i].label; label.classList.remove('hidden');
  } else if (CINE.t > CINE.dur - 0.5 && fade.style.opacity !== '1') fade.style.opacity = '1';
  const sh = CINE.shots[CINE.i], tr = W.track, u = CINE.t / CINE.dur;
  let fov = 46;
  if (sh.type === 'static') {
    const r = sh.r * (1.0 - 0.05 * u), sway = Math.sin(CINE.t * 0.25) * 0.01;   // slow push-in, barely-there sway
    camera.position.set(sh.c.x + Math.cos(sh.az + sway) * r, sh.h + u * 2, sh.c.z + Math.sin(sh.az + sway) * r);
    camera.up.set(0, 1, 0); camera.lookAt(sh.c.x, sh.lookY, sh.c.z);
  } else {
    // tripod at the barrier, looking down the road; a passing car gets a gentle pan
    const f = tr.sample(sh.s, sh.sd * (tr.wallAt(tr.idxAtS(sh.s), sh.sd) + 5)); camera.position.set(f.x, 3.2, f.z); camera.up.set(0, 1, 0);   // just behind the barrier, wherever the run-off puts it
    const cars = S.ambient ? S.ambient.cars : []; let best = null, bd = 140;
    for (const c of cars) { const L = tr.length; let ds = c.s - sh.s; if (ds > L / 2) ds -= L; if (ds < -L / 2) ds += L; if (Math.abs(ds) < bd) { bd = Math.abs(ds); best = c; } }
    const a = tr.sample(sh.s + 140, 0); const tx = best ? best.x * 0.6 + a.x * 0.4 : a.x, tz = best ? best.z * 0.6 + a.z * 0.4 : a.z;
    if (!CINE.look) CINE.look = new THREE.Vector3(tx, 1.2, tz); CINE.look.lerp(new THREE.Vector3(tx, 1.2, tz), Math.min(1, dt * 2));
    camera.lookAt(CINE.look); fov = 42;
  }
  if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
}

// ambient cars lapping the circuit behind the title screen (and feeding the Sphere's onboards)
function ensureAmbient() {
  if (S.ambient || !W.track) return;
  const picks = [0, 4, 8, 14, 20].map((i) => ROSTER[i]);
  const cars = [], ais = [], meshes = [];
  picks.forEach((e, k) => {
    const car = new Car(W.track, { name: e.name, short: e.short, team: e.team, color: e.color, perf: e.perf, rating: e.rating, number: e.number, compound: 'MEDIUM', raceLaps: 50, assists: { tc: true, abs: true } });
    car.wetness = weatherWetness(settings.weather); car.placeOnTrack(k * (W.track.length / picks.length) + 300, W.line.offsetAt(k * (W.track.length / picks.length) + 300), 60);
    const mesh = new CarMesh(e.color, 'MEDIUM', { color2: e.color2, team: e.team, helmet: e.helmet, driver: e.name, number: e.number }); scene.add(mesh.group);
    cars.push(car); ais.push(new AIDriver(car, W.line, W.profile, W.track, { aggression: 0.5 })); meshes.push(mesh);
  });
  S.ambient = { cars, ais, meshes, world: { cars, time: 0, racing: true, lapsTotal: 999, wetness: 0, raceStart: -100 }, acc: 0, sub: 0 };
}
function stepAmbient(dt) {
  const A = S.ambient; if (!A) return;
  A.acc = Math.min(A.acc + dt, 0.1);
  while (A.acc >= 1 / 120) {
    A.acc -= 1 / 120; A.sub++; A.world.time += 1 / 120;
    if (A.sub % 2 === 0) for (const ai of A.ais) ai.update(1 / 60, A.world);
    for (const c of A.cars) { c.step(1 / 120, A.world); c.tyres.wear = Math.min(c.tyres.wear, 0.3); }
  }
  A.cars.forEach((c, i) => { A.meshes[i].update(c, dt); A.meshes[i].detail(camera.position, carZoom()); });
}
function clearAmbient() {
  const A = S.ambient; if (!A) return;
  for (const m of A.meshes) { scene.remove(m.group); m.dispose(); } S.ambient = null;
}

/** Four feeds for the Sphere's F1 stream: the leader's T-cam, a second car's T-cam (you, when racing), the T1
 *  trackside camera and a wide shot of the Sphere itself (which shows the previous frame's stream: it films itself). */
function feedPoses() {
  const d = S.director, tr = W.track;
  const cars = d ? d.positions.filter((c) => !c.inPit && !c.retired) : (S.ambient ? S.ambient.cars : []);
  const sphere = W.sphereInfo ? POSES.landmark(W.sphereInfo.center, W.sphereInfo.radius * 3.0, W.sphereInfo.radius * 0.55, (W.faceAngle0 || 0)) : POSES.trackside(tr, 2200, 1, cars);
  const side = POSES.trackside(tr, 180, 1, cars);
  if (!cars.length) return [POSES.trackside(tr, 3900, -1, []), POSES.trackside(tr, 1800, -1, []), side, sphere];
  const pick = (i) => cars[Math.min(i, cars.length - 1)];
  const second = d && S.player && !S.player.inPit && !S.player.retired && S.player !== pick(0) ? S.player : pick(1);
  return [POSES.onboard(pick(0)), POSES.onboard(second), side, sphere];
}
function tr0() { return W.track.length - 200; }

// ---------------------------------------------------------------------------
// frame loop
// ---------------------------------------------------------------------------
let last = performance.now(); let simTime = 0;
// dynamic resolution (below): the render scale steps down while the frame rate is under ~48 fps and back up when the
// display's rate holds; the pixel ratio is clamped to 1.5 at the top, 0.6 of that at the bottom
const RES = { base: Math.min(window.devicePixelRatio, 1.5), scale: 1, ema: 16, t: 0, calls: 0, tris: 0, frames: 0, msSum: 0 };
function applyResolution() { renderer.setPixelRatio(RES.base * RES.scale); renderer.setSize(VIEW.w, VIEW.h, false); }
/**
 * Dynamic resolution, without the stutter it used to cause. It goes by the time between frames (what the player
 * sees: the GPU's work holds the next frame back - the main thread's own share of a frame is a few ms, so timing that
 * alone never saw a GPU-bound machine struggle). Changing the canvas's size reallocates the whole anti-aliased drawing
 * buffer (80-400 ms frozen at 1440p), so the scale moves rarely: down after 4 s below ~48 fps (two steps at once below
 * ~33), up again after 10 s held at the display's rate - and if that trial is too slow, it is not tried again for a
 * minute. Hitch frames (a resize, a shader compiling) don't count.
 */
function dynamicResolution(intervalMs) {
  RES.frames++; RES.msSum += intervalMs;
  if (document.hidden || S.paused) return;   // (a background tab is throttled by the compositor, not by our workload)
  if (intervalMs > 80) return;               // (a one-off hitch, not the workload)
  const now = performance.now();
  RES.ema += (intervalMs - RES.ema) * 0.05; RES.t += intervalMs; RES.since = (RES.since || 0) + intervalMs;
  if (RES.t < 1000) return; RES.t = 0;
  RES.slow = RES.ema > 21 ? (RES.slow || 0) + 1 : 0; RES.fast = RES.ema < 17.8 ? (RES.fast || 0) + 1 : 0;
  if (RES.slow >= 4 && RES.since > 4000 && RES.scale > 0.6 && !(HANG.api && HANG.party)) {   // (never blurs a party: people are checked against photos at talk distance)
    if (RES.trialAt && now - RES.trialAt < 20000) RES.noTrialUntil = now + 60000;   // (the last step up was one too far)
    RES.scale = Math.max(0.6, +(RES.scale - (RES.ema > 30 ? 0.2 : 0.1)).toFixed(2)); RES.since = 0; RES.slow = 0; RES.trialAt = 0; applyResolution();
  } else if (RES.fast >= 10 && RES.since > 10000 && RES.scale < 1 && now > (RES.noTrialUntil || 0)) {
    RES.scale = Math.min(1, +(RES.scale + 0.1).toFixed(2)); RES.since = 0; RES.fast = 0; RES.trialAt = now; applyResolution();
  }
}
/** where the fireworks are fired from: beyond the barriers either side of the straight after the line */
function fireworkSites() {
  const tr = W.track, out = [];
  for (const s of [60, 200, 340, 480]) for (const side of [-1, 1]) { const f = tr.sample(tr.wrapS(s), side * (tr.wallAt(tr.idxAtS(tr.wrapS(s)), side) + 40)); out.push({ x: f.x, z: f.z }); }
  return out;
}
/** the Sphere's shell is inside the camera's view (and not lost in the fog) */
const _frus = new THREE.Frustum(), _pm = new THREE.Matrix4(), _sph = new THREE.Sphere();
function sphereInView() {
  const s = W.landmarks?.sphere, info = W.sphereInfo; if (!s || !info) return false;
  _sph.center.copy(info.center); _sph.radius = info.radius * 1.15;
  if (_sph.center.distanceTo(camera.position) - _sph.radius > 4000) return false;   // (the fog has 86 % of it there)
  camera.updateMatrixWorld(); _pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _frus.setFromProjectionMatrix(_pm);
  return _frus.intersectsSphere(_sph);
}
/**
 * Sphere canvas content: draw whichever canvas show is on (or fading in) right now - only while the Sphere is in the
 * picture (a 1024 px canvas drawn and uploaded 20 times a second is not free); its face turns with simTime -> the
 * Sphere is in view this frame
 */
function sphereShow() {
  const sphereSeen = sphereInView();
  if (W.landmarks?.sphere) {
    const u = W.landmarks.sphere.material.uniforms; const a = (W.faceAngle0 || 0) + simTime * (2 * Math.PI / 300);
    u.uFace.value.set(Math.cos(a), 0, Math.sin(a)); u.uRight.value.set(Math.sin(a), 0, -Math.cos(a));
    const k = Math.floor((simTime % (SPHERE_SEQUENCE.length * SHOW_SECONDS)) / SHOW_SECONDS);
    const cur = SPHERE_SEQUENCE[k], next = SPHERE_SEQUENCE[(k + 1) % SPHERE_SEQUENCE.length];
    const cs = FINALE.on ? 'champion' : CANVAS_SHOWS.has(cur) ? cur : CANVAS_SHOWS.has(next) ? next : null;
    if (cs && (sphereSeen || FINALE.on)) { show.draw(cs, simTime); const u = W.landmarks.sphere.material.uniforms; u.uShowBg.value.set(SHOW_BG[cs]); u.uTwoSided.value = SIDES[cs]; }
  }
  return sphereSeen;
}
/**
 * The broadcast atlas is only refreshed while the F1 stream is on the Sphere (or fading in) and the Sphere is in the
 * picture (seen): each tile is a full extra scene render (one every other frame: each view still moves 7-8 times a
 * second)
 */
function sphereFeed(seen) {
  if (W.landmarks?.sphere && seen && (RES.frames & 1) === 0) {
    const k = Math.floor((simTime % (SPHERE_SEQUENCE.length * SHOW_SECONDS)) / SHOW_SECONDS);
    const cur = SPHERE_SEQUENCE[k], next = SPHERE_SEQUENCE[(k + 1) % SPHERE_SEQUENCE.length], tin = simTime % SHOW_SECONDS;
    if (cur === 'broadcast' || (next === 'broadcast' && tin > SHOW_SECONDS - 4)) feed.update(renderer, scene, feedPoses(), [W.stands?.group].filter(Boolean));
  }
}
/** distant generic buildings (cells) are skipped entirely: the fog has faded them anyway */
const BUILDING_CUTOFF = 1800;
function cullBuildings() {
  const b = W.buildings; if (!b) return;
  for (const m of b.children) { const s = m.geometry.boundingSphere; m.visible = s.center.distanceTo(camera.position) - s.radius < BUILDING_CUTOFF; }
  // (a circuit's own scenery cells - car parks, cars, scrub - each with its own cut-off)
  const sg = W.scenery?.group; if (sg) for (const m of sg.children) { const cut = m.userData.cut; if (!cut) continue; const s = m.boundingSphere || m.geometry.boundingSphere; if (s) m.visible = s.center.distanceTo(camera.position) - s.radius < cut; }
  cullDetail();
}
/** thin track details (lines, kerbs, banners, pit paint) are not drawn beyond their cut-off (TrackBuilder DETAIL_CUT) */
function cullDetail() {
  const t = W.trackMesh; if (!t) return;
  const cp = camera.position;
  for (const ch of t.children) {
    const cut = ch.userData.cut; if (!cut) continue;
    if (ch.isMesh) { const s = ch.geometry.boundingSphere, c = s.center, p = ch.position; ch.visible = Math.hypot(c.x + p.x - cp.x, c.y + p.y - cp.y, c.z + p.z - cp.z) - s.radius < cut; continue; }
    for (const m of ch.children) { const s = m.geometry.boundingSphere; m.visible = s.center.distanceTo(cp) - s.radius < cut; }
  }
}
/** the engine was heard live this frame (you driving, or the car you watch): any frame it isn't - paused, photo mode, a
 *  flashback, the pit menu, the crash camera, a replay or the news, the menus - it fades out instead of droning on */
let audioLive = false;
function frame(now) {
  requestAnimationFrame(frame);
  if (!audioLive) audio?.quiet?.(0.06); audioLive = false;   // (cut, not a long fade)
  const interval = now - last, dt = Math.max(0, Math.min(0.1, interval / 1000)); last = now;   // never negative (tab switches, manual frame calls)
  fitViewport();   // an embedding frame may resize the canvas without a window resize event
  if (NEWS.on) { newsFrame(dt); return; }   // (the news broadcast has the screen)
  if (PRE.on) { preFrame(dt); return; }     // (the pre-race show: the race waits on the grid)
  if (HANG.on) { hangFrame(dt, interval); return; }   // (an evening out, in the world: ui/Hangout.js drives the camera)
  const d = S.director, p = S.player;

  if (PHOTO.on) {
    // photo mode: the world is frozen, the camera flies free
    // (leaving: nothing of the free camera may run after exitPhoto has put the camera back on the car this frame)
    if (input.pressed('Escape')) exitPhoto();
    else {
      if (input.pressed('KeyH')) { PHOTO.hud = !PHOTO.hud; $('hud').classList.toggle('hidden', !PHOTO.hud); }
      if (input.pressed('KeyP') || input.pressed('Space')) setPhotoLive(!PHOTO.live);
      updatePhoto(dt);
    }
  } else {
    releasePhotoAI();
    if (telView.open) { if (input.pressed('Escape') || input.pressed('KeyT')) telView.close(); }   // the report sits over the game
    else if (input.pressed('KeyT') && d && !hud.pit.open) openTelemetry(!S.paused);
    else if (!S.fb && input.pressed('Escape') && d && !d.done && !hud.pit.open) setPaused(!S.paused);
    if (S.fb) updateFlashback(dt);
    else if (d && !S.paused && !d.done && !hud.pit.open && !FINALE.on && !NEWS.cancel && !NEWS.cancelled && input.pressed('Backspace')) startFlashback();   // (no rewinding a life lost)
    if (input.pressed('KeyV')) camCtl.toggle();
    camCtl.lookIn = input.look; camCtl.back = input.lookBack;   // Q / E look left / right, C look back (updated with the input below)
    if (input.pressed('KeyL') && d) {
      RL.on = !RL.on; ensureRacingLine(); RL.group.visible = RL.on; hud.msg(RL.on ? 'RACING LINE ON' : 'RACING LINE OFF', '', 1.2);
      for (const b of document.querySelectorAll('#opt-line button')) b.classList.toggle('sel', b.dataset.v === (RL.on ? 'on' : 'off'));   // the setup option follows
    }
    if (input.pressed('KeyH')) { S.halo = !S.halo; for (const m of S.meshes.values()) m.setHalo(S.halo); }
    if (input.pressed('KeyM')) audio.toggleMute();
    if (S.spectating && d && !S.paused && input.pressed('Enter')) { S.ff = !S.ff; hud.msg(S.ff ? 'FAST-FORWARD ×6' : 'NORMAL SPEED', '', 1.2); }
    if (S.spectating && d && !d.done && !S.paused && !S.simming) { if (input.pressed('Tab')) watchNext(); if (input.pressed('KeyF')) simToEnd(); }
    if (d && !d.done && !S.spectating && !S.paused && d.mode === 'quali' && p && !p.autopilot && (p.qLaps || 0) >= 1 && input.pressed('KeyF')) simToEnd();   // (one timed lap in: skip the second)
    if (d && p && !S.paused && !d.done && !S.spectating) {
      if (hud.pit.open) { for (const k of ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit7', 'Digit8', 'Digit9', 'Enter']) if (input.pressed(k)) hud.handlePitKey(k); }
      if (p.pitAuto && p._pull && !p._pull.done && (input.pressed('Space') || input.pressed('Enter') || input.padATap)) d.pullIn(p);   // (the pull-in into your box, timed)
      if (input.pressed('KeyP') && d.mode !== 'quali') {
        const on = d.requestPit(p);
        if (on) { hud.openPit(p, (plan) => { p.pitPlan = plan; engineer.say(`Copy, box this lap for ${plan.compound.toLowerCase()}s${plan.repair !== 'none' ? ' and repairs' : ''}. Follow the line into the pit entry, the limiter is automatic.`, 3); }); hud.msg('PIT REQUESTED · choose tyres & repairs', 'warn', 3); }   // the action pauses while the menu is open
        else { hud.closePit(); hud.msg('PIT REQUEST CANCELLED', '', 2); engineer.say('Understood, staying out.', 2); }
      }
      // (no reset: drive it back - hold the brake at a standstill for reverse; beached, hold R to retire)
    }
  }
  // (a driver hurt: a second and a half for the rest of the accident to play out, then the news - crashNews)
  if (d && d.mode === 'race' && !d.done && !NEWS.fading && !S.paused && S.cars.some((c) => c.injured && !c.standInFor && !c._newsShown && (c.injuryClip || c._clipAt == null))) { NEWS.wait += dt; if (NEWS.wait > 1.5) crashNews(); }
  if (NEWS.cancel && d && !d.done && !S.paused && !NEWS.fading) cancelFrame(dt);   // (a race cancelled: the drive back, then the news)
  const halted = (PHOTO.on ? !PHOTO.live : S.paused) || hud.pit.open || !!S.fb || NEWS.fading || !!S.simming;

  if (d && !halted) {
    input.update(dt, p ? p.speed : 0);
    // the crash director slows the race (the camera and the screen keep real time); the player's controls are off
    // while the wreck is still moving - the steering nudges it (aftertouch)
    const ts = crashCam.on ? crashCam.timeScale : 1, sdt = dt * ts, crashing = crashCam.on && !crashCam.resolved;
    if (crashing) crashCam.aftertouch(input.steer, sdt);
    for (let k = S.spectating && S.ff ? 6 : 1; k > 0; k--) d.update(sdt, crashing ? CRASH_INPUT : input);
    if (p && p.crashLog && p.crashLog.length && !S.spectating) {
      for (const e of p.crashLog.splice(0)) { if (!crashCam.on) { if ((e.kind === 'launch' || e.g >= CRASH_G) && !d.done) startCrash(p, e); } else if (!crashCam.resolved) crashHit(p, e); }
    }
    if (crashing && (p.air || p.speed > 4) && Math.random() < sdt * 8) debris.burst(p.x, p.z, p.air ? p.wvx : p.worldVel()[0], p.air ? p.wvz : p.worldVel()[1], 2, S.meshes.get(p)?.livery.color.getHex() ?? 0x111111);   // (it sheds pieces as it goes)
    // (a player out of the race: the session does not end while the crash plays out, nor for 3 s of the orbit after)
    if (crashCam.on && d.endTimer > 0 && (!crashCam.resolved || crashCam.endT < 3)) d.endTimer = Math.max(d.endTimer, 0.5);
    // (control back only once the car has settled on its wheels and can drive on; a wreck keeps the slow orbit)
    if (crashCam.on && crashCam.resolved && p && !p.air && !p.wreck && !p.retired && crashCam.endT > 0.9) endCrash();
    simTime += sdt;
    for (const c of S.cars) { const m = S.meshes.get(c); m.update(c, sdt); if (c.hiddenAway || c._povHide) m.group.visible = false; }   // (hiddenAway: a car recovered to its garage in qualifying)   // a stopped retired car stays where the marshals set it down (RaceDirector)
    syncSafetyCar(d, sdt);
    S.crews?.update(d, camera, d.time, sdt); S.flags?.update(d, camera, d.time);
    if (S.fireworks) {
      // Las Vegas: the fireworks go up over the start/finish straight the moment the winner crosses the line (not for
      // a race stopped by an accident)
      if (d.leaderFinished && !d.cancelled && !NEWS.cancel && !S.fireworks.fired) { S.fireworks.fired = true; S.fireworks.start(fireworkSites(), 26, audio); }
      S.fireworks.update(sdt, camera);
    }
    debris.update(sdt); fire.update(sdt, camera, renderer.domElement.height); chunks.update(sdt);
    if (p) updateRacingLine(p);
    pitTiming.update(p, d.time, sdt, camCtl.mode === 'cockpit'); if (p && !S.spectating) strategyCalls(d, p);
    // (the turn-in point for your pull-in, painted across the lane: you can time it by eye from the cockpit)
    {
      const P = W.pit, pl = p?._pull;
      if (pl && !pl.done && P) {
        if (!S.pullMark) {
          // a band across the lane and a lit post at either side of it: seen over the nose from the cockpit
          const mat = new THREE.MeshBasicMaterial({ color: 0xffb000, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
          const g = new THREE.Group(), band = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.4).rotateX(-Math.PI / 2), mat); g.add(band); g.userData = { band, mat, posts: [] };
          for (const s of [-1, 1]) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, 0.12).translate(0, 0.6, 0), new THREE.MeshBasicMaterial({ color: 0xffb000 })); g.add(post); g.userData.posts.push([post, s]); }
          S.pullMark = g; scene.add(g);
        }
        const ps = P.samples, i = Math.max(0, Math.min(ps.n - 1, Math.round(pl.at / ps.ds))), m = S.pullMark;
        m.visible = true; m.position.set(ps.px[i], 0.03 + TERRAIN.at(ps.px[i], ps.pz[i]), ps.pz[i]); m.rotation.set(0, Math.atan2(-ps.nz[i], ps.nx[i]), 0); m.userData.band.scale.set(P.halfWidth * 2, 1, 1);
        for (const [post, s] of m.userData.posts) post.position.x = s * (P.halfWidth + 0.2);
        m.userData.mat.opacity = 0.55 + 0.4 * Math.abs(Math.sin(d.time * 6));
      } else if (S.pullMark) S.pullMark.visible = false;
    }
    if (p && W.pit) {   // pit-box cue: floating marker over your garage while a stop is called / you are in the lane, distance readout in the HUD
      const box = W.pit.boxFor(p.boxIdx ?? 0); const show = (p.pitRequested || p.pitLane) && !p.inPit && !p.retired;
      W.pitBoxes?.update(simTime, show);
      hud.boxCue(p.pitLane && p.pitLaneState !== 'out' ? box.u - p.pitU : null, p.color);
    }
    if (FINALE.on) { updateFinale(dt); cockpitVisor(p, false); }
    else if (POV.on) povFrame(dt);
    else if (p && !PHOTO.on) { if (crashCam.on) crashCam.update(dt, dt * crashCam.timeScale); else camCtl.update(p, dt, W.track); cockpitVisor(p, camCtl.mode === 'cockpit' && !crashCam.on && !d.done); hud.update(p, { mode: d.mode, lapsTotal: d.lapsTotal, positions: d.positions, time: d.time, qualiStarted: d.qualiStarted, sectors: d.sectors, delta: (c) => d.telemetry?.liveDelta(c, d.time), sc: d.sc?.hudState(), gap: (a, b) => d.radio?.gap(a, b), drs: (c) => d.drs?.state(c) }, dt); hud.drawMinimap(S.cars, p); audio.update(p, dt); audioLive = true; }
    else if (p && PHOTO.hud) { hud.update(p, { mode: d.mode, lapsTotal: d.lapsTotal, positions: d.positions, time: d.time, qualiStarted: d.qualiStarted, sectors: d.sectors, delta: (c) => d.telemetry?.liveDelta(c, d.time), sc: d.sc?.hudState(), gap: (a, b) => d.radio?.gap(a, b), drs: (c) => d.drs?.state(c) }, dt); hud.drawMinimap(S.cars, p); }
  } else if (d && hud.pit.open && p) {
    hud.update(p, { mode: d.mode, lapsTotal: d.lapsTotal, positions: d.positions, time: d.time, qualiStarted: d.qualiStarted, sectors: d.sectors, delta: (c) => d.telemetry?.liveDelta(c, d.time), sc: d.sc?.hudState(), gap: (a, b) => d.radio?.gap(a, b), drs: (c) => d.drs?.state(c) }, dt);
  } else if (!d && !W.home) {
    // (the ambient field only behind the menus themselves: not between a weekend's sessions, not under the results)
    simTime += dt; if (!S.weekend && !PRE.show && !PRE.walk) { ensureAmbient(); stepAmbient(dt); } else clearAmbient(); cinematic(dt);
  }
  if (d && S.ambient) clearAmbient();
  standsHD(FINALE.on || (!d && !W.home), dt, simTime);   // (the finale's shots, the title shots behind the menus: the stands full of people)
  if (W.home || !W.track) { input.endFrame(); return; }   // home screen / building: no 3D scene to draw
  rain.update(camera, halted ? 0 : dt);
  if (W.lights) W.lights.update(camera.position, simTime);
  for (const m of S.meshes.values()) m.detail(camera.position, carZoom());
  if (W.stands) W.stands.update(simTime);
  W.scenery?.update?.(simTime, camera, S.player);   // (the TV helicopter covers the car you follow, whatever the camera does)
  if (W.landmarks) for (const fn of W.landmarks.anims) fn(simTime, halted ? 0 : dt);
  if (W.buildings) W.buildings.material.uniforms.uTime.value = simTime;
  const sphereSeen = sphereShow();
  input.endFrame();
  if (!halted) sphereFeed(sphereSeen);
  cullBuildings();
  env.sky.position.copy(camera.position);   // the dome travels with the camera: its far side never crosses the far plane (that showed as a flat "mountain")
  renderView();
  RES.calls = renderer.info.render.calls; RES.tris = renderer.info.render.triangles;
  dynamicResolution(interval);
}

// ---------------------------------------------------------------------------
{
  document.body.classList.add('home');   // (also in index.html; an Artifact host supplies its own <body>)
  window.__F1 = { PRE, W, S, settings, scene, camera, renderer, input, hud, AIDriver, AI_TUNE, AI_CAL, applyCalibration, chunks, debris, fire, respawnMesh,
    /** (tests: one frame drawn as the crash camera draws it - through its composer - and the programs that compiled) */
    crashFrame() { const n0 = renderer.info.programs.length; ensureCrashComposer(); crashPass.uniforms.uBlur.value = 0.6; crashPass.uniforms.uSat.value = 1.5; crashComposer.render(); return renderer.info.programs.length - n0; },
    /** (tools: a calibration applied, the racing line and the speed profile rebuilt from it - the next session's AI drives them) */
    rebuildLine(cal) { applyCalibration(W.track, cal === undefined ? AI_CAL[W.def.id] : cal); const r = makeRacingLine(W.track, W.def); W.line = r.line; W.profile = r.profile; W.lineSpeed = r.shown; W.showLine = r.showLine; if (RL.group) { scene.remove(RL.group); RL.group = null; } return { fixed: !!r.line.fixed }; }, camCtl, setTimeOfDay, corridorSigned, CINE, cinematic, get feed() { return feed; }, get show() { return show; }, frame, ensureAmbient, PHOTO, TRACKS, switchTrack, NEWS, playNews, nextAfterResults, crashNews, helmetURL, openCareerHub, simToEnd, strings, get audio() { return audio; },
    restart() { if (settings.driver == null) settings.driver = 0; /* test hook: the field needs a player */ S.noStrategy = !window.__keepStrategy; endSession(); $('results').classList.add('hidden'); $('quali-panel').classList.add('hidden'); $('pause').classList.add('hidden'); S.paused = false; startWeekend(); if (PRE.show && !window.__keepPre) PRE.show.finish(); },   // (tests: no pre-race show unless asked for)
    // the driver's life (tests): the engines as modules, the career class, the scuffle module, the walk, the evening out.
    // Test switches read where they matter: window.__forceStars (ui/PreRace.js), window.__forceJab, window.__qteAuto,
    // window.__qteChoice (ui/Brawl.js), window.__hangoutBuzz / __hangoutPaps / __hangoutFast (ui/Hangout.js), and for the
    // night after a race window.__partyDrunk (start at a drink level), __partyBrawl (the drama goes to the scuffle),
    // __partyPaps (the exit's photo roll always hits), __partyFast (the night's clock runs fast) - ui/PartyPlay.js
    Morale, PR, Celebs, Licence, Agenda, TechTree, Social, People, Career, BrawlMod, Party, get walk() { return PRE.walk; }, HANG, hangoutAnchor, paddockAnchor, careerHangout, formBriefing, interviewCtx, lifeAnswer, Avatar, syncLooks,
    /** an evening out from the console: hangout('rooftop', [{ kind: 'driver', id: 'lando-norris', name: 'Lando Norris' }]) -> the result, once it is over */
    hangout(venue = 'rooftop', guests = [], c = null) { return new Promise((res) => careerHangout({ venue, guests, key: 'hangout' }, res, c)); },
    /**
     * The night after a race from the console: party('vegasclub' | 'teamparty' | 'londonclub', { c, launch, act, carry,
     * drunk, brawl, paps, fast }) -> the Hangout result once it is over (not settled: Party.partyResult(c, r) does that).
     * The launch: o.launch, else Party.partyLaunch for the save's offer at that venue, else a bare one for the venue (no
     * guests, no drama). drunk / brawl / paps / fast set the window switches above.
     */
    party(venue = 'vegasclub', o = {}) {
      for (const [k, w] of [['drunk', '__partyDrunk'], ['brawl', '__partyBrawl'], ['paps', '__partyPaps'], ['fast', '__partyFast']]) if (o[k] != null) window[w] = o[k];
      const c = o.c || Career.load() || null;
      let L = o.launch || null;
      if (!L && c && typeof Party.partyOffers === 'function') { try { const off = (Party.partyOffers(c) || []).find((x) => x.venue === venue); if (off) L = Party.partyLaunch(c, off.id, o.act || 1, o.carry || null); } catch (e) { console.warn('[party] launch', e); } }
      if (!L) L = { key: 'party', partyId: `test|${venue}`, venue, host: venue === 'teamparty' ? 'team' : 'club', track: o.track || (venue === 'londonclub' ? 'silverstone' : venue === 'vegasclub' ? 'lasvegas' : W.def?.id || 'lasvegas'), night: true, act: o.act || 1, carry: o.carry || null, guests: o.guests || [], drama: [] };
      return new Promise((res) => careerHangout(L, res, c));
    },
    /** headless fast-forward (testing/telemetry): advances the active session by `sec` seconds without rendering */
    stepSim(sec, step = 1 / 60) { const d = S.director; if (!d) return 'no session'; const n = Math.round(sec / step); for (let i = 0; i < n && !d.done; i++) { input.update(step, S.player ? S.player.speed : 0); d.update(step, input); } return d.time; },
    /** render stats: draw calls / triangles of the last frame, average CPU ms per frame since the last call, current render scale */
    perf() { const r = { calls: RES.calls, triangles: RES.tris, avgFrameMs: +(RES.msSum / Math.max(1, RES.frames)).toFixed(2), frames: RES.frames, renderScale: RES.scale, pixelRatio: renderer.getPixelRatio() }; RES.frames = 0; RES.msSum = 0; console.info('[perf]', r); return r; },
  };
  requestAnimationFrame(frame);
}
