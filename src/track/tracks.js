// Track registry. Each definition tells the geo pipeline how to chain the circuit (ordered legs of OSM road names
// for a street circuit, or an ordered list of raceway way ids for a permanent circuit), where the pit lane is,
// and how the venue is dressed (ground, kerbs, sponsor panels, run-off paint, landmarks, grandstands).
export const TRACKS = {
  lasvegas: {
    id: 'lasvegas',
    name: 'Las Vegas Strip Circuit',
    title: ['LAS VEGAS', 'STRIP CIRCUIT'],
    // outline for the home-screen card (SVG path in a 100 x 100 box, generated from the built track)
    outline: 'M69.8 88.1L71.0 86.8L72.2 85.5L73.3 84.2L74.5 82.9L75.6 81.6L76.1 80.0L74.9 78.8L73.2 78.5L71.5 78.9L70.1 79.9L68.8 81.0L67.4 82.0L65.7 82.2L64.0 81.7L62.6 80.6L61.7 79.2L61.4 77.5L61.3 75.7L61.3 74.0L61.3 72.2L61.3 70.5L61.3 68.7L61.3 67.0L61.2 65.2L61.2 63.5L61.2 61.8L61.2 60.0L61.2 58.3L61.2 56.5L61.2 54.8L61.2 53.0L61.2 51.3L61.2 49.5L61.2 47.8L61.1 46.0L61.1 44.3L61.1 42.6L61.1 40.8L61.1 39.1L61.4 37.5L63.2 37.5L64.9 37.5L66.7 37.5L68.4 37.5L70.2 37.6L71.9 37.6L73.2 36.6L74.1 35.1L74.9 33.6L75.8 32.1L76.6 30.5L76.0 29.1L75.0 27.9L75.2 26.1L75.5 24.4L75.8 22.7L74.5 21.9L72.8 21.9L71.1 21.8L69.3 21.8L67.6 21.7L65.8 21.7L64.1 21.6L62.3 21.7L60.7 21.3L59.2 20.7L57.5 20.5L55.8 20.1L54.4 19.2L53.1 17.9L52.2 16.5L51.5 14.9L50.9 13.3L50.2 11.6L49.6 10.0L48.5 8.6L47.2 7.4L45.8 6.5L44.1 6.0L42.4 5.6L40.7 5.3L39.0 5.0L38.1 6.5L37.3 8.0L36.5 9.6L35.7 11.1L34.9 12.7L34.1 14.2L33.2 15.8L32.4 17.3L31.5 18.8L30.7 20.3L29.8 21.8L29.1 23.4L28.4 25.0L27.7 26.7L27.2 28.3L26.7 30.0L26.2 31.7L25.7 33.3L25.3 35.0L25.0 36.7L24.7 38.5L24.5 40.2L24.3 41.9L24.1 43.7L24.0 45.4L23.9 47.2L23.9 48.9L23.9 50.7L23.9 52.4L23.9 54.1L23.9 55.9L24.0 57.6L24.0 59.4L23.9 61.1L23.8 62.9L23.8 64.6L23.7 66.4L23.7 68.1L23.7 69.9L23.6 71.6L23.5 73.3L23.5 75.1L23.4 76.8L23.4 78.6L23.3 80.3L23.3 82.1L23.3 83.8L23.3 85.6L23.3 87.3L23.3 89.0L23.5 90.8L24.7 92.0L25.9 93.3L27.2 94.4L28.9 94.8L30.7 94.9L32.4 94.9L34.1 94.9L35.9 94.9L37.6 94.9L39.4 95.0L41.1 95.0L42.9 95.0L44.6 95.0L46.4 95.0L48.1 95.0L49.9 95.0L51.6 95.0L53.3 95.0L55.1 95.0L56.8 95.0L58.6 95.0L60.3 95.0L62.0 94.7L63.6 94.0L65.2 93.2L66.4 92.0L67.6 90.7L68.8 89.4Z',
    geojson: 'data/lasvegas.geojson',
    // Origin = OSM circuit relation node with role "start" (start/finish line on the pit straight)
    origin: [-115.1618816, 36.1092838],
    // Chain begins where Harmon Ave meets the purpose-built pit straight (T17 exit)
    chainStart: [-115.1639015, 36.1079696],
    legs: [
      { roads: ['Las Vegas Strip Circuit'], to: [-115.1639284, 36.1111544] },                           // S/F straight, T1-T4 onto Koval
      { roads: ['Koval Lane', 'Las Vegas Strip Circuit'], to: [-115.1639952, 36.1192075] },             // Koval north to T5
      // T5-T9: the loop around the east side of the Sphere. The export has no raceway ways here, only the
      // circuit relation's member nodes, so these are explicit waypoints.
      { via: [[-115.1611853, 36.1191725], [-115.1601131, 36.1207408], [-115.1606710, 36.1209393], [-115.1604062, 36.1222364]] },
      { roads: ['Sands Avenue', 'Las Vegas Strip Circuit'], to: [-115.1640396, 36.1222899] },           // T9-T10 west on Sands to Koval
      { roads: ['Las Vegas Strip Circuit', 'Sands Avenue', 'Spring Mountain Road', 'South Las Vegas Boulevard'], to: [-115.1693784, 36.1255587] }, // T10-T12
      { roads: ['South Las Vegas Boulevard'], to: [-115.1729800, 36.1086800] },                        // The Strip south to T14
      { roads: ['East Harmon Avenue', 'South Las Vegas Boulevard'], to: [-115.1639015, 36.1079696] },  // Harmon east, T15-T17
    ],
    pitLaneWayId: 'way/1223479152',
    // DRS: Koval Lane (detection in the T1-T4 complex, T4 -> T5) and the Strip (detection at T11, T12 -> T14)
    drs: [
      { detect: { turn: 1, at: 'start', off: 220 }, open: { turn: 4, at: 'end', off: 80 }, close: { turn: 5, at: 'start', off: -60 } },
      { detect: { turn: 11, at: 'start', off: 0 }, open: { turn: 12, at: 'end', off: 80 }, close: { turn: 14, at: 'start', off: -60 } },
    ],
    direction: 1,
    width: 15,
    laps100: 50,
    line: 'optimal',                // minimum-curvature line: the kinks (T6-T9) open up over the width ...
    lineMargin: 2.5,                // ... kept 1.5 m off the white lines (walls, not grass, if a car runs wide)
    // ---- venue dressing
    defaultTime: 'night',
    ground: 'city',                 // sandy lots with a faint street grid
    kerb: 'cards',                  // the playing-card kerbs
    runoffText: 'LAS VEGAS',
    landmarkSet: 'lasvegas',        // the 25 procedural landmark overrides
    autoStands: true,               // temporary grandstands auto-placed in empty lots
    zoneSeq: [0, 3, 1, 2, 0, 4, 5, 7, 1, 6, 0, 2, 3, 0, 1, 5],                 // sponsor panel per 180 m wall zone
    sponsorZone: { panel: 8, fromTurn: 5, toTurn: 10, before: 120, after: 40 },   // the T-Mobile Zone at Sphere
    runoffPaint: [{ turns: [1], color: [0.82, 0.1, 0.13] }, { turns: [5, 6, 7, 8, 9], color: [0.84, 0.05, 0.42] }, { turns: [12, 14], color: [0.06, 0.58, 0.52] }],
    runoffDecalTurns: [1, 5, 12, 14],
    shots: [
      { lm: 'sphere', label: 'SPHERE', rMul: 1.0, az: 0.5 }, { s: -160, label: 'PIT STRAIGHT', side: 1 },
      { lm: 'eiffel', label: 'PARIS LAS VEGAS', rMul: 1.05, az: -0.5 }, { s: 3900, label: 'THE STRIP', side: -1 },
      { lm: 'highroller', label: 'HIGH ROLLER', rMul: 1.0, az: 0.7 }, { s: 150, label: 'TURN 1', side: 1 },
      { lm: 'bellagio', label: 'BELLAGIO', rMul: 1.1, az: 0.4 }, { s: 1000, label: 'KOVAL LANE', side: -1 },
      { lm: 'grandprix', label: 'GRAND PRIX PLAZA', rMul: 1.0, az: 0.9 }, { s: 5300, label: 'HARMON AVENUE', side: 1 },
      { lm: 'cosmopolitan', label: 'COSMOPOLITAN', rMul: 1.0, az: -0.6 }, { s: 2600, label: 'SANDS AVENUE', side: 1 },
      { lm: 'wynn', label: 'WYNN & ENCORE', rMul: 1.1, az: 0.5 }, { s: 1800, label: 'SPHERE LOOP', side: -1 },
      { lm: 'venetian', label: 'THE VENETIAN', rMul: 1.05, az: -0.4 },
    ],
    // Named corners (approximate apex lon/lat) used for HUD, AI error zones and telemetry
    corners: [
      { n: 1, ll: [-115.16036, 36.11070], type: 'hairpin-L' },
      { n: 2, ll: [-115.16053, 36.11107], type: 'L' },
      { n: 3, ll: [-115.16292, 36.11044], type: 'R' },
      { n: 4, ll: [-115.16393, 36.11115], type: 'R' },
      { n: 5, ll: [-115.1639952, 36.1192075], type: 'R' },
      { n: 6, ll: [-115.1611853, 36.1191725], type: 'L' },
      { n: 7, ll: [-115.1601131, 36.1207408], type: 'L' },
      { n: 8, ll: [-115.1606710, 36.1209393], type: 'R' },
      { n: 9, ll: [-115.1604062, 36.1222364], type: 'L' },
      { n: 10, ll: [-115.1640396, 36.1222899], type: 'R' },
      { n: 11, ll: [-115.1668882, 36.1247170], type: 'R' },
      { n: 12, ll: [-115.1693784, 36.1255587], type: 'L-90' },
      { n: 13, ll: [-115.1725210, 36.1201017], type: 'kink' },
      { n: 14, ll: [-115.1731517, 36.1088112], type: 'L-90' },
      { n: 15, ll: [-115.1717973, 36.1079798], type: 'R' },
      { n: 16, ll: [-115.1699600, 36.1079600], type: 'L' },
      { n: 17, ll: [-115.1639015, 36.1079696], type: 'L-90' },
    ],
    // Landmarks that are not present as named footprints in the OSM export are placed by geo anchor.
    landmarkAnchors: {
      topgolf: { ll: [-115.15930, 36.10300], rot: 0 },
      highroller: { ll: [-115.16820, 36.11775], rot: 0 },
      lakebellagio: { ll: [-115.17420, 36.11250], rot: 0 },
      colosseum: { ll: [-115.17520, 36.11680], rot: 0 },
      harrahs: { ll: [-115.17120, 36.11960], rot: 0 },
      cromwell: { ll: [-115.17180, 36.11620], rot: 0 },
    },
  },

  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    title: ['SILVERSTONE', 'GRAND PRIX CIRCUIT'],
    outline: 'M32.3 59.1L33.4 57.6L34.6 56.1L35.7 54.6L36.9 53.1L38.0 51.6L39.3 50.2L41.0 49.5L42.9 49.4L44.8 49.7L46.6 50.0L48.5 50.2L50.4 50.2L52.2 49.6L53.8 48.7L55.3 47.5L56.8 46.3L58.2 45.2L59.7 44.0L61.2 42.8L63.0 42.7L63.9 44.3L64.4 46.2L65.0 47.9L66.4 48.9L67.7 47.6L68.4 45.8L68.9 44.0L69.2 42.2L69.2 40.3L68.4 38.6L67.1 37.3L65.7 36.0L64.3 34.7L62.9 33.5L61.5 32.2L60.1 30.9L58.7 29.6L57.3 28.4L55.9 27.1L54.5 25.8L53.1 24.6L51.7 23.3L50.3 22.0L48.9 20.8L47.5 19.5L46.1 18.2L44.7 17.0L43.2 15.9L41.4 15.4L39.6 15.8L38.4 17.3L38.2 19.2L37.9 21.0L37.0 22.7L35.3 23.3L33.6 22.8L32.6 21.2L32.7 19.4L33.5 17.7L34.4 16.0L35.2 14.3L36.1 12.6L37.2 11.1L38.6 9.8L40.0 8.6L41.7 7.7L43.5 7.1L45.3 6.8L47.2 6.6L49.1 6.4L51.0 6.2L52.8 6.0L54.7 5.8L56.6 5.7L58.5 5.5L60.4 5.4L62.3 5.2L64.1 5.1L66.0 5.0L67.8 5.5L69.3 6.6L70.3 8.2L71.0 10.0L71.5 11.8L72.0 13.6L72.4 15.5L72.7 17.3L73.0 19.2L73.2 21.1L73.3 23.0L73.4 24.9L73.5 26.7L73.6 28.6L73.6 30.5L74.0 32.4L74.7 34.1L75.6 35.8L76.1 37.6L75.6 39.4L75.0 41.2L74.4 42.9L74.1 44.8L74.5 46.6L75.5 48.2L76.6 49.8L76.9 51.6L76.4 53.4L75.1 54.7L73.5 55.7L71.8 56.7L70.4 57.9L69.4 59.5L68.5 61.2L67.6 62.8L66.7 64.5L65.8 66.1L64.9 67.8L64.0 69.5L63.1 71.1L62.3 72.8L61.4 74.5L60.5 76.2L59.6 77.8L58.7 79.5L57.8 81.2L56.9 82.8L56.0 84.5L55.1 86.1L54.1 87.7L53.0 89.3L52.0 90.9L50.9 92.4L49.6 93.8L48.0 94.8L46.2 95.0L44.4 94.4L42.9 93.2L42.0 91.6L41.2 89.9L40.3 88.3L39.2 86.7L38.1 85.2L36.8 83.8L35.5 82.4L34.2 81.0L33.0 79.6L31.8 78.1L30.2 77.5L28.7 78.7L27.0 79.0L25.5 77.8L24.4 76.3L23.6 74.6L23.1 72.7L23.3 70.9L24.5 69.4L25.6 67.9L26.7 66.4L27.9 64.9L29.0 63.4L30.2 61.9L31.3 60.4Z',
    geojson: 'data/silverstone.geojson',
    // Start/finish line: 255 m along the Hamilton Straight, in front of the Wing
    origin: [-1.0217347, 52.069673],
    // The Grand Prix layout as an ordered chain of one-way raceway ways (each ends where the next begins):
    // Hamilton Straight, Abbey, Farm, Village, The Loop, Aintree, Wellington Straight, Brooklands, Luffield,
    // Woodcote, National Pit Straight, Copse, Maggotts, Becketts, Chapel, Hangar Straight, Stowe, Vale, Club.
    ways: ['way/55224167', 'way/169854842', 'way/169800226', 'way/169800223', 'way/169800225', 'way/169848882', 'way/169800224', 'way/169800222',
      'way/169618242', 'way/169618240', 'way/169618241', 'way/169618245', 'way/169609611', 'way/169730588', 'way/3571477', 'way/169730585',
      'way/169730587', 'way/169733768', 'way/169730586', 'way/430075118', 'way/169733766', 'way/169733769', 'way/169733770', 'way/169848880',
      'way/169848884', 'way/169848881', 'way/55224168'],
    pitLaneWayId: 'way/227902927',   // International pit lane (Vale -> after Farm)
    // the 80 km/h zone brackets the garages; the entry road (from Club) and the exit road (to Farm) are driven at
    // speed. Calibrated to the real stop: ~20 s lost against staying out, ~2 s stationary
    pitLimit: { before: 195, after: 190 },
    // DRS: the Wellington Straight (detection at the Loop, Aintree -> Brooklands) and the Hangar Straight (detection
    // at Maggotts, Chapel -> Stowe)
    drs: [
      { detect: { turn: 4, at: 'start', off: 0 }, open: { turn: 5, at: 'end', off: 80 }, close: { turn: 6, at: 'start', off: -60 } },
      { detect: { turn: 10, at: 'start', off: 0 }, open: { turn: 12, at: 'end', off: 200 }, close: { turn: 15, at: 'start', off: -60 } },
    ],
    direction: 1,
    width: 15,
    laps100: 52,
    cornerCurv: 1 / 260,            // fast sweepers (Copse, Stowe, Abbey) still count as corners
    // A permanent circuit: grass verges 12 m wide, and on the outside of the corners gravel traps or painted asphalt
    // run-offs reaching up to 80 m from the road (tight / medium / fast corners). Barriers only where something
    // stands behind the verge (Track.layoutBarriers).
    verge: 'circuit', vergeWidth: 12,
    runoffCaps: [80, 70, 55],
    runoff: { asphalt: [1, 2, 8, 10, 11, 14, 17, 18], grass: [5] },   // Abbey, Farm, Woodcote, Maggotts, Chapel, Club; everything else is a gravel trap
    fillet: false, smoothSigma: 14,   // the surveyed line is already smooth: no street-corner fillets; a wider smoothing kernel irons out the kinks where hand-drawn ways join
    line: 'optimal',                // minimum-curvature racing line over the full width (Copse, Maggotts, Stowe are only fast on the real line)
    // ---- venue dressing
    defaultTime: 'day',
    ground: 'grass',
    kerb: 'redwhite',
    runoffText: 'SILVERSTONE',
    landmarkSet: null,
    autoStands: false,
    osmStands: /^(grandstand)$/,     // building=grandstand footprints become real stands
    standNames: /^(Club [AB]|Stowe [AC]|Village [AB]|Vale|The View)$/,   // stands mapped as building=yes
    pitBuilding: 'Silverstone Wing',
    defaultBuildingHeight: 7,
    buildingStyle: { base: 0x6f757d, litProb: 0.12 },
    zoneSeq: [9, 1, 10, 5, 9, 11, 0, 1, 10, 9, 5, 11],
    runoffPaint: [{ turns: [9, 15, 17, 18], color: [0.13, 0.3, 0.62] }, { turns: [1, 6, 7], color: [0.7, 0.12, 0.14] }, { turns: [3, 4, 16], color: [0.13, 0.3, 0.62] }],
    runoffDecalTurns: [1, 6, 9, 15, 17],
    shots: [
      { building: 'Silverstone Wing', label: 'THE WING', rMul: 1.0, az: 0.6 }, { s: -150, label: 'HAMILTON STRAIGHT', side: -1 },
      { turn: 1, label: 'ABBEY', side: -1 }, { turn: 4, label: 'THE LOOP', side: 1 }, { turn: 6, label: 'BROOKLANDS', side: 1 },
      { turn: 7, label: 'LUFFIELD', side: 1 }, { turn: 9, label: 'COPSE', side: 1 }, { turn: 12, label: 'MAGGOTTS · BECKETTS', side: -1 },
      { turn: 15, label: 'STOWE', side: 1 }, { turn: 17, label: 'CLUB', side: 1 },
    ],
    corners: [
      { n: 1, name: 'Abbey', ll: [-1.019184, 52.071323] },
      { n: 2, name: 'Farm', ll: [-1.016337, 52.071252] },
      { n: 3, name: 'Village', ll: [-1.013187, 52.072496] },
      { n: 4, name: 'The Loop', ll: [-1.012112, 52.071424] },
      { n: 5, name: 'Aintree', ll: [-1.011436, 52.072867] },
      { n: 6, name: 'Brooklands', ll: [-1.019946, 52.076966] },
      { n: 7, name: 'Luffield', ll: [-1.021392, 52.075886] },
      { n: 8, name: 'Woodcote', ll: [-1.019445, 52.078378] },
      { n: 9, name: 'Copse', ll: [-1.011505, 52.078718] },
      { n: 10, name: 'Maggotts', ll: [-1.010139, 52.07425] },
      { n: 11, name: 'Maggotts', ll: [-1.009531, 52.073426] },
      { n: 12, name: 'Becketts', ll: [-1.010077, 52.072269] },
      { n: 13, name: 'Becketts', ll: [-1.00972, 52.071551] },
      { n: 14, name: 'Chapel', ll: [-1.009397, 52.070705] },
      { n: 15, name: 'Stowe', ll: [-1.017952, 52.063525] },
      { n: 16, name: 'Vale', ll: [-1.02215, 52.066553] },
      { n: 17, name: 'Club', ll: [-1.023537, 52.066416] },
      { n: 18, name: 'Club', ll: [-1.02428, 52.067258] },
    ],
    landmarkAnchors: {},
  },
};
