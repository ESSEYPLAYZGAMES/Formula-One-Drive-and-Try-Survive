// The tech tree: how every team develops its car between races, an upgrade at a time and a level at a time. Nine
// branches - the power unit, aerodynamics, DRS, chassis, brakes, tyres, reliability, the pit crew and the factory -
// hold thirty-eight upgrades named for what F1 engineers really work on (the floor, the MGU-K, brake-by-wire, the wheel
// guns), each three to five levels deep. A level costs more than the one before it and gives a little less, and many
// need work in another branch first: the floor's edge wing needs a better wind tunnel, brake-by-wire's next step needs
// the MGU-K's. The facilities make no lap time themselves; they make the rest cheaper, quicker to the car and better
// understood, and the factory's tooling decides how many projects run at once. Aerodynamic work is rationed the way the
// FIA rations it: the higher a team sits in the constructors' championship, the less wind-tunnel and CFD time it has,
// so the leaders pay more for their aero and wait longer for it. And a part does not always do on track what it did in
// the tunnel: each level is 'correlated' when it reaches the car - 70 to 110 % of its promise, better with better
// facilities - and a poor one can be sent back to be re-tuned. Plain data and functions on the career's plain-JSON
// teams (levels, quality, dev, lastNew); nothing here imports anything.

// ---- the branches ------------------------------------------------------------------------------------------------------
/** the nine branches, the factory last: name, colour (the hub's accent), a monogram for its badge, a line on what it is */
export const BRANCHES = {
  power: { name: 'Power unit', color: '#ff5a36', mono: 'PU', blurb: 'The 1.6-litre turbocharged V6 and its hybrid system: power from a capped fuel flow, and the electrical energy harvested and deployed every lap.' },
  aero: { name: 'Aerodynamics', color: '#36a3ff', mono: 'AE', blurb: 'Downforce without drag: wings, floor and bodywork, developed in the wind tunnel and CFD - and rationed by the FIA\'s aerodynamic testing restrictions.' },
  drs: { name: 'DRS', color: '#ffd23f', mono: 'DRS', blurb: 'The drag reduction system: the rear wing\'s upper flap opens on the straights within a second of the car ahead, and has to shut cleanly for the braking zone.' },
  chassis: { name: 'Chassis', color: '#9b8cff', mono: 'CH', blurb: 'The monocoque, the suspension and the mass: a steady platform that keeps the floor at its height and the tyres on the road.' },
  brakes: { name: 'Brakes', color: '#ff8fa3', mono: 'BR', blurb: 'From over 300 km/h to a hairpin in a few seconds: carbon discs and pads, rear brakes by wire, and the cooling that keeps them in their window.' },
  tyres: { name: 'Tyres', color: '#57d68d', mono: 'TY', blurb: 'Every car runs the same Pirelli tyres: the gains are in keeping them in their temperature window and asking less of them over a stint.' },
  reliability: { name: 'Reliability', color: '#9aa4b2', mono: 'REL', blurb: 'To finish first, first you have to finish: tougher parts, redundancy, and a factory that catches a flaw before it reaches the car.' },
  pit: { name: 'Pit crew', color: '#4fd1c5', mono: 'PIT', blurb: 'Around twenty people change four tyres in about two seconds: the equipment, the drills and the calls that make it happen.' },
  facilities: { name: 'Facilities', color: '#3d4a63', mono: 'FAC', blurb: 'The factory behind the car: no lap time of their own, but every other upgrade cheaper, quicker to the car or better correlated - and more of them at once.' },
};
/** the eight branches that go on the car: every one but the facilities */
export const CAR_BRANCHES = Object.keys(BRANCHES).filter((b) => b !== 'facilities');
/** a tight grid: the slowest car ~0.75 % off the fastest (a few tenths) - points, upgrades and DRS decide races */
export const TIER_PERF = [1.0, 0.9975, 0.995, 0.9925];
/** correlation: a level reaches the car at Q_BASE of its promise on average (plus what its facilities add), give or take Q_SD */
export const Q_BASE = 0.93;
export const Q_SD = 0.065;
/** a level that came out under this can be re-tuned (35 % of its price, one race) */
export const RETUNE_BELOW = 0.85;

// ---- the upgrades --------------------------------------------------------------------------------------------------------
// fx on the car: perf (pace: +0.001 is ~0.1 s a lap), drs (extra drag cut with the flap open), ers (electric power), erc
// (battery energy), wear (tyre wear, negative is less), brake (braking force), rel (fewer failures), pit (quicker stops).
// fx of a facility, for the branches it helps: devCost (on the price), devSpeed (the chance a level reaches the car a
// race early), quality (on the correlation roll), slots (more projects at once). req: [[upgrade, level]] needed first.
// atr: aerodynamic work, priced and paced by the testing allowance. Over the whole tree: perf ~0.024 (about 2.1 s a
// lap), drs 0.06, ers 0.12, erc 0.15, brake 0.05, wear -0.08, rel 0.63, pit 0.24 - and about $520M of work at list
// price: a first level $2-5M, each one after it roughly half as dear again, the deepest $14-15M.
/** an upgrade: levels as [name, cost $M, fx, req] - a level takes 1 round (L1-2), 2 (L3-4) or 3 (L5) to reach the car */
const U = (id, branch, name, desc, levels, o = {}) => ({ id, branch, name, short: o.short || name, desc, atr: !!o.atr, helps: o.helps || null,
  levels: levels.map(([n, cost, fx, req = []], i) => ({ n, cost, rounds: i < 2 ? 1 : i < 4 ? 2 : 3, fx, req })) });
const AERO = { atr: true };
export const UPGRADES = [
  // the power unit
  U('ice', 'power', 'Internal combustion engine', 'The V6 itself: combustion chamber, pre-chamber ignition, compression. With the fuel flow capped by the rules, every gain is efficiency - more of the fuel\'s energy turned into work at the wheels.', [
    ['Combustion revision', 3, { perf: 0.0011 }], ['Pre-chamber revision', 4.5, { perf: 0.0009 }], ['High-tumble intake ports', 6.5, { perf: 0.0008 }, [['dyno', 1]]],
    ['Low-friction internals', 9.5, { perf: 0.0005 }, [['fuel', 2]]], ['New-specification engine', 14, { perf: 0.0004 }, [['dyno', 2], ['turbo', 3]]]], { short: 'ICE' }),
  U('turbo', 'power', 'Turbocharger', 'Compressor and turbine aerodynamics. The 2026 engines lose the MGU-H that used to spin the turbo up electrically, so lag out of slow corners is back - and the cure is mechanical: lighter wheels, better bearings.', [
    ['Compressor map', 2, { perf: 0.0007 }], ['Low-inertia turbine wheel', 3, { perf: 0.0005 }, [['ice', 1]]], ['Bearing & shaft revision', 4.5, { perf: 0.0004 }, [['ice', 2]]],
    ['Wastegate & plenum revision', 6.5, { perf: 0.0003 }, [['ice', 3], ['sidepods', 2]]]], { short: 'Turbo' }),
  U('mguk', 'power', 'MGU-K', 'The motor-generator geared to the crankshaft: it harvests under braking and drives the car on the throttle. From 2026 it is allowed 350 kW - close to half of the power unit\'s output.', [
    ['Winding revision', 2.5, { ers: 0.035 }], ['Higher-efficiency inverter', 3.5, { ers: 0.03 }, [['es', 1]]], ['Oil-cooled stator', 5, { ers: 0.02 }, [['es', 2]]],
    ['Silicon-carbide power electronics', 7, { ers: 0.015 }, [['es', 3], ['dyno', 2]]]]),
  U('es', 'power', 'Energy store', 'The battery: cell chemistry, packaging and cooling - more usable energy a lap, held at a temperature where it can be charged and discharged hard.', [
    ['Cell cooling plates', 2, { erc: 0.06 }], ['Higher-density cells', 3, { erc: 0.05 }, [['mguk', 1]]], ['Lighter casing & busbars', 4.5, { erc: 0.04 }, [['elec', 2]]]]),
  U('fuel', 'power', 'Fuel & lubricants', 'Worked out with the fuel partner. From 2026 the fuel is fully sustainable; the blend is tuned for knock resistance and a clean burn, and low-friction oils free up a little more power - and a little more life.', [
    ['Knock-resistant blend', 2, { perf: 0.0004, rel: 0.01 }], ['Low-friction oil', 3, { perf: 0.0002, rel: 0.01 }, [['ice', 1]]], ['Second-generation blend', 4, { perf: 0.0002, rel: 0.01 }, [['ice', 3]]]], { short: 'Fuel' }),
  U('deploy', 'power', 'Energy management', 'The software that decides where on the lap to harvest and where to deploy. With so much of the power now electric, how a lap\'s energy is spent is worth as much as the hardware.', [
    ['Deployment maps', 2, { ers: 0.008 }, [['mguk', 1]]], ['Lap-by-lap optimisation', 3, { ers: 0.006 }, [['es', 2]]], ['Attack & defend modes', 4, { ers: 0.006 }, [['sim', 1], ['mguk', 3]]]]),
  // aerodynamics
  U('fwing', 'aero', 'Front wing', 'The first thing the air meets: it makes its own downforce and sets up the flow for everything behind it - the wake of the front tyres above all.', [
    ['Flap profiles', 2.5, { perf: 0.0007 }], ['Endplate revision', 3.5, { perf: 0.0005 }], ['Nose & mainplane', 5, { perf: 0.0004 }, [['tunnel', 1]]],
    ['All-new front wing', 7.5, { perf: 0.0003 }, [['tunnel', 2]]]], AERO),
  U('rwing', 'aero', 'Rear wing', 'Downforce at the rear for traction and stability, paid for in drag on the straights. Teams bring a family of wings, from low to high downforce, to suit each circuit.', [
    ['Mainplane profile', 2, { perf: 0.0006 }], ['Endplate & tip vortex', 3, { perf: 0.0004 }, [['fwing', 1]]], ['Low-drag specification', 4.5, { perf: 0.0003 }, [['tunnel', 1]]],
    ['Full downforce family', 6.5, { perf: 0.0003 }, [['beam', 2]]]], AERO),
  U('floor', 'aero', 'Floor', 'Much of a modern car\'s downforce is made underneath it: the floor\'s tunnels, edges and fences pull the car to the track - as long as it runs low and stable.', [
    ['Floor-edge revision', 3, { perf: 0.0012 }], ['Tunnel inlets', 4.5, { perf: 0.001 }, [['fwing', 1]]], ['Edge wing & fences', 6.5, { perf: 0.0007 }, [['tunnel', 2]]],
    ['Revised floor body', 10, { perf: 0.0006 }, [['cfd', 2], ['ride', 2]]], ['B-spec floor', 15, { perf: 0.0005 }, [['tunnel', 3], ['diffuser', 3]]]], AERO),
  U('diffuser', 'aero', 'Diffuser', 'Where the air from under the car expands and leaves: the steeper and cleaner the expansion, the harder the floor works - until the flow separates and the downforce falls away.', [
    ['Ramp angle', 2, { perf: 0.0007 }, [['floor', 1]]], ['Strakes & sidewalls', 3, { perf: 0.0005 }, [['floor', 2]]], ['Exit & beam-wing coupling', 4.5, { perf: 0.0004 }, [['cfd', 1]]],
    ['All-new diffuser', 7, { perf: 0.0003 }, [['floor', 4]]]], AERO),
  U('sidepods', 'aero', 'Sidepods & cooling', 'The radiators\' packaging. Smaller inlets and tighter bodywork cut drag and clean up the flow to the rear, without overheating the power unit on a hot day.', [
    ['Inlet revision', 2, { perf: 0.0005, rel: 0.01 }], ['Undercut & downwash ramp', 3, { perf: 0.0003, rel: 0.01 }, [['cfd', 1]]], ['Hot-weather cooling package', 4.5, { perf: 0.0002, rel: 0.005 }, [['turbo', 2]]]], { atr: true, short: 'Sidepods' }),
  U('beam', 'aero', 'Beam wing', 'The small wing low down between the diffuser and the rear wing: it ties the two flows together, and is trimmed to each circuit\'s drag level.', [
    ['Beam-wing profile', 2, { perf: 0.0004 }, [['rwing', 1]]], ['Twin-element layout', 3, { perf: 0.0003 }, [['diffuser', 1]]], ['Low-drag trim', 4, { perf: 0.0002 }, [['diffuser', 2]]]], AERO),
  // DRS
  U('drsact', 'drs', 'DRS actuator', 'The hydraulic actuator that opens the flap: quicker to open, quicker to close for the braking zone, and the flap held still at full stretch.', [
    ['Faster valve', 2, { drs: 0.01 }, [['rwing', 1]]], ['Stiffer actuator pod', 3, { drs: 0.008 }, [['hydraulics', 1]]], ['Lighter actuator', 4, { drs: 0.007 }, [['hydraulics', 2]]]], { short: 'DRS actuator' }),
  U('flap', 'drs', 'Flap profile', 'The flap\'s shape and slot gap: how much drag goes when it opens, and how quickly the wing reattaches and makes its downforce again when it shuts.', [
    ['Slot gap', 2, { drs: 0.01 }, [['rwing', 1]]], ['Flap camber', 3, { drs: 0.009 }, [['drsact', 1]]], ['Pivot position', 4, { drs: 0.008 }, [['rwing', 3]]],
    ['Stalling profile', 6, { drs: 0.008 }, [['tunnel', 3], ['drsact', 3]]]], { atr: true, short: 'DRS flap' }),
  // chassis
  U('weight', 'chassis', 'Weight reduction', 'Every kilogram under the minimum weight becomes ballast the engineers can place where it helps the balance most. A rule of thumb: 10 kg is worth about three tenths a lap.', [
    ['Lighter brackets & looms', 2, { perf: 0.0006 }], ['Thinner-ply bodywork', 3, { perf: 0.0004 }], ['Titanium & printed parts', 4.5, { perf: 0.0003 }, [['tooling', 1]]]], { short: 'Weight' }),
  U('mono', 'chassis', 'Monocoque', 'The carbon-fibre survival cell everything bolts to: a stiffer layup for the same mass - and it still has to pass the FIA\'s crash and load tests.', [
    ['Layup revision', 2, { perf: 0.0004 }], ['Stiffer chassis', 3, { perf: 0.0002 }, [['weight', 1]]], ['New survival cell', 4.5, { perf: 0.0002 }, [['tooling', 2]]]]),
  U('fsusp', 'chassis', 'Front suspension', 'Wishbones, push- or pullrod and anti-dive geometry: the front held steady under braking, so the floor\'s leading edge stays where the aerodynamicists want it.', [
    ['Geometry revision', 2, { perf: 0.0004 }], ['Anti-dive', 3, { perf: 0.0003 }, [['mono', 1]]], ['Aero-profiled wishbones', 4, { perf: 0.0002 }, [['sim', 1]]]], { short: 'Front suspension' }),
  U('rsusp', 'chassis', 'Rear suspension', 'Anti-squat and the rear platform on the throttle: traction out of slow corners, and kinder to the rear tyres over a stint.', [
    ['Anti-squat geometry', 2, { perf: 0.0004, wear: -0.006 }], ['Upright & hub revision', 3, { perf: 0.0002, wear: -0.004 }, [['fsusp', 1]]], ['Inerter & damper tune', 4, { perf: 0.0002, wear: -0.004 }, [['sim', 2]]]], { short: 'Rear suspension' }),
  U('ride', 'chassis', 'Ride height control', 'Heave springs and dampers that hold the floor at its ideal height without bouncing on the straights (porpoising). Passive only: active suspension has been banned since 1994.', [
    ['Heave spring', 2, { perf: 0.0005 }, [['fsusp', 1]]], ['Damper valving', 3, { perf: 0.0003 }, [['rsusp', 1]]], ['Bump stops & platform', 4.5, { perf: 0.0003 }, [['floor', 2]]],
    ['Low-ride package', 6.5, { perf: 0.0002 }, [['floor', 3], ['sim', 2]]]], { short: 'Ride height' }),
  // brakes
  U('discs', 'brakes', 'Discs & pads', 'Carbon-carbon discs drilled with more than a thousand cooling holes, and pads matched to them: more bite, and steadier as they heat up.', [
    ['Pad compound', 2, { brake: 0.008 }], ['Higher-ventilation discs', 3, { brake: 0.007 }], ['Disc & pad package', 4, { brake: 0.005 }, [['bcool', 2]]]], { short: 'Discs' }),
  U('bbw', 'brakes', 'Brake-by-wire', 'Since 2014 the rear brakes are electronically controlled, blending the friction brakes with the MGU-K\'s harvesting so the rear stays stable and predictable into the corner.', [
    ['Blending maps', 2, { brake: 0.006, perf: 0.0002 }, [['discs', 1]]], ['Faster rear actuator', 3, { brake: 0.005, perf: 0.0002 }, [['mguk', 2]]],
    ['Corner-by-corner calibration', 4.5, { brake: 0.004, perf: 0.0001 }, [['elec', 2], ['sim', 1]]]]),
  U('bcool', 'brakes', 'Brake cooling', 'Ducts and drums that keep the discs in their operating window - roughly 400 to 1,000 °C - without cooking the rims and tyres beside them.', [
    ['Duct inlet', 2, { brake: 0.006, rel: 0.007 }], ['Drum & fairing', 3, { brake: 0.005, rel: 0.007 }, [['cfd', 1]]], ['Circuit-specific cooling', 4, { brake: 0.004, rel: 0.006 }, [['discs', 2]]]]),
  // tyres
  U('therm', 'tyres', 'Thermal management', 'The heat paths around the tyre - from the brakes and the rim into it, and out again - so the surface and the carcass stay in their window.', [
    ['Rim heat paths', 2, { wear: -0.012 }], ['Duct heat routing', 3, { wear: -0.01 }, [['bcool', 1]]], ['Carcass temperature control', 4, { wear: -0.008 }, [['rims', 2]]]], { short: 'Tyre thermals' }),
  U('tmodel', 'tyres', 'Tyre modelling', 'Models of the tyre built from track data: set-ups, strategies and driving that look after the rubber, worked out before the car turns a wheel.', [
    ['Wear model', 2, { wear: -0.006, perf: 0.0001 }], ['Thermal model', 3, { wear: -0.005, perf: 0.0001 }, [['sim', 1]]], ['Degradation forecasting', 4, { wear: -0.004, perf: 0.0001 }, [['therm', 2]]],
    ['Live race model', 6, { wear: -0.003, perf: 0.0001 }, [['sim', 3]]]]),
  U('rims', 'tyres', 'Wheel hubs & rims', 'The rims are a standard part since 2022, so the work is around them: hub bearings, heat shields, and the brakes\' heat shared evenly into the tyre.', [
    ['Hub bearings', 2, { wear: -0.008, perf: 0.0001 }], ['Hub heat shields', 3, { wear: -0.006, perf: 0.0001 }, [['therm', 1]]], ['Balanced heat transfer', 4, { wear: -0.004, perf: 0.0001 }, [['bcool', 2]]]], { short: 'Hubs' }),
  // reliability
  U('gearbox', 'reliability', 'Gearbox', 'The eight-speed seamless-shift gearbox: tougher gears, shift barrels and seals, for a unit that has to last several race weekends.', [
    ['Seal revision', 2, { rel: 0.05 }], ['Hardened gears', 3, { rel: 0.04 }], ['Shift-barrel revision', 4, { rel: 0.035 }, [['qc', 1]]], ['New casing', 6, { rel: 0.03 }, [['dyno', 2]]]]),
  U('hydraulics', 'reliability', 'Hydraulics', 'The high-pressure system that works the gearshift, clutch, throttle, DRS and power steering: leak-proof seals, and a backup that keeps the car running.', [
    ['Seals & fittings', 2, { rel: 0.05 }], ['Accumulator backup', 3, { rel: 0.04 }, [['qc', 1]]], ['Twin-circuit valves', 4, { rel: 0.035 }, [['gearbox', 2]]]]),
  U('elec', 'reliability', 'Electronics', 'The wiring loom, connectors and sensors around the FIA\'s standard ECU: proof against vibration and heat, with spares for the sensors that matter.', [
    ['Loom & connectors', 2, { rel: 0.05 }], ['Sensor redundancy', 3, { rel: 0.04 }, [['qc', 1]]], ['Heat protection', 4, { rel: 0.035 }, [['qc', 2]]]]),
  U('qc', 'reliability', 'Quality control', 'Inspection before anything reaches the car: crack testing, X-ray and CT scans, and every part with a logged life it is retired at.', [
    ['Crack testing', 2, { rel: 0.045 }], ['Part lifing', 3, { rel: 0.04 }], ['CT scanning', 4, { rel: 0.035 }, [['tooling', 1]]], ['Full traceability', 6, { rel: 0.03 }, [['tooling', 2]]]]),
  // the pit crew
  U('guns', 'pit', 'Wheel guns', 'High-speed guns that undo and do up the single wheel nut in a fraction of a second, with sensors that confirm the wheel is on.', [
    ['Faster gun', 2, { pit: 0.025 }], ['Socket & nut revision', 3, { pit: 0.02 }, [['crew', 1]]], ['Release sensors', 4, { pit: 0.015 }, [['crew', 2]]]]),
  U('jacks', 'pit', 'Jacks', 'The front and rear jacks: the car up and down in a moment, and a front jack that swings aside so the car can leave.', [
    ['Lighter jacks', 2, { pit: 0.02 }], ['Quick-release front jack', 3, { pit: 0.015 }, [['crew', 1]]], ['Drop timing', 4, { pit: 0.015 }, [['guns', 2]]]]),
  U('crew', 'pit', 'Crew training', 'Practice stops all weekend and back at the factory, fitness and choreography: the same twenty people, faster and more consistent.', [
    ['Daily drills', 2, { pit: 0.03 }], ['Choreography', 3, { pit: 0.025 }], ['Fitness & reactions', 4.5, { pit: 0.02 }, [['guns', 1], ['jacks', 1]]]], { short: 'Crew' }),
  U('strat', 'pit', 'Strategy software', 'Race simulations run thousands of times over to find the stop window, and the timing to release the car into a gap rather than into traffic.', [
    ['Race model', 2, { pit: 0.02 }], ['Monte Carlo strategy', 3, { pit: 0.02 }, [['sim', 1]]], ['Live gap prediction', 4, { pit: 0.015 }, [['crew', 2]]]], { short: 'Strategy' }),
  // the factory
  U('tunnel', 'facilities', 'Wind tunnel', 'A 60 %-scale model on a rolling road at up to 50 m/s - the limits the rules set. Better data means aero parts that do on track what they did in the tunnel, and get there sooner.', [
    ['Model & rig upgrade', 3, { quality: 0.02, devSpeed: 0.06 }], ['Rolling-road revision', 4.5, { quality: 0.02, devSpeed: 0.05 }], ['Flow-quality upgrade', 6.5, { quality: 0.02, devSpeed: 0.05 }, [['cfd', 1]]],
    ['New-generation tunnel', 10, { quality: 0.02, devSpeed: 0.04 }, [['cfd', 2]]]], { helps: ['aero', 'drs'] }),
  U('cfd', 'facilities', 'CFD cluster', 'Computational fluid dynamics on the team\'s own cluster. The testing restrictions ration the computing too, so what counts is how much useful simulation fits in the allowance.', [
    ['More cores', 2.5, { devCost: -0.04, quality: 0.01 }], ['Faster solvers', 3.5, { devCost: -0.04, quality: 0.01 }], ['Automated meshing', 5.5, { devCost: -0.03, quality: 0.01 }, [['tunnel', 1]]],
    ['New cluster', 8.5, { devCost: -0.03, quality: 0.01 }, [['tunnel', 2]]]], { helps: ['aero', 'drs', 'chassis', 'brakes'], short: 'CFD' }),
  U('dyno', 'facilities', 'Dynos', 'Engine, gearbox and test-cell rigs that run race distances in the factory: problems found on the bench, not on the grid.', [
    ['Engine dyno upgrade', 2.5, { quality: 0.03, devSpeed: 0.06 }], ['Transmission rig', 3.5, { quality: 0.025, devSpeed: 0.05 }], ['Race-distance test cell', 5.5, { quality: 0.02, devSpeed: 0.04 }, [['tooling', 1]]]], { helps: ['power', 'reliability'] }),
  U('sim', 'facilities', 'Driver-in-the-loop simulator', 'Set-ups and new parts tried by a driver in the simulator before the car runs, so suspension, brake and tyre work arrives tested and better understood.', [
    ['Motion-platform upgrade', 2.5, { quality: 0.03, devSpeed: 0.05 }], ['Vehicle-model revision', 3.5, { quality: 0.025, devSpeed: 0.05 }, [['elec', 1]]], ['New simulator', 5.5, { quality: 0.02, devSpeed: 0.04 }, [['tooling', 1]]]], { helps: ['chassis', 'brakes', 'tyres'], short: 'Simulator' }),
  U('tooling', 'facilities', 'Factory tooling', 'Machining, autoclaves for curing the carbon fibre, additive manufacturing: how many projects the factory can build at once, and how fast.', [
    ['Second autoclave', 5, { slots: 1 }, [['qc', 2]]], ['Additive manufacturing', 7.5, { devSpeed: 0.04, devCost: -0.02 }, [['qc', 2]]], ['New machining hall', 12, { slots: 1, devSpeed: 0.03 }, [['qc', 3]]]], { short: 'Tooling' }),
];
export const UP = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));
const FACILITIES = UPGRADES.filter((u) => u.branch === 'facilities');
/** the most projects a factory can run at once (two, and one more for each tooling level that adds a line) */
export const MAX_SLOTS = 2 + FACILITIES.reduce((a, u) => a + u.levels.reduce((s, L) => s + (L.fx.slots || 0), 0), 0);

// ---- reading a team ------------------------------------------------------------------------------------------------------
const tierIx = (n) => Math.max(0, Math.min(3, Math.round(+n) || 0));
const r1 = (x) => Math.round(x * 10) / 10;
const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
/** an upgrade's level on a team's car (0: none) */
export function levelOf(team, id) { const v = Math.floor(+team?.levels?.[id] || 0); return v > 0 ? Math.min(v, UP[id]?.levels.length || 0) : 0; }
/** how many levels an upgrade has (0: no such upgrade) */
export function maxLevel(id) { return UP[id]?.levels.length || 0; }
/** the level to build next (1-based), or null when every level is on the car */
export function nextLevel(team, id) { const m = maxLevel(id), l = levelOf(team, id); return m && l < m ? l + 1 : null; }
/** what a level still needs: the [[upgrade, level]] not yet on the car ([] when nothing) */
export function missingReq(team, id, lvl) { const L = UP[id]?.levels[lvl - 1]; return L ? L.req.filter(([r, l]) => levelOf(team, r) < l) : []; }
/** how many projects a team's factory can run at once */
export function devSlots(team) { let s = 2; for (const u of FACILITIES) for (let i = 0, lv = levelOf(team, u.id); i < lv; i++) s += u.levels[i].fx.slots || 0; return s; }
/**
 * What the facilities do for one branch's development -> { cost: a multiplier on the price, speed: the chance a level
 * arrives a race early, quality: added to the correlation roll, from: [[facility, level]] } (the testing allowance not
 * included: that is levelCost's and devTick's)
 */
export function facilityFx(team, branch) {
  let cost = 0, speed = 0, quality = 0; const from = [];
  if (branch !== 'facilities') for (const u of FACILITIES) {
    const lv = levelOf(team, u.id); if (!lv || (u.helps && !u.helps.includes(branch))) continue;
    from.push([u.id, lv]);
    for (let i = 0; i < lv; i++) { const fx = u.levels[i].fx; cost += fx.devCost || 0; speed += fx.devSpeed || 0; quality += fx.quality || 0; }
  }
  return { cost: Math.max(0.5, 1 + cost), speed: Math.min(0.6, speed), quality, from };
}
/** the correlation a branch's levels can expect on average (facility levels always land at 100 %) */
export function expectedQ(team, branch) { return branch === 'facilities' ? 1 : Math.min(1.1, Q_BASE + facilityFx(team, branch).quality); }

// ---- where a team starts -------------------------------------------------------------------------------------------------
// (the levels each tier starts with, [tier 0, 1, 2, 3]: a top team about 45 % of the way to the full tree's lap time,
// the upper midfield a third, the lower midfield a quarter, a backmarker or a new team about 12 %. Each kit holds what
// the old flat tree's starting parts become (MIGRATE), so an old save keeps the grid's balance exactly)
const START = {
  ice: [2, 2, 1, 1], turbo: [1, 1, 1, 0], mguk: [2, 1, 1, 0], es: [2, 2, 1, 0], fuel: [0, 0, 0, 0], deploy: [1, 0, 0, 0],
  fwing: [2, 1, 1, 1], rwing: [1, 1, 1, 1], floor: [2, 1, 1, 0], diffuser: [1, 0, 0, 0], sidepods: [1, 1, 0, 0], beam: [1, 1, 1, 0],
  drsact: [2, 1, 1, 0], flap: [2, 1, 0, 0],
  weight: [1, 1, 1, 1], mono: [2, 0, 0, 0], fsusp: [1, 1, 1, 0], rsusp: [1, 1, 0, 0], ride: [1, 1, 0, 0],
  discs: [2, 1, 1, 1], bbw: [1, 1, 0, 0], bcool: [2, 1, 1, 0],
  therm: [2, 1, 1, 1], tmodel: [1, 0, 0, 0], rims: [1, 1, 0, 0],
  gearbox: [2, 1, 1, 1], hydraulics: [2, 1, 1, 1], elec: [2, 1, 1, 0], qc: [2, 2, 1, 1],
  guns: [2, 1, 1, 1], jacks: [2, 1, 1, 0], crew: [2, 1, 1, 1], strat: [1, 1, 0, 0],
  tunnel: [2, 2, 1, 1], cfd: [2, 1, 1, 1], dyno: [2, 1, 1, 0], sim: [2, 1, 1, 0], tooling: [1, 1, 0, 0],
};
/** the levels a team of a tier starts with (tier 0 the deepest) -> { id: level } (a fresh object every call) */
export function startLevels(tier) {
  const ti = tierIx(tier), out = {};
  for (const u of UPGRADES) { const v = Math.min(START[u.id]?.[ti] || 0, u.levels.length); if (v > 0) out[u.id] = v; }
  // (a level only counts when what it needs is there too: the table is checked, never trusted)
  for (let pass = 0, changed = true; changed && pass < 10; pass++) {
    changed = false;
    for (const u of UPGRADES) {
      const v = out[u.id] || 0; let ok = 0;
      while (ok < v && u.levels[ok].req.every(([r, l]) => (out[r] || 0) >= l)) ok++;
      if (ok < v) { changed = true; if (ok) out[u.id] = ok; else delete out[u.id]; }
    }
  }
  return out;
}
/** the lap time a set of levels carries at full correlation (the perf of every level in it) */
const perfOf = (levels) => { let s = 0; for (const [id, lv] of Object.entries(levels || {})) for (let i = 0; i < Math.min(lv, UP[id]?.levels.length || 0); i++) s += UP[id].levels[i].fx.perf || 0; return s; };
/** a tier's starting kit's lap time (kept: the start never changes) */
const BASE = [];
const basePerf = (tier) => { const ti = tierIx(tier); return BASE[ti] ?? (BASE[ti] = perfOf(startLevels(ti))); };

/**
 * What a team's development does to its cars -> { perf, drs, ers, erc, wear, brake, relMul, pitMul } as the cars use
 * them (perf relative to where its tier started, so the grid's balance holds at first - plus an old save's perfAdj;
 * every on-car effect scaled by how well its level correlated), and the factory's { devCost, devSpeed, quality }
 * (averaged over the eight car branches) and slots
 */
export function techEffects(team) {
  // (an old save not yet brought up to date: read a migrated copy, never the save itself)
  if (team && !isObj(team.levels) && Array.isArray(team.nodes)) team = migrateTeam(JSON.parse(JSON.stringify(team)));
  const s = { perf: 0, drs: 0, ers: 0, erc: 0, wear: 0, brake: 0, rel: 0, pit: 0 }, Q = isObj(team?.quality) ? team.quality : {};
  for (const u of UPGRADES) {
    const lv = levelOf(team, u.id); if (!lv) continue;
    const qa = Array.isArray(Q[u.id]) ? Q[u.id] : [];
    for (let i = 0; i < lv; i++) {
      const fx = u.levels[i].fx, q = u.branch === 'facilities' ? 1 : +qa[i] || 1;
      for (const k in fx) if (k in s) s[k] += fx[k] * q;
    }
  }
  let dc = 0, ds = 0, dq = 0;
  for (const b of CAR_BRANCHES) { const f = facilityFx(team, b); dc += f.cost; ds += f.speed; dq += f.quality; }
  const n = CAR_BRANCHES.length, tier = tierIx(team?.tier);
  return {
    perf: TIER_PERF[tier] + s.perf - basePerf(tier) + (+team?.perfAdj || 0), drs: s.drs, ers: 1 + s.ers, erc: 1 + s.erc, wear: 1 + s.wear, brake: 1 + s.brake,
    relMul: Math.max(0.45, 1.35 - s.rel * 1.5), pitMul: Math.max(0.72, 1.1 - s.pit),
    devCost: dc / n, devSpeed: ds / n, quality: dq / n, slots: devSlots(team),
  };
}

// ---- the aerodynamic testing restrictions ----------------------------------------------------------------------------------
// (since 2022 the FIA's sliding scale gives the constructors' champions 70 % of the baseline wind-tunnel and CFD time,
// tenth 115 %, in steps of 5 %. Here it follows the constructors' order as it stands - before anyone has a point, the
// pecking order of the tiers - and an eleventh team gets tenth's 115 %; fewer than ten teams spread over the same range)
/** where a team sits for the testing restrictions -> { f: its allowance (0.70 .. 1.15), pos: its place, n: teams } */
export function atrInfo(c, teamName) {
  const ts = Object.values(c?.teams || {}), n = ts.length;
  const order = ts.map((t, i) => ({ t, i })).sort((a, b) => (+b.t.points || 0) - (+a.t.points || 0) || tierIx(a.t.tier) - tierIx(b.t.tier) || a.i - b.i);
  const pos = order.findIndex((x) => x.t.name === teamName) + 1;
  if (!pos || n < 2) return { f: 1, pos: pos || 1, n };
  const f = n >= 10 ? 0.7 + 0.05 * Math.min(9, pos - 1) : 0.7 + (0.45 * (pos - 1)) / (n - 1);
  return { f: Math.round(f * 1000) / 1000, pos, n };
}
/** a team's aerodynamic testing allowance: 0.70 for the leaders .. 1.15 for tenth and below */
export function atrFactor(c, teamName) { return atrInfo(c, teamName).f; }

// ---- prices, times and states -----------------------------------------------------------------------------------------------
/** what a level costs a team ($M): the list price, cheaper with the facilities that help its branch, aero work divided by the testing allowance (the leaders pay more) */
export function levelCost(c, teamName, id, lvl) {
  const u = UP[id], L = u?.levels[lvl - 1], t = c?.teams?.[teamName]; if (!L) return Infinity;
  if (u.branch === 'facilities' || !t) return L.cost;
  return Math.max(0.5, r1((L.cost * facilityFx(t, u.branch).cost) / (u.atr ? atrFactor(c, teamName) : 1)));
}
/** the races a level takes to reach the car (the facilities may save one on the way: devTick) */
export function levelRounds(c, teamName, id, lvl) { return UP[id]?.levels[lvl - 1]?.rounds ?? 1; }
/** sending a level back to be re-tuned: 35 % of what it costs now ($M) */
export function retuneCost(c, teamName, id, lvl) { return Math.max(0.5, r1(levelCost(c, teamName, id, lvl) * 0.35)); }
// (where a part goes back to when it is re-tuned: aero to the tunnel, the power unit to the dyno, and so on)
const BENCH = { aero: 'the wind tunnel', drs: 'the wind tunnel', power: 'the dyno', reliability: 'the test rigs', chassis: 'the rigs and the simulator', brakes: 'the brake dyno', tyres: 'the simulator', pit: 'the practice bay' };
/** where an upgrade is re-tuned, in words: 'the wind tunnel', 'the dyno' ... */
export function retuneWhere(id) { return BENCH[UP[id]?.branch] || 'the factory'; }
/** an upgrade for a team -> 'max' (every level on the car) | 'dev' (being built or re-tuned) | 'locked' (its next level needs work elsewhere) | 'busy' (no free slot) | 'poor' (can't afford it) | 'open' */
export function upgradeState(c, teamName, id) {
  const t = c?.teams?.[teamName], u = UP[id]; if (!t || !u) return 'locked';
  const dev = Array.isArray(t.dev) ? t.dev : [];
  if (dev.some((x) => x.id === id)) return 'dev';
  const lv = nextLevel(t, id); if (lv == null) return 'max';
  if (missingReq(t, id, lv).length) return 'locked';
  if (dev.length >= devSlots(t)) return 'busy';
  return (+t.budget || 0) >= levelCost(c, teamName, id, lv) ? 'open' : 'poor';
}
/** can a level be re-tuned -> 'ok' | 'good' (it correlated well enough) | 'dev' (the upgrade is in the factory) | 'busy' | 'poor' | 'none' */
export function retuneState(c, teamName, id, lvl) {
  const t = c?.teams?.[teamName], u = UP[id], k = Math.floor(+lvl);
  if (!t || !u || u.branch === 'facilities' || !(k >= 1) || k > levelOf(t, id)) return 'none';
  if ((+t.quality?.[id]?.[k - 1] || 1) >= RETUNE_BELOW) return 'good';
  const dev = Array.isArray(t.dev) ? t.dev : [];
  if (dev.some((x) => x.id === id)) return 'dev';
  if (dev.length >= devSlots(t)) return 'busy';
  return (+t.budget || 0) >= retuneCost(c, teamName, id, k) ? 'ok' : 'poor';
}

// ---- developing ------------------------------------------------------------------------------------------------------------
const spend = (t, u, cost) => { const s = isObj(t.devSpend) ? t.devSpend : (t.devSpend = { all: 0, fac: 0 }); s.all = r1((+s.all || 0) + cost); if (u.branch === 'facilities') s.fac = r1((+s.fac || 0) + cost); };
const prep = (t) => { if (!isObj(t.levels) || Array.isArray(t.nodes)) migrateTeam(t); if (!Array.isArray(t.dev)) t.dev = []; };
/** start the next level of an upgrade: paid now, in the factory for its rounds (news for your own team) -> done? */
export function develop(c, teamName, id) {
  const t = c?.teams?.[teamName]; if (!t) return false;
  prep(t);
  if (upgradeState(c, teamName, id) !== 'open') return false;
  const u = UP[id], lv = nextLevel(t, id), cost = levelCost(c, teamName, id, lv), n = levelRounds(c, teamName, id, lv);
  t.budget = r1((+t.budget || 0) - cost); t.dev.push({ id, level: lv, left: n, n, cost }); spend(t, u, cost);
  if (t.own) c.addNews?.(`${t.name} start work on ${upgradeName(id, lv)} (${BRANCHES[u.branch].name}).`);
  return true;
}
/** send a poorly correlated level back to be re-tuned: one race, 35 % of its price, a fresh roll with what the first taught (the better of the two is kept) -> done? */
export function retune(c, teamName, id, lvl) {
  const t = c?.teams?.[teamName]; if (!t) return false;
  prep(t);
  const k = Math.floor(+lvl); if (retuneState(c, teamName, id, k) !== 'ok') return false;
  const cost = retuneCost(c, teamName, id, k), q = +t.quality?.[id]?.[k - 1] || 1;
  t.budget = r1((+t.budget || 0) - cost); t.dev.push({ id, level: k, left: 1, n: 1, cost, re: true }); spend(t, UP[id], cost);
  if (t.own) c.addNews?.(`${t.name} send ${upgradeName(id, k)} back to ${retuneWhere(id)}: it came out at ${Math.round(q * 100)}% of what was promised.`);
  return true;
}

// ---- the round: parts reaching the cars ---------------------------------------------------------------------------------------
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
/** a level's correlation as it reaches the car (a factory visit's one-off boost used up here) */
const roll = (t, u, re) => {
  let b = facilityFx(t, u.branch).quality + (re ? 0.05 : 0);
  if (t.qBoost) { b += +t.qBoost || 0; delete t.qBoost; }
  return Math.round(Math.max(0.7, Math.min(1.1, Q_BASE + b + gauss() * Q_SD)) * 100) / 100;
};
/** the chance this round saves a race on a level of u (the facilities; aero work as the testing allowance lets it) */
const saveChance = (c, t, u) => (u.branch === 'facilities' ? 0 : Math.min(0.6, facilityFx(t, u.branch).speed * (u.atr ? atrFactor(c, t.name) : 1)));
/**
 * One team's factory for a round: a race closer for everything in it, finished levels onto the car -> [{ team, id,
 * level, q, re, early }]. Once a round only (t.devTicked: the season and round it last ran), so a second call is harmless
 */
export function devTickTeam(c, t) {
  const out = []; if (!t) return out;
  const key = `${c?.season ?? 0}|${c?.round ?? 0}`; if (t.devTicked === key) return out;
  t.devTicked = key;
  prep(t);
  const L = t.levels, Q = isObj(t.quality) ? t.quality : (t.quality = {});
  for (const x of t.dev) {
    const u = UP[x.id]; if (!u) { x.left = 0; continue; }
    x.left = (Math.floor(+x.left) || 1) - 1;
    if (x.left > 0 && Math.random() < saveChance(c, t, u)) { x.left--; x.early = true; }
    if (x.left > 0) continue;
    const qa = Array.isArray(Q[x.id]) ? Q[x.id] : (Q[x.id] = []);
    while (qa.length < x.level) qa.push(1);
    if (x.re) { const was = +qa[x.level - 1] || 1, q = roll(t, u, true); qa[x.level - 1] = Math.max(was, q); out.push({ team: t.name, id: x.id, level: x.level, q: qa[x.level - 1], re: true, was }); continue; }
    const q = u.branch === 'facilities' ? 1 : roll(t, u, false);
    L[x.id] = Math.max(L[x.id] || 0, x.level); qa[x.level - 1] = q;
    out.push({ team: t.name, id: x.id, level: x.level, q, re: false, early: !!x.early });
  }
  t.dev = t.dev.filter((x) => x.left > 0 && UP[x.id]);
  // (the newest on the car, for the interview and the news: a part before a facility; the round is the race just run)
  const nw = out.filter((o) => !o.re), last = nw.filter((o) => UP[o.id].branch !== 'facilities').pop() || nw.pop();
  if (last) t.lastNew = { id: last.id, level: last.level, round: c?.round ?? 0 };
  return out;
}
/** every team's factory for the round (once, before the round moves on: lastNew carries the race just run) -> the levels finished [{ team, id, level, q, re, early }] */
export function devTick(c) { const out = []; for (const t of Object.values(c?.teams || {})) out.push(...devTickTeam(c, t)); return out; }

// ---- the AI teams ----------------------------------------------------------------------------------------------------------
// (what a level is worth in lap time, roughly, to weigh unlike things: the AI's yardstick and the hub's best-value tag.
// A facility level is worth what it does for the rest over a season or two: a slot most, CFD and the tunnel next)
const WORTH = { perf: 1, drs: 0.025, ers: 0.008, erc: 0.006, brake: 0.016, wear: -0.012, rel: 0.0025, pit: 0.004 };
const FAC_WORTH = { tooling: 0.0009, cfd: 0.0006, tunnel: 0.0006, sim: 0.00045, dyno: 0.00045 };
const RESERVE = 6;
/**
 * A level's worth to a team in lap-time terms (+0.001 ~ 0.1 s a lap; a facility by what it does for the rest;
 * reliability is worth nothing once failures are as rare as they get). relMax: that already known (saves a techEffects)
 */
export function levelWorth(team, id, lvl, relMax = null) {
  const u = UP[id], L = u?.levels[lvl - 1]; if (!L) return 0;
  if (u.branch === 'facilities') return FAC_WORTH[id] || 0.0004;
  let w = 0; for (const k in L.fx) if (WORTH[k]) w += L.fx[k] * WORTH[k];
  if (L.fx.rel && (relMax ?? techEffects(team).relMul <= 0.4501)) w -= L.fx.rel * WORTH.rel;
  return Math.max(0, w);
}
/**
 * An AI team's round in the factory -> levels started: the most lap time per $M it can start, up to its free slots,
 * $6M kept back; about a fifth of the money into the factory itself; and a level it cannot start yet lends half its
 * worth to the open levels it is waiting for (a team after the B-spec floor builds the wind tunnel it needs)
 */
export function aiDevelopTeam(c, t) {
  if (!t || t.own) return 0;
  prep(t);
  let n = 0;
  for (let guard = 0; guard < MAX_SLOTS && t.dev.length < devSlots(t); guard++) {
    const relMax = techEffects(t).relMul <= 0.4501, st = {}, lend = {}, opts = [];
    for (const u of UPGRADES) st[u.id] = upgradeState(c, t.name, u.id);
    for (const u of UPGRADES) {
      if (st[u.id] !== 'locked') continue;
      const lv = nextLevel(t, u.id), w = levelWorth(t, u.id, lv, relMax) * 0.5;
      for (const [r, l] of missingReq(t, u.id, lv)) if (st[r] === 'open' && nextLevel(t, r) === l) lend[r] = (lend[r] || 0) + w;
    }
    for (const u of UPGRADES) {
      if (st[u.id] !== 'open') continue;
      const lv = nextLevel(t, u.id), cost = levelCost(c, t.name, u.id, lv); if ((+t.budget || 0) - cost < RESERVE) continue;
      const fac = u.branch === 'facilities', v = ((levelWorth(t, u.id, lv, relMax) + (lend[u.id] || 0)) / cost) * (0.85 + Math.random() * 0.3);
      if (v > 0) opts.push({ u, v, fac });
    }
    if (!opts.length) break;
    const sp = isObj(t.devSpend) ? t.devSpend : { all: 0, fac: 0 }, facs = opts.filter((o) => o.fac), parts = opts.filter((o) => !o.fac);
    const wantFac = facs.length && (!parts.length || ((+sp.fac || 0) < 0.2 * Math.max(1, +sp.all || 0) && Math.random() < 0.65));
    const pick = (wantFac ? facs : parts).sort((a, b) => b.v - a.v)[0];
    if (!pick || !develop(c, t.name, pick.u.id)) break;
    n++;
  }
  // (a level that came out badly is put right when a slot and the money allow - not always at once)
  if (t.dev.length < devSlots(t) && Math.random() < 0.5) {
    let worst = null;
    for (const u of UPGRADES) {
      if (u.branch === 'facilities') continue;
      const qa = t.quality?.[u.id]; if (!Array.isArray(qa)) continue;
      for (let i = 0; i < levelOf(t, u.id); i++) if ((+qa[i] || 1) < 0.8 && (!worst || qa[i] < worst.q)) worst = { id: u.id, k: i + 1, q: qa[i] };
    }
    if (worst && (+t.budget || 0) - retuneCost(c, t.name, worst.id, worst.k) >= RESERVE && retune(c, t.name, worst.id, worst.k)) n++;
  }
  return n;
}
/** every AI team's development for the round (your own team is yours) */
export function aiDevelop(c) { for (const t of Object.values(c?.teams || {})) if (!t.own) aiDevelopTeam(c, t); }

// ---- old saves: the flat tree of 35 parts, mapped onto the levels -------------------------------------------------------------
// (each old part -> the levels it becomes, [[upgrade, level], ...], the closest first. Calibrated two ways: every tier's
// old starting parts land inside its new starting kit - a team that had built nothing keeps its pace exactly - and the
// whole old tree lands at about 88 % of the new one's lap time, so what a team had built beyond its kit carries over at
// about what it was worth. What is left - a tenth or two at most, the old tree's tiers 1 and 2 having started with the
// same parts - is kept as the team's perfAdj, so an old save's cars are exactly as quick as they were)
/** each part of the old flat tree -> the levels it becomes, [[upgrade, level]] (a team keeps the most of each) */
export const MIGRATE = {
  p1: [['ice', 1]], p2: [['turbo', 1]], p3: [['mguk', 1], ['es', 1]], p4: [['mguk', 2], ['deploy', 1], ['es', 2]],
  p5: [['ice', 3], ['turbo', 2], ['deploy', 2]], p6: [['ice', 5], ['turbo', 4], ['mguk', 3], ['fuel', 2]],
  a1: [['fwing', 1]], a2: [['floor', 1]], a3: [['beam', 1], ['rwing', 1]], a4: [['sidepods', 1]], a5: [['floor', 3], ['diffuser', 2]],
  a6: [['floor', 4], ['fwing', 4], ['rwing', 4], ['diffuser', 3], ['sidepods', 2], ['beam', 2]],
  d1: [['drsact', 1]], d2: [['flap', 1], ['drsact', 2]], d3: [['flap', 4], ['drsact', 3]],
  c1: [['weight', 1]], c2: [['fsusp', 1]], c3: [['mono', 2]], c4: [['ride', 3], ['fsusp', 2], ['rsusp', 2], ['weight', 2]],
  b1: [['bcool', 1]], b2: [['discs', 2]], b3: [['bbw', 2], ['discs', 3]],
  t1: [['therm', 1]], t2: [['tmodel', 1], ['therm', 2]], t3: [['therm', 3], ['rims', 2], ['tmodel', 2]],
  r1: [['qc', 1]], r2: [['gearbox', 1]], r3: [['hydraulics', 1], ['elec', 1]], r4: [['hydraulics', 3], ['gearbox', 2]], r5: [['gearbox', 4], ['qc', 3], ['elec', 3]],
  k1: [['guns', 1]], k2: [['crew', 1]], k3: [['jacks', 2]], k4: [['strat', 2]], k5: [['crew', 3], ['guns', 3], ['jacks', 3]],
};
// (the old tree's depth of each part - its price, [0, 4, 6, 9, 13, 18][depth], refunds one still in development - the
// lap time of the parts that had any, and how deep each tier started: its parts down to that depth)
const OLD_DEPTH = { p1: 1, p2: 2, p3: 2, p4: 3, p5: 4, p6: 5, a1: 1, a2: 2, a3: 2, a4: 3, a5: 4, a6: 5, d1: 2, d2: 3, d3: 5, c1: 1, c2: 2, c3: 3, c4: 4,
  b1: 2, b2: 3, b3: 4, t1: 1, t2: 3, t3: 4, r1: 1, r2: 2, r3: 3, r4: 4, r5: 5, k1: 1, k2: 2, k3: 3, k4: 4, k5: 5 };
const OLD_COST = [0, 4, 6, 9, 13, 18];
const OLD_PERF = { p1: 0.0012, p2: 0.0012, p5: 0.0015, p6: 0.002, a1: 0.0012, a2: 0.0012, a3: 0.001, a4: 0.0015, a5: 0.002, a6: 0.0025, c1: 0.0008, c2: 0.001, c3: 0.001, c4: 0.0015, b3: 0.0006, t3: 0.0005 };
const OLD_KIT = [3, 2, 2, 1];
/**
 * A team's development brought up to date, in place -> the team. Old saves: the tier's starting kit, raised to what
 * each old part (team.nodes) becomes; parts still in development refunded at their old price; the last new part
 * renamed. Every save: unknown upgrades dropped (with a warning), levels kept in range, a correlation for every level,
 * the factory's queue checked. Idempotent; never throws on odd data.
 */
export function migrateTeam(team) {
  if (!isObj(team)) return team;
  const tier = tierIx(team.tier);
  if (!isObj(team.levels)) team.levels = startLevels(tier);
  if (Array.isArray(team.nodes)) {
    let old = 0;
    for (const id of team.nodes) {
      const m = MIGRATE[id]; if (!m) { console.warn(`TechTree: unknown old part '${id}' dropped`); continue; }
      for (const [k, lv] of m) team.levels[k] = Math.max(team.levels[k] || 0, lv);
      old += OLD_PERF[id] || 0;
    }
    // (the old pace above the tier's kit against the new: the difference kept, so the car is exactly as quick as it was)
    for (const [k, d] of Object.entries(OLD_DEPTH)) if (d <= OLD_KIT[tier]) old -= OLD_PERF[k] || 0;
    const adj = Math.max(-0.004, Math.min(0.004, old - (perfOf(team.levels) - basePerf(tier))));
    if (Math.abs(adj) > 1e-6) team.perfAdj = Math.round(adj * 1e6) / 1e6; else delete team.perfAdj;
    delete team.nodes;
  }
  for (const k of Object.keys(team.levels)) {
    const u = UP[k], v = Math.floor(+team.levels[k] || 0);
    if (!u) { console.warn(`TechTree: unknown upgrade '${k}' dropped`); delete team.levels[k]; } else if (v <= 0) delete team.levels[k]; else team.levels[k] = Math.min(v, u.levels.length);
  }
  if (team.perfAdj != null && !(Math.abs(+team.perfAdj) <= 0.004)) delete team.perfAdj;
  if (!isObj(team.quality)) team.quality = {};
  for (const k of Object.keys(team.quality)) if (!UP[k] || !Array.isArray(team.quality[k])) delete team.quality[k];
  for (const [k, v] of Object.entries(team.levels)) { const qa = team.quality[k] || (team.quality[k] = []); for (let i = 0; i < v; i++) if (!(+qa[i] > 0)) qa[i] = 1; }
  // (the factory's queue: today's entries kept, old ones refunded - an unknown one at $4M - and anything odd dropped)
  const dev = Array.isArray(team.dev) ? team.dev : []; let back = 0;
  team.dev = [];
  for (const x of dev) {
    const u = isObj(x) ? UP[x.id] : null, lv = Math.floor(+x?.level), own = u ? levelOf(team, x.id) : 0;
    if (u && lv >= 1 && lv <= u.levels.length && (x.re ? lv <= own : lv === own + 1) && !team.dev.some((y) => y.id === x.id)) { x.left = Math.max(1, Math.floor(+x.left) || 1); team.dev.push(x); continue; }
    if (isObj(x) && x.level == null) { const d = OLD_DEPTH[x.id]; if (!d) console.warn(`TechTree: unknown old part '${x.id}' in development refunded`); back += d ? OLD_COST[d] : 4; } else back += +x?.cost || 0;
  }
  if (back) team.budget = r1((+team.budget || 0) + back);
  const ln = team.lastNew;
  if (ln != null && !(isObj(ln) && UP[ln.id] && ln.level >= 1)) { const m = isObj(ln) ? MIGRATE[ln.id] : null; if (m) team.lastNew = { id: m[0][0], level: m[0][1], round: ln.round ?? 0 }; else delete team.lastNew; }
  return team;
}

// ---- words and counts --------------------------------------------------------------------------------------------------------
/** an upgrade's name with its level: 'Floor · Level 3' (just the name without a level; null for no such upgrade) */
export function upgradeName(id, lvl) { const u = UP[id]; if (!u) return null; return lvl ? `${u.name} · Level ${lvl}` : u.name; }
const pc = (v) => { const p = Math.round(Math.abs(v) * 1000) / 10; return `${p % 1 ? p.toFixed(1) : p.toFixed(0)}%`; };
const FX_TXT = {
  perf: (v) => `${v < 0 ? '−' : '+'}${Math.abs(v * 90).toFixed(2)} s a lap`,
  drs: (v) => `DRS sheds ${pc(v)} more drag`,
  ers: (v) => `${pc(v)} more ERS power`,
  erc: (v) => `${pc(v)} more battery energy`,
  brake: (v) => `${pc(v)} more braking force`,
  wear: (v) => `${pc(v)} ${v <= 0 ? 'less' : 'more'} tyre wear`,
  rel: (v) => `${pc(v * 1.5)} lower failure risk`,
  pit: (v) => `stops ${pc(v)} quicker`,
  devCost: (v) => `development ${pc(v)} ${v <= 0 ? 'cheaper' : 'dearer'}`,
  devSpeed: (v) => `${pc(v)} chance a level arrives a race early`,
  quality: (v) => `+${pc(v)} correlation`,
  slots: (v) => `+${v} development slot${v > 1 ? 's' : ''}`,
};
/** what a level does, in words: '+0.05 s a lap, 4% less tyre wear' (perf x 90 = seconds a lap) */
export function fxText(fx) { return Object.keys(FX_TXT).filter((k) => fx?.[k]).map((k) => FX_TXT[k](fx[k])).join(', '); }
/** how far a team is into a branch -> { have: levels on the car, total: levels in it } */
export function branchProgress(team, branch) {
  let have = 0, total = 0;
  for (const u of UPGRADES) if (u.branch === branch) { have += levelOf(team, u.id); total += u.levels.length; }
  return { have, total };
}
/** every upgrade of a branch at its top level */
export function branchMaxed(team, branch) { const p = branchProgress(team, branch); return p.total > 0 && p.have >= p.total; }
/** the car's parts -> { have: levels on the car, total: levels there are } (the eight car branches: the facilities are not parts) */
export function partsCount(team) {
  let have = 0, total = 0;
  for (const b of CAR_BRANCHES) { const p = branchProgress(team, b); have += p.have; total += p.total; }
  return { have, total };
}
